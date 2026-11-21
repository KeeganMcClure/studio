// Studio link: the small piece every game shares with the launcher.
// Tells a game which build it is (Dev or Release), which save prefix to use,
// and reads the launcher's shared settings. Plain script, no framework.
// A game loads it before its own code: <script src="../../../engine/studio.js"></script>
(function () {
  var path = location.pathname;
  // Dev builds live under /dev/<game>/ on the site; everything else is Release.
  var channel = /\/dev\/[^/]+\/?(index\.html)?$/.test(path) ? 'dev' : 'release';
  var params = new URLSearchParams(location.search);

  window.Studio = {
    channel: channel,
    // True when the launcher's Continue button opened the game.
    continued: params.get('continue') === '1',
    // Dev builds keep their own saves, so testing never touches the stable one.
    // savePrefix('bl.') -> 'bl.' on Release, 'dev.bl.' on Dev.
    savePrefix: function (base) { return channel === 'dev' ? 'dev.' + base : base; },
    // Shared settings set in the launcher. Games read them and never keep their own copy.
    settings: function () {
      try { return JSON.parse(localStorage.getItem('studio.settings') || '{}'); } catch (e) { return {}; }
    },
    // Back to the game shelf. The launcher sits at the site root, one level up
    // from a Release game and two from a Dev game.
    shelfUrl: channel === 'dev' ? '../../' : '../',
    toShelf: function () { location.href = window.Studio.shelfUrl; }
  };
})();
