// Sarah's Sim people and cats on the map: Sarah and Keegan from mockups/people-v1, Louie from mockups/louie-v1 and Ralph
// from mockups/ralph-v1 (all approved Nov 25 as the reference sheet). The drawing code below is ported from those files
// unchanged; the poses around it (walk, back, sit, lie, the cats' walk) are built from the same drawings, so they stay on model
// (studio-bible/art-style.md, Animation: one body rig, poses move its parts).
//   SS.person(c, who, x, y, o)   who 'sarah' | 'keegan'; x, y = the point between the feet; o = {pose: 'stand' 'walk1' 'walk2'
//                                'sit' 'lie', back: true (seen from behind), flip: true (facing the other way), t}
//   SS.cat(c, who, x, y, o)      who 'louie' | 'ralph'; o = {pose: 'sit' 'loaf' 'curl' 'walk1' 'walk2', flip, t}
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

  function plaid(x0, y0, w, h) { // green tartan with red and cream lines
    for (var yy = y0; yy < y0 + h; yy++) for (var xx = x0; xx < x0 + w; xx++) {
      var u = ((xx % 8) + 8) % 8, v = ((yy % 8) + 8) % 8, col = C.flannel[1];
      if (u < 2 || v < 2) col = C.flannel[2]; if (u < 2 && v < 2) col = C.flannel[3];
      if (u === 5 || v === 5) col = C.red; if ((xx + 4) % 16 === 0 || (yy + 4) % 16 === 0) col = C.cream;
      ctx.fillStyle = col; ctx.fillRect(X + xx * S, Y + yy * S, S, S);
    }
  }
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
    else { R(4, 5, 12, 1, C.kHair[1]); R(4, 6, 3, 1, C.kHair[1]); R(13, 6, 3, 1, C.kHair[1]); R(3, 7, 2, 2, C.kHair[2]); R(15, 7, 2, 2, C.kHair[2]); } // buzz-cut hairline with temples, no band across the forehead
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
  var LPAL = {
    o: '#3b2f33', D: '#4d474d', d: '#625b61', g: '#7f787d', G: '#9d969a', H: '#b5aeb1',
    w: '#f6f2ee', W: '#ddd5d2', V: '#c4bab8', p: '#eea2ab', n: '#e2828f', e: '#b8c24a', E: '#7d8a2a', k: '#2b2226'
  };
  // Map sprites, 1 char = 1 px. '.' is clear.
  var LSIT = [
    '...o.........o...',
    '..oGo.......odo..',
    '..oGpo.....opdo..',
    '.oGgpooooooopgdo.',
    '.oGGgggggwgggggo.',
    '.oGggggwwwgggggo.',
    '.oGgkeggwwwggekgo',
    '.ogggggwwwwgggddo',
    '.owwgggwwnwwgggwo',
    '..owwwwwwowwwwwo.',
    '...oowwwwwwwwoo..',
    '..odgwwwwwwwwgdo.',
    '.oGggwwwwwwwwggdo',
    '.oGggwwwwwwwwgdo.',
    '.oGgwwwWwwWwwgddo',
    '.oggwwwWwwWwwgddoo',
    '.oggwwwWwwWwwgddogo',
    '.odgwwWWwwWWwddoddo',
    '..odwwwwowwwwdoooo.',
    '...ooooo.ooooo.....'
  ];
  var LLOAF = [
    '..............o.......o.',
    '.............oGo.....odo',
    '.............oGpooooopdo',
    '....oooooooooGggggwggggo',
    '...oGGGGgggggGggggwwgggo',
    '..oGgGggggdggGgkegwwgekd',
    '.oGggggdggggddggggwwwggo',
    '.oGgggggggggggdgwwwnwwwo',
    'oodggggggggggdddowwowwo.',
    'ogodgggggggggdddwwwwwwo.',
    'oddogwwgggggdddwwwWwwwo.',
    '.ooodwwWdddddddWwwwWwwo.',
    '....ooooooooooooooooooo.'
  ];
  var LCURL = [ // asleep, paws over his face
    '.......ooooooooo.......',
    '.....ooGGGggggggoo.....',
    '....oGGgggggggggddo....',
    '...oGggggdgggggggdo.o..',
    '..oGgggggggggggggddoGo.',
    '..oGggggggggwwwgggdopo.',
    '.oGgggggggwwwwwwwggggo.',
    '.oGggggggwwwWwwwwwgggo.',
    '.ogggggggwwwwwwnwwgggo.',
    '.odggddddwwWwwwwwggddo.',
    'oddddgggddwwwwwwwddddo.',
    'oDdddgggggdddddddddddo.',
    '.oDDddddddddddddddddo..',
    '..ooooooooooooooooo....'
  ];
  var RPAL = {
    o: '#4a2a1e', D: '#8f4a1f', d: '#b8642a', g: '#d9853f', G: '#eaa35e', H: '#f4c088',
    w: '#fbf6ef', W: '#e6dbd0', V: '#cfc1b4', p: '#eea2ab', n: '#d98a8a', e: '#c9dba0', E: '#94a96a', k: '#2b2226',
    r: '#d2363c', R: '#9e2128', q: '#ec6a6e', s: '#dfe4e8', S: '#9aa3ab'
  };
  var RSIT = [
    '....o...........o....',
    '...oGo.........odo...',
    '...oGpo.......opdo...',
    '..oGgpoooooooooopgdo.',
    '.oGGgdggggwggdggggdo.',
    '.oGggggggggwgggggggdo',
    '.oGgkeggggwggggekgdo.',
    '.oGggggggwwwwwgggggdo',
    '.oggggwwwwnwwwwggddo.',
    '..oggwwwwwowwwwwggo..',
    '...ooggwwwwwwwggoo...',
    '..oGgggwwwwwwwgggdo..',
    '.oGggdgwwwwwwwgdggdo.',
    '.oGgggdwwwwwwwdgggdo.',
    'oGgdgggwwwwwwwgggdgdo',
    'oGgggdgwwwwwwwgdgggdo',
    'oGggggg' + 'wwWwwWww' + 'gggddo',
    'ogggggd' + 'wwWwwWww' + 'dgggdo',
    'odggggd' + 'wwWwwWww' + 'dggddo',
    'oddgggd' + 'wwwwowww' + 'dddo..',
    '.oDdGgdddooodddgGdDo.',
    '..ooooooo...ooooooo..'
  ];
  // fix row 5 and 7 to 21 wide
  RSIT[5] = '.oGggggggg' + 'w' + 'gggggggdo' + '.';
  RSIT[7] = '.oGggggg' + 'wwwww' + 'gggggdo' + '.';
  function bowSprite(c, x, y, s, cx, cy) { // bowtie on a sprite, centered on pixel cx, cy
    var B = ['rr.....rr', 'qrrr.rrrR', 'rrRRrRRrR', 'rrrr.rrrR', 'RR.....RR'];
    var Bf = ['RR', 'q'];
    for (var j = 0; j < 3; j++) for (var i = 0; i < 9; i++) {
      var ch = ['rrr.r.rrr', 'qrRrrrRrR', 'rRR.r.RRR'][j][i]; if (ch === '.') continue;
      c.fillStyle = RPAL[ch]; c.fillRect(x + (cx - 4 + i) * s, y + (cy - 1 + j) * s, s, s);
    }
    c.fillStyle = RPAL.s; c.fillRect(x + cx * s, y + (cy + 2) * s, s, s);
  }
  function ralphLoaf(c, X, Y, S, bow) {
    function R(x, y, w, h, col) { c.fillStyle = col; c.fillRect(X + x * S, Y + y * S, w * S, h * S); }
    function E(cx, cy, rx, ry, col) { for (var yy = -ry; yy <= ry; yy++) { var hw = Math.round(rx * Math.sqrt(Math.max(0, 1 - (yy * yy) / (ry * ry)))); R(cx - hw, cy + yy, hw * 2 + 1, 1, col); } }
    E(17, 10, 10, 7, RPAL.o); E(17, 10, 9, 6, RPAL.g); E(15, 7, 7, 3, RPAL.G); E(17, 14, 8, 2, RPAL.d);
    for (var i = 10; i < 24; i += 4) { R(i, 5, 1, 3, RPAL.d); R(i + 1, 9, 1, 3, RPAL.d); }
    R(6, 14, 6, 2, RPAL.o); R(7, 14, 4, 1, RPAL.g); R(8, 14, 1, 1, RPAL.D); R(10, 14, 1, 1, RPAL.D); // ringed tail curled in front
    // head
    E(26, 7, 7, 6, RPAL.o); E(26, 7, 6, 5, RPAL.g); E(25, 5, 4, 3, RPAL.G);
    R(21, 0, 1, 1, RPAL.o); R(20, 1, 3, 1, RPAL.o); R(21, 1, 1, 1, RPAL.G); R(20, 2, 3, 1, RPAL.o); R(21, 2, 1, 1, RPAL.p);
    R(30, 0, 1, 1, RPAL.o); R(29, 1, 3, 1, RPAL.o); R(30, 1, 1, 1, RPAL.d); R(29, 2, 3, 1, RPAL.o); R(30, 2, 1, 1, RPAL.p);
    R(26, 3, 1, 5, RPAL.w); E(26, 9, 3, 2, RPAL.w); R(26, 8, 1, 1, RPAL.n);
    R(23, 6, 1, 1, RPAL.k); R(24, 6, 1, 1, RPAL.e); R(28, 6, 1, 1, RPAL.e); R(29, 6, 1, 1, RPAL.k);
    E(23, 13, 4, 3, RPAL.w); E(22, 15, 3, 1, RPAL.o); R(20, 15, 3, 1, RPAL.w); R(24, 15, 3, 1, RPAL.w); // bib and white paws
    if (bow) bowSprite(c, X, Y, S, 25, 12);
  }


  function sprite(c, rows, x, y, s, pal) {
    for (var j = 0; j < rows.length; j++) for (var i = 0; i < rows[j].length; i++) {
      var ch = rows[j][i]; if (ch === '.' || !pal[ch]) continue;
      c.fillStyle = pal[ch]; c.fillRect(x + i * s, y + j * s, s, s);
    }
  }
  var CACHE = {};
  function canvas(w, h) { var cv = document.createElement('canvas'); cv.width = w; cv.height = h; return cv; }
  // the base drawing of each person, front and back, cached
  function base(who, back, look) {
    var k = who + (back ? 'B' : 'F') + (look || '');
    if (CACHE[k]) return CACHE[k];
    var W = who === 'sarah' ? 20 : 22, H = who === 'sarah' ? 40 : 44, cv = canvas(W, H), c = cv.getContext('2d');
    if (who === 'sarah') sarahSprite(c, 1, 2, 1, 0, false, look === 'orange' ? 'orange' : null, 'bun');
    else keeganSprite(c, 1, 2, 1, 0, false);
    if (back) { // the back of the head: hair over the face, drawn with the sprite's own hair shapes
      at(c, 1, 2, 1);
      if (who === 'sarah') { E(9, 11, 6, 6, C.o); E(9, 11, 5, 5, C.sHair[2]); E(7, 9, 4, 3, C.sHair[1]); [[4, 16], [9, 17], [14, 16]].forEach(function (p, i) { E(p[0], p[1], 2, 2, C.o); E(p[0], p[1], 1, 1, i === 1 ? C.sHair[2] : C.sHair[1]); }); E(9, 3, 4, 2, C.o); E(9, 3, 3, 1, C.sHair[1]); }
      else { E(10, 11, 8, 8, C.o); E(10, 11, 7, 7, C.kHair[1]); E(8, 8, 4, 3, C.kHair[0]); R(4, 17, 12, 2, C.sk[2]); R(4, 17, 12, 1, C.o); R(2, 10, 2, 3, C.sk[2]); R(16, 10, 2, 3, C.sk[2]); }
    }
    CACHE[k] = cv; return cv;
  }
  // a pose, built from the base drawing: walk frames lift one leg and bob the body a pixel (art-style.md, Animation: 4 beats)
  function posed(who, pose, back, look) {
    var k = who + pose + (back ? 'B' : 'F') + (look || '');
    if (CACHE[k]) return CACHE[k];
    var b = base(who, back, look), W = b.width, H = b.height, hip = who === 'sarah' ? 29 : 33, cv = canvas(W, H), c = cv.getContext('2d'), mid = Math.floor(W / 2);
    if (pose === 'walk1' || pose === 'walk2') {
      c.drawImage(b, 0, 0, W, hip, 0, 1, W, hip);
      var lift = pose === 'walk1' ? 0 : mid;
      c.drawImage(b, 0, hip, mid, H - hip, 0, hip - (lift === 0 ? 1 : 0), mid, H - hip);
      c.drawImage(b, mid, hip, W - mid, H - hip, mid, hip - (lift === mid ? 1 : 0), W - mid, H - hip);
    } else if (pose === 'sit') { // lowered onto a seat: the legs fold forward under the body
      c.drawImage(b, 0, 0, W, hip, 0, 6, W, hip);
      c.drawImage(b, 0, H - 5, W, 5, 0, H - 5, W, 5);
      c.drawImage(b, 0, hip, W, 3, 0, hip + 5, W, 2);
    } else c.drawImage(b, 0, 0);
    CACHE[k] = cv; return cv;
  }
  SS.person = function (c, who, x, y, o) {
    o = o || {};
    var pose = o.pose || 'stand', img;
    if (pose === 'lie') { // lying down: the drawing turned on its side, head toward the pillow
      img = posed(who, 'stand', false, o.look);
      c.save(); c.translate(Math.round(x), Math.round(y)); c.rotate(-Math.PI / 2 * (o.flip ? -1 : 1)); c.drawImage(img, -img.width / 2, -img.height + 4); c.restore(); return;
    }
    img = posed(who, pose, o.back, o.look);
    var bob = pose === 'stand' && o.t !== undefined && StudioRig.idle(o.t, who === 'sarah' ? 1 : 2) ? 1 : 0;
    var dx = Math.round(x - img.width / 2), dy = Math.round(y - img.height + 2 + bob);
    if (pose !== 'sit') { c.fillStyle = 'rgba(90,45,40,.25)'; c.beginPath(); c.ellipse(x, y, 8, 3, 0, 0, 7); c.fill(); }
    if (o.flip) { c.save(); c.translate(dx + img.width, dy); c.scale(-1, 1); c.drawImage(img, 0, 0); c.restore(); } else c.drawImage(img, dx, dy);
    // blink (art-style.md, Animation: 150 ms every few seconds)
    if (!o.back && o.t !== undefined && StudioRig.blink(o.t, who === 'sarah' ? 3 : 7)) {
      var ex = who === 'sarah' ? [7, 12] : [7, 13], ey = (who === 'sarah' ? 12 : 12) + (pose === 'sit' ? 6 : 0) + (pose.indexOf('walk') === 0 ? 1 : 0);
      ex.forEach(function (e) { var px = o.flip ? dx + img.width - e - 2 : dx + e; c.fillStyle = who === 'sarah' ? C.sk[1] : C.sk[1]; c.fillRect(px, dy + ey, 2, 2); c.fillStyle = C.o; c.fillRect(px, dy + ey + 1, 2, 1); });
    }
  };
  SS.personSize = function (who) { var b = base(who, false); return [b.width, b.height]; };

  var CATS = {
    louie: { pal: LPAL, sit: LSIT, loaf: LLOAF, curl: LCURL },
    ralph: { pal: RPAL, sit: RSIT }
  };
  function catImg(who, pose, bow) {
    var k = 'cat' + who + pose + (bow ? 'b' : '');
    if (CACHE[k]) return CACHE[k];
    var K = CATS[who], cv, c;
    if (pose === 'sit') { cv = canvas(K.sit[0].length + 2, K.sit.length); c = cv.getContext('2d'); sprite(c, K.sit, 0, 0, 1, K.pal); if (bow && who === 'ralph') bowSprite(c, 0, 0, 1, 10, 10); }
    else if (who === 'louie') { var rows = pose === 'curl' ? K.curl : K.loaf; cv = canvas(rows[0].length, rows.length); c = cv.getContext('2d'); sprite(c, rows, 0, 0, 1, K.pal); }
    else { cv = canvas(34, pose === 'curl' ? 18 : 18); c = cv.getContext('2d'); ralphLoaf(c, 0, 1, 1, bow); }
    CACHE[k] = cv; return cv;
  }
  SS.cat = function (c, who, x, y, o) {
    o = o || {};
    var pose = o.pose || 'sit', walk = pose === 'walk1' || pose === 'walk2', img = catImg(who, walk ? 'loaf' : pose, o.bow);
    var bob = walk && pose === 'walk2' ? 1 : 0;
    c.fillStyle = 'rgba(90,45,40,.25)'; c.beginPath(); c.ellipse(x, y, img.width * .38, 3, 0, 0, 7); c.fill();
    var dx = Math.round(x - img.width / 2), dy = Math.round(y - img.height + 1 - bob);
    if (o.flip) { c.save(); c.translate(dx + img.width, dy); c.scale(-1, 1); c.drawImage(img, 0, 0); c.restore(); } else c.drawImage(img, dx, dy);
    if (o.hat) { // a tiny Santa hat on Christmas (spec 009): on the head, which sits at the front of the loaf and the top of the sit
      var hx = pose === 'sit' ? dx + img.width / 2 : (o.flip ? dx + 6 : dx + img.width - 7), hy = pose === 'sit' ? dy : dy - 1;
      c.fillStyle = '#d2363c'; c.beginPath(); c.moveTo(hx - 4, hy + 2); c.lineTo(hx + 4, hy + 2); c.lineTo(hx + (o.flip ? -3 : 3), hy - 5); c.closePath(); c.fill();
      c.fillStyle = '#fff6ea'; c.fillRect(Math.round(hx - 4), Math.round(hy + 1), 8, 2); c.fillRect(Math.round(hx + (o.flip ? -4 : 3)), Math.round(hy - 6), 2, 2);
    }
    if (walk) { c.fillStyle = CATS[who].pal.o || '#3b2f33'; var f = pose === 'walk1' ? 0 : 2; c.fillRect(dx + 4 + f, y, 2, 1); c.fillRect(dx + img.width - 8 - f, y, 2, 1); }
  };
  SS.catSize = function (who, pose) { var i = catImg(who, pose || 'sit'); return [i.width, i.height]; };
  SS.drawSarahSprite = sarahSprite; SS.drawKeeganSprite = keeganSprite;
})();
