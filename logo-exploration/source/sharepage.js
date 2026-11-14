// Builds the shareable brand preview page (self-contained HTML, all marks inlined as SVG).
// Usage: node sharepage.js <out.html>
const fs = require('fs');
const B = require('./brand.js');
const C = B.COLORS;
let u = 0;
const mk = (w, o = {}) => B.brandMark({ ...o, id: 's' + (u++), size: w, smile: o.smile || (w <= 32 ? 13 : undefined) });
const fluid = (o = {}) => B.brandMark({ ...o, id: 's' + (u++) }).replace('<svg ', '<svg class="fluid" ');
const lock = (h, cls = '') => `<span class="lock ${cls}" style="--h:${h}px">${mk(Math.round(h * 1.16))}<span class="wm">Poli</span></span>`;

const html = `<title>Poli Brand Preview</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700&display=swap">
<style>
/* Layout: one calm column of full-width chapters on white, each a single idea with generous space. */
:root {
  --bg: #FFFFFF; --ink: #1D1D1F; --muted: #6E6E73; --faint: #86868B; --line: #E8E8ED; --panel: #FBFBFD;
  --blue: ${C.blue}; --purple: ${C.purple}; --red: ${C.red};
  --font: 'Inter', -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif;
  color-scheme: light;
}
* { box-sizing: border-box; }
body { background: var(--bg); color: var(--ink); font-family: var(--font); font-optical-sizing: auto; -webkit-font-smoothing: antialiased; margin: 0; }
.wrap { max-width: 1120px; margin: 0 auto; padding-left: max(20px, env(safe-area-inset-left, 0px)); padding-right: max(20px, env(safe-area-inset-right, 0px)); }
section { padding-block: clamp(64px, 10vw, 120px); text-align: center; }
section + section { border-top: 1px solid var(--line); }
.eyebrow { font-size: 15px; font-weight: 600; color: var(--faint); margin: 0; }
h1, h2 { font-weight: 700; letter-spacing: -0.03em; text-wrap: balance; margin: 8px 0 0; }
h1 { font-size: clamp(44px, 8vw, 80px); line-height: 1.02; }
h2 { font-size: clamp(32px, 5.2vw, 52px); line-height: 1.06; }
.lede { font-size: clamp(17px, 2vw, 21px); line-height: 1.5; color: var(--muted); max-width: 680px; margin: 18px auto 0; letter-spacing: -0.01em; text-wrap: pretty; }
.cap { font-size: 14px; color: var(--faint); line-height: 1.45; margin: 0; }
.cap b { color: var(--ink); font-weight: 600; }
svg.fluid { width: 100%; height: auto; display: block; }
.lock { display: inline-flex; align-items: center; gap: calc(var(--h) * 0.24); }
.lock .wm { font-weight: 600; font-size: calc(var(--h) * 1.18); letter-spacing: -0.045em; line-height: 1; color: var(--ink); }
.panel { background: var(--panel); border-radius: 28px; }
.grid { display: grid; gap: 20px; margin-top: 56px; }
.g3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.g2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.tile { padding: 40px 24px 28px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; gap: 24px; min-height: 260px; }
.icon { width: 132px; aspect-ratio: 1; border-radius: 22.37%; background: #fff; box-shadow: 0 0 0 1px rgba(0,0,0,.05), 0 2px 4px rgba(0,0,0,.04), 0 18px 40px rgba(60,60,90,.12); display: grid; place-items: center; }
/* aura field: the brand's soft, balanced wash */
.aura { position: relative; overflow: hidden; isolation: isolate; background: #fff; }
.aura::before, .aura::after, .aura > .mid { content: ''; position: absolute; border-radius: 50%; filter: blur(60px); z-index: -1; }
.aura::before { width: 62%; height: 72%; left: -14%; top: 16%; background: rgba(111,143,239,.42); }
.aura::after { width: 62%; height: 72%; right: -14%; top: 16%; background: rgba(232,102,122,.38); }
.aura > .mid { width: 46%; height: 52%; left: 27%; bottom: -18%; background: rgba(155,127,218,.36); }
/* hero */
.hero { padding-block: clamp(80px, 12vw, 150px) clamp(64px, 9vw, 110px); }
.hero .mark { width: min(340px, 64vw); margin: 0 auto; }
.hero .wm { font-weight: 600; font-size: clamp(64px, 10vw, 96px); letter-spacing: -0.045em; line-height: 1; margin-top: 52px; }
.hero .slogan { font-size: clamp(20px, 2.4vw, 26px); color: var(--muted); margin-top: 16px; letter-spacing: -0.01em; }
/* balance */
.trio { display: flex; height: 16px; border-radius: 8px; overflow: hidden; max-width: 560px; margin: 48px auto 0; }
.trio i { flex: 1; } .trio i:nth-child(1) { background: var(--blue); } .trio i:nth-child(2) { background: var(--purple); } .trio i:nth-child(3) { background: var(--red); }
.trio-l { display: flex; justify-content: space-between; max-width: 560px; margin: 12px auto 0; font-size: 14px; color: var(--muted); }
.sw { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 16px; margin-top: 48px; text-align: left; }
.sw div i { display: block; height: 110px; border-radius: 22px; }
.sw .n { font-weight: 600; font-size: 16px; margin-top: 12px; } .sw .h { font-size: 13px; color: var(--faint); margin-top: 2px; font-variant-numeric: tabular-nums; }
/* words */
.words { display: grid; gap: 16px; margin-top: 56px; grid-template-columns: repeat(2, minmax(0,1fr)); text-align: left; }
.word { padding: 32px; border-radius: 24px; background: var(--panel); min-width: 0; }
.word .line { font-weight: 700; font-size: clamp(24px, 3vw, 32px); letter-spacing: -0.025em; line-height: 1.12; text-wrap: balance; }
.word .use { font-size: 14px; color: var(--faint); margin-top: 14px; }
.word.primary { grid-column: 1 / -1; padding: 56px 40px; text-align: center; }
.word.primary .line { font-size: clamp(48px, 8vw, 88px); letter-spacing: -0.04em; }
/* website mock */
.browser { margin-top: 56px; border-radius: 22px; box-shadow: 0 0 0 1px #EDEDF2, 0 40px 80px -40px rgba(40,40,90,.3); overflow: hidden; text-align: left; background: #fff; }
.chrome { display: flex; align-items: center; gap: 10px; padding: 12px 16px; background: #F5F5F7; border-bottom: 1px solid #ECECF0; }
.dots { display: flex; gap: 7px; } .dots i { width: 11px; height: 11px; border-radius: 50%; background: #D9D9DE; }
.addr { flex: 1; max-width: 360px; margin: 0 auto; text-align: center; font-size: 13px; color: var(--muted); background: #fff; border-radius: 8px; padding: 6px 12px; }
.site-nav { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 18px clamp(18px, 4vw, 40px); }
.site-nav .links { display: flex; gap: 24px; font-size: 14px; font-weight: 500; color: #3A3A3F; white-space: nowrap; }
.btn { display: inline-block; font-size: 14px; font-weight: 600; color: #fff; background: var(--ink); padding: 10px 18px; border-radius: 999px; white-space: nowrap; }
.btn.ghost { background: rgba(255,255,255,.6); color: var(--ink); box-shadow: inset 0 0 0 1.5px #B9B9C2; }
.site-hero { padding: clamp(48px, 8vw, 96px) 20px clamp(48px, 7vw, 80px); text-align: center; }
.site-hero .t { font-weight: 700; font-size: clamp(40px, 7vw, 76px); letter-spacing: -0.04em; line-height: 1.02; }
.site-hero .s { font-size: clamp(16px, 2vw, 20px); color: #4A4A50; max-width: 560px; margin: 18px auto 0; line-height: 1.5; }
.site-hero .ctas { display: flex; gap: 12px; justify-content: center; margin-top: 28px; flex-wrap: wrap; }
.feats { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 0; border-top: 1px solid #F0F0F3; }
.feats div { padding: 28px clamp(18px, 3vw, 32px); min-width: 0; } .feats div + div { border-left: 1px solid #F0F0F3; }
.feats b { display: block; font-size: 17px; letter-spacing: -0.01em; } .feats span { display: block; font-size: 14px; color: var(--muted); margin-top: 6px; line-height: 1.5; }
/* demo widget */
.demo { margin: 56px auto 0; max-width: 620px; text-align: left; border-radius: 28px; background: #fff; box-shadow: 0 0 0 1px #EDEDF2, 0 40px 80px -40px rgba(40,40,90,.28); padding: clamp(20px, 4vw, 32px); }
.demo .hd { display: flex; gap: 16px; align-items: center; }
.demo .hd .t1 { font-weight: 700; font-size: 22px; letter-spacing: -0.02em; } .demo .hd .t2 { font-size: 13px; color: var(--muted); margin-top: 3px; }
.badge { display: inline-block; font-size: 11px; font-weight: 600; letter-spacing: .04em; color: #5B4BB0; background: #F1EDFB; padding: 3px 7px; border-radius: 6px; margin-right: 6px; }
.msgs { display: flex; flex-direction: column; gap: 12px; margin-top: 24px; }
.q { align-self: flex-end; max-width: 80%; background: var(--ink); color: #fff; font-size: 15px; padding: 11px 15px; border-radius: 18px 18px 5px 18px; }
.a { display: flex; gap: 10px; align-items: flex-start; } .a > svg { flex: none; margin-top: 2px; }
.a .b { background: #F5F5F7; border-radius: 5px 18px 18px 18px; padding: 12px 15px; font-size: 15px; line-height: 1.5; min-width: 0; }
.chips { display: flex; gap: 8px; margin-top: 20px; flex-wrap: wrap; } .chips span { font-size: 13px; padding: 7px 12px; border-radius: 999px; box-shadow: inset 0 0 0 1px #E3E3E8; }
.input { display: flex; align-items: center; gap: 10px; margin-top: 14px; border-radius: 16px; box-shadow: inset 0 0 0 1px #E3E3E8; padding: 8px 8px 8px 16px; font-size: 15px; color: var(--faint); }
.input .send { margin-left: auto; width: 34px; height: 34px; border-radius: 10px; background: linear-gradient(90deg, var(--blue), var(--purple), var(--red)); display: grid; place-items: center; }
/* socials */
.social { display: grid; grid-template-columns: 1.1fr 1fr 0.62fr; gap: 20px; margin-top: 56px; align-items: start; text-align: left; }
.ig { border-radius: 24px; box-shadow: 0 0 0 1px #EDEDF2; padding: 22px; background: #fff; min-width: 0; }
.ig .top { display: flex; align-items: center; gap: 18px; }
.ig .av { width: 84px; height: 84px; border-radius: 50%; padding: 3px; background: conic-gradient(from 200deg, #FEDA75, #FA7E1E, #D62976, #962FBF, #4F5BD5, #FEDA75); flex: none; }
.ig .av > div { width: 100%; height: 100%; border-radius: 50%; background: #fff; display: grid; place-items: center; }
.ig .handle { font-weight: 700; font-size: 17px; } .ig .st { display: flex; gap: 16px; margin-top: 8px; font-size: 13px; color: #3A3A3F; } .ig .st b { color: var(--ink); }
.ig .bio { font-size: 14px; line-height: 1.5; margin-top: 14px; } .ig .bio b { font-weight: 600; } .ig .link { color: #00376B; }
.ig .btns { display: flex; gap: 8px; margin-top: 14px; } .ig .btns span { flex: 1; text-align: center; padding: 8px; border-radius: 9px; font-size: 13px; font-weight: 600; background: #EFEFF2; } .ig .btns .f { background: #0095F6; color: #fff; }
.thumbs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3px; margin-top: 18px; border-radius: 10px; overflow: hidden; }
.thumbs > div { aspect-ratio: 1; display: grid; place-items: center; padding: 10px; text-align: center; font-weight: 700; font-size: 13px; letter-spacing: -0.01em; line-height: 1.15; }
.post { aspect-ratio: 4 / 5; border-radius: 24px; box-shadow: 0 0 0 1px #EDEDF2; padding: 28px; display: flex; flex-direction: column; justify-content: space-between; min-width: 0; }
.post .t { font-weight: 700; font-size: clamp(30px, 3.6vw, 44px); letter-spacing: -0.035em; line-height: 1.02; }
.post .s { font-size: 15px; color: #3A3A3F; margin-top: 12px; line-height: 1.45; }
.story { aspect-ratio: 9 / 16; border-radius: 24px; box-shadow: 0 0 0 1px #EDEDF2; padding: 22px 18px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 18px; min-width: 0; }
.story .t { font-weight: 700; font-size: 26px; letter-spacing: -0.03em; line-height: 1.05; }
.story .pill { font-size: 12px; font-weight: 600; padding: 8px 12px; border-radius: 999px; background: #fff; box-shadow: 0 6px 20px rgba(60,40,120,.12); }
/* extras */
.card { aspect-ratio: 1.75; border-radius: 18px; background: #fff; box-shadow: 0 0 0 1px #EDEDF2, 0 20px 40px -20px rgba(40,40,80,.25); padding: 28px; text-align: left; position: relative; overflow: hidden; }
.card .who { position: absolute; left: 28px; bottom: 26px; } .card .who b { font-size: 18px; letter-spacing: -0.01em; display: block; } .card .who span { font-size: 13px; color: var(--muted); }
.card .orb { position: absolute; right: -54px; bottom: -54px; width: 190px; }
.card.back { display: grid; place-items: center; }
.sig { border-radius: 18px; box-shadow: 0 0 0 1px #EDEDF2; padding: 24px; text-align: left; font-size: 14px; line-height: 1.55; color: #3A3A3F; }
.sig .row { display: flex; gap: 14px; align-items: center; margin-top: 14px; padding-top: 14px; border-top: 1px solid #F0F0F3; }
.foot { padding-block: 40px 64px; text-align: center; font-size: 13px; color: var(--faint); }
@media (max-width: 860px) {
  .g3, .social { grid-template-columns: 1fr 1fr; }
  .story { grid-column: span 1; }
  .feats { grid-template-columns: 1fr; } .feats div + div { border-left: 0; border-top: 1px solid #F0F0F3; }
  .site-nav .links { display: none; }
}
@media (max-width: 560px) {
  .g3, .g2, .words, .social, .sw { grid-template-columns: 1fr; }
  .story { max-width: 260px; margin: 0 auto; }
}
</style>

<main>
<section class="hero"><div class="wrap">
  <div class="mark">${fluid()}</div>
  <div class="wm">Poli</div>
  <p class="slogan">Ask anything.</p>
</div></section>

<section id="logo"><div class="wrap">
  <p class="eyebrow">The logo</p>
  <h2>A calm orb with a simple smile.</h2>
  <p class="lede">The orb is the brand's light: blue, purple and red, sharing the space equally. The smile is one clean white line. Together they say Poli is friendly, open and on every voter's side.</p>
  <div class="grid g3">
    <div class="panel tile">${mk(150)}<p class="cap"><b>Logo</b></p></div>
    <div class="panel tile">${lock(54)}<p class="cap"><b>Logo with name</b></p></div>
    <div class="panel tile"><div style="display:flex;flex-direction:column;align-items:center;gap:14px">${mk(96)}<span class="lock" style="--h:34px"><span class="wm">Poli</span></span></div><p class="cap"><b>Stacked</b></p></div>
    <div class="panel tile"><div class="icon">${mk(84)}</div><p class="cap"><b>App icon</b></p></div>
    <div class="panel tile"><div style="display:flex;gap:20px">${B.brandMark({ id: 'mi', size: 104, mono: C.ink })}${B.brandMark({ id: 'mp', size: 104, mono: C.purple })}</div><p class="cap"><b>One colour</b> · print and merchandise</p></div>
    <div class="panel tile"><div style="display:flex;gap:22px;align-items:flex-end">${mk(56)}${mk(32)}${mk(20, { smile: 15 })}</div><p class="cap"><b>Small sizes</b> · the line thickens slightly</p></div>
  </div>
</div></section>

<section id="balance"><div class="wrap">
  <p class="eyebrow">The idea</p>
  <h2>Left, right, and everything in between.</h2>
  <p class="lede">The three colours stand for every voter, so they always appear together and in equal measure. Blue and red are matched in brightness, and the light falls from straight above.</p>
  <div class="trio"><i></i><i></i><i></i></div>
  <div class="trio-l"><span>Blue 33%</span><span>Purple 33%</span><span>Red 35%</span></div>
  <div class="sw">
    <div><i style="background:var(--blue)"></i><div class="n">Aura Blue</div><div class="h">${C.blue}</div></div>
    <div><i style="background:var(--purple)"></i><div class="n">Aura Purple</div><div class="h">${C.purple}</div></div>
    <div><i style="background:var(--red)"></i><div class="n">Aura Red</div><div class="h">${C.red}</div></div>
  </div>
</div></section>

<section id="words"><div class="wrap">
  <p class="eyebrow">How Poli talks</p>
  <h2>Short, plain and warm.</h2>
  <p class="lede">One slogan leads everywhere. A few supporting lines carry it to voters and to campaigns.</p>
  <div class="words">
    <div class="word primary aura"><div class="mid"></div><div class="line">Ask anything.</div><div class="use">The slogan. Under the logo, on the home page, at the end of every video.</div></div>
    <div class="word"><div class="line">Ask candidates anything. Get answers in their own words.</div><div class="use">For voters</div></div>
    <div class="word"><div class="line">You can't be everywhere. Your AI Representative can.</div><div class="use">For candidates</div></div>
    <div class="word"><div class="line">Your personal town hall.</div><div class="use">What Poli is, in four words</div></div>
    <div class="word"><div class="line">Straight from the candidate. No media spin.</div><div class="use">Why voters can trust it</div></div>
    <div class="word"><div class="line">If it doesn't know, it says so.</div><div class="use">How it handles what it can't answer</div></div>
    <div class="word"><div class="line">Look for "Ask [Candidate]" on their website.</div><div class="use">Where to find it</div></div>
  </div>
</div></section>

<section id="website"><div class="wrap">
  <p class="eyebrow">Website</p>
  <h2>askpoli.us, in the new look.</h2>
  <div class="browser">
    <div class="chrome"><div class="dots"><i></i><i></i><i></i></div><div class="addr">askpoli.us</div><div style="width:47px"></div></div>
    <div class="site-nav">${lock(22)}<div class="links"><span>How it works</span><span>For voters</span><span>For candidates</span><span>FAQ</span></div><span class="btn">Try it free</span></div>
    <div class="site-hero aura"><div class="mid"></div>
      <div style="width:84px;margin:0 auto 26px">${fluid()}</div>
      <div class="t">Ask anything.</div>
      <p class="s">Poli puts an AI Representative on a candidate's own website. Voters get answers in the candidate's own words, day or night.</p>
      <div class="ctas"><span class="btn">See how it works</span><span class="btn ghost">For candidates</span></div></div>
    <div class="feats">
      <div><b>Straight from the candidate</b><span>Answers come only from what the campaign shared.</span></div>
      <div><b>Open 24/7</b><span>No account needed. Ask at midnight or at noon.</span></div>
      <div><b>Every question counts</b><span>Campaigns see what voters care about most.</span></div>
    </div>
  </div>
</div></section>

<section id="demo"><div class="wrap">
  <p class="eyebrow">Demo</p>
  <h2>The orb, right where voters ask.</h2>
  <p class="lede">The Ask widget on a campaign site, using the demo candidate from askpoli.us.</p>
  <div class="demo">
    <div class="hd">${mk(56)}<div><div class="t1">Ask Alex Rivera</div><div class="t2"><span class="badge">AI</span>AI Representative for Alex's campaign</div></div></div>
    <div class="msgs">
      <div class="q">What is your plan for housing costs?</div>
      <div class="a">${mk(28)}<div class="b">Alex wants to cut new-home permit waits from 143 days to 70, allow starter homes near the Route 9 bus line, and create a $1.5 million repair fund for small landlords who keep rents fair.</div></div>
    </div>
    <div class="chips"><span>Where do you stand on public safety?</span><span>How can I volunteer?</span></div>
    <div class="input">Ask anything…<span class="send"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg></span></div>
  </div>
</div></section>

<section id="socials"><div class="wrap">
  <p class="eyebrow">Socials</p>
  <h2>Instantly recognisable in a feed.</h2>
  <div class="social">
    <div class="ig">
      <div class="top"><div class="av"><div>${mk(60)}</div></div><div><div class="handle">askpolius</div><div class="st"><span><b>48</b> posts</span><span><b>1,284</b> followers</span></div></div></div>
      <div class="bio"><b>Poli</b><br>Ask anything. Straight answers from the candidates on your ballot, in their own words.<br><span class="link">askpoli.us</span></div>
      <div class="btns"><span class="f">Follow</span><span>Message</span></div>
      <div class="thumbs">
        <div class="aura"><div class="mid"></div>Ask anything.</div>
        <div style="background:#F5F5F7">${mk(54)}</div>
        <div class="aura"><div class="mid"></div>Your personal town hall.</div>
        <div style="background:#F5F5F7;font-size:12px">If it doesn't know, it says so.</div>
        <div class="aura"><div class="mid"></div>${mk(40)}</div>
        <div style="background:#F5F5F7;font-size:12px">No media spin.</div>
      </div>
    </div>
    <div class="post aura"><div class="mid"></div>${lock(20)}<div><div class="t">Ask your candidate anything.</div><div class="s">Get answers in their own words. Look for "Ask [Candidate]" on their website.</div></div></div>
    <div class="story aura"><div class="mid"></div><div style="width:70px">${fluid()}</div><div class="t">Ask anything.</div><span class="pill">askpoli.us</span></div>
  </div>
</div></section>

<section id="more"><div class="wrap">
  <p class="eyebrow">And everywhere else</p>
  <h2>Business card and email.</h2>
  <div class="grid g3" style="align-items:start">
    <div class="card">${lock(20)}<div class="who"><b>Your Name</b><span>Co-founder · askpoli.us</span></div><div class="orb">${fluid()}</div></div>
    <div class="card back aura"><div class="mid"></div><div style="text-align:center">${mk(72)}<div style="font-weight:600;font-size:18px;letter-spacing:-0.02em;margin-top:14px">Ask anything.</div></div></div>
    <div class="sig">Thanks,<br><b style="color:var(--ink)">Your Name</b><br>Co-founder, Poli<div class="row">${lock(16)}<span style="color:var(--faint)">Ask anything. · askpoli.us</span></div></div>
  </div>
</div></section>
</main>
<div class="foot wrap">Poli brand preview, concept v0.1. Typeface shown is Inter. Final logo files will be redrawn as production vectors once approved.</div>`;

fs.writeFileSync(process.argv[2], html);
console.log('wrote', process.argv[2], (html.length / 1024).toFixed(0) + ' KB');
