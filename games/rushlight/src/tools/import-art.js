// Copies the approved battle sprites out of the Rushlight Asset Library (https://claude.ai/artifact/WYgm7Gn8afLE51Pce94ynt)
// into art/creatures.js, unchanged: each sprite page's first <svg> (its 1x drawing), minus the page background.
// and the item type icons (art/icons/rushlight-icons-items-v1.html, beside the sprites folder) into window.RL_ICONS.
// Usage: node tools/import-art.js <folder holding the library's art/sprites/*.html files>
const fs = require('fs'), path = require('path');
const dir = process.argv[2];
if (!dir) { console.error('Give the folder of art/sprites/*.html'); process.exit(1); }
// v2 (spec 008, 8A look pass, filed Nov 24): every creature brought up to the studio Quality bar, drawn natively at 1.5× its v1 size
const PICK = { noonwife: 'noonwife-v2', counter: 'counter-v3', monk: 'monk-v3', candle: 'candle-v2', lampwalkers: 'lampwalkers-v2',
  severa: 'severa-v2', hedgecat: 'hedgecat-v2', rooks: 'rooks-v2', hag: 'hag-v2' };
let out = '// Rushlight · art/creatures.js. Battle sprites copied unchanged from the Rushlight Asset Library by tools/import-art.js\n' +
  '// (rushlight-sprites-<name>-v2, the Counter and the Monk -v3, spec 008 look pass, Nov 24). Don\'t edit here: change the library piece, then run the tool again.\n' +
  '// Each is SVG drawing code (pixel rects and paths, no image files); RLArt.sprite(name) turns one into a canvas.\nwindow.RL_SVG={\n';
for (const [k, f] of Object.entries(PICK)) {
  const html = fs.readFileSync(path.join(dir, `rushlight-sprites-${f}.html`), 'utf8');
  let svg = html.match(/<svg[\s\S]*?<\/svg>/)[0];
  svg = svg.replace(/\sstyle="background:[^"]*"/, '').replace(/<!--[\s\S]*?-->/g, '').replace(/\n\s*/g, '');
  if (!/xmlns=/.test(svg)) svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  out += ` ${k}:${JSON.stringify(svg)}, // rushlight-sprites-${f}\n`;
}
out += '};\n';
// the 13 item type icons (rushlight-icons-items-v1), each <symbol> as its own 12 x 12 drawing
const icons = path.join(dir, '..', 'icons', 'rushlight-icons-items-v1.html');
if (fs.existsSync(icons)) {
  const html = fs.readFileSync(icons, 'utf8');
  out += '// Item type icons, copied unchanged from rushlight-icons-items-v1 (approved Nov 20)\nwindow.RL_ICONS={\n';
  for (const m of html.matchAll(/<symbol id="t-([a-z]+)" viewBox="0 0 12 12">([\s\S]*?)<\/symbol>/g))
    out += ` ${m[1]}:${JSON.stringify('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="12" height="12" shape-rendering="crispEdges">' + m[2].replace(/\n\s*/g, '') + '</svg>')},\n`;
  out += '};\n';
}
fs.writeFileSync(path.join(__dirname, '..', 'art', 'creatures.js'), out);
console.log('wrote art/creatures.js', (out.length / 1024).toFixed(1) + ' KB');
