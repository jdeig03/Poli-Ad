/* Round 2: three refinements of #1 (River Rise) and three of #2 (Flag Torch).
   Depends on logos.js. */

/* ============================ #1 RIVER RISE ============================ */
const R1 = { navy: "#0D2747", blue: "#1C4E9A", blueHi: "#2A63B8", gold: "#F4AF2D", white: "#FFFFFF", tonal: "#143561", ice: "#D9E4F4" };

// Sun glitter on the water: short gold bars that shrink as they move toward the viewer.
function glitter(cx, y0, w0, rows, gap) {
  let s = "";
  for (let i = 0; i < rows; i++) {
    const w = w0 * (1 - i / (rows + 1)), h = Math.max(3, 9 - i * 1.2);
    s += `<rect x="${P(cx - w / 2 + (i % 2 ? w * 0.08 : -w * 0.06))}" y="${P(y0 + i * gap)}" width="${P(w)}" height="${P(h)}" rx="${P(h / 2)}" fill="${R1.gold}" opacity="${P(1 - i * 0.12)}"/>`;
  }
  return s;
}
function tonalRays(cx, cy, n, r, fill, clipId, clipRect) {
  let s = "";
  for (let i = 0; i < n; i++) {
    const a = Math.PI + (Math.PI / n) * (i + 0.5), w = Math.PI / n * 0.28;
    const p = (ang) => `${P(cx + r * Math.cos(ang))} ${P(cy + r * Math.sin(ang))}`;
    s += `<path d="M${cx} ${cy} L${p(a - w)} L${p(a + w)} Z" fill="${fill}"/>`;
  }
  return `<defs><clipPath id="${clipId}"><rect ${clipRect}/></clipPath></defs><g clip-path="url(#${clipId})">${s}</g>`;
}
const tl = (txt, o) => `<text x="${o.x}" y="${o.y}" font-family="${o.font || "Montserrat"}" font-weight="${o.weight || 800}" font-size="${o.size}" fill="${o.fill}" textLength="${o.len}" lengthAdjust="spacing" ${o.anchor ? `text-anchor="${o.anchor}"` : ""}>${txt}</text>`;

/* 1A · Horizon Lockup: emblem and name side by side, so the white space is used. */
const v1a = {
  id: "1a", group: 1, title: "1A · Side-by-Side",
  note: "The emblem moves beside the name instead of floating above it. GLEN and MILLER are stacked to match the emblem's height, so the white area is filled edge to edge. A tagline under the gold rule adds the message without clutter.",
  sign() {
    const b = `
      <g transform="translate(56 92) scale(.9)">${emblemRiverRise("v1as")}</g>
      ${T("GLEN", { x: 452, y: 196, font: "Montserrat", weight: 800, size: 80, fill: R1.blue, ls: 34, fit: 420 })}
      ${T("MILLER", { x: 446, y: 382, font: "Montserrat", weight: 900, size: 200, fill: R1.navy, fit: 704 })}
      <rect x="452" y="414" width="698" height="12" fill="${R1.gold}"/>
      ${T("A NEW DAY FOR EVANSVILLE", { x: 452, y: 474, font: "Montserrat", weight: 700, size: 30, fill: R1.blue, ls: 6, fit: 698 })}
      <rect y="600" width="1200" height="300" fill="${R1.navy}"/>
      <rect y="600" width="1200" height="12" fill="${R1.gold}"/>
      ${T("CITY COUNCIL · WARD 3", { x: 600, y: 752, font: "Montserrat", weight: 800, size: 80, fill: R1.white, ls: 6, anchor: "middle", fit: 1060 })}
      ${T("DEMOCRAT", { x: 600, y: 828, font: "Montserrat", weight: 800, size: 40, fill: R1.gold, ls: 18, anchor: "middle", fit: 300 })}`.replace('y="828"', 'y="834"');
    return svgWrap(1200, 900, R1.white, b, "v1a-sign");
  },
  banner() {
    const b = `
      <g transform="translate(40 40) scale(1.05)">${emblemRiverRise("v1ab")}</g>
      ${T("GLEN", { x: 492, y: 138, font: "Montserrat", weight: 800, size: 60, fill: R1.blue, ls: 26, fit: 330 })}
      ${T("MILLER", { x: 486, y: 300, font: "Montserrat", weight: 900, size: 200, fill: R1.navy, fit: 610 })}
      <rect x="492" y="330" width="604" height="10" fill="${R1.gold}"/>
      ${T("A NEW DAY FOR EVANSVILLE", { x: 492, y: 392, font: "Montserrat", weight: 700, size: 26, fill: R1.blue, ls: 5, fit: 604 })}
      <rect x="1140" width="360" height="500" fill="${R1.navy}"/>
      <rect x="1140" width="10" height="500" fill="${R1.gold}"/>
      ${T("CITY COUNCIL", { x: 1325, y: 190, font: "Montserrat", weight: 800, size: 40, fill: R1.white, ls: 4, anchor: "middle", fit: 280 })}
      ${T("WARD 3", { x: 1325, y: 318, font: "Montserrat", weight: 900, size: 100, fill: R1.gold, anchor: "middle", fit: 280 })}
      ${T("DEMOCRAT", { x: 1325, y: 380, font: "Montserrat", weight: 700, size: 26, fill: R1.ice, ls: 10, anchor: "middle", fit: 200 })}`;
    return svgWrap(1500, 500, R1.white, b, "v1a-banner");
  },
};

