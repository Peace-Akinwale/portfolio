'use client';

import Link from 'next/link';
import { useEffect, useId, useState } from 'react';
import { usePathname } from 'next/navigation';
import { CALENDLY_URL, NAV_LINKS } from '@/lib/site';
import { ThemeToggle } from '@/components/ThemeToggle';

// One top bar for every page: the name on the left, the six sections on the
// right, "Let’s chat" last (Peace, 4 Nov 2026: an invitation to talk; it opens the same Calendly page as every body button). Sticky, on the page's own ground, with a hairline.
// Under 1024px the sections sit behind a disclosure button, so a label never wraps.
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const isCurrent = (href: string) =>
    pathname === href || (href !== '/' && !!pathname && pathname.startsWith(href + '/'));

  return (
    <header className="site-header sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
      <a href="#main" className="skip-link">Skip to content</a>
      <div className="gutter flex min-h-[56px] items-center justify-between gap-3 lg:gap-6">
        <Link href="/" className="display shrink-0 whitespace-nowrap text-[18px] font-[560] tracking-[-0.01em] text-foreground no-underline lg:text-[20px]">
          Peace Akinwale
        </Link>

        <nav aria-label="Site" className="hidden items-center gap-6 lg:flex xl:gap-7">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isCurrent(item.href) ? 'page' : undefined}
              className="nav-link whitespace-nowrap text-[15px] font-medium text-muted-foreground hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
          <a href={CALENDLY_URL} target="_blank" rel="noopener" className="button button-ink whitespace-nowrap text-[14px]">
            Let’s chat
          </a>
        </nav>

        <div className="flex items-center gap-1 lg:hidden">
        {/* Under 360px the header cannot hold the name, this button, the theme toggle and the menu; the menu repeats "Let’s chat". */}
        <a href={CALENDLY_URL} target="_blank" rel="noopener" className="button button-ink min-h-9 shrink-0 whitespace-nowrap px-3 py-1.5 text-[12.5px] header-book">
          Let’s chat
        </a>
        <ThemeToggle />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-foreground"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls={menuId}
        >
          {open ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
        </div>
      </div>

      {open && (
        <nav id={menuId} aria-label="Site" className="gutter border-t border-border pb-4 pt-2 lg:hidden">
          <ul className="flex flex-col">
            {NAV_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isCurrent(item.href) ? 'page' : undefined}
                  className="nav-link block py-3 text-[17px] text-foreground"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <a href={CALENDLY_URL} target="_blank" rel="noopener" className="button button-ink mt-2 inline-flex" onClick={() => setOpen(false)}>
            Let’s chat
          </a>
        </nav>
      )}
    </header>
  );
}
