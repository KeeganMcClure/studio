// Sarah's Sim: Keegan and Sarah, reference v1 (Nov 25, 2026). Drawn in code from Keegan's photos.
// Light from the upper left. Four-tone ramps on skin, hair and clothes; dark outlines.
(function () {
  var C = {
    o: '#3b2430',
    sk: ['#fbdcc6', '#f2c3a6', '#dfa184', '#c27f66'],
    sHair: ['#f0b878', '#d9904f', '#b56a34', '#87471f'],
    kHair: ['#5e4030', '#4a3226', '#38251c', '#271912'],
    beard: ['#8a5c40', '#6b4632', '#503425', '#382419'],
    sEye: '#7f9fae', sEyeSh: '#5d7c8a', kEye: '#4d3a2e', teeth: '#fffaf2', lip: '#c8707c', lipSh: '#a85a66', blush: '#f2aaa2', freckle: '#dc9a7c',
    gold: '#e7bb4f', goldSh: '#b98a2a', stud: '#eef1f3', glass: '#d6d0d4', glassHi: 'rgba(255,255,255,.55)',
    leo: ['#3a3236', '#2a2327', '#1d181b'], leoTan: '#d9b48c',
    flannel: ['#3c6a55', '#2f5646', '#234236', '#1a3128'], red: '#b8434a', cream: '#e9e4dc', tee: '#f7f3ec', teeSh: '#dcd5cb',
    denim: ['#b3cbe2', '#91afcc', '#7493b3'], jeans: ['#6a89b0', '#55739a', '#425a7c'],
    shoe: '#f3efe8', shoeSh: '#cfc8bd', sole: '#8a7f75', boot: ['#e2c39c', '#cfa97d', '#b08a5f'],
    orange: ['#ffb760', '#f7922e', '#d8731d', '#a9541a'],
    cap: ['#f4ede0', '#e6dccb', '#cbbda7'], brim: '#8a5a32', nail: '#e46f8b', kNail: '#2a2327'
  };
  var ctx, X, Y, S;
  function R(x, y, w, h, col) { ctx.fillStyle = col; ctx.fillRect(X + x * S, Y + y * S, w * S, h * S); }
  function E(cx, cy, rx, ry, col) { for (var yy = -ry; yy <= ry; yy++) { var hw = Math.round(rx * Math.sqrt(Math.max(0, 1 - (yy * yy) / (ry * ry)))); R(cx - hw, cy + yy, hw * 2 + 1, 1, col); } }
  function at(c, x, y, s) { ctx = c; X = x; Y = y; S = s; }
  function clipBox(c, x, y, s) { c.save(); c.beginPath(); c.rect(x, y, 64 * s, 64 * s); c.clip(); }

  // ---------- Portraits, 64 x 64 ----------
  function sarahPortrait(c, x, y, s, t, glasses, style) {
    at(c, x, y, s); clipBox(c, x, y, s);
    R(0, 0, 64, 64, '#fde6ea'); for (var i = 0; i < 64; i += 8) R(i, 0, 4, 64, '#fbdde3');
    // rose cardigan with crochet flowers over a cream top
    E(32, 68, 30, 18, C.o); E(32, 68, 29, 17, '#b9505a'); E(24, 64, 15, 10, '#c9636b');
    E(32, 58, 7, 8, C.o); E(32, 58, 6, 7, '#f3ead8');
    [[12, 58, '#e7a9c4'], [50, 57, '#c8a6d8'], [20, 62, '#f0b3c4'], [46, 63, '#d98a6a']].forEach(function (f) {
      for (var p = 0; p < 5; p++) { var a = p / 5 * 6.283; E(f[0] + Math.round(Math.cos(a) * 3), f[1] + Math.round(Math.sin(a) * 3), 2, 2, f[2]); }
      E(f[0], f[1], 1, 1, '#e8b85a');
    });
    var st = style || 'bun';
    function curl(cx, cy, r, col) { E(cx, cy, r, r, C.o); E(cx, cy, r - 1, r - 1, col); R(cx - 1, cy - r + 1, 2, 1, C.sHair[0]); }
    // back hair, drawn before the neck so the neck sits in front of it
    if (st === 'bun') { E(32, 10, 11, 6, C.o); E(32, 10, 10, 5, C.sHair[1]); E(29, 8, 6, 3, C.sHair[0]); }
    if (st === 'pony') { // curls pulled back into a high ponytail with a scrunchie
      [[47, 16, 5], [50, 22, 5], [51, 29, 5], [50, 36, 4], [48, 42, 4]].forEach(function (q, k) { curl(q[0], q[1], q[2], k % 2 ? C.sHair[2] : C.sHair[1]); });
      E(32, 28, 16, 15, C.o); E(32, 28, 15, 14, C.sHair[2]); E(28, 24, 10, 8, C.sHair[1]);
      R(43, 13, 4, 5, C.o); R(44, 14, 2, 3, '#7fa7a0');
    } else if (st === 'long') { // long corkscrew curls past the shoulders
      E(32, 34, 22, 24, C.o); E(32, 34, 21, 23, C.sHair[2]); E(27, 26, 14, 12, C.sHair[1]);
      for (var k = 0; k < 6; k++) { curl(13 + (k % 2), 30 + k * 5, 3, k % 2 ? C.sHair[2] : C.sHair[1]); curl(51 - (k % 2), 30 + k * 5, 3, C.sHair[k % 2 ? 3 : 2]); }
    } else { // curly bob, pinned up ('bun') or loose ('bob')
      var big = st === 'bob' ? 1 : 0;
      E(32, 30 - big, 20 + big, 17 + big, C.o); E(32, 30 - big, 19 + big, 16 + big, C.sHair[2]); E(27, 25, 13, 10, C.sHair[1]);
      for (var k2 = 0; k2 < 9; k2++) { var bx = 14 + k2 * 4.5, by = 44 + (k2 % 2) * 2 - Math.abs(k2 - 4) * 1.5; curl(Math.round(bx), Math.round(by), 3, k2 < 4 ? C.sHair[1] : C.sHair[2]); }
      if (big) [[17, 17], [24, 13], [32, 12], [40, 13], [47, 17]].forEach(function (q, k) { curl(q[0], q[1], 4, k < 3 ? C.sHair[1] : C.sHair[2]); });
    }
    if (st !== 'pony') [[17, 26], [15, 33], [19, 39], [45, 27], [47, 34], [44, 40], [24, 14], [38, 14]].forEach(function (p) { R(p[0], p[1], 2, 1, C.sHair[0]); R(p[0] - 1, p[1] + 1, 1, 1, C.sHair[0]); R(p[0] + 1, p[1] + 2, 2, 1, C.sHair[3]); });
    // neck, in front of the back hair
    R(27, 42, 10, 11, C.o); R(28, 42, 8, 11, C.sk[2]); R(28, 42, 4, 10, C.sk[1]); R(28, 45, 8, 1, C.sk[3]);
    E(32, 58, 7, 8, C.o); E(32, 58, 6, 7, '#f3ead8');
    // face
    E(32, 31, 13, 14, C.o); E(32, 31, 12, 13, C.sk[1]); E(29, 28, 9, 9, C.sk[0]); E(41, 35, 3, 7, C.sk[2]);
    // hairline: center part with wisps falling to each side
    R(20, 17, 24, 3, C.sHair[2]); R(21, 19, 6, 2, C.sHair[2]); R(37, 19, 7, 2, C.sHair[2]); if (st !== 'pony') { R(19, 20, 3, 8, C.sHair[2]); R(43, 20, 3, 8, C.sHair[3]); } else { R(19, 20, 2, 4, C.sHair[2]); R(44, 20, 2, 4, C.sHair[3]); }
    R(31, 17, 2, 2, C.sk[1]); R(22, 18, 8, 1, C.sHair[1]); R(34, 18, 8, 1, C.sHair[1]);
    if (st === 'long') for (var f2 = 0; f2 < 4; f2++) { curl(18 + (f2 % 2), 44 + f2 * 5, 3, C.sHair[1]); curl(46 - (f2 % 2), 44 + f2 * 5, 3, C.sHair[2]); }
    // gold hoops
    R(19, 37, 1, 3, C.gold); R(20, 39, 1, 1, C.goldSh); R(44, 37, 1, 3, C.gold); R(43, 39, 1, 1, C.goldSh);
    // brows and eyes
    R(23, 24, 6, 1, C.sHair[2]); R(24, 23, 4, 1, C.sHair[2]); R(35, 24, 6, 1, C.sHair[2]); R(36, 23, 4, 1, C.sHair[2]);
    [[23, 27], [35, 27]].forEach(function (p) {
      R(p[0], p[1], 7, 1, C.o); R(p[0], p[1] + 1, 1, 3, C.o); R(p[0] + 6, p[1] + 1, 1, 2, C.o); R(p[0] + 1, p[1] + 4, 5, 1, C.sk[2]);
      R(p[0] + 1, p[1] + 1, 5, 3, '#fbf7f4'); R(p[0] + 2, p[1] + 1, 3, 3, C.sEye); R(p[0] + 3, p[1] + 2, 1, 2, C.sEyeSh); R(p[0] + 2, p[1] + 1, 1, 1, '#fff');
      R(p[0] - 1, p[1] - 1, 1, 1, C.o); R(p[0] + 7, p[1] - 1, 1, 1, C.o);
    });
    if (glasses) { // clear frames
      [[21, 25], [33, 25]].forEach(function (p) { ctx.strokeStyle = C.glass; ctx.lineWidth = s; ctx.strokeRect(X + (p[0] + .5) * S, Y + (p[1] + .5) * S, 10 * S, 7 * S); R(p[0] + 2, p[1] + 1, 2, 1, C.glassHi); });
      R(31, 27, 2, 1, C.glass);
    }
    // nose with a tiny stud, freckles, blush
    R(31, 31, 2, 4, C.sk[2]); R(30, 35, 4, 1, C.sk[3]); R(29, 34, 1, 1, C.stud);
    [[24, 34], [26, 35], [37, 34], [39, 35], [28, 33], [35, 33]].forEach(function (p) { R(p[0], p[1], 1, 1, C.freckle); });
    E(24, 36, 3, 1, C.blush); E(40, 36, 3, 1, C.blush);
    // warm smile, mauve-rose lips
    R(27, 39, 10, 1, C.lipSh); R(26, 38, 1, 1, C.lipSh); R(37, 38, 1, 1, C.lipSh);
    R(28, 40, 8, 1, C.teeth); R(28, 41, 8, 1, C.lip); R(29, 42, 6, 1, C.lipSh);
    c.restore();
  }

  function plaid(x0, y0, w, h) { // green tartan with red and cream lines
    for (var yy = y0; yy < y0 + h; yy++) for (var xx = x0; xx < x0 + w; xx++) {
      var u = ((xx % 8) + 8) % 8, v = ((yy % 8) + 8) % 8, col = C.flannel[1];
      if (u < 2 || v < 2) col = C.flannel[2]; if (u < 2 && v < 2) col = C.flannel[3];
      if (u === 5 || v === 5) col = C.red; if ((xx + 4) % 16 === 0 || (yy + 4) % 16 === 0) col = C.cream;
      ctx.fillStyle = col; ctx.fillRect(X + xx * S, Y + yy * S, S, S);
    }
  }
  function keeganPortrait(c, x, y, s, t, capOn) {
    at(c, x, y, s); clipBox(c, x, y, s);
    R(0, 0, 64, 64, '#e6efe8'); for (var i = 0; i < 64; i += 8) R(i, 0, 4, 64, '#dde8df');
    // flannel shoulders with a white tee
    E(32, 70, 31, 19, C.o);
    c.save(); c.beginPath(); for (var yy = -18; yy <= 18; yy++) { var hw = Math.round(30 * Math.sqrt(Math.max(0, 1 - yy * yy / 324))); c.rect(x + (32 - hw) * s, y + (70 + yy) * s, (hw * 2 + 1) * s, s); } c.clip();
    plaid(0, 50, 64, 14); c.restore();
    E(32, 60, 8, 8, C.o); E(32, 60, 7, 7, C.tee); E(35, 61, 4, 5, C.teeSh);
    R(23, 52, 2, 10, C.o); R(39, 52, 2, 10, C.o);
    // neck
    R(27, 45, 10, 7, C.o); R(28, 45, 8, 7, C.sk[2]);
    // ears
    E(17, 31, 2, 3, C.o); E(17, 31, 1, 2, C.sk[2]); E(47, 31, 2, 3, C.o); E(47, 31, 1, 2, C.sk[2]);
    // head with a close buzz cut: hair fills the head, the face sits inside it
    E(32, 28, 15, 17, C.o);
    if (!capOn) { E(32, 28, 14, 16, C.kHair[1]); E(29, 16, 8, 3, C.kHair[0]); }
    E(32, 32, 14, 14, C.sk[1]); E(29, 28, 9, 8, C.sk[0]); E(41, 33, 3, 7, C.sk[2]);
    if (!capOn) { R(20, 20, 24, 1, C.kHair[2]); R(18, 21, 3, 9, C.kHair[1]); R(43, 21, 3, 9, C.kHair[2]); }
    // full but trimmed beard that follows the jaw, joined to the sideburns
    R(18, 28, 2, 8, C.beard[1]); R(44, 28, 2, 8, C.beard[2]);
    for (var yb = 34; yb <= 46; yb++) { var hb = Math.round(13.5 * Math.sqrt(Math.max(0, 1 - Math.pow((yb - 33) / 13.5, 2)))); R(32 - hb - 1, yb, hb * 2 + 3, 1, C.o); R(32 - hb, yb, hb * 2 + 1, 1, yb < 40 ? C.beard[1] : C.beard[2]); }
    R(19, 32, 3, 6, C.beard[1]); R(42, 32, 3, 6, C.beard[2]); R(22, 35, 6, 3, C.beard[0]);
    for (var bt = 0; bt < 5; bt++) R(24 + bt * 4, 41 + (bt % 2), 1, 1, C.beard[3]);
    // moustache and a relaxed, warm smile
    R(26, 34, 12, 2, C.beard[2]); R(27, 34, 4, 1, C.beard[1]);
    R(28, 37, 8, 1, C.o); R(27, 36, 1, 1, C.o); R(36, 36, 1, 1, C.o); R(29, 38, 6, 1, '#b86a62');
    // brows, open brown eyes, nose and stud
    R(23, 23, 7, 2, C.kHair[2]); R(35, 23, 7, 2, C.kHair[2]);
    [[23, 26], [35, 26]].forEach(function (p) {
      R(p[0], p[1], 7, 1, C.o); R(p[0], p[1] + 1, 1, 2, C.o); R(p[0] + 6, p[1] + 1, 1, 2, C.o); R(p[0] + 1, p[1] + 3, 5, 1, C.sk[2]);
      R(p[0] + 1, p[1] + 1, 5, 2, '#fbf7f4'); R(p[0] + 2, p[1] + 1, 3, 2, C.kEye); R(p[0] + 3, p[1] + 1, 1, 2, '#2e211a'); R(p[0] + 2, p[1] + 1, 1, 1, '#fff');
    });
    R(31, 29, 2, 4, C.sk[2]); R(30, 32, 4, 1, C.sk[3]); R(34, 31, 1, 1, C.stud);
    if (capOn) { // cream cap with a brown brim
      E(32, 15, 16, 8, C.o); E(32, 15, 15, 7, C.cap[1]); E(28, 12, 9, 4, C.cap[0]); R(17, 16, 30, 5, C.cap[1]); R(17, 20, 30, 1, C.cap[2]);
      R(15, 20, 34, 3, C.o); R(16, 20, 32, 2, C.brim); R(27, 11, 10, 5, '#2f4a63'); R(28, 12, 8, 2, '#a9c7de');
    }
    c.restore();
  }

  // ---------- Map sprites (front, 3/4 view). Sarah 18 x 38, Keegan 20 x 42. ----------
  function sarahSprite(c, x, y, s, t, glasses, outfit, style) {
    at(c, x, y, s); var st = style || 'bun';
    if (st === 'bun') { E(9, 3, 4, 2, C.o); E(9, 3, 3, 1, C.sHair[1]); }   // pinned-up curls
    if (st === 'bob') { E(4, 4, 2, 2, C.o); E(9, 2, 3, 2, C.o); E(14, 4, 2, 2, C.o); E(4, 4, 1, 1, C.sHair[1]); E(9, 2, 2, 1, C.sHair[1]); E(14, 4, 1, 1, C.sHair[2]); }
    if (st === 'pony') { [[15, 5], [17, 9], [17, 13], [16, 17]].forEach(function (q, k) { E(q[0], q[1], 2, 2, C.o); E(q[0], q[1], 1, 1, k % 2 ? C.sHair[2] : C.sHair[1]); }); R(15, 3, 2, 2, '#7fa7a0'); }
    if (st === 'long') { R(1, 8, 17, 19, C.o); R(2, 8, 15, 18, C.sHair[2]); R(2, 9, 5, 16, C.sHair[1]); }
    E(9, 10, 8, 8, C.o); E(9, 10, 7, 7, C.sHair[2]); E(7, 8, 5, 4, C.sHair[1]);
    if (st !== 'pony') [[2, 15], [5, 17], [13, 17], [16, 15]].forEach(function (p, k) { E(p[0], p[1], 2, 2, C.o); E(p[0], p[1], 1, 1, k < 2 ? C.sHair[1] : C.sHair[2]); });
    E(9, 11, 6, 6, C.o); E(9, 11, 5, 5, C.sk[1]); E(8, 10, 3, 3, C.sk[0]);
    R(4, 5, 11, 3, C.sHair[2]); R(5, 5, 4, 1, C.sHair[1]); R(9, 5, 1, 2, C.sk[1]); R(3, 7, 2, 7, C.sHair[2]); R(14, 7, 2, 7, C.sHair[3]);
    R(6, 10, 2, 2, C.o); R(11, 10, 2, 2, C.o); R(6, 10, 1, 1, '#fff'); R(11, 10, 1, 1, '#fff');
    if (glasses) { R(5, 9, 4, 1, C.glass); R(10, 9, 4, 1, C.glass); R(5, 12, 4, 1, C.glass); R(10, 12, 4, 1, C.glass); }
    R(5, 13, 1, 1, C.blush); R(13, 13, 1, 1, C.blush); R(8, 14, 3, 1, C.lip); R(4, 14, 1, 2, C.gold); R(14, 14, 1, 2, C.gold);
    if (outfit === 'orange') { // ORANGE ROCKS tee
      R(3, 17, 13, 11, C.o); R(4, 17, 11, 10, C.orange[1]); R(4, 17, 3, 9, C.orange[0]); R(12, 18, 3, 9, C.orange[2]); R(8, 17, 3, 1, C.orange[3]);
      R(6, 20, 7, 1, '#fff8ee'); R(6, 22, 7, 1, '#fff8ee'); R(7, 21, 5, 1, C.orange[2]);
      R(2, 18, 2, 9, C.o); R(2, 18, 1, 3, C.orange[0]); R(2, 21, 1, 5, C.sk[1]); R(15, 18, 2, 9, C.o); R(16, 18, 1, 3, C.orange[2]); R(16, 21, 1, 5, C.sk[2]);
    } else {
    // rose flower cardigan over cream
    R(3, 17, 13, 11, C.o); R(4, 17, 11, 10, '#b9505a'); R(4, 17, 5, 9, '#c9636b'); R(8, 17, 3, 6, '#f3ead8');
    R(5, 20, 2, 2, '#e7a9c4'); R(12, 19, 2, 2, '#c8a6d8'); R(11, 24, 2, 2, '#f0b3c4'); R(5, 24, 1, 1, '#e8b85a');
    R(2, 18, 2, 9, C.o); R(2, 18, 1, 8, '#c9636b'); R(15, 18, 2, 9, C.o); R(16, 18, 1, 8, '#9e4049');
    }
    R(2, 26, 2, 2, C.sk[1]); R(15, 26, 2, 2, C.sk[2]); R(2, 27, 1, 1, C.nail);
    // straight jeans and tan boots
    R(4, 27, 11, 8, C.o); R(5, 27, 4, 7, C.jeans[0]); R(10, 27, 4, 7, C.jeans[1]); R(9, 28, 1, 6, C.jeans[2]);
    R(4, 34, 5, 4, C.o); R(5, 34, 3, 3, C.boot[0]); R(5, 37, 4, 1, C.boot[2]); R(10, 34, 5, 4, C.o); R(10, 34, 3, 3, C.boot[1]); R(10, 37, 4, 1, C.boot[2]);
    if (st === 'long') { [[3, 19], [3, 23], [15, 19], [15, 23]].forEach(function (q, k) { E(q[0], q[1], 2, 2, C.o); E(q[0], q[1], 1, 1, k < 2 ? C.sHair[1] : C.sHair[2]); }); }
  }
  function keeganSprite(c, x, y, s, t, capOn) {
    at(c, x, y, s);
    E(10, 10, 8, 9, C.o);
    if (!capOn) { E(10, 10, 7, 8, C.kHair[1]); R(6, 3, 5, 1, C.kHair[0]); }
    E(10, 12, 7, 7, C.sk[1]); E(8, 11, 4, 4, C.sk[0]); R(2, 10, 2, 3, C.sk[2]); R(16, 10, 2, 3, C.sk[2]);
    if (capOn) { R(3, 1, 14, 6, C.o); R(4, 2, 12, 4, C.cap[1]); R(4, 2, 6, 2, C.cap[0]); R(1, 6, 17, 2, C.o); R(2, 6, 15, 1, C.brim); R(8, 2, 4, 3, '#2f4a63'); }
    else R(3, 7, 14, 1, C.kHair[2]);
    R(6, 10, 2, 2, C.o); R(12, 10, 2, 2, C.o); R(6, 10, 1, 1, '#fff'); R(12, 10, 1, 1, '#fff');
    // beard
    R(3, 12, 14, 6, C.o); R(4, 18, 12, 1, C.o); R(4, 12, 12, 6, C.beard[1]); R(4, 12, 4, 3, C.beard[0]); R(12, 15, 3, 3, C.beard[2]);
    R(8, 15, 4, 1, '#b86a62'); R(10, 13, 1, 1, C.sk[2]);
    // flannel over a white tee
    R(2, 19, 16, 13, C.o);
    at(c, x, y, s); c.save(); c.beginPath(); c.rect(x + 3 * s, y + 19 * s, 14 * s, 12 * s); c.clip(); plaid(0, 19, 20, 13); c.restore();
    R(8, 19, 4, 11, C.tee); R(11, 20, 1, 10, C.teeSh); R(7, 19, 1, 11, C.flannel[3]); R(12, 19, 1, 11, C.flannel[3]);
    R(0, 20, 2, 10, C.o); R(0, 20, 1, 9, C.flannel[1]); R(18, 20, 2, 10, C.o); R(19, 20, 1, 9, C.flannel[2]);
    R(0, 29, 2, 2, C.sk[1]); R(18, 29, 2, 2, C.sk[2]); R(18, 30, 1, 1, C.kNail);
    // jean shorts, legs, Converse high-tops
    R(4, 31, 12, 5, C.o); R(5, 31, 5, 4, C.denim[0]); R(10, 31, 5, 4, C.denim[1]); R(10, 32, 1, 3, C.denim[2]);
    R(5, 36, 4, 3, C.sk[1]); R(11, 36, 4, 3, C.sk[2]);
    R(4, 38, 6, 4, C.o); R(5, 38, 4, 2, C.shoe); R(5, 41, 5, 1, C.sole); R(10, 38, 6, 4, C.o); R(11, 38, 4, 2, C.shoeSh); R(10, 41, 5, 1, C.sole);
  }
  function teeCard(c, x, y, s, back) { // the ORANGE ROCKS tee, front or back
    at(c, x, y, s); var O = C.orange;
    R(9, 1, 22, 34, C.o); R(1, 3, 38, 11, C.o); R(0, 5, 1, 7, C.o); R(39, 5, 1, 7, C.o);
    R(10, 2, 20, 32, O[1]); R(2, 4, 36, 9, O[1]); R(1, 6, 1, 5, O[1]); R(38, 6, 1, 5, O[2]);
    R(10, 3, 3, 30, O[0]); R(2, 4, 7, 3, O[0]); R(27, 3, 3, 30, O[2]); R(31, 4, 7, 8, O[2]);
    R(2, 12, 7, 1, O[3]); R(31, 12, 7, 1, O[3]); R(9, 5, 1, 8, O[3]); R(30, 5, 1, 8, O[3]); R(10, 33, 20, 1, O[3]);
    if (back) { R(15, 1, 10, 2, C.o); R(16, 1, 8, 1, '#fff6ea'); R(16, 2, 8, 1, O[3]); }
    else { R(14, 1, 12, 4, C.o); R(15, 1, 10, 2, '#fff6ea'); R(16, 3, 8, 1, '#fff6ea'); R(15, 3, 1, 1, O[3]); R(24, 3, 1, 1, O[3]); R(16, 4, 8, 1, O[3]); }
    c.textAlign = 'center'; c.font = (3 * s) + 'px "Press Start 2P", monospace';
    var lines = back ? ['AND', 'SO DO I'] : ['ORANGE', 'ROCKS'];
    lines.forEach(function (w, i) { var tx = x + 20 * s, ty = y + (back ? 10 : 11) * s + i * 5 * s; c.fillStyle = O[3]; c.fillText(w, tx + s / 2, ty + s / 2); c.fillStyle = '#fff8ee'; c.fillText(w, tx, ty); });
    c.textAlign = 'left';
  }
  function shadow(c, x, y, w) { c.fillStyle = 'rgba(90,45,40,.25)'; c.beginPath(); c.ellipse(x, y, w / 2, w / 5, 0, 0, 7); c.fill(); }

  window.SS_SARAH = sarahSprite; window.SS_KEEGAN = keeganSprite; // shared with later mockups
  window.drawPeopleSheet = function (c, W, H, t) {
    c.imageSmoothingEnabled = false;
    c.fillStyle = '#fff6ea'; c.fillRect(0, 0, W, H);
    c.fillStyle = '#6b4250'; c.font = '16px "Press Start 2P", monospace'; c.textBaseline = 'top';
    c.fillText('SARAH & KEEGAN', 24, 20); c.font = '9px "Press Start 2P", monospace'; c.fillStyle = '#9b7b84';
    c.fillText("SARAH'S SIM · REFERENCE V1", 24, 44);
    var P = 3, frames = [[function (q) { sarahPortrait(c, q, 72, P, t, false); }, 'SARAH'], [function (q) { sarahPortrait(c, q, 72, P, t, true); }, 'SARAH, GLASSES'],
      [function (q) { keeganPortrait(c, q, 72, P, t, false); }, 'KEEGAN'], [function (q) { keeganPortrait(c, q, 72, P, t, true); }, 'KEEGAN, CAP ON']];
    frames.forEach(function (f, i) { var q = 24 + i * 216; c.fillStyle = '#e8cdb4'; c.fillRect(q - 4, 68, 200, 200); f[0](q); c.fillStyle = '#6b4250'; c.font = '9px "Press Start 2P", monospace'; c.fillText(f[1], q, 278); });
    var fx = 20, fy = 304, S = 5;
    c.fillStyle = '#d39a66'; c.fillRect(fx, fy, 640, 230);
    for (var r = 0; r < 230; r += 20) { c.fillStyle = r % 40 ? '#c88d5a' : '#d39a66'; c.fillRect(fx, fy + r, 640, 20); c.fillStyle = '#93603c'; c.fillRect(fx, fy + r + 19, 640, 1); }
    var base = fy + 216;
    shadow(c, fx + 75, base, 70); sarahSprite(c, fx + 30, base - 38 * S, S, t, true);
    shadow(c, fx + 200, base, 80); keeganSprite(c, fx + 150, base - 42 * S, S, t, false);
    shadow(c, fx + 330, base, 80); keeganSprite(c, fx + 280, base - 42 * S, S, t, true);
    if (window.LOUIE_SIT) { var L = window.LOUIE_SIT; shadow(c, fx + 450, base, 70); for (var j = 0; j < L.length; j++) for (var i = 0; i < L[j].length; i++) { var ch = L[j][i]; if (ch !== '.' && window.LOUIE_PAL[ch]) { c.fillStyle = window.LOUIE_PAL[ch]; c.fillRect(fx + 408 + i * S, base - L.length * S + j * S, S, S); } } }
    shadow(c, fx + 565, base, 70); sarahSprite(c, fx + 520, base - 38 * S, S, t, false, 'orange');
    c.fillStyle = '#6b4250'; c.font = '9px "Press Start 2P", monospace'; c.fillText('MAP SPRITES (5x), WITH LOUIE FOR SIZE', fx, fy + 240);
    c.font = '8px "Press Start 2P", monospace';
    ['Sarah: copper curly bob, often', ' pinned up; freckles, grey-blue', ' eyes, glasses, gold hoops', 'Keegan: buzz cut, full brown', ' beard, nose stud, flannel,', ' caps, Converse', 'Their real clothes become', ' outfits in the Style catalog'].forEach(function (s, i) { c.fillText(s, 680, 320 + i * 15); });
    c.fillText('ACTUAL SIZE', 680, 456);
    c.fillStyle = '#d39a66'; c.fillRect(680, 470, 140, 56);
    sarahSprite(c, 690, 482, 1, t, true); keeganSprite(c, 712, 478, 1, t, false); keeganSprite(c, 738, 478, 1, t, true); sarahSprite(c, 790, 482, 1, t, false, 'orange');
    if (window.LOUIE_SIT) { var L2 = window.LOUIE_SIT; for (var j2 = 0; j2 < L2.length; j2++) for (var i2 = 0; i2 < L2[j2].length; i2++) { var ch2 = L2[j2][i2]; if (ch2 !== '.' && window.LOUIE_PAL[ch2]) { c.fillStyle = window.LOUIE_PAL[ch2]; c.fillRect(762 + i2, 500 + j2, 1, 1); } } }
    var hy = 584; c.fillStyle = '#6b4250'; c.font = '12px "Press Start 2P", monospace'; c.fillText('HAIRSTYLES: ALWAYS GINGER', 24, hy);
    c.font = '8px "Press Start 2P", monospace'; c.fillStyle = '#9b7b84'; c.fillText('SHE CAN RESTYLE IT, NEVER RECOLOR IT', 24, hy + 20);
    [['bun', 'PINNED UP'], ['bob', 'LOOSE BOB'], ['long', 'LONG CURLS'], ['pony', 'PONYTAIL']].forEach(function (h, i) {
      var q = 24 + i * 216; c.fillStyle = '#e8cdb4'; c.fillRect(q - 3, hy + 37, 134, 134); sarahPortrait(c, q, hy + 40, 2, t, false, h[0]);
      c.fillStyle = '#d39a66'; c.fillRect(q + 136, hy + 37, 66, 134); shadow(c, q + 169, hy + 160, 46); sarahSprite(c, q + 140, hy + 160 - 38 * 3, 3, t, false, null, h[0]);
      c.fillStyle = '#6b4250'; c.font = '9px "Press Start 2P", monospace'; c.fillText(h[1], q, hy + 182);
    });
    var oy = 830; c.fillStyle = '#6b4250'; c.font = '12px "Press Start 2P", monospace'; c.fillText('OUTFIT: ORANGE ROCKS TEE', 24, oy);
    c.font = '8px "Press Start 2P", monospace'; c.fillStyle = '#9b7b84'; c.fillText("FROM SARAH'S CHILDHOOD SHIRT", 24, oy + 20);
    [[false, 'FRONT'], [true, 'BACK']].forEach(function (f, i) { var q = 24 + i * 200; c.fillStyle = '#f6e3d3'; c.fillRect(q, oy + 40, 184, 156); teeCard(c, q + 12, oy + 50, 4, f[0]); c.fillStyle = '#6b4250'; c.font = '9px "Press Start 2P", monospace'; c.fillText(f[1], q, oy + 206); });
    c.font = '8px "Press Start 2P", monospace'; c.fillStyle = '#6b4250';
    ['Bright orange fitted tee', 'White rounded letters', 'Front: ORANGE ROCKS', 'Back: AND SO DO I', 'In the Style catalog from', ' the start, for Sarah and', ' anyone she makes'].forEach(function (w, i) { c.fillText(w, 440, oy + 50 + i * 16); });
  };
})();
