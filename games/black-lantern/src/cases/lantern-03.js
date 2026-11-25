// Black Lantern · cases/lantern-03.js
// CASE: LANTERN 03, the season finale (spec 015, over spec 014's frame). SPOILERS for the case live in
// story/cases/lantern-03.md only.
// Parts A and B (Nov 25, 2026): the finale card, every map before and after its one turn, the people on the map and in
// the dialog box, Big Hat's own briefing place, and the story and play written from the secret case file: the text
// block, the briefing's four topics and their edges, skill-driven clues, a deduction on Intake's phone, the night's turn,
// overstepping (a quiet case), two story fights, the night's roamers, a Lantern Box, the boss and its tuning, the
// debrief's facts and cover stories, and the endings. What the season left behind (kept pages, hidden items, what the
// other agency cases did) comes from season.js's arcTally(); anything missing there counts as nothing happened.
// Art is cases/lantern-03-art.js (window.L03A, the maps and people) and cases/lantern-03-battle-art.js (window.L03B,
// the enemies, the boss's face and the battle backdrops), loaded right after this file. Needs engine.js, field.js,
// battle.js and season.js first. The whole file sits in one function so its names never meet another case's.
(function(){

// ================= TEXT =================
// Every line of the case (Voice). A list plays box by box: a plain string is narration, ['WHO', 'line'] is someone
// talking. {code} and {first} are the lead's, with pronoun tokens like {first.they} (Agent creator, Pronouns and body);
// {n}, {m}, {i} and the other one-letter keys are filled by the script.
const TEXT={
 next:{lot:'Get inside the annex. The front doors, or the loading dock.',day:'Look around Records: {n}/3 clues. Then Intake.',phone:'Go to Intake. The phone\'s going to ring.',
  wait:'Midnight. Talk to Ms. Hollis in Intake when you\'re ready.',night:'The lights are out. Down the stacks\' stairs: the sub-basement. He\'s in the cold room.',home:'Get out.'},
 phase:['SUNDAY · 11:40 PM · RECORDS','MONDAY · 12:00 AM · LIGHTS OUT'],
 // ---- the briefing, at a payphone ----
 open1:'SUNDAY · 10:55 PM · 29°F · FIRST SNOW',
 open2:'The payphone in the motel lobby rings. Nobody uses payphones. The night clerk holds it out to you like it\'s a live fish.',
 brief:['A payphone outside a gas station that closed in the spring. The price sign still says $2.89. Snow coming down past the one lamp.',['BIG HAT','Agent {code}. Don\'t say nothin\' yet. Just listen.'],
  'You can hear him breathing on the line, and a truck going by wherever he is, and the snow, somehow.',
  ['BIG HAT','They suspended me Friday. Pendin\' review. Review of what, they didn\'t put down.'],['BIG HAT','So this ain\'t a case. There\'s no folder. Nobody\'s gonna requisition you nothin\'.'],
  ['BIG HAT','Everything you ever filed for me went to one building. Records. Out in Suitland.'],['BIG HAT','I want to know who\'s readin\' it.']],
 briefShout:'IT\'S SUNDAY. I DON\'T DO PAPERWORK ON A SUNDAY.',
 brief1b:['A long pause. Quarters going into the slot.',['BIG HAT','...It\'s Sunday.']],
 briefW:[['BIG HAT','You remember Abel\'s file. The requisition with the W. on it.'],['BIG HAT','I been sittin\' on that a while.']],
 // Big Hat's two questions (spec 013): the four topics, his answer, the Case file's INTEL line. Edges in the scripts:
 // 'records' +10 Bureaucracy at the front doors and the sign-in book, 'w' +10 to turn her, 'internal' the night's
 // roamer beats show, 'boxes' a Molotov in the stock cage's box.
 intel:[
  {id:'records',label:'Records',answer:['Annex out in Suitland. Three floors up, two down. Every box you ever bagged.','Sundays it\'s two guards and a coffee maker. Desk guard\'s Desmond. Tell him a filing emergency. He\'ll like that.'],
   note:'Records on a Sunday: two guards. The desk guard, Desmond, likes paperwork.'},
  {id:'w',label:'The W.',answer:['I know whose initial that is.','I ain\'t sayin\' it on a payphone. You\'ll know her when you see her desk. Be kind to her. She was kind to me.'],
   note:'Big Hat knows who "W." is. Whoever she is, be kind.'},
  {id:'internal',label:'Internal',answer:['Internal Security walks the stacks on four-hour beats. Flashlights, clipboards.','They ain\'t bad people. They do what the paper says. Don\'t give \'em paper.'],
   note:'Internal Security walks the stacks on beats. You\'ll see their routes.'},
  {id:'boxes',label:'The boxes',answer:['Records stocks the Lantern Boxes. Every flare I ever sent you come outta that building.','There\'s a cage in the stacks. Take what you want. Put it on my tab. I don\'t have a tab.'],
   note:'Records stocks the Lantern Boxes, in a cage in the stacks. Something extra in it.'}],
 brief2:[['BIG HAT','You\'re not on the books. You go in quiet. You\'re agents with a filin\' emergency, which is true.'],
  ['BIG HAT','Nobody\'s requisitionin\' you nothin\'. Whatever you need is in that building.']],
 brief3:[['BIG HAT','If this goes wrong I never called you. If it goes right I never called you either.'],['BIG HAT','...Go on.'],'Click. The dial tone, and the snow.'],
 arrive:'LANTERN 03. Talk to people with A. Press START for your notebook and party.',
 role:{Investigator:'Our own evidence locker. I always wanted to see where it all goes.',Healer:'If he\'s suspended, who\'s signing for us if we get hurt?',
  Analyst:'Federal records retention is seventy-five years. Somebody planned on keeping this.',Vanguard:'Breaking into our own building. Fine. Fine.',Lorekeeper:'Archives are full of things somebody wanted forgotten. That\'s what archives are for.',
  Tech:'Badge readers, maglocks, cameras. Government contractor stuff. Low bidder.',Bruiser:'Cinder block. I hate cinder block. You can\'t punch cinder block.',Support:'Everybody stamp the snow off. We\'re guests. Sort of.',
  Tracker:'Fresh snow. Two sets of tire tracks in, none out. Somebody\'s still in there.',Confessor:'Every case we closed ended up in there. That\'s a lot of people\'s worst night in cardboard.',
  Courier:'I\'ve dropped boxes at the dock here. Never once got a signature from a person.',Undertaker:'Records is where we bury the paperwork. Same as my job, just drier.',Scrapper:'Nice building. Ugly. Nice.',Morale:'Anybody else get a "last day of school" feeling? No? Just me.'},
 roleAny:'Let\'s see who\'s reading it.',
 // ---- the lot ----
 edge:'The van\'s right there. Big Hat said go in. You don\'t get to not go in.',
 annex:'RECORDS ANNEX 9. Cinder block, painted the color of a filing cabinet. Every window on the ground floor has a grille.',
 doorsQ:'The front doors: wired glass, locked. A buzzer, and through the glass a man at a desk doing a crossword in pen.',
 buzz:'Ring the buzzer',
 buzzTalk:[['DESMOND','Annex is closed. It\'s Sunday. It\'s been Sunday since this morning.']],
 doorsPaper:'Hold up a filing emergency',doorsCreds:'Show your credentials',doorsTalk:'Talk him into it',
 doorsPaperDo:['You hold an evidence transfer form flat against the glass. Desmond reads it from his chair. Then he gets up and reads it closer.',['DESMOND','A filing emergency. On a Sunday.'],['DESMOND','...I\'ve been waiting twenty-nine years for one of these.'],'The lock buzzes.'],
 doorsCredsDo:['You press your ID to the glass. He looks at it, then at you, then at the snow on your shoulders.',['DESMOND','Black Lantern. Field.'],['DESMOND','We don\'t get field. Field doesn\'t come here. Come in before you freeze.']],
 doorsTalkDo:[['DESMOND','You\'re Hat\'s people.'],['DESMOND','He called me Friday. Said if anybody came by I should let \'em freeze a little first. You froze a little.'],'The lock buzzes.'],
 doorsNo:[['DESMOND','Nice try. It\'s still Sunday.'],'He goes back to his crossword. Seven down.'],
 doorsGive:['After a while the lock buzzes on its own. Desmond leans on the door.',['DESMOND','You\'ve been out there twenty minutes. It\'s twenty-nine degrees. I\'m not doing the paperwork on a frozen fed.'],['DESMOND','In. And I didn\'t see you.']],
 doorsOpen:'The front doors. Desmond buzzes you through without looking up.',
 dock:'LOADING DOCK',dockLook:'The loading dock. A steel roll-up door, and a keypad with a camera on it. RECORDS DELIVERIES ONLY · MON–FRI.',
 dockCrack:'Crack the keypad',dockFix:'Pull the panel and short it',dockForce:'Put the roll-up door off its track',dockClimb:'Go up through the vent over the door',
 dockCrackDo:'The keypad wants six digits. Somebody\'s used the same ones so long the paint\'s worn off four keys. You get it on the third try.',
 dockFixDo:'You take the cover off with a dime. Two wires, one guess. The door rolls up to your knees and stops. Good enough.',
 dockForceDo:'The roll-up door comes off its track with a sound like a car wreck in a church. The camera watches the whole thing.',
 dockClimbDo:'The vent over the dock door is a tight squeeze and smells like forty years of exhaust. You come out on top of a shelf in the stacks.',
 dockFail:'The keypad blinks red at you. It has all night.',
 dockOpen:'The loading dock. It\'s open now. Your secret.',
 dumpster:'DUMPSTER',dumpsterLook:'A green dumpster under the snow. CONFIDENTIAL · SHRED ONLY, stenciled on it. Nobody shreds on Sunday.',dumpsterSweep:'Go through the shred bags',
 shredDo:['Clear bags of paper strips, bound for the shredder company Monday. They didn\'t get to these.','You pull a handful. It\'s a report. Your report. Your words, your typos.',
  'In the corner of every page, in pencil, in a neat old hand that isn\'t yours: a number.'],
 cShred:'Shredded copies of your own reports from the dumpster. Every page has a number on it in pencil, in somebody\'s neat old hand.',
 shredFail:'Strips of paper, and snow. You get a lot of snow.',
 van:'The van, snowing over. Somebody wrote WASH ME on the back window, then BETTER YET DON\'T.',
 payphone:'A payphone on the fence. The cord\'s been cut. Somebody taped a note to it: OUT OF ORDER SINCE 1997.',
 pole:'A light pole at the far edge of the lot. Its lamp is out.',
 tall:['Out at the far edge of the lot, under the dead light, a tall man in a long dark coat is standing in the snow with a book under his arm.',
  'His eyes are shut. His face turns with you anyway, the way a flower follows the sun.','You look down to step over a curb. When you look up he isn\'t there. The snow where he stood is still smooth.'],
 tallH:'The tall man at the edge of the lot',
 // ---- the lobby ----
 lobbyIn:['The lobby smells like floor wax and burnt coffee. A metal detector nobody\'s plugged in since the nineties.','Desmond\'s desk has a sign-in book on a chain, a radio, and a goldfish in a bowl.'],
 desmond1:[['DESMOND','Sign the book. Everybody signs the book. That\'s the whole job, the book.'],'The goldfish turns around in its bowl and looks at you. The bowl says CLEARANCE on it in label tape.'],
 desmondName:'DESMOND',desmondBook:'Ask whose name is in the book every week',desmondAsk:'Ask who else is here tonight',desmondHat:'Ask how he knows Big Hat',
 desmondWho:[['DESMOND','Tonight? Me, Clearance, two of Internal on the stacks, and Ms. Hollis in Intake.'],['DESMOND','Ms. Hollis is here every Sunday. Eleven years. Signs in at six, never signs out.'],['DESMOND','I asked her once. She said, "Catching up on filing, Desmond." Eleven years of catching up.']],
 cSigninDes:'Desmond says Ms. Hollis, in Intake, has signed in every Sunday at six for eleven years and never signs out.',
 desmondHatDo:[['DESMOND','Hat? Hat came up through here same year I did. He had hair.'],['DESMOND','Good hair. Like a game show host.'],['DESMOND','He suspended? ...Huh. Well. They suspended Jesus, too, and look how that worked out.']],
 desmondNo:[['DESMOND','You don\'t want to know about my evening. My evening is seven down.']],
 desmondNoticed:[['DESMOND','I didn\'t see you, and now I\'m going to not see you harder.'],'He turns the radio up. It\'s a ball game from three hours ago.'],
 desmondNight:[['DESMOND','The phones are dead. The radio\'s dead. The goldfish is fine.'],['DESMOND','Whatever you came for, go do it. I\'ll be here not seeing anything.']],
 desmondAfter:[['DESMOND','Clue in seven down is "you, eventually." Five letters.'],'He doesn\'t say what it is. It\'s probably "tired".'],
 book:'SIGN-IN BOOK',bookLook:'The sign-in book, on a chain. A pen on a chain, on the chain.',bookSweep:'Read back through it',bookPaper:'Check it against the duty roster',
 bookDo:['Weeks of names in a column. Mostly nobody, on Sundays. Except one line, every Sunday, in the same neat old hand:','W. HOLLIS · INTAKE · 6:00 PM. Every Sunday for as far back as the book goes. The SIGN OUT box is empty every time.'],
 cSignin:'The lobby sign-in book: W. Hollis of Intake signs in every Sunday at 6 PM and never signs out.',
 bookFail:'A lot of blank Sundays. Your eyes slide off it.',
 fish:'A goldfish in a bowl labeled CLEARANCE. It has a little castle. The castle has a little flag. The flag says RECORDS.',
 detector:'A walk-through metal detector, unplugged. Somebody hung their coat on it.',
 elevator:'The elevator. OUT OF ORDER, on a sign that\'s faded to OUT OF OR.',
 photos:'HANDLERS',photosLook:['A wall of framed photos: HANDLERS OF THE YEAR, black and white, then color.','2014: a woman in a gray cardigan, small and smiling, holding a plaque. W. HOLLIS.','2015: a man in a very big hat, not smiling. He\'s the only one in a hat.'],
 bin:'LOST AND FOUND',binLook:'A cardboard box: LOST & FOUND · CONFISCATED. A scarf, a hymnal, one shoe.',binOpt:'Go through it',
 binFind:'At the bottom, in a sandwich bag tagged CONFISCATED · 1998: dried mushrooms. Nobody ever came back for them.',
 stairsDoor:'The door to the stacks stairwell. STAFF ONLY. It isn\'t locked. Nobody comes here.',
 intakeDoor:'INTAKE',intakeLocked:'The Intake door. Locked tonight: a sign in the watch officer\'s writing says BACK IN 20 MIN. There\'s a light on in there.',
 intakeCreds:'Show your credentials',intakeTalk:'Knock and talk',intakeIn:'You\'re in. The watch officer\'s sign falls off the door on its own.',
 lockedDown:'The front doors. Steel shutters have come down behind the glass. The annex is locked down.',
 // ---- Intake ----
 intakeArr:['INTAKE. A small office that smells like tea and wool. Every surface has a stack of paper on it, squared off neat.','A woman at the desk is knitting a gray scarf. It goes off the desk and onto the floor and across the floor and under the filing cabinet.'],
 wren1:[['MS. HOLLIS','Oh! Field. On a Sunday.'],['MS. HOLLIS','Sit, sit. Move the... yes, anywhere. I\'m catching up on filing.'],'She has not filed anything. She has been knitting.'],
 wrenHidden:[['MS. HOLLIS','You kept the {i}.'],['MS. HOLLIS','{w} did, I think. It never came down to Records. Records noticed.'],['MS. HOLLIS','I didn\'t tell anyone. I know what it\'s like to want to keep something.']],
 wrenKept:[['MS. HOLLIS','Pages have gone missing this season. {n} of them.'],['MS. HOLLIS','Upstairs thinks it\'s me.']],
 wrenDay:[['MS. HOLLIS','I do the Sunday intake. Nobody else wants it. It\'s quiet. The boxes come in, I sign for them.'],'She smiles at the scarf.'],
 wrenAsk:'Ask about the scarf',wrenScarf:[['MS. HOLLIS','Eleven years, this scarf. I don\'t know who it\'s for anymore. I just don\'t want to stop.']],
 wrenKnow:[['WREN','So he called you. Of course he called you.'],['WREN','Then you know what I did.'],'She keeps knitting. Her hands know how to do it without her.'],
 wrenMid:[['WREN','He comes at midnight on Sundays. He\'s very punctual. He\'s a gentleman.'],['WREN','You can stay if you want. Nobody ever stays.']],
 stayOpt:'Stay with her till midnight',
 midQ:'Stay with her till midnight?',midClose:'At midnight the annex locks down: the lot and the front doors are out of reach.',turnOpts:['Go on','Not yet'],
 midnight:['The clock over the door gets to twelve. The second hand doesn\'t stop. It just keeps going past it, like it\'s embarrassed.',
  'Every light in the annex goes out at once.','Then, one by one, down the stacks, the red emergency lights. Somewhere under your feet, a big door opens that wasn\'t there this morning.'],
 midnightH:'Every light going out at once',
 wrenNight:[['WREN','He\'s here. He\'s early. He\'s never early.'],['WREN','He knows you came.']],
 wrenTurnQ:'She\'s holding the needles so tight her knuckles are white. You could reach her.',
 wrenShow:'Show her what you saw in the window',wrenLily:'Ask her about Lily',wrenLate:'Tell her it isn\'t too late',
 wrenShowDo:['You tell her what you saw in the window. The sweater. The tag. The gray room with no corners.','She puts the knitting down for the first time all night.',['WREN','Seven.'],['WREN','She was seven. She\'s still...'],
  ['WREN','He said when the book was full. He said when the book was full, all of them.']],
 wrenLilyDo:[['WREN','Lily.'],['WREN','She had a fever that wouldn\'t break. Four days. The doctors stopped saying things to me.'],['WREN','A man sat down next to me in the hospital chapel. He was so polite. He had a book.'],['WREN','I\'d have signed anything. I did.']],
 wrenLateDo:[['WREN','Eleven years. Every page I sent up was somebody.'],['WREN','You think there\'s a way back from that?'],'You tell her there is. You don\'t know if you mean it. She can tell you don\'t know, and that\'s what does it.'],
 wrenFail:[['WREN','No. No, you don\'t understand. If I stop, she stops.'],'The needles start again, faster.'],
 wrenTurned:[['WREN','All right.'],['WREN','All right. I can give you one thing. Only one. He\'ll know.']],
 wrenWhich:'What do you ask her for?',wrenOpts:['His true name','Her own page'],
 wrenName:[['WREN','His name. His real one. It\'s on the first page. Only an account can read it.'],'She writes it on the back of an old library card, slowly, like she\'s afraid of spelling it wrong.',['WREN','Read it out loud where he can hear it. He can\'t stand to be in a room with it.']],
 wrenPage:[['WREN','Mine.'],'She unlocks the filing cabinet with a key from around her neck. In a folder marked HOLLIS, W., one old page, soft as cloth.','"Wren Hollis, for Lily." The ink is eleven years old. She tears it in half. Then in half again. Then she gives it to you anyway.',['WREN','He can\'t hold what isn\'t there.']],
 wrenAfter:[['WREN','Go on. I\'ll be here. I\'m always here.']],
 wrenAfterNo:[['WREN','Go on, then. He\'s waiting. He\'s very patient.']],
 kettle:'KETTLE',kettleLook:'An electric kettle and a tin of tea bags. A mug that says WORLD\'S OKAYEST MOM.',kettleOpt:'Sit a minute',
 kettleDo:['She makes you all tea in the dark, by the light of the emergency sign, without asking how you take it. She gets it right.','Ten minutes. Nobody says anything. It\'s the best ten minutes of the season.'],
 kettleDay:'An electric kettle. Still warm.',
 board:'ROUTING BOARD',boardLook:'A corkboard as big as a door, pins and string and index cards. It looks like Big Hat\'s.',boardSweep:'Read it card by card',
 boardDo:['Every index card is a case. Town, date, a string to a name on the duty roster.','Your cases. All of them. The strings all run to the same place: a card in the middle that just says INTAKE.','Somebody picked every case you ever took. Somebody picked you.'],
 boardH:'Every case you ever took, picked for you',
 cRoutingBoard:'Intake\'s routing board: every case that reached your board was picked here, by hand.',
 boardFail:'Pins, string, index cards. It\'s a lot. You lose it around Ohio.',
 photo:'PHOTO',photoLook:['A school photo in a dime-store frame: a girl of seven on a swing, school-picture blue behind her. Missing a front tooth.','Written on the corner of the frame: LILY · 2015.'],
 cLily:'Ms. Hollis has a daughter, Lily: seven in a school photo dated eleven years ago.',
 cabinet:'FILING CABINET',cabinetLook:'A gray filing cabinet. Locked. H through K.',cabinetForce:'Pop the lock',cabinetFix:'Pick it',
 cabinetDo:['Folders, all squared. One is marked HOLLIS, W. It\'s empty, except for a single paper clip that held something for a long time.'],
 cabinetFail:'Government steel. It\'s seen worse than you.',
 window:'WINDOW',windowLook:'A window onto the stacks. Rows of shelves going back into the dark like a parking garage for paper.',
 lilyName:'THE WINDOW',
 lilyLook:['In the window glass, behind your reflection, in the stacks: a girl of seven, in the sweater from the photo.','She\'s standing in a gray room that has no corners. She\'s holding a paper tag with a number on it. She\'s been holding it a long time.',
  'She looks up at you. She\'s still seven. She\'s been seven for eleven years.'],
 lilyH:'Lily in the window, still seven',
 cPhoto:'In the window, high: Lily, still seven after eleven years, in a gray room, holding a numbered tag. Waiting.',
 phone:'THE PHONE',phoneLook:'A black desk phone with every line lit. Nobody\'s calling on any of them.',phonePick:'Pick it up',
 ring:'The phone on Ms. Hollis\'s desk rings. She doesn\'t pick it up. She looks at it like she knows who it is, and she\'s right.',
 // ---- the deduction, at Big Hat's payphone ----
 hatCall:[['BIG HAT','It\'s me. Don\'t say no names.'],['BIG HAT','I know this number by heart. I used to sit at that desk.']],
 hatAsk:'Who\'s been routin\' my cases?',
 hatOpts:['Internal Security. They wanted us busy.','Ms. Hollis. She signed for her daughter.','Records. The whole office.'],
 hatRight:[['BIG HAT','...'],'Snow on the line. A long time.'],
 hatShout:'WREN.',
 hatRight2:[['BIG HAT','...Wren Hollis had my desk before me. Taught me how to file. Taught me how to lie to a sheriff.'],['BIG HAT','I saw that W. on Abel\'s file and I knew the hand. I didn\'t want to know it.'],
  ['BIG HAT','Paper burns. Whatever he is, he\'s paper. You tell her I said hello.']],
 hatNoProof:[['BIG HAT','That\'s a hell of a thing to say about somebody.'],['BIG HAT','You show me why and I\'ll believe you. Till then it\'s a guess.']],
 hatHalf:[['BIG HAT','An office don\'t sign for nothin\'. A person does.'],['BIG HAT','...Find me the person.'],'Click.'],
 hatWrong:[['BIG HAT','Internal couldn\'t route a pizza.'],['BIG HAT','Look harder. I gotta go, there\'s a state trooper lookin\' at me like I\'m a raccoon.'],'Click.'],
 hunch:'Every Sunday for eleven years. A kid in a frame. Who\'d sign anything for a kid?',
 wrongCost:'Internal. You thought it was Internal. Sitting in the dark, you know better, and knowing it costs you.',
 // ---- the stacks ----
 stacksIn:['THE STACKS. Rows of rolling shelves on rails, cranked shut, with an aisle open here and there like a missing tooth.','Every box has a case number. Some of them are yours.'],
 stacksNight:['The stacks in the emergency lights: red, and then dark, and then red.','Flashlights down the far aisles. Internal Security, sweeping. Nobody told them it\'s Sunday.'],
 nightOk:'You stand still at the end of a row and watch the flashlights. You learn their beats before they learn yours.',nightFail:'A flashlight swings your way and keeps swinging. You don\'t know if it saw you.',
 terminal:'TERMINAL',terminalLook:'A beige terminal on a cart, green text, a cursor blinking. ROUTING · INTAKE · LOGIN:',terminalCrack:'Crack the login',terminalBack:'Go in the back way',
 terminalDo:['The password is LILY2015. Of course it is.','ROUTING LOG. Every case that reached your board in the last year, and the one before, and the one before that.','Routed by INTAKE, by hand, against the duty roster. Your names on the roster. Routed to you on purpose.'],
 cRouting:'Records\' routing log: every case that reached your board was routed by Intake by hand, to you on purpose.',
 terminalFail:'ACCESS DENIED. It says it like it\'s sorry about it.',
 terminalDark:'The terminal\'s screen is dead. The blackout took it.',
 cage:'EVIDENCE CAGE',cageLook:'A chain-link cage of evidence boxes, floor to ceiling. Your case numbers on some of them.',cageSweep:'Go through the boxes',cageExam:'Look at how they were packed',cageOcc:'Look for what doesn\'t belong',
 cageDo:['You open a box. A farm ledger from a corn town. Clipped in the back, a scrap of old paper that isn\'t from that farm, numbered in the corner: 1.',
  'Another box. A book of net-blessings, its flyleaf numbered 4. Another, another. Every case. Every box. One old page, bound in, numbered.',
  'Somebody\'s been collecting a book one page at a time, and you\'ve been the mailman.'],
 cageH:'A page in every box',
 cPages:'In the evidence cage: every case\'s evidence has one old numbered page bound into it. Yours too. You\'ve been delivering them.',
 cageFail:'Boxes, tape, case numbers. It all looks like boxes.',
 cageNight:'The evidence cage. The boxes are open. All of them. They\'re empty.',
 dot:'DOT\'S DESK',dotLook:'A desk at the end of a row, cleared to the wood. A nameplate in the trash: D. FERRELL.',dotSweep:'Check under the drawer',
 dotDo:['Taped under the drawer, a memo sheet with a coffee ring on it, in a round hand:','"She\'s here every Sunday. She talks to somebody in the cold room. If you\'re reading this, I didn\'t get out. —D.F."'],
 cDot:'Dot Ferrell\'s note, under her cleared desk: "She\'s here every Sunday. She talks to somebody in the cold room."',
 dotFail:'An empty drawer. The kind of empty that was done on purpose.',
 stock:'STOCK CAGE',stockLook:'A cage stacked with Lantern Boxes, the agency\'s own, waiting to be shipped. A keypad, a red light.',stockDay:'The stock cage\'s keypad blinks red. The maglock\'s on.',
 stockNight:'The stock cage\'s maglock has failed open with the lights. The door\'s hanging.',stockOpen:'Open a box',
 stockBox:'You crack open a Lantern Box from the top of the stack. A packing slip: QTY 1 · FIELD · ATTN BIG HAT. In his handwriting, under it: "for when."',
 stockEmpty:'You keep the empty Lantern Box. It\'s the agency\'s own: lead-lined, a lantern on the lid. Something about it wants to be closed on something.',
 stairs:'STAIRS DOWN',stairsDay:'The stairs down to the sub-basements. A maglock on the door, red light: RESTRICTED · RECORDS STAFF.',
 stairsQ:'The stairs door hangs open, its maglock dead. Below, a long way down, something big is breathing like a building.',
 dockIn:'The dock door, back out to the lot.',dockShut:'The dock door\'s shutter came down at midnight. Locked down.',
 // ---- the Filing (a story fight in the stacks after midnight, 2 skulls) ----
 filing1:['Down the row, the evidence cage\'s boxes are opening by themselves. Lids lifting like somebody breathing in.','Paper comes out of them. Old paper, the numbered pages, every one, and it stands up in the aisle into the shape of a man.',
  'Folders for shoulders. Evidence tags for teeth. It says, in a voice like a filing cabinet drawer: "RECEIVED."'],
 filingIntro:'The Filing comes down the aisle!',
 filingDone:['The Filing comes apart into a drift of paper, and every page slides along the floor toward the stairs, downhill, like water.','Down there, somebody is expecting them.'],
 // ---- Pruitt and Vale (a story fight on the stairs, 2 skulls) ----
 sec1:['Two flashlights coming up the stairs. Two Internal Security agents in navy blazers, badges on their pockets, one with a clipboard.',['SECURITY','Black Lantern field. You\'re not on the roster tonight.'],['SECURITY','Upstairs says you\'re to be detained. It\'s in writing.']],
 secCreds:'Show them it\'s also in writing',secFight:'Go through them',
 secCredsDo:['You hand over the only paper you\'ve got: a requisition form, filled out in Big Hat\'s handwriting, dated tomorrow.',['SECURITY','...This is signed.'],['SECURITY','Nobody signs anything anymore.'],'They step aside. One of them holds the door.'],
 secCredsFail:[['SECURITY','That\'s a lunch receipt.']],
 secIntro:'Internal Security draws on you!',
 secDone:['Pruitt and Vale are face down on the landing, breathing. Somebody\'s going to fill out a lot of forms about this.'],
 // ---- the sub-basement ----
 baseIn:['SUB-BASEMENT 2. Pipes, a boiler older than the building, an incinerator with its door shut.','At the end of the room, a steel door like a bank vault\'s, stenciled COLD STORAGE. It\'s open an inch. Cold comes out of the inch.'],
 cart:'MAIL CART',cartLook:['A wire mail cart heaped with old pages, loose, each one numbered, tagged OUT · SEASON. This season\'s.','Waiting to go into the cold room.'],cartGaps:'There are gaps in the count. Pages that never came down. Somebody kept them.',
 incin:'INCINERATOR',incinLook:'The incinerator. A heavy iron door, cold, a pilot light that\'s out.',incinFix:'Get the pilot lit',incinSample:'Rig it with what\'s down here',incinFlare:'Light it with a road flare',
 incinLit:'The incinerator roars. You can feel it on your face from across the room.',
 burnQ:'Burn the cart?',burnOpts:['Burn it','Not yet'],
 burnDo:['You feed the pages in by the armful. They go up gray, then gold, then gone.','Behind the cold room\'s door, somebody says "ah" in a polite voice, like a man who\'s been told the restaurant is out of the special.'],
 incinFail:'The pilot catches and goes out. Catches and goes out. It\'s old and so is your patience.',
 incinDone:'The incinerator, burning. You could put anything you wanted in there now.',
 boiler:'The boiler. It knocks twice, waits, knocks twice.',pipes:'Pipes. One of them is sweating ice water.',
 nineQ:['A door in the wall that isn\'t on the fire plan by the stairs. Steel, painted the same gray as the wall. A brass number on it: 9.','You\'ve been seeing that number all season. On motel keys. On clocks. On the back of the van.','It was a door the whole time. It swings open while you\'re looking at it, onto the cold room.'],
 nineH:'The 9, as a door',
 nine:'The 9 door, open. Cold comes out of it. You know where it goes.',
 coldQ:'COLD STORAGE. The vault door is open an inch. Inside, somebody is turning pages, slowly, the way you\'d read to a child.',
 coldClose:'Once you\'re in, it ends one way or another.',
 // ---- the cold room: the boss ----
 cold1:['The cold room goes back and back. Shelves of this season\'s evidence boxes, labeled, sealed, yours.',
  'In the middle, on a lectern, a ledger as thick as a church Bible, open. And a man behind it, tall, in an old deacon\'s coat, turning a page.',
  'His eyes are shut. His face is too even, like somebody drew it from a description. He looks up at you without opening them.'],
 coldH:'The cold room, and him',
 coldNine:'He came in through the 9. You can see it now, the door standing open in the wall behind him, the way you\'d leave a door open for a dog.',
 bossSay:['THE ALMONER','Agent {code}. You\'ve come all this way. Please. Mind the boxes, they\'re yours.'],
 bossSay2:['THE ALMONER','I\'m a collector. That\'s all. People want things, and I have them, and they sign. Everyone signs.'],
 bossBurned:['THE ALMONER','Somebody\'s been burning my mail. That was unkind. That was this year\'s.'],
 bossPage:['THE ALMONER','And Wren has been tearing things. Well. She always was nervous.'],
 bossNamed:['THE ALMONER','And Wren has been telling tales. My name, in a stranger\'s coat. I feel it like a draft.'],
 bossAgnes:['THE ALMONER','Mrs. Lindqvist\'s house. A bad debt. I don\'t like a bad debt.'],
 bossSacr:['THE ALMONER','Mrs. Lindqvist\'s house. Somebody paid in full. I remember all my payments.'],
 bossGaps:['THE ALMONER','And pages have gone missing this year. In coats. In glove boxes. You\'d be surprised what people keep.'],
 bossIntro:'The Almoner closes the Ledger on one finger, to keep his place.',
 bossThin:'He\'s thinner than he should be. What you did tonight, and all season, has cost him pages.',
 bossIdent:'Big Hat said it. Paper burns. Whatever he is, he\'s paper.',
 bossName:'Wren\'s library card is in your coat. His name\'s on it. Read it where he can hear.',
 bossLine:'He reads a line aloud from the Ledger, something about a debt. Everyone in the room feels it come due!',
 dealOffer:'The Almoner turns to {n}, very kindly. "{m}. I can settle that for you. Tonight. All of it. Just a signature."',
 dealAsk:'Take the deal, {n}?',dealOpts:['Sign','Refuse'],
 dealYes:['{n} signs. It\'s the easiest thing {n.they} {n:has|have} ever done.','Something comes back into {n} that had been gone a long time. On the Ledger\'s page, a new line, still wet.'],
 dealHeal:'He writes the name in. He looks a little more there than he did.',
 dealNoLabel:'Saying no to him',
 bossPhase:'His eyes open. They\'re just eyes, ordinary, brown, kind. That\'s the worst part. The Ledger falls open by itself and every page in the room comes loose.',
 bossStorm:'The pages fly. They\'re in the air like birds in a barn.',
 bossCalm:'The pages lie down on the floor like dogs told to. Somebody read his name. They heard it.',
 pages:'The pages come around the room in a storm, edges first!',
 shake:'A page slaps flat against {n}\'s face. {n} can read it. {n.They} {n:wishes|wish} {n.they} couldn\'t.',
 shakeLabel:'A page with somebody on it',
 nameRead:'{n} reads it off the card, out loud, clear as a roll call: "ASA PENHALLOW."',
 nameHit:'He stops. His hand goes to his chest like a man who\'s just remembered he left the stove on. He can\'t stand to hear it.',
 nameFail:'The name comes out wrong, like a word in a dream. He smiles at you politely.',nameDone:'You\'ve read his name. He heard it.',
 // ---- the ending ----
 end1:['He goes down on one knee, politely, like a man in church. The Ledger slides off the lectern and falls open on the floor.','Every name in it. Pages and pages. Some of them you know.'],
 endQ:'The Ledger\'s at your feet. What do you do with it?',
 endBurn:'Burn the Ledger',endBind:'Bind him in the box',
 endBurnDo:['You drag the Ledger to the incinerator. It\'s heavier than a book has any right to be. It\'s heavier every step.','It goes in. It catches. The names go up gold, one at a time, and with each one, somewhere, somebody sits up in bed.',
  'He watches it burn from the cold room\'s door, still kneeling. "Well," he says. "Well." And then he isn\'t there.'],
 endBurnWren:['Upstairs, in Intake, the knitting needles stop.','Wren Hollis is sitting at her desk with her eyes closed, smiling, like someone who\'s just heard the front door and knows who it is. She doesn\'t wake up. Her name was in the book, too.'],
 endBurnWrenFree:['Upstairs, in Intake, Wren is crying at her desk with the phone in both hands.','"She called," Wren says. "Lily. She called. She sounds eighteen. She sounds so annoyed with me."'],
 endBurnRoom:'The cold room burns behind you. The sprinklers come on in every room of the annex but that one.',
 endBindDo:['You read his name off the card. He flinches and doesn\'t get up.','The empty Lantern Box opens wider than a box can open. He looks at it, and at you, and he folds himself into it like a man getting into a small car, politely.',
  'You close the lid. Something inside it turns a page.'],
 endBindWren:['Upstairs, Wren is already in her coat. "I\'ll turn myself in," she says. "To whom, I don\'t know. Somebody should get to be angry at me."'],
 endFled:['He picks the Ledger up off the floor and dusts it off, carefully, the way you\'d dust off a hat.','"Half," he says. "It\'s half full. That\'s enough for now." He tucks it under his arm.','He walks out through the 9, or a door that wasn\'t there a second ago, and it closes behind him like it was never open.'],
 endFledWren:['In the morning, Intake is empty. The desk is cleared to the wood, like Dot\'s. The scarf is gone. So is she.'],
 boxGet:'The Lantern Box is heavy now. It\'s warm. Something inside it is reading.',
 dawn:'Monday. The snow stopped sometime in the night. Desmond signs you out in the book, all of you, in his own handwriting, because somebody should.',
 // ---- overstepping (a quiet case): Noticed, the watch officer, Big Hat's call, the clean-up crew ----
 noticed:['A camera over the stacks swivels to follow you and keeps following you.','Desmond won\'t be as friendly now.'],
 chief:['The annex\'s watch officer comes down from the third floor in his socks, with a ring of keys.',['WATCH OFFICER','I don\'t know who you are and I don\'t want to.'],['WATCH OFFICER','I\'m locking Intake. Ms. Hollis can let herself out.']],
 call:['The lobby\'s phone rings. Desmond holds it out to you without a word.',['BIG HAT','They got your names upstairs, {first}. Your real ones.'],['BIG HAT','Whatever you\'re doin\', do it faster.']],
 feds:['Three agents in gray coats come down the stacks in step, no flashlights. They don\'t need them.',['CLEAN-UP','Black Lantern. Internal. You\'re done here.'],['CLEAN-UP','This is a records matter. You\'re the record.']],
 fedsIntro:'The clean-up crew draws down!',
 fedsWin:['The gray coats go back up the stairs, one short.'],
 // ---- the debrief (spec 007): Big Hat's lines by ending ({x}/{t} clues), what he says about the choices, the closing
 // scene (every ending), and the cover stories ----
 db:{
  clean:[['BIG HAT','Sit.'],'The donut shop\'s back room. His desk. His tube light, buzzing. A box of crullers that is, for once, full.',['BIG HAT','They reinstated me this mornin\'. Nobody said why. Nobody said sorry.'],
   ['BIG HAT','{x} clues outta {t}. Lotta people sat up in bed last night. They\'ll never know why. That\'s the job.']],
  costly:[['BIG HAT','Sit. There\'s no chair. Sit anyway.'],'The payphone again. He\'s still suspended. Snow on his hat.',['BIG HAT','Agency\'s got him in a box in a vault. Upstairs is very excited. Upstairs called it "an asset."'],
   ['BIG HAT','{x} clues outta {t}. I don\'t like owning things that read.']],
  worst:[['BIG HAT','He walked.'],['SHOUT','HE WALKED OUT WITH HALF A BOOK.'],['BIG HAT','{x} clues outta {t}. Case is closed because I say so. He ain\'t.']],
  deal:['BIG HAT','Somebody signed somethin\' in there. Don\'t tell me who. I\'ll find out. I always find out.'],
  wren:['BIG HAT','You were kind to her. Good. Somebody shoulda been, eleven years ago.'],
  page:['BIG HAT','She tore it out. Wren tore it out. ...Hell of a thing, at her age.'],
  burned:['BIG HAT','You burned a cart of mail in a federal incinerator. I\'m not gonna write that down.'],
  wrong:['BIG HAT','"Internal." I\'m gonna think about that one a while, {first}.'],
  forced:['BIG HAT','Facilities says the dock door came off its track. Facilities says "on its own." I said, sure.'],
  stairs:['BIG HAT','Two of Internal woke up on the stairs with a headache and a form to fill out. They\'re fillin\' it out about you.'],
  memo:['He takes a sheet out of his vest and flattens it. A Records memo. Every case you closed this season, a line each.',
   ['BIG HAT','Upstairs wants to know what happened to the evidence. All of it. The whole season.'],
   'He folds it up very small and drops it in the cup with the last of the coffee.',['BIG HAT','Nothin\'s in my jurisdiction. That\'s my favorite thing about it.']],
  fire:'An electrical fire in the sub-basement.',firePass:[['BIG HAT','Electrical fire. Old building. Sprinklers worked everywhere but the one room. Act of God, the report says. Close enough.']],
  audit:'A records audit. Nothing to see.',auditPass:[['BIG HAT','Audit. Nobody reads an audit. That\'s why they call it one.']],
  weak:'Somebody left a space heater on.',weakPass:[['BIG HAT','Space heater. In a vault. On a Sunday. ...You got lucky.']],
  easy:'Nobody was there',easyPass:[['BIG HAT','It was Sunday. Nobody was there. Desmond\'ll swear to it. Desmond swears to everything.']],
  safe:'Already filed: scheduled maintenance',safePass:[['BIG HAT','Scheduled maintenance. Paper says so. Paper says a lot of things.']],
  filedPage:[['BIG HAT','Her page. I\'ll file it.'],'He looks at it a long time.',['BIG HAT','No. I won\'t.'],'It goes in his coat.'],
  filedBox:[['BIG HAT','The box goes upstairs.'],['BIG HAT','God help us, the box goes upstairs.']]
 },
 // the unlock scene's stand-in lines (the board plays these until the season data has the finale's own)
 unlock:['No folder this time.','Somebody upstairs took the folders.']
};
const fill=(t,o)=>String(t).replace(/\{(n|m|v|t|e|h|i|w)\}/g,(x,k)=>o[k]??x);
async function play(seq,o={}){for(const l of [].concat(seq)){if(Array.isArray(l))await say(l[0],fill(l[1],o));else await say('',fill(l,o))}}
const said=(l,o)=>play([l],o);
// A point of no return (studio-bible/play.md): the cursor starts on Not yet, so mashing A can't take it.
async function askNotYet(text,opts){await say('',text,{keep:true,instant:false});const r=await choose(opts,{cancel:true,inBox:true,sel:opts.length-1});hideTB();return r<0?opts.length-1:r}

// The case board card (spec 015, Card; spec 009, step 4): LANTERN 03, the finale. The board adds SEASON FINALE · and
// the gold edge, since the season data marks it the finale.
const caseCard={file:3,title:'RECORDS',town:'SUITLAND',place:'SUITLAND, MD',
 hook:['Big Hat calls from a payphone. It\'s Sunday.','Everything you ever filed went somewhere.'],pin:'#7a1a18'};

// ================= WHAT THE SEASON LEFT BEHIND (season.js arcTally) =================
// kept: pages kept off the books; hidden: unnatural items hidden from Big Hat (the list is loadSeason().hidden, each
// {k, case, who}); arc: what the other agency cases left (agnes: 'burn' | 'walk' | 'sacrifice', nine, ledgerCopy).
// Anything missing counts as nothing happened, so this works in a Dev pin with no other agency case closed.
const tally=()=>{try{return arcTally()}catch(e){return{kept:0,hidden:0,arc:{}}}};
const arcOf=()=>tally().arc||{};
const hiddenList=()=>{const s=loadSeason();return Array.isArray(s.hidden)?s.hidden.filter(h=>h&&h.k):[]};
// the boss's HP cut (Combat numbers: 10–15% each, at most 40% in all): the out-tray burned −10, her page −8 (or his
// name given away −6), and the
// season's own cut (−2 per kept page or hidden item, up to −8; −4 more if the forged page burned in LANTERN 02)
const CUT={burn:10,page:8,name:6,each:2,arcMax:8,agnes:4,max:31};
function arcCut(){const T=tally();return Math.min(CUT.arcMax,CUT.each*((T.kept|0)+(T.hidden|0)))+(T.arc&&T.arc.agnes==='burn'?CUT.agnes:0)}
// every 2 hidden items add one more Internal Security roamer in the stacks (at most 2 more)
const extraRoamers=()=>Math.min(2,Math.floor((tally().hidden|0)/2));

// ================= CASE DATA =================
// Enemy cards (Combat: Enemies and difficulty, Combat numbers). Fight sizes: roamers 10–18 enemy HP, story fights 20–35.
// The boss is at the Season finale boss row (70–80 HP, 55–65%). Every fight here rolls lasting injuries at +2
// (battle.js reads isFinaleCase).
const EN={
 // the Filing: the season's pages standing up out of the evidence boxes (an unnatural story fight, 2 skulls)
 filing:{name:'The Filing',tier:'tough',hp:26,dex:10,hit:55,dmg:'1d4+1',skulls:2,tags:['unnatural','burns','paper'],resist:['shaken','poison'],weak:'fire',
  weakLine:'Paper. Old, dry, numbered. Fire takes it double. Nothing in there to scare.',
  moves:[['hit',3],['bleed',2]],verb:'folds over',die:'comes apart into a drift of paper',face:[18,4,22],horror:{tier:'disturbing',kind:'unnatural'}},
 // Pruitt and Vale: Internal Security on the basement stairs (a human story fight, 2 skulls)
 sec:{name:'Internal Security',tier:'ordinary',hp:13,dex:12,hit:55,dmg:'1d4+1',skulls:2,tags:['human','living'],resist:[],weak:'human',
  weakLine:'Human, doing what the paper says. A flashbang or a badge will stop one for a second.',moves:[['hit',1]],verb:'swings a baton at',die:'goes down on the landing and stays down',face:[12,2,18]},
 // the night's roamers: night security with flashlights in the stacks
 guard:{name:'Night security',tier:'ordinary',hp:14,dex:11,hit:50,dmg:'1d3+1',skulls:1,tags:['human','living'],resist:[],weak:'human',
  weakLine:'Human, tired, on a beat. A badge or a flashbang will stop him for a second.',moves:[['hit',1]],verb:'swings a flashlight at',die:'sits down hard and stays sat',face:[12,2,18]},
 // only if overstepping reaches Federal agents (the same clean-up crew as every case; its sprite is Still Harvest's SHB)
 fed:{name:'Clean-up agent',tier:'ordinary',hp:11,dex:12,hit:55,dmg:'1d4+1',skulls:3,tags:['human','living'],resist:[],weak:'human',weakLine:'Human. A flashbang or a badge will stop him for a second.',
  moves:[['hit',1]],verb:'fires at',die:'goes down and stays down',face:[10,2,20]},
 // the boss (tuned Nov 25, 2026 with tools/boss-sim.js against a mid-level Field Team). Its HP and phase 2 are set per
 // run in bossFight() from the case's and the season's choices. Weakness: fire (on the Ledger); his name read aloud.
 almoner:{name:'The Almoner',tier:'boss',boss:true,hp:78,dex:12,hit:60,dmg:'1d4+2',allDmg:'1d3',skulls:3,tags:['unnatural','paper'],resist:['stun2','poison'],weak:'fire',
  weakLine:'Paper, all the way down. Fire on the Ledger does double. Read his true name aloud and he can\'t hold the room.',glow:true,face:[22,6,22],
  moves:[['hit',4],['all',1],['deal',2],['pages',0],['shake',0]],verb:'reaches for',allText:TEXT.bossLine,die:'goes down on one knee, politely',
  horror:{tier:'boss',kind:'unnatural',known:true}}
};
// the case's horrors: tier, kind, phobia subject; once per case each (SAN loss table). Midnight, the 9 and the cold room
// are for all three; the rest are the lead's on the map.
const HORRORS={
 tall:{id:'tall',tier:'unsettling',kind:'unnatural',label:TEXT.tallH},
 board:{id:'board',tier:'unsettling',kind:'helplessness',label:TEXT.boardH},
 cage:{id:'cage',tier:'disturbing',kind:'unnatural',label:TEXT.cageH},
 lily:{id:'lily',tier:'unsettling',kind:'unnatural',label:TEXT.lilyH},
 midnight:{id:'midnight',tier:'disturbing',kind:'unnatural',all:true,subj:'the dark',label:TEXT.midnightH},
 nine:{id:'nine9',tier:'unsettling',kind:'unnatural',all:true,label:TEXT.nineH},
 cold:{id:'cold',tier:'shattering',kind:'unnatural',all:true,label:TEXT.coldH}
};
// this case's own items (case-only: the pin icon; Big Hat sorts them at the debrief). Wren's page is the finale's page.
const holdItem=k=>holderOf(k)||(G.fs.pack||[]).some(it=>it.k===k);
function dropItem(k){const h=holderOf(k);if(h){h.it.u=1;spend(h.m,h.it);return}G.fs.pack=(G.fs.pack||[]).filter(it=>it.k!==k)}
const CASE_ITEMS={
 name:{name:'His true name',type:'Evidence',kind:'ordinary',pin:1,desc:'An old library card in Wren\'s hand: ASA PENHALLOW. Battle: read it aloud where he can hear (History or Occult).',
  battleUse:async m=>{const F=G.flags;if(F.named){await bsay(TEXT.nameDone,900);return false}
   const t=aliveFoes().find(e=>e.t==='almoner');if(!t){await bsay('There\'s nobody here it means anything to.',900);return false}
   const sk=chanceOf(m,'History')>=chanceOf(m,'Occult')?'History':'Occult',o=SR.pct(chanceOf(m,sk));bres(sk.toUpperCase(),o);
   await bsay(fill(TEXT.nameRead,{n:m.name}),1500);
   if(!o.ok){tried(m,sk);await bsay(TEXT.nameFail,1000);return true}
   F.named=1;await bsay(TEXT.nameHit,1200);await foeStatus(t,'stun');if(t.ph2)await bsay(TEXT.bossCalm,1400);return true}},
 wrenpage:{name:'Wren\'s page',type:'Evidence',kind:'unnatural',pin:1,passive:1,desc:'An old page, soft as cloth, torn in four: "Wren Hollis, for Lily." Numbered in the corner, in faded ink.'},
 lbox:{name:'Empty Lantern Box',type:'Tool',kind:'ordinary',pin:1,passive:1,desc:'The agency\'s own box, lead-lined, a lantern on the lid. Empty. It wants to be closed on something.'},
 boxed:{name:'The sealed box',type:'Evidence',kind:'unnatural',pin:1,passive:1,desc:'A Lantern Box, lid down, warm to the touch. Something inside it turns a page now and then.'}
};
// a roamer's drop: 20% from this loot table (Where items come from, Loot): a government building on a Sunday
const LOOT=['painkillers','energy','roadflare','cigs','bandage'];
const has=id=>G.clues.some(c=>c.id===id);
const KEY=['signin','routing','pages','lily','dot','shred'];
const keyClues=()=>G.clues.filter(c=>KEY.includes(c.id)).length;

// ================= THE NIGHT =================
// G.flags.ph: 0 before midnight (the annex lit), 1 after (the blackout). Midnight is the one turn, in Intake, with
// Go on / Not yet naming what closes (Turning the day; play.md). The case is one Sunday night: no day, on purpose.
const ph=()=>G.flags.ph|0;
const isNight=()=>ph()===1;
const inside=()=>!!G.flags.inside;
// overstepping: a quiet case (Noticed, then Local chief, Agency call, Federal agents)
const stepName=()=>stepsOf()[loadSeason().overstep|0]||'Clean';
const stepAt=n=>stepsOf().indexOf(n)>=0&&stepsOf().indexOf(n)<=(loadSeason().overstep|0);
const clam=()=>stepAt('Noticed')?-20:0;

// ================= MAPS =================
// Every map is drawn by cases/lantern-03-art.js from M.ground, M.pieces and M.light. M.g is what blocks.
// Ground letters (none walkable ones in engine.js's BLOCK set): ',' sidewalk, '=' the lot's asphalt, 's' snow,
// 'n' linoleum, 'o' concrete, 'c' carpet, 't' terrazzo (the lobby).
function blank(id,name,W,H,fillCh,light){const ground=mk(W,H,fillCh),g=mk(W,H,fillCh);
 return{id,name,w:W,h:H,ground,g,pieces:[],O:{},npcs:[],warps:{},light,art:window.L03A,bg:id,lines:[]}}
const lay=(M,x,y,w,h,c)=>{rect(M.ground,x,y,w,h,c);rect(M.g,x,y,w,h,c)};
const block=(M,x,y,w=1,h=1)=>rect(M.g,x,y,w,h,'#');
const open=(M,x,y)=>{M.g[y][x]=M.ground[y][x]};
function put(M,k,x,y,w=1,h=1,o={}){const p=Object.assign({k,x,y,w,h},o);M.pieces.push(p);if(!o.walk)block(M,x,y,w,h);return p}
const look=t=>({look:t});
const folkOf=list=>list.map(n=>Object.assign(n,{talk:n.talk||(()=>play(TEXT[n.say||n.id]))}));
async function goTo(to,x,y,dir){await fade(1);goMap(to,x,y,dir);checkpoint();await fade(0);if(G.M.arrive)await G.M.arrive()}
const bounceDir=(M,keys,text,dir)=>keys.forEach(k=>M.warps[k]=async()=>{await said(text);G.dir=dir;await stepBack()});
const rebuild=()=>{const x=G.x,y=G.y,d=G.dir;G.M=MAPS[G.map]();StudioMove.place(G,x,y,d)};
const bump=async(text,dir='down')=>{await said(text);G.dir=dir;await stepBack()};

// ---- THE ANNEX LOT (30 x 18): before midnight only, sodium light, first snow ----
// The annex front along the top: the front doors left of middle, the loading dock on the right. The lot below, its
// stalls painted under the snow, the van, the dumpster by the dock, light poles, the dead pole at the far edge (the
// cameo), a payphone on the fence along the bottom.
const DOORS={front:11,dock:22};
function buildLot(){const F=G.flags,M=blank('lot','THE ANNEX LOT',30,18,'=','night');M.alpha=.86;M.warm='#ffb860';
 block(M,0,0,30,6);put(M,'annex',0,0,30,6,{walk:1});
 lay(M,0,6,30,2,',');lay(M,0,16,30,2,'s');lay(M,0,8,2,8,'s');lay(M,28,8,2,8,'s');
 for(let x=4;x<26;x+=3)M.lines.push({x:x*16,y:10*16,w:2,h:3*16});for(let x=4;x<26;x+=3)M.lines.push({x:x*16,y:13*16,w:2,h:3*16});
 // the front doors and the dock: warps on the front's bottom row
 open(M,DOORS.front,5);open(M,DOORS.front+1,5);M.warps[DOORS.front+',5']=M.warps[(DOORS.front+1)+',5']=frontDoors;
 open(M,DOORS.dock,5);open(M,DOORS.dock+1,5);M.warps[DOORS.dock+',5']=M.warps[(DOORS.dock+1)+',5']=dockDoor;
 [2,3,4,5,6,7,8,9,14,15,16,17,18,19].forEach(x=>M.O[x+',5']=look(TEXT.annex));
 put(M,'van',3,11,4,1);[3,4,5,6].forEach(x=>M.O[x+',11']=look(TEXT.van));
 put(M,'car',16,14,3,1,{tint:'#4a5a6a'});put(M,'car',9,8,3,1,{tint:'#6a3a3a'});[16,17,18].forEach(x=>M.O[x+',14']=look('A gray sedan with a government plate and a parking sticker from 2009.'));[9,10,11].forEach(x=>M.O[x+',8']=look('A maroon sedan under an inch of snow. A knitting bag on the passenger seat.'));
 put(M,'dumpster',25,7,3,1);[25,26,27].forEach(x=>M.O[x+',7']={id:'dumpster',name:TEXT.dumpster,look:TEXT.dumpsterLook,opts:()=>has('shred')?[]:[{use:'sweep',label:TEXT.dumpsterSweep,ok:async()=>{await play(TEXT.shredDo);clue('shred',TEXT.cShred);checkpoint()},fail:()=>said(TEXT.shredFail)}],used:()=>has('shred')});
 [[1,7],[13,9],[24,12],[8,15]].forEach(([x,y])=>put(M,'lamp',x,y));
 put(M,'deadpole',28,13);M.O['28,13']=look(TEXT.pole);
 put(M,'payphone',1,15);M.O['1,15']=look(TEXT.payphone);
 put(M,'snowbank',11,16,4,1);put(M,'snowbank',19,16,3,1);
 // the edges: you came here to go in
 bounceDir(M,[6,7,8,9,10,11,12,13,14,15].map(y=>'0,'+y),TEXT.edge,'right');bounceDir(M,[6,7,8,9,10,11,12,13,14,15].map(y=>'29,'+y),TEXT.edge,'left');
 bounceDir(M,[...Array(28).keys()].map(x=>(x+1)+',17'),TEXT.edge,'up');
 // the tall man at the far edge, under the dead pole (the cameo, at most one per case): gone when you walk over
 if(!F.tallGone)M.npcs=folkOf([{id:'tall',x:27,y:14,dir:'left',talk:tallScene}]);
 M.onStep=async()=>{if(!F.tallGone&&Math.abs(G.x-27)+Math.abs(G.y-14)<=5){held=[];await tallScene()}};
 return M}
async function tallScene(){const F=G.flags;if(F.tallGone)return;F.tallGone=1;await cut('tall',()=>play(TEXT.tall));rebuild();await horror(HORRORS.tall);checkpoint()}
// The front doors: Desmond at the desk inside buzzes you in for paper (Bureaucracy, +10 from the Records topic),
// credentials, or a good talk; the buzzer needs no skill. Two refusals (or buzzes) and he lets you in anyway, out of pity (overstepping: seen). Never a dead end.
async function frontDoors(){const F=G.flags;
 if(F.inside)return goTo('lobby',7,8,'up');
 let inn=false;const go=async()=>{inn=true;F.inside=1;checkpoint()};
 const no=async()=>{F.doorNo=(F.doorNo|0)+1;await play(TEXT.doorsNo);if(F.doorNo>=2){await play(TEXT.doorsGive);await go();await overstepHere('seen')}};
 await hotspot({name:'FRONT DOORS',look:TEXT.doorsQ,opts:[
  {use:'paper',label:TEXT.doorsPaper,mod:()=>(intelOn('records')?10:0),ok:async()=>{await play(TEXT.doorsPaperDo);await go()},fail:no},
  {use:'creds',label:TEXT.doorsCreds,ok:async()=>{await play(TEXT.doorsCredsDo);await go()},fail:no},
  {use:'talk',label:TEXT.doorsTalk,mod:()=>clam(),ok:async()=>{await play(TEXT.doorsTalkDo);await go()},fail:no},
  {label:TEXT.buzz,run:async()=>{await play(TEXT.buzzTalk);await no()}}]},'front');
 if(inn)return goTo('lobby',7,8,'up');G.dir='down';await stepBack()}
// The loading dock: the keypad (Computers), the panel (Craft), the vent over the door (Athletics), or the door off its
// track (Melee: the camera sees it). It comes out in the stacks.
async function dockDoor(){const F=G.flags;
 if(F.dockOpen){F.inside=1;return goTo('stacks',3,16,'up')}
 let inn=false;const go=async()=>{inn=true;F.dockOpen=1;F.inside=1};
 await hotspot({name:TEXT.dock,look:TEXT.dockLook,opts:[
  {use:'crack',label:TEXT.dockCrack,ok:async()=>{await said(TEXT.dockCrackDo);await go()},fail:()=>said(TEXT.dockFail)},
  {use:'fix',label:TEXT.dockFix,ok:async()=>{await said(TEXT.dockFixDo);await go()},fail:()=>said(TEXT.dockFail)},
  {use:'climb',label:TEXT.dockClimb,ok:async()=>{await said(TEXT.dockClimbDo);await go()},fail:()=>said('The vent is smaller than it looked, and so, it turns out, is your nerve.')},
  {use:'force',label:TEXT.dockForce,ok:async()=>{F.forced=1;await said(TEXT.dockForceDo);await go();await overstepHere('seen')},fail:()=>said('The roll-up door is federal property and it knows it.')}]},'dock');
 if(inn){checkpoint();return goTo('stacks',3,16,'up')}G.dir='down';await stepBack()}

// ---- interiors: the back wall three tiles tall, the doors in the walls ----
function room(id,name,W,H,floor,o={}){const M=blank(id,name,W,H,floor,isNight()?'night':'day');M.alpha=o.alpha||.84;M.warm=isNight()?'#ff7a5a':'#ffe8b0';
 block(M,0,0,W,3);block(M,0,0,1,H);block(M,W-1,0,1,H);block(M,0,H-1,W,1);put(M,'room',0,0,W,H,{walk:1,floor});return M}

// THE LOBBY (14 x 10): Desmond at his desk; Intake's door and the stairs door in the back wall; the front doors below
function buildLobby(){const M=room('lobby','THE LOBBY',14,10,'t'),F=G.flags;
 open(M,2,2);M.warps['2,2']=enterIntake;
 open(M,12,2);M.warps['12,2']=()=>goTo('stacks',12,16,'up');M.O['11,2']=look(TEXT.stairsDoor);
 put(M,'elevator',5,0,2,3,{walk:1});M.O['5,2']=M.O['6,2']=look(TEXT.elevator);
 put(M,'photos',8,0,3,3,{walk:1});[8,9,10].forEach(x=>M.O[x+',2']={id:'photos',name:TEXT.photos,look:()=>play(TEXT.photosLook)});
 put(M,'gdesk',4,5,4,1);M.O['4,5']={id:'book',name:TEXT.book,look:TEXT.bookLook,opts:()=>has('signin')?[]:[{use:'sweep',label:TEXT.bookSweep,ok:findSignin,fail:()=>said(TEXT.bookFail)},{use:'paper',label:TEXT.bookPaper,mod:()=>(intelOn('records')?10:0),ok:findSignin,fail:()=>said(TEXT.bookFail)}],used:()=>has('signin')};
 M.O['5,5']=M.O['6,5']=()=>talkDesmond();M.O['7,5']=look(TEXT.fish);
 put(M,'detector',2,6,1,2);M.O['2,6']=M.O['2,7']=look(TEXT.detector);
 put(M,'bin',12,6);M.O['12,6']={id:'bin',name:TEXT.bin,look:TEXT.binLook,opts:[{label:TEXT.binOpt,once:'bin',run:async()=>{await said(TEXT.binFind);await pickup('shrooms')}}]};
 put(M,'chairs',9,7,3,1);[9,10,11].forEach(x=>M.O[x+',7']=look('Plastic chairs bolted together in a row. Nobody has ever waited here for anything good.'));
 put(M,'plant',12,8,1,1);
 // the front doors: out to the lot before midnight, locked down after
 open(M,7,9);M.warps['7,9']=async()=>{if(isNight()){await bump(TEXT.lockedDown,'up');return}await goTo('lot',DOORS.front,6,'down')};
 M.npcs=folkOf([{id:'desmond',x:6,y:4,dir:'down',talk:talkDesmond,out:()=>has('signin')&&!!G.fs.used['opt:dhat']}]);
 M.arrive=async()=>{if(!F.lobby1){F.lobby1=1;await cut('lobby',()=>play(TEXT.lobbyIn));checkpoint()}};
 return M}
async function findSignin(){await play(TEXT.bookDo);clue('signin',TEXT.cSignin);checkpoint()}
async function talkDesmond(){const F=G.flags;
 if(isNight()){await play(TEXT.desmondNight);return}
 if(!F.des1){F.des1=1;await play(TEXT.desmond1)}
 if(stepAt('Noticed')){await play(TEXT.desmondNoticed);return}
 if(has('signin')&&G.fs.used['opt:dhat']){await play(TEXT.desmondAfter);return}
 await hotspot({name:TEXT.desmondName,opts:[
  {use:'talk',label:TEXT.desmondAsk,show:()=>!has('signin'),mod:()=>(intelOn('records')?10:0),ok:async()=>{await play(TEXT.desmondWho);clue('signin',TEXT.cSigninDes);checkpoint()},fail:()=>play(TEXT.desmondNo)},
  {label:TEXT.desmondBook,show:()=>!has('signin')&&keyClues()>0,run:async()=>{await play(TEXT.desmondWho);clue('signin',TEXT.cSigninDes);checkpoint()}},
  {label:TEXT.desmondHat,once:'dhat',run:()=>play(TEXT.desmondHatDo)}]},'desmond')}
// Intake's door: locked by the watch officer at Local chief (Credentials or Persuade; open again after midnight)
async function enterIntake(){const F=G.flags;
 if(!F.intakeShut||isNight())return goTo('intake',6,7,'up');
 let inn=false;
 await hotspot({name:TEXT.intakeDoor,look:TEXT.intakeLocked,opts:[
  {use:'creds',label:TEXT.intakeCreds,ok:async()=>{inn=true;await said(TEXT.intakeIn)},fail:()=>said('Locked is locked. The sign says twenty minutes. It said that an hour ago.')},
  {use:'talk',label:TEXT.intakeTalk,ok:async()=>{inn=true;await said(TEXT.intakeIn)},fail:()=>said('The knitting needles stop for a second on the other side of the door. Then start again.')}]},'intakedoor');
 if(inn){F.intakeShut=0;return goTo('intake',6,7,'up')}G.dir='down';await stepBack()}

// INTAKE (12 x 9): Wren's office. The phone rings here; midnight comes here.
function buildIntake(){const M=room('intake','INTAKE · RECORDS',12,9,'c'),F=G.flags;
 put(M,'routeboard',1,0,4,3,{walk:1});[1,2,3,4].forEach(x=>M.O[x+',2']={id:'board',name:TEXT.board,look:TEXT.boardLook,opts:()=>F.boardRead?[]:[{use:'sweep',label:TEXT.boardSweep,ok:readBoard,fail:()=>said(TEXT.boardFail)}],used:()=>!!F.boardRead});
 put(M,'window',6,0,3,3,{walk:1});M.O['6,2']=M.O['8,2']=look(TEXT.windowLook);
 // The hidden hotspot (Item list, Mushrooms): the window's reflection, only while the lead is High (field.js)
 M.O['7,2']={id:'lily',hidden:'mushrooms',name:TEXT.lilyName,look:readLily,used:()=>has('photo'),glint:(c,x,y,now)=>L03A.lilyGlint(c,x,y,now)};
 put(M,'cabinet',10,3,1,1);M.O['10,3']={id:'cabinet',name:TEXT.cabinet,look:TEXT.cabinetLook,opts:()=>F.cabinet||F.page?[]:[
  {use:'fix',label:TEXT.cabinetFix,ok:async()=>{F.cabinet=1;await play(TEXT.cabinetDo)},fail:()=>said(TEXT.cabinetFail)},
  {use:'force',label:TEXT.cabinetForce,ok:async()=>{F.cabinet=1;await play(TEXT.cabinetDo);await overstepHere('seen')},fail:()=>said(TEXT.cabinetFail)}],used:()=>!!F.cabinet||!!F.page};
 put(M,'wdesk',3,5,4,1);M.O['3,5']={id:'photo',name:TEXT.photo,look:async()=>{await play(TEXT.photoLook);if(!has('lily')){clue('lily',TEXT.cLily);checkpoint()}},used:()=>has('lily')};
 M.O['4,5']=M.O['5,5']=()=>talkWren();
 M.O['6,5']={id:'phone',name:TEXT.phone,look:TEXT.phoneLook,opts:()=>phoneOpts(),used:()=>!!F.deduce};
 put(M,'kettle',1,4);M.O['1,4']={id:'kettle',name:TEXT.kettle,look:()=>said(isNight()?TEXT.kettleLook:TEXT.kettleDay),opts:()=>isNight()&&!F.tea?[{label:TEXT.kettleOpt,run:teaRest}]:[],used:()=>!isNight()||!!F.tea};
 put(M,'lamp_in',10,6);put(M,'stacks_paper',8,4,1,1);
 put(M,'scarf',4,6,6,1,{walk:1});
 open(M,6,8);M.warps['6,8']=()=>goTo('lobby',2,3,'down');
 M.npcs=folkOf([{id:'wren',x:4,y:4,dir:'down',talk:talkWren,out:()=>!!F.wrenDone||F.deduce&&!isNight()&&!!F.wrenTold}]);
 M.arrive=intakeArrive;
 return M}
async function intakeArrive(){const F=G.flags;
 if(!F.intake1){F.intake1=1;await cut('intake',()=>play(TEXT.intakeArr));checkpoint()}
 if(!isNight()&&!F.deduce&&keyClues()>=3&&!F.ringing){F.ringing=1;await said(TEXT.ring);checkpoint()}}
async function readBoard(){const F=G.flags;F.boardRead=1;await play(TEXT.boardDo);await horror(HORRORS.board);if(!has('routing'))clue('routing',TEXT.cRoutingBoard);checkpoint()}
async function readLily(){await play(TEXT.lilyLook);await horror(HORRORS.lily);if(!has('photo')){clue('photo',TEXT.cPhoto);checkpoint()}}
async function teaRest(){const F=G.flags;if(F.tea)return;F.tea=1;await fade(1);await play(TEXT.kettleDo);await rest(.5);await fade(0);checkpoint()}
// Wren: before the call she lies (Paranoia) and talks about filing; she names a hidden item if the team kept one, and
// the kept pages. After the call she knows. At midnight she's afraid, and she can be turned.
async function talkWren(){const F=G.flags;await trigger('liar');
 if(!F.wren1){F.wren1=1;await play(TEXT.wren1);
  const H=hiddenList();if(H.length){const h=H[(G.clues.length+H.length)%H.length],nm=String(itemDef(h.k).name||'thing').toLowerCase(),w=String(h.who||'One of you').split(' ')[0];await play(TEXT.wrenHidden,{i:nm,w})}
  const k=tally().kept|0;if(k)await play(TEXT.wrenKept,{n:String(k)});checkpoint()}
 if(F.wrenDone){await play(F.wren==='turned'?TEXT.wrenAfter:TEXT.wrenAfterNo);return}
 if(isNight())return turnWren();
 if(F.deduce){if(!F.wrenTold){F.wrenTold=1;await play(TEXT.wrenKnow)}await play(TEXT.wrenMid);
  return hotspot({name:'WREN',opts:[{label:TEXT.stayOpt,run:midnight}]},'wren')}
 await hotspot({name:'MS. HOLLIS',look:()=>play(TEXT.wrenDay),opts:[{label:TEXT.wrenAsk,once:'scarf',run:()=>play(TEXT.wrenScarf)}]},'wren')}
function phoneOpts(){const F=G.flags;if(F.deduce||isNight())return[];if(keyClues()<3)return[];return[{label:TEXT.phonePick,run:deduce}]}
// The deduction (Gameplay loop, Deduction), on Intake's phone, played at Big Hat's payphone: who's been routing my cases?
// Right needs her motive (`lily` or the arc's `copy`) and her hand (`signin` or `routing`); the office needs `routing`.
// A wrong answer costs SAN at midnight, never progress: midnight comes either way.
async function deduce(){const F=G.flags;if(F.deduce)return;
 await hunch(TEXT.hunch);
 const right=()=>(has('lily')||has('copy'))&&(has('signin')||has('routing'));
 let r;
 await bigHatScene(async()=>{
  await play(TEXT.hatCall);
  r=await ask('BIG HAT',TEXT.hatAsk,TEXT.hatOpts);
  // Loose thread (an arc perk, spec 008): once per case, a wrong answer costs nothing and you can answer again
  const lt=!(r===1&&right())&&live().find(m=>perkOn(m,'truth'));
  if(lt){await say('',fillT(BLS.HOMEW.perkUsed,{p:BLS.HOMEW.perks.truth[0],n:lt.name}));r=await ask('BIG HAT',TEXT.hatAsk,TEXT.hatOpts)}
  if(r===1&&right()){F.deduce='right';await play(TEXT.hatRight);await shout(TEXT.hatShout);await play(TEXT.hatRight2)}
  else if(r===1){F.deduce='noproof';await play(TEXT.hatNoProof)}
  else if(r===2&&has('routing')){F.deduce='half';await play(TEXT.hatHalf)}
  else if(r===2){F.deduce='noproof';await play(TEXT.hatNoProof)}
  else{F.deduce='wrong';await play(TEXT.hatWrong)}
 },{place:window.L03A.payphone});
 G.mode='world';await fade(0);checkpoint()}
// midnight (the one turn): Go on / Not yet, naming what closes. A wrong deduction costs each agent 1 SAN here.
async function midnight(){const F=G.flags;if(isNight())return;
 const r=await askNotYet(TEXT.midQ+' '+TEXT.midClose,TEXT.turnOpts);if(r!==0)return;
 await fade(1);F.ph=1;F.intakeShut=0;goMap('intake',5,6,'up');banner(TEXT.phase[1]);checkpoint();await fade(0);
 await cut('midnight',()=>play(TEXT.midnight));await horror(HORRORS.midnight);
 if(F.deduce==='wrong'&&!F.wrongPaid){F.wrongPaid=1;await said(TEXT.wrongCost);live().forEach(m=>{m.san=Math.max(1,m.san-1)});applySan()}
 await trigger('night');await play(TEXT.wrenNight);checkpoint()}
// Turning Wren (motivation moments: Family and Redemption): shown Lily in the window she turns for sure; otherwise
// Empathy (Ask about Lily: Family) or Persuade (It isn't too late: Redemption), +10 from the W. topic and +10 from the
// right deduction. Each way once. Turned, she gives up his true name or tears out her own page (the player picks).
async function turnWren(){const F=G.flags;if(F.wrenDone)return;
 const md=()=>(intelOn('w')?10:0)+(F.deduce==='right'?10:0);
 const ok=async(seq,type)=>{await play(seq);for(const m of holdersOf(type))await motivate(m);await wrenGives()};
 const no=async()=>{await play(TEXT.wrenFail);if(G.fs.used['opt:wlily']&&G.fs.used['opt:wlate']&&!has('photo')){F.wrenDone=1;F.wren='lost';checkpoint()}};
 await hotspot({name:'WREN',look:TEXT.wrenTurnQ,opts:[
  {label:TEXT.wrenShow,show:()=>has('photo'),run:()=>ok(TEXT.wrenShowDo,'Family')},
  {use:'read',label:TEXT.wrenLily,once:'wlily',mod:md,ok:()=>ok(TEXT.wrenLilyDo,'Family'),fail:no},
  {use:'talk',label:TEXT.wrenLate,once:'wlate',mod:md,ok:()=>ok(TEXT.wrenLateDo,'Redemption'),fail:no}]},'wrenturn',{scene:true})}
async function wrenGives(){const F=G.flags;F.wrenDone=1;F.wren='turned';await play(TEXT.wrenTurned);
 const r=await ask('',TEXT.wrenWhich,TEXT.wrenOpts);
 if(r===1){F.page=1;await play(TEXT.wrenPage);await pickup('wrenpage')}
 else{F.gotName=1;await play(TEXT.wrenName);await pickup('name')}
 checkpoint()}

// THE STACKS (24 x 18): rolling shelves in rows, the evidence cage (top right), the stock cage (bottom right), the
// terminal and Dot's desk (bottom left), the stairs down in the back wall, the dock door and the lobby stairs below.
// After midnight it's the danger zone: Internal Security walks it.
const BEAT={stock:[[16,14],[17,14],[18,14],[19,14],[20,14],[21,14]],desk:[[1,12],[2,12],[3,12],[4,12],[5,12],[6,12],[7,12]],
 stairs:[[7,3],[8,3],[9,3],[10,3],[11,3],[12,3],[13,3]],aisle:[[10,9],[11,9],[12,9],[13,9],[14,9],[15,9],[16,9]]};
function buildStacks(){const M=room('stacks','THE STACKS',24,18,'o',{alpha:.86}),F=G.flags,N=isNight();
 for(const y of[5,8,11]){put(M,'shelf',2,y,6,1);put(M,'shelf',10,y,5,1)}
 [5,8,11].forEach(y=>{for(let x=2;x<8;x++)M.O[x+','+y]=look('Rolling shelves on rails, cranked tight. Case numbers on every box end.');for(let x=10;x<15;x++)M.O[x+','+y]=look('Boxes of other people\'s worst nights, labeled in marker.')});
 // the evidence cage: the season's pages (the Filing gets up out of it after midnight)
 put(M,'cage',17,3,5,3);[17,18,19,20,21].forEach(x=>M.O[x+',5']={id:'cage',name:TEXT.cage,look:N?TEXT.cageNight:TEXT.cageLook,opts:()=>N||has('pages')?[]:cageOpts(),used:()=>N||has('pages')});
 // the stock cage: the Lantern Box (its maglock fails open at midnight)
 put(M,'stockcage',17,12,4,2);[17,18,19,20].forEach(x=>M.O[x+',13']={id:'stock',name:TEXT.stock,look:N?TEXT.stockNight:TEXT.stockDay,opts:()=>N&&!G.fs.used['box:stock']?[{label:TEXT.stockOpen,run:openStock}]:[],used:()=>!N||!!G.fs.used['box:stock']});
 put(M,'terminal',2,14);M.O['2,14']={id:'terminal',name:TEXT.terminal,look:N?TEXT.terminalDark:TEXT.terminalLook,opts:()=>N||has('routing')&&G.fs.used['terminal']?[]:termOpts(),used:()=>N||has('routing')};
 put(M,'dotdesk',5,14,2,1);M.O['5,14']=M.O['6,14']={id:'dot',name:TEXT.dot,look:TEXT.dotLook,opts:()=>has('dot')?[]:[{use:'sweep',label:TEXT.dotSweep,ok:async()=>{await play(TEXT.dotDo);clue('dot',TEXT.cDot);checkpoint()},fail:()=>said(TEXT.dotFail)}],used:()=>has('dot')};
 put(M,'boxes',22,7,1,1);put(M,'boxes',1,9,1,1);put(M,'boxes',15,15,1,1);
 // the stairs down: maglocked before midnight; after it, the stairs (the second story fight waits on them)
 put(M,'stairsdoor',9,0,2,3,{walk:1});open(M,9,2);M.warps['9,2']=goDown;M.O['10,2']=look(N?TEXT.stairsQ:TEXT.stairsDay);
 // the doors below: the dock (to the lot, before midnight) and the lobby stairs
 open(M,3,17);M.warps['3,17']=async()=>{if(N){await bump(TEXT.dockShut,'up');return}if(!F.dockOpen){await bump('The dock door. Locked from out here too, with a keypad you\'d have to be outside to use.','up');return}await goTo('lot',DOORS.dock,6,'down')};
 open(M,12,17);M.warps['12,17']=()=>goTo('lobby',12,3,'down');
 if(N){M.danger=true;
  const R=[{id:'rstock',types:['guard'],sprite:'guard',name:'Night security',skulls:1,tags:EN.guard.tags,path:BEAT.stock,look:'A guard with a flashlight walks back and forth in front of the stock cage, very slowly, like it\'s his.',guard:openStock},
   {id:'rdesk',types:['guard'],sprite:'guard',name:'Night security',skulls:1,tags:EN.guard.tags,path:BEAT.desk,look:'A guard walks the row by the terminal and Dot\'s old desk, shining his light into every box end.',guard:null}];
  const xs=[{id:'rstairs',types:['guard'],sprite:'guard',name:'Night security',skulls:1,tags:EN.guard.tags,path:BEAT.stairs,look:'A guard walks the top aisle by the stairs door. Somebody upstairs told him to. He looks like he\'s been told a lot of things tonight.',guard:null},
   {id:'raisle',types:['guard'],sprite:'guard',name:'Night security',skulls:1,tags:EN.guard.tags,path:BEAT.aisle,look:'A guard walks the middle aisle with a clipboard. A clipboard, in the dark.',guard:null}];
  M.roamers=R.concat(xs.slice(0,extraRoamers()));
  M.arrive=stacksNight}
 else M.arrive=async()=>{if(!F.stacks1){F.stacks1=1;await cut('stacks',()=>play(TEXT.stacksIn));checkpoint()}};
 return M}
function cageOpts(){const read=async()=>{await play(TEXT.cageDo);await horror(HORRORS.cage);clue('pages',TEXT.cPages);checkpoint()};
 return[{use:'sweep',label:TEXT.cageSweep,ok:read,fail:()=>said(TEXT.cageFail)},{use:'examine',label:TEXT.cageExam,ok:read,fail:()=>said(TEXT.cageFail)},{use:'identify',label:TEXT.cageOcc,ok:read,fail:()=>said(TEXT.cageFail)}]}
function termOpts(){const ok=async()=>{G.fs.used['terminal']=1;await play(TEXT.terminalDo);if(!has('routing'))clue('routing',TEXT.cRouting);checkpoint()};
 return[{use:'crack',label:TEXT.terminalCrack,ok,fail:()=>said(TEXT.terminalFail)},{use:'backdoor',label:TEXT.terminalBack,ok,fail:()=>said(TEXT.terminalFail)}]}
async function openStock(){if(!isNight())return;const items=['firstaid','roadflare','armor'].concat(intelOn('boxes')?['molotov']:[]);
 await lanternBox('stock',items,TEXT.stockBox);if(!holdItem('lbox')&&!G.flags.bound){await said(TEXT.stockEmpty);await pickup('lbox')}checkpoint()}
async function stacksNight(){const F=G.flags;
 if(!F.filing)return filingFight();
 if(F.night1)return;F.night1=1;
 await cut('stacksNight',()=>play(TEXT.stacksNight));
 // Search's On guard (75), or Big Hat's Internal topic: the guards' beats show
 const L=lead();
 if(intelOn('internal')){setTrail(G.M.roamers.flatMap(r=>r.path),'beat');await said(TEXT.nightOk)}
 else if(skillVal(L.a,'Search')>=75&&!G.fs.used.onguard){G.fs.used.onguard=1;const o=SR.pct(chanceOf(L,'Search'));
  await say('',resultLine('ON GUARD · SEARCH',o),{auto:1000});
  if(o.ok){setTrail(G.M.roamers.flatMap(r=>r.path),'beat');await said(TEXT.nightOk)}else{tried(L,'Search');await said(TEXT.nightFail)}}
 checkpoint()}
// the Filing (a story fight after midnight): the first time into the stacks in the dark
async function filingFight(){const F=G.flags;if(F.filing)return;
 await cut('filing',()=>play(TEXT.filing1));
 const r=await battle(['filing'],{story:true,intro:TEXT.filingIntro});if(r==='lose')return gameOver();
 F.filing=1;await play(TEXT.filingDone);checkpoint();await stacksNight()}
// the stairs down: maglocked before midnight; after it, Pruitt and Vale on the stairs the first time (Credentials talks
// them past; the fight is overstepping, seen), then the sub-basement
async function goDown(){const F=G.flags;
 if(!isNight()){await bump(TEXT.stairsDay);return}
 if(!F.stairs){
  await cut('sec',()=>play(TEXT.sec1));
  let past=false;
  await hotspot({name:'SECURITY',opts:[
   {use:'creds',label:TEXT.secCreds,ok:async()=>{past=true;F.stairs='talked';await play(TEXT.secCredsDo)},fail:()=>play(TEXT.secCredsFail)},
   {label:TEXT.secFight,run:async()=>{}}]},'sec',{scene:true});
  if(!past){const r=await battle(['sec','sec'],{story:true,intro:TEXT.secIntro});if(r==='lose')return gameOver();
   F.stairs='fought';await play(TEXT.secDone);checkpoint();await overstepHere('seen')}
  checkpoint()}
 return goTo('basement',10,10,'up')}

// SUB-BASEMENT 2 (20 x 12): after midnight only. The incinerator and the out-tray cart on the left, the boiler on the
// right, the cold room's vault door in the back wall (the boss: Go in / Not yet), the 9 door if the season left one.
// Everything but the cold room is reached without crossing its door (The boss waits for you).
function buildBasement(){const M=blank('basement','SUB-BASEMENT 2',20,12,'o','night'),F=G.flags,A=arcOf();M.alpha=.84;M.warm='#ff7a5a';
 block(M,0,0,20,3);block(M,0,0,1,12);block(M,19,0,1,12);block(M,0,11,20,1);put(M,'baseroom',0,0,20,12,{walk:1});
 put(M,'vault',8,0,4,3,{walk:1});open(M,9,2);open(M,10,2);M.warps['9,2']=M.warps['10,2']=bossAsk;M.O['8,2']=M.O['11,2']=look('COLD STORAGE, stenciled. The door\'s a foot thick. It\'s open an inch.');
 put(M,'incinerator',2,3,3,2);[2,3,4].forEach(x=>M.O[x+',4']={id:'incin',name:TEXT.incin,look:()=>said(F.lit?TEXT.incinDone:TEXT.incinLook),opts:()=>incinOpts(),used:()=>!!F.lit&&!!F.burn});
 put(M,'cart',6,4);M.O['6,4']={id:'cart',name:TEXT.cart,look:async()=>{await play(F.burn?['The cart is empty. A few gray flakes in the wire.']:TEXT.cartLook);if(!F.burn&&(tally().kept|0)>0)await said(TEXT.cartGaps)},opts:()=>cartOpts(),used:()=>!!F.burn};
 put(M,'boiler',15,3,3,2);[15,16,17].forEach(x=>M.O[x+',4']=look(TEXT.boiler));
 put(M,'pipes',1,0,6,3,{walk:1});M.O['5,2']=look(TEXT.pipes);
 if(A.nine){put(M,'ninedoor',14,0,2,3,{walk:1});open(M,14,2);M.warps['14,2']=nineDoor;M.O['15,2']=look(TEXT.nine)}
 else{put(M,'pipes',13,0,4,3,{walk:1})}
 put(M,'hanglamp',5,6,1,1,{walk:1});put(M,'hanglamp',14,7,1,1,{walk:1});
 open(M,10,11);M.warps['10,11']=()=>goTo('stacks',9,3,'down');
 M.arrive=async()=>{if(!F.base1){F.base1=1;await cut('base',()=>play(TEXT.baseIn));await trigger('subject','the dark');checkpoint()}};
 return M}
// the incinerator: Fix it (Craft) or Sample (Science) lights the pilot, or a road flare does it with no roll; then the
// cart can burn (−10 HP, and the Ledger can be burned at the end). Burning asks first: the pages can't come back.
function incinOpts(){const F=G.flags;if(F.lit)return[];const lit=async()=>{F.lit=1;await said(TEXT.incinLit);checkpoint()};
 return[{use:'fix',label:TEXT.incinFix,ok:lit,fail:()=>said(TEXT.incinFail)},{use:'sample',label:TEXT.incinSample,ok:lit,fail:()=>said(TEXT.incinFail)},
  {item:'roadflare',label:TEXT.incinFlare,run:lit}]}
function cartOpts(){const F=G.flags;if(F.burn||!F.lit)return[];return[{label:TEXT.burnQ.replace('?',''),run:burnCart}]}
async function burnCart(){const F=G.flags;if(F.burn||!F.lit)return;
 const r=await askNotYet(TEXT.burnQ,TEXT.burnOpts);if(r!==0)return;
 F.burn=1;await play(TEXT.burnDo);checkpoint()}
// the 9 (the arc's walk-away): the number that followed the team all season is a door here. Opening it is an Unsettling
// horror for all three; it leads to the cold room, so it asks Go in / Not yet like the vault door.
async function nineDoor(){const F=G.flags;
 if(!F.nineSeen){F.nineSeen=1;await cut('nine',()=>play(TEXT.nineQ));await horror(HORRORS.nine);checkpoint()}
 return bossAsk()}
// The boss waits for you (Gameplay loop; play.md): Go in / Not yet at the cold room's door, cursor on Not yet
async function bossAsk(){const F=G.flags;if(F.boss)return;
 const r=await askNotYet(TEXT.coldQ+' '+TEXT.coldClose,TEXT.turnOpts.map((t,i)=>i?t:'Go in'));
 if(r===0)return bossFight();
 G.dir='down';await stepBack()}
// The Almoner (Bosses; Combat numbers, Season finale boss row; tuned Nov 25, 2026 with tools/boss-sim.js). 78 HP; −10 if
// the out-tray burned, −8 if Wren tore out her page (−6 if she gave up his name instead), and the season's cut (kept pages and hidden items −2 each, up to
// −8; −4 if the forged page burned): at most 31 off (40%). Phase 1, polite: a reach (4), a line read aloud at everyone
// (1), a deal (2: once per agent). Phase 2 at half: +5% to hit, one more reach, the page storm (2) and a page in the face
// (1), unless his name was read aloud, which stops the storm. The right deduction makes Identify free.
async function bossFight(o={}){
 const F=G.flags,A=arcOf();F.bossSeen=1;
 await cut('cold',async()=>{await play(TEXT.cold1);if(A.nine)await said(TEXT.coldNine)});await horror(HORRORS.cold);if(!party.some(m=>!m.gone&&m.san>0))return gameOver();
 await cut('boss',async()=>{await said(TEXT.bossSay);await said(TEXT.bossSay2);if(F.burn)await said(TEXT.bossBurned);if(F.page)await said(TEXT.bossPage);else if(F.gotName)await said(TEXT.bossNamed);
  if(A.agnes==='burn')await said(TEXT.bossAgnes);else if(A.agnes==='sacrifice')await said(TEXT.bossSacr);if((tally().kept|0)+(tally().hidden|0)>0)await said(TEXT.bossGaps)});
 checkpoint();
 const E=EN.almoner,right=F.deduce==='right';
 E.records=()=>has('name')||!!F.gotName;
 E.acts={deal,pages,shake};
 E.phase2={at:.5,hit:5,moves:{hit:1,get pages(){return G.flags.named?0:2},get shake(){return G.flags.named?0:1},deal:-2},line:TEXT.bossPhase,
  on:async e=>{await bsay(G.flags.named?TEXT.bossCalm:TEXT.bossStorm,1400)}};
 const cuts=Math.min(CUT.max,(F.burn?CUT.burn:0)+(F.page?CUT.page:F.gotName?CUT.name:0)+arcCut()),hp=E.hp-cuts;
 const r=await battle(['almoner'],{boss:true,hp,intro:TEXT.bossIntro,onStart:async()=>{
  Bt.en.forEach(e=>{e.offered=[]});
  if(cuts)await bsay(TEXT.bossThin,1500);
  if(right){G.fs.ident=G.fs.ident||[];if(!G.fs.ident.includes('en:almoner'))G.fs.ident.push('en:almoner');await bsay(TEXT.bossIdent,1500)}
  if(holdItem('name'))await bsay(TEXT.bossName,1400)}});
 if(r==='lose')return gameOver();
 if(o.noEnd)return;  // the simulator stops at the fight's end
 F.boss=1;await ending();
}
// a deal (phase 1, once per agent): his kindest move. Sign: full SAN back, the agent becomes an account (a Season 2 mark
// on the roster agent, a.account), and he writes the name in (+4 HP). Refuse: SAN 0/1. Nobody left to offer: a reach.
async function deal(e){
 const cand=party.filter(m=>!m.ko&&!m.dead&&!m.gone&&!m.out&&!(e.offered||[]).includes(m));
 if(e.ph2||!cand.length){const t=pickTarget(e);if(t)await foeHits(e,t,e.dmg);return}
 const m=pick(cand);e.offered=(e.offered||[]).concat([m]);
 const mots=m.a.motives||[],mot=mots[m.a.main|0]||mots[0]||'What you want';
 await bsay(fill(TEXT.dealOffer,{n:m.name,m:mot}),1600);
 const r=await ask(m.name.toUpperCase(),fill(TEXT.dealAsk,{n:m.name}),TEXT.dealOpts);
 if(r===0){m.san=m.msan;m.a.account=true;G.flags.deals=(G.flags.deals|0)+1;applySan();if(Bt)updHUD();
  for(const l of TEXT.dealYes)await bsay(fillT(l,{n:m.name}),1300);
  const h=Math.min(4,e.mhp-e.hp);if(h>0){e.hp+=h;await bsay(TEXT.dealHeal,1100)}return}
 await horror({spec:['0','1'],label:TEXT.dealNoLabel,kind:'unnatural'},{who:[m]})}
// the page storm (phase 2): 1d2 to everyone, and a page that cuts leaves them Bleeding
async function pages(e){await bsay(TEXT.pages,1100);for(const m of targetsOf(e,true))await foeHits(e,m,'1d2',{bleed:true})}
// a page in the face (phase 2): one agent is Shaken and makes a 0/1 SAN roll
async function shake(e){const t=pickTarget(e);if(!t)return;await bsay(fillT(TEXT.shake,{n:t.name}),1300);await addStatus(t,'shaken',{noShrug:true});
 await horror({spec:['0','1'],label:TEXT.shakeLabel,kind:'unnatural'},{who:[t]})}
window.l03Boss=()=>bossFight({noEnd:true});  // the boss simulator's entry (tools/boss-sim.js)

// ================= OVERSTEPPING (Skills and menus, Overstepping and cover stories) =================
// A quiet case: the agents came in on a "filing emergency". A climb plays its line, then the step's scene: Noticed
// (Desmond clams up), the watch officer (Local chief: Intake locks until midnight), Big Hat's call (Agency call), and the
// clean-up crew at the next area change (Federal agents).
async function overstepHere(seen){if(!(await overstep(seen)))return;await stepScene()}
async function stepScene(){
 const F=G.flags,s=stepName();
 if(s==='Noticed'&&!F.noticed){F.noticed=1;await play(TEXT.noticed)}
 if(s==='Local chief'&&!F.chief){F.chief=1;if(!isNight())F.intakeShut=1;await play(TEXT.chief)}
 if(s==='Agency call'&&!F.call){F.call=1;await play(TEXT.call)}
 if(s==='Federal agents')F.fedsDue=1;
 checkpoint()}
async function onArea(){if(G.flags.boss)return;await feds(TEXT,play)}

// ================= ENDING =================
// clean: the Ledger burned (needs fire: the lit incinerator, a road flare or a Molotov). costly: bound in the empty
// Lantern Box (needs his true name and the box). worst: neither ready, so he walks out with half a book. When both are
// ready, the player picks.
const fireReady=()=>!!G.flags.lit||!!holderOf('roadflare')||!!holderOf('molotov');
const bindReady=()=>!!G.flags.gotName&&holdItem('lbox');
function endingLabel(){const F=G.flags;return F.end||'worst'}
const lostHere=()=>(store.get(B.key('memorial'),[])||[]).filter(x=>x&&x.case===G.case&&!x.done);
// what the debrief and the season read (bl.season, the case's facts): arc.finale is the ending, for season.js's
// season-end lines
function endingFacts(label){const F=G.flags;
 return{label,clues:G.clues.map(c=>c.id),saved:0,overstep:stepName(),
  san:party.map(m=>({id:m.a.id,name:m.name,from:m.san0,to:m.san})),
  items:party.flatMap(m=>gearOf(m).it.filter(it=>it.pin).map(it=>it.k)).concat((G.fs.pack||[]).filter(it=>it.pin).map(it=>it.k)),
  choices:{deduce:F.deduce||null,wren:F.wren||null,page:!!F.page,name:!!F.gotName,named:!!F.named,burn:!!F.burn,lit:!!F.lit,deals:F.deals|0,stairs:F.stairs||null,forced:!!F.forced,photo:has('photo'),end:F.end||null},
  arc:{finale:label},
  tried:party.map(m=>({id:m.a.id,skills:m.tried||[]})),
  lost:lostHere().map(x=>({name:x.name,how:x.how}))}}
async function ending(){
 const F=G.flags;
 await play(TEXT.end1);
 const opts=[];if(fireReady())opts.push(0);if(bindReady())opts.push(1);
 let pickE=opts.length?opts[0]:-1;
 if(opts.length>1){const r=await ask('',TEXT.endQ,[TEXT.endBurn,TEXT.endBind]);pickE=r===1?1:0}
 if(pickE===0){F.end='clean';
  if(!F.lit&&!holderOf('molotov')&&holderOf('roadflare')){const h=holderOf('roadflare');spend(h.m,h.it)}
  await play(TEXT.endBurnDo);await play(F.page?TEXT.endBurnWrenFree:TEXT.endBurnWren);await said(TEXT.endBurnRoom)}
 else if(pickE===1){F.end='costly';F.bound=1;await play(TEXT.endBindDo);dropItem('lbox');await said(TEXT.boxGet);await pickup('boxed');await play(TEXT.endBindWren)}
 else{F.end='worst';await play(TEXT.endFled);await play(TEXT.endFledWren)}
 if(F.end!=='costly')await trigger('death');
 checkpoint();
 await fade(1);G.mode='scene';await fade(0);
 await said(TEXT.dawn);
 const label=endingLabel();await debrief(label,endingFacts(label));  // Big Hat's debrief and the case gains (debrief.js)
}

// ================= THE DEBRIEF (spec 007) =================
// The clues the card counts, Big Hat's lines by ending and about the choices, the closing memo (every ending), the cover
// stories (2 with a skill, the weak Luck one, the easy one for a quiet case kept Clean, Clean books'), and the lines
// after Wren's page or the sealed box is bagged. The finale's debrief skips the shared off-the-books question
// (debrief.js). Clean plays in the donut shop (he's reinstated); costly and worst at the payphone.
const DB=TEXT.db;
const DEBRIEF_DATA={
 clues:['signin','routing','pages','lily','dot','shred','photo','name'],victims:0,
 lines:{clean:DB.clean,costly:DB.costly,worst:DB.worst},
 react:F=>{const c=F.choices||{},out=[];if(c.deals)out.push(DB.deal);if(c.wren==='turned')out.push(c.page?DB.page:DB.wren);if(c.burn)out.push(DB.burned);if(c.deduce==='wrong')out.push(DB.wrong);
  if(c.forced)out.push(DB.forced);if(c.stairs==='fought')out.push(DB.stairs);return F.label==='worst'?out.slice(0,1):out.slice(0,2)},
 end:DB.memo,
 stories:[{name:DB.fire,skill:'Bureaucracy',verb:'paper it',pass:DB.firePass},{name:DB.audit,skill:'Persuade',verb:'sell it',pass:DB.auditPass}],
 weak:{name:DB.weak,pass:DB.weakPass},
 easy:{name:DB.easy,skill:'Persuade',verb:'sell it',mod:30,pass:DB.easyPass},
 safe:{name:DB.safe,pass:DB.safePass},
 bagged:{wrenpage:DB.filedPage,boxed:DB.filedBox}
};

// ================= OPENING (Big Hat on a payphone) =================
// Each cut is a cutscene B skips once seen (engine.js); the questions always play. No requisition: he's suspended.
async function caseOpening(){
 const s=loadSeason(),l01=s.cases['lantern-01'];
 await cut('open',async()=>{await said(TEXT.open1);await said(TEXT.open2)});
 await bigHatScene(async()=>{
  await cut('brief',async()=>{await play(TEXT.brief);await shout(TEXT.briefShout);await play(TEXT.brief1b);if(l01&&l01.state==='closed')await play(TEXT.briefW)});
  await twoQuestions(TEXT.intel);
  await cut('brief2',()=>play(TEXT.brief2));
  await cut('brief3',()=>play(TEXT.brief3));
 },{place:window.L03A.payphone});
 G.flags.ph=0;G.mode='world';goMap('lot',8,13,'up');checkpoint();await fade(0);
 // LANTERN 02 copied the diary's back pages: the team comes in already holding her entry
 if(arcOf().ledgerCopy&&!has('copy'))clue('copy','The copied Ledger entry from the diary\'s back pages: "Wren Hollis, for Lily," dated eleven years ago.');
 await cut('arrive',async()=>{
  for(const m of squad())await say(m.name.toUpperCase()+' · '+profOf(m.a).name.toUpperCase(),TEXT.role[profOf(m.a).role]||TEXT.roleAny);
  await said(TEXT.arrive)});
 checkpoint();
}
// the Case file's Next line
const caseNext=()=>{const N=TEXT.next,F=G.flags,n=keyClues();
 if(F.boss)return N.home;if(isNight())return N.night;if(!inside())return N.lot;
 if(F.deduce)return N.wait;if(n<3)return N.day.replace('{n}',n);return N.phone};

// ================= ON THE CASE BOARD =================
// The finale (spec 009, step 4; spec 015): seasons/season-1.js lists it as the finale, with its unlock count. Closing it
// never raises closed, and the season end screen plays after its home phase (season.js). portraits: the people's faces
// (lantern-03-art.js) and the boss's (lantern-03-battle-art.js). sprite/spriteSize: battle sprites (the clean-up agent
// is Still Harvest's SHB).
const MAPS={lot:buildLot,lobby:buildLobby,intake:buildIntake,stacks:buildStacks,basement:buildBasement};
registerCase({id:'lantern-03',card:caseCard,opening:caseOpening,intel:TEXT.intel,maps:MAPS,tiles:{},unlock:TEXT.unlock,
 portraits:name=>window.L03A.portraits[name]||(name==='THE ALMONER'?window.L03B.portrait:null),
 enemies:EN,sprite:(k,f,w)=>k==='fed'&&window.SHB?SHB.sprite('fed',f,w):L03B.sprite(k,f,w),spriteSize:k=>k==='fed'&&window.SHB?SHB.size('fed'):L03B.size(k),
 backdrop:(p,o)=>L03B.backdrop(p,o),
 // Big Hat's place: the payphone (he's suspended); a clean ending's debrief is back in the donut shop (reinstated)
 get place(){return G.db&&G.db.label==='clean'?null:window.L03A&&L03A.payphone},
 items:CASE_ITEMS,next:caseNext,quiet:true,loot:LOOT,onArea,
 debrief:DEBRIEF_DATA,label:endingLabel,facts:endingFacts});
})();
