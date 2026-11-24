// Rushlight · art/draw/creatures-v2.js — the drawing code for the creature sprites v2 (spec 008, 8A), filed in the Asset Library
// as rushlight-sprites-<name>-v2 beside each v1 (add-only). The game never loads this file: tools/art-pages.js runs it to make the
// library pages, and tools/import-art.js copies each page's drawing into art/creatures.js, as for v1.
// Every creature keeps its approved design, size and rules (bible, Art, creature batches 1 and 2); only the craft changes, to the
// studio Quality bar (four-tone volume lit from the upper left, the selective outline, a rim), after mockups/37-creatures-upgrade-rough-v1.js
// ("Everything else is good"; Severa's wings a fan of flight feathers, "These are great!", Nov 23).
// Each is drawn natively at 1.5× its approved size (spec 008: the foes at 1.5×, drawn natively so their pixels match the backdrop).
//   Redrawn: the Noonwife, the Counter, the Corpse-candle, the Lampwalkers, Severa the owl.
//   Touched up (rim and selective outline on the approved v1, redrawn at 1.5×): the hedge cat, the Hollow Monk, the rooks, the Withy Hag.
// Needs engine/pixgrid.js (StudioPix). window.RL_CREATURES_V2.<name>() returns a pixel grid; .touch(canvas) for the touch-ups.
(function () {
  const X = StudioPix, PEAT = X.PEAT, mix = X.mix, ramp = X.ramp, S = 1.5;
  const dark = c => mix(c, PEAT, .55);
  const grid = (w, h) => X.grid(w, h, S);
  // a single native pixel at a design point (for fine strokes: feathers, the shimmer)
  const dot = (G, x, y, c) => G.set(Math.floor((x + .5) * S), Math.floor((y + .5) * S), c);

  // palettes (earth palette; the Corpse-candle's cold blue is its own, as approved Nov 21)
  const BONE = ramp('#e6dcc2', '#fffaf0'), VOID = '#0e0c0a';
  const SKIN = ramp('#9a9288', '#e4dccc'), GUM = ramp('#b8706a', '#f0b0a8'), TOOTH = ramp('#ddd2b8', '#fffaf0');
  const STOAT = ramp('#7a5634', '#d8a870'), CREAM = ramp('#d6c29c'), TUNIC = ramp('#5a4a3a', '#a89070'), ROPE = ramp('#9a7e52', '#e0c890');
  const COLD = ['#e8fbff', '#9ad6ec', '#4a86a8', '#20384a'];
  const SMOCK = ramp('#7a766c', '#d4d0c4'), HOOD = ramp('#5e5246', '#b4a48c'), GREYSKIN = ramp('#8e8a84', '#d8d2c8');
  const BRASS = ['#fff0b0', '#d8b04a', '#9a7428', '#5a4018'], MUD = ramp('#5a4630');
  const BUFF = ramp('#c8964a', '#ffe0a0'), VEIL = ramp('#a49a90', '#e8e2d8'), FACE = ramp('#eee6d6', '#ffffff'), RUSTR = ramp('#9a5a30'), BEAM = ramp('#6a4c30', '#c89a68');
  const fin = (G, k) => G.rim(k == null ? .35 : k).outline(dark);

  // ---------- the Noonwife (38 × 61 → 57 × 92): something missing, wrong physics, Bone on the robe ----------
  // a tall hooded woman in a Bone robe hanging in hard folds; the face a flat void (the one flat thing, on purpose: there is
  // nothing there to light). No shadow under her; heat shimmer in the air round her.
  function noonwife() {
    const G = grid(38, 61), cx = 19;
    G.shape((u, v) => v >= 14 && v < 58 && Math.abs(u - cx) <= 6 + (v - 14) / 44 * 9 + .5, (u, v) => {
      const t = (v - 14) / 44, hw = 6 + t * 9, w = (u - cx) / hw, fold = Math.sin(w * 7.5 + t * 1.5);
      let i = w < -.45 ? 0 : w < .2 ? 1 : w < .7 ? 2 : 3; if (fold > .82 && i < 3) i++; if (fold < -.9 && i > 0) i--; return BONE[i]; });
    for (let x = 4; x < 35; x++) if ((x * 7) % 5 < 2) G.p(x, 58, BONE[2]);
    G.r(15, 59, 2, 1, SKIN[1]); G.r(21, 59, 2, 1, SKIN[2]);
    G.vol(cx, 11, 8, 9, BONE, {}); G.vol(cx, 18, 9, 5, BONE, {});
    const voidIn = (u, v) => ((u - cx) / 4.6) ** 2 + ((v - 12) / 6.8) ** 2 < 1;
    G.shape(voidIn, VOID, [13, 5, 26, 20]);
    G.shape((u, v) => { const d = ((u - cx) / 5.6) ** 2 + ((v - 12) / 7.8) ** 2; return d < 1 && d > .7 && !voidIn(u, v); }, u => u < cx ? BONE[2] : BONE[3], [12, 4, 27, 21]);
    G.r(7, 36, 2, 5, SKIN[1]); G.p(7, 41, SKIN[2]); G.r(29, 36, 2, 5, SKIN[2]); G.p(30, 41, SKIN[3]);
    G.line(9, 22, 7, 35, BONE[2]); G.line(29, 22, 31, 35, BONE[3]);
    fin(G, .25);
    [[1, 18], [2, 26], [34, 20], [35, 31], [0, 34], [33, 9]].forEach(([x, y]) => { dot(G, x, y, BONE[1]); dot(G, x + .7, y, BONE[0]); dot(G, x + 1.4, y, BONE[0]); });
    return G;
  }

  // ---------- the Counter (52 × 29 → 78 × 44): a starved hound with no eyes, one mouth from snout to belly, teeth like grain ----------
  function counter() {
    const G = grid(52, 29), FAR = SKIN.map(c => mix(c, PEAT, .25));
    const leg = (x0, y0, x1, y1, x2, y2, r) => { G.line(x0, y0, x1, y1, r[2]); G.line(x0 + 1, y0, x1 + 1, y1, r[1]); G.line(x1, y1, x2, y2, r[2]); G.line(x1 + 1, y1, x2 + 1, y2, r[1]); G.p(x1, y1, r[0]); G.r(x2 - 1, y2, 3, 1, r[3]); };
    leg(19, 16, 18, 22, 17, 27, FAR); leg(42, 13, 46, 20, 44, 27, FAR);
    G.vol(29, 12, 15, 5.5, SKIN, { clump: 1 }); G.vol(42, 9, 7, 7, SKIN, { clump: 1 }); G.vol(18, 13, 6, 6, SKIN, {});
    G.vol(11, 16, 5, 3.5, SKIN, {}); G.vol(6, 18, 6, 3.2, SKIN, {});
    // ribs: curved shade lines with a lit edge, too many of them
    for (let i = 0; i < 6; i++) { const x = 20 + i * 2.6; for (let y = 9; y < 17; y++) { const xx = x + (y - 9) * .25; if (G.at(Math.round(xx), y)) { G.p(xx, y, SKIN[2]); G.p(xx - 1, y, SKIN[0]); } } }
    for (let x = 16; x < 46; x += 3) { const y = x < 36 ? 6 + Math.abs(x - 26) * .02 : 3 + Math.abs(x - 42) * .4; G.p(x, Math.round(y), SKIN[0]); G.p(x + 1, Math.round(y), SKIN[1]); }
    [[33, 13], [37, 10], [25, 15], [45, 12]].forEach(([x, y]) => { G.p(x, y, SKIN[3]); G.p(x + 1, y, SKIN[2]); G.p(x, y + 1, SKIN[2]); });
    const mouth = []; for (let x = 1; x < 36; x++) { const y = x < 12 ? 19 + x * .05 : x < 18 ? 19 - (x - 12) * .1 : 18 - (x - 18) * .05; mouth.push([x, Math.round(y)]); }
    mouth.forEach(([x, y], i) => { G.p(x, y, PEAT); G.p(x, y - 1, GUM[i % 2 ? 1 : 2]); G.p(x, y + 1, GUM[2]); if (i % 2 === 0) { G.p(x, y - 1, TOOTH[0]); G.p(x, y + 1, TOOTH[1]); } });
    G.line(48, 6, 51, 12, SKIN[2]); G.line(49, 6, 51, 10, SKIN[1]);
    fin(G, .3);
    return G;   // no eyes: the head's lit top runs unbroken to the snout
  }

  // ---------- the Corpse-candle (40 × 66 → 60 × 99): a hanged stoat walking, its chest open on a cold light ----------
  function candle() {
    const G = grid(40, 66);
    for (let y = 0; y < 12; y++) { G.p(26 + (y > 8 ? 1 : 0), y, y % 2 ? ROPE[1] : ROPE[2]); G.p(27 + (y > 8 ? 1 : 0), y, ROPE[3]); }
    const leg = (x, r) => { G.vol(x, 52, 2.2, 7, r, {}); G.vol(x, 60, 1.6, 3, STOAT, {}); G.r(x - 1, 63, 2, 2, STOAT[2]); G.p(x, 65, STOAT[3]); };
    leg(17, TUNIC.map(c => mix(c, PEAT, .1))); leg(23, TUNIC);
    G.vol(20, 36, 8.5, 11, TUNIC, { clump: 1 }); G.r(13, 44, 15, 3, TUNIC[2]);
    G.vol(11, 40, 1.6, 13, TUNIC, {}); G.vol(29, 40, 1.6, 13, TUNIC, { dark: 1 });
    G.vol(11, 55, 1.5, 3, STOAT, {}); G.vol(29, 55, 1.5, 3, STOAT, { dark: 1 }); G.p(11, 58, STOAT[2]); G.p(29, 58, STOAT[3]); G.p(10, 58, STOAT[3]);
    for (let y = 14; y < 27; y++) { const x = Math.round(21 + (26 - y) * .45); G.r(x - 2, y, 4, 1, STOAT[1]); G.p(x - 2, y, STOAT[0]); G.p(x - 1, y, STOAT[0]); G.p(x + 1, y, STOAT[2]); G.p(x, y, y > 18 ? CREAM[1] : STOAT[1]); }
    G.vol(28, 13, 6.5, 5, STOAT, { fur: 9 }); G.vol(32, 18, 3.2, 3, STOAT, {}); G.vol(33, 19.5, 2.2, 2, CREAM, {});
    G.r(33, 22, 2, 1, PEAT); G.vol(24, 9, 1.6, 1.6, STOAT, {}); G.vol(31, 8, 1.6, 1.6, STOAT, { dark: 1 });
    G.r(28, 14, 3, 1, PEAT); G.p(31, 15, STOAT[3]);
    // the open chest: the cold light inside, and its tint on the cloth and fur near it
    G.shape((u, v) => { const d = ((u - 20) / 4) ** 2 + ((v - 32) / 5.5) ** 2; return d < 3.2; }, (u, v, Xp, Yp) => {
      const d = ((u - 20) / 4) ** 2 + ((v - 32) / 5.5) ** 2; if (d < 1) return d < .2 ? COLD[0] : d < .5 ? COLD[1] : d < .8 ? COLD[2] : COLD[3];
      const c = G.g[Yp][Xp]; return c ? mix(c, COLD[1], .32 * (1 - (d - 1) / 2.2)) : null; }, [10, 22, 31, 43]);
    [[16, 28], [24, 29], [17, 37], [23, 36]].forEach(([x, y]) => G.p(x, y, TUNIC[3]));
    fin(G, .28);
    return G;
  }

  // ---------- a Lampwalker (26 × 48; three exact copies, 96 × 48 → 144 × 72): grey smocks, the same tilt, an unlit lamp drawn too well ----------
  function lampwalker() {
    const G = grid(26, 48);
    G.r(8, 43, 4, 4, MUD[2]); G.r(14, 43, 4, 4, MUD[3]); G.r(8, 43, 4, 1, MUD[1]);
    G.shape((u, v) => v >= 16 && v < 44 && Math.abs(u - 13) <= 6 + (v - 16) * .14 + .5, (u, v) => { const hw = 6 + (v - 16) * .14, w = (u - 13) / hw;
      let i = w < -.45 ? 0 : w < .25 ? 1 : w < .75 ? 2 : 3; if (Math.sin(w * 6 + v * .05) > .9 && i < 3) i++; return SMOCK[i]; });
    G.r(6, 43, 15, 1, SMOCK[3]);
    G.vol(14, 10, 7, 7.5, HOOD, { clump: 1 }); G.vol(13, 17, 8, 3, HOOD, {});
    G.vol(14.6, 11.5, 4, 4.6, GREYSKIN, {});
    G.r(12, 10, 2, 1, PEAT); G.r(16, 11, 2, 1, PEAT);
    G.vol(15.4, 14.5, 1.3, 1.6, ['#2a1e18', '#1c1814', PEAT, PEAT]);
    G.vol(9, 26, 2.6, 5, SMOCK, {}); G.vol(17, 26, 2.6, 5, SMOCK, { dark: 1 }); G.r(10, 29, 7, 2, GREYSKIN[1]);
    [[17, 36], [18, 37], [16, 38], [19, 35]].forEach(([x, y], i) => G.p(x, y, MUD[i % 2 ? 1 : 2]));
    fin(G, .25);
    // the lamp, drawn after the outline and finer than anything near it: a ring, a cap, a glass, a cage, a base
    const lx = 9, ly = 20, d = (x, y, c) => dot(G, x, y, c), dr = (x, y, w, h, c) => { for (let j = 0; j < h; j += 1 / S) for (let i = 0; i < w; i += 1 / S) d(x + i, y + j, c); };
    d(lx + 3, ly - 2, BRASS[2]); d(lx + 2, ly - 1, BRASS[2]); d(lx + 4, ly - 1, BRASS[3]);
    dr(lx + 1, ly, 5, 1, BRASS[1]); d(lx + 1, ly, BRASS[0]); d(lx + 5, ly, BRASS[3]);
    dr(lx, ly + 1, 7, 1, BRASS[2]); d(lx, ly + 1, BRASS[1]);
    for (let j = 2; j < 9; j++) { dr(lx, ly + j, 1, 1, BRASS[j < 5 ? 0 : 1]); dr(lx + 1, ly + j, 5, 1, j < 4 ? '#5a5650' : '#34302a'); dr(lx + 6, ly + j, 1, 1, BRASS[3]);
      dr(lx + 3, ly + j, .67, 1, j % 2 ? BRASS[1] : BRASS[2]); if (j === 2 || j === 3) d(lx + 1, ly + j, '#9a948a'); if (j === 5) dr(lx + 1, ly + j, 5, .67, BRASS[2]); }
    d(lx + 3, ly + 6, '#2a2018'); d(lx + 3, ly + 5, '#4a3a28');
    dr(lx - 1, ly + 9, 9, 1, BRASS[1]); d(lx - 1, ly + 9, BRASS[0]); d(lx + 7, ly + 9, BRASS[3]); dr(lx, ly + 10, 7, 1, BRASS[2]); dr(lx + 1, ly + 11, 5, 1, BRASS[3]);
    G.r(lx - 2, ly + 7, 2, 3, GREYSKIN[1]); G.r(lx + 7, ly + 7, 2, 3, GREYSKIN[2]);
    return G;
  }
  function lampwalkers() {
    const one = lampwalker(), G = grid(96, 48);
    for (const ox of [0, 35, 70]) { const OX = Math.round(ox * S); one.each((Xp, Yp, c) => { if (c) G.set(OX + Xp, Yp, c); }); }
    return G;
  }

  // ---------- Severa the owl (72 × 58 → 108 × 87): a barn owl at Mouse Guard scale, mantling on the tie beam ----------
  function severa() {
    const G = grid(72, 58);
    G.r(0, 50, 72, 6, BEAM[1]); G.r(0, 50, 72, 1, BEAM[0]); G.r(0, 54, 72, 2, BEAM[2]);
    for (let x = 3; x < 72; x += 9) G.line(x, 51, x + 4, 53, BEAM[2]);
    const hash = (x, y) => ((x * 73856093) ^ (y * 19349663)) >>> 0;
    const BAR = ramp('#a89a88', '#ece6da');
    // a mantling wing from the front: long flight feathers fan out from the shoulder like a cape, the outer primaries
    // lowest and barred grey, the inner ones golden-buff, the coverts over their roots
    const wing = side => {
      const sx = 36 + side * 7, sy = 15, n = 9, st = .5 / S;
      for (let i = 0; i < n; i++) {
        const a = (172 - i * 8.5) * Math.PI / 180, uy = Math.sin(a), ux = side < 0 ? Math.cos(a) : -Math.cos(a), len = 31 + (i > 5 ? 2 : 0) - (i < 2 ? 2 : 0);
        const px = -uy, py = ux, lit = side < 0 ? (i < 5 ? 0 : 1) : (i < 5 ? 1 : 2), barred = i < 4;
        for (let t = 0; t <= len; t += st) { const wd = t < len - 5 ? 2.6 + t * .03 : (len - t) * .6;
          for (let s = -wd; s <= wd; s += st) { const x = sx + ux * t + px * s, y = sy + uy * t + py * s; if (y > 52) continue;
            let k = lit; if (s > wd - 1.1) k = Math.min(3, lit + 2); else if (s < -wd + 1) k = Math.max(0, lit - 1);
            const r = barred && t > 12 ? BAR : BUFF; let c = r[k]; if (barred && t > 12 && Math.floor(t) % 6 < 2) c = r[Math.min(3, k + 1)];
            if (t > len - 3) c = mix(c, '#f0e6d0', .35);
            dot(G, x - .5, y - .5, c); } } }
      G.vol(sx + side * 6, 21, 11, 9, BUFF, { dark: side > 0 ? 1 : 0, fur: 11 });
      for (let r = 0; r < 3; r++) for (let x = sx + side * 6 - 10; x <= sx + side * 6 + 10; x++) { const y = 17 + r * 4 + Math.round(Math.abs(Math.sin(x * .9)) * 1.4);
        if (BUFF.includes(G.at(x, y))) G.p(x, y, BUFF[3]); }
      for (let y = 8; y < 52; y++) for (let x = 0; x < 72; x++) { const c = G.at(x, y); if (!c || !BUFF.includes(c) || Math.sign(x - 36) !== side) continue;
        if (hash(x + 7, y * 3) % 37 === 0) { G.p(x, y, FACE[0]); dot(G, x + 1, y, '#3a3028'); } } };
    wing(-1); wing(1);
    G.vol(36, 33, 10, 15, FACE.map((c, i) => i < 2 ? mix(c, '#e8d0a0', .25) : c), {});
    for (let y = 26; y < 46; y += 3) for (let x = 30; x < 43; x += 4) G.p(x + (y % 2), y, VEIL[2]);
    G.vol(36, 14, 10, 9, BUFF, { clump: 1 });
    const heart = (u, v) => { const dx = (u - 36) / 8, dy = (v - 16) / 7.5, ax = Math.abs(dx); return (dx * dx + dy * dy < 1 && dy > -.8 + ax * ax * .3) || (dy > 0 && ax < 1 - dy * .9); };
    const e = 1 / S;
    G.shape(heart, (u, v) => { const edge = !heart(u - e, v) || !heart(u + e, v) || !heart(u, v - e) || !heart(u, v + e); return edge ? RUSTR[u < 36 ? 1 : 2] : FACE[u < 34 ? 0 : u < 39 ? 1 : 2]; }, [26, 6, 46, 26]);
    G.line(36, 9, 36, 18, FACE[2]);
    G.r(31, 14, 3, 3, PEAT); G.r(39, 14, 3, 3, PEAT); G.p(31, 14, '#2e2824'); G.p(39, 14, '#2e2824');
    G.r(35, 19, 2, 2, '#c8b49a'); G.p(36, 20, '#8a7a64');
    [[31, 48], [34, 48], [39, 48], [42, 48]].forEach(([x, y]) => { G.r(x, y, 2, 3, VEIL[1]); G.p(x, y + 3, PEAT); G.p(x + 1, y + 3, '#4a4038'); });
    fin(G, .3);
    return G;
  }

  // ---------- touch-ups for the close ones (the hedge cat, the Hollow Monk, the rooks, the Withy Hag) ----------
  // The approved v1 drawn at 1.5× (its SVG is vector, so it redraws natively), then the lit-side Peat outline becomes a dark tone
  // of its neighbor, and a light rim runs along the upper-left edge. Their ramps already carry four tones.
  function touch(canvas) {
    const G = X.fromCanvas(canvas), w = G.W, h = G.H, g = G.g;
    const isPeat = c => c && parseInt(c.slice(1, 3), 16) < 40 && parseInt(c.slice(3, 5), 16) < 36;
    const swap = new Set(), sw = [];
    for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) { if (!isPeat(g[y][x])) continue;
      const outL = !g[y][x - 1], outU = !g[y - 1][x], inR = g[y][x + 1], inD = g[y + 1][x];
      if (outL && inR && !isPeat(inR)) sw.push([x, y, dark(inR)]); else if (outU && inD && !isPeat(inD)) sw.push([x, y, dark(inD)]); }
    sw.forEach(([x, y, c]) => { g[y][x] = c; swap.add(x + ',' + y); });
    const rim = [];
    for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) { const v = g[y][x]; if (!v || isPeat(v) || swap.has(x + ',' + y)) continue;
      const pl = g[y][x - 1], pu = g[y - 1][x];
      if (((!pl || isPeat(pl) || swap.has((x - 1) + ',' + y)) && x < w * .6) || ((!pu || swap.has(x + ',' + (y - 1))) && y < h * .5)) rim.push([x, y, v]); }
    rim.forEach(([x, y, v]) => g[y][x] = mix(v, '#fff4dc', .3));
    return G;
  }

  window.RL_CREATURES_V2 = { S, noonwife, counter, candle, lampwalkers, severa, touch,
    REDRAWN: ['noonwife', 'counter', 'candle', 'lampwalkers', 'severa'], TOUCHED: ['hedgecat', 'monk', 'rooks', 'hag'] };
})();
