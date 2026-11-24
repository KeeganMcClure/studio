// Studio animation rig: the timing table every game shares, and the pose helpers built on it
// (studio-bible/art-style.md, Animation, set Nov 23, 2026; first built for Rushlight spec 008, 8A).
// It knows nothing about any game's art. A game draws its own frames from parts; this file says which frame shows when.
//
//   StudioRig.TIMING                     the timing table (walk, idle, blink, talk, hit, attack)
//   StudioRig.walkBeat(anim, perBeat)    0..3 for step, pass, step, pass; anim counts frames walked,
//                                        perBeat is frames per half tile (a step of 10 frames → 5)
//   StudioRig.WALK                       the frame name for each beat: ['step1', 'stand', 'step2', 'stand']
//   StudioRig.idle(now, seed)            'breath' for 300 ms every 2–3 s, else null (seed keeps folk out of step)
//   StudioRig.blink(now, seed)           true for 150 ms every few seconds
//   StudioRig.talk(now)                  0 or 1, the two-frame mouth flap at 140 ms a frame
//   StudioRig.start(who, kind, now)      starts a battle move on any object: who.anim = {kind, t0}
//   StudioRig.frame(who, now)            the battle frame showing now: 'flinch' 'hold' 'recover' (hit),
//                                        'windup' 'strike' 'settle' (attack), or null when idle; clears a finished move
//   StudioRig.shift(name, toward)        a whole-sprite pose for a frame, for sprites not built from parts (a creature
//                                        drawn as one piece): {dx, dy, tint, k}. toward: +1 when the target is below
//                                        (a foe striking at the party), −1 when above
//   StudioRig.tinted(canvas, color, k)   a copy of canvas with every pixel pulled toward color by k (cached)
//   StudioRig.HIT, StudioRig.ATTACK      the three frame names of each move, in order
(function () {
  var TIMING = {
    walk: { beats: ['step', 'pass', 'step', 'pass'], per: 'half tile' },
    idle: { frames: 2, every: [2000, 3000], ms: 300 },
    blink: { frames: 1, every: [2600, 4600], ms: 150 },
    talk: { frames: 2, ms: 140 },
    hit: { frames: ['flinch', 'hold', 'recover'], ms: [80, 160, 120] },
    attack: { frames: ['windup', 'strike', 'settle'], ms: [120, 80, 160] }
  };
  var WALK = ['step1', 'stand', 'step2', 'stand'];
  // a steady pseudo-random period per seed, so two townsfolk never breathe or blink together
  function period(seed, lo, hi) { var h = Math.abs(Math.sin((seed | 0) * 12.9898 + 78.233) * 43758.5453) % 1; return lo + Math.round(h * (hi - lo)); }
  function walkBeat(anim, perBeat) { return Math.floor((anim || 0) / (perBeat || 5)) % 4; }
  function idle(now, seed) { var p = period(seed, TIMING.idle.every[0], TIMING.idle.every[1]), t = (now + (seed | 0) * 337) % p; return t < TIMING.idle.ms ? 'breath' : null; }
  function blink(now, seed) { var p = period((seed | 0) + 7, TIMING.blink.every[0], TIMING.blink.every[1]), t = (now + (seed | 0) * 911) % p; return t < TIMING.blink.ms; }
  function talk(now) { return Math.floor(now / TIMING.talk.ms) % 2; }
  function start(who, kind, now) { if (who) who.anim = { kind: kind, t0: now == null ? (typeof performance !== 'undefined' ? performance.now() : 0) : now }; }
  function frame(who, now) {
    var a = who && who.anim; if (!a) return null;
    var T = TIMING[a.kind], t = now - a.t0, acc = 0;
    for (var i = 0; i < 3; i++) { acc += T.ms[i]; if (t < acc) return T.frames[i]; }
    who.anim = null; return null;
  }
  // whole-sprite poses: a flinch jolts back and flashes pale, the hold sinks, the recover comes most of the way back;
  // a wind-up draws back, the strike lunges at the target, the settle eases home. Whole pixels only, so nothing blurs.
  var SHIFT = {
    flinch: { dx: 2, dy: -1, tint: '#fff4dc', k: .45 }, hold: { dx: 1, dy: 1, tint: null, k: 0 }, recover: { dx: 1, dy: 0, tint: null, k: 0 },
    windup: { dx: -1, dy: -2, tint: null, k: 0 }, strike: { dx: 1, dy: 4, tint: null, k: 0 }, settle: { dx: 0, dy: 1, tint: null, k: 0 }
  };
  function shift(name, toward) {
    var s = SHIFT[name]; if (!s) return { dx: 0, dy: 0, tint: null, k: 0 };
    var t = toward == null ? 1 : toward;
    return { dx: s.dx, dy: (name === 'windup' || name === 'strike' || name === 'settle') ? s.dy * t : s.dy, tint: s.tint, k: s.k };
  }
  var tintCache = typeof WeakMap !== 'undefined' ? new WeakMap() : null;
  function tinted(canvas, color, k) {
    if (!canvas || !color || !k) return canvas;
    var key = color + k, m = tintCache && tintCache.get(canvas);
    if (m && m[key]) return m[key];
    var c = document.createElement('canvas'); c.width = canvas.width; c.height = canvas.height;
    var x = c.getContext('2d'); x.drawImage(canvas, 0, 0);
    var d = x.getImageData(0, 0, c.width, c.height), p = d.data, n = parseInt(color.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    for (var i = 0; i < p.length; i += 4) if (p[i + 3]) { p[i] += (r - p[i]) * k; p[i + 1] += (g - p[i + 1]) * k; p[i + 2] += (b - p[i + 2]) * k; }
    x.putImageData(d, 0, 0);
    if (tintCache) { m = m || {}; m[key] = c; tintCache.set(canvas, m); }
    return c;
  }
  window.StudioRig = { TIMING: TIMING, WALK: WALK, HIT: TIMING.hit.frames, ATTACK: TIMING.attack.frames,
    walkBeat: walkBeat, idle: idle, blink: blink, talk: talk, start: start, frame: frame, shift: shift, tinted: tinted };
})();
