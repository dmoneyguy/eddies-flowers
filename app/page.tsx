// Coming Soon landing — full composition. Order matters visually:
//   Hero (charcoal cinematic)
//   → Marquee (charcoal brand band, transitions out of hero)
//   → FounderNote (warm paper)
//   → WaitlistSection (cream + form)
//   → LocationPreview (charcoal again — bookends with hero)
//   → Footer
// ScrollReveal is a mount-once client component that promotes [data-reveal]
// elements as they scroll into view.

import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
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
        <Marquee />
        <FounderNote />
        <WaitlistSection />
        <LocationPreview />
      </main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
