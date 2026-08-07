// POST /api/product-request — pre-launch customer feedback: locals tell us which
// products & brands they want us to carry. Mirrors /api/waitlist.
//
// Flow:
//   1. Validate payload (Zod): product required, brand/category/email optional, honeypot empty
//   2. Rate-limit per source IP (5/hour, in-memory)
//   3. INSERT row into control_plane.eddies_flowers_leads (source='product_request')
//   4. Fire internal notification to NOTIFICATION_EMAIL (Resend); ack the sender if they left an email
//   5. Return { ok: true }

import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { eddiesFlowersLeads } from "@/lib/db/schema";
import { checkRateLimit } from "@/lib/rate-limit";
import { resend, FROM, NOTIFICATION_EMAIL } from "@/lib/email/resend";

export const runtime = "nodejs";

const schema = z.object({
  product: z.string().min(1).max(300),
  brand: z.string().max(200).optional().nullable(),
  category: z.string().max(80).optional().nullable(),
  email: z.string().email().max(254).optional().or(z.literal("")).nullable(),
  name: z.string().max(120).optional().nullable(),
  phone: z.string().max(40).optional().nullable(),
  website: z.string().max(0).optional().nullable(), // honeypot — must be empty
  marketing_opt_in: z.boolean().optional(), // email marketing; defaults ON when an email is given
  sms_opt_in: z.boolean().optional(), // marketing texts; explicit opt-in, defaults OFF
});

// The wording shown beside the opt-in box, recorded verbatim against every
// row so we can prove what a person agreed to. Never edit this string without
// bumping CONSENT_VERSION — old rows must keep pointing at the old wording.
//
// v3 removed "deals" and "loyalty perks". A licensed marijuana retailer may
// not advertise discounts, coupons, points-based reward systems or customer
// loyalty programmes — 935 CMR 500.105(4)(b)20 — and a consent box promising
// those on eddiesflower.com is advertising them. Do not put them back.
const CONSENT_TEXT =
  "Keep me in the loop — email me news, events, and updates from Eddie's Flowers and the Legacy Operations family of brands that powers this site. I can unsubscribe anytime.";
const SMS_CONSENT_TEXT =
  "Text me too — occasional texts from Eddie's Flowers and Legacy Operations about new arrivals and events. Msg & data rates may apply. Reply STOP to opt out.";
const CONSENT_VERSION = "ef-product-request-v3";

// Overridable so preview/test runs can point at a sink instead of the live
// CRM. Defaults to production — an unset env var must never silently stop
// real submissions reaching Legacy OS.
const CRM_CONTACTS_URL =
  process.env.LEGACY_OS_CRM_URL ||
  "https://legacy-os.thelegacyops.com/api/v1/contacts";

function extractIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please tell us the product or brand you'd like to see." },
      { status: 400 },
    );
  }
  const { product, brand, category, name } = parsed.data;
  const email = (parsed.data.email || "").toLowerCase().trim() || null;
  const phone = parsed.data.phone?.trim() || null;
  const marketingOptIn = parsed.data.marketing_opt_in !== false; // default ON when email present

  const ip = extractIp(req);
  const rl = checkRateLimit(ip);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests from this address. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  const requestSummary = [
    `Product: ${product.trim()}`,
    brand?.trim() ? `Brand: ${brand.trim()}` : null,
    category?.trim() ? `Category: ${category.trim()}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const userAgent = req.headers.get("user-agent");
  try {
    await db.insert(eddiesFlowersLeads).values({
      source: "product_request",
      email,
      phone,
      name: name?.trim() || null,
      message: requestSummary,
      consentedToMarketing: Boolean(email) && marketingOptIn,
      ageGateAttested: false,
      ipAddress: ip === "unknown" ? null : ip,
      userAgent,
      status: "new",
      metadata: {
        product: product.trim(),
        brand: brand?.trim() || null,
        category: category?.trim() || null,
        path: req.headers.get("referer") || null,
        // Consent recorded on the row itself, not only forwarded to the CRM.
        // The leads table is the record we can produce if anyone ever asks
        // what this person agreed to.
        marketing_opt_in: marketingOptIn,
        sms_opt_in: parsed.data.sms_opt_in === true,
        consent_text: CONSENT_TEXT,
        sms_consent_text:
          parsed.data.sms_opt_in === true ? SMS_CONSENT_TEXT : null,
        consent_version: CONSENT_VERSION,
        consent_captured_at: new Date().toISOString(),
      },
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[product-request] DB insert failed:", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong on our end. Please try again." },
      { status: 500 },
    );
  }

  const sends: Promise<unknown>[] = [
    resend.emails.send({
      from: FROM,
      to: NOTIFICATION_EMAIL,
      subject: `Product request: ${product.trim().slice(0, 60)}`,
      text: [
        `New product/brand request for Eddie's Flowers.`,
        ``,
        requestSummary,
        `From:     ${name?.trim() || "(anonymous)"}${email ? ` <${email}>` : ""}`,
        `IP:       ${ip}`,
        `Time:     ${new Date().toISOString()}`,
        ``,
        `View: SELECT * FROM control_plane.eddies_flowers_leads`,
        `        WHERE source = 'product_request' ORDER BY submitted_at DESC LIMIT 50;`,
      ].join("\n"),
    }),
  ];
  if (email) {
    // Capture the contact + consent into the Legacy OS CRM (best-effort).
    sends.push(
      fetch(CRM_CONTACTS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name?.trim() || email,
          email,
          phone: phone || undefined,
          source_site: "eddiesflower.com",
          form_tag: "product-request",
          message: requestSummary,
          marketing_opt_in: marketingOptIn,
          sms_opt_in: parsed.data.sms_opt_in === true,
          consent_text: CONSENT_TEXT,
          consent_version: CONSENT_VERSION,
        }),
      }),
    );
    sends.push(
      resend.emails.send({
        from: FROM,
        to: email,
        subject: "Thanks for the request — Eddie's Flowers",
        text: [
          `Hi${name ? " " + name.trim() : ""},`,
          ``,
          `Thanks for telling us what you'd like to see on our shelves:`,
          `  ${requestSummary}`,
          ``,
          `We're building our opening menu around what our neighbors actually want,`,
          `so this genuinely helps. If we bring it in, we'll let you know.`,
          ``,
          `— Eddie`,
          ``,
          `Eddie's Flowers Dispensary · 23 Rindge State Road, Ashburnham, MA`,
          `https://eddiesflower.com`,
        ].join("\n"),
      }),
    );
  }

  await Promise.allSettled(sends).then((results) => {
    for (const r of results) {
      if (r.status === "rejected") {
        // eslint-disable-next-line no-console
        console.error("[product-request] email send failed:", r.reason);
      }
    }
  });

  return NextResponse.json({ ok: true });
}
