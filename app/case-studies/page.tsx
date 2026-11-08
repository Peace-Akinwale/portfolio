import { withOg } from '@/lib/og';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import '@/components/case-study/case-study.css';
import { firstImage, listCaseStudies } from '@/lib/content/case-studies';
import { readPage } from '@/lib/content/pages';
import descriptions from '@/lib/content/page-descriptions.json';
import { SITE_URL } from '@/lib/site';
import { WorkWithMe } from '@/components/WorkWithMe';

export const metadata: Metadata = withOg({
  title: 'B2B SaaS content & AI workflow case studies · Peace Akinwale',
  description: descriptions['Case studies'],
  alternates: { canonical: SITE_URL + '/case-studies' },
}, { key: 'case-studies', path: '/case-studies', alt: 'Case studies by Peace Akinwale' });

type Entry = { title: string; href: string; summary: string; image?: { src: string; alt: string } };

// Images whose shape differs from the 16:10 card are shown whole, centred on a
// mat in the image's own edge colour, so no white strip shows beside them (8 Nov 2026).
const MATS: Record<string, string> = {
  '/course-portal-cover-blue.png': '#d0e0eb',
  '/lateef-research-feedback.png': '#1b1d21',
};
function matFor(src: string): string | undefined {
  return Object.entries(MATS).find(([end]) => src.endsWith(end))?.[1];
}
function Row({ entry }: { entry: Entry }) {
  return (
    <li className={entry.image ? "cs-row" : "cs-row cs-row-text-only"}>
      {entry.image && <Link href={entry.href} className="cs-row-shot" tabIndex={-1} aria-hidden="true" style={matFor(entry.image.src) ? { background: matFor(entry.image.src)! } : undefined}>
        {entry.image && <Image src={entry.image.src} alt="" fill style={matFor(entry.image.src) ? { objectFit: "contain", objectPosition: "center" } : undefined} sizes="(max-width: 700px) 100vw, 260px" />}
      </Link>}
      <div>
        <h3><Link href={entry.href}>{entry.title}</Link></h3>
        <p>{entry.summary}</p>
        <Link href={entry.href} className="underline underline-offset-4">Read the case study</Link>
      </div>
    </li>
  );
}

export default function CaseStudiesPage() {
  const studies = listCaseStudies();
  const entries = (slugs: string[]) => slugs.flatMap((slug) => {
    const cs = studies.find((s) => s.slug === slug);
    return cs ? [{ title: cs.name, href: '/case-studies/' + cs.slug, summary: cs.blurb, image: firstImage(cs) ?? undefined }] : [];
  });
  const writing = {
    title: readPage('manyrequests').title,
    href: '/case-studies/manyrequests',
    summary: '51 articles since 2024 that explain how agency owners can use the product, with examples from the published work and dated search results.',
    image: { src: '/images/case-studies/manyrequests/wrike-vs-clickup-product.png', alt: 'ManyRequests used inside a product comparison' },
  };
  const mylinks = {
    title: 'MyLinks',
    href: '/projects/mylinks',
    summary: 'I built MyLinks to help me find relevant pages on a client’s site without repeating the same searches for every article.',
    image: { src: 'https://res.cloudinary.com/cloud-blog-publisher/image/upload/v1772468764/mylinks_app_sitemap_tw3zld.png', alt: 'MyLinks site inventory' },
  };
  return (
    <div className="gutter mx-auto max-w-[1180px] cs-page">
      <header className="cs-index"><h1>What I’ve written and built</h1></header>
      <section className="cs-group" aria-labelledby="writing-h">
        <h2 id="writing-h">Content writing</h2>
        <ul className="cs-rows"><Row entry={writing} />{entries(['exceed-seo']).map((entry) => <Row key={entry.href} entry={entry} />)}</ul>
      </section>
      <section className="cs-group" aria-labelledby="teams-h">
        <h2 id="teams-h">AI workflows for marketing teams</h2>
        <ul className="cs-rows">{entries(['fanout-query-analysis-tool', 'ai-docs-watch', 'okf']).map((entry) => <Row key={entry.href} entry={entry} />)}</ul>
      </section>
      <section className="cs-group" aria-labelledby="learning-h">
        <h2 id="learning-h">Teaching and learning</h2>
        <ul className="cs-rows">{entries(['build-a-course-portal-around-the-instructors-workflow']).map((entry) => <Row key={entry.href} entry={entry} />)}</ul>
      </section>
      <section className="cs-group" aria-labelledby="own-h">
        <h2 id="own-h">Tools I built for my own work</h2>
        <ul className="cs-rows">{[...entries(['contentdb', 'aloud']), mylinks].map((entry) => <Row key={entry.href} entry={entry} />)}</ul>
      </section>
      <WorkWithMe heading="Have something in mind?" body="Have an idea you haven’t had time to build, or a process you’d like to automate? Tell me what the team does now and what you’d like the tool to handle." secondary={{ label: 'Tell me about it', href: '/contact' }} />
    </div>
  );
}
