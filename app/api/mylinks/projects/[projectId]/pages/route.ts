import { NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/mylinks/auth';
import { createServiceClient } from '@/lib/mylinks/supabase/server';
import type { PageType } from '@/lib/mylinks/types/database';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const user = await requireAuthenticatedUser();
  const { projectId } = await params;
  const { searchParams } = new URL(request.url);
  const page = Number.parseInt(searchParams.get('page') ?? '1', 10);
  const limit = Number.parseInt(searchParams.get('limit') ?? '50', 10);
  const pageType = searchParams.get('page_type');
  const offset = (page - 1) * limit;
  const serviceClient = await createServiceClient();

  const { data: project } = await serviceClient
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .eq('owner_id', user.id)
    .maybeSingle();

  if (!project) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  let query = serviceClient
    .from('pages')
    .select('*', { count: 'exact' })
    .eq('project_id', projectId)
    .order('priority', { ascending: false })
    .range(offset, offset + limit - 1);

  if (pageType) {
    query = query.eq('page_type', pageType as PageType);
  }

  const { data, error, count } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, count, page, limit });
}
