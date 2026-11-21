// Bundles the game parts into one HTML file: dist/index.html
// index.html lists the parts as <script src="..."> lines; each one is inlined in that order.
// Shared parts come from the studio's engine/ folder (../../../engine/ from here).
// Usage: node tools/build.js
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const parts = [];
html = html.replace(/<script src="([^"]+)"><\/script>/g, (_, src) => {
  const file = path.join(root, src);
  if (!fs.existsSync(file)) throw new Error('Missing part: ' + src);
  parts.push(src);
  // keep "</script" inside code from closing the tag early
  const code = fs.readFileSync(file, 'utf8').replace(/<\/script/gi, '<\\/script');
  return `<script>/* ${src} */\n${code}\n</script>`;
});
// Local stylesheets (the shared engine/shell.css) are inlined too; Google Fonts stays a link
html = html.replace(/<link rel="stylesheet" href="([^":]+)">/g, (_, href) => {
  const file = path.join(root, href);
  if (!fs.existsSync(file)) throw new Error('Missing part: ' + href);
  parts.push(href);
  return `<style>/* ${href} */\n${fs.readFileSync(file, 'utf8').replace(/<\/style/gi, '<\\/style')}\n</style>`;
});
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist', 'index.html'), html);
console.log(`Built dist/index.html from ${parts.length} parts: ${parts.join(', ')} (${(html.length / 1024).toFixed(1)} KB)`);
