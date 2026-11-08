import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import "./informal.css";
import { ThemeProvider } from "./providers";
import { AppChrome } from "@/components/AppChrome";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { SITE_URL, LINKEDIN_URL, X_URL } from "@/lib/site";

// Display: Fraunces (Undercase Type, OFL 1.1; licence and NOTE.md beside the files).
// Variable: opsz 9–144, wght 100–900, SOFT, WONK, plus the italic. Chosen 4 Nov 2026
// to replace Sprat and Newsreader; everything that is not a display heading is DM Sans.
const fraunces = localFont({
  src: [
    { path: "./fonts/fraunces/Fraunces-Variable.woff2", style: "normal" },
    { path: "./fonts/fraunces/Fraunces-Variable-Italic.woff2", style: "italic" },
  ],
  variable: "--font-display",
  display: "swap",
  weight: "100 900",
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: false,
});

// Interface and long-form: DM Sans, self-hosted at build time by next/font.
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  // Real italics for captions and emphasis; the browser's slanted fake is turned off in globals.css.
  style: ["normal", "italic"],
});

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Peace Akinwale",
      url: SITE_URL,
      jobTitle: "B2B SaaS writer and AI workflow builder",
      description:
        "Peace Akinwale writes bottom-of-funnel content for B2B SaaS companies and agencies, and builds AI workflows for content teams.",
      knowsAbout: [
        "B2B SaaS content writing",
        "Bottom-of-funnel content",
        "SEO",
        "Answer engine optimization (AEO)",
        "Content strategy",
        "AI search",
        "AI workflows for content teams",
      ],
      sameAs: [LINKEDIN_URL, X_URL],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Peace Akinwale",
      description: "The work of Peace Akinwale: articles for B2B SaaS companies and agencies, and AI workflows for content teams.",
      publisher: { "@id": `${SITE_URL}/#person` },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Peace Akinwale",
    template: "%s | Peace Akinwale",
  },
  description:
    "I write bottom-of-funnel content for B2B SaaS companies and agencies, and I build AI workflows for content teams. Most of the work is deciding what's worth making and checking that it's true.",
  verification: {
    google: "JAyf5aaXTbM7ev_a1fFUGsiZ6yYgoAa5QNEFngUjllQ",
  },
  openGraph: {
    title: "Peace Akinwale",
    description:
      "Articles for B2B SaaS companies and agencies, and AI workflows for content teams.",
    url: SITE_URL,
    siteName: "Peace Akinwale",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Peace Akinwale",
    description:
      "Articles for B2B SaaS companies and agencies, and AI workflows for content teams.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <head>
        {/* The feed stays discoverable by feed readers without a footer link (Peace, 4 Nov 2026). */}
        <link rel="alternate" type="application/rss+xml" title="Peace Akinwale" href="/rss.xml" />
      </head>
      <body className="antialiased">
        <GoogleAnalytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <AppChrome>{children}</AppChrome>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
