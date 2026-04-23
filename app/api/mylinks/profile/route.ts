import { NextResponse } from 'next/server';
import { sendMylinksSlackNotification } from '@/lib/mylinks/slack';
import { createServiceClient } from '@/lib/mylinks/supabase/server';
import { requireAuthenticatedUser } from '@/lib/mylinks/auth';

export async function POST(request: Request) {
  const user = await requireAuthenticatedUser();
  const body = (await request.json()) as {
    full_name?: string;
    found_via?: string;
  };

  if (!body.full_name?.trim()) {
    return NextResponse.json({ error: 'full_name is required' }, { status: 400 });
  }

  const serviceClient = await createServiceClient();
  const { data, error } = await serviceClient
    .from('profiles')
    .upsert(
      {
        user_id: user.id,
        email: user.email ?? null,
        full_name: body.full_name.trim(),
        found_via: body.found_via?.trim() || null,
      },
      { onConflict: 'user_id' }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  void sendMylinksSlackNotification('Beta signup', [
    `*User:* ${data.full_name || user.email || user.id}`,
    `*Email:* ${data.email || '-'}`,
    `*Found via:* ${data.found_via || '-'}`,
  ]);

  return NextResponse.json({ profile: data });
}
