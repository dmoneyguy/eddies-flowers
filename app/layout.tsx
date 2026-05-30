import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
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
    "Eddie's Flowers Dispensary is opening soon at 23 Rindge State Road, Ashburnham, MA. A welcoming cannabis shop with a country-store vibe. Join the waitlist for opening updates.",
  keywords: [
    "Eddie's Flowers",
    "Ashburnham cannabis dispensary",
    "Massachusetts marijuana retailer",
    "MRN284579",
    "coming soon dispensary MA",
  ],
  openGraph: {
    title: "Eddie's Flowers Dispensary — Coming Soon to Ashburnham, MA",
    description:
      "A welcoming cannabis shop opening soon in Ashburnham. Join the waitlist.",
    url: SITE_URL,
    siteName: "Eddie's Flowers",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eddie's Flowers Dispensary — Coming Soon",
    description: "A welcoming cannabis shop opening soon in Ashburnham, MA.",
  },
  robots: {
    index: true,
    follow: true,
  },
  themeColor: "#73BE44",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        {/* LocalBusiness schema — references provisional license + future opening */}
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
            }),
          }}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
