import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAuthenticatedUser, requireProfile } from '@/lib/mylinks/auth';
import { createServiceClient } from '@/lib/mylinks/supabase/server';

export default async function ProjectArticlesListPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const user = await requireAuthenticatedUser();
  await requireProfile(user.id);
  const { projectId } = await params;
  const serviceClient = await createServiceClient();

  const { data: project } = await serviceClient
    .from('projects')
    .select('id, name, domain')
    .eq('id', projectId)
    .eq('owner_id', user.id)
    .maybeSingle();

  if (!project) notFound();

  const { data: articles } = await serviceClient
    .from('articles')
    .select('id, title, word_count, created_at, source, google_doc_id')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  const articleIds = (articles ?? []).map((a) => a.id);
  type SuggestionRow = { article_id: string; status: string };
  let suggestionRows: SuggestionRow[] = [];
  if (articleIds.length > 0) {
    const { data } = await serviceClient
      .from('suggestions')
      .select('article_id, status')
      .in('article_id', articleIds);
    suggestionRows = (data ?? []) as SuggestionRow[];
  }
  const suggestionCounts = suggestionRows.reduce<
    Record<string, { total: number; approved: number; pending: number }>
  >((acc, row) => {
    const bucket = acc[row.article_id] ?? { total: 0, approved: 0, pending: 0 };
    bucket.total += 1;
    if (row.status === 'approved') bucket.approved += 1;
    if (row.status === 'pending') bucket.pending += 1;
    acc[row.article_id] = bucket;
    return acc;
  }, {});

  return (
    <>
      <nav
        className="border-b px-4 py-3 sm:px-6"
        style={{ borderColor: 'var(--ml-border)', background: 'var(--ml-bg-elevated)' }}
      >
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-2 text-sm">
          <Link
            href="/projects/mylinks/dashboard"
            style={{ color: 'var(--ml-text-muted)' }}
            className="hover:underline"
          >
            Dashboard
          </Link>
          <span style={{ color: 'var(--ml-text-faint)' }}>/</span>
          <Link
            href={`/projects/mylinks/projects/${projectId}`}
            style={{ color: 'var(--ml-text-muted)' }}
            className="hover:underline"
          >
            {project.name}
          </Link>
          <span style={{ color: 'var(--ml-text-faint)' }}>/</span>
          <span style={{ color: 'var(--ml-text)' }} className="font-medium">
            Articles
          </span>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Articles for {project.name}</h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--ml-text-muted)' }}>
              {articles?.length ?? 0} article{(articles?.length ?? 0) === 1 ? '' : 's'} saved.
            </p>
          </div>
          <Link
            href={`/projects/mylinks/projects/${projectId}/articles/new`}
            className="ml-btn ml-btn-primary"
          >
            + New article
          </Link>
        </div>

        {!articles || articles.length === 0 ? (
          <div
            className="rounded-lg border border-dashed px-6 py-16 text-center"
            style={{ borderColor: 'var(--ml-border)', background: 'var(--ml-bg-elevated)' }}
          >
            <p className="text-base font-medium">No articles in this project yet.</p>
            <p className="mt-2 text-sm" style={{ color: 'var(--ml-text-muted)' }}>
              Paste a draft or link a Google Doc to get AI-suggested internal links.
            </p>
            <Link
              href={`/projects/mylinks/projects/${projectId}/articles/new`}
              className="ml-btn ml-btn-primary mt-5"
            >
              Add your first article
            </Link>
          </div>
        ) : (
          <div className="ml-surface divide-y" style={{ borderColor: 'var(--ml-border)' }}>
            {articles.map((article) => {
              const counts = suggestionCounts[article.id] ?? { total: 0, approved: 0, pending: 0 };
              const created = new Date(article.created_at).toLocaleDateString();
              return (
                <Link
                  key={article.id}
                  href={`/projects/mylinks/articles/${article.id}`}
                  className="block px-5 py-4 transition-colors hover:bg-[var(--ml-bg-subtle)]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-medium">{article.title}</p>
                      <div
                        className="mt-1 flex flex-wrap items-center gap-3 text-xs"
                        style={{ color: 'var(--ml-text-muted)' }}
                      >
                        <span>{created}</span>
                        <span>&middot;</span>
                        <span>
                          {article.word_count ? `${article.word_count} words` : article.source}
                        </span>
                        {article.google_doc_id ? (
                          <>
                            <span>&middot;</span>
                            <span className="ml-chip ml-chip-info">Doc linked</span>
                          </>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="ml-chip">{counts.total} total</span>
                      {counts.approved > 0 ? (
                        <span className="ml-chip ml-chip-success">{counts.approved} approved</span>
                      ) : null}
                      {counts.pending > 0 ? (
                        <span className="ml-chip ml-chip-warning">{counts.pending} pending</span>
                      ) : null}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
