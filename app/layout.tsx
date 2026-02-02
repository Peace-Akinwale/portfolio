import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Peace Akinwale | Content Strategist & AI Systems Builder",
  description: "I write content that converts, and build AI systems to improve marketing operations. Content strategist and AI systems builder for B2B SaaS companies.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  openGraph: {
    title: "Peace Akinwale | Content Strategist & AI Systems Builder",
    description: "I write content that converts, and build AI systems to improve marketing operations.",
    url: "https://peaceakinwale.com",
    siteName: "Peace Akinwale",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Peace Akinwale | Content Strategist & AI Systems Builder",
    description: "I write content that converts, and build AI systems to improve marketing operations.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
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
