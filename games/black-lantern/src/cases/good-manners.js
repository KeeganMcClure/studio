// Black Lantern · cases/good-manners.js
// CASE: Good Manners (FILE 02), Odessa Flats, Kansas, during the county fair's last week (spec 010).
// Part A (Nov 23, 2026): the card, every map in its day and night versions, the townsfolk and the two men on the map
// and in the dialog box, Big Hat's own briefing place, and walkable maps with every door and drive going where it should.
// Part B (Nov 23, 2026): the story and play, written from the secret case file: the text block, the briefing's four
// topics, skill-driven clues, a deduction, choices that rejoin, overstepping, two story fights, the fairground's roamers,
// a Lantern Box, the soft clock, the boss and its tuning, the debrief's facts and cover stories, and the endings.
// Art is cases/good-manners-art.js (window.GMA, the maps and people) and cases/good-manners-battle-art.js (window.GMB,
// the enemies, the boss's face and the battle backdrops), loaded right after this file. Needs engine.js, field.js and
// battle.js first. The whole file sits in one function so its names never meet Still Harvest's.
(function(){

// ================= TEXT =================
// Every line of the case (Voice). A list plays box by box: a plain string is narration, ['WHO', 'line'] is someone
// talking. {code} and {first} are the lead's, with pronoun tokens like {first.they} (Agent creator, Pronouns and body);
// {n}, {t} and the other one-letter keys are filled by the script.
const TEXT={
 next:{toft:'Check in with Sheriff Toft. Her office is on Main Street.',car:'Start with the black car parked on Elm and Third.',
  day1:'Day 1. Ask around Odessa Flats: {n}/3 town clues. Rest at the motel, room 6, when you\'re ready for dark.',
  night1:'Night 1. The men stand on Elm at night, and somebody\'s up at the co-op. Rest at the motel to move on.',
  day2:'Day 2. Find {n}/3 town clues. The fair\'s open: take the car.',deduce:'Take what you\'ve found to Sheriff Toft.',
  rest2:'Rest at the motel until the fair\'s last night.',
  night2:'Night 2. The fair\'s last night. Find Tanner, then go under the grandstand.',night2b:'Night 2. Go under the grandstand. They\'re waiting.',home:'Get home.'},
 phase:['DAY 1 · AFTERNOON','NIGHT 1','DAY 2','NIGHT 2 · THE FAIR\'S LAST NIGHT'],
 rewritten:'This case file was rewritten while you were away. Your team starts it over from the briefing, with everything they carry.',
 // ---- the briefing ----
 open1:'THURSDAY · 7:48 PM',
 open2:'A text from an unlisted number: "TRUCK STOP. EXIT 206. BEHIND IT. THE COMBINE."',
 brief:['The cab of a parked combine behind a truck stop off I-70. The fair\'s lights sit on the far edge of the wheat.',['BIG HAT','Agent {code}. Get in.'],'There is one seat. He\'s in it. You get the step.',
  ['BIG HAT','Odessa Flats, Kansas. Nine hundred people and one stoplight, and the stoplight just blinks.'],
  ['BIG HAT','Two men in black suits been standin\' across the street from folks\' houses. Hours at a time. Just lookin\'.'],
  ['BIG HAT','Three of the people they looked at died in their sleep this month. Nothin\' wrong with any of \'em.'],
  ['BIG HAT','Fella at the gas station says they talk like they learned English off the back of a cereal box. Polite as church.']],
 briefShout:'NOBODY IS THAT POLITE IN KANSAS.',
 brief2:['He takes a cruller out of a truck-stop sack. Looks at it a while. Puts it back.'],
 // Big Hat's two questions (spec 013): the four topics, his two-box answer, the Case file's INTEL line. The edges are in
 // the scripts: intelOn('town') +10 Persuade with Toft and her deputy, 'men' puts the black car on the Next line,
 // 'dead' +10 Forensics at the morgue, 'fair' marks the Lantern Box on the fairground on night 2.
 intel:[
  {id:'town',label:'The town',answer:['Odessa Flats. Nine hundred people and a sheriff named Toft who\'ll smell you comin\'.','Don\'t lie to her. She\'s been lied to by better.'],
   note:'Sheriff Toft runs Odessa Flats and knows you\'re coming. Be straight with her.'},
  {id:'men',label:'The two men',answer:['Nobody\'s got a picture. Every photo of \'em came back blurry, and every one blurred the same way.','They drive a black car. Start there. Cars got paperwork.'],
   note:'No clear photo of the two men exists. They drive a black car: start there.'},
  {id:'dead',label:'The dead',answer:['Coroner\'s in Plainview, two towns over. Abernathy.','She called it natural three times and didn\'t believe it once.'],
   note:'Dr. Abernathy, the coroner in Plainview, called all three natural and doesn\'t believe it.'},
  {id:'fair',label:'The fair',answer:['Last week of the county fair. Everybody in that town\'ll be in one place on Saturday night.','So will they. I put a box in the hayloft of the livestock barn. Don\'t make me regret it.'],
   note:'The whole town goes to the fair\'s last night. Big Hat left a Lantern Box in the barn\'s hayloft.'}],
 brief3:[['BIG HAT','You go in with badges. Check in with the sheriff first thing. She\'ll be expectin\' you, and she won\'t like it.'],
  ['BIG HAT','Find out who those two are and what they want. Before somebody else don\'t wake up.']],
 brief4:[['BIG HAT','And {first}? That fair\'s got a funnel cake stand. Bring me one. Powdered sugar. Not the cinnamon.'],'Out the windshield, the Ferris wheel turns, small as a watch face.'],
 arrive:'GOOD MANNERS. Talk to people with A. Press START for your notebook and party.',
 role:{Investigator:'Two guys in suits. Could be Mormons.',Healer:'Three people dead in their sleep. I want those charts.',Analyst:'For the record, heat stroke kills plenty of people in August.',Vanguard:'If they want to stare, they can stare at me.',
  Lorekeeper:'Men who don\'t blink. I\'ve read about men who don\'t blink.',Tech:'One bar. Out here that\'s a miracle.',Bruiser:'Polite, huh? We\'ll see how polite.',Support:'It\'s ninety-six degrees. Everybody drink some water.',
  Tracker:'Wheat as far as you can see. Nowhere to hide out here. That goes both ways.',Confessor:'Three funerals in one month in a town this size. Somebody ought to sit with them.',Courier:'I deliver out here. Nobody locks their doors.',
  Undertaker:'Died smiling, all three. I\'d like to see that work.',Scrapper:'Smells like a feed store. My kind of town.',Morale:'They got a funnel cake stand. I\'m just saying.'},
 roleAny:'Let\'s get this over with.',
 // ---- Sheriff Toft (the Local chief, from the first scene) ----
 toft1:[['SHERIFF TOFT','Marlene Toft. Sheriff. You\'d be the federal people.'],['SHERIFF TOFT','I called it in, if you\'re wondering. Three deaths in a month and two strangers on my sidewalks. I called everybody.'],
  ['SHERIFF TOFT','I can\'t arrest a man for standing on a sidewalk in a suit. Believe me, I looked it up.'],['SHERIFF TOFT','Whatever you\'re here for, you do it where I can see you. You kick in a door, I hear about it before your foot\'s back on the ground.']],
 toft0:[['SHERIFF TOFT','Bring me something I can take to a judge. Or to a priest. I\'m not picky anymore. ({n}/3)']],
 toft3:[['SHERIFF TOFT','All right. That\'s three things that aren\'t heat stroke.'],['SHERIFF TOFT','Sit down. Cal, get the door.']],
 toftAsk:'So what are they?',
 toftOpts:['Federal. Somebody else\'s program.','They\'re learning people. The Peck boy\'s next.','Arlen Voss is killing them.'],
 toftRight:[['SHERIFF TOFT','Learning.'],['SHERIFF TOFT','Tanner Peck told my deputy they asked him how he laughs. Cal thought it was cute.'],['SHERIFF TOFT','Cal. You\'re sitting on the Peck house tonight. And tomorrow night. Take a thermos.']],
 toftNoProof:[['SHERIFF TOFT','Learning people. Like a hobby.'],['SHERIFF TOFT','You show me how a man learns somebody to death and I\'ll post a deputy anywhere you want.']],
 toftVoss:[['SHERIFF TOFT','Arlen. Fair board Arlen. Bought-the-school-new-bleachers Arlen.'],['SHERIFF TOFT','...His name\'s on that roll, typed by his own hand. All right. I\'ll go ask him.'],'She doesn\'t come back for an hour. When she does, she doesn\'t say what he said.'],
 toftNoVoss:[['SHERIFF TOFT','Arlen Voss buys the town\'s Christmas ham.'],['SHERIFF TOFT','You come back with paper, I\'ll hear it.']],
 toftWrong:[['SHERIFF TOFT','Somebody else\'s program.'],['SHERIFF TOFT','Then you can go ask somebody else for help. I\'ve got a fair to get through.'],'She doesn\'t say another word to you all afternoon. It costs you the afternoon.'],
 toftAfter:[['SHERIFF TOFT','Fair\'s last night is tomorrow. Whole town under the grandstand lights. Get some sleep.']],
 toftAfter2:[['SHERIFF TOFT','Go get some sleep at the motel. Room 6 has the good air unit.']],
 toftNight:[['SHERIFF TOFT','I\'ll be at the fair. If it goes bad, it goes bad in front of nine hundred people. Try not to let it.']],
 recon:'Reconstruct · tie it together',
 reconOk:'The calluses traced on the dead men\'s hands. The signature written three hundred times. Somebody learned them by hand, the way you learn your letters.',
 hunch:'Three dead, all watched first. What does somebody want from watching a person for hours?',
 // ---- Deputy Cal Brandt (liar: he says he saw nothing) ----
 cal1:[['DEPUTY BRANDT','Deputy Cal Brandt. Ma\'am. Sir. Whoever.'],['DEPUTY BRANDT','I didn\'t see anything. Just so you know. Before you ask.']],
 calLook:[['DEPUTY BRANDT','I didn\'t see anything.'],'He says it to the floor.'],
 calRead:[['DEPUTY BRANDT','Okay. Okay.'],['DEPUTY BRANDT','Tuesday, I went up to the tall one to ask for ID. Real polite. He took his sunglasses off to read it.'],
  ['DEPUTY BRANDT','There wasn\'t anything there. Not eyes. Just more face.'],['DEPUTY BRANDT','He said thank you. He gave the ID back. I went home and slept in the bathtub.']],
 calCash:'Cal looks at the money like it might go off. Then he tells you anyway, and won\'t take it.',
 calAfter:[['DEPUTY BRANDT','I have a thermos. The sheriff told me to have a thermos.']],
 cabinet:'FILE CABINET',
 cabLook:'A file cabinet. The top drawer is labeled DEATHS · 2026. The second drawer is labeled MISC. The second drawer is fuller.',
 cabChief:'Toft stands by the cabinet with her coffee. She doesn\'t say no. She doesn\'t move, either.',
 cabFind:['In MISC, behind the fair permits, a typed list the co-op sent the county in April: "ODESSA FLATS COMMUNITY ROLL. COMPILED BY A. VOSS."',
  'Nine hundred names, all of them, typed. Three crossed out in the same soft pencil: GRISSOM. MEEKS. OSTROW.','The pencil line is neat. Like somebody used a ruler.'],
 cRoll:'Arlen Voss typed a roll of all 900 people in Odessa Flats in April. The three dead are crossed off it in pencil.',
 desk:'The sheriff\'s desk. Files in two stacks: done and not done. The not-done stack is taller and has a donut on it.',
 cell:'An empty holding cell. The cot is made with hospital corners. Somebody here is very bored.',
 // ---- Rhonda at the Wheat Kernel Diner ----
 rhonda1:[['RHONDA','Sit anywhere, hon. Coffee\'s coming whether you want it or not.'],['RHONDA','You\'re the feds. Everybody knows. Marlene knew before you hit the county line.']],
 rhondaM:[['RHONDA','Those two? They come in every morning at six. Two coffees, black.'],['RHONDA','They don\'t drink them. They sit there and watch \'em go cold. Like that\'s the part they came for.'],['RHONDA','Then they leave a tip. Exact change. Fifteen percent, to the penny. Nobody in this town tips fifteen percent.']],
 rhondaGive:['RHONDA','Here. Take a to-go. On the house. You look like you\'re gonna be up late.'],
 rhondaRead:['She\'s smiling. Her hand on the coffee pot is not.',['RHONDA','I watch Tanner Peck Tuesdays. Jolene works doubles.'],['RHONDA','Last Tuesday he sat in that booth for an hour practicing his laugh. Out loud. Like a fire drill.'],['RHONDA','I gave him pie so he\'d stop. He laughed at the pie.']],
 rhondaAfter:[['RHONDA','Refill? Too late, I already did it.']],
 counter:'The diner counter. Pie under a dome. A sign: PIE OF THE DAY: YES.',
 booth:'BOOTH',boothLook:'Two cups of coffee on the table, full, with a skin on them. Nobody has cleared them. Nobody wants to.',
 boothExam:['No lip marks. No prints on the handles. The spoons are lined up exactly parallel.','The sugar packets have been sorted by color.'],
 // ---- Orvel at the gas station ----
 orvel1:[['ORVEL','Pump\'s cash only. Doris don\'t take cards.'],'The chicken on his shoulder looks at you like it agrees.',
  ['ORVEL','That black car\'s been parked on Elm a month. I sit here all day. You know how many times it\'s bought gas?'],['ORVEL','None. Not once. I\'ve been in the business forty years. A car\'s got to eat.']],
 orvelGive:['ORVEL','Here. Somebody left these. I quit in \'91. Doris don\'t like the smell.'],
 orvelAfter:[['ORVEL','Doris says hello.'],'Doris does not say hello.'],
 gas:'GAS STATION',gasLook:'The station\'s door is propped open with a brick. Bait, scratchers and a hot dog that\'s been turning since the primary.',
 gasSweep:'Behind the counter, in a milk crate, a box of road flares with a sticky note: FOR WRECKS. You count this as a wreck.',gasNone:'Fishing line, a dead cricket, and a lot of receipts.',
 // ---- the co-op and its night men ----
 coop:'CO-OP',coopDay:'The co-op office. The blinds are down. A sign: CLOSED FOR THE FAIR. A. VOSS, PRES.',coopNight:'The co-op office. A desk lamp\'s on in there, and nobody\'s at the desk.',
 coopCrack:['The co-op\'s wifi is named VOSS GUEST. The password is on a sticky note in the window: ODESSA900.','The shared drive has one folder that isn\'t grain prices. COMMUNITY ROLL.'],
 coopForce:'The door gives. Heads turn on Main Street. Orvel puts down his paper.',
 coopSweep:['Voss\'s desk is very tidy. In the top drawer, under the fair board minutes, a typed roll of every name in town.'],
 coopFind:['ODESSA FLATS COMMUNITY ROLL. COMPILED BY A. VOSS, APRIL. Nine hundred names.','Three crossed off in soft pencil: GRISSOM. MEEKS. OSTROW. A fourth has a pencil dot beside it, like a place held: PECK, TANNER.'],
 nm1:[['NIGHT MAN','Co-op\'s closed, friend.'],['NIGHT MAN','Mr. Voss said nobody goes in. Specially no feds.'],'The other one taps a tire iron against his boot. Not hard. Just so you hear it.'],
 nmName:'TWO MEN BY THE DOOR',nmLook:'Two co-op fellas in feed caps, a flashlight and a tire iron between them. They\'ve been told to stand here and they are standing here.',
 nmWalk:'Walk past them',nmCash:'Pay them more than Voss does',
 nmLean:[['NIGHT MAN','...Okay. Okay. It ain\'t worth it.'],['NIGHT MAN','Mr. Voss pays us fifty a night to stand here. He didn\'t say for what. We didn\'t ask.'],'They go and sit in their truck with the radio on.'],
 nmCashed:[['NIGHT MAN','For a hundred, we never saw you.'],['NIGHT MAN','Mr. Voss is real nervous. Been nervous since April. Whole town\'s nervous since April.']],
 nmIntro:'The night men come at you!',
 nmDone:['One of them sits down in the gravel and says a word his mother wouldn\'t like.',['NIGHT MAN','Mr. Voss said keep the feds off the elevator. Fifty a night. That\'s all I know, I swear to God.']],
 // ---- the motel ----
 office:'MOTEL OFFICE',officeLook:'The motel office. A bell on the counter and nobody behind it. A sign: GONE TO FAIR. RING FOR BEV.',bell:'Ring for Bev',
 bev:[['BEV','I\'m at the FAIR. I said on the SIGN.'],'The voice comes from a speaker over the door. You never do see Bev.'],
 room7:'ROOM 7',room7Look:'Room 7. The DO NOT DISTURB tag hangs perfectly straight. Somebody adjusted it.',
 r7Paper:'Check the register',r7Sneak:'Slip in behind the maid\'s cart',r7Creds:'Get Bev to open it',r7Cash:'Leave Bev a tip',
 r7PaperDo:['The register at the office. Room 7: MR. DOE, MR. ROE. PAID CASH, ONE MONTH, IN ADVANCE.','Down the margin, in pencil, somebody has practiced their signature. Then someone else\'s. Then someone else\'s.','The register\'s spare key is on its hook. Nobody stops you.'],
 r7SneakDo:'The maid\'s cart squeaks past. You squeak in behind it.',r7CredsDo:[['BEV','Federal? Fine. FINE. Key\'s under the mat. It\'s always under the mat.']],r7CashDo:'You leave twenty dollars on the counter. When you look back, the key is there instead.',
 r7Force:'The door bangs in. The whole motel lot hears it. A kid in the pool stops splashing.',r7Shoot:'The lock comes apart. Every dog in Odessa Flats starts up at once.',
 r7In:['Two beds. Neither slept in. The bedspreads are tight enough to bounce a quarter.','No suitcases. No toothbrushes. Two pairs of black shoes, side by side, facing the wall.',
  'On the desk, one loose page torn from a school copybook. A signature, written over and over, three hundred times, small and neat.','HAL GRISSOM. HAL GRISSOM. HAL GRISSOM. The first ones are shaky. The last fifty you couldn\'t tell from his checkbook.'],
 r7H:'Hal Grissom\'s name, three hundred times',
 cRoom7:'Room 7: nobody sleeps there. A copybook page of Hal Grissom\'s signature, practiced 300 times until it was perfect.',
 r7After:'Room 7. Two beds made tight. Two pairs of shoes facing the wall.',
 // ---- the motel bed and the day (Turning the day: Go on / Not yet, cursor on Not yet) ----
 bed:'BED',bedLook:'The bed. Clean, flat, smells like the dryer.',
 bedOpt:['Rest until dark','Sleep until morning','Rest until the fair\'s last night'],
 turnQ:['Rest until night 1?','Sleep until day 2?','Rest until night 2?'],
 turnClose:['The morgue and the diner close for the night, and the Pecks go in.','Tonight\'s stakeout and the co-op\'s night men are tonight only.','The county morgue closes for good, and so does the fair by day.'],
 turnOpts:['Go on','Not yet'],
 turnToft:'Check in with Sheriff Toft first. You told Big Hat you would.',
 turnClues:'Not yet. Toft needs to hear what you\'ve got first ({n}/3 town clues).',turnDeduce:'Take what you\'ve found to Toft before the fair\'s last night.',
 rested:[['You sleep a few hours. The air unit rattles the whole time, like somebody tapping to be let in.'],['You sleep. You dream about a classroom. Everybody\'s sitting very straight.'],['You sleep through the afternoon. When you wake up, the Ferris wheel\'s lit over the wheat.']],
 restDone:'Last night of the fair. No resting now.',
 stake:'Stake out room 7 (it costs the night)',
 stakeDo:['You turn the lights off in room 6 and watch room 7\'s door through the curtain. 11 PM. Midnight. One.','At 3:10 a black car pulls in with its headlights off. They get out at the same time. They go in without turning on a light.',
  'Through the wall, nothing. No TV. No toilet. No talking.','At 4:30 you crack their door with Bev\'s key. They\'re standing in the dark, side by side, facing the wall. Asleep, maybe. Standing up.','On the dresser behind them, squared to the edge, a school copybook.'],
 stakeTake:'Lift the copybook',
 stakeGot:'You take it in two fingers. Neither of them moves. On your way out the door, both their heads turn, very slowly, to the wall you\'re behind.',
 stakeMiss:['Your shoe squeaks.',['MR. DOE','Good morning.'],['MR. ROE','...morning.'],'They don\'t turn around. You leave. You don\'t remember shutting the door.'],
 stakeNone:'You leave it. Some things you don\'t touch in the dark.',
 // ---- the county seat (a long drive: costs time) ----
 countyOpt:'Drive to the county seat for records (costs time)',
 countyGo:['An hour of wheat to the county seat. The records office has a window unit and a woman named Pat.'],
 countyRec:['Pat finds it in a box marked 2026 MISC: a typed roll the Odessa Flats co-op filed in April. Every name in town.','Three crossed off in pencil. GRISSOM. MEEKS. OSTROW. COMPILED BY A. VOSS.'],
 countyFail:'Pat finds you a lot of tax maps. You drive back with a sunburn on one arm.',
 countyBack:'Back to Odessa Flats. The afternoon\'s gone.',
 // ---- Elm and Third ----
 heads:['The two men stand on the curb across from the Peck house. Black suits. Dark glasses. Ninety-six degrees.','You step onto the sidewalk.','Both of them turn their heads to look at you. At the same time. Exactly the same speed.'],
 headsH:'The two men turning at once',
 menName:'MR. DOE · MR. ROE',
 menLook:[['MR. DOE','Good afternoon. It is a fine day for the time of year.'],['MR. ROE','...time of year.']],
 menNight:[['MR. DOE','Good evening. It is a fine night for the time of year.'],['MR. ROE','...time of year.']],
 menAsk:'Ask them, politely, what they want',menRude:'Tell them to get lost',menGun:'Pull your gun on them',
 menAnswer:[['MR. DOE','Thank you for asking. We are here to learn.'],['MR. DOE','We have nearly finished our lessons. Then we will stay.'],['MR. ROE','...stay.'],['MR. DOE','Odessa Flats will keep its nine hundred. That was the arrangement.']],
 menRudeDo:[['MR. DOE','One moment.'],'Mr. Roe takes a school copybook from inside his jacket and turns the pages with one finger. Mr. Doe reads over his shoulder.',['MR. DOE','The correct reply is: we are not lost. Thank you for your concern.']],
 menGunDo:['You draw. A woman watering her lawn three houses down stops watering her lawn.',['MR. DOE','That is not polite.'],['MR. ROE','...not polite.'],'They wait, perfectly still, until you put it away. Then they go back to looking at the Peck house.'],
 peck:'The Peck house. Every curtain shut, in the middle of the afternoon.',peckNight:'The Peck house. One light on upstairs. A small shape sits up in the window, very straight, facing the street.',
 grissom:'GRISSOM PORCH',grissomLook:'Hal Grissom\'s porch. A harmonica on the rail where he left it. The neighbors haven\'t moved it. Nobody wants to be the one.',
 harpTake:'Take the harmonica',harpDo:'A Hohner-shaped harmonica, key of C, worn silver at the mouth end. It still smells like his pipe.',
 mailbox:'A roadside mailbox. The flag\'s down.',
 // ---- the black car ----
 car:'BLACK CAR',carLook:'A black sedan, tinted all the way around. No dust on it. Every other car in Kansas has dust on it.',
 carHood:'Pop the hood',carTrunk:'Pop the trunk',carPlates:'Run the plates',carPhoto:'Photograph it',
 carExam:['You put your hand on the hood at noon. It\'s cool. Not shade-cool: refrigerator cool.','No VIN plate on the dash. Just two clean screw holes where one was.'],
 carCrack:['The plates come back to a 1962 sedan, black, registered to a dealership in Topeka.','The car was crushed for scrap in 1971. The paperwork has a photo. It\'s this car.'],
 carHoodDo:['The hood comes up easy. Under it there\'s no engine.','Just clean, dark, empty space, like the inside of a new shoe box.'],
 carSweep:['Glovebox: a road map of Kansas folded perfectly, and a 1962 owner\'s manual with every page bookmarked.','Under the seat: nothing. Not a penny. Not a crumb. Not one hair.'],
 carTrunkDo:['The trunk pops. Somebody on a porch says "hey." It\'s empty, and lined with school copybook paper, the kind with the red margin.','Every sheet has the same word written on it over and over: GOODAFTERNOON.'],
 cCar:'The black car has no engine heat, no VIN, and plates from a 1962 car crushed in 1971. They aren\'t federal. They aren\'t ordinary.',
 carPhotoDo:'The flash goes off. In the photo the car is sharp, and the men beside it are a smear, the same smear in every frame.',
 // ---- the Pecks ----
 jolene1:[['JOLENE','If you\'re here about the men, you\'re late.'],['JOLENE','Three nights they\'ve stood there. I called Marlene. I called the paper. I called my ex, which tells you how scared I am.']],
 joleneLie:[['JOLENE','Tanner\'s fine. He\'s sleeping fine.'],'She says it fast, like she practiced it on the porch.'],
 joleneTruth:[['JOLENE','...He\'s not fine.'],['JOLENE','He talks in his sleep. Not his voice. Real polite. Like a man reading a menu.'],['JOLENE','Last night he said "thank you for your patience." Nine years old. He doesn\'t say thank you for his birthday.']],
 cWatch:'The men watch the Peck house now. They asked Tanner Peck how he laughs, and he\'s been practicing for them.',
 joleneAfter:[['JOLENE','I\'m not letting him out of my sight. I\'m not letting him sleep, either, if that\'s what it takes.']],
 joleneFair:[['JOLENE','Tanner wanted to see the goats. Tanner always wants to see the goats.']],
 joleneNight:[['JOLENE','He\'s gone. I turned around to pay for a lemonade.'],['JOLENE','He said he had to go show them his laugh. He said they were waiting.'],'She points at the Ferris wheel without looking at it.'],
 joleneKept:[['JOLENE','He\'s not sleeping till Christmas. I bought every Mountain Dew in the county.'],['JOLENE','Thank you. I mean it. Go. Go do whatever you\'re doing.']],
 joleneLost:[['JOLENE','He\'s asleep in the truck. I tried. He just went.'],'She\'s holding his hat.'],
 tanner1:[['TANNER','Do you want to hear my laugh? I\'ve been practicing.'],['TANNER','The men asked me how I laugh. Real nice. They wrote it down.'],['TANNER','I\'m gonna do it for them Saturday. They said I\'m nearly perfect.'],'He laughs. It\'s a great laugh. It\'s a nine-year-old\'s laugh, and he does it exactly the same way twice.'],
 tannerAfter:[['TANNER','Ha ha ha. That was a practice one.']],
 // ---- the morgue ----
 morgue1:['A clinic basement in Plainview. The air conditioning is the best in the county. It would have to be.'],
 doc1:[['DR. ABERNATHY','Ines Abernathy. County coroner. Don\'t touch the drawers.'],['DR. ABERNATHY','Three of them. Natural, I wrote. Three times. Hearts like twenty-year-olds. No drugs. No gas. Nothing.']],
 docChief:[['DR. ABERNATHY','Marlene called. I\'m not supposed to show you anything today.'],'She looks at the drawers. She looks at you.'],
 docTalk:[['DR. ABERNATHY','Fine. Off the record, and I\'m not a record person.'],['DR. ABERNATHY','They died with their eyes open. All three. Smiling. Not a grin. Polite. Like somebody said "you may go."'],
  ['DR. ABERNATHY','And their right hands. Look at the right hands. That\'s not arthritis.']],
 docAfter:[['DR. ABERNATHY','I\'ve been doing this nineteen years. Bodies tell you things. These ones are being polite about it.']],
 drawers:'DRAWERS',drawersLook:'Three drawers with three cards: GRISSOM, MEEKS, OSTROW.',
 drawersOpen:['She rolls out the drawers one at a time. Hal Grissom, 72. Darla Meeks, 41. Gene Ostrow, 58.','All three smiling. Small, tidy smiles. Eyes open. Like they\'re waiting to be called on.'],
 smilesH:'Three small, polite smiles',
 drawersExam:['Each right hand has the same faint shiny marks: the calluses a kid gets from holding a pencil too hard.','Hal Grissom was a farmer for fifty years. Gene Ostrow typed his sermons. Somebody traced these on, after.'],
 drawersSweep:['Their effects, bagged. Hal\'s pipe. Darla\'s red reading glasses. The pastor\'s collar and a list of sermon titles.','At the bottom of each bag, a gold star sticker. The kind a teacher gives out. Nobody at the funeral home remembers putting them there.'],
 cDead:'The three dead died smiling, eyes open, of nothing. Each had pencil calluses traced on the right hand and a gold star in their effects.',
 slab:'A steel table under a sheet. Empty, for now. Abernathy keeps looking at it.',
 // ---- Arlen Voss (liar: everything) ----
 voss1:[['ARLEN VOSS','Arlen Voss. Co-op, fair board, whatever needs doin\'.'],'His grin is a little too wide, and it doesn\'t go away when he stops talking.',['ARLEN VOSS','You come out Saturday night. Whole town\'ll be there. Every last one.']],
 vossLie:[['ARLEN VOSS','Those fellas? Government, I figured. Like you. Nice manners, anyhow. Can\'t say that about everybody.']],
 vossName:'ARLEN VOSS',
 vossNameIt:'Name what he signed',vossTape:'Play him Tanner\'s laugh',
 vossDeal:[['ARLEN VOSS','...April. At Patty\'s grave.'],['ARLEN VOSS','A tall fella, real kind. Had a book. Asked me what I wanted most in the world, and I said Odessa Flats keeps its nine hundred.'],
  ['ARLEN VOSS','Co-op\'s closing. School\'s down to one room. Every kid we raise drives off to Wichita. I signed. I thought he meant jobs.'],
  ['ARLEN VOSS','Then those two showed up in a car nobody saw drive in, and Hal Grissom stopped waking up.'],'The grin is still there. It\'s been there since April. He can\'t make it stop.'],
 cDeal:'Arlen Voss signed for Odessa Flats to "keep its nine hundred." The men came after. They\'re keeping it by becoming the people.',
 vossTapeDo:['You play him Tanner\'s laugh off the recorder.','Voss\'s grin stays where it is. The rest of his face falls in around it.'],
 vossAfter:[['ARLEN VOSS','I\'ll be at the grandstand Saturday. I\'m the one that has to give the welcome.']],
 vossChief:'Voss smiles at you and says nothing at all. Toft\'s been to see him.',
 // ---- the fair by day ----
 dusty1:[['DUSTY','Spinner\'s two tickets. Bird\'s free.'],'The parakeet on his shoulder says something that might be "tickets".',['DUSTY','Don\'t ride it after close, though. It rides itself after close.'],
  ['DUSTY','Swear to God. Two in the morning, all lit up, going round with nobody on it. Bird won\'t sleep in the trailer no more. Neither will I.']],
 dustyTea:[['DUSTY','Fair tea? Who told you about fair tea?'],['DUSTY','...Ten bucks. Steep it, don\'t chew it. And don\'t go lookin\' at the sky too long.']],
 dustyTeaOpt:'Ask about the fair tea',dustyCash:'Buy the fair tea',
 dustyAfter:[['DUSTY','Bird says hi.'],'The bird says nothing. It\'s watching the grandstand.'],
 dustyNight:[['DUSTY','I\'m shutting her down at ten tonight. I don\'t care what the board says.'],'Behind him the spinner turns. Nobody\'s on it. He doesn\'t turn around to look.'],
 fairgoer:'A fairgoer with a corn dog in each hand. Neither one bitten.',
 fairgoer2:'Two kids arguing about the spinner. Nobody\'s going on it.',
 fairgoer3:'A man in a seed cap, asleep in a lawn chair with his eyes open. No. Closed. Just squinting.',
 tack:'TACK BOX',tackLook:'A dented tack box by the barn door. Somebody\'s initials scratched in the lid.',tackOpt:'Open it',
 tackFind:'Under the brushes, a baggie of dried mushrooms. "FAIR TEA" on a strip of tape. Dusty\'s handwriting, probably.',
 wheel:'FERRIS WHEEL',wheelDay:'The Ferris wheel. The cars rock a little in the wind. A sign: YOU MUST BE THIS TALL. The arrow is set very low.',
 spinner:'The spinner, painted with stars. It\'s turning. Nobody\'s on it.',
 booths:'A ring toss. Every bottle has the same goldfish in it, somehow.',
 barn:'The livestock barn. Somebody\'s goat is yelling about something.',
 hay:'HAYLOFT',hayDay:'A ladder up to the hayloft. A 4-H kid is asleep up there on a hay bale with a ribbon pinned to his shirt.',hayNight:'The ladder to the hayloft. Up top, something wrapped in a feed sack, with a gas-station bow on it.',hayOpen:'Climb up and open it',
 hayBox:'Inside the feed sack, under a 4-H ribbon that says GRAND CHAMPION in Big Hat\'s handwriting:',
 stand:'The grandstand. Tonight there\'ll be a crowd up there.',
 // ---- night 2: the fair's last night (a danger zone) ----
 fair2:['The fair\'s last night. The grandstand lights are on, and the whole town is in the bleachers, all nine hundred.','Out on the midway, men in usher vests walk slow beats under the string lights. None of them has a face.','Jolene Peck comes through the crowd at a run.'],
 fairOk:'You stop at the gate and watch the ushers walk. You learn their beats before they learn you.',fairFail:'Somewhere on the midway an usher turns. You can\'t tell which one.',
 tannerSeen:['At the very top of the Ferris wheel, the car rocks. Tanner sits in it alone, very straight.','He\'s laughing. It\'s not his laugh. It\'s a grown man\'s laugh, polite and careful, coming out of a nine-year-old.',
  'Below, at the foot of the wheel, the operator\'s chair is empty. The wheel is turning anyway.'],
 tannerH:'Tanner laughing in their voice',
 tannerFree:'Get Jolene. Call him down together',tannerClimb:'Climb up to his car',tannerTalk:'Talk him down',tannerCalm:'Talk him back to himself',tannerWait:'Wait for the ride to stop',
 tannerFreeDo:[['JOLENE','TANNER WAYNE PECK. YOU GET DOWN HERE.'],'Every mother in the county turns around. The wheel stops. It actually stops.','He comes down blinking, in his own face, and asks if he\'s in trouble.'],
 tannerClimbDo:'You go up the spokes like a kid on a jungle gym. At the top you take him by the shirt and the wheel stops, like it was waiting for you to ask.',
 tannerTalkDo:'You tell him the men are going to be so impressed, and that a real performer saves it for the big show. He thinks about it. He yells down to stop the ride.',
 tannerCalmDo:'You get him talking about the goats. The 4-H goats, which one bit who. He forgets he\'s supposed to be laughing for anybody. The wheel stops.',
 tannerFail:['He doesn\'t hear you. Or he does, politely, and keeps practicing.'],
 tannerWaitDo:['You wait at the bottom with Jolene. At midnight the wheel stops on its own.','Tanner climbs out yawning. He falls asleep in the truck before Jolene can buckle him in.'],
 tannerKept:['Jolene grabs him so hard his hat comes off.',['JOLENE','You are not sleeping. You hear me? You are drinking Mountain Dew and watching cartoons till the sun comes up.'],['TANNER','Cool.']],
 tannerTop:'TANNER',
 // ---- Voss at the grandstand steps ----
 vossNight:[['ARLEN VOSS','Agent. I\'m supposed to give the welcome. In ten minutes.'],['ARLEN VOSS','They asked for the grandstand. They said it\'s like graduation. Everybody comes.']],
 vossSit:'Let him sit it out',vossCuff:'Cuff him',vossTear:'Make him tear up his copy',
 vossSitDo:[['ARLEN VOSS','...Thank you.'],'He sits down on the grandstand steps with his hat in his hands, grinning at nothing.'],
 vossCuffToft:['Toft comes down the steps and does it herself.',['SHERIFF TOFT','Arlen. Put your hands behind your back. You know I hate this.'],['ARLEN VOSS','I know, Marlene.']],
 vossCuffSelf:'You cuff him on the grandstand steps. Four hundred people watch you do it. Somebody starts filming.',
 vossTearDo:['He takes a folded page out of his wallet. Old paper, ruled, in handwriting too nice to be anybody\'s.','You make him read it out loud. Then you make him tear it in half, and half again.',
  ['ARLEN VOSS','He was so kind about it.'],'The grin finally lets go of his face. He looks seventy.'],
 // ---- under the grandstand ----
 cameo:['At the edge of the grandstand crowd, under the lights, a tall man in a long coat stands with a book under his arm.','You look again. It\'s a man holding a funnel cake. Powdered sugar.'],
 cameoH:'Someone at the edge of the light',
 underOut:'Head back up to the fair?',underOutOpts:['Go back','Stay'],
 underShut:'A chain-link gate under the grandstand, padlocked. FAIR BOARD ONLY.',
 school:['Under the bleachers, someone has made a schoolroom. Folding chairs in rows. A chalkboard. A teacher\'s desk.','On a card table at the side, laid out like show-and-tell: Hal\'s pipe. Darla\'s red glasses. The pastor\'s collar. Each one has a gold star on it.',
  'Above you, nine hundred people stamp their feet on the boards, waiting for the welcome. The dust comes down through the light like chalk.','At the front, by the board, Mr. Doe and Mr. Roe stand side by side. They aren\'t wearing their glasses.','Where their eyes should be, the skin just goes on. Smooth. Like the back of a hand.'],
 schoolH:'The schoolroom under the grandstand',
 showName:'SHOW-AND-TELL',showLook:['Hal\'s pipe. Darla\'s red reading glasses. Pastor Gene\'s collar. Each one labeled in careful pencil, like for a class.','A fourth card is waiting, blank, with a gold star already stuck to it.'],
 chalk:'The chalkboard. SATURDAY in neat capitals, and under it, half rubbed out, a seating chart of the whole town.',
 chairs:'Folding chairs in rows, facing the board. Nine hundred names taped to them. You stop reading.',
 deskName:'TEACHER\'S DESK',deskLook:'The teacher\'s desk. An apple on it, very red, not bitten. A school copybook, squared to the corner.',deskEmpty:'The teacher\'s desk. An apple on it, very red, and a clean square of dust where a copybook sat.',
 bookTake:'Take the copybook',bookGot:'You slide it off the desk. At the front, both their heads tilt a little, like a teacher hearing a whisper.',
 bookMiss:['Mr. Roe\'s head turns toward you. It waits. You take your hand back.'],
 aloud:'Read the roll aloud',aloudId:'Read it back to them',aloudTruth:'Read every name aloud, whatever it costs',
 aloudDo:['You open the copybook and read it aloud. Every line. Hal Grissom: laughs at his own jokes before the end. Darla Meeks: taps her pen twice. Gene Ostrow: says "now then" when he means "listen".',
  'You read the three names into the dark, the way they\'d be read at a funeral, so it\'s on the record.','At the front of the room, both men put their hands over their ears. Very politely.'],
 aloudFail:'The handwriting is too small and too neat. It runs together like rain on a window.',
 aloudH:'Reading the dead aloud',
 bookQ:'Class is in session. Once it starts, nobody leaves until it\'s over.',bossOpts:['Go in','Not yet'],
 menUnder:[['MR. DOE','You are early.'],['MR. ROE','...early.'],['MR. DOE','Please take your seats.']],
 // ---- the boss ----
 boss1:['They step toward each other, and keep stepping, and fold together like a closing book.','What stands up is one man, too tall, in a suit too long in the arms. Over its smooth face, faces you know slide past like slides in a projector.'],
 bossSay:['THE GRADUATE','GOOD EVENING, AGENT {code}.'],
 bossSay2:['THE GRADUATE','WE HAVE LEARNED ODESSA FLATS. WE WOULD LIKE TO SAY A FEW WORDS.'],
 bossKept:['THE GRADUATE','OUR FOURTH LESSON DID NOT ATTEND. THAT IS VERY RUDE.'],
 bossBook:['THE GRADUATE','SOMEONE HAS TAKEN OUR NOTES. WE WILL MANAGE.'],
 bossIntro:'The Graduate rises to its full height!',
 bossThin:'It looks thinner than it should. What you did tonight weakened it.',
 bossIdent:'You already know what it is. You saw it on the curb. It has no lids to shut: light hurts it, and it has to answer a badge.',
 bossRoll:'The Graduate recites the class roll in a hundred voices!',
 bossNames:'The Graduate laughs in Hal Grissom\'s laugh. Then in yours.',
 bossPhase:'The faces come loose. They hang off it at angles, like masks on strings, and its blank face splits into a mouth of ruled paper.',
 bossHeal:'It turns a page somewhere inside itself and stands up straighter. It heals {n}.',
 bossStall:'The Graduate reaches into its jacket for its notes. They aren\'t there. It waits, politely, for them to come back.',
 bossNoHeal:'It reaches for a page that isn\'t there. You read those names. It can\'t hold them.',
 mimic:'The Graduate speaks in {n}\'s voice: "{t}, hold." {t} stops dead.',
 // ---- overstepping: Toft (Local chief), Big Hat's call (Agency call), the clean-up crew (Federal agents) ----
 chief:[['SHERIFF TOFT','I told you. I hear about it before your foot\'s back on the ground.'],['SHERIFF TOFT','Badges or not, you don\'t do that in my town. Folks won\'t talk to you the rest of the day, and I won\'t make them.']],
 call:['Your phone buzzes. Unknown number. You know who it is.',['BIG HAT','I am hearin\' about you on a Kansas police scanner, {first}. I didn\'t know Kansas had police scanners.'],['BIG HAT','Don\'t ask for anything next time. You won\'t get it.']],
 feds:['Black cars on the county road with their headlights off. Four doors open at the same time.',['CLEAN-UP','Black Lantern. You\'re done here. Hand over what you\'ve found.'],['CLEAN-UP','There\'s already two of us in this town who don\'t belong. Don\'t make it five.']],
 fedsIntro:'The clean-up crew draws down!',
 fedsWin:['The black cars leave the way they came, one short.'],
 crowd:'That was loud, on a midway full of people. Somebody\'s filming on a phone.',
 // ---- the ending ----
 end1:['The Graduate stops in the middle of a word. It tries the word again in four voices, and none of them fits.','It comes apart like a wet paper bag. Copybook pages, hundreds of them, drift down onto the folding chairs.','Above you, the crowd stamps for the welcome. Nobody up there heard a thing.'],
 bookDrop:'In the pile of pages, one copybook is still whole. GOOD MANNERS on the cover in careful capitals. You take it.',
 dawn:'Sunday morning. The fair closes on time. Nobody in Odessa Flats can remember why they were so nervous all summer.',
 dawnKept:'Monday, Tanner Peck wakes up at seven, sees the dog, and laughs. His own laugh. Jolene calls Marlene to tell her, and Marlene cries in the cruiser and says it\'s allergies.',
 dawnLost:'Tanner Peck doesn\'t wake up Monday. He\'s smiling. Small and tidy. Abernathy writes natural, a fourth time, and doesn\'t believe it.',
 dawnVoss:'Arlen Voss resigns from the fair board by letter. The co-op closes in October, the way it was always going to.',
 filed:['BIG HAT','This copybook. I\'ll file it. Records wants it by Monday.'],
 funnel:'He slides a funnel cake across the desk. Powdered sugar. You didn\'t buy it. He doesn\'t say where it came from.',
 // ---- the debrief (spec 007): Big Hat's lines by ending ({x}/{t} clues, {v}/{n} kept safe), what he says about the
 // choices, and the cover stories ----
 db:{
  clean:[['BIG HAT','Peck boy woke up Monday and laughed at a cartoon dog. His own laugh. His mama called my phone to tell me.'],['BIG HAT','I don\'t know how she got this number. {x} clues outta {t}. Fair closed on time. Sit.']],
  costly:[['BIG HAT','Those two fellas in suits are gone. That\'s the good news.'],['BIG HAT','Town sign still says nine hundred. Somebody\'s gonna have to go out there with a can of paint, and it ain\'t gonna be me.'],['BIG HAT','{x} clues outta {t}. Sit.']],
  worst:[['BIG HAT','Black cars on a county road. Men in suits fillin\' out forms I\'m not cleared to read.'],['SHOUT','THERE WERE ALREADY TOO MANY MEN IN SUITS IN THAT TOWN.'],['BIG HAT','Case is closed. Not by us.']],
  wrong:['BIG HAT','Sheriff Toft says you called \'em federal. To her face. Wearin\' a badge.'],
  forced:['BIG HAT','Prairie Rest Motel wants a new door on room 7. It\'s comin\' out of your per diem.'],
  cuffed:['BIG HAT','Arlen Voss\'s lawyer called. Twice. I told him we can\'t read.'],
  fought:['BIG HAT','Two co-op fellas in County with tire-iron-shaped feelings. Voss is payin\' their bills, which tells me plenty.'],
  stake:['BIG HAT','You sat up all night watchin\' a motel wall. That\'s the job. Most nights that\'s the whole job.'],
  kept:['BIG HAT','Mrs. Peck sent a pie. Rhubarb. I don\'t care for rhubarb. I ate the whole thing.'],
  zip:['BIG HAT','Fella you zip-tied talked all the way to County. Mostly about his truck. Some of it was useful.'],
  gen:'Bad generator under the bleachers',genPass:[['BIG HAT','Generator under the grandstand, bad venting. Three deaths in a month, all downwind of the fair setup. County inspector signs it Monday.']],
  grift:'Two grifters, working old folks',griftPass:[['BIG HAT','Couple of con men in rented suits, workin\' retirees for their pensions. Skipped town Sunday. Paper runs it under SCAM ALERT.']],
  weak:'Heat stroke. It\'s Kansas in August.',weakPass:[['BIG HAT','Heat. Ninety-six in the shade. Nobody wants to know more than that. You got lucky.']],
  photo:'Blurry photos and a UFO crank',photoPass:[['BIG HAT','Your pictures go to the UFO fella in Salina. He prints \'em with a headline. Nobody believes a word of it. Perfect.']],
  safe:'Already filed: natural causes, three times',safePass:[['BIG HAT','Coroner wrote natural three times. Paperwork\'s never wrong.']]
 }
};
const fill=(t,o)=>String(t).replace(/\{(n|m|v|t)\}/g,(x,k)=>o[k]??x);
async function play(seq,o={}){for(const l of [].concat(seq)){if(Array.isArray(l))await say(l[0],fill(l[1],o));else await say('',fill(l,o))}}
const said=(l,o)=>play([l],o);

// The case board card (spec 010, The card)
const caseCard={file:2,title:'GOOD MANNERS',town:'ODESSA FLATS',place:'COUNTY FAIR · ODESSA FLATS, KS',
 hook:['Two men in suits watch the houses.','The ones they watch don\'t wake up.'],pin:'#3ff0e8'};

// ================= CASE DATA =================
// Enemy cards (Combat: Enemies and difficulty, Combat numbers). Fight sizes: roamers 10–18 enemy HP, story fights 20–35.
const EN={
 // the co-op's night men (a human story fight, 2 skulls): Persuade's Lean on them stops it before it starts
 nightman:{name:'Night man',tier:'ordinary',hp:11,dex:11,hit:50,dmg:'1d4+1',skulls:2,tags:['human','living'],resist:[],weak:'human',weakLine:'Human, scared and paid fifty a night. A flashbang or a badge will stop him for a second.',
  moves:[['hit',1]],verb:'swings a tire iron at',die:'sits down hard in the gravel and stays there',face:[10,2,20]},
 // the Understudies (an unnatural story fight, 2 skulls): grain dust in a suit
 understudy:{name:'Understudy',tier:'ordinary',hp:12,dex:9,hit:45,dmg:'1d3+1',skulls:2,tags:['unnatural','burns','learned'],resist:['shaken'],weak:'fire',weakLine:'Grain dust in a suit. Fire takes it fast. Nothing in there to scare.',
  moves:[['hit',3],['san',1]],verb:'grabs at',sanText:'The Understudy laughs in Hal Grissom\'s laugh. It\'s a good laugh. It\'s exactly right.',sanHit:['0','1d2'],die:'slumps into a heap of grain dust and an empty suit',face:[12,0,24],
  horror:{tier:'disturbing',kind:'unnatural'}},
 // the fairground's ushers (roamers on night 2): no faces, and afraid of the light
 usher:{name:'Usher',tier:'ordinary',hp:12,dex:10,hit:45,dmg:'1d3+1',skulls:1,tags:['unnatural','lightshy'],resist:[],weak:'light',weakLine:'No face, so no eyes to shut. A road flare sends it reeling.',
  moves:[['hit',1]],verb:'reaches for',die:'folds up like an empty vest',face:[10,0,20],horror:{tier:'unsettling',kind:'unnatural'}},
 usherhead:{name:'Head usher',tier:'ordinary',hp:16,dex:10,hit:50,dmg:'1d4+1',skulls:2,tags:['unnatural','lightshy'],resist:[],weak:'light',weakLine:'No face, so no eyes to shut. A road flare sends it reeling.',
  moves:[['hit',1]],verb:'grabs for',die:'folds up like an empty vest',face:[10,0,20],horror:{tier:'unsettling',kind:'unnatural'}},
 // only if overstepping reaches Federal agents (the same clean-up crew as every case; its sprite is Still Harvest's SHB)
 fed:{name:'Clean-up agent',tier:'ordinary',hp:11,dex:12,hit:55,dmg:'1d4+1',skulls:3,tags:['human','living'],resist:[],weak:'human',weakLine:'Human. A flashbang or a badge will stop him for a second.',
  moves:[['hit',1]],verb:'fires at',die:'goes down and stays down',face:[10,2,20]},
 // the boss (tuned Nov 23, 2026 with tools/boss-sim.js against the Gleaner's bar). Its moves, phase 2 and HP are set per
 // run in bossFight() from the case's choices. Weakness: light; it must answer a badge (asHuman: Flash the badge and a
 // flashbang work on it as on a person)
 graduate:{name:'The Graduate',tier:'boss',boss:true,hp:64,dex:11,hit:60,dmg:'1d4+2',allDmg:'1d3',skulls:3,tags:['unnatural','lightshy','learned'],resist:['stun2','poison','bleed'],weak:'light',asHuman:['badge','flashbang'],
  weakLine:'No lids to shut: a road flare or a flashbang staggers it. Bound by manners, it has to answer a badge. It can\'t be stunned two turns running.',glow:true,face:[34,4,30],
  moves:[['hit',5],['all',2]],verb:'reaches down for',allText:TEXT.bossRoll,sanText:TEXT.bossNames,sanHit:['1','1d4'],die:'comes apart into copybook pages',
  horror:{tier:'boss',kind:'unnatural',subj:'the Graduate',known:true}}
};
// the case's horrors: tier, kind, phobia subject; once per case each (SAN loss table). The schoolroom and the boss are
// for all three; the rest are the lead's on the map
const HORRORS={
 heads:{id:'heads',tier:'unsettling',kind:'unnatural',label:TEXT.headsH},
 smiles:{id:'smiles',tier:'unsettling',kind:'helplessness',gore:true,label:TEXT.smilesH},
 room7:{id:'room7',tier:'disturbing',kind:'unnatural',label:TEXT.r7H},
 glasses:{id:'glasses',tier:'severe',kind:'unnatural',all:true,label:'One of them taking its glasses off'},
 lesson:{id:'lesson',tier:'unsettling',kind:'unnatural',label:'Writing in the air'},
 tanner:{id:'tanner',tier:'severe',kind:'helplessness',label:TEXT.tannerH},
 school:{id:'school',tier:'shattering',kind:'unnatural',all:true,label:TEXT.schoolH},
 aloud:{id:'aloud',tier:'disturbing',kind:'helplessness',label:TEXT.aloudH},
 cameo:{id:'cameo:tall',tier:'unsettling',kind:'unnatural',label:TEXT.cameoH}
};
// this case's own items (case-only: the pin icon; Big Hat sorts them at the debrief). The copybook is the key evidence.
const CASE_ITEMS={
 copybook:{name:'The copybook',type:'Evidence',kind:'unnatural',pin:1,passive:1,
  desc:'A school copybook, GOOD MANNERS on the cover in careful capitals. The last pages are a different paper, older and ruled in red, numbered in the corner: 2.'},
 harmonica:{name:'Hal\'s harmonica',type:'Tool',kind:'ordinary',pin:1,desc:'Battle: anything that learned a laugh stops to listen. Stunned a round.',
  battleUse:async(m)=>{const fs=aliveFoes().filter(e=>(e.tags||[]).includes('learned'));await say('',`${m.name} plays four bars of something Hal Grissom used to play on his porch.`,{auto:1300});
   if(!fs.length){await say('',`Nothing here learned to listen.`,{auto:900});return true}for(const e of fs)await foeStatus(e,'stun');return true}},
 gmcoffee:{name:'Rhonda\'s coffee',type:'Drink',kind:'ordinary',pin:1,desc:'Restore 1d4+1 WP.',
  mapUse:async()=>{const t=await pickMember('WHO DRINKS?',()=>true);if(!t)return false;const g=roll(1,4,1);t.wp=Math.min(t.mwp,t.wp+g);await say('',`${t.name} drinks diner coffee out of a styrofoam cup. +${g} WP.`);return true},
  battleUse:async()=>{const t=await pickAlly({title:'WHO DRINKS?',noKO:true});if(!t)return false;const g=roll(1,4,1);t.wp=Math.min(t.mwp,t.wp+g);await say('',`${t.name} drinks diner coffee. +${g} WP.`,{auto:1000});return true}}
};
// a roamer's drop: 20% from this loot table (Where items come from, Loot): a farm town and a fair
const LOOT=['energy','cigs','roadflare','painkillers','firecrackers'];
const F_=()=>G.flags;
const has=id=>G.clues.some(c=>c.id===id);
const TOWN=['dead','watch','room7','car','roll','lesson'];
const townClues=()=>G.clues.filter(c=>TOWN.includes(c.id)).length;
const late=()=>G.flags.late|0;
const addLate=()=>{G.flags.late=late()+1};

// ================= THE DAY =================
// G.flags.ph: 0 day 1, 1 night 1, 2 day 2, 3 night 2 (spec 010, Day and night). Each turn happens at the motel bed and
// waits for Go on / Not yet with the cursor on Not yet, naming what closes (Turning the day; play.md).
const ph=()=>G.flags.ph|0;
const isNight=()=>ph()%2===1;
const outLight=()=>isNight()?'night':'day';
// overstepping: which step the case is on (open case: Clean, Local chief, Agency call, Federal agents)
const stepName=()=>stepsOf()[loadSeason().overstep|0]||'Clean';
const stepAt=n=>stepsOf().indexOf(n)<=(loadSeason().overstep|0)&&stepsOf().indexOf(n)>=0;
const chiefToday=()=>G.flags.chiefPh!=null&&G.flags.chiefPh===ph();
// Persuade in town: −20 the day Toft takes the badge talk off the table (Local chief); +10 with Toft and her deputy
// from the briefing's town intel (spec 013)
const talkMod=()=>chiefToday()?-20:0,toftMod=()=>talkMod()+(intelOn('town')?10:0),morgueEye=()=>intelOn('dead')?10:0;
const toftHelps=()=>['right','voss'].includes(G.flags.deduce);

// ================= MAPS =================
// Every map is drawn by cases/good-manners-art.js from M.ground, M.pieces and M.light. M.g is what blocks.
// Ground letters (none of them in engine.js's BLOCK set): '.' dry grass, ':' lawn, ',' sidewalk, '=' road, '_' parking lot, 'g' gravel, 'x' dry dirt,
// 'r' dirt road, 'n' linoleum, 'c' carpet, 'v' tile, 'w' wood floor.
function blank(id,name,W,H,fillCh,light){const ground=mk(W,H,fillCh),g=mk(W,H,fillCh);
 return{id,name,w:W,h:H,ground,g,pieces:[],O:{},npcs:[],warps:{},light,art:window.GMA,bg:id,warm:'#ff9a3c',lines:[]}}
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

// ---- MAIN STREET: day and night (44 x 21) ----
function buildMain(){
 const N=isNight(),M=blank('main','MAIN STREET',44,21,'.',outLight()),F=G.flags;M.alpha=.84;
 lay(M,0,0,44,4,'g');block(M,0,0,44,4);put(M,'backlot',0,0,44,4,{walk:1});
 put(M,'elevator',23,0,8,4,{walk:1});
 lay(M,0,8,44,1,',');lay(M,0,9,44,3,'=');lay(M,0,12,44,1,',');
 M.lines.push({x:0,y:10*16-1,w:44*16,h:2,dashed:true});M.lines.push({x:0,y:11*16+15,w:44*16,h:1,col:'#e8dcc0'});
 put(M,'store',1,4,6,4,{sign:'SHERIFF',col:'#9a6a4a',door:3,upper:true,flag:1});door(M,3,7,'office',7,9,'up');
 put(M,'store',8,4,6,4,{sign:'WHEAT KERNEL DINER',col:'#8a3c24',door:11,awning:1});
 if(N)M.O['11,7']=look('The diner\'s dark. A sign in the door: CLOSED. SEE YOU AT 6. A smaller sign: YES, 6 A.M.');else door(M,11,7,'diner',7,9,'up');
 put(M,'store',14,4,3,4,{sign:'FEED',col:'#7a4a34',door:15,dark:1});M.O['15,7']=look('A FOR LEASE sign in the window, sun-bleached to pink.');
 lay(M,17,4,2,4,'g');
 put(M,'store',19,4,3,4,{sign:'HARDWARE',col:'#8f5a3a',door:20,upper:true});M.O['20,7']=look('Closed for the fair. A hand-lettered sign: BACK MONDAY. GOD WILLING.');
 lay(M,22,4,1,4,',');
 put(M,'coop',23,4,8,4,{sign:'ODESSA FLATS CO-OP',door:26});M.O['26,7']={id:'coop',name:TEXT.coop,look:()=>said(N?TEXT.coopNight:TEXT.coopDay),opts:()=>coopOpts(),used:()=>has('roll')};
 lay(M,31,4,3,4,'x');put(M,'tree',32,5);
 lay(M,33,4,7,4,',');put(M,'station',34,5,5,3,{sign:'GAS',door:37});
 M.O['37,7']={id:'gas',name:TEXT.gas,look:TEXT.gasLook,opts:[{use:'sweep',once:'gasFlare',ok:async()=>{await said(TEXT.gasSweep);await pickup('roadflare')},fail:()=>said(TEXT.gasNone)}]};
 put(M,'pump',35,8);M.O['35,8']=look('One pump. No brand on it, just a price somebody repaints by hand. It\'s gone up twice since lunch.');
 lay(M,40,4,4,4,'x');put(M,'tree',42,5);put(M,'tree',40,7);
 [[6,8],[16,8],[29,8],[41,8],[1,12],[12,12],[24,12],[36,12]].forEach(([x,y])=>put(M,'lamp',x,y));
 put(M,'traffic',17,9,2,3,{walk:1});
 put(M,'bench',23,8,1,1);
 lay(M,1,13,20,8,'_');
 put(M,'motel',2,13,18,4,{door:3,rooms:[6,8,10,12,14,16,18]});
 M.O['3,16']={id:'motelOffice',name:TEXT.office,look:TEXT.officeLook,opts:[{label:TEXT.bell,once:'bev',run:()=>play(TEXT.bev)}]};
 door(M,16,16,'motel',6,7,'up');
 M.O['18,16']={id:'room7',name:TEXT.room7,look:()=>said(has('room7')?TEXT.r7After:TEXT.room7Look),opts:()=>room7Opts(),used:()=>has('room7')};
 put(M,'motelsign',21,13,1,1);
 [[4,18],[13,18]].forEach(([x,y])=>put(M,'lamp',x,y));
 lay(M,1,17,20,1,',');
 put(M,'car',6,19,2,1,{tint:'#5a6a7a'});M.O['6,19']=M.O['7,19']={id:'car',name:'CAR',look:'Your car. Rental plates, seats hot enough to brand cattle.',opts:()=>carOpts(),used:()=>false};
 lay(M,21,12,2,9,'_');
 put(M,'tower',33,16,4,2);M.O['34,17']=M.O['35,17']=look('The water tower. ODESSA FLATS in letters taller than you. Somebody painted a smiley face on the leg, and somebody else painted it out.');
 put(M,'welcome',40,13);M.O['40,13']={look:()=>said(F.boss?'WELCOME TO ODESSA FLATS. POP. 900. Somebody has scratched the 900. Not out. Just scratched it, like they were thinking about it.':'WELCOME TO ODESSA FLATS. POP. 900.')};
 [[25,15],[29,19],[39,18],[42,15],[26,20],[31,20],[37,20],[43,20],[0,20]].forEach(([x,y])=>put(M,'tree',x,y));
 lay(M,27,14,3,4,'x');
 // people: who's where by phase. Night 1: the co-op's night men stand in front of its door until they're dealt with
 const NP=[];
 if(!N)NP.push(folkNPC({id:'orvel',x:38,y:8,dir:'down'},talkOrvel));
 if(ph()===0)NP.push(folkNPC({id:'voss',x:27,y:8,dir:'down'},talkVoss));
 if(ph()===1&&!F.night){NP.push(folkNPC({id:'nightman',x:26,y:8,dir:'down'},talkNightMen),folkNPC({id:'nightman2',x:27,y:8,dir:'left'},talkNightMen))}
 M.npcs=NP;
 bounceDir(M,['0,9','0,10','0,11'],'Main Street runs on west to the highway. Big Hat said Sunday. Not yet.','right');
 ['43,9','43,10','43,11'].forEach((k,i)=>M.warps[k]=()=>goTo('elm',1,10+(i>1?1:0),'right'));
 return M}

// ---- ELM AND THIRD: day and night (32 x 22) ----
function buildElm(){
 const N=isNight(),M=blank('elm','ELM AND THIRD',32,22,':',outLight()),F=G.flags;M.alpha=.86;
 lay(M,0,9,32,1,',');lay(M,0,10,32,2,'=');lay(M,0,12,32,1,',');lay(M,13,0,1,22,',');lay(M,16,0,1,22,',');lay(M,14,0,2,22,'=');
 lay(M,0,10,32,2,'=');
 put(M,'house',1,3,5,5,{col:'#c9b48a',roof:'#5a4a3e',door:3,seed:1});M.O['3,7']=look('Locked. A wreath on the door from a funeral, not Christmas.');
 put(M,'house',7,2,5,6,{col:'#8a9aa8',roof:'#3e3a46',door:8,porch:1,seed:2,shutters:'#3e5a4a'});
 M.O['8,7']={id:'grissom',name:TEXT.grissom,look:TEXT.grissomLook,opts:[{label:TEXT.harpTake,once:'harp',run:async()=>{await said(TEXT.harpDo);await pickup('harmonica')}}]};
 put(M,'house',18,2,6,6,{col:'#d8cdb0',roof:'#6a3a2e',door:20,porch:1,curtains:1,seed:3,shut:1});M.O['20,7']=look(N?TEXT.peckNight:TEXT.peck);
 put(M,'house',25,3,6,5,{col:'#a8a070',roof:'#4a4038',door:26,garage:1,seed:4});M.O['26,7']=look('Locked. A garage full of Christmas decorations, visible through the little windows. It\'s August.');
 [[2,8,false],[9,8,true],[21,8,false],[28,8,false]].forEach(([x,y,f])=>{put(M,'mailbox',x,y,1,1,{flag:f});M.O[x+','+y]=look(TEXT.mailbox)});
 M.O['9,8']=look('Hal Grissom\'s mailbox. The flag\'s up. Nobody\'s had the heart to take the mail out.');
 put(M,'fence',0,1,13,1);put(M,'fence',17,1,15,1);
 put(M,'fence',0,13,12,1);put(M,'fence',17,13,9,1);
 put(M,'house',2,15,6,5,{col:'#b8a8c0',roof:'#3e3a46',door:4,seed:5,back:1});
 put(M,'house',18,15,6,5,{col:'#c8b898',roof:'#5a3e2e',door:20,seed:6,back:1});
 lay(M,26,13,6,9,'.');lay(M,9,14,3,7,'.');
 [[0,0],[5,0],[11,0],[18,0],[24,0],[30,0],[27,14],[30,17],[26,19],[29,20],[10,15],[0,16],[24,20],[9,20],[1,21],[12,21]].forEach(([x,y])=>put(M,'tree',x,y));
 put(M,'swing',27,16,3,1);M.O['27,16']=M.O['28,16']=M.O['29,16']=look('A swing set in the vacant lot. One swing is going. There\'s no wind.');
 [[12,9],[27,9],[5,12],[17,12]].forEach(([x,y])=>put(M,'lamp',x,y));
 put(M,'blackcar',19,11,2,1);M.O['19,11']=M.O['20,11']={id:'blackcar',name:TEXT.car,look:TEXT.carLook,opts:()=>blackCarOpts(),used:()=>has('car')&&!!F.photo};
 const NP=[];
 if(ph()<2){NP.push(folkNPC({id:'doe',x:21,y:12,dir:'up'},talkMen),folkNPC({id:'roe',x:22,y:12,dir:'up'},talkMen))}
 if(!N&&ph()===0){NP.push(folkNPC({id:'jolene',x:22,y:8,dir:'down'},talkJolene),folkNPC({id:'tanner',x:19,y:8,dir:'down'},talkTanner))}
 M.npcs=NP;
 // The hidden hotspot (Item list, Mushrooms): where the men stand, only while the lead is High (field.js, hidden)
 M.O['23,12']={id:'lesson',hidden:'mushrooms',name:'THE CURB',look:readLesson,used:()=>has('lesson'),glint:(c,x,y,now)=>GMA.lessonGlint(c,x,y,now)};
 ['0,10','0,11'].forEach((k,i)=>M.warps[k]=()=>goTo('main',42,10+i,'left'));
 const edge='Nothing out there but wheat and a grain truck doing seventy. Not yet.';
 bounceDir(M,['14,0','15,0'],edge,'down');bounceDir(M,['14,21','15,21'],edge,'up');bounceDir(M,['31,10','31,11'],edge,'left');
 M.arrive=elmArrive;
 return M}

// ---- interiors: 15 tiles wide, the back wall three tiles tall, the door in the bottom wall ----
function room(id,name,W,H,floor){const M=blank(id,name,W,H,floor,'day');block(M,0,0,W,3);block(M,0,0,1,H);block(M,W-1,0,1,H);block(M,0,H-1,W,1);
 put(M,'room',0,0,W,H,{walk:1,floor});return M}
function buildOffice(){const M=room('office','SHERIFF\'S OFFICE',15,11,'n');
 put(M,'desk',3,3,2,1);M.O['3,3']=M.O['4,3']=look(TEXT.desk);
 put(M,'cabinet',1,3);M.O['1,3']={id:'cabinet',name:TEXT.cabinet,look:()=>said(chiefToday()&&!has('roll')?TEXT.cabChief:TEXT.cabLook),opts:()=>cabinetOpts(),used:()=>has('roll')};
 put(M,'cell',10,3,4,3);M.O['10,5']=M.O['11,5']=M.O['12,5']=M.O['13,5']=look(TEXT.cell);
 put(M,'benchin',1,8,2,1);put(M,'plant',13,8);put(M,'shelfin',6,3,2,1,{stocked:true});put(M,'rug',5,6,4,3,{walk:1,col:'#6a3a2e'});
 M.npcs=[folkNPC({id:'toft',x:4,y:5,dir:'down',out:()=>!!G.flags.checkin&&(townClues()<3||!!G.flags.deduce)&&G.fs.talked.toft===G.clues.length},talkToft),
  folkNPC({id:'cal',x:9,y:7,dir:'left',out:()=>!!G.flags.calTold},talkCal)];
 door(M,7,10,'main',3,8,'down');return M}
function buildDiner(){const M=room('diner','WHEAT KERNEL DINER',15,11,'n');
 put(M,'counter',1,4,7,1);M.O['2,4']=M.O['3,4']=M.O['6,4']=look(TEXT.counter);M.O['4,4']=M.O['5,4']=talkRhonda;
 put(M,'shelfin',1,3,2,1,{stocked:true});put(M,'piecase',5,3,2,1);
 [[10,4],[10,7]].forEach(([x,y])=>put(M,'table',x,y,2,1));put(M,'table',2,7,2,1);
 M.O['10,7']=M.O['11,7']={id:'booth',name:TEXT.booth,look:TEXT.boothLook,opts:[{use:'examine',once:'booth',ok:()=>play(TEXT.boothExam)}]};put(M,'cups',10,7,2,1,{walk:1});
 put(M,'jukebox',13,3);M.O['13,3']=look('The jukebox. Every song is from 1962. Somebody has been playing B-14 over and over: "Mr. Lonely."');put(M,'plant',13,8);
 M.npcs=[folkNPC({id:'rhonda',x:4,y:3,dir:'down',out:()=>!!G.flags.rhondaGive&&!!G.flags.rhondaRead},talkRhonda)];
 door(M,7,10,'main',11,8,'down');return M}
function buildMotel(){const M=room('motel','ROOM 6 · PRAIRIE REST MOTEL',12,9,'c');
 put(M,'bed',2,3,2,2);M.O['2,4']=M.O['3,4']={id:'bed',name:TEXT.bed,look:TEXT.bedLook,opts:()=>bedOpts(),used:()=>ph()>=3};
 put(M,'nightstand',4,3);put(M,'desk',8,3,2,1,{tv:1});M.O['8,3']=M.O['9,3']=look('The TV gets two channels. One is the weather. The other is also the weather.');
 put(M,'chair',9,6);put(M,'ac',6,2,1,1,{walk:1});put(M,'rug',4,5,4,2,{walk:1,col:'#4a5a3a'});put(M,'plant',10,6);
 M.O['6,3']=look('The air unit. It rattles like somebody tapping, very politely, to be let in.');
 door(M,6,8,'main',16,17,'down');return M}
function buildMorgue(){const M=room('morgue','COUNTY MORGUE · PLAINVIEW',15,11,'v');
 put(M,'drawers',6,0,6,3,{walk:1});M.O['7,3']=M.O['8,3']=M.O['9,3']=M.O['10,3']={id:'drawers',name:TEXT.drawers,look:lookDrawers,opts:()=>drawerOpts(),used:()=>has('dead')};block(M,6,3,5,1);
 put(M,'slab',5,6,3,1);M.O['5,6']=M.O['6,6']=M.O['7,6']=look(TEXT.slab);
 put(M,'desk',1,3,2,1);put(M,'sink',13,3);put(M,'shelfin',13,6,1,2,{stocked:true});put(M,'drain',7,8,1,1,{walk:1});put(M,'cabinet',1,7);put(M,'xray',2,0,2,3,{walk:1});
 M.npcs=[folkNPC({id:'doc',x:10,y:6,dir:'left',out:()=>has('dead')},talkDoc)];
 M.warps['7,10']=()=>driveTo('town');open(M,7,10);
 M.arrive=async()=>{if(!G.flags.morgue1){G.flags.morgue1=1;await cut('morgue',()=>play(TEXT.morgue1))}};
 return M}

// ---- THE FAIRGROUND: day 2, then night 2 (40 x 26), a danger zone on night 2 ----
// The tiles the night's three ushers walk, in front of what each guards (Gameplay loop, Roamers)
const BEAT={wheel:[[3,10],[4,10],[5,10],[6,10],[7,10],[8,10],[9,10]],barn:[[2,21],[3,21],[4,21],[5,21],[6,21],[7,21]],stand:[[27,23],[28,23],[29,23],[30,23],[31,23],[32,23]]};
function buildFair(){
 const N=isNight(),M=blank('fair','COUNTY FAIRGROUND',40,26,'.',N?'night':'day'),F=G.flags;M.alpha=.8;
 lay(M,0,0,40,2,'.');block(M,0,0,40,1);put(M,'fairfence',0,1,40,1);
 lay(M,2,11,36,3,'r');lay(M,18,11,4,15,'r');lay(M,12,14,3,4,'x');lay(M,22,14,4,3,'x');
 put(M,'wheel',3,6,8,4);M.O['6,9']=M.O['7,9']={id:'wheel',name:TEXT.wheel,look:N?lookWheel:TEXT.wheelDay,opts:()=>N?wheelOpts():[],used:()=>!N||!!(F.kept||F.tannerWait)};
 put(M,'spinner',28,4,7,5);M.O['30,8']=M.O['31,8']=M.O['32,8']=look(TEXT.spinner);
 [['RING TOSS','#ff6fae'],['DUCKS','#4fd8e0'],['DARTS','#d8b24a'],['CORN DOGS','#b5532e']].forEach(([t,c],i)=>{const x=13+i*3;put(M,'booth',x,8,2,2,{sign:t,stripe:c});M.O[x+','+9]=M.O[(x+1)+','+9]=look(TEXT.booths)});
 put(M,'barn',1,15,9,6);M.O['4,20']=M.O['6,20']=look(TEXT.barn);
 M.O['5,20']={id:'hay',name:TEXT.hay,look:N?TEXT.hayNight:TEXT.hayDay,opts:()=>N&&!G.fs.used['box:fair']?[{label:TEXT.hayOpen,run:openBox}]:[],used:()=>!N||!!G.fs.used['box:fair']};
 put(M,'pen',10,18,3,2);put(M,'tack',8,21);M.O['8,21']={id:'tack',name:TEXT.tack,look:TEXT.tackLook,opts:[{label:TEXT.tackOpt,once:'tack',run:async()=>{await said(TEXT.tackFind);await pickup('shrooms')}}]};
 put(M,'grandstand',26,15,13,7);M.O['29,21']=M.O['30,21']=look(TEXT.stand);
 // the gate under the grandstand: chained by day; on night 2 it stands open (a plain walk in: the boss waits inside)
 if(N){open(M,33,21);M.warps['33,21']=enterUnder}else M.O['33,21']={id:'under',name:'GATE',look:TEXT.underShut};
 lay(M,26,22,13,1,'x');
 [[2,23],[6,24],[11,23],[27,24],[33,25],[37,23],[38,10],[1,10],[24,4],[14,4],[0,13],[39,14]].forEach(([x,y])=>put(M,'tree',x,y));
 [[12,11],[24,11],[17,16],[22,20]].forEach(([x,y])=>put(M,'pole',x,y));
 put(M,'lights',12,11,13,1,{walk:1,from:[12,11],to:[24,11]});put(M,'lights',17,16,6,5,{walk:1,from:[17,16],to:[22,20]});
 [[16,20],[24,23]].forEach(([x,y])=>put(M,'table',x,y,2,1));
 [[9,12],[27,12],[17,24],[22,24]].forEach(([x,y])=>put(M,'lamp',x,y));
 put(M,'arch',17,25,6,1,{walk:1});
 ['19,25','20,25','18,25','21,25'].forEach(k=>{M.warps[k]=async()=>{const r=await ask('','Back to the car?',['Drive back to town','Stay']);if(r===0)await driveTo('town');else{G.dir='up';await stepBack()}}});
 const NP=[folkNPC({id:'dusty',x:31,y:10,dir:'down',out:()=>N||!!G.fs.used['opt:tea']},talkDusty)];
 if(!N){NP.push(folkNPC({id:'voss',x:28,y:13,dir:'down'},talkVoss),folkNPC({id:'jolene',x:9,y:11,dir:'right'},talkJolene),folkNPC({id:'tanner',x:8,y:11,dir:'up'},talkTanner),
  folkNPC({id:'doe',x:25,y:13,dir:'left'},talkMen),folkNPC({id:'roe',x:26,y:13,dir:'left'},talkMen),
  folkNPC({id:'fairgoer',x:15,y:13,dir:'up'}),folkNPC({id:'fairgoer2',x:21,y:17,dir:'left'}),folkNPC({id:'fairgoer3',x:16,y:21,dir:'down'}))}
 else{NP.push(folkNPC({id:'jolene',x:9,y:12,dir:'right'},talkJolene),folkNPC({id:'fairgoer2',x:21,y:17,dir:'left'}),folkNPC({id:'voss',x:30,y:22,dir:'down',on:()=>!F.boss},talkVossNight));
  // Tanner at the top of the wheel until he's down; then with his mother
  NP.push(folkNPC({id:'tanner',x:7,y:6,dir:'down',on:()=>!F.kept&&!F.tannerWait},()=>Promise.resolve()),folkNPC({id:'tanner',x:8,y:12,dir:'right',on:()=>!!F.kept},()=>play(TEXT.tannerAfter)));
  M.roamers=[
   {id:'uwheel',types:['usher'],sprite:'usher',name:'Usher',skulls:1,tags:EN.usher.tags,path:BEAT.wheel,look:'An usher in a red vest walks back and forth at the foot of the Ferris wheel, keeping the line tidy. There is no line.',after:crowdCheck},
   {id:'ubarn',types:['usherhead'],sprite:'usher',name:'Head usher',skulls:2,tags:EN.usher.tags,path:BEAT.barn,look:'A big usher with a flashlight stands guard at the barn ladder, sweeping its beam over nothing.',guard:openBox,after:crowdCheck},
   {id:'ustand',types:['usher'],sprite:'usher',name:'Usher',skulls:1,tags:EN.usher.tags,path:BEAT.stand,look:'An usher walks the foot of the grandstand steps, near Arlen Voss, like it\'s keeping him in his seat.',after:crowdCheck}];
  M.danger=true;M.boss=!F.boss}
 M.npcs=NP;
 M.arrive=fairArrive;
 return M}
async function enterUnder(){
 const L=lead();
 // the cameo (an arc touch, at most one per case): the lead's first sighting ever rolls 0/1
 if(!G.flags.cameo){G.flags.cameo=1;await play(TEXT.cameo);if(!L.a.sawTall){L.a.sawTall=1;await horror(HORRORS.cameo,{who:[L]})}}
 await goTo('under',10,8,'up')}
// ---- UNDER THE GRANDSTAND: night 2, the finale area (20 x 10); the boss waits at the front ----
// Two tiles in front of the men (9,3 and 10,3) and talking to them ask Go in / Not yet. The desk, the show-and-tell
// table and the chalkboard's ends are reached around them.
function buildUnder(){const M=blank('under','UNDER THE GRANDSTAND',20,10,'x','night'),F=G.flags;block(M,0,0,20,2);block(M,0,0,1,10);block(M,19,0,1,10);block(M,0,9,20,1);
 put(M,'underroom',0,0,20,10,{walk:1});put(M,'chalk',8,1,4,1,{walk:1});M.O['8,1']=M.O['11,1']=look(TEXT.chalk);
 for(const y of[4,6])for(const x of[4,6,8,11,13,15])put(M,'chair',x,y);M.O['8,6']=M.O['6,4']=look(TEXT.chairs);
 put(M,'desk',14,2,2,1);M.O['14,2']=M.O['15,2']={id:'desk',name:TEXT.deskName,look:()=>said(F.book?TEXT.deskEmpty:TEXT.deskLook),opts:()=>deskOpts(),used:()=>F.book==='aloud'||(!!F.book&&!readOpts().length)};
 put(M,'table',3,2,2,1);M.O['3,2']=M.O['4,2']={id:'show',name:TEXT.showName,look:()=>play(TEXT.showLook)};
 M.npcs=F.boss?[]:[folkNPC({id:'doe',x:9,y:2,dir:'down'},bossAsk),folkNPC({id:'roe',x:10,y:2,dir:'down'},bossAsk)];
 open(M,10,9);M.warps['10,9']=async()=>{const r=await ask('',TEXT.underOut,TEXT.underOutOpts);if(r===0)await goTo('fair',33,22,'down');else{G.dir='up';await stepBack()}};
 M.onStep=async()=>{if(!F.boss&&G.y===3&&(G.x===9||G.x===10)){held=[];await bossAsk()}};
 M.arrive=async()=>{if(!F.school){F.school=1;await cut('school',()=>play(TEXT.school));await horror(HORRORS.school);checkpoint()}};
 M.boss=!F.boss;
 return M}
const MAPS={main:buildMain,elm:buildElm,office:buildOffice,diner:buildDiner,motel:buildMotel,morgue:buildMorgue,fair:buildFair,under:buildUnder};

// ================= DRIVING AND THE DAY =================
function carOpts(){const o=[],p=ph();
 if(p===0||p===2)o.push({label:'Drive to the county morgue (Plainview)',run:()=>driveTo('morgue')});
 if((p===0||p===2)&&!G.flags.county)o.push({label:TEXT.countyOpt,run:countySeat});
 if(p>=2)o.push({label:'Drive to the fairground',run:()=>driveTo('fair')});
 return o}
const DRIVE={morgue:'Forty minutes of wheat. Then Plainview, which is Odessa Flats with a stoplight that works.',fair:'Ten minutes up the county road. The Ferris wheel comes up over the wheat first.',town:'Back to Odessa Flats.'};
async function driveTo(where){await fade(1);await say('',DRIVE[where]);
 if(where==='morgue')goMap('morgue',7,9,'up');else if(where==='fair')goMap('fair',19,24,'up');else goMap('main',8,19,'left');checkpoint();await fade(0);if(G.M.arrive)await G.M.arrive()}
// the soft clock: a long drive for records costs the afternoon (late +1), never progress
async function countySeat(){const F=G.flags;F.county=1;addLate();await fade(1);await play(TEXT.countyGo);
 let got=false;
 await hotspot({name:'COUNTY RECORDS',opts:[{use:'records',ok:async()=>{got=true;await findRoll(TEXT.countyRec)},fail:()=>said(TEXT.countyFail)},{use:'paper',ok:async()=>{got=true;await findRoll(TEXT.countyRec)},fail:()=>said(TEXT.countyFail)}]},'county');
 if(!got&&!has('roll'))await said(TEXT.countyFail);
 await said(TEXT.countyBack);checkpoint();await fade(0)}
function bedOpts(){const p=ph(),o=[];
 if(p===1&&!G.flags.stake)o.push({label:TEXT.stake,run:stakeout});
 if(p<3)o.push({label:TEXT.bedOpt[p],run:turnDay});
 return o}
async function turnDay(){const p=ph(),F=G.flags;if(p>=3){await said(TEXT.restDone);return}
 if(p===0&&!F.checkin){await said(TEXT.turnToft);return}
 if(p===2&&townClues()<3){await said(TEXT.turnClues,{n:townClues()});return}
 if(p===2&&!F.deduce){await said(TEXT.turnDeduce);return}
 const r=await ask('',TEXT.turnQ[p]+' '+TEXT.turnClose[p],TEXT.turnOpts,NOT_YET);if(r!==0)return;
 await fade(1);F.ph=p+1;await play(TEXT.rested[p]);await rest(1);goMap('motel',3,6,'down');banner(TEXT.phase[p+1]);checkpoint();await fade(0);
 if(F.ph===1)await trigger('night')}

// ================= MAIN STREET AND THE MOTEL =================
async function talkOrvel(){const F=G.flags;await play(F.orvel?TEXT.orvelAfter:TEXT.orvel1);if(!F.orvel){F.orvel=1;await said(TEXT.orvelGive);await pickup('cigs');checkpoint()}}
function coopOpts(){const N=isNight();if(has('roll'))return[];
 if(N&&ph()===1)return[{use:'sweep',ok:()=>findRoll([...TEXT.coopSweep,...TEXT.coopFind]),fail:()=>said('Grain receipts. A lot of grain receipts.')},
  {use:'force',ok:()=>findRoll([...TEXT.coopSweep,...TEXT.coopFind]),fail:()=>said('The lock holds.')}];
 return[{use:'crack',ok:()=>findRoll([...TEXT.coopCrack,...TEXT.coopFind]),fail:()=>said('VOSS GUEST wants a password. ODESSA900 doesn\'t work. You try it nine more times.')},
  {use:'force',ok:async()=>{await said(TEXT.coopForce);await findRoll([...TEXT.coopSweep,...TEXT.coopFind]);G.flags.forced=1;await overstepHere('seen')},fail:()=>said('The co-op\'s door was built by people who expected you.')}]}
async function findRoll(lines){await play(lines);clue('roll',TEXT.cRoll);checkpoint()}
// the night men (a human story fight, 2 skulls): Lean on them or the cash ends it before it starts
async function talkNightMen(){const F=G.flags;
 if(!F.nm1){F.nm1=1;await play(TEXT.nm1)}
 await hotspot({name:TEXT.nmName,look:TEXT.nmLook,opts:[
  {use:'lean',ok:async()=>{F.night='talked';await play(TEXT.nmLean);G.M=buildMain();checkpoint()},fail:async()=>{await said('They look at each other. The tire iron stops tapping.');await fightNightMen()}},
  {item:'cash',label:TEXT.nmCash,run:async()=>{F.night='paid';await play(TEXT.nmCashed);G.M=buildMain();checkpoint()}},
  {label:TEXT.nmWalk,run:fightNightMen}]},'nightmen')}
async function fightNightMen(){const F=G.flags;const r=await battle(['nightman','nightman'],{story:true,intro:TEXT.nmIntro});if(r==='lose')return gameOver();
 F.night='fought';await play(TEXT.nmDone);G.M=buildMain();checkpoint()}
function room7Opts(){if(has('room7'))return[];const F=G.flags;return[
 {use:'paper',label:TEXT.r7Paper,ok:async()=>{await play(TEXT.r7PaperDo);await enterRoom7()},fail:()=>said('The register\'s a mess of cash receipts. The spare key\'s hook is empty.')},
 {use:'creds',label:TEXT.r7Creds,ok:async()=>{await play(TEXT.r7CredsDo);await enterRoom7()},fail:()=>said('Bev\'s speaker clicks off. She\'s at the fair.')},
 {use:'sneak',label:TEXT.r7Sneak,ok:async()=>{await said(TEXT.r7SneakDo);await enterRoom7()},fail:()=>said('The maid sees you. She says something in Spanish that is clearly about your mother.')},
 {item:'cash',label:TEXT.r7Cash,run:async()=>{await said(TEXT.r7CashDo);await enterRoom7()}},
 {use:'force',ok:async()=>{F.forced=1;await said(TEXT.r7Force);await enterRoom7();await overstepHere('seen')},fail:()=>said('The door\'s a better door than the motel deserves.')},
 {use:'shoot',ok:async()=>{F.forced=1;await said(TEXT.r7Shoot);await enterRoom7();await overstepHere('public')},fail:()=>said('The round goes into the doorframe. Somebody screams. Nothing opens.')}]}
async function enterRoom7(){await play(TEXT.r7In);await horror(HORRORS.room7);await trigger('liar');clue('room7',TEXT.cRoom7);checkpoint()}
// the stakeout (night 1, from room 6): it costs the night (late +1); the copybook can be lifted while they stand
async function stakeout(){const F=G.flags;F.stake=1;addLate();await fade(1);await play(TEXT.stakeDo);await fade(0);
 let did=false;
 const take=async()=>{did=true;await said(TEXT.stakeGot);await takeBook()};
 await hotspot({name:'ROOM 7',opts:[{use:'sneak',label:TEXT.stakeTake,ok:take,fail:async()=>{did=true;await play(TEXT.stakeMiss)}},
  {use:'sweep',label:TEXT.stakeTake,ok:take,fail:async()=>{did=true;await play(TEXT.stakeMiss)}},{label:'Leave it',run:async()=>{did=true;await said(TEXT.stakeNone)}}]},'stake');
 if(!did)await said(TEXT.stakeNone);
 checkpoint()}
async function takeBook(){const F=G.flags;if(F.book)return;F.book='taken';await pickup('copybook');checkpoint()}

// ================= THE SHERIFF'S OFFICE =================
async function talkToft(){
 const F=G.flags;
 if(!F.checkin){F.checkin=1;await cut('toft',()=>play(TEXT.toft1));checkpoint();return}
 if(ph()===3){await play(TEXT.toftNight);return}
 const n=townClues();
 if(!F.deduce&&n>=3){await play(TEXT.toft3);await deduce();checkpoint();return}
 if(F.deduce){await play(ph()===2?TEXT.toftAfter2:TEXT.toftAfter);return}
 await play(TEXT.toft0,{n});
}
// The deduction (Gameplay loop, Deduction): what are they? Right needs `watch` plus `room7` or `lesson`; Voss needs
// `roll`. Reconstruct (Forensics 75) ties `dead` and `room7` first; INT Hunch offers a hint. A wrong answer costs time
// (late +1) or a better ending, never progress: night 2 opens either way.
async function deduce(){
 const F=G.flags,L=lead();
 if(skillVal(L.a,'Forensics')>=75&&has('dead')&&has('room7')&&!G.fs.used.recon){G.fs.used.recon=1;
  const o=SR.pct(chanceOf(L,'Forensics'));await say('',resultLine('RECONSTRUCT · FORENSICS',o),{auto:1100});if(o.ok)await said(TEXT.reconOk);else tried(L,'Forensics')}
 else await hunch(TEXT.hunch);
 const right=()=>has('watch')&&(has('room7')||has('lesson'));
 let r=await ask('SHERIFF TOFT',TEXT.toftAsk,TEXT.toftOpts);
 // Loose thread (an arc perk, spec 008): once per case, a wrong answer costs nothing and you can answer again
 const lt=!(r===1&&right())&&live().find(m=>perkOn(m,'truth'));
 if(lt){await say('',fillT(BLS.HOMEW.perkUsed,{p:BLS.HOMEW.perks.truth[0],n:lt.name}));r=await ask('SHERIFF TOFT',TEXT.toftAsk,TEXT.toftOpts)}
 if(r===1&&right()){F.deduce='right';await play(TEXT.toftRight)}
 else if(r===1){F.deduce='noproof';await play(TEXT.toftNoProof)}
 else if(r===2&&has('roll')){F.deduce='voss';F.vossSpooked=1;await play(TEXT.toftVoss)}
 else if(r===2){F.deduce='noproof';await play(TEXT.toftNoVoss)}
 else{F.deduce='wrong';addLate();await play(TEXT.toftWrong)}
}
// Deputy Brandt: a liar (Paranoia). Read or Calm gets the glasses story out of him; no clue, a warning.
async function talkCal(){const F=G.flags;await trigger('liar');
 if(F.calTold){await play(TEXT.calAfter);return}
 if(!F.cal1){F.cal1=1;await play(TEXT.cal1)}
 const tell=async()=>{F.calTold=1;await play(TEXT.calRead);checkpoint()};
 await hotspot({name:'DEPUTY BRANDT',look:()=>play(TEXT.calLook),opts:[{use:'read',mod:toftMod,ok:tell},{use:'calm',mod:toftMod,ok:tell},{use:'talk',mod:toftMod,ok:tell},
  {item:'cash',label:'Offer him the cash',run:async()=>{await said(TEXT.calCash);await tell()}}]},'cal')}
function cabinetOpts(){if(has('roll'))return[];
 if(chiefToday())return[{use:'creds',ok:async()=>{await stepBack1();await findRoll(TEXT.cabFind)},fail:()=>said('Toft sips her coffee. The cabinet stays shut.')},
  {use:'talk',mod:toftMod,ok:()=>findRoll(TEXT.cabFind),fail:()=>said('Toft shakes her head. She means it.')}];
 return[{use:'paper',ok:()=>findRoll(TEXT.cabFind),fail:()=>said('Permits. Dog licenses. A complaint about a rooster from 2009 that is still open.')}]}
async function stepBack1(){const s=loadSeason();if((s.overstep|0)>0){s.overstep--;store.set(seasonKey(),s)}}

// ================= THE DINER =================
async function talkRhonda(){const F=G.flags;
 if(F.rhondaGive&&F.rhondaRead){await play(TEXT.rhondaAfter);return}
 if(!F.rhonda1){F.rhonda1=1;await play(TEXT.rhonda1)}
 await play(TEXT.rhondaM);
 if(!F.rhondaGive){F.rhondaGive=1;await said(TEXT.rhondaGive);await pickup('gmcoffee');checkpoint()}
 if(!F.rhondaRead&&teamHas('Empathy',40))await hotspot({name:'RHONDA',opts:[{use:'read',once:'rhondaRead',ok:async()=>{F.rhondaRead=1;await play(TEXT.rhondaRead)}}]},'rhonda');
}

// ================= ELM AND THIRD =================
async function elmArrive(){const F=G.flags;
 if(ph()===0&&!F.heads){F.heads=1;await cut('heads',()=>play(TEXT.heads));await horror(HORRORS.heads);checkpoint()}
 // night 1: one of them takes its glasses off (Severe, for all three), then the Understudies come out of the Grissom house
 if(ph()===1&&!F.understudies){
  await cut('glasses',()=>play(['The two men stand on the curb in the dark. The Peck house has one light on upstairs.','Mr. Doe takes off its glasses to clean them, slowly, with a white handkerchief.',
   'There\'s nothing under them. Not eyes. Not holes. The face just keeps going, smooth, like the back of a hand.','It puts the glasses back on and nods to you. Behind you, the Grissom house\'s screen door bangs open.']));
  G.mode='scene';await horror(HORRORS.glasses);G.mode='world';if(!party.some(m=>!m.gone))return;
  await cut('understudies',()=>play(['Two shapes come down Hal Grissom\'s porch steps in suits that don\'t fit. Their faces are drawn on.','They stop on the curb, exactly where the men stand, and tilt their heads the same way.']));
  const r=await battle(['understudy','understudy'],{story:true,intro:'The Understudies shuffle forward!'});if(r==='lose')return gameOver();
  F.understudies=1;await play(['Two empty suits on the curb, and two heaps of grain dust that smell like the co-op.',['MR. DOE','Those were practice. Thank you for your patience.'],['MR. ROE','...patience.']]);checkpoint()}}
async function talkMen(){const F=G.flags,N=isNight();
 await hotspot({name:TEXT.menName,look:()=>play(N?TEXT.menNight:TEXT.menLook),opts:[
  {label:TEXT.menAsk,once:'menAsk',run:()=>play(TEXT.menAnswer)},
  {label:TEXT.menRude,once:'menRude',run:()=>play(TEXT.menRudeDo)},
  {label:TEXT.menGun,once:'menGun',run:async()=>{F.gun=1;await play(TEXT.menGunDo);await overstepHere('seen')}}]},'men')}
function blackCarOpts(){const F=G.flags,day=!isNight(),c=has('car');
 const got=async lines=>{await play(lines);clue('car',TEXT.cCar);checkpoint()};
 return[
  {use:'examine',show:()=>!c,ok:()=>got(TEXT.carExam),fail:()=>said('Warm metal. Black paint. Nothing you can name.')},
  {use:'crack',label:TEXT.carPlates,show:()=>!c,ok:()=>got(TEXT.carCrack),fail:()=>said('The plate database times out. Then it times out again, politely.')},
  {use:'fix',label:TEXT.carHood,show:()=>!c,ok:()=>got(TEXT.carHoodDo),fail:()=>said('The hood latch won\'t find your fingers.')},
  {use:'sweep',show:()=>!c,ok:async()=>{await got(TEXT.carSweep);if(day)await overstepHere('seen')},fail:()=>said('Locked. Every door. You didn\'t see them lock it.')},
  {use:'force',label:TEXT.carTrunk,show:()=>!c,ok:async()=>{await got(TEXT.carTrunkDo);if(day)await overstepHere('seen')},fail:()=>said('The trunk doesn\'t give. Your shoulder does.')},
  {item:'camera',label:TEXT.carPhoto,show:()=>!F.photo,run:async()=>{F.photo=1;await said(TEXT.carPhotoDo)}}]}
// the Pecks: Jolene is a liar about Tanner (Paranoia); Tanner tells you straight (kids notice first)
async function talkJolene(){const F=G.flags,p=ph();await trigger('liar');
 if(p===3){await play(F.kept?TEXT.joleneKept:F.tannerWait?TEXT.joleneLost:TEXT.joleneNight);return}
 if(F.joleneTold){await play(p===2?TEXT.joleneFair:TEXT.joleneAfter);return}
 if(!F.jolene1){F.jolene1=1;await play(TEXT.jolene1)}
 const tell=async()=>{F.joleneTold=1;await play(TEXT.joleneTruth);clue('watch',TEXT.cWatch);checkpoint()};
 await hotspot({name:'JOLENE',look:()=>play(TEXT.joleneLie),opts:[{use:'read',mod:talkMod,ok:tell},{use:'calm',mod:talkMod,ok:tell},{use:'talk',mod:talkMod,ok:tell}]},'jolene')}
async function talkTanner(){const F=G.flags;if(F.tanner1){await play(TEXT.tannerAfter);return}F.tanner1=1;await play(TEXT.tanner1);clue('watch',TEXT.cWatch);checkpoint()}
// the hidden hotspot (Mushrooms): the lesson in the air, a clue (rules 1 and 2) and an Unsettling horror
async function readLesson(){
 await play(['Where the two men stand, the air is written on. Faint chalk-white handwriting hangs between the curb and the Peck window.',
  '"TANNER. LAUGHS AT: THE DOG. HIS MOTHER WHEN SHE IS TIRED. HIS OWN NAME SAID WRONG."','Below it, ruled lines, waiting. And at the bottom: "TO BE LEARNED BY: SUNDAY, IN SLEEP."']);
 await horror(HORRORS.lesson);
 if(!has('lesson')){clue('lesson','Where the men stand, the air holds a lesson: Tanner, written down as they watch him, "to be learned by Sunday, in sleep."');checkpoint()}}

// ================= THE MORGUE =================
async function talkDoc(){const F=G.flags;
 if(has('dead')){await play(TEXT.docAfter);return}
 if(!F.doc1){F.doc1=1;await play(TEXT.doc1)}
 if(chiefToday()){await play(TEXT.docChief);
  await hotspot({name:'DR. ABERNATHY',opts:[{use:'creds',ok:async()=>{await stepBack1();await findDead(TEXT.docTalk)},fail:()=>said('She shakes her head.')},{use:'talk',mod:talkMod,ok:()=>findDead(TEXT.docTalk),fail:()=>said('She shakes her head.')}]},'doc');return}
 await hotspot({name:'DR. ABERNATHY',opts:[{use:'talk',mod:talkMod,ok:()=>findDead(TEXT.docTalk),fail:()=>said('She looks at you a long time. "Come back when you\'ve got a question I can answer."')}]},'doc')}
async function lookDrawers(){await said(TEXT.drawersLook);if(chiefToday()&&!has('dead'))return;await play(TEXT.drawersOpen);await horror(HORRORS.smiles)}
function drawerOpts(){if(has('dead')||chiefToday())return[];return[
 {use:'examine',mod:morgueEye,ok:()=>findDead(TEXT.drawersExam),fail:()=>said('Old skin, cold steel. You can\'t make it say anything.')},
 {use:'sweep',ok:()=>findDead(TEXT.drawersSweep),fail:()=>said('Wallets, keys, a church bulletin. Nothing that wasn\'t theirs.')}]}
async function findDead(lines){await play(lines);clue('dead',TEXT.cDead);checkpoint()}

// ================= ARLEN VOSS =================
// a liar about everything (Paranoia). Once you hold the roll or room 7's page, you can get the deal out of him.
async function talkVoss(){const F=G.flags;await trigger('liar');
 if(has('deal')){await play(TEXT.vossAfter);return}
 if(!F.voss1){F.voss1=1;await play(TEXT.voss1)}
 if(!(has('roll')||has('room7'))){await play(TEXT.vossLie);return}
 const m=()=>talkMod()-(F.vossSpooked?20:0),got=async()=>{await play(TEXT.vossDeal);clue('deal',TEXT.cDeal);checkpoint()};
 await hotspot({name:TEXT.vossName,look:()=>play(TEXT.vossLie),opts:[{use:'lean',mod:m,ok:got},{use:'calm',mod:m,ok:got},{use:'identify',label:TEXT.vossNameIt,ok:got},
  {item:'recorder',label:TEXT.vossTape,show:()=>has('watch'),run:async()=>{await play(TEXT.vossTapeDo);await got()}}]},'voss')}

// ================= THE FAIR =================
async function talkDusty(){const F=G.flags;if(isNight()){await play(TEXT.dustyNight);return}
 if(!F.dusty1){F.dusty1=1;await play(TEXT.dusty1)}else if(G.fs.used['opt:tea']){await play(TEXT.dustyAfter);return}
 await hotspot({name:'DUSTY',opts:[{use:'talk',label:TEXT.dustyTeaOpt,once:'tea',ok:async()=>{await play(TEXT.dustyTea);await pickup('shrooms')},fail:()=>said('Dusty doesn\'t know anything about any tea. Dusty has never heard the word tea.')},
  {item:'cash',label:TEXT.dustyCash,show:()=>!G.fs.used['opt:tea'],run:async()=>{G.fs.used['opt:tea']=1;await play(TEXT.dustyTea);await pickup('shrooms')}}]},'dusty')}
async function fairArrive(){const F=G.flags;
 if(ph()!==3||F.fair2)return;F.fair2=1;
 await cut('fair2',()=>play(TEXT.fair2));await play(TEXT.joleneNight);
 // the fair intel (spec 013): the Lantern Box shows on the map; Search's On guard (75) spots the ushers' beats
 if(intelOn('fair'))setTrail([[5,21]],'path');
 const L=lead();if(skillVal(L.a,'Search')>=75&&!G.fs.used.onguard){G.fs.used.onguard=1;const o=SR.pct(chanceOf(L,'Search'));
  await say('',resultLine('ON GUARD · SEARCH',o),{auto:1000});
  if(o.ok){setTrail(G.M.roamers.flatMap(r=>r.path),'beat');await said(TEXT.fairOk)}else{tried(L,'Search');await said(TEXT.fairFail)}}
 checkpoint()}
async function lookWheel(){const F=G.flags;
 if(F.kept||F.tannerWait){await said('The Ferris wheel, stopped, every car empty.');return}
 await play(TEXT.tannerSeen);await horror(HORRORS.tanner)}
// Tanner on the wheel (motivation moment: Protect the innocent). Free when the deduction was right or the lesson was
// seen and the team isn't late; otherwise a roll, each skill once. Waiting it out loses `kept`, never progress.
function wheelOpts(){const F=G.flags;if(F.kept||F.tannerWait)return[];
 const free=(F.deduce==='right'||has('lesson'))&&late()<2;
 const o=free?[{label:TEXT.tannerFree,run:async()=>{await play(TEXT.tannerFreeDo);await keepTanner()}}]:[
  {use:'climb',label:TEXT.tannerClimb,once:'wClimb',ok:async()=>{await said(TEXT.tannerClimbDo);await keepTanner()},fail:()=>play(TEXT.tannerFail)},
  {use:'talk',label:TEXT.tannerTalk,once:'wTalk',ok:async()=>{await said(TEXT.tannerTalkDo);await keepTanner()},fail:()=>play(TEXT.tannerFail)},
  {use:'calm',label:TEXT.tannerCalm,once:'wCalm',ok:async()=>{await said(TEXT.tannerCalmDo);await keepTanner()},fail:()=>play(TEXT.tannerFail)}];
 o.push({label:TEXT.tannerWait,run:async()=>{F.tannerWait=1;await play(TEXT.tannerWaitDo);G.M=buildFair();checkpoint()}});
 return o}
async function keepTanner(){const F=G.flags;F.kept=1;await play(TEXT.tannerKept);for(const m of holdersOf('Protect the innocent'))await motivate(m);G.M=buildFair();checkpoint()}
async function openBox(){await lanternBox('fair',['roadflare','flashbang','firstaid'],TEXT.hayBox);if(G.fs.trail&&G.fs.trail.fair)delete G.fs.trail.fair.path;G.M=buildFair()}
// fire in the crowd (Overstepping): a Loud fight on the fairground on night 2 is public
async function crowdCheck(){if(ph()===3&&G.fs.lastLoud){G.fs.lastLoud=0;await said(TEXT.crowd);await overstepHere('public')}}
// Voss at the grandstand steps: let him sit, cuff him (Toft does it if she's helping; else it's seen), or make him
// tear up his copy of the deal (needs `deal`; weakens the boss)
async function talkVossNight(){const F=G.flags;await trigger('liar');
 if(F.voss){await said('Arlen Voss sits on the grandstand steps with his hat in his hands.');return}
 await play(TEXT.vossNight);
 const tear=async()=>{F.voss='torn';await play(TEXT.vossTearDo);checkpoint()};
 await hotspot({name:TEXT.vossName,opts:[
  {label:TEXT.vossSit,run:async()=>{F.voss='sat';await play(TEXT.vossSitDo);checkpoint()}},
  {label:TEXT.vossCuff,run:async()=>{F.voss='cuffed';if(toftHelps())await play(TEXT.vossCuffToft);else{F.cuffSelf=1;await said(TEXT.vossCuffSelf);await overstepHere('seen')}checkpoint()}},
  {use:'records',label:TEXT.vossTear,show:()=>has('deal'),ok:tear,fail:()=>said('He holds the page and can\'t make his hands do it.')},
  {use:'identify',label:TEXT.vossTear,show:()=>has('deal'),ok:tear,fail:()=>said('You say the words. They don\'t land. He holds on to the page.')},
  {use:'lean',label:TEXT.vossTear,show:()=>has('deal'),ok:tear,fail:()=>said('He holds the page against his chest like a kid with a report card.')}]},'vossNight')}

// ================= UNDER THE GRANDSTAND =================
function readOpts(){const F=G.flags;if(F.book!=='taken')return[];
 const read=async()=>{F.book='aloud';await play(TEXT.aloudDo);checkpoint()};
 return[{use:'records',label:TEXT.aloud,ok:read,fail:()=>said(TEXT.aloudFail)},{use:'identify',label:TEXT.aloudId,ok:read,fail:()=>said(TEXT.aloudFail)},
  // motivation moment (Find the truth): no roll, but reading the dead aloud costs the lead a horror
  {label:TEXT.aloudTruth,show:()=>holdersOf('Find the truth').length>0,run:async()=>{await read();await horror(HORRORS.aloud);for(const m of holdersOf('Find the truth'))await motivate(m)}}]}
function deskOpts(){const F=G.flags;if(F.book)return readOpts();return[
 {use:'sneak',label:TEXT.bookTake,ok:async()=>{await said(TEXT.bookGot);await takeBook()},fail:()=>play(TEXT.bookMiss)},
 {use:'sweep',label:TEXT.bookTake,ok:async()=>{await said(TEXT.bookGot);await takeBook()},fail:()=>play(TEXT.bookMiss)},
 {label:TEXT.bookTake,show:()=>!teamHas('Stealth',40)&&!teamHas('Search',40),run:async()=>{await said(TEXT.bookGot);await takeBook()}}]}
// The boss waits for you (Gameplay loop; play.md): Go in / Not yet, cursor on Not yet
async function bossAsk(){const F=G.flags;if(F.boss)return;
 if(!F.menUnder){F.menUnder=1;await play(TEXT.menUnder)}
 const r=await ask('',TEXT.bookQ,TEXT.bossOpts,NOT_YET);
 if(r===0)return bossFight();
 if(G.y===3)StudioMove.place(G,G.x,5,'down')}
// The Graduate (Bosses; Combat numbers; tuned Nov 23, 2026 with tools/boss-sim.js). 64 HP; −8 if Tanner was kept,
// −8 if the copybook was read aloud, −6 if Voss tore up his copy (42 with all three). Phase 1, polite: 60% to hit; a
// reach (5), the class roll at everyone (2), Hal's laugh (1, 1/1d4; with the copybook taken, a turn spent feeling for its notes), Mimic (1: a
// teammate loses their next turn) unless Tanner was kept. Phase 2 at half: +5% to hit, two more class rolls and one
// more reach, and it heals 8 unless the copybook was read aloud. The lesson on the curb makes Identify free.
async function bossFight(o={}){
 const F=G.flags;F.bossSeen=1;
 await cut('boss',async()=>{await play(TEXT.boss1);await said(TEXT.bossSay);await said(TEXT.bossSay2);if(F.kept)await said(TEXT.bossKept);if(F.book)await said(TEXT.bossBook)});
 checkpoint();
 const E=EN.graduate,kept=!!F.kept,aloud=F.book==='aloud',book=!!F.book,torn=F.voss==='torn';
 E.moves=[['hit',5],['all',2],book?['stall',1]:['san',1]].concat(kept?[]:[['mimic',1]]);
 E.acts={mimic,stall:async()=>bsay(TEXT.bossStall,1300)};
 E.phase2={at:.5,hit:5,moves:{all:2,hit:1},line:TEXT.bossPhase,on:async e=>{if(aloud){await bsay(TEXT.bossNoHeal,1300);return}const h=Math.min(8,e.mhp-e.hp);e.hp+=h;await bsay(fill(TEXT.bossHeal,{n:h}),1300)}};
 const cuts=(kept?8:0)+(aloud?8:0)+(torn?6:0),hp=E.hp-cuts;
 const r=await battle(['graduate'],{boss:true,hp,intro:TEXT.bossIntro,onStart:async()=>{
  if(cuts)await say('',TEXT.bossThin,{auto:1500});
  if(has('lesson')){G.fs.ident=G.fs.ident||[];if(!G.fs.ident.includes('en:graduate'))G.fs.ident.push('en:graduate');await say('',TEXT.bossIdent,{auto:1600})}}});
 if(r==='lose')return gameOver();
 if(o.noEnd)return;  // the simulator stops at the fight's end
 F.boss=1;await ending();
}
// Mimic: it speaks in the lead's voice and tells a teammate to hold; that agent loses their next turn
async function mimic(e){const L=lead(),ts=party.filter(m=>!m.ko&&!m.dead&&!m.gone&&!m.out),t=pick(ts.filter(m=>m!==L))||pick(ts);
 if(!t)return;await bsay(fill(TEXT.mimic,{n:L.name,t:t.name}),1400);t.skip=1}
window.gmBoss=()=>bossFight({noEnd:true});  // the boss simulator's entry (tools/boss-sim.js)

// ================= OVERSTEPPING (Skills and menus, Overstepping and cover stories) =================
// An open case: the agents came with badges, and Toft is the Local chief from the first scene. A climb plays its line,
// then the step's scene: Toft takes the badge talk off the table for the day (Persuade −20 in town, the morgue and the
// cabinet need Credentials), Big Hat's call (Agency call), and the clean-up crew at the next area change.
async function overstepHere(seen){if(!(await overstep(seen)))return;await stepScene()}
async function stepScene(){
 const F=G.flags,s=stepName();
 if(s==='Local chief'&&!F.chief){F.chief=1;F.chiefPh=ph();await play(TEXT.chief)}
 if(s==='Agency call'&&!F.call){F.call=1;await play(TEXT.call)}
 if(s==='Federal agents')F.fedsDue=1;
 checkpoint()}
async function onArea(){await feds(TEXT,play)}

// ================= ENDING =================
// clean: the Graduate unmade, Tanner kept, nobody on the team lost this case, overstepping below Agency call.
// costly: unmade any other way. (worst: only in debrief saves from before Nov 24, 2026, when the clean-up crew shut a case down.)
const lostHere=()=>(store.get(B.key('memorial'),[])||[]).filter(x=>x&&x.case===G.case&&!x.done);
function endingLabel(){const F=G.flags;
 return(F.kept&&!lostHere().length&&!stepAt('Agency call'))?'clean':'costly'}
function endingFacts(label){const F=G.flags;
 return{label,clues:G.clues.map(c=>c.id),saved:F.kept?1:0,overstep:stepName(),
  san:party.map(m=>({id:m.a.id,name:m.name,from:m.san0,to:m.san})),
  items:party.flatMap(m=>gearOf(m).it.filter(it=>it.pin).map(it=>it.k)).concat((G.fs.pack||[]).filter(it=>it.pin).map(it=>it.k)),
  choices:{deduce:F.deduce||null,kept:!!F.kept,book:F.book||null,voss:F.voss||null,night:F.night||null,stake:!!F.stake,forced:!!F.forced,cuffSelf:!!F.cuffSelf,photo:!!F.photo,late:late(),county:!!F.county},
  tried:party.map(m=>({id:m.a.id,skills:m.tried||[]})),
  lost:lostHere().map(x=>({name:x.name,how:x.how}))}}
async function ending(){
 const F=G.flags;
 await play(TEXT.end1);if(!F.book){F.book='dropped';await said(TEXT.bookDrop);await pickup('copybook')}
 if(!F.kept)await trigger('death')
 await fade(1);G.mode='scene';await fade(0);
 await said(TEXT.dawn);await said(F.kept?TEXT.dawnKept:TEXT.dawnLost);if(F.voss==='torn'||F.voss==='cuffed')await said(TEXT.dawnVoss)
 G.rescued=F.kept?1:0;
 const label=endingLabel();await debrief(label,endingFacts(label));  // Big Hat's debrief and the case gains (debrief.js)
}

// ================= THE DEBRIEF (spec 007) =================
// The clues the card counts, the one person to keep safe (Tanner), Big Hat's lines by ending and about the choices, the
// cover stories (2 with a skill, the weak Luck one, the Camera's, Clean books'), and the line after the copybook is bagged.
const DB=TEXT.db;
const DEBRIEF_DATA={
 clues:['dead','watch','room7','car','roll','deal','lesson'],victims:1,
 lines:{clean:DB.clean,costly:DB.costly,worst:DB.worst},
 react:F=>{const c=F.choices||{},out=[];if(c.kept)out.push(DB.kept);if(c.deduce==='wrong')out.push(DB.wrong);if(c.forced)out.push(DB.forced);if(c.cuffSelf)out.push(DB.cuffed);
  if(c.night==='fought')out.push(DB.fought);if(c.stake)out.push(DB.stake);return F.label==='worst'?out.slice(0,1):out.slice(0,2)},
 zip:[DB.zip],end:[TEXT.funnel],
 stories:[{name:DB.gen,skill:'Bureaucracy',verb:'paper it',pass:DB.genPass},
  {name:DB.grift,skill:'Persuade',verb:'sell it',pass:DB.griftPass,get mod(){const f=G.db&&G.db.facts;return f&&(f.clues||[]).includes('deal')?20:0}}],
 weak:{name:DB.weak,pass:DB.weakPass},
 camera:{name:DB.photo,skill:'Persuade',verb:'sell it',mod:20,pass:DB.photoPass,show:F=>!!(F.choices&&F.choices.photo)},
 safe:{name:DB.safe,pass:DB.safePass},
 bagged:{copybook:[TEXT.filed]}
};

// ================= OPENING (Big Hat's briefing in the combine cab) =================
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
 },{place:window.GMA.combine});  // the combine cab (the debrief uses the same place, registerCase place)
 G.flags.ph=0;G.mode='world';goMap('main',8,19,'left');checkpoint();await fade(0);
 await cut('arrive',async()=>{
  for(const m of squad())await say(m.name.toUpperCase()+' · '+profOf(m.a).name.toUpperCase(),TEXT.role[profOf(m.a).role]||TEXT.roleAny);
  await said(TEXT.arrive)});
}
// the Case file's Next line
const caseNext=()=>{const N=TEXT.next,F=G.flags,p=ph(),n=townClues();
 if(F.boss)return N.home;
 if(p===0){if(!F.checkin)return N.toft;if(intelOn('men')&&!has('car'))return N.car;return N.day1.replace('{n}',n)}
 if(p===1)return N.night1;
 if(p===2){if(n<3)return N.day2.replace('{n}',n);if(!F.deduce)return N.deduce;return N.rest2}
 return F.kept||F.tannerWait?N.night2b:N.night2};

