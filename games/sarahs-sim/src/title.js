// Sarah's Sim title scenes (spec 001, part A; bible, Title and cover), ported from the approved mockups/title-v1.js:
// the snowy red-brick rowhouse at night, the first-open gift and the game's name. This build draws winter with December's
// lights (spec 001: winter first; the other three seasons follow).
(function () {
  var c;
  var INK = '#3b2430';
  var P = { sky0: '#171127', sky1: '#2b1d3a', sky2: '#4a2c45', brick: ['#b9584a', '#9c463b', '#7d3530'], brickL: ['#a8786a', '#8c6155', '#6e4a42'], brickR: ['#8f5b6a', '#774a58', '#5c3846'],
    cream: '#fff1e2', creamSh: '#e3cdb8', snow: '#f4f1fb', snowSh: '#c9c3dc', glass: ['#ffe3a0', '#ffc96e', '#f0a95a'], rose: '#e46f8b', roseHi: '#f39bb0', roseSh: '#b44f63', gold: '#ffd56b', goldSh: '#c78f3e', tray: '#fff6ea', trayEdge: '#e8cdb4', ink: '#6b4250', soft: '#b38a8f' };
  function R(x, y, w, h, col) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
  function txt(s, x, y, col, size, align) { c.font = (size || 8) + 'px "Press Start 2P", monospace'; c.fillStyle = col; c.textAlign = align || 'left'; c.textBaseline = 'top'; c.fillText(s, x, y); }
  function heart(x, y, col, s) { s = s || 1; [[1, 0, 2], [4, 0, 2], [0, 1, 7], [0, 2, 7], [1, 3, 5], [2, 4, 3], [3, 5, 1]].forEach(function (r) { R(x + r[0] * s, y + r[1] * s, r[2] * s, s, col); }); }
  function rnd(i) { var x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
  function glow(x, y, r, a) { var g = c.createRadialGradient(x, y, 1, x, y, r); g.addColorStop(0, 'rgba(255,214,140,' + a + ')'); g.addColorStop(1, 'rgba(255,214,140,0)'); c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2); }

  function sky(W, H, t, s) {
    var g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, P.sky0); g.addColorStop(.55, P.sky1); g.addColorStop(1, P.sky2); c.fillStyle = g; c.fillRect(0, 0, W, H);
    for (var i = 0; i < 40 * s; i++) { var x = rnd(i) * W, y = rnd(i + 99) * H * .45, tw = (Math.floor(t / 2) + i) % 7 === 0; R(x, y, 1, 1, tw ? '#ffffff' : 'rgba(255,241,226,.55)'); }
  }
  function moon(x, y, r) { glow(x, y, r * 4, .18); c.fillStyle = '#fff3d6'; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.fillStyle = '#f0dfb8'; c.beginPath(); c.arc(x + r * .3, y - r * .2, r * .25, 0, 7); c.fill(); c.beginPath(); c.arc(x - r * .35, y + r * .3, r * .18, 0, 7); c.fill(); }
  function snowfall(W, H, t, n, big) { for (var i = 0; i < n; i++) { var sp = .6 + rnd(i + 7) * .8, x = (rnd(i) * W + Math.sin((t + i) / 3) * 2 + W) % W, y = (rnd(i + 50) * H + t * 2.2 * sp) % H; var sz = big && i % 5 === 0 ? 2 : 1; R(x, y, sz, sz, i % 3 ? 'rgba(244,241,251,.85)' : '#ffffff'); } }
  function bricks(x, y, w, h, cols) {
    R(x, y, w, h, cols[0]);
    for (var r = 0, yy = y + 3; yy < y + h; yy += 4, r++) { R(x, yy, w, 1, cols[1]); for (var xx = x + (r % 2 ? 3 : 7); xx < x + w; xx += 8) R(xx, yy - 3, 1, 3, cols[1]); }
    for (var k = 0; k < w * h / 60; k++) R(x + rnd(k + x) * w, y + rnd(k + y + 3) * h, 2, 1, 'rgba(255,200,180,.12)');
  }
  // a sash window: x,y top left, w,h; lit or dark; extra(fn) draws inside the glass
  function win(x, y, w, h, lit, t, extra, curtain) {
    R(x - 2, y - 3, w + 4, 3, '#d9cbbd'); R(x - 2, y - 3, w + 4, 1, '#f3e8dc'); // stone lintel
    R(x - 1, y, w + 2, h + 1, P.cream);
    var gx = x + 1, gy = y + 1, gw = w - 2, gh = h - 2;
    if (lit) { var g = c.createLinearGradient(0, gy, 0, gy + gh); g.addColorStop(0, P.glass[0]); g.addColorStop(1, P.glass[2]); c.fillStyle = g; c.fillRect(gx, gy, gw, gh); }
    else R(gx, gy, gw, gh, '#3a2c48');
    if (extra) { c.save(); c.beginPath(); c.rect(gx, gy, gw, gh); c.clip(); extra(gx, gy, gw, gh); c.restore(); }
    if (curtain !== false && lit) { R(gx, gy, 3, gh, P.roseSh); R(gx + 1, gy, 1, gh, P.rose); R(gx + gw - 3, gy, 3, gh, P.roseSh); R(gx + gw - 2, gy, 1, gh, P.rose); }
    R(gx, gy + Math.floor(gh / 2), gw, 1, P.cream); R(gx + Math.floor(gw / 2), gy, 1, gh, P.cream); // muntins
    R(x - 2, y + h + 1, w + 4, 2, '#d9cbbd'); R(x - 3, y + h, w + 6, 2, P.snow); R(x - 2, y + h - 1, w + 2, 1, P.snow); // sill with snow
    if (lit) glow(x + w / 2, y + h / 2, w * 1.2, .14);
  }
  function catSit(x, y) { // Louie on the sill: grey with a white blaze up his nose, white chest and paws
    var G = '#8d8a98', GD = '#6e6a7a', Wt = '#f1eef4';
    R(x, y - 7, 7, 7, G); R(x + 5, y - 7, 2, 7, GD);           // body
    R(x + 2, y - 5, 3, 4, Wt); R(x + 1, y - 1, 2, 1, Wt); R(x + 4, y - 1, 2, 1, Wt); // chest and paws
    R(x + 1, y - 12, 6, 5, G); R(x + 5, y - 12, 2, 5, GD);    // head
    R(x + 1, y - 13, 1, 1, G); R(x + 6, y - 13, 1, 1, GD);    // ears
    R(x + 3, y - 12, 2, 5, Wt);                               // blaze up the nose
    R(x + 2, y - 10, 1, 1, '#c9d98a'); R(x + 5, y - 10, 1, 1, '#c9d98a'); // sleepy yellow-green eyes
    R(x + 7, y - 3, 2, 1, G); R(x + 8, y - 5, 1, 2, G);       // tail
  }
  function catLoaf(x, y, coat) { R(x, y - 4, 9, 4, coat[1]); R(x, y - 4, 9, 1, coat[0]); R(x + 6, y - 7, 5, 4, coat[1]); R(x + 6, y - 7, 4, 2, coat[0]); R(x + 6, y - 8, 1, 1, coat[0]); R(x + 9, y - 8, 1, 1, coat[1]); R(x + 7, y - 5, 1, 1, '#3b2430'); R(x + 9, y - 5, 1, 1, '#3b2430'); for (var s = 1; s < 6; s += 2) R(x + s, y - 3, 1, 2, '#d9773e'); }
  function tinyTree(x, y, h, t) {
    for (var r = 0; r < h; r++) { var hw = Math.floor(r * .45) + 1; R(x - hw, y - h + r, hw * 2 + 1, 1, r % 3 === 2 ? '#2f5a3b' : '#3f6e4a'); }
    var cols = ['#ffd56b', '#e46f8b', '#8fd0ff', '#fff3a8'];
    for (var i = 0; i < 8; i++) { var ry = Math.floor(h * (.25 + .09 * i)), rx = Math.round((rnd(i + 3) - .5) * ry * .8); R(x + rx, y - h + ry, 1, 1, (Math.floor(t / 2) + i) % 4 ? cols[i % 4] : '#5a5060'); }
    R(x, y - h - 1, 1, 1, P.gold);
  }
  function wreath(x, y) { c.strokeStyle = '#3f6e4a'; c.lineWidth = 3; c.beginPath(); c.arc(x, y, 5, 0, 7); c.stroke(); c.lineWidth = 1; [[-4, -2], [3, -3], [0, 4], [-2, 3]].forEach(function (b) { R(x + b[0], y + b[1], 1, 1, '#e46f6a'); }); R(x - 2, y + 4, 5, 2, P.rose); R(x - 1, y + 6, 1, 2, P.roseSh); R(x + 1, y + 6, 1, 2, P.roseSh); }

  // the full rowhouse scene. gy = sidewalk line.
  function street(W, H, t, gy, top0) {
    var HT = gy - top0, top = top0, hx = 68, hw = 104;
    // neighbors
    bricks(-6, top + 12, hx + 6, HT - 12, P.brickL); bricks(hx + hw, top + 8, W - hx - hw + 6, HT - 8, P.brickR);
    [[-6, top + 12, hx + 6], [hx + hw, top + 8, W - hx - hw + 6]].forEach(function (n) { R(n[0], n[1] - 6, n[2], 6, '#d2c2b4'); R(n[0], n[1] - 8, n[2], 3, P.snow); for (var b = n[0] + 4; b < n[0] + n[2]; b += 9) R(b, n[1] - 3, 2, 3, '#b8a798'); });
    win(14, top + 30, 20, 30, false, t); win(42, top + 30, 20, 30, true, t); win(14, top + 78, 20, 30, true, t, function (x, y, w, h) { R(x, y + h - 6, w, 6, '#7d4c30'); }, false);
    win(186, top + 26, 20, 30, true, t); win(214, top + 26, 20, 30, false, t); win(186, top + 74, 20, 30, false, t); win(214, top + 74, 20, 30, true, t);
    // a neighbor's door and stoop on the right
    R(214, gy - 40, 18, 32, '#2f4a5e'); R(213, gy - 41, 20, 1, P.cream);
    // the home: red brick, three floors, a cornice and a white marble stoop
    bricks(hx, top, hw, HT, P.brick);
    R(hx, top, 3, HT, 'rgba(0,0,0,.18)'); R(hx + hw - 3, top, 3, HT, 'rgba(0,0,0,.25)');
    // cornice with brackets, snow on top
    R(hx - 4, top - 10, hw + 8, 10, P.cream); R(hx - 4, top - 2, hw + 8, 2, P.creamSh); for (var b = hx; b < hx + hw; b += 10) { R(b, top - 1, 4, 5, P.cream); R(b, top + 3, 4, 1, P.creamSh); }
    R(hx - 5, top - 14, hw + 10, 5, P.snow); R(hx - 3, top - 15, hw + 4, 1, '#ffffff'); for (var d = hx; d < hx + hw; d += 13) R(d, top - 9, 6, 2, P.snow);
    R(hx + hw - 22, top - 24, 12, 10, P.brick[1]); R(hx + hw - 24, top - 26, 16, 3, P.snow); // chimney
    var sm = t % 8; c.fillStyle = 'rgba(220,210,235,.35)'; c.beginPath(); c.arc(hx + hw - 16 + sm * .7, top - 28 - sm, 2 + sm * .2, 0, 7); c.fill();
    // floors 3 and 2
    win(hx + 14, top + 12, 24, 34, true, t); win(hx + 66, top + 12, 24, 34, false, t, function (x, y, w, h) { R(x + 4, y + 6, 16, 3, '#55405e'); }, false);
    win(hx + 14, top + 60, 24, 34, true, t);
    win(hx + 66, top + 60, 24, 34, true, t, function (x, y, w, h) { catSit(x + 3, y + h - 4); catLoaf(x + 11, y + h - 4, ['#f0a25e', '#d9773e']); }, true);
    // first floor: door with transom and wreath on the left, big window with the tree on the right
    var dx = hx + 12, dy = gy - 54;
    R(dx - 3, dy - 10, 30, 3, '#d9cbbd'); R(dx - 2, dy - 7, 28, 7, P.cream); var tg = c.createLinearGradient(0, dy - 6, 0, dy); tg.addColorStop(0, P.glass[0]); tg.addColorStop(1, P.glass[2]); c.fillStyle = tg; c.fillRect(dx, dy - 6, 24, 5); for (var m = dx + 4; m < dx + 24; m += 5) R(m, dy - 6, 1, 5, P.cream);
    R(dx - 2, dy, 28, 40, P.cream); R(dx, dy + 1, 24, 39, '#3d6b5c'); R(dx + 2, dy + 3, 9, 15, '#4a7d6c'); R(dx + 13, dy + 3, 9, 15, '#4a7d6c'); R(dx + 2, dy + 21, 9, 16, '#4a7d6c'); R(dx + 13, dy + 21, 9, 16, '#4a7d6c'); R(dx + 19, dy + 21, 2, 2, P.gold);
    wreath(dx + 12, dy + 12);
    glow(dx + 12, dy - 4, 26, .2); R(dx + 27, dy + 6, 3, 5, '#2f2430'); R(dx + 27, dy + 6, 3, 3, P.glass[0]); // porch light
    win(hx + 54, gy - 52, 40, 32, true, t, function (x, y, w, h) { tinyTree(x + w / 2 + 4, y + h, 24, t); }, true);
    // white marble stoop, with snow, and an iron railing
    var sx = dx - 6;
    for (var s = 0; s < 3; s++) { R(sx - s * 3, gy - 14 + s * 5, 36 + s * 6, 5, s % 2 ? '#e9e4ee' : '#f3eff6'); R(sx - s * 3, gy - 10 + s * 5, 36 + s * 6, 1, '#c9c3dc'); R(sx - s * 3 + 2, gy - 15 + s * 5, 30 + s * 6, 2, P.snow); }
    c.strokeStyle = '#2f2430'; c.beginPath(); c.moveTo(sx + 36 + 6, gy - 30); c.lineTo(sx + 42, gy); c.moveTo(sx - 8, gy - 30 + 14); c.lineTo(sx - 8, gy); c.stroke();
    // sidewalk and snow
    R(0, gy, W, H - gy, '#8c7c94'); for (var bx = 0; bx < W; bx += 12) R(bx, gy, 1, H - gy, '#7a6a82');
    R(0, gy, W, 4, P.snow); for (var k = 0; k < W; k += 7) R(k, gy + 3, 4 + (k % 3), 2, P.snow);
    R(hx, gy - 3, hw, 3, P.snow); R(0, gy - 2, hx, 2, P.snow); R(hx + hw, gy - 2, W - hx - hw, 2, P.snow);
    // a street lamp on the left
    var lx = 30; R(lx, gy - 70, 2, 70, '#2f2430'); R(lx - 4, gy - 78, 10, 8, '#2f2430'); R(lx - 3, gy - 77, 8, 6, P.glass[0]); R(lx - 5, gy - 80, 12, 2, P.snow); glow(lx + 1, gy - 74, 34, .3);
  }

  function titleText(W, y) {
    c.font = '16px "Press Start 2P", monospace'; c.textAlign = 'center'; c.textBaseline = 'top';
    c.fillStyle = INK; [[-2, 0], [2, 0], [0, -2], [0, 2], [2, 2], [-2, 2], [2, -2], [-2, -2]].forEach(function (o) { c.fillText("SARAH'S SIM", W / 2 + o[0], y + o[1]); });
    c.fillStyle = P.roseSh; c.fillText("SARAH'S SIM", W / 2, y + 2);
    c.fillStyle = P.gold; c.fillText("SARAH'S SIM", W / 2, y);
    var gy = y + 22; txt('A COZY LIFE', W / 2, gy, 'rgba(255,241,226,.85)', 6, 'center'); heart(W / 2 + 37, gy, P.roseHi);
  }

  function gift(W, H, t, open) {
    open = open || 0;
    var g = c.createRadialGradient(W / 2, H / 2, 10, W / 2, H / 2, H * .7); g.addColorStop(0, '#4a2c45'); g.addColorStop(1, '#171127'); c.fillStyle = g; c.fillRect(0, 0, W, H);
    snowfall(W, H, t, 70, true);
    var bw = 132, bh = 96, bx = (W - bw) / 2, by = H / 2 - 30, wob = (t % 10 < 2) ? (t % 2 ? 1 : -1) : 0;
    c.save(); c.translate(wob, 0);
    c.fillStyle = 'rgba(0,0,0,.3)'; c.beginPath(); c.ellipse(W / 2, by + bh + 4, bw * .6, 8, 0, 0, 7); c.fill();
    // box with polka dots
    R(bx, by, bw, bh, P.rose); R(bx + bw - 14, by, 14, bh, P.roseSh); R(bx, by, bw, 2, P.roseHi);
    for (var i = 0; i < 9; i++) for (var j = 0; j < 7; j++) if ((i + j) % 2 === 0) R(bx + 6 + i * 14, by + 8 + j * 13, 3, 3, 'rgba(255,241,226,.55)');
    // lid (lifts off as she pulls the ribbon)
    c.save(); c.translate(0, -open * 70); c.globalAlpha = Math.max(0, 1 - open * 1.2);
    R(bx - 6, by - 18, bw + 12, 20, P.roseHi); R(bx - 6, by, bw + 12, 2, P.roseSh); R(bx + bw - 8, by - 18, 14, 20, P.rose); for (var k = 0; k < 10; k++) R(bx + 2 + k * 14, by - 12, 3, 3, 'rgba(255,241,226,.6)');
    c.strokeStyle = INK; c.strokeRect(bx + .5, by + .5, bw - 1, bh - 1); c.strokeRect(bx - 5.5, by - 17.5, bw + 11, 19);
    c.restore();
    // gold ribbon
    R(W / 2 - 7, by - 18, 14, bh + 18, P.gold); R(W / 2 - 7, by - 18, 3, bh + 18, '#ffe9a6'); R(W / 2 + 4, by - 18, 3, bh + 18, P.goldSh);
    R(bx, by + bh / 2 - 6, bw, 12, P.gold); R(bx, by + bh / 2 - 6, bw, 3, '#ffe9a6'); R(bx, by + bh / 2 + 3, bw, 3, P.goldSh);
    c.save(); c.translate(0, -open * 90); c.globalAlpha = Math.max(0, 1 - open * 1.2);
    // bow
    var cx = W / 2, cy = by - 22;
    c.fillStyle = P.gold; c.beginPath(); c.ellipse(cx - 15, cy, 15, 9, -.35, 0, 7); c.fill(); c.beginPath(); c.ellipse(cx + 15, cy, 15, 9, .35, 0, 7); c.fill();
    c.fillStyle = P.goldSh; c.beginPath(); c.ellipse(cx - 13, cy + 1, 7, 4, -.35, 0, 7); c.fill(); c.beginPath(); c.ellipse(cx + 13, cy + 1, 7, 4, .35, 0, 7); c.fill();
    c.strokeStyle = INK; c.beginPath(); c.ellipse(cx - 15, cy, 15, 9, -.35, 0, 7); c.stroke(); c.beginPath(); c.ellipse(cx + 15, cy, 15, 9, .35, 0, 7); c.stroke();
    R(cx - 5, cy - 5, 10, 10, '#ffe08a'); c.strokeRect(cx - 4.5, cy - 4.5, 9, 9);
    // tails, the right one is the one to pull
    R(cx - 10, cy + 5, 4, 14, P.gold); R(cx - 12, cy + 18, 4, 4, P.gold); R(cx + 6, cy + 5, 4, 18, P.gold); R(cx + 8, cy + 22, 4, 4, P.gold);
    c.restore();
    // tag
    var tx = bx + 14, ty = by + 20; c.strokeStyle = P.cream; c.beginPath(); c.moveTo(W / 2 - 7, by + bh / 2 - 6); c.lineTo(tx + 41, ty + 3); c.stroke();
    R(tx, ty, 46, 24, P.cream); R(tx, ty + 23, 46, 1, P.creamSh); R(tx + 40, ty + 2, 3, 3, INK);
    txt('TO SARAH', tx + 3, ty + 5, P.ink, 5); heart(tx + 19, ty + 14, P.rose);
    c.restore();
    var fy = cy + 30 + (t % 4 < 2 ? 0 : 2); c.fillStyle = 'rgba(255,255,255,.45)'; c.beginPath(); c.arc(cx + 10, fy, 7, 0, 7); c.fill(); c.strokeStyle = 'rgba(255,255,255,.95)'; c.stroke();
    if (open > 0) { for (var q = 0; q < 18; q++) { var bx2 = W / 2 + (SS.rnd(q + 40) - .5) * 160 * open, by2 = by - 20 + (SS.rnd(q + 80) - .3) * 200 * open; R(bx2, by2, 2, 3, q % 3 ? P.gold : P.rose); } return; }
    txt('TAP TO PULL THE RIBBON', W / 2, H - 34, 'rgba(255,241,226,' + (t % 4 < 2 ? .95 : .6) + ')', 6, 'center');
  }


  SS.titleArt = {
    use: function (ctx) { c = ctx; },
    sky: sky, moon: moon, street: street, snowfall: snowfall, titleText: titleText, gift: gift, heart: heart, txt: txt, R: R, P: P, rnd: rnd
  };
})();
