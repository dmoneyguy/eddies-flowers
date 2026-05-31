import type { Metadata, Viewport } from "next";
import { Poppins, Fraunces, Caveat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AgeGateProvider } from "@/components/AgeGateProvider";
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
              "@type": "Store",
              name: "Eddie's Flowers Dispensary",
              description:
                "Massachusetts licensed adult-use cannabis retailer opening soon in Ashburnham.",
              url: SITE_URL,
              image: `${SITE_URL}/og.png`,
              address: {
                "@type": "PostalAddress",
                streetAddress: "23 Rindge State Road",
                addressLocality: "Ashburnham",
                addressRegion: "MA",
                postalCode: "01430",
                addressCountry: "US",
              },
              areaServed: "Massachusetts",
              priceRange: "$$",
              parentOrganization: {
                "@type": "Organization",
                name: "Legacy Operations",
                url: "https://thelegacyops.com",
              },
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
