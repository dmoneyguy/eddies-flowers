// Founder note — feels like a letter on warm paper. Real handwriting font for
// the signature (Caveat), pull-quote treatment on the core line, paper grain
// background. The whole section reads like a printed-and-mailed note, not a
// CMS block.

export function FounderNote() {
  return (
    <section
      id="from-eddie"
      className="paper relative isolate overflow-hidden px-6 py-24 sm:py-32"
    >
      <div data-reveal className="relative z-10 mx-auto max-w-2xl">
        {/* Quote-mark accent */}
        <div
          aria-hidden="true"
          className="display absolute -top-12 left-0 select-none text-9xl leading-none text-rustic-brown/15 sm:-top-16 sm:text-[10rem]"
        >
          &ldquo;
        </div>

        <p className="relative text-sm font-semibold uppercase tracking-[0.28em] text-rustic-brown">
          A note from Eddie
        </p>

        <div className="mt-8 space-y-6 text-lg leading-relaxed text-charcoal-black sm:text-xl">
          <p>Hi — I&apos;m Eddie.</p>

          <p>
            After a long road, we&apos;re almost ready. Eddie&apos;s Flowers
            Dispensary opens soon at 23 Rindge State Road, right here
            in Ashburnham.
          </p>

          {/* Pull quote — serif italic, larger leading */}
          <p className="display border-l-4 border-leaf-green/50 pl-5 text-2xl italic leading-snug text-charcoal-deep sm:text-3xl">
            I built this place because I wanted somewhere folks could walk in,
            ask real questions, and walk out with something they actually enjoy.
          </p>

          <p>
            No pressure. No marketing-speak. Just good flowers, honest answers,
            and a friendly conversation.
          </p>

          <p>
            <a
              href="#waitlist"
              className="font-medium text-leaf-green-deep underline decoration-leaf-green/40 underline-offset-4 hover:decoration-leaf-green-deep"
            >
              Ask for a Grand Opening invitation
            </a>{" "}
            and I&apos;ll send you the date and time before we announce it
            anywhere else, so you&apos;re among the first through the door. No spam,
            no list-selling — just a note from me.
          </p>
        </div>

        {/* Handwritten signature */}
        <p className="script mt-10 text-5xl leading-none text-leaf-green-deep sm:text-6xl">
          — Eddie
        </p>
      </div>
    </section>
  );
}
