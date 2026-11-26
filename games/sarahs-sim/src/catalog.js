// Sarah's Sim catalog: the first batch of pieces (spec 001, The starting catalog; picked for what the Philly home needs most,
// per the playtest prompt of Nov 26). One row per piece, so a new piece is a new row (spec 001, Piece data):
//   id, name (on screen), tab, w x d (tiles at turn 0), kind ('floor' | 'small' (stacks on tables, counters and shelves, or
//   stands on the floor) | 'wall' (hangs on a wall) | 'rug'), h (tallest px), parts ([name, texture]) for paint, swatches (4 to 6
//   hand-picked sets that always look good together), spots (where small things can sit: [u, v] at height top), props
//   (drawn when the piece's Props switch is on), moves (glow, sway, steam, spin, twinkle, flicker), use (what Sarah can do
//   with it in Life mode, spec 006 part B), seat/nap (where people sit and cats nap), price (read by spec 006 later).
// Drawing follows mockups/furniture-sheet-v1 (the approved style guide) and the chair rules (bible, Furniture art: arms higher
// than the seat cushion, a solid front panel under the seat, rolled arms ending in round scrolls up at the top front).
(function () {
  var line = function (c, a, b, col, w) { SS.line(c, a, b, col, w); };
  var INK = 'rgba(59,36,48,.85)';
  function R(c, x, y, w, h, col) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
  function legs(M, u0, v0, u1, v1, s, h, part, z) { [[u0, v0], [u1 - s, v0], [u0, v1 - s], [u1 - s, v1 - s]].forEach(function (q) { M.box(q[0], q[1], s, s, h, z || 0, part, { hi: false }); }); }
  // a flat quad on the local face v = vv, from u0 to u1 and h0 to h1 px
  function fq(M, u0, u1, h0, h1, vv) { return [M.p(u0, vv, h0), M.p(u1, vv, h0), M.p(u1, vv, h1), M.p(u0, vv, h1)]; }
  function fqU(M, v0, v1, h0, h1, uu) { return [M.p(uu, v0, h0), M.p(uu, v1, h0), M.p(uu, v1, h1), M.p(uu, v0, h1)]; }
  SS.fq = fq;
  function steam(c, p, t) { var k = t % 4; R(c, p[0] - 1, p[1] - 3 - k, 1, 2, 'rgba(255,255,255,.6)'); R(c, p[0] + 1, p[1] - 6 - ((k + 2) % 4), 1, 2, 'rgba(255,255,255,.45)'); }
  function mug(M, u, v, z, col, t, hot) {
    var b = M.box(u, v, .18, .18, 5, z, col);
    M.on(b, function (c) { var m = M.p(u + .09, v + .09, z + 5); R(c, m[0] - 1, m[1], 3, 1, '#7d4c30'); var h = M.p(u + .18, v + .1, z + 3); R(c, h[0], h[1] - 1, 2, 1, StudioIso.ramp(col)[2]); R(c, h[0] + 1, h[1], 1, 2, StudioIso.ramp(col)[2]); if (hot) steam(c, m, t); });
  }
  function book(M, u, v, z, bw, bd, col) { M.box(u, v, bw, bd, 2, z, col, { cols: [StudioIso.ramp(col)[0], '#fff6ea', StudioIso.ramp(col)[2]] }); }
  function candle(M, u, v, z, t) { M.spr(u, v, z, function (c, x, y) { R(c, x - 1, y - 5, 3, 5, '#fff1e2'); R(c, x + 1, y - 5, 1, 5, '#e6d3b0'); R(c, x, y - 7 - (t % 2), 1, 2, '#ffd56b'); }, [.06, 8]); }
  function flowers(c, x, y, cols) { cols.forEach(function (k, i) { var dx = (i - 1) * 3, dy = -3 - (i % 2) * 2; R(c, x + dx, y + dy + 2, 1, 3, '#5f8f4e'); R(c, x + dx - 1, y + dy, 3, 2, k); R(c, x + dx, y + dy - 1, 1, 1, k); R(c, x + dx, y + dy, 1, 1, '#ffe9a6'); }); }

  // ---------- seating ----------
  function seating(M, W, t, o) { // armchair and sofas: back on the far side (v = 0), seat opens toward the front (v = 1)
    o = o || {};
    var aw = .2, Rf = M.ramp('fabric');
    M.shadow(0, 0, W, 1);
    legs(M, .06, .06, W - .06, .96, .1, 4, 'wood');
    var base = M.box(aw + .04, .3, W - 2 * aw - .08, .66, 8, 4, 'fabric');
    M.on(base, function (c) { if (M.vis('+v')) line(c, M.p(aw + .04, .96, 5), M.p(W - aw - .04, .96, 5), Rf[0]); }); // piping along the solid front panel
    var back = M.box(.04, .04, W - .08, .26, 24, 4, 'fabric');
    M.on(back, function (c) { var a = M.p(.06, .17, 29), b = M.p(W - .06, .17, 29); line(c, a, b, Rf[0], 3); line(c, [a[0], a[1] - 1], [b[0], b[1] - 1], 'rgba(255,255,255,.35)'); });
    function arm(u) {
      var ab = M.box(u, .3, aw, .66, 14, 4, 'fabric');
      M.on(ab, function (c) {
        var r1 = M.p(u + aw / 2, .3, 19), r2 = M.p(u + aw / 2, .96, 19); line(c, r1, r2, Rf[0], 3); line(c, [r1[0], r1[1] - 1], [r2[0], r2[1] - 1], 'rgba(255,255,255,.35)');
        // the round scroll at the top front of the arm, where the roll ends (bible, chair rules)
        var fr = M.vis('+v') ? M.p(u + aw / 2, .96, 15) : M.vis('-v') ? null : null;
        if (fr) { c.fillStyle = Rf[1]; c.beginPath(); c.ellipse(fr[0], fr[1], 3, 3.5, 0, 0, 7); c.fill(); c.strokeStyle = INK; c.stroke(); c.strokeStyle = Rf[0]; c.beginPath(); c.ellipse(fr[0], fr[1], 1.5, 2, 0, 0, 7); c.stroke(); }
      });
    }
    arm(.04);
    var n = Math.max(1, Math.round(W)), sw = (W - 2 * aw - .08) / n;
    for (var i = 0; i < n; i++) {
      var u = aw + .04 + i * sw;
      M.box(u, .3, sw, .14, 11, 12, 'cushion');
      var sc = M.box(u, .44, sw, .52, 5, 12, 'cushion');
      if (i === 0) M.on(sc, function (c) { var q = M.p(aw + .3, .7, 17); R(c, q[0] - 3, q[1], 6, 1, 'rgba(255,255,255,.4)'); });
    }
    arm(W - aw - .04);
    if (M.props()) {
      M.box(aw + .1, .45, .32, .1, 9, 17, '#e46f8b', { tex: 'fab' });
      if (W > 1.5) M.box(W - aw - .45, .45, .32, .1, 9, 17, '#f3d38a', { tex: 'fab' });
      if (o.throw) { var th = M.box(W - aw - .04, .32, aw + .02, .62, 2, 18, '#fbe9e2', { tex: 'fab' }); M.on(th, function (c) { for (var k = .4; k < .95; k += .12) { var q = M.p(W - .03, k, 17); R(c, q[0], q[1], 1, 9, '#ecd2c8'); } }); }
    }
  }
  var FAB = function (f, c, w) { return { fabric: f, cushion: c, wood: w }; };

  var C = SS.CATALOG = [];
  function add(def) { def.parts = def.parts || []; def.swatches = def.swatches || [{}]; def.spots = def.spots || []; C.push(def); return def; }

  add({ id: 'club-armchair', name: 'Club armchair', tab: 'seating', w: 1, d: 1, kind: 'floor', h: 34, price: 250, use: 'chair', seat: 17, nap: true,
    parts: [['fabric', 'fab'], ['cushion', 'fab'], ['wood', 'wood']],
    swatches: [FAB('#8fb3a9', '#e6d3b0', '#7a4e33'), FAB('#c96f45', '#d98059', '#55311d'), FAB('#e46f8b', '#f6ead0', '#8e5a37'), FAB('#e7b75f', '#fff1e2', '#7a4e33'), FAB('#7d93c4', '#e6d3b0', '#55311d'), FAB('#e6d3b0', '#f6ead0', '#b9804f')],
    draw: function (M, t) { seating(M, 1, t); } });
  add({ id: 'three-seat-sofa', name: 'Three-seat sofa', tab: 'seating', w: 3, d: 1, kind: 'floor', h: 34, price: 520, use: 'sofa', seat: 17, nap: true,
    parts: [['fabric', 'fab'], ['cushion', 'fab'], ['wood', 'wood']],
    swatches: [FAB('#86ada5', '#b5d4ca', '#55311d'), FAB('#c96f45', '#e99a70', '#55311d'), FAB('#9a7bb4', '#c8a6d8', '#8e5a37'), FAB('#e6d3b0', '#f6ead0', '#8e5a37'), FAB('#4f6a9e', '#7d93c4', '#55311d')],
    draw: function (M, t) { seating(M, 3, t, { throw: true }); } });
  add({ id: 'two-seat-sofa', name: 'Two-seat sofa', tab: 'seating', w: 2, d: 1, kind: 'floor', h: 34, price: 420, use: 'sofa', seat: 17, nap: true,
    parts: [['fabric', 'fab'], ['cushion', 'fab'], ['wood', 'wood']],
    swatches: [FAB('#e46f8b', '#f39bb0', '#8e5a37'), FAB('#7fa7a0', '#b5d4ca', '#55311d'), FAB('#e7b75f', '#f3d38a', '#8e5a37'), FAB('#c8a6d8', '#f6ead0', '#55311d'), FAB('#8e5a37', '#e6d3b0', '#55311d')],
    draw: function (M, t) { seating(M, 2, t, { throw: true }); } });
  add({ id: 'dining-chair', name: 'Dining chair', tab: 'seating', w: 1, d: 1, kind: 'floor', h: 30, price: 120, use: 'chair', seat: 13,
    parts: [['wood', 'wood'], ['cushion', 'fab']],
    swatches: [{ wood: '#b9804f', cushion: '#e46f8b' }, { wood: '#8e5a37', cushion: '#7fa7a0' }, { wood: '#e8c08e', cushion: '#f3d38a' }, { wood: '#fff1e2', cushion: '#c8a6d8' }, { wood: '#55311d', cushion: '#f6ead0' }],
    draw: function (M) {
      M.shadow(.2, .2, .6, .6);
      legs(M, .22, .22, .78, .78, .08, 11, 'wood');
      M.box(.2, .2, .6, .6, 2, 11, 'wood');
      M.box(.24, .26, .52, .5, 2, 13, 'cushion');
      [.24, .46, .66].forEach(function (u, i) { M.box(u, .2, .1, .06, 15 + (i === 1 ? 2 : 0), 13, 'wood'); });
      M.box(.2, .17, .6, .06, 3, 28, 'wood');
    } });
  add({ id: 'desk-chair', name: 'Desk chair', tab: 'seating', w: 1, d: 1, kind: 'floor', h: 32, price: 180, use: 'chair', seat: 15,
    parts: [['fabric', 'fab'], ['metal', 'metal']],
    swatches: [{ fabric: '#7fa7a0', metal: '#3b3236' }, { fabric: '#e46f8b', metal: '#d9d0c4' }, { fabric: '#f3d38a', metal: '#3b3236' }, { fabric: '#4f6a9e', metal: '#8f8a86' }, { fabric: '#2f2228', metal: '#3b3236' }],
    draw: function (M) {
      M.eshadow(.5, .5, 8);
      M.spr(.5, .5, 0, function (c, x, y) { var k = M.ramp('metal'); R(c, x - 7, y - 1, 14, 2, k[2]); R(c, x - 1, y - 4, 2, 6, k[2]); R(c, x - 8, y, 2, 2, '#2f2228'); R(c, x + 6, y, 2, 2, '#2f2228'); R(c, x - 1, y + 2, 2, 2, '#2f2228'); R(c, x - 1, y - 12, 2, 9, k[1]); }, [.2, 12]);
      M.box(.22, .25, .56, .52, 4, 12, 'fabric');
      M.box(.24, .16, .52, .1, 15, 15, 'fabric');
    } });
  add({ id: 'window-seat-cushion', name: 'Window seat cushion', tab: 'seating', w: 2, d: 1, kind: 'floor', h: 22, price: 160, use: 'chair', seat: 12, nap: true,
    parts: [['fabric', 'fab'], ['pillow', 'fab']],
    swatches: [{ fabric: '#f39bb0', pillow: '#f3d38a' }, { fabric: '#9cc1b6', pillow: '#f6ead0' }, { fabric: '#e6d3b0', pillow: '#e46f8b' }, { fabric: '#c8a6d8', pillow: '#fff1e2' }],
    draw: function (M) {
      M.shadow(0, .05, 2, .9);
      var b = M.box(.04, .08, 1.92, .86, 7, 0, '#e8c08e', { tex: 'wood' });
      M.box(.08, .12, 1.84, .78, 5, 7, 'fabric');
      M.box(.15, .14, .4, .14, 10, 12, 'pillow'); M.box(1.4, .14, .45, .14, 9, 12, 'pillow');
      if (M.props()) M.box(.8, .3, .55, .35, 2, 12, '#fbe9e2', { tex: 'fab' });
    } });

  // ---------- tables ----------
  add({ id: 'coffee-table', name: 'Coffee table', tab: 'tables', w: 2, d: 1, kind: 'floor', h: 24, top: 16, price: 200,
    parts: [['wood', 'wood'], ['legs', 'wood']], spots: [[.5, .5], [1.0, .45], [1.5, .55]],
    swatches: [{ wood: '#cf9d68', legs: '#7a4e33' }, { wood: '#8e5a37', legs: '#55311d' }, { wood: '#fff1e2', legs: '#cf9d68' }, { wood: '#7fa7a0', legs: '#55311d' }, { wood: '#e46f8b', legs: '#fff1e2' }],
    draw: function (M, t, free) {
      M.shadow(.15, .1, 1.7, .85);
      legs(M, .15, .1, 1.85, .95, .1, 13, 'legs');
      M.box(.2, .15, 1.6, .75, 1, 3, 'wood');
      if (M.props()) { book(M, .35, .3, 4, .4, .3, '#9cc1b6'); book(M, .37, .32, 6, .36, .26, '#f39bb0'); }
      M.box(.15, .1, 1.7, .85, 3, 13, 'wood');
      if (M.props()) {
        if (free(0)) { book(M, .3, .35, 16, .45, .32, '#f3d38a'); book(M, .34, .38, 18, .38, .26, '#9cc1b6'); }
        if (free(1)) candle(M, 1.0, .4, 16, t);
        if (free(2)) { mug(M, 1.45, .3, 16, '#fff3e6', t, true); mug(M, 1.6, .6, 16, '#e46f8b', t); }
      }
    } });
  add({ id: 'side-table', name: 'Side table', tab: 'tables', w: 1, d: 1, kind: 'floor', h: 20, top: 15, price: 110,
    parts: [['wood', 'wood']], spots: [[.5, .5]],
    swatches: [{ wood: '#b9804f' }, { wood: '#e8c08e' }, { wood: '#55311d' }, { wood: '#fff1e2' }, { wood: '#7fa7a0' }],
    draw: function (M, t, free) {
      M.shadow(.2, .2, .6, .6);
      legs(M, .22, .22, .78, .78, .07, 12, 'wood');
      M.box(.25, .25, .5, .5, 1, 4, 'wood');
      M.box(.2, .2, .6, .6, 3, 12, 'wood');
      if (M.props() && free(0)) { book(M, .3, .35, 15, .3, .25, '#e46f8b'); }
    } });
  add({ id: 'round-dining-table', name: 'Round dining table', tab: 'tables', w: 2, d: 2, kind: 'floor', h: 26, top: 18, price: 300,
    parts: [['wood', 'wood'], ['base', 'wood']], spots: [[1, 1], [.6, .6], [1.4, .6], [.6, 1.4], [1.4, 1.4]],
    swatches: [{ wood: '#cf9d68', base: '#7a4e33' }, { wood: '#fff1e2', base: '#b9804f' }, { wood: '#8e5a37', base: '#55311d' }, { wood: '#7fa7a0', base: '#fff1e2' }],
    draw: function (M, t, free) {
      M.eshadow(1, 1, 20);
      M.cyl(1, 1, .35, 2, 0, 'base');
      M.cyl(1, 1, .1, 13, 2, 'base');
      M.cyl(1, 1, .85, 3, 15, 'wood');
      if (M.props() && free(0)) M.spr(1, 1, 18, function (c, x, y) { R(c, x - 2, y - 7, 5, 7, '#7fa7a0'); R(c, x - 2, y - 7, 2, 7, '#9cc1b6'); flowers(c, x, y - 7, ['#e46f8b', '#ffd56b', '#f39bb0']); }, [.1, 14]);
    } });
  add({ id: 'desk', name: 'Desk', tab: 'tables', w: 2, d: 1, kind: 'floor', h: 34, top: 22, price: 280, use: 'desk',
    parts: [['wood', 'wood'], ['drawers', 'wood']], spots: [[.4, .5], [1.0, .45], [1.6, .5]],
    swatches: [{ wood: '#cf9d68', drawers: '#fff1e2' }, { wood: '#8e5a37', drawers: '#8e5a37' }, { wood: '#fff1e2', drawers: '#9cc1b6' }, { wood: '#55311d', drawers: '#cf9d68' }],
    draw: function (M, t, free) {
      M.shadow(.05, .1, 1.9, .85);
      var dr = M.box(1.3, .15, .6, .75, 19, 0, 'drawers');
      M.on(dr, function (c) { if (!M.vis('+v')) return; [5, 11, 16].forEach(function (h) { line(c, M.p(1.32, .9, h), M.p(1.88, .9, h), 'rgba(59,36,48,.45)'); var k = M.p(1.6, .9, h - 3); R(c, k[0], k[1], 2, 1, '#e7bb4f'); }); });
      M.box(.1, .15, .08, .75, 19, 0, 'wood');
      M.box(.05, .1, 1.9, .85, 3, 19, 'wood');
      if (M.props()) {
        if (free(1)) M.spr(1.0, .4, 22, function (c, x, y) { R(c, x - 7, y - 1, 14, 2, '#3b3236'); R(c, x - 6, y - 10, 12, 9, '#3b3236'); R(c, x - 5, y - 9, 10, 7, '#7d93c4'); R(c, x - 4, y - 8, 5, 2, '#a9c9e8'); }, [.3, 12]);
        if (free(2)) mug(M, 1.55, .45, 22, '#7fa7a0', t, true);
        if (free(0)) { book(M, .25, .4, 22, .35, .25, '#e46f8b'); book(M, .27, .42, 24, .3, .2, '#f3d38a'); }
      }
    } });
  add({ id: 'nightstand', name: 'Nightstand', tab: 'tables', w: 1, d: 1, kind: 'floor', h: 22, top: 17, price: 140,
    parts: [['wood', 'wood'], ['knob', 'metal']], spots: [[.5, .5]],
    swatches: [{ wood: '#cf9d68', knob: '#e7bb4f' }, { wood: '#fff1e2', knob: '#c78f3e' }, { wood: '#7fa7a0', knob: '#fff1e2' }, { wood: '#55311d', knob: '#e7bb4f' }],
    draw: function (M, t, free) {
      M.shadow(.15, .15, .7, .7);
      legs(M, .17, .17, .83, .83, .07, 3, 'wood');
      var b = M.box(.15, .15, .7, .7, 14, 3, 'wood');
      M.on(b, function (c) { var k = M.ramp('knob'); if (M.vis('+v')) { line(c, M.p(.17, .85, 10), M.p(.83, .85, 10), 'rgba(59,36,48,.4)'); var q = M.p(.5, .85, 13); R(c, q[0], q[1], 2, 1, k[0]); q = M.p(.5, .85, 6); R(c, q[0], q[1], 2, 1, k[0]); } });
      if (M.props() && free(0)) book(M, .25, .3, 17, .3, .25, '#9cc1b6');
    } });

  // ---------- beds ----------
  add({ id: 'double-bed', name: 'Double bed', tab: 'beds', w: 2, d: 3, kind: 'floor', h: 30, price: 560, use: 'bed', seat: 14, nap: true,
    parts: [['wood', 'wood'], ['quilt', 'fab'], ['sheets', 'fab']],
    swatches: [{ wood: '#b9804f', quilt: '#e46f8b', sheets: '#fff3e6' }, { wood: '#55311d', quilt: '#7fa7a0', sheets: '#f6ead0' }, { wood: '#fff1e2', quilt: '#e7b75f', sheets: '#fff3e6' }, { wood: '#8e5a37', quilt: '#9a7bb4', sheets: '#fbe9e2' }, { wood: '#cf9d68', quilt: '#4f6a9e', sheets: '#fff3e6' }],
    draw: function (M, t) {
      M.shadow(0, 0, 2, 3);
      var hb = M.box(.02, .02, 1.96, .18, 28, 0, 'wood');
      M.on(hb, function (c) { var q = M.p(1, .2, 22); R(c, q[0] - 1, q[1], 2, 2, '#f3d38a'); });
      M.box(.04, .2, 1.92, 2.72, 8, 0, 'wood');
      M.box(.1, .2, 1.8, 2.66, 5, 8, 'sheets');
      var Q = M.box(.07, .95, 1.86, 1.95, 2, 13, 'quilt');
      M.on(Q, function (c) {
        for (var i = 0; i < 6; i++) for (var j = 0; j < 6; j++) if ((i + j) % 2 === 0) SS.poly(c, [M.p(.07 + i * .31, .95 + j * .325, 15), M.p(.07 + (i + 1) * .31, .95 + j * .325, 15), M.p(.07 + (i + 1) * .31, .95 + (j + 1) * .325, 15), M.p(.07 + i * .31, .95 + (j + 1) * .325, 15)], 'rgba(255,240,230,.35)');
        if (M.vis('+v')) { line(c, M.p(.07, 2.9, 12), M.p(1.93, 2.9, 12), '#fff1e2'); }
      });
      M.box(.2, .3, .7, .4, 4, 13, '#ffffff', { tex: 'fab' }); M.box(1.1, .3, .7, .4, 4, 13, '#ffffff', { tex: 'fab' });
      if (M.props()) { var th = M.box(.12, 2.3, 1.76, .45, 3, 15, '#f3d38a', { tex: 'fab' }); M.on(th, function (c) { line(c, M.p(.12, 2.52, 18), M.p(1.88, 2.52, 18), '#fbe7b5'); }); }
    } });
  add({ id: 'cat-bed', name: 'Cat bed', tab: 'beds', w: 1, d: 1, kind: 'floor', h: 10, price: 90, nap: true, seat: 6,
    parts: [['fabric', 'fab'], ['cushion', 'fab']],
    swatches: [{ fabric: '#c96f45', cushion: '#f6ead0' }, { fabric: '#7fa7a0', cushion: '#fff1e2' }, { fabric: '#e46f8b', cushion: '#fbe9e2' }, { fabric: '#e6d3b0', cushion: '#c8a6d8' }],
    draw: function (M) {
      M.eshadow(.5, .5, 10);
      var b = M.cyl(.5, .5, .4, 7, 0, 'fabric');
      M.on(b, function (c) { var tp = b.top; c.fillStyle = M.ramp('cushion')[1]; c.beginPath(); c.ellipse(tp[0], tp[1] + 1, b.rx - 3, b.ry - 1.5, 0, 0, 7); c.fill(); c.fillStyle = M.ramp('cushion')[0]; c.beginPath(); c.ellipse(tp[0] - 1, tp[1], b.rx - 6, b.ry - 3, 0, 0, 7); c.fill(); });
    } });

  // ---------- storage, kitchen and bath (a "Kitchen and bath" row inside Storage, spec 001 Claude default) ----------
  add({ id: 'bookshelf', name: 'Bookshelf', tab: 'storage', w: 2, d: 1, kind: 'floor', h: 50, price: 260, use: 'bookshelf',
    parts: [['wood', 'wood']],
    swatches: [{ wood: '#b9804f' }, { wood: '#55311d' }, { wood: '#fff1e2' }, { wood: '#7fa7a0' }, { wood: '#e8c08e' }],
    draw: function (M, t) {
      M.shadow(.1, .05, 1.8, .5);
      var F = M.box(.1, .05, 1.8, .5, 48, 0, 'wood');
      M.on(F, function (c) {
        if (!M.vis('+v')) return;
        var cols = ['#e46f8b', '#7fa7a0', '#f3d38a', '#a9c9e8', '#e99a70', '#fff1e2', '#b5d4ca', '#c9827f'];
        SS.poly(c, fq(M, .14, 1.86, 3, 45, .551), '#6e4429');
        [5, 19, 33].forEach(function (z, r) {
          line(c, M.p(.14, .551, z), M.p(1.86, .551, z), M.ramp('wood')[0], 2);
          if (!M.props()) return;
          var u = .18;
          for (var k = 0; k < 11 && u < 1.8; k++) {
            if (r === 1 && u > 1.25) break;
            var bw = .1 + ((k * 7 + r) % 3) * .03, bh = 8 + ((k * 5 + r * 3) % 4), q = M.p(u, .551, z);
            SS.poly(c, [q, M.p(u + bw, .551, z), M.p(u + bw, .551, z + bh), M.p(u, .551, z + bh)], cols[(k + r * 3) % 8]);
            line(c, M.p(u, .551, z), M.p(u, .551, z + bh), 'rgba(255,255,255,.3)');
            u += bw + .02;
          }
          if (r === 1) { var pp = M.p(1.55, .551, 19); R(c, pp[0] - 3, pp[1] - 5, 6, 5, '#d98a6f'); for (var vv = 0; vv < 4; vv++) R(c, pp[0] - 4 + vv * 2, pp[1] - 8 + (vv % 2) * 2, 2, 4, '#79a964'); R(c, pp[0] + 2, pp[1] - 2, 1, 6, '#5f8f4e'); }
        });
      });
    } });
  add({ id: 'dresser', name: 'Dresser', tab: 'storage', w: 2, d: 1, kind: 'floor', h: 30, top: 26, price: 300, use: 'wardrobe',
    parts: [['wood', 'wood'], ['knob', 'metal']], spots: [[.5, .45], [1.0, .45], [1.5, .45]],
    swatches: [{ wood: '#cf9d68', knob: '#e7bb4f' }, { wood: '#fff1e2', knob: '#c78f3e' }, { wood: '#9cc1b6', knob: '#fff1e2' }, { wood: '#55311d', knob: '#e7bb4f' }, { wood: '#e46f8b', knob: '#fff1e2' }],
    draw: function (M, t, free) {
      M.shadow(.1, .1, 1.8, .75);
      legs(M, .12, .12, 1.88, .85, .08, 3, 'wood');
      var b = M.box(.1, .1, 1.8, .75, 23, 3, 'wood');
      M.on(b, function (c) { if (!M.vis('+v')) return; var k = M.ramp('knob'); [10, 17].forEach(function (h) { line(c, M.p(.12, .85, h), M.p(1.88, .85, h), 'rgba(59,36,48,.4)'); }); line(c, M.p(1, .85, 3), M.p(1, .85, 26), 'rgba(59,36,48,.3)'); [[.55, 7], [1.45, 7], [.55, 14], [1.45, 14], [.55, 21], [1.45, 21]].forEach(function (q) { var p = M.p(q[0], .85, q[1]); R(c, p[0] - 1, p[1], 3, 1, k[0]); }); });
      if (M.props()) { if (free(0)) M.spr(.5, .45, 26, function (c, x, y) { R(c, x - 3, y - 8, 6, 8, '#8e5a37'); R(c, x - 2, y - 7, 4, 6, '#f6ead0'); R(c, x - 1, y - 5, 2, 2, '#e46f8b'); }, [.15, 9]); if (free(2)) M.spr(1.5, .45, 26, function (c, x, y) { R(c, x - 3, y - 2, 7, 2, '#fff1e2'); R(c, x - 2, y - 4, 5, 2, '#f39bb0'); }, [.15, 5]); }
    } });
  function counterBody(M, top) {
    var b = M.box(.02, .1, .96, .82, 19, 0, 'cabinet');
    M.on(b, function (c) { if (M.vis('+v')) { SS.poly(c, SS.fq(M, .12, .88, 3, 16, .921), null, 'rgba(59,36,48,.35)'); var k = M.p(.75, .92, 12); R(c, k[0], k[1], 1, 3, '#e7bb4f'); } if (M.vis('+u')) SS.poly(c, fqU(M, .2, .8, 3, 16, .981), null, 'rgba(59,36,48,.25)'); });
    M.box(0, .06, 1, .9, 3, 19, 'top', { tex: null });
  }
  var KIT = [{ cabinet: '#7fa7a0', top: '#e8dccd' }, { cabinet: '#fff1e2', top: '#cf9d68' }, { cabinet: '#e46f8b', top: '#fff1e2' }, { cabinet: '#4f6a9e', top: '#e8dccd' }, { cabinet: '#8e5a37', top: '#f6ead0' }];
  add({ id: 'kitchen-counter', name: 'Kitchen counter', tab: 'storage', row: 'kitchen', w: 1, d: 1, kind: 'floor', h: 24, top: 22, price: 200,
    parts: [['cabinet', 'wood'], ['top', 'plain']], spots: [[.5, .5]], swatches: KIT,
    draw: function (M, t, free) {
      counterBody(M);
      if (M.props() && free(0)) M.spr(.5, .45, 22, function (c, x, y) { R(c, x - 4, y - 6, 8, 6, '#d98a6f'); R(c, x - 4, y - 6, 8, 1, '#e8a28c'); c.fillStyle = '#6aa361'; c.beginPath(); c.arc(x - 2, y - 9, 3, 0, 7); c.arc(x + 2, y - 10, 3, 0, 7); c.fill(); R(c, x - 3, y - 11, 2, 1, '#8fc47b'); }, [.15, 13]);
    } });
  add({ id: 'sink-cabinet', name: 'Sink cabinet', tab: 'storage', row: 'kitchen', w: 1, d: 1, kind: 'floor', h: 30, top: 22, price: 240, use: 'sink',
    parts: [['cabinet', 'wood'], ['top', 'plain']], swatches: KIT,
    draw: function (M) {
      counterBody(M);
      M.spr(.5, .5, 22, function (c, x, y) { c.fillStyle = '#b9c3c8'; c.beginPath(); c.ellipse(x, y, 7, 3.5, 0, 0, 7); c.fill(); c.fillStyle = '#8f9aa0'; c.beginPath(); c.ellipse(x, y + .5, 5.5, 2.5, 0, 0, 7); c.fill(); }, [.3, 1]);
      M.spr(.5, .15, 22, function (c, x, y) { R(c, x - 1, y - 8, 2, 8, '#c7ced2'); R(c, x - 1, y - 9, 6, 2, '#c7ced2'); R(c, x + 3, y - 8, 2, 2, '#9aa3ab'); }, [.08, 10]);
    } });
  add({ id: 'fridge', name: 'Fridge', tab: 'storage', row: 'kitchen', w: 1, d: 1, kind: 'floor', h: 56, price: 480, use: 'fridge',
    parts: [['body', 'plain'], ['handle', 'metal']],
    swatches: [{ body: '#fbf4ea', handle: '#b9a898' }, { body: '#9cc1b6', handle: '#fff1e2' }, { body: '#f39bb0', handle: '#fff1e2' }, { body: '#f3d38a', handle: '#8e5a37' }, { body: '#d9d0c4', handle: '#55405e' }],
    draw: function (M) {
      M.shadow(.05, .05, .9, .9);
      var b = M.box(.05, .05, .9, .9, 54, 0, 'body');
      M.on(b, function (c) {
        var h = M.ramp('handle');
        if (M.vis('+v')) { line(c, M.p(.06, .95, 36), M.p(.94, .95, 36), 'rgba(59,36,48,.4)'); var a = M.p(.82, .95, 40); R(c, a[0], a[1] - 10, 2, 9, h[1]); a = M.p(.82, .95, 20); R(c, a[0], a[1] - 12, 2, 11, h[1]);
          if (M.props()) { var m = M.p(.3, .95, 50); R(c, m[0], m[1] - 4, 6, 7, '#fff'); R(c, m[0] + 1, m[1] - 2, 4, 1, '#d9853f'); R(c, m[0] + 1, m[1], 3, 1, '#d9853f'); R(c, m[0] + 2, m[1] - 6, 2, 2, '#e46f8b'); var m2 = M.p(.55, .95, 30); R(c, m2[0], m2[1] - 3, 5, 6, '#fff6ea'); R(c, m2[0] + 1, m2[1] - 2, 3, 1, '#7fa7a0'); R(c, m2[0] + 1, m2[1], 3, 1, '#7fa7a0'); } }
        if (M.vis('+u')) { line(c, M.p(.95, .06, 36), M.p(.95, .94, 36), 'rgba(59,36,48,.3)'); }
      });
    } });
  add({ id: 'stove', name: 'Stove', tab: 'storage', row: 'kitchen', w: 1, d: 1, kind: 'floor', h: 30, price: 420, use: 'stove', moves: 'steam', anim: 4,
    parts: [['body', 'plain'], ['top', 'metal']],
    swatches: [{ body: '#fbf4ea', top: '#3b3236' }, { body: '#e46f8b', top: '#3b3236' }, { body: '#7fa7a0', top: '#2f2228' }, { body: '#f3d38a', top: '#3b3236' }, { body: '#2f2228', top: '#55405e' }],
    draw: function (M, t) {
      M.shadow(.02, .1, .96, .82);
      var b = M.box(.02, .1, .96, .82, 19, 0, 'body');
      M.on(b, function (c) { if (M.vis('+v')) { var q = SS.fq(M, .14, .86, 4, 13, .921); SS.poly(c, q, '#3b3236'); SS.poly(c, SS.fq(M, .22, .78, 6, 11, .922), 'rgba(255,170,100,.35)'); line(c, M.p(.2, .92, 15), M.p(.8, .92, 15), '#c7ced2', 2); [.25, .42, .58, .75].forEach(function (u) { var k = M.p(u, .92, 17); R(c, k[0], k[1], 1, 1, '#3b3236'); }); } });
      var tp = M.box(0, .06, 1, .9, 3, 19, 'top');
      M.on(tp, function (c) { [[.28, .3], [.72, .3], [.28, .72], [.72, .72]].forEach(function (q, k) { var p = M.p(q[0], q[1], 22); c.fillStyle = '#5a5054'; c.beginPath(); c.ellipse(p[0], p[1], 4, 2, 0, 0, 7); c.fill(); c.strokeStyle = '#8f8a86'; c.stroke(); }); });
      if (M.props()) M.spr(.28, .72, 22, function (c, x, y) { c.fillStyle = '#3b3236'; c.beginPath(); c.ellipse(x, y - 1, 6, 3, 0, 0, 7); c.fill(); c.fillStyle = '#5a5054'; c.beginPath(); c.ellipse(x, y - 2, 5, 2.2, 0, 0, 7); c.fill(); R(c, x - 2, y - 3, 2, 1, '#d2363c'); R(c, x + 1, y - 3, 2, 1, '#6aa361'); R(c, x + 5, y - 2, 6, 2, '#3b3236'); steam(c, [x, y - 4], t); }, [.25, 6]);
    } });
  add({ id: 'bath-tub', name: 'Bath tub', tab: 'storage', row: 'bath', w: 2, d: 1, kind: 'floor', h: 22, price: 520, use: 'tub', seat: 10,
    parts: [['tub', 'plain'], ['feet', 'metal']],
    swatches: [{ tub: '#fbf6ef', feet: '#e7bb4f' }, { tub: '#9cc1b6', feet: '#fff1e2' }, { tub: '#f39bb0', feet: '#e7bb4f' }, { tub: '#2f2228', feet: '#e7bb4f' }, { tub: '#fff1e2', feet: '#8f8a86' }],
    draw: function (M) {
      M.shadow(.05, .1, 1.9, .8);
      [[.15, .2], [1.75, .2], [.15, .75], [1.75, .75]].forEach(function (q) { M.box(q[0], q[1], .1, .1, 4, 0, 'feet', { hi: false }); });
      var b = M.box(.05, .1, 1.9, .8, 15, 4, 'tub');
      M.on(b, function (c) {
        SS.poly(c, [M.p(.18, .22, 19), M.p(1.82, .22, 19), M.p(1.82, .78, 19), M.p(.18, .78, 19)], '#c9d6dc');
        SS.poly(c, [M.p(.24, .28, 17), M.p(1.76, .28, 17), M.p(1.76, .74, 17), M.p(.24, .74, 17)], '#a9c9e8');
        if (M.props()) { for (var k = 0; k < 7; k++) { var q = M.p(.4 + k * .2, .4 + (k % 3) * .12, 19); c.fillStyle = '#fff'; c.beginPath(); c.arc(q[0], q[1] - 1, 2 + (k % 2), 0, 7); c.fill(); } var dq = M.p(1.4, .6, 20); R(c, dq[0] - 2, dq[1] - 3, 4, 3, '#ffd56b'); R(c, dq[0], dq[1] - 5, 3, 2, '#ffd56b'); R(c, dq[0] + 3, dq[1] - 4, 1, 1, '#e7703a'); }
        var f = M.p(1.9, .5, 19); R(c, f[0] - 1, f[1] - 6, 2, 6, '#c7ced2');
      });
    } });
  add({ id: 'bathroom-sink', name: 'Bathroom sink', tab: 'storage', row: 'bath', w: 1, d: 1, kind: 'floor', h: 26, price: 220, use: 'sink',
    parts: [['ceramic', 'plain'], ['tap', 'metal']],
    swatches: [{ ceramic: '#fbf6ef', tap: '#c7ced2' }, { ceramic: '#9cc1b6', tap: '#e7bb4f' }, { ceramic: '#f39bb0', tap: '#c7ced2' }, { ceramic: '#fff1e2', tap: '#e7bb4f' }],
    draw: function (M) {
      M.eshadow(.5, .4, 8);
      M.cyl(.5, .4, .12, 16, 0, 'ceramic');
      var b = M.box(.15, .1, .7, .55, 5, 16, 'ceramic');
      M.on(b, function (c) { var q = M.p(.5, .38, 21); c.fillStyle = '#c9d6dc'; c.beginPath(); c.ellipse(q[0], q[1], 6, 2.6, 0, 0, 7); c.fill(); var tp = M.p(.5, .14, 21); R(c, tp[0] - 1, tp[1] - 5, 2, 5, M.ramp('tap')[1]); R(c, tp[0] - 1, tp[1] - 6, 4, 2, M.ramp('tap')[1]); });
    } });
  add({ id: 'toilet', name: 'Toilet', tab: 'storage', row: 'bath', w: 1, d: 1, kind: 'floor', h: 26, price: 200,
    parts: [['ceramic', 'plain'], ['seat', 'plain']],
    swatches: [{ ceramic: '#fbf6ef', seat: '#fbf6ef' }, { ceramic: '#fbf6ef', seat: '#cf9d68' }, { ceramic: '#9cc1b6', seat: '#fbf6ef' }, { ceramic: '#fbf6ef', seat: '#e46f8b' }],
    draw: function (M) {
      M.eshadow(.5, .5, 7);
      M.box(.25, .08, .5, .25, 22, 0, 'ceramic');
      M.box(.32, .35, .36, .4, 9, 0, 'ceramic');
      var s = M.cyl(.5, .6, .26, 3, 9, 'seat');
      M.on(s, function (c) { c.fillStyle = '#c9d6dc'; c.beginPath(); c.ellipse(s.top[0], s.top[1] + .5, s.rx - 2.5, s.ry - 1.5, 0, 0, 7); c.fill(); });
    } });
})();
