// POST /api/lead — handles careers, wholesale, and press inquiries.
// Same defensive shape as /api/waitlist: validate, rate-limit, insert, notify.

import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { eddiesFlowersLeads } from "@/lib/db/schema";
import { checkRateLimit } from "@/lib/rate-limit";
import { resend, FROM, NOTIFICATION_RECIPIENTS } from "@/lib/email/resend";

export const runtime = "nodejs";

const sourceEnum = z.enum(["careers", "wholesale_inquiry", "contact_form"]);

const schema = z
  .object({
    source: sourceEnum,
    name: z.string().min(1).max(120).transform((v) => v.trim()),
    email: z.string().max(254).transform((v) => v.trim().toLowerCase()),
    phone: z.string().max(20).optional().nullable().transform((v) => v?.trim() || ""),
    org: z.string().max(200).optional().nullable().transform((v) => v?.trim() || ""),
    message: z.string().max(2000).optional().nullable().transform((v) => v?.trim() || ""),
    website: z.string().max(0).optional().nullable(),
    extras: z.record(z.string(), z.unknown()).optional().nullable(),
  })
  .refine(
    (d) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email),
    "Please enter a valid email address.",
  );

function extractIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") || "unknown";
}

function normalizePhone(raw: string): string {
  return raw.replace(/[^\d+]/g, "");
}

const SOURCE_LABELS: Record<z.infer<typeof sourceEnum>, string> = {
  careers: "Careers inquiry",
  wholesale_inquiry: "Wholesale inquiry",
  contact_form: "Press / general inquiry",
};

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
      { ok: false, error: "Please check your details and try again." },
      { status: 400 },
    );
  }
  const { source, name, email, phone, org, message, extras } = parsed.data;
  const phoneNormalized = phone ? normalizePhone(phone) : "";

  const ip = extractIp(req);
  const rl = checkRateLimit(ip);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions from this address. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  const userAgent = req.headers.get("user-agent");
  try {
    await db.insert(eddiesFlowersLeads).values({
      source,
      email,
      phone: phoneNormalized || null,
      name,
      message: message || null,
      consentedToMarketing: false,
      ageGateAttested: false,
      ipAddress: ip === "unknown" ? null : ip,
      userAgent,
      status: "new",
      metadata: {
        org: org || null,
        path: req.headers.get("referer") || null,
        ...(extras && typeof extras === "object" ? extras : {}),
      },
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[lead] DB insert failed:", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong on our end. Please try again." },
      { status: 500 },
    );
  }

  const sendOps: Promise<unknown>[] = [
    resend.emails.send({
      from: FROM,
      to: email,
      subject: `We got your message — Eddie's Flowers`,
      text: [
        `Hi ${name},`,
        ``,
        `Thanks for reaching out. We received your ${SOURCE_LABELS[source].toLowerCase()} and`,
        `someone from the Eddie's Flowers team will be in touch within a few days.`,
        ``,
        `— The Eddie's Flowers Team`,
        ``,
        `Eddie's Flowers Dispensary`,
        `MA Licensed Adult-Use Marijuana Retailer #MRN284579 (Provisional)`,
        `https://www.eddiesflower.com`,
      ].join("\n"),
    }),
    resend.emails.send({
      from: FROM,
      to: NOTIFICATION_RECIPIENTS,
      subject: `[${SOURCE_LABELS[source]}] ${name} <${email}>`,
      text: [
        `New ${SOURCE_LABELS[source].toLowerCase()} from the Eddie's Flowers site.`,
        ``,
        `Name:     ${name}`,
        `Email:    ${email}`,
        `Phone:    ${phoneNormalized || "(not provided)"}`,
        `Org:      ${org || "(not provided)"}`,
        `Source:   ${source}`,
        `IP:       ${ip}`,
        `Agent:    ${userAgent || "(unknown)"}`,
        `Time:     ${new Date().toISOString()}`,
        ``,
        `Message:`,
        `${message || "(no message)"}`,
        ``,
        ...(extras && typeof extras === "object"
          ? [`Extras:`, JSON.stringify(extras, null, 2)]
          : []),
      ].join("\n"),
    }),
  ];

  await Promise.allSettled(sendOps).then((results) => {
    for (const r of results) {
      if (r.status === "rejected") {
        // eslint-disable-next-line no-console
        console.error("[lead] email send failed:", r.reason);
      }
    }
  });

  return NextResponse.json({ ok: true });
}
