import type { Metadata, Viewport } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./providers";
import { AppChrome } from "@/components/AppChrome";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://peaceakinwale.com/#person",
      name: "Peace Akinwale",
      url: "https://peaceakinwale.com",
      jobTitle: "B2B SaaS content writer",
      description:
        "B2B SaaS content writer specializing in product-led articles, content refreshes, and AI-search-friendly content for software companies.",
      knowsAbout: [
        "B2B SaaS content writing",
        "Product-led content",
        "Content refresh strategy",
        "SEO content",
        "AI search optimization",
      ],
      sameAs: [
        "https://www.linkedin.com/in/peaceakinwale/",
        "https://x.com/PeaceAkinwaleA",
        "https://github.com/Peace-Akinwale",
      ],
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://peaceakinwale.com/#service",
      name: "Peace Akinwale",
      url: "https://peaceakinwale.com/services",
      description:
        "B2B SaaS content writer services including product-led blog posts, content refreshes, BOFU articles, and AI-supported editorial systems.",
      areaServed: "Worldwide",
      provider: {
        "@id": "https://peaceakinwale.com/#person",
      },
      serviceType: [
        "B2B SaaS content writing",
        "Product-led content writing",
        "Content refresh services",
        "SEO content writing",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://peaceakinwale.com/#website",
      url: "https://peaceakinwale.com",
      name: "Peace Akinwale",
      description: "Portfolio and services for a B2B SaaS content writer.",
      publisher: {
        "@id": "https://peaceakinwale.com/#person",
      },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://peaceakinwale.com"),
  title: "Peace Akinwale | B2B SaaS Content Writer",
  description:
    "B2B SaaS content writer for product-led software companies. I write articles, refresh existing content, and build AI-supported systems that improve search visibility and conversions.",
  keywords: [
    "B2B SaaS content writer",
    "product-led content writer",
    "B2B SaaS writer",
    "SaaS content writer",
    "content refresh services",
    "AI search optimization",
  ],
  verification: {
    google: "JAyf5aaXTbM7ev_a1fFUGsiZ6yYgoAa5QNEFngUjllQ",
  },
  openGraph: {
    title: "Peace Akinwale | B2B SaaS Content Writer",
    description:
      "B2B SaaS content writer for product-led software companies. Articles, content refreshes, and AI-search-friendly content systems.",
    url: "https://peaceakinwale.com",
    siteName: "Peace Akinwale",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Peace Akinwale | B2B SaaS Content Writer",
    description:
      "B2B SaaS content writer for product-led software companies. Articles, content refreshes, and AI-search-friendly content systems.",
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
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`} suppressHydrationWarning>
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
