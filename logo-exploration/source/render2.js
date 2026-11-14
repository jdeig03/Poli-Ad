// Renders the Apple-ified Aura board and exports each variant (SVG + PNG + app icon). Usage: node render2.js <out-dir>
const { chromium } = require('playwright'); const M = require('./marks2.js'); const fs = require('fs'); const path = require('path');
(async () => {
  const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 2 });
  await p.goto('file://' + path.join(__dirname, 'board2.html')); await p.evaluate(() => window.ready);
  await p.screenshot({ path: path.join(out, 'Aura-Refined-Board.png'), fullPage: true });
  await p.setViewportSize({ width: 1024, height: 1024 });
  for (const n of M.names) {
    const t = M.CONCEPTS[n].title.replace(/ /g, '-'), d = path.join(out, t); fs.mkdirSync(d, { recursive: true });
    fs.writeFileSync(path.join(d, `Poli-${t}.svg`), M.mark(n, { halo: false }));
    if (n === 'light') fs.writeFileSync(path.join(d, `Poli-${t}-with-halo.svg`), M.mark(n));
    await p.setContent(`<body style="margin:0">${M.mark(n, { halo: false }).replace('<svg', '<svg width="1024" height="1024"')}</body>`);
    await p.screenshot({ path: path.join(d, `Poli-${t}-2048.png`), omitBackground: true, clip: { x: 0, y: 0, width: 1024, height: 1024 } });
    await p.setContent(`<body style="margin:0;background:transparent"><div style="width:1024px;height:1024px;border-radius:22.37%;background:#fff;display:grid;place-items:center">${M.mark(n, { halo: false }).replace('<svg', '<svg width="655" height="655"')}</div></body>`);
    await p.screenshot({ path: path.join(d, `Poli-${t}-app-icon-1024.png`), omitBackground: true, clip: { x: 0, y: 0, width: 1024, height: 1024 } });
  }
  await b.close();
})();
