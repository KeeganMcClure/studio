// Studio battle frame: the head-on battle screen's layout and its pieces, for every game with turn-based fights
// (Black Lantern spec 006 part B, from the approved combat mockup, "Battle in the GBA shell", Nov 20, 2026).
// It knows nothing about any game's rules: the game says who is in the fight, what the rows say, its colors and words.
//
//   StudioBattle.layout(w, h, o)       rects for a w × h canvas: scene, strip (party cards), cmd (command box),
//                                      col (turn-order column), and the baselines agentY and enemyY (o.tallest: tallest enemy)
//   StudioBattle.turnColumn(c, T, x, y, faces, maxH)   small faces down the left edge, the one acting first and bigger;
//                                      faces: [{img, foe}] (img: a canvas or null); returns the column's height
//   StudioBattle.hpBar(c, T, x, y, w, frac, h)          an HP bar with no numbers
//   StudioBattle.commands(c, T, r, labels, sel, detail, o)  the one-row command box (Fight · Skills · Items · Guard),
//                                      a detail line under it; o.msg shows a message there instead of the row;
//                                      returns tap areas [{x, y, w, h, i}]
//   StudioBattle.list(c, T, r, rows, sel, top)  a list box over the scene (rows: {label, right, dis}); returns
//                                      {top, hits} with the scroll position that keeps sel on screen
//   StudioBattle.result(c, T, cx, y, text, word, wordCol)  the result line, e.g. FIREARMS 62% · rolled 41 · HIT
//   StudioBattle.nav(state, key, n, horizontal)   moves a cursor (state.sel) through n entries; 'pick', 'back' or null
//
// T, the game's theme: {font(size) -> css font, ink, dim, gold, cream, line, box, boxOn, strip, bar, barBack, shadow}
(function () {
  function R(c, x, y, w, h, col) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
  function box(c, x, y, w, h, fill, line, lw) { lw = lw || 1; R(c, x, y, w, h, line); R(c, x + lw, y + lw, w - 2 * lw, h - 2 * lw, fill); }
  function text(c, T, s, x, y, col, size) { c.font = T.font(size); c.fillStyle = col; c.textBaseline = 'top'; c.fillText(s, Math.round(x), Math.round(y)); }
  function width(c, T, s, size) { c.font = T.font(size); return c.measureText(s).width; }
  function fit(c, T, s, w, size) { s = String(s); if (width(c, T, s, size) <= w) return s; while (s.length > 1 && width(c, T, s + '…', size) > w) s = s.slice(0, -1); return s + '…'; }

  // The mockup's proportions on a 240 px wide canvas: the command box (a row and a detail line) along the bottom,
  // the party cards just above it, the scene above those with enemies in its top half and agents at its foot.
  // o.tallest: the tallest enemy sprite, so its head stays on screen (the baseline drops for it, never into the agents)
  function layout(w, h, o) {
    const cmdH = 40, stripH = 27, cmd = { x: 2, y: h - cmdH - 2, w: w - 4, h: cmdH };
    const strip = { x: 0, y: cmd.y - stripH - 1, w, h: stripH };
    const scene = { x: 0, y: 0, w, h: strip.y }, tall = (o && o.tallest) || 0;
    const enemyY = Math.round(Math.min(scene.h - 66, Math.max(scene.h * 0.5, tall + 6)));
    return { scene, strip, cmd, col: { x: 2, y: 3, w: 22 }, agentY: strip.y, enemyY };
  }

  function turnColumn(c, T, x, y, faces, maxH) {
    let cy = y + 3; const W = 22, rows = [];
    faces.forEach((f, i) => { const s = i === 0 ? 18 : 14; if (cy + s + 3 > y + (maxH || 999)) return; rows.push([f, s, cy]); cy += s + (i === 0 ? 9 : 3); });
    if (!rows.length) return 0;
    const hgt = cy - y + 1; R(c, x, y, W, hgt, T.line); R(c, x + 1, y + 1, W - 2, hgt - 2, T.colBack || T.box);
    rows.forEach(([f, s, ry], i) => {
      const fx = x + (W - s) / 2;
      R(c, fx - 1, ry - 1, s + 2, s + 2, i === 0 ? T.gold : (f.foe ? T.foeLine || T.dim : T.dim));
      R(c, fx, ry, s, s, T.faceBack || T.barBack);
      if (f.img) { c.imageSmoothingEnabled = false; c.drawImage(f.img, 0, 0, f.img.width, f.img.height, fx, ry, s, s); }
      if (i === 0) { const ax = x + W / 2; R(c, ax - 2, ry + s + 2, 5, 1, T.gold); R(c, ax - 1, ry + s + 3, 3, 1, T.gold); R(c, ax, ry + s + 4, 1, 1, T.gold); }
    });
    return hgt;
  }

  function hpBar(c, T, x, y, w, frac, h) { h = h || 4; R(c, x, y, w, h + 2, T.shadow); R(c, x + 1, y + 1, w - 2, h, T.barBack); R(c, x + 1, y + 1, Math.round((w - 2) * Math.max(0, Math.min(1, frac))), h, T.bar); }

  function commands(c, T, r, labels, sel, detail, o) {
    o = o || {}; box(c, r.x, r.y, r.w, r.h, T.box, T.cream, 2); const hits = [];
    if (o.msg) {
      // a message in place of the row: up to three short lines
      (Array.isArray(o.msg) ? o.msg : [o.msg]).slice(0, 3).forEach((l, k) => text(c, T, l, r.x + 6, r.y + 2 + k * 12, T.cream, 14));
      if (o.more) { const bx = r.x + r.w - 9, by = r.y + r.h - 7 + (Math.floor(Date.now() / 300) % 2); R(c, bx, by, 5, 1, T.gold); R(c, bx + 1, by + 1, 3, 1, T.gold); R(c, bx + 2, by + 2, 1, 1, T.gold); }
      return hits;
    }
    const n = labels.length, cw = (r.w - 8) / n;
    labels.forEach((l, i) => {
      const x = r.x + 4 + i * cw, on = i === sel, dis = o.dis && o.dis[i];
      if (on) box(c, x, r.y + 3, cw - 2, 17, T.boxOn, T.gold);
      if (on) { R(c, x + 3, r.y + 8, 2, 7, T.gold); R(c, x + 5, r.y + 9, 1, 5, T.gold); R(c, x + 6, r.y + 10, 1, 3, T.gold); }
      text(c, T, l, x + 9, r.y + 3, dis ? T.dim : on ? T.gold : T.cream, 17);
      hits.push({ x, y: r.y, w: cw, h: 22, i });
    });
    R(c, r.x + 4, r.y + 22, r.w - 8, 1, T.rule || T.dim);
    if (detail) text(c, T, fit(c, T, detail, r.w - 12, 13), r.x + 6, r.y + 24, T.lav || T.dim, 13);
    return hits;
  }

  function list(c, T, r, rows, sel, top) {
    const rh = 12, vis = Math.max(1, Math.floor((r.h - 6) / rh));
    top = Math.max(0, Math.min(top | 0, rows.length - vis)); if (sel < top) top = sel; if (sel >= top + vis) top = sel - vis + 1;
    const h = Math.min(rows.length, vis) * rh + 6, y = r.y + r.h - h;
    box(c, r.x, y, r.w, h, T.box, T.cream, 2); const hits = [];
    for (let k = top; k < Math.min(rows.length, top + vis); k++) {
      const row = rows[k], ry = y + 3 + (k - top) * rh, on = k === sel;
      if (on) { R(c, r.x + 3, ry, r.w - 6, rh, T.boxOn); R(c, r.x + 5, ry + 3, 2, 6, T.gold); R(c, r.x + 7, ry + 4, 1, 4, T.gold); }
      const col = row.dis ? T.dim : on ? T.gold : T.cream, rw = row.right ? width(c, T, row.right, 13) : 0;
      text(c, T, fit(c, T, row.label, r.w - 20 - rw - 6, 14), r.x + 11, ry - 1, col, 14);
      if (row.right) text(c, T, row.right, r.x + r.w - 6 - rw, ry, row.dis ? T.dim : (T.lav || T.cream), 13);
      hits.push({ x: r.x, y: ry, w: r.w, h: rh, i: k });
    }
    if (top > 0) { const ax = r.x + r.w - 10; R(c, ax, y + 3, 3, 1, T.gold); R(c, ax - 1, y + 4, 5, 1, T.gold); }
    if (top + vis < rows.length) { const ax = r.x + r.w - 10; R(c, ax - 1, y + h - 5, 5, 1, T.gold); R(c, ax, y + h - 4, 3, 1, T.gold); }
    return { top, hits, y, h };
  }

  function result(c, T, cx, y, txt, word, wordCol) {
    const s = 14, w1 = width(c, T, txt, s), w2 = word ? width(c, T, word, s) : 0, w = Math.min(236, w1 + w2 + 12), x = Math.round(cx - w / 2);
    box(c, x, y, w, 15, T.box, T.cream, 1);
    text(c, T, txt, x + 6, y, T.cream, s); if (word) text(c, T, word, x + 6 + w1, y, wordCol || T.gold, s);
  }

  function nav(st, k, n, horizontal) {
    if (!n) return k === 'b' ? 'back' : null;
    const prev = horizontal ? 'left' : 'up', next = horizontal ? 'right' : 'down';
    if (k === prev) st.sel = (st.sel - 1 + n) % n;
    else if (k === next) st.sel = (st.sel + 1) % n;
    else if (k === 'a') return 'pick';
    else if (k === 'b') return 'back';
    return null;
  }

  window.StudioBattle = { layout, turnColumn, hpBar, commands, list, result, nav, box, text, width, fit };
})();
