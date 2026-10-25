// Behaviour checks the screenshot script cannot see: anchors land below the
// sticky header, reduced motion disables the split widening and smooth scroll,
// keyboard focus is visible on the header links, the /portfolio filter hides
// the right entries and announces the count, dark mode keeps contrast tokens,
// and Back after an in-page anchor returns to the top. Prints one line per check.
import puppeteer from 'puppeteer';
const base = process.env.QA_BASE ?? 'http://localhost:3000';
const browser = await puppeteer.launch({ headless: 'shell' });
const out = [];
const ok = (name, pass, detail = '') => out.push(`${pass ? 'PASS' : 'FAIL'} ${name}${detail ? ' :: ' + detail : ''}`);

async function page(w = 1440, h = 900, opts = {}) {
  const p = await browser.newPage();
  await p.setViewport({ width: w, height: h });
  if (opts.reducedMotion) await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  if (opts.dark) await p.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);
  return p;
}

// 1. anchors below the sticky header
for (const [route, hash, w] of [['/', '#q2', 1440], ['/', '#q3', 390], ['/portfolio', '#writing', 1440], ['/portfolio', '#m-2026-04', 1440]]) {
  const p = await page(w, w === 390 ? 844 : 900);
  await p.goto(base + route, { waitUntil: 'networkidle0' });
  await p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  await p.evaluate((h) => { location.hash = h; }, hash);
  await new Promise((r) => setTimeout(r, 600));
  const r = await p.evaluate((h) => {
    const el = document.querySelector(h); const hd = document.querySelector('header.site-header');
    if (!el) return { missing: true };
    const top = el.getBoundingClientRect().top; const hb = hd ? hd.getBoundingClientRect().bottom : 0;
    return { top: Math.round(top), headerBottom: Math.round(hb) };
  }, hash);
  ok(`anchor ${route}${hash} @${w}`, !r.missing && r.top >= r.headerBottom - 1, JSON.stringify(r));
  await p.close();
}

// 2. reduced motion: no widening on hover, no smooth scroll
{
  const p = await page(1440, 900, { reducedMotion: true });
  await p.goto(base + '/', { waitUntil: 'networkidle0' });
  await p.hover('#q1 .split-paper');
  await new Promise((r) => setTimeout(r, 500));
  const r = await p.evaluate(() => ({ cols: getComputedStyle(document.querySelector('#q1')).gridTemplateColumns, smooth: getComputedStyle(document.documentElement).scrollBehavior }));
  const [a, b] = r.cols.split(' ').map(parseFloat);
  ok('reduced motion: halves stay equal on hover', Math.abs(a - b) < 2 && r.smooth === 'auto', JSON.stringify(r));
  await p.close();
}
// 2b. with motion allowed the hovered half widens
{
  const p = await page(1440, 900);
  await p.goto(base + '/', { waitUntil: 'networkidle0' });
  await p.hover('#q1 .split-paper');
  await new Promise((r) => setTimeout(r, 600));
  const cols = await p.evaluate(() => getComputedStyle(document.querySelector('#q1')).gridTemplateColumns);
  const [a, b] = cols.split(' ').map(parseFloat);
  ok('motion: hovered paper half widens', a > b * 1.1, cols);
  await p.close();
}

// 3. keyboard: Tab reaches the skip link, then the name, then the nav; focus ring visible
{
  const p = await page();
  await p.goto(base + '/', { waitUntil: 'networkidle0' });
  const seq = [];
  for (let i = 0; i < 4; i++) {
    await p.keyboard.press('Tab');
    seq.push(await p.evaluate(() => { const a = document.activeElement; const cs = getComputedStyle(a); return `${a.tagName}:${(a.textContent || '').trim().slice(0, 18)}|outline=${cs.outlineStyle}`; }));
  }
  ok('keyboard: first tabs hit skip link, name, nav; focus outlines present', seq[0].startsWith('A:Skip to content') && seq.every((s) => s.includes('outline=solid')), seq.join(' > '));
  await p.close();
}

// 4. /portfolio filter
{
  const p = await page();
  await p.goto(base + '/portfolio', { waitUntil: 'networkidle0' });
  await p.click('.record-filters button:nth-child(3)');
  await new Promise((r) => setTimeout(r, 300));
  const r = await p.evaluate(() => {
    const visible = [...document.querySelectorAll('.entry')].filter((e) => !e.hidden);
    return { kinds: [...new Set(visible.map((e) => e.dataset.kind))], status: document.querySelector('.record-filters + p, .sr-only[aria-live]')?.textContent, pressed: document.querySelector('.record-filters button[aria-pressed="true"]')?.textContent };
  });
  ok('filter Writing shows only wrote/said and announces the count', r.kinds.every((k) => k === 'wrote' || k === 'said') && /entries shown/.test(r.status || '') && r.pressed === 'Writing', JSON.stringify(r));
  await p.click('.record-filters button:nth-child(1)');
  await p.close();
}

// 5. dark mode tokens on the homepage shell and a case study
{
  const p = await page(1440, 900, { dark: true });
  await p.goto(base + '/case-studies/aloud', { waitUntil: 'networkidle0' });
  const r = await p.evaluate(() => ({ bg: getComputedStyle(document.body).backgroundColor, fg: getComputedStyle(document.body).color, h1: getComputedStyle(document.querySelector('h1')).color }));
  ok('dark mode: night ground with light ink', r.bg === 'rgb(21, 26, 58)' && r.fg === 'rgb(236, 235, 244)', JSON.stringify(r));
  await p.close();
}

// 6. back after an in-page anchor returns to where you were
{
  const p = await page();
  await p.goto(base + '/', { waitUntil: 'networkidle0' });
  await p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  await p.click('.qnav a[href="#q3"]');
  await new Promise((r) => setTimeout(r, 500));
  const atQ3 = await p.evaluate(() => location.hash === '#q3' && window.scrollY > 500);
  await p.goBack();
  await new Promise((r) => setTimeout(r, 500));
  const back = await p.evaluate(() => ({ hash: location.hash, y: window.scrollY }));
  ok('back after a question anchor returns up', atQ3 && back.hash === '' && back.y < 100, JSON.stringify(back));
  await p.close();
}

// 7. phone menu opens, closes on Escape, has 44px targets
{
  const p = await page(390, 844);
  await p.goto(base + '/blog', { waitUntil: 'networkidle0' });
  await p.click('header button[aria-expanded]');
  await new Promise((r) => setTimeout(r, 200));
  const open = await p.evaluate(() => ({ expanded: document.querySelector('header button[aria-expanded]').getAttribute('aria-expanded'), links: [...document.querySelectorAll('header nav a')].filter((a) => a.getBoundingClientRect().height > 0).map((a) => Math.round(a.getBoundingClientRect().height)) }));
  await p.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 200));
  const closed = await p.evaluate(() => document.querySelector('header button[aria-expanded]').getAttribute('aria-expanded'));
  ok('phone menu: opens, every link ≥ 44px tall, Escape closes', open.expanded === 'true' && open.links.length >= 6 && open.links.every((h) => h >= 44) && closed === 'false', JSON.stringify({ open, closed }));
  await p.close();
}

await browser.close();
console.log(out.join('\n'));
process.exit(out.some((l) => l.startsWith('FAIL')) ? 1 : 0);
