// Sarah's Sim: Memory book and Note found mockup v1 (Nov 26, 2026), for spec 007 parts B and C. All art drawn in code.
// Needs people-v1.js, louie-v1.js, ralph-v1.js and decorate-v1.js (the home behind) loaded first.
// drawMemoryBook(ctx, W, H, t, state):
//   'page'   the book open on The cats: the reward ribbon (3 · 6 · 10) and one page of two moments, one reached, one still a dotted "???".
//   'note'   Note found: a folded paper opens over the dimmed home. The words are a placeholder; Keegan's real notes stay private.
//   'notes'  the Notes tab: every note found so far as a little folded paper with where and when, the rest still to find.
(function () {
  var c;
  var P = {
    cloth: '#c9637a', clothSh: '#a84f64', clothHi: '#e08a9c', page: '#fbf3e4', pageSh: '#efe2cc', pageLine: '#ead9c0',
    ink: '#6b4250', soft: '#b38a8f', hand: '#7a4a35', handSoft: '#a98068', rose: '#e46f8b', roseHi: '#f39bb0', roseSh: '#b44f63',
    tape: 'rgba(242,196,138,.75)', tape2: 'rgba(168,203,192,.75)', edge: '#e8cdb4', sage: '#7fa7a0', gold: '#e7b75f', paper: '#fffaf0'
  };
  function R(x, y, w, h, col) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
  function txt(s, x, y, col, size, align) { c.font = (size || 8) + 'px "Press Start 2P", monospace'; c.fillStyle = col; c.textAlign = align || 'left'; c.textBaseline = 'top'; c.fillText(s, x, y); }
  function hash(i, j) { var h = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return h - Math.floor(h); }
  function heart(x, y, col, s) { s = s || 1; function h(a, b, w, hh) { R(x + a * s, y + b * s, w * s, hh * s, col); } h(1, 0, 2, 1); h(4, 0, 2, 1); h(0, 1, 7, 2); h(1, 3, 5, 1); h(2, 4, 3, 1); h(3, 5, 1, 1); }
  // handwriting: VT323 in soft brown ink, each letter tipped a little (spec 007, part B)
  function hand(s, x, y, size, col, align) {
    c.font = (size || 12) + 'px "VT323", monospace'; c.textBaseline = 'alphabetic'; c.textAlign = 'left';
    var w = c.measureText(s).width; if (align === 'center') x -= w / 2; if (align === 'right') x -= w;
    for (var i = 0, cx = x; i < s.length; i++) {
      var ch = s[i], cw = c.measureText(ch).width, a = (hash(i * 3 + s.length, y) - .5) * .22, dy = Math.round((hash(y, i) - .5) * 1.4);
      c.save(); c.translate(cx + cw / 2, y + dy); c.rotate(a); c.fillStyle = col || P.hand; c.fillText(ch, -cw / 2, 0); c.restore(); cx += cw;
    }
    return w;
  }
  function chev(x, y, col, left) { for (var k = 0; k < 4; k++) R(left ? x + 3 - k : x + k, y + k, 1, 7 - k * 2, col); }
  function backHint(x, y) { R(x, y, 12, 12, P.sage); R(x, y + 11, 12, 1, '#5d8580'); txt('B', x + 3, y + 3, '#fff', 6); txt('CLOSE', x + 16, y + 3, P.soft, 6); }
  function btn(x, y, w, s, on) { R(x, y, w, 14, on ? P.rose : '#fbeedd'); R(x, y + 13, w, 1, on ? P.roseSh : P.edge); if (on) R(x, y, w, 1, P.roseHi); txt(s, x + w / 2, y + 4, on ? '#fff' : P.ink, 6, 'center'); }
  function sprite(rows, pal, x, y, flip) { for (var j = 0; j < rows.length; j++) for (var i = 0; i < rows[j].length; i++) { var ch = rows[j][i]; if (ch === '.' || !pal[ch]) continue; c.fillStyle = pal[ch]; c.fillRect(Math.round(x + (flip ? rows[j].length - 1 - i : i)), Math.round(y + j), 1, 1); } }

  // ---------- the book: rose cloth cover, cream page, tabs down the side ----------
  var TABS = [
    { k: 'cats', col: '#e2873a' }, { k: 'garden', col: '#6aa361' }, { k: 'kitchen', col: '#e7b75f' }, { k: 'holidays', col: '#d2363c' },
    { k: 'home', col: '#7fa7a0' }, { k: 'friends', col: '#8f7bc0' }, { k: 'us', col: '#e46f8b' }, { k: 'notes', col: '#c9a27a' }, { k: 'photos', col: '#5d7fa6' }
  ];
  function tabIcon(k, x, y, col) {
    var f = {
      cats: function () { R(x, y + 2, 7, 5, col); R(x, y, 1, 2, col); R(x + 3, y, 1, 2, col); R(x + 1, y + 3, 1, 1, '#fff'); R(x + 3, y + 3, 1, 1, '#fff'); R(x + 6, y + 1, 1, 3, col); },
      garden: function () { R(x + 3, y + 3, 1, 4, col); R(x, y + 1, 3, 2, col); R(x + 4, y, 3, 3, col); },
      kitchen: function () { R(x, y + 3, 6, 4, col); R(x - 1, y + 3, 8, 1, col); R(x + 6, y + 4, 2, 1, col); R(x + 1, y, 1, 2, col); R(x + 4, y, 1, 2, col); },
      holidays: function () { R(x + 3, y, 1, 1, col); R(x + 2, y + 1, 3, 2, col); R(x + 1, y + 3, 5, 2, col); R(x, y + 5, 7, 1, col); R(x + 3, y + 6, 1, 1, col); },
      home: function () { R(x + 3, y, 1, 1, col); R(x + 2, y + 1, 3, 1, col); R(x + 1, y + 2, 5, 1, col); R(x, y + 3, 7, 1, col); R(x + 1, y + 4, 5, 3, col); R(x + 3, y + 5, 1, 2, '#fff'); },
      friends: function () { R(x, y + 1, 3, 3, col); R(x - 1, y + 4, 5, 3, col); R(x + 4, y, 3, 3, col); R(x + 3, y + 4, 5, 3, col); },
      us: function () { heart(x, y, col); },
      notes: function () { R(x, y + 1, 7, 5, col); R(x + 1, y + 2, 2, 1, '#fff'); R(x + 1, y + 4, 4, 1, '#fff'); R(x + 3, y + 1, 1, 5, 'rgba(0,0,0,.15)'); },
      photos: function () { R(x, y + 2, 7, 5, col); R(x + 2, y + 1, 3, 1, col); R(x + 2, y + 3, 3, 3, '#fff'); R(x + 3, y + 4, 1, 1, col); }
    };
    f[k]();
  }
  function book(W, H, active) {
    var x = 8, y = 24, w = W - 30, h = H - 34;
    R(x - 2, y + 3, w + 4, h, 'rgba(34,18,28,.45)');
    R(x - 4, y - 3, w + 6, h + 6, P.cloth); R(x - 4, y - 3, w + 6, 1, P.clothHi); R(x - 4, y + h + 2, w + 6, 1, P.clothSh);
    for (var k = 0; k < 40; k++) R(x - 4 + hash(k, 1) * (w + 6), y - 3 + hash(1, k) * (h + 6), 1, 1, 'rgba(255,255,255,.12)'); // cloth weave
    // tabs down the right edge, the open one pulled out and joined to the page
    TABS.forEach(function (tb, i) {
      var ty = y + 6 + i * Math.floor((h - 12) / 9), on = tb.k === active, tx = x + w + (on ? 0 : 1);
      R(tx, ty, on ? 16 : 13, 18, on ? P.page : tb.col); R(tx, ty + 17, on ? 16 : 13, 1, 'rgba(0,0,0,.18)');
      if (!on) R(tx, ty, 13, 1, 'rgba(255,255,255,.3)');
      tabIcon(tb.k, tx + (on ? 5 : 3), ty + 6, on ? tb.col : '#fff');
    });
    // the page block: a few page edges peek under the top page
    R(x, y + 2, w, h - 1, P.pageSh); R(x + 1, y + 1, w - 1, h - 1, '#f5ead6');
    R(x, y, w, h - 2, P.page);
    for (var g = 0; g < 26; g++) R(x + 4 + hash(g, 7) * (w - 8), y + 4 + hash(7, g) * (h - 12), 1, 1, 'rgba(180,140,100,.12)'); // paper flecks
    R(x, y, 3, h - 2, 'rgba(160,110,80,.12)'); // the gutter shadow
    return { x: x, y: y, w: w, h: h };
  }
  function tape(x, y, w, a, col) { c.save(); c.translate(x, y); c.rotate(a); R(-w / 2, -3, w, 6, col || P.tape); R(-w / 2, -3, w, 1, 'rgba(255,255,255,.35)'); for (var i = -w / 2; i < w / 2; i += 2) R(i, 2, 1, 1, 'rgba(255,255,255,.3)'); c.restore(); }
  function pageFoot(b, page, of) {
    var y = b.y + b.h - 18;
    R(b.x + 8, y - 3, b.w - 16, 1, P.pageLine);
    backHint(b.x + 8, y);
    chev(b.x + b.w - 52, y + 2, page > 1 ? P.rose : P.edge, true); txt(page + ' / ' + of, b.x + b.w - 30, y + 3, P.soft, 6, 'center'); chev(b.x + b.w - 14, y + 2, P.rose, false);
    // the turned-up page corner, tap to turn
    var cx = b.x + b.w, cy = b.y + b.h - 2; c.fillStyle = P.pageSh; c.beginPath(); c.moveTo(cx - 9, cy); c.lineTo(cx, cy - 9); c.lineTo(cx - 9, cy - 9); c.fill(); c.fillStyle = 'rgba(0,0,0,.12)'; c.beginPath(); c.moveTo(cx - 9, cy); c.lineTo(cx, cy - 9); c.lineTo(cx, cy); c.fill();
  }

  // ---------- a snapshot: the moment redrawn small from its recipe ----------
  function snapLouie(x, y, w, h, t) { // Louie loafing on the pink sofa she placed, morning light
    R(x, y, w, h, '#f1e2cd'); R(x, y + h * .62, w, h * .38, '#c88d5a');
    for (var k = 0; k < 5; k++) R(x, y + h * .62 + k * 5, w, 1, '#b07a4a');
    R(x + w - 30, y + 6, 22, 24, '#fff1e2'); R(x + w - 28, y + 8, 18, 20, '#f6d9a8'); R(x + w - 19, y + 8, 1, 20, '#fff1e2'); // a window with morning light
    c.fillStyle = 'rgba(255,220,150,.25)'; c.beginPath(); c.moveTo(x + w - 28, y + 28); c.lineTo(x + w - 10, y + 28); c.lineTo(x + w - 30, y + h); c.lineTo(x + w - 56, y + h); c.fill();
    R(x + 8, y + 8, 14, 11, '#fff6ea'); R(x + 10, y + 10, 10, 7, '#7fa7a0'); R(x + 12, y + 13, 6, 4, '#e7b75f'); // a little framed print
    // the pink sofa
    R(x + 10, y + h - 30, 62, 16, '#e46f8b'); R(x + 10, y + h - 30, 62, 2, '#f39bb0'); R(x + 6, y + h - 24, 8, 16, '#c95a75'); R(x + 68, y + h - 24, 8, 16, '#c95a75');
    R(x + 12, y + h - 16, 58, 6, '#d65f7c'); R(x + 10, y + h - 10, 4, 3, '#6b4a30'); R(x + 68, y + h - 10, 4, 3, '#6b4a30');
    if (window.LOUIE_LOAF) sprite(window.LOUIE_LOAF, window.LOUIE_PAL, x + 26, y + h - 30 - 10);
    R(x + 54, y + h - 34, 10, 9, '#f6cd5c'); R(x + 54, y + h - 34, 10, 1, '#fff3c4'); // a cushion
  }
  function snapFrame(x, y, w, h, a, draw, t) { // white border, soft shadow, taped corners
    c.save(); c.translate(x + w / 2, y + h / 2); c.rotate(a); c.translate(-w / 2, -h / 2);
    R(2, 3, w, h, 'rgba(90,60,40,.22)'); R(0, 0, w, h, '#ffffff'); R(0, h - 1, w, 1, '#e6dbd0');
    c.save(); c.beginPath(); c.rect(3, 3, w - 6, h - 6); c.clip(); draw(3, 3, w - 6, h - 6, t); c.restore();
    c.restore();
    tape(x + 4, y + 2, 16, -.6); tape(x + w - 4, y + 2, 16, .6, P.tape2);
  }
  function dottedFrame(x, y, w, h) {
    c.strokeStyle = '#d9c4a6'; c.setLineDash([3, 3]); c.strokeRect(x + .5, y + .5, w - 1, h - 1); c.setLineDash([]);
    txt('?', x + w / 2, y + h / 2 - 5, '#d9c4a6', 10, 'center');
  }

  // ---------- reward ribbon: steps at 3, 6 and 10 with the pieces drawn small ----------
  function ribbon(x, y, w, got) {
    R(x, y, w, 30, '#fde3ea'); R(x, y + 29, w, 1, '#f1b8c6');
    c.fillStyle = '#fde3ea'; c.beginPath(); c.moveTo(x + w, y); c.lineTo(x + w + 5, y + 15); c.lineTo(x + w, y + 30); c.fill(); // ribbon tail
    var steps = [[3, 'beds'], [6, 'wall'], [10, 'tree']], sw = (w - 8) / 3;
    steps.forEach(function (s, i) {
      var sx = x + 4 + i * sw, done = got >= s[0];
      R(sx, y + 4, 22, 22, done ? '#fff6ea' : 'rgba(255,255,255,.5)'); c.strokeStyle = done ? P.rose : '#e8b6c3'; c.strokeRect(sx + .5, y + 4.5, 21, 21);
      if (!done) c.globalAlpha = .35;
      if (s[1] === 'beds') { R(sx + 2, y + 15, 9, 6, '#7fa7a0'); R(sx + 3, y + 16, 7, 3, '#a8cbc0'); R(sx + 11, y + 13, 9, 8, '#e46f8b'); R(sx + 12, y + 14, 7, 4, '#f39bb0'); }
      if (s[1] === 'wall') { [[2, 6, 7, 6, '#e2873a'], [11, 6, 8, 9, '#7fa7a0'], [3, 14, 6, 7, '#e7b75f'], [11, 17, 8, 4, '#e46f8b']].forEach(function (f) { R(sx + f[0], y + f[1], f[2], f[3], '#8e5a37'); R(sx + f[0] + 1, y + f[1] + 1, f[2] - 2, f[3] - 2, f[4]); }); }
      if (s[1] === 'tree') { R(sx + 9, y + 8, 3, 15, '#c9a27a'); R(sx + 4, y + 7, 13, 3, '#8e5a37'); R(sx + 3, y + 14, 9, 3, '#8e5a37'); R(sx + 10, y + 19, 9, 3, '#8e5a37'); R(sx + 3, y + 22, 16, 2, '#8e5a37'); }
      c.globalAlpha = 1;
      txt(String(s[0]), sx + 26, y + 6, done ? P.roseSh : '#d59aaa', 7);
      if (done) { R(sx + 26, y + 17, 2, 2, '#6aa361'); R(sx + 28, y + 19, 2, 2, '#6aa361'); R(sx + 30, y + 17, 2, 2, '#6aa361'); R(sx + 32, y + 15, 2, 2, '#6aa361'); }
      else c.font = '10px "VT323", monospace', c.fillStyle = '#c98a9a', c.textBaseline = 'top', c.textAlign = 'left', c.fillText(got + '/' + s[0], sx + 26, y + 15);
    });
  }

  function pageState(W, H, t) {
    var b = book(W, H, 'cats'), x = b.x + 8, w = b.w - 16;
    // chapter title in the corner, like a scrapbook heading
    txt('THE CATS', x, b.y + 8, P.ink, 8); txt('4 OF 10', b.x + b.w - 8, b.y + 9, P.soft, 6, 'right');
    ribbon(x, b.y + 22, w - 6, 4);
    var tiny = c.font; c.font = '10px "VT323", monospace'; c.fillStyle = P.roseSh; c.textAlign = 'left'; c.textBaseline = 'top'; c.fillText('Cat beds are in your catalog', x + 2, b.y + 54);
    // moment 1: reached
    var sy = b.y + 70, sw = w - 34, sh = 72;
    snapFrame(x + 6, sy, sw, sh, -.03, snapLouie, t);
    hand('Louie naps on the new sofa', x + 8, sy + sh + 16, 12);
    hand('Dec 26, 2026', x + 8, sy + sh + 27, 11, P.handSoft);
    heart(x + w - 14, sy + sh + 18, P.roseHi);
    // moment 2: not reached yet, a dotted frame with ???
    var dy = sy + sh + 36;
    dottedFrame(x + 20, dy, sw - 14, Math.max(30, b.y + b.h - 26 - dy - 16));
    hand('???', x + 20, b.y + b.h - 26, 12, '#c9b49a');
    pageFoot(b, 1, 5);
  }

  // ---------- Note found ----------
  function noteState(W, H, t) {
    if (window.drawDecorate) window.drawDecorate(c, W, H, t, 'home');
    R(0, 0, W, H, 'rgba(34,18,28,.6)');
    // soft sparkles around the paper
    for (var s = 0; s < 10; s++) { var on = (Math.floor(t / 2) + s) % 3 !== 0, sx = 14 + hash(s, 1) * (W - 28), sy = 30 + hash(1, s) * (H - 90); if (on) { R(sx - 2, sy, 5, 1, '#fff3c4'); R(sx, sy - 2, 1, 5, '#fff3c4'); } }
    // the pill: where it was found
    var pw = 168, px = (W - pw) / 2; R(px, 20, pw, 16, P.rose); R(px, 20, pw, 1, P.roseHi); R(px, 35, pw, 1, P.roseSh);
    heart(px + 8, 25, '#fff'); txt('A NOTE FROM KEEGAN', px + 19, 25, '#fff', 6);
    // the folded paper, opened: three panels with fold creases, a little tilted shadow
    var nx = 22, ny = 46, nw = W - 44, nh = H - 112;
    R(nx + 3, ny + 4, nw, nh, 'rgba(20,10,16,.4)');
    R(nx, ny, nw, nh, P.paper);
    var third = Math.round(nh / 3);
    R(nx, ny + third, nw, 1, '#e9dcc4'); R(nx, ny + third + 1, nw, 2, 'rgba(255,255,255,.9)');
    R(nx, ny + third * 2, nw, 1, '#e9dcc4'); R(nx, ny + third * 2 + 1, nw, 2, 'rgba(255,255,255,.9)');
    R(nx, ny, nw, third, 'rgba(240,226,200,.35)'); // the top fold still curls a touch
    for (var l = ny + 34; l < ny + nh - 10; l += 15) R(nx + 10, l, nw - 20, 1, 'rgba(143,179,204,.35)'); // faint ruled lines
    R(nx + 18, ny + 6, 1, nh - 12, 'rgba(228,111,139,.25)'); // the margin line
    // a heart sticker that held it shut, now peeled to the side
    heart(nx + nw - 26, ny + 8, P.rose, 2); R(nx + nw - 24, ny + 10, 2, 2, '#ffd0dc');
    // the words: a placeholder in his handwriting style. The real note text lives only in the private data.
    var lx = nx + 24, ly = ny + 32;
    hand('Sarah,', lx, ly, 14);
    ['(Keegan’s real note', 'goes here. He writes', 'it in the Notes for', 'Sarah sheet. Only the', 'finished game has it.)'].forEach(function (s, i) { hand(s, lx, ly + 15 + i * 15, 12); });
    hand('Love,', lx + 8, ly + 15 * 6 + 6, 13);
    var kw = hand('Keegan', lx + 26, ly + 15 * 7 + 4, 15, '#9e3a52');
    heart(lx + 26 + kw + 5, ly + 15 * 7 - 6, P.rose);
    hand('Dec 25 · under the tree', nx + nw - 10, ny + nh - 8, 10, P.handSoft, 'right');
    // buttons
    btn(22, H - 56, W - 44, 'PUT IN THE BOOK', true);
    c.font = '10px "VT323", monospace'; c.fillStyle = 'rgba(255,241,226,.85)'; c.textAlign = 'center'; c.textBaseline = 'top';
    c.fillText('Read it again any time in Notes', W / 2, H - 38);
  }

  // ---------- the Notes tab ----------
  function folded(x, y, w, h, found, label, date, t, k) {
    if (!found) { c.strokeStyle = '#d9c4a6'; c.setLineDash([3, 3]); c.strokeRect(x + .5, y + .5, w - 1, h - 1); c.setLineDash([]); txt('?', x + w / 2, y + h / 2 - 9, '#d9c4a6', 8, 'center'); c.font = '10px "VT323", monospace'; c.fillStyle = '#c9b49a'; c.textAlign = 'center'; c.textBaseline = 'top'; c.fillText('still hidden', x + w / 2, y + h / 2 + 2); return; }
    var a = (hash(k, 3) - .5) * .08;
    c.save(); c.translate(x + w / 2, y + h / 2); c.rotate(a); c.translate(-w / 2, -h / 2);
    R(2, 3, w, h, 'rgba(90,60,40,.2)'); R(0, 0, w, h, P.paper);
    c.fillStyle = '#f1e4cc'; c.beginPath(); c.moveTo(0, 0); c.lineTo(w / 2, h * .42); c.lineTo(w, 0); c.fill(); // the folded flap
    c.strokeStyle = '#e2d2b4'; c.beginPath(); c.moveTo(0, 0); c.lineTo(w / 2, h * .42); c.lineTo(w, 0); c.stroke();
    heart(w / 2 - 3.5, h * .42 - 3, P.rose); // the heart sticker seal
    c.restore();
    hand(label, x + w / 2, y + h - 12, 10, P.hand, 'center'); hand(date, x + w / 2, y + h - 3, 10, P.handSoft, 'center');
  }
  function notesState(W, H, t) {
    var b = book(W, H, 'notes'), x = b.x + 8, w = b.w - 16;
    txt('NOTES', x, b.y + 8, P.ink, 8); txt('3 OF 20 FOUND', b.x + b.w - 8, b.y + 9, P.soft, 6, 'right');
    c.font = '10px "VT323", monospace'; c.fillStyle = P.roseSh; c.textAlign = 'left'; c.textBaseline = 'top'; c.fillText('In the order you found them', x, b.y + 20);
    var gw = Math.floor((w - 8) / 2), gh = 54, gy = b.y + 36;
    var notes = [[true, 'under the tree', 'Dec 25'], [true, 'in the dresser', 'Dec 27'], [true, 'under a pillow', 'Dec 30'], [false], [false], [false]];
    notes.forEach(function (n, i) { var col = i % 2, row = Math.floor(i / 2); folded(x + col * (gw + 8), gy + row * (gh + 10), gw, gh, n[0], n[1], n[2], t, i); });
    // the first note is tapped: a soft rose ring shows it will open full size
    c.strokeStyle = P.rose; c.lineWidth = 2; c.strokeRect(x - 2, gy - 2, gw + 4, gh + 4); c.lineWidth = 1;
    pageFoot(b, 1, 4);
  }

  window.drawMemoryBook = function (ctx, W, H, t, st) {
    c = ctx; t = t || 0; st = st || 'page';
    if (st === 'note') { noteState(W, H, t); c = ctx; return; }
    if (window.drawDecorate) window.drawDecorate(ctx, W, H, t, 'home');
    c = ctx; c.imageSmoothingEnabled = false;
    R(0, 0, W, H, 'rgba(34,18,28,.62)');
    if (st === 'notes') notesState(W, H, t); else pageState(W, H, t);
  };
})();
