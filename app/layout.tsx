import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import "./styles/effects.css";
import { CosmicAnalyticsProvider } from "cosmic-analytics";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ThreeParticleField from "@/app/components/ThreeParticleField";
import ScrollProgress from "@/app/components/ScrollProgress";
import { profile } from "@/lib/portfolio-data";
import {
  buildJsonLd,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/seo";

const primaryFont = Geist({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${profile.name}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  publisher: profile.name,
  category: "technology",
  icons: { icon: "/icon", apple: "/apple-icon" },
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    firstName: "Rishav",
    lastName: "Kumar",
    username: "Chrishabh2002",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    // og:image comes from app/opengraph-image.tsx via the file convention,
    // which resolves against metadataBase and adds a cache-busting hash.
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { email: false, telephone: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={primaryFont.className}>
      <head>
        {/* Warm up the Iconify CDN that renders every brand mark on the page. */}
        <link rel="preconnect" href="https://api.iconify.design" crossOrigin="" />
        <link rel="dns-prefetch" href="https://api.iconify.design" />
        <link rel="preconnect" href="https://storage.googleapis.com" crossOrigin="" />
      </head>
      <body className="antialiased bg-black text-white min-h-svh">
        {/* schema.org graph — lets search engines read the résumé, not just markup. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()) }}
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
