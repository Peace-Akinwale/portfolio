'use client';

import { useEffect, useState } from 'react';

interface AdminComment {
  id: string;
  post_slug: string;
  post_title: string | null;
  parent_id: string | null;
  author_name: string;
  author_email: string;
  author_url: string | null;
  content: string;
  status: string;
  created_at: string;
}

interface CommentsAdminProps {
  initialAuthenticated: boolean;
  hasPassword: boolean;
}

type Filter = 'approved' | 'pending' | 'spam' | 'all';

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function CommentsAdmin({ initialAuthenticated, hasPassword }: CommentsAdminProps) {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [filter, setFilter] = useState<Filter>('approved');
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (!authenticated) return;

    let cancelled = false;

    async function loadComments() {
      setLoading(true);
      setMessage(null);
      try {
        const response = await fetch(`/api/admin/comments?status=${filter}`, { cache: 'no-store' });
        const payload = (await response.json()) as { comments?: AdminComment[]; message?: string };
        if (!response.ok) {
          throw new Error(payload.message || 'Failed to load comments.');
        }
        if (!cancelled) {
          setComments(payload.comments ?? []);
        }
      } catch (error) {
        if (!cancelled) {
          setMessage(error instanceof Error ? error.message : 'Failed to load comments.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadComments();

    return () => {
      cancelled = true;
    };
  }, [authenticated, filter]);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    try {
      const response = await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const payload = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(payload.message || 'Login failed.');
      }
      setAuthenticated(true);
      setPassword('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Login failed.');
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/session', { method: 'DELETE' });
    setAuthenticated(false);
    setComments([]);
    setMessage(null);
  }

  async function updateComment(id: string, action: 'delete' | 'spam' | 'approved') {
    setBusyId(id);
    setMessage(null);

    try {
      if (action === 'delete') {
        const response = await fetch(`/api/admin/comments/${id}`, { method: 'DELETE' });
        const payload = (await response.json()) as { message?: string };
        if (!response.ok) {
          throw new Error(payload.message || 'Delete failed.');
        }
        setComments((current) => current.filter((comment) => comment.id !== id));
        return;
      }

      const response = await fetch(`/api/admin/comments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action }),
      });
      const payload = (await response.json()) as { message?: string; comment?: { status: string } };
      if (!response.ok) {
        throw new Error(payload.message || 'Update failed.');
      }
      setComments((current) =>
        current
          .map((comment) =>
            comment.id === id ? { ...comment, status: payload.comment?.status || action } : comment
          )
          .filter((comment) => (filter === 'all' ? true : comment.status === filter))
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Action failed.');
    } finally {
      setBusyId(null);
    }
  }

  if (!hasPassword) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-4">Comment Admin</h1>
        <p className="text-muted-foreground">
          Set <code>COMMENT_ADMIN_PASSWORD</code> in <code>.env.local</code> to unlock this page.
        </p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="max-w-md mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-4">Comment Admin</h1>
        <p className="text-muted-foreground mb-6">
          Enter your admin password to review and remove comments.
        </p>
        <form onSubmit={handleLogin} className="rounded-[1.5rem] border border-border bg-[var(--muted)]/70 p-6">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition-colors focus:border-accent"
            />
          </label>
          <button
            type="submit"
            className="mt-4 inline-flex items-center justify-center rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90"
            style={{ background: 'var(--accent)' }}
          >
            Unlock
          </button>
        </form>
        {message ? <p className="mt-4 text-sm text-muted-foreground">{message}</p> : null}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold mb-2">Comment Admin</h1>
          <p className="text-muted-foreground">
            Delete junk fast. If spam increases later, we can switch new comments to pending approval.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {(['approved', 'pending', 'spam', 'all'] as Filter[]).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className="rounded-full border border-border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-[var(--muted)]"
              style={filter === value ? { background: 'var(--muted)' } : undefined}
            >
              {value}
            </button>
          ))}
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-[var(--muted)]"
          >
            Log out
          </button>
        </div>
      </div>

      {message ? <p className="mb-4 text-sm text-muted-foreground">{message}</p> : null}

      {loading ? (
        <p className="text-muted-foreground">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-muted-foreground">No comments found for this filter.</p>
      ) : (
        <div className="space-y-5">
          {comments.map((comment) => (
            <article key={comment.id} className="rounded-[1.5rem] border border-border bg-background p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="font-semibold">{comment.author_name}</span>
                    <span className="text-sm text-muted-foreground">{formatDate(comment.created_at)}</span>
                    <span className="rounded-full border border-border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      {comment.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground break-all">{comment.author_email}</p>
                  {comment.author_url ? (
                    <a
                      href={comment.author_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-sm hover:text-accent transition-colors"
                    >
                      {comment.author_url}
                    </a>
                  ) : null}
                  <p className="mt-3 text-sm text-muted-foreground">
                    On <a href={`/${comment.post_slug}`} className="hover:text-accent transition-colors">{comment.post_title || comment.post_slug}</a>
                  </p>
                  {comment.parent_id ? (
                    <p className="text-xs text-muted-foreground mt-1">Reply to comment {comment.parent_id.slice(0, 8)}</p>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={busyId === comment.id}
                    onClick={() => updateComment(comment.id, 'delete')}
                    className="rounded-full border border-border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-[var(--muted)] disabled:opacity-50"
                  >
                    Delete
                  </button>
                  {comment.status !== 'spam' ? (
                    <button
                      type="button"
                      disabled={busyId === comment.id}
                      onClick={() => updateComment(comment.id, 'spam')}
                      className="rounded-full border border-border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-[var(--muted)] disabled:opacity-50"
                    >
                      Spam
                    </button>
                  ) : null}
                  {comment.status !== 'approved' ? (
                    <button
                      type="button"
                      disabled={busyId === comment.id}
                      onClick={() => updateComment(comment.id, 'approved')}
                      className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                      style={{ background: 'var(--accent)' }}
                    >
                      Approve
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-[var(--muted)]/70 px-4 py-4 text-sm leading-7 whitespace-pre-wrap">
                {comment.content}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
