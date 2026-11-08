// Viewport (not full-page) screenshots in dark mode, for checking palettes.
import puppeteer from 'puppeteer';
const base = process.env.QA_BASE ?? 'http://localhost:3000';
const browser = await puppeteer.launch({ headless: 'shell' });
for (const [route, scrollY] of [['/', 0], ['/', 900], ['/case-studies', 300], ['/portfolio', 1400]]) {
  const p = await browser.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  await p.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);
  await p.goto(base + route, { waitUntil: 'networkidle0' });
  await p.evaluate((y) => { document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, y); }, scrollY);
  await new Promise((r) => setTimeout(r, 500));
  const name = `docs/qa/shots/dark-${route === '/' ? 'home' : route.slice(1)}-${scrollY}.png`;
  await p.screenshot({ path: name });
  console.log(name);
  await p.close();
}
await browser.close();
