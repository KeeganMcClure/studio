// Sarah's Sim: outfits, the Style screen (spec 002, parts A and B; bible, Outfits; mockups/style-v1).
//   The person stands big (about 3 times map size) in front of a standing mirror. The arrows (or a swipe across them, or
//   Select) spin them a quarter turn: front, side, back, other side. The name opens the people in this home. The wardrobe
//   tray below has the 8 tabs (hair, tops, bottoms, dresses, shoes, extras, Ours, Holiday); a tap on a card (or a drag onto
//   the person) puts it on, and a tap on a worn card takes it off. A new piece gets a small happy hop.
//   Slots (spec 002, Claude default): hair; a top, with a coat over it; a bottom; a dress takes off the top and bottom; shoes;
//   one extra of each kind. Sarah's hair is always ginger: her hair tab shows styles only.
//   Ralph's bowtie: tapping Ralph gives "Bowtie on / off" instead of Style.
//   The first 10 pieces (build order step 1), ORANGE ROCKS tee included. Colors, paint, patterns and prints (parts C, D),
//   favorites and the camera (part E) and the map sprites wearing them (part F) come next.
//   Life: a piece she doesn't have yet shows its price (50 to 150, bible, Coins and prices); a tap buys it and puts it on.
(function () {
  var P = SS.P;
  var INK = '#3b2430';
  // ---------- the pieces (one row each; spec 002, piece data) ----------
  var ORANGE = ['#ffb760', '#f7922e', '#d8731d', '#a9541a'], JEANS = ['#7896bb', '#6a89b0', '#55739a', '#425a7c'], BOOT = ['#ecd0ab', '#e2c39c', '#cfa97d', '#b08a5f'];
  var PIECES = SS.CLOTHES = [
    { id: 'orange-rocks-tee', name: 'ORANGE ROCKS tee', tab: 'tops', slot: 'top', kind: 'tee', ours: true, price: 100,
      sw: [ORANGE, ['#f9b3c4', '#e46f8b', '#c55573', '#9c3f58'], ['#b5d4ca', '#7fa7a0', '#5f8a83', '#466b65'], ['#ffffff', '#f7f3ec', '#dcd5cb', '#b9b0a4']],
      print: { front: ['ORANGE', 'ROCKS'], back: ['AND SO', 'DO I'], col: '#fff8ee' } },
    { id: 'green-flannel', name: 'Green tartan flannel', tab: 'tops', slot: 'top', kind: 'flannel', ours: true, price: 120,
      sw: [['#4f8a6c', '#3c6a55', '#2f5646', '#1a3128'], ['#d65a5a', '#b8434a', '#8e2f36', '#5a1f26'], ['#6a89c0', '#4f6a9e', '#3d5480', '#2a3a5c']] },
    { id: 'lilac-hoodie', name: 'Lilac hoodie', tab: 'tops', slot: 'top', kind: 'hoodie', ours: true, price: 110,
      sw: [['#e4d4f0', '#c8a6d8', '#a785bd', '#7e5f96'], ['#cfe3d3', '#9cc1b6', '#7fa7a0', '#5f8a83'], ['#f3d9c4', '#e2b89a', '#c99a7c', '#9c7258']] },
    { id: 'long-wool-coat', name: 'Long wool coat', tab: 'tops', slot: 'coat', kind: 'coat', price: 150,
      sw: [['#d9b48c', '#c49a6c', '#a57c52', '#7d5a38'], ['#6b6470', '#544e5a', '#403b46', '#2c2831'], ['#d97b6e', '#b85b50', '#94443c', '#6c2f29']] },
    { id: 'straight-jeans', name: 'Straight blue jeans', tab: 'bottoms', slot: 'bottom', kind: 'jeans', ours: true, price: 90,
      sw: [JEANS, ['#b3cbe2', '#91afcc', '#7493b3', '#5a7898'], ['#5a5560', '#46424c', '#36323b', '#26232a']] },
    { id: 'pleated-skirt', name: 'Pleated skirt', tab: 'bottoms', slot: 'bottom', kind: 'skirt', price: 70,
      sw: [['#f3d38a', '#e7b75f', '#c99a44', '#a07830'], ['#f9b3c4', '#e46f8b', '#c55573', '#9c3f58'], ['#8e7fb8', '#6e5f9a', '#56487c', '#3e3460']] },
    { id: 'pink-slip-dress', name: 'Pink satin slip dress', tab: 'dresses', slot: 'dress', kind: 'slip', ours: true, price: 130,
      sw: [['#fbd3dc', '#f2aebf', '#dc8ea2', '#b96d82'], ['#f6ead0', '#ecdcc0', '#c4ab84', '#9c8662'], ['#b8b0d8', '#968ec4', '#776fa6', '#575080']] },
    { id: 'tan-suede-boots', name: 'Tan suede boots', tab: 'shoes', slot: 'shoes', kind: 'boots', ours: true, price: 110,
      sw: [BOOT, ['#a5785a', '#8a5f44', '#6f4a34', '#523424'], ['#4a4048', '#3a3238', '#2a2428', '#1c181b']] },
    { id: 'canvas-high-tops', name: 'Canvas high-tops', tab: 'shoes', slot: 'shoes', kind: 'hightops', ours: true, price: 80,
      sw: [['#ffffff', '#f3efe8', '#cfc8bd', '#8a7f75'], ['#4a4048', '#3a3238', '#2a2428', '#8a7f75'], ['#e46f6a', '#c9504c', '#a03c39', '#8a7f75']] },
    { id: 'black-cap', name: 'Black cap', tab: 'extras', slot: 'hat', kind: 'cap', ours: true, price: 50,
      sw: [['#4a4048', '#3a3238', '#2a2428', '#3e7a4f'], ['#f9b3c4', '#e46f8b', '#c55573', '#c55573'], ['#f4ede0', '#e6dccb', '#cbbda7', '#8a5a32']] }
  ];
  var BYID = {}; PIECES.forEach(function (p) { BYID[p.id] = p; });
  var TABS = SS.STYLE_TABS = ['hair', 'tops', 'bottoms', 'dresses', 'shoes', 'extras', 'ours', 'holiday'];
  var TAB_NAMES = { hair: 'HAIR', tops: 'TOPS', bottoms: 'BOTTOMS', dresses: 'DRESSES', shoes: 'SHOES', extras: 'EXTRAS', ours: 'OURS: FROM OUR PHOTOS', holiday: 'HOLIDAY' };
  // hairstyles: Sarah's four (bible, Homes and people), Keegan's buzz cut; the Creator's full list comes with spec 003
  var SHORT = { pinned: 'PINNED', bob: 'BOB', curls: 'CURLS', pony: 'PONY', buzz: 'BUZZ', crop: 'CROP', bald: 'BALD', straight: 'LONG', afro: 'AFRO', braids: 'BRAIDS', bun: 'BUN', locs: 'LOCS' };
  var HAIR = SS.HAIRSTYLES = { pinned: 'PINNED UP', bob: 'LOOSE BOB', curls: 'LONG CURLS', pony: 'PONYTAIL', buzz: 'BUZZ CUT', crop: 'SHORT CROP', bald: 'BALD', straight: 'LONG STRAIGHT', afro: 'AFRO', braids: 'TWO BRAIDS', bun: 'HIGH BUN', locs: 'LOCS' };
  SS.SHORT_HAIR = SHORT;
  // the Creator's hairstyles (spec 003, part B: half of the 24 to start) are the list Style uses; Sarah keeps her own four
  var HAIR_OF = { sarah: ['pinned', 'bob', 'curls', 'pony'], keegan: ['buzz', 'crop', 'bald'], made: Object.keys(HAIR) };
  function hairOf(who) { return HAIR_OF[who] || HAIR_OF.made; }
  var GINGER = ['#f0b878', '#d9904f', '#b56a34', '#87471f'];
  // 16 natural shades (spec 003, part B), dark to light, then grey and white
  var SHADES = SS.HAIR_SHADES = [['#5e4030', '#4a3226', '#38251c', '#271912'], ['#2f2a2c', '#221e20', '#171415', '#0e0c0d'], ['#3d3038', '#2d232a', '#201920', '#150f14'], ['#6e4a36', '#5a3b2b', '#462d20', '#311f16'],
    ['#9a6a4a', '#7c5238', '#5f3d29', '#432a1c'], ['#b07a50', '#93623e', '#744c2f', '#563621'], ['#c9a46a', '#a98450', '#87663c', '#644a2a'], ['#e6c98e', '#d1ad6c', '#b08e51', '#8a6c3a'],
    ['#f3e0b0', '#e3c98d', '#c7ab6d', '#a08650'], ['#f0b878', '#d9904f', '#b56a34', '#87471f'], ['#d97b4e', '#b85c35', '#934526', '#6b311b'], ['#a8503a', '#8a3e2c', '#6c3021', '#4e2218'],
    ['#8a8288', '#6f686e', '#575157', '#403b40'], ['#bcb6ba', '#a19aa0', '#857f85', '#69636a'], ['#e9e5e8', '#d6d0d4', '#bcb5bb', '#9d969d'], ['#d9737b', '#b9505a', '#8e3a44', '#682a32']];
  var PEOPLE = SS.STYLE_PEOPLE = { sarah: 'SARAH', keegan: 'KEEGAN' };
  SS.madePeople = function (G) { return G.save.people || (G.save.people = []); };
  SS.personName = function (G, who) { if (PEOPLE[who]) return PEOPLE[who]; if (who === 'draft') return 'NEW PERSON'; var p = SS.madePeople(G).filter(function (q) { return q.id === who; })[0]; return p ? p.name.toUpperCase() : who.toUpperCase(); };
  SS.styleWho = function (G) { return Object.keys(PEOPLE).concat(SS.madePeople(G).map(function (q) { return q.id; })); };
  // a person's look: Sarah's and Keegan's own faces (bible, Homes and people), or a made person's parts (spec 003, creator.js)
  var LOOKS = {
    sarah: { face: 'round', eyes: 'almond', eye: 0, nose: 'button', lips: 'smile', skin: 1, build: 'slim', freckles: true, hoops: true },
    keegan: { face: 'round', eyes: 'almond', eye: 1, nose: 'button', lips: 'smile', skin: 1, build: 'slim', beard: true }
  };
  SS.lookOf = function (G, who) {
    var raw = LOOKS[who];
    if (!raw && who === 'draft' && G.menu && G.menu.kind === 'creator') raw = G.menu.p.look;
    if (!raw) { var p = SS.madePeople(G).filter(function (q) { return q.id === who; })[0]; raw = p ? p.look : LOOKS.sarah; }
    var L = {}; for (var k in raw) L[k] = raw[k];
    L.skin = SS.SKINS[raw.skin || 0] || SS.SKINS[1]; L.eye = SS.EYE_COLORS[raw.eye || 0]; L.lip = raw.lip !== undefined ? SS.LIP_COLORS[raw.lip] : null;
    return L;
  };
  // 16 skin tones from light to deep, each with its own warm shading and blush (spec 003, part B)
  SS.SKINS = [['#fde6d6', '#f6d2bc', '#e5b39a', '#c99079', '#f4b2aa'], ['#fbdcc6', '#f2c3a6', '#dfa184', '#c27f66', '#f2aaa2'], ['#f6d3b4', '#ecbd96', '#d69e76', '#b97f5b', '#eca08e'], ['#f3cfa6', '#e6b886', '#cf9967', '#b07a4d', '#e8987e'],
    ['#ecc39e', '#dcab82', '#c48d64', '#a5714b', '#de8f78'], ['#e2b48a', '#d09f72', '#b78258', '#986741', '#d48068'], ['#d8a578', '#c48f62', '#a9744a', '#8a5b36', '#c9735a'], ['#cc9466', '#b77f52', '#9b663b', '#7d4f2b', '#bd6650'],
    ['#bf8457', '#a96f44', '#8e5833', '#714326', '#b05a46'], ['#b07548', '#996139', '#7f4c2b', '#643a20', '#a3503f'], ['#9e663e', '#875330', '#6e4224', '#55321a', '#954838'], ['#8e5a36', '#774829', '#5f381e', '#482a16', '#874033'],
    ['#7c4d2e', '#663d22', '#502f19', '#3b2212', '#7a382d'], ['#6b4128', '#56331e', '#432716', '#311c10', '#6c3229'], ['#5b3722', '#482b1a', '#372013', '#27170d', '#5e2c25'], ['#4c2e1d', '#3b2416', '#2c1b10', '#1f130b', '#512620']];
  SS.EYE_COLORS = [['#7f9fae', '#5d7c8a'], ['#4d3a2e', '#38251c'], ['#6b4a2e', '#4e351f'], ['#8a6a3a', '#6a4f28'], ['#5f8a5a', '#456a42'], ['#7aa38a', '#5a8270'],
    ['#4f7fb4', '#385f8a'], ['#88b4d8', '#6290b4'], ['#8d8a96', '#6a6774'], ['#9c7bb4', '#7a5c92'], ['#2e2622', '#1c1714'], ['#b08a4a', '#8c6a32']];
  SS.LIP_COLORS = ['#c8707c', '#b85a64', '#d98a8a', '#a8504e', '#e07a8e', '#9a4a5a', '#c97a62', '#8a3a44', '#e0928a', '#7a3a3e'];

  // what each person wears: the save's own copy (bible, Saves: one save per mode)
  function fresh(who) {
    if (who !== 'keegan' && who !== 'sarah') return { hair: 'straight', shade: 0, top: { id: 'lilac-hoodie', sw: 1 }, bottom: { id: 'straight-jeans', sw: 0 }, shoes: { id: 'canvas-high-tops', sw: 0 } };
    return who === 'keegan' ? { hair: 'buzz', shade: 0, top: { id: 'green-flannel', sw: 0 }, bottom: { id: 'straight-jeans', sw: 0 }, shoes: { id: 'canvas-high-tops', sw: 0 } }
      : { hair: 'pinned', top: { id: 'orange-rocks-tee', sw: 0 }, bottom: { id: 'straight-jeans', sw: 0 }, shoes: { id: 'tan-suede-boots', sw: 0 } };
  }
  SS.outfitOf = function (G, who) { if (who === 'draft' && G.menu && G.menu.kind === 'creator') return G.menu.p.outfit; var S = G.save, o = S.style || (S.style = {}); return o[who] || (o[who] = fresh(who)); };
  function owned(G) { var S = G.save; if (!S.clothes) { S.clothes = []; ['sarah', 'keegan'].forEach(function (w) { var o = SS.outfitOf(G, w); ['top', 'coat', 'bottom', 'dress', 'shoes', 'hat'].forEach(function (k) { if (o[k] && S.clothes.indexOf(o[k].id) < 0) S.clothes.push(o[k].id); }); }); } return S.clothes; }
  function priceOf(G, d) { return G.mode === 'life' && owned(G).indexOf(d.id) < 0 ? d.price : 0; }
  function wearing(o, d) { var w = o[d.slot]; return !!(w && w.id === d.id); }
  // put a piece on (or take it off): a dress takes off the top and bottom, and a top or bottom takes off a dress
  SS.wear = function (G, who, id) {
    var o = SS.outfitOf(G, who), d = BYID[id]; if (!d) return false;
    if (wearing(o, d)) { delete o[d.slot]; G.changed(true); return 'off'; }
    var cost = priceOf(G, d);
    if (cost) {
      if ((G.save.coins || 0) < cost) { G.toast('NOT ENOUGH COINS', 2000, d.name + ' is ' + cost + ' coins and you have ' + (G.save.coins || 0) + '.'); return false; }
      G.save.coins -= cost; owned(G).push(d.id); G.toast('BOUGHT', 1200, '-' + cost + ' coins');
    }
    o[d.slot] = { id: d.id, sw: 0 };
    if (d.slot === 'dress') { delete o.top; delete o.bottom; }
    if (d.slot === 'top' || d.slot === 'bottom') delete o.dress;
    if (G.menu && G.menu.kind === 'style') G.menu.happy = performance.now();
    G.changed(true); return 'on';
  };
  SS.setHair = function (G, who, style, shade) {
    var o = SS.outfitOf(G, who);
    if (style) o.hair = style;
    if (shade !== undefined && who !== 'sarah') o.shade = shade;   // Sarah's hair is always ginger: restyle, never recolor
    if (G.menu && G.menu.kind === 'style') G.menu.happy = performance.now();
    G.changed(true);
  };
  SS.hairColors = function (G, who) { return who === 'sarah' ? GINGER : SHADES[SS.outfitOf(G, who).shade || 0] || SHADES[0]; };
  SS.FIG_SIZE = [52, 124];

  // ---------- the big figure (about 50 x 120, mockups/style-v1), drawn in all four turns ----------
  var SK = ['#fbdcc6', '#f2c3a6', '#dfa184', '#c27f66'];
  var BEARD = ['#8a5c40', '#6b4632', '#503425', '#382419'];
  var GL = { A: ['.#.', '#.#', '###', '#.#', '#.#'], N: ['#.#', '###', '###', '###', '#.#'], D: ['##.', '#.#', '#.#', '#.#', '##.'], S: ['.##', '#..', '.#.', '..#', '##.'],
    O: ['.#.', '#.#', '#.#', '#.#', '.#.'], I: ['###', '.#.', '.#.', '.#.', '###'], R: ['##.', '#.#', '##.', '#.#', '#.#'], G: ['.##', '#..', '#.#', '#.#', '.##'],
    E: ['###', '#..', '##.', '#..', '###'], C: ['.##', '#..', '#..', '#..', '.##'], K: ['#.#', '#.#', '##.', '#.#', '#.#'], ' ': ['...', '...', '...', '...', '...'] };
  var FIG_W = 52, FIG_H = 124, FIG = {};
  // face: 0 front, 1 side (facing right), 2 back, 3 the other side (side, mirrored)
  SS.figure = function (G, who, face, t) { return figureRaw(SS.lookOf(G, who), SS.outfitOf(G, who), SS.hairColors(G, who), face, t); };
  // any look and outfit (the Creator's cards draw each choice this way)
  SS.figureRaw = function (rawLook, o, H, face, t) { var L = {}; for (var k in rawLook) L[k] = rawLook[k]; L.skin = SS.SKINS[rawLook.skin || 0]; L.eye = SS.EYE_COLORS[rawLook.eye || 0]; L.lip = rawLook.lip !== undefined ? SS.LIP_COLORS[rawLook.lip] : null; return figureRaw(L, o, H, face, t || 0); };
  function figureRaw(L, o, H, face, t) {
    var key = (face === 2 ? 'b' : face % 2 ? 's' : 'f') + '|' + JSON.stringify(o) + '|' + JSON.stringify(L) + '|' + H[1] + '|' + (t % 8 < 4 ? 0 : 1);
    if (FIG[key]) return FIG[key];
    var cv = document.createElement('canvas'); cv.width = FIG_W; cv.height = FIG_H;
    var cx2 = cv.getContext('2d'); draw(cx2, L, o, face === 3 ? 1 : face, t % 8 < 4 ? 0 : 1, H);
    // builds (spec 003, part B): the body widened from the middle out, keeping every pixel crisp
    var BW = { broad: [[38, 96, 2]], curvy: [[66, 100, 2], [46, 66, 1]], sturdy: [[38, 116, 2]] }[L.build];
    if (BW) BW.forEach(function (b) { widen(cx2, b[0], b[1], b[2]); });
    var n = Object.keys(FIG); if (n.length > 80) FIG = {};
    return (FIG[key] = cv);
  }
  function widen(c, y0, y1, k) {
    var src = c.getImageData(0, y0, FIG_W, y1 - y0), out = c.createImageData(FIG_W, y1 - y0), mid = 25;
    for (var y = 0; y < y1 - y0; y++) for (var x = 0; x < FIG_W; x++) {
      var sx = x < mid - k ? x + k : x > mid + k ? x - k : mid, i = (y * FIG_W + x) * 4, j = (y * FIG_W + sx) * 4;
      for (var q = 0; q < 4; q++) out.data[i + q] = src.data[j + q];
    }
    c.putImageData(out, 0, y0);
  }
  function draw(c, L, o, face, bob, H) {
    function R(x, y, w, h, col) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
    function E(cx, cy, rx, ry, col) { for (var yy = -ry; yy <= ry; yy++) { var hw = Math.round(rx * Math.sqrt(Math.max(0, 1 - (yy * yy) / (ry * ry)))); R(cx - hw, cy + yy, hw * 2 + 1, 1, col); } }
    function print(s, cx, y, col, sh) { var w = s.length * 4 - 1, x = Math.round(cx - w / 2); for (var i = 0; i < s.length; i++) { var g = GL[s[i]] || GL[' ']; for (var r = 0; r < 5; r++) for (var q = 0; q < 3; q++) if (g[r][q] === '#') { R(x + i * 4 + q, y + r + 1, 1, 1, sh); R(x + i * 4 + q, y + r, 1, 1, col); } } }
    var S = L.skin || SK, side = face === 1, back = face === 2;
    var col = function (slot) { var w = o[slot]; if (!w) return null; var d = BYID[w.id]; return d ? d.sw[w.sw || 0] || d.sw[0] : null; };
    var kind = function (slot) { var w = o[slot]; return w && BYID[w.id] ? BYID[w.id].kind : null; };
    var T = col('top'), Tk = kind('top'), Cc = col('coat'), B = col('bottom'), Bk = kind('bottom'), Dr = col('dress'), Sh = col('shoes'), Shk = kind('shoes'), Hat = col('hat');
    var longSleeve = Tk === 'flannel' || Tk === 'hoodie' || !!Cc, legsBare = !B || Bk === 'skirt';
    var under = !T && !Dr ? ['#fff8ee', '#f7f3ec', '#e9e2d8', '#cfc6b8'] : null;   // nothing on top: a plain undershirt (never bare)
    if (under) { T = under; }
    if (!B && !Dr) B = ['#fbeedd', '#f3e3d0', '#e3cfb8', '#c9b49a'];   // nothing on the bottom: soft shorts
    var bottomShort = !o.bottom && !Dr;
    // the body's outline pass, then the fill pass (mockups/style-v1: outlines only show on the outside)
    function parts(pass) {
      function r(px, py, w, h, cc) { if (pass === 0) R(px - 1, py - 1, w + 2, h + 2, INK); else R(px, py, w, h, cc); }
      function e(cx, cy, rx, ry, cc) { if (pass === 0) E(cx, cy, rx + 1, ry + 1, INK); else E(cx, cy, rx, ry, cc); }
      var legs = function () {
        if (side) { r(20, 80, 10, 29, legsBare ? S[2] : B[2]); r(18, 80, 10, 29, legsBare ? S[1] : B[1]); return; }
        if (legsBare) { r(15, 80, 8, 29, S[1]); r(27, 80, 8, 29, S[2]); }
        else { r(14, 80, 10, 29, B[1]); r(26, 80, 10, 29, B[2]); }
        if (bottomShort) { r(14, 76, 10, 12, B[1]); r(26, 76, 10, 12, B[2]); }
      };
      var shoes = function () {
        var s = Sh || S;
        if (side) { r(17, 107, 15, 9, s[1]); return; }
        r(13, 107, 12, 9, s[1]); r(25, 107, 12, 9, s[2]);
      };
      legs(); shoes();
      // arms
      var armC = longSleeve ? (Cc || T) : null;
      if (!side) {
        if (armC) { r(5, 45 + bob, 8, 33, armC[1]); r(37, 45 + bob, 8, 33, armC[2]); }
        else { r(5, 48 + bob, 6, 30, S[1]); r(39, 48 + bob, 6, 30, S[2]); }
        e(8, 79 + bob, 3, 3, S[1]); e(42, 79 + bob, 3, 3, S[2]);
      }
      // the bottom's waist, a skirt or a dress
      if (Dr) {
        if (side) { r(17, 44 + bob, 16, 30, Dr[1]); for (var k = 0; k < 22; k++) r(17 - Math.floor(k / 5), 72 + k, 16 + Math.floor(k / 5) * 2, 1, Dr[1]); }
        else { r(13, 44 + bob, 24, 30, Dr[1]); for (var k2 = 0; k2 < 22; k2++) r(13 - Math.floor(k2 / 4), 72 + k2, 24 + Math.floor(k2 / 4) * 2, 1, Dr[1]); }
      } else if (Bk === 'skirt') {
        if (side) for (var q = 0; q < 20; q++) r(17 - Math.floor(q / 4), 72 + q, 16 + Math.floor(q / 4) * 2, 1, B[1]);
        else for (var q2 = 0; q2 < 20; q2++) r(12 - Math.floor(q2 / 4), 72 + q2, 26 + Math.floor(q2 / 4) * 2, 1, B[1]);
      } else if (side) r(17, 72, 16, 10, B[1]); else r(13, 72, 24, 10, B[1]);
      // the top
      if (!Dr) {
        if (side) { r(17, 44 + bob, 16, 31, T[1]); if (!longSleeve) r(20, 45 + bob, 10, 12, T[1]); }
        else { r(12, 44 + bob, 26, 31, T[1]); if (!longSleeve) { r(5, 45 + bob, 9, 12, T[1]); r(36, 45 + bob, 9, 12, T[1]); } }
      }
      // a coat over it: long, to the knee
      if (Cc) { if (side) r(16, 43 + bob, 18, 52, Cc[1]); else r(11, 43 + bob, 28, 52, Cc[1]); }
      // from the side, the near arm hangs in front of the body
      if (side) { if (armC) r(21, 45 + bob, 8, 33, armC[2]); else { r(22, 48 + bob, 6, 30, S[1]); if (!Dr) r(20, 45 + bob, 10, 12, T[1]); } e(25, 79 + bob, 3, 3, S[1]); }
      // neck and head (the hair behind it first)
      if (side) r(22, 37, 7, 9, S[2]); else r(21, 37, 8, 9, S[2]);
      hairBack(pass, e, r);
      var hs = { round: [12, 13], oval: [11, 14], heart: [12, 12], square: [12, 12] }[L.face] || [12, 13];
      if (side) { e(26, 25, hs[0] - 1, hs[1], S[1]); r(36, 26, 2, 3, S[1]); if (L.face === 'square') r(20, 28, 15, 9, S[1]); }
      else { e(25, 25, hs[0], hs[1], S[1]); if (L.face === 'square') r(14, 27, 23, 9, S[1]); if (L.face === 'heart') e(25, 31, 9, 7, S[1]); }
    }
    function hairBack(pass, e, r) {
      var st = o.hair;
      if (st === 'buzz' || st === 'crop') { if (side) e(25, 21, 12, 11, H[2]); else e(25, 21, 13, 11, H[2]); return; }
      if (st === 'pinned') { e(25, 7, 8, 5, H[1]); if (side) { e(19, 5, 6, 5, H[1]); e(23, 24, 15, 16, H[2]); } else e(25, 24, 17, 16, H[2]); if (!side) [[10, 33], [12, 37], [15, 39], [35, 39], [38, 37], [40, 33]].forEach(function (q) { e(q[0], q[1], 3, 3, H[2]); }); }
      if (st === 'bob') { if (side) { e(23, 22, 14, 14, H[2]); r(11, 22, 18, 16, H[2]); } else { e(25, 22, 16, 15, H[2]); r(9, 22, 32, 16, H[2]); } }
      if (st === 'curls') { if (side) { e(22, 24, 15, 16, H[2]); e(18, 44, 9, 14, H[2]); } else { e(25, 24, 17, 16, H[2]); e(12, 44, 6, 14, H[2]); e(38, 44, 6, 14, H[2]); if (back) e(25, 44, 14, 14, H[2]); } }
      if (st === 'pony') { if (side) { e(24, 22, 14, 14, H[2]); r(8, 18, 6, 26, H[2]); } else { e(25, 22, 14, 14, H[2]); if (back) r(22, 30, 6, 24, H[2]); } }
      if (st === 'straight') { if (side) { e(23, 22, 14, 14, H[2]); r(11, 20, 14, 34, H[2]); } else { e(25, 22, 16, 15, H[2]); r(9, 22, 32, 32, H[2]); } }
      if (st === 'afro') { if (side) e(23, 20, 18, 18, H[2]); else e(25, 20, 21, 19, H[2]); }
      if (st === 'bun') { e(25, 3, 7, 6, H[1]); if (side) e(24, 22, 13, 14, H[2]); else e(25, 22, 14, 14, H[2]); }
      if (st === 'braids') { if (side) { e(24, 22, 14, 14, H[2]); r(14, 26, 6, 30, H[2]); } else { e(25, 22, 14, 14, H[2]); r(10, 26, 6, 32, H[2]); r(34, 26, 6, 32, H[2]); } }
      if (st === 'locs') { if (side) { e(23, 22, 15, 15, H[2]); r(10, 22, 16, 30, H[2]); } else { e(25, 22, 16, 15, H[2]); r(8, 22, 34, 30, H[2]); } }
    }
    // braids and locs: little stacked loops and ropes, light on the left, shade on the right
    function braid(x, y0, y1, dark, lite) { for (var y = y0; y < y1; y += 4) { R(x, y, 5, 3, lite); R(x + 1, y + 3, 3, 1, dark); R(x + 3, y, 2, 3, dark); } R(x + 1, y1, 3, 2, '#7fa7a0'); }
    function ropes(x0, x1, y0, y1, dark, lite) { for (var x = x0; x < x1; x += 3) { R(x, y0, 1, y1 - y0 - (x % 2) * 3, dark); R(x + 1, y0 + 1, 1, y1 - y0 - 3 - (x % 2) * 3, lite); } }
    E(26, 117, 20, 4, 'rgba(90,45,40,.25)');
    parts(0); parts(1);
    // ---------- shading and detail ----------
    // legs: jeans light and inseam (style-v1), bare legs a soft shade
    if (!legsBare) {
      if (side) { R(19, 82, 2, 26, B[0]); R(27, 82, 1, 26, B[3]); }
      else { R(15, 82, 3, 26, B[0]); R(27, 82, 2, 26, B[1]); R(24, 80, 2, 28, B[3]); R(24, 96, 2, 20, INK); R(24, 96, 2, 1, B[3]); }
    } else { if (side) R(19, 92, 2, 16, S[0]); else { R(16, 92, 2, 16, S[0]); R(33, 92, 1, 16, S[3]); } }
    if (!Dr && Bk !== 'skirt') {
      if (side) { R(17, 80, 16, 1, B[3]); R(29, 73, 2, 6, B[2]); }
      else { R(13, 80, 24, 1, B[3]); R(24, 73, 1, 7, B[3]); R(22, 73, 6, 2, back ? B[2] : '#e7bb4f'); if (back) { R(15, 82, 7, 6, B[2]); R(28, 82, 7, 6, B[3]); R(15, 82, 7, 1, B[3]); R(28, 82, 7, 1, INK); } }
    }
    if (Bk === 'skirt' && !Dr) { for (var pl = 0; pl < 7; pl++) { var px = side ? 15 + pl * 3 : 10 + pl * 5; R(px, 74, 1, 17, B[2]); R(px + 1, 74, 1, 17, B[0]); } R(side ? 12 : 8, 91, side ? 26 : 34, 1, B[3]); }
    // shoes
    var s2 = Sh || S;
    if (Shk === 'boots') { if (side) { R(18, 107, 5, 3, s2[0]); R(17, 114, 15, 2, s2[3]); } else { R(14, 107, 4, 3, s2[0]); R(13, 114, 12, 2, s2[3]); R(25, 114, 12, 2, s2[3]); } }
    if (Shk === 'hightops') {
      var sole = s2[3];
      if (side) { R(17, 113, 15, 3, '#f3efe8'); R(17, 115, 15, 1, sole); R(30, 111, 2, 3, '#f3efe8'); for (var la = 0; la < 3; la++) R(21 + la * 3, 108 + la, 2, 1, '#f3efe8'); }
      else { [13, 25].forEach(function (sx) { R(sx, 113, 12, 3, '#f3efe8'); R(sx, 115, 12, 1, sole); R(sx + 4, 108, 4, 1, '#f3efe8'); R(sx + 4, 110, 4, 1, '#f3efe8'); R(sx + 2, 109, 2, 3, '#d9d2c6'); }); }
    }
    if (!Sh) { if (side) R(17, 114, 15, 2, S[2]); else { R(13, 114, 12, 2, S[2]); R(25, 114, 12, 2, S[3]); } }
    // arms
    if (!longSleeve) { if (side) R(23, 58 + bob, 2, 18, S[0]); else { R(6, 58 + bob, 2, 18, S[0]); R(42, 58 + bob, 2, 18, S[3]); } }
    // the top
    if (!Dr) {
      if (side) {
        R(17, 44 + bob, 4, 29, T[0]); R(30, 46 + bob, 3, 29, T[2]); R(17, 74, 16, 1, T[3]);
        if (!longSleeve) { R(20, 56 + bob, 10, 1, T[3]); R(20, 45 + bob, 3, 11, T[0]); }
      } else {
        R(12, 44 + bob, 5, 29, T[0]); R(32, 46 + bob, 6, 29, T[2]); R(13, 74, 24, 1, T[3]);
        if (!longSleeve) { R(5, 45 + bob, 4, 11, T[0]); R(39, 45 + bob, 6, 11, T[2]); R(5, 56 + bob, 9, 1, T[3]); R(36, 56 + bob, 9, 1, T[3]); R(11, 46 + bob, 1, 10, INK); R(38, 46 + bob, 1, 10, INK); }
        if (!back) { R(20, 44 + bob, 10, 2, T[3]); R(21, 44 + bob, 8, 1, S[2]); } else R(21, 44 + bob, 8, 1, T[3]);
      }
      if (Tk === 'flannel') { // tartan lines over a white tee showing at the front
        var x0 = side ? 17 : 12, w0 = side ? 16 : 26;
        for (var yy = 47; yy < 74; yy += 5) R(x0, yy + bob, w0, 1, '#b8434a');
        for (var xx = x0 + 3; xx < x0 + w0; xx += 6) R(xx, 44 + bob, 1, 30, '#e9e4dc');
        if (!back && !side) { R(22, 44 + bob, 6, 30, '#f7f3ec'); R(21, 44 + bob, 1, 30, T[3]); R(28, 44 + bob, 1, 30, T[3]); }
        var ax0 = side ? 21 : 5, aw = side ? 8 : 8; if (!Cc) for (var ay = 50; ay < 78; ay += 5) { R(ax0, ay + bob, aw, 1, '#b8434a'); if (!side) R(37, ay + bob, 8, 1, '#8e2f36'); }
      }
      if (Tk === 'hoodie') {
        if (!back && !side) { R(19, 60 + bob, 12, 8, T[2]); R(19, 60 + bob, 12, 1, T[3]); R(22, 44 + bob, 1, 9, '#fff8ee'); R(27, 44 + bob, 1, 9, '#fff8ee'); }
        if (back) { R(16, 40, 18, 9, T[2]); R(17, 41, 16, 1, T[1]); }
        if (side) { R(16, 40, 8, 10, T[2]); R(20, 58 + bob, 8, 7, T[2]); }
        if (!Cc) { if (side) R(21, 76 + bob, 8, 2, T[3]); else { R(5, 76 + bob, 8, 2, T[3]); R(37, 76 + bob, 8, 2, T[3]); } }
      }
      var d0 = o.top && BYID[o.top.id];
      if (d0 && d0.print && !side) d0.print[back ? 'back' : 'front'].forEach(function (s, i) { print(s, 25, 52 + bob + i * 8, d0.print.col, T[3]); });
    }
    if (Dr) {
      if (side) { R(17, 44 + bob, 4, 28, Dr[0]); R(30, 46 + bob, 3, 28, Dr[2]); }
      else { R(13, 44 + bob, 5, 28, Dr[0]); R(32, 46 + bob, 5, 28, Dr[2]); for (var dk = 0; dk < 22; dk += 4) { R(13 - dk / 4 + 2, 74 + dk, 2, 3, Dr[0]); } R(7, 93, 36, 1, Dr[3]); }
      // thin straps over bare shoulders (front and back)
      if (!side) { R(13, 38 + bob, 24, 6, S[1]); R(15, 38 + bob, 2, 6, Dr[2]); R(33, 38 + bob, 2, 6, Dr[2]); if (!back) { R(18, 44 + bob, 14, 2, Dr[2]); } }
      else { R(19, 38 + bob, 12, 6, S[1]); R(23, 38 + bob, 2, 6, Dr[2]); }
    }
    if (Cc) {
      if (side) { R(16, 43 + bob, 4, 50, Cc[0]); R(31, 45 + bob, 3, 48, Cc[2]); R(16, 94, 18, 1, Cc[3]); R(21, 45 + bob, 8, 33, Cc[2]); R(21, 76 + bob, 8, 1, Cc[3]); }
      else {
        R(11, 43 + bob, 6, 50, Cc[0]); R(33, 45 + bob, 6, 48, Cc[2]); R(11, 94, 28, 1, Cc[3]);
        if (!back) { R(21, 43 + bob, 8, 26, T ? T[1] : S[1]); R(20, 43 + bob, 1, 50, Cc[3]); R(29, 43 + bob, 1, 50, Cc[3]); R(17, 43 + bob, 4, 8, Cc[0]); R(29, 43 + bob, 4, 8, Cc[2]); [56, 64, 72].forEach(function (by) { R(30, by + bob, 2, 2, Cc[3]); }); if (Dr) R(21, 43 + bob, 8, 26, Dr[1]); }
        else { R(24, 70, 2, 24, Cc[3]); R(16, 66, 18, 1, Cc[3]); }
        R(5, 76 + bob, 8, 2, Cc[3]); R(37, 76 + bob, 8, 2, Cc[3]);
      }
    }
    // ---------- the head (the look: Sarah's and Keegan's own faces, or a made person's parts, spec 003) ----------
    var st = o.hair, isK = !!L.beard, EC = L.eye || ['#7f9fae', '#5d7c8a'], lipC = L.lip || '#c8707c';
    if (side) {
      E(28, 22, 5, 5, S[0]);
      var es = L.eyes === 'small' ? 2 : L.eyes === 'round' ? 4 : 3;
      R(30, 23, 3, es, '#fbf7f4'); R(31, 23, 2, es, EC[0]); R(31, 23, 1, 1, '#fff'); R(29, 21, 4, 1, L.brow || H[2]);
      if (L.eyes === 'lashes') R(33, 22, 1, 1, INK); if (L.eyes === 'sleepy') R(30, 23, 3, 1, S[2]);
      if (L.nose === 'long' || L.nose === 'pointed') { R(36, 26, 3, 3, S[1]); R(38, 28, 1, 1, S[2]); } else R(37, 29, 1, 1, S[2]);
      R(33, 33, L.lips === 'small' ? 2 : 3, L.lips === 'full' ? 2 : 1, lipC);
      E(22, 27, 2, 3, S[2]); R(22, 27, 1, 2, S[3]);
      if (L.hoops) R(22, 30, 1, 3, '#e7bb4f');
      if (L.freckles) { [[33, 29], [35, 30]].forEach(function (p) { R(p[0], p[1], 1, 1, '#dc9a7c'); }); }
      if (L.blush) R(32, 31, 2, 1, S[4] || '#f2aaa2');
      if (isK) { R(23, 27, 4, 8, BEARD[1]); E(30, 35, 6, 3, BEARD[1]); R(26, 31, 10, 4, BEARD[1]); R(33, 32, 3, 1, lipC); R(37, 28, 1, 1, '#eef1f3'); for (var bk = 0; bk < 6; bk++) R(25 + bk * 2, 33 + (bk % 2), 1, 1, BEARD[2]); }
      sideHair();
    } else if (!back) {
      E(22, 22, 7, 7, S[0]);
      frontHair();
      R(17, 21, 5, 1, L.brow || H[2]); R(28, 21, 5, 1, L.brow || H[2]);
      [[17, 24], [28, 24]].forEach(function (p) {
        var ex = p[0], ey = p[1];
        if (L.eyes === 'small') { R(ex + 1, ey + 1, 3, 1, INK); R(ex + 1, ey + 2, 3, 2, '#fbf7f4'); R(ex + 2, ey + 2, 2, 2, EC[0]); R(ex + 2, ey + 2, 1, 1, '#fff'); return; }
        R(ex, ey, 5, 1, INK); R(ex, ey + 1, 5, 3, '#fbf7f4'); R(ex + 1, ey + 1, 3, 3, EC[0]); R(ex + 2, ey + 2, 1, 2, EC[1]); R(ex + 1, ey + 1, 1, 1, '#fff'); R(ex, ey + 4, 5, 1, S[2]);
        if (L.eyes === 'round') { R(ex, ey + 4, 5, 1, '#fbf7f4'); R(ex + 1, ey + 4, 3, 1, EC[1]); R(ex, ey + 5, 5, 1, S[2]); }
        if (L.eyes === 'sleepy') R(ex, ey + 1, 5, 1, S[2]);
        if (L.eyes === 'lashes') { R(ex - 1, ey - 1, 1, 1, INK); R(ex + 5, ey - 1, 1, 1, INK); R(ex + 2, ey - 1, 1, 1, INK); }
      });
      if (L.nose === 'long') { R(24, 26, 2, 5, S[2]); R(23, 31, 4, 1, S[3]); }
      else if (L.nose === 'wide') { R(24, 28, 2, 2, S[2]); R(22, 30, 6, 1, S[3]); R(22, 29, 1, 1, S[2]); R(27, 29, 1, 1, S[2]); }
      else if (L.nose === 'pointed') { R(25, 26, 1, 4, S[2]); R(24, 30, 3, 1, S[3]); }
      else { R(24, 28, 2, 3, S[2]); R(23, 31, 4, 1, S[3]); }
      if (isK) {
        E(25, 33, 11, 6, BEARD[1]); R(14, 27, 3, 6, BEARD[1]); R(33, 27, 3, 6, BEARD[1]); E(25, 31, 6, 2, S[1]);
        for (var bq = 0; bq < 9; bq++) R(16 + bq * 2, 34 + (bq % 2), 1, 1, BEARD[2]);
        R(21, 33, 8, 1, BEARD[3]); R(21, 34, 8, 1, lipC); R(27, 29, 1, 1, '#eef1f3');   // his mouth and nose stud
      } else {
        if (L.freckles) [[18, 30], [20, 31], [30, 30], [32, 31], [22, 29], [28, 29]].forEach(function (p) { R(p[0], p[1], 1, 1, '#dc9a7c'); });
        if (L.blush !== false) { R(16, 31, 3, 1, S[4] || '#f2aaa2'); R(31, 31, 3, 1, S[4] || '#f2aaa2'); }
        if (L.lips === 'full') { R(21, 33, 8, 2, lipC); R(22, 35, 6, 1, lipC); R(22, 34, 6, 1, '#00000022'); R(23, 33, 4, 1, '#ffffff33'); }
        else if (L.lips === 'small') { R(23, 34, 4, 1, lipC); R(23, 35, 4, 1, S[2]); }
        else if (L.lips === 'soft') { R(21, 34, 8, 1, lipC); R(22, 35, 6, 1, S[2]); }
        else { R(21, 34, 8, 1, lipC); R(22, 35, 6, 1, '#fffaf2'); R(20, 33, 1, 1, lipC); R(29, 33, 1, 1, lipC); }
        if (L.hoops) { R(13, 29, 1, 3, '#e7bb4f'); R(36, 29, 1, 3, '#e7bb4f'); }   // gold hoops
      }
    } else backHair();
    if (Hat) cap();
    function wave(px, py, len, dark, lite) { for (var k = 0; k < len; k++) { var oo = [0, 1, 1, 0, -1, -1][k % 6]; R(px + oo, py + k, 1, 1, dark); if (lite) R(px + oo - 1, py + k, 1, 1, lite); } }
    function frontHair() {
      if (st === 'bald') return;
      if (st === 'buzz' || st === 'crop') {
        R(14, 12, 22, 4, H[2]); R(13, 14, 3, 6, H[2]); R(34, 14, 3, 6, H[2]); R(16, 12, 18, 1, H[1]);
        if (st === 'crop') { R(15, 11, 20, 3, H[1]); R(18, 14, 6, 2, H[2]); R(26, 14, 7, 2, H[1]); }
        return;
      }
      R(13, 12, 24, 4, H[2]); R(24, 12, 2, 2, S[1]);
      if (st === 'pinned') { R(14, 15, 6, 3, H[2]); R(31, 15, 6, 3, H[3]); R(12, 15, 3, 14, H[2]); R(35, 15, 3, 14, H[3]); R(15, 13, 7, 1, H[1]); R(28, 13, 7, 1, H[1]); R(20, 4, 6, 2, H[0]); wave(11, 20, 16, H[3], H[1]); wave(15, 26, 12, H[3], null); wave(38, 20, 16, H[3], H[1]); wave(34, 26, 12, H[3], null); }
      if (st === 'bob') { R(13, 14, 24, 5, H[2]); R(15, 14, 8, 1, H[1]); R(10, 19, 5, 19, H[2]); R(35, 19, 5, 19, H[3]); R(10, 37, 30, 1, H[3]); R(11, 20, 2, 15, H[1]); }
      if (st === 'curls') { R(14, 15, 6, 3, H[2]); R(31, 15, 6, 3, H[3]); R(12, 15, 3, 20, H[2]); R(35, 15, 3, 20, H[3]); R(15, 13, 7, 1, H[1]); R(28, 13, 7, 1, H[1]); wave(9, 26, 30, H[3], H[1]); wave(13, 30, 26, H[3], null); wave(40, 26, 30, H[3], H[1]); wave(37, 30, 26, H[3], null); }
      if (st === 'pony') { R(13, 14, 24, 3, H[2]); R(15, 13, 7, 1, H[1]); R(28, 13, 7, 1, H[1]); R(12, 15, 3, 10, H[2]); R(35, 15, 3, 10, H[3]); }
      if (st === 'straight') { R(13, 14, 24, 3, H[2]); R(15, 13, 7, 1, H[1]); R(10, 16, 5, 37, H[2]); R(35, 16, 5, 37, H[3]); R(11, 18, 1, 32, H[1]); R(38, 18, 1, 32, H[3]); R(10, 52, 30, 1, H[3]); }
      if (st === 'afro') { R(11, 11, 28, 5, H[2]); R(9, 14, 5, 16, H[2]); R(36, 14, 5, 16, H[3]); for (var a = 0; a < 14; a++) R(7 + (a * 7) % 36, 4 + (a * 5) % 12, 1, 1, H[(a % 2) ? 1 : 3]); }
      if (st === 'bun') { R(14, 12, 22, 3, H[2]); R(16, 12, 6, 1, H[1]); R(13, 14, 2, 8, H[2]); R(35, 14, 2, 8, H[3]); R(22, 1, 6, 2, H[0]); R(19, 8, 12, 2, '#e46f8b'); }
      if (st === 'braids') { R(13, 14, 24, 3, H[2]); R(24, 12, 2, 4, S[1]); R(12, 15, 3, 10, H[2]); R(35, 15, 3, 10, H[3]); braid(9, 26, 56, H[3], H[1]); braid(36, 26, 56, H[3], H[2]); }
      if (st === 'locs') { R(13, 13, 24, 4, H[2]); ropes(14, 36, 12, 18, H[3], H[1]); R(8, 18, 6, 32, H[2]); R(36, 18, 6, 32, H[3]); ropes(8, 14, 18, 50, H[3], H[1]); ropes(36, 42, 18, 50, H[3], H[2]); }
    }
    function backHair() {
      if (st === 'buzz' || st === 'crop') { E(25, 22, 12, 12, H[2]); E(22, 18, 7, 5, H[1]); R(19, 33, 12, 4, S[2]); R(19, 33, 12, 1, H[3]); for (var i = 0; i < 6; i++) R(16 + i * 3, 20 + (i % 2) * 4, 1, 1, H[3]); return; }
      if (st === 'pinned') {
        E(31, 30, 9, 8, H[3]); E(27, 26, 11, 10, H[2]); E(20, 17, 9, 6, H[1]); E(18, 15, 4, 2, H[0]);
        c.strokeStyle = H[3]; c.lineWidth = 1;
        [[-12, -7], [-7, -4], [-2, -1], [3, 2], [8, 4], [12, 6]].forEach(function (k) { c.beginPath(); c.moveTo(25 + k[0] + .5, 37.5); c.quadraticCurveTo(25 + k[0] * 1.15 + .5, 20, 25 + k[1] + .5, 11.5); c.stroke(); });
        wave(11, 22, 14, H[3], H[1]); wave(38, 22, 14, H[3], null);
        R(22, 39, 6, 4, S[2]); R(22, 39, 6, 1, H[3]); R(19, 9, 12, 2, '#7fa7a0');   // the nape, and the scrunchie under the bun
      }
      if (st === 'bob') { E(25, 22, 15, 14, H[2]); R(10, 22, 30, 15, H[2]); E(21, 16, 8, 5, H[1]); for (var b2 = 12; b2 < 40; b2 += 4) R(b2, 24, 1, 13, H[3]); R(10, 37, 30, 1, H[3]); }
      if (st === 'curls') { E(25, 28, 16, 18, H[2]); E(25, 46, 14, 12, H[2]); E(21, 16, 8, 5, H[1]); wave(14, 24, 30, H[3], H[1]); wave(25, 26, 30, H[3], null); wave(35, 24, 30, H[3], H[1]); }
      if (st === 'pony') { E(25, 22, 13, 13, H[2]); E(21, 16, 8, 5, H[1]); R(22, 31, 6, 22, H[2]); R(23, 32, 2, 20, H[1]); R(21, 30, 8, 3, '#7fa7a0'); for (var p2 = 16; p2 < 34; p2 += 4) R(p2, 15, 1, 14, H[3]); R(21, 35, 8, 4, S[2]); }
      if (st === 'bald') { E(21, 17, 5, 3, S[0]); R(19, 34, 12, 3, S[2]); }
      if (st === 'straight') { E(25, 22, 15, 14, H[2]); R(10, 22, 30, 31, H[2]); E(21, 16, 8, 5, H[1]); for (var s3 = 12; s3 < 40; s3 += 3) R(s3, 24, 1, 27, H[3]); R(13, 24, 1, 26, H[1]); R(10, 52, 30, 1, H[3]); }
      if (st === 'afro') { E(25, 20, 20, 18, H[2]); E(19, 12, 9, 6, H[1]); for (var a2 = 0; a2 < 30; a2++) R(8 + (a2 * 11) % 34, 6 + (a2 * 7) % 28, 1, 1, H[(a2 % 3) ? 3 : 0]); }
      if (st === 'bun') { E(25, 22, 13, 13, H[2]); E(21, 16, 8, 5, H[1]); E(25, 3, 7, 6, H[1]); E(23, 1, 3, 2, H[0]); R(19, 8, 12, 2, '#e46f8b'); for (var b4 = 16; b4 < 34; b4 += 4) R(b4, 12, 1, 18, H[3]); R(20, 34, 10, 4, S[2]); }
      if (st === 'braids') { E(25, 22, 13, 13, H[2]); E(21, 16, 8, 5, H[1]); R(24, 10, 2, 24, H[3]); braid(14, 30, 58, H[3], H[1]); braid(31, 30, 58, H[3], H[2]); R(21, 35, 8, 4, S[2]); }
      if (st === 'locs') { E(25, 22, 15, 14, H[2]); R(9, 22, 32, 28, H[2]); ropes(9, 41, 12, 50, H[3], H[1]); }
    }
    function sideHair() {
      if (st === 'bald') { E(22, 16, 4, 2, S[0]); return; }
      if (st === 'buzz' || st === 'crop') { E(24, 19, 11, 8, H[2]); R(15, 14, 20, 4, H[2]); R(16, 14, 14, 1, H[1]); R(15, 18, 5, 9, H[2]); if (st === 'crop') R(18, 12, 16, 3, H[1]); return; }
      R(16, 12, 20, 5, H[2]); R(18, 12, 12, 1, H[1]); R(14, 15, 7, 16, H[2]); R(15, 16, 2, 12, H[1]);
      if (st === 'pinned') { E(19, 6, 6, 5, H[1]); R(17, 9, 6, 2, '#7fa7a0'); wave(14, 22, 16, H[3], H[1]); }
      if (st === 'bob') { R(12, 17, 12, 20, H[2]); R(12, 37, 12, 1, H[3]); R(31, 15, 5, 4, H[2]); }
      if (st === 'curls') { wave(13, 22, 30, H[3], H[1]); wave(17, 26, 28, H[3], null); }
      if (st === 'pony') { R(9, 18, 6, 26, H[2]); R(10, 19, 2, 24, H[1]); R(13, 17, 4, 3, '#7fa7a0'); }
      if (st === 'straight') { R(11, 17, 13, 36, H[2]); R(12, 18, 2, 32, H[1]); R(11, 52, 13, 1, H[3]); }
      if (st === 'afro') { E(22, 18, 16, 15, H[2]); E(18, 11, 8, 5, H[1]); for (var a3 = 0; a3 < 16; a3++) R(8 + (a3 * 7) % 26, 5 + (a3 * 5) % 24, 1, 1, H[3]); }
      if (st === 'bun') { E(24, 3, 6, 5, H[1]); R(21, 8, 8, 2, '#e46f8b'); }
      if (st === 'braids') braid(14, 28, 56, H[3], H[1]);
      if (st === 'locs') { R(10, 17, 15, 34, H[2]); ropes(10, 25, 17, 51, H[3], H[1]); }
    }
    function cap() { // a cap sits over the hair and hides its top (Claude default)
      var K = Hat;
      if (side) { E(25, 14, 12, 6, INK); E(25, 14, 11, 5, K[1]); R(14, 15, 23, 4, K[1]); R(14, 18, 23, 1, K[2]); R(34, 17, 9, 2, K[3]); R(34, 19, 9, 1, INK); R(18, 10, 6, 2, K[0]); return; }
      E(25, 14, 14, 7, INK); E(25, 14, 13, 6, K[1]); R(12, 15, 26, 5, K[1]); R(12, 19, 26, 1, K[2]); R(17, 9, 8, 3, K[0]); R(24, 8, 2, 2, K[2]);
      if (!back) { R(13, 20, 24, 3, K[3]); R(13, 22, 24, 1, INK); } else { R(21, 17, 8, 3, '#d9d2c6'); R(22, 18, 6, 1, K[2]); }
    }
  }

  // ---------- opening and closing ----------
  SS.openStyle = function (G, who) {
    if (G.away || G.gig) { G.toast('NOBODY LIVES HERE YET', 1600, 'Sarah and Keegan dress up at home.'); return; }
    G.bubble = null; G.meters = null; if (G.cancelHold) G.cancelHold(false); G.deselect();
    owned(G);
    G.menu = { kind: 'style', who: who || 'sarah', face: 0, tab: 'tops', page: 0, cur: 0, happy: 0 };
  };
  SS.closeStyle = function (G) { G.menu = null; G.changed(true); };
  SS.spinStyle = function (G, d) { var m = G.menu; m.face = (m.face + (d || 1) + 4) % 4; };
  SS.ralphBow = function (G) {
    var on = !G.save.ralphBow;
    G.confirm = { title: 'RALPH\'S BOWTIE', text: on ? 'A red bowtie with a little silver bell. Put it on?' : 'Take Ralph\'s bowtie off?', options: ['NOT NOW', on ? 'BOWTIE ON' : 'BOWTIE OFF'], cur: 0, pick: function (i) { if (i === 1) { G.save.ralphBow = on; G.changed(true); G.toast(on ? 'BOWTIE ON' : 'BOWTIE OFF', 1000); } } };
  };
  // the cards for a tab: pieces, or hairstyles (and, for anyone but Sarah, hair colors)
  SS.styleCards = function (G, who, tab) {
    if (tab === 'hair') {
      var out = hairOf(who).map(function (h) { return { hair: h, name: HAIR[h] }; });
      if (who !== 'sarah') SHADES.forEach(function (s, i) { out.push({ shade: i, name: 'COLOR ' + (i + 1) }); });
      return out;
    }
    return PIECES.filter(function (d) { return tab === 'ours' ? d.ours : tab === 'holiday' ? d.holiday : d.tab === tab; }).map(function (d) { return { piece: d, name: d.name }; });
  };
  function pickCard(G, it) {
    var m = G.menu;
    if (it.hair) SS.setHair(G, m.who, it.hair);
    else if (it.shade !== undefined) SS.setHair(G, m.who, null, it.shade);
    else if (it.piece) SS.wear(G, m.who, it.piece.id);
  }
  SS.stylePick = pickCard;

  // ---------- drawing ----------
  SS.styleBackdrop = function (c, W, top, bottom, t) { return backdrop(c, W, top, bottom, t); };
  function backdrop(c, W, top, bottom, t) {
    var R = SS.R;
    R(0, top, W, bottom - top, '#f3d2c4');
    for (var i = 0; i < W; i += 12) R(i, top, 6, bottom - top, '#efc8b9');
    for (var j = top + 8; j < bottom - 40; j += 22) for (var k = (j / 22) % 2 ? 9 : 3; k < W; k += 12) R(k, j, 1, 1, '#e7a9b4');
    for (var f = 6; f < W; f += 14) { var fy = top + 6 + Math.round(Math.sin(f / 9) * 3), on = (Math.floor(t / 2) + f / 14) % 5 !== 0; if (on) { c.fillStyle = 'rgba(255,225,150,.45)'; c.beginPath(); c.arc(f, fy, 3, 0, 7); c.fill(); } R(f - 1, fy - 1, 2, 2, on ? '#ffd56b' : '#c9a7a0'); }
    var fl = bottom - 34;
    R(0, fl - 16, W, 16, '#fff1e2'); R(0, fl - 16, W, 1, '#fffaf3'); for (var p = 6; p < W; p += 24) R(p, fl - 12, 18, 9, '#f6e6d6');
    R(0, fl, W, 34, '#d39a66'); for (var q = fl + 6; q < bottom; q += 7) R(0, q, W, 1, '#93603c'); for (var z = 0; z < 8; z++) R((z * 37 + (z % 2) * 15) % W, fl + 7 * (z % 4) + 1, 1, 6, '#93603c');
    var E = function (cx, cy, rx, ry, col) { for (var yy = -ry; yy <= ry; yy++) { var hw = Math.round(rx * Math.sqrt(Math.max(0, 1 - (yy * yy) / (ry * ry)))); R(cx - hw, cy + yy, hw * 2 + 1, 1, col); } };
    E(W / 2, fl + 20, 52, 11, '#c78f3e'); E(W / 2, fl + 20, 49, 10, '#e7b75f'); E(W / 2, fl + 20, 38, 7, '#f3d38a'); E(W / 2, fl + 20, 22, 4, '#f39bb0');
    var mx = W / 2, my = fl - 70;
    E(mx, my, 40, 56, '#55311d'); E(mx, my, 38, 54, '#b9804f'); E(mx, my, 36, 52, '#8e5a37'); E(mx, my, 34, 50, '#cfe1ec'); E(mx - 6, my - 6, 26, 40, '#ddeaf2');
    c.fillStyle = 'rgba(255,255,255,.6)'; for (var s = 0; s < 3; s++) c.fillRect(mx - 26 + s * 6, my - 30 + s * 2, 3, 18);
    R(12, fl - 14, 14, 14, '#d98a6f'); R(12, fl - 14, 14, 2, '#e8a28c'); E(19, fl - 22, 10, 8, '#6aa361'); E(16, fl - 25, 5, 4, '#8fc47b'); E(23, fl - 18, 4, 3, '#437a47');
    return fl;
  }
  // a card's picture: the piece as a little flat shape, in its first colors (style-v1's clothing icons)
  function icon(c, it, x, y, G, who) {
    var R = SS.R;
    if (it.hair || it.shade !== undefined) { // a little head with the hairstyle, or a lock of that color
      var H = it.shade !== undefined ? SHADES[it.shade] : SS.hairColors(G, who), h = it.hair;
      if (it.shade !== undefined) { c.fillStyle = INK; c.beginPath(); c.arc(x + 13, y + 10, 8, 0, 7); c.fill(); c.fillStyle = H[1]; c.beginPath(); c.arc(x + 13, y + 10, 7, 0, 7); c.fill(); R(x + 9, y + 5, 4, 3, H[0]); return; }
      var E = function (cx, cy, rx, ry, col) { for (var yy = -ry; yy <= ry; yy++) { var hw = Math.round(rx * Math.sqrt(Math.max(0, 1 - (yy * yy) / (ry * ry)))); R(cx - hw, cy + yy, hw * 2 + 1, 1, col); } };
      if (h === 'pinned') { E(x + 13, y + 3, 4, 3, H[1]); E(x + 13, y + 10, 9, 8, H[2]); }
      if (h === 'bob') { E(x + 13, y + 9, 9, 8, H[2]); R(x + 4, y + 9, 18, 9, H[2]); }
      if (h === 'curls') { E(x + 13, y + 10, 10, 9, H[2]); R(x + 3, y + 10, 5, 10, H[2]); R(x + 18, y + 10, 5, 10, H[2]); }
      if (h === 'pony') { E(x + 13, y + 9, 8, 8, H[2]); R(x + 19, y + 7, 4, 12, H[2]); }
      if (h === 'buzz' || h === 'crop') E(x + 13, y + 8, 8, 6, H[2]);
      if (h === 'straight' || h === 'locs') { E(x + 13, y + 9, 9, 8, H[2]); R(x + 4, y + 9, 18, 13, H[2]); if (h === 'locs') for (var lx = 5; lx < 22; lx += 3) R(x + lx, y + 10, 1, 11, H[3]); }
      if (h === 'afro') E(x + 13, y + 9, 12, 9, H[2]);
      if (h === 'bun') { E(x + 13, y + 2, 4, 3, H[1]); E(x + 13, y + 9, 8, 7, H[2]); }
      if (h === 'braids') { E(x + 13, y + 9, 8, 7, H[2]); R(x + 4, y + 10, 3, 12, H[3]); R(x + 19, y + 10, 3, 12, H[3]); }
      E(x + 13, y + 11, 6, 6, SK[1]); if (h !== 'bald') R(x + 8, y + 6, 10, 2, H[h === 'crop' ? 1 : 2]);
      R(x + 10, y + 11, 1, 1, INK); R(x + 15, y + 11, 1, 1, INK);
      return;
    }
    var d = it.piece, K = d.sw[0];
    var box = function (bx, by, w, h, col) { R(x + bx - 1, y + by - 1, w + 2, h + 2, INK); R(x + bx, y + by, w, h, col); };
    if (d.slot === 'top' || d.slot === 'coat') {
      var long = d.kind !== 'tee', tall = d.kind === 'coat' ? 20 : 16;
      R(x + 6, y + 1, 14, tall + 2, INK); R(x, y + 2, 8, (long ? 14 : 7) + 2, INK); R(x + 18, y + 2, 8, (long ? 14 : 7) + 2, INK);
      R(x + 7, y + 2, 12, tall, K[1]); R(x + 1, y + 3, 7, long ? 14 : 7, K[1]); R(x + 18, y + 3, 7, long ? 14 : 7, K[1]);
      R(x + 7, y + 2, 4, tall, K[0]); R(x + 16, y + 3, 3, tall - 1, K[2]); R(x + 10, y + 2, 6, 2, INK); R(x + 11, y + 2, 4, 1, '#fbeedd');
      if (d.kind === 'tee') { R(x + 9, y + 7, 8, 1, '#fff8ee'); R(x + 10, y + 10, 6, 1, '#fff8ee'); }
      if (d.kind === 'flannel') { for (var i = 4; i < 18; i += 4) R(x + 1, y + i, 24, 1, '#b8434a'); R(x + 12, y + 2, 2, 16, '#f7f3ec'); }
      if (d.kind === 'hoodie') { R(x + 9, y, 8, 3, K[2]); R(x + 9, y + 11, 8, 4, K[2]); }
      if (d.kind === 'coat') { R(x + 12, y + 2, 1, tall, K[3]); [7, 12, 17].forEach(function (b) { R(x + 14, y + b, 1, 1, K[3]); }); }
    } else if (d.slot === 'bottom') {
      if (d.kind === 'skirt') { for (var q = 0; q < 14; q++) { R(x + 7 - q / 3 - 1, y + 3 + q, 12 + q / 1.5 + 2, 1, INK); } for (var q2 = 0; q2 < 13; q2++) R(x + 7 - q2 / 3, y + 3 + q2, 12 + q2 / 1.5, 1, K[1]); for (var pl = 0; pl < 5; pl++) R(x + 6 + pl * 3, y + 6, 1, 10, K[2]); }
      else { box(7, 2, 12, 4, K[1]); box(7, 6, 5, 13, K[1]); box(14, 6, 5, 13, K[2]); R(x + 8, y + 7, 2, 11, K[0]); }
    } else if (d.slot === 'dress') {
      for (var r2 = 0; r2 < 18; r2++) { var hw = 4 + Math.floor(r2 / 3); R(x + 13 - hw - 1, y + 1 + r2, hw * 2 + 2, 1, INK); }
      for (var r3 = 0; r3 < 17; r3++) { var hw2 = 4 + Math.floor(r3 / 3); R(x + 13 - hw2, y + 2 + r3, hw2 * 2, 1, K[1]); }
      R(x + 9, y, 1, 3, K[2]); R(x + 16, y, 1, 3, K[2]); R(x + 10, y + 4, 3, 12, K[0]);
    } else if (d.slot === 'shoes') {
      box(4, 6, 6, 8, K[1]); box(4, 13, 11, 5, K[1]); box(15, 6, 6, 8, K[2]); box(15, 13, 11, 5, K[2]);
      if (d.kind === 'hightops') { R(x + 4, y + 16, 11, 2, '#f3efe8'); R(x + 15, y + 16, 11, 2, '#f3efe8'); R(x + 6, y + 8, 2, 4, '#f3efe8'); }
    } else if (d.slot === 'hat') {
      R(x + 5, y + 5, 16, 9, INK); R(x + 6, y + 6, 14, 7, K[1]); R(x + 8, y + 4, 10, 2, INK); R(x + 9, y + 4, 8, 3, K[1]); R(x + 6, y + 13, 18, 3, INK); R(x + 7, y + 13, 16, 2, K[3]); R(x + 9, y + 7, 4, 2, K[0]);
    }
  }
  function tabIcon(i, x, y, on) {
    var R = SS.R, k = on ? '#fff' : P.ink, k2 = on ? '#ffd9e2' : P.soft;   // mockups/style-v1
    [function () { R(x + 1, y + 1, 10, 4, k); R(x + 2, y + 5, 2, 5, k); R(x + 9, y + 5, 2, 5, k); R(x + 4, y + 4, 5, 3, k2); },
      function () { R(x + 3, y + 1, 7, 9, k); R(x, y + 2, 3, 4, k); R(x + 10, y + 2, 3, 4, k); R(x + 5, y + 1, 3, 1, k2); },
      function () { R(x + 2, y + 1, 9, 3, k); R(x + 2, y + 4, 4, 6, k); R(x + 7, y + 4, 4, 6, k); },
      function () { R(x + 4, y + 1, 5, 4, k); R(x + 3, y + 5, 7, 2, k); R(x + 2, y + 7, 9, 3, k); },
      function () { R(x + 2, y + 2, 4, 5, k); R(x + 2, y + 7, 9, 3, k); R(x + 7, y + 6, 2, 1, k2); },
      function () { R(x + 1, y + 5, 11, 2, k); R(x + 3, y + 2, 7, 3, k); R(x + 5, y + 7, 3, 3, k2); },
      function () { SS.heart(x + 3, y + 2, on ? '#fff' : P.rose); },
      function () { R(x + 6, y + 1, 1, 2, k); R(x + 4, y + 3, 5, 2, k); R(x + 1, y + 4, 11, 2, k); R(x + 3, y + 6, 7, 2, k); R(x + 2, y + 8, 3, 2, k); R(x + 8, y + 8, 3, 2, k); }
    ][i]();
  }
  SS.STYLE_TRAY = 112;
  SS.drawStyle = function (G, W, H) {
    var c = G.c, m = G.menu, R = SS.R, txt = SS.txt, hit = SS.hit, t = G.t, now = performance.now();
    var trayTop = H - SS.STYLE_TRAY;
    hit(G, 0, 0, W, H, function () {}, { block: true });
    var fl = backdrop(c, W, 0, trayTop, t);
    // the person, with a little happy hop when something new goes on (Claude default)
    var hop = m.happy && now - m.happy < 420 ? Math.round(Math.sin((now - m.happy) / 420 * Math.PI) * 5) : 0;
    var img = SS.figure(G, m.who, m.face, t), fx = Math.round(W / 2 - FIG_W / 2), fy = fl + 22 - FIG_H + 4 - hop;
    if (m.face === 3) { c.save(); c.translate(fx + FIG_W, fy); c.scale(-1, 1); c.drawImage(img, 0, 0); c.restore(); } else c.drawImage(img, fx, fy);
    if (hop > 2) { SS.heart(fx + 4, fy + 6 - hop, P.rose); SS.heart(fx + FIG_W - 10, fy + 2 - hop, P.roseHi); }
    m.fig = { x: fx, y: fy, w: FIG_W, h: FIG_H };
    // a swipe across the person spins them (game.js); the arrows spin a quarter turn
    var ay = Math.min(trayTop - 70, fy + 60);
    SS.chip(8, ay, '‹', 22); hit(G, 2, ay - 6, 34, 26, function () { SS.spinStyle(G, -1); });
    SS.chip(W - 30, ay, '›', 22); hit(G, W - 36, ay - 6, 34, 26, function () { SS.spinStyle(G, 1); });
    SS.drawTopBar(G, W);
    // the name opens the people in this home; the heart and camera (part E)
    var cy = 26, name = SS.personName(G, m.who), nw = SS.tw(name, 7) + 22;
    R(W / 2 - nw / 2, cy, nw, 15, '#fff6ea'); R(W / 2 - nw / 2, cy + 14, nw, 1, P.trayEdge); txt(name, W / 2 - 4, cy + 4, P.ink, 7, 'center');
    R(W / 2 + nw / 2 - 10, cy + 6, 5, 1, P.ink); R(W / 2 + nw / 2 - 9, cy + 7, 3, 1, P.ink); R(W / 2 + nw / 2 - 8, cy + 8, 1, 1, P.ink);
    hit(G, W / 2 - nw / 2 - 4, cy - 2, nw + 8, 19, function () { var ks = SS.styleWho(G); m.who = ks[(ks.indexOf(m.who) + 1) % ks.length]; m.face = 0; m.page = 0; m.cur = 0; });
    R(W - 56, cy, 22, 15, '#fff6ea'); R(W - 56, cy + 14, 22, 1, P.trayEdge); SS.heart(W - 48, cy + 5, P.rose);
    hit(G, W - 58, cy - 2, 24, 19, function () { G.toast('OUTFIT FAVORITES COME NEXT', 1700, 'Saving a look and its picture come in the next outfits part.'); });
    R(W - 30, cy, 22, 15, '#fff6ea'); R(W - 30, cy + 14, 22, 1, P.trayEdge); R(W - 24, cy + 5, 10, 7, P.ink); R(W - 21, cy + 3, 4, 2, P.ink); R(W - 21, cy + 6, 4, 4, '#fff6ea'); R(W - 20, cy + 7, 2, 2, P.ink);
    hit(G, W - 32, cy - 2, 24, 19, function () { G.toast('THE STYLE CAMERA COMES NEXT', 1700, 'For now, the camera in the menu takes the home.'); });
    // ---------- the wardrobe tray ----------
    var y = trayTop; R(0, y - 2, W, 2, 'rgba(59,36,48,.25)'); R(0, y, W, SS.STYLE_TRAY, P.tray); R(0, y, W, 1, '#fffaf3');
    ['HOME', 'STYLE'].forEach(function (s, i) { var tx = 6 + i * 52; R(tx, y + 4, 48, 12, i === 1 ? P.rose : P.trayEdge); if (i === 1) R(tx, y + 4, 48, 1, P.roseHi); txt(s, tx + 24, y + 6, i === 1 ? '#fff' : P.ink, 8, 'center'); hit(G, tx, y + 2, 48, 16, function () { if (i === 0) SS.closeStyle(G); }); });
    txt(G.mode === 'life' ? (G.save.coins || 0) + ' COINS' : PIECES.length + ' PIECES', W - 6, y + 7, P.soft, 6, 'right');
    TABS.forEach(function (tb, i) {
      var tx = 4 + i * 29.2, on = tb === m.tab;
      R(tx, y + 20, 27, 16, on ? P.rose : (tb === 'holiday' ? '#fdeccf' : '#fbeedd')); R(tx, y + 35, 27, 1, on ? P.roseSh : P.trayEdge); tabIcon(i, tx + 7, y + 23, on);
      hit(G, tx - 1, y + 18, 29, 20, function () { m.tab = tb; m.page = 0; m.cur = 0; });
    });
    var list = SS.styleCards(G, m.who, m.tab), o = SS.outfitOf(G, m.who), pages = Math.max(1, Math.ceil(list.length / 8));
    if (m.page >= pages) m.page = pages - 1;
    txt(m.tab === 'hair' && m.who === 'sarah' ? 'HAIR: STYLES · ALWAYS GINGER' : TAB_NAMES[m.tab], 6, y + 41, P.ink, 6);
    if (pages > 1) { txt((m.page + 1) + '/' + pages, W - 26, y + 41, P.soft, 6, 'center'); hit(G, W - 52, y + 37, 18, 12, function () { if (m.page > 0) m.page--; }); hit(G, W - 18, y + 37, 18, 12, function () { if (m.page < pages - 1) m.page++; }); txt('‹', W - 46, y + 40, P.ink, 7); txt('›', W - 12, y + 40, P.ink, 7); }
    if (!list.length) { SS.vt(m.tab === 'holiday' ? 'Christmas clothes join with the rest of the wardrobe.' : 'More pieces come with the rest of the wardrobe.', 8, y + 56, P.soft, 12); }
    list.slice(m.page * 8, m.page * 8 + 8).forEach(function (it, j) {
      var colI = j % 4, row = Math.floor(j / 4), sx = 5 + colI * 58, sy = y + 50 + row * 30, idx = m.page * 8 + j;
      var worn = it.piece ? wearing(o, it.piece) : it.hair ? o.hair === it.hair : (o.shade || 0) === it.shade && m.who !== 'sarah';
      R(sx, sy, 55, 28, worn ? '#fde3ea' : (m.focus && m.cur === idx ? P.blush : '#fbeedd')); R(sx, sy + 27, 55, 1, P.trayEdge);
      icon(c, it, sx + 3, sy + 4, G, m.who);
      if (worn) { c.strokeStyle = P.rose; c.lineWidth = 2; c.strokeRect(sx + 1, sy + 1, 53, 26); c.lineWidth = 1; }
      if (m.focus && m.cur === idx) { c.strokeStyle = P.ink; c.strokeRect(sx + .5, sy + .5, 54, 27); }
      if (it.piece) {
        it.piece.sw.slice(0, 4).forEach(function (cc, k) { R(sx + 33 + (k % 2) * 9, sy + 4 + Math.floor(k / 2) * 8, 7, 7, INK); R(sx + 34 + (k % 2) * 9, sy + 5 + Math.floor(k / 2) * 8, 5, 5, cc[1]); });
        if (it.piece.ours) SS.heart(sx + 45, sy + 19, P.roseHi);
        var pr = priceOf(G, it.piece); if (pr) { R(sx + 2, sy + 19, 22, 7, '#fff6ea'); c.fillStyle = '#ffd56b'; c.fillRect(sx + 3, sy + 20, 4, 4); txt(String(pr), sx + 9, sy + 20, P.ink, 4); }
      } else txt(it.hair ? SHORT[it.hair] : String(it.shade + 1), sx + 41, sy + 11, P.ink, 4, 'center');
      hit(G, sx, sy, 55, 28, function () { m.cur = idx; pickCard(G, it); }, { styleCard: it });
    });
    SS.drawStyleDrag(G);
  };
  SS.drawStyleDrag = function (G) { var m = G.menu; if (!m || !m.drag) return; var a = m.drag.at; SS.R(a.x - 15, a.y - 14, 30, 26, 'rgba(255,246,234,.9)'); icon(G.c, m.drag.it, a.x - 13, a.y - 11, G, m.who); };
  // buttons: left and right move along the cards, up and down change the tab, A puts on (or takes off), Select spins, B closes
  SS.stylePress = function (G, k) {
    var m = G.menu, list = SS.styleCards(G, m.who, m.tab);
    if (k === 'b' || k === 'start') { SS.closeStyle(G); return; }
    if (k === 'select') { SS.spinStyle(G, 1); return; }
    if (k === 'up' || k === 'down') { var i = TABS.indexOf(m.tab); m.tab = TABS[(i + (k === 'down' ? 1 : TABS.length - 1)) % TABS.length]; m.cur = 0; m.page = 0; m.focus = true; return; }
    if (k === 'left') { m.focus = true; m.cur = Math.max(0, m.cur - 1); }
    if (k === 'right') { m.focus = true; m.cur = Math.min(Math.max(0, list.length - 1), m.cur + 1); }
    m.page = Math.floor(m.cur / 8);
    if (k === 'a' && list[m.cur]) pickCard(G, list[m.cur]);
  };
})();
