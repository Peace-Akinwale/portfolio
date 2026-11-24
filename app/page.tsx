import type { Metadata } from 'next';
import { withOg } from '@/lib/og';
import descriptions from '@/lib/content/page-descriptions.json';
import Image from 'next/image';
import Link from 'next/link';
import { HERO, WRITING, CONTENTDB } from '@/lib/content/home-copy';
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
          <div><dt>51</dt><dd><Link href="/case-studies/manyrequests">BOFU &amp; MOFU articles for ManyRequests ↗</Link></dd></div>
          <div><dt>2+ years</dt><dd><Link href="/case-studies/highervisibility">Writing content for HigherVisibility ↗</Link></dd></div>
          <div><dt>Steve Toth</dt><dd><Link href="/case-studies/seo-aeo-research-workflows">AI research tools built for his team ↗</Link></dd></div>
        </dl>
      </div>
      <div className={s.frame}>
        <figure className={s.portrait}>
          <Image src="/images/home/peace-portrait.jpg" width={1400} height={2097} priority quality={90} sizes="(max-width: 700px) 92vw, 480px" alt="Peace Akinwale in a pinstriped suit, smiling with arms folded" />
        </figure>
        <blockquote className={s.tag}>
          <p>“We never needed more than one round of feedback per article.”</p>
          <cite>Nathan Vander Heyden, head of marketing at Marker.io</cite>
          <Link href="/testimonials">Read the testimonial ↗</Link>
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
      <figcaption className="reviewer-attribution"><Image src="/images/clients/regine-garcia.png" alt="Regine Garcia" width={56} height={56} sizes="56px" /><span>Regine Garcia, operations and content lead at ManyRequests<br /><Link href="/case-studies/manyrequests">Read the case study ↗</Link></span></figcaption>
    </figure>
    <section id="highervisibility" className={s.result} aria-labelledby="result-title">
      <div><p className={s.eyebrow}>Content writing · HigherVisibility</p><h2 id="result-title">Content that helped more than double HigherVisibility’s organic traffic.</h2>
        <p>I was HigherVisibility’s only content writer during a six-month growth period, helping grow its estimated monthly organic traffic from roughly 14,000 to 35,000. I wrote guides that answered buyers’ questions about SEO, agency services, and growing their businesses.</p>
        <Link className={s.read} href="/case-studies/highervisibility">See the content I created ↗</Link>
      </div>
      <div className={s.resultNumbers}><p className={s.metric}>≈14,000 <span>→</span> ≈35,000</p><p>Monthly organic visits<br />July 2023 → January 2024</p><p className={s.estimate}>Semrush estimated sitewide organic traffic. Approximate values from the saved chart.</p></div>
    </section>
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
          <p className={s.eyebrow}>AI workflows · Steve Toth</p>
          <h3>Industry reading and AI documentation monitoring</h3>
          <Link className={s.projectImage} href="/case-studies/seo-aeo-research-workflows" aria-label="Explore the research workflows"><Image unoptimized src="/og/case-study-seo-aeo-research-workflows.png" width={1200} height={630} alt="Industry reading and AI documentation monitoring workflow overview" /></Link>
          <p>For Steve Toth, I built tools that bring relevant SEO, AEO, and marketing posts into one reading workspace and track changes to AI platform documentation.</p>
          <p>These help the team monitor what’s changing and assess how those changes affect—or could improve—its work as an AEO-first agency.</p>
          <Link className={s.read} href="/case-studies/seo-aeo-research-workflows">Read the case study ↗</Link>
        </article>
        <article className={s.project}>
          <p className={s.eyebrow}>AI search analysis · Steve Toth</p>
          <h3>Examine the searches and sources behind AI answers</h3>
          <Link className={s.projectImage} href="/case-studies/fanout-query-analysis-tool" aria-label="Explore the fanout case study"><Image unoptimized src="/og/case-study-fanout-query-analysis-tool.png" width={1200} height={630} alt="Fan-out queries, cited sources and brand mentions workflow overview" /></Link>
          <p>I built a tool that records available fan-out queries—the additional searches AI platforms make—and the sources cited in response to the team’s prompts.</p>
          <p>The team can analyze sources and brand citations, identify where clients are missing, and investigate what to improve.</p>
          <Link className={s.read} href="/case-studies/fanout-query-analysis-tool">Read the case study ↗</Link>
        </article>


      </div>
      <p className={s.otherWork}>More projects: <Link href={CONTENTDB.caseStudy}>ContentDB</Link> · <Link href="/case-studies/read-aloud">Read Aloud</Link> · <Link href="/case-studies/ai-docs-watch">AI Docs Watch</Link> · <Link href="/case-studies/mylinks">MyLinks</Link></p>
    </section>
    <section className={s.contact} aria-labelledby="contact-title">
      <div><h2 id="contact-title">Have something in mind?</h2><p>Let’s talk about your BOFU content needs or workflows you’d like to automate.</p></div>
      <div className={s.actions}><a className={s.primary} href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Book a 30-minute call ↗</a><Link className={s.secondary} href="/services">See services and prices ↗</Link></div>
    </section>
    </div>
  </>;
}
