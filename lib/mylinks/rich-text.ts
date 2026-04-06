import { load } from 'cheerio';
import {
  BLOCK_TAG_NAMES,
  HEADING_TAG_NAMES,
  LIST_TAG_NAMES,
  buildBasicRichTextHtml,
  escapeHtml,
  normalizeRichTextString,
} from '@/lib/mylinks/rich-text-common';

type RichNode = {
  type?: string;
  name?: string;
  data?: string;
  children?: RichNode[];
  attribs?: Record<string, string>;
};

export interface RichTextContent {
  html: string | null;
  text: string;
}

const INLINE_TAGS = new Set([
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'code',
  'a',
  'span',
  'font',
  'sub',
  'sup',
  'mark',
]);

const BLOCK_CONTAINER_TAGS = new Set([
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
  ...HEADING_TAG_NAMES,
]);

export function normalizePlainTextContent(text: string): RichTextContent {
  const normalizedText = normalizeRichTextString(text).trim();

  return {
    html: normalizedText ? buildBasicRichTextHtml(normalizedText) : null,
    text: normalizedText,
  };
}

export function normalizeRichTextHtml(input: string): RichTextContent {
  const source = input.trim();
  if (!source) {
    return { html: null, text: '' };
  }

  const $ = load(`<body>${source}</body>`);
  const html = serializeTopLevelNodes(($('body').get(0)?.children ?? []) as RichNode[]).trim();
  const normalizedHtml = html || null;

  return {
    html: normalizedHtml,
    text: normalizedHtml ? extractPlainTextFromRichHtml(normalizedHtml) : '',
  };
}

export function extractPlainTextFromRichHtml(html: string) {
  const source = html.trim();
  if (!source) {
    return '';
  }

  const $ = load(`<body>${source}</body>`);
  const state = { text: '', lastChar: '' };
  appendPlainTextFromNodes(($('body').get(0)?.children ?? []) as RichNode[], state);

  return state.text.trim();
}

function serializeTopLevelNodes(nodes: RichNode[]) {
  const blocks: string[] = [];
  let inlineBuffer = '';

  for (const node of nodes) {
    if (node.type === 'text' || isInlineTag(node)) {
      inlineBuffer += serializeNode(node);
      continue;
    }

    const html = serializeNode(node);
    if (!html) {
      continue;
    }

    if (inlineBuffer && containsMeaningfulHtml(inlineBuffer)) {
      blocks.push(`<p>${inlineBuffer}</p>`);
      inlineBuffer = '';
    } else {
      inlineBuffer = '';
    }

    blocks.push(html);
  }

  if (inlineBuffer && containsMeaningfulHtml(inlineBuffer)) {
    blocks.push(`<p>${inlineBuffer}</p>`);
  }

  return blocks.join('');
}

function serializeNode(node: RichNode): string {
  if (node.type === 'text') {
    return escapeHtml(normalizeRichTextString(node.data ?? ''));
  }

  if (node.type !== 'tag') {
    return '';
  }

  const tag = node.name?.toLowerCase();
  if (!tag) {
    return '';
  }

  if (tag === 'br') {
    return '<br>';
  }

  if (tag === 'script' || tag === 'style' || tag === 'iframe' || tag === 'object' || tag === 'embed') {
    return '';
  }

  if (tag === 'ul' || tag === 'ol') {
    const items = (node.children ?? [])
      .map((child) => serializeListItem(child))
      .filter(Boolean)
      .join('');

    return items ? `<${tag}>${items}</${tag}>` : '';
  }

  if (tag === 'li') {
    const inner = serializeChildren(node.children ?? []);
    return containsMeaningfulHtml(inner) ? `<li>${inner}</li>` : '';
  }

  if (tag === 'a') {
    const inner = serializeChildren(node.children ?? []);
    if (!containsMeaningfulHtml(inner)) {
      return '';
    }

    const href = sanitizeUrl(node.attribs?.href);
    if (!href) {
      return inner;
    }

    return `<a href="${escapeHtml(href)}">${inner}</a>`;
  }

  if (tag === 'strong' || tag === 'b') {
    return wrapIfMeaningful('strong', serializeChildren(node.children ?? []));
  }

  if (tag === 'em' || tag === 'i') {
    return wrapIfMeaningful('em', serializeChildren(node.children ?? []));
  }

  if (tag === 'u' || tag === 's' || tag === 'code' || tag === 'sub' || tag === 'sup' || tag === 'mark') {
    return wrapIfMeaningful(tag, serializeChildren(node.children ?? []));
  }

  if (tag === 'span' || tag === 'font') {
    const inner = serializeChildren(node.children ?? []);
    return applyStyleWrappers(inner, node.attribs?.style);
  }

  if (BLOCK_CONTAINER_TAGS.has(tag)) {
    const inner = serializeChildren(node.children ?? []);
    if (!containsMeaningfulHtml(inner)) {
      return '';
    }

    if (tag === 'div') {
      return containsBlockHtml(inner) ? inner : `<p>${inner}</p>`;
    }

    return `<${tag}>${inner}</${tag}>`;
  }

  return serializeChildren(node.children ?? []);
}

