// Sarah's Sim catalog, part 2: lights, plants, rugs, wall pieces, decor, the Holiday tab's Christmas tree, and the pieces
// Sarah makes in Life mode (spec 006, part B, Crafts: paintings and seasonal crafts, which go in her Ours tab).
// Wall pieces are drawn in the wall's own space: u runs along the wall, v comes out of it, and mount is how high they hang.
(function () {
  var C = SS.CATALOG, INK = 'rgba(59,36,48,.85)';
  function line(c, a, b, col, w) { SS.line(c, a, b, col, w); }
  function R(c, x, y, w, h, col) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
  function add(def) { def.parts = def.parts || []; def.swatches = def.swatches || [{}]; def.spots = def.spots || []; C.push(def); return def; }
  function fq(M, u0, u1, h0, h1, vv) { return SS.fq(M, u0, u1, h0, h1, vv); }
  function glowAt(c, x, y, r, a) { var g = c.createRadialGradient(x, y, 1, x, y, r); g.addColorStop(0, 'rgba(255,214,140,' + a + ')'); g.addColorStop(1, 'rgba(255,214,140,0)'); c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2); }
  function shade(c, x, top, R0, on) { // the lamp shade from look-iso-v1, lit from inside when on
    c.fillStyle = on ? '#f6c86e' : R0[1]; c.beginPath(); c.moveTo(x - 6, top); c.lineTo(x + 6, top); c.lineTo(x + 10, top + 12); c.lineTo(x - 10, top + 12); c.closePath(); c.fill();
    c.fillStyle = on ? '#fde3a3' : R0[0]; c.beginPath(); c.moveTo(x - 6, top); c.lineTo(x, top); c.lineTo(x - 2, top + 12); c.lineTo(x - 10, top + 12); c.closePath(); c.fill();
    c.fillStyle = on ? '#d9a04e' : R0[2]; c.beginPath(); c.moveTo(x + 3, top); c.lineTo(x + 6, top); c.lineTo(x + 10, top + 12); c.lineTo(x + 5, top + 12); c.closePath(); c.fill();
    c.strokeStyle = INK; c.beginPath(); c.moveTo(x - 6, top); c.lineTo(x + 6, top); c.lineTo(x + 10, top + 12); c.lineTo(x - 10, top + 12); c.closePath(); c.stroke();
  }

  // ---------- lights ----------
  add({ id: 'floor-lamp', name: 'Floor lamp', tab: 'lights', w: 1, d: 1, kind: 'floor', h: 58, price: 150, lamp: true, use: 'lamp', moves: 'glow',
    parts: [['shade', 'fab'], ['pole', 'metal']], light: { u: .5, v: .5, h: 46, r: 64 },
    swatches: [{ shade: '#f3d38a', pole: '#55311d' }, { shade: '#fff1e2', pole: '#c78f3e' }, { shade: '#f39bb0', pole: '#fff1e2' }, { shade: '#9cc1b6', pole: '#3b3236' }, { shade: '#e99a70', pole: '#55311d' }],
    draw: function (M, t) {
      M.eshadow(.5, .5, 5);
      M.box(.35, .35, .3, .3, 2, 0, 'pole');
      M.spr(.5, .5, 0, function (c, x, y) {
        var P = M.ramp('pole'), S = M.ramp('shade'), on = M.inst && M.inst.lit;
        R(c, x - 1, y - 46, 2, 44, P[2]); R(c, x - 1, y - 46, 1, 44, P[0]);
        var top = y - 56; shade(c, x, top, S, on);
        R(c, x - 9, top + 10, 19, 1, P[1]); for (var k = -8; k < 10; k += 3) R(c, x + k, top + 12, 1, 2, P[1]);
        R(c, x + 3, top + 12, 1, 6, '#8e5a37'); R(c, x + 2, top + 18, 3, 2, '#f3d38a');
        if (on) R(c, x - 4, top + 12, 8, 1, '#fff6d8');
      }, [.15, 58]);
    } });
  add({ id: 'table-lamp', name: 'Table lamp', tab: 'lights', w: 1, d: 1, kind: 'small', h: 22, price: 90, lamp: true, use: 'lamp', moves: 'glow',
    parts: [['shade', 'fab'], ['base', 'plain']], light: { u: .5, v: .5, h: 16, r: 40 },
    swatches: [{ shade: '#fff1e2', base: '#7fa7a0' }, { shade: '#f3d38a', base: '#e46f8b' }, { shade: '#f39bb0', base: '#fff1e2' }, { shade: '#e6d3b0', base: '#c96f45' }, { shade: '#9cc1b6', base: '#f6ead0' }],
    draw: function (M) {
      M.spr(.5, .5, 0, function (c, x, y) {
        var B = M.ramp('base'), S = M.ramp('shade'), on = M.inst && M.inst.lit;
        c.fillStyle = 'rgba(90,45,40,.25)'; c.beginPath(); c.ellipse(x + 1, y, 5, 2, 0, 0, 7); c.fill();
        R(c, x - 3, y - 7, 6, 7, B[1]); R(c, x - 3, y - 7, 2, 7, B[0]); R(c, x + 2, y - 7, 1, 7, B[2]); R(c, x - 1, y - 10, 2, 3, '#8e5a37');
        var top = y - 19;
        c.fillStyle = on ? '#fde3a3' : S[1]; c.beginPath(); c.moveTo(x - 4, top); c.lineTo(x + 4, top); c.lineTo(x + 6, top + 9); c.lineTo(x - 6, top + 9); c.closePath(); c.fill();
        c.fillStyle = on ? '#fff3cf' : S[0]; c.beginPath(); c.moveTo(x - 4, top); c.lineTo(x - 1, top); c.lineTo(x - 2, top + 9); c.lineTo(x - 6, top + 9); c.closePath(); c.fill();
        c.strokeStyle = INK; c.beginPath(); c.moveTo(x - 4, top); c.lineTo(x + 4, top); c.lineTo(x + 6, top + 9); c.lineTo(x - 6, top + 9); c.closePath(); c.stroke();
      }, [.15, 20]);
    } });

  // ---------- plants ----------
  function leafFan(c, x, y, leaves, sw, cols) {
    leaves.forEach(function (L, i) {
      var lx = x + L[0] + (i % 2 ? sw : -sw * .5), ly = y + L[1];
      line(c, [x, y], [lx, ly + 3], cols[0]);
      c.fillStyle = cols[0]; c.beginPath(); c.ellipse(lx, ly + 1, L[3] || 7, (L[3] || 7) * .57, L[2] * .5, 0, 7); c.fill();
      c.fillStyle = cols[1]; c.beginPath(); c.ellipse(lx - 1, ly, (L[3] || 7) - 1, ((L[3] || 7) - 1) * .53, L[2] * .5, 0, 7); c.fill();
      R(c, lx - 3, ly - 1, 3, 1, cols[2]);
    });
  }
  add({ id: 'monstera', name: 'Monstera', tab: 'plants', w: 1, d: 1, kind: 'floor', h: 50, price: 120, moves: 'sway', anim: 24,
    parts: [['pot', 'wood']], swatches: [{ pot: '#cf9d68' }, { pot: '#e8a28c' }, { pot: '#fff1e2' }, { pot: '#7fa7a0' }, { pot: '#2f2228' }],
    draw: function (M, t) {
      M.eshadow(.5, .5, 9);
      var P = M.box(.18, .18, .64, .64, 11, 0, 'pot');
      M.spr(.5, .5, 11, function (c, x, y) {
        var sw = Math.sin(t / 3.8) * 1.3;
        leafFan(c, x, y, [[-12, -16, -1], [10, -20, 1], [-2, -30, 0], [13, -8, 1], [-14, -6, -1], [3, -14, 0], [-7, -24, -1], [7, -28, 1]], sw, ['#4e7a40', '#6f9d58', '#a9d38f']);
      }, [.35, 40]);
    } });
  add({ id: 'snake-plant', name: 'Snake plant', tab: 'plants', w: 1, d: 1, kind: 'floor', h: 40, price: 90, moves: 'sway', anim: 24,
    parts: [['pot', 'plain']], swatches: [{ pot: '#fff1e2' }, { pot: '#e46f8b' }, { pot: '#c96f45' }, { pot: '#7d93c4' }, { pot: '#3b3236' }],
    draw: function (M, t) {
      M.eshadow(.5, .5, 7);
      M.cyl(.5, .5, .22, 10, 0, 'pot');
      M.spr(.5, .5, 10, function (c, x, y) {
        var sw = Math.round(Math.sin(t / 3.8) * .8);
        [[-6, 22, -2], [-3, 28, -1], [0, 32, 0], [3, 26, 1], [6, 20, 2], [-1, 18, 0]].forEach(function (L, i) {
          var tip = x + L[0] + L[2] * 2 + (i % 2 ? sw : 0);
          c.fillStyle = i % 2 ? '#437a47' : '#5f8f4e'; c.beginPath(); c.moveTo(x + L[0] - 2, y); c.lineTo(tip, y - L[1]); c.lineTo(x + L[0] + 2, y); c.closePath(); c.fill();
          R(c, x + L[0], y - L[1] * .6, 1, L[1] * .4, '#d9c86a');
          R(c, x + L[0] - 1, y - L[1] * .3, 1, 2, '#8fc47b');
        });
      }, [.25, 32]);
    } });
  add({ id: 'small-succulent', name: 'Small succulent', tab: 'plants', w: 1, d: 1, kind: 'small', h: 10, price: 40,
    parts: [['pot', 'plain']], swatches: [{ pot: '#e8a28c' }, { pot: '#fff1e2' }, { pot: '#7fa7a0' }, { pot: '#f3d38a' }],
    draw: function (M) {
      M.spr(.5, .5, 0, function (c, x, y) {
        var P = M.ramp('pot'); c.fillStyle = 'rgba(90,45,40,.25)'; c.beginPath(); c.ellipse(x + 1, y, 4, 2, 0, 0, 7); c.fill();
        R(c, x - 3, y - 4, 6, 4, P[1]); R(c, x - 3, y - 4, 2, 4, P[0]); R(c, x + 2, y - 4, 1, 4, P[2]); R(c, x - 3, y - 5, 6, 1, P[0]);
        [[-3, -7], [0, -9], [3, -7], [-1, -6], [2, -6]].forEach(function (q, i) { R(c, x + q[0] - 1, y + q[1], 3, 2, i % 2 ? '#8fc4a0' : '#6aa38a'); R(c, x + q[0], y + q[1], 1, 1, '#c4e8cf'); });
      }, [.12, 10]);
    } });

  // ---------- rugs ----------
  add({ id: 'wool-rug', name: 'Wool rug', tab: 'rugs', w: 3, d: 2, kind: 'rug', h: 1, price: 180,
    parts: [['field', 'fab'], ['border', 'plain'], ['motif', 'plain']],
    swatches: [{ field: '#f3d38a', border: '#c78f3e', motif: '#e46f8b' }, { field: '#e9d6c0', border: '#c9827f', motif: '#7fa7a0' }, { field: '#b5d4ca', border: '#5d8580', motif: '#f39bb0' }, { field: '#f39bb0', border: '#b44f63', motif: '#fff1e2' }, { field: '#7d93c4', border: '#4f6a9e', motif: '#f3d38a' }],
    draw: function (M) {
      M.spr(1.5, 1, 0, function (c) {
        var F = M.ramp('field'), B = M.ramp('border'), Mo = M.ramp('motif');
        function q(a, b, cc, d) { return [M.p(a, b), M.p(cc, b), M.p(cc, d), M.p(a, d)]; }
        SS.poly(c, q(.1, .1, 2.9, 1.9), B[1]);
        SS.poly(c, q(.22, .22, 2.78, 1.78), F[1]); var p2 = q(.22, .22, 2.78, 1.78); SS.clip(c, p2, function () { c.fillStyle = 'rgba(0,0,0,.05)'; for (var i = 0; i < 400; i++) { var x = (i * 37) % 120 - 60, y = (i * 53) % 50 - 25, m = M.p(1.5, 1); c.fillRect(m[0] + x, m[1] + y, 1, 1); } });
        SS.poly(c, q(.55, .5, 2.45, 1.5), null, Mo[1]);
        SS.poly(c, q(.8, .7, 2.2, 1.3), F[0]);
        var m = M.p(1.5, 1); SS.poly(c, [[m[0], m[1] - 5], [m[0] + 10, m[1]], [m[0], m[1] + 5], [m[0] - 10, m[1]]], Mo[0], Mo[2]);
        SS.poly(c, [[m[0], m[1] - 2], [m[0] + 4, m[1]], [m[0], m[1] + 2], [m[0] - 4, m[1]]], Mo[1]);
        for (var k = .2; k < 2.85; k += .2) { var e = M.p(k, 1.9), e2 = M.p(k, .1); R(c, e[0], e[1], 1, 2, '#fff1e2'); R(c, e2[0], e2[1] - 2, 1, 2, '#fff1e2'); }
      }, [1.4, 1]);
    } });
  add({ id: 'round-rug', name: 'Round rug', tab: 'rugs', w: 2, d: 2, kind: 'rug', h: 1, price: 140,
    parts: [['field', 'fab'], ['ring', 'plain']],
    swatches: [{ field: '#f39bb0', ring: '#fff1e2' }, { field: '#9cc1b6', ring: '#f3d38a' }, { field: '#e6d3b0', ring: '#c96f45' }, { field: '#c8a6d8', ring: '#fff1e2' }],
    draw: function (M) {
      M.spr(1, 1, 0, function (c, x, y) {
        var F = M.ramp('field'), Rg = M.ramp('ring'), rx = .9 * 15.6, ry = rx / 2;
        [[1, F[2]], [.86, F[1]], [.7, Rg[1]], [.62, F[1]], [.4, Rg[0]], [.32, F[0]]].forEach(function (k) { c.fillStyle = k[1]; c.beginPath(); c.ellipse(x, y, rx * k[0], ry * k[0], 0, 0, 7); c.fill(); });
      }, [.9, 1]);
    } });
  add({ id: 'bath-mat', name: 'Bath mat', tab: 'rugs', w: 1, d: 1, kind: 'rug', h: 1, price: 50,
    parts: [['fabric', 'fab']], swatches: [{ fabric: '#9cc1b6' }, { fabric: '#f39bb0' }, { fabric: '#fff1e2' }, { fabric: '#f3d38a' }],
    draw: function (M) {
      M.spr(.5, .5, 0, function (c) { var F = M.ramp('fabric'); var q = [M.p(.12, .18), M.p(.88, .18), M.p(.88, .82), M.p(.12, .82)]; SS.poly(c, q, F[1]); SS.poly(c, [M.p(.2, .26), M.p(.8, .26), M.p(.8, .74), M.p(.2, .74)], F[0]); for (var k = .2; k < .85; k += .12) { var e = M.p(k, .82); R(c, e[0], e[1], 1, 1, F[2]); } }, [.4, 1]);
    } });

  // ---------- wall ----------
  function frameArt(M, u0, u1, h0, h1, frame, art) {
    var b = M.box(u0, 0, u1 - u0, .08, h1 - h0, h0, frame);
    M.on(b, function (c) { var q = fq(M, u0 + .08, u1 - .08, h0 + 3, h1 - 3, .081); SS.poly(c, q, '#f6ead0'); SS.clip(c, q, function () { art(c, q); }); SS.poly(c, q, null, 'rgba(59,36,48,.4)'); });
    return b;
  }
  var ARTS = [
    function (c, q) { SS.poly(c, [q[0], q[1], [q[1][0], q[1][1] - 9], [q[0][0], q[0][1] - 5]], '#9cc1b6'); var m = SS.lerp(q[3], q[2], .65); c.fillStyle = '#f3d38a'; c.beginPath(); c.arc(m[0], m[1] + 5, 3, 0, 7); c.fill(); },
    function (c, q) { var m = SS.lerp(SS.lerp(q[0], q[2], .5), q[3], .1); c.fillStyle = '#e46f8b'; c.beginPath(); c.arc(m[0] - 2, m[1], 3, 0, 7); c.arc(m[0] + 2, m[1], 3, 0, 7); c.fill(); }
  ];
  add({ id: 'framed-print', name: 'Framed print', tab: 'wall', w: 1, d: .2, kind: 'wall', mount: 28, h: 24, price: 80,
    parts: [['frame', 'wood']], swatches: [{ frame: '#8e5a37' }, { frame: '#fff1e2' }, { frame: '#e7bb4f' }, { frame: '#2f2228' }, { frame: '#e46f8b' }],
    draw: function (M) { frameArt(M, .15, .85, 0, 22, 'frame', ARTS[0]); } });
  add({ id: 'floating-shelf', name: 'Floating shelf', tab: 'wall', w: 1, d: .3, kind: 'wall', mount: 26, h: 16, top: 2, price: 70, spots: [[.3, .15], [.7, .15]],
    parts: [['wood', 'wood']], swatches: [{ wood: '#cf9d68' }, { wood: '#fff1e2' }, { wood: '#55311d' }, { wood: '#7fa7a0' }],
    draw: function (M, t, free) {
      M.box(.05, 0, .9, .3, 2, 0, 'wood');
      if (M.props()) { if (free(0)) { ['#e46f8b', '#7fa7a0', '#f3d38a'].forEach(function (k, i) { M.box(.15 + i * .09, .05, .08, .2, 8 + (i % 2) * 2, 2, k, { cols: [StudioIso.ramp(k)[0], '#fff6ea', StudioIso.ramp(k)[2]] }); }); } if (free(1)) M.spr(.72, .15, 2, function (c, x, y) { R(c, x - 2, y - 5, 5, 5, '#a9c9e8'); R(c, x - 1, y - 8, 1, 3, '#5f8f4e'); R(c, x - 2, y - 9, 2, 2, '#e46f8b'); R(c, x + 1, y - 9, 2, 2, '#f3d38a'); }, [.1, 9]); }
    } });
  add({ id: 'mirror', name: 'Mirror', tab: 'wall', w: 1, d: .15, kind: 'wall', mount: 18, h: 34, price: 110, use: 'wardrobe',
    parts: [['frame', 'wood']], swatches: [{ frame: '#e7bb4f' }, { frame: '#8e5a37' }, { frame: '#fff1e2' }, { frame: '#2f2228' }],
    draw: function (M) { var b = M.box(.25, 0, .5, .06, 32, 0, 'frame'); M.on(b, function (c) { var q = fq(M, .31, .69, 3, 29, .061); SS.poly(c, q, '#cfe1ec'); SS.clip(c, q, function () { line(c, SS.lerp(q[0], q[3], .3), SS.lerp(q[1], q[2], .7), 'rgba(255,255,255,.7)', 2); }); }); } });
  add({ id: 'wall-clock', name: 'Wall clock', tab: 'wall', w: 1, d: .1, kind: 'wall', mount: 44, h: 14, price: 60, moves: 'tick',
    parts: [['frame', 'wood'], ['face', 'plain']], swatches: [{ frame: '#8e5a37', face: '#fff6ea' }, { frame: '#e46f8b', face: '#fff6ea' }, { frame: '#7fa7a0', face: '#fff1e2' }, { frame: '#2f2228', face: '#f6ead0' }],
    draw: function (M) {
      M.spr(.5, .05, 0, function (c, x, y) {
        var F = M.ramp('frame'), Fc = M.ramp('face'), now = new Date(), cy = y - 7;
        c.fillStyle = 'rgba(90,45,40,.25)'; c.beginPath(); c.ellipse(x + 1, cy + 1, 6, 7, 0, 0, 7); c.fill();
        c.fillStyle = F[1]; c.beginPath(); c.ellipse(x, cy, 6, 7, 0, 0, 7); c.fill(); c.strokeStyle = INK; c.stroke();
        c.fillStyle = Fc[1]; c.beginPath(); c.ellipse(x, cy, 4.5, 5.5, 0, 0, 7); c.fill();
        var hr = (now.getHours() % 12 + now.getMinutes() / 60) / 12 * 6.283, mn = now.getMinutes() / 60 * 6.283;
        line(c, [x, cy], [x + Math.sin(hr) * 2.5, cy - Math.cos(hr) * 3], '#3b2430'); line(c, [x, cy], [x + Math.sin(mn) * 3.5, cy - Math.cos(mn) * 4.5], '#3b2430');
      }, [.1, 14]);
    } });
  add({ id: 'curtains', name: 'Curtains', tab: 'wall', w: 1, d: .1, kind: 'wall', mount: 4, h: 44, price: 90, window: true,
    parts: [['fabric', 'fab']], swatches: [{ fabric: '#e46f8b' }, { fabric: '#9cc1b6' }, { fabric: '#f3d38a' }, { fabric: '#fff1e2' }, { fabric: '#9a7bb4' }],
    draw: function (M) {
      var F = M.ramp('fabric');
      [[-.12, .14], [.86, 1.12]].forEach(function (pn) {
        var b = M.box(pn[0], 0, pn[1] - pn[0], .06, 40, 0, 'fabric');
        M.on(b, function (c) { for (var k = 0; k < 3; k++) { var u = pn[0] + .06 + k * .07; line(c, M.p(u, .061, 1), M.p(u, .061, 39), k % 2 ? F[2] : F[0]); } });
      });
      M.box(-.2, .02, 1.4, .04, 2, 41, '#704328', { hi: false });
    } });

  // ---------- decor ----------
  add({ id: 'tv-stand', name: 'TV stand', tab: 'decor', w: 2, d: 1, kind: 'floor', h: 40, price: 260, use: 'tv',
    parts: [['wood', 'wood'], ['screen', 'plain']],
    swatches: [{ wood: '#b9804f', screen: '#2f2228' }, { wood: '#fff1e2', screen: '#2f2228' }, { wood: '#55311d', screen: '#3b3236' }, { wood: '#7fa7a0', screen: '#2f2228' }],
    draw: function (M, t) {
      M.shadow(.1, .2, 1.8, .6);
      var b = M.box(.1, .2, 1.8, .6, 12, 3, 'wood');
      [[.12, .22], [1.78, .22], [.12, .7], [1.78, .7]].forEach(function (q) { M.box(q[0], q[1], .08, .08, 3, 0, 'wood', { hi: false }); });
      M.on(b, function (c) { if (M.vis('+v')) { line(c, M.p(1, .8, 3), M.p(1, .8, 15), 'rgba(59,36,48,.35)'); [.5, 1.5].forEach(function (u) { var k = M.p(u, .8, 10); R(c, k[0], k[1], 2, 1, '#e7bb4f'); }); } });
      var tv = M.box(.35, .38, 1.3, .1, 22, 15, 'screen');
      M.on(tv, function (c) {
        var on = M.inst && M.inst.lit;
        var side = M.vis('+v') ? .481 : M.vis('-v') ? null : null;
        if (side) { var q = fq(M, .41, 1.59, 2 + 15, 20 + 15, side); SS.poly(c, q, on ? ['#7d93c4', '#a9c9e8', '#8fb3d4', '#c8a6d8'][Math.floor(t / 2) % 4] : '#46404a'); SS.clip(c, q, function () { line(c, SS.lerp(q[0], q[3], .2), SS.lerp(q[1], q[2], .6), 'rgba(255,255,255,.18)', 3); }); }
        var st = M.p(1, .43, 15); R(c, st[0] - 3, st[1] - 2, 6, 2, '#3b3236');
      });
    } });
  add({ id: 'record-player', name: 'Record player', tab: 'decor', w: 1, d: 1, kind: 'floor', h: 30, price: 220, moves: 'spin', anim: 8,
    parts: [['wood', 'wood']], swatches: [{ wood: '#b9804f' }, { wood: '#fff1e2' }, { wood: '#55311d' }, { wood: '#9cc1b6' }],
    draw: function (M, t) {
      M.shadow(.1, .2, .8, .6);
      legs(M, .12, .22, .88, .78, .07, 4, 'wood');
      var F = M.box(.1, .2, .8, .6, 14, 4, 'wood');
      M.on(F, function (c) { if (!M.vis('+v')) return; SS.poly(c, fq(M, .14, .86, 6, 16, .801), '#6e4429'); for (var k = 0; k < 6; k++) { var p = M.p(.18 + k * .11, .801, 7); R(c, p[0], p[1] - 8, 2, 8, ['#2f2430', '#e46f8b', '#f3d38a', '#7fa7a0'][k % 4]); } });
      var Pl = M.box(.2, .28, .6, .44, 3, 18, '#f6ead0');
      M.on(Pl, function (c) { var ctr = M.p(.48, .5, 21); c.fillStyle = '#2f2430'; c.beginPath(); c.ellipse(ctr[0], ctr[1], 6, 3, 0, 0, 7); c.fill(); R(c, ctr[0] - 1, ctr[1], 2, 1, '#e46f8b'); var an = (t % 8) * .8; R(c, ctr[0] + Math.cos(an) * 4, ctr[1] + Math.sin(an) * 1.6, 1, 1, '#6b5560'); line(c, M.p(.72, .32, 22), [ctr[0] + 3, ctr[1] - 1], '#d9d0c4'); });
      if (M.props()) M.spr(.75, .3, 24, function (c, x, y) { c.font = '6px sans-serif'; c.fillStyle = 'rgba(255,241,226,.85)'; c.fillText('♪', x, y - (t % 6)); }, [.05, 8]);
    } });
  function legs(M, u0, v0, u1, v1, s, h, part, z) { [[u0, v0], [u1 - s, v0], [u0, v1 - s], [u1 - s, v1 - s]].forEach(function (q) { M.box(q[0], q[1], s, s, h, z || 0, part, { hi: false }); }); }
  add({ id: 'mugs', name: 'Mugs', tab: 'decor', w: 1, d: 1, kind: 'small', h: 10, price: 25, moves: 'steam', anim: 4,
    parts: [['mug', 'plain']], swatches: [{ mug: '#fff3e6' }, { mug: '#e46f8b' }, { mug: '#7fa7a0' }, { mug: '#f3d38a' }],
    draw: function (M, t) {
      M.spr(.5, .5, 0, function (c, x, y) { var K = M.ramp('mug'); [[-3, 0, K], [3, 1, StudioIso.ramp('#e46f8b')]].forEach(function (m) { var mx = x + m[0], my = y + m[1]; c.fillStyle = 'rgba(90,45,40,.25)'; c.fillRect(mx - 2, my, 5, 1); R(c, mx - 2, my - 5, 4, 5, m[2][1]); R(c, mx - 2, my - 5, 1, 5, m[2][0]); R(c, mx + 1, my - 5, 1, 5, m[2][2]); R(c, mx - 2, my - 6, 4, 1, '#7d4c30'); R(c, mx + 2, my - 4, 1, 2, m[2][2]); }); var k = t % 4; R(c, x - 3, y - 9 - k, 1, 2, 'rgba(255,255,255,.6)'); }, [.15, 9]);
    } });
  add({ id: 'book-stack', name: 'Book stack', tab: 'decor', w: 1, d: 1, kind: 'small', h: 8, price: 30,
    parts: [['cover', 'plain']], swatches: [{ cover: '#7fa7a0' }, { cover: '#e46f8b' }, { cover: '#f3d38a' }, { cover: '#9a7bb4' }],
    draw: function (M) { var k = M.ramp('cover'); [[k[1], 0], ['#f39bb0', 2], ['#f3d38a', 4]].forEach(function (b, i) { M.box(.3 + i * .02, .32 - i * .01, .4 - i * .05, .32, 2, b[1], b[0], { cols: [StudioIso.ramp(b[0])[0], '#fff6ea', StudioIso.ramp(b[0])[2]] }); }); } });
  add({ id: 'vase-of-flowers', name: 'Vase of flowers', tab: 'decor', w: 1, d: 1, kind: 'small', h: 16, price: 45,
    parts: [['vase', 'plain'], ['flowers', 'plain']], swatches: [{ vase: '#7fa7a0', flowers: '#e46f8b' }, { vase: '#fff1e2', flowers: '#f3d38a' }, { vase: '#e46f8b', flowers: '#fff1e2' }, { vase: '#4f6a9e', flowers: '#f39bb0' }],
    draw: function (M) { M.spr(.5, .5, 0, function (c, x, y) { var V = M.ramp('vase'), Fl = M.ramp('flowers'); c.fillStyle = 'rgba(90,45,40,.25)'; c.fillRect(x - 3, y, 7, 1); R(c, x - 3, y - 7, 6, 7, V[1]); R(c, x - 3, y - 7, 2, 7, V[0]); R(c, x + 2, y - 7, 1, 7, V[2]); R(c, x - 2, y - 8, 4, 1, V[2]); [[-3, -12], [0, -14], [3, -11], [1, -10]].forEach(function (q, i) { R(c, x + q[0], y + q[1] + 2, 1, 4, '#5f8f4e'); R(c, x + q[0] - 1, y + q[1], 3, 2, i % 2 ? Fl[0] : Fl[1]); R(c, x + q[0], y + q[1], 1, 1, '#ffe9a6'); }); }, [.12, 15]); } });
  add({ id: 'picture-frame', name: 'Picture frame', tab: 'decor', w: 1, d: 1, kind: 'small', h: 10, price: 35,
    parts: [['frame', 'wood']], swatches: [{ frame: '#8e5a37' }, { frame: '#fff1e2' }, { frame: '#e7bb4f' }, { frame: '#e46f8b' }],
    draw: function (M) { M.spr(.5, .5, 0, function (c, x, y) { var F = M.ramp('frame'); R(c, x - 4, y - 9, 8, 9, F[1]); R(c, x - 4, y - 9, 1, 9, F[0]); R(c, x - 3, y - 8, 6, 7, '#f6ead0'); R(c, x - 2, y - 6, 2, 2, '#8d8a98'); R(c, x + 1, y - 6, 2, 2, '#d9853f'); R(c, x - 3, y - 3, 6, 2, '#9cc1b6'); }, [.12, 10]); } });
  // the easel: the 80-piece list has no easel, and Sarah's craft corner needs something to paint at (spec 001, part F;
  // spec 006, part B: "Easel or craft table"). Added as a stand-in; logged in the changelog for Keegan.
  add({ id: 'easel', name: 'Easel', tab: 'decor', w: 1, d: 1, kind: 'floor', h: 44, price: 160, use: 'easel',
    parts: [['wood', 'wood'], ['canvas', 'plain']], swatches: [{ wood: '#cf9d68', canvas: '#fff6ea' }, { wood: '#8e5a37', canvas: '#fff6ea' }, { wood: '#fff1e2', canvas: '#f6ead0' }, { wood: '#7fa7a0', canvas: '#fff6ea' }],
    draw: function (M) {
      M.eshadow(.5, .55, 8);
      M.spr(.5, .55, 0, function (c, x, y) {
        var W = M.ramp('wood'), Cv = M.ramp('canvas'), work = M.inst && M.inst.work;
        line(c, [x - 7, y], [x - 1, y - 40], W[2], 2); line(c, [x + 7, y], [x + 1, y - 40], W[1], 2); line(c, [x, y - 2], [x, y - 38], W[2], 1);
        R(c, x - 9, y - 16, 18, 2, W[1]);
        R(c, x - 9, y - 36, 18, 20, '#3b2430'); R(c, x - 8, y - 35, 16, 18, Cv[1]); R(c, x - 8, y - 35, 16, 2, Cv[0]);
        if (work) { R(c, x - 7, y - 25, 14, 7, '#9cc1b6'); R(c, x - 6, y - 32, 5, 5, '#f3d38a'); R(c, x + 1, y - 29, 5, 4, '#e46f8b'); }
        if (M.props()) { R(c, x + 6, y - 18, 4, 2, '#e46f8b'); R(c, x + 4, y - 18, 2, 2, '#7fa7a0'); }
      }, [.3, 42]);
    } });

  // ---------- holiday ----------
  add({ id: 'christmas-tree', name: 'Christmas tree', tab: 'holiday', w: 1, d: 1, kind: 'floor', h: 66, price: 300, moves: 'twinkle', anim: 8,
    parts: [['basket', 'wood']], swatches: [{ basket: '#c0674f' }, { basket: '#cf9d68' }, { basket: '#fff1e2' }, { basket: '#7fa7a0' }],
    draw: function (M, t) {
      M.eshadow(.5, .5, 13);
      var bk = M.box(.15, .15, .7, .7, 8, 0, 'basket');
      M.spr(.5, .5, 8, function (c, cx, base) {
        [[0, 19, 17], [11, 15, 16], [22, 11, 14], [31, 7, 11]].forEach(function (tr) {
          var yb = base - tr[0], hw = tr[1], hh = tr[2];
          c.fillStyle = '#437a47'; c.beginPath(); c.moveTo(cx, yb - hh); c.lineTo(cx + hw, yb); c.lineTo(cx - hw, yb); c.closePath(); c.fill();
          c.fillStyle = '#6aa361'; c.beginPath(); c.moveTo(cx, yb - hh); c.lineTo(cx + hw * .15, yb); c.lineTo(cx - hw, yb); c.closePath(); c.fill();
          c.fillStyle = '#8fc47b'; c.beginPath(); c.moveTo(cx, yb - hh); c.lineTo(cx - hw * .35, yb - hh * .45); c.lineTo(cx - hw * .7, yb - 2); c.lineTo(cx - hw * .5, yb - 2); c.closePath(); c.fill();
          for (var s = -hw + 3; s < hw; s += 6) R(c, cx + s, yb - 1, 3, 1, '#e6f2e4');
          c.strokeStyle = INK; c.beginPath(); c.moveTo(cx, yb - hh); c.lineTo(cx + hw, yb); c.lineTo(cx - hw, yb); c.closePath(); c.stroke();
        });
        c.strokeStyle = '#f3d38a'; [[base - 5, 15], [base - 17, 12], [base - 27, 8]].forEach(function (gl) { c.beginPath(); c.moveTo(cx - gl[1], gl[0] - 3); c.quadraticCurveTo(cx, gl[0] + 3, cx + gl[1], gl[0] - 7); c.stroke(); });
        var cols = ['#ffd56b', '#e46f8b', '#8fd0ff', '#fff3a8'];
        [[-12, -4], [-3, -2], [7, -5], [13, -3], [-8, -14], [3, -13], [9, -17], [-4, -25], [5, -26], [0, -34], [-10, -9], [11, -10]].forEach(function (L, i) {
          var on = (Math.floor(t / 2) + i) % 4 !== 0; if (on) { c.fillStyle = 'rgba(255,230,160,.35)'; c.beginPath(); c.arc(cx + L[0] + 1, base + L[1] + 1, 2.5, 0, 7); c.fill(); }
          R(c, cx + L[0], base + L[1], 2, 2, on ? cols[i % 4] : '#5a5060');
        });
        var sy = base - 46; c.fillStyle = '#ffd56b'; c.beginPath(); for (var p = 0; p < 10; p++) { var r = p % 2 ? 2 : 4.5, a = -Math.PI / 2 + p * Math.PI / 5; c.lineTo(cx + Math.cos(a) * r, sy + Math.sin(a) * r); } c.closePath(); c.fill();
        c.fillStyle = 'rgba(255,230,140,.3)'; c.beginPath(); c.arc(cx, sy, 7 + (t % 2), 0, 7); c.fill();
      }, [.4, 56]);
      if (M.props()) { var g = M.box(.75, .7, .3, .3, 7, 0, '#e46f8b'); M.on(g, function (c) { var q = M.p(.9, 1.0, 0); R(c, q[0] - 1, q[1] - 8, 2, 8, '#fff1e2'); }); M.box(.05, .8, .35, .25, 6, 0, '#7fa7a0'); }
    } });

  // ---------- made by Sarah in Life mode (Ours tab) ----------
  var PAINTINGS = [
    ['painting-cats', 'Painting: the cats', function (c, q) { SS.poly(c, q, '#f3d2c4'); var m = SS.lerp(SS.lerp(q[0], q[1], .5), SS.lerp(q[3], q[2], .5), .55); R(c, m[0] - 6, m[1] - 2, 5, 5, '#8d8a98'); R(c, m[0] - 5, m[1] - 4, 1, 2, '#8d8a98'); R(c, m[0] + 1, m[1] - 2, 6, 5, '#d9853f'); R(c, m[0] + 5, m[1] - 4, 1, 2, '#d9853f'); }],
    ['painting-sunset', 'Painting: sunset', function (c, q) { var g = c.createLinearGradient(0, q[3][1], 0, q[0][1]); g.addColorStop(0, '#f39bb0'); g.addColorStop(1, '#f3d38a'); SS.poly(c, q, g); var m = SS.lerp(q[0], q[1], .5); c.fillStyle = '#ffd56b'; c.beginPath(); c.arc(m[0], m[1] - 6, 4, 0, 7); c.fill(); SS.poly(c, [q[0], q[1], [q[1][0], q[1][1] - 4], [q[0][0], q[0][1] - 4]], '#7d93c4'); }],
    ['painting-tulips', 'Painting: tulips', function (c, q) { SS.poly(c, q, '#e8f2ea'); for (var i = 0; i < 4; i++) { var p = SS.lerp(q[0], q[1], .2 + i * .2); R(c, p[0], p[1] - 9, 1, 7, '#5f8f4e'); R(c, p[0] - 1, p[1] - 12, 3, 3, ['#e46f8b', '#f3d38a', '#c8a6d8', '#e99a70'][i]); } }],
    ['painting-rowhouse', 'Painting: our rowhouse', function (c, q) { SS.poly(c, q, '#2b1d3a'); var m = SS.lerp(q[0], q[1], .5); R(c, m[0] - 5, m[1] - 13, 10, 12, '#b9584a'); R(c, m[0] - 3, m[1] - 11, 2, 3, '#ffd56b'); R(c, m[0] + 1, m[1] - 11, 2, 3, '#ffd56b'); R(c, m[0] - 1, m[1] - 5, 2, 4, '#3d6b5c'); R(c, m[0] - 6, m[1] - 14, 12, 1, '#fff1e2'); }],
    ['painting-sea', 'Painting: the sea', function (c, q) { SS.poly(c, q, '#a9c9e8'); SS.poly(c, [q[0], q[1], SS.lerp(q[1], q[2], .45), SS.lerp(q[0], q[3], .45)], '#4f6a9e'); var p = SS.lerp(q[0], q[1], .6); R(c, p[0], p[1] - 10, 2, 4, '#fff6ea'); R(c, p[0] - 1, p[1] - 7, 4, 1, '#8e5a37'); }],
    ['painting-hearts', 'Painting: hearts', function (c, q) { SS.poly(c, q, '#fde3ea'); for (var i = 0; i < 3; i++) { var p = SS.lerp(SS.lerp(q[0], q[1], .25 + i * .25), SS.lerp(q[3], q[2], .25 + i * .25), .5 + (i % 2) * .15); c.fillStyle = ['#e46f8b', '#f39bb0', '#b44f63'][i]; c.beginPath(); c.arc(p[0] - 1.5, p[1], 2, 0, 7); c.arc(p[0] + 1.5, p[1], 2, 0, 7); c.fill(); c.beginPath(); c.moveTo(p[0] - 3.5, p[1] + .5); c.lineTo(p[0], p[1] + 4); c.lineTo(p[0] + 3.5, p[1] + .5); c.fill(); } }]
  ];
  PAINTINGS.forEach(function (pt) {
    add({ id: pt[0], name: pt[1], tab: 'ours', craft: 'painting', w: 1, d: .2, kind: 'wall', mount: 24, h: 28, price: 0,
      parts: [['frame', 'wood']], swatches: [{ frame: '#8e5a37' }, { frame: '#fff1e2' }, { frame: '#e7bb4f' }, { frame: '#2f2228' }],
      draw: function (M) { frameArt(M, .12, .88, 0, 26, 'frame', pt[2]); } });
  });
  SS.PAINTING_POOL = PAINTINGS.map(function (p) { return p[0]; });

  // seasonal crafts (spec 006, part B, Crafts: about 4 a season). Simple pieces from three shapes: a garland, a wreath
  // and a small thing for a shelf or table.
  function garland(M, cols, shape) {
    M.spr(.5, .05, 0, function (c, x, y) {
      c.strokeStyle = '#8e5a37'; c.beginPath(); c.moveTo(x - 18, y - 8); c.quadraticCurveTo(x, y + 2, x + 18, y - 8); c.stroke();
      for (var i = 0; i < 6; i++) { var k = (i + .5) / 6, px = x - 18 + 36 * k, py = y - 8 + 20 * k * (1 - k) * 1.0; var col = cols[i % cols.length];
        if (shape === 'flake') { R(c, px - 2, py + 1, 5, 1, col); R(c, px, py - 1, 1, 5, col); R(c, px - 1, py, 3, 3, col); }
        else if (shape === 'leaf') { c.fillStyle = col; c.beginPath(); c.ellipse(px, py + 3, 2, 3, .5, 0, 7); c.fill(); }
        else { c.fillStyle = col; c.beginPath(); c.moveTo(px - 3, py); c.lineTo(px + 3, py); c.lineTo(px, py + 5); c.closePath(); c.fill(); } }
    }, [.5, 12]);
  }
  function wreath(M, ring, dots, bow) {
    M.spr(.5, .05, 0, function (c, x, y) { var cy = y - 8; c.strokeStyle = ring[1]; c.lineWidth = 4; c.beginPath(); c.arc(x, cy, 6, 0, 7); c.stroke(); c.lineWidth = 1; c.strokeStyle = ring[0]; c.beginPath(); c.arc(x - 1, cy - 1, 6, 3.5, 5.5); c.stroke(); dots.forEach(function (d, i) { var a = i * 1.3; R(c, x + Math.cos(a) * 6, cy + Math.sin(a) * 6, 2, 2, d); }); if (bow) { R(c, x - 3, cy + 5, 6, 2, bow); R(c, x - 1, cy + 7, 1, 3, bow); R(c, x + 1, cy + 7, 1, 3, bow); } }, [.3, 16]);
  }
  function smallThing(M, fn) { M.spr(.5, .5, 0, function (c, x, y) { c.fillStyle = 'rgba(90,45,40,.25)'; c.fillRect(x - 4, y, 9, 1); fn(c, x, y); }, [.12, 12]); }
  var CRAFTS = {
    winter: [
      ['snowflake-garland', 'Snowflake garland', 'wall', function (M) { garland(M, ['#fff6ea', '#cfe1ec'], 'flake'); }],
      ['felt-ornaments', 'Felt ornaments', 'small', function (M) { smallThing(M, function (c, x, y) { R(c, x - 4, y - 3, 8, 3, '#cf9d68'); [['#e46f8b', -2], ['#7fa7a0', 1], ['#f3d38a', 3]].forEach(function (o) { c.fillStyle = o[0]; c.beginPath(); c.arc(x + o[1], y - 5, 2, 0, 7); c.fill(); }); }); }],
      ['pinecone-wreath', 'Pinecone wreath', 'wall', function (M) { wreath(M, ['#6aa361', '#437a47'], ['#8e5a37', '#8e5a37', '#e46f8b', '#8e5a37', '#ffd56b'], '#b44f63'); }],
      ['paper-star-lantern', 'Paper star lantern', 'small', function (M) { smallThing(M, function (c, x, y) { c.fillStyle = '#fff3cf'; c.beginPath(); for (var p = 0; p < 10; p++) { var r = p % 2 ? 2 : 5, a = -Math.PI / 2 + p * Math.PI / 5; c.lineTo(x + Math.cos(a) * r, y - 6 + Math.sin(a) * r); } c.closePath(); c.fill(); c.strokeStyle = '#e7b75f'; c.stroke(); }); }]
    ],
    spring: [
      ['pressed-flowers', 'Pressed flowers', 'wall', function (M) { frameArt(M, .25, .75, 0, 18, '#fff1e2', function (c, q) { var m = SS.lerp(q[0], q[2], .5); R(c, m[0] - 1, m[1] - 2, 1, 6, '#5f8f4e'); R(c, m[0] - 3, m[1] - 4, 3, 3, '#f39bb0'); R(c, m[0] + 1, m[1] - 2, 3, 3, '#c8a6d8'); }); }],
      ['flower-crown', 'Flower crown', 'small', function (M) { smallThing(M, function (c, x, y) { c.strokeStyle = '#5f8f4e'; c.beginPath(); c.ellipse(x, y - 2, 5, 2, 0, 0, 7); c.stroke(); [-4, -1, 2, 4].forEach(function (d, i) { R(c, x + d, y - 4 + (i % 2) * 3, 2, 2, ['#f39bb0', '#f3d38a', '#c8a6d8', '#fff1e2'][i]); }); }); }],
      ['painted-eggs', 'Painted eggs', 'small', function (M) { smallThing(M, function (c, x, y) { [['#f39bb0', -3], ['#9cc1b6', 0], ['#f3d38a', 3]].forEach(function (e) { c.fillStyle = e[0]; c.beginPath(); c.ellipse(x + e[1], y - 3, 2, 3, 0, 0, 7); c.fill(); R(c, x + e[1] - 1, y - 3, 3, 1, '#fff6ea'); }); }); }],
      ['paper-tulips', 'Paper tulips', 'small', function (M) { smallThing(M, function (c, x, y) { R(c, x - 2, y - 5, 4, 5, '#fff1e2'); [-2, 0, 2].forEach(function (d, i) { R(c, x + d, y - 10, 1, 5, '#5f8f4e'); R(c, x + d - 1, y - 12, 3, 3, ['#e46f8b', '#f3d38a', '#c8a6d8'][i]); }); }); }]
    ],
    summer: [
      ['wind-chime', 'Wind chime', 'wall', function (M) { M.spr(.5, .05, 0, function (c, x, y) { R(c, x - 6, y - 16, 12, 2, '#cf9d68'); [-5, -2, 1, 4].forEach(function (d, i) { R(c, x + d, y - 14, 1, 3 + i, '#8f8a86'); R(c, x + d, y - 11 + i, 2, 5, ['#a9c9e8', '#9cc1b6', '#c7ced2', '#a9c9e8'][i]); }); }, [.2, 16]); }],
      ['painted-pots', 'Painted pots', 'small', function (M) { smallThing(M, function (c, x, y) { R(c, x - 4, y - 5, 4, 5, '#e99a70'); R(c, x - 3, y - 4, 2, 1, '#fff6ea'); R(c, x + 1, y - 4, 4, 4, '#7fa7a0'); R(c, x + 2, y - 3, 2, 1, '#f3d38a'); R(c, x - 3, y - 8, 2, 3, '#6aa361'); }); }],
      ['shell-frame', 'Shell frame', 'wall', function (M) { frameArt(M, .25, .75, 0, 18, '#f6ead0', function (c, q) { var m = SS.lerp(q[0], q[2], .5); R(c, m[0] - 3, m[1] - 2, 3, 3, '#f39bb0'); R(c, m[0] + 1, m[1], 3, 2, '#f3d38a'); }); }],
      ['sun-catcher', 'Sun catcher', 'wall', function (M) { M.spr(.5, .05, 0, function (c, x, y) { R(c, x, y - 20, 1, 6, '#8f8a86'); c.fillStyle = '#f3d38a'; c.beginPath(); c.arc(x, y - 10, 4, 0, 7); c.fill(); R(c, x - 1, y - 11, 2, 2, '#e99a70'); }, [.2, 20]); }]
    ],
    fall: [
      ['leaf-wreath', 'Leaf wreath', 'wall', function (M) { wreath(M, ['#e7b75f', '#c96f45'], ['#b44f63', '#e7b75f', '#8e5a37', '#c96f45', '#f3d38a'], null); }],
      ['carved-pumpkin', 'Carved pumpkin', 'small', function (M) { smallThing(M, function (c, x, y) { c.fillStyle = '#e7863a'; c.beginPath(); c.ellipse(x, y - 4, 5, 4, 0, 0, 7); c.fill(); R(c, x - 1, y - 9, 2, 2, '#5f8f4e'); R(c, x - 3, y - 5, 2, 1, '#ffd56b'); R(c, x + 1, y - 5, 2, 1, '#ffd56b'); R(c, x - 2, y - 3, 4, 1, '#ffd56b'); }); }],
      ['acorn-bowl', 'Acorn bowl', 'small', function (M) { smallThing(M, function (c, x, y) { R(c, x - 4, y - 3, 8, 3, '#cf9d68'); [-2, 0, 2].forEach(function (d) { R(c, x + d - 1, y - 6, 2, 3, '#b9804f'); R(c, x + d - 1, y - 6, 2, 1, '#6e4429'); }); }); }],
      ['leaf-garland', 'Leaf garland', 'wall', function (M) { garland(M, ['#c96f45', '#e7b75f', '#b44f63'], 'leaf'); }]
    ]
  };
  SS.CRAFT_POOLS = {};
  Object.keys(CRAFTS).forEach(function (season) {
    SS.CRAFT_POOLS[season] = CRAFTS[season].map(function (cr) {
      add({ id: cr[0], name: cr[1], tab: 'ours', craft: season, w: 1, d: cr[2] === 'wall' ? .15 : 1, kind: cr[2], mount: 30, h: 20, price: 0, draw: cr[3] });
      return cr[0];
    });
  });

  SS.DEF = {}; C.forEach(function (d) { SS.DEF[d.id] = d; });
})();
