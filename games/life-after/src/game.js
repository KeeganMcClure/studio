// Life After: the title, a new world, the survivor builder, the party card, saves and the save code (spec 001),
// and the town: two sections, the clock, day and night, searching and locks (spec 002, part B). window.LAG.
(function () {
  var P = LA.P, R = LA.R, D = LAD, U = LAU;
  var F8 = U.F8, F16 = U.F16, F12 = U.F12;
  var cv = document.getElementById('cv'), g = cv.getContext('2d'), screenEl = document.getElementById('screen');
  var ovl = document.getElementById('ovl');
  U.g = g;

  // ================= saves (studio-bible/saves.md; spec 001, 8) =================
  var VERSION = 2;
  var key = function (k) { return Studio.savePrefix('la.') + k; };   // dev.la.* on the Dev shelf
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(key(k)); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(key(k), JSON.stringify(v)); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem(key(k)); } catch (e) {} }
  };
  // Upgrade steps: STEPS_UP[n] turns a version n - 1 save into version n. Old steps never change.
  // Version 1 is the first. Parts C and D add their steps here.
  var STEPS_UP = {
    // 2 (part B, the town): the stand-in room is gone. The town is built from the seed and the survivor wakes as on day 1.
    2: function (o) {
      var run = o.run;
      if (run) {
        run.v = 2; delete run.map; run.town = null; run.clock = { day: 1, min: 7 * 60 }; run.season = run.startSeason;
        // the job's flashlight comes with batteries in it
        if (run.surv && run.surv.bag) run.surv.bag.items.forEach(function (it) { if (it.id === 'flashlight' && it.charge == null) it.charge = 480; });
      }
      return { run: run, record: o.record };
    }
  };
  function openSaves() {
    var v = store.get('version', null);
    if (v == null) { store.set('version', VERSION); return; }
    if (v < VERSION) {
      // back up first, then run each step above the stored version, in order
      store.set('backup.v' + v, { version: v, run: store.get('run', null), record: store.get('record', null) });
      var run = store.get('run', null), rec = store.get('record', null);
      for (var n = v + 1; n <= VERSION; n++) if (STEPS_UP[n]) { var o = STEPS_UP[n]({ run: run, record: rec }); run = o.run; rec = o.record; }
      if (run) store.set('run', run);
      if (rec) store.set('record', rec);
      store.set('version', VERSION);
    }
  }
  function newRecord() { return { gentle: [], standard: [], harsh: [] }; }
  var S = { scr: 'title', run: null };
  function save() { if (S.run) { S.run.dice = S.dice ? S.dice.save() : S.run.dice; if (S.run.town) packSeen(); store.set('run', S.run); } store.set('version', VERSION); }

  // The save code (spec 001, 9): the version, the world and the best runs as one line of text
  function exportCode() { return StudioCode.make('LA1', { version: store.get('version', VERSION), run: store.get('run', null), record: store.get('record', null) }); }
  function readCode(text) {
    var o = StudioCode.read('LA1', text);
    if (!o || typeof o.version !== 'number' || o.version < 1 || o.version > VERSION) return null;
    if (o.run != null && (typeof o.run !== 'object' || !o.run.surv || !o.run.seed && o.run.seed !== 0)) return null;
    return o;
  }
  function applyCode(o) {
    if (o.run) store.set('run', o.run); else store.del('run');
    store.set('record', o.record || newRecord());
    store.set('version', o.version);
    openSaves();
    S.run = store.get('run', null);
    S.dice = S.run ? StudioSeed.load(S.run.dice) : null;
  }

  // ================= screen size, drawing loop and input =================
  var fitInfo = null;
  function resize() {
    var f = StudioMove.fit(screenEl, cv);
    if (!f) return;
    fitInfo = f; U.W = f.w; U.H = f.h; g.imageSmoothingEnabled = false;
    titleCache = null;
  }
  window.addEventListener('resize', resize);

  var screens = {};
  function go(name, arg) { S.scr = name; if (screens[name].enter) screens[name].enter(arg); }

  var clock = StudioClock.make();
  function frame(now) {
    var n = clock.ticks(now);
    if (!fitInfo) resize();
    if (fitInfo) {
      for (var i = 0; i < n; i++) if (screens[S.scr].tick) screens[S.scr].tick();
      U.clearHits();
      g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1;
      screens[S.scr].draw(now);
      if (S.ask) U.drawAsk(S.ask);
      U.drawToast(now);
    }
    requestAnimationFrame(frame);
  }

  function press(k) {
    if (ovl.classList.contains('on')) return;
    if (S.ask) { U.askPress(S.ask, k); return; }
    var sc = screens[S.scr];
    if (sc.press) sc.press(k);
  }
  cv.addEventListener('pointerdown', function (e) {
    if (!fitInfo || ovl.classList.contains('on')) return;
    var r = cv.getBoundingClientRect();
    U.tap((e.clientX - r.left) * U.W / r.width, (e.clientY - r.top) * U.H / r.height);
  });

  // a yes / no question; the cursor starts on Not yet (play.md: No accidental point of no return)
  function ask(text, yes, yesLabel, noLabel, noFirst) {
    S.ask = { text: text, sel: noFirst === false ? 0 : 1, choices: [
      { label: yesLabel || 'Yes', run: function () { S.ask = null; yes(); } },
      { label: noLabel || 'Not yet', no: true, run: function () { S.ask = null; } }
    ] };
  }

  // ---- typing: a cardboard card with a text field, over the screen (the phone keyboard) ----
  function typeIn(o) {
    // o: {title, text, value, area, ph, ok(label), done(value) -> error text or '', readonly, copy}
    ovl.innerHTML = '';
    var cb = document.createElement('div'); cb.className = 'cb';
    var h = document.createElement('h2'); h.textContent = o.title; cb.appendChild(h);
    if (o.text) { var p = document.createElement('p'); p.textContent = o.text; cb.appendChild(p); }
    var f = document.createElement(o.area ? 'textarea' : 'input');
    if (!o.area) { f.type = o.numeric ? 'text' : 'text'; if (o.numeric) f.inputMode = 'numeric'; f.maxLength = o.max || 14; f.autocapitalize = 'words'; }
    f.spellcheck = false; f.autocomplete = 'off'; f.value = o.value || ''; if (o.ph) f.placeholder = o.ph; if (o.readonly) f.readOnly = true;
    cb.appendChild(f);
    var err = document.createElement('p'); err.className = 'err'; cb.appendChild(err);
    var bt = document.createElement('div'); bt.className = 'bt'; cb.appendChild(bt);
    function close() { ovl.classList.remove('on'); ovl.innerHTML = ''; }
    function ok() { var e = o.done ? o.done(f.value) : ''; if (e) err.textContent = e; else close(); }
    function btn(label, fn, cls) { var b = document.createElement('button'); b.textContent = label; if (cls) b.className = cls; b.onclick = fn; bt.appendChild(b); return b; }
    if (o.copy) btn('Copy', function () {
      f.select(); var done = function () { err.textContent = 'Copied.'; };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(f.value).then(done, function () { try { document.execCommand('copy'); done(); } catch (e) {} });
      else { try { document.execCommand('copy'); done(); } catch (e) {} }
    }, 'go');
    if (!o.readonly) btn(o.ok || 'OK', ok, 'go');
    btn(o.readonly ? 'Close' : 'Cancel', close);
    f.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !o.area) { e.preventDefault(); ok(); } if (e.key === 'Escape') { e.preventDefault(); close(); } });
    ovl.appendChild(cb); ovl.classList.add('on');
    if (!o.readonly) setTimeout(function () { f.focus(); }, 30);
    LAG._ovl = { field: f, ok: ok, close: close };
  }

  // ================= survivor drawing (cached) =================
  var cache = {};
  function lookKey(sv, extra) { return JSON.stringify([sv.looks, sv.job, extra]); }
  function dressOf(sv) { var j = D.job(sv.job); return LA.dress(sv.looks, j ? j.outfit : 'coverall'); }
  function portraitOf(sv, mood) {
    var k = 'p' + lookKey(sv, mood);
    return cache[k] || (cache[k] = LA.portrait(Object.assign({ mood: mood || 'ok' }, dressOf(sv))));
  }
  function spriteOf(sv, face, step) {
    var k = 's' + lookKey(sv, [face, step]);
    if (cache[k]) return cache[k];
    var c = LA.person(Object.assign({ face: face === 'left' ? 'right' : face === 'up' ? 'up' : face === 'down' ? 'down' : 'right', step: step }, dressOf(sv)));
    if (face === 'left') { var m = document.createElement('canvas'); m.width = c.width; m.height = c.height; var mg = m.getContext('2d'); mg.translate(c.width, 0); mg.scale(-1, 1); mg.drawImage(c, 0, 0); c = m; }
    return (cache[k] = c);
  }
  function moodOf(n) { return n.sleep < 30 ? 'tired' : n.health < 50 ? 'hurt' : n.san < 30 ? 'scared' : 'ok'; }

  // ================= the survivor builder's working copy =================
  var B = null;      // the draft survivor
  var W0 = null;     // the new world's settings: {preset, season, seed, typed}
  var rs = null;     // the builder's dice: made from the world seed, so the same seed and choices give the same survivor
  function blankLooks() { return { body: 1, skin: 1, face: 0, hairStyle: 0, hairColor: 1, colors: 0, age: 0 }; }
  function blank() { return { template: null, name: '', job: null, free: {}, good: [], bad: [], want: null, looks: blankLooks() }; }
  function pick(a) { return a[rs.int(a.length)]; }
  function freeLeft() { var n = 0; for (var k in B.free) n += B.free[k]; return D.FREE - n; }
  function skills() { return D.skillsOf(B.job, B.looks.age, B.free); }
  function useTemplate(t) {
    B = { template: t.name, name: t.name, job: t.job, free: {}, good: t.good.slice(), bad: t.bad.slice(), want: t.want, looks: Object.assign({}, t.looks) };
  }
  // free points that no longer fit (after a job or age change) are handed back
  function trimFree() {
    var base = D.skillsOf(B.job, B.looks.age, {});
    for (var k in B.free) { var cap = D.skillCap(B.job, B.looks.age, k); B.free[k] = Math.max(0, Math.min(B.free[k], cap - base[k])); if (!B.free[k]) delete B.free[k]; }
  }
  function randomFree() {
    B.free = {};
    for (var tries = 0; freeLeft() > 0 && tries < 200; tries++) {
      var k = pick(D.SKILLS).id, s = skills();
      if (s[k] < D.skillCap(B.job, B.looks.age, k)) B.free[k] = (B.free[k] || 0) + 1;
    }
  }
  function randomTraits() {
    // a balanced set, the way companions get one: 0 to 2 good traits, then bad ones until bad points cover them
    for (var tries = 0; tries < 100; tries++) {
      var good = [], bad = [], ng = rs.int(3);
      while (good.length < ng) { var t = pick(D.GOOD).id; if (good.indexOf(t) < 0) good.push(t); }
      var need = D.traitSum(good);
      for (var guard = 0; D.traitSum(bad) < need && guard < 20; guard++) { var b = pick(D.BAD).id; if (bad.indexOf(b) < 0) bad.push(b); }
      if (!ng && rs.int(2)) bad.push(pick(D.BAD).id);
      bad = bad.filter(function (x, i) { return bad.indexOf(x) === i; });
      if (!D.traitProblem(good, bad)) { B.good = good; B.bad = bad; return; }
    }
    B.good = []; B.bad = [];
  }
  function randomLooks() { D.LOOK_ROWS.forEach(function (r) { B.looks[r[0]] = rs.int(D.LOOKS[r[0]].length); }); trimFree(); }
  function randomAll() {
    B = blank(); B.name = pick(D.NAMES); B.job = pick(D.JOBS).id; randomLooks(); randomFree(); randomTraits(); B.want = pick(D.WANTS).id;
  }

  // ================= starting a world =================
  function seasonIndex(s) { return D.SEASONS.indexOf(s); }
  function startWorld() {
    var seed = W0.seed, world = StudioSeed.stream(StudioSeed.hash(seed + ':world'));
    if (!B.want) B.want = D.WANTS[world.int(D.WANTS.length)].id;
    var season = W0.season === 'Random' ? D.SEASONS[world.int(4)] : W0.season;
    var j = D.job(B.job), sk = skills(), uses = {};
    D.SKILLS.forEach(function (s) { uses[s.id] = 0; });
    // the bag (Part B fills in the rest): pockets, and a bag from the job worn straight away
    var pockets = 4 + (B.good.indexOf('strongBack') >= 0 ? 2 : 0) - (B.bad.indexOf('badBack') >= 0 ? 2 : 0), worn = null, items = [];
    j.items.forEach(function (it) { if (D.ITEMS[it[0]].bag && !worn) worn = it[0]; else items.push(it[0] === 'flashlight' ? { id: it[0], n: it[1], charge: 480 } : { id: it[0], n: it[1] }); });
    S.run = {
      v: 2, seed: seed, typedSeed: !!W0.typed, preset: W0.preset, seasonPick: W0.season, season: season, startSeason: season,
      clock: { day: 1, min: 7 * 60 },
      surv: {
        name: B.name, job: B.job, template: B.template, skills: sk, uses: uses, free: Object.assign({}, B.free),
        traits: { good: B.good.slice(), bad: B.bad.slice() }, want: B.want, looks: Object.assign({}, B.looks),
        needs: { hunger: 70, health: 100, sleep: 80, san: 70 }, wounds: [],
        bag: { pockets: pockets, worn: worn, items: items }, recipes: j.recipes.slice(), notes: []
      },
      town: null,
      seen: { intro: false }
    };
    S.dice = StudioSeed.stream(StudioSeed.hash(seed + ':dice'));
    newTown();
    save();
    go('map');
  }

  // ================= TITLE (spec 001, 2) =================
  var titleCache = null, titleSt = { sel: 0 };
  function drawTitleScene(now) {
    var W = U.W, H = U.H, dy = Math.min(0, H - 300);
    if (!titleCache) {
      titleCache = document.createElement('canvas'); titleCache.width = 240; titleCache.height = 300;
      var tg = titleCache.getContext('2d'); tg.imageSmoothingEnabled = false;
      LA.street(tg, 240, 300, { night: true, title: true });
    }
    R(g, '#0c0e10', 0, 0, W, H);
    g.drawImage(titleCache, 0, dy);
    // the motel sign flickers: mostly on, with short dropouts; VACANCY stutters on its own
    var t = Math.floor(now / 90), on = (t % 47 === 3 || t % 47 === 5 || t % 61 === 20) ? 0 : 1, vac = (t % 23) > 2 && (t % 37) !== 9;
    LA.streetSign(g, dy, on, vac);
  }
  screens.title = {
    enter: function () { titleSt.sel = 0; },
    items: function () {
      var a = [{ lines: ['New world'], a: function () { if (S.run) ask('There is a world in progress. Starting a new one ends it for good.', newWorld, 'Start a new world'); else newWorld(); } }];
      if (S.run) a.push({ lines: ['Continue'], a: function () { go('map'); } });
      a.push({ lines: ['Best runs'], a: function () { go('best'); } });
      a.push({ lines: ['Import save'], a: importSave });
      // Back to the studio's game shelf, only when the game was opened from it (launcher.md), as in the other games
      if (window.Studio && Studio.fromShelf) a.push({ lines: ['Game shelf'], value: '◀', a: function () { Studio.toShelf(); } });
      return a;
    },
    draw: function (now) {
      var W = U.W, H = U.H;
      drawTitleScene(now);
      // the title on a dark band, as on the cover
      R(g, 'rgba(12,14,16,.86)', 0, 10, W, 30); R(g, '#0c0e10', 0, 39, W, 1);
      g.font = '16px "Press Start 2P"'; g.textBaseline = 'top';
      var tw = g.measureText('LIFE AFTER').width, tx = Math.round((W - tw) / 2);
      g.fillStyle = P.red[3]; g.fillText('LIFE AFTER', tx + 1, 18); g.fillStyle = P.warm; g.fillText('LIFE AFTER', tx, 17);
      var items = this.items(), h = items.length * 23 + 10;
      U.list({ x: 6, y: H - h - 16, w: 122, h: h }, items, titleSt);
      U.help('A pick');
    },
    press: function (k) { U.listPress(k, this.items(), titleSt); }
  };
  function newWorld() { W0 = { preset: 'standard', season: 'Random', seed: (Math.random() * 1e9) | 0, typed: false }; rs = StudioSeed.stream(StudioSeed.hash(W0.seed + ':build')); B = blank(); go('world'); }
  function importSave() {
    typeIn({ title: 'IMPORT SAVE', text: 'Paste a save code.', area: true, ph: 'LA1:…', ok: 'Import', done: function (v) {
      var o = readCode(v);
      if (!o) return "That code didn't work.";
      setTimeout(function () {
        ask('This replaces your current world.', function () { applyCode(o); U.toast('Save imported.'); go(S.run ? 'map' : 'title'); }, 'Replace it');
      }, 0);
      return '';
    } });
  }

  // ================= BEST RUNS =================
  var bestSt = { sel: 0 };
  screens.best = {
    items: function () {
      var rec = store.get('record', null) || newRecord();
      return D.PRESETS.map(function (p) {
        var list = rec[p.id] || [];
        return { title: p.name.toUpperCase(), lines: list.length ? list.slice(0, 5).map(function (r, i) { return (i + 1) + '. ' + r.name + ', ' + r.days + ' days'; }) : ['No runs yet.'] };
      });
    },
    draw: function () {
      R(g, '#101416', 0, 0, U.W, U.H);
      var top = U.header('BEST RUNS');
      U.list({ x: 4, y: top + 4, w: U.W - 8, h: U.H - top - 22 }, this.items(), bestSt);
      U.help('B back');
    },
    press: function (k) { if (k === 'b') go('title'); else U.listPress(k, this.items(), bestSt); }
  };

  // ================= NEW WORLD (spec 001, 3) =================
  var worldSt = { sel: 0 };
  function cyc(arr, cur, d) { var i = arr.indexOf(cur); return arr[(i + d + arr.length) % arr.length]; }
  screens.world = {
    items: function () {
      var pr = D.PRESETS.filter(function (p) { return p.id === W0.preset; })[0];
      return [
        { title: 'DIFFICULTY', value: pr.name, lines: [pr.note], lr: function (d) { W0.preset = cyc(D.PRESETS.map(function (p) { return p.id; }), W0.preset, d); } },
        { title: 'STARTING SEASON', value: W0.season, lines: [W0.season === 'Random' ? 'Picked by the world.' : W0.season === 'Summer' ? 'Gentler.' : W0.season === 'Winter' ? 'Brutal.' : 'In between.'],
          lr: function (d) { W0.season = cyc(D.SEASONS.concat(['Random']), W0.season, d); } },
        { title: 'SEED', value: W0.typed ? String(W0.seed) : 'Random', lines: ['A to type one.'], a: typeSeed, lr: function () { if (W0.typed) { W0.typed = false; W0.seed = (Math.random() * 1e9) | 0; rs = StudioSeed.stream(StudioSeed.hash(W0.seed + ':build')); } else typeSeed(); } },
        { lines: ['Next: your survivor'], red: true, a: function () { toStep(0); } }
      ];
    },
    draw: function () {
      R(g, '#101416', 0, 0, U.W, U.H);
      var top = U.header('NEW WORLD', { l: function () { go('title'); }, r: function () { toStep(0); }, steps: 9, at: 0 });
      U.list({ x: 4, y: top + 4, w: U.W - 8, h: U.H - top - 22 }, this.items(), worldSt);
      U.help('A pick   B back   L/R step');
    },
    press: function (k) {
      if (k === 'b' || k === 'l') go('title');
      else if (k === 'r') toStep(0);
      else U.listPress(k, this.items(), worldSt);
    }
  };
  function typeSeed() {
    typeIn({ title: 'SEED', text: 'Type a whole number. The same seed makes the same world.', value: W0.typed ? String(W0.seed) : '', numeric: true, max: 9, ph: '12345', done: function (v) {
      v = v.trim();
      if (!/^\d{1,9}$/.test(v)) return 'Use digits only, up to 9.';
      W0.seed = +v; W0.typed = true; rs = StudioSeed.stream(StudioSeed.hash(W0.seed + ':build')); B = blank(); return '';
    } });
  }

  // ================= THE SURVIVOR BUILDER (spec 001, 4) =================
  var STEPS = ['START FROM', 'NAME', 'JOB', 'FREE POINTS', 'TRAITS', 'WANT', 'LOOKS', 'READY'];
  var bStep = 0, bSt = [];
  for (var i0 = 0; i0 < 8; i0++) bSt.push({ sel: 0 });
  // can you go on from this step? '' when yes, otherwise why not
  function blocked(step) {
    if (step === 1 && !B.name.trim()) return 'Give your survivor a name first.';
    if (step === 2 && !B.job) return 'Pick a job first.';
    if (step === 4) return D.traitProblem(B.good, B.bad);
    return '';
  }
  function toStep(n) {
    if (n > bStep && S.scr === 'build') for (var s = bStep; s < n; s++) { var why = blocked(s); if (why) { U.toast(why); return; } }
    if (S.scr === 'world') { for (var s2 = 0; s2 < n; s2++) if (blocked(s2)) { n = s2; break; } }
    bStep = Math.max(0, Math.min(7, n)); S.scr = 'build';
  }
  function stepItems(step) {
    var it = [];
    var rnd = function (fn, text) { return { lines: [text || 'Random'], red: true, a: fn }; };
    if (step === 0) {
      it.push(rnd(function () { randomAll(); toStep(1); }, 'Random survivor'));
      it.push({ title: 'BLANK', lines: ['Make your own from scratch.'], a: function () { B = blank(); toStep(1); } });
      D.TEMPLATES.forEach(function (t) {
        it.push({ title: t.name.toUpperCase(), lines: [t.tag.charAt(0).toUpperCase() + t.tag.slice(1) + '. ' + D.job(t.job).name + '.'], check: B.template === t.name,
          a: function () { useTemplate(t); toStep(1); } });
      });
    } else if (step === 1) {
      it.push({ title: 'NAME', value: B.name || '—', lines: ['A to type a first name.'], a: function () {
        typeIn({ title: 'NAME', text: 'A first name.', value: B.name, max: 14, ph: 'Rita', done: function (v) { v = v.trim().replace(/\s+/g, ' '); if (!v) return 'Type a name, or pick Random.'; B.name = v; return ''; } });
      } });
      it.push(rnd(function () { B.name = pick(D.NAMES); }, 'Random name'));
    } else if (step === 2) {
      it.push(rnd(function () { B.job = pick(D.JOBS).id; trimFree(); toStep(3); }));
      D.JOBS.forEach(function (j) {
        var sk = Object.keys(j.skills).map(function (k) { return skillName(k) + ' ' + j.skills[k]; }).join(', ');
        it.push({ title: j.name.toUpperCase(), lines: [sk, j.itemText, 'Extra: ' + j.extra], check: B.job === j.id, a: function () { if (B.job !== j.id) { B.job = j.id; B.free = {}; } toStep(3); } });
      });
    } else if (step === 3) {
      var s = skills(), left = freeLeft();
      it.push({ lines: [left + ' free point' + (left === 1 ? '' : 's') + ' left. Highest start: 3' + (B.looks.age === 2 ? ' (4 in your job skill, as an older survivor)' : '') + '.'] });
      D.SKILLS.forEach(function (k) {
        it.push({ lines: [k.name + (B.free[k.id] ? '  +' + B.free[k.id] : '')], value: s[k.id], lr: function (d) {
          var cur = skills()[k.id];
          if (d > 0) {
            if (freeLeft() <= 0) { U.toast('No free points left.'); return; }
            if (cur >= D.skillCap(B.job, B.looks.age, k.id)) { U.toast(k.name + " can't start higher."); return; }
            B.free[k.id] = (B.free[k.id] || 0) + 1;
          } else if (B.free[k.id]) { B.free[k.id]--; if (!B.free[k.id]) delete B.free[k.id]; }
        } });
      });
      it.push(rnd(randomFree, 'Random points'));
      it.push({ lines: ['Take the points back'], a: function () { B.free = {}; } });
    } else if (step === 4) {
      var gp = D.traitSum(B.good), bp = D.traitSum(B.bad);
      it.push({ lines: ['Good points ' + gp + ' of ' + bp + '. Good traits ' + B.good.length + ' of 3.'], red: gp > bp });
      it.push(rnd(randomTraits, 'Random traits'));
      [['GOOD', D.GOOD, 'good'], ['BAD', D.BAD, 'bad']].forEach(function (L) {
        L[1].forEach(function (t) {
          var on = B[L[2]].indexOf(t.id) >= 0;
          it.push({ title: t.name.toUpperCase() + (L[2] === 'good' ? '  -' : '  +') + t.cost, lines: [t.text], check: on, a: function () { toggleTrait(t, L[2]); } });
        });
      });
    } else if (step === 5) {
      it.push(rnd(function () { B.want = pick(D.WANTS).id; toStep(6); }));
      D.WANTS.forEach(function (w) { it.push({ title: w.name.toUpperCase(), lines: [w.text], check: B.want === w.id, a: function () { B.want = w.id; toStep(6); } }); });
    } else if (step === 6) {
      it.push(rnd(randomLooks, 'Random looks'));
      D.LOOK_ROWS.forEach(function (r) {
        var opts = D.LOOKS[r[0]];
        it.push({ lines: [r[1]], value: r[0] === 'colors' ? 'Set ' + (B.looks.colors + 1) : opts[B.looks[r[0]]], lr: function (d) {
          B.looks[r[0]] = (B.looks[r[0]] + d + opts.length) % opts.length; if (r[0] === 'age') trimFree();
        } });
      });
      it.push({ lines: ['Older: +1 in the job skill (it can reach 4), and the sleep bar drops 10% faster.'], dim: true });
    } else if (step === 7) {
      var left7 = freeLeft();
      it.push({ title: 'START', lines: ['One life. Death ends this world.'], a: function () {
        for (var s = 0; s < 7; s++) { var why = blocked(s); if (why) { U.toast(why); return; } }
        ask('Start this world? You only get one life.', startWorld, 'Start');
      } });
      if (left7 > 0) it.push({ lines: [left7 + ' free point' + (left7 === 1 ? ' is' : 's are') + ' not spent. L to go back.'], red: true });
    }
    return it;
  }
  function toggleTrait(t, side) {
    var list = B[side], i = list.indexOf(t.id);
    if (i >= 0) { list.splice(i, 1); return; }
    if (side === 'good' && list.length >= 3) { U.toast('Up to 3 good traits.'); return; }
    var all = B.good.concat(B.bad);
    if (t.opp && all.indexOf(t.opp) >= 0) { U.toast(t.name + ' and ' + D.TRAITS[t.opp].name + " can't go together."); return; }
    list.push(t.id);
  }
  function skillName(id) { for (var i = 0; i < D.SKILLS.length; i++) if (D.SKILLS[i].id === id) return D.SKILLS[i].name; return id; }

  // the top panel: the taped photo, the map sprite at 2x on its shadow, and a summary in marker (mockup 05)
  function drawPanel(y, h, sv) {
    LA.cardboard(g, 4, y, U.W - 8, h);
    var big = h >= 88;
    var por = portraitOf(sv, 'ok');
    if (big) LA.photo(g, 10, y + 6, por, sv.name || '?');
    else { R(g, '#ece6d8', 8, y + 5, 44, 44); g.drawImage(por, 10, 4, 48, 48, 9, y + 6, 42, 42); LA.tape(g, 4, y + 3, 12, 4); }
    var sp = spriteOf(sv, 'down', 0), sx = big ? 88 : 56, sw = big ? 36 : 18;
    g.fillStyle = 'rgba(60,40,20,.35)'; g.beginPath(); g.ellipse(sx + sw / 2, y + (big ? 81 : 46), big ? 13 : 7, big ? 4 : 2, 0, 0, 7); g.fill();
    g.drawImage(sp, 0, 0, 18, 30, sx, y + (big ? 23 : 15), sw, big ? 60 : 30);
    var tx = big ? 130 : 80, j = D.job(sv.job);
    U.text(j ? j.name.toUpperCase() : 'NO JOB YET', tx, y + 9, F8, P.markR);
    var s = D.skillsOf(sv.job, sv.looks.age, sv.free), rows = D.SKILLS.filter(function (k) { return s[k.id] > 0; }).map(function (k) { return k.name + ' ' + s[k.id]; });
    if (!big) rows = [rows.join(', ')];
    g.font = F16;
    var lines = []; rows.forEach(function (r) { lines = lines.concat(LA.wrap(g, r, U.W - tx - 10)); });
    var max = Math.floor((h - 24) / 12);
    lines.slice(0, max).forEach(function (l, i) { U.text(l, tx, y + 19 + i * 12, F16, P.marker); });
    if (!big && sv.name) U.text(sv.name, tx, y + h - 15, F16, P.markR);
  }
  // the party card's look on the Ready step and the Party screen: photo, name, job, bars, traits and want
  screens.build = {
    draw: function () {
      R(g, '#101416', 0, 0, U.W, U.H);
      var top = U.header('STEP ' + (bStep + 1) + ' OF 8 · ' + STEPS[bStep], { l: function () { press('l'); }, r: function () { press('r'); }, rDim: bStep === 7, steps: 9, at: bStep + 1 });
      var ph = U.H >= 290 ? 92 : 56;
      drawPanel(top + 4, ph, B);
      var items = stepItems(bStep), ly = top + ph + 9;
      if (bStep === 7) { ly = drawReady(ly); }
      U.list({ x: 4, y: ly, w: U.W - 8, h: U.H - ly - 16 }, items, bSt[bStep]);
      U.help(bStep === 7 ? 'A start   B back   L step' : 'A pick   B back   L/R step');
    },
    press: function (k) {
      if (k === 'l' || k === 'b') { if (bStep === 0) go('world'); else bStep--; return; }
      if (k === 'r') { if (bStep < 7) toStep(bStep + 1); return; }
      U.listPress(k, stepItems(bStep), bSt[bStep]);
    }
  };
  // the Ready step: the world's preset, season and seed, the traits and the want, over the Start card
  function drawReady(y) {
    var pr = D.PRESETS.filter(function (p) { return p.id === W0.preset; })[0];
    var w = D.want(B.want);
    var lines = [
      'World: ' + pr.name + ', ' + (W0.season === 'Random' ? 'random season' : W0.season) + ', seed ' + W0.seed,
      'Traits: ' + (B.good.concat(B.bad).map(function (t) { return D.TRAITS[t].name; }).join(', ') || 'none'),
      'Want: ' + (w ? w.name : 'random')
    ];
    g.font = F16;
    var all = []; lines.forEach(function (l) { all = all.concat(LA.wrap(g, l, U.W - 28)); });
    var h = 8 + all.length * 13;
    LA.cardboard(g, 4, y, U.W - 8, h);
    all.forEach(function (l, i) { U.text(l, 12, y + 3 + i * 13, F16, P.marker); });
    return y + h + 5;
  }

  // ================= THE TOWN (spec 002) =================
  // Two sections from the seed (src/town.js), drawn by assets/town-art.js. You walk tile by tile; buildings open as
  // inside maps. Time moves only when you act: a step, a search, a lock, a trip, a wait (spec 002, 3).
  var T = 16, IT = LAI.ITEMS, TOP = 58;
  var TOWN = null, townKey = '';
  function town() { var k = S.run.seed + ':' + S.run.preset; if (townKey !== k) { TOWN = LAT.make(S.run.seed, S.run.preset); townKey = k; groundCache = {}; insideCache = {}; } return TOWN; }
  var groundCache = {}, insideCache = {};
  function sec() { return town()[S.run.town.sec]; }
  function here() { var t = S.run.town; return t.inside >= 0 ? sec().places[t.inside] : null; }

  // ---- the town's saved state (spec 002, Wiring: Saves) ----
  // town: {sec, inside, x, y, dir, spots: {id: items left}, locks: {id: 'open'|'broken'}, bike, marks, seen: {sec: bits},
  //        seenPlaces, roads: {strip}, flash}. The layout itself is never saved: the seed makes it again.
  function newTown() {
    var T0 = town(), w = T0.houses.wake, sv = S.run.surv;
    S.run.town = { sec: 'houses', inside: w.place, x: w.x, y: w.y, dir: 'down', spots: {}, locks: {}, bike: null, marks: {}, seen: {}, seenPlaces: {},
      roads: { strip: sv.job === 'trucker' || hasItem('roadmap') }, flash: false, woke: false };
  }
  var seenBits = {};
  function bits(id) {
    if (seenBits[id] && seenBits[id].seed === townKey) return seenBits[id].b;
    var b = new Uint8Array(450), s = S.run.town.seen[id];
    if (s) { try { var raw = atob(s); for (var i = 0; i < raw.length && i < 450; i++) b[i] = raw.charCodeAt(i); } catch (e) {} }
    seenBits[id] = { seed: townKey, b: b }; return b;
  }
  function packSeen() { var t = S.run.town; if (!t) return; for (var id in seenBits) { if (seenBits[id].seed !== townKey) continue; var b = seenBits[id].b, s = ''; for (var i = 0; i < b.length; i++) s += String.fromCharCode(b[i]); t.seen[id] = btoa(s); } }
  function see(x, y) { if (x < 0 || y < 0 || x >= 60 || y >= 60) return; var b = bits(S.run.town.sec), k = y * 60 + x; b[k >> 3] |= 1 << (k & 7); var dp = sec().doorAt[k]; if (dp) S.run.town.seenPlaces[sec().places[dp - 1].id] = 1; }
  function seenTile(id, x, y) { var k = y * 60 + x; return !!(bits(id)[k >> 3] & (1 << (k & 7))); }

  // ---- the bag (spec 002, 8) ----
  function bag() { return S.run.surv.bag; }
  function cap() { var b = bag(); return b.pockets + (b.worn ? IT[b.worn].bag : 0); }
  function used() { return bag().items.reduce(function (n, it) { return n + IT[it.id].slots; }, 0); }
  function hasItem(id) { return bag().items.some(function (it) { return it.id === id; }); }
  function count(id) { return bag().items.reduce(function (n, it) { return n + (it.id === id ? it.n : 0); }, 0); }
  // put an item in the bag: stacks first, then free slots. Returns how many went in.
  function give(it) {
    var d = IT[it.id], b = bag(), left = it.n, took = 0;
    if (d.kind === 'bag' && !b.worn) { b.worn = it.id; U.toast('You put on the ' + d.name.toLowerCase() + '.'); return it.n; }
    if (d.stack > 1 && it.w == null) b.items.forEach(function (s) { if (left && s.id === it.id && s.n < d.stack) { var k = Math.min(d.stack - s.n, left); s.n += k; left -= k; took += k; } });
    while (left > 0 && used() + d.slots <= cap()) { var k2 = Math.min(d.stack, left), o = Object.assign({}, it, { n: k2 }); if (d.food && d.keeps) o.made = S.run.clock.day; b.items.push(o); left -= k2; took += k2; }
    if (it.id === 'roadmap' && took) S.run.town.roads.strip = true;
    return took;
  }
  function slow() { return bag().worn && IT[bag().worn].slow; }

  // ---- notes (spec 002, 11): the first time something happens, a short line goes in the notebook ----
  var NOTES = {
    wake: 'Weeks since it started. It\'s quiet out there.',
    lock: 'Locked. A key would be quiet. Picking takes time. Forcing it is loud.',
    full: 'My bag\'s full. I can\'t carry it all.',
    dusk: 'Getting dark. Everything is harder in the dark.',
    trip: 'Hours on the open road between towns. Nowhere to hide out there.',
    clean: 'This part of town is nearly picked clean. I\'ll have to go farther.'
  };
  function note(id) {
    var sv = S.run.surv; if (sv.notes.some(function (n) { return n.id === id; })) return;
    sv.notes.push({ id: id, day: S.run.clock.day, min: S.run.clock.min, sec: S.run.town ? S.run.town.sec : 'houses', text: NOTES[id] });
    U.toast('New note: ' + NOTES[id], 3200);
  }

  // ---- the clock (spec 002, 3 and 13; bible, Difficulty presets) ----
  var HUNGER = { gentle: 100 / 72, standard: 100 / 48, harsh: 100 / 36 }, SLEEP = { gentle: 100 / 36, standard: 100 / 30, harsh: 100 / 24 };
  function duskHour(season) { return season === 'Summer' ? 21 : season === 'Winter' ? 17 : 19; }
  // how dark it is, 0 (day) to 1 (night): dark comes on over the hour after dusk and lifts over the hour before dawn (6 AM)
  function darkness() {
    var m = S.run.clock.min, d = duskHour(S.run.season) * 60;
    if (m >= d + 60 || m < 300) return 1;
    if (m >= d) return (m - d) / 60;
    if (m < 360) return 1 - (m - 300) / 60;
    return 0;
  }
  function pass(min) {
    var c = S.run.clock, n = S.run.surv.needs, sv = S.run.surv, older = sv.looks.age === 2 ? 1.1 : 1;
    var wasLight = darkness() < 0.05;
    c.min += min;
    while (c.min >= 1440) { c.min -= 1440; c.day++; newDay(); }
    n.hunger = Math.max(0, n.hunger - HUNGER[S.run.preset] * min / 60);
    n.sleep = Math.max(0, n.sleep - SLEEP[S.run.preset] * older * min / 60);
    // a lit flashlight burns its batteries: 8 hours a pair, and the next pair goes in by itself
    if (S.run.town && S.run.town.flash) {
      var fl = bag().items.filter(function (it) { return it.id === 'flashlight'; })[0], left = min;
      while (fl && left > 0) {
        var use = Math.min(left, fl.charge || 0); fl.charge = (fl.charge || 0) - use; left -= use;
        if (fl.charge <= 0) { if (takeOne('batteriesD')) { fl.charge = 480; U.toast('New batteries in the flashlight.'); } else { S.run.town.flash = false; U.toast('The flashlight died.'); break; } }
      }
    }
    if (wasLight && darkness() > 0.05) note('dusk');
  }
  function newDay() {
    var c = S.run.clock, D0 = LAD.SEASONS.indexOf(S.run.startSeason);
    S.run.season = LAD.SEASONS[(D0 + Math.floor((c.day - 1) / 14)) % 4];
    // cereal goes stale after 3 weeks (spec 002, 9: Spoiling)
    bag().items.forEach(function (it) { var d = IT[it.id]; if (d.keeps && it.made != null && c.day - it.made >= d.keeps) { it.id = 'spoiled'; delete it.made; } });
  }
  function takeOne(id) { var b = bag(); for (var i = 0; i < b.items.length; i++) if (b.items[i].id === id) { if (--b.items[i].n <= 0) b.items.splice(i, 1); return true; } return false; }
  function clockText(m) { var hh = Math.floor(m / 60), mm = m % 60; return ((hh + 11) % 12 + 1) + ':' + (mm < 10 ? '0' : '') + mm + (hh < 12 ? ' AM' : ' PM'); }
  function trait(id) { var t = S.run.surv.traits; return t.good.indexOf(id) >= 0 || t.bad.indexOf(id) >= 0; }
  function halve(min, why) { return why ? Math.ceil(min / 2) : min; }

  // ---- walking ----
  var mv = { held: [] }, me = {}, mapMenu = null, mapNote = null, menuSt = { sel: 0 }, codeSt = { sel: 0 }, waitSt = { sel: 0, h: 2 }, lootSt = null;
  function openAt(x, y) {
    var t = S.run.town, Sx = sec(), p = here();
    if (p) {
      var ins = p.inside; if (!LAT.passIn(ins, x, y)) return false;
      var di = ins.doorAt[y * ins.W + x]; if (di) { var L = ins.doors[di - 1].lock; if (L >= 0 && !t.locks[Sx.locks[L].id]) return false; }
      if (bikeAt(p, x, y)) return false;
      return true;
    }
    if (!LAT.passOut(Sx, x, y)) return false;
    var dp = Sx.doorAt[y * 60 + x];
    if (dp) { var pl = Sx.places[dp - 1]; if (pl.lock >= 0 && !t.locks[Sx.locks[pl.lock].id]) return false; }
    var b = t.bike; if (b && b.x != null && b.sec === t.sec && b.x === x && b.y === y) return false;
    return true;
  }
  // the bike waits in its garage until you first ride it; after that it's parked by the road where you got off
  function bikeAt(p, x, y) { var b = S.run.town.bike; return !!(p.bike && p.bike.x === x && p.bike.y === y && (!b || b.place === p.id && b.x == null)); }
  function lockedAt(x, y) {
    var t = S.run.town, Sx = sec(), p = here(), L = -1;
    if (p) { var ins = p.inside; if (x < 0 || y < 0 || x >= ins.W || y >= ins.H) return false; var di = ins.doorAt[y * ins.W + x]; if (di) L = ins.doors[di - 1].lock; }
    else { if (x < 0 || y < 0 || x >= 60 || y >= 60) return false; var dp = Sx.doorAt[y * 60 + x]; if (dp) L = Sx.places[dp - 1].lock; }
    return L >= 0 && !t.locks[Sx.locks[L].id];
  }
  var bumpT = 0;
  function arrive() {
    var t = S.run.town, Sx = sec(), p = here();
    t.x = me.x; t.y = me.y; t.dir = me.dir;
    pass(slow() ? 2 : 1);
    if (p) {
      if (p.inside.exit.x === me.x && p.inside.exit.y === me.y) leave();
    } else {
      var dp = Sx.doorAt[me.y * 60 + me.x];
      if (dp) enter(dp - 1);
      else lookAround();
    }
    save();
  }
  function enter(pi) {
    var t = S.run.town, p = sec().places[pi];
    t.inside = pi; t.seenPlaces[p.id] = 1;
    StudioMove.place(me, p.inside.exit.x, p.inside.exit.y - 1, 'up'); t.x = me.x; t.y = me.y; t.dir = 'up';
    mv.held = [];
  }
  function leave() {
    var t = S.run.town, p = here(), pi = t.inside;
    t.inside = -1; mark(pi);
    StudioMove.place(me, p.door.x, p.door.y + 1, 'down'); t.x = me.x; t.y = me.y; t.dir = 'down';
    mv.held = []; lookAround();
  }
  // a place's mark on the map: looted once every spot is searched, promising while one is left (spec 002, 12)
  function mark(pi) {
    var Sx = sec(), p = Sx.places[pi], t = S.run.town, left = p.spots.filter(function (si) { return !t.spots[Sx.spots[si].id]; }).length;
    if (t.marks[p.id] === 'dangerous') return;
    if (!left) t.marks[p.id] = 'looted';
    else if (left < p.spots.length || p.lock >= 0 && !t.locks[Sx.locks[p.lock].id]) t.marks[p.id] = 'promising';
    var looted = Sx.places.filter(function (q) { return t.marks[q.id] === 'looted'; }).length;
    if (looted >= Sx.places.length * 0.8) note('clean');
  }
  // what you can see: the screen by day, a few tiles round you at night (spec 002, 5)
  function vision() { return trait('nightOwl') ? 6 : trait('nearsighted') ? 2 : 4; }
  function lookAround() {
    var t = S.run.town; if (t.inside >= 0) return;
    var k = darkness(), r = k > 0.5 ? vision() : 0;
    if (!r) { for (var y = t.y - 8; y <= t.y + 8; y++) for (var x = t.x - 8; x <= t.x + 8; x++) see(x, y); return; }
    for (var y2 = t.y - r; y2 <= t.y + r; y2++) for (var x2 = t.x - r; x2 <= t.x + r; x2++) if ((x2 - t.x) * (x2 - t.x) + (y2 - t.y) * (y2 - t.y) <= r * r + 1) see(x2, y2);
    if (t.flash) { var d = StudioMove.DIRS[t.dir]; for (var s = 1; s <= 7; s++) for (var w = -Math.floor(s / 2); w <= Math.floor(s / 2); w++) see(t.x + d[0] * s + d[1] * w, t.y + d[1] * s + d[0] * w); }
  }
  // the road out: walking off the edge asks first (spec 002, 2)
  function edge(nx, ny) {
    var t = S.run.town, Sx = sec(); if (t.inside >= 0) return false;
    var ex = Sx.exits.filter(function (e) { return (nx < 0 || nx >= 60) && ny >= e.y0 && ny <= e.y1; })[0];
    if (!ex) return false;
    var to = town()[ex.to], name = to.name === 'Highway strip' ? 'the highway strip' : 'the houses';
    var bike = t.bike && t.bike.sec === t.sec;
    var ch = [{ label: 'Walk (about 3 hours)', run: function () { S.ask = null; travel(ex, 180, false); } }];
    if (bike) ch.push({ label: 'Bike (about 1 hour)', run: function () { S.ask = null; travel(ex, 60, true); } });
    ch.push({ label: 'Not yet', no: true, run: function () { S.ask = null; } });
    S.ask = { text: 'Walk to ' + name + '? About 3 hours.' + (bike ? ' Bike? About 1 hour.' : ''), sel: ch.length - 1, choices: ch };
    mv.held = [];
    return true;
  }
  function travel(ex, min, bike) {
    var t = S.run.town, from = t.sec, lane = me.y - ex.y0;
    pass(min);
    t.sec = ex.to; t.inside = -1; t.roads.strip = true;
    var back = sec().exits.filter(function (e) { return e.to === from; })[0];
    var x = back.x, y = back.y0 + lane;
    StudioMove.place(me, x, y, back.dir === 'left' ? 'right' : 'left'); t.x = x; t.y = y; t.dir = me.dir;
    if (bike) { t.bike = { sec: t.sec, taken: true, x: x + (back.dir === 'left' ? 1 : -1), y: back.y0 - 1 }; if (!LAT.passOut(sec(), t.bike.x, t.bike.y)) t.bike.y = back.y1 + 1; }
    note('trip'); lookAround(); save();
  }

  // ---- searching (spec 002, 6) ----
  function spotItems(s) { var st = S.run.town.spots[s.id]; return st || null; }
  function searchTime(s) {
    var p = s.place >= 0 ? sec().places[s.place] : null;
    return halve(halve(10, trait('steadyHands')), S.run.surv.job === 'clerk' && p && p.clerk);
  }
  function search(si) {
    var Sx = sec(), s = Sx.spots[si], t = S.run.town;
    if (s.lock >= 0 && !t.locks[Sx.locks[s.lock].id]) { lockMenu(s.lock); return; }
    if (!spotItems(s)) {
      pass(searchTime(s));
      t.spots[s.id] = s.items.map(function (it) { return Object.assign({}, it); });
      if (s.place >= 0) mark(s.place);
      save();
      if (!t.spots[s.id].length) { U.toast(s.kind === 'body' ? 'Nothing on them.' : 'Nothing in the ' + s.name.toLowerCase() + '.'); return; }
    } else if (!t.spots[s.id].length) { U.toast(s.kind === 'body' ? 'You already searched them.' : 'The ' + s.name.toLowerCase() + ' is empty.'); return; }
    lootSt = { si: si, sel: 0 };
  }
  function itemLabel(it) { var d = IT[it.id]; return (it.name || d.name) + (it.n > 1 ? ' ×' + it.n : '') + (it.w != null ? ' (' + Math.max(0, Math.round(it.w)) + '%)' : ''); }
  function take(si, idx) {
    var Sx = sec(), s = Sx.spots[si], list = S.run.town.spots[s.id], it = list[idx];
    var n = give(it);
    if (!n) { U.toast('No room in your bag.'); note('full'); return false; }
    it.n -= n; if (it.n <= 0) list.splice(idx, 1);
    else { U.toast('No room for the rest.'); note('full'); }
    if (it.id === 'carkeys' && n) U.toast('The keys go with the ' + Sx.props[it.car].label + '.');
    save(); return true;
  }
  function lootItems() {
    var Sx = sec(), s = Sx.spots[lootSt.si], list = S.run.town.spots[s.id], out = [];
    list.forEach(function (it, i) { out.push({ lines: [itemLabel(it)], a: function () { take(lootSt.si, i); if (!list.length) lootSt = null; } }); });
    out.push({ lines: ['Take all'], red: true, a: function () { for (var i = list.length - 1; i >= 0; i--) if (!take(lootSt.si, i)) break; if (!list.length) lootSt = null; } });
    out.push({ lines: ['Leave'], a: function () { lootSt = null; } });
    return out;
  }

  // ---- locks (spec 002, 7) ----
  var FORCE_TOOLS = ['crowbar', 'fireaxe', 'hammer'];
  function lockMenu(li) {
    var Sx = sec(), L = Sx.locks[li], t = S.run.town, sv = S.run.surv, ch = [];
    note('lock');
    if (L.place >= 0 && L.what === 'door') { t.marks[Sx.places[L.place].id] = t.marks[Sx.places[L.place].id] || 'promising'; }
    var key = bag().items.filter(function (it) { return it.id === 'key' && it.lock === L.id || it.id === 'carkeys' && L.car != null && it.car === L.car; })[0];
    var steady = trait('steadyHands'), fix = sv.skills.fixing, picks = hasItem('lockpicks');
    var tool = FORCE_TOOLS.map(function (id) { return bag().items.filter(function (it) { return it.id === id; })[0]; }).filter(Boolean)[0];
    var done = function (how, min, text) { S.ask = null; pass(min); t.locks[L.id] = how; save(); U.toast(text); };
    if (key) ch.push({ label: 'Use the ' + (key.id === 'carkeys' ? 'car keys' : 'key'), run: function () { done('open', 0, 'The key turns.'); } });
    if (picks || fix >= 3) {
      var chance = Math.min(95, 40 + 10 * fix), pm = halve(20, steady);
      ch.push({ label: 'Pick it (' + pm + ' min, ' + chance + '%)', run: function () {
        S.ask = null; pass(pm);
        if (S.dice.next() * 100 < chance) { t.locks[L.id] = 'open'; U.toast('Click. It opens.'); } else U.toast("The lock won't give.");
        save();
      } });
    }
    if (tool) {
      var fm = halve(5, steady);
      ch.push({ label: 'Force it with the ' + IT[tool.id].name.split(' ')[0].toLowerCase() + ' (' + fm + ' min, loud)', run: function () {
        tool.w = (tool.w == null ? 100 : tool.w) - 10;
        var broke = tool.w <= 0; if (broke) bag().items.splice(bag().items.indexOf(tool), 1);
        done('broken', fm, broke ? 'It gives, and your ' + IT[tool.id].name.split(' ')[0].toLowerCase() + ' breaks.' : 'It gives with a crack. That was loud.');
      } });
    }
    if (L.what === 'door' || L.what === 'room') ch.push({ label: 'Kick it (10 min, very loud)', run: function () { done('broken', 10, 'The door bursts in. That was very loud.'); } });
    ch.push({ label: 'Leave it', no: true, run: function () { S.ask = null; } });
    // the cursor starts on the key if you have it, otherwise on Leave it (play.md, No accidental point of no return)
    S.ask = { text: 'Locked: ' + L.name + '.', sel: key ? 0 : ch.length - 1, choices: ch };
    mv.held = [];
  }

  // ---- A on the map: search, open a lock, take the bike ----
  function act() {
    var t = S.run.town, Sx = sec(), p = here(), a = StudioMove.ahead(me), ax = a[0], ay = a[1];
    if (p) {
      var ins = p.inside; if (ax < 0 || ay < 0 || ax >= ins.W || ay >= ins.H) return;
      var k = ay * ins.W + ax;
      if (bikeAt(p, ax, ay)) {
        if (t.bike) { U.toast('Your bike. Ride it from the edge of town.'); return; }
        ask('Take the bike? You ride it between sections, and it waits where you leave it.', function () { t.bike = { sec: t.sec, place: p.id, taken: true }; U.toast('The bike is yours. Ride it from the edge of town.'); save(); }, 'Take it');
        return;
      }
      if (ins.spotAt[k]) { search(ins.spotAt[k] - 1); return; }
      if (ins.doorAt[k]) { var L = ins.doors[ins.doorAt[k] - 1].lock; if (L >= 0 && !t.locks[Sx.locks[L].id]) lockMenu(L); }
      return;
    }
    if (ax < 0 || ay < 0 || ax >= 60 || ay >= 60) return;
    var k2 = ay * 60 + ax;
    if (Sx.spotAt[k2]) { search(Sx.spotAt[k2] - 1); return; }
    if (Sx.doorAt[k2]) { var pl = Sx.places[Sx.doorAt[k2] - 1]; if (pl.lock >= 0 && !t.locks[Sx.locks[pl.lock].id]) lockMenu(pl.lock); }
  }

  // ---- ambient life: a stray dog, crows on the poles, litter on the wind (art-style.md, Maps are alive) ----
  var life = { sec: null, dog: null, crows: [], bits: [] };
  function lifeFor(Sx) {
    if (life.sec === Sx.id) return life;
    var r = StudioSeed.stream(StudioSeed.hash(S.run.seed + ':life:' + Sx.id));
    var bins = Sx.props.filter(function (p) { return p.k === 'bins' || p.k === 'mailbox'; }), b = bins[r.int(Math.max(1, bins.length))] || { x: 30, y: 30 };
    var at = StudioMove.nearestOpen(b.x + 1, b.y, 60, 60, function (x, y) { return LAT.passOut(Sx, x, y) && !Sx.doorAt[y * 60 + x]; }) || [30, 30];
    life = { sec: Sx.id, dog: { x: at[0], y: at[1], hx: at[0], hy: at[1], px: at[0] * T, py: at[1] * T, flip: 0, f: 0, t: 0 }, crows: [], bits: [] };
    Sx.props.forEach(function (p, i) { if ((p.k === 'pole' || p.k === 'upole' || p.k === 'flag') && r.int(2)) life.crows.push({ x: p.x * T + 4 + r.int(8), y: p.y * T - (p.k === 'upole' ? 53 : p.k === 'flag' ? 45 : 47), f: r.int(4), fly: 0, home: null }); });
    Sx.buildings.forEach(function (bd) { if (r.int(3) === 0) life.crows.push({ x: bd.x * T + 8 + r.int(bd.w * T - 16), y: bd.y * T + 2, f: r.int(4), fly: 0 }); });
    life.crows.forEach(function (c) { c.home = [c.x, c.y]; });
    return life;
  }
  function lifeTick() {
    var t = S.run.town, Sx = sec(); if (t.inside >= 0) return;
    var L = lifeFor(Sx), d = L.dog;
    d.f++;
    if (d.mv) { d.mv.t++; var k = d.mv.t / 24; d.px = Math.round((d.mv.fx + (d.mv.tx - d.mv.fx) * k) * T); d.py = Math.round((d.mv.fy + (d.mv.ty - d.mv.fy) * k) * T); if (d.mv.t >= 24) { d.x = d.mv.tx; d.y = d.mv.ty; d.mv = null; } }
    else if (++d.t > 70) {
      d.t = 0; var dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]], dd = dirs[(d.f >> 3) % 4], nx = d.x + dd[0], ny = d.y + dd[1];
      var near = Math.abs(nx - d.hx) + Math.abs(ny - d.hy) <= 4, clear = !(nx === me.x && ny === me.y);
      if (near && clear && LAT.passOut(Sx, nx, ny) && !Sx.doorAt[ny * 60 + nx]) { d.mv = { fx: d.x, fy: d.y, tx: nx, ty: ny, t: 0 }; if (dd[0]) d.flip = dd[0] > 0 ? 1 : 0; }
    }
    L.crows.forEach(function (c) {
      c.f = (c.f + (Math.random() < 0.02 ? 1 : 0)) % 8;
      var dx = c.x - me.px, dy = c.y - me.py;
      if (!c.fly && dx * dx + dy * dy < 40 * 40) c.fly = 1;
      if (c.fly) { c.fly++; c.x += 1.2; c.y -= 0.9; if (c.fly > 260) { c.fly = 0; c.x = c.home[0]; c.y = c.home[1]; } }
    });
    if (darkness() < 0.5 && L.bits.length < 4 && Math.random() < 0.01) L.bits.push({ x: -4, y: TOP + Math.random() * (U.H - TOP), v: 0.3 + Math.random() * 0.4, c: ['#e8e4d8', '#d8c08a', '#c8503a'][Math.floor(Math.random() * 3)], ph: Math.random() * 6 });
    L.bits = L.bits.filter(function (b) { b.x += b.v; b.ph += 0.05; return b.x < U.W + 6; });
  }

  // ---- the map screen ----
  function camFor(mw, mh) {
    var W = U.W, H = U.H, vh = H - TOP, cx, cy;
    cx = mw <= W ? (mw - W) / 2 : Math.max(0, Math.min(mw - W, me.px + 8 - W / 2));
    if (mh <= vh) cy = (mh - vh) / 2 - TOP;
    else cy = Math.max(-TOP + 8, Math.min(mh - H, me.py + 8 - TOP - vh / 2));
    return [Math.round(cx), Math.round(cy)];
  }
  var flick = { on: 1, vac: 1 };
  screens.map = {
    enter: function () {
      if (!S.dice) S.dice = StudioSeed.load(S.run.dice);
      if (!S.run.town) newTown();
      var t = S.run.town, Sx = sec(), p = here();
      var open = function (x, y) { return openAt(x, y) && (p || !Sx.doorAt[y * 60 + x]); };
      var W0 = p ? p.inside.W : 60, H0 = p ? p.inside.H : 60;
      var at = open(t.x, t.y) ? [t.x, t.y] : StudioMove.nearestOpen(t.x, t.y, W0, H0, open) || [t.x, t.y];
      StudioMove.place(me, at[0], at[1], t.dir || 'down'); t.x = me.x; t.y = me.y;
      mv.held = []; mapMenu = null; lootSt = null;
      if (!t.woke) { mapNote = ["Weeks since it started.", "It's quiet out there."]; }
      lookAround(); save();
    },
    tick: function () {
      lifeTick();
      if (mapMenu || mapNote || S.ask || lootSt) return;
      StudioMove.update(me, StudioMove.last(mv.held), {
        passable: function (x, y) {
          var p = here(), W0 = p ? p.inside.W : 60, H0 = p ? p.inside.H : 60;
          if (x < 0 || y < 0 || x >= W0 || y >= H0) { edge(x, y); return false; }
          var ok = openAt(x, y);
          if (!ok && lockedAt(x, y) && performance.now() - bumpT > 1500) { bumpT = performance.now(); U.toast('Locked. Press A to look closer.'); }
          return ok;
        },
        busy: function () { return false; },
        arrive: arrive
      });
      if (!me.mv) S.run.town.dir = me.dir;
    },
    draw: function (now) {
      var W = U.W, H = U.H, sv = S.run.surv, t = S.run.town, Sx = sec(), p = here(), k = darkness();
      var fl = Math.floor(now / 90); flick.on = !(fl % 47 === 3 || fl % 47 === 5 || fl % 61 === 20); flick.vac = (fl % 23) > 2 && (fl % 37) !== 9;
      R(g, '#0c0e10', 0, 0, W, H);
      var ox, oy, cam, mw, mh;
      if (p) {
        var key = Sx.id + p.id; if (!insideCache[key]) insideCache[key] = LA.insideMap(Sx, p);
        mw = p.inside.W * T; mh = p.inside.H * T; cam = camFor(mw, mh); ox = -cam[0]; oy = -cam[1];
        g.drawImage(insideCache[key], ox, oy);
        if (p.bike && bikeAt(p, p.bike.x, p.bike.y)) drawBike(ox + p.bike.x * T, oy + p.bike.y * T);
        drawMe(ox, oy);
      } else {
        if (!groundCache[Sx.id]) groundCache[Sx.id] = LA.townGround(Sx);
        mw = 60 * T; mh = 60 * T; cam = camFor(mw, mh); ox = -cam[0]; oy = -cam[1];
        g.drawImage(groundCache[Sx.id], ox, oy);
        drawOutside(Sx, ox, oy, now, k);
      }
      // night (spec 002, 5): dark but readable, with pools of light at the neon, your own few tiles and the flashlight
      if (k > 0) {
        var cxp = ox + me.px + 8, cyp = oy + me.py + 4, pools = [[cxp, cyp, (vision() + 0.5) * T]], cones = [];
        if (t.flash) { var ang = { right: 0, down: Math.PI / 2, left: Math.PI, up: -Math.PI / 2 }[me.dir]; cones.push([cxp, cyp, ang, 7.5 * T, 0.42]); }
        if (!p) Sx.props.forEach(function (q) { if (q.k === 'sign') pools.push([ox + q.x * T + 8, oy + q.y * T - 50, 34]); });
        if (!p) Sx.neon.forEach(function (n, i) { if (i && Math.abs(Sx.neon[i - 1].y - n.y) < 40 && Math.abs(Sx.neon[i - 1].x - n.x) < 60) return; pools.push([ox + n.x + 20, oy + n.y + 6, 30]); });
        StudioLight.night(g, { dark: '#0c101a', alpha: 0.84 * k, warm: '#8a7a5a', beam: '#ffecbe', pools: pools, cones: cones });
        if (!p) {
          LA.townNeon(g, Sx, ox, oy, k > 0.5, now);
          var behind = false;
          Sx.props.forEach(function (q) { if (q.k === 'sign') { var sx = ox + q.x * T, sy = oy + q.y * T + T; if (sx > -60 && sx < W + 60 && sy > 0 && sy < H + 70) { LA.townProp(g, Sx, q, sx, sy, now, { night: k > 0.5, flick: q.text === 'MOTEL' ? flick.on : 1, flickVac: flick.vac }); if (q.y <= me.y && Math.abs(q.x - me.x) < 4) behind = true; } } });
          // a lit sign is drawn again over the dark; you stay in front of it when you stand in front of it
          if (behind) drawMe(ox, oy);
        }
      }
      drawGlows(Sx, p, ox, oy, now, k);
      // Nearsighted by day: past 6 tiles the world is shapes (spec 002, 5)
      if (trait('nearsighted') && k < 0.5 && !p) blurFar(ox + me.px + 8, oy + me.py + 8, 6 * T);
      if (!p) lifeFor(Sx).bits.forEach(function (b) { R(g, b.c, b.x, b.y + Math.sin(b.ph) * 3, 2, 1); });
      // the top bar card (mockup 04): face, the four bars, day, clock and season; the place on a tab under it
      var n = sv.needs;
      var hh2 = LA.hud(g, W, { portrait: portraitOf(sv, moodOf(n)), food: n.hunger, hp: n.health, rest: n.sleep, san: n.san, day: S.run.clock.day, clock: clockText(S.run.clock.min), season: S.run.season.toUpperCase(), seasonCol: { Spring: '#8aa850', Summer: '#c8a050', Fall: '#c87a3a', Winter: '#a8c4d0' }[S.run.season] });
      g.font = F12; var tab = (p ? p.name : Sx.name).toUpperCase(), tw = g.measureText(tab).width + 8;
      R(g, '#14181a', 3, hh2 + 1, tw, 11); R(g, '#4e5854', 3, hh2 + 11, tw, 1); U.text(tab, 7, hh2 + 1, F12, P.dim);
      if (t.flash) { R(g, '#14181a', tw + 5, hh2 + 1, 40, 11); U.text('LIGHT ON', tw + 9, hh2 + 1, F12, P.warm); }
      U.hit(0, 0, W, H, function (x, y) { tapWalk(x - ox, y - oy); });
      if (lootSt) drawLoot();
      if (mapNote) { U.narrate(mapNote); U.hit(0, 0, W, H, function () { closeNote(); }); }
      if (mapMenu) drawMapMenu();
    },
    press: function (k) {
      if (mapNote) { if (k === 'a' || k === 'b' || k === 'start') closeNote(); return; }
      if (lootSt) { if (k === 'b') lootSt = null; else U.listPress(k, lootItems(), lootSt); return; }
      if (mapMenu) { mapMenuPress(k); return; }
      if (k === 'start') { mapMenu = 'menu'; menuSt.sel = 0; mv.held = []; return; }
      if (k === 'select') { U.toast("No one's with you."); return; }
      if (k === 'a' && !me.mv) { act(); return; }
      // the bag and map screens are still to be drawn (bible, Screens): a short line for now
      if (k === 'l') { U.toast('Bag: ' + used() + ' of ' + cap() + ' slots used' + (bag().worn ? ', wearing a ' + IT[bag().worn].name.toLowerCase() : ', pockets only') + '.'); return; }
      if (k === 'r') { var Sx = sec(), tt = S.run.town, seenN = Sx.places.filter(function (q) { return tt.seenPlaces[q.id]; }).length, lootN = Sx.places.filter(function (q) { return tt.marks[q.id] === 'looted'; }).length; U.toast(Sx.name + ': ' + seenN + ' places found, ' + lootN + ' looted.'); return; }
    },
    hold: function (dir, on) { if (mapMenu || mapNote || lootSt || S.ask) { mv.held = []; return; } mv.held = StudioMove.hold(mv.held, dir, on); }
  };
  function drawMe(ox, oy) {
    var sv = S.run.surv, step = StudioMove.walkFrame(me), sp = spriteOf(sv, me.dir, step), sx = ox + me.px - 1, sy = oy + me.py - 14;
    LA.shadow(g, sx + 9, sy + 28, 6, 0.38); g.drawImage(sp, sx, sy);
  }
  function drawBike(x, y) {
    LA.shadow(g, x + 9, y + 15, 7, 0.3); g.strokeStyle = '#3a4a5a'; g.lineWidth = 1; g.beginPath(); g.arc(x + 4, y + 11, 3.5, 0, 7); g.arc(x + 13, y + 11, 3.5, 0, 7); g.stroke();
    R(g, '#c8503a', x + 4, y + 8, 9, 1); R(g, '#c8503a', x + 8, y + 5, 1, 4); R(g, '#1a1a1a', x + 6, y + 4, 4, 1); R(g, '#9aa0a0', x + 12, y + 5, 1, 4);
  }
  // props, the dog and you, back to front, then the crows and the gas station canopy on top
  function drawOutside(Sx, ox, oy, now, k) {
    var W = U.W, H = U.H, list = [], t = S.run.town, L = lifeFor(Sx), canopy = null;
    Sx.props.forEach(function (q) {
      if (q.k === 'canopy') { canopy = q; return; }
      if (LA.townFlat[q.k]) return;
      var sx = ox + q.x * T, sy = oy + q.y * T + T;
      if (sx < -110 || sx > W + 40 || sy < -10 || sy > H + 70) return;
      list.push({ y: q.y * T + T, f: function () { LA.townProp(g, Sx, q, sx, sy, now, { night: k > 0.5, season: S.run.season, flick: q.text === 'MOTEL' ? flick.on : 1, flickVac: flick.vac }); } });
    });
    var b = t.bike; if (b && b.x != null && b.sec === t.sec) list.push({ y: b.y * T + T, f: function () { drawBike(ox + b.x * T, oy + b.y * T); } });
    var d = L.dog; list.push({ y: d.py + T, f: function () { LA.dog(g, ox + d.px + 1, oy + d.py + 14, d.flip, d.mv ? Math.floor(d.f / 4) : (d.f >> 4) % 6 < 3 ? 0 : 4); } });
    list.push({ y: me.py + T + 0.5, f: function () { drawMe(ox, oy); } });
    list.sort(function (a, b2) { return a.y - b2.y; }).forEach(function (e) { e.f(); });
    if (canopy) {
      var cx0 = ox + canopy.x * T, cy0 = oy + canopy.y * T, under = me.x >= canopy.x && me.x < canopy.x + canopy.w && me.y >= canopy.y && me.y < canopy.y + canopy.h;
      LA.townCanopy(g, canopy, cx0, cy0, under ? 0.45 : 1, k > 0.5);
      if (k > 0.5) Sx.neonCanopy = { x: cx0, y: cy0 };
    }
    L.crows.forEach(function (c) { LA.crow(g, ox + c.x, oy + c.y, c.fly ? Math.floor(c.fly / 6) : c.f, !!c.fly); });
  }
  // usable things glow cyan (bible, Art): unsearched spots, doors to places not yet looted, a locked lock
  function drawGlows(Sx, p, ox, oy, now, k) {
    var t = S.run.town, a = (k > 0.5 ? 0.85 : 0.55) + 0.25 * Math.sin(now / 300), seeR = k > 0.5 ? (vision() + 3) * T : 1e9;
    var near = function (x, y) { var dx = x - me.px, dy = y - me.py; return dx * dx + dy * dy <= seeR * seeR; };
    g.strokeStyle = 'rgba(63,240,232,' + a.toFixed(2) + ')'; g.lineWidth = 1;
    var box2 = function (x, y, w, h) { g.strokeRect(Math.round(x) + 0.5, Math.round(y) + 0.5, w - 1, h - 1); };
    if (p) {
      p.spots.forEach(function (si) { var s = Sx.spots[si]; if (t.spots[s.id] && !t.spots[s.id].length) return; if (t.spots[s.id] && t.spots[s.id].length) return; box2(ox + s.x * T, oy + s.y * T - (s.y < 2 ? 0 : 2), s.w * T, s.h * T + 2); });
      p.inside.doors.forEach(function (d) { if (d.lock >= 0 && !t.locks[Sx.locks[d.lock].id]) box2(ox + d.x * T + 1, oy + d.y * T, 14, T); });
      if (p.bike && !t.bike) box2(ox + p.bike.x * T, oy + p.bike.y * T + 2, T, 14);
      return;
    }
    var vx0 = -ox - 60, vx1 = -ox + U.W + 60, vy0 = -oy - 60, vy1 = -oy + U.H + 60;
    Sx.props.forEach(function (q) {
      if (q.k !== 'car' && q.k !== 'body') return;
      var X = q.x * T, Y = q.y * T; if (X < vx0 || X > vx1 || Y < vy0 || Y > vy1 || !near(X, Y)) return;
      var spots = q.k === 'car' ? q.spots : [q.s];
      if (!spots.some(function (si) { return !t.spots[Sx.spots[si].id]; })) return;
      if (q.k === 'car') box2(ox + X - 1, oy + Y - 10, 50, 26); else box2(ox + X - 3, oy + Y + 3, 22, 12);
    });
    Sx.places.forEach(function (q) {
      var X = q.door.x * T, Y = q.door.y * T; if (X < vx0 || X > vx1 || Y < vy0 || Y > vy1 || !near(X, Y)) return;
      if (t.marks[q.id] === 'looted') return;
      box2(ox + X + 2, oy + Y - 2, 12, 18);
    });
  }
  var blurC = null;
  function blurFar(cx, cy, r) {
    var W = U.W, H = U.H; if (!blurC) blurC = document.createElement('canvas');
    blurC.width = Math.ceil(W / 3); blurC.height = Math.ceil(H / 3); var bg = blurC.getContext('2d'); bg.imageSmoothingEnabled = false;
    bg.drawImage(cv, 0, 0, blurC.width, blurC.height);
    g.save(); g.beginPath(); g.rect(0, 0, W, H); g.arc(cx, cy, r, 0, Math.PI * 2, true); g.clip('evenodd');
    g.imageSmoothingEnabled = false; g.drawImage(blurC, 0, 0, W, H); g.restore();
  }
  function closeNote() { mapNote = null; S.run.town.woke = true; note('wake'); save(); }
  // a tap on the map walks one step toward it
  function tapWalk(x, y) {
    var tx = Math.floor(x / T), ty = Math.floor(y / T), dx = tx - me.x, dy = ty - me.y;
    if (!dx && !dy) return;
    if (Math.abs(dx) + Math.abs(dy) === 1) { var dir0 = dx > 0 ? 'right' : dx < 0 ? 'left' : dy > 0 ? 'down' : 'up'; if (me.dir === dir0 && !openAt(tx, ty)) { act(); return; } }
    var dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
    mv.held = [dir]; setTimeout(function () { mv.held = []; }, 120);
  }
  // what you found: take one, take all, or leave (spec 002, 6), on the cardboard surface
  function drawLoot() {
    var Sx = sec(), s = Sx.spots[lootSt.si], items = lootItems(), h = Math.min(U.H - 90, items.length * 23 + 12), w = U.W - 16;
    R(g, 'rgba(8,10,12,.5)', 0, 0, U.W, U.H);
    U.hit(0, 0, U.W, U.H, function () { lootSt = null; });
    var y = Math.max(TOP + 4, U.H - h - 32);
    R(g, P.card, 8, y - 14, w, 14); U.text(s.name.toUpperCase(), 13, y - 11, F8, P.warm);
    var room = cap() - used(); U.text(room + ' slot' + (room === 1 ? '' : 's') + ' free', 8 + w - 4 - U.width(room + ' slots free', F12), y - 14, F12, P.dim);
    U.list({ x: 8, y: y, w: w, h: h }, items, lootSt);
    U.help('A take   B leave');
  }
  // the Start menu (spec 002, Wiring): Party, Wait, Save code, Quit to title; the notebook waits for its screen
  function menuItems() {
    if (mapMenu === 'code') return [
      { lines: ['Export'], a: function () { save(); typeIn({ title: 'EXPORT', text: 'Copy this code and keep it somewhere safe. Import it to get this world back.', area: true, readonly: true, copy: true, value: exportCode() }); } },
      { lines: ['Import'], a: importSave }
    ];
    if (mapMenu === 'wait') return [
      { lines: ['Hours'], value: waitSt.h, lr: function (d) { waitSt.h = Math.max(1, Math.min(10, waitSt.h + d)); } },
      { lines: ['Wait ' + waitSt.h + ' hour' + (waitSt.h === 1 ? '' : 's')], red: true, a: function () { pass(waitSt.h * 60); mapMenu = null; lookAround(); save(); U.toast('You wait. It\'s ' + clockText(S.run.clock.min) + '.'); } }
    ];
    var out = [
      { lines: ['Party'], a: function () { mapMenu = null; go('party'); } },
      { lines: ['Wait'], a: function () { mapMenu = 'wait'; waitSt.sel = 0; } }
    ];
    // a stand-in until the bag screen (L) is drawn: the flashlight is turned on and off from here
    var fl = bag().items.filter(function (it) { return it.id === 'flashlight'; })[0];
    if (fl) out.push({ lines: ['Flashlight'], value: S.run.town.flash ? 'On' : 'Off', a: function () { toggleLight(); } });
    out.push({ lines: ['Save code'], a: function () { mapMenu = 'code'; codeSt.sel = 0; } });
    out.push({ lines: ['Quit to title'], a: function () { save(); mapMenu = null; go('title'); } });
    return out;
  }
  function toggleLight() {
    var t = S.run.town, fl = bag().items.filter(function (it) { return it.id === 'flashlight'; })[0];
    if (!fl) return;
    if (t.flash) { t.flash = false; save(); return; }
    if (!(fl.charge > 0)) { if (takeOne('batteriesD')) fl.charge = 480; else { U.toast('No batteries.'); return; } }
    t.flash = true; lookAround(); save();
  }
  function drawMapMenu() {
    var items = menuItems(), st = mapMenu === 'code' ? codeSt : mapMenu === 'wait' ? waitSt : menuSt, h = items.length * 23 + 10, w = mapMenu === 'wait' ? 140 : 124;
    R(g, 'rgba(8,10,12,.45)', 0, 0, U.W, U.H);
    U.hit(0, 0, U.W, U.H, function () { mapMenuPress('b'); });
    if (mapMenu !== 'menu') U.text(mapMenu === 'code' ? 'SAVE CODE' : 'WAIT', U.W - w - 6, 52, F8, P.warm);
    U.list({ x: U.W - w - 6, y: 62, w: w, h: h }, items, st);
  }
  function mapMenuPress(k) {
    var st = mapMenu === 'code' ? codeSt : mapMenu === 'wait' ? waitSt : menuSt;
    if (k === 'b' || k === 'start') { mapMenu = mapMenu === 'menu' ? null : 'menu'; return; }
    U.listPress(k, menuItems(), st);
  }

  // ================= THE PARTY CARD (spec 001, 6; ui.md, Party menu, one fixed lead) =================
  var plist = StudioParty.list({
    count: function () { return 1; }, lead: function () { return 0; }, cycle: function () {},
    actions: function () { return []; }, close: function () { go('map'); }, pulse: function () { return S.run.surv.needs.health < 25; },
    headerH: 16, cardH: 84, detailMin: 60,
    paint: {
      header: function (c, r) { U.text('PARTY', r.x + 2, r.y + 4, F8, P.warm); U.text('A details   B back', r.x + r.w - U.width('A details   B back', F12), r.y + 2, F12, P.dim); },
      card: function (c, i, r, st) {
        var sv = S.run.surv, n = sv.needs, j = D.job(sv.job);
        LA.cardboard(c, r.x, r.y, r.w, r.h);
        if (st.on) { c.strokeStyle = P.cyan; c.lineWidth = 2; c.strokeRect(r.x - 1, r.y - 1, r.w + 2, r.h + 2); }
        // the portrait at 2x of the top bar's face, on its lit backing
        R(c, '#ece6d8', r.x + 8, r.y + 6, 40, 40); c.drawImage(portraitOf(sv, moodOf(n)), 12, 6, 44, 44, r.x + 10, r.y + 8, 36, 36); LA.tape(c, r.x + 5, r.y + 4, 12, 4);
        U.text(sv.name.toUpperCase(), r.x + 54, r.y + 7, F8, P.markR);
        U.text(j.name, r.x + 54, r.y + 16, F16, P.marker);
        var bars = [['food', 'FOOD', n.hunger, '#d06a3a'], ['hp', 'HP', n.health, '#c8503a'], ['rest', 'REST', n.sleep, '#a88a40'], ['san', 'SAN', n.san, '#2ab8b0']];
        bars.forEach(function (b, k) {
          var bx = r.x + 54 + (k % 2) * 82, by = r.y + 34 + Math.floor(k / 2) * 12;
          LA.icon(c, b[0], bx, by, b[3]); U.text(b[1], bx + 9, by - 2, F12, P.marker);
          R(c, '#86683c', bx + 32, by + 1, 42, 5); R(c, b[3], bx + 32, by + 1, Math.round(42 * b[2] / 100), 5);
        });
        U.text(sv.wounds.length ? sv.wounds.length + ' wounds' : 'No wounds', r.x + 10, r.y + 62, F16, P.marker);
        var pr = D.PRESETS.filter(function (p) { return p.id === S.run.preset; })[0];
        U.text(pr.name, r.x + r.w - 10 - U.width(pr.name, F16), r.y + 62, F16, P.markR);
      },
      detail: function (c, r) {
        var sv = S.run.surv, w = D.want(sv.want);
        LA.cardboard(c, r.x, r.y + 4, r.w, r.h - 4);
        var lines = [];
        c.font = F16;
        ['Good: ' + (sv.traits.good.map(function (t) { return D.TRAITS[t].name; }).join(', ') || 'none'),
          'Bad: ' + (sv.traits.bad.map(function (t) { return D.TRAITS[t].name; }).join(', ') || 'none'),
          'Want: ' + w.name + '. ' + w.text, 'Job extra: ' + D.job(sv.job).extra].forEach(function (l) { lines = lines.concat(LA.wrap(c, l, r.w - 16)); });
        lines.forEach(function (l, i) { if (10 + i * 13 < r.h - 8) U.text(l, r.x + 8, r.y + 9 + i * 13, F16, P.marker); });
      }
    },
    colors: { box: '#101416', border: P.line, shadow: 'rgba(0,0,0,.4)', on: P.cardHi, text: P.text, dim: P.dim, cursor: P.cyan },
    font: F16
  });
  screens.party = {
    enter: function () { plist.reset(0); },
    draw: function (now) {
      R(g, '#101416', 0, 0, U.W, U.H);
      plist.draw(g, U.W, U.H, now);
      U.hit(0, 0, U.W, U.H, function (x, y) { if (y > 20 && y < 112) go('detail'); });
      U.hit(0, 0, 80, 20, function () { go('map'); });
    },
    press: function (k) { if (k === 'a') go('detail'); else if (k === 'start') go('map'); else plist.press(k); }
  };
  // the detail page: all 8 skills with their level, abilities unlocked, and the world's preset, season and seed
  var detSt = { sel: 0 };
  screens.detail = {
    enter: function () { detSt.sel = 0; detSt.off = 0; },
    items: function () {
      var sv = S.run.surv, out = [];
      D.SKILLS.forEach(function (k) {
        var lv = sv.skills[k.id], ab = D.ABILITIES[k.id], got = lv >= 5 ? ab.join(', ') : lv >= 3 ? ab[0] : '';
        out.push({ lines: [k.name].concat(got ? ['Can: ' + got] : []), value: lv });
      });
      var pr = D.PRESETS.filter(function (p) { return p.id === S.run.preset; })[0];
      out.push({ title: 'THE WORLD', lines: [pr.name + '. Started in ' + S.run.startSeason.toLowerCase() + (S.run.seasonPick === 'Random' ? ' (random)' : '') + '.', 'Seed ' + S.run.seed] });
      return out;
    },
    draw: function () {
      R(g, '#101416', 0, 0, U.W, U.H);
      var top = U.header(S.run.surv.name.toUpperCase() + ' · SKILLS');
      U.list({ x: 4, y: top + 4, w: U.W - 8, h: U.H - top - 22 }, this.items(), detSt);
      U.help('B back');
      U.hit(0, 0, 60, 20, function () { go('party'); });
    },
    press: function (k) { if (k === 'b' || k === 'a') go('party'); else if (k === 'start') go('map'); else U.listPress(k, this.items(), detSt); }
  };

  // ================= start up =================
  openSaves();
  S.run = store.get('run', null);
  if (S.run) S.dice = StudioSeed.load(S.run.dice);
  if (!store.get('record', null)) store.set('record', newRecord());
  StudioInput.start({
    press: press,
    walking: function () { return S.scr === 'map' && !mapMenu && !mapNote && !lootSt && !S.ask && !ovl.classList.contains('on'); },
    hold: function (dir, on) { if (S.scr === 'map') screens.map.hold(dir, on); }
  });
  window.addEventListener('pagehide', save);
  document.addEventListener('visibilitychange', function () { if (document.hidden) save(); });

  function boot() {
    resize();
    if (S.run && Studio.continued) go('map'); else go('title');
    requestAnimationFrame(frame);
  }
  var fonts = document.fonts ? Promise.all([document.fonts.load(F16), document.fonts.load(F8), document.fonts.load('16px "Press Start 2P"')]) : Promise.resolve();
  var booted = false; var once = function () { if (!booted) { booted = true; boot(); } };
  fonts.then(once, once); setTimeout(once, 1500);

  // ================= test hooks (tools/check.js) =================
  window.LAG = {
    VERSION: VERSION, key: key, store: store, exportCode: exportCode, readCode: readCode, applyCode: applyCode,
    _t: {
      S: function () { return S; }, B: function () { return B; }, W0: function () { return W0; }, step: function () { return bStep; },
      scr: function () { return S.scr; }, go: go, me: function () { return me; }, ask: function () { return S.ask; },
      menu: function () { return mapMenu; }, note: function () { return mapNote; }, loot: function () { return lootSt; },
      town: town, sec: sec, here: here, darkness: darkness, pass: pass, clockText: clockText, cap: cap, used: used, give: give,
      seenTile: seenTile, vision: vision,
      // the same moves the screens make, without walking every step: the checks use these to play a week fast
      act: {
        // stand on a tile (inside a place, or outside with inside = -1), charging 1 minute a step for steps taken
        at: function (inside, x, y, steps) { var t = S.run.town; t.inside = inside; StudioMove.place(me, x, y, 'up'); t.x = x; t.y = y; if (steps) pass(steps * (slow() ? 2 : 1)); lookAround(); save(); },
        face: function (dir) { me.dir = dir; S.run.town.dir = dir; },
        a: function () { act(); }, enter: function (pi) { enter(pi); save(); }, leave: function () { leave(); save(); }, travel: function (to, bike) { var ex = sec().exits.filter(function (e) { return e.to === to; })[0]; StudioMove.place(me, ex.x, ex.y0, ex.dir); travel(ex, bike ? 60 : 180, bike); },
        takeAll: function () { if (!lootSt) return 0; var it = lootItems(), all = it[it.length - 2]; all.a(); lootSt = null; return 1; },
        lockMenu: lockMenu, toggleLight: toggleLight, closeNote: function () { if (mapNote) closeNote(); }, mark: mark
      },
      // make a world straight from settings, through the same builder steps the screens use
      make: function (o) {
        newWorld();
        W0.preset = o.preset || 'standard'; W0.season = o.season || 'Random';
        if (o.seed != null) { W0.seed = o.seed; W0.typed = true; rs = StudioSeed.stream(StudioSeed.hash(W0.seed + ':build')); }
        if (o.template === 'blank' || !o.template) B = blank(); else if (o.template === 'random') randomAll(); else useTemplate(D.TEMPLATES.filter(function (t) { return t.name === o.template; })[0]);
        if (o.name) B.name = o.name; if (o.job) { B.job = o.job; B.free = {}; }
        if (o.free) B.free = o.free; if (o.good) B.good = o.good; if (o.bad) B.bad = o.bad; if (o.want) B.want = o.want; if (o.looks) Object.assign(B.looks, o.looks);
        if (o.randomPoints) randomFree(); if (o.randomTraits) randomTraits(); if (o.randomLooks) randomLooks();
        for (var s = 0; s < 7; s++) { var why = blocked(s); if (why) return { ok: false, why: why, step: s }; }
        startWorld(); return { ok: true, run: JSON.parse(JSON.stringify(S.run)) };
      },
      blocked: blocked, toStep: toStep, items: function () { return stepItems(bStep); }, ovl: function () { return LAG._ovl; }
    }
  };
})();
