'use client';

import { usePathname } from 'next/navigation';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

/**
 * Site chrome. The homepage carries its own masthead (chaptered editorial: no
 * fixed bar). The MyLinks workspace has its own app chrome. Everything else
 * gets the fixed Header and the Footer.
 */
export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMylinksWorkspace =
    !!pathname && pathname.startsWith('/projects/mylinks/') && pathname !== '/projects/mylinks/';
  const isHome = pathname === '/';

  if (isMylinksWorkspace) {
    return <main className="flex-1">{children}</main>;
  }

  if (isHome) {
    return (
      <>
        <main className="flex-1">{children}</main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 pt-20 sm:pt-24">{children}</main>
      <Footer />
    </>
  );
}
