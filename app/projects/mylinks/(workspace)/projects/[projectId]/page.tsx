import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CrawlButton from '@/components/mylinks/CrawlButton';
import EditProjectModal from '@/components/mylinks/EditProjectModal';
import PageTypeFilter from '@/components/mylinks/PageTypeFilter';
import PaginationControls from '@/components/mylinks/PaginationControls';
import { requireAuthenticatedUser, requireProfile } from '@/lib/mylinks/auth';
import { createServiceClient } from '@/lib/mylinks/supabase/server';
import type { PageType } from '@/lib/mylinks/types/database';

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ page_type?: string; page?: string; per_page?: string; auto_crawl?: string }>;
}) {
  const user = await requireAuthenticatedUser();
  await requireProfile(user.id);
  const { projectId } = await params;
  const { page_type, page = '1', per_page = '20', auto_crawl } = await searchParams;
  const autoCrawl = auto_crawl === '1';
  const limit = [20, 50].includes(Number.parseInt(per_page, 10)) ? Number.parseInt(per_page, 10) : 20;
  const currentPage = Number.parseInt(page, 10) || 1;
  const offset = (currentPage - 1) * limit;

  const serviceClient = await createServiceClient();
  const { data: project } = await serviceClient
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .eq('owner_id', user.id)
    .maybeSingle();

  if (!project) {
    notFound();
  }

  let pagesQuery = serviceClient
    .from('pages')
    .select('*', { count: 'exact' })
    .eq('project_id', projectId)
    .order('priority', { ascending: false })
    .range(offset, offset + limit - 1);

  if (page_type) {
    pagesQuery = pagesQuery.eq('page_type', page_type as PageType);
  }

  const [{ data: pages, count: pageCount }, { data: articles }, { data: stats }] = await Promise.all([
    pagesQuery,
    serviceClient
      .from('articles')
      .select('id, title, word_count, created_at, source')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false }),
    serviceClient.from('pages').select('page_type').eq('project_id', projectId),
  ]);

  const typeCounts = (stats ?? []).reduce<Record<string, number>>((accumulator, pageRow) => {
    accumulator[pageRow.page_type] = (accumulator[pageRow.page_type] ?? 0) + 1;
    return accumulator;
  }, {});

  const totalPages = pageCount ?? 0;
  const totalPageCount = Math.max(1, Math.ceil(totalPages / limit));
  const totalPagesInDb = Object.values(typeCounts).reduce((sum, value) => sum + value, 0);

  return (
    <div className="min-h-screen bg-[var(--muted)]/45">
      <nav className="border-b border-border bg-background px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3">
          <Link href="/projects/mylinks/dashboard" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Dashboard
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="truncate text-sm font-medium text-foreground">{project.name}</span>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{project.domain}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/projects/mylinks/projects/${projectId}/articles/new`}
              className="inline-flex rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90"
              style={{ background: 'var(--accent)' }}
            >
              Add article
            </Link>
            <CrawlButton projectId={projectId} autoCrawl={autoCrawl} />
            <EditProjectModal project={project} />
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <StatCard label="Total pages" value={totalPagesInDb} />
          <StatCard label="Blog posts" value={typeCounts.blog_post ?? 0} />
          <StatCard
            label="Articles"
            value={articles?.length ?? 0}
            href={`/projects/mylinks/projects/${projectId}/articles`}
          />
          <StatCard label="Commercial pages" value={(typeCounts.product ?? 0) + (typeCounts.service ?? 0) + (typeCounts.landing ?? 0)} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.55fr_0.95fr]">
          <section className="rounded-[1.5rem] border border-border bg-background">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
              <div>
                <h2 className="font-semibold text-foreground">Page inventory</h2>
                <p className="mt-1 text-sm text-muted-foreground">Crawled URLs ranked for linking relevance.</p>
              </div>
              <Suspense fallback={<span className="text-xs text-muted-foreground">Loading filter...</span>}>
                <PageTypeFilter typeCounts={typeCounts} />
              </Suspense>
            </div>

            {!pages || pages.length === 0 ? (
              <div className="px-5 py-12 text-center text-sm text-muted-foreground">
                {totalPagesInDb === 0 ? 'No pages crawled yet. Run the sitemap crawl to build the inventory.' : 'No pages match this filter.'}
              </div>
            ) : (
              <div className="divide-y divide-border">
                {pages.map((pageRow) => (
                  <div key={pageRow.id} className="flex items-center gap-3 px-5 py-4">
                    <span
                      className={`rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${pageTypeClass(pageRow.page_type)}`}
                    >
                      {pageRow.page_type}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{pageRow.title || pageRow.url}</p>
                      <p className="truncate text-xs text-muted-foreground">{pageRow.url}</p>
                    </div>
                    <span
                      className="text-xs text-muted-foreground"
                      title="Priority score (higher = AI favors this URL when suggesting links). Product, service, and landing pages rank higher; deeper utility pages rank lower."
                    >
                      P{pageRow.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 0 ? (
              <Suspense fallback={null}>
                <PaginationControls
                  projectId={projectId}
                  currentPage={currentPage}
                  totalPages={totalPageCount}
                  perPage={limit}
                />
              </Suspense>
            ) : null}
          </section>

          <section className="rounded-[1.5rem] border border-border bg-background">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-semibold text-foreground">Drafts</h2>
              <p className="mt-1 text-sm text-muted-foreground">Open an article to review and apply suggestions.</p>
            </div>

            {!articles || articles.length === 0 ? (
              <div className="px-5 py-12 text-center text-sm text-muted-foreground">No articles yet.</div>
            ) : (
              <div className="divide-y divide-border">
                {articles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/projects/mylinks/articles/${article.id}`}
                    className="block px-5 py-4 transition-colors hover:bg-[var(--muted)]/40"
                  >
                    <p className="truncate text-sm font-medium text-foreground">{article.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {article.word_count ? `${article.word_count} words` : article.source}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, href }: { label: string; value: number; href?: string }) {
  const inner = (
    <>
      <p className="text-3xl font-bold text-foreground">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </>
  );
  const baseClass =
    'block rounded-[1.5rem] border border-border bg-background px-5 py-4 transition-colors';
  if (href) {
    return (
      <Link href={href} className={`${baseClass} hover:border-accent hover:bg-[var(--muted)]/30`}>
        {inner}
      </Link>
    );
  }
  return <div className={baseClass}>{inner}</div>;
}

function pageTypeClass(type: string) {
  const styles: Record<string, string> = {
    blog_post: 'bg-blue-100 text-blue-800',
    product: 'bg-emerald-100 text-emerald-800',
    service: 'bg-orange-100 text-orange-800',
    landing: 'bg-violet-100 text-violet-800',
    homepage: 'bg-fuchsia-100 text-fuchsia-800',
    category: 'bg-yellow-100 text-yellow-800',
    about: 'bg-slate-100 text-slate-700',
    contact: 'bg-slate-100 text-slate-700',
    other: 'bg-slate-100 text-slate-700',
  };

  return styles[type] ?? styles.other;
}

