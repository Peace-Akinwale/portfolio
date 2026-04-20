import { NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/mylinks/auth';
import { markRead } from '@/lib/mylinks/notifications';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuthenticatedUser();
  const { id } = await params;
  const ok = await markRead(user.id, id);
  return NextResponse.json({ ok });
}
