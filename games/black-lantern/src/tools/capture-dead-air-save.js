// Makes one test save from the middle of Dead Air (spec 020 part B): day 2 at the KHLT station lot, with three
// threshold clues found, the first show heard, Lucien kept off the air and the crystal in hand, before the fish fry.
// npm run check then proves later builds still open it and continue its checkpoint.
// Usage: node tools/build.js && node tools/capture-dead-air-save.js <label>   (e.g. 2026-11-23-deadair)
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
  await page.evaluate(() => { CB.sel = boardTargets(boardLayout()).findIndex(t => t.id === 'dead-air'); });
  // tap through the briefing (dialogs advance, menus take their first row) until Halcott's checkpoint exists
  await page.evaluate(() => { window.__auto = setInterval(() => { if (dlg) { if (!dlg.done) finishType(); else closeDlg(); } else if (menu) closeMenu(menu.items.findIndex(x => !(x && x.dis))); }, 25); });
  await page.keyboard.press('z');
  const wait = async (f, ms = 60000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await page.evaluate(f)) return true; await page.waitForTimeout(100); } return false; };
  if (!await wait(() => G.case === 'dead-air' && G.mode === 'world' && G.map === 'halcott' && !G.busy && !dlg && !menu)) throw new Error('never reached Halcott');
  // day 2 at the station: the case's work so far done by hand
  await page.evaluate(() => {
    Object.assign(G.flags, { ph: 2, checkin: 1, odile1: 1, radioGot: 1, heard: 1, tried1: 1, lucien1: 1, lucien: 'safe', crystalGot: 1, inStation: 1, renee1: 1 });
    clue('emile', 'test'); clue('names', 'test'); clue('trace', 'test');
    pickup('staticradio'); pickup('crystal');
  });
  await wait(() => !G.busy && !dlg && !menu);
  await page.evaluate(() => run(async () => { goMap('khlt', 4, 11, 'up'); checkpoint(); }));
  await wait(() => G.map === 'khlt' && !G.busy && !dlg && !menu);
  await page.evaluate(() => clearInterval(window.__auto));
  await page.evaluate(() => checkpoint());
  const keys = await page.evaluate(() => Object.fromEntries(Object.keys(localStorage).filter(k => k.startsWith('bl.')).sort().map(k => [k, localStorage.getItem(k)])));
  const g = JSON.parse(JSON.parse(keys['bl.game']));
  if (g.case !== 'dead-air' || g.map !== 'khlt' || g.flags.ph !== 2) throw new Error('no Dead Air day 2 checkpoint');
  const file = path.join(__dirname, 'test-saves', `${label}-mid-chapter.json`);
  fs.writeFileSync(file, JSON.stringify({ note: 'Dead Air, day 2 at the KHLT station lot: three threshold clues, the first show heard, the crystal in hand, before the fish fry, from the build of ' + label, made: label, keys }, null, 1) + '\n');
  console.log('wrote', path.relative(process.cwd(), file), '· clues', g.clues.map(c => c.id).join(', '), '· errors', errors.length);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
