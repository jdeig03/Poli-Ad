// Scene builder for the "Two Thanksgivings" TikTok green-screen visuals.
// Every scene is a 1080x1920 SVG. No words — only shapes, icons and dates.
const path = require('path');
const topo = require('topojson-client');
const { geoPath } = require('d3-geo');
const us = require('us-atlas/states-albers-10m.json');

const W = 1080, H = 1920;
const f = n => +n.toFixed(2);

const C = {
  ink: '#3A3346', inkSoft: '#8C8094', faint: '#D9CCBD',
  paper: '#FFFDF8', paper2: '#F6EEE3',
  cran: '#C8443C', cranDk: '#9C2F29', cranLt: '#F4C9C2',
  pump: '#EE8A3C', pumpDk: '#C4672A', pumpLt: '#FBD9B8',
  must: '#F4B841', mustDk: '#D4952A', mustLt: '#FCEAB9',
  teal: '#2E8C8A', tealDk: '#1F6766', tealLt: '#C4E3DF',
  sage: '#8DB580', sageDk: '#5D8B57', pine: '#3E8458', pineDk: '#2C6542',
  sky: '#BFDCEB', brown: '#8A5434',
};

// ---------- geometry helpers ----------
function smooth(p, closed = false) {
  const n = p.length;
  const get = i => closed ? p[(i + n) % n] : p[Math.max(0, Math.min(n - 1, i))];
  let d = `M${f(p[0][0])} ${f(p[0][1])}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2);
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d + (closed ? 'Z' : '');
}
// hand-drawn marker circle (slightly overshooting, like a pen loop)
function scribble(cx, cy, r, seed = 0.7) {
  const pts = [], n = 44, start = -125 * Math.PI / 180, total = Math.PI * 2 * 1.1;
  for (let i = 0; i <= n; i++) {
    const t = i / n, a = start + total * t;
    const rr = r * (1 + 0.035 * Math.sin(t * Math.PI * 3 + seed) + 0.06 * t);
    pts.push([cx + rr * Math.cos(a) * 1.05, cy + rr * Math.sin(a) * 0.95]);
  }
  return smooth(pts);
}
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

// ---------- shared defs ----------
const fontDir = path.join(__dirname, 'node_modules/@fontsource/fredoka/files');
const defs = `
<defs>
  <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#FFF8EE"/><stop offset="1" stop-color="#FBE9D4"/>
  </linearGradient>
  <filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="90"/></filter>
  <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%">
    <feDropShadow dx="0" dy="18" stdDeviation="20" flood-color="#7A4524" flood-opacity="0.16"/>
  </filter>
  <filter id="shadowSm" x="-30%" y="-30%" width="160%" height="170%">
    <feDropShadow dx="0" dy="8" stdDeviation="9" flood-color="#7A4524" flood-opacity="0.18"/>
  </filter>
  <radialGradient id="tkBody" cx="0.36" cy="0.28" r="0.85">
    <stop offset="0" stop-color="#F2B56A"/><stop offset="0.45" stop-color="#D5803A"/><stop offset="1" stop-color="#9E5223"/>
  </radialGradient>
  <radialGradient id="tkLeg" cx="0.35" cy="0.3" r="0.9">
    <stop offset="0" stop-color="#EFAE63"/><stop offset="1" stop-color="#A9592A"/>
  </radialGradient>
  <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="#FFD27A" stop-opacity="0.85"/><stop offset="1" stop-color="#FFD27A" stop-opacity="0"/>
  </radialGradient>
  <pattern id="stripes" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <rect width="22" height="22" fill="${C.teal}"/><rect width="11" height="22" fill="${C.pump}"/>
  </pattern>

  <!-- roast turkey on a platter, 400 x 300 -->
  <symbol id="turkey" viewBox="0 0 400 300" overflow="visible">
    <ellipse cx="200" cy="266" rx="176" ry="22" fill="#5B341C" opacity="0.10"/>
    <ellipse cx="200" cy="244" rx="194" ry="44" fill="#E6D8C5"/>
    <ellipse cx="200" cy="236" rx="194" ry="44" fill="#FFFDF8"/>
    <ellipse cx="200" cy="236" rx="162" ry="31" fill="#F2E9DC"/>
    <!-- greens behind -->
    <g fill="${C.sageDk}">
      <ellipse cx="62" cy="220" rx="30" ry="13" transform="rotate(-25 62 220)"/>
      <ellipse cx="338" cy="220" rx="30" ry="13" transform="rotate(25 338 220)"/>
    </g>
    <g fill="${C.sage}">
      <ellipse cx="80" cy="212" rx="24" ry="11" transform="rotate(-50 80 212)"/>
      <ellipse cx="320" cy="212" rx="24" ry="11" transform="rotate(50 320 212)"/>
    </g>
    <!-- body -->
    <path d="M60 222 C46 150 118 90 204 88 C292 86 358 148 342 222 C292 244 108 244 60 222Z" fill="url(#tkBody)"/>
    <path d="M250 132 C300 140 328 176 316 214 C288 206 262 182 250 132Z" fill="#9E5223" opacity="0.35"/>
    <path d="M108 150 C130 118 168 104 214 104" stroke="#FAD39C" stroke-width="13" stroke-linecap="round" fill="none" opacity="0.75"/>
    <path d="M232 106 C246 107 258 110 268 114" stroke="#FAD39C" stroke-width="10" stroke-linecap="round" fill="none" opacity="0.55"/>
    <!-- drumsticks -->
    <g id="tkDrum">
      <ellipse cx="128" cy="182" rx="50" ry="31" transform="rotate(-36 128 182)" fill="url(#tkLeg)"/>
      <path d="M92 155 L72 140" stroke="#FFF7EA" stroke-width="15" stroke-linecap="round"/>
      <circle cx="75" cy="131" r="9.5" fill="#FFF7EA"/><circle cx="64" cy="145" r="9.5" fill="#FFF7EA"/>
      <path d="M96 150 l-8 -12 l9 2 l-1 -9 l8 6 l2 -9 l5 9" fill="none" stroke="#FFFDF8" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>
      <path d="M112 168 C120 162 132 162 142 166" stroke="#FAD39C" stroke-width="7" stroke-linecap="round" fill="none" opacity="0.7"/>
    </g>
    <use href="#tkDrum" transform="translate(400 0) scale(-1 1)"/>
    <!-- garnish in front -->
    <circle cx="96" cy="240" r="15" fill="${C.pump}"/><circle cx="96" cy="240" r="9" fill="#FFC27C"/>
    <circle cx="304" cy="240" r="15" fill="${C.pump}"/><circle cx="304" cy="240" r="9" fill="#FFC27C"/>
    <g fill="${C.cran}"><circle cx="124" cy="250" r="8"/><circle cx="138" cy="244" r="7"/><circle cx="270" cy="248" r="8"/><circle cx="257" cy="254" r="7"/><circle cx="200" cy="256" r="8"/><circle cx="186" cy="252" r="6"/><circle cx="214" cy="252" r="6"/></g>
    <g fill="${C.sage}"><ellipse cx="160" cy="252" rx="14" ry="6" transform="rotate(12 160 252)"/><ellipse cx="236" cy="254" rx="14" ry="6" transform="rotate(-12 236 254)"/></g>
  </symbol>

  <!-- christmas tree, 100 x 120 -->
  <symbol id="tree" viewBox="0 0 100 120" overflow="visible">
    <rect x="43" y="96" width="14" height="18" rx="3" fill="${C.brown}"/>
    <path d="M50 30 L86 100 Q50 108 14 100Z" fill="${C.pineDk}" stroke="${C.pineDk}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M50 18 L78 72 Q50 80 22 72Z" fill="${C.pine}" stroke="${C.pine}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M50 8 L68 44 Q50 50 32 44Z" fill="#4E9B68" stroke="#4E9B68" stroke-width="6" stroke-linejoin="round"/>
    <path d="M50 -6 l4.5 9 10 1.4 -7.2 7 1.7 10 -9 -4.7 -9 4.7 1.7 -10 -7.2 -7 10 -1.4z" fill="${C.must}" stroke="${C.must}" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="40" cy="62" r="5" fill="${C.cran}"/><circle cx="62" cy="84" r="5" fill="${C.must}"/><circle cx="34" cy="90" r="5" fill="${C.cranLt}"/><circle cx="58" cy="40" r="4.5" fill="${C.must}"/><circle cx="70" cy="94" r="4.5" fill="${C.cran}"/>
  </symbol>

  <!-- autumn leaf, centered at 0,0 -->
  <symbol id="leaf" viewBox="-40 -40 80 80" overflow="visible">
    <path d="M0 -34 C20 -22 24 10 0 34 C-24 10 -20 -22 0 -34Z"/>
    <path d="M0 -26 V30 M0 -4 L11 -14 M0 8 L-11 -2 M0 18 L9 10" stroke="#FFFFFF" stroke-opacity="0.55" stroke-width="3" stroke-linecap="round" fill="none"/>
  </symbol>
</defs>`;

const css = `
@font-face{font-family:Fredoka;font-weight:500;src:url('file://${fontDir}/fredoka-latin-500-normal.woff2')}
@font-face{font-family:Fredoka;font-weight:600;src:url('file://${fontDir}/fredoka-latin-600-normal.woff2')}
@font-face{font-family:Fredoka;font-weight:700;src:url('file://${fontDir}/fredoka-latin-700-normal.woff2')}
html,body{margin:0;padding:0;background:#FFF8EE}
svg{display:block;font-family:Fredoka,sans-serif}
.pop{animation:pop .75s cubic-bezier(.34,1.56,.64,1) both;transform-box:fill-box;transform-origin:center}
@keyframes pop{0%{opacity:0;transform:scale(.55)}60%{opacity:1}100%{opacity:1;transform:scale(1)}}
.popB{animation:pop .75s cubic-bezier(.34,1.56,.64,1) both;transform-box:fill-box;transform-origin:50% 100%}
.rise{animation:rise .9s cubic-bezier(.2,.8,.2,1) both}
@keyframes rise{from{opacity:0;transform:translateY(70px)}to{opacity:1;transform:none}}
.fade{animation:fade .7s ease both}
@keyframes fade{from{opacity:0}to{opacity:1}}
.draw{stroke-dasharray:1;stroke-dashoffset:1;animation:draw .9s cubic-bezier(.5,0,.3,1) both}
@keyframes draw{to{stroke-dashoffset:0}}
.grow{animation:grow .55s cubic-bezier(.3,.7,.2,1) both;transform-box:fill-box;transform-origin:0% 50%}
@keyframes grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.float{animation:float 3.2s ease-in-out infinite alternate}
@keyframes float{from{transform:translateY(-9px)}to{transform:translateY(9px)}}
.sway{animation:sway 3.6s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:50% 0%}
@keyframes sway{from{transform:rotate(-7deg)}to{transform:rotate(7deg)}}
.steam{animation:steam 2.4s ease-in-out infinite}
@keyframes steam{0%{opacity:0;transform:translateY(14px)}35%{opacity:.75}100%{opacity:0;transform:translateY(-36px)}}
.pulse{animation:pulse 1.6s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
.shiver{animation:shiver .32s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:50% 100%}
@keyframes shiver{from{transform:rotate(-1.6deg)}to{transform:rotate(1.6deg)}}
.drip{animation:drip 1.6s ease-in infinite}
@keyframes drip{0%{opacity:0;transform:translateY(-6px)}20%{opacity:1}80%{opacity:1;transform:translateY(26px)}100%{opacity:0;transform:translateY(32px)}}
.shrug{animation:shrug 1.4s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}
@keyframes shrug{0%,30%,100%{transform:translateY(0)}55%,75%{transform:translateY(-12px)}}
.wobble{animation:wobble 2.2s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:50% 80%}
@keyframes wobble{from{transform:rotate(-8deg)}to{transform:rotate(8deg)}}
`;

const d = s => `style="animation-delay:${s}s"`;

function background(seed = 1) {
  const r = rng(seed);
  return `<rect width="${W}" height="${H}" fill="url(#bgGrad)"/>
  <g filter="url(#blur)" opacity="0.55">
    <circle cx="${150 + r() * 120}" cy="${260 + r() * 120}" r="260" fill="#FFD9B0"/>
    <circle cx="${880 - r() * 120}" cy="${820 + r() * 160}" r="300" fill="#FCE3A6"/>
    <circle cx="540" cy="1650" r="420" fill="#F9D7C4"/>
  </g>`;
}

function steamLines(cx, y, scale = 1, delay = 0) {
  const one = (x, dl) => `<path class="steam" ${d(dl)} d="M${x} ${y} c-12 -16 12 -28 0 -44 c-12 -16 12 -28 0 -44" transform-origin="${x} ${y}" stroke="#FFFFFF" stroke-width="${9 * scale}" stroke-linecap="round" fill="none"/>`;
  return `<g opacity="0.95">${one(cx - 46 * scale, delay)}${one(cx, delay + 0.8)}${one(cx + 46 * scale, delay + 1.6)}</g>`;
}

// ---------- calendar ----------
function monthRows(startDow, n) {
  const rows = []; let row = Array(7).fill(null), c = startDow;
  for (let i = 1; i <= n; i++) { row[c] = { n: i, key: i }; if (++c === 7) { rows.push(row); row = Array(7).fill(null); c = 0; } }
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

function calendar({ x, y, w, rows, header = C.cran, headerDk = C.cranDk, thu = true, hide = [], focusCol = -1 }) {
  const pad = w * 0.06, cell = (w - 2 * pad) / 7, headH = cell * 1.12, wkH = cell * 0.66, rowH = cell * 0.9;
  const h = headH + wkH + rows.length * rowH + pad * 0.75, rad = cell * 0.3;
  const gx = x + pad, gy = y + headH + wkH;
  const pos = {};
  let s = `<g filter="url(#shadow)"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rad}" fill="${C.paper}"/></g>`;
  s += `<path d="M${x} ${y + headH} V${y + rad} Q${x} ${y} ${x + rad} ${y} H${x + w - rad} Q${x + w} ${y} ${x + w} ${y + rad} V${y + headH}Z" fill="${header}"/>`;
  s += `<rect x="${x}" y="${y + headH - cell * 0.1}" width="${w}" height="${cell * 0.1}" fill="${headerDk}" opacity="0.35"/>`;
  for (const fx of [0.27, 0.73]) {
    const rx = x + w * fx, hy = y + headH * 0.42;
    s += `<ellipse cx="${rx}" cy="${hy}" rx="${cell * 0.12}" ry="${cell * 0.085}" fill="${headerDk}"/>`;
    s += `<rect x="${rx - cell * 0.065}" y="${y - cell * 0.26}" width="${cell * 0.13}" height="${cell * 0.26 + headH * 0.42}" rx="${cell * 0.065}" fill="#BDB4C0"/>`;
    s += `<rect x="${rx - cell * 0.02}" y="${y - cell * 0.2}" width="${cell * 0.035}" height="${cell * 0.2 + headH * 0.36}" rx="${cell * 0.02}" fill="#E6E0E8"/>`;
  }
  if (thu) s += `<rect x="${gx + cell * 4.07}" y="${y + headH + wkH * 0.14}" width="${cell * 0.86}" height="${wkH * 0.86 + rows.length * rowH - rowH * 0.04}" rx="${cell * 0.3}" fill="${C.pumpLt}" opacity="0.55"/>`;
  for (let c = 0; c < 7; c++) {
    const cx = gx + cell * (c + 0.5), cy = y + headH + wkH * 0.55;
    s += c === 4 ? `<circle cx="${cx}" cy="${cy}" r="${cell * 0.1}" fill="${C.pump}"/>` : `<circle cx="${cx}" cy="${cy}" r="${cell * 0.06}" fill="${C.faint}"/>`;
  }
  rows.forEach((row, r) => row.forEach((cel, c) => {
    if (!cel) return;
    const cx = gx + cell * (c + 0.5), cy = gy + rowH * (r + 0.5);
    pos[cel.key] = [cx, cy, r, c];
    if (hide.includes(cel.key)) return;
    s += `<text x="${f(cx)}" y="${f(cy)}" text-anchor="middle" dominant-baseline="central" font-size="${f(cell * 0.4)}" font-weight="600" fill="${cel.dim || (focusCol >= 0 && c !== focusCol) ? '#CBBFB2' : C.ink}">${cel.n}</text>`;
  }));
  return { svg: s, pos, cell, rowH, h, gx, gy };
}

function numText(x, y, n, size, fill = C.ink, weight = 600) {
  return `<text x="${f(x)}" y="${f(y)}" text-anchor="middle" dominant-baseline="central" font-size="${f(size)}" font-weight="${weight}" fill="${fill}">${n}</text>`;
}

// tear-off calendar page (rings on top, colored header)
function page({ x, y, w, h, header = C.cran, headerDk = C.cranDk, body = '' }) {
  const hh = h * 0.17, rad = w * 0.08;
  let s = `<g filter="url(#shadow)"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rad}" fill="${C.paper}"/></g>`;
  s += `<path d="M${x} ${y + hh} V${y + rad} Q${x} ${y} ${x + rad} ${y} H${x + w - rad} Q${x + w} ${y} ${x + w} ${y + rad} V${y + hh}Z" fill="${header}"/>`;
  s += `<rect x="${x}" y="${y + hh - h * 0.015}" width="${w}" height="${h * 0.015}" fill="${headerDk}" opacity="0.35"/>`;
  for (const fx of [0.28, 0.72]) {
    const rx = x + w * fx, hy = y + hh * 0.45, u = w * 0.035;
    s += `<ellipse cx="${rx}" cy="${hy}" rx="${u * 1.25}" ry="${u * 0.9}" fill="${headerDk}"/>`;
    s += `<rect x="${rx - u * 0.65}" y="${y - u * 2.4}" width="${u * 1.3}" height="${u * 2.4 + hh * 0.45}" rx="${u * 0.65}" fill="#BDB4C0"/>`;
  }
  return s + body;
}

function arrowHead(x, y, ang, len, color, sw) {
  const a1 = ang + Math.PI * 0.78, a2 = ang - Math.PI * 0.78;
  return `<path d="M${f(x + len * Math.cos(a1))} ${f(y + len * Math.sin(a1))} L${f(x)} ${f(y)} L${f(x + len * Math.cos(a2))} ${f(y + len * Math.sin(a2))}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

// =====================================================================
// SCENES
// =====================================================================
const scenes = [];

// ---- Clip 1: two turkeys, each on its own calendar page ----
scenes.push({
  name: 'clip1-two-thanksgivings', still: 3.2,
  svg: (() => {
    let s = background(3);
    const r = rng(11);
    const leafSpots = [[120, 300], [960, 260], [540, 210], [90, 1010], [990, 1060], [300, 1130], [780, 1150], [70, 640], [1010, 640]];
    const leafCols = [C.pump, C.must, C.cran, C.mustDk, C.pump, C.cran, C.must, C.pumpDk, C.cran];
    leafSpots.forEach(([lx, ly], i) => {
      const sz = 80 + r() * 40, rot = r() * 360;
      s += `<g class="fade" ${d(0.3 + i * 0.08)}><g class="float" style="animation-delay:-${(r() * 3).toFixed(2)}s;animation-duration:${(2.6 + r() * 1.6).toFixed(2)}s"><use href="#leaf" x="${lx - sz / 2}" y="${ly - sz / 2}" width="${sz}" height="${sz}" fill="${leafCols[i]}" opacity="0.8" transform="rotate(${rot.toFixed(0)} ${lx} ${ly})"/></g></g>`;
    });
    const pw = 410, ph = 560;
    [[305, -6, '23', 0], [775, 6, '30', 0.25]].forEach(([cx, rot, num, dl]) => {
      const x = cx - pw / 2, y = 380;
      const body = `<use href="#turkey" x="${x + 28}" y="${y + 150}" width="${pw - 56}" height="${(pw - 56) * 0.75}"/>
        ${steamLines(cx, y + 220, 0.9, dl)}
        <line x1="${x + 60}" y1="${y + 455}" x2="${x + pw - 60}" y2="${y + 455}" stroke="${C.paper2}" stroke-width="4" stroke-linecap="round"/>
        ${numText(cx, y + 500, num, 92, C.ink, 700)}`;
      s += `<g class="rise" ${d(dl)}><g class="float" style="animation-delay:-${dl * 4}s;animation-duration:3.4s"><g transform="rotate(${rot} ${cx} ${y + ph / 2})">${page({ x, y, w: pw, h: ph, body })}</g></g></g>`;
    });
    return s;
  })(),
});

// ---- Clip 2: November 1939, last Thursday (30th) circled ----
const nov1939 = monthRows(3, 30);
scenes.push({
  name: 'clip2-last-thursday', still: 3.2,
  svg: (() => {
    let s = background(5);
    const cal = calendar({ x: 100, y: 330, w: 880, rows: nov1939 });
    s += `<g class="rise">${cal.svg}</g>`;
    const [cx, cy] = cal.pos[30];
    s += `<path class="draw" ${d(0.9)} pathLength="1" d="${scribble(cx, cy, cal.cell * 0.46)}" fill="none" stroke="${C.cran}" stroke-width="10" stroke-linecap="round"/>`;
    s += `<g class="pop" ${d(1.6)}><g class="wobble"><use href="#turkey" x="${cx + cal.cell * 0.44}" y="${cy - cal.cell * 0.28}" width="${cal.cell * 1.0}" height="${cal.cell * 0.75}"/></g></g>`;
    return s;
  })(),
});

// ---- Clip 3: short stretch Thanksgiving -> Christmas, worried register ----
scenes.push({
  name: 'clip3-short-shopping-season', still: 4.2,
  svg: (() => {
    let s = background(7);
    const rows = [
      [{ n: 26, key: 'n26', dim: 1 }, { n: 27, key: 'n27', dim: 1 }, { n: 28, key: 'n28', dim: 1 }, { n: 29, key: 'n29', dim: 1 }, { n: 30, key: 'n30' }, { n: 1, key: 1 }, { n: 2, key: 2 }],
      ...[3, 10, 17, 24].map(st => Array.from({ length: 7 }, (_, i) => ({ n: st + i, key: st + i }))),
    ];
    const cal = calendar({ x: 150, y: 230, w: 780, rows, thu: false, hide: ['n30', 25] });
    s += `<g class="rise">${cal.svg.split('<text')[0]}`;
    // stretch bands drawn under numbers
    const spans = [[4, 6], [0, 6], [0, 6], [0, 6], [0, 1]];
    let bands = '';
    spans.forEach(([c0, c1], r) => {
      const bx = cal.gx + cal.cell * c0 + cal.cell * 0.06, by = cal.gy + cal.rowH * r + cal.rowH * 0.12;
      bands += `<rect class="grow" ${d(0.8 + r * 0.32)} x="${f(bx)}" y="${f(by)}" width="${f(cal.cell * (c1 - c0 + 1) - cal.cell * 0.12)}" height="${f(cal.rowH * 0.76)}" rx="${f(cal.rowH * 0.38)}" fill="${C.mustLt}"/>`;
    });
    s += bands + '<text' + cal.svg.split('<text').slice(1).join('<text') + '</g>';
    // month divider tick between Nov 30 and Dec 1
    const [tx, ty] = cal.pos.n30, [cx25, cy25] = cal.pos[25];
    const cr = cal.cell * 0.47;
    s += `<g class="pop" ${d(0.5)}><circle cx="${tx}" cy="${ty}" r="${cr}" fill="${C.cranLt}" stroke="${C.cran}" stroke-width="7"/><use href="#turkey" x="${tx - cr * 0.82}" y="${ty - cr * 0.62}" width="${cr * 1.64}" height="${cr * 1.23}"/></g>`;
    s += `<g class="pop" ${d(2.4)}><circle cx="${cx25}" cy="${cy25}" r="${cr}" fill="#D3EBD9" stroke="${C.pine}" stroke-width="7"/><use href="#tree" x="${cx25 - cr * 0.5}" y="${cy25 - cr * 0.62}" width="${cr * 1.0}" height="${cr * 1.2}"/></g>`;

    // shopping bags
    const bag = (x, y, w, h, col, dk, dl) => `<g class="popB" ${d(dl)}><g filter="url(#shadowSm)">
      <path d="M${x + w * 0.3} ${y + 4} V${y - h * 0.2} a${w * 0.2} ${w * 0.2} 0 0 1 ${w * 0.4} 0 V${y + 4}" fill="none" stroke="${dk}" stroke-width="${w * 0.07}" stroke-linecap="round"/>
      <path d="M${x} ${y} H${x + w} L${x + w * 0.96} ${y + h} H${x + w * 0.04}Z" fill="${col}" stroke="${col}" stroke-width="10" stroke-linejoin="round"/>
      <rect x="${x - 2}" y="${y - 3}" width="${w + 4}" height="${h * 0.12}" rx="4" fill="${dk}" opacity="0.35"/>
      <circle cx="${x + w * 0.5}" cy="${y + h * 0.55}" r="${w * 0.17}" fill="#FFFFFF" opacity="0.35"/></g></g>`;
    s += bag(150, 1040, 150, 170, C.cran, C.cranDk, 1.2);
    s += bag(270, 1080, 130, 140, C.must, C.mustDk, 1.35);
    s += bag(375, 1100, 110, 120, C.teal, C.tealDk, 1.5);

    // worried cash register
    const rx = 590, ry = 905;
    s += `<g class="popB" ${d(1.0)}><g class="shiver"><g filter="url(#shadowSm)">
      <rect x="${rx + 135}" y="${ry + 95}" width="34" height="40" fill="${C.tealDk}"/>
      <rect x="${rx + 60}" y="${ry}" width="184" height="112" rx="22" fill="${C.ink}"/>
      <rect x="${rx + 74}" y="${ry + 14}" width="156" height="84" rx="14" fill="#E9F5F2"/>
      <path d="M${rx} ${ry + 290} L${rx + 30} ${ry + 150} Q${rx + 34} ${ry + 132} ${rx + 52} ${ry + 132} H${rx + 252} Q${rx + 270} ${ry + 132} ${rx + 274} ${ry + 150} L${rx + 304} ${ry + 290}Z" fill="${C.teal}"/>
      <rect x="${rx - 10}" y="${ry + 270}" width="324" height="64" rx="14" fill="${C.tealDk}"/>
      <rect x="${rx + 122}" y="${ry + 296}" width="60" height="12" rx="6" fill="#FFFFFF" opacity="0.6"/>
      ${[0, 1, 2].map(rr => [0, 1, 2, 3].map(cc => `<rect x="${rx + 58 + cc * 50 - rr * 6 + (cc === 3 ? 0 : 0)}" y="${ry + 160 + rr * 34}" width="${36 + rr * 3}" height="22" rx="7" fill="${cc === 3 && rr === 2 ? C.must : '#E9F5F2'}" opacity="${cc === 3 && rr === 2 ? 1 : 0.9}"/>`).join('')).join('')}
      <!-- worried face -->
      <circle cx="${rx + 125}" cy="${ry + 58}" r="8" fill="${C.ink}"/><circle cx="${rx + 179}" cy="${ry + 58}" r="8" fill="${C.ink}"/>
      <path d="M${rx + 110} ${ry + 38} L${rx + 136} ${ry + 30}" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/>
      <path d="M${rx + 194} ${ry + 38} L${rx + 168} ${ry + 30}" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/>
      <path d="M${rx + 128} ${ry + 84} q8 -8 16 0 q8 8 16 0 q8 -8 16 0" stroke="${C.ink}" stroke-width="5.5" stroke-linecap="round" fill="none"/>
      </g></g>
      <g class="drip"><path d="M${rx + 262} ${ry + 10} q-14 20 0 28 q14 -8 0 -28Z" fill="#7CC3E6"/></g></g>`;
    return s;
  })(),
});

// ---- Clip 4: circle slides from the 30th up to the 23rd ----
scenes.push({
  name: 'clip4-moved-up-a-week', still: 4.2,
  svg: (() => {
    let s = background(5);
    const cal = calendar({ x: 100, y: 330, w: 880, rows: nov1939, focusCol: 4 });
    s += cal.svg;
    const [x30, y30] = cal.pos[30], [x23, y23] = cal.pos[23];
    const cr = cal.cell * 0.46;
    // ghost circle stays behind on the 30th
    s += `<circle class="fade" ${d(1.4)} cx="${x30}" cy="${y30}" r="${cr}" fill="none" stroke="${C.cran}" stroke-opacity="0.35" stroke-width="7" stroke-dasharray="4 16" stroke-linecap="round"/>`;
    // curved arrow on the right side
    const S = [x30 + cr + 14, y30 + 4], E = [x23 + cr + 20, y23 + 2], k = cal.cell * 0.78;
    const ap = `M${f(S[0])} ${f(S[1])} C${f(S[0] + k)} ${f(S[1])} ${f(E[0] + k)} ${f(E[1])} ${f(E[0])} ${f(E[1])}`;
    const ang = Math.PI;
    s += `<path class="draw" ${d(1.0)} pathLength="1" d="${ap}" fill="none" stroke="${C.paper}" stroke-width="30" stroke-linecap="round"/>`;
    s += `<path class="draw" ${d(1.0)} pathLength="1" d="${ap}" fill="none" stroke="${C.pump}" stroke-width="13" stroke-linecap="round"/>`;
    s += `<g class="fade" ${d(1.75)}>${arrowHead(E[0], E[1], ang, 30, C.paper, 30)}${arrowHead(E[0], E[1], ang, 30, C.pump, 13)}</g>`;
    // the moving circle (+ turkey) — slides 30 -> 23
    const dy = y30 - y23;
    s += `<style>@keyframes slideUp{0%,30%{transform:translateY(${dy}px)}70%,100%{transform:translateY(0)}}.slide{animation:slideUp 2.4s cubic-bezier(.6,0,.3,1) both}</style>`;
    s += `<g class="fade" ${d(0.2)}><g class="slide">
      <path d="${scribble(x23, y23, cr)}" fill="none" stroke="${C.cran}" stroke-width="10" stroke-linecap="round"/>
    </g></g>`;
    return s;
  })(),
});

// ---- Clip 5: abstract two-color split map, Texas striped ----
scenes.push({
  name: 'clip5-states-split', still: 4.0,
  svg: (() => {
    let s = background(9);
    const nation = topo.feature(us, us.objects.nation);
    const states = topo.feature(us, us.objects.states);
    const texas = states.features.find(ft => ft.id === '48');
    const gp = geoPath(null);
    const polys = g => (g.type === 'Polygon' ? [g.coordinates] : g.coordinates);
    const inRing = (pt, ring) => { let c = false; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) { const [xi, yi] = ring[i], [xj, yj] = ring[j]; if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
    const inGeom = (pt, g) => polys(g).some(poly => inRing(pt, poly[0]) && !poly.slice(1).some(h => inRing(pt, h)));
    const ng = nation.features[0].geometry, tg = texas.geometry;
    const sc = 0.97, ox = 540 - 487.5 * sc, oy = 560;
    const r = rng(4), sp = 10.5;
    const dots = [];
    for (let yy = 0; yy < 620; yy += sp * 0.866) {
      const row = Math.round(yy / (sp * 0.866));
      for (let xx = (row % 2) * sp / 2; xx < 980; xx += sp) {
        if (inGeom([xx, yy], ng) && !inGeom([xx, yy], tg)) dots.push([xx, yy]);
      }
    }
    // exact 50/50 shuffle so the mix reads as "about half and half", not geography
    const cols = dots.map((_, i) => i % 2);
    for (let i = cols.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [cols[i], cols[j]] = [cols[j], cols[i]]; }
    let A = '', B = '';
    dots.forEach(([xx, yy], i) => { const c = `<circle cx="${f(xx)}" cy="${f(yy)}" r="4.3"/>`; if (cols[i]) A += c; else B += c; });
    s += `<g class="fade" ${d(0.2)}><g transform="translate(${f(ox)} ${oy}) scale(${sc})">
      <path d="${gp(nation)}" fill="${C.paper}" stroke="${C.paper}" stroke-width="16" stroke-linejoin="round" filter="url(#shadow)"/>
      <g fill="${C.pump}">${A}</g><g fill="${C.teal}">${B}</g>
    </g></g>`;
    // Texas, lifted and striped
    const tb = gp.bounds(texas);
    const tcx = ox + sc * (tb[0][0] + tb[1][0]) / 2, tcy = oy + sc * (tb[0][1] + tb[1][1]) / 2;
    s += `<g class="pop" ${d(1.3)}><g class="pulse" style="animation-delay:2.1s"><g transform="translate(${f(ox)} ${oy}) scale(${sc})">
      <path d="${gp(texas)}" fill="url(#stripes)" stroke="${C.paper}" stroke-width="5" stroke-linejoin="round" filter="url(#shadowSm)"/>
    </g></g></g>`;
    // legend: orange = 23rd, teal = 30th
    const chip = (cx, col, dk, n, dl) => page({ x: cx - 95, y: 300, w: 190, h: 196, header: col, headerDk: dk, body: numText(cx, 300 + 196 * 0.6, n, 84, C.ink, 700) });
    s += `<g class="rise" ${d(0.5)}><g class="float" style="animation-duration:3.6s">${chip(330, C.pump, C.pumpDk, '23')}</g></g>`;
    s += `<g class="rise" ${d(0.7)}><g class="float" style="animation-duration:3.6s;animation-delay:-1.8s">${chip(750, C.teal, C.tealDk, '30')}</g></g>`;
    s += `<!-- texas center ${f(tcx)},${f(tcy)} -->`;
    return s;
  })(),
});

// ---- Clip 6: two houses, same day — one feasting, one empty ----
function house({ x, y, w, wall, wallDk, roof, lit }) {
  // x,y = top-left of walls; walls height 300
  const wh = 300, rh = 160;
  let s = '';
  if (lit) s += `<circle cx="${x + w / 2}" cy="${y + 150}" r="330" fill="url(#glow)" opacity="0.8"/>`;
  s += `<rect x="${x + w * 0.66}" y="${y - rh * 0.95}" width="48" height="${rh * 0.75}" rx="6" fill="${wallDk}"/>`;
  s += `<rect x="${x + w * 0.66 - 8}" y="${y - rh * 0.95 - 4}" width="64" height="20" rx="6" fill="${roof}"/>`;
  s += `<g filter="url(#shadow)"><rect x="${x}" y="${y}" width="${w}" height="${wh}" rx="14" fill="${wall}"/></g>`;
  s += `<path d="M${x - 28} ${y + 12} L${x + w / 2} ${y - rh} L${x + w + 28} ${y + 12}Z" fill="${roof}" stroke="${roof}" stroke-width="22" stroke-linejoin="round"/>`;
  s += `<circle cx="${x + w / 2}" cy="${y - rh * 0.42}" r="26" fill="${C.paper}"/><circle cx="${x + w / 2}" cy="${y - rh * 0.42}" r="17" fill="${lit ? '#FFE3A8' : '#D6DEE4'}"/>`;
  // cutaway window into the dining room
  const ix = x + 28, iy = y + 34, iw = w - 56, ih = 236;
  s += `<rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" rx="20" fill="${lit ? '#FFE9C4' : '#DCE3E9'}"/>`;
  s += `<clipPath id="room${lit ? 1 : 0}"><rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" rx="20"/></clipPath><g clip-path="url(#room${lit ? 1 : 0})">`;
  s += `<rect x="${ix}" y="${iy + ih - 52}" width="${iw}" height="52" fill="${lit ? '#EBC089' : '#C2CBD3'}"/>`;
  // hanging lamp
  const lx = x + w / 2;
  s += `<line x1="${lx}" y1="${iy}" x2="${lx}" y2="${iy + 34}" stroke="${C.ink}" stroke-width="4"/>`;
  if (lit) s += `<circle cx="${lx}" cy="${iy + 56}" r="70" fill="url(#glow)"/>`;
  s += `<path d="M${lx - 30} ${iy + 58} L${lx - 16} ${iy + 32} H${lx + 16} L${lx + 30} ${iy + 58}Z" fill="${lit ? C.must : '#9AA6B0'}"/>`;
  // table
  const ty = iy + 160;
  s += `<rect x="${ix + 34}" y="${ty + 18}" width="10" height="56" fill="${C.brown}"/><rect x="${ix + iw - 44}" y="${ty + 18}" width="10" height="56" fill="${C.brown}"/>`;
  s += `<path d="M${ix + 22} ${ty} H${ix + iw - 22} V${ty + 34} Q${ix + iw - 22} ${ty + 44} ${ix + iw - 32} ${ty + 44} H${ix + 32} Q${ix + 22} ${ty + 44} ${ix + 22} ${ty + 34}Z" fill="${lit ? C.cran : '#F3EFEA'}"/>`;
  s += `<rect x="${ix + 22}" y="${ty}" width="${iw - 44}" height="9" rx="4" fill="${lit ? C.cranDk : '#DCD5CC'}"/>`;
  // plates
  const plate = px => `<ellipse cx="${px}" cy="${ty - 2}" rx="26" ry="8" fill="${C.paper}" stroke="#E2D7C9" stroke-width="2"/><ellipse cx="${px}" cy="${ty - 3}" rx="15" ry="4.5" fill="#EFE7DC"/>`;
  s += plate(ix + 62) + plate(ix + iw - 62);
  if (lit) {
    s += `<use href="#turkey" x="${lx - 78}" y="${ty - 102}" width="156" height="117"/>`;
    s += steamLines(lx, ty - 70, 0.45, 0.2);
  } else {
    s += plate(lx);
    s += `<path d="M${lx - 40} ${ty - 14} v14 M${lx + 40} ${ty - 14} v14" stroke="#B9B2BC" stroke-width="4" stroke-linecap="round"/>`;
  }
  s += `</g>`;
  s += `<rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" rx="20" fill="none" stroke="${C.paper}" stroke-width="12"/>`;
  return s;
}
scenes.push({
  name: 'clip6-a-week-apart', still: 3.6,
  svg: (() => {
    let s = background(13);
    const baseY = 1080;
    // ground
    s += `<g class="fade"><rect x="40" y="${baseY - 6}" width="1000" height="44" rx="22" fill="${C.sage}" opacity="0.9"/></g>`;
    // state line
    s += `<line class="fade" ${d(0.6)} x1="540" y1="660" x2="540" y2="${baseY + 50}" stroke="${C.inkSoft}" stroke-width="7" stroke-dasharray="1 20" stroke-linecap="round"/>`;
    const hw = 380;
    s += `<g class="rise" ${d(0.15)}>${house({ x: 275 - hw / 2, y: baseY - 300, w: hw, wall: C.pumpLt, wallDk: C.pumpDk, roof: C.cran, lit: true })}</g>`;
    s += `<g class="rise" ${d(0.35)}>${house({ x: 805 - hw / 2, y: baseY - 300, w: hw, wall: C.tealLt, wallDk: C.tealDk, roof: C.teal, lit: false })}</g>`;
    // chimney smoke on the cooking house
    const chx = 275 - hw / 2 + hw * 0.66 + 24, chy = baseY - 300 - 160 * 0.95 - 10;
    s += [0, 0.9, 1.8].map(dl => `<circle class="steam" ${d(dl)} cx="${chx + (dl ? 10 : -6)}" cy="${chy - 20 - dl * 6}" r="${16 + dl * 4}" fill="#FFFFFF" opacity="0.9"/>`).join('');
    // the shared date
    s += `<g class="pop" ${d(0.9)}><g class="float">${page({ x: 540 - 105, y: 300, w: 210, h: 224, body: numText(540, 300 + 224 * 0.6, '23', 96, C.ink, 700) })}</g></g>`;
    // dashed arrows from the date to each house
    const a1 = `M470 560 C400 600 330 590 290 640`, a2 = `M610 560 C680 600 750 590 790 640`;
    s += `<g class="fade" ${d(1.3)}>
      <path d="${a1}" fill="none" stroke="${C.inkSoft}" stroke-width="7" stroke-dasharray="1 16" stroke-linecap="round"/>
      <path d="${a2}" fill="none" stroke="${C.inkSoft}" stroke-width="7" stroke-dasharray="1 16" stroke-linecap="round"/>
      ${arrowHead(290, 640, Math.atan2(50, -40), 18, C.inkSoft, 7)}${arrowHead(790, 640, Math.atan2(50, 40), 18, C.inkSoft, 7)}
    </g>`;
    return s;
  })(),
});

// ---- Clip 7: flat sales line + shrugging shopping bag ----
scenes.push({
  name: 'clip7-franksgiving-flop', still: 3.9,
  svg: (() => {
    let s = background(17);
    const cx0 = 80, cy0 = 330, cw = 920, ch = 700;
    s += `<g class="rise"><g filter="url(#shadow)"><rect x="${cx0}" y="${cy0}" width="${cw}" height="${ch}" rx="44" fill="${C.paper}"/></g>`;
    const px0 = 170, px1 = 920, py0 = 420, py1 = 930;
    [0.25, 0.5, 0.75].forEach(t => { s += `<line x1="${px0}" y1="${py0 + (py1 - py0) * t}" x2="${px1}" y2="${py0 + (py1 - py0) * t}" stroke="#EFE5D8" stroke-width="4" stroke-linecap="round"/>`; });
    s += `<path d="M${px0} ${py0 - 20} V${py1} H${px1}" fill="none" stroke="#D3C5B5" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    // the moment Thanksgiving moved
    const mx = 300;
    s += `<line class="fade" ${d(0.5)} x1="${mx}" y1="${py1}" x2="${mx}" y2="${py0 + 40}" stroke="${C.pump}" stroke-width="5" stroke-dasharray="2 14" stroke-linecap="round"/>`;
    s += `<g class="pop" ${d(0.6)}><use href="#turkey" x="${mx - 55}" y="${py1 + 12}" width="110" height="82"/></g>`;
    // hoped-for climb (ghost)
    const ghost = `M${mx} 760 C 460 745, 590 620, 690 470`;
    s += `<g class="fade" ${d(0.9)}><g opacity="0.5"><path d="${ghost}" fill="none" stroke="${C.sageDk}" stroke-width="9" stroke-linecap="round" stroke-dasharray="2 22"/>${arrowHead(690, 470, Math.atan2(-150, 100), 26, C.sageDk, 9)}</g></g>`;
    // actual: flat
    const pts = [[px0 + 20, 768], [240, 760], [mx, 764], [380, 758], [460, 765], [540, 759], [620, 763], [700, 760]];
    s += `<path class="draw" ${d(1.2)} pathLength="1" d="${smooth(pts)}" fill="none" stroke="${C.cran}" stroke-width="13" stroke-linecap="round"/>`;
    pts.forEach(([x, y], i) => { s += `<circle class="pop" ${d(1.2 + i * 0.1)} cx="${x}" cy="${y}" r="${i === pts.length - 1 ? 14 : 9}" fill="${i === pts.length - 1 ? C.cran : C.paper}" stroke="${C.cran}" stroke-width="6"/>`; });
    // shrugging bag character
    const bx = 735, by = 520;
    s += `<g class="popB" ${d(2.0)}><g class="shrug">
      <path d="M${bx + 72} ${by + 64} V${by + 30} a28 28 0 0 1 56 0 V${by + 64}" fill="none" stroke="${C.mustDk}" stroke-width="11" stroke-linecap="round"/>
      <path d="M${bx + 30} ${by + 140} L${bx - 4} ${by + 166} L${bx - 16} ${by + 116}" fill="none" stroke="${C.ink}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M${bx + 170} ${by + 140} L${bx + 204} ${by + 166} L${bx + 216} ${by + 116}" fill="none" stroke="${C.ink}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
      <ellipse cx="${bx - 18}" cy="${by + 108}" rx="15" ry="10" transform="rotate(-20 ${bx - 18} ${by + 108})" fill="${C.ink}"/>
      <ellipse cx="${bx + 218}" cy="${by + 108}" rx="15" ry="10" transform="rotate(20 ${bx + 218} ${by + 108})" fill="${C.ink}"/>
      <path d="M${bx - 40} ${by + 82} l-10 -10 M${bx - 22} ${by + 74} l-2 -14 M${bx + 240} ${by + 82} l10 -10 M${bx + 222} ${by + 74} l2 -14" stroke="${C.inkSoft}" stroke-width="5" stroke-linecap="round"/>
      <path d="M${bx + 30} ${by + 64} H${bx + 170} L${bx + 162} ${by + 226} H${bx + 38}Z" fill="${C.must}" stroke="${C.must}" stroke-width="14" stroke-linejoin="round"/>
      <rect x="${bx + 24}" y="${by + 58}" width="152" height="22" rx="8" fill="${C.mustDk}" opacity="0.4"/>
      <circle cx="${bx + 78}" cy="${by + 136}" r="8" fill="${C.ink}"/><circle cx="${bx + 122}" cy="${by + 136}" r="8" fill="${C.ink}"/>
      <path d="M${bx + 64} ${by + 114} q14 -12 28 -2 M${bx + 108} ${by + 112} q14 -10 28 2" stroke="${C.ink}" stroke-width="5.5" stroke-linecap="round" fill="none"/>
      <path d="M${bx + 84} ${by + 172} H${bx + 116}" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/>
      <circle cx="${bx + 60}" cy="${by + 160}" r="10" fill="${C.cran}" opacity="0.25"/><circle cx="${bx + 140}" cy="${by + 160}" r="10" fill="${C.cran}" opacity="0.25"/>
      <path d="M${bx + 78} ${by + 226} v20 h-12 M${bx + 122} ${by + 226} v20 h12" stroke="${C.ink}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </g></g>`;
    return s;
  })(),
});

// ---- Clip 8a: the Capitol dome + a sealed law ----
scenes.push({
  name: 'clip8a-congress-makes-it-law', still: 3.4,
  svg: (() => {
    let s = background(19);
    s += `<circle class="fade" cx="540" cy="700" r="410" fill="#FCE0BE"/><circle class="fade" cx="540" cy="700" r="330" fill="#FDEBD3"/>`;
    const r = rng(8);
    for (let i = 0; i < 9; i++) {
      const a = r() * Math.PI * 2, rr = 360 + r() * 90, x = 540 + rr * Math.cos(a), y = 680 + rr * Math.sin(a) * 0.95, z = 9 + r() * 10;
      s += `<g class="pop" ${d(1.2 + i * 0.1)}><path class="pulse" style="animation-delay:-${(r() * 1.6).toFixed(2)}s" d="M${x} ${y - z} Q${x} ${y} ${x + z} ${y} Q${x} ${y} ${x} ${y + z} Q${x} ${y} ${x - z} ${y} Q${x} ${y} ${x} ${y - z}Z" fill="${C.must}"/></g>`;
    }
    // Capitol (local 600 x 560), scaled
    const P = C.paper, S1 = '#EFE5D7', S2 = '#DCCDBA', WIN = '#C9D9E2';
    const col = (x, y, w, h, n) => Array.from({ length: n }, (_, i) => `<rect x="${f(x + i * w / (n - 1) - 5)}" y="${y}" width="10" height="${h}" rx="3" fill="${S2}"/>`).join('');
    const cap = `
      <rect x="0" y="520" width="600" height="40" rx="8" fill="${S2}"/>
      <rect x="20" y="500" width="560" height="26" rx="6" fill="${S1}"/>
      <rect x="10" y="390" width="580" height="116" rx="8" fill="${P}"/>
      <rect x="10" y="390" width="580" height="16" rx="6" fill="${S1}"/>
      ${[40, 80, 120, 160, 440, 480, 520, 560].map(x => `<rect x="${x - 10}" y="425" width="20" height="30" rx="10" fill="${WIN}"/><rect x="${x - 10}" y="466" width="20" height="24" rx="4" fill="${WIN}"/>`).join('')}
      <rect x="196" y="360" width="208" height="146" fill="${P}"/>
      <path d="M186 362 L300 314 L414 362Z" fill="${P}" stroke="${P}" stroke-width="10" stroke-linejoin="round"/>
      <path d="M232 352 L300 326 L368 352Z" fill="${S1}"/>
      ${col(212, 372, 176, 128, 8)}
      <rect x="220" y="282" width="160" height="24" rx="6" fill="${S1}"/>
      <rect x="230" y="218" width="140" height="68" fill="${P}"/>
      ${col(240, 226, 120, 54, 9)}
      <rect x="222" y="210" width="156" height="14" rx="6" fill="${S1}"/>
      <path d="M234 212 C234 132 270 96 300 96 C330 96 366 132 366 212Z" fill="${P}"/>
      <path d="M300 96 C330 96 366 132 366 212 H300Z" fill="${S1}" opacity="0.7"/>
      <path d="M262 210 C262 150 280 112 300 100 M338 210 C338 150 320 112 300 100 M300 100 V210" stroke="${S2}" stroke-width="4" fill="none"/>
      <rect x="286" y="68" width="28" height="34" rx="4" fill="${P}"/>
      <path d="M284 70 Q300 52 316 70Z" fill="${S1}"/>
      <rect x="296" y="36" width="8" height="22" rx="3" fill="${S2}"/><circle cx="300" cy="34" r="7" fill="${S2}"/>`;
    s += `<g class="rise" ${d(0.1)}><g transform="translate(150 360) scale(1.3)" filter="url(#shadow)">${cap}</g></g>`;
    // the law: a document with a seal and a little calendar
    const dx = 620, dy = 920;
    s += `<g class="rise" ${d(0.8)}><g class="float" style="animation-duration:3.8s"><g transform="rotate(7 ${dx + 150} ${dy + 130})">
      <g filter="url(#shadow)"><rect x="${dx}" y="${dy}" width="300" height="250" rx="22" fill="${C.paper}"/></g>
      ${[0, 1, 2].map(i => `<rect x="${dx + 34}" y="${dy + 38 + i * 30}" width="${i === 2 ? 130 : 232}" height="12" rx="6" fill="${C.faint}"/>`).join('')}
      ${[0, 1, 2, 3, 4, 5, 6].map(c => [0, 1, 2, 3].map(rw => `<circle cx="${dx + 44 + c * 22}" cy="${dy + 152 + rw * 20}" r="${c === 4 && rw === 3 ? 7 : 4.5}" fill="${c === 4 && rw === 3 ? C.cran : '#D9CCBD'}"/>`).join('')).join('')}
      <circle cx="${dx + 132}" cy="${dy + 212}" r="15" fill="none" stroke="${C.cran}" stroke-width="4"/>
      <path d="M${dx + 236} ${dy + 196} l-12 50 l16 -10 l12 14 l6 -50Z" fill="${C.cranDk}"/>
      <circle cx="${dx + 246}" cy="${dy + 186}" r="30" fill="${C.cran}"/><circle cx="${dx + 246}" cy="${dy + 186}" r="20" fill="none" stroke="${C.cranLt}" stroke-width="3"/>
      <path d="M${dx + 246} ${dy + 174} l3.5 7 7.5 1 -5.5 5.3 1.3 7.6 -6.8 -3.6 -6.8 3.6 1.3 -7.6 -5.5 -5.3 7.5 -1z" fill="${C.cranLt}"/>
    </g></g></g>`;
    return s;
  })(),
});

// ---- Clip 8b: fourth Thursday circled (Nov 2026), every year ----
scenes.push({
  name: 'clip8b-fourth-thursday', still: 4.4,
  svg: (() => {
    let s = background(21);
    const rows = monthRows(0, 30); // Nov 2026 starts on a Sunday
    const x = 130, y = 360, w = 820;
    const cal = calendar({ x, y, w, rows });
    // pages behind = every year
    s += `<g class="fade" ${d(0.3)}><g transform="rotate(-5 ${x + w / 2} ${y + cal.h})"><rect x="${x}" y="${y}" width="${w}" height="${cal.h}" rx="${cal.cell * 0.3}" fill="#F3E7D8" filter="url(#shadowSm)"/></g>
      <g transform="rotate(3.5 ${x + w / 2} ${y + cal.h})"><rect x="${x}" y="${y}" width="${w}" height="${cal.h}" rx="${cal.cell * 0.3}" fill="#F8EFE4" filter="url(#shadowSm)"/></g></g>`;
    s += `<g class="rise">${cal.svg}</g>`;
    const [cx, cy] = cal.pos[26];
    s += `<path class="draw" ${d(2.3)} pathLength="1" d="${scribble(cx, cy, cal.cell * 0.47, 2.4)}" fill="none" stroke="${C.cran}" stroke-width="10" stroke-linecap="round"/>`;
    s += `<g class="pop" ${d(2.9)}><g class="wobble"><use href="#turkey" x="${cx + cal.cell * 0.3}" y="${cy + cal.cell * 0.3}" width="${cal.cell * 1.0}" height="${cal.cell * 0.75}"/></g></g>`;
    [5, 12, 19, 26].forEach((day, i) => {
      const [cx, cy] = cal.pos[day];
      const bx = cx - cal.cell * 0.38, by = cy - cal.cell * 0.36;
      s += `<g class="pop" ${d(0.8 + i * 0.35)}><circle cx="${bx}" cy="${by}" r="${cal.cell * 0.19}" fill="${i === 3 ? C.cran : C.pump}" stroke="${C.paper}" stroke-width="5"/>${numText(bx, by + 1, i + 1, cal.cell * 0.24, '#FFFFFF', 700)}</g>`;
    });
    // repeat badge (every year)
    const rx = x + w - 10, ry = y - 6;
    s += `<g class="pop" ${d(3.3)}><g filter="url(#shadowSm)"><circle cx="${rx}" cy="${ry}" r="54" fill="${C.teal}"/></g>
      <g class="spin"><path d="M${rx - 26} ${ry - 4} A27 27 0 0 1 ${rx + 22} ${ry - 16}" fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round"/>
      ${arrowHead(rx + 23, ry - 15, Math.PI * 0.36, 13, '#FFFFFF', 8)}
      <path d="M${rx + 26} ${ry + 4} A27 27 0 0 1 ${rx - 22} ${ry + 16}" fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round"/>
      ${arrowHead(rx - 23, ry + 15, Math.PI * 1.36, 13, '#FFFFFF', 8)}</g></g>
      <style>.spin{animation:spin 6s linear infinite;transform-box:fill-box;transform-origin:center}@keyframes spin{to{transform:rotate(360deg)}}</style>`;
    return s;
  })(),
});

// ---- Clip 9: ring of 12 months, turkey wondering where to go ----
scenes.push({
  name: 'clip9-pick-any-day', still: 3.6,
  svg: (() => {
    let s = background(23);
    const cx = 540, cy = 700, R = 345;
    const season = [C.sky, C.sky, C.sage, C.sage, C.sage, C.must, C.must, C.must, C.pump, C.pump, C.cran, C.sky];
    const seasonDk = ['#7FB0CC', '#7FB0CC', C.sageDk, C.sageDk, C.sageDk, C.mustDk, C.mustDk, C.mustDk, C.pumpDk, C.pumpDk, C.cranDk, '#7FB0CC'];
    s += `<circle class="fade" cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#EAD9C4" stroke-width="6" stroke-dasharray="2 18" stroke-linecap="round"/>`;
    for (let i = 0; i < 12; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 6, x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
      const w = 128, h = 136, x0 = x - w / 2, y0 = y - h / 2;
      let card = `<g filter="url(#shadowSm)"><rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="18" fill="${C.paper}"/></g>
        <path d="M${x0} ${y0 + 36} V${y0 + 18} Q${x0} ${y0} ${x0 + 18} ${y0} H${x0 + w - 18} Q${x0 + w} ${y0} ${x0 + w} ${y0 + 18} V${y0 + 36}Z" fill="${season[i]}"/>
        <rect x="${x0 + 34}" y="${y0 - 10}" width="9" height="26" rx="4.5" fill="#BDB4C0"/><rect x="${x0 + w - 43}" y="${y0 - 10}" width="9" height="26" rx="4.5" fill="#BDB4C0"/>`;
      for (let rr = 0; rr < 3; rr++) for (let cc = 0; cc < 4; cc++) card += `<circle cx="${x0 + 25 + cc * 26}" cy="${y0 + 62 + rr * 24}" r="6" fill="${C.faint}"/>`;
      s += `<g class="pop" ${d(0.1 + i * 0.07)}><g class="float" style="animation-delay:-${(i * 0.27).toFixed(2)}s;animation-duration:2.8s">${card}</g></g>`;
      void seasonDk;
    }
    // turkey in the middle
    s += `<g class="pop" ${d(1.0)}><use href="#turkey" x="${cx - 175}" y="${cy - 40}" width="350" height="262"/></g>`;
    s += steamLines(cx, cy + 40, 0.75, 1.2);
    // thought bubble with "?"
    s += `<g class="pop" ${d(1.4)}><circle cx="${cx + 120}" cy="${cy - 40}" r="11" fill="${C.paper}" filter="url(#shadowSm)"/></g>`;
    s += `<g class="pop" ${d(1.5)}><circle cx="${cx + 92}" cy="${cy - 82}" r="18" fill="${C.paper}" filter="url(#shadowSm)"/></g>`;
    s += `<g class="pop" ${d(1.65)}><g class="float" style="animation-duration:2.4s"><circle cx="${cx}" cy="${cy - 175}" r="92" fill="${C.paper}" filter="url(#shadow)"/>
      <g class="wobble">${numText(cx, cy - 168, '?', 150, C.cran, 700)}</g></g></g>`;
    return s;
  })(),
});

function html(scene) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${defs}${scene.svg}</svg></body></html>`;
}

module.exports = { scenes, html, W, H };
