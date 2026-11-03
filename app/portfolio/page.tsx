import { WorkWithMe } from '@/components/WorkWithMe';
import { withOg } from '@/lib/og';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import '@/components/record/record.css';
import { getStaticPage } from '@/lib/hashnode/client';
import { parsePortfolioHtml } from '@/lib/hashnode/parsePortfolio';
import { FEATURED_MANYREQUESTS_ARTICLES, withCurrentManyRequestsSamples } from '@/lib/portfolio/manyrequests';
import { buildRecord, months } from '@/lib/content/record';
import { Entries } from '@/components/record/Record';
import { RecordNow, MonthRail, OpenDetailsFromHash } from '@/components/record/RecordControls';
import { WritingSamples } from '@/components/record/WritingSamples';
import { SITE_URL } from '@/lib/site';
import { INVITEDESK_SECTION, LINEUPR_SECTION } from '@/lib/portfolio/exceed';

export const revalidate = 300;

export const metadata: Metadata = withOg({
  title: 'Writing samples by client',
  description:
    'A dated record of the tools I built and the articles I wrote, newest first. Each one has its evidence beside it, and every writing sample is listed by client.',
  alternates: { canonical: `${SITE_URL}/portfolio` },
}, { key: 'portfolio', path: '/portfolio', alt: 'The record of what I built and wrote' });

const MARKERIO_SECTION = {
  heading: 'Ghostwritten for Marker.io',
  clientName: 'Marker.io',
  projects: [
    { title: 'What is Regression Testing? A Practical Guide', link: 'https://marker.io/blog/regression-testing' },
    { title: 'How To Write Test Cases: A Step-By-Step Guide', link: 'https://marker.io/blog/how-to-write-test-cases' },
    { title: 'What is Black Box Testing? A Practical Guide', link: 'https://marker.io/blog/black-box-testing' },
  ],
  readMoreLink: '/b2b-content-for-marker.io',
};

const JABRA_SECTION = {
  heading: 'Ghostwritten for Jabra',
  clientName: 'Jabra',
  projects: [
    { title: '7 Modern Meeting Room Designs & What You Need to Nail Them', link: 'https://www.jabra.com/discover/modern-meeting-room' },
    { title: "How to Increase Employee Engagement (By Fixing What's Broken)", link: 'https://www.jabra.com/discover/increase-employee-engagement' },
  ],
};

async function loadSamples() {
  try {
    const page = await getStaticPage('portfolio');
    if (!page?.content?.html) return null;
    const parsed = withCurrentManyRequestsSamples(parsePortfolioHtml(page.content.html), FEATURED_MANYREQUESTS_ARTICLES);
    if (parsed.sections.length === 0) return null;
    // ManyRequests first (from WordPress), then the agency ghostwriting, then the rest.
    parsed.sections.splice(1, 0, LINEUPR_SECTION, INVITEDESK_SECTION, MARKERIO_SECTION, JABRA_SECTION);
    return parsed;
  } catch {
    return null;
  }
}

export default async function PortfolioPage() {
  // The writing record: articles and what clients said. Tools and build
  // decisions live on /case-studies (decisions.md, 3 Nov 2026).
  const entries = buildRecord().filter((e) => e.kind === 'wrote' || e.kind === 'said');
  const monthList = months(entries);
  const samples = (await loadSamples()) ?? { sections: [LINEUPR_SECTION, INVITEDESK_SECTION, MARKERIO_SECTION, JABRA_SECTION] };

  return (
    <>
      <div className="gutter mx-auto max-w-[1180px]">
        <section className="record-open" aria-labelledby="record-h">
          <div>
            <h1 id="record-h">Writing</h1>
            <p className="who">
              Bottom-of-funnel articles for B2B SaaS companies and agencies, newest first, with the evidence for each. The full list of samples, by client, is <a href="#writing">below</a>. The tools I build are under <Link href="/case-studies">case studies</Link>.
            </p>
          </div>
          <figure>
            <Image src="/images/home/peace-square.jpg" width={900} height={900} alt="Peace Akinwale leaning on a hallway wall with arms folded and smiling, in a navy pinstripe suit and red tie." sizes="220px" priority />
          </figure>
        </section>
      </div>

      <div className="record-bar" id="record">
        <div className="gutter mx-auto max-w-[1180px]">
          <div className="inner">
            <p className="record-now"><RecordNow initialMonth={monthList[0] ?? '2026-10'} /></p>
          </div>
        </div>
      </div>

      <div className="gutter mx-auto max-w-[1180px]">
        <div className="record">
          <MonthRail months={monthList} />
          <Entries entries={entries} />
        </div>
        <OpenDetailsFromHash />

        <WritingSamples parsed={samples} />

        <section className="border-t border-border pt-12" aria-label="More">
          <p className="go">
            <Link href="/case-studies">The case studies</Link>
          </p>
        </section>
        <WorkWithMe
          heading="Want to work together?"
          body="I write BOFU articles for B2B SaaS companies and agencies, and I build tools for content teams. Book a call and tell me what you need."
          secondary={{ label: 'See my prices', href: '/services' }}
        />
      </div>
    </>
  );
}
