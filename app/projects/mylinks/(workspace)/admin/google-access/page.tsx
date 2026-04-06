import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AdminGoogleAccessTable } from '@/components/mylinks/AdminGoogleAccessTable';
import { isMylinksAdminEmail, requireAuthenticatedUser, requireProfile } from '@/lib/mylinks/auth';
import { createServiceClient } from '@/lib/mylinks/supabase/server';

export default async function GoogleAccessAdminPage() {
  const user = await requireAuthenticatedUser();
  await requireProfile(user.id);

  if (!isMylinksAdminEmail(user.email)) {
    redirect('/projects/mylinks/dashboard');
  }

  const serviceClient = await createServiceClient();
  const { data: requests } = await serviceClient
    .from('google_access_requests')
    .select('*')
    .order('requested_at', { ascending: false });
  const { data: profiles } = await serviceClient.from('profiles').select('*');

  return (
    <div className="min-h-screen bg-[var(--muted)]/45">
      <nav className="border-b border-border bg-background px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3">
          <Link href="/projects/mylinks/dashboard" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Dashboard
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium text-foreground">Google access approvals</span>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-bold text-foreground">Google access approvals</h1>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          Review beta requests before enabling Google Docs auto-apply for a user.
        </p>

        <AdminGoogleAccessTable initialRequests={requests ?? []} profiles={profiles ?? []} />
      </main>
    </div>
  );
}

