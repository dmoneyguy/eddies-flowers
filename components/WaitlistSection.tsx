// Waitlist section — cream backdrop, ray-burst halo. Founding-member framing
// instead of explicit discount language. Compliant with MA CCC posture
// (no advertised price/discount promise on the public website).

import { WaitlistForm } from "./WaitlistForm";

export function WaitlistSection() {
  return (
    <section
      id="waitlist"
      className="relative isolate overflow-hidden px-6 py-24 sm:py-32"
      style={{ background: "var(--color-cream)" }}
    >
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
            ✶ Founding Members ✶
          </p>
        </span>

        <h2
          data-reveal
          className="display mt-5 text-balance text-4xl font-medium text-charcoal-black sm:text-5xl"
        >
          Be there when the{" "}
          <span className="italic font-light text-leaf-green-deep">
            doors open
          </span>.
        </h2>

        <p
          data-reveal
          className="mt-4 text-balance text-base text-charcoal-black/70"
        >
          One note from us the day we open — no spam, no shares, no list-selling. Ever.
        </p>
      </div>

      <div
        data-reveal
        className="relative mx-auto mt-12 max-w-xl rounded-3xl border border-charcoal-black/8 bg-white p-6 shadow-[0_24px_60px_-20px_rgba(115,190,68,0.30)] sm:p-10"
      >
        <div
          aria-hidden="true"
          className="absolute -top-px left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-leaf-green"
        />
        <WaitlistForm />
      </div>
    </section>
  );
}
