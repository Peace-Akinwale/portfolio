import { Inter } from 'next/font/google';
import { TooltipProvider } from '@/components/mylinks/Tooltip';
import './mylinks.css';

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
