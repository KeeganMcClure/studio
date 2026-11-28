// Sarah's Sim: design gigs (spec 006, part F; bible, Play, Job: design gigs; mockups/gig-v1).
//   Find a gig at the desk offers 2 or 3 small room jobs from the neighbors (bible, Visitors: Dot, Marco and Jules, Theo, Priya).
//   The card (gig-v1, left) shows who asked, what they want in one line, where, what they like (3 tags), the pay and Accept / Not now.
//   Accepting opens the gig's space: a small room of theirs, empty, to decorate with the normal catalog. Every piece is lent free
//   and goes back when she hands it in, so her own coins and her own home are never touched. A banner shows the ask, the tags
//   ticking off as the design matches them, and Hand in.
//   Judging: 1 to 3 hearts, one per tag matched (at least one, there's no wrong answer); 100, 150 or 200 coins; +1 friendship.
//   Try again goes back into the room to change it; Done pays, and she's home.
//   Outfit gigs come with Style (spec 002); a visitor at the door bringing a gig comes with Visitors (spec 008).
(function () {
  var WHO = {
    dot: { name: 'DOT', she: 'SHE', rel: 'Your neighbor two doors up' },
    mj: { name: 'MARCO & JULES', she: 'THEY', rel: 'The couple next door' },
    theo: { name: 'THEO', she: 'HE', rel: 'The painter on the corner' },
    priya: { name: 'PRIYA', she: 'SHE', rel: 'The nurse with Biscuit' }
  };
  // ordinary room gigs (a Claude default pool): who, the ask, where, the room's size, floor and paper, and three likes
  var POOL = [
    { who: 'dot', ask: 'A reading corner that feels like fall', where: 'Her sunroom, by the big windows', w: 5, d: 5, floor: 'planks', paper: 'honey', likes: ['plants', 'warm', 'books'] },
    { who: 'dot', ask: 'A sitting spot for her afternoon tea', where: 'The corner of her front room', w: 4, d: 5, floor: 'planks', paper: 'rose', likes: ['seating', 'table', 'plants'] },
    { who: 'mj', ask: 'A cozy corner to sit in, finally', where: 'Behind the wall of boxes', w: 5, d: 4, floor: 'planks', paper: 'cream', likes: ['seating', 'rug', 'lights'] },
    { who: 'mj', ask: 'Somewhere soft to put their feet up', where: 'Their half-unpacked den', w: 5, d: 5, floor: 'planks', paper: 'sage', likes: ['soft', 'rug', 'cool'] },
    { who: 'theo', ask: 'A spot by the window to paint in', where: 'His tiny studio', w: 4, d: 4, floor: 'planks', paper: 'cream', likes: ['art', 'lights', 'plants'] },
    { who: 'theo', ask: 'A wall of art he\'s proud of', where: 'The studio\'s back room', w: 5, d: 4, floor: 'planks', paper: 'lilac', likes: ['art', 'seating', 'warm'] },
    { who: 'priya', ask: 'A calm corner for after night shifts', where: 'Her bedroom window', w: 5, d: 5, floor: 'planks', paper: 'sage', likes: ['cool', 'soft', 'lights'] },
    { who: 'priya', ask: 'A dog-proof place to curl up', where: 'Her living room, Biscuit\'s favorite', w: 5, d: 5, floor: 'planks', paper: 'honey', likes: ['rug', 'seating', 'books'] }
  ];
  SS.GIGS = POOL;
  // the likes, and how a design matches each one
  function hue(hex) { var n = parseInt((hex || '#888888').slice(1), 16), r = (n >> 16 & 255) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, h = 0; if (!d) return { h: 0, s: 0 }; h = mx === r ? (g - b) / d % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; if (h < 0) h += 360; return { h: h, s: d / (1 - Math.abs(mx + mn - 1)) }; }
  function mainColor(p) { var d = SS.DEF[p.id], part = d.parts[0] && d.parts[0][0]; return (p.colors && p.colors[part]) || ((d.swatches[p.sw || 0] || d.swatches[0] || {})[part]); }
  var LIKES = {
    plants: { label: 'plants', test: function (ps) { return ps.some(function (p) { return SS.DEF[p.id].tab === 'plants'; }); } },
    books: { label: 'books', test: function (ps) { return ps.some(function (p) { return /book/.test(p.id); }); } },
    seating: { label: 'a comfy seat', test: function (ps) { return ps.some(function (p) { var u = SS.DEF[p.id].use; return u === 'sofa' || u === 'chair'; }); } },
    table: { label: 'a little table', test: function (ps) { return ps.some(function (p) { return SS.DEF[p.id].tab === 'tables'; }); } },
    bed: { label: 'a bed to sleep in', test: function (ps) { return ps.some(function (p) { return SS.DEF[p.id].use === 'bed'; }); } },
    rug: { label: 'a rug', test: function (ps) { return ps.some(function (p) { return SS.DEF[p.id].kind === 'rug'; }); } },
    lights: { label: 'soft light', test: function (ps) { return ps.some(function (p) { var d = SS.DEF[p.id]; return d.lamp || d.light; }); } },
    art: { label: 'art', test: function (ps) { return ps.some(function (p) { var d = SS.DEF[p.id]; return d.kind === 'wall' && !d.window; }); } },
    soft: { label: 'soft things', test: function (ps) { return ps.filter(function (p) { return SS.DEF[p.id].parts.some(function (q) { return q[1] === 'fab'; }); }).length >= 2; } },
    warm: { label: 'warm colors', test: function (ps) { var c = ps.map(mainColor).map(hue).filter(function (h) { return h.s > .25; }); return c.length >= 2 && c.filter(function (h) { return h.h < 60 || h.h > 330; }).length * 2 >= c.length; } },
    cool: { label: 'cool colors', test: function (ps) { var c = ps.map(mainColor).map(hue).filter(function (h) { return h.s > .2; }); return c.length >= 2 && c.filter(function (h) { return h.h >= 150 && h.h <= 270; }).length * 2 >= c.length; } }
  };
  SS.GIG_LIKES = LIKES;
  SS.gigMatches = function (G) { var g = G.gig, ps = G.W.pieces; return g.offer.likes.map(function (k) { return LIKES[k].test(ps); }); };

  // ---------- offers: Find a gig at the desk ----------
  SS.findGigs = function (G, who) {   // who: only that visitor's gigs (an ordinary visit, spec 008)
    var S = G.save; S.shown = S.shown || {}; var sh = S.shown.gigs || (S.shown.gigs = []);
    var mine = POOL.map(function (g, i) { return i; }).filter(function (i) { return !who || POOL[i].who === who; });
    var left = mine.filter(function (i) { return sh.indexOf(i) < 0; });
    if (left.length < (who ? 1 : 3)) { sh.length = 0; left = mine.slice(); }
    var picks = [], whos = {};
    while (picks.length < 3 && left.length) { var k = left.splice(Math.floor(Math.random() * left.length), 1)[0]; if (whos[POOL[k].who]) continue; whos[POOL[k].who] = 1; picks.push(k); }
    G.bubble = null; G.meters = null; G.toastT = null;
    G.menu = { kind: 'gig', offers: picks, cur: 0 };
  };
  SS.acceptGig = function (G, k) {
    var S = G.save; (S.shown.gigs = S.shown.gigs || []).push(k);
    SS.startGig(G, POOL[k], k);
  };
  // any room gig: an ordinary one, or a visitor's story gig (spec 008, part B), with its own pay and size
  SS.startGig = function (G, o, k) {
    var lot = Math.max(o.w, o.d) + 4;
    // the gig's space: one small empty room of theirs, with windows, on its own little lot
    var home = { id: 'gig', name: WHO[o.who].name, lot: lot, lotName: '', at: [2, 2], w: o.w, d: o.d,
      floors: [{ rooms: [{ id: 'gig', name: 'Room', r: [0, 0, o.w, o.d], floor: o.floor, paper: o.paper }], openings: [], windows: [[1, 0, 'x', 2], [0, 1, 'y', 2]] }], stairs: [], pieces: [] };
    if (!SS.PAPERS[o.paper]) home.floors[0].rooms[0].paper = 'cream';
    SS.HOMES.gig = home;
    G.gig = { k: k, offer: o, home: { W: G.W, agents: G.agents, floor: G.floor, view: SS.view.k, undo: G.undo, cam: { x: G.cam.x, y: G.cam.y, zoom: G.cam.zoom }, walls: G.walls, tray: G.tray.open }, start: Date.now() };
    G.menu = null; G.sel = null; G.hold = null; G.paint = null;
    G.W = SS.World(home, []); G.agents = []; G.floor = 0; SS.view.k = 0; G.undo = []; G.walls = 'cut'; G.tray.open = true; G.tray.tab = 'seating'; G.tray.page = 0;
    SS.view.L = G.W.lot; G.centerCam(true); G.changed(false);
  };
  function leave(G) {
    var h = G.gig.home; G.W = h.W; G.agents = h.agents; G.floor = h.floor; SS.view.k = h.view; SS.view.L = G.W.lot; G.undo = h.undo; G.walls = h.walls; G.tray.open = h.tray;
    G.cam.x = h.cam.x; G.cam.y = h.cam.y; G.cam.zoom = h.cam.zoom; G.gig = null; G.sel = null; G.hold = null; G.paint = null; G.changed(true);
  }
  SS.handIn = function (G) {
    var m = SS.gigMatches(G), n = m.filter(Boolean).length, hearts = Math.max(1, n), o = G.gig.offer;
    if (G.hold) return;
    var pic = { home: 'gig', f: 0, x: G.W.ax + o.w / 2, y: G.W.ay + o.d / 2, k: SS.view.k, pieces: JSON.parse(JSON.stringify(G.W.pieces)), agents: [], span: 22 * Math.max(o.w, o.d) + 30 };
    var missed = o.likes.filter(function (k, i) { return !m[i]; });
    var pay = o.story !== undefined ? (G.mode === 'life' ? (o.pay || 250) : 0) : [100, 150, 200][hearts - 1];   // story gigs pay 250 (a home 600); Sandbox's story pays none
    G.menu = { kind: 'gigdone', hearts: hearts, pay: pay, missed: missed, pic: pic, img: null };
  };
  SS.gigDone = function (G) {
    var r = G.menu, o = G.gig.offer, S = G.save; G.menu = null;
    S.coins = (S.coins || 0) + r.pay; S.friends = S.friends || {};
    if (o.story === undefined) S.friends[o.who] = (S.friends[o.who] || 0) + r.hearts;   // more hearts, more friendship (spec 008, part A)
    if (G.gig.outfit) { G.gig = null; G.styleGig = null; } else leave(G);
    SS.moment(G, 'gig');
    if (o.story !== undefined) SS.storyGigDone(G, o, r.hearts);
    G.toast(r.pay ? '+' + r.pay + ' COINS' : 'THANK YOU', 2200, WHO[o.who].name.charAt(0) + WHO[o.who].name.slice(1).toLowerCase() + ' will remember this. Friendship grew.');
  };
  SS.gigQuit = function (G) { if (G.gig.outfit) { G.gig = null; G.styleGig = null; G.menu = null; } else leave(G); G.toast('GIG LEFT FOR NOW', 1600, 'Find another at the desk any time.'); };

  // ---------- drawing ----------
  var P = SS.P, R = SS.R, txt = SS.txt;
  function hit(G, x, y, w, h, fn) { G.hits.push({ x: x, y: y, w: w, h: h, fn: fn }); }
  function heart(c, x, y, on) { var col = on ? P.rose : '#e8dccd'; R(x + 1, y, 2, 1, col); R(x + 4, y, 2, 1, col); R(x, y + 1, 7, 2, col); R(x + 1, y + 3, 5, 1, col); R(x + 2, y + 4, 3, 1, col); R(x + 3, y + 5, 1, 1, col); }
  function bigHeart(c, x, y, on) { var col = on ? P.rose : '#e8dccd', s = 3; [[1, 0, 2, 1], [4, 0, 2, 1], [0, 1, 7, 2], [1, 3, 5, 1], [2, 4, 3, 1], [3, 5, 1, 1]].forEach(function (q) { R(x + q[0] * s, y + q[1] * s, q[2] * s, q[3] * s, col); }); }
  // a neighbor's picture: Dot as drawn (visitor-v1); the others wait for their drawings (spec 008), so a soft card with initials
  function portrait(G, who, x, y, w, h) {
    var c = G.c; R(x, y, w, h, '#3b2430'); R(x + 1, y + 1, w - 2, h - 2, who === 'dot' ? '#cfe3d3' : '#f1dcc8');
    if (who === 'dot') { c.save(); c.beginPath(); c.rect(x + 1, y + 1, w - 2, h - 2); c.clip(); var S = Math.max(1, Math.floor((w - 4) / 20)); SS.drawDot(c, x + Math.round((w - 20 * S) / 2), y + 3, S, G.t, true); c.restore(); return; }
    var ini = { mj: 'M&J', theo: 'T', priya: 'P' }[who]; txt(ini, x + w / 2, y + h / 2 - 4, P.soft, who === 'mj' ? 6 : 9, 'center');
  }
  SS.drawGigOffer = function (G, W, H) {
    var c = G.c, m = G.menu, o = POOL[m.offers[m.cur]], wh = WHO[o.who];
    R(0, 0, W, H, 'rgba(34,18,28,.62)'); hit(G, 0, 0, W, H, function () {});
    var w = Math.min(220, W - 12), h = 262, x = (W - w) / 2, y = Math.max(6, Math.round((H - h) / 2));
    R(x + 2, y + 3, w, h, 'rgba(34,23,31,.35)'); R(x, y, w, h, P.tray); c.strokeStyle = P.rose; c.strokeRect(x + .5, y + .5, w - 1, h - 1);
    R(x, y, w, 18, P.rose); txt('A GIG FOR YOU', x + w / 2, y + 6, '#fff', 6, 'center');
    portrait(G, o.who, x + 8, y + 24, 48, 50);
    txt(wh.name, x + 62, y + 28, P.ink, 7); SS.vt(wh.rel, x + 62, y + 40, P.soft, 11);
    var fh = SS.friendHearts(G, o.who); for (var i = 0; i < 5; i++) heart(c, x + 62 + i * 10, y + 56, i < fh); SS.vt('Friends', x + 116, y + 53, P.soft, 11);
    R(x + 8, y + 80, w - 16, 1, P.trayEdge);
    txt('WHAT ' + wh.she + ' WANT' + (wh.she === 'THEY' ? '' : 'S'), x + 8, y + 86, P.soft, 5);
    SS.hand(c, '"' + o.ask + '."', x + 8, y + 106, 13, P.ink, 'left', w - 16);
    txt('WHERE', x + 8, y + 116, P.soft, 5); SS.vt(o.where, x + 8, y + 123, P.ink, 12);
    txt(wh.she + ' LIKE' + (wh.she === 'THEY' ? '' : 'S'), x + 8, y + 142, P.soft, 5);
    var tx = x + 8; o.likes.forEach(function (k) { c.font = '11px "VT323", monospace'; var tw = Math.ceil(c.measureText(LIKES[k].label).width) + 8; R(tx, y + 150, tw, 13, P.cell); SS.vt(LIKES[k].label, tx + 4, y + 150, P.ink, 11); tx += tw + 4; });
    txt('PAY', x + 8, y + 172, P.soft, 5); R(x + 8, y + 181, 7, 7, '#e7bb4f'); R(x + 9, y + 182, 5, 5, '#ffd56b'); txt('100 TO 200', x + 18, y + 181, P.ink, 7); SS.vt('More if ' + wh.she.toLowerCase() + ' love' + (wh.she === 'THEY' ? '' : 's') + ' it', x + w - 8, y + 178, P.soft, 11, 'right');
    SS.vt('Pieces are lent free. Your coins stay yours.', x + w / 2, y + 196, P.soft, 11, 'center');
    m.offers.forEach(function (k, i) { R(x + w / 2 - m.offers.length * 5 + i * 10, y + 214, 6, 6, i === m.cur ? P.rose : P.trayEdge); });
    hit(G, x, y + 80, 40, 130, function () { m.cur = (m.cur + m.offers.length - 1) % m.offers.length; }); hit(G, x + w - 40, y + 80, 40, 130, function () { m.cur = (m.cur + 1) % m.offers.length; });
    var bw = (w - 20) / 2;
    SS.btn(x + 6, y + h - 26, bw, 'NOT NOW', false); hit(G, x + 6, y + h - 28, bw, 20, function () { G.menu = null; });
    SS.btn(x + 14 + bw, y + h - 26, bw, 'ACCEPT', true); hit(G, x + 14 + bw, y + h - 28, bw, 20, function () { SS.acceptGig(G, m.offers[m.cur]); });
  };
  SS.gigOfferPress = function (G, k) { var m = G.menu; if (k === 'left') m.cur = (m.cur + m.offers.length - 1) % m.offers.length; if (k === 'right') m.cur = (m.cur + 1) % m.offers.length; if (k === 'a') SS.acceptGig(G, m.offers[m.cur]); if (k === 'b') G.menu = null; };
  // the banner while she designs (gig-v1, middle): who it's for, the ask, the likes ticking off, Hand in
  SS.drawGigBanner = function (G, W) {
    var c = G.c, g = G.gig, o = g.offer, m = SS.gigMatches(G), x = 4, y = 4, w = W - 32, h = 50;
    R(x + 2, y + 3, w, h, 'rgba(34,23,31,.35)'); R(x, y, w, h, P.tray); c.strokeStyle = P.rose; c.strokeRect(x + .5, y + .5, w - 1, h - 1);
    portrait(G, o.who, x + 4, y + 4, 26, 26);
    txt('FOR ' + WHO[o.who].name, x + 34, y + 5, P.soft, 4);
    SS.vt(o.ask.length > 34 ? o.ask.slice(0, 33) + '…' : o.ask, x + 34, y + 10, P.ink, 11);
    var tx = x + 34; o.likes.forEach(function (k, i) { c.font = '10px "VT323", monospace'; var tw = Math.ceil(c.measureText(LIKES[k].label).width) + 12; R(tx, y + 24, tw, 10, m[i] ? '#e8f3dd' : P.cell); if (m[i]) SS.check(tx + 1, y + 25, '#437a47'); SS.vt(LIKES[k].label, tx + 9, y + 23, m[i] ? '#437a47' : P.soft, 10); tx += tw + 3; });
    var n = m.filter(Boolean).length; SS.vt(n + ' of 3 likes matched', x + 34, y + 36, '#437a47', 11);
    R(x + w - 54, y + 35, 50, 12, P.rose); R(x + w - 54, y + 46, 50, 1, P.roseSh); txt('HAND IN', x + w - 29, y + 38, '#fff', 5, 'center');
    hit(G, x + w - 56, y + 33, 54, 16, function () { SS.handIn(G); });
    hit(G, x, y, w, h, function () {});
  };
  // the verdict (gig-v1, right): the design, hearts, what they say, the pay, +1 friends, a hint for what they missed
  var SAYS = {
    1: ['"It\'s a start, and I\'m grateful.', 'Maybe next time a little more me?"'],
    2: ['"Oh, it\'s lovely! It\'s nearly just', 'what I pictured."'],
    3: ['"It\'s perfect. I could live in this', 'corner forever. Thank you!"']
  };
  SS.drawGigDone = function (G, W, H) {
    var c = G.c, r = G.menu, o = G.gig.offer, wh = WHO[o.who];
    R(0, 0, W, H, 'rgba(34,18,28,.62)'); hit(G, 0, 0, W, H, function () {});
    var w = Math.min(224, W - 12), h = 282, x = (W - w) / 2, y = Math.max(6, Math.round((H - h) / 2));
    R(x + 2, y + 3, w, h, 'rgba(34,23,31,.35)'); R(x, y, w, h, P.tray); c.strokeStyle = P.rose; c.strokeRect(x + .5, y + .5, w - 1, h - 1);
    R(x, y, w, 18, P.rose); txt(wh.name + (r.hearts === 3 ? ' LOVES IT' : r.hearts === 2 ? ' IS HAPPY' : ' SAYS THANKS'), x + w / 2, y + 6, '#fff', 5, 'center');
    if (r.outfitImg) { R(x + 20, y + 24, w - 40, 70, '#f3d2c4'); c.imageSmoothingEnabled = false; c.drawImage(r.outfitImg, 0, 0, 52, 70, x + w / 2 - 26, y + 24, 52, 70); }
    else { if (!r.img) r.img = SS.drawRecipe(r.pic, w - 40, 70, SS.look(new Date(2026, 0, 1, 12), 'sandbox'), 'gig:' + G.gig.start);
      c.imageSmoothingEnabled = false; c.drawImage(r.img, x + 20, y + 24); }
    for (var i = 0; i < 3; i++) bigHeart(c, x + w / 2 - 40 + i * 30, y + 102, i < r.hearts);
    portrait(G, o.who, x + 8, y + 128, 34, 34);
    SAYS[r.hearts].forEach(function (l, i) { SS.vt(l, x + 48, y + 128 + i * 12, P.ink, 12); });
    R(x + 8, y + 170, w - 16, 1, P.trayEdge);
    var bw = (w - 24) / 2;
    R(x + 8, y + 178, bw, 18, '#fbeedd'); R(x + 12, y + 183, 7, 7, '#e7bb4f'); R(x + 13, y + 184, 5, 5, '#ffd56b'); txt('+' + r.pay, x + 24, y + 183, P.ink, 7);
    R(x + 16 + bw, y + 178, bw, 18, '#fde3ea'); heart(c, x + 20 + bw, y + 184, true); SS.vt('+1 Friends', x + 31 + bw, y + 180, P.roseSh, 12);
    if (r.missed.length) SS.vt('Hint: ' + wh.she.toLowerCase() + ' like' + (wh.she === 'THEY' ? '' : 's') + ' ' + (LIKES[r.missed[0]] || SS.OUTFIT_LIKES[r.missed[0]]).label + '. Try again any time.', x + w / 2, y + 204, P.soft, 11, 'center');
    SS.btn(x + 6, y + h - 26, bw + 2, 'TRY AGAIN', false); hit(G, x + 6, y + h - 28, bw + 2, 20, function () { G.menu = G.gig && G.gig.outfit ? { kind: 'style', who: 'guest', face: 0, tab: 'tops', page: 0, cur: 0 } : null; });
    SS.btn(x + 14 + bw, y + h - 26, bw + 2, 'DONE', true); hit(G, x + 14 + bw, y + h - 28, bw + 2, 20, function () { SS.gigDone(G); });
  };
  SS.gigDonePress = function (G, k) { if (k === 'a') SS.gigDone(G); if (k === 'b') G.menu = G.gig && G.gig.outfit ? { kind: 'style', who: 'guest', face: 0, tab: 'tops', page: 0, cur: 0 } : null; };
  SS.GIG_WHO = WHO;
})();
