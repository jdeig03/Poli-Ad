// Poli brand mark: "Pure Aura", balanced. Blue (left), purple (everything in between) and red (right)
// share the orb equally and are matched in lightness. White smile, today's smile geometry.
// mark({ id, size, mono, smile }) -> SVG. Browser: window.PoliBrand. Node: module.exports.
(function (target) {
  const SMILE = 'M 40 134 Q 135 216 230 134';
  let DEFAULT_SMILE = 'calmArc';
  const COLORS = {
    blue: '#6F8FEF', purple: '#9B7FDA', red: '#E8667A',     // the Aura trio, equal weight
    blueDeep: '#1C56DB', redDeep: '#DC3547',               // saturated accents for type and UI
    ink: '#1D1D1F', mist: '#F5F5F7', white: '#FFFFFF',
  };
  // Smile study (270 grid). q: quadratic [x0, y0, cx, cy, x1, y1]; w: [width at ends, width in the middle]
  const SMILES = {
    classic: { title: 'Classic', line: "Today's smile, unchanged.", q: [40, 134, 135, 216, 230, 134], w: [13, 13] },
    refined: { title: 'Refined', line: 'Same curve, a lighter line. Calmer and more precise.', q: [40, 134, 135, 216, 230, 134], w: [9.5, 9.5] },
    calm:    { title: 'Calm', line: 'Shallower and lighter. Content rather than grinning.', q: [50, 142, 135, 198, 220, 142], w: [10, 10] },
    tapered: { title: 'Tapered', line: 'Full in the middle, fine at the ends, like a brush stroke.', q: [40, 134, 135, 216, 230, 134], w: [6, 14] },
    calmArc:    { title: 'Calm', line: 'Calm, redrawn as a true arc: same endpoints, same depth.', arc: [135, 26.98, 143.02, 36.46], w: [10, 10] },
    // geometric arcs: arc = [centre x, centre y, radius, half-angle in degrees], measured from straight down
    wide:       { title: 'Open Arc', line: 'A wide, shallow arc. Calm and generous.', arc: [135, 30, 150, 30], w: [9, 9] },
    balanced:   { title: 'Balanced Arc', line: 'Between calm and petite. Clean, friendly, centred.', arc: [135, 82, 102, 35], w: [9.5, 9.5] },
    small:      { title: 'Petite Arc', line: 'Smaller and lower. The orb does more of the talking.', arc: [135, 118, 70, 46], w: [9.5, 9.5] },
    concentric: { title: 'Concentric Arc', line: 'Shares the orb\'s exact centre. One geometric system.', arc: [135, 135, 64, 44], w: [9.5, 9.5] },
    petite:  { title: 'Petite', line: 'Smaller and lower. More orb, more character.', q: [70, 152, 135, 204, 200, 152], w: [11, 11] },
  };
  function smilePath(name, override, color = '#FFFFFF') {
    const S = SMILES[name] || SMILES.classic; let [we, wm] = S.w;
    if (override) { const k = override / S.w[1]; we *= k; wm *= k; }
    if (S.arc) {
      const [ax, ay, ar, ha] = S.arc, t = ha * Math.PI / 180;
      const xa = ax - ar * Math.sin(t), xb = ax + ar * Math.sin(t), yy = ay + ar * Math.cos(t);
      return `<path d="M ${xa.toFixed(2)} ${yy.toFixed(2)} A ${ar} ${ar} 0 0 0 ${xb.toFixed(2)} ${yy.toFixed(2)}" stroke="${color}" stroke-width="${wm}" stroke-linecap="round" fill="none"/>`;
    }
    const [x0, y0, cx, cy, x1, y1] = S.q;
    if (we === wm) return `<path d="M ${x0} ${y0} Q ${cx} ${cy} ${x1} ${y1}" stroke="${color}" stroke-width="${wm}" stroke-linecap="round" fill="none"/>`;
    const L = [], R = [], n = 60;
    for (let i = 0; i <= n; i++) {
      const t = i / n, a = 1 - t;
      const x = a * a * x0 + 2 * a * t * cx + t * t * x1, y = a * a * y0 + 2 * a * t * cy + t * t * y1;
      let dx = 2 * a * (cx - x0) + 2 * t * (x1 - cx), dy = 2 * a * (cy - y0) + 2 * t * (y1 - cy); const l = Math.hypot(dx, dy); dx /= l; dy /= l;
      const w = (we + (wm - we) * Math.sin(Math.PI * t)) / 2;
      L.push([x - dy * w, y + dx * w]); R.push([x + dy * w, y - dx * w]);
    }
    const pts = L.concat(R.reverse()).map(p => p[0].toFixed(2) + ' ' + p[1].toFixed(2)).join(' L ');
    return `<path d="M ${pts} Z" fill="${color}"/><circle cx="${x0}" cy="${y0}" r="${we / 2}" fill="${color}"/><circle cx="${x1}" cy="${y1}" r="${we / 2}" fill="${color}"/>`;
  }
  const st = a => a.map(s => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] !== undefined ? ` stop-opacity="${s[2]}"` : ''}/>`).join('');

  function mark(o = {}) {
    const id = (o.id || 'pa') + (o.mono ? 'm' : '');
    const size = o.size ? ` width="${o.size}" height="${o.size}"` : '';
    const sm = o.smileStyle || DEFAULT_SMILE;        // o.smile: optical weight override, e.g. heavier for 16px favicons
    if (o.mono) {                                   // one-colour version: solid orb, smile knocked out
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 270 270"${size} fill="none"><defs><mask id="k-${id}"><rect width="270" height="270" fill="#fff"/>${smilePath(sm, o.smile, '#000')}</mask></defs><circle cx="135" cy="135" r="135" fill="${o.mono}" mask="url(#k-${id})"/></svg>`;
    }
    let d = `<clipPath id="c-${id}"><circle cx="135" cy="135" r="135"/></clipPath>`;
    // left to right, symmetric: blue third, purple third, red third
    d += `<linearGradient id="g-${id}" gradientUnits="userSpaceOnUse" x1="0" y1="135" x2="270" y2="135">${st([[0, COLORS.blue], [0.12, COLORS.blue], [0.44, COLORS.purple], [0.84, COLORS.red], [1, COLORS.red]])}</linearGradient>`;
    // neutral depth where the smile sits (purple, centred) and light from straight above (white, centred)
    d += `<radialGradient id="dp-${id}" cx="50%" cy="76%" r="60%">${st([[0, '#8040A0', 0.42], [1, '#8040A0', 0]])}</radialGradient>`;
    d += `<radialGradient id="tp-${id}" cx="50%" cy="6%" r="66%">${st([[0, '#FFFFFF', 0.7], [0.5, '#FFFFFF', 0.18], [1, '#FFFFFF', 0]])}</radialGradient>`;
    const b = `<circle cx="135" cy="135" r="135" fill="url(#g-${id})"/>` +
      `<circle cx="135" cy="135" r="135" fill="url(#dp-${id})" clip-path="url(#c-${id})"/>` +
      `<circle cx="135" cy="135" r="135" fill="url(#tp-${id})" clip-path="url(#c-${id})"/>` +
      smilePath(sm, o.smile);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 270 270"${size} fill="none"><defs>${d}</defs>${b}</svg>`;
  }
  // The same mark, under the module interface the measuring script uses
  target.mark = (n, o) => mark(o); target.brandMark = mark; target.SMILES = SMILES; target.setDefaultSmile = n => { DEFAULT_SMILE = n; }; target.COLORS = COLORS; target.SMILE = SMILE;
})(typeof module !== 'undefined' ? module.exports : (window.PoliBrand = {}));
