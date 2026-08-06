import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.eddiesflower.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*",                allow: "/", disallow: ["/api/", "/_next/"] },
      // Welcome generative-AI crawlers (per emerging norms; can be tightened later)
      { userAgent: "GPTBot",           allow: "/" },
      { userAgent: "OAI-SearchBot",    allow: "/" },
      { userAgent: "PerplexityBot",    allow: "/" },
      { userAgent: "ClaudeBot",        allow: "/" },
      { userAgent: "Google-Extended",  allow: "/" },
      { userAgent: "Applebot-Extended",allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
