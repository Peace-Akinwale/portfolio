"use client";

import Link from 'next/link';
import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RichTextEditor } from '@/components/mylinks/RichTextEditor';
import { extractGoogleDocId } from '@/lib/mylinks/utils';

function parseClientTargets(input: string) {
  return input
    .split(/[\n,]+/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((url) => ({ label: null, url, notes: null }));
}

export default function NewArticlePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const router = useRouter();
  const [tab, setTab] = useState<'paste' | 'google_doc'>('paste');
  const [title, setTitle] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const [docId, setDocId] = useState('');
  const [clientTargets, setClientTargets] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    let contentText: string | undefined;
    let contentHtmlToSave: string | null = tab === 'paste' ? contentHtml : null;
    if (tab === 'google_doc') {
      const cleanDocId = extractGoogleDocId(docId);
      const docResponse = await fetch(`/api/mylinks/google/docs/${encodeURIComponent(cleanDocId)}`);
      const docPayload = (await docResponse.json()) as { error?: string; text?: string; html?: string };
      if (!docResponse.ok || !docPayload.text) {
        setError(docPayload.error ?? 'Failed to fetch Google Doc content.');
        setLoading(false);
        return;
      }
      contentText = docPayload.text;
      contentHtmlToSave = docPayload.html ?? null;
    }

    const response = await fetch('/api/mylinks/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        project_id: projectId,
        title,
        source: tab,
        content_text: contentText,
        content_html: contentHtmlToSave,
        google_doc_id: tab === 'google_doc' ? extractGoogleDocId(docId) : null,
        client_targets: parseClientTargets(clientTargets),
      }),
    });

    const payload = (await response.json()) as { error?: string; id?: string };
    if (!response.ok || !payload.id) {
      setError(payload.error ?? 'Failed to create article.');
      setLoading(false);
      return;
    }

    router.push(`/projects/mylinks/articles/${payload.id}`);
  }

  return (
    <div className="min-h-screen bg-[var(--muted)]/45">
      <nav className="border-b border-border bg-background px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-3">
          <Link href="/projects/mylinks/dashboard" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Dashboard
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link
            href={`/projects/mylinks/projects/${projectId}`}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Project
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium text-foreground">Add article</span>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-bold text-foreground">Add article</h1>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          Paste the draft or import it from Google Docs. Add any client-approved URLs that should be considered during suggestion generation.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-[1.75rem] border border-border bg-background p-8">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Article title
            </span>
            <input
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none transition-colors focus:border-accent"
              placeholder="How to improve your internal linking strategy"
            />
          </label>

          <div>
            <div className="mb-4 flex border-b border-border">
              {(['paste', 'google_doc'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setTab(option)}
                  className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                    tab === option
                      ? 'border-foreground text-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {option === 'paste' ? 'Paste text' : 'Google Doc'}
                </button>
              ))}
            </div>

            {tab === 'paste' ? (
              <div className="space-y-3">
                <RichTextEditor
                  value={contentHtml}
                  onChange={setContentHtml}
                  placeholder="Paste the article draft here. Headings, bold, italics, links, and lists are preserved where possible."
                />
                <p className="text-sm text-muted-foreground">
                  Paste directly from Docs, Word, or another editor to keep headings, bold text, links, and list structure.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  required
                  value={docId}
                  onChange={(event) => setDocId(event.target.value)}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none transition-colors focus:border-accent"
                  placeholder="Paste the Google Doc URL or document ID"
                />
                <p className="text-sm text-muted-foreground">
                  Google Docs import requires an approved Google connection in settings.
                </p>
              </div>
            )}
          </div>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Client-approved destination URLs
            </span>
            <textarea
              rows={4}
              value={clientTargets}
              onChange={(event) => setClientTargets(event.target.value)}
              className="min-h-28 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
              placeholder="Paste URLs separated by commas or line breaks."
            />
          </label>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/projects/mylinks/projects/${projectId}`}
              className="inline-flex rounded-full border border-border px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-[var(--muted)]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex rounded-full px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: 'var(--accent)' }}
            >
              {loading ? 'Creating...' : 'Create article'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

