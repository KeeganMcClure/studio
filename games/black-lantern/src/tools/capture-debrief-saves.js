// Makes two test saves from the debrief (spec 007), so npm run check proves later builds still open them:
//   mid-debrief.json  Still Harvest ended with one agent lost in the boss fight; the recruit has joined and the game is
//                     paused at Big Hat's sorting of the case items (debrief step 3), with failed skill tries to gain from
//   memorial.json     the same game played on to the board: the case closed, the memorial entry finished, no checkpoint
// Usage: node tools/build.js && node tools/capture-debrief-saves.js <label>   (e.g. 2026-11-22-debrief)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const label = process.argv[2] || new Date().toISOString().slice(0, 10);
const url = 'file://' + path.join(__dirname, '..', 'dist', 'index.html');
const write = (name, note, keys) => {
  const file = path.join(__dirname, 'test-saves', `${label}-${name}.json`);
  fs.writeFileSync(file, JSON.stringify({ note, made: label, keys }, null, 1) + '\n');
  console.log('wrote', path.relative(process.cwd(), file));
};
(async () => {
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ viewport: { width: 375, height: 667 } })).newPage();
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto(url); await page.waitForTimeout(600);
  const row = t => page.locator('#list .row', { hasText: t }).first().click();
  await row('New game'); await page.waitForTimeout(150);
  await row('FIELD TEAM'); await page.waitForTimeout(150);
  await page.keyboard.press('Enter'); await page.waitForTimeout(400);
  const wait = async (f, ms = 60000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await page.evaluate(f)) return true; await page.waitForTimeout(100); } throw new Error('timed out: ' + f); };
  const dump = () => page.evaluate(() => Object.fromEntries(Object.keys(localStorage).filter(k => k.startsWith('bl.')).sort().map(k => [k, localStorage.getItem(k)])));
  // dialogs advance and menus take their first open row; with o.screens, the debrief's own screens are played too
  const auto = screens => page.evaluate(screens => { clearInterval(window.__auto); window.__auto = setInterval(() => {
    if (dlg) { if (!dlg.done) finishType(); else closeDlg(); }
    else if (menu) closeMenu(menu.items.findIndex(x => !(x && x.dis)));
    else if (screens && SCR && SCR.kind === 'db' && !SCR.lock) { if (SCR.v === 'items') { SCR.sel = dbItemRows().length; dbPress('a'); } else { dbPress('a'); if (SCR && SCR.focus === 'who') dbPress('a'); } }
  }, 25); }, screens);
  await auto(false); await page.keyboard.press('z');
  await wait(() => G.mode === 'world' && G.map === 'town' && !G.busy && !dlg && !menu);
  // the case at its end: three clues and the page, two victims home, case items and failed tries; one agent lost in
  // the boss fight, so the recruit is owed at the debrief
  await page.evaluate(() => {
    Object.assign(G.flags, { deduce: 'right', boss: 1, saved_a: 1, saved_b: 1 }); ['scare', 'count', 'drive', 'lore'].forEach(k => clue(k, k)); G.rescued = 2; G.fights = 3;
    gearOf(party[0]).it.push(newItem('page'), newItem('bell')); G.fs.pack.push(newItem('coffee'));
    party[0].tried = ['Search', 'Persuade']; party[2].tried = ['Forensics']; party[0].san -= 6; party[2].san -= 8;
    run(() => loseAgent(party[1], 'bled out'));
  });
  await wait(() => !G.busy && !dlg && !menu);
  await page.evaluate(() => { run(() => ending()); });
  await wait(() => SCR && SCR.kind === 'db' && SCR.v === 'items');
  await page.evaluate(() => clearInterval(window.__auto)); await page.waitForTimeout(300);
  let keys = await dump(), g = JSON.parse(JSON.parse(keys['bl.game']));
  if (!g.db || g.db.step !== 3) throw new Error('no checkpoint paused at debrief step 3');
  write('mid-debrief', 'Still Harvest ended with an agent lost in the boss fight and the recruit joined, paused at Big Hat\'s sorting of the case items (debrief step 3), from the build of ' + label, keys);
  await auto(true);
  await wait(() => !!BLG._t.board());
  await page.evaluate(() => clearInterval(window.__auto)); await page.waitForTimeout(300);
  keys = await dump();
  const mem = JSON.parse(keys['bl.memorial'] || '[]');
  if (!mem.length || !mem[0].done || keys['bl.game'] !== 'null') throw new Error('no finished memorial entry, or a checkpoint left behind');
  write('memorial', 'The same game played on to the case board: Still Harvest closed, one finished memorial entry, no checkpoint, from the build of ' + label, keys);
  await browser.close();
  if (errors.length) { console.log(errors.join('\n')); process.exit(1); }
})().catch(e => { console.error(e); process.exit(1); });
