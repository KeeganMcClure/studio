// Rushlight look pass, rough mockup v3 (Nov 23: v2's ledger look without the ruled lines, which read as notebook paper;
// now aged parchment like the region map, with an ink border and stained edges; lighter seat cards, text tags kept). Pick a company redone to studio-bible Screen craft, on Black Lantern's
// two-step pattern (pick a team, then your team). Rough, Nov 23, 2026. Injected into the real game build on the
// Pick a company screen: it swaps the screen's list for mock DOM in the same palette, with the game's own portraits.
// window.MOCK(step): step 1 = the company list as two-line cards, step 2 = the three seat cards with their actions.
(function () {
  const css = `
  .mk{display:flex;flex-direction:column;gap:5px;padding:6px 7px;overflow:hidden;flex:1;min-height:0;background:#1c1814}
  .mk .cardc,.mk .seat,.mk .desc{position:relative;color:#2c2621;border:1px solid #1c1814;
    background:radial-gradient(ellipse at 30% 40%,rgba(255,248,225,.55),rgba(255,248,225,0) 60%),
      radial-gradient(ellipse at 85% 80%,rgba(140,104,50,.22),rgba(140,104,50,0) 45%),
      radial-gradient(ellipse at 10% 95%,rgba(140,104,50,.18),rgba(140,104,50,0) 35%),#dccca4;
    box-shadow:inset 0 0 0 2px #dccca4,inset 0 0 0 3px #5a3e2b,inset 0 0 12px rgba(90,62,43,.55),0 2px 0 #0e0c0a}
  .mk .cardc{padding:3px 7px 4px 22px;display:flex;flex-direction:column;gap:0}
  .mk .cardc.on,.mk .seat.on{background:radial-gradient(ellipse at 30% 40%,rgba(255,244,205,.8),rgba(255,244,205,0) 65%),#ead9a8;box-shadow:inset 0 0 0 2px #ead9a8,inset 0 0 0 3px #5a3e2b,inset 0 0 10px rgba(90,62,43,.4),0 0 0 2px #d9b45a,0 2px 0 #0e0c0a}
  .mk .cardc.on::after,.mk .seat.on::after{content:'';position:absolute;left:3px;top:50%;margin-top:-8px;width:16px;height:16px;border-radius:50%;
    background:radial-gradient(circle at 40% 35%,#c8603a 0 3px,#9a4528 4px 6px,#5e1a18 7px 8px);box-shadow:0 1px 0 #1c1814}
  .mk .seat.on::after{top:14px;margin-top:0}
  .mk .t1{display:flex;justify-content:space-between;align-items:baseline;font:9px/1.6 var(--px);color:#1c1814;letter-spacing:.04em}
  .mk .t1 i{font:17px var(--vt);font-style:normal;color:#5a6a2a}
  .mk .t2{font:16px/1 var(--vt);color:#3b3229;white-space:nowrap}
  .mk .desc{padding:4px 9px;font:17px/1 var(--vt);font-style:italic;color:#3b3229}
  .mk .seat{padding:6px 6px 6px 22px;display:flex;flex-direction:column;gap:6px}
  .mk .top{display:flex;gap:8px;align-items:center}
  .mk .face{width:52px;height:52px;flex:none;image-rendering:pixelated;background:linear-gradient(#8a7458,#6a5a44);border:2px solid #1c1814}
  .mk .nm{font:10px/1.6 var(--px);color:#1c1814}
  .mk .ln{font:16px/1 var(--vt);color:#2c2621} .mk .ln.k{color:#76331d}
  .mk .btns{display:flex;gap:4px}
  .mk .btns b{flex:1;text-align:center;font:7px/1 var(--px);padding:5px 0;border:1px solid #1c1814;color:#e6dcc4;background:#3b3229}
  .mk .btns b.on{background:#9a4528;color:#f2ead6}
  .mk .go{border:1px solid #1c1814;color:#f2ead6;text-align:center;font:9px/1 var(--px);padding:9px 0;background:#5e1a18;box-shadow:inset 0 0 0 1px #9a4528,0 2px 0 #0e0c0a}
  .mk .hint{font:15px/1 var(--vt);color:#b3aa98;text-align:center}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  const COS = [
    ['Free Company', 'Balanced', 'Halberdier · Crossbowman · Barber-surgeon'],
    ['Hunting Party', 'Trail+ Talk−', 'Poacher · Houndsman · Gravedigger'],
    ['Thief-takers', 'People+ Unnatural−', 'Thief-taker · Cutpurse · Scribe'],
    ['Hedge Folk', 'Occult+ Long fights−', 'Hedge-witch · Friar · Crossbowman'],
    ['Powder and Steel', 'Fights+ No healer', 'Gunner · Halberdier · Houndsman'],
    ['Camp Followers', 'Mending+ No fighters', 'Tinker · Barber-surgeon · Scribe'],
  ];
  const face = (sp, look) => { const c = document.createElement('canvas'); c.width = 64; c.height = 64; c.className = 'face'; c.getContext('2d').drawImage(RLSP.portrait(sp, look), 0, 0); return c; };
  window.MOCK = function (step) {
    const body = document.getElementById('body'); const hdr = document.getElementById('hTitle'); const ftr = document.getElementById('ftr');
    const mk = document.createElement('div'); mk.className = 'mk';
    if (step === 1) {
      hdr.textContent = 'PICK A COMPANY'; ftr.textContent = 'A: PICK · B: BACK';
      COS.forEach((c, i) => { const d = document.createElement('div'); d.className = 'cardc' + (i === 0 ? ' on' : ''); d.innerHTML = `<div class="t1"><span>${c[0].toUpperCase()}</span><i>${c[1]}</i></div><div class="t2">${c[2]}</div>`; mk.appendChild(d); });
      const bl = document.createElement('div'); bl.className = 'cardc'; bl.style.opacity = '.85'; bl.innerHTML = '<div class="t1"><span>BLANK COMPANY</span><i>Custom</i></div><div class="t2">Make all three yourself, any trades.</div>'; mk.appendChild(bl);
      const ds = document.createElement('div'); ds.className = 'desc'; ds.textContent = 'Holds a line, shoots and patches wounds. Nobody reads letters, and nobody knows the unnatural.'; mk.appendChild(ds);
    } else {
      hdr.textContent = 'FREE COMPANY'; ftr.textContent = 'A: CHOOSE · B: COMPANIES';
      const seats = [
        ['JULIANA', 'hare', { shade: 1, mark: 1, neck: 1 }, 'Halberdier', 'Athletics 80 · Melee 70 · Survival 70', 'Main: Curiosity · kin: Wilmot, child', 'Held a bridge for a lord who never paid.'],
        ['NICOLETTE', 'hedgehog', { shade: 1, mark: 3, neck: 0 }, 'Crossbowman', 'Dodge 70 · Search 70 · Shooting 70', 'Main: Revenge · kin: Joan, parent', 'Shot deer for a reeve, then the reeve.'],
        ['VALENCE', 'badger', { shade: 2, mark: 3, neck: 0 }, 'Barber-surgeon', 'Butchery 70 · First Aid 70 · Medicine 70', 'Main: Find the truth · kin: Piers, mate', 'Took a leg off a captain who didn\'t pay.'],
      ];
      seats.forEach((s, i) => {
        const d = document.createElement('div'); d.className = 'seat' + (i === 0 ? ' on' : '');
        const top = document.createElement('div'); top.className = 'top'; top.appendChild(face(s[1], s[2]));
        const info = document.createElement('div'); info.innerHTML = `<div class="nm">${s[0]}</div><div class="ln k">${s[3]} · ${s[1]}</div><div class="ln">${s[4]}</div>`;
        top.appendChild(info); d.appendChild(top);
        const bt = document.createElement('div'); bt.className = 'btns'; bt.innerHTML = ['KEEP', 'REROLL', 'TWEAK', 'REBUILD'].map((b, j) => `<b class="${i === 0 && j === 0 ? 'on' : ''}">${b}</b>`).join(''); d.appendChild(bt);
        mk.appendChild(d);
      });
      const hn = document.createElement('div'); hn.className = 'hint'; hn.textContent = 'Kin, motivations and backstory: Tweak, or the Merc card.'; mk.appendChild(hn);
      const go = document.createElement('div'); go.className = 'go'; go.textContent = 'START ▸ SIGN THEM ON'; mk.appendChild(go);
    }
    body.replaceChildren(mk);
  };
})();
