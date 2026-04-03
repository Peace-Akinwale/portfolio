import { createHash } from 'crypto';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

interface CommentRow {
  id: string;
  post_slug: string;
  post_title: string | null;
  parent_id: string | null;
  author_name: string;
  author_email: string;
  author_url: string | null;
  content: string;
  status: string;
  created_at: string;
}

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Supabase environment variables are missing.');
  }

  return createClient(url, key);
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getAvatarUrl(email: string) {
  const hash = createHash('md5').update(email.trim().toLowerCase()).digest('hex');
  return `https://www.gravatar.com/avatar/${hash}?d=mp&s=96`;
}

function normalizeRow(row: CommentRow) {
  return {
    id: row.id,
    parent: row.parent_id,
    date: row.created_at,
    status: row.status,
    contentHtml: `<p>${escapeHtml(row.content).replace(/\n/g, '<br />')}</p>`,
    author: {
      name: row.author_name,
      url: row.author_url || '',
      avatarUrl: getAvatarUrl(row.author_email),
    },
  };
}

async function sendEmails(params: {
  postTitle: string;
  postSlug: string;
  authorName: string;
  authorEmail: string;
  authorUrl?: string | null;
  content: string;
  parentComment?: CommentRow | null;
}) {
  if (!RESEND_API_KEY) {
    return;
  }

  const resend = new Resend(RESEND_API_KEY);
  const postUrl = `https://peaceakinwale.com/${params.postSlug}`;

  if (ADMIN_EMAIL) {
    await resend.emails.send({
      from: 'Peace Akinwale <onboarding@resend.dev>',
      to: ADMIN_EMAIL,
      subject: params.parentComment
        ? `New reply on "${params.postTitle}"`
        : `New comment on "${params.postTitle}"`,
      text: [
        `Post: ${params.postTitle}`,
        `URL: ${postUrl}`,
        `Name: ${params.authorName}`,
        `Email: ${params.authorEmail}`,
        params.authorUrl ? `Website: ${params.authorUrl}` : null,
        '',
        params.content,
      ]
        .filter(Boolean)
        .join('\n'),
    });
  }

  if (
    params.parentComment?.author_email &&
    params.parentComment.author_email !== params.authorEmail
  ) {
    await resend.emails.send({
      from: 'Peace Akinwale <onboarding@resend.dev>',
      to: params.parentComment.author_email,
      subject: `Someone replied to your comment on "${params.postTitle}"`,
      text: [
        `${params.authorName} replied to your comment on "${params.postTitle}".`,
        '',
        params.content,
        '',
        `Read the discussion: ${postUrl}`,
      ].join('\n'),
    });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postSlug = searchParams.get('postSlug');

    if (!postSlug) {
      return NextResponse.json({ message: 'Missing postSlug.' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('blog_comments')
      .select('id, post_slug, post_title, parent_id, author_name, author_email, author_url, content, status, created_at')
      .eq('post_slug', postSlug)
      .eq('status', 'approved')
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      comments: (data ?? []).map((row) => normalizeRow(row as CommentRow)),
      commentsOpen: true,
    });
  } catch (error) {
    console.error('[comments][GET]', error);
    return NextResponse.json(
      { comments: [], commentsOpen: true, message: 'Failed to load comments.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      postSlug?: string;
      postTitle?: string;
      parent?: string | null;
      authorName?: string;
      authorEmail?: string;
      authorUrl?: string;
      content?: string;
    };

    const postSlug = body.postSlug?.trim();
    const postTitle = body.postTitle?.trim() || 'Untitled post';
    const parent = body.parent?.trim() || null;
    const authorName = body.authorName?.trim();
    const authorEmail = body.authorEmail?.trim();
    const authorUrl = body.authorUrl?.trim() || null;
    const content = body.content?.trim();

    if (!postSlug || !authorName || !authorEmail || !content) {
      return NextResponse.json(
        { message: 'Name, email, and comment are required.' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    let parentComment: CommentRow | null = null;
    if (parent) {
      const { data } = await supabase
        .from('blog_comments')
        .select('id, post_slug, post_title, parent_id, author_name, author_email, author_url, content, status, created_at')
        .eq('id', parent)
        .maybeSingle();
      parentComment = (data as CommentRow | null) ?? null;
    }

    const { data, error } = await supabase
      .from('blog_comments')
      .insert({
        post_slug: postSlug,
        post_title: postTitle,
        parent_id: parent,
        author_name: authorName,
        author_email: authorEmail,
        author_url: authorUrl,
        content,
        status: 'approved',
      })
      .select('id, post_slug, post_title, parent_id, author_name, author_email, author_url, content, status, created_at')
      .single();

    if (error) {
      throw error;
    }

    const row = data as CommentRow;

    void sendEmails({
      postTitle,
      postSlug,
      authorName,
      authorEmail,
      authorUrl,
      content,
      parentComment,
    }).catch((error) => {
      console.error('[comments][notify]', error);
    });

    return NextResponse.json({
      ok: true,
      comment: normalizeRow(row),
      message: 'Comment posted successfully.',
    });
  } catch (error) {
    console.error('[comments][POST]', error);
    return NextResponse.json(
      { message: 'Comment submission failed.' },
      { status: 500 }
    );
  }
}
