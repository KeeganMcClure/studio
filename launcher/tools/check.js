// npm run check: builds the site into a temp folder, serves it under /studio/ like
// GitHub Pages does, and plays it in a headless browser at the three test sizes.
// Checks: shelf and covers, open a game and save, Continue, Dev/Release keep separate
// saves, export then import after wiping, offline play, and a new build taking over.
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const repo = path.join(__dirname, '..', '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'shelf-'));
const site = path.join(tmp, 'studio');
function build(id) {
  execFileSync('node', [path.join(__dirname, 'build.js'), '--dev', repo, '--release', repo, '--out', site, '--build', id], { stdio: 'inherit' });
}
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (!p.startsWith('/studio/')) { res.writeHead(404); return res.end(); }
  let f = path.join(tmp, p);
  if (f.endsWith(path.sep) || (fs.existsSync(f) && fs.statSync(f).isDirectory())) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) { res.writeHead(404); return res.end('404'); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream', 'cache-control': 'max-age=600' });
  fs.createReadStream(f).pipe(res);
});

let failed = 0;
function ok(cond, what) { console.log((cond ? '  ok   ' : '  FAIL ') + what); if (!cond) failed++; }

// Several games share the shelf, so each step names the game it taps.
const cover = (title) => `.cover[aria-label="${title}"]`;
const cont = (title) => `.game:has(.cover[aria-label="${title}"]) .cont`;
const TC = cover('Test Cart'), TC_CONT = cont('Test Cart');

async function coverDrawn(page) {
  return page.waitForFunction(() => {
    const c = document.querySelector('.cover canvas'); if (!c) return false;
    const d = c.getContext('2d').getImageData(0, 0, 120, 80).data;
    let colors = new Set(); for (let i = 0; i < d.length; i += 16) colors.add(d[i] + ',' + d[i + 1] + ',' + d[i + 2]);
    return colors.size > 4;
  }, null, { timeout: 5000 }).then(() => true, () => false);
}
async function fits(page) {
  return page.evaluate(() => {
    const vw = innerWidth, vh = innerHeight;
    const noSideScroll = document.documentElement.scrollWidth <= vw;
    const btns = [...document.querySelectorAll('button')].filter((b) => b.offsetParent && !b.closest('[hidden]'));
    const inside = btns.every((b) => { const r = b.getBoundingClientRect(); return r.left >= 0 && r.right <= vw + 0.5 && (location.pathname.match(/\/studio\/$/) || r.bottom <= vh + 0.5); });
    return noSideScroll && inside;
  });
}

async function checkBlackLantern(page, base) {
  const BL = 'Black Lantern';
  const save = JSON.parse(fs.readFileSync(path.join(repo, 'games/black-lantern/src/tools/test-saves/2026-11-21-mid-chapter.json'), 'utf8'));
  await page.goto(base);
  await page.evaluate((keys) => { for (const [k, v] of Object.entries(keys)) localStorage.setItem(k, v); }, save.keys);
  await page.reload();
  ok(await page.isVisible(cover(BL)), 'Black Lantern is on the Release shelf');
  ok(await page.isVisible(cont(BL)), 'an old Black Lantern save shows Continue on Release');
  await page.click(cont(BL));
  await page.waitForURL(/\/studio\/black-lantern\/\?continue=1$/);
  const inCase = await page.waitForSelector('.screen.gaming', { timeout: 5000 }).then(() => true, () => false);
  const rel = await page.evaluate(() => ({ v: localStorage.getItem('bl.version'), game: localStorage.getItem('bl.game'), dev: Object.keys(localStorage).filter((k) => k.startsWith('dev.bl.')) }));
  ok(inCase && rel.game && rel.v === '2' && rel.dev.length === 0, 'Continue opens the old bl.* checkpoint, upgraded in place, no Dev saves made');

  await page.goto(base);
  await page.click('#openSettings'); await page.click('#channel [data-ch=dev]'); await page.click('#closeSettings');
  ok(!(await page.isVisible(cont(BL))), 'Dev Black Lantern has no Continue (its own saves)');
  await page.click(cover(BL));
  await page.waitForURL(/\/studio\/dev\/black-lantern\/$/);
  await page.waitForTimeout(500);
  const dev = await page.evaluate(() => ({ v: localStorage.getItem('dev.bl.version'), game: localStorage.getItem('bl.game') }));
  ok(dev.v === '2' && dev.game === rel.game, 'Dev Black Lantern saves under dev.bl.*, Release save untouched');
  await page.click('#list .row:has-text("Game shelf")');
  await page.waitForURL(base);
  ok(true, 'Game shelf row goes back to the shelf');
  await page.click('#openSettings'); await page.click('#channel [data-ch=release]'); await page.click('#closeSettings');
  await page.evaluate(() => Object.keys(localStorage).filter((k) => /^(dev\.)?bl\./.test(k)).forEach((k) => localStorage.removeItem(k)));
}