// ================= ON THE CASE BOARD =================
// portraits: the townsfolk's and the two men's faces (good-manners-art.js), and the boss's (good-manners-battle-art.js).
// sprite/spriteSize: battle sprites (the head usher wears the usher's; the clean-up agent is Still Harvest's SHB).
const spr=k=>k==='usherhead'?'usher':k;
registerCase({id:'good-manners',card:caseCard,opening:caseOpening,intel:TEXT.intel,maps:MAPS,tiles:{},
 portraits:name=>window.GMA.portraits[name]||(name==='THE GRADUATE'?window.GMB.portrait:null),
 enemies:EN,sprite:(k,f,w)=>k==='fed'&&window.SHB?SHB.sprite('fed',f,w):GMB.sprite(spr(k),f,w),spriteSize:k=>k==='fed'&&window.SHB?SHB.size('fed'):GMB.size(spr(k)),
 backdrop:(p,o)=>GMB.backdrop(p,o),
 get place(){return window.GMA&&GMA.combine},  // Big Hat's place for this case: the briefing passes it, and the debrief plays there too (engine.js casePlace)
 items:CASE_ITEMS,next:caseNext,quiet:false,loot:LOOT,onArea,
 debrief:DEBRIEF_DATA,label:endingLabel,facts:endingFacts});
})();
