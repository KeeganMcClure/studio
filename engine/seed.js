// Studio seed: seeded random streams whose position can be saved and restored, for every game that builds its world
// or rolls its dice from a seed (studio-bible/saves.md, Seeds: one seed per run; dice from a second stream whose
// position is saved, so reopening rerolls nothing). Set Nov 22, 2026 from Rushlight spec 002. Knows nothing about any game.
//
//   StudioSeed.stream(seed)       a stream made from a whole number. Several can run side by side (a run's world,
//                                 muster and dice streams are separate).
//     s.next()                    the next number from 0 up to (not including) 1, like Math.random
//     s.int(n)                    a whole number from 0 to n - 1
//     s.pos                       how many numbers it has given so far
//     s.save()                    its position as a small plain object {seed, a, n}, safe to put in a save
//   StudioSeed.load(saved)        a stream back exactly where save() left it: the same next numbers follow
//   StudioSeed.hash(text)         a whole number from any text, to make a seed from a typed word
//
// The maths is mulberry32: small, fast and the same in every browser.
(function () {
  function stream(seed, a, n) {
    var s = { seed: seed | 0, a: a == null ? seed | 0 : a | 0, pos: n | 0 };
    s.next = function () {
      s.pos++;
      var t = s.a = (s.a + 0x6D2B79F5) | 0;
      t = Math.imul(t ^ (t >>> 15), 1 | t);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    s.int = function (n) { return Math.floor(s.next() * n); };
    s.save = function () { return { seed: s.seed, a: s.a, n: s.pos }; };
    return s;
  }
  function load(o) { return o ? stream(o.seed, o.a, o.n) : null; }
  function hash(text) {
    var h = 2166136261;
    text = String(text);
    for (var i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h | 0;
  }
  window.StudioSeed = { stream: stream, load: load, hash: hash };
})();
