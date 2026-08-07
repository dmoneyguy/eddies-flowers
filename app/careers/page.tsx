import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { CareersForm } from "@/components/CareersForm";
import {
  ADDRESS_LOCALITY,
  ADDRESS_REGION,
  POSTAL_CODE,
  STREET_ADDRESS,
} from "@/lib/contact";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.eddiesflower.com";

export const metadata: Metadata = {
  title: "Careers — We're Hiring",
  description:
    "Join the team at Eddie's Flowers Dispensary in Ashburnham, MA. We're hiring budtenders, keyholders, cannabis techs, and more for opening day. Must be 21+.",
  alternates: { canonical: `${SITE_URL}/careers` },
  openGraph: {
    title: "Careers at Eddie's Flowers",
    description:
      "We're hiring local staff in Ashburnham, MA. Budtenders, keyholders, cannabis techs, compliance and more.",
    url: `${SITE_URL}/careers`,
  },
};

// JobPosting structured data.
//
// This is the highest-leverage SEO on the site right now. Google Jobs and the
// AI assistants people actually ask ("who's hiring in Ashburnham?") read
// JobPosting; without it we are invisible to both, no matter how good the page
// reads. Six roles, each emitted separately so each can surface on its own.
//
// HONESTY CONSTRAINTS, because this is a public representation of real jobs:
//   - No salary is published. We have not set wage bands, and inventing one to
//     satisfy a schema validator would be a lie that candidates act on.
//   - directApply is true: applying really does happen on our own form, not on
//     a third-party board.
//   - validThrough is deliberately omitted. We do not know the opening date, so
//     any expiry we wrote down would be a guess, and a stale one removes the
//     listing without anyone noticing.
//   - employmentType reflects what we will actually offer.
// If a role is filled or dropped, remove it from this list.
const ROLES = [
  { title: "Budtender", type: ["FULL_TIME", "PART_TIME"],
    desc: "Serve customers on the floor of a new adult-use dispensary in Ashburnham, MA. Guide first-time and experienced visitors, verify ID, ring sales, and keep the shop tidy. No cannabis experience required — training provided. Must be 21 or older and registrable as a Marijuana Establishment Agent with the Massachusetts Cannabis Control Commission." },
  { title: "Keyholder / Shift Lead", type: ["FULL_TIME"],
    desc: "Open and close the shop, lead a shift of budtenders, handle cash procedures and escalations at a new adult-use dispensary in Ashburnham, MA. Retail supervisory experience valued. Must be 21 or older and registrable as a Marijuana Establishment Agent." },
  { title: "Cannabis Technician / Inventory", type: ["FULL_TIME"],
    desc: "Receive, count, tag and reconcile inventory in Metrc, the Massachusetts seed-to-sale tracking system, at a new adult-use dispensary in Ashburnham, MA. Careful, methodical work. Must be 21 or older and registrable as a Marijuana Establishment Agent." },
  { title: "Compliance & Administrative Support", type: ["FULL_TIME", "PART_TIME"],
    desc: "Maintain records, logs and standard operating procedures for a Massachusetts adult-use cannabis retailer in Ashburnham, MA. Suits someone organised who likes getting the paperwork exactly right. Must be 21 or older and registrable as a Marijuana Establishment Agent." },
  { title: "Delivery Driver", type: ["PART_TIME"],
    desc: "Post-opening role delivering cannabis orders locally under Massachusetts Cannabis Control Commission rules, from our Ashburnham, MA shop. Clean driving record required. Must be 21 or older and registrable as a Marijuana Establishment Agent." },
  { title: "Security", type: ["FULL_TIME", "PART_TIME"],
    desc: "Front-door presence and floor security at a new adult-use dispensary in Ashburnham, MA. Check identification, keep the room calm, support staff during opening and closing. Must be 21 or older and registrable as a Marijuana Establishment Agent." },
] as const;

export default function Careers() {
  const jobsJsonLd = ROLES.map((role) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: role.title,
    description: role.desc,
    employmentType: [...role.type],
    directApply: true,
    datePosted: "2026-08-07",
    industry: "Cannabis Retail",
    hiringOrganization: {
      "@type": "Organization",
      name: "Eddie's Flowers, Inc.",
      sameAs: SITE_URL,
      logo: `${SITE_URL}/icon-512.png`,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: STREET_ADDRESS,
        addressLocality: ADDRESS_LOCALITY,
        addressRegion: ADDRESS_REGION,
        postalCode: POSTAL_CODE,
        addressCountry: "US",
      },
    },
    applicantLocationRequirements: {
      "@type": "Country",
      name: "United States",
    },
    jobLocationType: undefined,
    url: `${SITE_URL}/careers`,
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobsJsonLd) }}
      />
      <main id="main" className="bg-warm-beige">
        <section className="px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rustic-brown">
              Careers · We&apos;re Hiring
            </p>
            <h1 className="display mt-3 text-4xl font-extrabold text-charcoal-black sm:text-5xl">
              Help us open Eddie&apos;s Flowers.
            </h1>
            <div className="mt-6 space-y-4 text-lg text-charcoal-black/80">
              <p>
                We&apos;re hiring locally in Ashburnham and the surrounding North
                Worcester County towns. If you live nearby, love the work, and
                want to learn the Massachusetts cannabis industry from the ground
                up — we want to meet you.
              </p>
              <p>Roles we&apos;ll be filling:</p>
              <ul className="ml-6 list-disc space-y-1 text-base">
                <li><strong>Budtenders</strong> — full and part-time</li>
                <li><strong>Keyholders / shift leads</strong></li>
                <li><strong>Cannabis tech / inventory</strong></li>
                <li><strong>Compliance &amp; admin support</strong></li>
                <li><strong>Delivery driver</strong> (post-opening)</li>
                <li><strong>Security</strong></li>
              </ul>
              <p>
                Massachusetts cannabis retail requires all workers to be{" "}
                <strong>21 or older</strong> and registered with the Commonwealth.
                Prior cannabis experience is welcome but not required — what
                matters is showing up, working hard, and treating customers like
                neighbors.
              </p>
            </div>

            <div className="mt-10 rounded-2xl border-2 border-charcoal-black/10 bg-white p-6 sm:p-8">
              <h2 className="display text-2xl font-semibold text-charcoal-black">
                Apply
              </h2>
              <p className="mt-1 text-sm text-charcoal-black/60">
                Five minutes. We read every one.
              </p>
              <div className="mt-6">
                <CareersForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
