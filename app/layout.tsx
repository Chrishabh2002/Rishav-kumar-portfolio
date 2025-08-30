import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { CosmicAnalyticsProvider } from "cosmic-analytics";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ThreeParticleField from "@/app/components/ThreeParticleField";

const primaryFont = Geist({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

// Change the title and description to your own.
export const metadata: Metadata = {
  title: "Rishav Kumar - AI Developer & Full‑Stack Engineer",
  description:
    "Portfolio of Rishav Kumar — AI Developer, ML Engineer, and Full‑Stack Developer building intelligent, scalable experiences.",
  icons: {
    icon: "",
    apple: "/apple-icon",
  },
  themeColor: "#0ea5e9",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://example.com"),
  openGraph: {
    title: "Rishav Kumar — AI Developer",
    description:
      "Futuristic AI‑powered portfolio: projects, experience, skills, hackathons, and contact.",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://example.com",
    siteName: "Rishav Kumar",
    images: [],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rishav Kumar — AI Developer",
    description:
      "Futuristic AI‑powered portfolio with interactive 3D and smooth motion.",
  },
};

export default function RootLayout({
  children,
  
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={primaryFont.className}>
      <body className="antialiased bg-black text-white min-h-svh">
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <ThreeParticleField />
        </div>
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