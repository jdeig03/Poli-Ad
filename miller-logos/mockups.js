/* Brand-in-context mockups for the six shortlisted identities.
   Relies on logos.js (concept builders, emblems, wordmark layouts). */

let _uid = 0;
const uid = (p) => `${p}${++_uid}`;

const BRANDS = [
  {
    key: "river-rise", concept: "glen-river-rise", first: "Glen", last: "Miller", label: "River Rise",
    tagline: "A New Day for Evansville", url: "glenmiller4ward3.com", handle: "glenmillerward3",
    c: { primary: "#0D2747", deep: "#081A33", accent: "#F4AF2D", accent2: "#1C4E9A", light: "#FFFFFF", onPrimary: "#FFFFFF", onLight: "#0D2747", soft: "#EAF0F8" },
    font: { display: "Montserrat", weight: 900, upper: true, body: "Montserrat" },
    mark: (u) => emblemRiverRise(u),
  },
  {
    key: "torch", concept: "glen-torch", first: "Glen", last: "Miller", label: "The Torch",
    tagline: "Lighting the Way Forward", url: "glenmiller4ward3.com", handle: "glenmillerward3",
    c: { primary: "#0B3478", deep: "#082658", accent: "#F2B632", accent2: "#F28A1E", light: "#FFFFFF", onPrimary: "#FFFFFF", onLight: "#0B3478", soft: "#E8EEF9" },
    font: { display: "Oswald", weight: 700, upper: true, body: "Inter" },
    mark: () => `<circle cx="200" cy="200" r="198" fill="${C2.bg}"/><g transform="translate(200 345)">${torchShape(30, 160)}</g>${star(200, 67, 26, C2.gold)}`,
    wordmark: (cx, base, w) => torchWordmark(cx, base, w, uid("tw")),
  },
  {
    key: "bridge", concept: "glen-bridge", first: "Glen", last: "Miller", label: "Bridge Builder",
    tagline: "Building Bridges for Ward 3", url: "glenmiller4ward3.com", handle: "glenmillerward3",
    c: { primary: "#102A43", deep: "#0A1D30", accent: "#4CB5E0", accent2: "#2D7FB8", light: "#FFFFFF", onPrimary: "#FFFFFF", onLight: "#102A43", soft: "#E6F2F9" },
    font: { display: "Barlow Semi Condensed", weight: 800, upper: true, body: "Inter" },
    mark: () => `<circle cx="200" cy="200" r="198" fill="${C3.bg}"/><g transform="translate(46 40) scale(0.78)">${emblemBridgeM()}</g>`,
  },
  {
    key: "sunset-o", concept: "scott-sunset-o", first: "Scott", last: "Miller", label: "Sunset on the Ohio",
    tagline: "A Brighter Evansville", url: "scottmiller4ward3.com", handle: "scottmillerward3",
    c: { primary: "#0F1C3A", deep: "#0A1429", accent: "#E2572F", accent2: "#FFC145", light: "#FFFFFF", onPrimary: "#FFFFFF", onLight: "#0F1C3A", soft: "#FDEEE6" },
    font: { display: "Poppins", weight: 800, upper: true, body: "Poppins" },
    mark: (u) => sunRoundel(u, C4),
    wordmark: (cx, base, w, bg) => sunOWordmark({ text: "SCOTT", x: cx, y: base, width: w, fill: "#FFFFFF", bg: bg || C4.bg, uid: uid("so"), ls: 2, anchor: "middle" }),
  },
  {
    key: "flag-torch", concept: "glen-flag-torch", first: "Glen", last: "Miller", label: "The Flag Torch",
    tagline: "Lighting the Way Forward", url: "glenmiller4ward3.com", handle: "glenmillerward3",
    c: { primary: "#0A2A6E", deep: "#071D4E", accent: "#E9B02A", accent2: "#F6C94A", light: "#FFFFFF", onPrimary: "#FFFFFF", onLight: "#0A2A6E", soft: "#E7EDF8" },
    font: { display: "Oswald", weight: 700, upper: true, body: "Inter" },
    mark: () => `<circle cx="200" cy="200" r="198" fill="${C2B.bg}"/><g transform="translate(200 206) scale(0.98) translate(-300.95 -215)">${flagTorch(C2B.gold, true)}</g>`,
    wordmark: (cx, base, w) => flagTorchWordmark(cx, base, w),
  },
  {
    key: "tulip", concept: "scott-tulip-tree", first: "Scott", last: "Miller", label: "Tulip Tree",
    tagline: "Rooted in Ward 3. Growing Evansville.", url: "scottmiller4ward3.com", handle: "scottmillerward3",
    c: { primary: "#1F4D3A", deep: "#163A2B", accent: "#EE7B22", accent2: "#E9E3A8", light: "#F6F4EC", onPrimary: "#F6F4EC", onLight: "#173A2C", soft: "#EEF3EC" },
    font: { display: "Fraunces", weight: 800, upper: false, body: "Inter" },
    mark: (u) => emblemTulip(u),
  },
];

