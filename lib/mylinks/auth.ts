import { cache } from 'react';
import { redirect } from 'next/navigation';
import { createClient, createServiceClient } from '@/lib/mylinks/supabase/server';
import { askAllowlist, decideListed } from '@/lib/mylinks/allowlist';
import type { Database } from '@/lib/mylinks/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];
type AccessRequest = Database['public']['Tables']['google_access_requests']['Row'];

export async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Cached per request: one database call however many helpers ask. */
const isListed = cache(async (email: string) => {
  const serviceClient = await createServiceClient();
  return decideListed(email, (e) => askAllowlist(e, (fn, args) => serviceClient.rpc(fn, args)));
});

/**
 * The MyLinks gate. A session alone is not enough: the Supabase project is
 * shared with Aloud, so the account must also be on the MyLinks list. Anyone
 * else is signed out of this browser and sent to the login page.
 */
export async function requireAuthenticatedUser() {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect('/projects/mylinks/login');
  }

  if (!(await isListed(user.email ?? ''))) {
    const supabase = await createClient();
    await supabase.auth.signOut({ scope: 'local' });
    redirect('/projects/mylinks/login?denied=1');
  }

  return user;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const serviceClient = await createServiceClient();
  const { data } = await serviceClient.from('profiles').select('*').eq('user_id', userId).maybeSingle();
  return data ?? null;
}

export async function requireProfile(userId: string) {
  const profile = await getProfile(userId);
  if (!profile) {
    redirect('/projects/mylinks/onboarding');
  }

  return profile;
}

export function isMylinksAdminEmail(email?: string | null) {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  return !!email && !!adminEmail && email.toLowerCase() === adminEmail;
}

export async function getGoogleAccessRequest(userId: string): Promise<AccessRequest | null> {
  const serviceClient = await createServiceClient();
  const { data } = await serviceClient
    .from('google_access_requests')
    .select('*')
    .eq('user_id', userId)
    .order('requested_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return data ?? null;
}

export async function canUseGoogleDocs(userId: string, email?: string | null) {
  if (isMylinksAdminEmail(email)) {
    return true;
  }

  const serviceClient = await createServiceClient();
  const { data } = await serviceClient
    .from('google_tokens')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();

  return !!data;
}

