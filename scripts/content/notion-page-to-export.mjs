// Turns one Notion page, as the Notion MCP "fetch" tool returns it, into the
// export shape that import-notion.mjs reads:
//   content/notion-export/<name>.md                 front matter + Markdown
//   content/notion-export/images/<name>/<n>-<file>  every image on the page
//   content/notion-export/images/<name>/manifest.json
// Input: one or more JSON files, each
//   { "export_name": "<file name without .md>",
//     "notion_url": "...", "title": "...", "page_last_edited_at": "...",
//     "content": "<the text between <content> and </content>>",
//     "references": { "<image source>": "<signed download URL>" } }
// The signed URLs expire five minutes after the fetch, so run this straight
// after writing the JSON. Run: node scripts/content/notion-page-to-export.mjs file.json [...]
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = process.cwd();
const EXPORT = path.join(ROOT, 'content', 'notion-export');

function imageName(src) {
  const m = src.match(/[?&]name=([^&]+)/);
  const raw = m ? decodeURIComponent(m[1]) : 'image.png';
  return raw.replace(/\s+/g, '_');
}
function blockId(src) {
  const m = src.match(/^notion-file-block:\/\/([0-9a-f-]+)\//);
  return m ? m[1] : null;
}

function convert(page) {
  const dir = path.join(EXPORT, 'images', page.export_name);
  fs.mkdirSync(dir, { recursive: true });
  const images = [];
  let n = 0;
  let text = page.content.replace(/\r/g, '').trim();

  // <image source="..."/> and <image source="...">caption</image>
  text = text.replace(/<image source="([^"]+)"\s*(?:\/>|>([\s\S]*?)<\/image>)/g, (_, src, inner) => {
    n += 1;
    const name = imageName(src);
    const file = `${n}-${name}`;
    const url = page.references?.[src];
    const target = path.join(dir, file);
    let bytes = 0; let contentType = null; let downloaded = false; let note = null;
    const already = fs.existsSync(target) && fs.statSync(target).size > 0;
    if (already) {
      // keep a file from an earlier run (the signed URL has probably expired)
      bytes = fs.statSync(target).size; downloaded = true;
      contentType = (() => { try { return execFileSync('file', ['-b', '--mime-type', target], { encoding: 'utf8' }).trim(); } catch { return null; } })();
    } else if (url) {
      try {
        execFileSync('curl', ['-sS', '-f', '-L', '--max-time', '120', '-o', target, '-w', '%{content_type}', url], { encoding: 'utf8' });
        bytes = fs.statSync(target).size; downloaded = bytes > 0;
        contentType = (() => { try { return execFileSync('file', ['-b', '--mime-type', target], { encoding: 'utf8' }).trim(); } catch { return null; } })();
      } catch (e) { note = `download failed: ${String(e.message).split('\n')[0]}`; }
    } else { note = 'no signed URL in references'; }
    const caption = inner ? inner.trim() : null;
    images.push({ n, file, original_name: name, bytes, content_type: contentType, notion_block_id: blockId(src), caption_text_below_image: caption ? `*${caption}*` : null, downloaded, download_note: note });
    const alt = name.replace(/\.[a-z0-9]+$/i, '');
    return `![${alt}](images/${page.export_name}/${file})` + (caption ? `\n\n*${caption}*` : '');
  });

  // <p> wrappers (paragraphs Peace typed with trailing spaces) and lone <i> lines
  text = text.replace(/<p>\s*([\s\S]*?)\s*<\/p>/g, (_, inner) => inner.trim());
  text = text.replace(/^<i>([\s\S]*?)<\/i>[ \t]*$/gm, (_, inner) => `*${inner.trim()}*`);
  // a caption line right after an image that we rendered without one
  text = text.replace(/(!\[[^\]]*\]\([^)]*\))\n\n\*([^*\n][^\n]*)\*/g, (m, img, cap) => {
    const k = images.findIndex((i) => m.includes(i.file));
    if (k >= 0 && !images[k].caption_text_below_image) images[k].caption_text_below_image = `*${cap}*`;
    return m;
  });
  text = text.replace(/\n{3,}/g, '\n\n').trim();

  const fm = `---\ntitle: "${page.title.replace(/"/g, '\\"')}"\nnotion_url: ${page.notion_url}\nexported_at: ${new Date().toISOString()}\nnotion_last_edited: ${page.page_last_edited_at}\n---\n\n`;
  fs.writeFileSync(path.join(EXPORT, `${page.export_name}.md`), fm + text + '\n');
  fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify({ page: page.title, slug: page.export_name, notion_url: page.notion_url, exported_at: new Date().toISOString(), images }, null, 2) + '\n');
  const words = text.replace(/!\[[^\]]*\]\([^)]*\)/g, '').split(/\s+/).filter(Boolean).length;
  const failed = images.filter((i) => !i.downloaded).length;
  console.log(`${page.export_name}: ${words} words, ${images.length} images${failed ? `, ${failed} NOT downloaded` : ''}`);
}

for (const f of process.argv.slice(2)) {
  const page = JSON.parse(fs.readFileSync(f, 'utf8'));
  // "content_file": a sibling text file holding the <content> text verbatim,
  // which avoids JSON-escaping a whole page by hand.
  if (page.content_file) page.content = fs.readFileSync(path.resolve(path.dirname(f), page.content_file), 'utf8');
  convert(page);
}
