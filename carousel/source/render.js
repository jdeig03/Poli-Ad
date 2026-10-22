// Renders post.html to PNG at 2x (2160x2700) and 1x (1080x1350).
// Usage: node render.js <out-dir>
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const out = process.argv[2] || '.';
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  for (const [scale, name] of [[2, 'Poli-Post-2160x2700.png'], [1, 'Poli-Post-1080x1350.png']]) {
    const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: scale });
    await page.goto('file://' + path.join(__dirname, 'post.html'));
    await page.evaluate(() => window.ready);
    await page.screenshot({ path: path.join(out, name), clip: { x: 0, y: 0, width: 1080, height: 1350 } });
    await page.close();
  }
  await browser.close();
})();
