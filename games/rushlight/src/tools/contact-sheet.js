// Rushlight's contact sheet (spec 008, 8A; art-style, Animation): every species in every face part and every frame, every
// creature in every frame, at 3× on the Soot ground, written to dist/contact-sheet.png. Keegan reviews that picture after each
// build to spot anything off model or missing a frame. Run by npm run check (after the build); runs alone too:
// Usage: node tools/build.js && node tools/contact-sheet.js
const path = require('path');
const sheet = require('../../../../engine/tools/contact-sheet.js');
const ROOT = path.join(__dirname, '..');

// runs in the page: lays the sheet out and draws it
function drawSheet(o) {
  const Z = o.zoom, SOOT = '#2c2621', TALLOW = '#d9b45a', BONE = '#e6dcc4', ASH = '#857e72', GAP = 6 * Z;
  const FR = RLSP.BATTLE_FRAMES, MF = RLSP.MAP_FRAMES;
  // the face parts: each value of each part on its own, the rest at the species sheet's
  const LOOKS = [[1, 0, 0, 'coat 1'], [0, 0, 0, 'coat 0'], [2, 0, 0, 'coat 2'], [1, 1, 0, 'scar'], [1, 2, 0, 'torn ear'], [1, 3, 0, 'grey muzzle'], [1, 0, 1, 'kerchief'], [1, 0, 2, 'hood']];
  const look = l => ({ shade: l[0], mark: l[1], neck: l[2] });
  const x0 = document.createElement('canvas').getContext('2d');   // for measuring captions
  const rows = [];   // each row: a title and a list of [canvas, caption]
  RLSP.ORDER.forEach(k => {
    rows.push([k.toUpperCase() + ' · portraits', [...LOOKS.map(l => [RLSP.portrait(k, look(l)), l[3]]), [RLSP.portrait(k, {}, 1, 'blink'), 'blink'], [RLSP.portrait(k, {}, 1, 'talk'), 'talk']]]);
    rows.push([k.toUpperCase() + ' · map sprite', [...MF.map(f => [RLSP.map(k, {}, f), f]), ...LOOKS.slice(1).map(l => [RLSP.map(k, look(l)), l[3]])]]);
    rows.push([k.toUpperCase() + ' · back view (2×)', [...FR.map(f => [RLSP.back(k, {}, f), f]), [RLSP.back(k, { neck: 1 }), 'kerchief'], [RLSP.back(k, { neck: 2 }), 'hood']]]);
    rows.push([k.toUpperCase() + ' · bandit, front (1.5×)', [...FR.map((f, i) => [RLSP.front(k, 'bandit', { shade: i % 3, mark: i % 4, neck: i % 3 }, f), f])]]);
    rows.push([k.toUpperCase() + ' · man-at-arms, front (1.5×)', [...FR.map((f, i) => [RLSP.front(k, 'arms', { shade: i % 3, mark: (i + 1) % 4, neck: i % 3 }, f), f])]]);
  });
  // creatures: one piece each, so their frames are the rig's whole-sprite poses
  Object.keys(window.RL_SVG || {}).forEach(k => {
    const s = RLArt.sprite(k); if (!s) return;
    rows.push(['CREATURE · ' + k, FR.map(f => { const P = StudioRig.shift(f, 1), pad = 6, c = document.createElement('canvas'); c.width = s.width + pad * 2; c.height = s.height + pad * 2;
      c.getContext('2d').drawImage(StudioRig.tinted(s, P.tint, P.k), pad + P.dx, pad + P.dy); return [c, f]; })]);
  });
  x0.font = `${4 * Z}px monospace`;
  const W = Math.max(...rows.map(r => r[1].reduce((a, [c, cap]) => a + Math.max(c.width * Z, x0.measureText(cap).width + Z) + GAP, GAP))), lineH = r => Math.max(...r[1].map(([c]) => c.height)) * Z + 14 * Z;
  const H = rows.reduce((a, r) => a + lineH(r) + GAP, 30 * Z);
  const out = document.createElement('canvas'); out.width = W; out.height = H; const x = out.getContext('2d'); x.imageSmoothingEnabled = false;
  x.fillStyle = SOOT; x.fillRect(0, 0, W, H);
  x.font = `${8 * Z}px monospace`; x.textBaseline = 'top'; x.fillStyle = TALLOW;
  x.fillText(`RUSHLIGHT CONTACT SHEET · ${new Date().toISOString().slice(0, 10)} · ${Z}× · every species, face part and frame; every creature and frame`, GAP, GAP);
  let y = 30 * Z;
  rows.forEach(([title, items]) => { x.fillStyle = BONE; x.font = `${6 * Z}px monospace`; x.fillText(title, GAP, y); let xx = GAP; const top = y + 8 * Z, h = Math.max(...items.map(([c]) => c.height)) * Z;
    items.forEach(([c, cap]) => { x.font = `${4 * Z}px monospace`; const cw = Math.max(c.width * Z, x.measureText(cap).width + Z); x.drawImage(c, xx, top + h - c.height * Z, c.width * Z, c.height * Z); x.fillStyle = ASH; x.fillText(cap, xx, top + h + Z); xx += cw + GAP; });
    y += lineH([title, items]) + GAP; });
  return out;
}

async function run() {
  const r = await sheet({ page: path.join(ROOT, 'dist', 'index.html'), draw: drawSheet, opts: { zoom: 3 }, out: path.join(ROOT, 'dist', 'contact-sheet.png'),
    wait: () => (window.RLArt ? RLArt.ready() : null) });
  console.log(`${r.errors.length ? 'FAIL' : 'ok  '} contact sheet: dist/contact-sheet.png (${r.width} × ${r.height})`);
  r.errors.forEach(e => console.log('     - ' + e));
  return r.errors.length;
}
if (require.main === module) run().then(n => process.exit(n ? 1 : 0), e => { console.error(e); process.exit(1); });
module.exports = run;
