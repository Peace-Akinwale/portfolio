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
import descriptions from '@/lib/content/page-descriptions.json';
import { SITE_URL } from '@/lib/site';
import { INVITEDESK_SECTION, LINEUPR_SECTION } from '@/lib/portfolio/exceed';

export const revalidate = 300;

export const metadata: Metadata = withOg({
  title: 'B2B SaaS content writing portfolio · Peace Akinwale',
  description: descriptions.Writing,
  alternates: { canonical: `${SITE_URL}/writing` },
}, { key: 'portfolio', path: '/writing', alt: 'Writing samples by Peace Akinwale' });

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

  const descriptionsByClient = {
  "ManyRequests": "Comparisons and guides that show agency owners how to manage client requests, approvals, retainers and billing. The product appears where it helps explain how to do the work.",
  "LineUpr, through Exceed SEO": "Articles that help event organisers choose an app for their event, from comparing pricing to understanding what will encourage attendees to use it.",
  "InviteDesk, through Exceed SEO": "Software comparisons and practical guides for teams managing B2B events, guest relationships and the follow-up that turns an event conversation into a sales opportunity.",
  "Marker.io": "Ghostwritten software-testing and website-QA guides that explain how to perform the work, report problems and give developers the context they need to fix them.",
  "Jabra, through Spicy Margarita": "Articles that explain how meeting-room design and communication tools affect the people trying to hear, speak and work together in a meeting.",
  "HigherVisibility": "Ghostwritten articles that explain SEO, content strategy and lead generation through decisions a business needs to make.",
  "Pangea.ai": "Articles that help readers understand software-development work and compare the tools available to them.",
  "Earlier essays and journalism": "Some of my writing before I specialised in B2B SaaS."
};
  samples.sections = samples.sections.map((section) => {
    const key = Object.keys(descriptionsByClient).find((name) => {
      const client = name.split(',')[0];
      return (section.clientName ?? section.heading).toLowerCase().includes(client.toLowerCase());
    }) as keyof typeof descriptionsByClient | undefined;
    return key ? { ...section, heading: key, introHtml: '<p>' + descriptionsByClient[key] + '</p>' } : section;
  });

  return (
    <div className="gutter mx-auto max-w-[1180px]">
      <header className="writing-head">
        <h1>Content that helps your prospects understand the product</h1>
        <p className="lede">I write B2B SaaS content for companies and agencies, including bottom-of-funnel (BOFU) comparisons and alternatives pages for readers choosing a product.</p>
        {/* The intro split by job: how, what the reader gets, what AI tools get (approved 8 Nov 2026). */}
        <dl className="writing-how">
          <div><dt>How I write it</dt><dd>I research the job your prospect needs to do, then explain the capabilities, examples and limitations that matter to that decision.</dd></div>
          <div><dt>What your reader gets</dt><dd>Enough context to understand why they might need your product.</dd></div>
          <div><dt>What AI tools get</dt><dd>Clear context to connect your brand with those use cases.</dd></div>
        </dl>
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

      <section className="writing-more border-t border-border pt-10" aria-label="More">
        <p className="go">
          <Link href="/testimonials">What clients say</Link>
          <Link href="/blog/how-to-optimize-for-aeo">How I approach AEO</Link>
        </p>
      </section>
      <WorkWithMe
        heading="Have an article in mind?"
        body="Send me the topic and a little about your product. I can help you find the use cases and context that will make the piece useful to the people you want to reach."
        secondary={{ label: 'See services and prices', href: '/services' }}
      />
    </div>
  );
}
