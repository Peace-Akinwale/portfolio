import { NextResponse } from 'next/server';
import { getPosts } from '@/lib/hashnode/client';

export async function GET() {
  try {
    // Fetch posts (Hashnode API max is 50 per request)
    const { posts } = await getPosts(50);

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error in posts API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
