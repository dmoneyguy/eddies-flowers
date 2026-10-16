import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { VendorIntakeForm } from "@/components/VendorIntakeForm";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.eddiesflower.com";

export const metadata: Metadata = {
  alternates: { canonical: `${SITE_URL}/wholesale` },
  title: "Vendors & Brand Partnerships",
  description:
    "Pitch your brand for opening-day shelf at Eddie's Flowers Dispensary in Ashburnham, MA. Vendor open house Monday 10/19, 12–5 PM.",
};

export default function Wholesale() {
  return (
    <>
      <main id="main" className="bg-warm-beige">
        <section className="px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rustic-brown">
              For Brands &amp; Cultivators
            </p>
            <h1 className="mt-3 text-4xl font-extrabold text-charcoal-black sm:text-5xl">
              Pitch us for opening-day shelf.
            </h1>
            <div className="mt-6 space-y-4 text-lg text-charcoal-black/80">
              <p>
                We&apos;re building a 250-product opening menu around one rule: whatever a customer
                wants to spend, however they like to consume, whatever effect they&apos;re after,
                they walk out with two or three great choices.
              </p>
              <p>
                Tell us about your company, your products and wholesale pricing, and what you&apos;ll
                put behind your brand. Social equity and local operators get priority.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border-2 border-charcoal-black bg-charcoal-black p-6 text-warm-beige sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sunshine-yellow">
                Vendor open house
              </p>
              <p className="mt-2 text-2xl font-extrabold">Monday, October 19 · 12–5 PM</p>
              <p className="mt-2 text-base text-warm-beige/80">
                Eddie&apos;s Flowers, Ashburnham MA. Bring your menu — submit the form first so we
                can have your numbers ready. Can&apos;t make it? Pick &ldquo;Set up a Teams call&rdquo; below.
              </p>
            </div>

            <div className="mt-10 rounded-2xl border-2 border-charcoal-black/10 bg-white p-6 sm:p-8">
              <VendorIntakeForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
