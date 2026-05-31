// Ashburnham landing page — T111.3a (flagship + voice exemplar).
//
// Town-specific landing that owns the "dispensary in Ashburnham" search
// intent. Distinct URL, distinct schema (WebPage referencing the global
// Store entity), distinct meta + page-scoped FAQ. Footer is global-pattern
// (imported per-route, not inherited).
//
// Voice: Eddie's. Neighbor warmth, plain factual statements, no marketing
// register. Reads as a destination page for an actual Ashburnham resident
// planning a visit, not SEO bait. Each fact stated traces to either the
// existing site or a Phase-1-approved derivative.

import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
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
const PAGE_URL = `${SITE_URL}/ashburnham`;

export const metadata: Metadata = {
  title: "Eddie's Flowers — Ashburnham, MA",
  description:
    "Eddie's Flowers is the only dispensary in Ashburnham, MA. 23 Rindge State Road. Curated flower, honest answers, no marketing-speak. Opening soon.",
  alternates: { canonical: PAGE_URL },
  keywords: [
    "Ashburnham dispensary",
    "dispensary Ashburnham MA",
    "cannabis Ashburnham",
    "marijuana Ashburnham MA",
    "Eddie's Flowers Ashburnham",
    "Ashburnham marijuana dispensary",
  ],
  openGraph: {
    title: "Eddie's Flowers — Ashburnham, MA",
    description:
      "The only dispensary in Ashburnham. Opening soon at 23 Rindge State Road.",
    url: PAGE_URL,
  },
};

const PAGE_FAQ = [
  {
    q: "Where exactly is Eddie's Flowers in Ashburnham?",
    a: "23 Rindge State Road, Ashburnham, MA 01430. We're in the heart of town, a couple minutes from the center of Ashburnham. Phone (978) 883-4026.",
  },
  {
    q: "Is Eddie's the only dispensary in Ashburnham?",
    a: "Yes. Eddie's Flowers is the only dispensary physically located in Ashburnham town limits. The closest other dispensaries are United Cultivation in Ashby (about 5 miles) and Bud Barn in Winchendon (about 10 miles).",
  },
  {
    q: "When does Eddie's open?",
    a: "We're still in buildout and don't have a confirmed opening date yet. Join the waitlist on our home page and we'll send you a note the day the doors open.",
  },
  {
    q: "Are you local, or part of a chain?",
    a: 'Locally owned and operated. Eddie\'s Flowers is run by Legacy Operations on behalf of founder Iyad "Eddie" Jamal — a North Worcester County operation, not a chain.',
  },
];