const conceptById = (id) => MILLER.CONCEPTS.find(c => c.id === id);
const nm = (b, s) => (b.font.upper ? s.toUpperCase() : s);
const svgBox = (w, h, body, id, bg) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" data-id="${id}">${bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : ""}${body}</svg>`;
const markSvg = (b, cls = "") => `<svg class="${cls}" viewBox="0 0 400 400" aria-hidden="true">${b.mark(uid("m"))}</svg>`;

/* ---------- name block used on narrow formats (pole banner, door hanger, pin) ---------- */
function nameBlock(b, cx, y, w, onColor, bg) {
  // Returns SVG for first + last name, top of block at y; occupies ~0.62*w vertically.
  if (b.key === "torch" || b.key === "flag-torch") {
    return b.wordmark(cx, y + w * 0.55, w);
  }
  if (b.key === "sunset-o") {
    return `${b.wordmark(cx, y + w * 0.24, w, bg)}
      ${T("MILLER", { x: cx, y: y + w * 0.48, font: "Poppins", weight: 800, size: 100, fill: onColor, ls: 20, anchor: "middle", fit: w })}`;
  }
  const f = b.font;
  return `${T(nm(b, b.first), { x: cx, y: y + w * 0.15, font: f.display, weight: f.weight, size: 60, fill: b.c.accent, ls: f.upper ? 18 : 0, anchor: "middle", fit: w * (f.upper ? 0.62 : 0.66) })}
    ${T(nm(b, b.last), { x: cx, y: y + w * 0.45, font: f.display, weight: f.weight, size: 100, fill: onColor, ls: f.upper ? 2 : 0, anchor: "middle", fit: w })}`;
}

/* ---------------------------------- mockups ---------------------------------- */
function yardSign(b) {
  return `<figure class="mock yard">
    <div class="yard-scene">
      <div class="trees"></div>
      <div class="sign-wrap"><div class="sign-face">${conceptById(b.concept).sign()}</div><div class="stakes"><i></i><i></i></div></div>
    </div>
    <figcaption>Yard sign · 24 × 18 in. on an H-stake</figcaption></figure>`;
}

function billboard(b) {
  return `<figure class="mock wide">
    <div class="bb-scene">
      <div class="skyline"></div>
      <div class="bb"><div class="bb-face">${conceptById(b.concept).banner()}</div><div class="bb-walk"></div><div class="bb-poles"><i></i><i></i></div></div>
    </div>
    <figcaption>Billboard · 14 × 48 ft bulletin</figcaption></figure>`;
}

function shirtPrint(b) {
  // Artwork printed straight onto the shirt fabric (no background box).
  const c = b.c, on = c.onPrimary;
  const office = (y) => T("CITY COUNCIL · WARD 3", { x: 150, y, font: b.font.display === "Fraunces" ? "Inter" : b.font.display, weight: 800, size: 30, fill: c.accent, ls: 3, anchor: "middle", fit: 230 });
  let body;
  if (b.key === "torch" || b.key === "flag-torch") body = `${nameBlock(b, 150, 50, 280, on, c.primary)}${office(262)}`;
  else if (b.key === "sunset-o") body = `${nameBlock(b, 150, 80, 270, on, c.primary)}${office(262)}`;
  else body = `<g transform="translate(92 0) scale(.29)">${b.mark(uid("sp"))}</g>${nameBlock(b, 150, 128, 250, on, c.primary)}${office(282)}`;
  return svgBox(300, 300, body, uid("shirt"));
}

