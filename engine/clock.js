// Studio clock: runs a game's logic at a steady 60 ticks a second, whatever the phone's screen rate, for every game.
// Walking counts its steps in ticks (engine/move.js: 10 ticks a step), so without this a 120 Hz screen
// walks twice as fast as the iPhone SE's 60 Hz screen, and a 30 Hz one (iPhone Low Power Mode) half as fast.
// Knows nothing about any game.
//
//   var clock = StudioClock.make();
//   function loop(now) {                  // now: the timestamp requestAnimationFrame passes in
//     var n = clock.ticks(now);           // how many 1/60 s ticks have passed since the last frame (0 to 4)
//     if (n) { for (var i = 0; i < n; i++) update(); draw(); }
//     raf = requestAnimationFrame(loop);
//   }
//   clock.reset()                         // call when the loop (re)starts, so time spent away isn't caught up
//
// 60 Hz: one tick every frame, as before. 120 Hz: a tick every other frame, and the frames in between are
// skipped (nothing would change on screen). 90 Hz: two ticks every three frames. 30 Hz: two ticks a frame.
// A long gap (tab hidden, a slow frame) counts as one tick, so the game never jumps ahead.
(function () {
  var STEP = 1000 / 60;   // one tick, in ms
  var SLACK = 3;          // a frame up to 3 ms early still counts, so 60 Hz screens with jitter keep one tick a frame
  var MAX = 4;            // at most 4 ticks per frame (15 Hz)
  var GAP = 250;          // longer than this: count one tick

  function make() {
    var last = null, acc = 0;
    return {
      reset: function () { last = null; acc = 0; },
      ticks: function (now) {
        if (last === null || now - last > GAP || now < last) { last = now; acc = 0; return 1; }
        acc += now - last; last = now;
        var n = Math.min(MAX, Math.floor((acc + SLACK) / STEP));
        acc = Math.max(-SLACK, Math.min(STEP, acc - n * STEP));
        return n;
      }
    };
  }

  window.StudioClock = { STEP: STEP, make: make };
})();
