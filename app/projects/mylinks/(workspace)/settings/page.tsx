import Link from 'next/link';
import { requireAuthenticatedUser, requireProfile } from '@/lib/mylinks/auth';
import { createServiceClient } from '@/lib/mylinks/supabase/server';

export default async function SettingsPage() {
  const user = await requireAuthenticatedUser();
  const profile = await requireProfile(user.id);
  const serviceClient = await createServiceClient();
  const { data: tokenRaw } = await serviceClient
    .from('google_tokens')
    .select('scope, expires_at, refresh_issued_at')
    .eq('user_id', user.id)
    .maybeSingle();
  const token = tokenRaw as
    | { scope: string; expires_at: string; refresh_issued_at: string | null }
    | null;
  const refreshAgeDays = token?.refresh_issued_at
    ? (Date.now() - new Date(token.refresh_issued_at).getTime()) / 86_400_000
    : null;
  const nearExpiry = refreshAgeDays !== null && refreshAgeDays >= 5;

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
            Manage your profile, Google Docs connection, and account.
          </p>
        </div>

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

        <div className="rounded-[1.5rem] border border-border bg-background p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Google Docs connection
          </p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Connect your Google account to import Docs and auto-apply approved links. You can disconnect at any time from your Google account settings.
          </p>
          {token ? (
            <div className="mt-3 space-y-1 text-xs text-muted-foreground">
              <p>
                Connected. Access token rotates automatically (next rotation at{' '}
                {new Date(token.expires_at).toLocaleString()}).
              </p>
              {token.refresh_issued_at ? (
                <p>
                  Last connected {new Date(token.refresh_issued_at).toLocaleString()} (
                  {Math.max(0, Math.round(7 - (refreshAgeDays ?? 0)))} days left in the 7-day
                  testing window).
                </p>
              ) : null}
              <p>
                This app is still in Google&rsquo;s OAuth testing mode, so refresh tokens expire
                after 7 days. Reconnect weekly until the app is published.
              </p>
            </div>
          ) : null}
          {nearExpiry ? (
            <div className="mt-4 rounded-[1rem] border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Your Google Docs connection expires soon. Reconnect below to keep re-import and
              auto-apply working.
            </div>
          ) : null}
          <a
            href="/api/mylinks/auth/google"
            className="mt-5 inline-flex rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90"
            style={{ background: 'var(--accent)' }}
          >
            {token ? 'Reconnect Google Docs' : 'Connect Google Docs'}
          </a>
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
