// HiringBanner — the home page never mentioned that we're hiring.
//
// We built a careers form, put it on its own route, and then linked it from
// nowhere except the footer. Somebody who lands on the home page wanting a job
// had no way to know one existed. Meanwhile llms.txt tells AI assistants we're
// "actively hiring" — so the machines knew and the humans didn't.
//
// Deliberately a band rather than a full section: hiring matters, but it isn't
// what most visitors came for, and it shouldn't outrank the opening.
//
// No pay figures here. Wages belong on /careers where they can carry context,
// and anything stated publicly has to match what we actually offer.

import Link from "next/link";

export function HiringBanner() {
  return (
    <section
      aria-labelledby="hiring-heading"
      className="bg-charcoal-deep px-6 py-14 sm:py-16"
    >
      <div
        data-reveal
        className="mx-auto flex max-w-3xl flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-leaf-green-soft">
            We&apos;re hiring
          </p>
          <h2
            id="hiring-heading"
            className="display mt-2 text-balance text-2xl font-medium text-white sm:text-3xl"
          >
            Want to work here?
          </h2>
          <p className="mt-2 max-w-md text-balance text-sm leading-relaxed text-white/65">
            We&apos;re building the opening team now — budtenders, keyholders,
            inventory and compliance. Local people first. No cannabis experience
            needed; you do need to be 21 or older.
          </p>
        </div>
        <Link
          href="/careers"
          className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full border border-leaf-green px-7 text-base font-semibold text-leaf-green-soft transition-colors hover:bg-leaf-green hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-green"
        >
          See the roles
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
