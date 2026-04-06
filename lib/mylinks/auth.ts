import { redirect } from 'next/navigation';
import { createClient, createServiceClient } from '@/lib/mylinks/supabase/server';
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

export async function requireAuthenticatedUser() {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect('/projects/mylinks/login');
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

  const request = await getGoogleAccessRequest(userId);
  return request?.status === 'approved';
}

