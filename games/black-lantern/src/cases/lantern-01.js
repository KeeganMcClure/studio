// Black Lantern · cases/lantern-01.js
// CASE: LANTERN 01, the first agency case (spec 014). SPOILERS for the case live in story/cases/lantern-01.md only.
// Part A (Nov 23, 2026): the black folder card, every map by day and night, the townsfolk on the map and in the dialog
// box, Big Hat's own briefing place, and walkable maps with every door going where it should.
// Part B (Nov 23, 2026): the story and play, written from the secret case file: the text block, the briefing's four
// topics and their edges, skill-driven clues, a deduction on the loft's phone, the day's turn, overstepping (a quiet
// case), two story fights, the night's roamers, a Lantern Box, the boss and its tuning, the debrief's facts and cover
// stories, and the endings. The unlock scene's lines live in seasons/season-1.js (spec 009).
// Art is cases/lantern-01-art.js (window.L01A, the maps and people) and cases/lantern-01-battle-art.js (window.L01B,
// the enemies, the boss's face and the battle backdrops), loaded right after this file. Needs engine.js, field.js and
// battle.js first. The whole file sits in one function so its names never meet another case's.
(function(){

// ================= TEXT =================
// Every line of the case (Voice). A list plays box by box: a plain string is narration, ['WHO', 'line'] is someone
// talking. {code} and {first} are the lead's, with pronoun tokens like {first.they} (Agent creator, Pronouns and body);
// {n}, {t} and the other one-letter keys are filled by the script.
const TEXT={
 next:{day:'Day. Ask around Marine Drive: {n}/3 clues. Then go up to his loft.',phone:'Go up to the loft. The phone\'s going to ring.',
  dusk:'Wait for dark at the loft\'s window.',night:'Night. The cannery\'s side door is open. Whatever\'s in there is waiting.',home:'Get home.'},
 phase:['TUESDAY · DAY · RAIN','TUESDAY · NIGHT · RAIN'],
 // ---- the briefing, in the lightship's wheelhouse ----
 open1:'TUESDAY · 9:40 PM · 41°F · RAIN',
 open2:'A text from an unlisted number: "MARINE DRIVE. THE OLD LIGHTSHIP. GANGWAY\'S UNLOCKED."',
 brief:['The wheelhouse of a lightship tied up for good as a museum. After hours. Rain on every window.',['BIG HAT','Agent {code}. Wipe your feet. It\'s a museum.'],
  'He\'s standing at the ship\'s wheel like he\'s steering it somewhere. A sign on the wheel says PLEASE DO NOT TOUCH. He\'s touching it.',
  ['BIG HAT','Abel Teague. Code name SEXTON. One of ours.'],['BIG HAT','Three weeks ago he quit answerin\' the call. No check-in. No body. No note.'],
  ['BIG HAT','Nineteen years in the field. Average agent gets four.'],['BIG HAT','I want you to think about that while you\'re out there gettin\' rained on.']],
 briefShout:'NINETEEN YEARS AND HE NEVER MISSED A CALL.',
 brief1b:['He takes the toothpick out. Looks at it. Puts it back the other side.'],
 // Big Hat's two questions (spec 013): the four topics, his two-box answer, the Case file's INTEL line. The edges are in
 // the scripts: 'sexton' +10 Empathy with Mrs. Halvorsen, 'mail' +10 Bureaucracy with Ray at box 418, 'town' Mo hands
 // over the napkins with no roll, 'rain' the lantern's light reaches farther on the night.
 intel:[
  {id:'sexton',label:'Sexton',answer:['Abel Teague. Nineteen years. Longest I ever had.','Landlady\'s a Mrs. Halvorsen. She\'s fond of him. Be kind to her, she\'s scared.'],
   note:'Teague\'s landlady, Mrs. Halvorsen, is fond of him and scared. Be kind.'},
  {id:'mail',label:'His mail',answer:['His reports went up. Nothin\' came back down.','He kept a box at the post office on Commercial. Four eighteen. Postmaster goes by the book, so bring him a book.'],
   note:'Teague kept PO box 418. The postmaster wants paper.'},
  {id:'town',label:'The town',answer:['Cannery town. Every bar on Marine Drive knows his stool.','The Snag. Bartender\'s ex-Coast Guard. Tell her Hat sent you and she\'ll know.'],
   note:'Teague drank at the Snag. The bartender knows the name Hat.'},
  {id:'rain',label:'The rain',answer:['February. It don\'t stop.','Keep your powder dry. I put a better wick in your lantern. You\'ll see farther in the dark.'],
   note:'It rains all February. Your lantern reaches farther tonight.'}],
 brief2:[['BIG HAT','You go in quiet. No badges. You\'re his family, come to check on him, and you\'re worried. Which you are.'],
  ['BIG HAT','He rents the loft over the old cannery. Landlady across the street owns both.']],
 brief3:[['BIG HAT','This one didn\'t come down the usual way. I\'m handin\' it to you myself.'],['BIG HAT','He\'s one of ours. Bring him home, or bring me why not.']],
 arrive:'LANTERN 01. Talk to people with A. Press START for your notebook and party.',
 role:{Investigator:'Nineteen years and nobody filed a missing person? Somebody\'s not doing paperwork.',Healer:'Three weeks without checking in. I want to know if he\'s eating.',
  Analyst:'For the record, most missing adults turn up within thirty days. Most.',Vanguard:'Nobody leaves one of ours out in the rain.',Lorekeeper:'River towns always have something come in on the tide. Always.',
  Tech:'His phone\'s been off three weeks. Not dead. Off. Somebody switched it off.',Bruiser:'Smells like fish. Everything smells like fish.',Support:'Everybody put a hat on. I\'m not asking.',
  Tracker:'Rain\'s washed out everything older than an hour. Great.',Confessor:'A man alone that long starts talking to the walls. Let\'s hope the walls talk back.',
  Courier:'I\'ve delivered in rain like this. The rain wins.',Undertaker:'I\'d like to bring him home in better shape than I usually get them.',Scrapper:'Cannery town. My uncle worked a slime line. He never ate tuna again.',Morale:'There\'s a bar. I\'m just saying there\'s a bar.'},
 roleAny:'Let\'s find him.',
 // ---- the street by day ----
 edge:'Marine Drive goes on in the rain. Big Hat said Marine Drive. Not yet.',
 postShut:'POST OFFICE. Closed. HOURS 9–5, and a wet flyer about a lost cat.',postEarly:'POST OFFICE. A sign on the door in fresh marker: CLOSED EARLY. WATER MAIN. It isn\'t raining any harder inside than out.',
 canneryShut:'The cannery\'s side door. Chained. CLOSED FOR SEASON, in paint that\'s older than you.',
 van:'The van. A rental, a little too clean, with a parking ticket already under the wiper.',vanJug:'The van. In the back, under a blanket, a gallon jug of seawater with JETTY written on it in Big Hat\'s hand.',
 shelter:'A bus shelter. The schedule\'s behind plastic, and the plastic\'s fogged on the inside.',
 teague1:[['TEAGUE','Evening.'],'It\'s ten in the morning.',['TEAGUE','Can\'t stop. Got to get the mail. Nine sharp.'],
  'The rain runs off his hat brim into his open eyes. He doesn\'t blink. He doesn\'t wipe it.',['TEAGUE','You\'re family. That\'s nice. I\'m sorry about the smell.']],
 teagueH:'Abel Teague in the rain with his eyes open',
 teagueName:'TEAGUE',teagueLook:[['TEAGUE','Evening.'],'He goes back to watching the post office door. It\'s open. He doesn\'t go in.'],
 teagueRead:'Look at him, really look',teagueAsk:'Ask him where he\'s been',teagueCall:'Say his name',
 teagueReadDo:['For one second the face does something on its own. The mouth pulls down at one corner, like a man trying not to cry in a bank.',['TEAGUE','...four eighteen.'],['TEAGUE','Sorry. Evening.']],
 teagueAskDo:[['TEAGUE','Home. Work. Home.'],['TEAGUE','I keep a very tidy house. You\'d be proud.']],
 teagueCallDo:['"Abel," you say.','He turns. It takes a second too long, like a man in a big coat turning around inside it.',['TEAGUE','He\'s around.']],
 walker:'A woman in a red poncho walks a dog in four little rubber boots. Neither of them looks at the river.',
 dog:'The dog in the boots stops, stares at the cannery, and won\'t move till it\'s pulled along.',
 fisher:['A man in orange rain gear fishes off the end of the pier under the light. He hasn\'t caught anything.','"Sea lions quit coming around three weeks back," he says, without turning. "All but the one."'],
 // ---- the bull on the dock (a story fight, 2 skulls, the pier by day) ----
 bull1:['At the end of the pier a sea lion bull has hauled out on the planks. He\'s the size of a sofa and smells like the bottom of a bait bucket.',
  'He doesn\'t bark. He watches you come with both eyes open in the rain, and he whistles.','Two notes up, one down. Somebody\'s whistle. You\'d know it if you knew him.'],
 bullH:'The bull on the dock, whistling',
 bullName:'THE BULL',bullLook:'He\'s still whistling. He hasn\'t blinked since you walked out here.',
 bullBack:'Back off slow, like the signs say',bullShoo:'Shoo him off the pier',bullLeave:'Leave him be',
 bullBackDo:['You give him the signs\' fifty yards. He watches you the whole way, then slides off the end into the river without a splash.'],
 bullBackFail:'He heaves up onto his flippers and comes for you, faster than anything that shape should.',
 bullIntro:'The bull comes up off the planks!',
 bullDone:['He goes off the end of the pier backward and doesn\'t come up. Where he went in, the water goes still before it should.','Two notes up, one down. Then nothing.'],
 crowd:'That was loud, on Marine Drive in broad daylight. A woman at the bus shelter is filming.',
 rail:'THE LADDER',railLook:'A ladder off the end of the pier, down into the river. The rungs are green.',railTrack:'Read the marks',
 railDo:['Footprints on the wet rungs going down into the river. Big boots, a man\'s weight.','Coming back up, no prints at all. Just the top rung, and on it, a little sand. Dry.'],
 cTideMarks:'Teague went down the pier ladder into the river and came back up without leaving a wet print.',
 // ---- Mrs. Halvorsen (a liar about the rent) ----
 inga1:[['MRS. HALVORSEN','You\'re here about Abel? Come in, come in, you\'re dripping on my rug.'],'The cat on her shoulder is looking at the ceiling. It does not stop looking at the ceiling.',
  ['MRS. HALVORSEN','That\'s Pastor. He doesn\'t like weather. Or company. Or Tuesdays.']],
 ingaLie:[['MRS. HALVORSEN','Abel\'s fine. He\'s paid up through February. He\'s always paid up.'],'She says it to the TV.'],
 ingaTruth:[['MRS. HALVORSEN','...He didn\'t pay February. I\'m covering it. Don\'t tell him.'],['MRS. HALVORSEN','He doesn\'t eat. Three weeks I\'ve been taking up hotdish. It comes back down with the foil still on.'],
  ['MRS. HALVORSEN','And at night there\'s two of them talking up there. Same voice. One of them keeps asking the other one to stop.']],
 cRent:'Teague hasn\'t eaten in three weeks or paid rent. At night his landlady hears two voices up there, both his.',
 ingaRent:'Ask about the rent',ingaAfter:[['MRS. HALVORSEN','Hotdish is tater tot. Take some up if you\'re going. He won\'t eat it.']],
 ingaKey:[['MRS. HALVORSEN','You\'ll want the spare key. It\'s on the nail by the door.'],['MRS. HALVORSEN','He won\'t mind. He doesn\'t mind anything lately.']],
 ingaNoticed:[['MRS. HALVORSEN','I\'m sorry. I don\'t know you people.'],'She turns the TV up. It\'s on mute.'],
 ingaNight:[['MRS. HALVORSEN','It\'s late. Is he...'],'She doesn\'t finish. Pastor is under the sofa.'],
 basket:'CAT BASKET',basketLook:'The cat\'s basket, by the front door, as far from the cannery-side window as the room goes.',
 basketDo:['Scratch marks in the floorboards, a basket\'s width apart, from the window to the door. He dragged it himself, a little each night.','Pastor wants to be as far from that loft as a cat can get without paying rent somewhere else.'],
 cBasket:'Mrs. Halvorsen\'s cat dragged its own bed as far from Teague\'s loft as it could get, a little each night.',
 // ---- Ray at the post office ----
 ray1:[['RAY','Window\'s open till five. Line forms here. There\'s no line. Form it anyway.'],'A stamp album lies open by the scale. Lighthouses.'],
 rayBox:[['RAY','Four eighteen\'s Abel\'s. Has been eighteen months.'],['RAY','His mail\'s been coming back on him. Same envelope, out and back, out and back. Somebody upstairs keeps returning to sender.'],
  ['RAY','I can\'t open a box without paper. Federal law. Also my law.']],
 rayNoticed:[['RAY','Paper or nothing. And I\'ve heard about you.']],
 rayAfter:[['RAY','Four eighteen\'s empty now. I\'ll keep it for him. Box rent\'s paid through June.']],
 box418:'BOX 418',boxLook:'Box 418. A slip stuck in its little window: SEE CLERK.',
 boxPaper:'Show Ray some paper',boxTalk:'Tell him you\'re family',boxSneak:'Wait till he\'s in the back',boxForce:'Pop the little door',
 boxPaperDo:['You fill out a Change of Address, Temporary, Family Emergency. You lie on four lines of it.',['RAY','...That\'s a real form. Nobody fills out a real form.'],'He opens 418 with a key on a curly cord.'],
 boxTalkDo:[['RAY','Family.'],['RAY','He\'s got a sister in Spokane. Calls her on her birthday. Uses my phone, because his is "listened to." His words.'],['RAY','...Fine. I\'m counting.']],
 boxSneakDo:['Ray goes in the back to argue with a cart of priority envelopes. Box 418\'s key hangs on its curly cord, right where he left it.'],
 boxForceDo:['The little brass door bends and gives with a noise like a dropped spoon.',['RAY','HEY.']],
 boxIn:['Box 418. One fat envelope, block capitals, to BLACK LANTERN RECORDS · ATTN: INTAKE. Stamped RETURN TO SENDER.',
  'It\'s been opened and sealed again with tape. On the back, a purple stamp: RECEIVED · RECORDS · CHAIN OF CUSTODY. Nobody signed it.',
  'Inside, his report. Page six of six. The handwriting gets bigger as it goes, like he thought that would help.','"IF ANYONE READS THIS. I AM NOT ALWAYS IN HERE. SEND SOMEBODY. SEND ANYBODY. —SEXTON"'],
 cBox:'Teague\'s last report went up through Records, got stamped received, and came back to his box unlogged. It begs for help.',
 dotIn:['Folded in with the report, a second note, on a Records memo sheet, in a round hand:','"Abel. They read everything you send. Stop sending it. —D.F."','The memo has a coffee ring on it. Somebody was in a hurry and still made coffee.'],
 cDot:'A note from D.F., a clerk at Records, tucked in with the returned report: "They read everything you send. Stop sending it."',
 // ---- the Snag: Mo and Hap ----
 mo1:[['MO','What can I get you.'],'She\'s already pouring something pale from a tap with a hand-lettered sign on it: BEER.'],
 moHat:[['MO','Hat sent you.'],'It isn\'t a question. She puts the glass down and doesn\'t let go of it.'],
 moNap:[['MO','You\'re his people. Figured. You\'ve got his stoop.'],['MO','He wrote on napkins every night for a month. Then he quit writing and just sat. Then he quit coming.'],
  ['MO','I kept the last ones. In the register. In case he came back for them.']],
 napkinsRead:['Bar napkins, THE SNAG in green, every one written to the edges in block capitals.','"PSALTER P.12. NET-BLESSING IS A BINDING. VESSEL MUST CONSENT."',
  '"USE THE FISH. CONSENT LINE: I AM WILLING. SAY IT OVER THE FISH."','The last one says only "WHAT HAVE I DONE." And smaller, in the corner: "salt?"'],
 cNapkins:'Teague\'s bar napkins: he tried a binding out of a book called the Psalter. It needed a vessel that says yes. He wrote "salt?"',
 moName:'MO',moAskNap:'Ask about his napkins',moAskFax:'Ask if he ever sent mail from here',
 moFax:[['MO','He faxed a letter from here once. Our machine keeps a copy. It\'s older than me.'],'She pulls a curl of thermal paper out of a drawer full of corks.',
  'A fax copy, gray and fading: his fifth report. On the cover sheet somebody at the other end wrote RECEIVED and nothing else.','It asks for help in plainer words than a man like that would ever use out loud.'],
 cBoxFax:'A fax copy of Teague\'s fifth report: sent up the line, marked received, and never answered. It begs for help.',
 moNo:[['MO','He was a regular. That\'s all you get for free.']],
 moAfter:[['MO','Stool by the jukebox is his. Nobody sits there. Not a rule. Just don\'t.']],
 registerDo:['Behind the register drawer, rubber-banded, a wad of bar napkins.'],
 hap1:[['HAP','You hear that, Marjorie? Strangers.'],'He\'s talking to the jar of pickled eggs. The jar has a face drawn on it in grease pencil.',
  ['HAP','Marjorie was my wife. The jar\'s not my wife. I know that. But she\'d have liked the jar.']],
 hapName:'HAP',hapEgg:'Buy him a pickled egg',hapNet:'Ask what Abel asked him',
 hapEggDo:['You buy him a pickled egg. Mo fishes it out with tongs. Hap holds it up to the light like a jeweler.',['HAP','Abel used to buy me one of these. Then he quit eating. Then he quit buying.'],
  ['HAP','Last I seen him, tide was out. He walked off the end of the pier, down the ladder, into the river up to his chest.'],
  ['HAP','Walked out again five minutes later dry as a Bible. Not a drop on him. In February.'],['HAP','And the brine barrel on the dock? He went around it. Wide. Like a dog around a vacuum cleaner.']],
 cTide:'Hap saw Teague walk into the river and come out dry. He went wide around the brine barrel on the dock.',
 hapNetDo:[['HAP','He asked me what a net-blessing was. Old Finn thing. You sing over the net so it comes up full.'],
  ['HAP','Then he asks, what if you sing it over something that ain\'t a net. I said what the hell for.'],
  ['HAP','He bought a book off the Rautio estate. Eero Rautio. Drowned off the jetty in \'09. Eero sang over his nets. Eero always come home full.']],
 cWallHap:'Teague asked Hap about net-blessings, old songs that bring the nets up full, and bought a book from a drowned fisherman\'s estate.',
 hapNo:'Hap tells you about a halibut he caught in 1971. It takes a while. The halibut gets bigger.',
 hapAfter:[['HAP','Marjorie says you look tired.'],'Marjorie has said nothing. Marjorie is eggs.'],
 // ---- the loft ----
 loftDoor:'THE LOFT DOOR',loftLocked:'The loft door, at the top of the stairs. Locked. A brass mail slot, taped shut from inside.',
 loftPick:'Pick the lock',loftForce:'Put a shoulder into it',loftSneak:'Go in by the window ledge',
 loftPickDo:'The lock\'s old and so are you. It gives.',loftForceDo:'The door gives with a crack you\'d hear across the street. Across the street, a curtain moves.',
 loftSneakDo:'You go along the wet ledge to the window like a cat burglar in a raincoat. It\'s unlatched. Of course it is.',
 loftKey:'Mrs. Halvorsen\'s key',
 loftIn:['The loft smells like low tide in a closed car.','Everything is very tidy. The cot\'s made. The cans are lined up. The tidiness is the worst part.'],
 wall:'THE STUDY WALL',wallLook:'A wall of string, photos and paper, pinned in rows. Page numbers circled in red.',wallOcc:'Read what he was reading',wallHist:'Follow his paper trail',
 wallRead:['It\'s evidence. Copies of evidence, from his cases and other people\'s, going back years. A farm ledger. A church bulletin. A recipe card.',
  'On each one, in a corner, a scrap of old paper that doesn\'t belong to it, numbered by hand. He\'s circled every number and run red string to the next.',
  'In the middle, in his block capitals: "SOMEBODY IS COLLECTING SIGNATURES. WE ARE THE MAILMAN."','Below that, newer, the ink still shiny: "FIRE WITH FIRE. PSALTER P.12."'],
 wallH:'The study wall, read whole',
 wallFail:'String and paper. You lose the thread somewhere around 1998.',
 cWall:'Teague\'s study wall: numbered scraps of old paper hidden in filed evidence, going back years. He meant to fight it with something of his own.',
 floor:'THE FLOORBOARD',floorLook:'One floorboard sits a hair higher than the others.',floorSweep:'Pry it up',
 floorDo:'Under it, in a bread bag, a steel lockbox with a four-number dial.',floorFail:'It\'s a floorboard. It\'s higher than the others. That\'s all it\'s telling you.',
 lockLook:'A steel lockbox with a four-number dial, in a bread bag.',lockFix:'Work the lock',lockPaper:'Try his badge number',lockForce:'Bust it open',
 lockPaperDo:'A Records form pinned to the study wall has his badge number on it. 4471. The dial turns like it was waiting.',
 lockFixDo:'You lean an ear on it and turn. Click. Click. It\'s a cheap box. He knew it was a cheap box.',lockForceDo:'You put a heel into it until it gives up. So does the floorboard next to it.',
 lockFail:'The dial won\'t give.',
 lockIn:['Inside, wrapped in a bread bag: his service record. ABEL JOHN TEAGUE. FIELD NAME SEXTON.','His oath is typed at the bottom and signed, in a younger hand than the napkins\'. His badge is clipped to it.'],
 cRecord:'Teague\'s service record: his full name and his oath, in his own hand, with his badge.',
 carbons:'CARBONS',carbonsLook:'Carbon copies, tied with string. Six reports to the same address. He kept a copy of every one.',
 carbonsRead:'Read all six, in order',carbonsSkim:'Skim them',
 lettersRead:['One: "Routine. Noting numbered fragments in re-filed evidence. Requesting guidance."','Two: "Fragments confirmed in three closed cases. Requesting a second agent." Three: "Requesting a second agent." Four: "Please."',
  'Five is one page. "I tried something. It went wrong. I am not always in here. Help."','Six you already know the end of. You read it anyway, all of it, because somebody should have.'],
 lettersH:'His six reports, read in order',
 carbonsSkimDo:'Six reports, each shorter than the last. The last one\'s copy is just the word HELP, pressed so hard it went through.',
 trash:'THE TRASH',trashLook:'Under the hot plate, the trash: chili cans, a lot of them still full.',trashDo:['At the bottom, a torn envelope from Records with its note still in it.','"Abel. They read everything you send. Stop sending it. —D.F."'],
 trashNone:'Chili cans. A lot of chili cans.',
 phone:'THE PHONE',phoneLook:'An old landline on a crate. The cord\'s been taped where it frayed.',phonePick:'Pick it up',
 ring:'The landline on the crate is ringing. It keeps ringing. Only one person alive has this number, and he\'ll wait.',
 hatCall:[['BIG HAT','It\'s me. Don\'t say your names on this line.']],
 hatAsk:'Where\'s my agent?',
 hatOpts:['He ran. He\'s drunk somewhere up the coast.','Something\'s living in him. It came in through his own work.','Records got to him.'],
 hatRight:[['BIG HAT','...'],['BIG HAT','Then you get it out of him.'],['BIG HAT','There\'s a jug of seawater in the back of the van. Off the jetty. I had a feelin\'. Don\'t ask me what kind.']],
 hatNoProof:[['BIG HAT','Livin\' in him.'],['BIG HAT','You show me how and I\'ll believe you. Till then you\'re guessin\' on my dime.']],
 hatRecords:[['BIG HAT','...'],['BIG HAT','Not on this line.'],'He hangs up. The dial tone sounds exactly like a dial tone.'],
 hatNoRecords:[['BIG HAT','Records is a room full of filin\' cabinets and a coffee maker, {first}.'],['BIG HAT','Bring me paper or don\'t bring it up.']],
 hatWrong:[['BIG HAT','Abel Teague never ran from a thing in his life. Walked away from a few. Never ran.'],['BIG HAT','Look harder.'],'Click.'],
 hatAfter:'The phone sits on the crate. It doesn\'t ring again. You keep looking at it anyway.',
 hunch:'Three weeks without eating. A voice that isn\'t quite his. What kind of thing needs a man to say yes?',
 wrongCost:'You thought he\'d run. Looking at that coat, you know better, and knowing it costs you.',
 windowName:'THE WINDOW',windowLook:'The window over the river. Rain on the glass, the bridge lights out past it.',windowOpt:'Wait for dark',
 windowClues:'Not yet. You don\'t know enough to sit in the dark up here ({n}/3 clues).',windowPhone:'The phone\'s going to ring. You can feel it. Wait for it.',
 duskQ:'Wait here till dark?',duskClose:'The post office closes for the night.',turnOpts:['Go on','Not yet'],
 dusk:['The light goes gray, then grayer, then it\'s just the bridge\'s lights and the rain.','Down on Marine Drive the post office\'s sign clicks off.'],
 // ---- the empty coat (a story fight at dusk, 2 skulls) ----
 coat1:['The bulb over the cot clicks off by itself.','On the hook by the door, his spare oilskin lifts its shoulders. The boots under it come up off the floor an inch, like somebody stepped into them.','The collar turns toward you. There\'s nobody in it.'],
 coatIntro:'The empty coat comes off the hook!',
 coatDone:['The coat drops in a heap. A cup of river water runs out of each sleeve and across the floor to the door, downhill, toward the cannery.','Under the loft, under the cannery floor, something big shifts in the water.'],
 // ---- the hidden hotspot: only there while the lead is High on Mushrooms ----
 mirrorName:'THE MIRROR',
 mirrorLook:['The mirror runs a few seconds behind the room. You watch yourself come in, late.','In it, Teague sits in the chair by the window. Something sits in him, like a man in a coat too big for him. Its hands are an inch inside his hands.',
  'On the fog, written backward from the other side of the glass, in block capitals: "NOT ME. STILL HERE. —A.T."'],
 mirrorH:'Something sitting in him, in the mirror',
 cMirror:'In the mirror, Teague is still in there under what\'s wearing him: "NOT ME. STILL HERE."',
 rack:'COAT RACK',rackLook:'A coat rack by the door, three wet coats deep. A yellow oilskin on top.',rackOpt:'Check the pockets',
 rackFind:'In the yellow oilskin, a paper bag of dried little mushrooms. FOR MY KNEES, in pencil.',
 // ---- the night street (a danger zone) ----
 night1:['Marine Drive at night. The rain\'s gotten serious about it.','Out on the pier, things move that shouldn\'t: gulls that don\'t sleep, and something tall by the brine barrel that came up the ladder.'],
 nightOk:'You stand under the bus shelter and watch them a while. You learn their beats before they learn you.',nightFail:'Something on the pier turns your way. You can\'t tell which thing.',
 steps:'PIER STEPS',stepsLook:'Under the pier steps, out of the rain.',stepsNight:'Under the pier steps, wedged behind a crab pot: something in a garbage bag with a gas-station bow on it.',stepsOpen:'Open it',
 stepsBox:'In the bag, under a souvenir rain hat that says I SURVIVED ASTORIA in Big Hat\'s handwriting:',
 barrel:'BRINE BARREL',barrelDay:'A blue barrel by the pier steps. BRINE, in marker. The lid\'s padlocked. It smells like the ocean got stored.',
 barrelNight:'The brine barrel. The padlock\'s been torn off and dropped in a puddle. Wet prints all around it, none of them going in.',
 barrelFix:'Work the padlock',barrelFill:'Fill a can with brine',
 barrelDo:'You fill a coffee can with brine and jam a lid on it. Your hands sting where they\'re chapped. Good.',barrelHave:'You\'ve got all the brine you can carry.',
 barrelFail:'The padlock\'s rusted into one solid opinion.',
 // ---- the cannery floor (night only, the finale area) ----
 canneryQ:'The chain on the cannery\'s side door hangs loose. Inside, water is running somewhere.',gateIn:['Go in','Not yet'],
 canneryIn:['The packing floor is as big as a church and darker. Water runs somewhere in the walls.','At the far end, the big steel doors of the retort room. Somebody behind them is humming.'],
 canneryOut:'The side door, back out to Marine Drive.',
 tanks:'BRINE TANKS',tanksLook:'Brine tanks, waist high. The water in them is very still and very salty.',tanksFix:'Seal some in a can',tanksSample:'Draw off a jarful',
 tanksDo:'You fill an empty can from the tank and crimp a lid on it the way the cannery used to. Somewhere behind the retort doors, the humming stops for a second.',
 tanksFail:'The can slips and goes into the tank. You watch it sink a long time.',
 office:'THE OFFICE',officeLook:'The cannery office, a glass box up on stilts. A book lies open on the desk, weighed down with a can of salmon.',
 officeOcc:'Find the binding page',officeSweep:'Go through the desk',
 psalterRead:['THE TIDEWATER PSALTER, copied out by hand, 1880-something. Net-blessings, it says. They aren\'t.','Page 12 has a fish drawn on it, gutted, and a line under it in his pencil: I AM WILLING.',
  'The flyleaf is different paper, older, bound in later by somebody else. A number in the corner, in faded ink: 4.'],
 psalterFail:'Old paper and older handwriting. It slides off your eyes like rain off a window.',
 cPsalter:'The Tidewater Psalter: the book of "net-blessings" Teague worked his binding from. Its binding page is still in it.',
 burnSafe:'Burn the binding page, carefully',burnBook:'Burn it by the book',burnNow:'Burn it, now',
 burnDo:['The binding page goes up blue, then green, like a chemistry set. It smells like low tide.','Down the floor, behind the retort doors, something says "oh" in a polite voice, like a man who\'s just missed his bus.',
  'The flyleaf doesn\'t catch. It\'s different paper. You put it in your pocket.'],
 burnWild:'The page catches. So does the desk blotter. So does a curtain that\'s been waiting since 1974 to catch. You stamp it out, eventually. Out on Marine Drive somebody shouts.',
 burnFail:'Your lighter won\'t catch in the damp. You try again. It\'s still February.',
 tables:'Steel slime tables, long as boats, scrubbed and rusting.',belt:'The conveyor, stopped mid-run. A rubber glove still on it, waving.',cans:'Stacks of empty cans, labels never put on.',
 drain:'A floor drain. Water running in, not out.',
 // ---- the retort room: the boss waits for you (Go in / Not yet) ----
 retortQ:'Big steel doors: RETORT ROOM. Warm water seeps out under them. Inside, somebody\'s humming two notes up, one down.',
 retortClose:'Once you\'re in, it ends one way or another.',
 retort1:['The retort room is flooded to the shins. The water\'s warm, and it moves, slow, in and out, like a chest.',
  'Abel Teague stands in the middle of it in his oilskin, hands at his sides, hat dripping. His eyes are open. The water runs into them.','He looks at you like you\'re guests who came early.'],
 retortH:'Teague in the water, the water breathing',
 bossSay:['THE TENANT','Agent {code}. Come in, come in. Mind the step. I\'m sorry about the smell.'],
 bossSay2:['THE TENANT','He\'s very comfortable. I keep him tidy. I\'d let him go, you know. If one of you said yes.'],
 bossBurned:['THE TENANT','Somebody was in the office. That was rude. That was a library book.'],
 bossIntro:'The Tenant stands up in the water!',
 bossThin:'It sits looser in him than it should. What you did today has loosened its grip.',
 bossIdent:'You already know what it can\'t stand. Big Hat had a feelin\'. Salt.',
 bossRecord:'His service record\'s in your coat. His name\'s on it. Read it to him.',
 bossOffer:'The Tenant says, very kindly, that it would let him go. All it needs is one of you to say "I am willing." Nobody says it. Everybody thinks about it.',
 bossTide:'The Tenant breathes out. The tide comes in, up to your knees, cold as a bad phone call!',
 bossPhase:'Teague\'s head goes over on its side like a dropped phone. Something comes up behind his face, a shade darker, and the water starts to climb.',
 bossShield:'The water closes over it like a coat buttoned to the throat. Everything you hit it with lands soft.',
 bossNamed:'Under the water\'s noise, in his own voice, tired: "...Abel. That\'s right. That\'s me." Nothing\'s buttoned over him now.',
 bossHeal:'The tide comes back in through it. It heals {n}.',
 bossNoHeal:'It reaches back for its book. There\'s no book. It can\'t hold on.',
 talkQ:'For a second Teague\'s own eyes look out of his face. You could talk to him. It would cost you the round.',
 talkOpts:['Talk to Abel, not it','Keep fighting'],
 talkOk:['"Abel," you say. "Hat sent us."','His mouth works. "Hat," it says, in his voice, not its. "Tell Hat. It\'s cold in here. It\'s polite, and it\'s cold."','For a whole round the thing in him has to hold him down. It can\'t do anything else.'],
 talkFail:'You say his name into the water. It closes over him again, politely.',
 nameRead:'{n} reads it off the record, out loud, like a roll call: "ABEL JOHN TEAGUE. FIELD NAME SEXTON."',
 nameHit:'Teague\'s hand closes on its own. The thing in him flinches like it touched a stove.',
 nameFail:'The words come out. The water eats them.',nameDone:'You\'ve read his name. He heard it.',
 brineThrow:'{n} throws a can of brine.',brineHit:'Salt water hits {e}. It screams in a voice too polite for screaming. {h} damage.',
 brineNo:'Salt water. {e} doesn\'t care.',
 // ---- overstepping (a quiet case): Noticed, the Astoria PD sergeant, Big Hat's call, the clean-up crew ----
 noticed:['Marine Drive\'s a small street. Word gets around: somebody\'s family is asking a lot of questions for somebody\'s family.','Ray and Mrs. Halvorsen won\'t be as friendly now.'],
 chief:['A patrol car crawls down Marine Drive with its wipers on high. The sergeant leans out.',['SERGEANT','Folks say you\'re Abel\'s people. Folks also say you\'re a pain in the ass.'],['SERGEANT','Post office is closing early today. Water main. Go home.']],
 call:['Your phone buzzes. You know who.',['BIG HAT','I said quiet, {first}. Astoria PD has a description of you now, and I don\'t have a description of me.'],['BIG HAT','Don\'t ask for nothin\' next time.']],
 feds:['Three black cars come up Marine Drive with their lights off and stop in the rain.',['CLEAN-UP','Black Lantern. Internal. You\'re done here.'],['CLEAN-UP','Agent Teague is a personnel matter. Step away from the personnel.']],
 fedsIntro:'The clean-up crew draws down!',
 fedsWin:['The black cars go back up Marine Drive, one short.'],
 // ---- the ending ----
 end1:['The Tenant stops in the middle of a sentence. It tries the sentence again, politely, and it doesn\'t fit.','The water goes out of the room all at once, down the drain, out under the doors, back to the river, like a tide going out a year at a time.'],
 endClean:['Abel Teague is sitting in the wet, holding his own hands like they\'re new.',['TEAGUE','You\'re Hat\'s.'],['TEAGUE','Nineteen years. You know the average is four?'],['TEAGUE','Tell Hat I wrote.'],
  'He dies sitting up, as himself, a little before the sun comes up. Nobody on Marine Drive hears a thing.'],
 endCostly:['Abel Teague lies face down in an inch of water that\'s only water now.','He doesn\'t wake up. Whatever was in him took the last of him on its way out the door.','You turn him over. He looks like a man who was very tired for a very long time.'],
 bookDrop:'On the retort room\'s floor, open and bone dry, the book he worked from. THE TIDEWATER PSALTER. You take it.',
 dawn:'Morning. Still raining. Ray raises the flag at nine sharp, and nobody comes for the mail.',
 // ---- the debrief (spec 007), in the wheelhouse: Big Hat's lines by ending ({x}/{t} clues), what he says about the
 // choices, the memo (every ending), and the cover stories ----
 db:{
  clean:[['BIG HAT','Sit.'],'He doesn\'t say anything for a while. Rain on the windows.',['BIG HAT','He said that? "Tell Hat I wrote."'],['BIG HAT','...He did. Six times. {x} clues outta {t}.']],
  costly:[['BIG HAT','Sit.'],['BIG HAT','You brought him home. That\'s more than he got from anybody else.'],['BIG HAT','{x} clues outta {t}. I\'ll call his sister. I\'ll make that one myself.']],
  worst:[['BIG HAT','Internal took it. Personnel matter.'],['SHOUT','HE WAS NOT A PERSONNEL MATTER.'],['BIG HAT','Case is closed. Not by us. And he\'s still out there in the rain somewhere, bein\' polite.']],
  letters:['BIG HAT','You read all six. Good. Somebody should\'ve, the first time.'],
  wrong:['BIG HAT','"Drunk up the coast." I\'m gonna think about that one a while, {first}.'],
  forced:['BIG HAT','Postmaster filed a complaint on you. On a real form. I never saw a man so happy.'],
  fire:['BIG HAT','Astoria Fire says a squatter in the cannery had a hot plate. Fire marshal\'s right.'],
  bull:['BIG HAT','Fish and Wildlife wants to know why a sea lion washed up full of brass. I told \'em I don\'t know any sea lions.'],
  badge:['BIG HAT','That his badge? ...Keep it. He\'d want somebody to.'],
  memo:['Big Hat takes a sheet of paper out of his vest and flattens it on the chart table.',['BIG HAT','Memo come down this mornin\'. Records clerk named Dot Ferrell. Desk cleared Friday. No forwardin\'.'],
   ['BIG HAT','And this. Records wants Abel\'s file. The whole thing. Requisition\'s signed.'],'He turns it so you can see. One letter at the bottom, in good blue ink: W.',
   'He looks at it a long time. The lamp over him buzzes.',['BIG HAT','Not in my jurisdiction.'],'He folds it up very small and puts it back in his vest.'],
  retire:'He retired. Moved to his sister\'s in Spokane.',retirePass:[['BIG HAT','Retired. Spokane. Sister. Nobody on Marine Drive checks Spokane.']],
  squat:'A squatter in the cannery. Carbon monoxide.',squatPass:[['BIG HAT','Squatter, space heater, carbon monoxide. County signs it Monday. They always sign it Monday.']],
  weak:'Went fishing. Didn\'t come back.',weakPass:[['BIG HAT','Went fishin\'. In Astoria that\'s half the obituaries. You got lucky.']],
  easy:'Nobody asked',easyPass:[['BIG HAT','Family came, family left. Small town minds its own business when it\'s rainin\'.']],
  safe:'Already filed: retired, effective last month',safePass:[['BIG HAT','Paper says he retired last month. Paper\'s never wrong.']],
  filed:[['BIG HAT','The book. I\'ll file it. Records wants it by Monday.'],'He says Records like it\'s a word in another language.']
 }
};
const fill=(t,o)=>String(t).replace(/\{(n|m|v|t|e|h)\}/g,(x,k)=>o[k]??x);
async function play(seq,o={}){for(const l of [].concat(seq)){if(Array.isArray(l))await say(l[0],fill(l[1],o));else await say('',fill(l,o))}}
const said=(l,o)=>play([l],o);
// A point of no return (studio-bible/play.md): the cursor starts on Not yet, so mashing A can't take it.
async function askNotYet(text,opts){await say('',text,{keep:true,instant:false});const r=await choose(opts,{cancel:true,inBox:true,sel:opts.length-1});hideTB();return r<0?opts.length-1:r}

// The case board card (spec 014, Card; spec 009, step 3): LANTERN 01, the black folder. The board adds AGENCY CASE ·.
const caseCard={file:1,title:'DEAD LETTER',town:'ASTORIA',place:'ASTORIA, OR',
 hook:['One of ours stopped answering the call.','His last letters never got logged.'],pin:'#7a1a18'};

// ================= CASE DATA =================
// Enemy cards (Combat: Enemies and difficulty, Combat numbers). Fight sizes: roamers 10–18 enemy HP, story fights 20–35.
// 'brackish': the river sent it, so salt water (the brine) burns it.
const EN={
 // the bull on the dock (an unnatural story fight, 2 skulls): Survival's Back off slow avoids it
 bull:{name:'The bull',tier:'tough',hp:24,dex:9,hit:50,dmg:'1d4+1',skulls:2,tags:['unnatural','living','beast','brackish'],resist:[],weak:'salt',
  weakLine:'A sea lion with something sublet in it. Salt water burns what\'s inside: brine does double and stuns it.',
  moves:[['hit',3],['san',1]],verb:'lunges at',sanText:'The bull whistles two notes up, one down, a man\'s whistle out of a sea lion\'s mouth.',sanHit:['0','1'],die:'goes off the end of the pier backward',face:[30,4,26],
  horror:{tier:'disturbing',kind:'unnatural'}},
 // the empty coat (an unnatural story fight, 2 skulls, at dusk): it strangles, and a strangled agent loses their next turn
 coat:{name:'Empty coat',tier:'tough',hp:24,dex:12,hit:55,dmg:'1d4+1',skulls:2,tags:['unnatural','burns','brackish'],resist:['shaken'],weak:'salt',
  weakLine:'Nothing in it but the river. Salt water or fire takes it fast. Nothing in there to scare.',
  moves:[['hit',3],['strangle',2]],verb:'swings a sleeve at',die:'drops in a wet heap',face:[14,4,24],horror:{tier:'disturbing',kind:'unnatural'}},
 // the night's roamers on the pier: a flock of gulls with his eyes, and the drowned thing in the net
 gull:{name:'Gulls',tier:'weak',hp:12,dex:13,hit:40,dmg:'1d3',skulls:1,tags:['unnatural','living','beast','brackish'],resist:[],weak:'salt',
  weakLine:'Gulls, mostly. Salt water sends what\'s looking out of them back into the river.',moves:[['hit',1]],verb:'mobs',die:'scatter into the rain',face:[16,2,22]},
 piling:{name:'The piling',tier:'ordinary',hp:15,dex:8,hit:50,dmg:'1d3+1',skulls:2,tags:['unnatural','brackish'],resist:['shaken'],weak:'salt',
  weakLine:'Drowned and walking. Salt water does double and stops it a turn.',moves:[['hit',1]],verb:'reaches for',die:'folds back over the rail into the river',face:[16,2,22],
  horror:{tier:'unsettling',kind:'unnatural',subj:'deep water'}},
 // only if overstepping reaches Federal agents (the same clean-up crew as every case; its sprite is Still Harvest's SHB)
 fed:{name:'Clean-up agent',tier:'ordinary',hp:11,dex:12,hit:55,dmg:'1d4+1',skulls:3,tags:['human','living'],resist:[],weak:'human',weakLine:'Human. A flashbang or a badge will stop him for a second.',
  moves:[['hit',1]],verb:'fires at',die:'goes down and stays down',face:[10,2,20]},
 // the boss (tuned Nov 23, 2026 with tools/boss-sim.js against the Gleaner's bar). Its HP, phase 2, shield and heal are
 // set per run in bossFight() from the case's choices. Weakness: salt water (the brine).
 tenant:{name:'The Tenant',tier:'boss',boss:true,hp:62,dex:11,hit:58,dmg:'1d4+2',allDmg:'1d3',skulls:3,tags:['unnatural','brackish','host'],resist:['stun2','poison'],weak:'salt',shield:1,heal:1,
  weakLine:'Brackish: it lives where the river meets the sea. Salt water burns it, double, and stuns it. It can\'t be stunned two turns running.',glow:true,face:[30,4,26],
  moves:[['hit',5],['all',2],['san',1]],verb:'reaches for',allText:TEXT.bossTide,sanText:TEXT.bossOffer,sanHit:['0','1'],sanLabel:'Nobody says yes',die:'goes still in the water',
  horror:{tier:'boss',kind:'unnatural',subj:'deep water',known:true}}
};
// the case's horrors: tier, kind, phobia subject; once per case each (SAN loss table). The retort room is for all three;
// the rest are the lead's on the map.
const HORRORS={
 teague:{id:'teague',tier:'disturbing',kind:'unnatural',subj:'people wearing people',label:TEXT.teagueH},
 wall:{id:'wall',tier:'unsettling',kind:'unnatural',label:TEXT.wallH},
 bull:{id:'bull',tier:'disturbing',kind:'unnatural',label:TEXT.bullH},
 mirror:{id:'mirror',tier:'unsettling',kind:'unnatural',label:TEXT.mirrorH},
 letters:{id:'letters',tier:'unsettling',kind:'helplessness',label:TEXT.lettersH},
 retort:{id:'retort',tier:'shattering',kind:'unnatural',all:true,subj:'deep water',label:TEXT.retortH}
};
// this case's own items (case-only: the pin icon; Big Hat sorts them at the debrief). The Psalter, or its flyleaf if
// the book was burned, is the key evidence.
const holdItem=k=>holderOf(k)||(G.fs.pack||[]).some(it=>it.k===k);
const CASE_ITEMS={
 record:{name:'Teague\'s record',type:'Evidence',kind:'ordinary',pin:1,desc:'His service record, his oath and his badge. Battle: read his name aloud to him (History or Bureaucracy).',
  battleUse:async m=>{const F=G.flags;if(F.named){await bsay(TEXT.nameDone,900);return false}
   const t=aliveFoes().find(e=>e.t==='tenant');if(!t){await bsay('There\'s nobody here to read it to.',900);return false}
   const sk=chanceOf(m,'History')>=chanceOf(m,'Bureaucracy')?'History':'Bureaucracy',o=SR.pct(chanceOf(m,sk));bres(sk.toUpperCase(),o);
   await bsay(fillT(TEXT.nameRead,{n:m.name}),1500);
   if(!o.ok){tried(m,sk);await bsay(TEXT.nameFail,1000);return true}
   F.named=1;await bsay(TEXT.nameHit,1200);if(t.ph2)await bsay(TEXT.bossNamed,1600);return true}},
 brine:{name:'Can of brine',type:'Tool',kind:'ordinary',pin:1,uses:3,desc:'Salt water in a can with a lid. Battle: splash one enemy, no roll. Things the river sent take double damage and are Stunned.',
  battleUse:async m=>{const t=await uiTarget(m,{foes:true,info:e=>e.name});if(!t)return false;
   await bsay(fillT(TEXT.brineThrow,{n:m.name}),800);
   if(t.weak!=='salt'){await bsay(fill(TEXT.brineNo,{e:t.name}),900);return true}
   const h=roll(1,6)*2;await bsay(fill(TEXT.brineHit,{e:t.name,h}),1100);await hurtFoe(t,h,m);if(!t.dead)await foeStatus(t,'stun');return true}},
 psalter:{name:'The Tidewater Psalter',type:'Evidence',kind:'unnatural',pin:1,passive:1,
  desc:'A hand-copied book of "net-blessings" from the 1880s. The flyleaf is older paper, bound in later, numbered in the corner: 4.'},
 flyleaf:{name:'The flyleaf',type:'Evidence',kind:'unnatural',pin:1,passive:1,desc:'All that didn\'t burn of the Psalter: one old page, bound in later by somebody else, numbered in the corner: 4.'}
};
// a roamer's drop: 20% from this loot table (Where items come from, Loot): a waterfront in February
const LOOT=['energy','painkillers','roadflare','cigs','booze'];
const has=id=>G.clues.some(c=>c.id===id);
const TOWN=['wall','box','rent','napkins','tide'];
const townClues=()=>G.clues.filter(c=>TOWN.includes(c.id)).length;

// ================= THE DAY =================
// G.flags.ph: 0 day, 1 night. The day turns at the loft's window once the phone has rung, with Go on / Not yet naming
// what closes (Turning the day; play.md).
const ph=()=>G.flags.ph|0;
const isNight=()=>ph()===1;
// overstepping: a quiet case (Noticed, then Local chief, Agency call, Federal agents)
const stepName=()=>stepsOf()[loadSeason().overstep|0]||'Clean';
const stepAt=n=>stepsOf().indexOf(n)>=0&&stepsOf().indexOf(n)<=(loadSeason().overstep|0);
// Noticed and later: Ray and Mrs. Halvorsen clam up (−20 to talk to them); the chief's day the post office locks early
const clam=()=>stepAt('Noticed')?-20:0;
const postEarly=()=>G.flags.chiefPh===0&&!isNight();

// ================= MAPS =================
// Every map is drawn by cases/lantern-01-art.js from M.ground, M.pieces and M.light. M.g is what blocks.
// Ground letters (none walkable ones in engine.js's BLOCK set): ',' sidewalk, '=' street, 'b' boardwalk and pier,
// 'r' the rail line, '.' wet grass, 'W' river (blocks), 'w' wood floor, 'n' linoleum, 'c' carpet, 'o' wet concrete.
function blank(id,name,W,H,fillCh,light){const ground=mk(W,H,fillCh),g=mk(W,H,fillCh);
 return{id,name,w:W,h:H,ground,g,pieces:[],O:{},npcs:[],warps:{},light,art:window.L01A,bg:id,lines:[]}}
const lay=(M,x,y,w,h,c)=>{rect(M.ground,x,y,w,h,c);rect(M.g,x,y,w,h,c)};
const block=(M,x,y,w=1,h=1)=>rect(M.g,x,y,w,h,'#');
const open=(M,x,y)=>{M.g[y][x]=M.ground[y][x]};
function put(M,k,x,y,w=1,h=1,o={}){const p=Object.assign({k,x,y,w,h},o);M.pieces.push(p);if(!o.walk)block(M,x,y,w,h);return p}
const look=t=>({look:t});
const folkOf=list=>list.map(n=>Object.assign(n,{talk:n.talk||(()=>play(TEXT[n.say||n.id]))}));
const door=(M,x,y,to,tx,ty,dir='down')=>{open(M,x,y);M.warps[x+','+y]=()=>goTo(to,tx,ty,dir)};
async function goTo(to,x,y,dir){await fade(1);goMap(to,x,y,dir);checkpoint();await fade(0);if(G.M.arrive)await G.M.arrive()}
const bounceDir=(M,keys,text,dir)=>keys.forEach(k=>M.warps[k]=async()=>{await said(text);G.dir=dir;await stepBack()});
const rebuild=()=>{const x=G.x,y=G.y,d=G.dir;G.M=MAPS[G.map]();StudioMove.place(G,x,y,d)};

// ---- MARINE DRIVE: day, and night (40 x 24); at night the pier end is a danger zone ----
// The north side, left to right: the Halvorsen house, the post office, the Snag Tavern, the cannery with its outside
// stairs to the loft. Then the sidewalk, the street, the river-side sidewalk, the rail line, the riverwalk and the river,
// with the pier going out into it.
const DOORS={halvorsen:4,post:12,snag:20,cannery:29,loft:37};
// the beats the night's two roamers walk, in front of what each guards (Gameplay loop, Roamers)
const BEAT={steps:[[22,14],[23,14],[24,14],[25,14],[25,15],[24,15]],barrel:[[33,14],[34,14],[35,14],[35,15],[34,15],[33,15]]};
function buildTown(){
 const N=isNight(),F=G.flags,M=blank('town','MARINE DRIVE',40,24,',',N?'night':'day');M.alpha=N?.88:.86;M.warm='#ffcf80';
 block(M,0,0,40,7);
 put(M,'house',1,0,7,7,{walk:1});put(M,'postoffice',9,0,7,7,{walk:1});put(M,'tavern',17,0,8,7,{walk:1});put(M,'cannery',26,0,14,7,{walk:1});
 lay(M,0,9,40,3,'=');M.lines.push({x:0,y:10*16+7,w:40*16,h:2,dashed:true,col:'#e8c84a'});
 lay(M,0,13,40,1,'r');lay(M,0,14,40,2,'b');lay(M,0,16,40,8,'W');lay(M,27,16,5,7,'b');
 put(M,'pier',27,16,5,7,{walk:1});
 // doors along the north side
 door(M,DOORS.halvorsen,6,'halvorsen',6,6,'up');
 open(M,DOORS.post,6);if(N)M.O[DOORS.post+',6']=look(TEXT.postShut);else if(postEarly())M.O[DOORS.post+',6']=look(TEXT.postEarly);else M.warps[DOORS.post+',6']=()=>goTo('post',6,7,'up');
 door(M,DOORS.snag,6,'snag',7,8,'up');
 open(M,DOORS.cannery,6);if(N)M.warps[DOORS.cannery+',6']=enterCannery;else M.O[DOORS.cannery+',6']=look(TEXT.canneryShut);
 open(M,DOORS.loft,6);M.warps[DOORS.loft+',6']=enterLoft;
 // looks at the fronts
 M.O['2,6']=look(TEXT.look.house);M.O['22,6']=look(TEXT.look.snag);M.O['32,6']=M.O['33,6']=look(TEXT.look.cannery);
 // the street's dressing
 put(M,'van',3,10,4,1,{face:'side'});[3,4,5,6].forEach(x=>M.O[x+',10']={look:()=>said(F.deduce==='right'?TEXT.vanJug:TEXT.van)});
 put(M,'car',11,9,3,1,{tint:'#3e5a6a'});put(M,'car',32,11,3,1,{tint:'#7a2a3a'});[11,12,13].forEach(x=>M.O[x+',9']=look(TEXT.look.car));[32,33,34].forEach(x=>M.O[x+',11']=look(TEXT.look.car));
 [[1,8],[16,8],[25,8],[39,8],[8,12],[24,12],[38,12]].forEach(([x,y])=>put(M,'lamp',x,y));
 put(M,'flag',15,7);M.O['15,7']=look(TEXT.look.flag);
 put(M,'stairs',35,0,3,7,{walk:1});
 put(M,'shelter',13,12,3,1);M.O['13,12']=M.O['14,12']=M.O['15,12']=look(TEXT.shelter);
 put(M,'bench',5,14);M.O['5,14']=look(TEXT.look.bench);put(M,'bench',19,14);M.O['19,14']=look(TEXT.look.bench);
 put(M,'barrel',32,15);M.O['32,15']={id:'barrel',name:TEXT.barrel,look:()=>said(N||F.barrel?TEXT.barrelNight:TEXT.barrelDay),opts:()=>barrelOpts()};put(M,'trash',10,14);
 put(M,'planter',8,7);put(M,'planter',23,7);
 // the pier: rails both sides, its light at the end, the ladder down into the river at the end
 block(M,27,22,5,1);put(M,'pierlamp',31,21);
 const ladder={id:'ladder',name:TEXT.rail,look:TEXT.railLook,opts:[{use:'track',label:TEXT.railTrack,show:()=>!has('tide'),ok:async()=>{await play(TEXT.railDo);clue('tide',TEXT.cTideMarks);checkpoint()},fail:()=>said('Rain, green rungs, and the river. It isn\'t telling.')}],used:()=>has('tide')};
 M.O['28,22']=M.O['29,22']=M.O['30,22']=ladder;
 for(let x=0;x<40;x++){if(x<27||x>31)M.O[x+',16']=look(TEXT.look.river)}
 M.O['3,13']=M.O['36,13']=look(TEXT.look.rail);
 [[3,17,1],[8,19,0],[13,17,0],[18,20,1],[22,17,0],[25,18,0],[34,17,1],[37,20,0],[11,22,0],[2,21,0]].forEach(([x,y,gull])=>put(M,'piling',x,y,1,1,{walk:1,gull}));
 [[2,15],[26,15],[36,15]].forEach(([x,y])=>put(M,'bollard',x,y));
 // the pier steps: the Lantern Box waits under them at night
 M.O['26,15']={id:'steps',name:TEXT.steps,look:N?TEXT.stepsNight:TEXT.stepsLook,opts:()=>N&&!G.fs.used['box:pier']?[{label:TEXT.stepsOpen,run:openBox}]:[],used:()=>!N||!!G.fs.used['box:pier']};
 put(M,'crabpot',28,18);put(M,'crabpot',28,19);put(M,'crabpot',30,20);M.O['28,17']=M.O['30,19']=look(TEXT.look.pier);
 // the edges: Marine Drive goes on both ways
 bounceDir(M,[7,8,9,10,11,12,13,14,15].map(y=>'0,'+y),TEXT.edge,'right');
 bounceDir(M,[7,8,9,10,11,12,13,14,15].map(y=>'39,'+y),TEXT.edge,'left');
 // people: who's where by phase. By day the bull lies at the pier's end until it's dealt with.
 const NP=[];
 if(!N){NP.push({id:'teague',x:24,y:15,dir:'down',talk:talkTeague},{id:'walker',x:9,y:8,dir:'right'},{id:'dog',x:10,y:8,dir:'right'});
  if(!F.bull)NP.push({id:'bull',x:29,y:21,dir:'up',talk:bullScene})}
 else NP.push({id:'fisher',x:29,y:21,dir:'down'});
 M.npcs=folkOf(NP);
 // walking out the pier by day meets the bull
 M.onStep=async()=>{if(!N&&!F.bull&&G.x>=27&&G.x<=31&&G.y>=19){held=[];await bullScene()}};
 if(N){M.danger=true;if(intelOn('rain'))M.lanternK=1.3;
  M.roamers=[
   {id:'rsteps',types:['gull'],sprite:'gull',name:'Gulls',skulls:1,tags:EN.gull.tags,path:BEAT.steps,look:'Gulls on the rail by the pier steps, not sleeping. All their heads turn with you, together.',guard:openBox},
   {id:'rbarrel',types:['piling'],sprite:'piling',name:'The piling',skulls:2,tags:EN.piling.tags,path:BEAT.barrel,look:'Something tall and tangled in old net walks back and forth by the brine barrel, dripping, not quite touching it.',guard:fillBrine}];
  M.arrive=townNight}
 return M}
async function townNight(){const F=G.flags;if(F.night1)return;F.night1=1;
 await cut('night1',()=>play(TEXT.night1));
 // Search's On guard (75): spot the roamers' beats
 const L=lead();if(skillVal(L.a,'Search')>=75&&!G.fs.used.onguard){G.fs.used.onguard=1;const o=SR.pct(chanceOf(L,'Search'));
  await say('',resultLine('ON GUARD · SEARCH',o),{auto:1000});
  if(o.ok){setTrail(G.M.roamers.flatMap(r=>r.path),'beat');await said(TEXT.nightOk)}else{tried(L,'Search');await said(TEXT.nightFail)}}
 checkpoint()}
async function openBox(){await lanternBox('pier',['roadflare','firstaid','salt'],TEXT.stepsBox);rebuild()}
function barrelOpts(){const F=G.flags,N=isNight();
 if(!N&&!F.barrel)return[{use:'fix',label:TEXT.barrelFix,ok:async()=>{F.barrel=1;await fillBrine()},fail:()=>said(TEXT.barrelFail)}];
 return[{label:TEXT.barrelFill,run:fillBrine}]}
async function fillBrine(){if(holdItem('brine')){await said(TEXT.barrelHave);return}await said(TEXT.barrelDo);await pickup('brine');checkpoint()}

// ---- interiors: the back wall three tiles tall, the door in the bottom wall ----
function room(id,name,W,H,floor,o={}){const M=blank(id,name,W,H,floor,isNight()?'night':'day');M.alpha=o.alpha||.84;M.warm='#ffcf80';
 block(M,0,0,W,3);block(M,0,0,1,H);block(M,W-1,0,1,H);block(M,0,H-1,W,1);put(M,'room',0,0,W,H,{walk:1,floor});return M}
const out=(M,x,y,to)=>door(M,x,y,'town',DOORS[to],7,'down');

// THE LOFT: Teague's room over the cannery (13 x 9). The phone rings here; the day turns at its window.
function buildLoft(){const M=room('loft','THE LOFT · TEAGUE',13,9,'w'),F=G.flags;
 put(M,'studywall',1,0,5,3,{walk:1});[1,2,3,4,5].forEach(x=>M.O[x+',2']={id:'wall',name:TEXT.wall,look:TEXT.wallLook,opts:()=>wallOpts(),used:()=>has('wall')&&!!F.wallRead});
 put(M,'window',8,0,3,3,{walk:1});M.O['8,2']=M.O['9,2']=M.O['10,2']={id:'window',name:TEXT.windowName,look:TEXT.windowLook,opts:()=>isNight()?[]:[{label:TEXT.windowOpt,run:waitForDark}]};
 // The hidden hotspot (Item list, Mushrooms): the shaving mirror over the basin, only while the lead is High (field.js)
 put(M,'mirror',11,0,1,3,{walk:1});
 M.O['11,2']={id:'mirror',hidden:'mushrooms',name:TEXT.mirrorName,look:readMirror,used:()=>has('mirror'),glint:(c,x,y,now)=>L01A.mirrorGlint(c,x,y,now)};
 put(M,'cot',1,4,1,2);M.O['1,4']=M.O['1,5']=look(TEXT.look.cot);
 put(M,'hotplate',11,4);M.O['11,4']={id:'trash',name:TEXT.trash,look:TEXT.trashLook,opts:[{use:'sweep',once:'trash',ok:async()=>{await play(TEXT.trashDo);if(!has('dot')){clue('dot',TEXT.cDot);checkpoint()}},fail:()=>said(TEXT.trashNone)}]};
 put(M,'crate',9,6);M.O['9,6']={id:'phone',name:TEXT.phone,look:TEXT.phoneLook,opts:()=>phoneOpts(),used:()=>!!F.deduce};
 put(M,'books',3,6);M.O['3,6']={id:'carbons',name:TEXT.carbons,look:TEXT.carbonsLook,opts:()=>carbonOpts(),used:()=>!!F.letters||!holdersOf('Duty').length&&!!G.fs.used['opt:skim']};
 put(M,'floorboard',5,5,1,1,{walk:1});M.O['5,5']={id:'floor',name:TEXT.floor,look:()=>said(F.lockbox?TEXT.lockLook:TEXT.floorLook),opts:()=>floorOpts(),used:()=>has('record')};
 put(M,'lamp_in',7,4);
 out(M,6,8,'loft');
 M.arrive=loftArrive;
 // the empty coat: if a reload lands here at night before it's been fought, the first step starts it
 M.onStep=async()=>{if(isNight()&&!F.coat){held=[];await coatFight()}};
 return M}
// THE SNAG TAVERN (15 x 10): Mo behind the bar, Hap on his stool, by day and night
function buildSnag(){const M=room('snag','THE SNAG TAVERN',15,10,'w');
 put(M,'bar',1,4,8,1);[1,2,3,4,5,6,7,8].forEach(x=>M.O[x+',4']=look(TEXT.look.bar));
 M.O['5,4']=M.O['4,4']=M.O['6,4']=()=>talkMo();M.O['7,4']={id:'register',name:'REGISTER',look:TEXT.look.register,opts:()=>has('napkins')?[]:[{use:'sweep',ok:async()=>{await play(TEXT.registerDo);await findNapkins()},fail:()=>said('Corks, a bottle opener, and a church key older than the church.')}],used:()=>has('napkins')};
 M.O['2,4']=look(TEXT.look.eggs);
 put(M,'backbar',1,0,8,3,{walk:1});put(M,'jukebox',11,3);M.O['11,3']=look(TEXT.look.jukebox);
 [2,4,6].forEach(x=>put(M,'stool',x,5,1,1,{walk:1}));put(M,'stool',10,4,1,1,{walk:1,empty:1});M.O['10,3']=look(TEXT.look.stool);
 put(M,'pooltable',10,6,3,2);[10,11,12].forEach(x=>{M.O[x+',6']=M.O[x+',7']=look(TEXT.look.pool)});
 put(M,'coatrack',1,8);
 M.O['1,8']={id:'rack',name:TEXT.rack,look:TEXT.rackLook,opts:[{label:TEXT.rackOpt,once:'rack',run:async()=>{await said(TEXT.rackFind);await pickup('shrooms')}}]};
 put(M,'neon',11,0,3,3,{walk:1});
 M.npcs=folkOf([{id:'mo',x:5,y:3,dir:'down',talk:talkMo,out:()=>has('napkins')&&(has('box')||!!G.fs.used['opt:fax'])},{id:'hap',x:2,y:6,dir:'up',talk:talkHap,out:()=>has('tide')&&(has('wall')||!!G.fs.used['opt:hapnet'])}]);
 out(M,7,9,'snag');return M}
// POST OFFICE (13 x 9): day only, Ray at the counter
function buildPost(){const M=room('post','POST OFFICE',13,9,'n');
 put(M,'pocounter',1,4,7,1);[1,2,3,5,6,7].forEach(x=>M.O[x+',4']=look(TEXT.look.counter));M.O['4,4']=()=>talkRay();
 put(M,'poboxes',8,0,4,3,{walk:1});[8,9,11].forEach(x=>M.O[x+',2']=look(TEXT.look.boxes));
 M.O['10,2']={id:'box418',name:TEXT.box418,look:TEXT.boxLook,opts:()=>boxOpts(),used:()=>!!G.flags.box418};
 put(M,'stampposter',1,0,2,3,{walk:1});M.O['2,2']=look(TEXT.look.stamps);
 put(M,'plant',11,6);put(M,'chairs',9,6,2,1);put(M,'lamp_in',1,6);
 M.npcs=folkOf([{id:'ray',x:4,y:3,dir:'down',talk:talkRay,out:()=>!!G.flags.box418}]);
 out(M,6,8,'post');return M}
// HALVORSEN HOUSE (12 x 8): Inga's front room, by day and night
function buildHalvorsen(){const M=room('halvorsen','HALVORSEN HOUSE',12,8,'c');
 put(M,'sofa',2,3,3,1);[2,3,4].forEach(x=>M.O[x+',3']=look(TEXT.look.sofa));put(M,'tv',8,3);M.O['8,3']=look(TEXT.look.tv);
 put(M,'sidetable',6,3);M.O['6,3']=look(TEXT.look.ledger);put(M,'woodstove',10,3);M.O['10,3']=look(TEXT.look.stove);
 put(M,'catbasket',4,6,1,1,{walk:1});M.O['4,6']={id:'basket',name:TEXT.basket,look:TEXT.basketLook,opts:()=>has('rent')?[]:[{use:'sweep',ok:async()=>{await play(TEXT.basketDo);clue('rent',TEXT.cBasket);checkpoint()},fail:()=>said('Cat hair and a squeaky fish. The fish has been loved to death.')}],used:()=>has('rent')};
 put(M,'lamp_in',1,4);put(M,'rug',3,5,5,1,{walk:1});
 M.npcs=folkOf([{id:'inga',x:5,y:4,dir:'down',talk:talkInga,out:()=>has('rent')&&!!G.flags.key}]);
 out(M,6,7,'halvorsen');return M}
// THE CANNERY FLOOR (26 x 20): night only, the finale area. The retort room waits at the top; the rest of the floor
// (the brine tanks, the office, the stacks) is reached without crossing its doors (The boss waits for you).
async function enterCannery(){const r=await askNotYet(TEXT.canneryQ,TEXT.gateIn);if(r===0)await goTo('cannery',3,18,'up');else{G.dir='down';await stepBack()}}
function buildCannery(){const W=26,H=20,M=blank('cannery','THE CANNERY FLOOR',W,H,'o','night'),F=G.flags;M.alpha=.84;M.warm='#ffcf80';if(intelOn('rain'))M.lanternK=1.3;
 block(M,0,0,W,3);block(M,0,0,1,H);block(M,W-1,0,1,H);block(M,0,H-1,W,1);put(M,'floorroom',0,0,W,H,{walk:1});
 put(M,'retort',11,0,4,3,{walk:1});open(M,12,2);open(M,13,2);M.warps['12,2']=M.warps['13,2']=bossAsk;
 for(const y of[6,10,14]){put(M,'slime',3,y,5,1);[3,4,5,6,7].forEach(x=>M.O[x+','+y]=look(TEXT.tables))}
 put(M,'belt',11,8,7,1);[11,12,13,14,15,16,17].forEach(x=>M.O[x+',8']=look(TEXT.belt));
 put(M,'cans',20,13,2,1);M.O['20,13']=M.O['21,13']=look(TEXT.cans);put(M,'cans',11,15,2,1);M.O['11,15']=M.O['12,15']=look(TEXT.cans);
 put(M,'pallet',22,16,2,1);put(M,'pallet',16,17,2,1);put(M,'pallet',20,5,1,1);
 put(M,'brine',18,3,2,1);put(M,'brine',21,3,2,1);[18,19,21,22].forEach(x=>M.O[x+',3']={id:'tanks',name:TEXT.tanks,look:TEXT.tanksLook,opts:()=>tankOpts()});
 put(M,'office',1,0,4,3,{walk:1});M.O['2,2']=M.O['3,2']={id:'office',name:TEXT.office,look:TEXT.officeLook,opts:()=>officeOpts(),used:()=>!!F.burn||(!!F.psalter&&!officeOpts().length)};
 put(M,'drain',14,12,1,1,{walk:1});M.O['14,12']=look(TEXT.drain);
 put(M,'hanglamp',6,4,1,1,{walk:1});put(M,'hanglamp',20,9,1,1,{walk:1});put(M,'hanglamp',8,16,1,1,{walk:1});
 open(M,3,H-1);M.warps['3,'+(H-1)]=async()=>{await goTo('town',DOORS.cannery,7,'down')};
 M.arrive=async()=>{if(!F.canIn){F.canIn=1;await cut('canIn',()=>play(TEXT.canneryIn));await trigger('subject','the dark');checkpoint()}};
 return M}
// the part A looks (the places' dressing), kept
TEXT.look={
 river:'The Columbia, gray and wide and going out. Somewhere under it, a sea lion barks.',pier:'The pier\'s planks are slick with rain. The rail\'s been patched with rope.',
 rail:'The old rail line. The trolley runs in summer. It\'s not summer.',bench:'A bench with a brass plaque: FOR LEIF, WHO LOVED THE RIVER. Wet through.',
 car:'A parked car, fogged up. A bumper sticker: I\'D RATHER BE CRABBING.',flag:'The post office flag, soaked and stuck to its pole.',
 snag:'THE SNAG TAVERN. A neon fish over the door with half its letters out.',cannery:'BAY PACKING CO., faded across a cannery as big as a church. The loading doors are rusted shut.',
 house:'A tall narrow house, painted blue once. A wind chime made of old keys.',
 cot:'An army cot, made with hospital corners. Nobody\'s slept in it.',
 bar:'The bar. Forty years of elbows worn into it.',eggs:'A big jar of pickled eggs, cloudy. Somebody\'s drawn a face on it in grease pencil.',
 jukebox:'The jukebox. Every song on it is about a boat.',pool:'The pool table. The 8-ball\'s been replaced by a crab float.',
 register:'An old brass register. A wad of napkins tucked in behind the drawer.',stool:'The stool by the jukebox. Nobody\'s on it. Nobody\'s been on it in a while.',
 counter:'The post office counter. A bell, a scale, a cup of pens on chains.',boxes:'Brass PO boxes, floor to ceiling.',
 stamps:'A poster of stamps: LIGHTHOUSES OF THE NORTHWEST.',
 sofa:'A sofa with an afghan on it in every color they had.',tv:'The TV\'s on mute. The weather: rain, with a little picture of rain.',
 ledger:'A rent ledger on the side table. FEBRUARY · ABEL · PAID, in pen that\'s pressed too hard.',stove:'A woodstove, ticking. The only warm thing for a mile.'};
const MAPS={town:buildTown,loft:buildLoft,snag:buildSnag,post:buildPost,halvorsen:buildHalvorsen,cannery:buildCannery};

// ================= MARINE DRIVE BY DAY =================
// Teague on the street: a Disturbing horror the first time, and a liar (Paranoia). Empathy's Read gets one second of him.
async function talkTeague(){const F=G.flags;await trigger('liar');
 if(!F.teague1){F.teague1=1;await cut('teague',()=>play(TEXT.teague1));await horror(HORRORS.teague);checkpoint()}
 await hotspot({name:TEXT.teagueName,look:()=>play(TEXT.teagueLook),opts:[
  {use:'read',label:TEXT.teagueRead,once:'tRead',ok:()=>play(TEXT.teagueReadDo),fail:()=>said('He looks back at you, pleasantly, from somewhere a long way behind his face.')},
  {use:'talk',label:TEXT.teagueAsk,once:'tAsk',ok:()=>play(TEXT.teagueAskDo),fail:()=>play(TEXT.teagueAskDo)},
  {label:TEXT.teagueCall,once:'tCall',run:()=>play(TEXT.teagueCallDo)}]},'teague')}
// the bull on the dock (a story fight, 2 skulls): Survival's Track backs off without a fight. Fighting it by day on
// Marine Drive is overstepping: seen, or public if it was Loud.
async function bullScene(){const F=G.flags;if(F.bull)return;
 if(!F.bullSeen){F.bullSeen=1;await cut('bull',()=>play(TEXT.bull1));await horror(HORRORS.bull);checkpoint()}
 let left=false;
 await hotspot({name:TEXT.bullName,look:TEXT.bullLook,opts:[
  {use:'track',label:TEXT.bullBack,once:'bullBack',ok:async()=>{F.bull='gone';await play(TEXT.bullBackDo);rebuild();checkpoint()},fail:async()=>{await said(TEXT.bullBackFail);await fightBull()}},
  {label:TEXT.bullShoo,run:fightBull},
  {label:TEXT.bullLeave,run:async()=>{left=true}}]},'bull');
 if(!F.bull&&G.y>=19){G.dir='up';StudioMove.place(G,G.x,18,'up')}}
async function fightBull(){const F=G.flags;const r=await battle(['bull'],{story:true,intro:TEXT.bullIntro});if(r==='lose')return gameOver();
 F.bull='fought';await play(TEXT.bullDone);rebuild();checkpoint();
 if(G.fs.lastLoud){F.bullLoud=1;await said(TEXT.crowd);await overstepHere('public')}else await overstepHere('seen')}

// ================= THE HALVORSEN HOUSE =================
// a liar about the rent (Paranoia). Empathy or Persuade gets the truth; so does asking about the rent once you already
// know something else about him (never a dead end). She gives the loft's spare key unless the street has Noticed you.
async function talkInga(){const F=G.flags;await trigger('liar');
 if(isNight()){await play(TEXT.ingaNight);return}
 if(!F.inga1){F.inga1=1;await play(TEXT.inga1)}
 if(!F.key){if(stepAt('Noticed'))await play(TEXT.ingaNoticed);else{F.key=1;await play(TEXT.ingaKey);checkpoint()}}
 if(has('rent')){await play(TEXT.ingaAfter);return}
 const tell=async()=>{await play(TEXT.ingaTruth);clue('rent',TEXT.cRent);checkpoint()},m=()=>clam()+(intelOn('sexton')?10:0);
 await hotspot({name:'MRS. HALVORSEN',look:()=>play(TEXT.ingaLie),opts:[{use:'read',mod:m,ok:tell},{use:'talk',mod:()=>clam(),ok:tell},
  {label:TEXT.ingaRent,show:()=>townClues()>0,run:tell}]},'inga')}

// ================= THE POST OFFICE =================
async function talkRay(){const F=G.flags;
 if(F.box418){await play(TEXT.rayAfter);return}
 if(!F.ray1){F.ray1=1;await play(TEXT.ray1)}
 await play(stepAt('Noticed')?TEXT.rayNoticed:TEXT.rayBox);
 await hotspot({name:TEXT.box418,opts:boxOpts()},'box418')}
// box 418: paper (Bureaucracy, +10 from the mail intel), family (Persuade), Ray's back turned (Stealth), or the little
// door popped while Ray watches (Melee, overstepping: seen)
function boxOpts(){const F=G.flags;if(F.box418)return[];return[
 {use:'paper',label:TEXT.boxPaper,mod:()=>(intelOn('mail')?10:0),ok:async()=>{await play(TEXT.boxPaperDo);await openBox418()},fail:()=>said('Ray reads your form twice and hands it back. "Line nine."')},
 {use:'talk',label:TEXT.boxTalk,mod:()=>clam(),ok:async()=>{await play(TEXT.boxTalkDo);await openBox418()},fail:()=>said('"Family," Ray says. "Sure." He goes back to his lighthouses.')},
 {use:'sneak',label:TEXT.boxSneak,ok:async()=>{await play(TEXT.boxSneakDo);await openBox418()},fail:()=>said('Ray comes back out of the sorting room faster than a man his age should. He watches you a while.')},
 {use:'force',label:TEXT.boxForce,ok:async()=>{F.forced=1;await play(TEXT.boxForceDo);await openBox418();await overstepHere('seen')},fail:()=>said('The little brass door is federal property and it knows it.')}]}
async function openBox418(){const F=G.flags;F.box418=1;await play(TEXT.boxIn);clue('box',TEXT.cBox);if(!has('dot')){await play(TEXT.dotIn);clue('dot',TEXT.cDot)}checkpoint()}

// ================= THE SNAG =================
// Mo: the napkins (Persuade; free with the town intel), and the fax copy of a report (Persuade): box's second way in
async function talkMo(){const F=G.flags;
 if(!F.mo1){F.mo1=1;await play(TEXT.mo1);if(intelOn('town'))await play(TEXT.moHat)}
 if(has('napkins')&&(has('box')||G.fs.used['opt:fax'])){await play(TEXT.moAfter);return}
 const nap=async()=>{await play(TEXT.moNap);await findNapkins()};
 await hotspot({name:TEXT.moName,opts:[
  {label:TEXT.moAskNap,show:()=>!has('napkins')&&intelOn('town'),run:nap},
  {use:'talk',label:TEXT.moAskNap,show:()=>!has('napkins')&&!intelOn('town'),ok:nap,fail:()=>play(TEXT.moNo)},
  {use:'talk',label:TEXT.moAskFax,once:'fax',show:()=>has('napkins')&&!has('box'),ok:async()=>{await play(TEXT.moFax);clue('box',TEXT.cBoxFax);checkpoint()},fail:()=>play(TEXT.moNo)}]},'mo')}
async function findNapkins(){await play(TEXT.napkinsRead);clue('napkins',TEXT.cNapkins);checkpoint()}
// Hap: the river (a pickled egg, no roll), and the net-blessing (Persuade): wall's second way in
async function talkHap(){const F=G.flags;
 if(!F.hap1){F.hap1=1;await play(TEXT.hap1)}
 if(has('tide')&&(has('wall')||G.fs.used['opt:hapnet'])){await play(TEXT.hapAfter);return}
 await hotspot({name:TEXT.hapName,opts:[
  {label:TEXT.hapEgg,once:'egg',run:async()=>{await play(TEXT.hapEggDo);if(!has('tide'))clue('tide',TEXT.cTide);checkpoint()}},
  {use:'talk',label:TEXT.hapNet,once:'hapnet',show:()=>!has('wall'),ok:async()=>{await play(TEXT.hapNetDo);clue('wall',TEXT.cWallHap);checkpoint()},fail:()=>said(TEXT.hapNo)}]},'hap')}

// ================= THE LOFT =================
// The loft door: Mrs. Halvorsen's spare key, or a lock pick (Craft), the ledge (Athletics), or a shoulder (Melee,
// overstepping: seen from across the street). Once in, it stays open.
async function enterLoft(){const F=G.flags;
 if(F.loftOpen)return goTo('loft',6,7,'up');
 let inn=false;const go=async()=>{inn=true;F.loftOpen=1};
 await hotspot({name:TEXT.loftDoor,look:TEXT.loftLocked,opts:[
  {label:TEXT.loftKey,show:()=>!!F.key,run:go},
  {use:'fix',label:TEXT.loftPick,ok:async()=>{await said(TEXT.loftPickDo);await go()},fail:()=>said('The lock is older than you and has more patience.')},
  {use:'climb',label:TEXT.loftSneak,ok:async()=>{await said(TEXT.loftSneakDo);await go()},fail:()=>said('The ledge is wet. You decide you like being alive.')},
  {use:'force',label:TEXT.loftForce,ok:async()=>{F.loftForced=1;await said(TEXT.loftForceDo);await go();await overstepHere('seen')},fail:()=>said('Old growth fir. The door wins.')}]},'loftdoor');
 if(inn)return goTo('loft',6,7,'up');G.dir='down';await stepBack()}
async function loftArrive(){const F=G.flags;
 if(!F.loft1){F.loft1=1;await cut('loft',()=>play(TEXT.loftIn));checkpoint()}
 if(isNight()&&!F.coat)return coatFight();
 if(!isNight()&&!F.deduce&&townClues()>=3&&!F.ringing){F.ringing=1;await said(TEXT.ring);checkpoint()}}
function wallOpts(){const F=G.flags;const read=async()=>{F.wallRead=1;await play(TEXT.wallRead);await horror(HORRORS.wall);if(!has('wall'))clue('wall',TEXT.cWall);checkpoint()};
 if(F.wallRead)return[];return[{use:'identify',label:TEXT.wallOcc,ok:read,fail:()=>said(TEXT.wallFail)},{use:'records',label:TEXT.wallHist,ok:read,fail:()=>said(TEXT.wallFail)}]}
function floorOpts(){const F=G.flags;if(has('record'))return[];
 if(!F.lockbox)return[{use:'sweep',label:TEXT.floorSweep,ok:async()=>{F.lockbox=1;await said(TEXT.floorDo);checkpoint()},fail:()=>said(TEXT.floorFail)},
  {use:'force',label:TEXT.floorSweep,ok:async()=>{F.lockbox=1;await said(TEXT.floorDo);checkpoint()},fail:()=>said(TEXT.floorFail)}];
 return[{use:'paper',label:TEXT.lockPaper,ok:async()=>{await said(TEXT.lockPaperDo);await findRecord()},fail:()=>said(TEXT.lockFail)},
  {use:'fix',label:TEXT.lockFix,ok:async()=>{await said(TEXT.lockFixDo);await findRecord()},fail:()=>said(TEXT.lockFail)},
  {use:'force',label:TEXT.lockForce,ok:async()=>{await said(TEXT.lockForceDo);await findRecord()},fail:()=>said(TEXT.lockFail)}]}
async function findRecord(){await play(TEXT.lockIn);clue('record',TEXT.cRecord);await pickup('record');checkpoint()}
// the six reports (motivation moment: Duty): no roll, but reading them all costs the Duty agents a horror
function carbonOpts(){const F=G.flags;if(F.letters)return[];return[
 {label:TEXT.carbonsRead,show:()=>holdersOf('Duty').length>0,run:async()=>{F.letters=1;await play(TEXT.lettersRead);const ds=holdersOf('Duty');await horror(HORRORS.letters,{who:ds});for(const m of ds)await motivate(m);checkpoint()}},
 {use:'paper',label:TEXT.carbonsSkim,once:'skim',ok:()=>said(TEXT.carbonsSkimDo),fail:()=>said(TEXT.carbonsSkimDo)}]}
async function readMirror(){await play(TEXT.mirrorLook);await horror(HORRORS.mirror);if(!has('mirror')){clue('mirror',TEXT.cMirror);checkpoint()}}
function phoneOpts(){const F=G.flags;if(F.deduce)return[];if(townClues()<3)return[];return[{label:TEXT.phonePick,run:deduce}]}
// The deduction (Gameplay loop, Deduction), on the loft's landline: where's my agent? Right needs `wall` plus
// `napkins` or `rent`; Records needs `box`. A wrong answer costs SAN at the night's first horror, never progress:
// the night turns either way.
async function deduce(){const F=G.flags;if(F.deduce)return;
 await hunch(TEXT.hunch);
 await play(TEXT.hatCall);
 const right=()=>has('wall')&&(has('napkins')||has('rent'));
 let r=await ask('BIG HAT',TEXT.hatAsk,TEXT.hatOpts);
 // Loose thread (an arc perk, spec 008): once per case, a wrong answer costs nothing and you can answer again
 const lt=!(r===1&&right())&&live().find(m=>perkOn(m,'truth'));
 if(lt){await say('',fillT(BLS.HOMEW.perkUsed,{p:BLS.HOMEW.perks.truth[0],n:lt.name}));r=await ask('BIG HAT',TEXT.hatAsk,TEXT.hatOpts)}
 if(r===1&&right()){F.deduce='right';await play(TEXT.hatRight);await pickup('brine')}
 else if(r===1){F.deduce='noproof';await play(TEXT.hatNoProof)}
 else if(r===2&&has('box')){F.deduce='half';await play(TEXT.hatRecords)}
 else if(r===2){F.deduce='noproof';await play(TEXT.hatNoRecords)}
 else{F.deduce='wrong';await play(TEXT.hatWrong)}
 checkpoint()}
// the day's turn: the loft's window, once the phone has rung, with Go on / Not yet and what closes (studio-bible/play.md)
async function waitForDark(){const F=G.flags;if(isNight())return;
 if(townClues()<3){await said(TEXT.windowClues,{n:townClues()});return}
 if(!F.deduce){await said(TEXT.windowPhone);return}
 const r=await askNotYet(TEXT.duskQ+' '+TEXT.duskClose,TEXT.turnOpts);if(r!==0)return;
 await fade(1);F.ph=1;await play(TEXT.dusk);await rest(1);goMap('loft',9,3,'up');banner(TEXT.phase[1]);checkpoint();await fade(0);
 await trigger('night');await coatFight()}
// the empty coat (a story fight at dusk). A wrong deduction costs each agent 1 SAN here, at the night's first horror.
async function coatFight(){const F=G.flags;if(F.coat)return;
 await cut('coat',()=>play(TEXT.coat1));
 if(F.deduce==='wrong'&&!F.wrongPaid){F.wrongPaid=1;await said(TEXT.wrongCost);live().forEach(m=>{m.san=Math.max(1,m.san-1)});applySan()}
 const E=EN.coat;E.acts={strangle};
 const r=await battle(['coat'],{story:true,intro:TEXT.coatIntro});if(r==='lose')return gameOver();
 F.coat=1;await play(TEXT.coatDone);checkpoint()}
// Strangle: a sleeve round the throat; the agent loses their next turn
async function strangle(e){const ts=party.filter(m=>!m.ko&&!m.dead&&!m.gone&&!m.out);const t=pick(ts);if(!t)return;
 const o=SR.pct(e.hit);if(!o.ok){await bsay(`A sleeve wraps for ${t.name}'s throat and misses.`,900);return}
 const d=roll(1,3);await bsay(`A sleeve wraps around ${t.name}'s throat and pulls. ${d} damage.`,1100);await hurtAgent(t,d,e);if(!t.ko)t.skip=1}

// ================= THE CANNERY =================
function tankOpts(){const get=async()=>{if(holdItem('brine')){await said(TEXT.barrelHave);return}await said(TEXT.tanksDo);await pickup('brine');checkpoint()};
 return[{use:'fix',label:TEXT.tanksFix,ok:get,fail:()=>said(TEXT.tanksFail)},{use:'sample',label:TEXT.tanksSample,ok:get,fail:()=>said(TEXT.tanksFail)}]}
// the Psalter: find its binding page (Occult) or turn out the desk (Search); then burn the page carefully (Science),
// by the book (Occult), or now, which sets the office going (overstepping: seen from the street). Burning it means
// it can't re-anchor in the fight; its flyleaf doesn't burn.
function officeOpts(){const F=G.flags;
 if(!F.psalter){const find=async()=>{F.psalter=1;await play(TEXT.psalterRead);clue('psalter',TEXT.cPsalter);await pickup('psalter');checkpoint()};
  return[{use:'identify',label:TEXT.officeOcc,ok:find,fail:()=>said(TEXT.psalterFail)},{use:'sweep',label:TEXT.officeSweep,ok:find,fail:()=>said(TEXT.psalterFail)}]}
 if(F.burn||!holdItem('psalter'))return[];
 return[{use:'sample',label:TEXT.burnSafe,ok:()=>burnBook(false),fail:()=>burnBook(true)},
  {use:'identify',label:TEXT.burnBook,ok:()=>burnBook(false),fail:()=>said(TEXT.burnFail)},
  {label:TEXT.burnNow,run:()=>burnBook(true)}]}
async function burnBook(wild){const F=G.flags;F.burn=wild?'wild':'safe';
 const h=holderOf('psalter');if(h){h.it.u=1;spend(h.m,h.it)}else G.fs.pack=(G.fs.pack||[]).filter(it=>it.k!=='psalter');
 if(wild)await said(TEXT.burnWild);
 await play(TEXT.burnDo);await pickup('flyleaf');checkpoint();
 if(wild)await overstepHere('seen')}
// The boss waits for you (Gameplay loop; play.md): Go in / Not yet at the retort room's doors, cursor on Not yet
async function bossAsk(){const F=G.flags;if(F.boss)return;
 const r=await askNotYet(TEXT.retortQ+' '+TEXT.retortClose,TEXT.gateIn);
 if(r===0)return bossFight();
 G.dir='down';await stepBack()}
// The Tenant (Bosses; Combat numbers; tuned Nov 23, 2026 with tools/boss-sim.js). 62 HP; −6 with his service record in
// hand, −8 if the Psalter's page was burned, −6 if the deduction was right (42 with all three, 32% off). Phase 1,
// polite: a reach (5), the tide at everyone (2), the offer (1, 0/1 SAN). Phase 2 at half: +5% to hit, one more reach
// and tide; a shield takes 1 off every hit unless his name was read from the record, and it heals 1 a turn unless
// the page burned. Talking to him in phase 2 (Redemption) costs the party a round and holds it for one. Salt water (the brine)
// is its weakness; a right deduction makes Identify free.
async function bossFight(o={}){
 const F=G.flags;F.bossSeen=1;
 await cut('retort',()=>play(TEXT.retort1));await horror(HORRORS.retort);if(!party.some(m=>!m.gone&&m.san>0))return gameOver();
 await cut('boss',async()=>{await said(TEXT.bossSay);await said(TEXT.bossSay2);if(F.burn)await said(TEXT.bossBurned)});
 checkpoint();
 const E=EN.tenant,rec=has('record'),burn=!!F.burn,right=F.deduce==='right';
 E.records=()=>has('record');
 E.onHurt=(e,d)=>e.ph2&&!G.flags.named&&d>0?Math.max(1,d-(e.shield|0)):d;
 E.onTurn=async e=>{if(!e.ph2||e.hp>=e.mhp)return;if(G.flags.burn){if(!e.saidNoHeal){e.saidNoHeal=1;await bsay(TEXT.bossNoHeal,1200)}return}const h=Math.min(e.heal|0,e.mhp-e.hp);if(!h)return;e.hp+=h;await bsay(fill(TEXT.bossHeal,{n:h}),1100)};
 E.phase2={at:.5,hit:5,moves:{hit:1,all:1},line:TEXT.bossPhase,on:async e=>{await bsay(G.flags.named?TEXT.bossNamed:TEXT.bossShield,1600);await talkMoment(e)}};
 const cuts=(rec?6:0)+(burn?8:0)+(right?6:0),hp=E.hp-cuts;
 const r=await battle(['tenant'],{boss:true,hp,intro:TEXT.bossIntro,onStart:async()=>{
  if(cuts)await bsay(TEXT.bossThin,1500);
  if(right){G.fs.ident=G.fs.ident||[];if(!G.fs.ident.includes('en:tenant'))G.fs.ident.push('en:tenant');await bsay(TEXT.bossIdent,1500)}
  if(rec&&holdItem('record'))await bsay(TEXT.bossRecord,1400)}});
 if(r==='lose')return gameOver();
 if(o.noEnd)return;  // the simulator stops at the fight's end
 F.boss=1;await ending();
}
// Talk to Abel, not it (motivation moment: Redemption; the clean ending's other half): offered once as phase 2 opens.
// The mirror makes it sure; otherwise the party's best Empathy rolls at −20. Either way the party spends the round.
async function talkMoment(e){const F=G.flags;if(F.talked)return;
 const r=await ask('',TEXT.talkQ,TEXT.talkOpts);if(r!==0)return;
 const up=party.filter(m=>!m.ko&&!m.dead&&!m.gone&&!m.out);up.forEach(m=>{m.skip=1});
 let ok=has('mirror');
 if(!ok){const b=up.slice().sort((a,c)=>chanceOf(c,'Empathy')-chanceOf(a,'Empathy'))[0];if(b){const o=SR.pct(chanceOf(b,'Empathy',-20));bres('EMPATHY',o);ok=o.ok;if(!ok)tried(b,'Empathy')}}
 if(!ok){await bsay(TEXT.talkFail,1200);return}
 F.talked=1;for(const l of TEXT.talkOk)await bsay(l,1500);e.stun=Math.max(e.stun,1);
 for(const m of holdersOf('Redemption'))await motivate(m)}
window.l01Boss=()=>bossFight({noEnd:true});  // the boss simulator's entry (tools/boss-sim.js)

// ================= OVERSTEPPING (Skills and menus, Overstepping and cover stories) =================
// A quiet case: the agents came as his family. A climb plays its line, then the step's scene: Noticed (Ray and Mrs.
// Halvorsen clam up), the sergeant (Local chief: the post office locks for the day), Big Hat's call (Agency call), and
// the clean-up crew at the next area change (Federal agents).
async function overstepHere(seen){if(!(await overstep(seen)))return;await stepScene()}
async function stepScene(){
 const F=G.flags,s=stepName();
 if(s==='Noticed'&&!F.noticed){F.noticed=1;await play(TEXT.noticed)}
 if(s==='Local chief'&&!F.chief){F.chief=1;F.chiefPh=ph();await play(TEXT.chief)}
 if(s==='Agency call'&&!F.call){F.call=1;await play(TEXT.call)}
 if(s==='Federal agents')F.fedsDue=1;
 checkpoint()}
async function onArea(){if(G.flags.boss)return;await feds(TEXT,play)}

// ================= ENDING =================
// clean: the Tenant driven out with his name read and him spoken to, so he dies as himself. costly: driven out any
// other way. (worst: only in debrief saves from before Nov 24, 2026, when the clean-up crew shut a case down.)
function endingLabel(){const F=G.flags;return F.named&&F.talked?'clean':'costly'}
const lostHere=()=>(store.get(B.key('memorial'),[])||[]).filter(x=>x&&x.case===G.case&&!x.done);
// what the debrief and later agency cases read (bl.season, the case's facts): offBooks marks the arc's next step open
function endingFacts(label){const F=G.flags;
 return{label,clues:G.clues.map(c=>c.id),saved:0,overstep:stepName(),
  san:party.map(m=>({id:m.a.id,name:m.name,from:m.san0,to:m.san})),
  items:party.flatMap(m=>gearOf(m).it.filter(it=>it.pin).map(it=>it.k)).concat((G.fs.pack||[]).filter(it=>it.pin).map(it=>it.k)),
  choices:{deduce:F.deduce||null,named:!!F.named,talked:!!F.talked,burn:F.burn||null,letters:!!F.letters,mirror:has('mirror'),bull:F.bull||null,bullLoud:!!F.bullLoud,
   forced:!!F.forced,loftForced:!!F.loftForced,record:has('record')},
  offBooks:true,
  tried:party.map(m=>({id:m.a.id,skills:m.tried||[]})),
  lost:lostHere().map(x=>({name:x.name,how:x.how}))}}
async function ending(){
 const F=G.flags;
 await play(TEXT.end1);await play(endingLabel()==='clean'?TEXT.endClean:TEXT.endCostly);
 if(!holdItem('psalter')&&!holdItem('flyleaf')){await said(TEXT.bookDrop);await pickup('psalter')}
 if(endingLabel()!=='clean')await trigger('death')
 await fade(1);G.mode='scene';await fade(0);
 await said(TEXT.dawn);
 const label=endingLabel();await debrief(label,endingFacts(label));  // Big Hat's debrief and the case gains (debrief.js)
}

// ================= THE DEBRIEF (spec 007) =================
// The clues the card counts, Big Hat's lines by ending and about the choices, the memo (every ending), the cover
// stories (2 with a skill, the weak Luck one, the easy one for a quiet case kept Clean, Clean books'), and the line
// after the book is bagged. Nobody to keep safe in this one.
const DB=TEXT.db;
const DEBRIEF_DATA={
 clues:['wall','box','dot','rent','napkins','tide','record','psalter','mirror'],victims:0,
 lines:{clean:DB.clean,costly:DB.costly,worst:DB.worst},
 react:F=>{const c=F.choices||{},out=[];if(c.letters)out.push(DB.letters);if(c.deduce==='wrong')out.push(DB.wrong);if(c.forced||c.loftForced)out.push(DB.forced);
  if(c.burn==='wild')out.push(DB.fire);if(c.bullLoud)out.push(DB.bull);if((F.items||[]).includes('record'))out.push(DB.badge);return F.label==='worst'?out.slice(0,1):out.slice(0,2)},
 end:DB.memo,
 stories:[{name:DB.retire,skill:'Persuade',verb:'sell it',pass:DB.retirePass},{name:DB.squat,skill:'Bureaucracy',verb:'paper it',pass:DB.squatPass}],
 weak:{name:DB.weak,pass:DB.weakPass},
 easy:{name:DB.easy,skill:'Persuade',verb:'sell it',mod:30,pass:DB.easyPass},
 safe:{name:DB.safe,pass:DB.safePass},
 bagged:{psalter:DB.filed,flyleaf:DB.filed}
};

// ================= OPENING (Big Hat's briefing in the lightship's wheelhouse) =================
// Each cut is a cutscene B skips once seen (engine.js); the questions and requisition always play.
async function caseOpening(){
 await cut('open',async()=>{await said(TEXT.open1);await said(TEXT.open2)});
 await bigHatScene(async()=>{
  await cut('brief',async()=>{await play(TEXT.brief);await shout(TEXT.briefShout);await play(TEXT.brief1b)});
  await twoQuestions(TEXT.intel);
  await cut('brief2',()=>play(TEXT.brief2));
  await requisition();
  await cut('brief3',()=>play(TEXT.brief3));
 },{place:window.L01A.wheelhouse});
 G.flags.ph=0;G.mode='world';goMap('town',8,10,'up');checkpoint();await fade(0);
 await cut('arrive',async()=>{
  for(const m of squad())await say(m.name.toUpperCase()+' · '+profOf(m.a).name.toUpperCase(),TEXT.role[profOf(m.a).role]||TEXT.roleAny);
  await said(TEXT.arrive)});
}
// the Case file's Next line
const caseNext=()=>{const N=TEXT.next,F=G.flags,n=townClues();
 if(F.boss)return N.home;if(isNight())return N.night;
 if(n<3)return N.day.replace('{n}',n);if(!F.deduce)return N.phone;return N.dusk};

// ================= ON THE CASE BOARD =================
// An agency case (spec 009, step 3): seasons/season-1.js lists it, its unlock count and Big Hat's unlock lines.
// Closing it never raises closed (case-board.js). portraits: the townsfolk's faces (lantern-01-art.js) and the boss's
// (lantern-01-battle-art.js). sprite/spriteSize: battle sprites (the clean-up agent is Still Harvest's SHB).
registerCase({id:'lantern-01',card:caseCard,opening:caseOpening,intel:TEXT.intel,maps:MAPS,tiles:{},
 portraits:name=>window.L01A.portraits[name]||(name==='THE TENANT'?window.L01B.portrait:null),
 enemies:EN,sprite:(k,f,w)=>k==='fed'&&window.SHB?SHB.sprite('fed',f,w):L01B.sprite(k,f,w),spriteSize:k=>k==='fed'&&window.SHB?SHB.size('fed'):L01B.size(k),
 backdrop:(p,o)=>L01B.backdrop(p,o),
 get place(){return window.L01A&&L01A.wheelhouse},  // Big Hat's place for this case: the briefing passes it, and the debrief plays there too
 items:CASE_ITEMS,next:caseNext,quiet:true,loot:LOOT,onArea,
 debrief:DEBRIEF_DATA,label:endingLabel,facts:endingFacts});
})();
