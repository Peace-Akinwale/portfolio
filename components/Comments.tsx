'use client';

import { useEffect, useMemo, useState } from 'react';

interface CommentAuthor {
  name: string;
  url?: string;
  avatarUrl?: string;
}

interface CommentItem {
  id: string;
  parent: string | null;
  date: string;
  contentHtml: string;
  status?: string;
  author: CommentAuthor;
}

interface CommentsResponse {
  comments: CommentItem[];
  commentsOpen: boolean;
  message?: string;
}

interface CommentsProps {
  postSlug: string;
  postTitle: string;
}

interface FormState {
  authorName: string;
  authorEmail: string;
  authorUrl: string;
  content: string;
}

function formatCommentDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function buildCommentTree(comments: CommentItem[]) {
  const byParent = new Map<string, CommentItem[]>();

  for (const comment of comments) {
    const key = comment.parent ?? 'root';
    const bucket = byParent.get(key) ?? [];
    bucket.push(comment);
    byParent.set(key, bucket);
  }

  return byParent;
}

export function Comments({ postSlug, postTitle }: CommentsProps) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [commentsOpen, setCommentsOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [replyParent, setReplyParent] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    authorName: '',
    authorEmail: '',
    authorUrl: '',
    content: '',
  });

  useEffect(() => {
    let cancelled = false;

    async function loadComments() {
      try {
        setLoading(true);
        const response = await fetch(`/api/comments?postSlug=${encodeURIComponent(postSlug)}`, {
          cache: 'no-store',
        });
        const data = (await response.json()) as CommentsResponse;
        if (!cancelled) {
          setComments(data.comments ?? []);
          setCommentsOpen(data.commentsOpen ?? true);
          if (!response.ok && data.message) {
            setMessage(data.message);
          }
        }
      } catch {
        if (!cancelled) {
          setMessage('Comments could not be loaded right now.');
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
  }, [postSlug]);

  const tree = useMemo(() => buildCommentTree(comments), [comments]);
  const topLevelComments = tree.get('root') ?? [];

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postSlug,
          postTitle,
          parent: replyParent,
          authorName: form.authorName,
          authorEmail: form.authorEmail,
          authorUrl: form.authorUrl,
          content: form.content,
        }),
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        message?: string;
        comment?: CommentItem;
      };

      if (!response.ok) {
        throw new Error(payload.message || 'Your comment could not be submitted.');
      }

      if (payload.comment) {
        setComments((current) => [...current, payload.comment!]);
      }

      setForm({
        authorName: '',
        authorEmail: '',
        authorUrl: '',
        content: '',
      });
      setReplyParent(null);
      setMessage(payload.message || 'Comment submitted.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Your comment could not be submitted.');
    } finally {
      setSubmitting(false);
    }
  }

  function CommentCard({ comment, depth = 0 }: { comment: CommentItem; depth?: number }) {
    const replies = tree.get(comment.id) ?? [];
    const authorLabel = comment.author.name || 'Anonymous';

    return (
      <div className={depth > 0 ? 'mt-5 ml-5 border-l border-border pl-5' : 'mt-6'}>
        <div className="rounded-[1.2rem] border border-border bg-background px-5 py-5">
          <div className="flex items-start gap-4">
            {comment.author.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={comment.author.avatarUrl}
                alt={authorLabel}
                className="h-11 w-11 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-[var(--muted)] text-xs font-bold uppercase tracking-[0.08em]">
                {getInitials(authorLabel) || 'PA'}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                {comment.author.url ? (
                  <a
                    href={comment.author.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold hover:text-accent transition-colors"
                  >
                    {authorLabel}
                  </a>
                ) : (
                  <span className="font-semibold">{authorLabel}</span>
                )}
                <span className="text-sm text-muted-foreground">
                  {formatCommentDate(comment.date)}
                </span>
              </div>

              <div
                className="prose prose-sm mt-3 max-w-none"
                dangerouslySetInnerHTML={{ __html: comment.contentHtml }}
              />

              <button
                type="button"
                onClick={() => setReplyParent(comment.id)}
                className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground hover:text-accent transition-colors"
              >
                Reply
              </button>
            </div>
          </div>
        </div>

        {replies.map((reply) => (
          <CommentCard key={reply.id} comment={reply} depth={depth + 1} />
        ))}
      </div>
    );
  }

  return (
    <section className="mt-16 pt-12 border-t border-border">
      <div className="max-w-3xl">
        <h2 className="text-3xl font-bold mb-3">Comments</h2>
        <p className="text-muted-foreground leading-relaxed mb-8">
          Leave a thought, question, or response. Your email stays private. If you use
          an email linked to Gravatar, your profile image may show automatically.
        </p>

        {commentsOpen ? (
          <form onSubmit={handleSubmit} className="rounded-[1.5rem] border border-border bg-[var(--muted)]/70 p-6 sm:p-7">
            {replyParent ? (
              <div className="mb-5 flex items-center justify-between gap-3 rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em]">
                <span>Replying to another comment</span>
                <button
                  type="button"
                  onClick={() => setReplyParent(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : null}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Full Name
                </span>
                <input
                  value={form.authorName}
                  onChange={(event) => updateField('authorName', event.target.value)}
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition-colors focus:border-accent"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Email
                </span>
                <input
                  type="email"
                  value={form.authorEmail}
                  onChange={(event) => updateField('authorEmail', event.target.value)}
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition-colors focus:border-accent"
                />
              </label>
            </div>

            <label className="mt-4 block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Social Link Or Website
              </span>
              <input
                type="url"
                value={form.authorUrl}
                onChange={(event) => updateField('authorUrl', event.target.value)}
                placeholder="https://linkedin.com/in/yourname"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition-colors focus:border-accent"
              />
            </label>

            <label className="mt-4 block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Comment
              </span>
              <textarea
                value={form.content}
                onChange={(event) => updateField('content', event.target.value)}
                required
                rows={5}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none transition-colors focus:border-accent"
              />
            </label>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Be respectful. Spam and low-effort comments will be deleted.
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ background: 'var(--accent)' }}
              >
                {submitting ? 'Submitting...' : replyParent ? 'Post Reply' : 'Post Comment'}
              </button>
            </div>
          </form>
        ) : (
          <div className="rounded-[1.5rem] border border-border bg-[var(--muted)]/70 p-6 text-muted-foreground">
            Comments are currently closed on this article.
          </div>
        )}

        {message ? (
          <p className="mt-4 text-sm text-muted-foreground">{message}</p>
        ) : null}

        <div className="mt-10">
          {loading ? (
            <p className="text-muted-foreground">Loading comments...</p>
          ) : topLevelComments.length > 0 ? (
            topLevelComments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))
          ) : (
            <p className="text-muted-foreground">No comments yet. Be the first to leave one.</p>
          )}
        </div>
      </div>
    </section>
  );
}
