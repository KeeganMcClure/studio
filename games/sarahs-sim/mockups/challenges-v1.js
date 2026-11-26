// Sarah's Sim: Challenges mockup v1 (Nov 26, 2026), for spec 010. All art drawn in code.
// Needs people-v1.js and decorate-v1.js (the room being designed) loaded first.
// drawChallenges(ctx, W, H, t, state):
//   'board'   the cork board: one pinned card per challenge, each with the client, the brief, the twist, the kind and her best stars.
//   'doing'   designing challenge 1 with the normal tools: a banner with the brief, the twist checked live (with words) and Hand in.
//   'result'  the client's card: stars fill in, her design pinned as a snapshot, one hint toward the missing star, the reward piece.
// Clients are made-up people drawn small; there are no timers and no way to fail.
(function () {
  var c;
  var P = {
    cork: '#c9955f', corkHi: '#dcae7a', corkSh: '#a77442', frame: '#7a4a2c', frameHi: '#9a6440',
    card: '#fff6ea', edge: '#e8cdb4', ink: '#6b4250', soft: '#b38a8f', rose: '#e46f8b', roseHi: '#f39bb0', roseSh: '#b44f63',
    gold: '#f3c64e', goldSh: '#c8962e', goldHi: '#fff0a8', starOff: '#e8dccd', sage: '#7fa7a0', green: '#6aa361', greenSh: '#437a47', blush: '#fde3ea'
  };
  function R(x, y, w, h, col) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
  function txt(s, x, y, col, size, align) { c.font = (size || 8) + 'px "Press Start 2P", monospace'; c.fillStyle = col; c.textAlign = align || 'left'; c.textBaseline = 'top'; c.fillText(s, x, y); }
  function vt(s, x, y, col, size, align) { c.font = (size || 10) + 'px "VT323", monospace'; c.fillStyle = col; c.textAlign = align || 'left'; c.textBaseline = 'top'; c.fillText(s, x, y); }
  function hash(i, j) { var h = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return h - Math.floor(h); }
  function heart(x, y, col) { R(x + 1, y, 2, 1, col); R(x + 4, y, 2, 1, col); R(x, y + 1, 7, 2, col); R(x + 1, y + 3, 5, 1, col); R(x + 2, y + 4, 3, 1, col); R(x + 3, y + 5, 1, 1, col); }
  function star(x, y, on, s) { // a 7 x 7 pixel star, scaled
    s = s || 1; var col = on ? P.gold : P.starOff, sh = on ? P.goldSh : '#d6c7b5';
    function p(a, b, w, h, k) { R(x + a * s, y + b * s, w * s, h * s, k); }
    p(3, 0, 1, 1, col); p(2, 1, 3, 1, col); p(0, 2, 7, 1, col); p(1, 3, 5, 1, col); p(1, 4, 5, 1, col); p(1, 5, 2, 1, col); p(4, 5, 2, 1, col); p(0, 6, 2, 1, sh); p(5, 6, 2, 1, sh);
    if (on) p(2, 2, 1, 1, P.goldHi);
  }
  function ribbonIcon(x, y, col) { R(x + 1, y, 5, 5, col); R(x + 2, y + 1, 3, 3, '#fff'); R(x + 3, y + 2, 1, 1, col); R(x + 1, y + 5, 2, 3, col); R(x + 4, y + 5, 2, 3, col); }
  function btn(x, y, w, s, on) { R(x, y, w, 14, on ? P.rose : '#fbeedd'); R(x, y + 13, w, 1, on ? P.roseSh : P.edge); if (on) R(x, y, w, 1, P.roseHi); txt(s, x + w / 2, y + 4, on ? '#fff' : P.ink, 6, 'center'); }
  function pin(x, y, col) { R(x - 2, y - 2, 5, 5, col); R(x - 1, y - 2, 2, 1, 'rgba(255,255,255,.6)'); R(x, y + 3, 1, 2, 'rgba(60,40,30,.5)'); }
  function wrap(s, maxW, size) { c.font = (size || 10) + 'px "VT323", monospace'; var words = s.split(' '), lines = [], cur = ''; words.forEach(function (w) { var tr = cur ? cur + ' ' + w : w; if (c.measureText(tr).width > maxW && cur) { lines.push(cur); cur = w; } else cur = tr; }); if (cur) lines.push(cur); return lines; }

  // ---------- made-up clients, drawn small: skin, hair color, hair style ----------
  var SKIN = ['#f2c7a5', '#d9a07a', '#a8724e', '#7a4e34'];
  function face(x, y, s, o) { // a 16 x 16 head and shoulders
    function p(a, b, w, h, k) { R(x + a * s, y + b * s, w * s, h * s, k); }
    var sk = SKIN[o.skin], hr = o.hair;
    p(3, 13, 10, 3, o.top); p(6, 12, 4, 2, sk);
    if (o.style === 'long') { p(3, 3, 10, 10, hr); }
    p(4, 4, 8, 8, sk); p(4, 11, 8, 1, 'rgba(0,0,0,.08)');
    if (o.style === 'bun') { p(6, 0, 4, 3, hr); p(4, 2, 8, 3, hr); }
    else if (o.style === 'curly') { p(3, 2, 10, 3, hr); p(3, 4, 2, 4, hr); p(11, 4, 2, 4, hr); p(4, 1, 2, 1, hr); p(9, 1, 3, 1, hr); }
    else if (o.style === 'short') { p(4, 2, 8, 3, hr); p(4, 4, 1, 2, hr); p(11, 4, 1, 2, hr); }
    else if (o.style === 'gray') { p(3, 3, 10, 3, hr); p(3, 5, 2, 5, hr); p(11, 5, 2, 5, hr); p(5, 2, 6, 1, hr); }
    else { p(4, 2, 8, 3, hr); p(3, 3, 2, 3, hr); p(11, 3, 2, 3, hr); }
    p(6, 7, 1, 1, '#2b2226'); p(9, 7, 1, 1, '#2b2226'); p(7, 10, 2, 1, '#b44f63');
    p(5, 9, 1, 1, 'rgba(228,111,139,.35)'); p(10, 9, 1, 1, 'rgba(228,111,139,.35)');
    if (o.glasses) { p(5, 6, 3, 3, 'rgba(59,36,48,.0)'); R(x + 5 * s, y + 6 * s, 3 * s, s, '#3b2430'); R(x + 8 * s, y + 6 * s, 3 * s, s, '#3b2430'); }
  }
  function portrait(x, y, sz, who, bg) {
    R(x, y, sz, sz, bg || '#e6efdf'); c.save(); c.beginPath(); c.rect(x, y, sz, sz); c.clip();
    var s = Math.max(1, Math.floor(sz / 16));
    if (who.pair) { face(x - 2, y + sz - 16 * s + 1, s, who.pair[0]); face(x + sz - 16 * s + 2, y + sz - 16 * s + 2, s, who.pair[1]); }
    else face(x + Math.round((sz - 16 * s) / 2), y + sz - 16 * s, s, who);
    c.restore(); c.strokeStyle = P.rose; c.lineWidth = 1; c.strokeRect(x + .5, y + .5, sz - 1, sz - 1);
  }
  var CL = [
    { n: 1, short: "Fireplace and 3 throws", title: "Winter cabin", brief: 'A winter cabin living room for a couple escaping the city', twist: 'A fireplace and three throws', kind: 'ROOM', best: 2, who: { pair: [{ skin: 1, hair: '#3b2a24', style: 'short', top: '#7fa7a0' }, { skin: 0, hair: '#c96f45', style: 'long', top: '#e46f8b' }] } },
    { n: 2, short: "Everything in one room", title: "Tiny studio", brief: 'A tiny studio for a student', twist: 'Bed, kitchen and seats in one 6 x 6 room', kind: 'ROOM', best: 3, done: true, who: { skin: 2, hair: '#1f1a1c', style: 'curly', top: '#e7b75f', glasses: true } },
    { n: 3, short: "Budget: 800 coins", title: "First apartment", brief: "A first apartment's living room", twist: 'A budget of 800 coins', kind: 'ROOM', best: 0, who: { skin: 0, hair: '#e3c07a', style: 'bun', top: '#8f7bc0' } },
    { n: 4, short: "One color family", title: "Calm bedroom", brief: 'A calm bedroom', twist: 'One color family only', kind: 'ROOM', best: 0, who: { skin: 3, hair: '#1f1a1c', style: 'short', top: '#5d7fa6' } },
    { n: 5, short: "12 plants or more", title: "Plant sunroom", brief: 'A sunroom for a plant collector', twist: 'At least 12 plants', kind: 'ROOM', best: 1, who: { skin: 1, hair: '#6b3d26', style: 'long', top: '#6aa361' } },
    { n: 9, short: "Something red", title: "Date night", brief: 'A date-night outfit', twist: 'Something red', kind: 'OUTFIT', best: 0, who: { skin: 2, hair: '#3b2a24', style: 'bun', top: '#d2363c' } },
    { n: 7, short: "Keep her 3 old pieces", title: "Grandma's kitchen", brief: "A grandma's kitchen refresh", twist: 'Keep the three old pieces she loves', kind: 'ROOM', best: 0, who: { skin: 0, hair: '#dcd7cf', style: 'gray', top: '#c95a75', glasses: true } }
  ];

  // ---------- the cork board ----------
  function board(W, H, t) {
    R(0, 0, W, H, P.frame); R(0, 0, W, 2, P.frameHi);
    R(5, 5, W - 10, H - 10, P.cork);
    for (var k = 0; k < 260; k++) R(5 + hash(k, 1) * (W - 11), 5 + hash(1, k) * (H - 11), hash(k, 2) > .5 ? 2 : 1, 1, hash(k, 3) > .5 ? P.corkHi : P.corkSh);
    R(5, 5, W - 10, 2, 'rgba(0,0,0,.18)'); R(5, 5, 2, H - 10, 'rgba(0,0,0,.12)');
  }
  function boardCard(x, y, w, h, cl, startHere, sel, t) {
    var a = (hash(cl.n, 4) - .5) * .05;
    c.save(); c.translate(x + w / 2, y + h / 2); c.rotate(a); c.translate(-w / 2, -h / 2);
    R(2, 3, w, h, 'rgba(60,35,20,.35)'); R(0, 0, w, h, P.card); R(0, h - 1, w, 1, P.edge);
    if (sel) { c.strokeStyle = P.rose; c.lineWidth = 2; c.strokeRect(1, 1, w - 2, h - 2); c.lineWidth = 1; }
    portrait(4, 6, 22, cl.who);
    txt(cl.kind, 30, 7, cl.kind === 'OUTFIT' ? '#8f7bc0' : P.sage, 5);
    txt('#' + cl.n, w - 4, 7, P.soft, 5, 'right');
    var lines = wrap(cl.title, w - 34, 10).slice(0, 2); lines.forEach(function (s, i) { vt(s, 30, 14 + i * 8, P.ink, 10); });
    // the twist, on its own lines with the ribbon icon
    R(3, 33, w - 6, 21, P.blush); ribbonIcon(6, 35, P.rose);
    wrap(cl.short, w - 22, 10).slice(0, 2).forEach(function (s, i) { vt(s, 15, 33 + i * 9, P.roseSh, 10); });
    // best stars with a number, and the finished ribbon
    for (var s = 0; s < 3; s++) star(4 + s * 10, h - 12, s < cl.best);
    txt(cl.best ? cl.best + '/3' : 'NEW', 36, h - 11, cl.best ? P.goldSh : P.rose, 5);
    if (cl.done) { R(w - 14, h - 16, 10, 8, P.gold); R(w - 13, h - 15, 8, 6, P.goldHi); R(w - 13, h - 8, 3, 5, P.gold); R(w - 8, h - 8, 3, 5, P.gold); }
    c.restore();
    pin(x + w / 2, y + 2, startHere ? P.rose : ['#7fa7a0', '#e7b75f', '#8f7bc0'][cl.n % 3]);
  }
  function boardState(W, H, t) {
    board(W, H, t);
    // header: a paper strip pinned across the top
    R(12, 10, W - 24, 22, P.card); R(12, 31, W - 24, 1, P.edge); pin(20, 12, P.rose); pin(W - 20, 12, P.rose);
    txt('CHALLENGES', 26, 14, P.ink, 8); ribbonIcon(W - 70, 15, P.goldSh); txt('1 OF 14', W - 22, 16, P.soft, 6, 'right');
    vt('Start here', 14, 36, '#fff6ea', 10); R(56, 41, W - 70, 1, 'rgba(255,246,234,.6)');
    var cw = Math.floor((W - 30) / 2), ch = 70, gx = 12, y0 = 48, gap = 8;
    boardCard(gx, y0, cw, ch, CL[0], true, true, t); boardCard(gx + cw + 6, y0, cw, ch, CL[1], true, false, t);
    boardCard(gx, y0 + ch + gap, cw, ch, CL[2], true, false, t); boardCard(gx + cw + 6, y0 + ch + gap, cw, ch, CL[3], false, false, t);
    var y3 = y0 + (ch + gap) * 2; if (y3 + ch < H - 24) { boardCard(gx, y3, cw, ch, CL[4], false, false, t); boardCard(gx + cw + 6, y3, cw, ch, CL[5], false, false, t); }
    // the bottom bar: the picked card's Start and Back, and a scroll hint
    R(5, H - 26, W - 10, 21, 'rgba(255,246,234,.97)'); R(5, H - 26, W - 10, 1, P.edge);
    btn(10, H - 22, 108, 'START #1', true); btn(124, H - 22, 56, 'BACK', false);
    txt('8 MORE', W - 12, H - 20, P.soft, 5, 'right'); R(W - 20, H - 12, 5, 1, P.soft); R(W - 19, H - 11, 3, 1, P.soft); R(W - 18, H - 10, 1, 1, P.soft);
  }

  // ---------- doing a challenge: the normal tools plus the banner ----------
  function check(x, y, on) { R(x, y, 9, 9, on ? P.green : P.starOff); if (on) { R(x + 2, y + 4, 1, 2, '#fff'); R(x + 3, y + 5, 1, 2, '#fff'); R(x + 4, y + 4, 1, 2, '#fff'); R(x + 5, y + 3, 1, 2, '#fff'); R(x + 6, y + 2, 1, 2, '#fff'); } }
  function doingState(W, H, t) {
    if (window.drawDecorate) window.drawDecorate(c, W, H, t, 'catalog');
    // the banner replaces the top bar: brief, the twist checked live with words, Hand in
    var bh = 56; R(0, 0, W, bh + 2, 'rgba(59,36,48,.25)'); R(0, 0, W, bh, P.card); R(0, bh - 1, W, 1, P.edge);
    portrait(4, 4, 24, CL[0].who);
    txt('#1 WINTER CABIN', 32, 6, P.ink, 6);
    vt('For a couple escaping the city', 32, 14, P.soft, 10);
    // twist parts, each with a tick and a word
    R(4, 31, W - 64, 22, P.blush); ribbonIcon(7, 33, P.rose);
    check(18, 32, true); vt('Fireplace', 30, 30, P.greenSh, 10);
    check(18, 42, false); vt('Throws 2 of 3', 30, 40, P.roseSh, 10);
    // hand in
    R(W - 56, 31, 52, 22, P.rose); R(W - 56, 31, 52, 1, P.roseHi); R(W - 56, 52, 52, 1, P.roseSh);
    txt('HAND', W - 30, 35, '#fff', 6, 'center'); txt('IN', W - 30, 44, '#fff', 6, 'center');
  }

  // ---------- the result card ----------
  var SNAP = null;
  function snapshot(x, y, w, h, t) {
    if (!SNAP && window.drawDecorate) { var oc = document.createElement('canvas'); oc.width = 240; oc.height = 260; window.drawDecorate(oc.getContext('2d'), 240, 260, 3, 'bare'); SNAP = oc; }
    R(x + 2, y + 3, w, h, 'rgba(60,35,20,.3)'); R(x, y, w, h, '#fff');
    if (SNAP) { c.imageSmoothingEnabled = false; c.drawImage(SNAP, 20, 30, 200, 150, x + 3, y + 3, w - 6, h - 6); }
    pin(x + w / 2, y + 2, P.rose);
  }
  function resultState(W, H, t) {
    if (window.drawDecorate) window.drawDecorate(c, W, H, t, 'bare');
    R(0, 0, W, H, 'rgba(34,18,28,.6)');
    var x = 10, y = 14, w = W - 20, h = H - 28;
    R(x + 2, y + 3, w, h, 'rgba(20,10,16,.4)'); R(x, y, w, h, P.card); R(x, y + h - 1, w, 1, P.edge);
    c.strokeStyle = P.rose; c.strokeRect(x + .5, y + .5, w - 1, h - 1);
    c.strokeStyle = 'rgba(228,111,139,.35)'; c.setLineDash([2, 2]); c.strokeRect(x + 2.5, y + 2.5, w - 5, h - 5); c.setLineDash([]);
    txt('#1 WINTER CABIN', x + w / 2, y + 9, P.ink, 7, 'center');
    // stars fill in one by one (the third waits for the missing throw)
    var shown = Math.min(2, Math.floor(t / 2) + 1); if (t >= 3) shown = 2;
    for (var s = 0; s < 3; s++) star(x + w / 2 - 40 + s * 28, y + 22, s < shown, 3);
    if (shown >= 2) { R(x + w / 2 + 16, y + 20, 1, 1, P.goldHi); R(x + w / 2 - 44, y + 26, 1, 1, P.goldHi); }
    // her design, pinned
    var sw = w - 40, sh = Math.round(sw * .62);
    snapshot(x + 20, y + 50, sw, sh, t);
    // the client's line, with a hint toward the missing star
    var ly = y + 50 + sh + 10;
    portrait(x + 8, ly, 28, CL[0].who);
    R(x + 42, ly, w - 50, 30, '#fbeedd'); R(x + 40, ly + 10, 2, 4, '#fbeedd'); R(x + 38, ly + 12, 2, 2, '#fbeedd');
    vt('"It’s so warm in here! I was', x + 46, ly + 2, P.ink, 10); vt('hoping for one more throw."', x + 46, ly + 11, P.ink, 10);
    vt('The couple', x + w - 12, ly + 20, P.soft, 10, 'right');
    // the reward piece
    var ry = ly + 36; R(x + 8, ry, w - 16, 22, '#eef6e6'); R(x + 8, ry + 21, w - 16, 1, '#b9d8a0');
    // a tiny stone fireplace
    R(x + 12, ry + 4, 16, 14, '#b9b4ae'); R(x + 12, ry + 4, 16, 2, '#d8d2c8'); R(x + 16, ry + 9, 8, 9, '#3b2430'); R(x + 18, ry + 13, 4, 5, '#f39b62'); R(x + 19, ry + 14, 2, 3, '#ffd56b');
    txt('NEW: STONE FIREPLACE', x + 32, ry + 4, P.greenSh, 5); vt('In your Life catalog', x + 32, ry + 10, P.greenSh, 10);
    vt('Try again any time.', x + w / 2, ry + 28, P.soft, 10, 'center');
    btn(x + 8, y + h - 20, 96, 'TRY AGAIN', false); btn(x + w - 104, y + h - 20, 96, 'DONE', true);
  }

  window.drawChallenges = function (ctx, W, H, t, st) {
    c = ctx; t = t || 0; st = st || 'board'; c.imageSmoothingEnabled = false;
    if (st === 'doing') doingState(W, H, t);
    else if (st === 'result') resultState(W, H, t);
    else boardState(W, H, t);
    c = ctx;
  };
})();
