// Sarah's Sim: Cooking (spec 006, part E; bible, Play, Cooking; mockups/cooking-v1).
//   She taps the stove or the fridge and picks Cook, or taps Keegan and picks Cook together. The recipe card shows one of Keegan's
//   nine dishes: what goes in, and its steps with how each one plays; swipe (or the arrows, or the D-pad) for the others.
//   Each step is one short one-thumb game at the counter, with Keegan beside her doing the other half:
//     hold  - hold on the pan and let go when the gauge says Just right (with buttons: A starts the heat, A again stops it)
//     stir  - circle a finger round the pan, three times round (or tap A)
//     chop  - swipe down across what's on the board, five cuts (or tap A)
//     stack - tap to drop each layer when the swinging marker is over the plate (or A)
//   There's no timer and no way to fail: a step that's a bit off still makes the dish, the plate just has a little less sparkle.
//   Serve puts the dish on the table; eating it fills hunger for both of them, and Ralph turns up and stares.
//   The first time she makes each dish adds its Kitchen moment in the memory book, and the first dish ever adds "Cooking together".
//   Cooking pays no coins and store-bought things are always in the pantry, so nothing ever limits what she can cook.
//   Garden veggies (spec 005) stand in for store-bought ones once the garden is built: SS.pantryHas tells.
(function () {
  // ---------- Keegan's nine dishes (bible, Play, Cooking) ----------
  var D = [
    { id: 'burritos', name: 'Bean burritos', in: ['Tortillas', 'Beans', 'Rice', 'Cheese', 'Salsa'], steps: [['Warm the beans', 'hold'], ['Warm the tortillas', 'hold'], ['Fill', 'stack'], ['Roll', 'stack']], bits: ['#8a4f3a', '#fff6ea', '#ffcf4a', '#d2363c'], k: 'Grating the cheese' },
    { id: 'spaghetti', name: 'Spaghetti and meatballs', in: ['Spaghetti', 'Meatballs', 'Marinara', 'Parmesan'], steps: [['Boil the pasta', 'stir'], ['Simmer the meatballs in sauce', 'stir'], ['Plate', 'stack'], ['Cheese on top', 'stack']], bits: ['#f3d38a', '#b8402e', '#7a4430', '#fff6ea'], k: 'Making the sauce' },
    { id: 'eggs', name: 'Eggs on toast', in: ['Eggs', 'Bread', 'Butter', 'Pepper'], steps: [['Toast the bread', 'hold'], ['Fry the eggs', 'hold'], ['Stack', 'stack']], bits: ['#fffaf0', '#ffc531', '#d9a05a', '#3b2430'], k: 'Buttering the toast' },
    { id: 'beef', name: 'Beef and broccolini', in: ['Thin-sliced beef', 'Broccolini', 'Shallots', 'Soy-honey sauce', 'Rice'], veg: ['Broccolini', 'Shallots'], steps: [['Slice', 'chop'], ['Sear the beef', 'hold'], ['Soften the greens', 'stir'], ['Toss in sauce', 'stir']], bits: ['#7a4430', '#5f9a4c', '#c89a4a', '#fff6ea'], k: 'Making the sauce' },
    { id: 'nachos', name: 'Chicken nachos', in: ['Chips', 'Chicken', 'Peppers and onion', 'Beans', 'Cheese', 'Salsa'], veg: ['Peppers and onion'], steps: [['Char the peppers', 'hold'], ['Season the chicken', 'stir'], ['Layer the pan', 'stack'], ['Melt the cheese', 'hold']], bits: ['#d2363c', '#6aa361', '#ffd56b', '#f6ead0', '#e4542f'], k: 'Cutting the onion' },
    { id: 'sandwiches', name: 'Breakfast sandwiches', in: ['Eggs', 'Sausage', 'Cheese', 'Hashbrowns', 'English muffin'], steps: [['Crisp the hashbrowns', 'hold'], ['Brown the sausage', 'hold'], ['Fry the eggs', 'hold'], ['Stack', 'stack']], bits: ['#e2a840', '#7a4430', '#fffaf0', '#ffc531'], k: 'Toasting the muffins' },
    { id: 'subs', name: 'Meatball subs', in: ['Meatballs', 'Marinara', 'Rolls', 'Provolone'], steps: [['Simmer', 'stir'], ['Toast the rolls', 'hold'], ['Load', 'stack'], ['Melt', 'hold']], bits: ['#7a4430', '#b8402e', '#e2b07e', '#fff1c4'], k: 'Warming the sauce' },
    { id: 'ravioli', name: 'Ravioli with chicken sausage', in: ['Ravioli', 'Chicken sausage', 'Red and white sauce'], steps: [['Brown the sausage', 'hold'], ['Boil the ravioli', 'stir'], ['Mix the sauces', 'stir'], ['Fold', 'stir']], bits: ['#f3d38a', '#c86a4a', '#f6e3d0', '#b8402e'], k: 'Mixing the sauces' },
    { id: 'tacos', name: 'Chorizo breakfast tacos', in: ['Chorizo', 'Eggs', 'Hashbrowns', 'Tortillas', 'Green salsa'], veg: [], steps: [['Crisp the hashbrowns', 'hold'], ['Cook the chorizo', 'hold'], ['Scramble', 'stir'], ['Fill', 'stack']], bits: ['#b8402e', '#ffd56b', '#e2a840', '#7fae4a', '#fff6ea'], k: 'Warming the tortillas' }
  ];
  SS.DISHES = D;
  // the garden's pantry (spec 005): until it's built, nothing comes from the garden
  SS.pantryHas = SS.pantryHas || function () { return false; };

  var P = { rose: '#e46f8b', roseHi: '#f39bb0', roseSh: '#b44f63', tray: '#fff6ea', trayEdge: '#e8dccd', trayInk: '#3b2430', soft: '#8e5a5e',
    wood: ['#d9a46e', '#c88d5a', '#9c6a40'], sage: ['#9cc1b6', '#7fa7a0', '#5d8580'], iron: ['#5a5054', '#3b3236', '#2a2327'], leaf: '#6aa361', leafSh: '#437a47', leafHi: '#a8d88a' };
  var c, G0;
  function R(x, y, w, h, col) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
  function hash(i, j) { var h = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return h - Math.floor(h); }
  function txt(s, x, y, col, size, align) { c.font = (size || 8) + 'px "Press Start 2P", monospace'; c.fillStyle = col; c.textAlign = align || 'left'; c.textBaseline = 'top'; c.fillText(s, x, y); }
  function vt(s, x, y, col, size, align) { c.font = (size || 10) + 'px "VT323", monospace'; c.fillStyle = col; c.textAlign = align || 'left'; c.textBaseline = 'top'; c.fillText(s, x, y); }
  function hit(x, y, w, h, fn) { G0.hits.push({ x: x, y: y, w: w, h: h, fn: fn }); }
  function btn(x, y, w, s, on, h, fn) { h = h || 16; R(x, y, w, h, on ? P.rose : '#fbeedd'); R(x, y + h - 1, w, 1, on ? P.roseSh : P.trayEdge); if (on) R(x, y, w, 1, P.roseHi); txt(s, x + w / 2, y + (h - 7) / 2, on ? '#fff' : P.trayInk, 6, 'center'); if (fn) hit(x, y - 2, w, h + 4, fn); }
  function card(x, y, w, h) { R(x + 2, y + 3, w, h, 'rgba(34,23,31,.35)'); R(x, y, w, h, P.tray); R(x, y + h - 1, w, 1, P.trayEdge); c.strokeStyle = P.rose; c.strokeRect(x + .5, y + .5, w - 1, h - 1); }
  function sparkle(x, y, on, s) {
    s = s || 1; var col = on ? '#ffd56b' : '#e8dccd', sh = on ? '#e7a43a' : '#d6c6b4';
    [[sh, 1], [col, 0]].forEach(function (L) { c.fillStyle = L[0]; c.beginPath(); for (var p = 0; p < 8; p++) { var r = p % 2 ? 3 * s : 9 * s, an = -Math.PI / 2 + p * Math.PI / 4; c.lineTo(x + Math.cos(an) * r + L[1], y + Math.sin(an) * r + L[1]); } c.closePath(); c.fill(); });
  }
  function leafIcon(x, y) { c.fillStyle = P.leafSh; c.beginPath(); c.ellipse(x + 4, y + 4, 4, 2.5, -.6, 0, 7); c.fill(); c.fillStyle = P.leaf; c.beginPath(); c.ellipse(x + 4, y + 3, 3, 1.8, -.6, 0, 7); c.fill(); }
  function steam(x, y, t, n, h) { for (var k = 0; k < (n || 3); k++) { var ph = ((t * 2 + k * 7) % 18) / 18; c.fillStyle = 'rgba(255,255,255,' + (.5 * (1 - ph)).toFixed(2) + ')'; for (var q = 0; q < 4; q++) c.fillRect(Math.round(x + k * 7 - 7 + Math.sin(ph * 6 + q) * 2), Math.round(y - ph * (h || 20) - q * 2), 1, 2); } }

  // ---------- the counter: tiled wall, utensils, Keegan on the right, Ralph on the floor (cooking-v1) ----------
  function counterScene(W, H, t, o) {
    var ct = H - 104;
    R(0, 0, W, ct, '#f4dfa8');
    for (var y = 44, row = 0; y < ct; y += 8, row++) for (var x = (row % 2) * -8; x < W; x += 16) { R(x, y, 15, 7, '#fbf4ea'); R(x, y + 6, 15, 1, '#e9dcc4'); R(x, y, 15, 1, '#fffaf3'); }
    R(0, 40, W, 4, '#fff1e2'); R(0, 43, W, 1, '#e9dcc4');
    var ry = Math.max(96, ct - 150); R(14, ry, 92, 3, '#b9a898'); R(14, ry, 92, 1, '#e9dcc4');
    [[22, 'ladle'], [40, 'spat'], [58, 'whisk'], [76, 'spoon'], [92, 'ladle']].forEach(function (u) { var x = u[0]; R(x, ry + 3, 1, 4, '#6b4250');
      if (u[1] === 'ladle') { R(x, ry + 7, 2, 18, '#8e8a90'); R(x - 3, ry + 25, 8, 5, '#8e8a90'); R(x - 2, ry + 25, 6, 1, '#d6dde2'); }
      if (u[1] === 'spat') { R(x, ry + 7, 2, 14, '#c88d5a'); R(x - 3, ry + 21, 8, 9, '#3b3236'); R(x - 2, ry + 22, 1, 7, '#5a5054'); }
      if (u[1] === 'whisk') { R(x, ry + 7, 2, 8, '#c88d5a'); c.strokeStyle = '#d6dde2'; c.beginPath(); c.ellipse(x + 1, ry + 22, 4, 8, 0, 0, 7); c.ellipse(x + 1, ry + 22, 1.5, 8, 0, 0, 7); c.stroke(); }
      if (u[1] === 'spoon') { R(x, ry + 7, 2, 16, '#e2b07e'); c.fillStyle = '#e2b07e'; c.beginPath(); c.ellipse(x + 1, ry + 26, 3, 4, 0, 0, 7); c.fill(); } });
    var fx = 176, fy = ry - 6; R(fx, fy, 40, 32, '#c88d5a'); R(fx + 3, fy + 3, 34, 26, '#fbf4ea'); R(fx + 3, fy + 22, 34, 7, '#e8dccd');
    c.fillStyle = '#e8963f'; c.beginPath(); c.ellipse(fx + 13, fy + 19, 6, 5, 0, 0, 7); c.fill(); R(fx + 8, fy + 12, 3, 3, '#e8963f'); R(fx + 15, fy + 12, 3, 3, '#e8963f');
    c.fillStyle = '#8a8590'; c.beginPath(); c.ellipse(fx + 27, fy + 19, 6, 5, 0, 0, 7); c.fill(); R(fx + 22, fy + 12, 3, 3, '#8a8590'); R(fx + 29, fy + 12, 3, 3, '#8a8590');
    R(10, 30, 120, 4, P.wood[1]); R(10, 33, 120, 1, P.wood[2]);
    [[16, '#e2b07e', 12], [30, '#c9636b', 10], [42, '#f3d38a', 12], [58, '#8fc47b', 9]].forEach(function (j) { R(j[0], 30 - j[2], 10, j[2], 'rgba(230,240,245,.85)'); R(j[0] + 1, 30 - j[2] + 4, 8, j[2] - 5, j[1]); R(j[0], 30 - j[2] - 2, 10, 2, P.wood[1]); });
    R(84, 20, 12, 10, '#d98a6f'); R(84, 20, 12, 2, '#e8a28c'); c.fillStyle = P.leaf; [[86, 14], [92, 12], [96, 18], [82, 18], [89, 8]].forEach(function (l) { c.beginPath(); c.ellipse(l[0], l[1], 4, 2.5, .5, 0, 7); c.fill(); });
    if (o.keegan) { var kx = 146, ky = ct - 88, bob = (o.busy && t % 2) ? 1 : 0; SS.drawKeeganSprite(c, kx, ky + bob, 3, t, false); }
    R(0, ct, W, 10, P.wood[0]); R(0, ct, W, 2, '#f0c896'); R(0, ct + 9, W, 2, P.wood[2]);
    for (var bx = 0; bx < W; bx += 13) R(bx, ct + 2, 1, 7, 'rgba(156,106,64,.35)');
    R(0, ct + 11, W, H - ct - 11, P.sage[1]);
    [[4, 70], [80, 80], [166, 70]].forEach(function (d) { R(d[0], ct + 16, d[1], H - ct - 20, P.sage[0]); R(d[0] + 3, ct + 19, d[1] - 6, H - ct - 26, P.sage[1]); R(d[0] + d[1] / 2 - 6, ct + 22, 12, 2, '#e7bb4f'); });
    if (o.ralph) { c.save(); c.translate(40, H - (o.footer ? 28 : 2)); c.scale(2, 2); SS.cat(c, 'ralph', 0, 0, { pose: 'sit' }); c.restore(); }
    return ct;
  }
  function stove(cx, cy, heat, t) { R(cx - 56, cy - 4, 112, 12, '#3b3236'); R(cx - 56, cy - 4, 112, 2, '#5a5054'); c.fillStyle = heat ? 'rgba(255,120,60,' + (.55 + .15 * Math.sin(t)).toFixed(2) + ')' : '#5a5054'; c.beginPath(); c.ellipse(cx, cy + 2, 30, 4, 0, 0, 7); c.fill(); }
  function bigPan(cx, cy, d, done, t, spin) { // cast iron, the dish's bits browning as done goes 0..1
    c.fillStyle = 'rgba(30,20,25,.4)'; c.beginPath(); c.ellipse(cx + 2, cy + 6, 46, 14, 0, 0, 7); c.fill();
    R(cx - 82, cy - 3, 40, 6, P.iron[1]); R(cx - 82, cy - 3, 40, 2, P.iron[0]); R(cx - 86, cy - 4, 6, 8, P.iron[2]);
    c.fillStyle = P.iron[2]; c.beginPath(); c.ellipse(cx, cy, 44, 15, 0, 0, 7); c.fill();
    c.fillStyle = P.iron[1]; c.beginPath(); c.ellipse(cx, cy - 2, 40, 12, 0, 0, 7); c.fill();
    c.fillStyle = '#3a3236'; c.beginPath(); c.ellipse(cx, cy - 1, 36, 10, 0, 0, 7); c.fill();
    for (var k = 0; k < 16; k++) {
      var a = hash(k, 3) * 6.28 + (spin || 0), r = 6 + hash(k, 9) * 24, px = cx + Math.cos(a) * r, py = cy - 1 + Math.sin(a) * r * .3, j = (t + k) % 3 === 0 ? -1 : 0;
      c.save(); c.translate(px, py + j); c.rotate(hash(k, 5) * 3 - 1.5 + (spin || 0)); R(-5, -1.5, 10, 3, d.bits[k % d.bits.length]); R(-5, -1.5, 10, 1, 'rgba(255,255,255,.3)');
      if (done > .25) { R(-3, -1, 2, 2, 'rgba(40,25,25,' + Math.min(.8, done).toFixed(2) + ')'); if (done > .5) R(2, 0, 2, 1, 'rgba(40,25,25,' + Math.min(.8, done).toFixed(2) + ')'); }
      c.restore();
    }
    for (var s = 0; s < 8; s++) { var ph = (t * 3 + s * 5) % 10; R(cx - 30 + s * 8 + (ph % 3), cy - 10 - ph, 1, 1, 'rgba(255,240,220,' + (1 - ph / 10).toFixed(2) + ')'); }
    steam(cx - 10, cy - 12, t, 4, 34);
  }
  function boardItem(x, y, d, cuts, t) { // her cutting board, and what she's slicing
    R(x, y, 110, 9, '#d9a46e'); R(x, y, 110, 2, '#eac08e'); R(x, y + 8, 110, 1, '#9c6a40');
    var col = d.bits[0], w = 60 - cuts * 6;
    R(x + 12, y - 8, w, 8, col); R(x + 12, y - 8, w, 2, 'rgba(255,255,255,.3)');
    for (var k = 0; k < cuts; k++) { R(x + 16 + w + k * 7, y - 6, 5, 6, col); R(x + 16 + w + k * 7, y - 6, 5, 1, 'rgba(255,255,255,.35)'); }
  }
  function keeganBoard(x, y, t) { // Keegan's half: chopping on his own board
    R(x, y, 62, 8, '#d9a46e'); R(x, y, 62, 2, '#eac08e'); R(x, y + 7, 62, 1, '#9c6a40');
    c.fillStyle = '#efe0f0'; c.beginPath(); c.ellipse(x + 18, y, 10, 6, 0, Math.PI, 0); c.fill();
    var kb = t % 2 ? -3 : 0; R(x + 44, y - 8 + kb, 14, 2, '#d6dde2'); R(x + 44, y - 8 + kb, 14, 1, '#f2f5f7'); R(x + 56, y - 9 + kb, 8, 4, '#3b2430');
  }
  // the finished dish, seen from a little above: each of the nine its own way
  function dishArt(cx, cy, s, d, t) {
    c.fillStyle = 'rgba(30,20,25,.3)'; c.beginPath(); c.ellipse(cx + 2, cy + 5 * s, 30 * s, 10 * s, 0, 0, 7); c.fill();
    var pan = d.id === 'nachos' || d.id === 'beef';
    c.fillStyle = pan ? P.iron[2] : '#d9dde2'; c.beginPath(); c.ellipse(cx, cy, 28 * s, 10 * s, 0, 0, 7); c.fill();
    c.fillStyle = pan ? P.iron[0] : '#fffaf0'; c.beginPath(); c.ellipse(cx, cy - 1 * s, 25 * s, 8 * s, 0, 0, 7); c.fill();
    if (pan) R(cx + 26 * s, cy - 2 * s, 14 * s, 4 * s, P.iron[1]);
    var B = d.bits, Rs = function (x, y, w, h, col) { R(cx + x * s, cy + y * s, w * s, h * s, col); };
    if (d.id === 'nachos') { for (var k = 0; k < 22; k++) { var a = hash(k, 1) * 6.28, r = hash(k, 2) * 20 * s, px = cx + Math.cos(a) * r, py = cy - 2 * s + Math.sin(a) * r * .32 - hash(k, 4) * 3 * s; c.fillStyle = k % 3 ? '#f0c060' : '#e2a840'; c.beginPath(); c.moveTo(px, py - 5 * s); c.lineTo(px + 5 * s, py + 2 * s); c.lineTo(px - 5 * s, py + 2 * s); c.closePath(); c.fill(); }
      [[-10, -4], [6, -1], [14, -5], [-4, 1]].forEach(function (q) { c.fillStyle = '#c94a3a'; c.beginPath(); c.arc(cx + q[0] * s, cy + q[1] * s, 2 * s, 0, 7); c.fill(); });
      [[-14, -1], [-2, -6], [10, 1], [18, -2], [2, -2]].forEach(function (q, i) { Rs(q[0], q[1], 3, 1.5, i % 2 ? '#6aa361' : '#d2363c'); }); }
    else if (d.id === 'burritos' || d.id === 'tacos') { [-10, 0, 10].forEach(function (x, i) { Rs(x - 5, -6 + i, 10, 9, '#f2d39a'); Rs(x - 5, -6 + i, 10, 2, '#fbe6bd'); Rs(x - 3, -4 + i, 6, 2, B[i % B.length]); Rs(x - 2, -1 + i, 4, 1, B[(i + 1) % B.length]); }); }
    else if (d.id === 'spaghetti') { c.strokeStyle = B[0]; c.lineWidth = 1.2 * s; for (var q = 0; q < 6; q++) { c.beginPath(); c.ellipse(cx + (q - 3) * 3 * s, cy - 2 * s, 8 * s, 3 * s, q * .5, 0, 5); c.stroke(); } c.lineWidth = 1;
      c.fillStyle = B[1]; c.beginPath(); c.ellipse(cx, cy - 3 * s, 12 * s, 4 * s, 0, 0, 7); c.fill(); [[-6, -4], [2, -5], [7, -2], [-2, -1]].forEach(function (p) { c.fillStyle = B[2]; c.beginPath(); c.arc(cx + p[0] * s, cy + p[1] * s, 2.5 * s, 0, 7); c.fill(); }); Rs(-4, -7, 8, 1, B[3]); }
    else if (d.id === 'eggs') { [-7, 7].forEach(function (x) { Rs(x - 7, -7, 14, 10, B[2]); Rs(x - 6, -6, 12, 8, '#e8b870'); c.fillStyle = B[0]; c.beginPath(); c.ellipse(cx + x * s, cy - 3 * s, 6 * s, 3.5 * s, 0, 0, 7); c.fill(); c.fillStyle = B[1]; c.beginPath(); c.arc(cx + x * s, cy - 3.5 * s, 2 * s, 0, 7); c.fill(); }); }
    else if (d.id === 'sandwiches' || d.id === 'subs') { [-9, 9].forEach(function (x) { var w = d.id === 'subs' ? 16 : 12; Rs(x - w / 2, -2, w, 4, B[2] || '#e2b07e'); Rs(x - w / 2, -5, w, 3, B[0]); Rs(x - w / 2 + 1, -7, w - 2, 2, B[3] || B[1]); Rs(x - w / 2, -11, w, 4, d.id === 'subs' ? '#e2b07e' : '#e8c890'); Rs(x - w / 2, -11, w, 1, '#f6e0b0'); }); }
    else { for (var m = 0; m < 14; m++) { var a2 = hash(m, 6) * 6.28, r2 = hash(m, 7) * 16 * s; Rs(Math.cos(a2) * r2 / s - 3, Math.sin(a2) * r2 * .3 / s - 4, 6, 4, B[m % B.length]); } }
    steam(cx, cy - 8 * s, t, 3, 14 * s);
  }

  // ---------- the flow ----------
  SS.openCooking = function (G, dish) { G.bubble = null; G.meters = null; G.toastT = null; G.menu = { kind: 'cook', state: 'recipe', dish: dish === undefined ? (G.save.lastDish || 0) % D.length : dish }; };
  function startStep(m, i) { var st = D[m.dish].steps[i]; m.state = 'step'; m.step = i; m.game = st[1]; m.v = 0; m.n = 0; m.heat = false; m.angle = 0; m.swing = 0; m.done = false; m.score = m.score || []; }
  SS.cookStart = function (G) { var m = G.menu; m.score = []; startStep(m, 0); };
  function finishStep(G, sc) {
    var m = G.menu; if (m.done) return; m.done = true; m.score[m.step] = Math.max(0, Math.min(1, sc)); m.word = sc > .8 ? 'JUST RIGHT' : sc > .5 ? 'NICE' : 'IT\'LL DO';
    m.wait = performance.now();
  }
  function next(G) {
    var m = G.menu, d = D[m.dish];
    if (m.step + 1 < d.steps.length) startStep(m, m.step + 1);
    else { m.state = 'plated'; plated(G); }
  }
  function plated(G) {
    var m = G.menu, d = D[m.dish], avg = m.score.reduce(function (a, b) { return a + b; }, 0) / m.score.length;
    m.stars = avg > .8 ? 3 : avg > .5 ? 2 : 1;
    m.garden = (d.veg || []).some(function (v) { return SS.pantryHas(v); });
    G.save.lastDish = m.dish;
    var s = G.people && G.people.sarah, fx = { f: s ? s.f : 0, x: s ? s.x : 0, y: s ? s.y : 0 };
    SS.moment(G, 'cook-first', fx); SS.moment(G, 'dish-' + d.id, fx);
  }
  SS.cookServe = function (G) {
    var m = G.menu, d = D[m.dish]; G.menu = null;
    var p = SS.serveMeal ? SS.serveMeal(G, true) : null;
    if (p) { p.dish = d.id; var near = G.W.pieces.filter(function (q) { return q.id === 'stove'; })[0] || G.W.hostOf(p); if (SS.callRalph && near) SS.callRalph(G, near); }
    G.toast(d.name.toUpperCase(), 2400, p ? 'It\'s on the table. Eating it fills hunger for you both.' : 'Clear a spot on a table to serve it.');
  };
  // input: taps go to the drawn buttons; these are for the step games
  SS.cookPress = function (G, k) {
    var m = G.menu;
    if (m.state === 'recipe') {
      if (k === 'left') m.dish = (m.dish + D.length - 1) % D.length; if (k === 'right') m.dish = (m.dish + 1) % D.length;
      if (k === 'a') SS.cookStart(G); if (k === 'b') G.menu = null; return;
    }
    if (m.state === 'plated') { if (k === 'a') SS.cookServe(G); if (k === 'b') { m.state = 'recipe'; } return; }
    if (m.done) { if (k === 'a') next(G); return; }
    if (k === 'b') { m.state = 'recipe'; return; }
    if (k !== 'a') return;
    if (m.game === 'hold') { if (!m.heat) m.heat = true; else release(G); }
    else if (m.game === 'stir') { m.angle += Math.PI / 3; if (m.angle >= Math.PI * 6) finishStep(G, .85 + hash(m.step, 2) * .15); }
    else if (m.game === 'chop') { m.n++; if (m.n >= 5) finishStep(G, .9); }
    else if (m.game === 'stack') drop(G);
  };
  function release(G) { var m = G.menu; m.heat = false; var v = m.v, sc = v >= .52 && v <= .74 ? 1 : 1 - Math.min(1, Math.abs(v - .63) * 2.2); finishStep(G, sc); }
  function drop(G) { var m = G.menu, off = Math.abs(Math.sin(m.swing)), need = 3; m.n++; m.acc = (m.acc || 0) + (1 - off); if (m.n >= need) finishStep(G, m.acc / need); }
  SS.cookPointer = function (G, type, p) { // raw touches: hold on the pan, circles, swipes, taps (game.js passes them while cooking)
    var m = G.menu; if (!m || m.kind !== 'cook' || m.state !== 'step' || m.done) return;
    if (m.game === 'hold') { if (type === 'down' && p.y > G.H - 160 && p.y < G.H - 40) m.heat = true; if (type === 'up' && m.heat) release(G); }
    if (m.game === 'stir' && type === 'move') { var cx = 84, cy = G.H - 108, a = Math.atan2(p.y - cy, (p.x - cx) * .35); if (m.last !== undefined) { var da = a - m.last; if (da > Math.PI) da -= Math.PI * 2; if (da < -Math.PI) da += Math.PI * 2; m.angle += Math.abs(da); if (m.angle >= Math.PI * 6) finishStep(G, .9); } m.last = a; }
    if (m.game === 'stir' && type === 'up') m.last = undefined;
    if (m.game === 'chop') { if (type === 'down') m.cy0 = p.y; if (type === 'up' && m.cy0 !== undefined && p.y - m.cy0 > 18) { m.n++; m.cy0 = undefined; if (m.n >= 5) finishStep(G, .9); } }
    if (m.game === 'stack' && type === 'tap') drop(G);
  };
  SS.cookTick = function (G, dt) {
    var m = G.menu; if (!m || m.kind !== 'cook' || m.state !== 'step') return;
    if (m.done && performance.now() - m.wait > 900) { next(G); return; }
    if (m.game === 'hold' && m.heat) { m.v = Math.min(1, m.v + dt * .32); if (m.v >= 1) release(G); }
    if (m.game === 'stack') m.swing += dt * 2.2;
  };

  // ---------- drawing ----------
  SS.drawCooking = function (G, W, H) {
    c = G.c; G0 = G; var m = G.menu, t = G.t || 0, d = D[m.dish];
    hit(0, 0, W, H, function () {});
    c.fillStyle = '#22171f'; c.fillRect(0, 0, W, H);
    if (m.state === 'recipe') recipe(G, W, H, t, m, d);
    else if (m.state === 'step') step(G, W, H, t, m, d);
    else platedCard(G, W, H, t, m, d);
  };
  function recipe(G, W, H, t, m, d) {
    counterScene(W, H, t, { keegan: true, ralph: true });
    R(0, 0, W, H, 'rgba(34,23,31,.45)');
    var w = 224, x = (W - w) / 2, steps = d.steps, h = Math.min(H - 16, 150 + steps.length * 20 + 50), y = Math.max(8, Math.round((H - h) / 2));
    card(x, y, w, h); R(x, y, w, 22, P.rose); R(x, y, w, 1, P.roseHi);
    txt('‹', x + 8, y + 8, '#fff', 8); txt('›', x + w - 16, y + 8, '#fff', 8);
    hit(x, y, 30, 22, function () { m.dish = (m.dish + D.length - 1) % D.length; }); hit(x + w - 30, y, 30, 22, function () { m.dish = (m.dish + 1) % D.length; });
    var title = d.name.toUpperCase(); txt(title.length > 22 ? title.slice(0, 21) + '…' : title, x + w / 2, y + 8, '#fff', title.length > 18 ? 5 : 6, 'center');
    vt('Recipe ' + (m.dish + 1) + ' of ' + D.length + ' · swipe for more', x + w / 2, y + 24, P.soft, 11, 'center');
    R(x + 8, y + 38, 82, 58, '#fbeedd'); dishArt(x + 49, y + 72, 1.25, d, t);
    txt('WHAT GOES IN', x + 98, y + 40, P.trayInk, 5);
    var veg = d.veg || [], anyG = false;
    d.in.forEach(function (g, i) { var yy = y + 50 + i * 9, fromG = veg.indexOf(g) >= 0 && SS.pantryHas(g); anyG = anyG || fromG; R(x + 99, yy + 4, 3, 3, fromG ? P.leaf : '#d6c6b4'); vt(g, x + 105, yy - 1, P.trayInk, 11); if (fromG) leafIcon(x + 105 + c.measureText(g).width + 3, yy + 1); });
    if (anyG) { R(x + 98, y + 106, 118, 14, '#e8f3dd'); R(x + 98, y + 119, 118, 1, '#b9d8a0'); leafIcon(x + 102, y + 109); vt('From your garden', x + 114, y + 107, '#437a47', 11); }
    var sy = y + 124;
    R(x + 8, sy, w - 16, 1, P.trayEdge); txt('STEPS', x + 8, sy + 6, P.trayInk, 5); vt('with Keegan', x + 44, sy + 3, P.soft, 11);
    steps.forEach(function (st, i) {
      var yy = sy + 18 + i * 20; R(x + 8, yy, w - 16, 17, i % 2 ? '#fbeedd' : '#fff1e2');
      R(x + 11, yy + 3, 11, 11, P.rose); txt(String(i + 1), x + 14, yy + 5, '#fff', 6);
      vt(st[0].length > 24 ? st[0].slice(0, 23) + '…' : st[0], x + 27, yy + 2, P.trayInk, 12);
      R(x + w - 52, yy + 3, 40, 11, '#fff'); c.strokeStyle = P.trayEdge; c.strokeRect(x + w - 51.5, yy + 3.5, 39, 10); txt(st[1].toUpperCase(), x + w - 32, yy + 6, P.soft, 5, 'center');
    });
    vt('No timer. Every try makes the dish.', x + w / 2, sy + 22 + steps.length * 20, P.soft, 11, 'center');
    btn(x + 8, y + h - 26, 98, 'BACK', false, 18, function () { G.menu = null; }); btn(x + w - 106, y + h - 26, 98, 'COOK', true, 18, function () { SS.cookStart(G); });
  }
  function stepHeader(W, title, n, of, word) {
    card(4, 4, W - 8, 38);
    for (var i = 0; i < of; i++) { var x = 10 + i * 10; R(x, 10, 7, 7, i < n - 1 ? '#8cc06a' : (i === n - 1 ? P.rose : '#e8dccd')); if (i < n - 1) { R(x + 2, 13, 1, 1, '#fff'); R(x + 3, 14, 1, 1, '#fff'); R(x + 4, 12, 1, 2, '#fff'); } }
    txt('STEP ' + n + ' OF ' + of, 10 + of * 10 + 4, 10, P.soft, 6);
    txt(title.length > 22 ? title.slice(0, 21) + '…' : title, 10, 26, P.trayInk, title.length > 18 ? 6 : 7);
    if (word) { R(W - 66, 23, 56, 13, '#e8f3dd'); R(W - 66, 35, 56, 1, '#b9d8a0'); txt(word, W - 38, 27, '#437a47', 5, 'center'); }
  }
  function footer(W, H, s) { R(0, H - 26, W, 26, 'rgba(255,246,234,.96)'); R(0, H - 27, W, 1, P.trayEdge); vt(s, 8, H - 21, P.trayInk, 12); }
  function gauge(x, y, w, v) {
    R(x, y, w, 10, '#3b2430');
    var g = c.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, '#f6ead0'); g.addColorStop(.45, '#f2a65a'); g.addColorStop(.75, '#b8642a'); g.addColorStop(1, '#55311d'); c.fillStyle = g; c.fillRect(x + 1, y + 1, w - 2, 8);
    R(x + w * .52, y - 2, 1, 14, '#fff'); R(x + w * .74, y - 2, 1, 14, '#fff'); R(x + w * .52, y - 3, w * .22 + 1, 1, '#fff');
    var px = x + 1 + (w - 3) * v; R(px - 2, y - 4, 5, 18, '#3b2430'); R(px - 1, y - 3, 3, 16, '#fff');
    vt('RAW', x, y + 12, P.soft, 10); vt('JUST RIGHT', x + w * .63, y + 12, '#437a47', 10, 'center'); vt('TOASTY', x + w, y + 12, P.soft, 10, 'right');
  }
  function speech(x, y, s, tailX) { c.font = '11px "VT323", monospace'; var w = Math.ceil(c.measureText(s).width) + 10; R(x, y, w, 14, '#fff'); R(x, y + 13, w, 1, P.trayEdge); c.strokeStyle = '#3b2430'; c.strokeRect(x + .5, y + .5, w - 1, 13); R(tailX, y + 13, 4, 2, '#fff'); vt(s, x + 5, y + 1, P.trayInk, 11); }
  function step(G, W, H, t, m, d) {
    var st = d.steps[m.step], ct = counterScene(W, H, t, { keegan: true, ralph: true, busy: true, footer: true });
    var hints = { hold: 'Hold the pan. Let go when it looks right.', stir: 'Circle your finger round the pan.', chop: 'Swipe down across it to cut.', stack: 'Tap when the marker is over the plate.' };
    if (m.game === 'hold' || m.game === 'stir') { stove(84, ct + 2, true, t); bigPan(84, ct - 4, d, m.game === 'hold' ? m.v : Math.min(1, m.angle / (Math.PI * 6)) * .5, t, m.game === 'stir' ? m.angle : 0); }
    if (m.game === 'stir') { var sa = m.angle, spx = 84 + Math.cos(sa) * 22, spy = ct - 5 + Math.sin(sa) * 6; c.strokeStyle = '#e2b07e'; c.lineWidth = 3; c.beginPath(); c.moveTo(spx, spy); c.lineTo(spx + 10, spy - 26); c.stroke(); c.lineWidth = 1; R(4, 48, W - 8, 14, 'rgba(255,246,234,.92)'); var turns = Math.min(3, m.angle / (Math.PI * 2)); R(8, 52, (W - 16) * turns / 3, 6, P.rose); vt(Math.floor(turns) + ' of 3 times round', W / 2, 50, P.trayInk, 10, 'center'); }
    if (m.game === 'chop') { boardItem(30, ct - 2, d, m.n, t); var kx = 40 + (60 - m.n * 6) + 12, ky = ct - 22 - (t % 2 ? 4 : 0); R(kx, ky, 3, 18, '#d6dde2'); R(kx, ky - 6, 3, 7, '#3b2430'); R(4, 48, W - 8, 14, 'rgba(255,246,234,.92)'); vt(m.n + ' of 5 cuts', W / 2, 50, P.trayInk, 10, 'center'); }
    if (m.game === 'stack') {
      var px0 = 84, py0 = ct - 6; c.fillStyle = '#d9dde2'; c.beginPath(); c.ellipse(px0, py0, 34, 8, 0, 0, 7); c.fill(); c.fillStyle = '#fffaf0'; c.beginPath(); c.ellipse(px0, py0 - 1, 30, 6, 0, 0, 7); c.fill();
      for (var k = 0; k < m.n; k++) { R(px0 - 18 + k, py0 - 6 - k * 5, 36 - k * 2, 5, d.bits[k % d.bits.length]); R(px0 - 18 + k, py0 - 6 - k * 5, 36 - k * 2, 1, 'rgba(255,255,255,.35)'); }
      if (!m.done) { var mx = px0 + Math.sin(m.swing) * 46; R(mx - 14, py0 - 40 - m.n * 5, 28, 5, d.bits[m.n % d.bits.length]); R(mx - 1, py0 - 30 - m.n * 5, 2, 18, 'rgba(255,255,255,.6)'); }
      hit(0, 48, W, H - 48 - 26, function () { SS.cookPointer(G, 'tap', {}); });
    }
    if (m.game === 'hold') { R(8, 48, W - 16, 30, 'rgba(255,246,234,.92)'); R(8, 77, W - 16, 1, P.trayEdge); gauge(16, 52, W - 32, m.v); }
    keeganBoard(162, ct - 2, t);
    if (m.step === 0) speech(108, ct - 122, d.k + '!', 166); else if (m.done) speech(108, ct - 122, m.word === 'JUST RIGHT' ? 'Perfect!' : 'Smells so good!', 166);
    stepHeader(W, st[0].toUpperCase(), m.step + 1, d.steps.length, m.done ? m.word : null);
    footer(W, H, m.done ? 'Nice. On to the next step.' : hints[m.game]);
  }
  function platedCard(G, W, H, t, m, d) {
    counterScene(W, H, t, { keegan: true, ralph: true });
    R(0, 0, W, H, 'rgba(34,23,31,.45)');
    var w = 208, h = 220 - (m.garden ? 0 : 18), x = (W - w) / 2, y = Math.max(36, Math.round((H - h) / 2));
    card(x, y, w, h); R(x, y, w, 20, P.rose); R(x, y, w, 1, P.roseHi);
    var title = d.name.toUpperCase() + '!'; txt(title.length > 22 ? title.slice(0, 21) + '…' : title, x + w / 2, y + 7, '#fff', title.length > 17 ? 5 : 7, 'center');
    R(x + 10, y + 26, w - 20, 78, '#fbeedd'); dishArt(x + w / 2 - 4, y + 72, 1.8, d, t);
    [0, 1, 2].forEach(function (k) { sparkle(x + 64 + k * 40, y + 120 + (k === 1 ? -3 : 0), k < m.stars, (t + k * 2) % 6 === 0 ? 1.1 : 1); });
    txt(m.stars === 3 ? 'SO GOOD' : m.stars === 2 ? 'YUM' : 'COZY', x + w / 2, y + 136, P.trayInk, 7, 'center');
    var ly = y + 150;
    if (m.garden) { R(x + 34, ly, w - 68, 16, '#e8f3dd'); R(x + 34, ly + 15, w - 68, 1, '#b9d8a0'); sparkle(x + 44, ly + 8, true, .5); leafIcon(x + 52, ly + 4); vt('Garden sparkle', x + 64, ly + 1, '#437a47', 12); ly += 22; }
    vt('Fills hunger for you both', x + w / 2, ly + 2, P.soft, 11, 'center');
    btn(x + 8, y + h - 26, 92, 'COOK AGAIN', false, 18, function () { m.state = 'recipe'; }); btn(x + w - 100, y + h - 26, 92, 'SERVE', true, 18, function () { SS.cookServe(G); });
  }
})();
