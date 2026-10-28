import { withOg } from '@/lib/og';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = withOg({
  title: "Things I've built | Peace Akinwale",
  description:
    'I decide which content marketing processes are worth automating and build the tools that do it. Each project came out of my own work as a B2B SaaS writer.',
  alternates: {
    canonical: 'https://peaceakinwale.com/projects',
  },
}, { key: 'projects', path: '/projects', alt: 'Things I’ve built' });

const projects = [
  {
    number: '01',
    slug: 'contentdb',
    href: '/projects/contentdb',
    title: 'contentDB',
    description:
      'ContentDB is a content intelligence system that turns research and customer conversations into searchable, source-grounded answers. It answers in web chat and in AI tools like Claude and ChatGPT through MCP.',
  },
  {
    number: '02',
    slug: 'career-pathway',
    href: '/projects/career-pathway',
    title: 'Career Pathway Assessment',
    description:
      "An interactive assessment tool that scores 23 careers against a person's personality and goals. It returns four realistic paths with income context and AI caveats.",
  },
  {
    number: '03',
    slug: 'linkedin-router',
    title: 'LinkedIn Content Router',
    description:
      'Turns raw ideas into LinkedIn posts and Twitter threads while sticking to your style guides. Built for writers and founders who are short on time and want to post on a schedule.',
  },
  {
    number: '04',
    slug: 'mylinks',
    href: '/projects/mylinks',
    title: 'MyLinks - AI Internal Linking Tool',
    description:
      'Crawls your website and suggests precise internal links for any draft. Then it applies them in Google Docs.',
  },
  {
    number: '05',
    slug: 'mystyleguide',
    title: 'MyStyleGuide - Writing Voice Analyzer',
    description:
      'Analyzes writing samples you admire and tracks editor corrections. Then it generates a precise style guide you can load into any AI project to review your first drafts and suggest edits.',
  },
  {
    number: '06',
    slug: 'portfolio-project',
    title: 'This Portfolio Website',
    description:
      "Designed and built an editorial portfolio and blog from scratch, directing Claude Code through the build. I can use the same process to create custom pages on a client's website, like a sales calculator or another business tool that improves lead gen.",
  },
  {
    number: '07',
    slug: 'editorial-style-guide',
    title: 'A Process to Generate Editorial Style Guides Through Claude Code',
    description:
      "I built a process that extracts a brand's editorial voice from existing content and turns it into a detailed style guide for my own use. Your in-house writers can use a process like this to improve their first draft where it makes sense, without the AI slop.",
  },
];

export default function ProjectsPage() {
  return (
    <div className="gutter mx-auto max-w-[1180px] py-16">
      <div className="max-w-5xl">
      <header className="mb-16">
        <h1 className="mb-6 text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
          Things I&apos;ve built
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          I decide which content marketing processes are worth automating and build the tools
          that do it. Each project below came out of my own work as a B2B SaaS writer for brands
          and agencies.
        </p>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground">
          The newer tools each have a{' '}
          <Link href="/case-studies" className="underline underline-offset-4">case study</Link>. They include AI Docs Watch, the fanout query analysis tool, Quality Rater, an OKF, Aloud and Reach.
        </p>
      </header>

      <div className="mb-24">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={project.href ?? `/projects/${project.slug}`}
            className="group flex items-start gap-6 border-b border-border py-10 transition-colors hover:border-accent md:gap-10"
          >
            <span className="shrink-0 pt-1 text-4xl font-bold leading-none text-muted-foreground/25 transition-colors group-hover:text-accent/40 md:text-5xl">
              {project.number}
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="mb-2 text-xl font-bold leading-snug transition-colors group-hover:text-accent md:text-2xl">
                {project.title}
              </h2>
              <p className="leading-relaxed text-muted-foreground">{project.description}</p>
            </div>
          </Link>
        ))}
      </div>

      <section className="border-t border-border pt-16">
        <h2 className="mb-6 text-3xl font-bold">A note on how I work</h2>
        <div className="prose prose-lg max-w-none">
          <p>Every project on this page started with a clear problem I wanted to solve for myself.</p>
          <p>
            I hold two AWS certifications, and I write code in a few programming languages.
          </p>
          <p>
            I designed and built everything here, and I treat content work as a system to engineer.
            That&apos;s the perspective I bring to a team.
          </p>
          <p>
            When I join a team, I find out what slows people down and build the tool that takes it
            off their desk. I did that for my own work first, which is where every project above
            came from.
          </p>
          <p>
            If you lead content at a company or an agency, that is what you get with me. A writer
            with editorial judgement who also builds the systems around the writing.
          </p>
          <p>
            <a href="mailto:akindayopeaceakinwale@gmail.com">Send an email</a> or{' '}
            <a href="https://calendly.com/akindayopeaceakinwale/30min" target="_blank" rel="noopener noreferrer">
              book a call
            </a>
            . You can also connect on{' '}
            <a href="https://www.linkedin.com/in/peaceakinwale/" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            .
          </p>
        </div>
      </section>
      </div>
    </div>
  );
}
