// Studio nearest: moves a cursor between things laid out freely on a screen (cards pinned on a board, icons on a
// map screen), for every game. Set Nov 21, 2026 from Black Lantern spec 004 (the case board's cursor).
// Knows nothing about any game.
//
//   StudioNearest.step(rects, cur, dir)   the index of the nearest rect in that direction from rects[cur],
//                                         or cur when there is none (the cursor stays put)
//     rects: [{x, y, w, h}, ...]   in any units, all the same
//     dir:   'up' | 'down' | 'left' | 'right'
//   StudioNearest.at(rects, x, y)         the index of the topmost rect under the point x, y, or -1
//
// "In that direction" means the other rect's centre lies past the current centre along that axis. Among those,
// the closest wins, with sideways distance counting double, so a card straight ahead beats one that is nearer
// but far off to the side.
(function () {
  var AXIS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  function centre(r) { return [r.x + r.w / 2, r.y + r.h / 2]; }
  function step(rects, cur, dir) {
    var d = AXIS[dir], from = rects[cur];
    if (!d || !from) return cur;
    var c = centre(from), best = cur, bestScore = Infinity;
    for (var i = 0; i < rects.length; i++) {
      if (i === cur || !rects[i]) continue;
      var o = centre(rects[i]), dx = o[0] - c[0], dy = o[1] - c[1];
      var ahead = dx * d[0] + dy * d[1];           // distance along the direction pressed
      var side = Math.abs(dx * d[1] + dy * d[0]);  // distance across it
      if (ahead <= 0) continue;
      var score = ahead + 2 * side;
      if (score < bestScore) { bestScore = score; best = i; }
    }
    return best;
  }
  function at(rects, x, y) {
    for (var i = rects.length - 1; i >= 0; i--) {
      var r = rects[i];
      if (r && x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h) return i;
    }
    return -1;
  }
  window.StudioNearest = { step: step, at: at };
})();
