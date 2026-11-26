// Sarah's Sim: Nina's wallpaper swatch (papers-nina-v1). Drawn in code.
// drawNina(ctx, x, y, w, h, pal) paints one wall face at 1 px = 1 game pixel.
var NINA_PAL = {
  paper:'#f4ecdc', paperShade:'#e9dfcb', red:'#b8364c', blue:'#5b72ad', pink:'#d98ba2',
  tan:'#d9bf8c', stem:'#7c9468', border:'#efe6d3', lattice:'#8a9bb0', line:'#6b5a4c',
  wood:'#4b2f1f', woodHi:'#5f3d29', woodLo:'#2f1d13', rail:'#5a3a26', railHi:'#7a5338'
};
function drawNina(c, x0, y0, w, h, P) {
  P = P || NINA_PAL;
  function px(x, y, col) { if (x >= 0 && y >= 0 && x < w && y < h) { c.fillStyle = col; c.fillRect(x0 + x, y0 + y, 1, 1); } }
  function rect(x, y, rw, rh, col) { c.fillStyle = col; c.fillRect(x0 + x, y0 + y, rw, rh); }
  var borderH = 10, wains = Math.round(h * 0.36), railY = h - wains - 3;
  // paper field
  rect(0, borderH, w, railY - borderH, P.paper);
  // loose diagonal repeat: 12 px cells, each row shifted 6 px, small fixed jitter
  var cols = [P.red, P.blue, P.pink, P.red, P.tan, P.blue];
  for (var r = 0; r * 10 < railY + 10; r++) for (var q = -1; q * 12 < w + 12; q++) {
    var k = (r * 7 + q * 3) % 6, jx = ((r * 5 + q * 11) % 3) - 1, jy = ((r * 3 + q * 7) % 3) - 1;
    var cx = q * 12 + (r % 2) * 6 + 3 + jx, cy = borderH + 4 + r * 10 + jy;
    if (cy < borderH + 2 || cy > railY - 4) continue;
    var col = cols[k];
    if (col === P.tan) { // little tan sprig, like the photo's pale buds
      px(cx, cy, col); px(cx, cy + 1, col); px(cx + 1, cy - 1, col); px(cx, cy + 2, P.stem);
    } else { // calico flower: plus shape, darker heart, leaf stem going down-left
      px(cx, cy - 1, col); px(cx - 1, cy, col); px(cx + 1, cy, col); px(cx, cy + 1, col);
      px(cx, cy, P.paperShade);
      px(cx - 1, cy + 2, P.stem); px(cx - 2, cy + 2, P.stem); px(cx - 1, cy + 3, P.stem);
    }
  }
  // top border: lattice strip with tiny flowers
  rect(0, 0, w, borderH, P.border);
  rect(0, 0, w, 1, P.line); rect(0, borderH - 1, w, 1, P.line);
  for (var x = 0; x < w; x++) for (var y = 2; y < borderH - 2; y++) {
    var a = (x + y) % 8, b = (x - y + 64) % 8;
    if (a === 0 || b === 0) px(x, y, P.lattice);
  }
  for (var fx = 0; fx < w; fx += 8) { // flowers sit in the diamonds
    var fc = [P.red, P.blue, P.pink][(fx / 8) % 3];
    px(fx + 4, 4, fc); px(fx + 3, 5, fc); px(fx + 5, 5, fc); px(fx + 4, 6, fc); px(fx + 4, 5, P.stem);
  }
  // chair rail
  rect(0, railY, w, 3, P.rail); rect(0, railY, w, 1, P.railHi);
  // wainscot: vertical planks, 8 px, grooves and soft grain
  var wy = railY + 3, wh = h - wy;
  rect(0, wy, w, wh, P.wood);
  for (var pxx = 0; pxx < w; pxx += 8) {
    rect(pxx, wy, 1, wh, P.woodLo); rect(pxx + 1, wy, 1, wh, P.woodHi);
    for (var g = 0; g < wh; g += 7) { var gx = pxx + 3 + ((g + pxx) % 3); px(gx, wy + g + (pxx % 4), P.woodLo); px(gx, wy + g + 1 + (pxx % 4), P.woodLo); px(gx, wy + g + 2 + (pxx % 4), P.woodLo); }
  }
  rect(0, h - 4, w, 4, P.woodLo); rect(0, h - 4, w, 1, P.woodHi); // baseboard
}
