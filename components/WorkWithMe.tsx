import Link from 'next/link';
import { CALENDLY_URL, EMAIL } from '@/lib/site';

// The call to action at the end of a case study or the record: a heading that
// asks, one line on what happens next, and two buttons. Booking a call is the
// primary action. Peace, 28 Oct 2026: underlined text links "don't look like CTAs".
export function WorkWithMe({
  heading,
  body,
  secondary = { label: 'Send an email', href: `mailto:${EMAIL}` },
}: {
  heading: string;
  body: string;
  secondary?: { label: string; href: string };
}) {
  const external = secondary.href.startsWith('mailto:') || secondary.href.startsWith('http');
  return (
    <section className="cta-card" aria-labelledby="cta-h">
      <h2 id="cta-h">{heading}</h2>
      <p>{body}</p>
      <div className="cta-actions">
        <a href={CALENDLY_URL} rel="noopener" target="_blank" className="button button-ink">Book a 30-minute call</a>
        {external
          ? <a href={secondary.href} className="button button-line">{secondary.label}</a>
          : <Link href={secondary.href} className="button button-line">{secondary.label}</Link>}
      </div>
    </section>
  );
}
