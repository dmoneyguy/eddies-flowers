// Resend client wrapper. Used by /api/waitlist for acknowledgment + internal alerts.
import { Resend } from "resend";

const key = process.env.RESEND_API_KEY;
if (!key && process.env.NODE_ENV !== "test") {
  // eslint-disable-next-line no-console
  console.warn("[email] RESEND_API_KEY is not set — outbound email will fail.");
}

export const resend = new Resend(key || "re_placeholder_key");

export const FROM =
  process.env.RESEND_FROM_EMAIL || "Eddie's Flowers <hello@eddiesflower.com>";

export const NOTIFICATION_EMAIL =
  process.env.NOTIFICATION_EMAIL || "eddies-leads@thelegacyops.com";
