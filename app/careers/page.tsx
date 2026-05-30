import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { LeadForm } from "@/components/LeadForm";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join the team at Eddie's Flowers Dispensary in Ashburnham, MA. We're hiring budtenders, keyholders, and cannabis techs for opening Summer 2026.",
};

export default function Careers() {
  return (
    <>
      <main id="main" className="bg-warm-beige">
        <section className="px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rustic-brown">
              Careers
            </p>
            <h1 className="mt-3 text-4xl font-extrabold text-charcoal-black sm:text-5xl">
              Help us open Eddie&apos;s Flowers.
            </h1>
            <div className="mt-6 space-y-4 text-lg text-charcoal-black/80">
              <p>
                We&apos;re hiring for opening Summer 2026 in Ashburnham. We&apos;re
                looking for folks who like people, work hard, and want to learn the
                Massachusetts cannabis industry from the ground up.
              </p>
              <p>Roles we&apos;ll be filling:</p>
              <ul className="ml-6 list-disc space-y-1 text-base">
                <li>Budtenders (full and part-time)</li>
                <li>Keyholders / shift leads</li>
                <li>Cannabis tech / inventory</li>
                <li>Compliance &amp; admin support</li>
              </ul>
              <p>
                Drop your name and email and we&apos;ll be in touch as soon as we&apos;re
                ready to interview.
              </p>
            </div>

            <div className="mt-10 rounded-2xl border-2 border-charcoal-black/10 bg-white p-6 sm:p-8">
              <LeadForm
                source="careers"
                submitLabel="Send my application"
                successHeading="Thanks — we'll be in touch."
                successBody="We'll reach out as soon as we're scheduling interviews."
                messagePlaceholder="Which roles interest you? Any cannabis or retail experience?"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
