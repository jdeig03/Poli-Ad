// Renders every logo in dev.html to PNG + standalone SVG.
// Usage: node render.js <outDir> [deviceScaleFactor]
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
(async () => {
  const out = process.argv[2] || 'exports';
  const scale = +(process.argv[3] || 1);
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: scale });
  p.on('console', m => console.log('console:', m.text()));
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('file://' + path.resolve(__dirname, 'dev.html'));
  await p.waitForSelector('body[data-ready="1"]', { timeout: 30000 });
  await p.waitForTimeout(500);
  const names = { '1': 'glen-river-rise', '2': 'glen-torch', '3': 'glen-bridge', '4': 'scott-cardinal', '5': 'scott-hometown-star', '6': 'scott-tulip-tree' };
  for (const s of await p.$$('svg[data-id]')) {
    const id = await s.getAttribute('data-id');
    const [n, kind] = id.split('-');
    const base = `${out}/${n}-${names[n]}-${kind}`;
    await s.screenshot({ path: base + '.png' });
    fs.writeFileSync(base + '.svg', await s.evaluate(e => e.outerHTML));
  }
  await b.close();
})();
