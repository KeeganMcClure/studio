// Pronoun lint (Agent creator, Pronouns and body; spec 022, Text): game text never writes a fixed "he" or "she" for an
// agent or a Bond. It uses pronoun tokens ({n.they}, {B.their}, {n:is|are}; BLS.pron in strings.js), so the line
// follows the pronouns picked in the creator. This fails on a bare he, she, him, her, his, hers, himself or herself
// within three words of an agent or Bond token in the same sentence of a text string.
// Agent and Bond tokens: {n} {a} {t} {r} {o} (agents in battle, SAN, the debrief), {A} {B} {B2} {T} {X} (home scenes),
// {b} (a Bond), {first} {code} (the lead). Big Hat and the townsfolk are fixed people and keep their own he and she;
// a sentence where the pronoun is someone else sits in OK below, with who it is.
// Usage: node tools/pronoun-lint.js (also run by tools/check.js). Exit code 1 on a problem.
const fs = require('fs');
const path = require('path');
const SRC = path.join(__dirname, '..');
const TOKEN = /\{(?:n|a|t|r|o|A|B|B2|T|X|b|first|code)\}/;
const PRONOUN = /^(he|she|him|her|his|hers|himself|herself)$/i;
// sentences checked by hand where the he or she is someone other than the agent or Bond next to it
const OK = [
  'She hands {B} a thermos.',  // Mrs. Ruiz (home.js, Find the truth arc)
  'Ask {B} to tell her',       // Mrs. Ruiz again (the same arc's choice)
];
function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(d => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) return ['tools', 'dist', 'node_modules'].includes(d.name) ? [] : files(p);
    return d.name.endsWith('.js') ? [p] : [];
  });
}
function lint() {
  const problems = [];
  for (const f of files(SRC)) {
    const src = fs.readFileSync(f, 'utf8');
    const strs = src.match(/'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`/g) || [];
    for (const lit of strs) {
      const text = lit.slice(1, -1).replace(/\\'/g, "'");
      if (!TOKEN.test(text)) continue;
      for (const sent of text.split(/(?<=[.!?])\s+/)) {
        if (!TOKEN.test(sent) || OK.includes(sent.trim())) continue;
        const words = sent.split(/\s+/);
        words.forEach((w, i) => {
          if (!TOKEN.test(w)) return;
          for (let j = Math.max(0, i - 3); j <= Math.min(words.length - 1, i + 3); j++) {
            const bare = words[j].replace(/^[^A-Za-z]+|[^A-Za-z]+$/g, '').replace(/'s$/i, '');
            if (j !== i && PRONOUN.test(bare)) problems.push(`${path.relative(SRC, f)}: "${sent.trim()}" (bare "${bare}" next to ${w.match(TOKEN)[0]})`);
          }
        });
      }
    }
  }
  return [...new Set(problems)];
}
module.exports = lint;
if (require.main === module) {
  const p = lint();
  p.forEach(x => console.log('pronoun lint: ' + x));
  console.log(p.length ? `${p.length} bare pronoun(s) next to an agent or Bond token.` : 'Pronoun lint: no bare he or she next to an agent or Bond token.');
  process.exit(p.length ? 1 : 0);
}
