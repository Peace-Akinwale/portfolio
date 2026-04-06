'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function ProfileForm({ email }: { email: string | undefined }) {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [foundVia, setFoundVia] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch('/api/mylinks/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        full_name: fullName,
        found_via: foundVia,
      }),
    });

    const payload = (await response.json()) as { error?: string };
    if (!response.ok) {
      setError(payload.error ?? 'Failed to save your profile.');
      setLoading(false);
      return;
    }

    router.push('/projects/mylinks/dashboard');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-[1.75rem] border border-border bg-background p-8 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Account
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{email}</p>
      </div>

      <label className="block">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Your name
        </span>
        <input
          required
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none transition-colors focus:border-accent"
          placeholder="Peace Akinwale"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Where did you find this app?
        </span>
        <input
          required
          value={foundVia}
          onChange={(event) => setFoundVia(event.target.value)}
          className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none transition-colors focus:border-accent"
          placeholder="LinkedIn, referral, X, Google, friend..."
        />
      </label>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex rounded-full px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{ background: 'var(--accent)' }}
      >
        {loading ? 'Saving...' : 'Enter workspace'}
      </button>
    </form>
  );
}

