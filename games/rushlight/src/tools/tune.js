// Tuning checks (each slice spec's "The tuning check"): simulated fights in the real build, auto-played, on 3 seeds.
// The company is the seed's own Free Company at level 1, fresh for each fight; foes are the bible's cards.
// Usage: node tools/build.js && node tools/tune.js [part]   (part: b, c, d, e; all by default)
// Prints the numbers; it never changes a card. Results go to dev-notes.md.
const { chromium } = require('playwright');
const path = require('path');
const url = 'file://' + path.join(__dirname, '..', 'dist', 'index.html');
const SEEDS = ['0001-A', '4242-C', '9021-M'];
const want = process.argv[2] || 'all';
const SCEN = {
  // the order parts print in: b, c, d1, d2, e
  b: [
    ['felled tree: 3 road bandits', 'tree', "()=>[0,1,2].map(()=>RLG._t.foe('bandit'))", {}],
    ['felled tree, Ambushed', 'treeA', "()=>[0,1,2].map(()=>RLG._t.foe('bandit'))", { battle: { ambush: true } }],
    ['night attack: 2 road bandits', 'night', "()=>[0,1].map(()=>RLG._t.foe('bandit'))", {}],
    ['night attack: the rooks', 'rooks', "()=>[0,1,2,3].map(()=>RLG._t.foe('rook'))", {}],
  ],
  d1: [
    ['Pell: 2 road bandits, then Pell (HP 22, DEX 16, 50%, 1d4+1)', 'pell', "[()=>[RLG._t.foe('bandit'),RLG._t.foe('bandit')],()=>[Object.assign(RLG._t.foe('bandit'),{name:'Pell',lvl:3,hp:22,dex:16,hit:50,dmg:'1d4+1',nerve:'Skittish',target:true})]]", { seq: true, battle: { bounty: true } }],
  ],
  c: [
    ['the reeve\'s men or bounty hunters: 2 men-at-arms', 'maa', "()=>[0,1].map(()=>RLG._t.foe('manatarms'))", {}],
  ],
};
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('pageerror', e => console.log('page error:', e.message));
  await page.goto(url); await page.waitForTimeout(500);
  for (const part of Object.keys(SCEN)) {
    if (want !== 'all' && want !== part) continue;
    for (const [label, , mk, o] of SCEN[part]) {
      console.log(`\nPart ${part.toUpperCase()} · ${label}`);
      for (const seed of SEEDS) {
        if (o.seq) {
          const rows = await page.evaluate(async ([s, mk, o]) => await RLG._t.simSeq(s, eval(mk), 20, o), [seed, mk, o]);
          const n = rows.length, ok = rows.filter(r => r.downed <= 1 && !r.dead).length;
          console.log(`  ${seed}: won ${rows.filter(r => r.won).length}/${n} · runs with at most 1 merc Downed and nobody dead ${ok}/${n} (${Math.round(ok / n * 100)}%) · deaths ${rows.reduce((a, r) => a + r.dead, 0)} · rounds ${(rows.reduce((a, r) => a + r.rounds, 0) / n).toFixed(1)} · SAN lost ${(rows.reduce((a, r) => a + r.san, 0) / n).toFixed(1)}`);
          continue;
        }
        const rows = await page.evaluate(async ([s, mk, o]) => await RLG._t.sim(s, eval(mk), 20, o), [seed, mk, o]);
        const n = rows.length, avg = k => (rows.reduce((a, r) => a + r[k], 0) / n).toFixed(1);
        console.log(`  ${seed}: wins ${rows.filter(r => r.res === 'win').length}/${n} · fights with a merc Downed ${rows.filter(r => r.downs).length} · ` +
          `HP lost ${avg('hpLost')} · rounds ${avg('rounds')} (max ${Math.max(...rows.map(r => r.rounds))}) · rations taken ${avg('taken')} (net ${avg('netRations')})`);
      }
    }
  }
  await browser.close();
})();
