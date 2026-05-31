"use client";

// HeroInteractive — adds living behavior to the otherwise server-rendered Hero:
//   1. Mouse-tracked warm spotlight (CSS var update on mousemove, throttled via rAF)
//   2. Magnetic CTA button (button gets a small translate toward the cursor on hover)
//
// Renders nothing — purely behavioral. Wires up via DOM lookup and degrades
// to no-op if the elements aren't found.

import { useEffect } from "react";

export function HeroInteractive() {
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

  return null;
}
