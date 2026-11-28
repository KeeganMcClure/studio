// Sarah's Sim: building (spec 004, parts A and B; bible, Building; mockups/build-v1).
//   Homes: each save keeps its own copy of a home's rooms and walls once she builds on it (save.homes[id].data, "lot form":
//   rooms as lists of lot tiles, plus single walls). The Philly home starts from home.js and is only copied when she first
//   changes it. Other homes are empty lots: small 16 x 16, medium 24 x 24 and large 32 x 32. The street's three empty lots are
//   one of each (spec 004, Claude default; the street map itself comes with spec 008, so until then they're listed in Homes),
//   and Sandbox's Homes list adds New lot.
//   The Build tab: 8 tools as icons (room, wall, door, window, floor, paper, stairs, erase), the picked one named with a hint,
//   and cards for it. Room: drag a box on the floor, with a size tag, to build four walls and a floor (2 x 2 at least, inside
//   the lot; against another room it shares the wall). Wall: drag a line along the tile edges; walls that close a space make
//   it a room. Tap a wall to pick it, then move it a tile at a time or erase it. Erase removes a wall or a floor tile.
//   Furniture that no longer fits goes to storage, never lost (pillar 3). Undo steps back through the last 10 changes.
//   Life prices (spec 004 part E; bible, Coins and prices): walls and floors 5 coins a tile, shown before she lets go; erasing
//   gives back what she paid. Sandbox is free.
//   Doors, windows, floors, papers and stairs are parts C and D (after Keegan's playtest of A and B).
(function () {
  var FH = SS.FH, P = SS.P;
  var LOTS = SS.LOTS = { 16: 'SMALL LOT', 24: 'MEDIUM LOT', 32: 'LARGE LOT' };
  SS.STREET = [{ id: 'lot-small', lot: 16 }, { id: 'lot-medium', lot: 24 }, { id: 'lot-large', lot: 32 }];
  var TILE_PRICE = 5;

  // ---------- homes in a save ----------
  function emptyLot(id, n) {
    return { id: id, name: 'NEW HOME', lot: n, lotName: LOTS[n], lotForm: true, at: [0, 0], floors: [{ rooms: [], walls: [], openings: [], windows: [] }], stairs: [], pieces: [] };
  }
  SS.emptyLot = emptyLot;
  // the prebuilt Philly home (house tiles, rooms as rectangles) as lot-form data she can change
  SS.toLotForm = function (home) {
    if (home.lotForm) return JSON.parse(JSON.stringify(home));
    var ax = home.at[0], ay = home.at[1], sh = function (o) { var q = o.slice(); q[0] += ax; q[1] += ay; return q; };
    return { id: home.id, name: home.name, lot: home.lot, lotName: home.lotName, lotForm: true, at: [0, 0],
      floors: home.floors.map(function (fl) {
        return {
          rooms: fl.rooms.map(function (r) {
            var t = []; for (var x = r.r[0]; x < r.r[2]; x++) for (var y = r.r[1]; y < r.r[3]; y++) t.push((x + ax) + ',' + (y + ay));
            var o = { id: r.id, name: r.name, t: t, floor: r.floor, paper: r.paper }; if (r.group) o.group = r.group; return o;
          }),
          walls: (fl.walls || []).map(sh), openings: fl.openings.map(sh), windows: fl.windows.map(sh)
        };
      }),
      stairs: home.stairs.map(function (s) { return { floor: s.floor, tiles: s.tiles.map(sh), from: sh(s.from), to: sh(s.to) }; }) };
  };
  SS.homeRec = function (S, id, make) {
    var H = S.homes || (S.homes = {});
    if (!H[id] && make) {
      var st = SS.STREET.filter(function (q) { return q.id === id; })[0];
      H[id] = id === 'philly' ? {} : { data: emptyLot(id, st ? st.lot : 16), pieces: [] };
    }
    return H[id] || null;
  };
  SS.homeData = function (S, id) {
    var rec = (S.homes || {})[id];
    if (rec && rec.data) return rec.data;
    if (id === 'philly') return SS.HOMES.philly;
    var st = SS.STREET.filter(function (q) { return q.id === id; })[0];
    return emptyLot(id, st ? st.lot : 16);
  };
  // the home she's in: its built data when it isn't the Philly home as first given (for pictures of it), and its looks
  SS.builtData = function (G) { if (G.gig) return null; var rec = (G.save.homes || {})[G.save.home]; return rec && rec.data ? rec.data : null; };
  SS.curLooks = function (G, make) {
    if (G.save.home === 'philly' || G.gig) return make ? (G.save.roomLook || (G.save.roomLook = {})) : (G.save.roomLook || null);
    var rec = SS.homeRec(G.save, G.save.home, true); return make ? (rec.roomLook || (rec.roomLook = {})) : (rec.roomLook || null);
  };
  // every home in this save for the Homes list: the Philly home, the street's three lots, and Sandbox's own new lots
  SS.homeList = function (G) {
    var S = G.save, out = [{ id: 'philly' }].concat(SS.STREET.map(function (q) { return { id: q.id }; }));
    Object.keys(S.homes || {}).forEach(function (id) { if (/^new-/.test(id)) out.push({ id: id }); });
    return out.map(function (h) { var d = SS.homeData(S, h.id); h.name = d.name; h.lot = d.lot; h.lotName = d.lotName; h.street = /^lot-/.test(h.id); h.rooms = d.floors.reduce(function (n, fl) { return n + fl.rooms.length; }, 0); return h; });
  };
  // a new lot in Sandbox (spec 004, part A, Claude default: not on the street)
  SS.newLot = function (G, n) {
    var S = G.save, k = 1; while ((S.homes || {})['new-' + k]) k++;
    var id = 'new-' + k; SS.homeRec(S, id, true); S.homes[id].data = emptyLot(id, n); S.homes[id].pieces = [];
    SS.goHome(G, id); SS.enterBuild(G);
    G.toast('A NEW ' + LOTS[n], 1800, n + ' by ' + n + ' tiles. Drag a box to make a room.');
  };

  // going to another home: her own home (and everyone in it) waits as it was, like a gig (gig.js)
  SS.goHome = function (G, id) {
    var S = G.save; if (G.gig || id === S.home) return;
    G.hold = null; G.sel = null; G.paint = null; G.bubble = null; G.meters = null; G.build.wall = null; G.build.drag = null;
    G.changed(true);
    var keep = { floor: G.floor, view: SS.view.k, undo: G.undo, cam: { x: G.cam.x, y: G.cam.y, zoom: G.cam.zoom }, walls: G.walls };
    if (S.home === 'philly') { keep.W = G.W; keep.agents = G.agents; G.away = keep; }
    else { var r0 = SS.homeRec(S, S.home, true); r0.view = SS.view.k; }
    S.home = id;
    if (id === 'philly') {
      var h = G.away; G.away = null;
      G.W = h.W; G.agents = h.agents; G.floor = h.floor; SS.view.k = h.view; G.undo = h.undo; G.walls = h.walls;
      SS.view.L = G.W.lot; SS.setLot(G.W.lot); G.cam.x = h.cam.x; G.cam.y = h.cam.y; G.cam.zoom = h.cam.zoom;
      // a change built on the Philly home from another lot never happens, so its world is as she left it
    } else {
      if (G.mode === 'life' && SS.stopActions && G.away && G.away.W) SS.stopActions(G);
      var rec = SS.homeRec(S, id, true);
      G.W = SS.World(rec.data, rec.pieces || [], rec.roomLook); G.agents = []; G.floor = 0; SS.view.k = (rec.view || 0) % 4;
      G.undo = []; G.walls = 'cut'; G.tray.open = true;
      SS.view.L = G.W.lot; SS.setLot(G.W.lot); G.centerCam(true);
    }
    G.changed(true);
  };
  SS.awayHome = function (G) { return !!G.away; };

  // ---------- the rules, on lot-form data ----------
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function world(D) { return SS.World(D, []); }
  function edgeKey(x, y, axis) { return x + ',' + y + axis; }
  function newRoomId(D) { var ids = {}; D.floors.forEach(function (fl) { fl.rooms.forEach(function (r) { ids[r.id] = 1; }); }); var k = (D.nextRoom || 0) + 1; while (ids['r' + k]) k++; D.nextRoom = k; return 'r' + k; }
  function roomOf(fl, k) { for (var i = 0; i < fl.rooms.length; i++) if (fl.rooms[i].t.indexOf(k) >= 0) return fl.rooms[i]; return null; }
  function takeTile(fl, k) { var r = roomOf(fl, k); if (r) r.t.splice(r.t.indexOf(k), 1); return r; }
  function floorAt(D, f) { while (D.floors.length <= f) D.floors.push({ rooms: [], walls: [], openings: [], windows: [] }); return D.floors[f]; }
  // the two tiles on either side of a wall edge: [x, y] on its - side and its + side
  function sides(x, y, axis) { return axis === 'x' ? [[x, y - 1], [x, y]] : [[x - 1, y], [x, y]]; }
  function onEdge(o, k) { // does an opening or window entry cover this edge?
    var n = o.length > 3 && typeof o[3] === 'number' ? o[3] : 1;
    for (var i = 0; i < n; i++) if (edgeKey(o[2] === 'x' ? o[0] + i : o[0], o[2] === 'y' ? o[1] + i : o[1], o[2]) === k) return true;
    return false;
  }
  // tidy a floor after a change: rooms cut in two become two rooms, spaces closed in by walls become rooms with their own floor,
  // and single walls, doorways and windows that no longer sit on a wall are dropped
  function resolve(D, f) {
    var fl = D.floors[f]; if (!fl) return;
    fl.rooms = fl.rooms.filter(function (r) { return r.t.length; });
    var W = world(D), n = D.lot, D4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    var blocked = function (x, y, nx, ny) { var s = nx !== x ? W.seg(f, Math.max(x, nx), y, 'y') : W.seg(f, x, Math.max(y, ny), 'x'); return !!s; };
    // 1. a room split by walls: the biggest part keeps the room, the rest become new rooms
    fl.rooms.slice().forEach(function (r) {
      var left = {}; r.t.forEach(function (k) { left[k] = 1; });
      var parts = [];
      r.t.forEach(function (k0) {
        if (!left[k0]) return; var part = [], q = [k0]; delete left[k0];
        while (q.length) { var k = q.pop(); part.push(k); var p = k.split(',').map(Number); D4.forEach(function (d) { var nk = (p[0] + d[0]) + ',' + (p[1] + d[1]); if (left[nk] && !blocked(p[0], p[1], p[0] + d[0], p[1] + d[1])) { delete left[nk]; q.push(nk); } }); }
        parts.push(part);
      });
      if (parts.length < 2) return;
      parts.sort(function (a, b) { return b.length - a.length; });
      r.t = parts[0];
      parts.slice(1).forEach(function (part) { var o = { id: newRoomId(D), name: 'Room', t: part, floor: r.floor, paper: r.paper }; fl.rooms.push(o); });
    });
    // 2. outside tiles walled in on every side become a room
    W = world(D);
    var seen = {}, isRoom = function (x, y) { return !!W.room(f, x, y); };
    var q2 = [];
    for (var i = 0; i < n; i++) [[i, 0], [i, n - 1], [0, i], [n - 1, i]].forEach(function (p) { var k = p[0] + ',' + p[1]; if (!isRoom(p[0], p[1]) && !seen[k]) { seen[k] = 1; q2.push(p); } });
    while (q2.length) { var p2 = q2.pop(); D4.forEach(function (d) { var x = p2[0] + d[0], y = p2[1] + d[1], k = x + ',' + y; if (x < 0 || y < 0 || x >= n || y >= n || seen[k] || isRoom(x, y) || blocked(p2[0], p2[1], x, y)) return; seen[k] = 1; q2.push([x, y]); }); }
    var shut = {}; for (var x = 0; x < n; x++) for (var y = 0; y < n; y++) { var k3 = x + ',' + y; if (!seen[k3] && !isRoom(x, y)) shut[k3] = 1; }
    Object.keys(shut).forEach(function (k0) {
      if (!shut[k0]) return; var part = [], q = [k0]; delete shut[k0];
      while (q.length) { var k = q.pop(); part.push(k); var p = k.split(',').map(Number); D4.forEach(function (d) { var nk = (p[0] + d[0]) + ',' + (p[1] + d[1]); if (shut[nk] && !blocked(p[0], p[1], p[0] + d[0], p[1] + d[1])) { delete shut[nk]; q.push(nk); } }); }
      // on an upper floor, only over rooms below (spec 004, part D, Claude default)
      if (f > 0 && part.some(function (k) { var p = k.split(','); return !W.room(f - 1, +p[0], +p[1]); })) return;
      fl.rooms.push({ id: newRoomId(D), name: 'Room', t: part, floor: 'planks', paper: G0().build.paper || 'cream' });
    });
    // 3. single walls that now sit on a room's edge anyway, and doorways and windows with no wall left under them
    W = world(D);
    var raw = function (x, y, axis) {
      var sd = sides(x, y, axis), a = W.room(f, sd[0][0], sd[0][1]), b = W.room(f, sd[1][0], sd[1][1]);
      return a !== b && !!(a || b) && !(a && b && a.group && a.group === b.group);
    };
    fl.walls = (fl.walls || []).filter(function (w) { return !raw(w[0], w[1], w[2]) && w[0] >= 0 && w[1] >= 0 && w[0] <= n && w[1] <= n; });
    var single = {}; fl.walls.forEach(function (w) { single[edgeKey(w[0], w[1], w[2])] = 1; });
    var hasWall = function (k, x, y, axis) { return single[k] || raw(x, y, axis); };
    fl.openings = fl.openings.filter(function (o) { return hasWall(edgeKey(o[0], o[1], o[2]), o[0], o[1], o[2]); });
    fl.windows = fl.windows.filter(function (o) { for (var i = 0; i < o[3]; i++) { var x = o[2] === 'x' ? o[0] + i : o[0], y = o[2] === 'y' ? o[1] + i : o[1]; if (!hasWall(edgeKey(x, y, o[2]), x, y, o[2])) return false; } return true; });
    // empty floors at the top go
    while (D.floors.length > 1) { var top = D.floors[D.floors.length - 1]; if (top.rooms.length || (top.walls || []).length) break; D.floors.pop(); }
  }
  function G0() { return SS.G; }
  // is the home still sound? Rooms above stand on rooms below; stairs stand on floor and land on floor
  function sound(D) {
    var W = world(D);
    for (var f = 1; f < D.floors.length; f++) for (var k in W.rooms[f]) { var p = k.split(','); if (!W.room(f - 1, +p[0], +p[1])) return 'A ROOM ABOVE NEEDS ONE UNDER IT'; }
    for (var i = 0; i < W.stairs.length; i++) { var s = W.stairs[i]; if (!s.tiles.every(function (q) { return W.room(s.floor, q[0], q[1]); }) || !W.room(s.floor, s.from[0], s.from[1]) || !W.room(s.floor + 1, s.to[0], s.to[1])) return 'KEEP THE STAIRS STANDING'; }
    return null;
  }
  // what a home's walls and floors are worth at 5 coins a tile (Life prices)
  function worth(D) { var W = world(D), n = 0; W.walls.forEach(function (segs) { n += segs.length; }); W.rooms.forEach(function (g) { n += Object.keys(g).length; }); return n * TILE_PRICE; }

  // the edits; each returns {D} or {why}
  function roomEdit(D0, f, x0, y0, x1, y1, paper) {
    var n = D0.lot;
    if (x1 - x0 < 2 || y1 - y0 < 2) return { why: '2 × 2 IS THE SMALLEST ROOM' };
    if (x0 < 0 || y0 < 0 || x1 > n || y1 > n) return { why: 'INSIDE THE LOT' };
    var D = clone(D0), fl = floorAt(D, f), W0 = world(D0);
    if (f > 0) for (var x = x0; x < x1; x++) for (var y = y0; y < y1; y++) if (!W0.room(f - 1, x, y)) return { why: 'IT NEEDS A ROOM UNDER IT' };
    var t = [];
    for (var x2 = x0; x2 < x1; x2++) for (var y2 = y0; y2 < y1; y2++) { var k = x2 + ',' + y2; takeTile(fl, k); t.push(k); }
    var inner = function (x, y, axis) { return axis === 'x' ? x >= x0 && x < x1 && y > y0 && y < y1 : y >= y0 && y < y1 && x > x0 && x < x1; };
    var border = function (x, y, axis) { return axis === 'x' ? x >= x0 && x < x1 && (y === y0 || y === y1) : y >= y0 && y < y1 && (x === x0 || x === x1); };
    fl.walls = (fl.walls || []).filter(function (w) { return !inner(w[0], w[1], w[2]); });
    fl.openings = fl.openings.filter(function (o) { return !inner(o[0], o[1], o[2]) && !(o[3] === 'open' && border(o[0], o[1], o[2])); });
    fl.windows = fl.windows.filter(function (o) { for (var i = 0; i < o[3]; i++) if (inner(o[2] === 'x' ? o[0] + i : o[0], o[2] === 'y' ? o[1] + i : o[1], o[2])) return false; return true; });
    fl.rooms.push({ id: newRoomId(D), name: 'Room', t: t, floor: 'planks', paper: paper || 'cream' });
    resolve(D, f);
    var why = sound(D); return why ? { why: why } : { D: D };
  }
  function wallEdit(D0, f, axis, at, a0, a1) {
    var n = D0.lot; if (a1 <= a0) return { why: 'DRAG ALONG THE TILE EDGES' };
    if (at < 0 || at > n || a0 < 0 || a1 > n) return { why: 'INSIDE THE LOT' };
    var D = clone(D0), fl = floorAt(D, f), W0 = world(D0), added = 0;
    fl.walls = fl.walls || [];
    for (var u = a0; u < a1; u++) {
      var x = axis === 'x' ? u : at, y = axis === 'x' ? at : u, k = edgeKey(x, y, axis), n0 = fl.openings.length;
      fl.openings = fl.openings.filter(function (o) { return !(o[3] === 'open' && edgeKey(o[0], o[1], o[2]) === k); });
      if (fl.openings.length < n0) added++;
      if (W0.seg(f, x, y, axis)) continue;
      fl.walls.push([x, y, axis]); added++;
    }
    if (!added) return { why: 'THERE\'S A WALL THERE ALREADY' };
    resolve(D, f);
    var why = sound(D); return why ? { why: why } : { D: D };
  }
  // a wall run: a straight stretch of wall between corners and joins (what a tap picks)
  SS.wallRun = function (W, f, s) {
    var out = [s], ax = s.axis;
    var joint = function (x, y) { return ax === 'x' ? !!(W.seg(f, x, y - 1, 'y') || W.seg(f, x, y, 'y')) : !!(W.seg(f, x - 1, y, 'x') || W.seg(f, x, y, 'x')); };
    for (var d = -1; d <= 1; d += 2) {
      var cur = s;
      for (;;) {
        var nx = ax === 'x' ? cur.x + d : cur.x, ny = ax === 'y' ? cur.y + d : cur.y;
        var jx = ax === 'x' ? (d > 0 ? cur.x + 1 : cur.x) : cur.x, jy = ax === 'y' ? (d > 0 ? cur.y + 1 : cur.y) : cur.y;
        var nxt = W.seg(f, nx, ny, ax); if (!nxt || joint(jx, jy)) break;
        if (d < 0) out.unshift(nxt); else out.push(nxt); cur = nxt;
      }
    }
    return out;
  };
  function eraseRun(D0, f, run) {
    var D = clone(D0), fl = D.floors[f];
    run.forEach(function (s) {
      var k = edgeKey(s.x, s.y, s.axis), sd = sides(s.x, s.y, s.axis);
      fl.walls = (fl.walls || []).filter(function (w) { return edgeKey(w[0], w[1], w[2]) !== k; });
      fl.openings = fl.openings.filter(function (o) { return edgeKey(o[0], o[1], o[2]) !== k; });
      fl.windows = fl.windows.filter(function (o) { return !onEdge(o, k); });
      if (s.single) return;
      var a = roomOf(fl, sd[0][0] + ',' + sd[0][1]), b = roomOf(fl, sd[1][0] + ',' + sd[1][1]);
      if (a && b && a !== b) { // two rooms open up into one: the bigger one keeps its name, floor and paper
        var big = a.t.length >= b.t.length ? a : b, small = big === a ? b : a;
        big.t = big.t.concat(small.t); fl.rooms.splice(fl.rooms.indexOf(small), 1);
      } else if (a || b) fl.openings.push([s.x, s.y, s.axis, 'open']);   // an outside wall erased: the room stays, open on that side
    });
    resolve(D, f);
    var why = sound(D); return why ? { why: why } : { D: D };
  }
  function moveRun(D0, f, run, dir) {
    var D = clone(D0), fl = D.floors[f], n = D.lot, ax = run[0].axis;
    var at = (ax === 'x' ? run[0].y : run[0].x) + dir; if (at < 0 || at > n) return { why: 'INSIDE THE LOT' };
    var W0 = world(D0), keys = {};
    run.forEach(function (s) { keys[edgeKey(s.x, s.y, s.axis)] = 1; });
    // the row of tiles the wall passes over changes sides: it joins the room the wall is moving away from
    var moves = [];
    run.forEach(function (s) {
      var sd = sides(s.x, s.y, s.axis), from = dir > 0 ? sd[0] : sd[1], over = dir > 0 ? sd[1] : sd[0];
      if (over[0] < 0 || over[1] < 0 || over[0] >= n || over[1] >= n) return;
      moves.push({ k: over[0] + ',' + over[1], to: W0.room(f, from[0], from[1]) });
    });
    moves.forEach(function (m) {
      takeTile(fl, m.k);
      if (m.to) { var r = fl.rooms.filter(function (q) { return q.id === m.to.id; })[0]; if (r) r.t.push(m.k); }
    });
    var shift = function (o) { if (ax === 'x') o[1] += dir; else o[0] += dir; };
    (fl.walls || []).forEach(function (w) { if (keys[edgeKey(w[0], w[1], w[2])]) shift(w); });
    fl.openings.forEach(function (o) { if (keys[edgeKey(o[0], o[1], o[2])]) shift(o); });
    fl.windows.forEach(function (o) { if (o[2] === ax && keys[edgeKey(o[0], o[1], o[2])]) shift(o); });
    resolve(D, f);
    var why = sound(D); return why ? { why: why } : { D: D };
  }
  function eraseTile(D0, f, x, y) {
    var D = clone(D0), fl = D.floors[f], k = x + ',' + y;
    if (!fl || !roomOf(fl, k)) return { why: 'NOTHING TO ERASE THERE' };
    var W0 = world(D0); if (W0.stairAt(f, x, y) || W0.wellAt(f, x, y)) return { why: 'STAIRS COME WITH THE STAIRS TOOL' };
    takeTile(fl, k);
    resolve(D, f);
    if (roomOf(D.floors[f] || { rooms: [] }, k)) return { why: 'TAKE TILES FROM A ROOM\'S EDGE' };   // a hole in the middle closes up again
    var why = sound(D); return why ? { why: why } : { D: D };
  }

  // ---------- applying a change ----------
  var STRUCT = { OUTSIDE: 1, WALL: 1, 'NEEDS A WALL': 1, 'NEEDS A WINDOW': 1, STAIRS: 1, 'NO SPOT': 1 };
  function candOf(p) { return p.wall ? { id: p.id, f: p.f, wall: p.wall, side: p.side } : { id: p.id, f: p.f, x: p.x, y: p.y, r: p.r || 0 }; }
  function stash(G, W, p, out) { W.stacked(p).forEach(function (q) { stash(G, W, q, out); }); out.push({ id: p.id, sw: p.sw || 0, colors: p.colors, pats: p.pats, props: p.props, paid: p.paid }); }
  // the new data becomes the home: the world is rebuilt, pieces that no longer fit go to storage, everyone stands somewhere
  // they can, and Life pays or refunds the difference
  function commit(G, D, label) {
    var S = G.save, rec = SS.homeRec(S, S.home, true), before = SS.homeData(S, S.home);
    var cost = G.mode === 'life' ? worth(D) - worth(before) : 0, spent = (before.spent || 0);
    if (cost > 0 && (S.coins || 0) < cost) { G.toast('NOT ENOUGH COINS', 2000, 'That\'s ' + cost + ' coins and you have ' + (S.coins || 0) + '. Gigs at the desk pay 100 to 200.'); return false; }
    G.snapshot();
    var refund = cost < 0 ? Math.min(-cost, spent) : 0;
    D.spent = Math.max(0, spent + (cost > 0 ? cost : -refund));
    if (cost > 0) S.coins -= cost; if (refund) S.coins += refund;
    rec.data = D;
    var old = G.W.pieces.map(function (p) { var q = {}; for (var k in p) if (k !== 'work') q[k] = p[k]; return clone(q); });
    G.W = SS.World(D, old, SS.curLooks(G));
    var W = G.W, gone = [], again = true;
    while (again) {
      again = false;
      W.pieces.slice().forEach(function (p) { if (p.host || !W.byUid[p.uid]) return; var r = W.check(candOf(p), p); if (!r.ok && STRUCT[r.why]) { stash(G, W, p, gone); W.remove(p); again = true; } });
    }
    gone.forEach(function (q) { S.stored.push(q); });
    settle(G);
    G.build.wall = null; G.sel = null;
    G.changed(true);
    if (G.floor >= W.floors && G.floor > 0 && !G.build.on) G.setFloor(W.floors - 1);
    var line = [];
    if (cost > 0) line.push('-' + cost + ' coins'); if (refund) line.push('+' + refund + ' coins back');
    if (gone.length) line.push(gone.length + (gone.length === 1 ? ' piece went' : ' pieces went') + ' to storage');
    if (label || line.length) G.toast(label || 'DONE', 1300, line.join(' · '));
    if (S.home !== 'philly' && SS.moment && (before.floors.every(function (fl) { return !fl.rooms.length && !(fl.walls || []).length; }))) SS.moment(G, 'first-wall');
    return true;
  }
  SS.buildCommit = commit;
  SS._build = { roomEdit: roomEdit, wallEdit: wallEdit, eraseRun: eraseRun, moveRun: moveRun, eraseTile: eraseTile, resolve: resolve, worth: worth };   // for the checks
  // after the walls change: anyone on a seat that went to storage gets up, and anyone standing where they can't steps aside
  function settle(G) {
    var W = G.W;
    (G.agents || []).forEach(function (a) {
      if (a.on && !W.byUid[a.on] && SS.agentGetUp) SS.agentGetUp(G, a);
      a.path = []; a.arrive = null;
      var tx = Math.floor(a.x), ty = Math.floor(a.y);
      if (!W.walkable(a.f, tx, ty)) {
        var q = StudioMove.nearestOpen(tx, ty, W.lot, W.lot, function (x, y) { return W.walkable(a.f, x, y); });
        if (q) { a.x = q[0] + .5; a.y = q[1] + .5; }
      }
    });
    if (G.mode === 'life' && G.people && SS.stopActions && !G.away) SS.stopActions(G);
  }

  // ---------- the Build tab ----------
  var TOOLS = SS.BUILD_TOOLS = ['room', 'wall', 'door', 'window', 'floor', 'paper', 'stairs', 'erase'];
  var NAMES = { room: 'ROOM', wall: 'WALL', door: 'DOOR', window: 'WINDOW', floor: 'FLOOR', paper: 'PAPER', stairs: 'STAIRS', erase: 'ERASE' };
  var HINTS = { room: 'DRAG A BOX · PICK A WALL STYLE', wall: 'DRAG ALONG THE EDGES · TAP A WALL', erase: 'TAP A WALL OR A FLOOR TILE' };
  var LATER = { door: 1, window: 1, floor: 1, paper: 1, stairs: 1 };
  SS.TRAY_H.build = 92;
  SS.enterBuild = function (G) {
    if (G.gig) { G.toast('GIGS ARE FOR DECORATING', 1600, 'Their walls stay as they are.'); return; }
    if (G.hold && G.cancelHold) G.cancelHold(false);
    G.deselect(); G.bubble = null; G.meters = null; G.focus = null;
    G.build.on = true; G.build.wall = null; G.build.drag = null; G.tray.open = true; G.walls = 'cut';   // walls cut away while building (Claude default)
  };
  SS.leaveBuild = function (G) {
    G.build.on = false; G.build.wall = null; G.build.drag = null; G.tray.open = true;
    if (G.floor >= G.W.floors) G.setFloor(G.W.floors - 1);
  };
  SS.pickTool = function (G, t) {
    G.build.tool = t; G.build.wall = null; G.build.drag = null;
    if (LATER[t]) G.toast(NAMES[t] + ' COMES NEXT', 1700, t === 'stairs' ? 'Stairs and upper floors come in the next build part.' : 'Doors, windows, floors and papers come in the next build part.');
  };
  function toolIcon(i, x, y, on) {
    var R = SS.R, k = on ? '#fff' : P.ink, k2 = on ? '#ffd9e2' : P.soft;   // mockups/build-v1
    [function () { R(x, y + 2, 12, 8, k); R(x + 1, y + 3, 10, 6, k2); },
      function () { R(x, y + 4, 12, 3, k); R(x + 1, y + 5, 10, 1, k2); },
      function () { R(x + 3, y, 7, 11, k); R(x + 4, y + 1, 5, 10, k2); R(x + 7, y + 6, 1, 1, k); },
      function () { R(x + 1, y + 1, 10, 9, k); R(x + 2, y + 2, 8, 7, '#a9c9e8'); R(x + 6, y + 2, 1, 7, k); R(x + 2, y + 5, 8, 1, k); },
      function () { for (var a = 0; a < 3; a++) for (var b = 0; b < 3; b++) R(x + a * 4, y + 1 + b * 3, 3, 2, (a + b) % 2 ? k : k2); },
      function () { R(x + 1, y + 1, 10, 9, k2); for (var s = 1; s < 10; s += 3) R(x + s, y + 1, 1, 9, k); },
      function () { for (var s = 0; s < 4; s++) R(x + s * 3, y + 8 - s * 2, 12 - s * 3, 2, k); },
      function () { R(x + 2, y + 3, 8, 6, k); R(x + 4, y + 1, 4, 2, k); R(x + 3, y + 4, 6, 4, k2); }
    ][i]();
  }
  // a wall style card: a little stretch of the paper, as in build-v1's swatches
  function paperCard(c, key, x, y, w, on) {
    var R = SS.R, pp = SS.PAPERS[key];
    R(x, y, w, 24, on ? '#fde3ea' : P.cell); R(x, y + 23, w, 1, P.trayEdge);
    var fx = x + 6, fy = y + 4, fw = w - 12, fh = 15;
    R(fx - 1, fy - 1, fw + 2, fh + 2, '#3b2430');
    if (pp.texture) { var tex = SS.paperTexture(pp.texture, 64, SS.WALL_UP); c.drawImage(tex, 0, SS.WALL_UP - 40, fw, 40, fx, fy, fw, fh); }
    else { R(fx, fy, fw, fh, pp.base); for (var s = 2; s < fw; s += 5) R(fx + s, fy, 2, fh - 4, pp.stripe); R(fx, fy + fh - 4, fw, 4, pp.low); R(fx, fy + fh - 5, fw, 1, '#fff1e2'); }
    if (on) { c.strokeStyle = P.rose; c.lineWidth = 2; c.strokeRect(x + 1, y + 1, w - 2, 22); c.lineWidth = 1; }
  }
  var PAPER_KEYS = ['rose', 'sage', 'cream', 'honey', 'blue', 'lilac', 'nina'];
  SS.drawBuildTray = function (G, W, H, y, modeTabs) {
    var c = G.c, R = SS.R, txt = SS.txt, B = G.build, hit = SS.hit;
    modeTabs(G, y, G.W.lot + ' × ' + G.W.lot);
    TOOLS.forEach(function (t, i) {
      var tx = 4 + i * 29.2, on = t === B.tool;
      R(tx, y + 20, 27, 18, on ? P.rose : (LATER[t] ? '#f3e7da' : '#fbeedd')); R(tx, y + 37, 27, 1, on ? P.roseSh : P.trayEdge);
      c.globalAlpha = LATER[t] && !on ? .55 : 1; toolIcon(i, tx + 8, y + 23, on); c.globalAlpha = 1;
      hit(G, tx - 1, y + 18, 29, 22, function () { SS.pickTool(G, t); });
    });
    txt(NAMES[B.tool], 6, y + 43, P.ink, 6);
    var hint = LATER[B.tool] ? 'COMES IN THE NEXT PART' : B.wall ? 'MOVE IT OR ERASE IT' : HINTS[B.tool];
    txt(hint, W - 6, y + 43, P.soft, 5, 'right');
    var cy = y + 53;
    if (B.tool === 'room' || B.tool === 'wall') {
      var cw = (W - 8) / PAPER_KEYS.length;
      PAPER_KEYS.forEach(function (k, i) { var cx = 4 + i * cw; paperCard(c, k, cx + 1, cy, cw - 2, B.paper === k); hit(G, cx, cy - 2, cw, 28, function () { B.paper = k; G.toast((SS.PAPERS[k].name || k.toUpperCase() + ' STRIPE').toUpperCase(), 800, 'New rooms get this wall style.'); }); });
    } else if (B.tool === 'erase') {
      SS.vt('Tap a wall to erase it, or a floor tile to take it out.', 8, cy + 2, P.ink, 12);
      SS.vt(G.mode === 'life' ? 'You get back the coins you paid.' : 'Furniture that no longer fits goes to storage.', 8, cy + 14, P.soft, 12);
    } else {
      SS.vt(B.tool === 'stairs' ? 'Upper floors and the four kinds of stairs' : 'Doors, windows, floors and wallpapers', 8, cy + 2, P.ink, 12);
      SS.vt('come in the next build part, after you play this one.', 8, cy + 14, P.soft, 12);
    }
  };

  // ---------- drags and taps on the home ----------
  // corner nearest a world point (for walls) and the tile under it (for rooms), in lot tiles
  SS.buildDragStart = function (G, tl) {
    var B = G.build; if (B.tool !== 'room' && B.tool !== 'wall') return false;
    B.wall = null;
    B.drag = { tool: B.tool, f: G.floor, a: [tl[0], tl[1]], b: [tl[0], tl[1]], ca: [Math.round(tl[2]), Math.round(tl[3])], cb: [Math.round(tl[2]), Math.round(tl[3])] };
    preview(G); return true;
  };
  SS.buildDrag = function (G, tl) { var d = G.build.drag; if (!d) return; d.b = [tl[0], tl[1]]; d.cb = [Math.round(tl[2]), Math.round(tl[3])]; preview(G); };
  function shape(d) {
    if (d.tool === 'room') return { x0: Math.min(d.a[0], d.b[0]), y0: Math.min(d.a[1], d.b[1]), x1: Math.max(d.a[0], d.b[0]) + 1, y1: Math.max(d.a[1], d.b[1]) + 1 };
    var dx = Math.abs(d.cb[0] - d.ca[0]), dy = Math.abs(d.cb[1] - d.ca[1]);
    return dx >= dy ? { axis: 'x', at: d.ca[1], a0: Math.min(d.ca[0], d.cb[0]), a1: Math.max(d.ca[0], d.cb[0]) } : { axis: 'y', at: d.ca[0], a0: Math.min(d.ca[1], d.cb[1]), a1: Math.max(d.ca[1], d.cb[1]) };
  }
  function tryShape(G, d) {
    var D0 = SS.toLotForm(SS.homeData(G.save, G.save.home)), s = shape(d);
    return d.tool === 'room' ? roomEdit(D0, d.f, s.x0, s.y0, s.x1, s.y1, G.build.paper) : wallEdit(D0, d.f, s.axis, s.at, s.a0, s.a1);
  }
  function preview(G) {
    var d = G.build.drag, r = tryShape(G, d), s = shape(d);
    d.ok = !!r.D; d.why = r.why; d.shape = s;
    d.cost = r.D && G.mode === 'life' ? Math.max(0, worth(r.D) - worth(SS.homeData(G.save, G.save.home))) : 0;
    d.tag = d.tool === 'room' ? (s.x1 - s.x0) + ' × ' + (s.y1 - s.y0) : String(s.a1 - s.a0);
  }
  SS.buildDragEnd = function (G) {
    var d = G.build.drag; if (!d) return; G.build.drag = null;
    var r = tryShape(G, d);
    if (!r.D) { G.toast(r.why || 'NOT THERE', 1300); return; }
    commit(G, r.D, d.tool === 'room' ? 'ROOM BUILT' : 'WALL BUILT');
  };
  SS.buildCancel = function (G) { G.build.drag = null; };
  // which wall is under a world point on this floor (by the middle of each wall as it stands in the view)
  SS.wallAt = function (G, w) {
    var W = G.W, f = G.floor, best = null;
    (W.walls[f] || []).forEach(function (s) {
      var vs = SS.vseg(s), h = G.walls === 'up' ? SS.WALL_UP : G.walls === 'cut' ? (vs.back ? SS.WALL_UP : 8) : 4;
      var a = SS.vp(s.x, s.y, f * FH + h / 2), b = SS.vp(s.axis === 'x' ? s.x + 1 : s.x, s.axis === 'y' ? s.y + 1 : s.y, f * FH + h / 2);
      var vx = b[0] - a[0], vy = b[1] - a[1], L = vx * vx + vy * vy, k = Math.max(0, Math.min(1, ((w[0] - a[0]) * vx + (w[1] - a[1]) * vy) / L));
      var dd = Math.hypot(a[0] + vx * k - w[0], a[1] + vy * k - w[1]);
      if (dd < Math.max(5, h / 2 + 2) && (!best || dd < best.d)) best = { d: dd, s: s };
    });
    return best ? best.s : null;
  };
  SS.buildTap = function (G, w, tl) {
    var B = G.build, W = G.W, s = SS.wallAt(G, w);
    if (B.tool === 'erase') {
      if (s) { var r = eraseRun(SS.toLotForm(SS.homeData(G.save, G.save.home)), G.floor, SS.wallRun(W, G.floor, s)); if (r.D) commit(G, r.D, 'WALL ERASED'); else G.toast(r.why, 1400); return; }
      var r2 = eraseTile(SS.toLotForm(SS.homeData(G.save, G.save.home)), G.floor, tl[0], tl[1]);
      if (r2.D) commit(G, r2.D, 'FLOOR TILE ERASED'); else G.toast(r2.why, 1200);
      return;
    }
    if (s && (B.tool === 'room' || B.tool === 'wall')) { B.wall = { f: G.floor, run: SS.wallRun(W, G.floor, s).map(function (q) { return [q.x, q.y, q.axis]; }) }; return; }
    B.wall = null;
  };
  function pickedRun(G) { var B = G.build, W = G.W; if (!B.wall || B.wall.f !== G.floor) return null; var run = B.wall.run.map(function (q) { return W.seg(B.wall.f, q[0], q[1], q[2]); }); return run.every(Boolean) ? run : null; }
  SS.pickedRun = pickedRun;
  SS.moveWall = function (G, dir) {
    var run = pickedRun(G); if (!run) return;
    var r = moveRun(SS.toLotForm(SS.homeData(G.save, G.save.home)), G.floor, run, dir);
    if (!r.D) { G.toast(r.why, 1200); return; }
    var keep = G.build.wall;
    if (commit(G, r.D, null)) { keep.run = keep.run.map(function (q) { return q[2] === 'x' ? [q[0], q[1] + dir, q[2]] : [q[0] + dir, q[1], q[2]]; }); G.build.wall = keep; if (!pickedRun(G)) G.build.wall = null; }
  };
  SS.eraseWall = function (G) {
    var run = pickedRun(G); if (!run) return;
    var r = eraseRun(SS.toLotForm(SS.homeData(G.save, G.save.home)), G.floor, run);
    if (r.D) commit(G, r.D, 'WALL ERASED'); else G.toast(r.why, 1400);
  };
  // the D-pad moves a picked wall: a press across it moves it that way, in the view she's looking from
  SS.wallPress = function (G, k) {
    var run = pickedRun(G); if (!run) return false;
    var D0 = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[k], d = SS.vdirInv(D0[0], D0[1]), ax = run[0].axis;
    var dir = ax === 'x' ? d[1] : d[0];
    if (!dir) { // the press runs along the wall: use the screen's sense of it instead (left and up move it back, right and down forward)
      dir = (k === 'down' || k === 'right') ? 1 : -1;
      var n = ax === 'x' ? SS.vdir(0, 1) : SS.vdir(1, 0); if (n[0] + n[1] < 0) dir = -dir;
    }
    SS.moveWall(G, dir); return true;
  };

  // ---------- drawing over the home ----------
  // the ghost room or wall with its size tag and price, and the picked wall's glow with its chips
  SS.drawBuildOver = function (G, toScreen) {
    var c = G.c, B = G.build, Z = G.floor * FH;
    var S = function (x, y, h) { var q = SS.vp(x, y, Z + (h || 0)); return toScreen(q[0], q[1]); };
    var quad = function (pts, fill, stroke) { c.beginPath(); pts.forEach(function (q, i) { if (i) c.lineTo(q[0], q[1]); else c.moveTo(q[0], q[1]); }); c.closePath(); c.fillStyle = fill; c.fill(); if (stroke) { c.strokeStyle = stroke; c.stroke(); } };
    var face = function (x0, y0, x1, y1, h, fill) { quad([S(x0, y0), S(x1, y1), S(x1, y1, h), S(x0, y0, h)], fill); };
    var d = B.drag;
    if (d && d.shape) {
      var sh = d.shape, ok = d.ok, tile = ok ? 'rgba(143,208,140,.5)' : 'rgba(228,111,139,.45)', wall = ok ? 'rgba(255,241,226,.45)' : 'rgba(228,111,139,.4)', mid;
      if (d.tool === 'room') {
        for (var x = sh.x0; x < sh.x1; x++) for (var y = sh.y0; y < sh.y1; y++) quad([S(x, y), S(x + 1, y), S(x + 1, y + 1), S(x, y + 1)], tile, 'rgba(255,255,255,.5)');
        [[sh.x0, sh.y0, sh.x1, sh.y0], [sh.x0, sh.y0, sh.x0, sh.y1], [sh.x1, sh.y0, sh.x1, sh.y1], [sh.x0, sh.y1, sh.x1, sh.y1]].forEach(function (e) { face(e[0], e[1], e[2], e[3], 22, wall); });
        mid = S((sh.x0 + sh.x1) / 2, (sh.y0 + sh.y1) / 2, 4);
      } else {
        var e0 = sh.axis === 'x' ? [sh.a0, sh.at] : [sh.at, sh.a0], e1 = sh.axis === 'x' ? [sh.a1, sh.at] : [sh.at, sh.a1];
        face(e0[0], e0[1], e1[0], e1[1], 30, wall);
        var p0 = S(e0[0], e0[1]), p1 = S(e1[0], e1[1]); c.strokeStyle = ok ? '#8fd08c' : '#e46f8b'; c.lineWidth = 2; c.beginPath(); c.moveTo(p0[0], p0[1]); c.lineTo(p1[0], p1[1]); c.stroke(); c.lineWidth = 1;
        mid = S((e0[0] + e1[0]) / 2, (e0[1] + e1[1]) / 2, 30);
      }
      // the size tag ("5 × 6"), with its price in Life and a check or a cross, so color isn't the only sign
      var label = d.tag + (d.cost ? '  ' + d.cost : ''), tw = SS.tw(label, 7) + (d.cost ? 12 : 0) + 24, tx = Math.round(mid[0] - tw / 2), ty = Math.round(mid[1] - 26);
      SS.R(tx, ty, tw, 15, '#fff6ea'); c.strokeStyle = ok ? P.rose : '#e46f8b'; c.strokeRect(tx + .5, ty + .5, tw - 1, 14);
      SS.txt(d.tag, tx + 6, ty + 4, P.ink, 7);
      if (d.cost) { var cx = tx + 9 + SS.tw(d.tag, 7); c.fillStyle = '#ffd56b'; c.beginPath(); c.arc(cx + 4, ty + 7.5, 3, 0, 7); c.fill(); SS.txt(String(d.cost), cx + 9, ty + 4, P.ink, 7); }
      if (ok) SS.check(tx + tw - 12, ty + 4, '#5fae5a'); else SS.cross(tx + tw - 11, ty + 4, '#e46f8b');
      if (!ok && d.why) SS.txt(d.why, G.W0 / 2, G.viewBottom - 24, '#ffd9e2', 5, 'center');
      return;
    }
    var run = pickedRun(G);
    if (run) {
      var h = function (s) { var vs = SS.vseg(s); return G.walls === 'up' ? SS.WALL_UP : G.walls === 'cut' ? (vs.back ? SS.WALL_UP : 8) : 4; };
      run.forEach(function (s) { face(s.x, s.y, s.axis === 'x' ? s.x + 1 : s.x, s.axis === 'y' ? s.y + 1 : s.y, h(s) + 2, 'rgba(228,111,139,.45)'); });
      var m = run[Math.floor(run.length / 2)], top = S(m.axis === 'x' ? m.x + .5 : m.x, m.axis === 'y' ? m.y + .5 : m.y, h(m) + 6);
      var n = m.axis === 'x' ? SS.vdir(0, 1) : SS.vdir(1, 0), fwd = n[0] + n[1] > 0 ? 1 : -1;   // which way "forward" (toward her) is
      SS.drawChips(G, top[0], Math.max(24, top[1] - 18), [
        { icon: '‹', fn: function () { SS.moveWall(G, -fwd); } }, { icon: '›', fn: function () { SS.moveWall(G, fwd); } }, { icon: 'away', fn: function () { SS.eraseWall(G); } }]);
    }
  };
  // the lot's name and size under the top bar while building (build-v1)
  SS.drawBuildLabel = function (G) { SS.txt(G.W.home.lotName + ' · ' + G.W.lot + ' × ' + G.W.lot, 8, 26, 'rgba(255,241,226,.75)', 5); };
})();
