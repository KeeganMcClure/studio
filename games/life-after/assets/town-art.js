// Life After town art: the two sections' ground, buildings and props, and the inside maps, drawn in code.
// Built to the approved street look (mockups/04-look-street-rough-v2, Keegan, Nov 23): stark, hard shadows to the
// lower right from a low sun in the upper left, four-tone ramps, flat shapes for cracks, weeds and furrows, no grain.
//   LA.townGround(S)          a canvas of the whole section (60 x 60 tiles): ground, flat dressing and every building.
//                             Also fills S.neon with the signs that glow at night (drawn again on top of the dark).
//   LA.townProp(g, S, p, sx, sy, now, o)   one prop (tree, car, sign, pump ...) with its foot at screen sx, sy
//   LA.townNeon(g, S, ox, oy, now, on)     the neon on buildings, lit at night, dead by day
//   LA.insideMap(S, place)    a canvas of a place's inside map
//   LA.crow(g, x, y, f), LA.dog(g, x, y, flip, f)   the things that move
(function () {
  var P = LA.P, R = LA.R, px = LA.px, vol = LA.vol, box = LA.box, mk = LA.mk, shadow = LA.shadow, ramp = LA.ramp, mix = LA.mix;
  var T = 16, Gc = null, Fc = null;
  function hsh(x, y, k) { var h = (x * 73856093) ^ (y * 19349663) ^ ((k || 0) * 83492791); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0); }
  function tuft(g, x, y, c) { px(g, c[1], x, y); px(g, c[0], x - 1, y + 1); px(g, c[1], x + 1, y + 1); R(g, c[2], x - 1, y + 2, 3, 1); }
  function crack(g, x, y, len, c, s) { var cx = x, cy = y; for (var i = 0; i < len; i++) { px(g, c, cx, cy); cx += 1; cy += ((i + s) % 3 === 0 ? 1 : ((i + s) % 5 === 0 ? -1 : 0)); } }
  function font(g, f, col) { g.font = f; g.textBaseline = 'top'; g.fillStyle = col; }
  var F6 = '6px "Press Start 2P"', F8 = '8px "Press Start 2P"';

  var SIDING = [P.stucco, P.tealw, P.ochre, ['#a8b8c0', '#8a9ca8', '#6e808c', '#56646e'], ['#c8b0a0', '#a8907e', '#8a7262', '#6a5648'], ['#e0dcd0', '#c8c4b8', '#a8a49a', '#86847a']];
  var ROOFS = [P.roof, ['#8a6a50', '#74583e', '#5e4630', '#463424'], ['#6e7a6a', '#5a6656', '#465244', '#343e34'], ['#9a5a44', '#7e4836', '#643a2c', '#4a2a20']];
  var CURT = ['#8a4028', '#46607e', '#a8984e'];
  var WOOD = ['#9a7448', '#84603a', '#6a4a2e', '#4e3622'];
  var METAL = ['#b8bcb4', '#9a9e96', '#7e827a', '#5e625c'];

  // ================= ground =================
  function ground(g, S, x, y) {
    var G = LAT.G, c = S.g[y * S.W + x], X = x * T, Y = y * T, h = hsh(x, y);
    var up = S.get(x, y - 1), dn = S.get(x, y + 1);
    switch (c) {
      case G.GRASS: case G.GRASS2: case G.BUILD: case G.TREE: case G.HEDGE: case G.FENCE: {
        var gr = c === G.GRASS2 ? [P.grass[1], P.grass[2], P.grass[3], '#383e2c'] : P.grass;
        R(g, gr[1], X, Y, T, T);
        if (h % 7 === 0) R(g, gr[2], X + (h >> 4) % 8, Y + (h >> 8) % 10, 6 + (h >> 12) % 5, 3);
        if (h % 11 === 1) R(g, gr[0], X + (h >> 5) % 10, Y + (h >> 9) % 12, 4, 2);
        for (var k = 0; k < 2; k++) if ((h >> (k * 5)) % 3 === 0) tuft(g, X + 2 + ((h >> (k * 7 + 3)) % 12), Y + 2 + ((h >> (k * 3 + 11)) % 11), gr);
        if (h % 41 === 3) { px(g, '#e8d070', X + 6, Y + 7); px(g, '#e8d070', X + 9, Y + 4); } // dandelions
        break;
      }
      case G.ROAD: {
        R(g, P.asph[2], X, Y, T, T);
        if (h % 5 === 0) crack(g, X + (h >> 4) % 6, Y + 3 + (h >> 9) % 9, 6 + (h >> 13) % 7, P.asph[3], h % 3);
        if (h % 23 === 2) { R(g, P.asph[3], X + 3, Y + 6, 7, 3); R(g, '#3e3c38', X + 4, Y + 7, 5, 1); } // a pothole
        if (h % 19 === 4) R(g, P.asph[1], X + 2, Y + 9, 9, 3); // a patch
        if (up !== G.ROAD) R(g, P.asph[1], X, Y, T, 1);
        break;
      }
      case G.WALK: {
        R(g, P.conc[1], X, Y, T, T); R(g, P.conc[2], X + 15, Y, 1, T); R(g, P.conc[2], X, Y + 15, T, 1); R(g, P.conc[0], X, Y, T, 1);
        if (h % 6 === 0) crack(g, X + 2, Y + 4 + (h >> 7) % 8, 8, P.conc[3], h % 3);
        if (h % 9 === 0) tuft(g, X + 15, Y + 6 + (h >> 5) % 7, P.grass);
        if (dn === G.ROAD) { R(g, P.conc[3], X, Y + 14, T, 2); }
        if (up === G.ROAD) { R(g, P.conc[0], X, Y, T, 2); }
        break;
      }
      case G.DRIVE: { R(g, P.conc[2], X, Y, T, T); R(g, P.conc[1], X, Y, T, 1); if (h % 3 === 0) { R(g, P.asph[3], X + 4, Y + 6, 7, 4); R(g, P.asph[2], X + 3, Y + 7, 9, 2); } if (h % 4 === 1) crack(g, X + 1, Y + 9, 10, P.conc[3], 1); break; }
      case G.LOT: {
        R(g, P.asph[1], X, Y, T, T);
        if (h % 6 === 0) crack(g, X + (h >> 4) % 6, Y + 3 + (h >> 9) % 9, 8, P.asph[3], h % 3);
        if (h % 13 === 0) { R(g, P.asph[3], X + 3, Y + 7, 9, 4); R(g, P.asph[2], X + 2, Y + 8, 11, 2); } // oil
        if (h % 17 === 5) tuft(g, X + 7, Y + 9, P.grass);
        if (up !== G.LOT && up !== -1) R(g, P.asph[0], X, Y, T, 1);
        break;
      }
      case G.GRAVEL: { R(g, P.dirt[1], X, Y, T, T); for (var p = 0; p < 4; p++) { var gx = X + ((h >> (p * 4)) % 14), gy = Y + ((h >> (p * 4 + 2)) % 14); R(g, p % 2 ? P.dirt[0] : P.dirt[2], gx, gy, 2, 1); } if (h % 5 === 0) tuft(g, X + 3 + (h >> 6) % 10, Y + 5, P.grass); break; }
      case G.FIELD: { R(g, P.dirt[2], X, Y, T, T); for (var fy = 2; fy < T; fy += 4) R(g, P.dirt[3], X, Y + fy, T, 1); if (h % 4 === 0) { R(g, '#a8a060', X + (h >> 5) % 12, Y + 1 + ((h >> 9) % 3) * 4, 2, 2); } break; }
      case G.SHOULDER: { R(g, P.dirt[1], X, Y, T, T); R(g, P.dirt[0], X, Y, T, 1); if (h % 3 === 0) px(g, P.dirt[3], X + (h >> 4) % 15, Y + 4 + (h >> 8) % 8); if (h % 4 === 1) tuft(g, X + 4 + (h >> 6) % 8, Y + 8, P.grass); break; }
      case G.PLAY: { R(g, '#5a5852', X, Y, T, T); if (h % 6 === 0) crack(g, X + 2, Y + 6, 9, '#46443e', h % 3); if (x % 6 === 0 && y % 3 === 0) { R(g, '#d8c08a', X + 2, Y + 2, 12, 1); R(g, '#d8c08a', X + 2, Y + 2, 1, 12); } if (x % 9 === 4 && y % 4 === 1) { R(g, '#c8503a', X + 3, Y + 3, 4, 4); R(g, '#5a5852', X + 4, Y + 4, 2, 2); } break; }
      case G.PATH: { R(g, P.grass[1], X, Y, T, T); for (var s = 0; s < 2; s++) { var sx = X + 3 + ((h >> (s * 3)) % 3), sy = Y + 1 + s * 8; R(g, P.conc[1], sx, sy, 9, 6); R(g, P.conc[0], sx, sy, 9, 1); R(g, P.conc[3], sx, sy + 5, 9, 1); } break; }
    }
    if (c === G.FENCE) {
      // a wooden picket fence, lit on the left
      for (var i = 0; i < T; i += 4) { R(g, '#c8b48a', X + i, Y + 2, 3, 11); R(g, '#a8946a', X + i + 2, Y + 2, 1, 11); px(g, '#e0d0a8', X + i + 1, Y + 1); }
      R(g, '#8a7650', X, Y + 5, T, 1); R(g, '#8a7650', X, Y + 10, T, 1); R(g, 'rgba(20,24,28,.3)', X + 2, Y + 13, T, 2);
      if (h % 5 === 0) { R(g, P.grass[1], X + 4 + (h >> 4) % 6, Y + 2, 3, 11); px(g, '#c8b48a', X + 5, Y + 12); }  // a missing picket
    }
    if (c === G.HEDGE) { shadow(g, X + 10, Y + 14, 9, 0.3); vol(g, X + 8, Y + 8, 8, 7, ['#7e8a4e', '#5e6a3a', '#46522e', '#323c22']); px(g, '#a8b06a', X + 4, Y + 4); px(g, '#a8b06a', X + 7, Y + 3); }
  }

  // ================= buildings =================
  function win(g, x, y, w, h, o) {
    o = o || {};
    R(g, '#1e2428', x - 1, y - 1, w + 2, h + 2);
    R(g, '#2a3234', x, y, w, h); R(g, '#46524e', x + 1, y + 1, Math.max(1, (w >> 1) - 1), 2); px(g, '#7e8a88', x + 1, y + 1);
    if (o.curt != null) { R(g, o.curt, x, y, 2, h); R(g, mix(o.curt, '#10141a', 0.3), x + w - 2, y, 2, h); }
    if (o.boarded) { R(g, WOOD[1], x - 1, y + 1, w + 2, 2); R(g, WOOD[2], x - 1, y + h - 3, w + 2, 2); R(g, WOOD[0], x - 1, y + 1, w + 2, 1); px(g, '#c8c4b4', x, y + 2); px(g, '#c8c4b4', x + w - 1, y + h - 2); }
    if (o.broken) { R(g, '#0e1012', x + 2, y + 2, 3, 3); px(g, '#9aa8a8', x + 4, y + 1); px(g, '#9aa8a8', x + 1, y + 4); }
    R(g, o.sill || '#c8c4b4', x - 1, y + h + 1, w + 2, 1);
  }
  function doorArt(g, x, y, col, o) {
    o = o || {};
    R(g, '#1e2428', x - 1, y - 1, 10, 16);
    if (o.open) { R(g, '#0e1012', x, y, 8, 15); R(g, col[2], x, y, 2, 15); }
    else { box(g, x, y, 8, 15, col); R(g, col[3], x + 2, y + 3, 4, 4); R(g, col[3], x + 2, y + 9, 4, 4); px(g, '#e8d08a', x + 6, y + 8); }
    R(g, P.conc[1], x - 2, y + 15, 12, 1);
  }
  function roofPitch(g, X, Y, W, H, K) {
    // a hip roof seen from above and in front: shingle rows, a ridge, a lit left hip and a shaded right hip
    R(g, K[1], X, Y, W, H);
    for (var r = Y + 3; r < Y + H - 2; r += 4) { R(g, K[2], X, r, W, 1); for (var c = X + ((r >> 2) % 2) * 5; c < X + W; c += 10) px(g, K[3], c, r - 1); }
    var inset = Math.min(10, H - 4);
    g.fillStyle = K[0]; g.beginPath(); g.moveTo(X, Y + H); g.lineTo(X + inset, Y + 2); g.lineTo(X + inset + 3, Y + 2); g.lineTo(X + 4, Y + H); g.fill();
    g.fillStyle = K[2]; g.beginPath(); g.moveTo(X + W, Y + H); g.lineTo(X + W - inset, Y + 2); g.lineTo(X + W - inset - 4, Y + 2); g.lineTo(X + W - 5, Y + H); g.fill();
    R(g, K[0], X + inset, Y + 1, W - inset * 2, 2); R(g, K[3], X + inset, Y + 3, W - inset * 2, 1);
    R(g, K[3], X, Y + H - 2, W, 2); R(g, 'rgba(0,0,0,.25)', X, Y + H, W, 2);
  }
  function roofFlat(g, X, Y, W, H, K, o) {
    R(g, K[1], X, Y, W, H); R(g, K[0], X, Y, W, 2); R(g, K[2], X, Y + H - 2, W, 2); R(g, K[0], X, Y, 2, H); R(g, K[3], X + W - 2, Y, 2, H);
    var h = hsh(X, Y);
    for (var i = 0; i < (o && o.units || 2); i++) {
      var ux = X + 10 + ((h >> (i * 5)) % Math.max(1, W - 30)), uy = Y + 4 + ((h >> (i * 3)) % Math.max(1, H - 14));
      R(g, 'rgba(20,24,28,.25)', ux + 3, uy + 3, 14, 9); box(g, ux, uy, 14, 9, METAL); R(g, METAL[3], ux + 2, uy + 2, 10, 1); R(g, METAL[3], ux + 2, uy + 5, 10, 1);
    }
    if (h % 3 === 0) { R(g, '#5e5e58', X + W - 20, Y + 5, 3, 8); R(g, '#7a7a72', X + W - 20, Y + 5, 1, 8); }
    if (h % 4 === 1) { R(g, '#4e5a5e', X + 16, Y + H - 10, 10, 4); R(g, '#7e8a8e', X + 16, Y + H - 10, 10, 1); } // a puddle on the roof
  }
  function siding(g, X, Y, W, H, K) { box(g, X, Y, W, H, [K[0], K[1], K[1], K[2]]); for (var r = Y + 3; r < Y + H - 2; r += 3) R(g, K[2], X, r, W, 1); R(g, K[0], X, Y, 2, H); R(g, K[3], X, Y + H - 2, W, 2); }
  function brick(g, X, Y, W, H) { R(g, P.brick[1], X, Y, W, H); for (var r = Y; r < Y + H; r += 3) { R(g, P.brick[2], X, r + 2, W, 1); for (var c = X + ((r / 3) % 2) * 3; c < X + W; c += 6) px(g, P.brick[2], c, r); } R(g, P.brick[0], X, Y, 2, H); R(g, P.brick[3], X + W - 2, Y, 2, H); }
  function sign(g, X, Y, W, text, bg, fg, f) { R(g, '#1e2428', X - 1, Y - 1, W + 2, 12); R(g, bg, X, Y, W, 10); font(g, f || F6, fg); var tw = g.measureText(text).width; g.fillText(text, X + Math.round((W - tw) / 2), Y + 2); return { x: X + Math.round((W - tw) / 2), y: Y + 2 }; }

  function building(g, S, b) {
    var X = b.x * T, Y = b.y * T, W = b.w * T, H = b.h * T, fh = b.face * T, fy = Y + H - fh, h = hsh(b.x, b.y, 7);
    // shadow to the lower right
    g.fillStyle = 'rgba(20,24,28,.32)'; g.beginPath(); g.moveTo(X + W, Y + 6); g.lineTo(X + W + 8, Y + 12); g.lineTo(X + W + 8, Y + H + 5); g.lineTo(X + 8, Y + H + 5); g.lineTo(X + 4, Y + H); g.lineTo(X + W, Y + H); g.fill();
    var st = b.style, doors = b.doors.map(function (pi) { return S.places[pi].door; });
    var isDoor = function (tx) { return doors.some(function (d) { return d.x === tx; }); };
    if (st === 'ranch' || st === 'two' || st === 'trailer') {
      var K = SIDING[b.col || 0], RF = ROOFS[b.roofCol || 0];
      if (st === 'trailer') {
        roofFlat(g, X, Y, W, H - fh, ['#c8ccc4', '#a8aca4', '#8a8e86', '#6e726a'], { units: 1 });
        box(g, X, fy, W, fh, ['#e8e4d8', '#d8d4c8', '#c8c4b8', '#a8a498']); for (var rr = fy + 2; rr < fy + fh - 4; rr += 2) R(g, '#c8c4b8', X, rr, W, 1);
        R(g, K[1], X, fy + 10, W, 3); R(g, K[2], X, fy + 12, W, 1);
        R(g, '#6e6a5e', X, fy + fh - 5, W, 5); for (var sk = X; sk < X + W; sk += 4) R(g, '#5a564c', sk, fy + fh - 5, 1, 5);
      } else {
        roofPitch(g, X, Y, W, H - fh, RF);
        siding(g, X, fy, W, fh, K);
        R(g, '#5e5a50', X, fy, W, 2); R(g, 'rgba(20,24,28,.3)', X, fy + 2, W, 3);   // the eave and its shadow
      }
      var gL = b.garage === 'left', gR = b.garage === 'right';
      for (var tx = b.x; tx < b.x + b.w; tx++) {
        var lx = tx * T;
        if (b.garage && (gL ? tx < b.x + 3 : tx >= b.x + b.w - 3)) continue;
        if (isDoor(tx)) { doorArt(g, lx + 4, fy + fh - 17, ramp(['#8a4028', '#46605e', '#5e6e7e', '#7e6a4e', '#6a3424'][h % 5])); continue; }
        var rows = st === 'two' ? [fy + 5, fy + 26] : [fy + (st === 'trailer' ? 4 : 9)];
        rows.forEach(function (wy, ri) {
          if ((tx + ri) % 2 === 1 && st !== 'two') return;
          var bd = b.boarded >= 0 && (tx + ri + b.boarded) % 3 === 0;
          win(g, lx + 3, wy, 10, st === 'trailer' ? 6 : 9, { curt: b.curtains === 0 ? null : CURT[(tx + b.curtains) % 3], boarded: bd, broken: !bd && hsh(tx, ri, 3) % 5 === 0 });
        });
      }
      if (b.garage) {
        var gx = gL ? X : X + W - 3 * T, gw = 3 * T;
        R(g, '#3a3c38', gx + 3, fy + 6, gw - 6, fh - 6); box(g, gx + 4, fy + 7, gw - 8, fh - 8, METAL);
        for (var pr = fy + 10; pr < fy + fh - 2; pr += 5) R(g, METAL[3], gx + 4, pr, gw - 8, 1);
        if (h % 3 === 0) { R(g, '#1e2224', gx + 6, fy + fh - 5, gw - 14, 4); }    // pried up at the bottom
      }
      // porch light, gutter, house number
      R(g, '#3a3c38', X + 2, fy + 1, W - 4, 1);
      var d0 = doors[0]; if (d0) { R(g, '#c8c4b4', d0.x * T + 13, fy + fh - 15, 2, 3); font(g, F6, '#1e1a16'); }
      if (st === 'two') { R(g, K[2], X, fy + 22, W, 1); }
    } else if (st === 'school') {
      roofFlat(g, X, Y, W, H - fh, P.roof, { units: 3 });
      brick(g, X, fy, W, fh);
      S.signs.push(sign(g, X + W / 2 - 54, fy + 2, 108, 'LINCOLN ELEMENTARY', '#e8e4d8', '#2a3a5a'));
      for (var sx = b.x; sx < b.x + b.w; sx++) { if (isDoor(sx)) continue; win(g, sx * T + 3, fy + 16, 10, 9, { sill: '#e8e4d8', broken: hsh(sx, 2, 4) % 4 === 0 }); }
      var sd = doors[0]; R(g, '#1e2428', sd.x * T - 3, fy + 14, 22, 18); box(g, sd.x * T - 2, fy + 15, 10, 17, ['#8ab0b8', '#5a8088', '#46646a', '#344a4e']); box(g, sd.x * T + 8, fy + 15, 10, 17, ['#8ab0b8', '#5a8088', '#46646a', '#344a4e']); R(g, '#c8c4b4', sd.x * T - 4, fy + 31, 24, 1);
    } else if (st === 'church') {
      var ch = ['#f0ece0', '#e0dcd0', '#c8c4b8', '#a8a49a'];
      roofPitch(g, X, Y + 12, W, H - fh - 12, ['#5e5e66', '#4e4e56', '#3e3e46', '#2e2e36']);
      // the steeple and its cross
      var cx = X + W / 2;
      box(g, cx - 8, Y + 6, 16, H - fh - 4, ch); g.fillStyle = '#3e3e46'; g.beginPath(); g.moveTo(cx - 10, Y + 8); g.lineTo(cx, Y - 14); g.lineTo(cx + 10, Y + 8); g.fill();
      g.fillStyle = '#5e5e66'; g.beginPath(); g.moveTo(cx - 10, Y + 8); g.lineTo(cx, Y - 14); g.lineTo(cx - 2, Y + 8); g.fill();
      R(g, '#c8c4b4', cx - 1, Y - 24, 2, 11); R(g, '#c8c4b4', cx - 4, Y - 21, 8, 2); R(g, '#1e2428', cx - 3, Y + 12, 6, 8); vol(g, cx, Y + 12, 3, 3, ['#3a3e42', '#2a2e30', '#1e2224', '#121416']);
      siding(g, X, fy, W, fh, ch);
      for (var cw = b.x; cw < b.x + b.w; cw++) {
        if (Math.abs(cw - doors[0].x) <= 1) continue;
        var wx = cw * T + 4; R(g, '#1e2428', wx - 1, fy + 10, 10, 20); R(g, '#46526e', wx, fy + 12, 8, 17); vol(g, wx + 4, fy + 12, 4, 3, ['#8a4a5a', '#6a3a4a', '#46526e', '#46526e']); R(g, '#c8a050', wx + 3, fy + 18, 2, 6); R(g, '#8a2a1e', wx + 1, fy + 22, 6, 2);
      }
      var dd = doors[0]; R(g, '#1e2428', dd.x * T - 3, fy + 22, 22, 26); box(g, dd.x * T - 2, fy + 23, 10, 25, ramp('#8a2a1e')); box(g, dd.x * T + 8, fy + 23, 10, 25, ramp('#8a2a1e'));
      vol(g, dd.x * T + 8, fy + 23, 10, 5, ch, function (x, y) { return y < fy + 23; });
      R(g, P.conc[1], dd.x * T - 6, fy + 47, 28, 1);
    } else if (st === 'shed') {
      roofPitch(g, X, Y, W, H - fh, ROOFS[1]); box(g, X, fy, W, fh, WOOD); for (var pl = X + 4; pl < X + W; pl += 5) R(g, WOOD[3], pl, fy, 1, fh);
      doorArt(g, doors[0].x * T + 4, fy + fh - 17, ramp('#6e7a6a'));
    } else if (st === 'motel') {
      roofFlat(g, X, Y, W, H - fh, P.roof, { units: 4 });
      R(g, P.ochre[1], X, fy, W, fh); R(g, P.ochre[0], X, fy, 2, fh); R(g, P.ochre[2], X, fy, W, 2);
      R(g, P.tealw[1], X, fy, W, 4); R(g, P.tealw[0], X, fy, W, 1); R(g, P.tealw[3], X, fy + 4, W, 1);
      b.doors.forEach(function (pi, n) {
        var d = S.places[pi].door, dx = d.x * T + 3;
        box(g, dx, fy + 10, 10, 22, P.tealw); R(g, '#1e2428', dx, fy + 10, 10, 1); px(g, '#e8d08a', dx + 8, fy + 21);
        font(g, F6, '#c8d4cc'); g.fillText(String(n + 1), dx + 3, fy + 12);
        var wx = dx + 13; if (n < 8) win(g, wx, fy + 12, 6, 7, { boarded: hsh(n, 9) % 4 === 0, sill: P.ochre[3] });
      });
      // the office at the end, its door boarded
      var ox = X + W - 3 * T + 4; R(g, '#46524e', ox, fy + 9, 36, 14); R(g, '#7e8a88', ox + 1, fy + 10, 10, 2); font(g, F6, '#e8d0a0'); g.fillText('OFFICE', ox + 1, fy + 25);
      box(g, ox + 26, fy + 10, 10, 22, P.tealw); R(g, WOOD[1], ox + 24, fy + 14, 14, 2); R(g, WOOD[1], ox + 24, fy + 24, 14, 2);
      S.signs.push(sign(g, X + 40, fy - 13, 62, 'STARLITE', '#2e3638', '#5a4a30', F8));
      S.neon.push({ x: X + 40 + 3, y: fy - 11, text: 'STARLITE', f: F8, col: P.amber, flicker: 1 });
      R(g, P.conc[1], X, Y + H - 1, W, 1);
      box(g, X + W - 14, fy + 12, 12, 20, ['#d8d8d0', '#bcbcb4', '#9a9a92', '#74746e']); R(g, '#46647e', X + W - 12, fy + 15, 8, 4);
    } else {
      // a store on the strip: flat roof, a fascia with its name, glass in front
      var KK = { gas: P.tealw, barn: ramp('#a83e2e'), truck: ramp('#5e6e7e'), bun: ramp('#c8a030'), video: ramp('#3a5a9a'), liquor: ramp('#3e7a5a'), pawn: ramp('#8a7650'), parts: ramp('#a83e2e'), suds: ramp('#5a9aa8') }[st] || P.tealw;
      roofFlat(g, X, Y, W, H - fh, P.roof, { units: Math.max(1, b.w >> 3) });
      var wall = st === 'barn' ? ['#d8d4c4', '#c8c4b4', '#a8a494', '#86847a'] : st === 'truck' ? P.stucco : P.ochre;
      R(g, wall[1], X, fy, W, fh); R(g, wall[0], X, fy, 2, fh); R(g, wall[3], X + W - 2, fy, 2, fh);
      R(g, KK[1], X, fy, W, 10); R(g, KK[0], X, fy, W, 1); R(g, KK[3], X, fy + 9, W, 1);
      var tcol = st === 'barn' ? '#f0ece0' : '#2a2620', name = b.sign || '';
      font(g, F6, tcol); var tw = g.measureText(name).width;
      if (tw > W - 6) { name = name.split(' ')[0]; tw = g.measureText(name).width; }
      g.fillText(name, X + Math.round((W - tw) / 2), fy + 2);
      if (b.neon) S.neon.push({ x: X + Math.round((W - tw) / 2), y: fy + 2, text: name, f: F6, col: st === 'gas' ? P.cyan : st === 'bun' ? '#ff6a4a' : P.amber });
      // glass front with things in it, and the door
      for (var gx2 = b.x; gx2 < b.x + b.w; gx2++) {
        var lx2 = gx2 * T;
        if (isDoor(gx2)) { R(g, '#1e2428', lx2 + 1, fy + 11, 14, fh - 11); box(g, lx2 + 2, fy + 12, 12, fh - 13, ['#6e8a90', '#4e6a70', '#3a5054', '#2a3a3e']); R(g, '#c8c4b4', lx2 + 7, fy + 12, 1, fh - 13); continue; }
        var gy = fy + 13; R(g, '#1e2428', lx2, gy - 1, T, fh - 16); R(g, '#34484c', lx2 + 1, gy, T - 2, fh - 18);
        var hh = hsh(gx2, b.y, 5);
        if (hh % 3 === 0) { R(g, '#0e1012', lx2 + 3, gy + 2, 6, 5); px(g, '#9aa8a8', lx2 + 8, gy + 1); }   // broken
        else { R(g, '#5e7478', lx2 + 2, gy + 1, 4, 2); R(g, ['#c8503a', '#e8c88a', '#5e7aa0'][hh % 3], lx2 + 6, gy + fh - 24, 6, 4); }
        if (hh % 5 === 1) { R(g, '#e8e4d8', lx2 + 4, gy + 3, 7, 5); font(g, '5px "Press Start 2P"', '#8a2a1e'); }
      }
      R(g, P.conc[1], X, Y + H - 1, W, 1);
    }
  }

  // ================= the whole section =================
  LA.townGround = function (S) {
    var c = mk(S.W * T, S.H * T), g = c[1];
    S.neon = []; S.signs = [];
    for (var y = 0; y < S.H; y++) for (var x = 0; x < S.W; x++) ground(g, S, x, y);
    var G = LAT.G;
    // the center line on the highway and the bay lines in the lots
    if (S.highway != null) { for (var lx = 4; lx < S.W * T; lx += 26) R(g, '#d8c08a', lx, S.highway * T + 15, 13, 2); }
    for (var y2 = 0; y2 < S.H; y2++) for (var x2 = 0; x2 < S.W; x2++) {
      if (S.get(x2, y2) === G.LOT && S.get(x2, y2 - 1) !== G.LOT && x2 % 3 === 0) for (var k = 0; k < 2; k++) { if (S.get(x2, y2 + k) === G.LOT) R(g, '#c8c0a0', x2 * T, (y2 + k) * T + (k ? 0 : 3), 1, k ? 8 : 13); }
    }
    // flat props first (gardens, pools, a tire), then the buildings
    S.props.forEach(function (p) { if (FLAT[p.k]) FLAT[p.k](g, p, p.x * T, p.y * T); });
    S.buildings.forEach(function (b) { building(g, S, b); });
    // the canopy's name is neon too (the canopy itself is drawn over you each frame)
    S.props.forEach(function (p) { if (p.k === 'canopy') { g.font = F6; var tw = g.measureText('STAR FUEL').width; S.neon.push({ x: p.x * T + Math.round((p.w * T - tw) / 2), y: p.y * T + 5, text: 'STAR FUEL', f: F6, col: P.cyan }); } });
    return c[0];
  };
  var FLAT = LA.townFlat = {
    garden: function (g, p, X, Y) { R(g, P.dirt[2], X + 1, Y + 3, 30, 11); for (var i = 0; i < 6; i++) { R(g, '#6a6a3a', X + 4 + i * 5, Y + 4, 1, 7); px(g, '#8a7a3a', X + 3 + i * 5, Y + 5); } R(g, P.dirt[3], X + 1, Y + 13, 30, 1); },
    pool: function (g, p, X, Y) { vol(g, X + 14, Y + 9, 13, 6, ['#7ab0c8', '#5a90b0', '#467890', '#345a6e']); vol(g, X + 14, Y + 9, 10, 4, ['#4e6a5a', '#46604e', '#3a5242', '#2e4236']); R(g, '#9ac8d8', X + 4, Y + 5, 6, 1); },
    tire: function (g, p, X, Y) { vol(g, X + 8, Y + 9, 6, 4, ['#3e3e3e', '#2a2a2a', '#1e1e1e', '#121212']); vol(g, X + 8, Y + 9, 3, 2, P.grass); },
    weeds: function (g, p, X, Y) { for (var i = 0; i < 5; i++) { var c = P.grass[i % 2 ? 0 : 2], hh = 4 + ((p.v + i) % 3) * 2; R(g, c, X + 3 + i * 2, Y + 12 - hh, 1, hh); } if (p.v % 2) { px(g, '#d8c08a', X + 6, Y + 4); px(g, '#d8c08a', X + 10, Y + 5); } R(g, P.grass[3], X + 2, Y + 12, 11, 1); },
    leaves: function (g, p, X, Y) { var c = ['#a8783a', '#c8a050', '#8a5e2e']; for (var i = 0; i < 7; i++) { var hh = hsh(p.x, p.y, i); R(g, c[hh % 3], X + hh % 13, Y + (hh >> 4) % 13, 2, 1); } },
    rock: function (g, p, X, Y) { R(g, 'rgba(20,24,28,.3)', X + 6, Y + 10, 8, 3); vol(g, X + 8, Y + 9, 4 + p.v % 2, 3, P.conc); },
    flowers: function (g, p, X, Y) { for (var i = 0; i < 4; i++) { R(g, P.grass[2], X + 3 + i * 3, Y + 8, 1, 5); px(g, ['#e8d070', '#e8e4d8', '#c8503a', '#a87aa8'][(p.v + i) % 4], X + 3 + i * 3, Y + 7); } },
    ruin: function (g, p, X, Y) { var W = p.w * 16, H = p.h * 16; R(g, '#2a2826', X + 4, Y + 4, W - 8, 3); R(g, '#3a3632', X + 4, Y + 4, 3, H - 8); R(g, '#2a2826', X + W - 7, Y + 10, 3, H - 16); for (var i = 0; i < 9; i++) { var hh = hsh(p.x, i, 4); R(g, ['#2a2826', '#4e4a44', '#6a4a2e'][hh % 3], X + 8 + hh % (W - 16), Y + 8 + (hh >> 5) % (H - 16), 3 + hh % 4, 2); } tuft(g, X + 12, Y + 20, P.grass); tuft(g, X + W - 14, Y + 30, P.grass); },
    sandbox: function (g, p, X, Y) { box(g, X + 1, Y + 2, 28, 12, WOOD); R(g, '#d8c08a', X + 3, Y + 4, 24, 8); R(g, '#c8503a', X + 8, Y + 6, 4, 3); px(g, '#e8d0a0', X + 16, Y + 7); }
  };

  // ================= props drawn in order of depth =================
  var cache = {};
  function cached(key, w, h, fn) { if (cache[key]) return cache[key]; var c = mk(w, h); fn(c[1]); return (cache[key] = c[0]); }
  var TREES = [['#7e8a4e', '#5e6a3a', '#46522e', '#323c22'], ['#6e7a4a', '#56643e', '#424e32', '#303a26'], ['#8a8a4a', '#6e703a', '#54562e', '#3c3e22'], ['#a8783a', '#8a5e2e', '#6a4624', '#4a321a']];
  LA.treeColors = TREES;
  function treeSprite(v, big, season) {
    var col = season === 'Fall' && v % 2 ? TREES[3] : season === 'Winter' ? null : TREES[v % 3];
    return cached('tree' + v + big + season, 40, 48, function (g) {
      var cx = 20, by = 44, s = big ? 1.25 : 1;
      R(g, '#4e3622', cx - 2, by - 16, 4, 16); R(g, '#6a4a2e', cx - 2, by - 16, 1, 16); R(g, '#34241a', cx + 1, by - 16, 1, 16);
      if (!col) {   // bare in winter
        g.strokeStyle = '#4e3622'; g.lineWidth = 1; g.beginPath();
        [[-9, -30], [8, -32], [-4, -38], [11, -24], [-12, -22]].forEach(function (b) { g.moveTo(cx, by - 14); g.lineTo(cx + b[0] * s, by + b[1] * s); }); g.stroke();
        return;
      }
      [[-6, -22, 8, 7], [6, -21, 8, 7], [0, -30, 9, 8], [-1, -20, 10, 7]].forEach(function (b) { vol(g, cx + b[0] * s, by + b[1] * s, b[2] * s, b[3] * s, col); });
      px(g, mix(col[0], '#fff4e0', 0.3), cx - 7, by - 30 * s); px(g, mix(col[0], '#fff4e0', 0.3), cx - 4, by - 33 * s);
    });
  }
  LA.townProp = function (g, S, p, sx, sy, now, o) {
    o = o || {}; var night = o.night, k = p.k, t = now / 1000;
    if (k === 'tree') { shadow(g, sx + 12, sy - 1, p.big ? 13 : 10, 0.34); g.drawImage(treeSprite(p.v, p.big, o.season), sx - 12, sy - 44); return; }
    if (k === 'car') {
      shadow(g, sx + 26, sy - 1, 26, 0.34);
      var key = 'car' + p.col.join() + p.wagon + p.wreck, c = cache[key] || (cache[key] = LA.car({ len: p.len, ramp: p.col, wagon: p.wagon, wreck: p.wreck }));
      g.drawImage(c, sx - 1, sy - 26); return;
    }
    if (k === 'body') {
      var bc = cached('body' + p.v + p.flip, 22, 12, function (b) {
        var tops = [P.mail, P.red, P.coverall, P.navy, ramp('#a8984e'), ramp('#7e3e3e')], top = tops[p.v % 6], skin = [P.skin, P.skinB, LA.ramp('#c8926a')][p.v % 3];
        R(b, P.blood, 2, 8, 16, 3); R(b, P.bloodD, 4, 10, 10, 1);
        box(b, 6, 4, 9, 5, top); box(b, 15, 5, 5, 3, P.jeans); R(b, P.boot[2], 19, 5, 2, 3); vol(b, 4, 6, 3, 3, skin); R(b, P.hairD[1], 1, 4, 3, 3); box(b, 8, 2, 4, 2, top); px(b, skin[1], 12, 2);
        LA.outline({ width: 22, height: 12 }, b);
      });
      shadow(g, sx + 9, sy - 3, 9, 0.25);
      if (p.flip) { g.save(); g.translate(sx + 18, 0); g.scale(-1, 1); g.drawImage(bc, 0, sy - 12); g.restore(); } else g.drawImage(bc, sx - 3, sy - 12);
      return;
    }
    if (k === 'mailbox') { shadow(g, sx + 9, sy - 1, 5, 0.3); R(g, '#6a5a40', sx + 7, sy - 12, 2, 12); box(g, sx + 2, sy - 18, 12, 7, [['#c8ccd0', '#a8acb0', '#868a8e', '#5e6266'], P.red, P.navy, ['#2a2a2a', '#1e1e1e', '#141414', '#0a0a0a']][p.v % 4]); if (p.v % 2) R(g, '#c8503a', sx + 14, sy - 20, 1, 5); return; }
    if (k === 'bins') { shadow(g, sx + 9, sy - 1, 7, 0.3); box(g, sx + 2, sy - 14, 6, 13, ['#5e7a5a', '#46604a', '#344a3a', '#24342a']); box(g, sx + 9, sy - 12, 6, 11, ['#4a524e', '#363c3a', '#262a28', '#181a1a']); vol(g, sx + 6, sy - 2, 4, 2, ['#4a524e', '#363c3a', '#262a28', '#181a1a']); px(g, '#e8e4d8', sx + 3, sy - 3); return; }
    if (k === 'flag') { shadow(g, sx + 9, sy - 1, 4, 0.3); R(g, '#c8c8c0', sx + 7, sy - 44, 2, 44); px(g, '#e8e8e0', sx + 7, sy - 45); var wv = Math.round(Math.sin(t * 3) * 1.5); for (var fi = 0; fi < 12; fi++) { var fyy = sy - 43 + Math.round(Math.sin(t * 3 + fi * 0.5) * 1); R(g, fi < 5 ? '#3a4a7a' : '#e8e4d8', sx + 9 + fi, fyy, 1, 7); if (fi >= 5) { px(g, '#b4382e', sx + 9 + fi, fyy + 1); px(g, '#b4382e', sx + 9 + fi, fyy + 3); px(g, '#b4382e', sx + 9 + fi, fyy + 5); } } return; }
    if (k === 'swing') { shadow(g, sx + 18, sy - 1, 14, 0.3); R(g, '#c8503a', sx + 2, sy - 24, 2, 24); R(g, '#c8503a', sx + 28, sy - 24, 2, 24); R(g, '#a83e2e', sx + 2, sy - 24, 28, 2); for (var si = 0; si < 2; si++) { var sw = Math.round(Math.sin(t * 1.6 + si * 2) * 2); R(g, '#868a8e', sx + 9 + si * 10 + sw, sy - 22, 1, 13); R(g, '#868a8e', sx + 13 + si * 10 + sw, sy - 22, 1, 13); R(g, '#2a2a2a', sx + 9 + si * 10 + sw, sy - 9, 5, 2); } return; }
    if (k === 'bench') { shadow(g, sx + 12, sy - 1, 10, 0.3); box(g, sx + 1, sy - 12, 22, 3, WOOD); box(g, sx + 1, sy - 7, 22, 3, WOOD); R(g, '#2a2a2a', sx + 3, sy - 4, 2, 4); R(g, '#2a2a2a', sx + 19, sy - 4, 2, 4); return; }
    if (k === 'fountain') { shadow(g, sx + 9, sy - 1, 5, 0.3); box(g, sx + 5, sy - 12, 6, 12, P.conc); vol(g, sx + 8, sy - 13, 5, 2, P.conc); R(g, '#5a7a8a', sx + 6, sy - 14, 4, 1); return; }
    if (k === 'clothes') { shadow(g, sx + 18, sy - 1, 13, 0.25); R(g, '#868a8e', sx + 2, sy - 22, 1, 22); R(g, '#868a8e', sx + 29, sy - 22, 1, 22); R(g, '#c8c8c0', sx + 2, sy - 21, 28, 1); [['#e8e4d8', 6, 8], ['#5e7aa0', 14, 6], ['#c8503a', 22, 5]].forEach(function (c, i) { var fl = Math.round(Math.sin(t * 2.4 + i) * 1.4); R(g, c[0], sx + c[1] + fl, sy - 20, c[2], 9 + i % 2 * 2); R(g, mix(c[0], '#10141a', 0.3), sx + c[1] + c[2] - 1 + fl, sy - 20, 1, 9); }); return; }
    if (k === 'grill') { shadow(g, sx + 8, sy - 1, 5, 0.3); vol(g, sx + 8, sy - 9, 5, 4, ['#3e3e3e', '#2a2a2a', '#1e1e1e', '#121212']); R(g, '#2a2a2a', sx + 5, sy - 6, 1, 6); R(g, '#2a2a2a', sx + 11, sy - 6, 1, 6); return; }
    if (k === 'doghouse') { shadow(g, sx + 10, sy - 1, 8, 0.3); box(g, sx + 2, sy - 13, 14, 12, ramp('#8a4028')); g.fillStyle = '#5e4630'; g.beginPath(); g.moveTo(sx, sy - 12); g.lineTo(sx + 9, sy - 19); g.lineTo(sx + 18, sy - 12); g.fill(); R(g, '#1e1a16', sx + 6, sy - 9, 6, 8); R(g, '#868a8e', sx + 15, sy - 3, 5, 1); return; }
    if (k === 'stone') { shadow(g, sx + 9, sy - 1, 5, 0.3); box(g, sx + 4, sy - 11 + (p.v % 2) * 2, 8, 10 - (p.v % 2) * 2, P.conc); vol(g, sx + 8, sy - 11 + (p.v % 2) * 2, 4, 2, P.conc, function (x, y) { return y < sy - 10 + (p.v % 2) * 2; }); if (p.v === 2) { R(g, P.conc[3], sx + 7, sy - 9, 2, 6); R(g, P.conc[3], sx + 5, sy - 8, 6, 2); } return; }
    if (k === 'board') { shadow(g, sx + 9, sy - 1, 7, 0.3); R(g, '#4e3622', sx + 2, sy - 8, 2, 8); R(g, '#4e3622', sx + 13, sy - 8, 2, 8); box(g, sx, sy - 20, 17, 12, ['#3a4a3a', '#2e3e2e', '#243424', '#1a281a']); font(g, '5px "Press Start 2P"', '#e8e4d8'); g.fillText('JOHN', sx + 2, sy - 18); g.fillText('3:16', sx + 2, sy - 12); return; }
    if (k === 'pump') { shadow(g, sx + 9, sy - 1, 6, 0.3); box(g, sx + 3, sy - 18, 10, 17, ['#c8c4b4', '#a8a494', '#8a8676', '#64625a']); R(g, '#2a2e30', sx + 5, sy - 15, 6, 4); R(g, '#c8503a', sx + 5, sy - 9, 6, 2); R(g, '#1e1a16', sx + 13, sy - 10, 1, 7); return; }
    if (k === 'ice') { shadow(g, sx + 9, sy - 1, 7, 0.3); box(g, sx + 1, sy - 14, 14, 13, ['#e8e8e0', '#c8ccc4', '#a8aca4', '#7e827c']); font(g, F6, '#46647e'); g.fillText('ICE', sx + 3, sy - 11); return; }
    if (k === 'carts') { shadow(g, sx + 16, sy - 1, 12, 0.25); for (var ci = 0; ci < 3; ci++) { var cx0 = sx + 2 + ci * 4; R(g, '#9aa0a0', cx0, sy - 12, 14, 1); for (var cj = 0; cj < 14; cj += 3) R(g, '#9aa0a0', cx0 + cj, sy - 12, 1, 8); R(g, '#9aa0a0', cx0, sy - 4, 14, 1); } R(g, '#1a1a1a', sx + 4, sy - 2, 2, 2); R(g, '#1a1a1a', sx + 22, sy - 2, 2, 2); return; }
    if (k === 'rig') {
      shadow(g, sx + 48, sy - 1, 50, 0.34);
      var rc = cached('rig', 98, 40, function (b) {
        box(b, 2, 4, 68, 26, ['#e8e4d8', '#d0ccc0', '#b0aca0', '#8a867a']); R(b, '#c8503a', 2, 14, 68, 3); font(b, F6, '#8a2a1e'); b.fillText('HAULWAY', 12, 7);
        box(b, 72, 10, 22, 20, ['#5a7a9a', '#46647e', '#344c62', '#243646']); R(b, '#9ab8c0', 78, 12, 12, 7); R(b, '#4e6e78', 78, 16, 12, 3); R(b, '#c8ccc8', 92, 22, 3, 6); R(b, '#2a2e30', 68, 26, 6, 4);
        [12, 26, 58, 82].forEach(function (wx) { b.fillStyle = '#1e1e20'; b.beginPath(); b.ellipse(wx, 31, 5, 5, 0, 0, 7); b.fill(); R(b, '#8a8e90', wx - 1, 30, 2, 2); });
        LA.outline({ width: 98, height: 40 }, b);
      });
      g.drawImage(rc, sx - 2, sy - 38); return;
    }
    if (k === 'pole') { shadow(g, sx + 10, sy - 1, 5, 0.3); box(g, sx + 6, sy - 46, 4, 46, ['#9aa0a0', '#7e8484', '#626868', '#464a4a']); R(g, '#626868', sx - 6, sy - 46, 16, 2); box(g, sx - 9, sy - 47, 8, 4, ['#7e8484', '#626868', '#464a4a', '#2e3232']); return; }
    if (k === 'upole') { shadow(g, sx + 12, sy - 1, 6, 0.32); box(g, sx + 6, sy - 56, 4, 56, ['#9a845c', '#7e6a4a', '#62523a', '#44382a']); R(g, '#62523a', sx - 2, sy - 52, 20, 2); R(g, '#c8c8c0', sx - 1, sy - 53, 2, 1); R(g, '#c8c8c0', sx + 15, sy - 53, 2, 1); return; }
    if (k === 'jam') {
      var jc = cached('jam', 84, 70, function (b) {
        var cars = [[4, 30, P.red, 1], [30, 22, ['#b8c4cc', '#8a96a0', '#6e7a84', '#4e5860'], 1], [18, 44, ['#d8c08a', '#b8a070', '#94805a', '#6e5e44'], 0], [44, 40, ['#7e9a6e', '#5e7a50', '#46603e', '#34482e'], 1]];
        cars.forEach(function (c) { b.drawImage(LA.car({ len: 40, ramp: c[2], wreck: c[3] }), c[0], c[1]); });
        R(b, '#3e3c38', 0, 64, 84, 2);
      });
      g.drawImage(jc, sx - 2, sy - 6); return;
    }
    if (k === 'scarecrow') { shadow(g, sx + 9, sy - 1, 5, 0.3); R(g, '#6a4a2e', sx + 7, sy - 26, 2, 26); R(g, '#6a4a2e', sx, sy - 20, 16, 2); box(g, sx + 3, sy - 22, 10, 9, ramp('#8a4028')); vol(g, sx + 8, sy - 25, 3, 3, ramp('#d8c08a')); R(g, '#5e4630', sx + 3, sy - 29, 10, 2); R(g, '#5e4630', sx + 5, sy - 31, 6, 2); return; }
    if (k === 'smoke') { for (var sm = 0; sm < 6; sm++) { var ph = (t * 0.25 + sm / 6) % 1, ry = sy - 10 - ph * 90, rx = sx + Math.sin(ph * 6 + sm) * 6 + ph * 18; g.fillStyle = 'rgba(' + (night ? '60,64,70' : '120,118,110') + ',' + (0.5 * (1 - ph)).toFixed(2) + ')'; g.beginPath(); g.ellipse(rx, ry, 4 + ph * 10, 3 + ph * 7, 0, 0, 7); g.fill(); } if (night) { g.fillStyle = 'rgba(255,140,60,.55)'; g.fillRect(sx - 2, sy - 12, 4, 3); } return; }
    if (k === 'sign') {
      // a pole sign by the road: dead by day, its neon lit at night (spec 002, 1: Neon)
      shadow(g, sx + 10, sy - 1, 8, 0.32); box(g, sx + 6, sy - 40, 4, 40, ['#9aa0a0', '#7e8484', '#626868', '#464a4a']);
      g.font = F8; var tw = Math.max(36, g.measureText(p.text).width + (p.star ? 14 : 6)), bx = sx + 8 - tw / 2, by = sy - 62;
      R(g, '#1e2428', bx, by, tw, p.sub ? 26 : 16); R(g, '#2e3638', bx + 1, by + 1, tw - 2, (p.sub ? 26 : 16) - 2);
      var lit = night && (!p.flick || o.flick), col = { amber: P.amber, cyan: P.cyan, red: '#ff6a4a' }[p.col];
      if (lit) { var gl = g.createRadialGradient(sx + 8, by + 10, 0, sx + 8, by + 10, 34); gl.addColorStop(0, col.replace('#', '').length ? hexa(col, 0.28) : col); gl.addColorStop(1, hexa(col, 0)); g.fillStyle = gl; g.fillRect(sx - 30, by - 24, 76, 70); }
      font(g, F8, lit ? col : mix(col, '#2e3638', 0.6)); g.fillText(p.text, bx + 3, by + 4);
      if (p.star) { font(g, F8, lit ? '#fff4e0' : '#6a6a60'); g.fillText('*', bx + tw - 10, by + 4); }
      if (p.sub) { var vac = lit && o.flickVac; font(g, F6, vac ? P.pink : '#6a4a5a'); g.fillText(p.sub, bx + 3, by + 16); }
      return;
    }
    if (k === 'bush') { shadow(g, sx + 10, sy - 2, 8, 0.3); var bc2 = [['#7e8a4e', '#5e6a3a', '#46522e', '#323c22'], ['#6e7a4a', '#56643e', '#424e32', '#303a26'], ['#8a7a4a', '#6e603a', '#544a2e', '#3c3422']][p.v % 3]; vol(g, sx + 6, sy - 6, 5, 5, bc2); vol(g, sx + 11, sy - 7, 5, 6, bc2); px(g, mix(bc2[0], '#fff4e0', 0.3), sx + 5, sy - 10); return; }
    if (k === 'stump') { shadow(g, sx + 9, sy - 2, 5, 0.3); box(g, sx + 4, sy - 9, 9, 7, WOOD); vol(g, sx + 8, sy - 9, 4.5, 2, ['#c8a070', '#a8844e', '#84663a', '#5e4a2a']); px(g, WOOD[3], sx + 8, sy - 9); return; }
    if (k === 'junk') {
      shadow(g, sx + 9, sy - 2, 7, 0.3);
      if (p.v % 3 === 0) { box(g, sx + 2, sy - 10, 13, 8, ['#e8e8e0', '#c8ccc4', '#a8aca4', '#7e827c']); R(g, '#c8503a', sx + 2, sy - 10, 13, 2); }           // a cooler
      else if (p.v % 3 === 1) { box(g, sx + 2, sy - 9, 14, 7, ['#a8583a', '#8a4428', '#6a3420', '#4a2416']); R(g, '#6a3420', sx + 2, sy - 6, 14, 1); }      // a rusted drum on its side
      else { g.strokeStyle = '#3a4a5a'; g.beginPath(); g.arc(sx + 8, sy - 6, 4, 0, 7); g.stroke(); R(g, '#9aa0a0', sx + 8, sy - 6, 1, 1); }                   // a lost bike wheel
      return;
    }
    if (k === 'hay') { shadow(g, sx + 9, sy - 1, 8, 0.32); vol(g, sx + 8, sy - 7, 7, 6, ['#e8d08a', '#c8b06a', '#a88e4e', '#7a6638']); R(g, '#a88e4e', sx + 2, sy - 8, 13, 1); R(g, '#a88e4e', sx + 2, sy - 5, 13, 1); return; }
    if (k === 'billboard') {
      shadow(g, sx + 44, sy - 1, 38, 0.32);
      var bb = cached('bb' + p.v, 84, 60, function (b) {
        R(b, '#4e3622', 12, 30, 4, 30); R(b, '#4e3622', 66, 30, 4, 30); R(b, '#34241a', 15, 30, 1, 30);
        R(b, '#1e2428', 0, 0, 84, 34); var ads = [['KOLA KING', '#b4282e', '#f0ece0', 'THE KING OF COLA'], ['BARGAIN BARN', '#a83e2e', '#f0ece0', 'EXIT 9  OPEN 24 HRS'], ['STARLITE', '#2a3a5a', '#ffb43a', 'COLOR TV  POOL']][p.v % 3];
        R(b, ads[1], 2, 2, 80, 30); R(b, mix(ads[1], '#fff4e0', 0.2), 2, 2, 80, 2);
        font(b, F8, ads[2]); var tw = b.measureText(ads[0]).width; b.fillText(ads[0], 42 - tw / 2, 7);
        font(b, '5px "Press Start 2P"', ads[2]); tw = b.measureText(ads[3]).width; b.fillText(ads[3], 42 - tw / 2, 20);
        R(b, '#e8e4d8', 50, 2, 14, 9); R(b, mix(ads[1], '#10141a', 0.3), 54, 2, 6, 30);   // a torn strip hanging down
        R(b, '#3e3e46', 0, 34, 84, 2);
      });
      g.drawImage(bb, sx - 2, sy - 60); return;
    }
    if (k === 'canopy') return;   // drawn over everything (LA.townCanopy)
  };
  function hexa(c, a) { var v = parseInt(c.slice(1), 16); return 'rgba(' + (v >> 16) + ',' + ((v >> 8) & 255) + ',' + (v & 255) + ',' + a + ')'; }
  LA.hexa = hexa;
  // the gas station canopy, over the pumps and anyone under it
  LA.townCanopy = function (g, p, sx, sy, alpha, night) {
    g.globalAlpha = alpha;
    var W = p.w * T, H = 20;
    R(g, 'rgba(20,24,28,.25)', sx + 6, sy + 22, W, 26);
    for (var c = 0; c < 2; c++) box(g, sx + 14 + c * (W - 32), sy + 12, 4, 34, ['#d8d4c4', '#b8b4a4', '#94907e', '#6e6c5e']);
    R(g, '#e2ded0', sx, sy - 6, W, 13); R(g, '#c8c4b4', sx, sy - 6, W, 1); R(g, '#f0ece0', sx + 2, sy - 4, W - 6, 2);
    R(g, '#46605e', sx, sy + 4, W, 8); R(g, '#5a7472', sx, sy + 4, W, 2); R(g, '#2e3e3c', sx, sy + 11, W, 1);
    font(g, F6, night ? P.cyan : '#8aa8a4'); var tw = g.measureText('STAR FUEL').width; g.fillText('STAR FUEL', sx + Math.round((W - tw) / 2), sy + 5);
    g.globalAlpha = 1;
    return { x: sx + Math.round((W - tw) / 2), y: sy + 5 };
  };
  // the neon on buildings, drawn after the dark so it stays bright (by day it's already painted, dead)
  LA.townNeon = function (g, S, ox, oy, on, now) {
    if (!on) return;
    S.neon.forEach(function (n) {
      var x = n.x + ox, y = n.y + oy;
      if (x > 260 || y > 340 || x < -120 || y < -30) return;
      if (n.flicker) { var fl = Math.floor(now / 90); if (fl % 47 === 3 || fl % 61 === 20) return; }
      g.font = n.f; var w = g.measureText(n.text).width;
      var gr = g.createRadialGradient(x + w / 2, y + 4, 0, x + w / 2, y + 4, w * 0.8 + 10); gr.addColorStop(0, hexa(n.col, 0.22)); gr.addColorStop(1, hexa(n.col, 0));
      g.fillStyle = gr; g.fillRect(x - 20, y - 20, w + 40, 48);
      font(g, n.f, n.col); g.fillText(n.text, x, y);
    });
  };

  // ================= the things that move =================
  LA.crow = function (g, x, y, f, flying) {
    if (flying) { R(g, '#1a1c1e', x - 3, y - 1 + (f % 2), 3, 1); R(g, '#1a1c1e', x + 1, y - 1 + (f % 2), 3, 1); R(g, '#1a1c1e', x - 1, y, 3, 2); return; }
    var peck = f % 4 === 1;
    R(g, '#1a1c1e', x, y - 4, 4, 4); px(g, '#1a1c1e', x + 4, y - (peck ? 2 : 3)); px(g, '#3a3e42', x + 1, y - 4); px(g, '#c8b070', x + 5, y - (peck ? 1 : 3)); px(g, '#1a1c1e', x - 1, y - 3);
    px(g, '#2a2c2e', x + 1, y); px(g, '#2a2c2e', x + 3, y);
  };
  LA.dog = function (g, x, y, flip, f) {
    var c = ['#c8a070', '#a8844e', '#84663a', '#5e4a2a'], k = flip ? -1 : 1, ox = flip ? x + 14 : x;
    shadow(g, x + 7, y, 7, 0.3);
    var b = function (dx, dy, w, h, col) { R(g, col, flip ? ox - dx - w : ox + dx, y + dy, w, h); };
    b(2, -7, 10, 5, c[1]); b(2, -7, 10, 1, c[0]); b(2, -3, 10, 1, c[2]);
    var head = f % 6 < 3 ? 0 : 2;   // nosing the ground
    b(-2, -9 + head, 5, 4, c[1]); b(-3, -8 + head, 1, 2, c[0]); b(-4, -6 + head, 2, 1, '#1a1410'); b(-1, -10 + head, 2, 2, c[2]);
    var st = f % 4 < 2 ? 0 : 1;
    b(3, -2, 1, 2 + st, c[3]); b(10, -2, 1, 3 - st, c[3]); b(5, -2, 1, 3 - st, c[2]); b(8, -2, 1, 2 + st, c[2]);
    b(12, -8 + (f % 2), 2, 1, c[2]);
  };

  // ================= inside maps =================
  var WALLP = [['#9a9e8a', '#868a76', '#6e7262', '#545848'], ['#a8988a', '#948476', '#7a6c62', '#5e544c'], ['#8a9aa0', '#76868c', '#5e6e74', '#4a585e'], ['#b0a888', '#9a9274', '#807a60', '#646048'], ['#a89aa8', '#948694', '#7a6e7a', '#5e545e']];
  function floorTile(g, code, X, Y, h, x, y) {
    var F = LAT.F;
    if (code === F.WOOD) { var pl = ['#8a6a48', '#7a5c3e', '#6a4e34', '#5a422c']; R(g, pl[1], X, Y, T, T); for (var r = 0; r < T; r += 4) { R(g, pl[2], X, Y + r + 3, T, 1); R(g, pl[3], X + ((x * 7 + (y * 4 + r) * 3) % 13), Y + r, 1, 3); } if (h % 9 === 0) R(g, pl[0], X + 3, Y + 5, 7, 1); }
    else if (code === F.TILE) { R(g, '#d8d4c8', X, Y, T, T); for (var a = 0; a < 2; a++) for (var b = 0; b < 2; b++) if ((a + b) % 2) R(g, '#a8b0b0', X + a * 8, Y + b * 8, 8, 8); R(g, '#b8b4a8', X, Y + 15, T, 1); }
    else if (code === F.LINO) { R(g, '#c8c09a', X, Y, T, T); R(g, '#b0a884', X + 15, Y, 1, T); R(g, '#b0a884', X, Y + 15, T, 1); if (h % 5 === 0) R(g, '#a89e7a', X + 4, Y + 6, 6, 3); }
    else if (code === F.CARPET) { R(g, '#7a6a5e', X, Y, T, T); if ((x + y) % 2) { px(g, '#86766a', X + 4, Y + 4); px(g, '#86766a', X + 12, Y + 12); } if (h % 7 === 0) R(g, '#6a5a50', X + 2, Y + 8, 9, 4); }
    else if (code === F.CONC) { R(g, '#8e8a7e', X, Y, T, T); if (h % 4 === 0) crack(g, X + 2, Y + 6, 10, '#74706a', h % 3); if (h % 6 === 1) { R(g, '#6e6a62', X + 5, Y + 7, 6, 4); } }
    else if (code === F.STORE) { R(g, '#c8c4b4', X, Y, T, T); if ((x + y) % 2) R(g, '#a8aca4', X, Y, T, T); R(g, '#b8b4a4', X + 15, Y, 1, T); if (h % 8 === 0) { R(g, '#8a8676', X + 3, Y + 4, 8, 1); R(g, '#8a8676', X + 6, Y + 5, 4, 3); } }
    else if (code === F.IDOOR || code === F.EXIT) { R(g, '#5e4a36', X, Y, T, T); R(g, '#6a5440', X, Y + 2, T, 12); }
  }
  LA.insideMap = function (S, pl) {
    var ins = pl.inside, W = ins.W, H = ins.H, c = mk(W * T, H * T), g = c[1], F = LAT.F, h0 = hsh(pl.door.x, pl.door.y, 11);
    var wp = pl.kind === 'home' ? WALLP[h0 % 5] : pl.kind === 'school' ? WALLP[2] : pl.kind === 'church' ? ['#e0dcd0', '#c8c4b8', '#a8a49a', '#86847a'] : pl.kind === 'motel' ? WALLP[3] : ['#b8bcb4', '#a0a49c', '#86887e', '#686a62'];
    // floors
    for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) floorTile(g, ins.t[y * W + x], x * T, y * T, hsh(x, y, h0), x, y);
    // the back wall and walls across, seen face on: paper, a rail, a baseboard
    for (y = 0; y < H; y++) for (x = 0; x < W; x++) {
      var code = ins.t[y * W + x], X = x * T, Y = y * T;
      if (code === F.BACK) {
        var top = y === 0 || ins.t[(y - 1) * W + x] !== F.BACK, two = y < 2;
        if (two && y === 1) continue;
        var fh = two ? 32 : 16, wy = two ? 0 : Y;
        R(g, wp[1], X, wy, T, fh);
        for (var sx = X + (x % 2) * 4; sx < X + T; sx += 8) R(g, wp[2], sx, wy + 4, 1, fh - 10);
        R(g, wp[0], X, wy, T, 2); R(g, '#6a5a40', X, wy + fh - 6, T, 2); R(g, '#8a7650', X, wy + fh - 6, T, 1); R(g, wp[3], X, wy + fh - 2, T, 2);
        if (!two) { R(g, '#2e302a', X, Y - 2, T, 2); }
      }
    }
    for (y = 0; y < H; y++) for (x = 0; x < W; x++) {
      var cd = ins.t[y * W + x], X2 = x * T, Y2 = y * T;
      if (cd === F.WALL) {
        R(g, '#2e302a', X2, Y2, T, T);
        var L = x > 0 && ins.t[y * W + x - 1] !== F.WALL && ins.t[y * W + x - 1] !== F.BACK, Rr = x < W - 1 && ins.t[y * W + x + 1] !== F.WALL && ins.t[y * W + x + 1] !== F.BACK;
        if (Rr) R(g, '#3e4038', X2 + T - 2, Y2, 2, T); if (L) R(g, '#24261f', X2, Y2, 2, T);
        if (y === H - 1) R(g, '#3e4038', X2, Y2, T, 2);
      }
      if (cd === F.EXIT) { R(g, '#2e302a', X2, Y2, T, T); R(g, '#c8c4b4', X2 + 2, Y2, 12, 2); R(g, 'rgba(232,208,160,.22)', X2 + 2, Y2 - 12, 12, 12); R(g, '#e8d0a0', X2 + 3, Y2 + 2, 10, 14); }
    }
    // windows in the top wall, with light falling down and to the right
    var nwin = Math.max(1, Math.floor(W / 6));
    for (var i = 0; i < nwin; i++) {
      var wx = (2 + i * 6 + (h0 >> i) % 3) * T + 2; if (wx > (W - 2) * T) continue;
      R(g, '#3e3a30', wx, 4, 26, 18); R(g, '#8a9a98', wx + 2, 6, 22, 7); R(g, '#e8d0a0', wx + 2, 13, 22, 1); R(g, '#5e6444', wx + 2, 14, 22, 6); R(g, '#3e3a30', wx + 12, 6, 2, 14);
      if ((h0 >> (i + 2)) % 3 === 0) { R(g, WOOD[1], wx - 1, 8, 28, 3); R(g, WOOD[2], wx - 1, 15, 28, 3); }
      g.fillStyle = 'rgba(232,208,160,.10)'; g.beginPath(); g.moveTo(wx, 32); g.lineTo(wx + 26, 32); g.lineTo(wx + 52, 92); g.lineTo(wx + 22, 92); g.fill();
    }
    // furniture
    ins.furn.forEach(function (f) { furn(g, f, f.x * T, f.y * T, wp, pl); });
    // locked inside doors are drawn shut
    ins.doors.forEach(function (d) { if (d.lock >= 0) { var X3 = d.x * T, Y3 = d.y * T; box(g, X3 + 2, Y3, 12, T, WOOD); R(g, WOOD[3], X3 + 4, Y3 + 3, 8, 4); px(g, '#e8d08a', X3 + 11, Y3 + 9); } });
    return c[0];
  };
  function sh(g, x, y, w, h) { R(g, 'rgba(10,12,14,.30)', x, y, w, h); }
  var GOODS = ['#c8503a', '#e8c88a', '#5e7aa0', '#7e9a6e', '#a8984e', '#e8e4d8', '#8a4028', '#46647e'];
  function goodsRow(g, x, y, w, seed, cols) { for (var i = 0; i < w; i += 3) { var hh = hsh(i, seed, 3); if (hh % 4 === 0) continue; var c = (cols || GOODS)[hh % (cols || GOODS).length]; R(g, c, x + i, y + (hh % 2), 2, 4 - (hh % 2)); px(g, mix(c, '#fff4e0', 0.3), x + i, y + (hh % 2)); } }
  function furn(g, f, X, Y, wp, pl) {
    var W = f.w * T, H = f.h * T, k = f.k, v = f.v || 0;
    switch (k) {
      case 'bed': { var q = [['#7e9a96', '#5a7472', '#46605e', '#34484a'], ['#a87a8a', '#8a5e6e', '#6e4a58', '#523844'], ['#c8b48a', '#a8946a', '#8a7650', '#6a5a3e']][v % 3]; sh(g, X + 4, Y + 6, W, H - 4); box(g, X + 1, Y + 2, W - 2, H - 4, ['#8a6040', '#74502e', '#5e4024', '#44301c']); R(g, '#e8e4d8', X + 3, Y + 3, W - 6, 7); R(g, '#c8c4b4', X + 3, Y + 8, W - 6, 2); box(g, X + 3, Y + 11, W - 6, H - 15, q); R(g, q[0], X + 3, Y + 11, W - 6, 1); for (var qx = X + 5; qx < X + W - 4; qx += 6) R(g, q[2], qx, Y + 12, 1, H - 17); R(g, q[1], X + 8, Y + 7, W - 12, 5); break; }
      case 'stand': sh(g, X + 3, Y + 4, 14, 12); box(g, X + 1, Y + 2, 14, 13, WOOD); R(g, WOOD[3], X + 3, Y + 8, 10, 1); px(g, '#e8d08a', X + 7, Y + 10); vol(g, X + 8, Y - 1, 4, 3, ['#e8e0c8', '#c8c0aa', '#a8a08a', '#7a7462']); R(g, '#5e5a54', X + 7, Y + 2, 2, 1); break;
      case 'closet': box(g, X + 1, Y - 12, W - 2, 28, ['#c8b48a', '#a8946a', '#8a7650', '#6a5a3e']); R(g, '#6a5a3e', X + W / 2, Y - 12, 1, 28); px(g, '#e8d08a', X + W / 2 - 3, Y + 2); px(g, '#e8d08a', X + W / 2 + 2, Y + 2); R(g, '#1e1a16', X + W / 2 + 1, Y - 10, 2, 24); break;
      case 'dresser': sh(g, X + 3, Y + 4, 14, 12); box(g, X + 1, Y, 14, 15, WOOD); for (var d = 0; d < 3; d++) { R(g, WOOD[3], X + 2, Y + 4 + d * 4, 12, 1); px(g, '#e8d08a', X + 8, Y + 2 + d * 4); } R(g, '#e8e4d8', X + 3, Y - 2, 5, 3); break;
      case 'lamp': vol(g, X + 8, Y + 4, 4, 4, ['#e8e0c8', '#c8c0aa', '#a8a08a', '#7a7462']); R(g, '#5e5a54', X + 7, Y + 8, 2, 7); R(g, '#5e5a54', X + 5, Y + 14, 6, 1); break;
      case 'fridge': sh(g, X + 3, Y + 2, 14, 14); box(g, X + 1, Y - 14, 14, 29, ['#f0ece0', '#d8d4c8', '#b8b4a8', '#8a867a']); R(g, '#8a867a', X + 1, Y - 4, 14, 1); R(g, '#5e5a54', X + 12, Y - 10, 1, 4); R(g, '#5e5a54', X + 12, Y - 1, 1, 6); R(g, '#c8503a', X + 4, Y - 11, 3, 3); R(g, '#e8c88a', X + 7, Y - 9, 3, 4); break;
      case 'stove': box(g, X + 1, Y, 14, 15, ['#e8e4d8', '#c8c4b4', '#a8a494', '#7e7a6c']); R(g, '#2a2a2a', X + 3, Y + 2, 4, 3); R(g, '#2a2a2a', X + 9, Y + 2, 4, 3); R(g, '#3a3a3a', X + 3, Y + 8, 10, 5); R(g, '#c8c4b4', X + 3, Y + 7, 10, 1); break;
      case 'wallcab': box(g, X + 1, Y + 2, W - 2, 12, ['#c8b48a', '#a8946a', '#8a7650', '#6a5a3e']); R(g, '#6a5a3e', X + W / 2, Y + 2, 1, 12); px(g, '#e8d08a', X + W / 2 - 2, Y + 10); px(g, '#e8d08a', X + W / 2 + 2, Y + 10); break;
      case 'counter': sh(g, X + 3, Y + 4, W, 12); box(g, X, Y + 1, W, 14, ['#b8a880', '#a89870', '#8a7a58', '#6a5c42']); R(g, '#e8e4d8', X, Y + 1, W, 3); R(g, '#c8c4b4', X, Y + 3, W, 1); if (pl.kind !== 'home' && pl.kind !== 'school') { box(g, X + W - 14, Y - 4, 11, 8, ['#5e6e7e', '#465464', '#34404c', '#242c34']); R(g, '#3ff0e8', X + W - 12, Y - 3, 6, 2); R(g, '#1e2428', X + W - 13, Y + 3, 9, 1); } else { R(g, '#8a9aa0', X + 4, Y + 2, 8, 2); px(g, '#c8c8c0', X + 8, Y + 1); } break;
      case 'pantry': sh(g, X + 3, Y + 2, 14, 14); box(g, X + 1, Y - 12, 14, 27, WOOD); R(g, WOOD[3], X + 8, Y - 12, 1, 27); px(g, '#e8d08a', X + 6, Y); px(g, '#e8d08a', X + 10, Y); break;
      case 'table': sh(g, X + 4, Y + 6, W, 10); box(g, X + 1, Y + 1, W - 2, 10, WOOD); R(g, WOOD[0], X + 1, Y + 1, W - 2, 1); R(g, WOOD[3], X + 3, Y + 11, 2, 4); R(g, WOOD[3], X + W - 5, Y + 11, 2, 4); R(g, '#e8e4d8', X + 6, Y + 3, 6, 4); break;
      case 'toilet': vol(g, X + 8, Y + 9, 5, 5, ['#f0ece0', '#d8d4c8', '#b8b4a8', '#8a867a']); box(g, X + 4, Y, 8, 6, ['#f0ece0', '#d8d4c8', '#b8b4a8', '#8a867a']); vol(g, X + 8, Y + 9, 3, 3, ['#8aa8b0', '#6a8a94', '#56747e', '#46606a']); break;
      case 'medcab': box(g, X + 2, Y + 3, 12, 11, ['#e8e4d8', '#c8c4b4', '#a8a494', '#7e7a6c']); R(g, '#9ab8c0', X + 4, Y + 5, 8, 7); R(g, '#c8e0e8', X + 5, Y + 6, 2, 3); R(g, '#7e7a6c', X + 8, Y + 5, 1, 7); break;
      case 'couch': { var cc = ramp(['#7e5a3a', '#5e6e4a', '#6e4a5a', '#4e5e7e'][(f.x + f.y) % 4]); sh(g, X + 4, Y + 6, W, 10); box(g, X + 1, Y, W - 2, 8, cc); box(g, X + 1, Y + 6, W - 2, 8, cc); R(g, cc[0], X + 3, Y + 6, W - 6, 1); box(g, X, Y + 2, 4, 12, cc); box(g, X + W - 4, Y + 2, 4, 12, cc); for (var cx = X + 4 + 16; cx < X + W - 4; cx += 16) R(g, cc[2], cx, Y + 7, 1, 6); break; }
      case 'tv': sh(g, X + 3, Y + 5, 14, 10); box(g, X + 1, Y + 6, 14, 9, WOOD); box(g, X + 2, Y - 4, 12, 11, ['#4e4a44', '#3a3632', '#2a2622', '#1a1814']); R(g, '#2e3a3e', X + 4, Y - 2, 8, 7); R(g, '#5e7478', X + 5, Y - 1, 3, 2); if (v === 1) { R(g, '#0e1012', X + 6, Y, 4, 3); } break;
      case 'rug': { var rc = ['#7a3e26', '#a8583a', '#c8a050', '#8a4028']; R(g, rc[0], X, Y, W, H); R(g, rc[1], X + 2, Y + 2, W - 4, H - 4); R(g, rc[2], X + 5, Y + 5, W - 10, H - 10); R(g, rc[3], X + 8, Y + 8, Math.max(0, W - 16), Math.max(0, H - 16)); for (var fx = X; fx < X + W; fx += 3) { px(g, rc[2], fx, Y - 1); px(g, rc[2], fx, Y + H); } break; }
      case 'stairs': for (var s = 0; s < H; s += 4) { R(g, WOOD[s % 8 ? 1 : 0], X + 1, Y + s, 14, 3); R(g, WOOD[3], X + 1, Y + s + 3, 14, 1); } R(g, '#2e302a', X + 1, Y, 14, 3); R(g, WOOD[2], X + 13, Y, 2, H); break;
      case 'bench': sh(g, X + 4, Y + 4, W, 12); box(g, X + 1, Y + 2, W - 2, 6, WOOD); R(g, WOOD[3], X + 3, Y + 8, 2, 7); R(g, WOOD[3], X + W - 5, Y + 8, 2, 7); R(g, '#7e8484', X + 4, Y - 1, 8, 3); R(g, '#c8503a', X + 14, Y, 6, 2); R(g, '#9aa0a0', X + 24, Y - 2, 2, 4); R(g, '#e8c88a', X + W - 10, Y + 1, 5, 2); break;
      case 'gshelf': sh(g, X + 3, Y + 2, 14, H); box(g, X + 1, Y - 6, 14, H + 4, METAL); for (var gs = Y - 2; gs < Y + H - 4; gs += 8) { R(g, METAL[3], X + 1, gs + 5, 14, 1); box(g, X + 2, gs, 6, 5, ['#d2ac74', '#c09a64', '#a6824e', '#86683c']); R(g, ['#c8503a', '#5e7aa0', '#7e9a6e'][(gs >> 3) % 3], X + 9, gs + 1, 4, 4); } break;
      case 'mower': sh(g, X + 3, Y + 8, 14, 8); box(g, X + 2, Y + 6, 12, 7, P.red); R(g, '#2a2a2a', X + 3, Y + 12, 3, 3); R(g, '#2a2a2a', X + 10, Y + 12, 3, 3); R(g, '#5e5a54', X + 7, Y - 2, 1, 8); R(g, '#5e5a54', X + 5, Y - 2, 5, 1); break;
      case 'bike': sh(g, X + 3, Y + 10, 14, 6); g.strokeStyle = '#3a4a5a'; g.lineWidth = 1; g.beginPath(); g.arc(X + 4, Y + 11, 3.5, 0, 7); g.arc(X + 13, Y + 11, 3.5, 0, 7); g.stroke(); R(g, '#c8503a', X + 4, Y + 8, 9, 1); R(g, '#c8503a', X + 8, Y + 5, 1, 4); R(g, '#1a1a1a', X + 6, Y + 4, 4, 1); R(g, '#9aa0a0', X + 12, Y + 5, 1, 4); break;
      case 'oil': R(g, '#5e5a52', X + 2, Y + 4, W - 6, 8); R(g, '#4e4a44', X + 4, Y + 5, W - 12, 5); break;
      case 'boxes': for (var bx = 0; bx < f.w; bx++) { box(g, X + bx * T + 1, Y - 2, 13, 14, ['#d2ac74', '#c09a64', '#a6824e', '#86683c']); R(g, '#a8aca8', X + bx * T + 1, Y + 3, 13, 2); if (bx % 2) box(g, X + bx * T + 3, Y - 10, 10, 9, ['#d2ac74', '#c09a64', '#a6824e', '#86683c']); } break;
      case 'shelf': { sh(g, X + 3, Y + 6, W, 10); box(g, X, Y - 4, W, 18, METAL); R(g, METAL[3], X, Y + 2, W, 1); R(g, METAL[3], X, Y + 8, W, 1); goodsRow(g, X + 2, Y - 3, W - 4, f.x + v * 7); goodsRow(g, X + 2, Y + 3, W - 4, f.x + v * 7 + 1); goodsRow(g, X + 2, Y + 9, W - 4, f.x + v * 7 + 2); break; }
      case 'washers': for (var wi = 0; wi < f.w; wi++) { var wx = X + wi * T; box(g, wx + 1, Y - 2, 14, 16, ['#e8e8e0', '#c8ccc4', '#a8aca4', '#7e827c']); vol(g, wx + 8, Y + 6, 4, 4, ['#7a9aa8', '#5a7a88', '#466270', '#344a54']); R(g, '#5e625c', wx + 3, Y, 10, 1); } break;
      case 'cooler': case 'rack': case 'gcounter': {
        sh(g, X - 2, Y + 2, 4, H);
        if (k === 'gcounter') { box(g, X + 1, Y - 2, 14, H + 1, ['#9a9e96', '#7e827a', '#626660', '#464a46']); R(g, '#9ab8c0', X + 3, Y, 10, H - 4); for (var gy = Y + 2; gy < Y + H - 4; gy += 9) { R(g, '#3a3632', X + 4, gy, 8, 2); R(g, '#5e4630', X + 10, gy + 1, 2, 3); } break; }
        box(g, X + 1, Y - 6, 14, H + 5, k === 'rack' ? WOOD : ['#e8e8e0', '#c8ccc4', '#a8aca4', '#7e827c']);
        for (var cy = Y - 4; cy < Y + H - 4; cy += 6) { R(g, k === 'rack' ? WOOD[3] : '#3e5a64', X + 3, cy, 10, 5); goodsRow(g, X + 3, cy + 1, 10, cy, k === 'rack' ? ['#8a4028', '#c8503a', '#e8c88a'] : ['#c8503a', '#e8e4d8', '#8ab0c8']); }
        break;
      }
      case 'walkin': box(g, X + 1, Y - 12, W - 2, 26, ['#c8ccc4', '#a8aca4', '#8a8e86', '#6e726a']); R(g, '#5e625c', X + W - 8, Y - 2, 4, 2); R(g, '#9aa0a0', X + 3, Y - 10, W - 6, 1); break;
      case 'grill': sh(g, X + 3, Y + 6, W, 10); box(g, X, Y - 2, W, 16, ['#9a9e96', '#7e827a', '#626660', '#464a46']); R(g, '#2a2a2a', X + 2, Y, W - 4, 5); for (var gl = X + 3; gl < X + W - 3; gl += 3) R(g, '#5e5a54', gl, Y, 1, 5); R(g, '#c8a030', X + 4, Y + 8, 10, 3); break;
      case 'booth': box(g, X, Y, W, 14, ramp('#a83e2e')); R(g, '#e8e4d8', X + 6, Y + 3, W - 12, 6); break;
      case 'tdesk': sh(g, X + 4, Y + 6, W, 10); box(g, X + 1, Y + 1, W - 2, 12, WOOD); R(g, '#e8e4d8', X + 4, Y + 2, 8, 5); vol(g, X + 22, Y + 3, 3, 3, ['#c8503a', '#a83e2e', '#8a2a1e', '#6a1a14']); break;
      case 'sdesk': sh(g, X + 3, Y + 6, 12, 8); box(g, X + 2, Y + 3, 12, 8, ['#c8b48a', '#a8946a', '#8a7650', '#6a5a3e']); R(g, '#5e625c', X + 4, Y + 11, 1, 4); R(g, '#5e625c', X + 11, Y + 11, 1, 4); if ((f.x + f.y) % 3 === 0) R(g, '#e8e4d8', X + 5, Y + 4, 5, 3); break;
      case 'cubbies': box(g, X + 1, Y + 1, W - 2, 14, WOOD); for (var cb = X + 2; cb < X + W - 3; cb += 5) { R(g, WOOD[3], cb, Y + 3, 4, 4); R(g, WOOD[3], cb, Y + 9, 4, 4); R(g, GOODS[(cb >> 2) % 8], cb + 1, Y + 10, 2, 3); } break;
      case 'nurse': box(g, X + 1, Y - 4, W - 2, 19, ['#e8e8e0', '#c8ccc4', '#a8aca4', '#7e827c']); R(g, '#c8503a', X + W / 2 - 1, Y - 1, 3, 7); R(g, '#c8503a', X + W / 2 - 3, Y + 1, 7, 3); break;
      case 'cot': sh(g, X + 3, Y + 4, 14, H); box(g, X + 1, Y + 1, 14, H - 3, ['#e8e8e0', '#c8ccc4', '#a8aca4', '#7e827c']); R(g, '#e8e4d8', X + 3, Y + 2, 10, 5); break;
      case 'books': box(g, X, Y - 8, W, 24, WOOD); for (var by = Y - 6; by < Y + 14; by += 7) { R(g, WOOD[3], X, by + 6, W, 1); for (var bk = X + 2; bk < X + W - 2; bk += 3) if (hsh(bk, by) % 5) R(g, ['#8a4028', '#3a5068', '#5e6444', '#a8984e', '#7e3e3e'][hsh(bk, by) % 5], bk, by, 2, 6); } break;
      case 'rtable': case 'ctable': sh(g, X + 4, Y + 6, W, 10); box(g, X + 1, Y + 1, W - 2, 11, k === 'ctable' ? ['#c8c4b4', '#a8a494', '#8a8676', '#64625a'] : WOOD); R(g, '#5e625c', X + 3, Y + 12, 2, 3); R(g, '#5e625c', X + W - 5, Y + 12, 2, 3); if (k === 'ctable') for (var tx = X + 6; tx < X + W - 6; tx += 14) R(g, '#e8c88a', tx, Y + 4, 5, 3); break;
      case 'axecase': box(g, X + 2, Y + 1, 12, 13, ['#d06a3a', '#b4582e', '#8a4028', '#6a3424']); R(g, '#9ab8c0', X + 4, Y + 3, 8, 9); R(g, '#c8503a', X + 6, Y + 4, 4, 3); R(g, '#8a6040', X + 7, Y + 6, 2, 6); break;
      case 'altar': sh(g, X + 4, Y + 6, W, 10); box(g, X + 2, Y + 1, W - 4, 12, ['#f0ece0', '#e0dcd0', '#c8c4b8', '#a8a49a']); R(g, '#8a2a1e', X + 6, Y + 1, W - 12, 3); R(g, '#c8a050', X + W / 2 - 1, Y - 10, 2, 10); R(g, '#c8a050', X + W / 2 - 4, Y - 7, 8, 2); break;
      case 'pew': sh(g, X + 3, Y + 6, W, 10); box(g, X, Y, W, 6, WOOD); box(g, X, Y + 6, W, 7, WOOD); R(g, WOOD[0], X, Y + 6, W, 1); break;
      case 'odesk': sh(g, X + 4, Y + 6, W, 10); box(g, X + 1, Y + 1, W - 2, 12, WOOD); R(g, '#e8e4d8', X + 6, Y + 3, 7, 5); R(g, '#3a5068', X + 18, Y + 3, 6, 4); break;
      case 'files': box(g, X + 2, Y - 6, 12, 21, METAL); for (var fi = 0; fi < 3; fi++) { R(g, METAL[3], X + 3, Y - 2 + fi * 6, 10, 1); R(g, '#c8c4b4', X + 6, Y - 4 + fi * 6, 4, 1); } break;
      case 'pshelf': box(g, X, Y - 4, W, 18, WOOD); R(g, WOOD[3], X, Y + 3, W, 1); goodsRow(g, X + 2, Y - 3, W - 4, f.x + 31, ['#c8503a', '#e8c88a', '#7e9a6e']); goodsRow(g, X + 2, Y + 4, W - 4, f.x + 32, ['#c8503a', '#e8c88a', '#7e9a6e']); break;
      default: box(g, X + 1, Y + 1, W - 2, H - 2, METAL);
    }
  }
})();
