import Link from 'next/link';
import type { Metadata } from 'next';
import { getStaticPage } from '@/lib/hashnode/client';

export const metadata: Metadata = {
  title: 'MyLinks | Internal Linking Workspace',
  description:
    'Generate internal link suggestions, route client-approved URLs into anchor text, and manage article linking workflows inside one editorial workspace.',
  alternates: {
    canonical: 'https://peaceakinwale.com/projects/mylinks',
  },
  openGraph: {
    title: 'MyLinks | Internal Linking Workspace',
    description:
      'Generate internal link suggestions, route client-approved URLs into anchor text, and manage article linking workflows inside one editorial workspace.',
    url: '/projects/mylinks',
    images: [
      'https://res.cloudinary.com/cloud-blog-publisher/image/upload/v1772457514/mylinks_app_demo_qbdfj7.png',
    ],
  },
};

const workspaceBullets = [
  'Instead of guessing which URLs to link to, you pull from the real site inventory, review the suggestions, and decide what should actually make it into the article.',
  'Create a project for each client domain and crawl the sitemap into a usable inventory.',
  'Support pasted drafts and Google Doc imports in the same workflow.',
  'Add client-approved destination URLs before suggestion generation.',
  'Prefer product, service, and landing pages when they are the better editorial fit.',
  'Copy, export, or auto-apply approved links back to Google Docs after approval.',
];

export default async function MyLinksProjectPage() {
  const staticPage = await getStaticPage('mylinks');

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      <section className="rounded-[2rem] border border-border bg-card p-8 shadow-[0_24px_70px_rgba(35,22,10,0.07)]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--accent)' }}>
            Project + Workspace
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight text-foreground sm:text-5xl md:text-6xl">
            Find the right internal links for a draft before it goes live.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            MyLinks crawls a site, understands which pages matter, and suggests natural internal links inside a
            draft or Google Doc. You review every suggestion, add client-approved destination URLs when needed,
            and export or apply the linked version without turning the article into spam.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/projects/mylinks/login"
              className="inline-flex rounded-full px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90"
              style={{ background: 'var(--accent)' }}
            >
              Enter beta workspace
            </Link>
            <Link
              href="/projects"
              className="inline-flex rounded-full border border-border px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-[var(--muted)]"
            >
              Back to projects
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-12 rounded-[2rem] border border-border bg-[var(--muted)]/35 p-8 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          What you can do in the workspace
        </p>
        <ul className="mt-6 space-y-4 text-sm leading-7 text-muted-foreground">
          {workspaceBullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {staticPage ? (
        <section className="mt-14 rounded-[2rem] border border-border bg-background p-8 sm:p-10">
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: staticPage.content.html }}
          />
        </section>
      ) : null}
    </main>
  );
}
