import { NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/mylinks/auth';
import { createServiceClient } from '@/lib/mylinks/supabase/server';

async function getOwnedArticle(articleId: string, userId: string) {
  const serviceClient = await createServiceClient();
  const { data: article } = await serviceClient.from('articles').select('*').eq('id', articleId).maybeSingle();
  if (!article) return null;
  const { data: project } = await serviceClient
    .from('projects')
    .select('id')
    .eq('id', article.project_id)
    .eq('owner_id', userId)
    .maybeSingle();
  if (!project) return null;
  return { article, serviceClient };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ articleId: string }> }
) {
  const user = await requireAuthenticatedUser();
  const { articleId } = await params;
  const owned = await getOwnedArticle(articleId, user.id);
  if (!owned) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { data, error } = await owned.serviceClient
    .from('suggestions')
    .select('*')
    .eq('article_id', articleId)
    .order('sort_order');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ articleId: string }> }
) {
  const user = await requireAuthenticatedUser();
  const { articleId } = await params;
  const owned = await getOwnedArticle(articleId, user.id);
  if (!owned) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const body = (await request.json()) as { ids?: string[]; status?: 'approved' | 'rejected' | 'pending' };
  if (!Array.isArray(body.ids) || !body.status || !['approved', 'rejected', 'pending'].includes(body.status)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const reviewTimestamp = body.status === 'pending' ? null : new Date().toISOString();
  const { error } = await owned.serviceClient
    .from('suggestions')
    .update({ status: body.status, reviewed_at: reviewTimestamp })
    .eq('article_id', articleId)
    .in('id', body.ids);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ updated: body.ids.length });
}
