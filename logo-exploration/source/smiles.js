// Renders the smile study grid and each variant for measurement.
const { chromium } = require('playwright'); const M = require('./brand.js');
(async()=>{ const b=await chromium.launch(); const S='/tmp/claude-0/-home-user-Poli-Ad/e3c141a4-7c03-5974-b205-487640dff333/scratchpad/';
 const p=await b.newPage({viewport:{width:1790,height:420}}); const names=['calm','petite','wide','balanced','small','concentric'];
 const cell=n=>`<div style="background:#fff;width:288px;height:396px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:28px">${M.brandMark({id:n,smileStyle:n,size:220})}<div style="display:flex;gap:18px;align-items:center">${M.brandMark({id:n+'s',smileStyle:n,size:40})}${M.brandMark({id:n+'t',smileStyle:n,size:20})}</div><div style="font:600 15px sans-serif">${M.SMILES[n].title}</div></div>`;
 await p.setContent(`<body style="margin:0;padding:12px;background:#ddd;display:flex;gap:6px">${names.map(cell).join('')}</body>`); await p.screenshot({path:S+'smiles.png'});
 await p.setViewportSize({width:540,height:540});
 for (const n of names){ await p.setContent(`<body style="margin:0;background:#fff">${M.brandMark({id:'m'+n,smileStyle:n,size:540})}</body>`); await p.screenshot({path:S+`sm_${n}.png`}); }
 await b.close(); })();
