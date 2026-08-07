// /menu — the page that does not exist yet, said honestly.
//
// WHY BUILD AN EMPTY MENU PAGE. "eddies flowers menu" and "[dispensary] menu"
// are the highest-intent searches a dispensary gets, and they start the moment
// people know the shop is coming. Without this page those searches land on a
// 404 or on a competitor. With it, they land on us, get a truthful answer, and
// get the chance to tell us what to stock — which is the one thing we can
// genuinely act on before opening.
//
// WHAT THIS PAGE MAY NOT DO, ever, until the final licence issues and the
// menu is real:
//   - list a product, a strain, a brand or a potency
//   - show a price, or any price comparison — 935 CMR 500.105(4)(b)18
//   - offer a discount, coupon, reward or loyalty benefit — (4)(b)20
//   - imply we hold inventory. We do not, and holding product before final
//     licensure is unlawful.
//
// When the menu goes live, this page becomes the menu. Until then it is a
// straight answer plus a way to influence what ends up on it.

import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { ProductRequestSection } from "@/components/ProductRequestSection";
import { ScrollReveal } from "@/components/ScrollReveal";
import { HOURS_SENTENCE } from "@/lib/contact";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.eddiesflower.com";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Eddie's Flowers Dispensary in Ashburnham, MA hasn't opened yet, so there's no menu to browse. Here's what we'll carry when we do — and how to tell us what you want on the shelf.",
  alternates: { canonical: `${SITE_URL}/menu` },
};

const CATEGORIES = [
  {
    name: "Flower",
    body: "The centre of the shop. Curated from licensed Massachusetts cultivators — a short list we can actually speak to rather than a wall of jars.",
  },
  {
    name: "Pre-rolls",
    body: "Singles and packs, from the same growers as the flower.",
  },
  {
    name: "Edibles",
    body: "Gummies, chocolates and drinks. Effects can take two hours or more to arrive — we'll say so every time.",
  },
  {
    name: "Vapes",
    body: "Cartridges and disposables. Every device comes with the manufacturer and testing information Massachusetts requires.",
  },
  {
    name: "Concentrates",
    body: "Rosin, resin, hash. A small selection, chosen rather than stocked.",
  },
  {
    name: "Accessories",
    body: "The practical things — papers, grinders, storage.",
  },
];

export default function MenuPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Does Eddie's Flowers have a menu online?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Not yet. Eddie's Flowers Dispensary in Ashburnham, MA has not opened. Massachusetts law does not permit a retailer to hold marijuana before its final licence issues, so there is no inventory and no menu to publish. The full menu with live availability goes on this page the day the shop opens.",
        },
      },
      {
        "@type": "Question",
        name: "What will Eddie's Flowers sell?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Curated flower from licensed Massachusetts cultivators, plus pre-rolls, edibles, vapes, concentrates and accessories. Eddie's Flowers is an adult-use retailer; you must be 21 or older with valid government-issued ID.",
        },
      },
      {
        "@type": "Question",
        name: "Can I request a product before Eddie's Flowers opens?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. There is a product request form on this page and on the home page. Requests genuinely shape the opening menu — we are choosing what to stock now.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main id="main">
        <section className="bg-charcoal-deep px-6 pt-32 pb-20 sm:pt-40 sm:pb-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-leaf-green-soft">
              Menu
            </p>
            <h1 className="display mt-4 text-balance text-4xl font-medium text-white sm:text-5xl">
              There isn&apos;t one yet.{" "}
              <span className="italic font-light text-leaf-green-soft">
                Here&apos;s why.
              </span>
            </h1>
            <p className="mt-6 text-balance text-base leading-relaxed text-white/70 sm:text-lg">
              Massachusetts doesn&apos;t let a dispensary hold cannabis before its
              final licence is issued. We don&apos;t have ours yet, so we have no
              inventory — and a menu of things we don&apos;t have would be a lie
              dressed as marketing.
            </p>
            <p className="mt-4 text-balance text-base leading-relaxed text-white/70 sm:text-lg">
              The real menu, with live availability, goes on this page the day we
              open.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/#waitlist"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-leaf-green px-7 text-base font-semibold text-white transition-colors hover:bg-leaf-green-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-green"
              >
                Tell me when it&apos;s live
              </Link>
              <Link
                href="/first-visit"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 px-7 text-base font-semibold text-white/85 transition-colors hover:border-leaf-green hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-green"
              >
                What to expect
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-3xl">
            <h2 data-reveal className="display text-balance text-3xl font-medium text-charcoal-black sm:text-4xl">
              What we&apos;ll carry.
            </h2>
            <p data-reveal className="mt-3 max-w-xl text-base text-charcoal-black/70">
              No prices and no product names — we&apos;re not allowed to advertise
              either, and we wouldn&apos;t know them yet anyway. This is the shape
              of the shop.
            </p>
            <dl data-reveal className="mt-10 grid gap-6 sm:grid-cols-2">
              {CATEGORIES.map((c) => (
                <div
                  key={c.name}
                  className="rounded-2xl border border-charcoal-black/10 bg-charcoal-black/[0.02] p-6"
                >
                  <dt className="display text-xl font-semibold text-charcoal-black">
                    {c.name}
                  </dt>
                  <dd className="mt-2 text-sm leading-relaxed text-charcoal-black/70">
                    {c.body}
                  </dd>
                </div>
              ))}
            </dl>
            <p data-reveal className="mt-8 text-sm leading-relaxed text-charcoal-black/60">
              When we open, our planned hours are {HOURS_SENTENCE}. You&apos;ll need
              a valid government-issued ID showing you&apos;re 21 or older, every
              visit, no exceptions.
            </p>
          </div>
        </section>

        <ProductRequestSection />
      </main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
