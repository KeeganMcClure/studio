// Black Lantern · seasons/season-1.js
// Season 1's data (spec 009, step 1): its regular cases in queue order, then its agency cases ({id, at, finale}: the
// number of closed regular cases that unlocks each, and which is the finale) and Big Hat's lines for each unlock and the
// season's end. A case listed here that isn't built yet simply doesn't pin.
// Agency cases: none listed here, on purpose. Their ids, unlock counts, which one is the finale and the season-end lines
// live in the private KeeganMcClure/black-lantern repo (agency/season-1.js), since this repo is public (bible, Tech →
// File and code). tools/build.js bundles that file in and registerAgency (season.js) merges it into this season. A
// local build without it holds the regular cases only; the Dev build's test season (seasons/test-season.js) still
// exercises unlocks, the finale and the season end.
registerSeason({n:1,
 regular:['still-harvest','good-manners','lot-83'],
 agency:[],
 text:{unlock:{},end:[]}
});
