// Black Lantern cover: GBA box art at 120 x 80 (studio-bible/launcher.md, Covers).
// Drawn in code in Black Lantern's base palette (bible.md, Art, Palette): a lit lantern over a
// small town at night, title set in Press Start 2P. Generic on purpose, so it spoils no case.
// The launcher calls StudioCovers['black-lantern'](ctx) on a 120 x 80 canvas.
(window.StudioCovers = window.StudioCovers || {})['black-lantern'] = function (ctx) {
  var P = {
    ink: '#1b1f33', plum: '#2a2030', rust: '#b5532e', pumpkin: '#d9772b', mustard: '#d6a43a',
    pink: '#ff4fa3', cyan: '#3ff0e8',
    // lantern shades, as on the title screen's lantern
    night: '#0c0a14', iron: '#2a2440', ironHi: '#3a3460', cap: '#5d5888',
    glass: '#ffbf3f', glassHi: '#ffe08a', flame: '#fffaf0', star: '#e8dcc0'
  };
  function r(c, x, y, w, h) { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); }

  // Night sky, darkening upward, with a dithered band where it meets the town
  r(P.night, 0, 0, 120, 80);
  r(P.ink, 0, 18, 120, 62);
  for (var y = 14; y < 18; y++) for (var x = (y % 2); x < 120; x += 2) r(P.ink, x, y, 1, 1);
  for (y = 44; y < 54; y++) for (x = (y % 2); x < 120; x += 2) r(P.plum, x, y, 1, 1);

  // Stars
  [[6, 20], [17, 31], [29, 22], [84, 19], [111, 34], [9, 42], [102, 46], [36, 38], [92, 30]].forEach(function (s) { r(P.star, s[0], s[1], 1, 1); });

  // A thin moon on the right, cut by the sky
  for (y = 0; y < 12; y++) for (x = 0; x < 12; x++) {
    var inMoon = (x - 5.5) * (x - 5.5) + (y - 5.5) * (y - 5.5) < 30;
    var inBite = (x - 8.5) * (x - 8.5) + (y - 4.5) * (y - 4.5) < 26;
    if (inMoon && !inBite) r(P.star, 96 + x, 17 + y, 1, 1);
  }

  // Warm glow around the lantern: dithered rings, hard pixels, no blur
  var cx = 60, cy = 38;
  for (y = 18; y < 66; y++) for (x = 34; x < 86; x++) {
    var d = Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy));
    if (d < 16 && (x + y) % 2 === 0) r(P.rust, x, y, 1, 1);
    else if (d < 22 && (x + y) % 2 === 0) r(P.plum, x, y, 1, 1);
    else if (d < 27 && x % 2 === 0 && y % 2 === 0) r(P.plum, x, y, 1, 1);
  }

  // Town skyline: barn, water tower, church spire, houses. One window lit.
  var T = P.night;
  r(T, 0, 62, 120, 18);                       // ground
  r(T, 2, 54, 18, 8); r(T, 4, 52, 14, 2); r(T, 6, 50, 10, 2); r(T, 9, 48, 4, 2); // barn roof steps
  r(T, 24, 44, 1, 18); r(T, 30, 44, 1, 18);   // water tower legs
  r(T, 22, 38, 11, 6); r(T, 23, 36, 9, 2); r(T, 26, 34, 3, 2);
  r(T, 27, 51, 1, 1); r(T, 26, 52, 3, 1);     // cross brace
  r(T, 36, 57, 10, 5); r(T, 37, 55, 8, 2); r(T, 39, 53, 4, 2);
  r(T, 76, 52, 12, 10); r(T, 80, 40, 4, 12); r(T, 81, 36, 2, 4); r(T, 82, 33, 1, 3); // church and spire
  r(T, 92, 56, 14, 6); r(T, 93, 54, 12, 2); r(T, 95, 52, 8, 2);
  r(T, 108, 58, 12, 4); r(T, 109, 56, 10, 2);
  r(P.mustard, 97, 57, 2, 2);                 // the one lit window
  r(P.rust, 99, 57, 1, 2);
  r(P.cyan, 40, 58, 1, 1);                    // a cold, wrong light: low SAN is close
  r(P.pink, 112, 59, 1, 1);

  // The lantern, drawn at 2 px per pixel, outlined, shaded on its right side
  var L = 2, lx = 44, ly = 22;
  function q(c, x, y, w, h) { r(c, lx + x * L, ly + y * L, w * L, h * L); }
  r(P.night, lx + 7 * L, ly - 6, 1, 6);       // hanging cord
  q(P.night, 6, -1, 4, 1); q(P.cap, 7, 0, 2, 2);       // ring
  q(P.night, 4, 1, 8, 1); q(P.iron, 5, 2, 6, 1); q(P.ironHi, 4, 3, 8, 1); // cap
  q(P.night, 3, 4, 1, 10); q(P.night, 12, 4, 1, 10);   // outline
  q(P.iron, 4, 4, 1, 9); q(P.iron, 11, 4, 1, 9);       // frame
  q(P.glass, 5, 4, 6, 9);
  q(P.glassHi, 6, 6, 4, 5);
  q(P.flame, 7, 7, 2, 3);
  q(P.pumpkin, 9, 4, 2, 9);                            // shadow side of the glass
  q(P.mustard, 10, 4, 1, 9);
  q(P.ironHi, 4, 13, 8, 1); q(P.iron, 5, 14, 6, 1); q(P.night, 4, 15, 8, 1); // base
  r(P.flame, lx + 5 * L, ly + 5 * L, 1, 3);            // light rim on the lit edge

  // Title in Press Start 2P, mustard on a rust drop shadow
  ctx.font = '8px "Press Start 2P", monospace';
  ctx.textBaseline = 'top';
  ctx.fillStyle = P.night; ctx.fillText('BLACK LANTERN', 9, 5);
  ctx.fillStyle = P.rust; ctx.fillText('BLACK LANTERN', 9, 4);
  ctx.fillStyle = P.mustard; ctx.fillText('BLACK LANTERN', 8, 3);
};
