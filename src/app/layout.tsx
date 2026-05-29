import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/sections/Footer";
import LoadingScreen from "@/components/ui/LoadingScreen";
import MouseTrail from "@/components/animations/MouseTrail";
import SmoothScroll from "@/components/animations/SmoothScroll";
import { SITE } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | Cutting-Edge Digital Solutions`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "Crystal Dev Labs offers Website Development, AI Development, Bot Development, Software Development, and Blockchain Development. Build the future with us.",
  keywords: [
    "web development",
    "AI development",
    "Discord bots",
    "blockchain",
    "software agency",
    "Crystal Dev Labs",
  ],
  authors: [{ name: SITE.name }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} | Cutting-Edge Digital Solutions`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  email: SITE.email,
  description: SITE.description,
  sameAs: [SITE.github, SITE.linkedin, SITE.twitter],
  serviceType: [
    "Website Development",
    "AI Development",
    "Bot Development",
    "Software Development",
    "Blockchain Development",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body antialiased">
        <LoadingScreen />
        <MouseTrail />
        <SmoothScroll />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
