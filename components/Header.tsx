'use client';

import Link from 'next/link';
import { useState } from 'react';

const PRIMARY_LINKS = [
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

const SECONDARY_LINKS = [
  { href: '/projects', label: 'Projects' },
  { href: '/contentdb', label: 'contentDB' },
  { href: '/career-pathway', label: 'Career Pathway' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3 sm:pt-3.5">
        <div className="rounded-[1.6rem] border border-border/75 bg-background/88 backdrop-blur-md shadow-[0_10px_28px_rgba(58,35,22,0.05)]">
          <div className="flex items-center justify-between gap-6 px-4 sm:px-6 py-3 sm:py-3.5">
          <Link
            href="/"
            className="text-lg sm:text-xl font-bold hover:opacity-80 transition-opacity text-foreground"
            style={{ fontFamily: 'var(--font-heading, var(--font-sans))' }}
            onClick={() => setIsMenuOpen(false)}
          >
            Peace Akinwale
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {PRIMARY_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors text-muted-foreground hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-5">
            <Link
              href="/career-pathway"
              className="text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors text-muted-foreground hover:text-accent"
            >
              Career Pathway
            </Link>
            <Link
              href="/contact"
              className="text-[11px] font-bold uppercase tracking-[0.12em] px-4 py-2.5 rounded-full transition-all hover:opacity-90 text-white"
              style={{ background: 'var(--accent)' }}
            >
              Book a call
            </Link>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 hover:bg-muted rounded-full transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
          </div>

          {isMenuOpen && (
            <nav className="lg:hidden border-t border-border/90 px-4 pb-4 pt-2">
              <div className="flex flex-col gap-1 py-2">
                {PRIMARY_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm uppercase tracking-[0.12em] py-3 text-muted-foreground hover:text-accent transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="border-t border-border/80 py-3 flex flex-col gap-1">
                {SECONDARY_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm uppercase tracking-[0.12em] py-3 text-muted-foreground hover:text-accent transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <Link
                href="/contact"
                className="mt-2 inline-flex justify-center px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] rounded-full transition-all hover:opacity-90 text-white"
                style={{ background: 'var(--accent)' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Book a call
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
