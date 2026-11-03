import { withOg } from '@/lib/og';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import '@/components/home/home.css';
import { QuestionNav } from '@/components/home/QuestionNav';
import { CALENDLY_URL, EMAIL, SITE_URL } from '@/lib/site';
import {
  HERO, QUESTIONS, ANSWERS, SECTION_NAMES, DOCS_WATCH, MANYREQUESTS, AEO, FANOUT, EDITOR, READING_APP, HOW_I_WORK, OFFER,
} from '@/lib/content/home-copy';

export const metadata: Metadata = withOg({
  title: 'Peace Akinwale, B2B SaaS content writer and AI tools for content teams',
  description:
    'Articles B2B SaaS buyers read before they choose a product, and AI tools content and SEO teams use every week. 51 articles for ManyRequests, AI Docs Watch, a search recorder for AI answers.',
  alternates: { canonical: SITE_URL },
}, { key: 'home', path: '/', alt: 'Good work starts with good questions. Peace Akinwale' });

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} rel="noopener" target="_blank">
      {children}
    </a>
  );
}

export default function HomePage() {
  return (
    <div className="home">
      <section className="hero" aria-labelledby="hero-h">
        <div className="hero-paper ground-paper">
          <h1 id="hero-h">{HERO.heading}</h1>
          <div>
            <p className="hero-line">{HERO.line}</p>
            <p className="hero-who">{HERO.who}</p>
          </div>
        </div>
        <div className="hero-night ground-night">
          <figure className="hero-portrait">
            <Image
              src="/images/home/peace-portrait.jpg"
              width={1400}
              height={2097}
              priority
              sizes="(max-width: 760px) 100vw, 50vw"
              alt="Peace Akinwale in a pinstriped suit, smiling with arms folded"
            />
          </figure>
        </div>
      </section>

      <QuestionNav items={QUESTIONS} />

      {/* Q1 */}
      <section className="split" id="q1" aria-labelledby="q1h">
        <div className="split-paper ground-paper">
          <p className="section-name">{SECTION_NAMES.q1}</p>
          <h2 id="q1h">Is this true?</h2>
          <p className="answer">{ANSWERS.Q1}</p>
          <p className="eyebrow"><b>Writing</b> For ManyRequests, 5 Jan 2026</p>
          <h3><Ext href={MANYREQUESTS.url}>{MANYREQUESTS.title}</Ext></h3>
          <div className="body"><p>{MANYREQUESTS.body}</p></div>
          <figure className="shot">
            <Image src="/images/home/serp-design-annotation.png" width={1299} height={872} loading="lazy" sizes="(max-width: 760px) 100vw, 50vw" alt="Google results for 'design annotation tools' in April 2026, with the ManyRequests article in third place" />
            <figcaption>{MANYREQUESTS.caption}</figcaption>
          </figure>
          <p className="go">
            <Ext href={MANYREQUESTS.url}>Read the article on ManyRequests</Ext>
            <Link href={MANYREQUESTS.caseStudy}>How the ManyRequests work went</Link>
          </p>
        </div>
        <div className="split-night ground-night">
          <p className="mobile-q">And from the building side</p>
          <p className="eyebrow"><b>Building</b> AI Docs Watch, live</p>
          <h3><Link href={DOCS_WATCH.caseStudy}>Show the page before and after. Then say what’s true now.</Link></h3>
          <div className="body">
            <p>{DOCS_WATCH.p1}</p>
            <p>{DOCS_WATCH.p2}</p>
          </div>
          <figure className="shot">
            <Image src="/images/home/docswatch-change.jpg" width={1400} height={758} loading="lazy" sizes="(max-width: 760px) 100vw, 50vw" alt="A Docs Watch change page titled 'Low impact edit to Usage Policy', with a one-sentence summary and a 'See the change side by side' button. Below them, a dated list of every version of the page." />
            <figcaption>{DOCS_WATCH.caption}</figcaption>
          </figure>
          <p className="go">
            <Ext href={DOCS_WATCH.site}>Open AI Docs Watch</Ext>
            <Link href={DOCS_WATCH.caseStudy}>How I built it</Link>
          </p>
        </div>
      </section>

      {/* Q2 */}
      <section className="split" id="q2" aria-labelledby="q2h">
        <div className="split-paper ground-paper">
          <p className="section-name">{SECTION_NAMES.q2}</p>
          <h2 id="q2h">What’s worth making?</h2>
          <p className="answer">{ANSWERS.Q2}</p>
          <p className="eyebrow"><b>Writing</b> On my blog, 14 Apr 2026</p>
          <h3><Link href={AEO.href}>{AEO.heading}</Link></h3>
          <div className="body">
            <p>{AEO.p1}</p>
            <p>{AEO.p2}</p>
          </div>
          <p className="go"><Link href={AEO.href}>Read the article</Link></p>
        </div>
        <div className="split-night ground-night">
          <p className="mobile-q">And from the building side</p>
          <p className="eyebrow"><b>Building</b> Fanout query analysis tool</p>
          <h3><Link href={FANOUT.caseStudy}>Research before code, then analysis as the output.</Link></h3>
          <div className="body">
            <p>{FANOUT.p1}</p>
            <p>{FANOUT.p2}</p>
          </div>
          <dl className="kv">
            {FANOUT.kv.map((row) => (
              <div key={row.k} className="contents">
                <dt>{row.k}</dt>
                <dd>{row.v}</dd>
              </div>
            ))}
          </dl>
          <p className="go"><Link href={FANOUT.caseStudy}>How it came about</Link></p>
        </div>
      </section>

      {/* Q3 */}
      <section className="split" id="q3" aria-labelledby="q3h">
        <div className="split-paper ground-paper">
          <p className="section-name">{SECTION_NAMES.q3}</p>
          <h2 id="q3h">What does done mean?</h2>
          <p className="answer">{ANSWERS.Q3}</p>
          <p className="eyebrow"><b>Writing</b> Ghostwritten for Jabra, 29 May 2025</p>
          <h3>What an editor wrote on the first draft.</h3>
          <div className="body"><p>{EDITOR.intro}</p></div>
          <figure className="shot narrow">
            <Image src="/images/home/editor-comment-jabra.png" width={335} height={469} loading="lazy" sizes="330px" alt={EDITOR.alt} />
            <figcaption>{EDITOR.caption}</figcaption>
          </figure>
          <p className="go"><Link href="/testimonials">More nice things clients said</Link></p>
        </div>
        <div className="split-night ground-night">
          <p className="mobile-q">And from the building side</p>
          <p className="eyebrow"><b>Building</b> An app an agency uses to follow SEO and AEO trends, 10 Jun 2026</p>
          <h3><Link href={READING_APP.caseStudy}>Done is measured on the live app, not reported by a test.</Link></h3>
          <div className="body">
            <p>{READING_APP.p1}</p>
            <p>{READING_APP.p2}</p>
          </div>
          <figure className="shot">
            <Image src={READING_APP.shot} width={1340} height={712} loading="lazy" sizes="(max-width: 760px) 100vw, 50vw" alt={READING_APP.shotAlt} />
            <figcaption>{READING_APP.shotCaption}</figcaption>
          </figure>
          <p className="go">
            <Link href={READING_APP.caseStudy}>How the app came together</Link>
            <Link href={READING_APP.article}>Five lessons from building it</Link>
          </p>
        </div>
      </section>

      <section className="how ground-paper" id="how" aria-labelledby="how-h">
        <div className="how-inner">
          <h2 id="how-h">How I work</h2>
          <div>
            <p>{HOW_I_WORK.p1}</p>
            <p>{HOW_I_WORK.p2}</p>
            <p className="go">
              <Link href="/case-studies">The case studies</Link>
              <Link href="/portfolio#writing">Writing samples by client</Link>
            </p>
          </div>
        </div>
      </section>

      <section className="offer" id="work-with-me" aria-label="Working with me">
        <div className="ground-paper">
          <h2>Writing with me</h2>
          <p>{OFFER.writing}</p>
          <ul>
            {OFFER.prices.map((p) => <li key={p}>{p}</li>)}
          </ul>
          <Ext href={CALENDLY_URL}><span className="button button-ink">Book a 30-minute call</span></Ext>
          <a className="button button-line" href={`mailto:${EMAIL}?subject=An%20article`}>Email about an article</a>
          <Link className="button button-line" href="/services">What you get</Link>
        </div>
        <div className="ground-night">
          <h2>Building with me</h2>
          <p>{OFFER.building}</p>
          <p className="note">No price list for this one. We talk about the task first, then I scope it.</p>
          <Ext href={CALENDLY_URL}><span className="button button-accent">Book a 30-minute call</span></Ext>
          <Link className="button button-line" href="/contact">Or write to me</Link>
        </div>
      </section>
    </div>
  );
}
