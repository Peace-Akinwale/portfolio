import { NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/mylinks/auth';
import { createServiceClient } from '@/lib/mylinks/supabase/server';
import { normalizeDomain } from '@/lib/mylinks/utils';

export async function POST(request: Request) {
  const user = await requireAuthenticatedUser();
  const body = (await request.json()) as { name?: string; domain?: string; sitemap_url?: string | null };

  if (!body.name?.trim() || !body.domain?.trim()) {
    return NextResponse.json({ error: 'name and domain are required' }, { status: 400 });
  }

  const serviceClient = await createServiceClient();
  const { data, error } = await serviceClient
    .from('projects')
    .insert({
      owner_id: user.id,
      name: body.name.trim(),
      domain: normalizeDomain(body.domain),
      sitemap_url: body.sitemap_url || null,
    })
    .select()
    .single();

  if (error) {
    const status = error.code === '23505' ? 409 : 500;
    return NextResponse.json({ error: error.code === '23505' ? 'A project for this domain already exists' : error.message }, { status });
  }

  return NextResponse.json(data, { status: 201 });
}