function shirt(b) {
  const body = "M118 26 L162 10 Q200 46 238 10 L282 26 L382 86 L346 168 L302 146 L302 436 L98 436 L98 146 L54 168 L18 86 Z";
  const tee = (fill, stroke, inner, cap, cls) => `<div class="tee ${cls}">
      <svg viewBox="0 0 400 446" class="tee-shape" aria-hidden="true"><path d="${body}" fill="${fill}" stroke="${stroke}" stroke-width="2"/><path d="M162 10 Q200 46 238 10" fill="none" stroke="${stroke}" stroke-width="6"/></svg>
      <div class="tee-print">${inner}</div><div class="tee-cap">${cap}</div></div>`;
  const chest = `<div class="tee-mark">${markSvg(b)}</div><div class="tee-name" style="font-family:'${b.font.display}';font-weight:${b.font.weight};color:${b.c.onLight}">${nm(b, b.first + " " + b.last)}</div>`;
  return `<figure class="mock">
    <div class="tee-row" style="background:${b.c.soft}">
      ${tee(b.c.primary, "rgba(0,0,0,.28)", shirtPrint(b), "Front print", "front")}
      ${tee("#FFFFFF", "#CBD2DC", chest, "Volunteer tee", "vol")}
    </div>
    <figcaption>T-shirts · full front print and a lighter volunteer version</figcaption></figure>`;
}

function website(b) {
  const f = b.font, c = b.c;
  const disp = `font-family:'${f.display}';font-weight:${f.weight}`;
  return `<figure class="mock wide">
    <div class="browser">
      <div class="chrome"><span class="dots"><i></i><i></i><i></i></span><span class="url">${b.url}</span></div>
      <div class="site" style="background:${c.light};color:${c.onLight};font-family:'${f.body}'">
        <nav class="site-nav" style="background:${c.primary};color:${c.onPrimary}">
          <span class="brand-lock">${markSvg(b, "nav-mark")}<span style="${disp};${f.upper ? "letter-spacing:.06em" : ""}">${nm(b, b.first + " " + b.last)}</span></span>
          <span class="links"><span>About</span><span>Priorities</span><span>Events</span><span>Volunteer</span></span>
          <span class="btn" style="background:${c.accent};color:${b.key === "sunset-o" || b.key === "tulip" ? "#FFFFFF" : c.primary}">Donate</span>
        </nav>
        <div class="hero" style="background:${c.primary};color:${c.onPrimary}">
          <div class="hero-copy">
            <div class="eyebrow" style="color:${c.accent}">Evansville City Council · Ward 3</div>
            <div class="hero-head" style="${disp};${f.upper ? "text-transform:uppercase" : ""}">${b.tagline}</div>
            <p>${b.first} Miller is running to represent Ward 3 on the Evansville City Council. Sample copy shown here for layout only.</p>
            <div class="hero-ctas"><span class="btn" style="background:${c.accent};color:${b.key === "sunset-o" || b.key === "tulip" ? "#FFFFFF" : c.primary}">Volunteer</span><span class="btn ghost" style="border-color:${c.onPrimary};color:${c.onPrimary}">Request a yard sign</span></div>
          </div>
          <div class="hero-art">${markSvg(b)}</div>
        </div>
        <div class="pillars">
          ${["Neighborhoods", "Streets &amp; infrastructure", "Jobs &amp; small business"].map((t, i) => `<div class="pillar" style="border-top:4px solid ${i === 1 ? c.accent : c.primary};background:${c.soft}"><div style="${disp};font-size:1.05em;color:${c.onLight}">${f.upper ? t.toUpperCase() : t}</div><div class="bar"></div><div class="bar short"></div></div>`).join("")}
        </div>
      </div>
    </div>
    <figcaption>Campaign website · homepage hero (placeholder copy and address)</figcaption></figure>`;
}

function social(b) {
  const f = b.font, c = b.c;
  const disp = `font-family:'${f.display}';font-weight:${f.weight}`;
  const onAccent = b.key === "sunset-o" || b.key === "tulip" ? "#FFFFFF" : c.primary;
  const integrated = b.key === "torch" || b.key === "flag-torch" || b.key === "sunset-o";
  const tile1 = svgBox(400, 400, integrated
    ? nameBlock(b, 200, b.key === "sunset-o" ? 110 : 60, 330, c.onPrimary, c.primary)
    : `<g transform="translate(130 36) scale(.35)">${b.mark(uid("t"))}</g>${nameBlock(b, 200, 200, 300, c.onPrimary, c.primary)}`, uid("tile"), c.primary);
  const up = f.upper ? "text-transform:uppercase" : "";
  return `<figure class="mock">
    <div class="phone">
      <div class="ig-head">
        <div class="avatar" style="background:${c.primary}">${markSvg(b)}</div>
        <div><div class="handle">@${b.handle}</div><div class="bio"><b style="${disp}">${nm(b, b.first + " Miller")}</b><br>Democrat for Evansville City Council, Ward 3</div></div>
      </div>
      <div class="ig-grid">
        <div class="tile">${tile1}</div>
        <div class="tile" style="background:${c.accent};color:${onAccent}"><div class="tile-text" style="${disp};${up}">Ward&nbsp;3,<br>let's get to work.</div></div>
        <div class="tile" style="background:${c.soft}">${markSvg(b, "tile-mark")}</div>
        <div class="tile" style="background:${c.soft}"><div class="tile-sign">${conceptById(b.concept).sign()}</div></div>
        <div class="tile" style="background:${c.light};color:${c.onLight};box-shadow:inset 0 0 0 1px ${c.soft}"><div class="tile-text small" style="${disp};${up}">Knock doors<br>with us this<br><span style="color:${c.accent === "#F6C94A" ? c.primary : c.accent}">Saturday.</span></div></div>
        <div class="tile" style="background:${c.primary}">${markSvg(b, "tile-mark")}</div>
      </div>
    </div>
    <figcaption>Social · profile picture and launch posts</figcaption></figure>`;
}

