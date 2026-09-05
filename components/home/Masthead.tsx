import Link from 'next/link';
import { ThemeToggle } from '@/components/ui';
import { BOOK_LABEL } from '@/lib/content/clients';

const LINKS = [
  { href: '/services', label: 'Services' },
  { href: '/case-studies', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
];

/** The title page's masthead. Static, in the flow, set like a running head. */
export function Masthead() {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-border py-5">
      <Link href="/" className="font-display text-base font-bold text-foreground">
        Peace Akinwale
      </Link>
      <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-2">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="t-label hidden rounded-full px-2.5 py-2 text-muted-foreground hover:text-foreground sm:inline-block">
            {l.label}
          </Link>
        ))}
        <Link href="/contact" className="t-label rounded-full px-2.5 py-2 text-accent hover:text-foreground">
          {BOOK_LABEL}
        </Link>
        <ThemeToggle className="ml-1" />
      </nav>
    </div>
  );
}
