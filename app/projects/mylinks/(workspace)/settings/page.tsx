import Link from 'next/link';
import { GoogleAccessRequestCard } from '@/components/mylinks/GoogleAccessRequestCard';
import { canUseGoogleDocs, getGoogleAccessRequest, requireAuthenticatedUser, requireProfile } from '@/lib/mylinks/auth';
import { createServiceClient } from '@/lib/mylinks/supabase/server';

export default async function SettingsPage() {
  const user = await requireAuthenticatedUser();
  const profile = await requireProfile(user.id);
  const serviceClient = await createServiceClient();
  const request = await getGoogleAccessRequest(user.id);
  const googleEnabled = await canUseGoogleDocs(user.id, user.email);
  const { data: token } = await serviceClient
    .from('google_tokens')
    .select('scope, expires_at')
    .eq('user_id', user.id)
    .maybeSingle();

  return (
    <div className="min-h-screen bg-[var(--muted)]/45">
      <nav className="border-b border-border bg-background px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-3">
          <Link href="/projects/mylinks/dashboard" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Dashboard
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium text-foreground">Settings</span>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl space-y-6 px-4 py-10 sm:px-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            Manage your beta profile, Google Docs access, and account state.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[1.5rem] border border-border bg-background p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Profile
            </p>
            <p className="mt-4 text-sm text-muted-foreground">Name</p>
            <p className="text-lg font-semibold text-foreground">{profile.full_name || user.email}</p>
            <p className="mt-4 text-sm text-muted-foreground">Found via</p>
            <p className="text-sm text-foreground">{profile.found_via || 'Not set'}</p>
            <p className="mt-4 text-sm text-muted-foreground">Email</p>
            <p className="text-sm text-foreground">{user.email}</p>
          </div>

          <GoogleAccessRequestCard
            initialState={request?.status ?? 'none'}
            notes={
              googleEnabled && token
                ? `Connected. Current token expires at ${new Date(token.expires_at).toLocaleString()}.`
                : request?.notes ?? null
            }
          />
        </div>

        <div className="rounded-[1.5rem] border border-border bg-background p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Google Docs connection
          </p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Connect Google only after your Docs auto-apply request is approved. Paste + export flows stay available without Google.
          </p>
          {googleEnabled ? (
            <a
              href="/api/mylinks/auth/google"
              className="mt-5 inline-flex rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90"
              style={{ background: 'var(--accent)' }}
            >
              {token ? 'Reconnect Google Docs' : 'Connect Google Docs'}
            </a>
          ) : null}
        </div>

        <div className="rounded-[1.5rem] border border-border bg-background p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Account
          </p>
          <form action="/api/mylinks/auth/signout" method="POST" className="mt-5">
            <button className="text-sm font-semibold text-red-600 transition-colors hover:text-red-700">
              Sign out
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

