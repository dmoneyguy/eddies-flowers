// POST /api/waitlist — handles email-capture submissions from the Coming Soon page.
//
// Flow:
//   1. Validate payload (Zod): valid email, optional name, honeypot empty
//   2. Rate-limit per source IP (5/hour, in-memory)
//   3. INSERT row into control_plane.eddies_flowers_leads (source='launch_waitlist')
//   4. Fire acknowledgment email to submitter (Resend)
//   5. Fire internal notification to NOTIFICATION_EMAIL (Resend)
//   6. Return { ok: true }
//
// Errors are logged but the user-facing message stays generic to avoid
// information leakage about email duplicates / database state.

import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { eddiesFlowersLeads } from "@/lib/db/schema";
import { checkRateLimit } from "@/lib/rate-limit";
import { resend, FROM, NOTIFICATION_EMAIL } from "@/lib/email/resend";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().email().max(254),
  name: z.string().max(120).optional().nullable(),
  website: z.string().max(0).optional().nullable(), // honeypot — must be empty
});

function extractIp(req: NextRequest): string {
  // Vercel forwards the client IP in x-forwarded-for (comma-separated chain).
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest) {
  // 1. Parse + validate body
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
    // Honeypot fail OR validation fail — return generic to not tip off bots
    return NextResponse.json(
      { ok: false, error: "Please check your email and try again." },
      { status: 400 },
    );
  }
  const { email, name } = parsed.data;
  const emailNormalized = email.toLowerCase().trim();

  // 2. Rate limit per IP
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

  // 3. Insert lead row. We do NOT enforce email-uniqueness in the schema (per the
  // spec — same person joining twice from different sessions is a no-op signal,
  // not an error). The lower(email) index makes the eventual dedupe query fast.
  const userAgent = req.headers.get("user-agent");
  try {
    await db.insert(eddiesFlowersLeads).values({
      source: "launch_waitlist",
      email: emailNormalized,
      name: name?.trim() || null,
      consentedToMarketing: true, // implied by submitting the form per microcopy
      ageGateAttested: false,
      ipAddress: ip === "unknown" ? null : ip,
      userAgent,
      status: "new",
      metadata: {
        path: req.headers.get("referer") || null,
      },
    });
  } catch (err) {
    // Failure to insert is fatal — don't pretend success. Log server-side.
    // eslint-disable-next-line no-console
    console.error("[waitlist] DB insert failed:", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong on our end. Please try again." },
      { status: 500 },
    );
  }

  // 4 + 5. Send emails. Failures here do NOT roll back the DB insert — the
  // lead is captured either way; we just lose the acknowledgment/notification
  // for this one submission. Log loud so we notice in Vercel logs.
  await Promise.allSettled([
    resend.emails.send({
      from: FROM,
      to: emailNormalized,
      subject: "We'll be in touch — Eddie's Flowers",
      text: [
        `Hi${name ? " " + name.trim() : ""},`,
        ``,
        `Thanks for putting your name down. We're putting the finishing touches`,
        `on Eddie's Flowers Dispensary at 23 Rindge State Road, Ashburnham. I'll`,
        `email you the day the doors open.`,
        ``,
        `If this signup wasn't you, just ignore this — we won't email you again`,
        `unless you ask us to.`,
        ``,
        `— Eddie`,
        ``,
        `Eddie's Flowers Dispensary`,
        `MA Licensed Adult-Use Marijuana Retailer #MRN284579 (Provisional)`,
        `https://eddiesflower.com`,
      ].join("\n"),
    }),
    resend.emails.send({
      from: FROM,
      to: NOTIFICATION_EMAIL,
      subject: `New waitlist signup: ${emailNormalized}`,
      text: [
        `New launch waitlist signup for Eddie's Flowers.`,
        ``,
        `Email:    ${emailNormalized}`,
        `Name:     ${name?.trim() || "(not provided)"}`,
        `IP:       ${ip}`,
        `Agent:    ${userAgent || "(unknown)"}`,
        `Source:   launch_waitlist`,
        `Time:     ${new Date().toISOString()}`,
        ``,
        `View leads: SELECT * FROM control_plane.eddies_flowers_leads`,
        `             WHERE source = 'launch_waitlist' ORDER BY submitted_at DESC LIMIT 20;`,
      ].join("\n"),
    }),
  ]).then((results) => {
    for (const r of results) {
      if (r.status === "rejected") {
        // eslint-disable-next-line no-console
        console.error("[waitlist] email send failed:", r.reason);
      }
    }
  });

  return NextResponse.json({ ok: true });
}
