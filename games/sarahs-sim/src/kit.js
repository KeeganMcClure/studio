// Sarah's Sim drawing kit: the palette (bible, Art, Palette), text, the menu surface (bible, Art: the cream card with a
// rose border and a stitched inner line, as in mockups/start-menu-v1) and the small icons every screen shares.
// Ported from the approved mockups' drawing code (look-iso-v1, decorate-v1, start-menu-v1, cooking-v1).
var SS = window.SS = window.SS || {};
(function () {
  var P = SS.P = {
    bg1: '#3a2633', bg2: '#22171f',
    wall: ['#f3d2c4', '#ecc1b2', '#dcab9c'], trim: '#fff1e2',
    floor: ['#d39a66', '#c88d5a', '#bb8150', '#a96e45'], plank: '#93603c',
    rose: '#e46f8b', roseHi: '#f39bb0', roseSh: '#b44f63',
    sage: ['#9cc1b6', '#7fa7a0', '#5d8580'], honey: ['#f3d38a', '#e7b75f', '#c78f3e'],
    leaf: '#6aa361', leafHi: '#8fc47b', leafSh: '#437a47', glow: '#ffd56b',
    tray: '#fff6ea', trayEdge: '#e8cdb4', ink: '#6b4250', soft: '#b38a8f', cell: '#fbeedd', blush: '#fde3ea',
    card: 'rgba(255,246,234,.97)', dark: '#3b2430', INK: 'rgba(59,36,48,.85)', gold: '#ffd56b', goldSh: '#c78f3e'
  };
  // the 24-color cozy palette for paint mode (bible, Decorating, Colors; mockups/decorate-v1 paint tray)
  SS.PAINT = ['#f39bb0', '#e46f8b', '#b44f63', '#e99a70', '#c96f45', '#f3d38a', '#e7b75f', '#c78f3e', '#b5d4ca', '#7fa7a0', '#5d8580', '#8fc47b',
    '#6aa361', '#a9c9e8', '#7d93c4', '#4f6a9e', '#c8a6d8', '#9a7bb4', '#f6ead0', '#e6d3b0', '#8e5a37', '#55311d', '#fff1e2', '#2f2228'];
  SS.PATTERNS = ['plain', 'stripes', 'plaid', 'floral', 'leopard', 'dots'];   // bible, Outfits (the same set as clothes)

  var c;
  SS.use = function (ctx) { c = ctx; return SS; };
  var R = SS.R = function (x, y, w, h, col) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  var txt = SS.txt = function (s, x, y, col, size, align) {
    c.font = (size || 8) + 'px "Press Start 2P", monospace'; c.fillStyle = col; c.textAlign = align || 'left'; c.textBaseline = 'top'; c.fillText(s, Math.round(x), Math.round(y));
  };
  SS.tw = function (s, size) { c.font = (size || 8) + 'px "Press Start 2P", monospace'; return Math.ceil(c.measureText(s).width); };
  // body text in VT323, for anything read for meaning (studio-bible/ui.md, Readable text)
  var vt = SS.vt = function (s, x, y, col, size, align) { c.font = (size || 12) + 'px "VT323", monospace'; c.fillStyle = col; c.textAlign = align || 'left'; c.textBaseline = 'top'; c.fillText(s, Math.round(x), Math.round(y)); };
  SS.vtw = function (s, size) { c.font = (size || 12) + 'px "VT323", monospace'; return Math.ceil(c.measureText(s).width); };
  var heart = SS.heart = function (x, y, col, s) { s = s || 1; [[1, 0, 2], [4, 0, 2], [0, 1, 7], [0, 2, 7], [1, 3, 5], [2, 4, 3], [3, 5, 1]].forEach(function (r) { R(x + r[0] * s, y + r[1] * s, r[2] * s, s, col); }); };
  SS.rnd = function (i) { var x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

  // the menu card (bible, Art, Menu surface)
  SS.frame = function (x, y, w, h) {
    R(x + 2, y + 3, w, h, 'rgba(34,18,28,.35)');
    R(x, y, w, h, P.card); R(x, y + h - 1, w, 1, P.trayEdge);
    c.strokeStyle = P.rose; c.lineWidth = 1; c.strokeRect(x + .5, y + .5, w - 1, h - 1);
    c.strokeStyle = 'rgba(228,111,139,.35)'; c.setLineDash([2, 2]); c.strokeRect(x + 2.5, y + 2.5, w - 5, h - 5); c.setLineDash([]);
  };
  SS.header = function (x, y, w, title, sub) {
    heart(x + 8, y + 7, P.rose); txt(title, x + 19, y + 7, P.ink, 8);
    if (sub) txt(sub, x + w - 8, y + 8, P.soft, 6, 'right');
    R(x + 6, y + 19, w - 12, 1, P.trayEdge);
  };
  // a plain card with a single border (the action bubble, the meters, toasts)
  SS.card = function (x, y, w, h, edge) { R(x + 2, y + 3, w, h, 'rgba(34,23,31,.35)'); R(x, y, w, h, P.tray); R(x, y + h - 1, w, 1, P.trayEdge); c.strokeStyle = edge || P.rose; c.lineWidth = 1; c.strokeRect(x + .5, y + .5, w - 1, h - 1); };
  // a button: on = rose with white text (the picked row)
  SS.btn = function (x, y, w, s, on, h, size) {
    h = h || 14;
    R(x, y, w, h, on ? P.rose : P.cell); R(x, y + h - 1, w, 1, on ? P.roseSh : P.trayEdge); if (on) R(x, y, w, 1, P.roseHi);
    txt(s, x + w / 2, y + Math.round((h - (size || 6)) / 2), on ? '#fff' : P.ink, size || 6, 'center');
  };
  SS.chev = function (x, y, col) { R(x, y, 1, 7, col); R(x + 1, y + 1, 1, 5, col); R(x + 2, y + 2, 1, 3, col); R(x + 3, y + 3, 1, 1, col); };
  SS.check = function (x, y, col) { R(x, y + 3, 2, 2, col); R(x + 2, y + 5, 2, 2, col); R(x + 4, y + 3, 2, 2, col); R(x + 6, y + 1, 2, 2, col); R(x + 8, y - 1, 2, 2, col); };
  SS.cross = function (x, y, col) { for (var i = 0; i < 7; i++) { R(x + i, y + i, 2, 1, col); R(x + 6 - i, y + i, 2, 1, col); } };
  SS.backHint = function (x, y) { R(x, y, 12, 12, P.sage[1]); R(x, y + 11, 12, 1, P.sage[2]); txt('B', x + 3, y + 3, '#fff', 6); txt('BACK', x + 16, y + 3, P.soft, 6); };
  SS.addButton = function (x, y, w, label) {
    c.strokeStyle = P.rose; c.setLineDash([3, 2]); c.strokeRect(x + .5, y + .5, w - 1, 17); c.setLineDash([]);
    R(x + 8, y + 8, 7, 2, P.rose); R(x + 10, y + 6, 2, 6, P.rose); txt(label, x + 22, y + 6, P.rose, 7);
  };
  SS.finger = function (px, py) { c.fillStyle = 'rgba(255,255,255,.45)'; c.beginPath(); c.arc(px, py, 7, 0, 7); c.fill(); c.strokeStyle = 'rgba(255,255,255,.95)'; c.stroke(); };
  // a small chip over a piece: a symbol (↻ ✥ ✕) or a short word
  SS.chip = function (x, y, s, w, on) {
    w = w || 14;
    R(x, y, w, 13, on ? P.rose : '#fff6ea'); R(x, y + 12, w, 1, on ? P.roseSh : P.trayEdge); c.strokeStyle = P.rose; c.strokeRect(x + .5, y + .5, w - 1, 12);
    var ink = on ? '#fff' : P.ink;
    if (s === 'turn') { c.strokeStyle = ink; c.beginPath(); c.arc(x + w / 2, y + 7, 3.5, -2.6, 2.2); c.stroke(); R(x + w / 2 - 5, y + 2, 3, 1, ink); R(x + w / 2 - 3, y + 2, 1, 3, ink); }
    else if (s === 'move') { R(x + w / 2 - .5, y + 2, 1, 9, ink); R(x + w / 2 - 4.5, y + 6, 9, 1, ink); R(x + w / 2 - 1.5, y + 3, 3, 1, ink); R(x + w / 2 - 1.5, y + 9, 3, 1, ink); R(x + w / 2 - 3.5, y + 5, 1, 3, ink); R(x + w / 2 + 2.5, y + 5, 1, 3, ink); }
    else if (s === 'away') SS.cross(x + w / 2 - 4, y + 3, ink);
    else txt(s, x + w / 2, y + 4, ink, 5, 'center');
  };
  // 12 x 12 row icons for the Start menu (mockups/start-menu-v1)
  function heartTiny(x, y, col) { R(x, y, 1, 1, col); R(x + 2, y, 1, 1, col); R(x, y + 1, 3, 1, col); R(x + 1, y + 2, 1, 1, col); }
  SS.ICONS = {
    home: function (x, y, k, k2) { R(x + 5, y, 2, 1, k); R(x + 3, y + 1, 6, 1, k); R(x + 1, y + 2, 10, 2, k); R(x + 2, y + 4, 8, 7, k); R(x + 5, y + 7, 2, 4, k2); R(x + 3, y + 5, 2, 2, k2); R(x + 8, y + 1, 2, 2, k); },
    people: function (x, y, k, k2) { R(x + 2, y + 1, 4, 4, k); R(x + 1, y + 6, 6, 5, k); R(x + 7, y + 2, 4, 4, k2); R(x + 7, y + 7, 5, 4, k2); },
    homes: function (x, y, k, k2) { R(x + 2, y + 2, 4, 1, k); R(x + 1, y + 3, 6, 1, k); R(x + 1, y + 4, 6, 7, k); R(x + 3, y + 8, 2, 3, k2); R(x + 8, y + 4, 3, 1, k2); R(x + 7, y + 5, 5, 6, k2); R(x + 9, y + 8, 1, 3, k); },
    fav: function (x, y, k) { R(x + 2, y + 2, 3, 1, k); R(x + 7, y + 2, 3, 1, k); R(x + 1, y + 3, 10, 3, k); R(x + 2, y + 6, 8, 1, k); R(x + 3, y + 7, 6, 1, k); R(x + 4, y + 8, 4, 1, k); R(x + 5, y + 9, 2, 1, k); },
    camera: function (x, y, k, k2) { R(x + 4, y + 2, 4, 1, k); R(x, y + 3, 12, 8, k); R(x + 4, y + 5, 4, 4, k2); R(x + 5, y + 6, 2, 2, k); R(x + 9, y + 4, 2, 1, k2); },
    book: function (x, y, k, k2) { R(x + 1, y + 1, 10, 10, k); R(x + 3, y + 2, 7, 8, k2); R(x + 2, y + 1, 1, 10, k2); heartTiny(x + 5, y + 4, k); },
    backup: function (x, y, k, k2) { R(x + 1, y + 6, 10, 5, k); R(x + 2, y + 7, 8, 1, k2); R(x + 5, y, 2, 5, k); R(x + 3, y + 3, 6, 1, k); R(x + 4, y + 4, 4, 1, k); },
    title: function (x, y, k, k2) { R(x + 5, y, 2, 12, k); R(x + 2, y + 3, 8, 1, k); R(x + 3, y + 2, 1, 3, k2); R(x + 8, y + 2, 1, 3, k2); R(x + 1, y + 5, 10, 1, k); R(x + 4, y + 8, 4, 1, k2); R(x + 3, y + 9, 6, 1, k); },
    menu: function (x, y, k) { R(x + 1, y + 2, 10, 2, k); R(x + 1, y + 5, 10, 2, k); R(x + 1, y + 8, 10, 2, k); },
    undo: function (x, y, k) { c.strokeStyle = k; c.lineWidth = 1.5; c.beginPath(); c.arc(x + 6.5, y + 7, 4, -2.8, 1.6); c.stroke(); c.lineWidth = 1; R(x + 1, y + 2, 1, 4, k); R(x + 1, y + 5, 4, 1, k); }
  };
  // catalog tab icons (mockups/decorate-v1), in the bible's tab order
  SS.TABS = ['seating', 'tables', 'beds', 'storage', 'lights', 'plants', 'rugs', 'wall', 'decor', 'ours', 'holiday'];
  SS.TAB_NAMES = { seating: 'SEATING', tables: 'TABLES', beds: 'BEDS', storage: 'STORAGE', lights: 'LIGHTS', plants: 'PLANTS', rugs: 'RUGS', wall: 'WALL', decor: 'DECOR', ours: 'OURS', holiday: 'HOLIDAY' };
  SS.tabIcon = function (tab, x, y, on) {
    var k = on ? '#fff' : P.ink, k2 = on ? '#ffd9e2' : P.soft;
    ({
      ours: function () { heart(x + 3, y + 3, on ? '#fff' : P.rose); },
      seating: function () { R(x + 2, y + 1, 2, 9, k); R(x + 2, y + 6, 8, 2, k); R(x + 8, y + 6, 2, 4, k); R(x + 4, y + 2, 1, 4, k2); },
      tables: function () { R(x + 1, y + 3, 11, 2, k); R(x + 2, y + 5, 2, 5, k); R(x + 9, y + 5, 2, 5, k); },
      beds: function () { R(x + 1, y + 2, 2, 8, k); R(x + 1, y + 6, 11, 3, k); R(x + 3, y + 4, 4, 2, k2); R(x + 10, y + 5, 2, 5, k); },
      storage: function () { R(x + 2, y + 1, 9, 9, k); R(x + 3, y + 2, 7, 3, k2); R(x + 3, y + 6, 7, 3, k2); R(x + 6, y + 3, 1, 1, k); R(x + 6, y + 7, 1, 1, k); },
      lights: function () { R(x + 3, y + 1, 7, 4, k); R(x + 6, y + 5, 1, 4, k); R(x + 4, y + 9, 5, 1, k); },
      plants: function () { R(x + 4, y + 6, 5, 4, k); R(x + 2, y + 2, 3, 3, k2); R(x + 7, y + 1, 3, 4, k2); R(x + 6, y + 3, 1, 3, k); },
      rugs: function () { R(x + 1, y + 3, 11, 5, k); R(x + 3, y + 4, 7, 3, k2); R(x + 1, y + 8, 1, 2, k); R(x + 11, y + 8, 1, 2, k); },
      wall: function () { R(x + 2, y + 1, 9, 8, k); R(x + 3, y + 2, 7, 6, k2); R(x + 4, y + 5, 3, 2, k); R(x + 7, y + 4, 2, 3, k); },
      decor: function () { R(x + 4, y + 2, 5, 1, k); R(x + 5, y + 3, 3, 1, k); R(x + 3, y + 4, 7, 6, k); R(x + 4, y + 5, 2, 3, k2); },
      holiday: function () { R(x + 6, y + 1, 1, 2, k); R(x + 4, y + 3, 5, 2, k); R(x + 1, y + 4, 11, 2, k); R(x + 3, y + 6, 7, 2, k); R(x + 2, y + 8, 3, 2, k); R(x + 8, y + 8, 3, 2, k); }
    })[tab]();
  };
})();
