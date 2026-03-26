// app/career-pathway/layout.tsx
import type { ReactNode } from 'react';
import Link from 'next/link';

export default function CareerPathwayLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>
      <header className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
        <Link
          href="/career-pathway"
          className="text-xs font-bold uppercase tracking-[0.12em]"
          style={{ color: 'var(--accent)' }}
        >
          Career Pathway
        </Link>
        <Link
          href="/"
          className="text-xs text-muted-foreground hover:text-foreground transition"
        >
          ← peaceakinwale.com
        </Link>
      </header>
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-12 sm:py-16">
        {children}
      </main>
    </div>
  );
}
