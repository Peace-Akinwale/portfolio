// A small front-matter reader for the Markdown under content/. Supports the
// subset the site uses: `key: value` lines, `key:` followed by `- item` lists,
// and values wrapped in single or double quotes. The body is returned untouched.

export interface FrontMatter {
  data: Record<string, string | string[]>;
  body: string;
}

function unquote(v: string): string {
  const t = v.trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) return t.slice(1, -1);
  return t;
}

export function parseFrontMatter(src: string): FrontMatter {
  const text = src.replace(/^﻿/, '');
  if (!text.startsWith('---')) return { data: {}, body: text };
  const end = text.indexOf('\n---', 3);
  if (end === -1) return { data: {}, body: text };
  const head = text.slice(3, end).replace(/^\r?\n/, '');
  const body = text.slice(end + 4).replace(/^\r?\n/, '');
  const data: Record<string, string | string[]> = {};
  let listKey: string | null = null;
  for (const raw of head.split(/\r?\n/)) {
    if (!raw.trim()) continue;
    const item = raw.match(/^\s*-\s+(.*)$/);
    if (item && listKey) {
      (data[listKey] as string[]).push(unquote(item[1]));
      continue;
    }
    const kv = raw.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;
    const [, key, value] = kv;
    if (value.trim() === '') {
      data[key] = [];
      listKey = key;
    } else {
      data[key] = unquote(value);
      listKey = null;
    }
  }
  return { data, body };
}

export function asString(v: string | string[] | undefined, fallback = ''): string {
  if (Array.isArray(v)) return v.join(', ');
  return v ?? fallback;
}

export function asList(v: string | string[] | undefined): string[] {
  if (Array.isArray(v)) return v;
  if (!v) return [];
  return v.split(',').map((s) => s.trim()).filter(Boolean);
}
