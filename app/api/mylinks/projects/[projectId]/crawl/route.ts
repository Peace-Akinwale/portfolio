import { createServiceClient } from '@/lib/mylinks/supabase/server';
import { requireAuthenticatedUser } from '@/lib/mylinks/auth';
import { discoverAndParseSitemap } from '@/lib/mylinks/sitemap';
import { extractPage } from '@/lib/mylinks/extract';
import { inferPageType } from '@/lib/mylinks/page-type';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const user = await requireAuthenticatedUser();
  const { projectId } = await params;
  const serviceClient = await createServiceClient();

  const { data: project } = await serviceClient
    .from('projects')
    .select('id, sitemap_url, domain')
    .eq('id', projectId)
    .eq('owner_id', user.id)
    .maybeSingle();

  if (!project) {
    return new Response('Not found', { status: 404 });
  }

  const { data: crawlLog } = await serviceClient
    .from('crawl_logs')
    .insert({ project_id: projectId, status: 'running' })
    .select()
    .single();

  if (!crawlLog) {
    return new Response('Failed to create crawl log', { status: 500 });
  }

  const encoder = new TextEncoder();
  function send(controller: ReadableStreamDefaultController, event: object) {
    controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
  }

  const readable = new ReadableStream({
    async start(controller) {
      try {
        send(controller, { type: 'status', message: 'Discovering sitemap...' });
        const { urls, foundAt } = await discoverAndParseSitemap(project.domain, project.sitemap_url);

        if (urls.length === 0) {
          send(controller, {
            type: 'error',
            message: 'Could not find a sitemap for this domain. Try adding the sitemap URL manually in project settings.',
          });
          await serviceClient
            .from('crawl_logs')
            .update({ status: 'failed', error_message: 'No sitemap found', completed_at: new Date().toISOString() })
            .eq('id', crawlLog.id);
          controller.close();
          return;
        }

        send(controller, { type: 'status', message: `Found sitemap at ${foundAt}` });
        send(controller, { type: 'total', total: urls.length });

        await serviceClient.from('crawl_logs').update({ total_urls: urls.length }).eq('id', crawlLog.id);

        let crawled = 0;
        let failed = 0;
        const batchSize = 10;

        for (let index = 0; index < urls.length; index += batchSize) {
          const batch = urls.slice(index, index + batchSize);

          await Promise.all(
            batch.map(async (url) => {
              const pageData = await extractPage(url);
              if (!pageData) {
                failed += 1;
                return;
              }

              const { pageType, priority } = inferPageType(url, pageData.title, pageData.wordCount);
              await serviceClient.from('pages').upsert({
                project_id: projectId,
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
              });

              crawled += 1;
              send(controller, { type: 'progress', crawled, failed, url });
            })
          );

          await serviceClient
            .from('crawl_logs')
            .update({ crawled_urls: crawled, failed_urls: failed })
            .eq('id', crawlLog.id);
        }

        await serviceClient
          .from('crawl_logs')
          .update({
            status: 'completed',
            crawled_urls: crawled,
            failed_urls: failed,
            completed_at: new Date().toISOString(),
          })
          .eq('id', crawlLog.id);

        send(controller, { type: 'done', crawled, failed });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        send(controller, { type: 'error', message });
        await serviceClient
          .from('crawl_logs')
          .update({ status: 'failed', error_message: message, completed_at: new Date().toISOString() })
          .eq('id', crawlLog.id);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
