// Sarah's Sim: Ralph the cat, reference v1 (Nov 25, 2026). Drawn in code from Keegan's photos.
// Big orange tabby with white: narrow white blaze up the nose, white chin, bib and front paws, ringed tail,
// pale green eyes. Optional outfit: red bowtie with a silver bell. Light from the upper left.
(function () {
  var PAL = {
    o: '#4a2a1e', D: '#8f4a1f', d: '#b8642a', g: '#d9853f', G: '#eaa35e', H: '#f4c088',
    w: '#fbf6ef', W: '#e6dbd0', V: '#cfc1b4', p: '#eea2ab', n: '#d98a8a', e: '#c9dba0', E: '#94a96a', k: '#2b2226',
    r: '#d2363c', R: '#9e2128', q: '#ec6a6e', s: '#dfe4e8', S: '#9aa3ab'
  };
  var SIT = [
    '....o...........o....',
    '...oGo.........odo...',
    '...oGpo.......opdo...',
    '..oGgpoooooooooopgdo.',
    '.oGGgdggggwggdggggdo.',
    '.oGggggggggwgggggggdo',
    '.oGgkeggggwggggekgdo.',
    '.oGggggggwwwwwgggggdo',
    '.oggggwwwwnwwwwggddo.',
    '..oggwwwwwowwwwwggo..',
    '...ooggwwwwwwwggoo...',
    '..oGgggwwwwwwwgggdo..',
    '.oGggdgwwwwwwwgdggdo.',
    '.oGgggdwwwwwwwdgggdo.',
    'oGgdgggwwwwwwwgggdgdo',
    'oGgggdgwwwwwwwgdgggdo',
    'oGggggg' + 'wwWwwWww' + 'gggddo',
    'ogggggd' + 'wwWwwWww' + 'dgggdo',
    'odggggd' + 'wwWwwWww' + 'dggddo',
    'oddgggd' + 'wwwwowww' + 'dddo..',
    '.oDdGgdddooodddgGdDo.',
    '..ooooooo...ooooooo..'
  ];
  // fix row 5 and 7 to 21 wide
  SIT[5] = '.oGggggggg' + 'w' + 'gggggggdo' + '.';
  SIT[7] = '.oGggggg' + 'wwwww' + 'gggggdo' + '.';
  function sprite(c, rows, x, y, s, pal) {
    pal = pal || PAL;
    for (var j = 0; j < rows.length; j++) for (var i = 0; i < rows[j].length; i++) {
      var ch = rows[j][i]; if (ch === '.' || !pal[ch]) continue;
      c.fillStyle = pal[ch]; c.fillRect(x + i * s, y + j * s, s, s);
    }
  }
  function bowSprite(c, x, y, s, cx, cy) { // bowtie on a sprite, centered on pixel cx, cy
    var B = ['rr.....rr', 'qrrr.rrrR', 'rrRRrRRrR', 'rrrr.rrrR', 'RR.....RR'];
    var Bf = ['RR', 'q'];
    for (var j = 0; j < 3; j++) for (var i = 0; i < 9; i++) {
      var ch = ['rrr.r.rrr', 'qrRrrrRrR', 'rRR.r.RRR'][j][i]; if (ch === '.') continue;
      c.fillStyle = PAL[ch]; c.fillRect(x + (cx - 4 + i) * s, y + (cy - 1 + j) * s, s, s);
    }
    c.fillStyle = PAL.s; c.fillRect(x + cx * s, y + (cy + 2) * s, s, s);
  }
  function shadow(c, x, y, w, s) { c.fillStyle = 'rgba(90,45,40,.25)'; c.beginPath(); c.ellipse(x, y, w * s / 2, w * s / 5, 0, 0, 7); c.fill(); }

  // Loaf, drawn from shapes on the pixel grid: big round body, head on the right.
  function loaf(c, X, Y, S, bow) {
    function R(x, y, w, h, col) { c.fillStyle = col; c.fillRect(X + x * S, Y + y * S, w * S, h * S); }
    function E(cx, cy, rx, ry, col) { for (var yy = -ry; yy <= ry; yy++) { var hw = Math.round(rx * Math.sqrt(Math.max(0, 1 - (yy * yy) / (ry * ry)))); R(cx - hw, cy + yy, hw * 2 + 1, 1, col); } }
    E(17, 10, 10, 7, PAL.o); E(17, 10, 9, 6, PAL.g); E(15, 7, 7, 3, PAL.G); E(17, 14, 8, 2, PAL.d);
    for (var i = 10; i < 24; i += 4) { R(i, 5, 1, 3, PAL.d); R(i + 1, 9, 1, 3, PAL.d); }
    R(6, 14, 6, 2, PAL.o); R(7, 14, 4, 1, PAL.g); R(8, 14, 1, 1, PAL.D); R(10, 14, 1, 1, PAL.D); // ringed tail curled in front
    // head
    E(26, 7, 7, 6, PAL.o); E(26, 7, 6, 5, PAL.g); E(25, 5, 4, 3, PAL.G);
    R(21, 0, 1, 1, PAL.o); R(20, 1, 3, 1, PAL.o); R(21, 1, 1, 1, PAL.G); R(20, 2, 3, 1, PAL.o); R(21, 2, 1, 1, PAL.p);
    R(30, 0, 1, 1, PAL.o); R(29, 1, 3, 1, PAL.o); R(30, 1, 1, 1, PAL.d); R(29, 2, 3, 1, PAL.o); R(30, 2, 1, 1, PAL.p);
    R(26, 3, 1, 5, PAL.w); E(26, 9, 3, 2, PAL.w); R(26, 8, 1, 1, PAL.n);
    R(23, 6, 1, 1, PAL.k); R(24, 6, 1, 1, PAL.e); R(28, 6, 1, 1, PAL.e); R(29, 6, 1, 1, PAL.k);
    E(23, 13, 4, 3, PAL.w); E(22, 15, 3, 1, PAL.o); R(20, 15, 3, 1, PAL.w); R(24, 15, 3, 1, PAL.w); // bib and white paws
    if (bow) bowSprite(c, X, Y, S, 25, 12);
  }

  function portrait(c, X, Y, S, bow, t) {
    function R(x, y, w, h, col) { c.fillStyle = col; c.fillRect(X + x * S, Y + y * S, w * S, h * S); }
    function E(cx, cy, rx, ry, col) { for (var yy = -ry; yy <= ry; yy++) { var hw = Math.round(rx * Math.sqrt(Math.max(0, 1 - (yy * yy) / (ry * ry)))); R(cx - hw, cy + yy, hw * 2 + 1, 1, col); } }
    c.save(); c.beginPath(); c.rect(X, Y, 64 * S, 64 * S); c.clip();
    R(0, 0, 64, 64, '#e9eedd');
    for (var i = 0; i < 64; i += 8) for (var j = 0; j < 64; j += 8) if (((i + j) / 8) % 2) R(i, j, 8, 8, '#dfe6d0'); // checkered puff blanket, softened
    // big body
    E(32, 58, 27, 16, PAL.o); E(32, 58, 26, 15, PAL.g); E(27, 55, 18, 10, PAL.G);
    for (var s = 0; s < 5; s++) { R(9 + s * 2, 50 + s, 4, 1, PAL.d); R(46 - s * 2, 50 + s, 4, 1, PAL.d); }
    E(32, 52, 11, 12, PAL.o); E(32, 52, 10, 11, PAL.w); E(35, 54, 5, 8, PAL.W);
    // head: wide and round
    E(32, 30, 20, 15, PAL.o);
    // ears: drawn between the head outline and its fill, so they grow out of the head
    for (var a = 0; a < 16; a++) { var hw = Math.floor(a * .45); R(17 - hw + Math.floor(a / 5), 6 + a, hw * 2 + 1, 1, PAL.o); R(47 - hw - Math.floor(a / 5), 6 + a, hw * 2 + 1, 1, PAL.o); }
    for (var b = 2; b < 16; b++) { var hb = Math.floor(b * .45) - 1; if (hb < 0) continue; R(17 - hb + Math.floor(b / 5), 6 + b, hb * 2 + 1, 1, PAL.G); R(47 - hb - Math.floor(b / 5), 6 + b, hb * 2 + 1, 1, PAL.d); }
    for (var q = 4; q < 14; q++) { var hq = Math.floor(q * .45) - 2; if (hq < 0) continue; R(17 - hq + Math.floor(q / 5) + 1, 6 + q, hq * 2, 1, PAL.p); R(47 - hq - Math.floor(q / 5), 6 + q, hq * 2, 1, PAL.p); }
 E(32, 30, 19, 14, PAL.g); E(28, 27, 14, 9, PAL.G); E(24, 24, 6, 4, PAL.H);
    // forehead stripes (the classic M) and cheek stripes
    R(27, 18, 1, 5, PAL.d); R(29, 17, 1, 5, PAL.d); R(35, 17, 1, 5, PAL.d); R(37, 18, 1, 5, PAL.d);
    R(14, 32, 5, 1, PAL.d); R(15, 35, 4, 1, PAL.d); R(46, 32, 5, 1, PAL.d); R(46, 35, 4, 1, PAL.d);
    // narrow white blaze straight up the nose
    R(32, 18, 1, 6, PAL.w); R(31, 24, 3, 8, PAL.w); R(30, 30, 5, 3, PAL.w);
    // eyes: pale green, round, looking up a little
    [[22, 28], [37, 28]].forEach(function (p) {
      R(p[0], p[1], 7, 5, PAL.o); R(p[0] + 1, p[1] + 1, 5, 3, PAL.e); R(p[0] + 1, p[1] + 3, 5, 1, PAL.E);
      R(p[0] + 3, p[1] + 1, 2, 3, PAL.k); R(p[0] + 2, p[1] + 1, 1, 1, '#fff');
    });
    // nose, white mouth and chin
    R(30, 33, 5, 2, PAL.n); R(31, 35, 3, 1, PAL.n); R(31, 33, 2, 1, '#eaa8a8'); R(30, 34, 1, 1, '#b86a6a');
    E(27, 38, 4, 2, PAL.w); E(37, 38, 4, 2, PAL.w); E(32, 41, 4, 2, PAL.w); R(32, 36, 1, 2, PAL.V); R(29, 38, 3, 1, PAL.V); R(33, 38, 3, 1, PAL.V);
    c.strokeStyle = 'rgba(255,255,255,.85)'; c.lineWidth = Math.max(1, S / 2);
    [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(function (w) {
      var x0 = X + (32 + w[0] * 8) * S, y0 = Y + (38 + w[1]) * S; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x0 + w[0] * 16 * S, y0 + w[1] * 3 * S - 2 * S); c.stroke();
    });
    if (bow) { // red bowtie with a silver bell
      E(24, 46, 6, 4, PAL.o); E(24, 46, 5, 3, PAL.r); E(22, 45, 2, 1, PAL.q);
      E(40, 46, 6, 4, PAL.o); E(40, 46, 5, 3, PAL.r); E(41, 47, 3, 1, PAL.R);
      E(32, 46, 3, 3, PAL.o); E(32, 46, 2, 2, PAL.R); R(31, 45, 1, 1, PAL.q);
      E(32, 51, 2, 2, PAL.S); R(31, 50, 2, 1, PAL.s); R(32, 52, 1, 1, PAL.o);
    }
    E(24, 62, 5, 2, PAL.o); E(24, 62, 4, 1, PAL.w); E(40, 62, 5, 2, PAL.o); E(40, 62, 4, 1, PAL.W);
    c.restore();
  }

  window.RALPH_SIT = SIT; window.RALPH_PAL = PAL; // shared with later mockups
  window.drawRalphSheet = function (c, W, H, t) {
    c.imageSmoothingEnabled = false;
    c.fillStyle = '#fff6ea'; c.fillRect(0, 0, W, H);
    c.fillStyle = '#6b4250'; c.font = '16px "Press Start 2P", monospace'; c.textBaseline = 'top';
    c.fillText('RALPH', 24, 20); c.font = '9px "Press Start 2P", monospace'; c.fillStyle = '#9b7b84';
    c.fillText("SARAH'S SIM · REFERENCE V1", 24, 44);
    c.fillStyle = '#e8cdb4'; c.fillRect(20, 68, 200, 200); portrait(c, 24, 72, 3, false, t);
    c.fillRect(236, 68, 200, 200); portrait(c, 240, 72, 3, true, t);
    c.fillStyle = '#6b4250'; c.fillText('PORTRAIT', 24, 278); c.fillText('WITH BOWTIE', 240, 278);
    // sprites at 6x on a floor swatch, with Louie for size
    var fx = 20, fy = 304, S = 5;
    c.fillStyle = '#d39a66'; c.fillRect(fx, fy, 740, 160);
    for (var r = 0; r < 160; r += 20) { c.fillStyle = r % 40 ? '#c88d5a' : '#d39a66'; c.fillRect(fx, fy + r, 740, 20); c.fillStyle = '#93603c'; c.fillRect(fx, fy + r + 19, 740, 1); }
    if (window.LOUIE_SIT) { shadow(c, fx + 62, fy + 140, 16, S); sprite(c, window.LOUIE_SIT, fx + 20, fy + 42, S, window.LOUIE_PAL); }
    shadow(c, fx + 190, fy + 142, 20, S); sprite(c, SIT, fx + 138, fy + 32, S);
    shadow(c, fx + 330, fy + 142, 20, S); sprite(c, SIT, fx + 278, fy + 32, S); bowSprite(c, fx + 278, fy + 32, S, 10, 10);
    shadow(c, fx + 520, fy + 138, 26, S); loaf(c, fx + 430, fy + 52, S, false);
    c.fillStyle = '#6b4250'; c.fillText('LOUIE FOR SIZE · RALPH SIT · WITH BOWTIE · LOAF (5x)', fx, fy + 170);
    c.font = '8px "Press Start 2P", monospace';
    ['Big, round orange tabby', 'Narrow white blaze up the nose', 'White chin, bib and front socks', 'Pale green eyes, pink nose', 'Ringed tail; bowtie is optional'].forEach(function (s, i) { c.fillText('· ' + s, 460, 80 + i * 16); });
    c.fillText('ACTUAL SIZE', 460, 200);
    c.fillStyle = '#d39a66'; c.fillRect(460, 214, 120, 36);
    if (window.LOUIE_SIT) sprite(c, window.LOUIE_SIT, 468, 224, 1, window.LOUIE_PAL);
    sprite(c, SIT, 490, 222, 1); sprite(c, SIT, 516, 222, 1); bowSprite(c, 516, 222, 1, 10, 10); loaf(c, 542, 228, 1, true);
  };
})();
