// Home — v2.0 composition.
//
// The order answers a visitor's questions in the order they actually ask them:
//
//   Hero              who are you, and where
//   Marquee           brand band (no longer sticky — SiteHeader owns that slot)
//   Values            why should I care
//   WhereWeAre        WHEN? — the question everyone actually came with
//   FounderNote       who's behind it
//   BuildProgress     prove it's real  (renders nothing until photos exist)
//   WaitlistSection   the ask: invitation to the Grand Opening
//   ProductRequest    the second ask: what should we stock
//   HiringBanner      the third ask: come work here
//   LocationPreview   where, hours, directions
//
// WhereWeAre sits high deliberately. Burying the status answer below three
// asks is how a visitor leaves without it.

import { Hero } from "@/components/Hero";
import { StickyMarquee } from "@/components/StickyMarquee";
import { Values } from "@/components/Values";
import { WhereWeAre } from "@/components/WhereWeAre";
import { FounderNote } from "@/components/FounderNote";
import { BuildProgress } from "@/components/BuildProgress";
import { WaitlistSection } from "@/components/WaitlistSection";
import { ProductRequestSection } from "@/components/ProductRequestSection";
import { HiringBanner } from "@/components/HiringBanner";
import { LocationPreview } from "@/components/LocationPreview";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function Home() {
  return (
    <>
      <main id="main">
        <Hero />
        <StickyMarquee />
        <Values />
        <WhereWeAre />
        <FounderNote />
        <BuildProgress />
        <WaitlistSection />
        <ProductRequestSection />
        <HiringBanner />
        <LocationPreview />
      </main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
