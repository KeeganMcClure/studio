// Copies the approved battle sprites out of the Rushlight Asset Library (https://claude.ai/artifact/WYgm7Gn8afLE51Pce94ynt)
// into art/creatures.js, unchanged: each sprite page's first <svg> (its 1x drawing), minus the page background.
// Usage: node tools/import-art.js <folder holding the library's art/sprites/*.html files>
const fs = require('fs'), path = require('path');
const dir = process.argv[2];
if (!dir) { console.error('Give the folder of art/sprites/*.html'); process.exit(1); }
const PICK = { noonwife: 'noonwife-v1', counter: 'counter-v2', monk: 'monk-v2', candle: 'candle-v1', lampwalkers: 'lampwalkers-v1',
  severa: 'severa-v1', hedgecat: 'hedgecat-v1', rooks: 'rooks-v1', hag: 'hag-v1' };
let out = '// Rushlight · art/creatures.js. Battle sprites copied unchanged from the Rushlight Asset Library by tools/import-art.js\n' +
  '// (rushlight-sprites-<name>; all approved Nov 21). Don\'t edit here: change the library piece, then run the tool again.\n' +
  '// Each is SVG drawing code (pixel rects and paths, no image files); RLArt.sprite(name) turns one into a canvas.\nwindow.RL_SVG={\n';
for (const [k, f] of Object.entries(PICK)) {
  const html = fs.readFileSync(path.join(dir, `rushlight-sprites-${f}.html`), 'utf8');
  let svg = html.match(/<svg[\s\S]*?<\/svg>/)[0];
  svg = svg.replace(/\sstyle="background:[^"]*"/, '').replace(/<!--[\s\S]*?-->/g, '').replace(/\n\s*/g, '');
  if (!/xmlns=/.test(svg)) svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  out += ` ${k}:${JSON.stringify(svg)}, // rushlight-sprites-${f}\n`;
}
out += '};\n';
fs.writeFileSync(path.join(__dirname, '..', 'art', 'creatures.js'), out);
console.log('wrote art/creatures.js', (out.length / 1024).toFixed(1) + ' KB');
