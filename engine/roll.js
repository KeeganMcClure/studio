// Studio roll: percentile rolls with crits and fumbles, and a flat Luck roll, for every game that rolls d100
// (Black Lantern Combat numbers, Crits and Fumbles, Delta Green style; set Nov 19–20, 2026). Knows nothing about
// any game: the game says the target number and what a crit or fumble does.
//
//   StudioRoll.d100()             1..100
//   StudioRoll.pct(target, r?)    {r, target, ok, crit, fumble}: ok when r <= target. A crit is a hit on 01 or
//                                 doubles (11, 22 … 99); a fumble is 100, or doubles that miss. Pass r to reuse
//                                 a roll you already made. target is clamped to 1..99, so 01 always hits and 100
//                                 always misses.
//   StudioRoll.luck(mod)          a flat 50% roll (plus mod, e.g. -20), same result shape
//   StudioRoll.line(word, o)      the result line: 'FORCE IT 55% · rolled 41 · HIT' (words from the game)
(function () {
  function d100() { return 1 + Math.floor(Math.random() * 100); }
  function pct(target, r) {
    var t = Math.max(1, Math.min(99, Math.round(target)));
    if (r == null) r = d100();
    var ok = r <= t, dbl = r < 100 && r % 11 === 0;
    return { r: r, target: t, ok: ok, crit: ok && (r === 1 || dbl), fumble: r === 100 || (!ok && dbl) };
  }
  function luck(mod) { return pct(50 + (mod || 0)); }
  function line(word, o, words) {
    var w = words || { hit: 'HIT', miss: 'MISS', crit: 'CRIT', fumble: 'FUMBLE' };
    return word + ' ' + o.target + '% · rolled ' + o.r + ' · ' + (o.crit ? w.crit : o.fumble ? w.fumble : o.ok ? w.hit : w.miss);
  }
  window.StudioRoll = { d100: d100, pct: pct, luck: luck, line: line };
})();
