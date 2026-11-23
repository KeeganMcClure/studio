// Makes one test save from the middle of Lost Hour (spec 016 part B): day 2 in the rain on Cullen Gap's Main Street, with
// timeline boxes filled, the Orderly beaten, the card in hand and the woods' Lantern Box opened. npm run check then
// proves later builds still open it and continue its checkpoint.
// Usage: node tools/build.js && node tools/capture-lost-hour-save.js <label>   (e.g. 2026-11-23-losthour)
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
  await page.evaluate(() => { CB.sel = boardTargets(boardLayout()).findIndex(t => t.id === 'lost-hour'); });
  // tap through the briefing (dialogs advance, menus take their first row) until Cullen Gap's checkpoint exists
  await page.evaluate(() => { window.__auto = setInterval(() => { if (dlg) { if (!dlg.done) finishType(); else closeDlg(); } else if (menu) closeMenu(menu.items.findIndex(x => !(x && x.dis))); }, 25); });
  await page.keyboard.press('z');
  const wait = async (f, ms = 60000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await page.evaluate(f)) return true; await page.waitForTimeout(100); } return false; };
  if (!await wait(() => G.case === 'lost-hour' && G.mode === 'world' && G.map === 'town' && !G.busy && !dlg && !menu)) throw new Error('never reached Cullen Gap');
  // day 2: the case's work so far done by hand
  await page.evaluate(() => {
    Object.assign(G.flags, { ph: 2, donnaOk: 1, rayOk: 1, birdie1: 1, ray1: 1, glims: 1, owen: 1, orderly: 1, ridge1: 1, woods1: 1, shoe: 1, late: 1, drives: 1, duty: 1, dutyHeld: 1 });
    G.fs.used['box:woods'] = 1;
    for (const [id, t] of [['left', 'test'], ['radio', 'test'], ['tally', 'test']]) clue(id, t);
    pickup('lhcard');
  });
  await wait(() => !G.busy && !dlg && !menu);
  await page.evaluate(() => run(async () => { goMap('town', 3, 15, 'down'); checkpoint(); }));
  await wait(() => G.map === 'town' && !G.busy && !dlg && !menu);
  await page.evaluate(() => clearInterval(window.__auto));
  await page.evaluate(() => checkpoint());
  const keys = await page.evaluate(() => Object.fromEntries(Object.keys(localStorage).filter(k => k.startsWith('bl.')).sort().map(k => [k, localStorage.getItem(k)])));
  const g = JSON.parse(JSON.parse(keys['bl.game']));
  if (g.case !== 'lost-hour' || g.map !== 'town' || g.flags.ph !== 2) throw new Error('no Lost Hour day 2 checkpoint');
  const file = path.join(__dirname, 'test-saves', `${label}-mid-chapter.json`);
  fs.writeFileSync(file, JSON.stringify({ note: 'Lost Hour, day 2 in Cullen Gap: three timeline boxes, the Orderly beaten, the card in hand, from the build of ' + label, made: label, keys }, null, 1) + '\n');
  console.log('wrote', path.relative(process.cwd(), file), '· clues', g.clues.map(c => c.id).join(', '), '· errors', errors.length);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
