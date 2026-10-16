// Never lose a submission because the database write failed.
//
// Finding 2026-10-16: the site's DATABASE_URL_WRITE stopped authenticating ("password authentication failed for user
// 'neondb_owner'") around 2026-08-15. From then on every form route returned 500 *before* sending its notification,
// so careers applications, wholesale pitches, waitlist sign-ups and product requests were refused and nobody was told.
// Each form route now keeps going when the insert fails: it saves the submission to the Legacy OS CRM (public contacts
// intake, no credential needed), sends the buying/ops notification marked NOT SAVED with everything needed to replay
// it, and only answers 500 if neither of those landed.

export const CRM_CONTACTS_URL =
  process.env.LEGACY_OS_CRM_URL || "https://legacy-os.thelegacyops.com/api/v1/contacts";

export const NOT_SAVED_PREFIX = "[NOT SAVED TO DB — site DB credential] ";

/** POST a contact to the Legacy OS CRM. Resolves true only on a 2xx. Never throws. */
export async function saveToCrm(input: {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  message?: string | null;
  formTag: string;
  marketingOptIn?: boolean;
  smsOptIn?: boolean;
}): Promise<boolean> {
  try {
    const res = await fetch(CRM_CONTACTS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: input.name.slice(0, 200),
        email: input.email,
        phone: input.phone || undefined,
        company: input.company ? input.company.slice(0, 200) : undefined,
        message: input.message ? input.message.slice(0, 5000) : undefined,
        source_site: "eddiesflower.com",
        form_tag: input.formTag,
        marketing_opt_in: input.marketingOptIn === true,
        sms_opt_in: input.smsOptIn === true,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Did any of these side effects actually land? Resend resolves `{ error }` instead of throwing on an API error, and
 * saveToCrm resolves false, so a fulfilled promise is not enough on its own.
 */
export function anyLanded(results: readonly PromiseSettledResult<unknown>[]): boolean {
  return results.some((r) => {
    if (r.status !== "fulfilled") return false;
    const v = r.value;
    if (v === false || v === null || v === undefined) return false;
    if (typeof v === "object" && "error" in v && (v as { error: unknown }).error) return false;
    if (typeof v === "object" && "ok" in v && (v as { ok: unknown }).ok === false) return false;
    return true;
  });
}
