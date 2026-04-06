import { NextResponse } from 'next/server';
import { createClient } from '@/lib/mylinks/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL('/projects/mylinks/login', request.url));
}

