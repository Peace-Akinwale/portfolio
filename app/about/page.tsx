import { withOg } from '@/lib/og';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { WorkWithMe } from '@/components/WorkWithMe';
import '@/components/article/article.css';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = withOg({
  title: 'About, B2B SaaS writer and AI workflow builder',
  description: 'Peace Akinwale writes bottom-of-funnel articles for B2B SaaS companies and agencies, and builds AI workflows for content and SEO teams.',
  alternates: { canonical: `${SITE_URL}/about` },
}, { key: 'about', path: '/about', alt: 'About Peace Akinwale' });

// Rebuilt 4 Nov 2026 around the four things the site has to show. Agency and
// client names stay off this page (decisions.md, 26 Oct and 4 Nov); the work
// is named on the case studies, where the reader can check it.
export default function AboutPage() {
  return (
    <div className="article gutter">
      <header className="article-head flex max-w-[78ch] items-start gap-6 sm:gap-10">
        <div className="min-w-0 flex-1">
          <h1>About Peace Akinwale</h1>
          <p className="standfirst">{'If your buyers are comparing tools before they talk to sales, you need articles that explain your product the way they’d use it. If your content team repeats the same research every week, you may need an AI workflow. I do both.'}</p>
        </div>
        <figure className="m-0 w-[104px] shrink-0 sm:w-[168px]">
          <Image src="/images/peace-akinwale-about-wedding.jpg" alt="Peace Akinwale" width={900} height={1200} sizes="(max-width: 640px) 104px, 168px" className="rounded-[2px] border border-border" priority />
        </figure>
      </header>
      <div className="article-layout">
        <div>
          <div className="prose">
            <h2>{'I write the articles buyers read before they choose'}</h2>
            <p>{'Product comparisons, alternatives pages and buying guides, for B2B SaaS companies and the agencies that serve them. These are the pages someone reads when they already know they have a problem and are deciding which product to use.'}</p>
            <p>{'I get into the product and try the features I write about, and I take screenshots where they help. When I can’t try something, I check the docs and say so. I’ve written 51 articles for ManyRequests since 2024. In April 2026 one of them was the third organic result on Google for “design annotation tools”.'}</p>
            <p><Link href="/portfolio">{'Writing samples by client'}</Link></p>

            <h2>{'I build AI workflows for content and SEO teams'}</h2>
            <p>{'Since June 2026 I’ve built AI workflows that a team at an SEO agency uses. The agency also works on AEO, which means getting brands cited in AI answers. A reading app that turns the founder’s starred posts into newsletter notes. A Chrome extension that records the searches behind AI answers. A public monitor of AI platforms’ documentation. A knowledge base of the founder’s thinking that the team can ask.'}</p>
            <p>{'I write the requirements and decide the architecture. I set the security rules, then direct coding agents through the build.'}</p>
            <p><Link href="/case-studies">{'The case studies'}</Link></p>

            <h2>{'I use AI as a tool, and I own the check'}</h2>
            <p>{'The part I own is whether the result is true. I direct AI through the research and the typing in my builds, then check what comes back. For an article, that means reading the sources and making sure they back the claims. For a tool, it means using it for the job it’s for before anyone else does.'}</p>
            <p>{'When the agency’s founder asked about Anthropic’s usage policy rewrite, I found that AI Docs Watch had reported on the wrong part. The report step had seen only 24 of 152 changed passages, so every report now lists the new headings first.'}</p>
            <p>{'A teammate’s parser counted 6 citations on an answer that carried 10. I found the gap by reading the raw recording.'}</p>

            <h2>{'How I decide'}</h2>
            <p>{'I ask three questions before anything gets made. Is this true? What’s worth making? What does done mean? Some tasks don’t need software, and I say so. Done is when the person it’s for can use it without me, on the live app, not when a test passes.'}</p>
            <p>{'Four months after I started Garde, I stopped spending on it. Garde turned recipe videos into text, and I checked its numbers every day from December 2025. The only users were my team, my wife and a few early fans. Faster, free alternatives already existed, so I moved it to the free tier rather than keep spending on hope.'}</p>
            <p><Link href="/what-i-learned-vibe-coding-my-first-app-shutting-it-down">{'What I learned building Garde, and shutting it down'}</Link></p>

            <h2>{'How an article gets made'}</h2>
            <p>{'I start with the search results and read beyond the top pages, because a useful example often sits in an article nobody links to. I look for people who’ve said something worth quoting, on LinkedIn and in podcasts, and I check the context around every quote so I don’t change what they meant.'}</p>
            <p>{'Then I use the product and build the outline around what the reader needs to understand. I draft the whole piece before I polish a sentence, then fact-check every claim and number against its source. If my research points somewhere other than the brief, I raise it before I write.'}</p>

            <h2>{'What clients say'}</h2>
            <blockquote className="pull">{'“I love the level of specificity and how you research these tools down to the exact functions we want to cover.”'}</blockquote>
            <p className="pull-by">{'Lateef Maleek, Exceed SEO'}</p>
            <p><Link href="/testimonials">{'All the recommendations'}</Link></p>

            <h2>{'A short introduction you can pass along'}</h2>
            <p>{'Peace Akinwale writes bottom-of-funnel content for B2B SaaS companies and agencies, combining product research with clear explanations of what buyers can do with the software. Peace also builds AI workflows for content and SEO teams, including a recorder for the searches behind AI answers and a public monitor of AI platforms’ documentation.'}</p>
          </div>
          <WorkWithMe
            heading="Work with me"
            body="Need an article that explains your product to the people choosing it, or an AI workflow for the work your team repeats every week? Tell me about it on a 30-minute call, and I’ll say whether I’m the right person for it."
            secondary={{ label: 'See my prices', href: '/services' }}
          />
        </div>
      </div>
    </div>
  );
}
