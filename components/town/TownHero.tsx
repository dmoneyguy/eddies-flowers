// TownHero — shared hero section for town landing pages.
//
// Lighter visual treatment than the homepage Hero (no mesh-canvas, no
// leaf-drift, no spotlight). Single column, centered, soft radial gradient
// on charcoal-deep. Props-driven so each town can supply its own strapline
// + green-accent word + subhead while reusing the chrome.

import Link from "next/link";
import type { ReactNode } from "react";

interface TownHeroProps {
  /** "Winchendon · MA" or "Rindge · NH" */
  eyebrow: string;
  /** Sentence lead-in, e.g. "A quieter dispensary, " */
  straplineLead: string;
  /** Single word accented in leaf-green-soft (matches the homepage "flower"
   *  accent pattern). E.g. "south" / "different" / "border" / "over" / "west". */
  straplineGreen: string;
  /** Subhead paragraph — typically address + catchment + tone. */
  subhead: ReactNode;
}

export function TownHero({
  eyebrow,
  straplineLead,
  straplineGreen,
  subhead,
}: TownHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-charcoal-deep px-6 pt-24 pb-20 sm:pt-32 sm:pb-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(115,190,68,0.12), transparent 55%), radial-gradient(circle at 80% 100%, rgba(255,208,15,0.05), transparent 60%)",
        }}
      />

      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <p className="ray-burst inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.32em] text-leaf-green-soft">
          <span className="h-px w-8 bg-leaf-green/60" aria-hidden="true" />
          {eyebrow}
          <span className="h-px w-8 bg-leaf-green/60" aria-hidden="true" />
        </p>

        <h1 className="display mt-8 text-balance text-5xl font-light italic leading-[1.05] text-white sm:text-6xl md:text-7xl">
          {straplineLead}
          <span className="not-italic font-medium text-leaf-green-soft">
            {straplineGreen}
          </span>
          .
        </h1>

        <p className="mt-8 max-w-2xl text-balance text-base leading-relaxed text-white/70 sm:text-lg">
          {subhead}
        </p>

        <Link
          href="/#waitlist"
          className="glow-leaf mt-10 inline-flex items-center gap-2 rounded-full bg-leaf-green px-8 py-4 text-base font-semibold text-white sm:text-lg"
        >
          Join the waitlist
          <span aria-hidden="true">→</span>
        </Link>
        <p className="mt-4 text-xs uppercase tracking-[0.2em] text-white/40">
          No spam · One note when we open
        </p>
      </div>
    </section>
  );
}
