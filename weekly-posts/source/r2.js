const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch({ args: ['--allow-file-access-from-files'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: Number(process.argv[3] || 1) });
  p.on('pageerror', e => console.error('ERR', e.message));
  for (let i = 1; i <= 8; i++) { await p.goto('file://' + path.join(__dirname, 'posts.html') + `?p=2&n=${i}`); await p.evaluate(() => window.ready); await p.screenshot({ path: `${process.argv[2]}/slide-${i}.png` }); }
  await b.close(); })();
