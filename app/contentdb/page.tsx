import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'contentDB',
  description:
    'contentDB is a content intelligence system that turns research and customer conversations into searchable, source-grounded answers across web chat and AI tools through MCP.',
};

const stack = [
  'Next.js',
  'Node.js / Express',
  'Supabase (Postgres/Auth)',
  'OpenAI (embeddings + extraction)',
  'Gemini (web chat generation)',
  'MCP SDK',
  'Render',
  'Vercel',
];

const features = [
  'Add content from URL or pasted text, including articles, YouTube, LinkedIn, Reddit, podcasts, transcripts, and reports.',
  'Store customer conversations and transcripts in a structured format with segments, timestamps, and speaker metadata when available.',
  'Extract pain points and retrieve quote context before and after the match instead of isolated snippets.',
  'Search and chat from the web app with source-grounded responses.',
  'Use the same workspace context inside Claude, ChatGPT, and Gemini-compatible tools through MCP.',
  'Filter by client inside one workspace so answers stay scoped to the correct account.',
];

const differentiators = [
  'Works both as a standalone web product and as an MCP-connected system inside external AI tools.',
  'Returns source-grounded answers with contextual quotes from your database, not generic AI summaries.',
  'Built for agency workflows where multiple clients share one workspace but still need clean separation.',
];

const screenshots = [
  {
    title: 'Bring sources into one searchable system',
    description:
      'Add links or pasted text, tag the right client, and make that source available for retrieval across the workspace.',
    src: '/images/contentdb/add-content.png',
    alt: 'contentDB add content screen with URL input, client tagging, and source ingestion form',
  },
  {
    title: 'Search with quote context',
    description:
      'Find exact moments, surrounding context, and client-tagged material instead of isolated snippets.',
    src: '/images/contentdb/search-results.png',
    alt: 'contentDB search results showing quote context before and after the matched passage',
  },
  {
    title: 'Get grounded output from the same source base',
    description:
      'Turn that stored research into structured, source-grounded answers you can actually write from.',
    src: '/images/contentdb/grounded-output.png',
    alt: 'Grounded contentDB output showing pain points surfaced across sources',
  },
];

