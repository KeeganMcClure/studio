// Makes one test save from the middle of LANTERN 03, the finale (spec 015): past its one turn, in Intake after the
// lights went out, with the night's clues found and the deduction made. npm run check then proves later builds still
// open it and continue its checkpoint. An agency case isn't on the board until it unlocks, so this closes LANTERN 01
// and pins the finale first (as the Dev shortcut does).
// Usage: node tools/build.js && node tools/capture-lantern03-save.js <label>   (e.g. 2026-11-25-finale)
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
  await page.evaluate(() => { const s = loadSeason();
    s.agency.push({ id: 'lantern-01', played: true }); s.cases['lantern-01'] = { file: 1, state: 'closed', ending: 'clean', at: 1, facts: { label: 'clean', offBooks: true } };
    s.agency.push({ id: 'lantern-03', played: true }); s.cases['lantern-03'] = { file: 3, state: 'open', ending: null }; s.kept = ['still-harvest']; store.set(seasonKey(), s); });
  await page.keyboard.press('Enter'); await page.waitForTimeout(400);
  await page.evaluate(() => { CB.sel = boardTargets(boardLayout()).findIndex(t => t.id === 'lantern-03'); });
  // tap through the briefing (dialogs advance, menus take their first row) until the lot's checkpoint exists
  await page.evaluate(() => { window.__auto = setInterval(() => { if (dlg) { if (!dlg.done) finishType(); else closeDlg(); } else if (menu) closeMenu(menu.items.findIndex(x => !(x && x.dis))); }, 25); });
  await page.keyboard.press('z');
  const wait = async (f, ms = 60000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await page.evaluate(f)) return true; await page.waitForTimeout(100); } return false; };
  if (!await wait(() => G.case === 'lantern-03' && G.mode === 'world' && G.map === 'lot' && !G.busy && !dlg && !menu)) throw new Error('never reached the lot');
  // the night so far, done by hand: in through the front doors, the clues, the call, then midnight
  await page.evaluate(() => {
    Object.assign(G.flags, { ph: 1, inside: 1, lobby1: 1, des1: 1, stacks1: 1, intake1: 1, ringing: 1, wren1: 1, wrenTold: 1, deduce: 'right', tallGone: 1 });
    ['shred', 'signin', 'routing', 'lily'].forEach(k => clue(k, 'test'));
  });
  await wait(() => !G.busy && !dlg && !menu);
  await page.evaluate(() => run(async () => { goMap('intake', 5, 6, 'up'); checkpoint(); }));
  await wait(() => G.map === 'intake' && !G.busy && !dlg && !menu);
  await page.evaluate(() => clearInterval(window.__auto));
  await page.evaluate(() => checkpoint());
  const keys = await page.evaluate(() => Object.fromEntries(Object.keys(localStorage).filter(k => k.startsWith('bl.')).sort().map(k => [k, localStorage.getItem(k)])));
  const g = JSON.parse(JSON.parse(keys['bl.game']));
  if (g.case !== 'lantern-03' || g.map !== 'intake' || g.flags.ph !== 1) throw new Error('no LANTERN 03 checkpoint in Intake after midnight');
  const file = path.join(__dirname, 'test-saves', `${label}-mid-chapter.json`);
  fs.writeFileSync(file, JSON.stringify({ note: 'LANTERN 03, the finale, mid-case after midnight in Intake with the deduction made, from the build of ' + label, made: label, keys }, null, 1) + '\n');
  console.log('wrote', path.relative(process.cwd(), file), '· clues', g.clues.map(c => c.id).join(', '), '· errors', errors.length);
  await browser.close();
  if (errors.length) { console.log(errors.join('\n')); process.exit(1); }
})().catch(e => { console.error(e); process.exit(1); });
