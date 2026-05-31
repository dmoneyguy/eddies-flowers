// Resend client wrapper. Used by /api/waitlist + /api/lead for outbound mail.
//
// Notification routing: every form submission gets a copy at derekd@thelegacyops.com
// (per Derek's directive). The configurable NOTIFICATION_EMAIL env var stays as the
// shared eddies-leads@ inbox. NOTIFICATION_RECIPIENTS = [shared, derek] so it's
// trivial to add more recipients later (Eddie's team email, GM, etc).

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

// Direct copy to Derek per the Eddie's-Flowers ops directive.
const DEREK_EMAIL = "derekd@thelegacyops.com";

// All recipients for every internal lead notification, deduped.
export const NOTIFICATION_RECIPIENTS: string[] = Array.from(
  new Set([PRIMARY_NOTIFICATION, DEREK_EMAIL]),
);

// Back-compat export for any callers still using the old singular import.
export const NOTIFICATION_EMAIL = PRIMARY_NOTIFICATION;
