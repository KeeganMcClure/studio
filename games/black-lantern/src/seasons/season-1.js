// Black Lantern · seasons/season-1.js
// Season 1's data (spec 009, step 1): its regular cases in queue order, then its agency cases ({id, at, finale}: the
// number of closed regular cases that unlocks each, and which is the finale) and Big Hat's lines for each unlock and the
// season's end. A case listed here that isn't built yet simply doesn't pin.
// Agency cases are built as cases/lantern-nn.js like any case (specs 014, 015). One that isn't built yet never
// unlocks (season.js checks the case exists). Big Hat's unlock lines come with each agency case's part B (LANTERN 01's are in, Nov 23, 2026) and the
// season-end lines with the finale's. Moved here from the retired private repo on Nov 23, 2026 (Keegan's call).
registerSeason({n:1,
 regular:['still-harvest','good-manners','lot-83','lost-hour','tracking','dead-air'],
 agency:[{id:'lantern-01',at:2},{id:'lantern-02',at:4},{id:'lantern-03',at:6,finale:true}],
 text:{unlock:{'lantern-01':['Sit.','Not a town this time. This one\'s ours.'],'lantern-02':['Got a letter. Addressed to us. By name.','Nobody outside this outfit knows our name.'],
  'lantern-03':['No folder this time.','Somebody upstairs took the folders. I got the address anyway.']},end:{
  clean:['Season\'s over. Go home.','Upstairs reinstated me. Nobody upstairs can tell me who suspended me in the first place.','A lot of people got let go last night. They\'re all walkin\' around this mornin\' a little lighter and they don\'t know why.','...Next season I\'m puttin\' a new photo on the board. Don\'t ask me whose.'],
  costly:['Season\'s over. Go home.','There\'s a box in a vault in Suitland with a lantern on the lid, and upstairs has a meetin\' about it every Tuesday.','I been to three. Nobody says what\'s in it. Everybody whispers.','...Next season, we find out who he was collectin\' for. I got a feelin\' it ain\'t gonna be polite.'],
  worst:['Season\'s over. I don\'t care. Go home.','He\'s out there with half a book and all the time in the world.','Every signature you hear about, every miracle on the local news. That\'s him. That\'s us, next season.','...Get some sleep. I ain\'t gonna.']}}
});