export default function AshburnhamPage() {
  // WebPage entity scoped to this page, references the global Store + WebSite
  // entities by @id (no duplication of the Store schema).
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": PAGE_URL,
    url: PAGE_URL,
    name: "Eddie's Flowers — Ashburnham, MA",
    description:
      "Eddie's Flowers is the only adult-use cannabis dispensary in Ashburnham, MA. 23 Rindge State Road. Locally owned, opening soon.",
    about: { "@id": `${SITE_URL}/#store` },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${SITE_URL}/og.png`,
    },
    inLanguage: "en-US",
    isPartOf: { "@id": `${SITE_URL}/#site` },
  };

  // Page-scoped FAQPage schema for the 4 town-specific Q&As below.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PAGE_FAQ.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  const mapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS_FULL)}&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ADDRESS_FULL)}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <main id="main">
        {/* ============================================================ */}
        {/* 1. HERO — lighter than home page                              */}
        {/* No mesh-canvas, no leaf-drift, no spotlight. Single column,   */}
        {/* centered, soft radial gradient on charcoal-deep.              */}
        {/* ============================================================ */}
        <section
          className="relative isolate overflow-hidden bg-charcoal-deep px-6 pt-24 pb-20 sm:pt-32 sm:pb-24"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(circle at 50% 0%, rgba(115,190,68,0.12), transparent 55%), radial-gradient(circle at 80% 100%, rgba(255,208,15,0.05), transparent 60%)",
            }}
          />

          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <p className="ray-burst inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.32em] text-leaf-green-soft">
              <span className="h-px w-8 bg-leaf-green/60" aria-hidden="true" />
              Ashburnham · MA
              <span className="h-px w-8 bg-leaf-green/60" aria-hidden="true" />
            </p>

            <h1 className="display mt-8 text-balance text-5xl font-light italic leading-[1.05] text-white sm:text-6xl md:text-7xl">
              Your dispensary,{" "}
              <span className="not-italic font-medium text-leaf-green-soft">
                neighbor
              </span>
              .
            </h1>

            <p className="mt-8 max-w-2xl text-balance text-base leading-relaxed text-white/70 sm:text-lg">
              Eddie&apos;s Flowers is the only dispensary in Ashburnham — opening
              soon at{" "}
              <span className="whitespace-nowrap text-white">23 Rindge State Road</span>.
              Curated flower, honest answers, and a friendly conversation. From
              folks who live here.
            </p>

            <Link
              href="/#waitlist"
              className="glow-leaf mt-10 inline-flex items-center gap-2 rounded-full bg-leaf-green px-8 py-4 text-base font-semibold text-white sm:text-lg"
            >
              Join the waitlist
              <span aria-hidden="true">→</span>
            </Link>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-white/40">
              No spam · One note when we open
            </p>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 2. NARRATIVE BLOCK — Eddie's first-person voice               */}
        {/* Paper-textured warm-beige, narrow column, plain italic        */}
        {/* signature (no Caveat — reserved for home FounderNote).         */}
        {/* ============================================================ */}
        <section className="paper relative isolate overflow-hidden px-6 py-24 sm:py-32">
          <div className="relative z-10 mx-auto max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-rustic-brown">
              From Eddie
            </p>

            <div className="mt-8 space-y-6 text-lg leading-relaxed text-charcoal-black sm:text-xl">
              <p>
                We&apos;re building Eddie&apos;s Flowers as the kind of shop
                where you know the people behind the counter. Curated flower,
                real answers when you ask questions, and a friendly hello on the
                way out.
              </p>

              <p>
                Ashburnham deserves a dispensary that feels like it belongs here
                — not a chain dropped in from Boston, not a brand trying to be
                edgy. We&apos;re hiring locally — folks from Ashburnham and the
                surrounding towns. We want to be your neighbor, not just
                another shop on the map.
              </p>

              <p>
                If you live in town, I want you to walk in feeling like a
                neighbor. If you&apos;re driving in from Winchendon, Gardner, or
                down from Rindge, I want you to feel the same way.
              </p>
            </div>

            <p className="mt-10 text-2xl italic text-leaf-green-deep sm:text-3xl">
              — Eddie
            </p>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 3. PRACTICAL INFO — address, hours, contact, drive-time frame */}
        {/* Charcoal-deep section, 50/50 split: info column + smaller map */}
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
                At 23 Rindge State Road, in the heart of{" "}
                <span className="italic font-light text-leaf-green-soft">
                  Ashburnham
                </span>
                .
              </h2>

              {/* Contact 4-up */}
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

              {/* Drive-time framing — generic, no specific minutes */}
              <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                  Drive times
                </p>
                <ul className="mt-3 space-y-2 text-sm text-white/75">
                  <li>A couple minutes from the center of Ashburnham.</li>
                  <li>About 10 minutes from Winchendon.</li>
                  <li>Around 10 minutes from the Rindge, NH border.</li>
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

            {/* Smaller map embed (280px vs LocationPreview's 380px) */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl">
              <iframe
                src={mapsUrl}
                title="Map showing Eddie's Flowers Dispensary in Ashburnham, MA"
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

        {/* ============================================================ */}
        {/* 4. PAGE-SCOPED FAQ — 4 town-specific Q&As                      */}
        {/* warm-beige treatment matching /faq                            */}
        {/* ============================================================ */}
        <section className="bg-warm-beige px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-rustic-brown">
              Ashburnham FAQ
            </p>
            <h2 className="display mt-3 text-balance text-3xl font-bold text-charcoal-black sm:text-4xl">
              The questions we get most.
            </h2>

            <dl className="mt-10 space-y-8">
              {PAGE_FAQ.map(({ q, a }) => (
                <div key={q} className="border-b border-charcoal-black/10 pb-8">
                  <dt className="display text-xl font-semibold text-charcoal-black sm:text-2xl">
                    {q}
                  </dt>
                  <dd className="mt-3 text-base leading-relaxed text-charcoal-black/80 sm:text-lg">
                    {a}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-10 text-sm text-charcoal-black/60">
              More general questions on the{" "}
              <Link
                href="/faq"
                className="text-leaf-green-deep underline decoration-leaf-green/40 underline-offset-4 hover:decoration-leaf-green-deep"
              >
                full FAQ
              </Link>
              .
            </p>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 5. FINAL CTA — town-scoped, anchors back to /#waitlist        */}
        {/* ============================================================ */}
        <section className="relative isolate overflow-hidden bg-charcoal-deep px-6 py-24 sm:py-32">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(circle at 50% 100%, rgba(115,190,68,0.12), transparent 55%)",
            }}
          />

          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-leaf-green-soft">
              Be there when the doors open
            </p>

            <h2 className="display mt-5 text-balance text-4xl font-medium text-white sm:text-5xl">
              Save your spot,{" "}
              <span className="italic font-light text-leaf-green-soft">
                Ashburnham
              </span>
              .
            </h2>

            <p className="mt-6 max-w-xl text-balance text-base text-white/70 sm:text-lg">
              One note from us the day we open — no spam, no shares, no
              list-selling. Ever.
            </p>

            <Link
              href="/#waitlist"
              className="glow-leaf mt-10 inline-flex items-center gap-2 rounded-full bg-leaf-green px-8 py-4 text-base font-semibold text-white sm:text-lg"
            >
              Join the waitlist
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
