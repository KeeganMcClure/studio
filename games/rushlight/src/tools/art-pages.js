// Makes the Asset Library pages for art drawn in code during a build, so it can be filed (add-only) before the build uses it
// (bible, Art across games; studio art-style: every finished asset is saved with its drawing code and its frames).
// Spec 008, 8A: rushlight-sprites-<name>-v2 (v3 for the Counter and the Monk, which had a v2) for the five redrawn and four touched-up creatures, and rushlight-sprites-species-v2.
// Each page's first <svg> is the sprite at its battle size (drawn natively at 1.5×), which tools/import-art.js copies into the game;
// then bigger views, the battle frames from the shared rig (engine/rig.js), and the drawing code.
// Usage: node tools/art-pages.js <folder of the library's art/sprites/*.html (the v1 pages)> <out folder>
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const [src, out] = process.argv.slice(2);
if (!src || !out) { console.error('Give the folder of the v1 sprite pages and an out folder'); process.exit(1); }
const ROOT = path.join(__dirname, '..'), ENGINE = path.join(ROOT, '..', '..', '..', 'engine');
const read = f => fs.readFileSync(f, 'utf8');
const CODE = { pix: read(path.join(ENGINE, 'pixgrid.js')), rig: read(path.join(ENGINE, 'rig.js')), cre: read(path.join(ROOT, 'art', 'draw', 'creatures-v2.js')), sp: read(path.join(ROOT, 'species-art.js')) };
const V1 = { noonwife: 'noonwife-v1', counter: 'counter-v2', monk: 'monk-v2', candle: 'candle-v1', lampwalkers: 'lampwalkers-v1', severa: 'severa-v1', hedgecat: 'hedgecat-v1', rooks: 'rooks-v1', hag: 'hag-v1' };
// the new version of each: one past the newest already in the library (the Counter and the Monk already have a v2)
const NEW = { noonwife: 'v2', counter: 'v3', candle: 'v2', lampwalkers: 'v2', severa: 'v2', hedgecat: 'v2', monk: 'v3', rooks: 'v2', hag: 'v2' };
const NAMES = { noonwife: 'The Noonwife', counter: 'The Counter', candle: 'The Corpse-candle', lampwalkers: 'Lampwalkers', severa: 'Severa the owl', hedgecat: 'Hedge cat', monk: 'The Hollow Monk', rooks: 'Rooks', hag: 'The Withy Hag (costume)' };
const svgOf = html => { let s = html.match(/<svg[\s\S]*?<\/svg>/)[0]; s = s.replace(/\sstyle="background:[^"]*"/, '').replace(/<!--[\s\S]*?-->/g, '').replace(/\n\s*/g, ''); if (!/xmlns=/.test(s)) s = s.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"'); return s; };
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const page = (title, h1, body, code) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${title}</title>
<style>body{margin:0;background:#141210;color:#e6dcc4;font:12px 'DejaVu Sans Mono',monospace;padding:16px}
.row{display:flex;gap:20px;align-items:flex-end;flex-wrap:wrap}figure{margin:0;display:grid;gap:6px;justify-items:center}
h1{font-size:14px;margin:0 0 12px;color:#d9b45a;font-weight:normal}h2{font-size:12px;color:#d9b45a;font-weight:normal;margin:18px 0 8px}
pre{white-space:pre-wrap;font-size:10px;color:#b3aa98;background:#1c1814;padding:10px;max-height:none}</style></head><body>
<h1>${h1}</h1>${body}<h2>Drawing code</h2><pre>${esc(code)}</pre></body></html>`;

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(), p = await b.newPage();
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.setContent('<!doctype html><body></body>');
  for (const c of [CODE.pix, CODE.rig, CODE.cre, CODE.sp]) await p.addScriptTag({ content: c });
  const v1 = {}; for (const [k, f] of Object.entries(V1)) v1[k] = svgOf(read(path.join(src, `rushlight-sprites-${f}.html`)));
  const res = await p.evaluate(async v1 => {
    const C = RL_CREATURES_V2, out = {};
    const load = svg => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); });
    const asSvg = (cv, bg) => { const G = StudioPix.fromCanvas(cv); return G.svg(bg ? ` style="background:${bg}"` : ''); };
    const scaled = (svg, z, bg) => svg.replace(/width="(\d+)" height="(\d+)"/, (m, w, h) => `width="${w * z}" height="${h * z}"`).replace('<svg ', `<svg style="background:${bg}" `);
    // the battle frames as the game draws them: the shared rig's whole-sprite poses (stand, then hit, then attack)
    const frames = cv => { const F = ['stand', ...StudioRig.HIT, ...StudioRig.ATTACK], pad = 6, w = cv.width + pad * 2, h = cv.height + pad * 2;
      const s = document.createElement('canvas'); s.width = w * F.length; s.height = h; const x = s.getContext('2d');
      F.forEach((f, i) => { const P = StudioRig.shift(f, 1); x.drawImage(StudioRig.tinted(cv, P.tint, P.k), i * w + pad + P.dx, pad + P.dy); });
      return asSvg(s); };
    for (const k of C.REDRAWN) { const cv = C[k]().canvas(); out[k] = { svg: StudioPix.fromCanvas(cv).svg('', 'art'), frames: frames(cv), w: cv.width, h: cv.height }; }
    for (const k of C.TOUCHED) { const img = await load(v1[k]), w = Math.round(img.width * C.S), h = Math.round(img.height * C.S);
      const c0 = document.createElement('canvas'); c0.width = w; c0.height = h; const x = c0.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(img, 0, 0, w, h);
      const cv = C.touch(c0).canvas(); out[k] = { svg: StudioPix.fromCanvas(cv).svg('', 'art'), frames: frames(cv), w, h }; }
    // the species sheet v2: every species at 2× as portrait, map sprite, back view and front views, with every part and frame
    const sheet = (() => { const s = document.createElement('canvas'), Z = 2; s.width = 1180; s.height = 6 * 250 + 20; const x = s.getContext('2d'); x.imageSmoothingEnabled = false;
      RLSP.ORDER.forEach((k, r) => { const y = 10 + r * 250;
        [[1, 0, 0], [0, 0, 0], [2, 0, 0], [1, 1, 0], [1, 2, 0], [1, 3, 0], [1, 0, 1], [1, 0, 2]].forEach((l, i) => x.drawImage(RLSP.portrait(k, { shade: l[0], mark: l[1], neck: l[2] }, 1), 10 + i * 72, y));
        RLSP.MAP_FRAMES.forEach((f, i) => x.drawImage(RLSP.map(k, {}, f), 10 + i * 32, y + 80, 28, 52));
        RLSP.BATTLE_FRAMES.forEach((f, i) => x.drawImage(RLSP.back(k, {}, f), 210 + i * 68, y + 76));
        RLSP.BATTLE_FRAMES.forEach((f, i) => x.drawImage(RLSP.front(k, 'bandit', { mark: i % 4, neck: i % 3 }, f), 600 + i * 54, y + 10));
        RLSP.BATTLE_FRAMES.forEach((f, i) => x.drawImage(RLSP.front(k, 'arms', { shade: i % 3 }, f), 690 + i * 54, y + 90)); });
      return asSvg(s, '#2c2621'); })();
    out.species = { svg: sheet };
    return out;
  }, v1);
  const bg = '#2c2621';
  for (const [k, r] of Object.entries(res)) {
    if (k === 'species') continue;
    const touched = ['hedgecat', 'monk', 'rooks', 'hag'].includes(k);
    const h1 = `${NAMES[k]}, battle sprite ${NEW[k]} · ${touched ? 'touched up from rushlight-sprites-' + V1[k] : 'redrawn from rushlight-sprites-' + V1[k]} to the studio Quality bar (spec 008, 8A) · ${r.w} × ${r.h} px, drawn natively at 1.5×`;
    const big = z => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${r.w} ${r.h}" width="${r.w * z}" height="${r.h * z}" shape-rendering="crispEdges" style="background:${bg}"><use href="#art"/></svg>`;
    const body = `<div class="row"><figure>${r.svg}<figcaption>1× (the battle size)</figcaption></figure><figure>${big(2)}<figcaption>2×</figcaption></figure><figure>${big(3)}<figcaption>3×</figcaption></figure></div>
<h2>Battle frames (shared rig, engine/rig.js): stand · flinch, hold, recover (80, 160, 120 ms) · wind-up, strike, settle (120, 80, 160 ms)</h2><div class="row"><figure>${r.frames.replace('<svg ', `<svg style="background:${bg}" `).replace(/width="(\d+)" height="(\d+)"/, (m, w, h) => `width="${w * 2}" height="${h * 2}"`)}<figcaption>2×</figcaption></figure></div>`;
    const code = `// engine/pixgrid.js\n${CODE.pix}\n\n// games/rushlight/src/art/draw/creatures-v2.js\n${CODE.cre}`;
    fs.writeFileSync(path.join(out, `rushlight-sprites-${k}-${NEW[k]}.html`), page(`${NAMES[k]}, battle sprite ${NEW[k]}`, h1, body, code));
  }
  const sp = res.species.svg, spBig = sp.replace(/width="(\d+)" height="(\d+)"/, (m, w, h) => `width="${w}" height="${h}"`);
  fs.writeFileSync(path.join(out, 'rushlight-sprites-species-v2.html'), page('Species sheet v2', 'Species sheet v2: the six slice species to the studio Quality bar (spec 008, 8A; reference mockups/36-sprite-upgrade-rough-v3 and 38-folk-front-rough-v1). Per row: portraits (coat shades 1, 0, 2; scar, torn ear, grey muzzle; kerchief, hood), map frames (stand, step 1, step 2, breath, blink, talk), the back view at 2× in its seven battle frames, then front views at 1.5× (bandit and man-at-arms, face parts varied) in their frames',
    `<div class="row"><figure>${spBig}<figcaption>1× (portraits 64 px; map sprites shown at 2×)</figcaption></figure></div>`, `// engine/pixgrid.js\n${CODE.pix}\n\n// engine/rig.js\n${CODE.rig}\n\n// games/rushlight/src/species-art.js\n${CODE.sp}`));
  await b.close();
  console.log('wrote', fs.readdirSync(out).length, 'pages to', out);
})();
