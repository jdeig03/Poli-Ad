/* Round 3: the six round-2 variations, each folding in the Evansville city flag.
   Flag reference: sky #58B2E7 over gold #D59F0F over navy #000F5D, with a gold-ringed
   navy seal holding ten stars and the four columns of the Four Freedoms Monument
   standing on three light-blue water lines. Depends on logos.js + variants.js. */

const EV = { sky: "#58B2E7", gold: "#D59F0F", navy: "#000F5D", white: "#FFFFFF" };

// Four Freedoms Monument: four columns, the inner two taller, as on the city flag.
function fourColumns(cx, baseY, h, fill) {
  const w = h * 0.155, step = h * 0.31;
  const col = (x, ht) => `
    <rect x="${P(x - w * 0.8)}" y="${P(baseY - w * 0.32)}" width="${P(w * 1.6)}" height="${P(w * 0.32)}"/>
    <rect x="${P(x - w / 2)}" y="${P(baseY - ht)}" width="${P(w)}" height="${P(ht - w * 0.3)}"/>
    <rect x="${P(x - w * 0.82)}" y="${P(baseY - ht - w * 0.34)}" width="${P(w * 1.64)}" height="${P(w * 0.38)}" rx="${P(w * 0.08)}"/>`;
  return `<g fill="${fill}">${col(cx - step * 1.5, h * 0.84)}${col(cx - step * 0.5, h)}${col(cx + step * 0.5, h)}${col(cx + step * 1.5, h * 0.84)}</g>`;
}
// The flag's three water lines: stacked bands, each a little shorter.
function waterLines(cx, y, w, t, gap, fill) {
  return [0, 1, 2].map(i => { const ww = w * (1 - i * 0.12); return `<rect x="${P(cx - ww / 2)}" y="${P(y + i * (t + gap))}" width="${P(ww)}" height="${t}" rx="${t / 2}" fill="${fill}"/>`; }).join("");
}
// Seal frame in the city flag's style: gold ring, navy band, ten white stars.
function citySeal(cx, cy, r, inner) {
  let stars = "";
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (2 * Math.PI / 10) * i;
    stars += star(cx + r * 0.83 * Math.cos(a), cy + r * 0.83 * Math.sin(a), r * 0.075, EV.white);
  }
  return `<circle cx="${cx}" cy="${cy}" r="${P(r + r * 0.06)}" fill="${EV.white}"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${EV.gold}"/>
    <circle cx="${cx}" cy="${cy}" r="${P(r * 0.94)}" fill="${EV.navy}"/>${stars}${inner}`;
}
// Tricolor stripe in the flag's order (sky over gold), sitting on a navy band.
const tricolor = (x, y, w, t) => `<rect x="${x}" y="${y}" width="${w}" height="${t}" fill="${EV.sky}"/><rect x="${x}" y="${y + t}" width="${w}" height="${t}" fill="${EV.gold}"/>`;

