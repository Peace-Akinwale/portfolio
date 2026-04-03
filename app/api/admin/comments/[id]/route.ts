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

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await ensureAdmin())) {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = (await request.json()) as { status?: 'approved' | 'spam' | 'pending' };
    const status = body.status;

    if (!status) {
      return NextResponse.json({ message: 'Missing status.' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('blog_comments')
      .update({ status })
      .eq('id', id)
      .select('id, status')
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true, comment: data });
  } catch (error) {
    console.error('[admin/comments][PATCH]', error);
    return NextResponse.json({ message: 'Failed to update comment.' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await ensureAdmin())) {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    const { id } = await context.params;
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('blog_comments').delete().eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[admin/comments][DELETE]', error);
    return NextResponse.json({ message: 'Failed to delete comment.' }, { status: 500 });
  }
}
