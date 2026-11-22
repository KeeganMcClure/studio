// Makes one test save from inside Still Harvest's corn maze (spec 006 part C): the team past the gate, with the
// roamers walking their beats (their state saves in the checkpoint, G.fs.roam), one victim cut down and the
// Lantern Box opened. npm run check then proves later builds still open it.
// Usage: node tools/build.js && node tools/capture-maze-save.js <label>   (e.g. 2026-11-22-story)
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
  // tap through the briefing (dialogs advance, menus take their first row) until the town checkpoint exists
  await page.evaluate(() => { window.__auto = setInterval(() => { if (dlg) { if (!dlg.done) finishType(); else closeDlg(); } else if (menu) closeMenu(menu.items.findIndex(x => !(x && x.dis))); }, 25); });
  await page.keyboard.press('z');
  const wait = async (f, ms = 60000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await page.evaluate(f)) return true; await page.waitForTimeout(100); } return false; };
  if (!await wait(() => G.mode === 'world' && G.map === 'town' && !G.busy && !dlg && !menu)) throw new Error('never reached town');
  // past the gate: the town's work done by hand, then into the maze
  await page.evaluate(() => { Object.assign(G.flags, { dotM: 1, key: 1, volDone: 1, deduce: 'right', pellHeld: 1 }); clue('scare', TEXT.cScare); clue('count', TEXT.cCount); clue('drive', TEXT.cDrive); run(enterMaze); });
  await wait(() => G.map === 'maze' && !G.busy && !dlg && !menu);
  await page.evaluate(() => run(() => cutDown(2)));
  await wait(() => !G.busy && !dlg && !menu);
  await page.evaluate(() => run(openBox));
  await wait(() => !G.busy && !dlg && !menu);
  await page.evaluate(() => clearInterval(window.__auto));
  await page.waitForTimeout(3000);  // let the roamers walk a few steps
  await page.evaluate(() => checkpoint());
  const keys = await page.evaluate(() => Object.fromEntries(Object.keys(localStorage).filter(k => k.startsWith('bl.')).sort().map(k => [k, localStorage.getItem(k)])));
  const g = JSON.parse(JSON.parse(keys['bl.game']));
  if (g.map !== 'maze' || !g.fs || !g.fs.roam) throw new Error('no maze checkpoint with roamers');
  const file = path.join(__dirname, 'test-saves', `${label}-maze-mid-chapter.json`);
  fs.writeFileSync(file, JSON.stringify({ note: 'Inside the corn maze with the roamers walking, one victim cut down and the Lantern Box opened, from the build of ' + label, made: label, keys }, null, 1) + '\n');
  console.log('wrote', path.relative(process.cwd(), file), '· roamers', Object.keys(g.fs.roam).join(', '), '· errors', errors.length);
  await browser.close();
  if (errors.length) { console.log(errors.join('\n')); process.exit(1); }
})().catch(e => { console.error(e); process.exit(1); });
