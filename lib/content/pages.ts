import fs from 'node:fs';
import path from 'node:path';
import { renderMarkdown } from './markdown';

export function readPage(slug: 'about' | 'services' | 'manyrequests' | 'mylinks') {
  const markdown = fs.readFileSync(path.join(process.cwd(), 'content/pages', slug + '.md'), 'utf8');
  const newline = markdown.indexOf('\n');
  return {
    title: markdown.slice(0, newline).replace(/^# /, ''),
    html: renderMarkdown(markdown.slice(newline).trim(), { imageBase: '/images/approved' }),
  };
}
