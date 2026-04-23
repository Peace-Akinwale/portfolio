'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function SampleDataButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function seed() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/mylinks/sample-data', { method: 'POST' });
      const payload = (await response.json()) as {
        error?: string;
        article_id?: string;
      };
      if (!response.ok || !payload.article_id) {
        setError(payload.error ?? 'Failed to seed sample data.');
        return;
      }
      router.push(`/projects/mylinks/articles/${payload.article_id}`);
    } catch {
      setError('Request failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={seed}
        disabled={loading}
        className="ml-btn ml-btn-sm"
      >
        {loading ? 'Seeding demo…' : 'Try with sample data'}
      </button>
      <p
        className="mt-2 text-xs"
        style={{ color: 'var(--ml-text-faint)' }}
      >
        Creates a demo project with 10 fake pages + an article with pre-generated suggestions so
        you can explore the review flow. Delete it any time.
      </p>
      {error ? (
        <p className="mt-2 text-xs" style={{ color: 'var(--ml-danger)' }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
