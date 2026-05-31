// Rindge, NH landing page — T111.3b.
//
// Reuses TownHero/TownFAQ/TownCTA shared components. Inlines the narrative
// block and practical-info section (both vary too much per town for a clean
// shared API). WebPage JSON-LD references the global Store @id in
// app/layout.tsx — no schema duplication.

import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { TownHero } from "@/components/town/TownHero";
import { TownFAQ } from "@/components/town/TownFAQ";
import { TownCTA } from "@/components/town/TownCTA";
import {
  ADDRESS_FULL,
  STREET_ADDRESS,
  ADDRESS_LOCALITY,
  ADDRESS_REGION,
  POSTAL_CODE,
  PHONE_DISPLAY,
  PHONE_TEL_HREF,
  CONTACT_EMAIL,
  CONTACT_EMAIL_HREF,
  HOURS_DISPLAY,
  HOURS_DAYS_DISPLAY,
} from "@/lib/contact";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://eddiesflower.com";
const PAGE_URL = `${SITE_URL}/rindge-nh`;

export const metadata: Metadata = {
  title: "Eddie's Flowers \u2014 Near Rindge, NH",
  description: "Eddie's Flowers is the closest Massachusetts dispensary to the Rindge, NH border. About 10 minutes south at 23 Rindge State Road in Ashburnham. Opening soon.",
  alternates: { canonical: PAGE_URL },
  keywords: ["dispensary near Rindge NH", "MA dispensary near New Hampshire", "Rindge NH dispensary", "closest Massachusetts dispensary to NH", "Eddie's Flowers Rindge", "cannabis near NH border"],
  openGraph: {
    title: "Eddie's Flowers \u2014 Near Rindge, NH",
    description: "The closest Massachusetts dispensary to the Rindge, NH border. Opening soon at 23 Rindge State Road, Ashburnham.",
    url: PAGE_URL,
  },
};

const PAGE_FAQ = [
  {
    "q": "Where exactly is Eddie's Flowers from Rindge, NH?",
    "a": "23 Rindge State Road, Ashburnham, MA 01430. About 10 minutes south of the Rindge, NH border, in the heart of Ashburnham. Phone (978) 883-4026."
  },
  {
    "q": "I live in Rindge, NH. Can I shop at Eddie's?",
    "a": "Yes \u2014 Massachusetts adult-use law allows anyone 21+ with a valid ID to shop at any licensed MA dispensary, regardless of which state they're from. What you do with your purchase after you leave the store is your call. One thing worth knowing: cannabis is still illegal at the federal level and in New Hampshire, so the safe call is to enjoy what you buy in Massachusetts before heading home."
  },
  {
    "q": "When does Eddie's open?",
    "a": "We're still in buildout and don't have a confirmed opening date yet. Join the waitlist on our home page and we'll send you a note the day the doors open."
  },
  {
    "q": "Are you local, or part of a chain?",
    "a": "Locally owned and operated. Eddie's Flowers is run by Legacy Operations on behalf of founder Iyad \"Eddie\" Jamal \u2014 a North Worcester County operation, not a chain."
  }
];

