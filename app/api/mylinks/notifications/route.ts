import { NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/mylinks/auth';
import { countUnread, listNotifications } from '@/lib/mylinks/notifications';

export async function GET(request: Request) {
  const user = await requireAuthenticatedUser();
  const url = new URL(request.url);
  const countOnly = url.searchParams.get('count') === '1';

  if (countOnly) {
    const unread = await countUnread(user.id);
    return NextResponse.json({ unread });
  }

  const notifications = await listNotifications(user.id);
  return NextResponse.json({ notifications });
}
