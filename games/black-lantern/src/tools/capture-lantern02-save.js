// Makes one test save from the middle of LANTERN 02 (specs 014 and 015): mid-case on the third day, with the first
// three pages read, the key taken and a town clue found. npm run check then proves later builds still open it and
// continue its checkpoint. An agency case isn't on the board until it unlocks, and only one is open at a time, so this
// closes LANTERN 01 and pins this one first (as the Dev shortcut does).
// Usage: node tools/build.js && node tools/capture-lantern02-save.js <label>   (e.g. 2026-11-25-lantern02)
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
  await page.evaluate(() => { const s = loadSeason(); s.agency.push({ id: 'lantern-01', played: true }, { id: 'lantern-02', played: true });
    s.cases['lantern-01'] = { file: 1, state: 'closed', ending: 'clean', facts: { label: 'clean', offBooks: true } }; s.cases['lantern-02'] = { file: 2, state: 'open', ending: null }; store.set(seasonKey(), s); });
  await page.keyboard.press('Enter'); await page.waitForTimeout(400);
  await page.evaluate(() => { CB.sel = boardTargets(boardLayout()).findIndex(t => t.id === 'lantern-02'); });
  // tap through the briefing (dialogs advance, menus take their first row) until Main Street's checkpoint exists
  await page.evaluate(() => { window.__auto = setInterval(() => { if (dlg) { if (!dlg.done) finishType(); else closeDlg(); } else if (menu) closeMenu(menu.items.findIndex(x => !(x && x.dis))); }, 25); });
  await page.keyboard.press('z');
  const wait = async (f, ms = 60000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await page.evaluate(f)) return true; await page.waitForTimeout(100); } return false; };
  if (!await wait(() => G.case === 'lantern-02' && G.mode === 'world' && G.map === 'town' && !G.busy && !dlg && !menu)) throw new Error('never reached Main Street');
  // the first days' work, done by hand
  await page.evaluate(() => {
    Object.assign(G.flags, { day: 3, nt: 0, read: 3, key: 1, marit1: 1, house1: 1, bev1: 1, obs: party[2].a.id });
    clue('healed', 'test'); clue('visits', 'test'); clue('book', 'test'); clue('lag', 'test'); clue('pie', 'test');
    pickup('diary');
  });
  await wait(() => !G.busy && !dlg && !menu);
  await page.evaluate(() => run(async () => { goMap('house', 2, 5, 'up'); checkpoint(); }));
  await wait(() => G.map === 'house' && !G.busy && !dlg && !menu);
  await page.evaluate(() => clearInterval(window.__auto));
  await page.evaluate(() => checkpoint());
  const keys = await page.evaluate(() => Object.fromEntries(Object.keys(localStorage).filter(k => k.startsWith('bl.')).sort().map(k => [k, localStorage.getItem(k)])));
  const g = JSON.parse(JSON.parse(keys['bl.game']));
  if (g.case !== 'lantern-02' || g.map !== 'house' || g.flags.day !== 3) throw new Error('no LANTERN 02 day-3 checkpoint in the house');
  const file = path.join(__dirname, 'test-saves', `${label}-mid-chapter.json`);
  fs.writeFileSync(file, JSON.stringify({ note: 'LANTERN 02, mid-case on the third day with three pages read, from the build of ' + label, made: label, keys }, null, 1) + '\n');
  console.log('wrote', path.relative(process.cwd(), file), '· clues', g.clues.map(c => c.id).join(', '), '· errors', errors.length);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
