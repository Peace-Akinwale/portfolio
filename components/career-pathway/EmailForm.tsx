// components/career-pathway/EmailForm.tsx
'use client';
import { useState } from 'react';
import type { ScoredCareer, Answers } from '@/lib/career-pathway/types';

interface Props {
  results: ScoredCareer[];
  moatResults?: ScoredCareer[];
  answers: Answers;
  name?: string;
}

export function EmailForm({ results, moatResults = [], answers, name }: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/career-pathway/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, results, moatResults, answers }),
      });
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <p className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
        Sent. Check your inbox — and take one action within the next 48 hours.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="rounded-md border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent transition w-full sm:max-w-xs"
      />
      <button
        type="submit"
        disabled={status === 'sending'}
        className="px-5 py-2.5 rounded-md text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:opacity-90 disabled:opacity-60 whitespace-nowrap"
        style={{ background: 'var(--accent)' }}
      >
        {status === 'sending' ? 'Sending...' : 'Send my results'}
      </button>
      {status === 'error' && (
        <p className="text-xs text-red-500">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
