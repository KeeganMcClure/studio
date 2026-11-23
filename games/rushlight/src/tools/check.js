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
      if (T.expect) { await page.waitForTimeout(600); const got = await page.evaluate(() => { const r = RLG._t.G().run; return { at: r.region && r.region.at, day: r.day, rations: r.rations, trip: !!(r.region && r.region.trip), hungry: RLG._t.party().some(m => m.hunger > 0), contracts: (r.contracts || []).length, hue: r.hue, site: !!(RLG._t.G().map || '').startsWith('site_'), fight: !!RLG._t.Bt() }; });
        for (const k in T.expect) if (got[k] !== T.expect[k]) probs.push(`${k} is ${got[k]}, expected ${T.expect[k]}`); }
      probs.push(...errors);
      console.log(`${probs.length ? 'FAIL' : 'ok  '} test save: ${f}`); probs.forEach(p => console.log('     - ' + p)); failed += probs.length;
      await ctx.close();
    }
    console.log(`${bad.length ? 'FAIL' : 'ok  '} spec 003: seeds repeat, Blank company by D-pad and tap, reopen mid-creator and on the map, Export/Import`);
    bad.forEach(p => console.log('     - ' + p)); failed += bad.length;
  }

  // 8. spec 004 (Part B): the March on 3 seeds, marches, food, camp and inn, every road event and choice, the coin
  {
    const bad = [];
    const ctx = await browser.newContext({ viewport: { width: 375, height: 667 }, hasTouch: true });
    const page = await ctx.newPage(); const errors = [];
    page.on('pageerror', e => errors.push('page error: ' + e.message));
    await page.goto(url); await page.waitForTimeout(500);
    for (const seed of ['0001-A', '4242-C', '9021-M']) {
      const r = await page.evaluate(async seed => {
        const out = [];
        if (RLG.active) RLG._t.quit();
        await RLG.newRun(seed); const g = RLG._t.G(), run = g.run, R = run.region;
        // roamers on legal roads
        for (const k of ['cat', 'rooks', 'candle', 'lamp']) if (!ROAMER_ROADS[k].includes(R.roam[k].road)) out.push(`${k} on ${R.roam[k].road}`);
        if (R.roam.cat.road === R.roam.rooks.road) out.push('the cat and the rooks share a road');
        // every point reachable by known roads once the hidden road is found (and the den shown)
        Object.keys(MARCH.points).forEach(k => scout(k)); findHidden(); ['CR-MONK-SIGN-1', 'CR-MONK-SIGN-2', 'CR-MONK-SIGN-3'].forEach(addSign); Object.keys(MARCH.points).forEach(k => scout(k));
        for (const k of Object.keys(MARCH.points)) if (k !== 'harrow' && MARCH.points[k].kind !== 'lie' && !route('harrow', k)) out.push('no route to ' + k);
        // march from Harrowford to every point and back, auto-played (road events and roamers included)
        g.auto = { cmd: () => 0, list: (t, rows) => Math.max(0, rows.findIndex(x => !x.dis)), menu: items => Math.max(0, items.indexOf('Leave')), choice: () => 0 };
        g.dev = { fast: true };
        for (const k of Object.keys(MARCH.points)) { if (k === 'harrow' || MARCH.points[k].kind === 'lie') continue;
          run.rations = 15; run.purse = 99; party.forEach(m => { m.hp = m.mhp; m.ko = false; });
          await march(k); if (!RLG.active) { out.push('the company was wiped on the way to ' + k); break; }
          if (R.trip) out.push('stuck on the road to ' + k);
          run.rations = 15; await march('harrow'); if (!RLG.active) { out.push('wiped coming back from ' + k); break; } }
        g.auto = null;
        return out;
      }, seed);
      r.forEach(x => bad.push(`seed ${seed}: ${x}`));
    }
    // food: 9 rations and no foraging, hungry on day 4, Who eats, Starving costs 1 HP and 1 SAN, a meal clears it
    const food = await page.evaluate(async () => {
      const out = [];
      if (RLG.active) RLG._t.quit(); await RLG.newRun('0001-A'); const g = RLG._t.G(), run = g.run;
      g.auto = { cmd: () => 0, list: () => 0, menu: items => Math.max(0, items.indexOf('Leave')), choice: () => 0 }; g.dev = { fast: true, noforage: true, noevents: true };
      run.rations = 9; let hungryDay = 0;
      for (let d = 1; d <= 5; d++) { g.whoEats = 0; await eatDay(); if (!hungryDay && party.some(m => m.hunger)) { hungryDay = d; if (!g.whoEats) out.push('no Who eats box'); } }
      if (hungryDay !== 4) out.push('went hungry on day ' + hungryDay + ', not 4');
      const m = party.find(x => x.hunger >= 2); if (!m) out.push('nobody Starving on day 5');
      else { const hp = m.hp, san = m.san; run.rations = 0; await eatDay(); if (m.hp !== Math.max(1, hp - 1) || m.san !== san - 1) out.push('Starving did not cost 1 HP and 1 SAN');
        run.rations = 15; await eatDay(); if (m.hunger || m.st.includes('Starving')) out.push('a meal did not clear Starving'); }
      // camp: heal and WP back (none for the Hungry); inn: 2 gr a merc, SAN once; sleep rough free
      party.forEach(x => { x.hp = 1; x.wp = 0; x.hunger = 0; }); party[1].hunger = 1;
      await camp({ road: false }); if (party[0].hp < 2 || party[0].wp !== party[0].mwp) out.push('camp did not heal and refill'); if (party[1].wp !== 0) out.push('a Hungry merc got WP back');
      run.purse = 20; const san0 = party.map(x => x.san); party.forEach(x => x.san = Math.max(1, x.san - 5));
      await restInn(); if (run.purse !== 14) out.push('the inn charged ' + (20 - run.purse));
      const sanA = party.map(x => x.san); await restInn(); if (party.map(x => x.san).join() !== sanA.join()) out.push('inn SAN came twice');
      const p0 = run.purse; g.auto.menu = (items) => items.indexOf('Sleep rough') >= 0 ? (g.slept ? 3 : (g.slept = 1, 1)) : 0; await openPoint('harrow'); if (run.purse !== p0) out.push('sleeping rough cost coin');
      // meat rots after 2 days and is cooked at camp
      run.rations = 0; RLG._t.G().run.region.meat = [{ n: 2, d: 2 }]; tickMeat(); await camp({ road: false }); if (run.rations !== 2) out.push('meat was not cooked into rations');
      run.region.meat = [{ n: 2, d: 2 }]; tickMeat(); tickMeat(); if (run.region.meat.length) out.push('meat did not rot');
      // the coin token follows the lead
      const l0 = g.lead; mapSelect(); drawRegion(); if (g.lead === l0) out.push('the lead did not change'); else if (party[g.lead].sp !== party[l0].sp && RLSP.coin(party[g.lead].sp) === RLSP.coin(party[l0].sp)) out.push('the coin did not change');
      g.auto = null; return out;
    });
    food.forEach(x => bad.push('food and camp: ' + x));
    // every road event, forced, with every choice, by D-pad (keys) and by tap
    const EVS = { tree: 2, toll: 3, refugee: 2, wound: 2, proc: 2, storm: 1, sign: 1 };
    for (const how of ['keys', 'tap']) for (const [ev, n] of Object.entries(EVS)) for (let c = 0; c < n; c++) {
      await page.evaluate(async () => { if (RLG.active) RLG._t.quit(); await RLG.newRun('0001-A'); const g = RLG._t.G(); g.run.purse = 50; g.run.rations = 9;
        g.auto = { cmd: () => 0, list: (t, rows) => Math.max(0, rows.findIndex(x => !x.dis)) }; g.dev = { fast: true }; });
      await page.evaluate(ev => { const g = RLG._t.G(); g.dev.event = ev; g.evDone = 0; run(async () => { await roadEvent({ road: 'hs', to: 'cause', day: 1, extra: 0 }); g.evDone = 1; }); }, ev);
      for (let k = 0; k < 120; k++) {
        const st = await page.evaluate(() => { const g = RLG._t.G(); const li = document.querySelectorAll('#gdlg .bld-c li'); return { done: g.evDone, choices: li.length, dlg: !!document.querySelector('#gdlg .bld'), menu: !document.getElementById('gmenu').hidden }; });
        if (st.done) break;
        if (st.choices) {
          if (how === 'tap') { await page.locator('#gdlg .bld-c li').nth(Math.min(c, st.choices - 1)).click(); }
          else { for (let q = 0; q < c; q++) await page.keyboard.press('ArrowDown'); await page.keyboard.press('z'); }
        } else if (st.menu) await page.keyboard.press('z'); else await page.keyboard.press('z');
        await page.waitForTimeout(40);
      }
      if (!await page.evaluate(() => RLG._t.G().evDone)) bad.push(`${how}: road event ${ev}, choice ${c + 1} never finished`);
    }
    await page.evaluate(() => { const g = RLG._t.G(); g.auto = null; g.dev = {}; });
    bad.push(...errors);
    console.log(`${bad.length ? 'FAIL' : 'ok  '} spec 004: the March on 3 seeds, marches, food, camp and inn, every road event by D-pad and tap, the coin`);
    bad.forEach(p => console.log('     - ' + p)); failed += bad.length;
    await ctx.close();
  }

  // 9. spec 005 (Part C): streets, boards and the pool, shops and prices, haggling, reading, hiring, rumors, the Hue and cry
  {
    const bad = [];
    const ctx = await browser.newContext({ viewport: { width: 375, height: 667 }, hasTouch: true });
    const page = await ctx.newPage(); const errors = [];
    page.on('pageerror', e => errors.push('page error: ' + e.message));
    await page.goto(url); await page.waitForTimeout(500);
    const res = await page.evaluate(async () => {
      const out = [], fixed = v => () => (v - 1) / 100 + 0.001;
      const setup = async seed => { if (RLG.active) RLG._t.quit(); await RLG.newRun(seed); const g = RLG._t.G(); g.dev = { fast: true };
        g.auto = { cmd: () => 0, list: (t, rows) => Math.max(0, rows.findIndex(x => !x.dis)), menu: items => Math.max(0, items.findIndex(x => (x.label || x) === 'Leave')), choice: () => 0 }; return g; };
      for (const seed of ['0001-A', '4242-C', '9021-M']) {
        const g = await setup(seed), r = g.run, B_ = r.boards;
        for (const k of ['harrow', 'ebbe']) { enterTown(k, 'left'); drawWorld(); if (!G.M || !G.M.town) out.push(`${seed}: ${k} street did not load`); }
        if (B_.posted.length !== 4) out.push(`${seed}: ${B_.posted.length} jobs posted, not 4`);
        for (const t of ['harrow', 'ebbe']) if (!B_.posted.some(j => JOBS[j].town === t)) out.push(`${seed}: nothing posted at ${t}`);
        let guard = 0; while (B_.posted.length && guard++ < 10) await takeJob(B_.posted[0]);
        if (B_.taken.length !== 6) out.push(`${seed}: only ${B_.taken.length} of 6 jobs could be taken`);
        if (B_.posted.length) out.push(`${seed}: the boards still show work after all 6 were taken`);
        if (!r.contracts.every(c => c.next)) out.push(`${seed}: a taken job has no Next line`);
        // drop a board job: back on the board; drop a giver job: −1 favor
        const town0 = r.fac.town.step * 2 + r.fac.town.fav; await dropJob('pell'); if (!B_.posted.includes('pell')) out.push('a dropped board job did not go back up');
        await dropJob('wool'); if (r.fac.town.step * 2 + r.fac.town.fav !== town0 - 1) out.push('dropping a giver job did not cost a favor');
      }
      // shops: prices, Wary +25%, Town Trusted −10% at market, Mend all's total
      { const g = await setup('0001-A'), r = g.run;
        if (priceOf('jack', 'smith') !== 10 || priceOf('mail', 'smith') !== 40 || priceOf('bandage', 'market') !== 5 || priceOf('sword', 'smith') !== 25) out.push('a shop price is off the bible');
        r.fac.town.step = 1; if (priceOf('mail', 'smith') !== 50) out.push('Wary did not add 25%'); r.fac.town.step = 3; if (priceOf('cudgel', 'market') !== 7) out.push('Town Trusted did not take 10% off at market'); r.fac.town.step = 2;
        party[0].gear.w1.wear = 2; party[1].gear.body = { id: 'jack', wear: 1 }; if (mendTotal() !== 6 + 3 + 3) out.push('Mend all total is ' + mendTotal());
        r.purse = 100; g.auto.menu = (items, o) => o && o.title === 'MEND' ? 0 : Math.max(0, items.findIndex(x => (x.label || x) === 'Leave')); await mend(); if (r.purse !== 88 || mendTotal()) out.push('Mend all charged ' + (100 - r.purse));
        // buy then sell at half
        r.purse = 50; let step = 0; g.auto.menu = (items, o) => { if (o && /^SMITH/.test(o.title)) return step++ ? items.length - 1 : 1 + SHOPS.smith.indexOf('jack') - 1 + 0; return Math.max(0, items.findIndex(x => (x.label || x) === 'Leave')); };
        await shop('harrow', 'smith'); if (r.purse !== 40 || !r.pack.some(p => p.id === 'jack')) out.push('buying a padded jack cost ' + (50 - r.purse));
        g.auto.menu = (items, o) => o && o.title === 'SELL' ? items.length - 1 : Math.max(0, items.findIndex(x => (x.label || x) === 'Leave')); const before = r.purse; await sell('smith'); if (r.purse - before < 5) out.push('selling the jack paid ' + (r.purse - before)); }
      // haggling: pass +25%, fail closes, fumble closes and −1 favor; Letters 40% hides a board card's words and threat
      for (const [roll, want] of [[5, 'pass'], [95, 'fail'], [100, 'fumble']]) { const g = await setup('0001-A'), r = g.run, gv = r.givers.guild; gv.quirk = 'Pious';
        if (!r.boards.posted.includes('wool')) r.boards.posted.push('wool');
        const fav = r.fac.town.step * 2 + r.fac.town.fav; let n = 0;
        g.auto.menu = (items, o) => { const L = items.map(x => x.label || x); if (o && o.title && /guild master/.test(o.title)) return n++ ? L.indexOf('Leave') : 0; const h = L.findIndex(x => /^Haggle/.test(x)); if (h >= 0 && !gv.haggled.wool) return h; return L.indexOf('Back') >= 0 ? L.indexOf('Back') : 0; };
        StudioRoll.use(fixed(roll)); await giverPlace('guild'); StudioRoll.use(null);
        if (gv.haggled.wool !== want) out.push(`haggle on ${roll}: ${gv.haggled.wool}, expected ${want}`);
        if (want === 'pass' && jobPay('wool') !== Math.round(Math.round(40 * 1.25) * 1.25)) out.push('a passed haggle did not add 25%: ' + jobPay('wool'));
        if (want === 'fumble' && r.fac.town.step * 2 + r.fac.town.fav !== fav - 1) out.push('a fumbled haggle did not cost a favor'); }
      { const g = await setup('0001-A'); party.forEach(m => m.sk.Letters = 10); const L1 = cardLines('pell', false).join('|'); party[0].sk.Letters = 40; const L2 = cardLines('pell', false).join('|');
        if (/THREAT/.test(L1) || /Wanted: Pell/.test(L1)) out.push('a board card showed its words or threat with nobody at Letters 40%'); if (!/THREAT/.test(L2) || !/Pell/.test(L2)) out.push('a board card hid its words with Letters 40%'); }
      // hiring: greyed with a full company; fills an empty seat; Weak-willed deserts when hungry
      { const g = await setup('0001-A'), r = g.run, pool = r.hires.harrow; r.purse = 99; const n0 = pool.length;
        g.auto.menu = (items, o) => { const L = items.map(x => x.label || x); if (o && /MERCS/.test(o.title || '')) return g.hired ? L.indexOf('Leave') : (g.hired = 1, 0); return 0; };
        await hireCorner('harrow'); if (pool.length !== n0) out.push('a hire was made with a full company');
        party[2].dead = true; party[2].gone = 'test'; g.hired = 0; await hireCorner('harrow'); if (pool.length !== n0 - 1 || party.filter(m => !m.dead).length !== 3) out.push('a hire did not fill the empty seat');
        const h = party[2]; h.weak = true; h.hunger = 2; StudioRoll.use(fixed(99)); r.rations = 0; await eatDay(); StudioRoll.use(null); if (!h.dead) out.push('a Weak-willed hire did not desert on the third unfed day'); }
      // rumors: every one can be bought; true ones show what they name; lies show a ? that comes to nothing
      for (const seed of ['0001-A', '4242-C']) { const g = await setup(seed), r = g.run; r.purse = 99;
        for (let i = 0; i < 8; i++) await buyRumor();
        if (r.rumors.bought !== 8) out.push(seed + ': not every rumor could be bought');
        if (!RG().hiddenFound) out.push(seed + ': the hidden road rumor did not show it');
        for (const k of ['camp', 'cause', 'sallow', 'crook', 'lie1', 'lie2']) if (!knownPt(k)) out.push(`${seed}: rumor did not show ${k}`);
        if (!RG().signs.length) out.push(seed + ': RU-MONK gave no sign');
        await openPoint('lie1'); if (!r.rumors.lies.lie1.found) out.push(seed + ': a lie was not struck out'); }
      // the Hue and cry: a crime's mark and odds, climbing, fights at Wanted and Outlawed, settling three ways
      { const g = await setup('0001-A'), r = g.run;
        if (crimeMark('town') !== '✖ crime · Luck 10%' || crimeMark('seen') !== '✖ crime · Luck 30%' || crimeMark('unseen') !== '✖ crime · Luck 50%') out.push('crime marks show the wrong odds');
        StudioRoll.use(fixed(90)); await crime('seen', 'test'); StudioRoll.use(null); if (r.hue !== 1) out.push('a failed crime roll did not climb');
        StudioRoll.use(fixed(90)); await crime('seen', 'test'); StudioRoll.use(null); if (r.hue !== 2 || r.fac.lord.step !== 1 || !r.reeveScene) out.push('Wanted did not drop the Lord and set the reeve scene');
        g.auto.menu = items => { const L = items.map(x => x.label || x); return L.findIndex(x => /^Fight/.test(x)) >= 0 ? L.findIndex(x => /^Fight/.test(x)) : 0; };
        let fought = 0; const b0 = battle; window.battleSpy = 0; const prevB = battle;
        r.purse = 0; await reeveScene('harrow'); if (!G.lastStats || !G.lastStats.rounds) out.push('the reeve\'s men fight did not open'); else fought = G.lastStats.rounds;
        if (fought > 12) out.push('the reeve\'s men fight ran ' + fought + ' rounds');
        r.hue = 2; r.purse = 30; g.auto.menu = (items, o) => { const L = items.map(x => x.label || x); return o && /REEVE/.test(o.title || '') ? (g.paid ? L.indexOf('Leave') : (g.paid = 1, 0)) : 0; }; await PLACES.reeve('harrow'); if (r.hue !== 1 || r.purse !== 0) out.push('blood-money did not settle a step for 30');
        party[0].sk.Letters = 80; r.hue = 2; g.paid = 0; g.auto.menu = (items, o) => { const L = items.map(x => x.label || x); return o && /REEVE/.test(o.title || '') ? (g.paid ? L.indexOf('Leave') : (g.paid = 1, 1)) : 0; }; StudioRoll.use(fixed(5)); await PLACES.reeve('harrow'); StudioRoll.use(null); if (r.hue !== 1) out.push('a Writ did not settle a step');
        r.hue = 2; g.paid = 0; party[0].writUsed = 0; g.auto.menu = (items, o) => { const L = items.map(x => x.label || x); return o && /REEVE/.test(o.title || '') ? (g.paid ? L.indexOf('Leave') : (g.paid = 1, 2)) : 0; }; StudioRoll.use(fixed(97)); await PLACES.reeve('harrow'); StudioRoll.use(null); if (r.hue !== 3) out.push('a failed talk with the reeve did not climb');
        if (r.fac.lord.step !== 0) out.push('Outlawed did not drop the Lord to Hated');
        g.dev.event = 'storm'; G.lastStats = null; StudioRoll.use(fixed(1)); await roadEvent({ road: 'hs', to: 'cause', day: 1, extra: 0 }); StudioRoll.use(null); if (!G.lastStats || !G.lastStats.rounds) out.push('no bounty hunters at Outlawed'); }
      RLG._t.G().auto = null; return out;
    });
    bad.push(...res, ...errors);
    console.log(`${bad.length ? 'FAIL' : 'ok  '} spec 005: streets, the pool of 6, shops and prices, haggling, reading, hiring, rumors, the Hue and cry`);
    bad.forEach(p => console.log('     - ' + p)); failed += bad.length;
    await ctx.close();
  }

  // 10. spec 006 D1: Pell's job start to finish on 3 seeds, and the rules each forced by a Dev setting
  {
    const bad = [];
    const ctx = await browser.newContext({ viewport: { width: 375, height: 667 }, hasTouch: true });
    const page = await ctx.newPage(); const errors = [];
    page.on('pageerror', e => errors.push('page error: ' + e.message));
    await page.goto(url); await page.waitForTimeout(500);
    const res = await page.evaluate(async () => {
      const out = [];
      const auto = g => { g.auto = { cmd: () => 0, list: (t, rows) => Math.max(0, rows.findIndex(x => !x.dis)), smart: true, yield: () => 1, said: [],
        menu: items => { const L = items.map(x => x.label || x); const i = L.findIndex(x => /^Leave$|Take it|^Set out|^Go on|SEARCH|TRACK|LISTEN|TAKE IT|^Stay/.test(x)); return i >= 0 ? i : 0; }, choice: () => 0 }; };
      for (const seed of ['0001-A', '4242-C', '9021-M']) {
        if (RLG.active) RLG._t.quit(); await RLG.newRun(seed); const g = RLG._t.G(), r = g.run; g.dev = { fast: true, noevents: true }; auto(g);
        r.purse = 50; party[0].slots.push({ id: 'manacles', n: 1 });
        if (!r.boards.posted.includes('pell')) r.boards.posted.push('pell'); await takeJob('pell'); await march('camp');
        const job = r.job; if (!job) { out.push(seed + ': the camp did not open its site'); continue; }
        for (let c = 0; c < job.chunks.length; c++) { if (job.chunk !== c) enterChunk(c, 'left'); drawWorld(); const M = G.M;
          for (const h of M.hot) await hotspot(h);
          for (const f of M.fights) { if (f.when && !f.when(job)) continue; if (!job.fights[f.id]) await siteFight(f); }
          for (const h of M.hot) if (job.used[h.id] !== 'done') await hotspot(h); }
        if (!job.resolved) out.push(`${seed}: Pell's job didn't resolve (${JSON.stringify(job.fights)})`);
        const p0 = r.purse; await leaveSite(); await march('harrow');
        if (r.job) out.push(`${seed}: no pay screen at Harrowford`); else if (r.purse <= p0) out.push(`${seed}: Pell paid nothing`);
        if (!party.every(m => m.dead || m.xp >= 150)) out.push(`${seed}: XP not paid`);
        if (!(RL.store.get(RL.key('ledger')).bestiary.pell)) out.push(`${seed}: the bestiary has no Pell`);
      }
      // the rules, each forced with the Dev setting's roll queue (RLG.dev({rolls:[...]}))
      const fresh = async () => { if (RLG.active) RLG._t.quit(); await RLG.newRun('0001-A'); const g = RLG._t.G(); g.dev = { fast: true, rolls: [] }; auto(g); g.run.job = { id: 'test', sanLost: {}, horrors: {} }; return g; };
      const F = (o) => Object.assign(RLG._t.foe('bandit'), { noQuirk: true }, o || {});
      { const g = await fresh(); const m = party[0]; m.gear.hand = 'w1'; g.auto.smart = false; party.forEach((x, i) => x.stats.DEX = i ? 1 : 18); const e0 = F({ hp: 1, dex: 2 }); g.dev.rolls = [100]; await battle([e0], {}); if (!(m.gear.w1.wear >= 1)) out.push('a fumble did not wear the weapon'); }
      { const g = await fresh(); const t = party[0]; t.gear.body = { id: 'jack', wear: 0 }; t.gear.head = null; g.auto.smart = false;
        const e = F({ dex: 99, hp: 50 }); g.dev.rolls = [1, 11]; await battle([e], {}); if (!(t.gear.body.wear >= 1) && !party.some(x => x.gear.body && x.gear.body.wear)) out.push('a crit taken while armored did not wear the body piece'); }
      { const g = await fresh(); const m = party[1]; m.hp = 1; m.ko = false; g.auto.smart = false; await (async () => { Bt = null; })();
        // a Downed merc bleeds out after 3 of their own turns
        const e = F({ hp: 200, hit: 1, dex: 1 }); party.forEach(x => { x.stats.STR = 3; }); m.hp = 0;
        const r0 = await battle([e], { setFight: true }); if (!m.dead) out.push('a Downed merc did not bleed out'); }
      { const g = await fresh(); const m = party[0]; g.dev.rolls = [99]; Bt = null; RLG._t.G().run.job = { id: 'x', sanLost: {}, horrors: {} };
        // a lasting injury: CON roll fails (99), then 1d12 + mods
        m.stats.CON = 5; await injuryRoll(m, {}); if (!(m.inj && m.inj.length) && !m.dead) out.push('a failed CON roll gave no lasting injury'); }
      { const g = await fresh(); const e = F({ hp: 40, nerve: 'Skittish' }); g.dev.rolls = [1, 1, 1, 1, 1, 1, 1]; g.auto.smart = false;
        // breaking: a big hit past the 75% line with a forced break
        await battle([e], {}); if (!(G.lastStats.yielded.length || G.lastStats.killed.length)) out.push('nothing broke or died'); }
      { const g = await fresh(); const s0 = party.map(m => m.san).join();
        await battle([F({ kind: 'Unnatural', horror: { tier: 'Severe', id: 'test' }, hp: 1, name: 'Thing' })], {}); if (party.map(m => m.san).join() === s0) out.push('horror on sight cost no SAN'); }
      { const g = await fresh(); const m = party[2]; m.san = 1; g.dev.rolls = [99, 99, 99, 99, 99, 99];
        await sanRoll('Severe', 'violence', { who: [m] }); if (!m.dead) out.push('0 SAN out of a fight did not take the merc'); }
      { const g = await fresh(); const m = party[0]; m.san = m.bp + 2; g.dev.rolls = [99, 99]; await sanRoll('Severe', 'unnatural', { who: [m] }); if (!(m.dis && m.dis.length) && m.mot.length === 2) out.push('a Breaking Point took nothing'); }
      { const g = await fresh(); const r = g.run; r.contracts.push({ id: 'owl', title: 'X', pay: 25 }); party.forEach(m => m.xp = 90); await payScreen('owl', {}); if (!party.every(m => m.lvl >= 2)) out.push('the pay screen did not level up'); }
      { const g = await fresh(); const r = g.run; addTrophy({ id: 'trophy-test', name: 'Its teeth', trophy: true, unnatural: true }); const p0 = r.purse;
        g.auto.menu = (items, o) => { const L = items.map(x => x.label || x); return o && /CHURCH|CHAPEL/.test(o.title || '') ? (g.done ? L.indexOf('Leave') : (g.done = 1, L.findIndex(x => /burned/.test(x)))) : 0; };
        await PLACES.church('harrow', 'The chapel'); if (r.purse !== p0 + 5) out.push('the church paid ' + (r.purse - p0) + ' for an unnatural trophy'); }
      // the bestiary survives a wipe and a new run
      { const L = RL.store.get(RL.key('ledger')); if (RLG.active) RLG._t.quit(); localStorage.removeItem(RL.key('run')); await RLG.newRun('0002-B');
        if (!RL.store.get(RL.key('ledger')).bestiary.pell) out.push('the bestiary did not survive a new run'); }
      RLG._t.G().auto = null; RLG._t.G().dev = {}; return out;
    });
    bad.push(...res, ...errors);
    console.log(`${bad.length ? 'FAIL' : 'ok  '} spec 006 D1: Pell's job on 3 seeds, and each rule forced (wear, Downed, injuries, breaking, horror, 0 SAN, Breaking Points, pay and levels, trophies, the bestiary)`);
    bad.forEach(p => console.log('     - ' + p)); failed += bad.length;
    await ctx.close();
  }

  // 11. spec 006 D2: every job on 3 seeds and every ending, the Signs list to 3 without the strange sign, one job by keys
  {
    const bad = [];
    const ctx = await browser.newContext({ viewport: { width: 375, height: 667 }, hasTouch: true });
    const page = await ctx.newPage(); const errors = [];
    page.on('pageerror', e => errors.push('page error: ' + e.message));
    await page.goto(url); await page.waitForTimeout(500);
    const play = async (seed, id, pref, extra) => page.evaluate(async ([seed, id, pref, extra]) => {
      if (RLG.active) RLG._t.quit(); await RLG.newRun(seed); const g = RLG._t.G(), r = g.run; g.dev = { fast: true, noevents: true };
      const want = new RegExp(pref || '^$');
      g.auto = { cmd: () => 0, list: (t, rows) => Math.max(0, rows.findIndex(x => !x.dis)), smart: true, yield: (e, rows) => { const i = rows.findIndex(x => want.test(x.label)); return i >= 0 && !rows[i].dis ? i : 0; }, choice: () => 0, said: [],
        menu: (items) => { const L = items.map(x => x.label || x); let i = L.findIndex(x => want.test(x)); if (i >= 0 && !items[i].dis) return i; i = L.findIndex(x => /^Take it|^Set out|^Go on|^Stay$|^Eat/.test(x)); if (i >= 0) return i;
          if (L.includes('Leave it')) { i = items.findIndex(x => !x.dis && !/^\s*SELECT/.test(x.label || x)); if (i >= 0 && L[i] !== 'Leave it') return i; } i = L.findIndex(x => /^Leave/.test(x)); return i >= 0 ? i : 0; } };
      r.purse = 80; party.forEach(m => { m.lvl = 2; m.mhp += 1; m.hp = m.mhp; }); party[0].slots.push({ id: 'manacles', n: 1 });
      if (extra === 'muffle') party[0].sk.Craft = 60;
      if (!r.boards.posted.includes(id)) r.boards.posted.push(id); await takeJob(id);
      if (id === 'wool') { await march('ebbe'); const c = r.contracts.find(c => c.id === 'wool'); return { done: !!c.done, purse: r.purse }; }
      await march(JOBS[id].site); const job = r.job; if (!job) return { err: 'no site' };
      const order = extra === 'pitlast' ? job.chunks.map((c, i) => i).reverse() : job.chunks.map((c, i) => i);
      for (let pass = 0; pass < 5 && r.job; pass++) for (const c of order) { if (!r.job) break; if (job.chunk !== c) enterChunk(c, 'left'); drawWorld(); const M = G.M;
        for (const h of M.hot) { if (!r.job) break; if (h.when && !h.when(job)) continue; await hotspot(h); }
        for (const f of M.fights) { if (!r.job) break; if (f.when && !f.when(job)) continue; if (!job.fights[f.id]) await siteFight(f); } }
      if (r.job && r.job.resolved && r.contracts.find(c => c.id === id).payAt) { await leaveSite(); await march(r.contracts.find(c => c.id === id).payAt); }
      return { done: !!(r.contracts.find(c => c.id === id) || {}).done, left: !!r.job, ending: job.ending || '', signs: RG().signs.slice(), purse: r.purse, said: g.auto.said.slice(-3).join(' | ') };
    }, [seed, id, pref, extra]);
    for (const seed of ['0001-A', '4242-C', '9021-M']) for (const id of ['hag', 'wool', 'noon', 'owl', 'counter']) {
      const r = await play(seed, id, '', id === 'counter' ? 'pitlast' : '');
      if (!r.done) bad.push(`${seed}: ${id} did not finish (${JSON.stringify(r).slice(0, 160)})`);
    }
    // every ending: Pell's four, the Hag's four ways and the fight, the wool buyer's purse choices, Severa by day and by night
    for (const [id, pref, extra] of [['pell', 'Let him go'], ['pell', 'Bind'], ['pell', 'Rob'], ['pell', 'Kill'],
      ['hag', 'Turn them in|Unmask'], ['hag', 'Take a cut|Unmask'], ['hag', 'Sell the guild|Unmask'], ['hag', '^Fight'],
      ['owl', 'CLIMB'], ['owl', 'ASK FOR THE SMOCK'], ['counter', 'MUFFLE', 'muffle']]) {
      const r = await play('0001-A', id, pref, extra || (id === 'counter' ? 'pitlast' : ''));
      if (!r.done) bad.push(`ending ${id} / ${pref}: not reached (${JSON.stringify(r).slice(0, 160)})`);
    }
    // the Signs list reaches 3 on every seed without the strange sign: the Noonwife's miner, the Counter's lamp room, the tavern rumor
    for (const seed of ['0001-A', '4242-C', '9021-M']) {
      const n = await page.evaluate(async seed => { const g = RLG._t.G(); let signs = []; return signs; }, seed);
      const a = await play(seed, 'noon', ''), b = await page.evaluate(() => RG().signs.length);
      const s3 = await page.evaluate(async () => { const r = RLG._t.G().run, g = RLG._t.G(); const keep = RG().signs.slice();
        if (!r.boards.posted.includes('counter')) r.boards.posted.push('counter'); await takeJob('counter'); await march('crook'); const job = r.job;
        for (let c = 1; c < job.chunks.length; c++) { enterChunk(c, 'left'); for (const h of G.M.hot) if (h.id === 'lamp') await hotspot(h); }
        r.purse += 30; while (r.rumors.bought < r.rumors.order.length && !RG().signs.includes('CR-MONK-SIGN-2') && RG().signs.length < 3) await buyRumor();
        return { n: RG().signs.length, strange: !!RG().signStrange, den: denFound() }; });
      if (s3.n < 3 || s3.strange || !s3.den) bad.push(`seed ${seed}: the Signs list reached ${s3.n} (strange sign ${s3.strange}, den shown ${s3.den})`);
    }
    // one job by the keys: Severa by day, walked to the loft and climbed with A, the fight by A
    { const ok = await page.evaluate(async () => { if (RLG.active) RLG._t.quit(); await RLG.newRun('0001-A'); const r = RLG._t.G().run; RLG._t.G().dev = { fast: true };
        if (!r.boards.posted.includes('owl')) r.boards.posted.push('owl'); await takeJob('owl'); RG().at = 'sallow'; scout('sallow'); run(() => startSite('owl')); return 1; });
      await page.waitForTimeout(600); await page.evaluate(() => { enterChunk(1, 'left'); G.x = 7; G.y = 4; G.px = 112; G.py = 64; G.dir = 'up'; return 1; });
      await page.waitForTimeout(300); await page.keyboard.press('z'); await page.waitForTimeout(500);
      for (let i = 0; i < 400; i++) { const st = await page.evaluate(() => ({ job: !!RLG._t.G().run.job, bt: !!RLG._t.Bt(), menu: !document.getElementById('gmenu').hidden })); if (!st.job) break; await page.keyboard.press('z'); await page.waitForTimeout(40); }
      if (await page.evaluate(() => !!RLG._t.G().run.job)) bad.push('Severa by the keys did not finish'); }
    // the bestiary keeps every piece through a forced wipe and a new run
    { const r = await page.evaluate(async () => { const L0 = JSON.stringify(RL.store.get(RL.key('ledger')).bestiary); RLG._t.G().auto = { menu: () => 0, cmd: () => 0, list: () => 0 }; await wipe(); RLG._t.G().auto = null; await RLG.newRun('0003-C'); return L0 === JSON.stringify(RL.store.get(RL.key('ledger')).bestiary); });
      if (!r) bad.push('the bestiary changed through a wipe and a new run'); }
    await page.evaluate(() => { const g = RLG._t.G(); g.auto = null; g.dev = {}; });
    bad.push(...errors);
    console.log(`${bad.length ? 'FAIL' : 'ok  '} spec 006 D2: the five jobs on 3 seeds, every ending, the Signs list to 3, a job by the keys, the bestiary through a wipe`);
    bad.forEach(p => console.log('     - ' + p)); failed += bad.length;
    await ctx.close();
  }
  await browser.close();
  console.log(failed ? `\n${failed} problem(s) found.` : '\nAll automatic checks passed.');
  process.exit(failed ? 1 : 0);
})();
