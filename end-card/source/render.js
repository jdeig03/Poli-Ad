// Renders endcard.html frame-by-frame and pipes PNGs to ffmpeg.
// Usage:
//   node render.js <out-prefix> [--scale 2]          -> <prefix>-60fps.mp4, <prefix>-30fps.mp4, <prefix>-ProRes422HQ-30fps.mov
//   node render.js <out-prefix> [--scale 2] --stills t1,t2,...
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');

const arg = (name, def) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : def; };

(async () => {
  const out = process.argv[2] || 'endcard';
  const scale = Number(arg('--scale', 1));
  const stills = arg('--stills', null);
  const fps = 60;
  const W = 1080 * scale, H = 1920 * scale;
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.goto('file://' + path.join(__dirname, 'endcard.html') + `?render&scale=${scale}`);
  await page.evaluate(() => window.ready);
  const canvas = await page.$('#c');

  if (stills) {
    for (const t of stills.split(',').map(Number)) {
      await page.evaluate(t => window.render(t), t);
      await canvas.screenshot({ path: `${out}-${t.toFixed(2)}.png` });
    }
    await browser.close();
    return;
  }

  const dur = await page.evaluate(() => window.DUR);
  const frames = Math.round(dur * fps);
  const h264 = ['-c:v', 'libx264', '-preset', 'veryslow', '-crf', '8', '-pix_fmt', 'yuv420p', '-profile:v', 'high',
    '-level', '5.2', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-movflags', '+faststart'];
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
    '-filter_complex', '[0:v]split=3[a][b][c];[b]fps=30[b30];[c]fps=30[c30]',
    '-map', '[a]', ...h264, `${out}-60fps.mp4`,
    '-map', '[b30]', ...h264, `${out}-30fps.mp4`,
    '-map', '[c30]', '-c:v', 'prores_ks', '-profile:v', '3', '-pix_fmt', 'yuv422p10le', '-vendor', 'apl0',
    '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', `${out}-ProRes422HQ-30fps.mov`],
    { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = 0; f < frames; f++) {
    await page.evaluate(([t, f]) => window.render(t, f), [f / fps, f]);
    const buf = await canvas.screenshot({ type: 'png' });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 30 === 0) process.stderr.write(`frame ${f}/${frames}\n`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
})();
