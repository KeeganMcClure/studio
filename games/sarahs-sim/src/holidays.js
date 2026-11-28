// Sarah's Sim holidays (spec 009), Christmas first: it's the holiday the game is opened on.
//   Part A: the holiday follows the real date. Christmas's season is Dec 1 to Jan 6; its days are Dec 24 evening and Dec 25.
//     First snow is a weather moment the first time she opens the game on or after Dec 21.
//   Part B: the Christmas set in the Holiday tab (in Life, "This season" in season and "Back in December" out of it; in Sandbox
//     always there). Day dressing, only for that day, on top of her own design: Christmas Eve hangs stockings and leaves cookies
//     out; Christmas morning puts gifts under her tree (or a little tree if she hasn't placed one): one holds Keegan's note, each
//     of the others is a free Christmas piece; the cats wear tiny Santa hats; Keegan makes a special breakfast. She can keep any
//     day-dressing piece; the rest go away the next day. Gifts never repeat in the same year (saved).
// Parties (part C) wait for the Visitor screens (spec 008). The note is private data (a placeholder in the repo).
(function () {
  var C = SS.CATALOG, INK = 'rgba(59,36,48,.85)';
  function R(c, x, y, w, h, col) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
  function add(def) { def.parts = def.parts || []; def.swatches = def.swatches || [{}]; def.spots = def.spots || []; def.holiday = def.holiday || 'christmas'; C.push(def); return def; }
  function small(M, fn, e) { M.spr(.5, .5, 0, function (c, x, y) { c.fillStyle = 'rgba(90,45,40,.25)'; c.beginPath(); c.ellipse(x + 1, y, 5, 2, 0, 0, 7); c.fill(); fn(c, x, y); }, e || [.15, 12]); }
  SS.DEF['christmas-tree'].holiday = 'christmas';

  // ---------- the Christmas set (Holiday tab) ----------
  add({ id: 'christmas-wreath', name: 'Christmas wreath', tab: 'holiday', w: 1, d: .1, kind: 'wall', mount: 26, h: 18, price: 80,
    parts: [['bow', 'plain']], swatches: [{ bow: '#d2363c' }, { bow: '#e7bb4f' }, { bow: '#fff1e2' }, { bow: '#7fa7a0' }],
    draw: function (M) { M.spr(.5, .05, 0, function (c, x, y) { var B = M.ramp('bow'), cy = y - 9; c.strokeStyle = '#3f6e4a'; c.lineWidth = 5; c.beginPath(); c.arc(x, cy, 6, 0, 7); c.stroke(); c.lineWidth = 1; c.strokeStyle = '#6aa361'; c.beginPath(); c.arc(x - 1, cy - 1, 6, 3.4, 5.6); c.stroke(); [[-5, -3], [4, -4], [0, 6], [-4, 4], [5, 3]].forEach(function (b) { R(c, x + b[0], cy + b[1], 2, 2, '#e46f6a'); }); R(c, x - 4, cy + 5, 8, 3, B[1]); R(c, x - 1, cy + 8, 2, 4, B[2]); R(c, x - 3, cy + 5, 2, 1, B[0]); }, [.3, 18]); } });
  add({ id: 'stockings', name: 'Stockings', tab: 'holiday', w: 1, d: .1, kind: 'wall', mount: 16, h: 16, price: 60,
    parts: [['knit', 'fab']], swatches: [{ knit: '#d2363c' }, { knit: '#3f6e4a' }, { knit: '#f39bb0' }, { knit: '#7d93c4' }],
    draw: function (M) { [[.22, 'knit'], [.5, '#3f6e4a'], [.78, 'knit']].forEach(function (st, i) { M.spr(st[0], .05, 0, function (c, x, y) { var K = st[1] === 'knit' ? M.ramp('knit') : StudioIso.ramp(st[1]); R(c, x - 1, y - 16, 1, 2, '#8e5a37'); R(c, x - 3, y - 14, 6, 3, '#fff6ea'); R(c, x - 3, y - 11, 5, 7, K[1]); R(c, x - 3, y - 11, 2, 7, K[0]); R(c, x - 3, y - 5, 8, 3, K[1]); R(c, x + 2, y - 5, 3, 3, K[2]); if (i === 1) { R(c, x - 1, y - 9, 2, 1, '#fff6ea'); } }, [.1, 16]); }); } });
  add({ id: 'holiday-garland', name: 'Holiday garland', tab: 'holiday', w: 2, d: .1, kind: 'wall', mount: 34, h: 12, price: 90, lamp: true, use: 'lamp', moves: 'twinkle', anim: 8,
    parts: [['bulbs', 'plain']], light: { u: 1, v: .1, h: -8, r: 24 }, swatches: [{ bulbs: '#ffd56b' }, { bulbs: '#e46f8b' }, { bulbs: '#8fd0ff' }, { bulbs: '#fff3a8' }],
    draw: function (M, t) { M.spr(1, .05, 0, function (c) { var on = M.inst && M.inst.lit, B = M.ramp('bulbs'); var pts = []; for (var k = 0; k <= 14; k++) pts.push([M.p(.05 + k / 14 * 1.9, .06, 0), Math.sin(k / 14 * Math.PI) * 5]); c.strokeStyle = '#3f6e4a'; c.lineWidth = 3; c.beginPath(); pts.forEach(function (q, i) { if (i) c.lineTo(q[0][0], q[0][1] + q[1]); else c.moveTo(q[0][0], q[0][1] + q[1]); }); c.stroke(); c.lineWidth = 1; pts.forEach(function (q, i) { if (i % 2) return; var lit = on && (Math.floor(t / 2) + i) % 4 !== 0; R(c, q[0][0], q[0][1] + q[1] + 1, 2, 2, lit ? [B[0], '#e46f8b', '#8fd0ff'][i % 3] : '#a08880'); }); }, [1, 12]); } });
  add({ id: 'poinsettia', name: 'Poinsettia', tab: 'holiday', w: 1, d: 1, kind: 'small', h: 12, price: 45,
    parts: [['pot', 'plain']], swatches: [{ pot: '#e7bb4f' }, { pot: '#fff1e2' }, { pot: '#d2363c' }, { pot: '#3f6e4a' }],
    draw: function (M) { small(M, function (c, x, y) { var Pp = M.ramp('pot'); R(c, x - 3, y - 4, 6, 4, Pp[1]); R(c, x - 3, y - 4, 2, 4, Pp[0]); [[-4, -7, .4], [3, -7, -.4], [0, -10, 0], [-2, -6, .8], [2, -6, -.8]].forEach(function (l) { c.fillStyle = '#d2363c'; c.beginPath(); c.ellipse(x + l[0], y + l[1], 3, 1.6, l[2], 0, 7); c.fill(); }); R(c, x - 1, y - 8, 2, 2, '#ffd56b'); R(c, x - 5, y - 5, 2, 1, '#437a47'); R(c, x + 4, y - 5, 2, 1, '#437a47'); }, [.15, 12]); } });
  add({ id: 'gift-stack', name: 'Gift stack', tab: 'holiday', w: 1, d: 1, kind: 'small', h: 14, price: 40,
    parts: [['paper', 'plain']], swatches: [{ paper: '#e46f8b' }, { paper: '#7fa7a0' }, { paper: '#e7bb4f' }, { paper: '#7d93c4' }],
    draw: function (M) { var P0 = M.ramp('paper'); M.box(.25, .3, .5, .4, 7, 0, 'paper'); M.box(.32, .36, .34, .28, 6, 7, '#fff1e2'); M.spr(.5, .5, 13, function (c, x, y) { R(c, x - 1, y - 2, 3, 2, '#e7bb4f'); }, [.05, 2]); } });
  add({ id: 'ornament-bowl', name: 'Ornament bowl', tab: 'holiday', w: 1, d: 1, kind: 'small', h: 8, price: 35,
    parts: [['bowl', 'plain']], swatches: [{ bowl: '#fff1e2' }, { bowl: '#c7ced2' }, { bowl: '#3f6e4a' }, { bowl: '#e7bb4f' }],
    draw: function (M) { small(M, function (c, x, y) { var B = M.ramp('bowl'); [[-3, '#d2363c'], [0, '#e7bb4f'], [3, '#7fa7a0'], [-1, '#c8a6d8']].forEach(function (o, i) { c.fillStyle = o[1]; c.beginPath(); c.arc(x + o[0], y - 5 - (i === 3 ? 2 : 0), 2, 0, 7); c.fill(); R(c, x + o[0] - 1, y - 6 - (i === 3 ? 2 : 0), 1, 1, 'rgba(255,255,255,.7)'); }); c.fillStyle = B[1]; c.beginPath(); c.ellipse(x, y - 3, 6, 3, 0, 0, Math.PI); c.fill(); R(c, x - 6, y - 4, 12, 1, B[0]); }, [.15, 8]); } });
  add({ id: 'cookies-and-milk', name: 'Cookies and milk', tab: 'holiday', w: 1, d: 1, kind: 'small', h: 8, price: 25,
    parts: [['plate', 'plain']], swatches: [{ plate: '#fff6ea' }, { plate: '#d2363c' }, { plate: '#7fa7a0' }, { plate: '#e7bb4f' }],
    draw: function (M) { small(M, function (c, x, y) { var Pl = M.ramp('plate'); c.fillStyle = Pl[1]; c.beginPath(); c.ellipse(x - 2, y - 1, 5, 2.3, 0, 0, 7); c.fill(); [[-4, -2], [-1, -3], [-2, -1]].forEach(function (k) { R(c, x + k[0], y + k[1], 2, 1, '#c78f3e'); R(c, x + k[0], y + k[1], 1, 1, '#6e4429'); }); R(c, x + 3, y - 7, 3, 6, '#fbf6ef'); R(c, x + 3, y - 7, 1, 6, '#ffffff'); }, [.15, 8]); } });
  add({ id: 'snow-globe', name: 'Snow globe', tab: 'holiday', w: 1, d: 1, kind: 'small', h: 10, price: 50, moves: 'twinkle', anim: 8,
    parts: [['base', 'wood']], swatches: [{ base: '#8e5a37' }, { base: '#d2363c' }, { base: '#e7bb4f' }, { base: '#2f2228' }],
    draw: function (M, t) { small(M, function (c, x, y) { var B = M.ramp('base'); R(c, x - 4, y - 3, 8, 3, B[1]); c.fillStyle = 'rgba(200,225,245,.8)'; c.beginPath(); c.arc(x, y - 7, 4.5, 0, 7); c.fill(); R(c, x - 1, y - 8, 2, 4, '#b9584a'); R(c, x - 2, y - 9, 4, 1, '#fff6ea'); for (var k = 0; k < 4; k++) R(c, x - 3 + ((k * 3 + t) % 6), y - 10 + ((k * 2 + t) % 6), 1, 1, '#fff'); R(c, x - 3, y - 10, 1, 2, 'rgba(255,255,255,.8)'); }, [.15, 10]); } });
  // a gift under the tree on Christmas morning: not in the catalog
  add({ id: 'christmas-gift', name: 'A gift', tab: 'none', w: 1, d: 1, kind: 'small', h: 12, price: 0, use: 'gift',
    parts: [], swatches: [{}],
    draw: function (M) { var col = ['#e46f8b', '#7fa7a0', '#e7bb4f', '#7d93c4'][(M.inst && M.inst.gift || 0) % 4]; M.box(.25, .3, .5, .45, 9, 0, col); M.spr(.5, .52, 9, function (c, x, y) { R(c, x - 1, y - 1, 2, 2, '#fff1e2'); R(c, x - 4, y - 2, 3, 2, '#fff1e2'); R(c, x + 1, y - 2, 3, 2, '#fff1e2'); }, [.05, 3]); } });

  // ---------- the rest of the year (spec 009, build order step 3: each holiday's pieces, in calendar order) ----------
  function ball(c, x, y, r, col, hi) { c.fillStyle = 'rgba(59,36,48,.85)'; c.beginPath(); c.arc(x, y, r + 1, 0, 7); c.fill(); c.fillStyle = col; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); R(c, x - r / 2, y - r / 2, 2, 2, hi || 'rgba(255,255,255,.6)'); }
  function heartAt(c, x, y, col) { R(c, x - 2, y - 1, 2, 2, col); R(c, x + 1, y - 1, 2, 2, col); R(c, x - 2, y, 5, 2, col); R(c, x - 1, y + 2, 3, 1, col); R(c, x, y + 3, 1, 1, col); }
  // New Year's Eve
  add({ id: 'party-streamers', name: 'Party streamers', tab: 'holiday', holiday: 'newyear', w: 2, d: .1, kind: 'wall', mount: 36, h: 14, price: 50,
    parts: [['ribbon', 'plain']], swatches: [{ ribbon: '#e7bb4f' }, { ribbon: '#c7ced2' }, { ribbon: '#e46f8b' }, { ribbon: '#7d93c4' }],
    draw: function (M) { M.spr(1, .05, 0, function (c) { var Rb = M.ramp('ribbon'); for (var k = 0; k < 2; k++) { var cols = k ? [Rb[2], '#fff1e2'] : [Rb[1], Rb[0]]; for (var i = 0; i <= 16; i++) { var q = M.p(.05 + i / 16 * 1.9, .06, 0), dip = Math.sin(i / 16 * Math.PI * 2) * (3 + k * 2) + k * 2; R(c, q[0], q[1] + Math.abs(dip), 2, 2, cols[i % 2]); } } [.3, 1, 1.7].forEach(function (u, i) { var q = M.p(u, .06, 0); R(c, q[0], q[1] + 2, 1, 7 + i % 2 * 3, Rb[1]); R(c, q[0] + 1, q[1] + 4, 1, 5, '#fff1e2'); }); }, [1, 14]); } });
  add({ id: 'sparkling-cider', name: 'Sparkling cider', tab: 'holiday', holiday: 'newyear', w: 1, d: 1, kind: 'small', h: 14, price: 35,
    parts: [['bottle', 'glass']], swatches: [{ bottle: '#3f6e4a' }, { bottle: '#8e2f36' }, { bottle: '#c7ced2' }, { bottle: '#e7bb4f' }],
    draw: function (M) { small(M, function (c, x, y) { var B = M.ramp('bottle'); R(c, x - 4, y - 10, 4, 10, B[1]); R(c, x - 4, y - 10, 1, 10, B[0]); R(c, x - 3, y - 13, 2, 3, B[2]); R(c, x - 3, y - 14, 2, 1, '#e7bb4f'); R(c, x - 4, y - 7, 4, 3, '#fff1e2'); [[2, '#f3d38a'], [5, '#f3d38a']].forEach(function (g) { R(c, x + g[0] - 1, y - 7, 3, 4, 'rgba(255,255,255,.55)'); R(c, x + g[0] - 1, y - 6, 3, 3, g[1]); R(c, x + g[0], y - 3, 1, 2, 'rgba(255,255,255,.7)'); R(c, x + g[0] - 1, y - 1, 3, 1, 'rgba(255,255,255,.7)'); R(c, x + g[0], y - 6, 1, 1, '#fff'); }); }, [.15, 14]); } });
  // Valentine's Day
  add({ id: 'heart-garland', name: 'Heart garland', tab: 'holiday', holiday: 'valentines', w: 2, d: .1, kind: 'wall', mount: 32, h: 12, price: 55,
    parts: [['hearts', 'plain']], swatches: [{ hearts: '#e46f8b' }, { hearts: '#d2363c' }, { hearts: '#f39bb0' }, { hearts: '#c8a6d8' }],
    draw: function (M) { M.spr(1, .05, 0, function (c) { var Hh = M.ramp('hearts'); var a = M.p(.05, .06, 0), b = M.p(1.95, .06, 0); c.strokeStyle = '#b9837f'; c.beginPath(); c.moveTo(a[0], a[1]); c.quadraticCurveTo((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 8, b[0], b[1]); c.stroke(); for (var i = 1; i < 7; i++) { var u = i / 7, q = M.p(.05 + u * 1.9, .06, 0), dip = Math.sin(u * Math.PI) * 4; heartAt(c, q[0], q[1] + dip + 1, i % 2 ? Hh[1] : '#fff1e2'); } }, [1, 12]); } });
  add({ id: 'rose-bouquet', name: 'Rose bouquet', tab: 'holiday', holiday: 'valentines', w: 1, d: 1, kind: 'small', h: 16, price: 45,
    parts: [['roses', 'plain']], swatches: [{ roses: '#d2363c' }, { roses: '#f39bb0' }, { roses: '#fff1e2' }, { roses: '#e7bb4f' }],
    draw: function (M) { small(M, function (c, x, y) { var Ro = M.ramp('roses'); R(c, x - 3, y - 6, 6, 6, 'rgba(200,225,245,.8)'); R(c, x - 3, y - 6, 1, 6, 'rgba(255,255,255,.8)'); R(c, x - 1, y - 9, 1, 4, '#437a47'); R(c, x + 1, y - 10, 1, 5, '#437a47'); [[-3, -12], [1, -13], [3, -10], [-1, -10], [-4, -9]].forEach(function (r) { ball(c, x + r[0], y + r[1], 1.6, Ro[1], Ro[0]); }); R(c, x - 5, y - 9, 2, 1, '#6aa361'); R(c, x + 4, y - 8, 2, 1, '#6aa361'); }, [.15, 16]); } });
  // Keegan's birthday, on St. Patrick's Day: green
  add({ id: 'green-balloons', name: 'Green balloons', tab: 'holiday', holiday: 'keegan-bday', w: 1, d: 1, kind: 'small', h: 34, price: 40,
    parts: [['balloons', 'plain']], swatches: [{ balloons: '#4f9a5c' }, { balloons: '#e7bb4f' }, { balloons: '#e46f8b' }, { balloons: '#7d93c4' }],
    draw: function (M) { small(M, function (c, x, y) { var Bl = M.ramp('balloons'); R(c, x - 2, y - 3, 4, 3, '#c7ced2'); [[-5, -28, Bl[1]], [3, -30, '#fff1e2'], [0, -23, Bl[2]], [5, -22, Bl[0]]].forEach(function (b) { c.strokeStyle = 'rgba(59,36,48,.5)'; c.beginPath(); c.moveTo(x, y - 3); c.lineTo(x + b[0], y + b[1] + 4); c.stroke(); c.fillStyle = 'rgba(59,36,48,.85)'; c.beginPath(); c.ellipse(x + b[0], y + b[1], 4, 5, 0, 0, 7); c.fill(); c.fillStyle = b[2]; c.beginPath(); c.ellipse(x + b[0], y + b[1], 3, 4, 0, 0, 7); c.fill(); R(c, x + b[0] - 2, y + b[1] - 2, 1, 2, 'rgba(255,255,255,.7)'); }); }, [.2, 34]); } });
  add({ id: 'shamrock-pot', name: 'Shamrock pot', tab: 'holiday', holiday: 'keegan-bday', w: 1, d: 1, kind: 'small', h: 11, price: 30,
    parts: [['pot', 'plain']], swatches: [{ pot: '#fff1e2' }, { pot: '#e7bb4f' }, { pot: '#d98a6f' }, { pot: '#7fa7a0' }],
    draw: function (M) { small(M, function (c, x, y) { var Pp = M.ramp('pot'); R(c, x - 3, y - 4, 6, 4, Pp[1]); R(c, x - 3, y - 4, 2, 4, Pp[0]); [[-3, -8], [0, -10], [3, -7], [-1, -6], [2, -11]].forEach(function (l) { [[0, -1], [-1, 1], [1, 1]].forEach(function (o) { R(c, x + l[0] + o[0], y + l[1] + o[1], 2, 2, '#4f9a5c'); }); R(c, x + l[0], y + l[1], 1, 1, '#8fc47b'); }); }, [.15, 11]); } });
  // spring's first warm day
  add({ id: 'tulip-pot', name: 'Tulip pot', tab: 'holiday', holiday: 'spring', w: 1, d: 1, kind: 'small', h: 14, price: 35,
    parts: [['tulips', 'plain']], swatches: [{ tulips: '#e46f8b' }, { tulips: '#f3d38a' }, { tulips: '#c8a6d8' }, { tulips: '#e46f6a' }],
    draw: function (M) { small(M, function (c, x, y) { var T = M.ramp('tulips'); R(c, x - 4, y - 4, 8, 4, '#d98a6f'); R(c, x - 4, y - 4, 8, 1, '#e8a28c'); [[-3, -11], [0, -13], [3, -10]].forEach(function (t) { R(c, x + t[0], y + t[1] + 3, 1, -t[1] - 6, '#437a47'); R(c, x + t[0] - 1, y + t[1], 3, 3, T[1]); R(c, x + t[0] - 1, y + t[1] - 1, 1, 1, T[1]); R(c, x + t[0] + 1, y + t[1] - 1, 1, 1, T[1]); R(c, x + t[0] - 1, y + t[1], 1, 2, T[0]); }); R(c, x - 4, y - 7, 2, 1, '#6aa361'); R(c, x + 3, y - 6, 2, 1, '#6aa361'); }, [.15, 14]); } });
  add({ id: 'sun-catcher', name: 'Sun catcher', tab: 'holiday', holiday: 'spring', w: 1, d: .1, kind: 'wall', mount: 30, h: 14, price: 40, moves: 'twinkle', anim: 8,
    parts: [['glass', 'glass']], swatches: [{ glass: '#f3d38a' }, { glass: '#9cc1b6' }, { glass: '#f39bb0' }, { glass: '#c8a6d8' }],
    draw: function (M, t) { M.spr(.5, .05, 0, function (c, x, y) { var Gg = M.ramp('glass'); R(c, x, y - 16, 1, 4, '#b9837f'); c.fillStyle = 'rgba(59,36,48,.8)'; c.beginPath(); c.arc(x, y - 7, 6, 0, 7); c.fill(); [Gg[1], '#9cc1b6', '#f39bb0', '#f3d38a'].forEach(function (col, i) { c.fillStyle = col; c.beginPath(); c.moveTo(x, y - 7); c.arc(x, y - 7, 5, i * Math.PI / 2, (i + 1) * Math.PI / 2); c.fill(); }); if (t % 8 < 3) R(c, x - 3, y - 10, 2, 2, '#fff'); }, [.3, 14]); } });
  // the Fourth of July
  add({ id: 'little-flags', name: 'Little flags', tab: 'holiday', holiday: 'july4', w: 1, d: 1, kind: 'small', h: 14, price: 25,
    parts: [['cup', 'plain']], swatches: [{ cup: '#fff1e2' }, { cup: '#4f6a9e' }, { cup: '#d2363c' }, { cup: '#c7ced2' }],
    draw: function (M) { small(M, function (c, x, y) { var Cp = M.ramp('cup'); R(c, x - 3, y - 4, 6, 4, Cp[1]); R(c, x - 3, y - 4, 2, 4, Cp[0]); [[-2, -13], [2, -12]].forEach(function (f) { R(c, x + f[0], y + f[1], 1, -f[1] - 3, '#8e5a37'); for (var r = 0; r < 4; r++) R(c, x + f[0] + 1, y + f[1] + r, 5, 1, r % 2 ? '#fff6ea' : '#d2363c'); R(c, x + f[0] + 1, y + f[1], 2, 2, '#4f6a9e'); }); }, [.15, 14]); } });
  add({ id: 'star-lights', name: 'Star lights', tab: 'holiday', holiday: 'july4', w: 2, d: .1, kind: 'wall', mount: 34, h: 12, price: 70, lamp: true, use: 'lamp', moves: 'twinkle', anim: 8,
    parts: [['stars', 'plain']], light: { u: 1, v: .1, h: -8, r: 22 }, swatches: [{ stars: '#fff3a8' }, { stars: '#e46f6a' }, { stars: '#8fd0ff' }, { stars: '#ffffff' }],
    draw: function (M, t) { M.spr(1, .05, 0, function (c) { var on = M.inst && M.inst.lit, S0 = M.ramp('stars'); var a = M.p(.05, .06, 0), b = M.p(1.95, .06, 0); c.strokeStyle = '#6b4250'; c.beginPath(); c.moveTo(a[0], a[1]); c.quadraticCurveTo((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 7, b[0], b[1]); c.stroke(); for (var i = 1; i < 8; i++) { var u = i / 8, q = M.p(.05 + u * 1.9, .06, 0), dip = Math.sin(u * Math.PI) * 3.5, lit = on && (Math.floor(t / 2) + i) % 3 !== 0, col = lit ? [S0[0], '#e46f6a', '#8fd0ff'][i % 3] : '#a08880'; R(c, q[0], q[1] + dip, 1, 3, col); R(c, q[0] - 1, q[1] + dip + 1, 3, 1, col); if (lit) { c.fillStyle = 'rgba(255,240,180,.35)'; c.fillRect(q[0] - 2, q[1] + dip - 1, 5, 5); } } }, [1, 12]); } });
  // their anniversary
  add({ id: 'candle-trio', name: 'Candle trio', tab: 'holiday', holiday: 'anniversary', w: 1, d: 1, kind: 'small', h: 12, price: 40, lamp: true, use: 'lamp', moves: 'glow',
    parts: [['wax', 'plain']], light: { u: .5, v: .5, h: 12, r: 26 }, swatches: [{ wax: '#fff6ea' }, { wax: '#f39bb0' }, { wax: '#d2363c' }, { wax: '#e7bb4f' }],
    draw: function (M) { small(M, function (c, x, y) { var Wx = M.ramp('wax'), on = M.inst && M.inst.lit; [[-3, 7], [0, 10], [3, 5]].forEach(function (k) { R(c, x + k[0] - 1, y - k[1], 3, k[1], Wx[1]); R(c, x + k[0] - 1, y - k[1], 1, k[1], Wx[0]); R(c, x + k[0], y - k[1] - 1, 1, 1, '#3b2430'); if (on) { R(c, x + k[0], y - k[1] - 3, 1, 2, '#ffd56b'); R(c, x + k[0], y - k[1] - 4, 1, 1, '#fff3a8'); } }); }, [.15, 12]); } });
  add({ id: 'love-frame', name: 'Heart frame', tab: 'holiday', holiday: 'anniversary', w: 1, d: .1, kind: 'wall', mount: 24, h: 16, price: 60,
    parts: [['frame', 'wood']], swatches: [{ frame: '#e7bb4f' }, { frame: '#fff1e2' }, { frame: '#8e5a37' }, { frame: '#e46f8b' }],
    draw: function (M) { M.box(.15, 0, .7, .05, 16, 0, 'frame'); M.spr(.5, .1, 0, function (c, x, y) { R(c, x - 5, y - 14, 10, 12, '#fff6ea'); heartAt(c, x - 1, y - 10, '#e46f8b'); heartAt(c, x + 2, y - 8, '#d2363c'); }, [.3, 16]); } });
  // Sarah's birthday
  add({ id: 'balloon-bunch', name: 'Balloon bunch', tab: 'holiday', holiday: 'sarah-bday', w: 1, d: 1, kind: 'small', h: 34, price: 40,
    parts: [['balloons', 'plain']], swatches: [{ balloons: '#e46f8b' }, { balloons: '#e7bb4f' }, { balloons: '#c8a6d8' }, { balloons: '#9cc1b6' }],
    draw: function (M) { small(M, function (c, x, y) { var Bl = M.ramp('balloons'); R(c, x - 2, y - 3, 4, 3, '#e7bb4f'); [[-5, -28, Bl[1]], [3, -30, '#e7bb4f'], [0, -23, '#fff1e2'], [5, -22, Bl[2]], [-4, -21, '#c8a6d8']].forEach(function (b) { c.strokeStyle = 'rgba(59,36,48,.5)'; c.beginPath(); c.moveTo(x, y - 3); c.lineTo(x + b[0], y + b[1] + 4); c.stroke(); c.fillStyle = 'rgba(59,36,48,.85)'; c.beginPath(); c.ellipse(x + b[0], y + b[1], 4, 5, 0, 0, 7); c.fill(); c.fillStyle = b[2]; c.beginPath(); c.ellipse(x + b[0], y + b[1], 3, 4, 0, 0, 7); c.fill(); R(c, x + b[0] - 2, y + b[1] - 2, 1, 2, 'rgba(255,255,255,.7)'); }); }, [.2, 34]); } });
  add({ id: 'birthday-cake', name: 'Birthday cake', tab: 'holiday', holiday: 'sarah-bday', w: 1, d: 1, kind: 'small', h: 14, price: 50,
    parts: [['icing', 'plain']], swatches: [{ icing: '#f39bb0' }, { icing: '#fff6ea' }, { icing: '#c8a6d8' }, { icing: '#9cc1b6' }],
    draw: function (M, t) { small(M, function (c, x, y) { var I = M.ramp('icing'); c.fillStyle = '#fff6ea'; c.beginPath(); c.ellipse(x, y - 1, 7, 2.5, 0, 0, 7); c.fill(); R(c, x - 5, y - 8, 10, 7, '#d9a46b'); R(c, x - 5, y - 9, 10, 3, I[1]); R(c, x - 5, y - 6, 10, 1, I[2]); [-4, -1, 2].forEach(function (k) { R(c, x + k, y - 5, 1, 2, I[1]); }); [-3, 0, 3].forEach(function (k, i) { R(c, x + k, y - 12, 1, 3, ['#7fa7a0', '#e7bb4f', '#e46f8b'][i]); R(c, x + k, y - 14 + ((t + i) % 4 < 2 ? 0 : 1), 1, 2, '#ffd56b'); }); }, [.15, 14]); } });
  // Halloween
  add({ id: 'jack-o-lantern', name: 'Jack-o\'-lantern', tab: 'holiday', holiday: 'halloween', w: 1, d: 1, kind: 'small', h: 11, price: 35, lamp: true, use: 'lamp', moves: 'glow',
    parts: [['pumpkin', 'plain']], light: { u: .5, v: .5, h: 6, r: 22 }, swatches: [{ pumpkin: '#f7922e' }, { pumpkin: '#fff1e2' }, { pumpkin: '#9cc1b6' }, { pumpkin: '#e7bb4f' }],
    draw: function (M) { small(M, function (c, x, y) { var Pk = M.ramp('pumpkin'), on = M.inst && M.inst.lit; c.fillStyle = 'rgba(59,36,48,.85)'; c.beginPath(); c.ellipse(x, y - 5, 7, 5.5, 0, 0, 7); c.fill(); [[-3, Pk[2]], [3, Pk[2]], [0, Pk[1]]].forEach(function (s0) { c.fillStyle = s0[1]; c.beginPath(); c.ellipse(x + s0[0], y - 5, 3.5, 4.5, 0, 0, 7); c.fill(); }); R(c, x - 2, y - 6, 1, 1, Pk[0]); R(c, x, y - 12, 2, 3, '#437a47'); var g = on ? '#ffd56b' : '#3b2430'; R(c, x - 4, y - 7, 2, 2, g); R(c, x + 2, y - 7, 2, 2, g); R(c, x - 3, y - 3, 6, 1, g); R(c, x - 2, y - 2, 1, 1, g); R(c, x + 1, y - 2, 1, 1, g); }, [.15, 11]); } });
  add({ id: 'paper-bats', name: 'Paper bats', tab: 'holiday', holiday: 'halloween', w: 2, d: .1, kind: 'wall', mount: 30, h: 16, price: 30,
    parts: [['paper', 'plain']], swatches: [{ paper: '#2f2228' }, { paper: '#6e5f9a' }, { paper: '#f7922e' }, { paper: '#fff1e2' }],
    draw: function (M) { M.spr(1, .05, 0, function (c) { var Pb = M.ramp('paper'); [[.3, 2], [.75, -3], [1.2, 1], [1.65, -2], [1.05, 6]].forEach(function (b, i) { var q = M.p(b[0], .06, 0), x = q[0], y = q[1] + b[1], col = i % 2 ? Pb[1] : Pb[2]; R(c, x - 1, y - 1, 3, 3, col); R(c, x - 4, y - 2, 3, 2, col); R(c, x + 2, y - 2, 3, 2, col); R(c, x - 5, y - 3, 1, 1, col); R(c, x + 5, y - 3, 1, 1, col); R(c, x - 1, y - 2, 1, 1, col); R(c, x + 1, y - 2, 1, 1, col); }); }, [1, 16]); } });
  // Thanksgiving
  add({ id: 'harvest-centerpiece', name: 'Harvest centerpiece', tab: 'holiday', holiday: 'thanksgiving', w: 1, d: 1, kind: 'small', h: 10, price: 45,
    parts: [['ribbon', 'plain']], swatches: [{ ribbon: '#b85b50' }, { ribbon: '#e7bb4f' }, { ribbon: '#437a47' }, { ribbon: '#8e5a37' }],
    draw: function (M) { small(M, function (c, x, y) { var Rb = M.ramp('ribbon'); c.fillStyle = '#c78f3e'; c.beginPath(); c.ellipse(x, y - 2, 7, 2.5, 0, 0, 7); c.fill(); ball(c, x - 3, y - 5, 2.5, '#f7922e'); ball(c, x + 2, y - 5, 2.2, '#e7bb4f'); ball(c, x, y - 7, 2, '#b85b50'); R(c, x - 6, y - 4, 3, 1, '#a65a2c'); R(c, x + 4, y - 3, 3, 1, '#a65a2c'); R(c, x - 1, y - 10, 1, 3, '#6b4250'); R(c, x + 4, y - 7, 2, 2, Rb[1]); }, [.15, 10]); } });
  add({ id: 'autumn-garland', name: 'Autumn leaf garland', tab: 'holiday', holiday: 'thanksgiving', w: 2, d: .1, kind: 'wall', mount: 32, h: 12, price: 50,
    parts: [['leaves', 'plain']], swatches: [{ leaves: '#d97b4e' }, { leaves: '#e7bb4f' }, { leaves: '#b85b50' }, { leaves: '#8e5a37' }],
    draw: function (M) { M.spr(1, .05, 0, function (c) { var Lf = M.ramp('leaves'); for (var i = 0; i <= 12; i++) { var u = i / 12, q = M.p(.05 + u * 1.9, .06, 0), dip = Math.sin(u * Math.PI) * 4, col = [Lf[1], '#e7bb4f', '#b85b50', Lf[0]][i % 4]; R(c, q[0] - 1, q[1] + dip, 3, 2, col); R(c, q[0], q[1] + dip - 1, 1, 4, col); R(c, q[0] + 1, q[1] + dip + 1, 1, 1, '#6b4250'); } }, [1, 12]); } });

  // the calendar for every holiday (spec 009, part A): its season (pieces on sale, "This season") and its day
  function nthThu(y, n) { var d = new Date(y, 10, 1), first = (4 - d.getDay() + 7) % 7 + 1; return first + (n - 1) * 7; }
  var MONTH = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
  var HOL = SS.HOLIDAYS = {
    christmas: { name: 'Christmas', back: 11, season: function (m, d) { return m === 11 || (m === 0 && d <= 6); } },
    newyear: { name: 'New Year\'s Eve', back: 11, season: function (m, d) { return (m === 11 && d >= 26) || (m === 0 && d <= 1); }, day: function (m, d) { return m === 11 && d === 31; } },
    valentines: { name: 'Valentine\'s Day', back: 1, season: function (m, d) { return m === 1 && d <= 14; }, day: function (m, d) { return m === 1 && d === 14; } },
    'keegan-bday': { name: 'Keegan\'s birthday', back: 2, season: function (m, d) { return m === 2 && d >= 10 && d <= 17; }, day: function (m, d) { return m === 2 && d === 17; } },
    spring: { name: 'Spring\'s first warm day', back: 2, season: function (m, d) { return (m === 2 && d >= 20) || m === 3; }, day: function (m, d) { return m === 2 && d === 20; } },
    july4: { name: 'The Fourth of July', back: 5, season: function (m, d) { return (m === 5 && d >= 27) || (m === 6 && d <= 4); }, day: function (m, d) { return m === 6 && d === 4; } },
    anniversary: { name: 'Your anniversary', back: 6, season: function (m, d) { return m === 6 && d >= 3 && d <= 10; }, day: function (m, d) { return m === 6 && d === 10; } },
    'sarah-bday': { name: 'Sarah\'s birthday', back: 7, season: function (m, d) { return m === 7 && d >= 24; }, day: function (m, d) { return m === 7 && d === 31; } },
    halloween: { name: 'Halloween', back: 9, season: function (m) { return m === 9; }, day: function (m, d) { return m === 9 && d === 31; } },
    thanksgiving: { name: 'Thanksgiving', back: 10, season: function (m, d, y) { var t = nthThu(y, 4); return m === 10 && d >= t - 3 && d <= t + 3; }, day: function (m, d, y) { return m === 10 && d === nthThu(y, 4); } }
  };
  SS.backIn = function (holiday) { var h = HOL[holiday]; return 'BACK IN ' + MONTH[h ? h.back : 11]; };
  SS.holidayToday = function (d) { for (var k in HOL) if (HOL[k].day && HOL[k].day(d.getMonth(), d.getDate(), d.getFullYear())) return k; return null; };
  SS.DEF = {}; C.forEach(function (d) { SS.DEF[d.id] = d; });

  // ---------- the calendar (part A) ----------
  SS.inSeason = function (holiday, d) { var h = HOL[holiday]; return h ? h.season(d.getMonth(), d.getDate(), d.getFullYear()) : true; };
  function key(name, d) { return name + '.' + d.getFullYear(); }

  // ---------- the day (part B): dressing for the day, gifts, hats, breakfast ----------
  SS.applyHolidays = function (G) {
    var W = G.W, S = G.save, d = SS.now(), m = d.getMonth(), day = d.getDate(), h = d.getHours();
    S.hol = S.hol || {};
    var today = m === 11 && day === 24 && h >= 17 ? 'eve' : m === 11 && day === 25 ? 'xmas' : SS.holidayToday(d);
    G.partyHat = today === 'sarah-bday' ? 'pink' : today === 'keegan-bday' ? 'green' : null;   // the cats in party hats (bible, Birthdays)
    // yesterday's dressing goes away, unless she kept it
    W.pieces.filter(function (p) { return p.dress && p.dress !== today + '.' + d.getFullYear(); }).forEach(function (p) { W.remove(p); });
    G.xmasDay = m === 11 && day === 25;
    // first snow: the first time she opens the game on or after Dec 21 (a weather moment)
    var winterYear = m === 11 ? d.getFullYear() : d.getFullYear() - 1, snowKey = 'snow.' + winterYear;
    if (((m === 11 && day >= 21) || m < 2) && !S.hol[snowKey]) { S.hol[snowKey] = Date.now(); G.toast('FIRST SNOW', 2400, 'Snow is falling past the windows.'); SS.moment(G, 'first-snow'); }
    if (G.mode !== 'life' || !today) { G.changed(true); return; }
    var k = key(today, d);
    if (S.hol[k]) return;
    S.hol[k] = Date.now();
    if (DRESS[today]) { // the rest of the year's days: a light layer of dressing, only for today (spec 009, part B)
      DRESS[today].forEach(function (q) { var o = {}; o[q[1]] = true; o.near = q[2]; var pc = place(G, q[0], o, k); if (pc && SS.DEF[q[0]].lamp) pc.lit = true; });
      G.toast(DAY_TEXT[today][0], 3000, DAY_TEXT[today][1]);
      G.changed(true); return;
    }
    if (today === 'eve') {
      place(G, 'stockings', { wall: true, near: 'christmas-tree' }, k);
      place(G, 'cookies-and-milk', { table: true, near: 'christmas-tree' }, k);
      G.toast('CHRISTMAS EVE', 2600, 'Stockings are up, and cookies are out for the night.');
    } else {
      var tree = W.pieces.filter(function (p) { return p.id === 'christmas-tree'; })[0];
      if (!tree) tree = place(G, 'christmas-tree', { floor: true }, k);
      var gifts = 0;
      for (var i = 0; i < 3; i++) { var g = place(G, 'christmas-gift', { floor: true, near: tree && tree.uid }, k); if (g) { g.gift = i; if (i === 0) g.note = true; gifts++; } }
      // Keegan's special breakfast, on the table with a sparkle
      if (h < 12) { var meal = place(G, 'plated-meal', { table: true }, k); if (meal) meal.special = true; }
      G.toast('MERRY CHRISTMAS', 3000, gifts ? 'There are gifts under the tree. Tap one to open it.' : 'Keegan made Christmas breakfast.');
    }
    G.changed(true);
  };
  var DRESS = {
    newyear: [['party-streamers', 'wall'], ['sparkling-cider', 'table']],
    valentines: [['heart-garland', 'wall'], ['rose-bouquet', 'table']],
    'keegan-bday': [['green-balloons', 'floor', 'sofa'], ['shamrock-pot', 'table']],
    spring: [['tulip-pot', 'table'], ['sun-catcher', 'wall']],
    july4: [['little-flags', 'table'], ['star-lights', 'wall']],
    anniversary: [['candle-trio', 'table'], ['rose-bouquet', 'table'], ['love-frame', 'wall']],
    'sarah-bday': [['balloon-bunch', 'floor', 'sofa'], ['birthday-cake', 'table']],
    halloween: [['jack-o-lantern', 'floor'], ['paper-bats', 'wall']],
    thanksgiving: [['harvest-centerpiece', 'table'], ['autumn-garland', 'wall']]
  };
  var DAY_TEXT = {
    newyear: ['NEW YEAR\'S EVE', 'Streamers are up and the cider is cold. Stay up for midnight.'],
    valentines: ['HAPPY VALENTINE\'S DAY', 'Hearts on the wall, roses on the table. Cook dinner together tonight.'],
    'keegan-bday': ['HAPPY BIRTHDAY, KEEGAN', 'Green everywhere for St. Patrick\'s Day, and the cats are in party hats.'],
    spring: ['SPRING\'S FIRST WARM DAY', 'Tulips on the table and light through the windows.'],
    july4: ['THE FOURTH OF JULY', 'Little flags out. Look out the windows after dark for fireworks.'],
    anniversary: ['HAPPY ANNIVERSARY', 'Candles and roses for a date night in. Cook something special together.'],
    'sarah-bday': ['HAPPY BIRTHDAY, SARAH', 'Balloons, a cake, and the cats in party hats.'],
    halloween: ['HAPPY HALLOWEEN', 'A jack-o\'-lantern glows and paper bats are up.'],
    thanksgiving: ['HAPPY THANKSGIVING', 'A harvest table. Cook a feast with Keegan.']
  };
  // tap any day-dressing piece to keep it: it joins her catalog for free (spec 009, part B)
  SS.keepDressing = function (G, p) { p.dress = null; if (G.save.made.indexOf(p.id) < 0) G.save.made.push(p.id); G.changed(true); };
  // put a day-dressing piece near something, on a wall, a table or the floor; it's marked as dressing for that day
  function place(G, id, o, k) {
    var W = G.W, near = o.near ? (typeof o.near === 'number' ? W.byUid[o.near] : W.pieces.filter(function (p) { return p.id === o.near; })[0]) : null;
    var f = near ? W.floorOf(near) : 0, ft = near ? W.foot(near.host ? W.hostOf(near) : near) : [W.ax + 4, W.ay + 8, W.ax + 5, W.ay + 9];
    var cx = (ft[0] + ft[2]) / 2, cy = (ft[1] + ft[3]) / 2, best = null;
    function tryC(cd, dd) { cd.id = id; cd.f = f; if (W.check(cd).ok && (!best || dd < best.d)) best = { d: dd, cd: cd }; }
    if (o.wall) W.walls[f].forEach(function (s) { if (s.b && !s.op && !s.win) tryC({ wall: [s.x, s.y, s.axis] }, Math.hypot(s.x - cx, s.y - cy)); });
    if (o.table) W.pieces.forEach(function (hst) { var hd = W.def(hst); if (!hd.spots.length || !/table|island|counter/.test(hst.id)) return; hd.spots.forEach(function (sp, i) { var pos = W.spotPos(hst, i); tryC({ host: hst.uid, spot: i }, Math.hypot(pos.x - cx, pos.y - cy)); }); });
    if (o.floor || !best) for (var x = W.ax; x < W.ax + W.home.w; x++) for (var y = W.ay; y < W.ay + W.home.d; y++) tryC({ x: x, y: y, r: 0 }, Math.hypot(x + .5 - cx, y + .5 - cy));
    if (!best) return null;
    var p = { id: id, sw: 0, props: true, dress: k }; for (var q in best.cd) if (q !== 'id') p[q] = best.cd[q];
    if (p.host) delete p.f; W.add(p); if (p.host) p.f = W.floorOf(p);
    return p;
  }
  // opening a gift: the one with Keegan's note shows it; each of the others is a free Christmas piece
  SS.openGift = function (G, gift) {
    var W = G.W, S = G.save;
    if (gift.note) {
      // the note opens on its own paper (memory-book-v1, Note found) and goes in the memory book (spec 007)
      W.remove(gift); G.changed(true); SS.showNote(G, 'tree', true); return;
    }
    var set = SS.CATALOG.filter(function (d) { return d.holiday === 'christmas' && d.tab === 'holiday' && d.id !== 'christmas-tree'; }).map(function (d) { return d.id; });
    S.hol.given = S.hol.given || []; var left = set.filter(function (id) { return S.hol.given.indexOf(id) < 0; }); if (!left.length) left = set;
    var id = left[Math.floor(Math.random() * left.length)]; S.hol.given.push(id);
    var spot = { x: gift.x, y: gift.y, f: gift.f }; W.remove(gift);
    var p = { id: id, sw: 0, props: true };
    if (SS.DEF[id].kind === 'wall') { if (!SS.placeNear(G, id, W.pieces.filter(function (q) { return q.id === 'christmas-tree'; })[0] || W.pieces[0])) {} }
    else { p.f = spot.f; p.x = spot.x; p.y = spot.y; p.r = 0; if (W.check(p).ok) W.add(p); else SS.placeNear(G, id, W.pieces[0]); }
    if (S.made.indexOf(id) < 0) S.made.push(id);
    G.changed(true);
    G.toast('A GIFT: ' + SS.DEF[id].name.toUpperCase(), 2600, 'It\'s yours to keep and place anywhere.');
  };
})();
