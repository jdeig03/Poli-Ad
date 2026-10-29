// Renders phone.html frame-by-frame. Usage:
//   node render.js stills <outPrefix> <scale> t1,t2,...
//   node render.js video <out.mp4> <scale> [fps]
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
(async () => {
  const [mode, out, scale = '1', extra] = process.argv.slice(2);
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 432, height: 768 }, deviceScaleFactor: Number(scale) });
  page.on('pageerror', e => console.error('PAGEERROR', e.message));
  await page.goto('file://' + path.join(__dirname, 'phone.html') + '?render');
  await page.evaluate(() => window.ready);
  if (mode === 'stills') {
    for (const t of extra.split(',').map(Number)) { await page.evaluate(t => window.render(t), t); await page.screenshot({ path: `${out}-${t.toFixed(2)}.png` }); }
  } else {
    const fps = Number(extra || 60); const dur = await page.evaluate(() => window.DUR);
    const frames = Math.round(dur * fps);
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '10', '-pix_fmt', 'yuv420p', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let f = 0; f < frames; f++) {
      await page.evaluate(t => window.render(t), f / fps);
      const buf = await page.screenshot({ type: 'png' });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (f % 60 === 0) process.stderr.write(`frame ${f}/${frames}\n`);
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }
  await browser.close();
})();