/* 1B · Sunrise Field: the whole sign becomes the emblem's scene. */
const v1b = {
  id: "1b", group: 1, title: "1B · Full Sunrise",
  note: "The emblem becomes the whole sign. The sun rises over the Ohio behind the name, with soft rays filling the sky and gold light shimmering on the water. There's no empty space anywhere, and from a distance it reads as a sunrise even before you read the name.",
  sign() {
    const H = 630;
    const b = `
      ${tonalRays(600, H, 22, 1100, R1.tonal, "v1bs-c", `width="1200" height="${H}"`)}
      <defs><clipPath id="v1bs-sun"><rect width="1200" height="${H}"/></clipPath></defs>
      <circle cx="600" cy="${H}" r="132" fill="${R1.gold}" clip-path="url(#v1bs-sun)"/>
      ${T("GLEN", { x: 600, y: 170, font: "Montserrat", weight: 800, size: 80, fill: R1.gold, ls: 40, anchor: "middle", fit: 440 })}
      ${T("MILLER", { x: 600, y: 410, font: "Montserrat", weight: 900, size: 230, fill: R1.white, anchor: "middle", fit: 1060 })}
      <rect y="${H}" width="1200" height="${900 - H}" fill="${R1.blue}"/>
      <path d="M0 ${H + 70} Q 300 ${H + 52} 600 ${H + 66} T 1200 ${H + 60} L1200 ${H + 74} Q 900 ${H + 80} 600 ${H + 78} T 0 ${H + 84} Z" fill="${R1.blueHi}"/>
      <path d="M0 ${H + 128} Q 300 ${H + 108} 600 ${H + 122} T 1200 ${H + 114} L1200 ${H + 132} Q 900 ${H + 140} 600 ${H + 138} T 0 ${H + 146} Z" fill="${R1.blueHi}" opacity=".7"/>
      ${glitter(600, H + 14, 250, 4, 13)}
      <rect y="${H}" width="1200" height="4" fill="${R1.gold}"/>
      ${T("CITY COUNCIL · WARD 3", { x: 600, y: 812, font: "Montserrat", weight: 800, size: 70, fill: R1.white, ls: 6, anchor: "middle", fit: 980 })}
      ${T("DEMOCRAT  ·  A NEW DAY FOR EVANSVILLE", { x: 600, y: 866, font: "Montserrat", weight: 700, size: 30, fill: R1.gold, ls: 6, anchor: "middle", fit: 720 })}`;
    return svgWrap(1200, 900, R1.navy, b, "v1b-sign");
  },
  banner() {
    const H = 372;
    const b = `
      ${tonalRays(250, H, 30, 1400, R1.tonal, "v1bb-c", `width="1500" height="${H}"`)}
      <defs><clipPath id="v1bb-sun"><rect width="1500" height="${H}"/></clipPath></defs>
      <circle cx="250" cy="${H}" r="118" fill="${R1.gold}" clip-path="url(#v1bb-sun)"/>
      ${T("GLEN", { x: 496, y: 116, font: "Montserrat", weight: 800, size: 60, fill: R1.gold, ls: 30, fit: 360 })}
      ${T("MILLER", { x: 490, y: 318, font: "Montserrat", weight: 900, size: 200, fill: R1.white, fit: 950 })}
      <rect y="${H}" width="1500" height="${500 - H}" fill="${R1.blue}"/>
      <path d="M0 ${H + 58} Q 375 ${H + 44} 750 ${H + 56} T 1500 ${H + 50} L1500 ${H + 62} Q 1125 ${H + 68} 750 ${H + 66} T 0 ${H + 70} Z" fill="${R1.blueHi}"/>
      ${glitter(250, H + 12, 220, 4, 12)}
      <rect y="${H}" width="1500" height="4" fill="${R1.gold}"/>
      ${T("CITY COUNCIL · WARD 3", { x: 496, y: 452, font: "Montserrat", weight: 800, size: 44, fill: R1.white, ls: 6, fit: 600 })}
      ${T("DEMOCRAT", { x: 1446, y: 452, font: "Montserrat", weight: 800, size: 30, fill: R1.gold, ls: 12, anchor: "end", fit: 240 })}`;
    return svgWrap(1500, 500, R1.navy, b, "v1b-banner");
  },
};

