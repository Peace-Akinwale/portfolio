import Link from 'next/link';
import { NAV_LINKS, EMAIL, LINKEDIN_URL, GITHUB_URL, X_URL } from '@/lib/site';

const WORK_LINKS = [
  { href: '/portfolio#writing', label: 'Writing samples' },
  { href: '/projects', label: 'Projects' },
  { href: '/testimonials', label: 'Nice things clients said' },
  { href: '/rss.xml', label: 'RSS' },
];

export function Footer({ night = false }: { night?: boolean }) {
  const year = new Date().getFullYear();

  return (
    <footer className={`${night ? 'ground-night' : ''} mt-auto border-t border-border`}>
      <div className="gutter grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="display text-[26px] font-[560] leading-none">Peace Akinwale</p>
          <p className="mt-3 max-w-[34ch] text-[15px] leading-relaxed text-muted-foreground">
            I write BOFU content for B2B SaaS companies and agencies, and I build AI-assisted tools for content teams. Writing to you from Lagos.
          </p>
        </div>

        <nav aria-label="Pages">
          <p className="footer-label">Around the site</p>
          <ul className="mt-3 flex flex-col gap-2">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="footer-link">{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="More of the work">
          <p className="footer-label">More to look at</p>
          <ul className="mt-3 flex flex-col gap-2">
            {WORK_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="footer-link">{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Elsewhere">
          <p className="footer-label">Find me elsewhere</p>
          <ul className="mt-3 flex flex-col gap-2">
            <li><a href={`mailto:${EMAIL}`} className="footer-link">Email</a></li>
            <li><a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="footer-link">LinkedIn</a></li>
            <li><a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a></li>
            <li><a href={X_URL} target="_blank" rel="noopener noreferrer" className="footer-link">X</a></li>
          </ul>
        </nav>
      </div>
      <div className="gutter border-t border-border py-5 text-[13.5px] text-muted-foreground">
        &copy; {year} Peace Akinwale. Thanks for scrolling all the way down.
      </div>
    </footer>
  );
}
