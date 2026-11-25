// Sarah's Sim: Build screen mockup v1 (Nov 25, 2026). All art drawn in code. Isometric 2:1, light from the upper left.
// drawBuild(ctx, W, H, t, state): 'room' (zoomed out on a small lot, dragging out a new room),
// 'door' (zoomed in, walls cut away, a door snapping onto a wall), 'floors' (upstairs, with stairs and the floor picker).
(function () {
  var c, TW = 22, TH = 11, OX = 120, OY = 60;
  var INK = 'rgba(59,36,48,.85)';
  var P = { tray: '#fff6ea', trayEdge: '#e8cdb4', ink: '#6b4250', soft: '#b38a8f', rose: '#e46f8b', roseHi: '#f39bb0', roseSh: '#b44f63',
    grass: ['#9fcf86', '#8bbd73', '#79a964'], wall: ['#f3d2c4', '#ecc1b2', '#dcab9c'], wall2: ['#c8dcd4', '#b5cdc4', '#98b5aa'], floor: ['#d39a66', '#c88d5a', '#bb8150'], plank: '#93603c', tile: ['#f1e6d8', '#e3d3bf'] };
  function iso(x, y) { return [OX + (x - y) * TW / 2, OY + (x + y) * TH / 2]; }
  function up(p, h) { return [p[0], p[1] - h]; }
  function poly(pts, fill, stroke) { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (var i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); if (fill) { c.fillStyle = fill; c.fill(); } if (stroke) { c.strokeStyle = stroke; c.lineWidth = 1; c.stroke(); } }
  function R(x, y, w, h, col) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
  function txt(s, x, y, col, size, align) { c.font = (size || 8) + 'px "Press Start 2P", monospace'; c.fillStyle = col; c.textAlign = align || 'left'; c.textBaseline = 'top'; c.fillText(s, x, y); }
  function box(x, y, w, d, h, cols, z) {
    z = z || 0; var A = up(iso(x, y), z), B = up(iso(x + w, y), z), C = up(iso(x + w, y + d), z), D = up(iso(x, y + d), z);
    poly([D, C, up(C, h), up(D, h)], cols[1]); poly([B, C, up(C, h), up(B, h)], cols[2]); poly([up(A, h), up(B, h), up(C, h), up(D, h)], cols[0]);
    poly([up(A, h), up(B, h), B, C, D, up(D, h)], null, INK);
  }
  function tiles(x0, y0, w, d, cols, line) {
    for (var i = 0; i < w; i++) for (var j = 0; j < d; j++) poly([iso(x0 + i, y0 + j), iso(x0 + i + 1, y0 + j), iso(x0 + i + 1, y0 + j + 1), iso(x0 + i, y0 + j + 1)], cols[(i + j) % 2], line);
  }
  function planks(x0, y0, w, d) {
    poly([iso(x0, y0), iso(x0 + w, y0), iso(x0 + w, y0 + d), iso(x0, y0 + d)], P.floor[0]);
    for (var j = 0; j < d * 2; j++) { var a = iso(x0, y0 + j / 2), b = iso(x0 + w, y0 + j / 2); c.strokeStyle = 'rgba(147,96,60,.55)'; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); }
    for (var k = 0; k < w; k += 1.5) for (var m = 0; m < d * 2; m++) { var p = iso(x0 + k + (m % 2) * .75, y0 + m / 2); R(p[0], p[1] - 1, 1, 2, 'rgba(147,96,60,.6)'); }
  }
  function grassLot(n) {
    poly([iso(0, 0), iso(n, 0), iso(n, n), iso(0, n)], P.grass[0]);
    for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) if ((i * 7 + j * 3) % 5 === 0) { var p = iso(i + .5, j + .5); R(p[0], p[1], 2, 1, P.grass[2]); R(p[0] + 1, p[1] - 1, 1, 1, '#b9e0a2'); }
    // lot edge soil, so it reads as a lot
    var e1 = iso(0, n), e2 = iso(n, n), e3 = iso(n, 0); poly([e1, e2, [e2[0], e2[1] + 4], [e1[0], e1[1] + 4]], '#8e6a4a'); poly([e2, e3, [e3[0], e3[1] + 4], [e2[0], e2[1] + 4]], '#6f5038');
    poly([iso(0, 0), iso(n, 0), iso(n, n), iso(0, n)], null, 'rgba(255,255,255,.35)');
  }
  // a wall along x (y fixed) or along y (x fixed), from a to b, height h, thickness .14
  function wallX(y, a, b, h, cols) { box(a, y - .07, b - a, .14, h, cols); }
  function wallY(x, a, b, h, cols) { box(x - .07, a, .14, b - a, h, cols); }
  function door(x, y, along, ghost, h) { // door frame on a wall at tile x,y
    var a = along === 'x' ? iso(x, y) : iso(x, y), b = along === 'x' ? iso(x + 1, y) : iso(x, y + 1);
    var hh = h || 24;
    poly([a, b, up(b, hh), up(a, hh)], ghost ? 'rgba(143,208,140,.55)' : '#8e5a37', ghost ? '#fff' : INK);
    if (!ghost) { var a2 = along === 'x' ? iso(x + .12, y) : iso(x, y + .12), b2 = along === 'x' ? iso(x + .88, y) : iso(x, y + .88); poly([up(a2, 1), up(b2, 1), up(b2, hh - 3), up(a2, hh - 3)], '#b9804f'); var k = along === 'x' ? up(iso(x + .75, y), hh / 2) : up(iso(x, y + .75), hh / 2); R(k[0], k[1], 1, 1, '#f3d38a'); }
  }
  function windowOn(x, y, along, z, w, h) {
    var a = along === 'x' ? iso(x + .15, y) : iso(x, y + .15), b = along === 'x' ? iso(x + .85, y) : iso(x, y + .85);
    poly([up(a, z), up(b, z), up(b, z + h), up(a, z + h)], '#fff1e2', INK);
    var a2 = along === 'x' ? iso(x + .22, y) : iso(x, y + .22), b2 = along === 'x' ? iso(x + .78, y) : iso(x, y + .78);
    poly([up(a2, z + 2), up(b2, z + 2), up(b2, z + h - 2), up(a2, z + h - 2)], '#a9c9e8');
    var m1 = [(a2[0] + b2[0]) / 2, (a2[1] + b2[1]) / 2]; R(m1[0], m1[1] - z - h + 2, 1, h - 4, '#fff1e2');
  }
  function chip(x, y, w, s, on) { R(x, y, w, 14, on ? P.rose : '#fff6ea'); R(x, y + 13, w, 1, on ? P.roseSh : P.trayEdge); c.strokeStyle = P.rose; c.strokeRect(x + .5, y + .5, w - 1, 13); txt(s, x + w / 2, y + 4, on ? '#fff' : P.ink, 6, 'center'); }
  function finger(px, py) { c.fillStyle = 'rgba(255,255,255,.45)'; c.beginPath(); c.arc(px, py, 7, 0, 7); c.fill(); c.strokeStyle = 'rgba(255,255,255,.95)'; c.stroke(); }
  function heart(x, y, col) { R(x + 1, y, 2, 1, col); R(x + 4, y, 2, 1, col); R(x, y + 1, 7, 2, col); R(x + 1, y + 3, 5, 1, col); R(x + 2, y + 4, 3, 1, col); R(x + 3, y + 5, 1, 1, col); }
  function topBar(W, name) {
    R(4, 4, 72, 15, 'rgba(255,246,234,.95)'); R(4, 18, 72, 1, P.trayEdge); R(8, 8, 7, 7, '#7fa7a0'); R(9, 9, 3, 2, '#a8cbc0'); txt('SANDBOX', 19, 8, P.ink, 7);
    R(W - 96, 4, 92, 15, 'rgba(255,246,234,.95)'); R(W - 96, 18, 92, 1, P.trayEdge); heart(W - 91, 8, P.rose); txt(name, W - 81, 8, P.ink, 7);
  }
  // on-screen view controls: floor picker and walls button
  function viewControls(W, y, floor, walls) {
    var x = W - 26;
    R(x, y, 22, 52, 'rgba(255,246,234,.95)'); R(x, y + 51, 22, 1, P.trayEdge);
    [3, 2, 1].forEach(function (f, k) { var on = f === floor; R(x + 2, y + 2 + k * 16, 18, 14, on ? P.rose : '#fbeedd'); txt(String(f), x + 11, y + 6 + k * 16, on ? '#fff' : P.ink, 7, 'center'); });
    R(x, y + 56, 22, 22, 'rgba(255,246,234,.95)'); R(x, y + 77, 22, 1, P.trayEdge);
    var hh = walls === 'up' ? 12 : walls === 'cut' ? 7 : 3; R(x + 5, y + 72 - hh, 3, hh, P.ink); R(x + 9, y + 72 - hh + 2, 8, hh - 2 > 0 ? hh - 2 : 1, P.soft); R(x + 4, y + 72, 14, 1, P.ink);
    txt(walls === 'up' ? 'UP' : walls === 'cut' ? 'CUT' : 'DOWN', x + 11, y + 80, 'rgba(255,241,226,.95)', 4, 'center');
  }
  function toolIcon(i, x, y, on) {
    var k = on ? '#fff' : P.ink, k2 = on ? '#ffd9e2' : P.soft;
    [function () { R(x, y + 2, 12, 8, k); R(x + 1, y + 3, 10, 6, k2); }, // room
      function () { R(x, y + 4, 12, 3, k); R(x + 1, y + 5, 10, 1, k2); },   // wall
      function () { R(x + 3, y, 7, 11, k); R(x + 4, y + 1, 5, 10, k2); R(x + 7, y + 6, 1, 1, k); }, // door
      function () { R(x + 1, y + 1, 10, 9, k); R(x + 2, y + 2, 8, 7, '#a9c9e8'); R(x + 6, y + 2, 1, 7, k); R(x + 2, y + 5, 8, 1, k); }, // window
      function () { for (var a = 0; a < 3; a++) for (var b = 0; b < 3; b++) R(x + a * 4, y + 1 + b * 3, 3, 2, (a + b) % 2 ? k : k2); }, // floor
      function () { R(x + 1, y + 1, 10, 9, k2); for (var s = 1; s < 10; s += 3) R(x + s, y + 1, 1, 9, k); }, // wallpaper
      function () { for (var s = 0; s < 4; s++) R(x + s * 3, y + 8 - s * 2, 12 - s * 3, 2, k); }, // stairs
      function () { R(x + 2, y + 3, 8, 6, k); R(x + 4, y + 1, 4, 2, k); R(x + 3, y + 4, 6, 4, k2); } // erase
    ][i]();
  }
  function buildTray(W, H, sel, sub) {
    var h = 92, y = H - h;
    R(0, y - 2, W, 2, 'rgba(59,36,48,.25)'); R(0, y, W, h, P.tray); R(0, y, W, 1, '#fffaf3');
    ['HOME', 'STYLE', 'BUILD'].forEach(function (s, i) { var tx = 6 + i * 52; R(tx, y + 4, 48, 12, i === 2 ? P.rose : P.trayEdge); if (i === 2) R(tx, y + 4, 48, 1, P.roseHi); txt(s, tx + 24, y + 6, i === 2 ? '#fff' : P.ink, 8, 'center'); });
    var names = ['ROOM', 'WALL', 'DOOR', 'WINDOW', 'FLOOR', 'PAPER', 'STAIRS', 'ERASE'];
    for (var i = 0; i < 8; i++) { var tx = 4 + i * 29.2, on = i === sel; R(tx, y + 20, 27, 18, on ? P.rose : '#fbeedd'); R(tx, y + 37, 27, 1, on ? P.roseSh : P.trayEdge); toolIcon(i, tx + 8, y + 23, on); }
    txt(names[sel], 6, y + 43, P.ink, 6); sub(y + 52);
  }
  function swatchCard(x, y, w, fn, on) { R(x, y, w, 24, on ? '#fde3ea' : '#fbeedd'); R(x, y + 23, w, 1, P.trayEdge); fn(x, y); if (on) { c.strokeStyle = P.rose; c.lineWidth = 2; c.strokeRect(x + 1, y + 1, w - 2, 22); c.lineWidth = 1; } }

  window.drawBuild = function (ctx, W, H, t, st) {
    c = ctx; t = t || 0; st = st || 'room';
    c.imageSmoothingEnabled = false;
    var g = c.createRadialGradient(W / 2, H * .4, 20, W / 2, H * .4, W); g.addColorStop(0, '#3a2633'); g.addColorStop(1, '#22171f'); c.fillStyle = g; c.fillRect(0, 0, W, H);
    if (st === 'room') {
      TW = 13; TH = 6.5; OX = 120; OY = 66;
      grassLot(16);
      // a path to the front door, and a little tree
      tiles(5, 7, 1, 9, ['#e3d3bf', '#d6c3ab']);
      // first room, already built (walls cut away at this zoom)
      planks(2, 2, 6, 5);
      wallX(2, 2, 8, 22, P.wall); wallY(2, 2, 7, 22, P.wall);
      wallX(7, 2, 8, 5, P.wall); wallY(8, 2, 7, 5, P.wall);
      door(5, 7, 'x', false, 5);
      // the new room being dragged out: green tiles, ghost walls and a size tag
      c.globalAlpha = .9; tiles(8, 2, 5, 6, ['rgba(143,208,140,.55)', 'rgba(120,190,120,.55)'], 'rgba(255,255,255,.5)'); c.globalAlpha = 1;
      c.globalAlpha = .45; wallX(2, 8, 13, 22, P.wall2); wallY(13, 2, 8, 22, P.wall2); c.globalAlpha = 1;
      var f = iso(13, 8); finger(f[0], f[1]);
      var tg = iso(10.5, 5); R(tg[0] - 20, tg[1] - 8, 40, 15, '#fff6ea'); c.strokeStyle = P.rose; c.strokeRect(tg[0] - 19.5, tg[1] - 7.5, 39, 14); txt('5 × 6', tg[0], tg[1] - 4, P.ink, 7, 'center');
      // trees and a fence at the lot edge
      [[14.5, 1.5], [1, 13.5], [14, 13]].forEach(function (q) { var p = iso(q[0], q[1]); c.fillStyle = 'rgba(90,45,40,.25)'; c.beginPath(); c.ellipse(p[0], p[1], 7, 3.5, 0, 0, 7); c.fill(); R(p[0] - 1, p[1] - 9, 2, 9, '#704328'); c.fillStyle = '#437a47'; c.beginPath(); c.arc(p[0], p[1] - 14, 8, 0, 7); c.fill(); c.fillStyle = '#6aa361'; c.beginPath(); c.arc(p[0] - 2, p[1] - 16, 6, 0, 7); c.fill(); c.fillStyle = '#8fc47b'; c.beginPath(); c.arc(p[0] - 4, p[1] - 18, 2.5, 0, 7); c.fill(); });
      txt('DRAG A BOX TO MAKE A ROOM', W / 2, H - 112, 'rgba(255,241,226,.9)', 6, 'center');
      txt('SMALL LOT · 16 × 16', 8, 26, 'rgba(255,241,226,.75)', 5);
      topBar(W, 'NEW HOME'); viewControls(W, 30, 1, 'cut');
      buildTray(W, H, 0, function (y) {
        txt('DRAG A BOX · PICK A WALL STYLE', 234, y - 9, P.soft, 5, 'right');
        [['#f3d2c4', '#dcab9c'], ['#c8dcd4', '#98b5aa'], ['#fff1e2', '#e3d3bf'], ['#c96f45', '#9a4c2d'], ['#d9c6ea', '#9a7bb4'], ['#8e5a37', '#55311d']].forEach(function (cc, k) {
          swatchCard(6 + k * 38.4, y + 6, 35, function (x, yy) { R(x + 6, yy + 4, 23, 16, '#3b2430'); R(x + 7, yy + 5, 21, 14, cc[0]); for (var s = 9; s < 27; s += 4) R(x + s, yy + 5, 1, 14, cc[1]); R(x + 7, yy + 15, 21, 4, '#fff1e2'); }, k === 0);
        });
      });
    } else if (st === 'door') {
      TW = 22; TH = 11; OX = 116; OY = 70;
      grassLot(16);
      planks(0, 0, 7, 6);
      // back walls up, front walls cut away
      wallX(0, 0, 7, 70, P.wall); wallY(0, 0, 6, 70, P.wall);
      windowOn(1.5, 0, 'x', 26, 1, 24); windowOn(0, 2, 'y', 26, 1, 24);
      // wainscot trim on the back walls
      var w1 = up(iso(0, 0), 18), w2 = up(iso(7, 0), 18), w3 = up(iso(0, 6), 18); c.strokeStyle = '#fff1e2'; c.lineWidth = 2; c.beginPath(); c.moveTo(w3[0], w3[1]); c.lineTo(w1[0], w1[1]); c.lineTo(w2[0], w2[1]); c.stroke(); c.lineWidth = 1;
      // the door snapping onto the back wall: green outline and a glow on the wall
      door(4.3, 0, 'x', false, 40); c.globalAlpha = .55; door(4.3, 0, 'x', true, 40); c.globalAlpha = 1; var dk = up(iso(4.8, 0), 50); chip(dk[0] - 22, dk[1] - 18, 44, 'SNAPS');
      var fp = up(iso(5.2, 0), 22); finger(fp[0] + 6, fp[1] + 6);
      wallX(6, 0, 7, 8, P.wall); wallY(7, 0, 6, 8, P.wall);
      door(3, 6, 'x', false, 8);
      txt('DRAG ONTO ANY WALL', W / 2, H - 112, 'rgba(255,241,226,.9)', 6, 'center');
      topBar(W, 'NEW HOME'); viewControls(W, 30, 1, 'cut');
      buildTray(W, H, 2, function (y) {
        txt('SNAPS TO ANY WALL', 234, y - 9, P.soft, 5, 'right');
        var cols = [['#b9804f', '#8e5a37'], ['#fff1e2', '#e3d3bf'], ['#e46f8b', '#b44f63'], ['#7fa7a0', '#5d8580'], ['#a9c9e8', '#8e5a37'], ['#f3d38a', '#c78f3e']];
        cols.forEach(function (cc, k) { swatchCard(6 + k * 38.4, y + 6, 35, function (x, yy) { R(x + 11, yy + 3, 13, 19, '#3b2430'); R(x + 12, yy + 4, 11, 18, cc[1]); R(x + 13, yy + 5, 9, 16, cc[0]); if (k === 4) { R(x + 14, yy + 6, 7, 6, '#a9c9e8'); } if (k === 5) { R(x + 13, yy + 5, 4, 16, '#fff1e2'); R(x + 18, yy + 5, 4, 16, '#fff1e2'); } R(x + 20, yy + 13, 1, 1, '#f3d38a'); }, k === 0); });
      });
    } else {
      TW = 20; TH = 10; OX = 118; OY = 66;
      // ground floor, dimmed under the new floor
      grassLot(16);
      c.globalAlpha = .45; planks(2, 2, 8, 7); c.globalAlpha = 1;
      poly([iso(0, 0), iso(16, 0), iso(16, 16), iso(0, 16)], 'rgba(34,23,31,.35)');
      var Z = 40, save = OY;
      // the stair flight: a straight run along the front edge, rising from floor 1 (x = 7.5) to floor 2 (x = 3.5).
      // Drawn before floor 2 so the floor covers what is under it; the open front shows its side.
      var SC = ['#ecbd8a', '#c48a58', '#a06a40'], N = 8, sx = 3.5, sy = 7.6, sd = 1.4;
      for (var st = 0; st < N; st++) {
        var x0 = sx + st * .5, h = Z - (st + 1) * (Z / (N + 1));
        box(x0, sy, .5, sd, h, SC);
        var n1 = up(iso(x0 + .5, sy), h), n2 = up(iso(x0 + .5, sy + sd), h); c.strokeStyle = '#fbe0bd'; c.beginPath(); c.moveTo(n1[0], n1[1] - .5); c.lineTo(n2[0], n2[1] - .5); c.stroke();
      }
      // a solid stringer on the open side, so the run reads as one flight
      var g = [iso(sx, sy + sd), iso(sx + N * .5, sy + sd)];
      poly([g[0], up(g[0], Z), up(g[1], Z / (N + 1)), g[1]], '#8e5a37', INK);
      poly([up(g[0], Z), up(g[0], Z - 3), up(g[1], Z / (N + 1) - 3 + 3), up(g[1], Z / (N + 1))], '#b9804f');
      // floor 2, one storey up, with the stairwell left open
      OY -= Z;
      var Hh = [iso(sx, sy), iso(sx + N * .5, sy), iso(sx + N * .5, sy + sd), iso(sx, sy + sd)];
      c.save(); c.beginPath(); c.rect(0, 0, W, H); c.moveTo(Hh[0][0], Hh[0][1]); for (var hi = 3; hi >= 1; hi--) c.lineTo(Hh[hi][0], Hh[hi][1]); c.closePath(); c.clip();
      planks(2, 2, 8, 7);
      // slab edge along the open front
      var f1 = iso(2, 9), f2 = iso(10, 9), f3 = iso(10, 2); poly([f1, f2, up(f2, -3), up(f1, -3)], '#c9a58a'); poly([f2, f3, up(f3, -3), up(f2, -3)], '#a9866d');
      c.restore();
      poly(Hh, null, '#55311d');
      wallX(2, 2, 10, 46, P.wall2); wallY(2, 2, 9, 46, P.wall2);
      windowOn(4, 2, 'x', 16, 1, 18); windowOn(7, 2, 'x', 16, 1, 18); windowOn(2, 5, 'y', 16, 1, 18);
      // a cosy bed against the side wall
      box(2.1, 3, 2, 2.6, 7, ['#fbe9e2', '#ecd2c8', '#d6b6ab']); box(2.1, 3, .4, 2.6, 16, ['#dca474', '#b9804f', '#8e5a37']); box(2.5, 3.2, .6, 1, 3, ['#ffffff', '#f1ece6', '#d9d0c4'], 7); box(3.1, 3.1, 1, 2.4, 2, ['#e9a7b4', '#e46f8b', '#b44f63'], 7);
      // banister on the stairwell's inner side and far end; the top (x = 3.5) stays open to step onto
      function rail(a, b) { var n = Math.max(2, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) * 2)); for (var q = 1; q < n; q++) { var pt = iso(a[0] + (b[0] - a[0]) * q / n, a[1] + (b[1] - a[1]) * q / n); R(pt[0], pt[1] - 10, 1, 10, '#8e5a37'); }
        var t1 = up(iso(a[0], a[1]), 11), t2 = up(iso(b[0], b[1]), 11); c.strokeStyle = '#55311d'; c.lineWidth = 2; c.beginPath(); c.moveTo(t1[0], t1[1]); c.lineTo(t2[0], t2[1]); c.stroke(); c.strokeStyle = '#dca474'; c.lineWidth = 1; c.beginPath(); c.moveTo(t1[0], t1[1] - 1); c.lineTo(t2[0], t2[1] - 1); c.stroke(); }
      var ex = sx + N * .5;
      rail([sx + .4, sy], [ex, sy]); rail([ex, sy], [ex, sy + sd]);
      [[sx + .4, sy], [ex, sy], [ex, sy + sd]].forEach(function (q) { box(q[0] - .1, q[1] - .1, .2, .2, 14, ['#dca474', '#b9804f', '#8e5a37']); });
      OY = save;
      txt('FLOOR 2 · FLOOR 1 SHOWS BELOW', W / 2, H - 112, 'rgba(255,241,226,.9)', 6, 'center');
      topBar(W, 'NEW HOME'); viewControls(W, 30, 2, 'up');
      buildTray(W, H, 6, function (y) {
        txt('STRAIGHT · L-TURN · SPIRAL · LADDER', 234, y - 9, P.soft, 5, 'right');
        ['STRAIGHT', 'L-TURN', 'SPIRAL', 'LADDER'].forEach(function (s, k) { swatchCard(6 + k * 57.5, y + 6, 54, function (x, yy) {
          if (k === 0) for (var a = 0; a < 4; a++) R(x + 18 + a * 4, yy + 16 - a * 3, 18 - a * 4, 3, '#b9804f');
          if (k === 1) { for (var b = 0; b < 3; b++) R(x + 18 + b * 3, yy + 16 - b * 3, 12 - b * 3, 3, '#b9804f'); R(x + 28, yy + 5, 6, 3, '#8e5a37'); }
          if (k === 2) { c.strokeStyle = '#8e5a37'; c.beginPath(); c.arc(x + 27, yy + 12, 7, 0, 5.5); c.stroke(); R(x + 26, yy + 4, 2, 16, '#55311d'); }
          if (k === 3) { R(x + 21, yy + 3, 2, 18, '#8e5a37'); R(x + 31, yy + 3, 2, 18, '#8e5a37'); for (var d = 5; d < 21; d += 4) R(x + 21, yy + d, 12, 1, '#b9804f'); }
        }, k === 0); });
      });
    }
  };
})();
