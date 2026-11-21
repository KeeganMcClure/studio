// Rushlight cover: GBA box art at 120 x 80 (studio-bible/launcher.md, Covers).
// Drawn in code in Rushlight's earth palette (bible.md, Art, Palette): a lit rushlight in its
// iron holder against dusk hills, title set in Press Start 2P. A first cover while the game is Dev-only.
// The launcher calls StudioCovers['rushlight'](ctx) on a 120 x 80 canvas.
(window.StudioCovers = window.StudioCovers || {})['rushlight'] = function (ctx) {
  var P = { peat: '#1c1814', soot: '#2c2621', dusk: '#3b4757', duskHi: '#5c6c7c', moss: '#56623a', rust: '#9a4528',
    tallow: '#d9b45a', straw: '#c8a552', bone: '#e6dcc4', ash: '#857e72', blood: '#5e1a18' };
  function r(c, x, y, w, h) { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); }
  var x, y;

  // Dusk sky: light low, dark high, dithered between
  r(P.dusk, 0, 0, 120, 80);
  r(P.duskHi, 0, 40, 120, 40);
  for (y = 34; y < 40; y++) for (x = (y % 2); x < 120; x += 2) r(P.duskHi, x, y, 1, 1);
  [[10, 22], [24, 30], [98, 24], [112, 18], [84, 32]].forEach(function (s) { r(P.bone, s[0], s[1], 1, 1); });

  // Rolling hills: far ash, near moss, then dark ground
  for (x = 0; x < 120; x++) {
    var far = 50 + Math.round(4 * Math.sin(x / 11) + 2 * Math.sin(x / 5));
    var near = 60 + Math.round(3 * Math.sin(x / 9 + 2));
    r(P.ash, x, far, 1, 80 - far);
    r(P.moss, x, near, 1, 80 - near);
    r(P.peat, x, near, 1, 1);
  }
  r(P.soot, 0, 70, 120, 10);
  // Stooks in the field
  [[14, 62], [30, 64], [92, 63], [106, 61]].forEach(function (s) {
    for (var i = 0; i < 8; i++) { var w = 1 + Math.floor(i / 2) * 2; r(P.peat, s[0] + 2 - (w >> 1) - 1, s[1] + i - 2, w + 2, 1); r(P.straw, s[0] + 2 - (w >> 1), s[1] + i - 2, w, 1); r(P.tallow, s[0] + 2 - (w >> 1), s[1] + i - 2, 1, 1); }
  });

  // Glow: dithered tallow and rust around the flame, hard pixels
  var cx = 60, cy = 30;
  for (y = 10; y < 52; y++) for (x = 38; x < 82; x++) {
    var d = Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy));
    if (d < 9 && (x + y) % 2 === 0) r(P.tallow, x, y, 1, 1);
    else if (d < 15 && (x + y) % 2 === 0) r(P.rust, x, y, 1, 1);
    else if (d < 20 && x % 2 === 0 && y % 2 === 0) r(P.rust, x, y, 1, 1);
  }

  // The rushlight: a peeled rush held in iron nips on a staff, outlined, shaded on the right
  r(P.peat, 58, 44, 5, 36); r(P.soot, 59, 44, 3, 36); r(P.ash, 59, 44, 1, 36);   // staff
  r(P.peat, 54, 40, 13, 5); r(P.soot, 55, 41, 11, 3); r(P.ash, 55, 41, 11, 1);  // nips
  r(P.peat, 58, 26, 4, 15); r(P.straw, 59, 27, 2, 14); r(P.bone, 59, 27, 1, 14); // the rush
  r(P.peat, 57, 19, 6, 8);                                                        // flame
  r(P.rust, 58, 21, 4, 6); r(P.tallow, 58, 22, 3, 4); r(P.bone, 59, 23, 1, 3); r(P.tallow, 59, 20, 2, 1);

  // Title in Press Start 2P, tallow on a peat drop shadow
  ctx.font = '8px "Press Start 2P", monospace';
  ctx.textBaseline = 'top';
  ctx.fillStyle = P.peat; ctx.fillText('RUSHLIGHT', 25, 5);
  ctx.fillStyle = P.tallow; ctx.fillText('RUSHLIGHT', 24, 4);
};
