// Black Lantern · seasons/season-1.js
// Season 1's data (spec 009, step 1): its regular cases in queue order, then its agency cases ({id, at, finale}: the
// number of closed regular cases that unlocks each, and which is the finale) and Big Hat's lines for each unlock and the
// season's end. A case listed here that isn't built yet simply doesn't pin.
// Agency cases: none listed, on purpose. Their unlock counts, which one is the finale and the season-end lines live in
// the private arc file, and Keegan decided (Nov 22) they stay out of this repo, since it's public. They'll reach the game
// by a private route when the agency cases are built. Until then the season holds its regular cases only, and the Dev
// build's test season (seasons/test-season.js) exercises unlocks, the finale and the season end.
registerSeason({n:1,
 regular:['still-harvest','good-manners','lot-83'],
 agency:[],
 text:{unlock:{},end:[]}
});
