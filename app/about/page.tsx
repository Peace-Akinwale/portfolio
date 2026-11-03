import { withOg } from '@/lib/og';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { WorkWithMe } from '@/components/WorkWithMe';
import '@/components/article/article.css';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = withOg({
  title: 'About Peace Akinwale, B2B SaaS writer and builder of AI tools for content teams',
  description: 'Peace Akinwale. I write bottom-of-funnel content for B2B SaaS companies and agencies, and I build AI-assisted tools for content teams.',
  alternates: { canonical: `${SITE_URL}/about` },
}, { key: 'about', path: '/about', alt: 'About Peace Akinwale' });

export default function AboutPage() {

  return (
    <div className="article gutter">
      <header className="article-head flex max-w-[78ch] items-start gap-6 sm:gap-10">
        <div className="min-w-0 flex-1">
          <p className="kicker">Hi there</p>
          <h1>About</h1>
          <p className="standfirst">{"I'm Peace Akinwale. I write the articles buyers read when they're choosing a product, and I build AI-assisted tools for the work content teams repeat."}</p>
        </div>
        <figure className="m-0 w-[104px] shrink-0 sm:w-[168px]">
          <Image src="/images/peace-akinwale-about-wedding.jpg" alt="Peace Akinwale" width={900} height={1200} sizes="(max-width: 640px) 104px, 168px" className="rounded-[2px] border border-border" priority />
        </figure>
      </header>
      <div className="article-layout">
        <div>
          <div className="prose">
            <p>{"Before I write, I research the topic and explore the product so I can explain how someone would actually use it. When I build a tool, I use it on real tasks and keep fixing the parts that feel confusing or take more effort than they should."}</p>
            <h2>{"Writing that helps people understand your product"}</h2>
            <p>{"I write bottom-of-funnel content, such as product comparisons and buying guides. These are the pages someone reads when they already know they have a problem and are deciding which product to use."}</p>
            <p>{"An article should help them make that decision. What does the product do? How would they use it for their particular task? What does it cost, and what are its limitations? When would another option be the better choice?"}</p>
            <p>{"I spend time with the product so I can answer those questions. If I can get into the software, I try the features I cover and take screenshots or GIFs to show how they work. If I can’t try something myself, I check the docs and other sources. I don’t guess and leave the reader to find out I was wrong."}</p>
            <p>{"I've written about a range of software. Marketing technology, HR software, productivity tools, sales automation, analytics and software development. The subject changes, but the job stays similar. I learn the product until I can explain it without making the reader do all the research again."}</p>
            <p><Link href="/portfolio#writing">{"See my writing samples"}</Link></p>
            <h2>{"My research process"}</h2>
            <p>{"Much of the work happens before I write the first paragraph. Here's what it involves."}</p>
            <h3>{"Understand the search and the reader"}</h3>
            <p>{"I check Semrush and the search results to see what’s already been written and what someone searching the topic needs help with. I also read beyond the highest-ranking pages. A useful example or explanation can be sitting in an article that gets little attention."}</p>
            <p>{"I take notes on gaps in the information and the structure. If my research points in a different direction from the brief, I raise it so we can agree on the approach before I write."}</p>
            <h3>{"Find people with something useful to say"}</h3>
            <p>{"I look through LinkedIn and industry podcasts for relevant experience and expert insight. "}<a href="https://www.listennotes.com/">Listen Notes</a>{" helps me find podcast episodes, and I return to articles and discussions I've saved in my bookmarks."}</p>
            <p>{"If I can speak to an expert on the subject, I ask them about the questions my reading hasn’t answered. When I use a published quote, I credit the person and check the surrounding context so I don't change what they meant."}</p>
            <h3>{"Use the product and build the outline"}</h3>
            <p>{"I test the features relevant to the article and save screenshots where they help explain a step or capability. Then I combine that product research with my notes to build an outline around what the reader needs to understand."}</p>
            <p>{"I keep the sources available while writing so I can return to them and check that I haven't misinterpreted a statement or framework."}</p>
            <h3>{"Draft, then edit"}</h3>
            <p>{"I get the whole draft down before I polish any sentence. Then I work through the argument. I cut what doesn't belong and check what the evidence supports."}</p>
            <p>{"I fact-check claims and statistics, and I add internal links and source links where they help. Grammarly catches smaller errors, and I edit for meaning and flow myself. I add image alt text and give the piece some time before another read, because a gap is easier to spot when I come back to it."}</p>
            <h2>{"From writing to building"}</h2>
            <p>{"The tools came out of the writing. Every article meant finding old research and moving quotes between documents, and that was the first work I automated for myself. ContentDB started in March 2026 as my own research library."}</p>
            <p>{"I'd built an app before that. Garde turned recipe videos into text. It went live in November 2025, and I shut it down four months later. I wrote about what that taught me, and one habit stuck: a decisions file for every project, and nothing called done until the person it's for has used it on the live app."}</p>
            <p>{"By June 2026 a client had asked for an app their agency could use to follow SEO and AEO trends, and since then the work has been tools for content teams. A monitor for AI platform docs, a recorder for the searches behind AI answers, and a knowledge base a team can ask."}</p>
            <p>{"ContentDB helps writers use the expertise already sitting in a company's articles and research. It connects that material to an AI tool through MCP, so a writer can ask for relevant information instead of searching old studies and ebooks by hand."}</p>
            <p>{"AI Docs Watch checks API documentation for product changes across AI platforms. It keeps the before-and-after versions and a brief explaining each change, so readers can inspect the original material instead of relying on a summary alone."}</p>
            <p>{"Alongside my writing, I work with Steve Toth and Notebook Agency on content operations and AI-search projects. That work includes the fanout query analysis tool I built for running prompts at scale and examining the searches behind recorded AI answers."}</p>
            <p>{"Building these tools has changed how I think about the work around an article, from finding useful material to making it easier for someone else to use. I test what happens when a tool fails, not only whether it works in a demo."}</p>
            <p><Link href="/case-studies">{"See the tools I've built"}</Link></p>
            <h2>{"How I use AI"}</h2>
            <p>{"I decide what an article or a tool needs to do, and I direct AI through the research and the build. Then I check the result myself. For an article, that means reading the sources and checking that they support the claims."}</p>
            <p>{"For a tool, it means trying the tasks someone will use it for and checking what happens when a step fails. The person using it should know what went wrong and what to do next."}</p>
            <h2>{"What clients say"}</h2>
            <blockquote className="pull">{"“I love the level of specificity and how you research these tools down to the exact functions we want to cover.”"}</blockquote>
            <p className="pull-by">{"Lateef Maleek, Exceed SEO"}</p>
            <blockquote className="pull">{"“He took feedback really fast and always came back stronger, the kind of person who makes your work easier just by being on the team.”"}</blockquote>
            <p className="pull-by">{"Lily Ugbaja, Fractional Content Marketing, Spicy Margarita"}</p>
            <p><Link href="/testimonials">{"More nice things clients said"}</Link></p>
            <h2>{"A short introduction you can pass along"}</h2>
            <p>{"Peace Akinwale is a B2B SaaS writer and content operator. He writes bottom-of-funnel content for software companies and agencies, combining product research with clear explanations of what buyers can do with the software. He also builds AI-assisted tools for content research and production. He works with Steve Toth and Notebook Agency on content operations and AI-search projects."}</p>
            <p className="go"><a href="https://www.linkedin.com/in/peaceakinwale/" rel="noopener" target="_blank">LinkedIn</a> <a href="mailto:akindayopeaceakinwale@gmail.com">Email</a></p>
          </div>
          <WorkWithMe
            heading="Work with me"
            body="Need an article that explains your product to the people choosing it, or a tool for the work your team repeats every week? Tell me about it on a 30-minute call, and I’ll say whether I’m the right person for it."
            secondary={{ label: 'See my prices', href: '/services' }}
          />
        </div>
      </div>
    </div>
  );
}
