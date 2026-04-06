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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ articleId: string }> }
) {
  const user = await requireAuthenticatedUser();
  const { articleId } = await params;
  const owned = await getOwnedArticle(articleId, user.id);

  if (!owned) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const body = (await request.json()) as {
    label?: string | null;
    url?: string;
    notes?: string | null;
    targets?: Array<{ label?: string | null; url?: string; notes?: string | null }>;
  };

  const parsedTargets =
    body.targets?.length
      ? body.targets
          .map((target) => ({
            label: target.label?.trim() || null,
            url: target.url?.trim() || '',
            notes: target.notes?.trim() || null,
          }))
          .filter((target) => target.url)
      : body.url?.trim()
        ? [
            {
              label: body.label?.trim() || null,
              url: body.url.trim(),
              notes: body.notes?.trim() || null,
            },
          ]
        : [];

  if (parsedTargets.length === 0) {
    return NextResponse.json({ error: 'At least one url is required' }, { status: 400 });
  }

  const { count } = await owned.serviceClient
    .from('article_link_targets')
    .select('*', { count: 'exact', head: true })
    .eq('article_id', articleId);

  const { data, error } = await owned.serviceClient
    .from('article_link_targets')
    .insert(
      parsedTargets.map((target, index) => ({
        article_id: articleId,
        label: target.label,
        url: target.url,
        notes: target.notes,
        sort_order: (count ?? 0) + index,
      }))
    )
    .select()
    .order('sort_order', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ targets: data, target: data?.[0] ?? null }, { status: 201 });
}
