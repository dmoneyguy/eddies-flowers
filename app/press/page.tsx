import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { LeadForm } from "@/components/LeadForm";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://eddiesflower.com";

export const metadata: Metadata = {
  alternates: { canonical: `${SITE_URL}/press` },
  title: "Press",
  description:
    "Press, media, and partnership inquiries for Eddie's Flowers Dispensary, opening soon in Ashburnham, MA.",
};

export default function Press() {
  return (
    <>
      <main id="main" className="bg-warm-beige">
        <section className="px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rustic-brown">
              Press &amp; Media
            </p>
            <h1 className="mt-3 text-4xl font-extrabold text-charcoal-black sm:text-5xl">
              Writing about us?
            </h1>
            <div className="mt-6 space-y-4 text-lg text-charcoal-black/80">
              <p>
                Reporters, photographers, and local-news folks covering the
                opening of Eddie&apos;s Flowers Dispensary in Ashburnham — we&apos;re
                happy to help.
              </p>
              <p>Quick facts:</p>
              <ul className="ml-6 list-disc space-y-1 text-base">
                <li>Massachusetts Licensed Adult-Use Retailer #MRN284579 (Provisional)</li>
                <li>Location: 23 Rindge State Road, Ashburnham, MA 01430</li>
                <li>Phone: (978) 883-4026</li>
                <li>Email: info@eddiesflower.com</li>
                <li>Website: https://eddiesflower.com</li>
                <li>Planned hours: 8:30 AM – 10:00 PM daily</li>
                <li>Opening: soon</li>
                <li>Operator: Legacy Operations</li>
              </ul>
              <p>
                For interviews, photos, opening-week previews, or anything else —
                send a note below and we&apos;ll reply within a couple business days.
              </p>
            </div>

            <div className="mt-10 rounded-2xl border-2 border-charcoal-black/10 bg-white p-6 sm:p-8">
              <LeadForm
                source="contact_form"
                submitLabel="Send your inquiry"
                successHeading="Thanks for reaching out."
                successBody="We'll reply within a couple business days."
                messagePlaceholder="Tell us about your story, outlet, and deadline."
                messageRequired
                orgLabel="Publication / outlet"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