/* 1C · Medallion: full-width name, emblem set on the seam as a seal. */
const v1c = {
  id: "1c", group: 1, title: "1C · The Seal",
  note: "GLEN and MILLER both stretch the full width of the sign, so it reads from the farthest distance of the three. The emblem moves onto the line between the white and navy halves like an official seal, tying the name to the office.",
  sign() {
    const seam = 590;
    const b = `
      ${tl("GLEN", { x: 600, y: 178, size: 104, fill: R1.blue, len: 480, anchor: "middle" })}
      <rect x="72" y="134" width="250" height="6" fill="${R1.gold}"/><rect x="878" y="134" width="250" height="6" fill="${R1.gold}"/>
      ${T("MILLER", { x: 600, y: 420, font: "Montserrat", weight: 900, size: 250, fill: R1.navy, anchor: "middle", fit: 1060 })}
      <rect y="${seam}" width="1200" height="${900 - seam}" fill="${R1.navy}"/>
      <rect y="${seam - 6}" width="1200" height="12" fill="${R1.gold}"/>
      <circle cx="600" cy="${seam}" r="122" fill="${R1.white}"/>
      <g transform="translate(${600 - 110} ${seam - 110}) scale(.55)">${emblemRiverRise("v1cs")}</g>
      ${T("CITY COUNCIL · WARD 3", { x: 600, y: 800, font: "Montserrat", weight: 800, size: 70, fill: R1.white, ls: 6, anchor: "middle", fit: 980 })}
      ${T("DEMOCRAT  ·  A NEW DAY FOR EVANSVILLE", { x: 600, y: 858, font: "Montserrat", weight: 700, size: 30, fill: R1.gold, ls: 6, anchor: "middle", fit: 720 })}`;
    return svgWrap(1200, 900, R1.white, b, "v1c-sign");
  },
  banner() {
    const seam = 356;
    const b = `
      ${tl("GLEN", { x: 424, y: 110, size: 76, fill: R1.blue, len: 470 })}<rect x="920" y="76" width="514" height="6" fill="${R1.gold}"/>
      ${T("MILLER", { x: 414, y: 312, font: "Montserrat", weight: 900, size: 200, fill: R1.navy, fit: 1020 })}
      <rect y="${seam}" width="1500" height="${500 - seam}" fill="${R1.navy}"/>
      <rect y="${seam - 5}" width="1500" height="10" fill="${R1.gold}"/>
      <circle cx="210" cy="${seam - 106}" r="176" fill="${R1.white}"/>
      <g transform="translate(${210 - 164} ${seam - 106 - 164}) scale(.82)">${emblemRiverRise("v1cb")}</g>
      ${T("CITY COUNCIL · WARD 3", { x: 420, y: 446, font: "Montserrat", weight: 800, size: 44, fill: R1.white, ls: 6, fit: 640 })}
      ${T("DEMOCRAT", { x: 1430, y: 446, font: "Montserrat", weight: 800, size: 30, fill: R1.gold, ls: 12, anchor: "end", fit: 240 })}`;
    return svgWrap(1500, 500, R1.white, b, "v1c-banner");
  },
};

