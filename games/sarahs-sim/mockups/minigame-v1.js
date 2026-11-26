// Sarah's Sim: Minigame frame mockup v1 (Nov 26, 2026), for spec 005 part D. All art drawn in code.
// drawMinigame(ctx, W, H, t, state):
//   'mow'    the sample chore: drag the mower in stripes. Progress bar with icon and word, no timer, Done any time.
//   'vacuum' the same frame indoors: drag over the dust; Ralph slowly leaves the room.
//   'done'   the end card: tidy rating in sparkles, coins (Life mode, once a day), play again or back.
// Needs ralph-v1.js loaded first for Ralph.
(function () {
  var c, TW = 40, TH = 20, OX = 120, OY = 70, N = 6;
  function iso(x, y) { return [OX + (x - y) * TW / 2, OY + (x + y) * TH / 2]; }
  function poly(pts, fill, stroke) { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (var i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); if (fill) { c.fillStyle = fill; c.fill(); } if (stroke) { c.strokeStyle = stroke; c.lineWidth = 1; c.stroke(); } }
  function up(p, h) { return [p[0], p[1] - h]; }
  function R(x, y, w, h, col) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
  function hash(i, j) { var h = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return h - Math.floor(h); }
  var INK = 'rgba(59,36,48,.85)';
  function box(x, y, w, d, h, cols, z) {
    z = z || 0; var A = up(iso(x, y), z), B = up(iso(x + w, y), z), C = up(iso(x + w, y + d), z), D = up(iso(x, y + d), z);
    poly([D, C, up(C, h), up(D, h)], cols[1]); poly([B, C, up(C, h), up(B, h)], cols[2]); poly([up(A, h), up(B, h), up(C, h), up(D, h)], cols[0]);
    poly([up(A, h), up(B, h), B, C, D, up(D, h)], null, INK);
  }
  var P = { tray: '#fff6ea', trayEdge: '#e8cdb4', trayInk: '#6b4250', rose: '#e46f8b', roseHi: '#f39bb0', roseSh: '#b44f63',
    cut: ['#a9d47f', '#8cc06a'], tall: ['#6ea353', '#5c9046', '#4f7f3d'], grassHi: '#c4e39a', sun: '#ffd56b' };
  function txt(s, x, y, col, size, align) { c.font = (size || 8) + 'px "Press Start 2P", monospace'; c.fillStyle = col; c.textAlign = align || 'left'; c.textBaseline = 'top'; c.fillText(s, x, y); }
  function vt(s, x, y, col, size, align) { c.font = (size || 10) + 'px "VT323", monospace'; c.fillStyle = col; c.textAlign = align || 'left'; c.textBaseline = 'top'; c.fillText(s, x, y); }
  function coin(x, y) { R(x + 1, y, 5, 7, '#c78f3e'); R(x, y + 1, 7, 5, '#c78f3e'); R(x + 1, y + 1, 5, 5, '#f3d38a'); R(x + 3, y + 2, 1, 3, '#c78f3e'); R(x + 1, y + 1, 2, 1, '#fff3c4'); }
  function btn(x, y, w, s, on) { R(x, y, w, 16, on ? P.rose : '#fbeedd'); R(x, y + 15, w, 1, on ? P.roseSh : P.trayEdge); if (on) R(x, y, w, 1, P.roseHi); txt(s, x + w / 2, y + 5, on ? '#fff' : P.trayInk, 6, 'center'); }
  function finger(px, py) { c.fillStyle = 'rgba(255,255,255,.45)'; c.beginPath(); c.arc(px, py, 8, 0, 7); c.fill(); c.strokeStyle = 'rgba(255,255,255,.95)'; c.stroke(); }
  function sparkleIcon(x, y, on, s) { s = s || 1; var col = on ? '#ffd56b' : '#e8dccd', sh = on ? '#e7a43a' : '#d6c6b4';
    c.fillStyle = sh; c.beginPath(); for (var p = 0; p < 8; p++) { var r = p % 2 ? 3 * s : 9 * s, an = -Math.PI / 2 + p * Math.PI / 4; c.lineTo(x + Math.cos(an) * r + 1, y + Math.sin(an) * r + 1); } c.fill();
    c.fillStyle = col; c.beginPath(); for (var q = 0; q < 8; q++) { var r2 = q % 2 ? 3 * s : 9 * s, an2 = -Math.PI / 2 + q * Math.PI / 4; c.lineTo(x + Math.cos(an2) * r2, y + Math.sin(an2) * r2); } c.fill();
    if (on) R(x - 1, y - 4 * s, 2, 3 * s, '#fffbe0'); }

  // the frame shared by all eight chores: a header card with the job, a progress bar (icon + word), and Done
  function header(W, icon, title, word, pct) {
    R(4, 4, W - 8, 34, P.tray); R(4, 37, W - 8, 1, P.trayEdge); c.strokeStyle = P.rose; c.strokeRect(4.5, 4.5, W - 9, 33);
    icon(10, 9);
    txt(title, 32, 9, P.trayInk, 7);
    txt(word, 32, 22, '#8e6670', 5);
    R(78, 21, 120, 9, '#3b2430'); R(79, 22, 118, 7, '#e8dccd'); R(79, 22, Math.round(118 * pct), 7, '#8cc06a'); R(79, 22, Math.round(118 * pct), 2, '#c4e39a');
    txt(Math.round(pct * 100) + '%', W - 10, 22, P.trayInk, 6, 'right');
  }
  function footer(W, H, hint) {
    R(0, H - 26, W, 26, 'rgba(255,246,234,.95)'); R(0, H - 27, W, 1, P.trayEdge);
    vt(hint, 8, H - 21, P.trayInk, 12);
    btn(W - 66, H - 22, 60, 'DONE', false);
  }
  function mowerIcon(x, y) { R(x + 2, y + 9, 14, 6, '#e46f6a'); R(x + 2, y + 9, 14, 2, '#f39089'); R(x + 3, y + 15, 4, 4, '#3b2430'); R(x + 11, y + 15, 4, 4, '#3b2430'); R(x + 14, y + 1, 2, 9, '#6b4250'); R(x + 12, y, 6, 2, '#6b4250'); }
  function vacIcon(x, y) { R(x + 3, y + 8, 10, 9, '#7fa7a0'); R(x + 3, y + 8, 10, 3, '#a8cbc0'); R(x + 4, y + 17, 3, 2, '#3b2430'); R(x + 10, y + 17, 3, 2, '#3b2430'); R(x + 12, y + 1, 2, 9, '#6b4250'); R(x + 11, y, 5, 2, '#6b4250'); }

  // ---------- mow ----------
  function lawn(t, done) {
    for (var j = 0; j < N; j++) for (var i = 0; i < N; i++) {
      var mowed = done || (j < 4) || (j === 4 && i > 3);
      var a = iso(i, j), b = iso(i + 1, j), cc = iso(i + 1, j + 1), d = iso(i, j + 1);
      poly([a, b, cc, d], mowed ? P.cut[j % 2] : P.tall[(i + j) % 2]);
      if (!mowed) for (var k = 0; k < 9; k++) { var p = iso(i + hash(i * 3 + k, j) * .95, j + hash(i, j * 5 + k) * .95), sw = Math.round(Math.sin((t + k) / 2)); R(p[0], p[1] - 5, 1, 5, P.tall[2]); R(p[0] + 1 + sw, p[1] - 6, 1, 3, P.grassHi); R(p[0] - 1, p[1] - 3, 1, 3, P.tall[0]); }
      else for (var k2 = 0; k2 < 3; k2++) { var p2 = iso(i + hash(k2, i + j) * .9, j + hash(j, k2 + i) * .9); R(p2[0], p2[1] - 1, 2, 1, j % 2 ? '#7db35e' : '#c4e39a'); }
    }
    var D = iso(0, N), C = iso(N, N), B = iso(N, 0);
    poly([D, C, [C[0], C[1] + 8], [D[0], D[1] + 8]], '#6b4a30'); poly([B, C, [C[0], C[1] + 8], [B[0], B[1] + 8]], '#523621');
    // flower border and fence behind
    var A = iso(0, 0);
    for (var x = 0; x < N; x += .34) { var q = iso(x, 0), q2 = iso(x + .34, 0); poly([q, q2, up(q2, 26), up([(q[0] + q2[0]) / 2, (q[1] + q2[1]) / 2], 29), up(q, 26)], ['#e7c79a', '#d8b283', '#c9a271'][Math.round(x * 3) % 3]); }
    for (var y = 0; y < N; y += .34) { var r = iso(0, y), r2 = iso(0, y + .34); poly([r, r2, up(r2, 26), up([(r[0] + r2[0]) / 2, (r[1] + r2[1]) / 2], 29), up(r, 26)], ['#f0d4aa', '#e7c79a', '#dcbb8c'][Math.round(y * 3) % 3]); }
    for (var f = 0; f < 22; f++) { var fp = f < 11 ? iso(.3 + f * .52, .15) : iso(.15, .3 + (f - 11) * .52); R(fp[0] - 2, fp[1] - 5, 4, 4, '#5c9046'); R(fp[0] - 1, fp[1] - 7, 3, 3, ['#e46f8b', '#ffd56b', '#c8a6d8', '#f39bb0'][f % 4]); }
  }
  function mower(px, py, t) {
    var sh = c.createRadialGradient(px, py + 4, 2, px, py + 4, 18); sh.addColorStop(0, 'rgba(40,60,30,.35)'); sh.addColorStop(1, 'rgba(40,60,30,0)'); c.fillStyle = sh; c.fillRect(px - 20, py - 8, 40, 24);
    var j = t % 2;
    R(px - 13, py - 10 + j, 26, 12, '#3b2430'); R(px - 12, py - 9 + j, 24, 10, '#e46f6a'); R(px - 12, py - 9 + j, 24, 3, '#f39089'); R(px - 4, py - 13 + j, 8, 4, '#55313f'); R(px - 3, py - 12 + j, 6, 2, '#8e8a90');
    [[-11, 1], [7, 1]].forEach(function (w) { R(px + w[0], py + w[1], 6, 6, '#2b2226'); R(px + w[0] + 2, py + w[1] + 2, 2, 2, '#8e8a90'); });
    R(px + 9, py - 30, 2, 22, '#55313f'); R(px + 3, py - 32, 14, 3, '#3b2430'); R(px + 4, py - 31, 12, 1, '#6b4250');
    // clippings flying
    for (var k = 0; k < 6; k++) { var d = (t * 3 + k * 5) % 14; R(px - 16 - d, py - 4 - (k % 3) * 3 + d / 3, 2, 1, k % 2 ? '#c4e39a' : '#8cc06a'); }
  }
  function ralphLeaving(px, py, t, flip) {
    if (!window.RALPH_SIT) return;
    c.fillStyle = 'rgba(40,40,30,.25)'; c.beginPath(); c.ellipse(px, py, 10, 4, 0, 0, 7); c.fill();
    var rows = window.RALPH_SIT, pal = window.RALPH_PAL;
    for (var j = 0; j < rows.length; j++) for (var i = 0; i < rows[j].length; i++) { var ch = rows[j][i]; if (ch === '.' || !pal[ch]) continue; c.fillStyle = pal[ch]; c.fillRect(Math.round(px - 10 + (flip ? rows[j].length - 1 - i : i)), Math.round(py - rows.length + j), 1, 1); }
    // "slowly leaving": three tiny dots and footprints trailing
    var dots = Math.floor(t / 2) % 4; for (var d = 0; d < dots; d++) R(px + 14 + d * 4, py - 24, 2, 2, '#6b4250');
  }

  function skyline(W, t) { // the backs of the next street's rowhouses and a few clouds
    [[30, 50, 16], [170, 58, 20]].forEach(function (cl, i) { var x = (cl[0] + t * .4 * (i + 1)) % (W + 40) - 20; c.fillStyle = 'rgba(255,255,255,.85)'; c.beginPath(); c.ellipse(x, cl[1], cl[2], cl[2] * .35, 0, 0, 7); c.ellipse(x + cl[2] * .5, cl[1] - 3, cl[2] * .55, cl[2] * .3, 0, 0, 7); c.fill(); });
    [[-4, 52, 62, '#9e5a4e'], [58, 40, 70, '#b46a5a'], [128, 58, 58, '#8f5d6b'], [186, 46, 62, '#a8644f']].forEach(function (b) {
      R(b[0], b[1], b[2], 120, b[3]); R(b[0], b[1] - 3, b[2], 3, '#e9d6c4');
      for (var wx = b[0] + 6; wx < b[0] + b[2] - 10; wx += 16) for (var wy = b[1] + 8; wy < b[1] + 60; wy += 20) { R(wx, wy, 9, 12, '#efe2d2'); R(wx + 1, wy + 1, 7, 10, '#8fb3cc'); R(wx + 1, wy + 1, 3, 4, '#b9d2e2'); }
    });
  }

  // ---------- vacuum ----------
  function floorRoom(t) {
    for (var j = 0; j < N; j++) for (var i = 0; i < N; i++) {
      var a = iso(i, j), b = iso(i + 1, j), cc = iso(i + 1, j + 1), d = iso(i, j + 1);
      poly([a, b, cc, d], ['#d39a66', '#c88d5a', '#bb8150'][(j * 2 + (i >> 1)) % 3]);
      c.strokeStyle = '#93603c'; c.beginPath(); c.moveTo(d[0], d[1]); c.lineTo(cc[0], cc[1]); c.stroke();
    }
    var A = iso(0, 0), B = iso(N, 0), D = iso(0, N), C = iso(N, N);
    poly([A, D, up(D, 60), up(A, 60)], '#ecc1b2'); poly([A, B, up(B, 60), up(A, 60)], '#d9a596');
    for (var y = 0; y < N; y += .5) { var p = iso(0, y), q = iso(0, y + .25); poly([p, q, up(q, 60), up(p, 60)], '#f3d2c4'); }
    for (var x = 0; x < N; x += .5) { var p2 = iso(x, 0), q2 = iso(x + .25, 0); poly([p2, q2, up(q2, 60), up(p2, 60)], '#e6b7a8'); }
    poly([A, D, up(D, 14), up(A, 14)], '#dcab9c'); poly([A, B, up(B, 14), up(A, 14)], '#c78f82');
    poly([up(A, 14), up(D, 14), up(D, 16), up(A, 16)], '#fff1e2'); poly([up(A, 14), up(B, 14), up(B, 16), up(A, 16)], '#f1dcc8');
    // doorway Ralph is heading for
    var d0 = iso(4.2, 0), d1 = iso(5.4, 0); poly([d0, d1, up(d1, 44), up(d0, 44)], '#6b4250'); poly([[d0[0] + 2, d0[1] - 1], [d1[0] - 2, d1[1] - 1], up([d1[0] - 2, d1[1]], 41), up([d0[0] + 2, d0[1]], 41)], '#3b2430');
    poly([D, C, [C[0], C[1] + 6], [D[0], D[1] + 6]], '#7d4c30'); poly([B, C, [C[0], C[1] + 6], [B[0], B[1] + 6]], '#5e3822');
    // a rug, half vacuumed
    poly([iso(1, 1.5), iso(4.6, 1.5), iso(4.6, 4.6), iso(1, 4.6)], '#c78f3e'); poly([iso(1.2, 1.7), iso(4.4, 1.7), iso(4.4, 4.4), iso(1.2, 4.4)], '#e7b75f');
    for (var s = 0; s < 4; s++) poly([iso(1.2 + s * .8, 1.7), iso(1.6 + s * .8, 1.7), iso(1.6 + s * .8, 4.4), iso(1.2 + s * .8, 4.4)], s < 2 ? 'rgba(255,240,200,.25)' : null);
    // dust bunnies still left
    [[3.6, 3.0], [4.1, 2.2], [2.2, 5.2], [5.0, 4.6], [3.9, 4.0], [5.3, 1.6]].forEach(function (d, k) { var p3 = iso(d[0], d[1]); c.fillStyle = 'rgba(160,150,150,.85)'; c.beginPath(); c.ellipse(p3[0], p3[1] - 2, 4, 2.5, 0, 0, 7); c.fill(); R(p3[0] - 2, p3[1] - 4, 2, 1, '#d6cfcf'); R(p3[0] + 2, p3[1] - 3, 1, 1, '#7a7070'); });
  }
  function vacuum(px, py, t) {
    var j = t % 2; c.fillStyle = 'rgba(90,45,40,.3)'; c.beginPath(); c.ellipse(px, py + 2, 16, 5, 0, 0, 7); c.fill();
    R(px - 14, py - 4 + j, 28, 6, '#3b2430'); R(px - 13, py - 3 + j, 26, 4, '#5d8580');
    R(px - 2, py - 30, 3, 28, '#55313f'); R(px - 9, py - 26, 16, 18, '#3b2430'); R(px - 8, py - 25, 14, 16, '#7fa7a0'); R(px - 8, py - 25, 14, 4, '#a8cbc0'); R(px - 5, py - 18, 8, 6, '#5d8580');
    R(px - 6, py - 34, 12, 4, '#3b2430'); R(px - 5, py - 33, 10, 2, '#6b4250');
    for (var k = 0; k < 4; k++) { var a = (t + k) % 4; R(px - 16 - a * 2, py - 1 - k, 1, 1, 'rgba(220,210,200,.8)'); }
  }

  // ---------- end card ----------
  function doneCard(W, H, t) {
    R(0, 0, W, H, 'rgba(34,23,31,.45)');
    var w = 196, h = 150, x = (W - w) / 2, y = (H - h) / 2 - 6;
    R(x + 3, y + 4, w, h, 'rgba(34,23,31,.4)'); R(x, y, w, h, P.tray); R(x, y + h - 1, w, 1, P.trayEdge); c.strokeStyle = P.rose; c.lineWidth = 2; c.strokeRect(x + 1, y + 1, w - 2, h - 2); c.lineWidth = 1;
    R(x, y, w, 20, P.rose); R(x, y, w, 1, P.roseHi); txt('LAWN MOWED!', x + w / 2, y + 7, '#fff', 8, 'center');
    [0, 1, 2].forEach(function (k) { var b = k === 1 ? -3 : 0, pop = (t + k * 2) % 6 === 0 ? 1.1 : 1; sparkleIcon(x + 58 + k * 40, y + 42 + b, true, pop); });
    txt('TIDY JOB', x + w / 2, y + 60, P.trayInk, 7, 'center');
    vt('Clean stripes, every patch cut', x + w / 2, y + 71, '#8e6670', 11, 'center');
    R(x + 48, y + 88, 100, 18, '#fbeedd'); R(x + 48, y + 105, 100, 1, P.trayEdge); coin(x + 62, y + 93); txt('+40', x + 76, y + 94, P.trayInk, 8);
    vt('Paid once a day', x + w / 2, y + 108, '#8e6670', 10, 'center');
    btn(x + 8, y + 126, 86, 'PLAY AGAIN', false); btn(x + 102, y + 126, 86, 'BACK HOME', true);
  }

  window.drawMinigame = function (ctx, W, H, t, st) {
    c = ctx; t = t || 0; st = st || 'mow';
    OY = Math.round((H - 26 - 38 - (N * TH) - 8) / 2) + 38 + 30;
    var g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, st === 'vacuum' ? '#3a2633' : '#9cc8ea'); g.addColorStop(1, st === 'vacuum' ? '#22171f' : '#d8ecf6'); c.fillStyle = g; c.fillRect(0, 0, W, H);
    if (st === 'vacuum') {
      N = 6; OY = Math.round((H - 26 - 38 - (N * TH) - 8) / 2) + 38 + 30;
      floorRoom(t);
      var rp = iso(4.6, .7); ralphLeaving(rp[0] + (t % 8 < 4 ? 0 : 1), rp[1], t, false);
      var vp = iso(3.1, 3.3); vacuum(vp[0], vp[1], t); finger(vp[0] + 2, vp[1] - 33);
      header(W, vacIcon, 'VACUUM', 'DUST GONE', .55);
      footer(W, H, 'Drag over the dust');
      return;
    }
    N = 8; OY = 92; skyline(W, t);
    lawn(t, st === 'done');
    if (st === 'mow') {
      var r = iso(1.4, 6.6); ralphLeaving(r[0], r[1], t, true);
      var m = iso(4.0 + (t % 4) * .06, 4.55); mower(m[0], m[1], t); finger(m[0] + 10, m[1] - 31);
      // a faint guide for the next stripe
      c.setLineDash([3, 3]); c.strokeStyle = 'rgba(255,255,255,.7)'; var g1 = iso(4.0, 4.5), g2 = iso(.2, 4.5); c.beginPath(); c.moveTo(g1[0], g1[1]); c.lineTo(g2[0], g2[1]); c.stroke(); c.setLineDash([]);
      header(W, mowerIcon, 'MOW THE LAWN', 'MOWED', .64);
      footer(W, H, 'Drag the mower in stripes');
    } else {
      var m2 = iso(6.6, 6.4); mower(m2[0], m2[1], 0);
      header(W, mowerIcon, 'MOW THE LAWN', 'MOWED', 1);
      doneCard(W, H, t);
    }
  };
})();
