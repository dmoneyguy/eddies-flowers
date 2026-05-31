// Coming Soon landing — v1.3 composition.
//   Hero (alive)
//   → StickyMarquee
//   → Values (3-card grid)
//   → FounderNote
//   → WaitlistSection
//   → LocationPreview
//   → Footer

import { Hero } from "@/components/Hero";
import { StickyMarquee } from "@/components/StickyMarquee";
import { Values } from "@/components/Values";
import { FounderNote } from "@/components/FounderNote";
import { WaitlistSection } from "@/components/WaitlistSection";
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
        <FounderNote />
        <WaitlistSection />
        <LocationPreview />
      </main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
