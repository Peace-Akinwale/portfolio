import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { TooltipProvider } from '@/components/mylinks/Tooltip';
import './mylinks.css';

export const metadata: Metadata = {
  title: { absolute: 'MyLinks' },
  robots: { index: false, follow: false },
};

const interFont = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-ml-sans',
});

export default function MylinksWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <div className={`ml-root min-h-screen ${interFont.variable}`}>{children}</div>
    </TooltipProvider>
  );
}
