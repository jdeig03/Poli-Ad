// Renders the boards and exports per-concept assets (SVG + PNG). Usage: node render.js <out-dir>
const { chromium } = require('playwright'); const M = require('./marks.js'); const fs = require('fs'); const path = require('path');
(async () => {
  const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const board = async (q, file) => {
    const p = await b.newPage({ viewport: { width: 1200, height: 800 }, deviceScaleFactor: 2 });
    await p.goto('file://' + path.join(__dirname, 'board.html') + '?' + q); await p.evaluate(() => window.ready);
    await p.screenshot({ path: path.join(out, file), fullPage: true }); await p.close();
  };
  await board('b=overview', '00-Overview.png');
  for (const [i, n] of M.names.entries()) await board('b=detail&c=' + n, `0${i + 1}-${M.CONCEPTS[n].title}.png`);
  // assets
  const p = await b.newPage({ viewport: { width: 1024, height: 1024 }, deviceScaleFactor: 2 });
  for (const n of M.names) {
    const d = path.join(out, M.CONCEPTS[n].title); fs.mkdirSync(d, { recursive: true });
    const svgG = M.mark(n), svgC = M.mark(n, { glow: false });
    fs.writeFileSync(path.join(d, `Poli-${M.CONCEPTS[n].title}-mark.svg`), svgG);
    fs.writeFileSync(path.join(d, `Poli-${M.CONCEPTS[n].title}-mark-clean.svg`), svgC);
    for (const [svg, name] of [[svgG, 'mark'], [svgC, 'mark-clean']]) {
      await p.setContent(`<body style="margin:0;background:transparent">${svg.replace('<svg', '<svg width="1024" height="1024"')}</body>`);
      await p.screenshot({ path: path.join(d, `Poli-${M.CONCEPTS[n].title}-${name}-2048.png`), omitBackground: true, clip: { x: 0, y: 0, width: 1024, height: 1024 } });
    }
    await p.goto('file://' + path.join(__dirname, 'board.html') + '?b=overview'); await p.evaluate(() => window.ready);
    await p.evaluate(n => { document.body.innerHTML = `<div id="x" style="padding:0;display:inline-block">${(() => { const s = window.PoliMarks.mark(n, { id: 'ex' }); return `<div style="position:relative;width:1024px;height:1024px;border-radius:22.4%;overflow:hidden;background:linear-gradient(180deg,#FFFFFF,#F3F2F8)">${s.replace('<svg', '<svg style="position:absolute;left:4%;top:6%;width:92%;height:92%"')}</div>`; })()}</div>`; }, n);
    await p.screenshot({ path: path.join(d, `Poli-${M.CONCEPTS[n].title}-app-icon-1024.png`), clip: { x: 0, y: 0, width: 1024, height: 1024 }, omitBackground: true });
    await p.evaluate(n => { document.body.innerHTML = `<div id="x" style="display:inline-flex;align-items:center;gap:52px;padding:60px;background:#fff">${window.PoliMarks.mark(n, { glow: false, id: 'lk' }).replace('<svg', '<svg width="236" height="236"')}<span style="font-family:Manrope;font-weight:800;font-size:244px;letter-spacing:-0.035em;color:#14131C;line-height:1">Poli</span></div>`; }, n);
    await p.evaluate(() => document.fonts.ready);
    const el = await p.$('#x'); await el.screenshot({ path: path.join(d, `Poli-${M.CONCEPTS[n].title}-lockup.png`) });
  }
  await b.close();
})();
