// TownCTA — shared final-CTA section. Anchors back to /#waitlist.
//
// "Save your spot, {town}." with the town name picked out in leaf-green-soft
// (matching the homepage accent pattern). Standard "no spam" subhead.

import Link from "next/link";

interface TownCTAProps {
  /** Display name picked out in leaf-green-soft, e.g. "Winchendon" / "Rindge". */
  townAccent: string;
}

export function TownCTA({ townAccent }: TownCTAProps) {
  return (
    <section className="relative isolate overflow-hidden bg-charcoal-deep px-6 py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 50% 100%, rgba(115,190,68,0.12), transparent 55%)",
        }}
      />

      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-leaf-green-soft">
          Be there when the doors open
        </p>

        <h2 className="display mt-5 text-balance text-4xl font-medium text-white sm:text-5xl">
          Save your spot,{" "}
          <span className="italic font-light text-leaf-green-soft">
            {townAccent}
          </span>
          .
        </h2>

        <p className="mt-6 max-w-xl text-balance text-base text-white/70 sm:text-lg">
          One note from us the day we open — no spam, no shares, no
          list-selling. Ever.
        </p>

        <Link
          href="/#waitlist"
          className="glow-leaf mt-10 inline-flex items-center gap-2 rounded-full bg-leaf-green px-8 py-4 text-base font-semibold text-white sm:text-lg"
        >
          Join the waitlist
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
