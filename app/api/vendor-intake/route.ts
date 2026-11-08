// POST /api/vendor-intake — vendor pitches for opening-day shelf (the /wholesale form).
//
// Saves one row to control_plane.eddies_vendor_intakes and one row per SKU to control_plane.eddies_vendor_products
// (migration 758 in legacy-ops-control-plane) through Legacy OS (POST /api/v1/eddies-forms/vendor-intake), which
// writes both in a single statement, so a pitch never lands without its products. This site holds no database
// credential (lib/legacy-os.ts). The Legacy OS buying desk reads these rows and prices every SKU against the shelves
// within 20 miles. Same defensive shape as /api/lead: honeypot, validate, rate-limit, save, then acknowledge + notify.
// Unknown stays null: a blank budget is "not stated", never $0.

import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { saveToLegacyOs, visitorIp, visitorUserAgent } from "@/lib/legacy-os";
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

/** migration 758: eddies_vendor_products.brand is 1–120 characters. */
const PRODUCT_BRAND_MAX = 120;

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
    brand: (p.brand ?? d.brand_names[0] ?? d.company_name).slice(0, PRODUCT_BRAND_MAX),
  }));
  const categories = Array.from(new Set([...d.categories, ...products.map((p) => p.form)]));
  const userAgent = req.headers.get("user-agent");

  // Named field by field (not a spread of `d`) so the honeypot and anything else the form adds later never travel.
  const result = await saveToLegacyOs("vendor-intake", {
    company_name: d.company_name,
    brand_names: d.brand_names,
    licence_numbers: d.licence_numbers,
    licence_types: d.licence_types,
    social_equity_tags: d.social_equity_tags,
    contact_name: d.contact_name,
    contact_title: d.contact_title,
    contact_email: d.contact_email,
    contact_phone: d.contact_phone,
    website: d.website,
    menu_url: d.menu_url,
    categories,
    reciprocal_interest: d.reciprocal_interest ?? null,
    reciprocal_options: d.reciprocal_options,
    reciprocal_notes: d.reciprocal_notes,
    marketing_support: d.marketing_support,
    launch_budget_usd: d.launch_budget_usd,
    monthly_budget_usd: d.monthly_budget_usd,
    launch_discount_pct: d.launch_discount_pct,
    marketing_notes: d.marketing_notes,
    payment_terms: d.payment_terms,
    moq_notes: d.moq_notes,
    delivery_notes: d.delivery_notes,
    samples_available: d.samples_available ?? null,
    open_house_plan: d.open_house_plan ?? null,
    notes: d.notes,
    products: products.map((p) => ({
      brand: p.brand,
      product_name: p.product_name,
      form: p.form,
      size_label: p.size_label,
      size_grams: p.size_grams,
      thc_mg: p.thc_mg,
      thc_pct: p.thc_pct,
      cbd_pct: p.cbd_pct,
      strain_type: p.strain_type ?? null,
      effects: p.effects,
      wholesale_price: p.wholesale_price,
      suggested_retail: p.suggested_retail,
      case_pack: p.case_pack,
      notes: p.notes,
    })),
    ip_address: visitorIp(ip),
    user_agent: visitorUserAgent(userAgent),
    metadata: { path: req.headers.get("referer") || null, form_version: 1 },
  });
  const saved = result.saved;
  const intakeId = result.saved ? result.id : null;
  if (!saved) {
    // Keep going: the CRM + the notification (with the full payload to replay) still capture it (lib/fallback.ts).
    // eslint-disable-next-line no-console
    console.error("[vendor-intake] Legacy OS save failed — falling back to CRM + email");
  }
  // Everything needed to replay this pitch into the desk tables when the Legacy OS write did not land.
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
          : `NOT on the buying desk yet — the Legacy OS form intake did not accept the write. Replay JSON:`,
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
