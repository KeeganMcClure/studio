// Studio input: the shell's buttons and the test keyboard, for every game (studio-bible/controls.md, Buttons and Keyboard).
// Needs the buttons from engine/shell.js. Knows nothing about any game: the game says where presses go.
//
//   StudioInput.start({
//     press(kind),       // every press: 'up' 'down' 'left' 'right' 'a' 'b' 'l' 'r' 'start' 'select'.
//                        // The game routes it (for example to the map while it's up, otherwise to the menus).
//     walking(),         // true while held directions should walk (the map is up)
//     hold(dir, on),     // a direction went down (on) or up while walking; also told to let go on lift and blur
//   });
//
// D-pad buttons fire once on press, then repeat after 320 ms every 85 ms (menus). While walking() the
// direction also counts as held until the finger lifts, slides off or the touch is cancelled.
// A, B, L, R, Start and Select fire on tap. Keys are ignored while a text field has focus, and Enter or
// Escape there only closes the phone keyboard. Leaving the window lets go of every direction.
// Later (Running, hold B): add an "is this button held?" query here so every game shares it.
(function () {
  var DIRS = ['up', 'down', 'left', 'right'];
  var KEYS = {
    ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
    z: 'a', Z: 'a', ' ': 'a', x: 'b', X: 'b', q: 'l', Q: 'l', w: 'r', W: 'r',
    Enter: 'start', Backspace: 'select', Shift: 'select'   // Backspace = Select, Shift a second Select (controls.md, Nov 21)
  };
  var REPEAT_AFTER = 320, REPEAT_EVERY = 85;
  var typing = function () { var el = document.activeElement; return !!(el && el.tagName === 'INPUT'); };

  function start(o) {
    var press = o.press, walking = o.walking || function () { return false; }, hold = o.hold || function () {};
    var $ = function (s) { return document.querySelector(s); };

    // D-pad with hold-repeat
    document.querySelectorAll('[data-pad]').forEach(function (b) {
      var t1, t2, d = b.dataset.pad;
      var stop = function () { clearTimeout(t1); clearInterval(t2); b.classList.remove('down'); if (walking()) hold(d, false); };
      b.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        if (typing()) document.activeElement.blur();
        b.classList.add('down');
        if (walking()) hold(d, true);
        press(d);
        t1 = setTimeout(function () { t2 = setInterval(function () { press(d); }, REPEAT_EVERY); }, REPEAT_AFTER);
      });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) { b.addEventListener(ev, stop); });
      b.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    });

    // A, B, L, R, Start, Select: on tap
    [['#bA', 'a'], ['#bB', 'b'], ['#bL', 'l'], ['#bR', 'r'], ['#bStart', 'start'], ['#bSel', 'select']].forEach(function (p) {
      var el = $(p[0]); if (el) el.addEventListener('click', function () { press(p[1]); });   // L and R may be left out (shell.js)
    });

    // Keyboard, for testing on a computer
    document.addEventListener('keydown', function (e) {
      if (typing()) {
        // Enter (the phone keyboard's Go) or Escape only closes the keyboard; it must not also count as Start
        // (a game's own field handler can claim the key first with preventDefault)
        if (!e.defaultPrevented && (e.key === 'Enter' || e.key === 'Escape')) { e.preventDefault(); document.activeElement.blur(); }
        return;
      }
      var k = KEYS[e.key]; if (!k) return;
      e.preventDefault();
      if (walking() && DIRS.indexOf(k) >= 0) { if (e.repeat) return; hold(k, true); }
      press(k);
    });
    document.addEventListener('keyup', function (e) { var k = KEYS[e.key]; if (k && DIRS.indexOf(k) >= 0) hold(k, false); });
    window.addEventListener('blur', function () { DIRS.forEach(function (d) { hold(d, false); }); });
  }

  window.StudioInput = { start: start, KEYS: KEYS };
})();
