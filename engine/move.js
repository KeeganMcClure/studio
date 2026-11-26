// Studio movement: grid walking on the map, the camera and the canvas fit, for every game
// (studio-bible/controls.md: Shell, and "on the map, the last direction pressed wins"; art-style.md: 16 px tiles).
// Knows nothing about any game. The game keeps its own state object and passes it in, so what a save
// holds (map, x, y, dir) doesn't change. The state's fields:
//   x, y      tile the lead stands on        px, py   pixel position (moves during a step)
//   dir       'up' 'down' 'left' 'right'     mv       the step in progress, or null
//   anim      frames walked, for the walk cycle
//
//   StudioMove.place(s, x, y, dir)           put the lead on a tile, standing still
//   StudioMove.update(s, dir, {passable(x, y), busy(), arrive()})
//                                            once per screen frame while the map is up. dir is the held
//                                            direction (StudioMove.last(held)) or null. arrive() runs on
//                                            reaching a tile (warps, step triggers).
//   StudioMove.hold(held, dir, on)           returns the new held list; the last one pressed wins
//   StudioMove.ahead(s)                      [x, y] of the tile the lead faces (A uses it)
//   StudioMove.walkFrame(s)                  0 standing, 1 or 2 walking
//   StudioMove.camera(s, mapW, mapH, vw, vh) [x, y]: follows the lead, stops at the map's edges, centers small maps
//   StudioMove.nearestOpen(x, y, w, h, open)  [x, y] of the nearest tile (steps on the grid, through walls) where
//                                            open(x, y) is true, or null: a saved spot that's now a wall moves here
//   StudioMove.fit(box, canvas, maxH)        sizes the canvas 240 px wide and as tall as the box's shape allows
//                                            (130 to 320, or to maxH for a game whose bible lifts the cap), crisp
//                                            pixels; returns {w, h, boxW, boxH}, or null while hidden
(function () {
  var TILE = 16, STEPF = 10, WALKF = 5;   // a step takes 10 frames (about 6 tiles a second at 60 Hz); frames change every 5
  var VIEW_W = 240, VIEW_MIN_H = 130, VIEW_MAX_H = 320;
  var DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  function place(s, x, y, dir) { s.x = x; s.y = y; s.dir = dir || 'down'; s.px = x * TILE; s.py = y * TILE; s.mv = null; }

  function update(s, dir, o) {
    var mv = s.mv;
    if (mv) {
      mv.t++;
      var k = mv.t / STEPF;
      s.px = Math.round((mv.fx + (mv.tx - mv.fx) * k) * TILE);
      s.py = Math.round((mv.fy + (mv.ty - mv.fy) * k) * TILE);
      s.anim = (s.anim || 0) + 1;
      if (mv.t >= STEPF) { s.x = mv.tx; s.y = mv.ty; s.mv = null; o.arrive(); }
      return;
    }
    if (o.busy() || !dir) return;
    // blocked: turn to face it without moving
    s.dir = dir;
    var d = DIRS[dir], nx = s.x + d[0], ny = s.y + d[1];
    if (o.passable(nx, ny)) s.mv = { fx: s.x, fy: s.y, tx: nx, ty: ny, t: 0 };
  }

  function hold(held, dir, on) { held = held.filter(function (x) { return x !== dir; }); if (on) held.push(dir); return held; }
  function last(held) { return held[held.length - 1]; }
  function ahead(s) { var d = DIRS[s.dir]; return [s.x + d[0], s.y + d[1]]; }
  function walkFrame(s) { return s.mv ? (Math.floor((s.anim || 0) / WALKF) % 2) + 1 : 0; }

  function nearestOpen(x, y, w, h, open) {
    var seen = {}, q = [[x, y]]; seen[x + ',' + y] = true;
    while (q.length) {
      var c = q.shift();
      if (open(c[0], c[1])) return c;
      ['up', 'left', 'right', 'down'].forEach(function (k) {
        var nx = c[0] + DIRS[k][0], ny = c[1] + DIRS[k][1];
        if (nx < 0 || ny < 0 || nx >= w || ny >= h || seen[nx + ',' + ny]) return;
        seen[nx + ',' + ny] = true; q.push([nx, ny]);
      });
    }
    return null;
  }

  function camera(s, mapW, mapH, vw, vh) {
    var mw = mapW * TILE, mh = mapH * TILE;
    var x = mw <= vw ? (mw - vw) / 2 : clamp(s.px + 8 - vw / 2, 0, mw - vw);
    var y = mh <= vh ? (mh - vh) / 2 : clamp(s.py + 8 - vh / 2, 0, mh - vh);
    return [Math.round(x), Math.round(y)];
  }

  function fit(box, canvas, maxH) {
    var r = box.getBoundingClientRect();
    if (!r.width || !r.height) return null;
    var w = VIEW_W, h = clamp(Math.round(VIEW_W * r.height / r.width), VIEW_MIN_H, maxH || VIEW_MAX_H);
    canvas.width = w; canvas.height = h;
    canvas.getContext('2d').imageSmoothingEnabled = false;
    return { w: w, h: h, boxW: r.width, boxH: r.height };
  }

  window.StudioMove = { TILE: TILE, STEPF: STEPF, DIRS: DIRS, place: place, update: update, hold: hold, last: last, ahead: ahead, walkFrame: walkFrame, camera: camera, nearestOpen: nearestOpen, fit: fit };
})();
