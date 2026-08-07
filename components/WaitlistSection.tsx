// Grand Opening invitation section.
//
// "Founding member" used to appear here, in the marquee and in the success
// message with no explanation of what it meant. A visitor reasonably read that
// as "there is a benefit here" — and there cannot be one, because 935 CMR
// 500.105(4)(b)20 bars a licensed retailer from advertising discounts, points,
// coupons or loyalty programmes. So the site was implying a perk it was
// legally unable to deliver.
//
// The fix is to say plainly what it actually is. Early notice and being first
// through the door are genuinely worth something, and stating them beats
// hinting at something better that never arrives. THE THREE PROMISES BELOW
// ARE THE ONLY ONES ALLOWED HERE, and each is a notification or an ordering
// benefit, never a price, gift or reward:
//
//   1. You hear the opening date before it is announced anywhere else.
//   2. You're through the door on day one.
//   3. We text you the morning we open, if you ask us to.
//
// Do not add a fourth that involves money, product, points or priority pricing.
//
// This form also doubles as the opt-in email list contemplated by Ch. 65 of the
// Acts of 2026, s.21; that section is permissive only and the Commission has
// not acted on it, so no offer copy goes in here or in the emails until it does.

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
            ✶ Grand Opening ✶
          </p>
        </span>

        <h2
          data-reveal
          className="display mt-5 text-balance text-4xl font-medium text-charcoal-black sm:text-5xl"
        >
          You&apos;re invited to the{" "}
          <span className="italic font-light text-leaf-green-deep">
            Grand Opening
          </span>.
        </h2>

        <p
          data-reveal
          className="mt-4 text-balance text-base text-charcoal-black/70"
        >
          We call the people on this list founding members. Here is exactly what
          that means — no more, no less.
        </p>

        <ul
          data-reveal
          className="mx-auto mt-8 max-w-md space-y-3 text-left"
        >
          {[
            "You get the opening date and time before we announce it anywhere else.",
            "You're through the door on day one, ahead of the queue.",
            "If you want it, a text the morning we open — nothing else.",
          ].map((promise) => (
            <li key={promise} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-leaf-green text-white"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 13 4 4L19 7" />
                </svg>
              </span>
              <span className="text-sm leading-relaxed text-charcoal-black/75">
                {promise}
              </span>
            </li>
          ))}
        </ul>

        <p data-reveal className="mt-6 text-xs leading-relaxed text-charcoal-black/50">
          No spam, no shares, no list-selling. Ever. Massachusetts law doesn&apos;t
          let a dispensary offer discounts, points or rewards, so we don&apos;t
          pretend to — this is early notice, and that&apos;s all it is.
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
