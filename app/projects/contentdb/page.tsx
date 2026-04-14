import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'contentDB',
  description:
    'contentDB stores customer conversations, research, and content in one place so you can query it through MCP in Claude, ChatGPT, or the contentDB web chat while you research, write, or update an article.',
  openGraph: {
    title: 'contentDB',
    description:
      'contentDB stores customer conversations, research, and content in one place so you can query it through MCP in Claude, ChatGPT, or the contentDB web chat while you research, write, or update an article.',
    url: '/contentdb',
    siteName: 'contentDB',
    type: 'website',
    images: [
      {
        url: '/contentdb/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'contentDB preview image',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'contentDB',
    description:
      'contentDB stores customer conversations, research, and content in one place so you can query it through MCP in Claude, ChatGPT, or the contentDB web chat while you research, write, or update an article.',
    images: ['/contentdb/opengraph-image'],
  },
  icons: {
    icon: '/images/contentdb/logo.svg',
    shortcut: '/images/contentdb/logo.svg',
    apple: '/images/contentdb/logo.svg',
  },
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

type WorkflowShot = {
  title: string;
  description: string;
  src: string;
  alt: string;
  prompt?: string;
  response?: string;
  ctaLabel?: string;
};

const screenshots: WorkflowShot[] = [
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
    title: 'Turn that stored research into structured, source-grounded answers you can write from.',
    description:
      'Claude gives a response from your database first, which helps keep the answer grounded and avoids hallucination.',
    src: '/images/contentdb/grounded-output.png',
    alt: 'Grounded contentDB output showing pain points surfaced across sources',
    prompt:
      'holla. i am writing an article about how to get retainer clients for ManyRequests. based on the contentDB mcp, are there any context I can lead with? e.g. productized agency founders who used this retainer model to scale their business, the pain point they had, and how they solved it. let’s start with the pain point they usually faced/had. i am looking for pain/friction points when it comes to getting retainer clients.',
    response: 'Let me search the ContentDB for relevant pain points around retainer clients.',
    ctaLabel: 'Try it again in contentDB',
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
            contentDB stores customer conversations, research, and content in one place so you can query it through MCP in Claude, ChatGPT, or the
            contentDB web chat while you research, write, or update an article.
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
        <section className="grid gap-6">
          <div className="grid gap-2">
            <h2 className="text-2xl font-bold">How it works</h2>
            <p className="max-w-3xl leading-relaxed text-muted-foreground">
              contentDB is a workspace database where you can add your company&apos;s high-value content from URLs or pasted texts, including podcasts,
              transcripts, SME-led articles, ebooks, reports, surveys, LinkedIn posts, Reddit threads, and customer chats or calls. You can then query
              that material from the contentDB web app or from connected AI clients through MCP while writing or doing research.
            </p>
          </div>

          <div className="grid gap-8">
            {screenshots.map((shot, index) => (
              <article
                key={shot.title}
                className="grid gap-4"
              >
                <div className="grid gap-2">
                  <p className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: 'var(--accent)' }}>
                    Step 0{index + 1}
                  </p>
                  <h3 className="text-xl font-bold">{shot.title}</h3>
                  {index !== 2 && <p className="max-w-3xl leading-relaxed text-muted-foreground">{shot.description}</p>}
                </div>

                {index === 2 ? (
                  <div className="flex flex-col gap-6">
                    <div
                      className="ml-auto flex w-full max-w-xl flex-col gap-4 rounded-[28px] border p-5 shadow-sm"
                      style={{
                        borderColor: 'var(--border)',
                        background:
                          'linear-gradient(180deg, color-mix(in srgb, var(--background) 92%, #efe8d8 8%), color-mix(in srgb, var(--background) 98%, #efe8d8 2%))',
                      }}
                    >
                      <div className="flex justify-center">
                        <div className="inline-flex rounded-full border bg-background/80 px-1 py-1 text-xs text-muted-foreground shadow-sm">
                          <span className="rounded-full bg-background px-3 py-1 text-foreground">Chat</span>
                          <span className="px-3 py-1">Cowork</span>
                          <span className="px-3 py-1">Code</span>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <div
                          className="max-w-[92%] rounded-2xl bg-[#e9dfcf] px-4 py-4 text-sm leading-relaxed text-foreground shadow-sm"
                          style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.04)' }}
                        >
                          <p className="whitespace-pre-wrap">{shot.prompt}</p>
                        </div>
                      </div>

                      <div className="flex justify-start">
                        <div
                          className="max-w-[92%] rounded-2xl border bg-background px-4 py-4 text-sm leading-relaxed text-foreground shadow-sm"
                          style={{ borderColor: 'var(--border)' }}
                        >
                          <div className="flex items-start gap-3">
                            <span className="mt-1 inline-flex h-4 w-4 flex-none items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold leading-none text-white">
                              ✓
                            </span>
                            <p className="whitespace-pre-wrap">{shot.response}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4">
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

                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {shot.description}
                      </p>

                      <div className="flex justify-start">
                        <a
                          href="https://contentdb.vercel.app"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex rounded-md px-5 py-3 text-sm font-bold uppercase tracking-[0.08em] text-white"
                          style={{ background: 'var(--accent)' }}
                        >
                          {shot.ctaLabel}
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
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
                )}
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
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/projects"
            className="inline-flex items-center justify-center rounded-full border border-border px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-foreground transition hover:border-accent hover:text-accent"
          >
            Back to Projects
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full border border-border px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-foreground transition hover:border-accent hover:text-accent"
          >
            Ask About a Similar Build
          </Link>
        </div>
      </div>
    </main>
  );
}
