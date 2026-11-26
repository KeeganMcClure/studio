// Bundles Sarah's Sim into one HTML file: dist/index.html (studio-bible/launcher.md: each game is one page).
// index.html lists the parts as <script src="..."> lines; each one is inlined in that order. Shared parts come from the
// studio's engine/ folder (../../../engine/ from here), and engine/shell.css is inlined too.
//
// Private data (bible, Overview, Private data): the repo keeps only private.example.js, a placeholder with the same shape.
// dist/ is always built from the placeholder, so nothing private can reach the repo or the public site. When Keegan puts
// the real file at src/private.js (git ignores it), a second copy is built from it into dist-private/ (also ignored).
// Usage: node tools/build.js
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

function bundle(privateFile) {
  let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const parts = [];
  html = html.replace(/<script src="([^"]+)"><\/script>/g, (_, src) => {
    const file = src === 'private.example.js' ? privateFile : path.join(root, src);
    if (!fs.existsSync(file)) throw new Error('Missing part: ' + src);
    parts.push(src);
    const code = fs.readFileSync(file, 'utf8').replace(/<\/script/gi, '<\\/script');
    return `<script>/* ${src} */\n${code}\n</script>`;
  });
  html = html.replace(/<link rel="stylesheet" href="([^":]+)">/g, (_, href) => {
    const file = path.join(root, href);
    if (!fs.existsSync(file)) throw new Error('Missing part: ' + href);
    parts.push(href);
    return `<style>/* ${href} */\n${fs.readFileSync(file, 'utf8').replace(/<\/style/gi, '<\\/style')}\n</style>`;
  });
  return { html, parts };
}

function write(dir, privateFile) {
  const { html, parts } = bundle(privateFile);
  fs.mkdirSync(path.join(root, dir), { recursive: true });
  fs.writeFileSync(path.join(root, dir, 'index.html'), html);
  console.log(`Built ${dir}/index.html from ${parts.length} parts (${(html.length / 1024).toFixed(1)} KB)`);
}

write('dist', path.join(root, 'private.example.js'));
const real = path.join(root, 'private.js');
if (fs.existsSync(real)) write('dist-private', real);
