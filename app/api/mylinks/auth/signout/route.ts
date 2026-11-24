import { NextResponse } from 'next/server';
import { createClient } from '@/lib/mylinks/supabase/server';
import { requestOrigin } from '@/lib/mylinks/routing';

export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  // 303 so the browser follows with a GET; a 307 would re-POST to the login page.
  return NextResponse.redirect(`${requestOrigin(request)}/projects/mylinks/login`, 303);
}

