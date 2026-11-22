// Makes two test saves from the home phase (spec 008), so npm run check proves later builds still open them, and plays
// a Sabbatical through to the agent coming back:
//   mid-home.json    Still Harvest closed, the arc beats played, the first agent's pick made; paused at the second
//                    agent's home list (debrief step 7)
//   sabbatical.json  the same game played on: the third agent sent on Sabbatical for 1 case, a recruit in their seat,
//                    back on the board with the party saved (bl.party seats)
// Then (not saved) the party plays the case again; the case closing counts down the Sabbatical, the BACK FROM SABBATICAL
// screen asks who keeps the seat, and the agent comes back. It fails if any step doesn't happen.
// Usage: node tools/build.js && node tools/capture-home-saves.js <label>   (e.g. 2026-11-22-home)
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
  // dialogs advance and menus take their first open row (or window.__pick); the debrief's screens play themselves;
  // the home list and the Sabbatical return screen wait for the script
  await page.evaluate(() => { window.__auto = setInterval(() => {
    if (dlg) { if (!dlg.done) finishType(); else closeDlg(); }
    else if (menu) { const p = window.__pick; window.__pick = null; closeMenu(p != null ? p : menu.items.findIndex(x => !(x && x.dis))); }
    else if (SCR && SCR.kind === 'db' && !SCR.lock) { if (SCR.v === 'items') { SCR.sel = dbItemRows().length; dbPress('a'); } else { dbPress('a'); if (SCR && SCR.focus === 'who') dbPress('a'); } }
  }, 25); });
  const pickHome = async k => { await wait(() => SCR && SCR.kind === 'home' && SCR.v === 'list'); await page.evaluate(k => { SCR.sel = homeRows(party[SCR.i]).findIndex(r => r.k === k); homePress('a'); }, k);
    await page.waitForTimeout(200); if (await page.evaluate(() => SCR && SCR.v === 'bond')) await page.evaluate(() => homePress('a')); };
  const endCase = () => page.evaluate(() => { Object.assign(G.flags, { deduce: 'right', boss: 1 }); ['scare', 'count', 'drive'].forEach(k => clue(k, k)); G.rescued = 2; party[0].tried = ['Search']; run(() => ending()); });
  await page.keyboard.press('z');
  await wait(() => G.mode === 'world' && G.map === 'town' && !G.busy && !dlg && !menu);
  await endCase();
  await pickHome('fr');
  await wait(() => SCR && SCR.kind === 'home' && SCR.v === 'list' && SCR.i === 1);
  let keys = await dump(), g = JSON.parse(JSON.parse(keys['bl.game']));
  if (!g.db || g.db.step !== 7 || !g.db.home || g.db.home.i !== 1) throw new Error('no checkpoint paused at the second agent\'s home pick');
  write('mid-home', 'Still Harvest closed, arc beats played and the first agent\'s home scene done; paused at the second agent\'s pick (debrief step 7), from the build of ' + label, keys);
  await pickHome('skill');
  await page.evaluate(() => { window.__pick = 0; }); await pickHome('sab');  // 1 case, then Yes, then the first recruit
  await wait(() => !!BLG._t.board());
  keys = await dump();
  const away = JSON.parse(keys['bl.roster']).find(a => a.sab);
  if (!away || away.sab.left !== 1) throw new Error('no agent away on Sabbatical for 1 case');
  write('sabbatical', 'The same game played on: the third agent away on Sabbatical for 1 case, a recruit in their seat, back on the board with the party saved, from the build of ' + label, keys);
  // the party plays the case again (the board's Dev-only replay, called directly); its close brings the agent back
  await page.evaluate(() => { BLG.input('b'); }); await page.waitForTimeout(300);
  await page.evaluate(() => BL.beginCase('still-harvest'));
  await wait(() => G.mode === 'world' && G.map === 'town' && !G.busy && !dlg && !menu);
  await endCase();
  await wait(() => SCR && SCR.kind === 'home' && SCR.v === 'back');
  await page.evaluate(() => { SCR.sel = 0; homePress('a'); });  // the agent keeps the seat; Yes
  for (const k of ['fr', 'skill', 'mot']) await pickHome(k);
  await wait(() => !!BLG._t.board());
  const back = await page.evaluate(() => { const r = JSON.parse(localStorage.getItem('bl.roster')), p = JSON.parse(localStorage.getItem('bl.party')); return { away: r.filter(a => a.sab).length, seats: p.seats.map(id => (r.find(a => a.id === id) || {}).name) }; });
  console.log('after the second case:', JSON.stringify(back));
  if (back.away) throw new Error('the agent did not come back from Sabbatical');
  await browser.close();
  if (errors.length) { console.log(errors.join('\n')); process.exit(1); }
})().catch(e => { console.error(e); process.exit(1); });
