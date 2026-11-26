// Sarah's Sim people and cats in the home.
//   Sandbox (spec 001, part B): Louie and Ralph wander, nap on furniture she places and react to new pieces (bible, The cats);
//   Keegan and Sarah stand or sit somewhere fitting.
//   Life (spec 006, part B): she taps the floor to walk Sarah there, around furniture and up the stairs (the D-pad walks her
//   too), and taps a piece, a cat or Keegan for an action bubble. Sarah walks over and does it with a short animation; a slim
//   bar over her head shows how long is left. One action at a time, up to 3 lined up. Tapping anywhere else stops it.
(function () {
  var FH = SS.FH;
  function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
  function rand(a, b) { return a + Math.random() * (b - a); }

  function Agent(who, kind, f, x, y) {
    var a = { who: who, kind: kind, f: f, x: x + .5, y: y + .5, z: 0, path: [], speed: kind === 'cat' ? (who === 'ralph' ? 1.0 : 1.4) : 2.2,
      pose: kind === 'cat' ? 'sit' : 'stand', flip: false, back: false, walked: 0, on: null, bubble: null, bar: null, wait: rand(1, 4), react: null };
    a.tile = function () { return { f: a.f, x: Math.floor(a.x), y: Math.floor(a.y) }; };
    a.draw = function (c, p) {
      var walking = a.path.length > 0, beat = Math.floor(a.walked * 4) % 4;
      var pose = walking ? (beat === 0 ? 'walk1' : beat === 2 ? 'walk2' : (a.kind === 'cat' ? 'walk2' : 'stand')) : a.pose;
      // facings are kept in the home's own directions; the view turns them (view.js). Standing still, people face the front
      var fc = SS.vface(a.flip, walking && a.back);
      if (a.kind === 'person' && !walking && fc.back) fc = { flip: !fc.flip, back: false };   // standing or sitting still, people show their faces, as they always have, turned the nearer way
      if (a.kind === 'person' && pose === 'bath') drawBath(c, a, p, fc.flip);
      else if (a.kind === 'person') SS.person(c, a.who, p[0], p[1], { pose: pose, back: fc.back, flip: fc.flip, t: performance.now(), arms: walking ? null : a.arms });
      else SS.cat(c, a.who, p[0], p[1], { pose: walking ? (beat < 2 ? 'walk1' : 'walk2') : a.pose, flip: SS.vface(a.flip, a.back).flip, hat: SS.G && SS.G.xmasDay });
      var headY = p[1] - (a.kind === 'cat' ? 22 : (a.pose === 'sit' ? 36 : a.pose === 'lie' ? 16 : a.pose === 'bath' ? 34 : 42));
      if (a.bar) { // the slim progress bar over her head
        var w = 18, k = Math.min(1, a.bar.k);
        c.fillStyle = '#3b2430'; c.fillRect(Math.round(p[0] - w / 2 - 1), Math.round(headY - 6), w + 2, 4);
        c.fillStyle = '#e8dccd'; c.fillRect(Math.round(p[0] - w / 2), Math.round(headY - 5), w, 2);
        c.fillStyle = '#e46f8b'; c.fillRect(Math.round(p[0] - w / 2), Math.round(headY - 5), Math.round(w * k), 2);
        headY -= 7;
      }
      if (a.bubble) drawBubble(c, p[0], headY, a.bubble);
      if (a.extra) a.extra(c, p);
    };
    return a;
  }
  // Sarah in the bath: drawn from her water line, clipped at the tub's front rim (its basin's lower edges on screen)
  function drawBath(c, a, p, flip) {
    var G = SS.G, W = G && G.W, tub = W && a.on && W.byUid[a.on], clip = null, water = [p[0], p[1] - 7];
    if (tub) {
      var d = W.def(tub), M = SS.Model(null, d, tub, { x: tub.x, y: tub.y, rot: tub.r || 0 }), Z = W.floorOf(tub) * FH + 19;
      var pts = [[.18, .22], [1.82, .22], [1.82, .78], [.18, .78]].map(function (q) { var w = M.wp(q[0], q[1]); return SS.vp(w[0], w[1], Z); });
      var L = pts.reduce(function (m, q) { return q[0] < m[0] ? q : m; }), R = pts.reduce(function (m, q) { return q[0] > m[0] ? q : m; }), B = pts.reduce(function (m, q) { return q[1] > m[1] ? q : m; });
      clip = [L, B, R, [R[0], R[1] - 120], [L[0], L[1] - 120]];
      var wq = SS.vp(a.x, a.y, Z - 2); water = [wq[0], wq[1]];
    }
    SS.bathPerson(c, water[0], water[1], { flip: flip, t: performance.now(), clip: clip });
  }
  // a small thought bubble over a head: a heart, '!', 'z', '...', a note, a treat
  function drawBubble(c, x, y, b) {
    var t = performance.now(), bob = Math.round(Math.sin(t / 300));
    x = Math.round(x); y = Math.round(y - 10 + bob);
    c.fillStyle = '#3b2430'; c.fillRect(x - 6, y - 6, 13, 11); c.fillStyle = '#fff6ea'; c.fillRect(x - 5, y - 5, 11, 9); c.fillRect(x - 1, y + 4, 2, 2);
    var col = '#e46f8b';
    if (b.icon === 'heart') { c.fillStyle = col; [[1, 0, 2], [4, 0, 2], [0, 1, 7], [0, 2, 7], [1, 3, 5], [2, 4, 3], [3, 5, 1]].forEach(function (r) { c.fillRect(x - 3 + r[0], y - 3 + r[1], r[2], 1); }); }
    else if (b.icon === '!') { c.fillStyle = '#b44f63'; c.fillRect(x, y - 3, 1, 4); c.fillRect(x, y + 2, 1, 1); }
    else if (b.icon === 'z') { c.font = '6px "Press Start 2P", monospace'; c.fillStyle = '#6b4250'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('z', x + 1, y); }
    else if (b.icon === 'dots') { c.fillStyle = '#6b4250'; [-3, 0, 3].forEach(function (d, i) { if (Math.floor(t / 250) % 4 > i) c.fillRect(x + d, y, 2, 2); }); }
    else if (b.icon === 'note') { c.fillStyle = '#7fa7a0'; c.fillRect(x, y - 3, 1, 5); c.fillRect(x - 2, y + 1, 3, 2); c.fillRect(x + 1, y - 3, 2, 1); }
    else if (b.icon === 'treat') { c.fillStyle = '#c96f45'; c.fillRect(x - 2, y - 1, 4, 3); c.fillStyle = '#f3d38a'; c.fillRect(x - 1, y - 1, 1, 1); }
    else if (b.icon === 'yawn') { c.fillStyle = '#6b4250'; c.beginPath(); c.ellipse(x, y, 2.5, 3, 0, 0, 7); c.fill(); c.fillStyle = '#e46f8b'; c.fillRect(x - 1, y + 1, 2, 1); }
    else if (b.icon === 'rumble') { c.fillStyle = '#e46f6a'; c.fillRect(x - 3, y, 7, 2); c.fillStyle = '#6b4250'; c.fillRect(x - 4, y - 1, 9, 1); c.fillStyle = '#b38a8f'; c.fillRect(x - 1, y - 4, 1, 2); c.fillRect(x + 1, y - 3, 1, 2); }
    else if (b.icon === 'grumpy') { c.fillStyle = '#6b4250'; c.fillRect(x - 3, y - 2, 2, 1); c.fillRect(x + 2, y - 2, 2, 1); c.fillRect(x - 2, y + 2, 5, 1); c.fillRect(x - 3, y + 1, 1, 1); c.fillRect(x + 3, y + 1, 1, 1); }
    else if (b.icon === 'star') { c.fillStyle = '#e7b75f'; c.fillRect(x - 1, y - 3, 2, 6); c.fillRect(x - 3, y - 1, 6, 2); }
  }
  SS.drawBubble = drawBubble;
  SS.walkNodes = function (a, nodes) { a.path = waypoints(nodes); a.arrive = null; };

  // turn a walk from W.path into points to follow, climbing the stairs step by step
  function waypoints(nodes) {
    var out = [];
    for (var i = 1; i < nodes.length; i++) {
      var n = nodes[i], prev = nodes[i - 1];
      if (n.stair) {
        var s = n.stair, tiles = s.tiles.slice(), N = tiles.length;
        if (n.up) { tiles.forEach(function (q, k) { out.push({ f: s.floor, x: q[0] + .5, y: q[1] + .5, z: FH * (k + 1) / (N + 1) }); }); out.push({ f: s.floor, x: s.to[0] + .5, y: s.to[1] + .5, z: FH, land: n.f }); }
        else { out.push({ f: s.floor, x: prev.x + .5, y: prev.y + .5, z: FH, lift: true }); tiles.slice().reverse().forEach(function (q, k) { out.push({ f: s.floor, x: q[0] + .5, y: q[1] + .5, z: FH * (N - k) / (N + 1) }); }); out.push({ f: n.f, x: n.x + .5, y: n.y + .5, z: 0 }); }
      } else out.push({ f: n.f, x: n.x + .5, y: n.y + .5, z: 0 });
    }
    return out;
  }
  // walk an agent to the nearest tile that passes goal(f, x, y); returns false when there's no way
  function walkTo(W, a, goal) {
    getUp(W, a);
    var st = a.tile();
    if (!W.walkable(st.f, st.x, st.y)) { var q = StudioMove.nearestOpen(st.x, st.y, W.lot, W.lot, function (x, y) { return W.walkable(st.f, x, y); }); if (q) { a.x = q[0] + .5; a.y = q[1] + .5; a.z = 0; st = a.tile(); } }
    var nodes = W.path({ f: st.f, x: st.x, y: st.y }, goal);
    if (!nodes) return false;
    a.path = waypoints(nodes);
    return true;
  }
  function getUp(W, a) { if (a.on || a.pose === 'bath' || a.pose === 'sit' || a.pose === 'lie' || a.pose === 'loaf' || a.pose === 'curl') { var u = a.onTile; a.on = null; a.z = 0; a.pose = a.kind === 'cat' ? 'sit' : 'stand'; if (u) { a.x = u[0] + .5; a.y = u[1] + .5; } a.onTile = null; } }
  function step(a, dt) {
    if (!a.path.length) { if (a.arrive) { var done = a.arrive; a.arrive = null; done(); } return; }   // already there
    var wp = a.path[0];
    if (wp.lift) { a.z = wp.z; a.f = wp.f; a.path.shift(); return; }
    var dx = wp.x - a.x, dy = wp.y - a.y, d = Math.hypot(dx, dy), mv = a.speed * dt * (a.slow || 1);
    if (d > .001) { a.flip = (dx - dy) < -0.01; a.back = (dx + dy) < -0.01; }
    if (d <= mv) {
      a.x = wp.x; a.y = wp.y; a.walked += d; a.z = wp.z || 0;
      if (wp.land !== undefined) { a.f = wp.land; a.z = 0; } else a.f = wp.f;
      a.path.shift();
      if (!a.path.length && a.arrive) { var fn = a.arrive; a.arrive = null; fn(); }
    } else {
      var z0 = a.z; a.x += dx / d * mv; a.y += dy / d * mv; a.walked += mv;
      if (wp.z !== undefined) a.z = z0 + (wp.z - z0) * Math.min(1, mv / d);
      a.f = wp.f;
    }
  }
  // sit (or lie, or loaf) on a piece: the seat spot nearest the tile she came from
  function seatOn(W, a, p, pose) {
    var d = W.def(p), ft = W.foot(p), from = a.tile();
    var M = SS.Model(null, d, p, { x: p.x, y: p.y, rot: p.r || 0 });
    var spots = [];
    if (d.use === 'bed' && d.w >= 2) spots = [[d.w * .3, d.d * .5], [d.w * .7, d.d * .5]];
    else if (d.use === 'bed' || p.id === 'cat-bed') spots = [[d.w / 2, d.d * .55]];
    else if (d.kind === 'rug') spots = [[d.w / 2, d.d / 2]];
    else { var n = Math.max(1, Math.round(d.w)); for (var k = 0; k < n; k++) spots.push([(k + .5) * d.w / n, d.use === 'tub' ? .5 : .62]); }
    var best = null;
    var others = (SS.G && SS.G.agents || []).filter(function (o) { return o !== a && o.on === p.uid; });
    spots.forEach(function (sp) { var q = M.wp(sp[0], sp[1]); if (others.some(function (o) { return Math.hypot(o.x - q[0], o.y - q[1]) < .3; })) return; var dd = Math.hypot(q[0] - from.x - .5, q[1] - from.y - .5); if (!best || dd < best.d) best = { q: q, d: dd }; });
    if (!best) { var q0 = M.wp(spots[0][0], spots[0][1]); best = { q: [q0[0] + .2, q0[1] + .2] }; }
    a.onTile = [from.x, from.y]; a.on = p.uid; a.x = best.q[0]; a.y = best.q[1]; a.z = d.kind === 'rug' ? 0 : (d.seat || 12);
    a.pose = pose;
    var r = p.r || 0; a.flip = r === 0 || r === 1; a.back = r === 1 || r === 2;   // face the way the piece faces
  }

  // ---------- the cats ----------
  function catThink(G, a, dt) {
    var W = G.W;
    if (a.held) return;   // a Life action has the cat
    if (a.react && a.path.length === 0 && !a.react.going) {
      var p = W.byUid[a.react.uid]; a.react.going = true;
      if (!p) { a.react = null; return; }
      if (walkTo(W, a, function (f, x, y) { return f === W.floorOf(p) && W.useTiles(p).some(function (q) { return q[0] === x && q[1] === y; }); })) {
        a.arrive = function () { a.bubble = { icon: a.who === 'louie' ? '!' : 'heart', until: performance.now() + 1600 }; a.wait = 1.6; a.next = p.uid; };
      } else a.react = null;
      return;
    }
    if (a.path.length) return;
    a.wait -= dt;
    if (a.wait <= 0 && catNudge(G, a)) return;
    if (a.wait > 0) return;
    if (a.next) { var np = W.byUid[a.next]; a.next = null; a.react = null; if (np && (W.def(np).nap || W.def(np).kind === 'rug')) { seatOn(W, a, np, a.who === 'louie' ? 'curl' : 'loaf'); a.bubble = { icon: 'z', until: performance.now() + 9000 }; a.wait = rand(14, 30); return; } }
    getUp(W, a); a.bubble = null;
    var roll = Math.random();
    // Louie naps most of the day in the coziest spot; Ralph flops in the middle of the floor and lies on rugs
    var naps = W.pieces.filter(function (p) { var d = W.def(p); return !p.host && !p.wall && (d.nap || (a.who === 'ralph' && d.kind === 'rug')); });
    if (roll < (a.who === 'louie' ? .45 : .3) && naps.length) {
      var pref = naps.filter(function (p) { var d = W.def(p); return a.who === 'louie' ? (d.use === 'bed' || p.id === 'cat-bed' || d.use === 'sofa') : (d.kind === 'rug' || d.use === 'sofa'); });
      var target = (pref.length ? pref : naps)[Math.floor(Math.random() * (pref.length || naps.length))];
      if (walkTo(W, a, function (f, x, y) { return f === W.floorOf(target) && W.useTiles(target).some(function (q) { return q[0] === x && q[1] === y; }); })) {
        a.arrive = function () { if (W.byUid[target.uid]) { seatOn(W, a, target, a.who === 'louie' ? (Math.random() < .5 ? 'curl' : 'loaf') : 'loaf'); a.bubble = { icon: 'z', until: performance.now() + 8000 }; } a.wait = rand(15, 35); };
        return;
      }
    }
    // wander: mostly on this floor, now and then up or down the stairs
    var f = roll > .92 ? Math.floor(Math.random() * W.floors) : a.f, tries = 0, gx, gy;
    do { gx = W.ax + Math.floor(Math.random() * W.home.w); gy = W.ay + Math.floor(Math.random() * W.home.d); tries++; } while (!W.walkable(f, gx, gy) && tries < 30);
    if (tries < 30 && walkTo(W, a, function (ff, x, y) { return ff === f && x === gx && y === gy; })) a.arrive = function () { a.pose = 'sit'; a.wait = rand(3, 9); };
    else a.wait = rand(2, 5);
  }
  // a cat with a low need nudges her (spec 006, part D): hungry, Louie sits by the bowl and chats and Ralph flops by the
  // fridge; bored, a cat knocks a small thing off a table (it can always be picked back up); a dirty box, a grumpy face by it
  function catNudge(G, a) {
    var W = G.W, low = SS.catLow(G, a.who);
    if (!low || Math.random() < .35) return false;
    var spot = low === 'hunger' ? W.pieces.find(function (p) { return p.id === (a.who === 'ralph' ? 'fridge' : 'cat-bowls'); }) || W.pieces.find(function (p) { return p.id === 'cat-bowls'; })
      : low === 'litter' ? W.pieces.find(function (p) { return p.id === 'litter-box'; }) : null;
    if (low === 'play') {
      var smalls = W.pieces.filter(function (p) { return p.host && W.floorOf(p) === a.f && W.def(p).kind === 'small' && !W.def(p).lamp; });
      var thing = smalls[Math.floor(Math.random() * smalls.length)];
      if (!thing) return false;
      var hostP = W.hostOf(thing);
      if (!walkTo(W, a, function (f, x, y) { return f === W.floorOf(hostP) && W.useTiles(hostP).some(function (q) { return q[0] === x && q[1] === y; }); })) return false;
      a.arrive = function () {
        if (!W.byUid[thing.uid] || !thing.host) return;
        var t0 = a.tile(), q = StudioMove.nearestOpen(t0.x, t0.y, W.lot, W.lot, function (x, y) { return W.check({ id: thing.id, f: t0.f, x: x, y: y, r: 0 }, thing).ok; });
        if (!q) return;
        delete thing.host; delete thing.spot; thing.f = t0.f; thing.x = q[0]; thing.y = q[1]; thing.r = 0; SS.forgetSprite(thing.uid);
        a.bubble = { icon: '!', until: performance.now() + 1800 }; a.wait = 4; G.changed(true);
      };
      return true;
    }
    if (!spot) return false;
    if (!walkTo(W, a, function (f, x, y) { return f === W.floorOf(spot) && W.useTiles(spot).some(function (q) { return q[0] === x && q[1] === y; }); })) return false;
    a.arrive = function () {
      a.pose = low === 'hunger' && a.who === 'ralph' ? 'loaf' : 'sit';
      a.bubble = { icon: low === 'litter' ? 'grumpy' : a.who === 'louie' ? 'dots' : 'treat', until: performance.now() + 6000 };
      a.wait = 8 + Math.random() * 6;
    };
    return true;
  }

  // a new piece: the nearest cat on the same floor walks over to see it, and naps on it if it's cozy (bible, The cats)
  SS.catsNotice = function (G, p) {
    var f = G.W.floorOf(p), cats = [G.cats.louie, G.cats.ralph].filter(function (a) { return a.f === f && !a.held; });
    if (!cats.length) cats = [G.cats.louie, G.cats.ralph].filter(function (a) { return !a.held; });
    if (!cats.length) return;
    var ft = G.W.foot(p.host ? G.W.hostOf(p) : p);
    cats.sort(function (a, b) { return Math.hypot(a.x - ft[0], a.y - ft[1]) - Math.hypot(b.x - ft[0], b.y - ft[1]); });
    var cat = cats[0]; getUp(G.W, cat); cat.path = []; cat.arrive = null; cat.react = { uid: (p.host ? G.W.hostOf(p) : p).uid };
  };

  // ---------- setting up ----------
  function seatFor(G, a, id, n) { var ps = G.W.pieces.filter(function (p) { return p.id === id; }); var p = ps[n || 0]; if (!p) return false; var ut = G.W.useTiles(p)[0]; if (!ut) return false; a.f = p.f; a.x = ut[0] + .5; a.y = ut[1] + .5; seatOn(G.W, a, p, 'sit'); return true; }
  function standAt(G, a, f, x, y) { var q = StudioMove.nearestOpen(x, y, G.W.lot, G.W.lot, function (xx, yy) { return G.W.walkable(f, xx, yy); }); if (q) { a.f = f; a.x = q[0] + .5; a.y = q[1] + .5; } }
  SS.makeAgents = function (G) {
    var W = G.W, ax = W.ax, ay = W.ay;
    var sarah = Agent('sarah', 'person', 0, ax + 4, ay + 8), keegan = Agent('keegan', 'person', 1, ax + 6, ay + 6);
    var louie = Agent('louie', 'cat', 0, ax + 5, ay + 7), ralph = Agent('ralph', 'cat', 0, ax + 3, ay + 2);
    // Keegan at his desk in the study; Sarah on the living-room sofa in Sandbox, up and about in Life
    if (!seatFor(G, keegan, 'desk-chair')) standAt(G, keegan, 1, ax + 4, ay + 6);
    if (G.mode === 'life') { standAt(G, sarah, 0, ax + 4, ay + 7); sarah.flip = true; }
    else if (!seatFor(G, sarah, 'three-seat-sofa')) standAt(G, sarah, 0, ax + 4, ay + 8);
    standAt(G, louie, 0, ax + 6, ay + 10); standAt(G, ralph, 0, ax + 3, ay + 1);
    G.people = { sarah: sarah, keegan: keegan }; G.cats = { louie: louie, ralph: ralph };
    G.agents = [sarah, keegan, louie, ralph];
    G.queue = []; G.act = null;
  };
  // ---------- Keegan's day (spec 006, part D, Idle life) ----------
  // When she opens Life he's already busy with something from the current time of day's pool; he moves on every 5 to 15
  // minutes of play, cooks near mealtimes, and a meal he finishes goes on the table with a sparkle. Picks don't repeat until
  // the pool runs out (studio-bible/play.md); the shown list is saved. The pools are private data (placeholder in the repo).
  function partOfDay(d) { var h = d.getHours(); return h >= 6 && h < 11 ? 'morning' : h >= 11 && h < 17 ? 'daytime' : h >= 17 && h < 22 ? 'evening' : 'lateNight'; }
  function mealtime(d) { var h = d.getHours(); return (h >= 7 && h < 9) || (h >= 12 && h < 13) || (h >= 18 && h < 20); }
  function pickActivity(G) {
    var pool = ((window.SS_PRIVATE || {}).idleLife || {})[partOfDay(SS.now())] || [];
    if (!pool.length) return null;
    if (mealtime(SS.now())) { var cook = pool.filter(function (x) { return x.at === 'stove'; })[0]; if (cook && (!G.kday || G.kday.at !== 'stove')) return cook; }
    var S = G.save; S.shown = S.shown || {}; var key = 'idle.' + partOfDay(SS.now()), sh = S.shown[key] || (S.shown[key] = []);
    var left = pool.filter(function (x) { return sh.indexOf(x.text) < 0; }); if (!left.length) { sh.length = 0; left = pool.slice(); }
    var a = left[Math.floor(Math.random() * left.length)]; sh.push(a.text); return a;
  }
  function startActivity(G, first) {
    var K = G.people.keegan, W = G.W, act = pickActivity(G);
    if (!act) return;
    var spots = W.pieces.filter(function (p) { var u = W.def(p).use; return (u === act.at || (act.at === 'desk' && u === 'desk')) && W.useTiles(p).length; });
    if (act.at === 'desk') { var chair = W.pieces.filter(function (p) { return p.id === 'desk-chair'; })[0]; if (chair) spots = [chair]; }
    var p = spots[Math.floor(Math.random() * spots.length)];
    G.kday = { text: act.text, at: act.at, busy: !!act.busy, left: (5 + Math.random() * 10) * 60, piece: p ? p.uid : null };
    if (!p) return;
    var settle = function () { var d = W.def(p); if (d.seat && act.at !== 'stove' && act.at !== 'bookshelf') seatOn(W, K, p, d.use === 'bed' ? 'lie' : 'sit'); K.bubble = act.at === 'bed' ? { icon: 'z' } : null; if (act.at === 'stove') callRalph(G, p); };
    getUp(W, K);
    if (first) { var ut = W.useTiles(p)[0]; if (ut) { K.f = W.floorOf(p); K.x = ut[0] + .5; K.y = ut[1] + .5; K.path = []; settle(); } }
    else if (walkTo(W, K, function (f, x, y) { return f === W.floorOf(p) && W.useTiles(p).some(function (q) { return q[0] === x && q[1] === y; }); })) K.arrive = settle;
  }
  function callRalph(G, stove) { // Ralph turns up whenever Keegan cooks (bible, Ralph)
    var Rl = G.cats.ralph, W = G.W; if (Rl.held || Rl.on) return;
    if (walkTo(W, Rl, function (f, x, y) { return f === W.floorOf(stove) && Math.abs(x - stove.x) + Math.abs(y - stove.y) <= 3; })) Rl.arrive = function () { Rl.pose = 'sit'; Rl.bubble = { icon: 'heart', until: performance.now() + 3000 }; Rl.wait = 20; };
  }
  function serveMeal(G) { // a finished meal on the table, with a sparkle (bible, Cooking)
    var W = G.W, best = null;
    W.pieces.forEach(function (h) { var d = W.def(h); if (!d.spots.length || !/dining|bistro|island/.test(h.id)) return; d.spots.forEach(function (sp, i) { if (!best && W.check({ id: 'plated-meal', host: h.uid, spot: i }).ok) best = { host: h.uid, spot: i }; }); });
    if (!best) return;
    var p = W.add({ id: 'plated-meal', host: best.host, spot: best.spot, sw: 0, props: true }); p.f = W.floorOf(p);
    G.changed(true); G.toast('KEEGAN MADE DINNER', 2200, 'It\'s on the table. Tap it to eat.');
  }
  function startActivityBack(G) { var K = G.people.keegan, W = G.W, p = W.byUid[G.kday.piece]; if (walkTo(W, K, function (f, x, y) { return f === W.floorOf(p) && W.useTiles(p).some(function (q) { return q[0] === x && q[1] === y; }); })) K.arrive = function () { var d = W.def(p); if (d.seat && G.kday.at !== 'stove' && G.kday.at !== 'bookshelf') seatOn(W, K, p, d.use === 'bed' ? 'lie' : 'sit'); }; }
  SS.startKeeganDay = function (G) { if (G.mode === 'life') { G.kday = null; startActivity(G, true); } };
  function keeganDay(G, dt) {
    var K = G.people.keegan, kd = G.kday;
    if (!kd) return;
    if (G.act && (G.act.job.act.together || G.act.job.act.both)) return;   // he's with her
    kd.left -= dt;
    if (kd.left > 0) return;
    if (kd.at === 'stove' && /cook|dinner|breakfast|lunch/i.test(kd.text)) serveMeal(G);
    startActivity(G, false);
    if (G.waitK0) { var job = G.waitK0; G.waitK0 = null; SS.chooseAction(G, job.target, job.act); }
  }

  SS.updateAgents = function (G, dt) {
    var now = performance.now();
    G.agents.forEach(function (a) {
      step(a, dt);
      if (a.bubble && a.bubble.until && now > a.bubble.until) a.bubble = null;
      if (a.kind === 'cat') catThink(G, a, dt);
      if (a.on && !G.W.byUid[a.on]) getUp(G.W, a);   // her seat was moved or put away
    });
    if (G.mode === 'life') { runActions(G, dt); SS.tickNeeds(G, dt); keeganDay(G, dt); SS.tickPhone(G, dt); }
  };
  SS.agentGetUp = function (G, a) { getUp(G.W, a); };
  SS.seatSarah = function (G, p, pose) { seatOn(G.W, G.people.sarah, p, pose); };

  // ---------- Sarah's actions (spec 006, part B, Starter actions) ----------
  // dur in seconds. how: 'sit' | 'lie' | 'stand' | 'tub'. soon: shows "Coming soon" in the bubble (parts not built yet)
  // fill: how much each need fills over the whole action (spec 006, part B's Fills column; part C). together: Keegan joins
  // (spec 006, part D); with: the piece the two of them go to when she asks Keegan
  var ACTIONS = {
    bed: [{ name: 'SLEEP', icon: 'z', dur: 30, how: 'lie', sleep: true, fill: { energy: 1 } }, { name: 'NAP', icon: 'z', dur: 15, how: 'lie', fill: { energy: .4 } }, { name: 'LIE IN', sub: 'WITH KEEGAN', icon: 'heart', dur: 20, how: 'lie', together: true, fill: { energy: .3, fun: .2 } }],
    sofa: [{ name: 'SIT', icon: 'seat', dur: 10, how: 'sit', fill: { energy: .08, fun: .05 } }, { name: 'WATCH', sub: 'A SHOW', icon: 'tv', dur: 20, how: 'sit', tv: true, fill: { fun: .3, energy: .08 } }, { name: 'CUDDLE UP', sub: 'WITH KEEGAN', icon: 'heart', dur: 18, how: 'sit', together: true, fill: { fun: .3, energy: .1 } }],
    chair: [{ name: 'SIT', icon: 'seat', dur: 10, how: 'sit', fill: { energy: .08, fun: .05 } }],
    fridge: [{ name: 'SNACK', icon: 'snack', dur: 6, how: 'stand', fx: 'snack', fill: { hunger: .35 } }, { name: 'COOK', icon: 'pan', soon: 'Cooking comes in its own part.' }],
    stove: [{ name: 'COOK', icon: 'pan', soon: 'Cooking comes in its own part.' }],
    easel: [{ name: 'PAINT', icon: 'brush', dur: 20, how: 'stand', fx: 'paint', fill: { fun: .35 } }, { name: 'SEASONAL', sub: 'CRAFT', icon: 'star', dur: 20, how: 'stand', fx: 'craft', fill: { fun: .35 } }],
    tub: [{ name: 'BATH', icon: 'bath', dur: 25, how: 'tub', fx: 'bath', fill: { energy: .25, fun: .2 } }],
    bookshelf: [{ name: 'READ', icon: 'book', dur: 15, how: 'stand', fx: 'read', fill: { fun: .25 } }],
    desk: [{ name: 'FIND A GIG', icon: 'star', soon: 'Gigs come in their own part.' }, { name: 'VIDEO-CALL', sub: 'MOM', icon: 'chat', soon: 'Calls home come with idle life.' }],
    wardrobe: [{ name: 'CHANGE', sub: 'OUTFIT', icon: 'heart', soon: 'Style comes in its own part.' }],
    lamp: [{ name: 'LIGHT', sub: 'ON / OFF', icon: 'lamp', dur: 1, how: 'stand', fx: 'lamp' }],
    tv: [{ name: 'WATCH', sub: 'A SHOW', icon: 'tv', dur: 20, how: 'stand', tv: true, fill: { fun: .3 } }],
    cat: [{ name: 'PET', icon: 'heart', dur: 4, how: 'stand', fx: 'pet', fill: { fun: .1 } }, { name: 'TREAT', icon: 'treat', dur: 5, how: 'stand', fx: 'treat', fill: { fun: .08 } }, { name: 'PLAY', icon: 'star', dur: 10, how: 'stand', fx: 'play', fill: { fun: .25 } }],
    keegan: [{ name: 'CHAT', icon: 'chat', dur: 10, how: 'stand', fx: 'chat', fill: { fun: .2 }, both: true }, { name: 'HUG', icon: 'heart', dur: 3, how: 'stand', fx: 'hug', fill: { fun: .12, energy: .1 }, both: true, pool: 'hugs' },
      { name: 'KISS', icon: 'heart', dur: 2.5, how: 'stand', fx: 'kiss', fill: { fun: .3 }, both: true, pool: 'kisses' }, { name: 'CUDDLE UP', icon: 'seat', dur: 18, how: 'sit', together: true, with: 'sofa', fill: { fun: .3, energy: .1 } },
      { name: 'PLAY', sub: 'A GAME', icon: 'tv', dur: 20, how: 'sit', together: true, with: 'sofa', tv: true, fill: { fun: .4 } }, { name: 'GO TO BED', icon: 'z', dur: 30, how: 'lie', together: true, with: 'bed', sleep: true, fill: { energy: 1 } },
      { name: 'COOK', sub: 'TOGETHER', icon: 'pan', soon: 'Cooking together comes with the Cooking screen.' }, { name: 'WIND DOWN', sub: 'TOGETHER', icon: 'star', soon: 'Winding down comes with its own pieces.' }],
    bowl: [{ name: 'FILL', sub: 'THE BOWL', icon: 'treat', dur: 4, how: 'stand', fx: 'fill' }],
    litter: [{ name: 'SCOOP', icon: 'star', dur: 6, how: 'stand', fx: 'scoop' }],
    sarah: [{ name: 'CHARGE', sub: 'HER PHONE', icon: 'lamp', fx: 'charge', instant: true }],
    gift: [{ name: 'OPEN', sub: 'THE GIFT', icon: 'heart', dur: 3, how: 'stand', fx: 'open', fill: { fun: .2 } }],
    meal: [{ name: 'EAT', icon: 'snack', dur: 8, how: 'stand', fx: 'eat', fill: { hunger: .6, fun: .05 } }],
    backdoor: [{ name: 'GO TO', sub: 'THE YARD', icon: 'star', soon: 'The yard comes in its own part.' }]
  };
  SS.ACTIONS = ACTIONS;
  // what each action reads as at the top of Sarah's bubble while she does it (spec 006, part C, What she's doing)
  var DOING = { SLEEP: 'Sleeping', NAP: 'Napping', 'LIE IN': 'Lying in', SIT: 'Sitting down', WATCH: 'Watching a show',
    'CUDDLE UP': 'Cuddling up', SNACK: 'Having a snack', PAINT: 'Painting', SEASONAL: 'Making a craft', BATH: 'Taking a bath',
    READ: 'Reading', LIGHT: 'Switching a light', CHAT: 'Chatting', HUG: 'Hugging Keegan', KISS: 'Kissing Keegan',
    'GO TO BED': 'Going to bed', FILL: 'Filling the bowl', SCOOP: 'Scooping the litter', OPEN: 'Opening a gift', EAT: 'Eating dinner' };
  SS.sarahDoing = function (G) {
    if (G.hunt) return 'Finding the charger';
    if (G.act) {
      var a = G.act.job.act, tg = G.act.job.target, cat = tg.agent && tg.agent.kind === 'cat' ? tg.agent.who.charAt(0).toUpperCase() + tg.agent.who.slice(1) : '';
      if (a.fx === 'pet') return 'Petting ' + cat;
      if (a.fx === 'treat') return 'Treating ' + cat;
      if (a.fx === 'play') return 'Playing with ' + cat;
      if (a.name === 'PLAY') return 'Gaming with Keegan';
      return DOING[a.name] || null;
    }
    if (G.idle) return G.idle.text;
    if (G.charging) return 'Charging her phone';
    return null;
  };
  SS.actionsFor = function (G, target) {
    if (target.agent) { if (target.agent.kind === 'cat') return ACTIONS.cat; if (target.agent.who === 'keegan') return ACTIONS.keegan; return SS.phoneOf(G) < .99 && !G.charging && !G.hunt ? ACTIONS.sarah : null; }
    if (target.door) return ACTIONS.backdoor;
    var d = G.W.def(target.piece), own = d.use ? ACTIONS[d.use] : null;
    if (target.piece.dress && d.use !== 'gift') return [{ name: 'KEEP IT', icon: 'heart', fx: 'keep', instant: true }].concat(own || []);   // day dressing she can keep (spec 009)
    return own;
  };
  // she picked an action: do it now, or line it up (up to 3)
  SS.chooseAction = function (G, target, act) {
    if (act.soon || !act.dur) return 'soon';
    SS.stopSarahIdle(G);   // she taps anything: Sarah stops and is hers to play
    if (G.kday && G.kday.busy && (act.together || act.both)) { G.waitK0 = { target: target, act: act }; return 'busy'; }
    if (act.with) {
      var W = G.W, s = G.people.sarah, f = s.f;
      var ps = W.pieces.filter(function (p) { return W.def(p).use === act.with && W.useTiles(p).length; });
      ps.sort(function (a, b) { return (W.floorOf(a) === f ? 0 : 100) + Math.hypot(a.x - s.x, a.y - s.y) - (W.floorOf(b) === f ? 0 : 100) - Math.hypot(b.x - s.x, b.y - s.y); });
      if (!ps.length) { G.toast('THERE\'S NO ' + act.with.toUpperCase() + ' YET', 1400); return 'none'; }
      target = { piece: ps[0] };
    }
    var job = { target: target, act: act };
    if (G.act || G.people.sarah.path.length) { if (G.queue.length < 3) { G.queue.push(job); return 'queued'; } return 'full'; }
    startJob(G, job); return 'now';
  };
  SS.stopActions = function (G) { // tapping anywhere else stops the action; nothing is lost
    SS.stopSarahIdle(G);
    var s = G.people.sarah; if (G.act) finishJob(G, true); G.queue = []; s.path = []; s.arrive = null; getUp(G.W, s);
  };
  function targetTiles(G, tg) {
    var W = G.W;
    if (tg.agent) { var t = tg.agent.tile(); return [[t.x + 1, t.y], [t.x, t.y + 1], [t.x - 1, t.y], [t.x, t.y - 1]].filter(function (q) { return W.walkable(t.f, q[0], q[1]) && !W.wallBetween(t.f, t.x, t.y, q[0], q[1]); }).map(function (q) { return [t.f, q[0], q[1]]; }); }
    if (tg.door) return [[tg.door.f, tg.door.x, tg.door.y]];
    var p = tg.piece, f = W.floorOf(p); return W.useTiles(p).map(function (q) { return [f, q[0], q[1]]; });
  }
  function startJob(G, job) {
    var s = G.people.sarah, W = G.W;
    var goals = targetTiles(G, job.target);
    if (job.target.agent && job.target.agent.kind === 'cat') { job.target.agent.held = true; job.target.agent.path = []; job.target.agent.arrive = null; }
    var here = s.tile();
    var at = goals.some(function (g) { return g[0] === here.f && g[1] === here.x && g[2] === here.y; }) && !s.on;
    G.act = { job: job, t: 0, started: false };
    if (job.act.together && job.target.piece) keeganComes(G, G.act);
    if (at) { begin(G); return; }
    if (job.act.both && job.target.agent && job.target.agent.who === 'keegan' && meetHalfway(G, G.act)) return;
    if (!goals.length || !walkTo(W, s, function (f, x, y) { return goals.some(function (g) { return g[0] === f && g[1] === x && g[2] === y; }); })) { G.toast('SARAH CAN\'T GET THERE', 1400); finishJob(G, true); return; }
    s.arrive = function () { begin(G); };
  }
  // together actions: Keegan sets off for the piece the moment she does, not when she gets there (Keegan, Nov 26)
  function keeganComes(G, A) {
    var W = G.W, a = A.job.act, K0 = G.people.keegan, piece = A.job.target.piece; A.kComing = true;
    A.keegan = A.keegan || { seat: K0.on, tile: K0.onTile }; getUp(W, K0); A.waitK = true;
    if (walkTo(W, K0, function (f, x, y) { return f === W.floorOf(piece) && W.useTiles(piece).some(function (q) { return q[0] === x && q[1] === y; }); })) K0.arrive = function () { if (G.act === A) { seatOn(W, K0, piece, a.how === 'lie' ? 'lie' : 'sit'); K0.bubble = { icon: 'heart', until: performance.now() + 2000 }; } A.waitK = false; };
    else A.waitK = false;
  }
  // chat, hug and kiss: Keegan gets up and meets her halfway, so a hug doesn't wait on her crossing the house (Keegan, Nov 26)
  function meetHalfway(G, A) {
    var W = G.W, s = G.people.sarah, K = G.people.keegan;
    getUp(W, s); var st = s.tile();
    if (!W.walkable(st.f, st.x, st.y)) { var q0 = StudioMove.nearestOpen(st.x, st.y, W.lot, W.lot, function (x, y) { return W.walkable(st.f, x, y); }); if (!q0) return false; s.x = q0[0] + .5; s.y = q0[1] + .5; s.z = 0; st = s.tile(); }
    var goals = targetTiles(G, A.job.target);
    var nodes = W.path({ f: st.f, x: st.x, y: st.y }, function (f, x, y) { return goals.some(function (g) { return g[0] === f && g[1] === x && g[2] === y; }); });
    if (!nodes || nodes.length < 4) return false;   // close by: she just walks over
    var mid = Math.floor((nodes.length - 1) / 2), m = -1;
    for (var k = 0; k < nodes.length && m < 0; k++) [mid - k, mid + k].forEach(function (i) { if (m < 0 && i >= 1 && i + 1 < nodes.length && !nodes[i].stair && !nodes[i + 1].stair && nodes[i].f === nodes[i + 1].f) m = i; });
    if (m < 0) return false;
    var meS = nodes[m], meK = nodes[m + 1];
    A.keegan = { seat: K.on, tile: K.onTile }; getUp(W, K);
    if (!walkTo(W, K, function (f, x, y) { return f === meK.f && x === meK.x && y === meK.y; })) { A.keegan = null; return false; }
    SS.walkNodes(s, nodes.slice(0, m + 1));
    var here = 0, both = function () { if (++here === 2 && G.act === A) begin(G); };
    s.arrive = both; K.arrive = both;
    return true;
  }
  function begin(G) {
    var s = G.people.sarah, A = G.act; if (!A) return;
    var a = A.job.act, tg = A.job.target, W = G.W;
    A.started = true; A.t = 0;
    A.dur = a.dur * (SS.lowNeed(G, 'sarah') ? 1.25 : 1);   // a low need only slows her a little (spec 006, part C)
    if (a.pool) { // hugs and kisses each pick from their own pool, no repeats until it runs out (private data; placeholder here)
      var pool = (window.SS_PRIVATE && window.SS_PRIVATE[a.pool]) || [], S = G.save; S.shown = S.shown || {}; var sh = S.shown[a.pool] || (S.shown[a.pool] = []);
      if (pool.length) { var left = pool.filter(function (x, i) { return sh.indexOf(i) < 0; }); if (!left.length) { sh.length = 0; left = pool.slice(); } var pick = left[Math.floor(Math.random() * left.length)]; sh.push(pool.indexOf(pick)); G.toast(a.name, Math.min(2600, a.dur * 1000), pick); }
    }
    if (a.together && !A.kComing) keeganComes(G, A);
    // face the target
    var tp = tg.agent ? { x: tg.agent.x, y: tg.agent.y } : tg.piece ? (function () { var ft = W.foot(tg.piece.host ? W.hostOf(tg.piece) : tg.piece.wall ? null : tg.piece) || [0, 0, 0, 0]; return tg.piece.wall ? { x: tg.piece.wall[0] + .5, y: tg.piece.wall[1] } : { x: (ft[0] + ft[2]) / 2, y: (ft[1] + ft[3]) / 2 }; })() : { x: s.x, y: s.y - 1 };
    var dx = tp.x - s.x, dy = tp.y - s.y; s.flip = (dx - dy) < 0; s.back = (dx + dy) < 0;
    if (a.how === 'sit') seatOn(W, s, tg.piece, 'sit');
    if (a.how === 'tub') seatOn(W, s, tg.piece, 'bath');   // she sits down in the water (art: sprites.js, the bath)
    if (a.how === 'lie') seatOn(W, s, tg.piece, 'lie');
    if (a.tv) { var tv = W.pieces.filter(function (p) { return W.def(p).use === 'tv' && W.floorOf(p) === s.f; })[0]; if (tv) { tv.lit = true; A.tv = tv; } }
    if (a.fx === 'paint' || a.fx === 'craft') { tg.piece.work = true; }
    if (a.fx === 'bath') { // Louie may hop up on the tub edge (bible, Louie)
      var L = G.cats.louie; if (L.f === s.f && Math.random() < .7) { getUp(W, L); L.held = true; var ut = W.useTiles(tg.piece); if (ut[1]) walkTo(W, L, function (f, x, y) { return f === s.f && x === ut[1][0] && y === ut[1][1]; }); L.arrive = function () { L.pose = 'sit'; L.z = 14; L.bubble = { icon: 'heart', until: performance.now() + 2500 }; }; A.louie = L; }
    }
    if (a.fx === 'chat' || a.fx === 'hug' || a.fx === 'kiss') { var K = G.people.keegan; A.keegan = A.keegan || { seat: K.on, tile: K.onTile }; getUp(W, K); var kx = s.x - K.x, ky = s.y - K.y; if (Math.abs(kx) + Math.abs(ky) > .01) { K.flip = (kx - ky) < 0; K.back = (kx + ky) < 0; } else { K.flip = !s.flip; K.back = !s.back; } }
    if (a.fx === 'pet' || a.fx === 'treat' || a.fx === 'play') { var cat = tg.agent; getUp(W, cat); cat.flip = !s.flip; }
    s.bar = { k: 0 };
  }
  function finishJob(G, cancelled) {
    var s = G.people.sarah, A = G.act, W = G.W; if (!A) return;
    var a = A.job.act, tg = A.job.target;
    s.bar = null; s.bubble = null; s.extra = null;
    if (A.tv) A.tv.lit = false;
    if (tg.piece && tg.piece.work) { tg.piece.work = false; }
    if (A.louie) { A.louie.held = false; A.louie.z = 0; A.louie.wait = 2; }
    if (tg.agent && tg.agent.kind === 'cat') { tg.agent.held = false; tg.agent.wait = 3; }
    if (A.keegan) { var K = G.people.keegan; K.bubble = null; K.extra = null; K.path = []; K.arrive = null; getUp(W, K); var seat = A.keegan.seat && W.byUid[A.keegan.seat]; if (G.kday && G.kday.piece && W.byUid[G.kday.piece]) { G.kday.left = Math.max(G.kday.left, 60); startActivityBack(G); seat = null; } if (seat && !seat.host) { var ut = W.useTiles(seat)[0]; if (ut) { K.f = W.floorOf(seat); K.x = ut[0] + .5; K.y = ut[1] + .5; } seatOn(W, K, seat, 'sit'); } }
    if (!cancelled && A.started) effect(G, a, tg);
    if (a.how === 'sit' || a.how === 'lie' || a.how === 'tub') getUp(W, s);
    G.act = null;
    if (G.sleeping) G.sleeping = false;
  }
  function runActions(G, dt) {
    var s = G.people.sarah;
    if (!G.act && G.queue.length && !s.path.length) startJob(G, G.queue.shift());
    var A = G.act; if (!A || !A.started) return;
    var a = A.job.act;
    if (A.waitK && A.t < 1) { A.wk = (A.wk || 0) + dt; if (A.wk < 25) return; A.waitK = false; }
    var dur = A.dur || a.dur, step = Math.min(dt, Math.max(0, dur - A.t));
    A.t += dt; s.bar.k = A.t / dur;
    SS.fillNeeds(G, 'sarah', a.fill, step / dur);
    if (a.together || a.both) SS.fillNeeds(G, 'keegan', a.fill, step / dur);
    var now = performance.now();
    // the short animations, made from the sprites (plain stand-ins until each gets its own frames)
    if (a.fx === 'pet' || a.fx === 'hug') s.bubble = { icon: 'heart' };
    if (a.fx === 'treat') { s.bubble = { icon: 'treat' }; if (A.t > 2) A.job.target.agent.bubble = { icon: 'heart', until: now + 1500 }; }
    if (a.fx === 'play') { var tgt = A.job.target.agent; tgt.pose = Math.floor(A.t * 2) % 2 ? 'sit' : 'loaf'; s.extra = function (c, p) { var k = Math.sin(A.t * 5); c.strokeStyle = '#8e5a37'; c.beginPath(); c.moveTo(p[0] + 4, p[1] - 22); c.lineTo(p[0] + 14 + k * 3, p[1] - 30); c.stroke(); c.fillStyle = '#e46f8b'; c.fillRect(Math.round(p[0] + 13 + k * 3), Math.round(p[1] - 32), 3, 4); }; }
    if (a.fx === 'chat') { var K = G.people.keegan; var talk = Math.floor(A.t / 1.4) % 2; s.bubble = talk ? { icon: 'dots' } : null; K.bubble = talk ? null : { icon: Math.floor(A.t / 2.8) % 2 ? 'heart' : 'dots' }; }
    if (a.fx === 'hug' || a.fx === 'kiss') { var K2 = G.people.keegan; K2.bubble = { icon: 'heart' }; s.bubble = { icon: 'heart' }; }
    if (a.together) { var K3 = G.people.keegan; if (!A.waitK && Math.floor(A.t / 3) % 2) K3.bubble = { icon: 'heart' }; else K3.bubble = null; }
    if (a.fx === 'read') s.extra = function (c, p) { c.fillStyle = '#7fa7a0'; c.fillRect(Math.round(p[0] - 4), Math.round(p[1] - 24), 8, 5); c.fillStyle = '#fff6ea'; c.fillRect(Math.round(p[0] - 3), Math.round(p[1] - 23), 6, 3); };
    if (a.fx === 'snack') s.bubble = { icon: Math.floor(A.t * 2) % 2 ? 'treat' : 'heart' };
    if (a.fx === 'paint' || a.fx === 'craft') s.extra = function (c, p) { var k = Math.floor(A.t * 3) % 2; c.fillStyle = '#8e5a37'; c.fillRect(Math.round(p[0] + (s.flip ? -8 : 6)), Math.round(p[1] - 22 - k), 1, 5); c.fillStyle = '#e46f8b'; c.fillRect(Math.round(p[0] + (s.flip ? -8 : 6)), Math.round(p[1] - 23 - k), 1, 1); };
    if (a.how === 'lie') s.bubble = { icon: 'z' };
    if (a.sleep) G.sleeping = true;
    if (A.t >= dur) finishJob(G, false);
  }
  function effect(G, a, tg) {
    var W = G.W, s = G.people.sarah;
    if (a.fx === 'lamp') { tg.piece.lit = !tg.piece.lit; tg.piece.manual = SS.dayText(SS.now()); G.changed(true); }
    if (a.fx === 'paint') makeCraft(G, 'painting', tg.piece);
    if (a.fx === 'craft') makeCraft(G, SS.season(SS.now()), tg.piece);
    if (a.fx === 'pet') tg.agent.bubble = { icon: 'heart', until: performance.now() + 2000 };
    if (a.fx === 'play') SS.fillCats(G, 'play', tg.agent.who === 'ralph' ? 1 : .5, tg.agent.who);   // the feather wand: Ralph's favorite, double
    if (a.fx === 'treat') SS.fillCats(G, 'hunger', .2, tg.agent.who);
    if (a.fx === 'fill') { SS.fillCats(G, 'hunger', 1); [G.cats.louie, G.cats.ralph].forEach(function (cat) { cat.bubble = { icon: 'heart', until: performance.now() + 2500 }; cat.wait = Math.min(cat.wait, .5); }); G.catFull = true; G.version++; }
    if (a.fx === 'open') SS.openGift(G, tg.piece);
    if (a.fx === 'eat') { W.remove(tg.piece); G.changed(true); }
    if (a.fx === 'scoop') { SS.fillCats(G, 'litter', 1); G.litterLow = false; G.version++; }
  }
  // a finished painting or craft: from a pool that doesn't repeat until each has been made (studio-bible/play.md); it goes in
  // her Ours tab, and the first copy appears near where she made it
  function makeCraft(G, pool, near) {
    var S = G.save, ids = pool === 'painting' ? SS.PAINTING_POOL : SS.CRAFT_POOLS[pool];
    S.shown = S.shown || {}; var shown = S.shown[pool] || (S.shown[pool] = []);
    var left = ids.filter(function (id) { return shown.indexOf(id) < 0; });
    if (!left.length) { shown.length = 0; left = ids.slice(); }
    var id = left[Math.floor(Math.random() * left.length)]; shown.push(id);
    if (S.made.indexOf(id) < 0) S.made.push(id);
    var placed = SS.placeNear(G, id, near);
    G.changed(true, true);
    G.toast((SS.DEF[id].name).toUpperCase() + '!', 2200, placed ? 'IT\'S UP NEARBY, AND IN YOUR OURS TAB.' : 'IT\'S IN YOUR OURS TAB.');
  }
})();
