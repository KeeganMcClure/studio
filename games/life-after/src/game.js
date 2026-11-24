// Life After, slice part A (spec 001): the title, a new world, the survivor builder, the party card,
// the stand-in room, saves and the save code. window.LAG.
(function () {
  var P = LA.P, R = LA.R, D = LAD, U = LAU;
  var F8 = U.F8, F16 = U.F16, F12 = U.F12;
  var cv = document.getElementById('cv'), g = cv.getContext('2d'), screenEl = document.getElementById('screen');
  var ovl = document.getElementById('ovl');
  U.g = g;

  // ================= saves (studio-bible/saves.md; spec 001, 8) =================
  var VERSION = 1;
  var key = function (k) { return Studio.savePrefix('la.') + k; };   // dev.la.* on the Dev shelf
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(key(k)); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(key(k), JSON.stringify(v)); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem(key(k)); } catch (e) {} }
  };
  // Upgrade steps: STEPS_UP[n] turns a version n - 1 save into version n. Old steps never change.
  // Version 1 is the first: nothing to upgrade yet. Parts B to D add their steps here.
  var STEPS_UP = {};
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
  function save() { if (S.run) { S.run.dice = S.dice ? S.dice.save() : S.run.dice; store.set('run', S.run); } store.set('version', VERSION); }

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
    j.items.forEach(function (it) { if (D.ITEMS[it[0]].bag && !worn) worn = it[0]; else items.push({ id: it[0], n: it[1] }); });
    S.run = {
      v: 1, seed: seed, typedSeed: !!W0.typed, preset: W0.preset, seasonPick: W0.season, season: season, startSeason: season,
      clock: { day: 1, min: 7 * 60 },
      surv: {
        name: B.name, job: B.job, template: B.template, skills: sk, uses: uses, free: Object.assign({}, B.free),
        traits: { good: B.good.slice(), bad: B.bad.slice() }, want: B.want, looks: Object.assign({}, B.looks),
        needs: { hunger: 70, health: 100, sleep: 80, san: 70 }, wounds: [],
        bag: { pockets: pockets, worn: worn, items: items }, recipes: j.recipes.slice(), notes: []
      },
      map: { name: 'standin', x: 5, y: 4, dir: 'down' },
      seen: { intro: false }
    };
    S.dice = StudioSeed.stream(StudioSeed.hash(seed + ':dice'));
    save();
    go('room');
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
      if (S.run) a.push({ lines: ['Continue'], a: function () { go('room'); } });
      a.push({ lines: ['Best runs'], a: function () { go('best'); } });
      a.push({ lines: ['Import save'], a: importSave });
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
        ask('This replaces your current world.', function () { applyCode(o); U.toast('Save imported.'); go(S.run ? 'room' : 'title'); }, 'Replace it');
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

  // ================= THE STAND-IN ROOM (spec 001, 7) =================
  // A small bedroom: a bed, a window, a closed door. Walk, open the party card and the Start menu, nothing else.
  var ROOM = [
    '###############',
    '#WWWWWwwWWWWWW#',
    '#bbn....ddd..k#',
    '#bb..........k#',
    '#bb...........#',
    '#.....rrrr..tt#',
    '#.....rrrr..h.#',
    '#.............#',
    '#c..........x.#',
    '#.............#',
    '#######D#######'
  ];
  var RW = ROOM[0].length, RH = ROOM.length, T = 16;
  function solid(x, y) { if (x < 0 || y < 0 || x >= RW || y >= RH) return true; var c = ROOM[y][x]; return c !== '.' && c !== 'r'; }
  var mv = { held: [] }, me = {}, roomMenu = null, roomNote = null, menuSt = { sel: 0 };
  var roomCache = null;
  // the bedroom, drawn once: lit from the window (upper middle), hard shadows to the lower right, flat tones, no grain
  function drawRoomTiles() {
    var c = document.createElement('canvas'); c.width = RW * T; c.height = RH * T;
    var r = c.getContext('2d'); r.imageSmoothingEnabled = false;
    var vol = LA.vol, box = LA.box, px = LA.px, W = c.width, H = c.height;
    var shade = function (x, y, w, h) { r.fillStyle = 'rgba(10,12,14,.34)'; r.fillRect(x, y, w, h); };
    var wood = ['#9a7448', '#84603a', '#6a4a2e', '#4e3622'];
    // floor: worn planks, a tone apart from clothes
    var plank = ['#8a6a48', '#7a5c3e', '#6a4e34', '#5a422c'];
    R(r, plank[1], 0, 0, W, H);
    for (var y = 2 * T; y < H; y += 4) { R(r, plank[2], 0, y + 3, W, 1); for (var x = ((y / 4) % 3) * 13; x < W; x += 37) R(r, plank[3], x, y, 1, 3); }
    [[40, 58, 22], [150, 74, 18], [70, 140, 26], [196, 132, 16], [30, 118, 14]].forEach(function (s) { R(r, plank[0], s[0], s[1], s[2], 1); });
    R(r, plank[2], 170, 150, 10, 2); R(r, plank[3], 58, 98, 6, 2);
    // the window's light falls down and to the right across the floor
    r.fillStyle = 'rgba(232,208,160,.16)'; r.beginPath(); r.moveTo(96, 32); r.lineTo(128, 32); r.lineTo(162, 104); r.lineTo(118, 104); r.fill();
    // walls: the back wall's face, papered, with a rail; the side and bottom walls seen from above
    var wall = ['#9a9e8a', '#868a76', '#6e7262', '#545848'];
    R(r, wall[1], 0, 0, W, 2 * T);
    for (var wx = 4; wx < W; wx += 8) R(r, wall[2], wx, 4, 1, 18);
    R(r, wall[0], 0, 0, W, 2); R(r, '#6a5a40', 0, 22, W, 2); R(r, '#8a7650', 0, 22, W, 1); R(r, wall[3], 0, 30, W, 2);
    R(r, '#2e302a', 0, 0, T, H); R(r, '#3e4038', T - 2, 2 * T, 2, H); R(r, '#2e302a', W - T, 0, T, H); R(r, '#24261f', W - T, 2 * T, 2, H);
    R(r, '#2e302a', 0, (RH - 1) * T, W, T); R(r, '#3e4038', 0, (RH - 1) * T, W, 2);
    // the window: morning outside over a field, a cracked pane, a curtain
    R(r, '#3e3a30', 96, 4, 32, 22); R(r, '#8a9a98', 98, 6, 28, 8); R(r, '#e8d0a0', 98, 14, 28, 2); R(r, '#5e6444', 98, 16, 28, 8);
    R(r, '#3e3a30', 111, 6, 2, 18); R(r, '#3e3a30', 98, 14, 28, 1);
    px(r, '#f0ece0', 102, 8); px(r, '#f0ece0', 103, 9); px(r, '#f0ece0', 104, 9); px(r, '#f0ece0', 105, 10);
    R(r, '#8a4028', 92, 3, 6, 25); R(r, '#b4582e', 92, 3, 2, 25); R(r, '#6a3424', 96, 3, 2, 25);
    // a poster, half torn; a calendar stuck on a month that never ended; a clock that stopped
    R(r, '#3a5068', 58, 6, 14, 15); R(r, '#e8c88a', 60, 8, 10, 3); R(r, '#c8503a', 61, 13, 8, 5); R(r, wall[1], 66, 17, 6, 4);
    R(r, '#e8e4d8', 150, 7, 12, 14); R(r, '#c8503a', 150, 7, 12, 3); for (var k = 0; k < 9; k++) px(r, '#6e6a62', 152 + (k % 3) * 3, 12 + Math.floor(k / 3) * 3);
    vol(r, 186, 12, 5, 5, ['#e8e4d8', '#c8c4b4', '#a8a494', '#7e7a6c']); R(r, '#1c1a18', 186, 9, 1, 4); R(r, '#1c1a18', 186, 12, 3, 1);
    // the bed: a frame, the quilt thrown back, a pillow
    shade(20, 40, 32, 42);
    box(r, 17, 34, 30, 44, ['#8a6040', '#74502e', '#5e4024', '#44301c']);
    R(r, '#e8e4d8', 19, 36, 26, 8); R(r, '#c8c4b4', 19, 42, 26, 2);
    box(r, 19, 50, 26, 26, ['#7e9a96', '#5a7472', '#46605e', '#34484a']);
    R(r, '#8aa8a4', 19, 50, 26, 1); for (var q = 21; q < 44; q += 6) R(r, '#46605e', q, 52, 1, 23);
    R(r, '#5a7472', 28, 46, 16, 5); R(r, '#7e9a96', 28, 46, 16, 1);
    // the nightstand with a dead lamp
    shade(52, 38, 14, 12); box(r, 49, 34, 14, 13, wood); R(r, wood[3], 51, 40, 10, 1); px(r, '#e8d08a', 55, 42);
    vol(r, 56, 30, 4, 3, ['#e8e0c8', '#c8c0aa', '#a8a08a', '#7a7462']); R(r, '#5e5a54', 55, 33, 2, 2);
    // the dresser, a drawer pulled out, a photo frame face down and a radio on top
    shade(132, 40, 48, 14); box(r, 129, 30, 46, 18, wood);
    for (var d = 0; d < 3; d++) { R(r, wood[3], 131 + d * 15, 36, 13, 1); R(r, wood[3], 131 + d * 15, 42, 13, 1); px(r, '#e8d08a', 137 + d * 15, 39); }
    box(r, 146, 44, 13, 6, wood); R(r, '#e8e4d8', 148, 45, 9, 2);
    R(r, '#e8e4d8', 133, 26, 8, 4); box(r, 160, 24, 10, 6, ['#5e6e7e', '#465464', '#34404c', '#242c34']); px(r, '#c8c4b4', 162, 26);
    // a bookshelf by the right wall, half emptied
    shade(212, 36, 12, 32); box(r, 208, 28, 14, 36, wood);
    for (var sy = 34; sy < 62; sy += 9) { R(r, wood[3], 210, sy, 10, 1); for (var bk = 0; bk < 3; bk++) if ((sy + bk) % 4) R(r, ['#8a4028', '#3a5068', '#5e6444', '#a8984e'][(sy + bk) % 4], 211 + bk * 3, sy - 6, 2, 6); }
    // a table and a chair, a mug and a newspaper left on it
    shade(196, 90, 34, 14); box(r, 193, 84, 30, 14, wood); R(r, '#ece6d8', 197, 86, 10, 7); R(r, '#6e6a62', 198, 88, 8, 1); R(r, '#6e6a62', 198, 90, 6, 1);
    vol(r, 214, 88, 3, 3, ['#e8e0c8', '#c8503a', '#8a4028', '#6a3424']);
    box(r, 198, 98, 2, 10, wood); box(r, 216, 98, 2, 10, wood);
    shade(198, 106, 14, 6); box(r, 196, 100, 12, 10, wood); R(r, wood[0], 196, 100, 12, 1);
    // a moving box, a tipped trash bin
    shade(20, 136, 14, 10); box(r, 17, 128, 14, 12, ['#d2ac74', '#c09a64', '#a6824e', '#86683c']); R(r, '#a8aca8', 17, 133, 14, 2); R(r, '#1c1a18', 20, 130, 6, 1);
    box(r, 194, 130, 10, 10, ['#9aa0a0', '#7e8484', '#626868', '#464a4a']); R(r, '#e8e4d8', 188, 136, 5, 3); px(r, '#c8503a', 190, 140); R(r, '#c8c4b4', 184, 142, 4, 2);
    // the rug: a braided oval in flat rings
    [['#7a3e26', 34, 17], ['#a8583a', 28, 13], ['#c8a050', 19, 8], ['#8a4028', 9, 4]].forEach(function (o) { r.fillStyle = o[0]; r.beginPath(); r.ellipse(128, 96, o[1], o[2], 0, 0, 7); r.fill(); });
    // things dropped on the floor: a shirt, a shoe, a magazine, a backpack strap, a spilled pill bottle
    R(r, '#5e7aa0', 150, 118, 9, 5); R(r, '#46647e', 148, 119, 3, 3); R(r, '#46382c', 70, 122, 5, 2); R(r, '#46382c', 76, 124, 5, 2);
    R(r, '#e8c88a', 40, 92, 10, 7); R(r, '#c8503a', 41, 93, 8, 2); R(r, '#ece6d8', 90, 150, 6, 3); px(r, '#e8e4d8', 97, 151); px(r, '#e8e4d8', 99, 152);
    // the closed door in the bottom wall, the knob lit, a towel shoved under it
    R(r, wood[3], 110, 160, 20, 16); box(r, 112, 160, 16, 15, wood);
    R(r, wood[2], 114, 162, 12, 5); R(r, wood[2], 114, 169, 12, 5); px(r, '#e8d08a', 125, 167); R(r, '#c8c4b4', 112, 158, 16, 2);
    return c;
  }
  screens.room = {
    enter: function () {
      var m = S.run.map, open = function (x, y) { return !solid(x, y); };
      var at = solid(m.x, m.y) ? StudioMove.nearestOpen(m.x, m.y, RW, RH, open) : [m.x, m.y];
      StudioMove.place(me, at[0], at[1], m.dir || 'down'); mv.held = []; roomMenu = null;
      if (!S.run.seen.intro) roomNote = ["Weeks since it started.", "It's quiet out there."];
      if (!S.dice) S.dice = StudioSeed.load(S.run.dice);
      save();
    },
    tick: function () {
      if (roomMenu || roomNote || S.ask) return;
      StudioMove.update(me, StudioMove.last(mv.held), {
        passable: function (x, y) { return !solid(x, y); },
        busy: function () { return false; },
        arrive: function () { S.run.map.x = me.x; S.run.map.y = me.y; S.run.map.dir = me.dir; save(); }
      });
      if (!me.mv) S.run.map.dir = me.dir;
    },
    draw: function (now) {
      var W = U.W, H = U.H, sv = S.run.surv;
      R(g, '#24261f', 0, 0, W, H);
      if (!roomCache) roomCache = drawRoomTiles();
      // the room sits under the top bar card
      var top = 62, cam = StudioMove.camera(me, RW, RH, W, H - top), ox = -cam[0], oy = top - cam[1];
      g.drawImage(roomCache, ox, oy);
      // dust turning in the window light (something moves besides you)
      for (var i = 0; i < 7; i++) { var t = now / 1000 + i * 1.7, my = 36 + ((i * 23 + t * 4) % 64), mx = 100 + (my - 32) * .5 + ((i * 37 + t * 3) % 28); LA.px(g, 'rgba(240,230,200,.55)', ox + Math.round(mx), oy + Math.round(my)); }
      // the survivor on a soft shadow
      var step = StudioMove.walkFrame(me), sp = spriteOf(sv, me.dir, step);
      var sx = ox + me.px - 1, sy = oy + me.py - 14;
      LA.shadow(g, sx + 9, sy + 28, 6, .38);
      g.drawImage(sp, sx, sy);
      // the top bar card (mockup 04): face, the four bars, day, clock and season; the place on a tab under it
      var n = sv.needs, hm = S.run.clock.min, hh = Math.floor(hm / 60), mm = hm % 60;
      var clk = ((hh + 11) % 12 + 1) + ':' + (mm < 10 ? '0' : '') + mm + (hh < 12 ? ' AM' : ' PM');
      var hh2 = LA.hud(g, W, { portrait: portraitOf(sv, moodOf(n)), food: n.hunger, hp: n.health, rest: n.sleep, san: n.san, day: S.run.clock.day, clock: clk, season: S.run.season.toUpperCase(), seasonCol: { Spring: '#8aa850', Summer: '#c8a050', Fall: '#c87a3a', Winter: '#a8c4d0' }[S.run.season] });
      g.font = F12; var tab = 'BEDROOM', tw = g.measureText(tab).width + 8;
      R(g, '#14181a', 3, hh2 + 1, tw, 11); R(g, '#4e5854', 3, hh2 + 11, tw, 1); U.text(tab, 7, hh2 + 1, F12, P.dim);
      U.hit(0, 0, W, H, function (x, y) { tapWalk(x - ox, y - oy); });
      if (roomNote) { U.narrate(roomNote); U.hit(0, 0, W, H, function () { closeNote(); }); }
      if (roomMenu) drawRoomMenu();
    },
    press: function (k) {
      if (roomNote) { if (k === 'a' || k === 'b' || k === 'start') closeNote(); return; }
      if (roomMenu) { roomMenuPress(k); return; }
      if (k === 'start') { roomMenu = 'menu'; menuSt.sel = 0; mv.held = []; return; }
      if (k === 'select') { U.toast("No one's with you."); return; }
      // L and R do nothing until Part B adds the bag and the map screens
    },
    hold: function (dir, on) { if (roomMenu || roomNote) { mv.held = []; return; } mv.held = StudioMove.hold(mv.held, dir, on); }
  };
  function closeNote() { roomNote = null; S.run.seen.intro = true; save(); }
  // a tap on the floor walks one step toward it
  function tapWalk(x, y) {
    var tx = Math.floor(x / T), ty = Math.floor(y / T), dx = tx - me.x, dy = ty - me.y;
    if (!dx && !dy) return;
    var dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
    mv.held = [dir]; setTimeout(function () { mv.held = []; }, 120);
  }
  // the Start menu (Part A: Party, Save code, Quit to title)
  function menuItems() {
    if (roomMenu === 'code') return [
      { lines: ['Export'], a: function () { save(); typeIn({ title: 'EXPORT', text: 'Copy this code and keep it somewhere safe. Import it to get this world back.', area: true, readonly: true, copy: true, value: exportCode() }); } },
      { lines: ['Import'], a: importSave }
    ];
    return [
      { lines: ['Party'], a: function () { roomMenu = null; go('party'); } },
      { lines: ['Save code'], a: function () { roomMenu = 'code'; codeSt.sel = 0; } },
      { lines: ['Quit to title'], a: function () { save(); roomMenu = null; go('title'); } }
    ];
  }
  var codeSt = { sel: 0 };
  function drawRoomMenu() {
    var items = menuItems(), st = roomMenu === 'code' ? codeSt : menuSt, h = items.length * 23 + 10, w = 116;
    R(g, 'rgba(8,10,12,.45)', 0, 0, U.W, U.H);
    U.hit(0, 0, U.W, U.H, function () { roomMenuPress('b'); });
    if (roomMenu === 'code') U.text('SAVE CODE', U.W - w - 6, 52, F8, P.warm);
    U.list({ x: U.W - w - 6, y: 62, w: w, h: h }, items, st);
  }
  function roomMenuPress(k) {
    var st = roomMenu === 'code' ? codeSt : menuSt;
    if (k === 'b' || k === 'start') { roomMenu = roomMenu === 'code' ? 'menu' : null; return; }
    U.listPress(k, menuItems(), st);
  }

  // ================= THE PARTY CARD (spec 001, 6; ui.md, Party menu, one fixed lead) =================
  var plist = StudioParty.list({
    count: function () { return 1; }, lead: function () { return 0; }, cycle: function () {},
    actions: function () { return []; }, close: function () { go('room'); }, pulse: function () { return S.run.surv.needs.health < 25; },
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
      U.hit(0, 0, 80, 20, function () { go('room'); });
    },
    press: function (k) { if (k === 'a') go('detail'); else if (k === 'start') go('room'); else plist.press(k); }
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
    press: function (k) { if (k === 'b' || k === 'a') go('party'); else if (k === 'start') go('room'); else U.listPress(k, this.items(), detSt); }
  };

  // ================= start up =================
  openSaves();
  S.run = store.get('run', null);
  if (S.run) S.dice = StudioSeed.load(S.run.dice);
  if (!store.get('record', null)) store.set('record', newRecord());
  StudioInput.start({
    press: press,
    walking: function () { return S.scr === 'room' && !roomMenu && !roomNote && !S.ask && !ovl.classList.contains('on'); },
    hold: function (dir, on) { if (S.scr === 'room') screens.room.hold(dir, on); }
  });
  window.addEventListener('pagehide', save);
  document.addEventListener('visibilitychange', function () { if (document.hidden) save(); });

  function boot() {
    resize();
    if (S.run && Studio.continued) go('room'); else go('title');
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
      menu: function () { return roomMenu; }, note: function () { return roomNote; },
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
