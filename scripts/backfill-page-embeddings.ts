import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { existsSync, readFileSync } from 'fs';
import path from 'path';
import {
  batchEmbedTexts,
  buildPageEmbeddingText,
  formatVector,
} from '../lib/mylinks/ai';

type PageRow = {
  id: string;
  url: string;
  title: string | null;
  h1: string | null;
  meta_description: string | null;
  h2s: string[] | null;
};

const PAGE_SIZE = 500;
const EMBED_BATCH_SIZE = 50;

function loadEnvFile(filePath: string) {
  if (!existsSync(filePath)) {
    return;
  }
  const contents = readFileSync(filePath, 'utf8');
  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) {
      continue;
    }
    const [rawKey, ...rawValueParts] = trimmed.split('=');
    const key = rawKey.trim();
    if (!key || process.env[key]) {
      continue;
    }
    const rawValue = rawValueParts.join('=').trim();
    const value =
      (rawValue.startsWith('"') && rawValue.endsWith('"')) ||
      (rawValue.startsWith("'") && rawValue.endsWith("'"))
        ? rawValue.slice(1, -1)
        : rawValue;
    process.env[key] = value;
  }
}

function loadRuntimeEnv() {
  const cwd = process.cwd();
  loadEnvFile(path.join(cwd, '.env'));
  loadEnvFile(path.join(cwd, '.env.local'));
}

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function createAdminClient(): SupabaseClient {
  const url = getRequiredEnv('SUPABASE_URL');
  const key = getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY');
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function fetchPagesMissingEmbedding(
  client: SupabaseClient,
  limit: number
): Promise<PageRow[]> {
  const { data, error } = await client
    .from('pages')
    .select('id, url, title, h1, meta_description, h2s')
    .is('embedding', null)
    .order('id', { ascending: true })
    .limit(limit);
  if (error) {
    throw new Error(`Failed to fetch pages needing embeddings: ${error.message}`);
  }
  return (data ?? []) as PageRow[];
}

async function updateEmbedding(
  client: SupabaseClient,
  id: string,
  embedding: number[]
): Promise<void> {
  const { error } = await client
    .from('pages')
    .update({ embedding: formatVector(embedding) })
    .eq('id', id);
  if (error) {
    throw new Error(`Failed to update embedding for page ${id}: ${error.message}`);
  }
}

async function main(): Promise<void> {
  loadRuntimeEnv();
  getRequiredEnv('OPENAI_API_KEY');
  const dryRun = process.argv.includes('--dry-run');
  const client = createAdminClient();

  let totalProcessed = 0;

  while (true) {
    const rows = await fetchPagesMissingEmbedding(client, PAGE_SIZE);
    if (rows.length === 0) {
      break;
    }
    console.log(`Loaded ${rows.length} pages missing embeddings.`);

    for (let index = 0; index < rows.length; index += EMBED_BATCH_SIZE) {
      const chunk = rows.slice(index, index + EMBED_BATCH_SIZE);
      const texts = chunk.map((row) =>
        buildPageEmbeddingText({
          url: row.url,
          title: row.title,
          h1: row.h1,
          meta_description: row.meta_description,
          h2s: row.h2s,
        })
      );

      if (dryRun) {
        console.log(`(dry-run) would embed ${chunk.length} pages`);
        totalProcessed += chunk.length;
        continue;
      }

      const embeddings = await batchEmbedTexts(texts);
      for (let i = 0; i < chunk.length; i += 1) {
        await updateEmbedding(client, chunk[i].id, embeddings[i]);
      }
      totalProcessed += chunk.length;
      console.log(
        `Embedded ${Math.min(index + EMBED_BATCH_SIZE, rows.length)}/${rows.length} in this page (total: ${totalProcessed})`
      );
    }

    if (rows.length < PAGE_SIZE) {
      break;
    }
  }

  console.log(
    dryRun
      ? `Dry run complete. Would have processed ${totalProcessed} pages.`
      : `Backfill complete. Processed ${totalProcessed} pages.`
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
