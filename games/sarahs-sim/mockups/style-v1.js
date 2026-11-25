// Sarah's Sim: Style screen mockup v1 (Nov 25, 2026). All art drawn in code.
// drawStyle(ctx, W, H, t, state): state 'wardrobe' (picking a top), 'back' (spun around, piece picked:
// swatches, patterns, print, paint), 'print' (writing her own words on a tee). Big dress-up figure, about 3x map size.
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
  function figure(x, y, back, t, lines) {
    var O = C.orange, J = C.jeans, B = C.boot, H = C.hair, S = C.sk;
    var bob = (t % 8 < 4) ? 0 : 1; // gentle breathing
    function parts(pass) {
      function P(fn) { fn(pass); }
      function r(px, py, w, h, col) { if (pass === 0) R(x + px - 1, y + py - 1, w + 2, h + 2, C.o); else R(x + px, y + py, w, h, col); }
      function e(cx, cy, rx, ry, col) { if (pass === 0) E(x + cx, y + cy, rx + 1, ry + 1, C.o); else E(x + cx, y + cy, rx, ry, col); }
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
      if (!back) { e(25, 7, 8, 5, H[1]); e(25, 24, 17, 16, H[2]); [[10, 33], [12, 37], [15, 39], [35, 39], [38, 37], [40, 33]].forEach(function (q) { e(q[0], q[1], 3, 3, H[2]); }); e(25, 25, 12, 13, S[1]); }
      else { e(25, 7, 8, 5, H[1]); e(25, 24, 17, 16, H[2]); [[10, 33], [12, 37], [15, 39], [35, 39], [38, 37], [40, 33]].forEach(function (q) { e(q[0], q[1], 3, 3, H[2]); }); r(19, 36, 12, 3, H[2]); }
    }
    E(x + 25, y + 117, 20, 4, 'rgba(90,45,40,.25)');
    parts(0); parts(1);
    // shading and detail
    var O2 = C.orange;
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
      [[17, 24], [28, 24]].forEach(function (p) { R(x + p[0], y + p[1], 5, 1, C.o); R(x + p[0], y + p[1] + 1, 5, 3, '#fbf7f4'); R(x + p[0] + 1, y + p[1] + 1, 3, 3, C.eye); R(x + p[0] + 2, y + p[1] + 2, 1, 2, C.eyeSh); R(x + p[0] + 1, y + p[1] + 1, 1, 1, '#fff'); R(x + p[0], y + p[1] + 4, 5, 1, S[2]); });
      R(x + 24, y + 28, 2, 3, S[2]); R(x + 23, y + 31, 4, 1, S[3]);
      [[18, 30], [20, 31], [30, 30], [32, 31], [22, 29], [28, 29]].forEach(function (p) { R(x + p[0], y + p[1], 1, 1, C.freckle); });
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
      R(x + 19, y + 9, 12, 2, '#7fa7a0'); // scrunchie under the bun
    }
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
  function wardrobeTray(W, H) {
    var h = 112, y = H - h; trayBase(W, y, h); modeTabs(y); txt('60 PIECES', W - 6, y + 7, C.soft, 6, 'right');
    for (var i = 0; i < 8; i++) { var tx = 4 + i * 29.2, on = i === 1; R(tx, y + 20, 27, 16, on ? C.rose : (i === 7 ? '#fdeccf' : '#fbeedd')); R(tx, y + 35, 27, 1, on ? C.roseSh : C.trayEdge); tabIcon(i, tx + 7, y + 23, on); }
    txt('TOPS', 6, y + 41, C.ink, 6);
    for (var j = 0; j < 8; j++) {
      var col = j % 4, row = Math.floor(j / 4), sx = 5 + col * 58, sy = y + 50 + row * 30;
      R(sx, sy, 55, 28, j === 0 ? '#fde3ea' : '#fbeedd'); R(sx, sy + 27, 55, 1, C.trayEdge);
      top(sx + 3, sy + 4, TOPS[j]);
      if (j === 0) { c.strokeStyle = C.rose; c.lineWidth = 2; c.strokeRect(sx + 1, sy + 1, 53, 26); c.lineWidth = 1; }
      if (j === 1 || j === 2 || j === 4 || j === 7) heart(sx + 45, sy + 19, C.roseHi);
      SW[j].forEach(function (cc, k) { R(sx + 33 + (k % 2) * 9, sy + 4 + Math.floor(k / 2) * 8, 7, 7, '#3b2430'); R(sx + 34 + (k % 2) * 9, sy + 5 + Math.floor(k / 2) * 8, 5, 5, cc); });
    }
  }
  function pattern(i, x, y, w, h) {
    R(x, y, w, h, '#3b2430'); var X = x + 1, Y = y + 1, ww = w - 2, hh = h - 2; R(X, Y, ww, hh, C.orange[1]);
    if (i === 1) for (var a = 0; a < hh; a += 3) R(X, Y + a, ww, 1, '#fff8ee');
    if (i === 2) { for (var b = 1; b < hh; b += 4) R(X, Y + b, ww, 1, '#a9541a'); for (var d = 2; d < ww; d += 5) R(X + d, Y, 1, hh, '#3c6a55'); }
    if (i === 3) [[3, 3], [10, 8], [17, 3], [5, 10], [14, 11]].forEach(function (p) { if (p[0] < ww - 2 && p[1] < hh - 2) { R(X + p[0], Y + p[1] - 1, 1, 3, '#f39bb0'); R(X + p[0] - 1, Y + p[1], 3, 1, '#f39bb0'); R(X + p[0], Y + p[1], 1, 1, '#ffd56b'); } });
    if (i === 4) [[2, 2], [9, 6], [16, 2], [4, 9], [13, 10], [19, 8]].forEach(function (p) { if (p[0] < ww - 2 && p[1] < hh - 2) { R(X + p[0], Y + p[1], 2, 1, '#3a3236'); R(X + p[0], Y + p[1] + 1, 1, 1, '#3a3236'); R(X + p[0] + 1, Y + p[1] + 1, 1, 1, '#d9b48c'); } });
    if (i === 5) for (var e = 2; e < ww; e += 5) for (var f = 2; f < hh; f += 5) R(X + e + ((f / 5) % 2 ? 2 : 0), Y + f, 2, 2, '#fff8ee');
  }
  function pieceTray(W, H) {
    var h = 112, y = H - h; trayBase(W, y, h); modeTabs(y); heart(W - 72, y + 7, C.rose); txt('FAVORITE', W - 62, y + 7, C.soft, 6);
    txt('ORANGE ROCKS TEE', 6, y + 22, C.ink, 7);
    var cols = [[C.orange[0], C.orange[1]], ['#f39bb0', '#e46f8b'], ['#b5d4ca', '#7fa7a0'], ['#fbe0a0', '#e7b75f'], ['#d9c6ea', '#c8a6d8'], ['#ffffff', '#f7f3ec']];
    cols.forEach(function (cc, k) { var sx = 6 + k * 23, sy = y + 33; R(sx, sy, 20, 14, '#3b2430'); R(sx + 1, sy + 1, 18, 12, cc[1]); R(sx + 1, sy + 1, 18, 4, cc[0]); if (k === 0) { c.strokeStyle = C.rose; c.lineWidth = 2; c.strokeRect(sx - 2, sy - 2, 24, 18); c.lineWidth = 1; } });
    R(146, y + 33, 88, 14, '#fbeedd'); R(146, y + 46, 88, 1, C.trayEdge); R(149, y + 36, 3, 7, '#8e5a37'); R(148, y + 34, 5, 3, C.rose); txt('PAINT PARTS', 194, y + 37, C.ink, 6, 'center');
    txt('PATTERN', 6, y + 53, C.soft, 6);
    ['PLAIN', 'STRIPE', 'PLAID', 'FLORAL', 'LEOPARD', 'DOTS'].forEach(function (s, k) { var sx = 6 + k * 38.4; pattern(k, sx, y + 62, 34, 16); if (k === 0) { c.strokeStyle = C.rose; c.lineWidth = 2; c.strokeRect(sx - 2, y + 60, 38, 20); c.lineWidth = 1; } });
    btn(6, y + 89, 110, 'EDIT PRINT', false); btn(124, y + 89, 110, 'DONE', true);
  }
  function printTray(W, H, t) {
    var h = 112, y = H - h; trayBase(W, y, h);
    txt('PRINT: ORANGE ROCKS TEE', 6, y + 6, C.ink, 7);
    btn(6, y + 18, 56, 'FRONT', true); btn(66, y + 18, 56, 'BACK', false); btn(126, y + 18, 108, 'ROUNDED LETTERS', false);
    R(6, y + 37, 228, 30, '#3b2430'); R(7, y + 38, 226, 28, '#fffaf3');
    txt('ORANGE', 12, y + 42, C.ink, 8); txt('ROCKS', 12, y + 54, C.ink, 8); if (t % 4 < 2) R(54, y + 53, 1, 10, C.rose);
    txt('2 LINES · 6 LETTERS EACH', 228, y + 58, C.soft, 5, 'right');
    txt('LETTERS', 6, y + 73, C.soft, 6);
    ['#fff8ee', '#3b2430', '#e46f8b', '#7fa7a0', '#f3d38a', '#4f6a9e', '#c8a6d8'].forEach(function (cc, k) { var sx = 58 + k * 25; R(sx, y + 70, 21, 13, '#3b2430'); R(sx + 1, y + 71, 19, 11, cc); if (k === 0) { c.strokeStyle = C.rose; c.lineWidth = 2; c.strokeRect(sx - 2, y + 68, 25, 17); c.lineWidth = 1; } });
    btn(6, y + 91, 110, 'CLEAR', false); btn(124, y + 91, 110, 'DONE', true);
  }

  window.drawStyle = function (ctx, W, H, t, st) {
    c = ctx; t = t || 0; st = st || 'wardrobe';
    c.imageSmoothingEnabled = false;
    var trayTop = H - 112;
    backdrop(W, 0, trayTop, t);
    figure(W / 2 - 25, trayTop - 128, st === 'back', t);
    // name pill and spin, favorite and camera chips
    var cy = 26;
    R(W / 2 - 30, cy, 60, 15, '#fff6ea'); R(W / 2 - 30, cy + 14, 60, 1, C.trayEdge); txt('SARAH', W / 2 - 5, cy + 4, C.ink, 7, 'center'); R(W / 2 + 18, cy + 6, 5, 1, C.ink); R(W / 2 + 19, cy + 7, 3, 1, C.ink); R(W / 2 + 20, cy + 8, 1, 1, C.ink);
    chip(8, trayTop - 82, 22, '‹'); chip(W - 30, trayTop - 82, 22, '›');
    R(W - 30, cy, 22, 15, '#fff6ea'); R(W - 30, cy + 14, 22, 1, C.trayEdge); camera(W - 24, cy + 3);
    R(W - 56, cy, 22, 15, '#fff6ea'); R(W - 56, cy + 14, 22, 1, C.trayEdge); heart(W - 48, cy + 5, C.rose);
    topBar(W);
    if (st === 'wardrobe') wardrobeTray(W, H); else if (st === 'back') pieceTray(W, H); else printTray(W, H, t);
  };
})();
