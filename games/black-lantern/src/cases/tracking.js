// Black Lantern · cases/tracking.js
// CASE: Tracking (FILE 05), Fourth Street, Reno, Nevada, in winter (spec 018).
// Part A (Nov 23, 2026): the card, every map (Fourth Street in snow by day and by night, the pawn shop, the clerk's place,
// two motel rooms, the collector's apartment, the records room, the closed club and the finale area), the tape's tracking
// lines on the screen, the townsfolk on the map and in the dialog box, Big Hat's own briefing place, and walkable maps.
// Part B (Nov 23, 2026): the story and play, written from the secret case file: the text block, the briefing's four
// topics and their edges, the trail (clues as keys, each with a second way), the copies and watching the tape (its clip
// and the tracking lines), the hidden hotspot's result, a deduction, the two motivation moments, overstepping on a quiet
// case, two story fights, the club's roamers and Lantern Box, the soft clock, the boss and its tuning, the debrief's facts
// and cover stories (played in the case's own place), and the endings.
// Art is cases/tracking-art.js (window.TRKA: maps, people, the tape's clip and tracking lines) and
// cases/tracking-battle-art.js (window.TRKB: the enemies, the boss's face and the battle backdrops), loaded right after
// this file. Needs engine.js, field.js and battle.js first. The whole file sits in one function so its names never meet
// another case's (every case loads as a plain script).
(function(){

// ================= TEXT =================
// Every line of the case (Voice). A list plays box by box: a plain string is narration, ['WHO', 'line'] is someone
// talking. {code} and {first} are the lead's, with pronoun tokens like {first.they} (Agent creator, Pronouns and body);
// {n}, {m}, {v} and {t} are filled by the script.
const TEXT={
 next:{d1:'Day 1. Start at Lucky Buck Pawn. Rest in Room 8 at the Starlite when you\'re ready for dark.',
  n1:'Night 1. Follow the tape. Rest in Room 8 to move on to day 2.',
  d2:'Day 2. The bus runs to Wells Avenue and the county building. The pay phone by the motel office has been ringing.',
  d2b:'Day 2. Rest in Room 8 when you\'re ready for the club.',
  n2:'Night 2. Club Satin\'s door is open.',n2b:'Night 2. Find the way under the stage.',home:'Get out of the cold.'},
 phase:['DAY 1 · LATE AFTERNOON','NIGHT 1','DAY 2','NIGHT 2'],
 rewritten:'This case file was rewritten while you were away. Your team starts it over from the briefing, with everything they carry.',
 // ---- the briefing: the shut buffet of a downtown casino ----
 open1:'TUESDAY · 3:10 PM · 27°F',
 open2:'A text from an unlisted number: "DOWNTOWN. THE OLD BUFFET, SECOND FLOOR. IT\'S CLOSED. COME IN ANYWAY."',
 brief:['A casino buffet, shut for good. Sneeze guards over empty steam pans. A row of slot machines asleep along the wall.',['BIG HAT','Agent {code}. Sit. Don\'t look at the carpet too long.'],
  'He\'s at a two-top with a plate of nothing in front of him. One heat lamp is still on, right over his hat.',
  ['BIG HAT','Fourth Street. Reno. There\'s a pawn shop called Lucky Buck with a box by the door. Tapes, five for a dollar.'],
  ['BIG HAT','Week ago a clerk took one home. Somebody wrote WE KNOW on the label. He watched it on a Tuesday.'],
  ['BIG HAT','By Friday he\'d foiled his windows and written the same two words on everything he owns. His fridge. His pillowcase.'],
  ['BIG HAT','The tape\'s a dancer. Club on the same street that closed in \'96. She\'s sick on it. Sores. Movin\' too fast.'],
  ['BIG HAT','Last month a city inspector took a picture inside that club. She\'s in it. Same face.']],
 briefShout:'THIRTY YEARS. SAME FACE.',
 brief2:['He picks up a fork. Puts it down on the empty plate, very gently, like it might wake up.'],
 // Big Hat's two questions (spec 013): the four topics, his two-box answer, the Case file's INTEL line. The edges are in
 // the scripts: intelOn('tape') +10 Search at the pawn shop, 'clerk' Wes opens his door and Empathy +10 with him,
 // 'club' +10 Computers on the club's power (and the records room knows what to pull), 'cover' forgives the first overpay.
 intel:[
  {id:'tape',label:'The tape',answer:['Five-for-a-dollar bin. Somebody wrote on the label. Somebody else believed it.','Manny Saldaña runs the shop. Look in the bin yourself. Manny doesn\'t look in anything he can\'t sell.'],
   note:'The tape came out of Lucky Buck Pawn\'s bargain bin. Look through the bin yourself.'},
  {id:'clerk',label:'The clerk',answer:['Wes Pratt. Twenty-three. Lives over the shop. Foiled his windows Friday.','He won\'t open up for strangers. He\'ll open up for somebody who says his name like they know him.'],
   note:'Wes Pratt, the clerk, lives over the pawn shop. Say his name at his door.'},
  {id:'club',label:'The club',answer:['Club Satin. Closed by the city in March of \'96. Fire inspection.','Here\'s the thing. Somebody\'s still payin\' its light bill. The power\'s on in there.'],
   note:'Club Satin closed in 1996. Its power is still on.'},
  {id:'cover',label:'The cover',answer:['You\'re collectors. Old tapes, old toys, old junk. Collectors are cheap.','You pay a man four figures for a dollar tape, a cop hears about it. Once I can fix. Act like it.'],
   note:'Cover: collectors buying old tapes. Don\'t overpay. (Big Hat covers one slip.)'}],
 brief3:[['BIG HAT','Room 8 at the Starlite Motor Lodge is yours. The heater works if you kick it. Kick it.'],
  ['BIG HAT','Find every copy of that tape. Find out who\'s keepin\' her dancin\'.']],
 brief4:[['BIG HAT','And {first}? Don\'t watch it unless you have to.'],['BIG HAT','I watched about four seconds of it. I\'m gonna be thinkin\' about those four seconds at my funeral.']],
 arrive:'TRACKING. Talk to people with A. Press START for your notebook and party.',
 role:{Investigator:'Five copies for a dollar. Somebody priced that.',Healer:'Sores and speed. I know what that is. I\'ve seen it in the ER.',Analyst:'For the record, people write things on walls in Reno all the time.',
  Vanguard:'Twenty-seven degrees. Who puts a city in a desert and then lets it snow?',Lorekeeper:'A recording that does something to the people who watch it. There are books about that. None of them end well.',
  Tech:'VHS. I can fix a VHS. My dad had a closet full.',Bruiser:'Pawn shops. I know pawn shops.',Support:'Everybody zip your coats. I mean it.',Tracker:'Fresh slush. Everybody on this street walks the same three blocks.',
  Confessor:'A kid alone in a room with foil on the windows. Somebody should knock.',Courier:'I used to deliver on Fourth. Don\'t buy the burritos.',Undertaker:'Thirty years and the same face. I\'d like to see her hands.',
  Scrapper:'Smells like cigarettes and casino carpet. I could live here.',Morale:'There\'s a buffet with a two-ninety-nine breakfast across the street. Just so everybody knows.'},
 roleAny:'Let\'s find the tapes.',
 // ---- doors, the street and the bus ----
 room:n=>`Room ${n}. Do Not Disturb on the knob, and a TV on loud behind it.`,
 office:'The motel office. A bell on the counter, a TV with the sound off, a bowl of mints nobody trusts.',
 pawnShut:'CLOSED. A cage is pulled across the door. A sign in the window: GONE FISHING. DON\'T CALL.',
 clubShut:'Club Satin. A chain through both handles and a padlock gone white with frost.',
 clubQ:'The chain is gone from the club\'s door. It\'s dark in there, and warm. Once you\'re in, you\'re in for the night.',
 casino:'The Paydirt. Warm air and slot bells through the revolving door. A man in a cowboy hat is crying at the dollar slots, happily. The case is out here.',
 westEnd:'Fourth Street runs on toward downtown. Not yet.',
 eastEnd:'Past the casino, the street goes under the freeway. Not yet.',
 back12:'Room 12. Checked out. The maid\'s cart is outside it, and the maid is sitting on the cart, smoking.',
 bus:'BUS STOP',busLook:'Route 12. A bench under a shelter, a schedule behind scratched plastic. Somebody has keyed WE KNOW into the plastic. Small.',busQ:'Where to?',
 busOpt:{gideon:'Ride to Wells Avenue',records:'Ride to the county building',street:'Ride back to Fourth Street'},
 busRide:{gideon:'Ten minutes, two transfers\' worth of heat. Wells Avenue, an apartment over a laundromat.',records:'The county building. The records room is in the basement, under a sign that says RECORDS in a font from 1971.',street:'Back to Fourth Street.'},
 recordsShut:'The county building is closed for the night.',busNight:'The night bus only goes downtown. Wells Avenue can wait for daylight.',
 flyer:'Sweep the shelter',flyerFind:['Under three layers of flyers for a guy who fixes phones, one in careful block capitals:','"GIDEON BUYS VHS. HORROR, HOME MOVIES, ODDITIES. NO PORN. WELLS AVE." A phone number with every tab torn off.'],flyerNone:'Lost cat flyers. The cat\'s name is Kevin.',
 exitBus:'Back out to the bus stop?',exitBusOpts:['Catch the bus','Stay'],
 // ---- turning the day (Turning the day: Go on / Not yet, cursor on Not yet) ----
 bedName:'BED',bedLook:'A motel bed. The spread has cigarette burns in a pattern that is almost a face.',
 restOpt:['Rest till dark','Sleep till morning','Rest till dark'],
 restQ:['Rest till dark? Day 1 ends.','Sleep till morning? Night 1 ends.','Rest till dark? Day 2 ends.'],
 restClose:['Lucky Buck Pawn closes for good. Whatever\'s still in its bin goes to the next man with cash.','Travis checks out of Room 12 and leaves town, with whatever he\'s still got.','The records room closes, and Gideon stops answering his door.'],
 restDeduce:'Not yet. The pay phone out by the office has been ringing all afternoon. You know who it is.',
 rested:[['The sun goes down behind the casinos at a quarter to five.','The neon comes on all at once, like somebody flipped one switch for the whole street.'],
  ['The heater ticks all night. Somebody in Room 7 laughs at the TV at three in the morning.','In the morning there\'s a car with its trunk open outside Room 12. Then there isn\'t.'],
  ['It gets dark early in Reno in winter. Four-forty.','Down the street, the chain on Club Satin\'s door is gone.']],
 restDone:'No more rest. The club\'s waiting.',
 turnOpts:['Go on','Not yet'],gateIn:['Go in','Not yet'],
 // ---- Room 8 and its TV (watch a copy you carry) ----
 tvName:'TV',tvLook:'An old TV on the dresser with a VCR on top. The cable\'s out. The VCR works fine. Of course it does.',tvPlay:'Play a copy you carry',
 tvNone:'You don\'t have a copy you haven\'t already watched.',
 pad:'NOTEPAD',padLook:'A Starlite notepad and a pen on a chain.',padWe:['A Starlite notepad. On the top sheet, in your own handwriting, the same two words, over and over, pressed so hard the pen went through.','You don\'t remember writing it. You tear the sheet off. The one under it says it too.'],
 heater:'A wall heater that clanks like a radiator. You kick it. It works.',
 // ---- watching the tape (each watch: a clip, a horror, a step of the tracking lines, one thing nothing else gives) ----
 watchOpt:'Watch it',watchQ:'Watch the tape? It gets in. Everybody who watched it says so.',watchOpts:['Watch it','Not yet'],
 watchIn:['You push the tape in. The VCR thinks about it. Then it takes the tape the way a dog takes a pill.','Snow. Then the picture rolls once and steadies.'],
 watch1:['A stage, a pole, one pink light. A woman dancing. She\'s thin as a coat hanger and she\'s the best thing you\'ve ever seen.','Her arms are covered in sores. She moves too fast. Not quick. Too fast, like frames are missing.',
  'Behind the camera, a man is chanting. Low, the same few words over and over, like a man saying a rosary he doesn\'t believe.','Once, between the words, very close to the microphone, he says his own name. Like a signature. "Royce."'],
 watch2:['The same stage. The same pink light. Then the picture jumps, and it isn\'t 1996 anymore.','Chairs upside down on the tables. Dust on everything, thick as felt. The club tonight. The club right now.',
  'And her, on the floor, in the dark, dancing. When the lamp on the bar flickers, she flinches out of it like it\'s hot.'],
 watch3:['The picture fills with the tape\'s own label, close up, like somebody held it to the lens.','WE KNOW, in marker. Under it, where the sticker\'s peeled, an older label: CLUB SATIN 3/96 · MASTER · UNDER THE STAGE.',
  'Clipped to it, a scrap of paper ruled like an old ledger. A number in the corner: 5. Then snow.'],
 watch4:['The master. The picture is clean, the way the first copy of anything is.','She stops dancing. She turns all the way around to the camera, to you, and her mouth makes a word.','"Darlene."'],
 watchMore:['The same stage, the same pink light, the same woman. You know where she\'ll turn before she turns.','That\'s worse. You watch it to the end anyway.'],
 watchOut:'The tape ends. The TV goes to blue. You sit there a while. It feels like the room is looking at the back of your neck.',
 watchH:'Watching the tape',
 wwe:'Two words come into your head and sit down like they paid for the seat.',
 watched:'You\'ve watched this one.',
 // ---- burning and erasing the copies ----
 barrel:'BURN BARREL',barrelLook:'An oil drum with holes punched in it, a fire going inside. The long-stays keep it lit all winter. It smells like pallets and somebody\'s shoe.',
 burnOpt:'Burn the copies you carry',burnDo:['You feed them in one at a time. The plastic goes soft and black and the tape curls out of the cases like something trying to get away.','It smells awful. A long-stay warming his hands moves to the other side of the barrel and doesn\'t say anything.'],
 burnNone:'You don\'t have any copies on you.',
 eraseDo:'You run the eraser over each copy. It hums like a hornet in a jar. Somewhere, very faintly, something stops listening.',
 // ---- the pay phone (the deduction, day 2) ----
 phone:'PAY PHONE',phoneLook:'A pay phone on a post. The cord\'s too short to stand up straight. The receiver is warm, like somebody just hung up.',
 phoneRing:'It\'s ringing. It\'s been ringing. You pick up.',
 phoneHi:[['BIG HAT','You\'re on a pay phone. That\'s good. Nobody can trace a pay phone in Reno. Nobody can even find one.'],['BIG HAT','Who\'s keepin\' that girl dancin\'?']],
 deduceOpts:['Nobody. It\'s a haunted tape. Burn the copies and go home.','The people watching it. The tape\'s the working, and Kettering made it.','Kettering\'s a ghost. He died when they closed the club.'],
 hunch:'The tape gets watched, and she gets one more night. Who keeps watching? Who keeps selling it?',
 dRight:[['BIG HAT','The watchin\'.'],['BIG HAT','So every set of eyes on that tape is a night she don\'t get to quit. And the man who made it keeps it movin\'.'],
  ['BIG HAT','I\'m sendin\' you somethin\'. Big, ugly, plugs into a wall. Run it over a tape and the tape forgets everything it ever knew.'],'An hour later a boy on a bike drops a pink gift bag outside Room 8 and pedals off like it bit him.'],
 dNoProof:[['BIG HAT','The watchin\'. Maybe. You got anything that says so besides a feelin\'?'],['BIG HAT','Bring me paper on that club and the man who made it. Then I\'ll spend money.']],
 dWrong:[['BIG HAT','A haunted tape.'],['BIG HAT','Then who\'s payin\' the light bill on a club that closed thirty years ago, {first}? The tape?'],'He hangs up. You spend the next hour on the phone with Records getting told the same thing in a worse voice. It costs you the afternoon.'],
 dGhost:[['BIG HAT','A ghost.'],['BIG HAT','Fine. Ghosts don\'t buy tapes, so stop lookin\' for him. Look for her.'],'He hangs up. You\'ve told him the man\'s dead. Whatever\'s in Room 7, you\'re not knocking on it now.'],
 phoneAfter:'The pay phone. Dial tone, and under it, very faint, somebody breathing in time with you.',
 // ---- Lucky Buck Pawn and Manny ----
 manny1:[['MANNY','Lucky Buck. Manny. What are you buyin\', what are you sellin\'?'],'He looks at you through the loupe like you\'re a watch somebody\'s trying to pass off as gold.'],
 mannyAsk:'Ask about the WE KNOW tape',mannyAskDo:[['MANNY','Information is a dollar. Same as the tapes. I\'m consistent.'],'You give him a dollar. He holds it up to the window.',
  ['MANNY','Kid who works the counter for me, Wes. Lives upstairs. He took one home out of the bin last week, I said take it, it\'s a dime.'],['MANNY','Now he don\'t come down. I hear him up there at night. Pacing. Writing on stuff. Tell him Manny says the rent\'s still due.']],
 mannyQuiet:[['MANNY','I don\'t know nothin\' about no tape. I sell drills.'],'He says it to the drills. Somebody\'s been asking around about you, and Manny heard.'],
 mannyAfter:[['MANNY','You buyin\' or you just keepin\' warm?']],
 mannyBuy:'Buy the tape in the bin',mannyBuyDo:[['MANNY','That one? Somebody already wrote on it. Twenty-five cents.'],['MANNY','Second guy this week wants that box. Old man. Paid cash for the last one, didn\'t even look at it.']],
 mannyCut:'Sell Manny the tapes (take the cut)',mannyCutPitch:[['MANNY','Hold on. That\'s the one? With the writing?'],['MANNY','Listen. Collectors pay four figures for cursed stuff. On the internet. I got a guy in Phoenix.'],['MANNY','You sell \'em to me, I cut you in. That\'s not a bribe, that\'s commerce.']],
 mannyCutDo:['You hand them over. Manny wraps them in a Paydirt cocktail napkin like jewelry.',['MANNY','Pleasure. Here. Carton of smokes on the house. I\'ll mail you your end.'],'He won\'t. You both know it. It feels great anyway, which is the worst part.'],
 mannyNo:'Keep them',mannyNoDo:[['MANNY','Your loss. Phoenix pays good.']],
 bin:'THE BIN',binLook:'A box by the door. TAPES 5 FOR $1. Movies, a workout tape, home videos nobody wanted. A birthday party labeled NANA\'S 80TH, DON\'T TAPE OVER.',
 binFind:['Under the workout tape and NANA\'S 80TH, one more, the label written over in black marker: WE KNOW.','Taped inside the box flap, the shop\'s carbon: "WES · 1 TAPE · .10 · 11/14." And under it, in pencil: "OLD MAN, ROOM 7, WANTS ANY MORE."'],
 binNone:'Tapes. Tapes. A tape of somebody\'s wedding, both of them very young and very sure.',
 binGone:'A box of tapes nobody wants. The WE KNOW one isn\'t in it anymore.',
 log:'Read the pawn log',logDo:['The pawn log is a spiral notebook with coffee on every page. Last Thursday: "Wes took 1 out of the dollar box, no charge, employee."','Two lines down, in different ink: "R.K. · Starlite · buying any more like it. Cash."'],
 cBin:'Wes Pratt, the clerk who lives over Lucky Buck, took a WE KNOW tape home out of the bin. An old man at the Starlite wants any more like it.',
 cBinKo:'Officer Ko says the kid over the pawn shop is Wes Pratt, and he hasn\'t come down since Friday.',
 pawntv:'A TV and a VCR on the counter, for testing tapes before you buy. Wes played it here first. The screen still has a ghost on it, faint, like a burn.',
 glass:'The glass counter. Watches, rings, a class ring from 1979, a pistol with a tag that says AS IS.',
 shelf:'Shelves of drills, lamps and somebody\'s bowling trophies. Third place, every year, 1988 to 1994.',
 // ---- Wes ----
 wesKnock:'Knock on Wes\'s door',wesShut:['You knock. Inside, somebody stops moving.','Nobody comes. Under the door, the blue of a TV playing nothing.'],
 wesName:'Say his name like you know him',wesNameDo:['"Wes. It\'s okay. Manny sent us."','A long wait. Then three locks, one after the other.'],
 wesForce:'The stair door gives. Down the street, a man scraping his windshield stops scraping.',
 wes1:[['WES','Close the door. Close it. Okay.'],['WES','You can see it too, right? The way they look at you? Through stuff?'],'His fingers are black with marker up to the second knuckle.'],
 wesWalls:['Foil on both windows, taped edge to edge. The light comes through it the color of a dentist\'s office.','WE KNOW on the walls. On the fridge. On the lampshade. On the bottom of a cereal bowl in the sink.','Some of it\'s big. Some of it is tiny, like he was trying to fit it somewhere they wouldn\'t look. All of it\'s his.'],
 wesWallsH:'Wes\'s walls',
 wesTalk:[['WES','I didn\'t even like it. It\'s a girl dancing. I watched it to see if it was, like, a snuff thing. It\'s not.'],['WES','It\'s worse. Because after, you know they know. Everybody. What you did. All of it.'],
  ['WES','Manny got it in a box lot. Guy from the Starlite sold him a whole box, Room 12. Travis. He said he\'s got another one. He said he watched his twice.'],['WES','Twice. Man.']],
 cWes:'Wes got the tape from a box lot sold by Travis Boone, Room 12 at the Starlite. Travis has another copy and has watched it twice.',
 cWesLuz:'Luz at the Starlite desk says Room 12 watches TV all night with the sound off. Travis Boone. He sold Manny a box of tapes.',
 wesSweep:['In the VCR\'s sleeve, folded small, Manny\'s receipt for the box lot: "BOX VHS · T. BOONE · STARLITE #12 · $4."'],
 wesQuiet:[['WES','I\'m not supposed to talk about it. They know when I talk about it.']],
 wesAfter:[['WES','I\'m okay. I\'m okay. Don\'t look at the windows.']],
 wesHelp:'He\'s a week in. There\'s a bandage on his left wrist he keeps tugging his sleeve over.',
 wesStay:'Stay with him through the night',wesStayQ:'Stay with Wes through the night? Night 1 ends.',
 wesStayDo:[['{m}','I\'ve watched worse things than that tape. Come on.'],'You sit with him on the floor with your backs to the foil. He talks about his sister, about a dog they had, about a job at a car wash he liked.',
  'Around four he falls asleep sitting up. You don\'t. In the morning he takes one corner of the foil down himself, and looks at the snow.'],
 wesSister:'Call his sister in Sparks',wesSisterDo:['You get the number off a birthday card on the fridge. His sister picks up on the second ring and says "Is he okay" before you say who you are.','She\'s there in twenty minutes in a minivan with the engine still running. She doesn\'t look at the walls. She just puts her coat on him.'],
 wesCalm:'Talk him down',wesCalmDo:['You get him to sit. You get him to drink a glass of water, then another. You tell him what it is, as much as you can, in words that aren\'t crazy.','"So it\'s not me," he says. "It\'s not me." He says it until he believes it. He gives you the bandaged wrist to look at, like a kid.'],
 wesFail:'He looks at you like you\'re one of them. "You can\'t know that," he says. "Nobody can know that."',
 wesSaved:[['WES','My sister\'s gonna make me go to a doctor. Like a real one.'],['WES','Take the tape. Please. I keep putting it back in.']],
 wesTV:'WES\'S TV',wesTVLook:'The TV\'s off. The tape is still in the VCR, half pushed in, like he tried to stop himself.',wesTVEmpty:'The TV\'s off. The VCR is empty, and Wes has put a dish towel over it anyway.',
 wesTake:'Take the tape',wesTakeDo:'You ease it out of the VCR. Wes watches your hands the whole time and doesn\'t say no.',
 wesSweepOpt:'Check the VCR sleeve',
 mattressW:'A mattress on the floor. The sheet has WE KNOW on it in marker, both sides.',fridge:'WE KNOW on the fridge door. Inside, mustard and a Paydirt keno pencil.',
 // ---- the hidden hotspot: only there while the lead is High on Mushrooms ----
 foilName:'THE FOIL',
 foilLook:['The foil on the window isn\'t foil. It\'s eyes. Not painted: caught in the crinkles, hundreds of them, all looking in.','One row of them blinks, slow, in time with something. You count it. It\'s the rolling bar on a tape.',
  'On the sill under it, in Wes\'s handwriting, small, the only thing in the room that isn\'t WE KNOW: "4TH ST · UNDER THE STAGE."'],
 foilH:'The eyes in the foil',cUnder:'There\'s a room under Club Satin\'s stage. The tape knows it\'s there. Behind the stage, a way down.',
 // ---- the Starlite: Luz, Room 12, Room 7 ----
 luz1:[['LUZ','You\'re in 8. Ice machine\'s broken. Don\'t ask me about 7.'],'The bird on her shoulder says "Don\'t ask me about 7."'],
 luzTwelve:[['LUZ','Twelve? Travis. Nice kid when he\'s eating. He watches TV all night with the sound off.'],['LUZ','Sold Manny a whole box of tapes for gas money. Kept one. Said it was "his." Pancho, don\'t.'],'Pancho says "his."'],
 luzQuiet:[['LUZ','I don\'t know you. I don\'t know my guests. That\'s the whole job.'],'Somebody told her you\'re paying too much for junk. She\'s smoking at you now.'],
 luzSeven:'Ask about Room 7',luzSevenDo:[['LUZ','Mr. Royce. Pays by the month, cash, since before I worked here. Old man. Polite.'],['LUZ','Buys tapes off anybody comes through. Pays good. Asks for one kind. He thinks I don\'t notice what kind.'],
  ['LUZ','Real name\'s on the card in the drawer. Kettering. Don\'t tell him I said.'],'Pancho says "Kettering," in a voice that isn\'t Luz\'s. It\'s an old man\'s voice.'],
 luzSevenNo:'She blows smoke at the ice machine. "I said don\'t ask me about 7."',
 luzAfter:[['LUZ','Coffee\'s in the office. It\'s free because it\'s bad.']],
 luzNight2:[['LUZ','You\'re going to that club. Everybody that goes to that club looks like you do.'],['LUZ','Bring my bird back a french fry.']],
 r12Shut:['You knock. Through the door, a TV, no sound. The blue light under the door changes and changes.',['TRAVIS','I\'m not buying anything.']],
 r12Force:'The door pops. Luz looks up from the office. Pancho says "pop."',
 travis1:[['TRAVIS','Who told you twelve? Wes? Wes is a good kid. Wes needs to sleep.'],['TRAVIS','I\'m checkin\' out tomorrow. Bus to Sacramento. Then I\'m done.']],
 travisTalk:'Get him talking',travisMeds:'Give him something for the shakes',
 travisTell:['He sits on the bed. He rolls his sleeves up without being asked, like he\'s been waiting for somebody to ask.','Sores, up both arms. Not like a user\'s. Round and neat, like hers on the tape. Like somebody pressed a cigarette into him and then waited.',
  ['TRAVIS','Twice. I watched it twice. First time I was high. Second time I wanted to see if it was real.'],['TRAVIS','Guy at the plasma center gave it to me. Said it was his and it was too much for him.'],
  ['TRAVIS','Take it. It\'s under the mattress. And there\'s a guy on Wells Avenue buys these. Gideon. Collector. He\'s got two, he told me. He wanted mine.']],
 travisArms:'Travis\'s arms',
 travisFail:'He laughs at you, not mean. "You sound like my mom." He turns the TV up. It\'s on mute.',
 travisWait:'Wait for him to go out (costs time)',travisWaitDo:['You sit in the Starlite\'s office for two hours drinking Luz\'s bad coffee until Travis goes to the gas station for cigarettes.','Under the mattress, a tape. On the nightstand, a business card: GIDEON MARSH · I BUY VHS · WELLS AVE.'],
 travisSweep:['You lift the mattress while he watches. He doesn\'t stop you. A tape, WE KNOW on the label, and a business card: GIDEON MARSH · I BUY VHS · WELLS AVE.',['TRAVIS','Yeah. Take it. Take the card too.']],
 cTravis:'Travis had a copy from the plasma center and watched it twice; it\'s left marks on him. A collector named Gideon on Wells Avenue has more.',
 cTravisFly:'A flyer at the bus stop: GIDEON BUYS VHS, WELLS AVE.',
 travisAfter:[['TRAVIS','Sacramento. My cousin has a couch.']],
 bed12:'A bed with the sheets pulled up over the window, under the foil.',hotplate:'A hot plate with a pan of something gone hard. Ramen, maybe. Hope.',
 tv12:'TRAVIS\'S TV',tv12Look:'A TV playing snow on mute. Travis says it\'s company.',
 standName:'NIGHTSTAND',standLook:'A nightstand. A Bible in the drawer, the kind motels get free, and something under it.',standOpt:'Look under the Bible',
 standFind:['A little paper baggie of dried mushroom caps. "Leftovers," Travis says, if he\'s there. "I\'m done. I mean it."'],
 // Room 7 (Kettering)
 r7Shut:'Room 7. The curtains are shut and the TV\'s on loud. A game show. Somebody\'s winning a boat.',
 r7Gone:'Room 7\'s door is propped open. The bed\'s stripped. The maid says he checked out at noon, paid cash, left a dollar on the pillow.',
 r7Closed:'Room 7. You told Big Hat the man in here is dead. You keep walking.',
 royceName:'ROOM 7',royceLook:'Room 7. The TV\'s loud. The peephole goes dark when you step up to it. He\'s looking.',
 royce1:[['ROYCE','You\'re the collectors. Luz said.'],'An old man in a corduroy jacket, tinted glasses gone amber. Behind him, stacked on the dresser, VHS tapes with handwritten labels.',
  ['ROYCE','I collect too. One title. You can understand that.']],
 royceLean:'Make him talk',royceSneak:'Wait till he goes for ice',royceLeave:'Leave him',
 royceTalk:[['ROYCE','She asked for it. You understand? She wanted one more year. She signed for it. I just kept the tape rolling.'],
  ['ROYCE','People watch, she dances. That\'s the arrangement. It\'s getting thin now. Same few people watching. It needs fresh eyes.'],
  ['ROYCE','Fine. Take them. Take them all. I\'m seventy-four. I\'m tired of the stairs.'],'He hands you a grocery bag of tapes.',
  ['ROYCE','The chant\'s in a notebook, under the stage. Say it backward and she stops. I never did. I liked watching her too much.']],
 royceSneakDo:['At 1:10 he shuffles out in slippers with a plastic bucket for the ice machine, which is broken. He knows it\'s broken. He goes anyway.','You\'re in and out in ninety seconds. A grocery bag of tapes, and a page torn from an old paperback, a chant underlined, with "BACKWARD TO UNDO" in the margin in the same hand as the labels.'],
 royceForce:'The door gives. Down the row, Luz says "hey" and Pancho says "hey."',
 royceFail:'He shuts the door gently in your face. The chain stays on. The game show audience cheers.',
 royceSneakFail:'He doesn\'t go for ice. He sits in the window with the curtain an inch open, watching you watch him.',
 royceLeft:'You leave him to his TV.',
 r7Trash:'Room 7\'s trash, out by the door',r7TrashLook:'A trash can by Room 7, overflowing. Frost on the lid.',
 r7TrashDo:['A money-order stub: "R. KETTERING." Eleven padded envelopes, empty, addressed in the same hand to towns you\'ve never heard of.','And Manny\'s receipts. Dollar tapes, one at a time, for a year.'],
 r7TrashNone:'Coffee grounds and a frozen egg roll.',
 cRoyce:'Royce Kettering, who ran Club Satin, is alive: "Mr. Royce," Room 7 at the Starlite. He buys up the copies and mails them out.',
 cRoyceTape:'On the tape the man chanting behind the camera says his own name: Royce. Luz has a "Mr. Royce" in Room 7.',
 cRoyceGid:'Gideon\'s notes: an old man, "R.K., Starlite Motor Lodge," calls every week to buy his copies.',
 // ---- Officer Ko ----
 teri1:[['OFFICER KO','Evening.'],['OFFICER KO','You\'re the ones buying up junk. Manny told me. Manny tells me everything, it\'s like having a parrot.']],
 teriAsk:'Ask about the kid over the pawn shop',teriAskDo:[['OFFICER KO','Wes Pratt? Foil on the windows. Landlord called it in Saturday.'],['OFFICER KO','I knocked. He said through the door that I already knew. Knew what, I said. He said, "Everything."'],['OFFICER KO','If you\'re friends of his, go up there. Say his name. He opens for his name.']],
 teriAfter:[['OFFICER KO','Stay warm. Stay legal. In that order.']],
 teriTrail:[['OFFICER KO','Just walking. It\'s a free sidewalk.'],'She\'s been about forty feet behind you all night.'],
 // ---- the bus stop: Cherry ----
 cherry1:[['CHERRY','I\'m on my break, hon. Fifteen minutes and I\'m back on my feet.'],['CHERRY','See that club down there with the dead sign? Club Satin. I danced there. Two years. \'94, \'95.'],['CHERRY','Don\'t look at me like that. I was good. I was second best on that street.']],
 cherryAsk:'Ask who was best',
 cherryTell:[['CHERRY','Vesper. That was her stage name. Her real name was Darlene. Darlene Fisk. Out of Elko.'],['CHERRY','She was sick at the end. Everybody knew what with. She didn\'t care. All she wanted was to keep dancing.'],
  ['CHERRY','Royce kept a room under the stage. Dubbed his tapes down there. Wouldn\'t let any of us in.'],['CHERRY','Last month I walked by and the lights were on in there. I didn\'t stop. I\'m fifty-eight. I don\'t stop anymore.']],
 cCherry:'Vesper\'s real name was Darlene Fisk. She wanted to keep dancing. Royce dubbed his tapes in a room under the stage.',
 cCherryPhoto:'The inspector\'s caption under the photo: "UNIDENTIFIED FEMALE (D. FISK? SEE 1996 FILE)." Darlene Fisk.',
 cherryFail:'"Honey, I been asked worse by better," she says, and looks at her watch.',
 cherryAfter:[['CHERRY','Bring me back her name, if you find it on anything. I\'d like to see it written down.']],
 // ---- Gideon ----
 gideon1:[['GIDEON','Gloves, please, if you\'re going to touch anything.'],['GIDEON','I don\'t sell. I keep. That\'s the difference between us.'],'His nephew is on the couch watching you. His nephew\'s friend is on the arm of the couch, also watching you. Both of them are very interested in their bat.'],
 gideonLean:'Tell him what it is',gideonTalk:'Talk shop',gideonCash:'Make him an offer',gideonTake:'Take the tape anyway',gideonDB:'Look at his catalog',gideonNotes:'Read his notes',
 gideonLeanDo:[['GIDEON','...Two people I sold copies to are dead. Did you know that? I know that.'],['GIDEON','Take it. And the notes. I don\'t want to keep this one anymore. That\'s a first.']],
 gideonTalkDo:[['GIDEON','Fine. You can look. You can\'t have.'],['GIDEON','Dubbed at Club Satin, March 1996. Five copies off one master. I\'ve found two in eleven years. I sold one.'],['GIDEON','You can watch it here, on my set. In the chair. Nobody leaves with it.']],
 gideonNotesDo:['His notes are in a binder with tabs. CLUB SATIN, MARCH 1996: FIVE DUBS OFF ONE MASTER, MADE ON THE PREMISES THE NIGHT BEFORE THE CITY CLOSED IT.','A sticky note on the tab: "R.K., STARLITE MOTOR LODGE. CALLS EVERY WEEK. WANTS BOTH. DO NOT SELL TO R.K."'],
 gideonDBDo:['His catalog runs on a laptop old enough to vote. Entry 4,112: SATIN (WE KNOW). Five dubs, one master, March 1996. Location of master: "the club?"','In the notes field: "R.K., Starlite, keeps calling. Do not sell to R.K."'],
 gideonCashDo:['You put down more money than a VHS tape has ever been worth. Gideon looks at it like it\'s a tape he hasn\'t got.',['GIDEON','...This is the vulgarest thing that\'s ever happened in this apartment. Take it.']],
 gideonNo:'"No," he says, pleasantly, and nods at his nephew.',
 cGideon:'Gideon\'s notes: five copies were dubbed off one master at Club Satin in March 1996, the night before the city closed it.',
 cGideonLic:'Club Satin\'s 1995 business license lists a sideline: "VIDEO SERVICES (DUPLICATION)." Royce Kettering, owner.',
 nephewIntro:'Dale and Kyle Q. get up off the couch!',nephewName:'DALE',buddyName:'KYLE Q.',
 dale:[['DALE','Uncle Gideon says don\'t touch nothing. So don\'t touch nothing.']],kyle:[['KYLE Q.','I\'m just here for the couch, man.']],
 nephewDone:['Dale sits down on the floor and holds his nose. Kyle Q. is in the bathroom with the door locked, telling his mom on the phone.',['GIDEON','Take it. Take the notes too. Just go before Dale cries. He\'s a crier.']],
 gideonAfter:[['GIDEON','White gloves. Even for the door.']],
 gidTV:'GIDEON\'S TVS',gidTVLook:'Two TVs stacked, both playing snow with the sound down, and a viewing chair worn shiny at the arms.',
 tapes:'Tapes. Thousands. Every spine labeled in the same careful hand. One whole shelf is just weather reports.',recliner:'The viewing chair, the arms worn shiny. It faces the two TVs like a pew.',
 // ---- county records: Ines ----
 ines1:[['INES','Records. Fill out a slip, I\'ll pull a box.'],'She takes a pencil out of her hair to give you, then another out of her pocket, then a third from behind her ear, in case.',['INES','We close at five. Sharp.']],
 inesWhat:[['INES','For what, though? I need a name, an address, a year. "Spooky stuff" isn\'t a box.']],
 inesChief:[['INES','Officer Kowalczyk called down. I\'m not supposed to pull anything for you today.'],'She says it to the slip pad, not to you.'],
 inesOpts:{paper:'Fill out the slips right',crack:'Search the microfiche',creds:'Show her a badge',sweep:'Go through the boxes yourself (costs time)',wait:'Fill out a slip and wait (costs time)',talk:'Talk her into it'},
 inesWait:['You fill out a slip. She stamps it. You sit in a plastic chair under a clock that ticks loud enough to argue with.','At four-ten she comes back with a box.'],
 inesSweep:['You go through FIRE INSP. 1990-1999 yourself, box by box, while Ines watches you like you\'re reshelving her children.','It\'s in the last box. Of course it is.'],
 inesCreds:['You put a badge on her counter. She looks at it a long time. She looks at you longer.','Then she gets the box herself, fast, and says loud enough for the whole basement: "FEDERAL REQUEST."'],
 photo:['A city inspection file, last month: CLUB SATIN, 4TH ST. POWER ON AT A CLOSED PREMISES. INSPECTOR\'S NOTES ATTACHED.','Clipped inside, a flash photo of a dark dance floor. Dust. Chairs on the tables.','In the middle of it, caught mid-turn, a woman in a pink leotard. Thin. Sores on her arms. The same face as the tape.',
  'Behind the stage in the photo, an open square in the floor. The inspector wrote: "TRAPDOOR? DID NOT GO DOWN. DID NOT FEEL GOOD."'],
 photoH:'The inspector\'s photo',
 cPhoto:'An inspector\'s photo from last month: Vesper on Club Satin\'s dark dance floor, the same face as the tape. A trapdoor behind the stage.',
 cameo:['At the edge of the flash, past the bar, a tall man in a long coat stands with his eyes closed. You didn\'t see him the first time you looked.','You look again. It\'s a coat on a hook.'],
 cameoH:'Someone at the edge of the flash',cameoNo:'At the edge of the flash, past the bar, a coat on a hook.',
 inesCaption:'Read the inspector\'s caption',inesLicense:'Pull the club\'s business license',
 inesAfter:[['INES','Five o\'clock. I\'m not kidding about five o\'clock.']],
 fiche:'A microfiche reader, humming. It smells hot.',stacks:'Shelves of file boxes. FIRE INSP. 1990-1999. Somebody has drawn a little skull on 1996.',
 // ---- Club Satin: night 2, the danger zone ----
 club1:['Inside it\'s warm. Too warm. The heat is on in a building that closed in 1996.','Dust on everything, thick as felt. Chairs upside down on the tables. A pink light over the stage, buzzing, on.',
  'Out on the dance floor, in the dark past the light, somebody is dancing. You can\'t see her. You can hear her heels. Fast. Too fast.'],
 club1H:'Her heels on the dance floor',
 clubChief:['Two flashlight beams cross the lobby. Officer Ko and a big sergeant who looks like he\'d rather be anywhere.',['OFFICER KO','We walked it already. It\'s empty. It\'s a fire hazard. I pulled the main breaker.'],['OFFICER KO','Whatever you\'re doing, do it before my shift ends.'],'They leave. The pink light over the stage keeps buzzing anyway.'],
 regular1:['By the coat check, a man in a long overcoat and a hat stands where you\'d stand to watch the stage. He\'s been standing there a long time.','He turns around. Under the hat there isn\'t a face. There\'s snow, like a TV with nothing on, and two pale dots in it, looking at you.'],
 regularIntro:'The Regular steps away from the coat check!',
 regularSay:['THE REGULAR','WE KNOW.'],regularSan:'The Regular says it in every voice you\'ve ever lied to. WE KNOW.',
 regularDone:'The overcoat folds onto the carpet, empty. The hat rolls. For a second the floor where it fell shows snow, then just carpet.',
 dj:'DJ BOOTH',djLook:'The DJ booth. Two turntables, a VCR, a microphone on a bent arm. A breaker panel on the wall behind, its door hanging open.',
 djLights:'Wake the stage lights',djFix:'Rewire the panel',djChief:'The main breaker\'s pulled and zip-tied, with a Reno PD tag on it.',
 djOn:['The panel clunks. Up in the ceiling, one by one, the stage lights come on: white, steady, the first steady light in this room in thirty years.','Out on the floor, something hisses like a tape eating itself and pulls back into the dark at the edges.','In the light, behind the stage, you can see the seam of a square in the floor.'],
 djFail:'Sparks. Everything goes dark for a second, then back to the one buzzing pink light.',
 djDone:'The stage lights are on. Steady. Something out on the edges doesn\'t like it.',
 bar:'BAR',barLook:'The bar. Bottles with an inch of something left, under an inch of dust.',barTake:'Reach behind the bar',
 barFind:'Behind the bar, under the register, a VHS tape in a cocktail napkin. WE KNOW. Somebody\'s been watching it in here.',barEmpty:'Behind the bar: dust, and a cocktail napkin folded around nothing.',
 booth:'A booth in red vinyl, split along every seam. A lipstick print on a glass that hasn\'t moved since 1996.',
 coat:'COAT CHECK',coatLook:'The coat check. One coat still on its hanger, and a gift bag with tissue paper behind the counter.',coatOpen:'Open the gift bag',
 coatBox:'In a pink gift bag behind the coat check, under tissue paper and a card that says GET WELL SOON in Big Hat\'s handwriting:',
 tables:'Chairs stacked upside down on the tables. Somebody\'s left a tip under one. Two dollars, 1996 money.',
 stage:'The stage. A pole, top to bottom, the chrome gone cloudy except for a band at hand height, rubbed bright.',
 hall:'A back room. The door\'s swollen shut. Under it, the smell of old perfume and older cigarettes.',
 trap:'BEHIND THE STAGE',trapLook:'Behind the stage, a curtain nailed down to the floor. The floor under it sounds hollow when you step.',
 trapSweep:'Pull the curtain up',trapForce:'Pry up the boards',trapFeel:'Feel along the floor in the dark (costs time)',
 trapFound:'Under the curtain, a trapdoor with a ring pull, the ring worn bright. Stairs go down to a room full of humming.',
 trapFail:'Boards, boards, a quarter, more boards.',
 trapFeelDo:'You crawl the floor behind the stage on your hands and knees, in the dust, for most of an hour, until your fingers find a ring.',
 trapQ:'Stairs go down to a room full of humming and blue light. Down there, you\'ll be close to her.',
 dubOut:'Climb back up to the club?',dubOutOpts:['Climb up','Stay'],
 // ---- the dub room: the finale area ----
 dub1:['A room under the stage, low enough to touch the ceiling. A wall of VCRs and TVs wired together, dozens, every one of them on, every one playing the same snow.',
  'You step off the stairs and every screen turns to you. Not the snow on them. The screens. On their stands, all at once, with a sound like a crowd sitting up.'],
 dub1H:'Every screen turning toward you',
 vespLook:['She dances at the end of the screens, in their blue light. Thin. Sores. The same face. She doesn\'t look tired. She looks like she\'s never been anything but this.'],
 vespName:'VESPER',vespSay:'Say her name',vespSayDo:['"Darlene."','She misses a step. Just one. For a second her face is a woman\'s face from Elko, embarrassed, like somebody called her by her name at work.'],
 bossQ:'She won\'t stop dancing. Somebody has to stop her. Once you start, you finish it.',bossOpts:['Go in','Not yet'],
 bench:'BENCH',benchLook:'A workbench. One deck sits apart from the others, a tape in it, the label written over twice. The master.',benchGone:'A workbench. The deck is open and empty. Its sleeve is on the bench, torn open. Somebody got here first.',
 masterGone:['The master\'s deck is open and empty. Wet footprints on the stairs, an old man\'s slippers. A taxi idles outside, then doesn\'t.','Kettering got here first.'],
 notebook:'NOTEBOOK',notebookLook:'A notebook. Every page in the same hand, the same words, written backward.',
 readOpt:'Read the chant backward',readId:'Work out what it\'s for',readDo:['You read it out loud, backward, the way he never did. The words feel like walking down stairs in the dark.','Every screen on the wall flickers at once. At the end of the row, she stumbles, and catches herself, and keeps dancing slower.'],
 readFail:'The words go sideways in your mouth. You lose your place and the screens hiss.',readDone:'The notebook, open to the chant. You\'ve read it backward. Something in the room is listening less.',
 vcrs:'VCRs, dozens, wired together. Every one of them is on. Every one is watching you back.',
 // ---- the boss ----
 boss1:['The music starts. There isn\'t any music. She dances anyway, and the screens light up all at once with her, every frame of her, from every side.',['VESPER','You watched me.'],['VESPER','Everybody watches me. That\'s the deal.']],
 bossNamed:['VESPER','...Darlene. Nobody calls me Darlene.'],
 bossIntro:'Vesper dances out of the blue light!',
 bossThin:'She looks thinner than she should. What you did this case is telling on her.',
 bossIdent:'You know what she hates. You saw her flinch from a lamp on the tape. Steady light hurts her.',
 bossLit:'Under the stage lights coming through the floorboards, she slows. You can follow her now.',
 bossFast:'She\'s too fast to follow. You\'re hitting where she was.',
 bossAll:'The rolling bar sweeps the room. Every screen tears sideways at once!',
 bossSan:'She turns to the camera that isn\'t there. WE KNOW, says every TV in the room.',
 bossEncore:'Somewhere a copy of the tape is playing. She stands up straighter. She heals {v}.',
 bossPhase:'The Audience comes through. Every sore on her opens like an eye, and every eye is looking at you.',
 bossPhaseNamed:'The Audience comes through. Every sore on her opens like an eye. But she\'s heard her name, and she won\'t go any faster for them.',
 bossReadDie:'stops dancing, mid-spin, and stands there breathing, and says "thank you" in a voice from Elko',
 bossDie:'comes apart into tape ribbon and snow, still turning',
 // ---- overstepping: Ko (Local chief), Big Hat's call (Agency call), the clean-up crew (Federal agents) ----
 noticed:['A text from Big Hat: "SOMEBODY ON FOURTH STREET IS TALKIN ABOUT YOU. QUIT IT."'],
 chief:[['OFFICER KO','Hey. Collectors.'],['OFFICER KO','I\'ve got a pawn shop owner, a motel clerk and a bird telling me about you. Whatever you\'re really doing, I\'m going to be around for it.'],
  ['OFFICER KO','County building already knows your faces. Don\'t make me learn your names.']],
 call:['Your phone buzzes. Unknown number. You know who it is.',['BIG HAT','I am hearin\' about you on a Reno police scanner, {first}. Reno. They don\'t even listen to their own scanners.'],['BIG HAT','Don\'t ask for anything next time. You won\'t get it.']],
 feds:['Black cars at the curb with their headlights off. Four doors open at the same time.',['CLEAN-UP','Black Lantern. You\'re done here. Hand over the tapes.'],['CLEAN-UP','Everybody on this street\'s already seen too much. Don\'t make it five more.']],
 fedsIntro:'The clean-up crew draws down!',
 fedsWin:['The black cars leave the way they came, one short.','By morning Club Satin has a fence around it and a sign that says ASBESTOS ABATEMENT.','Nobody asks what was on the tape. Nobody ever will.'],
 overpay:'Big Hat said once he could fix. He fixes it: nobody hears about the money.',
 // ---- the ending ----
 end1:['She stops. The screens stop. For the first time since you came down the stairs, the room is quiet enough to hear the furnace.','Where she was dancing, there\'s a heap of tape ribbon and a pair of shoes, very small, side by side.'],
 end1Read:['She stops. She stands there, breathing like a person, in the blue light, and looks down at her arms.',['DARLENE','Thank you.'],'Then she\'s ribbon and dust, settling, and a pair of shoes side by side.'],
 erase:'You take the master out of its deck and run it under the eraser, slow, end to end. The hum goes through your teeth.',
 eraseHand:'You pull the master out of its deck and pull the tape out of the master, all of it, yard after yard, until the reel spins empty.',
 sleeve:'Its sleeve is still on the bench, the label written over twice. You take it.',
 dawn:'Wednesday morning. The plows come down Fourth Street at six and push the slush into neat grey walls.',
 dawnWes:'Wes Pratt\'s sister helps him carry three trash bags of foil to the curb. The garbage truck takes it all. He waves at the truck.',
 dawnWesLost:'Wes Pratt\'s door stays shut. On Friday the landlord calls somebody, and an ambulance waits outside Lucky Buck with its lights off.',
 dawnOut:'Somewhere, in a padded envelope, a copy of the tape is in the mail. Somebody\'s going to watch it on a Tuesday.',
 dawnClean:'At Club Satin a city crew boards up the windows. The power company shuts the light bill off. Nobody on Fourth Street notices. That\'s the good news.',
 dawnWorst:'Out in the world the master is playing somewhere, on somebody\'s TV. Somebody new is watching. She\'s dancing for them.',
 filed:['BIG HAT','This sleeve. I\'ll file it. Records wants it by Monday.'],
 pie:'He slides a styrofoam box across the two-top. Inside, the two-ninety-nine breakfast from across the street. Eggs, toast, one sad sausage. He doesn\'t say where it came from.',
 // ---- the debrief (spec 007): Big Hat's lines by ending ({x}/{t} clues, {v}/{n} kept safe), about the choices, and the
 // cover stories ----
 db:{
  clean:[['BIG HAT','City boarded up that club this morning. Power company\'s confused. Usually they\'re the ones confusin\' us.'],['BIG HAT','Every copy accounted for. Clerk\'s at his sister\'s eatin\' soup. {x} clues outta {t}. Sit.']],
  costly:[['BIG HAT','She\'s done dancin\'. That\'s the good news.'],['BIG HAT','The rest of the news is somewhere in the mail, or in a trunk headed for Sacramento, or on a shelf in Phoenix.'],['BIG HAT','{x} clues outta {t}. Sit.']],
  worst:[['BIG HAT','Men in suits fillin\' out forms in a casino buffet I booked under my own name.'],['SHOUT','I HAD THE BUFFET RESERVED.'],['BIG HAT','Case is closed. Not by us.']],
  worstTape:[['BIG HAT','She\'s gone and the master ain\'t. That\'s the same thing as not gone.'],['BIG HAT','Old man got on a bus to Elko with it. I got his seat number. I don\'t got the bus.'],['BIG HAT','{x} clues outta {t}. Sit down before I make you.']],
  wrong:['BIG HAT','You told me it was a haunted tape. To my face. On a pay phone.'],
  cut:['BIG HAT','Pawn shop in Reno listed a cursed tape on the internet for nine hundred dollars. Mighty strange. Mighty specific.'],
  watched:['BIG HAT','You watched it {v} times. I can tell. You keep lookin\' over your shoulder at a buffet.'],
  never:['BIG HAT','Nobody watched it. Good. You\'re the first people I ever sent anywhere who did what I said.'],
  forced:['BIG HAT','Starlite Motor Lodge wants a new door. And a bird\'s been sayin\' my name on their answerin\' machine.'],
  fought:['BIG HAT','A man named Dale called to say his uncle is pressin\' charges. I told him we don\'t exist. He said that\'s what he\'d say too.'],
  wes:['BIG HAT','Clerk\'s sister mailed me a thank-you card. To an address I don\'t have. With a picture of a dog on it.'],
  royce:['BIG HAT','Kettering\'s at a home in Carson City. He watches the weather on channel 4 all day. I asked \'em to keep it that way.'],
  zip:['BIG HAT','Fella you zip-tied talked all the way to the bus station. Mostly about Sacramento. Some of it was useful.'],
  wire:'Bad wiring, a closed club',wirePass:[['BIG HAT','Club Satin: live wiring in a closed building, a code violation thirty years runnin\'. Fire marshal boards it up Monday. Fire marshal\'s right.']],
  prank:'A college prank tape',prankPass:[['BIG HAT','Kids from the university passin\' around a scary tape, writin\' on walls. Paper runs it under PARENTS BEWARE. Collector named Gideon gives a quote.']],
  weak:'It\'s Reno.',weakPass:[['BIG HAT','People write on walls in Reno. People see things in Reno. Nobody wants to know more than that. You got lucky.']],
  easy:'Collectors bought some junk',easyPass:[['BIG HAT','Couple collectors bought some old tapes off Fourth Street. Nobody cares. Perfect.']],
  safe:'Already filed: a building closed since 1996',safePass:[['BIG HAT','Paperwork says that club\'s been closed since \'96. Paperwork\'s never wrong.']]
 },
 // ---- people (folk) and looks ----
 look:{pole:'STARLITE MOTOR LODGE. COLOR TV. WEEKLY RATES. The R in MOTOR is out, so it says MOTO.',car:'A parked car under a crust of snow. Somebody has written WE KNOW in the frost on the back window. Small.',
  bank:'A plowed snowbank, grey at the bottom, hard as a curb.',hydrant:'A fire hydrant with a hat of snow.',dresser:'A dresser. The bottom drawer\'s glued shut. Motel rule.'}
};
const fill=(t,o)=>String(t).replace(/\{(n|m|v|t)\}/g,(x,k)=>o[k]??x);
async function play(seq,o={}){for(const l of [].concat(seq)){if(Array.isArray(l))await say(fill(l[0],o),fill(l[1],o));else await say('',fill(l,o))}}
const said=(l,o)=>play([l],o);
// A point of no return (studio-bible/play.md): the cursor starts on Not yet, so mashing A can't take it.
async function askNotYet(text,opts){await say('',text,{keep:true,instant:false});const r=await choose(opts,{cancel:true,inBox:true,sel:opts.length-1});hideTB();return r<0?opts.length-1:r}

// The case board card (spec 018, The card)
const caseCard={file:5,title:'TRACKING',town:'RENO',place:'FOURTH STREET · RENO, NV',
 hook:['A pawn-shop tape says WE KNOW.','Everyone who watched it agrees.'],pin:'#ff3fa4'};

// ================= CASE DATA =================
// Enemy cards (Combat: Enemies and difficulty, Combat numbers). Fight sizes: roamers 10–18 enemy HP, story fights 20–35.
const EN={
 // Gideon's nephew and his buddy (a human story fight, 2 skulls, 22 HP): Persuade's Lean on them stops it before it starts
 nephew:{name:'Dale',tier:'ordinary',hp:11,dex:11,hit:45,dmg:'1d4+1',skulls:2,tags:['human','living'],resist:[],weak:'human',weakLine:'Human, scared and house-sitting. A flashbang or a badge will stop him for a second.',
  moves:[['hit',1]],verb:'swings a bat at',die:'sits down on the floor holding his nose',face:[14,0,22]},
 buddy:{name:'Kyle Q.',tier:'ordinary',hp:11,dex:12,hit:45,dmg:'1d4+1',skulls:2,tags:['human','living'],resist:[],weak:'human',weakLine:'Human, and only here for the couch. A flashbang or a badge will stop him for a second.',
  moves:[['hit',1]],verb:'swings a bike chain at',die:'locks himself in the bathroom',face:[12,0,20]},
 // the Regular (an unnatural story fight, 2 skulls, 22 HP): a watcher since 1996, a coat over tracking noise
 regular:{name:'The Regular',tier:'tough',hp:22,dex:10,hit:50,dmg:'1d4+1',skulls:2,tags:['unnatural','lightshy','tape'],resist:['shaken'],weak:'light',
  weakLine:'Made of tape noise in a coat. A road flare sends it reeling; the bulk eraser stops it dead. Nothing in there to scare.',
  moves:[['hit',3],['san',1]],verb:'grabs at',sanText:TEXT.regularSan,sanHit:['0','1'],die:'folds onto the carpet, an empty coat',face:[18,6,20],horror:{tier:'unsettling',kind:'unnatural',subj:'eyes'}},
 // the watchers (roamers on night 2): the Audience's other regulars, afraid of steady light
 watcher:{name:'Watcher',tier:'ordinary',hp:12,dex:10,hit:45,dmg:'1d3+1',skulls:1,tags:['unnatural','lightshy','tape'],resist:[],weak:'light',weakLine:'A face of snow. A road flare sends it reeling; the bulk eraser stops it dead.',
  moves:[['hit',1]],verb:'reaches for',die:'goes to snow and then to nothing',face:[10,0,16],horror:{tier:'unsettling',kind:'unnatural',subj:'eyes'}},
 watcherbig:{name:'Head watcher',tier:'ordinary',hp:16,dex:10,hit:50,dmg:'1d4+1',skulls:2,tags:['unnatural','lightshy','tape'],resist:[],weak:'light',weakLine:'A face of snow. A road flare sends it reeling; the bulk eraser stops it dead.',
  moves:[['hit',1]],verb:'grabs for',die:'goes to snow and then to nothing',face:[10,0,16],horror:{tier:'unsettling',kind:'unnatural',subj:'eyes'}},
 // only if overstepping reaches Federal agents (the same clean-up crew as every case; its sprite is Still Harvest's SHB)
 fed:{name:'Clean-up agent',tier:'ordinary',hp:11,dex:12,hit:55,dmg:'1d4+1',skulls:3,tags:['human','living'],resist:[],weak:'human',weakLine:'Human. A flashbang or a badge will stop him for a second.',
  moves:[['hit',1]],verb:'fires at',die:'goes down and stays down',face:[10,2,20]},
 // the boss (tuned Nov 23, 2026 with tools/boss-sim.js against the Gleaner's bar). HP, speed, moves and phase 2 are set
 // per run in bossFight() from the case's choices. Weakness: steady light.
 vesper:{name:'Vesper',tier:'boss',boss:true,hp:56,dex:14,hit:60,dmg:'1d4+2',allDmg:'1d3',skulls:3,tags:['unnatural','lightshy'],resist:['stun2','poison'],weak:'light',
  weakLine:'Steady light hurts her: a road flare makes her falter, and the stage lights slow her down. Every copy still out there is a door she heals through. She can\'t be stunned two turns running.',
  glow:true,face:[26,8,22],moves:[['hit',5],['all',2],['san',1]],verb:'spins into',allText:TEXT.bossAll,sanText:TEXT.bossSan,sanHit:['0','1d3'],die:TEXT.bossDie,
  horror:{tier:'boss',kind:'unnatural',subj:'eyes',known:true}}
};
// the case's horrors: tier, kind, phobia subject; once per case each (SAN loss table). The club and the dub room are for
// all three; the rest are the lead's on the map. Each watch is its own horror (a new id per watch).
const HORRORS={
 walls:{id:'walls',tier:'unsettling',kind:'unnatural',label:TEXT.wesWallsH},
 arms:{id:'arms',tier:'disturbing',kind:'violence',gore:true,label:TEXT.travisArms},
 foil:{id:'foil',tier:'disturbing',kind:'unnatural',subj:'eyes',label:TEXT.foilH},
 photo:{id:'photo',tier:'unsettling',kind:'unnatural',label:TEXT.photoH},
 club:{id:'club',tier:'severe',kind:'unnatural',subj:'eyes',all:true,label:TEXT.club1H},
 dub:{id:'dub',tier:'shattering',kind:'unnatural',subj:'eyes',all:true,label:TEXT.dub1H},
 cameo:{id:'cameo:tall',tier:'unsettling',kind:'unnatural',label:TEXT.cameoH}
};
const watchHorror=n=>({id:'watch'+n+'.'+Object.keys(G.flags.seen||{}).length,tier:'disturbing',kind:'unnatural',subj:'eyes',label:TEXT.watchH});
// this case's own items (case-only: the pin icon; Big Hat sorts them at the debrief). The Satin tape is the key evidence.
const CASE_ITEMS={
 satin:{name:'The Satin tape',type:'Evidence',kind:'unnatural',pin:1,passive:1,
  desc:'The master\'s sleeve, the label written over twice: CLUB SATIN 3/96 under WE KNOW. Folded inside, a scrap of ruled paper numbered in the corner: 5.'},
 trkcopy:{name:'A copy of the tape',type:'Evidence',kind:'unnatural',pin:1,passive:1,
  desc:'A VHS tape, WE KNOW on the label in somebody\'s marker. It\'s warm, a little, like it was just playing. Burn it, erase it, or bring it home.'},
 eraser:{name:'Bulk tape eraser',type:'Tool',kind:'ordinary',pin:1,uses:2,desc:'Map: erase every copy you carry. Battle: anything made of the tape is Stunned a round.',
  mapUse:async()=>{await destroyCopies(TEXT.eraseDo);return false},
  battleUse:async(m)=>{const fs=aliveFoes().filter(e=>(e.tags||[]).includes('tape'));await bsay(`${m.name} switches on the bulk eraser. It hums like a hornet in a jar.`,1200);
   if(!fs.length){await bsay('Nothing here is made of tape.',900);return true}for(const e of fs)await foeStatus(e,'stun');return true}}
};
// a roamer's drop: 20% from this loot table (Where items come from, Loot): a pawn shop, a motel, a city street
const LOOT=['energy','painkillers','roadflare','cigs','booze'];
const has=id=>G.clues.some(c=>c.id===id);
const late=()=>G.flags.late|0;
const addLate=()=>{G.flags.late=late()+1};

// ================= THE DAY =================
// G.flags.ph: 0 day 1, 1 night 1, 2 day 2, 3 night 2 (spec 018, Day and night). G.flags.trk: the tracking lines' step,
// 0-4, one per watch (case checkpoint data, so it clears when the case ends).
const ph=()=>G.flags.ph|0;
const isNight=()=>ph()%2===1;
const outLight=()=>isNight()?'night':ph()===0?'dusk':'day';
// overstepping (quiet case: Clean, Noticed, Local chief, Agency call, Federal agents)
const stepIdx=()=>loadSeason().overstep|0;
const stepName=()=>stepsOf()[stepIdx()]||'Clean';
const stepAt=n=>stepsOf().indexOf(n)>=0&&stepsOf().indexOf(n)<=stepIdx();
const noticed=()=>stepAt('Noticed');
const chief=()=>stepAt('Local chief');

// ================= THE COPIES =================
// G.flags.cp: each copy's state (see the case file): undefined where it was, 'got' carried, 'burned', or out in the world
const COPIES=['bin','wes','travis','gideon','bar'];
const cpOf=id=>(G.flags.cp=G.flags.cp||{})[id];
const setCp=(id,v)=>{(G.flags.cp=G.flags.cp||{})[id]=v};
const carried=()=>COPIES.filter(k=>cpOf(k)==='got');
const burned=()=>COPIES.filter(k=>cpOf(k)==='burned').length;
const outCopies=()=>COPIES.filter(k=>!['got','burned'].includes(cpOf(k))).length;
const royceDealt=()=>!!G.flags.royce;
async function takeCopy(id){if(cpOf(id)==='got'||cpOf(id)==='burned')return;setCp(id,'got');await pickup('trkcopy');checkpoint()}
function dropCopyItems(){for(const m of live()){const g=gearOf(m);g.it=g.it.filter(it=>it.k!=='trkcopy')}G.fs.pack=(G.fs.pack||[]).filter(it=>it.k!=='trkcopy')}
async function destroyCopies(lines){const c=carried();if(!c.length){await said(TEXT.burnNone);return false}await play(lines);c.forEach(k=>setCp(k,'burned'));dropCopyItems();checkpoint();return true}
// the turns: what goes out into the world as each part of the day closes
function closeCopies(p){const to=royceDealt()?'owner':'royce';
 if(p===0&&!cpOf('bin'))setCp('bin',to);
 if(p===1&&!cpOf('travis'))setCp('travis','gone');
 if(p===2){if(!cpOf('gideon'))setCp('gideon',to);if(!cpOf('wes'))setCp('wes',G.flags.wes?'got':to)}}

// ================= WATCHING THE TAPE =================
// The lead watches: the clip, a Disturbing horror (eyes), one step of the tracking lines, and the one thing that watch
// gives (case file). n: which copy watch this is (1-3), or 4 for the master.
const watchedN=()=>Object.keys(G.flags.seen||{}).filter(k=>k!=='master').length;
async function showClip(k,lines){const was=G.mode;G.mode='scene';G.scene='clip';G.clip=(c,w,h,now)=>TRKA.clip(c,w,h,now,k);
 try{await play(lines)}finally{G.scene=null;G.clip=null;G.mode=was}}
async function watch(id){const F=G.flags,L=lead();F.seen=F.seen||{};if(F.seen[id]){await said(TEXT.watched);return}
 if((await askNotYet(TEXT.watchQ,TEXT.watchOpts))!==0)return;
 const master=id==='master',n=master?4:watchedN()+1;F.seen[id]=1;F.trk=Math.min(4,(F.trk|0)+1);
 await showClip(0,TEXT.watchIn);await showClip(master?4:n<=3?n:1,master?TEXT.watch4:n<=3?TEXT['watch'+n]:TEXT.watchMore);
 await horror(watchHorror(F.trk),{who:[L]});
 if(!party.some(m=>!m.gone))return;
 await said(TEXT.watchOut);
 if(master)F.name=1;
 else if(n===1&&!has('royce'))clue('royce',TEXT.cRoyceTape);
 else if(n===2)F.knowLight=1;
 else if(n===3&&!has('under'))clue('under',TEXT.cUnder);
 if(F.trk===2)await said(TEXT.wwe);
 checkpoint()}
const watchOpt=(id,show)=>({label:TEXT.watchOpt,show:()=>!(G.flags.seen||{})[id]&&(!show||show()),run:()=>watch(id)});

// ================= MAPS =================
// Every map is drawn by cases/tracking-art.js from M.ground, M.pieces and M.light. M.g is what blocks.
// Ground letters (none in engine.js's BLOCK set): 's' snow, 'S' trodden snow, '~' slush road, ';' slush sidewalk,
// '_' the motel lot, 'n' lino, 'c' carpet, 'w' wood, 'o' concrete, 'u' the club's carpet (not 'k', which engine.js blocks), 'd' its dance floor.
function blank(id,name,W,H,fillCh,light){const ground=mk(W,H,fillCh),g=mk(W,H,fillCh);
 return{id,name,w:W,h:H,ground,g,pieces:[],O:{},npcs:[],warps:{},light,art:window.TRKA,bg:id}}
const lay=(M,x,y,w,h,c)=>{rect(M.ground,x,y,w,h,c);rect(M.g,x,y,w,h,c)};
const block=(M,x,y,w=1,h=1)=>rect(M.g,x,y,w,h,'#');
const open=(M,x,y)=>{M.g[y][x]=M.ground[y][x]};
function put(M,k,x,y,w=1,h=1,o={}){const p=Object.assign({k,x,y,w,h},o);M.pieces.push(p);if(!o.walk)block(M,x,y,w,h);return p}
const look=t=>({look:t});
const lookAll=(M,x,y,w,t)=>{for(let i=0;i<w;i++)M.O[(x+i)+','+y]=look(t)};
const npc=(n,talk)=>Object.assign(n,{talk});
// a door you walk into: it opens on the far map at (x, y) facing dir; the far map's arrive() plays after the fade
const door=(M,x,y,to,tx,ty,dir='down')=>{open(M,x,y);M.warps[x+','+y]=()=>goTo(to,tx,ty,dir)};
async function goTo(to,x,y,dir){await fade(1);goMap(to,x,y,dir);checkpoint();await fade(0);if(G.M.arrive)await G.M.arrive()}
const bounce=(M,keys,text,dir)=>keys.forEach(k=>M.warps[k]=async()=>{await said(text);G.dir=dir;await stepBack()});
const shut=(M,x,y,text)=>{open(M,x,y);M.warps[x+','+y]=async()=>{await said(typeof text==='function'?text():text);G.dir='down';await stepBack()}};
// a door that asks first (a hotspot on the doorway tile, walked into from below)
const gate=(M,x,y,fn)=>{open(M,x,y);M.warps[x+','+y]=async()=>{G.dir='down';await stepBack();G.dir='up';await fn()}};

// ---- FOURTH STREET: every phase (48 x 22). North side, west to east: the Starlite Motor Lodge (rooms 7-12 and the
// office), Lucky Buck Pawn with Wes's stair door, a vacant lot, Club Satin, the Paydirt casino. The street, then the
// south sidewalk with the bus stop, then a fenced lot. Doors sit in the fronts' bottom row (row 6).
const SY=6;  // the fronts' bottom row: the doors
function buildStreet(){
 const N=isNight(),p=ph(),F=G.flags,M=blank('street','FOURTH STREET',48,22,';',outLight());M.alpha=.88;M.warm='#ffbe70';M.ph=p;M.variant=p;
 block(M,0,0,48,SY+1);rect(M.ground,0,0,48,SY+1,'s');put(M,'street',0,0,48,22,{walk:1});
 lay(M,0,SY+1,16,3,'_');lay(M,0,SY+4,48,4,'~');lay(M,0,SY+8,48,2,';');rect(M.ground,0,SY+10,48,6,'s');rect(M.ground,4,SY+12,40,2,'S');block(M,0,SY+10,48,6);
 // the motel: rooms 7-12, door x for room n: 2 * (n - 7) + 1; the office door at x 14
 for(let n=7;n<=12;n++){const x=2*(n-7)+1;
  if(n===8)door(M,x,SY,'room8',5,6,'up');
  else if(n===12){if(p>=2)shut(M,x,SY,TEXT.back12);else gate(M,x,SY,room12Door)}
  else if(n===7)gate(M,x,SY,room7Door);
  else shut(M,x,SY,TEXT.room(n))}
 shut(M,14,SY,TEXT.office);
 // Wes's stair door, and the pawn shop (day 1 only: it closes for good at the first turn)
 if(F.wesIn)door(M,18,SY,'wes',6,7,'up');else gate(M,18,SY,wesDoor);
 if(p>=1)shut(M,23,SY,TEXT.pawnShut);else door(M,23,SY,'pawn',8,8,'up');
 // Club Satin: chained shut until night 2, then Go in / Not yet
 for(const x of[37,38]){open(M,x,SY);M.warps[x+','+SY]=p===3?enterClub:async()=>{await said(TEXT.clubShut);G.dir='down';await stepBack()}}
 shut(M,44,SY,TEXT.casino);
 // the street's dressing: the motel's pole sign, parked cars, lamps, snowbanks, the bus stop, a hydrant
 put(M,'polesign',16,SY+3);M.O['16,'+(SY+3)]=look(TEXT.look.pole);
 put(M,'car',5,SY+2,3,1,{tint:'#7a2a3a'});put(M,'car',9,SY+2,3,1,{tint:'#3e5a6a'});lookAll(M,5,SY+2,3,TEXT.look.car);lookAll(M,9,SY+2,3,TEXT.look.car);
 [[6,SY+3],[20,SY+3],[34,SY+3],[46,SY+3],[12,SY+9],[40,SY+9],[22,SY+9]].forEach(([x,y])=>put(M,'lamp',x,y));
 [[27,SY+3,2],[41,SY+3,2],[31,SY+8,2],[2,SY+8,2]].forEach(([x,y,w])=>{put(M,'snowbank',x,y,w,1);lookAll(M,x,y,w,TEXT.look.bank)});
 put(M,'hydrant',35,SY+8);M.O['35,'+(SY+8)]=look(TEXT.look.hydrant);
 put(M,'busstop',26,SY+8,3,1);for(const x of[26,27,28])M.O[x+','+(SY+8)]={id:'bus',name:TEXT.bus,look:TEXT.busLook,opts:()=>busOpts()};
 // the motel lot's burn barrel, the pay phone by the office, Room 7's trash
 put(M,'barrel',14,SY+3);M.O['14,'+(SY+3)]={id:'barrel',name:TEXT.barrel,look:TEXT.barrelLook,opts:()=>[{label:TEXT.burnOpt,show:()=>carried().length>0,run:()=>destroyCopies(TEXT.burnDo)}]};
 put(M,'payphone',12,SY+1);M.O['12,'+(SY+1)]={id:'phone',name:TEXT.phone,look:lookPhone,used:()=>ph()!==2||!!F.deduce};
 M.O['0,'+(SY+1)]={id:'trash7',name:TEXT.r7Trash,look:TEXT.r7TrashLook,opts:()=>trashOpts(),used:()=>has('royce')||p>=3};
 // past the fence: the lot's own dressing (it doesn't walk)
 [[3,SY+12,3],[16,SY+11,2],[38,SY+13,3],[24,SY+14,2]].forEach(([x,y,w])=>put(M,'snowbank',x,y,w,1,{walk:1}));
 put(M,'car',9,SY+13,3,1,{tint:'#4a4a54',walk:1});put(M,'car',44,SY+12,3,1,{tint:'#d8c890',walk:1});put(M,'dumpster',20,SY+12,2,1,{walk:1});
 // the street runs on past both ends
 const ends=[1,2,3,4,5,6,7,8,9].map(d=>SY+d);bounce(M,ends.map(y=>'0,'+y).filter(k=>k!=='0,'+(SY+1)),TEXT.westEnd,'right');bounce(M,ends.map(y=>'47,'+y),TEXT.eastEnd,'left');
 // people: who's where by phase
 const NP=[npc({id:'luz',x:15,y:SY+1,dir:'down'},talkLuz)];
 if(p===1||p===2)NP.push(npc({id:'teri',x:30,y:SY+2,dir:'left'},talkTeri));
 if(p===3&&noticed())NP.push(npc({id:'teri',x:35,y:SY+2,dir:'up'},()=>play(TEXT.teriTrail)));
 if(!N)NP.push(npc({id:'cherry',x:25,y:SY+9,dir:'up',out:()=>has('cherry')},talkCherry));
 M.npcs=NP;
 return M}

// ---- interiors: the back wall three tiles tall, the door in the bottom wall ----
function room(id,name,W,H,floor,o={}){const M=blank(id,name,W,H,floor,isNight()?'night':'day');M.alpha=o.alpha||.55;M.warm='#ffcf80';
 block(M,0,0,W,3);block(M,0,0,1,H);block(M,W-1,0,1,H);block(M,0,H-1,W,1);put(M,'room',0,0,W,H,{walk:1,floor});return M}
function buildPawn(){const M=room('pawn','LUCKY BUCK PAWN',16,10,'n');
 put(M,'glasscase',3,5,3,1);put(M,'glasscase',6,5,3,1);lookAll(M,3,5,6,TEXT.glass);M.O['5,5']=M.O['6,5']=talkManny;
 put(M,'crt',10,5,1,1,{on:false});put(M,'vcr',10,5,1,1,{walk:1,dy:-6});M.O['10,5']=look(TEXT.pawntv);
 put(M,'shelf',13,3,2,1);lookAll(M,13,3,2,TEXT.shelf);put(M,'shelf',1,3,2,1);lookAll(M,1,3,2,TEXT.shelf);
 put(M,'bin',12,7);M.O['12,7']={id:'bin',name:TEXT.bin,look:()=>said(cpOf('bin')?TEXT.binGone:TEXT.binLook),opts:()=>binOpts(),used:()=>!!cpOf('bin')&&has('bin')};
 put(M,'boxes',1,7,1,1,{v:1});put(M,'boxes',14,6,1,1,{v:2});
 M.npcs=[npc({id:'manny',x:5,y:4,dir:'down'},talkManny)];
 door(M,8,9,'street',23,SY+1,'down');return M}
function buildWes(){const M=room('wes','WES\'S PLACE',12,9,'c',{alpha:.72}),F=G.flags;
 put(M,'mattress',1,4,2,1);lookAll(M,1,4,2,TEXT.mattressW);put(M,'crate',7,4);put(M,'crt',7,4,1,1,{walk:1,on:true});put(M,'vcr',7,4,1,1,{walk:1,dy:-18,tape:!cpOf('wes')});
 M.O['7,4']={id:'westv',name:TEXT.wesTV,look:()=>said(cpOf('wes')?TEXT.wesTVEmpty:TEXT.wesTVLook),opts:()=>wesTVOpts(),used:()=>!!cpOf('wes')&&has('wes')};
 put(M,'fridge',10,3);M.O['10,3']=look(TEXT.fridge);put(M,'boxes',10,6,1,1,{v:0});
 // The hidden hotspot (Item list, Mushrooms): the foil on the left window, only while the lead is High (field.js)
 M.O['3,2']={id:'foil',hidden:'mushrooms',name:TEXT.foilName,look:readFoil,used:()=>has('under'),glint:(c,x,y,now)=>TRKA.foilGlint(c,x,y,now)};
 M.npcs=[npc({id:'wes',x:5,y:5,dir:'down',out:()=>!!F.wes||(has('wes')&&ph()>=3)},talkWes)];
 M.arrive=async()=>{if(!F.walls){F.walls=1;await cut('walls',()=>play(TEXT.wesWalls));await horror(HORRORS.walls);checkpoint()}};
 door(M,6,8,'street',18,SY+1,'down');return M}
function buildRoom8(){const M=room('room8','ROOM 8 · STARLITE',11,8,'c'),F=G.flags;
 put(M,'bed',1,3,2,2);put(M,'bed',4,3,2,2);
 for(const k of['1,4','2,4','4,4','5,4','1,3','2,3','4,3','5,3'])M.O[k]={id:'bed',name:TEXT.bedName,look:TEXT.bedLook,opts:()=>restOpts(),used:()=>ph()>=3};
 put(M,'dresser',7,3,2,1);M.O['7,3']={id:'pad',name:TEXT.pad,look:()=>(F.trk|0)>=2?play(TEXT.padWe):said(TEXT.padLook)};M.O['8,3']=look(TEXT.look.dresser);
 put(M,'crt',9,3,1,1,{on:true});put(M,'vcr',9,3,1,1,{walk:1,dy:-12,tape:carried().length>0});
 M.O['9,3']={id:'tv',name:TEXT.tvName,look:TEXT.tvLook,opts:()=>[{label:TEXT.tvPlay,show:()=>carried().some(k=>!(F.seen||{})[k]),run:async()=>{const k=carried().find(k=>!(F.seen||{})[k]);if(k)await watch(k);else await said(TEXT.tvNone)}}]};
 put(M,'heater',8,6);M.O['8,6']=look(TEXT.heater);
 door(M,5,7,'street',3,SY+1,'down');return M}
function buildRoom12(){const M=room('room12','ROOM 12 · STARLITE',11,8,'c',{alpha:.7}),here=ph()<2;
 put(M,'bed',1,3,2,2);
 for(const k of['1,3','2,3','1,4','2,4'])M.O[k]={id:'bed12',name:'BED',look:TEXT.bed12,opts:()=>travisSearch(),used:()=>!!cpOf('travis')};
 put(M,'nightstand',3,3);M.O['3,3']={id:'stand',name:TEXT.standName,look:TEXT.standLook,opts:[{label:TEXT.standOpt,once:'caps',run:async()=>{await play(TEXT.standFind);await pickup('shrooms')}}]};
 put(M,'crt',6,3,1,1,{on:true});M.O['6,3']={id:'tv12',name:TEXT.tv12,look:TEXT.tv12Look,opts:()=>[watchOpt('travis',()=>!cpOf('travis')||cpOf('travis')==='got')]};
 put(M,'hotplate',8,3);M.O['8,3']=look(TEXT.hotplate);put(M,'boxes',9,5,1,1,{v:0});
 if(here)M.npcs=[npc({id:'travis',x:6,y:5,dir:'down',out:()=>has('travis')},talkTravis)];
 door(M,5,7,'street',11,SY+1,'down');return M}
// across town by bus: the collector's apartment and the records room (days only)
const busBack=(M,x,y)=>{open(M,x,y);M.warps[x+','+y]=async()=>{const r=await ask('',TEXT.exitBus,TEXT.exitBusOpts);if(r===0)await ride('street');else{G.dir='up';await stepBack()}}};
function buildGideon(){const M=room('gideon','GIDEON\'S APARTMENT',13,10,'w'),F=G.flags;
 for(let x=1;x<12;x++)M.O[x+',2']=look(TEXT.tapes);
 put(M,'tvstack',3,3,2,1);M.O['3,3']=M.O['4,3']={id:'gidtv',name:TEXT.gidTV,look:TEXT.gidTVLook,opts:()=>[watchOpt('gideon',()=>!!F.gidWatch&&(!cpOf('gideon')||cpOf('gideon')==='got'))]};
 put(M,'recliner',4,6);M.O['4,6']=look(TEXT.recliner);
 put(M,'shelf',10,4,2,1);put(M,'shelf',10,6,2,1);lookAll(M,10,4,2,TEXT.tapes);lookAll(M,10,6,2,TEXT.tapes);put(M,'boxes',1,7,1,1,{v:2});put(M,'boxes',1,5,1,1,{v:1});
 const NP=[npc({id:'gideon',x:7,y:5,dir:'down',out:()=>has('gideon')&&!!cpOf('gideon')},talkGideon)];
 if(!F.nephews)NP.push(npc({id:'dale',x:8,y:7,dir:'left'},()=>play(TEXT.dale)),npc({id:'kyle',x:9,y:7,dir:'left'},()=>play(TEXT.kyle)));
 M.npcs=NP;
 busBack(M,6,9);return M}
function buildRecords(){const M=room('records','COUNTY RECORDS',14,10,'n');
 [[1,3],[1,5],[1,7],[11,3],[11,5],[11,7]].forEach(([x,y])=>{put(M,'shelf',x,y,2,1);lookAll(M,x,y,2,TEXT.stacks)});
 M.O['11,3']=M.O['12,3']={id:'license',name:'FILE BOXES',look:TEXT.stacks,opts:()=>[{use:'paper',label:TEXT.inesLicense,show:()=>!has('gideon'),ok:async()=>{clue('gideon',TEXT.cGideonLic);checkpoint();await said(TEXT.cGideonLic)},fail:()=>said('Liquor licenses. Bingo licenses. A license for a dancing bear, 1961, revoked.')}],used:()=>has('gideon')};
 put(M,'fiche',5,3);M.O['5,3']=look(TEXT.fiche);
 put(M,'counter',5,6,4,1);lookAll(M,5,6,4,'The records counter. A bell, a slip pad, a cup of pencils.');M.O['7,6']=talkInes;M.O['6,6']=talkInes;
 M.npcs=[npc({id:'ines',x:7,y:5,dir:'down',out:()=>has('photo')&&(has('cherry')||!teamHas('History',40))},talkInes)];
 busBack(M,7,9);return M}

// ---- CLUB SATIN: night 2, the danger zone (26 x 18): the dance floor and the pole stage, the bar, the booths, the DJ
// booth, the coat check by the lobby door, the back hall's three doors; the trapdoor behind the stage ----
// The tiles the three watchers walk, in front of what each guards (Gameplay loop, Roamers)
const BEAT={bar:[[18,9],[19,9],[20,9],[21,9],[22,9],[23,9],[24,9]],dj:[[5,5],[6,5],[7,5],[8,5],[9,5]],coat:[[1,15],[2,15],[3,15],[4,15],[4,14],[4,13],[3,13],[2,13]]};
const trapKnown=()=>has('under')||has('photo')||has('cherry')||!!G.flags.lights||!!G.flags.trap;
function buildClub(){const M=blank('club','CLUB SATIN',26,18,'u','night'),F=G.flags;M.alpha=F.lights?.5:.74;M.warm=F.lights?'#ffe8f4':'#ffbe90';
 block(M,0,0,26,3);block(M,0,0,1,18);block(M,25,0,1,18);block(M,0,17,26,1);put(M,'clubroom',0,0,26,18,{walk:1});
 lay(M,6,6,14,7,'d');
 put(M,'stage',11,3,4,2);lookAll(M,11,3,4,TEXT.stage);lookAll(M,11,4,4,TEXT.stage);
 open(M,16,3);M.warps['16,3']=enterDub;
 for(const x of[20,22,24])M.O[x+',2']=look(TEXT.hall);
 put(M,'djbooth',6,3,2,1);M.O['6,3']=M.O['7,3']={id:'dj',name:TEXT.dj,look:TEXT.djLook,opts:()=>djOpts(),used:()=>!!F.lights};
 put(M,'bar',19,8,5,1);for(let x=19;x<24;x++)M.O[x+',8']={id:'bar',name:TEXT.bar,look:TEXT.barLook,opts:()=>[{label:TEXT.barTake,show:()=>!cpOf('bar'),run:takeBar}],used:()=>!!cpOf('bar')};
 [[2,4],[2,7],[2,10]].forEach(([x,y])=>{put(M,'booth',x,y,2,1);lookAll(M,x,y,2,TEXT.booth)});
 [[8,14],[17,14],[21,12]].forEach(([x,y])=>{put(M,'tables',x,y);M.O[x+','+y]=look(TEXT.tables)});
 put(M,'coatcheck',2,14,2,1);M.O['2,14']=M.O['3,14']={id:'coat',name:TEXT.coat,look:TEXT.coatLook,opts:()=>G.fs.used['box:club']?[]:[{label:TEXT.coatOpen,run:openBox}],used:()=>!!G.fs.used['box:club']};
 M.roamers=[
  {id:'wbar',types:['watcher'],sprite:'watcher',name:'Watcher',skulls:1,tags:EN.watcher.tags,path:BEAT.bar,look:'A thin watcher in a satin shirt stands at the bar the way people stand at a bar TV, face full of snow. Behind it, under the register, something in a napkin.',guard:takeBar},
  {id:'wdj',types:['watcher'],sprite:'watcher',name:'Watcher',skulls:1,tags:EN.watcher.tags,path:BEAT.dj,look:'A watcher walks slow in front of the DJ booth, keeping the breaker panel company.',guard:async()=>{}},
  {id:'wcoat',types:['watcherbig'],sprite:'watcher',name:'Head watcher',skulls:2,tags:EN.watcher.tags,path:BEAT.coat,look:'A big watcher with a coat-check ticket in its hand walks the lobby, like it\'s waiting for its coat. It\'s been waiting since 1996.',guard:openBox}];
 M.danger=true;
 M.arrive=clubArrive;
 door(M,13,17,'street',37,SY+1,'down');return M}
async function enterClub(){const r=await askNotYet(TEXT.clubQ,TEXT.gateIn);if(r===0)await goTo('club',13,16,'up');else{G.dir='down';await stepBack()}}
// ---- THE DUB ROOM: night 2, the finale area (16 x 9). Vesper dances at the left end of the screens; the bench (the
// master) and the notebook are reached from the stairs without passing her. ----
async function enterDub(){const F=G.flags;
 if(!trapKnown()){G.dir='down';await stepBack();G.dir='up';await hotspot({name:TEXT.trap,look:TEXT.trapLook,opts:[
  {use:'sweep',label:TEXT.trapSweep,once:'trapSw',ok:foundTrap,fail:()=>said(TEXT.trapFail)},
  {use:'force',label:TEXT.trapForce,once:'trapFo',ok:foundTrap,fail:()=>said(TEXT.trapFail)},
  {label:TEXT.trapFeel,run:async()=>{addLate();await said(TEXT.trapFeelDo);await foundTrap()}}]},'trap');return}
 const r=await askNotYet(TEXT.trapQ,TEXT.gateIn);if(r===0)await goTo('dub',8,7,'up');else{G.dir='down';await stepBack()}}
async function foundTrap(){G.flags.trap=1;await said(TEXT.trapFound);checkpoint()}
const VX=3,VY=3;
function buildDub(){const M=blank('dub','THE DUB ROOM',16,9,'o','night'),F=G.flags;M.alpha=.84;M.warm='#c8d8ff';
 block(M,0,0,16,2);block(M,0,0,1,9);block(M,15,0,1,9);block(M,0,8,16,1);put(M,'vault',0,0,16,9,{walk:1});
 put(M,'vcrwall',1,0,14,2,{walk:1});for(let x=1;x<15;x++)M.O[x+',1']=look(TEXT.vcrs);
 put(M,'bench',7,3,2,1);M.O['7,3']=M.O['8,3']={id:'bench',name:TEXT.bench,look:()=>said(F.masterGone?TEXT.benchGone:TEXT.benchLook),opts:()=>F.masterGone?[]:[watchOpt('master')],used:()=>!!F.masterGone||!!(F.seen||{}).master};
 put(M,'notebook',10,3);M.O['10,3']={id:'notebook',name:TEXT.notebook,look:()=>said(F.read?TEXT.readDone:TEXT.notebookLook),opts:()=>readOpts(),used:()=>!!F.read};
 put(M,'boxes',2,6,1,1,{v:2});put(M,'boxes',13,5,1,1,{v:1});
 M.npcs=F.boss?[]:[npc({id:'vesper',x:VX,y:VY,dir:'down'},talkVesper)];
 open(M,8,8);M.warps['8,8']=async()=>{const r=await ask('',TEXT.dubOut,TEXT.dubOutOpts);if(r===0)await goTo('club',16,4,'down');else{G.dir='up';await stepBack()}};
 // stepping next to her asks too
 M.onStep=async()=>{if(!F.boss&&Math.abs(G.x-VX)+Math.abs(G.y-VY)===1){held=[];await bossAsk()}};
 M.arrive=async()=>{
  if(!F.dub){F.dub=1;await cut('dub',()=>play(TEXT.dub1));await horror(HORRORS.dub);if(!party.some(m=>!m.gone))return;
   if(late()>=2&&!royceDealt()){F.masterGone=1;await play(TEXT.masterGone)}checkpoint()}};
 return M}
const MAPS={street:buildStreet,pawn:buildPawn,wes:buildWes,room8:buildRoom8,room12:buildRoom12,gideon:buildGideon,records:buildRecords,club:buildClub,dub:buildDub};

// ================= THE BUS AND THE DAY =================
const knowGideon=()=>has('travis')||!!G.flags.flyer;
function busOpts(){const o=[];if(G.map!=='street')return o;
 o.push({label:TEXT.busOpt.gideon,show:knowGideon,run:()=>isNight()?said(TEXT.busNight):ride('gideon')});
 o.push({label:TEXT.busOpt.records,run:()=>isNight()?said(TEXT.recordsShut):ride('records')});
 o.push({use:'sweep',label:TEXT.flyer,once:'flyer',show:()=>!knowGideon(),ok:async()=>{G.flags.flyer=1;await play(TEXT.flyerFind);clue('flyer',TEXT.cTravisFly);checkpoint()},fail:()=>said(TEXT.flyerNone)});
 return o}
async function ride(where){await fade(1);await say('',TEXT.busRide[where]);
 if(where==='gideon')goMap('gideon',6,8,'up');else if(where==='records')goMap('records',7,8,'up');else goMap('street',27,SY+9,'down');checkpoint();await fade(0)}
function restOpts(){const p=ph();if(p>=3)return[{label:TEXT.restOpt[2],run:()=>said(TEXT.restDone)}];return[{label:TEXT.restOpt[p],run:turnDay}]}
async function turnDay(){const p=ph(),F=G.flags;if(p>=3){await said(TEXT.restDone);return}
 if(p===2&&!F.deduce){await said(TEXT.restDeduce);return}
 const r=await askNotYet(TEXT.restQ[p]+' '+TEXT.restClose[p],TEXT.turnOpts);if(r!==0)return;
 await nextPhase(TEXT.rested[p],'room8',5,6)}
async function nextPhase(lines,map,x,y){const p=ph(),F=G.flags;
 await fade(1);closeCopies(p);F.ph=p+1;await play(lines);await rest(1);goMap(map,x,y,'up');banner(TEXT.phase[p+1]);checkpoint();await fade(0);
 if(F.ph===1)await trigger('night')}

// ================= THE PAWN SHOP (day 1) =================
async function talkManny(){const F=G.flags;
 if(!F.manny1){F.manny1=1;await play(TEXT.manny1)}
 await hotspot({name:'MANNY',look:()=>play(TEXT.mannyAfter),opts:[
  {label:TEXT.mannyAsk,show:()=>!has('bin'),run:async()=>{if(noticed()){await play(TEXT.mannyQuiet);return}await play(TEXT.mannyAskDo);clue('bin',TEXT.cBin);checkpoint()}},
  {label:TEXT.mannyBuy,show:()=>!cpOf('bin')&&!!F.binSeen,run:async()=>{await play(TEXT.mannyBuyDo);await takeCopy('bin')}},
  {use:'paper',label:TEXT.log,show:()=>!has('bin'),ok:async()=>{await play(TEXT.logDo);clue('bin',TEXT.cBin);checkpoint()},fail:()=>said('The pawn log is mostly coffee. The parts that aren\'t are in a code only Manny reads.')},
  // the motivation moment (Money): sell him the copies you carry for a cut; they go back out into the world
  {label:TEXT.mannyCut,show:()=>!F.cut&&holdersOf('Money').length>0&&carried().length>0,run:mannyCut}]},'manny')}
async function mannyCut(){const F=G.flags;await play(TEXT.mannyCutPitch);
 const r=await ask('MANNY','So?',[TEXT.mannyCut,TEXT.mannyNo]);
 if(r!==0){F.cut='refused';await play(TEXT.mannyNoDo);checkpoint();return}
 F.cut='took';await play(TEXT.mannyCutDo);carried().forEach(k=>setCp(k,'sold'));dropCopyItems();await pickup('cigs');
 for(const m of holdersOf('Money'))await motivate(m);checkpoint()}
function binOpts(){const F=G.flags;F.binSeen=1;return[
 {use:'sweep',mod:()=>intelOn('tape')?10:0,show:()=>!cpOf('bin'),once:'binSweep',ok:async()=>{await play(TEXT.binFind);clue('bin',TEXT.cBin);await takeCopy('bin')},fail:()=>said(TEXT.binNone)},
 {label:TEXT.mannyBuy,show:()=>!cpOf('bin'),run:async()=>{await play(TEXT.mannyBuyDo);await takeCopy('bin')}}]}

// ================= WES (Redemption) =================
async function wesDoor(){const F=G.flags,ok=has('bin')||intelOn('clerk');
 await hotspot({name:'WES\'S DOOR',opts:[
  {label:TEXT.wesName,show:()=>ok,run:async()=>{await play(TEXT.wesNameDo);await letWesIn()}},
  {label:TEXT.wesKnock,show:()=>!ok,run:()=>play(TEXT.wesShut)},
  {use:'force',show:()=>!ok,ok:async()=>{F.forced=1;await said(TEXT.wesForce);await overstepHere('seen');await letWesIn()},fail:()=>said('The stair door is steel. Somebody upstairs has been very scared for a while.')}]},'wesdoor')}
async function letWesIn(){G.flags.wesIn=1;checkpoint();await goTo('wes',6,7,'up')}
const wesMod=()=>intelOn('clerk')?10:0;
async function talkWes(){const F=G.flags;await trigger('liar');
 if(F.wes){await play(TEXT.wesSaved);return}
 if(!F.wes1){F.wes1=1;await play(TEXT.wes1)}
 const tell=async()=>{await play(TEXT.wesTalk);clue('wes',TEXT.cWes);checkpoint()};
 const saved=async(how,lines)=>{F.wes=how;await play(lines);checkpoint();if(!cpOf('wes')){await said('He holds the tape out to you with both hands.');await takeCopy('wes')}};
 await hotspot({name:'WES',look:()=>play(has('wes')?[TEXT.wesHelp]:TEXT.wesQuiet),opts:[
  {use:'read',mod:wesMod,show:()=>!has('wes'),ok:tell,fail:()=>play(TEXT.wesQuiet)},
  {use:'calm',mod:wesMod,show:()=>!has('wes'),ok:tell,fail:()=>play(TEXT.wesQuiet)},
  // the motivation moment (Redemption): stay the night; it is the turn to day 2 (Go on / Not yet, naming what closes)
  {label:TEXT.wesStay,show:()=>has('wes')&&ph()===1&&holdersOf('Redemption').length>0,run:wesStay},
  {use:'talk',label:TEXT.wesSister,once:'wesSis',show:()=>has('wes')&&ph()<3,ok:()=>saved('sister',TEXT.wesSisterDo),fail:()=>said(TEXT.wesFail)},
  {use:'calm',label:TEXT.wesCalm,once:'wesCalm',show:()=>has('wes')&&ph()<3,mod:wesMod,ok:()=>saved('calm',TEXT.wesCalmDo),fail:()=>said(TEXT.wesFail)}]},'wes')}
async function wesStay(){const F=G.flags,ms=holdersOf('Redemption'),m=ms[0];
 const r=await askNotYet(TEXT.wesStayQ+' '+TEXT.restClose[1],TEXT.turnOpts);if(r!==0)return;
 F.wes='stayed';await play(TEXT.wesStayDo,{m:m.name.toUpperCase()});
 for(const x of ms)await motivate(x);
 await nextPhase(['Morning. The foil glows white with daylight. Wes is asleep on the mattress with his shoes on.'],'wes',5,6);
 if(!cpOf('wes'))await takeCopy('wes')}
function wesTVOpts(){return[
 watchOpt('wes',()=>!cpOf('wes')),
 {label:TEXT.wesTake,show:()=>!cpOf('wes'),run:async()=>{await said(TEXT.wesTakeDo);await takeCopy('wes')}},
 {use:'sweep',label:TEXT.wesSweepOpt,show:()=>!has('wes'),once:'wesSweep',ok:async()=>{await play(TEXT.wesSweep);clue('wes',TEXT.cWes);checkpoint()},fail:()=>said('Dust, a dead cricket, and a lot of WE KNOW in very small letters on the VCR\'s lid.')}]}
// the hidden hotspot (Mushrooms): the eyes in the foil, clue `under` and a Disturbing horror
async function readFoil(){await play(TEXT.foilLook);await horror(HORRORS.foil);if(!has('under')){clue('under',TEXT.cUnder);checkpoint()}}

// ================= THE STARLITE: LUZ, ROOM 12, ROOM 7 =================
async function talkLuz(){const F=G.flags,p=ph();
 if(p===3){await play(TEXT.luzNight2);return}
 if(!F.luz1){F.luz1=1;await play(TEXT.luz1)}
 if(noticed()&&!F.luzOk){await hotspot({name:'LUZ',look:()=>play(TEXT.luzQuiet),opts:[{use:'talk',once:'luzOk',mod:-20,ok:async()=>{F.luzOk=1;await talkLuz()},fail:()=>play(TEXT.luzQuiet)}]},'luzq');return}
 if(p<2&&!has('wes')){await play(TEXT.luzTwelve);clue('wes',TEXT.cWesLuz);checkpoint();return}
 await hotspot({name:'LUZ',look:()=>play(TEXT.luzAfter),opts:[
  {use:'talk',label:TEXT.luzSeven,once:'luz7',show:()=>!has('royce')&&(p===1||p===2),ok:async()=>{await play(TEXT.luzSevenDo);clue('royce',TEXT.cRoyce);checkpoint()},fail:()=>said(TEXT.luzSevenNo)}]},'luz')}
async function room12Door(){const F=G.flags;
 if(has('wes')||F.r12){await goTo('room12',5,6,'up');return}
 await play(TEXT.r12Shut);
 await hotspot({name:'ROOM 12',opts:[{use:'force',ok:async()=>{F.forced=1;F.r12=1;await said(TEXT.r12Force);await overstepHere('seen');await goTo('room12',5,6,'up')},fail:()=>said('The door holds. Travis turns the TV up. It\'s still on mute.')}]},'r12')}
async function talkTravis(){const F=G.flags;
 if(has('travis')){await play(TEXT.travisAfter);return}
 if(!F.travis1){F.travis1=1;await play(TEXT.travis1)}
 const tell=async()=>{await play(TEXT.travisTell.slice(0,2));await horror(HORRORS.arms);await play(TEXT.travisTell.slice(2));await gotTravis()};
 await hotspot({name:'TRAVIS',opts:[
  {use:'talk',label:TEXT.travisTalk,ok:tell,fail:()=>said(TEXT.travisFail)},
  {use:'calm',ok:tell,fail:()=>said(TEXT.travisFail)},
  {item:'painkillers',label:TEXT.travisMeds,run:tell},
  {item:'medkit',label:TEXT.travisMeds,run:tell}]},'travis')}
async function gotTravis(){clue('travis',TEXT.cTravis);await takeCopy('travis');checkpoint()}
function travisSearch(){const here=ph()<2;if(cpOf('travis'))return[];return[
 {use:'sweep',label:'Lift the mattress',ok:async()=>{await play(TEXT.travisSweep);await gotTravis()},fail:()=>said('A sock. A lighter. A fortune from a fortune cookie: YOU WILL BE HAPPY IN SACRAMENTO.')},
 {label:TEXT.travisWait,show:()=>here,run:async()=>{addLate();await fade(1);await play(TEXT.travisWaitDo);await fade(0);await gotTravis()}}]}
// Room 7: Kettering. With `royce` (day 1 to day 2) he opens up; the ghost answer at the deduction shuts it for good.
async function room7Door(){const F=G.flags,p=ph();
 if(p>=3&&!royceDealt()){await said(TEXT.r7Gone);return}
 if(F.deduce==='ghost'&&!royceDealt()){await said(TEXT.r7Closed);return}
 if(!has('royce')||royceDealt()){await said(royceDealt()?TEXT.royceLeft:TEXT.r7Shut);return}
 if(!F.royce1){F.royce1=1;await play(TEXT.royce1);await trigger('liar')}
 const talk=async()=>{F.royce='talked';F.chant=1;await play(TEXT.royceTalk);await handOver()};
 await hotspot({name:TEXT.royceName,look:TEXT.royceLook,opts:[
  {use:'lean',label:TEXT.royceLean,ok:talk,fail:()=>said(TEXT.royceFail)},
  {use:'talk',label:TEXT.royceLean,once:'r7talk',ok:talk,fail:()=>said(TEXT.royceFail)},
  {use:'sneak',label:TEXT.royceSneak,once:'r7sneak',ok:async()=>{F.royce='stolen';F.chant=1;await play(TEXT.royceSneakDo);await handOver()},fail:()=>said(TEXT.royceSneakFail)},
  {use:'force',ok:async()=>{F.forced=1;await said(TEXT.royceForce);await overstepHere('seen');await talk()},fail:()=>said('The door\'s chained, and the chain is better than the door.')},
  {label:TEXT.royceLeave,run:()=>said(TEXT.royceLeft)}]},'room7')}
async function handOver(){for(const k of COPIES)if(cpOf(k)==='royce'){setCp(k,'got');await pickup('trkcopy')}checkpoint()}
function trashOpts(){if(has('royce')||ph()>=3)return[];const got=async()=>{await play(TEXT.r7TrashDo);clue('royce',TEXT.cRoyce);checkpoint()};
 return[{use:'sneak',ok:got,fail:()=>said(TEXT.r7TrashNone)},{use:'examine',ok:got,fail:()=>said(TEXT.r7TrashNone)}]}

// ================= OFFICER KO AND CHERRY =================
async function talkTeri(){const F=G.flags;
 if(!F.teri1){F.teri1=1;await play(TEXT.teri1)}else{await play(TEXT.teriAfter)}
 if(!has('bin'))await hotspot({name:'OFFICER KO',opts:[{use:'talk',label:TEXT.teriAsk,once:'teriAsk',ok:async()=>{await play(TEXT.teriAskDo);clue('bin',TEXT.cBinKo);checkpoint()},fail:()=>said('"I can\'t talk about the people on my beat," she says. "Even the weird ones. Especially."')}]},'teri')}
async function talkCherry(){const F=G.flags;
 if(has('cherry')){await play(TEXT.cherryAfter);return}
 if(!F.cherry1){F.cherry1=1;await play(TEXT.cherry1);checkpoint()}
 const tell=async()=>{await play(TEXT.cherryTell);clue('cherry',TEXT.cCherry);checkpoint()};
 await hotspot({name:'CHERRY',opts:[{use:'read',label:TEXT.cherryAsk,ok:tell,fail:()=>said(TEXT.cherryFail)},{use:'talk',label:TEXT.cherryAsk,ok:tell,fail:()=>said(TEXT.cherryFail)}]},'cherry')}

// ================= GIDEON (the human story fight) =================
async function talkGideon(){const F=G.flags;
 if(has('gideon')&&cpOf('gideon')){await play(TEXT.gideonAfter);return}
 if(!F.gid1){F.gid1=1;await play(TEXT.gideon1)}
 const notes=async(lines)=>{await play(lines);if(!has('gideon'))clue('gideon',TEXT.cGideon);if(!has('royce'))clue('royce',TEXT.cRoyceGid);checkpoint()};
 await hotspot({name:'GIDEON',opts:[
  {use:'lean',label:TEXT.gideonLean,show:()=>!cpOf('gideon'),ok:async()=>{await play(TEXT.gideonLeanDo);F.gidWatch=1;await notes(TEXT.gideonNotesDo);await takeCopy('gideon')},fail:()=>said(TEXT.gideonNo)},
  {use:'talk',label:TEXT.gideonTalk,once:'gidTalk',show:()=>!F.gidWatch,ok:async()=>{F.gidWatch=1;await play(TEXT.gideonTalkDo);checkpoint()},fail:()=>said(TEXT.gideonNo)},
  {use:'crack',label:TEXT.gideonDB,once:'gidDB',show:()=>!has('gideon'),ok:()=>notes(TEXT.gideonDBDo),fail:()=>said('The laptop asks for a password. The password hint is "you know."')},
  {use:'records',label:TEXT.gideonNotes,once:'gidNotes',show:()=>!has('gideon'),ok:()=>notes(TEXT.gideonNotesDo),fail:()=>said('Eleven years of notes in a hand so small you\'d need his gloves to hold the page right.')},
  {item:'cash',label:TEXT.gideonCash,show:()=>!cpOf('gideon'),run:async()=>{await play(TEXT.gideonCashDo);await overpay();await notes(TEXT.gideonNotesDo);await takeCopy('gideon')}},
  {label:TEXT.gideonTake,show:()=>!cpOf('gideon'),run:fightNephews}]},'gideon')}
async function fightNephews(){const F=G.flags;const r=await battle(['nephew','buddy'],{story:true,intro:TEXT.nephewIntro});if(r==='lose')return gameOver();
 F.nephews='fought';await play(TEXT.nephewDone);if(!has('gideon'))clue('gideon',TEXT.cGideon);if(!has('royce'))clue('royce',TEXT.cRoyceGid);F.gidWatch=1;await takeCopy('gideon');G.M=buildGideon();checkpoint()}
// paying far over the price: seen, unless Big Hat's cover intel covers the first time
async function overpay(){const F=G.flags;if(intelOn('cover')&&!F.overpaid){F.overpaid=1;await said(TEXT.overpay);return}F.overpaid=1;await overstepHere('seen')}

// ================= COUNTY RECORDS (the inspector's photo) =================
const knowClub=()=>intelOn('club')||has('gideon')||!!G.flags.cherry1||has('cherry');
async function talkInes(){const F=G.flags;
 if(has('photo')){await hotspot({name:'INES',look:()=>play(TEXT.inesAfter),opts:[{use:'records',label:TEXT.inesCaption,show:()=>!has('cherry'),once:'caption',ok:async()=>{await said(TEXT.cCherryPhoto);clue('cherry',TEXT.cCherryPhoto);checkpoint()},fail:()=>said('The caption\'s in an inspector\'s handwriting, which is a kind of handwriting nobody can read.')}]},'ines2');return}
 if(!F.ines1){F.ines1=1;await play(TEXT.ines1)}
 if(!knowClub()){await play(TEXT.inesWhat);return}
 const O=TEXT.inesOpts,got=async lines=>{await play(lines);await findPhoto()};
 if(chief()){await play(TEXT.inesChief);
  await hotspot({name:'INES',opts:[{use:'creds',label:O.creds,ok:async()=>{await got(TEXT.inesCreds);await overstepHere('public')},fail:()=>said('She hands the badge back without a word.')},
   {use:'talk',label:O.talk,ok:()=>got(TEXT.inesWait),fail:()=>said('She shakes her head and goes back to her pencils.')}]},'inesChief');return}
 await hotspot({name:'INES',opts:[
  {use:'paper',label:O.paper,ok:()=>got(['She reads your slips, nods once like a teacher, and comes back in ten minutes with a box.']),fail:()=>said('She hands the slip back. "Wrong form. That\'s for dog licenses."')},
  {use:'crack',label:O.crack,ok:()=>got(['The microfiche index takes your query on the third try and spits out a box number like it\'s angry about it.']),fail:()=>said('The reader whirs and shows you 1974 at high speed until you feel sick.')},
  {use:'creds',label:O.creds,ok:async()=>{await got(TEXT.inesCreds);await overstepHere('public')},fail:()=>said('She hands the badge back without a word.')},
  {use:'sweep',label:O.sweep,once:'inesSweep',ok:async()=>{addLate();await got(TEXT.inesSweep)},fail:async()=>{addLate();await said('You go through every box. It isn\'t in any of them. Then Ines finds it on her desk, where it\'s been the whole time.');await findPhoto()}},
  {label:O.wait,run:async()=>{addLate();await got(TEXT.inesWait)}}]},'ines')}
async function findPhoto(){const L=lead(),F=G.flags;await play(TEXT.photo);await horror(HORRORS.photo);clue('photo',TEXT.cPhoto);
 // the cameo (an arc touch, at most one per case): the lead's first sighting ever rolls 0/1
 if(!F.cameo){F.cameo=1;if(!L.a.sawTall){await play(TEXT.cameo);L.a.sawTall=1;await horror(HORRORS.cameo,{who:[L]})}else await said(TEXT.cameoNo)}
 checkpoint()}

// ================= THE PAY PHONE (the deduction, day 2) =================
// Who's keeping her dancing? Right needs `gideon` plus `royce` or `photo` (Big Hat sends the bulk eraser). The ghost
// answer shuts Room 7; the wrong one costs the afternoon (late +1). Night 2 opens either way.
async function lookPhone(){const F=G.flags;if(ph()!==2||F.deduce){await said(TEXT.phoneAfter);return}await said(TEXT.phoneRing);await deduce()}
async function deduce(){const F=G.flags;
 await play(TEXT.phoneHi);await hunch(TEXT.hunch);
 const right=()=>has('gideon')&&(has('royce')||has('photo'));
 let r=await ask('BIG HAT','Well?',TEXT.deduceOpts);
 // Loose thread (an arc perk, spec 008): once per case, a wrong answer costs nothing and you can answer again
 const lt=!(r===1&&right())&&live().find(m=>perkOn(m,'truth'));
 if(lt){await say('',fillT(BLS.HOMEW.perkUsed,{p:BLS.HOMEW.perks.truth[0],n:lt.name}));r=await ask('BIG HAT','Well?',TEXT.deduceOpts)}
 if(r===1&&right()){F.deduce='right';await play(TEXT.dRight);await pickup('eraser')}
 else if(r===1){F.deduce='noproof';await play(TEXT.dNoProof)}
 else if(r===2){F.deduce='ghost';await play(TEXT.dGhost)}
 else{F.deduce='wrong';addLate();await play(TEXT.dWrong)}
 checkpoint()}

// ================= CLUB SATIN (night 2) =================
async function clubArrive(){const F=G.flags;
 if(F.club1)return;F.club1=1;
 await cut('club',()=>play(TEXT.club1));await horror(HORRORS.club);if(!party.some(m=>!m.gone))return;
 await trigger('subject','the dark');
 if(chief()){F.breaker=1;await play(TEXT.clubChief)}
 // Search's On guard (75) spots the watchers' beats
 const L=lead();if(skillVal(L.a,'Search')>=75&&!G.fs.used.onguard){G.fs.used.onguard=1;const o=SR.pct(chanceOf(L,'Search'));
  await say('',resultLine('ON GUARD · SEARCH',o),{auto:1000});if(o.ok)setTrail(G.M.roamers.flatMap(r=>r.path),'beat');else tried(L,'Search')}
 checkpoint();
 await cut('regular',()=>play(TEXT.regular1));
 const r=await battle(['regular'],{story:true,intro:TEXT.regularIntro,onStart:()=>bsay(fill(TEXT.regularSay[0]+': '+TEXT.regularSay[1],{}),1100)});if(r==='lose')return gameOver();
 F.regular=1;await said(TEXT.regularDone);checkpoint()}
function djOpts(){const F=G.flags;if(F.lights)return[];
 const on=async()=>{F.lights=1;await play(TEXT.djOn);G.M=buildClub();checkpoint()};
 return[{use:'crack',label:TEXT.djLights,show:()=>!F.breaker,mod:()=>intelOn('club')?10:0,ok:on,fail:()=>said(TEXT.djFail)},
  {use:'fix',label:TEXT.djFix,ok:on,fail:()=>said(TEXT.djFail)},
  {label:TEXT.djLights,show:()=>!!F.breaker,run:()=>said(TEXT.djChief)}]}
async function takeBar(){if(cpOf('bar')){await said(TEXT.barEmpty);return}await said(TEXT.barFind);await takeCopy('bar')}
async function openBox(){await lanternBox('club',['roadflare','flashbang','firstaid'],TEXT.coatBox);G.M=buildClub()}

// ================= THE DUB ROOM =================
function readOpts(){const F=G.flags;if(F.read)return[];
 const read=async()=>{F.read=1;await play(TEXT.readDo);checkpoint()};
 return F.chant?[{label:TEXT.readOpt,run:read}]:[{use:'translate',label:TEXT.readOpt,ok:read,fail:()=>said(TEXT.readFail)},{use:'identify',label:TEXT.readId,ok:read,fail:()=>said(TEXT.readFail)}]}
const knowName=()=>has('cherry')||!!G.flags.name;
async function talkVesper(){const F=G.flags;
 await play(TEXT.vespLook);
 if(knowName()&&!F.darlene){const r=await ask('',TEXT.vespName,[TEXT.vespSay,'Not now']);if(r===0){F.darlene=1;await play(TEXT.vespSayDo);checkpoint()}}
 await bossAsk()}
// The boss waits for you (Gameplay loop; play.md): Go in / Not yet, cursor on Not yet
async function bossAsk(){const F=G.flags;if(F.boss)return;
 const r=await askNotYet(TEXT.bossQ,TEXT.bossOpts);
 if(r===0)return bossFight();
 if(Math.abs(G.x-VX)+Math.abs(G.y-VY)<=1)StudioMove.place(G,Math.max(G.x,VX+2),VY+2,'up')}
// Vesper (Bosses; Combat numbers; tuned Nov 23, 2026 with tools/boss-sim.js). 56 HP, +2 per watch; −2 per copy burned
// (−10 for all five), −4 if her name was said, −6 if the chant was read backward (the working breaks early): 20 off with
// all three, 36%. Phase 1 dancing: 60% to hit; the spin (5), the rolling bar at everyone (2), WE KNOW (1, 0/1d3), and the
// encore (2) while any copy is still out there or carried: she heals 5, at most once per copy not burned, up to 3. Hard to
// hit while she dances (−5) unless the stage lights are on. Phase 2 at half: +5% to hit, one more rolling bar and one
// more spin, and DEX 18 unless her name was said. 3 or more watches: DEX +4 from the start. Watch 2 makes Identify free.
function bossSetup(){
 const F=G.flags,E=EN.vesper,w=F.trk|0,b=burned(),doors=Math.min(3,5-b),lit=!!F.lights,named=!!F.darlene,read=!!F.read;
 E.dex=14+(w>=3?4:0);E.evade=lit?0:5;E.heals=doors;
 E.moves=[['hit',5],['all',2],['san',1]].concat(doors?[['encore',2]]:[]);
 E.die=read?TEXT.bossReadDie:TEXT.bossDie;
 E.acts={encore:async e=>{if(e.heals>0&&e.hp<e.mhp){e.heals--;const h=Math.min(5,e.mhp-e.hp);e.hp+=h;await bsay(fill(TEXT.bossEncore,{v:h}),1300);return}
  const t=pickTarget(e);if(t)await foeHits(e,t,e.dmg)}};
 E.phase2={at:.5,hit:5,moves:{all:1,hit:1},line:named?TEXT.bossPhaseNamed:TEXT.bossPhase,on:async e=>{if(!named)e.dex=18}};
 const cuts=2*b+(named?4:0)+(read?6:0);
 return{hp:E.hp+2*w-cuts,cuts,lit}}
async function bossFight(o={}){
 const F=G.flags;F.bossSeen=1;
 await cut('boss',async()=>{await play(TEXT.boss1);if(F.darlene)await said(TEXT.bossNamed)});
 checkpoint();
 const S=bossSetup();
 const r=await battle(['vesper'],{boss:true,hp:S.hp,intro:TEXT.bossIntro,onStart:async()=>{
  if(S.cuts)await say('',TEXT.bossThin,{auto:1500});
  await say('',S.lit?TEXT.bossLit:TEXT.bossFast,{auto:1400});
  if(F.knowLight){G.fs.ident=G.fs.ident||[];if(!G.fs.ident.includes('en:vesper'))G.fs.ident.push('en:vesper');await say('',TEXT.bossIdent,{auto:1600})}}});
 if(r==='lose')return gameOver();
 if(o.noEnd)return;  // the simulator stops at the fight's end
 F.boss=1;await ending();
}
window.trkBoss=()=>bossFight({noEnd:true});  // the boss simulator's entry (tools/boss-sim.js)

// ================= OVERSTEPPING (Skills and menus, Overstepping and cover stories) =================
// A quiet case: the agents are collectors. A climb plays its line, then the step's scene: Noticed (Manny and Luz stop
// talking for free; Ko trails the team on night 2), Ko's scene (Local chief: records locks; on night 2 she pulls the
// club's breaker), Big Hat's call (Agency call), and the clean-up crew at the next area change.
async function overstepHere(seen){if(!(await overstep(seen)))return;await stepScene()}
async function stepScene(){
 const F=G.flags,s=stepName();
 if(s==='Noticed'&&!F.noticed){F.noticed=1;await play(TEXT.noticed)}
 if(s==='Local chief'&&!F.chief){F.chief=1;await play(TEXT.chief)}
 if(s==='Agency call'&&!F.call){F.call=1;await play(TEXT.call)}
 if(s==='Federal agents')F.fedsDue=1;
 checkpoint()}
async function onArea(){
 const F=G.flags;if(!F.fedsDue||F.fedsDone)return;F.fedsDone=1;
 await cut('feds',()=>play(TEXT.feds));const r=await battle(['fed','fed','fed'],{story:true,intro:TEXT.fedsIntro});if(r==='lose')return gameOver();
 await play(TEXT.fedsWin);F.shutDown=1;await ending({worst:true})}

// ================= ENDING =================
// clean: Vesper ended, the master erased, no copy out in the world, Wes saved, nobody on the team lost this case,
// overstepping below Agency call. costly: ended any other way. worst: Kettering got the master first, or the clean-up
// crew shut the case down.
const lostHere=()=>(store.get(B.key('memorial'),[])||[]).filter(x=>x&&x.case===G.case&&!x.done);
function endingLabel(){const F=G.flags;if(F.shutDown||F.masterGone)return'worst';
 return(!outCopies()&&F.wes&&!lostHere().length&&!stepAt('Agency call'))?'clean':'costly'}
function endingFacts(label){const F=G.flags;
 return{label,clues:G.clues.map(c=>c.id),saved:F.wes?1:0,overstep:stepName(),
  san:party.map(m=>({id:m.a.id,name:m.name,from:m.san0,to:m.san})),
  items:party.flatMap(m=>gearOf(m).it.filter(it=>it.pin).map(it=>it.k)).concat((G.fs.pack||[]).filter(it=>it.pin).map(it=>it.k)),
  choices:{deduce:F.deduce||null,watched:F.trk|0,burned:burned(),out:outCopies(),cut:F.cut||null,wes:F.wes||null,royce:F.royce||null,lights:!!F.lights,darlene:!!F.darlene,read:!!F.read,
   masterGone:!!F.masterGone,forced:!!F.forced,nephews:F.nephews||null,late:late(),shutDown:!!F.shutDown},
  tried:party.map(m=>({id:m.a.id,skills:m.tried||[]})),
  lost:lostHere().map(x=>({name:x.name,how:x.how}))}}
async function ending(o={}){
 const F=G.flags;
 if(!o.worst){await play(F.read?TEXT.end1Read:TEXT.end1);
  if(!F.masterGone)await said(holderOf('eraser')?TEXT.erase:TEXT.eraseHand);
  await said(TEXT.sleeve);await pickup('satin');
  if(!F.wes)await trigger('death')}
 await fade(1);G.mode='scene';await fade(0);
 if(!o.worst){await said(TEXT.dawn);await said(F.wes?TEXT.dawnWes:TEXT.dawnWesLost);
  if(F.masterGone)await said(TEXT.dawnWorst);else if(outCopies())await said(TEXT.dawnOut);else await said(TEXT.dawnClean)}
 G.rescued=F.wes?1:0;
 const label=endingLabel();await debrief(label,endingFacts(label));  // Big Hat's debrief and the case gains (debrief.js), in the buffet
}

// ================= THE DEBRIEF (spec 007) =================
// The clues the card counts, the one person to keep safe (Wes), Big Hat's lines by ending and about the choices, the
// cover stories (2 with a skill, the weak Luck one, the easy one on a clean quiet case, Clean books'), and the line after
// the Satin tape is bagged. It plays in the case's own place (registerCase place: the shut buffet).
const DB=TEXT.db;
const DEBRIEF_DATA={
 clues:['bin','wes','travis','gideon','photo','cherry','royce'],victims:1,
 lines:{clean:DB.clean,costly:DB.costly,get worst(){const c=G.db&&G.db.facts&&G.db.facts.choices||{};return c.masterGone?DB.worstTape:DB.worst}},
 react:F=>{const c=F.choices||{},out=[];
  if(c.wes)out.push(DB.wes);if(c.cut==='took')out.push(DB.cut);if(c.deduce==='wrong')out.push(DB.wrong);
  if(c.watched)out.push(['BIG HAT',DB.watched[1].replace('{v}',c.watched)]);else out.push(DB.never);
  if(c.royce)out.push(DB.royce);if(c.forced)out.push(DB.forced);if(c.nephews==='fought')out.push(DB.fought);
  return F.label==='worst'?out.slice(0,1):out.slice(0,3)},
 zip:[DB.zip],end:[TEXT.pie],
 stories:[{name:DB.wire,skill:'Bureaucracy',verb:'paper it',pass:DB.wirePass},
  {name:DB.prank,skill:'Persuade',verb:'sell it',pass:DB.prankPass,get mod(){const f=G.db&&G.db.facts;return f&&(f.clues||[]).includes('gideon')?20:0}}],
 weak:{name:DB.weak,pass:DB.weakPass},
 easy:{name:DB.easy,skill:'Persuade',verb:'sell it',mod:30,pass:DB.easyPass},
 safe:{name:DB.safe,pass:DB.safePass},
 bagged:{satin:[TEXT.filed]}
};

// ================= OPENING (Big Hat's briefing in the casino's shut buffet) =================
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
 },{place:window.TRKA.buffet});
 G.flags.ph=0;G.flags.trk=0;G.flags.cp={};G.mode='world';goMap('street',23,SY+2,'down');checkpoint();await fade(0);
 await cut('arrive',async()=>{
  for(const m of squad())await say(m.name.toUpperCase()+' · '+profOf(m.a).name.toUpperCase(),TEXT.role[profOf(m.a).role]||TEXT.roleAny);
  await said(TEXT.arrive)});
}
// the Case file's Next line
const caseNext=()=>{const N=TEXT.next,F=G.flags,p=ph();
 if(F.boss)return N.home;
 if(p===0)return N.d1;if(p===1)return N.n1;if(p===2)return F.deduce?N.d2b:N.d2;
 return F.club1&&!trapKnown()?N.n2b:N.n2};

