// Black Lantern · seasons/season-1.js
// Season 1's data (spec 009, step 1): its regular cases in queue order, then its agency cases ({id, at, finale}: the
// number of closed regular cases that unlocks each, and which is the finale) and Big Hat's lines for each unlock and the
// season's end. A case listed here that isn't built yet simply doesn't pin.
// Agency cases are built as cases/lantern-nn.js like any case (specs 014, 015). One that isn't built yet never
// unlocks (season.js checks the case exists). Big Hat's unlock lines come with each agency case's part B (LANTERN 01's are in, Nov 23, 2026) and the
// season-end lines with the finale's. Moved here from the retired private repo on Nov 23, 2026 (Keegan's call).
registerSeason({n:1,
 regular:['still-harvest','good-manners','lot-83','lost-hour','tracking'],
 agency:[{id:'lantern-01',at:2},{id:'lantern-02',at:4},{id:'lantern-03',at:6,finale:true}],
 text:{unlock:{'lantern-01':['Sit.','Not a town this time. This one\'s ours.']},end:[]}
});
