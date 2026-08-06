import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { ReviewFeedbackForm } from "@/components/ReviewFeedbackForm";

/**
 * /review — the destination for the QR code on the back of the vape-insert
 * business card. The card is ink on paper and cannot be changed once printed,
 * so the QR points here and this page decides where people go.
 *
 * TO GO LIVE: set REVIEW_URL in the Vercel project to the Google review short
 * link (https://g.page/r/.../review) and redeploy. Until it is set, the public
 * option renders as "opens when we do" rather than a dead link.
 *
 * THIS PAGE IS DELIBERATELY NOT A REVIEW GATE. It does not ask how the visit
 * went and then route people. Every visitor sees both the public review link
 * and the private feedback form, at the same visual weight. Google's guideline
 * is "Don't discourage or prohibit negative reviews or selectively solicit
 * positive reviews from customers," and Google enforces it by retroactively
 * deleting a business's reviews. Do not reorder, hide, or condition these two
 * options on sentiment.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://eddiesflower.com";
const REVIEW_URL = process.env.REVIEW_URL?.trim();

export const metadata: Metadata = {
  title: "How was your visit?",
  description:
    "Tell us how we did at Eddie's Flowers Dispensary in Ashburnham, MA — publicly or privately, your choice.",
  alternates: { canonical: `${SITE_URL}/review` },
  robots: { index: false, follow: false },
};

export default function Review() {
  return (
    <>
      <main id="main" className="bg-warm-beige">
        <section className="px-6 py-16 sm:py-24">
          <div className="mx-auto max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rustic-brown">
              Eddie&apos;s Flowers · Ashburnham
            </p>
            <h1 className="display mt-3 text-4xl font-extrabold text-charcoal-black sm:text-5xl">
              How was your visit?
            </h1>
            <p className="mt-4 text-lg text-text-muted">
              Two ways to tell us, and they are equally welcome. Say it in public where
              it helps other people decide, or say it straight to us. Good or bad, we
              would rather hear it than not.
            </p>

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {/* Door 1 — public review */}
              <div className="flex flex-col rounded-2xl border border-border bg-white p-6">
                <h2 className="text-xl font-bold text-charcoal-black">Leave a public review</h2>
                <p className="mt-2 flex-1 text-base text-text-muted">
                  Helps the next person work out whether to make the drive.
                </p>
                {REVIEW_URL ? (
                  <a
                    href={REVIEW_URL}
                    rel="noopener noreferrer"
                    className="mt-5 inline-block rounded-full bg-leaf-green px-6 py-3 text-center text-base font-semibold text-charcoal-deep"
                  >
                    Write a review
                  </a>
                ) : (
                  <p className="mt-5 rounded-full bg-warm-beige px-6 py-3 text-center text-base font-semibold text-text-muted">
                    Opens when we do
                  </p>
                )}
              </div>

              {/* Door 2 — private feedback */}
              <div className="flex flex-col rounded-2xl border border-border bg-white p-6">
                <h2 className="text-xl font-bold text-charcoal-black">Tell us directly</h2>
                <p className="mt-2 flex-1 text-base text-text-muted">
                  Comes to us, not to the internet. A person reads every one.
                </p>
                <a
                  href="#tell-us"
                  className="mt-5 inline-block rounded-full border-2 border-charcoal-black px-6 py-3 text-center text-base font-semibold text-charcoal-black"
                >
                  Send us a note
                </a>
              </div>
            </div>

            <div id="tell-us" className="mt-12 scroll-mt-8 rounded-2xl border border-border bg-cream p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-charcoal-black">Tell us directly</h2>
              <p className="mt-2 mb-6 text-base text-text-muted">
                If something went wrong, this is the fastest way to get it fixed. If
                something went right, tell us who did it — we pass it on.
              </p>
              <ReviewFeedbackForm />
            </div>

            <p className="mt-10 text-sm text-text-muted">
              Both options are open to everyone, whatever you have to say. We do not
              screen who gets asked for a review, and we never offer anything in
              exchange for one.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
