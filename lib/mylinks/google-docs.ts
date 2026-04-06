import { escapeHtml } from '@/lib/mylinks/rich-text-common';
import { extractGoogleDocId } from '@/lib/mylinks/utils';

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

interface GoogleDoc {
  body?: {
    content?: DocStructuralElement[];
  };
}

interface ParagraphContent {
  text: string;
  html: string;
  newlineDocIndex: number | null;
  docIndices: number[];
  blockTag: string;
  listType: 'ul' | 'ol' | null;
}

export function extractDocContent(doc: GoogleDoc): DocContent {
  const body = doc.body?.content ?? [];
  const paragraphs = body
    .map((element) => extractParagraphContent(element))
    .filter((paragraph): paragraph is ParagraphContent => !!paragraph && !!paragraph.text.trim());

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
    html: html || null,
    charToDocIndex,
    docLength: lastDocIndex + 1,
  };
}

function extractParagraphContent(element: DocStructuralElement): ParagraphContent | null {
  const paragraph = element.paragraph;
  if (!paragraph) {
    return null;
  }

  let paragraphText = '';
  let inlineHtml = '';
  const docIndices: number[] = [];
  let newlineDocIndex: number | null = null;

  for (const segment of paragraph.elements ?? []) {
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

  if (!paragraphText.trim()) {
    return null;
  }

  return {
    text: paragraphText,
    html: inlineHtml,
    newlineDocIndex,
    docIndices,
    blockTag: paragraphTagFromStyle(paragraph.paragraphStyle?.namedStyleType),
    listType: paragraph.bullet ? inferListType(paragraph.bullet.glyph) : null,
  };
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
