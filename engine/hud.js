// Studio HUD cards (studio-bible/ui.md, Screen craft: "Strips and HUDs fit", "The HUD shows who and where"; first built for
// Rushlight spec 008, 8B). The framed card the map HUD is drawn in, a portrait on its lit backing, and a labelled bar.
// Knows nothing about any game: the game passes its colors and decides what goes on the card.
//
//   StudioHUD.card(c, x, y, w, h, T)          a framed card: T.outer (outline), T.line (frame), T.fill (inside)
//   StudioHUD.portrait(c, img, sx, sy, sw, sh, x, y, w, h, T)
//                                             a portrait on a lit backing (T.backTop to T.backBot, lighter at the top),
//                                             cropped from img (sx, sy, sw, sh) into x, y, w, h, with T.outer under it
//   StudioHUD.bar(c, x, y, w, frac, T)        a thin bar: T.outer track, T.bar fill
(function () {
  function R(c, x, y, w, h, col) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
  function card(c, x, y, w, h, T) { R(c, x, y, w, h, T.outer); R(c, x + 1, y + 1, w - 2, h - 2, T.line); R(c, x + 2, y + 2, w - 4, h - 4, T.fill); }
  function portrait(c, img, sx, sy, sw, sh, x, y, w, h, T) {
    const g = c.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, T.backTop); g.addColorStop(1, T.backBot); c.fillStyle = g; c.fillRect(x, y, w, h);
    if (img) { const s = c.imageSmoothingEnabled; c.imageSmoothingEnabled = false; c.drawImage(img, sx, sy, sw, sh, x, y, w, h); c.imageSmoothingEnabled = s; }
    R(c, x, y + h, w, 1, T.outer);
  }
  function bar(c, x, y, w, frac, T) { R(c, x, y, w, 4, T.outer); R(c, x + 1, y + 1, Math.max(0, Math.round((w - 2) * Math.max(0, Math.min(1, frac)))), 2, T.bar); }
  window.StudioHUD = { card: card, portrait: portrait, bar: bar };
})();
