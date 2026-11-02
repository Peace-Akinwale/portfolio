import { NextResponse } from 'next/server';
import { askAllowlist, decideListed } from '@/lib/mylinks/allowlist';
import { createServiceClient } from '@/lib/mylinks/supabase/server';

/**
 * Pre-login allowlist probe. The login page asks before sending a magic link,
 * so an email that is not on the list gets a plain message. "Listed" is not a
 * secret here: the branch is visible in the UI anyway.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { email?: string };
  const serviceClient = await createServiceClient();
  const listed = await decideListed(body.email ?? '', (email) =>
    askAllowlist(email, (fn, args) => serviceClient.rpc(fn, args))
  );
  return NextResponse.json({ listed });
}