function pinAndSticker(b) {
  const c = b.c;
  const pinBody = `<circle cx="200" cy="200" r="200" fill="${c.primary}"/>
    <g transform="translate(118 34) scale(.41)">${b.mark(uid("p"))}</g>
    ${T(nm(b, b.first + " " + b.last), { x: 200, y: 262, font: b.font.display, weight: b.font.weight, size: 60, fill: c.onPrimary, anchor: "middle", fit: 290 })}
    ${T("WARD 3", { x: 200, y: 318, font: b.font.display === "Fraunces" ? "Inter" : b.font.display, weight: 800, size: 40, fill: c.accent, ls: 10, anchor: "middle", fit: 140 })}
    <circle cx="200" cy="200" r="194" fill="none" stroke="${c.accent}" stroke-width="6"/>`;
  return `<figure class="mock">
    <div class="pin-row" style="background:${c.soft}">
      <div class="pin">${svgBox(400, 400, pinBody, uid("pin"))}<div class="shine"></div></div>
      <div class="sticker">${conceptById(b.concept).banner()}</div>
    </div>
    <figcaption>2.25 in. button and 11 × 3.7 in. bumper sticker</figcaption></figure>`;
}

function poleBanner(b) {
  const c = b.c, W = 300, H = 760;
  const f2 = b.font.display === "Fraunces" ? "Inter" : b.font.display;
  const L = b.key === "torch" || b.key === "flag-torch"
    ? { top: `${T("VOTE", { x: 150, y: 128, font: b.font.display, weight: b.font.weight, size: 60, fill: c.accent, ls: 18, anchor: "middle", fit: 140 })}${nameBlock(b, 150, 172, 270, c.onPrimary, c.primary)}`, rule: 392, council: 462, ward: 568, dem: 646 }
    : b.key === "sunset-o"
    ? { top: `${T("VOTE", { x: 150, y: 128, font: b.font.display, weight: b.font.weight, size: 60, fill: c.accent, ls: 18, anchor: "middle", fit: 140 })}${nameBlock(b, 150, 212, 262, c.onPrimary, c.primary)}`, rule: 392, council: 462, ward: 568, dem: 646 }
    : { top: `<g transform="translate(60 64) scale(.45)">${b.mark(uid("pb"))}</g>${nameBlock(b, 150, 286, 250, c.onPrimary, c.primary)}`, rule: 440, council: 506, ward: 600, dem: 664 };
  const body = `${L.top}
    <rect x="70" y="${L.rule}" width="160" height="4" fill="${c.accent}"/>
    ${T("CITY COUNCIL", { x: 150, y: L.council, font: f2, weight: 700, size: 40, fill: c.onPrimary, ls: 4, anchor: "middle", fit: 220 })}
    ${T("WARD 3", { x: 150, y: L.ward, font: b.font.display, weight: b.font.display === "Fraunces" ? 800 : b.font.weight, size: 80, fill: c.accent, ls: 4, anchor: "middle", fit: 210 })}
    ${T("DEMOCRAT", { x: 150, y: L.dem, font: f2, weight: 600, size: 26, fill: c.onPrimary, ls: 8, anchor: "middle", fit: 150, attr: { opacity: ".75" } })}`;
  return `<figure class="mock">
    <div class="pole-scene">
      <div class="pole"><div class="lamp-arm"></div><div class="lamp-head"></div></div>
      <div class="pole-banners"><div class="arm top"></div><div class="arm bottom"></div><div class="pb">${svgBox(W, H, body, uid("pole"), c.primary)}</div><div class="pb">${svgBox(W, H, body, uid("pole"), c.primary)}</div></div>
    </div>
    <figcaption>Street pole banners · 30 × 76 in. pair</figcaption></figure>`;
}

