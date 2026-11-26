// Sarah's Sim: Camera mockup v1 (Nov 25, 2026). All art drawn in code.
// drawCamera(ctx, W, H, t, state): 'frame' (the camera open over the room: no tray, top bar or buttons in the picture),
// 'saved' (the snap: the picture drops in as a print, saved to her phone and the memory book),
// 'photo' (the clean picture itself, exactly as saved).
// Needs decorate-v1.js (the room, state 'bare') and start-menu-v1.js (the shared menu card).
(function () {
  var c, M;
  function frameRect(W, H) { var w = W - 12, h = Math.min(H - 84, Math.round(w * .95)); return { x: 6, y: 28, w: w, h: h }; }
  var SHOT = null;
  function shot(W, H, t) { // the room alone, rendered once, as the camera sees it
    if (!SHOT) { var oc = document.createElement('canvas'); oc.width = W; oc.height = H; window.drawDecorate(oc.getContext('2d'), W, H, 3, 'bare'); SHOT = oc; }
    return SHOT;
  }
  function brackets(f, col) {
    var L = 12; c.fillStyle = col;
    [[f.x, f.y, 1, 1], [f.x + f.w, f.y, -1, 1], [f.x, f.y + f.h, 1, -1], [f.x + f.w, f.y + f.h, -1, -1]].forEach(function (k) {
      c.fillRect(k[0] - (k[2] < 0 ? 2 : 0), k[1] - (k[3] < 0 ? 2 : 0), k[2] * L, 2);
      c.fillRect(k[0] - (k[2] < 0 ? 2 : 0), k[1] - (k[3] < 0 ? 2 : 0), 2, k[3] * L);
    });
  }
  function roundBtn(cx, cy, r, fill, ring) { c.fillStyle = ring; c.beginPath(); c.arc(cx, cy, r + 2, 0, 7); c.fill(); c.fillStyle = fill; c.beginPath(); c.arc(cx, cy, r, 0, 7); c.fill(); }
  function framing(W, H, t) {
    window.drawDecorate(c, W, H, t, 'bare'); M.use(c);
    var f = frameRect(W, H);
    // outside the picture goes darker, so she sees exactly what she'll get
    c.fillStyle = 'rgba(20,10,16,.62)';
    c.fillRect(0, 0, W, f.y); c.fillRect(0, f.y + f.h, W, H - f.y - f.h); c.fillRect(0, f.y, f.x, f.h); c.fillRect(f.x + f.w, f.y, W - f.x - f.w, f.h);
    c.strokeStyle = 'rgba(255,255,255,.35)'; c.strokeRect(f.x + .5, f.y + .5, f.w - 1, f.h - 1);
    // rule-of-thirds guides, faint
    c.fillStyle = 'rgba(255,255,255,.16)';
    for (var i = 1; i < 3; i++) { c.fillRect(f.x + Math.round(f.w * i / 3), f.y, 1, f.h); c.fillRect(f.x, f.y + Math.round(f.h * i / 3), f.w, 1); }
    brackets(f, '#fff');
    // top: close and the label (outside the picture)
    roundBtn(16, 14, 8, '#fff6ea', 'rgba(59,36,48,.6)'); c.save(); c.translate(16, 14); c.rotate(Math.PI / 4); c.fillStyle = M.P.ink; c.fillRect(-4, -1, 8, 2); c.fillRect(-1, -4, 2, 8); c.restore();
    M.icons.camera(W / 2 - 34, 8, '#fff', 'rgba(20,10,16,.9)'); M.txt('CAMERA', W / 2 - 18, 10, '#fff', 7);
    // bottom: hint and the shutter
    var sy = f.y + f.h + Math.round((H - f.y - f.h) / 2);
    M.txt('PINCH TO ZOOM', 10, sy - 8, 'rgba(255,241,226,.8)', 5); M.txt('SLIDE TO MOVE', 10, sy + 2, 'rgba(255,241,226,.8)', 5);
    var pr = 15 + (t % 6 === 0 ? 1 : 0);
    c.fillStyle = 'rgba(255,255,255,.95)'; c.beginPath(); c.arc(W / 2, sy, pr + 3, 0, 7); c.fill();
    c.fillStyle = 'rgba(20,10,16,.9)'; c.beginPath(); c.arc(W / 2, sy, pr, 0, 7); c.fill();
    c.fillStyle = M.P.rose; c.beginPath(); c.arc(W / 2, sy, pr - 3, 0, 7); c.fill();
    M.heart(W / 2 - 3, sy - 3, '#fff');
    // the walls button stays, so she can pick walls up or cut away for the picture
    roundBtn(W - 28, sy, 11, '#fff6ea', 'rgba(59,36,48,.6)');
    M.R(W - 34, sy - 5, 4, 10, M.P.ink); M.R(W - 30, sy - 2, 8, 7, M.P.soft); M.R(W - 34, sy + 5, 12, 1, M.P.ink);
    M.txt('WALLS', W - 28, sy + 15, 'rgba(255,241,226,.8)', 5, 'center');
  }
  function print(x, y, w, h, ang, W, H, t) { // the photo as a print, with a wide bottom edge for its caption
    var f = frameRect(W, H), img = shot(W, H, t);
    c.save(); c.translate(x + w / 2, y + h / 2); c.rotate(ang);
    c.fillStyle = 'rgba(20,10,16,.4)'; c.fillRect(-w / 2 + 3, -h / 2 + 4, w, h);
    c.fillStyle = '#fffaf2'; c.fillRect(-w / 2, -h / 2, w, h);
    var pw = w - 12, ph = Math.round(pw * f.h / f.w);
    c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high';
    c.drawImage(img, f.x, f.y, f.w, f.h, -w / 2 + 6, -h / 2 + 6, pw, ph); c.imageSmoothingEnabled = false;
    c.fillStyle = 'rgba(59,36,48,.25)'; c.fillRect(-w / 2 + 6, -h / 2 + 6 + ph, pw, 1);
    c.font = '6px "Press Start 2P", monospace'; c.fillStyle = M.P.ink; c.textAlign = 'center'; c.textBaseline = 'top';
    c.fillText('OUR PLACE', 0, -h / 2 + ph + 11);
    c.fillStyle = M.P.soft; c.font = '5px "Press Start 2P", monospace'; c.fillText('NOV 25', 0, -h / 2 + ph + 21);
    c.restore();
  }
  function saved(W, H, t) {
    window.drawDecorate(c, W, H, t, 'bare'); M.use(c);
    M.R(0, 0, W, H, 'rgba(34,18,28,.66)');
    // a soft white flash still fading at the edges
    var g = c.createRadialGradient(W / 2, H / 2, 40, W / 2, H / 2, W); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(255,248,240,.18)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
    var pw = 168, f = frameRect(W, H), ph = Math.round((pw - 12) * f.h / f.w) + 32;
    var py = Math.max(10, Math.round(H / 2 - (ph + 68) / 2) - 4);
    print((W - pw) / 2, py, pw, ph, -0.045, W, H, t);
    // the note under the print
    var cw = 196, cx = (W - cw) / 2, cy = py + ph + 8, chh = 54;
    M.frame(cx, cy, cw, chh);
    M.check(cx + 10, cy + 9, M.P.sage); M.txt('SAVED TO YOUR PHOTOS', cx + 24, cy + 8, M.P.ink, 6);
    M.check(cx + 10, cy + 20, M.P.sage); M.txt('ADDED TO THE MEMORY BOOK', cx + 24, cy + 19, M.P.ink, 5);
    var bw = (cw - 18) / 2;
    M.R(cx + 6, cy + 34, bw, 14, M.P.cell); M.R(cx + 6, cy + 47, bw, 1, M.P.edge); M.txt('SHARE', cx + 6 + bw / 2, cy + 38, M.P.ink, 6, 'center');
    M.R(cx + 12 + bw, cy + 34, bw, 14, M.P.rose); M.R(cx + 12 + bw, cy + 34, bw, 1, M.P.roseHi); M.R(cx + 12 + bw, cy + 47, bw, 1, M.P.roseSh); M.txt('DONE', cx + 12 + bw + bw / 2, cy + 38, '#fff', 6, 'center');
  }
  function photo(W, H, t) { // the saved file: only the room
    c.fillStyle = '#1a1016'; c.fillRect(0, 0, W, H);
    var f = frameRect(W, H), img = shot(W, H, t), y = Math.round((H - f.h) / 2);
    c.drawImage(img, f.x, f.y, f.w, f.h, f.x, y, f.w, f.h);
    M.use(c); M.txt('THE SAVED PICTURE', W / 2, y + f.h + 8, 'rgba(255,241,226,.75)', 5, 'center');
    M.txt('NO TRAY, BAR OR BUTTONS', W / 2, y + f.h + 17, 'rgba(255,241,226,.55)', 5, 'center');
  }
  window.drawCamera = function (ctx, W, H, t, st) {
    c = ctx; t = t || 0; st = st || 'frame'; M = window.SS_MENU; M.use(c); c.imageSmoothingEnabled = false;
    if (st === 'saved') saved(W, H, t); else if (st === 'photo') photo(W, H, t); else framing(W, H, t);
  };
})();
