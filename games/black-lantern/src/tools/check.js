// Automatic playtest checks (the Bible's Process, Playtest checklist, the parts a script can do).
// Runs the bundled build (dist/index.html) at each target screen size and checks:
//   1. it loads with no errors and no blank screen
//   2. every button (D-pad, A, B, L, R, Select, Start) is fully on screen and takes taps
//   3. 600 random button presses throw no errors
//   4. after a reload, whatever the game saved still loads with no errors
//   5. every test save in tools/test-saves/ (real saves from older builds) upgrades to the current
//      save version, keeps a backup when it was older, shows its roster, and its checkpoint continues into the case
//      with its saved lead (seat 1 for older saves), Select cycles the lead and Start → Party opens and closes;
//      damaged saves open to the title with no errors
//   6. the case board (spec 004): every test save has a season with Still Harvest (open for saves from before
//      version 4); a checkpoint, once finished, shows the board with Still Harvest stamped CLOSED and CLOSED n+1;
//      then New game (asking first when a case is closed) → Pick a team → Your team → START shows the board with
//      Still Harvest open, B goes back to Your team, and the roster is kept
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
    // the case board at this size (spec 004): New game → Pick a team → Your team → START, nothing cut off
    await page.evaluate(() => localStorage.clear()); await page.reload(); await page.waitForTimeout(600);
    await page.locator('#list .row', { hasText: 'New game' }).click(); await page.waitForTimeout(150);
    await page.locator('#list .row.two').first().click(); await page.waitForTimeout(150);
    await page.keyboard.press('Enter'); await page.waitForTimeout(400);
    if (!await page.evaluate(() => !!BLG._t.board())) problems.push('Your team → START did not open the case board');
    const fit = await page.evaluate(() => { const c = document.getElementById('gcv').getBoundingClientRect(), s = document.getElementById('screen').getBoundingClientRect();
      return { inside: c.top >= s.top - 0.5 && c.left >= s.left - 0.5 && c.bottom <= s.bottom + 0.5 && c.right <= s.right + 0.5, h: document.getElementById('gcv').height }; });
    if (!fit.inside) problems.push('the case board canvas is cut off');
    await page.screenshot({ path: path.join(__dirname, '..', 'dist', `check-board-${w}x${h}.png`) });
    await page.keyboard.press('x'); await page.waitForTimeout(200);
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
    const from = +(save.keys['bl.version'] || 0);  // a save already at the current version has nothing to back up
    if (from < want && !st.backup) problems.push('no bl.backup of the old saves');
    let n = 0; try { n = JSON.parse(save.keys['bl.roster'] || '[]').length; } catch (e) {}
    if (st.roster !== n) problems.push(`roster has ${st.roster} agents, the save had ${n}`);
    if (!st.rows.some(r => r.includes(`Roster ${n} on file`))) problems.push(`title doesn't show "${n} on file"`);
    let hasGame = false; try { hasGame = name !== 'damaged saves' && !!JSON.parse(save.keys['bl.game'] || 'null'); } catch (e) {}
    const cont = st.rows.some(r => r.includes('Continue Chapter One'));
    if (hasGame !== cont) problems.push(hasGame ? 'no Continue Chapter One for its checkpoint' : 'Continue Chapter One shows with no good checkpoint');
    if (hasGame && cont) {
      await page.locator('#list .row', { hasText: 'Continue Chapter One' }).click();
      await page.waitForTimeout(500);
      const inCase = await page.evaluate(() => !!(window.BLG && BLG.active && document.querySelector('.screen.gaming')));
      if (!inCase) problems.push('Continue Chapter One did not open the case');
      if (await page.evaluate(() => !!BLG._t.board())) problems.push('Continue went to the case board instead of straight into the case');
      // who leads (spec 002): a saved lead comes back; saves from before version 3 lead with seat 1
      let want = 0; try { const g = JSON.parse(JSON.parse(save.keys['bl.game'])); if (Number.isInteger(g.lead)) want = g.lead; } catch (e) {}
      const lead = await page.evaluate(() => BLG._t.lead());
      if (lead !== want) problems.push(`seat ${lead + 1} leads, the save had seat ${want + 1}`);
      // the Last time box (spec 006 A5) opens first: it must name the map and the Case file's Next goal, then close.
      // A Still Harvest checkpoint from before save version 7 (spec 006 part C rewrote the case) restarts the case from
      // its briefing with the same team instead, and says so in its first box; the in-case checks below then don't apply.
      const last = await page.evaluate(() => BLG._t.box());
      const rewrote = from < 7;
      if (rewrote && !/rewritten/.test(last)) problems.push('an old Still Harvest checkpoint should restart from the briefing with the rewritten line');
      if (!rewrote && (!/LAST TIME/.test(last) || !/NEXT/.test(last))) problems.push('no Last time box with the Next goal after Continue');
      await page.evaluate(() => BLG._t.skipBox()); await page.waitForTimeout(150);
      if (!rewrote) {
      // Select on the map moves the lead to the next seat, and Start → Party opens and closes
      await page.keyboard.press('Backspace'); await page.waitForTimeout(100);
      const n = await page.evaluate(() => BLG._t.party().length), after = await page.evaluate(() => BLG._t.lead());
      if (n > 1 && after !== (want + 1) % n) problems.push(`Select on the map: seat ${after + 1} leads, should be seat ${(want + 1) % n + 1}`);
      await page.keyboard.press('Enter'); await page.waitForTimeout(150); await page.keyboard.press('z'); await page.waitForTimeout(150);
      if (!await page.evaluate(() => typeof PM !== 'undefined' && !!PM)) problems.push('Start → Party did not open the party screen');
      for (const k of ['ArrowDown', 'z', 'ArrowDown', 'z', 'w', 'w', 'ArrowDown', 'Backspace', 'x', 'x', 'x']) { await page.keyboard.press(k); await page.waitForTimeout(80); }
      if (await page.evaluate(() => typeof PM !== 'undefined' && !!PM)) problems.push('B did not close the party screen');
      for (const k of ['x', 'x']) { await page.keyboard.press(k); await page.waitForTimeout(80); }
      for (const k of ['ArrowUp', 'ArrowLeft', 'z', 'x', 'ArrowDown', 'z', 'x']) { await page.keyboard.down(k); await page.waitForTimeout(150); await page.keyboard.up(k); }
      }
      await page.screenshot({ path: path.join(__dirname, '..', 'dist', `check-save-${name.replace(/\.json$/, '')}.png`) });
    }
    problems.push(...await checkBoard(page, name, save, hasGame && cont, from));
    const all = [...problems, ...errors];
    console.log(`${all.length ? 'FAIL' : 'ok  '} test save: ${name}`);
    all.forEach(p => console.log('     - ' + p));
    failed += all.length;
    await ctx.close();
  }
  return failed;
}

