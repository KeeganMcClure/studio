// Sarah's Sim: idle Sarah and her phone (spec 006, part D).
//   - Idle Sarah: the game opens with Sarah in the middle of something from the time of day's pool (private data; a generic
//     placeholder in the repo). As soon as she taps anything, Sarah stops and is hers to play.
//   - Her phone is always about to die (Keegan, Nov 25): its battery runs down while she scrolls, only while the game is open.
//     When it's low, a red low-battery icon pops over her head and she holds the phone up in despair. Tapping her shows Charge,
//     and she goes looking for the charger, which is never where she left it: under a couch cushion, in the bed sheets, or
//     under Ralph, from a pool that doesn't repeat until it's used up (saved). Finding it is a tap on the right spot; a bouncing
//     question mark floats over every spot it could be, and a wrong guess loses its mark. A dead phone only means no calls or photos until it's charged; nothing else is lost.
(function () {
  var DRAIN = 1 / (15 * 60), CHARGE = 1 / (3 * 60);   // a full battery lasts about 15 minutes of scrolling; charging takes about 3
  SS.phoneOf = function (G) { var S = G.save; if (S.phone === undefined) S.phone = .6; return S.phone; };
  var HIDES = [
    { key: 'cushion', where: 'under a couch cushion', use: 'sofa' },
    { key: 'sheets', where: 'in the bed sheets', use: 'bed' },
    { key: 'ralph', where: 'under Ralph', cat: 'ralph' }
  ];
  function pickHide(G) {
    var S = G.save; S.shown = S.shown || {}; var sh = S.shown.charger || (S.shown.charger = []);
    var ok = HIDES.filter(function (h) { return h.cat || G.W.pieces.some(function (p) { return G.W.def(p).use === h.use; }); });
    var left = ok.filter(function (h) { return sh.indexOf(h.key) < 0; }); if (!left.length) { sh.length = 0; left = ok.slice(); }
    var h = left[Math.floor(Math.random() * left.length)]; sh.push(h.key); return h;
  }
  // the idle activity she's in when Life opens
  SS.startSarahIdle = function (G) {
    if (G.mode !== 'life') return;
    var d = SS.now(), h = d.getHours(), part = h >= 6 && h < 11 ? 'morning' : h >= 11 && h < 17 ? 'daytime' : h >= 17 && h < 22 ? 'evening' : 'lateNight';
    var pool = (((window.SS_PRIVATE || {}).sarahIdle || {})[part]) || [];
    if (!pool.length) return;
    var S = G.save; S.shown = S.shown || {}; var key = 'sarah.' + part, sh = S.shown[key] || (S.shown[key] = []);
    var left = pool.filter(function (x) { return sh.indexOf(x.text) < 0; }); if (!left.length) { sh.length = 0; left = pool.slice(); }
    var act = left[Math.floor(Math.random() * left.length)]; sh.push(act.text);
    var W = G.W, s = G.people.sarah, ps = W.pieces.filter(function (p) { return W.def(p).use === act.at && W.useTiles(p).length; });
    var p = ps[0]; if (!p) return;
    var ut = W.useTiles(p)[0]; s.f = W.floorOf(p); s.x = ut[0] + .5; s.y = ut[1] + .5; s.path = [];
    var d2 = W.def(p); if (d2.seat && act.at !== 'easel' && act.at !== 'bookshelf') SS.seatSarah(G, p, d2.use === 'bed' ? 'lie' : 'sit');
    if (act.at === 'easel') p.work = true;
    G.idle = { text: act.text, phone: !!act.phone, piece: p.uid };
    G.setFloor(s.f);
  };
  SS.stopSarahIdle = function (G) { if (!G.idle) return; var p = G.W.byUid[G.idle.piece]; if (p) p.work = false; G.idle = null; G.people.sarah.extra = null; };
  SS.tickPhone = function (G, dt) {
    if (G.mode !== 'life') return;
    var s = G.people.sarah, S = G.save;
    SS.phoneOf(G);
    if (G.charging) { S.phone = Math.min(1, S.phone + CHARGE * dt); if (S.phone >= 1) { G.charging = false; s.bubble = { icon: 'heart', until: performance.now() + 2000 }; G.toast('PHONE CHARGED', 1600); } }
    else if (G.idle && G.idle.phone) S.phone = Math.max(0, S.phone - DRAIN * dt);
    var low = S.phone < .2;
    // scrolling on her phone, and the low-battery despair
    s.extra = G.idle && G.idle.phone ? function (c, p) {
      var x = Math.round(p[0] + (s.flip ? -6 : 3)), y = Math.round(p[1] - (s.pose === 'sit' ? 20 : 24) - (low ? 6 : 0));
      c.fillStyle = '#3b2430'; c.fillRect(x, y, 4, 6); c.fillStyle = low ? '#5a4650' : '#a9c9e8'; c.fillRect(x + 1, y + 1, 2, 4);
      if (low && Math.floor(performance.now() / 400) % 2) { var bx = Math.round(p[0] - 4), by = Math.round(p[1] - 54); c.fillStyle = '#fff6ea'; c.fillRect(bx - 2, by - 2, 14, 9); c.fillStyle = '#d2363c'; c.fillRect(bx, by, 8, 5); c.fillRect(bx + 8, by + 1, 1, 3); c.fillStyle = '#fff6ea'; c.fillRect(bx + 2, by + 1, 5, 3); c.fillStyle = '#d2363c'; c.fillRect(bx + 1, by + 1, 1, 3); }
    } : (G.charging ? function (c, p) { var x = Math.round(p[0] - 4), y = Math.round(p[1] - 50); c.fillStyle = '#3b2430'; c.fillRect(x, y, 9, 5); c.fillStyle = '#8cc06a'; c.fillRect(x + 1, y + 1, Math.round(7 * S.phone), 3); c.fillRect(x + 9, y + 1, 1, 3); } : (G.act ? s.extra : null));
  };
  // Charge: the hunt for the charger
  // every place the charger could be in this home: each sofa (its cushions), each bed (its sheets), and Ralph
  function spotsOf(G) {
    var W = G.W, out = [];
    W.pieces.forEach(function (p) { var u = W.def(p).use; HIDES.forEach(function (h) { if (h.use && h.use === u) out.push({ key: 'p' + p.uid, hide: h, piece: p }); }); });
    HIDES.forEach(function (h) { if (h.cat && G.cats[h.cat]) out.push({ key: 'cat:' + h.cat, hide: h, agent: G.cats[h.cat] }); });
    return out;
  }
  function spotOfPick(G, pick) {
    if (!pick) return null;
    var key = pick.agent ? 'cat:' + pick.agent.who : pick.piece ? 'p' + pick.piece.uid : null;
    return spotsOf(G).filter(function (sp) { return sp.key === key; })[0] || null;
  }
  SS.startHunt = function (G) {
    SS.stopSarahIdle(G);
    var h = pickHide(G), S = G.save;
    var spots = spotsOf(G).filter(function (sp) { return sp.hide === h; });   // which cushion, which sheets: one real spot
    var at = spots[Math.floor(Math.random() * spots.length)];
    G.hunt = { hide: h, spot: at ? at.key : null, gone: [] };
    S.huntedOnce = true;
    G.toast('WHERE\'S THE CHARGER?', 2400, 'Tap a question mark to look there. Tap the floor to stop.');
  };
  // during a hunt, does this tap land on a place the charger could be? Only those taps count as guesses
  SS.huntSpot = function (G, pick) { return !!spotOfPick(G, pick); };
  // a guess: the right spot finds it; a wrong one gets a sigh and loses its question mark. Returns true when the hunt is over
  SS.huntTap = function (G, pick) {
    var sp = spotOfPick(G, pick), h = G.hunt.hide;
    if (!sp || sp.key !== G.hunt.spot) {
      if (sp && G.hunt.gone.indexOf(sp.key) < 0) G.hunt.gone.push(sp.key);
      G.toast('NOT THERE', 900, 'She looks, and sighs.'); G.people.sarah.bubble = { icon: 'dots', until: performance.now() + 1200 }; return false;
    }
    G.hunt = null; G.charging = true;
    G.people.sarah.bubble = { icon: '!', until: performance.now() + 1500 };
    G.toast('FOUND IT!', 1800, 'It was ' + h.where + '. Her phone is charging.');
    G.changed(true);
    return true;
  };
  // the bouncing question marks: one over every spot still in the running, only while she's looking (spec 006, Hiding spots show)
  SS.huntMarks = function (G) {
    if (!G.hunt) return [];
    var W = G.W;
    return spotsOf(G).filter(function (sp) { return G.hunt.gone.indexOf(sp.key) < 0; }).map(function (sp) {
      return { key: sp.key, f: sp.agent ? sp.agent.f : W.floorOf(sp.piece), agent: sp.agent, piece: sp.piece };
    });
  };
})();
