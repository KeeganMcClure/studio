// Sarah's Sim screen parts, drawn to the approved mockups at 240 px wide:
//   the top bar (look-iso-v1; Sandbox shows the mode and the home's name, decorate-v1), the view controls (build-v1: floors 1 to 3
//   and the walls button), the tray's catalog, piece and paint states (decorate-v1), the Start menu and Homes (start-menu-v1),
//   the action bubble and progress bar (cooking-v1), and small cards for Coming soon notes and choices.
// Every tappable spot is recorded in G.hits as it's drawn, so taps and the drawing never disagree.
(function () {
  var P = SS.P, R = SS.R, txt = SS.txt;
  function hit(G, x, y, w, h, fn, o) { var e = { x: x, y: y, w: w, h: h, fn: fn }; if (o) for (var k in o) e[k] = o[k]; G.hits.push(e); return e; }
  SS.hit = hit;
  function trayBase(W, y, h) { R(0, y - 2, W, 2, 'rgba(59,36,48,.25)'); R(0, y, W, h, P.tray); R(0, y, W, 1, '#fffaf3'); }
  SS.TRAY_H = { closed: 22, catalog: 110, piece: 78, paint: 112 };

  // ---------- top bar ----------
  SS.drawTopBar = function (G, W) {
    var c = G.c; SS.use(c); R = SS.R; txt = SS.txt;
    if (G.mode === 'sandbox') {
      R(4, 4, 72, 15, 'rgba(255,246,234,.95)'); R(4, 18, 72, 1, P.trayEdge); R(8, 8, 7, 7, '#7fa7a0'); R(9, 9, 3, 2, '#a8cbc0');
      txt('SANDBOX', 19, 8, P.ink, 7);
      var name = G.W.home.name, nw = SS.tw(name, 7) + 22;
      R(W - nw - 4, 4, nw, 15, 'rgba(255,246,234,.95)'); R(W - nw - 4, 18, nw, 1, P.trayEdge); SS.heart(W - nw + 1, 8, P.rose); txt(name, W - nw + 11, 8, P.ink, 7);
      return;
    }
    // Life: the weekday and date, the time (12-hour, like her phone) and coins (spec 006, part A)
    var d = SS.now(), L = G.look, s = SS.dayText(d) + ' ' + SS.timeText(d), w = SS.tw(s, 7) + 22;
    R(4, 4, w, 15, 'rgba(255,246,234,.95)'); R(4, 18, w, 1, P.trayEdge);
    var sun = L.name === 'late night' ? '#8fa6d8' : L.name === 'evening' ? '#f2a65a' : L.name === 'morning' ? '#ffb760' : '#ffd56b';
    if (L.name === 'late night') { c.fillStyle = sun; c.beginPath(); c.arc(11.5, 11.5, 3.5, 0, 7); c.fill(); c.fillStyle = 'rgba(255,246,234,.95)'; c.beginPath(); c.arc(13.5, 10, 3, 0, 7); c.fill(); }
    else { R(8, 8, 7, 7, sun); R(9, 9, 3, 2, '#fff3c4'); }
    txt(s, 19, 8, P.ink, 7);
    var coins = String(G.save.coins || 0), cw = SS.tw(coins, 8) + 22;
    R(W - cw - 4, 4, cw, 15, 'rgba(255,246,234,.95)'); R(W - cw - 4, 18, cw, 1, P.trayEdge);
    c.fillStyle = '#ffd56b'; c.beginPath(); c.arc(W - cw + 5, 11.5, 4, 0, 7); c.fill(); c.fillStyle = '#c78f3e'; c.beginPath(); c.arc(W - cw + 5, 11.5, 4, 0, 7); c.strokeStyle = '#c78f3e'; c.stroke(); R(W - cw + 3, 9, 2, 2, '#fff3a8');
    txt(coins, W - cw + 13, 8, P.ink, 8);
    // the action she's doing and up to 3 lined up, as small icons by the top bar (spec 006, part B)
    var list = (G.act ? [G.act.job.act] : []).concat(G.queue.map(function (j) { return j.act; }));
    list.forEach(function (a, i) {
      var x = 4 + i * 16, y = 22;
      R(x, y, 14, 14, i === 0 && G.act ? P.rose : 'rgba(255,246,234,.95)'); R(x, y + 13, 14, 1, i === 0 && G.act ? P.roseSh : P.trayEdge);
      SS.actIcon(c, a.icon, x + 2, y + 3, i === 0 && G.act);
    });
  };

  // ---------- the view controls ----------
  SS.drawViewControls = function (G, W, top, bottom) {
    var c = G.c, x = W - 24, y = top, room = bottom - top, small = room < 150;
    var fh = small ? 12 : 14;
    R(x, y, 20, fh * 3 + 4, 'rgba(255,246,234,.95)'); R(x, y + fh * 3 + 3, 20, 1, P.trayEdge);
    [3, 2, 1].forEach(function (f, k) {
      var on = f === G.floor + 1, by = y + 2 + k * fh;
      R(x + 2, by, 16, fh - 2, on ? P.rose : P.cell); txt(String(f), x + 10, by + (fh - 8) / 2 + 1, on ? '#fff' : P.ink, 7, 'center');
      hit(G, x, by - 1, 20, fh, function () { G.setFloor(f - 1); });
    });
    y += fh * 3 + 8;
    // the walls button cycles up, cut away and down (bible, Building, View)
    var wh = small ? 18 : 22; R(x, y, 20, wh, 'rgba(255,246,234,.95)'); R(x, y + wh - 1, 20, 1, P.trayEdge);
    var hh = G.walls === 'up' ? 10 : G.walls === 'cut' ? 6 : 2, base = y + wh - 8;
    R(x + 4, base - hh, 3, hh, P.ink); R(x + 8, base - hh + 2, 8, Math.max(1, hh - 2), P.soft); R(x + 3, base, 14, 1, P.ink);
    txt(G.walls === 'up' ? 'UP' : G.walls === 'cut' ? 'CUT' : 'DOWN', x + 10, base + 2, P.ink, 4, 'center');
    hit(G, x, y, 20, wh, function () { G.cycleWalls(); });
    y += wh + 4;
    // the turn button: the whole home a quarter turn clockwise (bible, Building, Turning the home), a curved arrow
    R(x, y, 20, wh, 'rgba(255,246,234,.95)'); R(x, y + wh - 1, 20, 1, P.trayEdge);
    var cx = x + 10, cy = y + (small ? 8 : 9);
    c.strokeStyle = P.ink; c.lineWidth = 1.5; c.beginPath(); c.arc(cx, cy, 5, Math.PI * .95, Math.PI * 2.25); c.stroke(); c.lineWidth = 1;
    var ax = cx + Math.cos(Math.PI * 2.25) * 5, ay = cy + Math.sin(Math.PI * 2.25) * 5;
    c.fillStyle = P.ink; c.beginPath(); c.moveTo(ax + 3, ay - 3); c.lineTo(ax + 1, ay + 3); c.lineTo(ax - 4, ay); c.closePath(); c.fill();
    if (!small) txt('TURN', x + 10, y + wh - 7, P.ink, 4, 'center');
    hit(G, x, y, 20, wh, function () { G.turnHome(); });
    G.turnBtn = { x: x, y: y, w: 20, h: wh };
    y += wh + 4;
    // undo, the last 10 changes in this home (spec 001, part C, Claude default)
    var can = G.undo.length > 0;
    R(x, y, 20, 16, can ? 'rgba(255,246,234,.95)' : 'rgba(255,246,234,.55)'); R(x, y + 15, 20, 1, P.trayEdge); SS.ICONS.undo(x + 4, y + 2, can ? P.ink : P.soft);
    hit(G, x, y, 20, 16, function () { G.doUndo(); });
    y += 20;
    // the menu button in the corner (the Start menu, spec 001, part A)
    R(x, y, 20, 16, 'rgba(255,246,234,.95)'); R(x, y + 15, 20, 1, P.trayEdge); SS.ICONS.menu(x + 4, y + 2, P.ink);
    hit(G, x, y, 20, 16, function () { G.openMenu(); });
  };

  // ---------- tray ----------
  function modeTabs(G, y, right) {
    ['HOME', 'STYLE', 'BUILD'].forEach(function (s, i) {
      var tx = 6 + i * 52, on = G.build.on ? i === 2 : i === 0;
      R(tx, y + 4, 48, 12, on ? P.rose : P.trayEdge); if (on) R(tx, y + 4, 48, 1, P.roseHi);
      txt(s, tx + 24, y + 6, on ? '#fff' : P.ink, 8, 'center');
      hit(G, tx, y + 2, 48, 16, function () {
        if (i === 0) { if (G.build.on) SS.leaveBuild(G); else G.toggleTray(); }
        else if (i === 2) { if (!G.build.on) SS.enterBuild(G); }   // the Build tab (spec 004; build.js)
        else G.toast(s + ' IS COMING SOON', 1600, 'Outfits come in their own part.');
      });
    });
    if (right) txt(right, G.W0 - 6, y + 7, P.soft, 6, 'right');
  }
  SS.drawTray = function (G, W, H) {
    var c = G.c, st = G.trayState(), h = SS.TRAY_H[st], y = H - h;
    trayBase(W, y, h);
    hit(G, 0, y, W, h, function () {}, { block: true });
    if (st === 'closed') { modeTabs(G, y, G.mode === 'life' ? 'TAP TO WALK' : 'HOME: CATALOG'); return y; }
    if (st === 'catalog') return catalogTray(G, W, H, y), y;
    if (st === 'build') return SS.drawBuildTray(G, W, H, y, modeTabs), y;
    if (st === 'piece') return pieceTray(G, W, H, y), y;
    return paintTray(G, W, H, y), y;
  };
  var THUMB = {};
  SS.thumb = function (id, sw) { // a piece drawn small for its card
    var k = id + '|' + (sw || 0); if (THUMB[k]) return THUMB[k];
    var d = SS.DEF[id], tmp = { uid: 'thumb-' + k, id: id, r: 0, sw: sw || 0, props: true, lit: !!d.lamp };
    var sp = SS.pieceSprite(tmp, null, 0, d.kind === 'wall' ? { rot: 0 } : { rot: 0 });
    // trim to what was drawn
    var cv = sp.cv, cx = cv.getContext('2d'), data = cx.getImageData(0, 0, cv.width, cv.height).data, l = cv.width, r = 0, t = cv.height, b = 0;
    for (var yy = 0; yy < cv.height; yy++) for (var xx = 0; xx < cv.width; xx++) if (data[(yy * cv.width + xx) * 4 + 3] > 20) { l = Math.min(l, xx); r = Math.max(r, xx); t = Math.min(t, yy); b = Math.max(b, yy); }
    var out = document.createElement('canvas'); out.width = Math.max(1, r - l + 1); out.height = Math.max(1, b - t + 1); out.getContext('2d').drawImage(cv, l, t, out.width, out.height, 0, 0, out.width, out.height);
    SS.forgetSprite(tmp.uid);
    THUMB[k] = out; return out;
  };
  function drawThumb(c, id, x, y, w, h, sw) {
    var th = SS.thumb(id, sw), k = Math.min(w / th.width, h / th.height, 1);
    var dw = Math.round(th.width * k), dh = Math.round(th.height * k);
    c.imageSmoothingEnabled = k < 1; c.imageSmoothingQuality = 'high';
    c.drawImage(th, Math.round(x + (w - dw) / 2), Math.round(y + h - dh), dw, dh);
    c.imageSmoothingEnabled = false;
  }
  function catalogTray(G, W, H, y) {
    var c = G.c, T = G.tray, list = G.catalogList(T.tab);
    modeTabs(G, y, list.total + ' PIECES');
    SS.TABS.forEach(function (tab, i) {
      var tx = 4 + i * 21.2, on = tab === T.tab;
      R(tx, y + 20, 19, 16, on ? P.rose : (tab === 'holiday' ? '#fdeccf' : P.cell)); R(tx, y + 35, 19, 1, on ? P.roseSh : P.trayEdge);
      SS.tabIcon(tab, tx + 3, y + 23, on);
      if (on) R(tx, y + 37, 19, 2, P.rose);
      hit(G, tx - 1, y + 18, 21, 20, function () { T.tab = tab; T.page = 0; T.cur = 0; });
    });
    var pages = Math.max(1, Math.ceil(list.items.length / 8));
    if (T.page >= pages) T.page = pages - 1;
    var label = T.tab === 'ours' ? 'OURS: OUR REAL THINGS' : SS.TAB_NAMES[T.tab] + (T.tab === 'storage' && list.items.slice(T.page * 8, T.page * 8 + 8).some(function (it) { return it.def && it.def.row; }) ? ' · KITCHEN AND BATH' : '');
    txt(label, 6, y + 42, P.ink, 6);
    if (pages > 1) {
      txt('‹', W - 46, y + 41, T.page > 0 ? P.ink : P.trayEdge, 7); txt((T.page + 1) + '/' + pages, W - 26, y + 42, P.soft, 6, 'center'); txt('›', W - 12, y + 41, T.page < pages - 1 ? P.ink : P.trayEdge, 7);
      hit(G, W - 52, y + 37, 18, 14, function () { if (T.page > 0) T.page--; }); hit(G, W - 18, y + 37, 18, 14, function () { if (T.page < pages - 1) T.page++; });
    }
    list.items.slice(T.page * 8, T.page * 8 + 8).forEach(function (it, j) {
      var col = j % 4, row = Math.floor(j / 4), sx = 5 + col * 58, sy = y + 51 + row * 29, idx = T.page * 8 + j, focused = G.focus === 'cards' && T.cur === idx;
      R(sx, sy, 55, 27, focused ? P.blush : P.cell); R(sx, sy + 26, 55, 1, P.trayEdge);
      if (it.soon) { // their real things wait on Keegan's photos (spec 001, part C, Ours)
        SS.heart(sx + 5, sy + 5, P.rose); txt('COMING', sx + 16, sy + 6, P.ink, 5); txt('SOON', sx + 16, sy + 14, P.ink, 5);
        hit(G, sx, sy, 55, 27, function () { G.toast('OUR REAL THINGS', 2400, 'They come once Keegan\'s photos are drawn.'); });
        return;
      }
      drawThumb(c, it.id, sx + 3, sy + 3, 28, 21, it.sw);
      // small dots for its color choices (bible, Decorating, Catalog tabs)
      it.def.swatches.slice(0, 4).forEach(function (s, k) { var base = s[it.def.parts[0] ? it.def.parts[0][0] : 'x'] || '#c88d5a'; R(sx + 34 + (k % 2) * 9, sy + 5 + Math.floor(k / 2) * 9, 7, 7, '#3b2430'); R(sx + 35 + (k % 2) * 9, sy + 6 + Math.floor(k / 2) * 9, 5, 5, base); });
      if (it.season) { R(sx + 1, sy + 1, 38, 7, P.rose); txt(it.season, sx + 20, sy + 2, '#fff', 4, 'center'); }
      if (it.away) { R(sx, sy, 55, 27, 'rgba(251,238,221,.7)'); R(sx + 1, sy + 9, 53, 9, P.trayEdge); txt('BACK IN', sx + 27, sy + 10, P.ink, 4, 'center'); txt('DECEMBER', sx + 27, sy + 14, P.ink, 4, 'center'); }
      if (it.stored && !G.gig) { R(sx + 33, sy + 19, 20, 7, P.sage[1]); txt('×' + it.stored, sx + 43, sy + 20, '#fff', 5, 'center'); }
      var tag = !it.away && SS.cardTag(G, it);   // its price in Life, FREE during a gig (spec 006, part F)
      if (tag) { var tw2 = SS.tw(tag.text, 4) + (tag.coin ? 8 : 4); R(sx + 2, sy + 19, tw2, 7, tag.bg); if (tag.coin) { R(sx + 3, sy + 20, 5, 5, '#e7bb4f'); R(sx + 4, sy + 21, 3, 3, '#ffd56b'); } txt(tag.text, sx + (tag.coin ? 10 : 4), sy + 21, tag.col, 4); }
      if (focused) { c.strokeStyle = P.rose; c.lineWidth = 2; c.strokeRect(sx + 1, sy + 1, 53, 25); c.lineWidth = 1; }
      hit(G, sx, sy, 55, 27, function () { G.takeCard(it); }, { card: it });
    });
    if (!list.items.length) vt('Nothing here yet.', 8, y + 56, P.soft, 12);
  }
  function vt(s, x, y, col, size) { SS.vt(s, x, y, col, size); }
  function pieceTray(G, W, H, y) {
    var c = G.c, p = G.W.byUid[G.sel], d = G.W.def(p);
    modeTabs(G, y);
    if (G.hasProps(d)) { // the Props switch (spec 001, part C, Props)
      var on = p.props !== false; SS.btn(W - 66, y + 4, 60, on ? 'PROPS ON' : 'PROPS OFF', on, 12, 5);
      hit(G, W - 66, y + 2, 60, 16, function () { G.snapshot(); p.props = !on; G.changed(true); });
    }
    var bx2 = W - (G.hasProps(d) ? 112 : 50);
    if ((d.use === 'stove' || d.use === 'fridge') && !G.gig && !G.away) { // cook for fun, in any mode (spec 006, part E: Sandbox too)
      SS.btn(bx2, y + 4, 44, 'COOK', false, 12, 5); hit(G, bx2, y + 2, 44, 16, function () { G.deselect(); SS.openCooking(G); }); bx2 -= 50;
    }
    if (G.mode === 'life' && p.paid && !G.gig) { // sell it back for every coin she paid (spec 006, part F)
      SS.btn(bx2, y + 4, 44, 'SELL', false, 12, 5); hit(G, bx2, y + 2, 44, 16, function () { SS.sellBack(G, p); });
    }
    txt(d.name.toUpperCase(), 6, y + 22, P.ink, 7);
    var part0 = d.parts[0] && d.parts[0][0];
    d.swatches.slice(0, 6).forEach(function (s, k) {
      var sx = 6 + k * 28, sy = y + 34, c1 = StudioIso.ramp(s[part0] || '#c88d5a'), c2 = d.parts[1] ? s[d.parts[1][0]] : c1[0];
      R(sx, sy, 24, 16, '#3b2430'); R(sx + 1, sy + 1, 22, 14, c1[1]); R(sx + 1, sy + 1, 22, 5, c1[0]); R(sx + 14, sy + 9, 8, 5, c2 || c1[0]);
      var picked = (p.sw || 0) === k && !p.colors && !p.pats;
      if (picked) { c.strokeStyle = P.rose; c.lineWidth = 2; c.strokeRect(sx - 2, sy - 2, 28, 20); c.lineWidth = 1; R(sx + 9, sy + 6, 6, 4, '#fff'); R(sx + 10, sy + 7, 4, 2, P.rose); }
      hit(G, sx - 2, sy - 2, 28, 20, function () { G.snapshot(); p.sw = k; delete p.colors; delete p.pats; G.changed(true); });
    });
    if (d.parts.length) {
      R(176, y + 34, 58, 16, P.cell); R(176, y + 49, 58, 1, P.trayEdge); R(179, y + 38, 3, 7, '#8e5a37'); R(178, y + 36, 5, 3, P.rose); R(179, y + 35, 3, 1, '#7fa7a0');
      txt('PAINT', 211, y + 39, P.ink, 6, 'center');
      hit(G, 176, y + 32, 58, 20, function () { G.paint = { part: 0 }; });
    }
    SS.btn(6, y + 57, 70, 'PUT AWAY', false); hit(G, 6, y + 55, 70, 18, function () { G.putAway(p); });
    SS.btn(84, y + 57, 70, 'MOVE', false); hit(G, 84, y + 55, 70, 18, function () { G.startMove(p); });
    SS.btn(162, y + 57, 72, 'DONE', true); hit(G, 162, y + 55, 72, 18, function () { G.deselect(); });
  }
  function paintTray(G, W, H, y) {
    var c = G.c, p = G.W.byUid[G.sel], d = G.W.def(p), Pt = G.paint, part = d.parts[Pt.part];
    txt('PAINT: ' + d.name.toUpperCase(), 6, y + 6, P.ink, 7);
    var n = d.parts.length, bw = Math.floor((228 - 4 * (n - 1)) / n);
    d.parts.forEach(function (pt, i) { SS.btn(6 + i * (bw + 4), y + 18, bw, pt[0].toUpperCase(), i === Pt.part); hit(G, 6 + i * (bw + 4), y + 16, bw, 18, function () { Pt.part = i; }); });
    var cur = (p.colors && p.colors[part[0]]) || (d.swatches[p.sw || 0] || d.swatches[0])[part[0]];
    SS.PAINT.forEach(function (cc, k) {
      var col = k % 12, row = Math.floor(k / 12), sx = 6 + col * 19.2, sy = y + 37 + row * 17;
      R(sx, sy, 17, 15, '#3b2430'); R(sx + 1, sy + 1, 15, 13, cc); R(sx + 1, sy + 1, 15, 2, 'rgba(255,255,255,.3)');
      if (cur === cc) { c.strokeStyle = '#fff'; c.lineWidth = 2; c.strokeRect(sx - 1, sy - 1, 19, 17); c.strokeStyle = P.rose; c.lineWidth = 1; c.strokeRect(sx - 2.5, sy - 2.5, 22, 20); }
      hit(G, sx - 1, sy - 1, 19, 17, function () { G.snapshot(); p.colors = p.colors || {}; d.parts.forEach(function (q) { if (!p.colors[q[0]]) p.colors[q[0]] = (d.swatches[p.sw || 0] || d.swatches[0])[q[0]]; }); p.colors[part[0]] = cc; G.changed(true); });
    });
    // patterns on fabric parts: the same set as clothes, replacing the fabric texture on that part (spec 001, part D)
    if (part[1] === 'fab') {
      var curP = (p.pats && p.pats[part[0]]) || 'plain';
      SS.PATTERNS.forEach(function (pn, k) {
        var sx = 6 + k * 38, on = curP === pn; SS.btn(sx, y + 73, 36, pn === 'stripes' ? 'STRIPE' : pn.toUpperCase(), on, 13, 5);
        hit(G, sx, y + 72, 36, 15, function () { G.snapshot(); p.pats = p.pats || {}; p.pats[part[0]] = pn; G.changed(true); });
      });
    } else SS.vt('Patterns go on fabric parts.', 8, y + 73, P.soft, 11);
    SS.btn(6, y + 93, 110, 'BACK TO SWATCHES', false); hit(G, 6, y + 91, 110, 18, function () { G.paint = null; });
    SS.btn(124, y + 93, 110, 'DONE', true); hit(G, 124, y + 91, 110, 18, function () { G.paint = null; G.deselect(); });
  }

  // ---------- chips over a piece ----------
  SS.drawChips = function (G, sx, sy, kinds) {
    var w = 14, gap = 4, total = kinds.length * w + (kinds.length - 1) * gap, x = Math.round(sx - total / 2), y = Math.round(sy);
    kinds.forEach(function (k, i) {
      var bx = x + i * (w + gap);
      SS.chip(bx, y, k.icon, w, k.on);
      hit(G, bx - 2, y - 2, w + 4, 17, k.fn);
    });
  };

  // ---------- the action bubble (cooking-v1) ----------
  var AICON = {
    z: function (c, x, y, k) { c.font = '7px "Press Start 2P", monospace'; c.fillStyle = k; c.textAlign = 'left'; c.textBaseline = 'top'; c.fillText('z', x + 1, y); },
    seat: function (c, x, y, k) { R(x, y + 1, 2, 7, k); R(x, y + 5, 8, 2, k); R(x + 7, y + 5, 2, 4, k); },
    tv: function (c, x, y, k) { R(x, y, 10, 7, k); R(x + 1, y + 1, 8, 5, '#a9c9e8'); R(x + 4, y + 7, 2, 2, k); },
    heart: function (c, x, y, k) { [[1, 0, 2], [5, 0, 2], [0, 1, 8], [0, 2, 8], [1, 3, 6], [2, 4, 4], [3, 5, 2]].forEach(function (r) { R(x + r[0], y + 1 + r[1], r[2], 1, k); }); },
    snack: function (c, x, y, k) { c.fillStyle = k; c.beginPath(); c.arc(x + 4.5, y + 5, 4, 0, 7); c.fill(); R(x + 4, y, 1, 2, '#5f8f4e'); },
    pan: function (c, x, y, k) { R(x, y + 3, 8, 5, k); R(x + 8, y + 4, 4, 2, k); R(x + 2, y, 1, 2, k); R(x + 5, y - 1, 1, 2, k); },
    brush: function (c, x, y, k) { R(x + 6, y, 2, 6, k); R(x + 5, y + 5, 4, 2, '#e46f8b'); R(x, y + 7, 5, 2, k); },
    star: function (c, x, y, k) { R(x + 3, y, 3, 9, k); R(x, y + 3, 9, 3, k); R(x + 1, y + 1, 7, 7, k); },
    bath: function (c, x, y, k) { R(x, y + 4, 10, 4, k); R(x + 1, y + 8, 1, 1, k); R(x + 8, y + 8, 1, 1, k); R(x + 2, y + 1, 2, 2, '#a9c9e8'); R(x + 5, y, 2, 2, '#a9c9e8'); },
    book: function (c, x, y, k) { R(x, y + 1, 9, 7, k); R(x + 4, y + 1, 1, 7, '#fff6ea'); },
    chat: function (c, x, y, k) { R(x, y, 10, 6, k); R(x + 2, y + 6, 2, 2, k); R(x + 2, y + 2, 1, 1, '#fff'); R(x + 5, y + 2, 1, 1, '#fff'); R(x + 8, y + 2, 1, 1, '#fff'); },
    lamp: function (c, x, y, k) { R(x + 2, y, 6, 4, k); R(x + 4, y + 4, 2, 4, k); R(x + 2, y + 8, 6, 1, k); },
    treat: function (c, x, y, k) { R(x + 1, y + 3, 8, 4, k); R(x + 2, y + 4, 1, 1, '#f3d38a'); R(x + 6, y + 5, 1, 1, '#f3d38a'); }
  };
  SS.actIcon = function (c, name, x, y, on) { (AICON[name] || AICON.star)(c, x, y, on ? '#fff' : P.ink); };
  SS.drawBubble2 = function (G, W, b) {
    var c = G.c, items = b.actions, w = 148, rows = Math.ceil(items.length / 2), sub = b.sub ? 8 : 0, h = 18 + sub + rows * 22 + 2 - (rows ? 0 : 4);
    var tx = Math.round(b.tip[0]), ty = Math.round(b.tip[1]);
    var x = Math.max(4, Math.min(W - w - 28, tx - w / 2)), y = ty - h - 10;
    if (y < 24) y = Math.min(ty + 14, G.viewBottom - h - 4);
    y = Math.max(24, y);
    if (G.meters) x = 4;   // the meters sit beside it (cooking-v1)
    G.bubbleTop = y;
    SS.card(x, y, w, h);
    if (ty > y + h) { c.fillStyle = P.tray; c.beginPath(); c.moveTo(Math.max(x + 8, Math.min(x + w - 8, tx)) - 6, y + h - 1); c.lineTo(Math.max(x + 8, Math.min(x + w - 8, tx)) + 6, y + h - 1); c.lineTo(tx, ty); c.closePath(); c.fill(); c.strokeStyle = P.rose; c.beginPath(); c.moveTo(Math.max(x + 8, Math.min(x + w - 8, tx)) - 6, y + h - .5); c.lineTo(tx, ty); c.lineTo(Math.max(x + 8, Math.min(x + w - 8, tx)) + 6, y + h - .5); c.stroke(); }
    var title = b.title, words = title.split(' ');   // a long title drops words from the end rather than spill out of the card
    while (SS.tw(title, 5) > w - 12 && words.length > 2) { words.pop(); title = words.join(' ') + '…'; }
    txt(title, x + 6, y + 6, P.soft, 5);
    if (b.sub) txt(b.sub, x + 6, y + 14, P.ink, 5);   // Sarah's phone battery, under her name and what she's doing
    hit(G, x, y, w, h, function () {}, { block: true });
    items.forEach(function (it, i) {
      var bw = (w - 14) / 2, bx = x + 5 + (i % 2) * (bw + 4), by = y + 16 + sub + Math.floor(i / 2) * 22, sel = i === b.cur;
      R(bx, by, bw, 19, sel ? P.rose : P.cell); R(bx, by + 18, bw, 1, sel ? P.roseSh : P.trayEdge); if (sel) R(bx, by, bw, 1, P.roseHi);
      SS.actIcon(c, it.icon, bx + 4, by + 5, sel);
      txt(it.name, bx + 17, by + (it.sub ? 3 : 7), sel ? '#fff' : P.ink, 5); if (it.sub) txt(it.sub, bx + 17, by + 11, sel ? '#fff' : P.ink, 5);
      if (it.soon) { R(bx + bw - 21, by + 1, 20, 6, sel ? '#fff' : P.honey[0]); txt('SOON', bx + bw - 11, by + 2, P.ink, 4, 'center'); }
      if (i === 0) { R(bx + bw - 10, by - 5, 12, 12, '#3b2430'); R(bx + bw - 9, by - 4, 10, 10, P.rose); txt('A', bx + bw - 7, by - 2, '#fff', 6); }
      hit(G, bx, by, bw, 19, function () { G.doBubble(i); });
    });
  };

  // ---------- the Start menu (start-menu-v1) ----------
  var ROWS = [['BACK TO HOME', 'home'], ['PEOPLE', 'people', 1], ['HOMES', 'homes', 1], ['FAVORITES', 'fav', 1], ['CAMERA', 'camera'], ['MEMORY BOOK', 'book', 1], ['MAKE A BACKUP', 'backup'], ['TITLE', 'title']];
  SS.MENU_ROWS = ROWS;
  SS.drawMenu = function (G, W, H) {
    var c = G.c, m = G.menu;
    if (m.kind === 'book') return SS.drawBook(G, W, H);   // the memory book (book.js)
    if (m.kind === 'note') return SS.drawNote(G, W, H);
    if (m.kind === 'fav') return SS.drawFavorites(G, W, H);   // favorites (keep.js)
    if (m.kind === 'cook') return SS.drawCooking(G, W, H);   // the Cooking screen (cooking.js)
    if (m.kind === 'gig') return SS.drawGigOffer(G, W, H);   // gigs (gig.js)
    if (m.kind === 'gigdone') return SS.drawGigDone(G, W, H);
    if (m.kind === 'style') return SS.drawStyle(G, W, H);   // the Style screen (style.js)
    R(0, 0, W, H, 'rgba(34,18,28,.62)');   // the home dims and holds still behind the menu
    hit(G, 0, 0, W, H, function () { G.closeMenu(); });
    if (m.kind === 'start') {
      var rh = H < 250 ? 15 : 17, w = 184, h = 22 + ROWS.length * rh + 18, x = (W - w) / 2, y = Math.max(4, Math.round((H - h) / 2) - 6);
      SS.frame(x, y, w, h); SS.header(x, y, w, 'MENU', G.mode === 'life' ? 'LIFE' : 'SANDBOX');
      hit(G, x, y, w, h, function () {}, { block: true });
      ROWS.forEach(function (r, i) {
        var ry = y + 23 + i * rh, on = i === m.cur;
        if (on) { R(x + 5, ry, w - 10, rh - 2, P.rose); R(x + 5, ry, w - 10, 1, P.roseHi); R(x + 5, ry + rh - 3, w - 10, 1, P.roseSh); }
        SS.ICONS[r[1]](x + 10, ry + (rh - 13) / 2 + 1, on ? '#fff' : P.ink, on ? P.roseSh : P.cell);
        txt(r[0], x + 28, ry + (rh - 9) / 2 + 1, on ? '#fff' : P.ink, 7);
        if (r[2]) SS.chev(x + w - 14, ry + (rh - 9) / 2 + 1, on ? '#fff' : P.soft);
        hit(G, x + 5, ry, w - 10, rh - 1, function () { m.cur = i; G.menuPick(i); });
      });
      var fy = y + 23 + ROWS.length * rh + 3, ago = Math.round((Date.now() - (SS.lastSaved || Date.now())) / 60000);
      SS.check(x + 10, fy + 3, P.sage[1]); txt(ago < 1 ? 'SAVED JUST NOW' : 'SAVED ' + ago + ' MIN AGO', x + 24, fy + 3, P.soft, 6);
    } else if (m.kind === 'homes') {
      // every home in this save (build.js): the Philly home, the street's three empty lots, and Sandbox's new lots; then New lot
      var list = SS.homeList(G), rows2 = list.length + (G.mode === 'sandbox' ? 1 : 0), per = H < 300 ? 5 : 6, top = Math.floor(m.cur / per) * per;
      if (m.newLot) return drawNewLot(G, W, H, m);
      var shown = list.slice(top, top + per), w2 = 204, rh2 = 30, h2 = 24 + shown.length * rh2 + (G.mode === 'sandbox' && top + per >= list.length ? 22 : 0) + 22, x2 = (W - w2) / 2, y2 = Math.max(4, Math.round((H - h2) / 2) - 6);
      SS.frame(x2, y2, w2, h2); SS.header(x2, y2, w2, 'HOMES', G.mode === 'life' ? 'LIFE' : 'SANDBOX');
      hit(G, x2, y2, w2, h2, function () {}, { block: true });
      shown.forEach(function (h, j) {
        var i = top + j, cx = x2 + 6, cy = y2 + 23 + j * rh2, on = m.cur === i, here = h.id === G.save.home;
        R(cx, cy, w2 - 12, rh2 - 3, on ? P.blush : P.cell); R(cx, cy + rh2 - 4, w2 - 12, 1, P.trayEdge);
        if (on) { R(cx, cy, 2, rh2 - 3, P.rose); }
        if (h.id === 'philly') miniHome(c, cx + 5, cy + 2, G.t, .7); else miniLot(c, cx + 5, cy + 3, h.lot, h.rooms);
        txt(h.id === 'philly' ? h.name : h.rooms ? h.name : (h.street ? 'EMPTY ' : 'NEW ') + h.lotName, cx + 34, cy + 5, P.ink, 6);
        txt(h.lot + ' × ' + h.lot + (h.street ? ' · ON THE STREET' : h.id === 'philly' ? ' · ' + h.lotName : ''), cx + 34, cy + 15, P.soft, 5);
        if (here) { R(cx + w2 - 62, cy + 4, 46, 9, P.sage[1]); txt('HERE', cx + w2 - 39, cy + 6, '#fff', 5, 'center'); }
        else SS.chev(cx + w2 - 22, cy + 9, on ? P.rose : P.soft);
        hit(G, cx, cy, w2 - 12, rh2 - 3, function () { m.cur = i; G.homePick(i); });
      });
      var by2 = y2 + 23 + shown.length * rh2;
      if (G.mode === 'sandbox' && top + per >= list.length) { var onN = m.cur === list.length; SS.addButton(x2 + 6, by2, w2 - 12, 'NEW LOT'); if (onN) R(x2 + 6, by2 + 17, w2 - 12, 1, P.rose); hit(G, x2 + 6, by2, w2 - 12, 18, function () { m.cur = list.length; G.homePick(list.length); }); by2 += 22; }
      void rows2;
      SS.backHint(x2 + 8, y2 + h2 - 16); hit(G, x2 + 4, y2 + h2 - 18, 60, 16, function () { G.menu = { kind: 'start', cur: 2 }; });
    }
  };
  // New lot: pick a size (spec 004, part A)
  function drawNewLot(G, W, H, m) {
    var w = 204, h = 24 + 3 * 30 + 22, x = (W - w) / 2, y = Math.max(4, Math.round((H - h) / 2) - 6);
    SS.frame(x, y, w, h); SS.header(x, y, w, 'NEW LOT', 'PICK A SIZE');
    hit(G, x, y, w, h, function () {}, { block: true });
    [16, 24, 32].forEach(function (n, i) {
      var cx = x + 6, cy = y + 23 + i * 30, on = m.lotCur === i;
      R(cx, cy, w - 12, 27, on ? P.blush : P.cell); R(cx, cy + 26, w - 12, 1, P.trayEdge); if (on) R(cx, cy, 2, 27, P.rose);
      miniLot(G.c, cx + 5, cy + 3, n, 0);
      txt(SS.LOTS[n], cx + 34, cy + 5, P.ink, 6); txt(n + ' × ' + n + ' TILES', cx + 34, cy + 15, P.soft, 5);
      hit(G, cx, cy, w - 12, 27, function () { m.lotCur = i; SS.newLot(G, n); G.menu = null; });
    });
    SS.backHint(x + 8, y + h - 16); hit(G, x + 4, y + h - 18, 60, 16, function () { m.newLot = false; });
  }
  // a tiny lot: grass, scaled to its size, with a little house when something's built
  function miniLot(c, x, y, n, rooms) {
    var s = Math.round(8 + (n - 16) / 4);   // 8, 10 or 12 px
    var cx = x + 12, cy = y + 11 - s / 2;
    c.fillStyle = '#5e8f52'; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + s * 1.3, cy + s * .65); c.lineTo(cx, cy + s * 1.3); c.lineTo(cx - s * 1.3, cy + s * .65); c.closePath(); c.fill();
    c.fillStyle = '#8bbd73'; c.beginPath(); c.moveTo(cx, cy - 1); c.lineTo(cx + s * 1.3, cy + s * .65 - 1); c.lineTo(cx, cy + s * 1.3 - 1); c.lineTo(cx - s * 1.3, cy + s * .65 - 1); c.closePath(); c.fill();
    if (rooms) { R(cx - 4, cy + s * .65 - 7, 8, 6, '#ecc1b2'); R(cx - 5, cy + s * .65 - 9, 10, 2, '#b9584a'); }
  }
  function miniHome(c, x, y, t, k) { // the brick rowhouse from the title, 32 x 32 (start-menu-v1); k scales it down
    if (k) { c.save(); c.translate(x, y); c.scale(k, k); miniHome(c, 0, 0, t); c.restore(); return; }
    R(x - 2, y - 2, 36, 36, '#3b2430'); R(x - 1, y - 1, 34, 34, '#2f3355');
    for (var i = 0; i < 6; i++) R(x + (i * 11 + t) % 32, y + (i * 7 + t * 2) % 20, 1, 1, '#fff');
    R(x + 4, y + 8, 24, 24, '#a9473f'); for (var j = 0; j < 6; j++) R(x + 4, y + 11 + j * 4, 24, 1, '#8f3b35');
    R(x + 3, y + 6, 26, 3, '#f7fbff'); R(x + 3, y + 8, 26, 1, '#d9e2ee');
    [[7, 12], [19, 12]].forEach(function (p) { R(x + p[0], y + p[1], 6, 6, '#fff1e2'); R(x + p[0] + 1, y + p[1] + 1, 4, 4, '#ffd56b'); });
    R(x + 13, y + 22, 6, 10, '#2f4a63'); R(x + 14, y + 23, 4, 4, '#ffd56b'); R(x + 11, y + 30, 10, 2, '#c9c1c4');
    R(x + 12, y + 19, 8, 2, '#3e7a4f'); R(x + 15, y + 19, 2, 2, '#e46f6a');
  }

  // ---------- cards: Coming soon notes, choices ----------
  SS.drawToast = function (G, W, H, T) {
    var c = G.c, lines = T.line ? wrap(T.line, W - 40) : [], w = W - 24, h = 22 + lines.length * 11;
    var x = 12, y = Math.max(26, Math.round(G.viewBottom / 2 - h / 2) - 20);
    var a = Math.min(1, (T.until - performance.now()) / 300); c.globalAlpha = Math.max(0, a);
    SS.card(x, y, w, h); SS.heart(x + 7, y + 7, P.rose); txt(T.text, x + 18, y + 7, P.ink, 6);
    lines.forEach(function (l, i) { SS.vt(l, x + 8, y + 17 + i * 11, P.ink, 12); });
    c.globalAlpha = 1;
  };
  function wrap(s, maxw) { var words = s.split(' '), out = [], cur = ''; words.forEach(function (w) { var t = cur ? cur + ' ' + w : w; if (SS.vtw(t, 12) > maxw && cur) { out.push(cur); cur = w; } else cur = t; }); if (cur) out.push(cur); return out; }
  SS.wrap = wrap;
  // a choice card: the cursor starts on the safe answer (studio-bible/play.md, No accidental point of no return)
  SS.drawConfirm = function (G, W, H, q) {
    var c = G.c; R(0, 0, W, H, 'rgba(34,18,28,.62)'); hit(G, 0, 0, W, H, function () {}, { block: true });
    var lines = wrap(q.text, 184), w = 204, h = 30 + lines.length * 12 + 24, x = (W - w) / 2, y = Math.round((H - h) / 2);
    SS.frame(x, y, w, h); SS.header(x, y, w, q.title);
    lines.forEach(function (l, i) { SS.vt(l, x + 10, y + 24 + i * 12, P.ink, 12); });
    q.options.forEach(function (o, i) { var bx = x + 10 + i * 94, by = y + h - 22; SS.btn(bx, by, 88, o, i === q.cur, 14); hit(G, bx, by - 2, 88, 18, function () { q.cur = i; G.confirmPick(i); }); });
  };
})();
