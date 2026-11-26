// Sarah's Sim piece model: every piece is drawn from boxes, cylinders and small sprites in its own local space, so all
// four turns come out right (bible, Decorating, Placing: pieces turn 4 ways). The look follows mockups/furniture-sheet-v1
// (Rich detail: outlines, 3 to 4 tones, fabric weave, wood grain, piping, props). Light from the upper left: a box's top is
// the light tone, its left-front (+y) face the base and its right-front (+x) face the shade (bible, Art).
// Texture is light shading only, so it shows under any color; a painted pattern replaces it on its part
// (bible, Decorating, Furniture art; spec 001, part D).
//
// Local space: a piece is w x d tiles at turn 0, u along x and v along y; v = 0 is its back, v = d its front (the side
// that faces the left-front at turn 0). Heights are px above where it stands.
(function () {
  var I = SS.I = StudioIso.grid(22, 11);
  var INK = 'rgba(59,36,48,.85)';
  var poly = StudioIso.poly;

  // texture patterns, made once
  var PAT = {};
  function pat(c, key, w, h, draw) {
    if (!PAT[key]) { var cv = document.createElement('canvas'); cv.width = w; cv.height = h; draw(cv.getContext('2d')); PAT[key] = cv; }
    return c.createPattern(PAT[key], 'repeat');
  }
  function clip(c, pts, fn) { c.save(); c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (var i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); c.clip(); fn(); c.restore(); }
  function bounds(pts) { var l = 1e9, r = -1e9, t = 1e9, b = -1e9; pts.forEach(function (p) { l = Math.min(l, p[0]); r = Math.max(r, p[0]); t = Math.min(t, p[1]); b = Math.max(b, p[1]); }); return [l, t, r, b]; }
  function lerp(a, b, k) { return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]; }
  function line(c, a, b, col, w) { c.strokeStyle = col; c.lineWidth = w || 1; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); c.lineWidth = 1; }
  SS.line = line; SS.clip = clip; SS.lerp = lerp;

  // a painted pattern over a face (fabric parts only), drawn in screen space so it reads at this size
  function pattern(c, pts, name, R) {
    clip(c, pts, function () {
      var b = bounds(pts), x, y;
      if (name === 'stripes') { for (x = Math.floor(b[0]); x < b[2]; x += 4) { c.fillStyle = R[3]; c.globalAlpha = .55; c.fillRect(x, b[1], 2, b[3] - b[1]); } }
      else if (name === 'plaid') { c.globalAlpha = .5; for (x = Math.floor(b[0]); x < b[2]; x += 6) { c.fillStyle = R[3]; c.fillRect(x, b[1], 2, b[3] - b[1]); } for (y = Math.floor(b[1]); y < b[3]; y += 6) { c.fillStyle = R[3]; c.fillRect(b[0], y, b[2] - b[0], 2); } c.globalAlpha = .7; for (x = Math.floor(b[0]) + 3; x < b[2]; x += 12) { c.fillStyle = '#fff6ea'; c.fillRect(x, b[1], 1, b[3] - b[1]); } }
      else if (name === 'floral') { for (y = Math.floor(b[1]) + 1; y < b[3]; y += 5) for (x = Math.floor(b[0]) + ((y >> 2) % 2) * 3; x < b[2]; x += 6) { c.globalAlpha = .9; c.fillStyle = '#fff6ea'; c.fillRect(x, y, 1, 1); c.fillRect(x + 2, y, 1, 1); c.fillRect(x + 1, y - 1, 1, 1); c.fillRect(x + 1, y + 1, 1, 1); c.fillStyle = '#e7b75f'; c.fillRect(x + 1, y, 1, 1); } }
      else if (name === 'leopard') { for (y = Math.floor(b[1]); y < b[3]; y += 4) for (x = Math.floor(b[0]) + ((y >> 2) % 2) * 2; x < b[2]; x += 5) { c.globalAlpha = .85; c.fillStyle = R[3]; c.fillRect(x, y, 2, 1); c.fillRect(x, y + 1, 1, 1); c.fillStyle = '#d9b48c'; c.fillRect(x + 1, y + 1, 1, 1); } }
      else if (name === 'dots') { for (y = Math.floor(b[1]) + 1; y < b[3]; y += 3) for (x = Math.floor(b[0]) + ((y / 3 | 0) % 2) * 2; x < b[2]; x += 4) { c.globalAlpha = .9; c.fillStyle = R[0] === '#ffffff' ? R[3] : '#fff6ea'; c.fillRect(x, y, 1, 1); } }
      c.globalAlpha = 1;
    });
  }
  // fill a face: flat color, then its texture
  function face(c, pts, col, tex, patName, R, kind) {
    poly(c, pts, col);
    if (patName && patName !== 'plain' && tex === 'fab') { pattern(c, pts, patName, R); return; }
    if (tex === 'fab') { c.fillStyle = pat(c, 'weave', 4, 4, function (q) { q.fillStyle = 'rgba(0,0,0,.08)'; q.fillRect(0, 0, 1, 1); q.fillRect(2, 2, 1, 1); q.fillStyle = 'rgba(255,255,255,.06)'; q.fillRect(2, 0, 1, 1); }); poly(c, pts, c.fillStyle); }
    else if (tex === 'wood') {
      clip(c, pts, function () {
        if (kind === 'top') {
          var horiz = Math.hypot(pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]) >= Math.hypot(pts[3][0] - pts[0][0], pts[3][1] - pts[0][1]);
          var a0 = pts[0], a1 = horiz ? pts[3] : pts[1], b0 = horiz ? pts[1] : pts[3], b1 = pts[2];
          var n = Math.max(1, Math.floor(Math.hypot(a1[0] - a0[0], a1[1] - a0[1]) / 3));
          for (var k = 1; k < n; k++) line(c, lerp(a0, a1, k / n), lerp(b0, b1, k / n), 'rgba(110,60,30,.2)');
        } else {
          var hgt = pts[0][1] - pts[3][1];
          for (var y = 3; y < hgt; y += 4) line(c, [pts[0][0], pts[0][1] - y], [pts[1][0], pts[1][1] - y + (y % 8 ? 0 : 1)], 'rgba(110,60,30,.16)');
        }
      });
    } else if (tex === 'metal' && kind !== 'top') {
      clip(c, pts, function () { var b = bounds(pts); c.fillStyle = 'rgba(255,255,255,.22)'; c.fillRect(b[0] + 1, b[1], 1, b[3] - b[1]); });
    }
  }

  // the builder for one piece at one place. place = {x, y, z, rot}; def = the catalog row; inst = the placed piece
  function Model(c, def, inst, place, t) {
    var rot = place.rot || 0, X = place.x, Y = place.y, Z = place.z || 0, w = def.w, d = def.d;
    var prims = [];
    var M = {
      c: c, t: t || 0, def: def, inst: inst, rot: rot, Z: Z,
      wp: function (u, v) {
        if (rot === 1) return [X + d - v, Y + u];
        if (rot === 2) return [X + w - u, Y + d - v];
        if (rot === 3) return [X + v, Y + w - u];
        return [X + u, Y + v];
      },
      p: function (u, v, h) { var q = M.wp(u, v); return I.p(q[0], q[1], Z + (h || 0)); },
      // is the local face toward +u, -u, +v or -v facing the viewer?
      vis: function (f) {
        var dirs = [{ '+u': '+x', '+v': '+y', '-u': '-x', '-v': '-y' }, { '+u': '+y', '+v': '-x', '-u': '-y', '-v': '+x' }, { '+u': '-x', '+v': '-y', '-u': '+x', '-v': '+y' }, { '+u': '-y', '+v': '+x', '-u': '+y', '-v': '-x' }][rot];
        return dirs[f] === '+x' || dirs[f] === '+y';
      },
      ramp: function (part) {
        if (part && part.charAt && part.charAt(0) === '#') return StudioIso.ramp(part);
        var col = (inst && inst.colors && inst.colors[part]) || (def.swatches[(inst && inst.sw) || 0] || def.swatches[0])[part] || '#c88d5a';
        return StudioIso.ramp(col);
      },
      tex: function (part) { if (part && part.charAt && part.charAt(0) === '#') return null; var q = def.parts.filter(function (p) { return p[0] === part; })[0]; return q ? q[1] : null; },
      patOf: function (part) { return inst && inst.pats && inst.pats[part]; },
      props: function () { return !inst || inst.props !== false; },
      // a box: local u, v, size bw x bd tiles, height h px, lifted z px. part: a part name or a '#hex' color.
      // o.cols [top, left, right] overrides; o.line false: no outline; o.tex: texture override
      box: function (u, v, bw, bd, h, z, part, o) {
        o = o || {}; z = z || 0;
        var a = M.wp(u, v), b = M.wp(u + bw, v + bd);
        var pr = { kind: 'box', x0: Math.min(a[0], b[0]), x1: Math.max(a[0], b[0]), y0: Math.min(a[1], b[1]), y1: Math.max(a[1], b[1]), z0: Z + z, z1: Z + z + h, part: part, o: o, deco: [] };
        prims.push(pr); return pr;
      },
      // an upright cylinder, center u, v, radius r tiles
      cyl: function (u, v, r, h, z, part, o) {
        var q = M.wp(u, v); z = z || 0;
        var pr = { kind: 'cyl', cx: q[0], cy: q[1], rad: r, x0: q[0] - r, x1: q[0] + r, y0: q[1] - r, y1: q[1] + r, z0: Z + z, z1: Z + z + h, part: part, o: o || {}, deco: [] };
        prims.push(pr); return pr;
      },
      // a small hand-drawn sprite anchored at a local point (leaves, a shade, a candle); e = [half size tiles, height px]
      spr: function (u, v, z, fn, e) {
        e = e || [.15, 10]; var q = M.wp(u, v); z = z || 0;
        var pr = { kind: 'spr', fn: fn, at: I.p(q[0], q[1], Z + z), x0: q[0] - e[0], x1: q[0] + e[0], y0: q[1] - e[0], y1: q[1] + e[0], z0: Z + z, z1: Z + z + e[1], deco: [] };
        prims.push(pr); return pr;
      },
      on: function (pr, fn) { pr.deco.push(fn); return pr; },
      // the soft shadow under a piece (always first)
      shadow: function (u, v, bw, bd) { M._shadow = [u, v, bw, bd]; },
      eshadow: function (u, v, rx) { M._eshadow = [u, v, rx]; },
      draw: function () {
        if (M._shadow) { var s = M._shadow; var sq = [M.wp(s[0], s[1]), M.wp(s[0] + s[2], s[1] + s[3])], x0 = Math.min(sq[0][0], sq[1][0]), x1 = Math.max(sq[0][0], sq[1][0]), y0 = Math.min(sq[0][1], sq[1][1]), y1 = Math.max(sq[0][1], sq[1][1]); poly(c, [I.p(x0 + .1, y0 + .1, Z), I.p(x1 + .2, y0 + .1, Z), I.p(x1 + .2, y1 + .2, Z), I.p(x0 + .1, y1 + .2, Z)], 'rgba(90,45,40,.22)'); }
        if (M._eshadow) { var e = M._eshadow, q = M.p(e[0], e[1]); c.fillStyle = 'rgba(90,45,40,.26)'; c.beginPath(); c.ellipse(q[0] + 2, q[1] + 1, e[2], e[2] / 2, 0, 0, 7); c.fill(); }
        prims.forEach(function (pr) {
          var pts;
          if (pr.kind === 'spr') { pr.l = pr.at[0] - 14; pr.r = pr.at[0] + 14; pr.t = pr.at[1] - (pr.z1 - pr.z0) - 6; pr.b = pr.at[1] + 4; return; }
          pts = [I.p(pr.x0, pr.y0, pr.z1), I.p(pr.x1, pr.y0, pr.z1), I.p(pr.x1, pr.y1, pr.z0), I.p(pr.x0, pr.y1, pr.z0), I.p(pr.x1, pr.y1, pr.z1), I.p(pr.x0, pr.y1, pr.z1)];
          var bb = bounds(pts); pr.l = bb[0]; pr.t = bb[1]; pr.r = bb[2]; pr.b = bb[3];
        });
        StudioIso.sort(prims).forEach(function (pr) {
          if (pr.kind === 'box') drawBox(pr); else if (pr.kind === 'cyl') drawCyl(pr); else pr.fn(c, pr.at[0], pr.at[1]);
          pr.deco.forEach(function (fn) { fn(c); });
        });
      }
    };
    function drawBox(pr) {
      var R = pr.o.cols ? null : M.ramp(pr.part), tex = pr.o.tex !== undefined ? pr.o.tex : M.tex(pr.part), pn = M.patOf(pr.part);
      var cols = pr.o.cols || [R[0], R[1], R[2]];
      var A = I.p(pr.x0, pr.y0, pr.z0), B = I.p(pr.x1, pr.y0, pr.z0), C = I.p(pr.x1, pr.y1, pr.z0), D = I.p(pr.x0, pr.y1, pr.z0), h = pr.z1 - pr.z0;
      var up = function (q) { return [q[0], q[1] - h]; };
      face(c, [D, C, up(C), up(D)], cols[1], tex, pn, R || [cols[0], cols[1], cols[2], cols[2]], 'left');
      face(c, [B, C, up(C), up(B)], cols[2], tex, pn, R || [cols[0], cols[1], cols[2], cols[2]], 'right');
      face(c, [up(A), up(B), up(C), up(D)], cols[0], tex, pn, R || [cols[0], cols[1], cols[2], cols[2]], 'top');
      if (pr.o.line !== false) {
        poly(c, [up(A), up(B), B, C, D, up(D)], null, INK);
        if (h > 2) line(c, [up(D)[0], up(D)[1] + .5], [up(C)[0], up(C)[1] + .5], 'rgba(255,255,255,.4)');
      }
    }
    function drawCyl(pr) {
      var R = M.ramp(pr.part), tex = M.tex(pr.part), pn = M.patOf(pr.part);
      var b = I.p(pr.cx, pr.cy, pr.z0), tp = I.p(pr.cx, pr.cy, pr.z1), rx = pr.rad * I.TW / 2 * Math.SQRT2, ry = rx / 2;
      c.beginPath(); c.ellipse(b[0], b[1], rx, ry, 0, 0, Math.PI); c.lineTo(tp[0] - rx, tp[1]); c.ellipse(tp[0], tp[1], rx, ry, 0, Math.PI, 2 * Math.PI); c.closePath();
      var side = [[b[0] - rx, b[1]], [b[0] + rx, b[1]], [tp[0] + rx, tp[1]], [tp[0] - rx, tp[1]]];
      c.save(); c.clip();
      var g = c.createLinearGradient(b[0] - rx, 0, b[0] + rx, 0); g.addColorStop(0, R[1]); g.addColorStop(.45, R[1]); g.addColorStop(1, R[2]);
      c.fillStyle = g; c.fillRect(b[0] - rx - 1, tp[1] - ry - 1, rx * 2 + 2, b[1] - tp[1] + ry * 2 + 2);
      if (tex === 'fab') face(c, [[b[0] - rx, b[1] + ry], [b[0] + rx, b[1] + ry], [tp[0] + rx, tp[1] - ry], [tp[0] - rx, tp[1] - ry]], 'rgba(0,0,0,0)', tex, pn, R, 'left');
      if (tex === 'wood') for (var y = tp[1] + 3; y < b[1] + ry; y += 4) line(c, [b[0] - rx, y], [b[0] + rx, y], 'rgba(110,60,30,.16)');
      c.restore();
      c.fillStyle = pr.o.topCol || R[0]; c.beginPath(); c.ellipse(tp[0], tp[1], rx, ry, 0, 0, 7); c.fill();
      if (pr.o.line !== false) {
        c.strokeStyle = INK; c.beginPath(); c.ellipse(tp[0], tp[1], rx, ry, 0, 0, 7); c.stroke();
        c.beginPath(); c.moveTo(tp[0] - rx, tp[1]); c.lineTo(b[0] - rx, b[1]); c.ellipse(b[0], b[1], rx, ry, 0, Math.PI, 0, true); c.lineTo(tp[0] + rx, tp[1]); c.stroke();
      }
      pr.top = tp; pr.rx = rx; pr.ry = ry;
    }
    return M;
  }
  SS.Model = Model;
  SS.poly = poly;
  SS.bounds = bounds;
})();
