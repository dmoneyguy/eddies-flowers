import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.eddiesflower.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`,             lastModified: now, changeFrequency: "daily",   priority: 1.0 },
    { url: `${SITE_URL}/careers`,      lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${SITE_URL}/ashburnham`,   lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${SITE_URL}/winchendon`,   lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${SITE_URL}/gardner`,      lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${SITE_URL}/rindge-nh`,    lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${SITE_URL}/westminster`,  lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${SITE_URL}/ashby`,        lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${SITE_URL}/wholesale`,    lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${SITE_URL}/press`,        lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/faq`,          lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${SITE_URL}/privacy`,      lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${SITE_URL}/terms`,        lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${SITE_URL}/accessibility`,lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];
}
