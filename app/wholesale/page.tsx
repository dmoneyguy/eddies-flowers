import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { LeadForm } from "@/components/LeadForm";

export const metadata: Metadata = {
  title: "Wholesale & Brand Partnerships",
  description:
    "Wholesale and brand-partnership inquiries for Eddie's Flowers Dispensary, opening Summer 2026 in Ashburnham, MA.",
};

export default function Wholesale() {
  return (
    <>
      <main id="main" className="bg-warm-beige">
        <section className="px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rustic-brown">
              For Brands &amp; Cultivators
            </p>
            <h1 className="mt-3 text-4xl font-extrabold text-charcoal-black sm:text-5xl">
              Pitch us for opening-day shelf.
            </h1>
            <div className="mt-6 space-y-4 text-lg text-charcoal-black/80">
              <p>
                We&apos;re building Eddie&apos;s Flowers around quality flower, real
                conversations, and a tight curated menu. We&apos;re looking at:
              </p>
              <ul className="ml-6 list-disc space-y-1 text-base">
                <li>MA-licensed cultivators (flower, pre-rolls)</li>
                <li>Concentrates, vape, and infused pre-rolls</li>
                <li>Edibles &amp; gummies</li>
                <li>Topicals &amp; non-flower wellness SKUs</li>
              </ul>
              <p>
                Send us your brand info, MA license, current price/MOQ sheet, and
                a sample request — we&apos;ll be in touch as we get closer to
                opening.
              </p>
            </div>

            <div className="mt-10 rounded-2xl border-2 border-charcoal-black/10 bg-white p-6 sm:p-8">
              <LeadForm
                source="wholesale_inquiry"
                submitLabel="Send your pitch"
                successHeading="Thanks — we'll review and reply."
                successBody="We'll follow up as we firm up our opening menu."
                messagePlaceholder="What brand, what categories, MA license #, MOQ, and how we should sample?"
                messageRequired
                orgLabel="Brand / company"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
