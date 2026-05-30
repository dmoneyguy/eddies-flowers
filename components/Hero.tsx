// Hero — cinematic + alive. Slow-drifting gradient mesh, mouse-tracked warm
// spotlight, choreographed page-load entrance, massive display wordmark
// alongside the logo, live countdown to Summer 2026, and a magnetic CTA that
// pulls toward the cursor. All animations gated by prefers-reduced-motion.

import Image from "next/image";
import { HeroInteractive } from "./HeroInteractive";

// 5 drifting leaf instances at different sizes/paths/timing.
const LEAVES = [
  { left: "8%",  size: 110, opacity: 0.16, duration: 28, delay: 0,   xDrift: 80,  rotation: -12 },
  { left: "22%", size: 70,  opacity: 0.12, duration: 38, delay: 6,   xDrift: -40, rotation: 8 },
  { left: "50%", size: 140, opacity: 0.10, duration: 32, delay: 12,  xDrift: 30,  rotation: 22 },
  { left: "73%", size: 80,  opacity: 0.18, duration: 26, delay: 4,   xDrift: -70, rotation: -18 },
  { left: "90%", size: 100, opacity: 0.13, duration: 42, delay: 10,  xDrift: 50,  rotation: 14 },
];

export function Hero() {
  return (
    <section
      id="hero-canvas"
      className="mesh-canvas spotlight relative isolate overflow-hidden px-6 pt-24 pb-24 sm:pt-32 sm:pb-32"
    >
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
            style={{ filter: "brightness(0) invert(1)" }}
            aria-hidden="true"
          />
        </span>
      ))}

      {/* Background watermark leaf */}
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
        {/* Eyebrow date label with leaf accent + ray-burst halo */}
        <div data-enter style={{ ["--enter-delay" as string]: "0ms" }} className="ray-burst mb-6">
          <p className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.32em] text-leaf-green-soft">
            <span className="h-px w-8 bg-leaf-green/60" aria-hidden="true" />
            Coming Summer 2026
            <span className="h-px w-8 bg-leaf-green/60" aria-hidden="true" />
          </p>
        </div>

        {/* Massive display wordmark — appears above the logo lockup */}
        <h1 className="sr-only">Eddie&apos;s Flowers Dispensary — Ashburnham&apos;s new spot for flower, coming Summer 2026.</h1>
        <div
          data-enter
          style={{ ["--enter-delay" as string]: "120ms" }}
          aria-hidden="true"
          className="wordmark mb-2 select-none text-[clamp(3.5rem,12vw,9rem)]"
        >
          EDDIE&apos;S
        </div>
        <div
          data-enter
          style={{ ["--enter-delay" as string]: "240ms" }}
          aria-hidden="true"
          className="wordmark mb-10 select-none text-[clamp(3rem,10vw,7.5rem)] italic font-light"
        >
          Flowers.
        </div>

        {/* Logo lockup — kept small below the wordmark for brand reinforcement */}
        <Image
          data-enter
          style={{ ["--enter-delay" as string]: "360ms" } as React.CSSProperties}
          src="/logo-secondary.svg"
          alt=""
          width={520}
          height={300}
          priority
          className="h-auto w-[150px] opacity-80 sm:w-[200px]"
        />

        {/* Subhead — strapline */}
        <p
          data-enter
          style={{ ["--enter-delay" as string]: "480ms" }}
          className="display mt-10 max-w-3xl text-balance text-3xl font-light italic leading-tight text-white/85 sm:text-4xl md:text-5xl"
        >
          Ashburnham&apos;s new spot for{" "}
          <span className="not-italic font-medium text-leaf-green-soft">flower</span>.
        </p>

        <p
          data-enter
          style={{ ["--enter-delay" as string]: "600ms" }}
          className="mt-6 max-w-xl text-balance text-base leading-relaxed text-white/65 sm:text-lg"
        >
          A welcoming cannabis shop opening at{" "}
          <span className="whitespace-nowrap text-white">23 Rindge State Road</span>{" "}
          in Ashburnham, MA. Curated flower, honest answers, no marketing-speak.
        </p>

        {/* Live countdown card */}
        <div data-enter style={{ ["--enter-delay" as string]: "720ms" }} className="w-full max-w-md">
          <HeroInteractive />
        </div>

        {/* Primary CTA with leaf-glow + magnetic pull */}
        <div
          data-enter
          style={{ ["--enter-delay" as string]: "840ms" }}
          className="mt-10 flex flex-col items-center"
        >
          <a
            href="#waitlist"
            data-magnetic
            className="glow-leaf magnetic inline-flex items-center gap-2 rounded-full bg-leaf-green px-9 py-4 text-base font-semibold text-white sm:text-lg"
          >
            Get 10% off your first visit
            <span aria-hidden="true">→</span>
          </a>
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-white/40">
            Join the waitlist · No spam · One note when we open
          </p>
        </div>
      </div>

      {/* Bottom vignette fade to next section */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-charcoal-deep"
        aria-hidden="true"
      />
    </section>
  );
}
