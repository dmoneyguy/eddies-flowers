// Hero — first thing visitors see. Charcoal canvas, primary logo at scale,
// "Coming Soon to Ashburnham, MA" framing. Subtle cannabis-leaf texture
// behind the logo at low opacity so the leaf isn't competing with the mark.

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
        {/* Primary logo lockup. Brand-book minimum digital size 140px; we run
            larger on hero (~ 320px) and let it scale down on mobile. */}
        <Image
          src="/logo-secondary.svg"
          alt="Eddie's Flowers Dispensary"
          width={520}
          height={300}
          priority
          className="h-auto w-[260px] sm:w-[360px] md:w-[440px]"
        />

        <p className="mt-10 text-sm font-semibold uppercase tracking-[0.2em] text-leaf-green">
          Coming Soon
        </p>
        <h1 className="mt-3 text-balance text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl md:text-6xl">
          Ashburnham&apos;s new spot for flower, opening soon.
        </h1>
        <p className="mt-6 max-w-2xl text-balance text-base leading-relaxed text-white/70 sm:text-lg">
          A welcoming cannabis shop with a country-store feel, opening at{" "}
          <span className="whitespace-nowrap text-white">23 Rindge State Road</span> in Ashburnham, MA.
          Drop your email below — we&apos;ll let you know the day the doors open.
        </p>
      </div>
    </section>
  );
}
