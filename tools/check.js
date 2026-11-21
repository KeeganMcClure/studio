// Automatic playtest checks (the Bible's Process, Playtest checklist, the parts a script can do).
// Runs the bundled build (dist/index.html) at each target screen size and checks:
//   1. it loads with no errors and no blank screen
//   2. every button (D-pad, A, B, L, R, Select, Start) is fully on screen and takes taps
//   3. 600 random button presses throw no errors
//   4. after a reload, whatever the game saved still loads with no errors
//   5. every test save in tools/test-saves/ (real saves from older builds) upgrades to the current
//      save version, keeps its backup, shows its roster, and its checkpoint continues into the case;
//      damaged saves open to the title with no errors
// Still needs a person: the changed part playing start to finish, text and typos, the fun check.
// Usage: node tools/build.js && node tools/check.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const SAVES = path.join(__dirname, 'test-saves');
const url = 'file://' + path.join(__dirname, '..', 'dist', 'index.html');
const SIZES = [[320, 480], [375, 550], [375, 667]];
const BUTTONS = ['[data-pad=up]', '[data-pad=down]', '[data-pad=left]', '[data-pad=right]', '#bA', '#bB', '#bL', '#bR', '#bSel', '#bStart'];
const KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'z', 'x', 'q', 'w', 'Enter', 'Backspace'];

(async () => {
  const browser = await chromium.launch();
  let failed = 0;
  for (const [w, h] of SIZES) {
    const errors = [];
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: true });
    const page = await ctx.newPage();
    page.on('pageerror', e => errors.push('page error: ' + e.message));
    // Google Fonts may be unreachable where the check runs; any other failed file is a problem
    page.on('console', m => { if (m.type() === 'error' && !/^Failed to load resource/.test(m.text())) errors.push('console: ' + m.text()); });
    page.on('requestfailed', r => { if (!/fonts\.(googleapis|gstatic)\.com/.test(r.url())) errors.push('failed to load: ' + r.url()); });
    page.on('dialog', d => d.dismiss());
    await page.goto(url);
    await page.waitForTimeout(800);
    const problems = [];
    const blank = await page.evaluate(() => (document.getElementById('screen')?.innerText || '').trim().length === 0 && !document.querySelector('.screen.gaming'));
    if (blank) problems.push('screen is blank after loading');
    for (const sel of BUTTONS) {
      const box = await page.locator(sel).boundingBox();
      if (!box) { problems.push(`${sel} is missing`); continue; }
      if (box.x < 0 || box.y < 0 || box.x + box.width > w + 0.5 || box.y + box.height > h + 0.5) problems.push(`${sel} is cut off`);
      else await page.locator(sel).tap();
    }
    let seed = w * 7919 + h;
    const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
    for (let i = 0; i < 600; i++) { await page.keyboard.press(KEYS[Math.floor(rnd() * KEYS.length)]); if (i % 50 === 0) await page.waitForTimeout(30); }
    const saved = await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('bl.')));
    await page.reload();
    await page.waitForTimeout(800);
    for (let i = 0; i < 40; i++) await page.keyboard.press(KEYS[i % KEYS.length]);
    await page.screenshot({ path: path.join(__dirname, '..', 'dist', `check-${w}x${h}.png`) });
    const all = [...problems, ...errors];
    console.log(`${all.length ? 'FAIL' : 'ok  '} ${w} x ${h}  (saves after mashing: ${saved.join(', ') || 'none'})`);
    all.forEach(p => console.log('     - ' + p));
    failed += all.length;
    await ctx.close();
  }
  failed += await checkSaves(browser);
  await browser.close();
  console.log(failed ? `\n${failed} problem(s) found.` : '\nAll automatic checks passed.');
  process.exit(failed ? 1 : 0);
})();

// Loads each test save into a fresh phone, then plays a little from it
async function checkSaves(browser) {
  const files = fs.readdirSync(SAVES).filter(f => f.endsWith('.json')).sort();
  const broken = { note: 'damaged saves', keys: { 'bl.roster': '{not json', 'bl.draft': '[1,2', 'bl.game': '"{\\"map\\":\\"nowhere\\"}"', 'bl.sound': 'true' } };
  const cases = files.map(f => [f, JSON.parse(fs.readFileSync(path.join(SAVES, f), 'utf8'))]).concat([['damaged saves', broken]]);
  const want = +fs.readFileSync(path.join(__dirname, '..', 'creator.js'), 'utf8').match(/const SAVE_V=(\d+)/)[1];
  let failed = 0;
  for (const [name, save] of cases) {
    const errors = [], problems = [];
    const ctx = await browser.newContext({ viewport: { width: 375, height: 667 }, hasTouch: true });
    const page = await ctx.newPage();
    page.on('pageerror', e => errors.push('page error: ' + e.message));
    page.on('console', m => { if (m.type() === 'error' && !/^Failed to load resource/.test(m.text())) errors.push('console: ' + m.text()); });
    page.on('dialog', d => d.dismiss());
    await page.goto(url);
    await page.evaluate(keys => { localStorage.clear(); for (const [k, v] of Object.entries(keys)) localStorage.setItem(k, v); }, save.keys);
    await page.reload();
    await page.waitForTimeout(600);
    const st = await page.evaluate(() => ({ v: localStorage.getItem('bl.version'), backup: !!localStorage.getItem('bl.backup'), roster: JSON.parse(localStorage.getItem('bl.roster') || '[]').length, rows: [...document.querySelectorAll('#list .row')].map(r => r.innerText.replace(/\s+/g, ' ')) }));
    if (+st.v !== want) problems.push(`save version is ${st.v}, should be ${want}`);
    if (!st.backup) problems.push('no bl.backup of the old saves');
    let n = 0; try { n = JSON.parse(save.keys['bl.roster'] || '[]').length; } catch (e) {}
    if (st.roster !== n) problems.push(`roster has ${st.roster} agents, the save had ${n}`);
    if (!st.rows.some(r => r.includes(`Roster ${n} on file`))) problems.push(`title doesn't show "${n} on file"`);
    const hasGame = name !== 'damaged saves' && !!save.keys['bl.game'];
    const cont = st.rows.some(r => r.includes('Continue Chapter One'));
    if (hasGame !== cont) problems.push(hasGame ? 'no Continue Chapter One for its checkpoint' : 'Continue Chapter One shows with no good checkpoint');
    if (hasGame && cont) {
      await page.locator('#list .row', { hasText: 'Continue Chapter One' }).click();
      await page.waitForTimeout(500);
      const inCase = await page.evaluate(() => !!(window.BLG && BLG.active && document.querySelector('.screen.gaming')));
      if (!inCase) problems.push('Continue Chapter One did not open the case');
      for (const k of ['ArrowUp', 'ArrowLeft', 'z', 'x', 'ArrowDown', 'z', 'x']) { await page.keyboard.down(k); await page.waitForTimeout(150); await page.keyboard.up(k); }
      await page.screenshot({ path: path.join(__dirname, '..', 'dist', `check-save-${name.replace(/\.json$/, '')}.png`) });
    }
    const all = [...problems, ...errors];
    console.log(`${all.length ? 'FAIL' : 'ok  '} test save: ${name}`);
    all.forEach(p => console.log('     - ' + p));
    failed += all.length;
    await ctx.close();
  }
  return failed;
}
