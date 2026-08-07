// Hero — cinematic + alive. Logo lockup, mesh-drift gradient, mouse-tracked
// spotlight, page-load entrance choreography, magnetic CTA. No countdown
// (opening date isn't pinned yet).

import Image from "next/image";
import { HeroInteractive } from "./HeroInteractive";

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
      className="mesh-canvas spotlight relative isolate overflow-hidden px-6 pt-20 pb-24 sm:pt-28 sm:pb-32"
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

      <h1 className="sr-only">Eddie&apos;s Flowers Dispensary — Ashburnham&apos;s new spot for flower.</h1>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
        {/* Eyebrow with leaf accent + ray-burst halo */}
        <div data-enter style={{ ["--enter-delay" as string]: "0ms" }} className="ray-burst mb-8">
          <p className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.32em] text-leaf-green-soft">
            <span className="h-px w-8 bg-leaf-green/60" aria-hidden="true" />
            Coming Soon to Ashburnham
            <span className="h-px w-8 bg-leaf-green/60" aria-hidden="true" />
          </p>
        </div>

        {/* Logo lockup — primary brand element on transparent SVG */}
        <Image
          data-enter
          style={{ ["--enter-delay" as string]: "120ms" } as React.CSSProperties}
          src="/logo-secondary.svg"
          alt="Eddie's Flowers Dispensary"
          width={520}
          height={300}
          priority
          className="h-auto w-[280px] sm:w-[400px] md:w-[480px]"
        />

        {/* Strapline */}
        <p
          data-enter
          style={{ ["--enter-delay" as string]: "260ms" }}
          className="display mt-12 max-w-3xl text-balance text-3xl font-light italic leading-tight text-white/85 sm:text-4xl md:text-5xl"
        >
          Ashburnham&apos;s new spot for{" "}
          <span className="not-italic font-medium text-leaf-green-soft">flower</span>.
        </p>

        <p
          data-enter
          style={{ ["--enter-delay" as string]: "400ms" }}
          className="mt-6 max-w-xl text-balance text-base leading-relaxed text-white/65 sm:text-lg"
        >
          A welcoming cannabis shop opening at{" "}
          <span className="whitespace-nowrap text-white">23 Rindge State Road</span>{" "}
          in Ashburnham, MA. Curated flower, honest answers, no marketing-speak.
        </p>

        {/* Factual positioning line — voice-matched serif italic, leaf-green-soft on "only" */}
        <p
          data-enter
          style={{ ["--enter-delay" as string]: "540ms" }}
          className="display mt-4 max-w-xl text-balance text-xl font-light italic leading-tight text-white/85 sm:text-2xl"
        >
          The{" "}
          <span className="not-italic font-medium text-leaf-green-soft">
            only
          </span>{" "}
          dispensary in Ashburnham, MA
        </p>

        {/* Primary CTA — glow + magnetic */}
        <div
          data-enter
          style={{ ["--enter-delay" as string]: "680ms" }}
          className="mt-10 flex flex-col items-center"
        >
          <a
            href="#waitlist"
            data-magnetic
            className="glow-leaf magnetic inline-flex items-center gap-2 rounded-full bg-leaf-green px-9 py-4 text-base font-semibold text-white sm:text-lg"
          >
            Get my Grand Opening invite
            <span aria-hidden="true">→</span>
          </a>
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-white/40">
            Grand Opening invitations · No spam · Date sent before we announce it
          </p>
        </div>

        {/* Behavior-only mount: mouse spotlight + magnetic CTA */}
        <HeroInteractive />
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-charcoal-deep"
        aria-hidden="true"
      />
    </section>
  );
}
