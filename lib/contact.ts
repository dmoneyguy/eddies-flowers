// Centralized contact + opening-hours info for Eddie's Flowers Dispensary.
// Read by LocationPreview, Footer, layout.tsx schema.org, /faq, /press,
// /wholesale, /careers — all derive from these constants so a single change
// here propagates everywhere on the site.
//
// Hours are PLANNED operating hours for when the shop opens. The site
// currently surfaces them as "Planned hours" until we go live. After
// opening, we can drop the "Planned" framing.

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

export const WEBSITE_URL = "https://eddiesflower.com";

export const HOURS_OPEN_24H = "08:30"; // 8:30 AM
export const HOURS_CLOSE_24H = "22:00"; // 10:00 PM
export const HOURS_DISPLAY = "8:30 AM – 10:00 PM";
export const HOURS_DAYS_DISPLAY = "Daily";

// Schema.org openingHoursSpecification — same hours daily for now
export const OPENING_HOURS_SPEC = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: HOURS_OPEN_24H,
    closes: HOURS_CLOSE_24H,
  },
];
