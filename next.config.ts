import type { NextConfig } from "next";

// Security headers ported from the previous vercel.json on this project.
// CSP is intentionally strict; we explicitly allow Google Fonts (next/font handles
// most of this automatically but we keep the policy permissive for the Maps embed
// we'll add in v2), Google Maps frames, and Vercel Analytics.
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Vercel Analytics ships an inline init blob; next/script adds nonces but
      // dev mode also needs unsafe-eval.
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://*.vercel-scripts.com https://vitals.vercel-insights.com",
      "frame-src https://maps.google.com https://www.google.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      // /rindge-nh was a landing page aimed at New Hampshire residents. It is
      // unpublished (935 CMR 500.105(4)(a)7 and the Diversion definition):
      // permanently redirected home, removed from the sitemap and every link.
      { source: "/rindge-nh", destination: "/", permanent: true },
      { source: "/rindge-nh/:path*", destination: "/", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
