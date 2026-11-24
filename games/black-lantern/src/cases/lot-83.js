// Black Lantern · cases/lot-83.js
// CASE: Lot 83 (FILE 03), the Pecan Court Apartments, Austin, Texas, in an August heat wave (spec 011).
// Part A (Nov 23, 2026): the card, every map (the court by day and tented by night, the units, the office, the laundry
// room, the storage row and the finale area), the townsfolk and Walt on the map and in the dialog box, Big Hat's own
// briefing place, and walkable maps with every door and drive going where it should.
// Part B (Nov 23, 2026): the story and play, written from the secret case file: the text block, the briefing's four
// topics, clues as keys (each opens a place or a line, each with a second way in), the lot's count, a deduction, the
// tenting at dusk as the case's one point of no return, the tented court as a danger zone with three roamers, two story
// fights, the soft clock, overstepping for a quiet case, the boss and its tuning, the debrief's facts and cover stories,
// and the endings.
// Art is cases/lot-83-art.js (window.L83A, the maps and people) and cases/lot-83-battle-art.js (window.L83B, the
// enemies, the boss's face and the battle backdrops), loaded right after this file. Needs engine.js, field.js and
// battle.js first. The whole file sits in one function so its names never meet another case's.
(function(){

// ================= TEXT =================
// Every line of the case (Voice). A list plays box by box: a plain string is narration, ['WHO', 'line'] is someone
// talking. {code} and {first} are the lead's, with pronoun tokens like {first.they} (Agent creator, Pronouns and body);
// {n}, {t} and the other one-letter keys are filled by the script.
const TEXT={
 next:{order:'Check in with Lorraine Pike, the manager. Her office is on the east side of the courtyard.',
  unit6:'Get into Unit 6 and count the lot. The office keeps spare keys. Walt\'s daughter is waiting in the parking lot.',
  day:'Day 1. Count the lot and ask around. Call in the tent crew from the van when you\'re ready for night.',
  storage:'Day 1. Walt rents a storage unit out on Highway 71: take the van. Call in the tent crew from the van when you\'re ready.',
  find:'Night 1. Under the tent. Find where it went. Something warm runs under the building.',
  pump:'Night 1. The pump room under the pool\'s deep end. Go down when you\'re ready.',home:'Get out from under the tent.'},
 phase:['DAY 1 · AFTERNOON','NIGHT 1 · UNDER THE TENT'],
 rewritten:'This case file was rewritten while you were away. Your team starts it over from the briefing, with everything they carry.',
 // ---- the briefing (the walk-in cooler of a barbecue joint off US-290) ----
 open1:'SUNDAY · 11:52 PM · 91°F',
 open2:'A text from an unlisted number: "US-290. THE SMOKEHOUSE. AROUND BACK. BRING A JACKET."',
 brief:['The walk-in cooler of a barbecue joint off US-290, closed for the night. Frost on the brisket racks. Out in the lot it\'s still ninety-one.',
  ['BIG HAT','Agent {code}. Shut the door. You\'re lettin\' the cold out.'],'He\'s sitting on an upturned pickle bucket. There isn\'t another one. You stand next to forty pounds of sausage.',
  ['BIG HAT','Pecan Court Apartments, Austin. Sixteen units, twenty-three tenants, and a fella in Unit 6 named Walt Okafor.'],
  ['BIG HAT','Walt buys dead folks\' things by the pallet and sells \'em Saturdays. Two weeks ago he bought the wrong pallet.'],
  ['BIG HAT','Three days after he opened it, the bug company quit the job at his building. Quit. Bug men don\'t quit. Bug men have seen everything.'],
  ['BIG HAT','Dog next door quit barkin\' at his door. Walt quit answerin\' his phone.']],
 briefShout:'AND NOBODY IN THE DEAD MAN\'S FAMILY WILL SAY HIS NAME.',
 brief2:['He takes his hand off his knee. There\'s frost on the knuckles. He doesn\'t seem to notice.'],
 // Big Hat's two questions (spec 013): the four topics, his two-box answer, the Case file's INTEL line. The edges are in
 // the scripts: intelOn('building') +10 Persuade with Lorraine, 'lot' +10 Search counting the lot, 'walt' +10 on
 // Denise's knock, 'tent' marks the Lantern Box and the work lights on the tented court at night.
 intel:[
  {id:'building',label:'The building',answer:['Pecan Court. Sixteen units, twenty-three people, one manager on hold with the owners since Tuesday.','Lorraine Pike. Be nice to her. Nobody\'s been nice to her since Tuesday.'],
   note:'Pecan Court: 16 units. Lorraine Pike manages it and has had a bad week. Be nice to her.'},
  {id:'lot',label:'The lot',answer:['Dead man\'s estate out of Bastrop County, sold by the pallet at an auction in Round Rock.','Family wouldn\'t say one word about him. That\'s a word. Count it careful.'],
   note:'The lot came from a dead collector\'s estate. His family won\'t talk about him. Count it carefully.'},
  {id:'walt',label:'Walt',answer:['Seventy-one. Fixed school buses for the district thirty years. Widower, fourteen months.','Quit answerin\' his phone Thursday. His daughter drove up from Houston. He won\'t open the door for her, either.'],
   note:'Walt Okafor, Unit 6. A widower. He won\'t open the door, even for his daughter, Denise.'},
  {id:'tent',label:'The tent',answer:['You\'re the bug men. Tent goes up at dusk, comes down at dawn, and nobody comes back in between.','I had the crew leave you a box under the west stairs. Mind where the work lights stand.'],
   note:'The tent goes up at dusk and comes down at dawn. Big Hat left a Lantern Box under the west stairs.'}],
 brief3:[['BIG HAT','You go in quiet. Coveralls, clipboards, a van with a bug on it. Star State Exterminatin\'. They hired you Tuesday. You been in business since Tuesday.'],
  ['BIG HAT','Find the lot. Count it. Get it out of that building before twenty-three people notice anything.']],
 brief4:[['BIG HAT','And {first}?'],['BIG HAT','Don\'t eat anything in that building that\'s already been opened.'],'He opens the cooler door for you. The heat comes in like a dog that\'s been waiting.'],
 arrive:'LOT 83. Talk to people with A. Press START for your notebook and party. Lorraine Pike, the manager, is in the office.',
 role:{Investigator:'Estate-sale guy. I know the type. Knows what everything\'s worth and nothing\'s for.',Healer:'A hundred and four. Everybody drink a water before you go in anywhere.',
  Analyst:'Tenting runs on sulfuryl fluoride. I read the label in the van. Twice.',Vanguard:'These coveralls are a size small. Whatever. Let\'s go knock on doors.',
  Lorekeeper:'A collector who painted his windows over. I would like to see that library. I would not like to own it.',Tech:'Building wifi is PECAN_GUEST. Password\'s zip-tied to the pool fence.',
  Bruiser:'Bug man. I can be a bug man.',Support:'Somebody\'s grilling. Somebody is always grilling in Texas.',Tracker:'Same little dog\'s been walked down this sidewalk four times today.',
  Confessor:'Fourteen months a widower. That\'s about when the casseroles stop coming.',Courier:'I delivered here once. Unit 12 tipped me in trading cards.',
  Undertaker:'Estate lots. Half my clients end up on a pallet in Round Rock.',Scrapper:'I could get forty bucks for that window unit. I\'m just saying.',
  Morale:'There\'s a burger place on the corner with a big orange W. After. I\'m saying after.'},
 roleAny:'Let\'s go count a dead man\'s stuff.',
 // ---- doors, the van and the day ----
 shut:'Locked. A TV going somewhere inside.',
 shutQuiet:'Locked. Nobody home.',
 tentShut:'Unit {n}. The tenant\'s gone to the motel for the night. Locked.',
 street:'Lamar Boulevard. The heat comes up off it in sheets. Not yet.',
 skirt:'The tent\'s skirt, sandbagged to the ground. Sealed till dawn.',
 van:'The van. STAR STATE EXTERMINATING, and a cartoon armadillo in a gas mask giving a thumbs-up.',
 vanOpt:{storage:'Drive to the storage row',court:'Drive back to Pecan Court',tent:'Call in the tent crew'},
 driveTo:{storage:'Twelve minutes out Highway 71. A row of orange doors in the gravel, and one light buzzing in broad day.',court:'Back to Pecan Court. The van\'s AC gives up halfway.'},
 tentNoCount:'Not yet. Big Hat said count the lot first. It\'s in Unit 6.',
 radio1:'The van\'s radio clicks on by itself. Static, then a voice like gravel in a coffee can.',
 radioAsk:'Before I send a tent crew. What came out of that box?',
 radioOpts:['A swarm. Gas the building and go home.','One of the jars hatched. It\'s nesting with Walt.','Walt did this. He\'s using the jars on purpose.'],
 radioRight:[['BIG HAT','Hatched. Nestin\'. With the widower.'],['BIG HAT','All right. Crew brings ice and a fogger and leaves \'em in the laundry room. And whatever you burn tonight, they write down as burn-off.'],['BIG HAT','Don\'t burn the building.']],
 radioNoProof:[['BIG HAT','That\'s a guess. I don\'t send ice on a guess.'],'The radio clicks off. The crew\'s coming anyway. Just no ice.'],
 radioSwarm:[['BIG HAT','A swarm. Bugs. In a building I sent you to because of a box.'],['BIG HAT','Fine. Crew\'s on the way. It\'ll take \'em an hour to set up for the wrong thing.'],'It takes them an hour and a half.'],
 radioWalt:[['BIG HAT','The widower. On purpose.'],['BIG HAT','Maybe. Lonesome men do strange things. But you go in there tonight thinkin\' that, he\'s gonna know it.']],
 hunch:'Thirty-seven jars and one of them empty from the inside. What does a thing like that want with a lonely man?',
 tentQ:'Call in the tent crew? The tent goes up for the night.',
 tentClose:'Walt\'s storage unit closes, and Lorraine, Mrs. Ybarra, Trey, Gus, Denise and Hector go to the motel till dawn.',
 turnOpts:['Go on','Not yet'],
 tented:['The tent crew works fast. Stripes go up over the roofline. Sandbags go down along the skirt.','The tenants file out to the Lone Star Motor Inn with pillows and pets. Mrs. Ybarra looks at each of you on her way past. Biscuit looks at Unit 6.',
  'Denise sits in her car at the edge of the lot a long time. Then she drives to the motel too.','The crew boss locks the last flap behind you and wishes you luck, in a voice like he means the other thing.'],
 // ---- the court at night: a danger zone ----
 night1:['Under the tent, Pecan Court is a different building. The stripes take the sky away. The work lights make little rooms of light with nothing in between.',
  'The tenants are gone. Every window unit is off, and for the first time all day you can hear the building.','It sounds like a house with somebody asleep in every room.',
  'On the east side, something pale is moving along the walkway toward the stairs, slow. It has a jar on its back. It carries the jar the way you\'d carry a baby you didn\'t want to wake.'],
 crawlerH:'A crawler carrying a jar home',
 onguardOk:'You stand in the work light and watch the dark. You learn their beats before they learn you.',onguardFail:'Somewhere past the work lights, something changes direction. You can\'t tell what.',
 boxName:'UNDER THE STAIRS',boxLook:'A cardboard box under the west stairs, with a pink gift bag inside it. The bag says THANK YOU in six fonts.',boxOpen:'Open it',
 boxLine:'Inside the gift bag, under a sheet of tissue paper and Big Hat\'s handwriting ("BUG STUFF"):',
 kenNight:[['KENNY','Oh thank God. Okay. Okay.'],['KENNY','I was gonna film the tent for my stream, and then the tent guy locked the gate, and then the things came out of the walls.'],['KENNY','There\'s like a hundred of them. I can hear them. Can I go? Can I please go?']],
 kenOut:'Get him out under the skirt',
 kenGone:['You lift the sandbagged skirt by the pecan tree, and Kenny goes under it on his belly like a kid under a fence.','On the far side he says "thank you" and "this is so going on my stream" in the same breath.'],
 kenName:'KENNY',kenLook:'Kenny, crouched by the pecan tree with his phone held up. His hands are shaking. The little red dot is on.',
 // ---- Lorraine Pike, the manager (headset; on hold with the owners since Tuesday) ----
 lor1:[['LORRAINE','Star State? Thank God. Lorraine Pike, I manage. Hold on.'],'She touches her headset. Somewhere inside it, a saxophone is playing hold music.',
  ['LORRAINE','I\'ve been on hold with the owners since Tuesday. Tuesday. I know every note of this song. I could play it at a wedding.'],
  ['LORRAINE','Here\'s your work order. Unit 6 and anything that touches it. The last crew opened one wall and walked off the job. Left a sprayer.'],
  ['LORRAINE','Tent goes up at dusk. Tenants go to the Lone Star Motor Inn on the frontage road. The owners are paying. The owners don\'t know that yet.']],
 lorAfter:[['LORRAINE','Still on hold.'],'The saxophone takes a solo.'],
 lorStore:[['LORRAINE','Walt? Walt rents a unit out at the self storage on 71. Whatever didn\'t fit in his apartment went out there.'],['LORRAINE','Whatever didn\'t fit out there came back here. Which is how we got here.']],
 lorQuiet:[['LORRAINE','I\'m sorry. Who did you say you were with again?'],'She writes something on a sticky note and doesn\'t show it to you.'],
 lorOpen:'Ask Lorraine to open Unit 6',
 lorOpenDo:[['LORRAINE','Fine. FINE.'],'She takes the headset off for the first time all day and walks you down to Unit 6 herself.',['LORRAINE','Walt! It\'s Lorraine! The bug people are here! Open up or I\'m using my key, and you know I hate using my key!'],'A long time. Then the chain comes off.'],
 counter:'The office counter. A bell, a bowl of hard candy nobody has touched since the Bush administration, a sign: RENT DUE 1ST.',
 keysName:'KEY BOARD',keysLook:'The key board: a hook for every unit, a tag on every key. Unit 6\'s hook still has its key.',keysGone:'The key board. Unit 6\'s hook is empty. That\'s on you.',
 keysPaper:'Sign it out on the work order',keysSneak:'Lift it off the hook',keysTalk:'Ask Lorraine for it',
 keysPaperDo:'You put the work order on the counter and sign the key log: STAR STATE, UNIT 6, 2:15 PM. Lorraine waves at you without turning around.',
 keysSneakDo:'You lift Unit 6\'s key while Lorraine argues with the saxophone.',keysSneakMiss:'Lorraine turns around. You are standing at her key board, holding a hook.',
 keysTalkDo:[['LORRAINE','Unit 6? Take it. Take all of them. Bring back the one for the laundry, people steal the quarters.']],
 cKeys:'Unit 6\'s spare key, off the office board. Walt\'s door opens without anybody forcing it.',
 officeChief:'The office door has a business card stuck in it: SGT. A. RUIZ, AUSTIN PD. CALL ME. The door\'s locked. The key board\'s right there through the glass.',
 officeNight:'The office is dark. A note on the door in Lorraine\'s handwriting: GONE TO MOTEL. DON\'T CALL ME. — L.',
 // ---- Denise Okafor (in the lot, by her car) ----
 den1:[['DENISE','You\'re the bug people? Good. I\'m Denise. Unit 6 is my dad.'],['DENISE','I drove up from Houston Friday. Three hours on 290 behind a cattle trailer. He won\'t open the door.'],
  ['DENISE','He always opens the door for me. Even when I was fifteen and he knew I\'d been drinking. He\'d open it and say "Hey, baby," and then ground me till Easter.'],'She laughs. Then she has to look at her car for a while.'],
 denKnock:'Ask her to knock with you',denWait:'Wait with her by his door',denMom:'Ask about her mom',denReceipt:'Ask what he paid for it',
 denKnockDo:[['DENISE','Daddy? It\'s me. It\'s Neecy.'],'A long time. Then the chain comes off, and the door opens the width of a face.',['WALT','...Hey, baby.']],
 denKnockFail:[['DENISE','If he won\'t open it for me, he won\'t open it for me with you standing there.']],
 denWaitDo:['You stand by Unit 6 with Denise in the heat for an hour. Nobody says much. She shares her sunflower seeds.','At ten after four the door opens a crack, because Walt Okafor has picked up his mail at four o\'clock every day for thirty years.',['WALT','...Hey, baby.']],
 denMomDo:[['DENISE','Mom died last June. Pancreatic. It was fast, everybody says that like it helps.'],['DENISE','Daddy set out two coffee cups every morning for a month. Then he stopped, and I thought that was good.'],
  ['DENISE','Zuri, my girl, drew him that picture on the fridge at the funeral. GRAMPA. She said it was so he wouldn\'t be by himself in the kitchen.'],
  ['DENISE','If you get in there. Tell him Mom would\'ve hated this. She\'d say, "Walter, open the door."']],
 cGrace:'Grace Okafor died last June. Denise says to tell Walt she\'d have said, "Walter, open the door."',
 denReceiptDo:[['DENISE','I\'ve got the receipt. He made me pay it on my phone, he doesn\'t trust the app.'],'She holds it out. ROUND ROCK ESTATE AUCTION. LOT 83. SPECIMEN JARS (40). BOOKS (1 CRATE). LEDGERS (90). $212.00.'],
 cListD:'Denise\'s auction receipt: lot 83 was 40 jars and 90 ledgers. Thirty-seven jars are in Unit 6, so three are somewhere else.',
 denAfter:[['DENISE','I\'m not leaving this parking lot. I have snacks.']],
 denIn:[['DENISE','He let you in? Okay. Okay. Tell him I\'m right here.']],
 // ---- Walt Okafor, Unit 6 (liar: "nothing in here but junk") ----
 waltDoor:'UNIT 6',waltDoorLook:'Unit 6. The blinds are shut. The window unit isn\'t running. Through the door, a ceiling fan shrieks on every turn.',
 waltForce:'The door gives with a bang. Next door, Mrs. Ybarra\'s blinds go up an inch and stay up.',waltForceFail:'The door holds. It\'s a better door than the building deserves.',
 useKey:'Let yourself in with the spare key',
 unit6In:['Unit 6 is boxes. Boxes to the ceiling: MASON JARS, BOOKS, MISC, in marker, in a careful hand. The air is thick and warm, like the inside of a mouth.',
  'The ceiling fan shrieks every time it comes around. Nobody has turned it off. Nobody has oiled it.','Walt Okafor is in a recliner in a bathrobe, with a blanket over his legs. It is a hundred and four degrees.'],
 unit6Night:['The door to Unit 6 stands open. The fan is still going, shrieking at nobody.','The recliner is empty. The blanket is on the floor. The air smells like a nursery.'],
 walt1:[['WALT','You\'re the bug people.'],['WALT','There\'s nothing in here but junk. Estate stuff. You can see that. It\'s just junk.'],['WALT','Look all you want. Don\'t touch the table. I have it in an order.']],
 waltName:'WALT',waltLook:[['WALT','There\'s nothing in here but junk.'],'He keeps his right arm under the blanket. Every time the fan comes around, he looks at the kitchen wall like it said something.'],
 waltRead:[['WALT','...There was a book. About them. About her. How to keep her.'],['WALT','I put it someplace cold. Where Gracie keeps an eye on it.'],'He looks at the fridge. At the drawing on the fridge.'],
 waltReadFail:[['WALT','I told you. Junk.']],
 waltArm:'Look at his arm',
 waltArmDo:['You move the blanket. He lets you. He\'s too tired not to.','His right arm is warm, warmer than skin gets, and soft, like bread dough. From the elbow down it isn\'t all his. Something pale has grown into it, smooth, with a seam where it joins.','The seam is breathing.',['WALT','She gets cold. I keep her warm.']],
 armH:'Walt\'s arm, warm and soft and not all his',
 waltAfter:[['WALT','Don\'t touch the table.']],
 // ---- the lot on Walt's table ----
 lotName:'THE LOT',lotLook:'Jars on the table, in rows, each with something pale folded up in cloudy liquid. Books in no alphabet. Cloth ledgers with numbers on the spines.',
 countHand:'Count them by hand',
 countSweep:['You count the jars. Thirty-seven, in rows of six with one left over, like he was setting a table.','The ledgers go 1 to 90 on the spines. You count them twice. 81, 82, 84. Somebody took 83.'],
 countSample:['Thirty-seven jars. The brine is cloudy and yellow-green, and the jars are warm. Not warm from the room. Warm like a mug somebody just set down.'],
 countRecords:['Thirty-seven jars, and a crate of books in no alphabet you\'ve ever seen. Not Cyrillic. Not anything. The letters lean, like they\'re listening.'],
 countHandDo:['You count. You lose count at nineteen because the fan shrieks. You start over. Thirty-seven.'],
 emptyJar:'At the end of the last row, one jar is empty. The lid is pushed out from the inside.',
 emptyH:'The empty jar, opened from the inside',
 countWalt:[['WALT','Don\'t. Don\'t touch that one. That one\'s hers.']],
 cCount:'Unit 6: 37 jars on Walt\'s table. One is empty, its lid pushed out from the inside.',cCountGap:'Unit 6: 37 jars on Walt\'s table, one empty, its lid pushed out from the inside. Ledger 83 is missing from a run of 1 to 90.',
 readOpt:'Read the books',readId:'Read the signs in them',readCurious:'Read until it makes sense, whatever it costs',
 readDo:['You read until the letters stop leaning. It takes an hour. It takes something out of you that you don\'t get back.','They aren\'t books. They\'re care instructions, the way a seed catalog is care instructions. Warmth. Grief. A name said kindly.',
  'The word the books use for what\'s in the jars is long and soft, and you can\'t say it in your head without your mouth moving. In the margin, a slanted old hand has written it in English: LODGER.','You say the long word once, quietly, to see. Somewhere under the building, the hum stops for a second.'],
 readFail:'The letters lean away from you. After an hour you have a headache and nothing else.',
 readH:'Reading Penhallow\'s books',
 iceOpt:'Pack the jars in ice',iceCrew:'Pack them in the crew\'s ice',iceHand:'Pack them by hand (it takes an hour)',iceNone:'You need ice. A lot of ice. Somebody in this building has a freezer full of something.',
 iceDo:['You pack the jars in ice, row by row, in Walt\'s bathtub.','One by one the pale things inside go still, the way a dog goes still when you put your hand on it.'],
 iceBay:'The two from the storage unit go in last, on top, like the cherry on something terrible.',
 iceFail:'The ice slides. A jar tips. You catch it. You start over, slower.',
 iceKeep:'Keep one jar back',iceKeepDo:'You wrap one sleeping jar in a dish towel and put it in your bag. It\'s cold now. It doesn\'t move. You check twice anyway.',
 iced:'Walt\'s bathtub, full of ice and jars. Nothing in it is moving.',
 // ---- the fridge, Zuri's drawing and Ledger 83 ----
 fridgeName:'THE FRIDGE',fridgeLook:'The fridge. A crayon drawing on the door, held by a magnet shaped like Texas: a stick man with a big smile. GRAMPA, the R backwards.',
 fridgeTake:'Take the drawing',fridgeTakeDo:'You slide it out from under the magnet. On the back, in a grown-up\'s handwriting: ZURI, AGE 6, FOR GRAMPA SO HE IS NOT BY HIMSELF.',
 freezerOpt:'Check the freezer',freezerLook:'Ice trays, a bag of peas older than Zuri, and frost an inch thick on everything.',
 ledgerDo:['Behind the ice trays, under the frost, a cloth ledger in a freezer bag. 83 on the spine.','Inside, in a slanted old hand: how to keep them asleep. Below forty degrees they go still. Heat wakes them. Grief wakes them. A name said kindly wakes them.',
  'How to end one: cold, to stop it. Then fire.','The last pages are a different paper, older, ruled in red, in somebody else\'s handwriting. A number in the corner: 3.'],
 cLedger:'Ledger 83 was in Walt\'s freezer. Cold stops them, fire ends them, and a name said kindly wakes them.',
 hookName:'KEY HOOK',hookLook:'A hook by the door. A padlock key on a plastic fob: HWY 71 SELF STORAGE · 83.',hookTake:'Take the key',hookDo:'You pocket the key. Walt doesn\'t look up.',
 // ---- the hidden hotspot (Mushrooms): the patched wall left of the fridge ----
 wallName:'THE PATCH',
 patch:['The patch on the wall is thin as skin. Behind it, something warm moves in a slow circle, like somebody turning over in their sleep.',
  'Across the drywall, in Walt\'s block capitals, line after line, he\'s been writing her a note every night: GOODNIGHT GRACIE. KEEP WARM. GOODNIGHT GRACIE. KEEP WARM.','The warm moves off down the wall, low, toward the courtyard. Toward the pool.'],
 patchH:'A note on the wall, written every night',
 cWallP:'Behind the patch in Unit 6, it moves down the wall toward the pool. It found Walt by his grief, and it isn\'t in the unit any more.',
 photo:'A wedding photo. A tall man in a white suit, and a woman laughing at him so hard she\'s blurry.',
 // ---- Mrs. Ybarra and Biscuit (Unit 5) ----
 dol1:[['MRS. YBARRA','You\'re not the usual bug men. The usual bug man is Hector, and Hector is scared of my dog.'],'Biscuit, in a knitted sweater, in August, trembles with rage at your shoes.',
  ['MRS. YBARRA','I have cataracts. I see shapes. But I remember faces, honey. I\'ll remember yours.']],
 dolTalk:'Ask about Walt',
 dolWalt:[['MRS. YBARRA','Biscuit used to bark at Walt every morning. Every morning, at his door, like a fool. Walt would say "Good morning, Biscuit," and she\'d bark.'],
  ['MRS. YBARRA','Since Thursday she won\'t walk past his door. She pulls me the long way, around the pool.'],['MRS. YBARRA','He had Grace. Then he had me, a little, for coffee. Now he doesn\'t have anybody, and he says he\'s fine.']],
 dolQuiet:[['MRS. YBARRA','I already called my nephew. He\'s a deputy in Pflugerville.'],'She doesn\'t say anything else. Biscuit says plenty.'],
 dolAfter:[['MRS. YBARRA','Biscuit, hush.'],'Biscuit does not hush.'],
 biscuit:'Biscuit barks at you without stopping, a high little bark like a smoke alarm. Then she looks at Unit 6, goes quiet, and backs up against Mrs. Ybarra\'s ankles.',
 sharedWall:'Press your ear to it',sharedWallDo:'Through the wall, from Walt\'s side: a hum. Not a fridge. It goes up at the end, like a question.',
 // ---- Trey Banks, Unit 9 (ER nurse, nights) ----
 trey1:[['TREY','Do you know what time it is? For me? It\'s three in the morning. I work nights in the ER at St. Brigid\'s.'],
  ['TREY','Something\'s in my bathroom wall. It scratches. It\'s been scratching since Thursday, right at the part of my day where I\'m supposed to be asleep.'],['TREY','I taped it. Don\'t judge me. Kill it quieter than the last guy.']],
 tapeName:'THE TAPE',tapeLook:'A square of drywall duct-taped over in the bathroom doorway. Four layers of tape. One of them is the good tape.',tapeOpen:'Peel back the tape',
 tapeDo:['You pick at the duct tape. Under it, the drywall is soft, and warm, and it moves under your thumb like a cheek.','Then the whole square bulges out at you, and the light in the bathroom goes, because something knocked the bulb.'],
 tapeH:'Trey\'s wall, moving under the tape',
 nitsIntro:'Nits pour out of the wall!',
 nitsAfter:['Four of them on the bathroom tile, the size of your finger, pale, blind, still warm.',['TREY','...Okay. That\'s not a rat.'],['TREY','That is not a rat. I have seen every kind of rat. I work in an ER in Texas.']],
 nitsLoud:'That was loud, in an apartment building in the middle of the afternoon. Somebody upstairs bangs on the floor, then on the door.',
 nitName:'A DEAD NIT',nitLook:'A dead grub the size of your finger on Trey\'s bathroom tile. No eyes. Still warm.',
 nitExam:['No eyes. No mouth you\'d call a mouth. The gut is full of something yellow-green that smells like pickle brine.','It wasn\'t eating the wall. It was carrying something through it. Back toward Unit 6.'],
 nitSample:['The gut is full of brine, the same yellow-green as Walt\'s jars, and it\'s warm. Ninety-eight point six, on a body that size.','They carry it. Through the walls. To something that\'s being fed.'],
 nitIdent:['Brood. Things like this don\'t eat; they carry. Brine from the jars, back to a nest, and the nest grows.','Something that size has to be fed. Ice on the jars would starve it.'],
 cNits:'The nits in the walls carry the jars\' brine back to something. Every jar is food. Ice on the jars would starve it.',
 treyArm:'Tell Trey about Walt\'s arm',
 treyArmDo:[['TREY','Warm and soft, growing into the skin, and the seam is moving.'],['TREY','I don\'t know what that is. I know what I\'d do with anything that runs that hot. Pack it in ice.'],['TREY','Frostbite kills tissue. Whatever that is, it\'s tissue. Cold would stop it, or slow it way down.']],
 treyAfter:[['TREY','I\'m going to go sleep in my car with the AC on. Goodnight. Good morning. Whatever it is.']],
 // ---- Kenny Duong, Unit 12 (liar: "it's a rat") ----
 ken1:[['KENNY','Are you guys, like, real exterminators? You look like cops in a Halloween costume of exterminators.'],['KENNY','It\'s a rat. In my wall. Probably a rat.'],'His drywall has a hole the size of a fist, and the edges are pushed out. Not in.'],
 kenVideo:'Ask to see the video',kenCrack:'Pull it off his stream',kenGummy:'Ask about the gummies',
 kenVideoDo:['He plays it. 3:12 a.m., his ring light on the wall. The drywall bulges. Something pale pushes a point out, turns like it\'s smelling, and goes back in.','Forty views. One comment: "fake".','You watch it again. It\'s carrying something. A drop of something, held like an egg.'],
 kenGummyDo:[['KENNY','Dude. Okay. Don\'t tell my mom. They\'re from the gas station on Lamar.'],'FUN GUY, a cartoon mushroom with a thumbs-up. "NOT FOR SALE TO MINORS," it says, under the cartoon mushroom.'],
 kenAfter:[['KENNY','I\'m gonna stay tonight and film the tent. My mom\'s on a double. She won\'t know.']],
 kenFilm:'Kenny is out on the walkway with his phone held up. The little red dot is on. He\'s filming the bug men.',
 rig:'A gaming setup, a ring light, a mic on an arm. A sticky note: GOING LIVE 3AM.',hole:'A hole in the drywall, fist-sized, with the edges pushed out. Not in.',
 // ---- Gus Villarreal, by the dry pool ----
 gus1:[['GUS','Pool\'s been dry since \'19. Owners said it was a liability. I said, so\'s the stairs.'],'He mists his face with a spray bottle and holds very still while it dries.',['GUS','Used to swim laps every morning. Forty laps. Now I sit by it. It\'s like visiting.']],
 gusTalk:'Let him talk about the pool',gusAsk:'Ask what\'s under it',
 gusWall:[['GUS','You know there\'s a whole room down under the deep end? Pump room. Filter, pipes, the works. Hatch is right there by the drain.'],['GUS','Pipes run off it under the whole building. That\'s how the hot water used to get around.'],
  ['GUS','Funny thing. Ain\'t been a pump running down there in three years. You put your hand on that hatch this week, though. Warm as a dog.'],'He mists himself again.',['GUS','Walt\'s got a key to it. He used to fix the pump for free. He\'s good like that.']],
 cWallG:'Gus: a pump room under the pool\'s deep end, with pipes under the whole building. This week the hatch is warm. Walt has a key.',
 gusFail:[['GUS','Forty laps. Every morning. You don\'t believe me.']],
 gusAfter:[['GUS','Forty laps.']],
 // ---- Hector Salas, from the crew that quit ----
 hec1:[['HECTOR','You\'re the new crew? Good luck. I mean it. Good luck.'],['HECTOR','I\'m only here for my sprayer. I left a four-hundred-dollar sprayer in that man\'s kitchen and I\'m not going in for it.']],
 hecTalk:'Ask what he saw',hecRead:'Ask him what really made him quit',
 hecWall:[['HECTOR','Old man called about a smell. I opened the wall behind his fridge, looking for a dead rat. You get a lot of dead rats in August.'],['HECTOR','It wasn\'t a rat. It was warm in there, like the wall had a fever. Something in the insulation was going around in a circle. Slow.'],
  ['HECTOR','The old man stood behind me and said, "Don\'t wake her." Real nice. Like a nurse.'],['HECTOR','I patched it. I taped it. I walked to my truck and I quit.'],['HECTOR','It goes down, the warm. Down that wall toward the pool. Here. Take one of these. I\'m not using them anymore.']],
 cWallH:'Hector opened the wall behind Walt\'s fridge: warm, something circling in it, and the warm runs down toward the pool.',
 hecFail:[['HECTOR','Nah. I don\'t want to talk about it. I want my sprayer.']],
 hecAfter:[['HECTOR','If you find my sprayer, keep it.']],
 // ---- the storage row and unit 83 ----
 dale1:[['DALE','Office closes at six. Bathroom\'s out of order. Which unit.'],['DALE','83? That\'s Okafor. Nice man. Pays cash on the first.'],
  ['DALE','Something in there hums. I told him, Mr. Okafor, no refrigerators, it\'s in the contract. He said it isn\'t a refrigerator.']],
 daleAfter:[['DALE','I\'m on my break.'],'He has been on his break since you got here.'],
 bayName:'UNIT 83',bayLook:'Unit 83. The roll-up door is padlocked. Something behind it hums, very low. Then stops, like it heard you.',
 bayKey:'Use Walt\'s key',bayTalk:'Ask Dale to let you in',bayCut:'Cut the padlock',
 bayTalkDo:[['DALE','You\'re with the building? Fine. Fine. I didn\'t see you. I\'m on my break.']],bayTalkFail:[['DALE','Not without Mr. Okafor or a court order. Bathroom\'s still out of order.']],
 bayForce:'The padlock gives. Over the door, a little camera blinks red.',bayCutDo:'The bolt cutters bite through the padlock like a carrot. Over the door, a little camera blinks red.',
 bayIn:['Unit 83 is cooler than outside, which isn\'t saying much. Steel shelving, two more jars, and a box marked GRACE in a different hand.','An envelope is taped to the shelf with Walt\'s careful marker: LOT 83 — PAPERWORK.'],
 listName:'THE ENVELOPE',
 listDo:['ROUND ROCK ESTATE AUCTION · LOT 83 · CONSIGNED BY THE ESTATE OF O. PENHALLOW, BASTROP CO.','SPECIMEN JARS, SEALED (40). BOOKS, FOREIGN, 1 CRATE. LEDGERS, CLOTH, NUMBERED 1–90.','At the bottom, in pen: "Consignor\'s agent: tall gentleman, paid the fees in cash, left no name."'],
 listCount:'Forty jars. Thirty-seven in Walt\'s unit and two on this shelf. One is missing.',
 cList:'The auction\'s lot list: 40 jars and 90 ledgers, from the estate of O. Penhallow. Thirty-seven jars in Unit 6, two in storage. One is out.',
 shelfName:'THE SHELF',shelfLook:'Steel shelving. Two jars, each with something pale folded up in cloudy brine. These ones are cold.',shelfTake:'Take the two jars',
 shelfDo:'Two jars, cold from the shade of the unit. You wrap them in a moving blanket and carry them like eggs.',
 graceName:'GRACE',graceLook:'A box marked GRACE in a different hand. Not the lot. Walt\'s.',graceRead:'Go through it gently',
 graceDo:['Her reading glasses. A church fan from Mount Zion Baptist. A recipe card for peach cobbler in a hand that leans the other way.','A birthday card from Walt, never sent: "Gracie. 8 March. Happy birthday. I bought you something at the auction. It\'s a lot."',
  'At the bottom, folded small, a note in the leaning hand, old: "Walter. Open the door. Love, G."'],
 cGraceB:'Grace\'s box in the storage unit: a note in her hand, folded small. "Walter. Open the door."',
 graceFail:'You can\'t make yourself go through a dead woman\'s things in front of her husband\'s padlock. You close the box.',
 // ---- the laundry room ----
 binName:'LOST AND FOUND',binLook:'A plastic bin of single socks, a swim noodle and somebody\'s phone charger.',binOpt:'Dig through it',
 binFind:'At the bottom, a little foil pouch of gummies. FUN GUY, a cartoon mushroom with a thumbs-up.',
 freezer:'A chest freezer. DO NOT OPEN · DEER · RAY, on masking tape. It hums.',freezerTake:'Take the ice',freezerTakeDo:'Under Ray\'s deer, forty pounds of bagged ice. Sorry, Ray.',freezerDay:'Ray\'s deer. You leave Ray\'s deer alone. For now.',
 droneIn:['The laundry room\'s tube light is the only white light under the whole tent. It buzzes. Something under the folding table is breathing.','It comes out the size of a cat, pale and swollen tight with yellow-green brine, and it doesn\'t have a face.'],
 droneIntro:'The Drone and its nits come out from under the table!',
 droneAfter:['It goes flat like a water balloon. The brine runs to the floor drain. The laundry room smells like a pickle jar for the rest of the night.'],
 cooler:'THE CREW\'S COOLER',coolerLook:'A cooler on the folding table with a note in Big Hat\'s handwriting: ICE. FOGGER. DON\'T MAKE IT WEIRD.',coolerTake:'Take the fogger and the ice',coolerDo:'A bag of ice the size of a toddler, and a pest-control fogger with STAR STATE stenciled on it.',
 tableName:'FOLDING TABLE',tableLook:'The folding table under the buzzing light. The one bright spot under the tent.',restOpt:'Rest under the light (it costs an hour)',
 rested:['You sit under the buzzing light with your backs to the dryers. Nobody sleeps. Everybody rests. The dryers are still a little warm.'],
 washers:'Coin washers. One has a sock stuck to the inside of the lid, like it tried to get out.',dryers:'Coin dryers. One is still warm.',soda:'A soda machine. Every button says SOLD OUT but one, and nobody has ever pressed that one.',
 // ---- the pool and the pump room ----
 hatchName:'PUMP HATCH',hatchShut:'A steel hatch in the deep end, padlocked. PUMP ROOM stenciled on it. You put your hand on it. Warm as a dog.',
 hatchNight:'The steel hatch in the deep end. Warm. Padlocked. The pipes under the deck tick like something cooling down, except they aren\'t cooling down.',
 hatchOpenW:'The padlock hangs open on the hasp. Walt\'s. He didn\'t bother to lock it behind him.',
 hatchForce:'The hasp tears out of old concrete. Nobody under the tent hears it but you, and whatever\'s down there.',hatchFix:'You take the hasp off with a screwdriver from the van\'s door pocket. Four screws. Easy.',
 hatchShoot:'The padlock jumps off the hatch. The shot goes around the tent like a slammed door.',hatchCut:'The bolt cutters take the padlock off clean.',
 hatchPipes:'Follow the warm pipes (it takes an hour)',hatchPipesDo:['You follow the warm under the deck on your hands and knees, tile by tile, with your palms flat. It takes an hour.','At the deep end it\'s so hot you pull your hand back. There\'s a spare key to the hatch taped under the pool ladder. Walt\'s handwriting: PUMP.'],
 hatchQ:'The hatch in the deep end stands open. A ladder goes down into the warm dark.',gateIn:['Go in','Not yet'],
 pumpOut:'Climb back up to the pool?',pumpOutOpts:['Climb up','Stay'],
 steps:'The pool steps, down into the dry pool.',pool:'The dry pool. A crack runs down the plaster like a river on a map.',chair:'Gus\'s lawn chair, the webbing patched with duct tape. A spray bottle in the cup holder.',
 pump1:['The pump room is a concrete box under the deep end, and it\'s hot as a mouth. The pipes sweat. One bare bulb.','The nest is woven into the pipes along the back wall: pale, soft folds, layer on layer, like a quilt somebody kept adding to. It breathes. The pipes tick when it breathes.',
  'Walt is in it. He\'s asleep in the folds in his bathrobe, his cheek on something pale, the way you\'d sleep on somebody\'s shoulder.','Above him, in the folds, an eye opens. It\'s the size of a hubcap and milky all the way through. It can\'t see you. It turns to look at you anyway.'],
 nestH:'The nest, and Walt asleep in it',
 waltNest:[['WALT','Shh. Shh. She\'s sleeping.'],['WALT','She was so cold in that jar. Forty years in a jar in the dark. I know what that\'s like. I had fourteen months of it.'],
  ['WALT','She hums when I come down. Gracie used to hum. She keeps the other side of the bed warm.'],['WALT','Don\'t you take her. Don\'t you dare.']],
 downDraw:'Show him Zuri\'s drawing',downGrace:'Tell him what Grace would say',downLedger:'Read him the last line of Ledger 83',downTalk:'Sit with him',
 downDrawDo:['You hold up the drawing. A stick man with a big smile. GRAMPA, the R backwards.',['WALT','...Zuri did that. At the funeral. So I wouldn\'t be by myself in the kitchen.'],['WALT','I wasn\'t by myself. Was I. I had a whole kitchen full of people.']],
 downGraceDo:['You tell him. "Walter. Open the door."',['WALT','...She did say that. Every time I locked myself in the garage with a carburetor.'],['WALT','Walter, open the door. Like I was being ridiculous. I was being ridiculous.']],
 downLedgerDo:['You read it out. Penhallow\'s slanted hand: "It will be kind to you. It will be kind right up until it is finished. That is all it knows how to be."',['WALT','...It\'s not her.'],['WALT','I knew that. I knew that the first night. I just wanted the other side of the bed to be warm.']],
 downTalkDo:['You don\'t say much. You sit down on the wet concrete next to the nest and wait, the way you\'d wait with anybody.',['WALT','...She\'d hate this. Gracie would hate this. She hated being hot.']],
 downFail:[['WALT','No. No. You don\'t know. You don\'t know what it\'s like when the house gets that quiet.']],
 downDone:[['WALT','Okay. Okay.'],['WALT','When it\'s time, pull me out of here. Pull hard. I\'m not much help.'],'He closes his eyes. Under him, the nest stops humming for a second, like it heard something it didn\'t like.'],
 waltReady:[['WALT','When it\'s time. Pull.']],
 waltAsleep:[['WALT','Shh.']],
 bossQ:'It\'s awake now. Once you wake it the rest of the way, nobody climbs that ladder till it\'s over.',bossOpts:['Go in','Not yet'],
 filter:'The pool\'s filter tank, stenciled PUMP. The pipes off it are warm to the touch, and getting warmer.',pipes:'Pipes along the wall, sweating. Where they run into the nest, they\'re furred over with something pale.',
 sumpName:'THE SUMP',sumpLook:'A sump in the floor. Dark water at the bottom, and something floating in it.',
 sumpDo:'You fish it out. A jar lid, the old zinc kind, bent outward from the inside. Under it in the water, a road flare somebody dropped in 2019, still sealed.',
 ladder:'The ladder back up to the hatch.',
 // ---- the boss ----
 boss1:['The folds open like a hand. The thing that was the nest sits up, the size of a sofa, pale and soft, and the pipes come up with it.','The eye turns to you. It can\'t see you. It knows exactly where you are.'],
 bossSay:['THE LODGER','WALTER. HONEY. WHO ARE YOUR FRIENDS?'],
 bossSay2:['THE LODGER','THEY LOOK SO COLD, WALTER. I CAN KEEP THEM WARM TOO.'],
 bossDown:['WALT','That\'s not her voice. That\'s not even close.'],
 bossIntro:'The Lodger rises out of the pipes!',
 bossThin:'It\'s smaller than the nest promised. What you did tonight starved it.',
 bossIdent:'You know what it is. Ledger 83 said it plain: cold, to stop it. Then fire.',bossIdentCold:'Trey said it: anything that runs that hot, you pack in ice. Cold stops it.',
 bossHum:'The Lodger hums. The whole room hums with it. Your teeth hum.',
 bossKind:'It speaks in a voice you know. Somebody you lost. They say they aren\'t mad at you. They say come to bed.',
 bossGracie:'It pulls Walt close in its folds and hums to him. Asleep, he hums back. It heals {n}.',
 bossFeed:'A crawler comes down the pipes with a jar on its back and pours the brine into the folds. The Lodger heals {n}.',
 bossPhase:'The Lodger tears itself out of the pipes. They come out of the wall with it, bent like straws. Under the eye, a mouth opens, wet and pink, and it isn\'t humming any more.',
 bossPull:'In the thrashing, Walt\'s arm comes loose of the folds. You grab him by the bathrobe and pull. He comes out of it like a boot out of mud and lies on the concrete, breathing.',
 bossKeep:'Walt is still in the folds. He doesn\'t wake up. Under all the noise you can hear him humming.',
 bossHeal:'It pulls the warm pipes around itself like a blanket. It heals {n}.',
 bossName:'You say its name. Not the English one: the long, soft one from the books. It stops, like a dog that heard its name in a stranger\'s mouth, and doesn\'t reach for the pipes.',
 // ---- overstepping: Noticed, Local chief (Sgt. Ruiz), Agency call (Big Hat), Federal agents (the clean-up crew) ----
 noticed:['Word goes around Pecan Court: the new bug men aren\'t bug men. Doors stay shut. Blinds go up an inch.','Kenny comes out on the walkway with his phone held up.'],
 noticedNight:'At dawn somebody is going to have questions. Somebody always does.',
 chief:['A patrol car pulls into the lot. A sergeant in a sweat-dark uniform walks the courtyard once, slow, and looks at every one of you.',
  ['SGT. RUIZ','Mrs. Ybarra\'s nephew says y\'all aren\'t licensed. I looked. Y\'all are licensed since Tuesday. That\'s a short time to be licensed.'],['SGT. RUIZ','Office is closed for the day. Lorraine\'s taking a long lunch. Don\'t make me come back.']],
 call:['Your phone buzzes. Unknown number. You know who it is.',['BIG HAT','I\'m hearin\' about Pecan Court on a police scanner, {first}. Bug men don\'t make the scanner.'],['BIG HAT','Don\'t ask for anything next time. You won\'t get it.']],
 feds:['Two black SUVs in the lot, nose to tail, engines running. Four doors open at the same time.',['CLEAN-UP','Black Lantern. You\'re done here. Hand over what you\'ve found.'],['CLEAN-UP','The building\'s ours now. So\'s the tent.']],
 fedsIntro:'The clean-up crew draws down!',
 fedsWin:['The black SUVs leave the way they came, one short.'],
 // ---- the ending ----
 end1:['The Lodger shudders all over, like a dog shaking off water, and then it just keeps shaking, smaller and smaller.','It goes still on the floor of the pump room. The eye goes from milk to water. The pipes stop ticking.','It\'s very quiet. Up top, the building is only a building.'],
 endWalt:['Walt sits up against the filter tank in his bathrobe. His arm is his arm again, mostly. It\'s going to need a doctor and a story.',['WALT','...I\'m so hungry. Is that weird? I\'m so hungry.']],
 endDead:['Walt is still in the folds. He looks like he\'s asleep. He isn\'t.','He\'s smiling a little, like somebody on the other side of the bed just said something nice to him.'],
 burnQ:'Fire ends what cold has stopped. Burn the nest, and the jars with it?',burnOpts:['Burn it all','Leave it for the crew'],
 burnDo:['You carry the iced jars down the ladder in a laundry basket, and the nest goes up with them. The pump room fills with smoke that smells like a burned pot roast.','Up top, the smoke runs along the inside of the tent and finds the seams.'],
 burnCrew:'At dawn the crew boss reads the stains on the tent off his clipboard: "Fumigant burn-off. Normal." It is not normal. It\'s on his clipboard now.',
 burnSeen:'At dawn the tent crew finds smoke stains all along the inside of the tent and starts asking each other questions.',
 burnLeave:'You leave it. The crew can deal with it. The crew will not deal with it the way you would.',
 ledgerDrop:'Cleaning out Walt\'s freezer at dawn, you find a cloth ledger behind the ice trays, in a freezer bag. 83 on the spine. You take it.',
 drawBack:'You give Denise the drawing off the fridge. She puts it face down on her lap in the car so she can see to drive.',
 dawn:'At six the tent comes down. Pecan Court sits in the sun like nothing happened. The window units come back on one at a time.',
 dawnWalt:'Denise takes Walt to Houston. He rides in the front seat with a blanket on his knees in a hundred degrees and tells her to turn the AC down, he\'s cold. She laughs so hard she has to pull over.',
 dawnDead:'The coroner calls it heat stroke. A seventy-one-year-old man in a bathrobe in a pump room in August. Nobody asks what he was doing down there. Denise asks. Nobody answers.',
 dawnKenny:'Kenny\'s video from under the tent has eleven thousand views by noon. Most of the comments say fake. Not all of them.',
 dawnLate:'The crew is early. Mrs. Ybarra is earlier. She watches you come up out of the dry pool with Biscuit under her arm, and she remembers every face.',
 filed:['BIG HAT','Ledger 83. I\'ll file it. Records wants it by Monday.'],
 endBrisket:'He takes a paper sack out of the cooler and puts it in your hands. It\'s cold. "Burnt ends. They were gonna throw \'em out."',
 // ---- the debrief (spec 007): Big Hat's lines by ending ({x}/{t} clues, {v}/{n} kept safe), what he says about the
 // choices, and the cover stories ----
 db:{
  clean:[['BIG HAT','Walt Okafor is in Houston eatin\' his daughter\'s cookin\' and complainin\' about it. That building\'s just a building again.'],['BIG HAT','Lorraine finally got off hold. Owners are puttin\' water back in the pool. {x} clues outta {t}. Sit.']],
  costly:[['BIG HAT','Thing in that pump room is dead. That\'s the job.'],['BIG HAT','Everything else about it\'s gonna cost somebody. {x} clues outta {t}. Sit.']],
  worst:[['BIG HAT','Black SUVs at an apartment complex in Austin. You know how many people in Austin film everything?'],['SHOUT','ALL OF THEM. EVERY ONE OF THEM FILMS EVERYTHING.'],['BIG HAT','Case is closed. Not by us.']],
  swarm:['BIG HAT','A swarm. You told me a swarm. I sent a tent crew for a swarm.'],
  waltdid:['BIG HAT','You told me the widower did it on purpose. He didn\'t do a thing on purpose. He was lonesome. That ain\'t on purpose.'],
  forced:['BIG HAT','Lorraine wants a new door on Unit 6. It\'s comin\' out of your per diem.'],
  dead:['BIG HAT','Denise Okafor called this number. I don\'t know how she got it. I let her yell. It seemed fair.'],
  kenny:['BIG HAT','Kid in Unit 12 got eleven thousand views. Records is gonna make that go away. Records is cranky about it.'],
  read:['BIG HAT','You read those books. Under a tent. In the dark. I\'m not mad. I\'m writin\' it down.'],
  walt:['BIG HAT','Denise sent a card. It\'s got a drawin\' on it from her girl. I put it on the cooler door.'],
  mold:'Black mold, state-permitted',moldPass:[['BIG HAT','Black mold in the walls. State remediation permit, stamped and dated. Everybody in Texas is scared to death of black mold. Good.']],
  termite:'Formosan termites, the bad kind',termitePass:[['BIG HAT','Formosan termites. The bad kind. Lorraine told the whole building, and now the whole building\'s itchy. Perfect.']],
  weak:'Raccoons in the walls',weakPass:[['BIG HAT','Raccoons. In the walls. In August. Nobody wants to think about raccoons long enough to doubt it. You got lucky.']],
  easy:'A fumigation. That\'s all anybody saw.',easyPass:[['BIG HAT','Bug men came, tent went up, tent came down. That\'s all anybody saw, because that\'s all that happened. Clean.']],
  safe:'Already filed: routine fumigation',safePass:[['BIG HAT','Routine fumigation, permit on the door. Paperwork\'s never wrong.']],
  jar:[['BIG HAT','A jar. With one in it. Asleep. In my cooler. Next to the brisket.'],['BIG HAT','Records is gonna love this.']]
 }
};
const fill=(t,o)=>String(t).replace(/\{(n|m|v|t)\}/g,(x,k)=>o[k]??x);
async function play(seq,o={}){for(const l of [].concat(seq)){if(Array.isArray(l))await say(l[0],fill(l[1],o));else await say('',fill(l,o))}}
const said=(l,o)=>play([l],o);

// The case board card (spec 011, The card)
const caseCard={file:3,title:'LOT 83',town:'AUSTIN',place:'PECAN COURT APTS · AUSTIN, TX',
 hook:['A dead man\'s boxes came to Unit 6.','Something in them is still growing.'],pin:'#a8e04a'};

// ================= CASE DATA =================
// Enemy cards (Combat: Enemies and difficulty, Combat numbers). Fight sizes: roamers 10–18 enemy HP, story fights 20–35.
// The case's things are cold-weak (a fogger chills them) and burn; the nits are living, so a bug bomb works on them.
const EN={
 // the brood (a swarm, 1 skull): finger-long blind grubs that carry the jars' brine through the walls
 nit:{name:'Nit',tier:'weak',hp:5,dex:13,hit:40,dmg:'1d2',skulls:1,tags:['unnatural','living','burns','lightshy','cold'],resist:['bleed'],weak:'cold',
  weakLine:'Blind brood that runs hot. Cold stops it dead; it burns; light makes it flinch. Too small to bleed.',moves:[['hit',1]],verb:'latches onto',die:'curls up and goes still',face:[8,2,14],
  horror:{tier:'unsettling',kind:'unnatural',subj:'grubs'}},
 // a crawler (a roamer): a grown nit carrying a jar of brine home to the nest
 crawler:{name:'Crawler',tier:'ordinary',hp:14,dex:8,hit:45,dmg:'1d3+1',skulls:2,tags:['unnatural','living','burns','lightshy','cold'],resist:['bleed'],weak:'cold',
  weakLine:'A grown nit with a jar of brine on its back. Cold stops it; it burns; light makes it flinch.',moves:[['hit',1]],verb:'rears up at',die:'lets go of its jar and goes still',face:[16,10,18],
  horror:{tier:'unsettling',kind:'unnatural',subj:'grubs'}},
 // the Drone (with two nits, a 2-skull story fight in the laundry room on night 1): swollen with brine; it hums
 drone:{name:'Drone',tier:'tough',hp:20,dex:9,hit:50,dmg:'1d4+1',allDmg:'1',skulls:2,tags:['unnatural','living','burns','lightshy','cold'],resist:['bleed'],weak:'cold',
  weakLine:'A nit the size of a cat, full of brine. Cold stops it; it burns; light makes it flinch.',moves:[['hit',3],['san',1]],verb:'slams into',
  sanText:'The Drone hums, warm and low, like a mother humming to a baby in the next room.',sanHit:['0','1'],die:'goes flat like a water balloon',face:[24,8,24],
  horror:{tier:'disturbing',kind:'unnatural',subj:'grubs'}},
 // only if overstepping reaches Federal agents (the same clean-up crew as every case; its sprite is Still Harvest's SHB)
 fed:{name:'Clean-up agent',tier:'ordinary',hp:11,dex:12,hit:55,dmg:'1d4+1',skulls:3,tags:['human','living'],resist:[],weak:'human',weakLine:'Human. A flashbang or a badge will stop him for a second.',
  moves:[['hit',1]],verb:'fires at',die:'goes down and stays down',face:[10,2,20]},
 // the boss (tuned Nov 23, 2026 with tools/boss-sim.js against the Gleaner's bar). Its moves, phase 2 and HP are set per
 // run in bossFight() from the case's choices. Weakness: cold, then fire (the fogger Stuns and Exposes it; it burns).
 lodger:{name:'The Lodger',tier:'boss',boss:true,hp:62,dex:8,hit:55,dmg:'1d4+2',allDmg:'1d3',skulls:3,tags:['unnatural','living','burns','lightshy','cold'],resist:['stun2','poison','bleed'],weak:'cold',
  weakLine:'Cold, then fire. It runs hot: a fogger\'s cold stops it for a round and lays it open, and it burns. It can\'t be stunned two turns running, and gas doesn\'t touch it.',
  face:[56,30,36],moves:[['hit',5],['all',2]],verb:'rolls its weight onto',allText:TEXT.bossHum,sanText:TEXT.bossKind,sanHit:['0','1d3'],die:'goes still, and the eye goes from milk to water',
  horror:{tier:'boss',kind:'unnatural',subj:'the Lodger',known:true}}
};
// the case's horrors: tier, kind, phobia subject; once per case each (SAN loss table). The nest and the boss are for all
// three; the rest are the lead's on the map. Phobia subject: grubs (small soft crawling things).
const HORRORS={
 empty:{id:'empty',tier:'unsettling',kind:'unnatural',subj:'jars',label:TEXT.emptyH},
 tape:{id:'tape',tier:'disturbing',kind:'unnatural',subj:'grubs',label:TEXT.tapeH},
 arm:{id:'arm',tier:'severe',kind:'violence',label:TEXT.armH},
 patch:{id:'patch',tier:'unsettling',kind:'unnatural',label:TEXT.patchH},
 crawler:{id:'crawler',tier:'disturbing',kind:'unnatural',subj:'grubs',label:TEXT.crawlerH},
 nest:{id:'nest',tier:'shattering',kind:'unnatural',all:true,label:TEXT.nestH},
 read:{id:'read',spec:['1d3','1d3'],kind:'unnatural',label:TEXT.readH}
};
// this case's own items (case-only: the pin icon; Big Hat sorts them at the debrief). Ledger 83 is the key evidence.
const CASE_ITEMS={
 ledger83:{name:'Ledger 83',type:'Evidence',kind:'unnatural',pin:1,passive:1,
  desc:'A cloth ledger, damp from the freezer, 83 inked on the spine. The last pages are a different paper, older and ruled in red, numbered in the corner: 3.'},
 sleepjar:{name:'A sleeping jar',type:'Evidence',kind:'unnatural',pin:1,passive:1,desc:'A specimen jar packed in a dish towel, cold. Something pale is folded up in the brine, asleep. Keep it cold.'},
 drawing:{name:'Zuri\'s drawing',type:'Keepsake',kind:'ordinary',pin:1,passive:1,desc:'A crayon stick man with a big smile. GRAMPA, the R backwards. ZURI, AGE 6 on the back.'},
 fogger:{name:'Pest-control fogger',type:'Tool',kind:'ordinary',pin:1,desc:'Battle, 1 use: a cold fog. Every cold-weak enemy is Stunned a round and Exposed.',
  battleUse:async(m)=>{const fs=aliveFoes().filter(e=>(e.tags||[]).includes('cold'));await say('',`${m.name} pulls the pin on the fogger. Cold white fog rolls across the floor.`,{auto:1300});
   if(!fs.length){await say('',`Nothing here minds the cold.`,{auto:900});return true}for(const e of fs){await foeStatus(e,'stun');await foeStatus(e,'exposed')}return true}}
};
// a roamer's drop: 20% from this loot table (Where items come from, Loot): an apartment block and a storage unit
const LOOT=['energy','painkillers','roadflare','cigs','firecrackers'];
const has=id=>G.clues.some(c=>c.id===id);
const late=()=>G.flags.late|0;
const addLate=()=>{G.flags.late=late()+1};
const tentIntel=()=>intelOn('tent');

// ================= THE DAY =================
// G.flags.ph: 0 day 1, 1 night 1 (spec 011, Day and night). The tenting at dusk turns it: the van's "Call in the tent
// crew", after Big Hat's radio question, with Go on / Not yet naming what closes (Turning the day; play.md).
const ph=()=>G.flags.ph|0;
const isNight=()=>ph()===1;
// overstepping: a quiet case, so Noticed comes first (Overstepping and cover stories)
const stepName=()=>stepsOf()[loadSeason().overstep|0]||'Clean';
const stepAt=n=>stepsOf().indexOf(n)>=0&&stepsOf().indexOf(n)<=(loadSeason().overstep|0);
// Noticed: Lorraine and Mrs. Ybarra clam up (−20 to talk them round); +10 with Lorraine from the building intel
const noticed=()=>stepAt('Noticed');
const lorMod=()=>(noticed()?-20:0)+(intelOn('building')?10:0);
const officeShut=()=>!!G.flags.chief&&!isNight();

// ================= MAPS =================
// Every map is drawn by cases/lot-83-art.js from M.ground, M.pieces and M.light, like Good Manners. M.g is what blocks.
// Ground letters (none in engine.js's BLOCK set): ',' concrete deck, '_' parking lot, '=' road, '.' dry grass, ':' lawn,
// 'g' gravel, 'x' dry dirt, 'n' linoleum, 'c' carpet, 'v' tile, 'w' wood floor, 'o' bare concrete.
function blank(id,name,W,H,fillCh,light){const ground=mk(W,H,fillCh),g=mk(W,H,fillCh);
 return{id,name,w:W,h:H,ground,g,pieces:[],O:{},npcs:[],warps:{},light,art:window.L83A,bg:id,lines:[]}}
const lay=(M,x,y,w,h,c)=>{rect(M.ground,x,y,w,h,c);rect(M.g,x,y,w,h,c)};
const block=(M,x,y,w=1,h=1)=>rect(M.g,x,y,w,h,'#');
const open=(M,x,y)=>{M.g[y][x]=M.ground[y][x]};
function put(M,k,x,y,w=1,h=1,o={}){const p=Object.assign({k,x,y,w,h},o);M.pieces.push(p);if(!o.walk)block(M,x,y,w,h);return p}
const look=t=>({look:t});
const folkNPC=(n,talk)=>Object.assign(n,{talk:talk||(()=>play(TEXT[n.id]||''))});
// a door you walk into: it opens on the far map at (x, y) facing dir; the far map's arrive() plays after the fade
const door=(M,x,y,to,tx,ty,dir='down')=>{open(M,x,y);M.warps[x+','+y]=()=>goTo(to,tx,ty,dir)};
async function goTo(to,x,y,dir){await fade(1);goMap(to,x,y,dir);checkpoint();await fade(0);if(G.M.arrive)await G.M.arrive()}
const bounceDir=(M,keys,text,dir)=>keys.forEach(k=>M.warps[k]=async()=>{await said(text);G.dir=dir;await stepBack()});
const rebuild=()=>{G.M=MAPS[G.map]()};

// ---- PECAN COURT: day 1, and night 1 under the tent (36 x 28 by day; 36 x 19 at night, the lot shut outside the skirt) ----
// The two-story block runs across the top: upstairs units 9-16 open off the walkway (row 3), downstairs units 1-8
// off the courtyard (row 7), metal stairs at both ends. Door x for unit n: 4 * n (downstairs), 4 * (n - 8) (upstairs).
// The pool's gate is on the courtyard side (14, 8); the lot's chain-link opens at x 22-24, east of the pool fence.
const UNITS={6:'unit6',5:'unit5',9:'unit9',12:'unit12'};
const unitX=n=>n<=8?4*n:4*(n-8);
// The tiles the night's three roamers walk, in front of what each guards (Gameplay loop, Roamers): the crawler on the
// way to the east stairs (the shortcut up, and the jar it carries), a nit pack in front of the Lantern Box under the
// west stairs, and a nit pack in front of Kenny by the pecan tree.
const BEAT={jar:[[26,8],[27,8],[28,8],[29,8],[30,8],[31,8],[32,8]],box:[[2,9],[3,9],[4,9],[5,9],[6,9]],kenny:[[22,14],[22,13],[23,13],[24,13],[24,14]]};
function buildCourt(){
 const N=isNight(),F=G.flags,H=N?19:28,M=blank('court','PECAN COURT',36,H,',',N?'night':'day');M.alpha=N?.9:.86;M.warm='#ffcf80';
 // the block: upstairs wall, walkway, downstairs wall; the stairs at x 1 and x 34
 block(M,0,0,36,3);lay(M,1,3,34,1,',');block(M,0,4,36,3);
 put(M,'block',2,0,32,7,{walk:1});
 for(const sx of[1,34]){for(let y=3;y<7;y++)open(M,sx,y);put(M,'stairs',sx,3,1,4,{walk:1})}
 for(let n=1;n<=16;n++){const x=unitX(n),y=n<=8?6:2,back=n<=8?7:3;
  if(n===6)unit6Door(M,x,y);
  else if(UNITS[n]&&!N)door(M,x,y,UNITS[n],5,6,'up');
  else{open(M,x,y);M.O[x+','+y]=look(N?fill(TEXT.tentShut,{n}):(n%3?TEXT.shut:TEXT.shutQuiet))}
  M.pieces.push({k:'unitdoor',x,y,w:1,h:1,n,walk:1,back})}
 // the edges: cinderblock walls left and right of the courtyard
 block(M,0,7,1,9);block(M,35,7,1,9);
 // the pool in its chain-link fence (the gate on the courtyard side, x 14); the dry pool walks from its steps
 put(M,'pool',10,10,10,4,{walk:1});block(M,10,10,10,1);open(M,10,10);M.O['10,9']=look(TEXT.steps);
 block(M,10,13,10,1);
 put(M,'fence',8,8,14,8,{walk:1,gate:14,top:1});block(M,8,8,14,1);block(M,8,8,1,8);block(M,21,8,1,8);block(M,8,15,14,1);open(M,14,8);
 M.O['15,12']=look(TEXT.pool);
 put(M,'hatch',18,12,1,1,{walk:1});
 if(N){M.warps['18,12']=enterPumpGate;M.O['18,11']=M.O['17,12']={id:'hatch',name:TEXT.hatchName,look:()=>said(hatchOpen()?TEXT.hatchQ:TEXT.hatchNight),opts:()=>hatchOpts(),used:()=>hatchOpen()}}
 else M.O['18,12']={id:'hatch',name:TEXT.hatchName,look:TEXT.hatchShut};
 put(M,'lawnchair',19,14);M.O['19,14']=look(TEXT.chair);put(M,'lounger',11,14,2,1);
 // the east block: the manager's office and the laundry room
 put(M,'annex',25,9,9,4,{office:27,laundry:31});
 if(N){open(M,27,12);M.O['27,12']=look(TEXT.officeNight)}
 else if(officeShut()){open(M,27,12);M.O['27,12']={id:'office',name:'OFFICE',look:TEXT.officeChief,opts:()=>officeOpts()}}
 else door(M,27,12,'office',7,8,'up');
 door(M,31,12,'laundry',6,6,'up');
 // the courtyard's dressing
 put(M,'tree',3,10);M.O['3,10']=look('The courtyard\'s little oak, half dead of August. Somebody hung a hummingbird feeder on it. It\'s full of ants.');put(M,'tree',23,11);
 M.O['23,11']=look('The pecan tree the building\'s named for. Half its nuts are on the ground, cooked in their shells.');
 put(M,'dumpster',1,14,2,1);M.O['1,14']=M.O['2,14']=look('The dumpster. A box of moving blankets on top, still in plastic.');
 put(M,'bench',5,13);put(M,'planter',7,7);put(M,'planter',29,7);put(M,'grill',33,14);
 lay(M,1,15,6,1,'.');lay(M,22,13,3,3,'.');lay(M,30,13,5,2,'x');
 if(N){
  // night: the tent's skirt shuts the lot outside; work lights on stands; the Lantern Box under the west stairs
  put(M,'skirt',0,16,36,1);M.O['17,16']=look(TEXT.skirt);lay(M,0,17,36,2,'_');block(M,0,17,36,2);
  [[6,8],[23,8],[30,14],[3,12]].forEach(([x,y])=>put(M,'worklight',x,y));
  put(M,'boxes',3,7,1,1,{v:0});M.O['3,7']={id:'lbox',name:TEXT.boxName,look:TEXT.boxLook,opts:()=>G.fs.used['box:lot83']?[]:[{label:TEXT.boxOpen,run:openBox}],used:()=>!!G.fs.used['box:lot83']};
  M.roamers=[
   {id:'rjar',types:['crawler'],sprite:'crawler',name:'Crawler',skulls:2,tags:EN.crawler.tags,path:BEAT.jar,look:'A crawler hauls its jar along the front of the east block toward the stairs, slow, careful, a step at a time.',
    guard:stopCrawler,won:stopCrawler},
   {id:'rbox',types:['nit','nit','nit'],sprite:'nit',name:'Nits',skulls:1,tags:EN.nit.tags,path:BEAT.box,look:'A knot of nits squirms back and forth in front of the west stairs, warm, blind, busy.',guard:openBox},
   {id:'rkenny',types:['nit','nit','nit'],sprite:'nit',name:'Nits',skulls:1,tags:EN.nit.tags,path:BEAT.kenny,look:'Nits circle the pecan tree, closer every pass, like they can smell somebody scared.',guard:freeKenny}];
  M.danger=true;
 }else{
  // the chain-link between the courtyard and the lot, open at x 22-24
  put(M,'linkfence',0,16,36,1,{gap:[22,25]});block(M,0,16,22,1);block(M,25,16,11,1);
  lay(M,0,17,36,10,'_');lay(M,0,26,36,1,'.');lay(M,0,27,36,1,'=');lay(M,22,16,3,1,',');
  for(let x=1;x<22;x+=3)M.lines.push({x:x*16,y:17*16,w:1,h:30});for(let x=26;x<36;x+=3)M.lines.push({x:x*16,y:17*16,w:1,h:30});
  for(let x=1;x<36;x+=3)M.lines.push({x:x*16,y:23*16+2,w:1,h:44});
  put(M,'van',4,20,4,1,{face:'side'});[4,5,6,7].forEach(x=>M.O[x+',20']={id:'van',name:'VAN',look:TEXT.van,opts:()=>vanOpts()});
  put(M,'car',26,18,3,1,{tint:'#b8bcc4'});M.O['26,18']=M.O['27,18']=M.O['28,18']=look('Denise\'s silver hatchback, Harris County plates, a booster seat in the back. A sunshade that says I\'D RATHER BE FISHING.');
  put(M,'car',11,24,3,1,{tint:'#7a2a3a'});put(M,'car',27,24,3,1,{tint:'#3e5a6a'});put(M,'car',2,24,3,1,{tint:'#d8c890'});put(M,'car',31,18,3,1,{tint:'#4a4a54'});put(M,'car',11,18,3,1,{tint:'#5a7a4a'});
  [2,3,4,11,12,13,27,28,29].forEach(x=>M.O[x+',24']=look('A parked car, sunshade up. The windshield is too hot to touch.'));[11,12,13,31,32,33].forEach(x=>M.O[x+',18']=look('A parked car, sunshade up. The windshield is too hot to touch.'));
  [[2,17],[33,17],[19,26]].forEach(([x,y])=>put(M,'lamp',x,y));
  put(M,'aptsign',30,26,3,1);M.O['30,26']=M.O['31,26']=M.O['32,26']=look('PECAN COURT APARTMENTS. NOW LEASING. A pecan with a smiling face, sun-bleached to the color of a tooth.');
  [[0,26],[8,26],[25,26],[35,26]].forEach(([x,y])=>put(M,'tree',x,y));
  bounceDir(M,Array.from({length:36},(_,x)=>x+',27'),TEXT.street,'up');
 }
 // people: who's where by phase (night: the tenants are at the motel, and Kenny stayed behind)
 const NP=[];
 if(!N)NP.push(folkNPC({id:'dolores',x:24,y:8,dir:'left'},talkDolores),folkNPC({id:'biscuit',x:23,y:8,dir:'left'},()=>said(TEXT.biscuit)),folkNPC({id:'gus',x:18,y:14,dir:'down'},talkGus),
  folkNPC({id:'denise',x:29,y:19,dir:'left'},talkDenise),folkNPC({id:'hector',x:10,y:20,dir:'down'},talkHector));
 else NP.push(folkNPC({id:'kenny',x:24,y:15,dir:'up',on:()=>!G.flags.kenny},talkKennyNight));
 M.npcs=NP;
 M.arrive=courtArrive;
 return M}
// Unit 6's door by day: open once you have the key or Walt opened it; locked otherwise (Force it, the key, or Denise)
function unit6Door(M,x,y){open(M,x,y);const N=isNight();
 if(N||G.flags.u6)M.warps[x+','+y]=()=>goTo('unit6',7,9,'up');
 else M.O[x+','+y]={id:'u6door',name:TEXT.waltDoor,look:TEXT.waltDoorLook,opts:()=>u6Opts()}}
function u6Opts(){const F=G.flags;if(F.u6)return[];return[
 {label:TEXT.useKey,show:()=>has('keys'),run:()=>enterU6('key')},
 {label:TEXT.lorOpen,show:()=>!!F.order&&!noticed()&&!F.chief,run:async()=>{await play(TEXT.lorOpenDo);await enterU6('lorraine')}},
 {use:'force',ok:async()=>{F.forced=1;await said(TEXT.waltForce);await enterU6('forced');await overstepHere('seen')},fail:()=>said(TEXT.waltForceFail)}]}
async function enterU6(how){const F=G.flags;F.u6=how;checkpoint();rebuild();await goTo('unit6',7,9,'up')}

// ---- interiors: the back wall three tiles tall, the door in the bottom wall ----
function room(id,name,W,H,floor,o={}){const M=blank(id,name,W,H,floor,isNight()?'night':'day');M.alpha=o.alpha||.86;M.warm='#ffcf80';
 block(M,0,0,W,3);block(M,0,0,1,H);block(M,W-1,0,1,H);block(M,0,H-1,W,1);put(M,'room',0,0,W,H,{walk:1,floor});return M}
const out=(M,x,y,n)=>door(M,x,y,'court',unitX(n),n<=8?7:3,'down');
function buildUnit6(){const M=room('unit6','UNIT 6',15,11,'c'),F=G.flags,N=isNight();
 put(M,'fridge',2,3);M.O['2,3']={id:'fridge',name:TEXT.fridgeName,look:TEXT.fridgeLook,opts:()=>fridgeOpts(),used:()=>!!G.fs.used['opt:drawing']&&has('ledger')};
 put(M,'stove',3,3);put(M,'ksink',4,3,2,1);M.O['4,3']=M.O['5,3']=look('The kitchen sink. Two coffee cups in the drainer, washed. Only one of them has been used.');
 put(M,'table',5,6,3,1,{lot:1});M.O['5,6']=M.O['6,6']=M.O['7,6']={id:'lot',name:TEXT.lotName,look:()=>said(F.iced?TEXT.iced:TEXT.lotLook),opts:()=>lotOpts(),used:()=>has('count')&&!lotOpts().length};
 put(M,'recliner',10,5);M.O['10,5']=look(N?'The recliner, empty. The blanket\'s on the floor.':'A brown recliner, the arms worn through to the stuffing.');put(M,'tv',12,3);put(M,'deadac',8,1,1,1,{walk:1});
 M.O['8,2']=look('The window unit. Dead since the day the boxes came. A towel under it, bone dry.');
 put(M,'photo',11,1,1,1,{walk:1});M.O['11,2']=look(TEXT.photo);
 [[1,5,2],[1,7,1],[1,8,0],[7,3,2],[9,3,1],[13,5,2],[13,7,1],[3,8,1],[12,8,0],[10,8,2]].forEach(([x,y,v])=>{put(M,'boxes',x,y,1,1,{v});M.O[x+','+y]=look('Boxes to the ceiling. MASON JARS. BOOKS. MISC. In marker, in a careful hand.')});
 put(M,'fan',7,5,1,1,{walk:1});
 // Walt's storage key on its hook by the door
 M.O['8,10']={id:'hook',name:TEXT.hookName,look:TEXT.hookLook,opts:[{label:TEXT.hookTake,once:'hook',run:async()=>{F.skey=1;await said(TEXT.hookDo);checkpoint()}}],used:()=>!!F.skey};
 // The hidden hotspot (Item list, Mushrooms): the patched wall left of the fridge, only while the lead is High (field.js)
 M.O['1,2']={id:'patch',hidden:'mushrooms',name:TEXT.wallName,look:readPatch,used:()=>!!F.patch,glint:(c,x,y,now)=>L83A.patchGlint(c,x,y,now)};
 if(!N)M.npcs=[folkNPC({id:'walt',x:10,y:6,dir:'down'},talkWalt)];
 out(M,7,10,6);
 M.arrive=async()=>{if(!N&&!F.u6in){F.u6in=1;await cut('unit6',()=>play(TEXT.unit6In));await play(TEXT.walt1);await trigger('liar');checkpoint()}
  if(N&&!F.u6night){F.u6night=1;await play(TEXT.unit6Night);checkpoint()}};
 return M}
function buildOffice(){const M=room('office','MANAGER\'S OFFICE',15,10,'n');
 put(M,'counter',2,5,7,1);M.O['3,5']=M.O['4,5']=M.O['7,5']=M.O['8,5']=look(TEXT.counter);M.O['5,5']=M.O['6,5']=talkLorraine;
 put(M,'keyboard',2,1,2,1,{walk:1});M.O['2,2']=M.O['3,2']={id:'keys',name:TEXT.keysName,look:()=>said(has('keys')?TEXT.keysGone:TEXT.keysLook),opts:()=>keyOpts(),used:()=>has('keys')};
 put(M,'mailboxes',10,0,4,3,{walk:1});M.O['11,3']=M.O['12,3']=look('Brass mailboxes. Unit 6\'s is stuffed full. Unit 12\'s has a sticker of a cartoon frog giving the finger.');
 put(M,'desk',4,3,2,1);put(M,'wac',7,1,1,1,{walk:1});put(M,'cooler',13,6);put(M,'plant',1,8);put(M,'chairs',10,7,2,1);
 M.npcs=[folkNPC({id:'lorraine',x:5,y:4,dir:'down',out:()=>!!G.flags.order&&(!has('count')||!!G.flags.lorStore)&&G.fs.talked.lorraine===G.clues.length},talkLorraine)];
 door(M,7,9,'court',27,13,'down');return M}
function buildUnit5(){const M=room('unit5','UNIT 5 · YBARRA',11,8,'c');
 put(M,'sofa',2,4,3,1);M.O['2,4']=M.O['3,4']=M.O['4,4']=look('A flowered sofa under a clear plastic cover. It crackles when you look at it.');put(M,'dogwall',5,0,4,3,{walk:1});M.O['6,3']=M.O['7,3']=look('A wall of framed photos, all of the same little dog in different sweaters.');
 put(M,'tv',8,3);put(M,'dogbed',8,5,1,1,{walk:1});put(M,'plant',1,3);
 M.O['9,3']={id:'shared',name:'THE SHARED WALL',look:'The wall Mrs. Ybarra shares with Unit 6. A crucifix, a calendar from a tire shop, a hairline crack.',opts:[{label:TEXT.sharedWall,once:'shared',run:()=>said(TEXT.sharedWallDo)}]};
 out(M,5,7,5);return M}
function buildUnit9(){const M=room('unit9','UNIT 9 · BANKS',11,8,'w'),F=G.flags;
 put(M,'bed',1,3,2,2);put(M,'foil',4,0,3,3,{walk:1});M.O['5,3']=look('Foil over the windows, taped at the edges. Not a crack of light. He sleeps days.');put(M,'chair',7,4);M.O['7,4']=look('Scrubs over a chair. A badge on a lanyard: T. BANKS, RN, NIGHTS.');
 put(M,'tapewall',9,0,1,3,{walk:1});M.O['9,3']=F.trey?{id:'nit',name:TEXT.nitName,look:TEXT.nitLook,opts:()=>nitOpts(),used:()=>has('nits')}:{id:'tape',name:TEXT.tapeName,look:TEXT.tapeLook,opts:[{label:TEXT.tapeOpen,run:openTape}]};
 put(M,'boxes',9,5,1,1,{v:0});
 M.npcs=[folkNPC({id:'trey',x:5,y:5,dir:'down',out:()=>!!F.trey&&(!F.arm||!!F.cold)},talkTrey)];
 out(M,5,7,9);return M}
function buildUnit12(){const M=room('unit12','UNIT 12 · DUONG',11,8,'c');
 put(M,'rig',1,3,3,1);M.O['1,3']=M.O['2,3']=M.O['3,3']=look(TEXT.rig);put(M,'ringlight',4,3);put(M,'hole',7,0,1,3,{walk:1});M.O['7,3']=look(TEXT.hole);
 put(M,'bed',8,3,2,2);put(M,'beanbag',3,5,1,1);
 M.npcs=[folkNPC({id:'kenny',x:5,y:5,dir:'left',out:()=>has('nits')&&!!G.fs.used['opt:gummy']},talkKenny)];
 out(M,5,7,12);return M}
function buildLaundry(){const M=room('laundry','LAUNDRY ROOM',13,8,'v',{alpha:.72}),F=G.flags,N=isNight();
 [[1,'washer'],[2,'washer'],[3,'washer'],[5,'dryer'],[6,'dryer'],[7,'dryer']].forEach(([x,k],i)=>{put(M,k,x,3,1,1,{on:k==='dryer'&&i===4&&!N});M.O[x+',3']=look(k==='washer'?TEXT.washers:TEXT.dryers)});
 put(M,'freezer',9,3,2,1);M.O['9,3']=M.O['10,3']={id:'freezer',name:'CHEST FREEZER',look:TEXT.freezer,opts:()=>N&&!F.ice?[{label:TEXT.freezerTake,run:async()=>{F.ice='freezer';await said(TEXT.freezerTakeDo);checkpoint()}}]:[],used:()=>!N||!!F.ice};
 put(M,'soda',11,3);M.O['11,3']=look(TEXT.soda);
 put(M,'foldtable',3,5,3,1);
 M.O['3,5']=M.O['4,5']=M.O['5,5']=N?{id:'table',name:TEXT.tableName,look:TEXT.tableLook,opts:()=>tableOpts(),used:()=>false}:look('A folding table, sticky with fabric softener.');
 put(M,'bin',10,6);
 M.O['10,6']={id:'bin',name:TEXT.binName,look:TEXT.binLook,opts:[{label:TEXT.binOpt,once:'bin',run:async()=>{await said(TEXT.binFind);await pickup('shrooms')}}]};
 put(M,'tube',4,0,5,1,{walk:1});
 door(M,6,7,'court',31,13,'down');
 M.arrive=laundryArrive;
 return M}

// ---- HWY 71 SELF STORAGE: day only (30 x 20, the highway along the bottom), reached by van ----
function buildStorage(){
 const M=blank('storage','HWY 71 SELF STORAGE',30,20,'g','day'),F=G.flags;
 block(M,0,0,30,4);put(M,'units',0,0,30,4,{walk:1,first:78});
 for(let i=0;i<10;i++){const x=2+3*i,n=78+i;open(M,x,3);
  if(n===83){if(F.bayOpen)door(M,x,3,'bay',4,5,'up');else M.O[x+',3']={id:'bay',name:TEXT.bayName,look:TEXT.bayLook,opts:()=>bayOpts()}}
  else M.O[x+',3']=look('A roll-up door, padlocked. A number painted over it, and a sticker: NO HAZARDOUS MATERIALS. NO REFRIGERATORS.')}
 put(M,'booth',24,6,3,2);M.O['24,7']=M.O['26,7']=look('The office booth. A box fan blowing on a sleeping cat.');put(M,'pole',13,6);M.O['13,6']=look('One light on a pole, buzzing, on, at two in the afternoon.');
 put(M,'van',5,9,4,1,{face:'side'});[5,6,7,8].forEach(x=>M.O[x+',9']={id:'van',name:'VAN',look:TEXT.van,opts:()=>vanOpts()});
 put(M,'linkfence',0,11,30,1,{gap:[13,16]});block(M,0,11,13,1);block(M,16,11,14,1);
 lay(M,0,12,30,1,'.');lay(M,0,13,30,3,'=');lay(M,0,16,30,4,'.');block(M,0,14,30,6);M.lines.push({x:0,y:14*16+7,w:30*16,h:2,dashed:true,col:'#e8c84a'});lay(M,13,11,3,1,'g');
 bounceDir(M,Array.from({length:30},(_,x)=>x+',13'),'Highway 71. Trucks, and heat, and a man selling peaches out of a truck bed. Not yet.','up');
 [[1,12],[9,12],[20,12],[28,12],[28,6],[4,17],[15,18],[24,17]].forEach(([x,y])=>put(M,'shrub',x,y));[[9,19],[19,19],[28,19]].forEach(([x,y])=>put(M,'tree',x,y));
 M.npcs=[folkNPC({id:'dale',x:25,y:8,dir:'down',out:()=>!!F.dale1},talkDale)];
 return M}
function buildBay(){const M=blank('bay','STORAGE UNIT 83',9,7,'o','day'),F=G.flags;block(M,0,0,9,3);block(M,0,0,1,7);block(M,8,0,1,7);block(M,0,6,9,1);
 put(M,'bayroom',0,0,9,7,{walk:1});put(M,'shelfin',1,3,2,1,{stocked:true,jars:!F.bay});
 M.O['1,3']=M.O['2,3']={id:'shelf',name:TEXT.shelfName,look:()=>said(F.bay?'Steel shelving, empty now. Two rings in the dust where the jars sat.':TEXT.shelfLook),opts:()=>F.bay?[]:[{label:TEXT.shelfTake,run:takeBayJars}],used:()=>!!F.bay};
 put(M,'boxes',6,3,1,1,{v:2});M.O['6,3']={id:'list',name:TEXT.listName,look:readList,used:()=>has('list')};put(M,'boxes',7,3,1,1,{v:1});
 put(M,'gracebox',6,5);M.O['6,5']={id:'grace',name:TEXT.graceName,look:TEXT.graceLook,opts:()=>has('grace')?[]:graceOpts(),used:()=>has('grace')};put(M,'boxes',1,5,1,1,{v:0});
 open(M,4,6);M.warps['4,6']=()=>goTo('storage',17,4,'down');
 M.arrive=async()=>{if(!F.bayIn){F.bayIn=1;await play(TEXT.bayIn);checkpoint()}};
 return M}

// ---- THE POOL PUMP ROOM: night 1, the finale area (16 x 9) ----
// The boss waits at the nest: talking to Walt, or stepping onto the row in front of the nest (x 9-14, y 4), asks Go in
// / Not yet. The filter, the pipes and the sump are reached without crossing that row.
async function enterPump(){const r=await ask('',TEXT.hatchQ,TEXT.gateIn,NOT_YET);if(r===0)await goTo('pump',8,2,'down');else{G.dir='up';await stepBack()}}
function buildPump(){const M=blank('pump','THE POOL PUMP ROOM',16,9,'o','night'),F=G.flags;M.alpha=.86;M.warm='#ffcf80';
 block(M,0,0,16,2);block(M,0,0,1,9);block(M,15,0,1,9);block(M,0,8,16,1);put(M,'vault',0,0,16,9,{walk:1});
 put(M,'filter',2,2,2,2);M.O['2,4']=M.O['3,4']=look(TEXT.filter);put(M,'pipes',4,0,10,2,{walk:1});M.O['5,2']=M.O['6,2']=look(TEXT.pipes);
 put(M,'sump',11,6,1,1,{walk:1});block(M,11,6);put(M,'bulb',5,1,1,1,{walk:1});
 M.O['11,6']={id:'sump',name:TEXT.sumpName,look:TEXT.sumpLook,opts:[{label:'Fish it out',once:'sump',run:async()=>{await said(TEXT.sumpDo);await pickup('roadflare')}}]};
 put(M,'nest',10,2,4,2);
 M.npcs=F.boss?[]:[folkNPC({id:'walt',x:12,y:4,dir:'up'},talkWaltNest)];
 open(M,8,1);M.pieces.push({k:'ladder',x:8,y:0,w:1,h:2,walk:1});
 M.warps['8,1']=async()=>{const r=await ask('',TEXT.pumpOut,TEXT.pumpOutOpts);if(r===0)await goTo('court',17,11,'left');else{G.dir='down';await stepBack()}};
 M.onStep=async()=>{if(!F.boss&&G.y===4&&G.x>=9&&G.x<=14){held=[];await bossAsk()}};
 M.arrive=async()=>{if(!F.nest){F.nest=1;await cut('nest',()=>play(TEXT.pump1));G.mode='scene';await horror(HORRORS.nest);G.mode='world';checkpoint()}};
 M.boss=!F.boss;
 return M}
const MAPS={court:buildCourt,unit6:buildUnit6,office:buildOffice,unit5:buildUnit5,unit9:buildUnit9,unit12:buildUnit12,laundry:buildLaundry,storage:buildStorage,bay:buildBay,pump:buildPump};

// ================= THE VAN, THE STORAGE ROW AND THE TENTING =================
function vanOpts(){if(isNight())return[];const o=[];
 if(G.map==='court')o.push({label:TEXT.vanOpt.storage,run:()=>driveTo('storage')},{label:TEXT.vanOpt.tent,run:tentUp});
 else o.push({label:TEXT.vanOpt.court,run:()=>driveTo('court')});
 return o}
async function driveTo(where){await fade(1);await say('',TEXT.driveTo[where]);
 if(where==='storage')goMap('storage',7,10,'up');else goMap('court',8,21,'down');checkpoint();await fade(0);if(G.M.arrive)await G.M.arrive()}
// The deduction (Gameplay loop, Deduction): Big Hat on the van's radio, the first time you call the crew. Right needs
// `count` plus `list` or `ledger` (the crew brings ice and a fogger); Walt needs `count` (his trust is gone tonight);
// swarm costs time (late +1). An answer without its clues plays as no proof. Never a dead end: the tent goes up anyway.
async function deduce(){
 const F=G.flags;await said(TEXT.radio1);await hunch(TEXT.hunch);
 const right=()=>has('count')&&(has('list')||has('ledger'));
 let r=await ask('BIG HAT',TEXT.radioAsk,TEXT.radioOpts);
 // Loose thread (an arc perk, spec 008): once per case, a wrong answer costs nothing and you can answer again
 const lt=!(r===1&&right())&&live().find(m=>perkOn(m,'truth'));
 if(lt){await say('',fillT(BLS.HOMEW.perkUsed,{p:BLS.HOMEW.perks.truth[0],n:lt.name}));r=await ask('BIG HAT',TEXT.radioAsk,TEXT.radioOpts)}
 if(r===1&&right()){F.deduce='right';await play(TEXT.radioRight)}
 else if(r===1){F.deduce='noproof';await play(TEXT.radioNoProof)}
 else if(r===2){F.deduce='walt';F.trust=1;await play(TEXT.radioWalt)}
 else{F.deduce='swarm';addLate();await play(TEXT.radioSwarm)}
 checkpoint()}
// the tenting at dusk: the case's one point of no return. Go on / Not yet, cursor on Not yet, naming what closes.
async function tentUp(){const F=G.flags;if(isNight())return;
 if(!has('count')){await said(TEXT.tentNoCount);return}
 if(!F.deduce)await deduce();
 const r=await ask('',TEXT.tentQ+' '+TEXT.tentClose,TEXT.turnOpts,NOT_YET);if(r!==0)return;
 await fade(1);F.ph=1;G.mode='scene';await play(TEXT.tented);G.mode='world';goMap('court',16,7,'down');banner(TEXT.phase[1]);checkpoint();await fade(0);
 await trigger('night');await courtArrive()}
async function talkDale(){const F=G.flags;if(F.dale1){await play(TEXT.daleAfter);return}F.dale1=1;await play(TEXT.dale1);checkpoint()}
function bayOpts(){const F=G.flags,go=async()=>{F.bayOpen=1;checkpoint();rebuild();await goTo('bay',4,5,'up')};return[
 {label:TEXT.bayKey,show:()=>!!F.skey,run:go},
 {use:'talk',label:TEXT.bayTalk,once:'bayTalk',ok:async()=>{await play(TEXT.bayTalkDo);await go()},fail:()=>play(TEXT.bayTalkFail)},
 {item:'bolt',label:TEXT.bayCut,run:async()=>{await said(TEXT.bayCutDo);await overstepHere('public');await go()}},
 {use:'force',ok:async()=>{await said(TEXT.bayForce);await overstepHere('public');await go()},fail:()=>said('The padlock is a better padlock than the unit deserves.')}]}
async function readList(){await play(TEXT.listDo);if(has('count'))await said(TEXT.listCount);clue('list',TEXT.cList);checkpoint()}
async function takeBayJars(){const F=G.flags;F.bay=1;await said(TEXT.shelfDo);checkpoint();rebuild()}
function graceOpts(){const ok=async()=>{await play(TEXT.graceDo);clue('grace',TEXT.cGraceB);checkpoint()};
 return[{use:'read',label:TEXT.graceRead,ok,fail:()=>said(TEXT.graceFail)},{use:'sweep',ok,fail:()=>said(TEXT.graceFail)}]}

// ================= PECAN COURT BY DAY: THE OFFICE, DENISE, WALT AND THE NEIGHBORS =================
async function courtArrive(){const F=G.flags;
 if(!isNight()){if(noticed()&&!F.kenFilm&&!F.kenny){F.kenFilm=1;await said(TEXT.kenFilm)}return}
 if(!F.night1){F.night1=1;await cut('night1',()=>play(TEXT.night1));await horror(HORRORS.crawler);
  // the tent intel (spec 013): the Lantern Box and the work lights show on the map; Search's On guard spots the beats
  if(tentIntel())setTrail([[3,8],[6,8],[23,8],[30,14],[3,12]],'path');
  const L=lead();if(skillVal(L.a,'Search')>=75&&!G.fs.used.onguard){G.fs.used.onguard=1;const o=SR.pct(chanceOf(L,'Search'));
   await say('',resultLine('ON GUARD · SEARCH',o),{auto:1000});
   if(o.ok){setTrail(G.M.roamers.flatMap(r=>r.path),'beat');await said(TEXT.onguardOk)}else{tried(L,'Search');await said(TEXT.onguardFail)}}
  checkpoint()}}
// Local chief locked the office for the day: Credentials (it pushes overstepping back a step) or a Persuade roll at −20
function officeOpts(){const go=async()=>{G.flags.officeIn=1;await goTo('office',7,8,'up')};
 return[{use:'creds',ok:async()=>{await stepBack1();await go()},fail:()=>said('You hold your laminated license up to the glass. Nobody\'s there to read it.')},
  {use:'talk',mod:-20,ok:async()=>{await said('You call the number on Sgt. Ruiz\'s card and explain about the termites for eleven minutes. Lorraine comes back from lunch early to let you in.');await go()},fail:()=>said('Sgt. Ruiz\'s voicemail is full.')}]}
async function stepBack1(){const s=loadSeason();if((s.overstep|0)>0){s.overstep--;store.set(seasonKey(),s)}}
async function talkLorraine(){const F=G.flags;if(isNight())return;
 if(!F.order){F.order=1;await cut('lorraine',()=>play(TEXT.lor1));checkpoint();return}
 if(noticed()){await play(TEXT.lorQuiet);return}
 if(has('count')&&!F.lorStore){F.lorStore=1;await play(TEXT.lorStore);checkpoint();return}
 await play(TEXT.lorAfter)}
function keyOpts(){if(has('keys'))return[];const F=G.flags,got=async lines=>{await play(lines);clue('keys',TEXT.cKeys);checkpoint()};
 return[
  {use:'paper',label:TEXT.keysPaper,show:()=>!!F.order,ok:()=>got(TEXT.keysPaperDo),fail:()=>said('The key log wants a supervisor\'s initials. You don\'t have a supervisor. You have Big Hat.')},
  {use:'creds',label:TEXT.keysPaper,show:()=>!F.order,ok:()=>got(TEXT.keysPaperDo),fail:()=>said('Lorraine wants paperwork. You have a clipboard with nothing on it.')},
  {use:'sneak',label:TEXT.keysSneak,ok:()=>got(TEXT.keysSneakDo),fail:async()=>{await said(TEXT.keysSneakMiss);await overstepHere('seen')}},
  {use:'talk',label:TEXT.keysTalk,mod:lorMod,ok:()=>got(TEXT.keysTalkDo),fail:()=>said('Lorraine holds up one finger. The saxophone is building to something.')}]}
// Denise: knocks with you (Read or Talk, +10 with the Walt intel; or wait with her, no roll), her mother (Read: `grace`),
// and the receipt (Talk, once the lot is counted: `list`'s second way)
async function talkDenise(){const F=G.flags;
 if(!F.den1){F.den1=1;await play(TEXT.den1);checkpoint()}else if(F.u6&&!F.denIn){F.denIn=1;await play(TEXT.denIn)}
 const knock=async(lines)=>{await play(lines);await enterU6('denise')};
 const wm=()=>intelOn('walt')?10:0,noSkill=()=>!teamHas('Empathy',40)&&!teamHas('Persuade',40);
 await hotspot({name:'DENISE',look:()=>play(TEXT.denAfter),opts:[
  {use:'read',label:TEXT.denKnock,show:()=>!F.u6,mod:wm,ok:()=>knock(TEXT.denKnockDo),fail:async()=>{G.fs.used['opt:knockFail']=1;await play(TEXT.denKnockFail)}},
  {use:'talk',label:TEXT.denKnock,show:()=>!F.u6,mod:wm,ok:()=>knock(TEXT.denKnockDo),fail:async()=>{G.fs.used['opt:knockFail']=1;await play(TEXT.denKnockFail)}},
  {label:TEXT.denWait,show:()=>!F.u6&&(!!G.fs.used['opt:knockFail']||noSkill()),run:()=>knock(TEXT.denWaitDo)},
  {use:'read',label:TEXT.denMom,once:'denMom',show:()=>!has('grace'),ok:async()=>{await play(TEXT.denMomDo);clue('grace',TEXT.cGrace);checkpoint()},fail:()=>said('She shakes her head and looks at the building.')},
  {use:'talk',label:TEXT.denReceipt,once:'denReceipt',show:()=>has('count')&&!has('list'),ok:async()=>{await play(TEXT.denReceiptDo);clue('list',TEXT.cListD);checkpoint()},fail:()=>said('"Why do you want to know what he paid?" Fair question.')}]},'denise')}
// Walt in his recliner: a liar (Paranoia). Read gets where the ledger is; Look at his arm is the Severe horror.
async function talkWalt(){const F=G.flags;await trigger('liar');
 await hotspot({name:TEXT.waltName,look:()=>play(TEXT.waltLook),opts:[
  {use:'read',once:'waltRead',show:()=>!has('ledger'),ok:async()=>{F.ledgerHint=1;await play(TEXT.waltRead);checkpoint()},fail:()=>play(TEXT.waltReadFail)},
  {label:TEXT.waltArm,once:'arm',run:async()=>{F.arm=1;await play(TEXT.waltArmDo);await horror(HORRORS.arm);checkpoint()}}]},'walt')}
function lotOpts(){const F=G.flags,N=isNight(),o=[];
 if(!has('count')){const done=async(lines,gap)=>{await play(lines);await said(TEXT.emptyJar);await horror(HORRORS.empty);
   if(gap)F.gap=1;clue('count',F.gap?TEXT.cCountGap:TEXT.cCount);if(!N)await play(TEXT.countWalt);checkpoint()};
  o.push({use:'sweep',mod:()=>intelOn('lot')?10:0,ok:()=>done(TEXT.countSweep,1),fail:()=>said('You lose count at nineteen because the fan shrieks.')},
   {use:'sample',ok:()=>done(TEXT.countSample),fail:()=>said('You get a sample on your glove and nothing else.')},
   {use:'records',ok:()=>done(TEXT.countRecords),fail:()=>said('The books won\'t sit still in your head.')},
   {label:TEXT.countHand,run:()=>done(TEXT.countHandDo)})}
 if(!F.read)o.push(...readOpts());
 if(N&&has('count')&&!F.iced)o.push(...iceOpts());
 if(F.iced&&!F.keepJar)o.push({label:TEXT.iceKeep,run:async()=>{F.keepJar=1;await said(TEXT.iceKeepDo);await pickup('sleepjar');checkpoint()}});
 return o}
// reading Penhallow's books (the Curiosity moment): an hour, and 1d3 SAN; teaches its name (no phase-2 heal)
function readOpts(){const F=G.flags,read=async()=>{F.read=1;addLate();await play(TEXT.readDo);await horror(HORRORS.read);for(const m of holdersOf('Curiosity'))await motivate(m);checkpoint()};
 return[{use:'records',label:TEXT.readOpt,ok:read,fail:()=>said(TEXT.readFail)},{use:'identify',label:TEXT.readId,ok:read,fail:()=>said(TEXT.readFail)},
  {label:TEXT.readCurious,show:()=>holdersOf('Curiosity').length>0,run:read}]}
// packing the jars in ice (night 1): needs ice, and the idea (`nits` or the right deduction)
function iceOpts(){const F=G.flags;if(!(has('nits')||F.deduce==='right'))return[];
 if(!F.ice)return[{label:TEXT.iceOpt,run:()=>said(TEXT.iceNone)}];
 const pack=async()=>{F.iced=1;await play(TEXT.iceDo);if(F.bay)await said(TEXT.iceBay);checkpoint()};
 if(F.ice==='crew')return[{label:TEXT.iceCrew,run:pack}];
 return[{use:'fix',label:TEXT.iceOpt,ok:pack,fail:()=>said(TEXT.iceFail)},{use:'sample',label:TEXT.iceOpt,ok:pack,fail:()=>said(TEXT.iceFail)},
  {label:TEXT.iceHand,run:async()=>{addLate();await pack()}}]}
function fridgeOpts(){const F=G.flags,o=[];
 if(!G.fs.used['opt:drawing'])o.push({label:TEXT.fridgeTake,once:'drawing',run:async()=>{await said(TEXT.fridgeTakeDo);await pickup('drawing')}});
 if(!has('ledger')){
  if(F.ledgerHint)o.push({label:TEXT.freezerOpt,run:findLedger});
  else o.push({use:'sweep',label:TEXT.freezerOpt,ok:findLedger,fail:()=>said(TEXT.freezerLook)},{label:'Open the freezer',once:'freezerPeek',run:()=>said(TEXT.freezerLook)})}
 return o}
async function findLedger(){await play(TEXT.ledgerDo);clue('ledger',TEXT.cLedger);await pickup('ledger83');checkpoint()}
// the hidden hotspot (Mushrooms): Walt's note behind the patch; the clue `wall` and an Unsettling horror
async function readPatch(){const F=G.flags;F.patch=1;await play(TEXT.patch);await horror(HORRORS.patch);if(!has('wall')){clue('wall',TEXT.cWallP);checkpoint()}}
async function talkDolores(){const F=G.flags;
 if(!F.dol1){F.dol1=1;await play(TEXT.dol1);checkpoint();return}
 if(noticed()){await play(TEXT.dolQuiet);return}
 await hotspot({name:'MRS. YBARRA',look:()=>play(TEXT.dolAfter),opts:[{use:'read',label:TEXT.dolTalk,once:'dolWalt',mod:()=>noticed()?-20:0,ok:()=>play(TEXT.dolWalt),fail:()=>play(TEXT.dolAfter)},
  {use:'talk',label:TEXT.dolTalk,once:'dolWalt2',show:()=>!G.fs.used['opt:dolWalt'],ok:()=>play(TEXT.dolWalt),fail:()=>play(TEXT.dolAfter)}]},'dolores')}
// Trey: his taped wall is the first story fight (4 nits, 1 skull); a Loud fight in there by day is a seen overstep
async function talkTrey(){const F=G.flags;
 if(!F.trey1){F.trey1=1;await play(TEXT.trey1);checkpoint();return}
 if(F.trey&&F.arm&&!F.cold){await hotspot({name:'TREY',opts:[{label:TEXT.treyArm,run:async()=>{F.cold=1;await play(TEXT.treyArmDo);checkpoint()}}]},'trey');return}
 await play(F.trey?TEXT.treyAfter:TEXT.trey1.slice(1))}
async function openTape(){const F=G.flags;if(F.trey)return;
 await cut('tape',()=>play(TEXT.tapeDo));await horror(HORRORS.tape);await trigger('subject','the dark');if(!party.some(m=>!m.gone))return;
 const r=await battle(['nit','nit','nit','nit'],{story:true,intro:TEXT.nitsIntro});if(r==='lose')return gameOver();
 F.trey=1;await play(TEXT.nitsAfter);if(G.fs.lastLoud){G.fs.lastLoud=0;F.loudDay=1;await said(TEXT.nitsLoud);await overstepHere('seen')}
 checkpoint();rebuild()}
function nitOpts(){if(has('nits'))return[];const got=async lines=>{await play(lines);clue('nits',TEXT.cNits);checkpoint()};
 return[{use:'examine',ok:()=>got(TEXT.nitExam),fail:()=>said('A dead grub. You can\'t make it say anything.')},{use:'sample',ok:()=>got(TEXT.nitSample),fail:()=>said('It pops. You get it on your sleeve. That\'s all you get.')},
  {use:'identify',ok:()=>got(TEXT.nitIdent),fail:()=>said('You\'ve never read about anything like it. That\'s worse than if you had.')}]}
// Kenny: a liar (Paranoia: "it's a rat"). His video is `nits`' second way; his gummies are the Mushrooms.
async function talkKenny(){const F=G.flags;await trigger('liar');
 if(!F.ken1){F.ken1=1;await play(TEXT.ken1)}
 const video=async()=>{await play(TEXT.kenVideoDo);clue('nits',TEXT.cNits);checkpoint()};
 await hotspot({name:'KENNY',look:()=>play(TEXT.kenAfter),opts:[
  {use:'talk',label:TEXT.kenVideo,show:()=>!has('nits'),ok:video,fail:()=>said('"It\'s a rat," Kenny says again, to his own feet.')},
  {use:'crack',label:TEXT.kenCrack,show:()=>!has('nits'),ok:video,fail:()=>said('His stream has two-factor. Good for Kenny.')},
  {use:'talk',label:TEXT.kenGummy,once:'gummy',ok:async()=>{await play(TEXT.kenGummyDo);await pickup('shrooms')},fail:()=>said('"What gummies," Kenny says. There are gummies.')}]},'kenny')}
async function talkGus(){const F=G.flags;
 if(!F.gus1){F.gus1=1;await play(TEXT.gus1);checkpoint()}
 if(has('wall')){await play(TEXT.gusAfter);return}
 const got=async()=>{await play(TEXT.gusWall);clue('wall',TEXT.cWallG);checkpoint()};
 await hotspot({name:'GUS',look:()=>play(TEXT.gusAfter),opts:[{use:'read',label:TEXT.gusTalk,ok:got,fail:()=>play(TEXT.gusFail)},{use:'talk',label:TEXT.gusAsk,ok:got,fail:()=>play(TEXT.gusFail)}]},'gus')}
async function talkHector(){const F=G.flags;
 if(!F.hec1){F.hec1=1;await play(TEXT.hec1);checkpoint()}
 if(F.hector){await play(TEXT.hecAfter);return}
 const got=async()=>{F.hector=1;await play(TEXT.hecWall);if(!has('wall'))clue('wall',TEXT.cWallH);await pickup('fogger');checkpoint()};
 await hotspot({name:'HECTOR',look:()=>play(TEXT.hecAfter),opts:[{use:'talk',label:TEXT.hecTalk,ok:got,fail:()=>play(TEXT.hecFail)},{use:'read',label:TEXT.hecRead,ok:got,fail:()=>play(TEXT.hecFail)}]},'hector')}

// ================= NIGHT 1 UNDER THE TENT =================
async function laundryArrive(){const F=G.flags;if(!isNight()||F.drone)return;
 await cut('drone',()=>play(TEXT.droneIn));
 const r=await battle(['drone','nit','nit'],{story:true,intro:TEXT.droneIntro});if(r==='lose')return gameOver();
 F.drone=1;await play(TEXT.droneAfter);checkpoint()}
function tableOpts(){const F=G.flags,o=[];
 if(F.deduce==='right'&&!F.cooler)o.push({label:TEXT.coolerTake,run:async()=>{F.cooler=1;F.ice='crew';await said(TEXT.coolerLook);await said(TEXT.coolerDo);await pickup('fogger');checkpoint()}});
 o.push({label:TEXT.restOpt,run:async()=>{addLate();await fade(1);await play(TEXT.rested);await rest(1);checkpoint();await fade(0)}});
 return o}
async function openBox(){await lanternBox('lot83',['roadflare','flashbang','firstaid'],TEXT.boxLine);if(G.fs.trail&&G.fs.trail.court)delete G.fs.trail.court.path}
async function stopCrawler(){const F=G.flags;if(F.crawler)return;F.crawler=1;await said('The crawler\'s jar rolls loose on the concrete, unbroken. You pick it up. It\'s warm. You don\'t think about how warm.');checkpoint()}
async function freeKenny(){const F=G.flags;if(F.kenny)return;F.kenny=1;await play(TEXT.kenGone);checkpoint()}
async function talkKennyNight(){const F=G.flags;if(F.kenny)return;
 await play(TEXT.kenNight);await hotspot({name:TEXT.kenName,look:TEXT.kenLook,opts:[{label:TEXT.kenOut,run:freeKenny}]},'kennyNight')}
// the pump hatch: open with `wall` (Walt's padlock hangs open); otherwise force it, unscrew it, cut it, shoot it
// (Loud), or follow the warm pipes (an hour, no roll). Anything inside the tent at night is unseen (Luck, no penalty).
const hatchOpen=()=>has('wall')||!!G.flags.hatch;
function hatchOpts(){const F=G.flags;if(hatchOpen())return[];
 const opened=async(line,quiet)=>{F.hatch=1;await said(line);if(!quiet)await overstepHere(false);checkpoint()};
 return[{use:'force',ok:()=>opened(TEXT.hatchForce),fail:()=>said('The hasp holds. Old concrete, new padlock.')},
  {use:'fix',ok:()=>opened(TEXT.hatchFix,1),fail:()=>said('The screws are rusted into the concrete.')},
  {item:'bolt',run:()=>opened(TEXT.hatchCut)},
  {use:'shoot',ok:()=>opened(TEXT.hatchShoot),fail:()=>said('The shot sparks off the hatch and goes somewhere. Everything under the tent goes quiet, listening.')},
  {label:TEXT.hatchPipes,run:async()=>{addLate();F.hatch=1;await play(TEXT.hatchPipesDo);checkpoint()}}]}
// re-route the hatch: walking onto it asks Go in / Not yet once it's open; until then, it's the hatch's options
async function enterPumpGate(){if(hatchOpen()){if(has('wall')&&!G.flags.hatchSaid){G.flags.hatchSaid=1;await said(TEXT.hatchOpenW)}return enterPump()}
 G.dir='up';await stepBack();await hotspot({name:TEXT.hatchName,look:()=>said(TEXT.hatchNight),opts:()=>hatchOpts()},'hatch')}

// ================= THE PUMP ROOM: WALT AND THE BOSS =================
// Walt in the nest (the Family moment): the drawing, Grace's words, Ledger 83's last line, or Read / Calm / Talk
// (−20 if the deduction blamed him). Talked down: −8 HP and no Gracie heal, and he's pulled out alive at half HP.
async function talkWaltNest(){const F=G.flags;if(F.boss)return;
 if(!F.waltNest){F.waltNest=1;await play(TEXT.waltNest);checkpoint()}
 if(F.walt){await play(TEXT.waltReady);return bossAsk()}
 const down=async lines=>{await play(lines);F.walt='down';addLate();await play(TEXT.downDone);for(const m of holdersOf('Family'))await motivate(m);checkpoint()};
 const tm=()=>F.trust?-20:0,fail=()=>play(TEXT.downFail);
 let did=false;const w=fn=>async(...a)=>{did=true;return fn(...a)};
 await hotspot({name:TEXT.waltName,look:()=>play(TEXT.waltAsleep),opts:[
  {item:'drawing',label:TEXT.downDraw,run:w(()=>down(TEXT.downDrawDo))},
  {label:TEXT.downGrace,show:()=>has('grace'),run:w(()=>down(TEXT.downGraceDo))},
  {label:TEXT.downLedger,show:()=>has('ledger'),run:w(()=>down(TEXT.downLedgerDo))},
  {use:'read',label:TEXT.downTalk,once:'downRead',mod:tm,ok:w(()=>down(TEXT.downTalkDo)),fail:w(fail)},
  {use:'calm',label:TEXT.downTalk,once:'downCalm',mod:tm,ok:w(()=>down(TEXT.downTalkDo)),fail:w(fail)},
  {use:'talk',label:TEXT.downTalk,once:'downTalk',mod:tm,ok:w(()=>down(TEXT.downTalkDo)),fail:w(fail)}]},'waltNest');
 if(F.walt)return bossAsk()}
// The boss waits for you (Gameplay loop; play.md): Go in / Not yet, cursor on Not yet; Not yet steps back off the row
async function bossAsk(){const F=G.flags;if(F.boss)return;
 const r=await ask('',TEXT.bossQ,TEXT.bossOpts,NOT_YET);
 if(r===0)return bossFight();
 if(G.y===4)StudioMove.place(G,G.x,5,'down')}
// The Lodger (Bosses; Combat numbers; tuned Nov 23, 2026 with tools/boss-sim.js). 62 HP; −8 if Walt was talked down,
// −6 if its name was read. Phase 1, nesting: 55% to hit; crush (5), the hum at everyone (2), a kind voice (1, 0/1d3
// SAN), Gracie (1: it heals 4 holding Walt) unless he was talked down, and a crawler feeding it (2: heal 4, then a
// crush) for every heal source left: Unit 6's jars un-iced counts two, the crawler's jar one. Phase 2 at half: it tears out of
// the pipes (DEX 12, +5% to hit, one more hum and one more crush) and heals 8 unless its name was spoken. Ledger 83
// (or Trey's word on the cold) makes Identify free.
async function bossFight(o={}){
 const F=G.flags;F.bossSeen=1;const down=F.walt==='down',read=!!F.read;
 await cut('boss',async()=>{await play(TEXT.boss1);await said(TEXT.bossSay);await said(TEXT.bossSay2);if(down)await said(TEXT.bossDown)});
 checkpoint();
 const E=EN.lodger;let feeds=(F.iced?0:2)+(F.crawler?0:1);
 if(window.L83B)L83B.held(true);
 E.moves=[['hit',5],['all',2],['san',1]].concat(down?[]:[['gracie',1]]).concat(feeds?[['feed',2]]:[]);
 const heal=(e,n)=>{const h=Math.min(n,e.mhp-e.hp);e.hp+=h;return h};
 E.acts={
  gracie:async e=>{await bsay(fill(TEXT.bossGracie,{n:heal(e,4)}),1300)},
  feed:async e=>{if(feeds>0){feeds--;await bsay(fill(TEXT.bossFeed,{n:heal(e,4)}),1300)}await crush(e)}};
 E.phase2={at:.5,hit:5,moves:{all:1,hit:1},line:TEXT.bossPhase,on:async e=>{e.dex=12;
  if(down){if(window.L83B)L83B.held(false);F.pulled=1;await bsay(TEXT.bossPull,1600)}else await bsay(TEXT.bossKeep,1300);
  if(read){await bsay(TEXT.bossName,1600);return}await bsay(fill(TEXT.bossHeal,{n:heal(e,8)}),1300)}};
 const cuts=(down?8:0)+(read?6:0),hp=E.hp-cuts;
 const r=await battle(['lodger'],{boss:true,hp,intro:TEXT.bossIntro,onStart:async()=>{
  if(cuts)await say('',TEXT.bossThin,{auto:1500});
  if(has('ledger')||F.cold){G.fs.ident=G.fs.ident||[];if(!G.fs.ident.includes('en:lodger'))G.fs.ident.push('en:lodger');await say('',has('ledger')?TEXT.bossIdent:TEXT.bossIdentCold,{auto:1600})}}});
 if(r==='lose')return gameOver();
 if(o.noEnd)return;  // the simulator stops at the fight's end
 F.boss=1;await ending();
}
// its heals come on top of a crush (battle.js's own attack), so each one it loses is a real help
async function crush(e){const t=pickTarget(e);if(!t)return;await foeHits(e,t,e.dmg)}
window.l83Boss=()=>bossFight({noEnd:true});  // the boss simulator's entry (tools/boss-sim.js)

// ================= OVERSTEPPING (Skills and menus, Overstepping and cover stories) =================
// A quiet case: they came as the pest-control crew. Noticed first (Lorraine and Mrs. Ybarra clam up, Kenny films the
// crew), then Local chief (Sgt. Ruiz's walk-through: the office locks for the day), Agency call (Big Hat), and the
// clean-up crew at the next area change (Federal agents: a fight, then back to Local chief). Inside the tent at night, nobody sees.
async function overstepHere(seen){if(!(await overstep(seen)))return;await stepScene()}
async function stepScene(){
 const F=G.flags,s=stepName();
 if(s==='Noticed'&&!F.noticed){F.noticed=1;if(isNight())await said(TEXT.noticedNight);else await play(TEXT.noticed)}
 if(s==='Local chief'&&!F.chief){F.chief=1;if(isNight())await said(TEXT.noticedNight);else{await cut('chief',()=>play(TEXT.chief))}}
 if(s==='Agency call'&&!F.call){F.call=1;await play(TEXT.call)}
 if(s==='Federal agents')F.fedsDue=1;
 checkpoint()}
async function onArea(){await feds(TEXT,play)}

// ================= ENDING =================
// clean: the Lodger ended, Walt alive, the nest burned, every jar accounted for (Unit 6's iced, the storage pair
// brought back, the crawler's jar), overstepping didn't climb this case, no agent lost, and out before dawn (late < 4).
// costly: ended any other way. (worst: only in debrief saves from before Nov 24, 2026, when the clean-up crew shut a case down.)
const lostHere=()=>(store.get(B.key('memorial'),[])||[]).filter(x=>x&&x.case===G.case&&!x.done);
const jarsAll=()=>{const F=G.flags;return !!(F.iced&&F.bay&&F.crawler)};
function endingLabel(){const F=G.flags;
 return(F.walt==='down'&&F.burn&&jarsAll()&&!G.fs.climbed&&!lostHere().length&&late()<4)?'clean':'costly'}
function endingFacts(label){const F=G.flags;
 return{label,clues:G.clues.map(c=>c.id),saved:F.walt==='down'?1:0,overstep:stepName(),
  san:party.map(m=>({id:m.a.id,name:m.name,from:m.san0,to:m.san})),
  items:party.flatMap(m=>gearOf(m).it.filter(it=>it.pin).map(it=>it.k)).concat((G.fs.pack||[]).filter(it=>it.pin).map(it=>it.k)),
  choices:{deduce:F.deduce||null,walt:F.walt||null,iced:!!F.iced,bay:!!F.bay,crawler:!!F.crawler,read:!!F.read,kenny:!!F.kenny,burn:F.burn||null,forced:!!F.forced,late:late(),jars:jarsAll()},
  tried:party.map(m=>({id:m.a.id,skills:m.tried||[]})),
  lost:lostHere().map(x=>({name:x.name,how:x.how}))}}
async function ending(){
 const F=G.flags,alive=F.walt==='down';
 await play(TEXT.end1);await play(alive?TEXT.endWalt:TEXT.endDead);if(!alive)await trigger('death');
 const b=await ask('',TEXT.burnQ,TEXT.burnOpts,NOT_YET);
 if(b===0){F.burn='burned';await play(TEXT.burnDo);if(F.deduce==='right')await said(TEXT.burnCrew);else{await said(TEXT.burnSeen);await overstepHere('seen')}}
 else{F.burn=null;await said(TEXT.burnLeave)}
 if(!has('ledger')&&!holderOf('ledger83')){await said(TEXT.ledgerDrop);await pickup('ledger83')}
 // Zuri's drawing goes back to Denise: each Family holder's first Bond +1 (up to CHA)
 const d=holderOf('drawing');if(alive&&d){spend(d.m,d.it);await said(TEXT.drawBack);
  for(const m of holdersOf('Family')){const b0=(m.a.bonds||[])[0];if(b0){const cha=m.a.stats.CHA||10;b0.score=Math.min(cha,(b0.score??cha)+1)}}}
 await fade(1);G.mode='scene';await fade(0);
 await said(TEXT.dawn);await said(alive?TEXT.dawnWalt:TEXT.dawnDead);if(!F.kenny)await said(TEXT.dawnKenny);if(late()>=4)await said(TEXT.dawnLate)
 G.rescued=alive?1:0;
 const label=endingLabel();await debrief(label,endingFacts(label));  // Big Hat's debrief and the case gains (debrief.js)
}

// ================= THE DEBRIEF (spec 007) =================
// The clues the card counts, the one person to keep safe (Walt), Big Hat's lines by ending and about the choices, the
// cover stories (2 with a skill, the weak Luck one, the easy one for a quiet case still Clean, Clean books'), and the
// lines after Ledger 83 and a sleeping jar are bagged. Kenny's video makes the skill stories harder (−20).
const DB=TEXT.db;
const kenMod=()=>{const f=G.db&&G.db.facts;return f&&f.choices&&!f.choices.kenny?-20:0};
const DEBRIEF_DATA={
 clues:['keys','count','list','wall','ledger','nits','grace'],victims:1,
 lines:{clean:DB.clean,costly:DB.costly,worst:DB.worst},
 react:F=>{const c=F.choices||{},out=[];if(c.walt==='down')out.push(DB.walt);else if(F.label!=='worst')out.push(DB.dead);
  if(c.deduce==='swarm')out.push(DB.swarm);if(c.deduce==='walt')out.push(DB.waltdid);if(c.forced)out.push(DB.forced);if(!c.kenny&&F.label!=='worst')out.push(DB.kenny);if(c.read)out.push(DB.read);
  return F.label==='worst'?out.slice(0,1):out.slice(0,3)},
 end:[TEXT.endBrisket],
 stories:[{name:DB.mold,skill:'Bureaucracy',verb:'paper it',pass:DB.moldPass,get mod(){return kenMod()}},
  {name:DB.termite,skill:'Persuade',verb:'sell it',pass:DB.termitePass,get mod(){return kenMod()}}],
 weak:{name:DB.weak,pass:DB.weakPass},
 easy:{name:DB.easy,skill:'Persuade',verb:'sell it',pass:DB.easyPass,get mod(){return 30+kenMod()}},
 safe:{name:DB.safe,pass:DB.safePass},
 bagged:{ledger83:[TEXT.filed],sleepjar:DB.jar}
};

// ================= OPENING (Big Hat's briefing in the barbecue joint's walk-in cooler) =================
// Each cut is a cutscene B skips once seen (engine.js); the questions and requisition always play.
async function caseOpening(){
 if(G.rewrote){G.rewrote=0;await said(TEXT.rewritten)}
 await cut('open',async()=>{await said(TEXT.open1);await said(TEXT.open2)});
 await bigHatScene(async()=>{
  await cut('brief',async()=>{await play(TEXT.brief);await shout(TEXT.briefShout);await play(TEXT.brief2)});
  await twoQuestions(TEXT.intel);
  await cut('brief3',()=>play(TEXT.brief3));
  await requisition();
  await cut('brief4',()=>play(TEXT.brief4));
 },{place:window.L83A.cooler});  // the walk-in cooler (the debrief uses the same place, registerCase place)
 G.flags.ph=0;G.mode='world';goMap('court',8,21,'down');checkpoint();await fade(0);
 await cut('arrive',async()=>{
  for(const m of squad())await say(m.name.toUpperCase()+' · '+profOf(m.a).name.toUpperCase(),TEXT.role[profOf(m.a).role]||TEXT.roleAny);
  await said(TEXT.arrive)});
}
// the Case file's Next line
const caseNext=()=>{const N=TEXT.next,F=G.flags;
 if(F.boss)return N.home;
 if(isNight())return hatchOpen()?N.pump:N.find;
 if(!F.order&&!F.u6)return N.order;
 if(!has('count'))return N.unit6;
 return has('list')||F.bayOpen?N.day:N.storage};

// ================= ON THE CASE BOARD =================
// portraits: the townsfolk's and Walt's faces (lot-83-art.js), and the boss's (lot-83-battle-art.js).
// sprite/spriteSize: battle sprites (the clean-up agent is Still Harvest's SHB).
// A save from part A (the stand-in, before the story) restarts the case from its briefing with what the team carries.
registerCase({id:'lot-83',card:caseCard,opening:caseOpening,intel:TEXT.intel,maps:MAPS,tiles:{},
 portraits:name=>window.L83A.portraits[name]||(name==='THE LODGER'&&window.L83B?L83B.portrait:null),
 enemies:EN,sprite:(k,f,w)=>k==='fed'&&window.SHB?SHB.sprite('fed',f,w):window.L83B?L83B.sprite(k,f,w):null,
 spriteSize:k=>k==='fed'&&window.SHB?SHB.size('fed'):window.L83B?L83B.size(k):[24,24],
 backdrop:(p,o)=>window.L83B?L83B.backdrop(p,o):null,
 get place(){return window.L83A&&L83A.cooler},  // Big Hat's place for this case: the briefing passes it, and the debrief plays there too (engine.js casePlace)
 items:CASE_ITEMS,next:caseNext,quiet:true,loot:LOOT,onArea,
 debrief:DEBRIEF_DATA,label:endingLabel,facts:endingFacts});
})();
