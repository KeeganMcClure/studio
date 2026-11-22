// Makes three test saves from the season flow (spec 009), so npm run check proves later builds still open them. It plays
// the Dev build's made-up test season (seasons/test-season.js), so the saves hold its stand-in case ids, never real data:
//   agency.json      one stand-in regular case closed and the stand-in agency case unlocked on the board
//   season-end.json  the stand-in finale closed, its end screen not yet seen
//   season-2.json    A on the end screen: Season 2's board with the open stand-in case carried over
// Usage: node tools/build.js && node tools/capture-season-saves.js <label>   (e.g. 2026-11-22-season)
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
  // the test season stands in for Season 1 on the Dev build; here the check's page plays the Dev build's part
  await page.evaluate(() => { Studio.channel = 'dev'; localStorage.setItem('bl.settings', JSON.stringify({ fast: false, testSeason: true })); BLG.newSeason(); });
  const row = t => page.locator('#list .row', { hasText: t }).first().click();
  await row('New game'); await page.waitForTimeout(150);
  if (await page.evaluate(() => BL.S.step === 'confirm')) await row('Yes');
  await row('FIELD TEAM'); await page.waitForTimeout(150);
  await page.keyboard.press('Enter');
  const wait = async (f, ms = 90000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await page.evaluate(f)) return true; await page.waitForTimeout(100); } throw new Error('timed out: ' + f); };
  const dump = () => page.evaluate(() => Object.fromEntries(Object.keys(localStorage).filter(k => k.startsWith('bl.')).sort().map(k => [k, localStorage.getItem(k)])));
  await page.evaluate(() => { window.__auto = setInterval(() => {
    if (dlg) { if (!dlg.done) finishType(); else closeDlg(); }
    else if (menu) closeMenu(menu.items.findIndex(x => !(x && x.dis)));
    else if (SCR && SCR.kind === 'db' && !SCR.lock) { if (SCR.v === 'items') { SCR.sel = dbItemRows().length; dbPress('a'); } else { dbPress('a'); if (SCR && SCR.focus === 'who') dbPress('a'); } }
    else if (SCR && SCR.kind === 'home' && !SCR.lock) homePress('a');
  }, 25); });
  const settled = () => wait(() => CB && !CB.busy && !dlg && !menu);
  const play = async id => {
    await settled();
    await page.evaluate(id => { CB.sel = boardTargets(boardLayout()).findIndex(t => t.id === id); boardPress('a'); }, id);
    await wait(() => G.mode === 'world' && !G.busy && !dlg && !menu);
    await page.evaluate(() => { run(async () => { const c = caseById(G.case), l = c.label(); await debrief(l, c.facts(l)); }); });
    await wait(() => !!CB); await page.waitForTimeout(300); await settled();
  };
  await play('test-a');
  if (!await page.evaluate(() => !!openAgency(loadSeason()))) throw new Error('the stand-in agency case did not unlock');
  write('agency', 'The Dev test season: one stand-in regular case closed and the stand-in agency case unlocked on the board, from the build of ' + label, await dump());
  await play('test-b'); await play('test-l1'); await play('test-l2');
  if (!await page.evaluate(() => !!(CB && CB.end))) throw new Error('no season end screen after the stand-in finale');
  write('season-end', 'The Dev test season: the stand-in finale closed, at the season end screen, from the build of ' + label, await dump());
  await page.evaluate(() => boardPress('a')); await page.waitForTimeout(400);
  const s = await page.evaluate(() => loadSeason());
  if (s.season !== 2 || !s.carried.length) throw new Error('Season 2 did not start with a carried case');
  write('season-2', 'The Dev test season played to its end: Season 2\'s board with the open stand-in case carried over, from the build of ' + label, await dump());
  await browser.close();
  if (errors.length) { console.log(errors.join('\n')); process.exit(1); }
})().catch(e => { console.error(e); process.exit(1); });
