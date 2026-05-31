import type { Metadata, Viewport } from "next";
import { Poppins, Fraunces, Caveat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AgeGateProvider } from "@/components/AgeGateProvider";
import {
  PHONE_E164,
  CONTACT_EMAIL,
  OPENING_HOURS_SPEC,
} from "@/lib/contact";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

// Variable serif — used for the dramatic display headlines
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

// Hand-written signature font for Eddie
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-caveat",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://eddiesflower.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Eddie's Flowers Dispensary — Coming Soon to Ashburnham, MA",
    template: "%s | Eddie's Flowers",
  },
  description:
    "Eddie's Flowers Dispensary opens soon at 23 Rindge State Road, Ashburnham, MA. Join the waitlist to be first through the doors.",
  keywords: [
    "Eddie's Flowers",
    "Ashburnham cannabis dispensary",
    "Massachusetts marijuana retailer",
    "MA dispensary opening 2026",
    "MRN284579",
  ],
  openGraph: {
    title: "Eddie's Flowers Dispensary — Coming Soon",
    description:
      "Ashburnham's new spot for flower. Join the waitlist to be first through the doors.",
    url: SITE_URL,
    siteName: "Eddie's Flowers",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Eddie's Flowers Dispensary — Coming Soon to Ashburnham, MA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eddie's Flowers — Coming Soon",
    description: "Ashburnham's new dispensary. Join the founding-members waitlist.",
    images: ["/og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
    shortcut: ["/icon-32.png"],
  },
  manifest: "/manifest.webmanifest",
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#73BE44",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${fraunces.variable} ${caveat.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Store",
                  "@id": `${SITE_URL}/#store`,
                  name: "Eddie's Flowers Dispensary",
                  alternateName: ["Eddie's Flowers", "Eddies Flowers Dispensary"],
                  description:
                    "Massachusetts licensed adult-use cannabis retailer opening soon in Ashburnham, MA. Curated flower, honest answers, no marketing-speak.",
                  url: SITE_URL,
                  logo: `${SITE_URL}/icon-512.png`,
                  image: `${SITE_URL}/og.png`,
                  telephone: PHONE_E164,
                  email: CONTACT_EMAIL,
                  openingHoursSpecification: OPENING_HOURS_SPEC,
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: "23 Rindge State Road",
                    addressLocality: "Ashburnham",
                    addressRegion: "MA",
                    postalCode: "01430",
                    addressCountry: "US",
                  },
                  geo: {
                    "@type": "GeoCoordinates",
                    latitude: 42.6376,
                    longitude: -71.9134,
                  },
                  areaServed: [
                    { "@type": "City", name: "Ashburnham" },
                    { "@type": "City", name: "Winchendon" },
                    { "@type": "City", name: "Gardner" },
                    { "@type": "City", name: "Fitchburg" },
                    { "@type": "AdministrativeArea", name: "Worcester County" },
                    { "@type": "State", name: "Massachusetts" },
                  ],
                  currenciesAccepted: "USD",
                  paymentAccepted: "Cash, Debit",
                  priceRange: "$$",
                  identifier: { "@type": "PropertyValue", propertyID: "MA-CCC-License", value: "MRN284579" },
                  parentOrganization: { "@id": `${SITE_URL}/#org` },
                },
                {
                  "@type": "Organization",
                  "@id": `${SITE_URL}/#org`,
                  name: "Legacy Operations",
                  url: "https://thelegacyops.com",
                  logo: `${SITE_URL}/icon-512.png`,
                  description:
                    "Vertically integrated multi-state cannabis operator across Massachusetts, Connecticut, and New York. Operator of Eddie's Flowers Dispensary in Ashburnham, MA.",
                },
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#site`,
                  url: SITE_URL,
                  name: "Eddie's Flowers Dispensary",
                  publisher: { "@id": `${SITE_URL}/#org` },
                  inLanguage: "en-US",
                },
              ],
            }),
          }}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <AgeGateProvider />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