/* ---------------- #1 RIVER RISE ---------------- */
const w1a = {
  id: "1a", group: 1, title: "1A · Side-by-Side + City Stripes",
  flag: "Subtle. The office band gets the city flag's three colors in order: sky blue, then gold, then the navy band. DEMOCRAT switches to the flag's sky blue. Someone who knows the flag recognizes the stripes; anyone else just sees a clean sign.",
  sign() {
    const b = `
      <g transform="translate(56 92) scale(.9)">${emblemRiverRise("w1as")}</g>
      ${T("GLEN", { x: 452, y: 196, font: "Montserrat", weight: 800, size: 80, fill: R1.blue, ls: 34, fit: 420 })}
      ${T("MILLER", { x: 446, y: 382, font: "Montserrat", weight: 900, size: 200, fill: R1.navy, fit: 704 })}
      <rect x="452" y="414" width="698" height="12" fill="${R1.gold}"/>
      ${T("A NEW DAY FOR EVANSVILLE", { x: 452, y: 474, font: "Montserrat", weight: 700, size: 30, fill: R1.blue, ls: 6, fit: 698 })}
      ${tricolor(0, 584, 1200, 16)}
      <rect y="616" width="1200" height="284" fill="${R1.navy}"/>
      ${T("CITY COUNCIL · WARD 3", { x: 600, y: 760, font: "Montserrat", weight: 800, size: 80, fill: R1.white, ls: 6, anchor: "middle", fit: 1060 })}
      ${T("DEMOCRAT", { x: 600, y: 838, font: "Montserrat", weight: 800, size: 40, fill: EV.sky, ls: 18, anchor: "middle", fit: 300 })}`;
    return svgWrap(1200, 900, R1.white, b, "w1a-sign");
  },
  banner() {
    const b = `
      <g transform="translate(40 40) scale(1.05)">${emblemRiverRise("w1ab")}</g>
      ${T("GLEN", { x: 492, y: 138, font: "Montserrat", weight: 800, size: 60, fill: R1.blue, ls: 26, fit: 330 })}
      ${T("MILLER", { x: 486, y: 300, font: "Montserrat", weight: 900, size: 200, fill: R1.navy, fit: 610 })}
      <rect x="492" y="330" width="604" height="10" fill="${R1.gold}"/>
      ${T("A NEW DAY FOR EVANSVILLE", { x: 492, y: 392, font: "Montserrat", weight: 700, size: 26, fill: R1.blue, ls: 5, fit: 604 })}
      <rect x="1130" width="14" height="500" fill="${EV.sky}"/><rect x="1144" width="14" height="500" fill="${EV.gold}"/>
      <rect x="1158" width="342" height="500" fill="${R1.navy}"/>
      ${T("CITY COUNCIL", { x: 1329, y: 190, font: "Montserrat", weight: 800, size: 40, fill: R1.white, ls: 4, anchor: "middle", fit: 270 })}
      ${T("WARD 3", { x: 1329, y: 318, font: "Montserrat", weight: 900, size: 100, fill: R1.gold, anchor: "middle", fit: 270 })}
      ${T("DEMOCRAT", { x: 1329, y: 380, font: "Montserrat", weight: 700, size: 26, fill: EV.sky, ls: 10, anchor: "middle", fit: 190 })}`;
    return svgWrap(1500, 500, R1.white, b, "w1a-banner");
  },
};

const w1b = {
  id: "1b", group: 1, title: "1B · Full Sunrise + Four Freedoms",
  flag: "Prominent, and it shows a real view. The four columns of the Four Freedoms Monument, the centerpiece of the city flag, stand on the riverfront in silhouette against the rising sun. That's what the riverfront actually looks like at dawn. The river's highlights switch to the flag's sky blue.",
  sign() {
    const H = 630;
    const b = `
      ${tonalRays(600, H, 22, 1100, R1.tonal, "w1bs-c", `width="1200" height="${H}"`)}
      <defs><clipPath id="w1bs-sun"><rect width="1200" height="${H}"/></clipPath></defs>
      <circle cx="600" cy="${H}" r="150" fill="${R1.gold}" clip-path="url(#w1bs-sun)"/>
      ${fourColumns(600, H, 118, R1.navy)}
      ${T("GLEN", { x: 600, y: 160, font: "Montserrat", weight: 800, size: 80, fill: R1.gold, ls: 40, anchor: "middle", fit: 440 })}
      ${T("MILLER", { x: 600, y: 392, font: "Montserrat", weight: 900, size: 230, fill: R1.white, anchor: "middle", fit: 1060 })}
      <rect y="${H}" width="1200" height="${900 - H}" fill="${R1.blue}"/>
      <path d="M0 ${H + 70} Q 300 ${H + 52} 600 ${H + 66} T 1200 ${H + 60} L1200 ${H + 74} Q 900 ${H + 80} 600 ${H + 78} T 0 ${H + 84} Z" fill="${EV.sky}" opacity=".55"/>
      <path d="M0 ${H + 128} Q 300 ${H + 108} 600 ${H + 122} T 1200 ${H + 114} L1200 ${H + 132} Q 900 ${H + 140} 600 ${H + 138} T 0 ${H + 146} Z" fill="${EV.sky}" opacity=".35"/>
      ${glitter(600, H + 14, 280, 4, 13)}
      <rect y="${H}" width="1200" height="4" fill="${R1.gold}"/>
      ${T("CITY COUNCIL · WARD 3", { x: 600, y: 812, font: "Montserrat", weight: 800, size: 70, fill: R1.white, ls: 6, anchor: "middle", fit: 980 })}
      ${T("DEMOCRAT  ·  A NEW DAY FOR EVANSVILLE", { x: 600, y: 866, font: "Montserrat", weight: 700, size: 30, fill: R1.gold, ls: 6, anchor: "middle", fit: 720 })}`;
    return svgWrap(1200, 900, R1.navy, b, "w1b-sign");
  },
  banner() {
    const H = 372;
    const b = `
      ${tonalRays(250, H, 30, 1400, R1.tonal, "w1bb-c", `width="1500" height="${H}"`)}
      <defs><clipPath id="w1bb-sun"><rect width="1500" height="${H}"/></clipPath></defs>
      <circle cx="250" cy="${H}" r="132" fill="${R1.gold}" clip-path="url(#w1bb-sun)"/>
      ${fourColumns(250, H, 104, R1.navy)}
      ${T("GLEN", { x: 496, y: 116, font: "Montserrat", weight: 800, size: 60, fill: R1.gold, ls: 30, fit: 360 })}
      ${T("MILLER", { x: 490, y: 318, font: "Montserrat", weight: 900, size: 200, fill: R1.white, fit: 950 })}
      <rect y="${H}" width="1500" height="${500 - H}" fill="${R1.blue}"/>
      <path d="M0 ${H + 58} Q 375 ${H + 44} 750 ${H + 56} T 1500 ${H + 50} L1500 ${H + 62} Q 1125 ${H + 68} 750 ${H + 66} T 0 ${H + 70} Z" fill="${EV.sky}" opacity=".5"/>
      ${glitter(250, H + 12, 240, 4, 12)}
      <rect y="${H}" width="1500" height="4" fill="${R1.gold}"/>
      ${T("CITY COUNCIL · WARD 3", { x: 496, y: 452, font: "Montserrat", weight: 800, size: 44, fill: R1.white, ls: 6, fit: 600 })}
      ${T("DEMOCRAT", { x: 1446, y: 452, font: "Montserrat", weight: 800, size: 30, fill: R1.gold, ls: 12, anchor: "end", fit: 240 })}`;
    return svgWrap(1500, 500, R1.navy, b, "w1b-banner");
  },
};

