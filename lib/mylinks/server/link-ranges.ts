import * as cheerio from 'cheerio';
import { BLOCK_TAG_NAMES, normalizeRichTextString } from '../rich-text-common';

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
 *
 * Server-only on purpose: cheerio is 25KB+ and must not leak into the client bundle.
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
    const n = node as {
      type: string;
      data?: string;
      name?: string;
      children?: unknown[];
      attribs?: Record<string, string>;
    };
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

    const isBlock = BLOCK_TAG_NAMES.has(tag);
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

function mergeAdjacentRanges(
  ranges: ExistingLinkRange[],
  contentText: string
): ExistingLinkRange[] {
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

export function rangeOverlaps(
  start: number,
  end: number,
  ranges: Array<{ start: number; end: number }>
): boolean {
  return ranges.some((r) => start < r.end && end > r.start);
}

/**
 * Extracts real <h1>..<h6> tag ranges from content_html, mapping them to
 * char offsets in content_text. Structural heading detection beats heuristics
 * because it only flags actual document headings, not short body lines.
 */
export function extractHeadingRanges(
  contentHtml: string | null,
  _contentText: string
): Array<{ start: number; end: number }> {
  if (!contentHtml?.trim()) return [];

  const $ = cheerio.load(`<div data-rich-root="true">${contentHtml}</div>`, null, false);
  const root = $('[data-rich-root="true"]').get(0);
  if (!root) return [];

  const ranges: Array<{ start: number; end: number }> = [];
  const state = { cursor: 0, lastChar: '' };

  function walk(node: unknown, parentIsHeading: boolean) {
    const n = node as {
      type: string;
      data?: string;
      name?: string;
      children?: unknown[];
    };
    if (n.type === 'text') {
      const value = normalizeRichTextString(n.data ?? '');
      if (!value) return;
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

    const isHeading = /^h[1-6]$/.test(tag);
    const isBlock = BLOCK_TAG_NAMES.has(tag);
    if (isBlock && hasMeaningfulText(n)) {
      appendVirtualNewline(state);
    }

    const startBefore = state.cursor;
    for (const child of n.children ?? []) {
      walk(child, parentIsHeading || isHeading);
    }

    if (isHeading) {
      const endAfter = state.cursor;
      if (endAfter > startBefore) {
        ranges.push({ start: startBefore, end: endAfter });
      }
    }
  }

  for (const child of (root as { children?: unknown[] }).children ?? []) {
    walk(child, false);
  }

  return ranges;
}
