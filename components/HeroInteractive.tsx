"use client";

// HeroInteractive — adds living behavior to the otherwise server-rendered Hero:
//   1. Mouse-tracked warm spotlight (CSS var update on mousemove, throttled via rAF)
//   2. Magnetic CTA button (button gets a small translate toward the cursor on hover)
//   3. Live countdown to Summer 2026 opening (June 1, 2026)
//
// We mount once at the top-level of <Hero/>; it finds elements by data-* and
// wires the behaviors. Everything degrades to no-op if the elements aren't
// found (so this can ship behind any layout refactor).

import { useEffect, useState } from "react";

// Target: "opening day" — visible target our countdown is heading toward.
// Summer 2026 is fuzzy; we lock to June 1, 2026 as a credible start of summer.
const OPENING_DATE = new Date("2026-06-01T10:00:00-04:00");

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

function computeCountdown(): Countdown {
  const now = Date.now();
  const totalMs = Math.max(0, OPENING_DATE.getTime() - now);
  const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((totalMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((totalMs / (1000 * 60)) % 60);
  const seconds = Math.floor((totalMs / 1000) % 60);
  return { days, hours, minutes, seconds, totalMs };
}

export function HeroInteractive() {
  const [cd, setCd] = useState<Countdown | null>(null);

  // Live ticker — 1s interval
  useEffect(() => {
    setCd(computeCountdown());
    const id = setInterval(() => setCd(computeCountdown()), 1000);
    return () => clearInterval(id);
  }, []);

  // Mouse-tracked spotlight + magnetic CTA
  useEffect(() => {
    const hero = document.getElementById("hero-canvas");
    const cta = document.querySelector<HTMLElement>("[data-magnetic]");
    if (!hero) return;

    let rafId = 0;
    let pendingX = 0;
    let pendingY = 0;

    const onMove = (e: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      pendingX = x;
      pendingY = y;

      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          hero.style.setProperty("--mx", `${pendingX}%`);
          hero.style.setProperty("--my", `${pendingY}%`);
          rafId = 0;
        });
      }

      // Magnetic CTA — only pulls within ~120px radius
      if (cta) {
        const ctaRect = cta.getBoundingClientRect();
        const cx = ctaRect.left + ctaRect.width / 2;
        const cy = ctaRect.top + ctaRect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = 140;
        if (dist < radius) {
          const pull = 1 - dist / radius;
          cta.style.setProperty("--tx", `${dx * pull * 0.25}px`);
          cta.style.setProperty("--ty", `${dy * pull * 0.25}px`);
        } else {
          cta.style.setProperty("--tx", `0px`);
          cta.style.setProperty("--ty", `0px`);
        }
      }
    };

    const onLeave = () => {
      hero.style.setProperty("--mx", `50%`);
      hero.style.setProperty("--my", `35%`);
      if (cta) {
        cta.style.setProperty("--tx", `0px`);
        cta.style.setProperty("--ty", `0px`);
      }
    };

    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);
    return () => {
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  if (!cd) {
    // Server-equivalent placeholder until hydrated — prevents layout shift
    return <CountdownCard days={0} hours={0} minutes={0} seconds={0} muted />;
  }

  return <CountdownCard {...cd} />;
}

function CountdownCard({
  days,
  hours,
  minutes,
  seconds,
  muted = false,
}: {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  muted?: boolean;
}) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div
      className="countdown-card mx-auto mt-12 grid w-full max-w-md grid-cols-4 gap-0.5 rounded-2xl p-4"
      aria-label="Time until Eddie's Flowers opens"
    >
      <Unit label="Days" value={pad(days)} muted={muted} />
      <Unit label="Hours" value={pad(hours)} muted={muted} />
      <Unit label="Min" value={pad(minutes)} muted={muted} />
      <Unit label="Sec" value={pad(seconds)} muted={muted} live />
    </div>
  );
}

function Unit({
  label,
  value,
  muted,
  live,
}: {
  label: string;
  value: string;
  muted?: boolean;
  live?: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <span
        className={
          "countdown-digit text-3xl font-semibold sm:text-4xl " +
          (muted ? "text-white/40" : "text-white") +
          (live ? " text-leaf-green-soft" : "")
        }
      >
        {value}
      </span>
      <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
        {label}
      </span>
    </div>
  );
}