const w1c = {
  id: "1c", group: 1, title: "1C · The Seal, City Style",
  flag: "Prominent but natural. 1C was already a seal straddling two bands, and that's exactly how the city flag is built. The medallion now borrows the flag seal's frame: a gold outer ring, a navy band and ten white stars around the sunrise. Inside it's still his emblem, not the city's, so it echoes the flag without copying the official seal.",
  sign() {
    const seam = 604, r = 152;
    const b = `
      ${tl("GLEN", { x: 600, y: 170, size: 104, fill: R1.blue, len: 480, anchor: "middle" })}
      <rect x="72" y="126" width="250" height="6" fill="${R1.gold}"/><rect x="878" y="126" width="250" height="6" fill="${R1.gold}"/>
      ${T("MILLER", { x: 600, y: 404, font: "Montserrat", weight: 900, size: 250, fill: R1.navy, anchor: "middle", fit: 1060 })}
      <rect y="${seam}" width="1200" height="${900 - seam}" fill="${R1.navy}"/>
      <rect y="${seam - 6}" width="1200" height="12" fill="${EV.gold}"/>
      ${citySeal(600, seam, r, `<circle cx="600" cy="${seam}" r="${r * 0.66}" fill="${EV.white}"/><g transform="translate(${600 - r * 0.62} ${seam - r * 0.62}) scale(${P(r * 0.62 / 200)})">${emblemRiverRise("w1cs")}</g>`)}
      ${T("CITY COUNCIL · WARD 3", { x: 600, y: 822, font: "Montserrat", weight: 800, size: 70, fill: R1.white, ls: 6, anchor: "middle", fit: 980 })}
      ${T("DEMOCRAT  ·  A NEW DAY FOR EVANSVILLE", { x: 600, y: 872, font: "Montserrat", weight: 700, size: 30, fill: EV.sky, ls: 6, anchor: "middle", fit: 720 })}`;
    return svgWrap(1200, 900, R1.white, b, "w1c-sign");
  },
  banner() {
    const seam = 356, r = 172, cy = seam - 100;
    const b = `
      ${tl("GLEN", { x: 424, y: 110, size: 76, fill: R1.blue, len: 470 })}<rect x="920" y="76" width="514" height="6" fill="${R1.gold}"/>
      ${T("MILLER", { x: 414, y: 312, font: "Montserrat", weight: 900, size: 200, fill: R1.navy, fit: 1020 })}
      <rect y="${seam}" width="1500" height="${500 - seam}" fill="${R1.navy}"/>
      <rect y="${seam - 5}" width="1500" height="10" fill="${EV.gold}"/>
      ${citySeal(206, cy, r, `<circle cx="206" cy="${cy}" r="${r * 0.66}" fill="${EV.white}"/><g transform="translate(${206 - r * 0.62} ${cy - r * 0.62}) scale(${P(r * 0.62 / 200)})">${emblemRiverRise("w1cb")}</g>`)}
      ${T("CITY COUNCIL · WARD 3", { x: 424, y: 446, font: "Montserrat", weight: 800, size: 44, fill: R1.white, ls: 6, fit: 640 })}
      ${T("DEMOCRAT", { x: 1430, y: 446, font: "Montserrat", weight: 800, size: 30, fill: EV.sky, ls: 12, anchor: "end", fit: 240 })}`;
    return svgWrap(1500, 500, R1.white, b, "w1c-banner");
  },
};

