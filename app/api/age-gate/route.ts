// POST /api/age-gate — records an age-attestation in
// control_plane.eddies_flowers_age_gate_attestations, through Legacy OS
// (POST /api/v1/eddies-forms/age-gate; this site holds no database credential,
// lib/legacy-os.ts). Best-effort: localStorage is the source of truth for the
// visitor, so a failed save is logged and never blocks them. A repeat token is
// stored again (migration 227 indexes session_token but does not make it unique).

import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { saveToLegacyOs, visitorIp, visitorUserAgent } from "@/lib/legacy-os";

export const runtime = "nodejs";

const schema = z.object({
  sessionToken: z.string().min(8).max(128),
  attestedAge21OrOver: z.boolean(),
  expiresAt: z.string().datetime(),
});

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
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const { sessionToken, attestedAge21OrOver, expiresAt } = parsed.data;

  const ip = extractIp(req);
  const userAgent = req.headers.get("user-agent");

  const { saved } = await saveToLegacyOs("age-gate", {
    session_token: sessionToken,
    attested_age_21_or_over: attestedAge21OrOver,
    expires_at: expiresAt,
    ip_address: visitorIp(ip),
    user_agent: visitorUserAgent(userAgent),
  });
  if (!saved) {
    // Never block the visitor; the failure is in the logs (lib/legacy-os.ts logs the status).
    // eslint-disable-next-line no-console
    console.warn("[age-gate] attestation not saved to Legacy OS");
  }

  return NextResponse.json({ ok: true });
}
