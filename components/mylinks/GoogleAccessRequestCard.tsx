'use client';

import { useState } from 'react';

type RequestState = 'none' | 'pending' | 'approved' | 'rejected';

export function GoogleAccessRequestCard({
  initialState,
  notes,
}: {
  initialState: RequestState;
  notes?: string | null;
}) {
  const [state, setState] = useState<RequestState>(initialState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function requestAccess() {
    setLoading(true);
    setMessage(null);

    const response = await fetch('/api/mylinks/google-access/request', {
      method: 'POST',
    });
    const payload = (await response.json()) as { error?: string; ok?: boolean };

    if (!response.ok) {
      setMessage(payload.error ?? 'Failed to submit request.');
      setLoading(false);
      return;
    }

    setState('pending');
    setMessage('Request sent. You will hear from me before Google Docs auto-apply is enabled.');
    setLoading(false);
  }

  const copy =
    state === 'approved'
      ? 'Google Docs auto-apply is enabled for this account.'
      : state === 'pending'
        ? 'Your request is pending manual review. Core workspace features still work.'
        : state === 'rejected'
          ? 'Your previous request was declined. You can ask again after we sort the beta constraints.'
          : 'Paste and export flows are available immediately. Request Google Docs auto-apply when you need it.';

  return (
    <div className="rounded-[1.5rem] border border-border bg-background p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Google Docs Auto-Apply
      </p>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">{copy}</p>
      {notes ? <p className="mt-3 text-sm text-muted-foreground">{notes}</p> : null}
      {message ? <p className="mt-4 text-sm text-muted-foreground">{message}</p> : null}

      {state !== 'approved' ? (
        <button
          type="button"
          disabled={loading || state === 'pending'}
          onClick={requestAccess}
          className="mt-5 inline-flex rounded-full border border-border px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-[var(--muted)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {state === 'pending' ? 'Request pending' : loading ? 'Sending...' : 'Request access'}
        </button>
      ) : null}
    </div>
  );
}
