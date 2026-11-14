const { chromium } = require('playwright'); const M = require('./marks.js');
(async()=>{ const b=await chromium.launch(); const p=await b.newPage({viewport:{width:540,height:540}});
 for (const n of M.names) { await p.setContent(`<body style="margin:0;background:#fff">${M.mark(n,{glow:false}).replace('<svg','<svg width="540" height="540"')}</body>`);
  await p.screenshot({path:`/tmp/claude-0/-home-user-Poli-Ad/e3c141a4-7c03-5974-b205-487640dff333/scratchpad/c_${n}.png`}); }
 await b.close(); })();
