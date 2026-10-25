import { withOg } from '@/lib/og';
import Link from 'next/link';
import type { Metadata } from 'next';
import '@/components/case-study/case-study.css';
import { listCaseStudies } from '@/lib/content/case-studies';
import { dayLabel } from '@/lib/content/dates';
import { MANYREQUESTS_ARTICLE_COUNT, MANYREQUESTS_SINCE } from '@/lib/portfolio/manyrequests';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = withOg({
  title: 'Case studies',
  description:
    'What I was asked to build or write, the decisions that mattered, and what someone can do with the result. Tools for content teams, and one long writing engagement.',
  alternates: { canonical: `${SITE_URL}/case-studies` },
}, { key: 'case-studies', path: '/case-studies', alt: 'Case studies by Peace Akinwale' });

export default function CaseStudiesPage() {
  const studies = listCaseStudies();
  const built = studies.filter((s) => s.kind === 'built');
  const wrote = studies.filter((s) => s.kind === 'wrote');

  return (
    <div className="gutter mx-auto max-w-[1180px]">
      <header className="cs-index">
        <h1>Case studies: the problem, the decisions, what you can do with the result.</h1>
        <p className="lead">Each one is written from the project’s own record. Where a tool is private, the screens are anonymised; where it isn’t finished, the page says so.</p>
      </header>

      <section className="cs-group" aria-labelledby="built-h">
        <h2 id="built-h">Tools I built</h2>
        <p>Newest first. Each card opens the full case study.</p>
        <ul className="cs-cards">
          {built.map((cs) => (
            <li key={cs.slug} className="cs-card">
              <p className="meta"><time dateTime={cs.date}>{dayLabel(cs.date)}</time> · {cs.status}</p>
              <h3><Link href={`/case-studies/${cs.slug}`}>{cs.name}</Link></h3>
              <p>{cs.blurb}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="cs-group" aria-labelledby="wrote-h">
        <h2 id="wrote-h">Writing</h2>
        <p>One long engagement, written up in full. The individual samples are on <Link href="/portfolio#writing" className="underline underline-offset-4">the work page</Link>.</p>
        <ul className="cs-cards">
          <li className="cs-card">
            <p className="meta">ManyRequests · B2B SaaS, client portal software · since {MANYREQUESTS_SINCE}</p>
            <h3><Link href="/case-studies/manyrequests">{MANYREQUESTS_ARTICLE_COUNT} product-led articles for ManyRequests</Link></h3>
            <p>Articles where the product shows up inside the piece, and what they did in search.</p>
          </li>
          {wrote.map((cs) => (
            <li key={cs.slug} className="cs-card">
              <p className="meta"><time dateTime={cs.date}>{dayLabel(cs.date)}</time> · {cs.status}</p>
              <h3><Link href={`/case-studies/${cs.slug}`}>{cs.name}</Link></h3>
              <p>{cs.blurb}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="cs-group" aria-label="Articles about building">
        <h2>Two of the builds are articles instead</h2>
        <p>Lessons rather than a walkthrough.</p>
        <ul className="cs-cards">
          <li className="cs-card">
            <h3><Link href="/the-success-message-was-the-bug">The success message was the bug</Link></h3>
            <p>Five lessons from building an AI-assisted reading tool.</p>
          </li>
          <li className="cs-card">
            <h3><Link href="/build-a-course-portal-around-the-instructors-workflow">Build a course portal around the instructor’s workflow</Link></h3>
            <p>Which parts of an existing process the software should leave alone.</p>
          </li>
        </ul>
      </section>
    </div>
  );
}
