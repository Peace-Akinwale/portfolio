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
    description: cs.summary,
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
// the one-line point, the facts and a chapter index; the summary follows in
// full; each section of the draft becomes a chapter. No chapter numbers and no
// green (Peace removed both, 2026-10-25). The prose is Peace's.
export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();
  const all = listCaseStudies();
  const related = cs.related.map((r) => all.find((c) => c.slug === r)).filter((c): c is NonNullable<typeof c> => !!c);
  const next = related.length ? related : all.filter((c) => c.slug !== cs.slug).slice(0, 2);
  const { intro, chapters } = splitChapters(cs.html);
  const shot = firstImage(cs);
  // The cover preview links to the first screenshot in the study.
  let previewSet = false;
  const withPreviewId = (html: string) => {
    if (previewSet || !html.includes('<figure>')) return html;
    previewSet = true;
    return html.replace('<figure>', '<figure id="preview">');
  };
  const introHtml = intro ? withPreviewId(intro) : intro;
  const chapterHtml = chapters.map((c) => ({ ...c, html: withPreviewId(c.html) }));

  return (
    <>
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
              <dl className="cs-strip">
                <div><dt>Who uses it</dt><dd>{cs.status}</dd></div>
                <div><dt>Reading time</dt><dd>about {cs.readingMinutes} min</dd></div>
              </dl>
              {cs.links.length > 0 && (
                <p className="cs-links">
                  {cs.links.map((l) => <Href key={l.href} href={l.href} className="button cs-button">{l.label}</Href>)}
                </p>
              )}
            </div>
            {shot && (
              <a href="#preview" className={shot.portrait ? 'cs-cover-shot is-portrait' : 'cs-cover-shot'} aria-label="Jump to the first screenshot">
                <Image src={shot.src} alt={shot.alt} fill sizes="(max-width: 900px) 100vw, 480px" />
              </a>
            )}
          </div>
          {chapters.length > 1 && (
            <nav className="cs-index-nav" aria-label="In this case study">
              <p>What’s in here</p>
              <ul>
                {chapters.map((c) => (
                  <li key={c.id}><a href={`#${c.id}`}>{c.title}</a></li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </header>

      <div className="gutter mx-auto max-w-[1180px] cs-page">
        <section className="cs-short" aria-label="In short">
          <p className="cs-short-label">The short version</p>
          <p className="cs-short-text">{cs.summary}</p>
        </section>

        {introHtml && <div className="cs-chapter"><div className="prose" dangerouslySetInnerHTML={{ __html: introHtml }} /></div>}

        {chapterHtml.map((c) => (
          <section key={c.id} id={c.id} className="cs-chapter" aria-labelledby={`${c.id}-h`}>
            <div>
              <h2 id={`${c.id}-h`}>{c.title}</h2>
              <div className="prose" dangerouslySetInnerHTML={{ __html: c.html }} />
            </div>
          </section>
        ))}

        <section className="cs-next" aria-labelledby="next-h">
          <h2 id="next-h">If you liked this one</h2>
          <ul>
            {next.map((c) => (
              <li key={c.slug}>
                <Link href={`/case-studies/${c.slug}`}>
                  <b>{c.name}</b>
                  <span>{c.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        {cs.kind === 'built' ? (
          <WorkWithMe
            heading="Want a tool like this for your team?"
            body="Tell me about the work your team repeats every week. On a 30-minute call I’ll tell you whether a tool would take it off their plate, and what building it would involve."
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
