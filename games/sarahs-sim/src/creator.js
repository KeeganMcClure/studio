// Sarah's Sim: the Creator (spec 003, parts A and B; bible, Creator; mockups/creator-v1).
//   The same mirror view as Style; the view zooms in on the head while she works on the face. Nine tabs: age, face, eyes,
//   nose, lips, hair, body, skin and more. Each tab has a row of shapes and a row of colors; Random rolls a whole new person
//   from hand-made sets that go together (or only the open tab, when she holds it), Undo steps back through the last 20
//   changes, and Done asks for a name and opens Style for the new person (bible, Creator).
//   Part B's starting lists, half the shapes to start (build order step 1): 4 faces, 5 eyes with 12 eye colors, 4 noses,
//   4 lips with 10 lip colors, 12 hairstyles with 16 natural shades, 4 builds and 16 skin tones. Age, gender and the extras
//   (the Age and More tabs, part D) and fine tuning (part C) come next.
//   Keegan and Sarah are never opened here: they're restyled in Style (spec 003, part E, Claude default).
(function () {
  var P = SS.P;
  var TABS = SS.CREATOR_TABS = ['age', 'face', 'eyes', 'nose', 'lips', 'hair', 'body', 'skin', 'more'];
  var LISTS = {
    face: { key: 'face', shapes: ['round', 'oval', 'heart', 'square'], names: ['ROUND', 'OVAL', 'HEART', 'SQUARE'] },
    eyes: { key: 'eyes', shapes: ['almond', 'round', 'sleepy', 'lashes', 'small'], names: ['ALMOND', 'ROUND', 'SLEEPY', 'LASHES', 'SMALL'], color: 'eye', colors: function () { return SS.EYE_COLORS.map(function (c) { return c[0]; }); } },
    nose: { key: 'nose', shapes: ['button', 'long', 'wide', 'pointed'], names: ['BUTTON', 'LONG', 'WIDE', 'POINTED'] },
    lips: { key: 'lips', shapes: ['smile', 'full', 'small', 'soft'], names: ['SMILE', 'FULL', 'SMALL', 'SOFT'], color: 'lip', colors: function () { return SS.LIP_COLORS; } },
    hair: { key: 'hair', shapes: Object.keys(SS.HAIRSTYLES), color: 'shade', colors: function () { return SS.HAIR_SHADES.map(function (c) { return c[1]; }); } },
    body: { key: 'build', shapes: ['slim', 'broad', 'curvy', 'sturdy'], names: ['SLIM', 'BROAD', 'CURVY', 'STURDY'] },
    skin: { key: null, shapes: [], color: 'skin', colors: function () { return SS.SKINS.map(function (c) { return c[1]; }); } }
  };
  // Random picks from sets that go together: a skin tone with hair shades, eye colors and lip colors that suit it
  var SETS = [
    { skin: [0, 1, 2], shade: [7, 8, 9, 10, 4, 5], eye: [0, 6, 7, 4, 5], lip: [0, 2, 4, 8] },
    { skin: [3, 4, 5], shade: [0, 3, 4, 5, 6, 9, 11], eye: [1, 2, 3, 4, 0], lip: [0, 1, 6, 8] },
    { skin: [6, 7, 8, 9], shade: [0, 1, 2, 3, 4], eye: [1, 2, 3, 10, 11], lip: [1, 3, 5, 6] },
    { skin: [10, 11, 12, 13, 14, 15], shade: [1, 2, 0, 3, 12], eye: [1, 10, 2, 11], lip: [3, 5, 7, 9] }
  ];
  var GREY = [12, 13, 14];
  var NAMES = ['ROBIN', 'SAGE', 'JUNE', 'ELLIS', 'MAYA', 'NOAH', 'IVY', 'REMY', 'NORA', 'ALEX', 'LUCA', 'WREN', 'TESS', 'MILO', 'RUBY', 'SAM'];
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function randomPerson(only, p) {
    var set = pick(SETS), L = p ? JSON.parse(JSON.stringify(p.look)) : {}, o = p ? p.outfit : null;
    var all = !only;
    if (all || only === 'face') L.face = pick(LISTS.face.shapes);
    if (all || only === 'eyes') { L.eyes = pick(LISTS.eyes.shapes); L.eye = pick(set.eye); }
    if (all || only === 'nose') L.nose = pick(LISTS.nose.shapes);
    if (all || only === 'lips') { L.lips = pick(LISTS.lips.shapes); L.lip = pick(set.lip); }
    if (all || only === 'body') L.build = pick(LISTS.body.shapes);
    if (all || only === 'skin') L.skin = pick(set.skin);
    if (all) L.blush = true;
    var out = { look: L, outfit: o || { top: { id: 'lilac-hoodie', sw: 1 }, bottom: { id: 'straight-jeans', sw: 0 }, shoes: { id: 'canvas-high-tops', sw: 0 } } };
    if (all || only === 'hair') { out.outfit.hair = pick(LISTS.hair.shapes); out.outfit.shade = Math.random() < .08 ? pick(GREY) : pick(set.shade); }
    return out;
  }
  SS.openCreator = function (G) {
    if (G.away || G.gig) { G.toast('MAKE PEOPLE AT HOME', 1600, 'The Creator opens from People at home.'); return; }
    G.bubble = null; if (G.cancelHold) G.cancelHold(false); G.deselect();
    var p = { look: { face: 'oval', eyes: 'almond', eye: 1, nose: 'button', lips: 'smile', lip: 0, build: 'slim', skin: 8, blush: true },
      outfit: { hair: 'locs', shade: 1, top: { id: 'lilac-hoodie', sw: 1 }, bottom: { id: 'straight-jeans', sw: 0 }, shoes: { id: 'tan-suede-boots', sw: 0 } } };
    G.menu = { kind: 'creator', p: p, tab: 'face', page: 0, face: 0, undo: [], cur: 0 };
  };
  function remember(m) { m.undo.push(JSON.stringify(m.p)); if (m.undo.length > 20) m.undo.shift(); }
  SS.creatorSet = function (G, key, val) {
    var m = G.menu; remember(m);
    if (key === 'hair' || key === 'shade') m.p.outfit[key] = val; else m.p.look[key] = val;
    m.happy = performance.now();
  };
  SS.creatorRandom = function (G, only) {
    var m = G.menu; remember(m);
    var r = randomPerson(only && LISTS[only] ? only : null, only && LISTS[only] ? m.p : null);
    if (only && LISTS[only]) { m.p.look = r.look; if (only === 'hair') { m.p.outfit.hair = r.outfit.hair; m.p.outfit.shade = r.outfit.shade; } }
    else { m.p.look = r.look; m.p.outfit.hair = r.outfit.hair; m.p.outfit.shade = r.outfit.shade; }
    m.happy = performance.now();
  };
  SS.creatorUndo = function (G) { var m = G.menu; if (!m.undo.length) { G.toast('NOTHING TO UNDO', 900); return; } m.p = JSON.parse(m.undo.pop()); };
  // Done: a name, then Style for the new person (bible, Creator)
  SS.creatorDone = function (G, name) {
    var m = G.menu, list = SS.madePeople(G);
    if (name === undefined) {
      var used = list.map(function (q) { return q.name; }), def = NAMES.filter(function (n) { return used.indexOf(n) < 0; })[0] || 'FRIEND';
      name = def;
      if (!navigator.webdriver && window.prompt) { var typed = window.prompt('Name this person', def.charAt(0) + def.slice(1).toLowerCase()); if (typed === null) return; name = typed; }
    }
    name = String(name).trim().slice(0, 12).toUpperCase() || 'FRIEND';
    var k = 1; while (list.some(function (q) { return q.id === 'p' + k; })) k++;
    var id = 'p' + k;
    list.push({ id: id, name: name, look: m.p.look, home: null, made: Date.now() });
    var S = G.save; (S.style || (S.style = {}))[id] = m.p.outfit;
    G.changed(true);
    SS.openStyle(G, id);
    G.toast('HELLO, ' + name, 1600, 'Now pick what they wear.');
    return id;
  };

  // ---------- drawing ----------
  var TRAY = SS.CREATOR_TRAY = 132;
  var ZOOM = { face: 1, eyes: 1, nose: 1, lips: 1 };
  // a card's picture: the person with that one choice, cropped to the part
  function crop(G, m, key, val, x, y, w, h) {
    var L = JSON.parse(JSON.stringify(m.p.look)), o = JSON.parse(JSON.stringify(m.p.outfit));
    if (key === 'hair') o.hair = val; else L[key] = val;
    var H = SS.HAIR_SHADES[o.shade || 0], img = SS.figureRaw(L, o, H, 0, 0);
    var win = { face: [9, 4, 34, 36], eyes: [13, 18, 26, 10], nose: [17, 23, 16, 12], lips: [15, 29, 20, 9], hair: [3, 0, 46, 58], build: [0, 34, 52, 72] }[key];
    var k = Math.min(w / win[2], h / win[3]); k = k >= 2 ? Math.floor(k) : k >= 1 ? 1 : k;
    var dw = Math.round(win[2] * k), dh = Math.round(win[3] * k);
    G.c.imageSmoothingEnabled = k < 1;
    G.c.drawImage(img, win[0], win[1], win[2], win[3], Math.round(x + (w - dw) / 2), Math.round(y + (h - dh) / 2), dw, dh);
    G.c.imageSmoothingEnabled = false;
  }
  SS.drawCreator = function (G, W, H) {
    var c = G.c, m = G.menu, R = SS.R, txt = SS.txt, hit = SS.hit, t = G.t, now = performance.now(), trayTop = H - TRAY;
    hit(G, 0, 0, W, H, function () {}, { block: true });
    SS.styleBackdrop(c, W, 0, trayTop, t);
    // the person (zoomed in on the head for the face tabs)
    var img = SS.figure(G, 'draft', m.face, t), F = SS.FIG_SIZE, fl = trayTop - 34, hop = m.happy && now - m.happy < 380 ? Math.round(Math.sin((now - m.happy) / 380 * Math.PI) * 3) : 0;
    if (ZOOM[m.tab] && m.face !== 2) {
      var z = 3, hx = Math.round(W / 2 - 26 * z), hy = Math.max(46, Math.round(trayTop - 20 - 46 * z));
      c.save(); c.beginPath(); c.rect(0, 40, W, trayTop - 40); c.clip();
      if (m.face === 3) { c.translate(hx + F[0] * z, hy - hop); c.scale(-1, 1); c.drawImage(img, 0, 0, F[0], 50, 0, 0, F[0] * z, 50 * z); }
      else c.drawImage(img, 0, 0, F[0], 50, hx, hy - hop, F[0] * z, 50 * z);
      c.restore();
      m.fig = { x: hx, y: hy, w: F[0] * z, h: 50 * z };
    } else {
      var fx = Math.round(W / 2 - F[0] / 2), fy = fl + 22 - F[1] + 4 - hop;
      if (m.face === 3) { c.save(); c.translate(fx + F[0], fy); c.scale(-1, 1); c.drawImage(img, 0, 0); c.restore(); } else c.drawImage(img, fx, fy);
      m.fig = { x: fx, y: fy, w: F[0], h: F[1] };
    }
    var ay = trayTop - 70;
    SS.chip(8, ay, '‹', 22); hit(G, 2, ay - 6, 34, 26, function () { m.face = (m.face + 3) % 4; });
    SS.chip(W - 30, ay, '›', 22); hit(G, W - 36, ay - 6, 34, 26, function () { m.face = (m.face + 1) % 4; });
    SS.drawTopBar(G, W);
    var nw = 84; R(W / 2 - nw / 2, 26, nw, 15, '#fff6ea'); R(W / 2 - nw / 2, 40, nw, 1, P.trayEdge); txt('NEW PERSON', W / 2, 30, P.ink, 7, 'center');
    // ---------- the tray ----------
    var y = trayTop; R(0, y - 2, W, 2, 'rgba(59,36,48,.25)'); R(0, y, W, TRAY, P.tray); R(0, y, W, 1, '#fffaf3');
    var tw = (W - 8) / TABS.length;
    TABS.forEach(function (tb, i) {
      var tx = 4 + i * tw, on = tb === m.tab;
      R(tx + 1, y + 4, tw - 2, 12, on ? P.rose : '#fbeedd'); R(tx + 1, y + 15, tw - 2, 1, on ? P.roseSh : P.trayEdge);
      txt(tb.toUpperCase(), tx + tw / 2, y + 7, on ? '#fff' : P.ink, 4, 'center');
      hit(G, tx, y + 2, tw, 16, function () { m.tab = tb; m.page = 0; m.cur = 0; });
    });
    var L = LISTS[m.tab], cy = y + 20;
    if (!L) {
      txt(m.tab === 'age' ? 'AGE AND GENDER' : 'MORE: THE EXTRAS', 6, cy + 2, P.ink, 6);
      SS.vt(m.tab === 'age' ? 'Kid, teen, adult and elder, and pronouns,' : 'Makeup, beards, glasses, piercings, tattoos', 8, cy + 16, P.ink, 12);
      SS.vt(m.tab === 'age' ? 'come in the next Creator part.' : 'and birthmarks come in the next Creator part.', 8, cy + 28, P.soft, 12);
    } else {
      var cur = L.key ? (L.key === 'hair' ? m.p.outfit.hair : m.p.look[L.key]) : null;
      txt(m.tab === 'skin' ? 'SKIN' : m.tab.toUpperCase(), 6, cy + 1, P.ink, 6);
      txt(L.shapes.length ? L.shapes.length + ' SHAPES' : SS.SKINS.length + ' TONES', W - 6, cy + 1, P.soft, 5, 'right');
      var pages = Math.max(1, Math.ceil(L.shapes.length / 8)); if (m.page >= pages) m.page = pages - 1;
      if (pages > 1) { txt('‹ ' + (m.page + 1) + '/' + pages + ' ›', W - 60, cy + 1, P.ink, 5, 'center'); hit(G, W - 84, cy - 3, 48, 12, function () { m.page = (m.page + 1) % pages; }); }
      L.shapes.slice(m.page * 8, m.page * 8 + 8).forEach(function (sh, j) {
        var sx = 4 + (j % 4) * 58.5, sy = cy + 10 + Math.floor(j / 4) * 28, on = sh === cur, idx = m.page * 8 + j;
        R(sx, sy, 55, 26, on ? '#fde3ea' : (m.focus && m.cur === idx ? P.blush : '#fbeedd')); R(sx, sy + 25, 55, 1, P.trayEdge);
        c.save(); c.beginPath(); c.rect(sx + 1, sy + 1, 53, 24); c.clip();
        crop(G, m, L.key, sh, sx + 2, sy + 1, 30, 24); c.restore();
        txt(L.names ? L.names[L.shapes.indexOf(sh)] : SS.SHORT_HAIR[sh], sx + 43, sy + 10, P.ink, 4, 'center');
        if (on) { c.strokeStyle = P.rose; c.lineWidth = 2; c.strokeRect(sx + 1, sy + 1, 53, 24); c.lineWidth = 1; }
        if (m.focus && m.cur === idx) { c.strokeStyle = P.ink; c.strokeRect(sx + .5, sy + .5, 54, 25); }
        hit(G, sx, sy, 55, 26, function () { m.cur = idx; SS.creatorSet(G, L.key, sh); });
      });
      if (L.colors) {
        var cols = L.colors(), big = m.tab === 'skin', rowY = big ? cy + 12 : cy + 68, per = big ? 8 : cols.length, sw = Math.min(big ? 27 : 24, Math.floor((W - (big ? 12 : 46)) / per));
        var val = L.color === 'shade' ? (m.p.outfit.shade || 0) : (m.p.look[L.color] || 0);
        if (!big) txt('COLOR', 6, rowY + 3, P.soft, 5);
        cols.forEach(function (col, i) {
          var sx = (big ? 6 : 40) + (i % per) * (sw + (big ? 2 : 0)), sy = rowY + Math.floor(i / per) * (big ? 26 : 0), sh2 = big ? 22 : 12;
          R(sx, sy, sw - 2, sh2, '#3b2430'); R(sx + 1, sy + 1, sw - 4, sh2 - 2, col);
          if (big) R(sx + 1, sy + sh2 - 6, sw - 4, 5, SS.SKINS[i][2]);
          if (i === val) { c.strokeStyle = P.rose; c.lineWidth = 2; c.strokeRect(sx - 1, sy - 1, sw, sh2 + 2); c.lineWidth = 1; }
          hit(G, sx - 1, sy - 2, sw, sh2 + 4, function () { SS.creatorSet(G, L.color, i); });
        });
        if (big) SS.vt('Each tone has its own warm shading and blush.', 8, cy + 66, P.soft, 11);
      }
    }
    // Random (hold it to roll just this tab), Undo, Done
    var by = y + TRAY - 20, bw = (W - 16) / 3;
    R(6, by, bw - 2, 14, '#fbeedd'); R(6, by + 13, bw - 2, 1, P.trayEdge); R(10, by + 4, 6, 6, P.ink); R(11, by + 5, 1, 1, '#fff'); R(14, by + 8, 1, 1, '#fff'); txt('RANDOM', 6 + bw / 2 + 5, by + 4, P.ink, 6, 'center');
    hit(G, 6, by - 2, bw - 2, 18, function () { var held = m.downAt && performance.now() - m.downAt > 450; SS.creatorRandom(G, held ? m.tab : null); if (held) G.toast('JUST THE ' + m.tab.toUpperCase(), 800); });
    SS.btn(8 + bw, by, bw - 2, 'UNDO', false); hit(G, 8 + bw, by - 2, bw - 2, 18, function () { SS.creatorUndo(G); });
    SS.btn(10 + bw * 2, by, bw - 2, 'DONE', true); hit(G, 10 + bw * 2, by - 2, bw - 2, 18, function () { SS.creatorDone(G); });
  };
  // buttons: up and down change the tab, left and right move along the shapes, A picks, Select spins, B goes back
  SS.creatorPress = function (G, k) {
    var m = G.menu, L = LISTS[m.tab];
    if (k === 'b' || k === 'start') { G.confirm = { title: 'LEAVE THE CREATOR?', text: 'This person isn\'t saved yet. Tap Done to keep them.', options: ['KEEP GOING', 'LEAVE'], cur: 0, pick: function (i) { if (i === 1) G.menu = null; } }; return; }
    if (k === 'select') { m.face = (m.face + 1) % 4; return; }
    if (k === 'up' || k === 'down') { var i = TABS.indexOf(m.tab); m.tab = TABS[(i + (k === 'down' ? 1 : TABS.length - 1)) % TABS.length]; m.cur = 0; m.page = 0; m.focus = true; return; }
    var n = L ? (L.shapes.length || L.colors().length) : 0;
    if (k === 'left') { m.focus = true; m.cur = Math.max(0, m.cur - 1); }
    if (k === 'right') { m.focus = true; m.cur = Math.min(Math.max(0, n - 1), m.cur + 1); }
    if (L && L.shapes.length) m.page = Math.floor(m.cur / 8);
    if (k === 'a' && L) { if (L.shapes.length) SS.creatorSet(G, L.key, L.shapes[m.cur]); else SS.creatorSet(G, L.color, m.cur); }
  };
})();
// the People list (Start menu): Sarah, Keegan and the people she's made, each opening Style, and New person (spec 003, part A)
(function () {
  var P = SS.P;
  function rows(G) { return SS.styleWho(G).concat(['new']); }
  SS.openPeople = function (G) { G.menu = { kind: 'people', cur: 0 }; };
  function pickRow(G, i) { var r = rows(G)[i]; if (r === 'new') SS.openCreator(G); else SS.openStyle(G, r); }
  SS.peoplePress = function (G, k) {
    var m = G.menu, n = rows(G).length;
    if (k === 'up') m.cur = (m.cur + n - 1) % n; if (k === 'down') m.cur = (m.cur + 1) % n;
    if (k === 'a') pickRow(G, m.cur); if (k === 'b') G.menu = { kind: 'start', cur: 1 }; if (k === 'start') G.menu = null;
  };
  SS.drawPeople = function (G, W, H) {
    var c = G.c, m = G.menu, R = SS.R, txt = SS.txt, hit = SS.hit, list = rows(G);
    R(0, 0, W, H, 'rgba(34,18,28,.62)'); hit(G, 0, 0, W, H, function () { G.menu = null; });
    var per = H < 300 ? 5 : 6, top = Math.floor(Math.min(m.cur, list.length - 2) / per) * per, shown = list.slice(top, top + per);
    var w = 204, rh = 28, h = 24 + shown.length * rh + 22, x = (W - w) / 2, y = Math.max(4, Math.round((H - h) / 2) - 6);
    SS.frame(x, y, w, h); SS.header(x, y, w, 'PEOPLE', G.mode === 'life' ? 'LIFE' : 'SANDBOX');
    hit(G, x, y, w, h, function () {}, { block: true });
    shown.forEach(function (who, j) {
      var i = top + j, cx = x + 6, cy = y + 23 + j * rh, on = m.cur === i;
      if (who === 'new') { SS.addButton(cx, cy + 3, w - 12, 'NEW PERSON'); hit(G, cx, cy, w - 12, rh - 3, function () { m.cur = i; pickRow(G, i); }); return; }
      R(cx, cy, w - 12, rh - 3, on ? P.blush : P.cell); R(cx, cy + rh - 4, w - 12, 1, P.trayEdge); if (on) R(cx, cy, 2, rh - 3, P.rose);
      // their face, from the mirror figure
      var img = SS.figure(G, who, 0, 0); c.drawImage(img, 13, 8, 26, 22, cx + 4, cy + 1, 26, 22);
      txt(SS.personName(G, who), cx + 36, cy + 5, P.ink, 7);
      txt(who === 'sarah' || who === 'keegan' ? 'LIVES HERE · STYLE' : 'MADE BY YOU · STYLE', cx + 36, cy + 15, P.soft, 5);
      SS.chev(cx + w - 22, cy + 8, on ? P.rose : P.soft);
      hit(G, cx, cy, w - 12, rh - 3, function () { m.cur = i; pickRow(G, i); });
    });
    SS.backHint(x + 8, y + h - 16); hit(G, x + 4, y + h - 18, 60, 16, function () { G.menu = { kind: 'start', cur: 1 }; });
  };
})();
