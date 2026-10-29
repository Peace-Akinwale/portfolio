import { withOg } from '@/lib/og';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import '@/components/case-study/case-study.css';
import { firstImage, listCaseStudies } from '@/lib/content/case-studies';
import { getLocalArticle } from '@/lib/content/articles';
import { dayLabel } from '@/lib/content/dates';
import { KIND_LABEL } from '@/lib/content/record';
import { MANYREQUESTS_ARTICLE_COUNT, MANYREQUESTS_SINCE } from '@/lib/portfolio/manyrequests';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = withOg({
  title: 'Projects',
  description:
    'The decisions that mattered in each project, and what someone can do with the result. Tools for content teams, and one long writing engagement.',
  alternates: { canonical: `${SITE_URL}/case-studies` },
}, { key: 'case-studies', path: '/case-studies', alt: 'Case studies by Peace Akinwale' });

// One row of the dated list. The thumbnail slot is left out when there is no shot.
function Row({ href, date, dateLabel, kind, context, name, line, shot }: {
  href: string;
  date?: string;
  dateLabel?: string;
  kind: 'built' | 'wrote';
  context?: string;
  name: string;
  line: string;
  shot?: { src: string; alt: string } | null;
}) {
  return (
    <li className={shot ? 'cs-row has-shot' : 'cs-row'} data-kind={kind}>
      <div className="cs-row-text">
        <p className="meta">
          {date && <time dateTime={date}>{dateLabel ?? date}</time>}
          <span className="kind">{KIND_LABEL[kind]}</span>
          {context && <span>{context}</span>}
        </p>
        <h3><Link href={href}>{name}</Link></h3>
        <p className="line">{line}</p>
      </div>
      {shot && (
        <Link href={href} className="cs-shot" tabIndex={-1} aria-hidden="true">
          <Image src={shot.src} alt={shot.alt} fill sizes="(max-width: 640px) 100vw, 220px" loading="lazy" />
        </Link>
      )}
    </li>
  );
}

export default function CaseStudiesPage() {
  const studies = listCaseStudies();
  const built = studies.filter((s) => s.kind === 'built');
  const wrote = studies.filter((s) => s.kind === 'wrote');
  const articleDate = (slug: string) => getLocalArticle(slug)?.publishedAt.slice(0, 10);
  const articles = [
    { slug: 'the-success-message-was-the-bug', name: 'The success message was a bug', line: 'Five lessons from building an app an agency uses to follow SEO and AEO trends.' },
    { slug: 'build-a-course-portal-around-the-instructors-workflow', name: 'Build a course portal around the instructor’s workflow', line: 'Which parts of an existing process the software should leave alone.' },
  ].map((a) => ({ ...a, date: articleDate(a.slug) }));

  return (
    <div className="gutter mx-auto max-w-[1180px] cs-page">
      <header className="cs-index">
        <h1>Things I’ve built, and how they came together.</h1>
        <p className="lead">Each one comes from the project’s own notes. If a tool is private, I’ve blurred what needs blurring. If it isn’t finished, I say so.</p>
      </header>

      <section className="cs-group" aria-labelledby="built-h">
        <h2 id="built-h">The tools</h2>
        <p>Newest first. Tap one to read the whole story.</p>
        <ul className="cs-list">
          {built.map((cs) => (
            <Row key={cs.slug} href={`/case-studies/${cs.slug}`} date={cs.date} dateLabel={dayLabel(cs.date)} kind="built" context={cs.status} name={cs.name} line={cs.blurb} shot={firstImage(cs)} />
          ))}
        </ul>
      </section>

      <section className="cs-group" aria-labelledby="wrote-h">
        <h2 id="wrote-h">And one long writing gig</h2>
        <p>Written up in full. The individual articles live on <Link href="/portfolio#writing" className="underline underline-offset-4">my work page</Link>.</p>
        <ul className="cs-list">
          <Row href="/case-studies/manyrequests" date={MANYREQUESTS_SINCE} dateLabel={`since ${MANYREQUESTS_SINCE}`} kind="wrote" context="ManyRequests, B2B SaaS client portal software" name={`${MANYREQUESTS_ARTICLE_COUNT} product-led articles for ManyRequests`} line="Articles where the product shows up inside the piece, and what they did in search." shot={{ src: '/images/case-studies/manyrequests/manyrequests-editorial-scoring-sheet-preview.png', alt: 'The keyword sheet for ManyRequests, with a business potential score per topic' }} />
          {wrote.map((cs) => (
            <Row key={cs.slug} href={`/case-studies/${cs.slug}`} date={cs.date} dateLabel={dayLabel(cs.date)} kind="wrote" context={cs.status} name={cs.name} line={cs.blurb} shot={firstImage(cs)} />
          ))}
        </ul>
      </section>

      <section className="cs-group" aria-label="Articles about building">
        <h2>Two builds I wrote up as articles instead</h2>
        <p>More about what I learned than how it works.</p>
        <ul className="cs-list">
          {articles.map((a) => (
            <Row key={a.slug} href={`/${a.slug}`} date={a.date} dateLabel={a.date ? dayLabel(a.date) : undefined} kind="wrote" context="Article" name={a.name} line={a.line} />
          ))}
        </ul>
      </section>
    </div>
  );
}
