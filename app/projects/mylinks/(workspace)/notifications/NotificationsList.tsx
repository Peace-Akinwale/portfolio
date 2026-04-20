'use client';

import { useState } from 'react';
import type { NotificationRow } from '@/lib/mylinks/notifications';

interface Props {
  initialNotifications: NotificationRow[];
}

export function NotificationsList({ initialNotifications }: Props) {
  const [notifications, setNotifications] = useState(initialNotifications);

  async function handleMarkRead(id: string) {
    const response = await fetch(`/api/mylinks/notifications/${id}/read`, {
      method: 'POST',
    });
    if (!response.ok) {
      return;
    }
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, read_at: new Date().toISOString() }
          : notification
      )
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-border bg-background p-10 text-center">
        <p className="text-sm text-muted-foreground">No notifications yet.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {notifications.map((notification) => {
        const isRead = !!notification.read_at;
        return (
          <li
            key={notification.id}
            className={`rounded-[1.25rem] border border-border p-5 transition-colors ${
              isRead ? 'bg-[var(--muted)]/40' : 'bg-background'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-foreground">{notification.message}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {new Date(notification.created_at).toLocaleString()}
                </p>
              </div>
              {!isRead ? (
                <button
                  type="button"
                  onClick={() => handleMarkRead(notification.id)}
                  className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  Mark read
                </button>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
