// Full-page screenshots of local routes at desktop and phone widths, with the
// console errors and horizontal-overflow check for each. Usage:
//   node scripts/qa/shoot.mjs /  /portfolio  /blog
// Writes to docs/qa/shots/<route>-<width>.png (git-ignored) and prints a line per page.
// QA_DARK=1 emulates prefers-color-scheme: dark, checks the page ground is one of the
// ink values, and prefixes the file names with dark-.
import puppeteer from 'puppeteer';
import fs from 'node:fs';
import path from 'node:path';

const base = process.env.QA_BASE ?? 'http://localhost:3000';
const routes = process.argv.slice(2).length ? process.argv.slice(2) : ['/'];
const dark = process.env.QA_DARK === '1';
const out = path.resolve('docs/qa/shots');
fs.mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({ headless: 'shell' });
for (const route of routes) {
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
    if (dark) await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push('pageerror ' + e.message));
    page.on('requestfailed', (r) => {
      // A cancelled link prefetch (?_rsc=..., net::ERR_ABORTED) is the browser tidying up, not a page error.
      const why = r.failure()?.errorText ?? '';
      if (r.url().startsWith(base) && !(why === 'net::ERR_ABORTED' && r.url().includes('_rsc='))) errors.push(`failed ${r.url()} (${why})`);
    });
    await page.goto(base + route, { waitUntil: 'networkidle0', timeout: 60000 });
    await page.evaluate(async () => {
      // walk the page so lazy images load
      for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
      window.scrollTo(0, 0);
    });
    await new Promise((r) => setTimeout(r, 400));
    const m = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth,
      h1: document.querySelectorAll('h1').length,
      height: document.documentElement.scrollHeight,
      emdash: (document.body.innerText.match(/—/g) || []).length,
      ground: getComputedStyle(document.body).backgroundColor,
      ink: getComputedStyle(document.body).color,
    }));
    // In dark mode the ground must be an ink value and the text light; in light mode the reverse.
    const lum = (c) => { const [r, g, b] = c.match(/\d+/g).map(Number); return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; };
    if (dark ? lum(m.ground) > 0.3 || lum(m.ink) < 0.6 : lum(m.ground) < 0.6 || lum(m.ink) > 0.4) errors.push(`theme mismatch ground=${m.ground} ink=${m.ink}`);
    const name = (dark ? 'dark-' : '') + (route === '/' ? 'home' : route.replace(/^\//, '').replace(/[\/#?]/g, '_')) + `-${w}.png`;
    await page.screenshot({ path: path.join(out, name), fullPage: true });
    console.log(`${route} ${w}x${h}`, JSON.stringify(m), errors.length ? 'ERRORS: ' + errors.join(' | ').slice(0, 400) : 'no errors', '->', name);
    await page.close();
  }
}
await browser.close();
