// Hero — first thing visitors see. Charcoal canvas, primary logo at scale,
// "Coming Summer 2026" framing with a primary CTA button that anchor-jumps
// to the waitlist section. The 10% founder discount becomes the page's first
// hard CTA, not just a passive "drop your email" suggestion.

import Image from "next/image";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-charcoal-black px-6 pt-20 pb-16 sm:pt-28 sm:pb-20">
      {/* Background texture — single large leaf, very low opacity, off-center */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-end opacity-[0.06]"
        aria-hidden="true"
      >
        <Image
          src="/icons/cannabis-leaf.svg"
          alt=""
          width={900}
          height={900}
          className="translate-x-1/3 scale-150"
          priority={false}
        />
      </div>

      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <Image
          src="/logo-secondary.svg"
          alt="Eddie's Flowers Dispensary"
          width={520}
          height={300}
          priority
          className="h-auto w-[260px] sm:w-[360px] md:w-[440px]"
        />

        <p className="mt-10 text-sm font-semibold uppercase tracking-[0.2em] text-leaf-green">
          Coming Summer 2026
        </p>
        <h1 className="mt-3 text-balance text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl md:text-6xl">
          Ashburnham&apos;s new spot for flower.
        </h1>
        <p className="mt-6 max-w-2xl text-balance text-base leading-relaxed text-white/70 sm:text-lg">
          A welcoming cannabis shop opening Summer 2026 at{" "}
          <span className="whitespace-nowrap text-white">23 Rindge State Road</span> in Ashburnham, MA.
        </p>

        <a
          href="#waitlist"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-leaf-green px-7 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-leaf-green/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-green sm:text-lg"
        >
          Get 10% off your first visit
          <span aria-hidden="true">→</span>
        </a>
        <p className="mt-3 text-xs uppercase tracking-wider text-white/50">
          Join the waitlist · No spam · One email when we open
        </p>
      </div>
    </section>
  );
}
