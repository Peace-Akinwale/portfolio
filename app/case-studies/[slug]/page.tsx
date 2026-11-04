import { WorkWithMe } from '@/components/WorkWithMe';
import { ogImageFor } from '@/lib/og';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import '@/components/case-study/case-study.css';
import Image from 'next/image';
import { firstImage, getCaseStudy, listCaseStudies } from '@/lib/content/case-studies';
import { splitChapters } from '@/lib/content/markdown';
import { SITE_URL } from '@/lib/site';
import { JsonLdScript } from '@/components/JsonLdScript';
import { breadcrumbList, softwareApplicationJsonLd } from '@/lib/seo/jsonld';

// The tools a reader can open. Only these get SoftwareApplication markup; a private
// team tool is not something a searcher can use, so it gets the breadcrumb only.
const PUBLIC_TOOLS: Record<string, { url: string; category: string }> = {
  'ai-docs-watch': { url: 'https://docswatch.stevetoth.ai', category: 'BusinessApplication' },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return listCaseStudies().map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return {};
  return {
    title: cs.title,
    description: cs.blurb,
    alternates: { canonical: `${SITE_URL}/case-studies/${cs.slug}` },
    openGraph: {
      title: cs.title, description: cs.blurb, url: `${SITE_URL}/case-studies/${cs.slug}`, siteName: 'Peace Akinwale', type: 'article',
      images: [{ url: ogImageFor(`case-study-${cs.slug}`), width: 1200, height: 630, alt: cs.name }],
    },
    twitter: { card: 'summary_large_image', title: cs.title, description: cs.blurb, images: [ogImageFor(`case-study-${cs.slug}`)] },
  };
}

function Href({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  if (href.startsWith('/')) return <Link href={href} className={className}>{children}</Link>;
  return <a href={href} rel="noopener" target="_blank" className={className}>{children}</a>;
}

// A case study reads as a cover and a set of chapters: the cover holds the name,
// the one-line point, two facts and the first screenshot; the summary follows as
// a lede; each section of the draft becomes a chapter. No chapter numbers, no
// chapter index, no reading time, no "if you liked this one" (4 Nov 2026). The prose is Peace's.
export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();
  const all = listCaseStudies();
  const related = cs.related.map((r) => all.find((c) => c.slug === r)).filter((c): c is NonNullable<typeof c> => !!c);
  const next = related.length ? related : all.filter((c) => c.slug !== cs.slug).slice(0, 2);
  const { intro, chapters } = splitChapters(cs.html);
  const shot = firstImage(cs);
  // The cover preview links to the first screenshot in the study: the first
  // block (intro, then each chapter in order) that holds a figure gets the id.
  const blocks = [intro ?? '', ...chapters.map((c) => c.html)];
  const firstWithFigure = blocks.findIndex((html) => html.includes('<figure>'));
  const tagPreview = (html: string, i: number) => (i === firstWithFigure ? html.replace('<figure>', '<figure id="preview">') : html);
  const introHtml = intro ? tagPreview(intro, 0) : intro;
  const chapterHtml = chapters.map((c, i) => ({ ...c, html: tagPreview(c.html, i + 1) }));

  const publicTool = PUBLIC_TOOLS[cs.slug];
  const jsonLd = [
    breadcrumbList([
      { name: 'Case studies', url: '/case-studies' },
      { name: cs.name, url: `/case-studies/${cs.slug}` },
    ]),
    ...(publicTool ? [softwareApplicationJsonLd({ name: cs.name, description: cs.blurb, url: publicTool.url, applicationCategory: publicTool.category })] : []),
  ];

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <header className="cs-cover cs-page">
        <div className="gutter mx-auto max-w-[1180px]">
          <p className="cs-crumbs">
            <Link href="/case-studies">Case studies</Link>
            <span aria-hidden="true"> / </span>
            <span>{cs.name}</span>
          </p>
          <div className={shot ? 'cs-cover-grid' : undefined}>
            <div>
              <h1>{cs.name}</h1>
              <p className="cs-point">{cs.blurb}</p>
              {cs.published && <p className="cs-date"><time dateTime={cs.published}>{new Date(cs.published + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })}</time></p>}
              {cs.links.length > 0 && (
                <p className="cs-links">
                  {cs.links.map((l) => <Href key={l.href} href={l.href} className="button cs-button">{l.label}</Href>)}
                </p>
              )}
            </div>
            {shot && (
              <a href="#preview" className={shot.portrait ? 'cs-cover-shot is-portrait' : 'cs-cover-shot'} aria-label="Jump to the first screenshot">
                <Image src={shot.src} alt={shot.alt} fill priority sizes="(max-width: 900px) 100vw, 480px" />
              </a>
            )}
          </div>
        </div>
      </header>

      <div className="gutter mx-auto max-w-[1180px] cs-page">
        <p className="cs-lede">{cs.summary}</p>

        {introHtml && <div className="cs-chapter"><div className="prose" dangerouslySetInnerHTML={{ __html: introHtml }} /></div>}

        {chapterHtml.map((c) => (
          <section key={c.id} id={c.id} className="cs-chapter" aria-labelledby={`${c.id}-h`}>
            <div>
              <h2 id={`${c.id}-h`}>{c.title}</h2>
              <div className="prose" dangerouslySetInnerHTML={{ __html: c.html }} />
            </div>
          </section>
        ))}

        <p className="cs-next-line">
          Next: {next.slice(0, 1).map((c) => <Link key={c.slug} href={`/case-studies/${c.slug}`}>{c.name}</Link>)}
          <span aria-hidden="true"> · </span>
          <Link href="/case-studies">All case studies</Link>
        </p>
        {cs.kind === 'built' ? (
          <WorkWithMe
            heading="Want an AI workflow like this for your team?"
            body="Tell me about the work your team repeats every week. On a 30-minute call I’ll tell you whether an AI workflow would take it off their plate, and what building one would involve."
            secondary={{ label: 'How building with me works', href: '/services#building' }}
          />
        ) : (
          <WorkWithMe
            heading="Want articles like these for your product?"
            body="Tell me about the product and the readers you want to reach. On a 30-minute call I’ll say whether I’m the right writer for it."
            secondary={{ label: 'Writing prices and what you get', href: '/services#prices' }}
          />
        )}
      </div>
    </>
  );
}