/* ---------------- #2 FLAG TORCH ---------------- */
const w2a = {
  id: "2a", group: 2, title: "2A · Just MILLER + City Stripes",
  flag: "Subtle. This series already uses the city flag's exact navy and gold, because Evansville's flag borrows them from Indiana's. Adding the city's sky blue completes the set: a sky-and-gold stripe tops the office band, and the light burst picks up a faint sky tint. The Indiana torch now sits on Evansville's colors.",
  sign() {
    const b = `
      <rect width="1200" height="660" fill="${EV.navy}"/>
      <defs><clipPath id="w2as-c"><rect width="1200" height="660"/></clipPath></defs>
      <g clip-path="url(#w2as-c)">${ftMark({ cx: 600, base: 566, width: 1060, letter: EV.white, torch: EV.gold, rays: EV.gold, burst: "#0B2378" })}</g>
      ${starRow(600, 616, 18, 8.5, 58, EV.gold)}
      ${tricolor(0, 660, 1200, 12)}
      <rect y="684" width="1200" height="216" fill="${EV.navy}"/>
      ${T("CITY COUNCIL · WARD 3", { x: 600, y: 806, font: "Oswald", weight: 700, size: 100, fill: EV.white, ls: 8, anchor: "middle", fit: 950 })}
      ${T("DEMOCRAT  ·  LIGHTING THE WAY FORWARD", { x: 600, y: 864, font: "Oswald", weight: 500, size: 38, fill: EV.sky, ls: 8, anchor: "middle", fit: 740 })}`;
    return svgWrap(1200, 900, EV.navy, b, "w2a-sign");
  },
  banner() {
    const b = `
      <defs><clipPath id="w2ab-c"><rect width="1010" height="500"/></clipPath></defs>
      <g clip-path="url(#w2ab-c)">${ftMark({ cx: 505, base: 398, width: 860, letter: EV.white, torch: EV.gold, rays: EV.gold, burst: "#0B2378" })}</g>
      ${starRow(505, 448, 18, 7.5, 49, EV.gold)}
      <rect x="1010" width="12" height="500" fill="${EV.sky}"/><rect x="1022" width="12" height="500" fill="${EV.gold}"/>
      ${T("CITY COUNCIL", { x: 1076, y: 170, font: "Oswald", weight: 600, size: 58, fill: EV.white, ls: 6, fit: 370 })}
      ${T("WARD 3", { x: 1071, y: 338, font: "Oswald", weight: 700, size: 160, fill: EV.gold, ls: 4, fit: 376 })}
      ${T("DEMOCRAT", { x: 1077, y: 410, font: "Oswald", weight: 500, size: 34, fill: EV.sky, ls: 14, fit: 370 })}`;
    return svgWrap(1500, 500, EV.navy, b, "w2a-banner");
  },
};

