// Black Lantern · cases/dead-air.js
// CASE: Dead Air (FILE 06), Halcott, Louisiana, a sugarcane parish town in early March (spec 020).
// Part A (Nov 23, 2026): the card, every map (Halcott's Main Street and Bayou Street by day and night, the sheriff's
// office, two homes, the church hall set for the fish fry, the feed store, the KHLT station grounds by day and night, its
// broadcast booth and record room, the cane fields and the finale area), the broadcast look, the townsfolk on the map
// and in the dialog box, Big Hat's own briefing place, and walkable maps with every door and drive going where it should.
// Part B (Nov 23, 2026): the story and play, written from the secret case file: the text block, the briefing's four
// topics and their edges, the two broadcasts and what the team tries during each, skill-driven clues, the fish fry, a
// deduction, choices that rejoin, overstepping, two story fights, the cane's roamers, a Lantern Box, the soft clock
// (the town's fear), the boss and its tuning, the motivation moments, the debrief's facts and cover stories, and the endings.
// Art is cases/dead-air-art.js (window.DAA, the maps and people) and cases/dead-air-battle-art.js (window.DAB, the
// enemies, the boss's face and the battle backdrops), loaded right after this file. Needs engine.js, field.js and
// battle.js first. The whole file sits in one function so its names never meet another case's.
(function(){

// ================= TEXT =================
// Every line of the case (Voice). A list plays box by box: a plain string is narration, ['WHO', 'line'] is someone
// talking. {code} and {first} are the lead's, with pronoun tokens like {first.their} (Agent creator, Pronouns and
// body); {n}, {t}, {x} and the other one-letter keys are filled by the script.
const TEXT={
 next:{dutch:'Check in with Sheriff Fontenot. His office is on Main Street.',
  day1:'Day 1. Ask around Halcott: {n}/3 things that add up. When you\'re ready, wait in the car for three in the morning.',
  night1:'Night 1. Listen to the show from Miss Odile\'s porch on Bayou Street.',night1b:'Night 1. The show\'s over. Call it a night in the car.',
  day2:'Day 2. {n}/3 things that add up. The car drives to KHLT. The fish fry is at the church hall.',fry:'Day 2. Go to the fish fry at the church hall.',
  deduce:'Answer the church hall\'s kitchen phone. It\'s Big Hat.',rest2:'Wait in the car for night.',
  night2:'Night 2. Drive out to KHLT. The show comes on at three.',night2b:'Night 2. North into the cane, to the bare circle.',home:'Get home.'},
 phase:['DAY 1 · THURSDAY AFTERNOON','NIGHT 1 · 2:50 AM','DAY 2 · FRIDAY','NIGHT 2 · 11:40 PM'],
 rewritten:'This case file was rewritten while you were away. Your team starts it over from the briefing, with everything they carry.',
 // ---- the briefing: a bait shop's back porch off I-10 ----
 open1:'WEDNESDAY · 11:14 PM · 64°F',
 open2:'A text from an unlisted number: "I-10, EXIT 92. THE BAIT SHOP. AROUND BACK. COME HUNGRY."',
 brief:['The back porch of a bait shop off I-10. A crawfish pot steams on a propane burner. A radio sits on the rail, unplugged, its cord wrapped around it tight, like somebody tied it up.',
  ['BIG HAT','Agent {code}. Sit. Mind the bait tanks.'],'He\'s on a cooler, peeling a crawfish with one hand. He doesn\'t look at the radio. He sat with his back to it on purpose.',
  ['BIG HAT','Halcott, Louisiana. Two thousand people, one stoplight, and a radio station that went off the air in 1979.'],
  ['BIG HAT','Two weeks ago it came back on. Three in the mornin\'. Every radio in the parish picks it up, plugged in or close enough.'],
  ['BIG HAT','Call-in show. Nobody can name the host. The callers say names. People in town.'],
  ['BIG HAT','Two of the people they named are gone. Walked out of their houses before sunup and didn\'t come back.']],
 briefShout:'AND NOBODY IN THAT PARISH WILL TURN THEIR GODDAMN RADIO OFF.',
 brief2:['He sucks the head of a crawfish. Thinks about it. Throws the shell in the bait tank. The bait doesn\'t care for it.'],
 // Big Hat's two questions (spec 013): the four topics, his two-box answer, the Case file's INTEL line. The edges are in
 // the scripts: intelOn('station') +10 to trace the signal, 'missing' +10 Empathy with the two families, 'sheriff' the
 // first overstepping climb forgiven once, 'town' +10 Persuade at the fish fry.
 intel:[
  {id:'station',label:'The station',answer:['KHLT. 1340 on your AM dial. Off the air since \'79, tower never came down.','Somebody says it\'s pirates. Find where the signal comes up and I\'ll tell you if it\'s pirates.'],
   note:'KHLT 1340 AM, dead since 1979, broadcasts at 3 AM. Find where the signal really comes from.'},
  {id:'missing',label:'The missing',answer:['A grandmother and a pipefitter. Darlene Achord and Wade Hebert. Both named on the air, both gone the same night.','Their families\'ll talk to a badge. Be decent about it.'],
   note:'Darlene Achord and Wade Hebert went missing the nights they were named. Their families will talk.'},
  {id:'sheriff',label:'The sheriff',answer:['Dutch Fontenot. Called it in himself, which sheriffs don\'t. He was given this number years ago and sat on it.','He\'ll help while the town stays calm. He\'ll let one thing slide. One.'],
   note:'Sheriff Dutch Fontenot called you in himself. He\'ll forgive one mistake.'},
  {id:'town',label:'The town',answer:['Two thousand people, and every one of \'em owns a radio.','They\'re scared, and they\'re lookin\' for somebody to be scared of. Friday\'s the fish fry. Whole town in one room.'],
   note:'Halcott is scared and looking for someone to blame. The whole town goes to Friday\'s fish fry.'}],
 brief3:[['BIG HAT','You go in with badges. Federal radio inspectors. Nobody knows what that is, so nobody argues.'],
  ['BIG HAT','Silence that station. Find those two. And find out who\'s callin\' in.']],
 brief4:[['BIG HAT','{first}. When you\'re out there at three in the mornin\' and that thing says your name?'],['BIG HAT','Don\'t answer it.'],
  'He goes back to his crawfish. Behind him the unplugged radio sits on the rail with its cord tied around it.'],
 arrive:'DEAD AIR. Talk to people with A. Press START for your notebook and party.',
 role:{Investigator:'A dead station with a call-in show. Somebody\'s got a transmitter in a barn.',Healer:'Two missing, two weeks. That\'s a lot of nights outside.',Analyst:'For the record, AM radio carries a long way at night. Skip propagation.',
  Vanguard:'If it\'s a guy in a shack with a microphone, I\'d like to meet him.',Lorekeeper:'1979. Something happened in this town in 1979. Something always did.',Tech:'1340 AM. I brought a scanner. I brought two.',
  Bruiser:'They got a fish fry Friday. I\'m just saying.',Support:'Everybody bring a jacket. It\'s gonna be damp out there.',Tracker:'Cane fields on three sides and a bayou on the fourth. Lot of places to walk into.',
  Confessor:'Two families sitting by a phone. Somebody ought to sit with them.',Courier:'Every porch on this street has a radio on the rail.',Undertaker:'Nobody\'s found a body. That\'s the bad version.',
  Scrapper:'Smells like boudin. My kind of town.',Morale:'Fish fry Friday. Catfish a dollar a piece. Morale is fine.'},
 roleAny:'Let\'s go find the off switch.',
 // ---- the car and the days (Turning the day: Go on / Not yet, cursor on Not yet) ----
 car:'The car. A government sedan, and it looks it.',carQ:'Where to?',
 carOpt:{khlt:'Drive out to KHLT',town:'Drive back to Halcott',wait:'Wait for 3 AM',sleep:'Call it a night',night:'Wait for night'},
 driveTo:{khlt:'Four miles out the field road, cane on both sides. The tower comes up over it, red and white, blinking.',town:'Back into Halcott. The stoplight\'s red. It\'s always red.'},
 walkTo:{khlt:'Dutch has your keys "for safekeeping". Remy Guidry drives you out in his truck and doesn\'t ask why.',town:'Remy\'s truck. A crawfish rides in his shirt pocket the whole way.'},
 turnOpts:['Go on','Not yet'],
 turnDutch:'Check in with the sheriff first. He called you. It\'s polite.',
 turnClues:'Not yet. You\'ve got {n}/3 things that add up. Big Hat will want three.',turnFry:'The fish fry. You told the pastor you\'d come. So did everybody.',
 turnDeduce:'The church hall\'s kitchen phone has been ringing. Somebody should answer it.',
 wait1Q:'Wait in the car for three in the morning?',wait1Close:'The shops, the sheriff\'s office and both houses close for the night.',
 wait1:['The shops close at six. The streetlights come on at seven. At nine, porch lights, one at a time, all down Bayou Street.','Nobody turns on a TV. Nobody turns on anything.','At a quarter to three, every radio on Bayou Street starts to hum. Plugged in or not.'],
 sleepQ:'Call it a night?',sleepClose:'Toby\'s night shift and Miss Odile\'s porch at three in the morning are tonight only.',
 sleep:['You sleep in the car, badly. The seat belt buckle finds your spine.','Friday comes up grey and warm. Somebody, somewhere, is already frying something.'],
 wait2Q:'Wait in the car for night?',wait2Close:'The fish fry ends, and the tower by daylight is gone for good.',
 wait2:['The fish fry winds down. People carry their plates home under foil and don\'t look at each other\'s porches.','Out past the cane, the tower\'s red light blinks. Slow. Like it\'s breathing.'],
 hwy:'The road out to the interstate. Not yet.',bayou:'The bayou. Still and brown. A turtle on a log, and another turtle, watching the first turtle.',
 rowsDay:'Cane in rows to the horizon. Whatever\'s out there waits for dark.',
 // ---- Sheriff Dutch Fontenot (the Local chief, from the first scene) ----
 dutch1:[['SHERIFF','Dutch Fontenot. I called you.'],'He shakes your hand like it\'s a thing he read about.',['SHERIFF','Fella gave my daddy a number to call, years back. For when it\'s something we can\'t do nothing about. I sat on it two weeks.'],
  ['SHERIFF','Two people gone. Darlene Achord and Wade Hebert. Both named on that thing, both walked out before sunup. Wade took his radio.'],
  ['SHERIFF','Here\'s my one rule. Keep this town calm. It\'s gettin\' mean out there. You make a scene, I\'ll know before your coffee\'s cold.']],
 dutch0:[['SHERIFF','Anything? I\'d take a pirate. I\'d take a teenager. I\'d take a good old-fashioned devil.']],
 dutch2:[['SHERIFF','Fish fry\'s tonight. Whole parish under one roof, scared to death and full of beer. Pray for me.']],
 dutchNight:'The sheriff\'s office is dark. A note on the door: GONE HOME. CALL 911. DON\'T CALL ME.',
 dutchChief:[['SHERIFF','I told you. One rule.'],['SHERIFF','You\'re done in this office. I\'ll take your car keys too, for safekeepin\'. You want to go somewhere, walk.']],
 dutch79:'1979 file',
 dutch79Shut:[['SHERIFF','That\'s before my time.'],'It isn\'t. He\'s sixty-four.'],
 dutch79Open:[['SHERIFF','...Royce Achord. Joelle told you, huh.'],['SHERIFF','The Night Line. Midnight to four. Royce hosted. A boy named Emile Broussard ran the board. Never said a word on the air.'],
  ['SHERIFF','March of \'79 somethin\' happened at that station. My daddy\'s file says "equipment fault". My daddy didn\'t write files.'],
  'He takes a folder out of his bottom drawer. He doesn\'t hand it over. He just puts it on the desk and goes to get coffee.'],
 cLog:'The Night Line\'s last show, March 9, 1979: host Royce Achord, engineer Emile Broussard. "Off air 3:41 · equipment fault", in a hand that shakes.',
 fileFind:['ST. ODILE PARISH SHERIFF · INCIDENT 79-031 · KHLT. Two lines: "Disturbance at radio station. Equipment fault. No further action."','Clipped behind it, the station\'s own program log for March 9, 1979. NIGHT LINE · R. ACHORD · E. BROUSSARD.','At the bottom: "OFF AIR 3:41 · EQUIPMENT FAULT." The pen went through the paper on the T.'],
 order:'Parish order',orderDo:[['SHERIFF','Every radio in Halcott unplugged by sundown. On parish paper.'],['SHERIFF','They\'ll hate it. They\'ll do it. Renée, get the stamp.']],
 orderNo:[['SHERIFF','I can\'t sign that. Folks need the weather.']],
 board:'MISSING BOARD',boardLook:'The missing-persons board. Darlene Achord, 58, in a church directory photo. Wade Hebert, 34, holding a redfish. A map of the parish with two pins, both on Bayou Street.',
 boardSweep:['Under the photos, Renée\'s handwriting: every name said on the air, by night. Fourteen names. Next to each one, she\'s written a grandfather.','Hebert. Achord. Arceneaux. Guidry. Thibodeaux. Fontenot. The same eleven last names, over and over, like a guest list.'],
 fiche:'MICROFICHE',ficheLook:'An old microfiche reader on the corner desk. A box of reels: ST. ODILE BANNER, 1970–1985.',
 ficheRec:['March 1979, the St. Odile Banner: "LOCAL GIRL FOUND SAFE IN BATON ROUGE." Annette Guidry, 12. Then, a week later, one paragraph: "KHLT SIGNS OFF."','You cross the names from the air against the parish rolls. Every one of them is the child or grandchild of eleven men.','Eleven men who, the same week, all took the same Friday off work.'],
 fichePaper:['The parish rolls, 1979. You line them up with Renée\'s list of names from the air.','Every name on the air is the child or grandchild of the same eleven men.'],
 ficheLong:'Read the whole reel',ficheLongDo:['You read every issue of 1979 by hand. Hog prices. A tornado in Duson. The 4-H. It takes the afternoon.','March: a girl found safe in Baton Rouge, and KHLT signing off. You cross every name from the air against it. Eleven families.'],
 ficheQuick:['Marcy said Wade\'s granddad drove a truck out to the station in \'79. You go straight to March.','KHLT signs off a week after a girl is found safe. Every name from the air: the grandchildren of the same eleven men.'],
 cNames:'Every name said on the air is a child or grandchild of the same eleven Halcott men, from March 1979.',
 shelf:'EVIDENCE SHELF',shelfLook:'Radios, tagged and bagged: CONFISCATED. Behind them, a handheld loop antenna with a needle, tagged "PIRATE?? 2026".',
 shelfFind:'"Take it," Renée says. "I tried. The needle just points at the ground."',
 cell:'The holding cell. Empty, and the door open. Somebody\'s left a Bible on the cot.',
 lucienCell:[['MR. ARCENEAUX','Dutch says I\'m safer in here. He took my belt.'],['MR. ARCENEAUX','No radio in here. That\'s the point, I guess.']],
 lucienCellAsk:'Ask him for what\'s in his safe',lucienCellGive:[['MR. ARCENEAUX','...The combination\'s 9-3-79. Course it is.'],['MR. ARCENEAUX','Take it. I been waitin\' forty-seven years for somebody to come take it.']],
 coffee:'A coffee maker on its third pot. The pot says WORLD\'S OKAYEST DEPUTY.',
 counterS:'The front counter. A bell, a clipboard, a jar of peppermints, and a sign: WE DO NOT KNOW WHO IS ON THE RADIO.',
 // ---- Deputy Renée Theriot ----
 renee1:[['DEPUTY','Renée Theriot.'],'Her scanner crackles on her belt. 1340, she says, just in case.',['DEPUTY','You think that\'s crazy? I\'ve been unplugging radios on my own time. Folks call me the Radio Lady. Not nice.']],
 renee2:[['DEPUTY','Want to know a secret? I listen. Every night. To know who\'s next.']],
 reneePull:'Pull the radios with her',reneePullDo:['You and Renée go porch to porch with a box. Old men hand over their radios like you asked for their guns.','By four, Bayou Street\'s quiet. Everybody\'s watching you do it.'],
 reneeDone:[['DEPUTY','That\'s the street. The rest of town, I don\'t know.']],
 // ---- the families ----
 joelle1:[['JOELLE','Joelle. Darlene\'s my mother.'],['JOELLE','I\'m a nurse in Lafayette. I drove down when she didn\'t pick up. Two weeks. And this town wants to talk about radios.']],
 joelleLie:[['JOELLE','She\'s fine. She\'s gonna walk in that door and ask why I didn\'t do the dishes.']],
 joelleTruth:[['JOELLE','...She heard her name. She unplugged it. Look. She unplugged it and she wrote that note.'],
  ['JOELLE','And she still went. She took the little transistor, the one Pawpaw gave her.'],['JOELLE','My grandfather hosted a show on that station. Royce Achord. The Night Line. Nobody in this family talks about it. Now I know why.']],
 joelleAfter:[['JOELLE','If you find her, tell her I did the dishes.']],
 note:'THE NOTE',noteLook:['A radio on the kitchen table, unplugged, the plug still in a woman\'s hand-written note: TURN IT OFF.','Under it, again: TURN IT OFF. Then again, bigger. Then the letters stop fitting on the page.'],noteH:'Darlene\'s note',
 marcy1:[['MARCY','Marcy Hebert. Wade\'s my husband.'],['MARCY','I heard his name. On the radio. I was doing the bottles and I heard "Wade Hebert, out in the rows".'],['MARCY','I turned it up. I turned it up.']],
 marcyTruth:[['MARCY','His granddaddy. Ozzie Hebert. He drove a truck out to that station in \'79, him and ten others. Nobody says what for.'],['MARCY','Wade asked him once, at Christmas. Ozzie put his fork down and went out to the truck and sat in it.'],
  'The kids are watching you from the hall. The little one has a toy radio. Marcy takes it away from her without looking.'],
 marcyAfter:[['MARCY','The kids think Daddy\'s fishing. Daddy\'s always fishing.']],
 shelfGap:'A shelf of knickknacks with a clean square in the dust where a transistor radio sat. Wade\'s.',
 drawings:'Kids\' drawings on the fridge. A house, a dog, a man with a fishing pole. In the newest one the man is standing in a field with a box held to his ear.',
 photos:'Family photos up the wall. A wedding. A graduation. A man in a radio station booth in 1977, big hair, bigger tie, laughing at somebody off camera.',
 // ---- Miss Odile ----
 odile1:[['MISS ODILE','You\'re the radio people.'],'The nutria on her leash looks up at you. Chou-Chou, she says. Chou-Chou don\'t bite. Most days.',
  ['MISS ODILE','Every radio I own is on that porch, playin\' static, all night. Static keeps it out. I don\'t care what anybody says.']],
 odileLie:[['MISS ODILE','I don\'t listen to it. I don\'t know that voice. I don\'t know nothin\'.']],
 odileTruth:[['MISS ODILE','...That\'s my brother.'],['MISS ODILE','Emile. He ran the board on the Night Line. Nine years. Never said one word on the air. He was shy. He\'d go red if you said good mornin\'.'],
  ['MISS ODILE','Forty-seven years nobody in this town says his name. Now he\'s on every radio in the parish, sayin\' theirs.'],['MISS ODILE','That ain\'t him. He wouldn\'t. But it\'s his voice.']],
 cEmile:'Emile Broussard ran KHLT\'s board for nine years and never once spoke on the air. The host\'s voice is his.',
 odileGive:['MISS ODILE','Here. Take one. Hold it up to anything that talks at you out of the dark. It don\'t like the quiet.'],
 odileAfter:[['MISS ODILE','Chou-Chou, say hello.'],'Chou-Chou does not say hello. Chou-Chou is eating a pecan.'],
 odileNight:[['MISS ODILE','You hear that hum? Three o\'clock. Sit if you want. Don\'t touch the dial.']],
 odileSit:'Sit up with her',odileSitDo:['You sit with Miss Odile till the porch light draws every moth in the parish. She doesn\'t say anything for an hour.',
  ['MISS ODILE','That\'s Emile. My brother. He ran the board. Never said one word on the air in nine years.'],['MISS ODILE','Now he won\'t shut up.'],'You don\'t sleep. Nobody on Bayou Street does.'],
 porch:'Miss Odile\'s porch. Every radio she owns is out here, nine of them, all playing static, all night.',
 // ---- the porch radio and the first broadcast (night 1) ----
 radioName:'THE PORCH RADIO',radioLook:'An old tabletop radio on Miss Odile\'s porch, its dial glowing amber. The needle sits on 1340. It wasn\'t on 1340 a minute ago.',
 radioDay:'An old tabletop radio on Miss Odile\'s porch, playing static. She keeps it on 1340, minus a hair.',radioDone:'The radio hisses. The needle sits on 1340.',
 radioOpt:'Listen',
 show1:['3:00 AM. The hum goes quiet. Every radio on the porch at once. Then a click, and a room, and somebody breathing close to a microphone.',
  ['THE HOST','Good mornin\', Halcott. You\'re on the Night Line. It\'s a little after three, and it\'s a soft night out there.'],
  ['THE HOST','Lines are open. Go ahead, caller.'],
  ['CALLER','Yeah. Yeah, I\'d like to request somethin\' for the Hebert boy. He\'s out in the rows. Somethin\' slow.'],
  ['THE HOST','Sure thing. Somethin\' slow for Wade.'],'No song plays. Just the room, and the breathing.',
  ['CALLER','Hi, hon. I got a recipe. Gumbo. First you make a roux. Then you get you a Guidry, a Thibodeaux, two Heberts...'],
  ['CALLER','...a Fontenot, a Broussard, a Guidry, a Guidry, a Guidry...'],'Her voice doesn\'t change. It just keeps going, and the names keep coming, like she\'s reading them off a list.',
  ['THE HOST','Thank you, caller. One more.'],['CALLER','Lucien Arceneaux.'],['CALLER','You know what you took.'],
  'Chou-Chou gets under the porch swing and won\'t come out.'],
 show1H:'A voice you can\'t place, saying names',
 show1End:['3:33 AM. Three seconds of breathing. Then the carrier drops to hiss, and the porch is just a porch.',['MISS ODILE','He always signs off at 3:33. Always did.']],
 show1Q:'The host is taking calls. You can try one thing.',
 traceOpt:'Trace it',loopOpt:'Loop antenna',recOpt:'Record it',callOpt:'Call in',listenOpt:'Just listen',
 traceDo:['You turn the loop slow, a few degrees at a time. The signal\'s strongest out past the tower. North of it.','Then the needle dips. Not toward the tower. Down.','It\'s coming up out of the ground. Out in the cane, north of the tower, under the field.'],
 traceFail:'The needle spins. The signal\'s everywhere at once, like it\'s coming from the porch boards.',
 cTrace:'The signal doesn\'t come from KHLT\'s tower. It comes up out of the ground, in the cane north of it.',
 recDo:['You hold the recorder up to the speaker and get every second.','Played back, the callers have that sound old tape has. A room with men in it. Somebody\'s cough, the same cough, in two different calls.'],
 recFail:'The tape gets three minutes of hiss and your own breathing. The show\'s still on. The tape isn\'t.',
 cVoices:'The callers are old voices, cut up and put back together: the same men, the same room, in every call.',
 callDo:['Miss Odile\'s kitchen phone is a rotary on the wall. Taped next to it: NIGHT LINE REQUESTS, and a number with five digits.','It rings once.',['THE HOST','Night Line. You\'re on the air.']],
 callHost:[['THE HOST','Oh. Hey there, {first}.'],['THE HOST','How\'s {b} doin\'? You been sleepin\' all right? You don\'t look like you been sleepin\'.'],
  ['THE HOST','Stay on the line, now. I\'d like to keep you.'],'Every radio on the porch says your name. Then the line goes dead, and the porch radio says it once more, softer.'],
 callH:'It said your name',
 callAfter:'The callers\' voices were behind the host the whole time. Old voices. The same three men, cut up and played back.',
 named:'{n} is NAMED. All day tomorrow, every bit of static sounds like somebody saying {n.their} name.',
 listenDo:'You let it play. Miss Odile holds Chou-Chou\'s leash and mouths along with the sign-off.',
 // ---- Toby at the Gas-N-Go ----
 toby1:[['TOBY','We\'re open. I mean. It says open.'],['TOBY','I don\'t listen to it. That radio\'s just for company. Behind the counter. It\'s off. Mostly.']],
 tobyLie:[['TOBY','I don\'t listen to it.'],'Behind the counter, the radio\'s on. The volume\'s down to almost nothing, and the dial\'s on 1340.'],
 tobyTruth:[['TOBY','Okay. Okay, I listen. Every night. I write the names down so I know who to be nice to.'],['TOBY','Last night, though. Last night it said "the Arceneaux boy". Mr. Arceneaux\'s sixty-six.'],
  ['TOBY','It said it like it was 1979.']],
 tobyGive:['TOBY','Here. Coffee\'s free after midnight. It\'s also bad after midnight.'],
 tobyAfter:[['TOBY','I\'m gonna sleep with the lights on till I\'m forty.']],
 tobyNight:[['TOBY','Is it on? It\'s on, isn\'t it. I can feel it in my teeth.']],
 gasgo:'GAS-N-GO. BOUDIN · COLD BEER · LIVE BAIT. A hand-lettered sign: RADIO STAYS ON.',
 // ---- Remy Guidry ----
 remy1:[['REMY','Remy. Bait shop\'s mine. Mama Lou\'s my grandmama.'],'Something moves in his shirt pocket. A crawfish. Its name is Pierre.',['REMY','You need a boat, I got a boat. You need the field road, I know the field road.']],
 remyCandy:'Pasture caps?',remyCash:'Buy a sack off him',
 remyCandyDo:[['REMY','Who told you about pasture caps?'],['REMY','...Ten dollars. They grow in Thibodeaux\'s cow pasture past the cane. Don\'t eat \'em out there. Don\'t eat \'em near water. Don\'t call me.']],
 remyAfter:[['REMY','Pierre says don\'t go in the cane after dark.'],'Pierre says nothing. Pierre is a crawfish.'],
 remyNap:'Nap in Remy\'s truck (rest)',remyNapDo:['You sleep three hours in the bed of Remy\'s truck, on a dog bed that isn\'t yours.','When you wake up the town\'s louder. Somebody on Main Street is yelling about radios.'],
 truck:'A pickup, rust over red, a dog bed in the back. Remy\'s.',
 // ---- the feed store and Lucien Arceneaux ----
 lucien1:[['MR. ARCENEAUX','Arceneaux Feed and Seed, since 1951. My daddy\'s.'],['MR. ARCENEAUX','I don\'t have a radio in here. Never did.'],'There\'s a radio on the shelf behind him. It\'s unplugged. The cord\'s been cut.'],
 lucienLie:[['MR. ARCENEAUX','I heard my name. So what. Lot of Arceneauxs.'],'There are three Arceneauxs in St. Odile Parish. Two are in the cemetery.'],
 lucienTruth:[['MR. ARCENEAUX','...I was nineteen. I was in the last truck.'],['MR. ARCENEAUX','A week after, I went out to that station by myself and pulled the crystal out of the transmitter. The little thing that makes it 1340.'],
  ['MR. ARCENEAUX','I couldn\'t think what else to do. I been keepin\' it in that safe forty-seven years.'],'He opens the safe without looking at the dial. Inside, on a feed receipt, a little metal can.',
  ['MR. ARCENEAUX','I\'ll keep the shop radio\'s cord cut tonight. I\'ll sit in the dark. You go on.']],
 lucienAfter:[['MR. ARCENEAUX','I\'m sittin\' in the dark tonight. With the cat.']],
 cooler:'THE BAIT COOLER',coolerLook:'A bait cooler humming by the back door. Night crawlers, crickets, and a carton of something else.',
 coolerFind:'Behind the crickets, a paper sack of dried mushrooms, folded over twice. Somebody\'s written SWAMP CANDY on it in marker.',
 safe:'THE SAFE',safeLook:'An old safe in the back, painted green, taller than you. Locked. Mr. Arceneaux stands between you and it without seeming to.',
 safeForce:'Force the door',safeFix:'Work the dial',safeDo:['The safe gives. Mr. Arceneaux watches you do it and doesn\'t say a thing.','Inside, on a feed receipt, a little metal can, warm to the touch.'],
 sacks:'Feed sacks to the ceiling. LAYER PELLETS, SWEET FEED, CRACKED CORN, and one sack that just says NO.',
 seeds:'A rack of seed packets. Okra, purple hull peas, Creole tomatoes. All of them are for planting in March.',counterF:'The feed store counter. A cash register older than the building, and a cat asleep on it.',
 // ---- the pastor and the church hall ----
 pastor1:[['PASTOR','Ellis Batiste. Good Shepherd.'],'He fans himself with a church fan, in March.',['PASTOR','Fish fry Friday. Come hungry. Come anyway.'],['PASTOR','That radio is the devil. I\'ve said it from the pulpit and I\'ll say it to you. The devil, with a call-in line.']],
 pastorAfter:[['PASTOR','Come to the fish fry. A town needs to see its own face once in a while.']],
 hallShut:'The church hall. A sign on the door: FISH FRY FRIDAY 5 PM · ALL WELCOME. Locked till then.',
 lou1:[['MAMA LOU','Catfish is a dollar a piece, baby. Federal or not.'],'She stirs the oil. A cigarette behind each ear, never lit. She quit in 1979.'],
 louRead:[['MAMA LOU','You want to know who drove which truck. You got that look.'],
  ['MAMA LOU','Ozzie Hebert drove the first one. Then a Thibodeaux, two Guidrys. Not my husband. My husband was home. A Fontenot. Dutch\'s daddy came last, with the lights off.'],
  ['MAMA LOU','My sister Annette ran off with a boy two days and came home on a bus. Meanwhile they took Emile Broussard out in the cane.'],
  ['MAMA LOU','Emile. Say it. Nobody in this town will say it but me.']],
 louAfter:[['MAMA LOU','Eat somethin\'. You look like the radio got you already.']],
 louGone:'Mama Lou\'s gone home. Somebody else is frying, badly.',
 fryIn:['The church hall\'s full. Long tables, butcher paper, hot sauce every three feet, catfish and white bread.','Nobody\'s eating much. Every table has one person turned around, looking at the door, like they\'re waiting for somebody.',
  'Then Ray Dupuis gets up on a folding chair. Pipefitter, Wade\'s cousin. Three beers in.'],
 ray:[['RAY','I\'ll say it. Somebody oughta say it.'],['RAY','There\'s one house on Bayou Street with every radio on the porch, playin\' all night long. Every night. Since before this started.'],
  ['RAY','The Broussard woman. You all know what her family is. You all know what her brother was.'],'Fifty heads turn the same way. Somebody says "that\'s right". Somebody else says it louder.'],
 fryQ:'The room\'s turning. What do you do?',
 fryCalm:'Calm the room',fryTalk:'Talk them down',fryPaper:'FCC order',fryLean:'Lean on Ray',fryShoot:'Shoot the roof',fryLet:'Let it go',fryFaith:'Answer the pastor',
 fryCalmDo:['You don\'t raise your voice. You ask Ray who he\'s missing. He says Wade. You ask who else. The room starts answering, one table at a time.','By the end of it people are crying into their catfish, and nobody\'s looking at the door.'],
 fryTalkDo:['You get up on a chair next to Ray. You tell them it\'s a federal case now. Anybody bothering an eighty-year-old woman answers to Washington, D.C.','Nobody in Halcott has ever been to Washington, D.C. They don\'t want to start.'],
 fryPaperDo:['You read them an FCC order you mostly make up as you go. Every radio in the parish off tonight. By federal order.','People love an order. Half the room is already unplugging things in their heads.'],
 fryLeanDo:['You walk up to Ray\'s chair and just stand there until he looks down.','He gets down. You tell the room who it really ought to be scared of: anybody who listens tonight. Radios off. Doors shut. Check on your neighbors.','By the time you\'re done, they\'re making phone trees.'],
 fryShootDo:['The shot is very loud in a church hall. Plaster comes down on the potato salad.','The room empties in a minute flat. Plates on the floor. Ray\'s gone with them. Nobody calmed down. They just left.'],
 fryLetDo:'You let it go. Ray keeps talking. By the time he\'s done, three tables have a plan, and none of it is good.',
 fryFail:'It doesn\'t take. The room\'s too scared to hear you.',
 fryCalmed:'The room settles. People go home early, quiet, and you hear radios clicking off all down the street.',
 fryPointed:'The room\'s anger has somewhere to go now: radios off, doors locked, and everybody watching out for everybody. Miss Odile\'s name doesn\'t come up again.',
 fryBoiled:'Ray gets back up on his chair. Nobody stops him. Out in the yard, somebody is filling a gas can from a truck.',
 faithQ:['The pastor comes through the tables, fanning himself hard.',['PASTOR','Agent. You\'ve got the look of somebody who believes in somethin\'.'],['PASTOR','Will you pray with this room? Or tell me I\'m wrong and it\'s no devil at all. Either one. They\'ll hear it from you.']],
 faithPray:'Pray with the room',faithMen:'Tell him it\'s no devil, only men',
 faithPrayDo:['You stand up and the pastor puts a hand on your shoulder. You don\'t know all the words. The room does.','Two hundred people say amen at once. It\'s louder than the radio ever was.'],
 faithMenDo:['You tell him. It\'s no devil. It\'s what men did, here, in 1979, and what they never said out loud.','The pastor looks at you a long time. Then he nods and says it to the room in his pulpit voice. Nobody likes it. Everybody hears it.'],
 phone:'KITCHEN PHONE',phoneLook:'A beige phone on the wall by the kitchen hatch, a cord long enough to reach the fryer.',
 phoneRing:'The kitchen phone is ringing. The cook holds it out at arm\'s length. "For the federal people," she says.',
 bigHatAsk:'Who\'s on the radio, Agent?',
 bigHatOpts:['A prankster with a transmitter in the cane.','Something wearing a dead man\'s voice. The man the town killed in \'79.','Lucien Arceneaux. He took something from that station.'],
 bigHat0:[['BIG HAT','Agent. I can hear catfish.']],
 bigHatRight:[['BIG HAT','A dead man\'s voice.'],['BIG HAT','Then you know what it\'s wearin\'. You know its name.'],['BIG HAT','Then give him his name back.']],
 bigHatNoProof:[['BIG HAT','A dead man.'],['BIG HAT','Which one? Get me a name and a reason, Agent, I don\'t do ghosts on a feelin\'.']],
 bigHatHalf:[['BIG HAT','Arceneaux.'],['BIG HAT','Fine. I\'ll call Fontenot. He\'ll sit that old man in a cell with no radio for the night. Safest place in the parish.'],['BIG HAT','You\'re wrong about him, by the way. But he\'ll live.']],
 bigHatNoHalf:[['BIG HAT','On what? A name on the radio?'],['BIG HAT','Half that parish got named on the radio. Get me paper.']],
 bigHatWrong:[['BIG HAT','A prankster.'],['BIG HAT','Agent, if it\'s a prankster, he\'s been pullin\' that prank since Carter.'],'He hangs up. It costs you the evening. By dark, the whole town knows you think it\'s a prank.'],
 hunch:'A dead station, a voice nobody can name, and every name it says belongs to the same eleven families. Who would have a reason?',
 cameo:['At the edge of the church yard, by Mama Lou\'s pot, a tall man in an old deacon\'s coat stands with a ledger under his arm. His eyes are closed. He\'s turned toward the hall, like he\'s listening.','Mama Lou walks right past him with a plate. You look back. There\'s only the pot, steaming.'],
 cameoH:'Someone at the edge of the yard',
 stage:'A little stage with an old PA and a hand-lettered banner: GOOD SHEPHERD FISH FRY.',serving:'The serving line. Catfish, potato salad, white bread, sweet tea, and a bowl of something nobody\'s claimed.',
 tables:'Long tables under butcher paper, set for a hundred. Hot sauce every three feet. Somebody\'s drawn a radio on the paper and crossed it out.',
 crowd:'Busy with a plate of catfish. They nod at you and don\'t stop eating.',crowdFry:'They\'re watching Ray. They\'re watching you.',
 // ---- KHLT by day ----
 stationDay:'The station\'s front door, steel, a sticker that says ON AIR · DO NOT ENTER. Locked. The lock\'s newer than the door.',
 stationForce:['The door gives on the third try. Nobody for four miles to hear it but the cane.'],stationFix:'The lock\'s a cheap one. It knows it.',stationKey:'Dutch\'s key',stationKeyDo:'The sheriff\'s spare key fits. He told you it would. He didn\'t say it like he was happy about it.',
 stationClimb:'Back window',stationClimbDo:'There\'s a window round back with no glass in it. You go in like a teenager.',
 stationOpen:'The station door stands open. Inside, it smells like 1979: cigarettes, carpet, hot dust.',
 stationNight:'The station door stands open a crack. Inside, the ON AIR light is lit.',
 sign:'A dead sign on the roof: KHLT 1340. Half the letters are gone. The ones left spell KH T 13 0.',
 towerLook:'The tower. Red and white, a hundred and ninety feet, guy wires humming. Its red light blinks, even by day. It\'s been dead since 1979.',
 towerClimb:'Climb up',towerClimbDo:['You go up sixty feet before your hands say no. From up there the cane goes on forever, young and green in rows.','Except due north of the tower. Out there, a circle nobody planted. Bare dirt, and a wheel of copper wires coming up out of it like spokes.','In the middle of the circle, two people are standing very still.'],
 towerFail:'Thirty feet up the rung is slick with dew. You come down faster than you went up, and slower than you could have.',
 towerFence:'A chain-link fence around the tower\'s foot. DANGER · HIGH VOLTAGE, on a sign older than you.',
 shed:'THE TRANSMITTER SHED',shedLook:'The transmitter shed. Padlocked. A new cable runs into it from the field road, where the parish put in irrigation pumps last month.',
 shedFix:['The old service line ties into the new pump line, right there on the pole. Somebody at the parish hooked a dead station back up to the grid without knowing it.','That doesn\'t explain the show. It just explains the light.'],
 barrel:'BURN BARREL',barrelLook:'A burn barrel by the lot, rusted through on one side, half full of ash and beer cans.',
 burnOpt:'Burn the cart',burnQ:'Burn the 3/9/79 cart? It\'s evidence.',burnClose:'Once it\'s ash it\'s ash.',
 burnDo:['You drop it in the barrel with a road map for kindling. The tape curls and stinks.','For a second, very faintly, something in the ash says "it wasn\'t me". Then it\'s just smoke.'],
 burnPage:'Taped inside the case, a page of ruled ledger paper, older, red-lined. You peel it off before it catches. Numbered in the corner: 6.',
 // ---- the booth and the record room ----
 boardB:'The broadcast board. Faders, knobs, two VU meters. On night two, the needles move.',
 mic:'The host\'s mic on its arm, a foam cover gone hard with age.',onair:'The ON AIR light over the door.',
 turntable:'Two turntables. A record still on one: a 45 of something slow. Nobody requested it.',
 window:'TRANSMITTER WINDOW',windowLook:'A window into the transmitter room. Glass tubes the size of your arm. One socket on the front panel is empty, small and square, like a missing tooth.',
 windowNight:'The transmitter room. The tubes glow orange. The empty socket on the panel is where the crystal goes.',
 keyOpt:'Key a dead carrier',keySample:'Seat the crystal',
 keyDo:['You set the crystal in its socket. The transmitter hums up. You key it with nothing on it.','A dead carrier: 1340 with no sound at all. Every radio in the parish goes quiet, a clean, empty quiet.','Out in the cane, something stops talking mid-word.'],
 keyFail:'You get it seated, but the carrier won\'t hold. The tubes flicker. The show talks right over it.',
 carts:'CART MACHINES',cartsLook:'Three cart machines in a row, and a rack of tape cartridges with handwritten labels: JINGLE 2, WEATHER BED, OBITS.',
 playOpt:'Play the cart',playFix:'Thread it by hand',
 playDo:['The cart machine clicks and spins. A room. The same room you\'re standing in, in 1979, with an open mic.',
  'Royce Achord\'s voice: "...we\'re gettin\' calls, folks, hold on..." Then the door. Then boots, a lot of boots.','Somebody, close to the mic, says "it wasn\'t me". He says it again. He keeps saying it while they take him out the back.',
  'Royce never turns the mic off. You hear the trucks. You hear the cane. At 3:41 somebody finally pulls the plug.'],
 playH:'The open mic, March 9, 1979',
 cCart:'The 3/9/79 cart: the booth\'s open mic as the trucks came. Emile Broussard said "it wasn\'t me" until they took him into the cane. The callers are cut from it.',
 staticRise:['The speakers keep hissing after the cart stops. The hiss stands up.','It\'s a man\'s outline in grey snow, the way a TV looks between stations. Too many mouths in it, all of them saying "it wasn\'t me", none of them in time.'],
 staticIntro:'The Static steps out of the speakers!',
 staticDone:['The hiss drops to nothing. The speakers tick as they cool.','On the board, every fader has slid down to zero by itself.'],
 shelves:'Records floor to ceiling, and carts in boxes, and boxes of logs.',
 cabinet:'FILE CABINET',cabinetLook:'A file cabinet. PROGRAM LOGS 1970–1979. The bottom drawer\'s labeled 1979 and it\'s the only one that\'s been dusted.',
 cabFind:['Program logs, one per night, in a box. The last one: MARCH 9, 1979 · THE NIGHT LINE · HOST R. ACHORD · ENGINEER E. BROUSSARD.','The entries stop at 3:04: "CALLER · L. ON LINE 2". Then, in a different hand that shakes: "OFF AIR 3:41 · EQUIPMENT FAULT."'],
 cartShelf:'CART RACK',cartLook:'A rack of carts behind the logs. JINGLES. PSA. And one by itself at the end, in red grease pencil: 3/9/79 · DO NOT AIR.',
 cartTake:'Take it',cartIdent:'Find the cold one',cartFound:'The 3/9/79 cart is cold, colder than the room. The label\'s in red grease pencil: DO NOT AIR.',
 boxes:'BOXES',boxesLook:'Cardboard boxes of station junk. PROMO MUGS. CABLES. One just says EMILE in neat block letters.',
 boxFind:'In the EMILE box: a pair of studio headphones, the cups cracked, the band wrapped in electrical tape. A cassette that says MUSIC I LIKE. A bow tie.',
 micName:'THE GUEST MIC',
 micLook:['The guest mic\'s foam is wet. It breathes, slow, like someone asleep with their mouth near it.',
  'In the booth\'s window glass, a thin man in headphones sits at the board, hands flat on the faders. He turns his head toward you without moving his eyes.',
  'On the program log under the mic, in fresh pencil: "3:00 · E.B. · STILL ON."'],
 micH:'Someone breathing into the guest mic',
 cMic:'The host is wearing Emile Broussard: his voice, his chair, his board. "3:00 · E.B. · STILL ON."',
 // ---- the second broadcast (night 2, the booth) ----
 n2arrive:['The station lot at 2:56 AM. The tower\'s light blinks over the cane, slow, red.','Through the window, the ON AIR light is lit. Somebody\'s on the air in a building nobody\'s in.'],
 show2a:['3:00 AM. Every needle on the board stands up at once. The faders slide up by themselves, like somebody\'s hands are on them.',
  ['THE HOST','Good mornin\', Halcott. Night Line. Last night of the week. Let\'s do a roll call.']],
 show2All:[['THE HOST','Ray Dupuis. Pastor Batiste. Toby Cormier, out at the Gas-N-Go. Mama Lou. Renée.'],['THE HOST','Everybody who was at the fish fry. Everybody who stood up. Everybody who sat down.']],
 show2Fam:[['THE HOST','The Hebert grandkids. The Guidry grandkids. A Thibodeaux, two Fontenots.'],['THE HOST','Just family tonight. Most of you turned me off. That\'s all right. Family listens.']],
 show2Few:'Half the names land on dead air. Radios unplugged on porches all over town. The host waits on each one, and then goes on.',
 show2Named:[['THE HOST','And {first}. You still up?']],
 show2b:[['CALLER','This is Ozzie Hebert. Truck one.'],['CALLER','Dutch Fontenot, the elder. I come with the lights off.'],
  ['CALLER','Darlene, baby? It\'s Daddy. It\'s Royce. Come on home, now. Come home through the rows.'],
  'Out the window, north past the tower, a light comes on in the cane. Then another. Little dials, glowing amber.'],
 show2Q:'Lines are open. One thing.',
 trace2Do:['The needle won\'t point at the tower. It points down, at the floor, and then along it, the way the ground wire runs.','It\'s coming up the ground system. Out the back, under the tower, straight north under the cane.'],
 nameOpt:'Call in and say his name',nameNo:'You don\'t know whose voice it\'s wearing. Not yet.',
 nameDo:['The booth phone has five lines. Line 2 is blinking. You pick it up.',['THE HOST','Night Line. You\'re on the air.'],
  'You say: Emile Broussard. It wasn\'t you. Everybody in Halcott knows it wasn\'t you.','The host doesn\'t say anything. On every radio in the parish, dead air. Seven seconds of it.',
  ['THE HOST','...I never said a word on the air in nine years.'],'It\'s a different voice. Quieter. Then it\'s gone, and the thing that was using it comes back, and it isn\'t pretending to be anybody now.'],
 letOpt:'Let it play',letDo:'You let it play. The host reads names until 3:33, and then breathes, and then the faders slide back down.',
 noAnswer:'Walk north into the cane? The show is on now. Out there you\'ll hear it, but you won\'t be able to answer it.',
 show2Field:['3:00 AM. In the cane, a hundred radios you can\'t see come on at once.',['THE HOST','Good mornin\', Halcott. Roll call.'],'It reads names till your ears ring. You keep walking.'],
 wire:'Follow the ground wire',
 // ---- night 2 in Halcott: the fish-fry crowd at Miss Odile's ----
 mobName:'THE CROWD',mobLook:['Four people at the foot of Miss Odile\'s steps. A man with a tire iron. His brother with a gas can. A woman with a shotgun held like she\'s carrying groceries.','And a teenager filming the whole thing on a phone, with the flash on.'],
 mob1:[['RAY','Evenin\', federal. We\'re just here to turn some radios off.'],['RAY','All of \'em. For good.']],
 mobLean:[['RAY','...Yeah. Okay.'],'The woman lowers the shotgun first. She looks relieved. The brother sets the gas can down on the steps like it\'s full of bees.','They go home. The teenager keeps filming till the end of the street.'],
 mobFail:'Ray laughs. It isn\'t a nice laugh. The tire iron comes up.',
 mobIntro:'The crowd comes up the steps!',
 mobDone:['They scatter down Bayou Street. The gas can rolls into the ditch, still full.',['MISS ODILE','I\'ve known Ray Dupuis since he was in diapers. He was mean in diapers too.']],
 mobGoQ:'Drive out to KHLT? The crowd is still at Miss Odile\'s.',mobGoClose:'If you go now, nobody stops them.',
 walkOdile:'Walk her to the church hall',
 walkOdileDo:['You take Miss Odile\'s arm. She brings Chou-Chou and one radio, playing static.','It takes forever. She stops to tell you about every house on the street. The pastor lets you in the side door and makes up a cot by the stage.',
  ['MISS ODILE','Emile used to walk me to choir. Every Wednesday. He\'d sing in the back where nobody could hear him.']],
 mobEmpty:'At midnight the crowd comes to Miss Odile\'s steps and finds nine radios playing static and nobody home. They stand there a while. Then they go home.',
 odileHall:'Miss Odile is at the church hall tonight, asleep on a cot by the stage.',
 // ---- the cane fields (night 2, the danger zone) ----
 cane2:['North of the tower the cane closes over your head. The rows go on in the dark, and the tower\'s red light comes and goes over all of it.','Out in the rows, things are walking. Slow. Each one holds a little radio to where its ear should be.'],
 caneOk:'You crouch at the end of a row and watch them walk. You learn their beats before they learn you.',caneFail:'Somewhere in the rows a radio turns toward you. You can\'t tell which one.',
 canePath:'You read the rows the way a farmer would. There\'s a way through.',canePathFail:'Every row looks like every other row.',
 caneUp:'Every one of them stops walking when you step into the rows, and turns its radio toward you. They were waiting.',
 ditch:'The drainage ditch, black water. Frogs go quiet as you pass.',tall:'A stand of old cane nobody cut. Taller than you.',
 finderSpot:'DITCH',finderLook:'Something in the ditch with a needle, half in the water. Its needle twitches.',finderTake:'Fish it out',
 finderDo:'A direction finder, like the one at the sheriff\'s office, but older. Somebody dropped it here in a hurry. The needle swings north and stays there.',
 bootSpot:'WADE\'S BOOT',bootLook:'A work boot at the foot of the tall cane, laces still tied. Size eleven. WADE written inside the tongue in marker, the way a wife writes it.',
 bootTrack:'Track it',bootTrackDo:'One bootprint, one sock print, all the way north. You mark the way.',bootTrackFail:'The ground\'s too soft. The prints fill in as you watch.',
 shedBox:'PUMP SHED',shedBoxLook:'The irrigation pump shed at the cane\'s edge. On the door, a gas-station bow, and a padlock with the key in it.',shedOpen:'Open it',
 boxLine:'Inside the pump shed, on top of the pump, wrapped in a bait shop bag:',
 // ---- the radial field ----
 radials1:['The cane opens on a bare circle of dirt, maybe sixty feet across. Copper wires come up out of it like roots and go back in, a wheel of them, around a center.',
  'Darlene Achord and Wade Hebert stand in the dirt with transistor radios held to their ears. They\'re up to their ankles. They\'re very still.',
  'At the far side of the circle, where the wires meet, something tall is standing at a microphone that isn\'t there.'],
 radialsH:'The bare circle, and who\'s standing in it',
 radialsLucien:'Lucien Arceneaux stands with them, still in his store apron, a radio to his ear. He cut the cord on the shop radio. He had another one.',
 radial:'A copper wire comes up out of the dirt and goes back in, like a root. It\'s warm.',
 darlene:'Darlene Achord stands in the dirt with a transistor radio to her ear. She doesn\'t look at you. Her lips move: "turn it off, turn it off".',
 wade:'Wade Hebert stands in the dirt with one boot on and a radio to his ear. His lips move with something you can\'t hear.',
 lucienStand:'Lucien Arceneaux, in his apron, radio to his ear. He\'s crying, a little, with no expression at all.',
 wakeOpt:'Take the radio away',wakeDo:{darlene:['You take Darlene\'s radio. It\'s warm. She screams, once, the way you\'d scream waking up underwater.','Then she sits down in the dirt and asks for Joelle.'],
  wade:['You pull the radio out of Wade\'s hand. He grabs for it and then sees you and then sees where he is.','He sits down and holds his one sock foot in both hands and shakes.'],
  lucien:['You take the radio. Mr. Arceneaux lets you. He sits down slow, like an old man getting into a cold bath.',['MR. ARCENEAUX','I knew it\'d come for me. I knew it.']]},
 wakeH:'Waking someone out of it',woken:'They sit in the dirt, out of it now, shaking.',
 bossQ:'The Night Line is on the air. Once you step up to it, it doesn\'t sign off until it\'s done.',bossOpts:['Go in','Not yet'],
 outQ:'Back into the cane?',outOpts:['Back','Stay'],
 // ---- the boss ----
 boss1:['It turns around. It\'s a tall, thin man in a short-sleeved shirt and a skinny tie, the way you dressed for work in 1979.','Where his head should be there\'s an old desk microphone, the big chrome kind, and the grille is breathing.',
  'Cords run out of its back and down into the dirt, into the wires, into the circle.'],
 bossSay:['THE NIGHT LINE','GOOD MORNIN\', HALCOTT. WE\'VE GOT A CALLER ON THE LINE.'],
 bossSayN:['THE NIGHT LINE','{first}. YOU STAYED UP FOR ME.'],
 bossBurn:['THE NIGHT LINE','SOMEBODY\'S BURNED MY TAPES. THAT\'S ALL RIGHT. I REMEMBER EVERY WORD.'],
 bossCarrier:'Every radio in the circle is playing a dead carrier. The people in the dirt sway, like they lost their place in a song.',
 bossIntro:'The Night Line takes the air!',
 bossThin:'It sounds thinner than it should, like a station at the edge of its range. What you did tonight weakened it.',
 bossIdent:'You already know what it is. You saw it at the guest mic. It\'s wearing Emile, and it hates the quiet.',
 bossLash:'lashes a cord at',
 bossCallers:'The callers come on all at once, every truck in 1979, and every one of them is yelling at you!',
 bossHiss:'It reaches for its callers. There\'s only hiss where the tape should be. It waits for them anyway.',
 bossSan:'It says something in your mother\'s voice. Then in yours.',
 deadAir:'Dead air. {t} hears {t.their} name, and then nothing, and stands there listening to the nothing.',
 deadAirHold:'{t} hears {t.their} name in the hiss and shakes it off. (POW)',
 deadAirFail:'It goes for dead air, and there\'s already a dead carrier on 1340. Its own trick, played back.',
 bossPhase:'It signs off. "That\'s the show." The voice stops being Emile\'s and starts being everybody\'s, every caller at once.',
 bossHeal:'It pulls its voices back in out of the wires, and it stands up straighter. It heals {n}.',
 bossNoHeal:'It reaches for Emile\'s voice to hold itself together. The voice won\'t come. You said his name.',
 sink:'In the circle, {n} sinks to the knees in the dirt, then to the waist, radio still held up, still listening. Then just the radio. Then not.',
 sinkH:'Losing someone to the circle',
 // ---- overstepping ----
 chief:[['SHERIFF','I told you. One rule.'],['SHERIFF','I\'m takin\' your keys, and you\'re done in my office. You want to go somewhere, you walk, or you get a ride from Remy Guidry. God help you.']],
 forgive:[['SHERIFF','...I didn\'t see that.'],['SHERIFF','That\'s the one. There ain\'t another one.']],
 call:[['BIG HAT','I am hearin\' about you on a Louisiana police scanner, {first}. In French.'],['BIG HAT','Don\'t ask me for anything next time. You won\'t get it.']],
 feds:['Black cars on the parish road with their headlights off. Four doors open at the same time.',['CLEAN-UP','Black Lantern. You\'re done here. Hand over what you\'ve found.'],['CLEAN-UP','Whatever\'s on the radio, it\'s ours now.']],
 fedsIntro:'The clean-up crew draws down!',
 fedsWin:['The black cars leave the way they came, one short.','By morning KHLT has a fence around it and a sign that says FCC · DO NOT ENTER.','The show comes on again that Friday. And the Friday after.'],
 cane:'Out in the cane at night, nobody saw that but the cane.',
 // ---- the ending ----
 end1:['The Night Line stops in the middle of a word. The word goes on without it, smaller and smaller, like a station you\'re driving away from.','The microphone falls in the dirt. The cords go slack. The radios in the circle click off one by one, without anybody touching them.',
  'For a second, out of all of them at once, very quietly, somebody says: "Odile?" Then that\'s gone too.'],
 dawn:'Dawn comes up pink over the cane.',
 dawnClean:'The tower\'s red light blinks once more and goes out. Miss Odile asks the parish to dig up the circle, and they do. All eleven families come. Nobody says why. Everybody brings a shovel.',
 dawnCostly:'The tower comes down that spring. A crane from Lafayette, two days\' work. Nobody in Halcott talks about it.',
 dawnTaken:'Search and Rescue finds {n}\'s radio in the circle, standing straight up in the dirt, still warm. Nothing else.',
 dawnBurned:'Miss Odile\'s house burns down to the piers that night. She moves in with the pastor. Ray Dupuis is never charged.',
 dawnSaved:'{n} walks out of the cane at sunup, holding somebody\'s hand.',
 headphones:['You find Miss Odile on the church hall steps and give her the headphones out of the EMILE box.',['MISS ODILE','He wore these nine years. Never said a word into the mic.'],['MISS ODILE','He said plenty into these. He sang.'],'She puts them on. Chou-Chou climbs into her lap.'],
 filed:['BIG HAT','This cart. I\'ll file it. Records wants it by Monday.'],
 filedPage:['BIG HAT','You burned the tape. Fine. The page was taped to the case, not the tape. Records wants it by Monday.'],
 boudin:'He slides a link of boudin across the table in a paper towel. It\'s still warm. He doesn\'t say where it came from.',
 // ---- the debrief (spec 007): Big Hat's lines by ending ({x}/{t} clues, {v}/{n} saved), what he says about the choices,
 // and the cover stories ----
 db:{
  clean:[['BIG HAT','KHLT\'s tower light went out at six-oh-two this mornin\'. Darlene Achord called her daughter from the cane on Wade Hebert\'s phone.'],['BIG HAT','{x} clues outta {t}. {v} outta {n} walked out. Sit.']],
  costly:[['BIG HAT','The station\'s off the air. That\'s the good news.'],['BIG HAT','Rest of it I read in a sheriff\'s report with a coffee ring on it. {v} outta {n} walked out of that field.'],['BIG HAT','{x} clues outta {t}. Sit.']],
  worst:[['BIG HAT','Black cars on a parish road. Men in suits on a radio frequency I\'m not cleared to listen to.'],['SHOUT','I SAID SILENCE THE STATION. NOT HAND IT OVER.'],['BIG HAT','Case is closed. Not by us.']],
  wrong:['BIG HAT','You told me it was a prankster. Sheriff Fontenot heard about it before I did. In this business that\'s a long time.'],
  named:['BIG HAT','You called in. On the air. I told you not to answer it.'],
  boiled:['BIG HAT','Ray Dupuis\'s cousin filed a complaint against the federal government. Spelled federal three ways.'],
  shot:['BIG HAT','Good Shepherd wants four hundred dollars for a ceiling. And a potato salad.'],
  pray:['BIG HAT','Pastor Batiste called. Said you prayed with his whole congregation. He\'s puttin\' you in the bulletin.'],
  odile:['BIG HAT','Miss Odile sent a pecan pie. And a photo of a nutria. I don\'t know what to do with the photo.'],
  lucien:['BIG HAT','Arceneaux sat in the dark all night with his cat, like you told him. Cat\'s fine. Arceneaux\'s fine.'],
  zip:['BIG HAT','Fella you zip-tied cried all the way to the parish jail. Gave up his whole family tree. Some of it was useful.'],
  grid:'The old transmitter came live off the pump line',gridPass:[['BIG HAT','Parish wired a dead station back into the grid by mistake. FCC seals the shed Monday. Everybody gets a letter. Nobody reads it.']],
  pirate:'A pirate with old station tapes',piratePass:[['BIG HAT','Pirate broadcaster with a box of KHLT tapes and a grudge. Skipped the parish. Paper runs it on page four, under the fish fry.']],
  weak:'Kids with a CB radio and a grudge',weakPass:[['BIG HAT','CB radio. Teenagers. Nobody in Halcott believes it, and nobody wants to say what they do believe. You got lucky.']],
  safe:'Already filed: equipment fault, 1979',safePass:[['BIG HAT','Equipment fault. Parish wrote that in 1979. Paperwork\'s never wrong.']]
 }
};
const fill=(t,o)=>String(t).replace(/\{(n|m|v|t|x|b)\}/g,(x,k)=>o[k]??x);
async function play(seq,o={}){for(const l of [].concat(seq)){if(Array.isArray(l))await say(l[0],fill(l[1],o));else await say('',fill(l,o))}}
const said=(l,o)=>play([l],o);
// A point of no return (studio-bible/play.md): the cursor starts on Not yet, so mashing A can't take it.
async function askNotYet(text,opts){await say('',text,{keep:true,instant:false});const r=await choose(opts,{cancel:true,inBox:true,sel:opts.length-1});hideTB();return r<0?opts.length-1:r}

// The case board card (spec 020, The card). The call letters are made up (checked Nov 23, 2026).
const caseCard={file:6,title:'DEAD AIR',town:'HALCOTT',place:'KHLT 1340 AM · HALCOTT, LA',
 hook:['A dead station is back at 3 AM.','Its callers know who\'s next.'],pin:'#ff4a3d'};

// ================= CASE DATA =================
// Enemy cards (Combat: Enemies and difficulty, Combat numbers). Fight sizes: roamers 10–18 enemy HP, story fights 20–35.
const EN={
 // the fish-fry crowd at Miss Odile's steps (a human story fight, 2 skulls, 30 HP in all): each runs at half HP.
 // Persuade's Lean on them stops it before it starts.
 tireiron:{name:'Ray Dupuis',tier:'ordinary',hp:9,dex:11,hit:50,dmg:'1d4+1',skulls:2,tags:['human','living'],resist:[],weak:'human',flees:1,
  weakLine:'Human, drunk and scared. He\'ll run when it hurts. A flashbang or a badge stops him for a second.',moves:[['hit',1]],verb:'swings a tire iron at',die:'goes down in Miss Odile\'s flower bed and stays there',face:[10,2,20]},
 gascan:{name:'The brother',tier:'ordinary',hp:8,dex:10,hit:45,dmg:'1d4',skulls:2,tags:['human','living'],resist:[],weak:'human',flees:1,
  weakLine:'Human. He doesn\'t want to be here. He\'ll run first chance.',moves:[['hit',1]],verb:'swings the gas can at',die:'sits down on the steps and puts his head in his hands',face:[10,2,20]},
 shotgun:{name:'The woman',tier:'ordinary',hp:8,dex:9,hit:40,dmg:'1d6',skulls:2,tags:['human','living'],resist:[],weak:'human',flees:1,
  weakLine:'Human. She doesn\'t want to fire it. She\'ll run when it gets real.',moves:[['hit',1]],verb:'fires low at',die:'drops the shotgun and backs off down the street',face:[10,2,20]},
 filmer:{name:'The teenager',tier:'weak',hp:5,dex:13,hit:35,dmg:'1d2',skulls:1,tags:['human','living'],resist:[],weak:'human',flees:1,
  weakLine:'A kid with a phone. He isn\'t fighting. He\'s filming.',moves:[['film',1]],verb:'shoves',die:'runs, still filming',face:[10,2,20]},
 // the Static (an unnatural story fight, 2 skulls): it stands up out of the booth's speakers when the cart plays
 static:{name:'The Static',tier:'tough',hp:24,dex:12,hit:50,dmg:'1d4+1',allDmg:'1d2',skulls:2,tags:['unnatural','silence'],resist:['bleed','poison'],weak:'silence',
  weakLine:'Made of hiss. Silence hurts it: hold up a radio playing static and it loses a round. Nothing in it bleeds.',
  moves:[['hit',3],['all',1],['san',1]],verb:'reaches through',allText:'The Static feeds back! A shriek out of every speaker in the booth!',sanText:'Every mouth in it says "it wasn\'t me", at you.',sanHit:['0','1'],
  die:'drops back into the speakers and the speakers go dead',face:[12,0,24]},
 // the cane's roamers (night 2): townsfolk from 1979, made of cane trash and wire, with a radio for a head
 listener:{name:'Listener',tier:'ordinary',hp:11,dex:9,hit:45,dmg:'1d3+1',skulls:1,tags:['unnatural','lightshy','burns'],resist:['shaken'],weak:'light',
  weakLine:'Cane trash and copper wire, with a radio where its head should be. Light makes it shy; fire takes it fast.',moves:[['hit',1]],verb:'grabs at',die:'falls apart into cane trash and a radio playing nothing',face:[10,0,20],
  horror:{tier:'disturbing',kind:'unnatural',subj:'voices'}},
 listener2:{name:'Listener',tier:'ordinary',hp:12,dex:9,hit:45,dmg:'1d3+1',skulls:1,tags:['unnatural','lightshy','burns'],resist:['shaken'],weak:'light',
  weakLine:'Cane trash and copper wire, with a radio where its head should be. Light makes it shy; fire takes it fast.',moves:[['hit',1]],verb:'grabs at',die:'falls apart into cane trash and a radio playing nothing',face:[10,0,20]},
 rowhand:{name:'Rowhand',tier:'ordinary',hp:16,dex:10,hit:50,dmg:'1d4+1',skulls:2,tags:['unnatural','lightshy','burns'],resist:['shaken'],weak:'light',
  weakLine:'Taller than the others, with a cane knife where its hands should be. Light makes it shy; fire takes it fast.',moves:[['hit',1]],verb:'swings its cane knife at',die:'goes down like a cut stalk',face:[10,0,20]},
 // only if overstepping reaches Federal agents (the same clean-up crew as every case; its sprite is Still Harvest's SHB)
 fed:{name:'Clean-up agent',tier:'ordinary',hp:11,dex:12,hit:55,dmg:'1d4+1',skulls:3,tags:['human','living'],resist:[],weak:'human',weakLine:'Human. A flashbang or a badge will stop him for a second.',
  moves:[['hit',1]],verb:'fires at',die:'goes down and stays down',face:[10,2,20]},
 // the boss (tuned Nov 23, 2026 with tools/boss-sim.js against the Gleaner's bar). Its moves, phase 2 and HP are set per
 // run in bossFight() from the case's choices. Weakness: silence (Miss Odile's static radio stuns it) and fire (burns).
 nightline:{name:'The Night Line',tier:'boss',boss:true,hp:64,dex:10,hit:55,dmg:'1d4+2',allDmg:'1d3',skulls:3,tags:['unnatural','lightshy','silence','burns'],resist:['stun2','poison','bleed'],weak:'silence',
  weakLine:'It lives in the hiss and hates the quiet: a radio playing static, held up to it, stuns it a round. Fire on its cords does double. It can\'t be stunned two turns running.',glow:true,face:[34,4,30],
  moves:[['hit',5],['all',2],['deadair',1]],verb:TEXT.bossLash,allText:TEXT.bossCallers,sanText:TEXT.bossSan,sanHit:['1','1d4'],die:'goes off the air',
  horror:{tier:'boss',kind:'unnatural',subj:'voices',known:true}}
};
// the case's horrors: tier, kind, phobia subject; once per case each (SAN loss table). The broadcasts, the cart and the
// circle are for all three; the rest are the lead's on the map. Net budget 6–10 with the two motivation moments.
const HORRORS={
 show1:{id:'show1',tier:'disturbing',kind:'unnatural',subj:'voices',all:true,label:TEXT.show1H},
 call:{id:'call',spec:['1','1d4'],kind:'unnatural',subj:'voices',label:TEXT.callH},
 note:{id:'note',tier:'unsettling',kind:'helplessness',label:TEXT.noteH},
 cart:{id:'cart',tier:'severe',kind:'helplessness',subj:'voices',all:true,label:TEXT.playH},
 mic:{id:'mic',tier:'unsettling',kind:'unnatural',label:TEXT.micH},
 named2:{id:'named2',tier:'unsettling',kind:'unnatural',subj:'voices',label:'It said your name again'},
 circle:{id:'circle',tier:'shattering',kind:'unnatural',all:true,label:TEXT.radialsH},
 wake:{id:'wake',tier:'disturbing',kind:'helplessness',label:TEXT.wakeH},
 sink:{id:'sink',tier:'severe',kind:'helplessness',all:true,label:TEXT.sinkH},
 cameo:{id:'cameo:tall',tier:'unsettling',kind:'unnatural',label:TEXT.cameoH}
};
// this case's own items (case-only: the pin icon; Big Hat sorts them at the debrief). The cart is the key evidence.
const silenceUse=async m=>{const fs=aliveFoes().filter(e=>(e.tags||[]).includes('silence'));
 if(Bt.used.silence){await bsay('The static\'s already been played this fight. It\'s ready for it now.',1000);return true}
 await say('',`${m.name} holds up Miss Odile\'s radio. Static, loud and flat and empty.`,{auto:1300});
 if(!fs.length){await say('',`Nothing here minds the quiet.`,{auto:900});return true}Bt.used.silence=1;for(const e of fs)await foeStatus(e,'stun');return true};
const CASE_ITEMS={
 cart79:{name:'The 3/9/79 cart',type:'Evidence',kind:'unnatural',pin:1,passive:1,
  desc:'A broadcast cartridge, DO NOT AIR on the label in red grease pencil. Taped inside the case, a page of ruled ledger paper, older and red-lined, numbered in the corner: 6.'},
 crystal:{name:'The 1340 crystal',type:'Tool',kind:'unnatural',pin:1,passive:1,desc:'A quartz crystal in a little metal can, warm to the touch. It hums when you hold it near a radio.'},
 headphones:{name:'Emile\'s headphones',type:'Keepsake',kind:'ordinary',pin:1,passive:1,desc:'Studio headphones, the cups cracked, the band wrapped in electrical tape. Somebody wore these a long time.'},
 finder:{name:'Direction finder',type:'Tool',kind:'ordinary',pin:1,passive:1,desc:'A handheld loop antenna with a needle. Tracing a signal is +20% while someone carries it.'},
 staticradio:{name:'Static radio',type:'Tool',kind:'ordinary',pin:1,desc:'Miss Odile\'s transistor, playing static. Battle: anything that hates the quiet is Stunned a round. Once a fight.',battleUse:silenceUse},
 gascoffee:{name:'Gas station coffee',type:'Drink',kind:'ordinary',pin:1,desc:'Restore 1d4+1 WP. It\'s been on the burner since dinner.',
  mapUse:async()=>{const t=await pickMember('WHO DRINKS?',()=>true);if(!t)return false;const g=roll(1,4,1);t.wp=Math.min(t.mwp,t.wp+g);await say('',`${t.name} drinks gas station coffee out of a foam cup. +${g} WP.`);return true},
  battleUse:async()=>{const t=await pickAlly({title:'WHO DRINKS?',noKO:true});if(!t)return false;const g=roll(1,4,1);t.wp=Math.min(t.mwp,t.wp+g);await say('',`${t.name} drinks gas station coffee. +${g} WP.`,{auto:1000});return true}}
};
// a roamer's drop: 20% from this loot table (Where items come from, Loot): a parish town, a bait shop, a radio station
const LOOT=['energy','cigs','roadflare','painkillers','gascoffee'];
const has=id=>G.clues.some(c=>c.id===id);
const GATE=['trace','voices','log','names','emile'];
const gateClues=()=>G.clues.filter(c=>GATE.includes(c.id)).length;
// the soft clock: the town getting meaner (fear). It costs a better ending, never progress.
const fear=()=>G.flags.fear|0;
const addFear=(n=1)=>{G.flags.fear=Math.max(0,fear()+n)};

// ================= THE DAYS =================
// G.flags.ph: 0 day 1, 1 night 1 (the first broadcast), 2 day 2 (Friday, the fish fry), 3 night 2 (spec 020, Day and
// night). Each turn waits for Go on / Not yet naming what closes (Turning the day; play.md).
const ph=()=>G.flags.ph|0;
const isNight=()=>ph()===1||ph()===3;
const light=()=>isNight()?'night':'day';
// overstepping: which step the case is on (open case: Clean, Local chief, Agency call, Federal agents)
const stepName=()=>stepsOf()[loadSeason().overstep|0]||'Clean';
const stepAt=n=>stepsOf().indexOf(n)<=(loadSeason().overstep|0)&&stepsOf().indexOf(n)>=0;
const chief=()=>!!G.flags.chief;  // Dutch took the keys and shut his office (Local chief)
// the briefing's edges (spec 013) and the case's own modifiers
const famMod=()=>intelOn('missing')?10:0,fryMod=()=>(intelOn('town')?10:0)-10*fear();
const traceMod=()=>(intelOn('station')?10:0)+(holderOf('finder')?20:0);
const named=()=>party.find(m=>m.a.id===G.flags.named);
const inCircle=()=>['darlene','wade'].concat(G.flags.lucien==='safe'?[]:['lucien']);
const awake=id=>!!(G.flags.woke&&G.flags.woke[id]);

// ================= MAPS =================
// Every map is drawn by cases/dead-air-art.js from M.ground, M.pieces and M.light, like Lot 83. M.g is what blocks.
// Ground letters (none in engine.js's BLOCK set): ',' sidewalk, '=' road, '.' grass, 'd' dirt road, 'g' gravel, 'a' bayou
// water, 'u' young cane, 's' cane stubble, 'e' bare dirt, 'n' linoleum, 'c' carpet, 'w' wood floor, 'v' tile, 'o' concrete.
function blank(id,name,W,H,fillCh,lt){const ground=mk(W,H,fillCh),g=mk(W,H,fillCh);
 return{id,name,w:W,h:H,ground,g,pieces:[],O:{},npcs:[],warps:{},light:lt||light(),ph:ph(),art:window.DAA,lines:[]}}
const lay=(M,x,y,w,h,c)=>{rect(M.ground,x,y,w,h,c);rect(M.g,x,y,w,h,c)};
const block=(M,x,y,w=1,h=1)=>rect(M.g,x,y,w,h,'#');
const open=(M,x,y)=>{M.g[y][x]=M.ground[y][x]};
function put(M,k,x,y,w=1,h=1,o={}){const p=Object.assign({k,x,y,w,h},o);M.pieces.push(p);if(!o.walk)block(M,x,y,w,h);return p}
const look=t=>({look:t});
const lookAll=(M,keys,t)=>keys.forEach(k=>M.O[k]=look(t));
const row=(x,y,w)=>Array.from({length:w},(_,i)=>(x+i)+','+y);
const folk=(n,talk)=>Object.assign(n,{talk:talk||(()=>play(TEXT[n.talkAs||n.id]||TEXT.crowd))});
const door=(M,x,y,to,tx,ty,dir='down')=>{open(M,x,y);M.warps[x+','+y]=()=>goTo(to,tx,ty,dir)};
async function goTo(to,x,y,dir){await fade(1);goMap(to,x,y,dir);checkpoint();await fade(0);if(G.M.arrive)await G.M.arrive()}
const bounceDir=(M,keys,text,dir)=>keys.forEach(k=>M.warps[k]=async()=>{await said(text);G.dir=dir;await stepBack()});
const bounce=(M,x,y,text,dir='down')=>{open(M,x,y);M.warps[x+','+y]=async()=>{await said(text);G.dir=dir;await stepBack()}};
// a door that only opens by day (night: locked), and not once Dutch has shut his office
const dayDoor=(M,x,y,to,tx,ty,shutText)=>{if(isNight())M.O[x+','+y]=look(shutText||TEXT.shutNight);else door(M,x,y,to,tx,ty,'up')};
TEXT.shutNight='Dark inside. Locked for the night.';TEXT.houseShut='Somebody\'s home. The TV\'s on, the radio isn\'t. They don\'t come to the door.';

// ---- HALCOTT: Main Street across the top, Bayou Street's raised houses below it, the bayou along the bottom (44 x 30) ----
// Main Street's north side (rows 0-4, doors in row 4): the church hall, the sheriff's office, the feed store, the bait
// shop. The road is rows 6-8. South of it: the church yard (the fish fry pot on day 2), the big live oak, the Gas-N-Go.
// A dirt cross street (x 32-33) runs down to Bayou Street (rows 18-19); the houses' doors are in row 17.
const HOUSES=[{id:'achord',x:2,w:6,door:4,col:'#d8cdb0',roof:'#4a3a46'},{id:'hebert',x:10,w:6,door:13,col:'#8aa4ac',roof:'#2e3a4a',shut:'#3a5a4a'},
 {id:'n1',x:18,w:5,door:20,col:'#c8a890',roof:'#3a2e2a'},{id:'odile',x:24,w:7,door:26,col:'#b8c8a8',roof:'#4a3a2e',porch:1}];
const STORES=[{k:'hall',x:1,w:9,door:5,to:'hall'},{k:'sheriffs',x:11,w:6,door:13,to:'sheriff'},{k:'feedst',x:18,w:7,door:21,to:'feed'},{k:'baitst',x:26,w:5,door:28}];
function buildHalcott(){
 const N=isNight(),F=G.flags,M=blank('halcott','HALCOTT',44,30,'.');M.alpha=.88;M.warm='#ffcf80';
 // Main Street
 block(M,0,0,44,5);lay(M,0,5,44,1,',');lay(M,0,6,44,3,'=');lay(M,0,9,32,1,',');lay(M,34,9,10,1,',');
 for(const s of STORES){put(M,s.k,s.x,0,s.w,5,{walk:1,door:s.door});
  if(s.to==='hall'){if(ph()===2)door(M,s.door,4,'hall',8,9,'up');else bounce(M,s.door,4,ph()===3&&F.odileHall?TEXT.odileHall:TEXT.hallShut)}
  else if(s.to==='sheriff'&&!N&&chief())bounce(M,s.door,4,TEXT.dutchNight.replace('GONE HOME. CALL 911. DON\'T CALL ME.','FEDERAL PEOPLE: NO.'));
  else if(s.to){if(N)bounce(M,s.door,4,s.to==='sheriff'?TEXT.dutchNight:TEXT.shutNight);else door(M,s.door,4,s.to,s.to==='sheriff'?7:6,s.to==='sheriff'?8:7,'up')}
  else M.O[s.door+',4']=look('GUIDRY\'S BAIT · LIVE CRAWFISH · ICE. A sign in the window: BACK IN 5 MIN. The sign has been there since 2009.')}
 M.O['3,4']=look('GOOD SHEPHERD CHURCH HALL. FISH FRY FRIDAY. A smaller sign under it: RADIOS OFF INSIDE PLEASE.');M.O['15,4']=look('ST. ODILE PARISH SHERIFF · HALCOTT SUBSTATION.');M.O['23,4']=look('ARCENEAUX FEED & SEED · SINCE 1951.');
 put(M,'lot',35,0,9,5,{walk:1});lay(M,35,4,9,1,'.');open(M,36,4);
 put(M,'oakbig',38,3,3,1);M.O['38,3']=M.O['39,3']=M.O['40,3']=look('A live oak older than the town, Spanish moss hanging down to the grass like it got tired.');
 bounceDir(M,['0,6','0,7','0,8'],TEXT.hwy,'right');bounceDir(M,['43,6','43,7','43,8'],TEXT.hwy,'left');
 // street lights along Main Street, the team's car at the curb, Remy's truck
 [[10,5],[25,5],[2,9],[19,9],[36,9]].forEach(([x,y])=>put(M,'lamp',x,y));
 put(M,'car',22,8,3,1,{tint:'#3a3e48'});[22,23,24].forEach(x=>M.O[x+',8']={id:'car',name:'CAR',look:TEXT.car,opts:()=>carOpts(),used:()=>false});
 put(M,'truck',6,8,3,1,{tint:'#8a3a2e'});[6,7,8].forEach(x=>M.O[x+',8']={id:'truck',name:'REMY\'S TRUCK',look:TEXT.truck,opts:()=>truckOpts(),used:()=>ph()!==2||!!F.nap});
 // the church yard: the fish fry pot and tables on day 2
 lay(M,1,10,9,3,'d');
 if(ph()===2){put(M,'pot',5,11);M.O['5,11']=look('An iron pot of oil over a gas ring, popping. Mama Lou\'s. Nobody else is allowed within three feet of it.');put(M,'picnic',2,12,2,1);put(M,'picnic',7,12,2,1);lookAll(M,['2,12','3,12','7,12','8,12'],'A picnic table under butcher paper, weighed down with hot sauce.')}
 else{put(M,'picnic',2,12,2,1);lookAll(M,['2,12','3,12'],'A picnic table under butcher paper, weighed down with hot sauce.')}
 // the big live oak on the green, and the Gas-N-Go at the east end
 put(M,'oakbig',18,12,3,1);lookAll(M,['18,12','19,12','20,12'],'A live oak older than the town, Spanish moss hanging down to the grass like it got tired.');
 lay(M,34,10,10,7,'g');put(M,'gasgo',36,10,7,3,{door:39});M.O['39,12']=look(TEXT.gasgo);
 put(M,'pump',38,14);put(M,'pump',41,14);M.O['38,14']=M.O['41,14']=look('One pump, no brand left on it. $3.89 a gallon in rolling numbers.');put(M,'polesign',35,10);M.O['35,10']=look(TEXT.gasgo);
 lay(M,32,9,2,11,'d');
 // Bayou Street: raised houses on piers (rows 13-17), the street (rows 18-19), yards, the bayou
 lay(M,0,18,34,2,'d');
 for(const h of HOUSES){put(M,'house',h.x,13,h.w,5,Object.assign({walk:1},h));block(M,h.x,13,h.w,5);
  if(h.id==='achord'||h.id==='hebert')dayDoor(M,h.door,17,h.id,5,6,TEXT.shutNight);
  else if(h.id==='odile')M.O[h.door+',17']=look(TEXT.porch);
  else M.O[h.door+',17']=look(TEXT.houseShut)}
 // Miss Odile's porch radio: the night-1 broadcast
 put(M,'porchradio',29,17,1,1,{on:N});M.O['29,17']={id:'radio',name:TEXT.radioName,look:()=>said(ph()===1?(F.heard?TEXT.radioDone:TEXT.radioLook):TEXT.radioDay),opts:()=>radioOpts(),used:()=>ph()!==1||!!F.heard&&!!F.odileSat};
 [[1,20],[8,20],[16,20],[23,20]].forEach(([x,y])=>{put(M,'mailbox',x,y);M.O[x+','+y]=look('A mailbox on a post. The flag\'s up. Inside, a flyer: RADIO RECYCLING, NO QUESTIONS.')});
 put(M,'oaksmall',11,22,2,1);put(M,'cypress',4,24);put(M,'cypress',27,24);put(M,'cypress',38,23);put(M,'shed',20,21,3,2);
 put(M,'lamp',30,20);put(M,'lamp',8,17);
 [[10,11],[15,12],[26,11],[30,12],[2,22],[24,23],[14,24],[35,18],[42,21],[17,24],[31,24],[8,23]].forEach(([x,y])=>put(M,'palmetto',x,y));
 put(M,'boat',36,20,4,1);lookAll(M,row(36,20,4),'A flat-bottom boat on a trailer. GUIDRY\'S BAIT on the side, in house paint.');put(M,'traps',30,10,2,1);lookAll(M,['30,10','31,10'],'Crawfish traps stacked by the curb, still dripping.');
 put(M,'oaksmall',40,24,2,1);put(M,'flowers',12,10,2,1,{walk:1});put(M,'flowers',22,11,3,1,{walk:1});put(M,'flowers',28,21,3,1,{walk:1});put(M,'flowers',4,21,2,1,{walk:1});
 lay(M,0,26,44,4,'a');block(M,0,26,44,4);put(M,'bank',0,26,44,1,{walk:1,knees:[6,15,29,36]});lookAll(M,row(0,25,44),TEXT.bayou);
 lay(M,34,17,10,9,'.');
 // people, by the day (night: only Toby at the Gas-N-Go and Miss Odile on her porch are up)
 const NP=[];
 if(ph()===0)NP.push(folk({id:'deputy',x:14,y:5,dir:'down'},talkRenee),folk({id:'pastor',x:6,y:5,dir:'down'},talkPastor),folk({id:'remy',x:29,y:5,dir:'down'},talkRemy),folk({id:'odile',x:28,y:18,dir:'down'},talkOdile),folk({id:'toby',x:40,y:13,dir:'down'},talkToby));
 else if(ph()===2)NP.push(folk({id:'lou',x:6,y:11,dir:'down'},talkLou),folk({id:'pastor',x:4,y:10,dir:'right'},talkPastor),folk({id:'remy',x:29,y:5,dir:'down'},talkRemy),folk({id:'deputy',x:16,y:9,dir:'down'},talkRenee),folk({id:'odile',x:28,y:18,dir:'down'},talkOdile),
  folk({id:'f1',x:1,y:11,dir:'right',talkAs:'crowd'}),folk({id:'f2',x:9,y:11,dir:'left',talkAs:'crowd'}));
 else if(ph()===1)NP.push(folk({id:'odile',x:27,y:18,dir:'down'},talkOdile),folk({id:'toby',x:40,y:13,dir:'down'},talkToby));
 else{if(!F.odileHall)NP.push(folk({id:'odile',x:27,y:18,dir:'down'},talkOdile));NP.push(folk({id:'toby',x:40,y:13,dir:'down'},talkToby));
  // night 2: the fish-fry crowd at Miss Odile's steps, if it boiled, until it's dealt with
  if(F.fry==='boiled'&&!F.porch)[['f1',24,19,'up'],['f4',25,19,'up'],['f3',23,19,'right'],['f5',26,20,'up']].forEach(([id,x,y,d])=>NP.push(folk({id,x,y,dir:d},talkMob)))}
 M.npcs=NP;
 M.arrive=halcottArrive;
 return M}

// ---- interiors: the back wall three tiles tall, the door in the bottom wall ----
function room(id,name,W,H,floor,o={}){const M=blank(id,name,W,H,floor);M.alpha=o.alpha||.86;M.warm='#ffcf80';
 block(M,0,0,W,3);block(M,0,0,1,H);block(M,W-1,0,1,H);block(M,0,H-1,W,1);put(M,'room',0,0,W,H,{walk:1,floor});return M}
function buildSheriff(){const M=room('sheriff','SHERIFF\'S OFFICE',15,10,'n'),F=G.flags;
 put(M,'counter',2,5,6,1);lookAll(M,['2,5','3,5','4,5','5,5','6,5','7,5'],TEXT.counterS);
 put(M,'desk',9,4,1,1);put(M,'desk',12,4,1,1);put(M,'board',3,0,4,3,{walk:1});
 ['3,3','4,3','5,3','6,3'].forEach(k=>M.O[k]={id:'board',name:TEXT.board,look:TEXT.boardLook,opts:()=>has('names')?[]:[{use:'sweep',ok:()=>findNames(TEXT.boardSweep),fail:()=>said('Pins. Photos. A map with too many roads on it. Nothing you can line up.')}],used:()=>has('names')});
 M.O['12,4']={id:'fiche',name:TEXT.fiche,look:TEXT.ficheLook,opts:()=>ficheOpts(),used:()=>has('names')};
 put(M,'radioshelf',9,0,3,3,{walk:1});['9,3','10,3','11,3'].forEach(k=>M.O[k]={id:'shelf',name:TEXT.shelf,look:TEXT.shelfLook,opts:()=>shelfOpts(),used:()=>!!F.finder});
 put(M,'cell',12,6,2,2);lookAll(M,['12,6','13,6','12,7','13,7'],TEXT.cell);put(M,'coffee',1,3);M.O['1,3']=look(TEXT.coffee);put(M,'plant',13,3);put(M,'chairs',2,8,2,1);
 M.npcs=[folk({id:'sheriff',x:10,y:5,dir:'down'},talkDutch)];
 if(ph()===2&&F.deduce==='half')M.npcs.push(folk({id:'lucien',x:11,y:7,dir:'right'},talkLucienCell));
 door(M,7,9,'halcott',13,5,'down');return M}
function buildAchord(){const M=room('achord','ACHORD HOUSE',12,8,'w');
 put(M,'kitchentable',2,4,3,1);['2,4','3,4','4,4'].forEach(k=>M.O[k]={id:'note',name:TEXT.note,look:lookNote});put(M,'photos',6,0,4,3,{walk:1});lookAll(M,['6,3','7,3','8,3','9,3'],TEXT.photos);
 put(M,'sofa',7,5,3,1);put(M,'lampstand',10,4);put(M,'rug',4,6,3,1,{walk:1});
 M.npcs=[folk({id:'joelle',x:5,y:5,dir:'down'},talkJoelle)];
 door(M,5,7,'halcott',4,18,'down');return M}
function buildHebert(){const M=room('hebert','HEBERT HOUSE',12,8,'c');
 put(M,'knick',2,0,3,3,{walk:1});lookAll(M,['2,3','3,3','4,3'],TEXT.shelfGap);put(M,'fridge',8,3);M.O['8,3']=look(TEXT.drawings);
 put(M,'recliner',3,5);put(M,'tv',6,3);M.O['6,3']=look('The TV\'s on with the sound off. A fishing show. A man holds up a redfish and says something nobody hears.');put(M,'toys',9,6,2,1,{walk:1});
 M.npcs=[folk({id:'marcy',x:6,y:5,dir:'left'},talkMarcy)];
 door(M,5,7,'halcott',13,18,'down');return M}
function buildHall(){const M=room('hall','CHURCH HALL',17,11,'v',{alpha:.8}),F=G.flags;
 put(M,'stage',5,0,7,3,{walk:1});lookAll(M,['6,3','7,3','8,3','9,3','10,3'],TEXT.stage);
 put(M,'serving',1,4,4,1);lookAll(M,['1,4','2,4','3,4','4,4'],TEXT.serving);
 for(const[x,y]of[[6,5],[11,5],[6,7],[11,7]]){put(M,'longtable',x,y,4,1);lookAll(M,row(x,y,4),TEXT.tables)}
 // the kitchen phone on the wall by the hatch: the deduction (Big Hat calls)
 put(M,'wallphone',15,2,1,1,{walk:1});M.O['15,2']={id:'phone',name:TEXT.phone,look:()=>phoneRings()?bigHatCall():said(TEXT.phoneLook),used:()=>!phoneRings()};
 const NP=[folk({id:'pastor',x:8,y:4,dir:'down'},talkPastor),folk({id:'f3',x:7,y:6,dir:'up',talkAs:'crowd'}),folk({id:'f4',x:13,y:6,dir:'up',talkAs:'crowd'}),
  folk({id:'f5',x:9,y:8,dir:'up',talkAs:'crowd'}),folk({id:'f1',x:12,y:8,dir:'up',talkAs:'crowd'}),folk({id:'f2',x:14,y:4,dir:'left',talkAs:'crowd'})];
 if(!F.louGone)NP.push(folk({id:'lou',x:2,y:5,dir:'down'},talkLou));
 M.npcs=NP;
 M.arrive=hallArrive;
 door(M,8,10,'halcott',5,5,'down');return M}
function buildFeed(){const M=room('feed','ARCENEAUX FEED & SEED',14,9,'o');
 put(M,'sacks',1,0,5,3,{walk:1});lookAll(M,['1,3','2,3','3,3','4,3','5,3'],TEXT.sacks);put(M,'sackpile',1,5,2,1);M.O['1,5']=M.O['2,5']=look(TEXT.sacks);
 put(M,'seedrack',7,3,2,1);M.O['7,3']=M.O['8,3']=look(TEXT.seeds);put(M,'safe',12,3);M.O['12,3']={id:'safe',name:TEXT.safe,look:TEXT.safeLook,opts:()=>safeOpts(),used:()=>!!G.flags.crystalGot};
 put(M,'counter',5,6,4,1);lookAll(M,['5,6','6,6','8,6'],TEXT.counterF);
 put(M,'baitcooler',10,3,2,1);
 M.O['10,3']=M.O['11,3']={id:'cooler',name:TEXT.cooler,look:TEXT.coolerLook,opts:[{use:'sweep',once:'cooler',ok:async()=>{await said(TEXT.coolerFind);await pickup('shrooms')},fail:()=>said('Crickets. A lot of crickets. One of them is looking at you.')}]};
 M.npcs=[folk({id:'lucien',x:7,y:5,dir:'down',out:()=>!!G.flags.lucien,on:()=>!(ph()===2&&G.flags.deduce==='half')},talkLucien)];
 door(M,6,8,'halcott',21,5,'down');return M}

// ---- KHLT 1340: the station, its gravel lot, the tower in a clearing, cane all around (36 x 26) ----
function buildKhlt(){const N=isNight(),F=G.flags,M=blank('khlt','KHLT 1340',36,26,'u');M.alpha=.8;M.warm='#ffcf80';
 // the station: cinder block, rows 1-6, the front door at (9, 6): locked by day until the team gets in
 block(M,3,0,13,7);put(M,'station',3,2,13,5,{walk:1,door:9});
 if(N||F.inStation)door(M,9,6,'booth',6,6,'up');else M.O['9,6']={id:'stationdoor',name:'STATION DOOR',look:TEXT.stationDay,opts:()=>stationOpts()};
 M.O['5,6']=look(TEXT.sign);
 lay(M,2,7,16,6,'g');lay(M,8,13,3,13,'d');lay(M,3,0,13,1,'s');
 put(M,'car',3,10,3,1,{tint:'#3a3e48'});[3,4,5].forEach(x=>M.O[x+',10']={id:'car',name:'CAR',look:TEXT.car,opts:()=>carOpts(),used:()=>false});
 put(M,'lamp',15,7);put(M,'lamp',29,11);put(M,'barrel',2,8);M.O['2,8']={id:'barrel',name:TEXT.barrel,look:TEXT.barrelLook,opts:()=>burnOpts(),used:()=>!holderOf('cart79')};put(M,'pole',16,11);
 // the tower in its clearing: the fence around its foot, the guy-wire anchors, the transmitter shed
 lay(M,20,3,13,11,'e');put(M,'towerfence',23,6,6,5,{walk:1,gate:25});block(M,23,6,6,1);block(M,23,6,1,5);block(M,28,6,1,5);block(M,23,10,6,1);open(M,25,10);
 put(M,'tower',25,8,1,1);M.O['25,9']={id:'tower',name:'THE TOWER',look:TEXT.towerLook,opts:()=>towerOpts(),used:()=>N?!F.wire:!!G.fs.used['opt:tower']};M.O['24,7']=M.O['27,7']=look(TEXT.towerFence);
 [[21,4],[31,4],[21,12],[31,12]].forEach(([x,y])=>put(M,'anchor',x,y));put(M,'shed',30,8,3,2);['30,9','31,9','32,9'].forEach(k=>M.O[k]={id:'shed',name:TEXT.shed,look:TEXT.shedLook,opts:[{use:'fix',once:'shed',ok:()=>{G.flags.grid=1;return play(TEXT.shedFix)},fail:()=>said('Wires. Old wires, new wires. One of them bites.')}]});
 // cane on every side, stubble along the road, a stand of tall cane, the path north into the fields
 lay(M,17,14,19,12,'s');lay(M,0,14,8,12,'s');
 [[0,2,2],[33,0,3],[18,0,2],[0,22,3],[30,18,3]].forEach(([x,y,w])=>{put(M,'tallcane',x,y,w,1);lookAll(M,row(x,y,w),TEXT.tall)});
 lay(M,26,0,1,3,'d');
 if(ph()===3)M.warps['26,0']=intoCane;else bounceDir(M,['26,0'],TEXT.rowsDay,'down');
 bounceDir(M,['8,25','9,25','10,25'],TEXT.hwy,'up');
 M.arrive=khltArrive;
 return M}
function buildBooth(){const M=room('booth','KHLT · BROADCAST BOOTH',13,8,'c',{alpha:.82}),F=G.flags;
 put(M,'console',2,3,7,1);lookAll(M,['2,3','3,3','4,3','5,3','7,3'],TEXT.boardB);M.O['6,3']=look(TEXT.mic);
 put(M,'carts',9,3,2,1);M.O['9,3']=M.O['10,3']={id:'carts',name:TEXT.carts,look:TEXT.cartsLook,opts:()=>playOpts(),used:()=>has('cart')||!holderOf('cart79')};put(M,'onair',5,0,2,1,{walk:1});M.O['5,2']=look(TEXT.onair);
 put(M,'txwindow',9,0,3,2,{walk:1});['9,2','10,2','11,2'].forEach(k=>M.O[k]={id:'txwin',name:TEXT.window,look:()=>said(ph()===3?TEXT.windowNight:TEXT.windowLook),opts:()=>keyOpts(),used:()=>ph()!==3||!!F.carrier||!holderOf('crystal')});
 put(M,'turntable',1,5,2,1);M.O['1,5']=M.O['2,5']=look(TEXT.turntable);
 // The hidden hotspot (Item list, Mushrooms): the guest mic at the board's right end, only while the lead is High (field.js)
 M.O['8,3']={id:'guestmic',hidden:'mushrooms',name:TEXT.micName,look:readMic,used:()=>has('ebooth'),glint:(c,x,y,now)=>DAA.micGlint(c,x,y,now)};
 open(M,12,5);M.warps['12,5']=()=>goTo('records',1,5,'right');
 door(M,6,7,'khlt',9,7,'down');
 M.arrive=boothArrive;
 return M}
function buildRecords(){const M=room('records','KHLT · RECORD ROOM',10,8,'o',{alpha:.8});
 put(M,'records',1,0,8,3,{walk:1});lookAll(M,row(1,3,7),TEXT.shelves);put(M,'recrack',4,5,3,1);
 row(4,5,3).forEach(k=>M.O[k]={id:'cartrack',name:TEXT.cartShelf,look:TEXT.cartLook,opts:()=>cartOpts(),used:()=>!!G.flags.cartGot});
 put(M,'cabinet',8,3);M.O['8,3']={id:'cabinet',name:TEXT.cabinet,look:TEXT.cabinetLook,opts:()=>has('log')?[]:[{use:'records',ok:()=>findLog(TEXT.cabFind),fail:()=>said('Logs, logs, logs. 1974 is in the 1977 folder.')},{use:'paper',ok:()=>findLog(TEXT.cabFind),fail:()=>said('Somebody filed these by mood.')},{use:'sweep',ok:()=>findLog(TEXT.cabFind),fail:()=>said('You find a 1978 Christmas party sign-up sheet. Emile Broussard signed up for napkins.')}],used:()=>has('log')};
 put(M,'boxes',1,6,1,1,{v:2});M.O['1,6']={id:'boxes',name:TEXT.boxes,look:TEXT.boxesLook,opts:[{use:'sweep',once:'emilebox',ok:async()=>{await said(TEXT.boxFind);await pickup('headphones')},fail:()=>said('Cables. A lot of cables. Every one of them is tangled with every other one.')}]};
 put(M,'boxes',8,6,1,1,{v:1});put(M,'bulb',5,0,1,1,{walk:1});
 open(M,0,5);M.warps['0,5']=()=>goTo('booth',11,5,'left');return M}

// ---- THE CANE FIELDS: night 2 only, the danger zone (40 x 30) ----
// The tiles each roamer walks, in front of what it guards (Gameplay loop, Roamers)
const BEAT={ditch:[[7,14],[8,14],[9,14],[10,14],[11,14],[12,14],[13,14]],boot:[[23,5],[24,5],[25,5],[26,5],[27,5],[28,5],[29,5]],shed:[[32,19],[33,19],[34,19],[35,19],[36,19],[37,19],[38,19]]};
function buildCane(){const M=blank('cane','THE CANE FIELDS',40,30,'u','night'),F=G.flags;M.alpha=.76;M.warm='#ffcf80';
 lay(M,19,0,3,30,'d');lay(M,0,15,40,1,'a');block(M,0,15,19,1);block(M,22,15,18,1);put(M,'ditch',0,15,40,1,{walk:1,bridge:[19,22]});lookAll(M,row(0,14,19).concat(row(22,14,18)),TEXT.ditch);
 put(M,'culvert',19,15,3,1,{walk:1});
 [[3,3,3],[11,6,2],[27,4,3],[34,9,2],[6,20,3],[13,24,2],[26,21,3],[33,26,3],[1,11,2],[30,12,2]].forEach(([x,y,w])=>{put(M,'tallcane',x,y,w,1);lookAll(M,row(x,y,w),TEXT.tall)});
 put(M,'pumpshed',35,17,3,2);put(M,'scarepole',8,9);
 // what the roamers guard: the direction finder in the ditch, Wade's boot at the tall cane, the Lantern Box in the shed
 M.O['10,15']={id:'finder',name:TEXT.finderSpot,look:TEXT.finderLook,opts:()=>G.fs.used['opt:ditch']?[]:[{label:TEXT.finderTake,once:'ditch',run:takeFinder}],used:()=>!!G.fs.used['opt:ditch']};
 M.O['27,4']={id:'boot',name:TEXT.bootSpot,look:TEXT.bootLook,opts:[{use:'track',label:TEXT.bootTrack,once:'boot',ok:async()=>{setTrail([[27,5],[25,4],[23,3],[22,2],[21,1],[20,0]],'path');await said(TEXT.bootTrackDo)},fail:()=>said(TEXT.bootTrackFail)}]};
 ['35,19','36,19','37,19'].forEach(k=>M.O[k]={id:'shedbox',name:TEXT.shedBox,look:TEXT.shedBoxLook,opts:()=>G.fs.used['box:cane']?[]:[{label:TEXT.shedOpen,run:openBox}],used:()=>!!G.fs.used['box:cane']});
 lay(M,19,0,3,1,'e');
 M.warps['20,0']=M.warps['19,0']=M.warps['21,0']=enterRadials;
 lay(M,19,29,3,1,'d');M.warps['19,29']=M.warps['20,29']=M.warps['21,29']=()=>goTo('khlt',26,1,'down');
 M.roamers=[
  {id:'lditch',types:['listener'],sprite:'listener',name:'Listener',skulls:1,tags:EN.listener.tags,path:BEAT.ditch,look:'A shape made of cane trash and wire walks the ditch bank, back and forth, an old radio where its head should be. It\'s listening to the water.',guard:takeFinder,after:caneCheck},
  {id:'lboot',types:['listener2'],sprite:'listener',name:'Listener',skulls:1,tags:EN.listener.tags,path:BEAT.boot,look:'Another one walks the end of the rows by the tall cane, radio held to where its ear should be. Its lips aren\'t there, but they\'re moving.',after:caneCheck},
  {id:'rshed',types:['rowhand'],sprite:'rowhand',name:'Rowhand',skulls:2,tags:EN.rowhand.tags,path:BEAT.shed,look:'A tall one stands guard at the pump shed, a cane knife where its hands should be. It cuts at the air, slow, the way you\'d cut cane.',guard:openBox,after:caneCheck}];
 M.danger=true;
 M.arrive=caneArrive;
 return M}
// ---- THE RADIAL FIELD: night 2, the finale area (22 x 21); the boss waits at the circle's north end ----
// Three tiles in front of it (10-12, 4) and talking to it ask Go in / Not yet. The missing, the radial wires and the way
// out are all reached without crossing that row.
async function enterRadials(){const r=await askNotYet('The cane opens on a bare circle of dirt. Something is standing in the middle of it, at a microphone that isn\'t there.',['Go in','Not yet']);if(r===0)await goTo('radials',11,18,'up');else{G.dir='down';await stepBack()}}
function buildRadials(){const M=blank('radials','THE RADIAL FIELD',22,21,'u','night'),F=G.flags;M.alpha=.74;M.warm='#ffcf80';
 // the boss stands on the map in its battle sprite (cases/dead-air-battle-art.js), small, the way roamers do
 M.art=Object.assign(Object.create(window.DAA),{folk:(id,dir,bl,MM)=>id==='nightline'&&window.DAB?DAB.mapSprite(bl):DAA.folk(id,dir,bl,MM)});
 put(M,'circle',2,1,18,14,{walk:1});
 for(let y=1;y<15;y++)for(let x=2;x<20;x++){const dx=(x+.5-11)/8.5,dy=(y+.5-8)/6.5;if(dx*dx+dy*dy<1)lay(M,x,y,1,1,'e')}
 lay(M,10,14,3,7,'d');
 [[5,4],[16,4],[4,11],[17,11],[11,1]].forEach(([x,y])=>M.O[x+','+y]=look(TEXT.radial));
 [[0,0,2],[20,0,2],[0,14,2],[20,14,2],[3,18,3],[16,18,3]].forEach(([x,y,w])=>put(M,'tallcane',x,y,w,1));
 const W={darlene:[8,8],wade:[14,8],lucien:[11,10]};
 const NP=[];
 for(const id of inCircle()){const [x,y]=W[id];if(G.flags.taken!==id&&!awake(id))put(M,'radioglow',x,y,1,1,{walk:1});
  if(G.flags.taken!==id)NP.push(folk({id,x,y,dir:'up'},()=>talkMissing(id)))}
 if(!F.boss)NP.push(folk({id:'nightline',x:11,y:3,dir:'down'},bossAsk));
 M.npcs=NP;
 M.warps['11,20']=M.warps['10,20']=M.warps['12,20']=async()=>{const r=await ask('',TEXT.outQ,TEXT.outOpts);if(r===0)await goTo('cane',20,1,'down');else{G.dir='up';await stepBack()}};
 M.onStep=async()=>{if(!F.boss&&G.y===4&&G.x>=10&&G.x<=12){held=[];await bossAsk()}};
 M.arrive=radialsArrive;
 return M}
const MAPS={halcott:buildHalcott,sheriff:buildSheriff,achord:buildAchord,hebert:buildHebert,hall:buildHall,feed:buildFeed,khlt:buildKhlt,booth:buildBooth,records:buildRecords,cane:buildCane,radials:buildRadials};

// ================= THE CAR AND THE DAY =================
function carOpts(){const o=[],p=ph();
 if(G.map==='halcott'){if(p>=2)o.push({label:TEXT.carOpt.khlt,run:()=>driveTo('khlt')})}
 else o.push({label:TEXT.carOpt.town,run:()=>driveTo('halcott')});
 if(p===0)o.push({label:TEXT.carOpt.wait,run:waitNight1});
 if(p===1)o.push({label:TEXT.carOpt.sleep,run:sleepDay2});
 if(p===2)o.push({label:TEXT.carOpt.night,run:waitNight2});
 return o}
async function driveTo(where){
 // night 2: leaving the fish-fry crowd at Miss Odile's steps is a point of no return (her house burns)
 if(where==='khlt'&&ph()===3&&G.flags.fry==='boiled'&&!G.flags.porch){const r=await askNotYet(TEXT.mobGoQ+' '+TEXT.mobGoClose,TEXT.turnOpts);if(r!==0)return;G.flags.porch='burned'}
 await fade(1);await say('',(chief()?TEXT.walkTo:TEXT.driveTo)[where==='khlt'?'khlt':'town']);
 if(where==='khlt')goMap('khlt',4,11,'up');else goMap('halcott',23,7,'down');checkpoint();await fade(0);if(G.M.arrive)await G.M.arrive()}
// the turns of the day, with Go on / Not yet and what closes (studio-bible/play.md)
async function turn(q,close,lines,p,map,x,y,dir){const r=await askNotYet(q+' '+close,TEXT.turnOpts);if(r!==0)return false;
 await fade(1);G.flags.ph=p;await play(lines);goMap(map,x,y,dir);banner(TEXT.phase[p]);checkpoint();await fade(0);
 if(p===1||p===3)await trigger('night');if(G.M.arrive)await G.M.arrive();return true}
async function waitNight1(){if(!G.flags.checkin){await said(TEXT.turnDutch);return}await turn(TEXT.wait1Q,TEXT.wait1Close,TEXT.wait1,1,'halcott',29,18,'up')}
async function sleepDay2(){if(!G.flags.heard){await said('The show hasn\'t come on yet. Miss Odile\'s porch, Bayou Street.');return}
 if(await turn(TEXT.sleepQ,TEXT.sleepClose,TEXT.sleep,2,'halcott',23,7,'down')){await rest(1);if(named())await said(fillT(TEXT.named,{n:named().name,'n@':named()}))}}
async function waitNight2(){const F=G.flags;
 if(gateClues()<3){await said(TEXT.turnClues,{n:gateClues()});return}
 if(!F.fry){await said(TEXT.turnFry);return}
 if(!F.deduce){await said(TEXT.turnDeduce);return}
 await turn(TEXT.wait2Q,TEXT.wait2Close,TEXT.wait2,3,'halcott',23,7,'down')}
function truckOpts(){const F=G.flags;if(ph()!==2||F.nap)return[];
 return[{label:TEXT.remyNap,run:async()=>{F.nap=1;addFear();await fade(1);await play(TEXT.remyNapDo);await rest(1);checkpoint();await fade(0)}}]}

// ================= HALCOTT BY DAY: the sheriff, the deputy, the families, the shops =================
async function talkDutch(){const F=G.flags;
 if(!F.checkin){F.checkin=1;await cut('dutch',()=>play(TEXT.dutch1));checkpoint();return}
 if(ph()===2){await play(TEXT.dutch2);
  return hotspot({name:'SHERIFF',opts:[
   {label:TEXT.dutch79,show:()=>!has('log'),run:async()=>{if(F.joelleTold){await play(TEXT.dutch79Open);await findLog(TEXT.fileFind)}else await play(TEXT.dutch79Shut)}},
   {use:'creds',label:TEXT.dutch79,show:()=>!has('log')&&!F.joelleTold,ok:async()=>{await play(TEXT.dutch79Open);await findLog(TEXT.fileFind)},fail:()=>play(TEXT.dutch79Shut)},
   {use:'paper',label:TEXT.order,show:()=>!F.unplug,ok:async()=>{F.unplug='order';addFear(-1);await play(TEXT.orderDo);checkpoint()},fail:()=>play(TEXT.orderNo)}]},'dutch')}
 await play(TEXT.dutch0)}
function ficheOpts(){const F=G.flags;if(has('names'))return[];
 return[{use:'records',ok:()=>findNames(TEXT.ficheRec),fail:()=>said('The reel jams. 1979 goes by sideways at forty miles an hour.')},
  {use:'paper',ok:()=>findNames(TEXT.fichePaper),fail:()=>said('The parish rolls are in a box that says MISC 2. MISC 1 is missing.')},
  {label:TEXT.ficheLong,run:async()=>{if(F.marcyTold){await findNames(TEXT.ficheQuick);return}addFear();await fade(1);await play(TEXT.ficheLongDo);await fade(0);await findNames([])}}]}
async function findNames(lines){await play(lines);clue('names',TEXT.cNames);checkpoint()}
async function findLog(lines){await play(lines);clue('log',TEXT.cLog);checkpoint()}
function shelfOpts(){const F=G.flags;if(F.finder)return[];const get=async()=>{F.finder=1;await said(TEXT.shelfFind);await pickup('finder');checkpoint()};
 return[{use:'paper',ok:get,fail:()=>said('Renée says she\'d need it signed for. In triplicate. By Dutch, who\'s at lunch.')},{use:'creds',ok:get,fail:()=>said('Renée looks at your badge for a long time. "No," she says.')}]}
async function talkLucienCell(){const F=G.flags;await play(TEXT.lucienCell);
 if(!F.crystalGot)await hotspot({name:'MR. ARCENEAUX',opts:[{label:TEXT.lucienCellAsk,run:async()=>{await play(TEXT.lucienCellGive);await getCrystal()}}]},'lcell')}
async function talkRenee(){const F=G.flags;
 if(F.unplug){await play(TEXT.reneeDone);return}
 if(!F.renee1){F.renee1=1;await play(TEXT.renee1)}else await play(TEXT.renee2);
 if(ph()===2)await hotspot({name:'DEPUTY',opts:[{label:TEXT.reneePull,run:async()=>{F.unplug='pulled';addFear(-1);await fade(1);await play(TEXT.reneePullDo);await fade(0);await overstepHere('public')}}]},'renee')}
// the families: Joelle is a liar about her mother (Paranoia); the missing intel adds +10 Empathy here
async function talkJoelle(){const F=G.flags;await trigger('liar');
 if(F.joelleTold){await play(TEXT.joelleAfter);return}
 if(!F.joelle1){F.joelle1=1;await play(TEXT.joelle1)}
 const tell=async()=>{F.joelleTold=1;await play(TEXT.joelleTruth);checkpoint()};
 await hotspot({name:'JOELLE',look:()=>play(TEXT.joelleLie),opts:[{use:'read',mod:famMod,ok:tell},{use:'calm',mod:famMod,ok:tell},{use:'talk',ok:tell}]},'joelle')}
async function lookNote(){await play(TEXT.noteLook);await horror(HORRORS.note)}
async function talkMarcy(){const F=G.flags;
 if(F.marcyTold){await play(TEXT.marcyAfter);return}
 if(!F.marcy1){F.marcy1=1;await play(TEXT.marcy1)}
 const tell=async()=>{F.marcyTold=1;await play(TEXT.marcyTruth);checkpoint()};
 await hotspot({name:'MARCY',opts:[{use:'read',mod:famMod,ok:tell},{use:'calm',mod:famMod,ok:tell},{use:'talk',ok:tell}]},'marcy')}
// Miss Odile: Read, Calm or Talk gets her brother's name; she gives the static radio with it
async function talkOdile(){const F=G.flags,p=ph();
 if(p===1){await play(TEXT.odileNight);return}
 if(p===3){if(has('emile')&&!F.radioGot)await giveRadio();
  if(holdersOf('Protect the innocent').length&&!F.odileHall)return hotspot({name:'MISS ODILE',opts:[{label:TEXT.walkOdile,run:walkOdile}]},'odile3');
  await play(TEXT.odileAfter);return}
 if(has('emile')){if(!F.radioGot)await giveRadio();else await play(TEXT.odileAfter);return}
 if(!F.odile1){F.odile1=1;await play(TEXT.odile1)}
 await hotspot({name:'MISS ODILE',look:()=>play(TEXT.odileLie),opts:[{use:'read',ok:odileTells},{use:'calm',ok:odileTells},{use:'talk',ok:odileTells}]},'odile')}
async function odileTells(){await play(TEXT.odileTruth);clue('emile',TEXT.cEmile);await giveRadio()}
async function giveRadio(){const F=G.flags;if(F.radioGot)return;F.radioGot=1;await said(TEXT.odileGive);await pickup('staticradio');checkpoint()}
// the Protect the innocent moment (night 2): walk her to the church hall. It costs the time (fear +1); the crowd, if
// there is one, finds an empty porch.
async function walkOdile(){const F=G.flags;F.odileHall=1;addFear();await fade(1);await play(TEXT.walkOdileDo);await fade(0);
 for(const m of holdersOf('Protect the innocent'))await motivate(m);
 if(F.fry==='boiled'&&!F.porch){F.porch='empty';await said(TEXT.mobEmpty)}
 G.M=buildHalcott();checkpoint()}
// Toby: a liar (Paranoia). Read or Calm: "the Arceneaux boy" (+20 with Lucien), and the coffee
async function talkToby(){const F=G.flags;await trigger('liar');
 if(ph()===3){await play(TEXT.tobyNight);return}
 if(F.tobyTold){await play(TEXT.tobyAfter);return}
 if(!F.toby1){F.toby1=1;await play(TEXT.toby1)}
 const tell=async()=>{F.tobyTold=1;await play(TEXT.tobyTruth);await said(TEXT.tobyGive);await pickup('gascoffee');checkpoint()};
 await hotspot({name:'TOBY',look:()=>play(TEXT.tobyLie),opts:[{use:'read',ok:tell},{use:'calm',ok:tell},{item:'cash',label:'Buy him a honey bun',run:tell}]},'toby')}
async function talkRemy(){const F=G.flags;
 if(!F.remy1){F.remy1=1;await play(TEXT.remy1)}
 if(G.fs.used['opt:candy']){await play(TEXT.remyAfter);return}
 await hotspot({name:'REMY',opts:[{use:'talk',label:TEXT.remyCandy,once:'candy',ok:async()=>{await play(TEXT.remyCandyDo);await pickup('shrooms')},fail:()=>said('Remy has never heard of a mushroom. Remy is a simple man with a crawfish.')},
  {item:'cash',label:TEXT.remyCash,show:()=>!G.fs.used['opt:candy'],run:async()=>{G.fs.used['opt:candy']=1;await play(TEXT.remyCandyDo);await pickup('shrooms')}}]},'remy')}
async function talkPastor(){const F=G.flags;if(!F.pastor1){F.pastor1=1;await play(TEXT.pastor1)}else await play(TEXT.pastorAfter)}
// Lucien: a liar (Paranoia). Day 2: Talk, Calm or Read (+20 once Toby talked) keeps him off the air and gets the crystal
async function talkLucien(){const F=G.flags;await trigger('liar');
 if(!F.lucien1){F.lucien1=1;await play(TEXT.lucien1);if(ph()===0)return}
 if(ph()!==2){await play(TEXT.lucienLie);return}
 const m=()=>F.tobyTold?20:0,tell=async()=>{F.lucien='safe';await play(TEXT.lucienTruth);await getCrystal()};
 await hotspot({name:'MR. ARCENEAUX',look:()=>play(TEXT.lucienLie),opts:[{use:'talk',mod:m,ok:tell},{use:'calm',mod:m,ok:tell},{use:'read',mod:m,ok:tell}]},'lucien')}
async function getCrystal(){const F=G.flags;if(F.crystalGot)return;F.crystalGot=1;await pickup('crystal');checkpoint()}
function safeOpts(){const F=G.flags;if(F.crystalGot)return[];const got=async()=>{await play(TEXT.safeDo);await getCrystal();await overstepHere('seen')};
 return[{use:'force',label:TEXT.safeForce,ok:got,fail:()=>said('The safe was built in 1951 by people who expected you.')},{use:'fix',label:TEXT.safeFix,ok:got,fail:()=>said('The dial goes round. And round. Mr. Arceneaux sighs.')}]}
async function halcottArrive(){const F=G.flags;
 // the cameo (an arc touch, at most one per case): leaving the fish fry, by the pot; the lead's first sighting ever rolls 0/1
 if(ph()===2&&F.fry&&!F.cameo){F.cameo=1;const L=lead();await play(TEXT.cameo);if(!L.a.sawTall){L.a.sawTall=1;await horror(HORRORS.cameo,{who:[L]})}checkpoint()}}

// ================= NIGHT 1: THE FIRST BROADCAST =================
function radioOpts(){const F=G.flags;if(ph()!==1)return[];const o=[];
 if(!F.heard)o.push({label:TEXT.radioOpt,run:broadcast1});
 else if(!has('emile')&&!F.odileSat)o.push({label:TEXT.odileSit,run:async()=>{F.odileSat=1;addFear();await fade(1);await play(TEXT.odileSitDo);await fade(0);clue('emile',TEXT.cEmile);checkpoint()}});
 if(F.heard)o.push({label:TEXT.carOpt.sleep,run:sleepDay2});
 return o}
// the show plays as a scene in the broadcast look (DAA.onAir); all three roll its horror. Then one thing to try.
async function broadcast1(){const F=G.flags;DAA.onAir(true);
 try{await cut('show1',()=>play(TEXT.show1));await horror(HORRORS.show1);if(!party.some(m=>!m.gone))return;
  await oneThing1();await play(TEXT.show1End)}
 finally{DAA.onAir(false)}
 F.heard=1;checkpoint()}
async function oneThing1(){const F=G.flags;let done=false;const go=f=>async x=>{done=true;await f(x)};
 const trace=async()=>{await play(TEXT.traceDo);clue('trace',TEXT.cTrace)},rec=async()=>{await play(TEXT.recDo);clue('voices',TEXT.cVoices)};
 await say('',TEXT.show1Q);
 await hotspot({name:'THE NIGHT LINE',opts:[
  {use:'trace',label:TEXT.traceOpt,mod:traceMod,ok:go(trace),fail:go(()=>said(TEXT.traceFail))},
  {use:'fix',label:TEXT.loopOpt,mod:traceMod,ok:go(trace),fail:go(()=>said(TEXT.traceFail))},
  {use:'sample',label:TEXT.recOpt,ok:go(rec),fail:go(()=>said(TEXT.recFail))},
  {use:'crack',label:TEXT.recOpt,ok:go(rec),fail:go(()=>said(TEXT.recFail))},
  {item:'recorder',label:TEXT.recOpt,run:go(rec)},
  {label:TEXT.callOpt,run:go(callIn)},
  {label:TEXT.listenOpt,run:go(()=>said(TEXT.listenDo))}]},'show1');
 if(!done)await said(TEXT.listenDo);
 F.tried1=1}
// calling in: the host knows the lead, says their first Bond's name, and keeps them: Named (a case-only mark: −10 Stealth
// all day 2, and the host calls them on night 2). It also gives `voices`.
async function callIn(){const F=G.flags,L=lead(),b=((L.a.bonds||[])[0]||{}).name||'your mother';F.called=1;F.named=L.a.id;
 await play(TEXT.callDo);await play(TEXT.callHost,{b});await horror(HORRORS.call,{who:[L]});
 await said(TEXT.callAfter);clue('voices',TEXT.cVoices);await say('',fillT(TEXT.named,{n:L.name,'n@':L}))}

// ================= DAY 2: THE FISH FRY AND THE DEDUCTION =================
async function hallArrive(){const F=G.flags;if(ph()!==2)return;
 if(!F.fry){await fishFry();return}
 if(phoneRings())await bigHatCall()}
async function fishFry(){const F=G.flags;
 await cut('fry',()=>play(TEXT.fryIn));await play(TEXT.ray);
 let out=null;
 const calm=async lines=>{out='calmed';await play(lines)},point=async lines=>{out='pointed';await play(lines)};
 for(let tries=0;!out&&tries<8;tries++){
  const opts=[
   {use:'calm',label:TEXT.fryCalm,once:'fryCalm',mod:fryMod,ok:()=>calm(TEXT.fryCalmDo),fail:()=>said(TEXT.fryFail)},
   {use:'talk',label:TEXT.fryTalk,once:'fryTalk',mod:fryMod,ok:()=>calm(TEXT.fryTalkDo),fail:()=>said(TEXT.fryFail)},
   {use:'paper',label:TEXT.fryPaper,once:'fryPaper',mod:()=>-10*fear(),ok:()=>calm(TEXT.fryPaperDo),fail:()=>said(TEXT.fryFail)},
   {use:'lean',label:TEXT.fryLean,once:'fryLean',mod:fryMod,ok:()=>point(TEXT.fryLeanDo),fail:()=>said(TEXT.fryFail)},
   {label:TEXT.fryFaith,show:()=>holdersOf('Faith').length>0,run:faithMoment},
   {use:'shoot',label:TEXT.fryShoot,once:'fryShoot',ok:async()=>{out='boiled';F.shot=1;await play(TEXT.fryShootDo);await overstepHere('public')},fail:async()=>{out='boiled';F.shot=1;await play(TEXT.fryShootDo);await overstepHere('public')}},
   {label:TEXT.fryLet,run:async()=>{out='boiled';await said(TEXT.fryLetDo)}}];
  if(!hotOpts({opts}).length)break;
  await say('',TEXT.fryQ,{keep:true,instant:false});await hotspot({name:'THE FISH FRY',opts},'fry');hideTB();
  if(F.faith&&!out)out='pointed'}
 F.fry=out||'boiled';
 await said(F.fry==='calmed'?TEXT.fryCalmed:F.fry==='pointed'?TEXT.fryPointed:TEXT.fryBoiled);
 G.M=buildHall();checkpoint();
 if(phoneRings())await bigHatCall()}
// the Faith moment: the pastor asks; either answer points the room and restores the Faith holders' SAN. The cost: Mama
// Lou goes home while the room prays, and her clue routes with her.
async function faithMoment(){const F=G.flags;await play(TEXT.faithQ);
 const r=await choose([TEXT.faithPray,TEXT.faithMen],{inBox:false,title:'PASTOR'});
 F.faith=r===1?'men':'pray';await play(r===1?TEXT.faithMenDo:TEXT.faithPrayDo);
 for(const m of holdersOf('Faith'))await motivate(m);
 F.louGone=1}
const phoneRings=()=>ph()===2&&!!G.flags.fry&&!G.flags.deduce&&gateClues()>=3;
async function talkLou(){const F=G.flags;
 if(F.louGone){await said(TEXT.louGone);return}
 if(!F.lou1){F.lou1=1;await play(TEXT.lou1)}
 if(F.louTold||ph()!==2){await play(TEXT.louAfter);return}
 await hotspot({name:'MAMA LOU',opts:[{use:'read',once:'lou',ok:async()=>{F.louTold=1;await play(TEXT.louRead);clue('names',TEXT.cNames);clue('emile',TEXT.cEmile);checkpoint()},fail:()=>said('She hands you a plate and turns back to the oil. That\'s all you\'re getting today.')}]},'lou')}
// The deduction (Gameplay loop, Deduction): Big Hat on the kitchen phone. Right needs (`emile` or `ebooth`) and (`log` or
// `names`); Lucien needs `names`. INT Hunch offers a hint. A wrong answer costs time (fear +1) and the cane's roamers
// start awake, never progress: night 2 opens either way.
async function bigHatCall(){const F=G.flags;
 await said(TEXT.phoneRing);await play(TEXT.bigHat0);await hunch(TEXT.hunch);
 const right=()=>(has('emile')||has('ebooth'))&&(has('log')||has('names'));
 let r=await ask('BIG HAT',TEXT.bigHatAsk,TEXT.bigHatOpts);
 // Loose thread (an arc perk, spec 008): once per case, a wrong answer costs nothing and you can answer again
 const lt=!(r===1&&right())&&live().find(m=>perkOn(m,'truth'));
 if(lt){await say('',fillT(BLS.HOMEW.perkUsed,{p:BLS.HOMEW.perks.truth[0],n:lt.name}));r=await ask('BIG HAT',TEXT.bigHatAsk,TEXT.bigHatOpts)}
 if(r===1&&right()){F.deduce='right';await play(TEXT.bigHatRight)}
 else if(r===1){F.deduce='noproof';await play(TEXT.bigHatNoProof)}
 else if(r===2&&has('names')){F.deduce='half';if(F.lucien!=='safe')F.lucien='safe';await play(TEXT.bigHatHalf)}
 else if(r===2){F.deduce='noproof';await play(TEXT.bigHatNoHalf)}
 else{F.deduce='wrong';addFear();await play(TEXT.bigHatWrong)}
 checkpoint()}

// ================= KHLT: THE STATION, THE BOOTH, THE RECORD ROOM =================
function stationOpts(){const F=G.flags;const inside=async t=>{F.inStation=1;if(t)await play(t);G.M=buildKhlt();checkpoint();await goTo('booth',6,6,'up')};
 return[{use:'force',ok:async()=>{await inside(TEXT.stationForce);await overstepHere(null)},fail:()=>said('The door\'s steel. Your shoulder isn\'t.')},
  {use:'fix',ok:()=>inside(TEXT.stationFix),fail:()=>said('The lock knows you\'re coming.')},
  {use:'climb',label:TEXT.stationClimb,ok:()=>inside(TEXT.stationClimbDo),fail:()=>said('You get one leg through the back window. Then you get it back out.')},
  {label:TEXT.stationKey,show:()=>!!G.flags.checkin&&!chief(),run:()=>inside(TEXT.stationKeyDo)}]}
function towerOpts(){const F=G.flags;
 if(isNight())return F.wire?[{label:TEXT.wire,run:enterRadials}]:[];
 return[{use:'climb',label:TEXT.towerClimb,once:'tower',ok:async()=>{await play(TEXT.towerClimbDo);clue('trace',TEXT.cTrace);checkpoint()},fail:()=>said(TEXT.towerFail)}]}
async function khltArrive(){const F=G.flags;if(ph()===3&&!F.n2arrive){F.n2arrive=1;await cut('n2arrive',()=>play(TEXT.n2arrive));checkpoint()}}
// the cart: found behind the logs; played on the booth's cart machine it's a Severe horror and the Static stands up
function cartOpts(){const F=G.flags;if(F.cartGot)return[];const take=async()=>{F.cartGot=1;await said(TEXT.cartFound);await pickup('cart79');checkpoint()};
 const o=[{use:'sweep',label:TEXT.cartTake,ok:take,fail:()=>said('JINGLES. PSA. Weather beds. Your hand keeps skipping one at the end.')},
  {use:'records',label:TEXT.cartTake,ok:take,fail:()=>said('You can\'t make the labels add up to anything.')},
  {use:'identify',label:TEXT.cartIdent,ok:take,fail:()=>said('They\'re all cold. It\'s a cold room.')}];
 if(has('log'))o.unshift({label:TEXT.cartTake,run:take});
 return o}
function playOpts(){const F=G.flags;if(has('cart')||!holderOf('cart79'))return[];const go=async()=>playCart();
 return[{use:'fix',label:TEXT.playFix,ok:go,fail:()=>said('The cart machine eats the tape a little and spits it back out.')},
  {use:'crack',label:TEXT.playOpt,ok:go,fail:()=>said('The machine wants a cue tone you can\'t give it.')},
  {use:'sample',label:TEXT.playOpt,ok:go,fail:()=>said('You get it in, but it plays at the wrong speed. Mice, screaming.')}]}
async function playCart(){const F=G.flags;
 await cut('cart',()=>play(TEXT.playDo));await horror(HORRORS.cart);
 if(!party.some(m=>!m.gone))return;
 clue('cart',TEXT.cCart);clue('voices',TEXT.cVoices);checkpoint();
 await play(TEXT.staticRise);
 const r=await battle(['static'],{story:true,intro:TEXT.staticIntro});if(r==='lose')return gameOver();
 F.static=1;await play(TEXT.staticDone);checkpoint()}
function burnOpts(){if(!holderOf('cart79'))return[];return[{label:TEXT.burnOpt,run:burnCart}]}
async function burnCart(){const F=G.flags,h=holderOf('cart79');if(!h)return;
 const r=await askNotYet(TEXT.burnQ+' '+TEXT.burnClose,TEXT.turnOpts);if(r!==0)return;
 await said(TEXT.burnPage);spend(h.m,h.it);F.burn=1;await play(TEXT.burnDo);checkpoint()}
function keyOpts(){const F=G.flags;if(ph()!==3||F.carrier||!holderOf('crystal'))return[];const go=async()=>{F.carrier=1;await play(TEXT.keyDo);checkpoint()};
 return[{use:'fix',label:TEXT.keyOpt,once:'key',ok:go,fail:()=>said(TEXT.keyFail)},{use:'sample',label:TEXT.keySample,once:'key2',ok:go,fail:()=>said(TEXT.keyFail)}]}
// the hidden hotspot (Mushrooms): the guest mic breathes; a clue (the host is wearing Emile) and an Unsettling horror
async function readMic(){await play(TEXT.micLook);await horror(HORRORS.mic);if(!has('ebooth')){clue('ebooth',TEXT.cMic);checkpoint()}}

// ================= NIGHT 2: THE SECOND BROADCAST =================
async function boothArrive(){const F=G.flags;if(ph()!==3||F.show2)return;await broadcast2()}
async function broadcast2(){const F=G.flags;F.show2='booth';DAA.onAir(true);
 try{
  await cut('show2',async()=>{await play(TEXT.show2a);await play(F.fry==='boiled'?TEXT.show2All:TEXT.show2Fam);if(F.unplug)await said(TEXT.show2Few)});
  if(named()){await play(TEXT.show2Named);await horror(HORRORS.named2,{who:[named()]})}
  await cut('show2b',()=>play(TEXT.show2b));
  await oneThing2();
 }finally{DAA.onAir(false)}
 checkpoint()}
async function oneThing2(){const F=G.flags;let done=false;const go=f=>async x=>{done=true;await f(x)};
 const trace=async()=>{F.wire=1;await play(TEXT.trace2Do);clue('trace',TEXT.cTrace)};
 const canName=has('emile')||has('ebooth');
 await say('',TEXT.show2Q);
 await hotspot({name:'THE NIGHT LINE',opts:[
  {use:'trace',label:TEXT.traceOpt,mod:traceMod,ok:go(trace),fail:go(()=>said(TEXT.traceFail))},
  {use:'fix',label:TEXT.loopOpt,mod:traceMod,ok:go(trace),fail:go(()=>said(TEXT.traceFail))},
  {label:TEXT.nameOpt,why:canName?'':TEXT.nameNo,run:go(async()=>{if(!canName){done=false;await said(TEXT.nameNo);return}F.name=1;await play(TEXT.nameDo)})},
  {label:TEXT.letOpt,run:go(()=>said(TEXT.letDo))}]},'show2');
 if(!F.name&&!done)await said(TEXT.letDo)}
// north into the cane: before the booth's show, that's a point of no return for answering it
async function intoCane(){const F=G.flags;
 if(!F.show2){const r=await askNotYet(TEXT.noAnswer,TEXT.turnOpts);if(r!==0){G.dir='down';await stepBack();return}F.show2='field'}
 await goTo('cane',20,28,'up')}
async function caneArrive(){const F=G.flags;
 if(F.show2==='field'&&!F.show2heard){F.show2heard=1;DAA.onAir(true);try{await play(TEXT.show2Field)}finally{DAA.onAir(false)}}
 if(F.cane2)return;F.cane2=1;
 await cut('cane2',()=>play(TEXT.cane2));
 if(F.deduce==='wrong'){await said(TEXT.caneUp);checkpoint();return}
 // Search's On guard (75) spots the roamers' beats; Survival's Pathfinder (75) shows a safe way up the field road
 const L=lead();
 if(skillVal(L.a,'Search')>=75&&!G.fs.used.onguard){G.fs.used.onguard=1;const o=SR.pct(chanceOf(L,'Search'));await say('',resultLine('ON GUARD · SEARCH',o),{auto:1000});
  if(o.ok){setTrail(G.M.roamers.flatMap(r=>r.path),'beat');await said(TEXT.caneOk)}else{tried(L,'Search');await said(TEXT.caneFail)}}
 else if(teamHas('Survival',75)&&!G.fs.used.pathc){G.fs.used.pathc=1;const S=live().filter(m=>skillVal(m.a,'Survival')>=75).sort((a,b)=>chanceOf(b,'Survival')-chanceOf(a,'Survival'))[0],o=SR.pct(chanceOf(S,'Survival'));
  await say('',resultLine('PATHFINDER · SURVIVAL',o),{auto:1000});if(o.ok){setTrail([[20,27],[20,24],[20,21],[20,18],[20,15],[20,12],[20,9],[20,6],[20,3],[20,1]],'path');await said(TEXT.canePath)}else{tried(S,'Survival');await said(TEXT.canePathFail)}}
 checkpoint()}
async function takeFinder(){if(G.fs.used['opt:ditch']&&holderOf('finder'))return;G.fs.used['opt:ditch']=1;await said(TEXT.finderDo);if(!holderOf('finder'))await pickup('finder');clue('trace',TEXT.cTrace);checkpoint()}
async function openBox(){await lanternBox('cane',['roadflare','firstaid','flashbang'],TEXT.boxLine);G.M=buildCane()}
// anything in the cane at night is unseen: a Loud fight still rolls Luck, with no penalty
async function caneCheck(){if(G.fs.lastLoud){G.fs.lastLoud=0;await overstepHere(null)}}

// ================= NIGHT 2 IN HALCOTT: THE CROWD AT MISS ODILE'S =================
async function talkMob(){const F=G.flags;if(F.porch)return;
 if(!F.mob1){F.mob1=1;await play(TEXT.mob1)}
 await hotspot({name:TEXT.mobName,look:()=>play(TEXT.mobLook),opts:[
  {use:'lean',once:'mobLean',ok:async()=>{F.porch='talked';await play(TEXT.mobLean);G.M=buildHalcott();checkpoint()},fail:async()=>{await said(TEXT.mobFail);await fightMob()}},
  {label:'Fight',run:fightMob}]},'mob')}
async function fightMob(){const F=G.flags;
 EN.tireiron.acts=EN.gascan.acts=EN.shotgun.acts=EN.filmer.acts={hit:runOrHit,film:runOrHit};
 const r=await battle(['tireiron','gascan','shotgun','filmer'],{story:true,intro:TEXT.mobIntro});if(r==='lose')return gameOver();
 F.porch='fought';await play(TEXT.mobDone);G.M=buildHalcott();checkpoint();
 // the teenager filmed it: a scene in a town street is public
 await overstepHere('public')}
// a frightened person runs at half HP (spec 020, Fights); the teenager films instead of fighting
async function runOrHit(e){if(e.flees&&e.hp<=e.mhp/2){e.gone=true;await bsay(fillT(BLS.BATTLEW.lines.eFlees,{e:e.name}),1000);return}
 if(e.t==='filmer'){await bsay('The teenager holds the phone up higher and keeps filming.',1000);return}
 const t=pickTarget(e);if(t)await foeHits(e,t,e.dmg)}

// ================= THE RADIAL FIELD AND THE BOSS =================
async function radialsArrive(){const F=G.flags;if(F.circle)return;F.circle=1;
 await cut('circle',async()=>{await play(TEXT.radials1);if(inCircle().includes('lucien'))await said(TEXT.radialsLucien)});
 await horror(HORRORS.circle);checkpoint()}
// the missing: take the radio away (no roll) and they wake, badly (Disturbing helplessness for the lead, once): woken,
// the circle can't take them
async function talkMissing(id){const F=G.flags;
 if(awake(id)){await said(TEXT.woken);return}
 await hotspot({name:id==='darlene'?'DARLENE':id==='wade'?'WADE':'MR. ARCENEAUX',look:()=>said(TEXT[id==='lucien'?'lucienStand':id]),opts:[{label:TEXT.wakeOpt,run:async()=>{F.woke=F.woke||{};F.woke[id]=1;await play(TEXT.wakeDo[id]);await horror(HORRORS.wake);G.M=buildRadials();checkpoint()}}]},'miss'+id)}
// The boss waits for you (Gameplay loop; play.md): Go in / Not yet, cursor on Not yet
async function bossAsk(){const F=G.flags;if(F.boss)return;
 const r=await askNotYet(TEXT.bossQ,TEXT.bossOpts);
 if(r===0)return bossFight();
 if(G.y===4)StudioMove.place(G,G.x,6,'down')}
// The Night Line (Bosses; Combat numbers; tuned Nov 23, 2026 with tools/boss-sim.js). 64 HP; −8 if the cart was burned,
// −8 if Emile's name was said on the air, −6 if a dead carrier is keyed (42 with all three, 34% off). 55% to hit; a cord
// lash (5), the callers at everyone (2; with the cart burned, a turn spent reaching for tapes that aren't there), dead
// air (1: one agent loses their next turn unless they pass POW × 5; the dead carrier makes the first one fail). Phase 2
// at half: +5% to hit, one more callers and one more lash, and it heals 10 unless the name was said. From round 7, with
// no dead carrier, the circle takes one person still listening. The guest mic makes Identify free.
const BOSS_HP={base:64,burn:8,name:8,carrier:6,heal:10,sinkAt:7};
async function bossFight(o={}){
 const F=G.flags;F.bossSeen=1;
 await cut('boss',async()=>{await play(TEXT.boss1);await said(named()?TEXT.bossSayN:TEXT.bossSay);if(F.burn)await said(TEXT.bossBurn);if(F.carrier)await said(TEXT.bossCarrier)});
 checkpoint();
 const E=EN.nightline,burn=!!F.burn,name=!!F.name,carrier=!!F.carrier;
 E.moves=[['hit',5],burn?['hiss',2]:['all',2],['deadair',1]];
 E.acts={hit:async e=>{await circleTick(e);const t=pickTarget(e);if(t)await foeHits(e,t,e.dmg)},
  all:async e=>{await circleTick(e);await bsay(e.allText,1100);for(const m of targetsOf(e,true))await foeHits(e,m,e.allDmg)},
  hiss:async e=>{await circleTick(e);await bsay(TEXT.bossHiss,1200)},
  deadair:async e=>{await circleTick(e);await deadAir(e)}};
 E.phase2={at:.5,hit:5,moves:burn?{hit:2}:{all:1,hit:1},line:TEXT.bossPhase,on:async e=>{if(name){await bsay(TEXT.bossNoHeal,1300);return}const h=Math.min(BOSS_HP.heal,e.mhp-e.hp);e.hp+=h;await bsay(fill(TEXT.bossHeal,{n:h}),1300)}};
 const cuts=(burn?BOSS_HP.burn:0)+(name?BOSS_HP.name:0)+(carrier?BOSS_HP.carrier:0),hp=BOSS_HP.base-cuts;
 const r=await battle(['nightline'],{boss:true,hp,intro:TEXT.bossIntro,onStart:async()=>{
  if(cuts)await say('',TEXT.bossThin,{auto:1500});
  if(has('ebooth')){G.fs.ident=G.fs.ident||[];if(!G.fs.ident.includes('en:nightline'))G.fs.ident.push('en:nightline');await say('',TEXT.bossIdent,{auto:1600})}}});
 if(r==='lose')return gameOver();
 if(o.noEnd)return;  // the simulator stops at the fight's end
 F.boss=1;await ending();
}
// dead air: the Named lead first, else anyone; POW × 5 shakes it off. A keyed dead carrier makes the first one fail.
async function deadAir(e){const F=G.flags;
 if(F.carrier&&!Bt.used.carrier){Bt.used.carrier=1;await bsay(TEXT.deadAirFail,1300);return}
 const ts=party.filter(m=>!m.ko&&!m.dead&&!m.gone&&!m.out),n=named(),t=ts.includes(n)?n:pick(ts);if(!t)return;
 const o=SR.pct(t.a.stats.POW*5);if(o.ok){await bsay(fillT(TEXT.deadAirHold,{t:t.name,'t@':t}),1100);return}
 t.skip=1;await bsay(fillT(TEXT.deadAir,{t:t.name,'t@':t}),1400)}
// the circle: from round 7, with no dead carrier, it takes one person still listening (once a fight)
async function circleTick(e){const F=G.flags;if(F.carrier||Bt.used.sink||Bt.round<BOSS_HP.sinkAt)return;
 const id=['lucien','wade','darlene'].find(x=>inCircle().includes(x)&&!awake(x));Bt.used.sink=1;if(!id)return;
 F.taken=id;const nm={darlene:'Darlene Achord',wade:'Wade Hebert',lucien:'Lucien Arceneaux'}[id];
 await bsay(fill(TEXT.sink,{n:nm}),1600);await horror(HORRORS.sink)}
window.daBoss=()=>bossFight({noEnd:true});  // the boss simulator's entry (tools/boss-sim.js)

// ================= OVERSTEPPING (Skills and menus, Overstepping and cover stories) =================
// An open case: the agents came with badges, and Dutch is the Local chief from the first scene. A climb plays its line,
// then the step's scene: Dutch takes the car keys and shuts his office (Local chief; Remy drives you, Credentials still
// gets you in), Big Hat's call (Agency call), and the clean-up crew at the next area change. The sheriff intel forgives
// the first climb once (spec 013).
async function overstepHere(seen){if(!(await overstep(seen)))return;
 if(intelOn('sheriff')&&!G.flags.forgiven){G.flags.forgiven=1;const s=loadSeason();if((s.overstep|0)>0){s.overstep--;store.set(seasonKey(),s)}await play(TEXT.forgive);checkpoint();return}
 await stepScene()}
async function stepScene(){
 const F=G.flags,s=stepName();
 if(s==='Local chief'&&!F.chief){F.chief=1;await play(TEXT.chief)}
 if(s==='Agency call'&&!F.call){F.call=1;await play(TEXT.call)}
 if(s==='Federal agents')F.fedsDue=1;
 checkpoint()}
async function onArea(){
 const F=G.flags;if(!F.fedsDue||F.fedsDone)return;F.fedsDone=1;
 await cut('feds',()=>play(TEXT.feds));const r=await battle(['fed','fed','fed'],{story:true,intro:TEXT.fedsIntro});if(r==='lose')return gameOver();
 await play(TEXT.fedsWin);F.shutDown=1;await ending({worst:true})}

// ================= ENDING =================
// clean: the Night Line ended, Emile's name said, nobody taken by the circle, Miss Odile's house standing, the town's
// fear under 3, no agent lost this case, overstepping below Agency call. costly: ended any other way. worst: the
// clean-up crew shut the case down.
const lostHere=()=>(store.get(B.key('memorial'),[])||[]).filter(x=>x&&x.case===G.case&&!x.done);
const savedN=()=>G.flags.shutDown?0:inCircle().filter(id=>G.flags.taken!==id).length;
function endingLabel(){const F=G.flags;if(F.shutDown)return'worst';
 return(F.name&&!F.taken&&F.porch!=='burned'&&fear()<3&&!lostHere().length&&!stepAt('Agency call'))?'clean':'costly'}
function endingFacts(label){const F=G.flags;
 return{label,clues:G.clues.map(c=>c.id),saved:savedN(),overstep:stepName(),
  san:party.map(m=>({id:m.a.id,name:m.name,from:m.san0,to:m.san})),
  items:party.flatMap(m=>gearOf(m).it.filter(it=>it.pin).map(it=>it.k)).concat((G.fs.pack||[]).filter(it=>it.pin).map(it=>it.k)),
  choices:{deduce:F.deduce||null,fry:F.fry||null,porch:F.porch||null,faith:F.faith||null,called:!!F.called,burn:!!F.burn,name:!!F.name,carrier:!!F.carrier,
   lucien:F.lucien||null,unplug:F.unplug||null,odile:F.porch!=='burned',odileHall:!!F.odileHall,taken:F.taken||null,shot:!!F.shot,fear:fear()},
  tried:party.map(m=>({id:m.a.id,skills:m.tried||[]})),
  lost:lostHere().map(x=>({name:x.name,how:x.how}))}}
const WHO={darlene:'Darlene Achord',wade:'Wade Hebert',lucien:'Lucien Arceneaux'};
async function ending(o={}){
 const F=G.flags;
 if(!o.worst){await play(TEXT.end1);if(F.taken)await trigger('death')}
 await fade(1);G.mode='scene';await fade(0);
 if(!o.worst){await said(TEXT.dawn);
  for(const id of inCircle())await said(F.taken===id?TEXT.dawnTaken:TEXT.dawnSaved,{n:WHO[id]});
  if(F.porch==='burned'||F.porch==='fought')await said(F.porch==='burned'?TEXT.dawnBurned:'Miss Odile\'s steps have a scorch mark on them now. She paints over it with porch paint the color of the old paint, almost.');
  await said(endingLabel()==='clean'?TEXT.dawnClean:TEXT.dawnCostly);
  // Emile's headphones, for Miss Odile: +1 to a Bond of each Protect the innocent holder
  const hp=holderOf('headphones');if(hp&&F.porch!=='burned'){await play(TEXT.headphones);spend(hp.m,hp.it);
   for(const m of holdersOf('Protect the innocent')){const a=m.a;if((a.bonds||[]).length){a.bondDmg=a.bondDmg||[];a.bondDmg[0]=(a.bondDmg[0]||0)-1}}}}
 G.rescued=savedN();
 const label=endingLabel();await debrief(label,endingFacts(label));  // Big Hat's debrief and the case gains (debrief.js)
}

// ================= THE DEBRIEF (spec 007) =================
// It plays on the bait shop's back porch, the briefing's place (registerCase place). The clues the card counts, the
// people in the circle, Big Hat's lines by ending and about the choices, the cover stories (2 with a skill, the weak Luck
// one, Clean books'), and the line after the cart (or, if it was burned, its page) is bagged.
const DB=TEXT.db;
const DEBRIEF_DATA={
 clues:['trace','voices','log','names','emile','cart','ebooth'],get victims(){return inCircle().length},
 lines:{clean:DB.clean,costly:DB.costly,worst:DB.worst},
 react:F=>{const c=F.choices||{},out=[];if(c.faith==='pray')out.push(DB.pray);if(c.odileHall||c.porch==='talked')out.push(DB.odile);if(c.lucien==='safe'&&c.taken!=='lucien')out.push(DB.lucien);
  if(c.deduce==='wrong')out.push(DB.wrong);if(c.called)out.push(DB.named);if(c.fry==='boiled'&&c.porch==='fought')out.push(DB.boiled);if(c.shot)out.push(DB.shot);
  return F.label==='worst'?out.slice(0,1):out.slice(0,2)},
 zip:[DB.zip],get end(){return(G.flags.burn?[TEXT.filedPage]:[]).concat([TEXT.boudin])},
 stories:[{name:DB.grid,skill:'Bureaucracy',verb:'paper it',pass:DB.gridPass,get mod(){return G.flags.grid?10:0}},
  {name:DB.pirate,skill:'Persuade',verb:'sell it',pass:DB.piratePass,get mod(){const f=G.db&&G.db.facts;return f&&(f.clues||[]).includes('log')?20:0}}],
 weak:{name:DB.weak,pass:DB.weakPass},
 safe:{name:DB.safe,pass:DB.safePass},
 bagged:{cart79:[TEXT.filed]}
};

// ================= OPENING (Big Hat's briefing on the bait shop's back porch) =================
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
 },{place:window.DAA.porch});  // the bait shop's back porch (the debrief uses the same place, registerCase place)
 G.flags.ph=0;G.mode='world';goMap('halcott',23,7,'down');checkpoint();await fade(0);
 await cut('arrive',async()=>{
  for(const m of squad())await say(m.name.toUpperCase()+' · '+profOf(m.a).name.toUpperCase(),TEXT.role[profOf(m.a).role]||TEXT.roleAny);
  await said(TEXT.arrive)});
}
// the Case file's Next line
const caseNext=()=>{const N=TEXT.next,F=G.flags,p=ph(),n=gateClues();
 if(F.boss)return N.home;
 if(p===0)return F.checkin?N.day1.replace('{n}',n):N.dutch;
 if(p===1)return F.heard?N.night1b:N.night1;
 if(p===2){if(n<3)return N.day2.replace('{n}',n);if(!F.fry)return N.fry;if(!F.deduce)return N.deduce;return N.rest2}
 return F.n2arrive?N.night2b:N.night2};
