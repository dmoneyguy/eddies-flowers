import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.eddiesflower.com";

const FAQ = [
  {
    q: "When does Eddie's Flowers Dispensary open?",
    a: "We don't have a confirmed date yet, and here's exactly why: the building is finished and has its certificate of occupancy, and the last step is our final inspection with the Cannabis Control Commission. The Commission schedules that, not us. Ask for a Grand Opening invitation on our home page and we'll send you the date and time before we announce it anywhere else.",
  },
  {
    q: "Where is Eddie's Flowers located?",
    a: "23 Rindge State Road, Ashburnham, MA 01430. We're a neighborhood dispensary serving Ashburnham, Winchendon, Gardner, Fitchburg, and the surrounding North Worcester County towns. Phone: (978) 883-4026.",
  },
  {
    q: "What dispensaries are near Ashburnham, MA?",
    a: "Eddie's Flowers is the only dispensary in Ashburnham town limits — opening soon at 23 Rindge State Road. The closest other dispensaries are United Cultivation in Ashby (about 5 miles) and Bud Barn in Winchendon (about 10 miles). For folks coming down from New Hampshire, Eddie's is the closest Massachusetts dispensary to the Rindge, NH border.",
  },
  {
    q: "What are Eddie's Flowers hours?",
    a: "Our planned operating hours are Monday to Friday 10:00 AM to 9:00 PM, Saturday 9:00 AM to 8:00 PM, and Sunday 9:00 AM to 7:00 PM. Hours will be confirmed when we open.",
  },
  {
    q: "How do I contact Eddie's Flowers?",
    a: "Phone (978) 883-4026, email info@eddiesflower.com, or visit https://www.eddiesflower.com. For careers, /careers; for press, /press; for wholesale, /wholesale.",
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
    a: "Curated flower from licensed Massachusetts cultivators, plus edibles, concentrates, vapes, pre-rolls and accessories. There is no menu yet — Massachusetts does not permit a retailer to hold marijuana before its final licence issues, so we have no inventory. See /menu for what we will carry, and /first-visit if you have never been to a dispensary before.",
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
    q: "How do I get an invitation to the Grand Opening?",
    a: "Visit our home page and submit the invitation form with your name and email or phone. Founding members get the opening date and time before it is announced anywhere else, and are through the door on day one. Massachusetts law does not permit a dispensary to offer discounts, points or loyalty rewards, so that is exactly what it is and nothing more. No spam, no list-selling.",
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
