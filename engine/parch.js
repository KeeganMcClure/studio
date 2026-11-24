// Studio parchment panel for canvas menus (the same surface as engine/parch.css; studio-bible/ui.md, Screen craft:
// "Each game has a menu surface"; first built for Rushlight spec 008, 8C). Knows nothing about any game: colors come in T.
//   StudioParch.panel(c, x, y, w, h, T, o)   a parchment card: T.paper, T.on (picked), T.ink (outer line), T.edge (inner border),
//                                            T.stain [r,g,b], T.hi (the picked card's edge); o.on draws it picked
//   StudioParch.seal(c, x, y, T)             the wax-seal cursor, 9 px across, centered on x, y (T.sealA, T.sealB, T.sealC)
//   StudioParch.button(c, x, y, w, h, T, o)  a dark leather button (T.leather, T.leatherOn when o.on), with T.ink round it
(function () {
  function R(c, x, y, w, h, col) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
  function panel(c, x, y, w, h, T, o) {
    o = o || {}; x = Math.round(x); y = Math.round(y); w = Math.round(w); h = Math.round(h);
    R(c, x, y + h, w, 1, '#0e0c0a');                                   // the drop line under the card
    if (o.on) R(c, x - 1, y - 1, w + 2, h + 2, T.hi);                  // the picked card's edge
    R(c, x, y, w, h, T.ink);
    R(c, x + 1, y + 1, w - 2, h - 2, o.on ? T.on : T.paper);
    c.save(); c.beginPath(); c.rect(x + 1, y + 1, w - 2, h - 2); c.clip();
    const s = T.stain, lit = c.createRadialGradient(x + w * .3, y + h * .4, 1, x + w * .3, y + h * .4, Math.max(w, h) * .6);
    lit.addColorStop(0, o.on ? 'rgba(255,244,205,.75)' : 'rgba(255,248,225,.5)'); lit.addColorStop(1, 'rgba(255,248,225,0)'); c.fillStyle = lit; c.fillRect(x, y, w, h);
    [[.85, .8, .45, .22], [.1, .95, .35, .18]].forEach(([fx, fy, fr, a]) => { const g = c.createRadialGradient(x + w * fx, y + h * fy, 1, x + w * fx, y + h * fy, Math.max(w, h) * fr);
      g.addColorStop(0, `rgba(${s[0]},${s[1]},${s[2]},${a})`); g.addColorStop(1, `rgba(${s[0]},${s[1]},${s[2]},0)`); c.fillStyle = g; c.fillRect(x, y, w, h); });
    // the stained edge: darker toward the border
    const e = 4; for (let i = 0; i < e; i++) { const a = .16 * (1 - i / e); c.fillStyle = `rgba(90,62,43,${a})`; c.fillRect(x + 1 + i, y + 1 + i, w - 2 - 2 * i, 1); c.fillRect(x + 1 + i, y + h - 2 - i, w - 2 - 2 * i, 1); c.fillRect(x + 1 + i, y + 1 + i, 1, h - 2 - 2 * i); c.fillRect(x + w - 2 - i, y + 1 + i, 1, h - 2 - 2 * i); }
    c.restore();
    R(c, x + 2, y + 2, w - 4, 1, T.edge); R(c, x + 2, y + h - 3, w - 4, 1, T.edge); R(c, x + 2, y + 2, 1, h - 4, T.edge); R(c, x + w - 3, y + 2, 1, h - 4, T.edge);
  }
  function seal(c, x, y, T) {
    const P = [[0, -4, 3], [-2, -3, 7], [-3, -2, 7], [-4, -1, 9], [-4, 0, 9], [-4, 1, 9], [-3, 2, 7], [-2, 3, 5]];
    R(c, x - 2, y + 4, 5, 1, T.ink);
    P.forEach(([dx, dy, w]) => R(c, x + dx, y + dy, w, 1, T.sealC));
    [[-1, -3, 4], [-2, -2, 5], [-3, -1, 6], [-3, 0, 6], [-2, 1, 5], [-1, 2, 3]].forEach(([dx, dy, w]) => R(c, x + dx, y + dy, w, 1, T.sealB));
    R(c, x - 2, y - 2, 2, 2, T.sealA); R(c, x - 1, y - 3, 1, 1, T.sealA);
  }
  function button(c, x, y, w, h, T, o) { o = o || {}; R(c, x, y, w, h, T.ink); R(c, x + 1, y + 1, w - 2, h - 2, o.on ? T.leatherOn : T.leather); R(c, x + 1, y + 1, w - 2, 1, o.on ? 'rgba(255,220,180,.25)' : 'rgba(255,240,220,.1)'); }
  window.StudioParch = { panel: panel, seal: seal, button: button };
})();
