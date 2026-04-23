import { NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/mylinks/auth';
import { createServiceClient } from '@/lib/mylinks/supabase/server';

/**
 * Seeds a demo project with fake crawled pages, one article, and pre-generated
 * suggestions so first-time users can explore the review flow without running
 * a real crawl or waiting on AI generation.
 */
export async function POST() {
  const user = await requireAuthenticatedUser();
  const serviceClient = await createServiceClient();

  const { data: project, error: projectError } = await serviceClient
    .from('projects')
    .insert({
      owner_id: user.id,
      name: 'Sample — Acme SaaS',
      domain: 'https://example-acme.test',
      sitemap_url: null,
    })
    .select()
    .single();

  if (projectError || !project) {
    return NextResponse.json(
      { error: projectError?.message ?? 'Failed to create sample project' },
      { status: 500 }
    );
  }

  const pages: Array<{
    url: string;
    title: string;
    h1: string;
    meta_description: string | null;
    h2s: string[] | null;
    page_type: 'blog_post' | 'product' | 'service' | 'landing' | 'homepage' | 'category' | 'about' | 'contact' | 'other';
    priority: number;
  }> = [
    {
      url: 'https://example-acme.test/',
      title: 'Acme SaaS — Run your agency on autopilot',
      h1: 'Acme SaaS',
      meta_description: 'Operations software for lean agencies.',
      h2s: ['Client portals', 'Invoicing', 'Pricing'],
      page_type: 'homepage',
      priority: 90,
    },
    {
      url: 'https://example-acme.test/pricing',
      title: 'Acme SaaS pricing',
      h1: 'Simple pricing',
      meta_description: 'Plans start at $29/month.',
      h2s: null,
      page_type: 'landing',
      priority: 85,
    },
    {
      url: 'https://example-acme.test/features/client-portals',
      title: 'Branded client portals',
      h1: 'Client portals',
      meta_description: 'Give every client a white-label portal.',
      h2s: ['Branding', 'Permissions'],
      page_type: 'product',
      priority: 80,
    },
    {
      url: 'https://example-acme.test/features/invoicing',
      title: 'Agency invoicing',
      h1: 'Invoicing',
      meta_description: 'Send invoices without leaving the dashboard.',
      h2s: null,
      page_type: 'product',
      priority: 78,
    },
    {
      url: 'https://example-acme.test/services/onboarding',
      title: 'Agency onboarding services',
      h1: 'Onboarding services',
      meta_description: 'White-glove migration for new Acme teams.',
      h2s: null,
      page_type: 'service',
      priority: 72,
    },
    {
      url: 'https://example-acme.test/blog/white-label-client-portal',
      title: 'What to look for in a white label client portal',
      h1: 'White label client portal',
      meta_description: 'Six criteria that separate real white label from reskinned dashboards.',
      h2s: ['Branding', 'SSO', 'API access'],
      page_type: 'blog_post',
      priority: 70,
    },
    {
      url: 'https://example-acme.test/blog/productized-service-playbook',
      title: 'The productized service playbook',
      h1: 'Productized service playbook',
      meta_description: 'Turn agency deliverables into repeatable packages.',
      h2s: null,
      page_type: 'blog_post',
      priority: 68,
    },
    {
      url: 'https://example-acme.test/blog/crm-comparison',
      title: 'CRM comparison for service agencies',
      h1: 'CRM comparison',
      meta_description: null,
      h2s: null,
      page_type: 'blog_post',
      priority: 60,
    },
    {
      url: 'https://example-acme.test/about',
      title: 'About Acme',
      h1: 'About us',
      meta_description: null,
      h2s: null,
      page_type: 'about',
      priority: 35,
    },
    {
      url: 'https://example-acme.test/contact',
      title: 'Contact Acme',
      h1: 'Contact',
      meta_description: null,
      h2s: null,
      page_type: 'contact',
      priority: 25,
    },
  ];

  const { error: pagesError } = await serviceClient.from('pages').insert(
    pages.map((p) => ({
      project_id: project.id,
      url: p.url,
      title: p.title,
      h1: p.h1,
      meta_description: p.meta_description,
      h2s: p.h2s,
      page_type: p.page_type,
      priority: p.priority,
      word_count: 800,
      status_code: 200,
      published_at: new Date().toISOString(),
      last_crawled_at: new Date().toISOString(),
    }))
  );
  if (pagesError) {
    return NextResponse.json({ error: pagesError.message }, { status: 500 });
  }

  const draft =
    `Best White Label Client Portal Software for Agencies\n\n` +
    `An agency owner in the r/agency subreddit asked what tools others were using for their clients. ` +
    `Most of the replies strung three or more tools together. Someone swore by ClickUp for tasks, Front for tickets, and Everhour for time tracking. ` +
    `Another owner said they had cycled through Asana, Jira, Notion, Linear, and ClickUp and still never found the right project software.\n\n` +
    `We reviewed six white label client portal options agencies are using this year. ` +
    `A real client portal is more than a coat of paint. It has to handle branding, messaging, invoicing, and a feature set built for productized services.\n\n` +
    `Pricing varies wildly. Some plans start at $29 a month; others jump to $2,400 a month for enterprise rollouts. ` +
    `We favour tools that do onboarding well, because that is where most agencies churn.`;

  const { data: article, error: articleError } = await serviceClient
    .from('articles')
    .insert({
      project_id: project.id,
      title: 'Sample — Best white label client portal software',
      source: 'paste',
      google_doc_id: null,
      content_text: draft,
      content_html: null,
      word_count: draft.split(/\s+/).length,
    })
    .select()
    .single();

  if (articleError || !article) {
    return NextResponse.json(
      { error: articleError?.message ?? 'Failed to create sample article' },
      { status: 500 }
    );
  }

  // Helper: find a phrase and return its char range in the draft.
  function findRange(needle: string): { start: number; end: number } | null {
    const idx = draft.indexOf(needle);
    if (idx === -1) return null;
    return { start: idx, end: idx + needle.length };
  }

  const suggestionDefs: Array<{
    anchor: string;
    url: string;
    page_type: 'blog_post' | 'product' | 'service' | 'landing';
    relevance: number;
    confidence: 'low' | 'medium' | 'high';
    justification: string;
  }> = [
    {
      anchor: 'ClickUp',
      url: 'https://example-acme.test/blog/crm-comparison',
      page_type: 'blog_post',
      relevance: 0.78,
      confidence: 'medium',
      justification: 'Readers comparing tools will likely want a direct comparison.',
    },
    {
      anchor: 'time tracking',
      url: 'https://example-acme.test/features/invoicing',
      page_type: 'product',
      relevance: 0.82,
      confidence: 'high',
      justification: 'Invoicing feature includes time tracking — strong commercial fit.',
    },
    {
      anchor: 'project software',
      url: 'https://example-acme.test/features/client-portals',
      page_type: 'product',
      relevance: 0.88,
      confidence: 'high',
      justification: 'Client portal doubles as the project workspace in Acme.',
    },
    {
      anchor: 'white label client portal',
      url: 'https://example-acme.test/blog/white-label-client-portal',
      page_type: 'blog_post',
      relevance: 0.94,
      confidence: 'high',
      justification: 'Dedicated blog post is the canonical read for this phrase.',
    },
    {
      anchor: 'productized services',
      url: 'https://example-acme.test/blog/productized-service-playbook',
      page_type: 'blog_post',
      relevance: 0.9,
      confidence: 'high',
      justification: 'Exact-topic match with the playbook article.',
    },
    {
      anchor: 'onboarding',
      url: 'https://example-acme.test/services/onboarding',
      page_type: 'service',
      relevance: 0.76,
      confidence: 'medium',
      justification: 'Onboarding is a paid service; the mention is a natural hook.',
    },
  ];

  const toInsertSuggestions = suggestionDefs
    .map((s, index) => {
      const range = findRange(s.anchor);
      if (!range) return null;
      return {
        article_id: article.id,
        target_page_id: null,
        target_url: s.url,
        anchor_text: s.anchor,
        anchor_refinement: null,
        page_type: s.page_type,
        relevance_score: s.relevance,
        confidence: s.confidence,
        paragraph_index: 0,
        sentence_index: 0,
        char_start: range.start,
        char_end: range.end,
        justification: s.justification,
        duplicate_flag: false,
        over_optimization_flag: false,
        status: 'pending' as const,
        sort_order: index,
        link_type: 'internal' as const,
        destination_source: 'inventory' as const,
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  if (toInsertSuggestions.length > 0) {
    await serviceClient.from('suggestions').insert(toInsertSuggestions);
  }

  return NextResponse.json({
    project_id: project.id,
    article_id: article.id,
    pages: pages.length,
    suggestions: toInsertSuggestions.length,
  });
}
