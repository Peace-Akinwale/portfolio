export const BLOCK_TAG_NAMES = new Set([
  'p',
  'div',
  'section',
  'article',
  'header',
  'footer',
  'aside',
  'main',
  'blockquote',
  'pre',
  'li',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
]);

export const HEADING_TAG_NAMES = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
export const LIST_TAG_NAMES = new Set(['ul', 'ol']);
export const INLINE_FORMATTING_TAG_NAMES = new Set([
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'code',
  'a',
  'span',
]);

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function normalizeRichTextString(value: string) {
  return value.replace(/\r/g, '').replace(/\u00a0/g, ' ');
}

export function buildBasicRichTextHtml(text: string) {
  const normalized = normalizeRichTextString(text).trim();
  const blocks = normalized
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (blocks.length === 0) {
    return '';
  }

  return blocks
    .map((block) => {
      const lines = block.split('\n').map((line) => line.trimEnd());
      const firstLine = lines[0]?.trim() ?? '';
      const bodyHtml = lines.map((line) => escapeHtml(line)).join('<br>');

      if (/^#{1,6}\s/.test(firstLine)) {
        const level = Math.min(6, firstLine.match(/^#+/)?.[0].length ?? 2);
        const textWithoutHashes = escapeHtml(firstLine.replace(/^#{1,6}\s*/, ''));
        const rest = lines.slice(1).map((line) => escapeHtml(line)).join('<br>');
        return rest
          ? `<h${level}>${textWithoutHashes}</h${level}><p>${rest}</p>`
          : `<h${level}>${textWithoutHashes}</h${level}>`;
      }

      return `<p>${bodyHtml}</p>`;
    })
    .join('');
}
