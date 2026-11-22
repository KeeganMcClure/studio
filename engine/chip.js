// Studio chip: a small labelled tag drawn on a canvas, such as a die roll (d4·3), KEEP, BAG or SAFE. Black Lantern's
// debrief uses it for its case-item chips and its skill-gain dice (spec 007); any game that shows a roll or a tag can.
// Knows nothing about any game: the game passes the words, colors and font.
//
//   StudioChip.die(sides, n)               'd4·3', the text of a die chip
//   StudioChip.width(ctx, text, o)         the chip's width for that text
//   StudioChip.draw(ctx, x, y, text, o)    draws it with its top-left at x, y and returns its width.
//     o: {font: '12px "VT323"', h: 11, pad: 3, fill, ink, line (an outline color, optional)}
(function () {
  function die(sides, n) { return 'd' + sides + '·' + n; }
  function width(c, text, o) { c.font = o.font; return Math.round(c.measureText(text).width) + 2 * (o.pad == null ? 3 : o.pad); }
  function draw(c, x, y, text, o) {
    var w = width(c, text, o), h = o.h || 11, pad = o.pad == null ? 3 : o.pad;
    x = Math.round(x); y = Math.round(y);
    if (o.line) { c.fillStyle = o.line; c.fillRect(x, y, w, h); c.fillStyle = o.fill; c.fillRect(x + 1, y + 1, w - 2, h - 2); }
    else { c.fillStyle = o.fill; c.fillRect(x, y, w, h); }
    c.font = o.font; c.fillStyle = o.ink; c.textBaseline = 'top'; c.fillText(text, x + pad, y + (o.dy || 0));
    return w;
  }
  window.StudioChip = { die: die, width: width, draw: draw };
})();
