'use client';

import Link from 'next/link';
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-border fixed top-0 left-0 right-0 w-full bg-background/95 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex items-center justify-between">
          {/* Logo/Name */}
          <Link href="/" className="text-xl sm:text-2xl font-sans font-bold hover:opacity-80 transition-opacity text-foreground">
            Peace Akinwale
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/blog"
              className="text-sm uppercase tracking-wide transition-colors text-muted-foreground hover:text-accent"
            >
              Blog
            </Link>
            <Link
              href="/portfolio"
              className="text-sm uppercase tracking-wide transition-colors text-muted-foreground hover:text-accent"
            >
              Portfolio
            </Link>
            <Link
              href="/about"
              className="text-sm uppercase tracking-wide transition-colors text-muted-foreground hover:text-accent"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm uppercase tracking-wide transition-colors text-muted-foreground hover:text-accent"
            >
              Contact
            </Link>
          </nav>

          {/* Mobile Hamburger */}
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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden pt-4 pb-2 border-t border-border mt-4">
            <div className="flex flex-col gap-4">
              <Link
                href="/blog"
                className="text-sm uppercase tracking-wide py-2 text-muted-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/portfolio"
                className="text-sm uppercase tracking-wide py-2 text-muted-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Portfolio
              </Link>
              <Link
                href="/about"
                className="text-sm uppercase tracking-wide py-2 text-muted-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-sm uppercase tracking-wide py-2 text-muted-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
