// TownFAQ — shared FAQ section for town landing pages.
//
// Renders the bg-warm-beige FAQ list AND emits its own page-scoped FAQPage
// JSON-LD block so AI search can ingest each town's Q&As as a structured
// entity. The shared FAQ chrome ("More general questions on the full FAQ"
// anchor link) is included.

import Link from "next/link";

export interface TownFAQItem {
  q: string;
  a: string;
}

interface TownFAQProps {
  /** "Winchendon FAQ" — town-scoped eyebrow */
  eyebrow: string;
  /** "The questions we get from Winchendon." */
  h2: string;
  items: TownFAQItem[];
}

export function TownFAQ({ eyebrow, h2, items }: TownFAQProps) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <section className="bg-warm-beige px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-rustic-brown">
            {eyebrow}
          </p>
          <h2 className="display mt-3 text-balance text-3xl font-bold text-charcoal-black sm:text-4xl">
            {h2}
          </h2>

          <dl className="mt-10 space-y-8">
            {items.map(({ q, a }) => (
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
    </>
  );
}
