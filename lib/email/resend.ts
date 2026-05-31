// Resend client wrapper. Used by /api/waitlist + /api/lead for outbound mail.
//
// Notification routing: every form submission goes to a deduped, sanitized
// recipient array. Defensive against:
//   1. Operators typing the wrong address into NOTIFICATION_EMAIL (a common
//      one is "derek@thelegacyops.com" vs the correct "derekd@thelegacyops.com")
//   2. Resend's atomic multi-recipient bounce behavior: if any address on a
//      To: array is on Resend's suppression list, the whole message gets
//      marked bounced and the good recipients lose the email too. We strip
//      known-bad addresses here so they can never poison the array.
//
// Override DEREK_EMAIL via env var if needed; default ensures Derek always
// gets a copy of every submission.

import { Resend } from "resend";

const key = process.env.RESEND_API_KEY;
if (!key && process.env.NODE_ENV !== "test") {
  // eslint-disable-next-line no-console
  console.warn("[email] RESEND_API_KEY is not set — outbound email will fail.");
}

export const resend = new Resend(key || "re_placeholder_key");

export const FROM =
  process.env.RESEND_FROM_EMAIL || "Eddie's Flowers <hello@eddiesflower.com>";

const PRIMARY_NOTIFICATION =
  process.env.NOTIFICATION_EMAIL || "eddies-leads@thelegacyops.com";

// Always include Derek; configurable in case ownership shifts.
const DEREK_EMAIL =
  process.env.DEREK_NOTIFICATION_EMAIL || "derekd@thelegacyops.com";

// Known-bad addresses that have hard-bounced or are on Resend's suppression
// list. Including any one of these in a multi-recipient send blocks delivery
// for ALL recipients in that message. Most commonly: the missing "d" typo
// on derek@.
const SUPPRESSED: ReadonlySet<string> = new Set([
  "derek@thelegacyops.com", // typo'd alias — Resend suppression list
]);

// Common typo auto-corrections — quietly fix known mistakes rather than
// dropping the recipient entirely.
function autoCorrect(addr: string): string {
  const lower = addr.trim().toLowerCase();
  if (lower === "derek@thelegacyops.com") return "derekd@thelegacyops.com";
  return lower;
}

function sanitizeRecipients(addresses: string[]): string[] {
  const corrected = addresses
    .map((a) => autoCorrect(a))
    .filter((a) => a && !SUPPRESSED.has(a));
  return Array.from(new Set(corrected));
}

// Build the deduped, sanitized recipient list at module load.
// Callers import this constant directly.
export const NOTIFICATION_RECIPIENTS: string[] = sanitizeRecipients([
  PRIMARY_NOTIFICATION,
  DEREK_EMAIL,
]);

// Sanity: if env-var misconfig somehow strips every recipient, fall back to
// derekd@ so the send never goes out with an empty To array.
if (NOTIFICATION_RECIPIENTS.length === 0) {
  NOTIFICATION_RECIPIENTS.push("derekd@thelegacyops.com");
  // eslint-disable-next-line no-console
  console.warn(
    "[email] NOTIFICATION_RECIPIENTS resolved empty after sanitization — falling back to derekd@thelegacyops.com",
  );
}

// Back-compat singular export
export const NOTIFICATION_EMAIL = PRIMARY_NOTIFICATION;
