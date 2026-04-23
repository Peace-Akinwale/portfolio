'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export function NotificationBell() {
  const [unread, setUnread] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (document.visibilityState !== 'visible') return;
      try {
        const response = await fetch('/api/mylinks/notifications?count=1');
        if (!response.ok) {
          return;
        }
        const data = (await response.json()) as { unread?: number };
        if (!cancelled) {
          setUnread(data.unread ?? 0);
        }
      } catch {
        // Silent — bell is non-critical UI.
      }
    }

    load();
    const interval = window.setInterval(load, 120_000);
    const onVisibility = () => {
      if (document.visibilityState === 'visible') load();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <Link
      href="/projects/mylinks/notifications"
      className="relative inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
      aria-label={`Notifications${unread !== null && unread > 0 ? ` (${unread} unread)` : ''}`}
    >
      <span aria-hidden="true">🔔</span>
      <span>Inbox</span>
      {unread !== null && unread > 0 ? (
        <span
          className="ml-1 inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
          style={{ background: 'var(--accent)' }}
        >
          {unread! > 99 ? '99+' : unread}
        </span>
      ) : null}
    </Link>
  );
}
