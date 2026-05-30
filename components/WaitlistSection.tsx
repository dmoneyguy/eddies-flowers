// Waitlist section — wraps the client form in a server-rendered shell so we
// can describe the section semantically (heading + microcopy) without dragging
// the whole section into the client bundle.

import { WaitlistForm } from "./WaitlistForm";

export function WaitlistSection() {
  return (
    <section id="waitlist" className="bg-white px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-xl">
        <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-leaf-green">
          Join the waitlist
        </p>
        <h2 className="mt-3 text-center text-3xl font-bold text-charcoal-black sm:text-4xl">
          Be there when the doors open.
        </h2>
        <p className="mt-3 text-center text-base text-charcoal-black/70">
          One email when we open. Nothing else.
        </p>

        <div className="mt-8">
          <WaitlistForm />
        </div>
      </div>
    </section>
  );
}
