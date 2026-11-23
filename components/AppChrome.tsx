'use client';

import { usePathname } from 'next/navigation';
import { ImageLightbox } from '@/components/ImageLightbox';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { isMylinksWorkspacePath } from '@/lib/mylinks/routing';

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMylinksWorkspace = !!pathname && isMylinksWorkspacePath(pathname);

  if (isMylinksWorkspace) {
    return <main className="flex-1">{children}</main>;
  }

  const isHome = pathname === '/';
  return (
    <div className="flex flex-1 flex-col theme-dated">
      <ImageLightbox routeKey={pathname} />
      <Header />
      <main id="main" className="flex-1">{children}</main>
      <Footer compact={isHome} />
    </div>
  );
}
