// Life After town generator (spec 002, 1, 2, 6, 7): the houses section and the highway strip, each 60 x 60 tiles,
// made from the world seed. Same seed and preset, same streets, places, rooms, locks and loot, every time.
// Pure data, no drawing (assets/town-art.js draws it). window.LAT.
//
//   LAT.make(seed, preset)   {houses, strip}: two sections. Each section:
//     id, name, W, H         'houses' or 'strip', its name on the top bar's tab, 60 x 60
//     g, solid               the ground code and whether it's solid, per tile (index y * W + x)
//     spotAt, doorAt         per tile: 1 + the index of the search spot or place door there, or 0
//     places[]               {id, kind, name, b, door{x, y}, lock, inside, spots[], clerk}: every place you can enter
//     buildings[]            {x, y, w, h, face, style, ...}: what's drawn from outside (a motel holds 8 places)
//     props[]                {k, x, y, ...}: trees, cars, bodies, signs, poles and the rest of the dressing
//     spots[]                {id, kind, name, place, inside, x, y, w, h, items[], lock}: everything you can search
//     locks[]                {id, what, name, place, spot}: locked doors, counters, cases and trunks
//     exits[]                {x, y0, y1, dir, to}: the road out to the other section
//     wake                   houses only: {place, x, y}, where day 1 starts (a bedroom)
//   An inside map (place.inside): {W, H, t, solid, spotAt, doorAt, furn[], rooms[], doors[], exit{x, y}}.
//   Rooms have a top wall (2 rows seen face on), side walls and a front wall with the way out.
//
// Buildings open as inside maps (spec 002, 1: the Developer picks; open question for Keegan in the changelog).
(function () {
  var I = LAI.ITEMS, N = 60;
  // exterior ground
  var G = { GRASS: 0, GRASS2: 1, ROAD: 2, WALK: 3, DRIVE: 4, LOT: 5, GRAVEL: 6, FIELD: 7, SHOULDER: 8, PLAY: 9, BUILD: 10, TREE: 11, FENCE: 12, HEDGE: 13, PATH: 14 };
  var SOLID_G = {}; SOLID_G[G.BUILD] = SOLID_G[G.TREE] = SOLID_G[G.FENCE] = SOLID_G[G.HEDGE] = 1;
  // inside floors and walls
  var F = { WOOD: 20, TILE: 21, CARPET: 22, CONC: 23, STORE: 24, WALL: 25, BACK: 26, EXIT: 27, IDOOR: 28, LINO: 29 };

  function stream(seed, tag) { return StudioSeed.stream(StudioSeed.hash(seed + ':' + tag)); }
  function pick(r, a) { return a[r.int(a.length)]; }
  function shuffle(r, a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = r.int(i + 1), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function wpick(r, list) { var t = 0, i; for (i = 0; i < list.length; i++) t += list[i][1]; var v = r.next() * t; for (i = 0; i < list.length; i++) { v -= list[i][1]; if (v < 0) return list[i][0]; } return list[list.length - 1][0]; }

  // ================= a section =================
  function Section(id, name) {
    this.id = id; this.name = name; this.W = N; this.H = N;
    this.g = new Uint8Array(N * N); this.solid = new Uint8Array(N * N);
    this.spotAt = new Int16Array(N * N); this.doorAt = new Int16Array(N * N);
    this.places = []; this.buildings = []; this.props = []; this.spots = []; this.locks = []; this.exits = [];
  }
  Section.prototype.set = function (x, y, code) { if (x < 0 || y < 0 || x >= N || y >= N) return; var i = y * N + x; this.g[i] = code; this.solid[i] = SOLID_G[code] ? 1 : 0; };
  Section.prototype.get = function (x, y) { return (x < 0 || y < 0 || x >= N || y >= N) ? -1 : this.g[y * N + x]; };
  Section.prototype.rect = function (x, y, w, h, code) { for (var j = y; j < y + h; j++) for (var i = x; i < x + w; i++) this.set(i, j, code); };
  Section.prototype.free = function (x, y, w, h) {
    for (var j = y; j < y + (h || 1); j++) for (var i = x; i < x + (w || 1); i++) { if (i < 0 || j < 0 || i >= N || j >= N) return false; var k = j * N + i; if (this.solid[k] || this.spotAt[k] || this.doorAt[k]) return false; }
    return true;
  };
  Section.prototype.block = function (x, y, w, h) { for (var j = y; j < y + (h || 1); j++) for (var i = x; i < x + (w || 1); i++) if (i >= 0 && j >= 0 && i < N && j < N) this.solid[j * N + i] = 1; };
  Section.prototype.prop = function (o, solidW, solidH) { this.props.push(o); if (solidW) this.block(o.x, o.y, solidW, solidH || 1); return o; };

  // ================= an inside map =================
  function Inside(W, H, floor) {
    this.W = W; this.H = H; this.t = new Uint8Array(W * H); this.solid = new Uint8Array(W * H);
    this.spotAt = new Int16Array(W * H); this.doorAt = new Int16Array(W * H); this.furn = []; this.rooms = []; this.doors = [];
    for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) {
      var wall = y < 2 || y === H - 1 || x === 0 || x === W - 1;
      this.t[y * W + x] = y < 2 ? F.BACK : wall ? F.WALL : floor; this.solid[y * W + x] = wall ? 1 : 0;
    }
  }
  Inside.prototype.floor = function (x, y, w, h, code) { for (var j = y; j < y + h; j++) for (var i = x; i < x + w; i++) this.t[j * this.W + i] = code; };
  Inside.prototype.room = function (x, y, w, h, type, code) { this.floor(x, y, w, h, code); var r = { x: x, y: y, w: w, h: h, type: type }; this.rooms.push(r); return r; };
  Inside.prototype.vwall = function (x, y0, y1) { for (var y = y0; y <= y1; y++) { this.t[y * this.W + x] = F.WALL; this.solid[y * this.W + x] = 1; } };
  // a wall running across is seen face on from the room below, like the top wall
  Inside.prototype.hwall = function (y, x0, x1) { for (var x = x0; x <= x1; x++) { this.t[y * this.W + x] = F.BACK; this.solid[y * this.W + x] = 1; } };
  Inside.prototype.door = function (x, y, lock) { var k = y * this.W + x; this.t[k] = F.IDOOR; this.solid[k] = 0; this.doors.push({ x: x, y: y, lock: lock == null ? -1 : lock }); this.doorAt[k] = this.doors.length; };
  Inside.prototype.exitAt = function (x) { var y = this.H - 1, k = y * this.W + x; this.t[k] = F.EXIT; this.solid[k] = 0; this.exit = { x: x, y: y }; };
  // furniture: solid; walk set for things you walk over (a rug). spot: index of the search spot, or -1
  Inside.prototype.put = function (k, x, y, w, h, o) {
    o = o || {}; var f = { k: k, x: x, y: y, w: w || 1, h: h || 1, s: -1, v: o.v || 0, walk: !!o.walk };
    this.furn.push(f);
    if (!o.walk) for (var j = y; j < y + f.h; j++) for (var i = x; i < x + f.w; i++) this.solid[j * this.W + i] = 1;
    return f;
  };
  Inside.prototype.mirror = function () {
    var W = this.W, H = this.H, t = new Uint8Array(W * H), s = new Uint8Array(W * H), sa = new Int16Array(W * H), da = new Int16Array(W * H);
    for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) { var a = y * W + x, b = y * W + (W - 1 - x); t[b] = this.t[a]; s[b] = this.solid[a]; sa[b] = this.spotAt[a]; da[b] = this.doorAt[a]; }
    this.t = t; this.solid = s; this.spotAt = sa; this.doorAt = da;
    var fx = function (o) { o.x = W - o.x - (o.w || 1); };
    this.furn.forEach(function (f) { fx(f); f.flip = !f.flip; }); this.rooms.forEach(fx); this.doors.forEach(function (d) { d.x = W - 1 - d.x; });
    if (this.exit) this.exit.x = W - 1 - this.exit.x;
  };

  // ================= the generator for one world =================
  function World(seed, preset) { this.seed = seed; this.preset = preset || 'standard'; }

  // A search spot. In an inside map, pass the Inside; outside, pass null (it goes on the section's grid).
  function addSpot(S, kind, place, ins, x, y, w, h, name) {
    var s = { id: S.id.charAt(0) + 's' + S.spots.length, kind: kind, name: name || SPOT_NAME[kind] || kind, place: place, inside: !!ins, x: x, y: y, w: w || 1, h: h || 1, items: [], lock: -1 };
    S.spots.push(s);
    var grid = ins ? ins.spotAt : S.spotAt, GW = ins ? ins.W : N;
    for (var j = y; j < y + s.h; j++) for (var i = x; i < x + s.w; i++) grid[j * GW + i] = S.spots.length;
    if (!ins) S.block(x, y, s.w, s.h);
    if (place >= 0) S.places[place].spots.push(S.spots.length - 1);
    return S.spots.length - 1;
  }
  function furnSpot(S, ins, place, k, kind, x, y, w, h, o) { var f = ins.put(k, x, y, w, h, o); f.s = addSpot(S, kind, place, ins, x, y, w, h); return f; }
  function addLock(S, what, name, place) { S.locks.push({ id: S.id.charAt(0) + 'l' + S.locks.length, what: what, name: name, place: place, spot: -1 }); return S.locks.length - 1; }

  var SPOT_NAME = {
    fridge: 'Fridge', pantry: 'Pantry', cabinets: 'Cabinets', medcab: 'Medicine cabinet', closet: 'Closet', nightstand: 'Nightstand',
    workbench: 'Workbench', gshelf: 'Garage shelves', trunk: 'Trunk', glovebox: 'Glovebox', body: 'A body', dresser: 'Dresser',
    gasShelf: 'Shelves', cooler: 'Cooler', register: 'Register', backroom: 'Back room shelves', barnFood: 'Grocery aisle',
    barnHard: 'Hardware aisle', barnPharm: 'Pharmacy aisle', barnGoods: 'Bags and electronics', gunCounter: 'Sporting goods counter',
    motelCloset: 'Closet', motelStand: 'Nightstand', truckShelf: 'Shelves', truckCounter: 'Counter', bunKitchen: 'Walk-in fridge',
    bunCounter: 'Counter', tapes: 'Tape shelves', candy: 'Candy rack', liquor: 'Shelves', pawnCase: 'Display case', pawnShelf: 'Shelves',
    parts: 'Parts shelves', machines: 'Machines', lostFound: 'Lost and found', desk: "Teacher's desk", cubbies: 'Cubbies',
    nurse: "Nurse's cabinet", library: 'Bookshelves', cafPantry: 'Cafeteria pantry', axeCase: 'Fire axe case', officeDesk: 'Desk',
    churchPantry: 'Food pantry shelves', shedShelf: 'Shelves', shedBench: 'Workbench'
  };

  // ---------------- inside maps for each kind of place ----------------
  // Furniture sits in a room's top row (or hangs on the wall above it), so every room keeps a clear floor to walk.
  function homeInside(S, pi, style, garage, r) {
    var ins, W, H;
    if (style === 'trailer') {
      W = 18; H = 7; ins = new Inside(W, H, F.WOOD);
      ins.room(1, 2, 4, 4, 'bedroom', F.CARPET); ins.vwall(5, 2, 5);
      ins.room(6, 2, 2, 4, 'bath', F.TILE); ins.vwall(8, 2, 5);
      ins.room(9, 2, 4, 4, 'living', F.WOOD); ins.vwall(13, 2, 5);
      ins.room(14, 2, 3, 4, 'kitchen', F.LINO);
      ins.door(5, 4); ins.door(8, 5); ins.door(13, 4);
      ins.put('bed', 1, 2, 2, 2); furnSpot(S, ins, pi, 'stand', 'nightstand', 3, 2); furnSpot(S, ins, pi, 'closet', 'closet', 3, 1, 2, 1);
      furnSpot(S, ins, pi, 'medcab', 'medcab', 6, 1); ins.put('toilet', 7, 2);
      ins.put('couch', 10, 2, 2, 1); ins.put('tv', 12, 2); ins.put('rug', 10, 3, 2, 2, { walk: true });
      furnSpot(S, ins, pi, 'fridge', 'fridge', 14, 2); furnSpot(S, ins, pi, 'counter', 'cabinets', 15, 2); furnSpot(S, ins, pi, 'pantry', 'pantry', 16, 2);
      ins.put('wallcab', 15, 1);
      ins.exitAt(10);
    } else {
      var two = style === 'two';
      W = 15; H = two ? 11 : 10; var gw = garage ? 6 : 0; ins = new Inside(W + gw, H, F.WOOD);
      var fb = H - 2;                                  // the bottom floor row
      ins.vwall(7, 2, fb); ins.hwall(5, 1, 6); ins.hwall(5, 8, 13);
      ins.room(1, 2, 6, 3, 'bedroom', F.CARPET);
      ins.room(8, 2, 6, 3, 'kitchen', F.LINO);
      ins.room(1, 6, 2, fb - 5, 'bath', F.TILE); ins.vwall(3, 6, fb);
      ins.room(4, 6, 3, fb - 5, 'bedroom', F.CARPET);
      ins.room(8, 6, 6, fb - 5, 'living', F.WOOD);
      ins.door(12, 5); ins.door(7, 3); ins.door(7, fb - 1); ins.door(3, fb);
      // bedroom
      ins.put('bed', 1, 2, 2, 2); furnSpot(S, ins, pi, 'stand', 'nightstand', 3, 2); furnSpot(S, ins, pi, 'closet', 'closet', 4, 1, 2, 1);
      if (two) furnSpot(S, ins, pi, 'dresser', 'dresser', 6, 2); else ins.put('lamp', 6, 2);
      // kitchen
      furnSpot(S, ins, pi, 'fridge', 'fridge', 8, 2); ins.put('stove', 9, 2); ins.put('wallcab', 10, 1, 2, 1);
      furnSpot(S, ins, pi, 'counter', 'cabinets', 10, 2, 2, 1); furnSpot(S, ins, pi, 'pantry', 'pantry', 13, 2); ins.put('table', 9, 4, 2, 1);
      // bath and the second bedroom
      furnSpot(S, ins, pi, 'medcab', 'medcab', 1, 5); ins.put('toilet', 2, 6);
      ins.put('bed', 4, 6, 2, 2, { v: 1 }); furnSpot(S, ins, pi, 'stand', 'nightstand', 6, 6);
      // living room
      ins.put('couch', 9, 6, 3, 1); ins.put('tv', 13, 6); ins.put('rug', 9, 7, 3, fb - 6, { walk: true });
      if (two) ins.put('stairs', 13, 7, 1, 2);
      if (garage) {
        ins.vwall(W - 1, 2, fb); ins.room(W, 2, gw - 1, H - 3, 'garage', F.CONC); ins.door(W - 1, 3);
        furnSpot(S, ins, pi, 'bench', 'workbench', W, 2, 3, 1); furnSpot(S, ins, pi, 'gshelf', 'gshelf', W + gw - 2, 2, 1, 3);
        ins.put('mower', W + 3, 2); ins.put('oil', W + 1, H - 3, 2, 1, { walk: true });
      }
      ins.exitAt(10);
    }
    if (r.int(2)) flip(S, ins);
    return ins;
  }
  // mirror an inside map, and move its search spots with it
  function flip(S, ins) { ins.mirror(); ins.furn.forEach(function (f) { if (f.s >= 0) S.spots[f.s].x = f.x; }); }
  // a store: a back room behind a wall across the top, shelves in rows, a counter by the door
  function shopInside(S, pi, o, r) {
    var W = o.W, H = o.H, ins = new Inside(W, H, F.STORE);
    ins.room(1, 2, W - 2, 2, 'back', F.CONC); ins.hwall(4, 1, W - 2); ins.door(W - 3, 4);
    ins.room(1, 5, W - 2, H - 6, 'floor', F.STORE);
    furnSpot(S, ins, pi, o.backK || 'boxes', o.back || 'backroom', 1, 2, 3, 1);
    ins.put('boxes', 5, 2, 2, 1, { v: 1 });
    var aisles = o.aisles.slice(), ai = 0, right = o.cooler ? W - 6 : W - 5;
    for (var y = 6; y <= H - 4; y += 2) {
      if (o.split) {
        var mid = Math.floor((2 + right) / 2);
        furnSpot(S, ins, pi, o.shelfK || 'shelf', aisles[ai++ % aisles.length], 2, y, mid - 2, 1, { v: ai });
        furnSpot(S, ins, pi, o.shelfK || 'shelf', aisles[ai++ % aisles.length], mid + 1, y, right - mid, 1, { v: ai });
      } else if (o.booths && y > 6) {
        ins.put('booth', 2, y, 2, 1); ins.put('booth', 5, y, 2, 1);
      } else furnSpot(S, ins, pi, o.shelfK || 'shelf', aisles[ai++ % aisles.length], 2, y, right - 1, 1, { v: ai });
    }
    if (o.cooler) furnSpot(S, ins, pi, o.coolerK || 'cooler', o.cooler, W - 2, 5, 1, Math.min(3, H - 8));
    furnSpot(S, ins, pi, 'counter', o.counter || 'register', W - 5, H - 3, 3, 1);
    ins.exitAt(2);
    return ins;
  }
  function schoolInside(S, pi, r) {
    var W = 26, H = 14, ins = new Inside(W, H, F.LINO);
    ins.hwall(9, 1, W - 2); ins.room(1, 10, W - 2, 3, 'hall', F.LINO);
    var xs = [1, 7, 12, 17, 22], types = shuffle(r, ['class', 'nurse', 'class', 'library', 'cafeteria']);
    xs.forEach(function (x0, i) {
      var x1 = xs[i + 1] ? xs[i + 1] - 2 : W - 2, w = x1 - x0 + 1, t = types[i];
      if (i) ins.vwall(x0 - 1, 2, 8);
      ins.room(x0, 2, w, 7, t, t === 'cafeteria' ? F.TILE : t === 'library' ? F.CARPET : F.LINO);
      var dx = x0 + Math.floor(w / 2); ins.door(dx, 9);
      if (t === 'class') {
        furnSpot(S, ins, pi, 'tdesk', 'desk', x0, 2, 2, 1); furnSpot(S, ins, pi, 'cubbies', 'cubbies', x0 + 2, 1, Math.min(2, w - 2), 1);
        for (var dy = 4; dy <= 6; dy += 2) for (var ex = x0; ex <= x1; ex += 2) if (ex !== dx && ex + 1 !== dx) ins.put('sdesk', ex, dy);
      } else if (t === 'nurse') { furnSpot(S, ins, pi, 'nurse', 'nurse', x0, 1, 2, 1); ins.put('cot', x0, 4, 1, 2); }
      else if (t === 'library') { furnSpot(S, ins, pi, 'books', 'library', x0, 1, w, 1); ins.put('rtable', x0 + 1, 4, 2, 1); }
      else { furnSpot(S, ins, pi, 'pantry', 'cafPantry', x0, 2); furnSpot(S, ins, pi, 'fridge', 'fridge', x0 + 1, 2); ins.put('ctable', x0, 5, w - 1, 1); }
    });
    // the hall: lockers, a trophy case and the fire axe case on the wall
    var used = {}; ins.doors.forEach(function (d) { used[d.x] = 1; });
    var ax = -1; for (var x = 3; x < W - 3; x++) if (!used[x] && !used[x - 1] && !used[x + 1]) { ax = x; break; }
    furnSpot(S, ins, pi, 'axecase', 'axeCase', ax, 9);
    ins.exitAt(13);
    return ins;
  }
  function churchInside(S, pi, officeLock, r) {
    var W = 15, H = 12, ins = new Inside(W, H, F.WOOD);
    ins.room(1, 2, 9, 9, 'nave', F.WOOD); ins.vwall(10, 2, 10);
    ins.room(11, 2, 3, 4, 'office', F.CARPET); ins.hwall(6, 11, 13); ins.room(11, 7, 3, 4, 'pantry', F.CONC);
    ins.door(10, 4, officeLock); ins.door(10, 9);
    ins.put('altar', 4, 2, 3, 1); ins.put('rug', 5, 3, 1, 7, { walk: true });
    for (var y = 4; y <= 8; y += 2) { ins.put('pew', 2, y, 3, 1); ins.put('pew', 6, y, 3, 1); }
    furnSpot(S, ins, pi, 'odesk', 'officeDesk', 11, 2, 2, 1); ins.put('files', 13, 2);
    furnSpot(S, ins, pi, 'pshelf', 'churchPantry', 11, 6, 2, 1); ins.put('stairs', 13, 7, 1, 2);
    ins.exitAt(5);
    return ins;
  }
  function motelInside(S, pi, r) {
    var ins = new Inside(10, 7, F.CARPET);
    ins.room(1, 2, 5, 4, 'room', F.CARPET); ins.vwall(6, 2, 5); ins.room(7, 2, 2, 4, 'bath', F.TILE); ins.door(6, 4);
    ins.put('bed', 1, 2, 2, 2, { v: 2 }); furnSpot(S, ins, pi, 'stand', 'motelStand', 3, 2); furnSpot(S, ins, pi, 'closet', 'motelCloset', 4, 1, 2, 1);
    ins.put('tv', 5, 3); furnSpot(S, ins, pi, 'medcab', 'medcab', 7, 1); ins.put('toilet', 8, 2);
    ins.exitAt(2);
    if (r.int(2)) flip(S, ins);
    return ins;
  }
  function shedInside(S, pi) {
    var ins = new Inside(7, 5, F.CONC);
    ins.room(1, 2, 5, 2, 'shed', F.CONC);
    furnSpot(S, ins, pi, 'bench', 'shedBench', 1, 2, 2, 1); furnSpot(S, ins, pi, 'gshelf', 'shedShelf', 4, 1, 2, 1); ins.put('mower', 5, 2);
    ins.exitAt(3);
    return ins;
  }
  var SHOPS = {
    gas: { W: 12, H: 10, aisles: ['gasShelf'], cooler: 'cooler', clerk: 1 },
    barn: { W: 22, H: 14, aisles: ['barnFood', 'barnHard', 'barnFood', 'barnPharm', 'barnHard', 'barnGoods'], split: 1, cooler: 'gunCounter', coolerK: 'gcounter', clerk: 1 },
    truck: { W: 14, H: 11, aisles: ['truckShelf'], cooler: 'cooler', counter: 'truckCounter', clerk: 1 },
    bun: { W: 10, H: 10, aisles: ['bunCounter'], booths: 1, back: 'bunKitchen', backK: 'walkin', counter: 'register', shelfK: 'grill' },
    video: { W: 10, H: 10, aisles: ['tapes'], cooler: 'candy', coolerK: 'rack', clerk: 1 },
    liquor: { W: 9, H: 10, aisles: ['liquor'], clerk: 1 },
    pawn: { W: 10, H: 10, aisles: ['pawnShelf'], counter: 'pawnCase', clerk: 1 },
    parts: { W: 11, H: 10, aisles: ['parts'], clerk: 1 },
    suds: { W: 11, H: 10, aisles: ['machines'], back: 'lostFound', shelfK: 'washers' }
  };

  // ---------------- what's in each kind of spot (items.md, Where you find it; spec 002, 6 and 9) ----------------
  var LOOT = {
    fridge: [['spoiled', 8], ['soda', 2], ['water', 1]],
    pantry: [['beans', 4], ['ravioli', 3], ['cereal', 3], ['chocolate', 1], ['water', 1], ['canopener', 1]],
    cabinets: [['canopener', 2], ['knife', 2], ['cleaver', 0.6], ['cans', 2], ['bottle', 2], ['rags', 1], ['lighter', 1], ['beans', 1], ['ravioli', 1], ['water', 1]],
    medcab: [['bandage', 3], ['alcohol', 3], ['painkillers', 3], ['pills', 1], ['antibiotics', 0.25]],
    closet: [['backpack', 1], ['fannypack', 1], ['duffel', 0.6], ['rags', 2], ['golfclub', 1], ['bat', 0.8], ['hockey', 0.8], ['flashlight', 1], ['photo', 1], ['cards', 0.6], ['mixtape', 1], ['magFixer', 0.4], ['magPrepper', 0.4], ['boombox', 0.3], ['revolver', 0.12]],
    nightstand: [['batteriesD', 1], ['batteriesAA', 1], ['painkillers', 1], ['photo', 1.5], ['cigarettes', 1], ['pills', 0.8], ['flashlight', 1], ['mixtape', 0.6], ['cassette', 0.5], ['drawing', 1], ['revolverAmmo', 0.4], ['pistolAmmo', 0.3], ['pistol', 0.1], ['pocketpixel', 0.3]],
    dresser: [['rags', 2], ['photo', 1], ['cards', 1], ['cigarettes', 0.6], ['whiskey', 0.4], ['drawing', 0.8]],
    workbench: [['hammer', 2], ['ducttape', 2], ['rope', 2], ['crowbar', 1], ['hatchet', 1], ['lockpicks', 0.1], ['snare', 0.5], ['wood', 2], ['gasoline', 1], ['batteriesD', 1], ['flashlight', 0.8], ['magFixer', 0.4]],
    gshelf: [['wood', 2], ['gasoline', 1.5], ['rope', 1], ['cans', 2], ['seeds', 1], ['shovel', 1], ['fireaxe', 0.15], ['machete', 0.4], ['pipe', 1], ['batteriesD', 1], ['radio', 0.5], ['rifleAmmo', 0.3], ['rifle', 0.08]],
    trunk: [['firstaid', 1], ['rope', 1], ['gasoline', 1], ['duffel', 0.3], ['crowbar', 0.5], ['bat', 0.5], ['water', 1.2], ['jerky', 1], ['beans', 0.6], ['flashlight', 0.6], ['rags', 1], ['roadmap', 0.3]],
    glovebox: [['roadmap', 1], ['flashlight', 0.8], ['batteriesD', 0.6], ['cigarettes', 1], ['lighter', 1], ['painkillers', 0.6], ['mixtape', 1], ['pistolAmmo', 0.2], ['chocolate', 0.6]],
    body: [['fannypack', 0.4], ['backpack', 0.3], ['bat', 0.5], ['pipe', 0.4], ['knife', 0.4], ['machete', 0.2], ['hatchet', 0.3], ['golfclub', 0.3], ['beans', 0.6], ['jerky', 0.6], ['chocolate', 0.6], ['soda', 0.5], ['photo', 1], ['cigarettes', 0.8], ['lighter', 0.6], ['drawing', 0.4]],
    gasShelf: [['chocolate', 2], ['jerky', 2], ['soda', 2], ['water', 2], ['batteriesD', 2], ['batteriesAA', 1], ['lighter', 2], ['roadmap', 1.5], ['cigarettes', 1.5], ['cereal', 0.5]],
    cooler: [['soda', 4], ['water', 4]],
    register: [['cigarettes', 1], ['lighter', 1], ['batteriesAA', 0.5], ['chocolate', 1], ['cards', 0.3]],
    backroom: [['water', 2], ['soda', 1], ['rags', 1], ['cans', 1], ['flashlight', 0.5], ['ducttape', 1], ['firstaid', 0.5], ['cereal', 0.5], ['beans', 1]],
    barnFood: [['beans', 3], ['ravioli', 3], ['cereal', 2], ['water', 2], ['soda', 1], ['chocolate', 1]],
    barnHard: [['hammer', 1], ['ducttape', 2], ['rope', 2], ['crowbar', 1], ['batteriesD', 2], ['flashlight', 1], ['lighter', 1], ['snare', 1], ['seeds', 1], ['wood', 1], ['canopener', 1], ['fireaxe', 0.4], ['machete', 0.4], ['shovel', 0.5]],
    barnPharm: [['bandage', 2], ['alcohol', 2], ['painkillers', 2], ['firstaid', 1], ['pills', 0.5], ['splint', 0.3]],
    barnGoods: [['backpack', 1.5], ['fannypack', 1.5], ['duffel', 1], ['hikingpack', 0.2], ['boombox', 0.6], ['cassette', 0.6], ['pocketpixel', 0.6], ['vhs', 1], ['rags', 1], ['batteriesAA', 1]],
    motelCloset: [['backpack', 0.6], ['duffel', 0.4], ['rags', 1], ['bandage', 0.6], ['cigarettes', 0.5]],
    motelStand: [['firstaid', 0.8], ['painkillers', 1], ['cigarettes', 1], ['whiskey', 0.6], ['photo', 0.6], ['mixtape', 0.5], ['pills', 0.5]],
    truckShelf: [['jerky', 4], ['soda', 2], ['water', 2], ['chocolate', 1], ['batteriesD', 1], ['roadmap', 1], ['cigarettes', 1]],
    truckCounter: [['roadmap', 1], ['cigarettes', 1], ['lighter', 1]],
    bunKitchen: [['spoiled', 6], ['soda', 1], ['rags', 1], ['cleaver', 0.5]],
    bunCounter: [['spoiled', 2], ['soda', 1], ['rags', 1]],
    tapes: [['vhs', 5], ['mixtape', 0.4]],
    candy: [['chocolate', 3], ['soda', 1]],
    liquor: [['whiskey', 4], ['cigarettes', 2], ['bottle', 1]],
    pawnShelf: [['hammer', 1], ['crowbar', 1], ['ducttape', 1], ['cassette', 2], ['boombox', 1], ['pocketpixel', 1], ['cards', 1], ['radio', 1], ['golfclub', 0.5]],
    parts: [['ducttape', 3], ['rope', 2], ['gasoline', 2], ['crowbar', 1], ['hammer', 1], ['batteriesD', 1], ['rags', 1], ['flashlight', 0.5]],
    machines: [['rags', 3], ['quarters', 3]],
    lostFound: [['backpack', 1], ['duffel', 0.6], ['fannypack', 1], ['photo', 0.5], ['rags', 1]],
    desk: [['magFixer', 0.4], ['magPrepper', 0.4], ['painkillers', 0.5], ['chocolate', 0.6], ['cassette', 0.3], ['drawing', 1]],
    cubbies: [['drawing', 2], ['chocolate', 0.5], ['cereal', 0.6], ['cards', 0.6], ['batteriesAA', 0.5], ['backpack', 0.5]],
    nurse: [['splint', 2], ['bandage', 2], ['alcohol', 1], ['painkillers', 1]],
    library: [['magFixer', 1], ['magPrepper', 1], ['drawing', 0.5]],
    cafPantry: [['beans', 3], ['cereal', 3], ['ravioli', 2], ['water', 1]],
    officeDesk: [['photo', 1], ['lighter', 1], ['painkillers', 0.6], ['whiskey', 0.3], ['cigarettes', 0.3], ['batteriesD', 0.5]],
    churchPantry: [['beans', 3], ['ravioli', 3], ['cereal', 2], ['water', 2], ['canopener', 0.5]],
    shedShelf: [['shovel', 1], ['rope', 1], ['gasoline', 1], ['seeds', 1], ['wood', 1]],
    shedBench: [['hammer', 1], ['wood', 1], ['snare', 0.6], ['ducttape', 0.6], ['hatchet', 0.5]],
    gunCounter: [], pawnCase: [], axeCase: []
  };
  // spots that can take more food if a section comes up short (spec 002, 6, How much food)
  var FOODISH = ['pantry', 'cafPantry', 'churchPantry', 'barnFood', 'gasShelf', 'truckShelf', 'backroom', 'trunk', 'cooler'];

  World.prototype.item = function (r, id, S) {
    var d = I[id], it = { id: id, n: 1 };
    if (d.kind === 'ammo') { var b = d.box, n = b[0] + r.int(b[1] - b[0] + 1); n = Math.round(n * (this.preset === 'gentle' ? 1.5 : this.preset === 'harsh' ? 0.5 : 1)); it.n = Math.max(1, n); }
    if (d.kind === 'weapon' && !d.gun || d.kind === 'tool' && (d.force || id === 'hatchet')) it.w = 35 + r.int(66);
    if (id === 'flashlight') it.charge = r.int(3) ? 60 * (1 + r.int(8)) : 0;
    return it;
  };
  World.prototype.lootSpot = function (S, s, r) {
    var table = LOOT[s.kind] || [], self = this;
    if (s.kind === 'gunCounter') { s.items.push(this.item(r, 'shotgun', S), this.item(r, 'shells', S)); return; }
    if (s.kind === 'pawnCase') { var gun = r.int(2) ? 'revolver' : 'pistol'; s.items.push(this.item(r, gun, S), this.item(r, gun === 'revolver' ? 'revolverAmmo' : 'pistolAmmo', S)); return; }
    if (s.kind === 'axeCase') { s.items.push(this.item(r, 'fireaxe', S)); return; }
    if (s.kind === 'library') s.items.push(this.item(r, 'fieldguide', S));
    if (s.kind === 'truckCounter') s.items.push(this.item(r, 'cbradio', S));
    if (s.kind === 'fridge') { s.items.push({ id: 'spoiled', n: 1 + r.int(2) }); if (r.int(3)) return; }
    var n = r.int(3) === 0 ? 0 : 1 + r.int(3);
    if (n && this.preset === 'gentle' && r.next() < 0.3) n++;
    if (n && this.preset === 'harsh' && r.next() < 0.3) n--;
    if (n === 0 && this.preset === 'gentle' && r.next() < 0.15) n = 1;
    for (var i = 0; i < n && table.length; i++) {
      var list = table.filter(function (e) { return !(I[e[0]].gun && S.gunPlaced); });
      var id = wpick(r, list);
      if (I[id].gun) S.gunPlaced = true;
      addItem(s.items, self.item(r, id, S));
    }
  };
  // put an item in a list, stacking it where it can
  function addItem(list, it) {
    var d = I[it.id];
    if (d.stack > 1 && it.w == null) for (var i = 0; i < list.length; i++) if (list[i].id === it.id && list[i].n < d.stack) { var room = d.stack - list[i].n, k = Math.min(room, it.n); list[i].n += k; it.n -= k; if (!it.n) return; }
    list.push(it);
  }
  function meals(S) { var m = 0; S.spots.forEach(function (s) { s.items.forEach(function (it) { if (I[it.id].food) m += I[it.id].food * it.n; }); }); return m / LAI.MEAL; }
  World.prototype.lootAll = function (S) {
    var r = stream(this.seed, 'loot:' + S.id), self = this;
    S.spots.forEach(function (s) { self.lootSpot(S, s, r); });
    // the food budget: about 25 to 35 meals a section on Standard, scaled by the preset
    var k = this.preset === 'gentle' ? 1.3 : this.preset === 'harsh' ? 0.7 : 1, lo = 25 * k, hi = 35 * k;
    var fs = S.spots.filter(function (s) { return FOODISH.indexOf(s.kind) >= 0; });
    for (var guard = 0; meals(S) < lo && guard < 200 && fs.length; guard++) addItem(pick(r, fs).items, { id: pick(r, ['beans', 'ravioli', 'cereal', 'jerky']), n: 1 });
    for (guard = 0; meals(S) > hi && guard < 400; guard++) {
      var withFood = S.spots.filter(function (s) { return s.items.some(function (it) { return I[it.id].food && it.id !== 'spoiled'; }); });
      if (!withFood.length) break;
      var sp = pick(r, withFood), idx = sp.items.findIndex(function (it) { return I[it.id].food && it.id !== 'spoiled'; });
      if (--sp.items[idx].n <= 0) sp.items.splice(idx, 1);
    }
    S.meals = Math.round(meals(S) * 10) / 10;
    // keys for some locks turn up in searches elsewhere in the section (spec 002, 7)
    var keyable = S.spots.filter(function (s) { return ['nightstand', 'glovebox', 'register', 'officeDesk', 'closet', 'body', 'motelStand', 'desk'].indexOf(s.kind) >= 0; });
    S.locks.forEach(function (L, li) {
      if (!L.keyed || !keyable.length) return;
      var cand = keyable.filter(function (s) { return s.place !== L.place || L.place < 0; });
      if (!cand.length) return;
      var sp = pick(r, cand); sp.items.push({ id: 'key', n: 1, lock: L.id, name: L.keyName });
    });
    // car keys: a home's car keys are inside it; the car sits in its driveway
    S.props.forEach(function (p, pi) {
      if (p.k !== 'car' || p.keysIn == null) return;
      var pl = S.places[p.keysIn], c = pl.spots.filter(function (si) { return ['nightstand', 'closet', 'dresser', 'motelStand'].indexOf(S.spots[si].kind) >= 0; });
      if (c.length) S.spots[pick(r, c)].items.push({ id: 'carkeys', n: 1, car: pi, name: 'Car keys: ' + p.label });
    });
  };

  // ---------------- props ----------------
  var CAR_COLORS = [['blue', ['#7a9ab4', '#5a7a9a', '#46607e', '#344a62']], ['red', ['#d06a3a', '#b4582e', '#8a4028', '#6a3424']], ['tan', ['#d8c08a', '#b8a070', '#94805a', '#6e5e44']],
    ['white', ['#e8e4d8', '#c8c4b4', '#a8a494', '#7e7a6c']], ['green', ['#7e9a6e', '#5e7a50', '#46603e', '#34482e']], ['brown', ['#a87e5a', '#84603e', '#644630', '#463222']],
    ['gray', ['#b8c4cc', '#8a96a0', '#6e7a84', '#4e5860']], ['maroon', ['#9a4a5a', '#7a3444', '#5a2634', '#3e1a24']]];
  var CAR_MAKES = ['Ridgeline', 'Marquis', 'Vantage', 'Prairie', 'Monarch', 'Cutlass Ace', 'Sundance'];
  // a car: 3 tiles wide on its bottom row (the roof's row above is walkable, behind it). Trunk on the left, glovebox on the right.
  function addCar(S, x, y, r, o) {
    o = o || {};
    var c = pick(r, CAR_COLORS), wagon = r.int(3) === 0, wreck = o.wreck != null ? o.wreck : r.int(4) === 0;
    var p = S.prop({ k: 'car', x: x, y: y, len: 46, col: c[1], wagon: wagon, wreck: wreck, label: c[0] + ' ' + pick(r, CAR_MAKES) + ' ' + (wagon ? 'wagon' : 'sedan') });
    var t = addSpot(S, 'trunk', -1, null, x, y, 1, 1), gb = addSpot(S, 'glovebox', -1, null, x + 1, y, 2, 1);
    p.spots = [t, gb];
    if (r.int(3) === 0) { var L = addLock(S, 'trunk', 'the trunk of the ' + p.label, -1); S.locks[L].spot = t; S.spots[t].lock = L; S.locks[L].car = S.props.length - 1; }
    return p;
  }
  function addBody(S, x, y, r, o) {
    var si = addSpot(S, 'body', -1, null, x, y, 1, 1);
    return S.prop({ k: 'body', x: x, y: y, s: si, v: r.int(6), flip: r.int(2), wall: o && o.wall });
  }
  function tree(S, x, y, r, big) { if (!S.free(x, y)) return; S.prop({ k: 'tree', x: x, y: y, v: r.int(4), big: big == null ? r.int(3) === 0 : big }, 1, 1); }
  function borderTrees(S, r) {
    for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) {
      if (x > 1 && y > 1 && x < N - 2 && y < N - 2) continue;
      S.set(x, y, G.GRASS2);
      if (((x + y) & 1) === 0 || r.int(3) === 0) tree(S, x, y, r, (x + y * 3) % 5 === 0);
      else S.block(x, y);
    }
  }

  // ================= the houses section (spec 002, 1) =================
  var STREETS = ['Elm', 'Oak', 'Maple', 'Cedar', 'Walnut', 'Birch', 'Hickory', 'Poplar'];
  World.prototype.houses = function () {
    var r = stream(this.seed, 'houses'), S = new Section('houses', 'The houses');
    S.rect(0, 0, N, N, G.GRASS);
    var rows = [12, 26 + r.int(3) - 1, 40 + r.int(3) - 1, 54];
    var vx = [16 + r.int(5), 37 + r.int(5)];
    var hw = 1 + r.int(2);                              // which road is Route 9, the way to the highway strip
    var names = shuffle(r, STREETS), resid = r.int(2) ? 4 : 3;
    S.streets = rows.map(function (y, i) { return { y: y, name: i === hw && resid === 3 ? 'Route 9' : names[i] + ' St', highway: i === hw }; });
    // roads, sidewalks and the two cross streets
    rows.forEach(function (y, i) {
      var hwy = i === hw, x1 = hwy ? N - 1 : 56;
      S.rect(3, y, x1 - 2, 2, G.ROAD);
      S.rect(3, y - 1, 54, 1, S.streets[i].name === 'Route 9' ? G.SHOULDER : G.WALK); S.rect(3, y + 2, 54, 1, S.streets[i].name === 'Route 9' ? G.SHOULDER : G.WALK);
    });
    vx.forEach(function (x) { S.rect(x - 1, rows[0] - 1, 1, rows[3] - rows[0] + 4, G.WALK); S.rect(x + 2, rows[0] - 1, 1, rows[3] - rows[0] + 4, G.WALK); S.rect(x, rows[0], 2, rows[3] - rows[0] + 2, G.ROAD); });
    borderTrees(S, r);
    // the road out: clear the trees where Route 9 leaves the east edge
    var hy = rows[hw];
    S.props = S.props.filter(function (p) { return !(p.x >= N - 2 && p.y >= hy - 1 && p.y <= hy + 2); });
    for (var x = N - 3; x < N; x++) { S.set(x, hy - 1, G.SHOULDER); S.set(x, hy, G.ROAD); S.set(x, hy + 1, G.ROAD); S.set(x, hy + 2, G.SHOULDER); }
    S.exits.push({ x: N - 1, y0: hy, y1: hy + 1, dir: 'right', to: 'strip' });
    S.highway = hy;
    // lots: the band north of each road, split by the cross streets
    var segs = [];
    rows.forEach(function (y, i) {
      var top = i ? rows[i - 1] + 3 : 2, bottom = y - 2;
      [[3, vx[0] - 2], [vx[0] + 3, vx[1] - 2], [vx[1] + 3, 56]].forEach(function (s) { segs.push({ band: i, x0: s[0], x1: s[1], top: top, bot: bottom, street: S.streets[i] }); });
    });
    segs = shuffle(r, segs);
    var wide = segs.filter(function (s) { return s.x1 - s.x0 >= 15 && s.bot - s.top >= 7; });
    var school = wide[0] || segs[0], rest = segs.filter(function (s) { return s !== school; });
    var park = rest[0], church = rest[1]; rest = rest.slice(2);
    this.schoolLot(S, school, r);
    var homes = 12 + r.int(4), made = 0, self = this;
    made += this.parkLot(S, park, r, homes - made);
    made += this.churchLot(S, church, r, homes - made);
    rest.forEach(function (seg) { made += self.homeLot(S, seg, r, homes - made); });
    // dressing on the roads: dead cars along the curb, a body or two
    var self2 = this;
    rows.forEach(function (y, i) {
      for (var n = 0; n < 2 + r.int(2); n++) {
        var cx = 4 + r.int(50), lane = r.int(2) ? y : y + 1;
        if (vx.some(function (v) { return cx + 2 >= v - 1 && cx <= v + 2; })) continue;
        if (S.free(cx, lane, 3, 1) && S.free(cx, lane === y ? y + 1 : y, 3, 1)) addCar(S, cx, lane, r);
      }
    });
    for (var b = 0; b < 3; b++) { var y0 = pick(r, rows) + 2, bx = 4 + r.int(50); if (S.free(bx, y0)) addBody(S, bx, y0, r); }
    // the wake spot: a bedroom in a home that isn't locked
    var open = S.places.filter(function (p) { return p.kind === 'home' && p.lock < 0; });
    var wp = pick(r, open), bed = wp.inside.furn.filter(function (f) { return f.k === 'bed'; })[0];
    S.wake = { place: S.places.indexOf(wp), x: bed.x, y: bed.y + 2 };
    return S;
  };
  World.prototype.place = function (S, kind, name, b, door, o) {
    o = o || {};
    var p = { id: S.id.charAt(0) + 'p' + S.places.length, kind: kind, name: name, b: b, door: door, lock: o.lock == null ? -1 : o.lock, inside: null, spots: [], clerk: !!o.clerk };
    S.places.push(p);
    S.doorAt[door.y * N + door.x] = S.places.length;
    S.solid[door.y * N + door.x] = 0;
    S.buildings[b].doors.push(S.places.length - 1);
    return S.places.length - 1;
  };
  World.prototype.building = function (S, x, y, w, h, o) {
    S.rect(x, y, w, h, G.BUILD);
    var b = Object.assign({ x: x, y: y, w: w, h: h, face: 2, doors: [] }, o);
    S.buildings.push(b); return S.buildings.length - 1;
  };
  // one home on its lot: the house, a path to the sidewalk, maybe a garage, a driveway car, a backyard
  World.prototype.home = function (S, x, seg, r, style, garage, drive) {
    var dims = { ranch: [6, 5], two: [5, 6], trailer: [7, 4] }[style], w = dims[0] + (garage ? 3 : 0), h = dims[1];
    var y = seg.bot - h, left = garage && r.int(2);
    var num = 10 + S.places.length * 2 + r.int(2) * 2;
    var b = this.building(S, x, y, w, h, { style: style, face: style === 'two' ? 3 : 2, garage: garage ? (left ? 'left' : 'right') : null, col: r.int(6), roofCol: r.int(4), boarded: r.int(4) === 0 ? r.int(3) : -1, curtains: r.int(3) });
    var hx = garage && left ? x + 3 : x, dx = hx + Math.floor(dims[0] / 2);
    var locked = r.int(4) === 0, addr = num + ' ' + seg.street.name;
    var L = locked ? addLock(S, 'door', addr, -1) : -1;
    var pi = this.place(S, 'home', addr, b, { x: dx, y: y + h - 1 }, { lock: L });
    if (L >= 0) { S.locks[L].place = pi; S.locks[L].keyed = r.int(2) === 0; S.locks[L].keyName = 'Key: ' + addr; }
    S.places[pi].style = style;
    S.places[pi].inside = homeInside(S, pi, style, garage, r);
    if (garage && r.int(4) === 0) { var gi = S.places[pi].inside, gf = gi.furn.filter(function (f) { return f.k === 'mower'; })[0]; if (gf) { gf.k = 'bike'; S.places[pi].bike = { x: gf.x, y: gf.y }; } }
    S.set(dx, y + h, G.PATH); S.set(dx, y + h + 1, G.PATH);
    // driveway and maybe a car in front of the garage or the house
    var gx = garage ? (left ? x : x + w - 3) : drive ? x + w : -1;
    if (gx >= 0) {
      S.rect(gx, y + h, 3, 2, G.DRIVE);
      if (r.int(5) < 2 && (gx + 2 < dx || gx > dx) && S.free(gx, y + h, 3, 1)) {
        var car = addCar(S, gx, y + h, r, { wreck: false }); if (r.int(2)) car.keysIn = pi;
      }
    }
    // mailbox and bins by the walk
    var mx = dx + (r.int(2) ? 1 : -1);
    if (S.free(mx, y + h + 1)) S.prop({ k: 'mailbox', x: mx, y: y + h + 1, v: r.int(4) }, 1, 1);
    // the backyard: a fence or hedge at the back, trees, and one or two things people left
    var by = seg.top;
    for (var i = x - 1; i <= x + w; i++) if (r.int(5)) { if (S.free(i, by)) { S.set(i, by, r.int(3) ? G.FENCE : G.HEDGE); } }
    var yard = [['tree', 3], ['clothes', 1], ['swing', 0.6], ['grill', 1], ['pool', 0.6], ['doghouse', 0.6], ['garden', 1], ['tire', 0.6]];
    for (var k = 0; k < 2 + r.int(2); k++) {
      var what = wpick(r, yard), px = x + r.int(w), py = by + 1 + r.int(Math.max(1, y - by - 1));
      if (py >= y) continue;
      if (what === 'tree') tree(S, px, py, r);
      else if (S.free(px, py, 2, 1)) S.prop({ k: what, x: px, y: py, v: r.int(3) }, what === 'garden' || what === 'pool' || what === 'tire' ? 0 : what === 'swing' || what === 'clothes' ? 2 : 1, 1);
    }
    if (r.int(6) === 0 && S.free(x - 1, y + h)) addBody(S, x - 1, y + h, r);
    return w;
  };
  World.prototype.homeLot = function (S, seg, r, want) {
    var x = seg.x0, made = 0;
    while (made < want) {
      var style = wpick(r, [['ranch', 5], ['two', 3], ['trailer', 2]]), garage = style !== 'trailer' && r.int(3) === 0;
      var w = { ranch: 6, two: 5, trailer: 7 }[style] + (garage ? 3 : 0), drive = !garage && r.int(2) === 0;
      if (x + w - 1 > seg.x1 && garage) { garage = false; w -= 3; }
      if (x + w - 1 > seg.x1) break;
      if (x + w + 2 > seg.x1) drive = false;
      this.home(S, x, seg, r, style, garage, drive);
      made++; x += w + (drive ? 3 : 1) + r.int(2);
    }
    // what's left of the lot: trees and a hedge
    for (var i = x; i <= seg.x1; i++) if (r.int(3) === 0) tree(S, i, seg.top + 1 + r.int(Math.max(1, seg.bot - seg.top - 1)), r);
    return made;
  };
  World.prototype.schoolLot = function (S, seg, r) {
    var w = Math.min(15, seg.x1 - seg.x0 + 1), h = 5, x = seg.x0 + Math.floor((seg.x1 - seg.x0 + 1 - w) / 2), y = seg.bot - h;
    S.rect(seg.x0, seg.top + 1, seg.x1 - seg.x0 + 1, seg.bot - seg.top, G.PLAY);
    var b = this.building(S, x, y, w, h, { style: 'school', sign: 'LINCOLN ELEMENTARY' });
    var pi = this.place(S, 'school', 'Lincoln Elementary', b, { x: x + 7, y: y + h - 1 });
    S.places[pi].inside = schoolInside(S, pi, r);
    S.set(x + 7, y + h, G.WALK); S.set(x + 7, y + h + 1, G.WALK);
    S.prop({ k: 'flag', x: x + 10, y: y + h }, 1, 1);
    if (S.free(x - 2, y + 1, 2, 1)) S.prop({ k: 'swing', x: x - 2, y: y + 1, v: 1 }, 2, 1);
    for (var i = seg.x0; i <= seg.x1; i++) if (S.free(i, seg.top) && r.int(4)) S.set(i, seg.top, G.FENCE);
    var bus = { x: x + w + 1, y: y + h };
    if (bus.x + 2 <= seg.x1 && S.free(bus.x, bus.y, 3, 1)) addCar(S, bus.x, bus.y, r, { wreck: false });
  };
  World.prototype.churchLot = function (S, seg, r, wantHomes) {
    var w = 9, h = 6, x = seg.x0 + 1, y = seg.bot - h;
    var b = this.building(S, x, y, w, h, { style: 'church', face: 3, sign: 'FIRST GRACE' });
    var L = addLock(S, 'door', 'the church office', -1);
    var pi = this.place(S, 'church', 'First Grace Church', b, { x: x + 4, y: y + h - 1 });
    S.locks[L].place = pi; S.locks[L].keyed = true; S.locks[L].keyName = 'Church office key'; S.locks[L].what = 'room';
    S.places[pi].inside = churchInside(S, pi, L, r);
    S.set(x + 4, y + h, G.PATH); S.set(x + 4, y + h + 1, G.PATH);
    S.prop({ k: 'board', x: x + w + 1, y: y + h, v: 0 }, 1, 1);
    // the graveyard behind it
    for (var gy = seg.top + 1; gy < y - 1; gy += 2) for (var gx = x; gx < x + w; gx += 2) if (r.int(3) && S.free(gx, gy)) S.prop({ k: 'stone', x: gx, y: gy, v: r.int(3) }, 1, 1);
    var rest = { x0: x + w + 3, x1: seg.x1, top: seg.top, bot: seg.bot, street: seg.street };
    return rest.x1 - rest.x0 >= 6 ? this.homeLot(S, rest, r, wantHomes) : 0;
  };
  World.prototype.parkLot = function (S, whole, r, wantHomes) {
    var seg = { x0: whole.x0, x1: whole.x0 + Math.min(10, whole.x1 - whole.x0), top: whole.top, bot: whole.bot, street: whole.street };
    var mid = Math.floor((seg.x0 + seg.x1) / 2);
    for (var y = seg.top + 1; y <= seg.bot + 1; y++) S.set(mid, y, G.PATH);
    for (var x = seg.x0 + 1; x < seg.x1; x++) S.set(x, seg.top + 3, G.PATH);
    var sw = 4, sh = 3, sx = seg.x1 - sw, sy = seg.top;
    var b = this.building(S, sx, sy, sw, sh, { style: 'shed' });
    var pi = this.place(S, 'shed', 'The park shed', b, { x: sx + 1, y: sy + sh - 1 });
    S.places[pi].inside = shedInside(S, pi);
    S.set(sx + 1, sy + sh, G.PATH);
    var things = [['swing', 2], ['bench', 1], ['bench', 1], ['sandbox', 2], ['fountain', 1]];
    things.forEach(function (t) {
      for (var tries = 0; tries < 12; tries++) {
        var px = seg.x0 + r.int(seg.x1 - seg.x0 - 1), py = seg.top + 4 + r.int(Math.max(1, seg.bot - seg.top - 4));
        if (S.free(px, py, t[1], 1) && S.get(px, py) === G.GRASS && S.get(px + t[1] - 1, py) === G.GRASS) { S.prop({ k: t[0], x: px, y: py, v: r.int(3) }, t[0] === 'sandbox' ? 0 : t[1], 1); break; }
      }
    });
    for (var k = 0; k < 7; k++) { var tx = seg.x0 + r.int(seg.x1 - seg.x0 + 1), ty = seg.top + 1 + r.int(seg.bot - seg.top); if (S.get(tx, ty) === G.GRASS) tree(S, tx, ty, r, true); }
    if (S.free(mid + 1, seg.bot)) addBody(S, mid + 1, seg.bot, r);
    var rest = { x0: seg.x1 + 2, x1: whole.x1, top: whole.top, bot: whole.bot, street: whole.street };
    return rest.x1 - rest.x0 >= 5 ? this.homeLot(S, rest, r, wantHomes) : 0;
  };

  // ================= the highway strip (spec 002, 1) =================
  var STRIP = {
    gas: { name: 'Star Fuel', w: 9, h: 5, style: 'gas', sign: 'STAR FUEL', neon: 1 },
    barn: { name: 'Bargain Barn', w: 16, h: 6, style: 'barn', sign: 'BARGAIN BARN' },
    motel: { name: 'Starlite Motor Inn', w: 27, h: 5, style: 'motel', sign: 'STARLITE', neon: 1 },
    truck: { name: 'Crossroads Travel Plaza', w: 12, h: 5, style: 'truck', sign: 'CROSSROADS' },
    bun: { name: 'Big Bun Burgers', w: 7, h: 4, style: 'bun', sign: 'BIG BUN', neon: 1 },
    video: { name: 'Reel Time Video', w: 7, h: 4, style: 'video', sign: 'REEL TIME' },
    liquor: { name: "Lucky's Liquor", w: 6, h: 4, style: 'liquor', sign: "LUCKY'S" },
    pawn: { name: 'Gold Mine Pawn', w: 6, h: 4, style: 'pawn', sign: 'GOLD MINE PAWN' },
    parts: { name: 'PartsPro', w: 8, h: 4, style: 'parts', sign: 'PARTSPRO' },
    suds: { name: 'Suds City', w: 7, h: 4, style: 'suds', sign: 'SUDS CITY' }
  };
  World.prototype.strip = function () {
    var r = stream(this.seed, 'strip'), S = new Section('strip', 'Highway strip');
    S.rect(0, 0, N, N, G.GRASS);
    var HY = 28;                                          // the highway: two lanes, rows 28 and 29
    S.rect(0, 9, N, 2, G.GRAVEL);                         // the back lane, with the roadside homes behind it
    S.rect(2, 9, 2, 12, G.GRAVEL); S.rect(56, 9, 2, 12, G.GRAVEL);
    S.rect(0, 20, N, 7, G.LOT);                           // the north lot
    S.rect(0, 27, N, 1, G.SHOULDER); S.rect(0, HY, N, 2, G.ROAD); S.rect(0, 30, N, 1, G.SHOULDER);
    S.rect(0, 31, N, 2, G.GRASS2);                        // the ditch
    S.rect(0, 42, N, 5, G.LOT);                           // the south lot in front of the south row
    S.rect(0, 47, N, 1, G.FENCE); S.rect(0, 48, N, 12, G.FIELD);
    S.streets = [{ y: HY, name: 'Route 9', highway: true }];
    borderTrees(S, r);
    // the road in from the houses (west edge) and the jam that closes it to the east
    S.props = S.props.filter(function (p) { return !((p.x < 2 || p.x >= N - 2) && p.y >= 26 && p.y <= 31); });
    for (var x = 0; x < 2; x++) for (var y = 27; y <= 30; y++) { S.set(x, y, y === 27 || y === 30 ? G.SHOULDER : G.ROAD); S.set(N - 1 - x, y, y === 27 || y === 30 ? G.SHOULDER : G.ROAD); }
    S.exits.push({ x: 0, y0: HY, y1: HY + 1, dir: 'left', to: 'houses' });
    S.highway = HY;
    S.prop({ k: 'jam', x: N - 5, y: 27 }, 5, 4);
    // the field: gaps in the fence, a scarecrow, a far fire's smoke
    for (var f = 0; f < 3; f++) S.set(6 + r.int(48), 47, G.FIELD);
    S.prop({ k: 'scarecrow', x: 10 + r.int(40), y: 52 + r.int(4) }, 1, 1);
    S.prop({ k: 'smoke', x: 8 + r.int(44), y: 56 });
    // which places this world has: Star Fuel, Bargain Barn and the motel always (its rooms count as places)
    var others = shuffle(r, ['truck', 'bun', 'video', 'liquor', 'pawn', 'parts', 'suds']);
    var homes = 3 + r.int(2), base = 2 + 8 + homes, want = Math.max(15, Math.min(20, base + 2 + r.int(4))) - base;
    // each row runs from x 5 to 55; north buildings sit 2 apart, south ones 3 apart (a driveway between)
    var north = shuffle(r, ['gas', 'barn']), south = ['motel'];
    var nRoom = 50 - 9 - 2 - 16, sRoom = 50 - 27;
    var chosen = [];
    others.forEach(function (k) {
      if (chosen.length >= want) return;
      var w = STRIP[k].w;
      if (nRoom >= w + 2) { north.push(k); nRoom -= w + 2; chosen.push(k); } else if (sRoom >= w + 3) { south.push(k); sRoom -= w + 3; chosen.push(k); }
    });
    north = north.slice(0, 2).concat(shuffle(r, north.slice(2)));
    this.stripRow(S, north, 19, r, true);
    this.stripRow(S, shuffle(r, south), 41, r, false);
    // roadside homes on the back lane
    var hx = 5, made = 0, self = this;
    while (made < homes && hx < 50) {
      var style = wpick(r, [['ranch', 3], ['two', 2], ['trailer', 3]]), w = { ranch: 6, two: 5, trailer: 7 }[style];
      self.home(S, hx, { x0: hx, x1: 56, top: 2, bot: 8, street: { name: 'Route 9' } }, r, style, false, r.int(2) === 0);
      made++; hx += w + 4 + r.int(4);
    }
    // dead cars on the highway and in the lots, a big rig, bodies, light poles and the power line
    for (var c = 0; c < 4; c++) { var cx = 4 + r.int(46), lane = HY + r.int(2); if (S.free(cx, lane, 3, 1) && S.free(cx, lane === HY ? HY + 1 : HY, 3, 1)) addCar(S, cx, lane, r); }
    for (c = 0; c < 4; c++) { var lx = 3 + r.int(50), ly = 22 + r.int(4); if (S.free(lx, ly, 3, 1)) addCar(S, lx, ly, r); }
    for (c = 0; c < 2; c++) { var sx = 3 + r.int(50), sy = 43 + r.int(3); if (S.free(sx, sy, 3, 1)) addCar(S, sx, sy, r); }
    var tp = S.places.filter(function (p) { return p.kind === 'truck'; })[0];
    if (tp) { var tb = S.buildings[tp.b], rx = tb.x + 1; if (S.free(rx, 24, 6, 1) && S.free(rx, 23, 6, 1)) S.prop({ k: 'rig', x: rx, y: 24 }, 6, 1); }
    for (c = 0; c < 4; c++) { var bx = 3 + r.int(52), by = pick(r, [21, 25, 31, 43, 45]); if (S.free(bx, by)) addBody(S, bx, by, r); }
    for (var px = 6 + r.int(4); px < N - 4; px += 12 + r.int(4)) { if (S.free(px, 26)) S.prop({ k: 'pole', x: px, y: 26 }, 1, 1); if (S.free(px + 3, 31)) S.prop({ k: 'upole', x: px + 3, y: 31 }, 1, 1); }
    for (c = 0; c < 5; c++) { var tx = 3 + r.int(52), ty = 31 + r.int(2); if (S.free(tx, ty) && r.int(2)) tree(S, tx, ty, r); }
    for (c = 0; c < 6; c++) { var bx2 = 3 + r.int(52), by2 = 12 + r.int(5); if (S.get(bx2, by2) === G.GRASS) tree(S, bx2, by2, r); }
    // a billboard facing the road, south of the ditch, and the slab of a place that burned down
    for (var tries = 0; tries < 20; tries++) { var bbx = 6 + r.int(44); if (S.free(bbx, 35, 5, 1) && S.get(bbx, 35) === G.GRASS && S.get(bbx + 4, 35) === G.GRASS) { S.prop({ k: 'billboard', x: bbx, y: 35, v: r.int(3) }, 5, 1); break; } }
    for (tries = 0; tries < 20; tries++) {
      var sx2 = 6 + r.int(44), sy2 = 34 + r.int(3), ok = true;
      for (var j = sy2; j < sy2 + 4 && ok; j++) for (var i = sx2; i < sx2 + 6 && ok; i++) if (S.get(i, j) !== G.GRASS || !S.free(i, j)) ok = false;
      if (ok) { S.rect(sx2, sy2, 6, 4, G.DRIVE); S.prop({ k: 'ruin', x: sx2, y: sy2, w: 6, h: 4 }); break; }
    }
    return S;
  };
  // a row of businesses facing south: bottom is the row their front wall sits on
  World.prototype.stripRow = function (S, keys, bottom, r, northRow) {
    var x = 5, self = this;
    keys.forEach(function (k, i) {
      var o = STRIP[k], y = bottom - o.h + 1;
      if (x + o.w > 55) return;
      var b = self.building(S, x, y, o.w, o.h, { style: o.style, sign: o.sign, neon: o.neon, col: r.int(4) });
      if (k === 'motel') {
        for (var n = 0; n < 8; n++) {
          var dx = x + 1 + n * 3, L = r.int(4) === 0 ? addLock(S, 'door', 'room ' + (n + 1) + ' at the Starlite', -1) : -1;
          var pi = self.place(S, 'motel', 'Starlite, room ' + (n + 1), b, { x: dx, y: bottom }, { lock: L });
          if (L >= 0) { S.locks[L].place = pi; S.locks[L].keyed = r.int(2) === 0; S.locks[L].keyName = 'Starlite room ' + (n + 1) + ' key'; }
          S.places[pi].room = n + 1;
          S.places[pi].inside = motelInside(S, pi, r);
        }
        var sgx = northRow ? x + 27 : x + 26, sgy = northRow ? bottom + 6 : 31;
        if (S.free(sgx, sgy)) S.prop({ k: 'sign', x: sgx, y: sgy, text: 'MOTEL', sub: 'VACANCY', col: 'amber' }, 1, 1);
      } else {
        var lock = k === 'pawn' ? addLock(S, 'door', 'Gold Mine Pawn', -1) : (k === 'liquor' && r.int(2)) ? addLock(S, 'door', "Lucky's Liquor", -1) : -1;
        var p = self.place(S, k, o.name, b, { x: x + Math.floor(o.w / 2) - (k === 'gas' ? 2 : 0), y: bottom }, { lock: lock, clerk: !!SHOPS[k].clerk });
        if (lock >= 0) { S.locks[lock].place = p; S.locks[lock].keyed = r.int(2) === 0; S.locks[lock].keyName = 'Key: ' + o.name; }
        S.places[p].inside = shopInside(S, p, SHOPS[k], r);
        // the sporting goods counter and the pawn case are locked (spec 002, 7)
        S.places[p].spots.forEach(function (si) {
          var sp = S.spots[si];
          if (sp.kind === 'gunCounter' || sp.kind === 'pawnCase') { var L2 = addLock(S, 'counter', sp.name.toLowerCase(), p); S.locks[L2].spot = si; sp.lock = L2; }
        });
        if (k === 'gas') {
          // the canopy over the pumps, in the lot in front, and the pole sign by the road
          S.prop({ k: 'canopy', x: x - 1, y: bottom + 2, w: 9, h: 3 });
          S.prop({ k: 'pump', x: x + 1, y: bottom + 3 }, 1, 1); S.prop({ k: 'pump', x: x + 5, y: bottom + 3 }, 1, 1);
          S.prop({ k: 'sign', x: x + 9, y: 26, text: 'STAR FUEL', col: 'cyan', star: 1 }, 1, 1);
          S.prop({ k: 'ice', x: x + o.w, y: bottom }, 1, 1);
        }
        if (k === 'bun' && S.free(x + o.w, bottom + 4)) S.prop({ k: 'sign', x: x + o.w, y: northRow ? 26 : bottom + 4, text: 'BIG BUN', col: 'red' }, 1, 1);
        if (k === 'barn') { S.prop({ k: 'carts', x: x + o.w - 3, y: bottom + 1 }, 2, 1); }
        if (k === 'suds' || k === 'video') S.prop({ k: 'bins', x: x + o.w, y: bottom, v: r.int(3) }, 1, 1);
      }
      // a driveway gap to the south row's lot
      x += o.w + (northRow ? 2 : 3);
      if (!northRow) S.rect(x - 3, bottom - o.h + 1 - 8, 2, 8 + o.h, G.LOT);
    });
    if (!northRow) { S.rect(2, 31, 2, 12, G.LOT); S.rect(56, 31, 2, 12, G.LOT); }
  };

  // dressing: no stretch of bare grass wider than about 3 tiles (art-style.md, Maps are dressed). Flat things you
  // walk over (weeds, leaves, rocks) and a few solid ones (bushes, stumps, junk) on open grass.
  function dress(S, r) {
    var G0 = G.GRASS, G1 = G.GRASS2, near = function (x, y, d) { for (var i = 0; i < S.props.length; i++) { var p = S.props[i]; if (Math.abs(p.x - x) + Math.abs(p.y - y) <= d) return true; } return false; };
    for (var y = 2; y < N - 2; y++) for (var x = 2; x < N - 2; x++) {
      var c = S.get(x, y); if ((c !== G0 && c !== G1 && c !== G.FIELD) || !S.free(x, y) || r.int(100) > 34) continue;
      if (near(x, y, 2)) continue;
      // keep the tile in front of a door clear
      if (S.doorAt[(y - 1) * N + x]) continue;
      var k = c === G.FIELD ? wpick(r, [['hay', 2], ['weeds', 3], ['rock', 1]]) : wpick(r, [['weeds', 4], ['leaves', 2], ['rock', 2], ['bush', 3], ['stump', 1], ['junk', 1], ['flowers', 1]]);
      var solid = k === 'bush' || k === 'stump' || k === 'junk' || k === 'hay';
      S.prop({ k: k, x: x, y: y, v: r.int(4) }, solid ? 1 : 0, 1);
    }
  }
  World.prototype.make = function () {
    var out = { houses: this.houses(), strip: this.strip() }, self = this;
    ['houses', 'strip'].forEach(function (k) { dress(out[k], stream(self.seed, 'dress:' + k)); });
    ['houses', 'strip'].forEach(function (k) { self.lootAll(out[k]); });
    return out;
  };

  // walking: what blocks a step outside (the door tiles of places are open; locked ones are handled by the game)
  function passOut(S, x, y) { if (x < 0 || y < 0 || x >= N || y >= N) return false; return !S.solid[y * N + x]; }
  function passIn(ins, x, y) { if (x < 0 || y < 0 || x >= ins.W || y >= ins.H) return false; return !ins.solid[y * ins.W + x]; }
  // can every place's door and every outside spot be reached on foot from the road in? (tools/check.js)
  function reach(S) {
    var ex = S.exits[0], seen = new Uint8Array(N * N), q = [[ex.x, ex.y0]], out = { places: 0, spots: 0, badPlaces: [], badSpots: [] };
    seen[ex.y0 * N + ex.x] = 1;
    while (q.length) {
      var c = q.shift();
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) {
        var nx = c[0] + d[0], ny = c[1] + d[1]; if (nx < 0 || ny < 0 || nx >= N || ny >= N) return;
        var k = ny * N + nx; if (seen[k] || S.solid[k] || S.doorAt[k]) return; seen[k] = 1; q.push([nx, ny]);
      });
    }
    var near = function (x, y, w, h) { for (var j = y - 1; j <= y + h; j++) for (var i = x - 1; i <= x + w; i++) { if ((i < x || i >= x + w) && (j < y || j >= y + h) ) continue; if (i >= 0 && j >= 0 && i < N && j < N && seen[j * N + i]) return true; } return false; };
    S.places.forEach(function (p) { if (seen[(p.door.y + 1) * N + p.door.x]) out.places++; else out.badPlaces.push(p.name); });
    S.spots.forEach(function (s) { if (s.inside) return; if (near(s.x, s.y, s.w, s.h)) out.spots++; else out.badSpots.push(s.name + ' at ' + s.x + ',' + s.y); });
    // inside: from the way out to every spot
    S.places.forEach(function (p) {
      var ins = p.inside, W = ins.W, sn = new Uint8Array(W * ins.H), qq = [[ins.exit.x, ins.exit.y]]; sn[ins.exit.y * W + ins.exit.x] = 1;
      while (qq.length) { var c = qq.shift(); [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) { var nx = c[0] + d[0], ny = c[1] + d[1]; if (nx < 0 || ny < 0 || nx >= W || ny >= ins.H) return; var k = ny * W + nx; if (sn[k] || ins.solid[k]) return; sn[k] = 1; qq.push([nx, ny]); }); }
      p.spots.forEach(function (si) {
        var s = S.spots[si], ok = false;
        for (var j = s.y - 1; j <= s.y + s.h && !ok; j++) for (var i = s.x - 1; i <= s.x + s.w && !ok; i++) {
          if ((i < s.x || i >= s.x + s.w) && (j < s.y || j >= s.y + s.h)) continue;
          if (i >= 0 && j >= 0 && i < W && j < ins.H && sn[j * W + i]) ok = true;
        }
        if (ok) out.spots++; else out.badSpots.push(p.name + ': ' + s.name);
      });
    });
    return out;
  }

  window.LAT = { G: G, F: F, N: N, SPOT_NAME: SPOT_NAME, LOOT: LOOT, addItem: addItem,
    make: function (seed, preset) { return new World(seed, preset).make(); }, passOut: passOut, passIn: passIn, reach: reach };
})();
