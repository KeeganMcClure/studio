// Sarah's Sim: Visitor chat mockup v1 (Nov 26, 2026), for spec 008 part A. All art drawn in code.
// Needs people-v1.js loaded first (Sarah). Dot is a made-up neighbor, drawn here for the first time.
// drawVisitor(ctx, W, H, t, state):
//   'knock'  a knock at the front door: a bubble with the visitor's face, then Let in or Not now (nothing lost either way).
//   'chat'   the visitor stands in the hall with Sarah, drawn large, so the dialog box shows the name tab only (studio-bible/ui.md).
//            The friendship hearts sit beside the tab, with the word "Friends".
//   'ask'    the last line asks for the story gig, with the choices inside the box and a cursor. Yes opens the Gig screen (spec 006).
(function () {
  var c;
  function R(x, y, w, h, col) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
  var P = { tray: '#fff6ea', trayEdge: '#e8cdb4', trayInk: '#6b4250', soft: '#8e6670', rose: '#e46f8b', roseHi: '#f39bb0', roseSh: '#b44f63', o: '#3b2430',
    leaf: '#6aa361', leafHi: '#8fc47b', leafSh: '#437a47' };
  function txt(s, x, y, col, size, align) { c.font = (size || 8) + 'px "Press Start 2P", monospace'; c.fillStyle = col; c.textAlign = align || 'left'; c.textBaseline = 'top'; c.fillText(s, x, y); }
  function vt(s, x, y, col, size, align) { c.font = (size || 10) + 'px "VT323", monospace'; c.fillStyle = col; c.textAlign = align || 'left'; c.textBaseline = 'top'; c.fillText(s, x, y); }
  function btn(x, y, w, s, on) { R(x, y, w, 18, on ? P.rose : '#fbeedd'); R(x, y + 17, w, 1, on ? P.roseSh : P.trayEdge); if (on) R(x, y, w, 1, P.roseHi); txt(s, x + w / 2, y + 6, on ? '#fff' : P.trayInk, 6, 'center'); }
  function card(x, y, w, h, edge) { R(x + 2, y + 3, w, h, 'rgba(34,23,31,.35)'); R(x, y, w, h, P.tray); R(x, y + h - 1, w, 1, P.trayEdge); c.strokeStyle = edge || P.rose; c.lineWidth = 1; c.strokeRect(x + .5, y + .5, w - 1, h - 1); }
  function heart(x, y, on) { var col = on ? P.rose : '#e8dccd'; R(x + 1, y, 2, 1, col); R(x + 4, y, 2, 1, col); R(x, y + 1, 7, 2, col); R(x + 1, y + 3, 5, 1, col); R(x + 2, y + 4, 3, 1, col); R(x + 3, y + 5, 1, 1, col); if (on) R(x + 1, y + 1, 1, 1, '#ffd0dc'); }
  function finger(px, py) { c.fillStyle = 'rgba(255,255,255,.45)'; c.beginPath(); c.arc(px, py, 7, 0, 7); c.fill(); c.strokeStyle = 'rgba(255,255,255,.95)'; c.stroke(); }
  function shadow(x, y, w) { c.fillStyle = 'rgba(90,45,40,.25)'; c.beginPath(); c.ellipse(x, y, w / 2, w / 6, 0, 0, 7); c.fill(); }

  // ---------- Dot: retired florist in her 70s. Silver bun, round glasses, sage cardigan, plum skirt, flowers in hand. 20 x 40 ----------
  var D = { o: '#3b2430', hair: ['#f4f1f5', '#d9d3dc', '#b5adb9'], sk: ['#f6d2b8', '#e8b898', '#cf9a7c'], glass: '#a88a5a',
    card: ['#9cc1a0', '#7fa784', '#5d8565'], blouse: '#fbf4ea', skirt: ['#a8708a', '#8f5d73', '#6f4558'], shoe: '#6b4a30', scarf: ['#f39bb0', '#ffd56b'] };
  function dotSprite(X, Y, S, t, noFlowers) {
    function r(x, y, w, h, col) { c.fillStyle = col; c.fillRect(X + x * S, Y + y * S, w * S, h * S); }
    function e(cx, cy, rx, ry, col) { for (var yy = -ry; yy <= ry; yy++) { var hw = Math.round(rx * Math.sqrt(Math.max(0, 1 - (yy * yy) / (ry * ry)))); r(cx - hw, cy + yy, hw * 2 + 1, 1, col); } }
    // bun on top
    e(10, 2, 4, 2, D.o); e(10, 2, 3, 1, D.hair[1]); r(9, 1, 2, 1, D.hair[0]);
    // hair and face
    e(10, 10, 8, 8, D.o); e(10, 10, 7, 7, D.hair[1]); e(8, 8, 5, 4, D.hair[0]);
    e(10, 12, 6, 6, D.o); e(10, 12, 5, 5, D.sk[1]); e(9, 11, 3, 3, D.sk[0]);
    r(4, 6, 12, 3, D.hair[1]); r(5, 6, 5, 1, D.hair[0]); r(3, 8, 2, 6, D.hair[2]); r(15, 8, 2, 6, D.hair[2]);
    // round glasses and a kind smile
    var blink = t % 9 === 0;
    [[6, 10], [11, 10]].forEach(function (g) { r(g[0], g[1], 4, 1, D.glass); r(g[0], g[1] + 3, 4, 1, D.glass); r(g[0] - 1, g[1] + 1, 1, 2, D.glass); r(g[0] + 4, g[1] + 1, 1, 2, D.glass); r(g[0] + 1, g[1] + 1, 2, blink ? 1 : 2, D.o); if (!blink) r(g[0] + 1, g[1] + 1, 1, 1, '#fff'); });
    r(10, 11, 1, 1, D.glass); r(5, 15, 1, 1, '#f2aaa2'); r(15, 15, 1, 1, '#f2aaa2'); r(8, 16, 4, 1, '#b86a62'); r(7, 15, 1, 1, '#b86a62'); r(12, 15, 1, 1, '#b86a62');
    r(9, 14, 2, 1, D.sk[2]);
    // neck scarf with little flowers
    r(5, 18, 10, 3, D.o); r(6, 18, 8, 2, D.scarf[0]); r(7, 18, 1, 1, D.scarf[1]); r(11, 19, 1, 1, D.scarf[1]); r(12, 20, 2, 3, D.scarf[0]);
    // cardigan over a cream blouse
    r(3, 20, 14, 12, D.o); r(4, 20, 12, 11, D.card[1]); r(4, 20, 4, 10, D.card[0]); r(13, 21, 3, 10, D.card[2]); r(8, 20, 4, 10, D.blouse); r(9, 22, 1, 1, D.card[2]); r(9, 25, 1, 1, D.card[2]); r(9, 28, 1, 1, D.card[2]);
    r(5, 26, 3, 2, D.card[2]); // pocket with garden shears peeking out
    r(6, 25, 1, 1, '#d6dde2');
    r(1, 21, 2, 10, D.o); r(1, 21, 1, 9, D.card[0]); r(17, 21, 2, 10, D.o); r(18, 21, 1, 9, D.card[2]);
    r(1, 30, 2, 2, D.sk[1]); r(17, 30, 2, 2, D.sk[2]);
    // long plum skirt, sensible shoes
    r(3, 31, 14, 7, D.o); r(4, 31, 12, 6, D.skirt[1]); r(4, 31, 4, 6, D.skirt[0]); r(13, 31, 3, 6, D.skirt[2]);
    r(5, 37, 4, 1, D.sk[1]); r(11, 37, 4, 1, D.sk[2]);
    r(4, 38, 6, 2, D.o); r(5, 38, 4, 1, D.shoe); r(10, 38, 6, 2, D.o); r(11, 38, 4, 1, D.shoe);
    if (noFlowers) return;
    // a bunch of flowers from her garden, held in front
    r(14, 24, 2, 8, P.leafSh); r(16, 23, 1, 7, P.leaf); r(13, 25, 1, 6, P.leaf);
    r(12, 29, 6, 2, '#fbf4ea'); r(12, 30, 6, 1, '#e8dccd');
    var sw = Math.round(Math.sin(t / 2) * .6);
    [[12 + sw, 20, '#e46f8b'], [15 + sw, 19, '#ffd56b'], [17 + sw, 21, '#c8a6d8'], [13 + sw, 23, '#f39bb0'], [16 + sw, 22, '#e46f6a']].forEach(function (f) { r(f[0], f[1], 2, 2, f[2]); r(f[0], f[1], 1, 1, 'rgba(255,255,255,.6)'); });
    r(18, 24, 1, 2, P.leafHi); r(11, 22, 1, 2, P.leafHi);
  }
  function dotHead(X, Y, S, t) { // just the face, for the knock bubble
    c.save(); c.beginPath(); c.rect(X, Y, 20 * S, 19 * S); c.clip(); dotSprite(X, Y, S, t, true); c.restore();
  }

  // ---------- the front hall, seen straight on ----------
  function hall(W, H, t, doorOpen) {
    var fl = H - 112; // where the floor meets the wall
    // wallpaper: sage stripes with tiny flowers
    R(0, 0, W, fl, '#e6efdf');
    for (var x = 0; x < W; x += 16) { R(x, 0, 8, fl, '#dbe8d2'); }
    for (var y = 10, row = 0; y < fl - 30; y += 18, row++) for (var x2 = (row % 2) * 8 + 4; x2 < W; x2 += 16) { R(x2, y, 2, 2, '#f0b3c4'); R(x2 + 1, y + 2, 1, 2, '#9cc1a0'); }
    // a gallery of framed things above the coat hooks: a painting of hers and a photo of the cats
    var gy = Math.max(26, fl - 190);
    R(18, gy, 42, 32, '#c88d5a'); R(21, gy + 3, 36, 26, '#9cc1b6'); R(21, gy + 18, 36, 11, '#6aa361'); c.fillStyle = '#ffd56b'; c.beginPath(); c.arc(48, gy + 10, 4, 0, 7); c.fill(); R(28, gy + 14, 3, 6, '#e46f8b'); R(36, gy + 15, 3, 5, '#c8a6d8');
    R(68, gy + 6, 26, 22, '#fbf4ea'); R(70, gy + 8, 22, 18, '#e8dccd'); c.fillStyle = '#e8963f'; c.beginPath(); c.ellipse(76, gy + 21, 4, 3, 0, 0, 7); c.fill(); c.fillStyle = '#8a8590'; c.beginPath(); c.ellipse(86, gy + 21, 4, 3, 0, 0, 7); c.fill(); R(73, gy + 16, 2, 2, '#e8963f'); R(84, gy + 16, 2, 2, '#8a8590');
    R(18, gy + 1, 42, 1, 'rgba(255,255,255,.3)');
    // a pendant light over the hall
    R(120, 0, 1, gy + 4, '#6b4250'); c.fillStyle = '#f6c86e'; c.beginPath(); c.moveTo(112, gy + 14); c.lineTo(129, gy + 14); c.lineTo(124, gy + 4); c.lineTo(117, gy + 4); c.closePath(); c.fill(); R(118, gy + 14, 5, 2, '#fff3c4');
    var pg = c.createRadialGradient(120, gy + 16, 2, 120, gy + 16, 50); pg.addColorStop(0, 'rgba(255,214,140,.3)'); pg.addColorStop(1, 'rgba(255,214,140,0)'); c.fillStyle = pg; c.fillRect(70, gy - 30, 100, 100);
    // wainscot and baseboard
    R(0, fl - 36, W, 36, '#fbf4ea'); R(0, fl - 38, W, 3, '#fff8ee'); R(0, fl - 35, W, 1, '#e9dcc4');
    for (var p = 6; p < W; p += 26) { R(p, fl - 30, 20, 24, '#f3e8d8'); R(p, fl - 30, 20, 1, '#e2d4c0'); R(p, fl - 7, 20, 1, '#fffaf3'); }
    R(0, fl - 5, W, 5, '#e2d4c0');
    // the floor: warm planks with a long runner
    R(0, fl, W, H - fl, '#c88d5a');
    for (var fy = fl, k = 0; fy < H; fy += 9, k++) { R(0, fy, W, 1, '#93603c'); for (var fx = (k * 37) % 60; fx < W; fx += 60) R(fx, fy, 1, 9, '#93603c'); R(0, fy + 1, W, 1, 'rgba(255,220,180,.15)'); }
    c.fillStyle = '#b9505a'; c.beginPath(); c.moveTo(70, fl + 4); c.lineTo(170, fl + 4); c.lineTo(214, H); c.lineTo(26, H); c.closePath(); c.fill();
    c.fillStyle = '#e7b75f'; c.beginPath(); c.moveTo(76, fl + 8); c.lineTo(164, fl + 8); c.lineTo(204, H); c.lineTo(36, H); c.closePath(); c.fill();
    c.fillStyle = '#c9636b'; c.beginPath(); c.moveTo(82, fl + 12); c.lineTo(158, fl + 12); c.lineTo(194, H); c.lineTo(46, H); c.closePath(); c.fill();
    // the front door, center right
    var dx = 124, dw = 60, dt = fl - 112;
    R(dx - 6, dt - 8, dw + 12, 116, '#fff8ee'); R(dx - 6, dt - 8, dw + 12, 2, '#fffaf3'); R(dx - 6, dt - 8, 2, 116, '#e9dcc4'); R(dx + dw + 4, dt - 8, 2, 116, '#e2d4c0');
    R(dx + 6, dt - 6, dw - 12, 6, '#9ec3dc'); R(dx + 6, dt - 6, dw - 12, 1, '#c9dfee'); // transom
    if (doorOpen) {
      // the street outside: a rowhouse across the way, a tree, the sidewalk
      R(dx, dt, dw, 108, '#a9d0ec'); R(dx, dt + 4, dw, 70, '#b46a5a');
      for (var wx = dx + 6; wx < dx + dw - 8; wx += 18) for (var wy = dt + 12; wy < dt + 64; wy += 22) { R(wx, wy, 10, 14, '#efe2d2'); R(wx + 1, wy + 1, 8, 12, '#8fb3cc'); }
      R(dx, dt + 74, dw, 14, '#c9bfb2'); R(dx, dt + 74, dw, 1, '#e4dcd2'); R(dx, dt + 88, dw, 20, '#8b8189');
      c.fillStyle = P.leaf; c.beginPath(); c.arc(dx + 10, dt + 30, 14, 0, 7); c.fill(); c.fillStyle = P.leafHi; c.beginPath(); c.arc(dx + 6, dt + 25, 6, 0, 7); c.fill(); R(dx + 9, dt + 40, 3, 34, '#6b4a30');
      // the door swung in, against the wall
      R(dx + dw - 2, dt, 8, 108, '#3f6f68'); R(dx + dw - 2, dt, 2, 108, '#5d8580');
      R(dx - 2, dt + 104, dw + 4, 4, '#a8907a'); // threshold
    } else {
      R(dx, dt, dw, 108, '#4f8279'); R(dx, dt, 3, 108, '#6a9a90'); R(dx + dw - 3, dt, 3, 108, '#3f6a62');
      [[8, 10, 44, 34], [8, 54, 20, 46], [32, 54, 20, 46]].forEach(function (pn) { R(dx + pn[0], dt + pn[1], pn[2], pn[3], '#457469'); R(dx + pn[0], dt + pn[1], pn[2], 1, '#3a6159'); R(dx + pn[0], dt + pn[1] + pn[3] - 1, pn[2], 1, '#6a9a90'); });
      R(dx + 14, dt + 14, 32, 26, '#cfe4f0'); R(dx + 14, dt + 14, 32, 2, '#f0f7fb'); R(dx + 29, dt + 14, 2, 26, '#457469');
      // a shadow of someone on the step, through the glass
      c.fillStyle = 'rgba(80,90,100,.35)'; c.beginPath(); c.arc(dx + 26, dt + 30, 6, 0, 7); c.fill(); R(dx + 18, dt + 36, 16, 4, 'rgba(80,90,100,.35)');
      R(dx + dw - 12, dt + 58, 4, 4, '#e7bb4f'); R(dx + dw - 12, dt + 58, 2, 1, '#fff3c4');
      R(dx + 24, dt + 46, 12, 3, '#e7bb4f'); // mail slot
      // the knock wiggles the door a hair
      if (t % 3 === 0) { R(dx - 3, dt + 40, 2, 1, P.o); R(dx - 4, dt + 44, 3, 1, P.o); R(dx + dw + 1, dt + 40, 2, 1, P.o); R(dx + dw + 1, dt + 44, 3, 1, P.o); }
    }
    // coat hooks with Keegan's flannel and Sarah's tote
    R(14, dt + 6, 70, 4, '#c88d5a'); R(14, dt + 6, 70, 1, '#e2b07e');
    [26, 46, 66].forEach(function (hx) { R(hx, dt + 10, 2, 4, '#704328'); });
    R(20, dt + 14, 14, 30, '#2f5646'); R(20, dt + 14, 14, 30, '#3c6a55'); for (var q = 0; q < 30; q += 6) R(20, dt + 14 + q, 14, 1, '#b8434a'); R(26, dt + 14, 1, 30, '#b8434a');
    R(40, dt + 14, 12, 18, '#e9d6c4'); R(40, dt + 14, 12, 2, '#d8c2ae'); R(43, dt + 20, 6, 6, P.rose);
    R(60, dt + 14, 10, 24, '#f7922e'); R(60, dt + 14, 10, 3, '#ffb760'); // the ORANGE ROCKS tee's matching scarf
    // a small console with a lamp and the keys bowl
    R(10, fl - 44, 70, 5, '#c88d5a'); R(10, fl - 44, 70, 1, '#e2b07e'); R(14, fl - 39, 3, 34, '#9c6a40'); R(73, fl - 39, 3, 34, '#9c6a40');
    R(60, fl - 50, 12, 6, '#7fa7a0'); R(61, fl - 50, 10, 1, '#a8cbc0'); R(64, fl - 49, 1, 1, '#e7bb4f'); R(66, fl - 48, 2, 1, '#d6dde2');
    R(22, fl - 62, 2, 18, '#704328'); c.fillStyle = '#f6c86e'; c.beginPath(); c.moveTo(16, fl - 62); c.lineTo(30, fl - 62); c.lineTo(27, fl - 72); c.lineTo(19, fl - 72); c.closePath(); c.fill();
    var gl = c.createRadialGradient(23, fl - 64, 2, 23, fl - 64, 40); gl.addColorStop(0, 'rgba(255,214,140,.35)'); gl.addColorStop(1, 'rgba(255,214,140,0)'); c.fillStyle = gl; c.fillRect(-20, fl - 110, 90, 90);
    // a plant by the door
    R(200, fl - 14, 16, 14, '#d98a6f'); R(200, fl - 14, 16, 2, '#e8a28c');
    [[204, -24, 7], [212, -28, 8], [208, -36, 6], [216, -20, 5], [200, -20, 5]].forEach(function (l) { c.fillStyle = P.leafSh; c.beginPath(); c.ellipse(l[0], fl + l[1], l[2], l[2] * .6, .4, 0, 7); c.fill(); });
    [[206, -26, 4], [213, -31, 4], [209, -38, 3]].forEach(function (l) { c.fillStyle = P.leafHi; c.beginPath(); c.ellipse(l[0], fl + l[1], l[2], l[2] * .5, .4, 0, 7); c.fill(); });
    return fl;
  }
  function topBar(W) {
    R(4, 4, 92, 15, 'rgba(255,246,234,.95)'); R(4, 18, 92, 1, P.trayEdge); R(8, 8, 7, 7, '#ffd56b'); R(9, 9, 3, 2, '#fff3a8');
    txt('SUN 2:15', 19, 8, P.trayInk, 8);
    R(W - 56, 4, 52, 15, 'rgba(255,246,234,.95)'); R(W - 56, 18, 52, 1, P.trayEdge);
    c.fillStyle = '#ffd56b'; c.beginPath(); c.arc(W - 47, 11.5, 4, 0, 7); c.fill(); c.fillStyle = '#fff3a8'; c.fillRect(W - 49, 9, 2, 2);
    txt('540', W - 39, 8, P.trayInk, 8);
  }
  // the dialog box in Sarah's Sim colors: name tab only, since Dot is drawn large in the scene
  function dialog(W, H, name, hearts, lines, choices, t) {
    var bh = choices ? 84 : 62, by = H - bh - 4;
    R(4, by, W - 8, bh, P.tray); R(4, by + bh - 1, W - 8, 1, P.trayEdge); c.strokeStyle = P.rose; c.lineWidth = 2; c.strokeRect(5, by + 1, W - 10, bh - 2); c.lineWidth = 1;
    // name tab
    c.font = '7px "Press Start 2P", monospace'; var tw = Math.ceil(c.measureText(name).width) + 14;
    R(10, by - 13, tw, 14, P.rose); R(10, by - 13, tw, 1, P.roseHi); txt(name, 17, by - 9, '#fff', 7);
    // friendship, beside the tab: hearts plus the word
    R(tw + 16, by - 12, 86, 12, P.tray); R(tw + 16, by - 1, 86, 1, P.trayEdge);
    for (var i = 0; i < 5; i++) heart(tw + 20 + i * 9, by - 9, i < hearts);
    vt('Friends', tw + 66, by - 13, P.soft, 11);
    lines.forEach(function (l, i) { vt(l, 14, by + 6 + i * 13, P.o, 13); });
    if (choices) choices.forEach(function (ch, i) {
      var cy = by + 34 + i * 20, sel = i === 0;
      R(18, cy, W - 36, 17, sel ? '#fde3ea' : '#fbeedd'); R(18, cy + 16, W - 36, 1, P.trayEdge); if (sel) { c.strokeStyle = P.rose; c.strokeRect(18.5, cy + .5, W - 37, 16); }
      if (sel) { c.fillStyle = P.rose; c.beginPath(); c.moveTo(24, cy + 4); c.lineTo(30, cy + 8.5); c.lineTo(24, cy + 13); c.closePath(); c.fill(); }
      vt(ch, 36, cy + 2, P.trayInk, 13);
    });
    else if (t % 2 === 0) { c.fillStyle = P.rose; c.beginPath(); c.moveTo(W - 22, by + bh - 14); c.lineTo(W - 14, by + bh - 14); c.lineTo(W - 18, by + bh - 9); c.closePath(); c.fill(); }
  }

  window.drawVisitor = function (ctx, W, H, t, st) {
    c = ctx; t = t || 0; st = st || 'chat';
    c.fillStyle = '#22171f'; c.fillRect(0, 0, W, H);
    var fl = hall(W, H, t, st !== 'knock');
    var feet = fl + 46;
    if (st === 'knock') {
      // Sarah looks up from across the hall
      shadow(58, feet, 44); if (window.SS_SARAH) window.SS_SARAH(c, 31, feet - 114, 3, t, false, null, 'bun');
      topBar(W);
      // the knock bubble with the visitor's face, over the door
      var bx = 120, by = fl - 176; card(bx, by, 72, 34); c.fillStyle = P.tray; c.beginPath(); c.moveTo(bx + 30, by + 33); c.lineTo(bx + 42, by + 33); c.lineTo(bx + 36, by + 42); c.closePath(); c.fill();
      c.strokeStyle = P.rose; c.beginPath(); c.moveTo(bx + 30, by + 33.5); c.lineTo(bx + 36, by + 42); c.lineTo(bx + 42, by + 33.5); c.stroke();
      R(bx + 4, by + 4, 26, 26, '#e6efdf'); dotHead(bx + 7, by + 6, 1, t); dotHead(bx + 7, by + 6, 1, t);
      c.save(); c.beginPath(); c.rect(bx + 4, by + 4, 26, 26); c.clip(); R(bx + 4, by + 4, 26, 26, '#e6efdf'); dotHead(bx + 2, by + 4, 1.25, t); c.restore();
      var j = t % 2; txt('KNOCK', bx + 34, by + 8 + j, P.trayInk, 6); txt('KNOCK', bx + 36, by + 19 - j, P.trayInk, 6);
      finger(bx + 18, by + 18);
      // Let in or Not now
      var cy = H - 64; card(8, cy, W - 16, 56);
      txt('DOT IS AT THE DOOR', W / 2, cy + 7, P.trayInk, 6, 'center');
      vt('Your neighbor from across the street', W / 2, cy + 16, P.soft, 11, 'center');
      btn(16, cy + 32, 100, 'NOT NOW', false); btn(W - 116, cy + 32, 100, 'LET IN', true);
      return;
    }
    // Sarah on the left, Dot just inside the door
    shadow(58, feet, 44); if (window.SS_SARAH) window.SS_SARAH(c, 31, feet - 114, 3, t, false, null, 'bun');
    shadow(160, feet, 46); dotSprite(130, feet - 120, 3, t);
    if (st === 'chat') {
      dialog(W, H, 'DOT', 1, ['Well hello, dear! I\'m Dot, from across', 'the street. I\'ve been watching that', 'garden of yours come up. Lovely work.'], null, t);
    } else {
      // a little thought of the job over Dot: a vase of flowers
      var tx = 194, ty = feet - 150; card(tx, ty, 34, 30, P.soft);
      R(tx + 13, ty + 15, 8, 11, '#7fa7a0'); R(tx + 13, ty + 15, 8, 2, '#a8cbc0'); [[12, 8, '#e46f8b'], [17, 6, '#ffd56b'], [21, 9, '#c8a6d8'], [15, 11, '#f39bb0']].forEach(function (f) { R(tx + f[0], ty + f[1], 4, 4, f[2]); }); R(tx + 16, ty + 12, 1, 4, P.leafSh); R(tx + 19, ty + 12, 1, 4, P.leafSh);
      R(tx + 8, ty + 30, 4, 4, P.tray); R(tx + 4, ty + 36, 3, 3, P.tray);
      dialog(W, H, 'DOT', 1, ['Would you put together an arrangement', 'for my table? Something cheerful.'], ['I\'d love to!', 'Maybe another time'], t);
    }
  };
})();
