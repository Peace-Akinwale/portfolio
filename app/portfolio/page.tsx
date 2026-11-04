import { WorkWithMe } from '@/components/WorkWithMe';
import { withOg } from '@/lib/og';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import '@/components/record/record.css';
import { getStaticPage } from '@/lib/hashnode/client';
import { parsePortfolioHtml } from '@/lib/hashnode/parsePortfolio';
import { FEATURED_MANYREQUESTS_ARTICLES, MANYREQUESTS_ARTICLE_COUNT, MANYREQUESTS_SINCE, withCurrentManyRequestsSamples } from '@/lib/portfolio/manyrequests';
import { WritingSamples } from '@/components/record/WritingSamples';
import { SITE_URL } from '@/lib/site';
import { INVITEDESK_SECTION, LINEUPR_SECTION } from '@/lib/portfolio/exceed';

export const revalidate = 300;

export const metadata: Metadata = withOg({
  title: 'Writing samples by client',
  description:
    'Bottom-of-funnel articles for B2B SaaS companies and agencies, listed by client, with what their editors said about the drafts.',
  alternates: { canonical: `${SITE_URL}/portfolio` },
}, { key: 'portfolio', path: '/portfolio', alt: 'Writing samples by Peace Akinwale' });

// 4 Nov 2026: the writing page leads with proof and then every sample by client.
// The dated record and its month rail are gone (page plan); the Marker.io page
// is folded in here and /b2b-content-for-marker.io redirects to it.
const MARKERIO_SECTION = {
  heading: 'Ghostwritten for Marker.io',
  clientName: 'Marker.io',
  introHtml: '<p>QA and software testing guides for a visual bug reporting tool. Their head of marketing wrote that they never needed more than one round of feedback per article.</p>',
  projects: [
    { title: 'What is Regression Testing? A Practical Guide', link: 'https://marker.io/blog/regression-testing' },
    { title: '7 Best Regression Testing Tools in 2025', link: 'https://marker.io/blog/regression-testing-tools' },
    { title: 'What is Tree Testing? A Practical Guide', link: 'https://marker.io/blog/tree-testing' },
    { title: 'What is Black Box Testing? A Practical Guide', link: 'https://marker.io/blog/black-box-testing' },
    { title: 'A Practical Guide to Website QA Testing', link: 'https://marker.io/blog/website-qa-testing' },
    { title: 'How To Write Test Cases: A Step-By-Step Guide', link: 'https://marker.io/blog/how-to-write-test-cases' },
    { title: 'Operational Acceptance Testing: A Quick Overview', link: 'https://marker.io/blog/operational-acceptance-testing' },
  ],
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
  const samples = (await loadSamples()) ?? { sections: [LINEUPR_SECTION, INVITEDESK_SECTION, MARKERIO_SECTION, JABRA_SECTION] };

  return (
    <div className="gutter mx-auto max-w-[1180px]">
      <header className="writing-head">
        <h1>Writing</h1>
        <p className="lede">Comparisons, alternatives pages and buying guides for B2B SaaS companies and the agencies that serve them. I research every article from the product and the buyer’s own words, and check it against its sources before you see it.</p>
      </header>

      <section className="writing-proof" aria-label="Evidence">
        <figure>
          <Image src="/images/home/serp-design-annotation-results.png" width={685} height={430} sizes="(max-width: 800px) 100vw, 640px" alt="Google results for “design annotation tools” in April 2026, with the ManyRequests article in third place, marked with an arrow" priority />
          <figcaption>
            <Link href="/case-studies/manyrequests">The ManyRequests case study</Link>
          </figcaption>
        </figure>
        <figure className="narrow">
          <Image src="/images/home/editor-comment-jabra.png" width={335} height={469} sizes="300px" alt="Google Docs comment from Melissa Malec, 29 May 2025: “you had me hooked from start to finish! It was a really well researched, well structured, helpful piece of content with appropriate product placements. And that makes my heart happy.”" />
          <figcaption>Melissa Malec, content lead at Jabra.</figcaption>
        </figure>
      </section>

      <WritingSamples parsed={samples} />

      <section className="border-t border-border pt-10" aria-label="More">
        <p className="go">
          <Link href="/testimonials">What clients say</Link>
          <Link href="/how-to-optimize-for-aeo">How I approach AEO</Link>
        </p>
      </section>
      <WorkWithMe
        heading="Need articles like these?"
        body="Tell me about the product and the readers you want to reach. On a 30-minute call I’ll say whether I’m the right writer for it."
        secondary={{ label: 'See my prices', href: '/services' }}
      />
    </div>
  );
}
