import { NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/mylinks/auth';
import { createServiceClient } from '@/lib/mylinks/supabase/server';

async function getOwnedArticle(articleId: string, userId: string) {
  const serviceClient = await createServiceClient();
  const { data: article } = await serviceClient.from('articles').select('*').eq('id', articleId).maybeSingle();
  if (!article) {
    return null;
  }

  const { data: project } = await serviceClient
    .from('projects')
    .select('id')
    .eq('id', article.project_id)
    .eq('owner_id', userId)
    .maybeSingle();

  if (!project) {
    return null;
  }

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

  return NextResponse.json(owned.article);
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

  const body = (await request.json()) as { google_doc_id?: string };
  if (!body.google_doc_id?.trim()) {
    return NextResponse.json({ error: 'google_doc_id is required' }, { status: 400 });
  }

  const { data, error } = await owned.serviceClient
    .from('articles')
    .update({ google_doc_id: body.google_doc_id.trim(), source: 'google_doc' })
    .eq('id', articleId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ articleId: string }> }
) {
  const user = await requireAuthenticatedUser();
  const { articleId } = await params;
  const owned = await getOwnedArticle(articleId, user.id);

  if (!owned) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { error } = await owned.serviceClient.from('articles').delete().eq('id', articleId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
