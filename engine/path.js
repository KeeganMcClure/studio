// Studio path: the shortest walk over any grid of places, for any game where someone walks to a tapped spot
// (first built for Sarah's Sim spec 006, part B: tap the floor to walk Sarah there, around furniture and up the stairs).
// Knows nothing about any game: the game says what a place is and where each one leads.
//
//   StudioPath.find(start, isGoal, next, key, h, limit)
//     start          the place to start from (any value)
//     isGoal(n)      true for a place she may stop at
//     next(n)        [[place, cost], ...] places reachable in one step from n
//     key(n)         a string naming the place
//     h(n)           optional: a guess of the cost left (never more than the real cost), for a faster search
//     limit          optional: give up after looking at this many places (default 4000)
//   Returns the list of places from start to the goal (start included), or null when there is no way.
(function () {
  function find(start, isGoal, next, key, h, limit) {
    h = h || function () { return 0; }; limit = limit || 4000;
    var open = [{ n: start, g: 0, f: h(start) }], came = {}, best = {}, seen = 0;
    best[key(start)] = 0;
    while (open.length && seen++ < limit) {
      var bi = 0; for (var i = 1; i < open.length; i++) if (open[i].f < open[bi].f) bi = i;
      var cur = open.splice(bi, 1)[0], ck = key(cur.n);
      if (cur.g > best[ck]) continue;
      if (isGoal(cur.n)) { var out = [cur.n], k = ck; while (came[k]) { out.unshift(came[k].n); k = key(came[k].n); } return out; }
      next(cur.n).forEach(function (e) {
        var nk = key(e[0]), g = cur.g + e[1];
        if (best[nk] === undefined || g < best[nk]) { best[nk] = g; came[nk] = { n: cur.n }; open.push({ n: e[0], g: g, f: g + h(e[0]) }); }
      });
    }
    return null;
  }
  window.StudioPath = { find: find };
})();
