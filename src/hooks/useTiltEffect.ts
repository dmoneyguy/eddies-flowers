import { useRef, useCallback } from 'react';

export function useTiltEffect(maxDeg = 5) {
  const ref = useRef<HTMLElement | null>(null);
  const rafId = useRef<number>(0);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const rotX = (-dy * maxDeg).toFixed(2);
      const rotY = (dx * maxDeg).toFixed(2);
      el.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
      el.style.transition = 'transform 0.05s ease';
    });
  }, [maxDeg]);

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(rafId.current);
    el.style.transform = '';
    el.style.transition = 'transform 0.4s ease';
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}
