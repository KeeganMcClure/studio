// Rushlight creature upgrade, rough mockup v1 (Nov 23, 2026), for spec 008 part 8A.
// Every creature keeps its approved design, size and rules (bible, Art, creature batches 1 and 2); only the craft
// changes, to the studio Quality bar: 4-tone volume shading lit from the upper left, a selective outline, a rim.
//   Redrawn: the Noonwife, the Counter, the Corpse-candle, the Lampwalkers, Severa the owl.
//   Touched up (rim and selective outline on the approved sprite): the hedge cat, the Hollow Monk, the rooks, the Withy Hag.
// Same grid helpers as sprite-upgrade-rough-v3.js. window.CREATURES_V1.<name>() gives a 1x canvas.
(function () {
  const PEAT = '#1c1814';
  const L = (() => { const v = [-0.55, -0.62, 0.56], m = Math.hypot(...v); return v.map(x => x / m); })();
  function grid(w, h) {
    const g = []; for (let y = 0; y < h; y++) g.push(Array(w).fill(null));
    return { w, h, g,
      p(x, y, c) { x = Math.round(x); y = Math.round(y); if (x >= 0 && y >= 0 && x < w && y < h && c) this.g[y][x] = c; },
      r(x, y, ww, hh, c) { for (let j = 0; j < hh; j++) for (let i = 0; i < ww; i++) this.p(x + i, y + j, c); },
      // a shaded ellipse: the ramp is [light, base, shade, deep]; tilt > 0 pushes the light band
      vol(cx, cy, rx, ry, ramp, o = {}) {
        for (let y = Math.floor(cy - ry - 1); y <= cy + ry + 1; y++) for (let x = Math.floor(cx - rx - 1); x <= cx + rx + 1; x++) {
          const dx = (x + .5 - cx) / rx, dy = (y + .5 - cy) / ry, d = dx * dx + dy * dy;
          let lim = 1; if (o.fur && d > .72) { const a = Math.atan2(dy, dx); lim = 1 + (Math.sin(a * o.fur) > .55 ? .12 : 0); }
          if (d > lim) continue; if (o.clip && !o.clip(x, y)) continue;
          const z = Math.sqrt(Math.max(0, 1 - Math.min(d, 1)));
          const n = [dx, dy, z], v = n[0] * L[0] + n[1] * L[1] + n[2] * L[2];
          const i = v > .62 ? 0 : v > .3 ? 1 : v > .02 ? 2 : 3;
          let c = ramp[Math.min(3, i + (o.dark || 0))];
          if (o.clump && i >= 2 && ((x * 3 + y * 5) % 7 === 0)) c = ramp[3];
          if (o.clump && i <= 1 && ((x * 5 + y * 3) % 11 === 0)) c = ramp[0];
          this.p(x, y, c);
        }
      },
      tri(pts, c) { const [a, b, d] = pts; const s = (p, q, r) => (p[0] - r[0]) * (q[1] - r[1]) - (q[0] - r[0]) * (p[1] - r[1]);
        for (let y = Math.floor(Math.min(a[1], b[1], d[1])); y <= Math.ceil(Math.max(a[1], b[1], d[1])); y++) for (let x = Math.floor(Math.min(a[0], b[0], d[0])); x <= Math.ceil(Math.max(a[0], b[0], d[0])); x++) {
          const P = [x + .5, y + .5], d1 = s(P, a, b), d2 = s(P, b, d), d3 = s(P, d, a); if (!((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0))) this.p(x, y, c); } },
      line(x0, y0, x1, y1, c) { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)); for (let i = 0; i <= n; i++) this.p(x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n, c); },
      // selective outline: Peat on the right and bottom (shadow side), a darker tone of the neighbor on the lit side
      outline(darken) { const o = [];
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (!this.g[y][x]) {
          const nb = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([ex, ey]) => [ex, ey, this.g[y + ey] && this.g[y + ey][x + ex]]).filter(q => q[2] && q[2] !== PEAT && !q[2].startsWith('#0'));
          if (nb.length) { const lit = nb.every(q => q[0] === 1 || q[1] === 1); o.push([x, y, lit ? darken(nb[0][2]) : PEAT]); } }
        o.forEach(([x, y, c]) => this.g[y][x] = c); return this; },
      rim(k) { // the lit edge: pixels on the upper-left edge of a shape, pulled toward light (run before outline)
        const pts = []; for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) { const v = this.g[y][x]; if (!v || v === PEAT) continue;
          if (x > w * .62 || y > h * .82) continue; if (!this.g[y][x - 1] || (!this.g[y - 1][x] && x < w * .5)) pts.push([x, y, v]); }
        pts.forEach(([x, y, v]) => this.g[y][x] = mix(v, '#fff4dc', k)); return this; },
      draw(ctx, ox, oy, s) { for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const c = this.g[y][x]; if (c) { ctx.fillStyle = c; ctx.fillRect(ox + x * s, oy + y * s, s, s); } } }
    };
  }
  const mix = (a, b, k) => { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16), ch = s => [s >> 16, (s >> 8) & 255, s & 255], x = ch(A), y = ch(B); return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * k).toString(16).padStart(2, '0')).join(''); };
  const dark = c => mix(c, PEAT, .55);
  const ramp = (base, lightTo = '#f2ead6') => [mix(base, lightTo, .28), base, mix(base, '#2a2030', .3), mix(base, PEAT, .55)];

  // ---------- palettes (earth palette; the Corpse-candle's cold blue is its own, as approved Nov 21) ----------
  const BONE = ramp('#e6dcc2', '#fffaf0'), VOID = ['#0e0c0a', '#0e0c0a', '#0e0c0a', '#0e0c0a'];
  const SKIN = ramp('#9a9288', '#e4dccc'), GUM = ramp('#b8706a', '#f0b0a8'), TOOTH = ramp('#ddd2b8', '#fffaf0');
  const STOAT = ramp('#7a5634', '#d8a870'), CREAM = ramp('#d6c29c'), TUNIC = ramp('#5a4a3a', '#a89070'), ROPE = ramp('#9a7e52', '#e0c890');
  const COLD = ['#e8fbff', '#9ad6ec', '#4a86a8', '#20384a'];
  const SMOCK = ramp('#7a766c', '#d4d0c4'), HOOD = ramp('#5e5246', '#b4a48c'), GREYSKIN = ramp('#8e8a84', '#d8d2c8');
  const BRASS = ['#fff0b0', '#d8b04a', '#9a7428', '#5a4018'], MUD = ramp('#5a4630');
  const BUFF = ramp('#c8964a', '#ffe0a0'), VEIL = ramp('#a49a90', '#e8e2d8'), FACE = ramp('#eee6d6', '#ffffff'), RUSTR = ramp('#9a5a30'), BEAM = ramp('#6a4c30', '#c89a68');
  const fin = (G, k = .35) => { G.rim(k); return G.outline(dark); };

  // ---------- the Noonwife (38 × 61): something missing, wrong physics, Bone on the robe ----------
  // a tall hooded woman in a Bone robe that hangs in hard folds; the face is a flat void (the one flat thing,
  // on purpose: it has no light because there is nothing there). No shadow under her.
  function noonwife() {
    const G = grid(38, 61), cx = 19;
    for (let y = 14; y < 58; y++) { const t = (y - 14) / 44, hw = 6 + t * 9; // the robe flares to the hem
      for (let x = Math.round(cx - hw); x <= Math.round(cx + hw); x++) { const u = (x + .5 - cx) / hw;
        const fold = Math.sin(u * 7.5 + t * 1.5); let i = u < -.45 ? 0 : u < .2 ? 1 : u < .7 ? 2 : 3;
        if (fold > .82 && i < 3) i++; if (fold < -.9 && i > 0) i--; G.p(x, y, BONE[i]); } }
    // a ragged hem that drifts up a little (no ground under it), and two bare grey toes
    for (let x = 4; x < 35; x++) if ((x * 7) % 5 < 2) G.p(x, 58, BONE[2]);
    G.r(15, 59, 2, 1, SKIN[1]); G.r(21, 59, 2, 1, SKIN[2]);
    // the hood: a shaded dome with the cloth falling past the shoulders
    G.vol(cx, 11, 8, 9, BONE, {}); G.vol(cx, 18, 9, 5, BONE, { dark: 0 });
    // the void: flat, no rim, no shading, slightly too tall for a face
    for (let y = 5; y < 20; y++) for (let x = 13; x < 26; x++) { const dx = (x + .5 - cx) / 4.6, dy = (y + .5 - 12) / 6.8; if (dx * dx + dy * dy < 1) G.p(x, y, VOID[0]); }
    // the hood's deep inner edge round the void, lit on the left
    for (let y = 4; y < 21; y++) for (let x = 12; x < 27; x++) { const dx = (x + .5 - cx) / 5.6, dy = (y + .5 - 12) / 7.8, d = dx * dx + dy * dy;
      if (d < 1 && d > .7 && G.g[y][x] !== VOID[0]) G.p(x, y, x < cx ? BONE[2] : BONE[3]); }
    // hands: long grey fingers out of the sleeves, held still at her sides
    G.r(7, 36, 2, 5, SKIN[1]); G.p(7, 41, SKIN[2]); G.r(29, 36, 2, 5, SKIN[2]); G.p(30, 41, SKIN[3]);
    G.line(9, 22, 7, 35, BONE[2]); G.line(29, 22, 31, 35, BONE[3]);
    fin(G, .25);
    // heat shimmer: Bone dashes in the air round her, outside the outline
    [[1, 18], [2, 26], [34, 20], [35, 31], [0, 34], [33, 9]].forEach(([x, y]) => { G.p(x, y, BONE[1]); G.p(x + 1, y, BONE[0]); });
    return G;
  }

  // ---------- the Counter (52 × 29): a starved hound, one mouth from snout to belly, teeth like grain ----------
  function counter() {
    const G = grid(52, 29);
    // legs first (behind the body): thin, knuckled, the far pair a tone darker
    const leg = (x0, y0, x1, y1, x2, y2, r) => { G.line(x0, y0, x1, y1, r[2]); G.line(x0 + 1, y0, x1 + 1, y1, r[1]); G.line(x1, y1, x2, y2, r[2]); G.line(x1 + 1, y1, x2 + 1, y2, r[1]); G.p(x1, y1, r[0]); G.r(x2 - 1, y2, 3, 1, r[3]); };
    leg(19, 16, 18, 22, 17, 27, SKIN.map(c => mix(c, PEAT, .25))); leg(42, 13, 46, 20, 44, 27, SKIN.map(c => mix(c, PEAT, .25)));
    // body: a sunk chest, a long belly and high haunches
    G.vol(29, 12, 15, 5.5, SKIN, { clump: 1 }); G.vol(42, 9, 7, 7, SKIN, { clump: 1 }); G.vol(18, 13, 6, 6, SKIN, {});
    // the neck hangs down to the head, low and forward
    G.vol(11, 16, 5, 3.5, SKIN, {}); G.vol(6, 18, 6, 3.2, SKIN, {});
    // ribs: curved shade lines with a lit edge, too many of them
    for (let i = 0; i < 6; i++) { const x = 20 + i * 2.6; for (let y = 9; y < 17; y++) { const xx = x + (y - 9) * .25; if (G.g[y][Math.round(xx)]) { G.p(xx, y, SKIN[2]); G.p(xx - 1, y, SKIN[0]); } } }
    // spine knuckles along the top
    for (let x = 16; x < 46; x += 3) { const y = x < 36 ? 6 + Math.abs(x - 26) * .02 : 3 + Math.abs(x - 42) * .4; G.p(x, Math.round(y), SKIN[0]); G.p(x + 1, Math.round(y), SKIN[1]); }
    // mange: bare darker patches
    [[33, 13], [37, 10], [25, 15], [45, 12]].forEach(([x, y]) => { G.p(x, y, SKIN[3]); G.p(x + 1, y, SKIN[2]); G.p(x, y + 1, SKIN[2]); });
    // the mouth: from the snout tip back under the jaw, down the throat and along the belly. Gums pink, teeth even.
    const mouth = []; for (let x = 1; x < 36; x++) { const y = x < 12 ? 19 + x * .05 : x < 18 ? 19 - (x - 12) * .1 : 18 - (x - 18) * .05; mouth.push([x, Math.round(y)]); }
    mouth.forEach(([x, y], i) => { G.p(x, y, PEAT); G.p(x, y - 1, GUM[i % 2 ? 1 : 2]); G.p(x, y + 1, GUM[2]); if (i % 2 === 0) { G.p(x, y - 1, TOOTH[0]); G.p(x, y + 1, TOOTH[1]); } });
    // a tail like a cord
    G.line(48, 6, 51, 12, SKIN[2]); G.line(49, 6, 51, 10, SKIN[1]);
    fin(G, .3);
    // no eyes: the head's lit top runs unbroken to the snout
    return G;
  }

  // ---------- the Corpse-candle (40 × 66): a hanged stoat walking, chest open on a cold light ----------
  function candle() {
    const G = grid(40, 66);
    // the rope goes up out of frame from the lolled head
    for (let y = 0; y < 12; y++) { G.p(26 + (y > 8 ? 1 : 0), y, y % 2 ? ROPE[1] : ROPE[2]); G.p(27 + (y > 8 ? 1 : 0), y, ROPE[3]); }
    // legs dangle: toes pointed down, not touching
    const leg = (x, r) => { G.vol(x, 52, 2.2, 7, r, {}); G.vol(x, 60, 1.6, 3, STOAT, {}); G.r(x - 1, 63, 2, 2, STOAT[2]); G.p(x, 65, STOAT[3]); };
    leg(17, TUNIC.map(c => mix(c, PEAT, .1))); leg(23, TUNIC);
    // the body: a tunic, lit from the left
    G.vol(20, 36, 8.5, 11, TUNIC, { clump: 1 }); G.r(13, 44, 15, 3, TUNIC[2]);
    // arms hang past the knee
    G.vol(11, 40, 1.6, 13, TUNIC, {}); G.vol(29, 40, 1.6, 13, TUNIC, { dark: 1 });
    G.vol(11, 55, 1.5, 3, STOAT, {}); G.vol(29, 55, 1.5, 3, STOAT, { dark: 1 }); G.p(11, 58, STOAT[2]); G.p(29, 58, STOAT[3]); G.p(10, 58, STOAT[3]);
    // the stretched neck: far too long, leaning to the right shoulder
    for (let y = 14; y < 27; y++) { const x = 21 + (26 - y) * .45; G.r(Math.round(x) - 2, y, 4, 1, STOAT[1]); G.p(Math.round(x) - 2, y, STOAT[0]); G.p(Math.round(x) - 1, y, STOAT[0]); G.p(Math.round(x) + 1, y, STOAT[2]); G.p(Math.round(x), y, y > 18 ? CREAM[1] : STOAT[1]); }
    // the head lolls over onto the right shoulder, muzzle pointing down
    G.vol(28, 13, 6.5, 5, STOAT, { fur: 9 }); G.vol(32, 18, 3.2, 3, STOAT, {}); G.vol(33, 19.5, 2.2, 2, CREAM, {});
    G.r(33, 22, 2, 1, PEAT); G.vol(24, 9, 1.6, 1.6, STOAT, {}); G.vol(31, 8, 1.6, 1.6, STOAT, { dark: 1 }); // nose, ears
    G.r(28, 14, 3, 1, PEAT); G.p(31, 15, STOAT[3]); // a shut eye, a line
    // the open chest: torn cloth, the cold light inside, and its tint on the cloth and fur near it
    for (let y = 25; y < 42; y++) for (let x = 10; x < 31; x++) { const dx = (x + .5 - 20) / 4, dy = (y + .5 - 32) / 5.5, d = dx * dx + dy * dy;
      if (d < 1) G.p(x, y, d < .2 ? COLD[0] : d < .5 ? COLD[1] : d < .8 ? COLD[2] : COLD[3]);
      else if (d < 3.2 && G.g[y][x]) G.p(x, y, mix(G.g[y][x], COLD[1], .32 * (1 - (d - 1) / 2.2))); }
    [[16, 28], [24, 29], [17, 37], [23, 36]].forEach(([x, y]) => G.p(x, y, TUNIC[3])); // the torn edge
    fin(G, .28);
    return G;
  }

  // ---------- a Lampwalker (26 × 48; three exact copies): grey smocks, the same tilt, an unlit lamp drawn too well ----------
  function lampwalker() {
    const G = grid(26, 48);
    // boots, then the smock
    G.r(8, 43, 4, 4, MUD[2]); G.r(14, 43, 4, 4, MUD[3]); G.r(8, 43, 4, 1, MUD[1]);
    for (let y = 16; y < 44; y++) { const hw = 6 + (y - 16) * .14; for (let x = Math.round(13 - hw); x <= Math.round(13 + hw); x++) { const u = (x + .5 - 13) / hw;
      let i = u < -.45 ? 0 : u < .25 ? 1 : u < .75 ? 2 : 3; if (Math.sin(u * 6 + y * .05) > .9 && i < 3) i++; G.p(x, y, SMOCK[i]); } }
    G.r(6, 43, 15, 1, SMOCK[3]);
    // the hood and the face inside it, tipped a few degrees to the right (the same on all three)
    G.vol(14, 10, 7, 7.5, HOOD, { clump: 1 }); G.vol(13, 17, 8, 3, HOOD, {});
    G.vol(14.6, 11.5, 4, 4.6, GREYSKIN, {});
    G.r(12, 10, 2, 1, PEAT); G.r(16, 11, 2, 1, PEAT); // eyes, small and dark, not looking at anyone
    G.vol(15.4, 14.5, 1.3, 1.6, ['#2a1e18', '#1c1814', PEAT, PEAT]); // the mouth, open on a number
    // the arms come forward to hold the lamp out at the chest
    G.vol(9, 26, 2.6, 5, SMOCK, {}); G.vol(17, 26, 2.6, 5, SMOCK, { dark: 1 }); G.r(10, 29, 7, 2, GREYSKIN[1]);
    // mud: one splash, the same spot on each
    [[17, 36], [18, 37], [16, 38], [19, 35]].forEach(([x, y], i) => G.p(x, y, MUD[i % 2 ? 1 : 2]));
    fin(G, .25);
    // the lamp, drawn after the outline and finer than anything near it: a ring, a cap, a glass, a cage, a base
    const lx = 9, ly = 20;
    G.p(lx + 3, ly - 2, BRASS[2]); G.p(lx + 2, ly - 1, BRASS[2]); G.p(lx + 4, ly - 1, BRASS[3]);
    G.r(lx + 1, ly, 5, 1, BRASS[1]); G.p(lx + 1, ly, BRASS[0]); G.p(lx + 5, ly, BRASS[3]);
    G.r(lx, ly + 1, 7, 1, BRASS[2]); G.p(lx, ly + 1, BRASS[1]);
    for (let j = 2; j < 9; j++) { G.p(lx, ly + j, BRASS[j < 5 ? 0 : 1]); G.r(lx + 1, ly + j, 5, 1, j < 4 ? '#5a5650' : '#34302a'); G.p(lx + 6, ly + j, BRASS[3]);
      G.p(lx + 3, ly + j, j % 2 ? BRASS[1] : BRASS[2]); if (j === 2 || j === 3) G.p(lx + 1, ly + j, '#9a948a'); if (j === 5) G.r(lx + 1, ly + j, 5, 1, BRASS[2]); }
    G.p(lx + 3, ly + 6, '#2a2018'); G.p(lx + 3, ly + 5, '#4a3a28'); // the cold wick
    G.r(lx - 1, ly + 9, 9, 1, BRASS[1]); G.p(lx - 1, ly + 9, BRASS[0]); G.p(lx + 7, ly + 9, BRASS[3]); G.r(lx, ly + 10, 7, 1, BRASS[2]); G.r(lx + 1, ly + 11, 5, 1, BRASS[3]);
    G.r(lx - 2, ly + 7, 2, 3, GREYSKIN[1]); G.r(lx + 7, ly + 7, 2, 3, GREYSKIN[2]); // the hands on the lamp
    return G;
  }

  // ---------- Severa the owl (72 × 58): a barn owl at Mouse Guard scale, mantling on the tie beam ----------
  function severa() {
    const G = grid(72, 58);
    // the beam under her
    G.r(0, 50, 72, 6, BEAM[1]); G.r(0, 50, 72, 1, BEAM[0]); G.r(0, 54, 72, 2, BEAM[2]);
    for (let x = 3; x < 72; x += 9) G.line(x, 51, x + 4, 53, BEAM[2]);
    // the wings spread wide over the beam: golden-buff, rows of feathers, grey veil and pearl spots
    const hash = (x, y) => ((x * 73856093) ^ (y * 19349663)) >>> 0;
    const BAR = ramp('#a89a88', '#ece6da'); // the grey-barred flight feathers
    // a mantling wing seen from the front: long flight feathers fan out from the shoulder like a cape,
    // the outer primaries lowest and barred grey, the inner ones golden-buff; coverts sit over their roots
    const wing = side => {
      const sx = 36 + side * 7, sy = 15, n = 9;
      for (let i = 0; i < n; i++) { // outer (top, near horizontal) first, inner (hanging down) last, so inner overlap outer
        const a = (172 - i * 8.5) * Math.PI / 180, dx = Math.cos(a) * -side * -1, dy = Math.sin(a);
        const ux = side < 0 ? Math.cos(a) : -Math.cos(a), uy = dy, len = 31 + (i > 5 ? 2 : 0) - (i < 2 ? 2 : 0);
        const px = -uy, py = ux; // across the feather
        const lit = side < 0 ? (i < 5 ? 0 : 1) : (i < 5 ? 1 : 2), barred = i < 4;
        for (let t = 0; t <= len; t += .5) { const wd = t < len - 5 ? 2.6 + t * .03 : (len - t) * .6; // a tapered tip
          for (let s = -wd; s <= wd; s += .5) { const x = sx + ux * t + px * s, y = sy + uy * t + py * s; if (y > 52) continue;
            let k = lit; if (s > wd - 1.1) k = Math.min(3, lit + 2); else if (s < -wd + 1) k = Math.max(0, lit - 1); // the edges: deep on one side, light on the other
            const r = barred && t > 12 ? BAR : BUFF; let c = r[k]; if (barred && t > 12 && Math.floor(t) % 6 < 2) c = r[Math.min(3, k + 1)]; // grey bars
            if (t > len - 3) c = mix(c, '#f0e6d0', .35); // pale tips
            G.p(x, y, c); } } }
      // the coverts: a rounded buff shoulder over the feather roots, with scallops and pearl spots
      G.vol(sx + side * 6, 21, 11, 9, BUFF, { dark: side > 0 ? 1 : 0, fur: 11 });
      for (let r = 0; r < 3; r++) for (let x = sx + side * 6 - 10; x <= sx + side * 6 + 10; x++) { const y = 17 + r * 4 + Math.round(Math.abs(Math.sin(x * .9)) * 1.4);
        if (G.g[y] && BUFF.includes(G.g[y][x])) G.p(x, y, BUFF[3]); }
      for (let y = 8; y < 52; y++) for (let x = 0; x < 72; x++) { const c = G.g[y][x]; if (!c || !BUFF.includes(c) || Math.sign(x - 36) !== side) continue;
        if (hash(x + 7, y * 3) % 37 === 0) { G.p(x, y, FACE[0]); G.p(x + 1, y, '#3a3028'); } } }; // pearl spots, each with its dark tick
    wing(-1); wing(1);
    // the body: a pale breast with small dark spots
    G.vol(36, 33, 10, 15, FACE.map((c, i) => i < 2 ? mix(c, '#e8d0a0', .25) : c), {});
    for (let y = 26; y < 46; y += 3) for (let x = 30; x < 43; x += 4) G.p(x + (y % 2), y, VEIL[2]);
    // the head: buff crown, then the white heart face with a rust rim, big black eyes
    G.vol(36, 14, 10, 9, BUFF, { clump: 1 });
    const heart = (x, y) => { const dx = (x + .5 - 36) / 8, dy = (y + .5 - 16) / 7.5; const ax = Math.abs(dx); return (dx * dx + dy * dy < 1 && dy > -.8 + ax * ax * .3) || (dy > 0 && ax < 1 - dy * .9); };
    for (let y = 6; y < 26; y++) for (let x = 26; x < 46; x++) if (heart(x, y)) { const edge = !heart(x - 1, y) || !heart(x + 1, y) || !heart(x, y - 1) || !heart(x, y + 1);
      G.p(x, y, edge ? RUSTR[x < 36 ? 1 : 2] : FACE[x < 34 ? 0 : x < 39 ? 1 : 2]); }
    G.line(36, 9, 36, 18, FACE[2]); // the ridge down the middle of the face
    G.r(31, 14, 3, 3, PEAT); G.r(39, 14, 3, 3, PEAT); G.p(31, 14, '#2e2824'); G.p(39, 14, '#2e2824'); // eyes, no glints
    G.r(35, 19, 2, 2, '#c8b49a'); G.p(36, 20, '#8a7a64'); // the beak
    // talons hooked over the beam
    [[31, 48], [34, 48], [39, 48], [42, 48]].forEach(([x, y]) => { G.r(x, y, 2, 3, VEIL[1]); G.p(x, y + 3, PEAT); G.p(x + 1, y + 3, '#4a4038'); });
    fin(G, .3);
    return G;
  }

  // ---------- touch-ups for the close ones: rim and selective outline on the approved sprite ----------
  // The sprite's lit-side Peat outline becomes a dark tone of its neighbor; a light rim runs on its upper-left edge.
  function touchUp(canvas) {
    const w = canvas.width, h = canvas.height, d = canvas.getContext('2d').getImageData(0, 0, w, h).data, G = grid(w, h);
    const hex = i => d[i + 3] < 128 ? null : '#' + [0, 1, 2].map(k => d[i + k].toString(16).padStart(2, '0')).join('');
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) G.g[y][x] = hex((y * w + x) * 4);
    const isPeat = c => c && parseInt(c.slice(1, 3), 16) < 40 && parseInt(c.slice(3, 5), 16) < 36;
    const swap = [];
    for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) { if (!isPeat(G.g[y][x])) continue;
      const outL = !G.g[y][x - 1], outU = !G.g[y - 1][x], inR = G.g[y][x + 1], inD = G.g[y + 1][x];
      if (outL && inR && !isPeat(inR)) swap.push([x, y, dark(inR)]); else if (outU && inD && !isPeat(inD)) swap.push([x, y, dark(inD)]); }
    swap.forEach(([x, y, c]) => G.g[y][x] = c);
    const rim = []; for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) { const v = G.g[y][x]; if (!v || isPeat(v)) continue;
      const pl = G.g[y][x - 1], pu = G.g[y - 1][x]; if ((pl && isPeat(pl) || !pl || swap.some(s => s[0] === x - 1 && s[1] === y)) && x < w * .6 || (!pu || swap.some(s => s[0] === x && s[1] === y - 1)) && y < h * .5) rim.push([x, y, v]); }
    rim.forEach(([x, y, v]) => G.g[y][x] = mix(v, '#fff4dc', .3));
    return G;
  }

  const toCanvas = (G) => { const c = document.createElement('canvas'); c.width = G.w; c.height = G.h; G.draw(c.getContext('2d'), 0, 0, 1); return c; };
  const lampwalkers = () => { const one = lampwalker(), G = grid(96, 48); for (const ox of [0, 35, 70]) for (let y = 0; y < 48; y++) for (let x = 0; x < 26; x++) if (one.g[y][x]) G.g[y][ox + x] = one.g[y][x]; return G; };
  window.CREATURES_V1 = {
    noonwife: () => toCanvas(noonwife()), counter: () => toCanvas(counter()), candle: () => toCanvas(candle()),
    lampwalkers: () => toCanvas(lampwalkers()), severa: () => toCanvas(severa()),
    touch: name => { const s = window.RLArt && RLArt.sprite(name); return s ? toCanvas(touchUp(s)) : null; },
  };
})();
