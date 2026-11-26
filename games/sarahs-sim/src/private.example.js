// Sarah's Sim private data: PLACEHOLDER ONLY (bible, Overview, Private data; spec 007, Privacy).
// Keegan's real words, notes, idle-life lists, hug and kiss variations, romance details and real people's names live
// only in his private project files. They never go in this repo. At the final build he saves the real file as
// src/private.js (git ignores it) with exactly this shape, and tools/build.js builds dist-private/ from it.
// Every field below is dummy text, so the game builds and its checks run without the real data.
window.SS_PRIVATE = {
  // the first-open gift card (spec 001, part A): lines in order, then who signed it
  christmas: { lines: ['Merry Christmas,', 'Sarah.'], sign: 'Keegan' },
  // for later specs; the placeholder keeps the shape so nothing breaks when they're built
  notes: [],
  idleLife: { morning: [], daytime: [], evening: [], lateNight: [] },
  hugs: ['A warm hug.'],
  kisses: ['A kiss.'],
  people: []
};
