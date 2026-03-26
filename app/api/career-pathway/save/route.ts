// app/api/career-pathway/save/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, discoverySource, ageRange, country, answers, results, email } = body;

    if (!answers || !results) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );

    const userAgent = req.headers.get('user-agent') ?? null;

    const { error } = await supabase.from('career_pathway_responses').insert({
      name: name ?? null,
      discovery_source: discoverySource ?? null,
      age_range: ageRange ?? null,
      country: country ?? null,
      answers,
      results,
      email: email ?? null,
      user_agent: userAgent,
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[career-pathway/save]', err);
    return NextResponse.json({ error: 'Failed to save response.' }, { status: 500 });
  }
}