function doorHanger(b) {
  const c = b.c, W = 360, H = 900;
  const integrated = b.key === "torch" || b.key === "flag-torch" || b.key === "sunset-o";
  const body = `
    <rect width="${W}" height="520" fill="${c.primary}"/>
    <circle cx="180" cy="78" r="44" fill="#7A4F33"/>
    <rect x="176" y="0" width="8" height="40" fill="#7A4F33"/>
    ${integrated ? nameBlock(b, 180, b.key === "sunset-o" ? 255 : 220, 300, c.onPrimary, c.primary) : `<g transform="translate(110 140) scale(.35)">${b.mark(uid("dh"))}</g>${nameBlock(b, 180, 300, 290, c.onPrimary, c.primary)}`}
    <rect y="520" width="${W}" height="${H - 520}" fill="${c.light}"/>
    <rect y="514" width="${W}" height="8" fill="${c.accent}"/>
    ${T("CITY COUNCIL · WARD 3", { x: 180, y: 590, font: b.font.display === "Fraunces" ? "Inter" : b.font.display, weight: 800, size: 30, fill: c.onLight, ls: 3, anchor: "middle", fit: 300 })}
    ${T(b.tagline, { x: 180, y: 640, font: b.font.body, weight: 600, size: 22, fill: c.onLight, anchor: "middle", fit: Math.min(300, b.tagline.length * 11) })}
    <rect x="40" y="690" width="280" height="10" rx="5" fill="${c.soft}"/><rect x="40" y="716" width="240" height="10" rx="5" fill="${c.soft}"/><rect x="40" y="742" width="260" height="10" rx="5" fill="${c.soft}"/>
    <rect x="40" y="790" width="280" height="60" rx="6" fill="${c.primary}"/>
    ${T(b.url, { x: 180, y: 829, font: "Inter", weight: 700, size: 20, fill: c.onPrimary, anchor: "middle", fit: 230 })}`;
  return `<figure class="mock">
    <div class="dh-scene"><div class="door"><div class="dh">${svgBox(W, H, body, uid("dh"))}<div class="knob"></div></div></div></div>
    <figcaption>Door hanger · 4.25 × 11 in. for canvassing</figcaption></figure>`;
}

/* ---------------------------------- page ---------------------------------- */
function brandSection(b, i) {
  const c = b.c, con = conceptById(b.concept);
  return `<section class="brand" id="${b.key}" style="--bp:${c.primary};--ba:${c.accent};--bon:${c.onPrimary}">
    <header class="brand-head">
      <div class="brand-head-inner">
        <div class="brand-meta">
          <span class="brand-num">${i + 1}</span>
          <div><div class="brand-name">${b.first} Miller · ${b.label}</div><div class="brand-tag">${b.tagline}</div></div>
        </div>
        <div class="brand-hero">${con.banner()}</div>
      </div>
    </header>
    <div class="mock-grid">
      ${billboard(b)}
      ${yardSign(b)}
      ${poleBanner(b)}
      ${website(b)}
      ${shirt(b)}
      ${social(b)}
      ${pinAndSticker(b)}
      ${doorHanger(b)}
    </div>
  </section>`;
}

window.renderBrands = async function (root, nav) {
  const fams = ['700 100px Montserrat', '800 100px Montserrat', '900 100px Montserrat', '700 100px Oswald', '600 100px Oswald', '500 100px Oswald', '800 100px "Barlow Semi Condensed"', '700 100px "Barlow Semi Condensed"', '600 100px "Barlow Semi Condensed"', '800 100px Inter', '700 100px Inter', '600 100px Inter', '800 100px Fraunces', 'italic 600 100px Fraunces', '800 100px Poppins', '700 100px Poppins', '600 100px Poppins'];
  try { await Promise.all(fams.map(f => document.fonts.load(f))); await document.fonts.ready; } catch (e) { }
  root.innerHTML = BRANDS.map(brandSection).join("");
  nav.innerHTML = BRANDS.map((b, i) => `<a href="#${b.key}" style="--dot:${b.c.primary};--dot2:${b.c.accent}"><i></i>${i + 1}. ${b.first} · ${b.label}</a>`).join("");
  MILLER.layoutAll(root);
};
