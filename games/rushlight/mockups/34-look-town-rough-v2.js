// Rushlight look pass, rough mockup v2 (Nov 23, after Keegan's notes on v1: warmer light, deeper buildings, street life,
// characters that pop, a bigger HUD). Built on v1: Harrowford redone to studio-bible Screen craft and "Maps are lit / dressed".
// Rough, Nov 23, 2026. Injected into the real game build (games/rushlight/src/dist/index.html) on the town street,
// so the base street, buildings, folk and box are the game's own; this file only adds on top:
//   lit: late-afternoon grade, shadows at building feet and under folk and props, lit windows, two lamps with pools
//   dressed: a worn dirt lane, puddles, moss and leaves in the cobbles, barrels, crates, sacks, a willow and hedge edge
//   only the lead walks (no trailing mercs)
//   HUD: a framed lead card (2x portrait, name, HP bar, WP, SAN) and a framed place card (name, type / purse, day)
//   dialog text in Bone, not Ash
(function () {
  const P = { peat: '#1c1814', soot: '#2c2621', bone: '#e6dcc4', ash: '#857e72', tallow: '#d9b45a', rust: '#9a4528', moss: '#56623a', mossD: '#434d2c', dusk: '#3b4757', duskL: '#5c6c7c', timber: '#5a3e2b', timberD: '#3e2a1c', straw: '#c8a552', mud: '#6b5640', mudL: '#82684c', leaf: '#b5652a', leafD: '#8a4a22' };
  const R = (x, y, w, h, c) => { cx.fillStyle = c; cx.fillRect(Math.round(x), Math.round(y), w, h); };
  const hash = (a, b) => { let h = (a * 374761393 + b * 668265263) | 0; h = (h ^ (h >> 13)) * 1274126177; return ((h ^ (h >> 16)) >>> 0) / 4294967296; };
  const shadow = (x, y, w) => { cx.fillStyle = 'rgba(28,24,20,.45)'; cx.beginPath(); cx.ellipse(x, y, w / 2, Math.max(2, w / 5), 0, 0, 7); cx.fill(); };

  function barrel(x, y) { shadow(x + 6, y + 14, 14); R(x, y, 12, 14, P.peat); R(x + 1, y + 1, 10, 12, P.timber); R(x + 7, y + 1, 4, 12, P.timberD); R(x + 1, y + 3, 10, 1, P.peat); R(x + 1, y + 10, 10, 1, P.peat); R(x + 2, y + 1, 8, 1, P.mudL); }
  function crate(x, y) { shadow(x + 7, y + 12, 16); R(x, y, 14, 12, P.peat); R(x + 1, y + 1, 12, 10, P.straw); R(x + 1, y + 1, 12, 2, '#d8bd6c'); R(x + 9, y + 3, 4, 8, '#a8873e'); R(x + 1, y + 6, 12, 1, P.timber); R(x + 6, y + 1, 1, 10, P.timber); }
  function sack(x, y) { shadow(x + 5, y + 10, 12); R(x + 1, y + 2, 9, 8, P.peat); R(x + 2, y + 3, 7, 7, '#b8ab8c'); R(x + 6, y + 4, 3, 6, '#9c8f72'); R(x + 3, y + 1, 4, 2, '#9c8f72'); }
  function lamp(x, y) { shadow(x + 2, y + 2, 10); R(x + 1, y - 30, 2, 32, P.peat); R(x - 3, y - 36, 10, 8, P.peat); R(x - 2, y - 35, 8, 6, '#f2d27a'); R(x - 4, y - 37, 12, 2, P.peat); }
  function willow(x, y) {
    // a pollard willow: a fat stump, a crown of shoots, strands hanging down
    shadow(x + 12, y + 2, 40);
    R(x + 6, y - 26, 12, 28, P.peat); R(x + 7, y - 25, 10, 27, P.timber); R(x + 13, y - 25, 4, 27, P.timberD); R(x + 8, y - 20, 2, 6, P.mudL);
    cx.fillStyle = P.peat; cx.beginPath(); cx.ellipse(x + 12, y - 36, 22, 14, 0, 0, 7); cx.fill();
    cx.fillStyle = P.mossD; cx.beginPath(); cx.ellipse(x + 12, y - 36, 21, 13, 0, 0, 7); cx.fill();
    cx.fillStyle = P.moss; cx.beginPath(); cx.ellipse(x + 8, y - 40, 14, 8, 0, 0, 7); cx.fill();
    cx.fillStyle = '#6e7a48'; cx.beginPath(); cx.ellipse(x + 5, y - 43, 7, 4, 0, 0, 7); cx.fill();
    for (let i = 0; i < 14; i++) { const sx = x - 8 + i * 3.2, len = 10 + hash(i, x) * 12; for (let k = 0; k < len; k += 2) R(sx + (hash(i, k) - .5) * 2, y - 28 + k, 1, 2, i > 9 ? P.mossD : P.moss); }
    if (hash(x, 3) > .4) { R(x + 2, y - 40, 2, 2, P.leaf); R(x + 18, y - 34, 2, 2, P.leaf); }
  }
  function hedge(x0, y, w) { for (let x = x0; x < x0 + w; x += 6) { const h = 14 + hash(x, y) * 8; R(x - 1, y - h - 1, 9, h + 8, P.peat); } for (let x = x0; x < x0 + w; x += 6) { const h = 14 + hash(x, y) * 8; R(x, y - h, 7, h + 6, P.mossD); R(x + 1, y - h + 1, 4, 3, P.moss); if (hash(x, 9) > .7) R(x + 3, y - h + 5, 2, 2, P.leaf); if (hash(x, 4) > .85) R(x + 1, y - h + 8, 2, 2, '#a8323a'); } }
  function trough(x, y) { shadow(x + 14, y + 11, 32); R(x, y, 28, 10, P.peat); R(x + 1, y + 1, 26, 8, '#8a8274'); R(x + 3, y + 2, 22, 3, P.dusk); R(x + 4, y + 2, 8, 1, P.duskL); R(x + 1, y + 7, 26, 2, '#6a6458'); }
  function bench(x, y) { shadow(x + 14, y + 9, 30); R(x, y, 28, 4, P.peat); R(x + 1, y + 1, 26, 2, P.timber); R(x + 2, y + 4, 3, 6, P.timberD); R(x + 23, y + 4, 3, 6, P.timberD); }
  function wood(x, y) { shadow(x + 10, y + 10, 24); for (let r = 0; r < 3; r++) for (let c = 0; c < 4 - r; c++) { const px = x + c * 6 + r * 3, py = y + 6 - r * 5; R(px, py, 6, 5, P.peat); R(px + 1, py + 1, 4, 3, P.mudL); R(px + 2, py + 2, 2, 1, P.timberD); } }
  function fence(x0, y, w) { for (let x = x0; x < x0 + w; x += 12) { R(x, y - 12, 3, 14, P.peat); R(x + 1, y - 11, 1, 12, P.timber); } R(x0, y - 9, w, 3, P.peat); R(x0, y - 8, w, 1, P.timber); R(x0, y - 3, w, 3, P.peat); R(x0, y - 2, w, 1, P.timber); }


  function roof(b, x, y) {
    const w = b.w * 16, slate = b.kind === 'smithy' || b.kind === 'hall', c = slate ? '#4a4a52' : '#a8873e', cd = slate ? '#35353c' : '#7e6430', h = 14 + (b.x * 7 % 3) * 4;
    cx.fillStyle = P.peat; cx.beginPath(); cx.moveTo(x - 3, y + 8); cx.lineTo(x + 6, y - h - 1); cx.lineTo(x + w - 6, y - h - 1); cx.lineTo(x + w + 3, y + 8); cx.fill();
    cx.fillStyle = c; cx.beginPath(); cx.moveTo(x - 1, y + 7); cx.lineTo(x + 7, y - h); cx.lineTo(x + w - 7, y - h); cx.lineTo(x + w + 1, y + 7); cx.fill();
    for (let k = y - h + 3; k < y + 7; k += 3) R(x, k, w, 1, cd);
    R(x + 7, y - h, w - 14, 2, slate ? '#6a6a74' : '#d8bd6c');
    if (b.kind !== 'hall') { const chx = x + w - 16; R(chx, y - h - 10, 7, 12, P.peat); R(chx + 1, y - h - 9, 5, 11, '#8a8274'); R(chx + 4, y - h - 9, 2, 11, '#6a6458');
      const t = performance.now() / 900; for (let i = 0; i < 5; i++) { const k = (t + i * .2) % 1; cx.fillStyle = `rgba(200,190,175,${.35 * (1 - k)})`; cx.beginPath(); cx.arc(chx + 3 + Math.sin(k * 6 + i) * 3 + k * 8, y - h - 12 - k * 22, 2 + k * 4, 0, 7); cx.fill(); } }
    // a dormer on the wider houses
    if (b.w >= 4 && !slate) { const dx = x + 10; R(dx - 1, y - h + 2, 12, 11, P.peat); R(dx, y - h + 3, 10, 9, '#d8ccb0'); R(dx + 2, y - h + 5, 6, 5, P.peat); R(dx + 3, y - h + 6, 4, 4, '#f2d27a'); }
  }
  function jetty(b, x, y) { if (b.kind === 'stone' || b.kind === 'priory' || b.kind === 'wall') return; const w = b.w * 16; R(x - 2, y + 34, w + 4, 3, P.peat); R(x - 2, y + 33, w + 4, 1, P.mudL); const g = cx.createLinearGradient(0, y + 37, 0, y + 44); g.addColorStop(0, 'rgba(28,24,20,.45)'); g.addColorStop(1, 'rgba(28,24,20,0)'); cx.fillStyle = g; cx.fillRect(x, y + 37, w, 7); }
  function sideShade(b, x, y) { const w = b.w * 16, g = cx.createLinearGradient(x + w - 10, 0, x + w, 0); g.addColorStop(0, 'rgba(40,44,70,0)'); g.addColorStop(1, 'rgba(40,44,70,.4)'); cx.fillStyle = g; cx.fillRect(x + w - 10, y, 10, 64); }
  function sign(kind, x, y) { R(x, y, 10, 1, P.peat); R(x + 9, y - 2, 1, 3, P.peat);
    if (kind === 'smith') { R(x + 1, y + 1, 1, 4, P.peat); R(x - 2, y + 5, 10, 3, P.peat); R(x - 4, y + 5, 3, 2, P.peat); R(x + 1, y + 8, 4, 3, P.peat); R(x - 1, y + 6, 8, 1, '#6a6a74'); }
    if (kind === 'barber') { R(x + 2, y + 1, 3, 12, P.peat); for (let k = 0; k < 11; k += 3) R(x + 3, y + 2 + k, 1, 2, k % 6 ? '#e6dcc4' : '#9a4528'); R(x + 3, y + 2, 1, 1, '#e6dcc4'); } }
  function crow(x, y, t) { const f = Math.floor(t / 300 + x) % 2; R(x, y, 4, 3, P.peat); R(x + 3, y - 1, 2, 2, P.peat); R(x + 5, y, 1, 1, '#b8913a'); R(x - 2, y + f, 2, 1, P.peat); R(x + 1, y + 3, 1, 2, P.peat); R(x + 3, y + 3, 1, 2, P.peat); }
  function dog(x, y, t) { shadow(x + 7, y + 9, 16); const w = Math.floor(t / 200) % 2; R(x, y + 2, 12, 5, P.peat); R(x + 1, y + 3, 10, 3, '#8a6a44'); R(x + 10, y, 5, 5, P.peat); R(x + 11, y + 1, 3, 3, '#8a6a44'); R(x + 14, y + 2, 2, 2, P.peat); R(x - 2, y + 1 + w, 3, 1, P.peat); R(x + 1, y + 7, 1, 3, P.peat); R(x + 9, y + 7, 1, 3, P.peat); R(x + 4, y + 7, 1, 3 - w, P.peat); }
  function washing(x0, x1, y) { cx.strokeStyle = P.peat; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(x0, y); cx.quadraticCurveTo((x0 + x1) / 2, y + 6, x1, y); cx.stroke(); [['#d8ccb0', 8], ['#56623a', 6], ['#9a4528', 7], ['#3b4757', 6]].forEach(([c, w], i) => { const px = x0 + 6 + i * ((x1 - x0 - 14) / 4), py = y + 3 + Math.sin(i) * 1.5; R(px, py, w, 7, P.peat); R(px + 1, py, w - 2, 6, c); }); }
  const EXTRA = [[8, 6, 'mouse', { shade: 0, mark: 0, neck: 1, coat: '#9a4528' }], [12.5, 7.5, 'badger', { shade: 1, mark: 0, neck: 0, coat: '#56623a' }], [21, 5.6, 'fox', { shade: 1, mark: 0, neck: 0, coat: '#3b4757' }], [26, 7.7, 'hedgehog', { shade: 2, mark: 0, neck: 1, coat: '#8a7458' }]];

  const orig = { drawStreet: window.drawStreet, lights: window.lights, drawTownStrip: window.drawTownStrip };
  let leafPts = null;

  window.drawStreet = function (M, camx, camy) {
    orig.drawStreet(M, camx, camy);
    const ox = -camx, oy = -camy, W = M.w * 16, H = M.h * 16, t = performance.now();
    // buildings with depth: roofs, chimneys with smoke, jettied upper floors, shade on the far side, hanging signs
    const BS = TOWNS[M.town].buildings || [];
    BS.forEach(b => { const x = ox + b.x * 16; if (b.kind !== 'wall' && b.kind !== 'stone' && b.kind !== 'priory') roof(b, x, oy); jetty(b, x, oy); sideShade(b, x, oy);
      if (b.place === 'smith' || b.place === 'barber') sign(b.place, ox + b.door * 16 + 16, oy + 38); });
    washing(ox + 4 * 16 + 4, ox + 7 * 16 - 2, oy - 2);
    [[ox + 15 * 16, oy - 20], [ox + 15 * 16 + 9, oy - 21], [ox + 30 * 16, oy - 15]].forEach(([x, y]) => crow(x, y, t));
    // the lane people walk: smoother, paler cobbles so folk stand out from the ground
    { const g = cx.createLinearGradient(0, oy + 76, 0, oy + 128); g.addColorStop(0, 'rgba(230,220,196,0)'); g.addColorStop(.5, 'rgba(230,220,196,.16)'); g.addColorStop(1, 'rgba(230,220,196,0)'); cx.fillStyle = g; cx.fillRect(ox, oy + 76, W, 52); }
    // a worn dirt lane along the street, uneven edges, wheel ruts
    for (let x = 0; x < W; x += 4) { const top = 128 + Math.round(Math.sin(x / 37) * 5 + hash(x, 1) * 3), bot = top + 26 + Math.round(hash(x, 2) * 5); R(ox + x, oy + top, 4, bot - top, P.mud); R(ox + x, oy + top, 4, 2, P.mudL); }
    for (let x = 0; x < W; x += 2) { R(ox + x, oy + 138 + Math.round(Math.sin(x / 37) * 5), 2, 1, '#5a4634'); R(ox + x, oy + 147 + Math.round(Math.sin(x / 37) * 5), 2, 1, '#5a4634'); }
    // puddles that catch the sky
    [[5, 9], [13, 8.6], [22, 9.2], [29, 8.8]].forEach(([tx, ty], i) => { const x = ox + tx * 16, y = oy + ty * 16; cx.fillStyle = P.dusk; cx.beginPath(); cx.ellipse(x, y, 9 + i % 2 * 3, 3, 0, 0, 7); cx.fill(); R(x - 4, y - 1, 5, 1, P.duskL); R(x + 2, y + 1, 3, 1, '#8a7a62'); });
    // moss in the cracks and autumn leaves blown into corners
    if (!leafPts) { leafPts = []; for (let i = 0; i < 260; i++) leafPts.push([hash(i, 7) * W, 70 + hash(i, 8) * (H - 90), hash(i, 9)]); }
    leafPts.forEach(([x, y, k]) => { if (k < .45) R(ox + x, oy + y, 2, 1, P.mossD); else if (k < .75) R(ox + x, oy + y, 2, 2, k < .6 ? P.leaf : P.leafD); });
    // shadow at the foot of every building (light from the upper left)
    const g = cx.createLinearGradient(0, oy + 64, 0, oy + 76); g.addColorStop(0, 'rgba(28,24,20,.55)'); g.addColorStop(1, 'rgba(28,24,20,0)'); cx.fillStyle = g; cx.fillRect(ox, oy + 64, W, 12);
    // shadows under props already on the street, and under folk
    (TOWNS[M.town].props || []).forEach(p => shadow(ox + p.x * 16 + 14, oy + p.y * 16 + 13, 28));
    M.npcs.forEach(n => shadow(ox + n.x * 16 + 8, oy + n.y * 16 + 15, 12));
    shadow(G.px - camx + 8, G.py - camy + 15, 12);
    EXTRA.forEach(([tx, ty, sp, look]) => { const x = ox + tx * 16, y = oy + ty * 16; shadow(x + 8, y + 15, 12); cx.drawImage(RLSP.map(sp, look), x + 1, y + 16 - 26); });
    dog(ox + 13 * 16, oy + 6 * 16 + 4, t);
    // new dressing by the doors and along the street
    barrel(ox + 3 * 16 + 2, oy + 66); barrel(ox + 3 * 16 + 14, oy + 68); crate(ox + 10 * 16, oy + 67); sack(ox + 11 * 16 - 2, oy + 69);
    crate(ox + 19 * 16, oy + 68); barrel(ox + 26 * 16, oy + 66); sack(ox + 27 * 16, oy + 70); crate(ox + 31 * 16, oy + 67);
    lamp(ox + 7 * 16 + 4, oy + 120); lamp(ox + 16 * 16 + 4, oy + 120); lamp(ox + 25 * 16 + 4, oy + 120);
    // the bottom edge framed: a hedge with willows, so the screen never ends on bare ground
    R(ox, oy + H - 16, W, VH, P.mossD); hedge(ox, oy + H - 6, W);
    [1, 8, 15, 21, 28].forEach(t => willow(ox + t * 16, oy + H + 4));
    // the lower street: a trough, a bench, firewood and a paddock fence, so no bare cobbles
    trough(ox + 4 * 16, oy + 172); bench(ox + 12 * 16, oy + 176); wood(ox + 19 * 16, oy + 170); fence(ox + 23 * 16, oy + 186, 64); sack(ox + 8 * 16, oy + 176); barrel(ox + 30 * 16, oy + 170);
  };

  window.lights = function (M, camx, camy) {
    const ox = -camx, oy = -camy, lamps = [7, 16, 25].map(t => [ox + t * 16 + 6, oy + 86, 46]);
    const wins = []; (TOWNS[M.town].buildings || []).forEach(b => { if (b.kind === 'wall' || b.kind === 'stone') return; for (let c = 4; c < b.w * 16 - 8; c += 16) wins.push([ox + b.x * 16 + c + 4, oy + 18, 10, .3]); });
    // late autumn sun from the upper left: gold on the house fronts, blue-brown in the shade, lamps just lit
    cx.globalCompositeOperation = 'multiply';
    let g = cx.createLinearGradient(0, 0, VW, VH); g.addColorStop(0, '#ffe2b0'); g.addColorStop(.55, '#e8c79a'); g.addColorStop(1, '#8c84a0'); cx.fillStyle = g; cx.fillRect(0, 0, VW, VH);
    cx.globalCompositeOperation = 'soft-light';
    g = cx.createLinearGradient(0, oy - 30, 0, oy + 70); g.addColorStop(0, 'rgba(255,200,110,.0)'); g.addColorStop(.35, 'rgba(255,190,100,.55)'); g.addColorStop(1, 'rgba(255,190,100,.15)'); cx.fillStyle = g; cx.fillRect(0, oy - 30, VW, 100);
    cx.globalCompositeOperation = 'source-over';
    StudioLight.night(cx, { dark: '#2a2236', alpha: .16, warm: LOOK.warm, pools: [[G.px - camx + 8, G.py - camy + 8, 36], ...lamps], glows: [...wins, ...lamps.map(l => [l[0], l[1] - 34, 14, .45])] });
  };

  // HUD: two framed cards in place of the one squeezed line
  window.drawTownStrip = function () {
    const r = G.run, T = TOWNS[G.town]; if (!T) return; const m = party[G.lead | 0];
    const card = (x, y, w, h) => { R(x, y, w, h, P.peat); R(x + 1, y + 1, w - 2, h - 2, P.bone); R(x + 2, y + 2, w - 4, h - 4, 'rgba(44,38,33,.97)'); };
    card(2, 2, 104, 40);
    R(5, 5, 34, 34, '#8a7458'); R(5, 5, 34, 3, '#a8906c'); cx.drawImage(RLSP.portrait(m.sp, m.look), 2, 0, 60, 60, 5, 5, 34, 34);
    pT(m.name.toUpperCase(), 42, 3, P.tallow, 14);
    R(42, 17, 60, 4, P.peat); R(43, 18, Math.round(58 * m.hp / m.mhp), 2, P.rust); pT(`HP ${m.hp}/${m.mhp}`, 42, 21, P.bone, 12);
    pT(`WP ${m.wp} · SAN ${m.san}`, 42, 30, P.bone, 12);
    const w2 = 80; card(VW - w2 - 2, 2, w2, 40);
    pT(T.name, VW - w2 + 3, 3, P.bone, 13);
    pT(`${r.purse} gr`, VW - w2 + 3, 16, P.tallow, 13); pT(`DAY ${r.day}`, VW - w2 + 3, 28, P.bone, 12);
  };

  // the camera sits higher on a town street, so the roofline and smoke show under the HUD
  const origCam = window.cam; window.cam = function () { const c = origCam(); try { if (G.M && G.M.town) c[1] -= 34; } catch (e) {} return c; };

  // only the lead walks
  setInterval(() => { try { G.trail = []; } catch (e) {} }, 16);
  // dialog text in Bone
  const st = document.createElement('style'); st.textContent = '#gdlg *{color:#e6dcc4!important}'; document.head.appendChild(st);
})();
