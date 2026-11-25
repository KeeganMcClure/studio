// Sarah's Sim: furniture sample sheet v1 (Nov 25, 2026), at the locked Rich detail level. All art drawn in code.
// drawSheet(ctx, t, propsOff): ten cells, one piece per catalog tab (seating, tables, beds, storage, lights, plants,
// rugs, wall, decor, holiday). Each cell is 96 x 88 game pixels on a 3 x 3 tile floor patch. Light from the upper left.
// Rich = outlines, 3-4 tones, fabric weave (shade-only, so any color works), wood grain, piping, patterns, props.
// Motion (some pieces): lamp glow flicker, plant sway, mug steam, tree lights.
(function () {
  var c, TW = 22, TH = 11, OX = 48, OY = 30, PROPS = true;
  var INK = 'rgba(59,36,48,.85)';
  function iso(x, y) { return [OX + (x - y) * TW / 2, OY + (x + y) * TH / 2]; }
  function up(p, h) { return [p[0], p[1] - h]; }
  function poly(pts, fill, stroke) { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (var i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); if (fill) { c.fillStyle = fill; c.fill(); } if (stroke) { c.strokeStyle = stroke; c.lineWidth = 1; c.stroke(); } }
  function R(x, y, w, h, col) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
  function line(a, b, col, w) { c.strokeStyle = col; c.lineWidth = w || 1; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); c.lineWidth = 1; }
  function clipTo(pts, fn) { c.save(); c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (var i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); c.clip(); fn(); c.restore(); }
  function weave(pts, col) {
    clipTo(pts, function () {
      var xs = pts.map(function (p) { return p[0]; }), ys = pts.map(function (p) { return p[1]; });
      for (var x = Math.floor(Math.min.apply(0, xs)); x < Math.max.apply(0, xs); x += 2) for (var y = Math.floor(Math.min.apply(0, ys)); y < Math.max.apply(0, ys); y += 2) if (((x >> 1) + (y >> 1)) % 2 === 0) R(x, y, 1, 1, col || 'rgba(0,0,0,.08)');
    });
  }
  // box: tile x,y, size w,d, height h, lifted z. cols = [top, left-front (+y face), right-front (+x face)]. kind: 'fab' | 'wood' | null
  function box(x, y, w, d, h, cols, z, kind, noLine) {
    z = z || 0;
    var A = up(iso(x, y), z), B = up(iso(x + w, y), z), C = up(iso(x + w, y + d), z), D = up(iso(x, y + d), z);
    var F = { top: [up(A, h), up(B, h), up(C, h), up(D, h)], left: [D, C, up(C, h), up(D, h)], right: [B, C, up(C, h), up(B, h)] };
    poly(F.left, cols[1]); poly(F.right, cols[2]); poly(F.top, cols[0]);
    if (kind === 'fab') { weave(F.top); weave(F.left); weave(F.right); }
    if (kind === 'wood') { // grain: soft lines along the long side of each face
      clipTo(F.top, function () { for (var k = .12; k < (w > d ? d : w); k += .16) { if (w > d) line(up(iso(x, y + k), z + h), up(iso(x + w, y + k), z + h), 'rgba(110,60,30,.22)'); else line(up(iso(x + k, y), z + h), up(iso(x + k, y + d), z + h), 'rgba(110,60,30,.22)'); } });
      clipTo(F.left, function () { for (var k2 = 3; k2 < h; k2 += 4) line(up(D, k2), up(C, k2 - 1), 'rgba(110,60,30,.18)'); });
    }
    if (!noLine) { poly([up(A, h), up(B, h), B, C, D, up(D, h)], null, INK); line([up(D, h)[0], up(D, h)[1] + .5], [up(C, h)[0], up(C, h)[1] + .5], 'rgba(255,255,255,.4)'); }
    return F;
  }
  function shadow(x, y, w, d) { poly([iso(x + .1, y + .1), iso(x + w + .25, y + .1), iso(x + w + .25, y + d + .25), iso(x + .1, y + d + .25)], 'rgba(90,45,40,.22)'); }
  function eShadow(px, py, rx) { c.fillStyle = 'rgba(90,45,40,.28)'; c.beginPath(); c.ellipse(px, py, rx, rx / 2, 0, 0, 7); c.fill(); }
  function steam(p, t) { var k = t % 4; R(p[0] - 1, p[1] - 3 - k, 1, 2, 'rgba(255,255,255,.6)'); R(p[0] + 1, p[1] - 6 - ((k + 2) % 4), 1, 2, 'rgba(255,255,255,.45)'); }
  function mug(x, y, z, col, t) { box(x, y, .2, .2, 5, col, z); var m = up(iso(x + .1, y + .1), z + 5); R(m[0] - 1, m[1], 3, 1, '#7d4c30'); var hnd = up(iso(x + .2, y + .12), z + 3); R(hnd[0], hnd[1] - 1, 2, 1, col[2]); R(hnd[0] + 1, hnd[1], 1, 2, col[2]); if (t !== undefined) steam(m, t); }
  function book(x, y, z, w, d, col) { box(x, y, w, d, 2, [col[0], '#fff6ea', col[2]], z); }

  var WOOD = ['#dca474', '#b9804f', '#8e5a37'], DARK = ['#9b6a48', '#7a4e33', '#5a3622'], OAK = ['#e8c08e', '#cf9d68', '#a8774a'];
  var SAGE = ['#b5d4ca', '#8fb3a9', '#5d8580'], SAGEC = ['#cfe3dc', '#a9c9bf', '#7aa198'], ROSE = ['#f39bb0', '#e46f8b', '#b44f63'];
  var CREAM = ['#fff3e6', '#f1dcc8', '#d9bfa6'], MUST = ['#f3d38a', '#e7b75f', '#c78f3e'], BLUSH = ['#fbe9e2', '#ecd2c8', '#d6b6ab'];

  function floorPatch(n, wall) {
    if (wall) { poly([iso(0, 0), up(iso(0, 0), 56), up(iso(n, 0), 56), iso(n, 0)], '#f3d2c4'); poly([iso(0, 0), up(iso(0, 0), 56), up(iso(0, n), 56), iso(0, n)], '#ecc1b2'); line(up(iso(0, n), 14), up(iso(0, 0), 14), '#fff1e2', 2); line(up(iso(0, 0), 14), up(iso(n, 0), 14), '#fff1e2', 2); line(iso(0, 0), up(iso(0, 0), 56), 'rgba(160,90,80,.25)'); }
    poly([iso(0, 0), iso(n, 0), iso(n, n), iso(0, n)], '#d39a66');
    for (var j = 1; j < n * 2; j++) line(iso(0, j / 2), iso(n, j / 2), 'rgba(147,96,60,.45)');
    for (var g = 0; g < 14; g++) { var q = iso((g * 1.37) % n, (g * .71) % n); R(q[0], q[1], 2, 1, 'rgba(255,225,180,.25)'); }
    var e1 = iso(0, n), e2 = iso(n, n), e3 = iso(n, 0); poly([e1, e2, up(e2, -3), up(e1, -3)], '#a8774a'); poly([e2, e3, up(e3, -3), up(e2, -3)], '#8e5a37');
  }

  // ---------- pieces ----------
  function armchair(x, y) { // seating: a plump sage armchair; back against the far wall, seat opens toward the front-left
    var w = 1.6, d = 1.2, aw = .26, AH = 18, CU = ['#f6ead0', '#e6d3b0', '#c4ab84'];
    shadow(x, y, w, d);
    [[.1, .1], [w - .2, .1], [.1, d - .2], [w - .2, d - .2]].forEach(function (l) { box(x + l[0], y + l[1], .1, .1, 4, DARK, 0, null, true); }); // short wood legs
    box(x, y, w, d, 8, SAGE, 4, 'fab');                       // seat base
    box(x, y, w, .32, 24, SAGE, 4, 'fab');                    // back
    var b1 = up(iso(x + .03, y + .16), 29), b2 = up(iso(x + w - .03, y + .16), 29); line(b1, b2, SAGE[0], 3); line([b1[0], b1[1] - 1], [b2[0], b2[1] - 1], '#e0efe9');
    function arm(ax) {
      box(ax, y + .02, aw, d - .02, AH, SAGE, 4, 'fab');
      var r1 = up(iso(ax + aw / 2, y + .04), AH + 5), r2 = up(iso(ax + aw / 2, y + d), AH + 5); line(r1, r2, SAGE[0], 3); line([r1[0], r1[1] - 1], [r2[0], r2[1] - 1], '#e0efe9'); // rolled top
      // the scroll at the front of the arm, up at the top where the roll ends
      var fr = up(iso(ax + aw / 2, y + d), AH + 1);
      c.fillStyle = SAGE[1]; c.beginPath(); c.ellipse(fr[0], fr[1], 3, 3.5, 0, 0, 7); c.fill(); c.strokeStyle = INK; c.stroke();
      c.strokeStyle = '#e0efe9'; c.beginPath(); c.ellipse(fr[0], fr[1], 1.6, 2, 0, 0, 7); c.stroke();
    }
    arm(x);
    box(x + aw, y + .32, w - 2 * aw, .22, 12, CU, 12, 'fab');      // back cushion
    box(x + aw, y + .32, w - 2 * aw, d - .32, 5, CU, 12, 'fab');   // seat cushion, below the arm tops
    line(up(iso(x + aw, y + d), 14), up(iso(x + w - aw, y + d), 14), '#fffaf0');
    [.3, .62].forEach(function (b) { var q = up(iso(x + aw + b * (w - 2 * aw) + .1, y + .43), 22); R(q[0], q[1], 1, 1, CU[2]); }); // tufting buttons
    // solid front panel between the arms, under the cushion
    var p1 = up(iso(x + aw, y + d), 4), p2 = up(iso(x + w - aw, y + d), 4);
    poly([p1, p2, up(p2, 8), up(p1, 8)], SAGE[1], INK); weave([p1, p2, up(p2, 8), up(p1, 8)]);
    line([p1[0], p1[1] - 1], [p2[0], p2[1] - 1], '#e0efe9'); // piping along the bottom
    if (PROPS) { box(x + .45, y + .52, .42, .14, 9, ROSE, 17, 'fab'); var a = up(iso(x + .45, y + .66), 17); for (var s2 = 0; s2 < 3; s2++) R(a[0] + 2 + s2 * 2, a[1] - 8 + s2, 1, 8, '#fff1e2'); }
    arm(x + w - aw);
  }
  function coffeeTable(x, y, t) { // tables: oak table with a lower shelf
    shadow(x, y, 1.6, 1.1);
    [[.05, .05], [1.45, .05], [.05, .95], [1.45, .95]].forEach(function (l) { box(x + l[0], y + l[1], .1, .1, 13, DARK, 0, null, true); });
    box(x + .05, y + .05, 1.5, 1.0, 1, OAK, 3, 'wood');
    box(x, y, 1.6, 1.1, 3, OAK, 13, 'wood');
    if (PROPS) {
      book(x + .15, y + .15, 3, .4, .3, ['#9cc1b6', 0, '#5d8580']); book(x + .17, y + .17, 5, .36, .26, ['#f39bb0', 0, '#b44f63']); // books on the shelf
      mug(x + 1.15, y + .2, 16, CREAM, t); mug(x + 1.25, y + .75, 16, ROSE);
      book(x + .3, y + .6, 16, .5, .36, ['#f3d38a', 0, '#c78f3e']); book(x + .34, y + .63, 18, .42, .3, ['#9cc1b6', 0, '#5d8580']);
      var cd = up(iso(x + .45, y + .15), 16); R(cd[0] - 1, cd[1] - 5, 3, 5, '#fff1e2'); R(cd[0], cd[1] - 7 - (t % 2), 1, 2, '#ffd56b'); // candle
    }
  }
  function bed(x, y) { // beds: double bed, headboard on the far side, quilt with a patchwork pattern
    shadow(x, y, 1.9, 2.4);
    box(x, y, 1.9, .2, 26, WOOD, 0, 'wood');                  // headboard
    var hb = up(iso(x + .95, y + .2), 26); R(hb[0] - 1, hb[1] + 3, 2, 2, '#f3d38a');
    box(x, y + .2, 1.9, 2.2, 8, DARK, 0, 'wood');             // frame
    box(x + .05, y + .2, 1.8, 2.1, 5, CREAM, 8, 'fab');       // mattress
    var Q = box(x + .02, y + .75, 1.86, 1.6, 2, ROSE, 13, 'fab'); // quilt
    clipTo(Q.top, function () { for (var i = 0; i < 6; i++) for (var j = 0; j < 5; j++) if ((i + j) % 2 === 0) poly([up(iso(x + .02 + i * .31, y + .75 + j * .32), 15), up(iso(x + .02 + (i + 1) * .31, y + .75 + j * .32), 15), up(iso(x + .02 + (i + 1) * .31, y + .75 + (j + 1) * .32), 15), up(iso(x + .02 + i * .31, y + .75 + (j + 1) * .32), 15)], 'rgba(255,240,230,.45)'); });
    line(up(iso(x + .02, y + 2.35), 12), up(iso(x + 1.88, y + 2.35), 12), '#fff1e2'); for (var k = .1; k < 1.9; k += .2) { var e = up(iso(x + k, y + 2.35), 11); R(e[0], e[1], 1, 1, '#fff1e2'); }
    box(x + .2, y + .3, .7, .38, 4, ['#ffffff', '#f1ece6', '#d9d0c4'], 13, 'fab'); box(x + 1.0, y + .3, .7, .38, 4, ['#ffffff', '#f1ece6', '#d9d0c4'], 13, 'fab'); // pillows
    if (PROPS) { box(x + .1, y + 1.85, 1.7, .4, 3, MUST, 15, 'fab'); line(up(iso(x + .1, y + 2.05), 18), up(iso(x + 1.8, y + 2.05), 18), '#fbe7b5'); } // folded throw
  }
  function bookshelf(x, y) { // storage: tall shelf against the back, open toward the front-left
    shadow(x, y, 1.6, .5);
    var F = box(x, y, 1.6, .5, 48, WOOD, 0, 'wood');
    // shelves seen on the front face
    var D = iso(x, y + .5), C = iso(x + 1.6, y + .5);
    clipTo(F.left, function () {
      poly([up(D, 45), up(C, 45), up(C, 3), up(D, 3)], '#6e4429');
      var cols = ['#e46f8b', '#7fa7a0', '#f3d38a', '#a9c9e8', '#e99a70', '#fff1e2', '#b5d4ca', '#c9827f'];
      [5, 19, 33].forEach(function (z, r) {
        line(up(D, z), up(C, z), WOOD[0], 2);
        if (!PROPS) return;
        var u = 0; for (var b = 0; b < 9; b++) { var bw = .1 + ((b * 7 + r) % 3) * .03, bh = 8 + ((b * 5 + r * 3) % 4); if (r === 1 && b > 5) break; var p = iso(x + .08 + u, y + .5); R(p[0], p[1] - z - bh - u * 0, Math.max(2, bw * 11), bh, cols[(b + r * 3) % 8]); R(p[0], p[1] - z - bh, 1, bh, 'rgba(255,255,255,.3)'); u += bw + .02; }
      });
      if (PROPS) { var pp = up(iso(x + 1.25, y + .5), 20); c.fillStyle = '#d98a6f'; R(pp[0] - 3, pp[1] - 5, 6, 5, '#d98a6f'); c.fillStyle = '#79a964'; for (var v = 0; v < 4; v++) R(pp[0] - 4 + v * 2, pp[1] - 8 + (v % 2) * 2, 2, 4, '#79a964'); R(pp[0] + 2, pp[1] - 2, 1, 6, '#5f8f4e'); }
    });
    line(up(D, 48), up(C, 48), WOOD[0]);
  }
  function floorLamp(x, y, t) { // lights: fringe shade, pull chain, warm flickering glow
    var base = iso(x + .2, y + .2), a = .22 + .04 * Math.sin(t * 1.7);
    var g = c.createRadialGradient(base[0], base[1] - 46, 2, base[0], base[1] - 36, 42); g.addColorStop(0, 'rgba(255,214,140,' + (a + .15) + ')'); g.addColorStop(1, 'rgba(255,214,140,0)'); c.fillStyle = g; c.fillRect(base[0] - 44, base[1] - 90, 88, 100);
    eShadow(base[0] + 2, base[1] + 1, 5);
    box(x + .05, y + .05, .3, .3, 2, DARK);
    R(base[0] - 1, base[1] - 44, 2, 42, DARK[2]); R(base[0] - 1, base[1] - 44, 1, 42, DARK[0]);
    var top = base[1] - 54;
    c.fillStyle = '#f6c86e'; c.beginPath(); c.moveTo(base[0] - 6, top); c.lineTo(base[0] + 6, top); c.lineTo(base[0] + 10, top + 12); c.lineTo(base[0] - 10, top + 12); c.closePath(); c.fill();
    c.fillStyle = '#fde3a3'; c.beginPath(); c.moveTo(base[0] - 6, top); c.lineTo(base[0], top); c.lineTo(base[0] - 2, top + 12); c.lineTo(base[0] - 10, top + 12); c.closePath(); c.fill();
    c.fillStyle = '#d9a04e'; c.beginPath(); c.moveTo(base[0] + 3, top); c.lineTo(base[0] + 6, top); c.lineTo(base[0] + 10, top + 12); c.lineTo(base[0] + 5, top + 12); c.closePath(); c.fill();
    c.strokeStyle = INK; c.beginPath(); c.moveTo(base[0] - 6, top); c.lineTo(base[0] + 6, top); c.lineTo(base[0] + 10, top + 12); c.lineTo(base[0] - 10, top + 12); c.closePath(); c.stroke();
    R(base[0] - 9, top + 10, 19, 1, '#c78f3e'); for (var k = -8; k < 10; k += 3) R(base[0] + k, top + 12, 1, 2, '#c78f3e'); R(base[0] + 3, top + 12, 1, 6, '#8e5a37'); R(base[0] + 2, top + 18, 3, 2, '#f3d38a');
    R(base[0] - 4, top + 12, 8, 1, '#fff6d8');
  }
  function monstera(x, y, t) { // plants: big leaves in a woven basket, gentle sway
    var b = iso(x + .35, y + .35); eShadow(b[0] + 2, b[1] + 1, 9);
    var P = box(x, y, .7, .7, 11, ['#e8c08e', '#cf9d68', '#a8774a']);
    clipTo(P.left, function () { for (var k = 0; k < 11; k += 3) line(up(iso(x, y + .7), k), up(iso(x + .7, y + .7), k), 'rgba(110,60,30,.35)'); });
    clipTo(P.right, function () { for (var k = 0; k < 11; k += 3) line(up(iso(x + .7, y), k), up(iso(x + .7, y + .7), k), 'rgba(110,60,30,.35)'); });
    var sw = Math.sin(t / 3) * 1.3, base = [b[0], b[1] - 11];
    [[-12, -22, -1], [10, -26, 1], [-2, -36, 0], [13, -14, 1], [-14, -12, -1], [3, -20, 0], [-7, -30, -1], [7, -34, 1]].forEach(function (L, i) {
      var lx = b[0] + L[0] + (i % 2 ? sw : -sw * .5), ly = b[1] + L[1];
      line(base, [lx, ly + 3], '#4e7a40');
      c.fillStyle = '#4e7a40'; c.beginPath(); c.ellipse(lx, ly + 1, 7, 4, L[2] * .5, 0, 7); c.fill();
      c.fillStyle = '#6f9d58'; c.beginPath(); c.ellipse(lx - 1, ly, 6, 3.2, L[2] * .5, 0, 7); c.fill();
      R(lx - 3, ly - 1, 3, 1, '#a9d38f');
      R(lx + 1, ly - 1, 1, 3, '#4e7a40'); R(lx - 2 + L[2] * 2, ly + 1, 1, 2, '#4e7a40'); // monstera splits
    });
  }
  function rug(x, y) { // rugs: wool rug with a border, center motif and fringe
    var w = 2.2, d = 1.6;
    poly([iso(x, y), iso(x + w, y), iso(x + w, y + d), iso(x, y + d)], '#e9d6c0');
    weave([iso(x, y), iso(x + w, y), iso(x + w, y + d), iso(x, y + d)], 'rgba(150,100,80,.12)');
    poly([iso(x + .15, y + .15), iso(x + w - .15, y + .15), iso(x + w - .15, y + d - .15), iso(x + .15, y + d - .15)], null, '#c9827f');
    poly([iso(x + .25, y + .25), iso(x + w - .25, y + .25), iso(x + w - .25, y + d - .25), iso(x + .25, y + d - .25)], null, '#7fa7a0');
    var m = iso(x + w / 2, y + d / 2); poly([[m[0], m[1] - 6], [m[0] + 12, m[1]], [m[0], m[1] + 6], [m[0] - 12, m[1]]], '#f3c3b8', '#c9827f'); poly([[m[0], m[1] - 3], [m[0] + 6, m[1]], [m[0], m[1] + 3], [m[0] - 6, m[1]]], '#e46f8b');
    for (var k = .1; k < w; k += .2) { var e = iso(x + k, y + d); R(e[0], e[1], 1, 2, '#fff1e2'); }
    for (var k2 = .1; k2 < w; k2 += .2) { var e2 = iso(x + k2, y); R(e2[0], e2[1] - 2, 1, 2, '#fff1e2'); }
  }
  function wallArt(n) { // wall: a framed print and a floating shelf, on the back wall
    var a = up(iso(.6, 0), 40), b = up(iso(1.5, 0), 40), cc = up(iso(1.5, 0), 22), d = up(iso(.6, 0), 22);
    poly([a, b, cc, d], '#8e5a37', INK); var i1 = up(iso(.68, 0), 38), i2 = up(iso(1.42, 0), 38), i3 = up(iso(1.42, 0), 24), i4 = up(iso(.68, 0), 24);
    poly([i1, i2, i3, i4], '#fff6ea'); clipTo([i1, i2, i3, i4], function () { var s = up(iso(1.05, 0), 31); c.fillStyle = '#f3b07a'; c.beginPath(); c.arc(s[0], s[1], 3, 0, 7); c.fill(); poly([up(iso(.68, 0), 25), up(iso(.95, 0), 31), up(iso(1.15, 0), 27), up(iso(1.42, 0), 33), up(iso(1.42, 0), 24), up(iso(.68, 0), 24)], '#7fa7a0'); });
    // floating shelf
    box(1.9, 0, 1.0, .3, 2, OAK, 26, 'wood');
    if (PROPS) { box(2.0, .05, .18, .18, 7, ['#a9c9e8', '#8fb3d4', '#6f93b8'], 28); var f = up(iso(2.09, .14), 35); R(f[0] - 2, f[1] - 4, 2, 2, '#e46f8b'); R(f[0] + 1, f[1] - 5, 2, 2, '#f3d38a'); R(f[0], f[1] - 2, 1, 3, '#5f8f4e');
      book(2.35, .05, 28, .1, .2, ['#e46f8b', 0, '#b44f63']); box(2.47, .05, .1, .2, 9, ['#7fa7a0', '#fff6ea', '#5d8580'], 28); box(2.59, .05, .1, .2, 8, ['#f3d38a', '#fff6ea', '#c78f3e'], 28);
      box(2.75, .08, .12, .12, 4, CREAM, 28); }
  }
  function recordCabinet(x, y, t) { // decor: record player on a low cabinet with records below
    shadow(x, y, 1.3, .7);
    [[.05, .05], [1.15, .05], [.05, .55], [1.15, .55]].forEach(function (l) { box(x + l[0], y + l[1], .1, .1, 4, DARK, 0, null, true); });
    var F = box(x, y, 1.3, .7, 14, WOOD, 4, 'wood');
    var D = up(iso(x, y + .7), 4), C = up(iso(x + 1.3, y + .7), 4);
    clipTo(F.left, function () { poly([up(D, 2), up(C, 2), up(C, 12), up(D, 12)], '#6e4429'); for (var k = 0; k < 9; k++) { var p = up(iso(x + .1 + k * .13, y + .7), 6); R(p[0], p[1] - 6, 2, 9, ['#2f2430', '#e46f8b', '#f3d38a', '#7fa7a0'][k % 4]); } });
    var P = box(x + .25, y + .1, .8, .5, 3, ['#f6ead0', '#e6d3b0', '#c4ab84'], 18);
    var ctr = up(iso(x + .6, y + .35), 21); c.fillStyle = '#2f2430'; c.beginPath(); c.ellipse(ctr[0], ctr[1], 7, 3.5, 0, 0, 7); c.fill(); R(ctr[0] - 1, ctr[1], 2, 1, '#e46f8b');
    var an = (t % 8) * .8; R(ctr[0] + Math.cos(an) * 5, ctr[1] + Math.sin(an) * 2, 1, 1, '#6b5560'); // spinning
    line(up(iso(x + .95, y + .15), 22), [ctr[0] + 3, ctr[1] - 1], '#d9d0c4');
    if (PROPS) { var n1 = up(iso(x + 1.15, y + .2), 24), k1 = t % 6; c.font = '6px sans-serif'; c.fillStyle = 'rgba(255,241,226,.85)'; c.fillText('♪', n1[0], n1[1] - k1); }
  }
  function xmasTree(x, y, t) { // holiday: small tree in a basket with lights
    var b = iso(x + .4, y + .4); eShadow(b[0] + 3, b[1] + 2, 12);
    box(x + .05, y + .05, .7, .7, 7, ['#d98a6f', '#c0674f', '#94493a']);
    var cx = b[0], base = b[1] - 7;
    [[0, 17, 15], [10, 14, 14], [20, 10, 12], [28, 6, 10]].forEach(function (tr) {
      var yb = base - tr[0], hw = tr[1], hh = tr[2];
      c.fillStyle = '#3f6e4a'; c.beginPath(); c.moveTo(cx, yb - hh); c.lineTo(cx + hw, yb); c.lineTo(cx - hw, yb); c.closePath(); c.fill();
      c.fillStyle = '#5a8c5c'; c.beginPath(); c.moveTo(cx, yb - hh); c.lineTo(cx + hw * .15, yb); c.lineTo(cx - hw, yb); c.closePath(); c.fill();
      for (var s = -hw + 3; s < hw; s += 5) R(cx + s, yb - 1, 2, 1, '#8fbf86');
      c.strokeStyle = INK; c.beginPath(); c.moveTo(cx, yb - hh); c.lineTo(cx + hw, yb); c.lineTo(cx - hw, yb); c.closePath(); c.stroke();
    });
    var lights = [[-10, -3], [-2, -2], [7, -5], [12, -2], [-7, -13], [3, -12], [9, -15], [-4, -22], [5, -23], [0, -30]], cols = ['#ffd56b', '#e46f8b', '#8fd0ff', '#fff3a8'];
    lights.forEach(function (L, i) { var on = (Math.floor(t / 2) + i) % 4 !== 0; if (on) { c.fillStyle = 'rgba(255,230,160,.35)'; c.beginPath(); c.arc(cx + L[0] + 1, base + L[1] + 1, 2.5, 0, 7); c.fill(); } R(cx + L[0], base + L[1], 2, 2, on ? cols[i % 4] : '#5a5060'); });
    var sy = base - 40; c.fillStyle = '#ffd56b'; c.beginPath(); for (var p = 0; p < 10; p++) { var r = p % 2 ? 1.5 : 4, a = -Math.PI / 2 + p * Math.PI / 5; c.lineTo(cx + Math.cos(a) * r, sy + Math.sin(a) * r); } c.closePath(); c.fill();
    if (PROPS) { box(x + .85, y + .6, .4, .4, 6, ROSE); var g = up(iso(x + 1.05, y + .6), 0); R(g[0] - 1, g[1] - 8, 2, 8, '#fff1e2'); box(x - .05, y + .9, .45, .35, 5, SAGE); }
  }

  var CELLS = [
    ['SEATING', function (t) { floorPatch(2, true); armchair(.2, .35); }],
    ['TABLES', function (t) { floorPatch(2, false); coffeeTable(.3, .55, t); }],
    ['BEDS', function (t) { OY = 22; floorPatch(3, true); bed(.55, .15); }],
    ['STORAGE', function (t) { floorPatch(2, true); bookshelf(.2, .05); }],
    ['LIGHTS', function (t) { OY = 46; floorPatch(2, true); floorLamp(.8, .8, t); }],
    ['PLANTS', function (t) { OY = 40; floorPatch(2, false); monstera(.65, .65, t); }],
    ['RUGS', function (t) { OY = 30; floorPatch(3, false); rug(.4, .7); }],
    ['WALL', function (t) { OY = 38; floorPatch(3, true); wallArt(3); }],
    ['DECOR', function (t) { OY = 34; floorPatch(2, true); recordCabinet(.35, .3, t); }],
    ['HOLIDAY', function (t) { OY = 42; floorPatch(2, false); xmasTree(.6, .6, t); }]
  ];
  window.SHEET_CELLS = CELLS.map(function (k) { return k[0]; });
  // draws one cell into a 104 x 100 canvas
  window.drawCell = function (ctx, i, t, propsOff) {
    c = ctx; PROPS = !propsOff; t = t || 0;
    c.fillStyle = '#2a1b24'; c.fillRect(0, 0, 104, 100);
    OX = 52; OY = 32; var n = CELLS[i][0];
    // center 2- and 3-tile patches
    c.save(); if (n === 'BEDS' || n === 'RUGS' || n === 'WALL') { c.translate(0, 14); } else { c.translate(0, 22); }
    CELLS[i][1](t);
    c.restore();
  };
})();
