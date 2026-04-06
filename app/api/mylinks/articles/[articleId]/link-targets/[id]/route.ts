import { NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/mylinks/auth';
import { createServiceClient } from '@/lib/mylinks/supabase/server';

async function ownsTarget(targetId: string, userId: string) {
  const serviceClient = await createServiceClient();
  const { data: target } = await serviceClient
    .from('article_link_targets')
    .select('id, article_id')
    .eq('id', targetId)
    .maybeSingle();

  if (!target) {
    return null;
  }

  const { data: article } = await serviceClient
    .from('articles')
    .select('project_id')
    .eq('id', target.article_id)
    .maybeSingle();

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

  return serviceClient;
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuthenticatedUser();
  const { id } = await params;
  const serviceClient = await ownsTarget(id, user.id);

  if (!serviceClient) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { error } = await serviceClient.from('article_link_targets').delete().eq('id', id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
