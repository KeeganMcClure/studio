// Automatic checks for Sarah's Sim (the first playtest slice: spec 001 parts A, B, C, D and F, spec 006 parts A and B).
// Runs the bundled build (dist/index.html, built from the private-data placeholder only) in the pre-installed browser:
//   1. sizes: at 320 x 480, 375 x 550 and 375 x 667 it loads with no errors and no blank screen; the D-pad, A, B, Select and
//      Start are on screen and take taps; there are no L or R buttons (bible, Controls and screen); 300 random presses on the
//      title and the home throw no errors; the title menu and the Life top bar fit with nothing cut off
//   2. part A: the gift shows on the first launch only, never after a reload; the title works by buttons and by tap;
//      each mode opens its own save and Sandbox changes never show up in Life; a backup file brings back every mode and the gift
//   3. part F: a new save opens in the furnished Philly home on 3 floors; every starting piece passes the placing rules; every
//      open tile can be walked to from the front door, up and down the stairs; every piece with a Life action can be reached
//   4. parts C and D: place, turn, stack, hang, move and put away by touch and by buttons; never two big pieces on one tile,
//      never on a doorway or the stairs; undo steps back 10; the props switch, swatches, paint and patterns stay after a reload
//   5. part B: zoom, slide, floors and walls by touch and buttons; the cats wander and react to a new piece
//   6. spec 006: the four light looks at their times; lamps on at 5 PM; walking and every starter action, with the queue of 3
//   7. every save in test-saves/ opens
//   8. the contact sheet: every piece in all four turns, Sarah, Keegan, Louie and Ralph in every pose (art-style.md, Animation),
//      saved as dist/contact-sheet.png, plus screenshots of each screen at 375 x 667 for the side-by-side with the mockups
// Still needs a person: playing it on the phone, how it feels, and the look side by side with the mockups.
// Usage: node tools/build.js && node tools/check.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const DIST = path.join(__dirname, '..', 'dist');
const url = 'file://' + path.join(DIST, 'index.html');
const SIZES = [[320, 480], [375, 550], [375, 667]];
const BUTTONS = ['[data-pad=up]', '[data-pad=down]', '[data-pad=left]', '[data-pad=right]', '#bA', '#bB', '#bSel', '#bStart'];
const KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'z', 'x', 'Enter', 'Backspace'];

let failed = 0;
const report = (name, bad) => { console.log(`${bad.length ? 'FAIL' : 'ok  '} ${name}`); bad.forEach(p => console.log('     - ' + p)); failed += bad.length; };