// the Named lead: −10 Stealth on day 2 and night 2 (field.js asks the case through registerCase rollMod)
const rollMod=(m,skill)=>skill==='Stealth'&&ph()>=2&&G.flags.named&&m.a.id===G.flags.named?-10:0;

// ================= ON THE CASE BOARD =================
// portraits: the townsfolk's faces and the radio for the voices off screen (dead-air-art.js), and the boss's
// (dead-air-battle-art.js). sprite/spriteSize: battle sprites (the clean-up agent is Still Harvest's SHB).
const spr=k=>k==='listener2'?'listener':k;
registerCase({id:'dead-air',card:caseCard,opening:caseOpening,intel:TEXT.intel,maps:MAPS,tiles:{},
 portraits:name=>window.DAA.portraits[name]||(name==='THE NIGHT LINE'&&window.DAB?window.DAB.portrait:null),
 enemies:EN,sprite:(k,f,w)=>k==='fed'&&window.SHB?SHB.sprite('fed',f,w):window.DAB?DAB.sprite(spr(k),f,w):null,spriteSize:k=>k==='fed'&&window.SHB?SHB.size('fed'):window.DAB?DAB.size(spr(k)):[24,24],
 backdrop:(p,o)=>window.DAB?DAB.backdrop(p,o):null,
 get place(){return window.DAA&&window.DAA.porch},  // Big Hat's place for this case: the briefing passes it, and the debrief plays there too (engine.js casePlace)
 items:CASE_ITEMS,next:caseNext,quiet:false,loot:LOOT,onArea,rollMod,
 debrief:DEBRIEF_DATA,label:endingLabel,facts:endingFacts});
})();
