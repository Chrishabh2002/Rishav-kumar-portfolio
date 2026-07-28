import { achievements, education, experiences, profile, projects, skillCategories } from "./portfolio-data";

/**
 * Canonical public origin. Deliberately separate from NEXT_PUBLIC_BASE_URL,
 * which points at the Cosmic sandbox host — using that for canonical/OG tags
 * would advertise the wrong domain to search engines.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://rishav-kumar-portfolio.vercel.app"
).replace(/\/$/, "");

export const SITE_NAME = `${profile.name} — Portfolio`;

export const SITE_TITLE = `${profile.name} | AI Software Engineer & Backend Developer`;

export const SITE_DESCRIPTION =
  `${profile.name} is an AI Software Engineer in ${profile.location} building command-execution agents, ` +
  `production APIs and security-oriented automation. Currently at ${experiences[0].company} (${experiences[0].location}), ` +
  `previously ${experiences[1].company}. Python, FastAPI, LLM agents, RAG, LangChain, OpenCV, Docker, AWS.`;

/** Long-tail phrases people actually search when hiring for this profile. */
export const SITE_KEYWORDS = [
  profile.name,
  "Rishav Kumar portfolio",
  "Rishav Kumar AI engineer",
  "Rishav Kumar Noida",
  "AI Software Engineer India",
  "AI Security Engineer",
  "LLM application developer",
  "AI agent developer",
  "Python backend engineer",
  "FastAPI developer India",
  "RAG developer",
  "LangChain developer",
  "machine learning engineer Noida",
  "computer vision OpenCV engineer",
  "hire AI engineer India",
  "Galgotias University computer science",
  ...skillCategories.flatMap((c) => c.skills.map((s) => s.name)),
];

const ogImage = {
  url: `${SITE_URL}/opengraph-image`,
  width: 1200,
  height: 630,
  alt: `${profile.name} — ${profile.headline}`,
};

export const OG_IMAGE = ogImage;

/**
 * schema.org graph. A single @graph keeps the entities cross-referenced by
 * @id, which search engines resolve into one coherent knowledge panel rather
 * than several disconnected blobs.
 */
export function buildJsonLd() {
  const personId = `${SITE_URL}/#person`;
  const siteId = `${SITE_URL}/#website`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: profile.name,
        alternateName: ["Rishav", "Chrishabh"],
        jobTitle: profile.headline,
        description: profile.summary,
        image: `${SITE_URL}/opengraph-image`,
        url: SITE_URL,
        email: `mailto:${profile.email}`,
        telephone: profile.phone,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Noida",
          addressRegion: "Uttar Pradesh",
          addressCountry: "IN",
        },
        sameAs: [profile.linkedin, profile.github],
        knowsAbout: skillCategories.flatMap((c) => c.skills.map((s) => s.name)),
        worksFor: {
          "@type": "Organization",
          name: experiences[0].company,
          url: experiences[0].website,
        },
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: education.school,
          url: education.website,
        },
        hasOccupation: experiences.map((e) => ({
          "@type": "Occupation",
          name: e.title,
          occupationLocation: { "@type": "Place", name: e.location },
          skills: e.techStack,
        })),
      },
      {
        "@type": "WebSite",
        "@id": siteId,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: "en",
        publisher: { "@id": personId },
      },
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/#profilepage`,
        url: SITE_URL,
        name: SITE_TITLE,
        description: SITE_DESCRIPTION,
        isPartOf: { "@id": siteId },
        about: { "@id": personId },
        primaryImageOfPage: `${SITE_URL}/opengraph-image`,
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/#projects`,
        name: `Projects by ${profile.name}`,
        itemListElement: projects.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "CreativeWork",
            name: p.title,
            description: p.description,
            creator: { "@id": personId },
            keywords: p.techStack,
            dateCreated: p.period,
          },
        })),
      },
    ],
  };
}

export const ACHIEVEMENT_COUNT = achievements.length;