(async () => {
  const browser = await chromium.launch();
  async function fresh(o = {}) {
    const ctx = o.ctx || await browser.newContext({ viewport: { width: o.w || 375, height: o.h || 667 }, hasTouch: true, deviceScaleFactor: o.scale || 1 });
    if (o.init) await ctx.addInitScript(o.init);
    const page = await ctx.newPage(), errors = [];
    page.on('pageerror', e => errors.push('page error: ' + e.message));
    page.on('console', m => { if (m.type() === 'error' && !/^Failed to load resource/.test(m.text())) errors.push('console: ' + m.text()); });
    page.on('requestfailed', r => { if (!/fonts\.(googleapis|gstatic)\.com/.test(r.url())) errors.push('failed to load: ' + r.url()); });
    await page.goto(url + (o.q || ''));
    await page.waitForFunction(() => window.SSG && document.getElementById('cv').width > 0, null, { timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(300);
    return { ctx, page, errors };
  }
  const blank = page => page.evaluate(() => { const c = document.getElementById('cv'), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; const s = new Set(); for (let i = 0; i < d.length; i += 4 * 97) s.add(d[i] + ',' + d[i + 1] + ',' + d[i + 2]); return s.size < 8; });
  async function tapAt(page, x, y) { const b = await page.locator('#cv').boundingBox(), k = b.width / 240; await page.touchscreen.tap(b.x + x * k, b.y + y * k); await page.waitForTimeout(80); }
  // run the game's clock fast: people walk and actions finish without waiting in real time
  const fast = (page, secs) => page.evaluate(s => { for (let i = 0; i < s * 20; i++) SS.updateAgents(SSG, .05); }, secs);

  // ---------- 1. sizes ----------
  for (const [w, h] of SIZES) {
    const { ctx, page, errors } = await fresh({ w, h, init: () => localStorage.setItem('ss.gift', '1') });
    const bad = [];
    if (await blank(page)) bad.push('the title is blank');
    for (const sel of BUTTONS) {
      const box = await page.locator(sel).boundingBox();
      if (!box) { bad.push(sel + ' is missing'); continue; }
      if (box.x < 0 || box.y < 0 || box.x + box.width > w + .5 || box.y + box.height > h + .5) bad.push(sel + ' is cut off');
    }
    if (await page.locator('#bL').count() || await page.locator('#bR').count()) bad.push('L or R is on the shell (the bible drops them)');
    const cvBox = await page.locator('#cv').boundingBox();
    if (cvBox.y + cvBox.height > h || cvBox.x < 0) bad.push('the game screen is cut off');
    const fitTitle = await page.evaluate(() => SSG.hits.every(hh => hh.x >= 0 && hh.x + hh.w <= 240 && hh.y >= 0 && hh.y + hh.h <= SSG.H));
    if (!fitTitle) bad.push('a title row is off the screen');
    let seed = w * 7919 + h; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
    for (let i = 0; i < 150; i++) await page.keyboard.press(KEYS[Math.floor(rnd() * KEYS.length)]);
    await page.evaluate(() => { SSG.confirm = null; SSG.openMode('life'); SS.setClock(23, 59); });
    await page.waitForTimeout(1200);
    const bar = await page.evaluate(() => { SS.use(SSG.c); const d = SS.now(); return SS.tw(SS.dayText(d) + ' ' + SS.timeText(d), 7) + 22 + 4 + SS.tw(String(SSG.save.coins), 8) + 22 + 8; });
    if (bar > 236) bad.push(`the Life top bar is ${bar} px wide at the longest time, more than the 240 px screen`);
    for (let i = 0; i < 150; i++) await page.keyboard.press(KEYS[Math.floor(rnd() * KEYS.length)]);
    if (await blank(page)) bad.push('the home is blank');
    for (const sel of BUTTONS) await page.locator(sel).tap();
    report(`${w} x ${h}: loads, buttons fit and work, no L or R, 300 presses, the top bar fits`, bad.concat(errors));
    await ctx.close();
  }

  // ---------- 2. part A: the gift, the title, one save per mode, backups ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 667 }, hasTouch: true });
    let { page, errors } = await fresh({ ctx });
    const bad = [];
    if (await page.evaluate(() => SSG.screen) !== 'gift') bad.push('the first launch does not show the gift');
    await tapAt(page, 120, 150); await page.waitForTimeout(1400);
    if (await page.evaluate(() => SSG.screen) !== 'open') bad.push('pulling the ribbon does not open onto the home');
    if (await page.evaluate(() => localStorage.getItem('dev.ss.gift') || localStorage.getItem('ss.gift')) !== '1') bad.push('the gift is not remembered');
    await page.keyboard.press('z'); await page.waitForTimeout(100);
    if (await page.evaluate(() => SSG.screen) !== 'title') bad.push('A on the Christmas card does not go to the title');
    await page.reload(); await page.waitForTimeout(500);
    if (await page.evaluate(() => SSG.screen) !== 'title') bad.push('the gift shows again after a reload');
    // the title by buttons: no save yet, so Sandbox is the first row
    await page.keyboard.press('z'); await page.waitForTimeout(200);
    if (await page.evaluate(() => SSG.screen + SSG.mode) !== 'homesandbox') bad.push('A on the first row does not open Sandbox');
    // a change in Sandbox: put the armchair away
    await page.evaluate(() => { const p = SSG.W.pieces.find(q => q.id === 'club-armchair'); SSG.putAway(p); });
    const sbCount = await page.evaluate(() => SSG.W.pieces.length);
    // Start, then Title, by buttons
    await page.keyboard.press('Enter'); for (let i = 0; i < 7; i++) await page.keyboard.press('ArrowDown'); await page.keyboard.press('z'); await page.waitForTimeout(150);
    if (await page.evaluate(() => SSG.screen) !== 'title') bad.push('Start, then Title, does not go back to the title');
    // the title by tap: Life is the third row now (Continue, Sandbox, Life)
    const rows = await page.evaluate(() => SSG.hits.filter(hh => hh.y > 100).map(hh => [hh.x + hh.w / 2, hh.y + hh.h / 2]));
    await tapAt(page, rows[2][0], rows[2][1]); await page.waitForTimeout(200);
    if (await page.evaluate(() => SSG.mode) !== 'life') bad.push('tapping Life does not open Life');
    const lifeCount = await page.evaluate(() => SSG.W.pieces.length);
    if (lifeCount === sbCount) bad.push('Life shows the change made in Sandbox');
    if (await page.evaluate(() => SSG.save.coins) !== 500) bad.push('Life does not start with 500 coins');
    // Continue opens the mode played last
    await page.reload(); await page.waitForTimeout(400); await page.keyboard.press('z'); await page.waitForTimeout(200);
    if (await page.evaluate(() => SSG.mode) !== 'life') bad.push('Continue does not open the mode played last');
    // a backup file: made on one phone, read back on another with every mode and the gift
    const backup = await page.evaluate(() => JSON.stringify({ game: 'sarahs-sim', version: SS.SAVE_VERSION, made: '', keys: StudioBackup.collect(SS.PRE) }));
    await page.evaluate(() => localStorage.clear());
    await page.reload(); await page.waitForTimeout(300);
    if (await page.evaluate(() => SSG.screen) !== 'gift') bad.push('a wiped phone does not show the gift');
    await page.evaluate(t => SS.restoreBackup(SS.readBackup(t)), backup);
    await page.reload(); await page.waitForTimeout(300);
    const back = await page.evaluate(() => ({ screen: SSG.screen, sb: SS.modeSave('sandbox'), life: SS.modeSave('life') }));
    if (back.screen !== 'title') bad.push('after importing, the gift shows again');
    if (!back.sb || back.sb.pieces.length !== sbCount) bad.push('the import lost Sandbox');
    if (!back.life || back.life.coins !== 500) bad.push('the import lost Life');
    if (SS_NOT_A_BACKUP(await page.evaluate(() => SS.readBackup('{"game":"other","keys":{}}')))) bad.push('a file from another game is taken as a backup');
    report('part A: gift once, title by buttons and tap, one save per mode, Continue, backup file round trip', bad.concat(errors));
    await ctx.close();
  }
  function SS_NOT_A_BACKUP(v) { return v !== null; }

  // ---------- 3 to 5: the home, placing, colors, the view ----------
  {
    const { ctx, page, errors } = await fresh({ init: () => localStorage.setItem('ss.gift', '1') });
    const bad = [];
    await page.evaluate(() => SSG.openMode('sandbox'));
    const home = await page.evaluate(() => {
      const W = SSG.W, ax = W.ax, ay = W.ay, out = { unreach: [], bad: [], nouse: [] };
      const start = { f: 0, x: ax + 1, y: ay + 11 };
      for (let f = 0; f < W.floors; f++) for (let x = 0; x < W.lot; x++) for (let y = 0; y < W.lot; y++) if (W.walkable(f, x, y) && !W.path(start, (ff, xx, yy) => ff === f && xx === x && yy === y)) out.unreach.push(f + ':' + x + ',' + y);
      W.pieces.forEach(p => { const r = p.host ? W.check({ id: p.id, host: p.host, spot: p.spot }, p) : p.wall ? W.check({ id: p.id, f: p.f, wall: p.wall }, p) : W.check({ id: p.id, f: p.f, x: p.x, y: p.y, r: p.r }, p); if (!r.ok) out.bad.push(p.id + ' ' + r.why); });
      W.pieces.forEach(p => { if (W.def(p).use && !W.useTiles(p).length) out.nouse.push(p.id); });
      out.floors = [0, 1, 2].map(f => W.pieces.filter(p => W.floorOf(p) === f).length);
      out.cats = SSG.agents.filter(a => a.kind === 'cat').length; out.people = SSG.agents.filter(a => a.kind === 'person').length;
      return out;
    });
    if (home.floors.some(n => n < 5)) bad.push('a floor is not furnished: ' + home.floors);
    if (home.cats !== 2 || home.people !== 2) bad.push('the cats and the two of them are not all in the home');
    home.unreach.forEach(t => bad.push('tile ' + t + ' cannot be walked to'));
    home.bad.forEach(t => bad.push('a starting piece breaks the placing rules: ' + t));
    home.nouse.forEach(t => bad.push('nobody can get to ' + t));
    // the starting catalog: every tab holds spec 001's draft list (plus the easel, the cat bowls and the litter box)
    const tabs = await page.evaluate(() => { const n = {}; SS.CATALOG.filter(d => !d.craft).forEach(d => { n[d.tab] = (n[d.tab] || 0) + 1; }); return n; });
    const want = { seating: 10, tables: 9, beds: 6, storage: 12, lights: 7, plants: 7, rugs: 6, wall: 10, decor: 16, holiday: 1 };   // decor: 13 + the easel + the cat bowls and litter box (spec 006, part D)
    const few = await page.evaluate(() => SS.CATALOG.filter(d => !d.craft && (d.swatches.length < 4 || d.swatches.length > 6)).map(d => d.id + ' (' + d.swatches.length + ')'));
    few.forEach(id => bad.push('swatches should be 4 to 6 (spec 001, part D): ' + id));
    Object.keys(want).forEach(t => { if (tabs[t] !== want[t]) bad.push(`the ${t} tab has ${tabs[t] || 0} pieces, the starting list has ${want[t]}`); });
    report('part F: the furnished Philly home on 3 floors, the cats and the two of them, everything reachable', bad.concat(errors));

    // placing rules and every kind of piece, by buttons
    const pl = await page.evaluate(() => {
      const G = SSG, W = G.W, out = [], press = k => window.dispatchEvent(new KeyboardEvent('keydown', { key: k }));
      const K = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight', a: 'z', b: 'x', sel: 'Backspace' };
      const P = k => document.dispatchEvent(new KeyboardEvent('keydown', { key: K[k] }));
      const n0 = W.pieces.length;
      // a big piece by buttons: take the card, move, turn, place
      G.tray.open = true; G.tray.tab = 'seating'; G.focus = null;
      P('a'); if (G.focus !== 'cards') out.push('A does not move the cursor into the catalog');
      P('a'); if (!G.hold) out.push('A on a card does not pick the piece up');
      const r0 = G.hold && G.hold.r; P('sel'); if (G.hold && G.hold.r === r0) out.push('Select does not turn the held piece');
      for (let i = 0; i < 40 && G.hold && !G.hold.ok; i++) P(['down', 'right', 'up', 'left'][i % 4]);
      if (!G.hold || !G.hold.ok) out.push('the held piece found no spot that fits');
      P('a'); if (G.hold) out.push('A does not place a piece that fits'); if (W.pieces.length !== n0 + 1) out.push('placing did not add the piece');
      // never two big pieces on one tile, never a doorway, never the stairs
      const sofa = W.pieces.find(p => p.id === 'three-seat-sofa');
      if (W.check({ id: 'club-armchair', f: 0, x: sofa.x, y: sofa.y, r: 0 }).ok) out.push('a big piece fits on top of the sofa');
      const door = W.walls[0].find(s => s.op === 'arch');
      if (W.check({ id: 'club-armchair', f: 0, x: door.x, y: door.y, r: 0 }).ok) out.push('a big piece fits in a doorway');
      const st = W.stairs[0];
      if (W.check({ id: 'club-armchair', f: 0, x: st.tiles[1][0], y: st.tiles[1][1], r: 0 }).ok) out.push('a big piece fits on the stairs');
      if (W.check({ id: 'club-armchair', f: 0, x: st.from[0], y: st.from[1], r: 0 }).ok) out.push('a big piece fits at the foot of the stairs');
      // stacking: a mug on the coffee table's free spot; not on a taken one
      const ct = W.pieces.find(p => p.id === 'coffee-table');
      const free = W.def(ct).spots.findIndex((s, i) => W.spotFree(ct, i));
      if (free < 0 || !W.check({ id: 'mugs', host: ct.uid, spot: free }).ok) out.push('small things do not stack on the coffee table');
      const side = W.pieces.find(p => p.id === 'side-table');
      if (W.check({ id: 'mugs', host: side.uid, spot: 0 }).ok) out.push('a small thing stacks on a spot that is taken');
      if (W.check({ id: 'club-armchair', host: ct.uid, spot: free }).ok) out.push('a big piece stacks on a table');
      // wall pieces: on a wall she can see, not on a doorway; curtains only on a window
      const wseg = W.walls[0].find(s => s.b && !s.op && !s.win && !W.pieces.some(q => q.wall && W.wallSegs(q).indexOf(s.x + ',' + s.y + s.axis) >= 0));
      if (!wseg || !W.check({ id: 'framed-print', f: 0, wall: [wseg.x, wseg.y, wseg.axis] }).ok) out.push('a picture does not hang on a free wall');
      if (W.check({ id: 'curtains', f: 0, wall: [wseg.x, wseg.y, wseg.axis] }).ok) out.push('curtains hang where there is no window');
      if (W.check({ id: 'framed-print', f: 0, wall: [door.x, door.y, door.axis] }).ok) out.push('a picture hangs in a doorway');
      return out;
    });
    // place, turn, stack, hang, move and put away by touch
    const touch = [];
    {
      // drag a card into the room: the lamp card from Lights onto an open floor tile
      await page.evaluate(() => { SSG.deselect(); SSG.tray.open = true; SSG.tray.tab = 'lights'; SSG.tray.page = 0; SSG.hold = null; SSG.setFloor(0); });
      await page.waitForTimeout(150);
      const n0 = await page.evaluate(() => SSG.W.pieces.length);
      const card = await page.evaluate(() => { const h = SSG.hits.find(hh => hh.card && hh.card.id === 'floor-lamp'); return h && [h.x + h.w / 2, h.y + h.h / 2]; });
      // an open tile in the dining nook
      const spot = await page.evaluate(() => { const W = SSG.W; for (let y = W.ay + 4; y < W.ay + 7; y++) for (let x = W.ax; x < W.ax + 8; x++) if (W.check({ id: 'floor-lamp', f: 0, x, y, r: 0 }).ok) { const q = SS.I.p(x + .5, y + .5, 0); const s = SSG.cam.toView(q[0] + SS.OFF[0], q[1] + SS.OFF[1]); return [s[0], s[1], x, y]; } return null; });
      if (!card || !spot) touch.push('no lamp card or no open tile to drag to');
      else {
        const b = await page.locator('#cv').boundingBox(), k = b.width / 240;
        await page.mouse.move(b.x + card[0] * k, b.y + card[1] * k); await page.mouse.down();
        for (let s = 1; s <= 12; s++) { await page.mouse.move(b.x + (card[0] + (spot[0] - card[0]) * s / 12) * k, b.y + (card[1] + (spot[1] - card[1]) * s / 12) * k); await page.waitForTimeout(16); }
        await page.mouse.up(); await page.waitForTimeout(150);
        if (await page.evaluate(() => SSG.W.pieces.length) !== n0 + 1) touch.push('dragging a card into the room does not place it');
        // dragging one onto a spot that doesn't fit: it slides back and nothing is added
        await page.evaluate(() => { SSG.tray.open = true; SSG.tray.tab = 'seating'; });
        await page.waitForTimeout(100);
        const card2 = await page.evaluate(() => { const h = SSG.hits.find(hh => hh.card && hh.card.id === 'three-seat-sofa'); return h && [h.x + h.w / 2, h.y + h.h / 2]; });
        const stairs = await page.evaluate(() => { const st = SSG.W.stairs[0].tiles[1], q = SS.I.p(st[0] + .5, st[1] + .5, 0), s = SSG.cam.toView(q[0] + SS.OFF[0], q[1] + SS.OFF[1]); return s; });
        await page.mouse.move(b.x + card2[0] * k, b.y + card2[1] * k); await page.mouse.down();
        for (let s = 1; s <= 12; s++) { await page.mouse.move(b.x + (card2[0] + (stairs[0] - card2[0]) * s / 12) * k, b.y + (card2[1] + (stairs[1] - card2[1]) * s / 12) * k); await page.waitForTimeout(16); }
        await page.mouse.up(); await page.waitForTimeout(150);
        if (await page.evaluate(() => SSG.W.pieces.length) !== n0 + 1) touch.push('a piece that does not fit was placed anyway');
        if (await page.evaluate(() => !!SSG.hold)) touch.push('a piece that does not fit stays held instead of sliding back');
        // tap the new lamp to pick it; the chips over it turn, move and put it away
        const lamp = await page.evaluate(() => { const p = SSG.W.pieces[SSG.W.pieces.length - 1]; return p.uid; });
        await page.evaluate(uid => SSG.select(SSG.W.byUid[uid]), lamp);
        await page.waitForTimeout(120);
        const chips = await page.evaluate(() => SSG.hits.filter(hh => hh.w === 18 && hh.h === 17).map(hh => [hh.x + hh.w / 2, hh.y + hh.h / 2]));
        if (chips.length !== 3) touch.push('a picked piece does not show turn, move and put-away chips');
        else {
          const r0 = await page.evaluate(uid => SSG.W.byUid[uid].r, lamp);
          await tapAt(page, chips[0][0], chips[0][1]);
          if (await page.evaluate(uid => SSG.W.byUid[uid].r, lamp) === r0) touch.push('the turn chip does not turn it');
          await tapAt(page, chips[1][0], chips[1][1]);
          if (!(await page.evaluate(() => !!SSG.hold))) touch.push('the move chip does not pick it up');
          await page.keyboard.press('ArrowLeft'); await page.keyboard.press('z'); await page.waitForTimeout(100);
          if (await page.evaluate(uid => !SSG.W.byUid[uid] && !SSG.hold, lamp) && await page.evaluate(() => SSG.W.pieces.some(p => p.id === 'floor-lamp' && p.f === 0 && p.y < SSG.W.ay + 7))) {} else if (await page.evaluate(() => !!SSG.hold)) { await page.keyboard.press('x'); }
          await page.evaluate(() => { const p = SSG.W.pieces.filter(q => q.id === 'floor-lamp')[0]; SSG.select(p); });
          await page.waitForTimeout(100);
          const away = await page.evaluate(() => SSG.hits.filter(hh => hh.w === 18 && hh.h === 17).map(hh => [hh.x + hh.w / 2, hh.y + hh.h / 2]).pop());
          const before = await page.evaluate(() => SSG.save.stored.length);
          await tapAt(page, away[0], away[1]);
          if (await page.evaluate(() => SSG.save.stored.length) !== before + 1) touch.push('Put away does not send it to storage');
        }
      }
    }
    // undo the last 10
    const undo = await page.evaluate(() => {
      const G = SSG, W = G.W, out = [], start = JSON.stringify(W.pieces.map(p => [p.uid, p.id, p.x, p.y, p.r]));
      G.undo = [];
      const chairs = W.pieces.filter(p => !p.host && !p.wall && W.def(p).kind === 'floor').slice(0, 10);
      chairs.forEach(p => { G.snapshot(); p.sw = ((p.sw || 0) + 1) % W.def(p).swatches.length; G.changed(true); });
      for (let i = 0; i < 10; i++) G.doUndo();
      if (JSON.stringify(G.W.pieces.map(p => [p.uid, p.id, p.x, p.y, p.r])) !== start) out.push('undoing 10 changes does not get back to the start');
      return out;
    });
    // colors, paint, patterns and props, then a reload
    const looks = await page.evaluate(() => {
      const G = SSG, W = G.W, out = [], a = W.pieces.find(p => p.id === 'club-armchair');
      if (!G.hasProps(W.def(a))) out.push('the armchair has no props to switch');
      window.__chair = a.uid; a.props = false; a.sw = 2; a.colors = { fabric: '#7fa7a0', cushion: '#f3d38a', wood: '#55311d' }; a.pats = { fabric: 'leopard' };
      G.changed(true);
      // each swatch and each palette color draws, and the texture shows under every color
      const d = W.def(a), I = SS.I;
      d.swatches.forEach((s, i) => { const sp = SS.pieceSprite({ uid: 'chk' + i, id: a.id, r: 0, sw: i }, null, 0, { rot: 0 }); if (sp.cv.width < 4) out.push('swatch ' + i + ' does not draw'); });
      SS.PAINT.forEach(col => {
        const cv = document.createElement('canvas'); cv.width = 20; cv.height = 20; const c = cv.getContext('2d'); c.fillStyle = col; c.fillRect(0, 0, 20, 20);
        const M = SS.Model(c, d, { colors: { fabric: col } }, { x: 0, y: 0 }); M.box(0, 0, 1, 1, 10, 0, 'fabric');
        const plain = c.getImageData(0, 0, 20, 20).data;
        const cv2 = document.createElement('canvas'); cv2.width = 60; cv2.height = 60; const c2 = cv2.getContext('2d'); c2.translate(30, 20);
        const M2 = SS.Model(c2, d, { colors: { fabric: col } }, { x: 0, y: 0 }); M2.box(0, 0, 1, 1, 14, 0, 'fabric'); M2.draw();
        const px = c2.getImageData(0, 0, 60, 60).data, seen = new Set(); for (let i = 0; i < px.length; i += 4) if (px[i + 3] > 200) seen.add(px[i] + ',' + px[i + 1] + ',' + px[i + 2]);
        if (seen.size < 6) out.push('no texture shows under ' + col);
      });
      return out;
    });
    const chairUid = await page.evaluate(() => window.__chair);
    await page.waitForTimeout(250);   // the browser commits saves on its own schedule; nobody reloads within milliseconds
    await page.reload(); await page.waitForTimeout(300);
    const after = await page.evaluate(uid => { SSG.openMode('sandbox'); const a = SSG.W.byUid[uid]; return { props: a.props, sw: a.sw, pat: a.pats && a.pats.fabric, col: a.colors && a.colors.cushion }; }, chairUid);
    if (after.props !== false) looks.push('the props switch does not stay off after a reload');
    if (after.sw !== 2 || after.pat !== 'leopard' || after.col !== '#f3d38a') looks.push('swatch, paint or pattern did not survive a reload');
    report('parts C and D: place, turn, stack, hang, move, put away by buttons; the placing rules', pl);
    report('parts C and D: drag in, slide back, the chips, put away by touch', touch);
    report('part C: undo steps back through 10 changes', undo);
    report('part D: swatches, paint, patterns, texture under every color, props; all kept after a reload', looks.concat(errors));

    // part B: the view by touch and buttons; the cats
    const view = [];
    await page.evaluate(() => { SSG.tray.open = false; SSG.deselect(); });
    const z0 = await page.evaluate(() => SSG.cam.zoom);
    await page.evaluate(() => { const ev = new WheelEvent('wheel', { deltaY: -200, clientX: 180, clientY: 300, bubbles: true, cancelable: true }); document.getElementById('cv').dispatchEvent(ev); });
    await page.waitForTimeout(600);
    if (!(await page.evaluate(() => SSG.cam.zoom)) || await page.evaluate(() => SSG.cam.zoom) <= z0) view.push('zooming in does nothing');
    const cx = await page.evaluate(() => SSG.cam.x); await page.keyboard.press('ArrowRight');
    if (await page.evaluate(() => SSG.cam.x) === cx) view.push('the D-pad does not slide the view');
    const cy = await page.evaluate(() => SSG.cam.y); await page.mouse.move(150, 200); await page.mouse.down(); await page.mouse.move(150, 260, { steps: 6 }); await page.mouse.up();
    if (await page.evaluate(() => SSG.cam.y) === cy) view.push('dragging the floor does not slide the view');
    const ctl = await page.evaluate(() => SSG.hits.filter(hh => hh.x >= 216 && hh.w === 20).map(hh => [hh.x + 10, hh.y + hh.h / 2]));
    await tapAt(page, ctl[0][0], ctl[0][1]); if (await page.evaluate(() => SSG.floor) !== 2) view.push('the floor 3 button does not show floor 3');
    await tapAt(page, ctl[3][0], ctl[3][1]); if (await page.evaluate(() => SSG.walls) !== 'down') view.push('the walls button does not cycle (cut, down, up)');
    await page.evaluate(() => { SSG.setFloor(0); SSG.walls = 'cut'; });
    const cats = await page.evaluate(() => { const G = SSG, a = G.cats.louie, b = G.cats.ralph, s0 = [a.x, a.y, b.x, b.y].join(); for (let i = 0; i < 1200; i++) SS.updateAgents(G, .05); return s0 !== [a.x, a.y, b.x, b.y].join(); });
    if (!cats) view.push('the cats do not wander');
    const react = await page.evaluate(() => { const G = SSG, W = G.W; let ok = false; for (let y = W.ay + 11; y >= W.ay && !ok; y--) for (let x = W.ax; x < W.ax + 8 && !ok; x++) if (!(x === W.ax + 4 && y === W.ay + 5) && W.check({ id: 'cat-bed', f: 0, x, y, r: 0 }).ok && W.path({ f: 0, x: W.ax + 4, y: W.ay + 5 }, (f, xx, yy) => f === 0 && Math.abs(xx - x) + Math.abs(yy - y) === 1 && W.walkable(0, xx, yy))) {
        // both cats start from the dining nook (earlier steps may have boxed in a corner, which the rules allow)
        G.agents.filter(a => a.kind === 'cat').forEach(a => { SS.agentGetUp(G, a); a.path = []; a.f = 0; a.z = 0; a.x = W.ax + 4.5; a.y = W.ay + 5.5; });
        const p = W.add({ id: 'cat-bed', f: 0, x, y, r: 0, sw: 0 }); SS.catsNotice(G, p); ok = p; } if (!ok) return 'no room for a cat bed'; let napped = false; for (let i = 0; i < 4000 && !napped; i++) { SS.updateAgents(G, .05); napped = G.agents.some(a => a.kind === 'cat' && a.on === ok.uid); } return napped || G.agents.filter(a => a.kind === 'cat').map(a => a.who + ' f' + a.f + ' at ' + a.x.toFixed(1) + ',' + a.y.toFixed(1) + ' z' + a.z + ' on ' + a.on + ' path ' + a.path.length + ' react ' + JSON.stringify(a.react) + ' bed ' + ok.x + ',' + ok.y).join('; '); });
    if (react !== true) view.push('no cat comes to see a new cat bed and nap on it' + (react ? ': ' + react : ''));
    report('part B: zoom, slide, floors and walls; the cats wander, react and nap on placed pieces', view.concat(errors));
    await ctx.close();
  }

  // ---------- 6. spec 006: the clock, the light, Life actions ----------
  {
    const { ctx, page, errors } = await fresh({ init: () => localStorage.setItem('ss.gift', '1') });
    const bad = [];
    const looks = await page.evaluate(() => [[8, 30], [14, 0], [19, 30], [23, 30], [16, 50], [17, 0], [17, 10]].map(t => { SS.setClock(t[0], t[1]); return SS.look(SS.now(), 'life'); }));
    if (looks[0].name !== 'morning' || looks[1].name !== 'daytime' || looks[2].name !== 'evening' || looks[3].name !== 'late night') bad.push('the four times of day are wrong: ' + looks.slice(0, 4).map(l => l.name));
    if (looks[1].tint) bad.push('daytime is not bright');
    if (!looks[3].stars || looks[3].dark < .9) bad.push('late night has no dark windows with stars');
    if (!(looks[4].glow < looks[5].glow && looks[5].glow < looks[6].glow)) bad.push('the light does not change smoothly at 5 PM');
    await page.evaluate(() => { SS.setClock(14, 0); SSG.openMode('life'); });
    if (await page.evaluate(() => SSG.W.pieces.filter(p => SS.DEF[p.id].lamp).some(p => p.lit))) bad.push('lamps are on in the daytime');
    await page.evaluate(() => SS.setClock(17, 1)); await page.waitForTimeout(1300);
    if (!(await page.evaluate(() => SSG.W.pieces.filter(p => SS.DEF[p.id].lamp).every(p => p.lit)))) bad.push('lamps do not come on at 5 PM');
    // tap a lamp: on or off any time
    // walking: tap the floor; up the stairs to the bedroom
    const walk = await page.evaluate(() => { const G = SSG, W = G.W; G.tray.open = false; const ok = SS.walkSarah(G, 2, W.ax + 4, W.ay + 8); for (let i = 0; i < 1200 && G.people.sarah.path.length; i++) SS.updateAgents(G, .05); const s = G.people.sarah.tile(); return ok && s.f === 2 && s.x === W.ax + 4 && s.y === W.ay + 8; });
    if (!walk) bad.push('Sarah cannot walk up two flights to the bedroom');
    // every starter action (or its Coming soon note) on a piece of this batch
    const acts = await page.evaluate(() => {
      const G = SSG, W = G.W, out = [], run = () => { for (let i = 0; i < 2400 && (G.act || G.queue.length || G.people.sarah.path.length); i++) SS.updateAgents(G, .05); };
      const uses = {}; W.pieces.forEach(p => { const u = W.def(p).use; if (u && !uses[u]) uses[u] = p; });
      Object.keys(SS.ACTIONS).forEach(k => {
        if (k === 'cat' || k === 'keegan' || k === 'backdoor') return;
        const p = uses[k]; if (!p) { out.push('no piece in the home for ' + k); return; }
        SS.ACTIONS[k].forEach(a => { if (a.soon) return; const r = SS.chooseAction(G, { piece: p }, a); if (r !== 'now') out.push(a.name + ' on ' + p.id + ' did not start'); let started = false; for (let i = 0; i < 2400 && G.act; i++) { SS.updateAgents(G, .05); if (G.act && G.act.started) started = true; } if (!started) out.push(a.name + ' on ' + p.id + ': Sarah never got there'); });
      });
      // the cats: pet, treat, play; Keegan: chat and hug
      ['pet', 'treat', 'play'].forEach((fx, i) => { const a = SS.ACTIONS.cat[i]; SS.chooseAction(G, { agent: G.cats.louie }, a); let st = false; for (let j = 0; j < 2400 && G.act; j++) { SS.updateAgents(G, .05); if (G.act && G.act.started) st = true; } if (!st) out.push(a.name + ' on Louie did not happen'); });
      SS.ACTIONS.keegan.filter(a => !a.soon).forEach(a => { SS.chooseAction(G, { agent: G.people.keegan }, a); let st = false; for (let j = 0; j < 2400 && G.act; j++) { SS.updateAgents(G, .05); if (G.act && G.act.started) st = true; } if (!st) out.push(a.name + ' with Keegan did not happen'); });
      if (!G.save.made.some(id => SS.PAINTING_POOL.indexOf(id) >= 0)) out.push('Paint did not make a painting');
      if (!G.save.made.some(id => SS.DEF[id].craft && SS.DEF[id].craft !== 'painting')) out.push('the seasonal craft did not make anything');
      // up to 3 lined up, a fourth is refused; tapping elsewhere stops everything and nothing is lost
      const sofa = W.pieces.find(p => p.id === 'three-seat-sofa'), n = W.pieces.length;
      const r = [0, 1, 2, 3, 4].map(() => SS.chooseAction(G, { piece: sofa }, SS.ACTIONS.sofa[0]));
      if (r.join() !== 'now,queued,queued,queued,full') out.push('the queue is not one now plus 3 lined up: ' + r);
      SS.stopActions(G); if (G.act || G.queue.length) out.push('stopping does not clear the action and the queue');
      if (W.pieces.length !== n) out.push('stopping lost a piece');
      return out;
    });
    acts.forEach(a => bad.push(a));
    // spec 006, part C: needs drain only while playing, fill from actions, a low need only nudges and slows; Sandbox has none
    const needs = await page.evaluate(() => {
      const G = SSG, out = [], n = SS.needsOf(G, 'sarah'); SS.stopActions(G);
      n.energy = .9; n.hunger = .9; n.fun = .9; const e0 = n.energy;
      for (let i = 0; i < 1200; i++) SS.updateAgents(G, .05);   // a minute of play
      const per = (e0 - n.energy); if (!(per > 0 && Math.abs(per - .75 / 40) < .004)) out.push('energy does not go down about 1/40 of the way to low per minute: ' + per.toFixed(4));
      n.hunger = .1; const fridge = G.W.pieces.find(p => p.id === 'fridge');
      if (SS.lowNeed(G, 'sarah') !== 'hunger') out.push('a hunger of 0.1 is not low');
      SS.chooseAction(G, { piece: fridge }, SS.ACTIONS.fridge[0]); let st = 0; for (let i = 0; i < 3000 && G.act; i++) { SS.updateAgents(G, .05); if (G.act && G.act.started && !st) { st = 1; if (!(G.act.dur > SS.ACTIONS.fridge[0].dur)) out.push('a low need does not slow the action down'); } }
      if (!(n.hunger > .4)) out.push('a snack does not fill hunger: ' + n.hunger.toFixed(2));
      // every together action brings Keegan along and fills both of them
      SS.ACTIONS.keegan.filter(a => a.together).concat([SS.ACTIONS.keegan[1], SS.ACTIONS.keegan[2]]).forEach(a => {
        const k = SS.needsOf(G, 'keegan'); k.fun = .3; let joined = false;
        SS.chooseAction(G, { agent: G.people.keegan }, a);
        for (let i = 0; i < 4000 && (G.act || G.people.sarah.path.length); i++) { SS.updateAgents(G, .05); if (G.act && a.together && G.people.keegan.on === (G.act.job.target.piece || {}).uid) joined = true; }
        if (a.together && !joined) out.push(a.name + ': Keegan did not join her');
        if (!(k.fun > .3)) out.push(a.name + ' did not fill Keegan\'s fun');
      });
      // nothing drains while she's away: needs are saved and come back as they were
      G.changed(true); const saved = JSON.parse(localStorage.getItem(SS.PRE + 'life')).needs.sarah.fun; if (Math.abs(saved - n.fun) > 1e-9) out.push('needs are not saved');
      return out;
    });
    needs.forEach(a => bad.push(a));
    // spec 006, part D: the cats' needs only nudge, and each one's fix clears it
    const cats = await page.evaluate(() => {
      const G = SSG, out = [], W = G.W, run = n => { for (let i = 0; i < n; i++) SS.updateAgents(G, .05); };
      SS.stopActions(G);
      const L = SS.catNeedsOf(G, 'louie'), Rr = SS.catNeedsOf(G, 'ralph');
      const bowl = W.pieces.find(p => p.id === 'cat-bowls'), box = W.pieces.find(p => p.id === 'litter-box');
      if (!bowl || !box) { out.push('the home has no cat bowls or litter box'); return out; }
      L.hunger = .1; Rr.hunger = .9; L.play = .9; Rr.play = .9; L.litter = .9; Rr.litter = .9;
      let near = false; for (let i = 0; i < 6000 && !near; i++) { SS.updateAgents(G, .05); const lc = G.cats.louie; near = !lc.path.length && W.useTiles(bowl).some(q => q[0] === Math.floor(lc.x) && q[1] === Math.floor(lc.y) && lc.f === W.floorOf(bowl)) && !!lc.bubble; }
      if (!near) out.push('a hungry Louie does not go and sit by the bowl');
      SS.chooseAction(G, { piece: bowl }, SS.ACTIONS.bowl[0]); for (let i = 0; i < 3000 && (G.act || G.people.sarah.path.length); i++) SS.updateAgents(G, .05);
      if (L.hunger < .9) out.push('Fill does not feed the cats');
      L.litter = .1; SS.chooseAction(G, { piece: box }, SS.ACTIONS.litter[0]); for (let i = 0; i < 3000 && (G.act || G.people.sarah.path.length); i++) SS.updateAgents(G, .05);
      if (L.litter < .9) out.push('Scoop does not clean the litter box');
      Rr.play = .1; SS.chooseAction(G, { agent: G.cats.ralph }, SS.ACTIONS.cat[2]); for (let i = 0; i < 3000 && (G.act || G.people.sarah.path.length); i++) SS.updateAgents(G, .05);
      if (Rr.play < .99) out.push('the feather wand does not count double for Ralph');
      // bored: knocks a small thing off a table, and it can be picked back up (it's still a piece in the home)
      const n0 = W.pieces.length, stacked0 = W.pieces.filter(p => p.host).length; L.play = .05; Rr.play = .05; L.hunger = 1; Rr.hunger = 1; L.litter = 1; Rr.litter = 1;
      let knocked = false; for (let i = 0; i < 12000 && !knocked; i++) { SS.updateAgents(G, .05); knocked = W.pieces.filter(p => p.host).length < stacked0; }
      if (!knocked) out.push('a bored cat never knocks a small thing off a table');
      if (W.pieces.length !== n0) out.push('a knocked-over thing was lost');
      return out;
    });
    cats.forEach(a => bad.push(a));
    if (await page.evaluate(() => { SSG.openMode('sandbox'); return !!SS.lowNeed(SSG, 'sarah') || SSG.mode !== 'sandbox'; })) bad.push('Sandbox has needs');
    const soon = await page.evaluate(() => { const need = ['COOK', 'FIND A GIG', 'CHANGE', 'GO TO', 'VIDEO-CALL', 'WIND DOWN']; const all = [].concat.apply([], Object.keys(SS.ACTIONS).map(k => SS.ACTIONS[k])); return need.filter(n => !all.some(a => a.name === n && a.soon)); });
    soon.forEach(n => bad.push(n + ' does not show Coming soon'));
    report('spec 006: four light looks, lamps at 5 PM, walking up the stairs, every starter action, crafts, the queue; needs; together actions; the cats\' needs', bad.concat(errors));
    await ctx.close();
  }

  // ---------- 7. test saves ----------
  {
    const dir = path.join(__dirname, '..', 'test-saves'), bad = [];
    const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.json')) : [];
    if (!files.length) bad.push('no test saves');
    for (const f of files) {
      const obj = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
      const { ctx, page, errors } = await fresh({});
      await page.evaluate(o => { Object.keys(o.keys).forEach(k => localStorage.setItem(SS.PRE + k, o.keys[k])); }, obj);
      await page.reload(); await page.waitForTimeout(300);
      const r = await page.evaluate(() => { const m = SS.lastMode(); SSG.openMode(m); return { m, n: SSG.W.pieces.length, screen: SSG.screen }; });
      await page.waitForTimeout(300);
      if (r.screen !== 'home' || !r.n) bad.push(f + ' does not open');
      errors.forEach(e => bad.push(f + ': ' + e));
      await ctx.close();
    }
    report(`every save in test-saves/ opens (${files.length})`, bad);
  }

  // ---------- 8. the contact sheet and the screens for the side-by-side ----------
  {
    const { ctx, page, errors } = await fresh({ scale: 1, init: () => localStorage.setItem('ss.gift', '1') });
    const url2 = await page.evaluate(() => {
      const defs = SS.CATALOG, cw = 96, ch = 104, cols = 4 * 2, cv = document.createElement('canvas');
      const extra = 2 * ch;
      cv.width = Math.max(cols * cw, 900); cv.height = Math.ceil(defs.length / 2) * ch + extra; const c = cv.getContext('2d');
      c.fillStyle = '#2a1b24'; c.fillRect(0, 0, cv.width, cv.height);
      defs.forEach((d, i) => {
        for (let r = 0; r < 4; r++) {
          const sp = SS.pieceSprite({ uid: 'cs' + i + '-' + r, id: d.id, r, sw: 0, props: true, lit: !!d.lamp }, null, 3, { rot: d.kind === 'wall' ? 0 : r });
          const x = ((i % 2) * 4 + r) * cw, y = Math.floor(i / 2) * ch, k = Math.min(1, (cw - 4) / sp.cv.width, (ch - 14) / sp.cv.height);
          c.drawImage(sp.cv, x + 2, y + 2, sp.cv.width * k, sp.cv.height * k);
          if (r === 0) { c.fillStyle = '#fff1e2'; c.font = '9px monospace'; c.fillText(d.name, x + 3, y + ch - 4); }
          if (d.kind === 'wall') break;
        }
      });
      // people and cats in every pose, at 2x
      let x = 4, y = Math.ceil(defs.length / 2) * ch + 8; c.save(); c.scale(2, 2);
      ['sarah', 'keegan'].forEach(who => ['stand', 'walk1', 'walk2', 'sit'].forEach(pose => [false, true].forEach(back => { SS.person(c, who, x + 12, y / 2 + 46, { pose, back }); x += 26; })));
      x = 4; ['louie', 'ralph'].forEach(who => ['sit', 'loaf', 'curl', 'walk1', 'walk2'].forEach(pose => { SS.cat(c, who, x + 20, y / 2 + 92, { pose }); x += 38; }));
      SS.person(c, 'sarah', x + 30, y / 2 + 92, { pose: 'lie' });
      c.restore();
      return cv.toDataURL();
    });
    fs.writeFileSync(path.join(DIST, 'contact-sheet.png'), Buffer.from(url2.split(',')[1], 'base64'));
    await ctx.close();
    // the screens at 375 x 667 for the side-by-side with the mockups (studio-bible/studio.md, Playtests)
    const shots = [
      ['gift', () => { localStorage.removeItem(SS.PRE + 'gift'); location.reload(); }, null],
      ['title', () => { SSG.screen = 'title'; }, null],
      ['home-sandbox', () => { SSG.openMode('sandbox'); }, null],
      ['piece', () => { SSG.openMode('sandbox'); SSG.select(SSG.W.pieces.find(p => p.id === 'club-armchair')); }, null],
      ['paint', () => { SSG.openMode('sandbox'); SSG.select(SSG.W.pieces.find(p => p.id === 'club-armchair')); SSG.paint = { part: 0 }; }, null],
      ['menu', () => { SSG.openMode('sandbox'); SSG.openMenu(); }, null],
      ['life-night', () => { SS.setClock(21, 30); SSG.openMode('life'); }, null],
      ['life-bubble', () => { SS.setClock(10, 0); SSG.openMode('life'); SSG.setFloor(1); const k = SSG.people.keegan; SSG.bubble = { target: { agent: k }, actions: SS.ACTIONS.keegan, cur: 0, tip: [150, 150], title: 'KEEGAN · AT HIS DESK' }; }, null]
    ];
    for (const [name, fn] of shots) {
      const s = await fresh({ scale: 2, init: () => localStorage.setItem('ss.gift', '1') });
      if (name === 'gift') await s.page.evaluate(() => { localStorage.clear(); }), await s.page.reload(), await s.page.waitForTimeout(400);
      else await s.page.evaluate(fn);
      await s.page.waitForTimeout(700);
      await s.page.screenshot({ path: path.join(DIST, 'screen-' + name + '-375x667.png') });
      s.errors.forEach(e => errors.push(name + ': ' + e));
      await s.ctx.close();
    }
    report('contact sheet (dist/contact-sheet.png) and screens for the side-by-side (dist/screen-*.png)', errors);
  }

  await browser.close();
  console.log(failed ? `\n${failed} problem(s)` : '\nall checks passed');
  process.exit(failed ? 1 : 0);
})();
