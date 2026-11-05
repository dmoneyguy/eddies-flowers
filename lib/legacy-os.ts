// Every form write goes through Legacy OS (2026-11-05). This site holds no database credential.
//
// Until now each form route connected to the Legacy OS database itself with DATABASE_URL_WRITE. That credential
// stopped authenticating around 2026-08-15, and every submission since then went to the CRM fallback instead of the
// tables. Now each route posts its row to the Legacy OS form intake, POST /api/v1/eddies-forms/{kind}, and Legacy OS
// (which already has database access) writes it. No secret travels: the intake is public and insert-only, exactly like
// the forms on this site.
//
// If the intake refuses or does not answer, the routes keep the fallback from lib/fallback.ts: the submission goes to
// the Legacy OS CRM contacts intake and the ops notification is marked NOT SAVED with everything needed to replay it.

export const LEGACY_OS_URL = (process.env.LEGACY_OS_URL || "https://legacy-os.thelegacyops.com").replace(/\/+$/, "");

export type LegacyOsFormKind = "lead" | "product-request" | "waitlist" | "age-gate" | "vendor-intake";

export type LegacyOsSaveResult =
  | { saved: true; id: string | null }
  | { saved: false; status: number | null };

/** Long enough for a cold start plus one insert; short enough to leave the route time for the fallback. */
const INTAKE_TIMEOUT_MS = 8000;
const USER_AGENT_MAX = 1000;

/** The visitor's IP as this site saw it, or null when there is none ("unknown"). */
export function visitorIp(ip: string): string | null {
  return ip && ip !== "unknown" ? ip : null;
}

/** The visitor's user agent, capped to what the intake accepts. */
export function visitorUserAgent(userAgent: string | null): string | null {
  return userAgent ? userAgent.slice(0, USER_AGENT_MAX) : null;
}

/**
 * Write one form submission through the Legacy OS intake. Resolves { saved: true, id } only when Legacy OS answered
 * 2xx with ok: true. Never throws: a refusal, an outage or a timeout resolves { saved: false } so the caller falls back.
 */
export async function saveToLegacyOs(
  kind: LegacyOsFormKind,
  row: Record<string, unknown>,
): Promise<LegacyOsSaveResult> {
  try {
    const res = await fetch(`${LEGACY_OS_URL}/api/v1/eddies-forms/${kind}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
      cache: "no-store",
      signal: AbortSignal.timeout(INTAKE_TIMEOUT_MS),
    });
    const data = (await res.json().catch(() => null)) as { ok?: unknown; id?: unknown; field?: unknown } | null;
    if (!res.ok || !data || data.ok !== true) {
      // The intake names the failing field on a 400, never the value; safe to log.
      // eslint-disable-next-line no-console
      console.error(`[legacy-os] ${kind} not saved: HTTP ${res.status}`, data && data.field ? `field=${String(data.field)}` : "");
      return { saved: false, status: res.status };
    }
    return { saved: true, id: typeof data.id === "string" ? data.id : null };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`[legacy-os] ${kind} not saved: request failed`, err instanceof Error ? err.message : err);
    return { saved: false, status: null };
  }
}