/* ============================ #2 FLAG TORCH ============================ */
const R2 = { bg: "#0A2A6E", tonal: "#0E3483", deep: "#071D4E", gold: "#E9B02A", goldHi: "#F6C94A", white: "#FFFFFF", pale: "#B9CAE8", navy: "#0A2A6E", flame: "#F08A1C", paper: "#FFFFFF" };

function flagTorch2(torch, flame, rays) {
  const t = ["rim", "cup", "collar", "handle"].map(k => `<path d="${FLAG[k]}"/>`).join("");
  const f = ["flameL", "flameC", "flameR"].map(k => `<path d="${FLAG[k]}"/>`).join("");
  const r = `<g transform="translate(0 -12)" fill="${rays}"><path d="${FLAG.rays}"/><path d="${FLAG.rays}" transform="translate(601.9 0) scale(-1 1)"/><path d="${FLAG.dash}"/><path d="${FLAG.star}"/></g>`;
  return `${r}<g fill="${torch}">${t}</g><g fill="${flame}">${f}</g>`;
}
function ftMark(o) { return `<g class="ftmark2" data-o='${JSON.stringify(o)}'></g>`; }
function layoutFT2(g) {
  const o = JSON.parse(g.dataset.o);
  const font = "700 100px Oswald";
  const m = measure(font, "M"), l = measure(font, "LLER");
  const capH = m.ascent, k100 = capH / (365 - 180.93);
  const torchW = (329.25 - 272.64) * k100, gap = 6;
  const total = m.adv + gap + torchW + gap + l.inkRight;
  const s = o.width / total, size = 100 * s, k = k100 * s;
  const x0 = o.cx - o.width / 2;
  const tx = x0 + (m.adv + gap + torchW / 2) * s, lx = x0 + (m.adv + gap * 2 + torchW) * s;
  const Y = (fy) => o.base + (fy - 365) * k; // flag y -> px
  let extra = "";
  if (o.burst) {
    // Tonal light burst radiating from the flame across the whole sky.
    const cy = Y(150), n = 28;
    let rays = "";
    for (let i = 0; i < n; i++) {
      const a = (2 * Math.PI / n) * i, w = Math.PI / n * 0.33, R = 2400;
      rays += `<path d="M${P(tx)} ${P(cy)} L${P(tx + R * Math.cos(a - w))} ${P(cy + R * Math.sin(a - w))} L${P(tx + R * Math.cos(a + w))} ${P(cy + R * Math.sin(a + w))} Z"/>`;
    }
    extra += `<g fill="${o.burst}">${rays}</g>`;
  }
  if (o.arc) {
    // GLEN arcs over the Indiana star, exactly where the flag says INDIANA.
    const id = "arc" + Math.random().toString(36).slice(2, 8);
    const R = 104 * k, cx = tx, cy = Y(150 - 12);
    const fs = 38 * k;
    extra += `<defs><path id="${id}" d="M ${P(cx - R)} ${P(cy)} A ${P(R)} ${P(R)} 0 0 1 ${P(cx + R)} ${P(cy)}"/></defs>
      <text font-family="Oswald" font-weight="700" font-size="${P(fs)}" letter-spacing="${P(fs * 0.22)}" fill="${o.arc}"><textPath href="#${id}" startOffset="50%" text-anchor="middle">GLEN</textPath></text>`;
  }
  g.innerHTML = `${extra}
    <text x="${P(x0)}" y="${o.base}" font-family="Oswald" font-weight="700" font-size="${P(size)}" fill="${o.letter}">M</text>
    <g transform="translate(${P(tx)} ${o.base}) scale(${P(k)}) translate(-300.95 -365)">${flagTorch2(o.torch, o.flame || o.torch, o.rays)}</g>
    <text x="${P(lx)}" y="${o.base}" font-family="Oswald" font-weight="700" font-size="${P(size)}" fill="${o.letter}">LLER</text>`;
}
const glow2 = (id, cx, cy, r) => glow(id, cx, cy, r);

