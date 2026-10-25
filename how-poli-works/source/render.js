// Renders the six "How Poli works" slides at 2x (2160x2700) and 1x (1080x1350).
// Usage: node render.js <out-dir>
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const out = process.argv[2] || '.';
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  for (let n = 1; n <= 6; n++) {
    for (const [scale, size] of [[2, '2160x2700'], [1, '1080x1350']]) {
      const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: scale });
      await page.goto('file://' + path.join(__dirname, 'slides.html') + '?n=' + n);
      await page.evaluate(() => window.ready);
      await page.screenshot({ path: path.join(out, `How-Poli-Works-${n}-${size}.png`), clip: { x: 0, y: 0, width: 1080, height: 1350 } });
      await page.close();
    }
  }
  await browser.close();
})();
