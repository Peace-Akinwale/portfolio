import { withOg } from '@/lib/og';
import Link from 'next/link';
import type { Metadata } from 'next';
import '@/components/case-study/case-study.css';
import { listCaseStudies } from '@/lib/content/case-studies';
import { dayLabel } from '@/lib/content/dates';
import { MANYREQUESTS_ARTICLE_COUNT, MANYREQUESTS_SINCE } from '@/lib/portfolio/manyrequests';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = withOg({
  title: 'Things I built',
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
        <h1>Things I’ve <span className="hl">built</span>, and how they came together.</h1>
        <p className="lead">Each one comes from the project’s own notes. If a tool is private, I’ve blurred what needs blurring. If it isn’t finished, I say so.</p>
      </header>

      <section className="cs-group" aria-labelledby="built-h">
        <h2 id="built-h">The tools</h2>
        <p>Newest first. Tap one to read the whole story.</p>
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
        <h2 id="wrote-h">And one long writing gig</h2>
        <p>Written up in full. The individual articles live on <Link href="/portfolio#writing" className="underline underline-offset-4">my work page</Link>.</p>
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
        <h2>Two builds I wrote up as articles instead</h2>
        <p>More about what I learned than how it works.</p>
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
