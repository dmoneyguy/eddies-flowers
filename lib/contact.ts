// Centralized contact + opening-hours info for Eddie's Flowers Dispensary.
// Read by LocationPreview, Footer, layout.tsx schema.org, /faq, /press,
// /wholesale, /careers — all derive from these constants so a single change
// here propagates everywhere on the site.
//
// Hours are the operating hours of record for when the shop opens. The site
// surfaces them as "Planned hours" until we go live. After opening, we can
// drop the "Planned" framing. See the HOURS OF RECORD block below before
// changing any of them.

export const STREET_ADDRESS = "23 Rindge State Road";
export const ADDRESS_LOCALITY = "Ashburnham";
export const ADDRESS_REGION = "MA";
export const POSTAL_CODE = "01430";
export const ADDRESS_FULL = `${STREET_ADDRESS}, ${ADDRESS_LOCALITY}, ${ADDRESS_REGION} ${POSTAL_CODE}`;

export const PHONE_DISPLAY = "(978) 883-4026";
export const PHONE_E164 = "+19788834026";
export const PHONE_TEL_HREF = `tel:${PHONE_E164}`;

// Contact email + send domain both use eddiesflower.com (singular) — single
// source of truth, matches the website domain.
export const CONTACT_EMAIL = "info@eddiesflower.com";
export const CONTACT_EMAIL_HREF = `mailto:${CONTACT_EMAIL}`;

export const WEBSITE_URL = "https://www.eddiesflower.com";

// ---------------------------------------------------------------------------
// HOURS OF RECORD
//
// Confirmed by Derek D'Ambrosio on 6 August 2026. These supersede the
// 8:30 AM – 10:00 PM daily hours that were proposed at provisional licensure
// and that this file previously published.
//
//   Monday – Friday   10:00 AM – 9:00 PM
//   Saturday           9:00 AM – 8:00 PM
//   Sunday             9:00 AM – 7:00 PM
//
// TWO REASONS THE OLD HOURS COULD NOT STAY:
//
//  1. The Ashburnham zoning bylaw provides that the establishment shall not be
//     open or operating between 9:00 PM and 8:00 AM. An 8:30 AM open and a
//     10:00 PM close sit outside that window at both ends. The hours below sit
//     inside it every day of the week.
//
//  2. 935 CMR 500.105(1)(c) requires hours of operation to be provided to the
//     Commission and KEPT UPDATED, and to be available to Law Enforcement
//     Authorities. A public website publishing different hours from the ones
//     on file is the kind of inconsistency an inspector notices.
//
// If these change again, change them HERE. The Google Business Profile, the
// Commission's record, and this file must agree — three places, one answer.
// ---------------------------------------------------------------------------

export const HOURS_WEEKDAY_OPEN_24H = "10:00";
export const HOURS_WEEKDAY_CLOSE_24H = "21:00";
export const HOURS_SATURDAY_OPEN_24H = "09:00";
export const HOURS_SATURDAY_CLOSE_24H = "20:00";
export const HOURS_SUNDAY_OPEN_24H = "09:00";
export const HOURS_SUNDAY_CLOSE_24H = "19:00";

// Primary display line, and the smaller caption beneath it.
export const HOURS_DISPLAY = "Mon – Fri, 10 AM – 9 PM";
export const HOURS_DAYS_DISPLAY = "Sat 9 AM – 8 PM · Sun 9 AM – 7 PM";

// Full listing, for pages with room to show every day.
export const HOURS_LINES: ReadonlyArray<{ days: string; hours: string }> = [
  { days: "Monday – Friday", hours: "10:00 AM – 9:00 PM" },
  { days: "Saturday", hours: "9:00 AM – 8:00 PM" },
  { days: "Sunday", hours: "9:00 AM – 7:00 PM" },
];

// One-sentence form, for prose and for AI assistants reading llms.txt.
export const HOURS_SENTENCE =
  "Monday to Friday 10:00 AM to 9:00 PM, Saturday 9:00 AM to 8:00 PM, and Sunday 9:00 AM to 7:00 PM";

// Schema.org openingHoursSpecification — one entry per distinct schedule.
export const OPENING_HOURS_SPEC = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: HOURS_WEEKDAY_OPEN_24H,
    closes: HOURS_WEEKDAY_CLOSE_24H,
  },
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Saturday"],
    opens: HOURS_SATURDAY_OPEN_24H,
    closes: HOURS_SATURDAY_CLOSE_24H,
  },
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Sunday"],
    opens: HOURS_SUNDAY_OPEN_24H,
    closes: HOURS_SUNDAY_CLOSE_24H,
  },
];
