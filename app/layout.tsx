import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "./providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
  title: "Peace Akinwale | Content Strategist & AI Content Engineer",
  description: "I write content that converts, and build AI systems to improve marketing operations. Content strategist and AI Content Engineer for B2B SaaS companies.",
  verification: {
    google: "JAyf5aaXTbM7ev_a1fFUGsiZ6yYgoAa5QNEFngUjllQ",
  },
  openGraph: {
    title: "Peace Akinwale | Content Strategist & AI Content Engineer",
    description: "I write content that converts, and build AI systems to improve marketing operations.",
    url: "https://peaceakinwale.com",
    siteName: "Peace Akinwale",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Peace Akinwale | Content Strategist & AI Content Engineer",
    description: "I write content that converts, and build AI systems to improve marketing operations.",
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
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <GoogleAnalytics />
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
