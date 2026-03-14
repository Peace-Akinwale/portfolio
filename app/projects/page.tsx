import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Things I've Built",
  description:
    "I use AI tools to automate content marketing processes where it makes sense. A collection of projects built for real problems.",
};

const projects = [
  {
    number: '01',
    slug: 'linkedin-router',
    title: 'LinkedIn Content Router',
    description:
      'Turns raw ideas into content briefs, LinkedIn posts & Twitter threads while sticking to your style guides. Built for writers, founders, and anyone who rarely have time to post consistently.',
  },
  {
    number: '02',
    slug: 'mylinks',
    title: 'MyLinks — AI Internal Linking Tool',
    description:
      'Crawls your website, understands your content inventory, and suggests precise internal links for any draft — then applies them directly to Google Docs.',
  },
  {
    number: '03',
    slug: 'mystyleguide',
    title: 'MyStyleGuide — Writing Voice Analyzer',
    description:
      'Analyzes writing samples you admire, tracks editor corrections, and generates a precise style guide you can load into any AI project to review your first drafts and provide editorial suggestions.',
  },
  {
    number: '04',
    slug: 'portfolio-project',
    title: 'This Portfolio Website',
    description:
      'Build an editorial portfolio and blog from scratch using Claude Code. I can use the same process to create custom pages on a client\'s website for things like a sales calculator or any business-relevant tool to improve lead gen.',
  },
  {
    number: '05',
    slug: 'editorial-style-guide',
    title: 'A Process to Generate Editorial Style Guides Through Claude Code',
    description:
      "I found a way to extract a brand's editorial voice from existing content and turn it into a detailed style guide for myself. Your in-house writers can use a process like this to improve their first draft where it makes sense — without the AI slop.",
  },
];

export default function ProjectsPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      {/* Header */}
      <header className="mb-16">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
          Things I&apos;ve Built
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          I use AI tools to automate content marketing processes where it makes sense. For my personal
          work as a content marketer for B2B SaaS brands and agencies, I&apos;ve found great use cases
          for the following projects.
        </p>
      </header>

      {/* Project list */}
      <div className="mb-24">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/${project.slug}`}
            className="group flex items-start gap-6 md:gap-10 py-10 border-b border-border hover:border-accent transition-colors"
          >
            <span className="text-4xl md:text-5xl font-bold text-muted-foreground/25 group-hover:text-accent/40 transition-colors shrink-0 leading-none pt-1">
              {project.number}
            </span>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-accent transition-colors leading-snug">
                {project.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {project.description}
              </p>
            </div>
            <span className="text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all self-center text-xl shrink-0">
              →
            </span>
          </Link>
        ))}
      </div>

      {/* A note on how I work */}
      <section className="border-t border-border pt-16">
        <h2 className="text-3xl font-bold mb-6">A note on how I work</h2>
        <div className="prose prose-lg max-w-none">
          <p>
            Every project on this page started with a clear problem I wanted to solve for myself.
          </p>
          <p>
            I&apos;m not a trained developer (although I had a stint learning cybersecurity and even
            have two AWS certifications, so I know a thing or two about security, web development, website architecture, and I
            understand basic HTML and can write in a few programming languages).
          </p>
          <p>
            I built/designed everything here as a writer who learned to &ldquo;think in
            systems&rdquo; and learned to use AI as infrastructure.
          </p>
          <p>
            That&apos;s the perspective I bring to work.
          </p>
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
    </main>
  );
}
