import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/mylinks/supabase/server';
import {
  batchEmbedTexts,
  buildPageEmbeddingText,
  formatVector,
} from '@/lib/mylinks/ai';
import { discoverAndParseSitemap } from '@/lib/mylinks/sitemap';
import { extractPage } from '@/lib/mylinks/extract';
import { inferPageType } from '@/lib/mylinks/page-type';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const EMBED_PHASE_BUDGET_MS = 25_000;
const CRAWL_PHASE_BUDGET_MS = 30_000;
const EMBED_BATCH_SIZE = 40;
const CRAWL_BATCH_SIZE = 5;
const MAX_CRAWL_URLS_PER_RUN = 40;

type MaintenanceSummary = {
  ok: boolean;
  embedded: number;
  crawled: number;
  crawlFailed: number;
  recrawledProjectId: string | null;
  durationMs: number;
};

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return false;
  }
  const header = request.headers.get('authorization') ?? '';
  return header === `Bearer ${secret}`;
}

async function backfillEmbeddings(
  serviceClient: Awaited<ReturnType<typeof createServiceClient>>,
  deadlineMs: number
): Promise<number> {
  let embedded = 0;

  while (Date.now() < deadlineMs) {
    const { data: rows, error } = await serviceClient
      .from('pages')
      .select('id, url, title, h1, meta_description, h2s')
      .is('embedding', null)
      .order('id', { ascending: true })
      .limit(EMBED_BATCH_SIZE);

    if (error) {
      console.error('[cron] backfill fetch failed:', error.message);
      return embedded;
    }

    if (!rows || rows.length === 0) {
      return embedded;
    }

    const texts = rows.map((row) =>
      buildPageEmbeddingText({
        url: row.url,
        title: row.title,
        h1: row.h1,
        meta_description: row.meta_description,
        h2s: row.h2s,
      })
    );

    let embeddings: number[][];
    try {
      embeddings = await batchEmbedTexts(texts);
    } catch (err) {
      console.error(
        '[cron] embedding batch failed, stopping backfill phase:',
        err instanceof Error ? err.message : err
      );
      return embedded;
    }

    await Promise.all(
      rows.map((row, index) =>
        serviceClient
          .from('pages')
          .update({ embedding: formatVector(embeddings[index]) })
          .eq('id', row.id)
      )
    );

    embedded += rows.length;

    if (rows.length < EMBED_BATCH_SIZE) {
      return embedded;
    }
  }

  return embedded;
}

async function recrawlStalestProject(
  serviceClient: Awaited<ReturnType<typeof createServiceClient>>,
  deadlineMs: number
): Promise<{ projectId: string | null; crawled: number; failed: number }> {
  const { data: staleProject } = await serviceClient
    .from('projects')
    .select('id, domain, sitemap_url')
    .order('updated_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!staleProject) {
    return { projectId: null, crawled: 0, failed: 0 };
  }

  let crawled = 0;
  let failed = 0;

  let urls: string[] = [];
  try {
    const result = await discoverAndParseSitemap(staleProject.domain, staleProject.sitemap_url);
    urls = result.urls;
  } catch (err) {
    console.error(
      '[cron] sitemap discovery failed for project',
      staleProject.id,
      err instanceof Error ? err.message : err
    );
    return { projectId: staleProject.id, crawled, failed };
  }

  if (urls.length === 0) {
    return { projectId: staleProject.id, crawled, failed };
  }

  const { data: stalePages } = await serviceClient
    .from('pages')
    .select('url')
    .eq('project_id', staleProject.id)
    .order('last_crawled_at', { ascending: true, nullsFirst: true })
    .limit(30);

  const staleUrlOrder = (stalePages ?? []).map((row) => row.url);
  const sitemapSet = new Set(urls);
  const knownStaleInSitemap = staleUrlOrder.filter((url) => sitemapSet.has(url));
  const knownStaleSet = new Set(knownStaleInSitemap);
  const freshFromSitemap = urls.filter((url) => !knownStaleSet.has(url));

  const queue = [...knownStaleInSitemap, ...freshFromSitemap].slice(0, MAX_CRAWL_URLS_PER_RUN);

  for (let index = 0; index < queue.length; index += CRAWL_BATCH_SIZE) {
    if (Date.now() >= deadlineMs) {
      break;
    }

    const batch = queue.slice(index, index + CRAWL_BATCH_SIZE);
    const extracted = await Promise.all(
      batch.map(async (url) => ({ url, pageData: await extractPage(url) }))
    );
    const valid = extracted.filter(
      (entry): entry is { url: string; pageData: NonNullable<typeof entry.pageData> } =>
        entry.pageData !== null
    );
    failed += extracted.length - valid.length;

    if (valid.length === 0) {
      continue;
    }

    let embeddings: number[][] | null = null;
    try {
      const texts = valid.map((entry) =>
        buildPageEmbeddingText({
          url: entry.url,
          title: entry.pageData.title,
          h1: entry.pageData.h1,
          meta_description: entry.pageData.metaDescription,
          h2s: entry.pageData.h2s,
        })
      );
      embeddings = await batchEmbedTexts(texts);
    } catch (err) {
      console.error(
        '[cron] crawl-phase embedding failed, upserting without embeddings:',
        err instanceof Error ? err.message : err
      );
      embeddings = null;
    }

    await Promise.all(
      valid.map(async ({ url, pageData }, pageIndex) => {
        const { pageType, priority } = inferPageType(url, pageData.title, pageData.wordCount);
        const embedding = embeddings?.[pageIndex];
        const basePayload = {
          project_id: staleProject.id,
          url,
          title: pageData.title,
          meta_description: pageData.metaDescription,
          h1: pageData.h1,
          h2s: pageData.h2s,
          page_type: pageType,
          priority,
          word_count: pageData.wordCount,
          status_code: pageData.statusCode,
          published_at: pageData.publishedAt,
          last_crawled_at: new Date().toISOString(),
        };
        const payload = embedding
          ? { ...basePayload, embedding: formatVector(embedding) }
          : basePayload;
        await serviceClient.from('pages').upsert(payload);
        crawled += 1;
      })
    );
  }

  await serviceClient
    .from('projects')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', staleProject.id);

  return { projectId: staleProject.id, crawled, failed };
}

async function runMaintenance(): Promise<MaintenanceSummary> {
  const start = Date.now();
  const serviceClient = await createServiceClient();

  const embedDeadline = start + EMBED_PHASE_BUDGET_MS;
  const embedded = await backfillEmbeddings(serviceClient, embedDeadline);

  const crawlDeadline = Date.now() + CRAWL_PHASE_BUDGET_MS;
  const { projectId, crawled, failed } = await recrawlStalestProject(serviceClient, crawlDeadline);

  return {
    ok: true,
    embedded,
    crawled,
    crawlFailed: failed,
    recrawledProjectId: projectId,
    durationMs: Date.now() - start,
  };
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const summary = await runMaintenance();
    return NextResponse.json(summary);
  } catch (err) {
    console.error('[cron] maintenance failed:', err instanceof Error ? err.message : err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
