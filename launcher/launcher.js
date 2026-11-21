// Game Shelf launcher: shelf of covers, Continue, Dev/Release toggle, save export and import.
// Reads games.json, which the build writes from each game's game.json (studio-bible/launcher.md).
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} },
    keys: function () { var out = []; try { for (var i = 0; i < localStorage.length; i++) out.push(localStorage.key(i)); } catch (e) {} return out; }
  };
  var data = { build: '', release: [], dev: [] };
  var channel = store.get('studio.channel') === 'dev' ? 'dev' : 'release';

  function prefixFor(game, ch) { return (ch === 'dev' ? 'dev.' : '') + game.savePrefix; }
  function hasSave(game, ch) {
    var p = prefixFor(game, ch);
    return store.keys().some(function (k) { return k.indexOf(p) === 0; });
  }
  function gameUrl(game, ch) { return (ch === 'dev' ? 'dev/' : '') + game.id + '/'; }

  // Covers: each game's cover code draws on a 120 x 80 canvas. Run it with its own
  // StudioCovers table so the Dev and Release versions of a cover never mix.
  var coverCode = {};
  function drawCover(canvas, game, ch) {
    var url = (ch === 'dev' ? 'dev/' : '') + 'covers/' + game.id + '.js';
    var p = coverCode[url] || (coverCode[url] = fetch(url).then(function (r) { if (!r.ok) throw 0; return r.text(); }));
    var ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    p.then(function (code) {
      var fake = { StudioCovers: {} };
      new Function('window', code)(fake);
      ctx.clearRect(0, 0, 120, 80);
      fake.StudioCovers[game.id](ctx);
    }).catch(function () {
      ctx.fillStyle = '#1c1733'; ctx.fillRect(0, 0, 120, 80);
      ctx.fillStyle = '#ffd166'; ctx.font = '8px "Press Start 2P", monospace'; ctx.textBaseline = 'top';
      ctx.fillText(game.title.toUpperCase().slice(0, 13), 6, 36);
    });
  }

  function render() {
    $('chip').hidden = channel !== 'dev';
    document.querySelectorAll('#channel button').forEach(function (b) { b.classList.toggle('on', b.dataset.ch === channel); });
    var list = data[channel] || [];
    var shelf = $('shelf');
    shelf.textContent = '';
    list.forEach(function (game) {
      var card = document.createElement('div'); card.className = 'game';
      var cover = document.createElement('button'); cover.className = 'cover'; cover.setAttribute('aria-label', game.title);
      var cv = document.createElement('canvas'); cv.width = 120; cv.height = 80;
      cover.appendChild(cv); card.appendChild(cover);
      cover.onclick = function () { location.href = gameUrl(game, channel); };
      drawCover(cv, game, channel);
      if (hasSave(game, channel)) {
        var c = document.createElement('button'); c.className = 'cont'; c.textContent = 'CONTINUE';
        c.onclick = function () { location.href = gameUrl(game, channel) + '?continue=1'; };
        card.appendChild(c);
      }
      shelf.appendChild(card);
    });
    $('empty').hidden = list.length > 0;
    $('empty').textContent = channel === 'release' && data.dev.length
      ? 'Nothing released yet. Switch to Dev in Settings to play the newest builds.'
      : 'No games yet.';
  }

  // Settings sheet
  $('openSettings').onclick = function () { $('sheet').hidden = false; };
  $('closeSettings').onclick = function () { $('sheet').hidden = true; note(''); };
  $('sheet').onclick = function (e) { if (e.target === $('sheet')) $('closeSettings').onclick(); };
  document.querySelectorAll('#channel button').forEach(function (b) {
    b.onclick = function () { channel = b.dataset.ch; store.set('studio.channel', channel); render(); };
  });

  function note(s, bad) { $('note').textContent = s; $('note').className = 'note' + (bad ? ' bad' : ''); }

  // Save export and import (studio-bible/saves.md): one text code holding every
  // registered game's keys, Release and Dev, plus the launcher's shared settings.
  function allGames() {
    var seen = {}, out = [];
    data.release.concat(data.dev).forEach(function (g) { if (!seen[g.id]) { seen[g.id] = 1; out.push(g); } });
    return out;
  }
  function ownedBy(k, games) {
    if (k === 'studio.settings') return true;
    return games.some(function (g) { return k.indexOf(g.savePrefix) === 0 || k.indexOf('dev.' + g.savePrefix) === 0; });
  }
  function b64(s) { return btoa(unescape(encodeURIComponent(s))); }
  function unb64(s) { return decodeURIComponent(escape(atob(s))); }

  $('export').onclick = function () {
    var games = allGames(), keys = {};
    store.keys().filter(function (k) { return ownedBy(k, games); }).sort().forEach(function (k) { keys[k] = store.get(k); });
    var n = Object.keys(keys).length;
    if (!n) { note('No saves to export yet.', true); return; }
    $('code').value = 'STUDIO1.' + b64(JSON.stringify({ studio: 1, exported: new Date().toISOString(), build: data.build, keys: keys }));
    $('copy').hidden = false;
    note('Exported ' + n + ' save ' + (n === 1 ? 'entry' : 'entries') + '. Tap Copy Code and keep it safe.');
  };
  $('copy').onclick = function () {
    var t = $('code');
    var done = function () { note('Copied.'); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t.value).then(done, function () { t.select(); note('Select the code and copy it.'); });
    else { t.select(); try { document.execCommand('copy'); done(); } catch (e) { note('Select the code and copy it.'); } }
  };

  var armed = null;
  $('import').onclick = function () {
    var raw = $('code').value.replace(/\s+/g, '');
    var save;
    try {
      if (raw.indexOf('STUDIO1.') !== 0) throw 0;
      save = JSON.parse(unb64(raw.slice(8)));
      if (save.studio !== 1 || !save.keys || typeof save.keys !== 'object') throw 0;
      Object.keys(save.keys).forEach(function (k) { if (typeof save.keys[k] !== 'string') throw 0; });
    } catch (e) { armed = null; note("That code doesn't look right. Paste the whole code.", true); return; }
    var games = allGames();
    // Only touch games that are in the code, so importing one game never wipes another.
    var prefixes = [];
    games.forEach(function (g) {
      [g.savePrefix, 'dev.' + g.savePrefix].forEach(function (p) {
        if (Object.keys(save.keys).some(function (k) { return k.indexOf(p) === 0; })) prefixes.push(p);
      });
    });
    var names = games.filter(function (g) { return prefixes.indexOf(g.savePrefix) >= 0 || prefixes.indexOf('dev.' + g.savePrefix) >= 0; }).map(function (g) { return g.title; });
    if (armed !== raw) {
      armed = raw;
      note('This replaces saves for: ' + (names.join(', ') || 'settings only') + '. Tap Import again to confirm.', true);
      return;
    }
    armed = null;
    // Keep what we overwrite, in case the code was the wrong one.
    var before = {};
    store.keys().forEach(function (k) {
      if (prefixes.some(function (p) { return k.indexOf(p) === 0; })) before[k] = store.get(k);
    });
    store.set('studio.importBackup', JSON.stringify({ at: new Date().toISOString(), keys: before }));
    Object.keys(before).forEach(function (k) { store.del(k); });
    var ok = true;
    Object.keys(save.keys).forEach(function (k) { if (ownedBy(k, games)) ok = store.set(k, save.keys[k]) && ok; });
    note(ok ? 'Imported. Saves from ' + (save.exported || '').slice(0, 10) + ' are back.' : 'Some saves could not be written. Storage may be full.', !ok);
    render();
  };

  // Offline: the service worker keeps the launcher and every game for play without signal.
  var foot = $('foot');
  if ('serviceWorker' in navigator) {
    var hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.register('sw.js').then(function (reg) {
      document.addEventListener('visibilitychange', function () { if (!document.hidden) reg.update().catch(function () {}); });
      return navigator.serviceWorker.ready;
    }).then(function () { foot.dataset.offline = '1'; showFoot(); }).catch(function () {});
    // A new build took over: reload once so the shelf shows it.
    navigator.serviceWorker.addEventListener('controllerchange', function () { if (hadController) location.reload(); hadController = true; });
  }
  function showFoot() { foot.textContent = (data.build ? 'Build ' + data.build : '') + (foot.dataset.offline ? ' · ready offline' : ''); }

  fetch('games.json').then(function (r) { return r.json(); }).then(function (d) {
    data = d;
    if (channel === 'release' && !data.release.length && data.dev.length) channel = 'dev'; // nothing released yet
    showFoot();
    var f = document.fonts ? document.fonts.load('8px "Press Start 2P"').catch(function () {}) : Promise.resolve();
    f.then(render);
  }).catch(function () { $('empty').hidden = false; $('empty').textContent = "Couldn't load the shelf. Check your connection and reopen."; });
})();
