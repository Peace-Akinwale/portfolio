'use client';

import { usePathname } from 'next/navigation';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMylinksWorkspace =
    !!pathname &&
    pathname.startsWith('/projects/mylinks/') &&
    pathname !== '/projects/mylinks/';

  if (isMylinksWorkspace) {
    return <main className="flex-1">{children}</main>;
  }

  const isHome = pathname === '/';
  return (
    <div className="flex flex-1 flex-col theme-dated">
      <Header />
      <main id="main" className="flex-1">{children}</main>
      <Footer compact={isHome} />
    </div>
  );
}
