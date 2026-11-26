// Sarah's Sim: Cooking mockup v1 (Nov 26, 2026), for spec 006 part B (action bubble), part C (meters) and part E (Cooking).
// All art drawn in code. Needs people-v1.js and ralph-v1.js loaded first.
// drawCooking(ctx, W, H, t, state):
//   'bubble'  the kitchen in Life mode. Keegan is cooking; she tapped him. His action bubble (Cook together first, A does it)
//             and his three need meters beside it, each with an icon and a word. Ralph turns up and stares.
//   'recipe'  the recipe card: the dish, what goes in (garden veggies marked), the steps and how each one plays. Swipe for the 9 dishes.
//   'sear'    one step of the minigame: hold on the pan to char the peppers. Keegan does the other half (the onion) beside her.
//             No timer and no fail: a step that's a bit off just means a little less sparkle.
//   'plated'  the dish is done: sparkles, the garden sparkle, the first-time memory book pop, and Serve puts it on the table.
(function () {
  var c, TW = 22, TH = 11, OX = 120, OY = 118, N = 9, WALL = 78;
  function iso(x, y) { return [OX + (x - y) * TW / 2, OY + (x + y) * TH / 2]; }
  function up(p, h) { return [p[0], p[1] - h]; }
  function poly(pts, fill, stroke) { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (var i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); if (fill) { c.fillStyle = fill; c.fill(); } if (stroke) { c.strokeStyle = stroke; c.lineWidth = 1; c.stroke(); } }
  function R(x, y, w, h, col) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
  function hash(i, j) { var h = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return h - Math.floor(h); }
  var INK = 'rgba(59,36,48,.85)';
  function box(x, y, w, d, h, cols, z) {
    z = z || 0; var A = up(iso(x, y), z), B = up(iso(x + w, y), z), C = up(iso(x + w, y + d), z), D = up(iso(x, y + d), z);
    poly([D, C, up(C, h), up(D, h)], cols[1]); poly([B, C, up(C, h), up(B, h)], cols[2]); poly([up(A, h), up(B, h), up(C, h), up(D, h)], cols[0]);
    poly([up(A, h), up(B, h), B, C, D, up(D, h)], null, INK);
  }
  var P = { tray: '#fff6ea', trayEdge: '#e8cdb4', trayInk: '#6b4250', soft: '#8e6670', rose: '#e46f8b', roseHi: '#f39bb0', roseSh: '#b44f63',
    sage: ['#a8cbc0', '#7fa7a0', '#5d8580'], wood: ['#e2b07e', '#c88d5a', '#9c6a40'], iron: ['#4a3f44', '#2f282c', '#1f1a1d'],
    leaf: '#6aa361', leafHi: '#8fc47b', leafSh: '#437a47', glow: 'rgba(255,214,140,' };
  function txt(s, x, y, col, size, align) { c.font = (size || 8) + 'px "Press Start 2P", monospace'; c.fillStyle = col; c.textAlign = align || 'left'; c.textBaseline = 'top'; c.fillText(s, x, y); }
  function vt(s, x, y, col, size, align) { c.font = (size || 10) + 'px "VT323", monospace'; c.fillStyle = col; c.textAlign = align || 'left'; c.textBaseline = 'top'; c.fillText(s, x, y); }
  function btn(x, y, w, s, on, h) { h = h || 16; R(x, y, w, h, on ? P.rose : '#fbeedd'); R(x, y + h - 1, w, 1, on ? P.roseSh : P.trayEdge); if (on) R(x, y, w, 1, P.roseHi); txt(s, x + w / 2, y + Math.round(h / 2) - 3, on ? '#fff' : P.trayInk, 6, 'center'); }
  function card(x, y, w, h, edge) { R(x + 2, y + 3, w, h, 'rgba(34,23,31,.35)'); R(x, y, w, h, P.tray); R(x, y + h - 1, w, 1, P.trayEdge); c.strokeStyle = edge || P.rose; c.lineWidth = 1; c.strokeRect(x + .5, y + .5, w - 1, h - 1); }
  function finger(px, py, press) { c.fillStyle = 'rgba(255,255,255,' + (press ? .6 : .45) + ')'; c.beginPath(); c.arc(px, py, press ? 7 : 8, 0, 7); c.fill(); c.strokeStyle = 'rgba(255,255,255,.95)'; c.stroke(); if (press) { c.strokeStyle = 'rgba(255,255,255,.5)'; c.beginPath(); c.arc(px, py, 12, 0, 7); c.stroke(); } }
  function star(x, y, r, col, sh) { c.fillStyle = sh; c.beginPath(); for (var p = 0; p < 10; p++) { var rr = p % 2 ? r * .45 : r, an = -Math.PI / 2 + p * Math.PI / 5; c.lineTo(x + Math.cos(an) * rr + 1, y + Math.sin(an) * rr + 1); } c.fill(); c.fillStyle = col; c.beginPath(); for (var q = 0; q < 10; q++) { var r2 = q % 2 ? r * .45 : r, a2 = -Math.PI / 2 + q * Math.PI / 5; c.lineTo(x + Math.cos(a2) * r2, y + Math.sin(a2) * r2); } c.fill(); }
  function sparkle(x, y, on, s) { s = s || 1; var col = on ? '#ffd56b' : '#e8dccd', sh = on ? '#e7a43a' : '#d6c6b4';
    [[sh, 1], [col, 0]].forEach(function (L) { c.fillStyle = L[0]; c.beginPath(); for (var p = 0; p < 8; p++) { var r = p % 2 ? 3 * s : 9 * s, an = -Math.PI / 2 + p * Math.PI / 4; c.lineTo(x + Math.cos(an) * r + L[1], y + Math.sin(an) * r + L[1]); } c.fill(); });
    if (on) R(x - 1, y - 4 * s, 2, 3 * s, '#fffbe0'); }
  function leafIcon(x, y) { c.fillStyle = P.leafSh; c.beginPath(); c.ellipse(x + 4, y + 4, 4, 2.5, -.6, 0, 7); c.fill(); c.fillStyle = P.leafHi; c.beginPath(); c.ellipse(x + 3.5, y + 3.5, 3, 1.6, -.6, 0, 7); c.fill(); R(x, y + 6, 2, 1, P.leafSh); }
  function bookIcon(x, y) { R(x, y, 14, 11, '#3b2430'); R(x + 1, y + 1, 12, 9, '#b9505a'); R(x + 1, y + 1, 12, 2, '#c9636b'); R(x + 6, y + 1, 2, 9, '#9e4049'); R(x + 9, y + 4, 3, 3, '#f3d38a'); }
  function ralph(px, py, s, flip) { // centered on its feet
    if (!window.RALPH_SIT) return; var rows = window.RALPH_SIT, pal = window.RALPH_PAL, w = rows[0].length;
    c.fillStyle = 'rgba(90,45,40,.25)'; c.beginPath(); c.ellipse(px, py, 10 * s, 3 * s, 0, 0, 7); c.fill();
    for (var j = 0; j < rows.length; j++) for (var i = 0; i < rows[j].length; i++) { var ch = rows[j][i]; if (ch === '.' || !pal[ch]) continue; c.fillStyle = pal[ch]; c.fillRect(Math.round(px - w * s / 2 + (flip ? w - 1 - i : i) * s), Math.round(py - rows.length * s + j * s), s, s); }
  }
  function steam(x, y, t, n, h) { for (var k = 0; k < (n || 3); k++) { var ph = ((t * 2 + k * 7) % 18) / 18; c.fillStyle = 'rgba(255,255,255,' + (.55 * (1 - ph)) + ')'; c.beginPath(); c.arc(x + k * 6 - 6 + Math.sin(ph * 6 + k) * 3, y - ph * (h || 22), 2.5 + ph * 3, 0, 7); c.fill(); } }

  // ---------- the kitchen in Life mode (iso, decorate-v1 look) ----------
  function kitchen(t) {
    var A = iso(0, 0), B = iso(N, 0), D = iso(0, N), C = iso(N, N);
    for (var j = 0; j < N; j++) for (var i = 0; i < N; i++) { var a = iso(i, j), b = iso(i + 1, j), cc = iso(i + 1, j + 1), d = iso(i, j + 1); poly([a, b, cc, d], (i + j) % 2 ? '#f3e6cf' : '#cfdcc9'); }
    c.strokeStyle = 'rgba(150,120,100,.25)'; for (var g = 0; g <= N; g++) { var s1 = iso(0, g), e1 = iso(N, g), s2 = iso(g, 0), e2 = iso(g, N); c.beginPath(); c.moveTo(s1[0], s1[1]); c.lineTo(e1[0], e1[1]); c.moveTo(s2[0], s2[1]); c.lineTo(e2[0], e2[1]); c.stroke(); }
    // walls: butter yellow with a cream wainscot
    poly([A, D, up(D, WALL), up(A, WALL)], '#f4dfa8'); poly([A, B, up(B, WALL), up(A, WALL)], '#e8cc8c');
    poly([A, D, up(D, 24), up(A, 24)], '#f6eedd'); poly([A, B, up(B, 24), up(A, 24)], '#e9dcc4');
    poly([up(A, 24), up(D, 24), up(D, 26), up(A, 26)], '#fff8ee'); poly([up(A, 24), up(B, 24), up(B, 26), up(A, 26)], '#f3e6d2');
    for (var y = .5; y < N; y += .5) { var p = iso(0, y); c.strokeStyle = 'rgba(180,150,120,.35)'; c.beginPath(); c.moveTo(p[0], p[1] - 2); c.lineTo(p[0], p[1] - 22); c.stroke(); }
    poly([up(A, WALL), up(D, WALL), up(D, WALL + 3), up(A, WALL + 3)], '#fff1e2'); poly([up(A, WALL), up(B, WALL), up(B, WALL + 3), up(A, WALL + 3)], '#f1dcc8');
    poly([D, C, [C[0], C[1] + 5], [D[0], D[1] + 5]], '#a8907a'); poly([B, C, [C[0], C[1] + 5], [B[0], B[1] + 5]], '#86705e');
    // window over the right wall, evening sky and the rowhouses across the street
    var w0 = iso(5.6, 0), w1 = iso(7.6, 0);
    poly([up(w0, 30), up(w1, 30), up(w1, 64), up(w0, 64)], '#fff1e2');
    poly([up([w0[0] + 2, w0[1] + 1], 32), up([w1[0] - 2, w1[1] - 1], 32), up([w1[0] - 2, w1[1] - 1], 62), up([w0[0] + 2, w0[1] + 1], 62)], '#e9a07a');
    poly([up([w0[0] + 2, w0[1] + 1], 32), up([w1[0] - 2, w1[1] - 1], 32), up([w1[0] - 2, w1[1] - 1], 44), up([w0[0] + 2, w0[1] + 1], 44)], '#9e5a4e');
    c.strokeStyle = '#fff1e2'; var wm = iso(6.6, 0); c.beginPath(); c.moveTo(wm[0], wm[1] - 32); c.lineTo(wm[0], wm[1] - 62); c.stroke();
    // upper cabinets and open shelf on the right wall
    [[.3, 1.9], [3.4, 1.9]].forEach(function (u) { var a0 = iso(u[0], 0), a1 = iso(u[0] + u[1], 0); poly([up(a0, 46), up(a1, 46), up(a1, 68), up(a0, 68)], P.sage[1], INK); poly([up(a0, 46), up(a1, 46), up(a1, 48), up(a0, 48)], P.sage[2]); var m = iso(u[0] + u[1] / 2, 0); c.strokeStyle = P.sage[2]; c.beginPath(); c.moveTo(m[0], m[1] - 47); c.lineTo(m[0], m[1] - 67); c.stroke(); R(m[0] - 3, m[1] - 52, 2, 1, '#e7bb4f'); R(m[0] + 2, m[1] - 52, 2, 1, '#e7bb4f'); });
    var h0 = iso(2.3, 0), h1 = iso(3.3, 0); poly([up(h0, 58), up(h1, 58), up(h1, 68), up(h0, 68)], '#d8c8b8', INK); poly([up(h0, 56), up(h1, 56), up(h1, 58), up(h0, 58)], '#b9a898');
    // fridge in the far left corner, with a cat drawing and a list on it
    box(0, .1, 1.1, 1.1, 66, ['#fbf4ea', '#efe3d2', '#e2d2bd']);
    var f = iso(.05, 1.2); R(f[0] + 1, f[1] - 42, 9, 1, '#c9b9a5'); R(f[0] + 4, f[1] - 33, 2, 12, '#b9a898'); R(f[0] + 4, f[1] - 52, 2, 7, '#b9a898');
    R(f[0] + 8, f[1] - 60, 6, 7, '#fff'); R(f[0] + 9, f[1] - 58, 4, 1, '#d9853f'); R(f[0] + 9, f[1] - 56, 3, 1, '#d9853f'); R(f[0] + 10, f[1] - 62, 2, 2, P.rose);
    // counter along the right wall with the stove
    box(1.3, .1, 1.2, 1, 22, [P.wood[0], P.sage[1], P.sage[2]]);
    box(2.5, .1, 1.2, 1, 22, ['#3b3236', '#8f8a86', '#77726e']);
    box(3.7, .1, 2.0, 1, 22, [P.wood[0], P.sage[1], P.sage[2]]);
    [[2.8, .4], [3.35, .4], [2.8, .8], [3.35, .8]].forEach(function (b, k) { var q = up(iso(b[0], b[1]), 22); c.fillStyle = k === 0 ? '#ff8a4a' : '#5a5054'; c.beginPath(); c.ellipse(q[0], q[1], 4, 2, 0, 0, 7); c.fill(); if (k === 0) { c.fillStyle = 'rgba(255,160,90,.35)'; c.beginPath(); c.ellipse(q[0], q[1], 7, 3.5, 0, 0, 7); c.fill(); } });
    // the pan on the front-left burner, steaming
    var pan = up(iso(2.8, .4), 24); c.fillStyle = P.iron[2]; c.beginPath(); c.ellipse(pan[0], pan[1], 7, 3.5, 0, 0, 7); c.fill(); c.fillStyle = P.iron[0]; c.beginPath(); c.ellipse(pan[0], pan[1] - 1, 6, 2.6, 0, 0, 7); c.fill();
    R(pan[0] - 3, pan[1] - 2, 2, 1, '#d2363c'); R(pan[0], pan[1] - 2, 2, 1, '#6aa361'); R(pan[0] + 2, pan[1] - 1, 2, 1, '#ffd56b'); R(pan[0] + 7, pan[1] - 1, 7, 2, P.iron[1]);
    steam(pan[0], pan[1] - 4, t, 3, 20);
    // a pot of herbs and a jar on the counter
    var hp = up(iso(4.6, .4), 22); R(hp[0] - 4, hp[1] - 6, 8, 6, '#d98a6f'); R(hp[0] - 4, hp[1] - 6, 8, 1, '#e8a28c'); c.fillStyle = P.leaf; c.beginPath(); c.arc(hp[0] - 2, hp[1] - 9, 3, 0, 7); c.arc(hp[0] + 2, hp[1] - 10, 3, 0, 7); c.fill(); c.fillStyle = P.leafHi; c.beginPath(); c.arc(hp[0] - 2, hp[1] - 10, 1.5, 0, 7); c.fill();
    var jr = up(iso(5.2, .4), 22); R(jr[0] - 3, jr[1] - 9, 6, 9, 'rgba(230,240,245,.8)'); R(jr[0] - 3, jr[1] - 11, 6, 2, '#c88d5a'); R(jr[0] - 2, jr[1] - 6, 4, 5, '#e2b07e');
    // table and two chairs
    box(4.7, 4.4, 1.0, 1.8, 2, ['#e2b07e', '#c88d5a', '#9c6a40'], 0);
    box(3.9, 4.7, .6, .6, 10, [P.rose, P.roseSh, '#9e4049']); box(3.9, 4.7, .12, .6, 12, [P.rose, P.roseSh, '#9e4049'], 10);
    [[4.75, 4.45], [5.6, 4.45], [4.75, 6.1], [5.6, 6.1]].forEach(function (l) { box(l[0], l[1], .1, .1, 15, P.wood); });
    box(4.6, 4.3, 1.2, 2.0, 3, ['#f0c488', '#c88d5a', '#9c6a40'], 15);
    var tc = up(iso(5.2, 5.3), 18); R(tc[0] - 8, tc[1] - 2, 16, 3, '#fff8ee'); R(tc[0] - 7, tc[1] - 1, 14, 1, '#e8dccd');
    // the vase on the table
    R(tc[0] + 8, tc[1] - 9, 4, 7, '#7fa7a0'); R(tc[0] + 7, tc[1] - 13, 3, 3, '#e46f8b'); R(tc[0] + 10, tc[1] - 14, 3, 3, '#ffd56b');
    box(6.0, 5.0, .6, .6, 10, [P.rose, P.roseSh, '#9e4049']); box(6.48, 5.0, .12, .6, 12, [P.rose, P.roseSh, '#9e4049'], 10);
    // lamp glow over the table
    var lg = up(iso(5.2, 5.3), 60), gr = c.createRadialGradient(lg[0], lg[1] + 30, 3, lg[0], lg[1] + 30, 60); gr.addColorStop(0, P.glow + '.28)'); gr.addColorStop(1, P.glow + '0)'); c.fillStyle = gr; c.fillRect(lg[0] - 70, lg[1] - 30, 140, 130);
    c.strokeStyle = '#6b4250'; c.beginPath(); c.moveTo(lg[0], OY - 40); c.lineTo(lg[0], lg[1]); c.stroke();
    c.fillStyle = '#f6c86e'; c.beginPath(); c.moveTo(lg[0] - 7, lg[1] + 6); c.lineTo(lg[0] + 7, lg[1] + 6); c.lineTo(lg[0] + 3, lg[1]); c.lineTo(lg[0] - 3, lg[1]); c.closePath(); c.fill();
  }
  function personShadow(px, py, w) { c.fillStyle = 'rgba(90,45,40,.25)'; c.beginPath(); c.ellipse(px, py, w / 2, w / 5, 0, 0, 7); c.fill(); }
  function topBar(W, time) {
    R(4, 4, 92, 15, 'rgba(255,246,234,.95)'); R(4, 18, 92, 1, P.trayEdge); R(8, 8, 7, 7, '#ffb760'); R(9, 9, 3, 2, '#ffd9a0');
    txt(time, 19, 8, P.trayInk, 8);
    R(W - 56, 4, 52, 15, 'rgba(255,246,234,.95)'); R(W - 56, 18, 52, 1, P.trayEdge);
    c.fillStyle = '#ffd56b'; c.beginPath(); c.arc(W - 47, 11.5, 4, 0, 7); c.fill(); c.fillStyle = '#fff3a8'; c.fillRect(W - 49, 9, 2, 2);
    txt('120', W - 39, 8, P.trayInk, 8);
  }
  // need icons, 9 x 9
  function moon(x, y) { c.fillStyle = '#8fa6d8'; c.beginPath(); c.arc(x + 4.5, y + 4.5, 4.5, 0, 7); c.fill(); c.fillStyle = P.tray; c.beginPath(); c.arc(x + 6.5, y + 3, 3.8, 0, 7); c.fill(); }
  function bowl(x, y) { R(x, y + 4, 9, 1, '#6b4250'); R(x + 1, y + 5, 7, 2, '#e46f6a'); R(x + 2, y + 7, 5, 1, '#b44f63'); R(x + 2, y + 2, 5, 2, '#f3d38a'); R(x + 3, y, 1, 2, 'rgba(160,140,140,.6)'); R(x + 5, y - 1, 1, 2, 'rgba(160,140,140,.6)'); }
  function funStar(x, y) { star(x + 4.5, y + 4.5, 5, '#ffd56b', '#e7a43a'); }
  function meters(x, y, who, vals, words) {
    card(x, y, 88, 62, P.sage[1]);
    txt(who, x + 6, y + 5, P.trayInk, 6);
    [[moon, 'ENERGY'], [bowl, 'HUNGER'], [funStar, 'FUN']].forEach(function (m, i) {
      var yy = y + 17 + i * 14; m[0](x + 6, yy);
      vt(m[1], x + 18, yy - 2, P.trayInk, 11);
      R(x + 50, yy + 1, 33, 7, '#3b2430'); R(x + 51, yy + 2, 31, 5, '#e8dccd'); var v = vals[i]; R(x + 51, yy + 2, Math.round(31 * v), 5, v < .3 ? '#f2a65a' : '#8cc06a'); R(x + 51, yy + 2, Math.round(31 * v), 1, v < .3 ? '#ffd0a0' : '#c4e39a');
      if (words[i]) vt(words[i], x + 82, yy + 6, P.soft, 9, 'right');
    });
  }
  function bubble(x, y, w, tipX, tipY, items, sel, t) {
    var h = 18 + Math.ceil(items.length / 2) * 22 + 4;
    card(x, y, w, h);
    c.fillStyle = P.tray; c.beginPath(); c.moveTo(tipX - 6, y + h - 1); c.lineTo(tipX + 6, y + h - 1); c.lineTo(tipX, tipY); c.closePath(); c.fill();
    c.strokeStyle = P.rose; c.beginPath(); c.moveTo(tipX - 6, y + h - .5); c.lineTo(tipX, tipY); c.lineTo(tipX + 6, y + h - .5); c.stroke();
    R(tipX - 5, y + h - 1, 11, 1, P.tray);
    txt('KEEGAN · COOKING', x + 6, y + 6, P.soft, 5);
    items.forEach(function (it, i) {
      var bw = (w - 14) / 2, bx = x + 5 + (i % 2) * (bw + 4), by = y + 16 + Math.floor(i / 2) * 22;
      R(bx, by, bw, 19, i === sel ? P.rose : '#fbeedd'); R(bx, by + 18, bw, 1, i === sel ? P.roseSh : P.trayEdge); if (i === sel) R(bx, by, bw, 1, P.roseHi);
      it[0](bx + 4, by + 5, i === sel);
      txt(it[1], bx + 17, by + (it[2] ? 3 : 7), i === sel ? '#fff' : P.trayInk, 5); if (it[2]) txt(it[2], bx + 17, by + 11, i === sel ? '#fff' : P.trayInk, 5);
      if (i === sel) { R(bx + bw - 10, by - 5, 12, 12, '#3b2430'); R(bx + bw - 9, by - 4, 10, 10, '#e46f8b'); txt('A', bx + bw - 7, by - 2, '#fff', 6); }
    });
    return h;
  }
  function panIcon(x, y, on) { R(x, y + 3, 9, 5, on ? '#fff' : P.iron[0]); R(x + 9, y + 4, 4, 2, on ? '#fff' : P.iron[1]); R(x + 1, y + 2, 7, 1, on ? '#ffd9e2' : '#6a5f64'); R(x + 2, y - 1, 1, 2, on ? '#fff' : '#b9a898'); R(x + 5, y - 2, 1, 2, on ? '#fff' : '#b9a898'); }
  function chatIcon(x, y, on) { R(x, y, 11, 7, on ? '#fff' : '#7fa7a0'); R(x + 2, y + 7, 2, 2, on ? '#fff' : '#7fa7a0'); R(x + 2, y + 3, 2, 1, on ? P.rose : '#fff'); R(x + 5, y + 3, 2, 1, on ? P.rose : '#fff'); R(x + 8, y + 3, 1, 1, on ? P.rose : '#fff'); }
  function hugIcon(x, y, on) { var col = on ? '#fff' : '#f2a65a'; c.fillStyle = col; c.beginPath(); c.arc(x + 3, y + 3, 2.5, 0, 7); c.arc(x + 8, y + 3, 2.5, 0, 7); c.fill(); R(x, y + 5, 11, 4, col); }
  function heartIcon(x, y, on) { var col = on ? '#fff' : P.rose; c.fillStyle = col; c.beginPath(); c.arc(x + 3, y + 3, 3, 0, 7); c.arc(x + 8, y + 3, 3, 0, 7); c.moveTo(x, y + 4); c.lineTo(x + 5.5, y + 10); c.lineTo(x + 11, y + 4); c.fill(); }

  // ---------- the counter close-up (recipe, sear, plated) ----------
  function counterScene(W, H, t, opts) {
    var ct = H - 104; // counter top line
    // wall with cream subway tile and a rail of mugs
    R(0, 0, W, ct, '#f4dfa8');
    for (var y = 44, row = 0; y < ct; y += 8, row++) for (var x = (row % 2) * -8; x < W; x += 16) { R(x, y, 15, 7, '#fbf4ea'); R(x, y + 6, 15, 1, '#e9dcc4'); R(x, y, 15, 1, '#fffaf3'); }
    R(0, 40, W, 4, '#fff1e2'); R(0, 43, W, 1, '#e9dcc4');
    // a rail of utensils and a little framed print of the cats
    var ry = Math.max(96, ct - 150); R(14, ry, 92, 3, '#b9a898'); R(14, ry, 92, 1, '#e9dcc4');
    [[22, 'ladle'], [40, 'spat'], [58, 'whisk'], [76, 'spoon'], [92, 'ladle']].forEach(function (u) { var x = u[0]; R(x, ry + 3, 1, 4, '#6b4250');
      if (u[1] === 'ladle') { R(x, ry + 7, 2, 18, '#8e8a90'); R(x - 3, ry + 25, 8, 5, '#8e8a90'); R(x - 2, ry + 25, 6, 1, '#d6dde2'); }
      if (u[1] === 'spat') { R(x, ry + 7, 2, 14, '#c88d5a'); R(x - 3, ry + 21, 8, 9, '#3b3236'); R(x - 2, ry + 22, 1, 7, '#5a5054'); }
      if (u[1] === 'whisk') { R(x, ry + 7, 2, 8, '#c88d5a'); c.strokeStyle = '#d6dde2'; c.beginPath(); c.ellipse(x + 1, ry + 22, 4, 8, 0, 0, 7); c.ellipse(x + 1, ry + 22, 1.5, 8, 0, 0, 7); c.stroke(); }
      if (u[1] === 'spoon') { R(x, ry + 7, 2, 16, '#e2b07e'); c.fillStyle = '#e2b07e'; c.beginPath(); c.ellipse(x + 1, ry + 26, 3, 4, 0, 0, 7); c.fill(); } });
    var fx = 176, fy = ry - 6; R(fx, fy, 40, 32, '#c88d5a'); R(fx + 3, fy + 3, 34, 26, '#fbf4ea'); R(fx + 3, fy + 22, 34, 7, '#e8dccd');
    c.fillStyle = '#e8963f'; c.beginPath(); c.ellipse(fx + 13, fy + 19, 6, 5, 0, 0, 7); c.fill(); R(fx + 8, fy + 12, 3, 3, '#e8963f'); R(fx + 15, fy + 12, 3, 3, '#e8963f');
    c.fillStyle = '#8a8590'; c.beginPath(); c.ellipse(fx + 27, fy + 19, 6, 5, 0, 0, 7); c.fill(); R(fx + 22, fy + 12, 3, 3, '#8a8590'); R(fx + 29, fy + 12, 3, 3, '#8a8590');
    c.fillStyle = P.rose; c.beginPath(); c.arc(fx + 19, fy + 9, 1.6, 0, 7); c.arc(fx + 21, fy + 9, 1.6, 0, 7); c.fill();
    // open shelf with jars and a plant
    R(10, 30, 120, 4, P.wood[1]); R(10, 33, 120, 1, P.wood[2]);
    [[16, '#e2b07e', 12], [30, '#c9636b', 10], [42, '#f3d38a', 12], [58, '#8fc47b', 9]].forEach(function (j) { R(j[0], 30 - j[2], 10, j[2], 'rgba(230,240,245,.85)'); R(j[0] + 1, 30 - j[2] + 4, 8, j[2] - 5, j[1]); R(j[0], 30 - j[2] - 2, 10, 2, P.wood[1]); });
    R(84, 20, 12, 10, '#d98a6f'); R(84, 20, 12, 2, '#e8a28c'); c.fillStyle = P.leaf; [[86, 14], [92, 12], [96, 18], [82, 18], [89, 8]].forEach(function (l) { c.beginPath(); c.ellipse(l[0], l[1], 4, 2.5, .5, 0, 7); c.fill(); });
    c.fillStyle = P.leafHi; c.beginPath(); c.ellipse(90, 11, 2, 1.2, .5, 0, 7); c.fill();
    // Keegan, behind the counter on the right, cooking his half
    if (opts.keegan && window.SS_KEEGAN) {
      var kx = 146, ky = ct - 88, bob = (opts.chop && t % 2) ? 1 : 0;
      window.SS_KEEGAN(c, kx, ky + bob, 3, t, false);
    }
    // the counter: butcher block top, sage cabinets
    R(0, ct, W, 10, P.wood[0]); R(0, ct, W, 2, '#f0c896'); R(0, ct + 9, W, 2, P.wood[2]);
    for (var bx = 0; bx < W; bx += 13) R(bx, ct + 2, 1, 7, 'rgba(156,106,64,.35)');
    R(0, ct + 11, W, H - ct - 11, P.sage[1]);
    [[4, 70], [80, 80], [166, 70]].forEach(function (d) { R(d[0], ct + 16, d[1], H - ct - 20, P.sage[0]); R(d[0] + 3, ct + 19, d[1] - 6, H - ct - 26, P.sage[1]); R(d[0] + d[1] / 2 - 6, ct + 22, 12, 2, '#e7bb4f'); });
    // Ralph sits on the floor in front, staring up at the food
    if (opts.ralph) ralph(40, H - (opts.footer ? 28 : 2), 2, false);
  }
  function stove(cx, cy, heat, t) { // a burner set into the counter top
    R(cx - 56, cy - 4, 112, 12, '#3b3236'); R(cx - 56, cy - 4, 112, 2, '#5a5054');
    c.fillStyle = heat ? 'rgba(255,120,60,' + (.55 + .15 * Math.sin(t)) + ')' : '#5a5054'; c.beginPath(); c.ellipse(cx, cy + 2, 30, 4, 0, 0, 7); c.fill();
  }
  function bigPan(cx, cy, charA, t) { // cast-iron pan with peppers and onion; charA 0..1
    c.fillStyle = 'rgba(30,20,25,.4)'; c.beginPath(); c.ellipse(cx + 2, cy + 6, 46, 14, 0, 0, 7); c.fill();
    R(cx - 82, cy - 3, 40, 6, P.iron[1]); R(cx - 82, cy - 3, 40, 2, P.iron[0]); R(cx - 86, cy - 4, 6, 8, P.iron[2]);
    c.fillStyle = P.iron[2]; c.beginPath(); c.ellipse(cx, cy, 44, 15, 0, 0, 7); c.fill();
    c.fillStyle = P.iron[1]; c.beginPath(); c.ellipse(cx, cy - 2, 40, 12, 0, 0, 7); c.fill();
    c.fillStyle = '#3a3236'; c.beginPath(); c.ellipse(cx, cy - 1, 36, 10, 0, 0, 7); c.fill();
    var cols = ['#d2363c', '#e4542f', '#6aa361', '#ffd56b', '#f6ead0', '#d2363c', '#6aa361', '#f39f3a', '#f6ead0', '#d2363c', '#ffd56b', '#6aa361', '#e4542f', '#f6ead0'];
    for (var k = 0; k < 14; k++) {
      var a = hash(k, 3) * 6.28, r = 6 + hash(k, 9) * 24, px = cx + Math.cos(a) * r, py = cy - 1 + Math.sin(a) * r * .3, j = (t + k) % 3 === 0 ? -1 : 0;
      c.save(); c.translate(px, py + j); c.rotate(hash(k, 5) * 3 - 1.5); R(-6, -1.5, 12, 3, cols[k]); R(-6, -1.5, 12, 1, 'rgba(255,255,255,.3)');
      if (charA > .25) { R(-3, -1, 2, 2, 'rgba(40,25,25,' + Math.min(.8, charA) + ')'); if (charA > .5) R(2, 0, 2, 1, 'rgba(40,25,25,' + Math.min(.8, charA) + ')'); }
      c.restore();
    }
    // sizzle dots
    for (var s = 0; s < 8; s++) { var ph = (t * 3 + s * 5) % 10; R(cx - 30 + s * 8 + (ph % 3), cy - 10 - ph, 1, 1, 'rgba(255,240,220,' + (1 - ph / 10) + ')'); }
    steam(cx - 10, cy - 12, t, 4, 34);
  }
  function board(x, y, t, onionCut) { // Keegan's cutting board: half an onion and the knife
    R(x, y, 62, 8, '#d9a46e'); R(x, y, 62, 2, '#eac08e'); R(x, y + 7, 62, 1, '#9c6a40'); R(x + 56, y + 2, 4, 3, '#9c6a40');
    c.fillStyle = '#efe0f0'; c.beginPath(); c.ellipse(x + 18, y, 10, 6, 0, Math.PI, 0); c.fill(); c.strokeStyle = '#c8a6d8'; c.beginPath(); c.ellipse(x + 18, y, 7, 4, 0, Math.PI, 0); c.stroke(); c.beginPath(); c.ellipse(x + 18, y, 4, 2, 0, Math.PI, 0); c.stroke();
    for (var k = 0; k < onionCut; k++) { R(x + 32 + k * 4, y - 2, 3, 2, '#efe0f0'); R(x + 32 + k * 4, y - 2, 3, 1, '#c8a6d8'); }
    var kb = t % 2 ? -3 : 0; R(x + 44, y - 8 + kb, 14, 2, '#d6dde2'); R(x + 44, y - 8 + kb, 14, 1, '#f2f5f7'); R(x + 56, y - 9 + kb, 8, 4, '#3b2430');
  }
  function nachos(cx, cy, s, garden, t) { // the finished pan of nachos, seen from a little above
    c.fillStyle = 'rgba(30,20,25,.35)'; c.beginPath(); c.ellipse(cx + 2, cy + 5 * s, 30 * s, 10 * s, 0, 0, 7); c.fill();
    c.fillStyle = P.iron[2]; c.beginPath(); c.ellipse(cx, cy, 28 * s, 10 * s, 0, 0, 7); c.fill(); R(cx + 26 * s, cy - 2 * s, 14 * s, 4 * s, P.iron[1]);
    c.fillStyle = P.iron[0]; c.beginPath(); c.ellipse(cx, cy - 1 * s, 25 * s, 8 * s, 0, 0, 7); c.fill();
    for (var k = 0; k < 22; k++) { // chips
      var a = hash(k, 1) * 6.28, r = hash(k, 2) * 20 * s, px = cx + Math.cos(a) * r, py = cy - 2 * s + Math.sin(a) * r * .32 - hash(k, 4) * 3 * s;
      c.fillStyle = k % 3 ? '#f0c060' : '#e2a840'; c.beginPath(); c.moveTo(px, py - 5 * s); c.lineTo(px + 5 * s, py + 2 * s); c.lineTo(px - 5 * s, py + 2 * s); c.closePath(); c.fill();
      c.fillStyle = 'rgba(255,240,190,.55)'; c.fillRect(px - 1 * s, py - 3 * s, 1 * s, 2 * s);
    }
    c.fillStyle = '#ffcf4a'; for (var m = 0; m < 9; m++) { var mx = cx - 16 * s + m * 4 * s, my = cy - 3 * s + Math.sin(m * 1.7) * 3 * s; c.beginPath(); c.ellipse(mx, my, 4 * s, 1.6 * s, .3, 0, 7); c.fill(); R(mx, my, 1 * s, 3 * s, '#ffcf4a'); }
    [[-10, -4, '#c94a3a'], [6, -1, '#c94a3a'], [14, -5, '#c94a3a'], [-4, 1, '#c94a3a']].forEach(function (d) { c.fillStyle = d[2]; c.beginPath(); c.arc(cx + d[0] * s, cy + d[1] * s, 2 * s, 0, 7); c.fill(); });
    [[-14, -1], [-2, -6], [10, 1], [18, -2], [2, -2]].forEach(function (d, i) { R(cx + d[0] * s, cy + d[1] * s, 3 * s, 1.5 * s, i % 2 ? '#6aa361' : '#d2363c'); });
    [[-7, -2], [9, -4], [-12, -6], [15, 0]].forEach(function (d) { R(cx + d[0] * s, cy + d[1] * s, 2.5 * s, 2.5 * s, '#f6ead0'); R(cx + d[0] * s, cy + d[1] * s, 2.5 * s, 1 * s, '#fffaf0'); });
    [[-1, -8], [5, -7]].forEach(function (d) { R(cx + d[0] * s, cy + d[1] * s, 2 * s, 1 * s, '#8fc47b'); });
    steam(cx, cy - 8 * s, t, 3, 14 * s);
  }
  function stepHeader(W, title, n, of, word) {
    card(4, 4, W - 8, 38);
    // step dots
    for (var i = 0; i < of; i++) { var x = 10 + i * 10; R(x, 10, 7, 7, i < n - 1 ? '#8cc06a' : (i === n - 1 ? P.rose : '#e8dccd')); if (i < n - 1) { R(x + 2, 13, 1, 1, '#fff'); R(x + 3, 14, 1, 1, '#fff'); R(x + 4, 12, 1, 2, '#fff'); } }
    txt('STEP ' + n + ' OF ' + of, 10 + of * 10 + 4, 10, P.soft, 6);
    txt(title, 10, 26, P.trayInk, 7);
    if (word) { R(W - 66, 23, 56, 13, '#e8f3dd'); R(W - 66, 35, 56, 1, '#b9d8a0'); txt(word, W - 38, 27, '#437a47', 5, 'center'); }
  }
  function footer(W, H, hint) {
    R(0, H - 26, W, 26, 'rgba(255,246,234,.96)'); R(0, H - 27, W, 1, P.trayEdge);
    vt(hint, 8, H - 21, P.trayInk, 12);
  }
  function charGauge(x, y, w, v) { // raw → just right → toasty, with the sweet spot marked
    R(x, y, w, 10, '#3b2430');
    var g = c.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, '#f6ead0'); g.addColorStop(.45, '#f2a65a'); g.addColorStop(.75, '#b8642a'); g.addColorStop(1, '#55311d'); c.fillStyle = g; c.fillRect(x + 1, y + 1, w - 2, 8);
    R(x + w * .52, y - 2, 1, 14, '#fff'); R(x + w * .74, y - 2, 1, 14, '#fff'); R(x + w * .52, y - 3, w * .22 + 1, 1, '#fff');
    var px = x + 1 + (w - 3) * v; R(px - 2, y - 4, 5, 18, '#3b2430'); R(px - 1, y - 3, 3, 16, '#fff');
    vt('RAW', x, y + 12, P.soft, 10); vt('JUST RIGHT', x + w * .63, y + 12, '#437a47', 10, 'center'); vt('TOASTY', x + w, y + 12, P.soft, 10, 'right');
  }
  function speech(x, y, s, tailX) { c.font = '11px "VT323", monospace'; var w = Math.ceil(c.measureText(s).width) + 10; R(x, y, w, 14, '#fff'); R(x, y + 13, w, 1, P.trayEdge); c.strokeStyle = '#3b2430'; c.strokeRect(x + .5, y + .5, w - 1, 13); R(tailX, y + 13, 4, 2, '#fff'); R(tailX + 1, y + 15, 2, 2, '#fff'); R(tailX - 1, y + 14, 1, 2, '#3b2430'); R(tailX + 4, y + 14, 1, 2, '#3b2430'); vt(s, x + 5, y + 1, '#3b2430', 11); }

  // ---------- states ----------
  function stateBubble(W, H, t) {
    OY = H - 26 - 99 - 14; kitchen(t);
    var ralphP = iso(1.7, 2.3); ralph(ralphP[0], ralphP[1], 1, true);
    var k = iso(2.9, 1.5); personShadow(k[0], k[1], 18); if (window.SS_KEEGAN) window.SS_KEEGAN(c, k[0] - 10, k[1] - 42, 1, t, false);
    var s = iso(4.6, 2.2); personShadow(s[0], s[1], 16); if (window.SS_SARAH) window.SS_SARAH(c, s[0] - 9, s[1] - 38, 1, t, false, null, 'bun');
    topBar(W, 'SAT 6:10');
    var by = 24, bh = bubble(4, by, 144, k[0] - 1, k[1] - 46, [[panIcon, 'COOK', 'TOGETHER'], [chatIcon, 'CHAT'], [hugIcon, 'HUG'], [heartIcon, 'KISS']], 0, t);
    meters(W - 92, by + 2, 'KEEGAN', [.8, .62, .7], ['', '', '']);
    finger(k[0] + 4, k[1] - 20, false);
    footer(W, H, 'A  Cook together     B  Close');
  }
  function stateRecipe(W, H, t) {
    counterScene(W, H, t, { keegan: true, ralph: true });
    R(0, 0, W, H, 'rgba(34,23,31,.45)');
    var w = 224, x = (W - w) / 2, y = 8, h = Math.min(H - 16, 296);
    card(x, y, w, h); R(x, y, w, 22, P.rose); R(x, y, w, 1, P.roseHi);
    txt('‹', x + 8, y + 8, '#fff', 8); txt('›', x + w - 16, y + 8, '#fff', 8);
    txt('CHICKEN NACHOS', x + w / 2, y + 8, '#fff', 7, 'center');
    vt('Recipe 5 of 9 · swipe for more', x + w / 2, y + 24, P.soft, 11, 'center');
    // the dish, small
    R(x + 8, y + 38, 82, 58, '#fbeedd'); nachos(x + 49, y + 74, 1.25, true, t);
    // what goes in
    txt('WHAT GOES IN', x + 98, y + 40, P.trayInk, 5);
    var ing = [['Chips'], ['Chicken'], ['Peppers and onion', 1], ['Beans'], ['Cheese'], ['Salsa']];
    ing.forEach(function (g, i) { var yy = y + 50 + i * 9; R(x + 99, yy + 4, 3, 3, g[1] ? P.leaf : '#d6c6b4'); vt(g[0], x + 105, yy - 1, P.trayInk, 11); if (g[1]) leafIcon(x + 105 + c.measureText(g[0]).width + 3, yy + 1); });
    R(x + 98, y + 106, 118, 14, '#e8f3dd'); R(x + 98, y + 119, 118, 1, '#b9d8a0'); leafIcon(x + 102, y + 109); vt('From your garden', x + 114, y + 107, '#437a47', 11);
    // the steps, each with how it plays
    R(x + 8, y + 128, w - 16, 1, P.trayEdge);
    txt('STEPS', x + 8, y + 134, P.trayInk, 5); vt('with Keegan', x + 44, y + 131, P.soft, 11);
    var steps = [['Char the peppers', 'HOLD'], ['Season the chicken', 'STIR'], ['Layer the pan', 'STACK'], ['Melt the cheese', 'HOLD']];
    steps.forEach(function (st, i) {
      var yy = y + 146 + i * 20; R(x + 8, yy, w - 16, 17, i % 2 ? '#fbeedd' : '#fff1e2');
      R(x + 11, yy + 3, 11, 11, P.rose); txt(String(i + 1), x + 14, yy + 5, '#fff', 6);
      vt(st[0], x + 27, yy + 2, P.trayInk, 12);
      R(x + w - 52, yy + 3, 40, 11, '#fff'); c.strokeStyle = P.trayEdge; c.strokeRect(x + w - 51.5, yy + 3.5, 39, 10); txt(st[1], x + w - 32, yy + 6, P.soft, 5, 'center');
    });
    vt('No timer. Every try makes the dish.', x + w / 2, y + 228, P.soft, 11, 'center');
    btn(x + 8, y + h - 26, 98, 'BACK', false, 18); btn(x + w - 106, y + h - 26, 98, 'COOK', true, 18);
  }
  function stateSear(W, H, t) {
    counterScene(W, H, t, { keegan: true, ralph: true, chop: true, footer: true });
    var ct = H - 104; stove(84, ct + 2, true, t);
    var v = .58 + .02 * Math.sin(t);
    bigPan(84, ct - 4, v, t);
    board(162, ct - 2, t, 4);
    finger(118, ct - 6, true);
    speech(108, ct - 122, 'Smells so good!', 166);
    stepHeader(W, 'CHAR THE PEPPERS', 1, 4, 'NICE CHAR');
    R(8, 48, W - 16, 30, 'rgba(255,246,234,.92)'); R(8, 77, W - 16, 1, P.trayEdge);
    charGauge(16, 52, W - 32, v);
    footer(W, H, 'Hold the pan. Let go when it looks right.');
  }
  function statePlated(W, H, t) {
    counterScene(W, H, t, { keegan: true, ralph: true });
    R(0, 0, W, H, 'rgba(34,23,31,.45)');
    // the memory book pop slides in at the top (spec 007)
    card(8, 6, W - 16, 26, '#b9505a'); bookIcon(14, 13);
    txt('KITCHEN', 34, 11, '#b9505a', 5); vt('Chicken nachos, the first time', 34, 17, P.trayInk, 11);
    var w = 208, x = (W - w) / 2, y = 42, h = 220;
    card(x, y, w, h); R(x, y, w, 20, P.rose); R(x, y, w, 1, P.roseHi); txt('CHICKEN NACHOS!', x + w / 2, y + 7, '#fff', 7, 'center');
    R(x + 10, y + 26, w - 20, 78, '#fbeedd'); nachos(x + w / 2 - 4, y + 72, 1.8, true, t);
    [0, 1, 2].forEach(function (k) { sparkle(x + 64 + k * 40, y + 120 + (k === 1 ? -3 : 0), true, (t + k * 2) % 6 === 0 ? 1.1 : 1); });
    txt('SO GOOD', x + w / 2, y + 136, P.trayInk, 7, 'center');
    R(x + 34, y + 150, w - 68, 16, '#e8f3dd'); R(x + 34, y + 165, w - 68, 1, '#b9d8a0'); sparkle(x + 44, y + 158, true, .5); leafIcon(x + 52, y + 154); vt('Garden sparkle', x + 64, y + 151, '#437a47', 12);
    bowl(x + 40, y + 175); vt('Fills hunger for you both', x + 54, y + 172, P.soft, 11);
    btn(x + 8, y + h - 26, 92, 'COOK AGAIN', false, 18); btn(x + w - 100, y + h - 26, 92, 'SERVE', true, 18);
  }

  window.drawCooking = function (ctx, W, H, t, st) {
    c = ctx; t = t || 0; st = st || 'bubble';
    c.fillStyle = '#22171f'; c.fillRect(0, 0, W, H);
    if (st === 'bubble') stateBubble(W, H, t);
    else if (st === 'recipe') stateRecipe(W, H, t);
    else if (st === 'sear') stateSear(W, H, t);
    else statePlated(W, H, t);
  };
})();
