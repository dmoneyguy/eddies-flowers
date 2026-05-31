// Marquee — brand band scrolling between hero and the values section.
// Server-rendered, pure CSS animation. Doubles its content inline so the loop
// is seamless. Discount-language-free per MA CCC compliance posture.

interface MarqueeProps {
  items?: string[];
}

const DEFAULT_ITEMS = [
  "Eddie's Flowers",
  "Opening Soon",
  "23 Rindge State Road",
  "Ashburnham · MA",
  "MA Licensed Adult-Use Retailer",
  "Founding Members First Through The Doors",
];

export function Marquee({ items = DEFAULT_ITEMS }: MarqueeProps) {
  const repeated = [...items, ...items, ...items, ...items];
  return (
    <div
      className="relative overflow-hidden border-y border-leaf-green/20 bg-charcoal-deep py-4"
      aria-hidden="true"
    >
      <div className="marquee-track flex items-center gap-10 px-6">
        {repeated.map((item, i) => (
          <span key={i} className="flex shrink-0 items-center gap-10">
            <span className="display text-xl font-medium tracking-tight text-warm-beige sm:text-2xl">
              {item}
            </span>
            <span className="text-leaf-green" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2c-3 5-6 9-10 11 4 2 7 6 10 11 3-5 6-9 10-11-4-2-7-6-10-11z" />
              </svg>
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
