// Studio patrol: things that walk a short beat on a tile map (guards, roamers, wandering animals), for every game.
// Set Nov 22, 2026 from Black Lantern spec 006 part C (the corn maze's roamers). Knows nothing about any game:
// the game decides what a walker is, what it guards, what happens when it catches someone, and how it's drawn.
//
//   StudioPatrol.beat(path)              a walker state for a beat: {path, i, dir}, standing on path[0]
//     path: [[x, y], ...] neighbouring tiles; the walker goes to the end and back, forever
//   StudioPatrol.next(w)                 moves w one tile along its beat (turning at either end); returns [x, y]
//   StudioPatrol.at(w)                   the tile it stands on, [x, y]
//   StudioPatrol.toward(w, x, y, ok)     moves w one tile toward x, y by the shortest walkable route (ok(x, y) says
//                                        which tiles can be walked). Leaves the beat; returns [x, y], or null if stuck
//   StudioPatrol.home(w, ok)             one tile back toward the nearest tile of its own beat; true once it's back
//   StudioPatrol.sees(w, x, y, range, ok) true when x, y is in a straight walkable line from w within range tiles
//   StudioPatrol.route(fx, fy, tx, ty, ok, max)  the shortest walkable route as [[x, y], ...] (start excluded), or []
(function () {
  var N = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  function beat(path) { return { path: path.slice(), i: 0, dir: 1, x: path[0][0], y: path[0][1], off: false }; }
  function at(w) { return [w.x, w.y]; }
  function next(w) {
    if (w.path.length < 2) return at(w);
    var j = w.i + w.dir;
    if (j < 0 || j >= w.path.length) { w.dir = -w.dir; j = w.i + w.dir; }
    w.i = j; w.x = w.path[j][0]; w.y = w.path[j][1];
    return at(w);
  }
  function route(fx, fy, tx, ty, ok, max) {
    max = max || 4000;
    var key = function (x, y) { return x + ',' + y; }, prev = {}, q = [[fx, fy]], seen = {}, n = 0;
    seen[key(fx, fy)] = true;
    while (q.length && n++ < max) {
      var c = q.shift();
      if (c[0] === tx && c[1] === ty) {
        var out = [], k = key(tx, ty);
        while (prev[k]) { var p = k.split(','); out.unshift([+p[0], +p[1]]); k = prev[k]; }
        return out;
      }
      for (var i = 0; i < 4; i++) {
        var nx = c[0] + N[i][0], ny = c[1] + N[i][1], nk = key(nx, ny);
        if (seen[nk] || !(ok(nx, ny) || (nx === tx && ny === ty))) continue;
        seen[nk] = true; prev[nk] = key(c[0], c[1]); q.push([nx, ny]);
      }
    }
    return [];
  }
  function toward(w, x, y, ok) {
    var r = route(w.x, w.y, x, y, ok, 600);
    if (!r.length) return null;
    w.off = true; w.x = r[0][0]; w.y = r[0][1];
    return at(w);
  }
  function home(w, ok) {
    var best = -1, bd = Infinity;
    w.path.forEach(function (p, i) { var d = Math.abs(p[0] - w.x) + Math.abs(p[1] - w.y); if (d < bd) { bd = d; best = i; } });
    if (bd === 0) { w.i = best; w.off = false; return true; }
    var t = w.path[best], r = route(w.x, w.y, t[0], t[1], ok, 600);
    if (!r.length) { w.x = t[0]; w.y = t[1]; w.i = best; w.off = false; return true; }
    w.x = r[0][0]; w.y = r[0][1];
    return false;
  }
  function sees(w, x, y, range, ok) {
    if (w.x !== x && w.y !== y) return false;
    var dx = Math.sign(x - w.x), dy = Math.sign(y - w.y), d = Math.abs(x - w.x) + Math.abs(y - w.y);
    if (d > range) return false;
    for (var s = 1; s < d; s++) if (!ok(w.x + dx * s, w.y + dy * s)) return false;
    return true;
  }
  window.StudioPatrol = { beat: beat, next: next, at: at, toward: toward, home: home, sees: sees, route: route };
})();
