// Sarah's Sim catalog, part 3: the rest of spec 001's starting list (The starting catalog), so every tab holds the full
// draft of 80 (Keegan's call, Nov 26: the rest of the catalog next, while the playtest notes come in). Same rules as parts
// 1 and 2: one row per piece, drawn from boxes in local space so all four turns work, texture as light shading only,
// swatches that always look good together, props on a switch.
(function () {
  var C = SS.CATALOG, INK = 'rgba(59,36,48,.85)';
  function line(c, a, b, col, w) { SS.line(c, a, b, col, w); }
  function R(c, x, y, w, h, col) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
  function add(def) { def.parts = def.parts || []; def.swatches = def.swatches || [{}]; def.spots = def.spots || []; C.push(def); return def; }
  function legs(M, u0, v0, u1, v1, s, h, part, z) { [[u0, v0], [u1 - s, v0], [u0, v1 - s], [u1 - s, v1 - s]].forEach(function (q) { M.box(q[0], q[1], s, s, h, z || 0, part, { hi: false }); }); }
  function fq(M, u0, u1, h0, h1, vv) { return SS.fq(M, u0, u1, h0, h1, vv); }
  function glow(c, x, y, r, a) { var g = c.createRadialGradient(x, y, 1, x, y, r); g.addColorStop(0, 'rgba(255,214,140,' + a + ')'); g.addColorStop(1, 'rgba(255,214,140,0)'); c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2); }
  function small(M, fn, e) { M.spr(.5, .5, 0, function (c, x, y) { c.fillStyle = 'rgba(90,45,40,.25)'; c.beginPath(); c.ellipse(x + 1, y, 5, 2, 0, 0, 7); c.fill(); fn(c, x, y); }, e || [.15, 12]); }
  function cushionedSeat(M, u, v, w, d, h, z, part) { var b = M.box(u, v, w, d, h, z, part); M.on(b, function (c) { var q = M.p(u + w / 2, v + d / 2, z + h); R(c, q[0] - 3, q[1], 6, 1, 'rgba(255,255,255,.4)'); }); return b; }

  // ---------- seating ----------
  add({ id: 'loveseat', name: 'Loveseat', tab: 'seating', w: 2, d: 1, kind: 'floor', h: 30, price: 380, use: 'sofa', seat: 15, nap: true,
    parts: [['fabric', 'fab'], ['wood', 'wood']],
    swatches: [{ fabric: '#c8a6d8', wood: '#8e5a37' }, { fabric: '#e99a70', wood: '#55311d' }, { fabric: '#9cc1b6', wood: '#cf9d68' }, { fabric: '#f39bb0', wood: '#fff1e2' }, { fabric: '#7d93c4', wood: '#55311d' }],
    draw: function (M) { // a little curved-back two-seater: one long cushion, low rounded arms with scrolls
      var F = M.ramp('fabric');
      M.shadow(.05, .05, 1.9, .9);
      [[.15, .15], [1.75, .15], [.15, .78], [1.75, .78]].forEach(function (q) { M.box(q[0], q[1], .08, .08, 5, 0, 'wood', { hi: false }); });
      var back = M.box(.08, .08, 1.84, .26, 20, 5, 'fabric');
      M.on(back, function (c) { var a = M.p(.1, .21, 25), b = M.p(1.9, .21, 25), m = M.p(1, .21, 29); c.strokeStyle = F[0]; c.lineWidth = 3; c.beginPath(); c.moveTo(a[0], a[1]); c.quadraticCurveTo(m[0], m[1] - 4, b[0], b[1]); c.stroke(); c.lineWidth = 1; });
      M.box(.08, .34, .2, .6, 11, 5, 'fabric');
      var seat = cushionedSeat(M, .28, .34, 1.44, .6, 6, 8, 'fabric');
      M.on(seat, function (c) { if (M.vis('+v')) line(c, M.p(.28, .94, 9), M.p(1.72, .94, 9), F[0]); });
      M.box(1.72, .34, .2, .6, 11, 5, 'fabric');
      [.08, 1.72].forEach(function (u) { M.spr(u + .1, .94, 14, function (c, x, y) { if (!M.vis('+v')) return; c.fillStyle = F[1]; c.beginPath(); c.ellipse(x, y, 3, 3, 0, 0, 7); c.fill(); c.strokeStyle = INK; c.stroke(); }, [.1, 4]); });
      if (M.props()) M.box(.4, .36, .34, .1, 8, 14, '#f3d38a', { tex: 'fab' });
    } });
  add({ id: 'reading-chair', name: 'Reading chair with ottoman', tab: 'seating', w: 1, d: 2, kind: 'floor', h: 34, price: 320, use: 'chair', seat: 15, nap: true,
    parts: [['fabric', 'fab'], ['wood', 'wood']],
    swatches: [{ fabric: '#c96f45', wood: '#55311d' }, { fabric: '#7fa7a0', wood: '#8e5a37' }, { fabric: '#e6d3b0', wood: '#55311d' }, { fabric: '#4f6a9e', wood: '#cf9d68' }, { fabric: '#e46f8b', wood: '#fff1e2' }],
    draw: function (M) { // a wingback chair at the back of its two tiles, the ottoman in front of it
      M.shadow(0, 0, 1, 2);
      legs(M, .1, .1, .9, .9, .08, 4, 'wood');
      M.box(.08, .08, .84, .22, 28, 4, 'fabric');
      M.box(.08, .3, .18, .6, 16, 4, 'fabric'); M.box(.74, .3, .18, .6, 16, 4, 'fabric');
      M.box(.26, .3, .48, .62, 8, 4, 'fabric');
      cushionedSeat(M, .26, .3, .48, .6, 4, 12, 'fabric');
      legs(M, .2, 1.25, .8, 1.85, .07, 4, 'wood');
      cushionedSeat(M, .18, 1.22, .64, .66, 7, 4, 'fabric');
      if (M.props()) M.box(.25, 1.35, .45, .3, 2, 11, '#fbe9e2', { tex: 'fab' });
    } });
  add({ id: 'kitchen-stool', name: 'Kitchen stool', tab: 'seating', w: 1, d: 1, kind: 'floor', h: 26, price: 90, use: 'chair', seat: 20,
    parts: [['seat', 'fab'], ['legs', 'wood']],
    swatches: [{ seat: '#e46f8b', legs: '#cf9d68' }, { seat: '#7fa7a0', legs: '#55311d' }, { seat: '#f3d38a', legs: '#8e5a37' }, { seat: '#fff1e2', legs: '#3b3236' }],
    draw: function (M) {
      M.eshadow(.5, .5, 6);
      legs(M, .3, .3, .7, .7, .06, 19, 'legs');
      M.box(.32, .32, .36, .02, 1, 8, 'legs', { hi: false });
      M.cyl(.5, .5, .24, 3, 19, 'seat');
    } });
  add({ id: 'floor-cushion', name: 'Floor cushion', tab: 'seating', w: 1, d: 1, kind: 'floor', h: 8, price: 60, use: 'chair', seat: 5, nap: true,
    parts: [['fabric', 'fab']], swatches: [{ fabric: '#f3d38a' }, { fabric: '#e46f8b' }, { fabric: '#9cc1b6' }, { fabric: '#c8a6d8' }, { fabric: '#e99a70' }],
    draw: function (M) {
      M.eshadow(.5, .55, 9);
      var b = M.box(.15, .2, .7, .7, 5, 0, 'fabric');
      M.on(b, function (c) { var q = M.p(.5, .55, 5); c.fillStyle = M.ramp('fabric')[3]; c.fillRect(Math.round(q[0]) - 1, Math.round(q[1]) - 1, 2, 2); [[.2, .25], [.8, .25], [.2, .85], [.8, .85]].forEach(function (t) { var p = M.p(t[0], t[1], 5); R(c, p[0], p[1] - 1, 1, 2, M.ramp('fabric')[0]); }); });
    } });

  // ---------- tables ----------
  add({ id: 'long-dining-table', name: 'Long dining table', tab: 'tables', w: 3, d: 1, kind: 'floor', h: 24, top: 17, price: 380,
    parts: [['wood', 'wood']], spots: [[.6, .5], [1.5, .5], [2.4, .5]],
    swatches: [{ wood: '#cf9d68' }, { wood: '#8e5a37' }, { wood: '#fff1e2' }, { wood: '#55311d' }],
    draw: function (M, t, free) {
      M.shadow(.05, .05, 2.9, .9);
      legs(M, .12, .12, 2.88, .88, .1, 14, 'wood');
      M.box(.05, .05, 2.9, .9, 3, 14, 'wood');
      if (M.props()) { var run = M.box(.2, .38, 2.6, .24, 1, 17, '#fff6ea', { tex: 'fab', line: false }); if (free(1)) M.spr(1.5, .5, 18, function (c, x, y) { R(c, x - 5, y - 2, 10, 3, '#f6ead0'); [[-3, '#e46f8b'], [0, '#f3d38a'], [3, '#8fc47b']].forEach(function (f) { c.fillStyle = f[1]; c.beginPath(); c.arc(x + f[0], y - 3, 2, 0, 7); c.fill(); }); }, [.15, 6]); }
    } });
  add({ id: 'console-table', name: 'Console table', tab: 'tables', w: 2, d: 1, kind: 'floor', h: 24, top: 20, price: 180,
    parts: [['wood', 'wood']], spots: [[.5, .3], [1.5, .3]],
    swatches: [{ wood: '#b9804f' }, { wood: '#fff1e2' }, { wood: '#55311d' }, { wood: '#9cc1b6' }],
    draw: function (M, t, free) { // a narrow table against the wall, with a low shelf
      M.shadow(.1, .05, 1.8, .45);
      legs(M, .12, .07, 1.88, .5, .07, 17, 'wood');
      M.box(.15, .1, 1.7, .37, 1, 4, 'wood');
      M.box(.1, .05, 1.8, .45, 3, 17, 'wood');
      if (M.props() && free(0)) M.spr(.5, .3, 20, function (c, x, y) { R(c, x - 3, y - 2, 7, 2, '#e46f8b'); R(c, x - 2, y - 4, 5, 2, '#7fa7a0'); }, [.15, 5]);
    } });
  add({ id: 'kitchen-island', name: 'Kitchen island', tab: 'tables', row: 'kitchen', w: 2, d: 1, kind: 'floor', h: 26, top: 22, price: 420,
    parts: [['cabinet', 'wood'], ['top', 'plain']], spots: [[.5, .5], [1.5, .5]],
    swatches: [{ cabinet: '#7fa7a0', top: '#e8dccd' }, { cabinet: '#fff1e2', top: '#cf9d68' }, { cabinet: '#4f6a9e', top: '#e8dccd' }, { cabinet: '#e46f8b', top: '#fff1e2' }],
    draw: function (M, t, free) {
      M.shadow(.05, .1, 1.9, .8);
      var b = M.box(.08, .12, 1.84, .76, 19, 0, 'cabinet');
      M.on(b, function (c) { if (!M.vis('+v')) return; [.15, 1.05].forEach(function (u) { SS.poly(c, fq(M, u, u + .8, 3, 16, .881), null, 'rgba(59,36,48,.35)'); var k = M.p(u + .7, .881, 12); R(c, k[0], k[1], 1, 3, '#e7bb4f'); }); });
      M.box(0, .05, 2, .9, 3, 19, 'top');
      if (M.props() && free(1)) M.spr(1.5, .5, 22, function (c, x, y) { c.fillStyle = '#cf9d68'; c.beginPath(); c.ellipse(x, y - 1, 5, 2.5, 0, 0, 7); c.fill(); [[-2, '#e46f6a'], [1, '#f3d38a'], [3, '#8fc47b']].forEach(function (f) { c.fillStyle = f[1]; c.beginPath(); c.arc(x + f[0], y - 3, 1.8, 0, 7); c.fill(); }); }, [.15, 5]);
    } });
  add({ id: 'bistro-table', name: 'Bistro table', tab: 'tables', w: 1, d: 1, kind: 'floor', h: 24, top: 17, price: 150,
    parts: [['top', 'plain'], ['metal', 'metal']], spots: [[.5, .5]],
    swatches: [{ top: '#fff1e2', metal: '#3b3236' }, { top: '#9cc1b6', metal: '#fff1e2' }, { top: '#e8dccd', metal: '#c78f3e' }, { top: '#f39bb0', metal: '#3b3236' }],
    draw: function (M, t, free) {
      M.eshadow(.5, .5, 7);
      M.cyl(.5, .5, .2, 1, 0, 'metal');
      M.cyl(.5, .5, .05, 14, 1, 'metal');
      M.cyl(.5, .5, .38, 2, 15, 'top');
      if (M.props() && free(0)) M.spr(.5, .5, 17, function (c, x, y) { R(c, x - 1, y - 6, 3, 6, '#a9c9e8'); R(c, x, y - 9, 1, 3, '#5f8f4e'); R(c, x - 1, y - 10, 3, 2, '#e46f8b'); }, [.1, 10]);
    } });

  // ---------- beds ----------
  add({ id: 'single-bed', name: 'Single bed', tab: 'beds', w: 1, d: 2, kind: 'floor', h: 28, price: 380, use: 'bed', seat: 13, nap: true,
    parts: [['wood', 'wood'], ['quilt', 'fab'], ['sheets', 'fab']],
    swatches: [{ wood: '#fff1e2', quilt: '#9cc1b6', sheets: '#fff3e6' }, { wood: '#8e5a37', quilt: '#f3d38a', sheets: '#fbe9e2' }, { wood: '#cf9d68', quilt: '#e46f8b', sheets: '#fff3e6' }, { wood: '#55311d', quilt: '#7d93c4', sheets: '#f6ead0' }],
    draw: function (M) {
      M.shadow(0, 0, 1, 2);
      M.box(.04, .02, .92, .16, 24, 0, 'wood');
      M.box(.06, .18, .88, 1.76, 7, 0, 'wood');
      M.box(.1, .18, .8, 1.72, 4, 7, 'sheets');
      var Q = M.box(.08, .75, .84, 1.17, 2, 11, 'quilt');
      M.on(Q, function (c) { if (M.vis('+v')) line(c, M.p(.08, 1.92, 10), M.p(.92, 1.92, 10), '#fff1e2'); line(c, M.p(.08, 1.05, 13), M.p(.92, 1.05, 13), 'rgba(255,255,255,.45)'); });
      M.box(.2, .26, .6, .35, 4, 11, '#ffffff', { tex: 'fab' });
      if (M.props()) M.box(.15, 1.5, .7, .3, 3, 13, '#fbe9e2', { tex: 'fab' });
    } });
  add({ id: 'daybed', name: 'Daybed', tab: 'beds', w: 2, d: 1, kind: 'floor', h: 26, price: 420, use: 'sofa', seat: 13, nap: true,
    parts: [['wood', 'wood'], ['mattress', 'fab']],
    swatches: [{ wood: '#fff1e2', mattress: '#f39bb0' }, { wood: '#8e5a37', mattress: '#9cc1b6' }, { wood: '#cf9d68', mattress: '#f6ead0' }, { wood: '#55311d', mattress: '#c8a6d8' }],
    draw: function (M) { // a bed frame with a back and two ends, made up like a sofa
      M.shadow(.02, .05, 1.96, .9);
      M.box(.04, .06, 1.92, .14, 22, 0, 'wood');
      M.box(.04, .2, .12, .74, 18, 0, 'wood');
      M.box(.16, .2, 1.68, .74, 8, 0, 'wood');
      cushionedSeat(M, .16, .2, 1.68, .74, 5, 8, 'mattress');
      M.box(1.84, .2, .12, .74, 18, 0, 'wood');
      M.box(.3, .22, .4, .1, 8, 13, '#ffffff', { tex: 'fab' }); M.box(1.3, .22, .4, .1, 8, 13, '#ffffff', { tex: 'fab' });
      if (M.props()) M.box(.6, .55, .7, .35, 2, 13, '#f3d38a', { tex: 'fab' });
    } });
  add({ id: 'bunk-bed', name: 'Bunk bed', tab: 'beds', w: 1, d: 2, kind: 'floor', h: 48, price: 520, use: 'bed', seat: 9, nap: true,
    parts: [['wood', 'wood'], ['quilt', 'fab']],
    swatches: [{ wood: '#cf9d68', quilt: '#7fa7a0' }, { wood: '#fff1e2', quilt: '#e46f8b' }, { wood: '#8e5a37', quilt: '#f3d38a' }, { wood: '#55311d', quilt: '#7d93c4' }],
    draw: function (M) {
      M.shadow(0, 0, 1, 2);
      [[.04, .04], [.84, .04], [.04, 1.84], [.84, 1.84]].forEach(function (q) { M.box(q[0], q[1], .12, .12, 46, 0, 'wood', { hi: false }); });
      [3, 27].forEach(function (z, k) {
        M.box(.16, .16, .68, 1.68, 4, z, 'wood');
        M.box(.18, .16, .64, 1.66, 3, z + 4, '#fff3e6', { tex: 'fab' });
        M.box(.17, .7, .66, 1.12, 2, z + 7, 'quilt');
        M.box(.25, .2, .5, .3, 3, z + 7, '#ffffff', { tex: 'fab' });
      });
      var lad = M.spr(.5, 1.9, 0, function (c, x, y) { if (!M.vis('+v')) return; var W = M.ramp('wood'); R(c, x - 6, y - 34, 1, 34, W[2]); R(c, x + 5, y - 34, 1, 34, W[2]); for (var k = 6; k < 34; k += 7) R(c, x - 6, y - k, 12, 1, W[1]); }, [.1, 34]);
      M.box(.16, .16, .68, .08, 6, 37, 'wood');
    } });
  add({ id: 'cat-tree', name: 'Cat tree', tab: 'beds', w: 1, d: 1, kind: 'floor', h: 50, price: 220, nap: true, seat: 40,
    parts: [['carpet', 'fab'], ['post', 'plain']],
    swatches: [{ carpet: '#e6d3b0', post: '#cf9d68' }, { carpet: '#9cc1b6', post: '#e8dccd' }, { carpet: '#f39bb0', post: '#e8dccd' }, { carpet: '#7d93c4', post: '#cf9d68' }],
    draw: function (M) { // posts wrapped in rope, carpeted platforms and a cubby (Louie's favorite kind of spot)
      M.eshadow(.5, .5, 10);
      M.box(.1, .1, .8, .8, 4, 0, 'carpet');
      var post = M.cyl(.35, .35, .08, 34, 4, 'post');
      M.on(post, function (c) { for (var y = 4; y < 36; y += 3) { var q = M.p(.35, .35, y); R(c, q[0] - 2, q[1], 4, 1, 'rgba(110,70,40,.35)'); } });
      var cub = M.box(.45, .45, .45, .45, 14, 4, 'carpet');
      M.on(cub, function (c) { if (M.vis('+v')) { var q = M.p(.67, .9, 10); c.fillStyle = '#3b2430'; c.beginPath(); c.ellipse(q[0], q[1], 3.5, 4, 0, 0, 7); c.fill(); } });
      M.box(.1, .1, .55, .5, 3, 22, 'carpet');
      M.box(.15, .15, .5, .5, 3, 38, 'carpet');
      if (M.props()) M.spr(.75, .2, 4, function (c, x, y) { R(c, x, y - 18, 1, 14, '#c7bfb5'); c.fillStyle = '#e46f8b'; c.beginPath(); c.arc(x, y - 3, 2, 0, 7); c.fill(); }, [.05, 18]);
    } });

  // ---------- storage ----------
  add({ id: 'low-cabinet', name: 'Low cabinet', tab: 'storage', w: 2, d: 1, kind: 'floor', h: 22, top: 16, price: 220,
    parts: [['wood', 'wood'], ['knob', 'metal']], spots: [[.5, .45], [1.0, .45], [1.5, .45]],
    swatches: [{ wood: '#7fa7a0', knob: '#e7bb4f' }, { wood: '#cf9d68', knob: '#3b3236' }, { wood: '#fff1e2', knob: '#c78f3e' }, { wood: '#55311d', knob: '#e7bb4f' }, { wood: '#f39bb0', knob: '#fff1e2' }],
    draw: function (M, t, free) {
      M.shadow(.08, .1, 1.84, .75);
      legs(M, .12, .14, 1.88, .82, .07, 3, 'wood');
      var b = M.box(.08, .1, 1.84, .75, 13, 3, 'wood');
      M.on(b, function (c) { if (!M.vis('+v')) return; var k = M.ramp('knob'); [.15, .7, 1.25].forEach(function (u) { SS.poly(c, fq(M, u, u + .5, 5, 14, .851), null, 'rgba(59,36,48,.35)'); line(c, M.p(u + .1, .851, 7), M.p(u + .4, .851, 12), 'rgba(255,255,255,.18)'); var q = M.p(u + .42, .851, 10); R(c, q[0], q[1], 1, 1, k[0]); }); });
      if (M.props() && free(2)) M.spr(1.5, .45, 16, function (c, x, y) { R(c, x - 3, y - 6, 6, 6, '#e8a28c'); c.fillStyle = '#6aa361'; c.beginPath(); c.arc(x - 1, y - 8, 3, 0, 7); c.arc(x + 2, y - 9, 2.5, 0, 7); c.fill(); }, [.15, 11]);
    } });
  add({ id: 'wardrobe', name: 'Wardrobe', tab: 'storage', w: 2, d: 1, kind: 'floor', h: 56, price: 460, use: 'wardrobe',
    parts: [['wood', 'wood'], ['knob', 'metal']],
    swatches: [{ wood: '#fff1e2', knob: '#c78f3e' }, { wood: '#cf9d68', knob: '#3b3236' }, { wood: '#9cc1b6', knob: '#fff1e2' }, { wood: '#55311d', knob: '#e7bb4f' }],
    draw: function (M) {
      M.shadow(.08, .08, 1.84, .7);
      legs(M, .12, .12, 1.88, .74, .07, 3, 'wood');
      var b = M.box(.08, .08, 1.84, .7, 50, 3, 'wood');
      M.on(b, function (c) {
        var k = M.ramp('knob');
        if (M.vis('+v')) { line(c, M.p(1, .781, 6), M.p(1, .781, 50), 'rgba(59,36,48,.45)'); [[.2, .9], [1.1, 1.8]].forEach(function (d) { SS.poly(c, fq(M, d[0], d[1], 10, 46, .781), null, 'rgba(59,36,48,.25)'); }); [.92, 1.08].forEach(function (u) { var q = M.p(u, .781, 30); R(c, q[0], q[1] - 3, 1, 4, k[0]); }); }
        var cr = M.p(.1, .08, 53), cr2 = M.p(1.9, .08, 53); line(c, cr, cr2, M.ramp('wood')[0], 2);
      });
    } });
  add({ id: 'corner-counter', name: 'Corner counter', tab: 'storage', row: 'kitchen', w: 1, d: 1, kind: 'floor', h: 24, top: 22, price: 220,
    parts: [['cabinet', 'wood'], ['top', 'plain']], spots: [[.35, .35]],
    swatches: [{ cabinet: '#7fa7a0', top: '#e8dccd' }, { cabinet: '#fff1e2', top: '#cf9d68' }, { cabinet: '#e46f8b', top: '#fff1e2' }, { cabinet: '#4f6a9e', top: '#e8dccd' }, { cabinet: '#8e5a37', top: '#f6ead0' }],
    draw: function (M, t, free) { // the L at the end of a run: the counter top wraps the corner, a door on each side
      var b = M.box(.02, .02, .9, .9, 19, 0, 'cabinet');
      M.on(b, function (c) { if (M.vis('+v')) { SS.poly(c, fq(M, .12, .8, 3, 16, .921), null, 'rgba(59,36,48,.35)'); var q = M.p(.7, .921, 12); R(c, q[0], q[1], 1, 3, '#e7bb4f'); } });
      M.box(0, 0, 1, 1, 3, 19, 'top');
      if (M.props() && free(0)) M.spr(.35, .35, 22, function (c, x, y) { R(c, x - 3, y - 7, 6, 7, '#fff6ea'); R(c, x - 3, y - 7, 6, 1, '#8e5a37'); R(c, x - 2, y - 5, 4, 3, '#f3d38a'); }, [.12, 8]);
    } });

  // ---------- lights ----------
  add({ id: 'mushroom-lamp', name: 'Mushroom lamp', tab: 'lights', w: 1, d: 1, kind: 'small', h: 16, price: 80, lamp: true, use: 'lamp', moves: 'glow',
    parts: [['cap', 'plain'], ['stem', 'plain']], light: { u: .5, v: .5, h: 8, r: 30 },
    swatches: [{ cap: '#e46f6a', stem: '#fff1e2' }, { cap: '#f3d38a', stem: '#fff1e2' }, { cap: '#9cc1b6', stem: '#f6ead0' }, { cap: '#c8a6d8', stem: '#fff1e2' }],
    draw: function (M) { // from mockups/decorate-v1 (the Ours sample): a red-capped mushroom with white spots
      M.spr(.5, .5, 0, function (c, x, y) {
        var Cp = M.ramp('cap'), S = M.ramp('stem'), on = M.inst && M.inst.lit;
        R(c, x - 2, y - 6, 4, 6, S[1]); R(c, x + 1, y - 6, 1, 6, S[2]); R(c, x - 3, y - 1, 6, 1, S[2]);
        c.fillStyle = '#3b2430'; c.beginPath(); c.ellipse(x, y - 7, 8, 6, 0, Math.PI, 0); c.fill();
        c.fillStyle = Cp[1]; c.beginPath(); c.ellipse(x, y - 7, 7, 5, 0, Math.PI, 0); c.fill();
        c.fillStyle = Cp[0]; c.beginPath(); c.ellipse(x - 2, y - 8, 4, 3, 0, Math.PI, 0); c.fill();
        R(c, x - 7, y - 7, 14, 1, on ? '#ffe6a8' : S[2]);
        [[-4, -10], [1, -11], [4, -9], [-1, -8]].forEach(function (d) { R(c, x + d[0], y + d[1], 2, 1, '#fff6ea'); });
      }, [.15, 14]);
    } });
  add({ id: 'string-lights', name: 'String lights', tab: 'lights', w: 2, d: .1, kind: 'wall', mount: 36, h: 10, price: 70, lamp: true, use: 'lamp', moves: 'twinkle', anim: 8,
    parts: [['bulbs', 'plain']], light: { u: 1, v: .1, h: -10, r: 26 },
    swatches: [{ bulbs: '#ffd56b' }, { bulbs: '#f39bb0' }, { bulbs: '#9cc1b6' }, { bulbs: '#fff3a8' }],
    draw: function (M, t) {
      M.spr(1, .05, 0, function (c) {
        var B = M.ramp('bulbs'), on = M.inst && M.inst.lit;
        var pts = []; for (var k = 0; k <= 12; k++) { var u = .05 + k / 12 * 1.9, sag = Math.sin(k / 12 * Math.PI * 2) * 2 - 3 * Math.sin(k / 12 * Math.PI); pts.push([M.p(u, .06, 0), sag]); }
        c.strokeStyle = '#6b4250'; c.beginPath(); pts.forEach(function (q, i) { var x = q[0][0], y = q[0][1] - q[1]; if (i) c.lineTo(x, y); else c.moveTo(x, y); }); c.stroke();
        pts.forEach(function (q, i) { if (i % 2) return; var x = q[0][0], y = q[0][1] - q[1] + 1, lit = on && (Math.floor(t / 2) + i) % 5 !== 0; if (lit) { c.fillStyle = 'rgba(255,225,150,.4)'; c.beginPath(); c.arc(x + 1, y + 1, 2.5, 0, 7); c.fill(); } R(c, x, y, 2, 2, lit ? (i % 4 ? B[0] : B[1]) : '#a08880'); });
      }, [1, 10]);
    } });
  add({ id: 'pendant-light', name: 'Pendant light', tab: 'lights', w: 1, d: 1, kind: 'small', h: 40, price: 140, lamp: true, use: 'lamp', moves: 'glow',
    parts: [['shade', 'plain']], light: { u: .5, v: .5, h: 22, r: 50 },
    swatches: [{ shade: '#f3d38a' }, { shade: '#7fa7a0' }, { shade: '#fff1e2' }, { shade: '#e46f8b' }, { shade: '#3b3236' }],
    draw: function (M) { // hangs from the ceiling over whatever it's set on: a dome shade on a cord
      M.spr(.5, .5, 0, function (c, x, y) {
        var S = M.ramp('shade'), on = M.inst && M.inst.lit, top = y - 28;
        R(c, x, top - 20, 1, 20, '#3b2430');
        c.fillStyle = '#3b2430'; c.beginPath(); c.ellipse(x, top + 4, 9, 7, 0, Math.PI, 0); c.fill();
        c.fillStyle = S[1]; c.beginPath(); c.ellipse(x, top + 4, 8, 6, 0, Math.PI, 0); c.fill();
        c.fillStyle = S[0]; c.beginPath(); c.ellipse(x - 3, top + 3, 3, 4, 0, Math.PI, 0); c.fill();
        R(c, x - 8, top + 4, 16, 1, S[2]);
        if (on) { R(c, x - 3, top + 5, 6, 2, '#fff3cf'); }
      }, [.15, 40]);
    } });
  add({ id: 'candle-cluster', name: 'Candle cluster', tab: 'lights', w: 1, d: 1, kind: 'small', h: 12, price: 45, lamp: true, use: 'lamp', moves: 'flicker', anim: 4,
    parts: [['wax', 'plain']], light: { u: .5, v: .5, h: 8, r: 24 },
    swatches: [{ wax: '#fff1e2' }, { wax: '#f39bb0' }, { wax: '#f3d38a' }, { wax: '#9cc1b6' }],
    draw: function (M, t) {
      M.spr(.5, .5, 0, function (c, x, y) {
        var Wx = M.ramp('wax'), on = M.inst && M.inst.lit;
        R(c, x - 6, y - 1, 12, 2, '#cf9d68');
        [[-4, 7], [0, 10], [4, 5]].forEach(function (cd, i) { R(c, x + cd[0] - 1, y - cd[1], 3, cd[1], Wx[1]); R(c, x + cd[0] - 1, y - cd[1], 1, cd[1], Wx[0]); R(c, x + cd[0], y - cd[1] - 1, 1, 1, '#3b2430'); if (on) R(c, x + cd[0], y - cd[1] - 3 - ((t + i) % 2), 1, 2, '#ffd56b'); });
      }, [.15, 12]);
    } });
  add({ id: 'salt-lamp', name: 'Salt lamp', tab: 'lights', w: 1, d: 1, kind: 'small', h: 12, price: 60, lamp: true, use: 'lamp', moves: 'glow',
    parts: [['rock', 'plain']], light: { u: .5, v: .5, h: 6, r: 26 },
    swatches: [{ rock: '#f2a65a' }, { rock: '#f39bb0' }, { rock: '#f6ead0' }, { rock: '#e99a70' }],
    draw: function (M) {
      M.spr(.5, .5, 0, function (c, x, y) {
        var K = M.ramp('rock'), on = M.inst && M.inst.lit;
        R(c, x - 4, y - 2, 8, 2, '#8e5a37');
        c.fillStyle = on ? K[0] : K[1]; c.beginPath(); c.moveTo(x - 4, y - 2); c.lineTo(x - 5, y - 6); c.lineTo(x - 2, y - 11); c.lineTo(x + 2, y - 10); c.lineTo(x + 4, y - 6); c.lineTo(x + 3, y - 2); c.closePath(); c.fill();
        c.fillStyle = K[2]; c.beginPath(); c.moveTo(x + 1, y - 2); c.lineTo(x + 2, y - 10); c.lineTo(x + 4, y - 6); c.lineTo(x + 3, y - 2); c.closePath(); c.fill();
        R(c, x - 3, y - 8, 2, 1, 'rgba(255,255,255,.5)');
      }, [.12, 11]);
    } });

  // ---------- plants ----------
  add({ id: 'fiddle-leaf-fig', name: 'Fiddle leaf fig', tab: 'plants', w: 1, d: 1, kind: 'floor', h: 56, price: 140, moves: 'sway', anim: 24,
    parts: [['pot', 'plain']], swatches: [{ pot: '#fff1e2' }, { pot: '#cf9d68' }, { pot: '#7fa7a0' }, { pot: '#2f2228' }, { pot: '#e46f8b' }],
    draw: function (M, t) {
      M.eshadow(.5, .5, 8);
      M.cyl(.5, .5, .24, 12, 0, 'pot');
      M.spr(.5, .5, 12, function (c, x, y) {
        var sw = Math.sin(t / 3.8) * 1.2;
        R(c, x, y - 34, 2, 34, '#7a4e33'); R(c, x - 4, y - 24, 5, 1, '#7a4e33'); R(c, x + 1, y - 18, 5, 1, '#7a4e33');
        [[-8, -40, -.3], [6, -42, .3], [-1, -46, 0], [-10, -30, -.5], [9, -32, .5], [-6, -24, -.4], [7, -22, .4], [0, -36, 0]].forEach(function (L, i) {
          var lx = x + L[0] + (i % 2 ? sw : -sw * .6), ly = y + L[1];
          c.fillStyle = '#437a47'; c.beginPath(); c.ellipse(lx, ly, 4.5, 6, L[2], 0, 7); c.fill();
          c.fillStyle = '#6aa361'; c.beginPath(); c.ellipse(lx - 1, ly - 1, 3.5, 4.8, L[2], 0, 7); c.fill();
          R(c, lx - 1, ly - 3, 1, 5, '#8fc47b');
        });
      }, [.3, 46]);
    } });
  add({ id: 'pothos-shelf', name: 'Pothos on a shelf', tab: 'plants', w: 1, d: .3, kind: 'wall', mount: 34, h: 26, price: 80, moves: 'sway', anim: 24,
    parts: [['wood', 'wood'], ['pot', 'plain']], swatches: [{ wood: '#cf9d68', pot: '#e8a28c' }, { wood: '#fff1e2', pot: '#7fa7a0' }, { wood: '#55311d', pot: '#fff1e2' }, { wood: '#7fa7a0', pot: '#f3d38a' }],
    draw: function (M, t) {
      M.box(.1, 0, .8, .28, 2, 0, 'wood');
      M.box(.35, .05, .3, .2, 6, 2, 'pot');
      M.spr(.5, .15, 8, function (c, x, y) {
        var sw = Math.round(Math.sin(t / 3.8));
        [[-6, 4, 12], [5, 2, 16], [0, 0, 8]].forEach(function (v, i) { for (var k = 0; k < v[2]; k += 3) { var lx = x + v[0] + Math.round(Math.sin(k / 4 + i) * 2) + (k > 6 ? sw : 0), ly = y + v[1] + k; c.fillStyle = k % 6 ? '#6aa361' : '#8fc47b'; c.beginPath(); c.ellipse(lx, ly, 2.4, 1.8, .4, 0, 7); c.fill(); } });
        [[-3, -3], [2, -4], [0, -2]].forEach(function (q) { c.fillStyle = '#6aa361'; c.beginPath(); c.ellipse(x + q[0], y + q[1], 2.6, 2, 0, 0, 7); c.fill(); });
      }, [.3, 22]);
    } });
  add({ id: 'herb-pots', name: 'Herb pots', tab: 'plants', w: 1, d: 1, kind: 'small', h: 12, price: 50,
    parts: [['pots', 'plain']], swatches: [{ pots: '#e8a28c' }, { pots: '#fff1e2' }, { pots: '#7fa7a0' }, { pots: '#f3d38a' }],
    draw: function (M) {
      small(M, function (c, x, y) {
        var Pp = M.ramp('pots');
        [[-5, '#6aa361', 'round'], [0, '#8fc47b', 'tall'], [5, '#5f8f4e', 'round']].forEach(function (h) {
          R(c, x + h[0] - 2, y - 4, 4, 4, Pp[1]); R(c, x + h[0] - 2, y - 4, 1, 4, Pp[0]); R(c, x + h[0] - 2, y - 5, 4, 1, Pp[2]);
          if (h[2] === 'tall') { R(c, x + h[0] - 1, y - 11, 1, 6, h[1]); R(c, x + h[0] + 1, y - 10, 1, 5, h[1]); R(c, x + h[0], y - 12, 1, 7, '#a9d38f'); }
          else { c.fillStyle = h[1]; c.beginPath(); c.arc(x + h[0], y - 7, 2.6, 0, 7); c.fill(); R(c, x + h[0] - 1, y - 9, 1, 1, '#a9d38f'); }
        });
      }, [.2, 12]);
    } });
  add({ id: 'hanging-plant', name: 'Hanging plant', tab: 'plants', w: 1, d: .3, kind: 'wall', mount: 26, h: 26, price: 70, moves: 'sway', anim: 24,
    parts: [['pot', 'plain']], swatches: [{ pot: '#fff1e2' }, { pot: '#e8a28c' }, { pot: '#9cc1b6' }, { pot: '#c8a6d8' }],
    draw: function (M, t) { // a macramé hanger from a hook, trailing leaves
      M.spr(.5, .2, 0, function (c, x, y) {
        var Pp = M.ramp('pot'), sw = Math.round(Math.sin(t / 3.8));
        line(c, [x, y - 22], [x - 5, y - 4], '#e6d3b0'); line(c, [x, y - 22], [x + 5, y - 4], '#e6d3b0'); R(c, x - 1, y - 24, 2, 2, '#8e5a37');
        R(c, x - 5, y - 5, 10, 5, Pp[1]); R(c, x - 5, y - 5, 3, 5, Pp[0]); R(c, x + 3, y - 5, 2, 5, Pp[2]);
        for (var k = 0; k < 14; k += 3) { [[-5, 1], [5, 1], [0, 0]].forEach(function (v, i) { if (i === 2 && k > 6) return; var lx = x + v[0] + Math.round(Math.sin(k / 3 + i)) + (k > 4 ? sw : 0), ly = y - 4 + k; c.fillStyle = k % 6 ? '#6aa361' : '#8fc47b'; c.beginPath(); c.ellipse(lx, ly, 2.4, 1.8, .4, 0, 7); c.fill(); }); }
      }, [.2, 24]);
    } });

  // ---------- rugs ----------
  add({ id: 'runner', name: 'Runner', tab: 'rugs', w: 3, d: 1, kind: 'rug', h: 1, price: 110,
    parts: [['field', 'fab'], ['stripe', 'plain']],
    swatches: [{ field: '#9cc1b6', stripe: '#fff1e2' }, { field: '#e99a70', stripe: '#f3d38a' }, { field: '#c8a6d8', stripe: '#e46f8b' }, { field: '#e6d3b0', stripe: '#7fa7a0' }],
    draw: function (M) {
      M.spr(1.5, .5, 0, function (c) {
        var F = M.ramp('field'), S = M.ramp('stripe'), q = function (a, b, cc, d) { return [M.p(a, b), M.p(cc, b), M.p(cc, d), M.p(a, d)]; };
        SS.poly(c, q(.1, .2, 2.9, .8), F[1]);
        [.4, .7, 2.3, 2.6].forEach(function (u) { SS.poly(c, q(u, .2, u + .1, .8), S[1]); });
        SS.poly(c, q(1.2, .35, 1.8, .65), S[0]);
        for (var k = .25; k < .8; k += .12) { var e = M.p(2.9, k), e2 = M.p(.1, k); R(c, e[0], e[1], 2, 1, '#fff1e2'); R(c, e2[0] - 2, e2[1], 2, 1, '#fff1e2'); }
      }, [1.4, 1]);
    } });
  add({ id: 'braided-rug', name: 'Braided rug', tab: 'rugs', w: 2, d: 2, kind: 'rug', h: 1, price: 150,
    parts: [['outer', 'plain'], ['inner', 'plain']],
    swatches: [{ outer: '#c96f45', inner: '#f3d38a' }, { outer: '#7fa7a0', inner: '#f6ead0' }, { outer: '#e46f8b', inner: '#fff1e2' }, { outer: '#7d93c4', inner: '#e6d3b0' }],
    draw: function (M) {
      M.spr(1, 1, 0, function (c, x, y) {
        var O = M.ramp('outer'), In = M.ramp('inner'), rx = .9 * 15.6, ry = rx / 2;
        for (var k = 0; k < 7; k++) { var f = 1 - k * .13; c.fillStyle = [O[1], In[1], O[2], In[0], O[1], In[1], O[0]][k]; c.beginPath(); c.ellipse(x, y, rx * f, ry * f, 0, 0, 7); c.fill(); }
        c.strokeStyle = 'rgba(59,36,48,.18)'; for (var j = 0; j < 7; j++) { var g = 1 - j * .13; c.beginPath(); c.ellipse(x, y, rx * g, ry * g, 0, 0, 7); c.stroke(); }
      }, [.9, 1]);
    } });
  add({ id: 'sheepskin', name: 'Sheepskin', tab: 'rugs', w: 1, d: 1, kind: 'rug', h: 2, price: 90,
    parts: [['wool', 'plain']], swatches: [{ wool: '#fbf6ef' }, { wool: '#e6d3b0' }, { wool: '#d9d0c4' }, { wool: '#f39bb0' }],
    draw: function (M) {
      M.spr(.5, .5, 0, function (c, x, y) {
        var K = M.ramp('wool');
        c.fillStyle = K[2]; c.beginPath(); c.ellipse(x, y + 1, 11, 6, 0, 0, 7); c.fill();
        c.fillStyle = K[1]; c.beginPath(); c.ellipse(x, y, 10, 5, 0, 0, 7); c.fill();
        [[-9, 2], [9, 2], [-6, -4], [6, -4], [-3, 5], [3, 5]].forEach(function (q) { c.fillStyle = K[1]; c.beginPath(); c.arc(x + q[0], y + q[1], 2.4, 0, 7); c.fill(); });
        for (var k = 0; k < 10; k++) R(c, x - 8 + (k * 7) % 16, y - 3 + (k * 5) % 6, 2, 1, K[0]);
      }, [.5, 2]);
    } });

  // ---------- wall ----------
  add({ id: 'gallery-set', name: 'Gallery set', tab: 'wall', w: 2, d: .15, kind: 'wall', mount: 20, h: 30, price: 160,
    parts: [['frames', 'wood']], swatches: [{ frames: '#8e5a37' }, { frames: '#fff1e2' }, { frames: '#2f2228' }, { frames: '#e7bb4f' }],
    draw: function (M) { // four frames of different sizes (decorate-v1's Ours sample), two of them the cats
      var arts = ['#f6ead0', '#9cc1b6', '#f3d38a', '#f39bb0'];
      [[.15, .7, 14, 28], [.85, 1.25, 16, 28], [1.35, 1.85, 6, 24], [.25, .65, 0, 11]].forEach(function (f, i) {
        var b = M.box(f[0], 0, f[1] - f[0], .06, f[3] - f[2], f[2], 'frames');
        M.on(b, function (c) { var q = fq(M, f[0] + .06, f[1] - .06, f[2] + 2, f[3] - 2, .061); SS.poly(c, q, arts[i]); var m = SS.lerp(q[0], q[2], .5); if (i === 0) { R(c, m[0] - 2, m[1] - 1, 4, 3, '#8d8a98'); } if (i === 1) { R(c, m[0] - 2, m[1] - 1, 4, 3, '#d9853f'); } if (i === 2) { c.fillStyle = '#e46f8b'; c.beginPath(); c.arc(m[0], m[1], 2, 0, 7); c.fill(); } });
      });
    } });
  add({ id: 'macrame-hanging', name: 'Macramé hanging', tab: 'wall', w: 1, d: .1, kind: 'wall', mount: 18, h: 26, price: 60,
    parts: [['cord', 'plain'], ['rod', 'wood']], swatches: [{ cord: '#f6ead0', rod: '#8e5a37' }, { cord: '#f39bb0', rod: '#cf9d68' }, { cord: '#9cc1b6', rod: '#fff1e2' }, { cord: '#f3d38a', rod: '#55311d' }],
    draw: function (M) {
      M.spr(.5, .05, 0, function (c, x, y) {
        var K = M.ramp('cord'), Ro = M.ramp('rod');
        R(c, x - 9, y - 26, 18, 2, Ro[1]);
        for (var k = -7; k <= 7; k += 2) { line(c, [x + k, y - 24], [x + k * .4, y - 8], K[1]); }
        [[0, -20], [-3, -16], [3, -16], [0, -12]].forEach(function (q) { R(c, x + q[0] - 1, y + q[1] - 1, 3, 3, K[2]); });
        for (var f = -4; f <= 4; f++) R(c, x + f, y - 8, 1, 6 - Math.abs(f) * .5, K[0]);
      }, [.3, 26]);
    } });
  add({ id: 'cork-board', name: 'Cork board', tab: 'wall', w: 1, d: .1, kind: 'wall', mount: 22, h: 20, price: 50,
    parts: [['frame', 'wood']], swatches: [{ frame: '#cf9d68' }, { frame: '#fff1e2' }, { frame: '#2f2228' }, { frame: '#7fa7a0' }],
    draw: function (M) {
      var b = M.box(.12, 0, .76, .05, 20, 0, 'frame');
      M.on(b, function (c) { var q = fq(M, .17, .83, 2, 18, .051); SS.poly(c, q, '#c9a06a'); var p = SS.lerp(q[0], q[2], .3), p2 = SS.lerp(q[0], q[2], .7); R(c, p[0] - 3, p[1] - 3, 6, 5, '#fff6ea'); R(c, p[0] - 1, p[1] - 4, 2, 2, '#e46f8b'); R(c, p2[0] - 2, p2[1] - 4, 5, 6, '#f3d38a'); R(c, p2[0], p2[1] - 5, 1, 1, '#7fa7a0'); R(c, p[0] + 3, p2[1], 5, 3, '#9cc1b6'); });
    } });
  add({ id: 'mounted-tv', name: 'Mounted TV', tab: 'wall', w: 2, d: .1, kind: 'wall', mount: 18, h: 22, price: 380, use: 'tv',
    parts: [['frame', 'plain']], swatches: [{ frame: '#2f2228' }, { frame: '#fff1e2' }, { frame: '#3b3236' }, { frame: '#8e5a37' }],
    draw: function (M, t) {
      var b = M.box(.2, 0, 1.6, .06, 20, 0, 'frame');
      M.on(b, function (c) { var on = M.inst && M.inst.lit, q = fq(M, .26, 1.74, 2, 18, .061); SS.poly(c, q, on ? ['#7d93c4', '#a9c9e8', '#8fb3d4', '#c8a6d8'][Math.floor(t / 2) % 4] : '#46404a'); SS.clip(c, q, function () { line(c, SS.lerp(q[0], q[3], .2), SS.lerp(q[1], q[2], .6), 'rgba(255,255,255,.18)', 3); }); });
    } });
  add({ id: 'window-plants-shelf', name: 'Window plants shelf', tab: 'wall', w: 1, d: .3, kind: 'wall', mount: 12, h: 14, price: 90, window: true, moves: 'sway', anim: 24,
    parts: [['wood', 'wood']], swatches: [{ wood: '#fff1e2' }, { wood: '#cf9d68' }, { wood: '#7fa7a0' }, { wood: '#55311d' }],
    draw: function (M, t) { // a shelf across the window glass, with three little pots
      M.box(.05, 0, .9, .28, 2, 0, 'wood');
      [.2, .5, .8].forEach(function (u, i) { M.spr(u, .14, 2, function (c, x, y) { R(c, x - 2, y - 4, 4, 4, ['#e8a28c', '#fff1e2', '#9cc1b6'][i]); var sw = Math.round(Math.sin(t / 3.8 + i)); c.fillStyle = '#6aa361'; c.beginPath(); c.arc(x + sw, y - 6, 2.5, 0, 7); c.fill(); R(c, x - 1 + sw, y - 8, 1, 1, '#a9d38f'); }, [.08, 9]); });
    } });

  // ---------- decor ----------
  add({ id: 'throw-pillow', name: 'Throw pillow', tab: 'decor', w: 1, d: 1, kind: 'small', h: 8, price: 30,
    parts: [['fabric', 'fab']], swatches: [{ fabric: '#e46f8b' }, { fabric: '#f3d38a' }, { fabric: '#9cc1b6' }, { fabric: '#c8a6d8' }, { fabric: '#fff1e2' }],
    draw: function (M) { M.box(.3, .38, .4, .14, 8, 0, 'fabric'); } });
  add({ id: 'knit-throw', name: 'Knit throw', tab: 'decor', w: 1, d: 1, kind: 'small', h: 5, price: 45,
    parts: [['yarn', 'fab']], swatches: [{ yarn: '#fbe9e2' }, { yarn: '#f3d38a' }, { yarn: '#9cc1b6' }, { yarn: '#e46f8b' }],
    draw: function (M) { var b = M.box(.25, .3, .5, .4, 4, 0, 'yarn'); M.on(b, function (c) { var Y = M.ramp('yarn'); for (var k = .3; k < .75; k += .1) line(c, M.p(.25, k, 4), M.p(.75, k, 4), Y[2]); if (M.vis('+v')) for (var f = .28; f < .75; f += .08) { var q = M.p(f, .7, 1); R(c, q[0], q[1], 1, 3, Y[1]); } }); } });
  add({ id: 'laundry-basket', name: 'Laundry basket', tab: 'decor', w: 1, d: 1, kind: 'small', h: 14, price: 40,
    parts: [['basket', 'wood']], swatches: [{ basket: '#e8c08e' }, { basket: '#fff1e2' }, { basket: '#9cc1b6' }, { basket: '#f39bb0' }],
    draw: function (M) {
      var b = M.box(.22, .25, .56, .5, 10, 0, 'basket');
      M.on(b, function (c) { [3, 6].forEach(function (h) { line(c, M.p(.22, .75, h), M.p(.78, .75, h), 'rgba(110,60,30,.35)'); }); if (M.props()) { var q = M.p(.5, .5, 11); c.fillStyle = '#f39bb0'; c.beginPath(); c.ellipse(q[0] - 2, q[1], 4, 2, 0, 0, 7); c.fill(); c.fillStyle = '#a9c9e8'; c.beginPath(); c.ellipse(q[0] + 2, q[1] - 1, 3.5, 2, 0, 0, 7); c.fill(); } });
    } });
  add({ id: 'cat-toy-basket', name: 'Cat toy basket', tab: 'decor', w: 1, d: 1, kind: 'small', h: 14, price: 35,
    parts: [['basket', 'wood']], swatches: [{ basket: '#cf9d68' }, { basket: '#e46f8b' }, { basket: '#7fa7a0' }, { basket: '#f3d38a' }],
    draw: function (M) { // Ralph's pile: a little basket with a feather wand and yarn balls
      var b = M.box(.3, .3, .4, .4, 7, 0, 'basket');
      M.on(b, function (c) { line(c, M.p(.3, .7, 4), M.p(.7, .7, 4), 'rgba(110,60,30,.35)'); if (!M.props()) return; var q = M.p(.5, .5, 8); c.fillStyle = '#e46f8b'; c.beginPath(); c.arc(q[0] - 2, q[1], 2, 0, 7); c.fill(); c.fillStyle = '#9cc1b6'; c.beginPath(); c.arc(q[0] + 2, q[1] - 1, 2, 0, 7); c.fill(); line(c, [q[0] + 1, q[1] - 1], [q[0] + 4, q[1] - 10], '#8e5a37'); R(c, q[0] + 3, q[1] - 13, 3, 4, '#f3d38a'); });
    } });
  add({ id: 'candles', name: 'Candles', tab: 'decor', w: 1, d: 1, kind: 'small', h: 10, price: 30, moves: 'flicker', anim: 4,
    parts: [['wax', 'plain']], swatches: [{ wax: '#fff1e2' }, { wax: '#e46f8b' }, { wax: '#f3d38a' }, { wax: '#9cc1b6' }],
    draw: function (M, t) { small(M, function (c, x, y) { var Wx = M.ramp('wax'); [[-2, 6], [2, 8]].forEach(function (cd, i) { R(c, x + cd[0] - 1, y - cd[1], 3, cd[1], Wx[1]); R(c, x + cd[0] - 1, y - cd[1], 1, cd[1], Wx[0]); R(c, x + cd[0], y - cd[1] - 2 - ((t + i) % 2), 1, 2, '#ffd56b'); }); }, [.12, 10]); } });
  add({ id: 'globe', name: 'Globe', tab: 'decor', w: 1, d: 1, kind: 'small', h: 14, price: 55,
    parts: [['stand', 'wood']], swatches: [{ stand: '#8e5a37' }, { stand: '#e7bb4f' }, { stand: '#2f2228' }, { stand: '#fff1e2' }],
    draw: function (M) { small(M, function (c, x, y) { var S = M.ramp('stand'); R(c, x - 3, y - 2, 6, 2, S[1]); R(c, x, y - 4, 1, 2, S[1]); c.fillStyle = '#7d93c4'; c.beginPath(); c.arc(x, y - 9, 5, 0, 7); c.fill(); c.fillStyle = '#8fc47b'; c.fillRect(x - 3, y - 11, 3, 2); c.fillRect(x + 1, y - 8, 2, 3); R(c, x - 3, y - 12, 2, 1, 'rgba(255,255,255,.5)'); c.strokeStyle = S[1]; c.beginPath(); c.arc(x, y - 9, 6, 2.2, 5.2); c.stroke(); }, [.12, 14]); } });
  add({ id: 'fruit-bowl', name: 'Fruit bowl', tab: 'decor', w: 1, d: 1, kind: 'small', h: 8, price: 35,
    parts: [['bowl', 'plain']], swatches: [{ bowl: '#fff1e2' }, { bowl: '#7fa7a0' }, { bowl: '#cf9d68' }, { bowl: '#e46f8b' }],
    draw: function (M) { small(M, function (c, x, y) { var B = M.ramp('bowl'); [[-3, '#e46f6a'], [0, '#f3d38a'], [3, '#8fc47b'], [-1, '#f2a65a']].forEach(function (f, i) { c.fillStyle = f[1]; c.beginPath(); c.arc(x + f[0], y - 5 - (i === 3 ? 2 : 0), 2.2, 0, 7); c.fill(); }); c.fillStyle = B[1]; c.beginPath(); c.ellipse(x, y - 3, 6, 3, 0, 0, Math.PI); c.fill(); R(c, x - 6, y - 4, 12, 1, B[0]); }, [.15, 8]); } });

  SS.DEF = {}; C.forEach(function (d) { SS.DEF[d.id] = d; });
})();