export default function RindgeNhPage() {
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": PAGE_URL,
    url: PAGE_URL,
    name: "Eddie's Flowers \u2014 Near Rindge, NH",
    description: "Eddie's Flowers is the closest Massachusetts dispensary to the Rindge, NH border. Opening soon at 23 Rindge State Road in Ashburnham.",
    about: { "@id": `${SITE_URL}/#store` },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${SITE_URL}/og.png`,
    },
    inLanguage: "en-US",
    isPartOf: { "@id": `${SITE_URL}/#site` },
  };

  const mapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS_FULL)}&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ADDRESS_FULL)}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />

      <main id="main">
        <TownHero
          eyebrow="Rindge \u00b7 NH"
          straplineLead="Just south of the "
          straplineGreen="border"
          subhead="Eddie's Flowers is about 10 minutes south of the Rindge, NH border, in Ashburnham. Massachusetts adult-use cannabis, curated flower, honest answers. Opening soon."
        />

        {/* ============================================================ */}
        {/* NARRATIVE BLOCK — Eddie's first-person voice, town-specific  */}
        {/* ============================================================ */}
        <section className="paper relative isolate overflow-hidden px-6 py-24 sm:py-32">
          <div className="relative z-10 mx-auto max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-rustic-brown">
              From Eddie
            </p>

            <div className="mt-8 space-y-6 text-lg leading-relaxed text-charcoal-black sm:text-xl">
              <p>If you're in Rindge or the towns just over the border, Eddie's Flowers is the closest Massachusetts dispensary to you. About 10 minutes south of the New Hampshire line, in the heart of Ashburnham.</p>
              <p>A few practical notes for NH visitors: Massachusetts adult-use cannabis is legal for anyone 21 or older with valid government-issued ID, regardless of which state you live in. New Hampshire doesn't have legal recreational cannabis yet, and federal law still treats cannabis as illegal — so the legal advice is to use what you buy here, in Massachusetts, before heading back across the border.</p>
              <p>We curate a tight menu, take time with each customer, and don't push anything you didn't ask about. Whenever you're ready.</p>
            </div>

            <p className="mt-10 text-2xl italic text-leaf-green-deep sm:text-3xl">
              — Eddie
            </p>
          </div>
        </section>

        {/* ============================================================ */}
        {/* PRACTICAL INFO — address, hours, contact, drive-time         */}
        {/* ============================================================ */}
        <section className="relative isolate overflow-hidden bg-charcoal-deep px-6 py-24 sm:py-32">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(circle at 10% 0%, rgba(115,190,68,0.10), transparent 55%)",
            }}
          />

          <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-leaf-green-soft">
                Where to find us
              </p>
              <h2 className="display mt-4 text-balance text-4xl font-medium text-white sm:text-5xl">
                At 23 Rindge State Road, the closest MA dispensary to the 
                <span className="italic font-light text-leaf-green-soft">
                  Rindge, NH border
                </span>
                .
              </h2>

              <dl className="mt-10 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                    Address
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-white">
                    {STREET_ADDRESS}
                  </dd>
                  <dd className="text-xs text-white/55">
                    {ADDRESS_LOCALITY}, {ADDRESS_REGION} {POSTAL_CODE}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                    Planned Hours
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-white">
                    {HOURS_DISPLAY}
                  </dd>
                  <dd className="text-xs text-white/55">{HOURS_DAYS_DISPLAY}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                    Phone
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={PHONE_TEL_HREF}
                      className="text-sm font-medium text-white hover:text-leaf-green-soft"
                    >
                      {PHONE_DISPLAY}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                    Email
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={CONTACT_EMAIL_HREF}
                      className="break-all text-sm font-medium text-white hover:text-leaf-green-soft"
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </dd>
                </div>
              </dl>

              <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                  Drive times
                </p>
                <ul className="mt-3 space-y-2 text-sm text-white/75">
                  <li>About 10 minutes south of the Rindge, NH border.</li>
                  <li>A few minutes from the center of Ashburnham.</li>
                  <li>Around 15 minutes from Jaffrey or Fitzwilliam, NH.</li>
                </ul>
              </div>

              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-leaf-green-soft hover:text-leaf-green-soft"
              >
                Get directions
                <span aria-hidden="true">→</span>
              </a>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl">
              <iframe
                src={mapsUrl}
                title="Map showing Eddie's Flowers Dispensary in Ashburnham, MA (near Rindge, NH)"
                width="100%"
                height="280"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </section>

        <TownFAQ
          eyebrow="Rindge, NH FAQ"
          h2="The questions we get from folks across the border."
          items={PAGE_FAQ}
        />

        <TownCTA townAccent="Rindge" />
      </main>

      <Footer />
    </>
  );
}
