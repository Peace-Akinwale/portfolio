import { NextResponse } from 'next/server';
import { isMylinksAdminEmail, requireAuthenticatedUser } from '@/lib/mylinks/auth';
import { sendMylinksSlackNotification } from '@/lib/mylinks/slack';
import { createServiceClient } from '@/lib/mylinks/supabase/server';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuthenticatedUser();
  if (!isMylinksAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = (await request.json()) as { status?: 'approved' | 'rejected' };
  if (!body.status || !['approved', 'rejected'].includes(body.status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const { id } = await params;
  const serviceClient = await createServiceClient();
  const { data, error } = await serviceClient
    .from('google_access_requests')
    .update({
      status: body.status,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  void sendMylinksSlackNotification('Google access updated', [
    `*Request:* ${id}`,
    `*Status:* ${body.status}`,
    `*Reviewer:* ${user.email || user.id}`,
  ]);

  return NextResponse.json({ request: data });
}
