// Makes one test save from the middle of Lot 83 (spec 011 part B): night 1 under the tent, in the laundry room, with the
// lot counted, the storage unit's paperwork read, the deduction made, Trey's wall fought and the Drone dealt with.
// npm run check then proves later builds still open it and continue its checkpoint.
// Usage: node tools/build.js && node tools/capture-lot83-save.js <label>   (e.g. 2026-11-23-lot83)
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
  await page.evaluate(() => { CB.sel = boardTargets(boardLayout()).findIndex(t => t.id === 'lot-83'); });
  // tap through the briefing (dialogs advance, menus take their first row) until Pecan Court's checkpoint exists
  await page.evaluate(() => { window.__auto = setInterval(() => { if (dlg) { if (!dlg.done) finishType(); else closeDlg(); } else if (menu) closeMenu(menu.items.findIndex(x => !(x && x.dis))); }, 25); });
  await page.keyboard.press('z');
  const wait = async (f, ms = 60000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await page.evaluate(f)) return true; await page.waitForTimeout(100); } return false; };
  if (!await wait(() => G.case === 'lot-83' && G.mode === 'world' && G.map === 'court' && !G.busy && !dlg && !menu)) throw new Error('never reached Pecan Court');
  // night 1 in the laundry room: the case's work so far done by hand
  await page.evaluate(() => {
    Object.assign(G.flags, { ph: 1, order: 1, u6: 'key', u6in: 1, trey1: 1, trey: 1, arm: 1, skey: 1, bayOpen: 1, bayIn: 1, bay: 1, deduce: 'right', night1: 1, drone: 1, den1: 1, late: 0 });
    clue('keys', 'test'); clue('count', 'test'); clue('list', 'test'); clue('nits', 'test');
    pickup('drawing');
  });
  await wait(() => !G.busy && !dlg && !menu);
  await page.evaluate(() => run(async () => { goMap('laundry', 6, 6, 'up'); checkpoint(); }));
  await wait(() => G.map === 'laundry' && !G.busy && !dlg && !menu);
  await page.evaluate(() => clearInterval(window.__auto));
  await page.evaluate(() => checkpoint());
  const keys = await page.evaluate(() => Object.fromEntries(Object.keys(localStorage).filter(k => k.startsWith('bl.')).sort().map(k => [k, localStorage.getItem(k)])));
  const g = JSON.parse(JSON.parse(keys['bl.game']));
  if (g.case !== 'lot-83' || g.map !== 'laundry' || g.flags.ph !== 1) throw new Error('no Lot 83 night 1 checkpoint');
  const file = path.join(__dirname, 'test-saves', `${label}-mid-chapter.json`);
  fs.writeFileSync(file, JSON.stringify({ note: 'Lot 83, night 1 in the laundry room under the tent: the lot counted, the deduction made, two story fights done, from the build of ' + label, made: label, keys }, null, 1) + '\n');
  console.log('wrote', path.relative(process.cwd(), file), '· clues', g.clues.map(c => c.id).join(', '), '· errors', errors.length);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
