// Sarah's Sim: Yard screen mockup v1 (Nov 25, 2026), for spec 005 (Garden and yard). All art drawn in code.
// drawYard(ctx, W, H, t, state):
//   'seeds'  summer morning, Life mode: the Seeds tab is open and a tomato packet is dragged onto an empty bed spot.
//   'plant'  a thirsty pepper plant is tapped: its stage, days left and water, with Water, Move and Done.
//   'winter' a winter evening: beds rest under snow, the greenhouse glows, the Pots tab shows winter plants.
// Same 2:1 isometric grid, light and tray as decorate-v1. Needs people-v1.js, louie-v1.js and ralph-v1.js loaded first.
(function () {
  var TW = 22, TH = 11, N = 10, OX = 120, OY = 108, HOUSE = 84, FENCE = 26;
  var c, WIN = false;
  function iso(x, y) { return [OX + (x - y) * TW / 2, OY + (x + y) * TH / 2]; }
  function poly(pts, fill, stroke) {
    c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]);
    c.closePath(); if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = 1; c.stroke(); }
  }
  function up(p, h) { return [p[0], p[1] - h]; }
  function R(x, y, w, h, col) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
  function line(a, b, col, w) { c.strokeStyle = col; c.lineWidth = w || 1; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); c.lineWidth = 1; }
  var INK = 'rgba(59,36,48,.85)';
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
    spread = spread || .2;
    var A = iso(x - spread + .35, y - spread + .35), B = iso(x + w + spread + .35, y - spread + .35), C = iso(x + w + spread + .35, y + d + spread + .35), D = iso(x - spread + .35, y + d + spread + .35);
    poly([A, B, C, D], 'rgba(40,60,30,.22)');
  }
  function ellipseShadow(px, py, rx) { c.fillStyle = WIN ? 'rgba(70,80,120,.22)' : 'rgba(40,60,30,.28)'; c.beginPath(); c.ellipse(px, py, rx, rx / 2, 0, 0, 7); c.fill(); }
  function shade(hex, f) { var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255; function k(v) { return Math.max(0, Math.min(255, Math.round(v * (1 + f)))); } return 'rgb(' + k(r) + ',' + k(g) + ',' + k(b) + ')'; }
  function hash(i, j) { var h = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return h - Math.floor(h); }

  var P = {
    sky: ['#9cc8ea', '#d8ecf6'], skyW: ['#3a3f6e', '#c98a8a'],
    grass: ['#8cc06a', '#7db35e', '#6ea353', '#5c9046'], grassHi: '#a9d47f', grassSh: '#4f7f3d',
    snow: ['#f7fbff', '#e8f0fa', '#d6e2f2', '#c3d2e8'],
    brick: ['#b9573f', '#a84c36', '#8f3f2d'], mortar: '#d9b9a3',
    fence: ['#e7c79a', '#d8b283', '#b98f62'], fenceIn: '#c69e70',
    paver: ['#d08a64', '#c47c57', '#b06c4a'], stone: ['#d8d2c8', '#bdb5aa', '#9d9488'],
    soil: ['#7a5136', '#6a452d', '#563824'], plank: ['#c9935f', '#a9764a', '#83582f'],
    leaf: '#6aa361', leafHi: '#8fc47b', leafSh: '#437a47', leafDk: '#33603a', droop: '#8a9a55', droopSh: '#6b7a40',
    rose: '#e46f8b', roseHi: '#f39bb0', roseSh: '#b44f63', sun: '#ffd56b', sunSh: '#e7a43a', tom: '#e2483e', tomHi: '#ff8a6e',
    tray: '#fff6ea', trayEdge: '#e8cdb4', trayInk: '#6b4250', glow: 'rgba(255,214,140,', water: '#8fd0ff', waterSh: '#4f9fd6'
  };

  // ---------- ground ----------
  function ground() {
    for (var j = 0; j < N; j++) for (var i = 0; i < N; i++) {
      var a = iso(i, j), b = iso(i + 1, j), cc = iso(i + 1, j + 1), d = iso(i, j + 1);
      if (WIN) { poly([a, b, cc, d], P.snow[(hash(i, j) * 2) | 0]); continue; }
      poly([a, b, cc, d], P.grass[(j % 2) * 2 + ((hash(i, j) > .7) ? 1 : 0)]); // mowed stripes
      for (var k = 0; k < 3; k++) { var gx = i + hash(i + k, j) * .9, gy = j + hash(i, j + k) * .9, p = iso(gx, gy); R(p[0], p[1] - 2, 1, 2, k % 2 ? P.grassHi : P.grassSh); }
    }
    if (WIN) { // footprints and soft drifts
      for (var s = 0; s < 7; s++) { var f = iso(2.8 + s * .55, 4.6 + s * .35); R(f[0] - 1, f[1], 2, 1, P.snow[3]); R(f[0] + 3, f[1] - 2, 2, 1, P.snow[3]); }
      for (var q = 0; q < 30; q++) { var p2 = iso(hash(q, 1) * 10, hash(1, q) * 10); R(p2[0], p2[1], 2, 1, '#ffffff'); }
    }
    var A = iso(0, 0), B = iso(N, 0), D = iso(0, N), C = iso(N, N);
    poly([D, C, [C[0], C[1] + 6], [D[0], D[1] + 6]], '#6b4a30'); poly([B, C, [C[0], C[1] + 6], [B[0], B[1] + 6]], '#523621');
    if (!WIN) { for (var e = 0; e < N; e += .5) { var p3 = iso(e, N); R(p3[0], p3[1] - 1, 2, 2, P.grass[3]); var p4 = iso(N, e); R(p4[0], p4[1] - 1, 2, 2, P.grass[2]); } }
    else { poly([D, C, [C[0], C[1] + 2], [D[0], D[1] + 2]], '#ffffff'); poly([B, C, [C[0], C[1] + 2], [B[0], B[1] + 2]], '#e8f0fa'); }
  }
  function surround() { // the brick alley and sidewalk around the yard, so the yard sits on solid ground
    var pts = [iso(0, -3.2), iso(30, -3.2), iso(30, 30), iso(-30, 30), iso(-30, N), iso(0, N)]; // the alley behind the fence too
    poly(pts, WIN ? '#e4ebf4' : '#b27a63');
    c.save(); c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (var i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); c.clip();
    var mortar = WIN ? 'rgba(170,185,210,.5)' : 'rgba(120,70,50,.55)';
    for (var g = -30; g < 30; g += .5) { line(iso(g, -30), iso(g, 30), mortar); }
    for (var h = -30; h < 30; h += 1) for (var k = -30; k < 30; k += 1) { if ((h + k) % 2) continue; var a = iso(k + .25, h + .5), b = iso(k + .25, h + 1); line(a, b, WIN ? 'rgba(255,255,255,.6)' : 'rgba(210,150,120,.45)'); }
    c.restore();
    if (WIN) for (var s = 0; s < 40; s++) { var p = iso(N + hash(s, 7) * 6, hash(7, s) * 14); R(p[0], p[1], 2, 1, '#ffffff'); }
  }
  function patio(x0, y0, w, d) { // brick pavers in a basket weave
    for (var j = y0; j < y0 + d; j++) for (var i = x0; i < x0 + w; i++) {
      var a = iso(i, j), b = iso(i + 1, j), cc = iso(i + 1, j + 1), dd = iso(i, j + 1);
      poly([a, b, cc, dd], WIN ? P.snow[1] : P.paver[(i + j) % 2]);
      if (WIN) continue;
      for (var k = 1; k < 3; k++) {
        if ((i + j) % 2) line(iso(i + k / 3, j), iso(i + k / 3, j + 1), P.paver[2]); else line(iso(i, j + k / 3), iso(i + 1, j + k / 3), P.paver[2]);
      }
      poly([a, b, cc, dd], null, 'rgba(120,70,45,.6)');
    }
    if (WIN) for (var s = 0; s < 12; s++) { var p = iso(x0 + hash(s, 3) * w, y0 + hash(3, s) * d); R(p[0], p[1], 3, 1, P.paver[1]); } // pavers peeking through
  }
  function stone(x, y, r) {
    var p = iso(x, y);
    c.fillStyle = 'rgba(40,60,30,.3)'; c.beginPath(); c.ellipse(p[0] + 1, p[1] + 1, r + 1, (r + 1) / 2, 0, 0, 7); c.fill();
    c.fillStyle = WIN ? P.snow[0] : P.stone[1]; c.beginPath(); c.ellipse(p[0], p[1], r, r / 2, 0, 0, 7); c.fill();
    c.fillStyle = WIN ? '#ffffff' : P.stone[0]; c.beginPath(); c.ellipse(p[0] - 1, p[1] - 1, r * .6, r * .3, 0, 0, 7); c.fill();
    c.strokeStyle = 'rgba(59,36,48,.45)'; c.beginPath(); c.ellipse(p[0], p[1], r, r / 2, 0, 0, 7); c.stroke();
  }

  // ---------- backdrop: sky, the neighbors' backs, a big tree ----------
  function backdrop(W, H, t) {
    var g = c.createLinearGradient(0, 0, 0, OY + 20);
    g.addColorStop(0, WIN ? P.skyW[0] : P.sky[0]); g.addColorStop(1, WIN ? P.skyW[1] : P.sky[1]);
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    if (!WIN) {
      [[30, 22, 18], [180, 16, 22], [210, 40, 14]].forEach(function (cl, i) { // soft clouds drifting
        var x = (cl[0] + t * .4 * (i + 1)) % (W + 40) - 20, y = cl[1];
        c.fillStyle = 'rgba(255,255,255,.85)'; c.beginPath(); c.ellipse(x, y, cl[2], cl[2] * .35, 0, 0, 7); c.ellipse(x + cl[2] * .5, y - 3, cl[2] * .55, cl[2] * .3, 0, 0, 7); c.fill();
      });
    } else {
      c.fillStyle = '#fff6d8'; c.beginPath(); c.arc(206, 22, 7, 0, 7); c.fill(); c.fillStyle = 'rgba(255,240,200,.25)'; c.beginPath(); c.arc(206, 22, 12, 0, 7); c.fill();
      for (var s = 0; s < 18; s++) R(hash(s, 9) * W, hash(9, s) * 60, 1, 1, 'rgba(255,255,255,.8)');
    }
    // the backs of the next street's rowhouses, behind the fence
    [[-1, 2.2, 66, '#9e5a4e'], [2.2, 5.4, 78, '#b46a5a'], [5.4, 8.6, 62, '#8f5d6b'], [8.6, 12, 72, '#a8644f']].forEach(function (b, k) {
      var y = -3.2, a = iso(b[0], y), bb = iso(b[1], y), back = -9;
      // a full building: its right side, its flat roof and parapet, then the back wall facing the yard
      var sb = iso(b[1], back); poly([bb, sb, up(sb, b[2]), up(bb, b[2])], shade(b[3], -.18));
      for (var sh = 6; sh < b[2]; sh += 6) line(up(bb, sh), up(sb, sh), 'rgba(60,30,30,.18)');
      var ab = iso(b[0], back);
      poly([up(a, b[2] + 3), up(bb, b[2] + 3), up(sb, b[2] + 3), up(ab, b[2] + 3)], WIN ? '#f7fbff' : '#7a6a6e');
      poly([up(bb, b[2] + 3), up(sb, b[2] + 3), up(sb, b[2] + 6), up(bb, b[2] + 6)], WIN ? '#e8f0fa' : '#c9b5a3');
      var ch = iso(b[0] + 1, -6); box(b[0] + .8, -6.2, .5, .5, 10, WIN ? ['#f7fbff', '#9e5a4e', '#7d3527'] : ['#8a4a3e', '#9e5a4e', '#7d3527'], b[2] + 3);
      poly([a, bb, up(bb, b[2]), up(a, b[2])], b[3]);
      poly([up(a, b[2]), up(bb, b[2]), up(bb, b[2] + 3), up(a, b[2] + 3)], WIN ? '#f7fbff' : '#e9d6c4');
      for (var wx = .5; wx < b[1] - b[0] - .4; wx += 1.1) for (var wh = 26; wh < b[2] - 8; wh += 20) {
        var p = up(iso(b[0] + wx, y), wh), lit = WIN ? hash(k, wx * wh) > .35 : false;
        poly([p, up(p, 9), up(iso(b[0] + wx + .5, y), wh + 9), iso(b[0] + wx + .5, y)].map(function (q, n) { return n === 3 ? up(q, wh) : q; }), lit ? '#ffd98a' : (WIN ? '#4a3f5e' : '#8fb3cc'));
      }
    });
    // big street tree peeking over
    var tp = up(iso(9.4, -2), 0);
    R(tp[0] - 2, tp[1] - 40, 4, 40, '#6b4a30');
    if (!WIN) {
      [[0, -54, 22], [-14, -44, 15], [14, -46, 16], [-4, -66, 14]].forEach(function (b) { c.fillStyle = P.leafSh; c.beginPath(); c.arc(tp[0] + b[0], tp[1] + b[1], b[2], 0, 7); c.fill(); });
      [[-3, -57, 17], [-15, -46, 10], [10, -50, 11], [-6, -68, 9]].forEach(function (b) { c.fillStyle = P.leaf; c.beginPath(); c.arc(tp[0] + b[0], tp[1] + b[1], b[2], 0, 7); c.fill(); });
      [[-8, -62, 6], [-18, -49, 4], [4, -56, 5]].forEach(function (b) { c.fillStyle = P.leafHi; c.beginPath(); c.arc(tp[0] + b[0], tp[1] + b[1], b[2], 0, 7); c.fill(); });
    } else {
      c.strokeStyle = '#5a4152'; c.lineWidth = 2; [[-16, -70], [14, -64], [0, -80], [-8, -58], [10, -52]].forEach(function (b) { c.beginPath(); c.moveTo(tp[0], tp[1] - 38); c.quadraticCurveTo(tp[0] + b[0] * .3, tp[1] + b[1] * .7, tp[0] + b[0], tp[1] + b[1]); c.stroke(); R(tp[0] + b[0] - 2, tp[1] + b[1] - 1, 5, 2, '#f7fbff'); }); c.lineWidth = 1;
    }
  }

  // ---------- the back of their rowhouse (left plane, x = 0) ----------
  // a neighbor's rowhouse, attached to theirs: back wall on the x = 0 line from y0 to y1, flat roof running back
  function rowBack(y0, y1, h, brick, trim, door) {
    var DEEP = -7, a = iso(0, y0), d = iso(0, y1), ad = iso(DEEP, y0), dd = iso(DEEP, y1);
    poly([a, d, up(d, h), up(a, h)], brick);
    for (var hh = 3; hh < h; hh += 4) line(up(a, hh), up(d, hh), 'rgba(60,25,20,.22)');
    poly([a, d, up(d, 4), up(a, 4)], '#8a7a70');
    var span = y1 - y0;
    [[.18, 30, 60], [.62, 30, 60], [.4, h - 24, h - 6]].forEach(function (w) {
      if (door && w[0] < .3 && w[1] < 40) { var e0 = up(iso(0, y0 + span * .14), 0), e1 = up(iso(0, y0 + span * .3), 0); poly([e0, e1, up(e1, 40), up(e0, 40)], trim); var f0 = up(iso(0, y0 + span * .16), 0), f1 = up(iso(0, y0 + span * .28), 0); poly([f0, f1, up(f1, 37), up(f0, 37)], '#5d4a6e'); return; }
      var y = y0 + span * w[0], p0 = up(iso(0, y), w[1]), p1 = up(iso(0, y + span * .2), w[1]); poly([p0, p1, up(p1, w[2] - w[1]), up(p0, w[2] - w[1])], trim);
      var q0 = up(iso(0, y + span * .02), w[1] + 2), q1 = up(iso(0, y + span * .18), w[1] + 2); poly([q0, q1, up(q1, w[2] - w[1] - 4), up(q0, w[2] - w[1] - 4)], WIN ? '#ffd98a' : '#8fb3cc');
    });
    poly([up(a, h), up(d, h), up(d, h + 4), up(a, h + 4)], WIN ? '#f7fbff' : trim);
    poly([up(a, h + 4), up(d, h + 4), up(dd, h + 4), up(ad, h + 4)], WIN ? '#f7fbff' : '#7a6a6e');
    poly([up(d, h + 4), up(dd, h + 4), up(dd, h + 7), up(d, h + 7)], WIN ? '#e8f0fa' : trim);
    // the party wall line where it meets the next house
    line(a, up(a, h + 4), 'rgba(40,20,20,.5)'); line(d, up(d, h + 4), 'rgba(40,20,20,.5)');
  }
  function house(t) {
    var A = iso(0, 0), D = iso(0, N), DEEP = -7;
    // the rest of the rowhouse: its side wall at the near end, and the flat roof with a parapet, chimney and roof hatch
    var DS = iso(DEEP, N), AS = iso(DEEP, 0);
    poly([D, DS, up(DS, HOUSE + 5), up(D, HOUSE + 5)], '#8f4334');
    for (var hs = 3; hs < HOUSE; hs += 4) line(up(D, hs), up(DS, hs), 'rgba(60,25,20,.25)');
    [[-2.2, 30, 62], [-5.0, 30, 62], [-3.6, HOUSE - 24, HOUSE - 4]].forEach(function (w) { var p0 = up(iso(w[0], N), w[1]), p1 = up(iso(w[0] - 1.1, N), w[1]); poly([p0, p1, up(p1, w[2] - w[1]), up(p0, w[2] - w[1])], '#efe2d2'); var q0 = up(iso(w[0] - .12, N), w[1] + 2), q1 = up(iso(w[0] - .98, N), w[1] + 2); poly([q0, q1, up(q1, w[2] - w[1] - 4), up(q0, w[2] - w[1] - 4)], WIN ? '#ffd98a' : '#9ec3dc'); });
    poly([up(A, HOUSE + 5), up(D, HOUSE + 5), up(DS, HOUSE + 5), up(AS, HOUSE + 5)], WIN ? '#f7fbff' : '#7a6a6e');
    for (var rs = DEEP + 1; rs < 0; rs += 1) line(up(iso(rs, 0), HOUSE + 5), up(iso(rs, N), HOUSE + 5), WIN ? 'rgba(180,195,220,.5)' : 'rgba(60,45,50,.3)');
    poly([up(D, HOUSE + 5), up(DS, HOUSE + 5), up(DS, HOUSE + 9), up(D, HOUSE + 9)], WIN ? '#e8f0fa' : '#efe2d2');
    box(-5.2, 6.6, .7, .7, 14, WIN ? ['#f7fbff', '#9e5a4e', '#7d3527'] : ['#6b3a30', '#9e5a4e', '#7d3527'], HOUSE + 5);
    box(-3.4, 2.4, 1.0, 1.0, 5, WIN ? ['#f7fbff', '#c9bfb2', '#a8a096'] : ['#b9b4ae', '#c9bfb2', '#a8a096'], HOUSE + 5);
    poly([A, D, up(D, HOUSE), up(A, HOUSE)], P.brick[1]);
    for (var h = 3, row = 0; h < HOUSE; h += 4, row++) { // brick courses and joints
      line(up(A, h), up(D, h), P.mortar);
      for (var y = (row % 2) * .25; y < N; y += .5) { var p = up(iso(0, y), h); R(p[0], p[1] - 3, 1, 3, 'rgba(217,185,163,.7)'); }
    }
    for (var k = 0; k < 40; k++) { var y2 = hash(k, 2) * N, h2 = 4 + Math.floor(hash(2, k) * 19) * 4, p2 = up(iso(0, y2), h2); R(p2[0] - 3, p2[1] - 2, 5, 2, hash(k, k) > .5 ? P.brick[0] : P.brick[2]); }
    // stone sill band and cornice
    poly([A, D, up(D, 4), up(A, 4)], '#8a7a70');
    poly([up(A, HOUSE), up(D, HOUSE), up(D, HOUSE + 5), up(A, HOUSE + 5)], WIN ? '#f7fbff' : '#efe2d2');
    poly([up(A, HOUSE - 3), up(D, HOUSE - 3), up(D, HOUSE), up(A, HOUSE)], '#c9b5a3');
    for (var yd = .2; yd < N; yd += .5) { var dp = up(iso(0, yd), HOUSE - 3); R(dp[0] - 1, dp[1], 2, 2, '#a8927f'); }
    var ec = D; poly([ec, up(ec, HOUSE + 5), [ec[0] - 3, ec[1] - HOUSE - 3], [ec[0] - 3, ec[1] + 2]], '#7d3527');
    // downspout
    var ds1 = up(iso(0, 9.2), 0), ds2 = up(iso(0, 9.2), HOUSE - 2); R(ds1[0] - 1, ds2[1], 3, ds1[1] - ds2[1], '#8f8a86'); R(ds1[0] - 1, ds2[1], 1, ds1[1] - ds2[1], '#b9b4ae');
    // kitchen window with a window box
    windowL(3.4, 30, 62, true, t);
    windowL(6.6, 30, 62, false, t);
    windowL(4.9, HOUSE - 2 - 22, HOUSE - 4, false, t, true);
    // back door, glass top, brass knob, and the stone step
    var d0 = 1.3, d1 = 2.4, dh = 42;
    poly([up(iso(0, d0 - .1), 0), up(iso(0, d1 + .1), 0), up(iso(0, d1 + .1), dh + 3), up(iso(0, d0 - .1), dh + 3)], '#efe2d2');
    poly([up(iso(0, d0), 0), up(iso(0, d1), 0), up(iso(0, d1), dh), up(iso(0, d0), dh)], '#3f7a64');
    poly([up(iso(0, d0 + .15), 22), up(iso(0, d1 - .15), 22), up(iso(0, d1 - .15), dh - 4), up(iso(0, d0 + .15), dh - 4)], WIN ? '#ffd98a' : '#cfe3ef');
    line(up(iso(0, (d0 + d1) / 2), 22), up(iso(0, (d0 + d1) / 2), dh - 4), '#3f7a64');
    poly([up(iso(0, d0 + .15), 6), up(iso(0, d1 - .15), 6), up(iso(0, d1 - .15), 18), up(iso(0, d0 + .15), 18)], '#356a56');
    var kb = up(iso(0, d1 - .3), 20); R(kb[0] - 1, kb[1], 2, 2, '#e7bb4f');
    if (WIN) { var wr = up(iso(0, (d0 + d1) / 2), 32); c.strokeStyle = P.leafSh; c.lineWidth = 3; c.beginPath(); c.arc(wr[0], wr[1], 5, 0, 7); c.stroke(); c.lineWidth = 1; R(wr[0] - 1, wr[1] + 4, 3, 2, '#d2363c'); }
    box(.05, d0 - .2, .7, d1 - d0 + .4, 5, WIN ? P.snow : P.stone);
    // a little lantern by the door
    var ln = up(iso(0, d0 - .45), 34); R(ln[0] - 2, ln[1], 4, 6, '#3b2430'); R(ln[0] - 1, ln[1] + 1, 2, 4, WIN ? '#ffe08a' : '#e8d9b0');
    if (WIN) { var g = c.createRadialGradient(ln[0], ln[1] + 3, 1, ln[0], ln[1] + 3, 22); g.addColorStop(0, P.glow + '.5)'); g.addColorStop(1, P.glow + '0)'); c.fillStyle = g; c.fillRect(ln[0] - 22, ln[1] - 19, 44, 44); }
  }
  function windowL(y0, hb, ht, box1, t, small) {
    var w = small ? 1.1 : 1.3;
    var a = up(iso(0, y0), hb), b = up(iso(0, y0 + w), hb), b2 = up(iso(0, y0 + w), ht), a2 = up(iso(0, y0), ht);
    poly([[a[0] + 2, a[1] + 1 + 2], [b[0] - 2, b[1] + 2 + 2], [b2[0] - 2, b2[1] - 3], [a2[0] + 2, a2[1] - 3]], '#efe2d2');
    var inside = WIN ? '#ffcf7a' : '#cfe3ef';
    poly([a, b, b2, a2], inside);
    if (WIN) { var g = c.createLinearGradient(0, a2[1], 0, a[1]); g.addColorStop(0, 'rgba(255,240,190,.6)'); g.addColorStop(1, 'rgba(230,140,80,.5)'); c.fillStyle = g; poly([a, b, b2, a2], null); c.fill(); }
    else { c.save(); poly([a, b, b2, a2], null); c.clip(); c.fillStyle = 'rgba(255,255,255,.6)'; c.beginPath(); c.moveTo(a2[0] + 3, a2[1]); c.lineTo(a2[0] + 7, a2[1]); c.lineTo(a[0] + 1, a[1] - 4); c.lineTo(a[0] - 3, a[1] - 4); c.fill(); c.restore(); }
    // curtains inside
    poly([a2, up(iso(0, y0 + .28), ht), up(iso(0, y0 + .2), hb + 2), a], P.rose);
    poly([b2, up(iso(0, y0 + w - .28), ht), up(iso(0, y0 + w - .2), hb + 2), b], P.roseSh);
    var m1 = up(iso(0, y0 + w / 2), hb), m2 = up(iso(0, y0 + w / 2), ht); line(m1, m2, '#efe2d2', 2);
    var h1 = up(iso(0, y0), (hb + ht) / 2), h2 = up(iso(0, y0 + w), (hb + ht) / 2); line(h1, h2, '#efe2d2', 2);
    box(.0, y0 - .1, .35, w + .2, 3, WIN ? P.snow : ['#f4ebe0', '#e0d2c2', '#c9b5a3'], hb - 3);
    if (box1) { // window box of flowers
      box(.02, y0 - .05, .4, w + .1, 6, P.plank, hb - 10);
      if (!WIN) for (var k = 0; k < 7; k++) { var p = up(iso(.2, y0 + .05 + k * .18), hb - 3); R(p[0] - 1, p[1] - 3, 3, 3, P.leaf); R(p[0], p[1] - 4, 2, 2, [P.rose, P.sun, '#c8a6d8', P.roseHi][k % 4]); }
      else for (var k2 = 0; k2 < 5; k2++) { var p2 = up(iso(.2, y0 + .1 + k2 * .26), hb - 4); R(p2[0] - 2, p2[1] - 4, 4, 4, P.leafDk); R(p2[0], p2[1] - 2, 1, 1, '#d2363c'); R(p2[0] - 2, p2[1] - 5, 4, 1, '#f7fbff'); }
    }
  }

  // ---------- the wooden fence (right plane, y = 0) ----------
  function fence(t) {
    var A = iso(0, 0), B = iso(N, 0);
    for (var x = 0; x < N; x += .25) { // boards with pointed tops
      var p = iso(x, 0), q = iso(x + .25, 0), k = Math.round(x * 4) % 3;
      poly([p, q, up(q, FENCE), up([(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], FENCE + 2), up(p, FENCE)], WIN ? ['#d8c3a8', '#cbb497', '#c0a98c'][k] : P.fence[k]);
      line(up(q, 0), up(q, FENCE), 'rgba(120,80,50,.45)');
      if (WIN) R(p[0], p[1] - FENCE - 1, 3, 2, '#f7fbff');
    }
    [6, 19].forEach(function (h) { poly([up(A, h), up(B, h), up(B, h + 3), up(A, h + 3)], WIN ? '#b49b7e' : P.fenceIn); });
    for (var px = 2.5; px < N; px += 2.5) { var pp = iso(px, 0); R(pp[0] - 1, pp[1] - FENCE - 4, 3, FENCE + 4, WIN ? '#a78e72' : P.fence[2]); R(pp[0] - 1, pp[1] - FENCE - 5, 3, 2, WIN ? '#f7fbff' : P.fence[0]); }
    if (!WIN) { // climbing roses on the near end of the fence
      for (var r = 0; r < 26; r++) { var rx = 6.8 + hash(r, 4) * 2.8, rh = 4 + hash(4, r) * (FENCE - 2), rp = up(iso(rx, .02), rh); R(rp[0], rp[1], 3, 2, P.leaf); if (r % 3 === 0) { R(rp[0], rp[1] - 1, 2, 2, P.rose); R(rp[0], rp[1] - 1, 1, 1, P.roseHi); } }
    }
  }

  // ---------- garden pieces ----------
  function bed(x, y, w, d) {
    shadow(x, y, w, d, .08);
    box(x, y, w, d, 7, P.plank);
    poly([up(iso(x + .12, y + .12), 7), up(iso(x + w - .12, y + .12), 7), up(iso(x + w - .12, y + d - .12), 7), up(iso(x + .12, y + d - .12), 7)], WIN ? P.snow[0] : P.soil[0]);
    if (!WIN) for (var k = 0; k < 12; k++) { var p = up(iso(x + .2 + hash(k, x) * (w - .4), y + .2 + hash(y, k) * (d - .4)), 7); R(p[0], p[1], 2, 1, P.soil[2]); }
    else { for (var s = 0; s < 6; s++) { var m = up(iso(x + .4 + s * (w - .8) / 5, y + d / 2), 9); c.fillStyle = '#ffffff'; c.beginPath(); c.ellipse(m[0], m[1], 6, 3, 0, 0, 7); c.fill(); } }
    // plank lines on the front faces
    for (var i = .5; i < w; i += .5) line(iso(x + i, y + d), up(iso(x + i, y + d), 7), 'rgba(83,56,33,.55)');
  }
  function sparkle(px, py, t, k) {
    var s = (t + k) % 6; if (s > 3) return; var r = s === 1 ? 3 : 2;
    R(px - r, py, r * 2 + 1, 1, '#fffbe0'); R(px, py - r, 1, r * 2 + 1, '#fffbe0'); R(px - 1, py - 1, 3, 3, 'rgba(255,240,170,.7)');
  }
  function marker(px, py, col) { R(px, py - 12, 1, 12, '#b98f62'); R(px - 3, py - 15, 7, 5, '#fff6ea'); R(px - 3, py - 15, 7, 1, '#d9bfa6'); R(px - 1, py - 14, 3, 3, col); }
  function leafPair(px, py, sz, col, colSh, droop) {
    var dy = droop ? 2 : -1;
    c.fillStyle = colSh; c.beginPath(); c.ellipse(px - sz, py + dy, sz, sz * .45, droop ? .6 : -.5, 0, 7); c.fill();
    c.fillStyle = col; c.beginPath(); c.ellipse(px + sz, py + dy, sz, sz * .45, droop ? -.6 : .5, 0, 7); c.fill();
  }
  // kind: 'tomato','sunflower','tulip','pepper','basil','lettuce','strawberry','pea'; stage 0 seed, 1 sprout, 2 growing, 3 ready
  function plantAt(x, y, kind, stage, t, o) {
    o = o || {}; var b = up(iso(x, y), 7), px = b[0], py = b[1], sw = Math.round(Math.sin((t + x * 3) / 3));
    if (stage === 0) { c.fillStyle = P.soil[1]; c.beginPath(); c.ellipse(px, py, 4, 2, 0, 0, 7); c.fill(); R(px - 2, py - 1, 4, 1, P.soil[2]); marker(px + 2, py, o.col || P.tom); return; }
    if (stage === 1) { R(px, py - 4, 1, 4, P.leafSh); leafPair(px, py - 5, 2, P.leafHi, P.leaf); return; }
    var L = o.droop ? P.droop : P.leaf, Ls = o.droop ? P.droopSh : P.leafSh, Lh = o.droop ? '#a9b46a' : P.leafHi;
    if (kind === 'sunflower') {
      var hgt = stage === 3 ? 38 : 20;
      line([px, py], [px + sw, py - hgt], P.leafSh, 2);
      for (var k = 6; k < hgt - 6; k += 8) leafPair(px + sw * k / hgt, py - k, 3, L, Ls);
      if (stage === 3) {
        var hx = px + sw, hy = py - hgt;
        c.fillStyle = P.sunSh; for (var a = 0; a < 12; a++) { var an = a * Math.PI / 6; c.beginPath(); c.ellipse(hx + Math.cos(an) * 5, hy + Math.sin(an) * 4, 3, 1.6, an, 0, 7); c.fill(); }
        c.fillStyle = P.sun; for (var a2 = 0; a2 < 12; a2++) { var an2 = a2 * Math.PI / 6 + .26; c.beginPath(); c.ellipse(hx + Math.cos(an2) * 4.5, hy + Math.sin(an2) * 3.6, 2.6, 1.3, an2, 0, 7); c.fill(); }
        c.fillStyle = '#6b3d26'; c.beginPath(); c.ellipse(hx, hy, 3.4, 2.8, 0, 0, 7); c.fill(); R(hx - 1, hy - 1, 1, 1, '#8e5a37');
      } else { c.fillStyle = P.leafSh; c.beginPath(); c.arc(px + sw, py - hgt, 2.5, 0, 7); c.fill(); }
      return;
    }
    if (kind === 'tulip') {
      for (var i = -1; i <= 1; i++) {
        var tx = px + i * 3, th = 10 + (i === 0 ? 3 : 0);
        line([tx, py], [tx + sw * .5, py - th], P.leafSh); leafPair(tx, py - 3, 2.5, L, Ls);
        if (stage === 3) { var cc = [P.rose, '#f6c86e', P.roseHi][i + 1]; R(tx - 2 + sw * .5, py - th - 4, 5, 4, cc); R(tx - 2 + sw * .5, py - th - 5, 1, 2, cc); R(tx + 2 + sw * .5, py - th - 5, 1, 2, cc); R(tx + sw * .5, py - th - 5, 1, 2, cc); R(tx - 1 + sw * .5, py - th - 3, 1, 2, 'rgba(255,255,255,.45)'); }
      }
      return;
    }
    // bushy plants: a mound of leaves, then fruit on top when ready
    var size = stage === 3 ? 1 : .65, mr = { tomato: 8, pepper: 7, basil: 6, lettuce: 6, strawberry: 6, pea: 6 }[kind] * size;
    if (kind === 'tomato' || kind === 'pea') { // staked
      R(px + 3, py - (stage === 3 ? 26 : 16), 1, stage === 3 ? 26 : 16, '#a9764a');
    }
    var hy2 = o.droop ? py - mr * .6 : py - mr;
    c.fillStyle = Ls; c.beginPath(); c.ellipse(px, hy2 + 1, mr + 1, mr * (o.droop ? .6 : .85), 0, 0, 7); c.fill();
    c.fillStyle = L; c.beginPath(); c.ellipse(px - 1, hy2, mr, mr * (o.droop ? .5 : .75), 0, 0, 7); c.fill();
    for (var q = 0; q < 6; q++) { var lx = px - mr + hash(q, x) * mr * 1.6, ly = hy2 - mr * .5 + hash(y, q) * mr; R(lx, ly, 2, 1, Lh); }
    if (kind === 'lettuce') { for (var r = 0; r < 5; r++) { c.strokeStyle = P.leafHi; c.beginPath(); c.arc(px - 1, hy2 + 1, mr * (.3 + r * .14), Math.PI * 1.1, Math.PI * 1.9); c.stroke(); } }
    if (kind === 'basil') { for (var r2 = 0; r2 < 7; r2++) { var bx = px - mr + hash(r2, 5) * mr * 1.8, by = hy2 - mr * .6 + hash(5, r2) * mr * .9; c.fillStyle = '#9fd387'; c.beginPath(); c.ellipse(bx, by, 2, 1.2, .4, 0, 7); c.fill(); } }
    if (o.droop) { // tired leaves hanging down
      [-mr, -mr * .4, mr * .4, mr].forEach(function (dx, k2) { c.fillStyle = k2 % 2 ? P.droopSh : P.droop; c.beginPath(); c.ellipse(px + dx, py - 1, 2.5, 1.2, dx < 0 ? -.9 : .9, 0, 7); c.fill(); });
    }
    if (stage === 3) {
      var fruit = { tomato: [P.tom, P.tomHi, 5], pepper: ['#d2363c', '#ff7a6e', 4], strawberry: ['#e0384f', '#ff8a98', 4], pea: ['#8fc47b', '#c9e8a8', 4] }[kind];
      if (fruit) for (var f = 0; f < fruit[2]; f++) {
        var fx = px - mr * .7 + hash(f, 7) * mr * 1.4, fy = hy2 - mr * .3 + hash(7, f) * mr * .8;
        if (kind === 'pea') { R(fx, fy, 2, 4, fruit[0]); R(fx, fy, 1, 2, fruit[1]); continue; }
        if (kind === 'pepper') { R(fx - 1, fy, 3, 4, f % 2 ? '#6aa361' : fruit[0]); R(fx - 1, fy, 1, 2, f % 2 ? '#a9d47f' : fruit[1]); continue; }
        c.fillStyle = fruit[0]; c.beginPath(); c.arc(fx, fy, kind === 'tomato' ? 2.4 : 1.8, 0, 7); c.fill(); R(fx - 1, fy - 1, 1, 1, fruit[1]);
      }
      if (!o.droop) sparkle(px + mr - 1, hy2 - mr, t, Math.round(x * 3 + y));
    }
  }
  function waterBubble(px, py, t) { // a thought bubble with a droplet, the thirsty nudge
    var b = Math.round(Math.sin(t / 2));
    R(px - 7, py - 15 + b, 14, 12, '#fff6ea'); R(px - 6, py - 16 + b, 12, 14, '#fff6ea');
    c.strokeStyle = P.trayInk; c.strokeRect(px - 7.5, py - 16.5 + b, 15, 14);
    R(px - 1, py - 3 + b, 3, 2, '#fff6ea'); R(px, py - 1 + b, 1, 1, P.trayInk);
    c.fillStyle = P.waterSh; c.beginPath(); c.moveTo(px, py - 14 + b); c.quadraticCurveTo(px + 5, py - 7 + b, px, py - 5 + b); c.quadraticCurveTo(px - 5, py - 7 + b, px, py - 14 + b); c.fill();
    R(px - 1, py - 10 + b, 1, 2, '#e6f6ff');
  }
  function bistro(x, y) {
    shadow(x, y, 1, 1, .1);
    var b = iso(x + .5, y + .5); R(b[0] - 1, b[1] - 13, 2, 13, '#3b3a40'); R(b[0] - 4, b[1] - 1, 8, 1, '#3b3a40');
    c.fillStyle = '#3b3a40'; c.beginPath(); c.ellipse(b[0], b[1] - 14, 9, 4.5, 0, 0, 7); c.fill();
    c.fillStyle = WIN ? '#f7fbff' : '#4c4b52'; c.beginPath(); c.ellipse(b[0], b[1] - 15, 8, 4, 0, 0, 7); c.fill();
    if (!WIN) { R(b[0] - 4, b[1] - 20, 4, 5, '#fff1e2'); R(b[0] - 4, b[1] - 20, 4, 1, '#c96f45'); R(b[0] + 1, b[1] - 21, 3, 5, '#cfe3ef'); R(b[0] + 2, b[1] - 24, 1, 3, P.leaf); R(b[0] + 1, b[1] - 25, 3, 2, P.roseHi); }
  }
  function chair(x, y, facing) {
    var b = iso(x + .3, y + .3);
    R(b[0] - 4, b[1] - 8, 1, 8, '#3b3a40'); R(b[0] + 3, b[1] - 8, 1, 8, '#3b3a40'); R(b[0] - 1, b[1] - 6, 1, 6, '#2a292e');
    c.fillStyle = WIN ? '#f7fbff' : '#4c4b52'; c.beginPath(); c.ellipse(b[0], b[1] - 9, 5, 2.5, 0, 0, 7); c.fill();
    var bx = b[0] + facing * 4; R(bx - 1, b[1] - 20, 2, 12, '#3b3a40'); c.strokeStyle = '#3b3a40'; c.beginPath(); c.arc(bx, b[1] - 17, 4, Math.PI, 0); c.stroke();
    if (!WIN) { R(b[0] - 4, b[1] - 11, 8, 2, P.roseHi); R(b[0] - 4, b[1] - 10, 8, 1, P.rose); }
  }
  function birdbath(x, y, t) {
    var b = iso(x, y); ellipseShadow(b[0] + 3, b[1] + 1, 7);
    R(b[0] - 4, b[1] - 3, 8, 3, P.stone[2]); R(b[0] - 2, b[1] - 16, 4, 14, P.stone[1]); R(b[0] - 2, b[1] - 16, 2, 14, P.stone[0]);
    c.fillStyle = P.stone[2]; c.beginPath(); c.ellipse(b[0], b[1] - 17, 9, 4, 0, 0, 7); c.fill();
    c.fillStyle = P.stone[0]; c.beginPath(); c.ellipse(b[0], b[1] - 18, 9, 4, 0, 0, 7); c.fill();
    c.fillStyle = WIN ? '#e6f2ff' : P.water; c.beginPath(); c.ellipse(b[0], b[1] - 18, 7, 2.8, 0, 0, 7); c.fill();
    if (!WIN) { R(b[0] - 3, b[1] - 19, 3, 1, '#e6f6ff'); // a little bird on the rim, hopping
      var hop = (t % 8) < 2 ? -1 : 0, bx = b[0] + 6, by = b[1] - 22 + hop;
      R(bx - 2, by, 5, 3, '#8e5a37'); R(bx - 2, by, 3, 1, '#b9804f'); R(bx + 2, by - 2, 3, 3, '#8e5a37'); R(bx + 4, by - 1, 2, 1, '#f3d38a'); R(bx + 3, by - 1, 1, 1, '#2b2226'); R(bx - 1, by + 2, 3, 1, '#e46f6a'); R(bx - 4, by + 1, 2, 1, '#6b3d26');
    }
  }
  function stringLights(t) {
    var a = up(iso(0, 3.0), 64), b = up(iso(3.6, 0), 38), m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 9];
    c.strokeStyle = '#4a3a3a'; c.beginPath(); c.moveTo(a[0], a[1]); c.quadraticCurveTo(m[0], m[1] + 9, b[0], b[1]); c.stroke();
    var pole = iso(3.6, 0); R(pole[0] - 1, pole[1] - 38, 2, 12, '#6b4a30');
    for (var k = 1; k < 10; k++) {
      var s = k / 10, x = (1 - s) * (1 - s) * a[0] + 2 * (1 - s) * s * m[0] + s * s * b[0], y = (1 - s) * (1 - s) * a[1] + 2 * (1 - s) * s * (m[1] + 9) + s * s * b[1];
      var on = WIN || (Math.floor(t / 2) + k) % 5 !== 0;
      if (on && WIN) { c.fillStyle = 'rgba(255,225,150,.4)'; c.beginPath(); c.arc(x, y + 2, 4, 0, 7); c.fill(); }
      R(x - 1, y + 1, 2, 3, on ? (WIN ? '#ffe08a' : '#fff3c4') : '#c8b8a0');
    }
  }
  function greenhouse(x, y, w, d, t) { // glass walls on a brick base, glowing in winter
    shadow(x, y, w, d, .1);
    box(x, y, w, d, 6, P.brick);
    var H = 30, A = up(iso(x, y), 6), B = up(iso(x + w, y), 6), C = up(iso(x + w, y + d), 6), D = up(iso(x, y + d), 6);
    var glass = WIN ? 'rgba(255,220,150,.55)' : 'rgba(207,232,240,.55)';
    poly([D, C, up(C, H), up(D, H)], glass); poly([B, C, up(C, H), up(B, H)], WIN ? 'rgba(240,190,120,.5)' : 'rgba(180,212,224,.55)');
    // roof
    var rA = up(iso(x, y + d / 2), H + 12), rB = up(iso(x + w, y + d / 2), H + 12);
    poly([up(D, H), up(C, H), rB, rA], WIN ? '#f7fbff' : 'rgba(225,242,248,.75)'); poly([up(C, H), up(B, H), rB], WIN ? '#e8f0fa' : 'rgba(190,220,232,.75)');
    // frames
    [[D, C], [B, C]].forEach(function (e) { for (var s = 0; s <= 1.001; s += .25) { var p = [e[0][0] + (e[1][0] - e[0][0]) * s, e[0][1] + (e[1][1] - e[0][1]) * s]; line(p, up(p, H), '#f4ebe0', 1); } line(up(e[0], H / 2), up(e[1], H / 2), '#f4ebe0'); line(up(e[0], H), up(e[1], H), '#f4ebe0'); });
    line(rA, rB, '#f4ebe0', 2); line(up(D, H), rA, '#f4ebe0'); line(up(C, H), rB, '#f4ebe0');
    // plants inside
    for (var k = 0; k < 5; k++) { var p = up(iso(x + .4 + k * (w - .8) / 4, y + d - .45), 8); R(p[0] - 3, p[1] - 6, 6, 6, P.leafSh); R(p[0] - 2, p[1] - 8, 4, 4, P.leaf); if (k % 2) R(p[0], p[1] - 9, 2, 2, WIN ? '#d2363c' : P.roseHi); }
    if (WIN) { var g2 = iso(x + w / 2, y + d / 2), gr = c.createRadialGradient(g2[0], g2[1] - 14, 4, g2[0], g2[1] - 14, 50); gr.addColorStop(0, P.glow + '.45)'); gr.addColorStop(1, P.glow + '0)'); c.fillStyle = gr; c.fillRect(g2[0] - 50, g2[1] - 64, 100, 100); }
    poly([up(A, H), up(B, H), B, C, D, up(D, H)], null, INK);
  }
  function pot(x, y, kind, t) {
    var b = iso(x, y); ellipseShadow(b[0] + 2, b[1] + 1, 6);
    R(b[0] - 5, b[1] - 8, 10, 8, '#b5624f'); R(b[0] - 6, b[1] - 9, 12, 2, '#d98a6f'); R(b[0] - 5, b[1] - 8, 3, 7, '#d98a6f');
    if (kind === 'pine') { [[0, 8, 9], [6, 7, 7], [11, 5, 6]].forEach(function (tr) { c.fillStyle = P.leafSh; c.beginPath(); c.moveTo(b[0], b[1] - 9 - tr[0] - tr[2] - 4); c.lineTo(b[0] + tr[1], b[1] - 9 - tr[0]); c.lineTo(b[0] - tr[1], b[1] - 9 - tr[0]); c.fill(); R(b[0] - tr[1] + 2, b[1] - 10 - tr[0], tr[1] * 2 - 4, 1, '#f7fbff'); });
      [[-4, -14], [3, -18], [-1, -24], [4, -12]].forEach(function (d2, k) { R(b[0] + d2[0], b[1] + d2[1], 2, 2, (Math.floor(t / 2) + k) % 3 ? '#ffd56b' : '#e46f8b'); }); }
    if (kind === 'holly') { c.fillStyle = P.leafDk; c.beginPath(); c.ellipse(b[0], b[1] - 15, 8, 7, 0, 0, 7); c.fill(); for (var k2 = 0; k2 < 5; k2++) R(b[0] - 5 + hash(k2, 1) * 9, b[1] - 20 + hash(1, k2) * 9, 2, 2, '#d2363c'); R(b[0] - 6, b[1] - 22, 9, 2, '#f7fbff'); }
    if (kind === 'poinsettia') { for (var a = 0; a < 7; a++) { var an = a * .9; c.fillStyle = a % 2 ? '#b8323a' : '#e0464e'; c.beginPath(); c.ellipse(b[0] + Math.cos(an) * 5, b[1] - 14 + Math.sin(an) * 3, 4, 2, an, 0, 7); c.fill(); } R(b[0] - 1, b[1] - 15, 2, 2, '#ffd56b'); }
  }

  // ---------- people and cats (from the approved reference sheets) ----------
  function sarah(px, py, t, can) {
    ellipseShadow(px, py, 8);
    if (window.SS_SARAH) window.SS_SARAH(c, px - 9, py - 38, 1, t, false, null, 'bun');
    if (can) { // watering can, tipped, with drops
      var cx = px + 9, cy = py - 16;
      R(cx, cy, 8, 6, '#7fa7a0'); R(cx, cy, 8, 2, '#a8cbc0'); R(cx + 1, cy - 3, 6, 1, '#5d8580'); R(cx + 1, cy - 3, 1, 3, '#5d8580'); R(cx + 6, cy - 3, 1, 3, '#5d8580');
      c.strokeStyle = '#5d8580'; c.lineWidth = 2; c.beginPath(); c.moveTo(cx + 8, cy + 2); c.lineTo(cx + 14, cy + 5); c.stroke(); c.lineWidth = 1; R(cx + 13, cy + 4, 3, 3, '#5d8580');
      for (var k = 0; k < 5; k++) { var d = (t * 2 + k * 3) % 12; R(cx + 14 + (k % 3), cy + 7 + d, 1, 2, P.water); }
      R(px + 7, py - 12, 3, 3, '#f2c3a6');
    }
  }
  function sprite(rows, pal, x, y, flip) {
    for (var j = 0; j < rows.length; j++) for (var i = 0; i < rows[j].length; i++) {
      var ch = rows[j][i]; if (ch === '.' || !pal[ch]) continue;
      c.fillStyle = pal[ch]; c.fillRect(Math.round(x + (flip ? rows[j].length - 1 - i : i)), Math.round(y + j), 1, 1);
    }
  }
  function louieLoaf(px, py, t) { if (!window.LOUIE_LOAF) return; ellipseShadow(px, py, 10); sprite(window.LOUIE_LOAF, window.LOUIE_PAL, px - 12, py - window.LOUIE_LOAF.length + 1); if (t % 6 < 3) { c.font = '7px "Press Start 2P", monospace'; c.fillStyle = 'rgba(107,66,80,.75)'; c.textBaseline = 'alphabetic'; c.fillText('z', px + 12, py - 14 - (t % 3)); } }
  function ralphSit(px, py, flip) { if (!window.RALPH_SIT) return; ellipseShadow(px, py, 9); sprite(window.RALPH_SIT, window.RALPH_PAL, px - 10, py - window.RALPH_SIT.length + 1, flip); }
  function louieSit(px, py, flip) { if (!window.LOUIE_SIT) return; ellipseShadow(px, py, 8); sprite(window.LOUIE_SIT, window.LOUIE_PAL, px - 8, py - window.LOUIE_SIT.length + 1, flip); }

  // ---------- UI (same tray and type as decorate-v1) ----------
  function txt(s, x, y, col, size, align) { c.font = (size || 8) + 'px "Press Start 2P", monospace'; c.fillStyle = col; c.textAlign = align || 'left'; c.textBaseline = 'top'; c.fillText(s, x, y); }
  function vt(s, x, y, col, size, align) { c.font = (size || 10) + 'px "VT323", monospace'; c.fillStyle = col; c.textAlign = align || 'left'; c.textBaseline = 'top'; c.fillText(s, x, y); }
  function heart(x, y, col) { R(x + 1, y, 2, 1, col); R(x + 4, y, 2, 1, col); R(x, y + 1, 7, 2, col); R(x + 1, y + 3, 5, 1, col); R(x + 2, y + 4, 3, 1, col); R(x + 3, y + 5, 1, 1, col); }
  function coin(x, y) { R(x + 1, y, 5, 7, '#c78f3e'); R(x, y + 1, 7, 5, '#c78f3e'); R(x + 1, y + 1, 5, 5, '#f3d38a'); R(x + 3, y + 2, 1, 3, '#c78f3e'); R(x + 1, y + 1, 2, 1, '#fff3c4'); }
  function btn(x, y, w, s, on) {
    R(x, y, w, 14, on ? P.rose : '#fbeedd'); R(x, y + 13, w, 1, on ? P.roseSh : P.trayEdge); if (on) R(x, y, w, 1, P.roseHi);
    txt(s, x + w / 2, y + 4, on ? '#fff' : P.trayInk, 6, 'center');
  }
  function chip(x, y, s, w) {
    w = w || 14;
    R(x, y, w, 13, '#fff6ea'); R(x, y + 12, w, 1, P.trayEdge); c.strokeStyle = P.rose; c.strokeRect(x + .5, y + .5, w - 1, 12);
    txt(s, x + w / 2, y + 3, P.trayInk, 6, 'center');
  }
  function iconChip(x, y, draw) { R(x, y, 15, 14, '#fff6ea'); R(x, y + 13, 15, 1, P.trayEdge); c.strokeStyle = P.rose; c.strokeRect(x + .5, y + .5, 14, 13); draw(x + 2, y + 2); }
  function finger(px, py) { c.fillStyle = 'rgba(255,255,255,.45)'; c.beginPath(); c.arc(px, py, 7, 0, 7); c.fill(); c.strokeStyle = 'rgba(255,255,255,.95)'; c.stroke(); }
  function topBar(W, day, time, coins, sunIcon) {
    R(4, 4, 150, 15, 'rgba(255,246,234,.95)'); R(4, 18, 150, 1, P.trayEdge);
    if (sunIcon) { R(9, 9, 6, 6, P.sun); R(11, 7, 2, 1, P.sunSh); R(11, 16, 2, 1, P.sunSh); R(7, 11, 1, 2, P.sunSh); R(16, 11, 1, 2, P.sunSh); R(10, 10, 2, 2, '#fff3c4'); }
    else { R(9, 8, 6, 7, '#f3d38a'); R(12, 8, 4, 5, 'rgba(255,246,234,1)'); }
    txt(day, 20, 8, P.trayInk, 6); txt(time, 150, 8, P.trayInk, 6, 'right');
    R(W - 62, 4, 58, 15, 'rgba(255,246,234,.95)'); R(W - 62, 18, 58, 1, P.trayEdge);
    coin(W - 57, 8); txt(coins, W - 8, 8, P.trayInk, 7, 'right');
  }
  function trayBase(W, y, h) { R(0, y - 2, W, 2, 'rgba(59,36,48,.25)'); R(0, y, W, h, P.tray); R(0, y, W, 1, '#fffaf3'); }
  function modeTabs(y) {
    ['HOME', 'STYLE', 'YARD'].forEach(function (s, i) {
      var tx = 6 + i * 52, on = i === 2; R(tx, y + 4, 48, 12, on ? P.rose : P.trayEdge); if (on) R(tx, y + 4, 48, 1, P.roseHi);
      txt(s, tx + 24, y + 6, on ? '#fff' : P.trayInk, 8, 'center');
    });
  }
  // yard catalog tabs: beds and planters, paths and patio, fences and gates, garden decor, structures, seeds, pots
  var TABS = ['BEDS', 'PATHS', 'FENCES', 'DECOR', 'BUILDINGS', 'SEEDS', 'POTS'];
  function tabIcon(i, x, y, on) {
    var k = on ? '#fff' : P.trayInk, k2 = on ? '#ffd9e2' : '#b38a8f';
    [
      function () { R(x + 1, y + 5, 14, 5, k); R(x + 2, y + 6, 12, 2, k2); R(x + 4, y + 2, 2, 3, k); R(x + 9, y + 1, 2, 4, k); R(x + 3, y + 1, 2, 2, k2); R(x + 10, y, 2, 2, k2); },
      function () { R(x + 1, y + 7, 5, 3, k); R(x + 7, y + 5, 5, 3, k); R(x + 3, y + 2, 5, 2, k2); R(x + 11, y + 1, 4, 3, k2); },
      function () { for (var q = 0; q < 4; q++) { R(x + 1 + q * 4, y + 2, 2, 9, k); R(x + 1 + q * 4, y + 1, 1, 1, k); } R(x, y + 4, 15, 1, k2); R(x, y + 8, 15, 1, k2); },
      function () { R(x + 6, y + 4, 3, 6, k); R(x + 2, y + 2, 11, 2, k); R(x + 3, y + 1, 9, 1, k2); R(x + 4, y + 10, 7, 1, k); },
      function () { R(x + 2, y + 5, 11, 6, k2); R(x + 1, y + 4, 13, 1, k); c.fillStyle = k; c.beginPath(); c.moveTo(x + 1, y + 4); c.lineTo(x + 7.5, y); c.lineTo(x + 14, y + 4); c.fill(); R(x + 6, y + 7, 3, 4, k); },
      function () { R(x + 3, y + 1, 9, 10, k); R(x + 4, y + 2, 7, 4, k2); R(x + 6, y + 3, 3, 2, on ? P.rose : P.sun); R(x + 4, y + 7, 7, 1, k2); R(x + 4, y + 9, 5, 1, k2); },
      function () { R(x + 4, y + 6, 7, 5, k); R(x + 3, y + 5, 9, 2, k); R(x + 5, y + 1, 2, 4, k2); R(x + 8, y + 2, 3, 3, k2); R(x + 7, y + 3, 1, 2, k); }
    ][i]();
  }
  function catTabs(W, y, active) {
    for (var i = 0; i < 7; i++) { var tx = 4 + i * 33.2, on = i === active; R(tx, y, 31, 16, on ? P.rose : '#fbeedd'); R(tx, y + 15, 31, 1, on ? P.roseSh : P.trayEdge); tabIcon(i, tx + 8, y + 2, on); }
    R(4 + active * 33.2, y + 17, 31, 2, P.rose);
  }
  // a seed packet: paper with a window showing the plant
  function packet(kind, x, y, dim) {
    R(x, y, 18, 23, '#3b2430'); R(x + 1, y + 1, 16, 21, dim ? '#e9dfd2' : '#fff1dc'); R(x + 1, y + 1, 16, 3, dim ? '#d7c6b4' : '#e7b75f'); R(x + 3, y + 2, 12, 1, '#fff6ea');
    R(x + 3, y + 6, 12, 11, dim ? '#dfe6e0' : '#d6ecd0');
    var cx = x + 9, cy = y + 16;
    c.save(); c.beginPath(); c.rect(x + 3, y + 6, 12, 11); c.clip();
    if (kind === 'sunflower') { R(cx, cy - 8, 1, 8, P.leafSh); R(cx - 4, cy - 12, 9, 5, P.sun); R(cx - 3, cy - 13, 7, 7, P.sun); R(cx - 1, cy - 11, 3, 3, '#6b3d26'); }
    if (kind === 'rose') { R(cx, cy - 6, 1, 6, P.leafSh); R(cx - 3, cy - 10, 7, 5, P.rose); R(cx - 2, cy - 11, 5, 2, P.roseHi); R(cx - 1, cy - 9, 2, 1, P.roseSh); R(cx - 4, cy - 4, 3, 2, P.leaf); }
    if (kind === 'tomato') { R(cx - 5, cy - 10, 10, 6, P.leaf); R(cx - 4, cy - 6, 4, 4, P.tom); R(cx + 1, cy - 7, 4, 4, P.tom); R(cx - 3, cy - 6, 1, 1, P.tomHi); R(cx + 2, cy - 7, 1, 1, P.tomHi); }
    if (kind === 'pepper') { R(cx - 4, cy - 10, 8, 5, P.leaf); R(cx - 3, cy - 6, 3, 5, '#d2363c'); R(cx + 1, cy - 6, 3, 5, '#6aa361'); R(cx - 3, cy - 6, 1, 2, '#ff7a6e'); }
    if (kind === 'zucchini') { R(cx - 5, cy - 9, 10, 5, P.leaf); R(cx - 5, cy - 4, 9, 3, '#3f7a3a'); R(cx - 4, cy - 4, 7, 1, '#6aa361'); R(cx + 3, cy - 6, 3, 2, P.sun); }
    if (kind === 'basil') { R(cx - 4, cy - 8, 8, 7, P.leaf); R(cx - 3, cy - 10, 3, 3, '#9fd387'); R(cx + 1, cy - 9, 3, 3, '#9fd387'); R(cx, cy - 3, 1, 3, P.leafSh); }
    if (kind === 'pine') { c.fillStyle = P.leafSh; c.beginPath(); c.moveTo(cx, cy - 12); c.lineTo(cx + 5, cy - 2); c.lineTo(cx - 5, cy - 2); c.fill(); R(cx - 3, cy - 5, 6, 1, '#f7fbff'); R(cx - 1, cy - 9, 2, 1, '#ffd56b'); R(cx - 1, cy - 2, 2, 2, '#8e5a37'); }
    if (kind === 'holly') { R(cx - 5, cy - 8, 10, 6, P.leafDk); R(cx - 1, cy - 7, 2, 2, '#d2363c'); R(cx + 2, cy - 5, 2, 2, '#d2363c'); R(cx - 4, cy - 9, 8, 1, '#f7fbff'); }
    if (kind === 'poinsettia') { R(cx - 5, cy - 8, 10, 6, '#e0464e'); R(cx - 3, cy - 10, 6, 2, '#b8323a'); R(cx - 1, cy - 6, 2, 2, '#ffd56b'); R(cx - 5, cy - 3, 3, 2, P.leaf); }
    if (kind === 'greens') { R(cx - 5, cy - 7, 10, 6, '#4f8a4a'); R(cx - 4, cy - 9, 3, 3, '#6aa361'); R(cx + 1, cy - 10, 3, 4, '#6aa361'); R(cx - 4, cy - 2, 8, 1, '#f7fbff'); }
    if (kind === 'pea' || kind === 'lettuce') { R(cx - 5, cy - 8, 10, 7, '#a9d47f'); R(cx - 3, cy - 10, 6, 3, '#8fc47b'); }
    c.restore();
    R(x + 3, y + 18, 12, 1, dim ? '#c9b5a3' : '#e6c58d'); R(x + 3, y + 20, 8, 1, dim ? '#c9b5a3' : '#e6c58d');
  }
  function seedCard(x, y, kind, name, price, days, sel, dim) {
    R(x, y, 74, 30, sel ? '#fde3ea' : (dim ? '#f3ebe0' : '#fbeedd')); R(x, y + 29, 74, 1, P.trayEdge);
    if (sel) { c.strokeStyle = P.rose; c.lineWidth = 2; c.strokeRect(x + 1, y + 1, 72, 28); c.lineWidth = 1; }
    if (sel) c.globalAlpha = .4; packet(kind, x + 3, y + 3, dim); c.globalAlpha = 1;
    vt(name, x + 25, y + 2, dim ? '#a9898f' : P.trayInk, 10);
    if (!dim) { coin(x + 25, y + 15); vt(price, x + 34, y + 13, P.trayInk, 10); vt(days, x + 71, y + 13, '#8e6670', 10, 'right'); }
    else vt(days, x + 25, y + 13, '#a9898f', 10);
  }
  function pager(W, y, page) { // swipe for more: two pages of cards
    txt('SWIPE', W - 30, y, '#b38a8f', 5, 'right');
    for (var i = 0; i < 2; i++) R(W - 24 + i * 8, y + 1, 5, 5, i === page ? P.rose : P.trayEdge);
    R(W - 8, y + 1, 1, 5, '#b38a8f'); R(W - 7, y + 2, 1, 3, '#b38a8f'); R(W - 6, y + 3, 1, 1, '#b38a8f');
  }
  function seedsTray(W, H) {
    var h = 88, y = H - h; trayBase(W, y, h); modeTabs(y);
    txt('LIFE', W - 6, y + 7, '#b38a8f', 6, 'right');
    catTabs(W, y + 20, 5);
    R(4, y + 41, 6, 6, P.sun); R(5, y + 42, 2, 2, '#fff3c4');
    txt('SEEDS: SUMMER', 14, y + 41, P.trayInk, 6);
    pager(W, y + 41, 0);
    var cards = [['sunflower', 'SUNFLOWERS', '15', '5 DAYS'], ['rose', 'ROSES', '20', '7 DAYS'], ['tomato', 'TOMATOES', '10', '4 DAYS'],
      ['pepper', 'PEPPERS', '10', '4 DAYS'], ['zucchini', 'ZUCCHINI', '10', '3 DAYS'], ['basil', 'BASIL', '5', '2 DAYS']];
    cards.slice(0, 3).forEach(function (cd, k) { seedCard(4 + k * 78, y + 52, cd[0], cd[1], cd[2], cd[3], k === 2); });
    return y;
  }
  function potsTray(W, H) {
    var h = 88, y = H - h; trayBase(W, y, h); modeTabs(y);
    txt('LIFE', W - 6, y + 7, '#b38a8f', 6, 'right');
    catTabs(W, y + 20, 6);
    R(5, y + 41, 5, 5, '#e8f0fa'); R(4, y + 43, 7, 1, '#e8f0fa'); R(7, y + 40, 1, 7, '#e8f0fa');
    txt('POTS: WINTER', 14, y + 41, P.trayInk, 6);
    pager(W, y + 41, 0);
    var cards = [['pine', 'POTTED PINE', '20', '7 DAYS'], ['holly', 'HOLLY', '15', '7 DAYS'], ['poinsettia', 'POINSETTIA', '15', '5 DAYS'],
      ['greens', 'WINTER GREENS', '5', '2 DAYS'], ['tomato', 'TOMATOES', '', 'BACK IN JUNE', true], ['basil', 'BASIL', '5', 'INDOORS']];
    [cards[0], cards[2], cards[4]].forEach(function (cd, k) { seedCard(4 + k * 78, y + 52, cd[0], cd[1], cd[2], cd[3], false, cd[4]); });
    return y;
  }
  function plantTray(W, H, t) {
    var h = 98, y = H - h; trayBase(W, y, h); modeTabs(y);
    txt('LIFE', W - 6, y + 7, '#b38a8f', 6, 'right');
    packet('pepper', 6, y + 22, false);
    txt('PEPPERS', 30, y + 23, P.trayInk, 8);
    vt('Planted Jun 10 · ready in 2 days', 30, y + 33, '#8e6670', 10);
    // growth stages, each with an icon and a word
    var st = ['SEED', 'SPROUT', 'GROWING', 'READY'];
    st.forEach(function (s, i) {
      var sx = 6 + i * 58, on = i <= 2, now = i === 2;
      R(sx, y + 50, 54, 14, now ? '#fde3ea' : (on ? '#eef6e6' : '#fbeedd')); R(sx, y + 63, 54, 1, P.trayEdge);
      if (now) { c.strokeStyle = P.rose; c.strokeRect(sx + .5, y + 50.5, 53, 13); }
      var ix = sx + 4, iy = y + 53;
      if (i === 0) { R(ix, iy + 5, 7, 3, P.soil[1]); R(ix + 3, iy + 1, 1, 4, '#b98f62'); }
      if (i === 1) { R(ix + 3, iy + 3, 1, 5, P.leafSh); R(ix, iy + 2, 3, 2, P.leafHi); R(ix + 4, iy + 2, 3, 2, P.leaf); }
      if (i === 2) { R(ix + 1, iy + 2, 6, 5, P.leaf); R(ix + 3, iy + 7, 1, 1, P.leafSh); R(ix + 2, iy + 2, 2, 1, P.leafHi); }
      if (i === 3) { R(ix + 1, iy + 1, 6, 4, P.leaf); R(ix + 1, iy + 4, 2, 3, '#d2363c'); R(ix + 4, iy + 4, 2, 3, '#6aa361'); }
      txt(s, sx + 14, y + 54, on ? P.trayInk : '#b38a8f', 5);
      if (i < 2) { R(sx + 46, y + 55, 4, 1, '#6aa361'); R(sx + 48, y + 53, 1, 4, '#6aa361'); } // tick-ish plus
    });
    // water meter: icon, word and bar
    c.fillStyle = P.waterSh; c.beginPath(); c.moveTo(10, y + 67); c.quadraticCurveTo(15, y + 74, 10, y + 76); c.quadraticCurveTo(5, y + 74, 10, y + 67); c.fill(); R(9, y + 71, 1, 2, '#e6f6ff');
    txt('WATER', 18, y + 69, P.trayInk, 6);
    R(56, y + 68, 100, 8, '#3b2430'); R(57, y + 69, 98, 6, '#e8dccd'); R(57, y + 69, 9, 6, P.water); R(57, y + 69, 9, 2, '#c6ecff');
    vt('Thirsty, paused', 234, y + 66, '#b44f63', 10, 'right');
    btn(6, y + 81, 92, 'WATER IT', true); btn(104, y + 81, 62, 'MOVE', false); btn(172, y + 81, 62, 'DONE', false);
    return y;
  }

  window.drawYard = function (ctx, W, H, t, st) {
    st = st || 'seeds'; c = ctx; t = t || 0; WIN = st === 'winter';
    backdrop(W, H, t);
    surround();
    rowBack(-3.4, 0, HOUSE + 8, '#a8644f', '#e9d6c4', false); // next door, up the row
    house(t);
    rowBack(N, N + 9, HOUSE - 12, '#9e5a4e', '#dfe9e4', true); // next door, down the row
    fence(t);
    ground();
    patio(0, 0, 3, 5);
    [[3.5, 5.6, 4], [4.3, 6.4, 3.6], [3.4, 7.3, 4], [4.4, 8.2, 3.6], [3.6, 9.2, 3.4]].forEach(function (s) { stone(s[0], s[1], s[2]); });
    stringLights(t);
    // back to front
    var B1 = [4.4, .5, 4.8, 1.4], B2 = [4.4, 3.0, 4.8, 1.4], B3 = [.3, 6.0, 1.4, 3.4];
    bed.apply(null, B1); bed.apply(null, B2);
    if (!WIN) {
      plantAt(5.0, 1.2, 'tulip', 3, t); plantAt(5.9, 1.2, 'tulip', 3, t); plantAt(6.8, 1.2, 'sunflower', 3, t); plantAt(7.7, 1.2, 'sunflower', 3, t); plantAt(8.6, 1.2, 'sunflower', 2, t);
    } else { [5.2, 7.0, 8.6].forEach(function (x) { var b = up(iso(x, 1.2), 9); c.strokeStyle = '#7a6660'; c.beginPath(); c.moveTo(b[0], b[1]); c.lineTo(b[0] - 2, b[1] - 12); c.moveTo(b[0], b[1] - 4); c.lineTo(b[0] + 4, b[1] - 10); c.stroke(); R(b[0] - 3, b[1] - 13, 3, 1, '#ffffff'); }); }
    if (st === 'winter') { pot(1.2, .9, 'pine', t); pot(2.4, .7, 'holly', t); }
    bistro(1.4, 1.9); chair(1.0, 2.9, -1); chair(2.4, 1.6, 1);
    if (!WIN) {
      plantAt(5.0, 3.7, 'pea', 2, t); plantAt(5.9, 3.7, 'lettuce', 1, t); plantAt(6.8, 3.7, 'pepper', 2, t, { droop: true });
      plantAt(7.7, 3.7, 'tomato', 3, t); plantAt(8.6, 3.7, 'tomato', 3, t);
    }
    if (st === 'winter') { louieLoaf(iso(.55, 3.3)[0], iso(.55, 3.3)[1] - 6, t); }
    else { louieSit(iso(.4, 2.0)[0] + 2, iso(.4, 2.0)[1] - 5, false); }
    if (!WIN) { var rp = iso(1.9, 5.6); ralphSit(rp[0], rp[1], true); }
    if (st !== 'winter') birdbath(8.3, 8.2, t); else greenhouse(6.6, 6.4, 3.0, 2.8, t);
    bed.apply(null, B3);
    if (!WIN) { plantAt(.9, 6.6, 'basil', 3, t); plantAt(.9, 7.5, 'strawberry', 3, t); plantAt(.9, 8.4, 'strawberry', 0, t, { col: '#e0384f' }); }
    else { pot(2.4, 5.4, 'poinsettia', t); }
    // people
    if (st === 'seeds' || st === 'plant') sarah(iso(5.8, 5.3)[0], iso(5.8, 5.3)[1], t, st === 'seeds');
    if (st === 'winter') { // snow falling, warm windows
      for (var i = 0; i < 40; i++) { var sx = (i * 37 + t * (i % 3 + 1)) % W, sy = (i * 53 + t * 2 * (1 + i % 2)) % (H - 40); c.fillStyle = 'rgba(255,255,255,' + (.45 + (i % 3) * .15) + ')'; c.fillRect(sx, sy, 1 + (i % 4 === 0), 1 + (i % 4 === 0)); }
    }
    // the thirsty nudge over the pepper
    var pp = up(iso(6.8, 3.7), 7);
    if (st === 'seeds') waterBubble(pp[0] + 2, pp[1] - 12, t);
    if (st === 'seeds') {
      // dragging a tomato packet onto the empty spot in the herb bed
      var gx = .45, gy = 8.05, glow = [up(iso(gx, gy), 7), up(iso(gx + .9, gy), 7), up(iso(gx + .9, gy + .9), 7), up(iso(gx, gy + .9), 7)];
      poly(glow, 'rgba(143,208,140,.5)', 'rgba(255,255,255,.95)');
      var lift = 14 + Math.round(Math.sin(t / 2)), ctr = up(iso(gx + .45, gy + .45), 7 + lift);
      c.globalAlpha = .95; packet('tomato', ctr[0] - 9, ctr[1] - 20, false); c.globalAlpha = 1;
      finger(ctr[0] + 7, ctr[1] - 2);
      chip(ctr[0] - 30, ctr[1] + 12, 'PLANT HERE', 60);
      topBar(W, 'SAT JUN 13', '9:40 AM', '540', true);
      seedsTray(W, H);
    } else if (st === 'plant') {
      poly([up(iso(6.4, 3.3), 7), up(iso(7.2, 3.3), 7), up(iso(7.2, 4.1), 7), up(iso(6.4, 4.1), 7)], 'rgba(228,111,139,.3)', 'rgba(255,255,255,.95)');
      var tp = up(iso(6.8, 3.7), 34);
      iconChip(tp[0] - 25, tp[1] - 4, function (x, y) { c.fillStyle = P.waterSh; c.beginPath(); c.moveTo(x + 5, y); c.quadraticCurveTo(x + 10, y + 7, x + 5, y + 9); c.quadraticCurveTo(x, y + 7, x + 5, y); c.fill(); });
      chip(tp[0] - 7, tp[1] - 4, '✥'); chip(tp[0] + 10, tp[1] - 4, '✕');
      topBar(W, 'SAT JUN 13', '9:42 AM', '540', true);
      plantTray(W, H, t);
    } else {
      topBar(W, 'SAT DEC 26', '4:40 PM', '1,260', false);
      potsTray(W, H);
    }
  };
})();
