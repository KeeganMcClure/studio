// Builds the whole site for GitHub Pages: the launcher plus every game, Release and Dev.
//
//   node launcher/tools/build.js --dev <repo> [--release <repo>] --out <dir> [--build <id>]
//
// --dev is a checkout of main: the launcher and the Dev builds come from it.
// --release is a checkout of the release branch (leave it out before the first release).
// Site layout:  /            launcher          /<game>/      Release build
//               /dev/<game>/ Dev build         /covers/, /dev/covers/  cover code
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { iconPng } = require('./icon.js');

function args() {
  const a = {}, v = process.argv.slice(2);
  for (let i = 0; i < v.length; i += 2) a[v[i].replace(/^--/, '')] = v[i + 1];
  if (!a.dev || !a.out) throw new Error('Usage: build.js --dev <repo> [--release <repo>] --out <dir> [--build <id>]');
  return a;
}

// Inline every local <script src="..."> into the page, like the games' own build tools.
function bundle(htmlFile) {
  const dir = path.dirname(htmlFile);
  return fs.readFileSync(htmlFile, 'utf8').replace(/<script src="([^":]+)"><\/script>/g, (_, src) => {
    const file = path.join(dir, src);
    if (!fs.existsSync(file)) throw new Error('Missing script ' + src + ' in ' + htmlFile);
    const code = fs.readFileSync(file, 'utf8').replace(/<\/script/gi, '<\\/script');
    return `<script>/* ${src} */\n${code}\n</script>`;
  });
}

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const s = path.join(from, e.name), d = path.join(to, e.name);
    if (e.isDirectory()) copyDir(s, d); else fs.copyFileSync(s, d);
  }
}

// Reads games/<id>/game.json for every game in a checkout that ships on this channel.
function gamesIn(repo, channel) {
  const root = path.join(repo, 'games');
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root).sort().map((id) => {
    const f = path.join(root, id, 'game.json');
    if (!fs.existsSync(f)) return null;
    const g = JSON.parse(fs.readFileSync(f, 'utf8'));
    for (const k of ['id', 'title', 'savePrefix', 'cover', 'channels']) if (!(k in g)) throw new Error(`${f} is missing "${k}"`);
    if (g.id !== id) throw new Error(`${f}: id "${g.id}" must match its folder "${id}"`);
    return g.channels.includes(channel) ? { ...g, dir: path.join(root, id) } : null;
  }).filter(Boolean);
}

// A game with its own build (src/package.json "build") ships src/dist/.
// Otherwise its src/index.html is bundled into one file.
function buildGame(g, outDir) {
  const src = path.join(g.dir, 'src');
  const pkg = path.join(src, 'package.json');
  fs.mkdirSync(outDir, { recursive: true });
  if (fs.existsSync(pkg) && (JSON.parse(fs.readFileSync(pkg, 'utf8')).scripts || {}).build) {
    execSync('npm run build', { cwd: src, stdio: 'inherit' });
    copyDir(path.join(src, 'dist'), outDir);
  } else {
    fs.writeFileSync(path.join(outDir, 'index.html'), bundle(path.join(src, 'index.html')));
  }
}

function listFiles(dir, base = dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? listFiles(p, base) : [path.relative(base, p).split(path.sep).join('/')];
  });
}

function main() {
  const a = args();
  const out = path.resolve(a.out);
  const build = a.build || new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '');
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });

  const shelf = { build, release: [], dev: [] };
  const channels = [['dev', a.dev, 'dev/']];
  if (a.release) channels.push(['release', a.release, '']);
  for (const [ch, repo, base] of channels) {
    for (const g of gamesIn(path.resolve(repo), ch)) {
      buildGame(g, path.join(out, base + g.id));
      fs.mkdirSync(path.join(out, base + 'covers'), { recursive: true });
      fs.copyFileSync(path.join(g.dir, 'assets', g.cover), path.join(out, base + 'covers', g.id + '.js'));
      shelf[ch].push({ id: g.id, title: g.title, savePrefix: g.savePrefix });
      console.log(`${ch}: ${g.id}`);
    }
  }

  // The launcher always comes from main.
  const L = path.join(path.resolve(a.dev), 'launcher');
  fs.copyFileSync(path.join(L, 'index.html'), path.join(out, 'index.html'));
  fs.copyFileSync(path.join(L, 'launcher.js'), path.join(out, 'launcher.js'));
  fs.writeFileSync(path.join(out, 'games.json'), JSON.stringify(shelf, null, 2));
  for (const s of [180, 192, 512]) fs.writeFileSync(path.join(out, `icon-${s}.png`), iconPng(s));
  fs.writeFileSync(path.join(out, 'manifest.webmanifest'), JSON.stringify({
    name: 'Game Shelf', short_name: 'Game Shelf', start_url: './', scope: './', display: 'standalone',
    orientation: 'portrait', background_color: '#100c22', theme_color: '#100c22',
    icons: [{ src: 'icon-192.png', sizes: '192x192', type: 'image/png' }, { src: 'icon-512.png', sizes: '512x512', type: 'image/png' }]
  }, null, 2));
  fs.writeFileSync(path.join(out, '.nojekyll'), '');

  // Everything on the site is kept on the phone, so every game plays offline.
  const assets = ['./'].concat(listFiles(out).filter((f) => !f.startsWith('.') && f !== 'index.html')
    .map((f) => f.replace(/(^|\/)index\.html$/, '$1')));
  const sw = fs.readFileSync(path.join(L, 'sw.js'), 'utf8')
    .replace('__BUILD__', build).replace('__ASSETS__', JSON.stringify(assets));
  fs.writeFileSync(path.join(out, 'sw.js'), sw);
  console.log(`Built ${out}: build ${build}, ${shelf.release.length} release, ${shelf.dev.length} dev, ${assets.length} files kept offline`);
}

main();
