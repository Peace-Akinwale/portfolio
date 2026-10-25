import Link from 'next/link';
import { CALENDLY_URL } from '@/lib/site';

// The end of every article: both kinds of work, each with a real destination.
export function ArticleEndCta() {
  return (
    <section className="article-cta" aria-label="Work with me">
      <p>I write bottom-of-funnel content for B2B SaaS companies and agencies, and I build AI-assisted tools for content teams.</p>
      <p>If you have an article in mind, the prices and what’s included are on the services page. If your team keeps doing a task by hand, tell me about it and I’ll help you work out whether a tool would make it easier.</p>
      <Link href="/services" className="button button-ink">Services and prices</Link>
      <a href={CALENDLY_URL} rel="noopener" target="_blank" className="button button-line">Book a 30-minute call</a>
    </section>
  );
}
