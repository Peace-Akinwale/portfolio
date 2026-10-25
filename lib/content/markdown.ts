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
