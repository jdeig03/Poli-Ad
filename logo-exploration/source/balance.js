// Renders a mark to PNG for colour-balance measurement. node balance.js <marks-module> <name> <out.png>
const { chromium } = require('playwright'); const M = require(process.argv[2]);
(async()=>{ const b=await chromium.launch(); const p=await b.newPage({viewport:{width:540,height:540}});
 await p.setContent(`<body style="margin:0;background:#fff">${M.mark(process.argv[3],{halo:false}).replace('<svg','<svg width="540" height="540"')}</body>`);
 await p.screenshot({path:process.argv[4]}); await b.close(); })();
