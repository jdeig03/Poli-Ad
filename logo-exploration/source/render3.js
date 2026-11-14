// Renders the brand system board (split into pages under 8000px) and exports the final mark set. node render3.js <out-dir>
const { chromium } = require('playwright'); const B = require('./brand.js'); const fs = require('fs'); const path = require('path');
(async () => {
  const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 2 });
  await p.goto('file://' + path.join(__dirname, 'board3.html')); await p.evaluate(() => window.ready);
  await p.screenshot({ path: path.join(out, 'Poli-Brand-System-full.png'), fullPage: true });
  // page-sized parts, split at section rules
  const cuts = await p.evaluate(() => [0, ...[...document.querySelectorAll('hr')].map(h => h.offsetTop), document.body.scrollHeight]);
  const groups = [[0, 3], [3, 6], [6, 9]];
  for (const [i, [a, z]] of groups.entries()) {
    const y0 = cuts[a], y1 = cuts[Math.min(z, cuts.length - 1)];
    await p.screenshot({ path: path.join(out, `Poli-Brand-System-${i + 1}.png`), clip: { x: 0, y: y0, width: 1200, height: y1 - y0 }, fullPage: true });
  }
  const d = path.join(out, 'assets'); fs.mkdirSync(d, { recursive: true });
  const files = { 'Poli-mark.svg': B.brandMark(), 'Poli-mark-favicon.svg': B.brandMark({ smile: 17 }), 'Poli-mark-ink.svg': B.brandMark({ mono: B.COLORS.ink }), 'Poli-mark-purple.svg': B.brandMark({ mono: B.COLORS.purple }) };
  for (const [f, s] of Object.entries(files)) fs.writeFileSync(path.join(d, f), s);
  await p.setViewportSize({ width: 1024, height: 1024 });
  await p.setContent(`<body style="margin:0">${B.brandMark({ size: 1024 })}</body>`);
  await p.screenshot({ path: path.join(d, 'Poli-mark-2048.png'), omitBackground: true, clip: { x: 0, y: 0, width: 1024, height: 1024 } });
  await p.setContent(`<body style="margin:0"><div style="width:1024px;height:1024px;border-radius:22.37%;background:#fff;display:grid;place-items:center">${B.brandMark({ size: 655 })}</div></body>`);
  await p.screenshot({ path: path.join(d, 'Poli-app-icon-1024.png'), omitBackground: true, clip: { x: 0, y: 0, width: 1024, height: 1024 } });
  await b.close();
})();
