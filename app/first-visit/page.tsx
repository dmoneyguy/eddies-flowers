// /first-visit — what actually happens when you walk into a dispensary.
//
// WHY. A meaningful share of the people who will walk through our door have
// never been in a dispensary. They don't know they'll be ID'd at the door, that
// most shops are cash-or-debit, that edibles take two hours, or that they're
// allowed to just ask. That uncertainty is the single biggest thing keeping a
// certain kind of customer — often an older, local, first-time one — from
// coming in at all.
//
// It is also strong for AI search: "what happens on your first dispensary
// visit" is exactly the kind of question people put to an assistant rather
// than a search box, and there is a real answer here rather than marketing.
//
// COMPLIANCE. Nothing here is a health or medical claim, and nothing here is
// an offer. The dosing guidance is the standard harm-reduction language and is
// framed as "start low, go slow", never as a therapeutic recommendation. No
// prices — 935 CMR 500.105(4)(b)18. No discounts or rewards — (4)(b)20.
//
// The purchase limit stated below is the Massachusetts adult-use possession /
// transaction limit: one ounce of flower, of which no more than five grams may
// be concentrate. If that regulation changes, change this page.

import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ADDRESS_FULL, HOURS_SENTENCE, PHONE_DISPLAY, PHONE_TEL_HREF } from "@/lib/contact";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.eddiesflower.com";

export const metadata: Metadata = {
  title: "Your first visit",
  description:
    "Never been to a dispensary? Here's exactly what happens when you visit Eddie's Flowers in Ashburnham, MA — ID at the door, how to pay, what you can buy, and how to start low and go slow.",
  alternates: { canonical: `${SITE_URL}/first-visit` },
};

const STEPS = [
  {
    n: "01",
    title: "ID at the door, every time",
    body: "A valid, unexpired government-issued photo ID showing you're 21 or older. Driver's licence, passport, military ID. We check everyone, every visit, including people we know. It isn't personal — it's the licence.",
  },
  {
    n: "02",
    title: "Someone will actually talk to you",
    body: "You'll be greeted and asked what you're after. \"I don't know\" is a completely normal answer and the one we hear most. Tell us how you want to feel, or what you've tried that didn't work, and we'll go from there.",
  },
  {
    n: "03",
    title: "Ask anything. Genuinely",
    body: "Nobody here thinks less of you for not knowing what an indica is, or for asking what a milligram means. The people who ask the most questions leave with the thing that suits them best.",
  },
  {
    n: "04",
    title: "Bring a card or cash",
    body: "Cannabis is still federally illegal, so most dispensaries can't take ordinary credit cards. We'll say plainly on this page what we accept before we open — bring a debit card or cash to be safe.",
  },
  {
    n: "05",
    title: "There's a legal limit",
    body: "Massachusetts allows an adult to buy up to one ounce of cannabis in a single transaction, of which no more than five grams may be concentrate. We'll tell you where you are against that as we go.",
  },
  {
    n: "06",
    title: "Everything leaves in a sealed bag",
    body: "That's the rule, and it needs to stay sealed and out of reach in your vehicle — not on the passenger seat, not in your lap. Driving under the influence is a serious offence.",
  },
];

const FIRST_TIME = [
  {
    q: "Start low. Genuinely low.",
    a: "With an edible, that means 2 to 5 milligrams of THC — often a quarter or half of one gummy. Not a whole one. Not two.",
  },
  {
    q: "Then wait two hours before anything else.",
    a: "Edibles are slow and the delay catches almost everyone out. Most bad first experiences are somebody taking a second dose at the forty-minute mark because the first hadn't landed yet.",
  },
  {
    q: "You can't overdose fatally, but you can have a rotten few hours.",
    a: "Too much can mean anxiety, a racing heart, nausea and disorientation. It passes. Water, somewhere quiet, someone you trust nearby.",
  },
  {
    q: "Don't mix it with alcohol on your first go.",
    a: "The combination hits harder and less predictably than either on its own.",
  },
  {
    q: "Keep it locked away from children and pets.",
    a: "Edibles look like sweets because they are sweets. In case of accidental ingestion, call Poison Control on 1-800-222-1222, or 911.",
  },
];

