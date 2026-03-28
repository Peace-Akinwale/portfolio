'use client';

import Link from 'next/link';
import { useState } from 'react';

const MOBILE_LINKS = [
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/contentdb', label: 'contentDB' },
  { href: '/career-pathway', label: 'Career Pathway' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-border fixed top-0 left-0 right-0 w-full bg-background/95 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xl sm:text-2xl font-bold hover:opacity-80 transition-opacity text-foreground"
            style={{ fontFamily: 'var(--font-heading, var(--font-sans))' }}
            onClick={() => setIsMenuOpen(false)}
          >
            Peace Akinwale
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/services" className="text-sm uppercase tracking-wide transition-colors text-muted-foreground hover:text-accent">Services</Link>
            <Link href="/portfolio" className="text-sm uppercase tracking-wide transition-colors text-muted-foreground hover:text-accent">Portfolio</Link>
            <Link href="/blog" className="text-sm uppercase tracking-wide transition-colors text-muted-foreground hover:text-accent">Blog</Link>
            <Link href="/about" className="text-sm uppercase tracking-wide transition-colors text-muted-foreground hover:text-accent">About</Link>
            <Link href="/projects" className="text-sm uppercase tracking-wide transition-colors text-muted-foreground hover:text-accent">Projects</Link>
            <Link href="/contentdb" className="text-sm uppercase tracking-wide transition-colors text-muted-foreground hover:text-accent">contentDB</Link>
            <Link href="/contact" className="text-sm uppercase tracking-wide transition-colors text-muted-foreground hover:text-accent">Contact</Link>
            <Link
              href="/career-pathway"
              className="text-xs font-bold uppercase tracking-[0.08em] px-4 py-2 rounded-md transition-all hover:opacity-90 text-white"
              style={{ background: 'var(--accent)' }}
            >
              Career Pathway &rarr;
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-md transition-colors"
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

        {/* Mobile inline dropdown */}
        {isMenuOpen && (
          <nav className="md:hidden pt-4 pb-2 border-t border-border mt-4">
            <div className="flex flex-col gap-4">
              {MOBILE_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm uppercase tracking-wide py-2 text-muted-foreground hover:text-accent transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
