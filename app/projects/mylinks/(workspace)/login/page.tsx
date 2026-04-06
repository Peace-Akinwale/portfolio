"use client";

import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/mylinks/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    let supabase;
    try {
      supabase = createClient();
    } catch {
      setError('Supabase is not configured correctly for this deployment yet.');
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/projects/mylinks/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
    } else {
      setSent(true);
    }

    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-[2rem] border border-border bg-background p-8 shadow-sm">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            MyLinks beta
          </p>
          <h1 className="mt-3 text-3xl font-bold text-foreground">Enter the workspace</h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Core linking workflows are open in beta. Google Docs auto-apply is reviewed manually after signup.
          </p>
        </div>

        {sent ? (
          <div className="space-y-3">
            <p className="text-lg font-semibold text-foreground">Check your email</p>
            <p className="text-sm text-muted-foreground">
              I sent a magic link to <strong>{email}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Email address
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none transition-colors focus:border-accent"
                placeholder="you@example.com"
              />
            </label>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex rounded-full px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: 'var(--accent)' }}
            >
              {loading ? 'Sending...' : 'Send magic link'}
            </button>
          </form>
        )}

        <div className="mt-8">
          <Link href="/projects/mylinks" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Back to product overview
          </Link>
        </div>
      </div>
    </div>
  );
}

