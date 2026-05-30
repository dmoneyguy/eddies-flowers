// POST /api/waitlist — handles waitlist submissions from the Coming Soon page.
//
// Flow:
//   1. Validate payload (Zod): email and/or phone, optional name, honeypot empty
//   2. Rate-limit per source IP (5/hour, in-memory)
//   3. INSERT row into control_plane.eddies_flowers_leads (source='launch_waitlist')
//   4. Fire acknowledgment email (only if email present + Resend configured)
//   5. Fire internal notification email
//   6. Return { ok: true }
//
// Email send failures do NOT roll back the DB insert — the lead is captured
// either way. Resend failures are logged but invisible to the user.

import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { eddiesFlowersLeads } from "@/lib/db/schema";
import { checkRateLimit } from "@/lib/rate-limit";
import { resend, FROM, NOTIFICATION_EMAIL } from "@/lib/email/resend";

export const runtime = "nodejs";

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
  })
  .refine(
    (d) => d.email !== "" || d.phone !== "",
    "Please provide an email or phone number.",
  )
  .refine(
    (d) => d.email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email),
    "Please enter a valid email address.",
  );

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
      consentedToMarketing: true,
      ageGateAttested: false,
      ipAddress: ip === "unknown" ? null : ip,
      userAgent,
      status: "new",
      metadata: {
        path: req.headers.get("referer") || null,
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

  // Outbound emails — best-effort, never block the response.
  const sendOps: Promise<unknown>[] = [];
  if (emailNormalized) {
    sendOps.push(
      resend.emails.send({
        from: FROM,
        to: emailNormalized,
        subject: "You're on the list — Eddie's Flowers",
        text: [
          `Hi${name ? " " + name : ""},`,
          ``,
          `Thanks for joining the Eddie's Flowers founding-members list.`,
          `We'll reach out the day the doors open so you can be among the`,
          `first through.`,
          ``,
          `We're opening Summer 2026 at 23 Rindge State Road, Ashburnham, MA.`,
          ``,
          `If this wasn't you, just ignore this — we won't email you again`,
          `unless you ask.`,
          ``,
          `— Eddie`,
          ``,
          `Eddie's Flowers Dispensary`,
          `MA Licensed Adult-Use Marijuana Retailer #MRN284579 (Provisional)`,
          `https://eddiesflower.com`,
        ].join("\n"),
      }),
    );
  }
  sendOps.push(
    resend.emails.send({
      from: FROM,
      to: NOTIFICATION_EMAIL,
      subject: `New waitlist signup: ${emailNormalized || phoneNormalized || "(unknown)"}`,
      text: [
        `New launch waitlist signup for Eddie's Flowers.`,
        ``,
        `Email:    ${emailNormalized || "(not provided)"}`,
        `Phone:    ${phoneNormalized || "(not provided)"}`,
        `Name:     ${name || "(not provided)"}`,
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
        console.error("[waitlist] email send failed:", r.reason);
      }
    }
  });

  return NextResponse.json({ ok: true });
}
