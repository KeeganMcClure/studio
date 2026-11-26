// Studio shell: builds the GBA-style handheld around a game's screen (studio-bible/controls.md, Shell and Buttons).
// Shared by every game; the look comes from engine/shell.css and the game's own colors.
//
// The game's index.html holds only its screen, marked with the brand text and its own button labels:
//   <div class="screen" id="screen" data-brand="BLACK LANTERN" data-brand-sub="DOT MATRIX"
//        data-label-start="Start: menu">...</div>
//   <script src="../../../engine/shell.js"></script>   (first script, before any game code)
// Optional labels (spoken by screen readers): data-label-l, -r, -start, -select, -a, -b.
// data-shoulders="off" leaves out the L and R row, for a game whose bible drops them (Sarah's Sim, Nov 25, 2026);
// the screen gets that space. engine/input.js skips buttons that aren't there.
//
// It wraps the screen in the bezel with the brand strip and the LED (#led), then the shoulder row with
// L top left and R top right (#bL #bR, spec 003), then the controls row: D-pad ([data-pad]),
// Select and Start (#bSel #bStart), and A and B (#bA #bB).
// engine/input.js makes the buttons work.
(function () {
  var screen = document.getElementById('screen');
  if (!screen) throw new Error('shell.js: no #screen element');
  var d = screen.dataset;
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var lab = function (k, def) { return esc(d['label' + k] || def); };

  var wrap = document.createElement('div');
  wrap.className = 'wrap';
  // Same markup, spacing included, as the hand-copied shell it replaced (Nov 21, 2026), apart from L and R,
  // which moved from the middle cluster into their own shoulder row under the screen (spec 003, Nov 21).
  wrap.innerHTML =
    '\n  <div class="shell">\n    <div class="bezel">\n' +
    '      <div class="brand"><span><span class="led" id="led"></span>' + esc(d.brand || '') + '</span><span>' + esc(d.brandSub || '') + '</span></div>\n' +
    '      <i data-screen></i>\n    </div>\n' +
    (d.shoulders === 'off' ? '' :
    '    <div class="shoulders">\n' +
    '      <button class="sh l" id="bL" aria-label="' + lab('L', 'L: previous') + '">L</button>\n' +
    '      <button class="sh r" id="bR" aria-label="' + lab('R', 'R: next') + '">R</button>\n' +
    '    </div>\n') +
    '    <div class="ctrls">\n' +
    '      <div class="dpad">\n' +
    '        <button class="u" data-pad="up" aria-label="Up">▲</button>\n' +
    '        <button class="l" data-pad="left" aria-label="Left">◀</button>\n' +
    '        <span class="c"></span>\n' +
    '        <button class="r" data-pad="right" aria-label="Right">▶</button>\n' +
    '        <button class="d" data-pad="down" aria-label="Down">▼</button>\n' +
    '      </div>\n' +
    '      <div class="mid">\n' +
    '        <div class="ss">\n' +
    '          <div><button id="bSel" aria-label="' + lab('Select', 'Select') + '"></button><span>SELECT</span></div>\n' +
    '          <div><button id="bStart" aria-label="' + lab('Start', 'Start: menu') + '"></button><span>START</span></div>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '      <div class="ab">\n' +
    '        <button class="a" id="bA" aria-label="' + lab('A', 'A: confirm') + '">A</button>\n' +
    '        <button class="b" id="bB" aria-label="' + lab('B', 'B: back') + '">B</button>\n' +
    '      </div>\n' +
    '    </div>\n  </div>\n';
  screen.parentNode.insertBefore(wrap, screen);
  var slot = wrap.querySelector('[data-screen]');
  slot.parentNode.replaceChild(screen, slot);
})();
