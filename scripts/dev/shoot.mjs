// Screenshot strip: scrolls a page and captures the viewport at each stop.
// usage: node shoot.mjs <url> <outdir> [--width 1440] [--height 900] [--scheme dark] [--reduced] [--stops 8] [--full]
import puppeteer from 'puppeteer';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const url = args[0];
const out = args[1];
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? def : args[i + 1];
};
const width = Number(opt('width', 1440));
const height = Number(opt('height', 900));
const scheme = opt('scheme', 'light');
const reduced = args.includes('--reduced');
const stops = Number(opt('stops', 8));
const full = args.includes('--full');
const tag = `${width}x${height}-${scheme}${reduced ? '-reduced' : ''}`;

mkdirSync(out, { recursive: true });

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width, height, deviceScaleFactor: 1 });
await page.emulateMediaFeatures([
  { name: 'prefers-color-scheme', value: scheme },
  { name: 'prefers-reduced-motion', value: reduced ? 'reduce' : 'no-preference' },
]);
await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
await page.evaluate(() => localStorage.removeItem('theme'));
await page.reload({ waitUntil: 'networkidle0' });
await page.evaluate(() => document.fonts.ready);

const total = await page.evaluate(() => document.documentElement.scrollHeight);
const positions = [];
for (let i = 0; i < stops; i++) positions.push(Math.round((i / (stops - 1)) * (total - height)));

for (const [i, y] of positions.entries()) {
  await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y);
  await new Promise((r) => setTimeout(r, 350));
  const file = path.join(out, `${tag}-${String(i).padStart(2, '0')}-y${y}.png`);
  await page.screenshot({ path: file });
  console.log(file);
}
if (full) {
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  const file = path.join(out, `${tag}-full.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log(file);
}
console.log(JSON.stringify({ total, positions }));
await browser.close();
