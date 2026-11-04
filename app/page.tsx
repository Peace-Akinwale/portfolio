import { withOg } from '@/lib/og';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import '@/components/home/home.css';
import { CALENDLY_URL, EMAIL, SITE_URL } from '@/lib/site';
import { HERO, WRITING, BUILDING, AI_TOOLS, THINKING, OFFER } from '@/lib/content/home-copy';
import { PriceList } from '@/components/PriceList';

export const metadata: Metadata = withOg({
  title: 'Peace Akinwale, B2B SaaS content writer and AI workflow builder',
  description:
    'Articles B2B SaaS buyers read before they choose a product, and AI workflows built for what content and SEO teams need.',
  alternates: { canonical: SITE_URL },
}, { key: 'home', path: '/', alt: 'Peace Akinwale, B2B SaaS content writer and AI workflow builder' });

function Ext({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={href} rel="noopener" target="_blank" className={className}>
      {children}
    </a>
  );
}

type Shot = { shot: string; shotW: number; shotH: number; shotAlt: string; caption?: string };

function Exhibit({ s, priority = false }: { s: Shot; priority?: boolean }) {
  return (
    <figure className="exhibit">
      <Image
        src={s.shot}
        width={s.shotW}
        height={s.shotH}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        sizes="(max-width: 900px) 100vw, 60vw"
        alt={s.shotAlt}
        // Never upscale a cropped screenshot past its own width: it blurs.
        style={{ maxWidth: s.shotW }}
      />
      {s.caption && <figcaption>{s.caption}</figcaption>}
    </figure>
  );
}

function Links({ links }: { links: { href: string; label: string }[] }) {
  return (
    <p className="go">
      {links.map((l) => (
        <Link key={l.href} href={l.href}>{l.label}</Link>
      ))}
    </p>
  );
}

export default function HomePage() {
  return (
    <div className="home">
      <section className="hero" aria-labelledby="hero-h">
        <div className="hero-text">
          <h1 id="hero-h">{HERO.heading}</h1>
          <p className="hero-line">{HERO.line}</p>
          <p className="hero-actions">
            <Ext href={CALENDLY_URL} className="button button-accent">{HERO.cta}</Ext>
            <Link href="/case-studies" className="button button-line">See the case studies</Link>
          </p>
        </div>
        <figure className="hero-portrait">
          <Image
            src="/images/home/peace-portrait.jpg"
            width={1400}
            height={2097}
            priority
            sizes="(max-width: 900px) 60vw, 380px"
            alt="Peace Akinwale in a pinstriped suit, smiling with arms folded"
          />
        </figure>
      </section>

      {/* Writing */}
      <section className="proof" id="writing" aria-labelledby="writing-h">
        <div className="proof-text">
          <h2 id="writing-h">{WRITING.heading}</h2>
          <p>{WRITING.p1}</p>
          <p>{WRITING.p2}</p>
          <Links links={WRITING.links} />
        </div>
        <Exhibit s={WRITING} />
      </section>

      {/* Building */}
      <section className="proof night ground-night" id="building" aria-labelledby="building-h">
        <div className="proof-text">
          <h2 id="building-h">{BUILDING.heading}</h2>
          <p>{BUILDING.p1}</p>
          <Links links={BUILDING.links} />
        </div>
        <Exhibit s={BUILDING} />
      </section>

      {/* AI Docs Watch, end to end */}
      <section className="proof" id="ai-tools" aria-labelledby="ai-h">
        <div className="proof-text">
          <h2 id="ai-h">{AI_TOOLS.heading}</h2>
          <p>{AI_TOOLS.p1}</p>
          <p className="go">
            <Ext href={AI_TOOLS.site}>Open AI Docs Watch</Ext>
            {AI_TOOLS.links.map((l) => <Link key={l.href} href={l.href}>{l.label}</Link>)}
          </p>
        </div>
        <Exhibit s={AI_TOOLS} />
      </section>

      {/* Thinking */}
      <section className="proof night ground-night" id="thinking" aria-labelledby="thinking-h">
        <div className="proof-text">
          <h2 id="thinking-h">{THINKING.heading}</h2>
          <dl className="questions">
            {THINKING.questions.map((row) => (
              <div key={row.q}>
                <dt>{row.q}</dt>
                <dd>{row.a}</dd>
              </div>
            ))}
          </dl>
          <p className="catch">{THINKING.how}</p>
          <Links links={THINKING.links} />
        </div>
        <Exhibit s={THINKING} />
      </section>

      <section className="offer" id="work-with-me" aria-label="Working with me">
        <div>
          <h2>Writing</h2>
          <p>{OFFER.writing}</p>
          <PriceList rows={OFFER.priceRows} label="Writing prices" />
          <p className="note">Prices in US dollars.</p>
          <p className="offer-actions">
            <Ext href={CALENDLY_URL} className="button button-ink">Book a 30-minute call</Ext>
            <a className="button button-line" href={`mailto:${EMAIL}?subject=An%20article`}>Email about an article</a>
          </p>
          <p className="go"><Link href="/services#includes">What every article includes</Link></p>
        </div>
        <div>
          <h2>AI workflows</h2>
          <p>{OFFER.building}</p>
          <PriceList rows={[OFFER.workflowRow]} label="AI workflow pricing" />
          <p className="offer-actions">
            <Ext href={CALENDLY_URL} className="button button-ink">Book a 30-minute call</Ext>
            <Link className="button button-line" href="/contact">Describe the task</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
