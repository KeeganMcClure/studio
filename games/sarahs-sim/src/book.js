// Sarah's Sim: the memory book (spec 007, parts A and B; bible, Play, Memory book; mockups/memory-book-v1).
//   Part A, moments: about 72 moments in seven chapters, each a data row. A moment fires once, keeps its first real date and a
//   snapshot "recipe" (the pieces, people and cats around it, the floor, the view's turn and the light), so its page redraws the
//   scene as it was, crisp and small, even after the room has changed. When one fires, a small card slides in at the top for
//   about 3 seconds; tapping it opens that page. Each spec that owns a system fires its own moments (SS.moment); the ones whose
//   systems aren't built yet (the garden, cooking, gigs, visitors, outfits, the camera) simply wait.
//   Part B, the book screen: a rose cloth-bound scrapbook with cream pages and tabs down the side for the seven chapters, Notes
//   and Photos. Two moments a page, the reward ribbon (3 · 6 · 10) on a chapter's first page, dotted frames for moments not
//   reached yet ("???" except in Home and Garden, where knowing helps her aim). Swipe, the corner arrows or the D-pad turn
//   pages; tapping a tab jumps; B closes. Dates and captions are hand-lettered: VT323 in brown ink, each letter tipped a little.
//   One book for every mode, saved under its own key (ss.book), so moments count in Sandbox and Life alike.
//   Waiting for the playtest (spec 007, build order): part C (Keegan's notes hidden around the home) and part D (the reward
//   pieces). Until then the Notes tab holds the notes she has found (the one under the tree) and the ribbon says the rewards
//   come later.
(function () {
  // ---------- the moments (bible, Play, Memory book: Keegan's approved starters) ----------
  var CH = [
    { k: 'cats', name: 'THE CATS', col: '#e2873a', rewards: ['A pair of cat beds', 'A gallery wall of cat art', 'A big cat tree'] },
    { k: 'garden', name: 'GARDEN', col: '#6aa361', show: true, rewards: ['A birdbath', 'A garden bench and string lights', 'A rose arbor'] },
    { k: 'kitchen', name: 'KITCHEN', col: '#e7b75f', rewards: ['A herb rail', 'Open shelves and a breakfast nook', 'A retro fridge'] },
    { k: 'holidays', name: 'HOLIDAYS', col: '#d2363c', rewards: ['A garland for every season', 'An ornament shelf', 'A lit-up holiday village'] },
    { k: 'home', name: 'HOME', col: '#7fa7a0', show: true, rewards: ['A mood board', 'A sewing corner and a dress form', 'A drafting table studio'] },
    { k: 'friends', name: 'FRIENDS', col: '#8f7bc0', rewards: ['Floor cushions', 'A snack table and string lights', 'A record player'] },
    { k: 'us', name: 'THE TWO OF US', col: '#e46f8b', rewards: ['A cozy throw', 'A "home" sign', 'A wall of pictures of you two'] }
  ];
  var M = [
    ['cats', 'louie-nap', 'Louie naps on the new piece'], ['cats', 'louie-tub', 'Louie perches on the tub'], ['cats', 'louie-chats', 'Louie chats for a treat'],
    ['cats', 'ralph-toys', 'Ralph sprawls on his toys'], ['cats', 'ralph-cook', 'Ralph turns up while Keegan cooks'], ['cats', 'ralph-steal', 'Ralph steals Louie\'s warm spot'],
    ['cats', 'ralph-vacuum', 'Ralph slowly leaves the vacuum'], ['cats', 'wand', 'The feather wand, first time'], ['cats', 'ralph-bow', 'Ralph in his red bowtie'],
    ['cats', 'cats-asleep', 'Both cats asleep together'],
    ['garden', 'seed', 'First seed planted'], ['garden', 'sprout', 'First sprout'], ['garden', 'bloom', 'First bloom'], ['garden', 'harvest', 'First harvest'],
    ['garden', 'bed-full', 'A full garden bed'], ['garden', 'houseplant', 'A houseplant grows up'], ['garden', 'greenhouse', 'The greenhouse goes up'],
    ['garden', 'snow-beds', 'Snow on the beds'], ['garden', 'pumpkin', 'A pumpkin grown in fall'], ['garden', 'four-seasons', 'Plants from all four seasons'],
    ['kitchen', 'cook-first', 'Cooking together, first time'], ['kitchen', 'dish-burritos', 'Bean burritos'], ['kitchen', 'dish-spaghetti', 'Spaghetti and meatballs'],
    ['kitchen', 'dish-eggs', 'Eggs on toast'], ['kitchen', 'dish-beef', 'Beef and broccolini'], ['kitchen', 'dish-nachos', 'Chicken nachos'],
    ['kitchen', 'dish-sandwiches', 'Breakfast sandwiches'], ['kitchen', 'dish-subs', 'Meatball subs'], ['kitchen', 'dish-ravioli', 'Ravioli with chicken sausage'],
    ['kitchen', 'dish-tacos', 'Chorizo breakfast tacos'],
    ['holidays', 'first-snow', 'First snow'], ['holidays', 'tree-trimmed', 'The Christmas tree, trimmed'], ['holidays', 'xmas-morning', 'Christmas morning'],
    ['holidays', 'nye', 'New Year\'s Eve'], ['holidays', 'valentines', 'Valentine\'s Day'], ['holidays', 'spring', 'Spring\'s first warm day'],
    ['holidays', 'july4', 'Fourth of July'], ['holidays', 'halloween', 'Halloween costumes'], ['holidays', 'thanksgiving', 'Thanksgiving dinner'],
    ['holidays', 'bday-sarah', 'Sarah\'s birthday'], ['holidays', 'bday-keegan', 'Keegan\'s birthday'], ['holidays', 'holiday-year', 'A whole year of holidays'],
    ['home', 'room-finished', 'First room finished'], ['home', 'bought', 'First piece bought with coins'], ['home', 'first-wall', 'First wall on an empty lot'],
    ['home', 'new-home', 'A whole new home finished'], ['home', 'favorite', 'First favorite saved'], ['home', 'photo', 'First photo taken'],
    ['home', 'outfit', 'First outfit designed'], ['home', 'orange-rocks', 'The ORANGE ROCKS tee, worn'], ['home', 'rooms-10', 'Ten rooms finished'],
    ['home', 'philly-redone', 'Every room in Philly redone'],
    ['friends', 'visitor', 'First visitor'], ['friends', 'gig', 'First gig done'], ['friends', 'visit-neighbor', 'First visit next door'],
    ['friends', 'neighbor-redone', 'A neighbor\'s home redone'], ['friends', 'creator', 'First person made'], ['friends', 'visitor-gift', 'A visitor brings a gift'],
    ['friends', 'story', 'First friend\'s story finished'], ['friends', 'three-friends', 'Three friends made'], ['friends', 'all-stories', 'Every neighbor\'s story'],
    ['friends', 'full-house', 'A full house of visitors'],
    ['us', 'note-first', 'First note from Keegan'], ['us', 'note-tree', 'The note under the tree'], ['us', 'cuddle', 'Cuddled up on the couch'],
    ['us', 'kiss', 'A kiss'], ['us', 'cozy-night', 'A cozy night in'], ['us', 'wind-down', 'Winding down together'], ['us', 'video-call', 'Sarah calls her mom'],
    ['us', 'game-night', 'Keegan\'s game night'], ['us', 'slow-morning', 'A slow morning in bed'], ['us', 'anniversary', 'Our anniversary'], ['us', 'notes-all', 'Every note found']
  ].map(function (r) { return { ch: r[0], id: r[1], cap: r[2] }; });
  var BYID = {}; M.forEach(function (m) { BYID[m.id] = m; });
  SS.MOMENTS = M; SS.CHAPTERS = CH;
  SS.chapterOf = function (k) { return CH.filter(function (c) { return c.k === k; })[0]; };
  SS.momentsIn = function (k) { return M.filter(function (m) { return m.ch === k; }); };

  // ---------- the book's save: one for every mode (spec 007, Saves) ----------
  var BOOK = null;
  SS.book = function () {
    if (BOOK) return BOOK;
    var s = SS.store.get('book'); try { BOOK = s ? JSON.parse(s) : null; } catch (e) { BOOK = null; }
    BOOK = BOOK || {}; BOOK.moments = BOOK.moments || {}; BOOK.notes = BOOK.notes || {}; BOOK.photos = BOOK.photos || []; BOOK.rooms = BOOK.rooms || {};
    if (!BOOK.firstPlay) { BOOK.firstPlay = SS.now().getTime(); saveBook(); }
    return BOOK;
  };
  function saveBook() { SS.store.set('book', JSON.stringify(BOOK)); }
  SS.forgetBook = function () { BOOK = null; SNAP = {}; };   // after an import, read it again
  SS.hasMoment = function (id) { return !!SS.book().moments[id]; };
  SS.chapterCount = function (k) { var b = SS.book(); return SS.momentsIn(k).filter(function (m) { return b.moments[m.id]; }).length; };

  // ---------- a moment happens: once, with its date and a snapshot recipe ----------
  // focus: {f, x, y} (lot point) to center the snapshot on; Sarah when left out
  SS.moment = function (G, id, focus) {
    var m = BYID[id], b = SS.book(); if (!m || b.moments[id] || !G || !G.W) return false;
    var s = G.people && G.people.sarah;
    focus = focus || (s ? { f: s.f, x: s.x, y: s.y } : { f: G.floor, x: G.W.ax + G.W.home.w / 2, y: G.W.ay + G.W.home.d / 2 });
    b.moments[id] = { date: SS.now().getTime(), mode: G.mode, snap: recipe(G, focus) };
    saveBook();
    G.pop = { id: id, t0: performance.now() };
    return true;
  };
  // the picture recipe: what's in the 8 x 6 tiles around the moment, and how it looked
  function recipe(G, f) {
    var W = G.W, x0 = f.x - 4.5, x1 = f.x + 4.5, y0 = f.y - 4.5, y1 = f.y + 4.5, keep = {};
    var near = function (x, y, w, d) { return x + w > x0 && x < x1 && y + d > y0 && y < y1; };
    W.pieces.forEach(function (p) {
      if (W.floorOf(p) !== f.f) return;
      var d = W.def(p);
      if (p.wall) { if (near(p.wall[0], p.wall[1], 1, 1)) keep[p.uid] = 1; return; }
      if (p.host) return;
      var ft = W.foot(p); if (near(ft[0], ft[1], ft[2] - ft[0], ft[3] - ft[1])) keep[p.uid] = 1;
    });
    W.pieces.forEach(function (p) { var h = p.host && W.hostOf(p); while (h && !keep[p.uid]) { if (keep[h.uid]) keep[p.uid] = 1; h = h.host && W.hostOf(h); } });
    var pieces = W.pieces.filter(function (p) { return keep[p.uid]; }).map(function (p) { var q = {}; for (var k in p) if (k !== 'work') q[k] = p[k]; return JSON.parse(JSON.stringify(q)); });
    var agents = (G.agents || []).filter(function (a) { return a.f === f.f && Math.abs(a.x - f.x) < 4.5 && Math.abs(a.y - f.y) < 4.5; }).map(function (a) {
      return { kind: a.kind, who: a.who, x: a.x, y: a.y, z: a.z || 0, pose: a.path && a.path.length ? 'stand' : a.pose, flip: !!a.flip, back: false, on: a.on || null, arms: a.arms || null };
    });
    return { home: G.save.home, f: f.f, x: f.x, y: f.y, k: SS.view.k, pieces: pieces, agents: agents, xmas: !!G.xmasDay };
  }

  // ---------- drawing a snapshot from its recipe (cached once drawn) ----------
  var SNAP = {};
  SS.snapshot = function (id, w, h) {
    var key = id + '|' + w + 'x' + h; if (SNAP[key]) return SNAP[key];
    var e = SS.book().moments[id]; if (!e || !e.snap) return null;
    var r = e.snap, home = SS.HOMES[r.home] || SS.HOMES.philly, OFF = SS.OFF;
    var pieces = JSON.parse(JSON.stringify(r.pieces)).map(function (p) { p.uid += 1e6; if (p.host) p.host += 1e6; return p; });   // their own sprites, apart from the live home's
    var W = SS.World(home, pieces);
    var agents = r.agents.map(function (a) {
      return { kind: a.kind, who: a.who, f: r.f, x: a.x, y: a.y, z: a.z, pose: a.pose, flip: a.flip, back: false, on: a.on ? a.on + 1e6 : null, path: [], walked: 0,
        draw: function (c, p) {
          if (a.kind === 'cat') SS.cat(c, a.who, p[0], p[1], { pose: a.pose === 'walk1' || a.pose === 'walk2' ? 'sit' : a.pose, flip: a.flip, hat: r.xmas });
          else if (a.pose === 'bath') SS.bathPerson(c, p[0], p[1] - 7, { flip: a.flip, t: 0 });
          else SS.person(c, a.who, p[0], p[1], { pose: a.pose === 'walk1' || a.pose === 'walk2' ? 'stand' : a.pose, flip: a.flip, t: 0, arms: a.arms, seatH: a.z });
        } };
    });
    var cv = document.createElement('canvas'); cv.width = SS.WORLD[0]; cv.height = SS.WORLD[1];
    var k0 = SS.view.k, q; SS.view.k = r.k || 0;   // drawn in the view it was seen in
    try { SS.drawScene(cv.getContext('2d'), W, { version: 'snap:' + id, floor: r.f, walls: 'cut', t: 0, look: SS.look(new Date(e.date), e.mode), agents: agents }); q = SS.vp(r.x, r.y, r.f * SS.FH + 10); }
    finally { SS.view.k = k0; }
    var cw = 176, ch = Math.round(cw * h / w), sx = Math.round(q[0] + OFF[0] - cw / 2), sy = Math.round(q[1] + OFF[1] - ch / 2 - 12);
    var out = document.createElement('canvas'); out.width = w; out.height = h; var oc = out.getContext('2d'); oc.imageSmoothingEnabled = false;
    oc.fillStyle = '#2a1b24'; oc.fillRect(0, 0, w, h); oc.drawImage(cv, sx, sy, cw, ch, 0, 0, w, h);
    SNAP[key] = out; return out;
  };

  // ---------- the pop card: slides in at the top for about 3 seconds; tap opens the page ----------
  SS.drawPop = function (G, W) {
    var P0 = G.pop; if (!P0) return; var age = performance.now() - P0.t0; if (age > 3300) { G.pop = null; return; }
    var m = BYID[P0.id], chp = SS.chapterOf(m.ch), k = Math.min(1, age / 250, (3300 - age) / 250), c = G.c;
    var w = 200, h = 26, x = (W - w) / 2, y = Math.round(-h + (24 + h) * k);
    c.fillStyle = 'rgba(34,23,31,.35)'; c.fillRect(x + 2, y + 3, w, h);
    c.fillStyle = '#fbf3e4'; c.fillRect(x, y, w, h); c.fillStyle = chp.col; c.fillRect(x, y, 4, h); c.strokeStyle = '#e46f8b'; c.strokeRect(x + .5, y + .5, w - 1, h - 1);
    bookIcon(c, x + 9, y + 7, chp.col);
    SS.txt('MEMORY BOOK · ' + chp.name, x + 26, y + 5, '#b38a8f', 5);
    hand(c, m.cap, x + 26, y + 21, 12);
    G.hits.push({ x: x, y: y, w: w, h: h, fn: function () { G.pop = null; SS.openBook(G, m.ch, pageOf(m)); } });
  };
  function bookIcon(c, x, y, col) { c.fillStyle = '#c9637a'; c.fillRect(x, y, 11, 13); c.fillStyle = '#fbf3e4'; c.fillRect(x + 2, y + 1, 8, 11); c.fillStyle = col; c.fillRect(x + 4, y + 3, 4, 3); c.fillStyle = '#e46f8b'; c.fillRect(x + 8, y - 1, 2, 5); }
  function pageOf(m) { var list = SS.momentsIn(m.ch); return Math.floor(list.indexOf(m) / 2); }

  // ---------- the book screen (spec 007, part B; mockups/memory-book-v1) ----------
  var P = {
    cloth: '#c9637a', clothSh: '#a84f64', clothHi: '#e08a9c', page: '#fbf3e4', pageSh: '#efe2cc', pageLine: '#ead9c0',
    ink: '#6b4250', soft: '#b38a8f', hand: '#7a4a35', handSoft: '#a98068', rose: '#e46f8b', roseHi: '#f39bb0', roseSh: '#b44f63',
    tape: 'rgba(242,196,138,.75)', tape2: 'rgba(168,203,192,.75)', edge: '#e8cdb4', sage: '#7fa7a0', paper: '#fffaf0'
  };
  var TABS = CH.map(function (c) { return { k: c.k, col: c.col }; }).concat([{ k: 'notes', col: '#c9a27a' }, { k: 'photos', col: '#5d7fa6' }]);
  SS.BOOK_TABS = TABS.map(function (t) { return t.k; });
  SS.openBook = function (G, tab, page) { G.bubble = null; G.toastT = null; G.menu = { kind: 'book', tab: tab || 'cats', page: page || 0 }; };
  SS.bookPages = function (G, tab) {
    if (tab === 'notes') return Math.max(1, Math.ceil(foundNotes().length / 6));
    if (tab === 'photos') return 1;
    return Math.ceil(SS.momentsIn(tab).length / 2);
  };
  SS.bookTurn = function (G, d) { var m = G.menu; var n = SS.bookPages(G, m.tab); m.page = Math.max(0, Math.min(n - 1, m.page + d)); };
  SS.bookTab = function (G, d) { var m = G.menu, i = SS.BOOK_TABS.indexOf(m.tab); m.tab = SS.BOOK_TABS[(i + d + SS.BOOK_TABS.length) % SS.BOOK_TABS.length]; m.page = 0; };
  function foundNotes() { var n = SS.book().notes; return Object.keys(n).map(function (k) { return { id: k, at: n[k].found, where: n[k].where }; }).sort(function (a, b) { return a.at - b.at; }); }
  SS.notesTotal = function () { var pv = window.SS_PRIVATE || {}; return (pv.notes && pv.notes.length) || 20; };
  // a note found: filed in the book (spec 007, part C; the note under the tree is the first, from holidays.js)
  SS.noteFound = function (G, id, where) {
    var b = SS.book(); if (b.notes[id]) return; b.notes[id] = { found: SS.now().getTime(), where: where || '' }; saveBook();
    SS.moment(G, 'note-first'); if (id === 'tree') SS.moment(G, 'note-tree');
    if (Object.keys(b.notes).length >= SS.notesTotal()) SS.moment(G, 'notes-all');
  };

  var c;
  function R(x, y, w, h, col) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
  function txt(s, x, y, col, size, align) { c.font = (size || 8) + 'px "Press Start 2P", monospace'; c.fillStyle = col; c.textAlign = align || 'left'; c.textBaseline = 'top'; c.fillText(s, x, y); }
  function vt(s, x, y, col, size, align) { c.font = (size || 10) + 'px "VT323", monospace'; c.fillStyle = col; c.textAlign = align || 'left'; c.textBaseline = 'top'; c.fillText(s, x, y); }
  function hash(i, j) { var h = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return h - Math.floor(h); }
  function heart(x, y, col, s) { s = s || 1; function h(a, b, w, hh) { R(x + a * s, y + b * s, w * s, hh * s, col); } h(1, 0, 2, 1); h(4, 0, 2, 1); h(0, 1, 7, 2); h(1, 3, 5, 1); h(2, 4, 3, 1); h(3, 5, 1, 1); }
  // handwriting: VT323 in soft brown ink, each letter tipped a little (spec 007, part B)
  function hand(cc, s, x, y, size, col, align, maxW) {
    var C0 = c; c = cc;
    c.font = (size || 12) + 'px "VT323", monospace'; c.textBaseline = 'alphabetic'; c.textAlign = 'left';
    var w = c.measureText(s).width;
    if (maxW && w > maxW) { while (s.length > 3 && c.measureText(s + '…').width > maxW) s = s.slice(0, -1); s += '…'; w = c.measureText(s).width; }
    if (align === 'center') x -= w / 2; if (align === 'right') x -= w;
    for (var i = 0, cx = x; i < s.length; i++) {
      var ch = s[i], cw = c.measureText(ch).width, a = (hash(i * 3 + s.length, y) - .5) * .22, dy = Math.round((hash(y, i) - .5) * 1.4);
      c.save(); c.translate(cx + cw / 2, y + dy); c.rotate(a); c.fillStyle = col || P.hand; c.fillText(ch, -cw / 2, 0); c.restore(); cx += cw;
    }
    c = C0; return w;
  }
  SS.hand = function (cc, s, x, y, size, col, align, maxW) { return hand(cc, s, x, y, size, col, align, maxW); };
  function chev(x, y, col, left) { for (var k = 0; k < 4; k++) R(left ? x + 3 - k : x + k, y + k, 1, 7 - k * 2, col); }
  function tabIcon(k, x, y, col) {
    var f = {
      cats: function () { R(x, y + 2, 7, 5, col); R(x, y, 1, 2, col); R(x + 3, y, 1, 2, col); R(x + 1, y + 3, 1, 1, '#fff'); R(x + 3, y + 3, 1, 1, '#fff'); R(x + 6, y + 1, 1, 3, col); },
      garden: function () { R(x + 3, y + 3, 1, 4, col); R(x, y + 1, 3, 2, col); R(x + 4, y, 3, 3, col); },
      kitchen: function () { R(x, y + 3, 6, 4, col); R(x - 1, y + 3, 8, 1, col); R(x + 6, y + 4, 2, 1, col); R(x + 1, y, 1, 2, col); R(x + 4, y, 1, 2, col); },
      holidays: function () { R(x + 3, y, 1, 1, col); R(x + 2, y + 1, 3, 2, col); R(x + 1, y + 3, 5, 2, col); R(x, y + 5, 7, 1, col); R(x + 3, y + 6, 1, 1, col); },
      home: function () { R(x + 3, y, 1, 1, col); R(x + 2, y + 1, 3, 1, col); R(x + 1, y + 2, 5, 1, col); R(x, y + 3, 7, 1, col); R(x + 1, y + 4, 5, 3, col); R(x + 3, y + 5, 1, 2, '#fff'); },
      friends: function () { R(x, y + 1, 3, 3, col); R(x - 1, y + 4, 5, 3, col); R(x + 4, y, 3, 3, col); R(x + 3, y + 4, 5, 3, col); },
      us: function () { heart(x, y, col); },
      notes: function () { R(x, y + 1, 7, 5, col); R(x + 1, y + 2, 2, 1, '#fff'); R(x + 1, y + 4, 4, 1, '#fff'); R(x + 3, y + 1, 1, 5, 'rgba(0,0,0,.15)'); },
      photos: function () { R(x, y + 2, 7, 5, col); R(x + 2, y + 1, 3, 1, col); R(x + 2, y + 3, 3, 3, '#fff'); R(x + 3, y + 4, 1, 1, col); }
    };
    f[k]();
  }
  function bookFrame(G, W, H, active) {
    var x = 8, y = 24, w = W - 30, h = H - 34;
    R(0, 0, W, H, 'rgba(34,18,28,.72)');
    R(x - 2, y + 3, w + 4, h, 'rgba(34,18,28,.45)');
    R(x - 4, y - 3, w + 6, h + 6, P.cloth); R(x - 4, y - 3, w + 6, 1, P.clothHi); R(x - 4, y + h + 2, w + 6, 1, P.clothSh);
    for (var k = 0; k < 40; k++) R(x - 4 + hash(k, 1) * (w + 6), y - 3 + hash(1, k) * (h + 6), 1, 1, 'rgba(255,255,255,.12)');   // cloth weave
    var th = Math.min(22, Math.floor((h - 12) / TABS.length));
    TABS.forEach(function (tb, i) {
      var ty = y + 6 + i * th, on = tb.k === active, tx = x + w + (on ? 0 : 1);
      R(tx, ty, on ? 16 : 13, th - 2, on ? P.page : tb.col); R(tx, ty + th - 3, on ? 16 : 13, 1, 'rgba(0,0,0,.18)');
      if (!on) R(tx, ty, 13, 1, 'rgba(255,255,255,.3)');
      tabIcon(tb.k, tx + (on ? 5 : 3), ty + Math.floor((th - 9) / 2), on ? tb.col : '#fff');
      G.hits.push({ x: tx - 2, y: ty, w: 18, h: th - 1, fn: function () { G.menu.tab = tb.k; G.menu.page = 0; } });
    });
    R(x, y + 2, w, h - 1, P.pageSh); R(x + 1, y + 1, w - 1, h - 1, '#f5ead6');
    R(x, y, w, h - 2, P.page);
    for (var g = 0; g < 26; g++) R(x + 4 + hash(g, 7) * (w - 8), y + 4 + hash(7, g) * (h - 12), 1, 1, 'rgba(180,140,100,.12)');   // paper flecks
    R(x, y, 3, h - 2, 'rgba(160,110,80,.12)');   // the gutter shadow
    G.hits.push({ x: x, y: y, w: w, h: h, fn: function () {}, block: true });
    return { x: x, y: y, w: w, h: h };
  }
  function tape(x, y, w, a, col) { c.save(); c.translate(x, y); c.rotate(a); R(-w / 2, -3, w, 6, col || P.tape); R(-w / 2, -3, w, 1, 'rgba(255,255,255,.35)'); for (var i = -w / 2; i < w / 2; i += 2) R(i, 2, 1, 1, 'rgba(255,255,255,.3)'); c.restore(); }
  function pageFoot(G, b, page, of) {
    var y = b.y + b.h - 18;
    R(b.x + 8, y - 3, b.w - 16, 1, P.pageLine);
    R(b.x + 8, y, 12, 12, P.sage); R(b.x + 8, y + 11, 12, 1, '#5d8580'); txt('B', b.x + 11, y + 3, '#fff', 6); txt('CLOSE', b.x + 24, y + 3, P.soft, 6);
    G.hits.push({ x: b.x + 4, y: y - 2, w: 62, h: 16, fn: function () { G.menu = null; } });
    chev(b.x + b.w - 52, y + 2, page > 1 ? P.rose : P.edge, true); txt(page + ' / ' + of, b.x + b.w - 30, y + 3, P.soft, 6, 'center'); chev(b.x + b.w - 14, y + 2, page < of ? P.rose : P.edge, false);
    G.hits.push({ x: b.x + b.w - 60, y: y - 4, w: 20, h: 18, fn: function () { SS.bookTurn(G, -1); } });
    G.hits.push({ x: b.x + b.w - 20, y: y - 4, w: 24, h: 18, fn: function () { SS.bookTurn(G, 1); } });
    // the turned-up page corner, tap to turn
    var cx = b.x + b.w, cy = b.y + b.h - 2; c.fillStyle = P.pageSh; c.beginPath(); c.moveTo(cx - 9, cy); c.lineTo(cx, cy - 9); c.lineTo(cx - 9, cy - 9); c.fill();
  }
  function snapFrame(x, y, w, h, a, img) { // white border, soft shadow, taped corners
    c.save(); c.translate(x + w / 2, y + h / 2); c.rotate(a); c.translate(-w / 2, -h / 2);
    R(2, 3, w, h, 'rgba(90,60,40,.22)'); R(0, 0, w, h, '#ffffff'); R(0, h - 1, w, 1, '#e6dbd0');
    if (img) { c.imageSmoothingEnabled = false; c.drawImage(img, 3, 3, w - 6, h - 6); }
    c.restore();
    tape(x + 4, y + 2, 16, -.6); tape(x + w - 4, y + 2, 16, .6, P.tape2);
  }
  function dotted(x, y, w, h) { c.strokeStyle = '#d9c4a6'; c.setLineDash([3, 3]); c.strokeRect(x + .5, y + .5, w - 1, h - 1); c.setLineDash([]); txt('?', x + w / 2, y + h / 2 - 5, '#d9c4a6', 10, 'center'); }
  function ribbon(G, x, y, w, chp, got) {
    R(x, y, w, 30, '#fde3ea'); R(x, y + 29, w, 1, '#f1b8c6');
    c.fillStyle = '#fde3ea'; c.beginPath(); c.moveTo(x + w, y); c.lineTo(x + w + 5, y + 15); c.lineTo(x + w, y + 30); c.fill();
    var sw = (w - 8) / 3;
    [3, 6, 10].forEach(function (n, i) {
      var sx = x + 4 + i * sw, done = got >= n;
      R(sx, y + 4, 22, 22, done ? '#fff6ea' : 'rgba(255,255,255,.5)'); c.strokeStyle = done ? P.rose : '#e8b6c3'; c.strokeRect(sx + .5, y + 4.5, 21, 21);
      if (!done) c.globalAlpha = .35;
      // the step's reward, drawn small: a little wrapped gift in the chapter's color (the pieces themselves come with part D)
      R(sx + 5, y + 11, 12, 11, chp.col); R(sx + 5, y + 11, 12, 1, 'rgba(255,255,255,.35)'); R(sx + 10, y + 11, 2, 11, '#fff6ea'); R(sx + 4, y + 9, 14, 3, chp.col); R(sx + 4, y + 9, 14, 1, 'rgba(255,255,255,.4)');
      R(sx + 8, y + 6, 3, 3, P.rose); R(sx + 11, y + 6, 3, 3, P.rose);
      c.globalAlpha = 1;
      txt(String(n), sx + 26, y + 6, done ? P.roseSh : '#d59aaa', 7);
      if (done) { R(sx + 26, y + 17, 2, 2, '#6aa361'); R(sx + 28, y + 19, 2, 2, '#6aa361'); R(sx + 30, y + 17, 2, 2, '#6aa361'); R(sx + 32, y + 15, 2, 2, '#6aa361'); }
      else vt(Math.min(got, n) + '/' + n, sx + 26, y + 15, '#c98a9a', 10);
    });
  }
  function rewardLine(G, chp, got) {
    var step = got >= 10 ? 2 : got >= 6 ? 1 : got >= 3 ? 0 : -1;
    if (G.mode !== 'life') return 'In Sandbox, every piece is already yours';
    if (step < 0) return 'Next at 3: ' + chp.rewards[0];
    return chp.rewards[step] + ': coming in an update';
  }
  function chapterPage(G, W, H, m) {
    var chp = SS.chapterOf(m.tab), list = SS.momentsIn(m.tab), got = SS.chapterCount(m.tab), b = bookFrame(G, W, H, m.tab), x = b.x + 8, w = b.w - 16, book = SS.book();
    var pages = Math.ceil(list.length / 2); m.page = Math.min(m.page, pages - 1);
    txt(chp.name, x, b.y + 8, P.ink, 8); txt(got + ' OF ' + list.length, b.x + b.w - 8, b.y + 9, P.soft, 6, 'right');
    var top = b.y + 22;
    if (m.page === 0) { ribbon(G, x, top, w - 6, chp, got); vt(rewardLine(G, chp, got), x + 2, top + 32, P.roseSh, 10); top += 48; }
    var bottom = b.y + b.h - 24, slot = Math.floor((bottom - top) / 2);
    [0, 1].forEach(function (i) {
      var mo = list[m.page * 2 + i]; if (!mo) return;
      var e = book.moments[mo.id], sy = top + i * slot, sh = Math.max(30, slot - 34), sw = Math.min(w - 20, Math.round(sh * 1.55));
      var sx = x + Math.round((w - sw) / 2) - 2;
      if (e) {
        snapFrame(sx, sy + 4, sw, sh, (hash(mo.id.length, i) - .5) * .06, SS.snapshot(mo.id, sw - 6, sh - 6));
        hand(c, mo.cap, x + 6, sy + sh + 18, 12, P.hand, 'left', w - 24);
        var d = new Date(e.date); hand(c, ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear(), x + 6, sy + sh + 29, 11, P.handSoft);
        heart(x + w - 12, sy + sh + 20, P.roseHi);
        G.hits.push({ x: sx, y: sy, w: sw, h: sh + 30, fn: function () {} });
      } else {
        dotted(sx + 6, sy + 6, sw - 12, sh - 4);
        hand(c, chp.show ? mo.cap : '???', x + 6, sy + sh + 18, 12, '#c9b49a', 'left', w - 24);
      }
    });
    pageFoot(G, b, m.page + 1, pages);
  }
  function folded(x, y, w, h, n, k) {
    if (!n) { c.strokeStyle = '#d9c4a6'; c.setLineDash([3, 3]); c.strokeRect(x + .5, y + .5, w - 1, h - 1); c.setLineDash([]); txt('?', x + w / 2, y + h / 2 - 9, '#d9c4a6', 8, 'center'); vt('still hidden', x + w / 2, y + h / 2 + 3, '#c9b49a', 10, 'center'); return; }
    var a = (hash(k, 3) - .5) * .08;
    c.save(); c.translate(x + w / 2, y + h / 2); c.rotate(a); c.translate(-w / 2, -h / 2);
    R(2, 3, w, h, 'rgba(90,60,40,.2)'); R(0, 0, w, h, P.paper);
    c.fillStyle = '#f1e4cc'; c.beginPath(); c.moveTo(0, 0); c.lineTo(w / 2, h * .42); c.lineTo(w, 0); c.fill();
    c.strokeStyle = '#e2d2b4'; c.beginPath(); c.moveTo(0, 0); c.lineTo(w / 2, h * .42); c.lineTo(w, 0); c.stroke();
    heart(w / 2 - 3.5, h * .42 - 3, P.rose);
    c.restore();
    var d = new Date(n.at);
    hand(c, n.where || 'a note', x + w / 2, y + h - 12, 10, P.hand, 'center', w - 6); hand(c, ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()] + ' ' + d.getDate(), x + w / 2, y + h - 3, 10, P.handSoft, 'center');
  }
  function notesPage(G, W, H, m) {
    var b = bookFrame(G, W, H, 'notes'), x = b.x + 8, w = b.w - 16, list = foundNotes(), total = SS.notesTotal();
    var per = 6, pages = Math.max(1, Math.ceil(total / per)); m.page = Math.min(m.page, pages - 1);
    txt('NOTES', x, b.y + 8, P.ink, 8); txt(list.length + ' OF ' + total + ' FOUND', b.x + b.w - 8, b.y + 9, P.soft, 6, 'right');
    vt('In the order you found them', x, b.y + 20, P.roseSh, 10);
    var gw = Math.floor((w - 8) / 2), gh = Math.min(64, Math.floor((b.h - 72) / 3) - 10), gy = b.y + 36;
    for (var i = 0; i < per; i++) {
      var n = list[m.page * per + i], col = i % 2, row = Math.floor(i / 2), nx = x + col * (gw + 8), ny = gy + row * (gh + 10);
      if (m.page * per + i >= total) break;
      folded(nx, ny, gw, gh, n, i);
      if (n) (function (n) { G.hits.push({ x: nx, y: ny, w: gw, h: gh, fn: function () { if (SS.showNote) SS.showNote(G, n.id); } }); })(n);
    }
    pageFoot(G, b, m.page + 1, pages);
  }
  function photosPage(G, W, H, m) {
    var b = bookFrame(G, W, H, 'photos'), x = b.x + 8, w = b.w - 16;
    txt('PHOTOS', x, b.y + 8, P.ink, 8); txt(SS.book().photos.length + ' PHOTOS', b.x + b.w - 8, b.y + 9, P.soft, 6, 'right');
    var cy = b.y + b.h / 2 - 30;
    R(x + w / 2 - 16, cy, 32, 24, '#5d7fa6'); R(x + w / 2 - 6, cy - 4, 12, 5, '#5d7fa6'); R(x + w / 2 - 7, cy + 5, 14, 14, '#fff'); R(x + w / 2 - 4, cy + 8, 8, 8, '#5d7fa6');
    hand(c, 'Photos you take with the camera', x + w / 2, cy + 44, 12, P.handSoft, 'center');
    hand(c, 'go here. You can add any of them', x + w / 2, cy + 56, 12, P.handSoft, 'center');
    hand(c, 'to a chapter\'s pages.', x + w / 2, cy + 68, 12, P.handSoft, 'center');
    pageFoot(G, b, 1, 1);
  }
  // ---------- Note found (memory-book-v1, state note): a folded paper opens over the dimmed home ----------
  // A fresh note says PUT IN THE BOOK, which files it; one read again from the Notes tab just closes.
  function noteOf(id) {
    var pv = window.SS_PRIVATE || {};
    if (id === 'tree') { var t = pv.treeNote || { lines: ['Merry Christmas.'], sign: 'Keegan' }; return { lines: t.lines, sign: t.sign, where: 'under the tree' }; }
    var n = (pv.notes || []).filter(function (q) { return q.id === id; })[0];
    return n ? { lines: n.lines, sign: n.sign || 'Keegan', where: n.where || '' } : { lines: ['(a note)'], sign: 'Keegan', where: '' };
  }
  SS.showNote = function (G, id, fresh) { G.bubble = null; G.toastT = null; G.menu = { kind: 'note', id: id, fresh: !!fresh, back: G.menu && G.menu.kind === 'book' ? G.menu : null }; };
  SS.closeNote = function (G) {
    var m = G.menu; if (!m || m.kind !== 'note') return;
    if (m.fresh) { SS.noteFound(G, m.id, noteOf(m.id).where); G.menu = null; G.toast('IN THE BOOK', 1600, 'Read it again any time in Notes.'); }
    else G.menu = m.back || null;
  };
  function drawNote(G, W, H, m) {
    var n = noteOf(m.id), t = G.t || 0, found = SS.book().notes[m.id], when = found ? new Date(found.found) : SS.now();
    R(0, 0, W, H, 'rgba(34,18,28,.6)');
    G.hits.push({ x: 0, y: 0, w: W, h: H, fn: function () {} });
    for (var s = 0; s < 10; s++) { var on = (Math.floor(t / 2) + s) % 3 !== 0, sx = 14 + hash(s, 1) * (W - 28), sy = 30 + hash(1, s) * (H - 90); if (on) { R(sx - 2, sy, 5, 1, '#fff3c4'); R(sx, sy - 2, 1, 5, '#fff3c4'); } }
    var pw = 168, px = (W - pw) / 2; R(px, 20, pw, 16, P.rose); R(px, 20, pw, 1, P.roseHi); R(px, 35, pw, 1, P.roseSh);
    heart(px + 8, 25, '#fff'); txt('A NOTE FROM ' + n.sign.toUpperCase(), px + 19, 25, '#fff', 6);
    var nx = 22, ny = 46, nw = W - 44, nh = Math.min(H - 112, 300);
    R(nx + 3, ny + 4, nw, nh, 'rgba(20,10,16,.4)'); R(nx, ny, nw, nh, P.paper);
    var third = Math.round(nh / 3);
    [1, 2].forEach(function (k) { R(nx, ny + third * k, nw, 1, '#e9dcc4'); R(nx, ny + third * k + 1, nw, 2, 'rgba(255,255,255,.9)'); });
    R(nx, ny, nw, third, 'rgba(240,226,200,.35)');
    for (var l = ny + 34; l < ny + nh - 10; l += 15) R(nx + 10, l, nw - 20, 1, 'rgba(143,179,204,.35)');
    R(nx + 18, ny + 6, 1, nh - 12, 'rgba(228,111,139,.25)');
    heart(nx + nw - 26, ny + 8, P.rose, 2);
    // his words, wrapped to the paper, in the handwriting style
    var lx = nx + 24, ly = ny + 32, maxW = nw - 34, rows = [];
    c.font = '12px "VT323", monospace';
    n.lines.forEach(function (line) { var words = line.split(' '), cur = ''; words.forEach(function (w) { var t2 = cur ? cur + ' ' + w : w; if (c.measureText(t2).width > maxW && cur) { rows.push(cur); cur = w; } else cur = t2; }); rows.push(cur); });
    var lh = 15, maxRows = Math.floor((nh - 70) / lh); rows = rows.slice(0, maxRows);
    rows.forEach(function (r, i) { hand(c, r, lx, ly + i * lh, 12); });
    var sy2 = ly + rows.length * lh + 8;
    hand(c, 'Love,', lx + 8, sy2, 13);
    var kw = hand(c, n.sign, lx + 26, sy2 + 15, 15, '#9e3a52'); heart(lx + 26 + kw + 5, sy2 + 5, P.rose);
    hand(c, ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][when.getMonth()] + ' ' + when.getDate() + (n.where ? ' · ' + n.where : ''), nx + nw - 10, ny + nh - 8, 10, P.handSoft, 'right');
    var by = ny + nh + 10, label = m.fresh ? 'PUT IN THE BOOK' : 'CLOSE';
    R(22, by, W - 44, 14, P.rose); R(22, by + 13, W - 44, 1, P.roseSh); R(22, by, W - 44, 1, P.roseHi); txt(label, W / 2, by + 4, '#fff', 6, 'center');
    G.hits.push({ x: 22, y: by - 2, w: W - 44, h: 18, fn: function () { SS.closeNote(G); } });
    if (m.fresh) vt('Read it again any time in Notes', W / 2, by + 18, 'rgba(255,241,226,.85)', 10, 'center');
  }
  SS.drawNote = function (G, W, H) { c = G.c; drawNote(G, W, H, G.menu); };
  SS.drawBook = function (G, W, H) {
    c = G.c; var m = G.menu;
    G.hits.push({ x: 0, y: 0, w: W, h: H, fn: function () {} });   // the book covers the home; taps outside it do nothing
    if (m.tab === 'notes') notesPage(G, W, H, m); else if (m.tab === 'photos') photosPage(G, W, H, m); else chapterPage(G, W, H, m);
  };

  // ---------- moments that come from the date: holidays, birthdays, the anniversary (spec 007 part A; spec 009 part D) ----------
  function nthThursday(y, mo, n) { var d = new Date(y, mo, 1), first = (4 - d.getDay() + 7) % 7 + 1; return first + (n - 1) * 7; }
  SS.bookDay = function (G) {
    var d = SS.now(), mo = d.getMonth(), day = d.getDate(), fire = function (id) { SS.moment(G, id); };
    if (mo === 11 && day === 25) fire('xmas-morning');
    if ((mo === 11 && day === 31 && d.getHours() === 23 && d.getMinutes() === 59) || (mo === 0 && day === 1)) fire('nye');
    if (mo === 1 && day === 14) fire('valentines');
    if ((mo === 2 && day >= 20) || mo === 3 || mo === 4 || (mo === 5 && day < 21)) fire('spring');
    if (mo === 6 && day === 4) fire('july4');
    if (mo === 10 && day === nthThursday(d.getFullYear(), 10, 4)) fire('thanksgiving');
    if (mo === 7 && day === 31) fire('bday-sarah');
    if (mo === 2 && day === 17) fire('bday-keegan');
    if (mo === 6 && day === 10) fire('anniversary');
    var year = ['first-snow', 'xmas-morning', 'nye', 'valentines', 'spring', 'july4', 'halloween', 'thanksgiving', 'bday-sarah', 'bday-keegan'];
    if (year.every(SS.hasMoment)) fire('holiday-year');
  };

  // ---------- moments watched once a second: the cats, Keegan, finished rooms ----------
  SS.bookTick = function (G) {
    if (!G.W || !G.cats) return;
    var L = G.cats.louie, Ra = G.cats.ralph, K = G.people && G.people.keegan, napping = function (a) { return !!a.on && (a.pose === 'curl' || a.pose === 'loaf'); };
    if (L && Ra && napping(L) && napping(Ra)) SS.moment(G, 'cats-asleep', { f: L.f, x: (L.x + Ra.x) / 2, y: (L.y + Ra.y) / 2 });
    if (Ra && K && G.kday && /cook/i.test(G.kday.text || '') && Ra.f === K.f && Math.hypot(Ra.x - K.x, Ra.y - K.y) < 2.6) SS.moment(G, 'ralph-cook', { f: K.f, x: (K.x + Ra.x) / 2, y: (K.y + Ra.y) / 2 });
    // Ralph steals Louie's warm spot: he naps where Louie was napping, within a couple of minutes of Louie getting up
    if (L) { if (napping(L)) G._louieSpot = { uid: L.on, t: performance.now() }; else if (G._louieSpot && !G._louieSpot.left) G._louieSpot.left = performance.now(); }
    if (Ra && G._louieSpot && G._louieSpot.left && napping(Ra) && Ra.on === G._louieSpot.uid && performance.now() - G._louieSpot.left < 120000) SS.moment(G, 'ralph-steal', { f: Ra.f, x: Ra.x, y: Ra.y });
    if (Ra && napping(Ra) && G.W.byUid[Ra.on] && /toy/.test(G.W.byUid[Ra.on].id)) SS.moment(G, 'ralph-toys', { f: Ra.f, x: Ra.x, y: Ra.y });
  };
  // a finished room (spec 007, part A, Claude default): every wall of the room has art or a shelf on its side, and the floor
  // has a rug and somewhere to sit
  SS.roomsFinished = function (G) {
    var W = G.W, out = [];
    W.home.floors.forEach(function (fl, f) {
      fl.rooms.forEach(function (r) {
        var room = null, tiles = []; for (var x = r.r[0] + W.ax; x < r.r[2] + W.ax; x++) for (var y = r.r[1] + W.ay; y < r.r[3] + W.ay; y++) { if (W.room(f, x, y) === r) { room = r; tiles.push(x + ',' + y); } }
        if (!room) return;
        var inRoom = function (p) { return W.floorOf(p) === f && !p.wall && !p.host && tiles.indexOf(p.x + ',' + p.y) >= 0; };
        var rug = W.pieces.some(function (p) { return inRoom(p) && W.def(p).kind === 'rug'; }), seat = W.pieces.some(function (p) { var d = W.def(p); return inRoom(p) && (d.use === 'sofa' || d.use === 'chair' || d.seat); });
        if (!rug || !seat) return;
        // the room's four sides: each one that has a wall needs a piece hung on the room's side of it
        var sides = { n: [], s: [], w: [], e: [] };
        W.walls[f].forEach(function (s) {
          if (s.op) return;
          if (s.axis === 'x') { if (s.b === r) sides.n.push(s); if (s.a === r) sides.s.push(s); } else { if (s.b === r) sides.w.push(s); if (s.a === r) sides.e.push(s); }
        });
        var hung = function (list, side) { return list.some(function (s) { return W.pieces.some(function (p) { return p.wall && p.f === f && (p.side || 1) === side && W.wallSegs(p).indexOf(s.x + ',' + s.y + s.axis) >= 0; }); }); };
        var ok = (!sides.n.length || hung(sides.n, 1)) && (!sides.s.length || hung(sides.s, -1)) && (!sides.w.length || hung(sides.w, 1)) && (!sides.e.length || hung(sides.e, -1));
        if (ok) out.push({ f: f, r: r, key: G.save.home + ':' + f + ':' + r.id, tiles: tiles });
      });
    });
    return out;
  };
  SS.bookRooms = function (G) {
    var b = SS.book(), done = SS.roomsFinished(G), fresh = done.filter(function (d) { return !b.rooms[d.key]; });
    fresh.forEach(function (d) { b.rooms[d.key] = SS.now().getTime(); });
    if (fresh.length) {
      var d0 = fresh[0], t = d0.tiles[0].split(','); saveBook();
      SS.moment(G, 'room-finished', { f: d0.f, x: +t[0] + .5, y: +t[1] + .5 });
      if (Object.keys(b.rooms).length >= 10) SS.moment(G, 'rooms-10', { f: d0.f, x: +t[0] + .5, y: +t[1] + .5 });
    }
    // every room in the Philly home redone: at least 3 pieces placed, moved or put away in each room (Claude default)
    var E = G.save.roomEdits || {}, rooms = [];
    G.W.home.floors.forEach(function (fl, f) { fl.rooms.forEach(function (r) { rooms.push(f + ':' + r.id); }); });
    if (G.save.home === 'philly' && rooms.length && rooms.every(function (k) { return (E[k] || 0) >= 3; })) SS.moment(G, 'philly-redone');
  };
  // a placed, moved or put-away piece counts toward its room being redone
  SS.roomEdit = function (G, p) {
    var W = G.W, f = W.floorOf(p), q = p.host ? W.hostOf(p) : p, r = q && !q.wall ? W.room(f, q.x, q.y) : null; if (!r) return;
    var E = G.save.roomEdits || (G.save.roomEdits = {}), k = f + ':' + r.id; E[k] = (E[k] || 0) + 1;
  };
  // the Christmas tree trimmed: a tree with at least 5 ornament or light pieces on or around it (spec 009 part D, Claude default)
  SS.bookTree = function (G) {
    var W = G.W;
    W.pieces.filter(function (p) { return p.id === 'christmas-tree' && !p.host; }).forEach(function (tr) {
      var ft = W.foot(tr), f = W.floorOf(tr);
      var n = W.pieces.filter(function (p) {
        if (p === tr || W.floorOf(p) !== f) return false; var d = W.def(p); if (!(d.tab === 'holiday' || d.light || d.lamp || /light|ornament|garland|wreath|stocking/.test(p.id))) return false;
        var q = p.host ? W.hostOf(p) : p, x = q.wall ? q.wall[0] : q.x, y = q.wall ? q.wall[1] : q.y;
        return x >= ft[0] - 2 && x < ft[2] + 2 && y >= ft[1] - 2 && y < ft[3] + 2;
      }).length;
      if (n >= 5) SS.moment(G, 'tree-trimmed', { f: f, x: (ft[0] + ft[2]) / 2, y: (ft[1] + ft[3]) / 2 });
    });
  };
})();
