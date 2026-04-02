import { useRef, useCallback, cloneElement, isValidElement } from 'react';
import type { ReactElement, MouseEvent } from 'react';

interface Props {
  children: ReactElement;
  radius?: number;
  strength?: number;
}

export default function MagneticButton({ children, radius = 60, strength = 0.35 }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const rafId = useRef<number>(0);

  const onMouseMove = useCallback((e: MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < radius) {
        const tx = (dx * strength).toFixed(2);
        const ty = (dy * strength).toFixed(2);
        el.style.transform = `translate(${tx}px, ${ty}px) scale(1.04)`;
        el.style.transition = 'transform 0.15s ease';
      }
    });
  }, [radius, strength]);

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(rafId.current);
    el.style.transform = '';
    el.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
  }, []);

  if (!isValidElement(children)) return children;

  return cloneElement(children as ReactElement<{
    ref: typeof ref;
    onMouseMove: typeof onMouseMove;
    onMouseLeave: typeof onMouseLeave;
    style: { display: string };
  }>, {
    ref,
    onMouseMove,
    onMouseLeave,
    style: { display: 'inline-flex' },
  });
}
