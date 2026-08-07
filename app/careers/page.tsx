import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { CareersForm } from "@/components/CareersForm";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.eddiesflower.com";

export const metadata: Metadata = {
  title: "Careers — We're Hiring",
  description:
    "Join the team at Eddie's Flowers Dispensary in Ashburnham, MA. We're hiring budtenders, keyholders, cannabis techs, and more for opening day. Must be 21+.",
  alternates: { canonical: `${SITE_URL}/careers` },
  openGraph: {
    title: "Careers at Eddie's Flowers",
    description:
      "We're hiring local staff in Ashburnham, MA. Budtenders, keyholders, cannabis techs, compliance and more.",
    url: `${SITE_URL}/careers`,
  },
};

export default function Careers() {
  return (
    <>
      <main id="main" className="bg-warm-beige">
        <section className="px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rustic-brown">
              Careers · We&apos;re Hiring
            </p>
            <h1 className="display mt-3 text-4xl font-extrabold text-charcoal-black sm:text-5xl">
              Help us open Eddie&apos;s Flowers.
            </h1>
            <div className="mt-6 space-y-4 text-lg text-charcoal-black/80">
              <p>
                We&apos;re hiring locally in Ashburnham and the surrounding North
                Worcester County towns. If you live nearby, love the work, and
                want to learn the Massachusetts cannabis industry from the ground
                up — we want to meet you.
              </p>
              <p>Roles we&apos;ll be filling:</p>
              <ul className="ml-6 list-disc space-y-1 text-base">
                <li><strong>Budtenders</strong> — full and part-time</li>
                <li><strong>Keyholders / shift leads</strong></li>
                <li><strong>Cannabis tech / inventory</strong></li>
                <li><strong>Compliance &amp; admin support</strong></li>
                <li><strong>Delivery driver</strong> (post-opening)</li>
                <li><strong>Security</strong></li>
              </ul>
              <p>
                Massachusetts cannabis retail requires all workers to be{" "}
                <strong>21 or older</strong> and registered with the Commonwealth.
                Prior cannabis experience is welcome but not required — what
                matters is showing up, working hard, and treating customers like
                neighbors.
              </p>
            </div>

            <div className="mt-10 rounded-2xl border-2 border-charcoal-black/10 bg-white p-6 sm:p-8">
              <h2 className="display text-2xl font-semibold text-charcoal-black">
                Apply
              </h2>
              <p className="mt-1 text-sm text-charcoal-black/60">
                Five minutes. We read every one.
              </p>
              <div className="mt-6">
                <CareersForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
