// Studio save code: a save turned into one line of text the player copies out and pastes back
// (studio-bible/saves.md: save export and import, because clearing Safari's data wipes saves).
// Set Nov 24, 2026 from Life After spec 001; Black Lantern (BL1:) and Rushlight (RL1:) make the same
// kind of code by hand. Knows nothing about any game.
//
//   StudioCode.make(tag, obj)     'TAG:' plus the object as JSON in base64, safe for any letters (names with accents)
//   StudioCode.read(tag, text)    the object back, or null when the text isn't a good code with that tag.
//                                 Spaces and line breaks the phone adds when pasting are ignored.
(function () {
  function make(tag, obj) {
    return tag + ':' + btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
  }
  function read(tag, text) {
    text = String(text || '').replace(/\s+/g, '');
    if (text.indexOf(tag + ':') !== 0) return null;
    try {
      var o = JSON.parse(decodeURIComponent(escape(atob(text.slice(tag.length + 1)))));
      return o && typeof o === 'object' ? o : null;
    } catch (e) { return null; }
  }
  window.StudioCode = { make: make, read: read };
})();
