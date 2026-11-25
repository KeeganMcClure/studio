// Sarah's Sim: furniture detail levels v1 (Nov 25, 2026). All art drawn in code.
// drawDetail(ctx, level, t): one 132 x 122 scene at game pixels (a sofa, side table, floor lamp and plant on a floor patch).
// level 0 = Simple (flat 3-tone shapes), 1 = Cozy (outlines, cushions, pillows, a throw), 2 = Rich (Cozy plus fabric
// texture, wood grain, piping, patterns and little props). Same isometric grid and light as the approved room (light upper left).
(function () {
  var c, L, TW = 22, TH = 11, OX = 66, OY = 44;
  var INK = 'rgba(59,36,48,.85)';
  function iso(x, y) { return [OX + (x - y) * TW / 2, OY + (x + y) * TH / 2]; }
  function up(p, h) { return [p[0], p[1] - h]; }
  function poly(pts, fill, stroke) { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (var i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); if (fill) { c.fillStyle = fill; c.fill(); } if (stroke) { c.strokeStyle = stroke; c.lineWidth = 1; c.stroke(); } }
  function R(x, y, w, h, col) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
  function line(a, b, col, w) { c.strokeStyle = col; c.lineWidth = w || 1; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); c.lineWidth = 1; }
  // box: tile x,y, size w,d, height h px, lifted z. cols = [top, left-front (+y face), right-front (+x face)]
  function box(x, y, w, d, h, cols, z, noLine) {
    z = z || 0;
    var A = up(iso(x, y), z), B = up(iso(x + w, y), z), C = up(iso(x + w, y + d), z), D = up(iso(x, y + d), z);
    poly([D, C, up(C, h), up(D, h)], cols[1]); poly([B, C, up(C, h), up(B, h)], cols[2]); poly([up(A, h), up(B, h), up(C, h), up(D, h)], cols[0]);
    if (L > 0 && !noLine) { poly([up(A, h), up(B, h), B, C, D, up(D, h)], null, INK); line([up(D, h)[0], up(D, h)[1] + .5], [up(C, h)[0], up(C, h)[1] + .5], 'rgba(255,255,255,.35)'); }
    return { A: A, B: B, C: C, D: D, h: h };
  }
  // fabric texture on a face: a soft checker of slightly darker pixels (Rich only)
  function weave(pts, col) {
    if (L < 2) return;
    c.save(); c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (var i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); c.clip();
    var xs = pts.map(function (p) { return p[0]; }), ys = pts.map(function (p) { return p[1]; });
    for (var x = Math.floor(Math.min.apply(0, xs)); x < Math.max.apply(0, xs); x += 2) for (var y = Math.floor(Math.min.apply(0, ys)); y < Math.max.apply(0, ys); y += 2) if (((x >> 1) + (y >> 1)) % 2 === 0) R(x, y, 1, 1, col);
    c.restore();
  }
  function faces(b) { var A = b.A, B = b.B, C = b.C, D = b.D, h = b.h; return { top: [up(A, h), up(B, h), up(C, h), up(D, h)], left: [D, C, up(C, h), up(D, h)], right: [B, C, up(C, h), up(B, h)] }; }
  function texBox(x, y, w, d, h, cols, z, tex) { var b = box(x, y, w, d, h, cols, z); if (L === 2) { var f = faces(b); weave(f.top, tex || 'rgba(0,0,0,.07)'); weave(f.left, tex || 'rgba(0,0,0,.07)'); weave(f.right, tex || 'rgba(0,0,0,.07)'); if (!b.noLine) poly([up(b.A, h), up(b.B, h), b.B, b.C, b.D, up(b.D, h)], null, INK); } return b; }
  function shadow(x, y, w, d) { poly([iso(x + .1, y + .1), iso(x + w + .3, y + .1), iso(x + w + .3, y + d + .3), iso(x + .1, y + d + .3)], 'rgba(90,45,40,.22)'); }
  function eShadow(px, py, rx) { c.fillStyle = 'rgba(90,45,40,.28)'; c.beginPath(); c.ellipse(px, py, rx, rx / 2, 0, 0, 7); c.fill(); }

  var ROSE = ['#f39bb0', '#e46f8b', '#b44f63'], WOOD = ['#dca474', '#b9804f', '#8e5a37'], DARK = ['#9b6a48', '#7a4e33', '#5a3622'];
  var FAB = ['#e99a70', '#d07a50', '#9a4c2d'], CUSH = ['#f0ab84', '#de8a62', '#a85a38'];
  var FLAT = function (a) { return [a[0], a[1], a[2]]; };

  function floor() {
    // a patch of plank floor and the corner of two walls, as in the approved room
    var n = 4;
    poly([iso(0, 0), up(iso(0, 0), 60), up(iso(n, 0), 60), iso(n, 0)], '#f3d2c4');
    poly([iso(0, 0), up(iso(0, 0), 60), up(iso(0, n), 60), iso(0, n)], '#ecc1b2');
    if (L > 0) { line(up(iso(0, n), 14), up(iso(0, 0), 14), '#fff1e2', 2); line(up(iso(0, 0), 14), up(iso(n, 0), 14), '#fff1e2', 2); }
    if (L === 2) { for (var k = .5; k < n; k += 1) { var s1 = up(iso(k, 0), 15), s2 = up(iso(k, 0), 58); line(s1, s2, 'rgba(255,255,255,.18)'); var s3 = up(iso(0, k), 15), s4 = up(iso(0, k), 58); line(s3, s4, 'rgba(160,90,80,.12)'); } }
    poly([iso(0, 0), iso(n, 0), iso(n, n), iso(0, n)], '#d39a66');
    for (var j = 0; j < n * 2; j++) line(iso(0, j / 2), iso(n, j / 2), L ? 'rgba(147,96,60,.55)' : 'rgba(147,96,60,.3)');
    if (L > 0) for (var k2 = 0; k2 < n; k2 += 1.5) for (var m = 0; m < n * 2; m++) { var p = iso(k2 + (m % 2) * .75, m / 2); R(p[0], p[1] - 1, 1, 2, 'rgba(147,96,60,.6)'); }
    if (L === 2) for (var g = 0; g < 40; g++) { var q = iso((g * 1.37) % n, (g * .71) % n); R(q[0], q[1], 2, 1, 'rgba(255,225,180,.25)'); }
    // a rug under the sofa
    if (L > 0) {
      var rx = 1.0, ry = 1.35, rw = 2.4, rd = 2.3;
      poly([iso(rx, ry), iso(rx + rw, ry), iso(rx + rw, ry + rd), iso(rx, ry + rd)], '#e9d6c0', L === 2 ? null : 'rgba(150,100,80,.4)');
      if (L === 2) { poly([iso(rx + .2, ry + .2), iso(rx + rw - .2, ry + .2), iso(rx + rw - .2, ry + rd - .2), iso(rx + .2, ry + rd - .2)], null, '#c9827f');
        var m2 = iso(rx + rw / 2, ry + rd / 2); poly([[m2[0], m2[1] - 6], [m2[0] + 12, m2[1]], [m2[0], m2[1] + 6], [m2[0] - 12, m2[1]]], null, '#c9827f');
        for (var t2 = .2; t2 < rw; t2 += .3) { var e = iso(rx + t2, ry + rd); R(e[0], e[1], 1, 2, '#fff1e2'); } }
    }
  }

  function sofa(x, y) { // back on the far side (low y), seat opens toward the front-left; 2.6 long, 1.2 deep
    shadow(x, y, 2.6, 1.2);
    var w = 2.6, d = 1.2;
    if (L === 0) {
      box(x, y, w, d, 10, FAB, 3);                 // base
      box(x, y, w, .35, 24, FAB, 3);               // back
      box(x, y, .3, d, 16, FAB, 3); box(x + w - .3, y, .3, d, 16, FAB, 3); // arms
      [[.1, .1], [w - .2, .1], [.1, d - .2], [w - .2, d - .2]].forEach(function (l) { box(x + l[0], y + l[1], .1, .1, 3, DARK, 0); });
      return;
    }
    [[.1, .1], [w - .2, .1], [.1, d - .2], [w - .2, d - .2]].forEach(function (l) { box(x + l[0], y + l[1], .1, .1, 4, DARK, 0, true); });
    texBox(x, y, w, d, 8, FAB, 4);
    texBox(x, y, w, .35, 24, FAB, 4);
    var bt1 = up(iso(x, y + .17), 28), bt2 = up(iso(x + w, y + .17), 28); line(bt1, bt2, FAB[0], 2);
    if (L === 2) line([bt1[0], bt1[1] - 1], [bt2[0], bt2[1] - 1], 'rgba(255,255,255,.4)');
    function arm(ax) {
      texBox(ax, y, .3, d, 14, FAB, 4);
      var r1 = up(iso(ax + .15, y), 18), r2 = up(iso(ax + .15, y + d), 18); line(r1, r2, FAB[0], 2);
      var fr = up(iso(ax + .15, y + d), 12); c.fillStyle = FAB[1]; c.beginPath(); c.ellipse(fr[0], fr[1], 3, 4, 0, 0, 7); c.fill(); c.strokeStyle = INK; c.stroke(); R(fr[0] - 1, fr[1] - 2, 1, 2, FAB[0]);
      if (L === 2) { c.strokeStyle = '#f6c3a0'; c.beginPath(); c.ellipse(fr[0], fr[1], 2, 3, 0, 0, 7); c.stroke(); }
    }
    arm(x);
    // two seat cushions and two back cushions
    [0, 1].forEach(function (k) {
      var cx = x + .32 + k * 1.0;
      texBox(cx, y + .36, .96, .22, 12, CUSH, 11, 'rgba(120,50,20,.1)');
      texBox(cx, y + .36, .96, .8, 5, CUSH, 11, 'rgba(120,50,20,.1)');
      var sc = up(iso(cx + .3, y + .9), 16); R(sc[0] - 3, sc[1], 6, 1, 'rgba(255,255,255,.45)');
      if (L === 2) { var p1 = up(iso(cx, y + 1.16), 13), p2 = up(iso(cx + .96, y + 1.16), 13); line(p1, p2, '#f9caa8'); [.3, .65].forEach(function (b) { var q = up(iso(cx + b, y + .47), 19); R(q[0], q[1], 1, 1, CUSH[2]); }); }
    });
    // throw pillows
    var pl = box(x + .4, y + .45, .5, .16, 10, ['#f3d38a', '#e7b75f', '#c78f3e'], 14);
    var pr = box(x + 1.8, y + .45, .5, .16, 10, ROSE, 14);
    if (L === 2) {
      var a = up(iso(x + .4, y + .61), 14); for (var s = 0; s < 4; s++) R(a[0] + 2 + s * 2, a[1] - 8 + s, 1, 8, '#fff1e2'); // striped pillow
      var hp = up(iso(x + 2.05, y + .61), 19); R(hp[0] - 4, hp[1], 2, 1, '#fff'); R(hp[0] - 1, hp[1], 2, 1, '#fff'); R(hp[0] - 4, hp[1] + 1, 5, 1, '#fff'); R(hp[0] - 3, hp[1] + 2, 3, 1, '#fff'); R(hp[0] - 2, hp[1] + 3, 1, 1, '#fff'); // heart
      var t1 = up(iso(x + .4, y + .45), 24), t2 = up(iso(x + .9, y + .45), 24); R(t1[0], t1[1], 1, 1, '#c78f3e'); R(t2[0], t2[1], 1, 1, '#c78f3e');
    }
    // knitted throw over the near arm
    box(x + w - .3, y + .1, .32, 1.0, 2, ['#fbe9e2', '#ecd2c8', '#d6b6ab'], 18);
    for (var i = .2; i < 1.1; i += .2) { var p = up(iso(x + w, y + i), 19); R(p[0], p[1], 1, 8, '#ecd2c8'); if (L === 2) R(p[0], p[1] + 8, 1, 2, '#fff1e2'); }
    if (L === 2) for (var k2 = .2; k2 < 1.1; k2 += .2) { var kk = up(iso(x + w - .15, y + k2), 20); R(kk[0], kk[1], 1, 1, '#d6b6ab'); }
    arm(x + w - .3);
    box(x + w - .3, y + .1, .32, 1.0, 2, ['#fbe9e2', '#ecd2c8', '#d6b6ab'], 18);
  }

  function sideTable(x, y) {
    shadow(x, y, .7, .7);
    if (L === 0) { box(x + .3, y + .3, .1, .1, 12, DARK); box(x, y, .7, .7, 2, WOOD, 12); box(x + .2, y + .2, .3, .3, 5, ['#fff3e6', '#f1dcc8', '#d9bfa6'], 14); return; }
    box(x + .3, y + .3, .12, .12, 12, DARK, 0, true); box(x + .12, y + .12, .46, .46, 1, DARK, 0);
    var b = box(x, y, .7, .7, 2, WOOD, 12);
    if (L === 2) { var f = faces(b); for (var g = 0; g < 4; g++) { var a = iso(x + .1, y + .15 + g * .15), z = iso(x + .6, y + .15 + g * .15); line(up(a, 14), up(z, 14), 'rgba(142,90,55,.35)'); } }
    box(x + .12, y + .15, .2, .2, 5, ['#fff3e6', '#f1dcc8', '#d9bfa6'], 14); var m = up(iso(x + .22, y + .25), 19); R(m[0] - 1, m[1], 3, 1, '#7d4c30');
    if (L === 2) { R(m[0] - 1, m[1] - 4, 1, 2, 'rgba(255,255,255,.6)'); R(m[0] + 1, m[1] - 6, 1, 2, 'rgba(255,255,255,.45)'); // steam
      box(x + .35, y + .3, .3, .25, 1, ['#9cc1b6', '#7fa7a0', '#5d8580'], 14); box(x + .36, y + .32, .28, .22, 1, ['#f3d38a', '#e7b75f', '#c78f3e'], 15); } // books
  }

  function floorLamp(x, y, t) {
    var base = iso(x + .2, y + .2);
    if (L > 0) { var a = .2 + .03 * Math.sin(t / 3); var g = c.createRadialGradient(base[0], base[1] - 46, 2, base[0], base[1] - 36, 50); g.addColorStop(0, 'rgba(255,214,140,' + (a + .15) + ')'); g.addColorStop(1, 'rgba(255,214,140,0)'); c.fillStyle = g; c.fillRect(base[0] - 50, base[1] - 96, 100, 110); }
    eShadow(base[0] + 2, base[1] + 1, 5);
    box(x + .05, y + .05, .3, .3, 2, DARK, 0, L === 0);
    R(base[0] - 1, base[1] - 44, 2, 42, DARK[2]); if (L === 2) R(base[0] - 1, base[1] - 44, 1, 42, DARK[0]);
    var top = base[1] - 54, sw = L === 0 ? 0 : 1;
    c.fillStyle = '#f6c86e'; c.beginPath(); c.moveTo(base[0] - 6, top); c.lineTo(base[0] + 6, top); c.lineTo(base[0] + 10, top + 12); c.lineTo(base[0] - 10, top + 12); c.closePath(); c.fill();
    c.fillStyle = '#fde3a3'; c.beginPath(); c.moveTo(base[0] - 6, top); c.lineTo(base[0], top); c.lineTo(base[0] - 2, top + 12); c.lineTo(base[0] - 10, top + 12); c.closePath(); c.fill();
    c.fillStyle = '#d9a04e'; c.beginPath(); c.moveTo(base[0] + 3, top); c.lineTo(base[0] + 6, top); c.lineTo(base[0] + 10, top + 12); c.lineTo(base[0] + 5, top + 12); c.closePath(); c.fill();
    if (sw) { c.strokeStyle = INK; c.beginPath(); c.moveTo(base[0] - 6, top); c.lineTo(base[0] + 6, top); c.lineTo(base[0] + 10, top + 12); c.lineTo(base[0] - 10, top + 12); c.closePath(); c.stroke(); }
    if (L === 2) { R(base[0] - 9, top + 10, 19, 1, '#c78f3e'); for (var k = -8; k < 10; k += 3) R(base[0] + k, top + 12, 1, 2, '#c78f3e'); R(base[0] + 3, top + 12, 1, 6, '#8e5a37'); R(base[0] + 2, top + 18, 3, 2, '#f3d38a'); } // fringe and pull chain
    if (L > 0) R(base[0] - 4, top + 12, 8, 1, '#fff6d8');
  }

  function plant(x, y, t) {
    var b = iso(x + .3, y + .3); eShadow(b[0] + 2, b[1] + 1, 7);
    if (L === 0) {
      box(x, y, .6, .6, 9, ['#e8a28c', '#d98a6f', '#b5624f']);
      c.fillStyle = '#79a964'; c.beginPath(); c.ellipse(b[0], b[1] - 22, 11, 11, 0, 0, 7); c.fill();
      c.fillStyle = '#9fcf86'; c.beginPath(); c.ellipse(b[0] - 3, b[1] - 25, 6, 6, 0, 0, 7); c.fill();
      return;
    }
    var pot = box(x, y, .6, .6, 9, ['#e8a28c', '#d98a6f', '#b5624f']);
    if (L === 2) { var p1 = up(iso(x, y + .6), 5), p2 = up(iso(x + .6, y + .6), 5), p3 = up(iso(x + .6, y), 5); line(p1, p2, '#fff1e2'); line(p2, p3, '#f3d2c4'); var s = up(iso(x + .3, y + .3), 9); R(s[0] - 4, s[1] - 1, 8, 2, '#6f5038'); }
    var sw = Math.sin(t / 4) * 1.2;
    var leaves = [[-8, -18, -1], [6, -20, 1], [-2, -26, 0], [9, -12, 1], [-10, -10, -1], [1, -16, 0]];
    if (L === 2) leaves = leaves.concat([[-5, -31, -1], [5, -29, 1], [12, -22, 1], [-13, -20, -1]]);
    leaves.forEach(function (Lf, i) {
      var lx = b[0] + Lf[0] + (i % 2 ? sw : 0), ly = b[1] + Lf[1];
      line([b[0], b[1] - 9], [lx, ly + 3], '#5f8f4e');
      c.fillStyle = '#5f8f4e'; c.beginPath(); c.ellipse(lx, ly + 1, 5, 3, Lf[2] * .6, 0, 7); c.fill();
      c.fillStyle = '#79a964'; c.beginPath(); c.ellipse(lx - 1, ly, 4, 2.2, Lf[2] * .6, 0, 7); c.fill();
      R(lx - 2, ly - 1, 2, 1, '#b9e0a2');
      if (L === 2) R(lx - 1 + Lf[2], ly + 1, 2, 1, '#5f8f4e'); // a vein
    });
  }

  window.drawDetail = function (ctx, level, t) {
    c = ctx; L = level; t = t || 0;
    c.fillStyle = '#2a1b24'; c.fillRect(0, 0, 132, 122);
    c.save(); c.translate(0, 18);
    floor();
    floorLamp(.2, .25, t);
    sofa(.8, .25);
    sideTable(3.4, .4);
    plant(.25, 2.9, t);
    c.restore();
  };
})();
