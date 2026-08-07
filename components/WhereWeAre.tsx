// WhereWeAre — the answer to the only question every visitor actually has.
//
// The site previously said "Opening Soon" in four places and "TBD" in
// llms.txt. All honest, none useful: a visitor left knowing exactly what they
// knew before arriving. There is a lot of room between promising a date and
// saying nothing, and that room is where trust gets built.
//
// EVERY CLAIM BELOW MUST STAY TRUE. This is a licensed cannabis retailer's
// public statement about its own licensing status, and a regulator can read
// it as easily as a customer can.
//
//   "building is finished"      — Certificate of Occupancy issued 6 July 2026
//                                 under Building Permit B-25-178.
//   "final inspection"          — the Post-Provisional Licence Inspection. We
//                                 request it; the Commission schedules it.
//   "they set the date, not us" — true and worth saying: it explains the
//                                 vagueness instead of leaving it hanging.
//
// WHAT MUST NOT GO IN HERE:
//   - Any specific opening date, until the Commission gives us one. Our own
//     model puts the realistic open at 1 February 2027 and that is a model,
//     not a promise.
//   - Any claim that the final licence has issued. It has not.
//   - Any offer, discount, reward or price — 935 CMR 500.105(4)(b)18 and (20).
//
// If the licence status changes, change this file. A stale status block is
// worse than no status block.

const STEPS = [
  {
    label: "Provisional licence",
    detail: "Granted by the Cannabis Control Commission.",
    state: "done",
  },
  {
    label: "The building",
    detail:
      "Finished and signed off. We hold the certificate of occupancy from the Town of Ashburnham.",
    state: "done",
  },
  {
    label: "Final state inspection",
    detail:
      "The last real step. The Commission schedules it — that date is theirs to set, not ours.",
    state: "current",
  },
  {
    label: "Doors open",
    detail:
      "The people on our list hear the date and time before we announce it anywhere else.",
    state: "next",
  },
] as const;

export function WhereWeAre() {
  return (
    <section
      id="where-we-are"
      className="border-y border-charcoal-black/10 bg-white px-6 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-2xl">
        <p
          data-reveal
          className="text-center text-xs font-semibold uppercase tracking-[0.32em] text-leaf-green-deep"
        >
          Where we are
        </p>
        <h2
          data-reveal
          className="display mt-4 text-balance text-center text-3xl font-medium text-charcoal-black sm:text-4xl"
        >
          Everyone asks when.{" "}
          <span className="italic font-light text-leaf-green-deep">
            Here&apos;s the honest answer.
          </span>
        </h2>
        <p
          data-reveal
          className="mx-auto mt-4 max-w-xl text-balance text-center text-base text-charcoal-black/70"
        >
          We don&apos;t have a date yet, and we&apos;d rather tell you exactly
          where we stand than keep saying &ldquo;soon.&rdquo;
        </p>

        <ol data-reveal className="mt-12 space-y-0">
          {STEPS.map((step, i) => {
            const done = step.state === "done";
            const current = step.state === "current";
            return (
              <li key={step.label} className="relative flex gap-5 pb-10 last:pb-0">
                {/* connector */}
                {i < STEPS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className={
                      "absolute left-[15px] top-9 h-full w-px " +
                      (done ? "bg-leaf-green/40" : "bg-charcoal-black/12")
                    }
                  />
                )}
                <span
                  aria-hidden="true"
                  className={
                    "relative z-10 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 " +
                    (done
                      ? "border-leaf-green bg-leaf-green text-white"
                      : current
                        ? "border-leaf-green bg-white text-leaf-green-deep"
                        : "border-charcoal-black/15 bg-white text-charcoal-black/30")
                  }
                >
                  {done ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m5 13 4 4L19 7" />
                    </svg>
                  ) : (
                    <span className={"h-2.5 w-2.5 rounded-full " + (current ? "bg-leaf-green" : "bg-charcoal-black/25")} />
                  )}
                </span>

                <div className="min-w-0 pt-0.5">
                  <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-base font-semibold text-charcoal-black">
                    {step.label}
                    {done && (
                      <span className="rounded-full bg-leaf-green/12 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-leaf-green-deep">
                        Done
                      </span>
                    )}
                    {current && (
                      <span className="rounded-full bg-sunshine-yellow/25 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-rustic-brown">
                        We&apos;re here
                      </span>
                    )}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-charcoal-black/70">
                    {step.detail}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        <p
          data-reveal
          className="mt-10 rounded-2xl bg-charcoal-black/[0.04] px-5 py-4 text-center text-sm leading-relaxed text-charcoal-black/70"
        >
          Nothing is for sale here yet, and nothing can be until that final
          licence is in hand. That&apos;s the law, and we&apos;re not going to
          pretend otherwise to get you in the door sooner.
        </p>
      </div>
    </section>
  );
}
