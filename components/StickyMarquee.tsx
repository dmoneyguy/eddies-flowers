// StickyMarquee — kept as a named export for the pages that import it, but it
// is no longer sticky.
//
// It used to pin itself to the top of the viewport, spending 54px of an 844px
// phone screen permanently to repeat the address. SiteHeader now owns that
// slot and spends it on navigation instead. The marquee runs once, in flow,
// where it reads as a brand band rather than a fixed toolbar.

import { Marquee } from "./Marquee";

export function StickyMarquee() {
  return <Marquee />;
}
