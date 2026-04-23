import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireAuthenticatedUser, requireProfile } from '@/lib/mylinks/auth';
import { createServiceClient } from '@/lib/mylinks/supabase/server';

export default async function ConnectGoogleStep() {
  const user = await requireAuthenticatedUser();
  await requireProfile(user.id);

  const serviceClient = await createServiceClient();
  const { data: token } = await serviceClient
    .from('google_tokens')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (token) {
    redirect('/projects/mylinks/dashboard');
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl items-center px-6 py-12">
      <div className="w-full">
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: 'var(--ml-text-faint)' }}
        >
          Step 2 of 2
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Connect Google Docs</h1>
        <p className="mt-3 text-sm" style={{ color: 'var(--ml-text-muted)' }}>
          Optional, but it removes the copy-paste step. You can do this later from Settings.
        </p>

        <div
          className="mt-8 rounded-lg border p-6"
          style={{ borderColor: 'var(--ml-border)', background: 'var(--ml-bg-elevated)' }}
        >
          <h2 className="text-base font-semibold">What you unlock</h2>
          <ul className="mt-4 space-y-3 text-sm" style={{ color: 'var(--ml-text-muted)' }}>
            <li className="flex gap-3">
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                style={{ background: 'var(--ml-accent)', color: 'var(--ml-accent-fg)' }}
              >
                1
              </span>
              <span>
                <strong style={{ color: 'var(--ml-text)' }}>Import drafts with one click.</strong>{' '}
                Paste a Doc URL instead of copying raw text. Headings, bold, images, and existing
                hyperlinks all come through intact.
              </span>
            </li>
            <li className="flex gap-3">
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                style={{ background: 'var(--ml-accent)', color: 'var(--ml-accent-fg)' }}
              >
                2
              </span>
              <span>
                <strong style={{ color: 'var(--ml-text)' }}>
                  Send approved links straight to the Doc.
                </strong>{' '}
                No manual pasting. Review and approve in MyLinks, then one click inserts every
                link into the live document at the exact anchor position.
              </span>
            </li>
            <li className="flex gap-3">
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                style={{ background: 'var(--ml-accent)', color: 'var(--ml-accent-fg)' }}
              >
                3
              </span>
              <span>
                <strong style={{ color: 'var(--ml-text)' }}>Re-import after the author edits.</strong>{' '}
                When the writer revises the draft in Docs, click Re-import and the review session
                updates in place — no manual sync.
              </span>
            </li>
            <li className="flex gap-3">
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                style={{ background: 'var(--ml-accent)', color: 'var(--ml-accent-fg)' }}
              >
                4
              </span>
              <span>
                <strong style={{ color: 'var(--ml-text)' }}>Read-only permission.</strong>{' '}
                MyLinks only asks for the <code className="text-[12px]">documents</code>{' '}
                scope — access to docs you open with it, plus permission to write back the links
                you approve. No access to the rest of your Drive.
              </span>
            </li>
          </ul>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href="/api/mylinks/auth/google"
            className="ml-btn ml-btn-primary"
            style={{ padding: '0.7rem 1.2rem', fontSize: '0.875rem' }}
          >
            Connect Google Docs
          </a>
          <Link
            href="/projects/mylinks/dashboard"
            className="text-sm"
            style={{ color: 'var(--ml-text-muted)' }}
          >
            Skip for now → You can connect anytime from Settings.
          </Link>
        </div>

        <p
          className="mt-6 text-xs"
          style={{ color: 'var(--ml-text-faint)' }}
        >
          Heads up: the app is in Google&rsquo;s testing mode. If you see an{' '}
          <strong>access blocked</strong> screen, the email you&rsquo;re authorizing with
          isn&rsquo;t on the whitelist yet. You can still skip and use the paste workflow.
        </p>
      </div>
    </main>
  );
}