(async () => {
  build('check1');
  await new Promise((r) => server.listen(0, r));
  const base = `http://localhost:${server.address().port}/studio/`;
  const browser = await chromium.launch();
  const errors = [];

  for (const [w, h] of [[320, 480], [375, 550], [375, 667]]) {
    console.log(`\n${w} x ${h}`);
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: true });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => errors.push(`${w}x${h}: ${e.message}`));
    page.on('console', (m) => { if (m.type() === 'error' && !/fonts\.g/.test(m.text())) errors.push(`${w}x${h}: ${m.text()}`); });

    await page.goto(base);
    ok(await coverDrawn(page), 'shelf shows the Test Cart cover');
    ok(await fits(page), 'launcher fits, no sideways scroll');
    ok(!(await page.isVisible(TC_CONT)), 'no Continue before a save');

    // Release: open, save a coin, back to shelf
    await page.click(TC);
    await page.waitForURL(/\/studio\/test-cart\/$/);
    ok(await fits(page), 'game shell fits, every button on screen');
    await page.keyboard.press('z'); await page.keyboard.press('z');
    await page.tap('.ab .a');
    const rel = await page.evaluate(() => JSON.parse(localStorage.getItem('tc.save')));
    ok(rel && rel.coins === 2 && rel.v === 1, 'Release save written (2 coins, version 1)');
    await page.click('#shelf');
    await page.waitForURL(base);
    ok(await page.isVisible(TC_CONT), 'Continue appears after a save');

    // Dev: separate saves
    await page.click('#openSettings'); await page.click('#channel [data-ch=dev]');
    ok(await page.isVisible('#chip'), 'DEV chip shows');
    await page.click('#closeSettings');
    ok(!(await page.isVisible(TC_CONT)), 'Dev has no Continue (its own saves)');
    await page.click(TC);
    await page.waitForURL(/\/studio\/dev\/test-cart\/$/);
    await page.keyboard.press('z'); await page.keyboard.press('z');
    const both = await page.evaluate(() => [JSON.parse(localStorage.getItem('dev.tc.save')), JSON.parse(localStorage.getItem('tc.save'))]);
    ok(both[0] && both[0].coins === 1 && both[1].coins === 2, 'Dev saves to dev.tc.save, Release save untouched');
    await page.click('#shelf'); await page.waitForURL(base);

    // Export, wipe, import
    await page.click('#openSettings'); await page.click('#export');
    const code = await page.inputValue('#code');
    ok(code.startsWith('STUDIO1.'), 'export gives a text code');
    await page.evaluate(() => { localStorage.removeItem('tc.save'); localStorage.removeItem('dev.tc.save'); });
    await page.fill('#code', 'nonsense'); await page.click('#import');
    ok(/doesn't look right/.test(await page.textContent('#note')), 'bad code is refused');
    await page.fill('#code', code); await page.click('#import');
    ok(await page.evaluate(() => !localStorage.getItem('tc.save')), 'first Import tap only asks to confirm');
    await page.click('#import');
    const back = await page.evaluate(() => [JSON.parse(localStorage.getItem('tc.save')), JSON.parse(localStorage.getItem('dev.tc.save'))]);
    ok(back[0] && back[0].coins === 2 && back[1] && back[1].coins === 1, 'import brings both saves back');
    await page.click('#channel [data-ch=release]'); await page.click('#closeSettings');

    // Offline
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.reload();
    ok(await page.evaluate(() => !!navigator.serviceWorker.controller), 'service worker in control');
    await ctx.setOffline(true);
    await page.reload();
    ok(await coverDrawn(page), 'offline: shelf still loads');
    await page.click(TC_CONT);
    await page.waitForURL(/test-cart\/\?continue=1$/);
    await page.waitForTimeout(300);
    ok(await page.evaluate(() => !!document.querySelector('canvas') && JSON.parse(localStorage.getItem('tc.save')).coins === 2), 'offline: Continue opens the game with its save');
    await page.goto(base + 'dev/test-cart/');
    ok(await page.evaluate(() => !!document.querySelector('canvas')), 'offline: Dev build opens too');
    await ctx.setOffline(false);

    // Black Lantern: old Release saves (bl.*) still load, Dev saves under dev.bl.*, and the way back to the shelf
    if (w === 375 && h === 667) await checkBlackLantern(page, base);

    // A new build takes over on next open
    if (w === 375 && h === 667) {
      build('check2');
      await page.goto(base);
      await page.evaluate(() => navigator.serviceWorker.getRegistration().then((r) => r.update()));
      const updated = await page.waitForFunction(() => /check2/.test(document.getElementById('foot').textContent), null, { timeout: 8000 }).then(() => true, () => false);
      ok(updated, 'new build replaces the old one and the shelf reloads');
      ok(await page.evaluate(() => JSON.parse(localStorage.getItem('tc.save')).coins === 2), 'saves survive the update');
    }
    await ctx.close();
  }
  ok(errors.length === 0, 'no page errors' + (errors.length ? ':\n    ' + errors.join('\n    ') : ''));
  await browser.close(); server.close();
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(failed ? `\n${failed} check(s) failed` : '\nAll checks passed');
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
