import { marked } from 'marked';
import * as cheerio from 'cheerio';
import { BLOCK_TAG_NAMES, LIST_TAG_NAMES, normalizeRichTextString } from './rich-text-common';

type SuggestionShape = {
  id: string;
  anchor_text: string;
  target_url: string;
  char_start: number;
  char_end: number;
  status: 'pending' | 'approved' | 'rejected';
};

type NormalizedSuggestion = SuggestionShape & {
  char_start: number;
  char_end: number;
};

const HEADING_PATTERNS = [/^#{1,6}\s/, /^\d+\.\s+[A-Z]/, /^[A-Z][A-Z0-9\s/&:'"-]{3,}$/];

export function computeHeadingRanges(text: string) {
  const ranges: Array<{ start: number; end: number }> = [];
  let cursor = 0;

  for (const line of text.split('\n')) {
    const start = cursor;
    const end = cursor + line.length;
    const trimmed = line.trim();
    const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
    const looksLikeHeading =
      trimmed.length > 0 &&
      (HEADING_PATTERNS.some((pattern) => pattern.test(trimmed)) ||
        (trimmed.length <= 90 &&
          wordCount <= 12 &&
          !/[.!?]$/.test(trimmed) &&
          /^[A-Z0-9"'(]/.test(trimmed)));

    if (looksLikeHeading) {
      ranges.push({ start, end });
    }

    cursor = end + 1;
  }

  return ranges;
}

export function isRangeInsideHeading(text: string, start: number, end: number) {
  return computeHeadingRanges(text).some((range) => start < range.end && end > range.start);
}

function findNonHeadingMatch(text: string, anchorText: string) {
  let searchFrom = 0;
  while (searchFrom < text.length) {
    const index = text.indexOf(anchorText, searchFrom);
    if (index === -1) {
      return null;
    }

    const end = index + anchorText.length;
    if (!isRangeInsideHeading(text, index, end)) {
      return { start: index, end };
    }
    searchFrom = end;
  }

  return null;
}

export function normalizeSuggestions(text: string, suggestions: SuggestionShape[]): NormalizedSuggestion[] {
  return suggestions
    .map((suggestion) => {
      const slice = text.slice(suggestion.char_start, suggestion.char_end);
      if (slice === suggestion.anchor_text && !isRangeInsideHeading(text, suggestion.char_start, suggestion.char_end)) {
        return suggestion;
      }

      const fallback = findNonHeadingMatch(text, suggestion.anchor_text);
      if (!fallback) {
        return null;
      }

      return {
        ...suggestion,
        char_start: fallback.start,
        char_end: fallback.end,
      };
    })
    .filter((suggestion): suggestion is NormalizedSuggestion => !!suggestion)
    .sort((a, b) => b.char_start - a.char_start);
}

export function buildHighlightedDraftHtml(
  text: string,
  suggestions: SuggestionShape[],
  activeId: string | null
) {
  const normalized = normalizeSuggestions(text, suggestions);
  let result = text;

  for (const suggestion of normalized) {
    const before = result.slice(0, suggestion.char_start);
    const anchor = result.slice(suggestion.char_start, suggestion.char_end);
    const after = result.slice(suggestion.char_end);
    let colorClass = 'bg-yellow-100 text-yellow-900 border-b-2 border-yellow-400';

    if (suggestion.status === 'approved') {
      colorClass = 'bg-green-100 text-green-900 border-b-2 border-green-400';
    }
    if (suggestion.status === 'rejected') {
      colorClass = 'bg-gray-100 text-gray-500 line-through';
    }
    if (suggestion.id === activeId) {
      colorClass += ' outline outline-2 outline-blue-400 rounded-sm';
    }

    const mark = `<mark class="${colorClass} px-0.5 rounded-sm" data-suggestion-id="${suggestion.id}">${anchor}</mark>`;
    result = before + mark + after;
  }

  return marked.parse(result, { breaks: true }) as string;
}

export function buildLinkedHtml(text: string, suggestions: SuggestionShape[]) {
  const normalized = normalizeSuggestions(
    text,
    suggestions.filter((suggestion) => suggestion.status === 'approved')
  );

  let result = text;
  for (const suggestion of normalized) {
    const before = result.slice(0, suggestion.char_start);
    const anchor = result.slice(suggestion.char_start, suggestion.char_end);
    const after = result.slice(suggestion.char_end);
    result = before + `<a href="${escapeAttr(suggestion.target_url)}">${anchor}</a>` + after;
  }

  return marked.parse(result, { breaks: true }) as string;
}

export function buildLinkedText(text: string, suggestions: SuggestionShape[]) {
  const normalized = normalizeSuggestions(
    text,
    suggestions.filter((suggestion) => suggestion.status === 'approved')
  );

  let result = text;
  for (const suggestion of normalized) {
    const before = result.slice(0, suggestion.char_start);
    const anchor = result.slice(suggestion.char_start, suggestion.char_end);
    const after = result.slice(suggestion.char_end);
    result = before + `${anchor} (${suggestion.target_url})` + after;
  }

  return result;
}

function escapeAttr(value: string) {
  return value.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export interface ExistingLinkRange {
  start: number;
  end: number;
  url: string;
  anchor_text: string;
}

/**
 * Extracts existing <a href> ranges from content_html, mapping them to char offsets
 * in content_text. The walk mirrors rich-text-client.ts::walkNode so offsets align
 * with what the suggestion engine sees.
 */
export function extractExistingLinkRanges(
  contentHtml: string | null,
  contentText: string
): ExistingLinkRange[] {
  if (!contentHtml?.trim()) return [];

  const $ = cheerio.load(`<div data-rich-root="true">${contentHtml}</div>`, null, false);
  const root = $('[data-rich-root="true"]').get(0);
  if (!root) return [];

  const ranges: ExistingLinkRange[] = [];
  const state = { cursor: 0, lastChar: '' };

  function walk(node: unknown, insideLinkUrl: string | null) {
    const n = node as { type: string; data?: string; name?: string; children?: unknown[]; attribs?: Record<string, string> };
    if (n.type === 'text') {
      const value = normalizeRichTextString(n.data ?? '');
      if (!value) return;
      if (insideLinkUrl !== null) {
        ranges.push({
          start: state.cursor,
          end: state.cursor + value.length,
          url: insideLinkUrl,
          anchor_text: value,
        });
      }
      state.cursor += value.length;
      state.lastChar = value.at(-1) ?? state.lastChar;
      return;
    }
    if (n.type !== 'tag') return;

    const tag = (n.name ?? '').toLowerCase();
    if (tag === 'br') {
      appendVirtualNewline(state);
      return;
    }

    const isBlock = BLOCK_TAG_NAMES.has(tag) || LIST_TAG_NAMES.has(tag);
    if (isBlock && hasMeaningfulText(n)) {
      appendVirtualNewline(state);
    }

    let nextLinkUrl = insideLinkUrl;
    if (tag === 'a') {
      const href = n.attribs?.href;
      if (href) nextLinkUrl = href;
    }

    for (const child of n.children ?? []) {
      walk(child, nextLinkUrl);
    }
  }

  for (const child of (root as { children?: unknown[] }).children ?? []) {
    walk(child, null);
  }

  return mergeAdjacentRanges(ranges, contentText);
}

function appendVirtualNewline(state: { cursor: number; lastChar: string }) {
  if (state.cursor === 0 || state.lastChar === '\n') return;
  state.cursor += 1;
  state.lastChar = '\n';
}

function hasMeaningfulText(node: unknown): boolean {
  const n = node as { type: string; data?: string; children?: unknown[] };
  if (n.type === 'text') return (n.data ?? '').trim().length > 0;
  if (n.type !== 'tag') return false;
  for (const child of n.children ?? []) {
    if (hasMeaningfulText(child)) return true;
  }
  return false;
}

/**
 * Merges consecutive ranges from the same <a> (text nodes split by inline formatting
 * like <strong> would otherwise produce two adjacent ranges with the same URL).
 */
function mergeAdjacentRanges(ranges: ExistingLinkRange[], contentText: string): ExistingLinkRange[] {
  if (ranges.length <= 1) return ranges;
  const merged: ExistingLinkRange[] = [ranges[0]];
  for (let i = 1; i < ranges.length; i += 1) {
    const prev = merged[merged.length - 1];
    const curr = ranges[i];
    if (prev.url === curr.url && prev.end === curr.start) {
      prev.end = curr.end;
      prev.anchor_text = contentText.slice(prev.start, prev.end);
    } else {
      merged.push(curr);
    }
  }
  return merged;
}

/**
 * Returns true if [start, end) overlaps any range in `ranges`.
 */
export function rangeOverlaps(
  start: number,
  end: number,
  ranges: Array<{ start: number; end: number }>
): boolean {
  return ranges.some((r) => start < r.end && end > r.start);
}