function serializeListItem(node: RichNode) {
  if (node.type === 'tag' && node.name?.toLowerCase() === 'li') {
    return serializeNode(node);
  }

  const inner = serializeNode(node);
  return containsMeaningfulHtml(inner) ? `<li>${inner}</li>` : '';
}

function serializeChildren(children: RichNode[]) {
  return children.map((child) => serializeNode(child)).join('');
}

function applyStyleWrappers(inner: string, style?: string) {
  if (!containsMeaningfulHtml(inner)) {
    return '';
  }

  let html = inner;
  const normalizedStyle = (style ?? '').toLowerCase();

  if (/\bfont-weight\s*:\s*(bold|[6-9]00)\b/.test(normalizedStyle)) {
    html = `<strong>${html}</strong>`;
  }
  if (/\bfont-style\s*:\s*italic\b/.test(normalizedStyle)) {
    html = `<em>${html}</em>`;
  }
  if (/\btext-decoration[^;]*underline\b/.test(normalizedStyle)) {
    html = `<u>${html}</u>`;
  }
  if (/\btext-decoration[^;]*(line-through|strikethrough)\b/.test(normalizedStyle)) {
    html = `<s>${html}</s>`;
  }

  return html;
}

function wrapIfMeaningful(tag: string, inner: string) {
  return containsMeaningfulHtml(inner) ? `<${tag}>${inner}</${tag}>` : '';
}

function sanitizeUrl(value?: string) {
  const candidate = value?.trim();
  if (!candidate) {
    return null;
  }

  return /^(https?:|mailto:)/i.test(candidate) ? candidate : null;
}

function containsMeaningfulHtml(value: string) {
  return /\S/.test(
    value
      .replace(/<br\s*\/?>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/gi, ' ')
  );
}

function containsBlockHtml(value: string) {
  return /<(p|div|blockquote|pre|h[1-6]|ul|ol|li)\b/i.test(value);
}

function appendPlainTextFromNodes(nodes: RichNode[], state: { text: string; lastChar: string }) {
  for (const node of nodes) {
    appendPlainText(node, state);
  }
}

function appendPlainText(node: RichNode, state: { text: string; lastChar: string }) {
  if (node.type === 'text') {
    appendTextChunk(state, normalizeRichTextString(node.data ?? ''));
    return;
  }

  if (node.type !== 'tag') {
    return;
  }

  const tag = node.name?.toLowerCase();
  if (!tag) {
    return;
  }

  if (tag === 'br') {
    appendVirtualNewline(state);
    return;
  }

  if (isContentBlock(node)) {
    if (state.text && hasMeaningfulText(node)) {
      appendVirtualNewline(state);
    }
  }

  appendPlainTextFromNodes(node.children ?? [], state);
}

function appendTextChunk(state: { text: string; lastChar: string }, chunk: string) {
  if (!chunk) {
    return;
  }

  state.text += chunk;
  state.lastChar = chunk.at(-1) ?? state.lastChar;
}

function appendVirtualNewline(state: { text: string; lastChar: string }) {
  if (!state.text || state.lastChar === '\n') {
    return;
  }

  state.text += '\n';
  state.lastChar = '\n';
}

function hasMeaningfulText(node: RichNode): boolean {
  if (node.type === 'text') {
    return normalizeRichTextString(node.data ?? '').trim().length > 0;
  }

  if (node.type !== 'tag') {
    return false;
  }

  if (node.name?.toLowerCase() === 'br') {
    return true;
  }

  return (node.children ?? []).some((child) => hasMeaningfulText(child));
}

function isInlineTag(node: RichNode) {
  return node.type === 'tag' && !!node.name && INLINE_TAGS.has(node.name.toLowerCase());
}

function isContentBlock(node: RichNode) {
  return node.type === 'tag' && !!node.name && (BLOCK_TAG_NAMES.has(node.name.toLowerCase()) || LIST_TAG_NAMES.has(node.name.toLowerCase()));
}
