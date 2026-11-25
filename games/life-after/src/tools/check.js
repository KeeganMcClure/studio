// Automatic checks for Life After (spec 001, 1: the studio's usual checks, plus part A's Done when).
// Runs the bundled build (dist/index.html) and checks:
//   1. at 320 x 480, 375 x 550 and 375 x 667: it loads with no errors and no blank screen, every button (D-pad, A, B,
//      L, R, Select, Start) is fully on screen and takes taps, 600 random presses throw no errors, and after a reload
//      whatever the game saved still loads with no errors
//   2. new worlds from 3 fixed seeds
//   3. part A: every template and Blank start a world, the builder's rules hold, the same seed and choices give the
//      same survivor, reopening puts you back, the save code round trip, a bad code, the screens by D-pad and by tap
//   4. every save in test-saves/ opens (older versions upgrade and land in the town)
//   6. part B (spec 002, Done when): the same seed makes the same town; 3 seeds give two sections of 15 to 20 places,
//      every place reachable on foot, joined by the road; every action costs its time; menus stop the clock; night is
//      dark but readable at every size, with the flashlight and neon; locks; the town's state survives a reload; and
//      a survivor plays 7 days of looting without breaking, by which time most of the houses section is looted
//   5. the contact sheet: every survivor sprite in every frame and every portrait mood, in one image
//      (art-style.md, Animation: Keegan reviews the sheet), saved as dist/contact-sheet.png
// Still needs a person: playing it on the phone, text and typos, the look side by side with the mockups.
// Usage: node tools/build.js && node tools/check.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const url = 'file://' + path.join(__dirname, '..', 'dist', 'index.html');
const SIZES = [[320, 480], [375, 550], [375, 667]];
const BUTTONS = ['[data-pad=up]', '[data-pad=down]', '[data-pad=left]', '[data-pad=right]', '#bA', '#bB', '#bL', '#bR', '#bSel', '#bStart'];
const SEEDS = [1, 4242, 90210];
const KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'z', 'x', 'q', 'w', 'Enter', 'Backspace'];
const TEMPLATES = ['Rita', 'Dale', 'June', 'Ray', 'Denise', 'Hank', 'Tommy', 'Kayla', 'Earl', 'Luis', 'Marcy', 'Kevin'];

let failed = 0;
const report = (name, bad) => { console.log(`${bad.length ? 'FAIL' : 'ok  '} ${name}`); bad.forEach(p => console.log('     - ' + p)); failed += bad.length; };

