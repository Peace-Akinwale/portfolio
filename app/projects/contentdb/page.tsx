import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'contentDB',
  description:
    'contentDB stores customer conversations, research, and content in one place so you can query it through MCP in Claude, ChatGPT, or the contentDB web chat while you research, write, or update an article.',
  alternates: {
    canonical: 'https://peaceakinwale.com/projects/contentdb',
  },
  openGraph: {
    title: 'contentDB',
    description:
      'contentDB stores customer conversations, research, and content in one place so you can query it through MCP in Claude, ChatGPT, or the contentDB web chat while you research, write, or update an article.',
    url: '/projects/contentdb',
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
  'Supabase Postgres',
  'Supabase Storage',
  'Resend',
  'Tailwind CSS',
  'TypeScript',
  'MCP server integration',
];

const useCases = [
  'Store customer interviews, sales call notes, and product positioning docs in one searchable place.',
  'Ground AI answers in your own research instead of vague model memory.',
  'Search your internal content inventory before updating an article or writing a new one.',
  'Turn scattered notes into reusable source material across Claude, ChatGPT, Gemini, and the web chat.',
];

export default function ContentDbProjectPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-start">
        <section>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--accent)' }}>
            Project
          </p>
          <h1 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl md:text-6xl">
            contentDB
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            contentDB stores your customer conversations, research, and content in one place so you can ask
            grounded questions from Claude, ChatGPT, Gemini, or the built-in web chat instead of digging through docs.
          </p>

          <div className="mt-10 overflow-hidden rounded-[2rem] border border-border bg-card shadow-[0_28px_80px_rgba(35,22,10,0.08)]">
            <div className="grid gap-0 border-b border-border sm:grid-cols-2">
              <div className="border-border p-4 sm:border-r">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  Add structured notes
                </p>
                <div className="overflow-hidden rounded-2xl border border-border bg-background/70">
                  <Image
                    src="/images/contentdb/add-content.png"
                    alt="Adding content into contentDB"
                    width={1200}
                    height={800}
                    className="h-auto w-full"
                  />
                </div>
              </div>
              <div className="p-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  Grounded output
                </p>
                <div className="overflow-hidden rounded-2xl border border-border bg-background/70">
                  <Image
                    src="/images/contentdb/grounded-output.png"
                    alt="Grounded answer from contentDB"
                    width={1200}
                    height={800}
                    className="h-auto w-full"
                  />
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Search experience
              </p>
              <div className="overflow-hidden rounded-2xl border border-border bg-background/70">
                <Image
                  src="/images/contentdb/search-results.png"
                  alt="Searching saved notes in contentDB"
                  width={1600}
                  height={900}
                  className="h-auto w-full"
                />
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-8 rounded-[2rem] border border-border bg-card p-6 shadow-[0_18px_60px_rgba(35,22,10,0.06)] sm:p-8 lg:sticky lg:top-28">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
              What it does
            </p>
            <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              {useCases.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Stack
            </p>
            <div className="flex flex-wrap gap-2">
              {stack.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-border bg-background p-5">
            <p className="text-sm font-semibold text-foreground">Why I built it</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Research and customer insight gets buried fast. contentDB exists so useful context stays queryable,
              grounded, and reusable while you write, edit, or update content.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center rounded-full border border-border px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-foreground transition hover:border-accent hover:text-accent"
            >
              Back to Projects
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:opacity-90"
              style={{ background: 'var(--accent)' }}
            >
              Ask About a Similar Build
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
