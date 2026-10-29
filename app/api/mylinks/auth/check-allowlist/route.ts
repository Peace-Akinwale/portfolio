import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/mylinks/supabase/server';

/**
 * Pre-login allowlist probe. The login page asks before any auth call so an
 * email that is not on the list gets a plain message instead of a database
 * error from the sign-up trigger. The rule itself lives in Postgres
 * (`mylinks_signup_allowed`, migration 20261029_mylinks_signup_allowlist), and
 * the trigger on auth.users calls the same function, so the two cannot drift.
 *
 * "Listed" is not a secret here: the branch is visible in the UI anyway.
 */
export class GateNotInstalled extends Error {}

/**
 * Fails closed on any error, with one exception: when the gate function does
 * not exist yet (migration not applied), there is no trigger either, so the
 * probe answers "listed" and lets Supabase decide, as it did before the gate.
 */
export async function decideListed(
  rawEmail: string,
  ask: (email: string) => Promise<boolean>
): Promise<boolean> {
  const email = rawEmail.trim().toLowerCase();
  if (!email) return false;
  try {
    return (await ask(email)) === true;
  } catch (error) {
    if (error instanceof GateNotInstalled) {
      console.error('[check-allowlist] gate not installed, letting Supabase decide');
      return true;
    }
    return false;
  }
}

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
