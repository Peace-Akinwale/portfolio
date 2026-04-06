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

  return (
    <>
      <Header />
      <main className="flex-1 pt-[88px] sm:pt-[96px]">{children}</main>
      <Footer />
    </>
  );
}

