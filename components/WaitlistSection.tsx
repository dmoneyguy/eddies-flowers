// Waitlist section — wraps the client form in a server-rendered shell so we
// can describe the section semantically (heading + microcopy) without dragging
// the whole section into the client bundle. The 10% incentive is the headline.

import { WaitlistForm } from "./WaitlistForm";

export function WaitlistSection() {
  return (
    <section id="waitlist" className="bg-white px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-xl">
        <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-leaf-green">
          Founder Discount
        </p>
        <h2 className="mt-3 text-balance text-center text-3xl font-bold text-charcoal-black sm:text-4xl">
          Join the waitlist, get 10% off your first visit.
        </h2>
        <p className="mt-3 text-balance text-center text-base text-charcoal-black/70">
          We&apos;ll email you the day the doors open with your founder-discount code.
          One email. No spam, no shares, no list-selling — ever.
        </p>

        <div className="mt-8">
          <WaitlistForm />
        </div>
      </div>
    </section>
  );
}
