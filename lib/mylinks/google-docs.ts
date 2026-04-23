import { escapeHtml } from '@/lib/mylinks/rich-text-common';
import { extractGoogleDocId } from '@/lib/mylinks/utils';
import { refreshAccessToken } from '@/lib/mylinks/google-auth';
import { createServiceClient } from '@/lib/mylinks/supabase/server';

interface DocContent {
  text: string;
  html: string | null;
  /** Map from character offset in plain text to Google Doc index */
  charToDocIndex: Map<number, number>;
  /** Total Google Doc content length */
  docLength: number;
}

interface DocParagraphElement {
  textRun?: {
    content: string;
    textStyle?: {
      bold?: boolean;
      italic?: boolean;
      underline?: boolean;
      strikethrough?: boolean;
      link?: { url?: string };
      [key: string]: unknown;
    };
  };
  inlineObjectElement?: {
    inlineObjectId?: string;
  };
  startIndex?: number;
  endIndex?: number;
}

interface DocParagraph {
  elements?: DocParagraphElement[];
  paragraphStyle?: {
    namedStyleType?: string;
  };
  bullet?: {
    glyph?: string;
  };
}

interface DocStructuralElement {
  paragraph?: DocParagraph;
  startIndex?: number;
  endIndex?: number;
}

interface InlineObject {
  inlineObjectProperties?: {
    embeddedObject?: {
      imageProperties?: {
        contentUri?: string;
        sourceUri?: string;
      };
      size?: {
        width?: { magnitude?: number; unit?: string };
        height?: { magnitude?: number; unit?: string };
      };
      title?: string;
      description?: string;
    };
  };
}

interface GoogleDoc {
  body?: {
    content?: DocStructuralElement[];
  };
  inlineObjects?: Record<string, InlineObject>;
}

interface ParagraphContent {
  text: string;
  html: string;
  newlineDocIndex: number | null;
  docIndices: number[];
  blockTag: string;
  listType: 'ul' | 'ol' | null;
  hasImages: boolean;
}

export function extractDocContent(doc: GoogleDoc): DocContent {
  const body = doc.body?.content ?? [];
  const inlineObjects = doc.inlineObjects ?? {};
  const paragraphs = body
    .map((element) => extractParagraphContent(element, inlineObjects))
    .filter((paragraph): paragraph is ParagraphContent => !!paragraph && (!!paragraph.text.trim() || paragraph.hasImages));

  const charToDocIndex = new Map<number, number>();
  let plainText = '';
  let html = '';
  let cursor = 0;
  let lastDocIndex = 0;
  let openListType: 'ul' | 'ol' | null = null;

  paragraphs.forEach((paragraph, index) => {
    const needsSeparator = plainText.length > 0;
    if (needsSeparator) {
      if (paragraph.newlineDocIndex !== null) {
        charToDocIndex.set(cursor, paragraph.newlineDocIndex);
        lastDocIndex = paragraph.newlineDocIndex;
      }
      plainText += '\n';
      cursor += 1;
    }

    paragraph.docIndices.forEach((docIndex, offset) => {
      charToDocIndex.set(cursor + offset, docIndex);
      lastDocIndex = docIndex;
    });

    plainText += paragraph.text;
    cursor += paragraph.text.length;

    if (paragraph.listType) {
      if (openListType !== paragraph.listType) {
        if (openListType) {
          html += `</${openListType}>`;
        }
        html += `<${paragraph.listType}>`;
        openListType = paragraph.listType;
      }

      html += `<li>${paragraph.html}</li>`;
    } else {
      if (openListType) {
        html += `</${openListType}>`;
        openListType = null;
      }

      html += `<${paragraph.blockTag}>${paragraph.html}</${paragraph.blockTag}>`;
    }

    if (index === paragraphs.length - 1 && paragraph.newlineDocIndex !== null) {
      lastDocIndex = paragraph.newlineDocIndex;
    }
  });

  if (openListType) {
    html += `</${openListType}>`;
  }

  charToDocIndex.set(plainText.length, lastDocIndex + 1);

  return {
    text: plainText,
    html: rescueTrustedIframes(html) || null,
    charToDocIndex,
    docLength: lastDocIndex + 1,
  };
}

const TRUSTED_EMBED_HOSTS = [
  /^https:\/\/(www\.)?youtube\.com\/embed\/[\w-]{6,}/i,
  /^https:\/\/(www\.)?youtube-nocookie\.com\/embed\/[\w-]{6,}/i,
  /^https:\/\/player\.vimeo\.com\/video\/\d+/i,
  /^https:\/\/(www\.)?loom\.com\/embed\/[\w-]+/i,
];

