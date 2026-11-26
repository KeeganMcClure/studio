// Sarah's Sim saves (bible, Saves; spec 001, part A; studio-bible/saves.md). Keys, under the 'ss.' prefix (Dev builds keep
// their own, 'dev.ss.', engine/studio.js):
//   ss.version     the save version (1 from the first build); older saves are backed up, then each upgrade step runs
//   ss.gift        '1' once the first-open gift has been opened, for the whole game (never shows again)
//   ss.last        the mode she played last: 'sandbox' or 'life' (Continue opens it)
//   ss.sandbox     Sandbox's save: its home and pieces (and stored pieces)
//   ss.life        Life's save: its home and pieces, coins, crafts made, the painting pool's shown list
//   ss.favorites   rooms and outfits, shared by every mode (spec 001, part E, not built yet: kept empty)
//   ss.backupAt    when she last made a backup file; ss.remindAt  when the title may offer one again
// A backup file holds every key above (engine/backup.js), so importing on a new phone keeps every mode, the favorites
// and the gift.
(function () {
  var VERSION = SS.SAVE_VERSION = 1;
  var PRE = SS.PRE = (window.Studio ? Studio.savePrefix('ss.') : 'ss.');
  // upgrade steps: UPGRADES[n] turns a version n save into version n + 1. Old steps are never changed.
  var UPGRADES = {};
  function get(k) { try { return localStorage.getItem(PRE + k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(PRE + k, v); } catch (e) {} }
  SS.store = { get: get, set: set };

  SS.loadAll = function () {
    var v = +get('version') || 0, has = get('sandbox') || get('life');
    if (has && v < VERSION) {
      // back up the older saves first (studio-bible/saves.md), then run each step above the stored version, in order
      ['sandbox', 'life', 'favorites'].forEach(function (k) { var s = get(k); if (s) set('old.v' + v + '.' + k, s); });
      for (var n = v; n < VERSION; n++) if (UPGRADES[n]) ['sandbox', 'life'].forEach(function (k) { var s = get(k); if (s) set(k, JSON.stringify(UPGRADES[n](JSON.parse(s), k))); });
    }
    set('version', String(VERSION));
    if (!get('favorites')) set('favorites', '[]');
  };
  SS.modeSave = function (mode) {
    var s = get(mode);
    if (s) { try { return JSON.parse(s); } catch (e) {} }
    return null;
  };
  // a new save for a mode: the furnished Philly home (spec 001, part F; in Sandbox and Life it starts the same)
  SS.newSave = function (mode) {
    var s = { v: VERSION, mode: mode, home: 'philly', pieces: SS.World.startPieces(SS.HOMES.philly), stored: [], made: [], started: Date.now() };
    if (mode === 'life') { s.coins = 500; s.shown = { painting: [] }; }   // Life starts with 500 coins (spec 006, part A)
    return s;
  };
  SS.writeMode = function (mode, s) { s.savedAt = Date.now(); set(mode, JSON.stringify(s)); set('last', mode); SS.lastSaved = Date.now(); };
  SS.hasAnySave = function () { return !!(get('sandbox') || get('life')); };
  SS.lastMode = function () { var m = get('last'); return m && get(m) ? m : (get('life') ? 'life' : get('sandbox') ? 'sandbox' : null); };
  SS.giftOpened = function () { return get('gift') === '1'; };
  SS.markGift = function () { set('gift', '1'); };
  // the backup reminder: about once a month, once she has a save (bible, Saves, Reminders)
  var MONTH = 30 * 24 * 3600 * 1000;
  SS.wantsBackup = function () {
    if (!SS.hasAnySave()) return false;
    var now = Date.now(), at = +get('backupAt') || 0, until = +get('remindAt') || 0;
    if (!until) { set('remindAt', String(now + MONTH)); return false; }   // the first month after starting, no reminder
    return now >= until && now - at >= MONTH;
  };
  SS.notNow = function () { set('remindAt', String(Date.now() + MONTH)); };
  SS.makeBackup = function () {
    var d = new Date(), name = 'sarahs-sim-backup-' + d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2) + '.json';
    set('backupAt', String(Date.now())); set('remindAt', String(Date.now() + MONTH));
    return StudioBackup.file({ game: 'sarahs-sim', prefix: PRE, version: VERSION, name: name });
  };
  SS.readBackup = function (text) { return StudioBackup.read(text, 'sarahs-sim'); };
  SS.restoreBackup = function (obj) { StudioBackup.restore(obj, PRE); SS.loadAll(); };
})();
