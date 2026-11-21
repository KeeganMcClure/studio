// Service worker: keeps the launcher and every game on the phone for offline play.
// The build fills in BUILD and ASSETS; a new build has a new BUILD, so the phone
// downloads it in the background and the shelf reloads once it is ready.
var BUILD = '__BUILD__';
var ASSETS = __ASSETS__;
var CACHE = 'studio-' + BUILD;
var FONTS = 'studio-fonts';
var FONT_CSS = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap';

// Fetch the font files up front too, so the first visit already works offline. Best effort.
function keepFonts() {
  return caches.open(FONTS).then(function (c) {
    return c.match(FONT_CSS, { ignoreVary: true }).then(function (hit) {
      if (hit) return;
      return fetch(FONT_CSS).then(function (res) {
        if (!res.ok) return;
        return res.clone().text().then(function (css) {
          var files = (css.match(/url\((https:[^)]+)\)/g) || []).map(function (m) { return m.slice(4, -1); });
          return Promise.all(files.map(function (u) {
            return fetch(u).then(function (r) { if (r.ok) return c.put(u, r); });
          })).then(function () { return c.put(FONT_CSS, res); });
        });
      });
    });
  }).catch(function () {});
}

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    // cache: 'reload' skips the browser's own cache so a new build never stores old files
    return c.addAll(ASSETS.map(function (u) { return new Request(u, { cache: 'reload' }); }));
  }).then(keepFonts).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (names) {
    return Promise.all(names.filter(function (n) { return n.indexOf('studio-') === 0 && n !== CACHE && n !== FONTS; })
      .map(function (n) { return caches.delete(n); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin === location.origin) {
    // Files from this build come from the phone; anything else is fetched and kept.
    e.respondWith(caches.open(CACHE).then(function (c) {
      return c.match(req, { ignoreSearch: true }).then(function (hit) {
        return hit || fetch(req).then(function (res) { if (res.ok) c.put(req, res.clone()); return res; });
      });
    }));
  } else if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    // Google Fonts: keep the first copy for good, across builds.
    e.respondWith(caches.open(FONTS).then(function (c) {
      return c.match(req.url, { ignoreVary: true }).then(function (hit) {
        return hit || fetch(req).then(function (res) { if (res.ok || res.type === 'opaque') c.put(req.url, res.clone()); return res; });
      });
    }));
  }
});
