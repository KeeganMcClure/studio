// Automatic playtest checks (the Bible's Process, Playtest checklist, the parts a script can do).
// Runs the bundled build (dist/index.html) at each target screen size and checks:
//   1. it loads with no errors and no blank screen
//   2. every button (D-pad, A, B, L, R, Select, Start) is fully on screen and takes taps
//   3. 600 random button presses throw no errors
//   4. after a reload, whatever the game saved still loads with no errors
//   5. new runs on 3 seeds generate with no errors (Rushlight: runs once the engine has RLG.newRun(seed);
//      the vertical slice adds it, and must also report every town reachable and every board filled)
// Still needs a person: the changed part playing start to finish, text and typos, the fun check.
// Usage: node tools/build.js && node tools/check.js
const { chromium } = require('playwright');
const path = require('path');
const url = 'file://' + path.join(__dirname, '..', 'dist', 'index.html');
const SIZES = [[320, 480], [375, 550], [375, 667]];
const BUTTONS = ['[data-pad=up]', '[data-pad=down]', '[data-pad=left]', '[data-pad=right]', '#bA', '#bB', '#bL', '#bR', '#bSel', '#bStart'];
const SEEDS = [1, 4242, 90210];
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
    const saved = await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('rl.')));
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
  // 5. seeds: three fixed seeds, so a failure can be replayed
  {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 667 }, hasTouch: true });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push('page error: ' + e.message));
    await page.goto(url);
    await page.waitForTimeout(500);
    const has = await page.evaluate(() => !!(window.RLG && window.RLG.newRun));
    if (!has) console.log('skip seeds (no generator yet: RLG.newRun is added in the vertical slice)');
    else for (const seed of SEEDS) {
      const res = await page.evaluate(async s => { try { return await window.RLG.newRun(s) || { ok: true }; } catch (e) { return { ok: false, why: String(e) }; } }, seed);
      const bad = [...(res.ok === false ? [res.why || 'generation failed'] : []), ...(res.problems || []), ...errors.splice(0)];
      console.log(`${bad.length ? 'FAIL' : 'ok  '} seed ${seed}`);
      bad.forEach(p => console.log('     - ' + p));
      failed += bad.length;
    }
    await ctx.close();
  }

  // 6. spec 002: the shared battle frame, the party list, Select cycling and the seeded dice stream
  {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 667 }, hasTouch: true });
    const page = await ctx.newPage();
    const errors = [], bad = [];
    page.on('pageerror', e => errors.push('page error: ' + e.message));
    await page.goto(url);
    await page.waitForTimeout(500);
    // dice: the same seed gives the same 100 rolls; a stream saved after 50 and restored gives the same next 50
    const dice = await page.evaluate(() => {
      const a = StudioSeed.stream(4471), b = StudioSeed.stream(4471);
      StudioRoll.use(a); const r1 = Array.from({ length: 100 }, () => StudioRoll.d100());
      StudioRoll.use(b); const r2 = Array.from({ length: 100 }, () => StudioRoll.d100());
      const c = StudioSeed.stream(4471); StudioRoll.use(c); for (let i = 0; i < 50; i++) StudioRoll.d100();
      const saved = JSON.parse(JSON.stringify(c.save())); const next = Array.from({ length: 50 }, () => StudioRoll.d100());
      StudioRoll.use(StudioSeed.load(saved)); const again = Array.from({ length: 50 }, () => StudioRoll.d100());
      StudioRoll.use(null);
      return { same: r1.join() === r2.join(), resumed: next.join() === again.join() && again.join() === r1.slice(50).join() };
    });
    if (!dice.same) bad.push('two runs of the same seed gave different rolls');
    if (!dice.resumed) bad.push('a stream restored after 50 rolls gave different next rolls');
    // Select cycles the lead on the test map
    await page.evaluate(() => RLG._t.start());
    await page.waitForTimeout(300);
    const l0 = await page.evaluate(() => RLG._t.lead());
    await page.locator('#bSel').tap(); await page.waitForTimeout(150);
    const l1 = await page.evaluate(() => RLG._t.lead());
    if (l1 === l0) bad.push('Select did not change the lead on the map');
    // Start → Party opens the shared card list; B closes it
    await page.keyboard.press('Enter'); await page.waitForTimeout(200); await page.keyboard.press('z'); await page.waitForTimeout(200);
    if (!await page.evaluate(() => !!RLG._t.PM())) bad.push('the party card list did not open from Start');
    await page.keyboard.press('ArrowDown'); await page.keyboard.press('z'); await page.waitForTimeout(100); await page.keyboard.press('x');
    await page.keyboard.press('x'); await page.waitForTimeout(150); await page.keyboard.press('x'); await page.waitForTimeout(150);
    if (await page.evaluate(() => !!RLG._t.PM())) bad.push('B did not close the party card list');
    // the test fight: every command by D-pad, then by tap; Select does nothing in the fight; the fight ends
    await page.evaluate(() => { RLG._t.G().dev = { fast: true }; RLG._t.fight(); });
    await page.waitForTimeout(400);
    if (!await page.evaluate(() => !!RLG._t.Bt())) bad.push('the test fight did not open');
    const waitCmd = async () => { for (let i = 0; i < 80; i++) { const k = await page.evaluate(() => { const b = RLG._t.Bt(); return b ? (b.ui ? b.ui.kind : 'none') : 'over'; }); if (k === 'cmd' || k === 'over') return k; if (k === 'msg') await page.keyboard.press('z'); await page.waitForTimeout(60); } return 'stuck'; };
    const seen = new Set();
    for (const cmd of [0, 1, 2, 3]) {
      if (await waitCmd() !== 'cmd') break;
      const lb = await page.evaluate(() => RLG._t.lead());
      await page.keyboard.press('Backspace'); await page.waitForTimeout(60);
      if (await page.evaluate(() => RLG._t.lead()) !== lb) bad.push('Select changed the lead in a fight');
      for (let k = 0; k < cmd; k++) await page.keyboard.press('ArrowRight');
      await page.keyboard.press('z'); await page.waitForTimeout(100);
      const kind = await page.evaluate(() => { const b = RLG._t.Bt(); return b && b.ui ? b.ui.kind : 'none'; });
      if (kind === 'list') { seen.add(cmd); await page.keyboard.press('x'); await page.waitForTimeout(80); } else if (kind === 'msg' || kind === 'none') seen.add(cmd);
      if (cmd === 0 && kind === 'list') { await page.keyboard.press('z'); }
    }
    // by tap: tap each command in the box
    const box = await page.locator('#gcv').boundingBox();
    for (const cmd of [0, 1, 2, 3]) {
      if (await waitCmd() !== 'cmd') break;
      await page.waitForTimeout(80);
      const h = await page.evaluate(i => { const b = RLG._t.Bt(); const x = b.hits[i]; return x ? [x.x + x.w / 2, x.y + x.h / 2] : null; }, cmd);
      const vw = await page.evaluate(() => [document.getElementById('gcv').width, document.getElementById('gcv').height]);
      if (!h) { bad.push('command ' + cmd + ' has no tap area'); continue; }
      await page.touchscreen.tap(box.x + h[0] * box.width / vw[0], box.y + h[1] * box.height / vw[1]); await page.waitForTimeout(60);
      await page.touchscreen.tap(box.x + h[0] * box.width / vw[0], box.y + h[1] * box.height / vw[1]); await page.waitForTimeout(120);
      const kind = await page.evaluate(() => { const b = RLG._t.Bt(); return b && b.ui ? b.ui.kind : 'none'; });
      if (kind === 'cmd') bad.push('tapping command ' + cmd + ' did nothing');
      if (kind === 'list') await page.keyboard.press('x');
    }
    if (seen.size < 4) bad.push('not every command opened by D-pad: ' + [...seen].join(','));
    // fight to the end with A
    for (let i = 0; i < 600; i++) { if (await page.evaluate(() => !RLG._t.Bt())) break; await page.keyboard.press('z'); await page.waitForTimeout(30); }
    const res = await page.evaluate(() => RLG._t.G().lastFight);
    if (!res) bad.push('the test fight never ended');
    const all = [...bad, ...errors];
    console.log(`${all.length ? 'FAIL' : 'ok  '} spec 002: dice stream, Select, party list, test fight (${res || 'no end'})`);
    all.forEach(p => console.log('     - ' + p));
    failed += all.length;
    await ctx.close();
  }
  await browser.close();
  console.log(failed ? `\n${failed} problem(s) found.` : '\nAll automatic checks passed.');
  process.exit(failed ? 1 : 0);
})();
