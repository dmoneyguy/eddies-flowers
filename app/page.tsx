// Coming Soon landing — full Part 1C composition.
// Order: Hero → Founder note → Waitlist form → Location preview → Footer.

import { Hero } from "@/components/Hero";
import { FounderNote } from "@/components/FounderNote";
import { WaitlistSection } from "@/components/WaitlistSection";
import { LocationPreview } from "@/components/LocationPreview";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main id="main">
        <Hero />
        <FounderNote />
        <WaitlistSection />
        <LocationPreview />
      </main>
      <Footer />
    </>
  );
}
