import Link from 'next/link';
import { requireAuthenticatedUser, requireProfile } from '@/lib/mylinks/auth';
import { listNotifications } from '@/lib/mylinks/notifications';
import { NotificationsList } from './NotificationsList';

export default async function NotificationsPage() {
  const user = await requireAuthenticatedUser();
  await requireProfile(user.id);
  const notifications = await listNotifications(user.id);

  return (
    <div className="min-h-screen bg-[var(--muted)]/45">
      <nav className="border-b border-border bg-background px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-3">
          <Link href="/projects/mylinks/dashboard" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Dashboard
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium text-foreground">Notifications</span>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl space-y-6 px-4 py-10 sm:px-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            Updates about your Google Docs connection, generated suggestions, and other workspace events.
          </p>
        </div>

        <NotificationsList initialNotifications={notifications} />
      </main>
    </div>
  );
}
