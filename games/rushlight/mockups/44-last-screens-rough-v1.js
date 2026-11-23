// Rushlight look pass, rough mockup v1 for the last screens (Nov 23, 2026; spec 008, Keegan: "nothing else to look at?").
// Load after look-pass-menus-rough-v1.js (it brings the parchment CSS). Same rules as the menus (42) and the map (43):
// parchment cards in a dark Soot frame, labels in full, values wrap, numbers right-aligned, faces at 2x, wax-seal cursor.
// window.LAST(name): 'title', 'key', 'contracts', 'hire' (any in-town pick list), 'hotspot', 'pay', 'death'.
// The dialog box itself is the shared hand copy (dialog.js): it stays as it is, with Bone text from the bug batch; the pick
// lists that open over a street or a site become a parchment card that sits just above it.
(function () {
  const css = `
  .mz .ttl{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;background:radial-gradient(ellipse at 50% 30%,rgba(217,180,90,.28),rgba(217,180,90,0) 55%),#14110e}
  .mz .ttl h1{margin:0;font:18px/1.4 var(--px);color:#d9b45a;letter-spacing:.06em;text-shadow:0 2px 0 #1c1814}
  .mz .ttl h2{margin:0;font:8px/1.4 var(--px);color:#e6dcc4;letter-spacing:.2em}
  .mz .kg{display:grid;grid-template-columns:34px 1fr;gap:3px 6px;align-items:center}
  .mz .kg canvas{image-rendering:pixelated;width:32px;height:20px}
  .mz .dlg{border:2px solid #e6dcc4;background:#2c2621;color:#e6dcc4;padding:5px 8px;font:17px/1.05 var(--vt);box-shadow:0 0 0 1px #1c1814}
  .mz .stack{position:absolute;left:6px;right:6px;bottom:6px;display:flex;flex-direction:column;gap:4px}
  .mz .odds{font:9px/1.5 var(--px);color:#1c1814}
  .mz .dis{opacity:.55}
  .mz .stamp{display:inline-block;transform:rotate(-6deg);border:2px solid #5e1a18;color:#5e1a18;font:9px/1.6 var(--px);padding:1px 6px;letter-spacing:.08em}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  const face = (sp, look, px) => { const c = document.createElement('canvas'); c.width = 64; c.height = 64; c.className = 'mfc'; c.style.width = c.style.height = px + 'px'; c.getContext('2d').drawImage((window.SPRITE_V3 || RLSP).portrait(sp, look || {}), 0, 0); return c; };
  const gray = c => { c.style.filter = 'grayscale(1) brightness(.75) sepia(.35)'; return c; };
  function frame(title, right, foot, html, over) {
    document.querySelectorAll('.mz').forEach(e => e.remove());
    const gc = document.getElementById('gcv'), r = (gc.getBoundingClientRect().width > 0 ? gc : document.getElementById('body').parentElement).getBoundingClientRect();
    const z = document.createElement('div'); z.className = 'mz'; Object.assign(z.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
    if (over) { z.style.background = 'transparent'; z.innerHTML = html; }
    else z.innerHTML = (title ? `<div class="hd"><span>${title}</span><small>${right || ''}</small></div>` : '') + `<div class="bd">${html}</div>` + (foot ? `<div class="ft">${foot}</div>` : '');
    document.body.appendChild(z); return z;
  }
  const fill = (z, sel, nodes) => z.querySelectorAll(sel).forEach((el, i) => nodes[i] && el.replaceWith(nodes[i]));
  // the map key: the same little pictures the chart draws (43), small
  function icon(kind) { const c = document.createElement('canvas'); c.width = 32; c.height = 20; const x = c.getContext('2d'), r = (a, b, w, h, col) => { x.fillStyle = col; x.fillRect(a, b, w, h); };
    const I = '#3a2c20'; x.translate(16, 12);
    if (kind === 'town') { r(-10, -6, 20, 10, I); r(-9, -5, 18, 8, '#efe4c8'); r(-11, -10, 5, 14, I); r(-10, -9, 3, 12, '#efe4c8'); r(6, -10, 5, 14, I); r(7, -9, 3, 12, '#cdbf9c'); r(-2, -1, 4, 5, I); r(-6, -9, 3, 3, '#9a4528'); }
    if (kind === 'hamlet') [[-9, 0], [-1, -3], [5, 1]].forEach(([a, b]) => { r(a, b - 2, 7, 6, I); r(a + 1, b - 1, 5, 4, '#efe4c8'); r(a - 1, b - 5, 9, 3, I); r(a, b - 4, 7, 2, '#c8a552'); });
    if (kind === 'site') { r(-6, -2, 12, 6, I); r(-5, -1, 10, 4, '#6a5a4a'); r(-3, -6, 6, 4, I); r(-2, -5, 4, 3, '#4a3e34'); }
    if (kind === 'den') { r(-9, -3, 18, 9, '#5e1a18'); r(-6, -1, 12, 5, '#1c1814'); r(-5, -11, 2, 10, I); r(3, -11, 2, 10, I); r(-6, -12, 12, 2, I); }
    if (kind === 'main') { r(-14, -2, 28, 4, I); r(-14, -1, 28, 2, '#e8dcc0'); r(-2, -5, 2, 10, I); }
    if (kind === 'side') { for (let i = -14; i < 14; i += 7) r(i, -1, 4, 2, I); }
    if (kind === 'den road') { for (let i = -14; i < 14; i += 7) r(i, -1, 4, 2, '#5e1a18'); }
    if (kind === 'route') for (let i = -12; i < 14; i += 6) { r(i - 1, -2, 4, 4, I); r(i, -1, 2, 2, '#d9b45a'); }
    if (kind === '?') { x.font = '16px VT323'; x.fillStyle = I; x.fillText('?', -3, 5); }
    if (kind === 'claws') for (let k = 0; k < 3; k++) { r(-4 + k * 3, -5, 1, 7, '#9a4528'); r(-3 + k * 3, 1, 1, 2, '#9a4528'); }
    if (kind === 'seal') { x.fillStyle = '#5e1a18'; x.beginPath(); x.arc(0, 0, 6, 0, 7); x.fill(); x.fillStyle = '#9a4528'; x.beginPath(); x.arc(-1, -1, 4, 0, 7); x.fill(); }
    if (kind === 'coin') { const s = RLSP.coin(lead().sp); x.drawImage(s, -s.width / 2, -s.height / 2 - 2); }
    return c; }

  window.LAST = function (name) {
    const ms = typeof party !== 'undefined' ? party : [], r = (window.RLG && RLG._t && RLG._t.G().run) || {};
    if (name === 'title') { // the lantern lit large, the name in Tallow, the menu as a parchment card
      const z = frame('', '', '', `<div class="ttl"><canvas id="lnt" width="96" height="96" style="width:120px;height:120px;image-rendering:pixelated"></canvas><h1>RUSHLIGHT</h1><h2>THE WITHY MARCH</h2></div>
        <div class="pa" style="padding:2px 0"><div class="mrs">${['Continue · Free Company, day 14', 'New run', 'Ledger', 'Import a save'].map((t, i) => `<div class="mr${i === 0 ? ' on' : ''}"><span>${t}</span></div>`).join('')}</div></div>
        <div style="text-align:center;font:15px/1.2 var(--vt);color:#c8bea8">Arrows · Z = A · X = B · Q/W = L/R · Enter = Start</div>`);
      const lt = document.getElementById('lantern'), c = z.querySelector('#lnt'); if (lt) { const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(lt, 0, 0); } return; }
    if (name === 'key') { // the key as a parchment card with the chart's own pictures; nothing spills
      const rows = [['town', 'Town'], ['hamlet', 'Hamlet'], ['site', 'Wild site'], ['den', 'Den'], ['main', 'Main road, a stroke per day'], ['side', 'Side road'], ['den road', 'Road to a den'], ['route', 'The way you\'ve picked'], ['?', 'Not yet known'], ['claws', 'Roamer met here'], ['seal', 'A contract here'], ['coin', 'The company (the lead)']];
      const z = frame('THE KEY', 'The Withy March', 'L OR B: CLOSE', `<div class="pa"><div class="kg">${rows.map(([k, t]) => `<i data-k="${k}"></i><span>${t}</span>`).join('')}</div></div>`);
      z.querySelectorAll('i[data-k]').forEach(i => i.replaceWith(icon(i.dataset.k))); return; }
    if (name === 'contracts') { // one card per contract, signs and the dead as their own cards
      frame('CONTRACTS', `DAY ${r.day || 1}`, 'R OR B: BACK', `
        <div class="pa msl on"><div class="mfx sp"><span class="t">THE NOONWIFE</span><span class="k">75 gr</span></div>
          <div><span class="d">Where</span> Hollin · 1 day · food 3 of 9</div><div><span class="d">For</span> the Prior of Saint Ebbe's · a hunt</div>
          <div><span class="d">Known</span> <span class="g">sighted</span> · 2 of 3 tales</div><div><span class="d">Moment</span> Ernald, Alard (Protect the innocent) · Cassian (Faith)</div></div>
        <div class="pa"><div class="t">SIGNS</div><div class="ital">Crows that won't land in one field at Hollin.</div><div class="ital">A heat shimmer that holds still when the wind moves.</div></div>
        <div class="pa"><div class="t">THE DEAD</div><div>Alard · bury by the end of the next job · at the church</div></div>`); return; }
    if (name === 'hire') { // any in-town pick list: a parchment card over the street, above the dialog box, faces in the rows
      const H = ((r.hires || {}).harrow || []).slice(0, 3).map(m => ({ name: m.name, sp: m.sp, look: m.look, trade: m.trade }));
      const z = frame('', '', '', `<div class="stack"><div class="pa" style="padding:3px 0 2px"><div class="mfx sp" style="padding:0 8px"><span class="t" style="color:#76331d">MERCS FOR HIRE</span><span class="d">no seat open</span></div><div class="mrs">
        ${H.map((m, i) => `<div class="mr${i === 0 ? ' on' : ''}" style="align-items:center"><span class="mfx" style="gap:6px"><i></i><span>${m.name}<br><span class="k">${m.trade} · ${m.sp}</span></span></span><span class="r">L1<br>25 gr</span></div>`).join('')}
        <div class="mr"><span>Leave</span></div></div></div>
        <div class="dlg">Three hands drink by the door. Each would sign for twenty-five, and a seat at your fire.</div></div>`, true);
      fill(z, '.mr i', H.map(m => face(m.sp, m.look, 30))); return; }
    if (name === 'hotspot') { // the A prompt: the thing, who rolls and their odds, the better merc one press away
      const L = ms[0] || { name: 'Ernald' }, o = ms[2] || { name: 'Cassian' };
      const z = frame('', '', '', `<div class="stack"><div class="pa" style="padding:3px 0 2px"><div class="t" style="padding:0 8px;color:#76331d">THE SEXTON</div><div class="mrs">
        <div class="mr on"><span>Persuade</span><span class="mfx" style="gap:4px"><i></i><span class="odds">${L.name.toUpperCase()} 40%</span></span></div>
        <div class="mr"><span style="padding-left:10px" class="d">SELECT: ${o.name} talks</span><span class="mfx" style="gap:4px"><i></i><span class="odds">${o.name.toUpperCase()} 60%</span></span></div>
        <div class="mr"><span>Pay him 5 gr</span><span class="g">no roll</span></div>
        <div class="mr dis"><span>Read the burial roll</span><span class="d">needs History 30%</span></div>
        <div class="mr"><span>Leave it</span></div></div></div>
        <div class="dlg">The sexton leans on his spade. He buried three reapers this week, and he doesn't want to dig a fourth.</div></div>`, true);
      fill(z, '.mr i', [face(L.sp || 'fox', L.look, 20), face(o.sp || 'hedgehog', o.look, 20)]); return; }
    if (name === 'pay') { // the pay as one card, then level-up picks as a parchment list with the merc's face
      const m = ms[0] || {}, sk = Object.entries(m.sk || {}).sort((a, b) => b[1] - a[1]).slice(0, 6);
      const z = frame('THE FEE', 'THE NOONWIFE', 'A: PICK · B: LATER (PARTY MENU)', `
        <div class="pa"><div class="mfx sp"><span class="t">PAID</span><span class="t" style="color:#76331d">75 gr</span></div>
          <div class="mrs"><div class="mr" style="padding-left:6px"><span>XP</span><span>200 each</span></div><div class="mr" style="padding-left:6px"><span>Favor</span><span class="g">+1 the Church</span></div>
          <div class="mr" style="padding-left:6px"><span>SAN lost</span><span>Ernald −4 · Cassian −6</span></div><div class="mr" style="padding-left:6px"><span>Gained</span><span>Her headcloth (trophy)</span></div></div></div>
        <div class="pa"><div class="mfx"><i></i><div><div class="t">${(m.name || '').toUpperCase()} · LEVEL 2</div><div class="k">2 picks · +5% each · max HP +1</div></div></div><div class="mrs">
          ${sk.map(([k, v], i) => `<div class="mr${i === 0 ? ' on' : ''}"><span>${k}</span><span>${v}% <span class="g">→ ${Math.min(95, v + 5)}%</span></span></div>`).join('')}</div></div>`);
      fill(z, '.pa .mfx i', [face(m.sp, m.look, 44)]); return; }
    if (name === 'death') { // a wipe: the company struck from the roll, every merc greyed, how far they got, then the ledger
      const z = frame('NOBODY GETS UP', `seed ${r.seed || ''}`, 'A: TO THE LEDGER', `
        <div class="pa" style="text-align:center"><div class="t">FREE COMPANY</div><div class="stamp">STRUCK FROM THE ROLL</div><div class="d" style="margin-top:3px">Lowmoor Pit · day 14</div></div>
        <div class="pa"><div class="mrs">${ms.map((m, i) => `<div class="mr" style="padding-left:6px;align-items:center"><span class="mfx" style="gap:6px"><i></i><span>${m.name}<br><span class="k">${m.trade}</span></span></span><span class="r k" style="max-width:120px">${['Taken by the Hollow Monk', 'Fell at Lowmoor, day 14', 'Drowned in the gallery'][i] || ''}</span></div>`).join('')}</div></div>
        <div class="pa"><div class="mrs"><div class="mr" style="padding-left:6px"><span>Contracts done</span><span>3</span></div><div class="mr" style="padding-left:6px"><span>Great creatures killed</span><span>1</span></div><div class="mr" style="padding-left:6px"><span>Regions crossed</span><span>0</span></div></div>
          <div class="ital" style="margin-top:2px">What they learned stays in the bestiary.</div></div>`);
      fill(z, '.mr i', ms.map(m => gray(face(m.sp, m.look, 30)))); return; }
  };
})();
