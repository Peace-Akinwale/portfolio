'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button, ThemeToggle } from '@/components/ui';
import { BOOK_LABEL } from '@/lib/content/clients';
import { cx } from '@/lib/cx';

const WORK_LINKS = [
  { href: '/case-studies', label: 'Case studies', description: 'Client engagements, results, and what made them work.' },
  { href: '/portfolio', label: 'Portfolio', description: 'Writing samples across B2B SaaS clients.' },
  { href: '/testimonials', label: 'Testimonials', description: 'What clients say about working with me.' },
  { href: '/projects', label: 'Projects', description: 'Tools and systems I have built.' },
];

const PRIMARY_LINKS = [
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Work', children: WORK_LINKS },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

const navLink = 't-label inline-flex min-h-9 items-center gap-1 rounded-full px-3 text-muted-foreground hover:text-foreground';

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWorkOpen, setIsWorkOpen] = useState(false);
  const [isDesktopWorkOpen, setIsDesktopWorkOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);
  const desktopWorkRef = useRef<HTMLDivElement | null>(null);

  // Close every menu when the route changes (state adjusted during render, not in an effect).
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setIsMenuOpen(false);
    setIsWorkOpen(false);
    setIsDesktopWorkOpen(false);
  }

  useEffect(() => {
    if (!isDesktopWorkOpen) return;
    function handlePointerDown(event: MouseEvent) {
      if (!desktopWorkRef.current?.contains(event.target as Node)) setIsDesktopWorkOpen(false);
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsDesktopWorkOpen(false);
    }
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isDesktopWorkOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-6xl gutter pt-3">
        <div className="rounded-full border border-border/80 bg-background/85 backdrop-blur-md">
          <div className="flex items-center justify-between gap-6 px-4 py-2 sm:px-5">
            <Link href="/" className="font-display text-lg font-bold text-foreground hover:opacity-80" onClick={() => setIsMenuOpen(false)}>
              Peace Akinwale
            </Link>

            <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
              {PRIMARY_LINKS.map((item) =>
                item.children ? (
                  <div
                    key={item.href}
                    ref={desktopWorkRef}
                    className="relative"
                    onMouseEnter={() => setIsDesktopWorkOpen(true)}
                    onMouseLeave={() => setIsDesktopWorkOpen(false)}
                  >
                    <Link
                      href={item.href}
                      className={navLink}
                      aria-haspopup="true"
                      aria-expanded={isDesktopWorkOpen}
                      onFocus={() => setIsDesktopWorkOpen(true)}
                      onClick={() => setIsDesktopWorkOpen(false)}
                    >
                      {item.label}
                      <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                      </svg>
                    </Link>
                    <div
                      className={cx(
                        'absolute left-1/2 top-full z-20 w-80 -translate-x-1/2 pt-3 transition-[opacity,transform] duration-150',
                        isDesktopWorkOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-1 opacity-0',
                      )}
                    >
                      <div className="rounded-md border border-border bg-surface p-1.5 shadow-[0_18px_40px_-20px_rgba(23,22,20,0.35)]">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block rounded-sm px-3.5 py-3 hover:bg-muted"
                            onClick={() => setIsDesktopWorkOpen(false)}
                          >
                            <span className="t-label block text-foreground">{child.label}</span>
                            <span className="mt-1 block max-w-[30ch] text-[13px] leading-relaxed text-muted-foreground">{child.description}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link key={item.href} href={item.href} className={navLink}>
                    {item.label}
                  </Link>
                ),
              )}
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <span className="hidden md:inline-flex">
                <Button href="/contact" size="sm">
                  {BOOK_LABEL}
                </Button>
              </span>
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground lg:hidden"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
                    <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
                    <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <nav className="border-t border-border px-4 pb-4 pt-2 lg:hidden" aria-label="Mobile">
              <div className="flex flex-col py-2">
                {PRIMARY_LINKS.map((item) =>
                  item.children ? (
                    <div key={item.href} className="flex flex-col">
                      <button
                        type="button"
                        onClick={() => setIsWorkOpen((open) => !open)}
                        className="t-label flex items-center justify-between py-3 text-muted-foreground hover:text-foreground"
                        aria-expanded={isWorkOpen}
                      >
                        <span>{item.label}</span>
                        <svg className={cx('h-3.5 w-3.5 transition-transform', isWorkOpen && 'rotate-180')} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                        </svg>
                      </button>
                      {isWorkOpen && (
                        <div className="mb-2 ml-1 border-l border-border pl-4">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block py-2 text-sm text-muted-foreground hover:text-foreground"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link key={item.href} href={item.href} className="t-label py-3 text-muted-foreground hover:text-foreground" onClick={() => setIsMenuOpen(false)}>
                      {item.label}
                    </Link>
                  ),
                )}
              </div>
              <Button href="/contact" className="mt-2 w-full">
                {BOOK_LABEL}
              </Button>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
