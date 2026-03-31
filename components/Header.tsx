'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const PORTFOLIO_LINKS = [
  { href: '/portfolio', label: 'Portfolio', description: 'Featured writing work and selected client projects.' },
  { href: '/contentdb', label: 'contentDB', description: 'Store high-value content assets and query them inside Claude through MCP.' },
  { href: '/career-pathway', label: 'Career Pathway', description: 'A quiz that helps young people find a realistic tech career path to start with and grow into.' },
];

const PRIMARY_LINKS = [
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Portfolio', children: PORTFOLIO_LINKS },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

const SECONDARY_LINKS = [
  { href: '/projects', label: 'Projects' },
];

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  const [isDesktopPortfolioOpen, setIsDesktopPortfolioOpen] = useState(false);
  const desktopPortfolioRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsPortfolioOpen(false);
    setIsDesktopPortfolioOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isDesktopPortfolioOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (!desktopPortfolioRef.current?.contains(event.target as Node)) {
        setIsDesktopPortfolioOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsDesktopPortfolioOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isDesktopPortfolioOpen]);

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
              item.children ? (
                <div
                  key={item.href}
                  ref={desktopPortfolioRef}
                  className="relative"
                  onMouseEnter={() => setIsDesktopPortfolioOpen(true)}
                  onMouseLeave={() => setIsDesktopPortfolioOpen(false)}
                >
                  <Link
                    href={item.href}
                    className="inline-flex min-h-10 items-center gap-1 rounded-full px-3 text-[11px] font-semibold uppercase tracking-[0.16em] transition-all text-muted-foreground hover:bg-muted/70 hover:text-accent group-focus-within:bg-muted/70 group-focus-within:text-accent"
                    onFocus={() => setIsDesktopPortfolioOpen(true)}
                    onClick={() => setIsDesktopPortfolioOpen(false)}
                  >
                    {item.label}
                    <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-y-[1px]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </Link>

                  <div
                    className={`absolute left-1/2 top-full z-20 w-80 -translate-x-1/2 px-2 pt-2 transition-all duration-200 ${
                      isDesktopPortfolioOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-1 opacity-0'
                    }`}
                  >
                    <div className="rounded-[1.1rem] border border-border/80 bg-background/96 p-2 shadow-[0_22px_48px_rgba(20,16,11,0.1)] backdrop-blur-md">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block rounded-[0.95rem] px-4 py-3 transition-colors hover:bg-muted/80"
                          onClick={() => setIsDesktopPortfolioOpen(false)}
                        >
                          <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground">
                            {child.label}
                          </span>
                          <span className="mt-1 block max-w-[28ch] text-[12px] leading-relaxed text-muted-foreground">
                            {child.description}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors text-muted-foreground hover:text-accent"
                >
                  {item.label}
                </Link>
              )
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-5">
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
                  item.children ? (
                    <div key={item.href} className="flex flex-col">
                      <button
                        onClick={() => setIsPortfolioOpen((open) => !open)}
                        className="flex items-center justify-between py-3 text-sm uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-accent"
                      >
                        <span>{item.label}</span>
                        <svg
                          className={`h-4 w-4 transition-transform ${isPortfolioOpen ? 'rotate-180' : ''}`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                        </svg>
                      </button>

                      {isPortfolioOpen && (
                        <div className="ml-2 border-l border-border/80 pl-4 pb-2">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block py-2 text-sm text-muted-foreground transition-colors hover:text-accent"
                              onClick={() => {
                                setIsMenuOpen(false);
                                setIsPortfolioOpen(false);
                              }}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-sm uppercase tracking-[0.12em] py-3 text-muted-foreground hover:text-accent transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )
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