// The case board and the season save (spec 004), from wherever the test save left the game
async function checkBoard(page, name, save, inCase, from) {
  const problems = [], tag = name.replace(/\.json$/, '');
  const season = () => page.evaluate(() => JSON.parse(localStorage.getItem('bl.season') || 'null'));
  const board = () => page.evaluate(() => !!BLG._t.board());
  const pause = ms => page.waitForTimeout(ms);
  let s = await season(), before = 0;
  if (name !== 'damaged saves' || s) {
    if (!s || !s.cases || !s.cases['still-harvest']) return ['no season save with Still Harvest after upgrading'];
    if (from < 4 && (s.cases['still-harvest'].state !== 'open' || s.closed !== 0)) problems.push('an upgraded old save should have Still Harvest open and CLOSED 0');
    before = s.closed;
  }
  const roster = await page.evaluate(() => JSON.parse(localStorage.getItem('bl.roster') || '[]').length);
  if (inCase) {
    // finish the case: the dossier, then the board with the card stamped CLOSED, then B to the title
    await page.evaluate(() => BLG._t.finish()); await pause(300);
    await page.keyboard.press('x'); await pause(700);
    s = await season();
    if (!await board()) problems.push('leaving the dossier after a finish did not open the case board');
    if (!s || s.cases['still-harvest'].state !== 'closed' || s.closed !== before + 1) problems.push(`after a finish Still Harvest should be closed with CLOSED ${before + 1}`);
    await page.screenshot({ path: path.join(__dirname, '..', 'dist', `check-board-closed-${tag}.png`) });
    await page.keyboard.press('x'); await pause(300);
    if (await board() || await page.evaluate(() => BL.S.step) !== 'title') problems.push('B on the board after a finish did not go to the title');
  } else {
    await page.evaluate(() => { if (window.BLG && BLG.active) BLG.input('b'); }); await pause(200);
  }
  // New game: asks first when the season has a closed case, then starts Season 1 over and keeps the roster
  const closed = ((await season()) || {}).closed || 0;
  await page.locator('#list .row', { hasText: 'New game' }).click(); await pause(200);
  const step = await page.evaluate(() => BL.S.step);
  if (closed > 0 && step !== 'confirm') problems.push('New game with a closed case did not ask first');
  if (closed === 0 && step !== 'pick') problems.push('New game with nothing closed should go straight to Pick a team');
  if (step === 'confirm') { await page.locator('#list .row', { hasText: 'Yes' }).click(); await pause(200); }
  await page.locator('#list .row.two').first().click(); await pause(200);
  await page.keyboard.press('Enter'); await pause(400);
  s = await season();
  if (!await board()) problems.push('Your team → START did not open the case board');
  if (!s || s.cases['still-harvest'].state !== 'open' || s.closed !== 0) problems.push('after New game the board should show Still Harvest open and CLOSED 0');
  await page.screenshot({ path: path.join(__dirname, '..', 'dist', `check-board-open-${tag}.png`) });
  await page.keyboard.press('x'); await pause(300);
  const back = await page.evaluate(() => ({ step: BL.S.step, team: !!BL.S.team, active: BLG.active }));
  if (back.active || back.step !== 'team' || !back.team) problems.push('B on the board did not go back to Your team with the team kept');
  const after = await page.evaluate(() => JSON.parse(localStorage.getItem('bl.roster') || '[]').length);
  if (after < roster) problems.push(`the roster lost agents (${roster} → ${after})`);
  return problems;
}
