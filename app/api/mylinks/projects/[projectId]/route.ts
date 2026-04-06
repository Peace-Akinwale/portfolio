import { NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/mylinks/auth';
import { createServiceClient } from '@/lib/mylinks/supabase/server';
import { normalizeDomain } from '@/lib/mylinks/utils';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const user = await requireAuthenticatedUser();
  const { projectId } = await params;
  const serviceClient = await createServiceClient();

  const { data, error } = await serviceClient
    .from('projects')
    .select('*, pages(count), articles(count)')
    .eq('id', projectId)
    .eq('owner_id', user.id)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const user = await requireAuthenticatedUser();
  const { projectId } = await params;
  const body = (await request.json()) as {
    name?: string;
    domain?: string;
    sitemap_url?: string | null;
  };

  const updates: Record<string, string | null> = {};
  if (body.name !== undefined) updates.name = body.name.trim();
  if (body.domain !== undefined) updates.domain = normalizeDomain(body.domain);
  if (body.sitemap_url !== undefined) updates.sitemap_url = body.sitemap_url;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
  }

  const serviceClient = await createServiceClient();
  const { data, error } = await serviceClient
    .from('projects')
    .update(updates)
    .eq('id', projectId)
    .eq('owner_id', user.id)
    .select()
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: error?.message || 'Not found' }, { status: error ? 500 : 404 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const user = await requireAuthenticatedUser();
  const { projectId } = await params;
  const serviceClient = await createServiceClient();

  const { error } = await serviceClient
    .from('projects')
    .delete()
    .eq('id', projectId)
    .eq('owner_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
