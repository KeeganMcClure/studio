// Sarah's Sim clock and light (spec 006, part A). Life mode reads the phone's clock: no game days run faster than real ones.
// Four light looks, changing smoothly over about 20 real minutes at each edge:
//   morning (6 to 11 AM) soft gold light from the windows; daytime (11 AM to 5 PM) bright; evening (5 to 10 PM) a warm sunset
//   that turns to lamp glow; late night (10 PM to 6 AM) dark windows with stars, lamps and lamp-glow pools.
// Sandbox has no days (bible, Modes), so it keeps the approved look's cozy daylight with the lamps glowing (look-iso-v1).
(function () {
  // keyframes: minute of the day, then the look. mul is multiplied over the home (white leaves it as it is); glow is how
  // strong the lamps' pools are
  var K = [
    [0, { mul: '#53508e', sky: ['#120d22', '#2b1d3a'], glow: 1.4, dark: 1, stars: 1 }],
    [350, { mul: '#53508e', sky: ['#120d22', '#2b1d3a'], glow: 1.4, dark: 1, stars: 1 }],
    [370, { mul: '#ffd9b0', sky: ['#f2b48e', '#fde2c0'], glow: .5, dark: .15, stars: 0 }],
    [650, { mul: '#ffe6c8', sky: ['#f6c79c', '#fde8c8'], glow: .45, dark: 0, stars: 0 }],
    [670, { mul: '#ffffff', sky: ['#7fa7d8', '#d6e8f7'], glow: .3, dark: 0, stars: 0 }],
    [1010, { mul: '#ffffff', sky: ['#7fa7d8', '#d6e8f7'], glow: .3, dark: 0, stars: 0 }],
    [1030, { mul: '#ffc4a0', sky: ['#8a5a8e', '#f29a6c'], glow: .8, dark: .25, stars: 0 }],
    [1200, { mul: '#c995a8', sky: ['#3a2a5a', '#b86a6e'], glow: 1.05, dark: .55, stars: 0 }],
    [1310, { mul: '#6c639a', sky: ['#1e1636', '#4a2c55'], glow: 1.3, dark: .85, stars: 1 }],
    [1330, { mul: '#53508e', sky: ['#120d22', '#2b1d3a'], glow: 1.4, dark: 1, stars: 1 }],
    [1440, { mul: '#53508e', sky: ['#120d22', '#2b1d3a'], glow: 1.4, dark: 1, stars: 1 }]
  ];
  function hex(h) { var n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function mixHex(a, b, k) { var A = hex(a), B = hex(b); return '#' + A.map(function (v, i) { return ('0' + Math.round(v + (B[i] - v) * k).toString(16)).slice(-2); }).join(''); }
  function season(d) { var m = d.getMonth(); return m === 11 || m < 2 ? 'winter' : m < 5 ? 'spring' : m < 8 ? 'summer' : 'fall'; }
  SS.season = season;
  SS.look = function (d, mode) {
    var snow = season(d) === 'winter', december = d.getMonth() === 11;
    if (mode !== 'life') return { tint: null, sky: ['#7f9fcf', '#d6e4f3'], glow: .55, dark: 0, stars: false, snow: snow, december: december, name: 'day' };
    var m = d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60;
    for (var i = 0; i < K.length - 1; i++) if (m >= K[i][0] && m <= K[i + 1][0]) break;
    var a = K[i], b = K[i + 1], k = (m - a[0]) / Math.max(1, b[0] - a[0]);
    k = k * k * (3 - 2 * k);   // smooth edges
    var A = a[1], B = b[1], h = d.getHours(), mul = mixHex(A.mul, B.mul, k);
    return { tint: mul === '#ffffff' ? null : mul,
      sky: [mixHex(A.sky[0], B.sky[0], k), mixHex(A.sky[1], B.sky[1], k)], glow: A.glow + (B.glow - A.glow) * k, dark: A.dark + (B.dark - A.dark) * k,
      stars: (A.stars + (B.stars - A.stars) * k) > .5, snow: snow, december: december, fireworks: d.getMonth() === 6 && d.getDate() === 4,
      name: h >= 6 && h < 11 ? 'morning' : h >= 11 && h < 17 ? 'daytime' : h >= 17 && h < 22 ? 'evening' : 'late night' };
  };
  var DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'], MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  // the top bar's day, date and time: 12-hour, like her phone
  SS.dayText = function (d) { return DAYS[d.getDay()] + ' ' + MONTHS[d.getMonth()] + ' ' + d.getDate(); };
  SS.timeText = function (d) { var h = d.getHours() % 12 || 12, m = ('0' + d.getMinutes()).slice(-2); return h + ':' + m + (d.getHours() < 12 ? ' AM' : ' PM'); };
  SS.weekday = function (d) { return DAYS[d.getDay()]; };
  // the time she's playing at: the phone's clock, or, for testing, a set clock and date (?clock=21:30&date=2026-12-25, or
  // SS.setClock and SS.setDate). Only in Dev builds and the checks, never in the build Sarah plays (spec 009, Testing).
  var fixed = null, fixedDate = null;
  var testing = location.protocol === 'file:' || (window.Studio && Studio.channel === 'dev');
  try { var qs = new URLSearchParams(location.search), q = qs.get('clock'), qd = qs.get('date'); if (testing && q) { var p = q.split(':'); fixed = [+p[0], +(p[1] || 0)]; } if (testing && qd) { var dp = qd.split('-'); fixedDate = [+dp[0], +dp[1] - 1, +dp[2]]; } } catch (e) {}
  SS.setClock = function (h, m) { if (testing) fixed = h === null ? null : [h, m || 0]; };
  SS.setDate = function (y, mo, d) { if (testing) fixedDate = y === null ? null : [y, mo, d]; };
  SS.now = function () { var d = new Date(); if (fixedDate) d.setFullYear(fixedDate[0], fixedDate[1], fixedDate[2]); if (fixed) d.setHours(fixed[0], fixed[1], 0, 0); return d; };
})();
