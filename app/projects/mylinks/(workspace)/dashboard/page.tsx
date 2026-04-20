import Link from 'next/link';
import NewProjectModal from '@/components/mylinks/NewProjectModal';
import UserMenu from '@/components/mylinks/UserMenu';
import { NotificationBell } from '@/components/mylinks/NotificationBell';
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

  return (
    <div className="min-h-screen bg-[var(--muted)]/45">
      <nav className="border-b border-border bg-background px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              MyLinks beta
            </p>
            <h1 className="mt-1 text-xl font-bold text-foreground">Workspace dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            {isMylinksAdminEmail(user.email) ? (
              <Link
                href="/projects/mylinks/admin/google-access"
                className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
              >
                Google approvals
              </Link>
            ) : null}
            <UserMenu email={user.email} />
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Projects</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
              Each project tracks one client domain, its crawl inventory, and the drafts you want to link against it.
            </p>
          </div>
          <NewProjectModal />
        </div>

        {!projects || projects.length === 0 ? (
          <div className="rounded-[1.8rem] border border-dashed border-border bg-background px-8 py-16 text-center">
            <p className="text-lg font-semibold text-foreground">No projects yet.</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Create a project to crawl a client domain and start routing links into drafts.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => {
              const pageCount =
                (project.pages as unknown as { count: number }[])?.[0]?.count ?? 0;
              const articleCount =
                (project.articles as unknown as { count: number }[])?.[0]?.count ?? 0;

              return (
                <Link
                  key={project.id}
                  href={`/projects/mylinks/projects/${project.id}`}
                  className="rounded-[1.5rem] border border-border bg-background p-6 transition-colors hover:border-accent"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Client project
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-foreground">{project.name}</h3>
                  <p className="mt-2 truncate text-sm text-muted-foreground">{project.domain}</p>
                  <div className="mt-6 flex gap-5 text-sm text-muted-foreground">
                    <span>
                      <strong className="text-foreground">{pageCount}</strong> pages
                    </span>
                    <span>
                      <strong className="text-foreground">{articleCount}</strong> articles
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

