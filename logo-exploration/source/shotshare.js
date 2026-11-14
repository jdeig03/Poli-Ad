// Screenshots the share page (desktop + phone) for review: node shotshare.js <html> <outPrefix>
const { chromium } = require('playwright'); const fs=require('fs');
(async()=>{ const b=await chromium.launch(); const src=fs.readFileSync(process.argv[2],'utf8');
 const page='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>'+src+'</body></html>';
 for (const [w,n,s] of [[1280,'desktop',1],[390,'phone',2]]) { const p=await b.newPage({viewport:{width:w,height:900},deviceScaleFactor:s});
  await p.setContent(page,{waitUntil:'load'}); await p.evaluate(()=>document.fonts.ready);
  const ov=await p.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth); console.log(n,'horizontal overflow px:',ov);
  await p.screenshot({path:process.argv[3]+'-'+n+'.png',fullPage:true}); await p.close(); }
 await b.close(); })();
