// Plays the current build like a player and writes what it saved to tools/test-saves/,
// so npm run check can prove later builds still open these saves.
// It makes two test saves:
//   roster.json      a tweaked Field Team agent filed on the roster, plus the team in progress (bl.draft)
//   mid-chapter.json the team started (all 3 filed), plus a Chapter One checkpoint after walking the town,
//                    with Select pressed once so seat 2 leads (since save version 3), and the season with
//                    Still Harvest open (since save version 4), and since version 5 each agent's kit and items,
//                    a found Bandage and seat 1 Bleeding
//   closed.json      the same game after the case is finished (through the test hook BLG._t.finish(), which runs
//                    the case's real ending step), back on the title: Still Harvest closed, CLOSED 1 (since version 4)
// Usage: node tools/build.js && node tools/capture-saves.js <label>   (label goes in the file names, e.g. 2026-11-21)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const label = process.argv[2] || new Date().toISOString().slice(0, 10);
const url = 'file://' + path.join(__dirname, '..', 'dist', 'index.html');
const out = path.join(__dirname, 'test-saves');
const dump = page => page.evaluate(() => Object.fromEntries(Object.keys(localStorage).filter(k => k.startsWith('bl.')).sort().map(k => [k, localStorage.getItem(k)])));
const write = (name, note, keys) => {
  const file = path.join(out, `${label}-${name}.json`);
  fs.writeFileSync(file, JSON.stringify({ note, made: label, keys }, null, 1) + '\n');
  console.log('wrote', path.relative(process.cwd(), file), '·', Object.keys(keys).join(', '));
};

(async () => {
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ viewport: { width: 375, height: 667 }, hasTouch: true })).newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('dialog', d => d.dismiss());
  await page.goto(url);
  await page.waitForTimeout(600);
  const row = t => page.locator('#list .row', { hasText: t }).first().click();
  const key = async k => { await page.keyboard.press(k); await page.waitForTimeout(80); };
  await row('New game'); await page.waitForTimeout(150);
  await row('FIELD TEAM'); await page.waitForTimeout(150);
  await key('ArrowDown'); await key('ArrowRight'); await key('z');       // seat 2: Tweak
  await page.locator('input[data-bind=back]').fill('ER nurse on nights. Stopped asking questions. Started writing them down.');
  await page.keyboard.press('Enter');
  await key('Enter');                                                      // Start: jump to the Dossier step
  await row('File to roster too'); await page.waitForTimeout(150);
  await row('Done'); await page.waitForTimeout(150);
  write('roster', 'A tweaked Field Team agent filed on the roster, and the team in progress, from the build of ' + label, await dump(page));

  await key('Enter');                                                      // Start on Your team: the case board (spec 004)
  if (!await page.evaluate(() => !!BLG._t.board())) throw new Error('START did not open the case board');
  // A on Still Harvest plays the briefing; tap through it until the town checkpoint exists
  for (let i = 0; i < 200; i++) {
    if (await page.evaluate(() => !!localStorage.getItem('bl.game'))) break;
    await page.keyboard.press('z'); await page.waitForTimeout(120);
  }
  // finish the arrival lines, then walk about and talk to whoever is near
  const walk = ['ArrowUp', 'ArrowUp', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'z', 'z', 'z', 'ArrowUp', 'ArrowRight', 'z', 'z', 'z', 'ArrowDown', 'ArrowRight', 'ArrowRight', 'z', 'z', 'z'];
  for (let i = 0; i < 30; i++) { await page.keyboard.press('z'); await page.waitForTimeout(80); }
  for (const k of walk) { await page.keyboard.down(k); await page.waitForTimeout(260); await page.keyboard.up(k); await page.waitForTimeout(120); }
  for (let i = 0; i < 20; i++) { await page.keyboard.press('x'); await page.waitForTimeout(80); } // close any open line or menu
  // Select once, so seat 2 leads in the saved checkpoint (spec 002: the lead is saved)
  await page.keyboard.press('Backspace'); await page.waitForTimeout(200);
  // since save version 5 (spec 006, Demo 5 part A): a found item, a status on seat 1, and the lead's kit in the checkpoint
  await page.evaluate(() => { BLG._t.status(0, 'bleed'); BLG._t.run(o => o.pickup('bandage')); }); await page.waitForTimeout(200);
  for (let i = 0; i < 10 && await page.evaluate(() => !!BLG._t.box()); i++) { await page.keyboard.press('z'); await page.waitForTimeout(150); }
  // Start → Save (the last row; Up wraps to it), then Quit to title
  await page.keyboard.press('Enter'); await page.waitForTimeout(300);
  await page.keyboard.press('ArrowUp'); await page.waitForTimeout(80);
  await page.keyboard.press('z'); await page.waitForTimeout(600);
  await page.keyboard.press('ArrowDown'); await page.waitForTimeout(80);
  await page.keyboard.press('z'); await page.waitForTimeout(600);
  const keys = await dump(page);
  if (!keys['bl.game']) throw new Error('No checkpoint was saved');
  const g = JSON.parse(JSON.parse(keys['bl.game']));
  console.log('checkpoint: map', g.map, 'at', g.x + ',' + g.y, '· lead seat', (g.lead | 0) + 1, '· clues', g.clues.length, '· party', g.party.map(m => m.name).join(', '));
  write('mid-chapter', `Roster plus a Chapter One checkpoint (Save & quit on the ${g.map} map, seat ${(g.lead | 0) + 1} leading) from the build of ${label}`, keys);

  // Continue, finish the case, leave the dossier for the board (stamped CLOSED), then B to the title
  await row('Continue Chapter One'); await page.waitForTimeout(500);
  await page.evaluate(() => BLG._t.finish()); await page.waitForTimeout(300);
  await key('x'); await page.waitForTimeout(700);
  if (!await page.evaluate(() => !!BLG._t.board())) throw new Error('Leaving the dossier did not open the case board');
  await key('x'); await page.waitForTimeout(300);
  const closed = await dump(page), season = JSON.parse(closed['bl.season'] || 'null');
  if (!season || season.closed !== 1) throw new Error('The season did not record the closed case');
  console.log('season: CLOSED', season.closed, '·', Object.entries(season.cases).map(([k, v]) => k + ' ' + v.state).join(', '));
  write('closed', 'Roster plus the season with Still Harvest closed (CLOSED 1) and no checkpoint, back on the title, from the build of ' + label, closed);
  if (errors.length) { console.log('errors while playing:', errors); process.exit(1); }
  await browser.close();
})();