/**
 * When a Google Doc contains pasted iframe HTML as literal text, extractTextRun
 * escape-encodes it (`&lt;iframe ...&gt;`) and the preview shows the raw source.
 * Scan the generated html for these escaped iframes pointing at known video
 * providers and replace them with a safe <iframe> tag (fixed attribute set).
 */
function rescueTrustedIframes(html: string): string {
  if (!html.includes('&lt;iframe')) return html;
  return html.replace(
    /&lt;iframe\b[^&]*?src=(?:&quot;|&#39;)([^&]+?)(?:&quot;|&#39;)[^&]*?&gt;\s*&lt;\/iframe&gt;/gi,
    (match, rawSrc: string) => {
      const src = rawSrc.replace(/&amp;/g, '&');
      if (!TRUSTED_EMBED_HOSTS.some((re) => re.test(src))) return match;
      return `<iframe src="${escapeHtml(src)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
    }
  );
}

function extractParagraphContent(
  element: DocStructuralElement,
  inlineObjects: Record<string, InlineObject>
): ParagraphContent | null {
  const paragraph = element.paragraph;
  if (!paragraph) {
    return null;
  }

  let paragraphText = '';
  let inlineHtml = '';
  const docIndices: number[] = [];
  let newlineDocIndex: number | null = null;
  let hasImages = false;

  for (const segment of paragraph.elements ?? []) {
    if (segment.inlineObjectElement?.inlineObjectId) {
      const imgHtml = buildImageHtml(segment.inlineObjectElement.inlineObjectId, inlineObjects);
      if (imgHtml) {
        inlineHtml += imgHtml;
        hasImages = true;
      }
      continue;
    }

    const content = segment.textRun?.content;
    if (!content) {
      continue;
    }

    const docStart = segment.startIndex ?? 0;
    const { text, html, docIndices: segmentIndices, newlineDocIndex: segmentNewlineIndex } =
      extractTextRun(segment, docStart);

    paragraphText += text;
    inlineHtml += html;
    docIndices.push(...segmentIndices);
    if (segmentNewlineIndex !== null) {
      newlineDocIndex = segmentNewlineIndex;
    }
  }

  if (!paragraphText.trim() && !hasImages) {
    return null;
  }

  return {
    text: paragraphText,
    html: inlineHtml,
    newlineDocIndex,
    docIndices,
    blockTag: paragraphTagFromStyle(paragraph.paragraphStyle?.namedStyleType),
    listType: paragraph.bullet ? inferListType(paragraph.bullet.glyph) : null,
    hasImages,
  };
}

function buildImageHtml(
  inlineObjectId: string,
  inlineObjects: Record<string, InlineObject>
): string | null {
  const obj = inlineObjects[inlineObjectId];
  const embedded = obj?.inlineObjectProperties?.embeddedObject;
  const src = embedded?.imageProperties?.contentUri;
  if (!src) {
    return null;
  }
  const alt = escapeHtml(embedded?.title ?? embedded?.description ?? '');
  const sizeAttrs = buildImageSizeAttrs(embedded?.size);
  return `<img src="${escapeHtml(src)}" alt="${alt}"${sizeAttrs} loading="lazy" referrerpolicy="no-referrer" />`;
}

type EmbeddedSize = NonNullable<
  NonNullable<NonNullable<InlineObject['inlineObjectProperties']>['embeddedObject']>['size']
>;

function buildImageSizeAttrs(size: EmbeddedSize | undefined): string {
  if (!size) return '';
  const toPx = (magnitude?: number, unit?: string) => {
    if (!magnitude) return null;
    if (unit === 'PT') return Math.round(magnitude * 1.3333);
    return Math.round(magnitude);
  };
  const w = toPx(size.width?.magnitude, size.width?.unit);
  const h = toPx(size.height?.magnitude, size.height?.unit);
  const parts: string[] = [];
  if (w) parts.push(` width="${w}"`);
  if (h) parts.push(` height="${h}"`);
  return parts.join('');
}

function extractTextRun(segment: DocParagraphElement, docStart: number) {
  const rawContent = segment.textRun?.content ?? '';
  const style = segment.textRun?.textStyle ?? {};
  let text = '';
  let html = '';
  const docIndices: number[] = [];
  let newlineDocIndex: number | null = null;

  for (let index = 0; index < rawContent.length; index += 1) {
    const char = rawContent[index];
    const docIndex = docStart + index;

    if (char === '\r') {
      continue;
    }

    if (char === '\n') {
      newlineDocIndex = docIndex;
      continue;
    }

    const normalizedChar = char === '\u00a0' ? ' ' : char;
    text += normalizedChar;
    html += escapeHtml(normalizedChar);
    docIndices.push(docIndex);
  }

  return {
    text,
    html: wrapInlineStyles(html, style),
    docIndices,
    newlineDocIndex,
  };
}

function wrapInlineStyles(
  html: string,
  style: NonNullable<DocParagraphElement['textRun']>['textStyle'] = {}
) {
  if (!html) {
    return '';
  }

  let wrapped = html;

  if (style.link?.url) {
    wrapped = `<a href="${escapeHtml(style.link.url)}">${wrapped}</a>`;
  }
  if (style.bold) {
    wrapped = `<strong>${wrapped}</strong>`;
  }
  if (style.italic) {
    wrapped = `<em>${wrapped}</em>`;
  }
  if (style.underline) {
    wrapped = `<u>${wrapped}</u>`;
  }
  if (style.strikethrough) {
    wrapped = `<s>${wrapped}</s>`;
  }

  return wrapped;
}

function paragraphTagFromStyle(style?: string) {
  switch (style) {
    case 'TITLE':
    case 'HEADING_1':
      return 'h1';
    case 'SUBTITLE':
    case 'HEADING_2':
      return 'h2';
    case 'HEADING_3':
      return 'h3';
    case 'HEADING_4':
      return 'h4';
    case 'HEADING_5':
      return 'h5';
    case 'HEADING_6':
      return 'h6';
    default:
      return 'p';
  }
}

function inferListType(glyph?: string): 'ul' | 'ol' {
  return glyph && /^[\dA-Za-z]/.test(glyph) ? 'ol' : 'ul';
}

export interface LinkPatch {
  char_start: number;
  char_end: number;
  url: string;
}

export interface BatchUpdateRequest {
  updateTextStyle: {
    range: { startIndex: number; endIndex: number };
    textStyle: { link: { url: string } };
    fields: string;
  };
}

export function buildBatchUpdateRequests(
  patches: LinkPatch[],
  charToDocIndex: Map<number, number>
): BatchUpdateRequest[] {
  const requests: BatchUpdateRequest[] = [];

  const sorted = [...patches].sort((a, b) => b.char_start - a.char_start);

  for (const patch of sorted) {
    const docStart = charToDocIndex.get(patch.char_start);
    const docEnd = charToDocIndex.get(patch.char_end);

    if (docStart === undefined || docEnd === undefined) {
      continue;
    }

    requests.push({
      updateTextStyle: {
        range: { startIndex: docStart, endIndex: docEnd },
        textStyle: { link: { url: patch.url } },
        fields: 'link',
      },
    });
  }

  return requests;
}

export function extractDocIdFromUrl(input: string): string {
  return extractGoogleDocId(input);
}

async function getValidAccessToken(userId: string): Promise<string> {
  const serviceClient = await createServiceClient();
  const { data: tokenRow } = await serviceClient
    .from('google_tokens')
    .select('*')
    .eq('user_id', userId)
    .order('expires_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!tokenRow) {
    throw new Error('Google account not connected');
  }

  if (new Date(tokenRow.expires_at).getTime() > Date.now() + 60_000) {
    return tokenRow.access_token;
  }

  const refreshed = await refreshAccessToken(tokenRow.refresh_token);
  const newExpiry = new Date(Date.now() + refreshed.expires_in * 1000).toISOString();
  await serviceClient
    .from('google_tokens')
    .update({ access_token: refreshed.access_token, expires_at: newExpiry })
    .eq('user_id', userId);

  return refreshed.access_token;
}

export async function fetchGoogleDocContent(userId: string, docIdOrUrl: string): Promise<DocContent & { docId: string }> {
  const accessToken = await getValidAccessToken(userId);
  const docId = extractDocIdFromUrl(docIdOrUrl);
  const response = await fetch(`https://docs.googleapis.com/v1/documents/${docId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    throw new Error(`Google Docs API error: ${response.status}`);
  }
  const doc = (await response.json()) as GoogleDoc;
  const content = extractDocContent(doc);
  return { ...content, docId };
}
