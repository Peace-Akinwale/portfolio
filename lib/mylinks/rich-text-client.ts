'use client';

import { buildHighlightedDraftHtml, buildLinkedHtml, normalizeSuggestions } from '@/lib/mylinks/article-preview';
import { BLOCK_TAG_NAMES, normalizeRichTextString } from '@/lib/mylinks/rich-text-common';

type SuggestionShape = {
  id: string;
  anchor_text: string;
  target_url: string;
  char_start: number;
  char_end: number;
  status: 'pending' | 'approved' | 'rejected';
};

type TextSegment = {
  node: Text;
  start: number;
  end: number;
};

export function buildHighlightedDraftFromRichHtml(
  html: string | null,
  text: string,
  suggestions: SuggestionShape[],
  activeId: string | null
) {
  if (!html?.trim()) {
    return buildHighlightedDraftHtml(text, suggestions, activeId);
  }

  // DOMParser is browser-only. During Next.js SSR we return the raw html;
  // the client will re-run this in useMemo after hydration and paint the marks.
  if (typeof DOMParser === 'undefined') {
    return html;
  }

  return annotateRichHtml({
    html,
    text,
    suggestions,
    activeId,
    mode: 'highlight',
  });
}

export function buildLinkedRichHtml(
  html: string | null,
  text: string,
  suggestions: SuggestionShape[]
) {
  if (!html?.trim()) {
    return buildLinkedHtml(text, suggestions);
  }

  if (typeof DOMParser === 'undefined') {
    return html;
  }

  return annotateRichHtml({
    html,
    text,
    suggestions: suggestions.filter((suggestion) => suggestion.status === 'approved'),
    activeId: null,
    mode: 'linked',
  });
}

function annotateRichHtml({
  html,
  text,
  suggestions,
  activeId,
  mode,
}: {
  html: string;
  text: string;
  suggestions: SuggestionShape[];
  activeId: string | null;
  mode: 'highlight' | 'linked';
}) {
  const parser = new DOMParser();
  const documentNode = parser.parseFromString(`<div data-rich-root="true">${html}</div>`, 'text/html');
  const root = documentNode.body.firstElementChild;

  if (!root) {
    return mode === 'highlight'
      ? buildHighlightedDraftHtml(text, suggestions, activeId)
      : buildLinkedHtml(text, suggestions);
  }

  const normalized = normalizeSuggestions(text, suggestions);
  const segments = collectTextSegments(root);

  for (const suggestion of normalized) {
    wrapSuggestionRange(documentNode, segments, suggestion, mode, activeId);
  }

  return root.innerHTML;
}

function collectTextSegments(root: Element) {
  const segments: TextSegment[] = [];
  const state = { cursor: 0, lastChar: '' };

  walkNode(root, state, (node, start, end) => {
    segments.push({ node, start, end });
  });

  return segments;
}

function walkNode(
  node: Node,
  state: { cursor: number; lastChar: string },
  onText: (node: Text, start: number, end: number) => void
) {
  if (node.nodeType === Node.TEXT_NODE) {
    const value = normalizeRichTextString(node.textContent ?? '');
    if (!value) {
      return;
    }

    const start = state.cursor;
    state.cursor += value.length;
    state.lastChar = value.at(-1) ?? state.lastChar;
    onText(node as Text, start, state.cursor);
    return;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return;
  }

  const element = node as Element;
  const tag = element.tagName.toLowerCase();

  if (tag === 'br') {
    appendVirtualNewline(state);
    return;
  }

  if (isContentBlock(element) && hasMeaningfulText(element)) {
    appendVirtualNewline(state);
  }

  for (const child of Array.from(element.childNodes)) {
    walkNode(child, state, onText);
  }
}

function wrapSuggestionRange(
  documentNode: Document,
  segments: TextSegment[],
  suggestion: SuggestionShape,
  mode: 'highlight' | 'linked',
  activeId: string | null
) {
  const overlapping = segments
    .filter((segment) => segment.end > suggestion.char_start && segment.start < suggestion.char_end)
    .sort((left, right) => right.start - left.start);

  for (const segment of overlapping) {
    if (!segment.node.parentNode) {
      continue;
    }

    const localStart = Math.max(0, suggestion.char_start - segment.start);
    const localEnd = Math.min(segment.end, suggestion.char_end) - segment.start;
    if (localEnd <= localStart) {
      continue;
    }

    wrapTextFragment(documentNode, segment.node, localStart, localEnd, suggestion, mode, activeId);
  }
}

function wrapTextFragment(
  documentNode: Document,
  textNode: Text,
  start: number,
  end: number,
  suggestion: SuggestionShape,
  mode: 'highlight' | 'linked',
  activeId: string | null
) {
  if (!textNode.parentNode) {
    return;
  }

  let targetNode = textNode;
  if (end < targetNode.length) {
    targetNode.splitText(end);
  }
  if (start > 0) {
    targetNode = targetNode.splitText(start);
  }

  if (!targetNode.parentNode || !targetNode.textContent) {
    return;
  }

  if (mode === 'linked') {
    const anchor = documentNode.createElement('a');
    anchor.href = suggestion.target_url;
    anchor.appendChild(targetNode.cloneNode(true));
    targetNode.parentNode.replaceChild(anchor, targetNode);
    return;
  }

  const mark = documentNode.createElement('mark');
  mark.className = getHighlightClass(suggestion, activeId);
  mark.dataset.suggestionId = suggestion.id;
  mark.appendChild(targetNode.cloneNode(true));
  targetNode.parentNode.replaceChild(mark, targetNode);
}

function getHighlightClass(suggestion: SuggestionShape, activeId: string | null) {
  let className = 'bg-yellow-100 text-yellow-900 border-b-2 border-yellow-400 px-0.5 rounded-sm';

  if (suggestion.status === 'approved') {
    className = 'bg-green-100 text-green-900 border-b-2 border-green-400 px-0.5 rounded-sm';
  }

  if (suggestion.status === 'rejected') {
    className = 'bg-gray-100 text-gray-500 line-through px-0.5 rounded-sm';
  }

  if (suggestion.id === activeId) {
    className += ' outline outline-2 outline-blue-400';
  }

  return className;
}

function appendVirtualNewline(state: { cursor: number; lastChar: string }) {
  if (state.cursor === 0 || state.lastChar === '\n') {
    return;
  }

  state.cursor += 1;
  state.lastChar = '\n';
}

function hasMeaningfulText(element: Element) {
  return normalizeRichTextString(element.textContent ?? '').trim().length > 0;
}

function isContentBlock(element: Element) {
  // Only treat real text-bearing blocks as newline boundaries.
  // ul/ol are list *containers*; their <li> children already add the newline,
  // and extractDocContent() only emits one '\n' per paragraph/li — so counting
  // the container too would shift every offset after the list by +1.
  const tag = element.tagName.toLowerCase();
  return BLOCK_TAG_NAMES.has(tag);
}