export default function FirstVisitPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What do I need to bring to a dispensary in Massachusetts?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A valid, unexpired government-issued photo ID showing you are 21 or older — a driver's licence, passport or military ID. Everyone is checked on every visit. Bring a debit card or cash, because cannabis remains federally illegal and most dispensaries cannot accept ordinary credit cards.",
        },
      },
      {
        "@type": "Question",
        name: "How much cannabis can I buy at once in Massachusetts?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Massachusetts allows an adult 21 or older to purchase up to one ounce of cannabis in a single transaction, of which no more than five grams may be concentrate.",
        },
      },
      {
        "@type": "Question",
        name: "How much of an edible should I take the first time?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Start low and go slow: 2 to 5 milligrams of THC, which is often a quarter or half of a single gummy. Then wait a full two hours before taking any more. Edibles are slow to take effect and most difficult first experiences come from taking a second dose too early.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need to know what I want before I go to a dispensary?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. \"I don't know\" is the most common answer staff hear. Describing how you want to feel, or what you have tried before that did not suit you, is enough to start a useful conversation.",
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
              Your first visit
            </p>
            <h1 className="display mt-4 text-balance text-4xl font-medium text-white sm:text-5xl">
              Never done this before?{" "}
              <span className="italic font-light text-leaf-green-soft">
                Good. Read this.
              </span>
            </h1>
            <p className="mt-6 text-balance text-base leading-relaxed text-white/70 sm:text-lg">
              A lot of the people who&apos;ll walk through our door have never
              been in a dispensary. Here&apos;s exactly what happens, so nothing
              about it is a surprise.
            </p>
          </div>
        </section>

        <section className="bg-white px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-2xl">
            <h2 data-reveal className="display text-balance text-3xl font-medium text-charcoal-black sm:text-4xl">
              What actually happens.
            </h2>
            <ol className="mt-10 space-y-8">
              {STEPS.map((s) => (
                <li key={s.n} data-reveal className="flex gap-5">
                  <span
                    aria-hidden="true"
                    className="display shrink-0 text-2xl font-medium text-leaf-green/50"
                  >
                    {s.n}
                  </span>
                  <div className="min-w-0">
                    <h3 className="display text-xl font-semibold text-charcoal-black">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-base leading-relaxed text-charcoal-black/75">
                      {s.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-cream px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-2xl">
            <p data-reveal className="text-xs font-semibold uppercase tracking-[0.32em] text-leaf-green-deep">
              If it&apos;s your first time
            </p>
            <h2 data-reveal className="display mt-4 text-balance text-3xl font-medium text-charcoal-black sm:text-4xl">
              Start low. Go slow.{" "}
              <span className="italic font-light text-leaf-green-deep">
                We mean it.
              </span>
            </h2>
            <dl className="mt-10 space-y-7">
              {FIRST_TIME.map((f) => (
                <div key={f.q} data-reveal className="border-l-2 border-leaf-green/40 pl-5">
                  <dt className="text-base font-semibold text-charcoal-black">
                    {f.q}
                  </dt>
                  <dd className="mt-1.5 text-base leading-relaxed text-charcoal-black/75">
                    {f.a}
                  </dd>
                </div>
              ))}
            </dl>
            <p data-reveal className="mt-10 rounded-2xl bg-white px-5 py-4 text-sm leading-relaxed text-charcoal-black/65">
              This is general information, not medical advice. Cannabis affects
              people differently. If you&apos;re pregnant or breastfeeding, or you
              take prescription medication, talk to a doctor before using it.
            </p>
          </div>
        </section>

        <section className="bg-white px-6 py-20 sm:py-24">
          <div data-reveal className="mx-auto max-w-2xl text-center">
            <h2 className="display text-balance text-3xl font-medium text-charcoal-black sm:text-4xl">
              Still got a question?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-charcoal-black/70">
              Ring us on{" "}
              <a
                href={PHONE_TEL_HREF}
                className="font-medium text-leaf-green-deep underline decoration-leaf-green/40 underline-offset-4 hover:decoration-leaf-green-deep"
              >
                {PHONE_DISPLAY}
              </a>
              . We&apos;re at {ADDRESS_FULL}, and when we open our hours will be{" "}
              {HOURS_SENTENCE}.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/#waitlist"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-leaf-green px-7 text-base font-semibold text-white transition-colors hover:bg-leaf-green-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-green"
              >
                Get my Grand Opening invite
              </Link>
              <Link
                href="/faq"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-charcoal-black/20 px-7 text-base font-semibold text-charcoal-black/80 transition-colors hover:border-leaf-green hover:text-charcoal-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-green"
              >
                Read the FAQ
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
