// Renders video.html.
//   node rvideo.js timeline <out.json>
//   node rvideo.js stills <prefix> <scale> t1,t2,...
//   node rvideo.js video <out.mp4> <scale> <fps>
const { chromium } = require('playwright'); const { spawn } = require('child_process'); const path = require('path'); const fs = require('fs');
(async () => {
  const [mode, out, scale = '1', extra] = process.argv.slice(2);
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 432, height: 768 }, deviceScaleFactor: Number(scale) });
  p.on('pageerror', e => console.error('PAGEERROR', e.message));
  await p.goto('file://' + path.join(__dirname, 'video.html') + '?render'); await p.evaluate(() => window.ready);
  if (mode === 'timeline') {
    fs.writeFileSync(out, JSON.stringify(await p.evaluate(() => ({ T: window.T, MSG: window.MSG.map(m => [m[0], m[1], m[3], m[4], m[5] && m[5].tb ? m[5].tb[1] : null]) }))));
  } else if (mode === 'stills') {
    for (const t of extra.split(',').map(Number)) { await p.evaluate(t => window.render(t), t); await p.screenshot({ path: `${out}-${t.toFixed(2)}.png` }); }
  } else {
    const fps = Number(extra || 60), frames = Math.round((await p.evaluate(() => window.DUR)) * fps);
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-', '-c:v', 'libx264', '-preset', 'slow', '-crf', '12', '-pix_fmt', 'yuv420p',
      '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let f = 0; f < frames; f++) {
      await p.evaluate(t => window.render(t), f / fps);
      const buf = await p.screenshot({ type: 'png' });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (f % 60 === 0) process.stderr.write(`frame ${f}/${frames}\n`);
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }
  await b.close();
})();
