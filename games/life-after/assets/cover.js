// Life After cover: GBA box art at 120 x 80 (studio-bible/launcher.md, Covers).
// Boarded window (bible.md, Art, Cover, picked Nov 22): a hideout window seen from outside at night, nailed with
// boards, warm light showing through, a dead hand pressed on the glass in the gap over a smear, and LIFE AFTER on a
// dark band at the bottom in Press Start 2P. Drawn from mockups/03-cover-b-rough-v2.html, same layout and colors;
// cleaned up: the glow is drawn once from the window's middle, and the title keeps only solid pixels so it stays crisp.
// The launcher calls StudioCovers['life-after'](ctx) on a 120 x 80 canvas.
(window.StudioCovers = window.StudioCovers || {})['life-after'] = function (ctx) {
  var N = { wall: '#4e5a58', wall2: '#3a4442', dark: '#1e2428', out: '#0c0e10', light: '#e8c88a', red: '#a8502e',
    redS: '#6a3424', zomS: '#5e6650', amber: '#ffb43a', bone: '#e8e0c0' };
  function r(c, x, y, w, h) { ctx.fillStyle = N[c] || c; ctx.fillRect(x | 0, y | 0, w, h); }
  var x, y, i;
  ctx.imageSmoothingEnabled = false;

  // siding: dark boards with a few flecks
  r('wall2', 0, 0, 120, 80);
  for (y = 0; y < 80; y++) for (x = 0; x < 120; x++) if ((x * 3 + y * 7) % 11 === 0) r('dark', x, y, 1, 1);
  for (y = 4; y < 80; y += 6) r('dark', 0, y, 120, 1);

  // the window frame and the dark room behind the glass
  r('out', 26, 6, 68, 54); r('bone', 28, 8, 64, 50); r('dark', 29, 9, 62, 48);
  // warm light from inside, in rings
  for (y = 10; y < 56; y++) for (x = 30; x < 90; x++) {
    var d = Math.sqrt((x - 60) * (x - 60) + (y - 33) * (y - 33) * 1.44);
    if (d < 16) r('light', x, y, 1, 1);
    else if (d < 26 && (x + y) % 2 === 0) r('amber', x, y, 1, 1);
    else if (d < 34 && x % 2 === 0 && y % 2 === 0) r('redS', x, y, 1, 1);
  }
  // the smear on the glass under the hand
  [[52, 48], [54, 51], [57, 53], [53, 54], [59, 50]].forEach(function (p) { r('redS', p[0], p[1], 2, 3); });

  // the hand: a dark silhouette, fingers spread, pressed flat in the gap between the boards
  var D = 6;
  r('out', 48, 26 + D, 16, 13); r('out', 50, 39 + D, 12, 5);
  r('out', 46, 14 + D, 4, 13); r('out', 51, 11 + D, 4, 16); r('out', 56, 10 + D, 4, 17); r('out', 61, 13 + D, 3, 14);
  r('out', 64, 27 + D, 3, 4); r('out', 66, 24 + D, 3, 5);
  r('zomS', 47, 15 + D, 1, 10); r('zomS', 52, 12 + D, 1, 12); r('zomS', 57, 11 + D, 1, 13); r('zomS', 62, 14 + D, 1, 10); r('zomS', 49, 28 + D, 1, 9);
  r('redS', 54, 31 + D, 3, 2);

  // boards: one high, one low, leaving the middle open, each with a nail head
  [[9, -1, 6], [50, 2, 6]].forEach(function (b) {
    for (i = 0; i < 66; i++) {
      var yy = b[0] + Math.round(b[1] * (i - 33) / 33);
      r('out', 27 + i, yy - 1, 1, b[2] + 2); r('red', 27 + i, yy, 1, b[2]); r('redS', 27 + i, yy + b[2] - 2, 1, 2);
    }
    r('bone', 30, b[0] - b[1] + 2, 1, 1); r('bone', 89, b[0] + b[1] + 2, 1, 1);
  });
  // a short board across the right corner
  for (i = 0; i < 20; i++) { var y2 = 30 + Math.round(i * 0.3); r('out', 72 + i, y2 - 1, 1, 8); r('red', 72 + i, y2, 1, 6); r('redS', 72 + i, y2 + 4, 1, 2); }
  r('bone', 89, 35, 1, 1);
  // sill
  r('out', 22, 60, 76, 4); r('wall', 23, 60, 74, 3);

  // the dark band and the title. If the font is still loading, the title is drawn again once it arrives.
  var font = '8px "Press Start 2P"';
  function title() {
    r('out', 0, 66, 120, 14);
    var o = document.createElement('canvas'); o.width = 120; o.height = 16;
    var t = o.getContext('2d');
    t.font = font + ', monospace'; t.textBaseline = 'top'; t.fillStyle = '#fff'; t.fillText('LIFE AFTER', 20, 4);
    var px = t.getImageData(0, 0, 120, 16).data;
    [[1, 1, N.redS], [0, 0, N.light]].forEach(function (L) {
      ctx.fillStyle = L[2];
      for (var yy = 0; yy < 16; yy++) for (var xx = 0; xx < 120; xx++) if (px[(yy * 120 + xx) * 4 + 3] > 110) ctx.fillRect(xx + L[0], 65 + yy + L[1], 1, 1);
    });
  }
  title();
  if (document.fonts && !document.fonts.check(font)) document.fonts.load(font).then(title, function () {});
};
