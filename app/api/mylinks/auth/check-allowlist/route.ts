import { NextResponse } from 'next/server';
import { GateNotInstalled, decideListed } from '@/lib/mylinks/allowlist';
import { createServiceClient } from '@/lib/mylinks/supabase/server';

/**
 * Pre-login allowlist probe. The login page asks before any auth call so an
 * email that is not on the list gets a plain message instead of a database
 * error from the sign-up trigger. "Listed" is not a secret here: the branch is
 * visible in the UI anyway.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { email?: string };
  const listed = await decideListed(body.email ?? '', async (email) => {
    const serviceClient = await createServiceClient();
    const { data, error } = await serviceClient.rpc('mylinks_signup_allowed', { p_email: email });
    if (error) {
      // PostgREST answers PGRST202 when the function is not in the schema cache.
      if (error.code === 'PGRST202' || /could not find the function/i.test(error.message)) {
        throw new GateNotInstalled(error.message);
      }
      console.error('[check-allowlist] mylinks_signup_allowed failed:', error.message);
      return false;
    }
    return data === true;
  });
  return NextResponse.json({ listed });
}
