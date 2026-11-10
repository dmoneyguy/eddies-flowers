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

// /shop/* is the Sweed storefront, proxied by app/shop/[[...path]]/route.ts.
// Sweed's pages load Sweed's scripts and call Sweed's APIs, so this site's
// strict CSP, X-Frame-Options and Permissions-Policy would break them; there
// the upstream's own headers pass through, and only HSTS and nosniff are added.
const shopHeaders = securityHeaders.filter(
  (h) => h.key === "Strict-Transport-Security" || h.key === "X-Content-Type-Options",
);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        // Every path except /shop and /shop/...
        source: "/((?!shop(?:/|$)).*)",
        headers: securityHeaders,
      },
      {
        // Matches /shop as well as everything under it.
        source: "/shop/:path*",
        headers: shopHeaders,
      },
    ];
  },
};

export default nextConfig;
