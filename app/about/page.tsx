import { withOg } from '@/lib/og';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import '@/components/article/article.css';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = withOg({
  title: 'About',
  description: 'Peace Akinwale. I write bottom-of-funnel content for B2B SaaS companies and agencies, and I build AI-assisted tools for content teams.',
  alternates: { canonical: `${SITE_URL}/about` },
}, { key: 'about', path: '/about', alt: 'About Peace Akinwale' });

export default function AboutPage() {

  return (
    <div className="article gutter">
      <header className="article-head">
        <p className="kicker">About</p>
        <h1>About</h1>
        <p className="standfirst">{"I'm Peace Akinwale. I write BOFU content for B2B SaaS companies and agencies, and I build AI-assisted tools for content teams."}</p>
      </header>
      <div className="article-layout">
        <div>
          <div className="prose">
            <p>{"I like to understand what I’m working on before I start writing or building. If I'm writing about software, I want to know what someone can actually do with it, where it falls short, and what they need to know before choosing it. If I'm building a tool, I want to understand the task people keep doing and whether the tool would make it easier."}</p>
            <p>{"That means spending time with the product, reading beyond the pages already ranking, and checking the work before someone else has to rely on it."}</p>
            <h2>{"Writing that helps people understand your product"}</h2>
            <p>{"I write product comparisons, alternatives articles, buying guides and other bottom-of-funnel content. These are often the pages someone reads when they already know they have a problem and are deciding which product to use."}</p>
            <p>{"An article should help them make that decision. What does the product do? How would they use it for their particular task? What does it cost, what are the limitations, and what would make another option more appropriate?"}</p>
            <p>{"I spend time with the product so I can answer those questions properly. If I can get into the software, I try the features I’m writing about and take screenshots or GIFs to show how they work. If I can’t try something myself, I check the docs and other sources. I don’t want to guess and leave the reader to find out I was wrong."}</p>
            <p>{"I've written about marketing technology, HR software, productivity tools, sales automation, analytics and software development. The subject changes, but the job is similar: understand the product well enough to explain it without making the reader do all the research again."}</p>
            <p><Link href="/portfolio#writing">{"See my writing samples"}</Link></p>
            <h2>{"My research process"}</h2>
            <p>{"I still do much of the work before I write the first paragraph. Here's what that usually involves."}</p>
            <h3>{"Understand the search and the reader"}</h3>
            <p>{"I check Semrush and the search results to see what’s already been written, which questions those pages answer and what someone searching the topic needs help with. I read beyond the highest-ranking pages too. A useful example or explanation can be sitting in an article that barely gets any attention."}</p>
            <p>{"I take notes on gaps in the information, structure and context. If my research points in a different direction from the brief, I raise it early so we can agree on the approach before I write."}</p>
            <h3>{"Find people with something useful to say"}</h3>
            <p>{"I look through LinkedIn, YouTube, X and industry podcasts for relevant experience and expert insight. "}<a href="https://www.listennotes.com/">Listen Notes</a>{" helps me find podcast episodes, and I return to articles and discussions I've saved in my bookmarks."}</p>
            <p>{"If I can speak to someone who knows the subject well, I ask them about the questions my reading hasn’t answered. When I use a published quote, I credit the person and check the surrounding context so I don't change what they meant."}</p>
            <h3>{"Use the product and build the outline"}</h3>
            <p>{"I test the features relevant to the article, note what happens and save screenshots where they help explain a step or capability. Then I combine that product research with my notes to build an outline around what the reader needs to understand."}</p>
            <p>{"I keep the sources available while writing so I can return to them and check that I haven't misinterpreted a statement, idea or framework."}</p>
            <h3>{"Draft, check and edit"}</h3>
            <p>{"I prefer to get the draft down before trying to polish every sentence. Then I work through the argument: what needs more explanation, what doesn't belong, and what the evidence actually supports."}</p>
            <p>{"I fact-check claims, revisit statistics, move sections where necessary, and add useful internal links, source links and images. I use Grammarly to catch smaller errors, but I still edit manually for meaning and flow. I add image alt text and give the piece some time before another read, because a gap is often easier to spot when I come back to it."}</p>
            <h2>{"I also build tools for the work around the article"}</h2>
            <p>{"Working on content means spending plenty of time finding material, checking sources and moving information between tools. Some of my projects grew out of those tasks."}</p>
            <p>{"ContentDB helps writers use the expertise already sitting in a company's articles, videos and research. It connects that material to an AI tool through MCP, so a writer can ask for relevant information instead of manually searching old studies, ebooks and thought-leadership pieces."}</p>
            <p>{"AI Docs Watch checks API documentation for product changes across AI platforms. It keeps the before-and-after versions, with a brief explaining the change, so readers can inspect the original material rather than rely on a summary alone."}</p>
            <p>{"Alongside my writing, I work with Steve Toth and Notebook Agency on content operations and AI-search projects. That work includes a fanout query analysis tool for running prompts at scale, examining the searches behind recorded AI answers and exporting the results for further analysis."}</p>
            <p>{"Building these tools has also changed how I think about the work around an article: finding useful material, checking it and making it easier for someone else to use. They've also taught me to pay attention to what happens when a tool fails, not just whether it works in a demo."}</p>
            <p><Link href="/projects">{"Explore the tools I've built"}</Link></p>
            <h2>{"How I use AI"}</h2>
            <p>{"I use AI to help me research articles and build tools, and I check whether the result does what I need it to do. For an article, that means reading the sources and checking that they support the claims. For a tool, it means trying the tasks someone will use it for and checking what happens when a step fails, so they know what went wrong and what to do next."}</p>
            <h2>{"What clients say"}</h2>
            <p>{"“I APPRECIATE the depth and quality of research you put into these articles. I love the level of specificity and how you research these tools down to the exact functions we want to cover.”"}</p>
            <p>{"— Lateef Maleek, Exceed SEO"}</p>
            <p>{"“Peace was an absolute delight to work with. Always on time, super dependable, and consistently went above and beyond on every task. He took feedback really fast and always came back stronger, the kind of person who makes your work easier just by being on the team.”"}</p>
            <p>{"— Lily Ugbaja, Fractional Content Marketing, Spicy Margarita"}</p>
            <p>{"“you had me hooked from start to finish! It was a really well researched, well structured, helpful piece of content with appropriate product placements. And that makes my heart happy.”"}</p>
            <p>{"— Melissa Malec, Content Lead, Jabra (via Spicy Margarita)"}</p>
            <h2>{"Work with me"}</h2>
            <p>{"Need an article that explains your product properly? I can write it, refresh a piece you already have, or work with your team regularly."}</p>
            <p>{"If there's a task your team keeps doing manually, I can also help you work out whether building a tool would make it easier, then build around how the team works."}</p>
            <p>See my <Link href="/services">services and prices</Link>, <Link href="/portfolio">explore my work</Link>, or <a href="mailto:akindayopeaceakinwale@gmail.com">email me</a> to discuss what you need.</p>
            <p><Link href="https://calendly.com/akindayopeaceakinwale/30min">{"Book a 30-minute call"}</Link></p>
            <p><Link href="https://forms.gle/TatjQSbivWXY1B1m9">{"Send a content brief"}</Link></p>
            <h2>{"A short introduction you can pass along"}</h2>
            <p>{"Peace Akinwale is a B2B SaaS writer and content operator. He writes bottom-of-funnel content for software companies and agencies, combining product research with clear explanations of what buyers can do with the software. He also builds AI-assisted tools for content research and production, and works with Steve Toth and Notebook Agency on content operations and AI-search projects."}</p>
            <p><Link href="https://www.linkedin.com/in/peaceakinwale/">{"LinkedIn"}</Link></p>
            <p><Link href="mailto:akindayopeaceakinwale@gmail.com">{"Email"}</Link></p>
          </div>
          <p className="go mt-8">
            <Link href="/portfolio">The work</Link>
            <Link href="/services">Services and prices</Link>
            <Link href="/contact">Contact</Link>
          </p>
        </div>
        <figure className="m-0 max-w-[360px]">
          <Image src="/images/peace-akinwale-about-wedding.jpg" alt="Peace Akinwale" width={900} height={1200} sizes="(max-width: 760px) 100vw, 360px" className="rounded-[2px] border border-border" priority />
        </figure>
      </div>
    </div>
  );
}
