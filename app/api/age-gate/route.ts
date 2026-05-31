// POST /api/age-gate — records an age-attestation in
// control_plane.eddies_flowers_age_gate_attestations. Idempotent best-effort:
// duplicate tokens are unique-constrained at the DB level (per migration 227);
// if the same token comes through twice we swallow the conflict silently
// rather than 4xx-ing the user.

import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { eddiesFlowersAgeGateAttestations } from "@/lib/db/schema";

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

  try {
    await db.insert(eddiesFlowersAgeGateAttestations).values({
      sessionToken,
      attestedAge21OrOver,
      ipAddress: ip === "unknown" ? null : ip,
      userAgent,
      expiresAt: new Date(expiresAt),
    });
  } catch (err) {
    // Duplicate session_token (unique constraint) is harmless — same user
    // hit the gate again in the same session. Log other failures but never
    // block.
    // eslint-disable-next-line no-console
    console.warn("[age-gate] insert failed (likely duplicate):", err);
  }

  return NextResponse.json({ ok: true });
}
