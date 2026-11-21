// Plays the current build like a player and writes what it saved to tools/test-saves/,
// so npm run check can prove later builds still open these saves.
// It makes two test saves:
//   roster.json      two quick-rolled agents filed on the roster, plus a draft
//   mid-chapter.json the same, plus a Chapter One checkpoint after walking the town
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
  for (let i = 0; i < 2; i++) {
    await row('Quick roll'); await page.waitForTimeout(150);
    await row('Save to roster'); await page.waitForTimeout(150);
    await page.keyboard.press('Enter'); await page.waitForTimeout(150); // Start: dossier back to title
  }
  write('roster', 'Two quick-rolled agents saved to the roster, and the draft, from the build of ' + label, await dump(page));

  await row('Quick roll'); await page.waitForTimeout(150);
  await row('Save to roster'); await page.waitForTimeout(150);
  await row('Begin Chapter One');
  // tap through the briefing until the town checkpoint exists
  for (let i = 0; i < 200; i++) {
    if (await page.evaluate(() => !!localStorage.getItem('bl.game'))) break;
    await page.keyboard.press('z'); await page.waitForTimeout(120);
  }
  // finish the arrival lines, then walk about and talk to whoever is near
  const walk = ['ArrowUp', 'ArrowUp', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'z', 'z', 'z', 'ArrowUp', 'ArrowRight', 'z', 'z', 'z', 'ArrowDown', 'ArrowRight', 'ArrowRight', 'z', 'z', 'z'];
  for (let i = 0; i < 30; i++) { await page.keyboard.press('z'); await page.waitForTimeout(80); }
  for (const k of walk) { await page.keyboard.down(k); await page.waitForTimeout(260); await page.keyboard.up(k); await page.waitForTimeout(120); }
  for (let i = 0; i < 20; i++) { await page.keyboard.press('x'); await page.waitForTimeout(80); } // close any open line or menu
  // Start, then Save & quit
  await page.keyboard.press('Enter'); await page.waitForTimeout(300);
  for (let i = 0; i < 3; i++) { await page.keyboard.press('ArrowDown'); await page.waitForTimeout(80); }
  await page.keyboard.press('z'); await page.waitForTimeout(600);
  const keys = await dump(page);
  if (!keys['bl.game']) throw new Error('No checkpoint was saved');
  const g = JSON.parse(JSON.parse(keys['bl.game']));
  console.log('checkpoint: map', g.map, 'at', g.x + ',' + g.y, '· clues', g.clues.length, '· party', g.party.map(m => m.name).join(', '));
  write('mid-chapter', `Roster plus a Chapter One checkpoint (Save & quit on the ${g.map} map) from the build of ${label}`, keys);
  if (errors.length) { console.log('errors while playing:', errors); process.exit(1); }
  await browser.close();
})();
