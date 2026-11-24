// Makes the Asset Library pages for the look pass's screen art (spec 008, 8B and 8C), so it is filed (add-only) with its drawing
// code: the streets, the sites and the den, the region chart with its Key and Contracts, and the parchment menus.
// Each page holds the screens at the game's own size (the 240 px canvas, or the page-built menus at 1×), then the code.
// Usage: node tools/build.js && node tools/look-pages.js <out folder>
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), ENGINE = path.join(ROOT, '..', '..', '..', 'engine'), url = 'file://' + path.join(ROOT, 'dist', 'index.html');
const out = process.argv[2]; if (!out) { console.error('Give an out folder'); process.exit(1); }
const read = f => fs.readFileSync(f, 'utf8'), esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const save = f => JSON.parse(read(path.join(ROOT, 'test-saves', f))).keys;
const page = (title, h1, shots, code) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${title}</title>
<style>body{margin:0;background:#141210;color:#e6dcc4;font:11px 'DejaVu Sans Mono',monospace;padding:12px}h1{font-size:13px;color:#d9b45a;font-weight:normal;margin:0 0 10px}
.row{display:flex;gap:12px;flex-wrap:wrap;align-items:flex-start}figure{margin:0;display:grid;gap:4px;justify-items:center}img{image-rendering:pixelated;width:480px}
pre{white-space:pre-wrap;font-size:10px;color:#b3aa98;background:#1c1814;padding:10px}</style></head><body><h1>${h1}</h1>
<div class="row">${shots.map(([n, d]) => `<figure><img alt="${n}" src="${d}"><figcaption>${n}</figcaption></figure>`).join('')}</div><h2 style="font-size:12px;color:#d9b45a;font-weight:normal">Drawing code</h2><pre>${esc(code)}</pre></body></html>`;

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(), ctx = await b.newContext({ viewport: { width: 375, height: 667 } }), p = await ctx.newPage();
  const canvasShot = () => p.evaluate(() => document.getElementById('gcv').toDataURL('image/png'));
  const domShot = async () => 'data:image/png;base64,' + (await p.locator('#screen').screenshot()).toString('base64');
  const keys = async (...ks) => { for (const k of ks) { await p.keyboard.press(k); await p.waitForTimeout(120); } };
  const load = async f => { await p.goto(url); await p.evaluate(() => localStorage.clear()); if (f) await p.evaluate(k => { for (const [a, v] of Object.entries(k)) localStorage.setItem(a, v); }, save(f)); await p.reload(); await p.waitForTimeout(700); };
  const talk = async () => { for (let i = 0; i < 6; i++) await keys('z'); await p.waitForTimeout(300); };
  const S = { streets: [], sites: [], chart: [], menus: [] };
  // streets
  await load('2026-11-22-v1-standin-town.json'); await keys('z'); await p.waitForTimeout(900); await talk(); S.streets.push(['Harrowford', await canvasShot()]);
  await p.evaluate(() => { enterTown('ebbe', 'left'); }); await p.waitForTimeout(900); await talk(); S.streets.push(["Saint Ebbe's", await canvasShot()]);
  // menus over a street
  await p.evaluate(() => { hireCorner('harrow'); }); await p.waitForTimeout(400); S.menus.push(['Pick list over a street (hiring)', await domShot()]); await keys('x', 'x');
  await keys('Enter'); await p.waitForTimeout(300); S.menus.push(['Pause menu', await domShot()]); await keys('x');
  await p.evaluate(() => { openParty(); }); await p.waitForTimeout(300); S.menus.push(['Party', await canvasShot()]);
  await p.evaluate(() => { PM.view = 'card'; PM.i = 0; }); await p.waitForTimeout(300); S.menus.push(['Merc card', await canvasShot()]); await p.evaluate(() => closeParty());
  await p.evaluate(() => { openItems(0); }); await p.waitForTimeout(300); S.menus.push(['Items', await canvasShot()]); await keys('x');
  await p.evaluate(() => { bestiary('noonwife', 'sighted'); bestiary('noonwife', 'identified'); openBestiary(); }); await p.waitForTimeout(300); S.menus.push(['Bestiary', await canvasShot()]); await keys('x');
  // the chart
  await load('2026-11-22-v3-two-contracts-noticed.json'); await keys('z'); await p.waitForTimeout(900); await talk(); S.chart.push(['The region map', await canvasShot()]);
  await p.evaluate(() => { MAPV.key = true; }); await p.waitForTimeout(300); S.chart.push(['The Key', await canvasShot()]);
  await p.evaluate(() => { MAPV.key = false; MAPV.page = 'contracts'; }); await p.waitForTimeout(300); S.chart.push(['Contracts', await canvasShot()]);
  // sites
  for (const [id, n] of [['pell', 'The charcoal camp (dusk)'], ['noon', 'Hollin (noon)'], ['owl', 'Sallow End (dusk)'], ['hag', 'The osier causeway (night)'], ['counter', 'Crookback (overcast)'], ['monk', 'Lowmoor Pit (night)']]) {
    await load(); await p.evaluate(() => RLG._t.start('4471-K')); await p.waitForTimeout(200); await p.evaluate(id => { startSite(id); }, id); await p.waitForTimeout(900); await talk(); S.sites.push([n, await canvasShot()]);
  }
  // the page-built menus
  await load(); S.menus.unshift(['Title', await domShot()]);
  await keys('z', 'z'); S.menus.splice(1, 0, ['Pick a company, step 1', await domShot()]);
  await keys('z'); S.menus.splice(2, 0, ['Pick a company, step 2', await domShot()]);
  await keys('ArrowRight', 'ArrowRight', 'z'); S.menus.splice(3, 0, ['Tweak', await domShot()]);
  await b.close();
  const src = f => `// ${f}\n` + read(f.startsWith('engine/') ? path.join(ENGINE, f.slice(7)) : path.join(ROOT, f));
  const P = [
    ['rushlight-tiles-streets-v2', 'Town streets v2: Harrowford and Saint Ebbe’s, lit and dressed', 'Town streets v2 (spec 008, 8B; mockup 34-look-town-rough-v2): autumn light, 3/4 roofs with smoke, jetties, signs, a mud lane with puddles, props, lamps, a hedge with willows, crows, a dog, washing, more townsfolk, and the HUD cards. At the game’s 240 px canvas, shown at 2×.', S.streets, ['town-art.js', 'engine/hud.js']],
    ['rushlight-tiles-sites-v2', 'Contract sites v2: every site and the den, lit and dressed', 'Contract sites v2 (spec 008, 8B; mockups 40 and 41): the readability rules on every site, 3/4 buildings, woods, rye, heaps, osiers and ruin as quiet masses, props, light and hotspots. At the game’s 240 px canvas, shown at 2×.', S.sites, ['site-art.js']],
    ['rushlight-ui-chart-v2', 'Region map chart v2, with its Key and Contracts', 'Region map chart v2 (spec 008, 8B and 8C; mockups 43 and 44): parchment chart, inked scenery and roads, place pictures on ribbons, bracket cursor, edge tags, the HUD cards and road card; the Key and the Contracts page on parchment.', S.chart, ['region.js']],
    ['rushlight-ui-menus-v1', 'Parchment menus', 'Parchment menus (spec 008, 8C; mockups 35, 42 and 44): the title, Pick a company in two steps, Tweak, a pick list over the street, the pause menu, Party, the Merc card, Items and the Bestiary, on the shared parchment panel with the wax-seal cursor.', S.menus, ['engine/parch.css', 'engine/parch.js', 'party-menu.js']],
  ];
  for (const [file, title, h1, shots, code] of P) fs.writeFileSync(path.join(out, file + '.html'), page(title, h1, shots, code.map(src).join('\n\n')));
  console.log('wrote', P.map(x => x[0]).join(', '));
})();
