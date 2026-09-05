import Link from 'next/link';
import { Container, ThemeToggle } from '@/components/ui';

const COLUMNS = [
  {
    heading: 'Work',
    links: [
      { href: '/services', label: 'Services' },
      { href: '/case-studies', label: 'Case studies' },
      { href: '/portfolio', label: 'Portfolio' },
      { href: '/testimonials', label: 'Testimonials' },
    ],
  },
  {
    heading: 'Projects',
    links: [
      { href: '/projects', label: 'All projects' },
      { href: '/projects/contentdb', label: 'ContentDB' },
      { href: '/projects/mylinks', label: 'MyLinks' },
      { href: '/career-pathway', label: 'Career Pathway' },
    ],
  },
  {
    heading: 'Writing',
    links: [
      { href: '/blog', label: 'Blog' },
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    heading: 'Elsewhere',
    links: [
      { href: 'https://www.linkedin.com/in/peaceakinwale/', label: 'LinkedIn' },
      { href: 'https://x.com/PeaceAkinwaleA', label: 'X' },
      { href: 'https://github.com/Peace-Akinwale', label: 'GitHub' },
      { href: '/rss.xml', label: 'RSS' },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <Container className="py-14">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-6">
          <div className="col-span-2">
            <p className="font-display text-lg font-bold text-foreground">Peace Akinwale</p>
            <p className="mt-2 max-w-[28ch] text-sm leading-relaxed text-muted-foreground">
              Product-led content for B2B SaaS. Lagos, Nigeria, working with teams everywhere.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <p className="t-label mb-4 text-muted-foreground">{col.heading}</p>
              <ul className="flex flex-col gap-2">
                {col.links.map((l) =>
                  l.href.startsWith('http') ? (
                    <li key={l.href}>
                      <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground">
                        {l.label}
                      </a>
                    </li>
                  ) : (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm text-muted-foreground hover:text-foreground">
                        {l.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex items-center justify-between gap-4 border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">© {year} Peace Akinwale</p>
          <ThemeToggle />
        </div>
      </Container>
    </footer>
  );
}
