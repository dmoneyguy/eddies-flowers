// Terms of Service — v1 scope. Reviewed by counsel before Part 1G publish.

import { Footer } from "@/components/Footer";

export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <>
      <main id="main" className="bg-white px-6 py-16">
        <article className="mx-auto max-w-2xl text-charcoal-black">
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          <p className="mt-2 text-sm text-charcoal-black/60">
            Last updated: May 26, 2026
          </p>

          <h2 className="mt-10 text-2xl font-bold">Acceptance</h2>
          <p className="mt-3 leading-relaxed">
            By using eddiesflower.com you agree to these terms. If you don&apos;t agree,
            don&apos;t use the site.
          </p>

          <h2 className="mt-8 text-2xl font-bold">What this site is</h2>
          <p className="mt-3 leading-relaxed">
            eddiesflower.com is an informational marketing site for Eddie&apos;s
            Flowers Dispensary, a Massachusetts-licensed adult-use marijuana retailer
            (License #MRN284579, Provisional) preparing to open at 23 Rindge State
            Road, Ashburnham, MA 01430.
          </p>
          <p className="mt-3 leading-relaxed">
            You cannot buy cannabis on this site. When the dispensary opens, sales
            happen in-store and through a separate licensed online ordering platform.
            Massachusetts law requires you to be 21 or older to purchase, possess, or
            consume adult-use cannabis.
          </p>

          <h2 className="mt-8 text-2xl font-bold">Acceptable use</h2>
          <p className="mt-3 leading-relaxed">
            Don&apos;t attempt to scrape, overload, or break the site. Don&apos;t use the
            waitlist form to submit other people&apos;s email addresses, abusive content,
            or commercial solicitations. We reserve the right to remove any signup
            that violates these terms.
          </p>

          <h2 className="mt-8 text-2xl font-bold">No medical or legal advice</h2>
          <p className="mt-3 leading-relaxed">
            Content on this site is informational only. It is not medical advice and
            does not establish a doctor-patient or attorney-client relationship.
            Cannabis affects people differently. Consult your healthcare provider
            about your specific situation, especially if you are pregnant,
            breastfeeding, or taking medications.
          </p>

          <h2 className="mt-8 text-2xl font-bold">No warranties</h2>
          <p className="mt-3 leading-relaxed">
            The site is provided &quot;as is&quot; without warranties of any kind, express
            or implied. We make no guarantees about uptime, accuracy of dispensary
            opening dates, or the availability of any product when we open.
          </p>

          <h2 className="mt-8 text-2xl font-bold">Limitation of liability</h2>
          <p className="mt-3 leading-relaxed">
            To the maximum extent permitted by law, Eddie&apos;s Flowers, Inc., its
            officers, employees, and operators (including Legacy Operations) are not
            liable for any indirect, incidental, consequential, or punitive damages
            arising out of your use of the site.
          </p>

          <h2 className="mt-8 text-2xl font-bold">Governing law</h2>
          <p className="mt-3 leading-relaxed">
            These terms are governed by the laws of the Commonwealth of Massachusetts,
            without regard to its conflict-of-law principles. Disputes shall be
            resolved in state or federal courts located in Massachusetts.
          </p>

          <h2 className="mt-8 text-2xl font-bold">Changes</h2>
          <p className="mt-3 leading-relaxed">
            We may update these terms from time to time. Updates take effect when
            posted here.
          </p>

          <h2 className="mt-8 text-2xl font-bold">Contact</h2>
          <p className="mt-3 leading-relaxed">
            Questions?{" "}
            <a
              className="text-leaf-green underline hover:no-underline"
              href="mailto:hello@eddiesflower.com"
            >
              hello@eddiesflower.com
            </a>
            .
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
