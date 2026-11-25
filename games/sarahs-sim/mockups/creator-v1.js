// Sarah's Sim: Creator screen mockup v1 (Nov 25, 2026), built on style-v1's dress-up figure. All art drawn in code.
// drawCreator(ctx, W, H, t, state): 'parts' (picking eyes from a list), 'tune' (fine tuning and age), 'extras' (tattoos and more).
(function () {
  var c;
  var C = {
    o: '#3b2430', sk: ['#fbdcc6', '#f2c3a6', '#dfa184', '#c27f66'],
    hair: ['#f0b878', '#d9904f', '#b56a34', '#87471f'],
    eye: '#7f9fae', eyeSh: '#5d7c8a', lip: '#c8707c', blush: '#f2aaa2', freckle: '#dc9a7c', gold: '#e7bb4f',
    orange: ['#ffb760', '#f7922e', '#d8731d', '#a9541a'], jeans: ['#7896bb', '#6a89b0', '#55739a', '#425a7c'],
    boot: ['#ecd0ab', '#e2c39c', '#cfa97d', '#b08a5f'],
    tray: '#fff6ea', trayEdge: '#e8cdb4', ink: '#6b4250', soft: '#b38a8f', rose: '#e46f8b', roseHi: '#f39bb0', roseSh: '#b44f63'
  };
  function R(x, y, w, h, col) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
  function E(cx, cy, rx, ry, col) { for (var yy = -ry; yy <= ry; yy++) { var hw = Math.round(rx * Math.sqrt(Math.max(0, 1 - (yy * yy) / (ry * ry)))); R(cx - hw, cy + yy, hw * 2 + 1, 1, col); } }
  function txt(s, x, y, col, size, align) { c.font = (size || 8) + 'px "Press Start 2P", monospace'; c.fillStyle = col; c.textAlign = align || 'left'; c.textBaseline = 'top'; c.fillText(s, x, y); }
  // tiny 3 x 5 rounded letters for tee prints
  var GL = { A: ['.#.', '#.#', '###', '#.#', '#.#'], N: ['#.#', '###', '###', '###', '#.#'], D: ['##.', '#.#', '#.#', '#.#', '##.'], S: ['.##', '#..', '.#.', '..#', '##.'],
    O: ['.#.', '#.#', '#.#', '#.#', '.#.'], I: ['###', '.#.', '.#.', '.#.', '###'], R: ['##.', '#.#', '##.', '#.#', '#.#'], G: ['.##', '#..', '#.#', '#.#', '.##'],
    E: ['###', '#..', '##.', '#..', '###'], C: ['.##', '#..', '#..', '#..', '.##'], K: ['#.#', '#.#', '##.', '#.#', '#.#'], ' ': ['...', '...', '...', '...', '...'] };
  function print(s, cx, y, col, sh) {
    var w = s.length * 4 - 1, x = Math.round(cx - w / 2);
    for (var i = 0; i < s.length; i++) { var g = GL[s[i]] || GL[' ']; for (var r = 0; r < 5; r++) for (var q = 0; q < 3; q++) if (g[r][q] === '#') { R(x + i * 4 + q, y + r + 1, 1, 1, sh); R(x + i * 4 + q, y + r, 1, 1, col); } }
  }

  // ---------- the big dress-up figure (about 50 x 120) ----------
  // Parts are drawn twice: first each grown by 1 px in the outline color, then filled, so outlines only show on the outside.
  function figure(x, y, back, t, lines, op) {
    op = op || {}; var EYE = op.eye || C.eye, O = op.tee || C.orange, J = C.jeans, B = C.boot, H = op.hair || C.hair, S = op.sk || C.sk, gap = op.gap || 0;
    var bob = (t % 8 < 4) ? 0 : 1; // gentle breathing
    function parts(pass) {
      function P(fn) { fn(pass); }
      function r(px, py, w, h, col) { if (pass === 0) R(x + px - 1, y + py - 1, w + 2, h + 2, C.o); else R(x + px, y + py, w, h, col); }
      function e(cx, cy, rx, ry, col) { if (pass === 0) E(x + cx, y + cy, rx + 1, ry + 1, C.o); else E(x + cx, y + cy, rx, ry, col); }
      if (op.long) { r(8, 26, 34, 34, H[2]); e(25, 60, 17, 4, H[2]); }
      // legs and boots
      r(14, 80, 10, 29, J[1]); r(26, 80, 10, 29, J[2]);
      r(13, 107, 12, 9, B[1]); r(25, 107, 12, 9, B[2]);
      // arms
      r(5, 48 + bob, 6, 30, S[1]); r(39, 48 + bob, 6, 30, S[2]);
      e(8, 79 + bob, 3, 3, S[1]); e(42, 79 + bob, 3, 3, S[2]);
      // jeans waist
      r(13, 72, 24, 10, J[1]);
      // tee body and sleeves
      r(12, 44 + bob, 26, 31, O[1]); r(5, 45 + bob, 9, 12, O[1]); r(36, 45 + bob, 9, 12, O[1]);
      // neck
      r(21, 37, 8, 9, S[2]);
      // hair behind, then head
      if (!back) { if (!op.long) e(25, 7, 8, 5, H[1]); e(25, 24, 17, 16, H[2]); [[10, 33], [12, 37], [15, 39], [35, 39], [38, 37], [40, 33]].forEach(function (q) { e(q[0], q[1], 3, 3, H[2]); }); e(25, 25, 12, 13, S[1]); }
      else { e(25, 7, 8, 5, H[1]); e(25, 24, 17, 16, H[2]); [[10, 33], [12, 37], [15, 39], [35, 39], [38, 37], [40, 33]].forEach(function (q) { e(q[0], q[1], 3, 3, H[2]); }); r(19, 36, 12, 3, H[2]); }
    }
    E(x + 25, y + 117, 20, 4, 'rgba(90,45,40,.25)');
    parts(0); parts(1);
    // shading and detail
    var O2 = O;
    R(x + 15, y + 82, 3, 26, J[0]); R(x + 27, y + 82, 2, 26, J[1]); R(x + 24, y + 80, 2, 28, J[3]);           // jean light and inseam
    R(x + 13, y + 80, 24, 1, J[3]); R(x + 24, y + 73, 1, 7, J[3]); R(x + 22, y + 73, 6, 2, back ? J[2] : '#e7bb4f');
    if (back) { R(x + 15, y + 82, 7, 6, J[2]); R(x + 28, y + 82, 7, 6, J[3]); R(x + 15, y + 82, 7, 1, J[3]); R(x + 28, y + 82, 7, 1, C.o); }
    R(x + 24, y + 96, 2, 20, C.o); R(x + 24, y + 96, 2, 1, J[3]);
    R(x + 14, y + 107, 4, 3, B[0]); R(x + 13, y + 114, 12, 2, B[3]); R(x + 25, y + 114, 12, 2, B[3]);              // boots
    R(x + 6, y + 58 + bob, 2, 18, S[0]); R(x + 42, y + 58 + bob, 2, 18, S[3]);                                    // arms
    R(x + 12, y + 44 + bob, 5, 29, O2[0]); R(x + 32, y + 46 + bob, 6, 29, O2[2]); R(x + 5, y + 45 + bob, 4, 11, O2[0]); R(x + 39, y + 45 + bob, 6, 11, O2[2]);
    R(x + 5, y + 56 + bob, 9, 1, O2[3]); R(x + 36, y + 56 + bob, 9, 1, O2[3]); R(x + 13, y + 74, 24, 1, O2[3]);   // hems
    R(x + 11, y + 46 + bob, 1, 10, C.o); R(x + 38, y + 46 + bob, 1, 10, C.o);                                     // sleeve seams
    if (!back) {
      R(x + 20, y + 44 + bob, 10, 2, O2[3]); R(x + 21, y + 44 + bob, 8, 1, S[2]);                                 // crew neck
      E(x + 22, y + 22, 7, 7, S[0]);
      // hairline: center part with soft curls falling to each side
      R(x + 13, y + 12, 24, 4, H[2]); R(x + 14, y + 15, 6, 3, H[2]); R(x + 31, y + 15, 6, 3, H[3]); R(x + 12, y + 15, 3, 14, H[2]); R(x + 35, y + 15, 3, 14, H[3]);
      R(x + 24, y + 12, 2, 2, S[1]); R(x + 15, y + 13, 7, 1, H[1]); R(x + 28, y + 13, 7, 1, H[1]); R(x + 20, y + 4, 6, 2, H[0]);
      function wave(px, py, len, dark, lite) { for (var k = 0; k < len; k++) { var o = [0, 1, 1, 0, -1, -1][k % 6]; R(x + px + o, y + py + k, 1, 1, dark); if (lite) R(x + px + o - 1, y + py + k, 1, 1, lite); } } wave(11, 20, 16, H[3], H[1]); wave(15, 26, 12, H[3], null); wave(38, 20, 16, H[3], H[1]); wave(34, 26, 12, H[3], null);
      // brows, eyes, nose, freckles, smile, hoops
      R(x + 17, y + 21, 5, 1, H[2]); R(x + 28, y + 21, 5, 1, H[2]);
      [[17 - gap, 24], [28 + gap, 24]].forEach(function (p) { R(x + p[0], y + p[1], 5, 1, C.o); R(x + p[0], y + p[1] + 1, 5, 3, '#fbf7f4'); R(x + p[0] + 1, y + p[1] + 1, 3, 3, EYE); R(x + p[0] + 2, y + p[1] + 2, 1, 2, '#2e211a'); R(x + p[0] + 1, y + p[1] + 1, 1, 1, '#fff'); R(x + p[0], y + p[1] + 4, 5, 1, S[2]); });
      R(x + 24, y + 28, 2, 3, S[2]); R(x + 23, y + 31, 4, 1, S[3]);
      if (op.freckles !== false) [[18, 30], [20, 31], [30, 30], [32, 31], [22, 29], [28, 29]].forEach(function (p) { R(x + p[0], y + p[1], 1, 1, C.freckle); });
      if (op.stud) R(x + 27, y + 30, 1, 1, '#eef1f3');
      if (op.lips) { R(x + 21, y + 34, 8, 1, op.lips); }
      R(x + 16, y + 31, 3, 1, C.blush); R(x + 31, y + 31, 3, 1, C.blush);
      R(x + 21, y + 34, 8, 1, C.lip); R(x + 22, y + 35, 6, 1, '#fffaf2'); R(x + 20, y + 33, 1, 1, C.lip); R(x + 29, y + 33, 1, 1, C.lip);
      R(x + 13, y + 29, 1, 3, C.gold); R(x + 36, y + 29, 1, 3, C.gold);
    } else {
      R(x + 21, y + 44 + bob, 8, 1, O2[3]);
      // shading: lit upper left, shade lower right
      E(x + 31, y + 30, 9, 8, H[3]); E(x + 27, y + 26, 11, 10, H[2]); E(x + 20, y + 17, 9, 6, H[1]); E(x + 18, y + 15, 4, 2, H[0]);
      // strands swept up from the nape into the bun
      c.strokeStyle = H[3]; c.lineWidth = 1;
      [[-12, -7], [-7, -4], [-2, -1], [3, 2], [8, 4], [12, 6]].forEach(function (k) { c.beginPath(); c.moveTo(x + 25 + k[0] + .5, y + 37.5); c.quadraticCurveTo(x + 25 + k[0] * 1.15 + .5, y + 20, x + 25 + k[1] + .5, y + 11.5); c.stroke(); });
      c.strokeStyle = H[0]; [[-9, -5], [-4, -2]].forEach(function (k) { c.beginPath(); c.moveTo(x + 24 + k[0] + .5, y + 30.5); c.quadraticCurveTo(x + 24 + k[0] * 1.15 + .5, y + 20, x + 24 + k[1] + .5, y + 13.5); c.stroke(); });
      // curls hanging at the sides, like the front
      function wave(px, py, len, dark, lite) { for (var k = 0; k < len; k++) { var o = [0, 1, 1, 0, -1, -1][k % 6]; R(x + px + o, y + py + k, 1, 1, dark); if (lite) R(x + px + o - 1, y + py + k, 1, 1, lite); } }
      wave(11, 22, 14, H[3], H[1]); wave(38, 22, 14, H[3], null);
      // nape: a little neck shows under the curls
      R(x + 22, y + 39, 6, 4, S[2]); R(x + 22, y + 39, 6, 1, H[3]);
      R(x + 19, y + 9, 12, 2, '#7fa7a0');
    }
    if (op.tattoo) { var tx = x + 41, ty = y + 64 + bob; R(tx + 1, ty, 1, 1, op.tattoo); R(tx + 3, ty, 1, 1, op.tattoo); R(tx, ty + 1, 5, 1, op.tattoo); R(tx + 1, ty + 2, 3, 1, op.tattoo); R(tx + 2, ty + 3, 1, 1, op.tattoo); }
    lines = lines || (back ? ['AND SO', 'DO I'] : ['ORANGE', 'ROCKS']);
    lines.forEach(function (s, i) { print(s, x + 25, y + 52 + bob + i * 8, '#fff8ee', O2[3]); });
  }

  // ---------- backdrop ----------
  function backdrop(W, top, bottom, t) {
    R(0, top, W, bottom - top, '#f3d2c4');
    for (var i = 0; i < W; i += 12) R(i, top, 6, bottom - top, '#efc8b9');
    for (var j = top + 8; j < bottom - 40; j += 22) for (var k = (j / 22) % 2 ? 9 : 3; k < W; k += 12) R(k, j, 1, 1, '#e7a9b4');
    // fairy lights along the top
    for (var f = 6; f < W; f += 14) { var fy = top + 6 + Math.round(Math.sin(f / 9) * 3), on = (Math.floor(t / 2) + f / 14) % 5 !== 0; if (on) { c.fillStyle = 'rgba(255,225,150,.45)'; c.beginPath(); c.arc(f, fy, 3, 0, 7); c.fill(); } R(f - 1, fy - 1, 2, 2, on ? '#ffd56b' : '#c9a7a0'); }
    // wainscot, floor and a round rug
    var fl = bottom - 34;
    R(0, fl - 16, W, 16, '#fff1e2'); R(0, fl - 16, W, 1, '#fffaf3'); for (var p = 6; p < W; p += 24) R(p, fl - 12, 18, 9, '#f6e6d6');
    R(0, fl, W, 34, '#d39a66'); for (var q = fl + 6; q < bottom; q += 7) R(0, q, W, 1, '#93603c'); for (var z = 0; z < 8; z++) R((z * 37 + (z % 2) * 15) % W, fl + 7 * (z % 4) + 1, 1, 6, '#93603c');
    E(W / 2, fl + 20, 52, 11, '#c78f3e'); E(W / 2, fl + 20, 49, 10, '#e7b75f'); E(W / 2, fl + 20, 38, 7, '#f3d38a'); E(W / 2, fl + 20, 22, 4, '#f39bb0');
    // standing oval mirror behind her
    var mx = W / 2, my = top + 74;
    E(mx, my, 40, 56, '#55311d'); E(mx, my, 38, 54, '#b9804f'); E(mx, my, 36, 52, '#8e5a37'); E(mx, my, 34, 50, '#cfe1ec'); E(mx - 6, my - 6, 26, 40, '#ddeaf2');
    c.fillStyle = 'rgba(255,255,255,.6)'; for (var s = 0; s < 3; s++) c.fillRect(mx - 26 + s * 6, my - 30 + s * 2, 3, 18);
    // a little plant and Louie's basket at the sides
    R(12, fl - 14, 14, 14, '#d98a6f'); R(12, fl - 14, 14, 2, '#e8a28c'); E(19, fl - 22, 10, 8, '#6aa361'); E(16, fl - 25, 5, 4, '#8fc47b'); E(23, fl - 18, 4, 3, '#437a47');
  }
  function chip(x, y, w, s) { R(x, y, w, 14, '#fff6ea'); R(x, y + 13, w, 1, C.trayEdge); c.strokeStyle = C.rose; c.lineWidth = 1; c.strokeRect(x + .5, y + .5, w - 1, 13); txt(s, x + w / 2, y + 4, C.ink, 6, 'center'); }
  function heart(x, y, col) { R(x + 1, y, 2, 1, col); R(x + 4, y, 2, 1, col); R(x, y + 1, 7, 2, col); R(x + 1, y + 3, 5, 1, col); R(x + 2, y + 4, 3, 1, col); R(x + 3, y + 5, 1, 1, col); }
  function camera(x, y) { R(x, y + 2, 10, 7, C.ink); R(x + 3, y, 4, 2, C.ink); R(x + 3, y + 3, 4, 4, '#fff6ea'); R(x + 4, y + 4, 2, 2, C.ink); }
  function topBar(W) {
    R(4, 4, 72, 15, 'rgba(255,246,234,.95)'); R(4, 18, 72, 1, C.trayEdge); R(8, 8, 7, 7, '#7fa7a0'); R(9, 9, 3, 2, '#a8cbc0'); txt('SANDBOX', 19, 8, C.ink, 7);
    R(W - 86, 4, 82, 15, 'rgba(255,246,234,.95)'); R(W - 86, 18, 82, 1, C.trayEdge); heart(W - 81, 8, C.rose); txt('OUR PLACE', W - 71, 8, C.ink, 7);
  }
  function btn(x, y, w, s, on) { R(x, y, w, 14, on ? C.rose : '#fbeedd'); R(x, y + 13, w, 1, on ? C.roseSh : C.trayEdge); if (on) R(x, y, w, 1, C.roseHi); txt(s, x + w / 2, y + 4, on ? '#fff' : C.ink, 6, 'center'); }
  function trayBase(W, y, h) { R(0, y - 2, W, 2, 'rgba(59,36,48,.25)'); R(0, y, W, h, C.tray); R(0, y, W, 1, '#fffaf3'); }
  function modeTabs(y) { ['HOME', 'STYLE'].forEach(function (s, i) { var tx = 6 + i * 52; R(tx, y + 4, 48, 12, i === 1 ? C.rose : C.trayEdge); if (i === 1) R(tx, y + 4, 48, 1, C.roseHi); txt(s, tx + 24, y + 6, i === 1 ? '#fff' : C.ink, 8, 'center'); }); }

  // clothing icons, 26 x 20
  function top(x, y, k) {
    var long = k.long, col = k.col;
    function shape(g, f) { R(x + 7 - g, y + 2 - g, 12 + 2 * g, 16 + 2 * g, f); R(x + 1 - g, y + 3 - g, 7 + g, (long ? 14 : 7) + 2 * g, f); R(x + 18, y + 3 - g, 7 + g, (long ? 14 : 7) + 2 * g, f); }
    shape(1, C.o); shape(0, col[1]); R(x + 7, y + 2, 4, 16, col[0]); R(x + 1, y + 3, 3, long ? 14 : 7, col[0]); R(x + 22, y + 3, 3, long ? 14 : 7, col[2]); R(x + 16, y + 3, 3, 15, col[2]);
    R(x + 10, y + 2, 6, 2, C.o); R(x + 11, y + 2, 4, 1, '#fbeedd');
    if (k.deco) k.deco(x, y);
  }
  var TOPS = [
    { col: C.orange, deco: function (x, y) { R(x + 9, y + 7, 8, 1, '#fff8ee'); R(x + 10, y + 10, 6, 1, '#fff8ee'); } },
    { col: ['#d9737b', '#b9505a', '#8e3a44'], long: true, deco: function (x, y) { R(x + 11, y + 2, 4, 16, '#f3ead8'); R(x + 8, y + 6, 2, 2, '#e7a9c4'); R(x + 16, y + 10, 2, 2, '#c8a6d8'); R(x + 3, y + 12, 2, 2, '#f0b3c4'); } },
    { col: ['#e2c39c', '#d9b48c', '#b08a5f'], long: true, deco: function (x, y) { [[9, 5], [14, 8], [10, 12], [16, 14], [3, 7], [22, 11], [12, 16]].forEach(function (p) { R(x + p[0], y + p[1], 2, 1, '#3a3236'); R(x + p[0], y + p[1] + 1, 1, 1, '#3a3236'); }); } },
    { col: ['#d9c6ea', '#c8a6d8', '#9a7bb4'], long: true, deco: function (x, y) { R(x + 9, y, 8, 3, '#c8a6d8'); R(x + 9, y, 8, 1, C.o); R(x + 9, y + 11, 8, 4, '#9a7bb4'); } },
    { col: ['#f6ead0', '#ecdcc0', '#c4ab84'], long: true, deco: function (x, y) { R(x + 9, y, 8, 4, '#ecdcc0'); R(x + 9, y, 8, 1, C.o); R(x + 9, y + 3, 8, 1, '#c4ab84'); } },
    { col: ['#d65a5a', '#b8434a', '#8e2f36'], long: true, deco: function (x, y) { for (var i = 2; i < 18; i += 4) R(x + 1, y + i, 24, 1, '#5a1f26'); for (var j = 3; j < 25; j += 5) R(x + j, y + 2, 1, 16, '#2f5646'); R(x + 11, y + 2, 4, 3, '#fff6ea'); } },
    { col: ['#ffffff', '#f7f3ec', '#dcd5cb'] },
    { col: ['#4f8a6c', '#3c6a55', '#234236'], long: true, deco: function (x, y) { for (var i = 3; i < 18; i += 4) R(x + 1, y + i, 24, 1, '#b8434a'); for (var j = 4; j < 25; j += 6) R(x + j, y + 2, 1, 16, '#e9e4dc'); R(x + 12, y + 2, 2, 16, '#f7f3ec'); } }
  ];
  var SW = [[C.orange[1], '#e46f8b', '#7fa7a0', '#f3d38a'], ['#b9505a', '#7fa7a0', '#c8a6d8'], ['#d9b48c', '#9e9696', '#e46f8b'], ['#c8a6d8', '#f39bb0', '#9cc1b6', '#6a89b0'], ['#ecdcc0', '#3a3236', '#b9505a'], ['#b8434a', '#3c6a55', '#4f6a9e'], ['#f7f3ec', '#2f2228', '#f39bb0', '#9cc1b6'], ['#3c6a55', '#b8434a', '#4f6a9e']];
  // 8 wardrobe tabs: hair, tops, bottoms, dresses, shoes, extras, Ours, Holiday
  function tabIcon(i, x, y, on) {
    var k = on ? '#fff' : C.ink, k2 = on ? '#ffd9e2' : C.soft;
    [function () { E(x + 6, y + 5, 5, 4, k); R(x + 2, y + 5, 2, 5, k); R(x + 9, y + 5, 2, 5, k); E(x + 6, y + 6, 3, 2, k2); },
      function () { R(x + 3, y + 1, 7, 9, k); R(x, y + 2, 3, 4, k); R(x + 10, y + 2, 3, 4, k); R(x + 5, y + 1, 3, 1, k2); },
      function () { R(x + 2, y + 1, 9, 3, k); R(x + 2, y + 4, 4, 6, k); R(x + 7, y + 4, 4, 6, k); },
      function () { R(x + 4, y + 1, 5, 4, k); R(x + 3, y + 5, 7, 2, k); R(x + 2, y + 7, 9, 3, k); },
      function () { R(x + 2, y + 2, 4, 5, k); R(x + 2, y + 7, 9, 3, k); R(x + 7, y + 6, 2, 1, k2); },
      function () { R(x + 1, y + 5, 11, 2, k); R(x + 3, y + 2, 7, 3, k); R(x + 5, y + 7, 3, 3, k2); },
      function () { heart(x + 3, y + 2, on ? '#fff' : C.rose); },
      function () { R(x + 6, y + 1, 1, 2, k); R(x + 4, y + 3, 5, 2, k); R(x + 1, y + 4, 11, 2, k); R(x + 3, y + 6, 7, 2, k); R(x + 2, y + 8, 3, 2, k); R(x + 8, y + 8, 3, 2, k); }
    ][i]();
  }

  var TABS = ['AGE', 'FACE', 'EYES', 'NOSE', 'LIPS', 'HAIR', 'BODY', 'SKIN', 'MORE'];
  function tabRow(y, sel) {
    for (var i = 0; i < 9; i++) { var tx = 4 + i * 25.8, on = i === sel; R(tx, y, 24, 14, on ? C.rose : '#fbeedd'); R(tx, y + 13, 24, 1, on ? C.roseSh : C.trayEdge); txt(TABS[i], tx + 12, y + 5, on ? '#fff' : C.ink, 5, 'center'); }
  }
  function creatorHead(W, y) { R(0, y - 2, W, 2, 'rgba(59,36,48,.25)'); R(0, y, W, 112, C.tray); R(0, y, W, 1, '#fffaf3'); }
  function eyeIcon(i, x, y, col) {
    var shapes = [[5, 3, 0], [5, 2, 0], [4, 3, 1], [6, 3, 0], [5, 3, 2], [4, 2, 0], [6, 2, 1], [5, 4, 0]];
    var sh = shapes[i], w = sh[0], h = sh[1], lash = sh[2];
    [[x, y], [x + w + 5, y]].forEach(function (p) {
      R(p[0], p[1], w, 1, C.o); R(p[0], p[1] + 1, w, h, '#fbf7f4'); R(p[0] + 1, p[1] + 1, Math.max(2, w - 2), h, col); R(p[0] + 1, p[1] + 1, 1, 1, '#fff');
      if (lash === 1) R(p[0] + w, p[1] - 1, 1, 1, C.o); if (lash === 2) { R(p[0] - 1, p[1] - 1, 1, 1, C.o); R(p[0] + w, p[1] - 1, 1, 1, C.o); }
      R(p[0], p[1] + h + 1, w, 1, '#dfa184');
    });
  }
  function partsTray(W, H) {
    var y = H - 112; creatorHead(W, y);
    tabRow(y + 4, 2);
    txt('EYES', 6, y + 23, C.ink, 6); txt('12 SHAPES', W - 6, y + 23, C.soft, 5, 'right');
    for (var j = 0; j < 8; j++) {
      var col = j % 4, row = Math.floor(j / 4), sx = 5 + col * 58, sy = y + 32 + row * 22;
      R(sx, sy, 55, 20, j === 2 ? '#fde3ea' : '#fbeedd'); R(sx, sy + 19, 55, 1, C.trayEdge);
      R(sx + 13, sy + 5, 30, 11, '#f2c3a6'); eyeIcon(j, sx + 17, sy + 8, '#6b4a33');
      if (j === 2) { c.strokeStyle = C.rose; c.lineWidth = 2; c.strokeRect(sx + 1, sy + 1, 53, 18); c.lineWidth = 1; }
    }
    txt('COLOR', 6, y + 81, C.soft, 5);
    ['#6b4a33', '#3e2a24', '#7f9fae', '#5d8a6e', '#9a7b4f', '#7d93c4', '#a46a8a', '#c9a36a'].forEach(function (cc, k) { var sx = 40 + k * 19; R(sx, y + 78, 15, 11, C.o); R(sx + 1, y + 79, 13, 9, cc); if (k === 0) { c.strokeStyle = C.rose; c.lineWidth = 2; c.strokeRect(sx - 2, y + 76, 19, 15); c.lineWidth = 1; } });
    btn(6, y + 95, 70, 'RANDOM', false); R(13, y + 98, 7, 7, C.ink); R(14, y + 99, 1, 1, '#fff'); R(18, y + 103, 1, 1, '#fff'); R(16, y + 101, 1, 1, '#fff');
    btn(84, y + 95, 70, 'UNDO', false); btn(162, y + 95, 72, 'NEXT', true);
  }
  function slider(x, y, w, label, v) {
    txt(label, x, y, C.ink, 5);
    var ly = y + 10; R(x, ly, w, 3, '#e8cdb4'); R(x, ly, Math.round(w * v), 3, C.roseHi);
    var kx = x + Math.round(w * v); R(kx - 4, ly - 4, 9, 11, C.o); R(kx - 3, ly - 3, 7, 9, '#fff6ea'); R(kx - 1, ly - 1, 3, 5, C.rose);
  }
  function tuneTray(W, H) {
    var y = H - 112; creatorHead(W, y);
    tabRow(y + 4, 0);
    txt('AGE', 6, y + 24, C.soft, 5);
    ['KID', 'TEEN', 'ADULT', 'ELDER'].forEach(function (s, k) { btn(46 + k * 47, y + 21, 44, s, k === 2); });
    txt('GENDER', 6, y + 41, C.soft, 5);
    ['WOMAN', 'MAN', 'NONBINARY'].forEach(function (s, k) { btn([46, 93, 140][k], y + 38, [44, 44, 94][k], s, k === 0); });
    slider(8, y + 56, 100, 'EYE SPACING', .62); slider(130, y + 56, 100, 'HEIGHT', .55);
    txt('FRECKLES', 8, y + 80, C.ink, 5); R(60, y + 77, 24, 11, C.o); R(61, y + 78, 22, 9, C.roseHi); R(72, y + 78, 10, 9, '#fff6ea');
    txt('SHE/HER', 130, y + 80, C.ink, 5); txt('EDIT', 230, y + 80, C.rose, 5, 'right');
    btn(6, y + 96, 110, 'RESET', false); btn(124, y + 96, 110, 'NEXT', true);
  }
  function extrasTray(W, H) {
    var y = H - 112; creatorHead(W, y);
    tabRow(y + 4, 8);
    ['MAKEUP', 'FRECK', 'BEARD', 'GLASS', 'PIERCE', 'TATTOO', 'MARKS'].forEach(function (s, k) { var sx = 4 + k * 33.2, on = k === 5; R(sx, y + 22, 32, 12, on ? '#f6c9c1' : '#fbeedd'); if (on) R(sx, y + 33, 32, 1, C.rose); txt(s, sx + 16, y + 25, C.ink, 5, 'center'); });
    var ink = '#4f6a9e';
    var T = [
      function (x, y) { R(x + 1, y, 2, 1, ink); R(x + 4, y, 2, 1, ink); R(x, y + 1, 7, 2, ink); R(x + 1, y + 3, 5, 1, ink); R(x + 2, y + 4, 3, 1, ink); R(x + 3, y + 5, 1, 1, ink); },
      function (x, y) { R(x + 3, y, 1, 7, ink); R(x, y + 3, 7, 1, ink); R(x + 1, y + 1, 1, 1, ink); R(x + 5, y + 1, 1, 1, ink); R(x + 1, y + 5, 1, 1, ink); R(x + 5, y + 5, 1, 1, ink); },
      function (x, y) { E(x + 3, y + 2, 1, 1, ink); E(x + 1, y + 4, 1, 1, ink); E(x + 5, y + 4, 1, 1, ink); R(x + 3, y + 4, 1, 4, '#437a47'); },
      function (x, y) { R(x, y + 1, 2, 2, ink); R(x + 5, y + 1, 2, 2, ink); R(x, y + 3, 7, 4, ink); R(x + 2, y + 4, 1, 1, '#fff'); R(x + 4, y + 4, 1, 1, '#fff'); },
      function (x, y) { E(x + 3, y + 3, 3, 3, ink); E(x + 4, y + 2, 2, 2, '#fbeedd'); },
      function (x, y) { R(x, y + 3, 8, 1, ink); R(x + 6, y + 1, 1, 5, ink); R(x + 1, y + 2, 1, 3, ink); },
      function (x, y) { R(x + 3, y, 1, 3, ink); R(x + 1, y + 3, 5, 1, ink); R(x + 3, y + 4, 1, 3, ink); R(x + 2, y + 6, 3, 1, ink); },
      function (x, y) { for (var k = 0; k < 7; k++) R(x + k, y + 3 + [0, -1, -1, 0, 1, 1, 0][k], 1, 1, ink); }
    ];
    var NAMES = ['HEART', 'STAR', 'FLOWER', 'CAT', 'MOON', 'ARROW', 'ANCHOR', 'WAVE'];
    for (var j = 0; j < 8; j++) {
      var col = j % 4, row = Math.floor(j / 4), sx = 5 + col * 58, sy = y + 37 + row * 20;
      R(sx, sy, 55, 18, j === 0 ? '#fde3ea' : '#fbeedd'); R(sx, sy + 17, 55, 1, C.trayEdge);
      R(sx + 4, sy + 3, 13, 12, '#f2c3a6'); T[j](sx + 7, sy + 5); txt(NAMES[j], sx + 20, sy + 7, C.ink, 5);
      if (j === 0) { c.strokeStyle = C.rose; c.lineWidth = 2; c.strokeRect(sx + 1, sy + 1, 53, 16); c.lineWidth = 1; }
    }
    txt('SPOT', 6, y + 83, C.soft, 5);
    ['ARM', 'WRIST', 'ANKLE', 'NECK'].forEach(function (s, k) { btn(32 + k * 38, y + 79, 35, s, k === 0); });
    [ink, '#3b2430', '#b44f63', '#437a47'].forEach(function (cc, k) { var sx = 186 + k * 12; R(sx, y + 80, 10, 11, C.o); R(sx + 1, y + 81, 8, 9, cc); if (!k) { c.strokeStyle = C.rose; c.strokeRect(sx - 1.5, y + 78.5, 13, 14); } });
    btn(6, y + 96, 110, 'NONE', false); btn(124, y + 96, 110, 'DONE', true);
  }
  window.drawCreator = function (ctx, W, H, t, st) {
    c = ctx; t = t || 0; st = st || 'parts';
    c.imageSmoothingEnabled = false;
    var trayTop = H - 112;
    backdrop(W, 0, trayTop, t);
    var op = { sk: ['#d9a27f', '#bf8461', '#a06a4b', '#7d4f36'], hair: ['#7a5a4c', '#5a4038', '#3e2a24', '#2b1c18'], tee: ['#b5d4ca', '#8fb3a9', '#6f978f', '#4f6f69'],
      long: true, freckles: false, eye: '#6b4a33', gap: st === 'tune' ? 1 : 0, stud: st === 'extras', tattoo: st === 'extras' ? '#4f6a9e' : null };
    figure(W / 2 - 25, trayTop - 128, false, t, [], op);
    var cy = 26;
    R(W / 2 - 40, cy, 80, 15, '#fff6ea'); R(W / 2 - 40, cy + 14, 80, 1, C.trayEdge); txt('NEW PERSON', W / 2, cy + 4, C.ink, 6, 'center');
    if (st === 'tune') { // a soft guide shows what the slider changes
      c.strokeStyle = 'rgba(228,111,139,.9)'; c.setLineDash([2, 2]); var fx = W / 2 - 25, fy = trayTop - 128; c.strokeRect(fx + 14.5, fy + 22.5, 22, 8); c.setLineDash([]);
    }
    if (st === 'extras') { var fx2 = W / 2 - 25, fy2 = trayTop - 128; c.strokeStyle = 'rgba(228,111,139,.9)'; c.setLineDash([2, 2]); c.strokeRect(fx2 + 38.5, fy2 + 61.5, 9, 9); c.setLineDash([]); }
    chip(8, trayTop - 82, 22, '‹'); chip(W - 30, trayTop - 82, 22, '›');
    topBar(W);
    if (st === 'parts') partsTray(W, H); else if (st === 'tune') tuneTray(W, H); else extrasTray(W, H);
  };
})();
