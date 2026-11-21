// Bundles the game parts into one HTML file: dist/index.html
// index.html lists the parts as <script src="..."> lines; each one is inlined in that order.
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
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist', 'index.html'), html);
console.log(`Built dist/index.html from ${parts.length} parts: ${parts.join(', ')} (${(html.length / 1024).toFixed(1)} KB)`);
