// POST /api/waitlist — Grand Opening invitation list submissions.
//
// Flow:
//   1. Validate payload (Zod): email and/or phone, optional name, honeypot empty
//   2. Rate-limit per source IP (5/hour, in-memory)
//   3. INSERT row into control_plane.eddies_flowers_leads (source='launch_waitlist')
//   4. Forward the contact + consent to the Legacy OS CRM (best-effort)
//   5. Fire acknowledgment email (only if email present + Resend configured)
//   6. Fire internal notification email
//   7. Return { ok: true }
//
// CONSENT. This route records what the person actually ticked. It does not
// assume consent, because the TCPA requires prior express WRITTEN consent for
// marketing texts and a record of it. We store:
//   consentedToMarketing — the email opt-in (defaults ON, opt-out model)
//   metadata.sms_opt_in  — the text opt-in (affirmative only, defaults OFF)
//   metadata.consent_text / consent_version — the exact wording shown, so we
//   can prove later what was agreed to. Never change CONSENT_TEXT without
//   bumping CONSENT_VERSION; old rows must keep pointing at the old wording.
//
// A phone number with no SMS opt-in is stored but must never be texted for
// marketing. Downstream systems key on metadata.sms_opt_in, not on the
// presence of a phone number.
//
// Email send failures do NOT roll back the DB insert — the lead is captured
// either way. Resend failures are logged but invisible to the user.

import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { eddiesFlowersLeads } from "@/lib/db/schema";
import { checkRateLimit } from "@/lib/rate-limit";
import { resend, FROM, NOTIFICATION_RECIPIENTS } from "@/lib/email/resend";

export const runtime = "nodejs";

const CONSENT_TEXT =
  "Keep me in the loop — email me news, events, and updates from Eddie's Flowers and the Legacy Operations family of brands that powers this site. I can unsubscribe anytime.";
const SMS_CONSENT_TEXT =
  "Text me too — occasional texts from Eddie's Flowers and Legacy Operations about our opening, drops and events. Msg & data rates may apply. Reply STOP to opt out.";
const CONSENT_VERSION = "ef-waitlist-v2";

const schema = z
  .object({
    email: z
      .string()
      .max(254)
      .optional()
      .nullable()
      .transform((v) => v?.trim() || ""),
    phone: z
      .string()
      .max(20)
      .optional()
      .nullable()
      .transform((v) => v?.trim() || ""),
    name: z
      .string()
      .max(120)
      .optional()
      .nullable()
      .transform((v) => v?.trim() || ""),
    website: z.string().max(0).optional().nullable(), // honeypot — must be empty
    marketing_opt_in: z.boolean().optional(), // email; defaults ON
    sms_opt_in: z.boolean().optional(), // texts; explicit opt-in only
  })
  .refine(
    (d) => d.email !== "" || d.phone !== "",
    "Please provide an email or phone number.",
  )
  .refine(
    (d) => d.email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email),
    "Please enter a valid email address.",
  )
  .refine(
    // Phone-only signups must carry an SMS opt-in, or we have no lawful way
    // to reach them at all and would be holding a number for nothing.
    (d) => d.email !== "" || d.sms_opt_in === true,
    "Please tick the text box so we can reach you, or add an email address.",
  );

/** Forward the contact + consent into the Legacy OS CRM (best-effort, server-to-server). */
async function forwardToCrm(input: {
  name: string | null;
  email: string | null;
  phone: string | null;
  marketingOptIn: boolean;
  smsOptIn: boolean;
}): Promise<void> {
  try {
    // Overridable so preview/test runs can point at a sink instead of the
    // live CRM. Defaults to production — an unset env var must never silently
    // stop real submissions reaching Legacy OS.
    const crmUrl =
      process.env.LEGACY_OS_CRM_URL ||
      "https://legacy-os.thelegacyops.com/api/v1/contacts";
    await fetch(crmUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: input.name || input.email || input.phone,
        email: input.email || undefined,
        phone: input.phone || undefined,
        source_site: "eddiesflower.com",
        form_tag: "waitlist",
        marketing_opt_in: input.marketingOptIn,
        sms_opt_in: input.smsOptIn,
        consent_text: CONSENT_TEXT,
        consent_version: CONSENT_VERSION,
      }),
    });
  } catch {
    // best-effort — never block the submission
  }
}

function extractIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") || "unknown";
}

function normalizePhone(raw: string): string {
  // Strip everything except digits and a leading +; keep submission readable
  // in the dashboard, leave full normalization for a downstream job.
  return raw.replace(/[^\d+]/g, "");
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check your details and try again." },
      { status: 400 },
    );
  }
  const { email: emailRaw, name, phone: phoneRaw } = parsed.data;
  const emailNormalized = emailRaw.toLowerCase();
  const phoneNormalized = phoneRaw ? normalizePhone(phoneRaw) : "";
  const marketingOptIn = parsed.data.marketing_opt_in !== false; // default ON
  const smsOptIn = parsed.data.sms_opt_in === true; // affirmative only

  const ip = extractIp(req);
  const rl = checkRateLimit(ip);
  if (!rl.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "Too many submissions from this address. Please try again later.",
      },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  const userAgent = req.headers.get("user-agent");
  try {
    await db.insert(eddiesFlowersLeads).values({
      source: "launch_waitlist",
      email: emailNormalized || null,
      phone: phoneNormalized || null,
      name: name || null,
      consentedToMarketing: marketingOptIn,
      ageGateAttested: false,
      ipAddress: ip === "unknown" ? null : ip,
      userAgent,
      status: "new",
      metadata: {
        path: req.headers.get("referer") || null,
        marketing_opt_in: marketingOptIn,
        sms_opt_in: smsOptIn,
        consent_text: CONSENT_TEXT,
        sms_consent_text: smsOptIn ? SMS_CONSENT_TEXT : null,
        consent_version: CONSENT_VERSION,
        consent_captured_at: new Date().toISOString(),
      },
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[waitlist] DB insert failed:", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong on our end. Please try again." },
      { status: 500 },
    );
  }

  // Outbound side-effects — best-effort, never block the response.
  const sendOps: Promise<unknown>[] = [
    forwardToCrm({
      name: name || null,
      email: emailNormalized || null,
      phone: phoneNormalized || null,
      marketingOptIn,
      smsOptIn,
    }),
  ];

  if (emailNormalized) {
    sendOps.push(
      resend.emails.send({
        from: FROM,
        to: emailNormalized,
        subject: "Your Grand Opening invitation — Eddie's Flowers",
        text: [
          `Hi${name ? " " + name : ""},`,
          ``,
          `Thanks for putting your name down. You're on the founding-members`,
          `list, which means you'll get the date and time of our Grand Opening`,
          `before we announce it anywhere else.`,
          ``,
          `We're opening at 23 Rindge State Road, Ashburnham, MA.`,
          ``,
          `If this wasn't you, just ignore this — we won't email you again`,
          `unless you ask.`,
          ``,
          `— Eddie`,
          ``,
          `Eddie's Flowers Dispensary`,
          `MA Licensed Adult-Use Marijuana Retailer #MR284579 (Provisional)`,
          `https://www.eddiesflower.com`,
        ].join("\n"),
      }),
    );
  }

  sendOps.push(
    resend.emails.send({
      from: FROM,
      to: NOTIFICATION_RECIPIENTS,
      subject: `New Grand Opening invitation: ${emailNormalized || phoneNormalized || "(unknown)"}`,
      text: [
        `New Grand Opening invitation request for Eddie's Flowers.`,
        ``,
        `Email:    ${emailNormalized || "(not provided)"}`,
        `Phone:    ${phoneNormalized || "(not provided)"}`,
        `Name:     ${name || "(not provided)"}`,
        `Email OK: ${marketingOptIn ? "yes" : "NO — do not email marketing"}`,
        `Text OK:  ${smsOptIn ? "yes" : "NO — do not text this number"}`,
        `IP:       ${ip}`,
        `Agent:    ${userAgent || "(unknown)"}`,
        `Source:   launch_waitlist`,
        `Time:     ${new Date().toISOString()}`,
      ].join("\n"),
    }),
  );

  await Promise.allSettled(sendOps).then((results) => {
    for (const r of results) {
      if (r.status === "rejected") {
        // eslint-disable-next-line no-console
        console.error("[waitlist] side-effect failed:", r.reason);
      }
    }
  });

  return NextResponse.json({ ok: true });
}
