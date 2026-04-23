import { marked } from 'marked';

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
      if (slice === suggestion.anchor_text) {
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

