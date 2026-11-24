// usage: node render.js <outDir> [stills|video] [sceneFilter] [scale]
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const { scenes, html, W, H } = require('./scenes');

const [outDir, mode = 'stills', filter = '', scaleArg = '1'] = process.argv.slice(2);
const FPS = 30, DUR = 7;

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: +scaleArg });
  for (const sc of scenes.filter(s => s.name.includes(filter))) {
    const file = path.join(__dirname, 'html', sc.name + '.html');
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, html(sc));
    await page.goto('file://' + file);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);
    const seek = t => page.evaluate(async ms => { const an = document.getAnimations(); for (const a of an) a.pause(); await Promise.all(an.map(a => a.ready)); for (const a of an) a.currentTime = ms; await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); }, t * 1000);
    if (mode === 'stills') {
      await seek(sc.still);
      await page.screenshot({ path: path.join(outDir, sc.name + '.png') });
      console.log('still', sc.name);
    } else {
      const fdir = path.join(__dirname, 'frames', sc.name);
      fs.rmSync(fdir, { recursive: true, force: true }); fs.mkdirSync(fdir, { recursive: true });
      for (let i = 0; i < FPS * DUR; i++) {
        await seek(i / FPS);
        await page.screenshot({ path: path.join(fdir, String(i).padStart(4, '0') + '.png') });
      }
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(fdir, '%04d.png'),
        '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '15', '-preset', 'slow', '-movflags', '+faststart', path.join(outDir, sc.name + '.mp4')]);
      fs.rmSync(fdir, { recursive: true, force: true });
      console.log('video', sc.name);
    }
  }
  await browser.close();
})();