(async () => {
  const browser = await chromium.launch();
  async function fresh(o = {}) {
    const ctx = await browser.newContext({ viewport: { width: o.w || 375, height: o.h || 667 }, hasTouch: true });
    if (o.init) await ctx.addInitScript(o.init);
    const page = await ctx.newPage(), errors = [];
    page.on('pageerror', e => errors.push('page error: ' + e.message));
    // Google Fonts may be unreachable where the check runs; any other failed file is a problem
    page.on('console', m => { if (m.type() === 'error' && !/^Failed to load resource/.test(m.text())) errors.push('console: ' + m.text()); });
    page.on('requestfailed', r => { if (!/fonts\.(googleapis|gstatic)\.com/.test(r.url())) errors.push('failed to load: ' + r.url()); });
    page.on('dialog', d => d.dismiss());
    await page.goto(url);
    await page.waitForFunction(() => window.LAG && document.getElementById('cv').width > 0, null, { timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(400);
    return { ctx, page, errors };
  }
  const blankCanvas = page => page.evaluate(() => {
    const c = document.getElementById('cv'), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    const seen = new Set(); for (let i = 0; i < d.length; i += 4 * 97) seen.add(d[i] + ',' + d[i + 1] + ',' + d[i + 2]);
    return seen.size < 8;
  });
  // tap the middle of a tappable spot the screen drew, picked by a function of its rect
  async function tapHit(page, pickFn) {
    const p = await page.evaluate(src => { const f = eval(src); const h = LAU.hits.filter(f)[0]; return h ? [h.x + h.w / 2, h.y + h.h / 2, LAU.W, LAU.H] : null; }, pickFn);
    if (!p) return false;
    const b = await page.locator('#cv').boundingBox();
    await page.touchscreen.tap(b.x + p[0] * b.width / p[2], b.y + p[1] * b.height / p[3]);
    await page.waitForTimeout(120);
    return true;
  }

  // 1. sizes
  for (const [w, h] of SIZES) {
    const { ctx, page, errors } = await fresh({ w, h });
    const problems = [];
    if (await blankCanvas(page)) problems.push('screen is blank after loading');
    for (const sel of BUTTONS) {
      const box = await page.locator(sel).boundingBox();
      if (!box) { problems.push(`${sel} is missing`); continue; }
      if (box.x < 0 || box.y < 0 || box.x + box.width > w + 0.5 || box.y + box.height > h + 0.5) problems.push(`${sel} is cut off`);
      else await page.locator(sel).tap();
    }
    // start a world so the mashing reaches the town too
    await page.evaluate(() => LAG._t.make({ template: 'Ray', seed: 7 }));
    let seed = w * 7919 + h;
    const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
    for (let i = 0; i < 600; i++) {
      await page.keyboard.press(KEYS[Math.floor(rnd() * KEYS.length)]);
      if (i % 50 === 0) { await page.waitForTimeout(30); await page.evaluate(() => { const o = LAG._ovl; if (o && document.getElementById('ovl').classList.contains('on')) o.close(); }); }
    }
    const saved = await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('la.')));
    const canvasH = await page.evaluate(() => LAU.H);
    await page.reload();
    await page.waitForTimeout(800);
    for (let i = 0; i < 40; i++) await page.keyboard.press(KEYS[i % KEYS.length]);
    if (await blankCanvas(page)) problems.push('screen is blank after a reload');
    await page.screenshot({ path: path.join(__dirname, '..', 'dist', `check-${w}x${h}.png`) });
    report(`${w} x ${h}, canvas 240 x ${canvasH}  (saves after mashing: ${saved.join(', ') || 'none'})`, [...problems, ...errors]);
    await ctx.close();
  }

  // 2. seeds
  {
    const { ctx, page, errors } = await fresh();
    for (const s of SEEDS) {
      const r = await page.evaluate(s => { try { return LAG._t.make({ template: 'random', seed: s }); } catch (e) { return { ok: false, why: String(e) }; } }, s);
      const bad = [];
      if (!r.ok) bad.push(r.why || 'the world did not start');
      else {
        const sv = r.run.surv;
        if (!sv.name || !sv.job) bad.push('no name or job');
        if (r.run.seed !== s) bad.push('seed ' + r.run.seed);
        if (['Spring', 'Summer', 'Fall', 'Winter'].indexOf(r.run.season) < 0) bad.push('season ' + r.run.season);
      }
      report(`seed ${s}`, [...bad, ...errors.splice(0)]);
    }
    await ctx.close();
  }

  // 3. part A (spec 001, Done when)
  {
    const bad = [];
    let { ctx, page, errors } = await fresh();
    // every template and Blank start a world
    for (const t of TEMPLATES) {
      const r = await page.evaluate(t => LAG._t.make({ template: t, seed: 11 }), t);
      if (!r.ok) bad.push(`${t} did not start: ${r.why}`);
      else {
        const sv = r.run.surv;
        if (sv.name !== t) bad.push(`${t} started as ${sv.name}`);
        const need = await page.evaluate(t => { const T = LAD.TEMPLATES.find(x => x.name === t); return { good: LAD.traitSum(T.good), bad: LAD.traitSum(T.bad) }; }, t);
        if (need.good !== need.bad) bad.push(`${t}'s traits aren't balanced (${need.good} good, ${need.bad} bad)`);
        if (!sv.bag || !sv.bag.items) bad.push(`${t} has no bag`);
      }
    }
    let r = await page.evaluate(() => LAG._t.make({ template: 'blank', seed: 3 }));
    if (r.ok || r.step !== 1) bad.push('Blank with no name was let through');
    r = await page.evaluate(() => LAG._t.make({ template: 'blank', seed: 3, name: 'Pat' }));
    if (r.ok || r.step !== 2) bad.push('Blank with no job was let through');
    r = await page.evaluate(() => LAG._t.make({ template: 'blank', seed: 3, name: 'Pat', job: 'nurse' }));
    if (!r.ok) bad.push('Blank with a name and job did not start: ' + r.why);
    // trait rules
    const rules = await page.evaluate(() => [
      LAD.traitProblem(['brave'], []), LAD.traitProblem(['lightSleeper'], ['heavySleeper', 'badKnee']),
      LAD.traitProblem(['ironGut', 'kind', 'greenThumb', 'brave'], ['badKnee', 'nearsighted', 'hothead']), LAD.traitProblem(['ironGut'], ['smoker'])]);
    if (!rules[0]) bad.push('good points above bad points were allowed');
    if (!rules[1]) bad.push('two opposite traits were allowed');
    if (!rules[2]) bad.push('4 good traits were allowed');
    if (rules[3]) bad.push('a balanced pick was refused: ' + rules[3]);
    r = await page.evaluate(() => LAG._t.make({ template: 'Ray', seed: 3, good: ['brave', 'calm'] }));
    if (r.ok) bad.push('a world started with good points above bad points');
    // skills: no skill above 3, an older survivor's job skill can be 4, free points capped
    const caps = await page.evaluate(() => [LAD.skillsOf('nurse', 0, { medicine: 3 }).medicine, LAD.skillsOf('nurse', 2, { medicine: 3 }).medicine, LAD.skillsOf('trucker', 0, { fixing: 3 }).fixing, LAD.skillsOf('trucker', 2, { fixing: 3 }).fixing, LAD.skillsOf('cop', 2, { melee: 3 }).melee]);
    if (caps.join() !== '3,4,3,4,3') bad.push('skill caps came out ' + caps.join());
    r = await page.evaluate(() => LAG._t.make({ template: 'Kevin', seed: 5, randomPoints: true }));
    const spent = r.ok ? Object.values(r.run.surv.free).reduce((a, b) => a + b, 0) : -1;
    if (spent !== 3) bad.push('Random points spent ' + spent + ' points');
    // every job's main skill: 3, or 2 for the split jobs; 5 points in all
    const jobs = await page.evaluate(() => LAD.JOBS.map(j => Object.values(j.skills).reduce((a, b) => a + b, 0)));
    if (jobs.some(n => n !== 5)) bad.push('a job does not give 5 skill points: ' + jobs.join());
    // the same seed and choices make the same survivor and world, Random rows included
    const a1 = await page.evaluate(() => LAG._t.make({ template: 'random', seed: 777, randomLooks: true, randomTraits: true }));
    const a2 = await page.evaluate(() => LAG._t.make({ template: 'random', seed: 777, randomLooks: true, randomTraits: true }));
    const strip = x => JSON.stringify({ s: x.run.surv, season: x.run.season, dice: x.run.dice });
    if (!a1.ok || !a2.ok || strip(a1) !== strip(a2)) bad.push('the same seed and choices made a different survivor or world');
    // the room: walk, close and reopen, same place and survivor
    await page.evaluate(() => LAG._t.make({ template: 'June', seed: 99 }));
    await page.keyboard.press('z'); await page.waitForTimeout(100);   // close the first note
    const start = await page.evaluate(() => ({ x: LAG._t.me().x, y: LAG._t.me().y }));
    for (const k of ['ArrowRight', 'ArrowRight', 'ArrowDown']) { await page.keyboard.down(k); await page.waitForTimeout(190); await page.keyboard.up(k); await page.waitForTimeout(120); }
    const before = await page.evaluate(() => ({ x: LAG._t.me().x, y: LAG._t.me().y, name: LAG._t.S().run.surv.name, scr: LAG._t.scr() }));
    if (before.scr !== 'map') bad.push('not in the town after Start: ' + before.scr);
    if (before.x === start.x && before.y === start.y) bad.push('the survivor did not walk');
    // Select's note, the Start menu, Party, the detail page, back
    await page.keyboard.press('Backspace'); await page.waitForTimeout(80);
    await page.keyboard.press('Enter'); await page.waitForTimeout(80);
    if (await page.evaluate(() => LAG._t.menu()) !== 'menu') bad.push('Start did not open the menu');
    await page.keyboard.press('z'); await page.waitForTimeout(100);
    if (await page.evaluate(() => LAG._t.scr()) !== 'party') bad.push('Party did not open');
    await page.keyboard.press('z'); await page.waitForTimeout(100);
    if (await page.evaluate(() => LAG._t.scr()) !== 'detail') bad.push('A on the party card did not open the details');
    await page.keyboard.press('x'); await page.keyboard.press('x'); await page.waitForTimeout(100);
    if (await page.evaluate(() => LAG._t.scr()) !== 'map') bad.push('B did not come back to the town');
    await ctx.close();
    // reopen with the same storage: Continue drops you back exactly where you were
    ({ ctx, page, errors } = await fresh());
    await page.evaluate(() => LAG._t.make({ template: 'June', seed: 99 }));
    await page.keyboard.press('z');
    await page.keyboard.down('ArrowRight'); await page.waitForTimeout(190); await page.keyboard.up('ArrowRight'); await page.waitForTimeout(150);
    const pos1 = await page.evaluate(() => [LAG._t.me().x, LAG._t.me().y]);
    await page.reload(); await page.waitForTimeout(700);
    if (await page.evaluate(() => LAG._t.scr()) !== 'title') bad.push('reopening did not land on the title');
    const hasCont = await page.evaluate(() => LAG._t.S().run && LAG._t.S().run.surv.name);
    if (hasCont !== 'June') bad.push('the world was not there after reopening');
    await page.keyboard.press('ArrowDown'); await page.keyboard.press('z'); await page.waitForTimeout(150);   // Continue
    const pos2 = await page.evaluate(() => [LAG._t.scr(), LAG._t.me().x, LAG._t.me().y]);
    if (pos2[0] !== 'map' || pos2[1] !== pos1[0] || pos2[2] !== pos1[1]) bad.push(`Continue did not drop you back where you were (${pos2.join()} vs ${pos1.join()})`);
    if (await page.evaluate(() => LAG._t.note())) bad.push('the first note showed again after reopening');
    // the save code: export, start a different world, import, the first world is back
    const code = await page.evaluate(() => LAG.exportCode());
    await page.evaluate(() => LAG._t.make({ template: 'Hank', seed: 5 }));
    const okCode = await page.evaluate(c => { const o = LAG.readCode(c); if (!o) return false; LAG.applyCode(o); return LAG._t.S().run.surv.name; }, code);
    if (okCode !== 'June') bad.push('importing the code did not bring the first world back: ' + okCode);
    if (await page.evaluate(() => LAG.readCode('LA1:not a code') || LAG.readCode('RL1:eyJ9') || LAG.readCode(''))) bad.push('a bad code was accepted');
    // Import through the screens: a bad code says so and changes nothing
    await page.evaluate(() => LAG._t.go('title'));
    await page.keyboard.press('ArrowUp'); await page.keyboard.press('z'); await page.waitForTimeout(150);
    const err = await page.evaluate(() => { const o = LAG._ovl; o.field.value = 'nonsense'; o.ok(); return document.querySelector('#ovl .err').textContent; });
    if (err !== "That code didn't work.") bad.push('a bad code did not say so: ' + err);
    if (await page.evaluate(() => LAG._t.S().run.surv.name) !== 'June') bad.push('a bad code changed the world');
    await page.evaluate(() => LAG._ovl.close());
    // the whole way through by D-pad: New world, Blank, a typed name, a job, Start
    await page.evaluate(() => { LAG._t.S().run = null; localStorage.clear(); location.reload(); });
    await page.waitForTimeout(800);
    const keys = async ks => { for (const k of ks) { await page.keyboard.press(k); await page.waitForTimeout(40); } };
    await keys(['z']);                                    // New world
    if (await page.evaluate(() => LAG._t.scr()) !== 'world') bad.push('New world did not open');
    await keys(['ArrowRight']);                           // Harsh
    await keys(['w']);                                    // to the builder
    await keys(['ArrowDown', 'z']);                       // Blank
    await keys(['z']); await page.waitForTimeout(80);     // type a name
    await page.keyboard.type('Wanda'); await page.keyboard.press('Enter'); await page.waitForTimeout(80);
    await keys(['w', 'ArrowDown', 'ArrowDown', 'z']);     // Job: Mechanic
    await keys(['w', 'w', 'w', 'w']);                     // points, traits, want, looks
    await keys(['z']);                                    // Ready: Start
    if (!(await page.evaluate(() => LAG._t.ask()))) bad.push('Start did not ask first');
    if (await page.evaluate(() => LAG._t.ask() && LAG._t.ask().sel) !== 1) bad.push('the cursor did not start on Not yet');
    await keys(['ArrowUp', 'z']); await page.waitForTimeout(100);
    const made = await page.evaluate(() => { const r = LAG._t.S().run; return r && [r.surv.name, r.surv.job, r.preset, LAG._t.scr()].join(); });
    if (made !== 'Wanda,mechanic,harsh,map') bad.push('the D-pad world came out ' + made);
    // and by tap: Start menu rows, then the title's rows
    await keys(['z', 'Enter']);
    if (!(await tapHit(page, '(h)=>h.x>100&&h.y>60&&h.w<130'))) bad.push('no tappable rows in the Start menu');
    if (await page.evaluate(() => LAG._t.scr()) !== 'party') bad.push('tapping Party did not open it');
    await keys(['x']);
    await page.evaluate(() => LAG._t.go('title'));
    await page.waitForTimeout(80);
    await tapHit(page, '(h)=>h.x<20&&h.w<130&&h.h<30');
    if (await page.evaluate(() => LAG._t.scr() === 'title' && !LAG._t.ask())) bad.push('tapping New world did nothing');
    report('part A: templates, Blank, the builder rules, seeds, reopening, the save code, D-pad and tap', [...bad, ...errors]);
    await ctx.close();
  }

  // 4. test saves
  for (const f of fs.readdirSync(path.join(__dirname, '..', 'test-saves')).filter(f => f.endsWith('.json')).sort()) {
    const T = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'test-saves', f), 'utf8'));
    const { ctx, page, errors } = await fresh({ init: `(()=>{if(sessionStorage.getItem('loaded'))return;sessionStorage.setItem('loaded',1);localStorage.clear();const k=${JSON.stringify(T.keys)};for(const n in k)localStorage.setItem(n,k[n])})()` });
    await page.reload(); await page.waitForTimeout(600);
    const probs = [];
    const v = await page.evaluate(() => +localStorage.getItem('la.version'));
    if (v !== await page.evaluate(() => LAG.VERSION)) probs.push('version ' + v);
    if (T.keys['la.run']) {
      await page.evaluate(() => LAG._t.go('map')); await page.waitForTimeout(200);
      const got = await page.evaluate(() => ({ scr: LAG._t.scr(), name: LAG._t.S().run.surv.name, x: LAG._t.me().x, y: LAG._t.me().y, sec: LAG._t.S().run.town && LAG._t.S().run.town.sec, day: LAG._t.S().run.clock.day }));
      // a save from an older version upgrades: the town is built from its seed and the survivor wakes there (spec 002, Saves)
      const exp = T.version === (await page.evaluate(() => LAG.VERSION)) ? (T.expect || {}) : { name: T.expect && T.expect.name, scr: 'map', sec: 'houses', day: 1 };
      for (const k in exp) if (got[k] !== exp[k]) probs.push(`${k} is ${got[k]}, expected ${exp[k]}`);
      if (await blankCanvas(page)) probs.push('the town is blank');
    }
    report('test save: ' + f, [...probs, ...errors]);
    await ctx.close();
  }


  // 6. part B (spec 002, Done when)
  {
    const bad = [];
    let { ctx, page, errors } = await fresh();
    // the generator: same seed, same town; 3 seeds give 15 to 20 places a section, all reachable, joined by the road
    const gen = await page.evaluate(seeds => seeds.map(s => {
      const sig = T => JSON.stringify(['houses', 'strip'].map(k => { const S = T[k]; return [S.places.map(p => [p.name, p.door, p.inside.W, p.inside.H]), S.spots.map(x => [x.kind, x.x, x.y, x.items]), S.props.map(p => [p.k, p.x, p.y])]; }));
      const a = LAT.make(s, 'standard'), b = LAT.make(s, 'standard'), out = { seed: s, same: sig(a) === sig(b), secs: {} };
      ['houses', 'strip'].forEach(k => {
        const S = a[k], R = LAT.reach(S), kinds = {};
        S.places.forEach(p => kinds[p.kind] = (kinds[p.kind] || 0) + 1);
        const guns = S.spots.filter(x => ['gunCounter', 'pawnCase'].indexOf(x.kind) < 0).reduce((n, x) => n + x.items.filter(i => LAI.ITEMS[i.id].gun).length, 0);
        out.secs[k] = { places: S.places.length, kinds, reach: R, meals: S.meals, exits: S.exits.map(e => e.to), guns, brands: S.places.map(p => p.name) };
      });
      ['gentle', 'harsh'].forEach(pr => { const T = LAT.make(s, pr); out[pr] = [T.houses.meals, T.strip.meals]; });
      return out;
    }), SEEDS);
    for (const r of gen) {
      if (!r.same) bad.push(`seed ${r.seed}: the same seed made a different town`);
      for (const k of ['houses', 'strip']) {
        const x = r.secs[k];
        if (x.places < 15 || x.places > 20) bad.push(`seed ${r.seed} ${k}: ${x.places} places`);
        if (x.reach.badPlaces.length) bad.push(`seed ${r.seed} ${k}: can't reach ${x.reach.badPlaces.join(', ')}`);
        if (x.reach.badSpots.length) bad.push(`seed ${r.seed} ${k}: can't reach ${x.reach.badSpots.slice(0, 5).join(', ')}`);
        if (x.meals < 25 || x.meals > 35) bad.push(`seed ${r.seed} ${k}: ${x.meals} meals of food on Standard`);
        if (x.guns > 1) bad.push(`seed ${r.seed} ${k}: ${x.guns} guns lying around (at most 1)`);
        if (x.exits[0] !== (k === 'houses' ? 'strip' : 'houses')) bad.push(`seed ${r.seed} ${k}: the road doesn't join the sections`);
      }
      if ((r.secs.houses.kinds.home || 0) < 10) bad.push(`seed ${r.seed}: only ${r.secs.houses.kinds.home} homes`);
      if (!r.secs.houses.kinds.school || !r.secs.houses.kinds.church || !r.secs.houses.kinds.shed) bad.push(`seed ${r.seed}: the houses are missing the school, church or park shed`);
      if (!r.secs.strip.kinds.gas || !r.secs.strip.kinds.barn) bad.push(`seed ${r.seed}: the strip has no Star Fuel or Bargain Barn`);
      if (r.gentle[0] <= r.secs.houses.meals || r.harsh[0] >= r.secs.houses.meals) bad.push(`seed ${r.seed}: food doesn't follow the preset (${r.gentle[0]}, ${r.secs.houses.meals}, ${r.harsh[0]})`);
      console.log(`     seed ${r.seed}: houses ${r.secs.houses.places} places (${r.secs.houses.kinds.home} homes, ${r.secs.houses.meals} meals), strip ${r.secs.strip.places} places (${r.secs.strip.meals} meals)`);
    }
    // the clock: each action costs its time (spec 002, 3); menus stop it
    const clk = await page.evaluate(() => {
      const t = LAG._t, A = t.act, out = {};
      t.make({ template: 'Ray', seed: 4242 }); A.closeNote();
      const S = () => t.S().run, m = () => S().clock.day * 1440 + S().clock.min;
      // a step
      let m0 = m(), me = t.me(), pl = t.here(), ins = pl.inside;
      const dirs = { right: [1, 0], left: [-1, 0], down: [0, 1], up: [0, -1] };
      for (const d in dirs) { const nx = me.x + dirs[d][0], ny = me.y + dirs[d][1]; if (LAT.passIn(ins, nx, ny) && !ins.spotAt[ny * ins.W + nx]) { out.dir = d; break; } }
      // a search
      const si = pl.spots.find(i => !t.sec().spots[i].lock || t.sec().spots[i].lock < 0), sp = t.sec().spots[si];
      const adj = [[0, 1], [0, -1], [1, 0], [-1, 0]].map(d => [sp.x + d[0], sp.y + d[1], d]).find(c => LAT.passIn(ins, c[0], c[1]) && !ins.spotAt[c[1] * ins.W + c[0]] && !(c[0] >= sp.x && c[0] < sp.x + sp.w && c[1] >= sp.y && c[1] < sp.y + sp.h));
      A.at(t.S().run.town.inside, adj[0], adj[1], 0); A.face(adj[2][1] === 1 ? 'up' : adj[2][1] === -1 ? 'down' : adj[2][0] === 1 ? 'left' : 'right');
      m0 = m(); A.a(); out.search = m() - m0; out.loot = !!t.loot() || 'empty';
      m0 = m(); A.a(); out.searchAgain = m() - m0; A.takeAll();
      // travel
      A.leave(); m0 = m(); A.travel('strip', false); out.walk = m() - m0; out.sec = S().town.sec;
      m0 = m(); A.travel('houses', false); out.walkBack = m() - m0;
      return out;
    });
    if (clk.search !== 10) bad.push('searching took ' + clk.search + ' minutes, not 10');
    if (clk.searchAgain !== 0) bad.push('looking in a searched spot again cost ' + clk.searchAgain + ' minutes');
    if (clk.walk !== 180 || clk.walkBack !== 180 || clk.sec !== 'strip') bad.push(`the walk between sections took ${clk.walk} / ${clk.walkBack} minutes (${clk.sec})`);
    // a real step on the D-pad costs a minute; Start menu, party and the loot list stop the clock
    await page.keyboard.press('z'); await page.waitForTimeout(80);
    const c0 = await page.evaluate(() => LAG._t.S().run.clock.min);
    const free = await page.evaluate(() => { const t = LAG._t, me = t.me(), S = t.sec(); return ['up', 'down', 'left', 'right'].find(d => { const v = StudioMove.DIRS[d]; return LAT.passOut(S, me.x + v[0], me.y + v[1]) && !S.doorAt[(me.y + v[1]) * 60 + me.x + v[0]]; }); });
    const keyOf = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' };
    await page.keyboard.down(keyOf[free]); await page.waitForTimeout(150); await page.keyboard.up(keyOf[free]); await page.waitForTimeout(250);
    const c1 = await page.evaluate(() => LAG._t.S().run.clock.min);
    if (c1 - c0 !== 1) bad.push('a step cost ' + (c1 - c0) + ' minutes, not 1');
    await page.keyboard.press('Enter'); await page.waitForTimeout(600); await page.keyboard.press('z'); await page.waitForTimeout(600); await page.keyboard.press('x'); await page.waitForTimeout(100);
    await page.keyboard.press('q'); await page.keyboard.press('w'); await page.waitForTimeout(400);
    if (await page.evaluate(() => LAG._t.S().run.clock.min) !== c1) bad.push('opening menus moved the clock');
    // time cuts: Steady Hands halves a search, the store clerk halves it in stores
    const cuts = await page.evaluate(() => {
      const t = LAG._t, A = t.act, out = {};
      const trySearch = (o, kind) => {
        t.make(o); A.closeNote();
        const S = t.sec(), T = t.town(), secId = kind === 'home' ? 'houses' : 'strip';
        if (secId === 'strip') A.travel('strip', false);
        const Sx = t.sec(), pi = Sx.places.findIndex(p => p.kind === kind && p.lock < 0), p = Sx.places[pi];
        A.enter(pi);
        const si = p.spots.find(i => Sx.spots[i].lock < 0), sp = Sx.spots[si], ins = p.inside;
        const c = [[0, 1, 'up'], [0, -1, 'down'], [1, 0, 'left'], [-1, 0, 'right']].map(d => [sp.x + d[0], sp.y + d[1], d[2]]).find(q => LAT.passIn(ins, q[0], q[1]) && !ins.spotAt[q[1] * ins.W + q[0]]);
        A.at(pi, c[0], c[1], 0); A.face(c[2]);
        const m0 = t.S().run.clock.min; A.a(); return t.S().run.clock.min - m0;
      };
      out.steady = trySearch({ template: 'Dale', seed: 4242 }, 'home');
      out.clerkStore = trySearch({ template: 'Kevin', seed: 4242 }, 'gas');
      out.clerkHome = trySearch({ template: 'Kevin', seed: 4242 }, 'home');
      return out;
    });
    if (cuts.steady !== 5) bad.push('Steady Hands searched in ' + cuts.steady + ' minutes, not 5');
    if (cuts.clerkStore !== 5 || cuts.clerkHome !== 10) bad.push(`the clerk searched a store in ${cuts.clerkStore} and a home in ${cuts.clerkHome} minutes`);
    // locks: key, pick, force and kick each cost their time and open the lock (spec 002, 7)
    const locks = await page.evaluate(() => {
      const t = LAG._t, A = t.act, out = [];
      const one = (o, choose) => {
        t.make(o); A.closeNote(); A.leave();
        const S = t.sec(), li = S.locks.findIndex(L => L.what === 'door' && L.place >= 0);
        if (li < 0) return 'no lock';
        A.lockMenu(li); const q = t.ask(); const c = q.choices.find(x => choose.test(x.label));
        if (!c) return 'no choice like ' + choose + ' in ' + q.choices.map(x => x.label).join(' / ');
        const m0 = t.S().run.clock.min; c.run();
        return { min: t.S().run.clock.min - m0, state: t.S().run.town.locks[S.locks[li].id] || 'shut', label: c.label };
      };
      out.push(one({ template: 'Luis', seed: 90210 }, /^Force/));
      out.push(one({ template: 'Rita', seed: 90210 }, /^Kick/));
      out.push(one({ template: 'Dale', seed: 90210 }, /^Pick/));
      return out;
    });
    const [force, kick, pick] = locks;
    if (typeof force === 'string' || force.min !== 5 || force.state !== 'broken') bad.push('forcing a lock: ' + JSON.stringify(force));
    if (typeof kick === 'string' || kick.min !== 10 || kick.state !== 'broken') bad.push('kicking a door: ' + JSON.stringify(kick));
    if (typeof pick === 'string' || pick.min !== 10) bad.push('picking a lock with Steady Hands: ' + JSON.stringify(pick));
    // the town's state survives a reload: a searched spot stays searched, seen tiles stay seen, you're where you were
    await page.evaluate(() => { const t = LAG._t, A = t.act; t.make({ template: 'June', seed: 1 }); A.closeNote(); A.leave(); });
    const st1 = await page.evaluate(() => { const t = LAG._t; return { x: t.me().x, y: t.me().y, seen: t.seenTile('houses', t.me().x, t.me().y), spots: Object.keys(t.S().run.town.spots).length }; });
    await page.reload(); await page.waitForTimeout(700);
    await page.keyboard.press('ArrowDown'); await page.keyboard.press('z'); await page.waitForTimeout(200);
    const st2 = await page.evaluate(() => { const t = LAG._t; return { scr: t.scr(), x: t.me().x, y: t.me().y, seen: t.seenTile('houses', t.me().x, t.me().y), spots: Object.keys(t.S().run.town.spots).length }; });
    if (st2.scr !== 'map' || st2.x !== st1.x || st2.y !== st1.y || !st2.seen || st2.spots !== st1.spots) bad.push('the town did not come back after a reload: ' + JSON.stringify([st1, st2]));
    // 7 days of looting (spec 002, Done when): walk to each place, open it, search every spot, take what fits; wait out the dark
    const week = await page.evaluate(() => {
      const t = LAG._t, A = t.act, out = { searched: 0, places: 0 };
      t.make({ template: 'Luis', seed: 4242 }); A.closeNote();
      const run = () => t.S().run, S = t.sec();
      const bfs = (W, H, pass, sx, sy, goal) => {
        const seen = new Int32Array(W * H).fill(-1), q = [[sx, sy]]; seen[sy * W + sx] = 0;
        while (q.length) { const [x, y] = q.shift(); if (goal(x, y)) return { x, y, d: seen[y * W + x] }; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= W || ny >= H || seen[ny * W + nx] >= 0 || !pass(nx, ny)) continue; seen[ny * W + nx] = seen[y * W + x] + 1; q.push([nx, ny]); } }
        return null;
      };
      const unlock = li => { for (let k = 0; k < 4 && !run().town.locks[S.locks[li].id]; k++) { A.lockMenu(li); const q = t.ask(); (q.choices.find(c => /^Use/.test(c.label)) || q.choices.find(c => /^Pick/.test(c.label) && k < 2) || q.choices.find(c => /^Force|^Kick/.test(c.label)) || q.choices[0]).run(); } };
      const night = () => { if (t.darkness() > 0.5) { const c = run().clock; const to = c.min < 360 ? 360 - c.min : 1440 - c.min + 360; t.pass(to); } };
      // leave the wake house first, then go round the places nearest first
      const first = t.S().run.town.inside;
      const todo = S.places.map((p, i) => i);
      let guard = 0;
      while (run().clock.day < 8 && todo.length && guard++ < 200) {
        night();
        const tw = run().town;
        if (tw.inside < 0) {
          const doorTiles = {}; todo.forEach(i => { const d = S.places[i].door; doorTiles[(d.y + 1) * 60 + d.x] = i; });
          const hit = bfs(60, 60, (x, y) => LAT.passOut(S, x, y) && !S.doorAt[y * 60 + x], tw.x, tw.y, (x, y) => doorTiles[y * 60 + x] != null);
          if (!hit) break;
          const pi = doorTiles[hit.y * 60 + hit.x]; A.at(-1, hit.x, hit.y, hit.d);
          const p = S.places[pi]; if (p.lock >= 0) unlock(p.lock);
          t.pass(1); A.enter(pi);
        }
        const pi = run().town.inside, p = S.places[pi], ins = p.inside; out.places++;
        todo.splice(todo.indexOf(pi), 1);
        for (const si of p.spots) {
          const sp = S.spots[si];
          const pass = (x, y) => LAT.passIn(ins, x, y) && !(ins.doorAt[y * ins.W + x] && ins.doors[ins.doorAt[y * ins.W + x] - 1].lock >= 0 && !run().town.locks[S.locks[ins.doors[ins.doorAt[y * ins.W + x] - 1].lock].id]);
          const adj = (x, y) => [[0, 1, 'up'], [0, -1, 'down'], [1, 0, 'left'], [-1, 0, 'right']].find(d => { const ax = x - d[0], ay = y - d[1]; return ax >= sp.x && ax < sp.x + sp.w && ay >= sp.y && ay < sp.y + sp.h; });
          let hit = bfs(ins.W, ins.H, pass, run().town.x, run().town.y, (x, y) => !!adj(x, y));
          if (!hit) { // behind a locked inside door: open it, then try again
            ins.doors.forEach(d => { if (d.lock >= 0) unlock(d.lock); });
            hit = bfs(ins.W, ins.H, pass, run().town.x, run().town.y, (x, y) => !!adj(x, y));
          }
          if (!hit) continue;
          A.at(pi, hit.x, hit.y, hit.d); A.face(adj(hit.x, hit.y)[2]);
          for (let k = 0; k < 4; k++) { A.a(); if (t.ask()) { const q = t.ask(); (q.choices.find(c => /^Pick/.test(c.label)) || q.choices.find(c => /^Force/.test(c.label)) || q.choices[q.choices.length - 1]).run(); continue; } break; }
          if (run().town.spots[sp.id]) out.searched++;
          A.takeAll();
          night();
        }
        const ex = bfs(ins.W, ins.H, (x, y) => LAT.passIn(ins, x, y), run().town.x, run().town.y, (x, y) => x === ins.exit.x && y === ins.exit.y - 1);
        A.at(pi, ins.exit.x, ins.exit.y - 1, ex ? ex.d : 0); A.leave();
      }
      const looted = S.places.filter(p => run().town.marks[p.id] === 'looted').length;
      out.looted = looted; out.total = S.places.length; out.day = run().clock.day; out.clock = t.clockText(run().clock.min);
      out.bag = t.used() + '/' + t.cap(); out.hunger = Math.round(run().surv.needs.hunger); out.notes = run().surv.notes.map(n => n.id).join(',');
      return out;
    });
    console.log(`     a week of looting: ${week.looted} of ${week.total} houses places looted by day ${week.day} ${week.clock} (${week.searched} spots searched, bag ${week.bag}, notes: ${week.notes})`);
    if (week.looted < week.total * 0.6) bad.push(`only ${week.looted} of ${week.total} places looted after a week`);
    if (week.day < 2) bad.push('the week ended on day ' + week.day);
    report('part B: the generator, the clock, menus, locks, reloads and a week of looting', [...bad, ...errors]);
    await ctx.close();
  }

  // 7. day and night at every size, side by side: screenshots for the look check, and a readability check
  for (const [w, h] of SIZES) {
    const { ctx, page, errors } = await fresh({ w, h });
    const probs = [];
    const lum = () => page.evaluate(() => { const c = document.getElementById('cv'), d = c.getContext('2d').getImageData(0, 60, c.width, c.height - 60).data; let n = 0, s = 0, hi = 0; for (let i = 0; i < d.length; i += 16) { const l = (d[i] * 3 + d[i + 1] * 6 + d[i + 2]) / 10; s += l; n++; if (l > 90) hi++; } return { mean: s / n, lit: hi / n }; });
    // an ordinary street in the houses: Route 9, away from the strip's neon
    await page.evaluate(() => { const t = LAG._t, A = t.act; t.make({ template: 'Ray', seed: 4242 }); A.closeNote(); A.leave(); const S = t.sec(); A.at(-1, 30, S.highway, 0); A.face('right'); t.S().run.clock.min = 11 * 60; });
    await page.waitForTimeout(300);
    const day = await lum();
    await page.screenshot({ path: path.join(__dirname, '..', 'dist', `town-day-${w}x${h}.png`) });
    await page.evaluate(() => { const t = LAG._t; t.S().run.clock.min = 23 * 60; });
    await page.waitForTimeout(300);
    const night = await lum();
    await page.evaluate(() => LAG._t.act.toggleLight()); await page.waitForTimeout(300);
    const lit = await lum();
    await page.screenshot({ path: path.join(__dirname, '..', 'dist', `town-night-${w}x${h}.png`) });
    // and the strip's neon at night, for the look check
    await page.evaluate(() => { const t = LAG._t, A = t.act; A.travel('strip', false); const S = t.sec(), g = S.places.find(p => p.kind === 'gas'); A.at(-1, g.door.x + 6, g.door.y + 5, 0); A.face('down'); t.S().run.clock.min = 23 * 60; });
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(__dirname, '..', 'dist', `town-neon-${w}x${h}.png`) });
    if (!(night.mean < day.mean * 0.6)) probs.push(`night isn't dark (${night.mean.toFixed(0)} vs ${day.mean.toFixed(0)} by day)`);
    if (!(night.mean > 8)) probs.push(`night is too dark to read (${night.mean.toFixed(1)})`);
    if (!(lit.mean > night.mean)) probs.push('the flashlight lit nothing');
    report(`${w} x ${h}: day ${day.mean.toFixed(0)}, night ${night.mean.toFixed(0)}, flashlight ${lit.mean.toFixed(0)} (dist/town-day-, town-night-${w}x${h}.png)`, [...probs, ...errors]);
    await ctx.close();
  }

  // 8. the whole of both sections, for the review (dist/town-houses.png, dist/town-strip.png)
  {
    const { ctx, page, errors } = await fresh();
    const urls = await page.evaluate(() => { const T = LAT.make(4242, 'standard'); return ['houses', 'strip'].map(k => { const S = T[k], c = LA.townGround(S), g = c.getContext('2d');
      S.props.slice().sort((a, b) => a.y - b.y).forEach(q => { if (LA.townFlat[q.k]) return; if (q.k === 'canopy') LA.townCanopy(g, q, q.x * 16, q.y * 16, 1, false); else LA.townProp(g, S, q, q.x * 16, q.y * 16 + 16, 0, { season: 'Fall' }); });
      return c.toDataURL('image/png'); }); });
    ['houses', 'strip'].forEach((k, i) => fs.writeFileSync(path.join(__dirname, '..', 'dist', `town-${k}.png`), Buffer.from(urls[i].split(',')[1], 'base64')));
    report('town maps: dist/town-houses.png, dist/town-strip.png (seed 4242)', errors);
    await ctx.close();
  }

  // 5. the contact sheet
  {
    const { ctx, page, errors } = await fresh();
    const png = await page.evaluate(() => {
      const faces = ['down', 'right', 'up', 'left'], moods = ['ok', 'scared', 'hurt', 'tired'];
      const rows = LAD.TEMPLATES.length, cw = 12 * 20 + 4 * 68 + 20, c = document.createElement('canvas');
      c.width = cw; c.height = rows * 70 + 10;
      const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.fillStyle = '#2a3234'; g.fillRect(0, 0, c.width, c.height);
      LAD.TEMPLATES.forEach((t, i) => {
        const d = LA.dress(t.looks, LAD.job(t.job).outfit), y = 6 + i * 70;
        faces.forEach((f, fi) => [0, 1, 2].forEach(st => {
          let s = LA.person(Object.assign({ face: f === 'left' ? 'right' : f, step: st }, d));
          const x = 6 + (fi * 3 + st) * 20;
          if (f === 'left') { g.save(); g.translate(x + 18, y + 20); g.scale(-1, 1); g.drawImage(s, 0, 0); g.restore(); } else g.drawImage(s, x, y + 20);
        }));
        moods.forEach((m, mi) => g.drawImage(LA.portrait(Object.assign({ mood: m }, d)), 12 * 20 + 14 + mi * 68, y));
      });
      return c.toDataURL('image/png');
    });
    fs.writeFileSync(path.join(__dirname, '..', 'dist', 'contact-sheet.png'), Buffer.from(png.split(',')[1], 'base64'));
    report('contact sheet: dist/contact-sheet.png (12 templates, 4 facings x 3 walk frames, 4 portrait moods)', errors);
    await ctx.close();
  }

  await browser.close();
  console.log(failed ? `\n${failed} problem(s)` : '\nall checks passed');
  process.exit(failed ? 1 : 0);
})();
