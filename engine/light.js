// Studio light: night darkness with pools of light, and the low-sanity "sour" look, for any game with lamps and sanity.
// Knows nothing about any game: each game passes its own colors and its own lights, in canvas pixels.
// Black Lantern spec 005 (night and low-SAN mockup, Nov 21). Draw the scene first, then:
//
//   StudioLight.night(ctx, o)        darkens the whole canvas except pools of light, then warms each pool.
//     o.dark   '#0a0812'             the color of the dark            o.alpha  .78   how dark (0 to 1)
//     o.pools  [[x, y, r], ...]      lamps, the lantern: dark is cut away around each, and its ground is lit
//     o.glows  [[x, y, r, a], ...]   lit windows, carved pumpkins: they glow but don't light the ground
//     o.warm   '#d6a43a'             the color of the light on the ground and of the glows
//   StudioLight.sour(ctx, k, o)      sours the picture by k (0 = normal, 1 = full): shadows toward o.cyan,
//                                    warm light toward o.pink, the rest kept readable. Reads every pixel, so only call it when k > 0.
//   StudioLight.fade(f, on, now)     eases f.k toward 1 (on) or 0 over half a second; returns f.k. f = {} to start.
//   StudioLight.mix(a, b, k)         a number between a (k = 0) and b (k = 1), for radii that shrink as k grows
(function () {
  var FADE_MS = 500;
  var buf = null, bx = null;
  function layer(w, h) {
    if (!buf) { buf = document.createElement('canvas'); bx = buf.getContext('2d'); }
    if (buf.width !== w || buf.height !== h) { buf.width = w; buf.height = h; }
    return bx;
  }
  function rgb(h) { var n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
  function rgba(h, a) { var c = rgb(h); return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
  var onScreen = function (w, h, x, y, r) { return x + r > 0 && y + r > 0 && x - r < w && y - r < h; };

  function night(ctx, o) {
    var w = ctx.canvas.width, h = ctx.canvas.height, d = layer(w, h), pools = o.pools || [], glows = o.glows || [], warm = o.warm || '#d6a43a';
    d.globalCompositeOperation = 'source-over'; d.clearRect(0, 0, w, h);
    d.fillStyle = rgba(o.dark || '#0a0812', o.alpha == null ? 0.78 : o.alpha); d.fillRect(0, 0, w, h);
    // the mockup's hole: fully clear at the middle, mostly clear halfway out, gone at the edge
    d.globalCompositeOperation = 'destination-out';
    pools.forEach(function (p) {
      if (!onScreen(w, h, p[0], p[1], p[2])) return;
      var g = d.createRadialGradient(p[0], p[1], 0, p[0], p[1], p[2]);
      g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(0.55, 'rgba(0,0,0,.85)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      d.fillStyle = g; d.fillRect(p[0] - p[2], p[1] - p[2], p[2] * 2, p[2] * 2);
    });
    d.globalCompositeOperation = 'source-over';
    ctx.drawImage(buf, 0, 0);
    // light on top: a soft warm wash inside each pool, and the glows of windows and pumpkins
    ctx.globalCompositeOperation = 'lighter';
    pools.forEach(function (p) {
      if (!onScreen(w, h, p[0], p[1], p[2])) return;
      var g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], p[2] * 0.6);
      g.addColorStop(0, rgba(warm, 0.18)); g.addColorStop(1, rgba(warm, 0));
      ctx.fillStyle = g; ctx.fillRect(p[0] - p[2], p[1] - p[2], p[2] * 2, p[2] * 2);
    });
    glows.forEach(function (p) {
      if (!onScreen(w, h, p[0], p[1], p[2])) return;
      var g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], p[2]);
      g.addColorStop(0, rgba(warm, p[3] == null ? 0.3 : p[3])); g.addColorStop(1, rgba(warm, 0));
      ctx.fillStyle = g; ctx.fillRect(p[0] - p[2], p[1] - p[2], p[2] * 2, p[2] * 2);
    });
    ctx.globalCompositeOperation = 'source-over';
  }

  // The mockup's sour filter: the picture's brightness picks a color from a dark-to-cyan-to-pink ramp
  // (the ramp's top is SAN pink, its middle leans to SAN cyan), and the result is 62% ramp + 42% the original.
  var LUT = {}, lutKey = '';
  function ramp(o) {
    var key = (o.pink || '') + (o.cyan || '');
    if (key === lutKey) return LUT;
    lutKey = key;
    var P = rgb(o.pink || '#ff4fa3'), C = rgb(o.cyan || '#3ff0e8');
    // stops at brightness 0, 1/3, 2/3, 1 (as fractions of 255): near black, shadow cyan, dusky pink, SAN pink
    var stops = [[5, 13, 23], [C[0] * 0.28, C[1] * 0.26, C[2] * 0.33], [P[0] * 0.62, P[1] * 0.96, P[2] * 0.78], P];
    var r = new Uint8ClampedArray(256), g = new Uint8ClampedArray(256), b = new Uint8ClampedArray(256);
    for (var i = 0; i < 256; i++) {
      var t = i / 255 * 3, k = Math.min(2, Math.floor(t)), f = t - k, A = stops[k], B = stops[k + 1];
      r[i] = A[0] + (B[0] - A[0]) * f; g[i] = A[1] + (B[1] - A[1]) * f; b[i] = A[2] + (B[2] - A[2]) * f;
    }
    LUT = { r: r, g: g, b: b };
    return LUT;
  }
  function sour(ctx, k, o) {
    if (!(k > 0)) return;
    o = o || {};
    var w = ctx.canvas.width, h = ctx.canvas.height, img = ctx.getImageData(0, 0, w, h), d = img.data, L = ramp(o);
    var kd = Math.round(k * 256), ks = 256 - kd;  // fixed-point mix of soured and original
    for (var i = 0, n = d.length; i < n; i += 4) {
      var R = d[i], G = d[i + 1], B = d[i + 2], l = (R * 77 + G * 151 + B * 28) >> 8;
      var sr = L.r[l] * 0.62 + R * 0.42, sg = L.g[l] * 0.62 + G * 0.42, sb = L.b[l] * 0.62 + B * 0.42;
      if (sr > 255) sr = 255; if (sg > 255) sg = 255; if (sb > 255) sb = 255;
      d[i] = (R * ks + sr * kd) >> 8; d[i + 1] = (G * ks + sg * kd) >> 8; d[i + 2] = (B * ks + sb * kd) >> 8;
    }
    ctx.putImageData(img, 0, 0);
  }

  function fade(f, on, now) {
    var want = on ? 1 : 0;
    if (f.k == null) { f.k = want; f.t = now; return f.k; }
    var dt = Math.max(0, Math.min(250, now - (f.t || now))); f.t = now;
    if (f.k < want) f.k = Math.min(want, f.k + dt / FADE_MS); else if (f.k > want) f.k = Math.max(want, f.k - dt / FADE_MS);
    return f.k;
  }
  function mix(a, b, k) { return a + (b - a) * k; }

  window.StudioLight = { FADE_MS: FADE_MS, night: night, sour: sour, fade: fade, mix: mix };
})();
