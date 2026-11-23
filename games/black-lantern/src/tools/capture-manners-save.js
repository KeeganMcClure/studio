// Makes one test save from the middle of Good Manners (spec 010 part B): day 2 at the fairground, with town clues found,
// the deduction made, the night men dealt with and the copybook taken on the stakeout. npm run check then proves later
// builds still open it and continue its checkpoint.
// Usage: node tools/build.js && node tools/capture-manners-save.js <label>   (e.g. 2026-11-23-manners)
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
  await page.evaluate(() => { CB.sel = boardTargets(boardLayout()).findIndex(t => t.id === 'good-manners'); });
  // tap through the briefing (dialogs advance, menus take their first row) until Main Street's checkpoint exists
  await page.evaluate(() => { window.__auto = setInterval(() => { if (dlg) { if (!dlg.done) finishType(); else closeDlg(); } else if (menu) closeMenu(menu.items.findIndex(x => !(x && x.dis))); }, 25); });
  await page.keyboard.press('z');
  const wait = async (f, ms = 60000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await page.evaluate(f)) return true; await page.waitForTimeout(100); } return false; };
  if (!await wait(() => G.case === 'good-manners' && G.mode === 'world' && G.map === 'main' && !G.busy && !dlg && !menu)) throw new Error('never reached Main Street');
  // day 2 at the fair: the case's work so far done by hand
  await page.evaluate(() => {
    Object.assign(G.flags, { ph: 2, checkin: 1, heads: 1, understudies: 1, night: 'talked', stake: 1, book: 'taken', late: 1, deduce: 'right', tanner1: 1 });
    clue('watch', 'test'); clue('car', 'test'); clue('room7', 'test');
    pickup('copybook');
  });
  await wait(() => !G.busy && !dlg && !menu);
  await page.evaluate(() => run(async () => { goMap('fair', 19, 22, 'up'); checkpoint(); }));
  await wait(() => G.map === 'fair' && !G.busy && !dlg && !menu);
  await page.evaluate(() => clearInterval(window.__auto));
  await page.evaluate(() => checkpoint());
  const keys = await page.evaluate(() => Object.fromEntries(Object.keys(localStorage).filter(k => k.startsWith('bl.')).sort().map(k => [k, localStorage.getItem(k)])));
  const g = JSON.parse(JSON.parse(keys['bl.game']));
  if (g.case !== 'good-manners' || g.map !== 'fair' || g.flags.ph !== 2) throw new Error('no Good Manners day 2 checkpoint');
  const file = path.join(__dirname, 'test-saves', `${label}-mid-chapter.json`);
  fs.writeFileSync(file, JSON.stringify({ note: 'Good Manners, day 2 at the fairground: three town clues, the deduction made, the copybook taken, from the build of ' + label, made: label, keys }, null, 1) + '\n');
  console.log('wrote', path.relative(process.cwd(), file), '· clues', g.clues.map(c => c.id).join(', '), '· errors', errors.length);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
