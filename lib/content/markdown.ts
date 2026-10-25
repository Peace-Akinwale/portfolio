import { marked } from 'marked';

// Markdown → HTML for the local content. Relative image paths (as written in
// the Notion export) are rewritten to the public folder for that piece, and a
// paragraph that is only an image followed by an italic line becomes a figure
// with a caption, so the prose styles can lay captions out.
export interface RenderOptions {
  imageBase: string; // e.g. "/case-studies/aloud"
}

export function renderMarkdown(md: string, opts: RenderOptions): string {
  let html = marked.parse(md, { async: false, gfm: true }) as string;
  const base = opts.imageBase.replace(/\/$/, '');
  html = html.replace(/src="(?!https?:\/\/|\/|data:)([^"]+)"/g, (_m, p: string) => {
    const file = p.replace(/^(\.\/)?images\/[^/]+\//, '').replace(/^\.\//, '');
    return `src="${base}/${file}"`;
  });
  // <p><img ...></p>\n<p><em>caption</em></p>  →  <figure><img><figcaption>caption</figcaption></figure>
  html = html.replace(
    /<p>(<img [^>]*>)<\/p>\s*<p><em>([\s\S]*?)<\/em><\/p>/g,
    (_m, img: string, cap: string) => `<figure>${img}<figcaption>${cap}</figcaption></figure>`,
  );
  html = html.replace(/<p>(<img [^>]*>)<\/p>/g, (_m, img: string) => `<figure>${img}</figure>`);
  return html;
}

export function plainText(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function wordCount(md: string): number {
  return md.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').split(/\s+/).filter(Boolean).length;
}

export function readingMinutes(md: string): number {
  return Math.max(1, Math.round(wordCount(md) / 200));
}

export function imageRefs(md: string): string[] {
  const out: string[] = [];
  const re = /!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(md))) out.push(m[1]);
  return out;
}

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", apos: "'", nbsp: ' ' };
function decodeEntities(s: string): string {
  return s.replace(/&(#\d+|#x[0-9a-f]+|[a-z]+);/gi, (m, e: string) => {
    if (ENTITIES[e]) return ENTITIES[e];
    if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    return m;
  });
}

// Splits rendered HTML into chapters at each <h3>, so a page can lay sections
// out as numbered chapters. Content before the first <h3> is the intro.
export interface Chapter { id: string; title: string; html: string }
export function splitChapters(html: string): { intro: string; chapters: Chapter[] } {
  const parts = html.split(/<h3[^>]*>([\s\S]*?)<\/h3>/);
  const intro = parts[0].trim();
  const chapters: Chapter[] = [];
  const used = new Set<string>();
  for (let i = 1; i < parts.length; i += 2) {
    const title = decodeEntities(parts[i].replace(/<[^>]+>/g, '').trim());
    let id = title.toLowerCase().replace(/&[a-z#0-9]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || `part-${(i + 1) / 2}`;
    while (used.has(id)) id += '-2';
    used.add(id);
    chapters.push({ id, title, html: (parts[i + 1] ?? '').trim() });
  }
  return { intro, chapters };
}
