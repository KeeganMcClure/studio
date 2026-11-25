// Sarah's Sim: Louie the cat, reference v1 (Nov 25, 2026). Drawn in code from Keegan's photos.
// Grey-and-white bicolor: grey cap with a white blaze up the nose, white muzzle, bib, belly and front paws,
// grey back and tail with faint rings, pink nose, yellow-green eyes. Light from the upper left.
(function () {
  var PAL = {
    o: '#3b2f33', D: '#4d474d', d: '#625b61', g: '#7f787d', G: '#9d969a', H: '#b5aeb1',
    w: '#f6f2ee', W: '#ddd5d2', V: '#c4bab8', p: '#eea2ab', n: '#e2828f', e: '#b8c24a', E: '#7d8a2a', k: '#2b2226'
  };
  // Map sprites, 1 char = 1 px. '.' is clear.
  var SIT = [
    '...o.........o...',
    '..oGo.......odo..',
    '..oGpo.....opdo..',
    '.oGgpooooooopgdo.',
    '.oGGgggggwgggggo.',
    '.oGggggwwwgggggo.',
    '.oGgkeggwwwggekgo',
    '.ogggggwwwwgggddo',
    '.owwgggwwnwwgggwo',
    '..owwwwwwowwwwwo.',
    '...oowwwwwwwwoo..',
    '..odgwwwwwwwwgdo.',
    '.oGggwwwwwwwwggdo',
    '.oGggwwwwwwwwgdo.',
    '.oGgwwwWwwWwwgddo',
    '.oggwwwWwwWwwgddoo',
    '.oggwwwWwwWwwgddogo',
    '.odgwwWWwwWWwddoddo',
    '..odwwwwowwwwdoooo.',
    '...ooooo.ooooo.....'
  ];
  var LOAF = [
    '..............o.......o.',
    '.............oGo.....odo',
    '.............oGpooooopdo',
    '....oooooooooGggggwggggo',
    '...oGGGGgggggGggggwwgggo',
    '..oGgGggggdggGgkegwwgekd',
    '.oGggggdggggddggggwwwggo',
    '.oGgggggggggggdgwwwnwwwo',
    'oodggggggggggdddowwowwo.',
    'ogodgggggggggdddwwwwwwo.',
    'oddogwwgggggdddwwwWwwwo.',
    '.ooodwwWdddddddWwwwWwwo.',
    '....ooooooooooooooooooo.'
  ];
  var CURL = [ // asleep, paws over his face
    '.......ooooooooo.......',
    '.....ooGGGggggggoo.....',
    '....oGGgggggggggddo....',
    '...oGggggdgggggggdo.o..',
    '..oGgggggggggggggddoGo.',
    '..oGggggggggwwwgggdopo.',
    '.oGgggggggwwwwwwwggggo.',
    '.oGggggggwwwWwwwwwgggo.',
    '.ogggggggwwwwwwnwwgggo.',
    '.odggddddwwWwwwwwggddo.',
    'oddddgggddwwwwwwwddddo.',
    'oDdddgggggdddddddddddo.',
    '.oDDddddddddddddddddo..',
    '..ooooooooooooooooo....'
  ];
  function sprite(c, rows, x, y, s) {
    for (var j = 0; j < rows.length; j++) for (var i = 0; i < rows[j].length; i++) {
      var ch = rows[j][i]; if (ch === '.' || !PAL[ch]) continue;
      c.fillStyle = PAL[ch]; c.fillRect(x + i * s, y + j * s, s, s);
    }
  }
  function shadow(c, x, y, w, s) { c.fillStyle = 'rgba(90,45,40,.25)'; c.beginPath(); c.ellipse(x, y, w * s / 2, w * s / 5, 0, 0, 7); c.fill(); }

  // 64 x 64 portrait, drawn at pixel scale with shapes then snapped by the caller's pixel scale.
  function portrait(c, X, Y, S, t) {
    function R(x, y, w, h, col) { c.fillStyle = col; c.fillRect(X + x * S, Y + y * S, w * S, h * S); }
    function E(cx, cy, rx, ry, col) { // pixel ellipse
      for (var yy = -ry; yy <= ry; yy++) { var hw = Math.round(rx * Math.sqrt(Math.max(0, 1 - (yy * yy) / (ry * ry)))); R(cx - hw, cy + yy, hw * 2 + 1, 1, col); }
    }
    c.save(); c.beginPath(); c.rect(X, Y, 64 * S, 64 * S); c.clip();
    R(0, 0, 64, 64, '#f6e3d3');
    for (var i = 0; i < 64; i += 6) R(0, i, 64, 3, '#f1d9c7'); // window-blind light behind him
    E(32, 62, 30, 14, '#e8cdb4'); // cream sherpa blanket
    for (var k = 0; k < 9; k++) E(6 + k * 7, 52 + (k % 2) * 2, 3, 2, '#f3e1cf');
    // body and bib
    E(32, 54, 21, 13, PAL.o); E(32, 54, 20, 12, PAL.g); E(28, 52, 15, 10, PAL.G);
    E(32, 50, 9, 11, PAL.o); E(32, 50, 8, 10, PAL.w); E(35, 52, 4, 7, PAL.W);
    // head
    E(32, 30, 17, 14, PAL.o);
    // ears: drawn between the head outline and its fill, so they grow out of the head
    for (var a = 0; a < 16; a++) { var hw = Math.floor(a * .45); R(20 - hw + Math.floor(a / 5), 7 + a, hw * 2 + 1, 1, PAL.o); R(44 - hw - Math.floor(a / 5), 7 + a, hw * 2 + 1, 1, PAL.o); }
    for (var b = 2; b < 16; b++) { var hb = Math.floor(b * .45) - 1; if (hb < 0) continue; R(20 - hb + Math.floor(b / 5), 7 + b, hb * 2 + 1, 1, PAL.G); R(44 - hb - Math.floor(b / 5), 7 + b, hb * 2 + 1, 1, PAL.d); }
    for (var q = 4; q < 14; q++) { var hq = Math.floor(q * .45) - 2; if (hq < 0) continue; R(20 - hq + Math.floor(q / 5) + 1, 7 + q, hq * 2, 1, PAL.p); R(44 - hq - Math.floor(q / 5), 7 + q, hq * 2, 1, PAL.p); }
 E(32, 30, 16, 13, PAL.g); E(29, 27, 12, 9, PAL.G); E(26, 24, 6, 4, PAL.H);
    // blaze (narrow upside-down V from forehead to muzzle) and white muzzle
    for (var v = 0; v < 12; v++) R(32 - Math.floor(v / 4), 19 + v, 1 + Math.floor(v / 2), 1, PAL.w);
    E(32, 37, 9, 6, PAL.w); E(34, 38, 6, 4, PAL.W); E(25, 34, 4, 3, PAL.w);
    // faint tabby lines on the forehead
    R(26, 20, 1, 4, PAL.d); R(28, 19, 1, 4, PAL.d); R(37, 19, 1, 4, PAL.d); R(39, 20, 1, 4, PAL.d);
    // eyes: yellow-green, sleepy-calm; slow blink
    var shut = t % 16 === 0;
    [[24, 29], [37, 29]].forEach(function (p) {
      if (shut) { R(p[0], p[1] + 1, 6, 1, PAL.o); return; }
      R(p[0], p[1], 6, 3, PAL.o); R(p[0] + 1, p[1], 4, 2, PAL.e); R(p[0] + 1, p[1] + 1, 4, 1, PAL.E); R(p[0] + 2, p[1], 2, 2, PAL.k); R(p[0] + 1, p[1], 1, 1, '#fff');
      R(p[0] - 1, p[1] - 1, 8, 1, PAL.D); // heavy upper lid
    });
    // nose with his little freckle, mouth, whiskers
    R(30, 34, 5, 2, PAL.n); R(31, 36, 3, 1, PAL.n); R(31, 34, 2, 1, PAL.p); R(33, 35, 1, 1, '#9b5a63');
    R(32, 37, 1, 2, PAL.V); R(30, 39, 2, 1, PAL.V); R(33, 39, 2, 1, PAL.V);
    c.strokeStyle = 'rgba(255,255,255,.85)'; c.lineWidth = Math.max(1, S / 2);
    [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(function (w) {
      var x0 = X + (32 + w[0] * 6) * S, y0 = Y + (37 + w[1]) * S; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x0 + w[0] * 14 * S, y0 + w[1] * 3 * S - 2 * S); c.stroke();
    });
    // white front paws resting on the blanket
    E(26, 61, 4, 2, PAL.o); E(26, 61, 3, 1, PAL.w); E(38, 61, 4, 2, PAL.o); E(38, 61, 3, 1, PAL.W);
    c.restore();
  }

  window.LOUIE_SIT = SIT; window.LOUIE_PAL = PAL;
  window.drawLouieSheet = function (c, W, H, t) {
    c.imageSmoothingEnabled = false;
    c.fillStyle = '#fff6ea'; c.fillRect(0, 0, W, H);
    c.fillStyle = '#6b4250'; c.font = '16px "Press Start 2P", monospace'; c.textBaseline = 'top';
    c.fillText('LOUIE', 24, 20); c.font = '9px "Press Start 2P", monospace'; c.fillStyle = '#9b7b84';
    c.fillText("SARAH'S SIM · REFERENCE V1", 24, 44);
    // portrait at 4x
    c.fillStyle = '#e8cdb4'; c.fillRect(20, 68, 264, 264); portrait(c, 24, 72, 4, t);
    c.fillStyle = '#6b4250'; c.fillText('PORTRAIT 64 x 64', 24, 342);
    // map sprites at 6x on a floor swatch
    var fx = 310, fy = 68;
    c.fillStyle = '#d39a66'; c.fillRect(fx, fy, 380, 264);
    for (var r = 0; r < 264; r += 22) { c.fillStyle = r % 44 ? '#c88d5a' : '#d39a66'; c.fillRect(fx, fy + r, 380, 22); c.fillStyle = '#93603c'; c.fillRect(fx, fy + r + 21, 380, 1); }
    var S = 6;
    shadow(c, fx + 70, fy + 222, 18, S); sprite(c, SIT, fx + 16, fy + 104, S);
    shadow(c, fx + 260, fy + 112, 24, S); sprite(c, LOAF, fx + 190, fy + 36, S);
    shadow(c, fx + 262, fy + 236, 22, S); sprite(c, CURL, fx + 196, fy + 156, S);
    c.fillStyle = '#6b4250'; c.fillText('MAP SPRITES (6x): SIT · LOAF · ASLEEP', fx, 342);
    // actual size row
    c.fillText('ACTUAL SIZE', 24, 372);
    c.fillStyle = '#d39a66'; c.fillRect(24, 388, 140, 34);
    sprite(c, SIT, 32, 396, 1); sprite(c, LOAF, 64, 404, 1); sprite(c, CURL, 104, 404, 1);
    // notes
    c.fillStyle = '#6b4250'; c.font = '8px "Press Start 2P", monospace';
    ['Grey cap, white blaze up the nose', 'White muzzle, bib, belly, front paws', 'Pink nose with a tiny freckle', 'Yellow-green, heavy-lidded eyes', 'Grey tail with faint rings'].forEach(function (s, i) { c.fillText('· ' + s, 310, 380 + i * 14); });
  };
})();
