// Renders Poli avatar renditions to PNG via headless Chromium (WebGL / SwiftShader).
// Usage: node render.js <out-dir> <name>=<query> [<name>=<query> ...]
//   e.g. node render.js ../ Poli-Avatar-Companion="v=companion"
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(ROOT) || !fs.existsSync(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
});

(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;
  const out = process.argv[2];
  const jobs = process.argv.slice(3).map(a => { const i = a.indexOf('='); return [a.slice(0, i), a.slice(i + 1)]; });
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  for (const [name, query] of jobs) {
    const page = await browser.newPage({ viewport: { width: 1024, height: 1024 }, deviceScaleFactor: 1 });
    page.on('console', m => { if (m.type() === 'error') console.error(name, m.text()); });
    page.on('pageerror', e => console.error(name, e.message));
    await page.goto(`http://127.0.0.1:${port}/${process.env.PAGE || 'avatar.html'}?${query}`);
    await page.waitForFunction(() => window.done === true, null, { timeout: 600000 });
    const data = await page.evaluate(() => document.querySelector('canvas').toDataURL('image/png'));
    fs.writeFileSync(path.join(out, name + '.png'), Buffer.from(data.split(',')[1], 'base64'));
    console.log('rendered', name);
    await page.close();
  }
  await browser.close(); server.close();
})();
