import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * Single-page site, so the sitemap lists the root plus its in-page anchors.
 * Anchors help search engines surface jump links for "experience", "projects"
 * and "contact" queries.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const sections = [
    "about",
    "experience",
    "projects",
    "skills",
    "terminal",
    "achievements",
    "education",
    "contact",
  ];

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...sections.map((s) => ({
      url: `${SITE_URL}/#${s}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
