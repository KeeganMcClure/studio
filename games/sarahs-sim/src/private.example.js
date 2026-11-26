// Sarah's Sim private data: PLACEHOLDER ONLY (bible, Overview, Private data; spec 007, Privacy).
// Keegan's real words, notes, idle-life lists, hug and kiss variations, romance details and real people's names live
// only in his private project files. They never go in this repo. At the final build he saves the real file as
// src/private.js (git ignores it) with exactly this shape, and tools/build.js builds dist-private/ from it.
// Every field below is dummy text, so the game builds and its checks run without the real data.
window.SS_PRIVATE = {
  // the first-open gift card (spec 001, part A): lines in order, then who signed it
  christmas: { lines: ['Merry Christmas,', 'Sarah.'], sign: 'Keegan' },
  // for later specs; the placeholder keeps the shape so nothing breaks when they're built
  // idle Sarah (spec 006, part D): what she's in the middle of when Life opens. PLACEHOLDER: generic entries from the bible's
  // public summary (doomscrolling, painting, reading); phone: true means she's on her phone (its battery runs down)
  sarahIdle: {
    morning: [{ text: 'Scrolling on her phone', at: 'sofa', phone: true }, { text: 'Painting', at: 'easel' }],
    daytime: [{ text: 'Scrolling on her phone', at: 'sofa', phone: true }, { text: 'Reading', at: 'bookshelf' }],
    evening: [{ text: 'Scrolling on her phone', at: 'sofa', phone: true }, { text: 'Painting', at: 'easel' }],
    lateNight: [{ text: 'Scrolling in bed', at: 'bed', phone: true }]
  },
  notes: [],
  // Keegan's idle life (spec 006, part D): what he's busy with at each time of day. Each entry: what the People card and his
  // bubble say, where he does it (a piece's Life use: desk, sofa, stove, bed, bookshelf, chair, tv), and busy: true for things
  // he can't stop (her together action waits until he's done). PLACEHOLDER: generic entries from the bible's public summary
  // (Play, Idle life: cooking, school work, gaming, reading, couch time, sleeping). The real list is in the private files.
  idleLife: {
    morning: [{ text: 'Making coffee', at: 'stove' }, { text: 'Doing school work', at: 'desk' }, { text: 'Reading', at: 'bookshelf' }],
    daytime: [{ text: 'In class', at: 'desk', busy: true }, { text: 'Doing school work', at: 'desk' }, { text: 'Gaming', at: 'sofa' }],
    evening: [{ text: 'Cooking dinner', at: 'stove' }, { text: 'Gaming', at: 'sofa' }, { text: 'Reading', at: 'bookshelf' }],
    lateNight: [{ text: 'Gaming', at: 'sofa' }, { text: 'Sleeping', at: 'bed' }]
  },
  hugs: ['A warm hug.'],
  kisses: ['A kiss.'],
  people: []
};
