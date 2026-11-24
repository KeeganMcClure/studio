// Life After screens kit: everything is drawn on the 240 px canvas, on the cardboard menu surface (bible.md, Art,
// Menu surface; mockup 05). Cards with a cursor, worked by the D-pad or by tapping (controls.md: tapping a menu row
// also works), a header with the step, a key help line, a short note at the bottom, and a yes / no question whose
// cursor starts on "Not yet" (studio-bible/play.md, No accidental point of no return). window.LAU.
(function () {
  var P = LA.P, R = LA.R, px = LA.px;
  var F8 = '8px "Press Start 2P"', F16 = '16px VT323', F12 = '12px VT323';
  var U = { F8: F8, F16: F16, F12: F12, hits: [], W: 240, H: 300, g: null };

  // ---- taps: each frame the screens register the spots that can be tapped ----
  U.clearHits = function () { U.hits = []; };
  U.hit = function (x, y, w, h, fn) { U.hits.push({ x: x, y: y, w: w, h: h, fn: fn }); };
  U.tap = function (x, y) {
    for (var i = U.hits.length - 1; i >= 0; i--) { var r = U.hits[i]; if (x >= r.x && y >= r.y && x < r.x + r.w && y < r.y + r.h) { r.fn(x, y); return true; } }
    return false;
  };

  U.text = function (t, x, y, font, col) { var g = U.g; g.font = font; g.textBaseline = 'top'; g.fillStyle = col; g.fillText(t, x, y); return g.measureText(t).width; };
  U.width = function (t, font) { U.g.font = font; return U.g.measureText(t).width; };
  U.center = function (t, y, font, col) { U.text(t, Math.round((U.W - U.width(t, font)) / 2), y, font, col); };
  // a ▶ in pixels, so it never depends on a font
  U.arrow = function (x, y, col, left) { for (var k = 0; k < 4; k++) R(U.g, col, left ? x + 3 - k : x + k, y + k, 1, 7 - 2 * k); };

  // ---- header: the step's name, the L and R steps (tappable), and progress pips ----
  U.header = function (title, o) {
    o = o || {};
    var g = U.g, W = U.W;
    R(g, P.card, 0, 0, W, 18); R(g, '#4e5854', 0, 18, W, 1);
    if (o.l) { U.text('<L', 4, 5, F8, P.dim); U.hit(0, 0, 34, 20, o.l); }
    if (o.r) { U.text('R>', W - 20, 5, F8, o.rDim ? '#4e5854' : P.dim); U.hit(W - 34, 0, 34, 20, o.r); }
    // a long step name drops the word STEP so it never runs under <L and R> (ui.md, No cut-off names)
    if (U.width(title, F8) > W - 56) title = title.replace(/^STEP /, '');
    if (U.width(title, F8) > W - 56) title = title.replace(/ OF \d+ ·/, ' ·');
    U.center(title, 5, F8, P.warm);
    if (o.steps) for (var i = 0; i < o.steps; i++) R(g, i < o.at ? P.dim : i === o.at ? P.cyan : '#3a4442', W / 2 - o.steps * 4 + 1 + i * 8, 14, 5, 2);
    return 19;
  };
  U.help = function (t) { var g = U.g; R(g, '#101416', 0, U.H - 13, U.W, 13); U.center(t, U.H - 13, F12, P.dim); };

  // ---- a list of cards on cardboard ----
  // items: {title, lines[], value, lr(d), a(), check, dim, red} ; st: {sel, off}
  function layout(items, w) {
    var g = U.g;
    return items.map(function (it) {
      g.font = F16;
      var lines = [];
      (it.lines || []).forEach(function (l) { lines = lines.concat(LA.wrap(g, l, w - 12 - (it.lr && !it.title ? 30 : 0))); });
      var h = 6 + (it.title ? 11 : 0) + lines.length * 13 + (it.title && !lines.length ? 3 : 2);
      if (!it.title && lines.length === 1) h = 18;
      return { it: it, lines: lines, h: h };
    });
  }
  U.list = function (box, items, st, o) {
    o = o || {};
    var g = U.g;
    LA.cardboard(g, box.x, box.y, box.w, box.h);
    var x = box.x + 8, w = box.w - 16, L = layout(items, w), gap = 5, top = box.y + 6, room = box.h - 12;
    if (st.sel >= items.length) st.sel = items.length - 1;
    if (st.sel < 0) st.sel = 0;
    var ys = [], y = 0;
    L.forEach(function (c) { ys.push(y); y += c.h + gap; });
    var total = y - gap;
    // keep the picked card in view
    if (st.off == null) st.off = 0;
    var cy = ys[st.sel] || 0, ch = L[st.sel] ? L[st.sel].h : 0;
    if (cy - st.off < 0) st.off = cy;
    if (cy + ch - st.off > room) st.off = cy + ch - room;
    st.off = Math.max(0, Math.min(st.off, Math.max(0, total - room)));
    g.save(); g.beginPath(); g.rect(box.x + 2, box.y + 3, box.w - 4, box.h - 6); g.clip();
    L.forEach(function (c, i) {
      var cy = top + ys[i] - st.off, it = c.it, on = i === st.sel;
      if (cy > box.y + box.h || cy + c.h < box.y) return;
      LA.card(g, x, cy, w, c.h, on);
      var ty = cy + 4, col = it.dim ? '#6a5a40' : P.marker;
      if (it.title) { U.text(it.title, x + 6, ty + 1, F8, it.dim ? '#7a5a40' : P.markR); ty += 11; }
      c.lines.forEach(function (l, k) { U.text(l, x + 6, ty - 1 + k * 13, F16, k === 0 && it.red ? P.markR : col); });
      if (it.check) { var cx0 = x + w - 14; R(g, P.marker, cx0, cy + 4, 9, 9); R(g, '#ece6d8', cx0 + 1, cy + 5, 7, 7); R(g, P.markR, cx0 + 2, cy + 8, 2, 2); R(g, P.markR, cx0 + 3, cy + 9, 1, 2); R(g, P.markR, cx0 + 4, cy + 7, 1, 3); R(g, P.markR, cx0 + 5, cy + 6, 1, 2); R(g, P.markR, cx0 + 6, cy + 5, 1, 2); }
      if (it.value != null) {
        var vw = U.width(String(it.value), F16), vx = x + w - 8 - vw - (it.lr ? 12 : 0), vy = it.title ? cy + 2 : cy + 1;
        U.text(String(it.value), vx, vy, F16, P.markR);
        if (it.lr) {
          U.arrow(vx - 10, vy + 4, on ? P.marker : '#86683c', true); U.arrow(x + w - 12, vy + 4, on ? P.marker : '#86683c');
          (function (i) {
            U.hit(vx - 16, cy, 16, Math.min(c.h, 20), function () { st.sel = i; it.lr(-1); });
            U.hit(x + w - 18, cy, 18, Math.min(c.h, 20), function () { st.sel = i; it.lr(1); });
          })(i);
        }
      }
      (function (i) {
        var vy0 = Math.max(cy, box.y), vy1 = Math.min(cy + c.h, box.y + box.h);
        if (vy1 > vy0) U.hits.splice(U.hits.length - (it.lr && it.value != null ? 2 : 0), 0, { x: x, y: vy0, w: w, h: vy1 - vy0, fn: function () { st.sel = i; if (it.a) it.a(); else if (it.lr) it.lr(1); } });
      })(i);
    });
    g.restore();
    if (total > room) {
      if (st.off > 0) U.text('▲', box.x + box.w - 13, box.y + 4, F8, P.marker);
      if (st.off < total - room) U.text('▼', box.x + box.w - 13, box.y + box.h - 12, F8, P.marker);
    }
  };
  // D-pad in a list: up and down move, left and right change a value, A picks
  U.listPress = function (k, items, st) {
    var it = items[st.sel];
    if (k === 'up') { st.sel = (st.sel - 1 + items.length) % items.length; return true; }
    if (k === 'down') { st.sel = (st.sel + 1) % items.length; return true; }
    if ((k === 'left' || k === 'right') && it && it.lr) { it.lr(k === 'left' ? -1 : 1); return true; }
    if (k === 'a' && it) { if (it.a) it.a(); else if (it.lr) it.lr(1); return true; }
    return false;
  };

  // ---- a short note at the bottom of the screen ----
  var note = null;
  U.toast = function (t, ms) { note = { t: t, until: performance.now() + (ms || 2200) }; };
  U.drawToast = function (now) {
    if (!note || now > note.until) { note = null; return; }
    var g = U.g; g.font = F16;
    var lines = LA.wrap(g, note.t, U.W - 28), h = 8 + lines.length * 13, y = U.H - h - 18;
    R(g, 'rgba(0,0,0,.4)', 8, y + 2, U.W - 14, h); R(g, '#101416', 6, y, U.W - 12, h); R(g, P.line, 6, y, U.W - 12, 1); R(g, P.line, 6, y, 1, h);
    R(g, '#4e5854', 6, y + h - 1, U.W - 12, 1); R(g, '#4e5854', U.W - 7, y, 1, h);
    lines.forEach(function (l, i) { U.text(l, 12, y + 3 + i * 13, F16, P.text); });
  };

  // ---- a question with choices (the narration box look from mockup 04) ----
  // q: {text, choices: [{label, run}], sel}
  U.drawAsk = function (q) {
    var g = U.g; g.font = F16;
    var lines = LA.wrap(g, q.text, U.W - 24), h = 10 + lines.length * 13 + q.choices.length * 16, y = Math.round((U.H - h) / 2);
    R(g, 'rgba(8,10,12,.6)', 0, 0, U.W, U.H);
    R(g, 'rgba(0,0,0,.4)', 5, y + 2, U.W - 8, h); R(g, '#101416', 3, y, U.W - 6, h); R(g, P.line, 3, y, U.W - 6, 1); R(g, P.line, 3, y, 1, h);
    R(g, '#4e5854', 3, y + h - 1, U.W - 6, 1); R(g, '#4e5854', U.W - 4, y, 1, h);
    lines.forEach(function (l, i) { U.text(l, 10, y + 4 + i * 13, F16, P.text); });
    var cy = y + 8 + lines.length * 13;
    U.hit(0, 0, U.W, U.H, function () {});
    q.choices.forEach(function (c, i) {
      var on = i === q.sel;
      if (on) { R(g, P.cardHi, 8, cy + i * 16 - 1, U.W - 16, 15); U.arrow(12, cy + i * 16 + 3, P.cyan); }
      U.text(c.label, 22, cy + i * 16 - 1, F16, on ? P.warm : P.text);
      U.hit(8, cy + i * 16 - 1, U.W - 16, 15, function () { q.sel = i; c.run(); });
    });
  };
  U.askPress = function (q, k) {
    var n = q.choices.length;
    if (k === 'up') q.sel = (q.sel - 1 + n) % n;
    else if (k === 'down') q.sel = (q.sel + 1) % n;
    else if (k === 'a') q.choices[q.sel].run();
    else if (k === 'b') { var no = q.choices.filter(function (c) { return c.no; })[0]; if (no) no.run(); }
  };

  // ---- the narration box (no tab), from mockup 04 ----
  U.narrate = function (lines) {
    var g = U.g, y = U.H - 44;
    R(g, 'rgba(0,0,0,.4)', 5, y + 2, U.W - 8, 40); R(g, '#101416', 3, y, U.W - 6, 40); R(g, P.line, 3, y, U.W - 6, 1); R(g, P.line, 3, y, 1, 40);
    R(g, '#4e5854', 3, y + 39, U.W - 6, 1); R(g, '#4e5854', U.W - 4, y, 1, 40);
    lines.slice(0, 2).forEach(function (l, i) { U.text(l, 10, y + 5 + i * 14, F16, P.text); });
    if (Math.floor(performance.now() / 500) % 2 === 0) U.text('▼', U.W - 16, y + 26, F16, P.warm);
  };

  window.LAU = U;
})();
