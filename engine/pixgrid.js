// Studio pixel grid: draw sprites in code to the studio Quality bar (studio-bible/art-style.md, Craft and Quality bar).
// Lifted and tidied from Rushlight's approved reference code (mockups/36-sprite-upgrade-rough-v3.js, Nov 23, 2026).
// Knows nothing about any game: the game passes its colors.
//
//   StudioPix.grid(w, h, S, o)     a w × h drawing in design pixels, rasterized natively at scale S (so a 30 × 40 back view
//                                  at S = 2 is a real 60 × 80 drawing with 1 px outlines and smooth curves, not a doubled one).
//                                  o.outline: the dark outline color (default Peat #1c1814);
//                                  o.ox, o.oy: the starting origin
//     .org(x, y)                             move the drawing origin (design pixels): later calls draw shifted by it
//     .p(x, y, c) .r(x, y, w, h, c)          a design pixel / rectangle (each design pixel covers S native pixels)
//     .vol(cx, cy, rx, ry, ramp, o)          a shaded ellipse lit from the upper left; ramp is [light, base, shade, deep];
//                                            o.dark shifts it darker, o.fur tufts the edge, o.clump clumps texture in the shade
//     .tri([[x,y],[x,y],[x,y]], c)  .line(x0, y0, x1, y1, c)
//     .shape(test, color(u, v, X, Y))        fills every native pixel whose design-space center passes test(u, v)
//     .at(x, y)  .each(fn(X, Y, c, u, v))    read back a pixel (design coords) / walk the native pixels
//     .snap() .diff(snap)                    which native pixels changed since a snapshot (a Set of 'X,Y')
//     .rim(k)                                pull the upper-left edge toward light (before outline)
//     .outline(darken)                       the selective outline: the dark color on the shadow side and bottom,
//                                            darken(neighbor) on the lit side (studio Quality bar)
//     .tint(color, k)                        pull every pixel toward color
//     .draw(ctx, ox, oy, s)                  native pixels at an extra whole-number zoom s
//     .canvas(s)                             a new canvas of the drawing
//   StudioPix.mix(a, b, k)  StudioPix.ramp(base, lightTo, o)  StudioPix.LIGHT
(function () {
  var PEAT = '#1c1814';
  var L = (function () { var v = [-0.55, -0.62, 0.56], m = Math.hypot(v[0], v[1], v[2]); return v.map(function (x) { return x / m; }); })();
  function mix(a, b, k) {
    var A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16);
    var x = [A >> 16, (A >> 8) & 255, A & 255], y = [B >> 16, (B >> 8) & 255, B & 255];
    return '#' + x.map(function (v, i) { return Math.round(v + (y[i] - v) * k).toString(16).padStart(2, '0'); }).join('');
  }
  // the four-tone ramp: light, base, shade, deep (o.shade and o.deep: what shade and deep pull toward)
  function ramp(base, lightTo, o) { o = o || {}; return [mix(base, lightTo || '#f2ead6', .28), base, mix(base, o.shade || '#2a2030', .3), mix(base, o.deep || PEAT, .55)]; }

  function grid(w, h, S, o) {
    S = S || 1; o = o || {};
    var OX = o.ox || 0, OY = o.oy || 0;   // the drawing origin, in design pixels (org() moves it, so a pose can shift a part)
    var OUT = o.outline || PEAT, W = Math.round(w * S), H = Math.round(h * S), g = [];
    for (var y = 0; y < H; y++) g.push(new Array(W).fill(null));
    var lo = function (v) { return Math.floor(v * S + 1e-6); };
    var set = function (X, Y, c) { if (X >= 0 && Y >= 0 && X < W && Y < H && c) g[Y][X] = c; };
    var G = { w: w, h: h, S: S, W: W, H: H, g: g, OUT: OUT,
      org: function (x, y) { OX = x; OY = y; return G; },
      p: function (x, y, c) { if (!c) return; x = Math.round(x + OX); y = Math.round(y + OY); var x1 = Math.max(lo(x) + 1, lo(x + 1)), y1 = Math.max(lo(y) + 1, lo(y + 1));
        for (var Y = lo(y); Y < y1; Y++) for (var X = lo(x); X < x1; X++) set(X, Y, c); },
      clear: function (x, y) { x = Math.round(x + OX); y = Math.round(y + OY); var x1 = Math.max(lo(x) + 1, lo(x + 1)), y1 = Math.max(lo(y) + 1, lo(y + 1));
        for (var Y = lo(y); Y < y1; Y++) for (var X = lo(x); X < x1; X++) if (X >= 0 && Y >= 0 && X < W && Y < H) g[Y][X] = null; },
      r: function (x, y, ww, hh, c) { if (!c) return; x = Math.round(x + OX); y = Math.round(y + OY); ww = Math.round(ww); hh = Math.round(hh);
        for (var Y = lo(y); Y < Math.max(lo(y) + (hh > 0 ? 1 : 0), lo(y + hh)); Y++) for (var X = lo(x); X < Math.max(lo(x) + (ww > 0 ? 1 : 0), lo(x + ww)); X++) set(X, Y, c); },
      shape: function (test, color, box) {
        var b = box ? [box[0] + OX, box[1] + OY, box[2] + OX, box[3] + OY] : [0, 0, w, h], ox = OX, oy = OY;
        for (var Y = Math.max(0, lo(b[1])); Y < Math.min(H, Math.ceil(b[3] * S)); Y++) for (var X = Math.max(0, lo(b[0])); X < Math.min(W, Math.ceil(b[2] * S)); X++) {
          var u = (X + .5) / S - ox, v = (Y + .5) / S - oy; if (test(u, v, X, Y)) set(X, Y, typeof color === 'function' ? color(u, v, X, Y) : color); } },
      vol: function (cx, cy, rx, ry, rp, op) {
        op = op || {};
        G.shape(function (u, v) {
          var dx = (u - cx) / rx, dy = (v - cy) / ry, d = dx * dx + dy * dy, lim = 1;
          if (op.fur && d > .72) { var a = Math.atan2(dy, dx); lim = 1 + (Math.sin(a * op.fur) > .55 ? .12 : 0); }
          return d <= lim;
        }, function (u, v, X, Y) {
          var dx = (u - cx) / rx, dy = (v - cy) / ry, d = Math.min(1, dx * dx + dy * dy), z = Math.sqrt(Math.max(0, 1 - d));
          var n = dx * L[0] + dy * L[1] + z * L[2], i = n > .62 ? 0 : n > .3 ? 1 : n > .02 ? 2 : 3;
          var c = rp[Math.min(3, i + (op.dark || 0))];
          if (op.clump && i >= 2 && ((X * 3 + Y * 5) % 7 === 0)) c = rp[3];
          if (op.clump && i <= 1 && ((X * 5 + Y * 3) % 11 === 0)) c = rp[0];
          return c;
        }, [cx - rx - 1, cy - ry - 1, cx + rx + 2, cy + ry + 2]);
      },
      tri: function (pts, c) {
        var a = pts[0], b = pts[1], d = pts[2], s = function (p, q, r) { return (p[0] - r[0]) * (q[1] - r[1]) - (q[0] - r[0]) * (p[1] - r[1]); };
        // at S = 1 this is the reference's per-pixel test; at larger S each native pixel is tested, so edges stay 1 px fine
        G.shape(function (u, v) { var P = [u, v], d1 = s(P, a, b), d2 = s(P, b, d), d3 = s(P, d, a); return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0)); }, c,
          [Math.min(a[0], b[0], d[0]) - 1, Math.min(a[1], b[1], d[1]) - 1, Math.max(a[0], b[0], d[0]) + 2, Math.max(a[1], b[1], d[1]) + 2]);
      },
      line: function (x0, y0, x1, y1, c) {
        x0 += OX; x1 += OX; y0 += OY; y1 += OY;
        var n = Math.max(1, Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) * S)), t = Math.max(1, Math.ceil(S - .01));
        for (var i = 0; i <= n; i++) { var x = x0 + (x1 - x0) * i / n, y = y0 + (y1 - y0) * i / n;
          if (S === 1) { set(Math.round(x), Math.round(y), c); continue; }
          var X = Math.floor((x + .5) * S - t / 2 + 1e-6), Y = Math.floor((y + .5) * S - t / 2 + 1e-6);
          for (var j = 0; j < t; j++) for (var k = 0; k < t; k++) set(X + k, Y + j, c); }
      },
      at: function (x, y) { x += OX; y += OY; var X = Math.floor((x + .5) * S), Y = Math.floor((y + .5) * S); return (g[Y] && g[Y][X]) || null; },
      each: function (fn) { for (var Y = 0; Y < H; Y++) for (var X = 0; X < W; X++) fn(X, Y, g[Y][X], (X + .5) / S, (Y + .5) / S); },
      set: set,
      snap: function () { return g.map(function (r) { return r.slice(); }); },
      diff: function (sn) { var out = new Set(); for (var Y = 0; Y < H; Y++) for (var X = 0; X < W; X++) if (g[Y][X] !== sn[Y][X]) out.add(X + ',' + Y); return out; },
      outline: function (darken) {
        var o2 = [];
        for (var Y = 0; Y < H; Y++) for (var X = 0; X < W; X++) if (!g[Y][X]) {
          var nb = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(function (e) { return [e[0], e[1], g[Y + e[1]] && g[Y + e[1]][X + e[0]]]; })
            .filter(function (q) { return q[2] && q[2] !== OUT && !q[2].startsWith('#0'); });
          if (nb.length) { var lit = nb.every(function (q) { return q[0] === 1 || q[1] === 1; }); o2.push([X, Y, lit && darken ? darken(nb[0][2]) : OUT]); }
        }
        o2.forEach(function (q) { g[q[1]][q[0]] = q[2]; }); return G;
      },
      rim: function (k, to) {
        var pts = [];
        for (var Y = 1; Y < H - 1; Y++) for (var X = 1; X < W - 1; X++) { var v = g[Y][X]; if (!v || v === OUT) continue;
          if (X > W * .62 || Y > H * .82) continue; if (!g[Y][X - 1] || (!g[Y - 1][X] && X < W * .5)) pts.push([X, Y, v]); }
        pts.forEach(function (q) { g[q[1]][q[0]] = mix(q[2], to || '#fff4dc', k); }); return G;
      },
      tint: function (col, k) { for (var Y = 0; Y < H; Y++) for (var X = 0; X < W; X++) if (g[Y][X]) g[Y][X] = mix(g[Y][X], col, k); return G; },
      draw: function (ctx, ox, oy, s) { s = s || 1;
        for (var Y = 0; Y < H; Y++) { var X = 0; while (X < W) { var c = g[Y][X]; if (!c) { X++; continue; } var e = X; while (e < W && g[Y][e] === c) e++;
          ctx.fillStyle = c; ctx.fillRect(ox + X * s, oy + Y * s, (e - X) * s, s); X = e; } } },
      canvas: function (s) { s = s || 1; var c = document.createElement('canvas'); c.width = W * s; c.height = H * s; G.draw(c.getContext('2d'), 0, 0, s); return c; },
      // the native drawing as SVG, one path per color of run-length rows (for filing in an Asset Library page)
      svg: function (attrs, id) {
        var by = {}, order = [];
        for (var Y = 0; Y < H; Y++) { var X = 0; while (X < W) { var c = g[Y][X]; if (!c) { X++; continue; } var e = X; while (e < W && g[Y][e] === c) e++;
          if (!by[c]) { by[c] = []; order.push(c); } by[c].push('M' + X + ' ' + Y + 'h' + (e - X) + 'v1h-' + (e - X) + 'z'); X = e; } }
        var body = order.map(function (c) { return '<path fill="' + c + '" d="' + by[c].join('') + '"/>'; }).join('');
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" shape-rendering="crispEdges"' + (attrs || '') + '>' + (id ? '<g id="' + id + '">' + body + '</g>' : body) + '</svg>';
      }
    };
    return G;
  }
  // a grid from a drawn canvas (to touch up art that came as a picture)
  function fromCanvas(c, o) {
    var w = c.width, h = c.height, d = c.getContext('2d').getImageData(0, 0, w, h).data, G = grid(w, h, 1, o);
    for (var Y = 0; Y < h; Y++) for (var X = 0; X < w; X++) { var i = (Y * w + X) * 4; if (d[i + 3] >= 128) G.g[Y][X] = '#' + [0, 1, 2].map(function (k) { return d[i + k].toString(16).padStart(2, '0'); }).join(''); }
    return G;
  }
  window.StudioPix = { grid: grid, fromCanvas: fromCanvas, mix: mix, ramp: ramp, LIGHT: L, PEAT: PEAT };
})();
