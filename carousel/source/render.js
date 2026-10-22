// Renders the carousel slides to PNG at 2x (2160x2700) and 1x (1080x1350).
// Usage: node render.js <out-dir>
const { chromium } = require('playwright');
const path = require('path');

const SLIDES = [['post.html', 'Poli-Slide1'], ['slide2.html', 'Poli-Slide2']];

(async () => {
  const out = process.argv[2] || '.';
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  for (const [file, name] of SLIDES) {
    for (const [scale, size] of [[2, '2160x2700'], [1, '1080x1350']]) {
      const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: scale });
      await page.goto('file://' + path.join(__dirname, file));
      await page.evaluate(() => window.ready);
      await page.screenshot({ path: path.join(out, `${name}-${size}.png`), clip: { x: 0, y: 0, width: 1080, height: 1350 } });
      await page.close();
    }
  }
  await browser.close();
})();
