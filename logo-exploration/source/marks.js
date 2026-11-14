// Poli logo exploration: frosted gradient orb + white smile.
// The smile keeps the current logo's exact geometry (270 grid): M 40 134 Q 135 216 230 134, 13px, round caps.
// mark(name, { glow, id }) returns an SVG string. Works in the browser (window.PoliMarks) and in Node.
(function (target) {
  const SMILE = 'M 40 134 Q 135 216 230 134';

  const CONCEPTS = {
    // A. Closest to the reference: soft, airy, frosted. Depth added behind the smile so it reads.
    aura: {
      title: 'Aura', line: 'Soft and airy, closest to the reference. Calm, premium, approachable.',
      base: { x1: 10, y1: 40, x2: 270, y2: 190, stops: [[0, '#8AA3F2'], [0.42, '#8486E3'], [0.72, '#AD7CC7'], [1, '#EC5F63']] },
      layers: [
        ['radial', '42%', '72%', '66%', [[0, '#5458D2', 0.6], [1, '#5458D2', 0]]],     // depth where the smile sits
        ['radial', '104%', '46%', '44%', [[0, '#E2454C', 0.55], [1, '#E2454C', 0]]],    // warmer right edge
        ['radial', '30%', '14%', '60%', [[0, '#FFFFFF', 0.85], [0.55, '#FFFFFF', 0.25], [1, '#FFFFFF', 0]]], // top-left haze
      ],
      shadow: ['#241A66', 0.32], under: [['#5B7CF0', '#9A86E6', '#EE7C86'], 0.75], rim: 0.95, ring: null,
    },
    // B. Blue and red meeting in the middle: bolder, more saturated, strongest at small sizes.
    meridian: {
      title: 'Meridian', line: 'Blue meets red in the middle. Bold, confident, strongest at small sizes.',
      base: { x1: 0, y1: 135, x2: 270, y2: 135, stops: [[0, '#2E67EE'], [0.28, '#5A62E0'], [0.5, '#8559D2'], [0.72, '#C3519E'], [1, '#EB4F5C']] },
      layers: [
        ['radial', '50%', '108%', '62%', [[0, '#241A66', 0.34], [1, '#241A66', 0]]],
        ['radial', '42%', '6%', '72%', [[0, '#FFFFFF', 0.62], [0.4, '#FFFFFF', 0.22], [1, '#FFFFFF', 0]]],
      ],
      shadow: ['#1B1250', 0.34], under: [['#2E67EE', '#8559D2', '#EB4F5C'], 0.85], rim: 0.7, ring: null,
    },
    // C. A clear glass sphere: colour seen through glass, a soft studio highlight, light pooling at the base.
    glass: {
      title: 'Glass', line: 'A clear glass sphere with real depth and light. The most dimensional and tech-forward.',
      base: { x1: 0, y1: 80, x2: 270, y2: 190, stops: [[0, '#3C6EF2'], [0.35, '#6A62E2'], [0.65, '#A858C4'], [1, '#EE4F60']] },
      layers: [
        ['radial', '50%', '50%', '50%', [[0, '#1B1250', 0], [0.76, '#1B1250', 0], [1, '#1B1250', 0.22]]],   // glass edges read deeper
        ['radial', '50%', '97%', '38%', [[0, '#FFE4EE', 0.42], [1, '#FFE4EE', 0]]],                      // light pooling through the base
        ['ellipse', 100, 66, 72, 34, -22, '#FFFFFF', 0.6, 11],                                           // soft studio highlight
        ['ellipse', 84, 52, 14, 6, -24, '#FFFFFF', 0.85, 1.8],                                          // crisp glint
      ],
      shadow: ['#1B1250', 0.34], under: [['#4A78F4', '#9A6FDF', '#EE5A6E'], 0.7], rim: 0.85, ring: null,
    },
  };

  const VB_GLOW = '-80 -40 430 430', VB_CLEAN = '0 0 270 270';

  function stops(arr) {
    return arr.map(s => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] !== undefined ? ` stop-opacity="${s[2]}"` : ''}/>`).join('');
  }

  function mark(name, o = {}) {
    const c = CONCEPTS[name]; const id = (o.id || name) + (o.glow === false ? 'c' : 'g') + (o.dark ? 'd' : '');
    const glow = o.glow !== false;
    const size = o.size ? ` width="${o.size}" height="${o.size}"` : '';
    let defs = '', body = '';
    defs += `<clipPath id="cl-${id}"><circle cx="135" cy="135" r="135"/></clipPath>`;
    defs += `<linearGradient id="b-${id}" gradientUnits="userSpaceOnUse" x1="${c.base.x1}" y1="${c.base.y1}" x2="${c.base.x2}" y2="${c.base.y2}">${stops(c.base.stops)}</linearGradient>`;
    body += `<circle cx="135" cy="135" r="135" fill="url(#b-${id})"/>`;
    c.layers.forEach((L, i) => {
      if (L[0] === 'radial') defs += `<radialGradient id="l${i}-${id}" cx="${L[1]}" cy="${L[2]}" r="${L[3]}">${stops(L[4])}</radialGradient>`;
      else if (L[0] === 'ellipse') {
        defs += `<filter id="l${i}-${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${L[8]}"/></filter>`;
        body += `<ellipse cx="${L[1]}" cy="${L[2]}" rx="${L[3]}" ry="${L[4]}" transform="rotate(${L[5]} ${L[1]} ${L[2]})" fill="${L[6]}" opacity="${L[7]}" filter="url(#l${i}-${id})" clip-path="url(#cl-${id})"/>`;
        return;
      }
      else defs += `<linearGradient id="l${i}-${id}" gradientUnits="userSpaceOnUse" x1="${L[1]}" y1="${L[2]}" x2="${L[3]}" y2="${L[4]}">${stops(L[5])}</linearGradient>`;
      body += `<circle cx="135" cy="135" r="135" fill="url(#l${i}-${id})" clip-path="url(#cl-${id})"/>`;
    });
    // light catching the lower edge, like the reference's frosted rim
    defs += `<linearGradient id="rmg-${id}" gradientUnits="userSpaceOnUse" x1="0" y1="270" x2="0" y2="150"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`;
    defs += `<mask id="rm-${id}" maskUnits="userSpaceOnUse" x="-20" y="-20" width="310" height="310"><rect x="-20" y="-20" width="310" height="310" fill="url(#rmg-${id})"/></mask>`;
    defs += `<filter id="rb-${id}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"/></filter>`;
    body += `<circle cx="135" cy="135" r="131" fill="none" stroke="#fff" stroke-width="7" opacity="${c.rim}" filter="url(#rb-${id})" mask="url(#rm-${id})" clip-path="url(#cl-${id})"/>`;
    body += `<circle cx="135" cy="135" r="134.2" fill="none" stroke="#fff" stroke-width="1.6" opacity="${c.rim}" mask="url(#rm-${id})"/>`;
    if (c.ring) body += `<circle cx="135" cy="135" r="133.8" fill="none" stroke="${c.ring}" stroke-width="2.2" opacity="0.9"/>`;
    // smile: white, same geometry as today, with the same soft lift shadow under it
    defs += `<filter id="sb-${id}" x="-10%" y="-60%" width="120%" height="220%"><feGaussianBlur stdDeviation="3.5"/></filter>`;
    body += `<path d="M 40 140 Q 135 222 230 140" stroke="${c.shadow[0]}" stroke-width="13" stroke-linecap="round" fill="none" opacity="${c.shadow[1]}" filter="url(#sb-${id})" clip-path="url(#cl-${id})"/>`;
    body += `<path d="${SMILE}" stroke="#FFFFFF" stroke-width="13" stroke-linecap="round" fill="none"/>`;
    let under = '';
    if (glow) {
      let [cols, k] = c.under;
      if (o.dark) { cols = ['#3F6BFF', '#8A5BE8', '#FF4F66']; k = Math.min(1, k + 0.15); }
      defs += `<linearGradient id="ug-${id}" gradientUnits="userSpaceOnUse" x1="-20" y1="0" x2="290" y2="0">${stops([[0, cols[0]], [0.5, cols[1]], [1, cols[2]]])}</linearGradient>`;
      defs += `<filter id="u1-${id}" filterUnits="userSpaceOnUse" x="-140" y="120" width="550" height="320"><feGaussianBlur stdDeviation="26"/></filter>`;
      defs += `<filter id="u2-${id}" filterUnits="userSpaceOnUse" x="-140" y="120" width="550" height="320"><feGaussianBlur stdDeviation="12"/></filter>`;
      under = `<ellipse cx="135" cy="262" rx="150" ry="42" fill="url(#ug-${id})" opacity="${k}" filter="url(#u1-${id})"/>` +
              `<ellipse cx="135" cy="248" rx="106" ry="22" fill="url(#ug-${id})" opacity="${k * 0.8}" filter="url(#u2-${id})"/>`;
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${glow ? VB_GLOW : VB_CLEAN}"${size} fill="none"><defs>${defs}</defs>${under}${body}</svg>`;
  }

  target.mark = mark; target.CONCEPTS = CONCEPTS; target.names = Object.keys(CONCEPTS); target.SMILE = SMILE;
})(typeof module !== 'undefined' ? module.exports : (window.PoliMarks = {}));
