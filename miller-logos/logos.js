/* Miller for Ward 3 — logo generator.
   Each concept builds two layouts: a 3:1 banner/billboard lockup (1500x500)
   and a 4:3 yard sign (1200x900). Text is fitted to exact widths after the
   web fonts load, so every lockup locks up the same way in any browser. */

const FONT_CSS = "https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800;900&family=Oswald:wght@500;600;700&family=Barlow+Semi+Condensed:wght@600;700;800&family=Archivo+Black&family=Bebas+Neue&family=Inter:wght@500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700;9..144,800&display=swap";

const P = (n) => +n.toFixed(2);
const star = (cx, cy, r, fill, rot = 0) => {
  let d = "";
  for (let i = 0; i < 10; i++) {
    const rr = i % 2 ? r * 0.4 : r;
    const a = (Math.PI / 5) * i - Math.PI / 2 + rot;
    d += (i ? "L" : "M") + P(cx + rr * Math.cos(a)) + " " + P(cy + rr * Math.sin(a));
  }
  return `<path d="${d}Z" fill="${fill}"/>`;
};
const T = (txt, o) => {
  const a = Object.entries(o.attr || {}).map(([k, v]) => `${k}="${v}"`).join(" ");
  return `<text x="${o.x}" y="${o.y}" font-family="${o.font}" font-weight="${o.weight || 700}" font-size="${o.size || 100}" fill="${o.fill}" ${o.ls ? `letter-spacing="${o.ls}"` : ""} ${o.anchor ? `text-anchor="${o.anchor}"` : ""} ${o.fit ? `data-fit="${o.fit}"` : ""} ${o.cls ? `class="${o.cls}"` : ""} ${a}>${txt}</text>`;
};
const svgWrap = (w, h, bg, body, id) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" data-id="${id}"><style>@import url('${FONT_CSS.replace(/&/g, "&amp;")}');</style><rect width="${w}" height="${h}" fill="${bg}"/>${body}</svg>`;

