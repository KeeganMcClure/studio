// Test Cart: the placeholder game that proves the launcher pipeline.
// Walk with the D-pad; A drops a coin and saves, so a reboot test can check the count.
// Save: one key, versioned (studio-bible/saves.md). Dev builds save under dev.tc. (engine/studio.js).
(function () {
  var KEY = Studio.savePrefix('tc.') + 'save';
  var VERSION = 1;
  var cv = document.getElementById('c'), ctx = cv.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  document.getElementById('chan').textContent = Studio.channel === 'dev' ? 'TEST CART · DEV' : 'TEST CART';
  document.getElementById('shelf').onclick = function (e) { e.preventDefault(); save(); Studio.toShelf(); };

  // Load, upgrading older saves step by step (none yet: version 1 is the first).
  var UPGRADES = [];
  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY));
      if (!s) return null;
      while ((s.v || 0) < VERSION) { UPGRADES[s.v || 0](s); s.v = (s.v || 0) + 1; }
      return s;
    } catch (e) { return null; }
  }
  var st = load() || { v: VERSION, x: 112, y: 70, coins: 0, first: null, last: null };
  var title = !Studio.continued && !st.first;   // fresh game opens on a title card
  var msg = st.first ? 'SAVE LOADED' : '', msgT = st.first ? 90 : 0;

  function save() {
    st.last = Date.now();
    if (!st.first) st.first = st.last;
    try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {}
  }
  window.addEventListener('pagehide', save);   // save on close

  var held = {};
  function press(k) {
    if (title) { if (k === 'a' || k === 'start') title = false; return; }
    if (k === 'a') { st.coins++; save(); msg = 'COIN SAVED'; msgT = 60; }
  }
  // Touch buttons
  document.querySelectorAll('[data-k]').forEach(function (b) {
    var k = b.dataset.k;
    function down(e) { e.preventDefault(); held[k] = true; b.classList.add('on'); press(k); }
    function up(e) { e.preventDefault(); held[k] = false; b.classList.remove('on'); }
    b.addEventListener('pointerdown', down);
    b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up); b.addEventListener('pointerleave', up);
  });
  // Keyboard (studio-bible/controls.md)
  var KEYS = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', z: 'a', x: 'b', q: 'l', w: 'r', Enter: 'start', Backspace: 'select' };
  addEventListener('keydown', function (e) { var k = KEYS[e.key] || KEYS[e.key.toLowerCase()]; if (!k) return; e.preventDefault(); if (!held[k]) press(k); held[k] = true; });
  addEventListener('keyup', function (e) { var k = KEYS[e.key] || KEYS[e.key.toLowerCase()]; if (k) held[k] = false; });

  function r(c, x, y, w, h) { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); }
  function text(s, x, y, c, size) { ctx.font = (size || 8) + 'px "Press Start 2P", monospace'; ctx.fillStyle = '#0a0812'; ctx.fillText(s, x + 1, y + 1); ctx.fillStyle = c; ctx.fillText(s, x, y); }
  function fmt(t) { var d = new Date(t); return (d.getMonth() + 1) + '/' + d.getDate() + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); }

  var frame = 0;
  function tick() {
    frame++;
    if (!title) {
      var sp = 1;
      if (held.left) st.x -= sp; if (held.right) st.x += sp; if (held.up) st.y -= sp; if (held.down) st.y += sp;
      st.x = Math.max(0, Math.min(226, st.x)); st.y = Math.max(28, Math.min(146, st.y));
    }
    ctx.textBaseline = 'top';
    r('#0d1322', 0, 0, 240, 160);
    for (var gx = 0; gx < 240; gx += 16) for (var gy = 24; gy < 160; gy += 16) if ((gx + gy) % 32 === 0) r('#141c33', gx, gy, 16, 16);
    if (title) {
      text('TEST CART', 84, 54, '#ffd166');
      if (frame % 60 < 40) text('PRESS A', 92, 90, '#ebe5c8');
      text(Studio.channel.toUpperCase() + ' BUILD', 4, 148, '#5d5888', 6);
    } else {
      r('#141c33', 0, 0, 240, 22);
      text('COINS ' + st.coins, 4, 4, '#ffd166');
      text(st.first ? 'FIRST SAVE ' + fmt(st.first) : 'PRESS A TO SAVE', 4, 13, '#7c86a6', 6);
      // the player: a little cartridge with legs
      var bob = (held.left || held.right || held.up || held.down) && frame % 16 < 8 ? 1 : 0;
      r('#0a0812', st.x - 1, st.y - 1 + bob, 16, 14);
      r('#5242a0', st.x, st.y + bob, 14, 12);
      r('#ebe5c8', st.x + 3, st.y + 3 + bob, 8, 5);
      r('#0a0812', st.x + 3, st.y + 12, 3, 2 - bob); r('#0a0812', st.x + 8, st.y + 12, 3, 1 + bob);
      if (msgT > 0) { msgT--; text(msg, 240 - msg.length * 8 - 4, 148, '#3ff0e8'); }
    }
    requestAnimationFrame(tick);
  }
  (document.fonts ? document.fonts.load('8px "Press Start 2P"').catch(function () {}) : Promise.resolve()).then(tick);
})();
