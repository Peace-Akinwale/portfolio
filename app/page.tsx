import type { Metadata } from 'next';
import { withOg } from '@/lib/og';
import descriptions from '@/lib/content/page-descriptions.json';
import Image from 'next/image';
import Link from 'next/link';
import { HERO, WRITING, BUILDING, CONTENTDB } from '@/lib/content/home-copy';
import { CALENDLY_URL, SITE_URL } from '@/lib/site';
import s from './home.module.css';

export const metadata: Metadata = withOg({
  title: 'B2B SaaS content writer & AI workflows · Peace Akinwale',
  description: descriptions.Home,
  alternates: { canonical: SITE_URL },
}, { key: 'home', path: '/', alt: 'Peace Akinwale, B2B SaaS content writer and AI workflow builder' });

const clients = [
  ['manyrequests.svg', 'ManyRequests'], ['exceed.svg', 'Exceed SEO'],
  ['jabra.svg', 'Jabra'], ['notebook.svg', 'Notebook Agency'],
  ['marker.svg', 'Marker.io'], ['highervisibility.svg', 'HigherVisibility'],
  ['pangea.png', 'Pangea.ai'], ['kairos.svg', 'Kairos Labs'],
];

export default function HomePage() {
  return <>
    <section className={s.hero} aria-labelledby="home-title">
      <div className={s.heroCopy}>
        <p className={s.eyebrow}>B2B SaaS content writer · AI workflow builder</p>
        <h1 id="home-title">I write BOFU content for B2B SaaS companies &amp; build <em>AI marketing workflows.</em></h1>
        <p className={s.intro}>{HERO.line}</p>
        <div className={s.actions}>
          <a className={s.primary} href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">{HERO.cta} <span aria-hidden="true">↗</span></a>
          <Link className={s.secondary} href="/writing">See my work</Link>
        </div>
        <p className={s.note}>New articles $600. Refreshes $400. I’ll reply within a business day.</p>
        <dl className={s.facts}>
          <div><dt>51</dt><dd>BOFU &amp; MOFU articles for ManyRequests</dd></div>
          <div><dt>1</dt><dd>round of feedback per article at Marker.io</dd></div>
          <div><dt>3–5</dt><dd>business days to a first draft</dd></div>
        </dl>
      </div>
      <div className={s.frame}>
        <figure className={s.portrait}>
          <Image src="/images/home/peace-portrait.jpg" width={1400} height={2097} priority quality={90} sizes="(max-width: 700px) 92vw, 480px" alt="Peace Akinwale in a pinstriped suit, smiling with arms folded" />
        </figure>
        <blockquote className={s.tag}>
          <p>“We never needed more than one round of feedback per article.”</p>
          <cite>Nathan Vander Heyden, head of marketing at Marker.io</cite>
        </blockquote>
        <p className={s.caption}><b>Peace Akinwale</b><span>B2B SaaS content writer</span></p>
      </div>
    </section>

    <section className={s.band} aria-label="Clients">
      <p>You’re in good company</p>
      <div className={s.logos}>{clients.map(([file, name]) => <figure key={name} className={name === 'Notebook Agency' ? s.notebook : undefined}>
        <Image src={`/images/approved/client-logos/${file}`} width={180} height={60} alt={name === 'Jabra' ? 'Jabra, via Spicy Margarita' : name} />
      </figure>)}</div>
    </section>

    <div className={s.page}>
    <figure className={s.testimonial}>
      <blockquote>“His top-performing posts are product-led ones, which has led to more traffic and demo requests for ManyRequests.”</blockquote>
      <figcaption className="reviewer-attribution"><Image src="/images/clients/regine-garcia.png" alt="Regine Garcia" width={56} height={56} sizes="56px" /><span>Regine Garcia, operations and content lead at ManyRequests</span></figcaption>
    </figure>
    <section id="selected-work" className={s.work} aria-labelledby="selected-title">
      <div className={s.sectionHead}><h2 id="selected-title">Selected work</h2><Link href="/case-studies">See all case studies ↗</Link></div>
      <div className={s.projects}>
        <article className={s.project}>
          <h3>Product-led content for ManyRequests</h3>
          <p>I&apos;ve written 51 BOFU &amp; MOFU articles showing readers how ManyRequests can help manage their agency operations in one place.</p>
          <Link className={s.projectImage} href="/case-studies/manyrequests" aria-label="Explore the ManyRequests case study"><Image src={WRITING.shot} width={WRITING.shotW} height={WRITING.shotH} sizes="(max-width: 700px) 90vw, 580px" alt={WRITING.shotAlt} /></Link>
          <Link className={s.read} aria-label="Read the ManyRequests case study" href="/case-studies/manyrequests">Read the case study ↗</Link>
        </article>
        <article className={s.project}>
          <h3>Product-led content for Exceed SEO</h3>
          <p>I&apos;ve written comparison content and how-to guides for two of Exceed SEO&apos;s event software clients.</p>
          <Link className={s.projectImage} href="/case-studies/exceed-seo" aria-label="Explore the Exceed SEO case study"><Image src="/case-studies/exceed-seo/lateef-research-feedback.png" width={1196} height={310} sizes="(max-width: 700px) 90vw, 580px" alt="Lateef Maleek praises the depth, quality and specificity of Peace’s product research" /></Link>
          <Link className={s.read} aria-label="Read the Exceed SEO case study" href="/case-studies/exceed-seo">Read the case study ↗</Link>
        </article>
        <article className={s.project}>
          <h3>A tool to analyze fanout queries</h3>
          <p>Record AI search activity so strategists can analyze citations, brand mentions and why AI platforms choose a client’s competitors.</p>
          <Link className={s.projectImage} href={BUILDING.links[0].href} aria-label="Explore the fanout case study"><Image src={BUILDING.shot} width={BUILDING.shotW} height={BUILDING.shotH} sizes="(max-width: 700px) 90vw, 580px" alt={BUILDING.shotAlt} /></Link>
          <Link className={s.read} aria-label="Read the Fanout case study" href={BUILDING.links[0].href}>Read the case study ↗</Link>
        </article>
        <article className={s.project}>
          <h3>ContentDB</h3>
          <p>Find useful quotes and their original context in your saved research while writing in Claude or ChatGPT.</p>
          <Link className={s.projectImage} href={CONTENTDB.caseStudy} aria-label="Explore the ContentDB case study"><Image src="/images/approved/contentdb/02-keyword-search-retainer.jpg" width={1440} height={1000} sizes="(max-width: 700px) 90vw, 580px" alt="ContentDB search for retainer, showing multiple sources and their surrounding context" /></Link>
          <Link className={s.read} aria-label="Read the ContentDB case study" href={CONTENTDB.caseStudy}>Read the case study ↗</Link>
        </article>

      </div>
      <p className={s.otherWork}>More projects: <Link href="/case-studies/aloud">Aloud</Link> · <Link href="/case-studies/ai-docs-watch">AI Docs Watch</Link> · <Link href="/projects/mylinks">MyLinks</Link></p>
    </section>
    <section className={s.contact} aria-labelledby="contact-title">
      <div><h2 id="contact-title">Have something in mind?</h2><p>Let’s talk about your BOFU content needs or workflows you’d like to automate.</p></div>
      <div className={s.actions}><a className={s.primary} href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Book a 30-minute call ↗</a><Link className={s.secondary} href="/services">See services and prices ↗</Link></div>
    </section>
    </div>
  </>;
}