/* 2A · MILLER, no first name, with a light burst behind it. */
const v2a = {
  id: "2a", group: 2, title: "2A · Just MILLER",
  note: "GLEN is gone. MILLER gets bigger and is centered, and a faint burst of light spreads from the torch across the whole sign, so the empty corner where GLEN sat becomes atmosphere. It's the simplest and strongest version.",
  sign() {
    const b = `
      <defs><clipPath id="v2as-c"><rect width="1200" height="672"/></clipPath></defs>
      <g clip-path="url(#v2as-c)">${ftMark({ cx: 600, base: 572, width: 1060, letter: R2.white, torch: R2.gold, rays: R2.gold, burst: R2.tonal })}</g>
      ${starRow(600, 622, 18, 8.5, 58, R2.gold)}
      <rect y="672" width="1200" height="228" fill="${R2.deep}"/>
      <rect y="672" width="1200" height="8" fill="${R2.gold}"/>
      ${T("CITY COUNCIL · WARD 3", { x: 600, y: 800, font: "Oswald", weight: 700, size: 100, fill: R2.white, ls: 8, anchor: "middle", fit: 950 })}
      ${T("DEMOCRAT  ·  LIGHTING THE WAY FORWARD", { x: 600, y: 860, font: "Oswald", weight: 500, size: 38, fill: R2.gold, ls: 8, anchor: "middle", fit: 740 })}`;
    return svgWrap(1200, 900, R2.bg, b, "v2a-sign");
  },
  banner() {
    const b = `
      <defs><clipPath id="v2ab-c"><rect width="1500" height="500"/></clipPath></defs>
      <g clip-path="url(#v2ab-c)">${ftMark({ cx: 520, base: 398, width: 860, letter: R2.white, torch: R2.gold, rays: R2.gold, burst: R2.tonal })}</g>
      ${starRow(520, 448, 18, 7.5, 49, R2.gold)}
      <rect x="1030" y="70" width="3" height="360" fill="${R2.gold}"/>
      ${T("CITY COUNCIL", { x: 1078, y: 170, font: "Oswald", weight: 600, size: 58, fill: R2.white, ls: 6, fit: 370 })}
      ${T("WARD 3", { x: 1073, y: 338, font: "Oswald", weight: 700, size: 160, fill: R2.gold, ls: 4, fit: 376 })}
      ${T("DEMOCRAT", { x: 1079, y: 410, font: "Oswald", weight: 500, size: 34, fill: R2.pale, ls: 14, fit: 370 })}`;
    return svgWrap(1500, 500, R2.bg, b, "v2a-banner");
  },
};

