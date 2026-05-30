// Waitlist section — cream backdrop (warmer than pure white), ray-burst halo
// behind the eyebrow label, dramatic serif H2, the form itself gets soft
// elevation via shadow + a leaf-green accent stripe.

import { WaitlistForm } from "./WaitlistForm";

export function WaitlistSection() {
  return (
    <section
      id="waitlist"
      className="relative isolate overflow-hidden px-6 py-24 sm:py-32"
      style={{ background: "var(--color-cream)" }}
    >
      {/* Soft top-light radial */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64"
        style={{
          background:
            "radial-gradient(ellipse at center top, rgba(115,190,68,0.10), transparent 70%)",
        }}
      />

      <div data-reveal className="mx-auto max-w-xl text-center">
        <span className="ray-burst inline-block">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-leaf-green-deep">
            ✶ Founder Discount ✶
          </p>
        </span>

        <h2
          data-reveal
          className="display mt-5 text-balance text-4xl font-medium text-charcoal-black sm:text-5xl"
        >
          Join the waitlist,{" "}
          <span className="italic font-light text-leaf-green-deep">
            get 10% off
          </span>{" "}
          your first visit.
        </h2>

        <p
          data-reveal
          className="mt-4 text-balance text-base text-charcoal-black/70"
        >
          We&apos;ll email or text you the day the doors open with your
          founder-discount code. One note. No spam, no shares, no list-selling.
        </p>
      </div>

      <div
        data-reveal
        className="relative mx-auto mt-12 max-w-xl rounded-3xl border border-charcoal-black/8 bg-white p-6 shadow-[0_24px_60px_-20px_rgba(115,190,68,0.30)] sm:p-10"
      >
        {/* Top accent stripe */}
        <div
          aria-hidden="true"
          className="absolute -top-px left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-leaf-green"
        />
        <WaitlistForm />
      </div>
    </section>
  );
}
