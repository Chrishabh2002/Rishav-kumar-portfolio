import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import "./styles/effects.css";
import { CosmicAnalyticsProvider } from "cosmic-analytics";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ThreeParticleField from "@/app/components/ThreeParticleField";
import ScrollProgress from "@/app/components/ScrollProgress";
import { education, experiences, profile, skillCategories } from "@/lib/portfolio-data";

const primaryFont = Geist({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://example.com";
const description = `${profile.headline} in ${profile.location}. Building command-execution agents, production APIs and security-oriented automation with Python, LLMs, FastAPI, Linux and Docker.`;

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.headline} & Backend Engineer`,
  description,
  keywords: [
    profile.name,
    "AI Software Engineer",
    "AI Security Engineer",
    "AI Agents",
    "LLM Applications",
    "RAG",
    "LangChain",
    "Python Backend Engineer",
    "FastAPI",
    "Flask",
    "Machine Learning",
    "Computer Vision",
    "OpenCV",
    "Docker",
    "Linux automation",
    "Portfolio",
  ],
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  icons: { icon: "/icon", apple: "/apple-icon" },
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  openGraph: {
    title: `${profile.name} — ${profile.headline}`,
    description,
    url: siteUrl,
    siteName: profile.name,
    images: [{ url: profile.avatar, width: 1200, height: 630, alt: profile.name }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.headline}`,
    description,
    images: [profile.avatar],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
  colorScheme: "dark",
};

/** Structured data so search engines read the résumé, not just the markup. */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.headline,
  description: profile.summary,
  image: profile.avatar,
  email: `mailto:${profile.email}`,
  telephone: profile.phone,
  url: siteUrl,
  address: { "@type": "PostalAddress", addressLocality: "Noida", addressCountry: "IN" },
  sameAs: [profile.linkedin, profile.github],
  worksFor: { "@type": "Organization", name: experiences[0].company },
  alumniOf: { "@type": "CollegeOrUniversity", name: education.school },
  knowsAbout: skillCategories.flatMap((c) => c.skills.map((s) => s.name)),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={primaryFont.className}>
      <body className="antialiased bg-black text-white min-h-svh">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <ThreeParticleField />
        </div>
        <ScrollProgress />
        <main>
          <CosmicAnalyticsProvider>
            <Navbar />
            {children}
            <Footer />
          </CosmicAnalyticsProvider>
        </main>
      </body>
    </html>
  );
}
