// Sarah's Sim: Favorites mockup v1 (Nov 25, 2026). All art drawn in code.
// drawFavorites(ctx, W, H, t, state): 'rooms' (the Rooms tab, with Save this room),
// 'place' (a favorite picked: she taps a room in any home to fill it), 'outfits' (the Outfits tab).
// Needs decorate-v1.js, people-v1.js and start-menu-v1.js (the shared menu card).
(function () {
  var c, M;
  var THEMES = {
    cozy: null,
    sage: { wallL: ['#d7e6dc', '#c6dacd', '#adc7b7'], wallR: ['#c3d8ca', '#b2cbbb', '#97b5a2'], floor: ['#8e6447', '#835b3f', '#775237', '#6a482f'], plank: '#5a3c27',
      sofa: ['#f39bb0', '#e46f8b', '#b44f63'], rug: '#7d93c4', rugIn: '#a9c9e8', trim: '#fff6ea', base: '#7f9c8a' },
    lilac: { wallL: ['#e6d6ef', '#dac6e6', '#c6aed6'], wallR: ['#d4c0e2', '#c6b0d8', '#ae94c4'], floor: ['#e6c9a0', '#dcbc90', '#d0ae82', '#bf9c70'], plank: '#a8875e',
      sofa: ['#f3d38a', '#e7b75f', '#c78f3e'], rug: '#e46f8b', rugIn: '#f39bb0', trim: '#fff6ea', base: '#9a7bb4' }
  };
  var THUMB = {};
  function roomThumb(key, x, y, w, h, t) { // a real render of the saved room, shrunk
    if (!THUMB[key]) {
      var oc = document.createElement('canvas'); oc.width = 240; oc.height = 260;
      window.drawDecorate(oc.getContext('2d'), 240, 260, 3, 'bare', THEMES[key]);
      THUMB[key] = oc;
    }
    c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high';
    c.drawImage(THUMB[key], 6, 34, 228, 214, x, y, w, h); c.imageSmoothingEnabled = false;
  }
  var SPR = {};
  function outfitThumb(key, x, y, w, h, t) { // the map sprite in the saved outfit, on a soft backdrop
    M.R(x, y, w, h, '#f6e3d3'); for (var i = 0; i < w; i += 6) M.R(x + i, y, 3, h, '#f2dccb');
    M.R(x, y + h - 10, w, 10, '#e8cdb4');
    if (!SPR[key]) {
      var oc = document.createElement('canvas'); oc.width = 64; oc.height = 96; var o = oc.getContext('2d');
      var S = window.SS_SPRITES;
      if (key === 'orange') S.sarah(o, 14, 10, 2, 0, false, 'orange');
      else if (key === 'cozy') S.sarah(o, 14, 10, 2, 0, true);
      else S.keegan(o, 12, 6, 2, 0, key === 'cap');
      SPR[key] = oc;
    }
    c.fillStyle = 'rgba(90,45,40,.22)'; c.beginPath(); c.ellipse(x + w / 2, y + h - 5, 10, 2, 0, 0, 7); c.fill();
    c.drawImage(SPR[key], 0, 0, 64, 96, x + w / 2 - 16, y + h - 47, 32, 48);
  }
  function tabs(x, y, w, on) {
    ['ROOMS', 'OUTFITS'].forEach(function (s, i) {
      var tw = (w - 16) / 2, tx = x + 6 + i * (tw + 4), sel = i === on;
      M.R(tx, y, tw, 13, sel ? M.P.rose : M.P.cell); M.R(tx, y + 12, tw, 1, sel ? M.P.roseSh : M.P.edge); if (sel) M.R(tx, y, tw, 1, M.P.roseHi);
      M.txt(s, tx + tw / 2, y + 3, sel ? '#fff' : M.P.ink, 7, 'center');
    });
  }
  function tile(x, y, w, h, name, sub, on, draw) {
    M.R(x, y, w, h, on ? M.P.blush : M.P.cell); M.R(x, y + h - 1, w, 1, M.P.edge);
    var th = h - 22; M.R(x + 3, y + 3, w - 6, th, '#3b2430'); draw(x + 4, y + 4, w - 8, th - 2);
    if (on) { c.strokeStyle = M.P.rose; c.lineWidth = 2; c.strokeRect(x + 1, y + 1, w - 2, h - 2); c.lineWidth = 1; M.heart(x + w - 12, y + 6, '#fff'); }
    M.txt(name, x + 4, y + th + 6, M.P.ink, 6);
    M.txt(sub, x + 4, y + th + 14, M.P.soft, 5);
  }
  function saveTile(x, y, w, h, label) {
    c.strokeStyle = M.P.rose; c.setLineDash([3, 2]); c.strokeRect(x + .5, y + .5, w - 1, h - 1); c.setLineDash([]);
    var cx = x + w / 2, cy = y + h / 2 - 8;
    M.R(cx - 8, cy - 2, 16, 4, M.P.rose); M.R(cx - 2, cy - 8, 4, 16, M.P.rose);
    M.txt(label[0], cx, cy + 14, M.P.rose, 6, 'center'); M.txt(label[1], cx, cy + 22, M.P.rose, 6, 'center');
  }
  function card(W, H, which, t) {
    var w = 220, cw = 102, ch = 72, h = 22 + 17 + 2 * (ch + 4) + 20, x = (W - w) / 2, y = Math.max(24, Math.round((H - h) / 2) - 10);
    M.frame(x, y, w, h); M.header(x, y, w, 'FAVORITES', 'EVERY MODE');
    tabs(x, y + 23, w, which === 'rooms' ? 0 : 1);
    var gx = x + 6, gy = y + 40;
    function at(i) { return [gx + (i % 2) * (cw + 4), gy + Math.floor(i / 2) * (ch + 4)]; }
    if (which === 'rooms') {
      var rooms = [['COZY LIVING ROOM', '24 PIECES', 'cozy'], ['READING NOOK', '24 PIECES', 'sage'], ['LILAC DEN', '24 PIECES', 'lilac']];
      rooms.forEach(function (r, i) { var p = at(i); tile(p[0], p[1], cw, ch, r[0], r[1], i === 0, function (a, b, cW, cH) { roomThumb(r[2], a, b, cW, cH, t); }); });
      var p3 = at(3); saveTile(p3[0], p3[1], cw, ch, ['SAVE THIS', 'ROOM']);
    } else {
      var fits = [['ORANGE ROCKS DAY', 'SARAH', 'orange'], ['COZY SUNDAY', 'SARAH', 'cozy'], ['CAP AND FLANNEL', 'KEEGAN', 'cap'], ['EVERYDAY', 'KEEGAN', 'plain']];
      fits.forEach(function (r, i) { var p = at(i); tile(p[0], p[1], cw, ch, r[0], r[1], i === 0, function (a, b, cW, cH) { outfitThumb(r[2], a, b, cW, cH, t); }); });
    }
    M.backHint(x + 8, y + h - 16);
    M.txt(which === 'rooms' ? 'PICK, THEN TAP A ROOM' : 'PICK, THEN A PERSON', x + w - 8, y + h - 13, M.P.soft, 5, 'right');
  }
  function placing(W, H, t) {
    window.drawDecorate(c, W, H, t, 'bare', THEMES.sage); M.use(c);
    // the whole room glows to show it will be filled
    var OX = 120, OY = 132, TW = 22, TH = 11, N = 10;
    function iso(x, y) { return [OX + (x - y) * TW / 2, OY + (x + y) * TH / 2]; }
    var pul = .18 + .08 * Math.sin(t / 2);
    c.fillStyle = 'rgba(228,111,139,' + pul + ')'; c.beginPath(); [iso(0, 0), iso(N, 0), iso(N, N), iso(0, N)].forEach(function (p, i) { if (i) c.lineTo(p[0], p[1]); else c.moveTo(p[0], p[1]); }); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(255,255,255,.95)'; c.lineWidth = 2; c.stroke(); c.lineWidth = 1;
    // a finger tapping the floor
    var f = iso(5.5, 5.5); c.fillStyle = 'rgba(255,255,255,.45)'; c.beginPath(); c.arc(f[0], f[1], 7, 0, 7); c.fill(); c.strokeStyle = 'rgba(255,255,255,.95)'; c.stroke();
    c.strokeStyle = 'rgba(255,255,255,.6)'; c.beginPath(); c.arc(f[0], f[1], 11 + (t % 4), 0, 7); c.stroke();
    // the banner at the top: what she's placing, and Cancel
    var bw = 228, bx = (W - bw) / 2, by = 6;
    M.frame(bx, by, bw, 34);
    M.R(bx + 5, by + 5, 40, 24, '#3b2430'); roomThumb('cozy', bx + 6, by + 6, 38, 22, t);
    M.txt('COZY LIVING ROOM', bx + 52, by + 8, M.P.ink, 6);
    M.txt('TAP A ROOM TO FILL IT', bx + 52, by + 19, M.P.soft, 5);
    var cx = bx + bw - 50; M.R(cx, by + 10, 44, 14, M.P.cell); M.R(cx, by + 23, 44, 1, M.P.edge); M.txt('CANCEL', cx + 22, by + 14, M.P.ink, 6, 'center');
    // the note at the bottom about what doesn't fit
    var ny = H - 30; M.R(14, ny, W - 28, 22, 'rgba(255,246,234,.95)'); M.R(14, ny + 21, W - 28, 1, M.P.edge);
    M.txt('PIECES THAT DON\'T FIT', W / 2, ny + 4, M.P.ink, 5, 'center');
    M.txt('GO TO STORAGE', W / 2, ny + 12, M.P.ink, 5, 'center');
  }
  window.drawFavorites = function (ctx, W, H, t, st) {
    c = ctx; t = t || 0; st = st || 'rooms'; M = window.SS_MENU;
    if (st === 'place') { placing(W, H, t); return; }
    window.drawDecorate(ctx, W, H, t, 'home'); c = ctx; M.use(c); c.imageSmoothingEnabled = false;
    M.R(0, 0, W, H, 'rgba(34,18,28,.62)');
    card(W, H, st, t);
  };
})();
