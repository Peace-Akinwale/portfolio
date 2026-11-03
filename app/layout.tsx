import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import "./informal.css";
import { ThemeProvider } from "./providers";
import { AppChrome } from "@/components/AppChrome";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { SITE_URL, LINKEDIN_URL, X_URL } from "@/lib/site";

// Display: Sprat (Ethan Nakache, OFL 1.1; licence beside the file). Weight axis
// relabelled to 100–900, width axis 100–200 (see app/fonts/sprat/NOTE.md).
const sprat = localFont({
  src: "./fonts/sprat/Sprat-Variable.woff2",
  variable: "--font-display",
  display: "swap",
  weight: "100 900",
  style: "normal",
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: false,
});

// Long-form body: Newsreader (Production Type, OFL 1.1; licence beside the files).
const newsreader = localFont({
  src: [
    { path: "./fonts/newsreader/Newsreader-Variable.woff2", style: "normal" },
    { path: "./fonts/newsreader/Newsreader-Variable-Italic.woff2", style: "italic" },
  ],
  variable: "--font-serif",
  display: "swap",
  weight: "200 800",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

// Interface: DM Sans, self-hosted at build time by next/font.
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Peace Akinwale",
      url: SITE_URL,
      jobTitle: "B2B SaaS writer and AI tool builder",
      description:
        "Peace Akinwale writes bottom-of-funnel content for B2B SaaS companies and agencies, and builds AI-assisted tools for content teams.",
      knowsAbout: [
        "B2B SaaS content writing",
        "Bottom-of-funnel content",
        "AI search",
        "AI-assisted tool building",
      ],
      sameAs: [LINKEDIN_URL, X_URL],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Peace Akinwale",
      description: "The work of Peace Akinwale: articles for B2B SaaS companies and agencies, and AI tools for content teams.",
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
    "I write bottom-of-funnel content for B2B SaaS companies and agencies, and I build AI-assisted tools for content teams. Most of the work is deciding what's worth making and checking that it's true.",
  verification: {
    google: "JAyf5aaXTbM7ev_a1fFUGsiZ6yYgoAa5QNEFngUjllQ",
  },
  openGraph: {
    title: "Peace Akinwale",
    description:
      "Articles for B2B SaaS companies and agencies, and AI tools for content teams.",
    url: SITE_URL,
    siteName: "Peace Akinwale",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Peace Akinwale",
    description:
      "Articles for B2B SaaS companies and agencies, and AI tools for content teams.",
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
    <html lang="en" className={`${sprat.variable} ${newsreader.variable} ${dmSans.variable}`} suppressHydrationWarning>
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
