// Plays home phases to check spec 008 part C: scenes rotate through their pools without repeats, the played list lives
// in bl.season and survives a reload, and an old save's home checkpoint list moves to the season (save step 13).
//   1. An old mid-home test save (version 12, before part C) with a made-up db.home.seen opens: the list is moved.
//   2. A New game closes Still Harvest five times (the Dev replay); every agent picks Fulfill Responsibilities with the
//      same Bond (or Improve Skill on the same skill), with a reload between breaks. No pool repeats before it runs out,
//      and none repeats the scene that just played.
// Usage: node tools/build.js && node tools/play-home-pools.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const url = 'file://' + path.join(__dirname, '..', 'dist', 'index.html');
(async () => {
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ viewport: { width: 375, height: 667 } })).newPage();
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  const wait = async (f, ms = 60000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await page.evaluate(f)) return true; await page.waitForTimeout(100); } throw new Error('timed out: ' + f); };
  // 1. the old save's list moves to the season
  const old = JSON.parse(fs.readFileSync(path.join(__dirname, 'test-saves', '2026-11-22-home-mid-home.json'), 'utf8')).keys;
  const g = JSON.parse(JSON.parse(old['bl.game'])); g.db.home.seen = { nature: [1, 4], use: [2] }; old['bl.game'] = JSON.stringify(JSON.stringify(g));
  await page.goto(url); await page.evaluate(k => { localStorage.clear(); Object.entries(k).forEach(([a, b]) => localStorage.setItem(a, b)); }, old);
  await page.reload(); await page.waitForTimeout(800);
  const up = await page.evaluate(() => ({ v: localStorage.getItem('bl.version'), played: JSON.parse(localStorage.getItem('bl.season')).played, seen: JSON.parse(JSON.parse(localStorage.getItem('bl.game'))).db.home.seen }));
  console.log('old save upgraded:', JSON.stringify(up));
  if (up.v !== '13' || JSON.stringify(up.played.nature) !== '[1,4]' || up.seen) throw new Error('the old home list did not move to bl.season');
  if (!Object.keys(up.played).some(k => k.startsWith('use|'))) throw new Error('the old Use list did not move');
  // 2. a fresh game, five breaks
  await page.evaluate(() => localStorage.clear()); await page.reload(); await page.waitForTimeout(600);
  const row = t => page.locator('#list .row', { hasText: t }).first().click();
  await row('New game'); await page.waitForTimeout(150); await row('FIELD TEAM'); await page.waitForTimeout(150);
  await page.keyboard.press('Enter'); await page.waitForTimeout(400);
  const auto = () => page.evaluate(() => {
    window.__log = JSON.parse(localStorage.getItem('test.log') || '[]');
    if (!window.__wrapped) { const f = poolPick; window.poolPick = (p, o, l) => { const r = f(p, o, l); window.__log.push([p, o, r.i, [].concat(l).length]); localStorage.setItem('test.log', JSON.stringify(window.__log)); return r; }; window.__wrapped = 1; }
    clearInterval(window.__auto); window.__auto = setInterval(() => {
      if (dlg) { if (!dlg.done) finishType(); else closeDlg(); }
      else if (menu) { const p = window.__pick; window.__pick = null; closeMenu(p != null ? p : menu.items.findIndex(x => !(x && x.dis))); }
      else if (SCR && SCR.kind === 'db' && !SCR.lock) { if (SCR.v === 'items') { SCR.sel = dbItemRows().length; dbPress('a'); } else { dbPress('a'); if (SCR && SCR.focus === 'who') dbPress('a'); } }
    }, 25); });
  await auto(); await page.keyboard.press('z');
  await wait(() => G.mode === 'world' && G.map === 'town' && !G.busy && !dlg && !menu);
  const endCase = () => page.evaluate(() => { Object.assign(G.flags, { deduce: 'right', boss: 1 }); ['scare', 'count', 'drive'].forEach(k => clue(k, k)); G.rescued = 2; party[0].tried = ['Search']; run(() => ending()); });
  const pickHome = async k => { await wait(() => SCR && SCR.kind === 'home' && SCR.v === 'list'); await page.evaluate(k => { SCR.sel = homeRows(party[SCR.i]).findIndex(r => r.k === k); homePress('a'); }, k);
    await page.waitForTimeout(200); if (await page.evaluate(() => SCR && SCR.v === 'bond')) await page.evaluate(() => homePress('a')); };
  const all = [];
  for (let n = 0; n < 5; n++) {
    if (n) { await page.evaluate(() => BL.beginCase('still-harvest')); await wait(() => G.mode === 'world' && G.map === 'town' && !G.busy && !dlg && !menu); }
    await endCase();
    // keep every Bond Close so the same pool plays each time (Fulfill Responsibilities by Bond and mood)
    await wait(() => SCR && SCR.kind === 'home' && SCR.v === 'list');
    await page.evaluate(() => party.forEach(m => (m.a.bonds || []).forEach(b => { b.score = m.a.stats.CHA; })));
    await pickHome('fr'); await pickHome('fr');
    if (n === 2) { await wait(() => SCR && SCR.kind === 'home' && SCR.v === 'list'); await page.reload(); await page.waitForTimeout(800);
      await page.locator('#list .row', { hasText: 'Continue' }).first().click(); await page.waitForTimeout(400); await auto(); }
    await pickHome('skill');
    await wait(() => !!BLG._t.board());
    all.push(...await page.evaluate(() => { const l = window.__log; window.__log = []; localStorage.setItem('test.log', '[]'); return l; }));
    if (process.env.DEBUG) console.log('break', n, await page.evaluate(() => localStorage.getItem('bl.season')));
    await page.evaluate(() => { BLG.input('b'); }); await page.waitForTimeout(300);
  }
  // per pool and memory, every run of n picks has no repeat, and no pick repeats the last
  const by = {}; all.forEach(([p, o, i, n]) => (by[p + '|' + o] = by[p + '|' + o] || { n, l: [] }).l.push(i));
  let bad = 0;
  Object.entries(by).forEach(([k, { n, l }]) => {
    for (let j = 1; j < l.length; j++) if (l[j] === l[j - 1]) { bad++; console.log('repeat right after:', k, l.join(',')); }
    for (let j = 0; j < l.length; j += n) { const c = l.slice(j, j + n); if (new Set(c).size !== c.length) { bad++; console.log('repeat before the pool ran out:', k, l.join(',')); } }
    console.log(k.padEnd(48), 'pool', n, 'played', l.join(','));
  });
  const season = await page.evaluate(() => JSON.parse(localStorage.getItem('bl.season')).played);
  console.log('bl.season.played keys:', Object.keys(season).length);
  await browser.close();
  if (errors.length) { console.log(errors.join('\n')); process.exit(1); }
  if (bad) process.exit(1);
  console.log('Home pools: no repeats across 5 breaks and a reload.');
})().catch(e => { console.error(e); process.exit(1); });
