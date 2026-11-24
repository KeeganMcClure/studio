// Automatic checks for Life After (spec 001, 1: the studio's usual checks, plus part A's Done when).
// Runs the bundled build (dist/index.html) and checks:
//   1. at 320 x 480, 375 x 550 and 375 x 667: it loads with no errors and no blank screen, every button (D-pad, A, B,
//      L, R, Select, Start) is fully on screen and takes taps, 600 random presses throw no errors, and after a reload
//      whatever the game saved still loads with no errors
//   2. new worlds from 3 fixed seeds
//   3. part A: every template and Blank start a world, the builder's rules hold, the same seed and choices give the
//      same survivor, reopening puts you back, the save code round trip, a bad code, the screens by D-pad and by tap
//   4. every save in test-saves/ opens
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
    // start a world so the mashing reaches the room too
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
    for (const k of ['ArrowRight', 'ArrowRight', 'ArrowDown']) { await page.keyboard.down(k); await page.waitForTimeout(190); await page.keyboard.up(k); await page.waitForTimeout(120); }
    const before = await page.evaluate(() => ({ x: LAG._t.me().x, y: LAG._t.me().y, name: LAG._t.S().run.surv.name, scr: LAG._t.scr() }));
    if (before.scr !== 'room') bad.push('not in the room after Start: ' + before.scr);
    if (before.x === 5 && before.y === 4) bad.push('the survivor did not walk');
    // Select's note, the Start menu, Party, the detail page, back
    await page.keyboard.press('Backspace'); await page.waitForTimeout(80);
    await page.keyboard.press('Enter'); await page.waitForTimeout(80);
    if (await page.evaluate(() => LAG._t.menu()) !== 'menu') bad.push('Start did not open the menu');
    await page.keyboard.press('z'); await page.waitForTimeout(100);
    if (await page.evaluate(() => LAG._t.scr()) !== 'party') bad.push('Party did not open');
    await page.keyboard.press('z'); await page.waitForTimeout(100);
    if (await page.evaluate(() => LAG._t.scr()) !== 'detail') bad.push('A on the party card did not open the details');
    await page.keyboard.press('x'); await page.keyboard.press('x'); await page.waitForTimeout(100);
    if (await page.evaluate(() => LAG._t.scr()) !== 'room') bad.push('B did not come back to the room');
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
    if (pos2[0] !== 'room' || pos2[1] !== pos1[0] || pos2[2] !== pos1[1]) bad.push(`Continue did not drop you back where you were (${pos2.join()} vs ${pos1.join()})`);
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
    if (made !== 'Wanda,mechanic,harsh,room') bad.push('the D-pad world came out ' + made);
    // and by tap: Start menu rows, then the title's rows
    await keys(['z', 'Enter']);
    if (!(await tapHit(page, '(h)=>h.x>100&&h.y>60&&h.w<120'))) bad.push('no tappable rows in the Start menu');
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
      await page.evaluate(() => LAG._t.go('room')); await page.waitForTimeout(200);
      const got = await page.evaluate(() => ({ scr: LAG._t.scr(), name: LAG._t.S().run.surv.name, x: LAG._t.me().x, y: LAG._t.me().y }));
      for (const k in (T.expect || {})) if (got[k] !== T.expect[k]) probs.push(`${k} is ${got[k]}, expected ${T.expect[k]}`);
    }
    report('test save: ' + f, [...probs, ...errors]);
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
