// Rushlight look pass, rough mockup v1 for the region map (Nov 23, 2026; spec 008, after Keegan: "the map needs a fresh pass").
// Same chart, same points, roads, river and scenery data (content/march.js); only the drawing changes. It follows the
// approved parchment (35) and the readability rules (41):
//   - the chart is aged parchment: a lit spot, stained edges and a few foxing spots, fibres at low contrast
//   - an inked river with a blue-grey wash and ripple strokes; woods as clumps of inked trees, lit from the upper left;
//     fields as hatched strips with an ochre wash; reed beds as ink tufts; hachured hills round Lowmoor
//   - roads in ink: main roads a double line with a pale bed, side roads dashed; one short cross stroke per day
//   - places drawn as little pictures (a walled town with towers, a church spire for the monastery town, cottages for a
//     hamlet, a pictogram for each wild site, the pit head for the den); names on a pale ribbon so they never sit on texture
//   - a compass rose (the shell already names the March); the brightest colours only on the coin, the route and the cursor
//   - the HUD: the same two cards as the sites (the party with the lead in Tallow; the place, purse, food and day), and
//     Hue and the four factions on one line under them; the road card at the bottom as a matching card
(function () {
  const INK = '#3a2c20', INK2 = '#5a4632', WASH = '#7c8c98', P = { peat: '#1c1814', soot: '#2c2621', bone: '#e6dcc4', ash: '#857e72', tallow: '#d9b45a', rust: '#9a4528', blood: '#5e1a18' };
  const R = (x, y, w, h, c) => { cx.fillStyle = c; cx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const H = (x, y) => (((x * 73856093) ^ (y * 19349663)) >>> 0);
  const SH2 = 62; // the HUD cards and the faction line
  window.chartRect = () => ({ x: 0, y: SH2, w: VW, h: VH - SH2 - 52 });

  // a pre-drawn chart, cached: the parchment and the scenery never change while the region is open
  let sheet = null;
  function bake() {
    const c = document.createElement('canvas'); c.width = MARCH.w; c.height = MARCH.h; const x = c.getContext('2d'), W = MARCH.w, Hh = MARCH.h;
    const r = (a, b, w, h, col) => { x.fillStyle = col; x.fillRect(Math.round(a), Math.round(b), w, h); };
    // parchment: base, a lit spot, stained edges, foxing, low-contrast fibres
    r(0, 0, W, Hh, '#d6c6a0');
    let g = x.createRadialGradient(W * .4, Hh * .4, 10, W * .4, Hh * .4, W * .7); g.addColorStop(0, 'rgba(255,248,222,.55)'); g.addColorStop(1, 'rgba(255,248,222,0)'); x.fillStyle = g; x.fillRect(0, 0, W, Hh);
    g = x.createRadialGradient(W / 2, Hh / 2, Math.min(W, Hh) * .35, W / 2, Hh / 2, W * .72); g.addColorStop(0, 'rgba(120,84,40,0)'); g.addColorStop(1, 'rgba(120,84,40,.45)'); x.fillStyle = g; x.fillRect(0, 0, W, Hh);
    for (const [fx, fy, fr] of [[60, 300, 14], [380, 80, 10], [260, 40, 7], [30, 30, 9]]) { const f = x.createRadialGradient(fx, fy, 1, fx, fy, fr); f.addColorStop(0, 'rgba(140,96,48,.28)'); f.addColorStop(1, 'rgba(140,96,48,0)'); x.fillStyle = f; x.fillRect(fx - fr, fy - fr, fr * 2, fr * 2); }
    for (let i = 0; i < 900; i++) { const k = H(i, 7), a = k % W, b = (k >> 9) % Hh; r(a, b, 1 + (k >> 20) % 3, 1, (k >> 3) % 2 ? 'rgba(150,118,74,.22)' : 'rgba(255,248,225,.35)'); }
    // hachured hills round Lowmoor and on the east edge
    const hill = (hx, hy, w) => { for (let i = 0; i < w; i += 2) { const h0 = Math.round(Math.sin(i / w * Math.PI) * 7); r(hx + i, hy - h0, 1, 1, INK2); if (i % 4 === 0 && i < w / 2) r(hx + i, hy - h0 + 1, 1, 3, 'rgba(90,70,50,.55)'); } };
    [[280, 330, 26], [330, 296, 22], [350, 340, 30], [300, 352, 18], [392, 260, 24], [20, 250, 26], [12, 300, 22]].forEach(a => hill(...a));
    // the river: a pale wash, two inked banks, ripple strokes
    const riv = (w, col) => { x.strokeStyle = col; x.lineWidth = w; x.lineJoin = x.lineCap = 'round'; x.beginPath(); MARCH.river.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); x.stroke(); };
    riv(9, INK2); riv(7, '#9aa8ae'); riv(3, '#b4c0c2');
    for (let i = 0; i < MARCH.river.length - 1; i++) { const [a, b] = MARCH.river[i], [c2, d] = MARCH.river[i + 1]; for (let t = .25; t < 1; t += .35) { const px = a + (c2 - a) * t, py = b + (d - b) * t; r(px - 1, py, 3, 1, WASH); } }
    // fields: hatched strips with an ochre wash, a hedge line in ink
    MARCH.fields.forEach(([a, b]) => { r(a - 2, b - 2, 30, 16, 'rgba(200,165,82,.35)'); for (let k = 0; k < 5; k++) r(a, b + k * 3, 26, 1, k % 2 ? '#a8873e' : '#8a6c2e'); for (let k = 0; k < 30; k += 3) r(a - 2 + k, b + 14, 2, 1, INK2); });
    // reed beds: ink tufts
    MARCH.beds.forEach(([a, b]) => { for (let k = 0; k < 7; k++) { const tx = a + k * 4, ty = b + (k % 2) * 3; r(tx, ty, 1, 5, '#5a6a3a'); r(tx - 1, ty + 1, 1, 2, '#5a6a3a'); r(tx + 1, ty + 2, 1, 2, '#5a6a3a'); r(tx - 1, ty + 5, 4, 1, INK2); } });
    // woods: clumps of inked trees, a lit crown and a shaded side, a trunk and a ground shadow
    MARCH.woods.forEach(([a, b]) => { [[0, 0], [9, 3], [3, 9], [12, -4], [15, 7]].forEach(([dx, dy]) => { const tx = a + dx, ty = b + dy;
      r(tx + 1, ty + 9, 7, 1, 'rgba(58,44,32,.35)'); r(tx + 3, ty + 6, 2, 3, INK);
      for (let yy = 0; yy < 7; yy++) for (let xx = 0; xx < 8; xx++) { const q = ((xx - 3.5) / 4) ** 2 + ((yy - 3) / 3.6) ** 2; if (q > 1) continue; r(tx + xx, ty + yy, 1, 1, q > .7 ? INK : xx + yy < 6 ? '#7a8a4a' : '#56623a'); } }); });
    // compass rose, bottom left; the title cartouche, top left
    const cx0 = 26, cy0 = Hh - 30; x.strokeStyle = INK2; x.lineWidth = 1; x.beginPath(); x.arc(cx0, cy0, 11, 0, 7); x.stroke();
    x.fillStyle = INK; x.beginPath(); x.moveTo(cx0, cy0 - 16); x.lineTo(cx0 + 3, cy0); x.lineTo(cx0, cy0 + 16); x.lineTo(cx0 - 3, cy0); x.fill();
    x.beginPath(); x.moveTo(cx0 - 16, cy0); x.lineTo(cx0, cy0 - 3); x.lineTo(cx0 + 16, cy0); x.lineTo(cx0, cy0 + 3); x.fill(); r(cx0 - 2, cy0 - 25, 5, 7, 'rgba(0,0,0,0)');
    x.font = '8px "Press Start 2P"'; x.fillStyle = INK; x.textBaseline = 'top'; x.fillText('N', cx0 - 3, cy0 - 27);
    sheet = c;
  }
  // a place as a little picture
  function pict(kind, k, x, y) { const r = (a, b, w, h, c) => R(x + a, y + b, w, h, c);
    r(-10, 4, 20, 2, 'rgba(58,44,32,.3)'); // its shadow on the paper
    if (kind === 'town') { // walls, two towers, a gate; Saint Ebbe's has a spire
      r(-10, -6, 20, 10, INK); r(-9, -5, 18, 8, '#efe4c8'); r(-9, -5, 3, 8, '#fff6dc'); r(4, -5, 5, 8, '#cdbf9c');
      r(-11, -10, 5, 14, INK); r(-10, -9, 3, 12, '#efe4c8'); r(6, -10, 5, 14, INK); r(7, -9, 3, 12, '#cdbf9c');
      r(-11, -11, 1, 1, INK); r(-9, -11, 1, 1, INK); r(-7, -11, 1, 1, INK); r(6, -11, 1, 1, INK); r(8, -11, 1, 1, INK); r(10, -11, 1, 1, INK);
      r(-2, -1, 4, 5, INK); r(-1, 0, 2, 4, '#6a4a2c');
      if (k === 'ebbe') { r(-1, -18, 2, 12, INK); r(-3, -13, 6, 1, INK); r(-2, -8, 4, 3, INK); } else { r(-6, -9, 3, 3, '#9a4528'); r(-1, -9, 3, 3, '#9a4528'); }
    } else if (kind === 'hamlet') { // three cottages, thatch in ochre
      [[-9, 0], [-1, -3], [5, 1]].forEach(([a, b]) => { r(a, b - 2, 7, 6, INK); r(a + 1, b - 1, 5, 4, '#efe4c8'); r(a - 1, b - 5, 9, 3, INK); r(a, b - 4, 7, 2, '#c8a552'); r(a + 3, b + 1, 1, 3, INK); });
    } else if (kind === 'den') { // the pit head: a frame over a black mouth, the Blood ring of a den
      R(x - 9, y - 3, 18, 9, P.blood); r(-6, -1, 12, 5, P.peat); r(-5, -12, 2, 11, INK); r(3, -12, 2, 11, INK); r(-6, -13, 12, 2, INK); r(-1, -11, 2, 2, '#7a7a7a'); r(-1, -9, 1, 8, INK2);
    } else { // a wild site: a pictogram per place
      if (k === 'camp') { r(-6, -2, 12, 6, INK); r(-5, -1, 10, 4, '#6a5a4a'); r(-3, -6, 6, 4, INK); r(-2, -5, 4, 3, '#4a3e34'); for (let i = 0; i < 3; i++) R(x - 1 + i, y - 10 - i * 3, 2, 2, 'rgba(90,80,70,.5)'); }
      else if (k === 'cause') { for (let i = -9; i < 10; i += 3) { r(i, -1, 2, 5, INK); } r(-10, 0, 20, 1, INK2); r(-10, 3, 20, 1, INK2); }
      else if (k === 'crook') { r(-7, -4, 7, 8, INK); r(-6, -3, 5, 6, '#cdbf9c'); r(1, -2, 7, 6, INK); r(2, -1, 5, 4, '#cdbf9c'); r(-8, -6, 9, 2, INK); r(0, -4, 9, 2, INK); r(-5, -1, 3, 3, '#5e1a18'); r(-4, -2, 1, 5, '#5e1a18'); }
      else { r(-5, -5, 10, 9, INK); r(-4, -4, 8, 7, '#c8a552'); }
    } }
  function ribbon(t, x, y, big) { const s = big ? 13 : 12, w = pW(t, s) + 8; const xc = Math.max(w / 2 + 2, Math.min(VW - w / 2 - 2, x)); if (Math.abs(xc - x) > w / 2) return; x = xc; R(x - w / 2, y, w, s - 1, 'rgba(242,234,214,.82)'); R(x - w / 2, y + s - 1, w, 1, 'rgba(58,44,32,.4)'); pT(t, x - w / 2 + 4, y - 2, INK, s); }

  window.drawChart = function (ox, oy) {
    const g = RG(); if (!sheet) bake(); cx.drawImage(sheet, ox, oy);
    // roads
    const rt = MAPV.cur !== g.at && knownPt(MAPV.cur) ? route(g.at, MAPV.cur) : null, onRoute = new Set(rt ? rt.legs.map(l => l.road) : []);
    Object.keys(RD).forEach(id => { if (!knownRoad(id)) return; const Rr = RD[id], pts = [[P_[Rr[0]].x, P_[Rr[0]].y], ...Rr[4], [P_[Rr[1]].x, P_[Rr[1]].y]];
      const path = () => { cx.beginPath(); pts.forEach(([x, y], i) => i ? cx.lineTo(ox + x, oy + y) : cx.moveTo(ox + x, oy + y)); };
      cx.lineJoin = cx.lineCap = 'round';
      if (Rr[3] === 'main') { path(); cx.strokeStyle = INK; cx.lineWidth = 4; cx.stroke(); path(); cx.strokeStyle = '#e8dcc0'; cx.lineWidth = 2; cx.stroke(); }
      else { path(); cx.strokeStyle = Rr[3] === 'den' ? P.blood : INK; cx.lineWidth = 1.5; cx.setLineDash([4, 3]); cx.stroke(); cx.setLineDash([]); }
      const n = roadDays(id); for (let d = 1; d <= n; d++) { const [x, y] = along(pts, d / (n + 1)), [x2, y2] = along(pts, Math.min(1, d / (n + 1) + .02)), a = Math.atan2(y2 - y, x2 - x) + Math.PI / 2;
        cx.strokeStyle = INK; cx.lineWidth = 1.5; cx.beginPath(); cx.moveTo(ox + x - Math.cos(a) * 4, oy + y - Math.sin(a) * 4); cx.lineTo(ox + x + Math.cos(a) * 4, oy + y + Math.sin(a) * 4); cx.stroke(); }
      if (onRoute.has(id)) { const t = performance.now() / 120; for (let q = 0; q < 14; q++) { const [x, y] = along(pts, ((q + t) % 14) / 14); R(ox + x - 2, oy + y - 2, 4, 4, INK); R(ox + x - 1, oy + y - 1, 2, 2, P.tallow); } }
      Object.entries(g.roam).forEach(([k, ro]) => { if (ro.road === id && ro.met && !ro.dead) { const [x, y] = along(pts, .5); claws(ox + x + 4, oy + y - 8); } });
    });
    g.roads.forEach(id => RD[id].slice(0, 2).forEach(k => { if (!knownPt(k)) { const p = P_[k]; pT('?', ox + p.x - 3, oy + p.y - 8, INK2, 16); } }));
    (g.seals || []).forEach(k => { const p = P_[k]; if (!p) return; const x = ox + p.x + 10, y = oy + p.y - 12; cx.fillStyle = P.blood; cx.beginPath(); cx.arc(x, y, 5, 0, 7); cx.fill(); cx.fillStyle = P.rust; cx.beginPath(); cx.arc(x - 1, y - 1, 3.5, 0, 7); cx.fill(); R(x - 1, y - 2, 2, 3, P.blood); });
    Object.keys(P_).forEach(k => { if (!knownPt(k)) return; const p = P_[k], x = ox + p.x, y = oy + p.y;
      if (p.kind === 'lie') { pT('?', x - 3, y - 8, INK2, 16); ribbon(p.name, x, y + 9, false); return; }
      pict(p.kind, k, x, y); ribbon(p.kind === 'town' ? p.name : p.name.replace(/^the /, 'The '), x, y + 8, p.kind === 'town'); });
    // the cursor: Tallow corner brackets with a Peat edge
    const c = P_[MAPV.cur], b = Math.floor(performance.now() / 300) % 2, s = 11 + b, X = ox + c.x, Y = oy + c.y - 4;
    for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { const ax = X + sx * s, ay = Y + sy * s; R(ax - (sx > 0 ? 5 : 0) - 1, ay - 1, 7, 3, P.peat); R(ax - 1, ay - (sy > 0 ? 5 : 0) - 1, 3, 7, P.peat); R(ax - (sx > 0 ? 4 : 0), ay, 5, 1, P.tallow); R(ax, ay - (sy > 0 ? 4 : 0), 1, 5, P.tallow); }
    const at = P_[g.at], coin = RLSP.coin(lead().sp); cx.fillStyle = 'rgba(28,24,20,.35)'; cx.beginPath(); cx.ellipse(ox + at.x + 12, oy + at.y - 2, 8, 2.5, 0, 0, 7); cx.fill(); cx.drawImage(coin, ox + at.x + 3, oy + at.y - 20);
  };

  // the HUD, as on the sites: a party card, a place card, then Hue and the factions on one line
  window.drawStrip = function () {
    const g = RG(), r = G.run; R(0, 0, VW, SH2, 'rgba(28,24,20,.0)');
    const card = (x, y, w, h) => { R(x, y, w, h, P.peat); R(x + 1, y + 1, w - 2, h - 2, P.bone); R(x + 2, y + 2, w - 4, h - 4, 'rgba(44,38,33,.97)'); };
    card(2, 2, 104, 44); let x = 6;
    party.forEach((m, i) => { const on = i === (G.lead | 0); R(x - 1, 5, 32, 32, on ? P.tallow : '#5a4a3a'); const gr = cx.createLinearGradient(0, 6, 0, 36); gr.addColorStop(0, '#a8906c'); gr.addColorStop(1, '#6a5a44'); cx.fillStyle = gr; cx.fillRect(x, 6, 30, 30);
      cx.drawImage((window.SPRITE_V3 || RLSP).portrait(m.sp, m.look), 4, 0, 56, 56, x, 6, 30, 30); if (m.dead) R(x, 6, 30, 30, 'rgba(28,24,20,.7)'); x += 33; });
    pT(party[G.lead | 0].name.toUpperCase(), 6, 34, P.tallow, 11);
    const w2 = VW - 112; card(108, 2, w2 - 2, 44);
    const where = g.trip ? 'ON THE ROAD' : P_[g.at].name.toUpperCase(); pT(pFit(where, w2 - 12, 13), 113, 3, P.bone, 13);
    const live = Math.max(1, alive().length), days = Math.floor(r.rations / live);
    pT(`${r.purse} gr`, 113, 16, P.tallow, 12); pT(`DAY ${r.day}`, VW - 8 - pW(`DAY ${r.day}`, 12), 16, P.bone, 12);
    pT(`Food ${r.rations} · ${days} days`, 113, 28, r.rations < live ? '#c8603a' : P.bone, 12);
    R(0, 48, VW, 14, 'rgba(28,24,20,.92)'); const hue = r.hue | 0; pT('HUE', 4, 47, P.tallow, 12); for (let k = 0; k < 4; k++) R(24 + k * 6, 51, 4, 7, k < hue ? P.rust : '#4d4134');
    let fx = 54; [['Lord', 'lord'], ['Church', 'church'], ['Town', 'town'], ['Outlaws', 'outlaws']].forEach(([n, k]) => { const st = r.fac && r.fac[k] ? ['hated', 'wary', '–', 'trusted', 'sworn'][r.fac[k].step] : '–';
      pT(n, fx, 47, '#c8bea8', 12); fx += pW(n, 12) + 3; pT(st, fx, 47, st === 'hated' ? '#c8603a' : st === '–' ? P.bone : P.tallow, 12); fx += pW(st, 12) + 8; });
  };
  // the inset: a small parchment chart in an ink frame
  window.drawInset = function (rr) { const w = 46, h = 40, x = rr.x + rr.w - w - 4, y = rr.y + 4; R(x - 1, y - 1, w + 2, h + 2, P.peat); R(x, y, w, h, INK); if (sheet) cx.drawImage(sheet, x + 1, y + 1, w - 2, h - 2);
    Object.keys(P_).forEach(k => { if (!knownPt(k)) return; const p = P_[k]; R(x + 1 + p.x * (w - 2) / MARCH.w - 1, y + 1 + p.y * (h - 2) / MARCH.h - 1, 3, 3, k === RG().at ? P.rust : INK); });
    const cr = chartRect(); cx.strokeStyle = P.tallow; cx.lineWidth = 1; cx.strokeRect(x + 1 + MAPV.cam[0] * (w - 2) / MARCH.w, y + 1 + MAPV.cam[1] * (h - 2) / MARCH.h, cr.w * (w - 2) / MARCH.w, cr.h * (h - 2) / MARCH.h); };
  // edge tabs: a parchment tag with an ink edge, so they read as part of the chart
  window.drawTabs = function (rr, ox, oy) { MAPV.tabs = []; const bot = [], top = [];
    Object.keys(P_).forEach(k => { if (!knownPt(k)) return; const p = P_[k], x = ox + p.x, y = oy + p.y; if (x >= rr.x && x < rr.x + rr.w && y >= rr.y && y < rr.y + rr.h) return;
      const nm = p.name.replace(/^the /, '').toUpperCase(); if (y >= rr.y + rr.h && x >= rr.x && x < rr.x + rr.w) { bot.push([x, nm + ' ▼', k]); return; } if (y < rr.y && x >= rr.x && x < rr.x + rr.w) { top.push([x, nm + ' ▲', k]); return; }
      const t = (x < rr.x ? '◀ ' : '') + nm + (x >= rr.x + rr.w ? ' ▶' : ''), w = pW(t, 11) + 8, tx = x < rr.x ? rr.x + 2 : rr.x + rr.w - w - 2; let ty = clamp(y - 6, rr.y + 48, rr.y + rr.h - 30);
      while (MAPV.tabs.some(o => tx < o.x + o.w && tx + w > o.x && Math.abs(ty - o.y) < 14)) ty -= 15; tab(t, tx, ty, w, k); });
    // off the bottom or top: one row along that edge, in order left to right, never on top of each other
    [[bot, rr.y + rr.h - 15], [top, rr.y + 2]].forEach(([L, y]) => { L.sort((a, b) => a[0] - b[0]); let x = rr.x + 2; const ws = L.map(([, t]) => pW(t, 11) + 8), tot = ws.reduce((a, b) => a + b + 3, 0);
      x = Math.max(rr.x + 2, Math.min(rr.x + rr.w - 2 - tot, (L.length ? L[0][0] : 0) - ws[0] / 2)); L.forEach(([, t, k], i) => { tab(t, x, y, ws[i], k); x += ws[i] + 3; }); });
    function tab(t, tx, ty, w, k) { R(tx, ty, w, 13, INK); R(tx + 1, ty + 1, w - 2, 11, '#efe4c8'); pT(t, tx + 4, ty, INK, 11); MAPV.tabs.push({ x: tx, y: ty, w, h: 13, k }); } };
  // the road card: the same card as the HUD, a bit taller, so nothing is cut
  window.drawRoadCard = function () { const g = RG(), r = G.run, y = VH - 52, c = MAPV.cur, p = P_[c];
    R(2, y, VW - 4, 50, P.peat); R(3, y + 1, VW - 6, 48, P.bone); R(4, y + 2, VW - 8, 46, 'rgba(44,38,33,.98)');
    if (MAPV.log.length && (g.trip || G.busy)) { MAPV.log.slice(-3).forEach((l, i) => pT(pFit(l, VW - 16, 14), 8, y + 3 + i * 14, P.bone, 14)); return; }
    pT(p.name.toUpperCase(), 8, y + 2, P.tallow, 15); pT(p.type, VW - 8 - pW(p.type, 13), y + 3, '#c8bea8', 13);
    if (c === g.at) { pT('You are here. A: go in.', 8, y + 18, P.bone, 14); pT('◀▶▲▼ pick a place · L key · R contracts', 8, y + 32, '#c8bea8', 12); return; }
    const rt = route(g.at, c); if (!rt) { pT('No known road there.', 8, y + 18, P.bone, 14); return; }
    const need = rationsNeed(rt.days); pT(`Road ${rt.days} day${rt.days > 1 ? 's' : ''}`, 8, y + 18, P.bone, 14); pT(`Food ${need} of ${r.rations}`, 84, y + 18, r.rations < need ? '#c8603a' : P.bone, 14);
    const ev = `${rt.days} event roll${rt.days > 1 ? 's' : ''}`; pT(ev, VW - 8 - pW(ev, 14), y + 18, P.bone, 14);
    pT('Threat ???', 8, y + 32, '#c8bea8', 14); pT('A: go', VW - 8 - pW('A: go', 14), y + 32, P.tallow, 14); };
  const sc = document.querySelector('.scan'); if (sc) sc.style.opacity = '.35';
})();
