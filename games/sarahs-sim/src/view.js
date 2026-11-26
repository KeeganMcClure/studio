// Sarah's Sim: turning the whole home (bible, Building, Turning the home; spec 001, part B, What turning the home touches).
// The home is kept in its own lot coordinates; the view turns them a quarter turn clockwise per step, around the lot's
// middle, before they're drawn. Everything that draws the world goes through here, and everything that reads a tap or a
// D-pad press turns it back, so the rules (walls, placing, walking) never need to know which way she's looking.
//   SS.view.k        0 to 3: how many quarter turns clockwise the home is turned
//   SS.vxy(x, y)     a lot point as the view sees it; SS.vinv(x, y) turns it back
//   SS.vp(x, y, h)   a lot point on the screen (the iso projection of the turned point)
//   SS.vrect(...)    a lot rectangle as the view sees it, [x0, y0, x1, y1]
//   SS.vplace(...)   where a piece's model goes in the view, and the turn it's drawn at (its own turn plus the view's)
//   SS.vdir / SS.vdirInv  a direction (a step, a facing) into the view and back
//   SS.vface(o)      a person's or cat's facing (flip, back) as seen in the view
//   SS.vseg / SS.vstair  a wall segment or a flight of stairs as the view sees it
(function () {
  var V = SS.view = { k: 0, L: 16 };
  function rot1(x, y) { return [V.L - y, x]; }   // one quarter turn clockwise on screen
  function inv1(x, y) { return [y, V.L - x]; }
  SS.vxy = function (x, y, k) { var q = [x, y], n = ((k === undefined ? V.k : k) % 4 + 4) % 4; for (var i = 0; i < n; i++) q = rot1(q[0], q[1]); return q; };
  SS.vinv = function (x, y, k) { var q = [x, y], n = ((k === undefined ? V.k : k) % 4 + 4) % 4; for (var i = 0; i < n; i++) q = inv1(q[0], q[1]); return q; };
  SS.vp = function (x, y, h) { var q = SS.vxy(x, y); return SS.I.p(q[0], q[1], h); };
  SS.vrect = function (x0, y0, x1, y1) {
    var a = SS.vxy(x0, y0), b = SS.vxy(x1, y1);
    return [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[0], b[0]), Math.max(a[1], b[1])];
  };
  // a model placed at (X, Y) with turn rot (its footprint's corner nearest the lot's 0, 0) and size w x d at turn 0
  SS.vplace = function (X, Y, rot, w, d) {
    var sw = rot % 2 ? d : w, sd = rot % 2 ? w : d, r = SS.vrect(X, Y, X + sw, Y + sd);
    return { x: r[0], y: r[1], rot: ((rot || 0) + V.k) % 4 };
  };
  SS.vdir = function (dx, dy) { var q = [dx, dy]; for (var i = 0; i < V.k; i++) q = [-q[1], q[0]]; return q; };
  SS.vdirInv = function (dx, dy) { var q = [dx, dy]; for (var i = 0; i < V.k; i++) q = [q[1], -q[0]]; return q; };
  // facings in the order a quarter turn clockwise steps through them: right-front, left-front, left-back, right-back
  var FACE = [[false, false], [true, false], [true, true], [false, true]];
  SS.vface = function (flip, back) {
    var i = 0; for (var j = 0; j < 4; j++) if (FACE[j][0] === !!flip && FACE[j][1] === !!back) i = j;
    var f = FACE[(i + V.k) % 4]; return { flip: f[0], back: f[1] };
  };
  // a lot tile as the view sees it (the tile, not a point)
  SS.vtile = function (x, y) { var q = SS.vxy(x + .5, y + .5); return [Math.floor(q[0]), Math.floor(q[1])]; };
  // a wall segment turned into the view: still along x or y, with the rooms on its - and + sides (a, b) swapped when its
  // sides swap, and its window's start and end swapped when it runs the other way
  SS.vseg = function (s) {
    var p0 = SS.vxy(s.x, s.y), p1 = s.axis === 'x' ? SS.vxy(s.x + 1, s.y) : SS.vxy(s.x, s.y + 1);
    var axis = p0[1] === p1[1] ? 'x' : 'y', x = Math.min(p0[0], p1[0]), y = Math.min(p0[1], p1[1]);
    var along = axis === 'x' ? p1[0] - p0[0] : p1[1] - p0[1];           // +1 when it still runs from start to end
    var n = s.axis === 'x' ? SS.vdir(0, 1) : SS.vdir(1, 0);              // the world + side, turned
    var plus = axis === 'x' ? n[1] > 0 : n[0] > 0;                        // does the world + side stay the view's + side?
    var a = plus ? s.a : s.b, b = plus ? s.b : s.a;
    var win = s.win;
    if (win && along < 0) win = { start: win.end, end: win.start, len: win.len, k: win.len - 1 - win.k };
    return { f: s.f, x: x, y: y, axis: axis, a: a, b: b, ext: s.ext, op: s.op, win: win, src: s, flip: !plus,
      back: s.ext && !a };   // the far outside walls in this view stay up when the walls are cut away
  };
  SS.vstair = function (s) {
    return { floor: s.floor, tiles: s.tiles.map(function (q) { return SS.vtile(q[0], q[1]); }), from: SS.vtile(s.from[0], s.from[1]), to: SS.vtile(s.to[0], s.to[1]), src: s };
  };
  // the side of a wall that faces her in this view: +1 is the wall's own + side (y for walls along x, x for walls along y)
  SS.vfacing = function (axis) { var n = axis === 'x' ? SS.vdir(0, 1) : SS.vdir(1, 0); return n[0] + n[1] > 0 ? 1 : -1; };
})();
