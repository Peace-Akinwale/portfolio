'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function ProfileEditor({
  initialFullName,
  initialFoundVia,
  email,
}: {
  initialFullName: string | null;
  initialFoundVia: string | null;
  email: string | undefined;
}) {
  const router = useRouter();
  const [fullName, setFullName] = useState(initialFullName ?? '');
  const [foundVia, setFoundVia] = useState(initialFoundVia ?? '');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  async function save() {
    setLoading(true);
    setError(null);
    const response = await fetch('/api/mylinks/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: fullName, found_via: foundVia }),
    });
    const payload = (await response.json()) as { error?: string };
    if (!response.ok) {
      setError(payload.error ?? 'Failed to save.');
      setLoading(false);
      return;
    }
    setEditing(false);
    setLoading(false);
    setToast('Profile saved.');
    window.setTimeout(() => setToast(null), 2500);
    router.refresh();
  }

  if (!editing) {
    return (
      <div>
        <p className="mt-4 text-sm text-muted-foreground">Name</p>
        <p className="text-lg font-semibold text-foreground">{initialFullName || email || 'Not set'}</p>
        <p className="mt-4 text-sm text-muted-foreground">Found via</p>
        <p className="text-sm text-foreground">{initialFoundVia || 'Not set'}</p>
        <p className="mt-4 text-sm text-muted-foreground">Email</p>
        <p className="text-sm text-foreground">{email}</p>
        {toast ? <p className="mt-3 text-xs text-emerald-700">{toast}</p> : null}
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="mt-5 inline-flex rounded-full border border-border px-5 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-[var(--muted)]"
        >
          Edit profile
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Name
        </span>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none transition-colors focus:border-accent"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Found via <span className="text-muted-foreground/60">(optional)</span>
        </span>
        <input
          value={foundVia}
          onChange={(e) => setFoundVia(e.target.value)}
          className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none transition-colors focus:border-accent"
        />
      </label>
      <p className="text-xs text-muted-foreground">Email: {email} (managed by auth, not editable here)</p>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={save}
          disabled={loading}
          className="inline-flex rounded-full px-5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: 'var(--accent)' }}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          onClick={() => {
            setEditing(false);
            setFullName(initialFullName ?? '');
            setFoundVia(initialFoundVia ?? '');
            setError(null);
          }}
          className="inline-flex rounded-full border border-border px-5 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-[var(--muted)]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
