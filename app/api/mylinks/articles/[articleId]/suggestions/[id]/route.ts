import { NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/mylinks/auth';
import { createServiceClient } from '@/lib/mylinks/supabase/server';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ articleId: string; id: string }> }
) {
  const user = await requireAuthenticatedUser();
  const { id, articleId } = await params;
  const body = (await request.json()) as { status?: 'approved' | 'rejected' | 'pending' };

  if (!body.status || !['approved', 'rejected', 'pending'].includes(body.status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const serviceClient = await createServiceClient();
  const { data: article } = await serviceClient.from('articles').select('project_id').eq('id', articleId).maybeSingle();
  if (!article) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { data: project } = await serviceClient
    .from('projects')
    .select('id')
    .eq('id', article.project_id)
    .eq('owner_id', user.id)
    .maybeSingle();
  if (!project) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const reviewTimestamp = body.status === 'pending' ? null : new Date().toISOString();
  const { data, error } = await serviceClient
    .from('suggestions')
    .update({ status: body.status, reviewed_at: reviewTimestamp })
    .eq('id', id)
    .eq('article_id', articleId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
