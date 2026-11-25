// Life sim gift: look mockup v1, isometric warm and cozy living room (Nov 25, 2026). All art drawn in code.
// drawIso(ctx, W, H, t): 240 x H canvas. 2:1 isometric, light from the upper left
// (left-front faces lit, right-front faces in shade). People and cats are placeholders until Keegan's photos.
(function () {
  var TW = 22, TH = 11, N = 10, OX = 120, OY = 132, WALL = 94;
  var c;
  function iso(x, y) { return [OX + (x - y) * TW / 2, OY + (x + y) * TH / 2]; }
  function poly(pts, fill, stroke) {
    c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]);
    c.closePath(); if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = 1; c.stroke(); }
  }
  function up(p, h) { return [p[0], p[1] - h]; }
  function R(x, y, w, h, col) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
  var INK = 'rgba(59,36,48,.85)';
  // A box on the floor grid: tile x,y, size w,d (tiles), height h px, lifted z px. cols = [top, left-front, right-front]
  function box(x, y, w, d, h, cols, z, noLine) {
    z = z || 0;
    var A = up(iso(x, y), z), B = up(iso(x + w, y), z), C = up(iso(x + w, y + d), z), D = up(iso(x, y + d), z);
    poly([D, C, up(C, h), up(D, h)], cols[1]);
    poly([B, C, up(C, h), up(B, h)], cols[2]);
    poly([up(A, h), up(B, h), up(C, h), up(D, h)], cols[0]);
    if (!noLine) {
      poly([up(A, h), up(B, h), B, C, D, up(D, h)], null, INK);
      c.strokeStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.moveTo(up(D, h)[0], up(D, h)[1] + .5); c.lineTo(up(C, h)[0], up(C, h)[1] + .5); c.stroke();
    }
  }
  function shadow(x, y, w, d, spread) {
    spread = spread || .25;
    var A = iso(x - spread + .35, y - spread + .35), B = iso(x + w + spread + .35, y - spread + .35), C = iso(x + w + spread + .35, y + d + spread + .35), D = iso(x - spread + .35, y + d + spread + .35);
    poly([A, B, C, D], 'rgba(90,45,40,.22)');
  }
  function ellipseShadow(px, py, rx) { c.fillStyle = 'rgba(90,45,40,.28)'; c.beginPath(); c.ellipse(px, py, rx, rx / 2, 0, 0, 7); c.fill(); }

  // Warm and cozy palette
  var P = {
    bg1: '#3a2633', bg2: '#22171f',
    wallL: ['#f3d2c4', '#ecc1b2', '#dcab9c'], wallR: ['#e6b7a8', '#d9a596', '#c78f82'],
    trim: '#fff1e2', base: '#b9837f',
    floor: ['#d39a66', '#c88d5a', '#bb8150', '#a96e45'], plank: '#93603c',
    sofa: ['#9cc1b6', '#7fa7a0', '#5d8580'], wood: ['#dca474', '#b9804f', '#8e5a37'], dark: ['#8e5a37', '#704328', '#55311d'],
    rug: '#e7b75f', rugIn: '#f3d38a', rose: '#e46f8b', roseHi: '#f39bb0', roseSh: '#b44f63',
    leaf: '#6aa361', leafHi: '#8fc47b', leafSh: '#437a47', snow: '#f7fbff', sky: '#a9c9e8',
    tray: '#fff6ea', trayEdge: '#e8cdb4', trayInk: '#6b4250', glow: 'rgba(255,214,140,'
  };

  function roomShell(t) {
    var A = iso(0, 0), B = iso(N, 0), D = iso(0, N), C = iso(N, N);
    // floor planks: rows along x
    for (var j = 0; j < N; j++) {
      for (var i = 0; i < N; i++) {
        var a = iso(i, j), b = iso(i + 1, j), cc = iso(i + 1, j + 1), d = iso(i, j + 1);
        var k = (j * 3 + (i >> 1) + (j % 2)) % 4;
        poly([a, b, cc, d], P.floor[k === 3 ? 1 : k]);
      }
      c.strokeStyle = P.plank; c.lineWidth = 1; var s = iso(0, j + 1), e = iso(N, j + 1);
      c.beginPath(); c.moveTo(s[0], s[1]); c.lineTo(e[0], e[1]); c.stroke();
      // plank ends, staggered
      for (var q = (j % 3) + 1; q < N; q += 3) { var p0 = iso(q, j), p1 = iso(q, j + 1); c.beginPath(); c.moveTo(p0[0], p0[1]); c.lineTo(p1[0], p1[1]); c.stroke(); }
    }
    // left wall (along y, at x=0) and right wall (along x, at y=0)
    poly([A, D, up(D, WALL), up(A, WALL)], P.wallL[1]);
    poly([A, B, up(B, WALL), up(A, WALL)], P.wallR[1]);
    // wallpaper: soft vertical stripes with tiny flowers
    for (var y = 0; y < N; y += .5) {
      var p = iso(0, y), q2 = iso(0, y + .25);
      poly([p, q2, up(q2, WALL), up(p, WALL)], (y * 2) % 2 ? P.wallL[0] : P.wallL[1]);
    }
    for (var x = 0; x < N; x += .5) {
      var p2 = iso(x, 0), q3 = iso(x + .25, 0);
      poly([p2, q3, up(q3, WALL), up(p2, WALL)], (x * 2) % 2 ? P.wallR[0] : P.wallR[1]);
    }
    for (var y2 = .5; y2 < N; y2 += 1) for (var hh = 22; hh < WALL - 6; hh += 18) { var f = up(iso(0, y2), hh + (y2 % 2 ? 9 : 0)); R(f[0] - 1, f[1] - 1, 2, 2, '#e79aa0'); }
    for (var x2 = .5; x2 < N; x2 += 1) for (var h2 = 22; h2 < WALL - 6; h2 += 18) { var f2 = up(iso(x2, 0), h2 + (x2 % 2 ? 9 : 0)); R(f2[0] - 1, f2[1] - 1, 2, 2, '#d98790'); }
    // wainscot and baseboard
    poly([A, D, up(D, 18), up(A, 18)], P.wallL[2]); poly([A, B, up(B, 18), up(A, 18)], P.wallR[2]);
    poly([up(A, 18), up(D, 18), up(D, 20), up(A, 20)], P.trim); poly([up(A, 18), up(B, 18), up(B, 20), up(A, 20)], '#f1dcc8');
    poly([A, D, up(D, 3), up(A, 3)], P.base); poly([A, B, up(B, 3), up(A, 3)], '#9e6c69');
    // wall caps (cut-away top edge)
    poly([up(D, WALL), up(A, WALL), up(B, WALL), up(B, WALL + 3), up(A, WALL + 3), up(D, WALL + 3)], P.trim);
    poly([D, up(D, WALL + 3), [D[0] - 3, D[1] - WALL - 1], [D[0] - 3, D[1] + 2]], '#c99a8c');
    poly([B, up(B, WALL + 3), [B[0] + 3, B[1] - WALL - 1], [B[0] + 3, B[1] + 2]], '#a7766b');
    // floor front edge thickness
    poly([D, C, [C[0], C[1] + 5], [D[0], D[1] + 5]], '#7d4c30');
    poly([B, C, [C[0], C[1] + 5], [B[0], B[1] + 5]], '#5e3822');
    // corner shading where the walls meet
    var g = c.createLinearGradient(A[0] - 30, 0, A[0] + 30, 0); g.addColorStop(0, 'rgba(120,60,60,0)'); g.addColorStop(.5, 'rgba(120,60,60,.14)'); g.addColorStop(1, 'rgba(120,60,60,0)');
    c.fillStyle = g; c.fillRect(A[0] - 30, A[1] - WALL, 60, WALL + 10);
  }

  function windowR(x0, t) { // window on the right wall, spans x0..x0+2.4
    var w = 2.4, hb = 34, ht = 78;
    var a = up(iso(x0, 0), hb), b = up(iso(x0 + w, 0), hb), b2 = up(iso(x0 + w, 0), ht), a2 = up(iso(x0, 0), ht);
    poly([[a[0] - 2, a[1] + 3], [b[0] + 2, b[1] + 3], [b2[0] + 2, b2[1] - 3], [a2[0] - 2, a2[1] - 3]], P.trim);
    // sky and snowy roofs of the street outside
    c.save(); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.lineTo(b2[0], b2[1]); c.lineTo(a2[0], a2[1]); c.closePath(); c.clip();
    var g = c.createLinearGradient(0, a2[1], 0, b[1]); g.addColorStop(0, '#7f9fcf'); g.addColorStop(1, '#d6e4f3'); c.fillStyle = g; c.fillRect(a[0] - 2, a2[1] - 4, 60, 70);
    var rx = a[0];
    [[0, 22, '#b46a5a'], [12, 16, '#9e5a4e'], [24, 26, '#b9786a'], [36, 18, '#a05e52']].forEach(function (r) {
      var top = a[1] - 6 - r[1] + (r[0] / 2);
      R(rx + r[0], top, 12, 40, r[2]); R(rx + r[0], top - 3, 12, 3, P.snow);
      for (var yy = top + 4; yy < top + 30; yy += 7) { R(rx + r[0] + 2, yy, 3, 4, '#ffd98a'); R(rx + r[0] + 7, yy, 3, 4, (yy | 0) % 3 ? '#ffd98a' : '#6c4a52'); }
    });
    for (var i = 0; i < 14; i++) { var sx = rx + ((i * 13 + t * (1 + i % 3)) % 50), sy = a2[1] + ((i * 9 + t * 2) % 46); R(sx, sy, 1, 1, '#fff'); }
    c.restore();
    var m1 = up(iso(x0 + w / 2, 0), hb), m2 = up(iso(x0 + w / 2, 0), ht); c.strokeStyle = P.trim; c.lineWidth = 2; c.beginPath(); c.moveTo(m1[0], m1[1]); c.lineTo(m2[0], m2[1]); c.stroke();
    var h1 = up(iso(x0, 0), 56), h3 = up(iso(x0 + w, 0), 56); c.beginPath(); c.moveTo(h1[0], h1[1]); c.lineTo(h3[0], h3[1]); c.stroke();
    // sill
    box(x0 - .1, -.05, w + .2, .35, 3, ['#fff7ee', '#f1dcc8', '#e0c5ad'], hb - 3);
    // curtains
    [[x0 - .55, P.rose], [x0 + w + .05, P.rose]].forEach(function (cu) {
      var p = up(iso(cu[0], 0), 26), q = up(iso(cu[0] + .5, 0), 26), q2 = up(iso(cu[0] + .5, 0), 84), p2 = up(iso(cu[0], 0), 84);
      poly([p, q, q2, p2], P.rose);
      for (var k = 0; k < 3; k++) { var s0 = up(iso(cu[0] + .12 + k * .14, 0), 26), s1 = up(iso(cu[0] + .12 + k * .14, 0), 84); c.strokeStyle = k % 2 ? P.roseSh : P.roseHi; c.lineWidth = 1; c.beginPath(); c.moveTo(s0[0], s0[1]); c.lineTo(s1[0], s1[1]); c.stroke(); }
    });
    var r0 = up(iso(x0 - .7, 0), 86), r1 = up(iso(x0 + w + .7, 0), 86); c.strokeStyle = P.dark[1]; c.lineWidth = 2; c.beginPath(); c.moveTo(r0[0], r0[1]); c.lineTo(r1[0], r1[1]); c.stroke();
    // light shaft on the floor
    var f1 = iso(x0, .1), f2 = iso(x0 + w, .1), f3 = iso(x0 + w + 1.2, 3.6), f4 = iso(x0 + 1.2, 3.6);
    poly([f1, f2, f3, f4], 'rgba(255,244,220,.20)');
  }
  function frameL(y0, hb, w, h, art) { // picture on the left wall
    var a = up(iso(0, y0), hb), b = up(iso(0, y0 + w), hb), b2 = up(iso(0, y0 + w), hb + h), a2 = up(iso(0, y0), hb + h);
    poly([[a[0] + 1, a[1] + 1], [b[0] + 1, b[1] + 1], [b2[0] + 1, b2[1] + 1], [a2[0] + 1, a2[1] + 1]], 'rgba(90,45,40,.25)');
    poly([a, b, b2, a2], P.dark[0]);
    var i1 = up(iso(0, y0 + .12), hb + 3), i2 = up(iso(0, y0 + w - .12), hb + 3), i3 = up(iso(0, y0 + w - .12), hb + h - 3), i4 = up(iso(0, y0 + .12), hb + h - 3);
    poly([i1, i2, i3, i4], '#f6ead0');
    art(i1, i2, i3, i4);
  }
  function shelfL(y0, hb, w) {
    var p = iso(.0, y0), z = hb;
    box(0, y0, .45, w, 2, P.wood, z);
    // books and a tiny plant
    var cols = ['#7fa7a0', '#e46f8b', '#f3d38a', '#9a7bb8', '#e7b75f'];
    for (var i = 0; i < 5; i++) box(.06, y0 + .12 + i * .22, .3, .16, 9 + (i % 2) * 3, [cols[i], cols[i], 'rgba(0,0,0,.25)'], z + 2, true);
    box(.08, y0 + w - .5, .3, .3, 5, ['#d98a6f', '#c0674f', '#94493a'], z + 2, true);
    var tp = up(iso(.23, y0 + w - .35), z + 8);
    c.fillStyle = P.leaf; c.beginPath(); c.arc(tp[0], tp[1], 4, 0, 7); c.fill(); c.fillStyle = P.leafHi; c.beginPath(); c.arc(tp[0] - 1, tp[1] - 2, 2, 0, 7); c.fill();
  }

  function rug(x, y, w, d) {
    var pts = [iso(x, y), iso(x + w, y), iso(x + w, y + d), iso(x, y + d)];
    poly(pts, '#c78f3e');
    var pts2 = [iso(x + .12, y + .12), iso(x + w - .12, y + .12), iso(x + w - .12, y + d - .12), iso(x + .12, y + d - .12)];
    poly(pts2, P.rug);
    poly([iso(x + .5, y + .5), iso(x + w - .5, y + .5), iso(x + w - .5, y + d - .5), iso(x + .5, y + d - .5)], null, P.rose);
    poly([iso(x + .8, y + .8), iso(x + w - .8, y + .8), iso(x + w - .8, y + d - .8), iso(x + .8, y + d - .8)], P.rugIn);
    // diamond motif
    var m = iso(x + w / 2, y + d / 2);
    poly([[m[0], m[1] - 5], [m[0] + 10, m[1]], [m[0], m[1] + 5], [m[0] - 10, m[1]]], P.roseHi);
    // tassels on the front edges
    for (var i = .2; i < w; i += .3) { var e = iso(x + i, y + d); R(e[0], e[1], 1, 2, '#fff1e2'); }
  }
  function sofa(x, y) { // faces +x (back against the left wall); 1.3 deep, 3.2 long
    shadow(x, y, 1.4, 3.4);
    box(x, y, 1.4, 3.4, 8, P.sofa);                       // seat base
    box(x, y, .45, 3.4, 22, ['#a8cbc0', '#86ada5', '#6a928b']); // back
    box(x, y - .05, 1.4, .4, 15, ['#a8cbc0', '#86ada5', '#5d8580']);  // arm near
    box(x, y + 3.05, 1.4, .4, 15, ['#a8cbc0', '#86ada5', '#5d8580']); // arm far
    box(x + .45, y + .4, .9, 1.25, 4, ['#b5d4ca', '#93b8ae', '#6f978f'], 8); // cushions
    box(x + .45, y + 1.7, .9, 1.3, 4, ['#b5d4ca', '#93b8ae', '#6f978f'], 8);
    box(x + .5, y + .55, .2, .7, 9, ['#f3d38a', '#e7b75f', '#c78f3e'], 10); // throw pillows
    box(x + .5, y + 2.2, .2, .7, 9, [P.roseHi, P.rose, P.roseSh], 10);
    // knitted throw over the far arm
    box(x + .25, y + 2.95, 1.1, .5, 2, ['#fbe9e2', '#ecd2c8', '#d6b6ab'], 15);
    for (var i = .35; i < 1.3; i += .25) { var p = up(iso(x + i, y + 3.45), 6); R(p[0], p[1], 1, 9, '#ecd2c8'); }
  }
  function table(x, y) {
    shadow(x, y, 1.2, 1.4);
    [[.08, .08], [1.02, .08], [.08, 1.22], [1.02, 1.22]].forEach(function (l) { box(x + l[0], y + l[1], .1, .1, 8, P.dark, 0, true); });
    box(x, y, 1.2, 1.4, 3, P.wood, 8);
    // mugs and a book
    box(x + .25, y + .3, .25, .25, 5, ['#fff3e6', '#f1dcc8', '#d9bfa6'], 11); var m = up(iso(x + .375, y + .425), 16); R(m[0] - 1, m[1], 3, 1, '#7d4c30');
    box(x + .7, y + .75, .25, .25, 5, [P.roseHi, P.rose, P.roseSh], 11);
    box(x + .3, y + .8, .35, .45, 2, ['#9cc1b6', '#7fa7a0', '#5d8580'], 11);
    // candle with a flicker
    var cp = up(iso(x + .9, y + .3), 16); R(cp[0] - 1, cp[1], 3, 5, '#fff1e2');
  }
  function lamp(x, y, t) {
    var base = iso(x + .25, y + .25), a = .18 + .03 * Math.sin(t / 3);
    var g = c.createRadialGradient(base[0], base[1] - 40, 3, base[0], base[1] - 30, 70); g.addColorStop(0, P.glow + (a + .1) + ')'); g.addColorStop(1, P.glow + '0)');
    c.fillStyle = g; c.fillRect(base[0] - 70, base[1] - 100, 140, 130);
    ellipseShadow(base[0] + 3, base[1] + 2, 6);
    box(x + .1, y + .1, .3, .3, 2, P.dark);
    R(base[0] - 1, base[1] - 42, 2, 40, P.dark[2]);
    var top = base[1] - 50;
    c.fillStyle = '#f6c86e'; c.beginPath(); c.moveTo(base[0] - 6, top); c.lineTo(base[0] + 6, top); c.lineTo(base[0] + 10, top + 12); c.lineTo(base[0] - 10, top + 12); c.closePath(); c.fill();
    c.fillStyle = '#fde3a3'; c.beginPath(); c.moveTo(base[0] - 6, top); c.lineTo(base[0], top); c.lineTo(base[0] - 2, top + 12); c.lineTo(base[0] - 10, top + 12); c.closePath(); c.fill();
    c.fillStyle = '#d9a04e'; c.beginPath(); c.moveTo(base[0] + 3, top); c.lineTo(base[0] + 6, top); c.lineTo(base[0] + 10, top + 12); c.lineTo(base[0] + 5, top + 12); c.closePath(); c.fill();
    c.strokeStyle = INK; c.beginPath(); c.moveTo(base[0] - 6, top); c.lineTo(base[0] + 6, top); c.lineTo(base[0] + 10, top + 12); c.lineTo(base[0] - 10, top + 12); c.closePath(); c.stroke();
  }
  function tree(x, y, t) {
    var b = iso(x + .5, y + .5);
    ellipseShadow(b[0] + 4, b[1] + 2, 16);
    box(x + .1, y + .1, .8, .8, 9, ['#d98a6f', '#c0674f', '#94493a']); // pot/basket
    for (var k = 0; k < 6; k++) { var pb = up(iso(x + .1 + k * .16, y + .9), 2); R(pb[0], pb[1] - 6, 1, 6, '#a3523f'); }
    var cx = b[0], base = b[1] - 9;
    var tiers = [[0, 22, 20], [14, 18, 18], [27, 14, 16], [38, 9, 13]];
    tiers.forEach(function (tr) {
      var yb = base - tr[0], hw = tr[1], hh = tr[2];
      c.fillStyle = P.leafSh; c.beginPath(); c.moveTo(cx, yb - hh); c.lineTo(cx + hw, yb); c.lineTo(cx - hw, yb); c.closePath(); c.fill();
      c.fillStyle = P.leaf; c.beginPath(); c.moveTo(cx, yb - hh); c.lineTo(cx + hw * .15, yb); c.lineTo(cx - hw, yb); c.closePath(); c.fill();
      c.fillStyle = P.leafHi; c.beginPath(); c.moveTo(cx, yb - hh); c.lineTo(cx - hw * .35, yb - hh * .45); c.lineTo(cx - hw * .7, yb - 2); c.lineTo(cx - hw * .5, yb - 2); c.closePath(); c.fill();
      // snowy tips
      for (var s = -hw + 3; s < hw; s += 6) R(cx + s, yb - 1, 3, 1, '#e6f2e4');
      c.strokeStyle = INK; c.beginPath(); c.moveTo(cx, yb - hh); c.lineTo(cx + hw, yb); c.lineTo(cx - hw, yb); c.closePath(); c.stroke();
    });
    // garland
    c.strokeStyle = '#f3d38a'; c.lineWidth = 1;
    [[base - 6, 18], [base - 20, 14], [base - 32, 10]].forEach(function (gl) { c.beginPath(); c.moveTo(cx - gl[1], gl[0] - 4); c.quadraticCurveTo(cx, gl[0] + 3, cx + gl[1], gl[0] - 8); c.stroke(); });
    var lights = [[-14, -4], [-4, -2], [8, -6], [16, -3], [-9, -17], [3, -16], [11, -20], [-5, -29], [6, -31], [0, -40], [-12, -11], [13, -12]];
    var cols = ['#ffd56b', '#e46f8b', '#8fd0ff', '#fff3a8'];
    lights.forEach(function (L, i) {
      var on = (Math.floor(t / 2) + i) % 4 !== 0, col = cols[i % 4];
      if (on) { c.fillStyle = 'rgba(255,230,160,.35)'; c.beginPath(); c.arc(cx + L[0] + 1, base + L[1] + 1, 3, 0, 7); c.fill(); }
      R(cx + L[0], base + L[1], 2, 2, on ? col : '#5a5060');
    });
    // star
    var sy = base - 54; c.fillStyle = '#ffd56b';
    c.beginPath(); for (var p = 0; p < 10; p++) { var r = p % 2 ? 2 : 5, an = -Math.PI / 2 + p * Math.PI / 5; c.lineTo(cx + Math.cos(an) * r, sy + Math.sin(an) * r); } c.closePath(); c.fill();
    c.fillStyle = 'rgba(255,230,140,.3)'; c.beginPath(); c.arc(cx, sy, 8 + (t % 2), 0, 7); c.fill();
    // gifts
    box(x + .9, y + 1.0, .55, .55, 8, [P.roseHi, P.rose, P.roseSh]); var g1 = up(iso(x + 1.175, y + 1.0), 0); R(g1[0] - 1, g1[1] - 10, 2, 10, '#fff1e2');
    box(x - .1, y + 1.05, .6, .45, 6, ['#b5d4ca', '#7fa7a0', '#5d8580']);
    box(x + 1.0, y + .2, .4, .5, 11, ['#fbe7b5', '#f3d38a', '#c78f3e']);
  }
  function plant(x, y, t) {
    var b = iso(x + .3, y + .3); ellipseShadow(b[0] + 2, b[1] + 1, 7);
    box(x, y, .6, .6, 9, ['#e8a28c', '#d98a6f', '#b5624f']);
    var sw = Math.sin(t / 4) * 1.2;
    [[-8, -18, -1], [6, -20, 1], [-2, -26, 0], [9, -12, 1], [-10, -10, -1], [1, -16, 0]].forEach(function (L, i) {
      var lx = b[0] + L[0] + (i % 2 ? sw : 0), ly = b[1] + L[1];
      c.strokeStyle = P.leafSh; c.beginPath(); c.moveTo(b[0], b[1] - 9); c.lineTo(lx, ly + 3); c.stroke();
      c.fillStyle = P.leafSh; c.beginPath(); c.ellipse(lx, ly + 1, 5, 3, L[2] * .6, 0, 7); c.fill();
      c.fillStyle = P.leaf; c.beginPath(); c.ellipse(lx - 1, ly, 4, 2.2, L[2] * .6, 0, 7); c.fill();
      R(lx - 2, ly - 1, 2, 1, P.leafHi);
    });
  }
  function catSit(px, py, coat, t, blinkOff) { // placeholder cat, sitting, 3/4 front
    ellipseShadow(px + 1, py, 7);
    var c1 = coat[0], c2 = coat[1], c3 = coat[2];
    R(px - 5, py - 9, 10, 9, c2); R(px - 5, py - 9, 6, 8, c1); R(px - 4, py - 2, 3, 2, c3); R(px + 1, py - 2, 3, 2, c3);
    R(px - 4, py - 16, 9, 8, c2); R(px - 4, py - 16, 6, 7, c1);
    R(px - 4, py - 19, 2, 3, c1); R(px + 3, py - 19, 2, 3, c2); R(px - 3, py - 18, 1, 1, '#f39bb0');
    var bl = (t + blinkOff) % 14 === 0;
    R(px - 2, py - 13, 1, bl ? 0 : 2, '#3b2430'); R(px + 2, py - 13, 1, bl ? 0 : 2, '#3b2430'); R(px, py - 11, 1, 1, '#e46f8b');
    var tw = Math.round(Math.sin((t + blinkOff) / 2) * 2);
    R(px + 5, py - 4, 4, 2, c2); R(px + 8, py - 6 + tw, 2, 3, c2);
    c.strokeStyle = 'rgba(59,36,48,.5)'; c.strokeRect(px - 5.5, py - 16.5, 10, 16);
  }
  function catLoaf(px, py, coat, t) {
    ellipseShadow(px, py, 9);
    R(px - 8, py - 6, 15, 6, coat[1]); R(px - 8, py - 6, 15, 2, coat[0]);
    R(px + 3, py - 11, 8, 7, coat[1]); R(px + 3, py - 11, 6, 3, coat[0]); R(px + 3, py - 13, 2, 2, coat[0]); R(px + 8, py - 13, 2, 2, coat[1]);
    R(px + 5, py - 8, 2, 1, '#3b2430'); R(px + 8, py - 8, 2, 1, '#3b2430'); // sleepy eyes
    R(px - 10, py - 3, 4, 2, coat[1]);
    if (t % 6 < 3) { c.font = '7px "Press Start 2P", monospace'; c.fillStyle = 'rgba(107,66,80,.7)'; c.fillText('z', px + 10, py - 16 - (t % 3)); }
  }
  function person(px, py, o, t) { // placeholder person, 3/4 front, about 14 x 28
    ellipseShadow(px, py, 7);
    var bob = (t % 4 < 2) ? 0 : 1;
    R(px - 4, py - 7, 3, 7, o.legs); R(px + 1, py - 7, 3, 7, o.legsSh); R(px - 5, py - 1, 4, 2, '#3b2430'); R(px + 1, py - 1, 4, 2, '#3b2430');
    R(px - 6, py - 17 + bob, 12, 11, o.topSh); R(px - 6, py - 17 + bob, 9, 10, o.top); R(px - 5, py - 17 + bob, 4, 2, o.topHi);
    R(px - 8, py - 16 + bob, 3, 8, o.top); R(px + 5, py - 16 + bob, 3, 8, o.topSh); R(px - 8, py - 9 + bob, 3, 2, o.skin); R(px + 5, py - 9 + bob, 3, 2, o.skinSh);
    R(px - 6, py - 30 + bob, 12, 13, o.skinSh); R(px - 6, py - 30 + bob, 10, 12, o.skin);
    o.hair(px, py - 30 + bob);
    R(px - 3, py - 24 + bob, 2, 3, '#3b2430'); R(px + 2, py - 24 + bob, 2, 3, '#3b2430'); R(px - 3, py - 24 + bob, 1, 1, '#fff'); R(px + 2, py - 24 + bob, 1, 1, '#fff');
    R(px - 5, py - 20 + bob, 2, 1, '#f39bb0'); R(px + 3, py - 20 + bob, 2, 1, '#f39bb0'); R(px, py - 19 + bob, 2, 1, '#b44f63');
    c.strokeStyle = 'rgba(59,36,48,.55)'; c.strokeRect(px - 6.5, py - 30.5 + bob, 12, 13);
  }
  function ghostChair(x, y, t) { // armchair being dragged, with the placement grid under it
    for (var i = -1; i <= 2; i++) for (var j = -1; j <= 2; j++) {
      var ok = true; poly([iso(x + i, y + j), iso(x + i + 1, y + j), iso(x + i + 1, y + j + 1), iso(x + i, y + j + 1)], null, 'rgba(255,255,255,.35)');
    }
    poly([iso(x, y), iso(x + 1.3, y), iso(x + 1.3, y + 1.3), iso(x, y + 1.3)], 'rgba(143,208,140,.35)', 'rgba(255,255,255,.9)');
    c.globalAlpha = .92;
    var lift = 6 + Math.round(Math.sin(t / 2));
    box(x, y, 1.3, 1.3, 7, ['#f3d38a', '#e7b75f', '#c78f3e'], lift);
    box(x + .9, y, .4, 1.3, 20, ['#fbe0a0', '#e7b75f', '#b98034'], lift);
    box(x, y - .02, 1.3, .3, 13, ['#fbe0a0', '#e7b75f', '#c78f3e'], lift);
    box(x, y + 1.02, 1.3, .3, 13, ['#fbe0a0', '#e7b75f', '#c78f3e'], lift);
    c.globalAlpha = 1;
    // rotate and confirm chips over the piece
    var top = up(iso(x + .65, y + .65), 40 + lift);
    chip(top[0] + 16, top[1] + 22, '↻'); chip(top[0] + 33, top[1] + 22, '✓');
    // fingertip
    var f = iso(x + 1.1, y + 1.4);
    c.fillStyle = 'rgba(255,255,255,.45)'; c.beginPath(); c.arc(f[0] + 4, f[1] + 2, 7, 0, 7); c.fill(); c.strokeStyle = 'rgba(255,255,255,.95)'; c.stroke();
  }
  function chip(x, y, s) {
    R(x, y, 14, 13, '#fff6ea'); R(x, y + 12, 14, 1, P.trayEdge); c.strokeStyle = P.rose; c.strokeRect(x + .5, y + .5, 13, 12);
    c.font = '10px sans-serif'; c.fillStyle = P.trayInk; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(s, x + 7, y + 7);
  }
  function txt(s, x, y, col, size, align) { c.font = (size || 8) + 'px "Press Start 2P", monospace'; c.fillStyle = col; c.textAlign = align || 'left'; c.textBaseline = 'top'; c.fillText(s, x, y); }
  function topBar(W) {
    R(4, 4, 92, 15, 'rgba(255,246,234,.95)'); R(4, 18, 92, 1, P.trayEdge);
    R(8, 8, 7, 7, P.rose); R(9, 9, 3, 2, P.roseHi);
    txt('SAT 9:00', 19, 8, P.trayInk, 8);
    R(W - 56, 4, 52, 15, 'rgba(255,246,234,.95)'); R(W - 56, 18, 52, 1, P.trayEdge);
    c.fillStyle = '#ffd56b'; c.beginPath(); c.arc(W - 47, 11.5, 4, 0, 7); c.fill(); c.fillStyle = '#fff3a8'; c.fillRect(W - 49, 9, 2, 2);
    txt('120', W - 39, 8, P.trayInk, 8);
  }
  function trayIcons(i, x, y) {
    var save = [OX, OY]; // draw tiny iso icons by temporarily moving the grid
    var icons = [
      function () { R(x + 4, y + 8, 22, 8, '#7fa7a0'); R(x + 4, y + 8, 22, 2, '#a8cbc0'); R(x + 2, y + 3, 26, 6, '#86ada5'); R(x + 1, y + 7, 4, 10, '#5d8580'); R(x + 25, y + 7, 4, 10, '#5d8580'); },
      function () { R(x + 7, y + 3, 16, 7, '#e7b75f'); R(x + 7, y + 3, 16, 2, '#fbe0a0'); R(x + 5, y + 8, 4, 9, '#c78f3e'); R(x + 21, y + 8, 4, 9, '#c78f3e'); R(x + 8, y + 10, 14, 5, '#f3d38a'); },
      function () { R(x + 9, y + 2, 12, 7, '#f6c86e'); R(x + 9, y + 2, 5, 7, '#fde3a3'); R(x + 14, y + 9, 2, 8, '#704328'); R(x + 10, y + 16, 10, 2, '#704328'); },
      function () { R(x + 9, y + 11, 12, 7, '#d98a6f'); R(x + 9, y + 11, 12, 2, '#e8a28c'); R(x + 7, y + 4, 7, 6, '#6aa361'); R(x + 14, y + 1, 7, 8, '#8fc47b'); R(x + 12, y + 6, 6, 5, '#437a47'); },
      function () { R(x + 5, y + 3, 20, 14, '#8e5a37'); R(x + 7, y + 5, 16, 10, '#f6ead0'); R(x + 9, y + 9, 5, 5, P.rose); R(x + 15, y + 7, 6, 7, '#7fa7a0'); }
    ]; icons[i]();
  }
  function tray(W, H) {
    var y = H - 50;
    R(0, y - 2, W, 2, 'rgba(59,36,48,.25)'); R(0, y, W, 50, P.tray); R(0, y, W, 1, '#fffaf3');
    ['HOME', 'STYLE'].forEach(function (s, i) {
      var tx = 6 + i * 52; R(tx, y + 5, 48, 12, i === 0 ? P.rose : P.trayEdge); if (i === 0) R(tx, y + 5, 48, 1, P.roseHi);
      txt(s, tx + 24, y + 7, i === 0 ? '#fff' : P.trayInk, 8, 'center');
    });
    txt('‹ SEATS ›', W - 6, y + 7, P.trayInk, 8, 'right');
    for (var i = 0; i < 5; i++) {
      var sx = 5 + i * 46.5, sy = y + 21;
      R(sx, sy, 43, 25, i === 1 ? '#fde3ea' : '#fbeedd'); R(sx, sy + 24, 43, 1, P.trayEdge);
      if (i === 1) { c.strokeStyle = P.rose; c.lineWidth = 2; c.strokeRect(sx + 1, sy + 1, 41, 23); c.lineWidth = 1; }
      trayIcons(i, sx + 6, sy + 3);
      if (i === 3) { R(sx + 30, sy + 2, 11, 8, '#ffd56b'); txt('40', sx + 31, sy + 3, '#6b4250', 6); }
    }
  }

  window.drawIso = function (ctx, W, H, t) {
    c = ctx; t = t || 0;
    var g = c.createRadialGradient(W / 2, H * .45, 20, W / 2, H * .45, W); g.addColorStop(0, P.bg1); g.addColorStop(1, P.bg2);
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    // gentle snow falling outside the cutaway
    for (var i = 0; i < 26; i++) { var sx = (i * 37 + t * (i % 3 + 1)) % W, sy = (i * 53 + t * 2 * (1 + i % 2)) % (H - 50); c.fillStyle = 'rgba(255,255,255,' + (.25 + (i % 3) * .15) + ')'; c.fillRect(sx, sy, 1 + (i % 4 === 0), 1 + (i % 4 === 0)); }
    roomShell(t);
    windowR(3.3, t);
    frameL(1.0, 44, 1.4, 26, function (a, b, cc, d) { poly([a, b, [b[0], b[1] - 9], [a[0], a[1] - 4]], '#9cc1b6'); var m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 12]; c.fillStyle = '#f3d38a'; c.beginPath(); c.arc(m[0] + 2, m[1] - 2, 3, 0, 7); c.fill(); });
    frameL(2.7, 52, .9, 18, function (a, b) { var m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 6]; c.fillStyle = P.rose; c.beginPath(); c.arc(m[0] - 1, m[1], 2.5, 0, 7); c.arc(m[0] + 2, m[1], 2.5, 0, 7); c.fill(); });
    shelfL(5.2, 46, 2.6);
    // string of fairy lights along the wall tops
    for (var k = .3; k < N; k += .55) {
      var pl = up(iso(0, k), WALL - 6 - Math.abs(Math.sin(k * 2.2)) * 5), pr = up(iso(k, 0), WALL - 6 - Math.abs(Math.sin(k * 2.2)) * 5);
      var on = (Math.floor(t / 2) + Math.round(k * 10)) % 5 !== 0;
      [pl, pr].forEach(function (p, s) { if (on) { c.fillStyle = 'rgba(255,225,150,.35)'; c.beginPath(); c.arc(p[0], p[1], 2.5, 0, 7); c.fill(); } R(p[0] - .5, p[1] - .5, 2, 2, on ? (s ? '#ffd56b' : '#fff3a8') : '#a08880'); });
    }
    rug(2.0, 2.2, 4.6, 4.2);
    // back to front, by depth
    lamp(.2, .3, t);
    sofa(.25, 1.2);
    tree(7.3, .35, t);
    plant(.3, 6.9, t);
    table(2.9, 3.0);
    catLoaf(iso(1.0, 3.6)[0], iso(1.0, 3.6)[1] - 22, ['#f2a65a', '#d9853a', '#a85f24'], t);
    person(iso(5.1, 2.0)[0], iso(5.1, 2.0)[1], {
      skin: '#f1c7a5', skinSh: '#d9a07e', top: '#e46f8b', topSh: '#b44f63', topHi: '#f39bb0', legs: '#5d8580', legsSh: '#3f5f5e',
      hair: function (x, y) { R(x - 7, y - 2, 14, 6, '#6b3d26'); R(x - 7, y - 2, 8, 2, '#8e5a37'); R(x - 7, y + 2, 3, 13, '#6b3d26'); R(x + 5, y + 2, 3, 13, '#55311d'); }
    }, t);
    person(iso(6.9, 4.4)[0], iso(6.9, 4.4)[1], {
      skin: '#eebd98', skinSh: '#d39a74', top: '#7fa7a0', topSh: '#5d8580', topHi: '#a8cbc0', legs: '#55311d', legsSh: '#3b2418',
      hair: function (x, y) { R(x - 7, y - 3, 14, 6, '#3b2a22'); R(x - 7, y - 3, 7, 2, '#5a4034'); R(x - 7, y + 1, 2, 4, '#3b2a22'); R(x + 5, y + 1, 2, 4, '#2a1d17'); }
    }, t + 2);
    catSit(iso(2.2, 7.6)[0], iso(2.2, 7.6)[1], ['#6d6670', '#504a55', '#e8e2e6'], t, 5);
    ghostChair(6.4, 6.9, t);
    // hint line
    txt('DRAG TO PLACE · TAP TO TURN', W / 2, H - 64, 'rgba(255,241,226,.85)', 6, 'center');
    topBar(W);
    tray(W, H);
  };
})();
