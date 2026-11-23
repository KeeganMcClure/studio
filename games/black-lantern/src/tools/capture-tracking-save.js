// Makes one test save from the middle of Tracking (spec 018 part B): day 2 on Fourth Street, partway along the trail:
// two copies burned, one carried, one watch (the tracking lines at step 1), Wes saved. npm run check then proves later
// builds still open it and continue its checkpoint.
// Usage: node tools/build.js && node tools/capture-tracking-save.js <label>   (e.g. 2026-11-23-tracking)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const label = process.argv[2] || new Date().toISOString().slice(0, 10);
const url = 'file://' + path.join(__dirname, '..', 'dist', 'index.html');
(async () => {
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ viewport: { width: 375, height: 667 } })).newPage();
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto(url); await page.waitForTimeout(600);
  const row = t => page.locator('#list .row', { hasText: t }).first().click();
  await row('New game'); await page.waitForTimeout(150);
  await row('FIELD TEAM'); await page.waitForTimeout(150);
  await page.keyboard.press('Enter'); await page.waitForTimeout(400);
  await page.evaluate(() => { CB.sel = boardTargets(boardLayout()).findIndex(t => t.id === 'tracking'); });
  // tap through the briefing (dialogs advance, menus take their first row) until Fourth Street's checkpoint exists
  await page.evaluate(() => { window.__auto = setInterval(() => { if (dlg) { if (!dlg.done) finishType(); else closeDlg(); } else if (menu) closeMenu(menu.items.findIndex(x => !(x && x.dis))); }, 25); });
  await page.keyboard.press('z');
  const wait = async (f, ms = 60000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await page.evaluate(f)) return true; await page.waitForTimeout(100); } return false; };
  if (!await wait(() => G.case === 'tracking' && G.mode === 'world' && G.map === 'street' && !G.busy && !dlg && !menu)) throw new Error('never reached Fourth Street');
  // day 2 on Fourth Street: the trail so far done by hand
  await page.evaluate(() => {
    Object.assign(G.flags, { ph: 2, trk: 1, seen: { wes: 1 }, cp: { bin: 'burned', wes: 'burned', travis: 'got' }, wes: 'sister', wesIn: 1, walls: 1, late: 1, manny1: 1, wes1: 1, travis1: 1, luz1: 1 });
    clue('bin', 'test'); clue('wes', 'test'); clue('travis', 'test'); clue('royce', 'test');
    pickup('trkcopy');
  });
  await wait(() => !G.busy && !dlg && !menu);
  await page.evaluate(() => run(async () => { goMap('street', 27, 15, 'up'); checkpoint(); }));
  await wait(() => G.map === 'street' && !G.busy && !dlg && !menu);
  await page.evaluate(() => clearInterval(window.__auto));
  await page.evaluate(() => checkpoint());
  const keys = await page.evaluate(() => Object.fromEntries(Object.keys(localStorage).filter(k => k.startsWith('bl.')).sort().map(k => [k, localStorage.getItem(k)])));
  const g = JSON.parse(JSON.parse(keys['bl.game']));
  if (g.case !== 'tracking' || g.map !== 'street' || g.flags.ph !== 2) throw new Error('no Tracking day 2 checkpoint');
  const file = path.join(__dirname, 'test-saves', `${label}-mid-chapter.json`);
  fs.writeFileSync(file, JSON.stringify({ note: 'Tracking, day 2 on Fourth Street: four clues, two copies burned and one carried, one watch, from the build of ' + label, made: label, keys }, null, 1) + '\n');
  console.log('wrote', path.relative(process.cwd(), file), '· clues', g.clues.map(c => c.id).join(', '), '· errors', errors.length);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
