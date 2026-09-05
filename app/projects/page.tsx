import type { Metadata } from 'next';
import { Container, IndexList, IndexRow, PageHeader } from '@/components/ui';
import { CtaBlock } from '@/components/CtaBlock';

export const metadata: Metadata = {
  title: "Things I've Built",
  description:
    'I use AI tools to automate content marketing processes where it makes sense. A collection of projects built for real problems.',
  alternates: {
    canonical: 'https://peaceakinwale.com/projects',
  },
};

const projects = [
  {
    slug: 'contentdb',
    href: '/projects/contentdb',
    title: 'ContentDB',
    description:
      'A content intelligence system that turns research and customer conversations into searchable, source-grounded answers across web chat and AI tools (Claude, ChatGPT, Gemini) through MCP.',
  },
  {
    slug: 'career-pathway',
    href: '/career-pathway',
    title: 'Career Pathway Assessment',
    description:
      "An interactive assessment that scores 28 careers against a person's personality, constraints, and goals, then returns four realistic paths with resources, income context, and AI caveats.",
  },
  {
    slug: 'linkedin-router',
    title: 'LinkedIn Content Router',
    description:
      'Turns raw ideas into content briefs, LinkedIn posts and Twitter threads while sticking to your style guides. Built for writers, founders, and anyone who rarely has time to post consistently.',
  },
  {
    slug: 'mylinks',
    href: '/projects/mylinks',
    title: 'MyLinks',
    description:
      'Crawls your website, understands your content inventory, and suggests precise internal links for any draft, then applies them directly to Google Docs.',
  },
  {
    slug: 'mystyleguide',
    title: 'MyStyleGuide',
    description:
      'Analyzes writing samples you admire, tracks editor corrections, and generates a precise style guide you can load into any AI project to review your first drafts.',
  },
  {
    slug: 'portfolio-project',
    title: 'This portfolio website',
    description:
      "Built an editorial portfolio and blog from scratch using Claude Code. The same process creates custom pages on a client's website: a sales calculator or any business-relevant tool to improve lead gen.",
  },
  {
    slug: 'editorial-style-guide',
    title: 'Editorial style guides through Claude Code',
    description:
      "A way to extract a brand's editorial voice from existing content and turn it into a detailed style guide. In-house writers can use a process like this to improve first drafts without the AI slop.",
  },
];

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        label="Projects"
        title="Things I have built"
        lede="I use AI tools to automate content marketing processes where it makes sense. Each of these started with a bottleneck in my own work."
      />

      <Container className="pb-8">
        <IndexList>
          {projects.map((project, i) => (
            <IndexRow
              key={project.slug}
              number={String(i + 1).padStart(2, '0')}
              title={project.title}
              href={project.href ?? `/projects/${project.slug}`}
              description={project.description}
            />
          ))}
        </IndexList>

        <section className="mt-20 max-w-[62ch]">
          <h2 className="t-h2 text-foreground">A note on how I work</h2>
          <div className="mt-6 flex flex-col gap-4 text-[17px] leading-[1.75] text-muted-foreground">
            <p>Every project on this page started with a clear problem I wanted to solve for myself.</p>
            <p>
              I am not a trained developer, although I had a stint learning cybersecurity and hold two AWS certifications,
              so I know a thing or two about security, web development, and website architecture, and I can write in a
              few programming languages.
            </p>
            <p>
              I built and designed everything here as a writer who learned to think in systems and to use AI as
              infrastructure. That is the perspective I bring to work.
            </p>
            <p>
              When I join a new team, I look for what you need, what slows you down, and what we can realistically solve
              with AI without adding more work to your desk. I have had to build my way out of the manual tasks I could
              automate. If you can recognise those tasks in your own team, I can help you automate them.
            </p>
          </div>
        </section>
      </Container>

      <CtaBlock title="A writer with editorial judgment who can also build the system." lede="If that is what your team is missing, let us talk." />
    </>
  );
}
