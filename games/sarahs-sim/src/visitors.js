// Sarah's Sim: visitors (spec 008, part A with Dot's story, part B for one neighbor; mockups/visitor-v1).
//   The knock (Life): now and then, after 2 to 5 minutes of play, a knock shows over the front door with the visitor's face, and a
//   card: Let in or Not now. Not now is fine; they come back another time. At most one visitor each time she opens the game.
//   Visitor chat (visitor-v1): the front hall seen straight on, Sarah and the visitor drawn large, and the dialog box with a name
//   tab and the friendship hearts. 3 to 6 short lines, then the gig: on a story visit, the story's gig; after the story, an
//   ordinary gig. Chat lines come from a pool and don't repeat until it runs out (studio-bible/play.md).
//   Dot's story (bible, The block): 1. a flower arrangement for her table; 2. a window box (her set's first piece, the potting
//   bench, unlocks); 3. an outfit for her granddaughter's trip, on the Style screen; 4. her dusty sunroom into a guest room, one
//   big gig that pays 600; when it's done, the rest of her vintage florist set unlocks. Story gigs pay 250 (bible, Coins and
//   prices); Sandbox plays the story the same way but pays no coins.
//   Pacing (Claude default): Dot first, on her first day of Life; one story visit a day at most. The other three neighbors, the
//   street (part C) and real people (part D) come next.
//   Friendship: grows with every chat and every gig (more with more hearts), never goes down; at 3 hearts a gift, at 5 a favorite.
(function () {
  var P = SS.P, R = SS.R, txt = SS.txt;

  // ---------- Dot's vintage florist set (bible, The block) ----------
  function add(def) { def.parts = def.parts || []; def.swatches = def.swatches || [{}]; def.spots = def.spots || []; SS.CATALOG.push(def); SS.DEF[def.id] = def; return def; }
  function r(c, x, y, w, h, col) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
  add({ id: 'potting-bench', name: 'Potting bench', tab: 'tables', set: 'dot', w: 2, d: 1, kind: 'floor', h: 34, top: 18, price: 320,
    parts: [['wood', 'wood'], ['pots', 'plain']], spots: [[.5, .5], [1.5, .5]],
    swatches: [{ wood: '#b9804f', pots: '#d98a6f' }, { wood: '#8e5a37', pots: '#e8a28c' }, { wood: '#7fa7a0', pots: '#fff1e2' }, { wood: '#fff1e2', pots: '#d98a6f' }],
    draw: function (M) {
      M.shadow(.1, .15, 1.8, .7);
      [[.12, .15], [1.8, .15], [.12, .75], [1.8, .75]].forEach(function (q) { M.box(q[0], q[1], .08, .08, 18, 0, 'wood', { hi: false }); });
      M.box(.1, .15, 1.8, .7, 3, 15, 'wood'); M.box(.15, .2, 1.7, .6, 1, 5, 'wood');
      M.box(.1, .1, 1.8, .06, 16, 18, 'wood');   // the back board with a little shelf
      M.box(.15, .1, 1.7, .18, 2, 28, 'wood');
      M.spr(1, .2, 30, function (c, x, y) { var Pp = M.ramp('pots'); [-14, -4, 6].forEach(function (k, i) { r(c, x + k, y - 5, 6, 5, Pp[1]); r(c, x + k, y - 5, 2, 5, Pp[0]); r(c, x + k + 1, y - 9, 4, 4, ['#6aa361', '#e46f8b', '#437a47'][i]); }); }, [1, 12]);
      M.spr(1, .5, 5, function (c, x, y) { r(c, x - 10, y - 4, 8, 4, '#c78f3e'); r(c, x - 10, y - 4, 8, 1, '#e7b75f'); r(c, x + 3, y - 3, 5, 3, '#8a7f75'); }, [.6, 6]);
    } });
  add({ id: 'flower-cart', name: 'Flower cart', tab: 'decor', set: 'dot', w: 1, d: 1, kind: 'floor', h: 30, price: 280,
    parts: [['cart', 'wood']],
    swatches: [{ cart: '#7fa7a0' }, { cart: '#b9804f' }, { cart: '#e46f8b' }, { cart: '#fff1e2' }],
    draw: function (M, t) {
      M.shadow(.15, .2, .7, .6);
      M.box(.15, .25, .7, .5, 12, 6, 'cart');
      M.spr(.2, .75, 6, function (c, x, y) { c.fillStyle = '#3b2430'; c.beginPath(); c.arc(x, y - 1, 5, 0, 7); c.fill(); c.fillStyle = '#8e5a37'; c.beginPath(); c.arc(x, y - 1, 4, 0, 7); c.fill(); r(c, x - 1, y - 2, 2, 2, '#c78f3e'); }, [.2, 10]);
      M.spr(.5, .5, 18, function (c, x, y) { var sw = Math.round(Math.sin(t / 3) * .6); [[-8, -4, '#e46f8b'], [-3, -7, '#ffd56b'], [2, -5, '#c8a6d8'], [6, -8, '#f39bb0'], [-6, -9, '#fff1e2'], [4, -2, '#e46f6a'], [0, -10, '#e46f8b']].forEach(function (f) { r(c, x + f[0] + sw, y + f[1], 3, 3, f[2]); r(c, x + f[0] + sw, y + f[1], 1, 1, 'rgba(255,255,255,.6)'); }); [[-7, 0], [1, 0], [7, -1]].forEach(function (l) { r(c, x + l[0], y + l[1] - 2, 3, 2, '#6aa361'); }); }, [.4, 14]);
    } });
  add({ id: 'wicker-chair', name: 'Wicker chair', tab: 'seating', set: 'dot', w: 1, d: 1, kind: 'floor', h: 34, price: 260, use: 'chair', seat: 13,
    parts: [['wicker', 'wood'], ['cushion', 'fab']],
    swatches: [{ wicker: '#e2c39c', cushion: '#9cc1a0' }, { wicker: '#c78f3e', cushion: '#f39bb0' }, { wicker: '#fff1e2', cushion: '#e7b75f' }, { wicker: '#8e5a37', cushion: '#fff6ea' }],
    draw: function (M) {
      M.shadow(.15, .15, .7, .7);
      M.box(.15, .2, .7, .65, 12, 0, 'wicker');
      M.box(.2, .25, .6, .55, 2, 12, 'cushion');
      M.box(.15, .15, .7, .12, 22, 12, 'wicker');   // the tall round back
      M.box(.15, .2, .1, .65, 8, 12, 'wicker'); M.box(.75, .2, .1, .65, 8, 12, 'wicker');
      M.spr(.5, .2, 12, function (c, x, y) { var W0 = M.ramp('wicker'); for (var k = 0; k < 5; k++) r(c, x - 7, y - 4 - k * 4, 14, 1, W0[2]); }, [.4, 24]);
    } });
  add({ id: 'big-fern', name: 'Big fern', tab: 'plants', set: 'dot', w: 1, d: 1, kind: 'floor', h: 40, price: 140, moves: 'sway', anim: 24,
    parts: [['pot', 'wood']], swatches: [{ pot: '#d98a6f' }, { pot: '#fff1e2' }, { pot: '#7fa7a0' }, { pot: '#2f2228' }],
    draw: function (M, t) {
      M.eshadow(.5, .5, 9);
      M.box(.22, .22, .56, .56, 10, 0, 'pot');
      M.spr(.5, .5, 10, function (c, x, y) {
        var sw = Math.sin(t / 3.8) * 1.2;
        [[-1, 1], [1, 1], [-1, .6], [1, .6], [0, 1.1], [-1, .3], [1, .3]].forEach(function (f, i) {
          var len = 14 + (i % 3) * 3, ang = f[0] * (0.5 + f[1] * .6), ex = Math.sin(ang) * len + sw, ey = -Math.cos(ang) * len * .9;
          for (var k = 1; k <= len; k += 2) { var u = k / len, px = x + ex * u, py = y + ey * u + (u * u * 6); r(c, px - 2, py, 2, 1, '#437a47'); r(c, px + 1, py, 2, 1, '#6aa361'); r(c, px, py, 1, 1, '#2f5a30'); }
        });
      }, [.4, 30]);
    } });
  // a set's pieces wait until they're unlocked (Life); Sandbox has every piece (spec 008, part B)
  SS.setLocked = function (G, d) { if (!d.set || G.mode === 'sandbox') return false; var v = (G.save.visit || {})[d.set] || {}; return (v.unlocked || []).indexOf(d.id) < 0; };

  // ---------- who visits, and what they say (Claude draft beats from the bible's The block) ----------
  var CAST = SS.VISITORS = {
    dot: {
      name: 'DOT', rel: 'Your neighbor two doors up',
      story: [
        { lines: ['Well hello, dear! I\'m Dot, from two doors up.', 'I\'ve been watching your home come together.', 'Lovely work. I was a florist for forty years,', 'so I notice these things.'],
          ask: ['Would you put together an arrangement', 'for my table? Something cheerful.'],
          gig: { kind: 'room', ask: 'A cheerful arrangement for her table', where: 'The corner of her front room', w: 4, d: 3, floor: 'planks', paper: 'rose', likes: ['plants', 'table', 'warm'] } },
        { lines: ['Your plants look happy, dear. A little secret:', 'talk to them in the morning. And the cats,', 'I may have slipped them a treat on the step.'],
          ask: ['My window box is a sorry sight. Would you', 'make it bloom for me?'],
          gig: { kind: 'room', ask: 'A window box full of color', where: 'Under her front window', w: 4, d: 2, floor: 'planks', paper: 'sage', likes: ['plants', 'warm', 'lights'] },
          unlock: ['potting-bench'] },
        { lines: ['Guess who\'s coming to stay! My granddaughter,', 'on the train next week. She\'s twenty-two and', 'thinks her nana has no style.'],
          ask: ['Would you help me pick something for her to', 'wear for the trip? Warm, comfy, and bright.'],
          gig: { kind: 'outfit', ask: 'A warm, comfy, bright outfit for the train', where: 'For her granddaughter', likes: ['warm', 'comfy-shoes', 'color'] } },
        { lines: ['She loved it, dear. She wore it the whole visit.', 'But she slept in my dusty old sunroom, with the', 'boxes and the dead ferns. I was mortified.'],
          ask: ['Would you come over and turn it into a proper', 'guest room? Plants everywhere, please.'],
          gig: { kind: 'room', ask: 'Her dusty sunroom into a guest room', where: 'Dot\'s sunroom', w: 7, d: 6, floor: 'planks', paper: 'honey', likes: ['plants', 'bed', 'seating'], pay: 600, home: true },
          unlock: ['flower-cart', 'wicker-chair', 'big-fern'] }
      ],
      // ordinary chats after the story; picks don't repeat until the pool runs out
      pool: ['The tulips came up early this year.', 'Ralph sat on my step all morning. I didn\'t mind.', 'My granddaughter asked about you again.', 'Rain tomorrow, my knees say.', 'I pressed a flower from your window box.', 'The guest room is the nicest room I have now.', 'I found my old florist apron. Still fits!', 'Louie gave me a look today. A very judging look.']
    }
  };
  function V(G, who) { var S = G.save, all = S.visit || (S.visit = {}); return all[who] || (all[who] = { step: 0, last: null, said: [], unlocked: [], pts: 0, home: 'closed' }); }
  SS.visitOf = V;
  SS.friendHearts = function (G, who) { var v = (G.save.visit || {})[who], pts = (v ? v.pts : 0) + ((G.save.friends || {})[who] || 0); return Math.min(5, 1 + Math.floor(pts / 2)); };
  function today() { return SS.now().toDateString(); }
  function grow(G, who, n) {
    var before = SS.friendHearts(G, who); V(G, who).pts += n; var after = SS.friendHearts(G, who);
    if (before < 3 && after >= 3) { SS.moment(G, 'visitor-gift'); gift(G, 'vase-of-flowers', CAST[who].name.charAt(0) + CAST[who].name.slice(1).toLowerCase() + ' brought you flowers from her garden.'); }
    if (before < 5 && after >= 5) gift(G, 'snake-plant', 'Dot gave you her favorite plant, a cutting from her own.');
    if (Object.keys(G.save.visit || {}).filter(function (k) { return SS.friendHearts(G, k) >= 3; }).length >= 3) SS.moment(G, 'three-friends');
  }
  function gift(G, id, line) { G.save.stored.push({ id: id, sw: 0, props: true }); G.toast('A GIFT', 2400, line + ' It\'s in your storage.'); }

  // ---------- the knock ----------
  // who's due: Dot on her first day, then one story visit a day; after the story, now and then with an ordinary gig
  SS.visitorDue = function (G) {
    if (G.mode !== 'life' || G.away || G.gig) return null;
    var v = V(G, 'dot'); if (v.last === today()) return null;
    return 'dot';
  };
  SS.scheduleKnock = function (G) { G.knockAt = performance.now() + (120 + Math.random() * 180) * 1000; G.knock = null; G.knocked = false; };
  SS.knockTick = function (G) {
    if (G.knocked || G.knock || !G.knockAt || performance.now() < G.knockAt || G.menu || G.confirm || G.build.on || G.camera || G.sleeping) return;
    var who = SS.visitorDue(G); if (!who) { G.knocked = true; return; }
    G.knock = { who: who, t0: performance.now() }; G.knocked = true;
  };
  SS.forceKnock = function (G, who) { G.knock = { who: who || 'dot', t0: performance.now() }; G.knocked = true; };   // for the checks
  SS.knockNotNow = function (G) { G.knock = null; G.toast('MAYBE ANOTHER TIME', 1200, 'They\'ll come back another day.'); };
  SS.letIn = function (G) {
    var who = G.knock.who, v = V(G, who); G.knock = null;
    SS.moment(G, 'visitor');
    var story = CAST[who].story[v.step], lines;
    if (story) lines = story.lines.slice();
    else { // an ordinary visit: two lines from the pool, never repeating until it's used up
      var pool = CAST[who].pool, left = pool.filter(function (l) { return v.said.indexOf(l) < 0; }); if (left.length < 2) { v.said = []; left = pool.slice(); }
      lines = []; for (var i = 0; i < 2; i++) { var l = left.splice(Math.floor(Math.random() * left.length), 1)[0]; lines.push(l); v.said.push(l); }
      lines.push('Have you got time for a little job, dear?');
    }
    v.last = today(); grow(G, who, 1); G.changed(true);
    G.bubble = null; G.meters = null;
    G.menu = { kind: 'visit', who: who, lines: wrapAll(lines), i: 0, story: !!story, cur: 0, ask: story ? story.ask : null };
  };
  function wrapAll(lines) { var out = []; lines.forEach(function (l) { out.push(l); }); return out; }
  // the chat: two lines at a time; then the ask and its choices
  SS.visitNext = function (G) {
    var m = G.menu; if (m.asking) return;
    m.i += 2;
    if (m.i >= m.lines.length) { m.asking = true; m.cur = 0; }
  };
  SS.visitPick = function (G, i) {
    var m = G.menu, who = m.who, v = V(G, who);
    G.menu = null;
    if (i !== 0) { G.toast('ANOTHER TIME, THEN', 1400, CAST[who].name.charAt(0) + CAST[who].name.slice(1).toLowerCase() + ' will ask again on her next visit.'); v.last = null; v.wait = today(); return; }
    if (!m.story) { SS.findGigs(G, who); return; }
    var st = CAST[who].story[v.step], o = JSON.parse(JSON.stringify(st.gig)); o.who = who; o.story = v.step;
    if (o.kind === 'outfit') SS.startOutfitGig(G, o); else SS.startGig(G, o);
  };
  // a story gig handed in: the next step, its unlocks, the moments
  SS.storyGigDone = function (G, o, hearts) {
    var who = o.who, v = V(G, who), st = CAST[who].story[o.story];
    grow(G, who, hearts);
    if (o.story !== v.step) return;
    v.step++;
    (st.unlock || []).forEach(function (id) { if (v.unlocked.indexOf(id) < 0) v.unlocked.push(id); });
    if (st.unlock && G.mode === 'life') setTimeout(function () { G.toast('NEW IN YOUR CATALOG', 2600, st.unlock.map(function (id) { return SS.DEF[id].name; }).join(', ') + ', from ' + CAST[who].name.charAt(0) + CAST[who].name.slice(1).toLowerCase() + '\'s florist set.'); }, 2300);
    if (o.home) { v.home = 'done'; SS.moment(G, 'neighbor-redone'); SS.moment(G, 'story'); if (Object.keys(CAST).every(function (k) { return V(G, k).home === 'done'; })) SS.moment(G, 'all-stories'); }
    G.changed(true);
  };

  // ---------- an outfit gig: dress their person on the Style screen (spec 006 part F, outfit gigs; spec 002) ----------
  var GUEST = { face: 'oval', eyes: 'lashes', eye: 6, nose: 'button', lips: 'smile', lip: 4, build: 'slim', skin: 2, blush: true, freckles: true };
  var OUT_LIKES = SS.OUTFIT_LIKES = {
    warm: { label: 'warm', test: function (o) { return !!o.coat || (o.top && /hoodie|flannel/.test(SS.CLOTHES.filter(function (d) { return d.id === o.top.id; })[0].kind)); } },
    'comfy-shoes': { label: 'comfy shoes', test: function (o) { return !!(o.shoes && /hightops|boots/.test(SS.CLOTHES.filter(function (d) { return d.id === o.shoes.id; })[0].kind)); } },
    color: { label: 'bright', test: function (o) { return ['top', 'dress', 'coat'].some(function (k) { if (!o[k]) return false; var d = SS.CLOTHES.filter(function (q) { return q.id === o[k].id; })[0], c = d.sw[o[k].sw || 0][1], n = parseInt(c.slice(1), 16), R0 = n >> 16 & 255, G0 = n >> 8 & 255, B0 = n & 255, mx = Math.max(R0, G0, B0), mn = Math.min(R0, G0, B0); return mx - mn > 90; }); } }
  };
  SS.startOutfitGig = function (G, o) {
    G.styleGig = { offer: o, look: GUEST, outfit: { hair: 'curls', shade: 6, top: { id: 'orange-rocks-tee', sw: 3 }, bottom: { id: 'straight-jeans', sw: 2 } } };
    SS.openStyle(G, 'guest'); G.menu.tab = 'tops';
    G.gig = { offer: o, outfit: true, home: { W: G.W }, start: Date.now() };
    G.toast('DRESS DOT\'S GRANDDAUGHTER', 2200, 'Pieces are lent free. Hand it in from the banner.');
  };
  SS.outfitMatches = function (G) { var o = G.styleGig.outfit; return G.styleGig.offer.likes.map(function (k) { return OUT_LIKES[k].test(o); }); };
  SS.handInOutfit = function (G) {
    var m = SS.outfitMatches(G), n = m.filter(Boolean).length, hearts = Math.max(1, n), o = G.styleGig.offer;
    var img = SS.figure(G, 'guest', 0, 0);
    G.menu = { kind: 'gigdone', hearts: hearts, pay: G.mode === 'life' ? 250 : 0, missed: o.likes.filter(function (k, i) { return !m[i]; }), outfitImg: img, img: null };
  };

  // ---------- drawing: the knock over the front door, and the hall chat (visitor-v1) ----------
  SS.drawKnock = function (G, W, H, toScreen) {
    var K = G.knock; if (!K) return; var c = G.c, Wd = G.W, t = G.t, hit = SS.hit;
    // over the front door, if she can see it; else at the top of the view
    var door = null; Wd.walls[0].forEach(function (s) { if (s.op === 'door' && s.ext && (!door || s.y > door.y)) door = s; });
    var bx = 100, by = 40;
    if (door && G.floor === 0) { var q = SS.vp(door.x + .5, door.y, 50), sc = toScreen(q[0], q[1]); bx = Math.max(4, Math.min(W - 80, Math.round(sc[0] - 36))); by = Math.max(26, Math.round(sc[1] - 42)); }
    SS.card(bx, by, 72, 34); c.fillStyle = P.tray; c.beginPath(); c.moveTo(bx + 30, by + 33); c.lineTo(bx + 42, by + 33); c.lineTo(bx + 36, by + 42); c.closePath(); c.fill();
    c.save(); c.beginPath(); c.rect(bx + 4, by + 4, 26, 26); c.clip(); R(bx + 4, by + 4, 26, 26, '#e6efdf'); SS.drawDotHead(c, bx + 2, by + 4, 1.25, t); c.restore();
    var j = t % 2; txt('KNOCK', bx + 34, by + 8 + j, P.ink, 6); txt('KNOCK', bx + 36, by + 19 - j, P.ink, 6);
    hit(G, bx, by, 72, 42, function () { SS.letIn(G); });
    // Let in or Not now
    var cy = G.viewBottom - 64; SS.card(8, cy, W - 16, 56);
    txt(CAST[K.who].name + ' IS AT THE DOOR', W / 2, cy + 7, P.ink, 6, 'center');
    SS.vt(CAST[K.who].rel, W / 2, cy + 16, P.soft, 11, 'center');
    SS.btn(16, cy + 32, 100, 'NOT NOW', false, 18); hit(G, 16, cy + 30, 100, 22, function () { SS.knockNotNow(G); });
    SS.btn(W - 116, cy + 32, 100, 'LET IN', true, 18); hit(G, W - 116, cy + 30, 100, 22, function () { SS.letIn(G); });
  };
  SS.knockPress = function (G, k) { if (k === 'a') SS.letIn(G); else if (k === 'b') SS.knockNotNow(G); else return false; return true; };
  function heart(x, y, on) { var col = on ? P.rose : '#e8dccd'; R(x + 1, y, 2, 1, col); R(x + 4, y, 2, 1, col); R(x, y + 1, 7, 2, col); R(x + 1, y + 3, 5, 1, col); R(x + 2, y + 4, 3, 1, col); R(x + 3, y + 5, 1, 1, col); if (on) R(x + 1, y + 1, 1, 1, '#ffd0dc'); }
  SS.drawVisit = function (G, W, H) {
    var c = G.c, m = G.menu, t = G.t, hit = SS.hit;
    c.fillStyle = '#22171f'; c.fillRect(0, 0, W, H); hit(G, 0, 0, W, H, function () { if (!m.asking) SS.visitNext(G); });
    var fl = hall(c, W, H, t), feet = fl + 46;
    var sh = function (x, y, w) { c.fillStyle = 'rgba(90,45,40,.25)'; c.beginPath(); c.ellipse(x, y, w / 2, w / 6, 0, 0, 7); c.fill(); };
    sh(58, feet, 44); SS.drawSarahSprite(c, 31, feet - 114, 3, t, false, 'orange', 'bun');
    sh(160, feet, 46); SS.drawDot(c, 130, feet - 120, 3, t);
    SS.drawTopBar(G, W);
    // the dialog box: name tab, hearts and Friends; two lines at a time; then the ask with two choices
    var lines = m.asking ? m.ask || ['Have you got time for a little job, dear?'] : m.lines.slice(m.i, m.i + 2), choices = m.asking ? ['I\'d love to!', 'Maybe another time'] : null;
    if (m.asking && !m.story) lines = ['Have you got time for a little job, dear?'];
    var bh = choices ? 84 : 62, by = H - bh - 4, name = CAST[m.who].name;
    R(4, by, W - 8, bh, P.tray); R(4, by + bh - 1, W - 8, 1, P.trayEdge); c.strokeStyle = P.rose; c.lineWidth = 2; c.strokeRect(5, by + 1, W - 10, bh - 2); c.lineWidth = 1;
    c.font = '7px "Press Start 2P", monospace'; var tw = Math.ceil(c.measureText(name).width) + 14;
    R(10, by - 13, tw, 14, P.rose); R(10, by - 13, tw, 1, P.roseHi); txt(name, 17, by - 9, '#fff', 7);
    R(tw + 16, by - 12, 86, 12, P.tray); R(tw + 16, by - 1, 86, 1, P.trayEdge);
    var hearts = SS.friendHearts(G, m.who); for (var i = 0; i < 5; i++) heart(tw + 20 + i * 9, by - 9, i < hearts);
    SS.vt('Friends', tw + 66, by - 13, P.soft, 11);
    lines.forEach(function (l, i) { SS.vt(l, 14, by + 6 + i * 13, '#3b2430', 13); });
    if (choices) choices.forEach(function (ch, i) {
      var cy = by + 34 + i * 20, sel = i === m.cur;
      R(18, cy, W - 36, 17, sel ? '#fde3ea' : '#fbeedd'); R(18, cy + 16, W - 36, 1, P.trayEdge); if (sel) { c.strokeStyle = P.rose; c.strokeRect(18.5, cy + .5, W - 37, 16); c.fillStyle = P.rose; c.beginPath(); c.moveTo(24, cy + 4); c.lineTo(30, cy + 8.5); c.lineTo(24, cy + 13); c.closePath(); c.fill(); }
      SS.vt(ch, 36, cy + 2, P.ink, 13);
      hit(G, 18, cy - 1, W - 36, 19, function () { SS.visitPick(G, i); });
    });
    else if (t % 2 === 0) { c.fillStyle = P.rose; c.beginPath(); c.moveTo(W - 22, by + bh - 14); c.lineTo(W - 14, by + bh - 14); c.lineTo(W - 18, by + bh - 9); c.closePath(); c.fill(); }
  };
  SS.visitPress = function (G, k) {
    var m = G.menu;
    if (m.asking) { if (k === 'up' || k === 'down') m.cur = 1 - m.cur; if (k === 'a') SS.visitPick(G, m.cur); if (k === 'b') SS.visitPick(G, 1); return; }
    if (k === 'a' || k === 'b') SS.visitNext(G);
  };
  // the front hall, seen straight on (visitor-v1), the door open onto the street
  function hall(c, W, H, t) {
    var fl = H - 112;
    R(0, 0, W, fl, '#e6efdf');
    for (var x = 0; x < W; x += 16) R(x, 0, 8, fl, '#dbe8d2');
    for (var y = 10, row = 0; y < fl - 30; y += 18, row++) for (var x2 = (row % 2) * 8 + 4; x2 < W; x2 += 16) { R(x2, y, 2, 2, '#f0b3c4'); R(x2 + 1, y + 2, 1, 2, '#9cc1a0'); }
    var gy = Math.max(26, fl - 190);
    R(18, gy, 42, 32, '#c88d5a'); R(21, gy + 3, 36, 26, '#9cc1b6'); R(21, gy + 18, 36, 11, '#6aa361'); c.fillStyle = '#ffd56b'; c.beginPath(); c.arc(48, gy + 10, 4, 0, 7); c.fill(); R(28, gy + 14, 3, 6, '#e46f8b'); R(36, gy + 15, 3, 5, '#c8a6d8');
    R(68, gy + 6, 26, 22, '#fbf4ea'); R(70, gy + 8, 22, 18, '#e8dccd'); c.fillStyle = '#e8963f'; c.beginPath(); c.ellipse(76, gy + 21, 4, 3, 0, 0, 7); c.fill(); c.fillStyle = '#8a8590'; c.beginPath(); c.ellipse(86, gy + 21, 4, 3, 0, 0, 7); c.fill(); R(73, gy + 16, 2, 2, '#e8963f'); R(84, gy + 16, 2, 2, '#8a8590');
    R(120, 0, 1, gy + 4, '#6b4250'); c.fillStyle = '#f6c86e'; c.beginPath(); c.moveTo(112, gy + 14); c.lineTo(129, gy + 14); c.lineTo(124, gy + 4); c.lineTo(117, gy + 4); c.closePath(); c.fill(); R(118, gy + 14, 5, 2, '#fff3c4');
    var pg = c.createRadialGradient(120, gy + 16, 2, 120, gy + 16, 50); pg.addColorStop(0, 'rgba(255,214,140,.3)'); pg.addColorStop(1, 'rgba(255,214,140,0)'); c.fillStyle = pg; c.fillRect(70, gy - 30, 100, 100);
    R(0, fl - 36, W, 36, '#fbf4ea'); R(0, fl - 38, W, 3, '#fff8ee'); R(0, fl - 35, W, 1, '#e9dcc4');
    for (var p = 6; p < W; p += 26) { R(p, fl - 30, 20, 24, '#f3e8d8'); R(p, fl - 30, 20, 1, '#e2d4c0'); R(p, fl - 7, 20, 1, '#fffaf3'); }
    R(0, fl - 5, W, 5, '#e2d4c0');
    R(0, fl, W, H - fl, '#c88d5a');
    for (var fy = fl, k = 0; fy < H; fy += 9, k++) { R(0, fy, W, 1, '#93603c'); for (var fx = (k * 37) % 60; fx < W; fx += 60) R(fx, fy, 1, 9, '#93603c'); R(0, fy + 1, W, 1, 'rgba(255,220,180,.15)'); }
    c.fillStyle = '#b9505a'; c.beginPath(); c.moveTo(70, fl + 4); c.lineTo(170, fl + 4); c.lineTo(214, H); c.lineTo(26, H); c.closePath(); c.fill();
    c.fillStyle = '#e7b75f'; c.beginPath(); c.moveTo(76, fl + 8); c.lineTo(164, fl + 8); c.lineTo(204, H); c.lineTo(36, H); c.closePath(); c.fill();
    c.fillStyle = '#c9636b'; c.beginPath(); c.moveTo(82, fl + 12); c.lineTo(158, fl + 12); c.lineTo(194, H); c.lineTo(46, H); c.closePath(); c.fill();
    var dx = 124, dw = 60, dt = fl - 112;
    R(dx - 6, dt - 8, dw + 12, 116, '#fff8ee'); R(dx - 6, dt - 8, dw + 12, 2, '#fffaf3'); R(dx - 6, dt - 8, 2, 116, '#e9dcc4'); R(dx + dw + 4, dt - 8, 2, 116, '#e2d4c0');
    R(dx + 6, dt - 6, dw - 12, 6, '#9ec3dc'); R(dx + 6, dt - 6, dw - 12, 1, '#c9dfee');
    R(dx, dt, dw, 108, '#a9d0ec'); R(dx, dt + 4, dw, 70, '#b46a5a');
    for (var wx = dx + 6; wx < dx + dw - 8; wx += 18) for (var wy = dt + 12; wy < dt + 64; wy += 22) { R(wx, wy, 10, 14, '#efe2d2'); R(wx + 1, wy + 1, 8, 12, '#8fb3cc'); }
    R(dx, dt + 74, dw, 14, '#c9bfb2'); R(dx, dt + 74, dw, 1, '#e4dcd2'); R(dx, dt + 88, dw, 20, '#8b8189');
    c.fillStyle = P.leaf; c.beginPath(); c.arc(dx + 10, dt + 30, 14, 0, 7); c.fill(); c.fillStyle = P.leafHi; c.beginPath(); c.arc(dx + 6, dt + 25, 6, 0, 7); c.fill(); R(dx + 9, dt + 40, 3, 34, '#6b4a30');
    R(dx + dw - 2, dt, 8, 108, '#3f6f68'); R(dx + dw - 2, dt, 2, 108, '#5d8580'); R(dx - 2, dt + 104, dw + 4, 4, '#a8907a');
    R(14, dt + 6, 70, 4, '#c88d5a'); R(14, dt + 6, 70, 1, '#e2b07e');
    [26, 46, 66].forEach(function (hx) { R(hx, dt + 10, 2, 4, '#704328'); });
    R(20, dt + 14, 14, 30, '#3c6a55'); for (var q = 0; q < 30; q += 6) R(20, dt + 14 + q, 14, 1, '#b8434a'); R(26, dt + 14, 1, 30, '#b8434a');
    R(40, dt + 14, 12, 18, '#e9d6c4'); R(40, dt + 14, 12, 2, '#d8c2ae'); R(43, dt + 20, 6, 6, P.rose);
    R(60, dt + 14, 10, 24, '#f7922e'); R(60, dt + 14, 10, 3, '#ffb760');
    R(10, fl - 44, 70, 5, '#c88d5a'); R(10, fl - 44, 70, 1, '#e2b07e'); R(14, fl - 39, 3, 34, '#9c6a40'); R(73, fl - 39, 3, 34, '#9c6a40');
    R(60, fl - 50, 12, 6, '#7fa7a0'); R(61, fl - 50, 10, 1, '#a8cbc0'); R(64, fl - 49, 1, 1, '#e7bb4f'); R(66, fl - 48, 2, 1, '#d6dde2');
    R(22, fl - 62, 2, 18, '#704328'); c.fillStyle = '#f6c86e'; c.beginPath(); c.moveTo(16, fl - 62); c.lineTo(30, fl - 62); c.lineTo(27, fl - 72); c.lineTo(19, fl - 72); c.closePath(); c.fill();
    var gl = c.createRadialGradient(23, fl - 64, 2, 23, fl - 64, 40); gl.addColorStop(0, 'rgba(255,214,140,.35)'); gl.addColorStop(1, 'rgba(255,214,140,0)'); c.fillStyle = gl; c.fillRect(-20, fl - 110, 90, 90);
    R(200, fl - 14, 16, 14, '#d98a6f'); R(200, fl - 14, 16, 2, '#e8a28c');
    [[204, -24, 7], [212, -28, 8], [208, -36, 6], [216, -20, 5], [200, -20, 5]].forEach(function (l) { c.fillStyle = P.leafSh; c.beginPath(); c.ellipse(l[0], fl + l[1], l[2], l[2] * .6, .4, 0, 7); c.fill(); });
    [[206, -26, 4], [213, -31, 4], [209, -38, 3]].forEach(function (l) { c.fillStyle = P.leafHi; c.beginPath(); c.ellipse(l[0], fl + l[1], l[2], l[2] * .5, .4, 0, 7); c.fill(); });
    return fl;
  }
})();
