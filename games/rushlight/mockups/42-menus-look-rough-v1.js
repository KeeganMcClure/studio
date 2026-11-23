// Rushlight look pass, rough mockup v1 for the creator and the other parchment menus (Nov 23, 2026; spec 008 part 8C).
// Same parchment as the approved Pick a company v3 (35): aged parchment mrs with a lit spot and stained edges, an ink
// border, ink text (Peat and Soot), trade names in dark Rust, tags in dark Moss, the picked mr with a Tallow edge and a
// wax-seal cursor, dark leather buttons. Rules it adds for the rest of the menus:
//   - labels are written out in full (no "S…", "M…", "Neckw…"); a value that is too long wraps, it is never cut
//   - one idea per row; numbers sit right-aligned in their own column so they line up
//   - the portrait is big (2x) on its lit backing on every merc screen
//   - the dark frame (header and footer) stays dark Soot so parchment always sits on a frame, as in battle
// Injected into the real build. window.MENUS(name) draws one screen over the game:
//   'tweak' (the creator), 'pause', 'party', 'card', 'items', 'bestiary', 'ledger'.
(function () {
  const css = `
  .mz{position:fixed;z-index:50;display:flex;flex-direction:column;background:#1c1814;overflow:hidden;font:16px/1 var(--vt);color:#2c2621}
  .mz .hd,.mz .ft{flex:none;display:flex;justify-content:space-between;align-items:center;background:#2c2621;border-bottom:1px solid #e6dcc4;padding:5px 7px;font:8px/1.4 var(--px);color:#d9b45a;letter-spacing:.04em}
  .mz .hd small{font:15px/1 var(--vt);color:#e6dcc4;letter-spacing:0}
  .mz .ft{border-bottom:0;border-top:1px solid #e6dcc4;font:15px/1 var(--vt);color:#e6dcc4;justify-content:center;gap:10px}
  .mz .bd{flex:1;min-height:0;display:flex;flex-direction:column;gap:5px;padding:6px 7px;overflow:hidden}
  .mz .pa{position:relative;color:#2c2621;border:1px solid #1c1814;padding:5px 8px;
    background:radial-gradient(ellipse at 30% 40%,rgba(255,248,225,.55),rgba(255,248,225,0) 60%),
      radial-gradient(ellipse at 85% 80%,rgba(140,104,50,.22),rgba(140,104,50,0) 45%),
      radial-gradient(ellipse at 10% 95%,rgba(140,104,50,.18),rgba(140,104,50,0) 35%),#dccca4;
    box-shadow:inset 0 0 0 2px #dccca4,inset 0 0 0 3px #5a3e2b,inset 0 0 12px rgba(90,62,43,.55),0 2px 0 #0e0c0a}
  .mz .pa.on{background:radial-gradient(ellipse at 30% 40%,rgba(255,244,205,.8),rgba(255,244,205,0) 65%),#ead9a8;box-shadow:inset 0 0 0 2px #ead9a8,inset 0 0 0 3px #5a3e2b,inset 0 0 10px rgba(90,62,43,.4),0 0 0 2px #d9b45a,0 2px 0 #0e0c0a}
  .mz .msl{position:relative;padding-left:22px}
  .mz .msl.on::after,.mz .mr.on::after{content:'';position:absolute;left:3px;top:50%;margin-top:-8px;width:16px;height:16px;border-radius:50%;
    background:radial-gradient(circle at 40% 35%,#c8603a 0 3px,#9a4528 4px 6px,#5e1a18 7px 8px);box-shadow:0 1px 0 #1c1814}
  .mz .t{font:9px/1.6 var(--px);color:#1c1814;letter-spacing:.03em}
  .mz .k{color:#76331d} .mz .g{color:#4e5a24} .mz .d{color:#5a4a3a} .mz .r{text-align:right}
  .mz .mfc{flex:none;image-rendering:pixelated;background:linear-gradient(#a8906c,#6a5a44);border:2px solid #1c1814}
  .mz .mfx{display:flex;gap:8px;align-items:center} .mz .sp{justify-content:space-between}
  .mz .mbar{height:5px;background:#1c1814;padding:1px;flex:1} .mz .mbar i{display:block;height:3px}
  .mz .mrs{display:flex;flex-direction:column}
  .mz .mr{position:relative;display:flex;justify-content:space-between;align-items:baseline;padding:2px 6px 2px 22px;color:#1c1814;border-bottom:1px dotted rgba(90,62,43,.35)}
  .mz .mr:last-child{border-bottom:0} .mz .mr.on{background:rgba(217,180,90,.35);box-shadow:inset 0 0 0 1px #d9b45a}
  .mz .mr .ml{color:#5a4a3a;width:92px;flex:none} .mz .mr .mv{flex:1;text-align:right;color:#1c1814}
  .mz .arw{color:#9a4528}
  .mz .mbt{display:flex;gap:4px} .mz .mbt b{flex:1;text-align:center;font:7px/1 var(--px);padding:5px 0;border:1px solid #1c1814;color:#e6dcc4;background:#3b3229} .mz .mbt b.on{background:#9a4528;color:#f2ead6}
  .mz .mst{flex:1;text-align:center;padding:1px 0}
  .mz .mst em{display:block;font:14px/1 var(--vt);font-style:normal;color:#5a4a3a} .mz .mst b{font:9px/1.5 var(--px);color:#1c1814}
  .mz .it{display:grid;grid-template-columns:62px 1fr auto;gap:0 6px;align-items:baseline}
  .mz .wear{letter-spacing:1px;color:#4e5a24}
  .mz .mtag{font:14px/1 var(--vt);padding:1px 4px;background:#d9b45a;color:#1c1814;border:1px solid #1c1814}
  .mz .mtb{display:flex;gap:3px} .mz .mtb span{flex:1;display:flex;align-items:center;gap:3px;justify-content:center;padding:2px 0;border:1px solid #1c1814;background:#3b3229;color:#e6dcc4;font:15px/1 var(--vt)} .mz .mtb span.on{background:#d9b45a;color:#1c1814}
  .mz .ital{font-style:italic;color:#3b3229}
  .mz .pz{position:absolute;right:6px;bottom:6px;width:150px}
  .mz .ink{border-top:1px solid rgba(90,62,43,.5);margin:3px 0}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  const P = (sp, look, px) => { const c = document.createElement('canvas'); c.width = 64; c.height = 64; c.className = 'mfc'; c.style.width = c.style.height = px + 'px';
    const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage((window.SPRITE_V3 || RLSP).portrait(sp, look), 0, 0); return c.outerHTML.replace('<canvas', `<canvas data-sp="${sp}" data-look='${JSON.stringify(look || {})}'`); };
  const paint = root => root.querySelectorAll('canvas[data-sp]').forEach(c => { const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage((window.SPRITE_V3 || RLSP).portrait(c.dataset.sp, JSON.parse(c.dataset.look)), 0, 0); });
  const bar = (v, m, col) => `<div class="mbar"><i style="width:${Math.round(100 * v / m)}%;background:${col}"></i></div>`;
  const SPN = { fox: 'fox', hare: 'hare', badger: 'badger', hedgehog: 'hedgehog', mouse: 'mouse', rat: 'rat' };
  function frame(title, right, foot, html, over) {
    document.querySelectorAll('.mz').forEach(e => e.remove());
    const gc = document.getElementById('gcv'), r = (gc.getBoundingClientRect().width > 0 ? gc : document.getElementById('body').parentElement).getBoundingClientRect();
    const z = document.createElement('div'); z.className = 'mz'; Object.assign(z.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
    if (over) { z.style.background = 'transparent'; z.innerHTML = html; }
    else z.innerHTML = `<div class="hd"><span>${title}</span><small>${right || ''}</small></div><div class="bd">${html}</div><div class="ft">${foot}</div>`;
    document.body.appendChild(z); paint(z); return z;
  }
  const team = () => (typeof party !== 'undefined' && party.length ? party : []);
  const tr = m => (m.trade || '').replace(/^./, c => c.toUpperCase());

  window.MENUS = function (name) {
    const ms = team(), m = ms[0] || {}, r = (window.G && G.run) || {};
    if (name === 'tweak') { // the creator: one merc, every choice on its own mr, labels in full, values wrap
      const c = { name: 'HELEWISE', sp: 'hedgehog', look: { shade: 1, mark: 2, neck: 0 } };
      return frame('TWEAK · SEAT 3', 'Barber-surgeon', 'L/R: STEP &nbsp; ◀▶: CHANGE &nbsp; B: CANCEL', `
        <div class="pa mfx">${P(c.sp, c.look, 64)}<div><div class="t">${c.name}</div><div class="k">Barber-surgeon · hedgehog</div><div class="d">Middle size · Spines: a melee attacker takes 1 damage. CON +2, DEX −2.</div></div></div>
        <div class="pa" style="padding:2px 0"><div class="mrs">
          <div class="mr on"><span class="ml">Name</span><span class="mv">Helewise</span></div>
          <div class="mr"><span class="ml">Species</span><span class="mv"><span class="arw">◀</span> Hedgehog <span class="arw">▶</span></span></div>
          <div class="mr"><span class="ml">Coat</span><span class="mv"><span class="arw">◀</span> Middle <span class="arw">▶</span></span></div>
          <div class="mr"><span class="ml">Mark</span><span class="mv"><span class="arw">◀</span> Torn ear <span class="arw">▶</span></span></div>
          <div class="mr"><span class="ml">Neckwear</span><span class="mv"><span class="arw">◀</span> None <span class="arw">▶</span></span></div>
          <div class="mr"><span class="ml">Kin</span><span class="mv">Joan, parent</span></div>
          <div class="mr"><span class="ml">Motivations</span><span class="mv">Find the truth (Main), Pride</span></div>
        </div></div>
        <div class="pa"><div class="mfx sp"><span class="t">BACKSTORY</span><span class="mbt" style="width:80px"><b>ROLL</b></span></div><div class="ital">Stood in the front rank three summers running. Stopped counting the faces gone.</div></div>
        <div class="mbt" style="margin-top:auto"><b class="on" style="padding:8px 0">DONE ▸</b></div>`);
    }
    if (name === 'pause') { // a small parchment menu over the map, the map left showing
      return frame('', '', '', `<div class="pa pz" style="padding:4px 0 4px"><div class="t" style="padding:0 8px 2px;color:#76331d">MENU</div><div class="mrs">
        ${['Party', 'Items', 'Bestiary', 'Export', 'Title', 'Close'].map((x, i) => `<div class="mr${i === 0 ? ' on' : ''}"><span style="color:#1c1814">${x}</span></div>`).join('')}</div></div>`, true);
    }
    if (name === 'party') {
      return frame('PARTY', 'SELECT: lead', 'A: OPEN &nbsp; B: BACK', ms.map((x, i) => `
        <div class="pa msl${i === 0 ? ' on' : ''}"><div class="mfx">${P(x.sp, x.look, 48)}<div style="mfx:1">
          <div class="mfx sp"><span class="t">${x.name.toUpperCase()}</span>${i === (G.lead | 0) ? '<span class="mtag">LEAD</span>' : ''}</div>
          <div class="k">${tr(x)} · ${SPN[x.sp]}</div>
          <div class="mfx"><span style="width:22px">HP</span>${bar(x.hp, x.mhp, '#9a4528')}<span class="r" style="width:38px">${x.hp}/${x.mhp}</span></div>
          <div>WP ${x.wp} · SAN <span style="color:${x.san < 40 ? '#a0306a' : '#1c1814'}">${x.san}</span> · <span class="g">No statuses</span></div></div></div></div>`).join(''));
    }
    if (name === 'card') {
      const I = RLS.ITEMS || {}, nm = g => g ? I[g.id].name : '—', sk = Object.entries(m.sk).filter(([k, v]) => v >= 40).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`);
      return frame('MERC CARD', r.seed || '', 'B: BACK &nbsp; ▲▼: MERC', `
        <div class="pa mfx">${P(m.sp, m.look, 64)}<div><div class="t">${m.name.toUpperCase()}</div><div class="k">${tr(m)} · ${SPN[m.sp]} · L${m.lvl}</div><div class="d">${m.size} · ${m.trait}</div></div></div>
        <div class="mfx" style="gap:3px">${Object.keys(m.stats).map(k => `<div class="pa mst" style="padding:1px 0"><em>${k}</em><b>${m.stats[k]}</b></div>`).join('')}</div>
        <div class="pa">${[['HP', m.hp, m.mhp, '#9a4528'], ['WP', m.wp, m.mwp, '#4a5a7a'], ['SAN', m.san, m.msan, '#b8902e']].map(([l, v, mx, c]) => `<div class="mfx"><span style="width:30px">${l}</span>${bar(v, mx, c)}<span class="r" style="width:40px">${v}/${mx}</span></div>`).join('')}
          <div class="d">Breaking point ${m.bp} · Luck 50%</div></div>
        <div class="pa"><div class="t">SKILLS</div><div>${sk.join(' · ')}</div><div class="ink"></div>
          <div><span class="d">Kin</span> ${m.kin.name}, ${m.kin.type.toLowerCase()} · Bond ${m.kin.bond}</div>
          <div><span class="d">Motivations</span> ${m.mot.map((x, i) => i === m.main ? x + ' (Main)' : x).join(', ')}</div><div class="ink"></div>
          <div class="ital">${m.back || ''}</div></div>`);
    }
    if (name === 'items') {
      const I = RLS.ITEMS, g = m.gear || {}, row = (s, it) => `<div class="mr it" style="padding-left:6px"><span class="d">${s}</span><span>${it ? I[it.id].name : '—'}</span><span class="wear">${it ? '■■■' : ''}</span></div>`;
      return frame('ITEMS', `PURSE ${r.purse ?? 30} gr`, 'A: USE OR MOVE &nbsp; L/R: MERC &nbsp; B: BACK', `
        <div class="mtb">${ms.map((x, i) => `<span class="${i === 0 ? 'on' : ''}">${x.name}</span>`).join('')}</div>
        <div class="pa"><div class="mfx sp"><span class="t">${m.name.toUpperCase()}</span><span class="k">${tr(m)}</span></div><div class="mrs">
          ${row('Weapon 1', g.w1)}${row('Weapon 2', g.w2)}${row('Body', g.body)}${row('Head', g.head)}</div></div>
        <div class="pa"><div class="mfx sp"><span class="t">CARRIED</span><span class="d">slots 1 of 8</span></div><div class="mrs"><div class="mr on"><span>Caltrops</span><span class="d">×2</span></div></div>
          <div class="d" style="margin-top:2px">2 uses: the next Folk or Beast to attack this merc in melee steps on them.</div></div>
        <div class="pa"><div class="mfx sp"><span class="t">PACK</span><span class="d">rations ${r.rations ?? 9}/15 · 3 days</span></div><div class="ital">Nothing in the pack.</div></div>`);
    }
    if (name === 'bestiary') {
      let img = ''; try { const s = CREATURES_V1.noonwife(); img = `<img src="${s.toDataURL()}" style="image-rendering:pixelated;height:84px;filter:drop-shadow(0 2px 0 rgba(28,24,20,.4))">`; } catch (e) {}
      return frame('BESTIARY', 'The Withy March', 'A: READ &nbsp; B: BACK', `
        <div class="pa" style="padding:2px 0"><div class="mrs">
          <div class="mr on"><span>The Noonwife</span><span class="g">sighted, identified</span></div>
          <div class="mr"><span>The hedge cat</span><span class="g">sighted</span></div>
          <div class="mr"><span class="d">— unknown —</span><span></span></div></div></div>
        <div class="pa"><div class="mfx" style="align-items:flex-start"><div style="width:72px;text-align:center;flex:none">${img}</div><div>
          <div class="t">THE NOONWIFE</div><div class="k">Poludnica · Bound</div><div class="ital">A tall shape in white in the harvest fields at noon.</div></div></div><div class="ink"></div>
          <div><span class="d">Signs.</span> Reapers found at noon with their necks wrung. Crows that won't land in one field.</div>
          <div><span class="d">Tale 1.</span> She comes only at noon.</div>
          <div><span class="d">Tale 2.</span> She asks a question; keep her talking until the noon bell and you are spared.</div>
          <div class="d" style="margin-top:2px">Weakness and trophy: kill it to learn them.</div></div>`);
    }
    if (name === 'ledger') {
      return frame('THE LEDGER', '2 companies', 'A: OPEN &nbsp; ◀▶: COMPANY &nbsp; B: BACK', `
        <div class="pa msl on"><div class="mfx sp"><span class="t">FREE COMPANY</span><span class="d">seed 0001-A</span></div><div class="k">Wiped out · day 14 · Lowmoor Pit</div><div class="g">Hunts 3 · Killed: the Noonwife, the Counter</div></div>
        <div class="pa msl"><div class="mfx sp"><span class="t">HUNTING PARTY</span><span class="d">seed 4471-K</span></div><div class="k">Disbanded · day 6</div><div class="g">Hunts 1</div></div>
        <div class="pa"><div class="t">THE ROLL</div><div class="mrs">
          ${ms.map((x, i) => `<div class="mr" style="padding-left:6px"><span class="mfx" style="gap:6px">${P(x.sp, x.look, 28)}<span><b style="font-weight:normal;color:#1c1814">${x.name}</b><br><span class="k">${tr(x)}</span></span></span><span class="${i === 1 ? 'k' : 'g'}" style="text-align:right;max-width:110px">${i === 1 ? 'Fell at Lowmoor, day 14. Buried.' : 'Lived'}</span></div>`).join('')}</div>
          <div class="ink"></div><div class="ital">${ms[1] ? ms[1].name : 'Alard'}, called "Two-Bolts". Owed: a Mass at Saint Ebbe's.</div></div>`);
    }
  };
})();
