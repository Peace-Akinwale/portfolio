import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'External suggestion generation is intentionally disabled in the rebuilt v1.' },
    { status: 410 }
  );
}
