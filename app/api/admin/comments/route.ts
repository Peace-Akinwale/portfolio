import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { COMMENT_ADMIN_COOKIE, isValidCommentAdminSession } from '@/lib/comments/admin';

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Supabase environment variables are missing.');
  }

  return createClient(url, key);
}

async function ensureAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get(COMMENT_ADMIN_COOKIE)?.value;

  if (!isValidCommentAdminSession(session)) {
    return false;
  }

  return true;
}

export async function GET(request: Request) {
  try {
    if (!(await ensureAdmin())) {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'approved';

    const supabase = getSupabaseAdmin();
    let query = supabase
      .from('blog_comments')
      .select('id, post_slug, post_title, parent_id, author_name, author_email, author_url, content, status, created_at')
      .order('created_at', { ascending: false });

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ comments: data ?? [] });
  } catch (error) {
    console.error('[admin/comments][GET]', error);
    return NextResponse.json({ message: 'Failed to load comments.' }, { status: 500 });
  }
}
