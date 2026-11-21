// Renders social banners for the new brand. Usage: node banner.js <out-dir>
const { chromium } = require('playwright'); const B = require('./brand.js'); const path = require('path');
const SIZES = [['Poli-Banner-X-1500x500', 1500, 500], ['Poli-Banner-LinkedIn-1584x396', 1584, 396]];
(async () => {
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] }); const out = process.argv[2];
  for (const [name, w, h] of SIZES) {
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
    const m = h * 0.36;                                   // mark size
    const html = `<!doctype html><html><head><style>
      @font-face { font-family: 'D'; font-weight: 600; src: url('file:///usr/share/fonts/opentype/inter/InterDisplay-SemiBold.otf'); }
      @font-face { font-family: 'T'; font-weight: 500; src: url('file:///usr/share/fonts/opentype/inter/Inter-Medium.otf'); }
      html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden;background:#fff}
      .f{position:absolute;inset:0;overflow:hidden;background:#fff}
      .f i{position:absolute;border-radius:50%;filter:blur(${h * 0.18}px)}
      .c{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:${h * 0.07}px}
      .l{display:flex;align-items:center;gap:${m * 0.24}px}
      .w{font:600 ${m * 1.02}px 'D';letter-spacing:-0.045em;color:#1D1D1F;line-height:1}
      .s{font:500 ${h * 0.075}px 'T';color:#6E6E73;letter-spacing:-0.01em}
    </style></head><body><div class="f">
      <i style="width:${w * 0.55}px;height:${h * 1.3}px;left:${-w * 0.12}px;top:${-h * 0.15}px;background:rgba(111,143,239,0.40)"></i>
      <i style="width:${w * 0.55}px;height:${h * 1.3}px;right:${-w * 0.12}px;top:${-h * 0.15}px;background:rgba(232,102,122,0.36)"></i>
      <i style="width:${w * 0.4}px;height:${h * 0.9}px;left:${w * 0.3}px;top:${h * 0.55}px;background:rgba(155,127,218,0.32)"></i>
    </div><div class="c"><div class="l">${B.brandMark({ size: m, id: 'b' })}<span class="w">Poli</span></div><div class="s">Ask anything.</div></div></body></html>`;
    const tmp = path.join(__dirname, '.banner-tmp.html'); require('fs').writeFileSync(tmp, html);
    await p.goto('file://' + tmp); await p.evaluate(() => document.fonts.ready); require('fs').unlinkSync(tmp);
    await p.screenshot({ path: path.join(out, name + '.png') }); await p.close();
  }
  await b.close();
})();
