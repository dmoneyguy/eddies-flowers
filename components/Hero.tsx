// Hero — cinematic charcoal canvas with ambient leaf-drift, gradient mesh,
// and a dramatic serif headline. Heavy visual weight up top so the rest of
// the page can be quieter and warmer.

import Image from "next/image";

// 5 drifting leaf instances at different sizes, opacities, paths, and timing.
// Each gets randomized via CSS custom properties — keeps the visual ambient
// feel without JS or per-frame work.
const LEAVES = [
  { left: "8%",  size: 110, opacity: 0.16, duration: 28, delay: 0,   xDrift: 80,  rotation: -12 },
  { left: "22%", size: 70,  opacity: 0.12, duration: 38, delay: 6,   xDrift: -40, rotation: 8 },
  { left: "50%", size: 140, opacity: 0.10, duration: 32, delay: 12,  xDrift: 30,  rotation: 22 },
  { left: "73%", size: 80,  opacity: 0.18, duration: 26, delay: 4,   xDrift: -70, rotation: -18 },
  { left: "90%", size: 100, opacity: 0.13, duration: 42, delay: 10,  xDrift: 50,  rotation: 14 },
];

export function Hero() {
  return (
    <section className="hero-canvas relative isolate overflow-hidden px-6 pt-24 pb-20 sm:pt-32 sm:pb-28">
      {/* Ambient drifting leaves */}
      {LEAVES.map((leaf, i) => (
        <span
          key={i}
          className="leaf-drift"
          style={{
            left: leaf.left,
            ["--d" as string]: `${leaf.duration}s`,
            ["--delay" as string]: `${leaf.delay}s`,
            ["--o" as string]: leaf.opacity,
            ["--dx" as string]: `${leaf.xDrift}px`,
            ["--r" as string]: `${leaf.rotation}deg`,
            ["--s" as string]: 1,
          }}
        >
          <Image
            src="/icons/cannabis-leaf.svg"
            alt=""
            width={leaf.size}
            height={leaf.size}
            style={{
              filter: "brightness(0) invert(1)",
            }}
            aria-hidden="true"
          />
        </span>
      ))}

      {/* Single large leaf as faint background watermark */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center opacity-[0.04]"
        aria-hidden="true"
      >
        <Image
          src="/icons/cannabis-leaf.svg"
          alt=""
          width={1100}
          height={1100}
          className="scale-150"
          priority={false}
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
        {/* Eyebrow date label with leaf accent and ray-burst halo */}
        <div data-reveal className="ray-burst mb-6">
          <p className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.32em] text-leaf-green-soft">
            <span className="h-px w-8 bg-leaf-green/60" aria-hidden="true" />
            Coming Summer 2026
            <span className="h-px w-8 bg-leaf-green/60" aria-hidden="true" />
          </p>
        </div>

        {/* Logo lockup */}
        <Image
          data-reveal
          src="/logo-secondary.svg"
          alt="Eddie's Flowers Dispensary"
          width={520}
          height={300}
          priority
          className="h-auto w-[260px] sm:w-[360px] md:w-[440px]"
        />

        {/* Dramatic serif headline */}
        <h1
          data-reveal
          className="display mt-10 max-w-3xl text-balance text-5xl font-medium text-white sm:text-6xl md:text-7xl"
        >
          Ashburnham&apos;s new spot for{" "}
          <span className="italic font-light text-leaf-green-soft">flower</span>.
        </h1>

        {/* Subhead */}
        <p
          data-reveal
          className="mt-6 max-w-2xl text-balance text-base leading-relaxed text-white/70 sm:text-lg"
        >
          A welcoming cannabis shop opening at{" "}
          <span className="whitespace-nowrap text-white">23 Rindge State Road</span>{" "}
          in Ashburnham, MA. Curated flower, honest answers, no marketing-speak.
        </p>

        {/* Primary CTA with leaf-glow */}
        <a
          data-reveal
          href="#waitlist"
          className="glow-leaf mt-10 inline-flex items-center gap-2 rounded-full bg-leaf-green px-8 py-4 text-base font-semibold text-white sm:text-lg"
        >
          Get 10% off your first visit
          <span aria-hidden="true">→</span>
        </a>
        <p
          data-reveal
          className="mt-4 text-xs uppercase tracking-[0.2em] text-white/40"
        >
          Join the waitlist · No spam · One note when we open
        </p>
      </div>

      {/* Bottom-fade vignette so the marquee blends in cleanly */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-charcoal-deep"
        aria-hidden="true"
      />
    </section>
  );
}
