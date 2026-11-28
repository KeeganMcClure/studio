// Sarah's Sim: keeping designs, favorites and the camera (spec 001, part E; bible, Play, Keeping designs; mockups/favorites-v1,
// mockups/camera-v1).
//   Favorites: Save this room keeps every piece in a room (spot, turn, colors, props, what's stacked on it and hung on its walls),
//   plus its floor and wallpaper, under a short name like "Cozy living room". Picking one, then tapping a room in any home in any
//   mode, places every piece that fits and sends the rest to storage. Kept once for the whole game (ss.favorites), with no limit.
//   The Outfits tab fills in with Style (spec 002, part E).
//   The camera: the room view with everything else dark, corner marks showing exactly what she'll get; she can still pinch, slide
//   and flip the walls. The heart takes the picture: a clean picture of the room (no tray, bar or buttons) goes to her phone through
//   the share sheet, and a small copy into the memory book's Photos (up to 60; it asks before the oldest goes).
// Life mode: until coins and the shop (spec 006, part F), placing a favorite costs nothing, as with every piece in Life for now.
(function () {
  // ---------- favorites ----------
  SS.favorites = function () { try { return JSON.parse(SS.store.get('favorites') || '[]'); } catch (e) { return []; } };
  function saveFavs(list) { SS.store.set('favorites', JSON.stringify(list)); }
  var WORDS = ['Cozy', 'Sunny', 'Snug', 'Sweet', 'Dreamy', 'Happy', 'Quiet', 'Lovely'];
  // the room a lot tile is in, with its tiles and the corner they start from
  SS.roomAt = function (G, f, x, y) {
    var W = G.W, r = W.room(f, x, y); if (!r) return null;
    var tiles = [], x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (var tx = 0; tx < W.lot; tx++) for (var ty = 0; ty < W.lot; ty++) if (W.room(f, tx, ty) === r) { tiles.push(tx + ',' + ty); x0 = Math.min(x0, tx); y0 = Math.min(y0, ty); x1 = Math.max(x1, tx + 1); y1 = Math.max(y1, ty + 1); }
    return { f: f, r: r, tiles: tiles, x0: x0, y0: y0, x1: x1, y1: y1 };
  };
  function piecesIn(G, R0) {
    var W = G.W, keep = {};
    W.pieces.forEach(function (p) {
      if (W.floorOf(p) !== R0.f || p.host) return;
      if (p.wall) { var ok = W.wallSegs(p).some(function (k) { var m = /^(-?\d+),(-?\d+)(x|y)$/.exec(k), s = m && W.seg(R0.f, +m[1], +m[2], m[3]); return s && W.roomOn(s, p.side) === R0.r; }); if (ok) keep[p.uid] = 1; return; }
      if (R0.tiles.indexOf(p.x + ',' + p.y) >= 0) keep[p.uid] = 1;
    });
    var grew = true; while (grew) { grew = false; W.pieces.forEach(function (p) { if (p.host && !keep[p.uid] && keep[p.host]) { keep[p.uid] = 1; grew = true; } }); }
    return W.pieces.filter(function (p) { return keep[p.uid]; });
  }
  // Save this room
  SS.saveRoom = function (G, f, x, y) {
    var R0 = SS.roomAt(G, f, x, y); if (!R0) { G.toast('THAT\'S NOT A ROOM', 1000); return null; }
    var list = piecesIn(G, R0), copy = function (p) { var q = {}; for (var k in p) if (k !== 'work') q[k] = p[k]; return JSON.parse(JSON.stringify(q)); };
    var rel = list.map(function (p) {
      var q = copy(p);
      if (q.wall) q.wall = [q.wall[0] - R0.x0, q.wall[1] - R0.y0, q.wall[2]];
      else if (!q.host) { q.x -= R0.x0; q.y -= R0.y0; }
      delete q.f; return q;
    });
    var used = SS.favorites().map(function (v) { return v.name; }), name = '';
    for (var i = 0; i < WORDS.length * 2 && (!name || used.indexOf(name) >= 0); i++) name = WORDS[i % WORDS.length] + ' ' + R0.r.name.toLowerCase() + (i >= WORDS.length ? ' ' + (i - WORDS.length + 2) : '');
    var fav = {
      kind: 'room', name: name, room: R0.r.name, w: R0.x1 - R0.x0, d: R0.y1 - R0.y0, floor: R0.r.floor, paper: R0.r.paper, pieces: rel, made: Date.now(),
      // its picture, as a recipe (book.js draws it): the room's own pieces where they stood, in the view she saved it from
      pic: { home: G.save.home, f: f, x: (R0.x0 + R0.x1) / 2, y: (R0.y0 + R0.y1) / 2, k: SS.view.k, pieces: list.map(copy), agents: [], looks: G.save.roomLook || null, span: 22 * Math.max(R0.x1 - R0.x0, R0.y1 - R0.y0) + 40 }
    };
    var all = SS.favorites(); all.push(fav); saveFavs(all);
    SS.moment(G, 'favorite', { f: f, x: fav.pic.x, y: fav.pic.y });
    return fav;
  };
  SS.renameFavorite = function (i, name) { var all = SS.favorites(); if (!all[i] || !name) return; all[i].name = String(name).slice(0, 24); saveFavs(all); PICS = {}; };
  // use a favorite on the room at a tile: everything that fits is placed; the rest goes to storage
  SS.applyFavorite = function (G, fav, f, x, y) {
    var R0 = SS.roomAt(G, f, x, y); if (!R0) { G.toast('TAP A ROOM', 1000); return null; }
    var W = G.W, placed = 0, stored = 0, map = {}, store = function (p) { G.save.stored.push({ id: p.id, sw: p.sw || 0, colors: p.colors, pats: p.pats, props: p.props }); stored++; };
    G.snapshot();
    var fresh = function (p) { var q = JSON.parse(JSON.stringify(p)); delete q.uid; delete q.host; delete q.spot; return q; };
    // floor pieces first, then what hangs on the walls, then what stacks on them
    fav.pieces.filter(function (p) { return !p.host && !p.wall; }).forEach(function (p) {
      var q = fresh(p); q.f = f; q.x = R0.x0 + p.x; q.y = R0.y0 + p.y;
      if (R0.tiles.indexOf(q.x + ',' + q.y) >= 0 && W.check({ id: q.id, f: f, x: q.x, y: q.y, r: q.r || 0 }).ok) { W.add(q); map[p.uid] = q.uid; placed++; } else store(p);
    });
    fav.pieces.filter(function (p) { return p.wall; }).forEach(function (p) {
      var q = fresh(p); q.f = f; q.wall = [R0.x0 + p.wall[0], R0.y0 + p.wall[1], p.wall[2]];
      var s = W.seg(f, q.wall[0], q.wall[1], q.wall[2]);
      if (s && W.roomOn(s, q.side) === R0.r && W.check({ id: q.id, f: f, wall: q.wall, side: q.side }).ok) { W.add(q); map[p.uid] = q.uid; placed++; } else store(p);
    });
    var left = fav.pieces.filter(function (p) { return p.host; }), n = 0;
    while (left.length && n++ < 6) left = left.filter(function (p) {
      if (map[p.host] === undefined) { var hostThere = fav.pieces.some(function (h) { return h.uid === p.host; }); if (hostThere && left.some(function (h) { return h.uid === p.host; })) return true; store(p); return false; }
      var q = fresh(p); q.host = map[p.host]; q.spot = p.spot; q.f = f;
      if (W.check({ id: q.id, host: q.host, spot: q.spot }).ok) { W.add(q); map[p.uid] = q.uid; placed++; } else store(p);
      return false;
    });
    left.forEach(store);
    // the room takes the favorite's floor and wallpaper, for this save
    if (fav.floor || fav.paper) { var L = G.save.roomLook || (G.save.roomLook = {}); L[f + ':' + R0.r.id] = { floor: fav.floor, paper: fav.paper }; R0.r.floor = fav.floor || R0.r.floor; R0.r.paper = fav.paper || R0.r.paper; }
    W.pieces.forEach(function (p) { SS.forgetSprite(p.uid); });
    G.changed(true);
    return { placed: placed, stored: stored };
  };
  var PICS = {};
  SS.favPicture = function (fav, i, w, h) { var k = i + ':' + fav.made + ':' + w + 'x' + h; return PICS[k] || (PICS[k] = SS.drawRecipe(fav.pic, w, h, SS.look(new Date(2026, 0, 1, 12), 'sandbox'), 'fav:' + k)); };

  // ---------- the Favorites screen (favorites-v1) ----------
  var P = SS.P, R = SS.R, txt = SS.txt;
  SS.openFavorites = function (G) { G.bubble = null; G.menu = { kind: 'fav', tab: 'rooms', page: 0, cur: 0 }; };
  SS.drawFavorites = function (G, W, H) {
    var c = G.c, m = G.menu, all = SS.favorites(), hit = function (x, y, w, h, fn) { G.hits.push({ x: x, y: y, w: w, h: h, fn: fn }); };
    R(0, 0, W, H, 'rgba(34,18,28,.62)'); hit(0, 0, W, H, function () { G.menu = { kind: 'start', cur: 3 }; });
    var w = 200, tileH = 62, rows = Math.max(1, Math.min(3, Math.floor((H - 130) / (tileH + 6)))), h = 22 + 18 + rows * (tileH + 6) + 22, x = (W - w) / 2, y = Math.max(4, Math.round((H - h) / 2) - 6);
    SS.frame(x, y, w, h); SS.header(x, y, w, 'FAVORITES', 'EVERY MODE'); hit(x, y, w, h, function () {});
    ['ROOMS', 'OUTFITS'].forEach(function (t, i) {
      var tx = x + 6 + i * ((w - 12) / 2), tw = (w - 12) / 2 - 2, on = (i === 0) === (m.tab === 'rooms');
      R(tx, y + 22, tw, 13, on ? P.rose : P.cell); txt(t, tx + tw / 2, y + 25, on ? '#fff' : P.ink, 6, 'center');
      hit(tx, y + 22, tw, 13, function () { m.tab = i === 0 ? 'rooms' : 'outfits'; m.page = 0; m.cur = 0; });
    });
    var gy = y + 40, gw = (w - 18) / 2;
    if (m.tab === 'outfits') {
      SS.vt('Outfit favorites come with Style:', W / 2, gy + 20, P.soft, 11, 'center'); SS.vt('save one with the heart there.', W / 2, gy + 32, P.soft, 11, 'center');
    } else {
      var items = all.map(function (f, i) { return { fav: f, i: i }; }).filter(function (o) { return o.fav.kind === 'room'; }).concat([{ save: true }]);
      var per = rows * 2, pages = Math.max(1, Math.ceil(items.length / per)); m.page = Math.min(m.page, pages - 1); m.cur = Math.min(m.cur, items.length - 1);
      items.slice(m.page * per, m.page * per + per).forEach(function (it, j) {
        var k = m.page * per + j, tx = x + 6 + (j % 2) * (gw + 6), ty = gy + Math.floor(j / 2) * (tileH + 6), sel = k === m.cur;
        if (it.save) {
          c.strokeStyle = P.rose; c.setLineDash([3, 2]); c.strokeRect(tx + .5, ty + .5, gw - 1, tileH - 1); c.setLineDash([]);
          R(tx + gw / 2 - 1, ty + 14, 3, 13, P.rose); R(tx + gw / 2 - 6, ty + 19, 13, 3, P.rose);
          txt('SAVE THIS', tx + gw / 2, ty + 34, P.rose, 5, 'center'); txt('ROOM', tx + gw / 2, ty + 42, P.rose, 5, 'center');
          if (sel) { c.strokeStyle = P.roseSh; c.lineWidth = 2; c.strokeRect(tx - 1, ty - 1, gw + 2, tileH + 2); c.lineWidth = 1; }
          hit(tx, ty, gw, tileH, function () { m.cur = k; SS.startSaveRoom(G); });
          return;
        }
        R(tx, ty, gw, tileH, sel ? '#fde3ea' : P.cell); if (sel) { c.strokeStyle = P.rose; c.lineWidth = 2; c.strokeRect(tx, ty, gw, tileH); c.lineWidth = 1; }
        c.imageSmoothingEnabled = false; c.drawImage(SS.favPicture(it.fav, it.i, Math.round(gw - 6), 36), tx + 3, ty + 3);
        txt(it.fav.name.toUpperCase().slice(0, 22), tx + 3, ty + 43, P.ink, 4); txt(it.fav.pieces.length + ' PIECES', tx + 3, ty + 52, P.soft, 4);
        hit(tx, ty, gw, tileH, function () { m.cur = k; SS.pickFavorite(G, it.i); });
      });
      if (pages > 1) { SS.vt((m.page + 1) + ' / ' + pages, x + w - 10, y + h - 15, P.soft, 10, 'right'); }
    }
    SS.backHint(x + 8, y + h - 16); hit(x + 4, y + h - 18, 60, 16, function () { G.menu = { kind: 'start', cur: 3 }; });
    if (m.tab === 'rooms') txt('PICK, THEN TAP A ROOM', x + w - 8, y + h - 13, P.soft, 4, 'right');
  };
  SS.favPress = function (G, k) {
    var m = G.menu, items = SS.favorites().filter(function (f) { return f.kind === 'room'; }).length + 1;
    if (k === 'b' || k === 'start') { G.menu = { kind: 'start', cur: 3 }; return; }
    if (k === 'left' || k === 'right') { if (m.tab === 'outfits' && k === 'left') { m.tab = 'rooms'; return; } if (m.tab === 'rooms' && k === 'right' && m.cur % 2 === 1) { m.tab = 'outfits'; return; } m.cur = Math.max(0, Math.min(items - 1, m.cur + (k === 'left' ? -1 : 1))); }
    if (k === 'up') m.cur = Math.max(0, m.cur - 2); if (k === 'down') m.cur = Math.min(items - 1, m.cur + 2);
    var per = 2 * Math.max(1, Math.min(3, Math.floor((G.H - 130) / 68))); m.page = Math.floor(m.cur / per);
    if (k === 'a' && m.tab === 'rooms') { var list = SS.favorites().map(function (f, i) { return { f: f, i: i }; }).filter(function (o) { return o.f.kind === 'room'; }); if (m.cur >= list.length) SS.startSaveRoom(G); else SS.pickFavorite(G, list[m.cur].i); }
  };
  // picked: the menu closes, a banner shows it, and the room she taps fills (the one in the middle of the view glows)
  SS.pickFavorite = function (G, i) { G.menu = null; G.favUse = { i: i }; };
  SS.startSaveRoom = function (G) { G.menu = null; G.favUse = { save: true }; };
  SS.favCancel = function (G) { G.favUse = null; };
  SS.favTap = function (G, tl) {
    var U = G.favUse; if (!U) return false;
    if (U.save) {
      var fav = SS.saveRoom(G, G.floor, tl[0], tl[1]); if (!fav) return true;
      G.favUse = null;
      var nm = null; try { if (!navigator.webdriver) nm = window.prompt('Name this room', fav.name); } catch (e) {}
      var all = SS.favorites(); if (nm && nm.trim()) SS.renameFavorite(all.length - 1, nm.trim());
      G.toast('SAVED TO FAVORITES', 1800, (nm && nm.trim()) || fav.name);
      return true;
    }
    var f0 = SS.favorites()[U.i]; if (!f0) { G.favUse = null; return true; }
    var res = SS.applyFavorite(G, f0, G.floor, tl[0], tl[1]); if (!res) return true;
    G.favUse = null;
    G.toast(f0.name.toUpperCase(), 2200, res.placed + ' pieces placed' + (res.stored ? ', ' + res.stored + ' went to storage.' : '.'));
    return true;
  };
  SS.drawFavBanner = function (G, W, H, glowRoom) {
    var U = G.favUse, c = G.c; if (!U) return;
    var fav = U.save ? null : SS.favorites()[U.i], x = 6, y = 24, w = W - 36, h = 26;   // clear of the view controls on the right
    R(x + 2, y + 3, w, h, 'rgba(34,23,31,.35)'); R(x, y, w, h, P.tray); c.strokeStyle = P.rose; c.setLineDash([3, 2]); c.strokeRect(x + .5, y + .5, w - 1, h - 1); c.setLineDash([]);
    if (fav) { c.imageSmoothingEnabled = false; c.drawImage(SS.favPicture(fav, U.i, 36, 20), x + 3, y + 3); }
    else { R(x + 3, y + 3, 36, 20, P.cell); R(x + 19, y + 6, 3, 13, P.rose); R(x + 14, y + 11, 13, 3, P.rose); }
    txt(fav ? fav.name.toUpperCase().slice(0, 22) : 'SAVE THIS ROOM', x + 44, y + 5, P.ink, 4);
    txt(fav ? 'TAP A ROOM TO FILL IT' : 'TAP A ROOM TO SAVE IT', x + 44, y + 15, P.soft, 4);
    R(x + w - 46, y + 6, 40, 14, P.cell); txt('CANCEL', x + w - 26, y + 10, P.ink, 5, 'center');
    G.hits.push({ x: x + w - 48, y: y, w: 48, h: h, fn: function () { SS.favCancel(G); } });
    G.hits.push({ x: x, y: y, w: w - 48, h: h, fn: function () {} });
    if (fav) { var ny = G.viewBottom - 22; R(20, ny, W - 40, 16, 'rgba(255,246,234,.95)'); txt('PIECES THAT DON\'T FIT GO TO STORAGE', W / 2, ny + 5, P.ink, 4, 'center'); }
  };

  // ---------- the camera (camera-v1) ----------
  SS.openCamera = function (G) { G.menu = null; G.bubble = null; G.hold = null; G.camera = { shot: null }; };
  SS.cameraFrame = function (G, W, H) { var top = 40, bottom = H - 64; return { x: 8, y: top, w: W - 16, h: Math.max(60, bottom - top) }; };
  SS.drawCamera = function (G, W, H) {
    var c = G.c, C = G.camera, fr = SS.cameraFrame(G, W, H), hit = function (x, y, w, h, fn) { G.hits.push({ x: x, y: y, w: w, h: h, fn: fn }); };
    if (C.shot) return drawShot(G, W, H, C.shot);
    // everything outside the picture darkens; corner marks and a faint thirds grid show exactly what she'll get
    c.fillStyle = 'rgba(20,12,18,.78)'; c.fillRect(0, 0, W, fr.y); c.fillRect(0, fr.y + fr.h, W, H - fr.y - fr.h); c.fillRect(0, fr.y, fr.x, fr.h); c.fillRect(fr.x + fr.w, fr.y, W - fr.x - fr.w, fr.h);
    c.fillStyle = 'rgba(255,255,255,.12)'; [1, 2].forEach(function (k) { c.fillRect(fr.x + Math.round(fr.w * k / 3), fr.y, 1, fr.h); c.fillRect(fr.x, fr.y + Math.round(fr.h * k / 3), fr.w, 1); });
    c.fillStyle = '#fff'; [[fr.x, fr.y, 1, 1], [fr.x + fr.w, fr.y, -1, 1], [fr.x, fr.y + fr.h, 1, -1], [fr.x + fr.w, fr.y + fr.h, -1, -1]].forEach(function (q) { c.fillRect(q[0] - (q[2] < 0 ? 12 : 0), q[1] - (q[3] < 0 ? 2 : 0), 12, 2); c.fillRect(q[0] - (q[2] < 0 ? 2 : 0), q[1] - (q[3] < 0 ? 12 : 0), 2, 12); });
    // the close button and the title
    R(10, 14, 18, 18, '#fff1e2'); c.strokeStyle = P.ink; c.lineWidth = 2; c.beginPath(); c.moveTo(15, 19); c.lineTo(23, 27); c.moveTo(23, 19); c.lineTo(15, 27); c.stroke(); c.lineWidth = 1;
    hit(4, 8, 30, 30, function () { G.camera = null; });
    R(W / 2 - 34, 17, 11, 8, '#fff1e2'); R(W / 2 - 31, 15, 5, 2, '#fff1e2'); R(W / 2 - 30, 19, 3, 3, '#3b2430'); txt('CAMERA', W / 2 - 18, 18, '#fff1e2', 7);
    // the bottom row: hints, the heart shutter, the walls button
    var by = fr.y + fr.h + 14;
    SS.vt('Pinch to zoom', 12, by, 'rgba(255,241,226,.8)', 11); SS.vt('Slide to move', 12, by + 11, 'rgba(255,241,226,.8)', 11);
    c.fillStyle = '#fff'; c.beginPath(); c.arc(W / 2, by + 12, 17, 0, 7); c.fill(); c.fillStyle = P.rose; c.beginPath(); c.arc(W / 2, by + 12, 13, 0, 7); c.fill();
    var hx = W / 2 - 4, hy = by + 9; [[1, 0, 2, 1], [4, 0, 2, 1], [0, 1, 7, 2], [1, 3, 5, 1], [2, 4, 3, 1], [3, 5, 1, 1]].forEach(function (q) { R(hx + q[0], hy + q[1], q[2], q[3], '#fff'); });
    hit(W / 2 - 20, by - 8, 40, 40, function () { SS.snap(G); });
    R(W - 36, by, 22, 18, '#fff1e2'); R(W - 31, by + 4, 3, 10, P.ink); R(W - 27, by + 8, 9, 6, P.soft); txt('WALLS', W - 25, by + 21, 'rgba(255,241,226,.8)', 4, 'center');
    hit(W - 40, by - 4, 30, 30, function () { G.cycleWalls(); });
  };
  // the heart: a clean picture of what's in the frame, from the world itself (no tray, bar or buttons), saved through the share
  // sheet and filed small in the memory book's Photos
  SS.snap = function (G) {
    var fr = SS.cameraFrame(G, G.W0, G.H), src = G.cam.src(), kx = src[2] / G.W0, ky = src[3] / G.H;
    var sx = src[0] + fr.x * kx, sy = src[1] + fr.y * ky, sw = fr.w * kx, sh = fr.h * ky, up = Math.max(2, Math.round(4 / G.cam.zoom));
    var out = document.createElement('canvas'); out.width = Math.round(sw * up); out.height = Math.round(sh * up);
    var oc = out.getContext('2d'); oc.imageSmoothingEnabled = false; oc.fillStyle = '#22171f'; oc.fillRect(0, 0, out.width, out.height);
    oc.drawImage(G.worldCanvas, sx, sy, sw, sh, 0, 0, out.width, out.height);
    var small = document.createElement('canvas'), k = Math.min(1, 140 / out.width); small.width = Math.round(out.width * k); small.height = Math.round(out.height * k);
    var sc = small.getContext('2d'); sc.imageSmoothingEnabled = false; sc.drawImage(out, 0, 0, small.width, small.height);
    var d = SS.now(), shot = { img: out, small: small.toDataURL('image/png'), t0: performance.now(), date: d.getTime(), saved: null, name: G.W.home.name };
    G.camera.shot = shot;
    var file = (G.W.home.name || 'our-place').toLowerCase().replace(/[^a-z]+/g, '-') + '-' + d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2) + '.png';
    shot.file = file;
    var keepIt = function () { SS.addPhoto(G, shot); };
    if (SS.book().photos.length >= 60) G.confirm = { title: 'THE BOOK IS FULL', text: 'The memory book keeps 60 photos. Put this one in place of the oldest?', options: ['NOT THIS ONE', 'REPLACE'], cur: 0, pick: function (i) { if (i === 1) { SS.book().photos.shift(); keepIt(); } } };
    else keepIt();
    SS.sharePhoto(G, shot);
  };
  SS.sharePhoto = function (G, shot) {
    if (navigator.webdriver || !window.StudioBackup) { shot.saved = 'downloaded'; return; }   // the automated checks have no share sheet
    shot.img.toBlob(function (blob) { if (!blob) { shot.saved = 'cancelled'; return; } StudioBackup.saveFile(blob, shot.file).then(function (how) { shot.saved = how; }); }, 'image/png');
  };
  SS.addPhoto = function (G, shot) {
    var b = SS.book(); b.photos.push({ id: 'ph' + shot.date, data: shot.small, date: shot.date, ch: null }); SS.saveBookNow();
    SS.moment(G, 'photo');
  };
  function drawShot(G, W, H, S) {
    var c = G.c, age = Math.min(1, (performance.now() - S.t0) / 350), e = age * age * (3 - 2 * age), hit = function (x, y, w, h, fn) { G.hits.push({ x: x, y: y, w: w, h: h, fn: fn }); };
    R(0, 0, W, H, 'rgba(34,18,28,' + (.55 * e).toFixed(2) + ')'); hit(0, 0, W, H, function () {});
    // the print: dropped in, tilted a little, the home's name and the date under it
    var pw = W - 60, ph = Math.round(pw * S.img.height / S.img.width), maxH = H - 170; if (ph > maxH) { ph = maxH; pw = Math.round(ph * S.img.width / S.img.height); }
    var px = (W - pw) / 2, py = 40 + (1 - e) * -30;
    c.save(); c.translate(W / 2, py + ph / 2 + 16); c.rotate(-.03); c.translate(-W / 2, -(py + ph / 2 + 16));
    R(px - 6 + 3, py - 6 + 4, pw + 12, ph + 34, 'rgba(20,10,16,.4)'); R(px - 6, py - 6, pw + 12, ph + 34, '#fffaf0');
    c.imageSmoothingEnabled = false; c.drawImage(S.img, px, py, pw, ph);
    var d = new Date(S.date); txt((S.name || 'OUR PLACE').toUpperCase(), W / 2, py + ph + 5, P.ink, 6, 'center');
    SS.hand(c, ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()] + ' ' + d.getDate(), W / 2, py + ph + 24, 11, '#a98068', 'center');
    c.restore();
    // the note: saved to her photos and added to the memory book, with Share and Done
    var ny = Math.min(H - 70, py + ph + 40), nx = 26, nw = W - 52;
    R(nx + 2, ny + 3, nw, 52, 'rgba(34,23,31,.35)'); R(nx, ny, nw, 52, P.tray); c.strokeStyle = P.rose; c.setLineDash([3, 2]); c.strokeRect(nx + .5, ny + .5, nw - 1, 51); c.setLineDash([]);
    var ok = S.saved !== 'cancelled';
    SS.check(nx + 8, ny + 7, P.sage[1]); txt(ok ? 'SAVED TO YOUR PHOTOS' : 'NOT SAVED TO PHOTOS', nx + 22, ny + 8, P.ink, 5);
    SS.check(nx + 8, ny + 18, P.sage[1]); txt('ADDED TO THE MEMORY BOOK', nx + 22, ny + 19, P.ink, 5);
    var bw = (nw - 18) / 2;
    R(nx + 6, ny + 32, bw, 14, P.cell); txt('SHARE', nx + 6 + bw / 2, ny + 36, P.ink, 6, 'center'); hit(nx + 6, ny + 30, bw, 18, function () { SS.sharePhoto(G, S); });
    R(nx + 12 + bw, ny + 32, bw, 14, P.rose); R(nx + 12 + bw, ny + 45, bw, 1, P.roseSh); txt('DONE', nx + 12 + bw + bw / 2, ny + 36, '#fff', 6, 'center'); hit(nx + 12 + bw, ny + 30, bw, 18, function () { G.camera = null; });
  }
})();
