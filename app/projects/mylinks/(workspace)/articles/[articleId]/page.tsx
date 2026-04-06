import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ClientTargetsManager } from '@/components/mylinks/ClientTargetsManager';
import DeleteArticleButton from '@/components/mylinks/DeleteArticleButton';
import SuggestionReview from '@/components/mylinks/SuggestionReview';
import { canUseGoogleDocs, requireAuthenticatedUser, requireProfile } from '@/lib/mylinks/auth';
import { createServiceClient } from '@/lib/mylinks/supabase/server';

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ articleId: string }>;
}) {
  const user = await requireAuthenticatedUser();
  await requireProfile(user.id);
  const { articleId } = await params;
  const serviceClient = await createServiceClient();

  const { data: article } = await serviceClient
    .from('articles')
    .select('*')
    .eq('id', articleId)
    .maybeSingle();

  if (!article) {
    notFound();
  }

  const [{ data: suggestions }, { data: project }, { data: linkTargets }] = await Promise.all([
    serviceClient.from('suggestions').select('*').eq('article_id', articleId).order('sort_order'),
    serviceClient.from('projects').select('id, name').eq('id', article.project_id).maybeSingle(),
    serviceClient
      .from('article_link_targets')
      .select('*')
      .eq('article_id', articleId)
      .order('sort_order'),
  ]);

  const googleEnabled = await canUseGoogleDocs(user.id, user.email);

  return (
    <div className="min-h-screen bg-[var(--muted)]/45">
      <nav className="border-b border-border bg-background px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3">
          <Link href="/projects/mylinks/dashboard" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Dashboard
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link
            href={`/projects/mylinks/projects/${article.project_id}`}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {project?.name ?? 'Project'}
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="max-w-[40vw] truncate text-sm font-medium text-foreground">{article.title}</span>
          <div className="ml-auto">
            <DeleteArticleButton articleId={article.id} projectId={article.project_id} />
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6">
        <section className="overflow-hidden rounded-[1.5rem] border border-border bg-background">
          <SuggestionReview
            article={article}
            initialSuggestions={suggestions ?? []}
            projectId={article.project_id}
            googleAccessEnabled={googleEnabled}
          />
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
          <ClientTargetsManager articleId={article.id} initialTargets={linkTargets ?? []} />

          <div className="rounded-[1.5rem] border border-border bg-background p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Workflow notes
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
              <li>Generate suggestions after you finish adding client-approved URLs.</li>
              <li>Approve the useful suggestions, then copy or export the linked version.</li>
              <li>Google Docs auto-apply appears only after your access request is approved.</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

