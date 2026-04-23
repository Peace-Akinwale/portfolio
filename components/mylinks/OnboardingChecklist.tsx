import Link from 'next/link';

export interface ChecklistState {
  hasProject: boolean;
  hasCrawledPage: boolean;
  hasArticle: boolean;
  hasApprovedSuggestion: boolean;
  hasExported: boolean;
  firstProjectId: string | null;
  firstArticleId: string | null;
}

export function OnboardingChecklist({ state }: { state: ChecklistState }) {
  const total = 5;
  const completed = [
    state.hasProject,
    state.hasCrawledPage,
    state.hasArticle,
    state.hasApprovedSuggestion,
    state.hasExported,
  ].filter(Boolean).length;

  if (completed === total) return null;

  const items: Array<{
    label: string;
    done: boolean;
    cta?: { href: string; text: string };
  }> = [
    {
      label: 'Create your first project',
      done: state.hasProject,
      cta: state.hasProject
        ? undefined
        : { href: '/projects/mylinks/dashboard', text: 'Use the “New project” button above' },
    },
    {
      label: 'Crawl your sitemap',
      done: state.hasCrawledPage,
      cta:
        state.hasCrawledPage || !state.firstProjectId
          ? undefined
          : {
              href: `/projects/mylinks/projects/${state.firstProjectId}`,
              text: 'Open your project',
            },
    },
    {
      label: 'Add your first article',
      done: state.hasArticle,
      cta:
        state.hasArticle || !state.firstProjectId
          ? undefined
          : {
              href: `/projects/mylinks/projects/${state.firstProjectId}/articles/new`,
              text: 'Paste or link a Google Doc',
            },
    },
    {
      label: 'Approve your first link suggestion',
      done: state.hasApprovedSuggestion,
      cta:
        state.hasApprovedSuggestion || !state.firstArticleId
          ? undefined
          : {
              href: `/projects/mylinks/articles/${state.firstArticleId}`,
              text: 'Open your article and generate suggestions',
            },
    },
    {
      label: 'Export or send to Google Doc',
      done: state.hasExported,
      cta:
        state.hasExported || !state.firstArticleId
          ? undefined
          : {
              href: `/projects/mylinks/articles/${state.firstArticleId}`,
              text: 'Finish the review and export',
            },
    },
  ];

  return (
    <section
      className="ml-surface mb-6 p-5"
      style={{ background: 'var(--ml-bg-elevated)' }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">Get started</h2>
          <p className="text-xs" style={{ color: 'var(--ml-text-muted)' }}>
            {completed} of {total} complete
          </p>
        </div>
        <div
          className="h-1.5 w-32 overflow-hidden rounded-full"
          style={{ background: 'var(--ml-bg-subtle)' }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${(completed / total) * 100}%`,
              background: 'var(--ml-accent)',
            }}
          />
        </div>
      </div>
      <ol className="mt-4 space-y-2">
        {items.map((item, idx) => (
          <li
            key={idx}
            className="flex items-start gap-3 rounded-md px-3 py-2"
            style={{ background: item.done ? 'transparent' : 'var(--ml-bg-subtle)' }}
          >
            <span
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
              style={{
                background: item.done ? 'var(--ml-accent)' : 'var(--ml-border)',
                color: item.done ? 'var(--ml-accent-fg)' : 'var(--ml-text-muted)',
              }}
            >
              {item.done ? '✓' : idx + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p
                className={`text-sm ${item.done ? 'line-through' : 'font-medium'}`}
                style={{ color: item.done ? 'var(--ml-text-faint)' : 'var(--ml-text)' }}
              >
                {item.label}
              </p>
              {item.cta ? (
                <Link
                  href={item.cta.href}
                  className="mt-1 inline-block text-xs"
                  style={{ color: 'var(--ml-accent)' }}
                >
                  {item.cta.text} →
                </Link>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
