import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Things I've Built",
  description:
    'I use AI tools to automate content marketing processes where it makes sense. A collection of projects built for real problems.',
};

const projects = [
  {
    number: '01',
    slug: 'contentdb',
    href: '/contentdb',
    title: 'contentDB',
    description:
      'ContentDB is a content intelligence system that turns research and customer conversations into searchable, source-grounded answers across web chat and AI tools (Claude, ChatGPT, Gemini) through MCP.',
  },
  {
    number: '02',
    slug: 'career-pathway',
    href: '/career-pathway',
    title: 'Career Pathway Assessment',
    description:
      "An interactive assessment tool that scores 23 careers against a person's personality, constraints, and goals, then returns four realistic paths with resources, income context, and AI caveats.",
  },
  {
    number: '03',
    slug: 'linkedin-router',
    title: 'LinkedIn Content Router',
    description:
      'Turns raw ideas into content briefs, LinkedIn posts and Twitter threads while sticking to your style guides. Built for writers, founders, and anyone who rarely has time to post consistently.',
  },
  {
    number: '04',
    slug: 'mylinks',
    title: 'MyLinks - AI Internal Linking Tool',
    description:
      'Crawls your website, understands your content inventory, and suggests precise internal links for any draft, then applies them directly to Google Docs.',
  },
  {
    number: '05',
    slug: 'mystyleguide',
    title: 'MyStyleGuide - Writing Voice Analyzer',
    description:
      'Analyzes writing samples you admire, tracks editor corrections, and generates a precise style guide you can load into any AI project to review your first drafts and provide editorial suggestions.',
  },
  {
    number: '06',
    slug: 'portfolio-project',
    title: 'This Portfolio Website',
    description:
      "Built an editorial portfolio and blog from scratch using Claude Code. I can use the same process to create custom pages on a client's website for things like a sales calculator or any business-relevant tool to improve lead gen.",
  },
  {
    number: '07',
    slug: 'editorial-style-guide',
    title: 'A Process to Generate Editorial Style Guides Through Claude Code',
    description:
      "I found a way to extract a brand's editorial voice from existing content and turn it into a detailed style guide for myself. Your in-house writers can use a process like this to improve their first draft where it makes sense, without the AI slop.",
  },
];

export default function ProjectsPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="max-w-5xl">
      <header className="mb-16">
        <h1 className="mb-6 text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
          Things I&apos;ve Built
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          I use AI tools to automate content marketing processes where it makes sense. For my personal
          work as a B2B SaaS content writer for brands and agencies, I&apos;ve found great use cases
          for the following projects.
        </p>
      </header>

      <div className="mb-24">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={project.href ?? `/${project.slug}`}
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
            <span className="self-center text-xl text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-accent">
              {'->'}
            </span>
          </Link>
        ))}
      </div>

      <section className="border-t border-border pt-16">
        <h2 className="mb-6 text-3xl font-bold">A note on how I work</h2>
        <div className="prose prose-lg max-w-none">
          <p>Every project on this page started with a clear problem I wanted to solve for myself.</p>
          <p>
            I&apos;m not a trained developer (although I had a stint learning cybersecurity and even
            have two AWS certifications, so I know a thing or two about security, web development,
            website architecture, and I understand basic HTML and can write in a few programming
            languages).
          </p>
          <p>
            I built and designed everything here as a writer who learned to &ldquo;think in
            systems&rdquo; and learned to use AI as infrastructure.
          </p>
          <p>That&apos;s the perspective I bring to work.</p>
          <p>
            When I join a new team, I seek to understand what you need, what slows you down, and
            what we can realistically solve with AI without adding more work on your desk. I&apos;ve
            had to build my way out of the manual tasks I could automate, and if you can recognize
            what those &ldquo;manual tasks to automate&rdquo; are as well, I can help you automate
            them.
          </p>
          <p>
            And as a content lead, founder, or agency owner, it&apos;s imperative to find a writer
            with good editorial judgment who can also build systems to make life easier for you and
            your team. I am that writer.
          </p>
          <p>
            <a href="mailto:akindayopeaceakinwale@gmail.com">Send an email</a>,{' '}
            <a href="https://calendly.com/akindayopeaceakinwale/30min" target="_blank" rel="noopener noreferrer">
              book a call
            </a>
            , or connect on{' '}
            <a href="https://www.linkedin.com/in/peaceakinwale/" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            .
          </p>
        </div>
      </section>
      </div>
    </main>
  );
}
