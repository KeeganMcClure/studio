// The look check (spec 008, 8D): every screen at 320 × 480, 375 × 550 and 375 × 667, against studio-bible/ui.md Screen craft.
// Opens each screen, saves a picture of it to dist/look/<size>-<screen>.png, and flags:
//   - cut-off words: any text drawn on the canvas or shown on the page that ends in "…" (names, places and items must show whole)
//   - dim body text: a long line drawn in Ash (#857e72), which is only for labels, hints and the key help line
// A few "…" are meant and listed in MEANT (a foe's turn, an input's placeholder).
// Usage: node tools/build.js && node tools/look-audit.js   (about five minutes; run it after any change to how a screen looks)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), url = 'file://' + path.join(ROOT, 'dist', 'index.html'), OUT = path.join(ROOT, 'dist', 'look');
const SIZES = [[320, 480], [375, 550], [375, 667]];
const MEANT = [/^RL1:…$/, /^[A-Z][\w' -]+…$/];   // the input placeholder; "Road bandit A…" while a foe takes its turn
const save = f => JSON.parse(fs.readFileSync(path.join(ROOT, 'test-saves', f), 'utf8')).keys;

// watch what the page draws: canvas text ending in "…", and long Ash text
const WATCH = () => {
  window.__look = { cut: [], dim: [] };
  const ft = CanvasRenderingContext2D.prototype.fillText;
  CanvasRenderingContext2D.prototype.fillText = function (s, x, y, ...a) {
    s = String(s);
    if (/…\s*$/.test(s)) window.__look.cut.push(s);
    if (String(this.fillStyle).toLowerCase() === '#857e72' && s.length >= 25) window.__look.dim.push(s);
    return ft.call(this, s, x, y, ...a);
  };
};
const domCut = () => [...document.querySelectorAll('#screen *')].filter(e => e.children.length === 0 && e.offsetParent && /…\s*$/.test(e.textContent)).map(e => e.textContent.trim());

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch(); let problems = 0;
  for (const [w, h] of SIZES) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true }), p = await ctx.newPage(), errs = [], found = {};
    p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => d.dismiss());
    await p.addInitScript(WATCH);
    const shot = async name => {
      await p.waitForTimeout(350);
      const r = await p.evaluate(() => { const o = { cut: [...new Set(window.__look.cut)], dim: [...new Set(window.__look.dim)] }; window.__look.cut = []; window.__look.dim = []; return o; });
      r.cut.push(...await p.evaluate(domCut));
      const cut = r.cut.filter(s => !MEANT.some(m => m.test(s)));
      if (cut.length || r.dim.length) found[name] = { cut, dim: r.dim };
      await p.screenshot({ path: path.join(OUT, `${w}x${h}-${name}.png`) });
    };
    const keys = async (...ks) => { for (const k of ks) { await p.keyboard.press(k); await p.waitForTimeout(120); } };
    const load = async f => { await p.goto(url); await p.evaluate(() => localStorage.clear()); if (f) { await p.evaluate(k => { for (const [a, v] of Object.entries(k)) localStorage.setItem(a, v); }, save(f)); } await p.reload(); await p.waitForTimeout(700); };
    const clearTalk = async () => { for (let i = 0; i < 6; i++) await keys('z'); };
    // the title and a new run
    await load(); await shot('title');
    await keys('z', 'z'); await shot('seed-company');
    await keys('z'); await shot('seats');
    await keys('ArrowRight', 'ArrowRight', 'z'); await shot('tweak'); await keys('x');
    // a street, its pick lists, the menus
    await load('2026-11-22-v1-standin-town.json'); await keys('z'); await p.waitForTimeout(800); await shot('town-arrive'); await clearTalk(); await shot('town');
    await p.evaluate(() => { hireCorner('harrow'); }); await shot('hire'); await keys('x', 'x');
    await keys('Enter'); await shot('pause'); await keys('x');
    await p.evaluate(() => { openParty(); }); await shot('party');
    await p.evaluate(() => { PM.view = 'card'; PM.i = 0; }); await shot('merc-card'); await p.evaluate(() => closeParty());
    await p.evaluate(() => { openItems(0); }); await shot('items'); await keys('x');
    await p.evaluate(() => { bestiary('noonwife', 'sighted'); bestiary('noonwife', 'identified'); bestiary('hedgecat', 'sighted'); openBestiary(); }); await shot('bestiary'); await keys('x');
    await p.evaluate(() => { showCard({ title: 'THE FEE', right: '75 gr', sub: 'THE NOONWIFE', rows: [['XP', '200 each'], ['Favor', '+1 the Church', '#4e5a24'], ['SAN lost', 'Ernald −4 · Cassian −6'], ['Gained', 'Her headcloth (trophy)']] }); }); await shot('pay'); await keys('z');
    // the region map, its Key and the Contracts page
    await load('2026-11-22-v3-two-contracts-noticed.json'); await keys('z'); await p.waitForTimeout(800); await clearTalk(); await shot('map');
    await p.evaluate(() => { MAPV.key = true; }); await shot('map-key'); await p.evaluate(() => { MAPV.key = false; MAPV.page = 'contracts'; }); await shot('contracts'); await p.evaluate(() => { MAPV.page = null; });
    // every site and the den, and fights in their places
    for (const id of ['pell', 'noon', 'owl', 'hag', 'counter', 'monk']) {
      await load(); await p.evaluate(() => RLG._t.start('4471-K')); await p.waitForTimeout(200);
      await p.evaluate(id => { startSite(id); }, id); await p.waitForTimeout(900); await clearTalk(); await shot('site-' + id);
    }
    for (const [name, foes, o] of [['battle-road', "[foe('bandit'),foe('bandit'),foe('bandit')]", "{bg:'dusk'}"], ['battle-night', "[foe('lamp')]", "{bg:'night',place:'mine'}"], ['battle-noon', "[foe('hedgecat')]", "{bg:'noon',place:'field'}"]]) {
      await load(); await p.evaluate(() => RLG._t.start('4471-K')); await p.waitForTimeout(200);
      await p.evaluate(([f, o]) => { battle(eval(f), eval('(' + o + ')')); }, [foes, o]); await p.waitForTimeout(1800); await shot(name);
    }
    // the death screen
    await load(); await p.evaluate(() => { localStorage.setItem(RL.key('ledger'), JSON.stringify({ companies: [{ name: 'Free Company', seed: '0001-A', end: 'wipe', regions: 0, contracts: 3, great: 1, days: 14, where: 'Lowmoor Pit', mercs: [{ name: 'Ernald', nick: ['Two-Bolts'], end: 'LG-END-FIGHT', place: 'Lowmoor Pit', killer: 'The Hollow Monk' }, { name: 'Alard', nick: [], end: 'LG-DITCH' }] }], bestiary: {}, dead: [] })); RL.S.ledgerOpen = { company: 0, from: 'wipe' }; RL.goto('death'); RL.render(); });
    await shot('death');
    const names = Object.keys(found), n = names.reduce((a, k) => a + found[k].cut.length + found[k].dim.length, 0) + errs.length;
    console.log(`${n ? 'FAIL' : 'ok  '} look check ${w} x ${h}: ${fs.readdirSync(OUT).filter(f => f.startsWith(`${w}x${h}-`)).length} screens in dist/look`);
    names.forEach(k => { found[k].cut.forEach(s => console.log(`     - ${k}: cut off: "${s}"`)); found[k].dim.forEach(s => console.log(`     - ${k}: dim body text: "${s}"`)); });
    errs.forEach(e => console.log('     - error: ' + e));
    problems += n; await ctx.close();
  }
  await b.close(); process.exit(problems ? 1 : 0);
})();
