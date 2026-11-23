// Bundles the game parts into one HTML file: dist/index.html
// index.html lists the parts as <script src="..."> lines; each one is inlined in that order.
// Shared parts come from the studio's engine/ folder (../../../engine/ from here).
// Usage: node tools/build.js
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const parts = [];
// A part marked data-dev (the Dev-only test season, spec 009) is left out when the launcher builds Release
// (STUDIO_CHANNEL=release), so it never ships there; every other build keeps it.
const release = process.env.STUDIO_CHANNEL === 'release';
html = html.replace(/<script( data-dev)? src="([^"]+)"><\/script>\n?/g, (_, dev, src) => {
  if (dev && release) return '';
  const file = path.join(root, src);
  if (!fs.existsSync(file)) throw new Error('Missing part: ' + src);
  parts.push(src);
  // keep "</script" inside code from closing the tag early
  const code = fs.readFileSync(file, 'utf8').replace(/<\/script/gi, '<\\/script');
  return `<script>/* ${src} */\n${code}\n</script>\n`;
});
// Local stylesheets (the shared engine/shell.css) are inlined too; Google Fonts stays a link
html = html.replace(/<link rel="stylesheet" href="([^":]+)">/g, (_, href) => {
  const file = path.join(root, href);
  if (!fs.existsSync(file)) throw new Error('Missing part: ' + href);
  parts.push(href);
  return `<style>/* ${href} */\n${fs.readFileSync(file, 'utf8').replace(/<\/style/gi, '<\\/style')}\n</style>`;
});
// Agency cases stay out of the public repo (bible, Tech → File and code). They live in the private
// KeeganMcClure/black-lantern repo under agency/: season data files (season-N.js, which call registerAgency) and the
// agency case files (lantern-NN.js and their art). BL_PRIVATE_DIR points at that agency/ folder; without it, a local
// clone next to the studio is tried. A Dev or Release build (the launcher sets STUDIO_CHANNEL) stops if they can't be
// reached, so a season never ships without its agency cases. A plain local build (npm run check) goes on without
// them, and the Dev test season stands in.
const privDir = process.env.BL_PRIVATE_DIR || path.join(root, '..', '..', '..', '..', 'black-lantern', 'agency');
const privFiles = fs.existsSync(privDir) ? fs.readdirSync(privDir).filter(f => f.endsWith('.js')).sort((a, b) =>
  (/^season-/.test(b) - /^season-/.test(a)) || a.localeCompare(b, 'en', { numeric: true })) : [];
if (process.env.STUDIO_CHANNEL && !privFiles.some(f => /^season-/.test(f)))
  throw new Error(`Black Lantern's private agency files can't be reached (looked in ${privDir}). ` +
    'The deploy checks them out from KeeganMcClure/black-lantern with the BL_PRIVATE_TOKEN secret; see .github/workflows/pages.yml.');
const marker = /<!-- agency:[^>]*-->\n?/;
if (!marker.test(html)) throw new Error('index.html has lost its agency marker');
html = html.replace(marker, () => privFiles.map(f => {
  parts.push('agency/' + f);
  return `<script>/* agency/${f} (private) */\n${fs.readFileSync(path.join(privDir, f), 'utf8').replace(/<\/script/gi, '<\\/script')}\n</script>\n`;
}).join(''));
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist', 'index.html'), html);
console.log(`Built dist/index.html from ${parts.length} parts: ${parts.join(', ')} (${(html.length / 1024).toFixed(1)} KB)`);
