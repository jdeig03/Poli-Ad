// Exports send-ready images from the share page: logo files plus one image per context section.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const B = require('./brand.js');
(async () => {
  const out = process.argv[3]; fs.mkdirSync(out, { recursive: true });
  const src = fs.readFileSync(process.argv[2], 'utf8');
  const page = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + src + '</body></html>';
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
  await p.setContent(page, { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready);
  const shots = { 'Poli-Ask-Anything.png': '.hero', '2-Poli-Logo-System.png': '#logo', '3-Poli-Colour-Balance.png': '#balance', '4-Poli-Wording.png': '#words', '5-Poli-Website.png': '#website', '6-Poli-Demo.png': '#demo', '7-Poli-Socials.png': '#socials', '8-Poli-Card-and-Email.png': '#more' };
  for (const [f, sel] of Object.entries(shots)) await (await p.$(sel)).screenshot({ path: path.join(out, f.startsWith('Poli') ? '1-' + f : f) });
  // logo files on transparent backgrounds
  await p.setViewportSize({ width: 1200, height: 1200 });
  await p.setContent('<!doctype html><body style="margin:0;background:transparent">' + B.brandMark({ size: 1000, id: 'L' }) + '</body>');
  await p.screenshot({ path: path.join(out, 'Poli-Logo.png'), omitBackground: true, clip: { x: 0, y: 0, width: 1000, height: 1000 } });
  await p.setContent(page, { waitUntil: 'load' });
  await p.evaluate(m => { document.body.innerHTML = `<div id="x" style="display:inline-flex;align-items:center;gap:112px;padding:80px">${m}<span style="font-family:Inter,sans-serif;font-weight:600;font-size:540px;letter-spacing:-0.045em;line-height:1;color:#1D1D1F">Poli</span></div>`; document.body.style.background = 'transparent'; }, B.brandMark({ size: 500, id: 'LW' }).replace('<svg ', '<svg shape-rendering="geometricPrecision" '));
  await p.evaluate(() => document.fonts.ready);
  await (await p.$('#x')).screenshot({ path: path.join(out, 'Poli-Logo-with-Name.png'), omitBackground: true });
  await b.close();
})();
