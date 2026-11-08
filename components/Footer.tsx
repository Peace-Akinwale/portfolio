import Link from 'next/link';
import { NAV_LINKS, EMAIL, LINKEDIN_URL, X_URL, CALENDLY_URL } from '@/lib/site';

// Footer, redesigned 4 Nov 2026 (Peace: "the footer can be much better designed").
// One closing action instead of three link lists that repeated the header:
// who she is and the call on top, the site in one line beneath, then the year.
// The RSS feed is linked from <head> in app/layout.tsx, not from here.
export function Footer({ night = false, compact = false }: { night?: boolean; compact?: boolean }) {
  const year = new Date().getFullYear();

  return (
    <footer className={`${night ? 'ground-night' : ''} site-footer mt-auto border-t border-border`}>
      <div className="gutter footer-top">
        <div>
          <p className="footer-name display">Peace Akinwale</p>
          {!compact && <p className="footer-line">
            B2B SaaS content that explains your product’s use cases, and AI workflows configured to the way your marketing team works.
          </p>}
        </div>
        <div className="footer-cta">
          {!compact && <a href={CALENDLY_URL} target="_blank" rel="noopener" className="button button-ink">Book a 30-minute call</a>}
          <a href={`mailto:${EMAIL}`} className="footer-email">{EMAIL}</a>
        </div>
      </div>

      <div className="gutter footer-links">
        <nav aria-label="Pages">
          <ul>
            {NAV_LINKS.map((l) => (
              <li key={l.href}><Link href={l.href} className="footer-link">{l.label}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Elsewhere">
          <ul>
            <li><Link href="/testimonials" className="footer-link">What clients say</Link></li>
            <li><a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="footer-link">LinkedIn</a></li>
            <li><a href={X_URL} target="_blank" rel="noopener noreferrer" className="footer-link">X</a></li>
          </ul>
        </nav>
      </div>

      <p className="gutter footer-base">&copy; {year} Peace Akinwale</p>
    </footer>
  );
}
