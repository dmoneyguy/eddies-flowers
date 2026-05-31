// SVG section divider — organic concave curve, flips for top vs bottom.
// `from` is the section we're leaving (the colored part of the divider),
// `to` is the next section (the cutout area). Use it stacked between sections
// so the page reads like layered paper, not stacked rectangles.

interface SectionDividerProps {
  from: string; // hex or CSS color
  to: string;
  height?: number; // px
  flip?: boolean; // top of next section vs bottom of current
}

export function SectionDivider({
  from,
  to,
  height = 80,
  flip = false,
}: SectionDividerProps) {
  return (
    <div
      style={{ background: to, height }}
      className="relative w-full overflow-hidden"
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        style={{ transform: flip ? "scaleY(-1)" : undefined }}
      >
        <path
          d="M0,0 L1440,0 L1440,40 C1080,80 720,0 360,40 C180,60 60,30 0,40 Z"
          fill={from}
        />
      </svg>
    </div>
  );
}
