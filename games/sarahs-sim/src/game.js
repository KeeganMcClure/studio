// Sarah's Sim: the game. Screens (spec 001, part A): the first-open gift (once only), the title in winter, and the home.
// The home screen (part B) shows the home in the diagonal view with the top bar, the view controls and the tray; decorating
// (parts C and D) and, in Life mode, playing as Sarah on the real clock (spec 006, parts A and B).
// Controls (bible, Controls and screen): touch first, buttons too. Pinch zooms, two fingers (or one on empty floor) slide,
// the D-pad slides too; drag a card into the room to place it. Buttons: the D-pad moves a held piece a tile at a time, A
// places, B cancels, Select turns it; Start opens the menu. No L or R.
(function () {
  var W0 = 240, I = SS.I, FH = SS.FH;
  var cv = document.getElementById('cv'), c = cv.getContext('2d');
  var world = document.createElement('canvas'); world.width = SS.WORLD[0]; world.height = SS.WORLD[1];
  var wc = world.getContext('2d');
  var G = SS.G = { c: c, W0: W0, H: 320, screen: 'title', hits: [], t: 0, mode: null, save: null, W: null, floor: 0, walls: 'cut',
    cam: StudioIso.camera({ zoom: 1 }), tray: { open: true, tab: 'seating', page: 0, cur: 0 }, sel: null, paint: null, hold: null, menu: null, confirm: null,
    toastT: null, bubble: null, undo: [], focus: null, titleCur: 0, look: SS.look(new Date(), 'sandbox'), viewBottom: 200, agents: [] };
  window.SSG = G;   // for the checks

  // ---------- sizing: 240 px wide, as tall as the screen allows up to 320, crisp pixels ----------
  var screenEl = document.getElementById('screen');
  function fit() {
    var f = StudioMove.fit(screenEl, cv); if (!f) return;
    G.H = f.h; var k = f.boxW / W0;
    cv.style.width = f.boxW + 'px'; cv.style.height = Math.round(f.h * k) + 'px';
    cv.style.top = Math.max(0, Math.round((f.boxH - f.h * k) / 2)) + 'px';
    c.imageSmoothingEnabled = false;
  }
  window.addEventListener('resize', fit);

  // ---------- toasts and helpers ----------
  G.toast = function (text, ms, line) { G.toastT = { text: text, line: line || '', until: performance.now() + (ms || 1600) }; };
  G.hasProps = function (d) { // does the Props switch change anything? (drawn both ways once, then remembered)
    if (d._props === undefined) {
      var a = SS.pieceSprite({ uid: 'pa', id: d.id, r: 0, sw: 0, props: true }, null, 0, { rot: 0 }).cv.toDataURL();
      var b = SS.pieceSprite({ uid: 'pb', id: d.id, r: 0, sw: 0, props: false }, null, 0, { rot: 0 }).cv.toDataURL();
      SS.forgetSprite('pa'); SS.forgetSprite('pb'); d._props = a !== b;
    }
    return d._props;
  };

  // ---------- modes and saves ----------
  function openMode(mode) {
    var s = SS.modeSave(mode) || SS.newSave(mode);
    G.mode = mode; G.save = s; G.W = SS.World(SS.HOMES[s.home], s.pieces);
    s.stored = s.stored || []; s.made = s.made || [];
    G.undo = []; G.sel = null; G.paint = null; G.hold = null; G.bubble = null; G.menu = null; G.focus = null;
    G.look = SS.look(SS.now(), mode);
    if (mode === 'sandbox' && !s.savedAt) G.W.pieces.forEach(function (p) { if (SS.DEF[p.id].lamp) p.lit = true; });
    if (mode === 'life') lampPhase(true);
    G.tray.open = mode === 'sandbox';
    G.floor = 0; G.walls = 'cut';
    SS.makeAgents(G); G.sarahF = undefined;
    G.sel = null; centerCam(true);
    G.screen = 'home';
    G.changed(true);
  }
  G.changed = function (save, keepSel) {
    G.version = (G.version || 0) + 1;
    if (save) { G.save.pieces = G.W.pieces.map(function (p) { var q = {}; for (var k in p) if (k !== 'work') q[k] = p[k]; return q; }); SS.writeMode(G.mode, G.save); }
  };
  G.snapshot = function () { G.undo.push(JSON.stringify({ pieces: G.W.pieces, stored: G.save.stored })); if (G.undo.length > 10) G.undo.shift(); };
  G.doUndo = function () {
    if (!G.undo.length) { G.toast('NOTHING TO UNDO', 1000); return; }
    var s = JSON.parse(G.undo.pop());
    G.W.pieces = []; G.W.byUid = {}; s.pieces.forEach(function (p) { G.W.add(p); }); G.save.stored = s.stored;
    G.sel = null; G.paint = null; G.hold = null; G.changed(true); G.toast('UNDONE', 800);
  };
  // lamps come on on their own in the evening and go off in the morning; a tap turns one on or off any time (spec 006, part A)
  function lampPhase(force) {
    var h = SS.now().getHours(), want = h >= 17 || h < 6 ? 'on' : 'off';
    if (G.save.lampPhase !== want) { G.save.lampPhase = want; G.W.pieces.forEach(function (p) { if (SS.DEF[p.id].lamp) p.lit = want === 'on'; }); if (!force) G.changed(true); }
  }

  // ---------- the camera ----------
  function houseCenter(f) { var W = G.W; return I.p(W.ax + W.home.w / 2, W.ay + W.home.d / 2, f * FH + 18); }
  function centerCam(reset) {
    var q = houseCenter(G.floor);
    if (reset) G.cam.zoom = 1;   // the whole floor at the approved look's own scale (look-iso-v1: 22 px tiles); pinch in for a corner
    // the middle of the space between the top bar and the tray
    var vc = (22 + G.H - SS.TRAY_H[G.trayState()]) / 2;
    G.cam.x = q[0] + SS.OFF[0] - 10; G.cam.y = q[1] + SS.OFF[1] + (G.H / 2 - vc) / G.cam.zoom;
  }
  function clampCam() { var W = G.W, l = I.p(0, W.lot)[0] + SS.OFF[0] + 40, r = I.p(W.lot, 0)[0] + SS.OFF[0] - 40, t = I.p(0, 0, (G.floor + 1) * FH + 20)[1] + SS.OFF[1], b = I.p(W.lot, W.lot)[1] + SS.OFF[1] - 30; G.cam.clamp(l, t, r, b); }
  G.setFloor = function (f) { if (f === G.floor) return; G.cam.y -= (f - G.floor) * FH; G.floor = f; G.bubble = null; clampCam(); };
  G.cycleWalls = function () { G.walls = { up: 'cut', cut: 'down', down: 'up' }[G.walls]; G.toast('WALLS ' + { up: 'UP', cut: 'CUT AWAY', down: 'DOWN' }[G.walls], 700); };
  function zoomAt(k, mid) {
    var before = G.cam.toWorld(mid.x, mid.y);
    G.cam.zoom = Math.max(1, Math.min(3, G.cam.zoom * k));
    var after = G.cam.toWorld(mid.x, mid.y);
    G.cam.x += before[0] - after[0]; G.cam.y += before[1] - after[1]; clampCam();
  }
  function snapZoom() { var z = G.cam.zoom, s = Math.round(z * 2) / 2; G.zoomTo = s; }
  // screen point -> world point (lot px, without the world canvas offset)
  function toWorld(p) { var q = G.cam.toWorld(p.x, p.y); return [q[0] - SS.OFF[0], q[1] - SS.OFF[1]]; }
  function toScreen(wx, wy) { return G.cam.toView(wx + SS.OFF[0], wy + SS.OFF[1]); }
  function tileAt(p, f) { var w = toWorld(p), q = I.tile(w[0], w[1], (f === undefined ? G.floor : f) * FH); return [Math.floor(q[0]), Math.floor(q[1]), q[0], q[1]]; }
  // keep a piece clear of the tray and the top bar (spec 001, part B: the tray never sits over a selected piece)
  function showPiece(p) {
    var W = G.W, ft = p.wall ? [p.wall[0], p.wall[1], p.wall[0] + 1, p.wall[1] + 1] : W.foot(p.host ? W.hostOf(p) : p);
    var q = I.p((ft[0] + ft[2]) / 2, (ft[1] + ft[3]) / 2, W.floorOf(p) * FH + 10), s = toScreen(q[0], q[1]);
    var bottom = G.H - SS.TRAY_H[G.trayState()] - 16, top = 50;
    if (s[1] > bottom) G.cam.y += (s[1] - bottom) / G.cam.zoom; if (s[1] < top) G.cam.y -= (top - s[1]) / G.cam.zoom;
    if (s[0] < 20) G.cam.x -= (20 - s[0]) / G.cam.zoom; if (s[0] > W0 - 40) G.cam.x += (s[0] - (W0 - 40)) / G.cam.zoom;
  }

  // ---------- the tray ----------
  G.trayState = function () {
    if (G.sel && G.W.byUid[G.sel]) return G.paint ? 'paint' : 'piece';
    return G.tray.open ? 'catalog' : 'closed';
  };
  G.toggleTray = function () { G.tray.open = !G.tray.open; G.focus = null; G.bubble = null; };
  G.catalogList = function (tab) {
    var defs = SS.CATALOG.filter(function (d) { return d.tab === tab && (!d.craft || G.mode === 'sandbox' || G.save.made.indexOf(d.id) >= 0); });
    if (tab === 'storage') defs.sort(function (a, b) { return (a.row ? (a.row === 'kitchen' ? 1 : 2) : 0) - (b.row ? (b.row === 'kitchen' ? 1 : 2) : 0); });
    var items = defs.map(function (d) { return { id: d.id, def: d, sw: 0, stored: G.save.stored.filter(function (s) { return s.id === d.id; }).length }; });
    if (tab === 'ours') items.unshift({ soon: true });
    return { items: items, total: SS.CATALOG.filter(function (d) { return !d.craft; }).length };
  };
  // taking a card: the piece comes up held in the middle of the view (buttons) or under the finger (a drag)
  G.takeCard = function (it, p) {
    if (it.soon) return;
    G.deselect(); G.bubble = null;
    var d = it.def, st = G.save.stored.filter(function (s) { return s.id === d.id; })[0];
    var inst = { id: d.id, sw: st ? st.sw : 0, props: st ? st.props !== false : true };
    if (st) { if (st.colors) inst.colors = st.colors; if (st.pats) inst.pats = st.pats; }
    if (d.lamp) inst.lit = G.mode === 'sandbox' || G.save.lampPhase === 'on';
    G.hold = { inst: inst, from: 'new', stored: st || null, r: 0, f: G.floor };
    var at = p || { x: W0 / 2, y: G.viewBottom / 2 + 10 };
    aimHold(at, !p);
  };
  G.startMove = function (p) { // pick a placed piece back up (Move): it lifts off, and goes back if she cancels
    G.snapshot(); G.undo.pop();
    var orig = JSON.parse(JSON.stringify(p));
    var stack = G.W.stacked(p).map(function (q) { return JSON.parse(JSON.stringify(q)); });
    G.W.remove(p);
    var inst = JSON.parse(JSON.stringify(orig)); delete inst.x; delete inst.y; delete inst.wall; delete inst.host; delete inst.spot;
    G.hold = { inst: inst, from: 'move', orig: orig, stack: stack, r: orig.r || 0, f: G.W.floorOf(orig) === undefined ? G.floor : (orig.host ? G.floor : orig.f) };
    G.sel = null; G.paint = null;
    var cand = orig.wall ? { wall: orig.wall } : orig.host ? { host: orig.host, spot: orig.spot } : { x: orig.x, y: orig.y };
    G.hold.cand = cand; G.hold.f = orig.f !== undefined ? orig.f : G.floor; checkHold();
  };
  // where a held piece would go for a screen point
  function aimHold(p, center) {
    var H = G.hold, d = SS.DEF[H.inst.id], f = G.floor, W = G.W;
    H.f = f;
    if (d.kind === 'wall') { H.cand = nearestWall(p, f, d); checkHold(); return; }
    if (d.kind === 'small' && !center) { // over a table, counter, dresser or shelf with a free spot: it stacks there
      var host = hostUnder(p, H);
      if (host) { H.cand = { host: host.p.uid, spot: host.spot }; checkHold(); return; }
    }
    var tl = tileAt(p, f), sz = W.size(d, H.r);
    var x = Math.round(tl[2] - sz[0] / 2), y = Math.round(tl[3] - sz[1] / 2);
    if (d.kind === 'small') { x = tl[0]; y = tl[1]; }
    if (center) { // with buttons: start on the nearest spot that fits
      var best = null;
      for (var dx = -6; dx <= 6; dx++) for (var dy = -6; dy <= 6; dy++) { var cc = { id: d.id, f: f, x: x + dx, y: y + dy, r: H.r }; if (W.check(cc).ok) { var dd = Math.abs(dx) + Math.abs(dy); if (!best || dd < best.d) best = { d: dd, x: cc.x, y: cc.y }; } }
      if (best) { x = best.x; y = best.y; }
    }
    H.cand = { x: x, y: y }; checkHold();
  }
  function hostUnder(p, H) {
    var w = toWorld(p), pick = SS.pick(G.lastHits || [], w[0], w[1], { noAgents: true }), W = G.W;
    if (!pick || !pick.piece) return null;
    var host = pick.piece, hd = W.def(host); if (!hd.spots.length || host.uid === (H.orig && H.orig.uid)) return null;
    var best = null;
    hd.spots.forEach(function (sp, i) {
      if (!W.spotFree(host, i)) return;
      var pos = W.spotPos(host, i), q = I.p(pos.x, pos.y, W.floorOf(host) * FH + pos.z), dd = Math.hypot(q[0] - w[0], q[1] - w[1]);
      if (!best || dd < best.d) best = { d: dd, spot: i };
    });
    return best ? { p: host, spot: best.spot } : null;
  }
  function nearestWall(p, f, d) { // wall pieces snap flat to the nearest wall she can see, at eye height
    var w = toWorld(p), W = G.W, best = null;
    W.walls[f].forEach(function (s) {
      if (!s.b || s.op) return;
      var mid = s.axis === 'x' ? I.p(s.x + .5, s.y, f * FH + 30) : I.p(s.x, s.y + .5, f * FH + 30);
      var dd = Math.hypot(mid[0] - w[0], mid[1] - w[1]);
      if (d.window && !s.win) dd += 1000; if (!d.window && s.win) dd += 60;
      if (!best || dd < best.d) best = { d: dd, s: s };
    });
    return best ? { wall: [best.s.x, best.s.y, best.s.axis] } : { wall: null };
  }
  function candOf(H) { var c0 = H.cand || {}, o = { id: H.inst.id, f: H.f, r: H.r }; for (var k in c0) o[k] = c0[k]; return o; }
  function checkHold() { var H = G.hold; if (!H) return; var r = G.W.check(candOf(H)); H.ok = r.ok; H.why = r.why; }
  function placeHold() {
    var H = G.hold, W = G.W;
    checkHold();
    if (!H.ok) { G.toast(H.why === 'DOORWAY' ? 'KEEP DOORWAYS CLEAR' : H.why === 'STAIRS' ? 'KEEP THE STAIRS CLEAR' : 'IT DOESN\'T FIT THERE', 1100); return false; }
    if (H.from === 'new') G.snapshot(); else G.undo.push(JSON.stringify({ pieces: W.pieces.concat([H.orig]).concat(H.stack), stored: G.save.stored }));
    var p = H.inst, cd = candOf(H);
    delete p.x; delete p.y; delete p.wall; delete p.host; delete p.spot;
    p.f = cd.f; p.r = SS.DEF[p.id].kind === 'wall' ? 0 : H.r;
    if (cd.wall) p.wall = cd.wall; else if (cd.host) { p.host = cd.host; p.spot = cd.spot; delete p.f; } else { p.x = cd.x; p.y = cd.y; }
    if (H.from === 'move') { W.add(p); H.stack.forEach(function (q) { W.add(q); }); }
    else { W.add(p); if (H.stored) G.save.stored.splice(G.save.stored.indexOf(H.stored), 1); }
    if (p.host) p.f = W.floorOf(p);
    SS.forgetSprite(p.uid);
    G.hold = null; G.changed(true);
    if (H.from === 'new') SS.catsNotice(G, p);
    return true;
  }
  function cancelHold(slide) {
    var H = G.hold; if (!H) return;
    if (H.from === 'move') { G.W.add(H.orig); H.stack.forEach(function (q) { G.W.add(q); }); G.undo.pop(); }
    if (slide) G.slideBack = { inst: H.inst, from: toScreen.apply(null, ghostScreen(H)), t0: performance.now() };
    G.hold = null;
  }
  function ghostScreen(H) {
    var W = G.W, cd = candOf(H), Z = H.f * FH;
    if (cd.wall) return I.p(cd.wall[0] + .5, cd.wall[1] + .5, Z + 30);
    if (cd.host) { var pos = W.spotPos(W.byUid[cd.host], cd.spot); return I.p(pos.x, pos.y, Z + pos.z + 10); }
    var sz = W.size(SS.DEF[H.inst.id], H.r); return I.p(cd.x + sz[0] / 2, cd.y + sz[1] / 2, Z + 10);
  }
  function turnHold() { var H = G.hold, d = SS.DEF[H.inst.id]; if (d.kind === 'wall') return; H.r = (H.r + 1) % 4; SS.forgetSprite('ghost'); checkHold(); }
  function moveHold(dir) {
    var H = G.hold, d = SS.DEF[H.inst.id], W = G.W, cd = H.cand || {};
    var D = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[dir];
    if (d.kind === 'wall' && cd.wall) { // slide along the wall
      var s = cd.wall, k = s[2] === 'x' ? D[0] || D[1] : D[1] || D[0], nx = s[2] === 'x' ? s[0] + k : s[0], ny = s[2] === 'y' ? s[1] + k : s[1];
      if (W.seg(H.f, nx, ny, s[2])) H.cand = { wall: [nx, ny, s[2]] };
    } else if (cd.host) { var pos = W.spotPos(W.byUid[cd.host], cd.spot); H.cand = { x: Math.floor(pos.x) + D[0], y: Math.floor(pos.y) + D[1] }; }
    else H.cand = { x: (cd.x || 0) + D[0], y: (cd.y || 0) + D[1] };
    checkHold();
  }

  // ---------- selecting placed pieces ----------
  G.select = function (p) { G.sel = p.uid; G.paint = null; G.bubble = null; showPiece(p); };
  G.deselect = function () { G.sel = null; G.paint = null; };
  G.putAway = function (p) { // Put away sends it back to her storage, never lost (spec 001, part C)
    G.snapshot();
    var all = [p].concat(G.W.stacked(p));
    all.forEach(function (q) { G.save.stored.push({ id: q.id, sw: q.sw || 0, colors: q.colors, pats: q.pats, props: q.props }); });
    G.W.remove(p); G.sel = null; G.paint = null; G.changed(true);
    G.toast('PUT AWAY', 1300, 'It waits in its catalog tab, marked with how many are stored.');
  };
  function turnPiece(p) {
    var d = G.W.def(p); if (d.kind === 'wall') return;
    G.snapshot();
    var r0 = p.r || 0; p.r = (r0 + 1) % 4;
    if (!p.host) { var ok = G.W.check({ id: p.id, f: p.f, x: p.x, y: p.y, r: p.r }, p).ok; if (!ok) { p.r = r0; G.undo.pop(); G.toast('NO ROOM TO TURN IT HERE', 1200); return; } }
    G.changed(true);
  }
  // a craft she made: placed near where she made it if there's room (spec 006, part B, Crafts)
  SS.placeNear = function (G, id, near) {
    var W = G.W, d = SS.DEF[id], f = W.floorOf(near), ft = W.foot(near.host ? W.hostOf(near) : near);
    var cx = (ft[0] + ft[2]) / 2, cy = (ft[1] + ft[3]) / 2, best = null;
    function tryC(cd, dd) { cd.id = id; cd.f = f; if (W.check(cd).ok && (!best || dd < best.d)) best = { d: dd, cd: cd }; }
    if (d.kind === 'wall') W.walls[f].forEach(function (s) { if (s.b && !s.op) tryC({ wall: [s.x, s.y, s.axis] }, Math.hypot(s.x - cx, s.y - cy)); });
    else {
      W.pieces.forEach(function (h) { var hd = W.def(h); if (W.floorOf(h) !== f || !hd.spots.length) return; hd.spots.forEach(function (sp, i) { var pos = W.spotPos(h, i); tryC({ host: h.uid, spot: i }, Math.hypot(pos.x - cx, pos.y - cy)); }); });
      if (!best) for (var x = W.ax; x < W.ax + W.home.w; x++) for (var y = W.ay; y < W.ay + W.home.d; y++) tryC({ x: x, y: y, r: 0 }, Math.hypot(x - cx, y - cy) + 2);
    }
    if (!best) return false;
    var p = { id: id, sw: 0, props: true }; for (var k in best.cd) if (k !== 'id') p[k] = best.cd[k];
    if (p.host) delete p.f; W.add(p); if (p.host) p.f = W.floorOf(p);
    SS.catsNotice(G, p);
    return true;
  };

  // ---------- the Start menu ----------
  G.openMenu = function () { cancelHold(false); G.bubble = null; G.menu = { kind: 'start', cur: 0 }; };
  G.closeMenu = function () { G.menu = null; };
  G.menuPick = function (i) {
    var r = SS.MENU_ROWS[i][1];
    if (r === 'home') G.closeMenu();
    else if (r === 'homes') G.menu = { kind: 'homes', cur: 0 };
    else if (r === 'backup') backup();
    else if (r === 'title') { G.changed(true); G.menu = null; G.screen = 'title'; G.titleCur = 0; }
    else G.toast(SS.MENU_ROWS[i][0] + ' IS COMING SOON', 1800, { people: 'People and Style come with outfits (spec 002).', fav: 'Favorites come in a later part.', camera: 'The camera comes in a later part.', book: 'The memory book comes in its own part.' }[r]);
  };
  function backup() {
    G.changed(true);
    SS.makeBackup().then(function (how) { G.toast(how === 'cancelled' ? 'NO BACKUP MADE' : 'BACKUP MADE', 2200, how === 'cancelled' ? '' : 'Keep the file somewhere safe, like Files. Import a save on the title reads it back.'); });
  }
  function importSave() {
    StudioBackup.pick().then(function (text) {
      if (text === null) return;
      var obj = SS.readBackup(text);
      if (!obj) { G.toast('THAT FILE ISN\'T A BACKUP', 2000, 'Pick a file made with Make a backup.'); return; }
      G.confirm = { title: 'IMPORT A SAVE', text: 'Replace everything on this phone with this backup? Every mode, the favorites and the gift come from the file.', options: ['NOT YET', 'REPLACE'], cur: 0,
        pick: function (i) { if (i === 1) { SS.restoreBackup(obj); G.toast('BACKUP IMPORTED', 1800); G.titleCur = 0; } } };
    });
  }
  G.confirmPick = function (i) { var q = G.confirm; G.confirm = null; if (q && q.pick) q.pick(i); };

  // ---------- Life: the action bubble ----------
  function openBubble(target, tip) {
    var acts = SS.actionsFor(G, target);
    if (!acts) { G.toast('NOTHING TO DO WITH THIS YET', 1000); return; }
    var title = target.agent ? (target.agent.who.toUpperCase() + (target.agent.who === 'keegan' ? ' · AT HIS DESK' : '')) : target.door ? 'BACK DOOR' : SS.DEF[target.piece.id].name.toUpperCase();
    if (target.agent && target.agent.who === 'keegan' && !target.agent.on) title = 'KEEGAN';
    G.bubble = { target: target, actions: acts, cur: 0, tip: tip, title: title };
  }
  G.doBubble = function (i) {
    var b = G.bubble; if (!b) return; var a = b.actions[i]; G.bubble = null;
    if (a.soon) { G.toast(a.name + (a.sub ? ' ' + a.sub : '') + ': COMING SOON', 1800, a.soon); return; }
    G.meters = null;
    var r = SS.chooseAction(G, b.target, a);
    if (r === 'queued') G.toast('LINED UP', 700); if (r === 'full') G.toast('3 THINGS ARE LINED UP ALREADY', 1200);
  };

  // ---------- input: taps ----------
  function uiHit(p) { for (var i = G.hits.length - 1; i >= 0; i--) { var h = G.hits[i]; if (p.x >= h.x && p.x < h.x + h.w && p.y >= h.y && p.y < h.y + h.h) return h; } return null; }
  function onTap(p) {
    if (G.screen === 'gift') { openGift(); return; }
    if (G.screen === 'open') { G.screen = 'title'; return; }
    var h = uiHit(p);
    if (h) { h.fn(p); return; }
    if (G.screen !== 'home') return;
    worldTap(p);
  }
  function worldTap(p) {
    var W = G.W, w = toWorld(p);
    if (G.hold) { // tap the held piece to turn it; tap elsewhere to move it there
      var g = ghostScreen(G.hold), gs = toScreen(g[0], g[1]);
      if (Math.hypot(gs[0] - p.x, gs[1] - p.y) < 14 * G.cam.zoom) turnHold(); else aimHold(p, false);
      return;
    }
    var pick = SS.pick(G.lastHits || [], w[0], w[1]);
    var playing = G.mode === 'life' && G.trayState() === 'closed';
    if (playing) {
      G.bubble = null; G.meters = null;
      if (pick && pick.agent) {
        if (pick.agent.who === 'sarah') { G.meters = G.meters === 'sarah' ? null : 'sarah'; return; }   // her three meters (spec 006, part C)
        openBubble({ agent: pick.agent }, [p.x, p.y - 8]); G.meters = pick.agent.who === 'keegan' ? 'keegan' : null; return;
      }
      if (pick && pick.piece) { var d = W.def(pick.piece); if (d.use) { openBubble({ piece: pick.piece }, [p.x, p.y - 8]); return; } }
      var door = backDoorAt(w); if (door) { openBubble({ door: door }, [p.x, p.y]); return; }
      // tap the floor to walk Sarah there
      var tl = tileAt(p);
      var s = G.people.sarah; SS.stopActions(G);
      var target = W.walkable(G.floor, tl[0], tl[1]) ? [tl[0], tl[1]] : StudioMove.nearestOpen(tl[0], tl[1], W.lot, W.lot, function (x, y) { return W.walkable(G.floor, x, y); });
      if (!target) return;
      var ok = SS.walkSarah(G, G.floor, target[0], target[1]);
      if (ok) G.tap = { x: target[0], y: target[1], f: G.floor, t0: performance.now() }; else G.toast('SARAH CAN\'T GET THERE', 900);
      return;
    }
    // decorating
    if (pick && pick.agent) {
      if (pick.agent.kind === 'cat') { var a = pick.agent; a.bubble = { icon: a.who === 'louie' ? '!' : 'heart', until: performance.now() + 1500 }; return; }
      G.toast('STYLE IS COMING SOON', 1500, 'Tap a person to dress them once outfits are built (spec 002).'); return;
    }
    if (pick && pick.piece) { G.select(pick.piece); return; }
    G.deselect(); G.focus = null;
  }
  function backDoorAt(w) {
    var W = G.W, f = G.floor, hit = null;
    W.walls[f].forEach(function (s) { if (s.op !== 'door' || !s.ext || !s.b) return; var q = I.p(s.x + .5, s.y, f * FH + 16); if (Math.abs(q[0] - w[0]) < 10 && Math.abs(q[1] - w[1]) < 18) hit = { f: f, x: s.x, y: s.y }; });
    return hit;
  }
  SS.walkSarah = function (G, f, x, y) {
    var s = G.people.sarah;
    SS.agentGetUp(G, s);
    var st = s.tile(), nodes = G.W.path({ f: st.f, x: st.x, y: st.y }, function (ff, xx, yy) { return ff === f && xx === x && yy === y; });
    if (!nodes) return false;
    SS.walkNodes(s, nodes); return true;
  };

  // ---------- input: drags and pinches ----------
  var drag = null;
  function onDragStart(p0, p) {
    if (G.screen !== 'home' || G.menu || G.confirm) { drag = { kind: 'none' }; return; }
    var h = uiHit(p0);
    if (h && h.card && !h.card.soon) { G.takeCard(h.card, p); drag = { kind: 'hold', fromTray: true }; return; }
    if (h) { drag = { kind: 'none' }; return; }
    if (G.hold) { drag = { kind: 'hold' }; aimHold(p, false); return; }
    // drag a selected piece to move it straight away
    var w = toWorld(p0), pick = SS.pick(G.lastHits || [], w[0], w[1], { noAgents: true });
    if (pick && pick.piece && pick.piece.uid === G.sel) { G.startMove(pick.piece); drag = { kind: 'hold', moving: true }; aimHold(p, false); return; }
    drag = { kind: 'pan', last: p };
  }
  function onDrag(p) {
    if (!drag) return;
    if (drag.kind === 'hold' && G.hold) aimHold(p, false);
    if (drag.kind === 'pan') { G.cam.x -= (p.x - drag.last.x) / G.cam.zoom; G.cam.y -= (p.y - drag.last.y) / G.cam.zoom; drag.last = p; clampCam(); }
  }
  function onDragEnd(p) {
    if (drag && drag.kind === 'hold' && G.hold) {
      // let go to place it; if it doesn't fit, it slides back to the tray (or back where it was)
      if (p.y > G.H - SS.TRAY_H[G.trayState()]) cancelHold(true);
      else if (!placeHold()) cancelHold(true);
    }
    drag = null;
  }
  function onCancel() { if (drag && drag.kind === 'hold') cancelHold(true); drag = null; }
  function onPinch(g) { if (G.screen !== 'home' || G.menu) return; zoomAt(g.scale, g.mid); G.cam.x -= g.dx / G.cam.zoom; G.cam.y -= g.dy / G.cam.zoom; clampCam(); }
  StudioGesture.attach(cv, { tap: onTap, dragStart: onDragStart, drag: onDrag, dragEnd: onDragEnd, cancel: onCancel, pinch: onPinch, pinchEnd: snapZoom });

  // ---------- input: buttons ----------
  function press(k) {
    if (G.screen === 'gift') { if (k === 'a') openGift(); return; }
    if (G.screen === 'open') { if (k === 'a' || k === 'b') G.screen = 'title'; return; }
    if (G.confirm) { var q = G.confirm; if (k === 'left' || k === 'right') q.cur = 1 - q.cur; if (k === 'a') G.confirmPick(q.cur); if (k === 'b') G.confirmPick(0); return; }
    if (G.screen === 'title') { titlePress(k); return; }
    if (G.menu) {
      var m = G.menu;
      if (m.kind === 'start') { if (k === 'up') m.cur = (m.cur + 7) % 8; if (k === 'down') m.cur = (m.cur + 1) % 8; if (k === 'a') G.menuPick(m.cur); if (k === 'b' || k === 'start') G.closeMenu(); }
      else if (k === 'b' || k === 'a') G.menu = { kind: 'start', cur: 2 };
      return;
    }
    if (G.toastT && k === 'a' && !G.hold && !G.bubble) { G.toastT = null; return; }
    if (k === 'start') { G.openMenu(); return; }
    if (G.meters && k === 'b' && !G.bubble) { G.meters = null; return; }
    if (G.bubble) { var b = G.bubble; if (k === 'b') G.meters = null; if (k === 'left' || k === 'up') b.cur = (b.cur + b.actions.length - 1) % b.actions.length; if (k === 'right' || k === 'down') b.cur = (b.cur + 1) % b.actions.length; if (k === 'a') G.doBubble(b.cur); if (k === 'b') G.bubble = null; return; }
    if (G.hold) { if (k === 'a') placeHold(); else if (k === 'b') cancelHold(false); else if (k === 'select') turnHold(); else if (DIRS[k]) moveHold(k); return; }
    if (G.focus === 'cards') {
      var T = G.tray, list = G.catalogList(T.tab).items;
      if (k === 'left') T.cur = Math.max(0, T.cur - 1); if (k === 'right') T.cur = Math.min(list.length - 1, T.cur + 1);
      if (k === 'up' || k === 'down') { var ti = SS.TABS.indexOf(T.tab); T.tab = SS.TABS[(ti + (k === 'down' ? 1 : SS.TABS.length - 1)) % SS.TABS.length]; T.cur = 0; }
      T.page = Math.floor(T.cur / 8);
      if (k === 'a' && list[T.cur]) { if (list[T.cur].soon) G.toast('OUR REAL THINGS', 2000, 'They come once Keegan\'s photos are drawn.'); else { G.focus = null; G.takeCard(list[T.cur]); } }
      if (k === 'b') G.focus = null;
      return;
    }
    var sel = G.sel && G.W.byUid[G.sel];
    if (sel) { if (k === 'select') turnPiece(sel); if (k === 'b') { if (G.paint) G.paint = null; else G.deselect(); } if (k === 'a') G.deselect(); if (DIRS[k]) pan(k); return; }
    var playing = G.mode === 'life' && G.trayState() === 'closed';
    if (playing && DIRS[k]) { stepSarah(k); return; }
    if (playing && k === 'a') { nearbyBubble(); return; }
    if (k === 'a' && G.trayState() === 'catalog') { G.focus = 'cards'; G.tray.cur = G.tray.page * 8; return; }
    if (k === 'b' && G.mode === 'life' && G.tray.open) { G.toggleTray(); return; }
    if (DIRS[k]) pan(k);
  }
  var DIRS = { up: 1, down: 1, left: 1, right: 1 };
  function pan(k) { var D = { up: [0, -12], down: [0, 12], left: [-12, 0], right: [12, 0] }[k]; G.cam.x += D[0] / G.cam.zoom; G.cam.y += D[1] / G.cam.zoom; clampCam(); }
  function stepSarah(k) { // the D-pad walks her a tile at a time (up is toward the back, down toward the front)
    var s = G.people.sarah; if (s.path.length > 1) return;
    SS.stopActions(G);
    var st = s.tile(), D = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[k], nx = st.x + D[0], ny = st.y + D[1];
    if (!G.W.walkable(st.f, nx, ny) || G.W.wallBetween(st.f, st.x, st.y, nx, ny)) {
      // the stairs: step onto them from their foot or head
      var up = G.W.stairs.filter(function (q) { return q.floor === st.f && q.from[0] === st.x && q.from[1] === st.y && q.tiles[0][0] === nx && q.tiles[0][1] === ny; })[0];
      var dn = G.W.stairs.filter(function (q) { return q.floor + 1 === st.f && q.to[0] === st.x && q.to[1] === st.y; })[0];
      if (up) SS.walkSarah(G, st.f + 1, up.to[0], up.to[1]); else if (dn && G.W.wellAt(st.f, nx, ny)) SS.walkSarah(G, st.f - 1, dn.from[0], dn.from[1]);
      else { s.flip = (D[0] - D[1]) < 0; s.back = (D[0] + D[1]) < 0; }
      return;
    }
    SS.walkSarah(G, st.f, nx, ny);
  }
  function nearbyBubble() {
    var s = G.people.sarah, st = s.tile(), W = G.W;
    var p = W.pieces.filter(function (q) { return W.def(q).use && W.floorOf(q) === st.f && W.useTiles(q).some(function (u) { return u[0] === st.x && u[1] === st.y; }); })[0];
    if (p) { var q = I.p(st.x + .5, st.y + .5, st.f * FH + 30), sc = toScreen(q[0], q[1]); openBubble({ piece: p }, sc); }
  }
  StudioInput.start({ press: press });

  // ---------- the title ----------
  function openGift() { if (G.giftAnim) return; G.giftAnim = performance.now(); }
  function titleRows() {
    var rows = [];
    var last = SS.lastMode(); if (last) rows.push({ k: 'continue', label: 'CONTINUE', right: last === 'life' ? 'LIFE · ' + SS.weekday(new Date()) : 'SANDBOX' });
    rows.push({ k: 'sandbox', label: 'SANDBOX' }, { k: 'life', label: 'LIFE' }, { k: 'challenges', label: 'CHALLENGES' });
    return rows;
  }
  function titlePick(r) {
    if (r.k === 'continue') openMode(SS.lastMode());
    else if (r.k === 'challenges') G.toast('CHALLENGES ARE COMING SOON', 1800, 'They\'re built last, after everything else.');
    else openMode(r.k);
  }
  function titlePress(k) {
    var rows = titleRows();
    if (G.reminder) { if (k === 'left' || k === 'right') G.reminder.cur = 1 - G.reminder.cur; if (k === 'a') reminderPick(G.reminder.cur); if (k === 'b') reminderPick(1); return; }
    if (k === 'up') G.titleCur = (G.titleCur + rows.length) % (rows.length + 1);
    if (k === 'down') G.titleCur = (G.titleCur + 1) % (rows.length + 1);
    if (G.titleCur > rows.length) G.titleCur = 0;
    if (k === 'a') { if (G.titleCur === rows.length) importSave(); else titlePick(rows[G.titleCur]); }
  }
  function reminderPick(i) { if (i === 0) backup(); else SS.notNow(); G.reminder = null; }
  function drawTitle(H, t) {
    var A = SS.titleArt; A.use(c); SS.use(c);
    var W = W0;
    A.sky(W, H, t, 1); A.moon(W - 34, 62, 9);
    var gy = G.screen === 'open' ? H - 70 : H - 100;
    A.street(W, H, t, gy, gy - 150); A.snowfall(W, H, t, 80, true);
    A.titleText(W, 14);
    if (G.screen === 'open') {
      for (var i = 0; i < 16; i++) { var x = (A.rnd(i + 200) * W), y = (A.rnd(i + 300) * H * .6 + t * 3) % (H * .7); A.R(x, y, 2, 3, i % 3 ? A.P.gold : A.P.rose); }
      var X = window.SS_PRIVATE.christmas, bx = 12, by = H - 62, bw = W - 24, bh = 52;
      A.R(bx, by, bw, bh, 'rgba(255,246,234,.97)'); A.R(bx, by + bh - 1, bw, 1, A.P.trayEdge); c.strokeStyle = A.P.rose; c.strokeRect(bx + .5, by + .5, bw - 1, bh - 1);
      X.lines.slice(0, 2).forEach(function (l, k) { A.txt(l.toUpperCase(), bx + 10, by + 9 + k * 11, A.P.ink, 7); });
      A.heart(bx + 12 + SS.tw(X.lines[X.lines.length - 1].toUpperCase(), 7), by + 9 + (Math.min(2, X.lines.length) - 1) * 11, A.P.rose);
      A.txt('LOVE, ' + X.sign.toUpperCase(), bx + bw - 10, by + 33, A.P.soft, 6, 'right');
      A.txt('TAP TO GO IN', bx + bw / 2, by + bh - 9, A.P.roseSh, 5, 'center');
      return;
    }
    // the menu card: Continue (when there's a save), Sandbox, Life, Challenges and the small Import a save link
    var rows = titleRows(), mw = 150, mx = (W - mw) / 2, rh = 15, my = H - 8 - rows.length * rh - 20;
    A.R(mx, my, mw, rows.length * rh + 20, 'rgba(255,246,234,.96)'); A.R(mx, my + rows.length * rh + 19, mw, 1, A.P.trayEdge); c.strokeStyle = A.P.rose; c.strokeRect(mx + .5, my + .5, mw - 1, rows.length * rh + 19);
    rows.forEach(function (r, i) {
      var y = my + 4 + i * rh, on = i === G.titleCur && !G.reminder;
      if (on) { A.R(mx + 4, y, mw - 8, rh - 2, A.P.rose); A.R(mx + 4, y + rh - 3, mw - 8, 1, A.P.roseSh); A.heart(mx + 9, y + 4, '#fff'); }
      A.txt(r.label, mx + 20, y + 4, on ? '#fff' : A.P.ink, 7);
      if (r.right) A.txt(r.right, mx + mw - 9, y + 5, on ? '#ffe0e8' : A.P.soft, 5, 'right');
      SS.hit(G, mx + 4, y - 1, mw - 8, rh, function () { G.titleCur = i; titlePick(r); });
    });
    var iy = my + rows.length * rh + 8, on2 = G.titleCur === rows.length;
    A.txt('IMPORT A SAVE', W / 2, iy, on2 ? A.P.rose : A.P.soft, 5, 'center'); A.R(W / 2 - 32, iy + 6, 64, 1, on2 ? A.P.rose : A.P.soft);
    SS.hit(G, W / 2 - 40, iy - 4, 80, 13, function () { G.titleCur = rows.length; importSave(); });
    // the backup reminder: a small card, one tap makes the file, Not now waits a month (bible, Saves, Reminders)
    if (G.reminder) {
      var rw = 200, rx = (W - rw) / 2, ry = 52, rh2 = 50;
      SS.frame(rx, ry, rw, rh2); SS.heart(rx + 8, ry + 7, A.P.rose); A.txt('MAKE A BACKUP?', rx + 19, ry + 7, A.P.ink, 7);
      SS.vt('Saves live on this phone. A file keeps them safe.', rx + 8, ry + 18, A.P.ink, 11);
      ['MAKE IT', 'NOT NOW'].forEach(function (o, i) { var bx = rx + 8 + i * 96; SS.btn(bx, ry + 32, 88, o, G.reminder.cur === i, 13); SS.hit(G, bx, ry + 30, 88, 17, function () { reminderPick(i); }); });
    }
  }

  // ---------- the home screen ----------
  function drawHome(H, t, now) {
    var W = G.W, trayH = SS.TRAY_H[G.trayState()];
    G.viewBottom = H - trayH;
    // outside the room: the dark warm backdrop with gentle snow (look-iso-v1)
    var g = c.createRadialGradient(W0 / 2, H * .45, 20, W0 / 2, H * .45, W0); g.addColorStop(0, '#3a2633'); g.addColorStop(1, '#22171f');
    c.fillStyle = g; c.fillRect(0, 0, W0, H);
    if (G.look.snow) for (var i = 0; i < 26; i++) { var sx = (i * 37 + t * (i % 3 + 1)) % W0, sy = (i * 53 + t * 2 * (1 + i % 2)) % (H - trayH); c.fillStyle = 'rgba(255,255,255,' + (.25 + (i % 3) * .15) + ')'; c.fillRect(sx, sy, 1 + (i % 4 === 0), 1 + (i % 4 === 0)); }
    // the world, drawn at 1x then zoomed with crisp pixels
    var glows = [], ghost = null;
    if (G.hold) {
      var Hd = G.hold, cd = candOf(Hd), d = SS.DEF[Hd.inst.id];
      if (cd.x !== undefined && d.kind !== 'wall' && !cd.host) { var sz = W.size(d, Hd.r), tl = []; var n0 = d.kind === 'small' ? 1 : Math.ceil(sz[0] - 1e-6), n1 = d.kind === 'small' ? 1 : Math.ceil(sz[1] - 1e-6); for (var x = 0; x < n0; x++) for (var y = 0; y < n1; y++) tl.push([cd.x + x, cd.y + y]); glows.push({ tiles: tl, ok: Hd.ok }); }
      ghost = ghostItem(Hd, t);
    }
    G.cam.fit(W0, H);
    var selP = G.sel && W.byUid[G.sel];
    if (selP && !selP.wall && W.floorOf(selP) === G.floor) { var fs = W.foot(selP.host ? W.hostOf(selP) : selP), st = []; for (var sx2 = fs[0]; sx2 < fs[2]; sx2++) for (var sy2 = fs[1]; sy2 < fs[3]; sy2++) st.push([sx2, sy2]); glows.push({ tiles: st, sel: true }); }
    var hits = SS.drawScene(wc, W, { version: G.version + ':' + (G.hold ? G.hold.from : ''), floor: G.floor, walls: G.walls, t: t, look: G.look, agents: G.agents, glows: glows, ghost: ghost, sel: G.sel });
    G.lastHits = hits;
    var src = G.cam.src();
    c.imageSmoothingEnabled = false;
    c.drawImage(world, src[0], src[1], src[2], src[3], 0, 0, W0, H);
    // a soft ring where she tapped to walk
    if (G.tap && now - G.tap.t0 < 600 && G.tap.f === G.floor) { var tq = I.p(G.tap.x + .5, G.tap.y + .5, G.floor * FH), ts = toScreen(tq[0], tq[1]), k = (now - G.tap.t0) / 600; c.strokeStyle = 'rgba(255,255,255,' + (1 - k) + ')'; c.beginPath(); c.ellipse(ts[0], ts[1], (6 + k * 6) * G.cam.zoom, (3 + k * 3) * G.cam.zoom, 0, 0, 7); c.stroke(); }
    // chips over the held or selected piece
    if (G.hold && !(drag && drag.kind === 'hold')) {
      var gq = ghostScreen(G.hold), gs = toScreen(gq[0], gq[1] - 30);
      var sym = G.hold.ok ? '✓' : '✕';
      SS.drawChips(G, gs[0], Math.max(24, gs[1] - 10), [{ icon: 'turn', fn: turnHold }, { icon: 'OK', on: G.hold.ok, fn: function () { placeHold(); } }, { icon: 'away', fn: function () { cancelHold(false); } }]);
      markFit(gs[0] + 30, Math.max(24, gs[1] - 10), G.hold.ok);
    } else if (G.hold) { var gq2 = ghostScreen(G.hold), gs2 = toScreen(gq2[0], gq2[1] - 26); markFit(gs2[0], gs2[1], G.hold.ok); }
    var sel = G.sel && W.byUid[G.sel];
    if (sel && !G.paint) {
      var sw = selTop(sel), ss = toScreen(sw[0], sw[1]);
      var chips = []; if (W.def(sel).kind !== 'wall') chips.push({ icon: 'turn', fn: function () { turnPiece(sel); } });
      chips.push({ icon: 'move', fn: function () { G.startMove(sel); } }, { icon: 'away', fn: function () { G.putAway(sel); } });
      SS.drawChips(G, ss[0], Math.max(24, ss[1] - 18), chips);
    }
    // the hint line
    var hint = G.hold ? (G.hold.ok ? 'DRAG TO MOVE · TAP IT TO TURN · OK PLACES' : (G.hold.why === 'DOORWAY' ? 'KEEP DOORWAYS CLEAR' : G.hold.why === 'NEEDS A WINDOW' ? 'CURTAINS GO ON A WINDOW' : G.hold.why === 'STAIRS' ? 'KEEP THE STAIRS CLEAR' : 'IT DOESN\'T FIT HERE'))
      : G.trayState() === 'catalog' ? 'DRAG A PIECE INTO THE ROOM' : G.trayState() === 'closed' && G.mode === 'life' ? 'TAP THE FLOOR TO WALK · TAP THINGS TO DO' : G.sel ? 'TAP A SWATCH · PAINT ANY PART' : '';
    if (hint && !G.menu) SS.txt(hint, W0 / 2, H - trayH - 12, 'rgba(255,241,226,.85)', 5, 'center');
    if (G.sleeping) sleepScene(H - trayH, now);
    SS.drawTopBar(G, W0);
    SS.drawViewControls(G, W0, G.mode === 'life' && (G.act || G.queue.length) ? 40 : 24, H - trayH - 16);
    SS.drawTray(G, W0, H);
    if (G.slideBack) slideBackAnim(now, H);
    if (G.bubble) SS.drawBubble2(G, W0, G.bubble);
    if (G.meters && G.mode === 'life') SS.drawMeters(G, G.bubble ? W0 - 92 : 4, G.bubble ? G.bubbleTop + 2 : 40, G.meters);   // beside the bubble, as in cooking-v1
  }
  function markFit(x, y, ok) { if (ok) SS.check(x - 4, y + 2, '#8fd08c'); else SS.cross(x - 3, y + 2, '#e46f8b'); }
  function selTop(p) { var W = G.W, d = W.def(p), f = W.floorOf(p), Z = f * FH; if (p.wall) { var wp = W.wallPlace(p); return I.p(wp.x + (p.wall[2] === 'x' ? d.w / 2 : 0), wp.y + (p.wall[2] === 'y' ? d.w / 2 : 0), Z + wp.z + d.h); } if (p.host) { var pos = W.spotPos(W.hostOf(p), p.spot); return I.p(pos.x, pos.y, Z + pos.z + d.h + 6); } var ft = W.foot(p); return I.p((ft[0] + ft[2]) / 2, (ft[1] + ft[3]) / 2, Z + Math.min(60, d.h + 8)); }
  function ghostItem(Hd, t) {
    var W = G.W, cd = candOf(Hd), d = SS.DEF[Hd.inst.id], inst = Hd.inst, lift = 6 + Math.round(Math.sin(t / 2));
    var tmp = { uid: 'ghost', id: inst.id, r: Hd.r, sw: inst.sw, colors: inst.colors, pats: inst.pats, props: inst.props, lit: inst.lit };
    var place, wx, wy, wz;
    if (cd.wall) { var wp = W.wallPlace({ id: inst.id, wall: cd.wall }); place = { rot: wp.rot }; wx = wp.x; wy = wp.y; wz = wp.z; tmp.wall = cd.wall; }
    else if (cd.host) { var pos = W.spotPos(W.byUid[cd.host], cd.spot); place = { rot: Hd.r }; wx = pos.x - .5; wy = pos.y - .5; wz = pos.z + 3; }
    else if (cd.x !== undefined) { place = { rot: Hd.r }; wx = cd.x; wy = cd.y; wz = lift; if (d.kind === 'rug') wz = 2; }
    else return null;
    var sp = SS.pieceSprite(tmp, null, t, place);
    return { f: Hd.f, item: function (Z) {
      var q = I.p(wx, wy, Z + wz), sz = W.size(d, Hd.r);
      return { kind: 'ghost', x0: wx, x1: wx + (cd.wall ? .2 : sz[0]), y0: wy, y1: wy + (cd.wall ? .2 : sz[1]), z0: Z + wz, z1: Z + wz + d.h, draw: function (cc) { cc.globalAlpha = Hd.ok ? .92 : .6; cc.drawImage(sp.cv, Math.round(q[0] - sp.ox), Math.round(q[1] - sp.oy)); cc.globalAlpha = 1; } };
    } };
  }
  function slideBackAnim(now, H) { // a piece that didn't fit slides back to the tray
    var S = G.slideBack, k = (now - S.t0) / 300; if (k >= 1) { G.slideBack = null; return; }
    var th = SS.thumb(S.inst.id, S.inst.sw), x = S.from[0] + (W0 / 2 - S.from[0]) * k, y = S.from[1] + (H - 30 - S.from[1]) * k;
    c.globalAlpha = 1 - k * .6; c.drawImage(th, Math.round(x - th.width / 2), Math.round(y - th.height / 2)); c.globalAlpha = 1;
  }
  function sleepScene(h, now) { // Sleep: the screen fades to a cozy sleeping scene (spec 006, part B, Sleep)
    var k = Math.min(1, ((G.act && G.act.t) || 0) / 2);
    c.fillStyle = 'rgba(28,22,48,' + (.65 * k) + ')'; c.fillRect(0, 0, W0, h);
    c.globalAlpha = k;
    c.fillStyle = '#fff3d6'; c.beginPath(); c.arc(W0 / 2 + 50, 60, 8, 0, 7); c.fill(); c.fillStyle = 'rgba(28,22,48,1)'; c.beginPath(); c.arc(W0 / 2 + 54, 57, 7, 0, 7); c.fill();
    for (var i = 0; i < 14; i++) { var tw = (Math.floor(now / 400) + i) % 5 === 0; c.fillStyle = tw ? '#fff' : 'rgba(255,241,226,.6)'; c.fillRect(Math.round(SS.rnd(i) * W0), Math.round(30 + SS.rnd(i + 9) * (h - 80)), 1, 1); }
    SS.txt('SWEET DREAMS', W0 / 2, h / 2 - 4, '#fff1e2', 8, 'center');
    var zz = Math.floor(now / 500) % 3; SS.txt('z z z'.slice(0, 1 + zz * 2), W0 / 2, h / 2 + 10, 'rgba(255,241,226,.8)', 6, 'center');
    c.globalAlpha = 1;
  }

  // ---------- the loop ----------
  var clock = StudioClock.make(), lastT = performance.now(), lastSecond = 0, lastDraw = 0;
  function loop(now) {
    var n = clock.ticks(now);
    var dt = Math.min(.1, (now - lastT) / 1000); lastT = now;
    if (n && now - lastDraw >= 30) {
      lastDraw = now;
      var t = G.t = Math.floor(now / 250);
      G.hits = [];
      SS.use(c); c.setTransform(1, 0, 0, 1, 0, 0); c.imageSmoothingEnabled = false;
      var H = G.H;
      if (G.screen === 'gift') {
        var k = G.giftAnim ? Math.min(1, (now - G.giftAnim) / 1100) : 0;
        SS.titleArt.use(c); SS.titleArt.gift(W0, H, t, k);
        if (k > .55) { c.fillStyle = 'rgba(255,246,234,' + Math.min(1, (k - .55) * 2.2) + ')'; c.fillRect(0, 0, W0, H); }
        if (k >= 1) { SS.markGift(); G.screen = 'open'; G.giftAnim = null; }
      } else if (G.screen === 'open' || G.screen === 'title') drawTitle(H, t);
      else {
        if (now - lastSecond > 1000) { lastSecond = now; G.look = SS.look(SS.now(), G.mode); if (G.mode === 'life') lampPhase(false); }
        if (G.zoomTo) { G.cam.zoom += (G.zoomTo - G.cam.zoom) * .3; if (Math.abs(G.zoomTo - G.cam.zoom) < .01) { G.cam.zoom = G.zoomTo; G.zoomTo = null; } }
        SS.updateAgents(G, dt);
        var sf = G.people.sarah.f; if (G.mode === 'life' && G.sarahF !== undefined && sf !== G.sarahF && sf !== G.floor) G.setFloor(sf); G.sarahF = sf;   // follow her up and down the stairs
        drawHome(H, t, now);
        if (G.menu) SS.drawMenu(G, W0, H);
      }
      if (G.toastT) { if (now > G.toastT.until) G.toastT = null; else SS.drawToast(G, W0, H, G.toastT); }
      if (G.confirm) SS.drawConfirm(G, W0, H, G.confirm);
    }
    requestAnimationFrame(loop);
  }

  // save on close (studio-bible/saves.md)
  window.addEventListener('pagehide', function () { if (G.screen === 'home' && G.save) G.changed(true); });
  document.addEventListener('visibilitychange', function () { if (document.hidden && G.screen === 'home' && G.save) G.changed(true); });

  // ---------- start ----------
  SS.loadAll();
  fit();
  if (!SS.giftOpened()) G.screen = 'gift';
  else { G.screen = 'title'; if (SS.wantsBackup()) G.reminder = { cur: 0 }; if (window.Studio && Studio.continued && SS.lastMode()) openMode(SS.lastMode()); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { SS.forgetAll && SS.forgetAll(); });
  requestAnimationFrame(loop);
  G.openMode = openMode;   // for the checks
})();
