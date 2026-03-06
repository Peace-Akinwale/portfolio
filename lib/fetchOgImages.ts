import { getOgImage } from '@/lib/ogImage';
import type { ParsedPortfolio } from '@/lib/hashnode/parsePortfolio';

export async function fetchOgImagesForPortfolio(
  parsed: ParsedPortfolio
): Promise<Record<string, string | null>> {
  const links = parsed.sections
    .flatMap((s) => s.projects)
    .map((p) => p.link)
    .filter((link): link is string => !!link);

  const unique = [...new Set(links)];
  const results = await Promise.all(unique.map((url) => getOgImage(url)));

  const map: Record<string, string | null> = {};
  unique.forEach((url, i) => {
    map[url] = results[i];
  });
  return map;
}
