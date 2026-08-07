// Coming Soon landing — v1.4 composition.
//   Hero (alive)
//   → StickyMarquee
//   → Values (3-card grid)
//   → FounderNote
//   → WaitlistSection      (Grand Opening invitation list)
//   → ProductRequestSection (what customers want us to carry)
//   → LocationPreview
//   → Footer
//
// Careers lives on its own page at /careers and is linked from the Footer.

import { Hero } from "@/components/Hero";
import { StickyMarquee } from "@/components/StickyMarquee";
import { Values } from "@/components/Values";
import { FounderNote } from "@/components/FounderNote";
import { WaitlistSection } from "@/components/WaitlistSection";
import { ProductRequestSection } from "@/components/ProductRequestSection";
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
        <ProductRequestSection />
        <LocationPreview />
      </main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
