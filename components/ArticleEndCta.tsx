import Link from 'next/link';
import { CALENDLY_URL } from '@/lib/site';

// The end of every article: both kinds of work, each with a real destination.
export function ArticleEndCta() {
  return (
    <section className="article-cta" aria-label="Work with me">
      <p>Thanks for reading. I write BOFU content for B2B SaaS companies and agencies, and I build AI-assisted tools for content teams.</p>
      <p>Got an article in mind? My prices are on the hire-me page. Does your team keep doing some task by hand? Tell me about it, and we’ll work out whether a tool would help.</p>
      <Link href="/services" className="button button-ink">See my prices</Link>
      <a href={CALENDLY_URL} rel="noopener" target="_blank" className="button button-line">Book a 30-minute call</a>
    </section>
  );
}