/* ------------------------------------------------------------------ */
/* 1 · GLEN — "River Rise": a sun rising over the Ohio River's bend   */
/* ------------------------------------------------------------------ */
const C1 = { navy: "#0D2747", blue: "#1C4E9A", gold: "#F4AF2D", white: "#FFFFFF", ink: "#0D2747" };
function emblemRiverRise(uid) {
  const H = 238; // horizon
  let rays = "";
  const n = 15;
  for (let i = 0; i < n; i++) {
    const a = Math.PI + (Math.PI / (n + 1)) * (i + 1);
    const w = 0.052;
    const r0 = 104, r1 = 300;
    const p = (ang, r) => `${P(200 + r * Math.cos(ang))} ${P(H + r * Math.sin(ang))}`;
    rays += `<path d="M${p(a - w * 0.35, r0)}L${p(a - w, r1)}L${p(a + w, r1)}L${p(a + w * 0.35, r0)}Z" fill="${C1.gold}"/>`;
  }
  // River: three tapered ribbons that sweep in from the lower left and
  // bend (like the Ohio's horseshoe at Evansville) into the horizon.
  const ribbon = (p0, c1, c2, p3, w0, w1) => {
    const B = (t, a, b, c, d) => (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t * t * c + t ** 3 * d;
    const L = [], R = [];
    for (let i = 0; i <= 48; i++) {
      const t = i / 48, e = 1e-3;
      const x = B(t, p0[0], c1[0], c2[0], p3[0]), y = B(t, p0[1], c1[1], c2[1], p3[1]);
      const x2 = B(Math.min(1, t + e), p0[0], c1[0], c2[0], p3[0]), y2 = B(Math.min(1, t + e), p0[1], c1[1], c2[1], p3[1]);
      const x1 = B(Math.max(0, t - e), p0[0], c1[0], c2[0], p3[0]), y1 = B(Math.max(0, t - e), p0[1], c1[1], c2[1], p3[1]);
      let nx = -(y2 - y1), ny = x2 - x1; const nl = Math.hypot(nx, ny); nx /= nl; ny /= nl;
      const w = (w0 * (1 - t) ** 1.2 + w1 * t) / 2;
      L.push([x + nx * w, y + ny * w]); R.unshift([x - nx * w, y - ny * w]);
    }
    return `<path d="M${L.concat(R).map(p => p.map(P).join(" ")).join(" L")}Z" fill="${C1.white}"/>`;
  };
  const band = (k) => ribbon([-40, 292 + k * 62], [140, 280 + k * 66], [250, 268 + k * 40], [300 + k * 26, H + 3], 30 + k * 12, 3);
  return `
  <defs>
    <clipPath id="${uid}c"><circle cx="200" cy="200" r="184"/></clipPath>
    <clipPath id="${uid}s"><rect x="0" y="0" width="400" height="${H}"/></clipPath>
  </defs>
  <circle cx="200" cy="200" r="198" fill="${C1.navy}"/>
  <circle cx="200" cy="200" r="190" fill="none" stroke="${C1.gold}" stroke-width="5"/>
  <g clip-path="url(#${uid}c)">
    <rect width="400" height="400" fill="${C1.navy}"/>
    <g clip-path="url(#${uid}s)">${rays}<circle cx="200" cy="${H}" r="86" fill="${C1.gold}"/></g>
    <rect y="${H}" width="400" height="${400 - H}" fill="${C1.blue}"/>
    ${band(0)}${band(1)}${band(2)}
    <rect y="${H}" width="400" height="5" fill="${C1.navy}"/>
  </g>`;
}
const concept1 = {
  id: "glen-river-rise", num: "1", name: "Glen", title: "River Rise",
  banner() {
    const b = `
      <g transform="translate(50 50)">${emblemRiverRise("b1")}</g>
      ${T("GLEN", { x: 502, y: 134, font: "Montserrat", weight: 800, size: 60, fill: C1.blue, ls: 26, fit: 400 })}
      ${T("MILLER", { x: 494, y: 318, font: "Montserrat", weight: 900, size: 200, fill: C1.navy, fit: 950 })}
      <rect x="500" y="352" width="950" height="10" fill="${C1.gold}"/>
      ${T("CITY COUNCIL · WARD 3", { x: 500, y: 435, font: "Montserrat", weight: 700, size: 46, fill: C1.navy, ls: 8, fit: 650 })}
      ${T("DEMOCRAT", { x: 1450, y: 435, font: "Montserrat", weight: 800, size: 46, fill: C1.blue, ls: 8, anchor: "end", fit: 260 })}`;
    return svgWrap(1500, 500, C1.white, b, "1-banner");
  },
  sign() {
    const b = `
      <g transform="translate(445 40) scale(0.775)">${emblemRiverRise("s1")}</g>
      ${T("GLEN", { x: 600, y: 440, font: "Montserrat", weight: 700, size: 60, fill: C1.blue, ls: 30, anchor: "middle", fit: 360 })}
      ${T("MILLER", { x: 600, y: 640, font: "Montserrat", weight: 900, size: 220, fill: C1.navy, anchor: "middle", fit: 1060 })}
      <rect y="700" width="1200" height="200" fill="${C1.navy}"/>
      <rect y="700" width="1200" height="12" fill="${C1.gold}"/>
      ${T("CITY COUNCIL · WARD 3", { x: 600, y: 800, font: "Montserrat", weight: 800, size: 60, fill: C1.white, ls: 8, anchor: "middle", fit: 900 })}
      ${T("DEMOCRAT  ·  A NEW DAY FOR EVANSVILLE", { x: 600, y: 855, font: "Montserrat", weight: 700, size: 30, fill: C1.gold, ls: 5, anchor: "middle", fit: 720 })}`;
    return svgWrap(1200, 900, C1.white, b, "1-sign");
  },
};

/* ------------------------------------------------------------------ */
/* 2 · GLEN — "The Torch": the torch from Indiana's flag is the I     */
/* ------------------------------------------------------------------ */
const C2 = { bg: "#0B3478", deep: "#082658", gold: "#F2B632", flame: "#F28A1E", white: "#FFFFFF", pale: "#BFD0EE" };
// Torch with a three-tongued flame (one tongue for each part of "Ward 3"),
// drawn in units where s = letter stem width and H = cap height.
function torchShape(s, H) {
  const fw = s * 2.3, fh = H * 0.62, fy = -H * 0.9;
  const flame = "M50 100 C 12 100 2 78 9 58 C 14 44 22 38 19 18 C 31 30 35 44 36 52 C 37 34 42 16 50 0 C 58 16 63 34 64 52 C 65 44 69 30 81 18 C 78 38 86 44 91 58 C 98 78 88 100 50 100 Z";
  const inner = "M50 100 C 33 100 28 86 33 74 C 37 64 44 58 50 40 C 56 58 63 64 67 74 C 72 86 67 100 50 100 Z";
  const ft = `translate(${P(-fw / 2)} ${P(fy - fh)}) scale(${P(fw / 100)} ${P(fh / 100)})`;
  return `
    <path d="M${P(-s * 0.36)} 0 L${P(s * 0.36)} 0 L${P(s * 0.62)} ${P(-H * 0.7)} L${P(-s * 0.62)} ${P(-H * 0.7)} Z" fill="${C2.white}"/>
    <rect x="${P(-s * 0.75)}" y="${P(-H * 0.555)}" width="${P(s * 1.5)}" height="${P(H * 0.05)}" fill="${C2.bg}"/>
    <path d="M${P(-s * 1.1)} ${P(-H * 0.84)} L${P(s * 1.1)} ${P(-H * 0.84)} L${P(s * 0.72)} ${P(-H * 0.69)} L${P(-s * 0.72)} ${P(-H * 0.69)} Z" fill="${C2.gold}"/>
    <path d="${flame}" transform="${ft}" fill="${C2.gold}"/>
    <path d="${inner}" transform="${ft}" fill="${C2.flame}"/>
    <g class="torch-star" data-y="${P(fy - fh)}"></g>`;
}
function torchWordmark(cx, base, width, uid) {
  // Built after fonts load (see layoutTorch).
  return `<g class="torchmark" data-cx="${cx}" data-base="${base}" data-width="${width}" data-uid="${uid}"></g>`;
}
function layoutTorch(g) {
  const cx = +g.dataset.cx, base = +g.dataset.base, width = +g.dataset.width;
  const F = 100;
  const m = measure("700 100px Oswald", "M"), l = measure("700 100px Oswald", "LLER"), I = measure("700 100px Oswald", "I");
  const capH = m.ascent, stem = I.inkW, gap = 0.075 * F;
  const torchW = stem * 2.3;
  const total = m.adv + gap + torchW + gap + l.inkRight;
  const k = width / total, size = F * k;
  const x0 = cx - width / 2;
  const tx = x0 + (m.adv + gap + torchW / 2) * k;
  const lx = x0 + (m.adv + gap * 2 + torchW) * k;
  const H = capH * k, s = stem * k;
  const glenSize = H * 0.36;
  g.innerHTML = `
    <text x="${P(x0)}" y="${base}" font-family="Oswald" font-weight="700" font-size="${P(size)}" fill="${C2.white}">M</text>
    <g transform="translate(${P(tx)} ${base})">${torchShape(s, H)}</g>
    <text x="${P(lx)}" y="${base}" font-family="Oswald" font-weight="700" font-size="${P(size)}" fill="${C2.white}">LLER</text>
    <text x="${P(cx + width / 2)}" y="${P(base - H - H * 0.14)}" text-anchor="end" font-family="Oswald" font-weight="600" font-size="${P(glenSize)}" letter-spacing="${P(glenSize * 0.42)}" fill="${C2.gold}">GLEN</text>`;
  const st = g.querySelector(".torch-star");
  const sy = +st.dataset.y;
  st.outerHTML = star(0, sy - H * 0.22, H * 0.16, C2.gold);
  // Correct the trailing letter-spacing on GLEN so it ends flush with the R.
  const glen = g.querySelectorAll("text")[2];
  glen.setAttribute("x", P(cx + width / 2 + glenSize * 0.42));
}
function starRow(cx, y, count, r, gapW, fill) {
  let s = "";
  const span = (count - 1) * gapW;
  for (let i = 0; i < count; i++) s += star(cx - span / 2 + i * gapW, y, r, fill);
  return s;
}
const concept2 = {
  id: "glen-torch", num: "2", name: "Glen", title: "The Torch",
  banner() {
    const b = `
      ${torchWordmark(545, 392, 790, "b2")}
      <rect x="1030" y="70" width="4" height="360" fill="${C2.gold}" opacity=".6"/>
      ${T("CITY COUNCIL", { x: 1080, y: 165, font: "Oswald", weight: 600, size: 58, fill: C2.white, ls: 5, fit: 360 })}
      ${T("WARD 3", { x: 1076, y: 330, font: "Oswald", weight: 700, size: 150, fill: C2.gold, ls: 3, fit: 364 })}
      ${T("DEMOCRAT", { x: 1081, y: 405, font: "Oswald", weight: 500, size: 34, fill: C2.pale, ls: 12, fit: 360 })}
      ${starRow(545, 446, 18, 8, 45, C2.gold)}`;
    return svgWrap(1500, 500, C2.bg, b, "2-banner");
  },
  sign() {
    const b = `
      ${torchWordmark(600, 590, 940, "s2")}
      ${starRow(600, 626, 18, 9, 54, C2.gold)}
      <rect y="672" width="1200" height="228" fill="${C2.deep}"/>
      <rect y="672" width="1200" height="8" fill="${C2.gold}"/>
      ${T("CITY COUNCIL · WARD 3", { x: 600, y: 800, font: "Oswald", weight: 700, size: 100, fill: C2.white, ls: 8, anchor: "middle", fit: 940 })}
      ${T("DEMOCRAT  ·  LIGHTING THE WAY FORWARD", { x: 600, y: 855, font: "Oswald", weight: 500, size: 38, fill: C2.gold, ls: 8, anchor: "middle", fit: 760 })}`;
    return svgWrap(1200, 900, C2.bg, b, "2-sign");
  },
};

/* ------------------------------------------------------------------ */
/* 3 · GLEN — "Bridge M": the M is a twin-span truss bridge            */
/* ------------------------------------------------------------------ */
const C3 = { bg: "#102A43", steel: "#FFFFFF", river: "#4CB5E0", river2: "#2D7FB8", pale: "#9FB3C8", gold: "#F2C14E" };
function emblemBridgeM() {
  // M = two cantilever truss spans on three piers, over three river lines.
  const L = 40, R = 360, top = 70, mid = 200, deck = 300, w = 34;
  const span = (x0, x1, peak) => {
    // Outer chord (arched top) and inner deck, filled with triangulated web.
    const pts = [];
    const steps = 6;
    let web = "";
    const topY = (t) => peak + (1 - Math.sin(Math.PI * t)) * 0 ;
    return { x0, x1 };
  };
  // Letterform outline: legs + two peaked chords meeting at a center V.
  const outer = `M${L} ${deck} L${L} ${top + 30} Q ${L} ${top} ${L + 30} ${top} L ${L + 70} ${top}
     Q ${mid - 40} ${top + 10} ${mid} ${mid - 10} Q ${mid + 40} ${top + 10} ${R - 70} ${top} L ${R - 30} ${top} Q ${R} ${top} ${R} ${top + 30} L ${R} ${deck}`;
  // Build truss as polylines between top chord and deck.
  const chord = (x) => {
    // y of the top chord at x (piecewise smooth M-shape)
    if (x <= L + 70) return top;
    if (x >= R - 70) return top;
    const t = x < mid ? (x - (L + 70)) / (mid - (L + 70)) : (R - 70 - x) / (R - 70 - mid);
    return top + (mid - 10 - top) * Math.pow(t, 1.6);
  };
  let web = "";
  const xs = [];
  for (let x = L; x <= R + 0.1; x += 40) xs.push(x);
  for (let i = 0; i < xs.length - 1; i++) {
    const a = xs[i], b = xs[i + 1];
    const ya = chord(a), yb = chord(b);
    // verticals
    web += `M${a} ${P(ya)} L${a} ${deck} `;
    // diagonals alternate direction, mirrored about center
    if (a < mid) web += `M${a} ${P(ya)} L${b} ${deck} `;
    else web += `M${a} ${deck} L${b} ${P(yb)} `;
  }
  web += `M${R} ${P(chord(R))} L${R} ${deck}`;
  let chordPath = "";
  for (let x = L; x <= R; x += 4) chordPath += (x === L ? "M" : "L") + x + " " + P(chord(x)) + " ";
  return `
    <path d="${web}" stroke="${C3.steel}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="${chordPath}" stroke="${C3.steel}" stroke-width="22" fill="none" stroke-linejoin="round" stroke-linecap="square"/>
    <rect x="${L - 11}" y="${top - 11}" width="22" height="${deck - top + 11}" fill="${C3.steel}"/>
    <rect x="${R - 11}" y="${top - 11}" width="22" height="${deck - top + 11}" fill="${C3.steel}"/>
    <rect x="${mid - 9}" y="${mid - 10}" width="18" height="${deck - mid + 10}" fill="${C3.steel}"/>
    <rect x="${L - 26}" y="${deck - 4}" width="${R - L + 52}" height="16" fill="${C3.steel}"/>
    <rect x="${L - 20}" y="${deck + 12}" width="18" height="34" fill="${C3.pale}"/>
    <rect x="${mid - 9}" y="${deck + 12}" width="18" height="34" fill="${C3.pale}"/>
    <rect x="${R + 2}" y="${deck + 12}" width="18" height="34" fill="${C3.pale}"/>
    ${[0, 1, 2].map(i => `<path d="M${10 + i * 18} ${deck + 58 + i * 22} q 23 -12 46 0 t 46 0 t 46 0 t 46 0 t 46 0 t 46 0 t 46 0 ${i < 2 ? "t 46 0" : ""}" stroke="${i === 1 ? C3.river2 : C3.river}" stroke-width="9" fill="none" stroke-linecap="round" transform="translate(${i * -6} 0)"/>`).join("")}`;
}
const concept3 = {
  id: "glen-bridge", num: "3", name: "Glen", title: "Bridge Builder",
  banner() {
    const b = `
      <g transform="translate(70 42) scale(1)">${emblemBridgeM()}</g>
      <rect x="500" y="70" width="3" height="360" fill="${C3.river}" opacity=".7"/>
      ${T("GLEN MILLER", { x: 548, y: 250, font: "Barlow Semi Condensed", weight: 800, size: 170, fill: C3.steel, ls: 2, fit: 890 })}
      ${T("BUILDING BRIDGES FOR WARD 3", { x: 552, y: 335, font: "Barlow Semi Condensed", weight: 700, size: 54, fill: C3.river, ls: 6, fit: 880 })}
      ${T("EVANSVILLE CITY COUNCIL  ·  DEMOCRAT", { x: 552, y: 405, font: "Barlow Semi Condensed", weight: 600, size: 34, fill: C3.pale, ls: 7, fit: 640 })}`;
    return svgWrap(1500, 500, C3.bg, b, "3-banner");
  },
  sign() {
    const b = `
      <g transform="translate(410 26) scale(0.95)">${emblemBridgeM()}</g>
      ${T("GLEN MILLER", { x: 600, y: 590, font: "Barlow Semi Condensed", weight: 800, size: 200, fill: C3.steel, ls: 2, anchor: "middle", fit: 1080 })}
      <rect y="650" width="1200" height="250" fill="${C3.river}"/>
      ${T("CITY COUNCIL · WARD 3", { x: 600, y: 770, font: "Barlow Semi Condensed", weight: 800, size: 110, fill: C3.bg, ls: 6, anchor: "middle", fit: 980 })}
      ${T("DEMOCRAT  ·  BUILDING BRIDGES", { x: 600, y: 845, font: "Barlow Semi Condensed", weight: 700, size: 44, fill: C3.bg, ls: 10, anchor: "middle", fit: 700 })}`;
    return svgWrap(1200, 900, C3.bg, b, "3-sign");
  },
};

/* ------------------------------------------------------------------ */
/* 4 · SCOTT — "Cardinal": Indiana's state bird perched on the name   */
/* ------------------------------------------------------------------ */
const C4 = { bg: "#0E1B33", red: "#D2202F", red2: "#A3121F", red3: "#E8433F", mask: "#05080F", beak: "#F49A2C", white: "#FFFFFF", pale: "#AAB6CC" };
// Faceted cardinal, facing left, feet at (0,0), body drawn upward.
function cardinal() {
  const pts = (a) => a.map(p => p.join(" ")).join(" L");
  const g = (d, f) => `<path d="M${d}Z" fill="${f}"/>`;
  return `
    <g transform="translate(-112 -214)">
      ${g(pts([[150, 105], [118, 0], [178, 58], [190, 112]]), C4.red2)}
      ${g(pts([[118, 0], [92, 40], [150, 105], [178, 58]]), C4.red3)}
      ${g(pts([[92, 40], [74, 78], [104, 128], [150, 105]]), C4.red)}
      ${g(pts([[74, 78], [78, 135], [104, 128]]), C4.red2)}
      ${g(pts([[150, 105], [104, 128], [92, 170], [138, 214], [196, 176], [190, 112]]), C4.red)}
      ${g(pts([[104, 128], [78, 135], [80, 180], [92, 170]]), C4.red3)}
      ${g(pts([[80, 180], [104, 210], [138, 214], [92, 170]]), C4.red3)}
      ${g(pts([[150, 120], [196, 132], [232, 196], [196, 214], [150, 176]]), C4.red2)}
      ${g(pts([[196, 214], [232, 196], [292, 300], [270, 312]]), C4.red2)}
      ${g(pts([[196, 214], [270, 312], [248, 318], [184, 214]]), C4.red)}
      ${g(pts([[92, 40], [62, 64], [56, 88], [74, 102], [104, 104], [106, 78]]), C4.mask)}
      ${g(pts([[62, 64], [22, 86], [58, 98]]), C4.beak)}
      ${g(pts([[58, 98], [22, 86], [60, 108]]), "#D97A16")}
      <circle cx="86" cy="70" r="7.5" fill="${C4.white}"/><circle cx="84" cy="70" r="4.2" fill="${C4.mask}"/>
      <path d="M120 212 L114 232 M144 212 L146 232" stroke="${C4.mask}" stroke-width="6" stroke-linecap="round"/>
    </g>`;
}
function cardinalWordmark(cx, base, width, color, last = "MILLER", first = "SCOTT") {
  return `<g class="birdmark" data-cx="${cx}" data-base="${base}" data-width="${width}" data-color="${color}" data-first="${first}" data-last="${last}"></g>`;
}
function layoutBird(g) {
  const cx = +g.dataset.cx, base = +g.dataset.base, width = +g.dataset.width, color = g.dataset.color;
  const m = measure("400 100px 'Archivo Black'", "MILLER");
  const k = width / m.inkW, size = 100 * k;
  const x0 = cx - width / 2 - m.inkLeft * k;
  const capH = m.ascent * k;
  const rM = measure("400 100px 'Archivo Black'", "MILLE");
  const rx = x0 + rM.adv * k; // start of R
  const R = measure("400 100px 'Archivo Black'", "R");
  const birdScale = capH / 214 * 1.08;
  const scott = capH * 0.42;
  g.innerHTML = `
    <text x="${P(x0)}" y="${base}" font-family="'Archivo Black'" font-size="${P(size)}" fill="${color}">MILLER</text>
    <text x="${P(cx - width / 2)}" y="${P(base - capH - capH * 0.16)}" font-family="'Archivo Black'" font-size="${P(scott)}" letter-spacing="${P(scott * 0.32)}" fill="${C4.red}">SCOTT</text>
    <g transform="translate(${P(rx + R.inkW * k * 0.38)} ${P(base - capH + 2)}) scale(${P(birdScale)})">${cardinal()}</g>`;
}
const concept4 = {
  id: "scott-cardinal", num: "4", name: "Scott", title: "The Cardinal",
  banner() {
    const b = `
      ${cardinalWordmark(530, 362, 880, C4.white)}
      <rect x="1080" y="70" width="4" height="360" fill="${C4.red}"/>
      ${T("CITY COUNCIL", { x: 1124, y: 168, font: "Inter", weight: 800, size: 54, fill: C4.white, ls: 5, fit: 316 })}
      ${T("WARD 3", { x: 1121, y: 318, font: "Archivo Black", weight: 400, size: 110, fill: C4.red, ls: 2, fit: 320 })}
      ${T("DEMOCRAT", { x: 1125, y: 392, font: "Inter", weight: 700, size: 30, fill: C4.pale, ls: 12, fit: 316 })}
      ${T("HOMEGROWN  ·  HARD-WORKING  ·  HERE FOR YOU", { x: 90, y: 440, font: "Inter", weight: 700, size: 28, fill: C4.pale, ls: 7, fit: 880 })}`;
    return svgWrap(1500, 500, C4.bg, b, "4-banner");
  },
  sign() {
    const b = `
      ${cardinalWordmark(560, 585, 960, C4.white)}
      <rect y="660" width="1200" height="240" fill="${C4.red}"/>
      ${T("CITY COUNCIL · WARD 3", { x: 600, y: 790, font: "Archivo Black", weight: 400, size: 100, fill: C4.white, ls: 4, anchor: "middle", fit: 980 })}
      ${T("DEMOCRAT  ·  HOMEGROWN FOR EVANSVILLE", { x: 600, y: 855, font: "Inter", weight: 800, size: 36, fill: C4.white, ls: 8, anchor: "middle", fit: 740 })}`;
    return svgWrap(1200, 900, C4.bg, b, "4-sign");
  },
};

/* ------------------------------------------------------------------ */
/* 5 · SCOTT — "Hometown Star": Indiana, with Evansville marked        */
/* ------------------------------------------------------------------ */
const C5 = { bg: "#FFFFFF", blue: "#1747A6", navy: "#0F2550", red: "#D62839", sky: "#DCE6F7" };
// Indiana outline from real coordinates (lon, lat), projected.
const IN_PTS = [[-87.53, 41.76], [-84.81, 41.76], [-84.81, 39.10], [-84.88, 39.06], [-84.83, 38.90], [-85.18, 38.69], [-85.43, 38.73], [-85.47, 38.52], [-85.70, 38.32], [-85.84, 38.26], [-85.91, 38.06], [-86.04, 37.96], [-86.27, 38.14], [-86.38, 38.13], [-86.51, 37.93], [-86.76, 37.90], [-86.82, 37.99], [-87.04, 37.88], [-87.13, 37.79], [-87.40, 37.94], [-87.57, 37.97], [-87.62, 37.83], [-87.92, 37.90], [-88.03, 37.80], [-88.09, 37.90], [-87.92, 38.15], [-87.94, 38.29], [-87.74, 38.47], [-87.66, 38.51], [-87.50, 38.73], [-87.53, 39.15], [-87.65, 39.15], [-87.53, 39.35], [-87.53, 41.76]];
const EVV = [-87.57, 37.97];
function projIN(scale, ox, oy) {
  const f = ([lon, lat]) => [ox + (lon + 88.12) * scale, oy + (41.78 - lat) * scale * 1.27];
  return { f, d: "M" + IN_PTS.map(p => f(p).map(P).join(" ")).join(" L") + " Z" };
}
function emblemIndiana() {
  const { f, d } = projIN(88, 54, 0);
  const [ex, ey] = f(EVV);
  return `
    <path d="${d}" fill="${C5.blue}" stroke="${C5.blue}" stroke-width="10" stroke-linejoin="round"/>
    <clipPath id="inclip"><path d="${d}"/></clipPath>
    <g clip-path="url(#inclip)">${[1, 2, 3].map(i => `<circle cx="${P(ex)}" cy="${P(ey)}" r="${30 + 46 * i}" stroke="#FFFFFF" stroke-width="${9 - i * 2}" fill="none" opacity="${1 - i * 0.2}"/>`).join("")}</g>
    <circle cx="${P(ex)}" cy="${P(ey)}" r="36" fill="#FFFFFF" stroke="${C5.blue}" stroke-width="6"/>
    ${star(ex, ey + 2, 28, C5.red)}`;
}
const concept5 = {
  id: "scott-hometown-star", num: "5", name: "Scott", title: "Hometown Star",
  banner() {
    const b = `
      <g transform="translate(60 26) scale(0.95)">${emblemIndiana()}</g>
      ${T("SCOTT", { x: 420, y: 190, font: "Bebas Neue", weight: 400, size: 150, fill: C5.red, ls: 18, fit: 470 })}
      ${T("MILLER", { x: 418, y: 395, font: "Bebas Neue", weight: 400, size: 250, fill: C5.navy, ls: 6, fit: 650 })}
      <rect x="1115" y="80" width="330" height="340" rx="0" fill="${C5.blue}"/>
      ${T("CITY COUNCIL", { x: 1280, y: 160, font: "Bebas Neue", weight: 400, size: 60, fill: "#FFFFFF", ls: 4, anchor: "middle", fit: 270 })}
      ${T("WARD", { x: 1280, y: 228, font: "Bebas Neue", weight: 400, size: 52, fill: C5.sky, ls: 14, anchor: "middle" })}
      ${T("3", { x: 1280, y: 388, font: "Bebas Neue", weight: 400, size: 190, fill: "#FFFFFF", anchor: "middle" })}
      ${T("EVANSVILLE  ·  DEMOCRAT  ·  HOMETOWN STRONG", { x: 422, y: 450, font: "Inter", weight: 700, size: 24, fill: C5.blue, ls: 6, fit: 650 })}`;
    return svgWrap(1500, 500, C5.bg, b, "5-banner");
  },
  sign() {
    const b = `
      <g transform="translate(70 92) scale(1.0)">${emblemIndiana()}</g>
      ${T("SCOTT", { x: 450, y: 240, font: "Bebas Neue", weight: 400, size: 150, fill: C5.red, ls: 18, fit: 560 })}
      ${T("MILLER", { x: 446, y: 520, font: "Bebas Neue", weight: 400, size: 300, fill: C5.navy, ls: 6, fit: 680 })}
      <rect y="620" width="1200" height="280" fill="${C5.blue}"/>
      ${T("CITY COUNCIL · WARD 3", { x: 600, y: 770, font: "Bebas Neue", weight: 400, size: 150, fill: "#FFFFFF", ls: 6, anchor: "middle", fit: 1000 })}
      ${T("DEMOCRAT  ·  HOMETOWN STRONG", { x: 600, y: 845, font: "Inter", weight: 800, size: 36, fill: C5.sky, ls: 9, anchor: "middle", fit: 640 })}`;
    return svgWrap(1200, 900, C5.bg, b, "5-sign");
  },
};

/* ------------------------------------------------------------------ */
/* 6 · SCOTT — "Tulip Tree": Indiana's state tree in bloom             */
/* ------------------------------------------------------------------ */
const C6 = { bg: "#F6F4EC", green: "#1F4D3A", leaf: "#2F7A4F", leaf2: "#4C9A63", petal: "#E9E3A8", petal2: "#D7CF86", orange: "#EE7B22", ink: "#173A2C" };
function tulipLeaf(fill, vein) {
  // Tulip-tree leaf: four lobes with the flat, notched tip that gives the tree its name.
  return `<path d="M0 0 C -14 -8 -40 -16 -58 -40 L -44 -52 C -54 -66 -52 -88 -40 -104 L -14 -98 C -8 -96 -4 -92 0 -86 C 4 -92 8 -96 14 -98 L 40 -104 C 52 -88 54 -66 44 -52 L 58 -40 C 40 -16 14 -8 0 0 Z" fill="${fill}"/>
          <path d="M0 0 L0 -86 M0 -36 L-36 -50 M0 -36 L36 -50 M0 -62 L -30 -88 M0 -62 L 30 -88" stroke="${vein}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
}
function emblemTulip(uid) {
  // Tulip-poplar bloom seen from the side: a six-petal cup (three visible),
  // pale green-gold with the tree's signature orange band at the base.
  const petal = (id, d, fill) => `
    <clipPath id="${uid}${id}"><path d="${d}"/></clipPath>
    <path d="${d}" fill="${fill}"/>
    <g clip-path="url(#${uid}${id})"><path d="M60 330 L60 262 Q 200 228 340 262 L340 330 Z" fill="${C6.orange}"/></g>
    <path d="${d}" fill="none" stroke="${C6.green}" stroke-width="6" stroke-linejoin="round"/>`;
  const L = "M200 304 C 150 304 112 280 102 214 C 98 190 100 172 106 156 C 136 160 162 182 178 214 C 188 236 194 270 200 304 Z";
  const Rr = "M200 304 C 250 304 288 280 298 214 C 302 190 300 172 294 156 C 264 160 238 182 222 214 C 212 236 206 270 200 304 Z";
  const M = "M200 306 C 166 306 146 280 144 222 C 143 186 150 150 160 128 C 176 120 224 120 240 128 C 250 150 257 186 256 222 C 254 280 234 306 200 306 Z";
  return `
    <circle cx="200" cy="200" r="196" fill="${C6.green}"/>
    <circle cx="200" cy="200" r="183" fill="none" stroke="${C6.petal}" stroke-width="3" opacity=".55"/>
    <g transform="translate(0 -14)">
    <path d="M200 300 L200 360" stroke="${C6.leaf2}" stroke-width="10" stroke-linecap="round"/>
    <g transform="translate(194 352) rotate(-64) scale(1.05)">${tulipLeaf(C6.leaf, C6.green)}</g>
    <g transform="translate(206 352) rotate(64) scale(1.05)">${tulipLeaf(C6.leaf2, C6.green)}</g>
    ${petal("l", L, C6.petal2)}
    ${petal("r", Rr, C6.petal2)}
    ${petal("m", M, C6.petal)}
    <path d="M200 140 L200 300" stroke="${C6.petal2}" stroke-width="3" opacity=".8"/></g>`;
}
const concept6 = {
  id: "scott-tulip-tree", num: "6", name: "Scott", title: "Tulip Tree",
  banner() {
    const b = `
      <g transform="translate(50 50)">${emblemTulip("b6")}</g>
      ${T("Scott Miller", { x: 500, y: 255, font: "Fraunces", weight: 800, size: 190, fill: C6.ink, fit: 950, attr: { style: "font-variation-settings:'opsz' 144" } })}
      <rect x="503" y="300" width="70" height="8" fill="${C6.orange}"/>
      ${T("CITY COUNCIL · WARD 3", { x: 596, y: 312, font: "Inter", weight: 800, size: 40, fill: C6.green, ls: 8, fit: 540 })}
      ${T("Rooted in Ward 3. Growing Evansville.", { x: 502, y: 410, font: "Fraunces", weight: 600, size: 46, fill: C6.leaf, attr: { "font-style": "italic" }, fit: 720 })}
      ${T("DEMOCRAT", { x: 1450, y: 312, font: "Inter", weight: 800, size: 40, fill: C6.orange, ls: 8, anchor: "end", fit: 250 })}`;
    return svgWrap(1500, 500, C6.bg, b, "6-banner");
  },
  sign() {
    const b = `
      <g transform="translate(440 28) scale(0.8)">${emblemTulip("s6")}</g>
      ${T("Scott Miller", { x: 600, y: 530, font: "Fraunces", weight: 800, size: 190, fill: C6.ink, anchor: "middle", fit: 1060, attr: { style: "font-variation-settings:'opsz' 144" } })}
      ${T("Rooted in Ward 3. Growing Evansville.", { x: 600, y: 618, font: "Fraunces", weight: 600, size: 50, fill: C6.leaf, anchor: "middle", attr: { "font-style": "italic" }, fit: 760 })}
      <rect y="680" width="1200" height="220" fill="${C6.green}"/>
      <rect y="680" width="1200" height="10" fill="${C6.orange}"/>
      ${T("CITY COUNCIL · WARD 3", { x: 600, y: 800, font: "Inter", weight: 800, size: 80, fill: C6.bg, ls: 8, anchor: "middle", fit: 940 })}
      ${T("DEMOCRAT", { x: 600, y: 860, font: "Inter", weight: 800, size: 34, fill: C6.orange, ls: 14, anchor: "middle" })}`;
    return svgWrap(1200, 900, C6.bg, b, "6-sign");
  },
};


/* ------------------------------------------------------------------ */
/* 2B · GLEN — "The Flag Torch": the torch from Indiana's flag, drawn  */
/* to the flag's own proportions, is the I in MILLER.                   */
/* ------------------------------------------------------------------ */
// Geometry traced from the 1917 Indiana state flag (public domain), in flag
// units. Torch center x = 300.95, rim top y = 180.93. The flag's handle is
// broken by a star; here it runs unbroken to a point at y = 365.
const FLAG = {
  "flameL": "M 279.66,179.17 L 279.58,179.07 C 267.37,162.94 279.79,157.07 280.04,145.61 C 288.12,160.61 276.28,165.27 290.35,179.18 L 279.66,179.17 Z",
  "flameC": "M 293.14,179.18 C 288.84,173.13 285.82,163.48 287.14,157.18 C 288.46,150.88 292.79,144.67 292.14,139.9 C 294.42,145.27 297.24,145.28 296.57,149.23 C 299.99,139.04 301.44,131.23 312.09,130.71 C 300.85,147.07 323.66,161.05 307.09,179.2 L 293.14,179.18 Z",
  "flameR": "M 310.69,179.2 C 325.9,160.85 306.55,151.45 324.19,143.2 C 324.83,148.62 320.51,148.62 322.42,155.26 A 13.14,13.14 0 0,1 321.42,162.48 C 323.22,160.28 326.71,156.13 328.92,154.48 C 323.68,162.38 333.55,169.3 320.92,179.13 L 310.43,179.13 Z",
  "rim": "M 329.24,186.37 L 272.64,186.31 L 272.64,180.93 L 329.25,180.99 L 329.24,186.37 Z",
  "cup": "M 311.86,225.27 C 312.66,204.82 317.04,198.59 325.33,190.04 L 276.61,190.04 C 284.87,198.6 289.24,204.83 290,225.28 Q 300.94,225.23 311.86,225.27 L 311.86,225.27 Z",
  "collar": "M 315.46,234.12 L 285.6,234.12 L 285.6,227.4 L 315.46,227.4 L 315.46,234.12 Z",
  "rays": "M 160.47,181.23 L 267.05,168.46 L 266.72,165.6 L 160.11,178.38 L 160.47,181.23 M 180.72,116.55 L 268.37,150.26 L 269.37,147.58 L 181.73,113.87 L 180.72,116.55 M 235,78.92 L 272.72,132.66 L 275.06,131 L 237.32,77.28 L 235,78.92 Z",
  "star": "M 280,93 L 295.78,93 L 301,77.56 L 305.8,93 L 321.67,93 L 309.36,103 L 313.82,117.62 L 300.82,108.85 L 287.91,117.7 L 292.3,102.86 L 280,93 Z",
  "dash": "M 299.11,114.18 L 299.11,125.65 L 302,125.65 L 302,114.17 L 299.11,114.18 Z"
};
FLAG.handle = "M291.1 235.9 L310.8 235.9 L306.15 318 C305.6 345 303.4 359 300.95 365 C298.5 359 296.3 345 295.75 318 Z";
const C2B = { bg: "#0A2A6E", bg2: "#123B8C", deep: "#071D4E", gold: "#E9B02A", goldHi: "#F6C94A", white: "#FFFFFF", pale: "#B9CAE8" };
function flagTorch(fill, withRays) {
  const parts = ["flameL", "flameC", "flameR", "rim", "cup", "collar", "handle"].map(k => `<path d="${FLAG[k]}"/>`).join("");
  // Rays, dash and star are lifted 12 flag units so the lowest rays clear the cap line of the neighbouring letters.
  const rays = withRays ? `<g transform="translate(0 -12)"><path d="${FLAG.rays}"/><path d="${FLAG.rays}" transform="translate(601.9 0) scale(-1 1)"/><path d="${FLAG.dash}"/><path d="${FLAG.star}"/></g>` : "";
  return `<g fill="${fill}">${rays}${parts}</g>`;
}
function layoutFlagTorch(g) {
  const cx = +g.dataset.cx, base = +g.dataset.base, width = +g.dataset.width;
  const font = "700 100px Oswald";
  const m = measure(font, "M"), l = measure(font, "LLER");
  const capH = m.ascent;
  const k100 = capH / (365 - 180.93);            // flag units -> px at 100px type
  const torchW = (329.25 - 272.64) * k100, gap = 6;
  const total = m.adv + gap + torchW + gap + l.inkRight;
  const s = width / total, size = 100 * s, k = k100 * s, H = capH * s;
  const x0 = cx - width / 2;
  const tx = x0 + (m.adv + gap + torchW / 2) * s;
  const lx = x0 + (m.adv + gap * 2 + torchW) * s;
  const glen = H * 0.3, glenTrack = glen * 0.5;
  const rayReach = (300.95 - 160.11) * k;
  g.innerHTML = `
    <text x="${P(x0)}" y="${base}" font-family="Oswald" font-weight="700" font-size="${P(size)}" fill="${C2B.white}">M</text>
    <g transform="translate(${P(tx)} ${base}) scale(${P(k)}) translate(-300.95 -365)">${flagTorch(C2B.gold, true)}</g>
    <text x="${P(lx)}" y="${base}" font-family="Oswald" font-weight="700" font-size="${P(size)}" fill="${C2B.white}">LLER</text>
    <text class="glen" x="${P(cx + width / 2 + glenTrack)}" y="${P(base - H - H * 0.2)}" text-anchor="end" font-family="Oswald" font-weight="600" font-size="${P(glen)}" letter-spacing="${P(glenTrack)}" fill="${C2B.goldHi}">GLEN</text>`;
  g.dataset.torchX = P(tx); g.dataset.rayReach = P(rayReach);
}
function flagTorchWordmark(cx, base, width) {
  return `<g class="flagtorchmark" data-cx="${cx}" data-base="${base}" data-width="${width}"></g>`;
}
function glow(id, cx, cy, r) {
  return `<defs><radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#2A62C9" stop-opacity=".85"/><stop offset=".45" stop-color="${C2B.bg2}" stop-opacity=".55"/><stop offset="1" stop-color="${C2B.bg}" stop-opacity="0"/></radialGradient></defs>`;
}
const concept2b = {
  id: "glen-flag-torch", num: "2B", name: "Glen", title: "The Flag Torch",
  banner() {
    // Wordmark 820 wide centred at x=520; torch sits ~ x=330.
    const b = `
      ${glow("g2bb", 352, 170, 440)}
      <rect width="1500" height="500" fill="url(#g2bb)"/>
      ${flagTorchWordmark(520, 400, 820)}
      ${starRow(520, 448, 18, 7.5, 47, C2B.gold)}
      <rect x="1010" y="78" width="3" height="344" fill="${C2B.gold}"/>
      ${T("CITY COUNCIL", { x: 1060, y: 172, font: "Oswald", weight: 600, size: 58, fill: C2B.white, ls: 6, fit: 380 })}
      ${T("WARD 3", { x: 1055, y: 340, font: "Oswald", weight: 700, size: 160, fill: C2B.gold, ls: 4, fit: 386 })}
      ${T("DEMOCRAT", { x: 1061, y: 412, font: "Oswald", weight: 500, size: 34, fill: C2B.pale, ls: 14, fit: 380 })}`;
    return svgWrap(1500, 500, C2B.bg, b, "2b-banner");
  },
  sign() {
    const b = `
      ${glow("g2bs", 410, 230, 520)}
      <rect width="1200" height="900" fill="url(#g2bs)"/>
      ${flagTorchWordmark(600, 545, 960)}
      ${starRow(600, 600, 18, 8.5, 55, C2B.gold)}
      <rect y="660" width="1200" height="240" fill="${C2B.deep}"/>
      <rect y="660" width="1200" height="8" fill="${C2B.gold}"/>
      ${T("CITY COUNCIL · WARD 3", { x: 600, y: 792, font: "Oswald", weight: 700, size: 100, fill: C2B.white, ls: 8, anchor: "middle", fit: 950 })}
      ${T("DEMOCRAT  ·  LIGHTING THE WAY FORWARD", { x: 600, y: 856, font: "Oswald", weight: 500, size: 38, fill: C2B.gold, ls: 8, anchor: "middle", fit: 760 })}`;
    return svgWrap(1200, 900, C2B.bg, b, "2b-sign");
  },
};

const CONCEPTS = [concept1, concept2, concept2b, concept3, concept4, concept5, concept6];

/* ---------------------------- layout pass --------------------------- */
const _cv = document.createElement("canvas").getContext("2d");
function measure(font, text) {
  _cv.font = font;
  const m = _cv.measureText(text);
  return { adv: m.width, ascent: m.actualBoundingBoxAscent, inkLeft: -m.actualBoundingBoxLeft, inkRight: m.actualBoundingBoxRight, inkW: m.actualBoundingBoxRight + m.actualBoundingBoxLeft };
}
function fitTexts(svg) {
  svg.querySelectorAll("text[data-fit]").forEach(t => {
    const target = +t.dataset.fit;
    const ls = +(t.getAttribute("letter-spacing") || 0);
    const size = +t.getAttribute("font-size");
    const len = t.getComputedTextLength() - ls; // drop trailing tracking
    const f = target / len;
    if (f < 1 || t.dataset.grow !== "no") {
      t.setAttribute("font-size", P(size * f));
      if (ls) t.setAttribute("letter-spacing", P(ls * f));
    }
    // Center-anchored text with tracking: shift by half the trailing space.
    if (t.getAttribute("text-anchor") === "middle" && ls) t.setAttribute("x", P(+t.getAttribute("x") + (ls * f) / 2));
    if (t.getAttribute("text-anchor") === "end" && ls) t.setAttribute("x", P(+t.getAttribute("x") + ls * f));
    t.removeAttribute("data-fit");
  });
}
function layoutAll(root) {
  root.querySelectorAll("g.torchmark").forEach(layoutTorch);
  root.querySelectorAll("g.flagtorchmark").forEach(layoutFlagTorch);
  root.querySelectorAll("g.birdmark").forEach(layoutBird);
  root.querySelectorAll("svg[data-id]").forEach(fitTexts);
}
window.MILLER = { CONCEPTS, layoutAll, FONT_CSS };
