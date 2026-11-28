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
    const want = { seating: 10, tables: 9, beds: 6, storage: 12, lights: 7, plants: 7, rugs: 6, wall: 10, decor: 16, holiday: 9 };   // holiday: the tree and the Christmas set (spec 009)   // decor: 13 + the easel + the cat bowls and litter box (spec 006, part D)
    const few = await page.evaluate(() => SS.CATALOG.filter(d => !d.craft && d.tab !== 'none' && (d.swatches.length < 4 || d.swatches.length > 6)).map(d => d.id + ' (' + d.swatches.length + ')'));
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
    // reopened from what's stored, as a fresh start reads it (see the turning check for why not a page reload)
    await page.evaluate(() => { SSG.screen = 'title'; SSG.W = null; });
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
      if (G.kday) G.kday.busy = false;   // Keegan free for the together actions (his busy time is checked below)
      Object.keys(SS.ACTIONS).forEach(k => {
        if (k === 'cat' || k === 'keegan' || k === 'backdoor' || k === 'meal' || k === 'sarah' || k === 'gift') return;
        const p = uses[k]; if (!p) { out.push('no piece in the home for ' + k); return; }
        SS.ACTIONS[k].forEach(a => { if (a.soon || a.instant) return; const r = SS.chooseAction(G, { piece: p }, a); if (r !== 'now') out.push(a.name + ' on ' + p.id + ' did not start'); let started = false; for (let i = 0; i < 2400 && G.act; i++) { SS.updateAgents(G, .05); if (G.act && G.act.started) started = true; } if (!started) out.push(a.name + ' on ' + p.id + ': Sarah never got there'); });
      });
      // the cats: pet, treat, play; Keegan: chat and hug
      ['pet', 'treat', 'play'].forEach((fx, i) => { const a = SS.ACTIONS.cat[i]; SS.chooseAction(G, { agent: G.cats.louie }, a); let st = false; for (let j = 0; j < 2400 && G.act; j++) { SS.updateAgents(G, .05); if (G.act && G.act.started) st = true; } if (!st) out.push(a.name + ' on Louie did not happen'); });
      SS.ACTIONS.keegan.filter(a => !a.soon && !a.instant).forEach(a => { SS.chooseAction(G, { agent: G.people.keegan }, a); let st = false; for (let j = 0; j < 2400 && G.act; j++) { SS.updateAgents(G, .05); if (G.act && G.act.started) st = true; } if (!st) out.push(a.name + ' with Keegan did not happen'); });
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
        const k = SS.needsOf(G, 'keegan'); k.fun = .3; let joined = false; if (G.kday) { G.kday.busy = false; G.kday.left = 1e9; }
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
    // spec 006, part D: Keegan's day. He starts busy with something from this time of day's pool; a busy one makes her together
    // action wait for him; cooking ends with a meal on the table that she can eat
    const day = await page.evaluate(() => {
      const G = SSG, out = [], W = G.W, run = n => { for (let i = 0; i < n; i++) SS.updateAgents(G, .05); };
      SS.stopActions(G); SS.startKeeganDay(G);
      if (!G.kday || !G.kday.text) { out.push('Keegan is not busy with anything when Life opens'); return out; }
      G.kday.busy = true; const r = SS.chooseAction(G, { agent: G.people.keegan }, SS.ACTIONS.keegan[0]);
      if (r !== 'busy') out.push('a together action does not wait while Keegan is busy');
      G.kday.left = 0; run(2); if (!G.act && !G.people.sarah.path.length) out.push('the waiting action does not start when he is done');
      for (let i = 0; i < 4000 && (G.act || G.people.sarah.path.length); i++) SS.updateAgents(G, .05);
      SS.setClock(18, 30); G.kday = { text: 'Cooking dinner', at: 'stove', left: 0, piece: (W.pieces.find(p => p.id === 'stove') || {}).uid }; run(2);
      const meals0 = W.pieces.filter(p => p.id === 'plated-meal').length, meal = W.pieces.filter(p => p.id === 'plated-meal').pop();
      if (!meal) { out.push('a finished meal does not go on the table'); return out; }
      const n = SS.needsOf(G, 'sarah'); n.hunger = .2;
      SS.chooseAction(G, { piece: meal }, SS.ACTIONS.meal[0]); for (let i = 0; i < 4000 && (G.act || G.people.sarah.path.length); i++) SS.updateAgents(G, .05);
      if (W.pieces.filter(p => p.id === 'plated-meal').length !== meals0 - 1) out.push('eating does not clear the plate');
      if (!(n.hunger > .6)) out.push('eating Keegan\'s meal does not fill hunger');
      // picks don't repeat until the pool runs out
      const pool = SS_PRIVATE.idleLife.evening.filter(a => a.at !== 'stove'), seen = [];
      SS.setClock(21, 0); G.save.shown = {}; for (let i = 0; i < pool.length; i++) { G.kday.left = 0; run(1); seen.push(G.kday.text); }
      if (new Set(seen).size !== seen.length) out.push('Keegan repeats an activity before the pool runs out: ' + seen);
      return out;
    });
    day.forEach(a => bad.push(a));
    // spec 006, part D: idle Sarah and her phone
    const phone = await page.evaluate(() => {
      const G = SSG, out = [], W = G.W, run = n => { for (let i = 0; i < n; i++) SS.updateAgents(G, .05); };
      SS.stopActions(G); G.hunt = null; G.charging = false; SS.setClock(20, 0); SS.startSarahIdle(G);
      if (!G.idle) { out.push('Sarah is not in the middle of anything when Life opens'); return out; }
      G.idle.phone = true; G.save.phone = .5; run(1200);
      if (!(G.save.phone < .5)) out.push('the phone does not run down while she scrolls');
      if (G.people.sarah.arms !== 'phone') out.push('scrolling does not use the phone-at-her-chest pose');
      G.save.phone = .1; run(1); if (G.people.sarah.arms) out.push('a low phone still shows the scrolling pose, not the despair');
      G.save.phone = .1;
      if (!SS.actionsFor(G, { agent: G.people.sarah })) out.push('tapping Sarah with a low phone does not show Charge');
      SS.startHunt(G); const h = G.hunt.hide;
      // a question mark over every spot in the pool: each sofa, each bed, Ralph (spec 006, Hiding spots show)
      const pickOf = key => key.startsWith('cat:') ? { agent: G.cats[key.slice(4)] } : { piece: W.byUid[+key.slice(1)] };
      const marks = SS.huntMarks(G).map(m => m.key), want = W.pieces.filter(p => ['sofa', 'bed'].includes(W.def(p).use)).map(p => 'p' + p.uid).concat(['cat:ralph']);
      if (want.some(k => !marks.includes(k)) || marks.length !== want.length) out.push('the hunt\'s question marks are not over every hiding spot: ' + marks.length + ' of ' + want.length);
      const wrong = W.pieces.find(p => W.def(p).use === 'desk');
      SS.huntTap(G, { piece: wrong }); if (!G.hunt) out.push('a wrong guess finds the charger');
      const wrongSpot = marks.find(k => k !== G.hunt.spot);
      SS.huntTap(G, pickOf(wrongSpot)); if (!G.hunt) out.push('a wrong hiding spot finds the charger');
      else if (SS.huntMarks(G).some(m => m.key === wrongSpot)) out.push('a wrong hiding spot keeps its question mark');
      else if (SS.huntMarks(G).length !== marks.length - 1) out.push('a wrong guess took away more than its own question mark');
      SS.huntTap(G, pickOf(G.hunt.spot)); if (G.hunt || !G.charging) out.push('the right spot does not find the charger (' + h.key + ')');
      if (SS.huntMarks(G).length) out.push('the question marks stay after the charger is found');
      run(4000); if (G.save.phone < .99) out.push('the phone does not charge in a few minutes of play');
      // the hiding spots don't repeat until they're used up
      G.save.shown.charger = []; const keys = []; for (let i = 0; i < 3; i++) { SS.startHunt(G); keys.push(G.hunt.hide.key); G.hunt = null; }
      if (new Set(keys).size !== 3) out.push('the charger hides in the same spot twice before the pool runs out: ' + keys);
      return out;
    });
    phone.forEach(a => bad.push(a));
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
      const stackedUids = W.pieces.filter(p => p.host && p.id !== 'plated-meal').map(p => p.uid), stacked0 = W.pieces.filter(p => p.host).length; L.play = .05; Rr.play = .05; L.hunger = 1; Rr.hunger = 1; L.litter = 1; Rr.litter = 1;
      let knocked = false; for (let i = 0; i < 12000 && !knocked; i++) { SS.updateAgents(G, .05); knocked = W.pieces.filter(p => p.host).length < stacked0; }
      if (!knocked) out.push('a bored cat never knocks a small thing off a table');
      // the thing knocked off is still a piece in the home (not counting a meal Keegan made, which Sarah may eat meanwhile)
      if (stackedUids.some(u => !W.byUid[u])) out.push('a knocked-over thing was lost');
      return out;
    });
    cats.forEach(a => bad.push(a));
    if (await page.evaluate(() => { SSG.openMode('sandbox'); return !!SS.lowNeed(SSG, 'sarah') || SSG.mode !== 'sandbox'; })) bad.push('Sandbox has needs');
    const soon = await page.evaluate(() => { const need = ['GO TO', 'VIDEO-CALL', 'WIND DOWN']; const all = [].concat.apply([], Object.keys(SS.ACTIONS).map(k => SS.ACTIONS[k])); return need.filter(n => !all.some(a => a.name === n && a.soon)); });
    soon.forEach(n => bad.push(n + ' does not show Coming soon'));
    report('spec 006: four light looks, lamps at 5 PM, walking up the stairs, every starter action, crafts, the queue; needs; together actions; the cats\' needs; Keegan\'s day; her phone', bad.concat(errors));
    await ctx.close();
  }

  // ---------- spec 009: Christmas ----------
  {
    const { ctx, page, errors } = await fresh({ init: () => localStorage.setItem('ss.gift', '1') });
    const bad = await page.evaluate(() => {
      const out = [], G = SSG;
      // out of season in Life: the Christmas set says "Back in December" and can't be taken; in season it says "This season"
      SS.setDate(2026, 6, 4); SS.setClock(12, 0); G.openMode('life');
      const away = G.catalogList('holiday').items.filter(it => it.away).length;
      if (!away) out.push('out of season, Christmas pieces are not marked Back in December');
      G.takeCard(G.catalogList('holiday').items.find(it => it.away)); if (G.hold) out.push('an out-of-season Christmas piece can be taken'); G.hold = null;
      G.openMode('sandbox'); if (G.catalogList('holiday').items.some(it => it.away)) out.push('Sandbox hides holiday pieces out of season');
      SS.setDate(2026, 11, 5); G.openMode('life');
      if (!G.catalogList('holiday').items.every(it => it.season)) out.push('in December, the Christmas set is not marked This season');
      // Christmas Eve: stockings and cookies, for the day only, and she can keep one
      SS.setDate(2026, 11, 24); SS.setClock(19, 0); G.openMode('life');
      const st = G.W.pieces.find(p => p.id === 'stockings' && p.dress), ck = G.W.pieces.find(p => p.id === 'cookies-and-milk' && p.dress);
      if (!st || !ck) out.push('Christmas Eve has no stockings or cookies out');
      if (ck) { const acts = SS.actionsFor(G, { piece: ck }); if (!acts || acts[0].fx !== 'keep') out.push('day dressing has no Keep it'); else { G.bubble = { target: { piece: ck }, actions: acts, cur: 0, tip: [0, 0], title: '' }; G.doBubble(0); } }
      // Christmas morning: gifts under the tree, Santa hats, breakfast; the eve's stockings go, the kept cookies stay
      SS.setDate(2026, 11, 25); SS.setClock(8, 0); G.openMode('life');
      if (G.W.pieces.some(p => p.id === 'stockings' && p.dress)) out.push('yesterday\'s dressing did not go away');
      if (!G.W.pieces.some(p => p.id === 'cookies-and-milk')) out.push('a kept day-dressing piece was taken away');
      const gifts = G.W.pieces.filter(p => p.id === 'christmas-gift');
      if (gifts.length !== 3 || gifts.filter(g => g.note).length !== 1) out.push('Christmas morning does not have 3 gifts with one note: ' + gifts.length);
      if (!G.xmasDay) out.push('the cats are not in Santa hats on Christmas');
      if (!G.W.pieces.some(p => p.id === 'plated-meal')) out.push('Keegan made no Christmas breakfast');
      const n0 = G.W.pieces.length; gifts.filter(g => !g.note).forEach(g => SS.openGift(G, g));
      if (G.W.pieces.filter(p => p.id === 'christmas-gift').length !== 1) out.push('opening gifts does not clear them');
      if (G.W.pieces.length !== n0) out.push('each opened gift does not leave a Christmas piece in its place');
      SS.openGift(G, G.W.pieces.find(p => p.id === 'christmas-gift'));
      if (!G.menu || G.menu.kind !== 'note' || G.menu.id !== 'tree') out.push('the note gift does not show Keegan\'s note'); else G.menu = null;   // on its own paper (spec 007)
      // gifts never repeat in the same year
      G.openMode('life'); if (G.W.pieces.some(p => p.id === 'christmas-gift')) out.push('the gifts came back after reopening');
      // first snow: once a winter
      return out;
    });
    report('spec 009: the Christmas set in and out of season, Christmas Eve, Christmas morning, gifts and the note', bad.concat(errors));
    await ctx.close();
  }

  // ---------- 6b. Sarah's playtest bugs (Nov 26) ----------
  {
    const bad = [];
    // 1. the charger hunt never takes over every tap: a tap on the floor stops looking and walks her there
    {
      const { ctx, page, errors } = await fresh({ init: () => localStorage.setItem('ss.gift', '1') });
      await page.evaluate(() => { SSG.confirm = null; SS.setClock(14, 0); SSG.openMode('life'); SS.stopSarahIdle(SSG); SS.stopActions(SSG); SSG.setFloor(0); SS.startHunt(SSG); SSG.toastT = null; });
      await page.waitForTimeout(200);
      await tapAt(page, 120, 150);
      const r = await page.evaluate(() => ({ hunt: !!SSG.hunt, walking: SSG.people.sarah.path.length > 0 }));
      if (r.hunt) bad.push('a tap on the floor during the charger hunt does not stop looking');
      if (await page.evaluate(() => SS.huntMarks(SSG).length)) bad.push('the question marks stay after the hunt stops');
      await page.evaluate(() => { SSG.bubble = null; SS.startHunt(SSG); SSG.toastT = null; });
      if (!(await page.evaluate(() => SS.huntMarks(SSG).length))) bad.push('no question marks show during a hunt');
      await page.locator('#bB').tap(); await page.waitForTimeout(100);
      if (await page.evaluate(() => !!SSG.hunt || SS.huntMarks(SSG).length > 0)) bad.push('B does not stop the hunt and clear its question marks');
      // tapping Sarah: her bubble says her name and what she's doing, with the battery under it (spec 006, part C)
      const tapSarah = async () => { const q = await page.evaluate(() => { const h = SSG.lastHits.find(h => h.agent && h.agent.who === 'sarah'); if (!h) return null; return SSG.toScreen((h.box[0] + h.box[2]) / 2, h.box[1] + 5); }); if (q) await tapAt(page, q[0], q[1]); return !!q; };
      await page.evaluate(() => { SSG.bubble = null; SSG.toastT = null; SS.stopActions(SSG); SS.setClock(14, 0); SS.startSarahIdle(SSG); SSG.setFloor(SSG.people.sarah.f); });
      await page.waitForTimeout(200);
      if (!(await tapSarah())) bad.push('Sarah is not on screen to tap');
      const lab = await page.evaluate(() => ({ b: SSG.bubble && { title: SSG.bubble.title, sub: SSG.bubble.sub }, idle: SSG.idle && SSG.idle.text }));
      if (!lab.idle) bad.push('Sarah is not doing anything when Life opens');
      else if (!lab.b || lab.b.title !== 'SARAH · ' + lab.idle.toUpperCase()) bad.push('Sarah\'s bubble does not say what she\'s doing: ' + (lab.b && lab.b.title) + ' (' + lab.idle + ')');
      if (!lab.b || !/BATTERY/.test(lab.b.sub || '')) bad.push('Sarah\'s bubble has no battery line');
      await page.evaluate(() => { SSG.bubble = null; SS.stopSarahIdle(SSG); SS.stopActions(SSG); SSG.charging = false; });
      await page.waitForTimeout(150); await tapSarah();
      const lab2 = await page.evaluate(() => SSG.bubble && SSG.bubble.title);
      if (lab2 !== 'SARAH') bad.push('with nothing to do, Sarah\'s bubble says ' + lab2 + ', not just SARAH');
      // every activity name fits in the bubble
      const long = await page.evaluate(() => { const G = SSG, out = []; G.idle = null; G.hunt = null; Object.keys(SS.ACTIONS).forEach(k => SS.ACTIONS[k].forEach(a => { if (a.soon || a.instant) return; G.act = { job: { act: a, target: { agent: G.cats.louie } } }; const d = SS.sarahDoing(G); if (!d) out.push(a.name + ' has no words for Sarah\'s bubble'); else if (SS.tw('SARAH · ' + d.toUpperCase(), 5) > 136) out.push(d + ' is too long for the bubble'); })); G.act = null; return out; });
      long.forEach(o => bad.push(o));
      // hugs and kisses are quick, and Keegan meets her halfway; for a together action he sets off when she does (Keegan, Nov 26)
      const quick = await page.evaluate(() => {
        const G = SSG, out = [], K = G.people.keegan, s = G.people.sarah; SS.stopActions(G); G.kday = null;
        const W = G.W, far = []; for (let x = 0; x < W.lot; x++) for (let y = 0; y < W.lot; y++) if (W.inside(0, x, y) && W.walkable(0, x, y)) far.push([x, y]);
        const kt = K.tile(), st0 = far.sort((a, b) => Math.hypot(b[0] - kt.x, b[1] - kt.y) - Math.hypot(a[0] - kt.x, a[1] - kt.y))[0];
        s.f = 0; s.x = st0[0] + .5; s.y = st0[1] + .5; s.z = 0; s.path = []; const k0 = { x: K.x, y: K.y, f: K.f };
        SS.chooseAction(G, { agent: K }, SS.ACTIONS.keegan.find(a => a.name === 'HUG')); SS.updateAgents(G, .05); SS.updateAgents(G, .05);
        if (!K.path.length) out.push('Keegan does not walk to meet her for a hug');
        let t = 0; while (G.act && t < 60) { SS.updateAgents(G, .05); t += .05; }
        if (t > 15) out.push('a hug from across the house takes ' + t.toFixed(1) + ' s');
        SS.stopActions(G); s.f = 0; s.x = st0[0] + .5; s.y = st0[1] + .5; s.path = []; K.f = k0.f; K.x = k0.x; K.y = k0.y; K.path = [];
        const bed = G.W.pieces.find(p => G.W.def(p).use === 'bed' && G.W.def(p).w >= 2);
        SS.chooseAction(G, { piece: bed }, SS.ACTIONS.bed.find(a => a.name === 'LIE IN')); SS.updateAgents(G, .05); SS.updateAgents(G, .05);
        if (!K.path.length) out.push('for Lie in, Keegan waits for her to reach the bed before he sets off');
        SS.stopActions(G); return out;
      });
      quick.forEach(o => bad.push(o));
      // the bath: she sits down in the water (head, shoulders and arms over the rim), in all 4 turns of the tub, and steps out dressed
      const bath = await page.evaluate(() => {
        const G = SSG, out = [], s = G.people.sarah, tub = G.W.pieces.find(p => G.W.def(p).use === 'tub'), r0 = tub.r || 0;
        for (let r = 0; r < 4; r++) {
          tub.r = r; SS.forgetSprite(tub.uid); SS.stopActions(G);
          SS.chooseAction(G, { piece: tub }, SS.ACTIONS.tub[0]); let t = 0; while (G.act && !G.act.started && t < 200) { SS.updateAgents(G, .05); t += .05; }
          if (s.pose !== 'bath' || s.on !== tub.uid) out.push('in the bath (tub turned ' + r + ') she is not sitting in the water');
          while (G.act && t < 400) { SS.updateAgents(G, .05); t += .05; }
          if (s.pose === 'bath' || s.on) out.push('after the bath (tub turned ' + r + ') she does not step out');
        }
        tub.r = r0; SS.forgetSprite(tub.uid); return out;
      });
      bath.forEach(o => bad.push(o));
      if (!r.walking) bad.push('a tap on the floor during the charger hunt does not walk Sarah there');
      const spots = await page.evaluate(() => { const G = SSG, W = G.W, by = u => ({ piece: W.pieces.find(p => W.def(p).use === u) });
        return { keegan: SS.huntSpot(G, { agent: G.people.keegan }), fridge: SS.huntSpot(G, by('fridge')), sofa: SS.huntSpot(G, by('sofa')), bed: SS.huntSpot(G, by('bed')), cat: SS.huntSpot(G, { agent: G.cats.ralph }), floor: SS.huntSpot(G, null) }; });
      if (spots.keegan || spots.fridge || spots.floor) bad.push('Keegan, the fridge or the floor count as charger guesses');
      if (!spots.sofa || !spots.bed || !spots.cat) bad.push('a sofa, a bed or a cat does not count as a charger guess');
      // 3. wall pieces never draw over a piece standing in front of them (the kitchen curtains over the counter)
      const over = await page.evaluate(async () => {
        const G = SSG, out = [];
        for (const f of [0, 1, 2]) {
          G.setFloor(f); await new Promise(r => setTimeout(r, 120));
          const hits = G.lastHits || [];
          hits.forEach(h => {
            if (!h.p || h.rug || h.p.wall || h.p.host) return;
            const d = h.sp.cv.getContext('2d').getImageData(0, 0, h.sp.cv.width, h.sp.cv.height).data, w = h.sp.cv.width;
            let n = 0, by = null;
            for (let y = 0; y < h.sp.cv.height; y += 2) for (let x = 0; x < w; x += 2) {
              if (d[(y * w + x) * 4 + 3] < 200) continue;
              const pk = SS.pick(hits, h.x + x + .5, h.y + y + .5, { noAgents: true });
              if (pk && pk.piece && pk.piece.wall && G.W.def(pk.piece).w) { n++; by = pk.piece.id; }
            }
            if (n > 2) out.push(by + ' draws over the ' + h.p.id + ' on floor ' + (f + 1));
          });
        }
        return out;
      });
      over.forEach(o => bad.push(o));
      // with the walls up (and cut away), nothing behind a wall draws over it and nothing in front draws under it (Keegan, Nov 26)
      const walls = await page.evaluate(async () => {
        const G = SSG, out = [], sort = StudioIso.sort; let last = null;
        StudioIso.sort = items => (last = sort(items));
        for (const mode of ['up', 'cut']) for (const f of [0, 1, 2]) {
          G.walls = mode; G.setFloor(f); last = null; await new Promise(r => setTimeout(r, 150));
          if (!last) { out.push('nothing was drawn on floor ' + (f + 1)); continue; }
          last.forEach((w, i) => {
            if (!w.plane || w.kind !== 'wall') return;
            last.forEach((o, j) => {
              const d = o.drawn || [o.l, o.t, o.r, o.b]; if (o.kind !== 'piece' || d[2] <= w.l || w.r <= d[0] || d[3] <= w.t || w.b <= d[1]) return;
              const lo = w.plane.axis === 'x' ? o.y0 : o.x0, hi = w.plane.axis === 'x' ? o.y1 : o.x1, at = w.plane.at;
              if (lo < at - 1e-4 && hi > at + 1e-4) return;   // stands past the wall's end, across its line
              const front = lo >= at - 1e-4;
              if (front !== (j > i)) out.push(o.p.id + ' draws ' + (front ? 'behind' : 'over') + ' a wall on floor ' + (f + 1) + ' (walls ' + mode + ')');
            });
          });
        }
        StudioIso.sort = sort; G.walls = 'cut';
        return [...new Set(out)];
      });
      walls.forEach(o => bad.push(o));
      bad.push(...errors); await ctx.close();
    }
    // 4. the shell's title bar sits below a notched phone's status bar, and nothing falls off the bottom
    for (const [w, h, top, bot] of [[430, 932, 59, 34], [375, 667, 20, 0], [375, 812, 47, 34], [390, 844, 47, 34]]) {   // Sarah's iPhone 15 Pro Max first (Dynamic Island: 59 px top, 34 px home bar)
      const { ctx, page, errors } = await fresh({ w, h, init: () => localStorage.setItem('ss.gift', '1') });
      await page.evaluate(t => { document.documentElement.style.setProperty('--safe-top', t[0] + 'px'); document.documentElement.style.setProperty('--safe-bottom', t[1] + 'px'); }, [top, bot]);
      await page.waitForTimeout(200);
      const r = await page.evaluate(() => { const b = document.querySelector('.brand').getBoundingClientRect(), s = document.querySelector('.shell').getBoundingClientRect(); return { brand: b.top, shown: b.height > 0, shellBottom: s.bottom }; });
      if (!r.shown) bad.push(w + ' x ' + h + ': the title bar is hidden');
      if (r.brand < top) bad.push(w + ' x ' + h + ': the title bar sits under the status bar (' + Math.round(r.brand) + ' px from the top)');
      if (r.shellBottom > h - bot + .5) bad.push(w + ' x ' + h + ': the shell runs under the home bar');
      // the game fills its screen: no empty bands above the top bar or below the tray (Keegan, Nov 26: the 320 px cap lifted)
      await page.evaluate(() => { window.dispatchEvent(new Event('resize')); SSG.confirm = null; SS.setClock(14, 0); SSG.openMode('life'); }); await page.waitForTimeout(200);
      const fill = await page.evaluate(() => { const cv = document.getElementById('cv').getBoundingClientRect(), sc = document.getElementById('screen').getBoundingClientRect(); return { top: cv.top - sc.top, bot: sc.bottom - cv.bottom, tray: SSG.H - SS.TRAY_H[SSG.trayState()] }; });
      if (fill.top > 1.5 || fill.bot > 1.5) bad.push(w + ' x ' + h + ': the game leaves empty bands (' + Math.round(fill.top) + ' px above, ' + Math.round(fill.bot) + ' px below)');
      await page.screenshot({ path: path.join(DIST, 'screen-life-' + w + 'x' + h + '.png') });
      if (w === 375 && h === 812) await page.screenshot({ path: path.join(DIST, 'screen-notched-375x812.png') });
      bad.push(...errors); await ctx.close();
    }
    report('Sarah\'s playtest (Nov 26): taps and question marks in the charger hunt, Sarah\'s bubble, quick hugs, wall pieces and walls, the safe area', bad);
  }

  // ---------- 6d. the memory book (spec 007, parts A and B) ----------
  {
    const bad = [];
    const { ctx, page, errors } = await fresh({ init: () => localStorage.setItem('ss.gift', '1') });
    const a = await page.evaluate(async () => {
      const G = SSG, out = []; G.confirm = null; SS.setClock(14, 0); G.openMode('life'); SS.stopSarahIdle(G); G.toastT = null; G.kday = null;
      if (SS.MOMENTS.length < 70) out.push('only ' + SS.MOMENTS.length + ' moments in the book');
      SS.CHAPTERS.forEach(c => { const n = SS.momentsIn(c.k).length; if (n < 10) out.push(c.name + ' has ' + n + ' moments'); });
      // a moment fires once, on its trigger, with the date and a snapshot; the pop card shows
      SS.chooseAction(G, { agent: G.people.keegan }, SS.ACTIONS.keegan.find(x => x.name === 'KISS')); for (let i = 0; i < 4000 && G.act; i++) SS.updateAgents(G, .05);
      const e = SS.book().moments.kiss;
      if (!e) out.push('a kiss does not go in the book'); else { if (!e.date || !e.snap || !e.snap.agents.length) out.push('the kiss moment has no date or snapshot'); }
      if (!G.pop || G.pop.id !== 'kiss') out.push('no pop card for a new moment');
      const d0 = e && e.date; SS.moment(G, 'kiss'); if (SS.book().moments.kiss.date !== d0) out.push('a moment fires twice');
      // the snapshot redraws the scene as it was, even after the room changes
      const img1 = SS.snapshot('kiss', 120, 80).toDataURL(); G.W.pieces.slice().forEach(p => { if (p.f === G.people.sarah.f && !p.wall) G.W.remove(p); }); SS.forgetBook();
      const img2 = SS.snapshot('kiss', 120, 80).toDataURL(); if (img1 !== img2) out.push('the snapshot changes when the room changes');
      // the book is shared by both modes, saved under its own key
      if (!localStorage.getItem(SS.PRE + 'book')) out.push('the book is not saved');
      G.openMode('sandbox'); if (!SS.hasMoment('kiss')) out.push('the book is not shared with Sandbox');
      // dated moments
      SS.setDate(2026, 6, 10); SS.bookDay(G); if (!SS.hasMoment('anniversary')) out.push('Jul 10 does not add Our anniversary');
      SS.setDate(2026, 11, 25); SS.bookDay(G); if (!SS.hasMoment('xmas-morning')) out.push('Dec 25 does not add Christmas morning');
      SS.setDate(2026, 10, 28);
      // the note under the tree opens on its paper and files into the book
      SS.showNote(G, 'tree', true); if (!G.menu || G.menu.kind !== 'note') out.push('the note does not open on its paper');
      SS.closeNote(G); if (!SS.book().notes.tree || !SS.hasMoment('note-tree') || !SS.hasMoment('note-first')) out.push('the note under the tree does not go in the book');
      return out;
    });
    a.forEach(o => bad.push(o));
    // the book screen: tabs, pages by tap, swipe and the D-pad, B closes, fits
    for (const [w, h] of [[430, 932], [375, 667], [320, 480]]) {
      await page.setViewportSize({ width: w, height: h }); await page.evaluate(() => window.dispatchEvent(new Event('resize'))); await page.waitForTimeout(150);
      await page.evaluate(() => { SSG.menu = null; SSG.openMenu(); const i = SS.MENU_ROWS.findIndex(r => r[1] === 'book'); SSG.menuPick(i); });
      if (await page.evaluate(() => !SSG.menu || SSG.menu.kind !== 'book')) { bad.push(w + ' x ' + h + ': the Start menu does not open the book'); continue; }
      for (const tab of await page.evaluate(() => SS.BOOK_TABS)) {
        await page.evaluate(t => { SSG.menu.tab = t; SSG.menu.page = 0; }, tab); await page.waitForTimeout(60);
        const hits = await page.evaluate(() => SSG.hits.length); if (hits < 5) bad.push(w + ' x ' + h + ': the ' + tab + ' tab does not draw');
      }
      await page.evaluate(() => { SSG.menu.tab = 'us'; SSG.menu.page = 0; });
      await page.keyboard.press('ArrowRight'); await page.waitForTimeout(40);
      if (await page.evaluate(() => SSG.menu.page) !== 1) bad.push(w + ' x ' + h + ': the D-pad does not turn the page');
      // a swipe to the left turns to the next page
      await page.evaluate(() => { SSG.menu.page = 0; });
      const box = await page.locator('#cv').boundingBox(), sy = box.y + box.height * .5;
      await page.mouse.move(box.x + box.width * .75, sy); await page.mouse.down();
      for (let i = 1; i <= 6; i++) { await page.mouse.move(box.x + box.width * (.75 - i * .08), sy); await page.waitForTimeout(16); }
      await page.mouse.up(); await page.waitForTimeout(60);
      if (await page.evaluate(() => SSG.menu && SSG.menu.page) !== 1) bad.push(w + ' x ' + h + ': a swipe does not turn the page');
      await page.keyboard.press('ArrowDown'); await page.waitForTimeout(40);
      if (await page.evaluate(() => SSG.menu.tab) !== 'notes') bad.push(w + ' x ' + h + ': down on the D-pad does not go to the next chapter');
      await page.keyboard.press('x'); await page.waitForTimeout(40);
      if (await page.evaluate(() => !!SSG.menu)) bad.push(w + ' x ' + h + ': B does not close the book');
      if (w === 430) { await page.evaluate(() => SS.openBook(SSG, 'us', 0)); await page.waitForTimeout(300); await page.screenshot({ path: path.join(DIST, 'screen-memory-book-430x932.png') }); await page.evaluate(() => { SSG.menu = null; }); }
    }
    // the bookshelf's bubble has Memory book
    if (!(await page.evaluate(() => SS.ACTIONS.bookshelf.some(x => x.fx === 'book')))) bad.push('the bookshelf has no Memory book');
    bad.push(...errors); await ctx.close();
    report('the memory book (spec 007 A, B): moments once with a date and snapshot, the pop card, one book, dated moments, the note, the book screen', bad);
  }

  // ---------- 6e. favorites and the camera (spec 001, part E) ----------
  {
    const bad = [];
    const { ctx, page, errors } = await fresh({ init: () => localStorage.setItem('ss.gift', '1') });
    const r = await page.evaluate(() => {
      const G = SSG, out = []; G.confirm = null; SS.setClock(14, 0); G.openMode('sandbox'); G.toastT = null;
      // Save this room keeps every piece in it, with spot, turn, colors and props, plus its floor and paper
      const sofa = G.W.pieces.find(p => p.id === 'three-seat-sofa'); sofa.colors = { fabric: '#9a7bb4' }; sofa.props = false;
      const R0 = SS.roomAt(G, 0, sofa.x, sofa.y), inRoom = G.W.pieces.filter(p => p.f === 0 && !p.host && !p.wall && R0.tiles.includes(p.x + ',' + p.y)).length;
      const fav = SS.saveRoom(G, 0, sofa.x, sofa.y);
      if (!fav || fav.pieces.filter(p => !p.host && !p.wall).length !== inRoom) out.push('Save this room does not keep every piece in the room');
      const fs = fav && fav.pieces.find(p => p.id === 'three-seat-sofa'); if (!fs || !fs.colors || fs.colors.fabric !== '#9a7bb4' || fs.props !== false || fs.r !== sofa.r) out.push('a favorite loses a piece\'s colors, props or turn');
      if (!fav || !fav.floor || !fav.paper) out.push('a favorite does not keep the floor and wallpaper');
      if (!/living room/i.test(fav.name)) out.push('the default name is not like "Cozy living room": ' + fav.name);
      if (!SS.hasMoment('favorite')) out.push('the first favorite is not in the memory book');
      // kept once for the whole game: it rebuilds in another mode, in another room; what doesn't fit goes to storage
      G.openMode('life'); if (!SS.favorites().length) out.push('favorites are not shared by every mode');
      const bed = G.W.pieces.find(p => p.id === 'double-bed'), n0 = G.W.pieces.length, s0 = G.save.stored.length;
      G.save.coins = 99999; const res = SS.applyFavorite(G, SS.favorites()[0], 2, bed.x, bed.y, 'buy');   // in Life she buys what she doesn't own
      if (!res || res.placed + res.stored !== fav.pieces.length) out.push('using a favorite loses pieces: ' + JSON.stringify(res));
      if (G.W.pieces.length - n0 !== res.placed || G.save.stored.length - s0 !== res.stored) out.push('placed and stored counts do not match the home');
      const R2 = SS.roomAt(G, 2, bed.x, bed.y); if (R2.r.floor !== fav.floor || R2.r.paper !== fav.paper) out.push('the room does not take the favorite\'s floor and wallpaper');
      G.changed(true); G.openMode('life'); const R3 = SS.roomAt(G, 2, bed.x, bed.y); if (R3.r.paper !== fav.paper) out.push('the room\'s new wallpaper is not kept');
      G.openMode('sandbox'); const R4 = SS.roomAt(G, 2, bed.x, bed.y); if (R4.r.paper === fav.paper && SS.HOMES.philly.floors[2].rooms.find(x => x.id === R4.r.id).paper !== fav.paper) out.push('a room\'s new wallpaper reaches the other mode');
      return out;
    });
    r.forEach(o => bad.push(o));
    // the screens by touch: Favorites from the Start menu, pick, tap a room
    await page.evaluate(() => { SSG.openMode('sandbox'); SSG.openMenu(); SSG.menuPick(SS.MENU_ROWS.findIndex(x => x[1] === 'fav')); });
    if (await page.evaluate(() => !SSG.menu || SSG.menu.kind !== 'fav')) bad.push('the Start menu does not open Favorites');
    await page.waitForTimeout(150); await page.screenshot({ path: path.join(DIST, 'screen-favorites-375x667.png') });
    await page.keyboard.press('z'); await page.waitForTimeout(60);
    if (await page.evaluate(() => !SSG.favUse || SSG.favUse.i !== 0)) bad.push('A on a favorite does not pick it');
    const tile = await page.evaluate(() => { const G = SSG, p = G.W.pieces.find(q => q.id === 'double-bed'); G.setFloor(2); const q = SS.vp(p.x + .5, p.y + 2.5, 2 * SS.FH); return G.toScreen(q[0], q[1]); });
    await page.waitForTimeout(150); await tapAt(page, tile[0], tile[1]);
    if (await page.evaluate(() => !!SSG.favUse)) bad.push('tapping a room does not fill it with the favorite');
    // the camera: everything else dark, the heart takes a clean picture into the memory book's Photos
    await page.evaluate(() => { SSG.toastT = null; SSG.openMenu(); SSG.menuPick(SS.MENU_ROWS.findIndex(x => x[1] === 'camera')); });
    if (await page.evaluate(() => !SSG.camera)) bad.push('the Start menu does not open the camera');
    await page.waitForTimeout(150); await page.screenshot({ path: path.join(DIST, 'screen-camera-375x667.png') });
    const clean = await page.evaluate(() => { const n0 = SS.book().photos.length; SS.snap(SSG); const S = SSG.camera.shot; return { added: SS.book().photos.length - n0, w: S.img.width, h: S.img.height, moment: SS.hasMoment('photo') }; });
    if (clean.added !== 1) bad.push('the picture does not go in the memory book\'s Photos');
    if (!clean.moment) bad.push('the first photo is not a memory book moment');
    // the saved picture has no buttons: it comes from the world alone, so the top bar's and the tray's colors never show in it
    const noUi = await page.evaluate(() => { const S = SSG.camera.shot, d = S.img.getContext('2d').getImageData(0, 0, S.img.width, Math.min(40, S.img.height)).data; let tray = 0; for (let i = 0; i < d.length; i += 4) if (d[i] === 0xff && d[i + 1] === 0xf6 && d[i + 2] === 0xea) tray++; return tray; });
    if (noUi > 50) bad.push('the saved picture has buttons or bars in it');
    await page.waitForTimeout(400); await page.screenshot({ path: path.join(DIST, 'screen-camera-saved-375x667.png') });
    await page.keyboard.press('z'); if (await page.evaluate(() => !!SSG.camera)) bad.push('Done does not close the camera');
    bad.push(...errors); await ctx.close();
    report('favorites and the camera (spec 001 E): save a room, use it in another mode and room, storage, floor and paper, the screens, a clean picture into the book', bad);
  }

  // ---------- 6f. cooking (spec 006, part E) ----------
  {
    const bad = [];
    for (const [w, h] of [[375, 667], [320, 480]]) {
      const { ctx, page, errors } = await fresh({ w, h, init: () => localStorage.setItem('ss.gift', '1') });
      await page.evaluate(() => { SSG.confirm = null; SS.setClock(18, 0); SSG.openMode('life'); SSG.toastT = null; });
      // from the stove's bubble
      const opened = await page.evaluate(() => { const G = SSG, st = G.W.pieces.find(p => p.id === 'stove'); const a = SS.ACTIONS.stove.find(x => x.fx === 'cook'); G.bubble = { target: { piece: st }, actions: [a], cur: 0, tip: [100, 100], title: 'STOVE' }; G.doBubble(0); return G.menu && G.menu.kind === 'cook'; });
      if (!opened) bad.push(w + ' x ' + h + ': Cook on the stove does not open the Cooking screen');
      for (let dish = 0; dish < 9; dish++) {
        await page.evaluate(d => { SSG.menu = null; SS.openCooking(SSG, d); }, dish);
        await page.keyboard.press('z');   // COOK
        let ok = false;
        for (let i = 0; i < 160 && !ok; i++) {
          const st = await page.evaluate(() => { const m = SSG.menu; return m ? m.state + ':' + (m.game || '') + ':' + (m.done ? 1 : 0) : 'closed'; });
          if (st.startsWith('plated')) { ok = true; break; }
          if (st.startsWith('step:hold:0')) { await page.keyboard.press('z'); await page.evaluate(() => { SSG.menu.v = .6; }); await page.keyboard.press('z'); }   // heat to Just right, then let go
          else await page.keyboard.press('z');
          await page.waitForTimeout(st.endsWith(':1') ? 950 : 40);
        }
        if (!ok) { bad.push(w + ' x ' + h + ': ' + (await page.evaluate(d => SS.DISHES[d].name, dish)) + ' does not play to the end'); continue; }
        await page.waitForTimeout(80);
      }
      const r = await page.evaluate(() => {
        const G = SSG, out = [];
        SS.DISHES.forEach(d => { if (!SS.hasMoment('dish-' + d.id)) out.push(d.name + ' made for the first time is not in the memory book'); });
        if (!SS.hasMoment('cook-first')) out.push('cooking together for the first time is not in the memory book');
        const n0 = G.W.pieces.filter(p => p.id === 'plated-meal').length; SS.cookServe(G);
        const meals = G.W.pieces.filter(p => p.id === 'plated-meal'); if (meals.length !== n0 + 1) out.push('Serve does not put the dish on the table');
        // eating it fills hunger for both of them
        const meal = meals[meals.length - 1]; if (meal) {
          SS.needsOf(G, 'sarah').hunger = .2; SS.needsOf(G, 'keegan').hunger = .2;
          SS.chooseAction(G, { piece: meal }, SS.ACTIONS.meal[0]); for (let i = 0; i < 4000 && G.act; i++) SS.updateAgents(G, .05);
          if (!(SS.needsOf(G, 'sarah').hunger > .5 && SS.needsOf(G, 'keegan').hunger > .5)) out.push('eating the dish does not fill hunger for both');
        }
        return out;
      });
      r.forEach(o => bad.push(w + ' x ' + h + ': ' + o));
      if (w === 375) { await page.evaluate(() => { SS.openCooking(SSG, 4); SS.cookStart(SSG); SSG.menu.v = .6; SSG.menu.heat = true; }); await page.waitForTimeout(200); await page.screenshot({ path: path.join(DIST, 'screen-cooking-375x667.png') }); }
      // Sandbox: the piece tray's Cook
      const sb = await page.evaluate(() => { const G = SSG; G.menu = null; G.openMode('sandbox'); G.select(G.W.pieces.find(p => p.id === 'stove')); return true; });
      await page.waitForTimeout(100);
      const cookBtn = await page.evaluate(() => SSG.hits.some(h => h.w === 44 && h.h === 16));
      if (!cookBtn) bad.push(w + ' x ' + h + ': the stove\'s piece tray in Sandbox has no Cook');
      bad.push(...errors.map(e => w + ' x ' + h + ': ' + e)); await ctx.close();
    }
    report('cooking (spec 006 E): the nine dishes play to the end by buttons at 375 x 667 and 320 x 480, moments, serve, eating fills both, Sandbox', bad);
  }

  // ---------- 6g. coins, the shop and gigs (spec 006, part F) ----------
  {
    const bad = [];
    const { ctx, page, errors } = await fresh({ init: () => localStorage.setItem('ss.gift', '1') });
    const r = await page.evaluate(() => {
      const G = SSG, out = []; G.confirm = null; SS.setClock(14, 0); G.openMode('life'); G.toastT = null;
      // prices on the cards; buying; not enough coins; selling back every coin, after a confirm on Keep
      const it = G.catalogList('seating').items.find(x => x.id === 'club-armchair');
      if (SS.cardTag(G, it).text !== String(it.def.price)) out.push('a card does not show its price in Life');
      G.save.coins = 500; G.takeCard(it); const H = G.hold; if (!H || H.price !== it.def.price) out.push('taking a card does not hold its price');
      let spot = null; for (let x = 0; x < 16 && !spot; x++) for (let y = 0; y < 16 && !spot; y++) if (G.W.check({ id: 'club-armchair', f: 0, x, y, r: 0 }).ok) spot = { x, y };
      G.hold.cand = spot; G.hold.f = 0; G.hold.r = 0;
      const before = G.save.coins; G.press ? 0 : 0;
      return { out, before, price: it.def.price };
    });
    r.out.forEach(o => bad.push(o));
    await page.keyboard.press('z'); await page.waitForTimeout(60);   // A sets it down
    const buy = await page.evaluate(b => { const G = SSG, p = G.W.pieces.filter(q => q.id === 'club-armchair').find(q => q.paid); return { coins: G.save.coins, paid: p && p.paid, uid: p && p.uid, moment: SS.hasMoment('bought'), b }; }, r.before);
    if (buy.coins !== r.before - r.price || buy.paid !== r.price) bad.push('setting a piece down does not buy it: ' + JSON.stringify(buy));
    if (!buy.moment) bad.push('the first piece bought is not in the memory book');
    const sell = await page.evaluate(uid => { const G = SSG, p = G.W.byUid[uid]; SS.sellBack(G, p); const q = G.confirm; const startsKeep = q && q.cur === 0 && /KEEP/.test(q.options[0]); G.confirmPick(1); return { startsKeep, coins: G.save.coins, gone: !G.W.byUid[uid] }; }, buy.uid);
    if (!sell.startsKeep) bad.push('selling back does not ask first with the cursor on Keep');
    if (sell.coins !== r.before || !sell.gone) bad.push('selling back does not refund every coin');
    const poor = await page.evaluate(() => { const G = SSG; G.save.coins = 10; G.hold = null; G.takeCard(G.catalogList('seating').items.find(x => x.id === 'club-armchair')); return !!G.hold; });
    if (poor) bad.push('a piece she can\'t afford can still be taken');
    const sb = await page.evaluate(() => { const G = SSG; G.hold = null; G.openMode('sandbox'); const it = G.catalogList('seating').items[0]; return SS.priceOf(G, it); });
    if (sb !== 0) bad.push('Sandbox pieces cost coins');
    // coins survive a reload and a backup round trip
    const kept = await page.evaluate(() => { const G = SSG; G.openMode('life'); G.save.coins = 1234; G.changed(true); G.openMode('sandbox'); G.openMode('life'); return G.save.coins; });
    if (kept !== 1234) bad.push('coins are not kept');
    // a gig: offered at the desk, accepted, designed in their room with lent pieces, handed in, rated and paid
    const g = await page.evaluate(() => {
      const G = SSG, out = []; G.save.coins = 500;
      const desk = G.W.pieces.find(p => p.id === 'desk'); const a = SS.ACTIONS.desk.find(x => x.fx === 'gig');
      G.bubble = { target: { piece: desk }, actions: [a], cur: 0, tip: [100, 100], title: 'DESK' }; G.doBubble(0);
      if (!G.menu || G.menu.kind !== 'gig' || G.menu.offers.length < 2) { out.push('Find a gig does not offer 2 or 3 gigs'); return out; }
      const homeN = G.W.pieces.length, homeSaved = JSON.parse(localStorage.getItem(SS.PRE + 'life')).pieces.length;
      SS.acceptGig(G, G.menu.offers[0]); if (!G.gig || G.W.pieces.length !== 0) out.push('accepting does not open their empty room');
      const it = G.catalogList('plants').items[0]; if (SS.priceOf(G, it) !== 0 || SS.cardTag(G, it).text !== 'FREE') out.push('gig pieces are not lent free');
      const o = G.gig.offer; const W = G.W;
      // match every like: a plant, books, a seat, a table, a rug, a lamp, art, soft things, in warm colors
      [['monstera', 0, 0], ['bookshelf', 2, 0], ['club-armchair', 1, 2], ['side-table', 3, 2], ['wool-rug', 1, 3], ['floor-lamp', 0, 2], ['two-seat-sofa', 2, 3]].forEach(q => { const p = { id: q[0], f: 0, x: W.ax + q[1], y: W.ay + q[2], r: 0, sw: 0 }; if (W.check(p).ok) W.add(p); });
      const segs = W.walls[0].filter(s => s.b && !s.op && !s.win); if (segs[0]) W.add({ id: 'framed-print', f: 0, wall: [segs[0].x, segs[0].y, segs[0].axis] });
      W.pieces.forEach(p => { const d = SS.DEF[p.id]; const part = d.parts[0] && d.parts[0][0]; if (part) p.colors = { [part]: '#e46f6a' }; });
      if (JSON.parse(localStorage.getItem(SS.PRE + 'life')).pieces.length !== homeSaved) out.push('a gig changes her own home\'s save');
      const m = SS.gigMatches(G); SS.handIn(G);
      if (!G.menu || G.menu.kind !== 'gigdone') { out.push('Hand in does not rate it'); return out; }
      if (G.menu.hearts !== Math.max(1, m.filter(Boolean).length)) out.push('the hearts do not follow the likes matched');
      const pay = G.menu.pay, c0 = G.save.coins; SS.gigDone(G);
      if (G.save.coins !== c0 + pay || pay < 100 || pay > 200) out.push('the gig does not pay 100 to 200');
      if (G.gig || G.W.pieces.length !== homeN) out.push('Done does not bring her home as she left it');
      if (!(G.save.friends && G.save.friends[o.who] >= 1)) out.push('the gig does not grow friendship');
      if (!SS.hasMoment('gig')) out.push('the first gig is not in the memory book');
      // even an empty room pays the lowest
      G.menu = { kind: 'gig', offers: [0, 1], cur: 0 }; SS.acceptGig(G, 0); SS.handIn(G); if (G.menu.hearts !== 1 || G.menu.pay !== 100) out.push('an empty design does not pay the lowest');
      SS.gigDone(G);
      return out;
    });
    g.forEach(o => bad.push(o));
    await page.evaluate(() => { SS.findGigs(SSG); }); await page.waitForTimeout(150); await page.screenshot({ path: path.join(DIST, 'screen-gig-375x667.png') });
    bad.push(...errors); await ctx.close();
    report('coins, the shop and gigs (spec 006 F): prices, buying, selling back on Keep, Sandbox free, coins kept, a gig offered, designed, rated and paid', bad);
  }

  // ---------- 6h. the Build screen: lots, rooms and walls (spec 004, parts A and B) ----------
  {
    const bad = [];
    for (const [w, h] of [[375, 667], [320, 480]]) {
      const { ctx, page, errors } = await fresh({ w, h, init: () => localStorage.setItem('ss.gift', '1') });
      // part A: each street lot and a Sandbox new lot in all three sizes, the 8 tools with the picked one named, the view moves
      const a = await page.evaluate(() => {
        const G = SSG, out = []; G.confirm = null; G.openMode('sandbox'); G.toastT = null;
        G.menuPick(SS.MENU_ROWS.findIndex(r => r[1] === 'homes'));
        const list = SS.homeList(G); if (list.length !== 4) out.push('Homes does not list the Philly home and the street\'s three lots: ' + list.length);
        ['lot-small', 'lot-medium', 'lot-large'].forEach((id, i) => {
          G.menu = { kind: 'homes', cur: 0 }; G.homePick(SS.homeList(G).findIndex(q => q.id === id));
          if (G.save.home !== id || G.W.lot !== [16, 24, 32][i]) out.push(id + ' does not open as a ' + [16, 24, 32][i] + ' lot');
          if (G.trayState() !== 'build') out.push(id + ' does not open on the Build tab');
        });
        [16, 24, 32].forEach(n => { SS.newLot(G, n); if (G.W.lot !== n || !/^new-/.test(G.save.home)) out.push('New lot ' + n + ' does not open'); });
        return out;
      });
      a.forEach(o => bad.push(w + 'x' + h + ': ' + o));
      // the tools row: 8 tools, tapping one names it
      await page.waitForTimeout(100);
      const tools = await page.evaluate(() => SSG.hits.filter(q => q.y > SSG.H - SS.TRAY_H.build + 15 && q.y < SSG.H - SS.TRAY_H.build + 40).length);
      if (tools < 8) bad.push(w + 'x' + h + ': the Build tab does not show 8 tools (' + tools + ')');
      const tb = await page.evaluate(() => { const q = SSG.hits.filter(q => q.y > SSG.H - SS.TRAY_H.build + 15 && q.y < SSG.H - SS.TRAY_H.build + 40)[7]; return [q.x + q.w / 2, q.y + q.h / 2]; });
      await tapAt(page, tb[0], tb[1]); await page.waitForTimeout(60);
      if (await page.evaluate(() => SSG.build.tool) !== 'erase') bad.push(w + 'x' + h + ': tapping the erase tool does not pick it');
      await page.evaluate(() => { SSG.build.tool = 'room'; });
      // the D-pad moves the view around a large lot, as far as its corners
      const pan = await page.evaluate(() => { const G = SSG, x0 = G.cam.x, y0 = G.cam.y; return { x0, y0 }; });
      for (let i = 0; i < 30; i++) await page.keyboard.press('ArrowRight');
      for (let i = 0; i < 30; i++) await page.keyboard.press('ArrowDown');
      const pan2 = await page.evaluate(() => ({ x: SSG.cam.x, y: SSG.cam.y }));
      if (pan2.x - pan.x0 < 150 || pan2.y - pan.y0 < 100) bad.push(w + 'x' + h + ': the D-pad does not slide far across a large lot: ' + JSON.stringify([pan, pan2]));
      if (w === 375) await page.screenshot({ path: path.join(DIST, 'screen-build-375x667.png') });
      bad.push(...errors.map(e => w + 'x' + h + ': ' + e)); await ctx.close();
    }
    const { ctx, page, errors } = await fresh({ init: () => localStorage.setItem('ss.gift', '1') });
    await page.evaluate(() => { const G = SSG; G.confirm = null; G.openMode('sandbox'); G.toastT = null; SS.goHome(G, 'lot-medium'); SS.enterBuild(G); G.cam.zoom = 1; G.centerCam(); });
    await page.waitForTimeout(80);
    // part B by touch: drag a box from one tile to another; the size tag shows while dragging; letting go builds the room
    const scr = (x, y) => page.evaluate(([x, y]) => { const q = SS.vp(x + .5, y + .5, 0); return SSG.toScreen(q[0], q[1]); }, [x, y]);
    const b = await page.locator('#cv').boundingBox(), k = b.width / 240;
    async function dragTiles(t0, t1, corner) {
      const p0 = corner ? await page.evaluate(([x, y]) => { const q = SS.vp(x, y, 0); return SSG.toScreen(q[0], q[1]); }, t0) : await scr(t0[0], t0[1]);
      const p1 = corner ? await page.evaluate(([x, y]) => { const q = SS.vp(x, y, 0); return SSG.toScreen(q[0], q[1]); }, t1) : await scr(t1[0], t1[1]);
      await page.mouse.move(b.x + p0[0] * k, b.y + p0[1] * k); await page.mouse.down();
      for (let s = 1; s <= 10; s++) { await page.mouse.move(b.x + (p0[0] + (p1[0] - p0[0]) * s / 10) * k, b.y + (p0[1] + (p1[1] - p0[1]) * s / 10) * k); await page.waitForTimeout(16); }
      const tag = await page.evaluate(() => SSG.build.drag && SSG.build.drag.tag);
      await page.mouse.up(); await page.waitForTimeout(60);
      return tag;
    }
    const tag = await dragTiles([10, 10], [14, 15]);
    if (tag !== '5 × 6') bad.push('the size tag does not show 5 × 6 while dragging (' + tag + ')');
    const R1 = await page.evaluate(() => SSG.W.home.floors[0].rooms.map(r => r.t.length));
    if (R1.length !== 1 || R1[0] !== 30) bad.push('dragging a box does not build a 5 × 6 room: ' + JSON.stringify(R1));
    // the rules: 2 × 2 at least, inside the lot; against another room it shares the wall
    const rules = await page.evaluate(() => {
      const G = SSG, out = [], B = SS._build, D = () => SS.toLotForm(SS.homeData(G.save, G.save.home));
      if (B.roomEdit(D(), 0, 2, 2, 3, 3).D) out.push('a 1 × 1 room can be built');
      if (!B.roomEdit(D(), 0, 2, 2, 4, 4).D) out.push('a 2 × 2 room can\'t be built');
      if (B.roomEdit(D(), 0, 22, 2, 25, 5).D) out.push('a room can go past the lot\'s edge');
      const r = B.roomEdit(D(), 0, 15, 10, 18, 13); if (!r.D) { out.push('a room against another can\'t be built'); return out; }
      SS.buildCommit(G, r.D);
      const W = G.W; if (W.home.floors[0].rooms.length !== 2) out.push('two rooms side by side are not two rooms');
      const shared = W.walls[0].filter(s => s.axis === 'y' && s.x === 15 && s.y >= 10 && s.y < 13); if (shared.length !== 3 || shared.some(s => !s.a || !s.b)) out.push('rooms side by side do not share one wall');
      return out;
    });
    rules.forEach(o => bad.push(o));
    // the wall tool: a line across a room cuts it in two; walls closing in a space make it a room
    await page.evaluate(() => { SSG.build.tool = 'wall'; });
    await dragTiles([12, 10], [12, 16], true);
    const cut = await page.evaluate(() => SSG.W.home.floors[0].rooms.map(r => r.t.length).sort((a, b) => a - b));
    if (JSON.stringify(cut) !== '[9,12,18]') bad.push('a wall across a room does not cut it in two: ' + JSON.stringify(cut));
    const shut = await page.evaluate(() => {
      const G = SSG, B = SS._build; let D = SS.toLotForm(SS.homeData(G.save, G.save.home));
      [['x', 2, 2, 5], ['x', 5, 2, 5], ['y', 2, 2, 5], ['y', 5, 2, 5]].forEach(q => { const r = B.wallEdit(D, 0, q[0], q[1], q[2], q[3]); if (r.D) D = r.D; });
      SS.buildCommit(G, D); return G.W.home.floors[0].rooms.map(r => r.t.length).sort((a, b) => a - b);
    });
    if (shut.indexOf(9) < 0 || shut.length !== 4) bad.push('four walls around a space do not make it a room: ' + JSON.stringify(shut));
    // tap a wall to pick it; the D-pad moves it a tile; the chip erases it
    await page.evaluate(() => { SSG.build.tool = 'room'; SSG.walls = 'up'; });
    const wp = await page.evaluate(() => { const G = SSG, s = G.W.seg(0, 12, 12, 'y'), q = SS.vp(12, 12.5, 23); return G.toScreen(q[0], q[1]); });
    await tapAt(page, wp[0], wp[1]);
    const picked = await page.evaluate(() => SSG.build.wall && SSG.build.wall.run.length);
    if (picked !== 6) bad.push('tapping a wall does not pick its whole run (' + picked + ')');
    else {
      const before = await page.evaluate(() => SSG.W.room(0, 10, 11).t.length);
      await page.evaluate(() => SS.moveWall(SSG, 1));
      const after = await page.evaluate(() => ({ rooms: SSG.W.room(0, 10, 11).t.length, at: SSG.build.wall && SSG.build.wall.run[0][0] }));
      if (before !== 12 || after.rooms !== 18 || after.at !== 13) bad.push('moving a wall a tile does not move it: ' + JSON.stringify([before, after]));
      await page.evaluate(() => SS.eraseWall(SSG));
      const er = await page.evaluate(() => SSG.W.home.floors[0].rooms.map(r => r.t.length).sort((a, b) => a - b));
      if (JSON.stringify(er) !== '[9,9,30]') bad.push('erasing the wall between two rooms does not open them into one: ' + JSON.stringify(er));
    }
    // erase a floor tile; undo steps back through the changes
    const un = await page.evaluate(() => {
      const G = SSG, out = [], n0 = G.undo.length; G.build.tool = 'erase';
      const tiles = () => G.W.home.floors[0].rooms.reduce((n, r) => n + r.t.length, 0), t0 = tiles();
      G.walls = 'down'; const q = SS.vp(10.5, 10.5, 0); SS.buildTap(G, q, [10, 10, 10.5, 10.5]);
      if (tiles() !== t0 - 1) out.push('erase does not take out a floor tile: ' + (G.toastT && G.toastT.text));
      SS.buildTap(G, SS.vp(11.5, 12.5, 0), [11, 12, 11.5, 12.5]); if (tiles() !== t0 - 1) out.push('a hole can be erased in the middle of a room');
      if (G.undo.length < 5) out.push('build changes are not undo steps (' + G.undo.length + ')');
      while (G.undo.length) G.doUndo();
      if (G.W.home.floors[0].rooms.length) out.push('undoing every change does not bring back the empty lot');
      void n0; return out;
    });
    un.forEach(o => bad.push(o));
    // the Philly home: a wall moved over furniture sends it to storage, so nothing is lost; walls kept after reopening
    const ph = await page.evaluate(() => {
      const G = SSG, out = []; SS.goHome(G, 'philly'); SS.enterBuild(G); G.setFloor(0); G.floor = 0;
      const n0 = G.W.pieces.length + G.save.stored.length;
      const s = G.W.seg(0, 9, 11, 'x'); G.build.wall = { f: 0, run: SS.wallRun(G.W, 0, s).map(q => [q.x, q.y, q.axis]) };
      SS.moveWall(G, 1);   // the dining nook's wall a tile into the living room, over the lamps and the plant
      if (!G.W.seg(0, 9, 12, 'x')) out.push('the wall did not move: ' + (G.toastT && G.toastT.text));
      // the front wall can't move in: the floors above would hang over nothing
      const f2 = G.W.seg(0, 6, 16, 'x'); G.build.wall = { f: 0, run: SS.wallRun(G.W, 0, f2).map(q => [q.x, q.y, q.axis]) }; SS.moveWall(G, -1);
      if (!G.W.seg(0, 6, 16, 'x')) out.push('the front wall moved in under the floors above');
      if (G.W.pieces.length + G.save.stored.length !== n0) out.push('pieces were lost when a wall moved');
      if (!G.save.stored.length) out.push('a piece in the way of a moved wall did not go to storage');
      const bad2 = G.W.pieces.filter(p => !p.host && !G.W.check(p.wall ? { id: p.id, f: p.f, wall: p.wall, side: p.side } : { id: p.id, f: p.f, x: p.x, y: p.y, r: p.r || 0 }, p).ok && /OUTSIDE|WALL/.test(G.W.check(p.wall ? { id: p.id, f: p.f, wall: p.wall, side: p.side } : { id: p.id, f: p.f, x: p.x, y: p.y, r: p.r || 0 }, p).why));
      if (bad2.length) out.push('pieces are left in walls or outside: ' + bad2.map(p => p.id).join());
      const living = (G.W.room(0, 5, 14).t || []).length; G.changed(true); G.openMode('life'); G.openMode('sandbox');
      if (!G.W.room(0, 5, 14) || G.W.room(0, 5, 14).t.length !== living) out.push('the Philly home\'s new walls are not kept');
      // she left off on another lot: Continue opens it there, with her home waiting
      SS.goHome(G, 'lot-medium'); G.changed(true); G.openMode('life'); G.openMode('sandbox');
      if (G.save.home !== 'lot-medium' || G.W.lot !== 24 || !G.away) out.push('reopening does not go back to the lot she was on');
      SS.goHome(G, 'philly'); if (G.W.lot !== 16 || !G.agents.length) out.push('going home does not bring back the home and everyone in it');
      return out;
    });
    ph.forEach(o => bad.push(o));
    // Life: walls and floors cost 5 coins a tile, shown before she lets go; erasing gives back what she paid; not enough is refused
    const life = await page.evaluate(() => {
      const G = SSG, out = []; G.openMode('life'); G.toastT = null; SS.goHome(G, 'lot-small'); SS.enterBuild(G); G.build.tool = 'room'; G.save.coins = 500;
      SS.buildDragStart(G, [2, 2, 2.5, 2.5]); SS.buildDrag(G, [4, 4, 4.5, 4.5]);
      const shown = G.build.drag.cost; SS.buildDragEnd(G);
      if (shown !== (9 + 12) * 5) out.push('a 3 × 3 room does not show 105 coins: ' + shown);
      if (G.save.coins !== 500 - 105) out.push('building does not charge: ' + G.save.coins);
      const s = G.W.seg(0, 2, 2, 'x'); G.build.wall = { f: 0, run: SS.wallRun(G.W, 0, s).map(q => [q.x, q.y, q.axis]) }; SS.eraseWall(G);
      if (G.save.coins !== 500 - 105 + 15) out.push('erasing a wall does not give its coins back: ' + G.save.coins);
      G.save.coins = 10; const n = G.W.home.floors[0].rooms.length; SS.buildDragStart(G, [8, 8, 8.5, 8.5]); SS.buildDrag(G, [10, 10, 10.5, 10.5]); SS.buildDragEnd(G);
      if (G.W.home.floors[0].rooms.length !== n || G.save.coins !== 10) out.push('a room she can\'t afford still gets built');
      if (!SS.hasMoment('first-wall')) out.push('the first wall on an empty lot is not in the memory book');
      SS.goHome(G, 'philly');
      return out;
    });
    life.forEach(o => bad.push(o));
    bad.push(...errors); await ctx.close();
    report('the Build screen (spec 004 A, B): lots in 3 sizes, the 8 tools, rooms with a size tag, single walls, pick, move and erase, nothing lost, undo, prices, saved', bad);
  }

  // ---------- 6i. outfits: the Style screen and wearing pieces (spec 002, parts A and B) ----------
  {
    const bad = [];
    for (const [w, h] of [[375, 667], [320, 480]]) {
      const { ctx, page, errors } = await fresh({ w, h, init: () => localStorage.setItem('ss.gift', '1') });
      // Style opens from a person, from a wardrobe, from the Start menu's People row; the person spins all four ways
      const r = await page.evaluate(() => {
        const G = SSG, out = []; G.confirm = null; G.openMode('sandbox'); G.toastT = null;
        G.menuPick(SS.MENU_ROWS.findIndex(q => q[1] === 'people')); if (!G.menu || G.menu.kind !== 'people') out.push('People does not list the people'); else { SS.peoplePress(G, 'a'); if (!G.menu || G.menu.kind !== 'style') out.push('People does not open Style'); }
        G.menu = null; G.openMode('life'); G.toastT = null;
        const ward = G.W.pieces.find(p => p.id === 'wardrobe'); const acts = SS.actionsFor(G, { piece: ward }); const ch = acts.findIndex(a => a.fx === 'style');
        G.bubble = { target: { piece: ward }, actions: acts, cur: 0, tip: [100, 100], title: 'W' }; G.doBubble(ch);
        if (!G.menu || G.menu.kind !== 'style' || G.menu.who !== 'sarah') out.push('Change outfit at the wardrobe does not open Style');
        G.menu = null; const ka = SS.actionsFor(G, { agent: G.people.keegan }); const ks = ka.findIndex(a => a.fx === 'style');
        G.bubble = { target: { agent: G.people.keegan }, actions: ka, cur: 0, tip: [100, 100], title: 'K' }; G.doBubble(ks);
        if (!G.menu || G.menu.kind !== 'style' || G.menu.who !== 'keegan') out.push('Style from Keegan does not open on him');
        G.menu = null; G.openMode('sandbox'); G.toastT = null;
        return out;
      });
      r.forEach(o => bad.push(w + 'x' + h + ': ' + o));
      // a tap on Sarah while decorating opens Style on her
      await page.evaluate(() => { const G = SSG; G.tray.open = false; G.menu = null; G.version++; });
      await page.waitForTimeout(150);
      const sp = await page.evaluate(() => { const G = SSG, s = G.people.sarah; if (s.f !== G.floor) G.setFloor(s.f); s.path = []; const q = SS.vp(s.x, s.y, s.f * SS.FH + 16); G.cam.x = q[0] + SS.OFF[0]; G.cam.y = q[1] + SS.OFF[1] + 20; return null; });
      await page.waitForTimeout(150);
      const sp2 = await page.evaluate(() => { const G = SSG, s = G.people.sarah; let best = null; [16, 20, 12, 24, 8, 28].forEach(dz => [0, -2, 2].forEach(dx => { if (best) return; const q = SS.vp(s.x, s.y, s.f * SS.FH + dz); const pk = SS.pick(G.lastHits || [], q[0] + dx, q[1]); if (pk && pk.agent === s) best = G.toScreen(q[0] + dx, q[1]); })); if (!best) { const q = SS.vp(s.x, s.y, s.f * SS.FH + 16); best = G.toScreen(q[0], q[1]); } return best; }); void sp;
      await page.waitForTimeout(150);
      await tapAt(page, sp2[0], sp2[1]);
      const tapped = await page.evaluate(() => SSG.menu && SSG.menu.kind === 'style' && SSG.menu.who);
      if (tapped !== 'sarah') bad.push(w + 'x' + h + ': tapping Sarah does not open Style on her (' + tapped + ')');
      await page.evaluate(() => SS.openStyle(SSG, 'sarah'));
      for (let f = 0; f < 4; f++) {
        await page.waitForTimeout(80);
        const fit = await page.evaluate(() => { const F = SSG.menu.fig; return F && F.y >= 20 && F.y + F.h <= SSG.H - SS.STYLE_TRAY + 4 && F.x >= 0 && F.x + F.w <= 240; });
        if (!fit) bad.push(w + 'x' + h + ': the person is cut off in turn ' + f);
        if (w === 375) await page.screenshot({ path: path.join(DIST, 'screen-style-' + ['front', 'side', 'back', 'side2'][f] + '-375x667.png') });
        await page.keyboard.press('Backspace');   // Select spins a quarter turn
      }
      if (await page.evaluate(() => SSG.menu.face) !== 0) bad.push(w + 'x' + h + ': four spins do not come back to the front');
      bad.push(...errors.map(e => w + 'x' + h + ': ' + e)); await ctx.close();
    }
    const { ctx, page, errors } = await fresh({ init: () => localStorage.setItem('ss.gift', '1') });
    const r2 = await page.evaluate(() => {
      const G = SSG, out = []; G.confirm = null; G.openMode('sandbox'); G.toastT = null; SS.openStyle(G, 'sarah');
      const o = () => SS.outfitOf(G, 'sarah');
      // every piece on and off by tap, for both of them
      ['sarah', 'keegan'].forEach(who => { G.menu.who = who; SS.CLOTHES.forEach(d => {
        const was = !!(SS.outfitOf(G, who)[d.slot] && SS.outfitOf(G, who)[d.slot].id === d.id);
        if (was) SS.wear(G, who, d.id);
        SS.wear(G, who, d.id); if (!(SS.outfitOf(G, who)[d.slot] && SS.outfitOf(G, who)[d.slot].id === d.id)) out.push(d.id + ' does not go on ' + who);
        SS.wear(G, who, d.id); if (SS.outfitOf(G, who)[d.slot] && SS.outfitOf(G, who)[d.slot].id === d.id) out.push(d.id + ' does not come off ' + who);
        SS.figure(G, who, 0, 0); SS.figure(G, who, 1, 0); SS.figure(G, who, 2, 0);
      }); });
      G.menu.who = 'sarah';
      // layering: a dress takes off the top and bottom; a coat stays over it; a top takes the dress off
      SS.wear(G, 'sarah', 'orange-rocks-tee'); SS.wear(G, 'sarah', 'straight-jeans'); SS.wear(G, 'sarah', 'long-wool-coat'); SS.wear(G, 'sarah', 'pink-slip-dress');
      if (o().top || o().bottom || !o().dress || !o().coat) out.push('a dress does not replace the top and bottom under a coat: ' + JSON.stringify(o()));
      SS.wear(G, 'sarah', 'lilac-hoodie'); if (o().dress || !o().top) out.push('a top does not take the dress off');
      // Sarah's hair: styles only, always ginger
      const hair = SS.styleCards(G, 'sarah', 'hair'); if (hair.some(c => c.shade !== undefined) || hair.length !== 4) out.push('Sarah\'s hair tab is not just her 4 styles');
      SS.setHair(G, 'sarah', 'bob', 3); if (o().shade !== undefined || o().hair !== 'bob') out.push('Sarah\'s hair can be recolored');
      if (!SS.styleCards(G, 'keegan', 'hair').some(c => c.shade !== undefined)) out.push('Keegan\'s hair has no colors');
      if (SS.styleCards(G, 'sarah', 'ours').length < 5 || SS.styleCards(G, 'sarah', 'ours').some(c => !c.piece.ours)) out.push('Ours does not list their real clothes');
      // kept: reopening the mode keeps what they wear
      G.changed(true); G.menu = null; G.openMode('life'); G.openMode('sandbox'); if (SS.outfitOf(G, 'sarah').hair !== 'bob' || SS.outfitOf(G, 'sarah').top.id !== 'lilac-hoodie') out.push('outfits are not kept');
      // Life: a piece she doesn't have costs its price; not enough coins is refused
      G.openMode('life'); G.toastT = null; SS.openStyle(G, 'sarah'); G.save.coins = 500;
      SS.wear(G, 'sarah', 'pleated-skirt'); if (G.save.coins !== 430) out.push('a new piece in Life does not cost its price: ' + G.save.coins);
      SS.wear(G, 'sarah', 'pleated-skirt'); SS.wear(G, 'sarah', 'pleated-skirt'); if (G.save.coins !== 430) out.push('a piece she owns costs again');
      G.save.coins = 10; SS.wear(G, 'sarah', 'long-wool-coat'); if (SS.outfitOf(G, 'sarah').coat) out.push('a piece she can\'t afford still goes on');
      // Ralph's bowtie
      G.menu = null; SS.ralphBow(G); G.confirmPick(1); if (!G.save.ralphBow) out.push('Ralph\'s bowtie does not go on');
      return out;
    });
    r2.forEach(o => bad.push(o));
    // by touch: drag a card onto the person; swipe across them to spin
    await page.evaluate(() => { const G = SSG; G.menu = null; G.openMode('sandbox'); SS.openStyle(G, 'sarah'); G.menu.tab = 'bottoms'; });
    await page.waitForTimeout(150);
    const pts = await page.evaluate(() => { const G = SSG, cards = G.hits.filter(h => h.styleCard), card = cards.find(h => h.styleCard.piece.id === 'pleated-skirt'), F = G.menu.fig; return { card: [card.x + 20, card.y + 14], fig: [F.x + F.w / 2, F.y + 60] }; });
    const bb = await page.locator('#cv').boundingBox(), k = bb.width / 240;
    await page.mouse.move(bb.x + pts.card[0] * k, bb.y + pts.card[1] * k); await page.mouse.down();
    for (let s = 1; s <= 10; s++) { await page.mouse.move(bb.x + (pts.card[0] + (pts.fig[0] - pts.card[0]) * s / 10) * k, bb.y + (pts.card[1] + (pts.fig[1] - pts.card[1]) * s / 10) * k); await page.waitForTimeout(16); }
    await page.mouse.up(); await page.waitForTimeout(60);
    if (await page.evaluate(() => (SS.outfitOf(SSG, 'sarah').bottom || {}).id) !== 'pleated-skirt') bad.push('dragging a card onto the person does not put it on');
    await page.mouse.move(bb.x + (pts.fig[0] + 30) * k, bb.y + (pts.fig[1] - 20) * k); await page.mouse.down(); await page.mouse.move(bb.x + (pts.fig[0] - 30) * k, bb.y + (pts.fig[1] - 20) * k, { steps: 6 }); await page.mouse.up();
    if (await page.evaluate(() => SSG.menu.face) !== 1) bad.push('a swipe across the person does not spin them');
    bad.push(...errors); await ctx.close();
    report('outfits (spec 002 A, B): Style from a person, a wardrobe and People, four turns at 375 x 667 and 320 x 480, 10 pieces on and off by tap and drag, layers, ginger hair, prices, kept, the bowtie', bad);
  }

  // ---------- 6j. the Creator (spec 003, parts A and B) ----------
  {
    const bad = [];
    for (const [w, h] of [[375, 667], [320, 480]]) {
      const { ctx, page, errors } = await fresh({ w, h, init: () => localStorage.setItem('ss.gift', '1') });
      const r = await page.evaluate(() => {
        const G = SSG, out = []; G.confirm = null; G.openMode('sandbox'); G.toastT = null;
        // People has New person at the bottom, and it opens the Creator
        G.menuPick(SS.MENU_ROWS.findIndex(q => q[1] === 'people')); const n = SS.styleWho(G).length;
        G.menu.cur = n; SS.peoplePress(G, 'a'); if (!G.menu || G.menu.kind !== 'creator') { out.push('New person does not open the Creator'); return out; }
        return out;
      });
      r.forEach(o => bad.push(w + 'x' + h + ': ' + o));
      // all nine tabs, nothing cut off, the person spins
      for (const tab of ['age', 'face', 'eyes', 'nose', 'lips', 'hair', 'body', 'skin', 'more']) {
        await page.evaluate(t => { SSG.menu.tab = t; }, tab); await page.waitForTimeout(60);
        const ok = await page.evaluate(() => { const hs = SSG.hits.filter(q => q.y > SSG.H - SS.CREATOR_TRAY); return hs.length > 3 && hs.every(q => q.x >= -1 && q.x + q.w <= 241 && q.y + q.h <= SSG.H + 1); });
        if (!ok) bad.push(w + 'x' + h + ': the ' + tab + ' tab is cut off');
        if (w === 375 && (tab === 'eyes' || tab === 'hair')) await page.screenshot({ path: path.join(DIST, 'screen-creator-' + tab + '-375x667.png') });
      }
      for (let f = 0; f < 4; f++) { await page.keyboard.press('Backspace'); await page.waitForTimeout(40); }
      if (await page.evaluate(() => SSG.menu.face) !== 0) bad.push(w + 'x' + h + ': Select does not spin the person all the way round');
      bad.push(...errors.map(e => w + 'x' + h + ': ' + e)); await ctx.close();
    }
    const { ctx, page, errors } = await fresh({ init: () => localStorage.setItem('ss.gift', '1') });
    const r2 = await page.evaluate(() => {
      const G = SSG, out = []; G.confirm = null; G.openMode('sandbox'); G.toastT = null; SS.openCreator(G);
      const m = () => G.menu, img = () => SS.figure(G, 'draft', 0, 0).toDataURL();
      // every shape and color on the lists, the person changes straight away
      const lists = { face: ['round', 'oval', 'heart', 'square'], eyes: ['almond', 'round', 'sleepy', 'lashes', 'small'], nose: ['button', 'long', 'wide', 'pointed'], lips: ['smile', 'full', 'small', 'soft'], build: ['slim', 'broad', 'curvy', 'sturdy'], hair: Object.keys(SS.HAIRSTYLES) };
      Object.keys(lists).forEach(k => { let last = null; lists[k].forEach(v => { SS.creatorSet(G, k, v); [0, 1, 2].forEach(f => SS.figure(G, 'draft', f, 0)); const now = img(); if (now === last) out.push(k + ' ' + v + ' does not change the person'); last = now; }); });
      [['skin', SS.SKINS.length], ['eye', SS.EYE_COLORS.length], ['lip', SS.LIP_COLORS.length], ['shade', SS.HAIR_SHADES.length]].forEach(q => { let last = null; for (let i = 0; i < q[1]; i++) { SS.creatorSet(G, q[0], i); const now = img(); if (now === last) out.push(q[0] + ' ' + i + ' does not change the person'); last = now; } });
      if (SS.SKINS.length !== 16 || SS.HAIR_SHADES.length !== 16 || SS.EYE_COLORS.length !== 12 || SS.LIP_COLORS.length !== 10) out.push('the color lists are not 16 skins, 16 hair shades, 12 eye and 10 lip colors');
      // Undo steps back; Random rolls a new person (or just the open tab)
      const before = JSON.stringify(m().p); SS.creatorSet(G, 'face', 'heart'); SS.creatorUndo(G); if (JSON.stringify(m().p) !== before) out.push('Undo does not step back');
      for (let i = 0; i < 25; i++) SS.creatorSet(G, 'face', ['round', 'oval'][i % 2]); if (m().undo.length !== 20) out.push('Undo does not keep 20 steps');
      const p0 = JSON.stringify(m().p); let changed = false; for (let i = 0; i < 5 && !changed; i++) { SS.creatorRandom(G); changed = JSON.stringify(m().p) !== p0; } if (!changed) out.push('Random does not roll a new person');
      const L0 = JSON.parse(JSON.stringify(m().p.look)); SS.creatorRandom(G, 'hair'); const L1 = m().p.look; if (JSON.stringify(L0) !== JSON.stringify(L1)) out.push('holding Random on Hair changes more than the hair');
      // Done: a name, then Style for the new person; kept in this mode's save
      const id = SS.creatorDone(G, 'Robin');
      if (!G.menu || G.menu.kind !== 'style' || G.menu.who !== id) out.push('Done does not open Style for the new person');
      if (SS.personName(G, id) !== 'ROBIN') out.push('the new person is not named');
      SS.wear(G, id, 'pink-slip-dress'); if (!SS.styleCards(G, id, 'hair').some(c => c.shade !== undefined)) out.push('a made person has no hair colors in Style');
      G.menu = null; G.changed(true); G.openMode('life'); if (SS.madePeople(G).length) out.push('a person made in Sandbox shows up in Life');
      G.openMode('sandbox'); if (!SS.madePeople(G).some(q => q.id === id) || SS.outfitOf(G, id).dress.id !== 'pink-slip-dress') out.push('the made person is not kept');
      // Keegan and Sarah are never opened in the Creator: People opens Style for them
      SS.openPeople(G); G.menu.cur = 0; SS.peoplePress(G, 'a'); if (G.menu.kind !== 'style' || G.menu.who !== 'sarah') out.push('Sarah does not open in Style');
      return out;
    });
    r2.forEach(o => bad.push(o));
    // by touch: a swipe across the person spins them; a tap on a shape card picks it
    await page.evaluate(() => { const G = SSG; G.menu = null; SS.openCreator(G); G.menu.tab = 'nose'; });
    await page.waitForTimeout(120);
    const card = await page.evaluate(() => { const hs = SSG.hits.filter(q => q.y > SSG.H - SS.CREATOR_TRAY + 25 && q.w === 55 && q.h === 26); const q = hs[2]; return [q.x + 20, q.y + 10]; });
    await tapAt(page, card[0], card[1]);
    if (await page.evaluate(() => SSG.menu.p.look.nose) !== 'wide') bad.push('tapping a shape card does not pick it');
    const bb = await page.locator('#cv').boundingBox(), k = bb.width / 240;
    await page.mouse.move(bb.x + 160 * k, bb.y + 150 * k); await page.mouse.down(); await page.mouse.move(bb.x + 90 * k, bb.y + 150 * k, { steps: 6 }); await page.mouse.up();
    if (await page.evaluate(() => SSG.menu.face) !== 1) bad.push('a swipe does not spin the person');
    bad.push(...errors); await ctx.close();
    report('the Creator (spec 003 A, B): New person from People, nine tabs at 375 x 667 and 320 x 480, every shape and color, Random, Undo, Done to Style, kept per mode', bad);
  }

  // ---------- 6c. turning the home (bible, Building, Turning the home; spec 001, part B) ----------
  {
    const bad = [];
    const { ctx, page, errors } = await fresh({ init: () => localStorage.setItem('ss.gift', '1') });
    await page.evaluate(() => { SSG.confirm = null; SS.setClock(14, 0); SSG.openMode('sandbox'); SSG.toastT = null; });
    await page.waitForTimeout(200);
    // the turn button under the walls button: a quarter turn, the same spot in the middle and the same zoom
    const before = await page.evaluate(() => { const G = SSG; G.cam.zoom = 2; const v = SS.I.tile(G.cam.x - SS.OFF[0], G.cam.y - SS.OFF[1], 0); return { k: SS.view.k, w: SS.vinv(v[0], v[1]), zoom: G.cam.zoom, btn: G.turnBtn }; });
    await page.waitForTimeout(100);
    const btn = await page.evaluate(() => SSG.turnBtn);
    if (!btn) bad.push('there is no turn button');
    else {
      await tapAt(page, btn.x + btn.w / 2, btn.y + btn.h / 2);
      const after = await page.evaluate(() => { const G = SSG; const v = SS.I.tile(G.cam.x - SS.OFF[0], G.cam.y - SS.OFF[1], 0); return { k: SS.view.k, w: SS.vinv(v[0], v[1]), zoom: G.cam.zoom, saved: G.save.view, anim: !!G.turnAnim }; });
      if (after.k !== (before.k + 1) % 4) bad.push('the turn button does not turn the home a quarter turn');
      if (Math.hypot(after.w[0] - before.w[0], after.w[1] - before.w[1]) > .6) bad.push('turning moves the spot in the middle of the screen');
      if (after.zoom !== before.zoom) bad.push('turning changes the zoom');
      if (!after.anim) bad.push('turning has no spin or fade');
      await page.waitForTimeout(450);
      if (await page.evaluate(() => !!SSG.turnAnim)) bad.push('the turn takes longer than half a second');
    }
    // Select turns the home with nothing picked; a picked piece still turns with Select
    const sel = await page.evaluate(() => { const G = SSG, k0 = SS.view.k; G.deselect(); G.hold = null; G.focus = null; return k0; });
    await page.keyboard.press('Backspace'); await page.waitForTimeout(60);
    if (await page.evaluate(k0 => SS.view.k !== (k0 + 1) % 4, sel)) bad.push('Select does not turn the home when nothing is picked');
    const turnPiece = await page.evaluate(() => { const G = SSG, p = G.W.pieces.find(q => q.id === 'club-armchair'); G.select(p); return { r: p.r || 0, k: SS.view.k, uid: p.uid }; });
    await page.keyboard.press('Backspace'); await page.waitForTimeout(60);
    if (await page.evaluate(o => SS.view.k !== o.k || (SSG.W.byUid[o.uid].r || 0) === o.r, turnPiece)) bad.push('with a piece picked, Select does not turn the piece (or turns the home)');
    await page.evaluate(() => { SSG.deselect(); });
    // every view: walls, sorting, taps, placing, stacking, the D-pad
    for (let k = 0; k < 4; k++) {
      const r = await page.evaluate(async k => {
        const G = SSG, W = G.W, out = [], sort = StudioIso.sort; let last = null;
        SS.view.k = k; G.save.view = k; G.hold = null; G.deselect(); G.tray.open = true;
        // cut away lowers the walls nearest her: only the outside walls on the far sides stay up
        const vr = SS.vrect(W.ax, W.ay, W.ax + W.home.w, W.ay + W.home.d);
        for (let f = 0; f < 3; f++) SS.viewWalls(W, f).forEach(s => {
          const far = (s.axis === 'x' && s.y === vr[1]) || (s.axis === 'y' && s.x === vr[0]), near = (s.axis === 'x' && s.y === vr[3]) || (s.axis === 'y' && s.x === vr[2]);
          if (s.back && !far) out.push('view ' + k + ': a wall that is not on the far side stays up when cut away');
          if (near && s.back) out.push('view ' + k + ': a near outside wall stays up');
          if (far && s.ext && !s.back) out.push('view ' + k + ': a far outside wall is cut down');
        });
        // nothing draws through a wall, walls up or cut, on every floor
        StudioIso.sort = items => (last = sort(items));
        for (const mode of ['up', 'cut']) for (const f of [0, 1, 2]) {
          G.walls = mode; G.setFloor(f); last = null; await new Promise(r => setTimeout(r, 120));
          if (!last) { out.push('view ' + k + ': nothing drawn'); continue; }
          last.forEach((w, i) => { if (!w.plane || w.kind !== 'wall') return; last.forEach((o, j) => {
            const d = o.drawn || [o.l, o.t, o.r, o.b]; if (o.kind !== 'piece' || d[2] <= w.l || w.r <= d[0] || d[3] <= w.t || w.b <= d[1]) return;
            const lo = w.plane.axis === 'x' ? o.y0 : o.x0, hi = w.plane.axis === 'x' ? o.y1 : o.x1, at = w.plane.at;
            if (lo < at - 1e-4 && hi > at + 1e-4) return;
            const front = lo >= at - 1e-4; if (front !== (j > i)) out.push('view ' + k + ': ' + o.p.id + ' draws ' + (front ? 'behind' : 'over') + ' a wall on floor ' + (f + 1) + ' (walls ' + mode + ')');
          }); });
        }
        StudioIso.sort = sort; G.walls = 'cut'; G.setFloor(0);
        await new Promise(r => setTimeout(r, 120));
        return [...new Set(out)];
      }, k);
      r.forEach(o => bad.push(o));
      // placing by touch: a card dragged to a free tile lands on that tile, in this view
      const place = await page.evaluate(k => {
        const G = SSG, W = G.W, d = SS.DEF['side-table'], f = 0;
        let tile = null; for (let x = W.ax; x < W.ax + W.home.w && !tile; x++) for (let y = W.ay; y < W.ay + W.home.d && !tile; y++) { if (!W.check({ id: d.id, f, x, y, r: 0 }).ok) continue; const q = SS.vp(x + .5, y + .5, 0), s = G.toScreen(q[0], q[1]); if (s[0] > 30 && s[0] < 200 && s[1] > 60 && s[1] < G.viewBottom - 20) tile = { x, y, s }; }
        if (!tile) return { err: 'no free tile on screen' };
        G.takeCard({ id: d.id, def: d, sw: 0, stored: 0 }, { x: tile.s[0], y: tile.s[1] });
        const cand = G.hold && G.hold.cand; G.hold = null;
        return { tile, cand };
      }, k);
      if (place.err) bad.push('view ' + k + ': ' + place.err);
      else if (!place.cand || place.cand.x !== place.tile.x || place.cand.y !== place.tile.y) bad.push('view ' + k + ': a piece dragged to tile ' + place.tile.x + ',' + place.tile.y + ' lands at ' + JSON.stringify(place.cand));
      // stacking: a small thing over a table's free spot stacks there
      const stack = await page.evaluate(() => {
        // a table, counter or shelf whose free spot she can see in this view (not hidden behind something in front)
        const G = SSG, W = G.W, d = SS.DEF['mugs']; let host = null, s = null;
        W.pieces.filter(p => W.floorOf(p) === 0 && !p.wall && W.def(p).spots.length).forEach(p => W.def(p).spots.forEach((_, i) => {
          if (host || !W.spotFree(p, i)) return; const pos = W.spotPos(p, i), q = SS.vp(pos.x, pos.y, pos.z), pk = SS.pick(G.lastHits, q[0], q[1] - 1, { noAgents: true });
          if (pk && pk.piece === p) { host = p; s = G.toScreen(q[0], q[1] - 1); } }));
        if (!host) return { err: 'no free spot on screen' };
        G.takeCard({ id: d.id, def: d, sw: 0, stored: 0 }, { x: s[0], y: s[1] });
        const cand = G.hold && G.hold.cand; G.hold = null; return { host: host.uid, id: host.id, cand };
      });
      if (stack.err) bad.push('view ' + k + ': ' + stack.err); else if (!stack.cand || stack.cand.host !== stack.host) bad.push('view ' + k + ': a small thing over the ' + stack.id + ' does not stack on it: ' + JSON.stringify(stack.cand));
      // the D-pad moves a held piece the way it points on screen
      await page.evaluate(() => { const G = SSG, d = SS.DEF['side-table']; G.takeCard({ id: d.id, def: d, sw: 0, stored: 0 }); });
      const scr = () => page.evaluate(() => { const H = SSG.hold, sz = SSG.W.size(SS.DEF[H.inst.id], H.r), q = SS.vp(H.cand.x + sz[0] / 2, H.cand.y + sz[1] / 2, 0); return SSG.toScreen(q[0], q[1]); });
      const s0 = await scr(); await page.keyboard.press('ArrowRight'); await page.waitForTimeout(40); const s1 = await scr(); await page.keyboard.press('ArrowUp'); await page.waitForTimeout(40); const s2 = await scr();
      if (!(s1[0] > s0[0])) bad.push('view ' + k + ': right on the D-pad does not move a held piece right on screen');
      if (!(s2[1] < s1[1])) bad.push('view ' + k + ': up on the D-pad does not move a held piece up on screen');
      await page.evaluate(() => { SSG.hold = null; });
      await page.screenshot({ path: path.join(DIST, 'screen-turn' + k + '-375x667.png') });
    }
    // tap-to-walk in Life: a tap on a floor tile walks Sarah to that very tile, in every view
    await page.evaluate(() => { SS.setClock(14, 0); SSG.openMode('life'); SS.stopSarahIdle(SSG); SS.stopActions(SSG); SSG.setFloor(0); SSG.toastT = null; });
    for (let k = 0; k < 4; k++) {
      const tgt = await page.evaluate(async k => {
        const G = SSG, W = G.W, s = G.people.sarah; SS.view.k = k; G.bubble = null; G.meters = null; SS.stopActions(G); await new Promise(r => setTimeout(r, 120));
        const st = s.tile(); let best = null;
        for (let x = W.ax; x < W.ax + W.home.w; x++) for (let y = W.ay; y < W.ay + W.home.d; y++) {
          if (!W.walkable(0, x, y) || (x === st.x && y === st.y) || W.pieces.some(p => p.f === 0 && !p.wall && !p.host && W.def(p).kind !== 'rug' && (() => { const ft = W.foot(p); return x >= ft[0] - 1 && x < ft[2] + 1 && y >= ft[1] - 1 && y < ft[3] + 1; })())) continue;
          const q = SS.vp(x + .5, y + .5, 0), sc = G.toScreen(q[0], q[1]); if (sc[0] < 30 || sc[0] > 200 || sc[1] < 60 || sc[1] > G.viewBottom - 20) continue;
          if (SS.pick(G.lastHits || [], q[0], q[1])) continue;   // a tap there lands on something drawn over the floor
          if (!best) best = { x, y, sc };
        }
        return best;
      }, k);
      if (!tgt) { bad.push('view ' + k + ': no open floor tile on screen to tap'); continue; }
      await page.waitForTimeout(150);
      await tapAt(page, tgt.sc[0], tgt.sc[1]);
      const end = await page.evaluate(() => { const s = SSG.people.sarah, w = s.path[s.path.length - 1]; return w ? [Math.floor(w.x), Math.floor(w.y)] : null; });
      if (!end || end[0] !== tgt.x || end[1] !== tgt.y) bad.push('view ' + k + ': tapping tile ' + tgt.x + ',' + tgt.y + ' walks Sarah to ' + JSON.stringify(end));
    }
    await page.evaluate(() => { SS.view.k = 0; SSG.openMode('sandbox'); });
    // sitting (Keegan, Nov 26): the hips at the seat, and the legs below them, not feet on the seat (the sit drawing reaches
    // below the point she sits at, and is wider than her body: the thighs come forward)
    const sitOk = await page.evaluate(() => { const out = [];
      const drawn = o => { const c = document.createElement('canvas'); c.width = 60; c.height = 80; const x = c.getContext('2d'); SS.person(x, o.who, 30, 50, o);
        const d = x.getImageData(0, 0, 60, 80).data; let below = 0, l = 60, r = 0; for (let y = 0; y < 80; y++) for (let xx = 0; xx < 60; xx++) if (d[(y * 60 + xx) * 4 + 3] > 200) { if (y > 51) below++; l = Math.min(l, xx); r = Math.max(r, xx); } return { below, w: r - l }; };
      ['sarah', 'keegan'].forEach(w => { const stand = drawn({ who: w, pose: 'stand' }); [5, 13, 17].forEach(h => { const sit = drawn({ who: w, pose: 'sit', seatH: h });
        if (sit.below < 10) out.push(w + ' sitting on a seat ' + h + ' px high has no legs below the seat');
        if (h >= 9 && sit.w < stand.w + 2) out.push(w + ' sitting on a seat ' + h + ' px high has no lap coming forward'); }); }); return out; });
    sitOk.forEach(o => bad.push(o));
    // lying in bed (Keegan, Nov 26): both heads rest on the bed, not off its side, in every view
    await page.evaluate(() => { const G = SSG; SS.setClock(8, 20); G.openMode('life'); SS.stopSarahIdle(G); SS.stopActions(G); G.kday = null;
      const bed = G.W.pieces.find(p => G.W.def(p).use === 'bed' && G.W.def(p).w >= 2); SS.chooseAction(G, { piece: bed }, SS.ACTIONS.bed.find(a => a.name === 'LIE IN'));
      let t = 0; while (G.act && (!G.act.started || G.act.waitK) && t < 200) { SS.updateAgents(G, .05); t += .05; } G.setFloor(G.W.floorOf(bed)); G.bedUid = bed.uid; });
    for (let k = 0; k < 4; k++) {
      await page.evaluate(k => { SS.view.k = k; }, k); await page.waitForTimeout(150);
      const r = await page.evaluate(() => { const G = SSG, h = G.lastHits.find(h => h.p && h.p.uid === G.bedUid); if (!h) return ['the bed is not drawn'];
        return ['sarah', 'keegan'].map(w => { const a = G.people[w]; if (a.pose !== 'lie') return w + ' is not lying in bed'; const q = a.lieHead; if (!q) return w + '\'s head is not on the pillow';
          return q[0] >= h.x && q[0] <= h.x + h.sp.cv.width && q[1] + 8 >= h.y && q[1] <= h.y + h.sp.cv.height ? null : w + ' lies off the bed'; }).filter(Boolean); });
      r.forEach(o => bad.push('view ' + k + ': ' + o));
    }
    await page.evaluate(() => { SS.stopActions(SSG); SS.view.k = 0; SSG.openMode('sandbox'); });
    // wall pieces hang on either side of a wall and keep their side
    const sides = await page.evaluate(() => {
      const G = SSG, W = G.W, out = [], d = SS.DEF['framed-print'];
      const s = W.walls[0].find(q => q.axis === 'x' && q.a && q.b && !q.op && !q.win && W.check({ id: d.id, f: 0, wall: [q.x, q.y, 'x'], side: -1 }).ok && W.check({ id: d.id, f: 0, wall: [q.x, q.y, 'x'], side: 1 }).ok);
      if (!s) return ['no wall with room on both sides is free'];
      SS.view.k = 2; G.save.view = 2;   // the wall's - side faces her now
      if (SS.vfacing('x') !== -1) out.push('in the turned view the wall\'s other side does not face her');
      const p = W.add({ id: d.id, f: 0, wall: [s.x, s.y, 'x'], side: -1 }), q = W.add({ id: d.id, f: 0, wall: [s.x, s.y, 'x'] });
      if (!W.check({ id: d.id, f: 0, wall: [s.x, s.y, 'x'], side: -1 }, p).ok) out.push('a wall piece cannot hang on a wall\'s other side');
      G.changed(true); return { out, p: p.uid, q: q.uid };
    });
    if (Array.isArray(sides)) sides.forEach(o => bad.push(o));
    else {
      sides.out.forEach(o => bad.push(o));
      // reopened from what's stored, as a fresh start reads it (a page reload here is unreliable: the test browser rate-limits
      // writing storage to disk after the hundreds of saves this check makes, which no player does)
      const back = await page.evaluate(o => { SSG.screen = 'title'; SSG.W = null; SS.view.k = 0; SSG.openMode('sandbox'); const p = SSG.W.byUid[o.p], q = SSG.W.byUid[o.q]; return { k: SS.view.k, side: p && p.side, side2: q && (q.side || 1) }; }, sides);
      if (back.k !== 2) bad.push('the home does not keep the view she left it in');
      if (back.side !== -1 || back.side2 !== 1) bad.push('wall pieces do not keep their side after a reload');
    }
    // an older save with no view opens from the front
    if (await page.evaluate(() => { const s = SS.modeSave('sandbox'); delete s.view; SS.writeMode('sandbox', s); SSG.openMode('sandbox'); return SS.view.k; }) !== 0) bad.push('an older save does not open from the front');
    bad.push(...errors); await ctx.close();
    report('turning the home: the button and Select, the same spot and zoom, near walls cut, taps, placing, stacking, the D-pad and wall sides in all 4 views, saved', bad);
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
      const extra = 3 * ch;
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
      // Sarah doomscrolling in all 4 turns, sitting and standing, then lying in bed (spec 006, idle Sarah and her phone)
      x = 4; ['sit', 'stand'].forEach(pose => [[false, false], [false, true], [true, false], [true, true]].forEach(([back, flip]) => { SS.person(c, 'sarah', x + 12, y / 2 + 142, { pose, back, flip, arms: 'phone', t: 0 }); x += 26; }));
      SS.person(c, 'sarah', x + 30, y / 2 + 142, { pose: 'lie', arms: 'phone', t: 0 }); x += 56;
      SS.person(c, 'sarah', x + 30, y / 2 + 142, { pose: 'lie', arms: 'phone', t: 0, flip: true });
      x += 64; SS.bathPerson(c, x, y / 2 + 136, { t: 0 }); x += 36; SS.bathPerson(c, x, y / 2 + 136, { t: 0, flip: true });   // in the bath
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
      ['stairs', () => { SS.setClock(14, 0); SSG.openMode('life'); SSG.cam.zoom = 2; SSG.cam.x -= 40; }, null],
      ['walls-up-floor2', () => { SS.setClock(8, 5); SSG.openMode('life'); SSG.setFloor(1); SSG.walls = 'up'; }, null],
      ['in-bed', () => { const G = SSG; SS.setClock(8, 20); G.openMode('life'); SS.stopSarahIdle(G); SS.stopActions(G); G.kday = null; const bed = G.W.pieces.find(p => G.W.def(p).use === 'bed' && G.W.def(p).w >= 2); SS.chooseAction(G, { piece: bed }, SS.ACTIONS.bed.find(a => a.name === 'LIE IN')); let t = 0; while (G.act && (!G.act.started || G.act.waitK) && t < 200) { SS.updateAgents(G, .05); t += .05; } G.setFloor(2); G.cam.zoom = 2; const q = SS.vp(bed.x + 1, bed.y + 1.5, 2 * SS.FH + 10); G.cam.x = q[0] + SS.OFF[0]; G.cam.y = q[1] + SS.OFF[1]; G.toastT = null; }, null],
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
