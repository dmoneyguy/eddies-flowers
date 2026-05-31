"use client";

// StickyMarquee — wraps the Marquee in a sticky position when the user
// has scrolled past the hero. Otherwise stays in normal flow.

import { useEffect, useState } from "react";
import { Marquee } from "./Marquee";

export function StickyMarquee() {
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("marquee-sentinel");
    if (!sentinel) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        // When the sentinel scrolls OFF the top of the viewport, become sticky.
        if (entry && entry.boundingClientRect.top < 0) setSticky(true);
        else setSticky(false);
      },
      { threshold: 0 },
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div id="marquee-sentinel" aria-hidden="true" />
      <div className={sticky ? "marquee-sticky" : ""}>
        <Marquee />
      </div>
    </>
  );
}