export default function ContentDbPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-8">
        <Link
          href="/projects"
          className="text-sm uppercase tracking-wider text-muted-foreground transition-colors hover:text-accent"
        >
          Projects
        </Link>
      </div>

      <header className="mb-14 flex flex-col gap-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: 'var(--accent)' }}>
          Flagship Product / System Project
        </p>
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">contentDB</h1>
          <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
            contentDB is a <strong className="font-semibold text-foreground">content intelligence system</strong> that turns research and customer conversations
            into <strong className="font-semibold text-foreground">searchable, source-grounded answers</strong> across web chat and AI tools (Claude, ChatGPT,
            Gemini) through MCP.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://contentdb.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md px-5 py-3 text-sm font-bold uppercase tracking-[0.08em] text-white"
            style={{ background: 'var(--accent)' }}
          >
            Open the live app
          </a>
          <span className="self-center text-sm text-muted-foreground">Private beta, free for now.</span>
        </div>
      </header>

      <div className="grid gap-12">
        <section className="grid gap-4">
          <h2 className="text-2xl font-bold">What it is</h2>
          <p className="leading-relaxed text-muted-foreground">
            contentDB is a workspace database where you can add your company&apos;s <strong className="font-semibold text-foreground">high-value content</strong>
            from URLs or pasted text, including podcasts, transcripts, SME-led articles, ebooks,
            reports, surveys, LinkedIn posts, Reddit threads, and customer chats or calls. You can
            then query that material from the web app or from <strong className="font-semibold text-foreground">connected AI clients through MCP</strong> while
            writing or doing research.
          </p>
        </section>

        <section className="grid gap-6">
          <div className="grid gap-2">
            <h2 className="text-2xl font-bold">How it works</h2>
            <p className="max-w-3xl leading-relaxed text-muted-foreground">
              The workflow is simple: <strong className="font-semibold text-foreground">bring the source in</strong>, <strong className="font-semibold text-foreground">retrieve the useful context</strong>, then
              use the same material to get <strong className="font-semibold text-foreground">accurate context while writing or during research</strong>.
            </p>
          </div>
          <div className="grid gap-8">
            {screenshots.map((shot, index) => (
              <article key={shot.title} className="grid gap-4">
                <div className="grid gap-2">
                  <p className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: 'var(--accent)' }}>
                    Step 0{index + 1}
                  </p>
                  <h3 className="text-xl font-bold">{shot.title}</h3>
                  <p className="max-w-3xl leading-relaxed text-muted-foreground">{shot.description}</p>
                </div>
                <div
                  className="overflow-hidden rounded-2xl border"
                  style={{ borderColor: 'var(--border)', background: 'color-mix(in srgb, var(--accent) 3%, var(--background))' }}
                >
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    width={1600}
                    height={1000}
                    className="h-auto w-full"
                  />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4">
          <h2 className="text-2xl font-bold">Problem it solves</h2>
          <div className="grid gap-4 text-muted-foreground">
            <p className="leading-relaxed">
              When writing for clients or your company, useful context is usually <strong className="font-semibold text-foreground">scattered across
              many links, docs, calls, and transcripts.</strong> You&apos;d have to spend time on
              Google searches, interview SMEs, or comb through existing podcasts and reports to
              find relevant material.
            </p>
            <p className="leading-relaxed">
              If you rely on Google search or <strong className="font-semibold text-foreground">generic AI output</strong>, the writing often becomes
              weak or repetitive. contentDB keeps that context in one place so you can pull <strong className="font-semibold text-foreground">relevant
              quotes, supporting detail, and customer wording quickly via Claude MCP</strong> to improve the credibility of
              your work.
            </p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 md:gap-8">
          <div className="grid gap-3">
            <h2 className="text-2xl font-bold">Who it&apos;s for</h2>
            <p className="leading-relaxed text-muted-foreground">
              Content strategists, B2B SaaS marketers, writers in general, and agencies with
              multiple clients.
            </p>
          </div>
          <div className="grid gap-3">
            <h2 className="text-2xl font-bold">My role</h2>
            <p className="leading-relaxed text-muted-foreground">
              I built it <strong className="font-semibold text-foreground">end-to-end</strong>: product direction, UX, data model, ingestion flows, transcript
              processing, pain-point extraction, semantic retrieval, chat workflows, MCP integrations,
              multi-tenant client isolation, and deployment setup.
            </p>
          </div>
        </section>

        <section className="grid gap-4">
          <h2 className="text-2xl font-bold">Key features</h2>
          <ul className="grid gap-3 pl-6 text-muted-foreground list-disc">
            {features.map((feature) => (
              <li key={feature} className="leading-relaxed">
                {feature}
              </li>
            ))}
          </ul>
        </section>

        <section className="grid gap-4">
          <h2 className="text-2xl font-bold">What makes it different</h2>
          <ul className="grid gap-3 pl-6 text-muted-foreground list-disc">
            {differentiators.map((item) => (
              <li key={item} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="grid gap-4">
          <h2 className="text-2xl font-bold">Stack</h2>
          <div className="flex flex-wrap gap-2">
            {stack.map((item) => (
              <span
                key={item}
                className="rounded-full border px-3 py-1 text-sm text-muted-foreground"
                style={{ borderColor: 'var(--border)' }}
              >
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="grid gap-4">
          <h2 className="text-2xl font-bold">Why it matters</h2>
          <p className="leading-relaxed text-muted-foreground">
            It makes writing workflows <strong className="font-semibold text-foreground">faster and more specific</strong>. Instead of starting from generic AI
            output, I can pull <strong className="font-semibold text-foreground">real context from a client&apos;s content and customer language</strong> from
            shared calls, then use that material to produce <strong className="font-semibold text-foreground">stronger, more credible content</strong>.
          </p>
        </section>

        <section
          className="rounded-xl border px-6 py-6"
          style={{ borderColor: 'var(--border)', background: 'color-mix(in srgb, var(--accent) 4%, var(--background))' }}
        >
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold">Use contentDB</h2>
            <p className="max-w-2xl leading-relaxed text-muted-foreground">
              contentDB is live in private beta and currently free to use. The product works as a standalone web app and as an MCP-connected system for AI-assisted research and writing.
            </p>
            <div>
              <a
                href="https://contentdb.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-md px-5 py-3 text-sm font-bold uppercase tracking-[0.08em] text-white"
                style={{ background: 'var(--accent)' }}
              >
                Visit contentDB
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
