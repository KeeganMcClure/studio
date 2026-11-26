// Studio backup file: every save key a game keeps, written to one file the player saves to the phone's Files, and read
// back on another phone (first built for Sarah's Sim spec 001: its bible's Saves sets a file, not a text code, as its
// named exception to studio-bible/saves.md). Knows nothing about any game.
//
//   StudioBackup.collect(prefix)            {key without prefix: value} for every localStorage key under the prefix
//   StudioBackup.file(o)                    makes the backup: o = {game, prefix, version, name}. On a phone that can share
//                                           files (iOS), the share sheet opens so it can go to Files; elsewhere it downloads.
//                                           Resolves to 'shared', 'downloaded' or 'cancelled'.
//   StudioBackup.pick()                     lets the player choose a file; resolves to the text inside, or null
//   StudioBackup.read(text, game)           the backup object {game, version, made, keys}, or null when it isn't one of ours
//   StudioBackup.restore(obj, prefix, keep) replaces every key under the prefix with the backup's (keys listed in keep
//                                           stay as they are on this phone)
(function () {
  function collect(prefix) {
    var out = {};
    for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k.indexOf(prefix) === 0) out[k.slice(prefix.length)] = localStorage.getItem(k); }
    return out;
  }
  function file(o) {
    var obj = { game: o.game, version: o.version, made: new Date().toISOString(), keys: collect(o.prefix) };
    var text = JSON.stringify(obj), name = o.name || (o.game + '-backup.json');
    var blob = new Blob([text], { type: 'application/json' });
    var f = null; try { f = new File([blob], name, { type: 'application/json' }); } catch (e) {}
    if (f && navigator.canShare && navigator.share && navigator.canShare({ files: [f] })) {
      return navigator.share({ files: [f], title: name }).then(function () { return 'shared'; }, function () { return 'cancelled'; });
    }
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    return Promise.resolve('downloaded');
  }
  function pick() {
    return new Promise(function (res) {
      var inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.json,application/json,text/plain';
      inp.style.display = 'none'; document.body.appendChild(inp);
      inp.addEventListener('change', function () {
        var f = inp.files && inp.files[0]; inp.remove();
        if (!f) return res(null);
        var r = new FileReader(); r.onload = function () { res(String(r.result)); }; r.onerror = function () { res(null); }; r.readAsText(f);
      });
      inp.click();
    });
  }
  function read(text, game) {
    try { var o = JSON.parse(text); return o && o.game === game && o.keys && typeof o.keys === 'object' ? o : null; } catch (e) { return null; }
  }
  function restore(obj, prefix, keep) {
    keep = keep || [];
    Object.keys(collect(prefix)).forEach(function (k) { if (keep.indexOf(k) < 0) localStorage.removeItem(prefix + k); });
    Object.keys(obj.keys).forEach(function (k) { if (keep.indexOf(k) < 0) localStorage.setItem(prefix + k, obj.keys[k]); });
  }
  window.StudioBackup = { collect: collect, file: file, pick: pick, read: read, restore: restore };
})();
