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

  // 7. spec 003 (Part A): the same company from the same seed, a Blank company by D-pad and by tap, closing and
  //    reopening mid-creator and in town, the test saves, and Export then Import
  {
    const fs = require('fs');
    const bad = [];
    const fresh = async (init) => {
      const ctx = await browser.newContext({ viewport: { width: 375, height: 667 }, hasTouch: true });
      if (init) await ctx.addInitScript(init);
      const page = await ctx.newPage(); const errors = [];
      page.on('pageerror', e => errors.push('page error: ' + e.message));
      await page.goto(url); await page.waitForTimeout(500); return { ctx, page, errors };
    };
    // same seed, same first company and same next 5 rerolls
    { const { ctx, page, errors } = await fresh();
      for (const seed of ['4471-K', '0001-A', '9031-Z']) {
        const a = await page.evaluate(s => { const t = RL._t; const d = t.draftFor(s); const out = d.seats.map(c => c.name + c.sp + JSON.stringify(c.base)); for (let i = 0; i < 5; i++) { t.reroll(0); out.push(d.seats[0].name + JSON.stringify(d.seats[0].base)); } return out.join('|'); }, seed);
        const b = await page.evaluate(s => { const t = RL._t; const d = t.draftFor(s); const out = d.seats.map(c => c.name + c.sp + JSON.stringify(c.base)); for (let i = 0; i < 5; i++) { t.reroll(0); out.push(d.seats[0].name + JSON.stringify(d.seats[0].base)); } return out.join('|'); }, seed);
        if (a !== b) bad.push(`seed ${seed}: a different first company or rerolls the second time`);
      }
      bad.push(...errors); await ctx.close(); }
    // a Blank company in the full creator, every step, by D-pad (keys) and by tap
    for (const how of ['keys', 'tap']) {
      const { ctx, page, errors } = await fresh();
      const step = () => page.evaluate(() => RL.S.step);
      const choose = async (re) => {
        if (how === 'tap') { const rows = page.locator('#list .row'); const n = await rows.count(); for (let i = 0; i < n; i++) { const t = await rows.nth(i).innerText(); if (new RegExp(re).test(t)) { await rows.nth(i).tap(); await page.waitForTimeout(40); return true; } } return false; }
        for (let k = 0; k < 40; k++) { const t = await page.evaluate(() => (document.querySelector('#list .row.on') || {}).innerText || ''); if (new RegExp(re).test(t)) { await page.keyboard.press('z'); await page.waitForTimeout(30); return true; } await page.keyboard.press('ArrowDown'); }
        for (let k = 0; k < 40; k++) { const t = await page.evaluate(() => (document.querySelector('#list .row.on') || {}).innerText || ''); if (new RegExp(re).test(t)) { await page.keyboard.press('z'); await page.waitForTimeout(30); return true; } await page.keyboard.press('ArrowUp'); }
        bad.push(`${how}: no row ${re} on ${await step()}`); return false;
      };
      await choose('^\\s*▶?\\s*New run'); await choose('Random seed'); await choose('Blank company');
      for (let seat = 0; seat < 3; seat++) {
        await choose(seat === 0 ? 'EMPTY SEAT 1' : seat === 1 ? 'EMPTY SEAT 2' : 'EMPTY SEAT 3');
        await choose(['Halberdier', 'Crossbowman', 'Barber-surgeon'][seat]);
        await choose('^\\s*▶?\\s*Roll'); await choose('Next');
        for (const sk of ['Melee', 'Athletics', 'Dodge', 'Survival', 'Search', 'Craft', 'Persuade', 'Letters']) await choose('^\\s*▶?\\s*' + sk);
        if (seat === 1) { // close mid-creator and reopen: the same step comes back
          const st = await step(); await page.reload(); await page.waitForTimeout(500);
          await choose('New run'); await choose('^\\s*▶?\\s*Yes');
          if (await step() !== st) bad.push(`${how}: reopening mid-creator gave ${await step()}, not ${st}`);
        }
        await choose('Next'); await choose('Roll a name'); await choose('Next'); await choose('Roll a name'); await choose('Next');
        await choose('Protect the innocent'); await choose('^\\s*▶?\\s*Faith'); await choose('Next'); await choose('Sign on');
      }
      await choose('START'); await choose('Sign them on');
      const on = await page.evaluate(() => RLG.active && RLG._t.party().length);
      if (on !== 3) bad.push(`${how}: the Blank company did not sign on (step ${await step()})`);
      // close in town and reopen: the same company on the same tile
      if (on === 3) {
        for (let i = 0; i < 3; i++) { await page.keyboard.down('ArrowRight'); await page.waitForTimeout(190); await page.keyboard.up('ArrowRight'); }
        await page.waitForTimeout(300);
        const before = await page.evaluate(() => { const g = RLG._t.G(); return [g.x, g.y, RLG._t.party().map(m => m.name).join()].join(); });
        await page.evaluate(() => RLG.saveRun()); await page.reload(); await page.waitForTimeout(500);
        await choose('Continue');
        const after = await page.evaluate(() => { const g = RLG._t.G(); return [g.x, g.y, RLG._t.party().map(m => m.name).join()].join(); });
        if (before !== after) bad.push(`${how}: reopening in town gave ${after}, not ${before}`);
        // Export then Import gives the same run
        const same = await page.evaluate(() => { const run = localStorage.getItem('rl.run'); const code = RL.exportCode(); localStorage.removeItem('rl.run'); const o = RL.readCode(code); if (!o) return 'unreadable'; RL.applyCode(o); return localStorage.getItem('rl.run') === run ? 'same' : 'different'; });
        if (same !== 'same') bad.push(`${how}: Export then Import gave a ${same} run`);
        if (await page.evaluate(() => RL.readCode('not a code')) !== null) bad.push('a bad save code was read');
      }
      bad.push(...errors.map(e => how + ': ' + e)); await ctx.close();
    }
    // the test saves: every saved version opens
    for (const f of fs.readdirSync(path.join(__dirname, '..', 'test-saves')).filter(f => f.endsWith('.json')).sort()) {
      const T = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'test-saves', f), 'utf8'));
      const { ctx, page, errors } = await fresh(`(()=>{if(sessionStorage.getItem('loaded'))return;sessionStorage.setItem('loaded',1);localStorage.clear();const k=${JSON.stringify(T.keys)};for(const n in k)localStorage.setItem(n,k[n])})()`);
      const r = await page.evaluate(() => ({ v: localStorage.getItem('rl.version'), backup: Object.keys(localStorage).filter(k => k.startsWith('rl.backup.')), run: !!localStorage.getItem('rl.run'), roster: !!localStorage.getItem('rl.roster') }));
      const probs = [];
      if (+r.v !== await page.evaluate(() => RL.VERSION)) probs.push('version ' + r.v);
      if (T.version < await page.evaluate(() => RL.VERSION) && !r.backup.includes('rl.backup.v' + T.version)) probs.push('no backup made');
      if (T.version === 0 && (r.run || r.roster)) probs.push('old Black Lantern keys kept');
      if (T.keys['rl.run'] && !(await page.evaluate(() => RLG.resume()))) probs.push('the run did not open');
      if (T.keys['rl.run'] && await page.evaluate(() => RLG._t.party().length) !== 3) probs.push('the company did not load');
      probs.push(...errors);
      console.log(`${probs.length ? 'FAIL' : 'ok  '} test save: ${f}`); probs.forEach(p => console.log('     - ' + p)); failed += probs.length;
      await ctx.close();
    }
    console.log(`${bad.length ? 'FAIL' : 'ok  '} spec 003: seeds repeat, Blank company by D-pad and tap, reopen mid-creator and in town, Export/Import`);
    bad.forEach(p => console.log('     - ' + p)); failed += bad.length;
  }
  await browser.close();
  console.log(failed ? `\n${failed} problem(s) found.` : '\nAll automatic checks passed.');
  process.exit(failed ? 1 : 0);
})();
