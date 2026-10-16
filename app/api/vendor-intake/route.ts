// POST /api/vendor-intake — vendor pitches for opening-day shelf (the /wholesale form).
//
// Writes one row to control_plane.eddies_vendor_intakes and one row per SKU to control_plane.eddies_vendor_products
// (migration 758 in legacy-ops-control-plane) in a single statement, so a pitch never lands without its products.
// The Legacy OS buying desk reads these rows and prices every SKU against the shelves within 20 miles.
// Same defensive shape as /api/lead: honeypot, validate, rate-limit, insert, then acknowledge + notify.
// Unknown stays null: a blank budget is "not stated", never $0.

import { NextResponse, type NextRequest } from "next/server";
import { sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { resend, FROM, NOTIFICATION_RECIPIENTS } from "@/lib/email/resend";
import { saveToCrm, anyLanded, NOT_SAVED_PREFIX } from "@/lib/fallback";
import {
  FORMS,
  EFFECTS,
  LICENCE_TYPES,
  EQUITY_TAGS,
  RECIPROCAL_OPTIONS,
  MARKETING_SUPPORT,
  labelFor,
} from "@/lib/vendor-intake";

export const runtime = "nodejs";

const DESK_URL = "https://legacy-os.thelegacyops.com/exec/projects/eddies-flowers/buying?tab=vendors";

const optText = (max: number) =>
  z
    .string()
    .max(max)
    .optional()
    .nullable()
    .transform((v) => {
      const t = v?.trim();
      return t ? t : null;
    });

const optMoney = z
  .union([z.number(), z.string(), z.null()])
  .optional()
  .transform((v, ctx) => {
    if (v === null || v === undefined || v === "") return null;
    const n = typeof v === "number" ? v : Number(String(v).replace(/[$,\s]/g, ""));
    if (!Number.isFinite(n) || n < 0 || n > 10_000_000) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please enter a valid amount." });
      return z.NEVER;
    }
    return Math.round(n * 100) / 100;
  });

const listOf = <T extends readonly [string, ...string[]]>(values: T, max = 20) =>
  z.array(z.enum(values)).max(max).optional().default([]);

const nameList = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((v) => {
    const raw = Array.isArray(v) ? v : (v ?? "").split(/[,;\n]/);
    return Array.from(new Set(raw.map((s) => s.trim()).filter(Boolean))).slice(0, 20).map((s) => s.slice(0, 120));
  });

const productSchema = z.object({
  brand: optText(120),
  product_name: z.string().trim().min(1, "Each product needs a name.").max(200),
  form: z.enum(FORMS),
  size_grams: optMoney,
  thc_mg: optMoney,
  thc_pct: optMoney.refine((v) => v === null || v <= 100, "THC % must be 0–100."),
  cbd_pct: optMoney.refine((v) => v === null || v <= 100, "CBD % must be 0–100."),
  size_label: optText(60),
  strain_type: z.enum(["indica", "sativa", "hybrid", "cbd", "balanced_ratio"]).optional().nullable(),
  effects: listOf(EFFECTS, 4),
  wholesale_price: optMoney,
  suggested_retail: optMoney,
  case_pack: z
    .union([z.number(), z.string(), z.null()])
    .optional()
    .transform((v) => {
      const n = typeof v === "number" ? v : Number.parseInt(String(v ?? ""), 10);
      return Number.isFinite(n) && n > 0 && n < 100000 ? Math.round(n) : null;
    }),
  notes: optText(500),
});

const schema = z.object({
  company_name: z.string().trim().min(1, "Company name is required.").max(200),
  brand_names: nameList,
  licence_numbers: nameList,
  licence_types: listOf(LICENCE_TYPES),
  social_equity_tags: listOf(EQUITY_TAGS),
  contact_name: z.string().trim().min(1, "Your name is required.").max(120),
  contact_title: optText(120),
  contact_email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254)
    .refine((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e), "Please enter a valid email address."),
  contact_phone: optText(30),
  website: optText(300),
  menu_url: optText(500),
  categories: listOf(FORMS),
  reciprocal_interest: z.enum(["yes", "maybe", "no"]).optional().nullable(),
  reciprocal_options: listOf(RECIPROCAL_OPTIONS),
  reciprocal_notes: optText(2000),
  marketing_support: listOf(MARKETING_SUPPORT),
  launch_budget_usd: optMoney,
  monthly_budget_usd: optMoney,
  launch_discount_pct: optMoney.refine((v) => v === null || v <= 100, "Launch discount must be 0–100%."),
  marketing_notes: optText(2000),
  payment_terms: optText(200),
  moq_notes: optText(500),
  delivery_notes: optText(500),
  samples_available: z.boolean().optional().nullable(),
  open_house_plan: z.enum(["attending", "teams", "neither"]).optional().nullable(),
  notes: optText(4000),
  products: z.array(productSchema).max(40).optional().default([]),
  // Honeypot — real people never see or fill it.
  nickname: z.string().max(0).optional().nullable(),
});

function extractIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") || "unknown";
}

function rowsOf(result: unknown): Array<Record<string, unknown>> {
  if (Array.isArray(result)) return result as Array<Record<string, unknown>>;
  const rows = (result as { rows?: unknown } | null)?.rows;
  return Array.isArray(rows) ? (rows as Array<Record<string, unknown>>) : [];
}

const money = (n: number | null) => (n === null ? "not stated" : `$${n.toLocaleString("en-US")}`);

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  if (body && typeof body === "object" && (body as { nickname?: unknown }).nickname) {
    // Bot filled the honeypot: pretend success, store nothing.
    return NextResponse.json({ ok: true });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message;
    return NextResponse.json(
      { ok: false, error: first && !first.startsWith("Invalid") ? first : "Please check the form and try again." },
      { status: 400 },
    );
  }
  const d = parsed.data;

  const ip = extractIp(req);
  const rl = checkRateLimit(`vendor:${ip}`);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions from this address. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  const products = d.products.map((p) => ({
    ...p,
    brand: p.brand ?? d.brand_names[0] ?? d.company_name,
  }));
  const categories = Array.from(new Set([...d.categories, ...products.map((p) => p.form)]));
  const userAgent = req.headers.get("user-agent");
  const arr = (xs: readonly string[]) => sql`ARRAY(SELECT jsonb_array_elements_text(${JSON.stringify(xs)}::jsonb))::text[]`;

  let intakeId: string | null = null;
  let saved = true;
  try {
    const result = await db.execute(sql`
      WITH i AS (
        INSERT INTO control_plane.eddies_vendor_intakes (
          source, company_name, brand_names, licence_numbers, licence_types, social_equity_tags,
          contact_name, contact_title, contact_email, contact_phone, website, menu_url, categories,
          reciprocal_interest, reciprocal_options, reciprocal_notes,
          marketing_support, launch_budget_usd, monthly_budget_usd, launch_discount_pct, marketing_notes,
          payment_terms, moq_notes, delivery_notes, samples_available, open_house_plan, notes,
          ip_address, user_agent, metadata
        ) VALUES (
          'website', ${d.company_name}, ${arr(d.brand_names)}, ${arr(d.licence_numbers)}, ${arr(d.licence_types)},
          ${arr(d.social_equity_tags)}, ${d.contact_name}, ${d.contact_title}, ${d.contact_email}, ${d.contact_phone},
          ${d.website}, ${d.menu_url}, ${arr(categories)},
          ${d.reciprocal_interest ?? null}, ${arr(d.reciprocal_options)}, ${d.reciprocal_notes},
          ${arr(d.marketing_support)}, ${d.launch_budget_usd}, ${d.monthly_budget_usd}, ${d.launch_discount_pct},
          ${d.marketing_notes}, ${d.payment_terms}, ${d.moq_notes}, ${d.delivery_notes}, ${d.samples_available ?? null},
          ${d.open_house_plan ?? null}, ${d.notes}, ${ip === "unknown" ? null : ip}::inet, ${userAgent},
          ${JSON.stringify({ path: req.headers.get("referer") || null, form_version: 1 })}::jsonb
        )
        RETURNING id
      ), p AS (
        INSERT INTO control_plane.eddies_vendor_products (
          intake_id, brand, product_name, form, size_label, size_grams, thc_mg, thc_pct, cbd_pct, strain_type,
          effects, wholesale_price, suggested_retail, case_pack, notes
        )
        SELECT i.id, x.brand, x.product_name, x.form, x.size_label, x.size_grams, x.thc_mg, x.thc_pct, x.cbd_pct,
               x.strain_type, ARRAY(SELECT jsonb_array_elements_text(COALESCE(x.effects, '[]'::jsonb)))::text[],
               x.wholesale_price, x.suggested_retail, x.case_pack, x.notes
          FROM i, jsonb_to_recordset(${JSON.stringify(products)}::jsonb) AS x(
            brand text, product_name text, form text, size_label text, size_grams numeric, thc_mg numeric,
            thc_pct numeric, cbd_pct numeric, strain_type text, effects jsonb, wholesale_price numeric,
            suggested_retail numeric, case_pack integer, notes text
          )
        RETURNING 1
      )
      SELECT (SELECT id::text FROM i) AS id, (SELECT count(*) FROM p)::int AS products
    `);
    intakeId = (rowsOf(result)[0]?.id as string | undefined) ?? null;
  } catch (err) {
    // Keep going: the CRM + the notification (with the full payload to replay) still capture it (lib/fallback.ts).
    saved = false;
    // eslint-disable-next-line no-console
    console.error("[vendor-intake] DB insert failed — falling back to CRM + email:", err);
  }
  // Everything needed to replay this pitch into the desk tables once the site's DB write works again.
  const replayJson = JSON.stringify({ ...d, products, categories, received_at: new Date().toISOString() });

  const productLines = products.map((p, i) => {
    const size = p.size_label || (p.thc_mg !== null ? `${p.thc_mg}mg` : p.size_grams !== null ? `${p.size_grams}g` : "");
    return `  ${i + 1}. ${p.brand} — ${p.product_name} (${labelFor(p.form)}${size ? `, ${size}` : ""}) · wholesale ${money(p.wholesale_price)}${p.suggested_retail !== null ? ` · SRP ${money(p.suggested_retail)}` : ""}`;
  });

  const sendOps: Promise<unknown>[] = [
    resend.emails.send({
      from: FROM,
      to: d.contact_email,
      subject: `We got your pitch — Eddie's Flowers`,
      text: [
        `Hi ${d.contact_name},`,
        ``,
        `Thanks for pitching ${d.company_name} for Eddie's Flowers. Our buying team has your`,
        `${products.length ? `${products.length} product${products.length === 1 ? "" : "s"} and ` : ""}details and will be in touch.`,
        ``,
        d.open_house_plan === "attending"
          ? `See you at the vendor open house — Monday 10/19, 12–5 PM, Ashburnham MA.`
          : `Our vendor open house is Monday 10/19, 12–5 PM in Ashburnham MA if you'd like to stop by.`,
        ``,
        `— The Eddie's Flowers Team`,
        ``,
        `Eddie's Flowers Dispensary`,
        `MA Licensed Adult-Use Marijuana Retailer #MR284579 (Provisional)`,
        `https://www.eddiesflower.com`,
      ].join("\n"),
    }),
    resend.emails.send({
      from: FROM,
      to: NOTIFICATION_RECIPIENTS,
      replyTo: d.contact_email,
      subject: `${saved ? "" : NOT_SAVED_PREFIX}[Vendor pitch] ${d.company_name} — ${products.length} SKU${products.length === 1 ? "" : "s"}`,
      text: [
        `New vendor pitch from eddiesflower.com/wholesale.`,
        ``,
        `Company:   ${d.company_name}`,
        `Brands:    ${d.brand_names.join(", ") || "(not listed)"}`,
        `Licences:  ${[...d.licence_numbers, ...d.licence_types.map(labelFor)].join(" · ") || "(not listed)"}`,
        `Equity:    ${d.social_equity_tags.map(labelFor).join(", ") || "(not stated)"}`,
        `Contact:   ${d.contact_name}${d.contact_title ? `, ${d.contact_title}` : ""} <${d.contact_email}> ${d.contact_phone ?? ""}`,
        `Open house: ${d.open_house_plan ? labelFor(d.open_house_plan) : "(not stated)"}`,
        ``,
        `RECIPROCAL: ${d.reciprocal_interest ?? "not stated"}${d.reciprocal_options.length ? ` — ${d.reciprocal_options.map(labelFor).join(", ")}` : ""}`,
        d.reciprocal_notes ? `  ${d.reciprocal_notes}` : ``,
        `MARKETING: ${d.marketing_support.map(labelFor).join(", ") || "none stated"}`,
        `  Launch budget ${money(d.launch_budget_usd)} · monthly ${money(d.monthly_budget_usd)} · launch discount ${d.launch_discount_pct === null ? "not stated" : `${d.launch_discount_pct}%`}`,
        d.marketing_notes ? `  ${d.marketing_notes}` : ``,
        `TERMS: ${d.payment_terms ?? "not stated"} · MOQ ${d.moq_notes ?? "not stated"} · samples ${d.samples_available === null || d.samples_available === undefined ? "not stated" : d.samples_available ? "yes" : "no"}`,
        ``,
        `PRODUCTS (${products.length}):`,
        ...(productLines.length ? productLines : ["  (none listed — ask for their menu with wholesale prices)"]),
        ``,
        d.notes ? `Notes: ${d.notes}` : ``,
        saved
          ? `Priced against every shelf within 20 miles on the buying desk:`
          : `NOT on the buying desk yet — the site could not write to the database. Replay JSON:`,
        saved ? `${DESK_URL}${intakeId ? `#${intakeId}` : ""}` : replayJson,
      ]
        .filter((l, i, a) => !(l === "" && a[i - 1] === ""))
        .join("\n"),
    }),
  ];

  if (!saved) {
    sendOps.push(
      saveToCrm({
        name: d.contact_name,
        email: d.contact_email,
        phone: d.contact_phone,
        company: d.company_name,
        message: `Vendor pitch (not yet on the buying desk): ${products.length} SKUs. ${replayJson}`,
        formTag: "vendor-intake",
      }),
    );
  }

  const results = await Promise.allSettled(sendOps);
  for (const r of results) {
    if (r.status === "rejected") {
      // eslint-disable-next-line no-console
      console.error("[vendor-intake] side effect failed:", r.reason);
    }
  }
  // Without the DB row, the team notification (index 1) or the CRM save (index 2) must have landed.
  if (!saved && !anyLanded(results.slice(1))) {
    return NextResponse.json(
      { ok: false, error: "Something went wrong on our end. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, id: intakeId, saved });
}
