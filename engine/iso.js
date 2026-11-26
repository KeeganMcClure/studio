// Studio isometric view: the 2:1 diagonal view, for any game drawn that way (first built for Sarah's Sim spec 001,
// Nov 26, 2026; the bible's Art names the view as its exception to the 3/4 top-down rule). Knows nothing about any game.
// Light comes from the upper left: a box's +y face (left-front) is lit, its +x face (right-front) is in shade.
//
//   var I = StudioIso.grid(22, 11)      tiles 22 px wide and 11 px tall (2:1)
//   I.p(x, y, h)                         screen point [sx, sy] of tile point x, y lifted h px (tile 0,0 sits at 0,0)
//   I.tile(sx, sy, h)                    the tile point [x, y] under a screen point, on the plane h px up
//   I.box(c, x, y, w, d, h, z, cols, o)  draws a box: cols = [top, +y face, +x face] (colors or functions(c, pts) that
//                                        fill the face themselves); o.line: outline color (false for none); o.hi: the
//                                        light edge along the front top. Returns the faces {top, left, right} as point lists.
//   I.quad(x0, y0, x1, y1, h)            the four screen points of a flat tile rectangle h px up
//   StudioIso.poly(c, pts, fill, stroke)  fill and/or stroke a point list
//   StudioIso.sort(items)                orders items back to front. Each item has world bounds x0 x1 y0 y1 (tiles) and
//                                        z0 z1 (px), and screen bounds l r t b. Items whose screen bounds overlap are
//                                        ordered by which is behind: further along x and y (when those disagree, the one
//                                        with the smaller x + y), then lower; anything else keeps the order given.
//                                        Item.after (another item) forces it to draw after that one.
//                                        Item.plane = {axis: 'x'|'y', at} marks a thin wall standing on the line y = at (axis 'x')
//                                        or x = at (axis 'y'): an item wholly on the far side of that line draws behind it, and
//                                        one wholly on the near side in front (exact for a flat wall); the boxes decide the rest.
//                                        Two walls are never compared: give them in back-to-front order. Item.drawn = [l, t, r, b] is
//                                        the drawing's own screen bounds when it spills past its box; it counts against walls.
//   StudioIso.ramp(hex)                  a four-tone ramp [light, base, shade, deep] built from one color, for shading any
//                                        painted part (art-style.md, Quality bar: Volume)
//   StudioIso.camera(o)                  a zoom and pan camera over a world drawn at 1x: {zoom, x, y} is the world point at
//                                        the view's middle. .fit(vw, vh) sets the view size; .toWorld(sx, sy);
//                                        .toView(wx, wy); .clamp(l, t, r, b) keeps the middle inside those world bounds;
//                                        .src() the world rectangle the view shows [x, y, w, h]
(function () {
  function poly(c, pts, fill, stroke) {
    c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]);
    c.closePath();
    if (fill) { if (typeof fill === 'function') fill(c, pts); else { c.fillStyle = fill; c.fill(); } }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = 1; c.stroke(); }
  }

  function grid(TW, TH) {
    var hw = TW / 2, hh = TH / 2;
    var g = {
      TW: TW, TH: TH,
      p: function (x, y, h) { return [(x - y) * hw, (x + y) * hh - (h || 0)]; },
      tile: function (sx, sy, h) { var a = sx / hw, b = (sy + (h || 0)) / hh; return [(a + b) / 2, (b - a) / 2]; },
      quad: function (x0, y0, x1, y1, h) { return [g.p(x0, y0, h), g.p(x1, y0, h), g.p(x1, y1, h), g.p(x0, y1, h)]; },
      box: function (c, x, y, w, d, h, z, cols, o) {
        o = o || {}; z = z || 0;
        var A = g.p(x, y, z), B = g.p(x + w, y, z), C = g.p(x + w, y + d, z), D = g.p(x, y + d, z);
        var up = function (q) { return [q[0], q[1] - h]; };
        var F = { left: [D, C, up(C), up(D)], right: [B, C, up(C), up(B)], top: [up(A), up(B), up(C), up(D)] };
        poly(c, F.left, cols[1]); poly(c, F.right, cols[2]); poly(c, F.top, cols[0]);
        if (o.line !== false) {
          poly(c, [up(A), up(B), B, C, D, up(D)], null, o.line || 'rgba(59,36,48,.85)');
          if (o.hi !== false && h > 1) { c.strokeStyle = o.hi || 'rgba(255,255,255,.35)'; c.beginPath(); c.moveTo(up(D)[0], up(D)[1] + .5); c.lineTo(up(C)[0], up(C)[1] + .5); c.stroke(); }
        }
        return F;
      }
    };
    return g;
  }

  // back-to-front order: a stable topological sort over the "is behind" edges of items that overlap on screen
  function behind(a, b) { // true when a must be drawn before b
    var E = 1e-4;
    if (!a.plane !== !b.plane) { // one is a flat wall: which side of its line is the other one on?
      var w = a.plane ? a : b, o = a.plane ? b : a, lo = w.plane.axis === 'x' ? o.y0 : o.x0, hi = w.plane.axis === 'x' ? o.y1 : o.x1;
      // only when it's wholly on one side; something straddling the line stands past the wall's end, and the boxes decide
      if (lo >= w.plane.at - E || hi <= w.plane.at + E) { var oFront = lo >= w.plane.at - E; return a.plane ? oFront : !oFront; }
    }
    // apart along x and along y: when both say the same, that's the answer; when they disagree (one sits back-right of the
    // other, side by side on screen), the one nearer the viewer (larger x + y) draws last, so the order never loops
    var sx = a.x1 <= b.x0 + E ? 1 : b.x1 <= a.x0 + E ? -1 : 0, sy = a.y1 <= b.y0 + E ? 1 : b.y1 <= a.y0 + E ? -1 : 0;
    if (sx && sy && sx !== sy) return a.x0 + a.x1 + a.y0 + a.y1 < b.x0 + b.x1 + b.y0 + b.y1;
    if (sx) return sx > 0; if (sy) return sy > 0;
    if (a.z1 <= b.z0 + E) return true; if (b.z1 <= a.z0 + E) return false;
    return a._k < b._k;   // boxes that cut into each other keep the order given
  }
  function sort(items) {
    var n = items.length, deps = new Array(n), i, j;
    for (i = 0; i < n; i++) { deps[i] = []; items[i]._k = i; }
    for (i = 0; i < n; i++) for (j = i + 1; j < n; j++) {
      var a = items[i], b = items[j];
      if (b.after === a) { deps[j].push(i); continue; }
      if (a.after === b) { deps[i].push(j); continue; }
      // against a wall, what's drawn counts (item.drawn = [l, t, r, b], when a drawing spills past its box); else the boxes
      if (a.plane && b.plane) continue;   // two walls only ever meet at a corner: they keep the order given (no loops)
      var ra = (a.plane || b.plane) && a.drawn || [a.l, a.t, a.r, a.b], rb = (a.plane || b.plane) && b.drawn || [b.l, b.t, b.r, b.b];
      if (ra[2] <= rb[0] || rb[2] <= ra[0] || ra[3] <= rb[1] || rb[3] <= ra[1]) continue;
      if (behind(a, b)) deps[j].push(i); else deps[i].push(j);
    }
    var out = [], state = new Array(n);   // 0 new, 1 visiting, 2 done
    function visit(k) {
      if (state[k] === 2) return; if (state[k] === 1) return;   // a cycle: break it here
      state[k] = 1; for (var q = 0; q < deps[k].length; q++) visit(deps[k][q]);
      state[k] = 2; out.push(items[k]);
    }
    for (i = 0; i < n; i++) visit(i);
    return out;
  }

  // colors
  function hexToHsl(hex) {
    var n = parseInt(hex.slice(1), 16), r = (n >> 16 & 255) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255;
    var mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, h = 0, s = 0, d = mx - mn;
    if (d) { s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h /= 6; }
    return [h, s, l];
  }
  function hslToHex(h, s, l) {
    h = ((h % 1) + 1) % 1; s = Math.max(0, Math.min(1, s)); l = Math.max(0, Math.min(1, l));
    function f(n) { var k = (n + h * 12) % 12, a = s * Math.min(l, 1 - l); var v = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); return ('0' + Math.round(v * 255).toString(16)).slice(-2); }
    return '#' + f(0) + f(8) + f(4);
  }
  var RAMPS = {};
  function ramp(hex) {
    if (RAMPS[hex]) return RAMPS[hex];
    var q = hexToHsl(hex), h = q[0], s = q[1], l = q[2];
    // shadows lean warm-purple and a touch more saturated; lights lean warm and soft
    var r = [hslToHex(h + .01, s * .92, l + (1 - l) * .32), hex, hslToHex(h - .02, Math.min(1, s * 1.08 + .04), l * .78), hslToHex(h - .04, Math.min(1, s * 1.1 + .06), l * .56)];
    RAMPS[hex] = r; return r;
  }

  function camera(o) {
    var cam = { zoom: o && o.zoom || 1, x: o && o.x || 0, y: o && o.y || 0, vw: 240, vh: 160,
      fit: function (vw, vh) { cam.vw = vw; cam.vh = vh; },
      toWorld: function (sx, sy) { return [cam.x + (sx - cam.vw / 2) / cam.zoom, cam.y + (sy - cam.vh / 2) / cam.zoom]; },
      toView: function (wx, wy) { return [(wx - cam.x) * cam.zoom + cam.vw / 2, (wy - cam.y) * cam.zoom + cam.vh / 2]; },
      clamp: function (l, t, r, b) { cam.x = Math.max(l, Math.min(r, cam.x)); cam.y = Math.max(t, Math.min(b, cam.y)); },
      src: function () { var w = cam.vw / cam.zoom, h = cam.vh / cam.zoom; return [cam.x - w / 2, cam.y - h / 2, w, h]; }
    };
    return cam;
  }

  window.StudioIso = { grid: grid, poly: poly, sort: sort, ramp: ramp, hsl: hexToHsl, hex: hslToHex, camera: camera };
})();
