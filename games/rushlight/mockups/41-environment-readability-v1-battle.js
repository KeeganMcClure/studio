// Rushlight battle screen, rough mockup v1 (Nov 23, 2026), for spec 008 (8A sprites in battle, 8D check).
// v5 backdrop readability pass (Keegan, Nov 23): far things paler and lower in contrast (haze), so the foes' dark
// silhouettes stand against light; the hedge drops to a mid value; grass specks halved and kept off the strip behind
// the party; nothing behind a fighter is as dark or as bright as the fighter's own edge.
// Injected into the real build after sprite-upgrade v3 + folk-front v1 (folk-front-rough-v1.js carries both).
// It changes only how the fight looks:
//   - a lit, dressed backdrop per kind of place (here the road at dusk): low sun from the left, far hills, a hedge line
//     with pollard willows, the road with ruts and puddles that catch the sky, grass tufts, a milestone
//   - soft shadows under every fighter, so they stand on the ground
//   - folk enemies drawn front-on (folk-front v1), mercs from behind (sprite v3)
//   - nameplates that never overlap: with three or more foes they stagger in two rows
//   - the party strip in Bone with the merc's face on its backing, nothing cut off
(function () {
  const VWp = () => VW, P = PAL;
  const lerp = (a, b, k) => { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16), c = s => [s >> 16, (s >> 8) & 255, s & 255], x = c(A), y = c(B); return 'rgb(' + x.map((v, i) => Math.round(v + (y[i] - v) * k)).join(',') + ')'; };
  const front = {}, back = {};
  // the folk enemy's front view at 1x (the battle draws it as is; the folk sprite is about 30 × 46)
  const oldSprite = window.spriteOf;
  window.spriteOf = function (e) {
    if (e.sp && !e.sprite && !e.group) { const k = e.sp + JSON.stringify(e.look || {}); return front[k] || (front[k] = big(SPRITE_V3.front(e.sp, e.folk && e.armor ? 'arms' : 'bandit', e.look || {}))); }
    return oldSprite(e);
  };
  // v2 (Keegan, Nov 23: "they feel small"): every fighter at twice the size. In the build they'd be drawn natively at the
  // bigger size so their pixels match the backdrop; for the mockup they're doubled.
  // v3 (Keegan: "consider perspective"): one scale for everyone, 1.5x. The party is nearer, so it reads bigger by perspective alone:
  // a merc's waist-up back view is already taller than a whole foe at the same scale, about 1.3 to 1.4 times.
  // v4 (Keegan): the party at 2x, the foes at 1.5x.
  const big = (c, S = 1.5) => { const d = document.createElement('canvas'); d.width = Math.round(c.width * S); d.height = Math.round(c.height * S); const x = d.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(c, 0, 0, d.width, d.height); return d; };
  RLSP.back = (sp) => back[sp] || (back[sp] = Object.assign(big(SPRITE_V3.back(sp), 2), { __dx: -15 }));
  const di = CanvasRenderingContext2D.prototype.drawImage; // the battle places a back view by its old 30 px width: re-center the doubled one
  CanvasRenderingContext2D.prototype.drawImage = function (img, ...a) { if (img && img.__dx && a.length === 2) a[0] += img.__dx; return di.call(this, img, ...a); };

  // the road at dusk
  window.drawScene = function (L) {
    const W = VW, h = L.scene.h, hz = Math.round(h * .42), x = cx;
    const sky = x.createLinearGradient(0, 0, 0, hz); sky.addColorStop(0, '#3a4256'); sky.addColorStop(.55, '#8a7a76'); sky.addColorStop(1, '#e0a868'); x.fillStyle = sky; x.fillRect(0, 0, W, hz);
    // the low sun on the left, and its glow
    const sg = x.createRadialGradient(38, hz - 6, 2, 38, hz - 6, 90); sg.addColorStop(0, 'rgba(255,230,170,.9)'); sg.addColorStop(.15, 'rgba(255,200,120,.45)'); sg.addColorStop(1, 'rgba(255,180,100,0)'); x.fillStyle = sg; x.fillRect(0, 0, W, hz + 10);
    bR(33, hz - 10, 10, 6, '#fff0c8'); bR(35, hz - 12, 6, 2, '#fff0c8');
    // two bands of far hills, cool and hazy
    for (const [y0, col, amp, f] of [[hz - 16, '#a8969a', 6, .045], [hz - 9, '#928488', 5, .07]]) { x.fillStyle = col; x.beginPath(); x.moveTo(0, hz);
      for (let i = 0; i <= W; i += 2) x.lineTo(i, Math.round(y0 + Math.sin(i * f + y0) * amp + Math.sin(i * f * 2.7) * 2)); x.lineTo(W, hz); x.fill(); }
    // the ground: warm on the sun side, cooler away from it
    const gr = x.createLinearGradient(0, hz, 0, h); gr.addColorStop(0, '#8a8258'); gr.addColorStop(.35, '#66623e'); gr.addColorStop(1, '#46422c'); x.fillStyle = gr; x.fillRect(0, hz, W, h - hz);
    // the hedge line along the horizon, with pollard willows (a fat trunk and a crown of rods), lit on the left
    for (let i = -4; i < W; i += 3) { const hh = 5 + ((i * 7) % 5); bR(i, hz - hh + 2, 4, hh, (i * 13) % 3 ? '#6e7050' : '#767a54'); bR(i, hz - hh + 2, 1, 2, '#8e9068'); }
    for (const tx of [70, 150, 212]) { bR(tx, hz - 16, 4, 16, '#6a5c48'); bR(tx, hz - 16, 1, 16, '#8a7658');
      for (let r = 0; r < 13; r++) { const a = -Math.PI * (.3 + r * .031), len = 6 + (r % 3) * 2; for (let s = 0; s < len; s++) { const px = tx + 2 + Math.cos(a) * s * 1.1, py = hz - 16 + Math.sin(a) * s; bR(Math.round(px), Math.round(py), 1, 1, s > len - 3 ? '#a0a070' : '#727856'); } }
      bR(tx - 1, hz - 17, 6, 2, '#5a4e3e'); } // the cut knuckle at the top of the trunk
    // the road: a paler band coming toward us, ruts, and puddles that catch the sky
    x.fillStyle = '#7a6a4e'; x.beginPath(); x.moveTo(W * .45, hz); x.lineTo(W * .58, hz); x.lineTo(W * 1.05, h); x.lineTo(W * .05, h); x.fill();
    x.fillStyle = 'rgba(255,220,160,.12)'; x.beginPath(); x.moveTo(W * .45, hz); x.lineTo(W * .5, hz); x.lineTo(W * .3, h); x.lineTo(W * .05, h); x.fill();
    for (const [ax, bx] of [[.49, .32], [.54, .74]]) { x.strokeStyle = '#5a4a34'; x.lineWidth = 2; x.beginPath(); x.moveTo(W * ax, hz + 2); x.lineTo(W * bx, h); x.stroke(); }
    for (const [px, py, pw] of [[96, .7, 18], [150, .82, 24], [118, .58, 10]]) { const y = Math.round(hz + (h - hz) * py); bR(px, y, pw, 3, '#c89a6a'); bR(px + 2, y + 1, pw - 4, 1, '#8a7a76'); bR(px, y + 3, pw, 1, '#4a3a28'); }
    // grass tufts and stones, thicker toward the front
    for (let i = 0; i < 45; i++) { const gx = (i * 53) % W, gy = hz + 3 + ((i * 37) % (h - hz - 4)), onRoad = gx > W * .2 + (gy - hz) * .1 && gx < W * .9; if (onRoad || gy > hz + (h - hz) * .62) continue;
      bR(gx, gy, 1, 2, '#5e623c'); bR(gx + 1, gy - 1, 1, 3, '#767a48'); }
    for (const [sx, sy] of [[24, .5], [210, .66], [60, .88]]) { const y = Math.round(hz + (h - hz) * sy); bR(sx, y, 5, 3, '#8a8478'); bR(sx, y, 3, 1, '#b4ae9e'); bR(sx, y + 3, 5, 1, '#3a3630'); }
    // a milestone at the road's edge
    bR(198, hz + 8, 6, 9, '#9a9488'); bR(198, hz + 8, 2, 9, '#c4bead'); bR(199, hz + 7, 4, 1, '#9a9488'); bR(198, hz + 17, 7, 1, '#2a2620'); bR(200, hz + 11, 2, 1, '#5a564e');
    // a warm grade over the scene, and shadows under the fighters (long, cast right, away from the sun)
    x.fillStyle = 'rgba(255,170,90,.08)'; x.fillRect(0, 0, W, h);
    Bt.en.forEach((e, i) => { if (e.dead && e.alpha <= 0) return; const s = spriteOf(e), w = s ? s.width : 20; x.globalAlpha = (e.alpha ?? 1) * .45; x.fillStyle = '#1c1814';
      x.beginPath(); x.ellipse(foeX(i) + 6, L.enemyY - 1, w * .45, 3, 0, 0, 7); x.fill(); x.globalAlpha = 1; });
  };

  // nameplates: with three or more foes, every other plate drops a row so none overlap
  const oldPlate = window.plate;
  window.plate = function (e, x, y, i) {
    const n = Bt.en.length; if (n < 3) return oldPlate(e, x, y, i);
    const nm = `${e.name} L${e.lvl || 1}`, sk = e.skulls || 1, w = Math.min(VW - 28, bW(nm, 13) + sk * 7 + 10), x0 = Math.round(Math.max(26, Math.min(VW - 2 - w, x - w / 2))), yy = y + (i % 2) * 25;
    if (i % 2) bR(Math.round(x), y, 1, yy - y, 'rgba(236,227,203,.5)'); // a thin tie from the dropped plate up to its fighter
    SB.box(cx, x0, yy, w, 22, 'rgba(28,24,20,.92)', P.line, 1); bT(nm, x0 + 3, yy - 1, P.bone, 13);
    for (let k = 0; k < sk; k++) skull(x0 + w - 4 - (k + 1) * 7, yy + 2);
    const bx = x0 + 3, bw = w - 6, by = yy + 13;
    if (e.known) SB.hpBar(cx, BT_THEME, bx, by, bw, e.hp / e.mhp, 4);
    else { bR(bx, by, bw, 6, P.peat); for (let k = 0; k < bw - 2; k += 3) bR(bx + 1 + k, by + 1, 1, 4, P.rust); const q = '???'; bT(q, bx + bw / 2 - bW(q, 11) / 2, by - 3, P.bone, 11); }
  };

  // the party strip: the face on its lit backing, name and HP, the bar, WP and SAN in Bone; nothing cut off
  window.strip = function (r) {
    bR(r.x, r.y, r.w, r.h, P.peat); const cw = Math.floor((r.w - 4) / 3);
    party.forEach((m, i) => { const x = r.x + 2 + i * cw, on = Bt.active === m, cardH = r.h - 2;
      SB.box(cx, x, r.y + 1, cw - 2, cardH, on ? P.cardOn : P.card, on ? P.tallow : m.ko ? P.rust : P.line, 1);
      const f = 18, fy = r.y + 3; const bg = cx.createLinearGradient(0, fy, 0, fy + f); bg.addColorStop(0, '#8a7458'); bg.addColorStop(1, '#5a4a38'); cx.fillStyle = bg; cx.fillRect(x + 3, fy, f, f);
      const pc = front['p' + m.sp] || (front['p' + m.sp] = SPRITE_V3.portrait(m.sp)); cx.drawImage(pc, 10, 8, 44, 44, x + 3, fy, f, f); bR(x + 3, fy + f, f, 1, P.peat);
      const tx = x + f + 6, tw = cw - f - 11;
      bT(m.name.toUpperCase(), tx, r.y - 1, on ? P.tallow : P.bone, 13); // the whole name: the HP number moved beside the bar
      const hs = m.ko ? 'DOWN' : String(m.hp), hw = bW(hs, 11); bT(hs, x + cw - 5 - hw, r.y + 7, m.ko ? P.rust : P.bone, 11);
      SB.hpBar(cx, BT_THEME, tx, r.y + 11, tw - hw - 3, m.hp / m.mhp, 3);
      const s = `WP ${m.wp}  SAN `; bT(s, tx, r.y + 14, P.bone, 11); bT(String(m.san), tx + bW(s, 11), r.y + 14, m.san < 40 ? P.pink : P.bone, 11); });
  };
})();
// v4b (Keegan): no turn arrow over the active merc; the Tallow card border in the strip already says whose turn it is
(function () { const src = drawBattle.toString(), cut = src.replace(/if\(Bt\.active===m\)\{bR\(x\+12[^}]*\}/, '');
  if (cut !== src) window.drawBattle = (0, eval)('(' + cut + ')'); })();
