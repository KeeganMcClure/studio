// Sarah's Sim: coins and the shop (spec 006, part F; bible, Play, Coins and prices).
//   The shop is the catalog. In Life each card shows its price; taking a card she can afford holds the piece, and setting it down
//   buys it. A piece in storage is already hers, so it's free to place again. Her own crafts and holiday gifts show a ribbon
//   instead of a price. A bought piece can be sold back from its tray for every coin she paid, after a confirm that starts on
//   Keep (studio-bible/play.md). There are no bills, rent or running costs (bible, Nothing is lost). Sandbox has everything free.
//   During a gig (gig.js) every piece is lent free.
(function () {
  // what a catalog card costs her now: 0 when it's free (Sandbox, a gig, in storage, her own crafts), else its price
  SS.priceOf = function (G, it) {
    if (G.mode !== 'life' || G.gig) return 0;
    if (it.stored || it.def.craft || it.def.tab === 'ours') return 0;
    return it.def.price || 0;
  };
  SS.cardTag = function (G, it) { // the little line on a card: its price, FREE, or how it's earned
    if (G.gig) return { text: 'FREE', col: '#437a47', bg: '#e8f3dd' };
    if (G.mode !== 'life') return null;
    if (it.stored) return null;
    if (it.def.craft || it.def.tab === 'ours') return { text: 'YOURS', col: '#b44f63', bg: '#fde3ea' };
    return { text: String(it.def.price || 0), coin: true, col: '#3b2430', bg: '#fff6ea' };
  };
  // can she take this card? Says why not
  SS.canBuy = function (G, it) {
    var p = SS.priceOf(G, it); if (!p) return true;
    if ((G.save.coins || 0) >= p) return true;
    G.toast('NOT ENOUGH COINS', 2000, 'It\'s ' + p + ' coins and you have ' + (G.save.coins || 0) + '. Gigs at the desk pay 100 to 200.');
    return false;
  };
  // setting a new piece down buys it
  SS.payFor = function (G, p, price) {
    if (!price) return;
    G.save.coins = (G.save.coins || 0) - price; p.paid = price;
    SS.moment(G, 'bought');
    G.toast('BOUGHT', 1200, '-' + price + ' coins');
  };
  // selling back: every coin she paid, after a confirm that starts on Keep
  SS.sellBack = function (G, p) {
    if (!p || !p.paid) return;
    var d = SS.DEF[p.id];
    G.confirm = { title: 'SELL IT BACK?', text: d.name + ' sells back for every coin you paid: ' + p.paid + '. What\'s stacked on it goes to storage.', options: ['KEEP', 'SELL +' + p.paid], cur: 0, pick: function (i) {
      if (i !== 1) return;
      G.snapshot();
      G.W.stacked(p).forEach(function (q) { G.save.stored.push({ id: q.id, sw: q.sw || 0, colors: q.colors, pats: q.pats, props: q.props, paid: q.paid }); });
      G.save.coins = (G.save.coins || 0) + p.paid; G.W.remove(p); G.deselect(); G.changed(true);
      G.toast('SOLD', 1400, '+' + p.paid + ' coins');
    } };
  };
  // a room favorite in Life: what she doesn't own yet costs its price. Returns {cost, owned: [indexes into storage]}
  SS.favoriteCost = function (G, fav) {
    if (G.mode !== 'life' || G.gig) return { cost: 0, owned: {} };
    var pool = G.save.stored.map(function (s, i) { return { id: s.id, i: i }; }), owned = {}, cost = 0;
    fav.pieces.forEach(function (p, k) {
      var j = pool.findIndex(function (s) { return s.id === p.id; });
      if (j >= 0) { owned[k] = pool[j].i; pool.splice(j, 1); }
      else { var d = SS.DEF[p.id]; if (d && !d.craft && d.tab !== 'ours') cost += d.price || 0; }
    });
    return { cost: cost, owned: owned };
  };
})();
