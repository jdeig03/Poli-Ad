// Renders every slide of the three weekly posts at 2160x2700. Usage: node render.js <out-dir> [scale]
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => {
  const out = process.argv[2]; const scale = Number(process.argv[3] || 2);
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: scale });
  const names = { 1: 'Post1-Thanksgiving-carousel-backup', 2: 'Post2-Chatbot-vs-Poli', 3: 'Post3-Your-City-Council' };
  await p.goto('file://' + path.join(__dirname, 'posts.html') + '?p=1&n=1');
  const counts = await p.evaluate(() => window.COUNTS);
  for (const [pi, n] of Object.entries(counts)) {
    const d = path.join(out, names[pi]); fs.mkdirSync(d, { recursive: true });
    for (let i = 1; i <= n; i++) {
      await p.goto('file://' + path.join(__dirname, 'posts.html') + `?p=${pi}&n=${i}`);
      await p.evaluate(() => window.ready);
      await p.screenshot({ path: path.join(d, `slide-${i}.png`) });
    }
  }
  await b.close();
})();
