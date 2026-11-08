import Link from 'next/link';
import { CALENDLY_URL } from '@/lib/site';

// The end of every article: both kinds of work, each with a real destination.
export function ArticleEndCta() {
  return (
    <section className="article-cta" aria-label="Work with me">
      <p>If this has given you an idea for your team, I can help you develop it. I write B2B SaaS content and build AI workflows for marketing teams and agencies.</p>
      <Link href="/services" className="button button-ink">See services and prices</Link>
      <a href={CALENDLY_URL} rel="noopener" target="_blank" className="button button-line">Book a free first call</a>
    </section>
  );
}
