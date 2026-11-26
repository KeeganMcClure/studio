// Sarah's Sim needs (spec 006, part C). People have three soft needs: energy (moon), hunger (bowl) and fun (star).
//   - Each goes down slowly only while the game is open: full to low in about 40 minutes of play (Claude default). Nothing
//     drains while she's away (bible, Away from the game).
//   - Actions fill them (spec 006, part B's table). Below a quarter Sarah yawns, sighs or her tummy rumbles, and actions take
//     a little longer. That's all: no need can hurt her, stop her or end anything (pillar 3).
//   - Tapping Sarah shows her three meters, each with its icon and word (studio-bible/ui.md, color is never the only label);
//     tapping Keegan shows his beside his bubble. Hidden the rest of the time. Keegan looks after his own (idle life).
//   - Sandbox has no needs (bible, Modes).
// Meters drawn as in the approved mockups/cooking-v1 ('bubble' state).
(function () {
  var LOW = .25, RATE = .75 / (40 * 60);   // from full to low in about 40 minutes of play
  var KEYS = ['energy', 'hunger', 'fun'];
  SS.NEED_KEYS = KEYS;
  SS.needsOf = function (G, who) {
    var S = G.save; if (!S.needs) S.needs = { sarah: { energy: .8, hunger: .7, fun: .75 }, keegan: { energy: .85, hunger: .75, fun: .8 } };
    return S.needs[who];
  };
  SS.lowNeed = function (G, who) { if (G.mode !== 'life') return null; var n = SS.needsOf(G, who); var low = KEYS.filter(function (k) { return n[k] < LOW; }); return low.length ? low.sort(function (a, b) { return n[a] - n[b]; })[0] : null; };
  SS.fillNeeds = function (G, who, fill, k) { if (G.mode !== 'life' || !fill) return; var n = SS.needsOf(G, who); KEYS.forEach(function (key) { if (fill[key]) n[key] = Math.max(0, Math.min(1, n[key] + fill[key] * k)); }); };
  var nudgeIn = 20, saveIn = 15;
  SS.tickNeeds = function (G, dt) {
    if (G.mode !== 'life') return;
    var s = SS.needsOf(G, 'sarah'), kn = SS.needsOf(G, 'keegan');
    KEYS.forEach(function (k) { s[k] = Math.max(0, s[k] - RATE * dt); kn[k] = Math.max(0, kn[k] - RATE * dt); if (kn[k] < .45) kn[k] = Math.min(1, kn[k] + RATE * 4 * dt); });
    // a low need only shows: a yawn, a sigh or a rumbling tummy now and then while she's idle
    nudgeIn -= dt;
    var low = SS.lowNeed(G, 'sarah'), sa = G.people.sarah;
    if (low && nudgeIn <= 0 && !G.act && !sa.path.length) { sa.bubble = { icon: low === 'energy' ? 'yawn' : low === 'hunger' ? 'rumble' : 'dots', until: performance.now() + 2200 }; nudgeIn = 25 + Math.random() * 15; }
    saveIn -= dt; if (saveIn <= 0) { saveIn = 15; G.changed(true); }
  };
  // the meters card (cooking-v1): name, then each need with its icon, its word and a bar
  SS.drawMeters = function (G, x, y, who) {
    var c = G.c, P = SS.P, R = SS.R, n = SS.needsOf(G, who);
    SS.card(x, y, 88, 62, P.sage[1]);
    SS.txt(who.toUpperCase(), x + 6, y + 5, P.ink, 6);
    var icons = [
      function (ix, iy) { c.fillStyle = '#8fa6d8'; c.beginPath(); c.arc(ix + 4.5, iy + 4.5, 4.5, 0, 7); c.fill(); c.fillStyle = P.tray; c.beginPath(); c.arc(ix + 6.5, iy + 3, 3.8, 0, 7); c.fill(); },
      function (ix, iy) { R(ix, iy + 4, 9, 1, '#6b4250'); R(ix + 1, iy + 5, 7, 2, '#e46f6a'); R(ix + 2, iy + 7, 5, 1, '#b44f63'); R(ix + 2, iy + 2, 5, 2, '#f3d38a'); R(ix + 3, iy, 1, 2, 'rgba(160,140,140,.6)'); R(ix + 5, iy - 1, 1, 2, 'rgba(160,140,140,.6)'); },
      function (ix, iy) { var cx = ix + 4.5, cy = iy + 4.5; c.fillStyle = '#e7a43a'; c.beginPath(); for (var p = 0; p < 10; p++) { var r = p % 2 ? 2.2 : 5, a = -Math.PI / 2 + p * Math.PI / 5; c.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); } c.closePath(); c.fill(); c.fillStyle = '#ffd56b'; c.beginPath(); c.arc(cx - .5, cy - .3, 2, 0, 7); c.fill(); }
    ];
    ['ENERGY', 'HUNGER', 'FUN'].forEach(function (word, i) {
      var yy = y + 17 + i * 14, v = n[KEYS[i]];
      icons[i](x + 6, yy);
      SS.vt(word, x + 18, yy - 2, P.ink, 11);
      R(x + 50, yy + 1, 33, 7, '#3b2430'); R(x + 51, yy + 2, 31, 5, '#e8dccd');
      R(x + 51, yy + 2, Math.round(31 * v), 5, v < LOW ? '#f2a65a' : '#8cc06a'); R(x + 51, yy + 2, Math.round(31 * v), 1, v < LOW ? '#ffd0a0' : '#c4e39a');
      if (v < LOW) SS.vt('LOW', x + 82, yy + 6, P.soft, 9, 'right');
    });
    SS.hit(G, x, y, 88, 62, function () { G.meters = null; });
  };
})();
