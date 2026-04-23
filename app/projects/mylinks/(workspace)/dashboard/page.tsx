import Link from 'next/link';
import NewProjectModal from '@/components/mylinks/NewProjectModal';
import UserMenu from '@/components/mylinks/UserMenu';
import { NotificationBell } from '@/components/mylinks/NotificationBell';
import { OnboardingChecklist, type ChecklistState } from '@/components/mylinks/OnboardingChecklist';
import { SampleDataButton } from '@/components/mylinks/SampleDataButton';
import { isMylinksAdminEmail, requireAuthenticatedUser, requireProfile } from '@/lib/mylinks/auth';
import { createServiceClient } from '@/lib/mylinks/supabase/server';

export default async function DashboardPage() {
  const user = await requireAuthenticatedUser();
  await requireProfile(user.id);

  const serviceClient = await createServiceClient();
  const { data: projects } = await serviceClient
    .from('projects')
    .select('*, pages(count), articles(count)')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });

  // Derive onboarding checklist state — scoped to the current user's projects.
  const firstProject = projects?.[0] ?? null;
  const firstProjectId = firstProject?.id ?? null;
  const projectIds = (projects ?? []).map((p) => p.id);

  const [{ data: firstArticle }, userArticlesRes] = await Promise.all([
    firstProjectId
      ? serviceClient
          .from('articles')
          .select('id')
          .eq('project_id', firstProjectId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    projectIds.length > 0
      ? serviceClient.from('articles').select('id').in('project_id', projectIds)
      : Promise.resolve({ data: [] as { id: string }[] }),
  ]);

  const userArticleIds = ((userArticlesRes.data ?? []) as { id: string }[]).map((a) => a.id);
  let hasApprovedSuggestion = false;
  let hasExported = false;
  if (userArticleIds.length > 0) {
    const [{ data: approvedRow }, { data: appliedRow }] = await Promise.all([
      serviceClient
        .from('suggestions')
        .select('id')
        .in('article_id', userArticleIds)
        .eq('status', 'approved')
        .limit(1)
        .maybeSingle(),
      serviceClient
        .from('suggestions')
        .select('id')
        .in('article_id', userArticleIds)
        .not('applied_at', 'is', null)
        .limit(1)
        .maybeSingle(),
    ]);
    hasApprovedSuggestion = !!approvedRow;
    hasExported = !!appliedRow;
  }

  const hasCrawledPage = (firstProject?.pages as unknown as { count: number }[] | undefined)?.[0]?.count
    ? (firstProject?.pages as unknown as { count: number }[])[0].count > 0
    : false;

  const checklist: ChecklistState = {
    hasProject: !!firstProject,
    hasCrawledPage,
    hasArticle: !!firstArticle,
    hasApprovedSuggestion,
    hasExported,
    firstProjectId,
    firstArticleId: (firstArticle as { id?: string } | null)?.id ?? null,
  };

  const isAdmin = isMylinksAdminEmail(user.email);

  return (
    <>
      <nav
        className="border-b px-4 py-3 sm:px-6"
        style={{ borderColor: 'var(--ml-border)', background: 'var(--ml-bg-elevated)' }}
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <div>
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.14em]"
              style={{ color: 'var(--ml-text-faint)' }}
            >
              MyLinks beta
            </p>
            <h1 className="mt-0.5 text-lg font-semibold">Workspace</h1>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            {isAdmin ? (
              <Link
                href="/projects/mylinks/admin/google-access"
                className="ml-chip ml-chip-info"
              >
                Admin · Access
              </Link>
            ) : null}
            <UserMenu email={user.email} />
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <OnboardingChecklist state={checklist} />

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Projects</h2>
            <p className="mt-1 max-w-2xl text-sm" style={{ color: 'var(--ml-text-muted)' }}>
              A project tracks one client&rsquo;s site, its crawl inventory, and the drafts you
              want to link against it.
            </p>
          </div>
          <NewProjectModal />
        </div>

        {!projects || projects.length === 0 ? (
          <div
            className="ml-surface px-6 py-12 text-center"
            style={{ borderStyle: 'dashed' }}
          >
            <p className="text-base font-semibold">No projects yet.</p>
            <p
              className="mx-auto mt-2 max-w-md text-sm"
              style={{ color: 'var(--ml-text-muted)' }}
            >
              Click <strong>New project</strong> above to add your first client site.
              Follow the checklist to get all the way to exported links in under 10 minutes.
            </p>
            <SampleDataButton />
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => {
              const pageCount =
                (project.pages as unknown as { count: number }[])?.[0]?.count ?? 0;
              const articleCount =
                (project.articles as unknown as { count: number }[])?.[0]?.count ?? 0;

              return (
                <Link
                  key={project.id}
                  href={`/projects/mylinks/projects/${project.id}`}
                  className="ml-card block transition-colors"
                >
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.14em]"
                    style={{ color: 'var(--ml-text-faint)' }}
                  >
                    Client project
                  </p>
                  <h3 className="mt-2 text-base font-semibold">{project.name}</h3>
                  <p
                    className="mt-1 truncate text-xs"
                    style={{ color: 'var(--ml-text-muted)' }}
                  >
                    {project.domain}
                  </p>
                  <div
                    className="mt-4 flex gap-4 text-xs"
                    style={{ color: 'var(--ml-text-muted)' }}
                  >
                    <span>
                      <strong style={{ color: 'var(--ml-text)' }}>{pageCount}</strong> pages
                    </span>
                    <span>
                      <strong style={{ color: 'var(--ml-text)' }}>{articleCount}</strong> articles
                    </span>
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

