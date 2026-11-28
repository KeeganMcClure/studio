// Sarah's Sim holidays (spec 009), Christmas first: it's the holiday the game is opened on.
//   Part A: the holiday follows the real date. Christmas's season is Dec 1 to Jan 6; its days are Dec 24 evening and Dec 25.
//     First snow is a weather moment the first time she opens the game on or after Dec 21.
//   Part B: the Christmas set in the Holiday tab (in Life, "This season" in season and "Back in December" out of it; in Sandbox
//     always there). Day dressing, only for that day, on top of her own design: Christmas Eve hangs stockings and leaves cookies
//     out; Christmas morning puts gifts under her tree (or a little tree if she hasn't placed one): one holds Keegan's note, each
//     of the others is a free Christmas piece; the cats wear tiny Santa hats; Keegan makes a special breakfast. She can keep any
//     day-dressing piece; the rest go away the next day. Gifts never repeat in the same year (saved).
// Parties (part C) wait for the Visitor screens (spec 008). The note is private data (a placeholder in the repo).
(function () {
  var C = SS.CATALOG, INK = 'rgba(59,36,48,.85)';
  function R(c, x, y, w, h, col) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
  function add(def) { def.parts = def.parts || []; def.swatches = def.swatches || [{}]; def.spots = def.spots || []; def.holiday = def.holiday || 'christmas'; C.push(def); return def; }
  function small(M, fn, e) { M.spr(.5, .5, 0, function (c, x, y) { c.fillStyle = 'rgba(90,45,40,.25)'; c.beginPath(); c.ellipse(x + 1, y, 5, 2, 0, 0, 7); c.fill(); fn(c, x, y); }, e || [.15, 12]); }
  SS.DEF['christmas-tree'].holiday = 'christmas';

  // ---------- the Christmas set (Holiday tab) ----------
  add({ id: 'christmas-wreath', name: 'Christmas wreath', tab: 'holiday', w: 1, d: .1, kind: 'wall', mount: 26, h: 18, price: 80,
    parts: [['bow', 'plain']], swatches: [{ bow: '#d2363c' }, { bow: '#e7bb4f' }, { bow: '#fff1e2' }, { bow: '#7fa7a0' }],
    draw: function (M) { M.spr(.5, .05, 0, function (c, x, y) { var B = M.ramp('bow'), cy = y - 9; c.strokeStyle = '#3f6e4a'; c.lineWidth = 5; c.beginPath(); c.arc(x, cy, 6, 0, 7); c.stroke(); c.lineWidth = 1; c.strokeStyle = '#6aa361'; c.beginPath(); c.arc(x - 1, cy - 1, 6, 3.4, 5.6); c.stroke(); [[-5, -3], [4, -4], [0, 6], [-4, 4], [5, 3]].forEach(function (b) { R(c, x + b[0], cy + b[1], 2, 2, '#e46f6a'); }); R(c, x - 4, cy + 5, 8, 3, B[1]); R(c, x - 1, cy + 8, 2, 4, B[2]); R(c, x - 3, cy + 5, 2, 1, B[0]); }, [.3, 18]); } });
  add({ id: 'stockings', name: 'Stockings', tab: 'holiday', w: 1, d: .1, kind: 'wall', mount: 16, h: 16, price: 60,
    parts: [['knit', 'fab']], swatches: [{ knit: '#d2363c' }, { knit: '#3f6e4a' }, { knit: '#f39bb0' }, { knit: '#7d93c4' }],
    draw: function (M) { [[.22, 'knit'], [.5, '#3f6e4a'], [.78, 'knit']].forEach(function (st, i) { M.spr(st[0], .05, 0, function (c, x, y) { var K = st[1] === 'knit' ? M.ramp('knit') : StudioIso.ramp(st[1]); R(c, x - 1, y - 16, 1, 2, '#8e5a37'); R(c, x - 3, y - 14, 6, 3, '#fff6ea'); R(c, x - 3, y - 11, 5, 7, K[1]); R(c, x - 3, y - 11, 2, 7, K[0]); R(c, x - 3, y - 5, 8, 3, K[1]); R(c, x + 2, y - 5, 3, 3, K[2]); if (i === 1) { R(c, x - 1, y - 9, 2, 1, '#fff6ea'); } }, [.1, 16]); }); } });
  add({ id: 'holiday-garland', name: 'Holiday garland', tab: 'holiday', w: 2, d: .1, kind: 'wall', mount: 34, h: 12, price: 90, lamp: true, use: 'lamp', moves: 'twinkle', anim: 8,
    parts: [['bulbs', 'plain']], light: { u: 1, v: .1, h: -8, r: 24 }, swatches: [{ bulbs: '#ffd56b' }, { bulbs: '#e46f8b' }, { bulbs: '#8fd0ff' }, { bulbs: '#fff3a8' }],
    draw: function (M, t) { M.spr(1, .05, 0, function (c) { var on = M.inst && M.inst.lit, B = M.ramp('bulbs'); var pts = []; for (var k = 0; k <= 14; k++) pts.push([M.p(.05 + k / 14 * 1.9, .06, 0), Math.sin(k / 14 * Math.PI) * 5]); c.strokeStyle = '#3f6e4a'; c.lineWidth = 3; c.beginPath(); pts.forEach(function (q, i) { if (i) c.lineTo(q[0][0], q[0][1] + q[1]); else c.moveTo(q[0][0], q[0][1] + q[1]); }); c.stroke(); c.lineWidth = 1; pts.forEach(function (q, i) { if (i % 2) return; var lit = on && (Math.floor(t / 2) + i) % 4 !== 0; R(c, q[0][0], q[0][1] + q[1] + 1, 2, 2, lit ? [B[0], '#e46f8b', '#8fd0ff'][i % 3] : '#a08880'); }); }, [1, 12]); } });
  add({ id: 'poinsettia', name: 'Poinsettia', tab: 'holiday', w: 1, d: 1, kind: 'small', h: 12, price: 45,
    parts: [['pot', 'plain']], swatches: [{ pot: '#e7bb4f' }, { pot: '#fff1e2' }, { pot: '#d2363c' }, { pot: '#3f6e4a' }],
    draw: function (M) { small(M, function (c, x, y) { var Pp = M.ramp('pot'); R(c, x - 3, y - 4, 6, 4, Pp[1]); R(c, x - 3, y - 4, 2, 4, Pp[0]); [[-4, -7, .4], [3, -7, -.4], [0, -10, 0], [-2, -6, .8], [2, -6, -.8]].forEach(function (l) { c.fillStyle = '#d2363c'; c.beginPath(); c.ellipse(x + l[0], y + l[1], 3, 1.6, l[2], 0, 7); c.fill(); }); R(c, x - 1, y - 8, 2, 2, '#ffd56b'); R(c, x - 5, y - 5, 2, 1, '#437a47'); R(c, x + 4, y - 5, 2, 1, '#437a47'); }, [.15, 12]); } });
  add({ id: 'gift-stack', name: 'Gift stack', tab: 'holiday', w: 1, d: 1, kind: 'small', h: 14, price: 40,
    parts: [['paper', 'plain']], swatches: [{ paper: '#e46f8b' }, { paper: '#7fa7a0' }, { paper: '#e7bb4f' }, { paper: '#7d93c4' }],
    draw: function (M) { var P0 = M.ramp('paper'); M.box(.25, .3, .5, .4, 7, 0, 'paper'); M.box(.32, .36, .34, .28, 6, 7, '#fff1e2'); M.spr(.5, .5, 13, function (c, x, y) { R(c, x - 1, y - 2, 3, 2, '#e7bb4f'); }, [.05, 2]); } });
  add({ id: 'ornament-bowl', name: 'Ornament bowl', tab: 'holiday', w: 1, d: 1, kind: 'small', h: 8, price: 35,
    parts: [['bowl', 'plain']], swatches: [{ bowl: '#fff1e2' }, { bowl: '#c7ced2' }, { bowl: '#3f6e4a' }, { bowl: '#e7bb4f' }],
    draw: function (M) { small(M, function (c, x, y) { var B = M.ramp('bowl'); [[-3, '#d2363c'], [0, '#e7bb4f'], [3, '#7fa7a0'], [-1, '#c8a6d8']].forEach(function (o, i) { c.fillStyle = o[1]; c.beginPath(); c.arc(x + o[0], y - 5 - (i === 3 ? 2 : 0), 2, 0, 7); c.fill(); R(c, x + o[0] - 1, y - 6 - (i === 3 ? 2 : 0), 1, 1, 'rgba(255,255,255,.7)'); }); c.fillStyle = B[1]; c.beginPath(); c.ellipse(x, y - 3, 6, 3, 0, 0, Math.PI); c.fill(); R(c, x - 6, y - 4, 12, 1, B[0]); }, [.15, 8]); } });
  add({ id: 'cookies-and-milk', name: 'Cookies and milk', tab: 'holiday', w: 1, d: 1, kind: 'small', h: 8, price: 25,
    parts: [['plate', 'plain']], swatches: [{ plate: '#fff6ea' }, { plate: '#d2363c' }, { plate: '#7fa7a0' }, { plate: '#e7bb4f' }],
    draw: function (M) { small(M, function (c, x, y) { var Pl = M.ramp('plate'); c.fillStyle = Pl[1]; c.beginPath(); c.ellipse(x - 2, y - 1, 5, 2.3, 0, 0, 7); c.fill(); [[-4, -2], [-1, -3], [-2, -1]].forEach(function (k) { R(c, x + k[0], y + k[1], 2, 1, '#c78f3e'); R(c, x + k[0], y + k[1], 1, 1, '#6e4429'); }); R(c, x + 3, y - 7, 3, 6, '#fbf6ef'); R(c, x + 3, y - 7, 1, 6, '#ffffff'); }, [.15, 8]); } });
  add({ id: 'snow-globe', name: 'Snow globe', tab: 'holiday', w: 1, d: 1, kind: 'small', h: 10, price: 50, moves: 'twinkle', anim: 8,
    parts: [['base', 'wood']], swatches: [{ base: '#8e5a37' }, { base: '#d2363c' }, { base: '#e7bb4f' }, { base: '#2f2228' }],
    draw: function (M, t) { small(M, function (c, x, y) { var B = M.ramp('base'); R(c, x - 4, y - 3, 8, 3, B[1]); c.fillStyle = 'rgba(200,225,245,.8)'; c.beginPath(); c.arc(x, y - 7, 4.5, 0, 7); c.fill(); R(c, x - 1, y - 8, 2, 4, '#b9584a'); R(c, x - 2, y - 9, 4, 1, '#fff6ea'); for (var k = 0; k < 4; k++) R(c, x - 3 + ((k * 3 + t) % 6), y - 10 + ((k * 2 + t) % 6), 1, 1, '#fff'); R(c, x - 3, y - 10, 1, 2, 'rgba(255,255,255,.8)'); }, [.15, 10]); } });
  // a gift under the tree on Christmas morning: not in the catalog
  add({ id: 'christmas-gift', name: 'A gift', tab: 'none', w: 1, d: 1, kind: 'small', h: 12, price: 0, use: 'gift',
    parts: [], swatches: [{}],
    draw: function (M) { var col = ['#e46f8b', '#7fa7a0', '#e7bb4f', '#7d93c4'][(M.inst && M.inst.gift || 0) % 4]; M.box(.25, .3, .5, .45, 9, 0, col); M.spr(.5, .52, 9, function (c, x, y) { R(c, x - 1, y - 1, 2, 2, '#fff1e2'); R(c, x - 4, y - 2, 3, 2, '#fff1e2'); R(c, x + 1, y - 2, 3, 2, '#fff1e2'); }, [.05, 3]); } });
  SS.DEF = {}; C.forEach(function (d) { SS.DEF[d.id] = d; });

  // ---------- the calendar (part A) ----------
  SS.inSeason = function (holiday, d) { var m = d.getMonth(), day = d.getDate(); if (holiday === 'christmas') return m === 11 || (m === 0 && day <= 6); return true; };
  function key(name, d) { return name + '.' + d.getFullYear(); }

  // ---------- the day (part B): dressing for the day, gifts, hats, breakfast ----------
  SS.applyHolidays = function (G) {
    var W = G.W, S = G.save, d = SS.now(), m = d.getMonth(), day = d.getDate(), h = d.getHours();
    S.hol = S.hol || {};
    var today = m === 11 && day === 24 && h >= 17 ? 'eve' : m === 11 && day === 25 ? 'xmas' : null;
    // yesterday's dressing goes away, unless she kept it
    W.pieces.filter(function (p) { return p.dress && p.dress !== today + '.' + d.getFullYear(); }).forEach(function (p) { W.remove(p); });
    G.xmasDay = m === 11 && day === 25;
    // first snow: the first time she opens the game on or after Dec 21 (a weather moment)
    var winterYear = m === 11 ? d.getFullYear() : d.getFullYear() - 1, snowKey = 'snow.' + winterYear;
    if (((m === 11 && day >= 21) || m < 2) && !S.hol[snowKey]) { S.hol[snowKey] = Date.now(); G.toast('FIRST SNOW', 2400, 'Snow is falling past the windows.'); SS.moment(G, 'first-snow'); }
    if (G.mode !== 'life' || !today) { G.changed(true); return; }
    var k = key(today, d);
    if (S.hol[k]) return;
    S.hol[k] = Date.now();
    if (today === 'eve') {
      place(G, 'stockings', { wall: true, near: 'christmas-tree' }, k);
      place(G, 'cookies-and-milk', { table: true, near: 'christmas-tree' }, k);
      G.toast('CHRISTMAS EVE', 2600, 'Stockings are up, and cookies are out for the night.');
    } else {
      var tree = W.pieces.filter(function (p) { return p.id === 'christmas-tree'; })[0];
      if (!tree) tree = place(G, 'christmas-tree', { floor: true }, k);
      var gifts = 0;
      for (var i = 0; i < 3; i++) { var g = place(G, 'christmas-gift', { floor: true, near: tree && tree.uid }, k); if (g) { g.gift = i; if (i === 0) g.note = true; gifts++; } }
      // Keegan's special breakfast, on the table with a sparkle
      if (h < 12) { var meal = place(G, 'plated-meal', { table: true }, k); if (meal) meal.special = true; }
      G.toast('MERRY CHRISTMAS', 3000, gifts ? 'There are gifts under the tree. Tap one to open it.' : 'Keegan made Christmas breakfast.');
    }
    G.changed(true);
  };
  // put a day-dressing piece near something, on a wall, a table or the floor; it's marked as dressing for that day
  function place(G, id, o, k) {
    var W = G.W, near = o.near ? (typeof o.near === 'number' ? W.byUid[o.near] : W.pieces.filter(function (p) { return p.id === o.near; })[0]) : null;
    var f = near ? W.floorOf(near) : 0, ft = near ? W.foot(near.host ? W.hostOf(near) : near) : [W.ax + 4, W.ay + 8, W.ax + 5, W.ay + 9];
    var cx = (ft[0] + ft[2]) / 2, cy = (ft[1] + ft[3]) / 2, best = null;
    function tryC(cd, dd) { cd.id = id; cd.f = f; if (W.check(cd).ok && (!best || dd < best.d)) best = { d: dd, cd: cd }; }
    if (o.wall) W.walls[f].forEach(function (s) { if (s.b && !s.op && !s.win) tryC({ wall: [s.x, s.y, s.axis] }, Math.hypot(s.x - cx, s.y - cy)); });
    if (o.table) W.pieces.forEach(function (hst) { var hd = W.def(hst); if (!hd.spots.length || !/table|island|counter/.test(hst.id)) return; hd.spots.forEach(function (sp, i) { var pos = W.spotPos(hst, i); tryC({ host: hst.uid, spot: i }, Math.hypot(pos.x - cx, pos.y - cy)); }); });
    if (o.floor || !best) for (var x = W.ax; x < W.ax + W.home.w; x++) for (var y = W.ay; y < W.ay + W.home.d; y++) tryC({ x: x, y: y, r: 0 }, Math.hypot(x + .5 - cx, y + .5 - cy));
    if (!best) return null;
    var p = { id: id, sw: 0, props: true, dress: k }; for (var q in best.cd) if (q !== 'id') p[q] = best.cd[q];
    if (p.host) delete p.f; W.add(p); if (p.host) p.f = W.floorOf(p);
    return p;
  }
  // opening a gift: the one with Keegan's note shows it; each of the others is a free Christmas piece
  SS.openGift = function (G, gift) {
    var W = G.W, S = G.save;
    if (gift.note) {
      // the note opens on its own paper (memory-book-v1, Note found) and goes in the memory book (spec 007)
      W.remove(gift); G.changed(true); SS.showNote(G, 'tree', true); return;
    }
    var set = SS.CATALOG.filter(function (d) { return d.holiday === 'christmas' && d.tab === 'holiday' && d.id !== 'christmas-tree'; }).map(function (d) { return d.id; });
    S.hol.given = S.hol.given || []; var left = set.filter(function (id) { return S.hol.given.indexOf(id) < 0; }); if (!left.length) left = set;
    var id = left[Math.floor(Math.random() * left.length)]; S.hol.given.push(id);
    var spot = { x: gift.x, y: gift.y, f: gift.f }; W.remove(gift);
    var p = { id: id, sw: 0, props: true };
    if (SS.DEF[id].kind === 'wall') { if (!SS.placeNear(G, id, W.pieces.filter(function (q) { return q.id === 'christmas-tree'; })[0] || W.pieces[0])) {} }
    else { p.f = spot.f; p.x = spot.x; p.y = spot.y; p.r = 0; if (W.check(p).ok) W.add(p); else SS.placeNear(G, id, W.pieces[0]); }
    if (S.made.indexOf(id) < 0) S.made.push(id);
    G.changed(true);
    G.toast('A GIFT: ' + SS.DEF[id].name.toUpperCase(), 2600, 'It\'s yours to keep and place anywhere.');
  };
})();
