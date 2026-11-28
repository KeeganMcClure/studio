// Sarah's Sim scene: draws one home in the diagonal view (bible, Art; mockups/look-iso-v1 for the room, mockups/build-v1 for
// walls, floors, doors, windows and stairs). The world is drawn at 1x into its own canvas; the camera then zooms and slides
// it onto the screen with crisp pixels.
//   floors: planks, checker and bath tile by room; walls: striped wallpaper with a wainscot, trim and baseboard inside,
//   red brick outside; walls up, cut away (back walls up, the rest low) or down (bible, Building, View); the floor below
//   shows dimmed (bible, Building, Floors).
(function () {
  var I = SS.I, FH = SS.FH, poly = StudioIso.poly, line = SS.line;
  var INK = 'rgba(59,36,48,.85)';
  var OFF = SS.OFF = [210, 300], WORLD = SS.WORLD = [420, 520];   // the world canvas: lot tile 0,0 at OFF
  // the world canvas grows with the lot (spec 004, part A: small 16, medium 24, large 32 tiles); the arrays change in place, so
  // everything holding them sees the new size. 16 tiles gives the sizes above.
  SS.setLot = function (n) { OFF[0] = n * 11 + 34; OFF[1] = 300; WORLD[0] = OFF[0] * 2; WORLD[1] = 300 + n * 11 + 44; };
  function R(c, x, y, w, h, col) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
  // P: a lot point on the screen, through the view's turn (view.js). Q: a point already turned into the view, for the walls
  // and stairs, which are turned as a whole first so their visible faces and far sides follow the view
  function P(x, y, h) { return SS.vp(x, y, h); }
  function Q(x, y, h) { return I.p(x, y, h); }

  // ---------- floors ----------
  var FLOORS = {
    planks: function (c, x, y, Z) { // honey planks in rows along x, staggered ends (look-iso-v1)
      var k = (y * 3 + (x >> 1) + (y % 2)) % 4, cols = ['#d39a66', '#c88d5a', '#bb8150', '#c88d5a'];
      poly(c, [P(x, y, Z), P(x + 1, y, Z), P(x + 1, y + 1, Z), P(x, y + 1, Z)], cols[k]);
      line(c, P(x, y + 1, Z), P(x + 1, y + 1, Z), 'rgba(147,96,60,.85)');
      line(c, P(x, y + .5, Z), P(x + 1, y + .5, Z), 'rgba(147,96,60,.35)');
      if ((x + y * 2) % 3 === 0) line(c, P(x, y, Z), P(x, y + 1, Z), 'rgba(147,96,60,.7)');
      if ((x * 7 + y * 3) % 5 === 0) { var g = P(x + .4, y + .3, Z); R(c, g[0], g[1], 2, 1, 'rgba(255,225,180,.25)'); }
    },
    check: function (c, x, y, Z) { // kitchen checker, two to a tile (mockups/cooking-v1)
      for (var i = 0; i < 2; i++) for (var j = 0; j < 2; j++) poly(c, [P(x + i / 2, y + j / 2, Z), P(x + i / 2 + .5, y + j / 2, Z), P(x + i / 2 + .5, y + j / 2 + .5, Z), P(x + i / 2, y + j / 2 + .5, Z)], (i + j) % 2 ? '#bcd6c6' : '#eef3ea');
    },
    tile: function (c, x, y, Z) { // small bath tiles with grout
      poly(c, [P(x, y, Z), P(x + 1, y, Z), P(x + 1, y + 1, Z), P(x, y + 1, Z)], '#e9eef0');
      [.33, .66, 1].forEach(function (k) { line(c, P(x, y + k, Z), P(x + 1, y + k, Z), '#c9d6dc'); line(c, P(x + k, y, Z), P(x + k, y + 1, Z), '#c9d6dc'); });
    }
  };
  function drawGround(c, W, t, look) { // the lot: grass with a little winter frost, the path to the front, the yard behind
    var n = W.lot;
    poly(c, [P(0, 0), P(n, 0), P(n, n), P(0, n)], '#8bbd73');
    for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) {
      if ((i + j) % 2) poly(c, [P(i, j), P(i + 1, j), P(i + 1, j + 1), P(i, j + 1)], '#86b86e');
      if ((i * 7 + j * 3) % 5 === 0) { var p = P(i + .5, j + .5); R(c, p[0], p[1], 2, 1, '#79a964'); R(c, p[0] + 1, p[1] - 1, 1, 1, '#b9e0a2'); }
      if (look && look.snow && (i * 5 + j * 11) % 4 === 0) { var s = P(i + .3, j + .6); R(c, s[0], s[1], 3, 1, 'rgba(244,241,251,.8)'); }
    }
    // the front path from the door to the street
    var ax = W.ax, ay = W.ay;
    for (var y = ay + W.home.d; y < n; y++) poly(c, [P(ax + 1, y), P(ax + 2, y), P(ax + 2, y + 1), P(ax + 1, y + 1)], y % 2 ? '#e3d3bf' : '#d6c3ab');
    var e1 = Q(0, n), e2 = Q(n, n), e3 = Q(n, 0); poly(c, [e1, e2, [e2[0], e2[1] + 5], [e1[0], e1[1] + 5]], '#8e6a4a'); poly(c, [e2, e3, [e3[0], e3[1] + 5], [e2[0], e2[1] + 5]], '#6f5038');
  }
  function drawFloorTiles(c, W, f, Z) {
    var ax = W.ax, ay = W.ay;
    for (var x = ax; x < ax + W.home.w; x++) for (var y = ay; y < ay + W.home.d; y++) {
      var r = W.room(f, x, y); if (!r || W.wellAt(f, x, y)) continue;
      FLOORS[r.floor](c, x, y, Z);
    }
    // the slab edge along the open front sides (upper floors read as floors, mockups/build-v1)
    var vr = SS.vrect(ax, ay, ax + W.home.w, ay + W.home.d), x0 = vr[0], y0 = vr[1], x1 = vr[2], y1 = vr[3];
    poly(c, [Q(x0, y1, Z), Q(x1, y1, Z), Q(x1, y1, Z - 5), Q(x0, y1, Z - 5)], f ? '#c9a58a' : '#7d4c30');
    poly(c, [Q(x1, y0, Z), Q(x1, y1, Z), Q(x1, y1, Z - 5), Q(x1, y0, Z - 5)], f ? '#a9866d' : '#5e3822');
  }

  // ---------- walls ----------
  function wallHeight(s, mode) {
    if (mode === 'up') return SS.WALL_UP;
    if (mode === 'cut') return s.back ? SS.WALL_UP : 8;
    return 4;
  }
  function brick(c, pts, lit) {
    poly(c, pts, '#b9584a');
    SS.clip(c, pts, function () {
      var b = SS.bounds(pts);
      for (var y = Math.floor(b[1]); y < b[3]; y += 4) R(c, b[0], y, b[2] - b[0], 1, '#9c463b');
      for (var y2 = Math.floor(b[1]), r = 0; y2 < b[3]; y2 += 4, r++) for (var x = Math.floor(b[0]) + (r % 2 ? 3 : 7); x < b[2]; x += 8) R(c, x, y2 + 1, 1, 3, '#9c463b');
    });
  }
  // draws one wall segment as a box; its visible face carries paper or brick, with any window or door on it
  function drawWall(c, W, s, Z, mode, look, t) {
    var H = wallHeight(s, mode), th = .07, lo = 0, hi = H;
    var x0 = s.axis === 'x' ? s.x : s.x - th, x1 = s.axis === 'x' ? s.x + 1 : s.x + th, y0 = s.axis === 'x' ? s.y - th : s.y, y1 = s.axis === 'x' ? s.y + th : s.y + 1;
    var opening = s.op === 'door' || s.op === 'arch', DOORH = 34;
    if (opening && s.op === 'arch' || (opening && s.op === 'door' && !s.ext)) { if (H <= DOORH) return; lo = DOORH; }
    var paper = s.b ? SS.PAPERS[s.b.paper] : null;
    var A = Q(x0, y0, Z + lo), B = Q(x1, y0, Z + lo), C = Q(x1, y1, Z + lo), D = Q(x0, y1, Z + lo), h = hi - lo;
    var up = function (q) { return [q[0], q[1] - h]; };
    // the visible face: +y for walls along x, +x for walls along y
    var face = s.axis === 'x' ? [D, C, up(C), up(D)] : [B, C, up(C), up(B)];
    var endFace = s.axis === 'x' ? [B, C, up(C), up(B)] : [D, C, up(C), up(D)];
    var fa = function (u, hh) { return s.axis === 'x' ? Q(s.x + u, s.y + th, Z + hh) : Q(s.x + th, s.y + u, Z + hh); };
    var faceAt = function (u0, u1, h0, h1) { return [fa(u0, h0), fa(u1, h0), fa(u1, h1), fa(u0, h1)]; };
    if (paper && paper.texture) { // a paper with its own texture (Nina's): drawn along the wall's slant at 1 px a game pixel,
      // continuing from one tile of wall to the next, with the top cut where a wall is cut down
      var tex = SS.paperTexture(paper.texture, 11 * 32, SS.WALL_UP), O = fa(0, hi), U1 = fa(1, hi), along = (s.axis === 'x' ? s.x : s.y) % 32;
      c.save(); poly(c, face, paper.base); c.clip();
      c.transform((U1[0] - O[0]) / 11, (U1[1] - O[1]) / 11, 0, 1, O[0], O[1]);
      c.imageSmoothingEnabled = false; c.drawImage(tex, along * 11, SS.WALL_UP - hi, 11, hi - lo, 0, 0, 11, hi - lo);
      c.restore();
    } else if (paper) {
      poly(c, face, paper.base);
      for (var u = 0; u < 1; u += .5) poly(c, faceAt(u, u + .25, Math.max(lo, 0), hi), paper.stripe);
      if (hi > 20) for (var k = .25; k < 1; k += .5) for (var hh = 22; hh < hi - 4; hh += 14) { if (hh < lo) continue; var q = fa(k, hh + ((s.x + s.y) % 2 ? 7 : 0)); if (hh + 7 < hi - 2) R(c, q[0] - 1, q[1] - 1, 2, 2, paper.dot); }
      if (lo < 16) { poly(c, faceAt(0, 1, lo, Math.min(hi, 14)), paper.low); if (hi > 15) poly(c, faceAt(0, 1, 14, 16), '#fff1e2'); poly(c, faceAt(0, 1, lo, Math.min(hi, 3)), '#b9837f'); }
    } else brick(c, face);
    poly(c, endFace, paper ? paper.low : '#7d3530');
    // the cap along the top (the cut-away edge), in trim
    poly(c, [up(A), up(B), up(C), up(D)], '#fff1e2');
    line(c, up(s.axis === 'x' ? D : B), up(C), INK); line(c, up(A), up(s.axis === 'x' ? B : D), 'rgba(59,36,48,.5)');
    // December's string lights along the top of the walls that stay up (look-iso-v1; bible, Title and cover: December lights)
    if (look.december && s.back && hi >= SS.WALL_UP) {
      for (var k2 = .15; k2 < 1; k2 += .3) {
        var dip = Math.abs(Math.sin((k2 + s.x + s.y) * 2.2)) * 4, lp = fa(k2, hi - 4 - dip), on = (Math.floor(t / 2) + Math.round(k2 * 10) + s.x + s.y) % 5 !== 0;
        if (on) { c.fillStyle = 'rgba(255,225,150,.35)'; c.beginPath(); c.arc(lp[0], lp[1], 2.5, 0, 7); c.fill(); }
        R(c, lp[0] - .5, lp[1] - .5, 2, 2, on ? ((s.x + k2 * 10) % 2 < 1 ? '#ffd56b' : '#fff3a8') : '#a08880');
      }
    }
    if (hi >= SS.WALL_UP && lo === 0) {
      // a window: glass with the sky of this time of day (spec 006, part A: the light looks), snowy rooftops, a sill
      if (s.win) drawWindow(c, s, fa, faceAt, !!paper, look, t);
      if (s.op === 'door') drawDoor(c, s, fa, faceAt, !!paper);
    }
    return true;
  }
  function drawWindow(c, s, fa, faceAt, inside, look, t) {
    var w = s.win, u0 = w.start ? .12 : 0, u1 = w.end ? .88 : 1, b0 = 14, b1 = 38;
    poly(c, faceAt(u0 - (w.start ? .05 : 0), u1 + (w.end ? .05 : 0), b0 - 2, b1 + 2), '#fff1e2');
    var gl = faceAt(u0 + .04, u1 - .04, b0, b1);
    if (inside) {
      var g = c.createLinearGradient(0, gl[3][1] - 4, 0, gl[0][1]); g.addColorStop(0, look.sky[0]); g.addColorStop(1, look.sky[1]);
      poly(c, gl, g);
      SS.clip(c, gl, function () {
        // rooftops across the street, with lit windows at night
        for (var k = 0; k < 3; k++) { var a = fa(u0 + k * .3, b0), top = 10 + ((s.x * 3 + s.y + k) % 3) * 3; R(c, a[0], a[1] - top - 6, 8, top + 6, ['#b46a5a', '#9e5a4e', '#b9786a'][k]); R(c, a[0], a[1] - top - 8, 8, 2, look.snow ? '#f7fbff' : '#8e5a4e'); if (look.dark > .3) { R(c, a[0] + 2, a[1] - top, 2, 2, '#ffd98a'); R(c, a[0] + 5, a[1] - top + 4, 2, 2, '#ffd98a'); } }
        if (look.fireworks && look.dark > .3) for (var fw = 0; fw < 2; fw++) { // the Fourth of July: fireworks over the street after dark (spec 009, part B)
          var ph = (t + fw * 5 + s.x) % 12, fc = fa(u0 + .3 + fw * .35, b1 - 6 - fw * 4), col = ['#ffd56b', '#e46f8b', '#8fd0ff'][(Math.floor((t + fw * 5) / 12) + fw) % 3];
          if (ph < 8) for (var ray = 0; ray < 8; ray++) { var an = ray * Math.PI / 4, rr = 1 + ph * .7; R(c, fc[0] + Math.cos(an) * rr, fc[1] + Math.sin(an) * rr * .8, 1, 1, ph > 5 ? 'rgba(255,240,200,.6)' : col); }
        }
        if (look.stars) for (var i = 0; i < 4; i++) { var sp = fa(u0 + .1 + i * .2, b1 - 3 - (i % 2) * 4); R(c, sp[0], sp[1], 1, 1, '#fff'); }
        if (look.snow) for (var j = 0; j < 5; j++) { var sx = fa(u0 + ((j * .23 + t * .013 * (1 + j % 2)) % 1) * (u1 - u0), b1 - ((j * 7 + t * 1.3) % 24)); R(c, sx[0], sx[1], 1, 1, 'rgba(255,255,255,.9)'); }
      });
    } else {
      var lit = look.dark > .2;
      var g2 = c.createLinearGradient(0, gl[3][1], 0, gl[0][1]); g2.addColorStop(0, lit ? '#ffe3a0' : '#bcd3e6'); g2.addColorStop(1, lit ? '#f0a95a' : '#8fb0cc');
      poly(c, gl, g2);
    }
    var m1 = faceAt(.5, .5, b0, b1); line(c, m1[0], m1[3], '#fff1e2'); var m2 = faceAt(u0, u1, 26, 26); line(c, m2[0], m2[1], '#fff1e2');
    poly(c, faceAt(u0 - (w.start ? .08 : 0), u1 + (w.end ? .08 : 0), b0 - 3, b0 - 1), inside ? '#f1dcc8' : '#f4f1fb');
  }
  function drawDoor(c, s, fa, faceAt, inside) {
    poly(c, faceAt(.12, .88, 0, 34), '#fff1e2');
    var leaf = faceAt(.18, .82, 0, 32);
    poly(c, leaf, s.ext ? '#3d6b5c' : '#b9804f', INK);
    [[.24, .48, 18, 29], [.52, .76, 18, 29], [.24, .48, 3, 15], [.52, .76, 3, 15]].forEach(function (q) { poly(c, faceAt(q[0], q[1], q[2], q[3]), s.ext ? '#4a7d6c' : '#dca474'); });
    var k = fa(.72, 16); R(c, k[0], k[1], 2, 2, '#ffd56b');
    if (s.ext && !inside) { var wr = fa(.5, 25); c.strokeStyle = '#3f6e4a'; c.lineWidth = 2; c.beginPath(); c.arc(wr[0], wr[1], 3.5, 0, 7); c.stroke(); c.lineWidth = 1; R(c, wr[0] - 1, wr[1] + 3, 3, 2, '#e46f8b'); }
  }

  // this floor's walls as the view sees them (view.js), made once per turn
  function viewWalls(W, f) {
    var C = W._vw || (W._vw = {});
    if (C.k !== SS.view.k || C.walls !== W.walls) { C.k = SS.view.k; C.walls = W.walls; C.f = {}; }
    if (!C.f[f]) { var segs = (W.walls[f] || []).map(SS.vseg); segs.key = {}; segs.forEach(function (q) { segs.key[q.x + ',' + q.y + q.axis] = q; }); C.f[f] = segs; }
    return C.f[f];
  }
  SS.viewWalls = viewWalls;
  // ---------- stairs and banisters ----------
  function stairItems(W, s, Z, items) { // a straight flight of steps rising toward its top, two steps a tile
    // Like build-v1: each step is a box with a light nosing on its front edge, and one solid stringer runs along the open
    // side (the +x side of a flight along y, the +y side of a flight along x), so the run reads as one flight, not a stack.
    var n = s.tiles.length * 2, L = s.tiles.length, dx = s.tiles[1][0] - s.tiles[0][0], dy = s.tiles[1][1] - s.tiles[0][1];
    var rise = function (t) { return FH * ((t / L) * (n / (n + 1)) + 1 / (n + 1)); };   // the stringer's top, t tiles up the flight
    for (var k = 0; k < n; k++) {
      var tl = s.tiles[Math.floor(k / 2)], half = k % 2;
      var x0 = tl[0] + (dx > 0 ? half * .5 : dx < 0 ? (1 - half) * .5 : 0), y0 = tl[1] + (dy > 0 ? half * .5 : dy < 0 ? (1 - half) * .5 : 0);
      var w = dx ? .5 : 1, d = dy ? .5 : 1;
      var h = FH * (k + 1) / (n + 1);
      (function (x0, y0, w, d, h, k) {
        items.push({ kind: 'step', x0: x0, x1: x0 + w, y0: y0, y1: y0 + d, z0: Z, z1: Z + h, draw: function (c) {
          I.box(c, x0, y0, w, d, h, Z, ['#ecbd8a', '#c48a58', '#a06a40']);
          // the nosing: the step's front edge, toward the bottom of the flight
          if (dy) { var ny = dy < 0 ? y0 + d : y0; line(c, Q(x0, ny, Z + h), Q(x0 + w, ny, Z + h), '#fbe0bd'); }
          else { var nx = dx < 0 ? x0 + w : x0; line(c, Q(nx, y0, Z + h), Q(nx, y0 + d, Z + h), '#fbe0bd'); }
          // this step's slice of the stringer: no seams between slices, so the side is one solid board
          var tA = k * .5, tB = (k + 1) * .5, a, b;   // a: the slice's lower end, b: its upper end
          if (dy) { var xs = x0 + w; a = dy < 0 ? [xs, y0 + d] : [xs, y0]; b = dy < 0 ? [xs, y0] : [xs, y0 + d]; }
          else { var ys = y0 + d; a = dx < 0 ? [x0 + w, ys] : [x0, ys]; b = dx < 0 ? [x0, ys] : [x0 + w, ys]; }
          var zA = Z + rise(tA), zB = Z + rise(tB);
          poly(c, [Q(a[0], a[1], Z), Q(a[0], a[1], zA), Q(b[0], b[1], zB), Q(b[0], b[1], Z)], '#8e5a37');
          poly(c, [Q(a[0], a[1], zA - 3), Q(a[0], a[1], zA), Q(b[0], b[1], zB), Q(b[0], b[1], zB - 3)], '#b9804f');
          line(c, Q(a[0], a[1], zA), Q(b[0], b[1], zB), '#55311d');
          if (k === 0) line(c, Q(a[0], a[1], Z), Q(a[0], a[1], zA), '#55311d');
        } });
      })(x0, y0, w, d, h, k);
    }
  }
  function railItems(W, f, Z, items) { // banisters on the open sides of each stairwell on this floor
    var VS = viewWalls(W, f);
    W.stairs.map(SS.vstair).forEach(function (s) {
      if (s.floor + 1 !== f) return;
      var xs = s.tiles.map(function (q) { return q[0]; }), ys = s.tiles.map(function (q) { return q[1]; });
      var x0 = Math.min.apply(0, xs), x1 = Math.max.apply(0, xs) + 1, y0 = Math.min.apply(0, ys), y1 = Math.max.apply(0, ys) + 1;
      var sides = [];
      if (!VS.key[x1 + ',' + y0 + 'y']) sides.push([[x1, y0], [x1, y1]]);
      if (!VS.key[x0 + ',' + y1 + 'x']) sides.push([[x0, y1], [x1, y1]]);
      if (!VS.key[x0 + ',' + y0 + 'x'] && !(s.to[1] < y0)) sides.push([[x0, y0], [x1, y0]]);
      sides.forEach(function (sd) {
        var a = sd[0], b = sd[1];
        var ex = a[0] === b[0] ? .05 : -.1, ey = a[1] === b[1] ? .05 : -.1;   // thin across, kept short of its ends so it never reaches into a wall's line
        items.push({ kind: 'rail', x0: Math.min(a[0], b[0]) - ex, x1: Math.max(a[0], b[0]) + ex, y0: Math.min(a[1], b[1]) - ey, y1: Math.max(a[1], b[1]) + ey, z0: Z, z1: Z + 14, draw: function (c) {
          var n = Math.max(2, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) * 3));
          for (var q = 1; q < n; q++) { var pt = Q(a[0] + (b[0] - a[0]) * q / n, a[1] + (b[1] - a[1]) * q / n, Z); R(c, pt[0], pt[1] - 11, 1, 11, '#8e5a37'); }
          var t1 = Q(a[0], a[1], Z + 12), t2 = Q(b[0], b[1], Z + 12); line(c, t1, t2, '#55311d', 2); line(c, [t1[0], t1[1] - 1], [t2[0], t2[1] - 1], '#dca474');
          [a, b].forEach(function (q) { I.box(c, q[0] - .06, q[1] - .06, .12, .12, 14, Z, ['#dca474', '#b9804f', '#8e5a37']); });
        } });
      });
    });
  }

  // ---------- pieces (each drawn once into its own small canvas, then reused) ----------
  var SPR = {};
  SS.spriteKey = function (p, d, W, t) {
    var anim = d.anim ? t % d.anim : 0;
    if (d.moves === 'tick') anim = new Date().getMinutes();
    if (d.use === 'tv' && p.lit) anim = Math.floor(t / 2) % 4 + 10;
    if (d.use === 'bowl') anim = SS.G && SS.G.catFull ? 1 : 0;
    if (d.use === 'litter') anim = SS.G && SS.G.litterLow ? 1 : 0;
    var free = W ? d.spots.map(function (_, i) { return W.spotFree(p, i) ? 1 : 0; }).join('') : '';
    return [p.id, p.r || 0, p.wall ? p.wall[2] : '', p.sw || 0, JSON.stringify(p.colors || 0), JSON.stringify(p.pats || 0), p.props === false ? 0 : 1, p.lit ? 1 : 0, p.work ? 1 : 0, free, anim].join('|');
  };
  SS.pieceSprite = function (p, W, t, place) {
    var d = SS.DEF[p.id], key = SS.spriteKey(p, d, W, t) + '|' + (place.rot || 0);
    var cache = SPR[p.uid] || (SPR[p.uid] = {});
    if (cache.key === key) return cache;
    // draw the piece at the origin (turn and wall side from its place) and keep its bounds
    var rot = place.rot || 0, sz = rot % 2 ? [d.d, d.w] : [d.w, d.d];
    var pts = [I.p(-.8, -.8, 0), I.p(sz[0] + .8, -.8, 0), I.p(sz[0] + .8, sz[1] + .8, 0), I.p(-.8, sz[1] + .8, 0)];
    var bb = SS.bounds(pts), top = bb[1] - (d.h || 40) - 16 - (place.zl || 0), wpx = Math.ceil(bb[2] - bb[0]) + 8, hpx = Math.ceil(bb[3] - top) + 4;
    var cv = cache.cv && cache.cv.width === wpx && cache.cv.height === hpx ? cache.cv : document.createElement('canvas');
    cv.width = wpx; cv.height = hpx;
    var c = cv.getContext('2d'); c.clearRect(0, 0, wpx, hpx);
    var ox = Math.round(-bb[0] + 4), oy = Math.round(-top);
    c.save(); c.translate(ox, oy);
    var M = SS.Model(c, d, p, { x: 0, y: 0, z: place.zl || 0, rot: rot }, t);
    d.draw(M, t, function (i) { return W ? W.spotFree(p, i) : true; });
    M.draw(); c.restore();
    SPR[p.uid] = { key: key, cv: cv, ox: ox, oy: oy };
    return SPR[p.uid];
  };
  SS.forgetSprite = function (uid) { delete SPR[uid]; };

  // ---------- the whole scene ----------
  // o = {floor, walls: 'up'|'cut'|'down', t, look, agents: [...], ghost, glows: [{f, tiles, ok}], sel, hidden (uid), mode}
  var BASE = {};
  SS.drawScene = function (c, W, o) {
    var F = o.floor, t = o.t, look = o.look;
    SS.setLot(W.lot); if (c.canvas.width !== WORLD[0] || c.canvas.height !== WORLD[1]) { c.canvas.width = WORLD[0]; c.canvas.height = WORLD[1]; }
    c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, WORLD[0], WORLD[1]);
    c.setTransform(1, 0, 0, 1, OFF[0], OFF[1]);
    var hits = [];
    // the ground, the floor below (dimmed) and this floor's tiles only change when something is placed or the view
    // changes, so they're drawn once into a layer and reused (o.version counts changes to the home)
    var key = [F, o.version, look.snow ? 1 : 0, W.pieces.length, SS.view.k, o.walls].join('|');
    if (BASE.key !== key) {
      var b = BASE.cv || (BASE.cv = document.createElement('canvas')); b.width = WORLD[0]; b.height = WORLD[1];
      var bc = b.getContext('2d'); bc.setTransform(1, 0, 0, 1, OFF[0], OFF[1]);
      drawGround(bc, W, 0, look);
      if (F > 0) {
        // every floor below, with its walls as the walls button says, so the home reads as one building (Keegan, Nov 26: with
        // only the floor just below, and its walls always down, an upper floor looked like it floated over the one under it)
        for (var fb = 0; fb < F; fb++) drawFloorLayer(bc, W, fb, o, null, true);
        // dim everything drawn so far (the floor below and the ground), then draw the flight up undimmed
        bc.save(); bc.setTransform(1, 0, 0, 1, 0, 0); bc.globalCompositeOperation = 'source-atop'; bc.fillStyle = 'rgba(34,23,31,.55)'; bc.fillRect(0, 0, WORLD[0], WORLD[1]); bc.restore();
        var fl = []; if (o.walls !== 'up') W.stairs.forEach(function (s) { if (s.floor === F - 1) stairItems(W, SS.vstair(s), (F - 1) * FH, fl); });
        fl.forEach(function (it) { it.draw(bc); });   // the flight up, undimmed (with the walls up, the walls below hide it)
      }
      drawFloorTiles(bc, W, F, F * FH);
      BASE.key = key;
    }
    c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(BASE.cv, 0, 0); c.setTransform(1, 0, 0, 1, OFF[0], OFF[1]);
    drawFloorLayer(c, W, F, o, hits, false, true);
    // light: the time-of-day tint over the home, then the lamps' glow (spec 006, part A)
    applyLight(c, W, F, o);
    c.setTransform(1, 0, 0, 1, 0, 0);
    return hits;
  };

  function drawFloorLayer(c, W, f, o, hits, dimmed, tilesDone) {
    var Z = f * FH, t = o.t, look = o.look, mode = o.walls;
    if (!tilesDone) drawFloorTiles(c, W, f, Z);
    // tile glows under a piece being placed (green fits, rose doesn't; a check or a cross too, so color isn't the only sign)
    if (!dimmed && o.glows) o.glows.forEach(function (g) {
      g.tiles.forEach(function (q) { poly(c, [P(q[0], q[1], Z), P(q[0] + 1, q[1], Z), P(q[0] + 1, q[1] + 1, Z), P(q[0], q[1] + 1, Z)], g.sel ? 'rgba(228,111,139,.25)' : g.ok ? 'rgba(143,208,140,.5)' : 'rgba(228,111,139,.45)', g.sel ? null : 'rgba(255,255,255,.85)'); });
    });
    var items = [];
    // rugs lie flat under everything
    W.pieces.forEach(function (p) {
      var d = W.def(p); if (p.f !== f || d.kind !== 'rug' || p.uid === o.hidden) return;
      var vq = SS.vplace(p.x, p.y, p.r || 0, d.w, d.d), sp = SS.pieceSprite(p, W, t, { rot: vq.rot }), q = Q(vq.x, vq.y, Z);
      c.drawImage(sp.cv, Math.round(q[0] - sp.ox), Math.round(q[1] - sp.oy));
      if (hits) hits.push({ p: p, sp: sp, x: Math.round(q[0] - sp.ox), y: Math.round(q[1] - sp.oy), rug: true });
    });
    // walls
    // walls go in back to front: the far outside walls, the inside walls, then the near outside walls, each by depth, since the
    // sort never compares two walls (engine/iso.js); a near wall then always covers the end of an inside wall, in every turn
    var rank = function (s) { return s.back ? 0 : s.ext ? 2 : 1; };
    viewWalls(W, f).slice().sort(function (a, b) { return rank(a) - rank(b) || (a.x + a.y) - (b.x + b.y); }).forEach(function (s) {
      var th = .07, H = wallHeight(s, mode);
      items.push({ kind: 'wall', s: s, plane: { axis: s.axis, at: s.axis === 'x' ? s.y : s.x }, x0: s.axis === 'x' ? s.x : s.x - th, x1: s.axis === 'x' ? s.x + 1 : s.x + th, y0: s.axis === 'x' ? s.y - th : s.y, y1: s.axis === 'x' ? s.y + th : s.y + 1, z0: Z, z1: Z + H,
        draw: function (c) { drawWall(c, W, s, Z, mode, look, t); } });
    });
    W.stairs.forEach(function (s) { if (s.floor === f) stairItems(W, SS.vstair(s), Z, items); });
    railItems(W, f, Z, items);
    // pieces
    var byUid = {};
    W.pieces.forEach(function (p) {
      var d = W.def(p); if (d.kind === 'rug' || W.floorOf(p) !== f || p.uid === o.hidden) return;
      if (p.host && o.hidden && isUnder(W, p, o.hidden)) return;
      var it = pieceItem(W, p, d, Z, t, mode);
      if (!it) return;
      byUid[p.uid] = it; items.push(it);
    });
    items.forEach(function (it) { if (it.p && it.p.host && byUid[it.p.host]) it.after = byUid[it.p.host]; });
    // people and cats
    if (!dimmed && o.agents) o.agents.forEach(function (a) {
      if (a.f !== f && !(a.climb && a.climb.floor + 1 === f)) return;
      var at = a.at || { x: a.x, y: a.y };
      var vc = SS.vxy(at.x, at.y);
      var it = { kind: 'agent', a: a, x0: vc[0] - .2, x1: vc[0] + .2, y0: vc[1] - .2, y1: vc[1] + .2, z0: Z + (a.z || 0), z1: Z + (a.z || 0) + 30, draw: function (c) { a.draw(c, P(at.x, at.y, Z + (a.z || 0))); } };
      if (a.on && byUid[a.on]) it.after = byUid[a.on];
      items.push(it);
    });
    if (!dimmed && o.ghost && o.ghost.f === f) items.push(o.ghost.item(Z));
    // project and sort
    items.forEach(function (it) {
      var pts = [Q(it.x0, it.y0, it.z1), Q(it.x1, it.y0, it.z1), Q(it.x1, it.y1, it.z0), Q(it.x0, it.y1, it.z0), Q(it.x1, it.y1, it.z1), Q(it.x0, it.y1, it.z1), Q(it.x1, it.y0, it.z0)];   // the boxes are already in the view
      var bb = SS.bounds(pts); it.l = bb[0]; it.t = bb[1]; it.r = bb[2]; it.b = bb[3];
      // a piece's drawing can spill past its box (a plant's leaves, a lamp's shade, an easel's legs): against walls, sort by
      // what's drawn
      if (it.kind === 'piece') it.drawn = [Math.min(it.l, it.dx), Math.min(it.t, it.dy), Math.max(it.r, it.dx + it.sp.cv.width), Math.max(it.b, it.dy + it.sp.cv.height)];
    });
    StudioIso.sort(items).forEach(function (it) {
      if (it.kind === 'piece') {
        var sp = it.sp; c.drawImage(sp.cv, it.dx, it.dy);
        if (o.sel === it.p.uid) { c.save(); c.globalCompositeOperation = 'source-atop'; c.restore(); }
        if (hits) hits.push({ p: it.p, sp: sp, x: it.dx, y: it.dy });
      } else it.draw(c);
      if (it.kind === 'agent' && hits) hits.push({ agent: it.a, box: [it.l, it.t, it.r, it.b] });
    });
  }
  function isUnder(W, p, uid) { var h = W.hostOf(p); return !!h && (h.uid === uid || isUnder(W, h, uid)); }
  function pieceItem(W, p, d, Z, t, mode) {
    // every piece is drawn at its own turn plus the view's, from its footprint's corner as the view sees it (view.js)
    if (p.wall) {
      var s = W.seg(p.f, p.wall[0], p.wall[1], p.wall[2]);
      if (!s || wallHeight(SS.vseg(s), mode) < SS.WALL_UP) return null;   // wall pieces go with their wall when it's cut down
      var wp = W.wallPlace(p), vw = SS.vplace(wp.x, wp.y, wp.rot, d.w, d.d);
      var sp0 = SS.pieceSprite(p, W, t, { rot: vw.rot }), q0 = Q(vw.x, vw.y, Z + wp.z);
      // for sorting, a wall piece lies flat against its own side of its wall, so anything standing in the room in front of it
      // (a counter under a window, a fridge beside it) always draws over it. Curtains hang a little past the window each side.
      var ax = p.wall[2] === 'x', wl = ax ? p.wall[1] : p.wall[0], along = ax ? p.wall[0] : p.wall[1], pad = d.window ? .2 : 0;
      var nb = (p.side || 1) < 0 ? [wl - .06, wl] : [wl, wl + .06], a0 = along - pad, a1 = along + d.w + pad;
      var vb = ax ? SS.vrect(a0, nb[0], a1, nb[1]) : SS.vrect(nb[0], a0, nb[1], a1);
      return { kind: 'piece', p: p, sp: sp0, dx: Math.round(q0[0] - sp0.ox), dy: Math.round(q0[1] - sp0.oy), x0: vb[0], x1: vb[2], y0: vb[1], y1: vb[3], z0: Z + wp.z, z1: Z + wp.z + d.h };
    }
    if (p.host) {
      var host = W.hostOf(p), pos = W.spotPos(host, p.spot), vh = SS.vplace(pos.x - .5, pos.y - .5, p.r || 0, d.w, d.d), vc = SS.vxy(pos.x, pos.y);
      var sp1 = SS.pieceSprite(p, W, t, { rot: vh.rot }), q1 = Q(vh.x, vh.y, Z + pos.z);
      return { kind: 'piece', p: p, sp: sp1, dx: Math.round(q1[0] - sp1.ox), dy: Math.round(q1[1] - sp1.oy), x0: vc[0] - .15, x1: vc[0] + .15, y0: vc[1] - .15, y1: vc[1] + .15, z0: Z + pos.z, z1: Z + pos.z + d.h };
    }
    var vq = SS.vplace(p.x, p.y, p.r || 0, d.w, d.d), sp = SS.pieceSprite(p, W, t, { rot: vq.rot }), q = Q(vq.x, vq.y, Z), ft = W.foot(p);
    // the sort box sits inside the walls' thickness (.07 each side), so a piece pushed against a wall never overlaps it and
    // always sorts on the right side of it (Keegan's playtest, Nov 26: pieces by the front walls drew over them with walls up)
    var ins = d.kind === 'small' ? .3 : .1, vb2 = SS.vrect(ft[0] + ins, ft[1] + ins, ft[2] - ins, ft[3] - ins);
    return { kind: 'piece', p: p, sp: sp, dx: Math.round(q[0] - sp.ox), dy: Math.round(q[1] - sp.oy), x0: vb2[0], x1: vb2[2], y0: vb2[1], y1: vb2[3], z0: Z, z1: Z + (d.h || 20) };
  }

  // ---------- light ----------
  var MASK = null;
  function maskCanvas() { if (!MASK || MASK.width !== WORLD[0] || MASK.height !== WORLD[1]) { MASK = document.createElement('canvas'); MASK.width = WORLD[0]; MASK.height = WORLD[1]; } return MASK; }
  function applyLight(c, W, F, o) {
    var L = o.look;
    if (L.tint) { // multiply the light's color over what's drawn (masked, so empty parts of the world canvas stay empty)
      var m = maskCanvas(), mc = m.getContext('2d');
      mc.globalCompositeOperation = 'copy'; mc.fillStyle = L.tint; mc.fillRect(0, 0, WORLD[0], WORLD[1]);
      mc.globalCompositeOperation = 'destination-in'; mc.drawImage(c.canvas, 0, 0);
      c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'multiply'; c.drawImage(m, 0, 0); c.restore();
    }
    // lamp glow: soft warm pools, much stronger in the dark (look-iso-v1's lamp glow)
    var k = L.glow;
    if (k <= 0) return;
    c.save(); c.globalCompositeOperation = 'lighter';
    W.pieces.forEach(function (p) {
      var d = W.def(p); if (!d.light || !p.lit || W.floorOf(p) !== F) return;
      var pos, Z = F * FH;
      if (p.host) { var sp = W.spotPos(W.hostOf(p), p.spot); pos = P(sp.x, sp.y, Z + sp.z + d.light.h); }
      else if (p.wall) { var wp = W.wallPlace(p), Mw = SS.Model(null, d, p, { x: wp.x, y: wp.y, rot: wp.rot }), qw = Mw.wp(d.light.u, d.light.v); pos = P(qw[0], qw[1], Z + wp.z + d.light.h); }
      else { var M = SS.Model(null, d, p, { x: p.x, y: p.y, rot: p.r || 0 }); var q = M.wp(d.light.u, d.light.v); pos = P(q[0], q[1], Z + d.light.h); }
      var a = (.2 + .03 * Math.sin(o.t / 3 + p.uid)) * k, r = d.light.r * (.8 + .5 * Math.min(1.2, k));
      var g = c.createRadialGradient(pos[0], pos[1], 2, pos[0], pos[1] + 10, r); g.addColorStop(0, 'rgba(255,200,120,' + a + ')'); g.addColorStop(1, 'rgba(255,200,120,0)');
      c.fillStyle = g; c.fillRect(pos[0] - r, pos[1] - r, r * 2, r * 2 + 10);
    });
    c.restore();
  }

  // ---------- picking ----------
  // what's under a world point: a person or cat, then a piece (by its drawn pixels, front first), else nothing
  SS.pick = function (hits, wx, wy, opts) {
    opts = opts || {};
    for (var i = hits.length - 1; i >= 0; i--) {
      var h = hits[i];
      if (h.agent) { if (opts.noAgents) continue; var b = h.box; if (wx >= b[0] - 2 && wx <= b[2] + 2 && wy >= b[1] && wy <= b[3]) return { agent: h.agent }; continue; }
      var lx = Math.floor(wx - h.x), ly = Math.floor(wy - h.y);
      if (lx < 0 || ly < 0 || lx >= h.sp.cv.width || ly >= h.sp.cv.height) continue;
      if (!h.sp.alpha) { h.sp.alpha = h.sp.cv.getContext('2d').getImageData(0, 0, h.sp.cv.width, h.sp.cv.height).data; h.sp.aw = h.sp.cv.width; }
      var hit = false;
      for (var dx = -1; dx <= 1 && !hit; dx++) for (var dy = -1; dy <= 1 && !hit; dy++) { var X = lx + dx, Y = ly + dy; if (X >= 0 && Y >= 0 && X < h.sp.aw && Y < h.sp.cv.height && h.sp.alpha[(Y * h.sp.aw + X) * 4 + 3] > 60) hit = true; }
      if (hit) return { piece: h.p };
    }
    return null;
  };
})();
