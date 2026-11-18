// Renders round-2 variants from dev2.html. Usage: node render2.js <outDir> [scale]
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
(async () => {
  const out = process.argv[2] || 'exports/round2';
  const scale = +(process.argv[3] || 1);
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: scale });
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('file://' + path.resolve(__dirname, 'dev2.html'));
  await p.waitForSelector('body[data-ready="1"]', { timeout: 30000 });
  await p.waitForTimeout(500);
  for (const s of await p.$$('svg[data-id]')) {
    const id = await s.getAttribute('data-id');
    await s.screenshot({ path: `${out}/${id}.png` });
    fs.writeFileSync(`${out}/${id}.svg`, await s.evaluate(e => e.outerHTML));
  }
  await b.close();
})();
