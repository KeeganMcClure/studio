// Studio menu width: keeps a list menu (a box of rows with a cursor) one fixed width while the cursor moves.
// Set Nov 22, 2026 from a Black Lantern bug: the box grew and shrank to fit the selected row's description line.
// Knows nothing about any game.
//
//   StudioMenu.lockWidth(el, html)   call once, when the menu opens. Puts html (the title and every row, with no
//                                    description line) in el, measures it, and fixes el's width to that. Returns
//                                    the width in px. Afterwards re-render el as often as you like: a description
//                                    line wraps inside the fixed width instead of stretching the box.
//   StudioMenu.unlock(el)            lets el size itself again (call when the menu closes).
//
// The width comes from the widest row plus the cursor column, which is always reserved on every row, so it never
// depends on which row is selected. The box's CSS min-width and max-width still apply. Call lockWidth again
// after the screen is resized, since the text scales with it.
(function () {
  function unlock(el) { el.style.width = ''; el.style.boxSizing = ''; }
  function lockWidth(el, html) {
    unlock(el);
    el.innerHTML = html;
    var w = Math.ceil(el.getBoundingClientRect().width);
    el.style.boxSizing = 'border-box';
    el.style.width = w + 'px';
    return w;
  }
  window.StudioMenu = { lockWidth: lockWidth, unlock: unlock };
})();
