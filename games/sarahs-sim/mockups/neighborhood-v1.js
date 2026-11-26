// Sarah's Sim: Neighborhood mockup v1 (Nov 26, 2026), for spec 008 part C. All art drawn in code.
// Needs people-v1.js (Sarah) and visitor-v1.js (Dot) loaded first; louie-v1.js for the cat in the window.
// drawNeighborhood(ctx, W, H, t, state):
//   'street' fall afternoon: Sarah steps out her front door. Every home has a name tag, the strip at the bottom shows the whole block.
//   'knock'  she walked to Dot's stoop: Dot's card with friendship, her story step, and Knock or Redo her home (pays 600).
//   'lot'    Christmas Eve: snow, string lights on every cornice, and an empty lot she can build on.
// One short street of attached rowhouses in the same 2:1 isometric view as the home. All homes face the street on one side,
// so every front door is in view; across the street is a little pocket park. No real street or address anywhere.
(function () {
  var TW = 24, TH = 12, OX = 0, OY = 0, DEEP = 3.5, c, WIN = false;
  function iso(x, y) { return [OX + (x - y) * TW / 2, OY + (x + y) * TH / 2]; }
  function up(p, h) { return [p[0], p[1] - h]; }
  function poly(pts, fill, stroke) { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (var i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); if (fill) { c.fillStyle = fill; c.fill(); } if (stroke) { c.strokeStyle = stroke; c.lineWidth = 1; c.stroke(); } }
  function R(x, y, w, h, col) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
  function line(a, b, col, w) { c.strokeStyle = col; c.lineWidth = w || 1; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); c.lineWidth = 1; }
  function shade(hex, f) { var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255; function k(v) { return Math.max(0, Math.min(255, Math.round(v * (1 + f)))); } return 'rgb(' + k(r) + ',' + k(g) + ',' + k(b) + ')'; }
  function hash(i, j) { var h = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return h - Math.floor(h); }
  var INK = 'rgba(59,36,48,.85)';
  function box(x, y, w, d, h, cols, z) {
    z = z || 0;
    var A = up(iso(x, y), z), B = up(iso(x + w, y), z), C = up(iso(x + w, y + d), z), D = up(iso(x, y + d), z);
    poly([D, C, up(C, h), up(D, h)], cols[1]); poly([B, C, up(C, h), up(B, h)], cols[2]); poly([up(A, h), up(B, h), up(C, h), up(D, h)], cols[0]);
    poly([up(A, h), up(B, h), B, C, D, up(D, h)], null, INK);
  }
  var P = {
    tray: '#fff6ea', trayEdge: '#e8cdb4', trayInk: '#6b4250', rose: '#e46f8b', roseHi: '#f39bb0', roseSh: '#b44f63', sun: '#ffd56b', sunSh: '#e7a43a',
    leaf: '#6aa361', leafHi: '#8fc47b', leafSh: '#437a47', snow: '#f7fbff', snow2: '#e4ebf4', snow3: '#c9d6e8', glow: 'rgba(255,214,140,',
    fall: ['#e2873a', '#f0a94a', '#c8602e', '#f6cd5c'], marble: ['#f4f1ec', '#dcd7cf', '#bdb6ac']
  };

  // ---------- the block, left to right (x in tiles along the street; homes sit behind y = 0) ----------
  var PLOTS = [
    { k: 'lot', x: -5, w: 5, size: 'LARGE' },
    { k: 'home', who: 'priya', name: 'PRIYA', x: 0, w: 3, h: 80, brick: '#5d6a82', trim: '#e9e4dc', doorCol: '#2f3a4f', doorAt: 'R', painted: true, blackout: true, sideOpen: true },
    { k: 'lot', x: 3, w: 3, size: 'SMALL' },
    { k: 'home', who: 'dot', name: 'DOT', x: 6, w: 3, h: 84, brick: '#b45a43', trim: '#f2e6d4', doorCol: '#4f8a5a', doorAt: 'L', awning: '#6aa361' },
    { k: 'home', who: 'sarah', name: 'HOME', x: 9, w: 3, h: 88, brick: '#a84c36', trim: '#efe2d2', doorCol: '#3f7a64', doorAt: 'R', mine: true },
    { k: 'home', who: 'mj', name: 'MARCO & JULES', x: 12, w: 3, h: 84, brick: '#b9a27e', trim: '#ffffff', doorCol: '#e7b75f', doorAt: 'L', painted: true, sideOpen: true },
    { k: 'lot', x: 15, w: 4, size: 'MEDIUM' },
    { k: 'home', who: 'theo', name: 'THEO', x: 19, w: 3, h: 92, brick: '#d39a46', trim: '#f6efe4', doorCol: '#8f5d73', doorAt: 'L', painted: true, corner: true, sideOpen: true }
  ];
  var CROSS = [22.2, 23.4, 26.6]; // side sidewalk from 22.2, the cross street 23.4 to 26.6

  // ---------- sky and the rooftops of the next street ----------
  function sky(W, H, t) {
    var g = c.createLinearGradient(0, 0, 0, 200);
    if (!WIN) { g.addColorStop(0, '#8fbfe6'); g.addColorStop(.7, '#f4d8bd'); g.addColorStop(1, '#f6c79b'); }
    else { g.addColorStop(0, '#2b2d58'); g.addColorStop(.6, '#5b4a7a'); g.addColorStop(1, '#b4788a'); }
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    if (!WIN) {
      [[40, 30, 20], [170, 22, 26], [215, 52, 14]].forEach(function (cl, i) { var x = (cl[0] + t * .3 * (i + 1)) % (W + 50) - 25; c.fillStyle = 'rgba(255,250,244,.85)'; c.beginPath(); c.ellipse(x, cl[1], cl[2], cl[2] * .33, 0, 0, 7); c.ellipse(x + cl[2] * .5, cl[1] - 3, cl[2] * .55, cl[2] * .3, 0, 0, 7); c.fill(); });
    } else {
      for (var s = 0; s < 30; s++) { var tw = (Math.floor(t / 2) + s) % 7 === 0; R(hash(s, 9) * W, hash(9, s) * 90, 1, 1, tw ? 'rgba(255,255,255,.4)' : 'rgba(255,255,255,.85)'); }
      c.fillStyle = '#fff6d8'; c.beginPath(); c.arc(198, 30, 7, 0, 7); c.fill(); c.fillStyle = 'rgba(255,240,200,.22)'; c.beginPath(); c.arc(198, 30, 13, 0, 7); c.fill();
    }
    // the next street's rooftops and chimneys, flat and soft, one row back
    for (var x = -16; x < 34; x += 2.5) {
      var hh = 52 + hash(x, 3) * 22, a = up(iso(x, -DEEP - 6), hh), b = up(iso(x + 2.5, -DEEP - 6), hh);
      var col = WIN ? (hash(x, 5) > .5 ? '#3d3560' : '#463b68') : (hash(x, 5) > .5 ? '#c99a8f' : '#d4aa98');
      poly([a, b, [b[0], b[1] + 200], [a[0], a[1] + 200]], col);
      poly([a, b, up(b, 3), up(a, 3)], WIN ? '#dfe6f2' : '#e9d2c2');
      if (hash(3, x) > .55) R(a[0] + 8, a[1] - 9, 4, 9, WIN ? '#352c52' : '#b98275');
      if (WIN && hash(x, 8) > .4) { var wp = up(iso(x + 1.2, -DEEP - 6), hh - 18); R(wp[0] - 2, wp[1], 4, 6, '#f4c27a'); }
    }
  }

  // ---------- ground: brick sidewalk, granite curb, the street, the park side ----------
  function quad(x0, y0, x1, y1, col) { poly([iso(x0, y0), iso(x1, y0), iso(x1, y1), iso(x0, y1)], col); }
  function ground(t) {
    var X0 = -14, X1 = 34;
    // the road and the cross street
    quad(X0, 2.4, X1, 5.6, WIN ? '#8e8b98' : '#5c5660');
    quad(CROSS[1], -12, CROSS[2], 18, WIN ? '#8e8b98' : '#5c5660');
    if (WIN) { [3.1, 3.6, 4.4, 4.9].forEach(function (y) { quad(X0, y, X1, y + .18, '#a8a6b2'); }); for (var s = 0; s < 70; s++) { var p = iso(X0 + hash(s, 2) * 48, 2.5 + hash(2, s) * 3); R(p[0], p[1], 3, 1, '#c3c6d4'); } }
    else { for (var g = 0; g < 90; g++) { var q = iso(X0 + hash(g, 4) * 48, 2.5 + hash(4, g) * 3); R(q[0], q[1], 1, 1, hash(g, g) > .5 ? '#6b6570' : '#4f4a54'); } }
    // crosswalk stripes over the main street at the corner
    for (var cw = CROSS[1] + .2; cw < CROSS[2] - .2; cw += .55) quad(cw, 2.5, cw + .3, 5.5, WIN ? '#eef2f8' : '#ece6dc');
    // brick sidewalk in front of the homes (and along the corner)
    quad(X0, 0, CROSS[1], 2.4, WIN ? P.snow2 : '#b8614a');
    quad(CROSS[0], -12, CROSS[1], 0, WIN ? P.snow2 : '#b8614a');
    if (!WIN) {
      for (var yy = .3; yy < 2.4; yy += .3) line(iso(X0, yy), iso(CROSS[1], yy), 'rgba(120,50,35,.55)');
      for (var row = 0; row < 8; row++) for (var xx = X0 + (row % 2) * .3; xx < CROSS[1]; xx += .6) line(iso(xx, row * .3), iso(xx, row * .3 + .3), 'rgba(120,50,35,.45)');
      for (var b = 0; b < 60; b++) { var bp = iso(X0 + hash(b, 6) * 37, hash(6, b) * 2.3); R(bp[0], bp[1], 3, 1, hash(b, 1) > .5 ? '#c97559' : '#a65440'); }
    } else {
      // a shoveled path down the middle, snow piled at the edges
      quad(X0, .9, CROSS[1], 1.6, '#d3dbe8'); for (var bb = 0; bb < 30; bb++) { var sp = iso(X0 + hash(bb, 6) * 37, .95 + hash(6, bb) * .6); R(sp[0], sp[1], 3, 1, '#b8614a'); }
    }
    // curb face, a small step down to the road
    var k0 = iso(X0, 2.4), k1 = iso(CROSS[1], 2.4); poly([k0, k1, [k1[0], k1[1] + 2], [k0[0], k0[1] + 2]], WIN ? '#c9cfdb' : '#a19a94');
    var m0 = iso(CROSS[1], -12), m1 = iso(CROSS[1], 2.4); poly([m0, m1, [m1[0], m1[1] + 2], [m0[0], m0[1] + 2]], WIN ? '#b6bdcc' : '#8d8680');
    line(k0, k1, WIN ? '#ffffff' : '#c8c1ba');
    // the park side: concrete sidewalk, a low iron fence, grass
    quad(X0, 5.6, CROSS[1], 7.2, WIN ? P.snow2 : '#bdb7b0');
    quad(CROSS[2], 5.6, X1, 7.2, WIN ? P.snow2 : '#bdb7b0');
    for (var sx = X0; sx < X1; sx += 1.6) line(iso(sx, 5.6), iso(sx, 7.2), WIN ? 'rgba(170,185,210,.6)' : 'rgba(110,100,95,.5)');
    quad(X0, 7.2, CROSS[1], 16, WIN ? P.snow : '#86b866');
    quad(CROSS[2], 7.2, X1, 16, WIN ? P.snow : '#86b866');
    if (!WIN) for (var gg = 0; gg < 120; gg++) { var gp = iso(X0 + hash(gg, 8) * 37, 7.4 + hash(8, gg) * 6); R(gp[0], gp[1], 1, 2, hash(gg, 3) > .5 ? '#a9d47f' : '#5c9046'); }
    // fallen leaves in fall
    if (!WIN) for (var lf = 0; lf < 70; lf++) { var lp = iso(X0 + hash(lf, 11) * 37, hash(11, lf) * 7.2); if (hash(lf, 12) > .6) R(lp[0], lp[1], 2, 1, P.fall[lf % 4]); }
  }
  function parkFence() { // the low iron fence along the park, drawn after the far side so it sits in front
    for (var x = -14; x < 34; x += .5) {
      if (x > CROSS[1] - .1 && x < CROSS[2]) continue;
      var p = iso(x, 7.3); R(p[0], p[1] - 7, 1, 7, '#2f2a33'); R(p[0], p[1] - 8, 1, 1, '#4a4450');
    }
    [2, 5].forEach(function (h) { line(up(iso(-14, 7.3), h), up(iso(CROSS[1] - .1, 7.3), h), '#2f2a33'); line(up(iso(CROSS[2], 7.3), h), up(iso(34, 7.3), h), '#2f2a33'); });
    if (WIN) line(up(iso(-14, 7.3), 8), up(iso(CROSS[1] - .1, 7.3), 8), '#ffffff', 2);
  }

  // ---------- a rowhouse: front on y = 0, side on x = x + w when the next plot is open ----------
  function F(x, h) { return up(iso(x, 0), h); }
  function fq(xa, xb, hb, ht, col) { poly([F(xa, hb), F(xb, hb), F(xb, ht), F(xa, ht)], col); }
  function S(xs, y, h) { return up(iso(xs, y), h); }
  function sq(xs, ya, yb, hb, ht, col) { poly([S(xs, ya, hb), S(xs, yb, hb), S(xs, yb, ht), S(xs, ya, ht)], col); }
  function frontWindow(o, xa, w, hb, ht, t, lit, extra) {
    fq(xa - .08, xa + w + .08, hb - 3, ht + 2, o.trim); // frame
    var glass = WIN ? (lit ? '#ffcf7a' : '#3b3560') : '#9ec3dc';
    if (o.blackout) glass = WIN ? '#3b3560' : '#3f4660';
    fq(xa, xa + w, hb, ht, glass);
    if (WIN && lit && !o.blackout) { var g = c.createRadialGradient(F(xa + w / 2, (hb + ht) / 2)[0], F(xa + w / 2, (hb + ht) / 2)[1], 1, F(xa + w / 2, (hb + ht) / 2)[0], F(xa + w / 2, (hb + ht) / 2)[1], 18); g.addColorStop(0, P.glow + '.35)'); g.addColorStop(1, P.glow + '0)'); c.fillStyle = g; var m = F(xa + w / 2, (hb + ht) / 2); c.fillRect(m[0] - 18, m[1] - 18, 36, 36); }
    if (!WIN && !o.blackout) { var a = F(xa, ht), b = F(xa + w * .4, ht); poly([a, b, F(xa + w * .1, hb + 3), F(xa, hb + 3)], 'rgba(255,255,255,.4)'); }
    if (extra) extra(xa, w, hb, ht);
    line(F(xa + w / 2, hb), F(xa + w / 2, ht), o.trim); line(F(xa, (hb + ht) / 2), F(xa + w, (hb + ht) / 2), o.trim); // muntins
    fq(xa - .12, xa + w + .12, hb - 4, hb - 2, P.marble[1]); // stone sill
    fq(xa - .1, xa + w + .1, ht + 2, ht + 5, shade(o.brick, -.25)); // brick lintel
  }
  function windowBox(xa, w, hb, flowers) {
    var a = F(xa - .05, hb - 4), b = F(xa + w + .05, hb - 4);
    poly([a, b, [b[0], b[1] + 5], [a[0], a[1] + 5]], WIN ? '#5d3b2a' : '#8e5a37');
    if (WIN) { poly([a, b, [b[0], b[1] - 2], [a[0], a[1] - 2]], P.snow); for (var k = 0; k < 4; k++) { var p = F(xa + .1 + k * w / 4, hb - 2); R(p[0], p[1] - 3, 3, 3, '#33603a'); R(p[0] + 1, p[1] - 2, 1, 1, '#d2363c'); } return; }
    for (var k2 = 0; k2 < 6; k2++) { var p2 = F(xa + k2 * w / 5.5, hb - 3); R(p2[0] - 1, p2[1] - 3, 3, 3, P.leaf); R(p2[0], p2[1] - 4, 2, 2, flowers[k2 % flowers.length]); }
  }
  function stoop(xd, wd) { // Philly marble steps up to the door, with an iron rail
    var cols = WIN ? [P.snow, '#d8dfea', '#b9c3d4'] : P.marble;
    box(xd - .1, 0, wd + .2, 1.2, 3, cols); box(xd - .1, 0, wd + .2, .8, 6, cols); box(xd - .1, 0, wd + .2, .4, 9, cols);
    [xd - .1, xd + wd + .1].forEach(function (rx) { var a = up(iso(rx, 1.2), 3), b = up(iso(rx, 0), 9); line(up(a, 10), up(b, 14), '#2f2a33'); line(a, up(a, 10), '#2f2a33'); line(b, up(b, 14), '#2f2a33'); });
  }
  function door(o, xd, wd, t) {
    var hb = 9, ht = 44;
    fq(xd - .12, xd + wd + .12, hb, ht + 9, o.trim);
    fq(xd, xd + wd, hb, ht, o.doorCol);
    fq(xd + .1, xd + wd - .1, hb + 4, hb + 14, shade(o.doorCol, -.18)); fq(xd + .1, xd + wd - .1, hb + 18, ht - 4, shade(o.doorCol, -.18));
    fq(xd + .05, xd + wd - .05, ht + 2, ht + 7, WIN ? '#ffd98a' : '#cfe3ef'); // transom
    var kb = F(xd + wd - .18, hb + 17); R(kb[0] - 1, kb[1], 2, 2, '#e7bb4f');
    var lamp = F(xd + wd + .32, 34); R(lamp[0] - 1, lamp[1], 3, 6, '#2f2a33'); R(lamp[0], lamp[1] + 1, 1, 4, WIN ? '#ffe08a' : '#e8d9b0');
    if (WIN) { var g = c.createRadialGradient(lamp[0], lamp[1] + 3, 1, lamp[0], lamp[1] + 3, 20); g.addColorStop(0, P.glow + '.5)'); g.addColorStop(1, P.glow + '0)'); c.fillStyle = g; c.fillRect(lamp[0] - 20, lamp[1] - 17, 40, 40);
      var wr = F(xd + wd / 2, 32); c.strokeStyle = '#33603a'; c.lineWidth = 3; c.beginPath(); c.arc(wr[0], wr[1], 4, 0, 7); c.stroke(); c.lineWidth = 1; R(wr[0] - 1, wr[1] + 3, 3, 2, '#d2363c'); }
    var num = F(xd + wd / 2, ht + 3); // a brass house number plate, no real address
    R(num[0] - 2, num[1] - 1, 4, 2, '#e7bb4f');
  }
  function house(o, t) {
    var x0 = o.x, x1 = o.x + o.w, h = o.h;
    // flat roof with a parapet, then the side if open
    poly([F(x0, h + 6), F(x1, h + 6), S(x1, -DEEP, h + 6), S(x0, -DEEP, h + 6)], WIN ? P.snow : '#7a6a6e');
    for (var rs = 1; rs < DEEP; rs++) line(S(x0, -rs, h + 6), S(x1, -rs, h + 6), WIN ? 'rgba(180,195,220,.5)' : 'rgba(60,45,50,.3)');
    if (o.who === 'sarah') { box(x0 + 1.9, -2.6, .5, .5, 12, WIN ? [P.snow, '#9e5a4e', '#7d3527'] : ['#6b3a30', '#9e5a4e', '#7d3527'], h + 6); box(x0 + .5, -1.8, .9, .9, 4, WIN ? [P.snow, '#c9bfb2', '#a8a096'] : ['#b9b4ae', '#c9bfb2', '#a8a096'], h + 6); }
    else if (hash(o.x, 2) > .3) box(x0 + .3 + hash(o.x, 4) * 2, -2.8, .5, .5, 10, WIN ? [P.snow, '#9e5a4e', '#7d3527'] : ['#6b3a30', '#9e5a4e', '#7d3527'], h + 6);
    if (o.sideOpen) {
      var sc = shade(o.brick, -.2);
      poly([S(x1, 0, 0), S(x1, -DEEP, 0), S(x1, -DEEP, h + 6), S(x1, 0, h + 6)], sc);
      for (var hs = 4; hs < h; hs += 4) line(S(x1, 0, hs), S(x1, -DEEP, hs), 'rgba(50,25,20,.2)');
      if (!o.corner) { // a party wall left bare by an old house that's gone: its faint roofline stays in the brick
        poly([S(x1, 0, 4), S(x1, -DEEP, 4), S(x1, -DEEP, h - 20), S(x1, -DEEP / 2, h - 6), S(x1, 0, h - 20)], shade(o.brick, -.1));
        line(S(x1, -DEEP, h - 20), S(x1, -DEEP / 2, h - 6), 'rgba(255,255,255,.18)'); line(S(x1, -DEEP / 2, h - 6), S(x1, 0, h - 20), 'rgba(255,255,255,.18)');
      } else { // Theo's corner: his own mural on the side, a big sun over rolling hills, plus two side windows
        c.save(); poly([S(x1, -.3, 6), S(x1, -DEEP + .3, 6), S(x1, -DEEP + .3, 50), S(x1, -.3, 50)], null); c.clip();
        poly([S(x1, -.3, 6), S(x1, -DEEP + .3, 6), S(x1, -DEEP + .3, 50), S(x1, -.3, 50)], WIN ? '#4b4f86' : '#8fd0e8');
        var sun = S(x1, -2.6, 36); c.fillStyle = WIN ? '#f6cd5c' : '#ffd56b'; c.beginPath(); c.ellipse(sun[0], sun[1], 9, 11, 0, 0, 7); c.fill(); c.fillStyle = '#f39b62'; c.beginPath(); c.ellipse(sun[0], sun[1], 5, 6, 0, 0, 7); c.fill();
        poly([S(x1, -.3, 6), S(x1, -DEEP + .3, 6), S(x1, -DEEP + .3, 24), S(x1, -3.4, 16), S(x1, -1.6, 26), S(x1, -.3, 18)], '#e46f8b');
        poly([S(x1, -.3, 6), S(x1, -DEEP + .3, 6), S(x1, -DEEP + .3, 14), S(x1, -2.4, 10), S(x1, -.3, 13)], '#7fa7a0');
        c.restore(); poly([S(x1, -.3, 6), S(x1, -DEEP + .3, 6), S(x1, -DEEP + .3, 50), S(x1, -.3, 50)], null, 'rgba(59,36,48,.4)');
        [[-1.2, 58, 76], [-3.4, 58, 76]].forEach(function (w) { sq(x1, w[0], w[0] - .9, w[1] - 2, w[2] + 2, o.trim); sq(x1, w[0] - .08, w[0] - .82, w[1], w[2], WIN ? '#ffcf7a' : '#9ec3dc'); });
      }
      poly([S(x1, 0, h), S(x1, -DEEP, h), S(x1, -DEEP, h + 6), S(x1, 0, h + 6)], WIN ? P.snow : o.trim);
    }
    // the front wall
    fq(x0, x1, 0, h, o.brick);
    if (!o.painted) {
      for (var hh = 4, rw = 0; hh < h; hh += 4, rw++) { line(F(x0, hh), F(x1, hh), 'rgba(217,185,163,.55)'); for (var bx = x0 + (rw % 2) * .25; bx < x1; bx += .5) { var bp = F(bx, hh); R(bp[0], bp[1] - 3, 1, 3, 'rgba(217,185,163,.45)'); } }
      for (var k = 0; k < 18; k++) { var p2 = F(x0 + hash(k, o.x) * o.w, 6 + Math.floor(hash(o.x, k) * 18) * 4); R(p2[0] - 2, p2[1] - 2, 4, 2, hash(k, k) > .5 ? shade(o.brick, .12) : shade(o.brick, -.12)); }
    } else { for (var hp = 8; hp < h; hp += 8) line(F(x0, hp), F(x1, hp), 'rgba(0,0,0,.05)'); }
    fq(x0, x1, 0, 7, WIN ? '#cfd6e2' : P.marble[2]); // stone base
    // cornice with brackets
    fq(x0 - .05, x1 + .05, h, h + 6, WIN ? P.snow : o.trim);
    fq(x0, x1, h - 3, h, shade(o.trim, -.15));
    for (var bk = x0 + .25; bk < x1; bk += .5) { var cp = F(bk, h - 3); R(cp[0] - 1, cp[1], 2, 3, shade(o.trim, -.28)); }
    line(F(x0, 0), F(x0, h + 6), 'rgba(40,20,20,.45)');
    // door and windows: door on one side, a window beside it, two windows upstairs
    var left = o.doorAt === 'L', xd = left ? x0 + .35 : x1 - 1.15, wd = .8, xw = left ? x0 + 1.55 : x0 + .45;
    var flowers = o.who === 'dot' ? [P.rose, P.sun, '#c8a6d8', P.roseHi, '#ffffff'] : [P.rose, P.sun, P.roseHi];
    if (o.corner) { // a corner storefront window, now Theo's studio: paintings and an easel inside
      fq(x0 + 1.3, x1 - .1, 6, 40, o.trim); fq(x0 + 1.4, x1 - .2, 9, 37, WIN ? '#ffcf7a' : '#bfd8e4');
      [[1.6, 16, 30, '#e46f8b'], [2.15, 20, 32, '#7fa7a0'], [2.55, 14, 26, '#ffd56b']].forEach(function (pt) { fq(x0 + pt[0], x0 + pt[0] + .35, pt[1], pt[2], '#fff6ea'); fq(x0 + pt[0] + .05, x0 + pt[0] + .3, pt[1] + 2, pt[2] - 2, pt[3]); });
      var ep = F(x0 + 2.2, 10); line(ep, up(ep, 12), '#8e5a37'); line([ep[0] - 3, ep[1]], up(ep, 10), '#8e5a37');
      fq(x0 + 1.2, x1, 40, 46, '#5b3f6b'); vtF('STUDIO', F(x0 + 1.25, 45), '#fff1e2');
    } else frontWindow(o, xw, .9, 14, 36, t, true, o.who === 'sarah' ? catInWindow : (o.who === 'mj' ? boxesInWindow : null));
    [[x0 + .45, .8], [x1 - 1.25, .8]].forEach(function (w, i) { frontWindow(o, w[0], w[1], 52, 72, t, WIN && (i + o.x) % 3 !== 0); if (o.who === 'dot' || o.who === 'sarah') windowBox(w[0], w[1], 52, flowers); });
    if (o.awning) { var a0 = F(xw - .1, 40), a1 = F(xw + 1.0, 40); poly([a0, a1, [a1[0] + 2, a1[1] + 6], [a0[0] + 2, a0[1] + 6]], WIN ? P.snow : o.awning); for (var s = 0; s < 5; s++) { var sp = F(xw + s * .25, 40); line(sp, [sp[0] + 2, sp[1] + 6], WIN ? P.snow2 : '#f2e6d4', 2); } }
    if (o.who === 'dot' && !o.corner) windowBox(xw, .9, 14, flowers);
    door(o, xd, wd, t);
    stoop(xd, wd);
    if (WIN) stringLightsOn(x0, x1, h, t);
  }
  function vtF(s, p, col) { c.font = '8px "VT323", monospace'; c.fillStyle = col; c.textAlign = 'left'; c.textBaseline = 'alphabetic'; c.fillText(s, p[0] + 1, p[1] + 5); }
  function catInWindow(xa, w, hb) { // Louie's shape on the sill, watching the street
    var p = F(xa + w * .62, hb); var col = WIN ? '#c46a2e' : '#d9813a';
    R(p[0] - 5, p[1] - 6, 9, 6, col); R(p[0] - 4, p[1] - 10, 6, 5, col); R(p[0] - 4, p[1] - 11, 1, 2, col); R(p[0] + 1, p[1] - 11, 1, 2, col); R(p[0] - 3, p[1] - 8, 1, 1, '#2b2226'); R(p[0], p[1] - 8, 1, 1, '#2b2226'); R(p[0] + 4, p[1] - 3, 3, 2, col);
  }
  function boxesInWindow(xa, w, hb) { // Marco and Jules are still living out of boxes
    [[.1, 0, 8], [.45, 0, 6], [.25, 8, 6]].forEach(function (b) { var p = F(xa + b[0], hb + b[1]); R(p[0], p[1] - b[2], 9, b[2], '#c9935f'); R(p[0], p[1] - b[2], 9, 1, '#e0b07c'); R(p[0] + 3, p[1] - b[2], 2, b[2], '#e6c58d'); });
  }
  function stringLightsOn(x0, x1, h, t) { // warm bulbs swagged under the cornice
    for (var x = x0; x < x1; x += .5) {
      var a = F(x, h - 5), b = F(x + .5, h - 5), m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 3];
      c.strokeStyle = '#3b2430'; c.beginPath(); c.moveTo(a[0], a[1]); c.quadraticCurveTo(m[0], m[1] + 2, b[0], b[1]); c.stroke();
      var on = (Math.floor(t / 2) + Math.round(x * 2)) % 6 !== 0, col = ['#ffe08a', '#e46f8b', '#8fd0ff', '#a9d47f'][Math.round(x * 2) & 3];
      if (on) { c.fillStyle = 'rgba(255,225,150,.35)'; c.beginPath(); c.arc(m[0], m[1] + 2, 3, 0, 7); c.fill(); }
      R(m[0] - 1, m[1] + 1, 2, 2, on ? col : '#8a7a80');
    }
  }

  // ---------- an empty lot ----------
  function lot(o, t, focus) {
    var x0 = o.x, x1 = o.x + o.w;
    quad(x0, -DEEP, x1, 0, WIN ? P.snow : '#93ad62');
    if (!WIN) for (var g = 0; g < 26 * o.w; g++) { var p = iso(x0 + hash(g, o.x) * o.w, -DEEP + hash(o.x, g) * DEEP); R(p[0], p[1] - 2, 1, 2, hash(g, 2) > .5 ? '#b6cc7c' : '#6e8a46'); if (hash(g, 9) > .93) R(p[0] - 1, p[1] - 3, 2, 2, hash(g, 5) > .5 ? '#ffd56b' : '#f6f0ff'); }
    else for (var s = 0; s < 8 * o.w; s++) { var sp = iso(x0 + hash(s, o.x) * o.w, -DEEP + hash(o.x, s) * DEEP); R(sp[0], sp[1], 3, 1, '#ffffff'); }
    // a wooden back fence, and the lot marker stakes at the corners
    for (var fx = x0; fx < x1; fx += .25) { var a = iso(fx, -DEEP), b = iso(fx + .25, -DEEP); poly([a, b, up(b, 18), up(a, 18)], WIN ? ['#c8b49a', '#bba58a'][Math.round(fx * 4) & 1] : ['#d8b283', '#c69e70'][Math.round(fx * 4) & 1]); if (WIN) R(a[0], a[1] - 19, 3, 2, P.snow); }
    // a low wooden rail along the sidewalk, open in the middle
    var gap0 = x0 + o.w / 2 - .6, gap1 = x0 + o.w / 2 + .6;
    [[x0, gap0], [gap1, x1]].forEach(function (seg) { for (var px = seg[0]; px <= seg[1] + .01; px += .5) { var pp = iso(px, -.05); R(pp[0] - 1, pp[1] - 9, 2, 9, WIN ? '#a78e72' : '#8e5a37'); } [4, 8].forEach(function (h) { line(up(iso(seg[0], -.05), h), up(iso(seg[1], -.05), h), WIN ? '#bba58a' : '#a9764a'); }); });
    // a sign: a little house with a plus, and the size
    var sg = iso(x0 + .6, -1.2); R(sg[0] - 1, sg[1] - 22, 2, 22, '#8e5a37');
    R(sg[0] - 13, sg[1] - 34, 26, 14, focus ? '#fde3ea' : '#fff6ea'); c.strokeStyle = focus ? P.rose : '#b38a8f'; c.strokeRect(sg[0] - 12.5, sg[1] - 33.5, 25, 13);
    R(sg[0] - 9, sg[1] - 29, 7, 6, P.trayInk); c.fillStyle = P.trayInk; c.beginPath(); c.moveTo(sg[0] - 10, sg[1] - 29); c.lineTo(sg[0] - 5.5, sg[1] - 33); c.lineTo(sg[0] - 1, sg[1] - 29); c.fill(); R(sg[0] - 6, sg[1] - 27, 2, 4, '#fff6ea');
    R(sg[0] + 3, sg[1] - 29, 7, 2, P.rose); R(sg[0] + 5.5, sg[1] - 31.5, 2, 7, P.rose);
    if (WIN) R(sg[0] - 13, sg[1] - 35, 26, 2, P.snow);
    if (focus) { // the build outline glows on the lot
      var pulse = .35 + .15 * Math.sin(t / 2);
      poly([iso(x0 + .2, -DEEP + .2), iso(x1 - .2, -DEEP + .2), iso(x1 - .2, -.3), iso(x0 + .2, -.3)], 'rgba(228,111,139,' + pulse + ')', 'rgba(255,255,255,.95)');
      c.setLineDash([3, 3]); poly([iso(x0 + .5, -DEEP + .5), iso(x1 - .5, -DEEP + .5), iso(x1 - .5, -.6), iso(x0 + .5, -.6)], null, 'rgba(255,255,255,.8)'); c.setLineDash([]);
    }
  }

  // ---------- the street side: trees, lamps, the corner, the park ----------
  function tree(x, y, t) {
    var b = iso(x, y); quadAt(b, 'rgba(60,40,30,.25)');
    R(b[0] - 2, b[1] - 34, 4, 34, '#6b4a30'); R(b[0] - 2, b[1] - 34, 1, 34, '#8e6a48');
    poly([iso(x - .45, y - .45), iso(x + .45, y - .45), iso(x + .45, y + .45), iso(x - .45, y + .45)], WIN ? P.snow3 : '#6b4a30');
    if (WIN) { c.strokeStyle = '#4a3a4a'; c.lineWidth = 2; [[-14, -58], [12, -56], [0, -68], [-8, -46], [9, -44]].forEach(function (d) { c.beginPath(); c.moveTo(b[0], b[1] - 32); c.quadraticCurveTo(b[0] + d[0] * .3, b[1] + d[1] * .7, b[0] + d[0], b[1] + d[1]); c.stroke(); R(b[0] + d[0] - 2, b[1] + d[1] - 1, 5, 2, P.snow); }); c.lineWidth = 1;
      for (var k = 0; k < 9; k++) { var on = (Math.floor(t / 2) + k) % 4 !== 0, lx = b[0] - 12 + hash(k, x) * 24, ly = b[1] - 62 + hash(x, k) * 26; if (on) { c.fillStyle = 'rgba(255,225,150,.35)'; c.beginPath(); c.arc(lx, ly, 3, 0, 7); c.fill(); } R(lx, ly, 2, 2, on ? '#ffe08a' : '#8a7a80'); }
      return; }
    var sway = Math.round(Math.sin((t + x) / 3));
    [[0, -50, 17, 2], [-11, -42, 11, 2], [11, -43, 12, 0], [-3, -61, 11, 0]].forEach(function (q) { c.fillStyle = P.fall[q[3]]; c.beginPath(); c.arc(b[0] + q[0] + sway, b[1] + q[1], q[2], 0, 7); c.fill(); });
    [[-4, -53, 12, 1], [-12, -44, 6, 3], [8, -47, 7, 1], [-5, -63, 6, 3]].forEach(function (q) { c.fillStyle = P.fall[q[3]]; c.beginPath(); c.arc(b[0] + q[0] + sway, b[1] + q[1], q[2], 0, 7); c.fill(); });
    for (var f = 0; f < 3; f++) { var fy = (t * 2 + f * 13 + x * 7) % 40; R(b[0] - 10 + f * 9 + Math.round(Math.sin((t + f) / 2) * 3), b[1] - 34 + fy, 2, 1, P.fall[f]); }
  }
  function quadAt(b, col) { c.fillStyle = col; c.beginPath(); c.ellipse(b[0] + 3, b[1] + 1, 12, 5, 0, 0, 7); c.fill(); }
  function lampPost(x, y, t) {
    var b = iso(x, y);
    R(b[0] - 1, b[1] - 40, 3, 40, '#2f2a33'); R(b[0] - 2, b[1] - 3, 5, 3, '#2f2a33');
    R(b[0] - 4, b[1] - 50, 9, 10, '#2f2a33'); R(b[0] - 3, b[1] - 49, 7, 8, WIN ? '#ffe08a' : '#f3ead2'); R(b[0] - 5, b[1] - 52, 11, 2, '#2f2a33'); R(b[0], b[1] - 54, 1, 2, '#2f2a33');
    if (WIN) { var g = c.createRadialGradient(b[0], b[1] - 45, 2, b[0], b[1] - 45, 40); g.addColorStop(0, P.glow + '.5)'); g.addColorStop(1, P.glow + '0)'); c.fillStyle = g; c.fillRect(b[0] - 40, b[1] - 85, 80, 80);
      c.fillStyle = 'rgba(255,220,150,.18)'; c.beginPath(); c.ellipse(b[0], b[1], 22, 9, 0, 0, 7); c.fill(); R(b[0] - 5, b[1] - 53, 11, 2, P.snow);
      // a wreath on the lamp post
      c.strokeStyle = '#33603a'; c.lineWidth = 2; c.beginPath(); c.arc(b[0] + 0.5, b[1] - 30, 4, 0, 7); c.stroke(); c.lineWidth = 1; R(b[0] - 1, b[1] - 27, 4, 2, '#d2363c'); }
  }
  function bench(x, y) {
    var a = iso(x, y), b = iso(x + 1.4, y);
    line(up(a, 6), up(b, 6), '#8e5a37', 3); line(up(a, 11), up(b, 11), '#8e5a37', 2); line(up(a, 14), up(b, 14), '#a9764a', 2);
    R(a[0], a[1] - 6, 1, 6, '#2f2a33'); R(b[0], b[1] - 6, 1, 6, '#2f2a33');
    if (WIN) line(up(a, 8), up(b, 8), P.snow, 2);
  }
  function mums(x, y) { var b = iso(x, y); R(b[0] - 4, b[1] - 6, 8, 6, '#b5624f'); R(b[0] - 5, b[1] - 7, 10, 2, '#d98a6f'); for (var k = 0; k < 7; k++) R(b[0] - 5 + hash(k, x) * 9, b[1] - 13 + hash(x, k) * 5, 2, 2, ['#d9813a', '#f6cd5c', '#b8323a'][k % 3]); }
  function pumpkin(x, y, s) { var b = iso(x, y); c.fillStyle = '#c8602e'; c.beginPath(); c.ellipse(b[0], b[1] - 3 * s, 4 * s, 3 * s, 0, 0, 7); c.fill(); c.fillStyle = '#e2873a'; c.beginPath(); c.ellipse(b[0] - 1, b[1] - 3.5 * s, 2 * s, 2.5 * s, 0, 0, 7); c.fill(); R(b[0], b[1] - 7 * s, 1, 2 * s, '#5c7a3a'); }
  function biscuit(px, py, t) { // Priya's goofy rescue dog, wagging on the stoop
    var wag = (t % 4) < 2 ? -1 : 1, D = '#c98a4a', Dl = '#e2b070', Dd = '#8e5a37';
    c.fillStyle = 'rgba(40,30,30,.25)'; c.beginPath(); c.ellipse(px, py, 8, 3, 0, 0, 7); c.fill();
    R(px - 7, py - 9, 11, 6, D); R(px - 6, py - 9, 9, 2, Dl); R(px - 7, py - 3, 2, 3, D); R(px + 2, py - 3, 2, 3, D); R(px - 4, py - 3, 2, 3, Dd);
    R(px + 2, py - 15, 7, 7, D); R(px + 3, py - 14, 5, 2, Dl); R(px + 8, py - 11, 3, 3, Dl); R(px + 10, py - 11, 1, 1, '#2b2226');
    R(px + 1, py - 14, 2, 6, Dd); R(px + 5, py - 13, 1, 1, '#2b2226'); R(px + 8, py - 8, 2, 3, '#e46f8b'); // ear, eye, tongue out
    R(px - 10 + (wag < 0 ? 0 : 1), py - 12 + (wag < 0 ? 0 : 1), 3, 2, D); R(px - 9, py - 10, 2, 2, D);
    R(px + 2, py - 9, 5, 1, P.rose); // collar
  }
  function sarahAt(px, py, t) {
    c.fillStyle = 'rgba(40,30,30,.28)'; c.beginPath(); c.ellipse(px, py, 8, 3, 0, 0, 7); c.fill();
    if (window.SS_SARAH) window.SS_SARAH(c, px - 9, py - 38, 1, t, false, null, 'bun');
    if (WIN) { R(px - 5, py - 24, 10, 3, '#d2363c'); R(px - 5, py - 24, 10, 1, '#ff7a6e'); R(px + 2, py - 22, 3, 6, '#b8323a'); } // a scarf for the cold
  }
  function dotAtDoor(px, py, t) { if (window.SS_DOT) { c.fillStyle = 'rgba(40,30,30,.25)'; c.beginPath(); c.ellipse(px, py, 8, 3, 0, 0, 7); c.fill(); window.SS_DOT(c, px - 10, py - 40, 1, t, false); } }

  // ---------- name tags over the homes ----------
  function nameTag(o, on, t) {
    var cx = iso(o.x + o.w / 2, 0)[0], ty = F(o.x + o.w / 2, (o.h || 0) + 14)[1] - (o.k === 'lot' ? -40 : 0);
    if (o.k === 'lot') ty = iso(o.x + o.w / 2, -DEEP)[1] - 32;
    var s = o.k === 'lot' ? 'LOT' : o.name;
    c.font = '10px "VT323", monospace'; var w = Math.ceil(c.measureText(s).width) + (o.mine ? 18 : 10), bob = on ? Math.round(Math.sin(t / 2)) : 0;
    var x = Math.round(cx - w / 2), y = Math.round(ty - 12 + bob);
    R(x + 1, y + 2, w, 12, 'rgba(34,23,31,.3)'); R(x, y, w, 12, on ? P.rose : 'rgba(255,246,234,.95)'); R(x, y + 11, w, 1, on ? P.roseSh : P.trayEdge);
    R(Math.round(cx) - 2, y + 12, 5, 1, on ? P.rose : 'rgba(255,246,234,.95)'); R(Math.round(cx) - 1, y + 13, 3, 1, on ? P.rose : 'rgba(255,246,234,.95)'); R(Math.round(cx), y + 14, 1, 1, on ? P.rose : 'rgba(255,246,234,.95)');
    if (o.mine) heart(x + 4, y + 3, on ? '#fff' : P.rose);
    c.fillStyle = on ? '#fff' : P.trayInk; c.textAlign = 'left'; c.textBaseline = 'top'; c.fillText(s, x + (o.mine ? 13 : 5), y);
  }

  // ---------- UI ----------
  function txt(s, x, y, col, size, align) { c.font = (size || 8) + 'px "Press Start 2P", monospace'; c.fillStyle = col; c.textAlign = align || 'left'; c.textBaseline = 'top'; c.fillText(s, x, y); }
  function vt(s, x, y, col, size, align) { c.font = (size || 10) + 'px "VT323", monospace'; c.fillStyle = col; c.textAlign = align || 'left'; c.textBaseline = 'top'; c.fillText(s, x, y); }
  function heart(x, y, col) { R(x + 1, y, 2, 1, col); R(x + 4, y, 2, 1, col); R(x, y + 1, 7, 2, col); R(x + 1, y + 3, 5, 1, col); R(x + 2, y + 4, 3, 1, col); R(x + 3, y + 5, 1, 1, col); }
  function bigHeart(x, y, on) { var col = on ? P.rose : '#e8dccd'; function h(a, b, w, hh) { R(x + a * 2, y + b * 2, w * 2, hh * 2, col); } h(1, 0, 2, 1); h(4, 0, 2, 1); h(0, 1, 7, 2); h(1, 3, 5, 1); h(2, 4, 3, 1); h(3, 5, 1, 1); if (on) R(x + 2, y + 2, 2, 2, '#ffd0dc'); }
  function coin(x, y) { R(x + 1, y, 5, 7, '#c78f3e'); R(x, y + 1, 7, 5, '#c78f3e'); R(x + 1, y + 1, 5, 5, '#f3d38a'); R(x + 3, y + 2, 1, 3, '#c78f3e'); R(x + 1, y + 1, 2, 1, '#fff3c4'); }
  function btn(x, y, w, s, on) { R(x, y, w, 14, on ? P.rose : '#fbeedd'); R(x, y + 13, w, 1, on ? P.roseSh : P.trayEdge); if (on) R(x, y, w, 1, P.roseHi); txt(s, x + w / 2, y + 4, on ? '#fff' : P.trayInk, 6, 'center'); }
  function topBar(W, day, time, coins, sunIcon) {
    R(4, 4, 150, 15, 'rgba(255,246,234,.95)'); R(4, 18, 150, 1, P.trayEdge);
    if (sunIcon) { R(9, 9, 6, 6, P.sun); R(11, 7, 2, 1, P.sunSh); R(11, 16, 2, 1, P.sunSh); R(7, 11, 1, 2, P.sunSh); R(16, 11, 1, 2, P.sunSh); R(10, 10, 2, 2, '#fff3c4'); }
    else { R(9, 8, 6, 7, '#f3d38a'); R(12, 8, 4, 5, 'rgba(255,246,234,1)'); }
    txt(day, 20, 8, P.trayInk, 6); txt(time, 150, 8, P.trayInk, 6, 'right');
    R(W - 62, 4, 58, 15, 'rgba(255,246,234,.95)'); R(W - 62, 18, 58, 1, P.trayEdge); coin(W - 57, 8); txt(coins, W - 8, 8, P.trayInk, 7, 'right');
  }
  function trayBase(W, y, h) { R(0, y - 2, W, 2, 'rgba(59,36,48,.25)'); R(0, y, W, h, P.tray); R(0, y, W, 1, '#fffaf3'); }
  // the block at a glance: every plot as a tiny front, the part on screen framed, Sarah's spot marked
  function blockStrip(W, y, viewX, sel) {
    var x0 = 6, w = W - 12, span = 31; // tiles from -5 to 26
    R(x0, y, w, 24, '#fbeedd'); R(x0, y + 23, w, 1, P.trayEdge);
    R(x0, y + 19, w, 3, '#bdb7b0');
    function X(tx) { return x0 + (tx + 5) / span * w; }
    PLOTS.forEach(function (o) {
      var a = X(o.x) + 1, b = X(o.x + o.w) - 1, on = sel === o;
      if (o.k === 'lot') { c.setLineDash([2, 2]); c.strokeStyle = on ? P.rose : '#b38a8f'; c.strokeRect(Math.round(a) + .5, y + 9.5, Math.round(b - a) - 1, 9); c.setLineDash([]); R((a + b) / 2 - 2, y + 13, 5, 1, on ? P.rose : '#b38a8f'); R((a + b) / 2, y + 11, 1, 5, on ? P.rose : '#b38a8f'); return; }
      var hh = Math.round((o.h - 60) / 4) + 9; R(a, y + 19 - hh, b - a, hh, o.brick); R(a, y + 18 - hh, b - a, 2, o.trim);
      R(o.doorAt === 'L' ? a + 2 : b - 5, y + 13, 3, 6, o.doorCol); R(o.doorAt === 'L' ? b - 6 : a + 2, y + 12, 3, 3, '#cfe3ef');
      if (on) { c.strokeStyle = P.rose; c.lineWidth = 1; c.strokeRect(Math.round(a) - .5, y + 17.5 - hh, Math.round(b - a) + 1, hh + 2); }
      if (o.mine) heart(Math.round((a + b) / 2) - 3, y + 1, P.rose);
    });
    R(X(CROSS[1]), y + 4, X(CROSS[2]) - X(CROSS[1]), 18, '#8f8a86'); for (var k = 0; k < 4; k++) R(X(CROSS[1]) + 2 + k * 4, y + 19, 2, 3, '#ece6dc');
    // the part on screen
    c.strokeStyle = P.trayInk; c.strokeRect(Math.round(X(viewX - 8)) + .5, y + .5, Math.round(X(viewX + 8) - X(viewX - 8)), 22);
    var sx = X(viewX); R(sx - 1, y + 19, 3, 3, P.rose);
  }
  function portraitDot(x, y, sz, t) {
    R(x, y, sz, sz, '#e6efdf'); c.save(); c.beginPath(); c.rect(x, y, sz, sz); c.clip();
    var sc = Math.max(1, Math.floor(sz / 19)); if (window.SS_DOT) window.SS_DOT(c, x + Math.round((sz - 20 * sc) / 2), y + 2, sc, t, true);
    c.restore(); c.strokeStyle = P.rose; c.strokeRect(x + .5, y + .5, sz - 1, sz - 1);
  }

  function camera(fx, fy, sy) { OX = 0; OY = 0; var p = iso(fx, fy); OX = 120 - p[0]; OY = sy - p[1]; }

  window.drawNeighborhood = function (ctx, W, H, t, st) {
    st = st || 'street'; c = ctx; t = t || 0; WIN = st === 'lot'; c.imageSmoothingEnabled = false;
    var focus = st === 'knock' ? PLOTS[3] : st === 'lot' ? PLOTS[6] : PLOTS[4];
    var trayH = st === 'street' ? 70 : 100, fx = focus.x + focus.w / 2;
    camera(fx, 1.2, Math.min(H - trayH - 22, st === 'street' ? 196 : 176));
    sky(W, H, t);
    ground(t);
    PLOTS.forEach(function (o) { if (o.k === 'lot') lot(o, t, st === 'lot' && o === focus); else house(o, t); });
    // a generic home across the cross street, so the corner reads as a corner
    house({ k: 'home', x: 26.6, w: 3, h: 80, brick: '#9e5a4e', trim: '#e9d6c4', doorCol: '#5d4a6e', doorAt: 'L' }, t);
    // stoop things
    if (!WIN) { mums(6.15, .5); pumpkin(6.95, .4, 1.2); pumpkin(6.75, .9, .8); mums(10.9, .6); pumpkin(12.45, .5, 1); }
    // street trees and lamps on the brick sidewalk, then the park side
    var items = [];
    [-.6, 4.4].forEach(function (x) { items.push({ d: x + 2.2, f: function () { tree(x, 2.2, t); } }); });
    [-1.8, 5.5, 14.0, 22.8].forEach(function (x) { items.push({ d: x + 2.0, f: function () { lampPost(x, 2.1, t); } }); });
    var me = st === 'knock' ? [7.2, 1.6] : st === 'lot' ? [16.4, 1.0] : [11.4, 1.25];
    items.push({ d: me[0] + me[1], f: function () { var p = iso(me[0], me[1]); sarahAt(p[0], p[1], t); } });
    items.push({ d: 2.3 + .9, f: function () { var p = up(iso(2.3, .9), 3); biscuit(p[0], p[1], t); } });
    items.sort(function (a, b) { return a.d - b.d; }).forEach(function (it) { it.f(); });
    parkFence();
    [[-2, 8.4], [9.6, 8.4], [16.6, 8.4]].forEach(function (b) { bench(b[0], b[1]); });
    [[2.8, 9.4], [13.2, 9.6], [21, 9.2]].forEach(function (p) { tree(p[0], p[1], t + 3); });
    if (WIN) { for (var i = 0; i < 46; i++) { var sx = (i * 37 + t * (i % 3 + 1)) % W, sy = (i * 53 + t * 2 * (1 + i % 2)) % (H - trayH); c.fillStyle = 'rgba(255,255,255,' + (.5 + (i % 3) * .15) + ')'; c.fillRect(sx, sy, 1 + (i % 4 === 0), 1 + (i % 4 === 0)); } }
    // name tags
    if (st === 'street') PLOTS.forEach(function (o) { if (o.k !== 'lot') nameTag(o, o.mine, t); else nameTag(o, false, t); });
    else nameTag(focus, true, t);

    var y = H - trayH;
    if (st === 'street') {
      topBar(W, 'SAT NOV 28', '3:30 PM', '1,180', true);
      trayBase(W, y, trayH);
      txt('THE BLOCK', 6, y + 6, P.trayInk, 8); vt('Tap a home to walk there', W - 6, y + 4, '#8e6670', 10, 'right');
      blockStrip(W, y + 19, fx, focus);
      btn(6, y + 50, 74, 'GO IN', true); btn(86, y + 50, 74, 'INVITE', false); btn(166, y + 50, 68, 'MAP', false);
    } else if (st === 'knock') {
      topBar(W, 'SAT NOV 28', '3:42 PM', '1,180', true);
      trayBase(W, y, trayH);
      portraitDot(6, y + 6, 38, t);
      txt("DOT'S HOME", 50, y + 7, P.trayInk, 8);
      vt('FRIENDS', 50, y + 17, '#8e6670', 10); for (var hk = 0; hk < 5; hk++) bigHeart(88 + hk * 17, y + 19, hk < 3);
      vt('Her story: visit 4 of 4. She asked you', 50, y + 31, P.trayInk, 10); vt('to redo her dusty sunroom.', 50, y + 40, P.trayInk, 10);
      R(6, y + 53, W - 12, 24, '#fde3ea'); R(6, y + 76, W - 12, 1, '#f1b8c6');
      txt('REDO: SUNROOM INTO', 12, y + 57, P.roseSh, 6); txt('A GUEST ROOM', 12, y + 66, P.roseSh, 6);
      coin(W - 60, y + 57); txt('600', W - 51, y + 57, P.trayInk, 7); vt('pieces lent free', W - 12, y + 64, '#8e6670', 10, 'right');
      btn(6, y + 82, 70, 'KNOCK', false); btn(82, y + 82, 86, 'REDO HOME', true); btn(174, y + 82, 60, 'BACK', false);
    } else {
      topBar(W, 'THU DEC 24', '6:15 PM', '1,640', false);
      trayBase(W, y, trayH);
      R(6, y + 6, 38, 38, '#eef3f9'); c.strokeStyle = P.rose; c.strokeRect(6.5, y + 6.5, 37, 37);
      c.setLineDash([2, 2]); c.strokeStyle = P.trayInk; c.strokeRect(11.5, y + 22.5, 27, 15); c.setLineDash([]);
      R(17, y + 13, 16, 2, P.rose); R(24, y + 9, 2, 10, P.rose);
      txt('EMPTY LOT', 50, y + 7, P.trayInk, 8);
      vt('MEDIUM  ·  4 wide  ·  up to 3 floors', 50, y + 17, '#8e6670', 10);
      vt('Build a home here from scratch.', 50, y + 29, P.trayInk, 10); vt('People you make can move in.', 50, y + 38, P.trayInk, 10);
      R(6, y + 53, W - 12, 24, '#eef6e6'); R(6, y + 76, W - 12, 1, '#b9d8a0');
      txt('LOTS ON THE BLOCK', 12, y + 57, '#437a47', 6); vt('Small · Medium · Large, all free to build on', 12, y + 64, '#437a47', 10);
      btn(6, y + 82, 150, 'BUILD HERE', true); btn(162, y + 82, 72, 'BACK', false);
    }
  };
})();
