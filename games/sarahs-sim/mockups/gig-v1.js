// Sarah's Sim: Gig mockup v1 (Nov 25, 2026), for spec 006 part F. All art drawn in code.
// Needs people-v1.js and visitor-v1.js (for Dot) loaded first.
// drawGig(ctx, W, H, t, state):
//   'offer'   the Gig card: who asked, the ask in one line, the space, what they like (tags), the pay range. Accept or Not now.
//   'design'  designing in the gig's space with the normal Decorate tools: a banner with the ask, the tags (ticked when matched)
//             and Hand in. Pieces are lent free for room gigs, so the tray shows FREE, not prices.
//   'result'  the client reacts: hearts fill in, a short line with a hint, the pay, and friendship grows. Never a wrong answer.
(function () {
  var c, TW = 22, TH = 11, OX = 120, OY = 150, N = 7, WALL = 70;
  function iso(x, y) { return [OX + (x - y) * TW / 2, OY + (x + y) * TH / 2]; }
  function up(p, h) { return [p[0], p[1] - h]; }
  function poly(pts, fill, stroke) { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (var i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); if (fill) { c.fillStyle = fill; c.fill(); } if (stroke) { c.strokeStyle = stroke; c.lineWidth = 1; c.stroke(); } }
  function R(x, y, w, h, col) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
  var INK = 'rgba(59,36,48,.85)';
  function box(x, y, w, d, h, cols, z) {
    z = z || 0; var A = up(iso(x, y), z), B = up(iso(x + w, y), z), C = up(iso(x + w, y + d), z), D = up(iso(x, y + d), z);
    poly([D, C, up(C, h), up(D, h)], cols[1]); poly([B, C, up(C, h), up(B, h)], cols[2]); poly([up(A, h), up(B, h), up(C, h), up(D, h)], cols[0]);
    poly([up(A, h), up(B, h), B, C, D, up(D, h)], null, INK);
  }
  var P = { tray: '#fff6ea', trayEdge: '#e8cdb4', trayInk: '#6b4250', soft: '#8e6670', rose: '#e46f8b', roseHi: '#f39bb0', roseSh: '#b44f63', o: '#3b2430',
    leaf: '#6aa361', leafHi: '#8fc47b', leafSh: '#437a47', rust: ['#d9814a', '#b9652f', '#94501f'], mustard: ['#e7b75f', '#c99a3e', '#a67c2c'], wood: ['#dca474', '#b9804f', '#8e5a37'] };
  function txt(s, x, y, col, size, align) { c.font = (size || 8) + 'px "Press Start 2P", monospace'; c.fillStyle = col; c.textAlign = align || 'left'; c.textBaseline = 'top'; c.fillText(s, x, y); }
  function vt(s, x, y, col, size, align) { c.font = (size || 10) + 'px "VT323", monospace'; c.fillStyle = col; c.textAlign = align || 'left'; c.textBaseline = 'top'; c.fillText(s, x, y); }
  function btn(x, y, w, s, on, h) { h = h || 18; R(x, y, w, h, on ? P.rose : '#fbeedd'); R(x, y + h - 1, w, 1, on ? P.roseSh : P.trayEdge); if (on) R(x, y, w, 1, P.roseHi); txt(s, x + w / 2, y + Math.round(h / 2) - 3, on ? '#fff' : P.trayInk, 6, 'center'); }
  function card(x, y, w, h, edge) { R(x + 2, y + 3, w, h, 'rgba(34,23,31,.35)'); R(x, y, w, h, P.tray); R(x, y + h - 1, w, 1, P.trayEdge); c.strokeStyle = edge || P.rose; c.lineWidth = 1; c.strokeRect(x + .5, y + .5, w - 1, h - 1); }
  function coin(x, y) { R(x + 1, y, 5, 7, '#c78f3e'); R(x, y + 1, 7, 5, '#c78f3e'); R(x + 1, y + 1, 5, 5, '#f3d38a'); R(x + 3, y + 2, 1, 3, '#c78f3e'); R(x + 1, y + 1, 2, 1, '#fff3c4'); }
  function heart(x, y, on, s) { s = s || 1; var col = on ? P.rose : '#e8dccd'; function h(a, b, w, hh) { R(x + a * s, y + b * s, w * s, hh * s, col); } h(1, 0, 2, 1); h(4, 0, 2, 1); h(0, 1, 7, 2); h(1, 3, 5, 1); h(2, 4, 3, 1); h(3, 5, 1, 1); if (on) R(x + s, y + s, s, s, '#ffd0dc'); }
  function check(x, y, on) { R(x, y, 9, 9, on ? '#8cc06a' : '#e8dccd'); if (on) { R(x + 2, y + 4, 1, 2, '#fff'); R(x + 3, y + 5, 1, 2, '#fff'); R(x + 4, y + 4, 1, 2, '#fff'); R(x + 5, y + 3, 1, 2, '#fff'); R(x + 6, y + 2, 1, 2, '#fff'); } }
  function tag(x, y, s, on) { c.font = '10px "VT323", monospace'; var w = Math.ceil(c.measureText(s).width) + (on === undefined ? 10 : 20); R(x, y, w, 13, on ? '#e8f3dd' : '#fbeedd'); R(x, y + 12, w, 1, on ? '#b9d8a0' : P.trayEdge); if (on !== undefined) check(x + 3, y + 2, on); vt(s, x + (on === undefined ? 5 : 15), y, on ? '#437a47' : P.trayInk, 11); return w; }
  function portrait(x, y, sz, t) { // Dot's face in a round frame
    R(x, y, sz, sz, '#e6efdf'); c.save(); c.beginPath(); c.rect(x, y, sz, sz); c.clip();
    var sc = Math.max(1, Math.floor(sz / 19)); if (window.SS_DOT) window.SS_DOT(c, x + Math.round((sz - 20 * sc) / 2), y + 2, sc, t, true);
    c.restore(); c.strokeStyle = P.rose; c.lineWidth = 1; c.strokeRect(x + .5, y + .5, sz - 1, sz - 1);
  }

  // ---------- the gig's space: Dot's sunroom corner, in the decorate look ----------
  function room(t, filled) {
    var A = iso(0, 0), B = iso(N, 0), D = iso(0, N), C = iso(N, N);
    for (var j = 0; j < N; j++) for (var i = 0; i < N; i++) { var a = iso(i, j), b = iso(i + 1, j), cc = iso(i + 1, j + 1), d = iso(i, j + 1); poly([a, b, cc, d], ['#d39a66', '#c88d5a', '#bb8150'][(j * 3 + (i >> 1)) % 3]); }
    for (var g = 1; g < N; g++) { var s1 = iso(0, g), e1 = iso(N, g); c.strokeStyle = '#93603c'; c.beginPath(); c.moveTo(s1[0], s1[1]); c.lineTo(e1[0], e1[1]); c.stroke(); }
    poly([A, D, up(D, WALL), up(A, WALL)], '#f1e6cf'); poly([A, B, up(B, WALL), up(A, WALL)], '#e4d6ba');
    for (var y = .5; y < N; y += .5) { var p = iso(0, y); c.strokeStyle = 'rgba(200,170,130,.35)'; c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(p[0], p[1] - WALL); c.stroke(); }
    poly([up(A, WALL), up(D, WALL), up(D, WALL + 3), up(A, WALL + 3)], '#fff1e2'); poly([up(A, WALL), up(B, WALL), up(B, WALL + 3), up(A, WALL + 3)], '#f1dcc8');
    poly([D, C, [C[0], C[1] + 5], [D[0], D[1] + 5]], '#7d4c30'); poly([B, C, [C[0], C[1] + 5], [B[0], B[1] + 5]], '#5e3822');
    // the sunroom's big windows on the right wall, warm fall light
    for (var w = 0; w < 3; w++) { var w0 = iso(.6 + w * 2.1, 0), w1 = iso(2.3 + w * 2.1, 0); poly([up(w0, 14), up(w1, 14), up(w1, 62), up(w0, 62)], '#fff1e2'); poly([up([w0[0] + 2, w0[1] + 1], 16), up([w1[0] - 2, w1[1] - 1], 16), up([w1[0] - 2, w1[1] - 1], 60), up([w0[0] + 2, w0[1] + 1], 60)], '#f2c48a');
      poly([up([w0[0] + 2, w0[1] + 1], 16), up([w1[0] - 2, w1[1] - 1], 16), up([w1[0] - 2, w1[1] - 1], 30), up([w0[0] + 2, w0[1] + 1], 30)], '#d9814a'); var wm = iso(1.45 + w * 2.1, 0); c.strokeStyle = '#fff1e2'; c.beginPath(); c.moveTo(wm[0], wm[1] - 16); c.lineTo(wm[0], wm[1] - 60); c.stroke(); }
    var gl = c.createLinearGradient(B[0], 0, A[0], 0); gl.addColorStop(0, 'rgba(255,200,120,.18)'); gl.addColorStop(1, 'rgba(255,200,120,0)'); c.fillStyle = gl; c.fillRect(A[0], A[1] - 20, B[0] - A[0], 120);
    if (!filled) return;
    // rug (warm plaid), placed
    poly([iso(1.2, 1.6), iso(4.6, 1.6), iso(4.6, 4.8), iso(1.2, 4.8)], P.rust[0]);
    for (var k = 0; k < 4; k++) { poly([iso(1.2 + k * .85, 1.6), iso(1.5 + k * .85, 1.6), iso(1.5 + k * .85, 4.8), iso(1.2 + k * .85, 4.8)], 'rgba(255,230,180,.25)'); poly([iso(1.2, 1.6 + k * .8), iso(4.6, 1.6 + k * .8), iso(4.6, 1.9 + k * .8), iso(1.2, 1.9 + k * .8)], 'rgba(120,50,20,.2)'); }
    // bookshelf on the left wall
    box(0, 4.6, .7, 1.8, 46, P.wood);
    for (var sh = 10; sh < 46; sh += 12) { var s0 = up(iso(.7, 4.65), sh), s1b = up(iso(.7, 6.35), sh); c.strokeStyle = P.wood[2]; c.beginPath(); c.moveTo(s0[0], s0[1]); c.lineTo(s1b[0], s1b[1]); c.stroke();
      for (var bk = 0; bk < 6; bk++) { var bp = up(iso(.7, 4.8 + bk * .26), sh + 1); R(bp[0] - 1, bp[1] - 8, 2, 8, ['#b9505a', '#7fa7a0', '#e7b75f', '#8f5d73', '#d9814a', '#6aa361'][(bk + sh) % 6]); } }
    // a mustard armchair by the window
    box(1.6, .5, 1.4, 1.3, 12, P.mustard); box(1.6, .5, 1.4, .35, 26, P.mustard); box(1.6, .5, .3, 1.3, 19, P.mustard); box(2.7, .5, .3, 1.3, 19, P.mustard);
    box(1.95, .9, .75, .8, 3, ['#f3d38a', '#e7b75f', '#c99a3e'], 12);
    // a knit throw over the arm
    var th = up(iso(3.0, 1.0), 19); R(th[0] - 2, th[1], 6, 10, '#c9636b'); R(th[0] - 2, th[1], 6, 2, '#e8a2a2');
    // floor lamp glowing
    var lp = iso(3.5, .6); R(lp[0], lp[1] - 44, 2, 44, P.o); c.fillStyle = '#f6c86e'; c.beginPath(); c.moveTo(lp[0] - 6, lp[1] - 44); c.lineTo(lp[0] + 8, lp[1] - 44); c.lineTo(lp[0] + 5, lp[1] - 54); c.lineTo(lp[0] - 3, lp[1] - 54); c.closePath(); c.fill();
    var lg = c.createRadialGradient(lp[0], lp[1] - 40, 2, lp[0], lp[1] - 30, 50); lg.addColorStop(0, 'rgba(255,214,140,.4)'); lg.addColorStop(1, 'rgba(255,214,140,0)'); c.fillStyle = lg; c.fillRect(lp[0] - 50, lp[1] - 90, 100, 100);
    // a side table with a mug and a stack of books
    box(3.2, 2.0, .6, .6, 14, P.wood); var st = up(iso(3.5, 2.3), 14); R(st[0] - 4, st[1] - 5, 5, 5, '#fff1e2'); R(st[0] + 1, st[1] - 4, 2, 2, '#fff1e2'); R(st[0] + 2, st[1] - 4, 6, 2, '#7fa7a0'); R(st[0] + 2, st[1] - 6, 6, 2, '#e7b75f');
    // plants: a big fern and a trailing pothos
    [[.4, .4, 1.2], [5.6, .4, 1]].forEach(function (pl) { var b = iso(pl[0] + .3, pl[1] + .3); R(b[0] - 5, b[1] - 10, 10, 10, '#d98a6f'); R(b[0] - 5, b[1] - 10, 10, 2, '#e8a28c');
      for (var f = 0; f < 7; f++) { var an = -Math.PI / 2 + (f - 3) * .45; c.fillStyle = f % 2 ? P.leaf : P.leafSh; c.beginPath(); c.ellipse(b[0] + Math.cos(an) * 9 * pl[2], b[1] - 14 + Math.sin(an) * 8 * pl[2], 6 * pl[2], 2.5, an, 0, 7); c.fill(); }
      c.fillStyle = P.leafHi; c.beginPath(); c.ellipse(b[0] - 2, b[1] - 20 * pl[2], 3, 1.5, -.5, 0, 7); c.fill(); });
    // pumpkins on the floor, for fall
    [[4.8, 3.0, '#e8963f'], [5.3, 3.4, '#d9814a']].forEach(function (pk) { var q = iso(pk[0], pk[1]); c.fillStyle = pk[2]; c.beginPath(); c.ellipse(q[0], q[1] - 4, 6, 4, 0, 0, 7); c.fill(); c.strokeStyle = 'rgba(120,60,20,.5)'; c.beginPath(); c.moveTo(q[0], q[1] - 8); c.lineTo(q[0], q[1]); c.stroke(); R(q[0] - 1, q[1] - 10, 2, 3, P.leafSh); });
    // the piece she's placing now: a second plant, ghosted with the placement diamond
    var gp = iso(4.6, 5.4); poly([iso(4.2, 5.0), iso(5.0, 5.0), iso(5.0, 5.8), iso(4.2, 5.8)], 'rgba(140,192,106,.35)', '#8cc06a');
    c.globalAlpha = .75 + .15 * Math.sin(t); R(gp[0] - 5, gp[1] - 10, 10, 10, '#c9a27a'); for (var f2 = 0; f2 < 5; f2++) { var a2 = -Math.PI / 2 + (f2 - 2) * .55; c.fillStyle = f2 % 2 ? P.leaf : P.leafSh; c.beginPath(); c.ellipse(gp[0] + Math.cos(a2) * 8, gp[1] - 15 + Math.sin(a2) * 7, 6, 2.5, a2, 0, 7); c.fill(); } c.globalAlpha = 1;
  }
  function finger(px, py) { c.fillStyle = 'rgba(255,255,255,.45)'; c.beginPath(); c.arc(px, py, 7, 0, 7); c.fill(); c.strokeStyle = 'rgba(255,255,255,.95)'; c.stroke(); }
  function tray(W, H) {
    var y = H - 50;
    R(0, y - 2, W, 2, 'rgba(59,36,48,.25)'); R(0, y, W, 50, P.tray); R(0, y, W, 1, '#fffaf3');
    ['DECORATE', 'STYLE'].forEach(function (s, i) { var tx = 6 + i * 70, tw = i ? 52 : 66; R(tx, y + 5, tw, 12, i === 0 ? P.rose : P.trayEdge); if (i === 0) R(tx, y + 5, tw, 1, P.roseHi); txt(s, tx + tw / 2, y + 7, i === 0 ? '#fff' : P.trayInk, 7, 'center'); });
    txt('‹ PLANTS ›', W - 6, y + 7, P.trayInk, 7, 'right');
    var icons = [function (x, yy) { R(x + 10, yy + 12, 10, 8, '#d98a6f'); c.fillStyle = P.leaf; c.beginPath(); c.ellipse(x + 15, yy + 8, 9, 5, 0, 0, 7); c.fill(); c.fillStyle = P.leafHi; c.beginPath(); c.ellipse(x + 12, yy + 6, 4, 2, 0, 0, 7); c.fill(); },
      function (x, yy) { R(x + 10, yy + 12, 10, 8, '#c9a27a'); c.fillStyle = P.leafSh; for (var f = 0; f < 5; f++) { var a = -Math.PI / 2 + (f - 2) * .55; c.beginPath(); c.ellipse(x + 15 + Math.cos(a) * 6, yy + 8 + Math.sin(a) * 5, 5, 2, a, 0, 7); c.fill(); } },
      function (x, yy) { R(x + 6, yy + 2, 18, 3, '#8e5a37'); for (var v = 0; v < 4; v++) R(x + 8 + v * 4, yy + 5, 2, 8 + v % 2 * 5, v % 2 ? P.leaf : P.leafSh); },
      function (x, yy) { R(x + 11, yy + 10, 8, 10, '#7fa7a0'); R(x + 13, yy + 2, 2, 9, P.leafSh); R(x + 16, yy + 4, 2, 7, P.leafSh); R(x + 12, yy, 4, 3, '#e46f8b'); R(x + 16, yy + 2, 4, 3, '#ffd56b'); },
      function (x, yy) { R(x + 9, yy + 13, 12, 7, '#b9505a'); c.fillStyle = '#5c9046'; c.beginPath(); c.moveTo(x + 15, yy); c.lineTo(x + 22, yy + 14); c.lineTo(x + 8, yy + 14); c.closePath(); c.fill(); }];
    for (var i = 0; i < 5; i++) {
      var sx = 5 + i * 46.5, sy = y + 21;
      R(sx, sy, 43, 25, i === 1 ? '#fde3ea' : '#fbeedd'); R(sx, sy + 24, 43, 1, P.trayEdge);
      if (i === 1) { c.strokeStyle = P.rose; c.lineWidth = 2; c.strokeRect(sx + 1, sy + 1, 41, 23); c.lineWidth = 1; }
      icons[i](sx + 6, sy + 2);
      R(sx + 25, sy + 15, 17, 8, '#e8f3dd'); txt('FREE', sx + 26, sy + 17, '#437a47', 4);
    }
  }
  function gigBanner(W, t) {
    card(4, 4, W - 8, 62);
    portrait(9, 9, 24, t);
    txt('FOR DOT', 38, 9, P.soft, 5);
    vt('A reading corner that feels like fall', 38, 15, P.trayInk, 11);
    var x = 38; x += tag(x, 29, 'plants', true) + 3; x += tag(x, 29, 'warm colors', true) + 3; tag(x, 29, 'books', false);
    vt('2 of 3 likes matched', 38, 45, '#437a47', 11);
    btn(W - 62, 44, 54, 'HAND IN', true, 15);
  }

  window.drawGig = function (ctx, W, H, t, st) {
    c = ctx; t = t || 0; st = st || 'offer';
    var g = c.createRadialGradient(W / 2, H * .45, 20, W / 2, H * .45, W); g.addColorStop(0, '#3a2633'); g.addColorStop(1, '#22171f'); c.fillStyle = g; c.fillRect(0, 0, W, H);
    OY = Math.round(H / 2) - 8;
    if (st === 'design') {
      room(t, true);
      var gp = iso(4.6, 5.4); finger(gp[0] + 4, gp[1] - 8);
      gigBanner(W, t);
      txt('DRAG TO PLACE · TAP TO TURN', W / 2, H - 64, 'rgba(255,241,226,.85)', 5, 'center');
      tray(W, H);
      return;
    }
    if (st === 'offer') {
      // her desk at home, dimmed behind the card
      room(t, false); R(0, 0, W, H, 'rgba(34,23,31,.55)');
      var w = 216, x = (W - w) / 2, y = 14, h = Math.min(H - 28, 278);
      card(x, y, w, h); R(x, y, w, 20, P.rose); R(x, y, w, 1, P.roseHi); txt('A GIG FOR YOU', x + w / 2, y + 7, '#fff', 7, 'center');
      portrait(x + 10, y + 28, 52, t);
      txt('DOT', x + 70, y + 30, P.trayInk, 8); vt('Your neighbor across the street', x + 70, y + 41, P.soft, 11);
      for (var i = 0; i < 5; i++) heart(x + 70 + i * 10, y + 58, i < 1); vt('Friends', x + 122, y + 54, P.soft, 11);
      R(x + 10, y + 88, w - 20, 1, P.trayEdge);
      txt('WHAT SHE WANTS', x + 10, y + 95, P.soft, 5);
      vt('"A reading corner that feels', x + 10, y + 103, P.o, 13); vt('like fall."', x + 10, y + 116, P.o, 13);
      txt('WHERE', x + 10, y + 136, P.soft, 5); vt('Her sunroom, by the big windows', x + 10, y + 143, P.trayInk, 12);
      txt('SHE LIKES', x + 10, y + 162, P.soft, 5);
      var tx = x + 10; tx += tag(tx, y + 170, 'plants') + 4; tx += tag(tx, y + 170, 'warm colors') + 4; tag(tx, y + 170, 'books');
      txt('PAY', x + 10, y + 192, P.soft, 5); coin(x + 10, y + 201); txt('100 TO 200', x + 21, y + 201, P.trayInk, 7); vt('More if she loves it', x + 108, y + 197, P.soft, 11);
      vt('Pieces are lent free. Your coins stay yours.', x + w / 2, y + 216, P.soft, 11, 'center');
      // three gigs to pick from today
      [0, 1, 2].forEach(function (k) { R(x + w / 2 - 14 + k * 10, y + h - 38, 6, 6, k === 0 ? P.rose : '#e8dccd'); });
      btn(x + 8, y + h - 26, 98, 'NOT NOW', false); btn(x + w - 106, y + h - 26, 98, 'ACCEPT', true);
      return;
    }
    // result
    room(t, true); R(0, 0, W, H, 'rgba(34,23,31,.5)');
    var w2 = 212, x2 = (W - w2) / 2, y2 = 18, h2 = 262;
    card(x2, y2, w2, h2); R(x2, y2, w2, 20, P.rose); R(x2, y2, w2, 1, P.roseHi); txt('DOT IS HAPPY', x2 + w2 / 2, y2 + 7, '#fff', 7, 'center');
    // a snapshot of her design, pinned on
    R(x2 + 50, y2 + 28, 112, 74, '#fbf4ea'); c.save(); c.beginPath(); c.rect(x2 + 54, y2 + 32, 104, 62); c.clip(); c.translate(x2 + 54 - 40, y2 + 32 - 40); c.scale(.6, .6); var sOY = OY; OY = 150; room(t, true); OY = sOY; c.restore();
    R(x2 + 98, y2 + 24, 16, 6, 'rgba(240,220,170,.85)');
    for (var k2 = 0; k2 < 3; k2++) heart(x2 + 70 + k2 * 26, y2 + 110, k2 < 2, 2);
    portrait(x2 + 10, y2 + 134, 34, t);
    vt('"Oh, it\'s just lovely, dear!', x2 + 50, y2 + 134, P.o, 12); vt('I was hoping for more books,', x2 + 50, y2 + 146, P.o, 12); vt('but I\'ll curl up here all fall."', x2 + 50, y2 + 158, P.o, 12);
    R(x2 + 10, y2 + 178, w2 - 20, 1, P.trayEdge);
    R(x2 + 26, y2 + 186, 70, 20, '#fbeedd'); coin(x2 + 34, y2 + 192); txt('+150', x2 + 46, y2 + 193, P.trayInk, 7);
    R(x2 + 104, y2 + 186, 82, 20, '#fde3ea'); heart(x2 + 112, y2 + 193, true); txt('+1', x2 + 124, y2 + 193, P.roseSh, 7); vt('Friends', x2 + 142, y2 + 189, P.soft, 11);
    vt('Hint: she likes books. Try again any time.', x2 + w2 / 2, y2 + 212, P.soft, 10, 'center');
    btn(x2 + 8, y2 + h2 - 26, 96, 'TRY AGAIN', false); btn(x2 + w2 - 104, y2 + h2 - 26, 96, 'DONE', true);
  };
})();
