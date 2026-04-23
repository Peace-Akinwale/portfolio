'use client';

import { useMemo, useState } from 'react';

interface ClientTarget {
  id: string;
  label: string | null;
  url: string;
  notes: string | null;
}

function parseBulkUrls(input: string) {
  return Array.from(
    new Set(
      input
        .split(/[\n,]+/)
        .map((entry) => entry.trim())
        .filter(Boolean)
    )
  );
}

export function ClientTargetsManager({
  articleId,
  initialTargets,
}: {
  articleId: string;
  initialTargets: ClientTarget[];
}) {
  const [targets, setTargets] = useState(initialTargets);
  const [bulkUrls, setBulkUrls] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsedPreview = useMemo(() => parseBulkUrls(bulkUrls), [bulkUrls]);

  async function addTargets(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const urls = parseBulkUrls(bulkUrls);

    if (urls.length === 0) {
      setError('Paste at least one URL.');
      return;
    }

    setLoading(true);
    setError(null);

    // Optimistic insert with temp IDs. On error we reconcile.
    const optimistic: ClientTarget[] = urls.map((url) => ({
      id: `optimistic-${url}`,
      label: null,
      url,
      notes: null,
    }));
    const snapshot = targets;
    setTargets((current) => [...current, ...optimistic]);
    setBulkUrls('');

    try {
      const response = await fetch(`/api/mylinks/articles/${articleId}/link-targets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targets: urls.map((url) => ({ url })) }),
      });
      const payload = (await response.json()) as { error?: string; targets?: ClientTarget[] };
      if (!response.ok || !payload.targets?.length) {
        setError(payload.error ?? 'Failed to add client-approved URLs.');
        setTargets(snapshot);
        return;
      }
      // Swap optimistic rows for real ones.
      const realUrls = new Set(payload.targets.map((t) => t.url));
      setTargets(() => [
        ...snapshot.filter((t) => !realUrls.has(t.url)),
        ...payload.targets!,
      ]);
    } catch {
      setError('Request failed while saving URLs.');
      setTargets(snapshot);
    } finally {
      setLoading(false);
    }
  }

  async function removeTarget(targetId: string) {
    const snapshot = targets;
    setTargets((current) => current.filter((target) => target.id !== targetId));
    try {
      const response = await fetch(
        `/api/mylinks/articles/${articleId}/link-targets/${targetId}`,
        { method: 'DELETE' }
      );
      if (!response.ok) {
        setError('Failed to remove target.');
        setTargets(snapshot);
      }
    } catch {
      setError('Request failed while removing target.');
      setTargets(snapshot);
    }
  }

  return (
    <section className="rounded-[1.5rem] border border-border bg-background p-5 sm:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Client-approved URLs
          </p>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            Paste any URLs the client explicitly wants considered. Separate them with commas or
            line breaks.
          </p>
        </div>
        <div className="rounded-full border border-border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {targets.length} saved
        </div>
      </div>

      {targets.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {targets.map((target) => (
            <div
              key={target.id}
              className="flex max-w-full items-center gap-2 rounded-full border border-border bg-[var(--muted)]/25 px-3 py-2"
            >
              <span className="truncate text-sm text-foreground">{target.url}</span>
              <button
                type="button"
                onClick={() => removeTarget(target.id)}
                className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-5 text-sm text-muted-foreground">No client-approved URLs added yet.</p>
      )}

      <form onSubmit={addTargets} className="mt-5 space-y-4">
        <textarea
          rows={4}
          value={bulkUrls}
          onChange={(event) => setBulkUrls(event.target.value)}
          className="min-h-28 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
          placeholder="https://example.com/pricing, https://example.com/features, https://example.com/demo"
        />

        {parsedPreview.length > 0 ? (
          <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
            {parsedPreview.length} URL{parsedPreview.length === 1 ? '' : 's'} ready to add
          </p>
        ) : null}

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex rounded-full border border-border px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-[var(--muted)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Adding URLs...' : 'Add URLs'}
        </button>
      </form>
    </section>
  );
}
