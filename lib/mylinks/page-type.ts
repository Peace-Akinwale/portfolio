import type { PageType } from '@/lib/mylinks/types/database';

interface PageTypeResult {
  pageType: PageType;
  priority: number;
}

export function inferPageType(
  url: string,
  _title: string | null,
  wordCount: number
): PageTypeResult {
  const pathname = new URL(url).pathname.toLowerCase();
  const segments = pathname.split('/').filter(Boolean);

  if (pathname === '/' || pathname === '') {
    return { pageType: 'homepage', priority: 100 };
  }

  if (/contact|reach|get-in-touch/.test(pathname)) {
    return { pageType: 'contact', priority: 20 };
  }

  if (/about|team|story|mission|who-we-are/.test(pathname)) {
    return { pageType: 'about', priority: 30 };
  }

  if (
    /\d{4}\/\d{2}\/\d{2}/.test(pathname) ||
    (/\/(blog|post|article|news|resource|guide|learn|insight|tip|tutorial|how-to)\//.test(pathname) &&
      segments.length >= 2)
  ) {
    const priority = wordCount > 800 ? 80 : wordCount > 300 ? 65 : 50;
    return { pageType: 'blog_post', priority };
  }

  if (/\/(blog|category|tag|topics?|resources?|guides?|insights?)\/?$/.test(pathname)) {
    return { pageType: 'category', priority: 60 };
  }

  if (/\/(product|products|shop|store|item|software|platform)\b/.test(pathname)) {
    return { pageType: 'product', priority: 88 };
  }

  if (
    /\/(service|services|solution|solutions|feature|features|offering|industr|plan|package|pric|consulting|agenc|marketing|seo|ppc|social|location|local)\b/.test(
      pathname
    )
  ) {
    return { pageType: 'service', priority: 84 };
  }

  if (segments.length === 1 && wordCount > 200) {
    return { pageType: 'landing', priority: 78 };
  }

  if (segments.length === 2 && wordCount > 300) {
    return { pageType: 'landing', priority: 72 };
  }

  const depthPenalty = Math.min(segments.length * 5, 30);
  const contentBonus = wordCount > 500 ? 10 : 0;
  return { pageType: 'other', priority: Math.max(40 - depthPenalty + contentBonus, 10) };
}
