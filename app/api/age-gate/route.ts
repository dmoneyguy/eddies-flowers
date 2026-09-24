// POST /api/age-gate — records an age attestation in
// control_plane.eddies_flowers_age_gate_attestations and sets the ef_age_ok
// cookie that proxy.ts checks. Idempotent best-effort: duplicate tokens are
// unique-constrained at the DB level (per migration 227); if the same token
// comes through twice we swallow the conflict silently rather than 4xx-ing
// the user.
//
// Refuses (403, no cookie) when the browser carries ef_age_denied=1 — the
// visitor said "I'm under 21" earlier in this browser session.

import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { eddiesFlowersAgeGateAttestations } from "@/lib/db/schema";
import {
  AGE_DENIED_COOKIE,
  AGE_OK_COOKIE,
  AGE_OK_MAX_AGE,
} from "@/lib/age-gate";

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
  if (req.cookies.get(AGE_DENIED_COOKIE)?.value === "1") {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

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

  const res = NextResponse.json({ ok: true });
  if (attestedAge21OrOver) {
    res.cookies.set(AGE_OK_COOKIE, "1", {
      path: "/",
      maxAge: AGE_OK_MAX_AGE,
      sameSite: "lax",
      // Secure everywhere except plain-http local development.
      secure:
        req.nextUrl.protocol === "https:" ||
        req.headers.get("x-forwarded-proto") === "https",
    });
  }
  return res;
}
