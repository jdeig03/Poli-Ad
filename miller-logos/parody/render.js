// Renders the parody pieces to PNG + SVG. Usage: node render.js [outDir] [scale]
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
(async () => {
  const out = process.argv[2] || path.join(__dirname, 'exports');
  const scale = +(process.argv[3] || 2);
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1400, height: 1000 }, deviceScaleFactor: scale });
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('file://' + path.join(__dirname, 'parody.html'));
  await p.waitForSelector('body[data-ready="1"]', { timeout: 30000 });
  await p.waitForTimeout(400);
  for (const s of await p.$$('svg[data-id]')) {
    const id = await s.getAttribute('data-id');
    await s.screenshot({ path: `${out}/${id}.png` });
    fs.writeFileSync(`${out}/${id}.svg`, await s.evaluate(e => e.outerHTML));
  }
  await b.close();
})();
