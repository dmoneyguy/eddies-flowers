import { useEffect, useRef } from 'react';
import './CustomCursor.css';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafId = useRef<number>(0);
  const isHovering = useRef(false);

  useEffect(() => {
    // Only on pointer-capable devices
    if (!window.matchMedia('(hover: hover)').matches) return;

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const onEnter = () => { isHovering.current = true; };
    const onLeave = () => { isHovering.current = false; };

    document.addEventListener('mousemove', onMove, { passive: true });

    const interactives = 'a, button, [role="button"], input, textarea, select, label, .home__cat-card';

    const attachListeners = () => {
      document.querySelectorAll(interactives).forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };
    attachListeners();

    const LERP = 0.12;
    const animate = () => {
      const dot = dotRef.current;
      const ring = ringRef.current;
      if (!dot || !ring) { rafId.current = requestAnimationFrame(animate); return; }

      // Dot follows immediately
      dot.style.transform = `translate(${pos.current.x - 6}px, ${pos.current.y - 6}px)`;

      // Ring lerps toward cursor
      ringPos.current.x += (pos.current.x - ringPos.current.x) * LERP;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * LERP;
      ring.style.transform = `translate(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px)`;

      if (isHovering.current) {
        ring.classList.add('cursor-ring--hover');
        dot.classList.add('cursor-dot--hover');
      } else {
        ring.classList.remove('cursor-ring--hover');
        dot.classList.remove('cursor-dot--hover');
      }

      rafId.current = requestAnimationFrame(animate);
    };
    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
