// Rushlight look pass, rough mockup v2 for sites and the den (Nov 23, 2026; spec 008 part 8B).
// v2 is the readability pass (Keegan, Nov 23). Rules it follows, checked at 1x on the phone:
//   1. three value bands: floor you walk on is the calm middle; things that block (heaps, walls) sit darker at night
//      or carry a hard dark foot line by day; the rye is one quiet mass with a lit top edge and a dark lip where it ends
//   2. texture lives inside a mass at low contrast, one or two steps apart, never a bright speck on every tile
//   3. the brightest, warmest pixels belong to people, lit windows and hotspots; dressing never uses Tallow or straw-bright
//   4. hotspots get a Peat outline and a slow bob, so a diamond never reads as a dropped sheaf
//   5. every figure stands on a firm contact shadow; at night hotspots draw on top of the dark so they keep their glow
//   6. a lone heap out on the floor is one whole mound on the floor, never a dark square
// Injected into the real build (after sprite-upgrade v3 for the portraits). Same tile maps and walk grid as the game;
// only the drawing changes, to studio-bible art-style (Maps are lit, Maps are dressed):
//   - ground with texture and tufts; the rye as standing stalks with lit heads; spoil heaps as shaded mounds
//   - buildings stand up in 3/4 view: walls with a lit and a shaded side, thatch or slate roofs, chimneys, doors, windows
//   - props: stooks, a church tower, a pump house with its beam, a horse whim, lamp posts, fences, carts, rails
//   - soft shadows under everything; at noon they pool straight down (the Noonwife alone casts none)
//   - night keeps its dark (engine/light.js), with a cool moon rim so shapes still read, and every window and lamp glows
//   - the HUD cards from the street mockup: the lead card and a place card (site name, day), NEXT on one line under them
(function () {
  const P = { peat: '#1c1814', soot: '#2c2621', bone: '#e6dcc4', ash: '#857e72', tallow: '#d9b45a', rust: '#9a4528', moss: '#56623a' };
  const R = (x, y, w, h, c) => { cx.fillStyle = c; cx.fillRect(Math.round(x), Math.round(y), w, h); };
  const H = (x, y) => (((x * 73856093) ^ (y * 19349663)) >>> 0);
  const day = M => M.tod === 'noon' || M.tod === 'day' || M.tod === 'overcast';
  const GR = { noon: ['#8a8a46', '#a29a52', '#6e7038', '#5a5a30'], dusk: ['#5e5a3c', '#746a48', '#4a4a30', '#3a3826'], night: ['#5e5a46', '#68644e', '#524e3e', '#46432f'], overcast: ['#6a6a4a', '#7e7a56', '#56583e', '#44462e'] };
  const shadow = (x, y, w, k = .35) => { cx.fillStyle = `rgba(28,24,20,${k})`; cx.beginPath(); cx.ellipse(x, y, w, Math.max(2, w * .22), 0, 0, 7); cx.fill(); };

  function ground(M, ch, tx, ty, X, Y) {
    const g = GR[M.tod] || GR.dusk, h = H(tx, ty);
    if (ch === ',') { R(X, Y, 16, 16, M.tod === 'noon' ? '#9a8462' : '#6e5c46'); // the lane: packed earth, ruts, a lighter crown
      R(X, Y + 4, 16, 1, M.tod === 'noon' ? '#82704e' : '#5a4a38'); R(X, Y + 11, 16, 1, M.tod === 'noon' ? '#82704e' : '#5a4a38'); R(X, Y + 7, 16, 2, M.tod === 'noon' ? '#ae9872' : '#7e6a52');
      if (h % 5 === 0) { R(X + (h % 9), Y + 12, 5, 2, M.tod === 'noon' ? '#8a96a0' : '#4a5664'); R(X + (h % 9), Y + 14, 5, 1, '#4a3c2e'); } return; }
    if (ch === '~') { R(X, Y, 16, 16, '#2a3a48'); R(X + (h % 10), Y + 4, 5, 1, '#5c6c7c'); R(X + (h % 7) + 3, Y + 11, 4, 1, '#3b5060'); return; }
    R(X, Y, 16, 16, g[0]); // grass and earth: four tones, tufts with a lit tip, the odd stone and flower
    for (let i = 0; i < 3; i++) { const k = H(tx * 7 + i, ty * 3 + i), px = k % 15, py = (k >> 4) % 14; R(X + px, Y + py, 1, 2, g[2]); if (i === 0) R(X + px, Y + py, 1, 1, g[1]); }
    if (h % 5 === 0) R(X + (h % 13), Y + (h >> 3) % 12, 2, 1, g[2]);
    if (M.tod === 'noon' && h % 23 === 0) { R(X + (h % 12) + 2, Y + 6, 1, 1, '#c8402a'); R(X + (h % 12) + 3, Y + 7, 1, 1, '#a83020'); } // poppies
    if (h % 29 === 0) { R(X + 5, Y + 9, 3, 2, g[3]); R(X + 5, Y + 9, 2, 1, g[2]); }
  }
  function rye(M, tx, ty, X, Y, t) { // standing rye as one quiet mass: soft rows inside, a lit top edge, a dark lip at its foot
    const n = M.tod === 'noon', base = n ? '#b0904a' : '#6a5a30', st = n ? '#9a7c3c' : '#5a4c2a', hd = n ? '#c8a85a' : '#7a6a3c';
    const up = M.g[ty - 1] && M.g[ty - 1][tx], dn = M.g[ty + 1] && M.g[ty + 1][tx];
    R(X, Y, 16, 16, base);
    for (let i = 0; i < 4; i++) { const sx = X + i * 4 + 1 + ((ty + i) % 2) * 2, sway = Math.round(Math.sin(t * .0015 + (tx * 16 + i * 4) * .06));
      R(sx, Y + 6, 1, 9, st); R(sx + sway, Y + 3 + (i % 2) * 2, 1, 3, hd); }
    R(X, Y + 8 + (tx % 2), 16, 1, st); // a soft row line, offset tile to tile so no grid shows
    if (up && up !== 'y') { R(X, Y, 16, 3, n ? '#d8bc6a' : '#8a7a48'); for (let i = 0; i < 16; i += 2) R(X + i, Y - 1, 1, 2, n ? '#d8bc6a' : '#8a7a48'); } // the field's lit top edge, ragged
    if (dn && dn !== 'y') { R(X, Y + 14, 16, 2, n ? '#6e5a2a' : '#3a3020'); R(X, Y + 16, 16, 1, 'rgba(28,24,20,.35)'); } // the dark lip where the field ends
  }
  function heap(M, tx, ty, X, Y) { // spoil as one dark mass: a few big mounds lit only on their crest, a lip where the floor starts
    const d = day(M), c = d ? ['#8a8070', '#6a6256', '#544e46', '#46413a'] : ['#7e889c', '#3a3a3c', '#2c2c2e', '#222224'];
    const at = (x, y) => M.g[y] && M.g[y][x];
    const fl = ch => ch && ch !== 'u' && ch !== 'T', open = [[0, 1], [0, -1], [1, 0], [-1, 0]].filter(([a, b]) => fl(at(tx + a, ty + b))).length;
    if (open >= 2) { // a lone heap out on the floor: the floor under it, then one whole mound with its own shadow, never a square
      ground(M, '.', tx, ty, X, Y); shadow(X + 8, Y + 14, 8, .5);
      for (let y = 2; y < 15; y++) for (let x = 0; x < 16; x++) { const dx = (x - 7.5) / 7.5, dy = (y - 14) / 12, q = dx * dx + dy * dy; if (q > 1) continue;
        R(X + x, Y + y, 1, 1, q > .72 && dy < -.5 && dx < .2 ? c[0] : dx < -.15 ? c[1] : c[2]); }
      R(X + 1, Y + 14, 14, 1, '#141210'); return; }
    R(X, Y, 16, 16, c[3]);
    if (H(tx * 3, ty * 7) % 2 === 0) { const hx = 5 + H(tx, ty) % 7, hy = 9 + H(ty, tx) % 4, hr = 7 + H(tx * 3, ty) % 4, hv = hr * .6;
      for (let y = -6; y < 16; y++) for (let x = -4; x < 20; x++) { const dx = (x - hx) / hr, dy = (y - hy) / hv, q = dx * dx + dy * dy; if (q > 1 || dy > .4 || Y + y < Y - 6) continue;
        const crest = q > .7 && dy < 0 && dx < .3; R(X + x, Y + y, 1, 1, crest ? c[0] : (dx < -.1 ? c[1] : c[2])); } }
    if (fl(at(tx, ty + 1))) { R(X, Y + 13, 16, 2, '#141210'); R(X, Y + 12, 16, 1, d ? c[1] : '#4a4c54'); } // the lip: the heap's foot, dark, its edge caught by the moon
    if (fl(at(tx, ty - 1))) R(X, Y, 16, 1, c[0]);
    if (fl(at(tx - 1, ty))) R(X, Y, 1, 16, '#141210'); if (fl(at(tx + 1, ty))) R(X + 15, Y, 1, 16, '#141210');
  }

  // ---- objects that stand up off the grid, drawn in order of their base line ----
  function cottage(M, X, Y, w, opts) { // X,Y: left and base of the house front; w: width in px
    const nit = !day(M), wall = nit ? ['#6a6252', '#544e42', '#3e3a32'] : ['#d8cba6', '#b8ab8c', '#968a6e'], hgt = 18;
    shadow(X + w / 2 + (M.tod === 'noon' ? 0 : 6), Y + 1, w * .55, .4);
    R(X, Y - hgt, w, hgt, wall[1]); R(X, Y - hgt, 3, hgt, wall[0]); R(X + w - 4, Y - hgt, 4, hgt, wall[2]); // lit front, shaded far side
    for (let i = 0; i < w; i += 7) R(X + i, Y - hgt, 1, hgt, nit ? '#3a3028' : '#6a5038'); R(X, Y - 9, w, 1, nit ? '#3a3028' : '#6a5038'); // timbers
    R(X + 6, Y - 11, 6, 11, '#2a1e16'); R(X + 6, Y - 11, 6, 1, '#5a3e2b'); R(X + 7, Y - 10, 1, 10, '#3e2a1c'); // door
    const wx = X + w - 14; R(wx, Y - 15, 6, 5, opts.lit ? '#e8b85a' : '#2a2420'); R(wx + 2, Y - 15, 1, 5, '#3e2a1c'); R(wx, Y - 10, 6, 1, wall[2]);
    // the roof in 3/4: thatch overhangs the wall, lighter on the sun side, a ridge, eaves shadow
    const ry = Y - hgt, rh = 15, th = opts.slate ? (nit ? ['#4a4a56', '#3a3a44', '#2a2a32'] : ['#7a7a88', '#5a5a68', '#44444e']) : (nit ? ['#6a5a30', '#544624', '#3e341c'] : ['#c8a552', '#a8873e', '#7e6430']);
    for (let y = 0; y < rh; y++) { const ins = Math.round(y * .2); R(X - 2 + ins, ry - y, w + 4 - ins * 2, 1, y < 3 ? th[2] : y > rh - 4 ? th[0] : th[1]);
      if (!opts.slate) for (let i = 0; i < w; i += 3) if (H(i, y) % 3 === 0) R(X - 2 + ins + i, ry - y, 1, 1, th[2]); else if (opts.slate && y % 3 === 0) R(X, ry - y, w, 1, th[2]); }
    R(X - 2, ry, w + 4, 1, P.peat); R(X, ry + 1, w, 2, 'rgba(28,24,20,.45)'); // eaves line and shadow under it
    R(X + w - 9, ry - rh - 4, 4, 8, nit ? '#4a3e34' : '#8a7058'); R(X + w - 9, ry - rh - 4, 4, 1, '#3a3028'); // chimney
    if (opts.smoke) for (let i = 0; i < 5; i++) { const t = performance.now() * .001 + i; R(X + w - 8 + Math.sin(t) * 2 + i, ry - rh - 8 - i * 4, 3, 2, `rgba(${nit ? '120,120,130' : '200,196,186'},${.5 - i * .08})`); }
  }
  function church(M, X, Y) { // the church tower at the field's edge, cut by the map's side: stone, a bell window, slate cap
    const s = day(M) ? ['#a49c8c', '#8a8274', '#6a6458'] : ['#5a564e', '#4a4640', '#36332e'];
    shadow(X + 12, Y + 1, 14, .4); R(X - 4, Y - 44, 24, 44, s[1]); R(X - 4, Y - 44, 4, 44, s[0]); R(X + 16, Y - 44, 4, 44, s[2]);
    for (let y = Y - 40; y < Y; y += 6) for (let x = X - 4 + ((y / 6) % 2) * 3; x < X + 20; x += 6) R(x, y, 1, 1, s[2]);
    R(X + 4, Y - 34, 6, 8, P.peat); R(X + 4, Y - 34, 6, 1, s[0]); R(X + 6, Y - 32, 2, 4, '#6a4a2c'); // bell window
    for (let y = 0; y < 10; y++) R(X - 6 + y, Y - 44 - y, 28 - y * 2, 1, y < 2 ? '#2a2a32' : day(M) ? '#5a5a68' : '#33333c');
    R(X + 2, Y - 12, 8, 12, '#2a1e16'); R(X + 2, Y - 13, 8, 1, s[0]);
  }
  function stook(M, X, Y) { const c = day(M) ? ['#e8cc7a', '#c8a552', '#8a6c2e'] : ['#8a7a48', '#6a5a30', '#3e341c']; shadow(X + 8, Y + 1, 7, .45);
    for (let y = 0; y < 15; y++) { const w = 2 + Math.round(y * .45); R(X + 8 - w, Y - 15 + y, w * 2, 1, c[1]); R(X + 8 - w, Y - 15 + y, 2, 1, c[0]); R(X + 8 + w - 2, Y - 15 + y, 2, 1, c[2]); }
    R(X + 4, Y - 7, 8, 1, c[2]); R(X + 7, Y - 17, 2, 3, c[0]); }
  function pumpHouse(M, X, Y) { const s = ['#4a4640', '#3a3632', '#2c2a26']; shadow(X + 16, Y + 1, 18, .5);
    R(X, Y - 22, 32, 22, s[1]); R(X, Y - 22, 4, 22, s[0]); R(X + 28, Y - 22, 4, 22, s[2]); for (let y = Y - 20; y < Y; y += 5) R(X, y, 32, 1, s[2]);
    R(X + 8, Y - 14, 8, 14, '#1a1614'); R(X + 20, Y - 16, 6, 5, '#e8b85a'); R(X + 22, Y - 16, 1, 5, '#3a2a1c'); // the lit window: someone left a lamp
    for (let y = 0; y < 12; y++) R(X - 3 + y * .3, Y - 22 - y, 38 - y * .6, 1, y < 2 ? '#1e1e24' : '#33333c'); R(X - 3, Y - 22, 38, 1, P.peat);
    R(X + 33, Y - 30, 3, 30, '#4a3424'); R(X + 22, Y - 31, 20, 3, '#5a3e2b'); R(X + 22, Y - 31, 20, 1, '#7a5a3e'); R(X + 40, Y - 28, 1, 14, '#6a6a6a'); } // the pump beam and rod
  function whim(M, X, Y) { shadow(X + 8, Y + 1, 14, .45); R(X + 1, Y - 26, 2, 26, '#4a3424'); R(X + 13, Y - 26, 2, 26, '#3a2a1c'); R(X - 2, Y - 28, 20, 3, '#5a3e2b'); R(X - 2, Y - 28, 20, 1, '#7a5a3e');
    R(X + 4, Y - 14, 8, 6, '#3e2a1c'); R(X + 4, Y - 14, 8, 1, '#6a4a2c'); R(X - 6, Y - 11, 28, 1, '#5a3e2b'); R(X + 7, Y - 25, 1, 11, '#7a7a7a'); } // the drum, the sweep, the rope
  function lamp(M, X, Y) { shadow(X + 8, Y + 1, 4, .4); R(X + 7, Y - 18, 2, 18, '#3a2a1c'); R(X + 4, Y - 18, 8, 1, '#3a2a1c'); R(X + 4, Y - 17, 3, 5, '#ffe0a0'); R(X + 4, Y - 17, 3, 1, '#9a7428'); }
  function cart(M, X, Y) { shadow(X + 12, Y + 1, 12, .45); R(X, Y - 10, 22, 6, '#4a3424'); R(X, Y - 10, 22, 1, '#6a4a2c'); R(X + 1, Y - 13, 20, 3, '#2a2620'); R(X + 2, Y - 14, 6, 2, '#3a3834');
    for (const wx of [3, 15]) { R(X + wx, Y - 5, 5, 5, '#2a1e16'); R(X + wx + 2, Y - 3, 1, 1, '#7a5a3e'); } }
  function fence(M, X, Y) { const c = day(M) ? ['#8a6a48', '#5a3e2b'] : ['#4a3a2c', '#2e241c']; R(X, Y - 7, 16, 1, c[0]); R(X, Y - 4, 16, 1, c[1]); R(X + 2, Y - 9, 2, 9, c[0]); R(X + 3, Y - 9, 1, 9, c[1]); }

  const origTiles = window.drawSiteTiles;
  window.drawSiteTiles = function (M, camx, camy) {
    G.trail = []; // only the lead walks (bug batch)
    const t = performance.now(), x0 = Math.floor(camx / 16), y0 = Math.floor(camy / 16) - 1, objs = [];
    const at = (x, y) => M.g[y] && M.g[y][x];
    for (let ty = y0; ty <= y0 + Math.ceil(VH / 16) + 2; ty++) for (let tx = x0; tx <= x0 + Math.ceil(VW / 16) + 1; tx++) {
      let ch = at(tx, ty); if (!ch) { if (tx < 0 || tx >= M.w) continue; ch = M.edge || 'T'; }
      const X = tx * 16 - camx, Y = ty * 16 - camy;
      if (ch === 'y') rye(M, tx, ty, X, Y, t); else if (ch === 'u') heap(M, tx, ty, X, Y); else if (ch === '~' || ch === ',') ground(M, ch, tx, ty, X, Y); else ground(M, '.', tx, ty, X, Y);
      // what stands up on this tile
      if (ch === 'h' && at(tx - 1, ty) !== 'h') { let w = 1; while (at(tx + w, ty) === 'h') w++; objs.push([Y + 16, () => cottage(M, X, Y + 16, w * 16, { lit: !day(M) && (tx + ty) % 2 === 0, smoke: (tx * 3 + ty) % 2 === 0, slate: M.edge === 'u' })]); }
      if (ch === 'k' && at(tx, ty + 1) !== 'k') objs.push([Y + 16, () => church(M, X, Y + 16)]);
      if (ch === 's') objs.push([Y + 15, () => stook(M, X, Y + 15)]);
      if (ch === 'p' && at(tx - 1, ty) !== 'p' && at(tx, ty + 1) !== 'p') objs.push([Y + 16, () => pumpHouse(M, X, Y + 16)]);
      if (ch === 'm') objs.push([Y + 16, () => whim(M, X, Y + 16)]);
      if (ch === 'L') objs.push([Y + 16, () => lamp(M, X, Y + 16)]);
      // dressing by the lane: fences on the field side at Hollin, carts and rails at the pit
      if (ch === '.' && at(tx, ty + 1) === ',' && M.tod === 'noon' && (tx % 5) !== 2) objs.push([Y + 16, () => fence(M, X, Y + 16)]);
      if (ch === '.' && M.edge === 'u' && H(tx, ty) % 11 === 0) objs.push([Y + 15, () => cart(M, X, Y + 15)]);
      // small dressing so no stretch of floor sits bare: at Hollin a lying sheaf, a rake, a reaper's dropped hat;
      // at the pit coal lumps, an ore tub, a puddle with the moon in it
      if (ch === '.' && at(tx, ty + 1) !== ',' && at(tx, ty - 1) !== ',' && H(tx * 3, ty * 5) % 6 === 0) { const k = H(tx, ty * 7) % 3, d = !day(M);
        objs.push([Y + 12, () => { if (M.tod === 'noon') { if (k === 0) { shadow(X + 8, Y + 12, 6, .35); R(X + 3, Y + 9, 10, 3, '#8a7a4a'); R(X + 3, Y + 9, 10, 1, '#9e8c58'); R(X + 7, Y + 9, 1, 3, '#5e5030'); }
            else if (k === 1) { R(X + 2, Y + 11, 12, 1, '#8a6a48'); for (let i = 0; i < 4; i++) R(X + 2 + i * 2, Y + 9, 1, 2, '#6a5038'); }
            else { shadow(X + 8, Y + 12, 5, .35); R(X + 4, Y + 9, 8, 2, '#7a6a4a'); R(X + 6, Y + 7, 4, 2, '#8a7a56'); R(X + 4, Y + 10, 8, 1, '#4e4230'); } }
          else { if (k === 0) { for (let i = 0; i < 4; i++) R(X + 3 + i * 3, Y + 9 + (i % 2), 2, 2, i % 2 ? '#2a2826' : '#4a4844'); }
            else if (k === 1) { shadow(X + 8, Y + 13, 6, .4); R(X + 3, Y + 6, 10, 6, '#4a4038'); R(X + 3, Y + 6, 10, 1, '#6a6258'); R(X + 4, Y + 12, 2, 1, '#2a2622'); R(X + 10, Y + 12, 2, 1, '#2a2622'); }
            else { R(X + 2, Y + 9, 12, 3, '#2a3446'); R(X + 4, Y + 10, 3, 1, '#5c6c84'); } } }]); }
    }
    if (M.edge === 'u') for (let tx = x0; tx <= x0 + Math.ceil(VW / 16) + 1; tx++) { const ry = M.g.findIndex(r => r[0] === ',' && r[1] === ','); if (ry < 0) break; const Y = ry * 16 - camy; R(tx * 16 - camx, Y + 5, 16, 1, '#5a5650'); R(tx * 16 - camx, Y + 10, 16, 1, '#5a5650'); for (let i = 0; i < 16; i += 4) R(tx * 16 - camx + i, Y + 4, 2, 8, '#3a2a1c'); } // a tram road along the lane
    objs.sort((a, b) => a[0] - b[0]).forEach(o => o[1]());
    // crows over the rye at noon, drifting
    if (M.tod === 'noon') for (let i = 0; i < 3; i++) { const bx = ((t * .02 + i * 90) % (VW + 40)) - 20, by = 30 + i * 9 + Math.sin(t * .003 + i) * 3; R(bx, by, 5, 1, P.peat); R(bx + 1, by - 1, 1, 1, P.peat); R(bx + 3, by - 1, 1, 1, P.peat); }
    // shadows under the people, straight down at noon
    cx.save(); cx.globalCompositeOperation = 'multiply'; if (M.tod === 'noon') { cx.fillStyle = 'rgba(255,236,190,.0)'; } cx.restore();
    shadow(G.px + 8 - camx, G.py + 15 - camy, 7, .6);
    (M.npcs || []).forEach(n => shadow(n.x * 16 + 8 - camx, n.y * 16 + 15 - camy, 7, .55));
  };

  // light: noon is a hot white-gold grade; dusk and night keep their dark with a cool moon rim, and windows and lamps glow
  const origLight = window.siteLight;
  window.siteLight = function (M, camx, camy) {
    if (M.tod === 'noon') { cx.fillStyle = 'rgba(255,236,180,.10)'; cx.fillRect(0, 0, VW, VH); const g = cx.createLinearGradient(0, 0, 0, VH); g.addColorStop(0, 'rgba(255,250,230,.12)'); g.addColorStop(1, 'rgba(255,250,230,0)'); cx.fillStyle = g; cx.fillRect(0, 0, VW, VH); return; }
    if (M.tod === 'day' || M.tod === 'overcast') return origLight(M, camx, camy);
    const pools = [[G.px + 8 - camx, G.py + 6 - camy, (M.tod === 'night' ? 56 : 72) + (G.site && G.site.lit ? 30 : 0)]];
    for (let ty = 0; ty < M.h; ty++) for (let tx = 0; tx < M.w; tx++) { const ch = M.g[ty][tx], X = tx * 16 + 8 - camx, Y = ty * 16 + 8 - camy;
      if (ch === 'f' || ch === 'L') pools.push([X, Y - (ch === 'L' ? 12 : 0), ch === 'f' ? 46 : 34]);
      if (ch === 'h' && M.g[ty][tx + 1] === 'h' && (tx + ty) % 2 === 0) pools.push([X + 14, Y - 4, 20]);
      if (ch === 'p' && M.g[ty][tx + 1] === 'p' && M.g[ty + 1] && M.g[ty + 1][tx] === 'p') pools.push([X + 15, Y + 4, 26]); }
    StudioLight.night(cx, { dark: '#141826', alpha: M.tod === 'night' ? .66 : .45, warm: '#d9b45a', pools });
    cx.fillStyle = 'rgba(120,140,190,.06)'; cx.fillRect(0, 0, VW, VH); // moonlight: a cool lift so roofs and heaps still read
  };

  // the HUD cards, as on the street (8B), with the site's name and the day, and NEXT under them on one line
  window.drawSiteStrip = function () {
    if (!G.site) return; const r = G.run, m = party[G.lead | 0];
    const card = (x, y, w, h) => { R(x, y, w, h, P.peat); R(x + 1, y + 1, w - 2, h - 2, P.bone); R(x + 2, y + 2, w - 4, h - 4, 'rgba(44,38,33,.97)'); };
    card(2, 2, 104, 44);
    const g = cx.createLinearGradient(0, 5, 0, 43); g.addColorStop(0, '#a8906c'); g.addColorStop(1, '#6a5a44'); cx.fillStyle = g; cx.fillRect(5, 5, 36, 38);
    cx.drawImage((window.SPRITE_V3 || RLSP).portrait(m.sp, m.look), 4, 0, 56, 60, 5, 5, 34, 38);
    pT(m.name.toUpperCase(), 42, 3, P.tallow, 14);
    R(42, 17, 60, 4, P.peat); R(43, 18, Math.round(58 * m.hp / m.mhp), 2, P.rust); pT(`HP ${m.hp}/${m.mhp}`, 42, 20, P.bone, 12);
    pT(`WP ${m.wp} · SAN ${m.san}`, 42, 30, P.bone, 12);
    const w2 = 108; card(VW - w2 - 2, 2, w2, 44);
    pT(pFit(G.site.name, w2 - 8, 13), VW - w2 + 3, 3, P.bone, 13); pT(`${G.site.kind}`, VW - w2 + 3, 16, P.ash === '#857e72' ? '#c8bea8' : P.bone, 12); pT(`DAY ${r.day}`, VW - w2 + 3, 28, P.bone, 12);
    R(0, 48, VW, 14, 'rgba(28,24,20,.88)'); pT('NEXT', 4, 47, P.tallow, 12); pT(pFit(r.job ? r.job.next : '', VW - 36, 12), 32, 47, P.bone, 12);
  };

  // hotspots: the same Tallow diamond, now with a Peat outline and a slow bob, so it never reads as a dropped sheaf or a stray pixel
  window.drawSiteOver = function (M, camx, camy) {
    const job = G.run.job; if (!job) return; const t = performance.now();
    dias(M, camx, camy, job); plates(M, camx, camy, job);
  };
  function dias(M, camx, camy, job) { const t = performance.now();
    M.hot.forEach(h => { if (h.when && !h.when(job)) return; const used = job.used[h.id] === 'done', x = h.x * 16 + 8 - camx, y = h.y * 16 + 3 - camy + (used ? 0 : Math.round(Math.sin(t * .004) * 1.5)),
      near = Math.abs(G.x - h.x) + Math.abs(G.y - h.y) <= 1, s = near && !used ? 4 : 3, col = used ? '#857e72' : '#d9b45a';
      if (near && !used) { cx.fillStyle = 'rgba(217,180,90,.25)'; cx.beginPath(); cx.arc(x, y, 9, 0, 7); cx.fill(); }
      const dia = (s, c) => { for (let k = 0; k <= s; k++) R(x - k, y - s + k, 2 * k + 1, 1, c); for (let k = s - 1; k >= 0; k--) R(x - k, y + s - k, 2 * k + 1, 1, c); };
      dia(s + 1, P.peat); dia(s, col); if (!used) R(x - 1, y - s + 1, 1, 1, '#fff0c8'); });
  }
  function plates(M, camx, camy, job) {
    M.fights.forEach(f => { if (job.fights[f.id] || f.when && !f.when(job)) return; const x = f.x * 16 + 8 - camx, y = f.y * 16 - camy;
      (f.show || []).forEach((sp, k) => { const s = RLSP.map(sp.sp || 'rat', sp.look); cx.drawImage(s, x - 14 + k * 16, y - 10); });
      const tx = f.plate, w = pW(tx, 12) + 8; R(x - w / 2, y - 24, w, 12, 'rgba(28,24,20,.9)'); R(x - w / 2, y - 24, w, 1, P.rust); pT(tx, x - w / 2 + 4, y - 25, P.bone, 12); });
  };
  // night: the lead keeps a cool moon rim on top of the dark, so the figure never sinks into the heaps
  const light2 = window.siteLight;
  window.siteLight = function (M, camx, camy) { light2(M, camx, camy); if (day(M) || !G.run.job) return; dias(M, camx, camy, G.run.job); }; // hotspots stay bright on top of the dark
})();