const w2b = {
  id: "2b", group: 2, title: "2B · Flag Arc on the River",
  flag: "In between. On the city flag, the four columns stand on three light-blue water lines. Here MILLER stands on those same three lines, replacing the row of stars: Indiana's torch over the state star on top, Evansville's river underneath. The Indiana star above the flame stays.",
  sign() {
    const b = `
      <rect width="1200" height="684" fill="${EV.navy}"/>
      ${glow("w2bs-g", 360, 300, 520)}
      <rect width="1200" height="684" fill="url(#w2bs-g)"/>
      ${ftMark({ cx: 600, base: 572, width: 940, letter: EV.white, torch: EV.gold, rays: EV.gold, arc: R2.goldHi })}
      ${waterLines(600, 594, 940, 11, 9, EV.sky)}
      <rect y="684" width="1200" height="216" fill="${R2.deep}"/>
      <rect y="684" width="1200" height="8" fill="${EV.gold}"/>
      ${T("CITY COUNCIL · WARD 3", { x: 600, y: 808, font: "Oswald", weight: 700, size: 100, fill: EV.white, ls: 8, anchor: "middle", fit: 950 })}
      ${T("DEMOCRAT  ·  LIGHTING THE WAY FORWARD", { x: 600, y: 866, font: "Oswald", weight: 500, size: 38, fill: EV.gold, ls: 8, anchor: "middle", fit: 740 })}`;
    return svgWrap(1200, 900, EV.navy, b, "w2b-sign");
  },
  banner() {
    const b = `
      ${glow("w2bb-g", 330, 200, 440)}
      <rect width="1500" height="500" fill="url(#w2bb-g)"/>
      ${ftMark({ cx: 500, base: 404, width: 700, letter: EV.white, torch: EV.gold, rays: EV.gold, arc: R2.goldHi })}
      ${waterLines(500, 422, 700, 9, 7, EV.sky)}
      <rect x="1010" y="70" width="3" height="360" fill="${EV.gold}"/>
      ${T("CITY COUNCIL", { x: 1060, y: 170, font: "Oswald", weight: 600, size: 58, fill: EV.white, ls: 6, fit: 380 })}
      ${T("WARD 3", { x: 1055, y: 338, font: "Oswald", weight: 700, size: 160, fill: EV.gold, ls: 4, fit: 386 })}
      ${T("DEMOCRAT", { x: 1061, y: 410, font: "Oswald", weight: 500, size: 34, fill: EV.sky, ls: 14, fit: 380 })}`;
    return svgWrap(1500, 500, EV.navy, b, "w2b-banner");
  },
};

const w2c = {
  id: "2c", group: 2, title: "2C · City Flag Field",
  flag: "The most prominent. The whole sign is laid out as the city flag: a sky-blue top half, a gold stripe and a navy bottom band. Navy MILLER and the navy torch stand in the sky field, with white rays and a gold flame. It's the daylight version reborn in Evansville's colors, and anyone in town will recognize the flag at a glance.",
  sign() {
    const b = `
      <rect width="1200" height="610" fill="${EV.sky}"/>
      ${ftMark({ cx: 600, base: 548, width: 1060, letter: EV.navy, torch: EV.navy, flame: R2.goldHi, rays: EV.white })}
      <rect y="610" width="1200" height="56" fill="${EV.gold}"/>
      <rect y="666" width="1200" height="234" fill="${EV.navy}"/>
      ${T("CITY COUNCIL · WARD 3", { x: 600, y: 796, font: "Oswald", weight: 700, size: 100, fill: EV.white, ls: 8, anchor: "middle", fit: 950 })}
      ${T("GLEN MILLER  ·  DEMOCRAT", { x: 600, y: 860, font: "Oswald", weight: 600, size: 40, fill: EV.sky, ls: 12, anchor: "middle", fit: 600 })}`;
    return svgWrap(1200, 900, EV.sky, b, "w2c-sign");
  },
  banner() {
    const b = `
      <rect width="1500" height="356" fill="${EV.sky}"/>
      ${ftMark({ cx: 750, base: 328, width: 700, letter: EV.navy, torch: EV.navy, flame: R2.goldHi, rays: EV.white })}
      <rect y="356" width="1500" height="26" fill="${EV.gold}"/>
      <rect y="382" width="1500" height="118" fill="${EV.navy}"/>
      ${T("CITY COUNCIL · WARD 3", { x: 70, y: 464, font: "Oswald", weight: 700, size: 60, fill: EV.white, ls: 6, fit: 700 })}
      ${T("GLEN MILLER · DEMOCRAT", { x: 1430, y: 460, font: "Oswald", weight: 600, size: 40, fill: EV.sky, ls: 8, anchor: "end", fit: 520 })}`;
    return svgWrap(1500, 500, EV.sky, b, "w2c-banner");
  },
};

window.ROUND3 = { VARIANTS: [w1a, w1b, w1c, w2a, w2b, w2c] };
