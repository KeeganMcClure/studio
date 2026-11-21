// Keeps engine/shelf.js and engine/dialog.js identical to their sources, so a change on the Shared Shelf
// or in the Asset Library reaches every game without copying by hand into each one.
//   engine/shelf.js   the Shared Shelf script (the page's <script id="shelf-src"> block), copied unchanged
//   engine/dialog.js  the Lantern Bust dialog box, the Asset Library core page's dialog.js, copied unchanged
// engine/shared-sources.json records where each file came from, which version of the page, and its fingerprint.
//
// Usage (from the repo root):
//   node engine/tools/sync-shared.js check
//       Fails if either file no longer matches its recorded fingerprint (someone edited it here).
//       Every game that loads them runs this first in `npm run check`.
//   node engine/tools/sync-shared.js shelf <saved page or script> <page version>
//   node engine/tools/sync-shared.js dialog <saved dialog.js> <page version>
//       Writes the new copy and records it. Claude saves the source first with the Artifact tool
//       (the pages are private, so no script can fetch them). Then run `npm run check` in every game.
//       The Shared Shelf is add-only: a new shelf script must keep every line of the old one apart from
//       its header comments and the closing export list, so the versions each game names (v1 and so on) never
//       change under it. A shelf script that changes or removes old lines is refused; that goes to Keegan.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ENGINE = path.join(__dirname, '..');
const LIST = path.join(ENGINE, 'shared-sources.json');
const sha = t => crypto.createHash('sha256').update(t).digest('hex');
const today = () => new Date().toISOString().slice(0, 10);
const fail = msg => { console.error(msg); process.exit(1); };

const list = JSON.parse(fs.readFileSync(LIST, 'utf8'));
const [cmd, src, version] = process.argv.slice(2);

if (cmd === 'check') {
  let bad = 0;
  for (const [name, rec] of Object.entries(list.files)) {
    const file = path.join(ENGINE, name);
    if (!fs.existsSync(file)) { console.error(`engine/${name} is missing.`); bad++; continue; }
    if (sha(fs.readFileSync(file, 'utf8')) !== rec.sha256) {
      console.error(`engine/${name} doesn't match the copy taken from ${rec.from} (version ${rec.version}).\n` +
        `  It is a copy, so don't edit it here: change it at the source, then sync it again (see engine/tools/sync-shared.js).`);
      bad++;
    }
  }
  if (bad) process.exit(1);
  console.log(`Shared copies match their sources: ${Object.entries(list.files).map(([n, r]) => `${n} (${r.from} ${r.version})`).join(', ')}`);
  process.exit(0);
}

const name = { shelf: 'shelf.js', dialog: 'dialog.js' }[cmd];
if (!name || !src || !version) fail('Usage: node engine/tools/sync-shared.js check | shelf <file> <page version> | dialog <file> <page version>');
let text = fs.readFileSync(src, 'utf8');

if (cmd === 'shelf') {
  // Given the whole Shared Shelf page, take just its script block, unchanged
  const m = text.match(/<script id="shelf-src">\n([\s\S]*?)<\/script>/);
  if (m) text = m[1];
  if (!/^const SHELF=/m.test(text)) fail('That file has no Shared Shelf script (no "const SHELF=").');
  // Add-only: every old line must still be there, apart from header comments and the export list
  const old = fs.readFileSync(path.join(ENGINE, name), 'utf8').split('\n');
  const left = new Map();
  for (const l of text.split('\n')) left.set(l, (left.get(l) || 0) + 1);
  const start = old.findIndex(l => l.startsWith('const SHELF='));
  const changed = old.filter((l, i) => {
    if (i < start || /^\s*return\{/.test(l)) return false;
    const n = left.get(l) || 0;
    if (n) { left.set(l, n - 1); return false; }
    return true;
  });
  if (changed.length) {
    fail(`Refused: the new shelf script changes or removes ${changed.length} line(s) of the old one, and the Shared Shelf is add-only\n` +
      `(a fix goes in as a new version beside the old one). Games would see their pinned versions change. Ask Keegan.\n` +
      changed.slice(0, 12).map(l => '  - ' + l.slice(0, 120)).join('\n'));
  }
} else if (!/^const BLD=/m.test(text)) fail('That file is not the dialog box (no "const BLD=").');

const file = path.join(ENGINE, name);
const before = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
fs.writeFileSync(file, text);
list.files[name] = Object.assign(list.files[name] || {}, { version, synced: today(), sha256: sha(text) });
fs.writeFileSync(LIST, JSON.stringify(list, null, 2) + '\n');
console.log(before === text ? `engine/${name} already matched ${list.files[name].from} ${version}; recorded.` :
  `engine/${name} updated from ${list.files[name].from} ${version}. Now run npm run check in every game's src/ and log it in each changelog.`);