/* 2B · GLEN arcs over the star, where the flag says INDIANA. */
const v2b = {
  id: "2b", group: 2, title: "2B · Flag Arc",
  note: "On Indiana's flag the word INDIANA arcs over the star. Here GLEN takes that spot. The first name stays, but it's part of the torch emblem instead of sitting off to the side, and anyone who knows the flag will catch the reference.",
  sign() {
    const b = `
      ${glow("v2bs-g", 360, 300, 520)}
      <rect width="1200" height="672" fill="url(#v2bs-g)"/>
      ${ftMark({ cx: 600, base: 590, width: 940, letter: R2.white, torch: R2.gold, rays: R2.gold, arc: R2.goldHi })}
      ${starRow(600, 630, 18, 8.5, 56, R2.gold)}
      <rect y="672" width="1200" height="228" fill="${R2.deep}"/>
      <rect y="672" width="1200" height="8" fill="${R2.gold}"/>
      ${T("CITY COUNCIL · WARD 3", { x: 600, y: 800, font: "Oswald", weight: 700, size: 100, fill: R2.white, ls: 8, anchor: "middle", fit: 950 })}
      ${T("DEMOCRAT  ·  LIGHTING THE WAY FORWARD", { x: 600, y: 860, font: "Oswald", weight: 500, size: 38, fill: R2.gold, ls: 8, anchor: "middle", fit: 740 })}`;
    return svgWrap(1200, 900, R2.bg, b, "v2b-sign");
  },
  banner() {
    const b = `
      ${glow("v2bb-g", 330, 200, 440)}
      <rect width="1500" height="500" fill="url(#v2bb-g)"/>
      ${ftMark({ cx: 500, base: 414, width: 700, letter: R2.white, torch: R2.gold, rays: R2.gold, arc: R2.goldHi })}
      ${starRow(500, 455, 16, 7, 45, R2.gold)}
      <rect x="1010" y="70" width="3" height="360" fill="${R2.gold}"/>
      ${T("CITY COUNCIL", { x: 1060, y: 170, font: "Oswald", weight: 600, size: 58, fill: R2.white, ls: 6, fit: 380 })}
      ${T("WARD 3", { x: 1055, y: 338, font: "Oswald", weight: 700, size: 160, fill: R2.gold, ls: 4, fit: 386 })}
      ${T("DEMOCRAT", { x: 1061, y: 410, font: "Oswald", weight: 500, size: 34, fill: R2.pale, ls: 14, fit: 380 })}`;
    return svgWrap(1500, 500, R2.bg, b, "v2b-banner");
  },
};

/* 2C · Daylight: white sign, navy letters, full name moved into the band. */
const v2c = {
  id: "2c", group: 2, title: "2C · Daylight",
  note: "This flips to a white sign with navy letters and a navy torch with a gold flame and gold rays. It pops on a green lawn and costs less to print. The full name moves into the bottom band, where it reads as a signature: GLEN MILLER · DEMOCRAT.",
  sign() {
    const b = `
      ${ftMark({ cx: 600, base: 566, width: 1060, letter: R2.navy, torch: R2.navy, flame: R2.gold, rays: R2.gold })}
      ${starRow(600, 618, 18, 8.5, 58, R2.navy)}
      <rect y="664" width="1200" height="236" fill="${R2.navy}"/>
      <rect y="664" width="1200" height="10" fill="${R2.gold}"/>
      ${T("CITY COUNCIL · WARD 3", { x: 600, y: 794, font: "Oswald", weight: 700, size: 100, fill: R2.white, ls: 8, anchor: "middle", fit: 950 })}
      ${T("GLEN MILLER  ·  DEMOCRAT", { x: 600, y: 858, font: "Oswald", weight: 600, size: 40, fill: R2.gold, ls: 12, anchor: "middle", fit: 600 })}`;
    return svgWrap(1200, 900, R2.paper, b, "v2c-sign");
  },
  banner() {
    const b = `
      ${ftMark({ cx: 500, base: 398, width: 860, letter: R2.navy, torch: R2.navy, flame: R2.gold, rays: R2.gold })}
      ${starRow(500, 448, 18, 7.5, 49, R2.navy)}
      <rect x="1010" width="490" height="500" fill="${R2.navy}"/>
      <rect x="1010" width="10" height="500" fill="${R2.gold}"/>
      ${T("CITY COUNCIL", { x: 1262, y: 168, font: "Oswald", weight: 600, size: 58, fill: R2.white, ls: 6, anchor: "middle", fit: 380 })}
      ${T("WARD 3", { x: 1262, y: 330, font: "Oswald", weight: 700, size: 160, fill: R2.gold, ls: 4, anchor: "middle", fit: 380 })}
      ${T("GLEN MILLER · DEMOCRAT", { x: 1262, y: 404, font: "Oswald", weight: 500, size: 30, fill: R2.pale, ls: 8, anchor: "middle", fit: 380 })}`;
    return svgWrap(1500, 500, R2.paper, b, "v2c-banner");
  },
};

const VARIANTS = [v1a, v1b, v1c, v2a, v2b, v2c];
function layoutVariants(root) {
  root.querySelectorAll("g.ftmark2").forEach(layoutFT2);
  MILLER.layoutAll(root);
}
window.ROUND2 = { VARIANTS, layoutVariants };
