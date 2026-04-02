import { useRef, useEffect, useState } from 'react';
import './RevealText.css';

interface Props {
  children: string;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  delay?: number;
}

export default function RevealText({ children, as: Tag = 'h2', className = '', delay = 0 }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        obs.disconnect();
      }
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const words = children.split(' ');

  const El = Tag as React.ElementType;

  return (
    <El
      ref={ref}
      className={`reveal-text ${className}`}
      aria-label={children}
    >
      {words.map((word, i) => (
        <span
          key={i}
          className={`reveal-text__word${visible ? ' reveal-text__word--visible' : ''}`}
          style={{ transitionDelay: `${delay + i * 0.06}s` }}
        >
          {word}{i < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </El>
  );
}
