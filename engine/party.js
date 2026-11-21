// Studio party: who leads, Select cycling the lead, and the Pokémon-style party card list, for every game
// (studio-bible/ui.md, Party menu; controls.md, Buttons: Select). Set Nov 21, 2026 from Black Lantern spec 002.
// Knows nothing about any game. The game keeps its own party and lead index, says what a card shows,
// its words and its colors, and draws on its own 240 px canvas.
//
//   StudioParty.next(n, cur, canLead)    the next seat after cur that can lead (seat order, wraps), or cur
//   StudioParty.canSwap(s)               may the lead change now? s: {battle, dialog, menu, cutscene, moving, busy}
//                                        (any true: no). Presses while it can't are ignored, not saved up.
//
//   const list = StudioParty.list({
//     count(),                 how many cards (seat order, top to bottom; cards never move)
//     lead(),                  seat index of the lead
//     cycle(),                 Select pressed: the game moves the lead (usually to StudioParty.next(...))
//     actions(i),              popup rows for card i: [{label, dis, why, run()}]; run may return a promise
//     close(),                 B on the cards: leave the list
//     pulse(i),                true while card i should blink (low-health pulse)
//     paint: {
//       header(ctx, r),                      the box above the cards
//       card(ctx, i, r, st),                 one card; st: {on, lead, blink, hit(rect, fn)} — hit() makes a
//                                            spot tappable this frame (status chips)
//       detail(ctx, r, i, st),               the box under the cards; st: {note, why}: a tapped chip's line,
//                                            or the highlighted popup row's reason; avoid: the popup's
//                                            rect while it's open (keep text clear of it), else null
//     },
//     colors: {box, border, shadow, on, text, dim, cursor},   the popup's look
//     font: '16px "VT323"',    popup row font
//     headerH, cardH, gap, detailMin,        layout in canvas pixels (defaults 18, 50, 4, 40)
//   });
//   list.press(kind)           'up' 'down' 'a' 'b' 'select' (others ignored)
//   list.tap(x, y)             a tap in canvas pixels
//   list.draw(ctx, w, h, now)  once per frame
//   list.sel, list.pop         highlighted card; open popup {sel} or null
//   list.note                  the game may set a line for the detail box (cleared when the cursor moves)
//   list.reset(sel)            cursor to sel, popup closed
(function () {
  var BLINK_MS = 400;   // low-health pulse: on, off, on...

  function next(n, cur, canLead) {
    for (var k = 1; k <= n; k++) { var i = (cur + k) % n; if (!canLead || canLead(i)) return i; }
    return cur;
  }
  function canSwap(s) { return !(s.battle || s.dialog || s.menu || s.cutscene || s.moving || s.busy); }

  var inside = function (r, x, y) { return x >= r.x && y >= r.y && x < r.x + r.w && y < r.y + r.h; };

  function list(o) {
    var L = { sel: 0, pop: null, note: '', hits: [], rects: null, busy: false };
    var headerH = o.headerH || 18, cardH = o.cardH || 50, gap = o.gap == null ? 4 : o.gap, detailMin = o.detailMin || 40;
    var n = function () { return o.count(); };
    var firstOn = function (rows) { for (var i = 0; i < rows.length; i++) if (!rows[i].dis) return i; return 0; };

    L.reset = function (sel) { L.sel = sel || 0; L.pop = null; L.note = ''; };
    function move(d) { var c = n(); L.sel = (L.sel + d + c) % c; L.note = ''; }
    function openPop() { var rows = o.actions(L.sel); L.pop = { sel: firstOn(rows), rows: rows }; L.note = ''; }
    function run(row) {
      if (!row || row.dis) return;
      L.pop = null;
      var r = row.run && row.run();
      if (r && r.then) { L.busy = true; r.then(function () { L.busy = false; }, function () { L.busy = false; }); }
    }

    L.press = function (k) {
      if (L.busy) return;
      if (k === 'select') { o.cycle(); if (L.pop) L.pop.rows = o.actions(L.sel); return; }
      if (L.pop) {
        var rows = L.pop.rows, m = rows.length;
        if (k === 'up') L.pop.sel = (L.pop.sel - 1 + m) % m;
        else if (k === 'down') L.pop.sel = (L.pop.sel + 1) % m;
        else if (k === 'a') run(rows[L.pop.sel]);
        else if (k === 'b') L.pop = null;
        return;
      }
      if (k === 'up') move(-1);
      else if (k === 'down') move(1);
      else if (k === 'a') openPop();
      else if (k === 'b') o.close();
    };

    L.tap = function (x, y) {
      if (L.busy || !L.rects) return;
      if (L.pop) {
        var pr = L.rects.pop;
        if (pr && inside(pr.box, x, y)) {
          for (var j = 0; j < pr.rows.length; j++) if (inside(pr.rows[j], x, y)) { L.pop.sel = j; run(L.pop.rows[j]); return; }
          return;
        }
        L.pop = null; return;   // a tap outside the popup closes it, like B
      }
      for (var h = L.hits.length - 1; h >= 0; h--) if (inside(L.hits[h].r, x, y)) { var c = L.hits[h]; if (c.i !== L.sel) { L.sel = c.i; } c.fn(); return; }
      var cards = L.rects.cards;
      for (var i = 0; i < cards.length; i++) if (inside(cards[i], x, y)) { if (i === L.sel) openPop(); else { L.sel = i; L.note = ''; } return; }
    };

    function cursor(ctx, x, y) {   // ▶ drawn in pixels, so it never depends on a font
      ctx.fillStyle = o.colors.cursor;
      for (var k = 0; k < 5; k++) ctx.fillRect(x + k, y + k, 1, 9 - 2 * k);
    }

    L.draw = function (ctx, w, h, now) {
      var c = n(); if (L.sel >= c) L.sel = 0;
      var pad = 4, top = pad + headerH + 4;
      // when the screen is short, the cards scroll so the highlighted one stays in view
      var room = h - top - detailMin - pad, all = c * (cardH + gap);
      var off = 0;
      if (all > room) { var want = L.sel * (cardH + gap); off = Math.max(0, Math.min(want - Math.max(0, room - cardH - gap), all - Math.max(room, cardH + gap))); }
      L.hits = [];
      var rects = { header: { x: pad, y: pad, w: w - 2 * pad, h: headerH }, cards: [], pop: null };
      var blinkOn = Math.floor(now / BLINK_MS) % 2 === 0;
      var lead = o.lead();
      var cardsTop = top, cardsBottom = all > room ? top + Math.max(room, cardH + gap) : top + all;
      ctx.save(); ctx.beginPath(); ctx.rect(0, cardsTop, w, cardsBottom - cardsTop); ctx.clip();
      for (var i = 0; i < c; i++) {
        var r = { x: pad, y: top + i * (cardH + gap) - off, w: w - 2 * pad, h: cardH };
        rects.cards.push(r);
        (function (i) {
          o.paint.card(ctx, i, r, { on: i === L.sel, lead: i === lead, blink: !!(o.pulse && o.pulse(i)) && blinkOn,
            hit: function (rr, fn) { L.hits.push({ r: rr, fn: fn, i: i }); } });
        })(i);
        if (i === L.sel) cursor(ctx, r.x + 2, r.y + Math.round(cardH / 2) - 4);
      }
      ctx.restore();
      o.paint.header(ctx, rects.header);
      var d = { x: pad, y: cardsBottom, w: w - 2 * pad, h: h - cardsBottom - pad };
      var why = L.pop && L.pop.rows[L.pop.sel] && L.pop.rows[L.pop.sel].dis ? L.pop.rows[L.pop.sel].why || '' : '';
      var box = null;
      if (L.pop) {
        var rh = 16, pw = 92, ph = L.pop.rows.length * rh + 6, sc = rects.cards[L.sel];
        box = { x: w - pad - pw - 4, y: Math.max(pad, Math.min(sc.y + sc.h - 4, h - pad - ph - 3)), w: pw, h: ph };
      }
      // avoid: where the popup covers the screen, so the detail box can keep its text beside it
      if (d.h >= 12) o.paint.detail(ctx, d, L.sel, { note: L.note, why: why, avoid: box });
      if (L.pop) {
        var rows = L.pop.rows, px = box.x, py = box.y;
        var C = o.colors, rr = [];
        ctx.fillStyle = C.shadow; ctx.fillRect(px + 3, py + 3, pw, ph);
        ctx.fillStyle = C.border; ctx.fillRect(px, py, pw, ph);
        ctx.fillStyle = C.box; ctx.fillRect(px + 2, py + 2, pw - 4, ph - 4);
        ctx.font = o.font; ctx.textBaseline = 'top';
        rows.forEach(function (row, j) {
          var y = py + 3 + j * rh, on = j === L.pop.sel;
          rr.push({ x: px, y: y, w: pw, h: rh });
          if (on) { ctx.fillStyle = C.on; ctx.fillRect(px + 2, y, pw - 4, rh - 1); cursor(ctx, px + 5, y + 3); }
          ctx.fillStyle = row.dis ? C.dim : C.text; ctx.fillText(row.label, px + 14, y - 1);
        });
        rects.pop = { box: box, rows: rr };
      }
      L.rects = rects;
    };
    return L;
  }

  window.StudioParty = { next: next, canSwap: canSwap, list: list };
})();
