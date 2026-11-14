// Apple-ified Aura: three refined takes on the soft, airy Aura orb. White smile, today's smile geometry.
// mark(name, { id, size, halo }) -> SVG string. Browser: window.PoliMarks2. Node: module.exports.
(function (target) {
  const SMILE = 'M 40 134 Q 135 216 230 134';
  const st = a => a.map(s => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] !== undefined ? ` stop-opacity="${s[2]}"` : ''}/>`).join('');
  // Aura palette, airy but with enough depth behind the smile
  const AURA = [[0, '#86A0F2'], [0.4, '#8284E2'], [0.7, '#A97BCB'], [1, '#EA6168']];

  const CONCEPTS = {
    pure:  { title: 'Pure Aura',  line: 'Aura reduced to one smooth gradient. Nothing extra.' },
    light: { title: 'Aura Light', line: 'Lit from within, with a faint halo. Warm and quietly alive.' },
    glass: { title: 'Aura Glass', line: 'Frosted glass, with light catching the rim. Crafted and modern.' },
  };

  function mark(name, o = {}) {
    const id = (o.id || name) + 'x';
    const halo = name === 'light' && o.halo !== false;
    const vb = halo ? '-40 -40 350 350' : '0 0 270 270';
    const size = o.size ? ` width="${o.size}" height="${o.size}"` : '';
    let d = `<clipPath id="c-${id}"><circle cx="135" cy="135" r="135"/></clipPath>`;
    d += `<linearGradient id="g-${id}" gradientUnits="userSpaceOnUse" x1="14" y1="40" x2="262" y2="196">${st(AURA)}</linearGradient>`;
    let b = `<circle cx="135" cy="135" r="135" fill="url(#g-${id})"/>`;
    const lay = (gid, grad) => { d += grad; b += `<circle cx="135" cy="135" r="135" fill="url(#${gid}-${id})" clip-path="url(#c-${id})"/>`; };
    // shared: depth where the smile sits, soft light from the top
    lay('dp', `<radialGradient id="dp-${id}" cx="44%" cy="74%" r="62%">${st([[0, '#5559D3', 0.5], [1, '#5559D3', 0]])}</radialGradient>`);
    lay('tp', `<radialGradient id="tp-${id}" cx="34%" cy="10%" r="70%">${st([[0, '#FFFFFF', 0.72], [0.5, '#FFFFFF', 0.2], [1, '#FFFFFF', 0]])}</radialGradient>`);
    if (name === 'light') {
      // inner luminance: a soft bright core, and a gentle lift along the lower edge
      lay('core', `<radialGradient id="core-${id}" cx="50%" cy="30%" r="40%">${st([[0, '#FFFFFF', 0.26], [1, '#FFFFFF', 0]])}</radialGradient>`);
      lay('lo', `<radialGradient id="lo-${id}" cx="50%" cy="104%" r="34%">${st([[0, '#F4E9FF', 0.4], [1, '#F4E9FF', 0]])}</radialGradient>`);
    }
    if (name === 'glass') {
      // fresnel: edges lighten like frosted glass, plus a fine specular rim top-left and a reflected rim bottom-right
      lay('fr', `<radialGradient id="fr-${id}" cx="50%" cy="50%" r="50%">${st([[0, '#FFFFFF', 0], [0.8, '#FFFFFF', 0], [1, '#FFFFFF', 0.42]])}</radialGradient>`);
      d += `<linearGradient id="rk-${id}" gradientUnits="userSpaceOnUse" x1="40" y1="30" x2="230" y2="240">${st([[0, '#FFFFFF', 1], [0.3, '#FFFFFF', 0.1], [0.65, '#FFFFFF', 0.05], [1, '#FFFFFF', 0.8]])}</linearGradient>`;
      b += `<circle cx="135" cy="135" r="133.6" fill="none" stroke="url(#rk-${id})" stroke-width="2.8"/>`;
    }
    // the smile: pure white, today's exact geometry
    b += `<path d="${SMILE}" stroke="#FFFFFF" stroke-width="13" stroke-linecap="round" fill="none"/>`;
    let h = '';
    if (halo) {
      d += `<linearGradient id="hg-${id}" gradientUnits="userSpaceOnUse" x1="-10" y1="0" x2="280" y2="0">${st([[0, '#7C9BFA'], [0.5, '#A28CF0'], [1, '#F27D8A']])}</linearGradient>`;
      d += `<filter id="hf-${id}" filterUnits="userSpaceOnUse" x="-80" y="-80" width="430" height="430"><feGaussianBlur stdDeviation="18"/></filter>`;
      h = `<circle cx="135" cy="141" r="140" fill="url(#hg-${id})" opacity="0.42" filter="url(#hf-${id})"/>`;
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}"${size} fill="none"><defs>${d}</defs>${h}${b}</svg>`;
  }
  target.mark = mark; target.CONCEPTS = CONCEPTS; target.names = Object.keys(CONCEPTS);
})(typeof module !== 'undefined' ? module.exports : (window.PoliMarks2 = {}));
