// Sarah's Sim world: one home in one mode's save. Rooms, walls, doors, windows and stairs come from the prebuilt home data
// (home.js); the placed pieces come from the save. It knows the placing rules (spec 001, part C): big pieces never overlap
// or block a door or the stairs, small things stack on free spots, wall pieces hang on either side of a wall, rugs lie under
// furniture. It also finds walks around furniture and up the stairs (spec 006, part B).
// Tiles are lot tiles (0 to 15); floors are 0, 1, 2 (shown as 1, 2, 3). Turning the home (view.js) never changes them.
(function () {
  var FH = SS.FH = 52;      // one storey, in px (wall 48 + floor 4)
  var WALL_UP = SS.WALL_UP = 46;

  // looks: this save's own floor and wallpaper for a room, {'f:roomId': {floor, paper}} (a room favorite brings its own, spec
  // 001 part E; named papers like Nina's, spec 004 part D). The home's data is copied, so a save's looks never reach another.
  function World(home, pieces, looks) {
    home = JSON.parse(JSON.stringify(home));
    if (looks) home.floors.forEach(function (fl, f) { fl.rooms.forEach(function (r) { var L = looks[f + ':' + r.id]; if (L) { if (L.floor) r.floor = L.floor; if (L.paper) r.paper = L.paper; } }); });
    var W = { home: home, lot: home.lot, ax: home.at[0], ay: home.at[1], floors: home.floors.length, pieces: [], byUid: {}, nextUid: 1 };
    var ax = W.ax, ay = W.ay;
    // rooms per tile
    W.rooms = home.floors.map(function (fl) {
      var g = {};
      fl.rooms.forEach(function (r) { for (var x = r.r[0]; x < r.r[2]; x++) for (var y = r.r[1]; y < r.r[3]; y++) g[(x + ax) + ',' + (y + ay)] = r; });
      return g;
    });
    W.room = function (f, x, y) { return (W.rooms[f] || {})[x + ',' + y] || null; };
    // stairs, in lot tiles
    W.stairs = home.stairs.map(function (s) { return { floor: s.floor, tiles: s.tiles.map(function (q) { return [q[0] + ax, q[1] + ay]; }), from: [s.from[0] + ax, s.from[1] + ay], to: [s.to[0] + ax, s.to[1] + ay] }; });
    W.stairAt = function (f, x, y) { for (var i = 0; i < W.stairs.length; i++) { var s = W.stairs[i]; if (s.floor === f && s.tiles.some(function (q) { return q[0] === x && q[1] === y; })) return s; } return null; };
    W.wellAt = function (f, x, y) { return W.stairs.some(function (s) { return s.floor === f - 1 && s.tiles.some(function (q) { return q[0] === x && q[1] === y; }); }); };
    // walls: every tile edge between two different rooms (or a room and outside), unless they're open to each other
    W.walls = home.floors.map(function (fl, f) {
      var segs = [], key = {};
      var open = {}, wins = {};
      fl.openings.forEach(function (o) { open[(o[0] + ax) + ',' + (o[1] + ay) + o[2]] = o[3]; });
      fl.windows.forEach(function (o) { for (var k = 0; k < o[3]; k++) wins[(o[2] === 'x' ? (o[0] + k + ax) + ',' + (o[1] + ay) : (o[0] + ax) + ',' + (o[1] + k + ay)) + o[2]] = { start: k === 0, end: k === o[3] - 1, len: o[3], k: k }; });
      for (var x = 0; x <= W.lot; x++) for (var y = 0; y <= W.lot; y++) {
        [['x', x, y - 1, x, y], ['y', x - 1, y, x, y]].forEach(function (e) {
          var a = W.room(f, e[1], e[2]), b = W.room(f, e[3], e[4]);
          if (a === b || (!a && !b)) return;
          if (a && b && a.group && a.group === b.group) return;
          var k = x + ',' + y + e[0], op = open[k];
          if (op === 'open') return;
          var s = { f: f, x: x, y: y, axis: e[0], a: a, b: b, ext: !a || !b, op: op || null, win: wins[k] || null };
          // a back wall: an outside wall on the far sides of the house (the ones that stay up when walls are cut away)
          s.back = s.ext && ((e[0] === 'x' && !a) || (e[0] === 'y' && !a));
          segs.push(s); key[k] = s;
        });
      }
      segs.key = key; return segs;
    });
    W.seg = function (f, x, y, axis) { return (W.walls[f] && W.walls[f].key[x + ',' + y + axis]) || null; };
    // is there a wall (not a doorway) between two neighboring tiles?
    W.wallBetween = function (f, x, y, nx, ny) {
      var s = nx !== x ? W.seg(f, Math.max(x, nx), y, 'y') : W.seg(f, x, Math.max(y, ny), 'x');
      return !!(s && !(s.op === 'door' || s.op === 'arch'));
    };
    W.inside = function (f, x, y) { return !!W.room(f, x, y) && !W.wellAt(f, x, y) && !W.stairAt(f, x, y); };
    // tiles kept clear: both sides of every doorway, and where the stairs start and end
    W.reserved = home.floors.map(function (fl, f) {
      var r = {};
      W.walls[f].forEach(function (s) { if (s.op === 'door' || s.op === 'arch') { if (s.axis === 'x') { r[s.x + ',' + (s.y - 1)] = 1; r[s.x + ',' + s.y] = 1; } else { r[(s.x - 1) + ',' + s.y] = 1; r[s.x + ',' + s.y] = 1; } } });
      W.stairs.forEach(function (s) { if (s.floor === f) r[s.from[0] + ',' + s.from[1]] = 1; if (s.floor + 1 === f) r[s.to[0] + ',' + s.to[1]] = 1; });
      return r;
    });

    // ---------- pieces ----------
    W.def = function (p) { return SS.DEF[p.id]; };
    W.add = function (p) { if (!p.uid) p.uid = W.nextUid++; else W.nextUid = Math.max(W.nextUid, p.uid + 1); W.pieces.push(p); W.byUid[p.uid] = p; return p; };
    W.remove = function (p) { W.pieces = W.pieces.filter(function (q) { return q !== p; }); delete W.byUid[p.uid]; W.pieces.filter(function (q) { return q.host === p.uid; }).forEach(function (q) { W.remove(q); }); };
    W.size = function (def, r) { return r % 2 ? [def.d, def.w] : [def.w, def.d]; };
    W.foot = function (p) { // the tiles a floor piece covers [x0, y0, x1, y1)
      var d = W.def(p), s = W.size(d, p.r || 0);
      if (d.kind === 'small') return [p.x, p.y, p.x + 1, p.y + 1];
      return [p.x, p.y, p.x + Math.ceil(s[0] - 1e-6), p.y + Math.ceil(s[1] - 1e-6)];
    };
    W.stacked = function (host) { return W.pieces.filter(function (q) { return q.host === host.uid; }); };
    W.spotFree = function (host, i, except) { return !W.pieces.some(function (q) { return q !== except && q.host === host.uid && q.spot === i; }); };
    W.hostOf = function (p) { return p.host ? W.byUid[p.host] : null; };
    W.floorOf = function (p) { var h = W.hostOf(p); return h ? W.floorOf(h) : p.f; };
    // the world point and height a stacked piece sits at
    W.spotPos = function (host, i) {
      var d = W.def(host), sp = d.spots[i], s = W.size(d, host.r || 0);
      if (host.wall) { var wp = W.wallPlace(host); var M = SS.Model(null, d, host, wp); var q = M.wp(sp[0], sp[1]); return { x: q[0], y: q[1], z: wp.z + (d.top || 0) }; }
      var M2 = SS.Model(null, d, host, { x: host.x, y: host.y, rot: host.r || 0 }); var q2 = M2.wp(sp[0], sp[1]);
      var hz = W.hostOf(host) ? W.spotPos(W.hostOf(host), host.spot).z : 0;
      return { x: q2[0], y: q2[1], z: hz + (d.top || 0) };
    };
    // where a wall piece hangs: the model's place. It hangs on either side of its wall (bible, Building, Turning the home):
    // side 1 (the default, so older saves keep theirs) is the wall's + side, facing +y on walls along x and +x on walls along
    // y (turns 0 and 3); side -1 is the other face (turns 2 and 1), its back against the wall
    W.wallPlace = function (p) {
      var d = W.def(p), wx = p.wall[0], wy = p.wall[1], back = (p.side || 1) < 0;
      if (p.wall[2] === 'x') return back ? { x: wx, y: wy - .07 - d.d, z: d.mount || 24, rot: 2 } : { x: wx, y: wy + .07, z: d.mount || 24, rot: 0 };
      return back ? { x: wx - .07 - d.d, y: wy, z: d.mount || 24, rot: 1 } : { x: wx + .07, y: wy, z: d.mount || 24, rot: 3 };
    };
    W.roomOn = function (s, side) { return (side || 1) < 0 ? s.a : s.b; };   // the room on that side of a wall
    W.wallSegs = function (q) { var n = Math.max(1, Math.ceil(W.def(q).w)), out = []; for (var k = 0; k < n; k++) out.push((q.wall[2] === 'x' ? (q.wall[0] + k) + ',' + q.wall[1] : q.wall[0] + ',' + (q.wall[1] + k)) + q.wall[2]); return out; };
    W.occ = function (f, except) { // tiles taken by big pieces (and small things standing on the floor)
      var o = {}, r = {};
      W.pieces.forEach(function (p) {
        if (p === except || p.f !== f || p.host || p.wall) return;
        var d = W.def(p), ft = W.foot(p);
        for (var x = ft[0]; x < ft[2]; x++) for (var y = ft[1]; y < ft[3]; y++) (d.kind === 'rug' ? r : o)[x + ',' + y] = p;
      });
      return { solid: o, rug: r };
    };

    // can this piece go here? cand = {id, f, x, y, r} or {id, f, wall} or {id, host, spot}. Returns {ok, why}
    W.check = function (cand, except) {
      var d = SS.DEF[cand.id];
      if (cand.host) {
        var host = W.byUid[cand.host], hd = host && W.def(host);
        if (!host || d.kind !== 'small' || !hd.spots[cand.spot]) return { ok: false, why: 'NO SPOT' };
        if (!W.spotFree(host, cand.spot, except)) return { ok: false, why: 'TAKEN' };
        return { ok: true };
      }
      if (d.kind === 'wall') {
        if (!cand.wall) return { ok: false, why: 'NEEDS A WALL' };
        for (var k = 0; k < Math.ceil(d.w); k++) {
          var sx = cand.wall[2] === 'x' ? cand.wall[0] + k : cand.wall[0], sy = cand.wall[2] === 'y' ? cand.wall[1] + k : cand.wall[1];
          var s = W.seg(cand.f, sx, sy, cand.wall[2]);
          if (!s || !W.roomOn(s, cand.side) || s.op) return { ok: false, why: 'NEEDS A WALL' };
          if (d.window ? !s.win : s.win) return { ok: false, why: d.window ? 'NEEDS A WINDOW' : 'WINDOW' };
          var mine = sx + ',' + sy + cand.wall[2];
          var taken = W.pieces.some(function (q) { return q !== except && q.wall && q.f === cand.f && (q.side || 1) === (cand.side || 1) && W.wallSegs(q).indexOf(mine) >= 0; });
          if (taken) return { ok: false, why: 'TAKEN' };
        }
        return { ok: true };
      }
      var sz = W.size(d, cand.r || 0), x1 = cand.x + (d.kind === 'small' ? 1 : Math.ceil(sz[0] - 1e-6)), y1 = cand.y + (d.kind === 'small' ? 1 : Math.ceil(sz[1] - 1e-6));
      var oc = W.occ(cand.f, except), res = W.reserved[cand.f];
      for (var x = cand.x; x < x1; x++) for (var y = cand.y; y < y1; y++) {
        if (!W.inside(cand.f, x, y)) return { ok: false, why: W.stairAt(cand.f, x, y) || W.wellAt(cand.f, x, y) ? 'STAIRS' : 'OUTSIDE' };
        if (x > cand.x && W.wallBetween(cand.f, x - 1, y, x, y)) return { ok: false, why: 'WALL' };
        if (y > cand.y && W.wallBetween(cand.f, x, y - 1, x, y)) return { ok: false, why: 'WALL' };
        if (d.kind === 'rug') { if (oc.rug[x + ',' + y]) return { ok: false, why: 'TAKEN' }; continue; }
        if (oc.solid[x + ',' + y]) return { ok: false, why: 'TAKEN' };
        if (res[x + ',' + y]) return { ok: false, why: 'DOORWAY' };
      }
      return { ok: true };
    };

    // ---------- walking ----------
    W.walkable = function (f, x, y, occ) {
      if (!W.inside(f, x, y)) return false;
      return !(occ || W.occ(f)).solid[x + ',' + y];
    };
    W.path = function (start, isGoal, h) { // start {f, x, y}; isGoal(f, x, y)
      var occs = [0, 1, 2].map(function (f) { return W.occ(f); });
      var D = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      return StudioPath.find(start, function (n) { return isGoal(n.f, n.x, n.y); }, function (n) {
        var out = [];
        D.forEach(function (d) {
          var nx = n.x + d[0], ny = n.y + d[1];
          if (!W.walkable(n.f, nx, ny, occs[n.f]) || W.wallBetween(n.f, n.x, n.y, nx, ny)) return;
          out.push([{ f: n.f, x: nx, y: ny }, 1]);
        });
        W.stairs.forEach(function (s) {
          if (s.floor === n.f && s.from[0] === n.x && s.from[1] === n.y) out.push([{ f: n.f + 1, x: s.to[0], y: s.to[1], stair: s, up: true }, s.tiles.length + 1]);
          if (s.floor + 1 === n.f && s.to[0] === n.x && s.to[1] === n.y) out.push([{ f: n.f - 1, x: s.from[0], y: s.from[1], stair: s, up: false }, s.tiles.length + 1]);
        });
        return out;
      }, function (n) { return n.f + ',' + n.x + ',' + n.y; }, h);
    };
    // tiles next to a piece where someone can stand to use it, the front first
    W.useTiles = function (p) {
      var ft = W.foot(p), f = W.floorOf(p), d = W.def(p), out = [];
      if (p.host) { var h = W.hostOf(p); return W.useTiles(h); }
      if (p.wall) { var s = p.wall; var tx = s[2] === 'x' ? s[0] : s[0], ty = s[2] === 'x' ? s[1] : s[1]; return [[tx, ty], [tx + (s[2] === 'x' ? 1 : 0), ty + (s[2] === 'y' ? 1 : 0)], [tx - (s[2] === 'x' ? 1 : 0), ty - (s[2] === 'y' ? 1 : 0)]].filter(function (q) { return W.inside(f, q[0], q[1]); }); }
      var occ = W.occ(f);
      var front = [[0, 1], [-1, 0], [0, -1], [1, 0]][p.r || 0];
      for (var x = ft[0] - 1; x <= ft[2]; x++) for (var y = ft[1] - 1; y <= ft[3]; y++) {
        var inX = x >= ft[0] && x < ft[2], inY = y >= ft[1] && y < ft[3];
        if (inX === inY) continue;                      // not touching a side (inside, or a corner)
        if (!W.walkable(f, x, y, occ)) continue;
        var nx = Math.max(ft[0], Math.min(ft[2] - 1, x)), ny = Math.max(ft[1], Math.min(ft[3] - 1, y));
        if (W.wallBetween(f, x, y, nx, ny)) continue;
        var isFront = (front[0] && (front[0] > 0 ? x >= ft[2] : x < ft[0])) || (front[1] && (front[1] > 0 ? y >= ft[3] : y < ft[1]));
        out.push({ x: x, y: y, front: isFront });
      }
      out.sort(function (a, b) { return (b.front ? 1 : 0) - (a.front ? 1 : 0); });
      return out.map(function (q) { return [q.x, q.y]; });
    };

    // ---------- load ----------
    if (pieces) pieces.forEach(function (p) { if (SS.DEF[p.id]) W.add(JSON.parse(JSON.stringify(p))); });
    return W;
  }

  // the starting furniture for a new save, from the home data (house tiles to lot tiles, stacked pieces to their host)
  World.startPieces = function (home) {
    var out = [], uid = 1, ax = home.at[0], ay = home.at[1], counts = {};
    home.pieces.forEach(function (q) {
      var p = { uid: uid++, id: q.id, f: q.f, sw: q.sw || 0, props: true };
      counts[q.id] = (counts[q.id] || 0) + 1; p._n = counts[q.id];
      if (q.on) {
        var m = /^([a-z-]+)(?:#(\d+))?@(\d+)$/.exec(q.on), n = m[2] ? +m[2] : null;
        var host = n ? out.filter(function (h) { return h.id === m[1] && h._n === n; })[0] : out.filter(function (h) { return h.id === m[1] && h.f === q.f; }).pop();
        p.host = host.uid; p.spot = +m[3];
      } else if (q.wall) p.wall = [q.wall[0] + ax, q.wall[1] + ay, q.wall[2]];
      else { p.x = q.x + ax; p.y = q.y + ay; p.r = q.r || 0; }
      out.push(p);
    });
    out.forEach(function (p) { delete p._n; });
    return out;
  };
  SS.World = World;
})();
