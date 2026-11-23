// Makes one test save from the middle of LANTERN 01 (spec 014 part B): mid-case on the first day, with three clues
// found and the deduction waiting. npm run check then proves later builds still open it and
// continue its checkpoint. An agency case isn't on the board until it unlocks, so this pins it first (as the Dev
// shortcut does).
// Usage: node tools/build.js && node tools/capture-lantern-save.js <label>   (e.g. 2026-11-23-lantern)
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
  await page.evaluate(() => { const s = loadSeason(); s.agency.push({ id: 'lantern-01', played: true }); s.cases['lantern-01'] = { file: 1, state: 'open', ending: null }; store.set(seasonKey(), s); });
  await page.keyboard.press('Enter'); await page.waitForTimeout(400);
  await page.evaluate(() => { CB.sel = boardTargets(boardLayout()).findIndex(t => t.id === 'lantern-01'); });
  // tap through the briefing (dialogs advance, menus take their first row) until Marine Drive's checkpoint exists
  await page.evaluate(() => { window.__auto = setInterval(() => { if (dlg) { if (!dlg.done) finishType(); else closeDlg(); } else if (menu) closeMenu(menu.items.findIndex(x => !(x && x.dis))); }, 25); });
  await page.keyboard.press('z');
  const wait = async (f, ms = 60000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await page.evaluate(f)) return true; await page.waitForTimeout(100); } return false; };
  if (!await wait(() => G.case === 'lantern-01' && G.mode === 'world' && G.map === 'town' && !G.busy && !dlg && !menu)) throw new Error('never reached Marine Drive');
  // the day's work so far, done by hand
  await page.evaluate(() => {
    Object.assign(G.flags, { ph: 0, teague1: 1, inga1: 1, key: 1, ray1: 1, box418: 1, mo1: 1, hap1: 1, loftOpen: 1, loft1: 1, lockbox: 1, ringing: 1 });
    clue('rent', 'test'); clue('box', 'test'); clue('dot', 'test'); clue('tide', 'test'); clue('record', 'test');
    pickup('record');
  });
  await wait(() => !G.busy && !dlg && !menu);
  await page.evaluate(() => run(async () => { goMap('loft', 6, 5, 'up'); checkpoint(); }));
  await wait(() => G.map === 'loft' && !G.busy && !dlg && !menu);
  await page.evaluate(() => clearInterval(window.__auto));
  await page.evaluate(() => checkpoint());
  const keys = await page.evaluate(() => Object.fromEntries(Object.keys(localStorage).filter(k => k.startsWith('bl.')).sort().map(k => [k, localStorage.getItem(k)])));
  const g = JSON.parse(JSON.parse(keys['bl.game']));
  if (g.case !== 'lantern-01' || g.map !== 'loft' || g.flags.ph !== 0) throw new Error('no LANTERN 01 day checkpoint in the loft');
  const file = path.join(__dirname, 'test-saves', `${label}-mid-chapter.json`);
  fs.writeFileSync(file, JSON.stringify({ note: 'LANTERN 01, mid-case on the first day with three clues found, from the build of ' + label, made: label, keys }, null, 1) + '\n');
  console.log('wrote', path.relative(process.cwd(), file), '· clues', g.clues.map(c => c.id).join(', '), '· errors', errors.length);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
