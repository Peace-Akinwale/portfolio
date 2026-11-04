import { withOg } from '@/lib/og';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import '@/components/case-study/case-study.css';
import { firstImage, listCaseStudies, type CaseStudy } from '@/lib/content/case-studies';
import { CASE_STUDY_LINES } from '@/lib/content/case-study-lines';
import { MANYREQUESTS_ARTICLE_COUNT, MANYREQUESTS_SINCE } from '@/lib/portfolio/manyrequests';
import { SITE_URL } from '@/lib/site';
import { WorkWithMe } from '@/components/WorkWithMe';

export const metadata: Metadata = withOg({
  title: 'Case studies, AI workflows for content and SEO teams',
  description:
    'AI workflows I built for content and SEO teams, and the decisions that shaped each one. Plus one long writing engagement. Each case study comes from the project’s own records.',
  alternates: { canonical: `${SITE_URL}/case-studies` },
}, { key: 'case-studies', path: '/case-studies', alt: 'Case studies by Peace Akinwale' });

// One row per case study, laid out like the blog index (Peace, 4 Nov 2026):
// the case study's own screenshot on the left, then the name, the problem and the
// decision. No status or meta lines (Peace, 4 Nov 2026).
function Row({ cs }: { cs: CaseStudy }) {
  const shot = firstImage(cs);
  const lines = CASE_STUDY_LINES[cs.slug];
  const href = `/case-studies/${cs.slug}`;
  return (
    <li className="cs-row">
      <Link href={href} className="cs-row-shot" tabIndex={-1} aria-hidden="true">
        {shot && <Image src={shot.src} alt="" fill sizes="(max-width: 700px) 100vw, 260px" loading="lazy" />}
      </Link>
      <div>
        <h3><Link href={href}>{cs.name}</Link></h3>
        {cs.published && <p className="cs-row-date"><time dateTime={cs.published}>{new Date(cs.published + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })}</time></p>}
        {lines ? (
          <>
            <p>{lines.problem}</p>
            <p>{lines.decision}</p>
          </>
        ) : (
          <p>{cs.blurb}</p>
        )}
      </div>
    </li>
  );
}

// Grouped by who the tool is for. Reach is a developer tool and sits in one line
// under the products rather than as a card (page plan, 4 Nov 2026).
const FOR_TEAMS = ['fanout-query-analysis-tool', 'ai-docs-watch', 'reading-app', 'okf', 'what-ai-search-apps-do-before-they-answer', 'quality-rater'];
const MY_OWN = ['contentdb', 'aloud'];

export default function CaseStudiesPage() {
  const studies = listCaseStudies();
  const bySlug = (slugs: string[]) => slugs.map((s) => studies.find((cs) => cs.slug === s)).filter((cs): cs is CaseStudy => !!cs);
  const forTeams = bySlug(FOR_TEAMS);
  const myOwn = bySlug(MY_OWN);
  const reach = studies.find((cs) => cs.slug === 'reach');

  return (
    <div className="gutter mx-auto max-w-[1180px] cs-page">
      <header className="cs-index">
        <h1>Case studies</h1>
      </header>

      <section className="cs-group" aria-labelledby="teams-h">
        <h2 id="teams-h">AI workflows for content and SEO teams</h2>
        <ul className="cs-rows">
          {forTeams.map((cs) => <Row key={cs.slug} cs={cs} />)}
        </ul>
      </section>

      <section className="cs-group" aria-labelledby="own-h">
        <h2 id="own-h">Products of my own</h2>
        <ul className="cs-rows">
          {myOwn.map((cs) => <Row key={cs.slug} cs={cs} />)}
        </ul>
        {reach && (
          <p className="cs-also">
            Also built: <Link href={`/case-studies/${reach.slug}`}>{reach.name}</Link>, for when an AI coding session needs my Mac’s screen. It hands the step to a session on the right Mac and sends the result back. Passwords stay with me.
          </p>
        )}
      </section>

      <section className="cs-group" aria-labelledby="wrote-h">
        <h2 id="wrote-h">Writing</h2>
        <p>
          <Link href="/case-studies/manyrequests">{MANYREQUESTS_ARTICLE_COUNT} product-led articles for ManyRequests since {MANYREQUESTS_SINCE}</Link>.
        </p>
      </section>
      <WorkWithMe
        heading="Want something like this for your team?"
        body="Tell me about the work your team repeats every week, or the articles you need. On a 30-minute call I’ll say whether an AI workflow or an article would help."
        secondary={{ label: 'How building with me works', href: '/services#building' }}
      />
    </div>
  );
}
