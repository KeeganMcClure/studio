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
  b: [
    ['felled tree: 3 road bandits', 'tree', "()=>[0,1,2].map(()=>RLG._t.foe('bandit'))", {}],
    ['felled tree, Ambushed', 'treeA', "()=>[0,1,2].map(()=>RLG._t.foe('bandit'))", { battle: { ambush: true } }],
    ['night attack: 2 road bandits', 'night', "()=>[0,1].map(()=>RLG._t.foe('bandit'))", {}],
    ['night attack: the rooks', 'rooks', "()=>[0,1,2,3].map(()=>RLG._t.foe('rook'))", {}],
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
        const rows = await page.evaluate(async ([s, mk, o]) => await RLG._t.sim(s, eval(mk), 20, o), [seed, mk, o]);
        const n = rows.length, avg = k => (rows.reduce((a, r) => a + r[k], 0) / n).toFixed(1);
        console.log(`  ${seed}: wins ${rows.filter(r => r.res === 'win').length}/${n} · fights with a merc Downed ${rows.filter(r => r.downs).length} · ` +
          `HP lost ${avg('hpLost')} · rounds ${avg('rounds')} · rations taken ${avg('taken')} (net ${avg('netRations')})`);
      }
    }
  }
  await browser.close();
})();
