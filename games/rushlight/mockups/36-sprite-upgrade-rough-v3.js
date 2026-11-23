// Rushlight sprite upgrade, rough mockup v3 (Nov 23, 2026; v2 plus a slimmer fox face and redrawn back views
// with ears joined to the head, after Keegan's notes): all six slice species at the level Keegan approved in v1
// (hare and badger), as portraits, map sprites and battle back views.
// Drawn in code. Changes from the approved species sheet (rushlight-sprites-species-v1):
//   - volume: every rounded part (head, muzzle, ears, cheeks, body) is shaded from its shape with a light from the
//     upper left, in a 4-step ramp (light, base, shade, deep), instead of a flat fill with one dark stripe
//   - fur: a tufted silhouette on the cheeks and crown, and clumps in the shade
//   - selective outline: Peat on the shadow side and bottom, a dark tone of the part's own color on the lit side
//   - a one-pixel rim light on the lit edge of portraits (studio art-style, Craft)
//   - real period clothes: collar, shirt, a strap with a buckle, seams and folds; the badger's quilted jack
//   - a lit backing so the outline reads (studio ui, Screen craft)
//   - map sprites: 3-tone shading, separate arms with hands, a belt, boots with a highlight, shaded ears
// Faces keep the bible's rules: small dark eyes, no glints, real muzzles (Art, Faces).
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

  // palettes
  const HARE = { fur: ramp('#8a6a44', '#f2d9a8'), pale: ramp('#d6c6a4'), inner: ramp('#b8907a'), tip: ramp('#2a221c'), coat: ramp('#56623a', '#c8d49a'), shirt: ramp('#d8ccb0'), strap: ramp('#6a4a32', '#c89a6a'), metal: ramp('#b8913a', '#ffe9a8'), nose: '#4a3226' };
  const MOUSE = { fur: ramp('#9a8468', '#f0dcb8'), pale: ramp('#d6c6a4'), inner: ramp('#c79a8a', '#f2d0c0'), coat: ramp('#56623a', '#c8d49a'), shirt: ramp('#d8ccb0'), strap: ramp('#6a4a32', '#c89a6a'), metal: ramp('#b8913a', '#ffe9a8'), nose: '#b06e6a', tail: '#b48a7a' };
  const RAT = { fur: ramp('#857b72', '#d8d0c4'), pale: ramp('#b3aa98', '#f2ead6'), inner: ramp('#b48a7a', '#f2d0c0'), coat: ramp('#6a4a32', '#c8946a'), shirt: ramp('#d8ccb0'), strap: ramp('#3e2a1c', '#9a6a44'), metal: ramp('#8a8274', '#e0dcd0'), nose: '#c48a86', tail: '#b48a7a' };
  const HEDGE = { fur: ramp('#b89c76', '#f2dcb4'), pale: ramp('#e0d0b0', '#fff4dc'), spine: ramp('#6a5236', '#c8a878'), coat: ramp('#3b4757', '#8a9cb4'), shirt: ramp('#d8ccb0'), strap: ramp('#6a4a32', '#c89a6a'), metal: ramp('#b8913a', '#ffe9a8'), nose: PEAT };
  const FOX = { fur: ramp('#b8582a', '#f2a060'), white: ramp('#e6dcc4', '#ffffff'), black: ramp('#2e2a26', '#6a625a'), coat: ramp('#7a766e', '#d8d2c4'), shirt: ramp('#d8ccb0'), strap: ramp('#3e2a1c', '#9a6a44'), metal: ramp('#8a8274', '#e0dcd0'), nose: PEAT, tail: '#b8582a' };
  const BADGER = { fur: ramp('#7a766e', '#d8d2c4'), white: ramp('#e6dcc4', '#ffffff'), black: ramp('#2e2a26', '#6a625a'), coat: ramp('#9a4528', '#e0905e'), shirt: ramp('#d8ccb0'), strap: ramp('#3e2a1c', '#9a6a44'), metal: ramp('#8a8274', '#e0dcd0'), nose: PEAT };

  function backing(G) { for (let y = 0; y < 64; y++) { const t = y / 63; G.r(0, y, 64, 1, mix('#8a7458', '#4a3e30', t)); } for (let x = 0; x < 64; x++) for (let y = 0; y < 64; y++) { const d = Math.hypot(x - 22, y - 18); if (d <= 24) G.p(x, y, mix(mix('#8a7458', '#4a3e30', y / 63), '#a8906c', (1 - d / 24) * .8)); } }

  function shoulders(F, P, o = {}) {
    // coat body: a wide shaded dome with a collar and seams
    F.vol(32, 66, 29, 16, P.coat, { clump: false });
    F.line(14, 56, 18, 63, P.coat[3]); F.line(50, 56, 46, 63, P.coat[3]);
    // shirt opening
    F.tri([[25, 50], [32, 62], [39, 50]], P.shirt[1]); F.tri([[32, 50], [32, 62], [39, 50]], P.shirt[2]);
    F.line(25, 50, 32, 62, P.shirt[3]); F.line(39, 50, 32, 62, P.shirt[3]);
    // collar flaps
    F.tri([[19, 50], [26, 49], [28, 58]], P.coat[0]); F.tri([[45, 50], [38, 49], [36, 58]], P.coat[2]);
    F.line(19, 50, 28, 58, P.coat[3]); F.line(45, 50, 36, 58, P.coat[3]);
    // strap across the chest with a buckle
    if (o.strap !== false) { for (let i = 0; i < 22; i++) { F.r(40 - i, 53 + i * .55, 3, 2, i < 8 ? P.strap[0] : P.strap[1]); F.p(40 - i, 55 + i * .55, P.strap[3]); }
      F.r(29, 58, 5, 4, P.metal[3]); F.r(30, 59, 3, 2, P.metal[0]); F.p(31, 59, P.metal[1]); }
  }

  function harePortrait() {
    const P = HARE, G = grid(64, 64), F = grid(64, 64); backing(G);
    // ears: long, tilted a little apart, with dark tips and a shaded inner
    F.vol(24, 17, 5, 14, P.fur, {}); F.vol(41, 18, 5, 14, P.fur, { dark: 1 });
    F.vol(24, 19, 2.5, 10, P.inner); F.vol(41, 20, 2.5, 10, P.inner, { dark: 1 });
    for (let y = 0; y < 9; y++) for (let x = 16; x < 50; x++) { const c = F.g[y][x]; if (c) { const i = P.fur.indexOf(c), j = P.inner.indexOf(c); F.p(x, y, P.tip[Math.max(0, Math.min(3, (i >= 0 ? i : j >= 0 ? j : 1)))]); } }
    // neck and shoulders
    F.vol(32, 49, 9, 9, P.fur, { dark: 1 }); F.vol(32, 52, 5, 6, P.pale, { dark: 1 });
    shoulders(F, P);
    // head: a soft egg with fur tufts at the cheeks
    F.vol(32, 36, 14, 12.5, P.fur, { fur: 9, clump: true });
    F.vol(20, 40, 4, 4, P.fur, { fur: 7 }); F.vol(44, 40, 4, 4, P.fur, { dark: 1, fur: 7 });
    // muzzle and chin
    F.vol(32, 43, 7.5, 5.5, P.pale); F.vol(32, 48, 4, 2.5, P.pale, { dark: 1 });
    // brow ridge
    F.line(21, 31, 26, 30, P.fur[2]); F.line(38, 30, 43, 31, P.fur[3]);
    // eyes: dark, set to the sides, a lid line above, no glints
    F.r(22, 33, 3, 3, PEAT); F.r(40, 33, 3, 3, PEAT); F.p(24, 33, '#3a2a20'); F.p(40, 33, '#3a2a20');
    F.line(21, 32, 25, 32, P.fur[3]); F.line(39, 32, 43, 32, P.fur[3]);
    // nose: a soft Y, split lip
    F.r(30, 40, 4, 2, P.nose); F.p(31, 40, '#6a4a3a'); F.r(31, 42, 2, 2, '#3a2a20'); F.p(30, 44, '#3a2a20'); F.p(33, 44, '#3a2a20');
    // whiskers, faint
    [[23, 43, 16, 41], [23, 45, 16, 46], [41, 43, 48, 41], [41, 45, 48, 46]].forEach(([a, b, c, d]) => F.line(a, b, c, d, '#a89e8a'));
    F.rim(.45); F.outline(dark);
    return { draw(ctx, ox, oy, s) { G.draw(ctx, ox, oy, s); F.draw(ctx, ox, oy, s); } };
  }

  function badgerPortrait() {
    const P = BADGER, G = grid(64, 64), F = grid(64, 64); backing(G);
    // small round ears with pale rims
    F.vol(19.5, 27, 3.5, 3.5, P.fur); F.vol(44.5, 27, 3.5, 3.5, P.fur, { dark: 1 }); F.vol(19.5, 26, 1.5, 1.5, P.white, { dark: 1 }); F.vol(44.5, 26, 1.5, 1.5, P.white, { dark: 2 });
    // thick neck, quilted jack
    F.vol(32, 50, 13, 9, P.fur, { dark: 1, clump: true });
    shoulders(F, P, { strap: true });
    for (let y = 55; y < 64; y += 3) for (let x = 6; x < 58; x++) { const c = F.g[y][x]; if (P.coat.includes(c) && (x < 24 || x > 41)) F.p(x, y, P.coat[c === P.coat[0] ? 1 : 3]); }
    for (let x = 8; x < 58; x += 5) for (let y = 54; y < 64; y++) { const c = F.g[y][x]; if (P.coat.includes(c) && (x < 24 || x > 41)) F.p(x, y, P.coat[3]); }
    // broad head: white over the crown and muzzle, grey only on the outer cheeks
    F.vol(32, 35, 15, 13, P.white, { fur: 7 });
    F.vol(32, 44, 8, 6, P.white, {});
    // the two black stripes from behind the ears, over the eyes, narrowing to the snout
    for (let y = 22; y <= 46; y++) { const t = (y - 22) / 24, off = Math.round(3.5 + (1 - t) * 1.5), w = Math.max(2, Math.round(7 - t * 4.5));
      for (let i = 0; i < w; i++) { if (F.g[y][32 - off - w + i]) F.p(32 - off - w + i, y, i === 0 ? P.black[0] : P.black[1]); if (F.g[y][32 + off + i]) F.p(32 + off + i, y, P.black[i > w - 2 ? 3 : 2]); } }
    // eyes inside the stripes: tiny, dark brown on black, a lighter lid
    F.r(24, 34, 2, 2, '#5a4636'); F.r(38, 34, 2, 2, '#5a4636'); F.p(24, 33, P.black[0]); F.p(39, 33, P.black[0]);
    // nose
    F.vol(32, 48, 3.5, 2.2, ['#4a443e', '#2a2420', PEAT, PEAT]); F.p(31, 47, '#6a625a');
    F.r(31, 51, 2, 1, P.fur[3]);
    F.rim(.45); F.outline(dark);
    return { draw(ctx, ox, oy, s) { G.draw(ctx, ox, oy, s); F.draw(ctx, ox, oy, s); } };
  }


  function whiskers(F, y, c) { [[-9, 0, -17, -2], [-9, 2, -17, 3], [9, 0, 17, -2], [9, 2, 17, 3]].forEach(([a, b, cc, d]) => F.line(32 + a, y + b, 32 + cc, y + d, c)); }
  function eyes(F, y, dx, lid, w = 2, h = 2) { F.r(32 - dx - w + 1, y, w, h, PEAT); F.r(32 + dx, y, w, h, PEAT); F.line(32 - dx - w, y - 1, 32 - dx + 1, y - 1, lid); F.line(32 + dx - 1, y - 1, 32 + dx + w, y - 1, lid); }
  function finish(G, F) { F.rim(.45); F.outline(dark); return { draw(ctx, ox, oy, s) { G.draw(ctx, ox, oy, s); F.draw(ctx, ox, oy, s); } }; }

  function mousePortrait() {
    const P = MOUSE, G = grid(64, 64), F = grid(64, 64); backing(G);
    F.vol(18, 24, 10, 10, P.fur); F.vol(46, 24, 10, 10, P.fur, { dark: 1 }); F.vol(18, 25, 6.5, 6.5, P.inner); F.vol(46, 25, 6.5, 6.5, P.inner, { dark: 1 });
    F.vol(32, 50, 8, 8, P.fur, { dark: 1 }); shoulders(F, P);
    F.vol(32, 38, 12.5, 11, P.fur, { fur: 9, clump: true });
    F.vol(32, 45, 6.5, 5, P.pale); F.vol(32, 49, 3.5, 2, P.pale, { dark: 1 });
    eyes(F, 35, 6, P.fur[3], 3, 3);
    F.r(30, 42, 4, 2, P.nose); F.p(31, 42, '#d89a90'); F.r(31, 44, 2, 1, '#3a2a20'); F.p(30, 46, '#3a2a20'); F.p(33, 46, '#3a2a20');
    whiskers(F, 44, '#a89e8a');
    return finish(G, F);
  }
  function ratPortrait() {
    const P = RAT, G = grid(64, 64), F = grid(64, 64); backing(G);
    F.vol(20, 25, 5.5, 6, P.fur); F.vol(44, 25, 5.5, 6, P.fur, { dark: 1 }); F.vol(20, 26, 3.5, 4, P.inner); F.vol(44, 26, 3.5, 4, P.inner, { dark: 1 });
    F.vol(32, 50, 8, 8, P.fur, { dark: 1 }); shoulders(F, P);
    F.vol(32, 35, 12, 11, P.fur, { fur: 10, clump: true });
    F.vol(32, 44, 7, 8, P.fur, { clump: true }); F.vol(32, 48, 4.5, 4.5, P.pale);
    eyes(F, 33, 6, P.fur[3]);
    F.r(30, 49, 4, 2, P.nose); F.p(31, 49, '#e0aaa6'); F.r(31, 51, 2, 1, '#3a2a20');
    whiskers(F, 49, '#a89e8a');
    return finish(G, F);
  }
  function hedgePortrait() {
    const P = HEDGE, G = grid(64, 64), F = grid(64, 64); backing(G);
    F.vol(32, 50, 10, 8, P.fur, { dark: 1 }); shoulders(F, P);
    // spines: a shaded dome over the crown and down the sides, spiky at the edge, streaked with pale tips
    const cx = 32, cy = 36;
    for (let y = 10; y < 50; y++) for (let x = 8; x < 57; x++) {
      const dx = (x + .5 - cx) / 21, dy = (y + .5 - cy) / 22, a = Math.atan2(dy, dx), spike = (Math.round(a * 14) % 2 ? .1 : 0);
      const d = dx * dx + dy * dy; if (d > 1 + spike || y > 47) continue;
      const z = Math.sqrt(Math.max(0, 1 - Math.min(d, 1))), v = dx * L[0] + dy * L[1] + z * L[2];
      let i = v > .55 ? 0 : v > .25 ? 1 : v > -.05 ? 2 : 3; if (d > .92) i = Math.min(3, i + 1);
      const streak = ((x * 2 + y * 3) % 7 === 0) || ((x + y * 2) % 9 === 0);
      F.p(x, y, streak && i < 3 ? (i === 0 ? '#e8d4a8' : P.spine[0]) : ((x * 3 + y) % 5 === 0 ? P.spine[Math.min(3, i + 1)] : P.spine[i])); }
    F.vol(32, 41, 10.5, 9, P.fur, { fur: 8 }); F.vol(32, 47, 6, 5, P.pale); F.vol(32, 50, 3, 2.5, P.pale, { dark: 1 });
    eyes(F, 38, 5, P.fur[3]);
    F.vol(32, 51, 2.2, 1.8, ['#4a443e', '#2a2420', PEAT, PEAT]);
    return finish(G, F);
  }
  function foxPortrait() {
    const P = FOX, G = grid(64, 64), F = grid(64, 64); backing(G);
    // a white chest ruff into the coat
    F.vol(32, 52, 8, 7, P.white, { dark: 1, fur: 7 }); shoulders(F, P);
    // a narrow head: the crown, then a long tapering snout
    F.vol(32, 32, 12, 9.5, P.fur, { fur: 9 });
    // big ears drawn after the crown, their bases sunk into it so they grow out of the skull:
    // rust outside, dark inner, black tips, and fur from the crown running up into each base
    F.tri([[19, 31], [20, 7], [31, 25]], P.fur[1]); F.tri([[33, 25], [44, 7], [45, 31]], P.fur[2]);
    F.tri([[19, 31], [20, 7], [22, 27]], P.fur[0]); F.tri([[42, 27], [44, 7], [45, 31]], P.fur[3]);
    F.tri([[21.5, 23], [21, 13], [27, 22]], P.black[1]); F.tri([[37, 22], [43, 13], [42.5, 23]], P.black[2]);
    F.tri([[19, 12], [20, 7], [22, 12]], P.black[1]); F.tri([[42, 12], [44, 7], [45, 12]], P.black[2]);
    F.p(22, 23, P.fur[1]); F.p(23, 23, P.fur[1]); F.p(41, 23, P.fur[2]); F.p(40, 23, P.fur[2]); // fur tufts over the inner ear base
    F.tri([[21, 33], [32, 52], [43, 33]], P.fur[1]); F.tri([[32, 33], [32, 52], [43, 33]], P.fur[2]);
    F.tri([[21, 33], [32, 52], [24, 33]], P.fur[0]);
    // white cheeks and lower jaw along the sides of the snout
    F.tri([[20, 36], [29, 40], [31, 51]], P.white[0]); F.tri([[44, 36], [35, 40], [33, 51]], P.white[2]);
    F.tri([[20, 36], [24, 37], [31, 51]], P.white[1]);
    // a few cheek tufts
    F.p(19, 37, P.white[1]); F.p(18, 38, P.white[2]); F.p(45, 37, P.white[2]); F.p(46, 38, P.white[3]);
    // eyes: almond, dark, slanted with a dark line outward; no glints
    F.r(25, 32, 3, 2, PEAT); F.r(37, 32, 3, 2, PEAT); F.p(24, 31, P.black[1]); F.p(40, 31, P.black[1]); F.p(28, 33, P.fur[3]); F.p(36, 33, P.fur[3]);
    // nose at the tip of the snout, a dark mouth line
    F.vol(32, 51, 2.5, 1.8, ['#4a443e', '#2a2420', PEAT, PEAT]); F.p(32, 53, P.white[3]);
    return finish(G, F);
  }
  const PORTRAITS = { hare: harePortrait, badger: badgerPortrait, mouse: mousePortrait, rat: ratPortrait, hedgehog: hedgePortrait, fox: foxPortrait };
  const PAL = { hare: HARE, badger: BADGER, mouse: MOUSE, rat: RAT, hedgehog: HEDGE, fox: FOX };
  const HT = { mouse: 'small', rat: 'small', hare: 'mid', hedgehog: 'mid', badger: 'tall', fox: 'tall' };

  // map sprites, 14 x 26, facing down
  function mapSprite(k) {
    const P = PAL[k], G = grid(14, 26), sz = HT[k];
    const legH = sz === 'tall' ? 4 : 3, bodyH = sz === 'small' ? 6 : sz === 'mid' ? 8 : 10, headH = sz === 'small' ? 6 : sz === 'mid' ? 7 : 8;
    const legY = 26 - legH, bodyY = legY - bodyH, headY = bodyY - headH + 1;
    // tails behind
    if (k === 'mouse' || k === 'rat') for (let i = 0; i < 5; i++) G.p(11 + (i > 2 ? 1 : 0), bodyY + bodyH - 2 + i - (i > 3 ? 1 : 0), P.tail);
    if (k === 'fox') { G.r(10, bodyY + bodyH - 3, 3, 4, P.fur[2]); G.r(11, bodyY + bodyH, 2, 2, P.white[1]); }
    // boots
    G.r(4, legY, 2, legH, '#3a3028'); G.r(8, legY, 2, legH, '#2a221c'); G.p(4, 25, '#5a4a3a'); G.p(8, 25, '#3a3028'); G.r(4, legY, 2, 1, '#4a3e32');
    // body
    for (let y = bodyY; y < legY; y++) for (let x = 3; x < 11; x++) G.p(x, y, x < 5 ? P.coat[0] : x < 8 ? P.coat[1] : P.coat[2]);
    G.r(3, legY - 1, 8, 1, P.coat[3]);
    const by = bodyY + Math.floor(bodyH / 2); G.r(3, by, 8, 1, P.strap[2]); G.p(6, by, P.metal[0]); G.p(7, by, P.metal[2]);
    G.r(6, bodyY, 2, 2, P.shirt[1]); G.p(7, bodyY + 1, P.shirt[2]);
    if (k === 'hedgehog') { G.r(2, bodyY, 10, 2, P.spine[2]); G.r(2, bodyY, 4, 1, P.spine[1]); }
    // arms with hands
    const al = bodyH - 2; G.r(2, bodyY + 1, 1, al, P.coat[0]); G.r(11, bodyY + 1, 1, al, P.coat[2]); G.p(2, bodyY + al + 1, P.fur[1]); G.p(11, bodyY + al + 1, P.fur[2]);
    // head
    for (let y = headY; y < headY + headH; y++) for (let x = 3; x < 11; x++) G.p(x, y, (x < 5 || y === headY) ? P.fur[0] : x > 8 ? P.fur[2] : P.fur[1]);
    G.p(3, headY, null); G.p(10, headY, null);
    const ey = headY + Math.floor(headH / 2) - 1, mz = headY + headH - 3;
    if (k === 'hare') { G.r(4, headY - 7, 2, 7, P.fur[0]); G.r(8, headY - 7, 2, 7, P.fur[2]); G.r(5, headY - 6, 1, 5, P.inner[1]); G.r(8, headY - 6, 1, 5, P.inner[2]); G.r(4, headY - 7, 2, 2, P.tip[1]); G.r(8, headY - 7, 2, 2, P.tip[2]); }
    if (k === 'mouse') { G.r(1, headY - 3, 4, 4, P.fur[0]); G.r(9, headY - 3, 4, 4, P.fur[2]); G.r(2, headY - 2, 2, 2, P.inner[1]); G.r(10, headY - 2, 2, 2, P.inner[2]); G.p(1, headY - 3, null); G.p(12, headY - 3, null); }
    if (k === 'rat') { G.r(2, headY - 2, 3, 3, P.fur[1]); G.r(9, headY - 2, 3, 3, P.fur[2]); G.p(3, headY - 1, P.inner[1]); G.p(10, headY - 1, P.inner[2]); }
    if (k === 'hedgehog') { G.r(2, headY - 2, 10, 4, P.spine[1]); for (let i = 0; i < 5; i++) G.p(3 + i * 2, headY - 3, P.spine[i < 2 ? 0 : 2]); for (let i = 0; i < 4; i++) G.p(4 + i * 2, headY - 1, P.spine[0]); G.r(10, headY - 2, 2, 4, P.spine[3]); G.r(2, headY + 2, 1, 3, P.spine[1]); G.r(11, headY + 2, 1, 3, P.spine[3]); }
    if (k === 'fox') { G.tri([[3, headY + 1], [4, headY - 3], [6, headY + 1]], P.fur[0]); G.tri([[8, headY + 1], [10, headY - 3], [11, headY + 1]], P.fur[2]); G.p(4, headY - 2, PEAT); G.p(10, headY - 2, PEAT); G.r(3, mz, 8, 3, P.white[1]); G.p(3, mz, P.white[0]); G.r(5, mz, 4, 1, P.fur[1]); G.p(6, headY + headH - 2, P.fur[1]); }
    if (k === 'badger') { G.r(3, headY - 1, 2, 2, P.fur[1]); G.r(9, headY - 1, 2, 2, P.fur[2]);
      for (let y = headY; y < headY + headH; y++) { G.p(3, y, P.white[0]); G.p(4, y, P.black[1]); G.p(5, y, P.black[2]); G.p(8, y, P.black[2]); G.p(9, y, P.black[3]); G.p(10, y, P.white[2]); G.p(6, y, P.white[0]); G.p(7, y, P.white[1]); }
      G.r(4, headY + headH - 2, 6, 2, P.white[1]); G.p(4, headY + headH - 2, P.white[0]); G.p(9, headY + headH - 1, P.white[2]); }
    if (k === 'mouse' || k === 'rat' || k === 'hare') { G.r(5, mz, 4, 3, P.pale[1]); G.p(5, mz, P.pale[0]); G.p(8, mz + 1, P.pale[2]); G.p(6, mz, P.nose); G.p(7, mz, P.nose); }
    if (k === 'hedgehog') { G.r(5, mz, 4, 3, P.pale[1]); G.p(5, mz, P.pale[0]); G.r(6, mz + 2, 2, 1, PEAT); }
    if (k === 'badger' || k === 'fox') G.r(6, headY + headH - 1, 2, 1, PEAT);
    if (k === 'badger') { G.p(5, ey, '#5a4636'); G.p(8, ey, '#5a4636'); } else { G.p(4, ey, PEAT); G.p(9, ey, PEAT); G.p(5, ey, PEAT); G.p(8, ey, PEAT); }
    return G.outline(dark);
  }

  // battle back view, waist up, 30 x 40: shoulders, a neck, a round head seen from behind, ears rooted in the head
  function backView(k) {
    const P = PAL[k], G = grid(30, 40), sc = { small: .82, mid: .92, tall: 1 }[HT[k]];
    const sh = Math.round(15 * sc), hr = Math.round(8.5 * sc + .5), bw = Math.round(24 * sc), by = 40 - sh, cx = 15, cy = by - hr + 3;
    const furV = { fur: 0 };
    // tails behind the body
    if (k === 'mouse' || k === 'rat') for (let i = 0; i < 8; i++) G.p(cx + bw / 2 + 1 + (i > 5 ? 1 : 0), 39 - i, i % 2 ? P.tail : mix(P.tail, PEAT, .2));
    if (k === 'fox') { G.vol(cx + bw / 2 + 1, 35, 3.5, 5, P.fur, {}); G.vol(cx + bw / 2 + 2, 39, 2.5, 2, P.white, {}); }
    // ears first, so the head covers their roots
    if (k === 'hare') { G.vol(cx - 3, cy - hr - 4, 2.2, 8.5, P.fur, {}); G.vol(cx + 3, cy - hr - 4, 2.2, 8.5, P.fur, { dark: 1 });
      for (let y = 0; y < cy - hr - 9; y++) for (let x = 0; x < 30; x++) { const c = G.g[y][x]; if (c && P.fur.includes(c)) G.p(x, y, P.tip[Math.min(3, P.fur.indexOf(c))]); } }
    // ear backs: a deep-tone rim, then the shaded disc, set a little darker than the skull so they read apart
    const earRamp = [P.fur[1], P.fur[2], P.fur[3], mix(P.fur[3], PEAT, .5)];
    const ear = (x, y, rx, ry, rim) => { for (let yy = 0; yy < 40; yy++) for (let xx = 0; xx < 30; xx++) { const dx = (xx + .5 - x) / (rx + 1), dy = (yy + .5 - y) / (ry + 1); if (dx * dx + dy * dy <= 1) G.p(xx, yy, earRamp[3]); }
      G.vol(x, y, rx, ry, earRamp, {}); if (rim) G.p(Math.round(x - rx * .4), Math.round(y - ry + 1), rim); };
    if (k === 'mouse') { ear(cx - hr + 1, cy - hr + 1, 4.2, 4.2); ear(cx + hr - 1, cy - hr + 1, 4.2, 4.2); }
    if (k === 'rat') { ear(cx - hr + 2, cy - hr + 2, 2.8, 2.8); ear(cx + hr - 2, cy - hr + 2, 2.8, 2.8); }
    if (k === 'badger') { ear(cx - hr + 1, cy - hr * .45, 1.6, 1.6, P.white[1]); ear(cx + hr - 1, cy - hr * .45, 1.6, 1.6, P.white[2]); }
    if (k === 'fox') { G.tri([[cx - hr + 1, cy - 1], [cx - hr + 2, cy - hr - 6], [cx - 1, cy - hr + 2]], P.black[1]); G.tri([[cx + 1, cy - hr + 2], [cx + hr - 2, cy - hr - 6], [cx + hr - 1, cy - 1]], P.black[2]);
      G.tri([[cx - hr + 1, cy - 1], [cx - hr + 2, cy - hr - 1], [cx - 2, cy - hr + 2]], P.fur[1]); G.tri([[cx + 2, cy - hr + 2], [cx + hr - 2, cy - hr - 1], [cx + hr - 1, cy - 1]], P.fur[2]); }
    // shoulders and coat
    G.vol(cx, by + sh + 1, bw / 2 + 1, sh + 1, P.coat, {});
    G.line(cx, by + 2, cx, 39, P.coat[2]);
    // neck
    if (k !== 'hedgehog') G.vol(cx, by + 1, hr * .62, 3, P.fur, { dark: 1 });
    // head from behind
    if (k === 'hedgehog') { const R = hr + 3;
      for (let y = 0; y < 40; y++) for (let x = 0; x < 30; x++) { const top = y < cy + 2, dx = (x + .5 - cx) / R, dy = top ? (y + .5 - (cy + 2)) / (R + 1) : 0, hw = top ? 1 : 1 - (y - cy - 2) / (by + 6 - cy) * .25;
        const a = Math.atan2(dy, dx), sp = Math.round(a * 12) % 2 ? .12 : 0, d = top ? dx * dx + dy * dy : (Math.abs(dx) / hw) ** 2; if (d > 1 + sp || y > by + 5) continue;
        const z = Math.sqrt(Math.max(0, 1 - Math.min(d, 1))), v = dx * L[0] + (top ? dy : .2) * L[1] + z * L[2]; let i = v > .55 ? 0 : v > .25 ? 1 : v > -.05 ? 2 : 3; if (d > .9) i = Math.min(3, i + 1);
        G.p(x, y, ((x * 2 + y * 3) % 7 === 0 && i < 3) ? P.spine[0] : P.spine[i]); } }
    else { // a deep-tone ring first, so ears read as their own shapes where they meet the skull
      if (k !== 'hare') for (let y = 0; y < 40; y++) for (let x = 0; x < 30; x++) { const dx = (x + .5 - cx) / (hr + 1), dy = (y + .5 - cy) / (hr * .95 + 1); if (dx * dx + dy * dy <= 1 && y < cy) G.p(x, y, P.fur[3]); }
      if (k === 'badger') G.vol(cx, cy + 1, hr * .9, hr * 1.02, P.fur, {}); else G.vol(cx, cy, hr, hr * .95, P.fur, {}); // a round head (the badger's longer, like its wedge face), a few tufts at the nape
      [[-3, 1], [-1, 2], [2, 1], [4, 0]].forEach(([dx, dy]) => G.p(cx + dx, cy + hr * .95 + dy - 1, P.fur[2])); }
    if (k === 'badger') for (let y = Math.round(cy - hr); y < by + 1; y++) { const t = (y - (cy - hr)) / (by + 1 - (cy - hr));
      for (let i = -4; i < 4; i++) { if (!G.g[y] || !G.g[y][cx + i]) continue; const a = Math.abs(i + .5);
        if (a < 1) G.p(cx + i, y, P.white[i < 0 ? 0 : 1]); else if (a < 3 && t < .7) G.p(cx + i, y, P.black[i < 0 ? 1 : 2]); } }
    if (k === 'fox') { G.p(cx - 1, by + 2, P.white[1]); G.p(cx, by + 2, P.white[2]); }
    if (k === 'fox') [[-hr, 2], [-hr, 3], [-hr + 1, 4], [hr - 1, 2], [hr - 1, 3], [hr - 2, 4]].forEach(([dx, dy], i) => G.p(cx + dx, cy + dy, P.white[i < 3 ? 1 : 2])); // cheek ruff showing past the skull
    // the pack strap over the left shoulder and a satchel on the right hip
    G.line(cx - 6, by + 1, cx + 5, 39, P.strap[2]); G.line(cx - 5, by + 1, cx + 6, 39, P.strap[1]);
    G.r(cx + 3, by + 7, 7, 6, P.strap[2]); G.r(cx + 3, by + 7, 7, 1, P.strap[0]); G.r(cx + 9, by + 7, 1, 6, P.strap[3]); G.p(cx + 6, by + 9, P.metal[0]);
    G.rim(.4); return G.outline(dark);
  }

  const toCanvas = (w, h, fn) => { const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d')); return c; };
  window.SPRITE_V3 = {
    portrait: k => toCanvas(64, 64, x => PORTRAITS[k]().draw(x, 0, 0, 1)),
    map: k => toCanvas(14, 26, x => mapSprite(k).draw(x, 0, 0, 1)),
    back: k => toCanvas(30, 40, x => backView(k).draw(x, 0, 0, 1)),
  };
})();
