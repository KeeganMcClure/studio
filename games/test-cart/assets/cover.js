// Test Cart cover: GBA box art at 120 x 80 (studio-bible/launcher.md).
// Drawn in code. The launcher calls StudioCovers['test-cart'](ctx) on a 120 x 80 canvas.
(window.StudioCovers = window.StudioCovers || {})['test-cart'] = function (ctx) {
  var P = { night: '#14111f', deep: '#221a4c', shell: '#3a2e78', hi: '#5242a0', label: '#ebe5c8', gold: '#ffd166', pink: '#ff4fa3', cyan: '#3ff0e8', ink: '#0a0812' };
  function r(c, x, y, w, h) { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); }
  // Sky with stripes
  r(P.night, 0, 0, 120, 80);
  for (var i = 0; i < 6; i++) r(i % 2 ? P.deep : P.night, 0, 44 + i * 6, 120, 6);
  // Stars
  [[8, 6], [22, 14], [100, 8], [110, 22], [70, 4], [52, 18], [90, 30], [14, 30]].forEach(function (s) { r(P.label, s[0], s[1], 1, 1); });
  // Cartridge, outlined, shaded on the right
  r(P.ink, 41, 25, 38, 46);
  r(P.shell, 42, 26, 36, 44);
  r(P.hi, 42, 26, 2, 44);
  r(P.deep, 74, 26, 4, 44);
  r(P.ink, 46, 26, 28, 3);          // grip ridge
  r(P.ink, 47, 33, 26, 22);         // label frame
  r(P.label, 48, 34, 24, 20);       // label
  r(P.pink, 48, 34, 24, 4);
  r(P.cyan, 48, 50, 24, 4);
  r(P.ink, 58, 41, 4, 6);           // a little figure on the label
  r(P.gold, 59, 39, 2, 2);
  for (var k = 0; k < 6; k++) r(P.gold, 47 + k * 5, 64, 3, 5); // contacts
  // Title in Press Start 2P
  ctx.font = '8px "Press Start 2P", monospace';
  ctx.textBaseline = 'top';
  ctx.fillStyle = P.ink; ctx.fillText('TEST CART', 25, 7);
  ctx.fillStyle = P.gold; ctx.fillText('TEST CART', 24, 6);
};
