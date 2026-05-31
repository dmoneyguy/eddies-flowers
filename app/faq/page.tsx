import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://eddiesflower.com";

const FAQ = [
  {
    q: "When does Eddie's Flowers Dispensary open?",
    a: "We're still in buildout and don't have a confirmed opening date yet. Join our waitlist on the home page and we'll send you a note the day we open.",
  },
  {
    q: "Where is Eddie's Flowers located?",
    a: "23 Rindge State Road, Ashburnham, MA 01430. We're a neighborhood dispensary serving Ashburnham, Winchendon, Gardner, Fitchburg, and the surrounding North Worcester County towns. Phone: (978) 883-4026.",
  },
  {
    q: "What are Eddie's Flowers hours?",
    a: "Our planned operating hours are 8:30 AM to 10:00 PM, daily. Hours will be confirmed when we open.",
  },
  {
    q: "How do I contact Eddie's Flowers?",
    a: "Phone (978) 883-4026, email info@eddiesflowers.com, or visit https://eddiesflower.com. For careers, /careers; for press, /press; for wholesale, /wholesale.",
  },
  {
    q: "Are you hiring?",
    a: "Yes. We're hiring locally for budtender, keyholder, cannabis tech, compliance, delivery, and security roles. All Massachusetts cannabis retail workers must be 21 or older. Apply at /careers.",
  },
  {
    q: "Do I have to be 21 to shop at Eddie's Flowers?",
    a: "Yes. Massachusetts adult-use cannabis is restricted to customers 21 and older with valid government-issued ID. The website is also age-gated for 21+ visitors only.",
  },
  {
    q: "What do you sell?",
    a: "Curated flower from licensed Massachusetts cultivators, plus edibles, concentrates, vapes, and pre-rolls. Our menu launches when we open.",
  },
  {
    q: "Are you medical or adult-use?",
    a: "Eddie's Flowers is an adult-use (recreational) Massachusetts cannabis retailer. License #MRN284579 (Provisional).",
  },
  {
    q: "Will you deliver?",
    a: "Delivery is a post-opening goal — we plan to offer local delivery in compliance with Massachusetts CCC rules once we are operational.",
  },
  {
    q: "How do I get on the waitlist?",
    a: "Visit our home page and submit the waitlist form with your name and email or phone. We'll send you one note the day the doors open. No spam, no list-selling.",
  },
  {
    q: "Are you a chain or locally owned?",
    a: "Locally owned and operated. Eddie's Flowers is run by Legacy Operations on behalf of founder Iyad \"Eddie\" Jamal — a North Worcester County operation, not a chain.",
  },
  {
    q: "How do I pitch you as a brand or cultivator?",
    a: "If you're a Massachusetts-licensed cultivator or brand looking for opening-day shelf placement, visit /wholesale and submit your details. We're building a tight curated menu.",
  },
];

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about Eddie's Flowers Dispensary in Ashburnham, MA — opening, location, hiring, what we sell, age requirements, and more.",
  alternates: { canonical: `${SITE_URL}/faq` },
};

export default function FAQ_Page() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(({ q, a }) => ({
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
      <main id="main" className="bg-warm-beige">
        <section className="px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rustic-brown">
              FAQ
            </p>
            <h1 className="display mt-3 text-4xl font-extrabold text-charcoal-black sm:text-5xl">
              Common questions.
            </h1>
            <p className="mt-4 text-lg text-charcoal-black/70">
              Quick answers about Eddie&apos;s Flowers Dispensary — opening,
              location, hiring, what we sell. If your question isn&apos;t here,{" "}
              <Link href="/press" className="text-leaf-green-deep underline decoration-leaf-green/40 underline-offset-4 hover:decoration-leaf-green-deep">
                drop us a note
              </Link>.
            </p>

            <dl className="mt-12 space-y-8">
              {FAQ.map(({ q, a }) => (
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
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
