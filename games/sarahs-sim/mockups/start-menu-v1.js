// Sarah's Sim: Start menu mockup v1 (Nov 25, 2026). All art drawn in code.
// drawStartMenu(ctx, W, H, t, state): state 'menu' (the Start menu over the dimmed home),
// 'people' (People: the people in this home, each opens Style; New person opens the Creator),
// 'homes' (Homes: her homes in this mode; New lot in Sandbox).
// Needs decorate-v1.js (the home behind, state 'home') and people-v1.js (the portraits).
(function () {
  var c;
  var P = {
    card: 'rgba(255,246,234,.97)', edge: '#e8cdb4', ink: '#6b4250', soft: '#b38a8f',
    rose: '#e46f8b', roseHi: '#f39bb0', roseSh: '#b44f63', blush: '#fde3ea', cell: '#fbeedd',
    sage: '#7fa7a0', sageHi: '#a8cbc0', gold: '#ffd56b'
  };
  function R(x, y, w, h, col) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
  function txt(s, x, y, col, size, align) { c.font = (size || 8) + 'px "Press Start 2P", monospace'; c.fillStyle = col; c.textAlign = align || 'left'; c.textBaseline = 'top'; c.fillText(s, x, y); }
  function heart(x, y, col) { R(x + 1, y, 2, 1, col); R(x + 4, y, 2, 1, col); R(x, y + 1, 7, 2, col); R(x + 1, y + 3, 5, 1, col); R(x + 2, y + 4, 3, 1, col); R(x + 3, y + 5, 1, 1, col); }
  function frame(x, y, w, h) { // the menu card: cream with a rose border, the same card as the title menu
    R(x + 2, y + 3, w, h, 'rgba(34,18,28,.35)');
    R(x, y, w, h, P.card); R(x, y + h - 1, w, 1, P.edge);
    c.strokeStyle = P.rose; c.lineWidth = 1; c.strokeRect(x + .5, y + .5, w - 1, h - 1);
    c.strokeStyle = 'rgba(228,111,139,.35)'; c.setLineDash([2, 2]); c.strokeRect(x + 2.5, y + 2.5, w - 5, h - 5); c.setLineDash([]); // a stitched inner line
  }
  function header(x, y, w, title, sub) {
    heart(x + 8, y + 7, P.rose); txt(title, x + 19, y + 7, P.ink, 8);
    if (sub) txt(sub, x + w - 8, y + 8, P.soft, 6, 'right');
    R(x + 6, y + 19, w - 12, 1, P.edge);
  }
  function chev(x, y, col) { R(x, y, 1, 7, col); R(x + 1, y + 1, 1, 5, col); R(x + 2, y + 2, 1, 3, col); R(x + 3, y + 3, 1, 1, col); }
  function check(x, y, col) { R(x, y + 3, 2, 2, col); R(x + 2, y + 5, 2, 2, col); R(x + 4, y + 3, 2, 2, col); R(x + 6, y + 1, 2, 2, col); R(x + 8, y - 1, 2, 2, col); }
  // 12 x 12 row icons
  var ICONS = {
    home: function (x, y, k, k2) { R(x + 5, y, 2, 1, k); R(x + 3, y + 1, 6, 1, k); R(x + 1, y + 2, 10, 2, k); R(x + 2, y + 4, 8, 7, k); R(x + 5, y + 7, 2, 4, k2); R(x + 3, y + 5, 2, 2, k2); R(x + 8, y + 1, 2, 2, k); },
    people: function (x, y, k, k2) { R(x + 2, y + 1, 4, 4, k); R(x + 1, y + 6, 6, 5, k); R(x + 7, y + 2, 4, 4, k2); R(x + 7, y + 7, 5, 4, k2); },
    homes: function (x, y, k, k2) { R(x + 2, y + 2, 4, 1, k); R(x + 1, y + 3, 6, 1, k); R(x + 1, y + 4, 6, 7, k); R(x + 3, y + 8, 2, 3, k2); R(x + 8, y + 4, 3, 1, k2); R(x + 7, y + 5, 5, 6, k2); R(x + 9, y + 8, 1, 3, k); },
    fav: function (x, y, k) { R(x + 2, y + 2, 3, 1, k); R(x + 7, y + 2, 3, 1, k); R(x + 1, y + 3, 10, 3, k); R(x + 2, y + 6, 8, 1, k); R(x + 3, y + 7, 6, 1, k); R(x + 4, y + 8, 4, 1, k); R(x + 5, y + 9, 2, 1, k); },
    camera: function (x, y, k, k2) { R(x + 4, y + 2, 4, 1, k); R(x, y + 3, 12, 8, k); R(x + 4, y + 5, 4, 4, k2); R(x + 5, y + 6, 2, 2, k); R(x + 9, y + 4, 2, 1, k2); },
    book: function (x, y, k, k2) { R(x + 1, y + 1, 10, 10, k); R(x + 3, y + 2, 7, 8, k2); R(x + 2, y + 1, 1, 10, k2); heartTiny(x + 5, y + 4, k); },
    backup: function (x, y, k, k2) { R(x + 1, y + 6, 10, 5, k); R(x + 2, y + 7, 8, 1, k2); R(x + 5, y, 2, 5, k); R(x + 3, y + 3, 6, 1, k); R(x + 4, y + 4, 4, 1, k); },
    title: function (x, y, k, k2) { R(x + 5, y, 2, 12, k); R(x + 2, y + 3, 8, 1, k); R(x + 3, y + 2, 1, 3, k2); R(x + 8, y + 2, 1, 3, k2); R(x + 1, y + 5, 10, 1, k); R(x + 4, y + 8, 4, 1, k2); R(x + 3, y + 9, 6, 1, k); }
  };
  function heartTiny(x, y, col) { R(x, y, 1, 1, col); R(x + 2, y, 1, 1, col); R(x, y + 1, 3, 1, col); R(x + 1, y + 2, 1, 1, col); }

  function menuCard(W, H, t) {
    var rows = [['BACK TO HOME', 'home'], ['PEOPLE', 'people', 1], ['HOMES', 'homes', 1], ['FAVORITES', 'fav', 1], ['CAMERA', 'camera'],
      ['MEMORY BOOK', 'book', 1], ['MAKE A BACKUP', 'backup'], ['TITLE', 'title']];
    var rh = 17, w = 184, h = 22 + rows.length * rh + 18, x = (W - w) / 2, y = Math.max(26, Math.round((H - h) / 2) - 10);
    frame(x, y, w, h); header(x, y, w, 'MENU', 'SANDBOX');
    rows.forEach(function (r, i) {
      var ry = y + 23 + i * rh, on = i === 0;
      if (on) { R(x + 5, ry, w - 10, rh - 2, P.rose); R(x + 5, ry, w - 10, 1, P.roseHi); R(x + 5, ry + rh - 3, w - 10, 1, P.roseSh); }
      ICONS[r[1]](x + 10, ry + 2, on ? '#fff' : P.ink, on ? P.roseSh : P.cell);
      txt(r[0], x + 28, ry + 4, on ? '#fff' : P.ink, 7);
      if (r[2]) chev(x + w - 14, ry + 4, on ? '#fff' : P.soft);
    });
    // reassurance line: saving is automatic
    var fy = y + 23 + rows.length * rh + 3;
    check(x + 10, fy + 3, P.sage); txt('SAVED JUST NOW', x + 24, fy + 3, P.soft, 6);
    return { x: x, y: y, w: w, h: h };
  }

  var PORT = {};
  function portrait(name, x, y, t) { // the approved 64 x 64 portrait, shown at 32 x 32 with a frame
    if (!PORT[name]) {
      var oc = document.createElement('canvas'); oc.width = 64; oc.height = 64; var oc2 = oc.getContext('2d');
      if (window.SS_PORTRAITS) window.SS_PORTRAITS[name](oc2, 0, 0, 1, 0, false);
      PORT[name] = oc;
    }
    R(x - 2, y - 2, 36, 36, '#3b2430'); R(x - 1, y - 1, 34, 34, '#fff1e2');
    c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high'; c.drawImage(PORT[name], x, y, 32, 32); c.imageSmoothingEnabled = false;
  }
  function personCard(x, y, w, name, sub, who, on, t) {
    var h = 42;
    R(x, y, w, h, on ? P.blush : P.cell); R(x, y + h - 1, w, 1, P.edge);
    if (on) { c.strokeStyle = P.rose; c.lineWidth = 2; c.strokeRect(x + 1, y + 1, w - 2, h - 2); c.lineWidth = 1; }
    portrait(who, x + 6, y + 5, t);
    txt(name, x + 46, y + 8, P.ink, 8);
    txt(sub, x + 46, y + 21, P.soft, 6);
    // the Style button on the card
    var bx = x + w - 48, by = y + 25;
    R(bx, by, 42, 12, on ? P.rose : '#fff6ea'); R(bx, by + 11, 42, 1, on ? P.roseSh : P.edge); if (on) R(bx, by, 42, 1, P.roseHi);
    txt('STYLE', bx + 21, by + 3, on ? '#fff' : P.ink, 6, 'center');
  }
  function addButton(x, y, w, label) {
    c.strokeStyle = P.rose; c.setLineDash([3, 2]); c.strokeRect(x + .5, y + .5, w - 1, 17); c.setLineDash([]);
    R(x + 8, y + 8, 7, 2, P.rose); R(x + 10, y + 6, 2, 6, P.rose);
    txt(label, x + 22, y + 6, P.rose, 7);
  }
  function backHint(x, y) { // B goes back; a tap on the arrow does too
    R(x, y, 12, 12, P.sage); R(x, y + 11, 12, 1, '#5d8580'); txt('B', x + 3, y + 3, '#fff', 6);
    txt('BACK', x + 16, y + 3, P.soft, 6);
  }
  function peopleCard(W, H, t) {
    var w = 200, h = 22 + 2 * 46 + 26 + 18, x = (W - w) / 2, y = Math.max(26, Math.round((H - h) / 2) - 10);
    frame(x, y, w, h); header(x, y, w, 'PEOPLE', 'OUR PLACE');
    personCard(x + 6, y + 24, w - 12, 'SARAH', 'READING A BOOK', 'sarah', true, t);
    personCard(x + 6, y + 70, w - 12, 'KEEGAN', 'MAKING COCOA', 'keegan', false, t);
    addButton(x + 6, y + 118, w - 12, 'NEW PERSON');
    backHint(x + 8, y + h - 16);
  }
  function miniHome(x, y, kind, t) { // a tiny front view of each home, 32 x 32
    R(x - 2, y - 2, 36, 36, '#3b2430'); R(x - 1, y - 1, 34, 34, '#2f3355');
    for (var i = 0; i < 6; i++) R(x + (i * 11 + t) % 32, y + (i * 7 + t * 2) % 20, 1, 1, '#fff');
    if (kind === 'row') { // the brick rowhouse from the title
      R(x + 4, y + 8, 24, 24, '#a9473f'); for (var j = 0; j < 6; j++) R(x + 4, y + 11 + j * 4, 24, 1, '#8f3b35');
      R(x + 3, y + 6, 26, 3, '#f7fbff'); R(x + 3, y + 8, 26, 1, '#d9e2ee');
      [[7, 12], [19, 12]].forEach(function (p) { R(x + p[0], y + p[1], 6, 6, '#fff1e2'); R(x + p[0] + 1, y + p[1] + 1, 4, 4, '#ffd56b'); });
      R(x + 13, y + 22, 6, 10, '#2f4a63'); R(x + 14, y + 23, 4, 4, '#ffd56b'); R(x + 11, y + 30, 10, 2, '#c9c1c4');
      R(x + 12, y + 19, 8, 2, '#3e7a4f'); R(x + 15, y + 19, 2, 2, '#e46f6a');
    } else { // the cottage she built on the medium lot
      R(x + 2, y + 30, 30, 2, '#f7fbff');
      R(x + 6, y + 16, 22, 14, '#f3d2c4'); R(x + 22, y + 16, 6, 14, '#dcab9c');
      for (var k = 0; k < 8; k++) R(x + 4 + k, y + 16 - k, 26 - k * 2, 1, k < 2 ? '#f7fbff' : '#7fa7a0');
      R(x + 9, y + 19, 5, 5, '#fff1e2'); R(x + 10, y + 20, 3, 3, '#ffd56b');
      R(x + 17, y + 21, 5, 9, '#8e5a37'); R(x + 18, y + 22, 3, 3, '#ffd56b');
    }
  }
  function homeCard(x, y, w, name, sub, kind, on, here, t) {
    var h = 42;
    R(x, y, w, h, on ? P.blush : P.cell); R(x, y + h - 1, w, 1, P.edge);
    if (on) { c.strokeStyle = P.rose; c.lineWidth = 2; c.strokeRect(x + 1, y + 1, w - 2, h - 2); c.lineWidth = 1; }
    miniHome(x + 6, y + 5, kind, t);
    txt(name, x + 46, y + 8, P.ink, 7);
    txt(sub, x + 46, y + 20, P.soft, 6);
    if (here) { R(x + 46, y + 28, 70, 10, P.sage); R(x + 46, y + 37, 70, 1, '#5d8580'); txt('YOU ARE HERE', x + 81, y + 30, '#fff', 5, 'center'); }
    else { var bx = x + w - 48, by = y + 25; R(bx, by, 42, 12, on ? P.rose : '#fff6ea'); R(bx, by + 11, 42, 1, on ? P.roseSh : P.edge); if (on) R(bx, by, 42, 1, P.roseHi); txt('GO', bx + 21, by + 3, on ? '#fff' : P.ink, 6, 'center'); }
  }
  function homesCard(W, H, t) {
    var w = 200, h = 22 + 2 * 46 + 26 + 18, x = (W - w) / 2, y = Math.max(26, Math.round((H - h) / 2) - 10);
    frame(x, y, w, h); header(x, y, w, 'HOMES', 'SANDBOX');
    homeCard(x + 6, y + 24, w - 12, 'OUR PLACE', 'SMALL LOT', 'row', false, true, t);
    homeCard(x + 6, y + 70, w - 12, 'SAGE COTTAGE', 'MEDIUM LOT', 'cottage', true, false, t);
    addButton(x + 6, y + 118, w - 12, 'NEW LOT');
    backHint(x + 8, y + h - 16);
  }

  window.drawStartMenu = function (ctx, W, H, t, st) {
    c = ctx; t = t || 0; st = st || 'menu';
    window.drawDecorate(ctx, W, H, t, 'home');
    c = ctx; c.imageSmoothingEnabled = false;
    R(0, 0, W, H, 'rgba(34,18,28,.62)'); // the home dims and holds still behind the menu
    if (st === 'menu') menuCard(W, H, t);
    else if (st === 'people') peopleCard(W, H, t);
    else homesCard(W, H, t);
  };
})();