// ================= ON THE CASE BOARD =================
// portraits: the townsfolk's faces (tracking-art.js) and the boss's (tracking-battle-art.js). sprite/spriteSize: battle
// sprites (the head watcher wears the watcher's; the clean-up agent is Still Harvest's SHB).
const spr=k=>k==='watcherbig'?'watcher':k;
registerCase({id:'tracking',card:caseCard,opening:caseOpening,intel:TEXT.intel,maps:MAPS,tiles:{},
 portraits:name=>window.TRKA.portraits[name]||(name==='VESPER'||name==='DARLENE'?window.TRKB.portrait:null),
 enemies:EN,sprite:(k,f,w)=>k==='fed'&&window.SHB?SHB.sprite('fed',f,w):TRKB.sprite(spr(k),f,w),spriteSize:k=>k==='fed'&&window.SHB?SHB.size('fed'):TRKB.size(spr(k)),
 backdrop:(p,o)=>TRKB.backdrop(p==='room8'||p==='room12'||p==='wes'||p==='pawn'?'street':p,o),
 get place(){return window.TRKA&&TRKA.buffet},  // Big Hat's place for this case: the briefing passes it, and the debrief plays there too (engine.js casePlace)
 items:CASE_ITEMS,next:caseNext,quiet:true,loot:LOOT,onArea,
 debrief:DEBRIEF_DATA,label:endingLabel,facts:endingFacts});
})();
