// Black Lantern · cases/lost-hour.js
// CASE: Lost Hour (FILE 04), Cullen Gap, Virginia, on a two-lane road through the Blue Ridge, in April (spec 016).
// Part A (Nov 23, 2026): the card, every map (Cullen Gap by day and night, the Pruett house, the diner, the clinic and its
// sleep lab and exam room, the ridge road and the woods below the overlook in fog by night, and the finale area), the
// townsfolk and the Pruetts on the map and in the dialog box, Big Hat's own briefing place, and walkable maps.
// Part B (Nov 23, 2026): the story and play, written from the secret case file: the text block, the briefing's four
// topics and their edges, clues on a timeline, the night drive and the hypnosis session (each with its own picture), a
// deduction, the hard choice, overstepping in a quiet case, two story fights, the woods' roamers, a Lantern Box, the
// soft clock, the motivation moments, the boss and its tuning, the debrief's facts and cover stories, and the endings.
// Art is cases/lost-hour-art.js (window.LHA, the maps and people) and cases/lost-hour-battle-art.js (window.LHB, the
// enemies, the boss's face, the battle backdrops and the two set pieces' pictures), loaded right after this file.
// Needs engine.js, field.js and battle.js first. The whole file sits in one function so its names never meet another case's.
(function(){

// ================= TEXT =================
// Every line of the case (Voice). A list plays box by box: a plain string is narration, ['WHO', 'line'] is someone
// talking. {code} and {first} are the lead's, with pronoun tokens like {first.they} (Agent creator, Pronouns and body);
// {n}, {t} and the other one-letter keys are filled by the script (agents' names go through fillT, so their pronouns follow).
const TEXT={
 next:{day1:'Day 1. Talk to the Pruetts and the town. Timeline {n}/7. Take the car up the ridge road when you\'re ready.',
  night1:'Night 1. The ridge road in fog: the overlook, and the woods below it. Call it a night at the car.',
  owen:'Night 1. Owen called from the clinic. Something\'s in there with him. Drive down.',
  day2:'Day 2. Owen\'s ready for the session in the sleep lab. Timeline {n}/7. With 3, sit down at the Pruetts\' table.',
  deduce:'Day 2. Sit down at the Pruetts\' kitchen table with what you\'ve got.',
  carrier:'Day 2. Somebody has to carry it tonight. Talk to Ray in the kitchen.',
  proc:'Day 2. Dr. Rao is waiting in the exam room.',
  dark:'Day 2. Wait for dark at the car.',
  night2:'Night 2. The pasture gate at the end of Laurel Street.',home:'Get home.'},
 phase:['DAY 1 · AFTERNOON','NIGHT 1 · THE RIDGE ROAD','DAY 2 · RAIN','NIGHT 2 · FOG'],
 rewritten:'This case file was rewritten while you were away. Your team starts it over from the briefing, with everything they carry.',
 // ---- the briefing, in the laundromat off I-81 ----
 open1:'TUESDAY · 4:06 AM',
 open2:'A text from an unlisted number: "I-81, EXIT 247. THE SPIN CITY. BRING QUARTERS."',
 brief:['A 24-hour laundromat off the interstate. One tube light flickering. Every dryer is turning, and nobody else is here.',['BIG HAT','Agent {code}. Sit. Don\'t touch that basket, it ain\'t mine.'],
  'He\'s in a molded plastic chair. A dryer behind him turns something red, around and around.',
  ['BIG HAT','Cullen Gap, Virginia. Ray and Donna Pruett. Their girl got married in Elkton three Saturdays back.'],
  ['BIG HAT','They left the reception at ten. Forty minutes of mountain road. They pulled in their driveway at a quarter past three.'],
  ['BIG HAT','Nobody remembers the five hours. Car\'s got a burn mark on the hood like somebody set a hot pan on it.'],
  ['BIG HAT','And a full tank. Ray swears it was on empty. Ray\'s a man who knows his gas gauge.']],
 briefShout:'NOBODY FILLS YOUR TANK FOR FREE IN VIRGINIA.',
 brief2:['A dryer buzzes. He waits for it to stop.'],
 // Big Hat's two questions (spec 013): the four topics, his two-box answer, the Case file's INTEL line. The edges are in
 // the scripts: 'pruetts' +10 Empathy with Ray and Donna, 'hours' fills the timeline's first box, 'ridge' the lantern
 // reaches further in the ridge road's fog and the route shows, 'cover' +10 Bureaucracy with Deputy Hensley.
 intel:[
  {id:'pruetts',label:'The Pruetts',answer:['Ray and Donna. Married forty years. Signed up for a sleep study \'cause she can\'t sleep, and he won\'t admit he can\'t.','Be nice to \'em. They\'re the kind that send a thank-you card for a thank-you card.'],
   note:'Ray and Donna Pruett, married forty years. They signed up for the sleep study. Go gentle.'},
  {id:'hours',label:'The missing hours',answer:['Left a weddin\' at ten. Their girl\'s got \'em on her phone, walkin\' out the door at 10:02.','Home at a quarter past three. It\'s forty minutes of road. I drove it. Took me thirty-eight.'],
   note:'They left the reception at 10:02 PM and got home at 3:15 AM. The drive takes forty minutes.'},
  {id:'ridge',label:'The ridge road',answer:['Mile thirty-one. Fog sits on it like it pays rent.','There\'s a pull-off and an overlook. Park there. Don\'t lean on the wall.'],
   note:'The ridge road, mile 31: a pull-off and an overlook, in fog most nights.'},
  {id:'cover',label:'The cover',answer:['You\'re from the sleep study. Lab coats, clipboards, a consent form you won\'t read neither.','Town\'s got one deputy. Hensley. She reads everything. Bring the paperwork.'],
   note:'Cover: researchers from the Blue Ridge sleep study. Deputy Hensley will want paperwork.'}],
 brief3:[['BIG HAT','Quiet case. Nobody knows we\'re there but the Pruetts, and they asked for help.'],['BIG HAT','Get the hours back. Find out what\'s behind Ray\'s ear. Before they call the paper, \'cause Ray wants to.'],
  ['BIG HAT','Don\'t make \'em sorry they let you in.']],
 brief4:['He stands up. The dryer behind him stops. The red thing in it was a sweater.',['BIG HAT','And {first}? Take your laundry.'],'It isn\'t your laundry. You take it anyway.'],
 arrive:'LOST HOUR. Talk to people with A. Press START for your notebook. The timeline\'s in the Case file.',
 role:{Investigator:'Five hours. Somebody spent them somewhere.',Healer:'A lump the doctor won\'t explain. I want that scan.',Analyst:'Forty minutes of road and five hours of nothing. That\'s a math problem.',
  Vanguard:'Small town. One deputy. Nice and quiet. I hate it.',Lorekeeper:'Lights that don\'t blink. Everybody\'s grandma has a story like that.',Tech:'One bar. The diner\'s got wifi. The password\'s PIE.',
  Bruiser:'They took two old folks off a mountain. Somebody\'s getting hit.',Support:'They\'re scared. Let\'s not make it worse.',Tracker:'Ridge country. Bears, rattlers, and a lot of places to lose a car.',
  Confessor:'Forty years married and something got between them for one night. That\'ll leave a mark.',Courier:'I\'ve driven that ridge in fog. You don\'t, if you can help it.',
  Undertaker:'Nobody died. Yet. That\'s a nice change.',Scrapper:'A burned ring on a hood and the paint\'s like new inside it. I want to see that.',Morale:'There\'s a diner. I\'m just saying, there\'s a diner.'},
 roleAny:'Let\'s get them their night back.',
 // ---- the timeline: each clue's note opens with its box's time (the Case file lists them in this order) ----
 cl:{left:'10:00 PM · They left the reception at the Elkton Grange. Jenna\'s phone has them in the door at 10:02.',
  radio:'10:35 PM · The car died at mile 31. The radio\'s clock stopped at 10:35 and never started again.',
  seam:'10:40 PM · Lifted at mile 31, car and all. The tire tracks go up the overlook wall and off into the air.',
  tally:'11 PM–2 AM · Measured. Behind Ray\'s left ear: a seed of his own bone, with a root.',
  memory1:'1 AM · The tables. Cold, and dark everywhere but the place they were working on.',
  m2r:'2 AM · They had Ray count to nine, over and over, in a voice that wasn\'t his.',
  m2d:'2 AM · They asked Donna which of them to keep. She said Ray. That\'s why it\'s in him.',
  tank:'3:15 AM · Home with a full tank, the gas cap on inside out, and no gas bought anywhere in three counties.'},
 // ---- the car and the day (Turning the day: Go on / Not yet, cursor on Not yet) ----
 car:'Your car. A rental, with a SLEEP STUDY parking permit on the dash.',
 carOpt:{ridge:'Drive up the ridge road',down:'Drive back down to Cullen Gap',clinic:'Drive down to the clinic',rest:'Call it a night',dark:'Wait for dark',
  lights:'Aim the headlights up the pasture',flares:'Line the gate with road flares'},
 turnOpts:['Go on','Not yet'],
 turnQ:['Drive up the ridge road? The day ends on the mountain.','Call it a night? Day 2 starts in the morning.','Wait for dark? Night 2 starts.'],
 turnClose:['Birdie leaves Cullen Gap tonight.','The ridge road and the woods below the overlook close for good.','The sleep lab and the exam room close, and the session can\'t be run again.'],
 needClues:'Not yet. The timeline has {n} of 7 boxes. You need 3 before you sit down with the Pruetts.',needDeduce:'Sit down at the Pruetts\' kitchen table first. Big Hat wants to hear it.',
 needCarrier:'Somebody has to carry it tonight. Talk to Ray.',needProc:'Dr. Rao is waiting for you in the exam room.',
 rested:[[],['You find a motel off the highway, the kind with a horse on the sign. Nobody sleeps much.','In the morning it\'s raining. The ridge is gone into the clouds like it was never there.'],
  ['You wait it out at the motel. The rain stops at dusk. The fog doesn\'t.','Up on the hill above Laurel Street, the pasture is white with it, and it\'s getting thicker.']],
 secondDrive:'Back up the mountain. It costs you the better part of an hour, and down in Cullen Gap, Ray Pruett is looking at the phone book.',
 driveTo:{town:'Back down the mountain. The fog lets go at the town line, like it was only borrowing you.'},
 // ---- the night drive (its own picture: the windshield, the fog, the mile markers) ----
 drive:['You take the ridge road the way they took it. Same time of night, near enough. Same two lanes.','Mile 27. The fog comes down to meet the headlights and stops there, like a wall somebody painted.',
  'Mile 29. Somebody\'s radio station out of Harrisonburg plays a song about a truck. Then a song about a different truck.',
  'Mile 30. The station goes to a hiss. Then, under the hiss, very faint: a dial tone.','Mile 31. The pull-off. You park where they must have stopped, and the engine ticks as it cools.'],
 driveH:'Lights in the fog that don\'t blink',
 ridgeIn:'The overlook. Below the stone wall, fog and the tops of trees. The cold comes off it like an open freezer.',
 glimsIn:['Over the guardrail, three lights come up out of the fog. Fist-sized. White. Bobbing, like they hang on strings from something you can\'t see.','They make a sound. It\'s a dial tone. All three, a little out of tune with each other.'],
 glimsIntro:'The Glims drift in over the guardrail!',
 glimsDone:['The last light goes out like a cigarette in a puddle. The dial tone stops.','The fog closes back over the guardrail. Somewhere far down the mountain, a dog barks once and thinks better of it.'],
 owenCall:['Your phone buzzes. Cullen Gap number.',['OWEN','Hey! Hi. It\'s Owen, from the lab. Sorry. Hi.'],['OWEN','So there\'s something in the exam room. It\'s really tall. It\'s looking at Mr. Pruett\'s scan.'],
  ['OWEN','I\'m in the observation room with the door locked and I\'m whispering. Can you guys come? Please?']],
 // ---- the hidden hotspot: only there while the lead is High on Mushrooms ----
 seamName:'THE SEAM',
 seamLook:['High, the fog over the drop has a seam in it. A straight line, like a fold in paper, running up into the dark.','Along the wall, the Pruetts\' tire tracks go up the stone, over the top, and off into nothing. They come back down twenty feet to the left.',
  'Where the seam meets the wall, somebody has scratched a tally in the stone. Very neat. Four strokes and a cross.','Then a fifth group, with one stroke missing.'],
 seamDue:'A count with a gap in it. You know what a gap in a count means. One more is coming.',
 seamH:'A seam in the fog',
 register:'TRAIL REGISTER',registerLook:'A wooden box on a post. SIGN IN. A pencil on a string. The book inside is damp.',registerOpt:'Look in the box',
 registerFind:'Under the book, a sandwich bag of little dried mushrooms. A note on it in pencil: FOR THE VIEW.',
 tracks:'THE WALL',tracksLook:'The overlook\'s stone wall. Below it, fog, and the tops of trees.',tracksOpt:'Look at the tire tracks',
 tracksDo:['Mud in the pull-off, tire tracks pressed in it. They go straight at the wall and don\'t stop.','Up the face of the stone, there\'s rubber. Two black stripes. On top of the wall, two more.','Twenty feet to the left, two stripes coming back down. Like the car went for a walk.'],
 tracksFail:'Mud, gravel, a lot of other people\'s tires. Nothing you can pull out of it.',
 // ---- the woods (the danger zone) ----
 woodsIn:'The trail goes down off the end of the wall into thick fog. You can see about as far as your own hand. The creek is loud below.',
 pathOk:'You read the slope and find the line the deer use, down the switchbacks, away from whatever\'s moving out there.',pathFail:'The fog turns the trail around on you twice. You go down by feel.',
 shoeName:'A SHOE',shoeLook:'A woman\'s shoe, half in the mud. Red, a little heel, a little bow. Nice. For a wedding.',shoeTake:'Take it back for her',
 shoeDo:'You wipe it off on your sleeve. There\'s mud inside, and a dogwood petal, and nothing else.',
 hubName:'A HUBCAP',hubLook:'A hubcap in the leaves, scratched on the inside.',hubOpt:'Look at the scratches',
 hubDo:['On the inside of the hubcap, scratched very neat: four strokes and a cross. Four strokes and a cross. Four strokes and a cross.','The last group has one stroke missing. Somebody\'s been counting cars on this mountain for a long time.'],
 hubFail:'Scratches. Gravel does that.',
 ledgeName:'UNDER THE LEDGE',ledgeLook:'A rock ledge, dry underneath. Something\'s been shoved back under it, wrapped in a trash bag with a gas-station bow on it.',ledgeOpt:'Pull it out',
 ledgeBox:'Inside the trash bag, a note in Big Hat\'s handwriting: "DONT LEAN ON THE WALL."',
 // ---- the Pruetts: Ray (a liar until the scan: "I feel fine") ----
 ray1:[['RAY','You\'re the sleep people.'],['RAY','I feel fine. It\'s her that can\'t sleep. Lights on all night. Like living in a Walmart.'],
  'He touches the bandage behind his left ear. He doesn\'t know he does it.',['RAY','Thirty-one years with Allegheny Power. I\'ve been up a pole in a lightning storm. I don\'t scare.']],
 rayLie:[['RAY','I feel fine.'],'He says it to the car.'],
 rayRead:['He looks at the car a long time.',['RAY','It hums. Behind my ear. When the fog comes down off the ridge, it hums, like a transformer.'],['RAY','I know what a transformer sounds like. Don\'t tell Donna.'],
  ['RAY','Doc Rao took a picture of it. Go on and look at it. I can\'t.']],
 rayOkLine:['RAY','Go look at the picture. Doc Rao\'s got it. I said you could.'],
 rayAfter:[['RAY','I feel fine.'],'He doesn\'t. Nobody says so.'],
 rayNight2:{ray:[['RAY','I got my good coat on. Donna says I look like a funeral.'],['RAY','Let\'s get it done.']],cut:[['RAY','I don\'t remember the wedding. I remember the cake. Isn\'t that something.']],
  donna:[['RAY','She won\'t let me come. Forty years and she won\'t let me come.']],agent:[['RAY','You take care of yourself up there. I mean it.']]},
 rayCarrierAsk:'He has to agree to it',
 rayYes:[['RAY','Bait. Like a worm.'],['RAY','...All right. I\'ve been up worse places than a cow pasture.'],['DONNA','Ray. RAY. You are not going up that hill.'],['RAY','Donna. Honey. It\'s in me. It\'s coming for me either way. I\'d rather it found me with friends.']],
 rayNo:[['RAY','No.'],['RAY','Ask me again in a little while. Ask me when she\'s not looking at me like that.']],
 // ---- Donna ----
 donna1:[['DONNA','Come in, come in. Don\'t mind the lights.'],'Every lamp in the house is on. It\'s three in the afternoon.',['DONNA','I like it bright in here. That\'s all. I was a school librarian thirty years. You get used to fluorescent.'],
  ['DONNA','The clinic said you\'d want to try the hypnosis. Tomorrow. Whatever you need. I want it back.'],['DONNA','I want to know what I said yes to.']],
 donnaRead:['She\'s smiling. She has a flashlight in her cardigan pocket, and her hand\'s on it.',['DONNA','It was dark. That\'s all I remember. It was dark everywhere except the one spot they were working on.'],
  ['DONNA','I haven\'t told Ray that much. Ray doesn\'t need the dark too.']],
 donnaAfter:[['DONNA','Coffee? It\'s decaf. Doctor\'s orders. It\'s terrible.']],
 donnaShoe:['You set the shoe on the table. Red, with a little bow.',['DONNA','Oh.'],['DONNA','I kicked those off in the car. My feet were killing me. I danced with everybody.'],'She holds it in her lap like a cat. She\'s going to be easier to reach, tomorrow.'],
 donnaNight2:{ray:[['DONNA','If it takes him, you bring me with you. I mean it.']],cut:[['DONNA','He asked me where we got married. Forty years. He asked me where.']],
  donna:[['DONNA','I said yes once. I can say it again.'],['DONNA','He\'s not coming. I locked him in the bathroom. He\'ll get out. He\'s a lineman.']],agent:[['DONNA','You didn\'t have to. You know that.']]},
 // ---- Jenna ----
 jenna1:[['JENNA','Jenna. Their daughter. I drove up from Richmond.'],['JENNA','A sleep study. Sure. My dad doesn\'t sleep because my dad has been awake since 1983.'],['JENNA','Let me see some ID.']],
 jennaLie:'She\'s got her arms folded and her car keys in her fist like a weapon.',
 jennaTell:[['JENNA','Fine.'],['JENNA','I\'ve got them on video. Leaving. I was filming everybody leaving, it\'s a thing my husband\'s family does.'],
  ['JENNA','10:02. Mom\'s carrying her shoes. Dad\'s honking the horn at my uncle. They\'re fine. They\'re totally fine.'],['JENNA','Five hours later, they\'re not.']],
 jennaLean:['You raise your voice. On Laurel Street, in front of the Pruetts\' house. A man two yards down stops mowing.',['JENNA','Okay. OKAY. 10:02. I have it on video. Are you happy?'],'She shows you. Then she goes inside and slams the door, and the man starts mowing again, slower.'],
 jennaAfter:[['JENNA','I\'m watching you. Just so you know.']],
 // ---- Duty (motivation moment): Jenna's question, day 2 in the kitchen ----
 duty:['Jenna\'s at the kitchen table with her phone face up. A number on the screen. Not dialed yet.',['JENNA','That\'s a reporter at the Page Valley Courier. She did a story on a cow that could count.'],
  ['JENNA','So I\'m going to ask you once. Flat.'],['JENNA','Are you even a sleep study?']],
 dutyQ:'What do you tell her?',
 dutyHold:'Hold the cover',dutyTruth:'Tell her the truth',
 dutyHeld:['You tell her about the study. The consent forms, the funding, the sleep architecture. You\'re very good. You hate how good.',['JENNA','...Okay.'],'She puts the phone face down. She doesn\'t believe you. She believes you\'re trying, which is worse.'],
 dutyFailed:['She hears it in your voice before you finish.',['JENNA','You\'re lying to me in my mother\'s kitchen.'],'She takes her phone out to the car. You can see her through the window, talking, with her hand over her eyes.'],
 dutyTold:['You tell her. Not all of it. Enough.',['JENNA','...'],['JENNA','Okay.'],'She deletes the number. Then she goes and sits with her father on the porch, and neither of them says anything for an hour.',
  ['JENNA','Nobody\'s calling anybody. I\'ll take their phones if I have to.']],
 dutyCost:'Somebody\'s going to have to live with that, either way.',
 // ---- Mae and Cecil at the Gap Diner ----
 mae1:[['MAE','Sit anywhere. Coffee\'s on. You\'re the sleep study, I\'d guess. You\'re not from here. I\'d remember.'],
  'There are three pencils stuck in her beehive. She takes one out to write your order and puts it back without looking.',['MAE','I remember every order since 1979. Ray\'s is two eggs over hard and a fight with me about the toast.']],
 maeTalk:[['MAE','Jenna\'s aunt Patty was at the wedding. She was in here Sunday.'],['MAE','Says they left at ten on the nose. Ray honked the whole way out the lot. Donna had her shoes off.'],
  ['MAE','Patty says they looked happy. Patty doesn\'t say that about anybody.']],
 maeCard:[['MAE','Birdie Haskins left this for you before she went. Said you\'re the ones should have it.'],'An envelope with PRUETT on it, folded into a shape you can\'t follow with your eyes.'],
 maeClam:[['MAE','Busy, hon.'],'She\'s not busy.'],
 maeAfter:[['MAE','Refill? Too late.']],
 cecil1:[['CECIL','Coconut cream. Every day since 1987.'],['CECIL','You want to know about the light. Everybody in here wants to know about the light.']],
 cecilTalk:[['CECIL','I was on my porch. 10:40, I know because the news was on through the screen door.'],['CECIL','A light come down over the ridge. Mile thirty-one, about. Didn\'t blink. Planes blink.'],
  ['CECIL','Next morning there\'s a deer in my yard. Standing there. Ring burned on its back, round as a plate.'],['CECIL','It walked off backwards. I\'m eighty-two. I know how a deer walks.']],
 cecilAfter:[['CECIL','Pie\'s good today. Pie\'s good every day.']],
 // ---- Birdie (day 1 only) ----
 birdie1:[['BIRDIE','I\'m the one found the card. Up at the overlook, Sunday morning, birding.'],['BIRDIE','Cerulean warbler. First of the year. And then this.'],
  'She takes an envelope out of her pack. PRUETT on it in Donna\'s handwriting. It\'s been folded into a shape your eyes slide off.',['BIRDIE','It won\'t open. I tried. You take it. I\'m off tonight.']],
 birdieRead:[['BIRDIE','Here\'s the thing that bothers me.'],['BIRDIE','It wasn\'t on the ground. It was sitting on top of the wall. Square in the middle. Like somebody set it down careful.'],
  ['BIRDIE','Nobody walks out on that wall. Fifty foot drop.']],
 birdieShroom:[['BIRDIE','Chanterelles, mostly. Mostly.'],['BIRDIE','Don\'t eat \'em before you drive. And don\'t look at the sky too long.']],
 birdieAfter:[['BIRDIE','Warblers won\'t wait.']],
 birdieOptRead:'Ask about where she found it',birdieOptShroom:'Ask what\'s in the paper bag',
 // ---- Deputy Hensley (the case's Overstepping face) ----
 hensley1:[['DEP. HENSLEY','Deputy Hensley. You\'re the study folks.'],['DEP. HENSLEY','The Pruetts are good people. Ray taught my boy to fish. Be good to them.']],
 hensleyTell:[['DEP. HENSLEY','I ran their plates that night. Jenna called me at one, worried sick.'],['DEP. HENSLEY','Nothing. No gas, no stop, no card swiped anywhere in three counties between ten and three.'],
  ['DEP. HENSLEY','And they came home full. I\'d like to know how. You find out, you tell me.'],'She\'s curious now. That\'s fine. Probably.'],
 hensleyAfter:[['DEP. HENSLEY','Drive careful up top. Fog\'s bad this week.']],
 hensleyNight:[['DEP. HENSLEY','Long night. Go home, study people.']],
 hensleyOpt:'Ask about the night they were missing',hensleyPaper:'Ask for the county\'s fuel reports',
 notice:['Deputy Hensley comes in and sits at the counter next to you. She orders a coffee she doesn\'t drink.',['DEP. HENSLEY','Folks are saying the study\'s asking a lot of questions for a study.'],['DEP. HENSLEY','You got paperwork? I\'d like to see some paperwork.']],
 noticeOk:['You hand her a folder. Consent forms, a grant number, a letterhead with a sleeping moon on it.',['DEP. HENSLEY','...All right. Thank you.']],
 noticeFail:['You hand her a folder. She reads all of it, slow, the way you\'d read a menu in another language.',['DEP. HENSLEY','Huh.'],'Mae stops refilling your cup. Cecil moves down a stool.'],
 // ---- Owen and Dr. Rao at the clinic ----
 owen1:[['OWEN','Oh! Hi. I\'m the night tech. Owen.'],['OWEN','Don\'t mind the headlamp. It\'s a whole thing. The lab lights are out back there and I just never took it off.'],
  ['OWEN','Are you guys, like, the real study? Because I\'ve read about this. On a forum. Greys, right? It\'s always Greys.'],'It is not always Greys.'],
 owenAfter:[['OWEN','I left Mr. Pruett\'s night on the lab computer. If you want it. Password\'s on the monitor. Don\'t tell Dr. Rao.']],
 owenDay2:[['OWEN','I set the lab up for the session. Wires, the good pillow. Mrs. Pruett likes the lights on so I left them on.']],
 owenOrderly:[['OWEN','You came. You came!'],['OWEN','It\'s in the exam room. It hasn\'t moved. I can hear it, like, measuring.']],
 owenThanks:[['OWEN','Okay. Okay okay okay.'],['OWEN','It was looking at his readouts from the first study night. Here. Take them. I printed them. I don\'t want them in the building.']],
 rao1:[['DR. RAO','Anand Rao. I run the center.'],['DR. RAO','We should talk about Mr. Pruett\'s scan. Not out here.'],'He walks you to the exam room door and doesn\'t go in.',['DR. RAO','It\'s on the light box. I haven\'t shown it to anyone but your people. I\'d like it to stay that way.']],
 raoAfter:[['DR. RAO','I\'ve been doing this twenty-two years. I don\'t have a word for it. I\'ve been trying.']],
 raoNeedOk:[['DR. RAO','I need Mr. Pruett\'s say-so before you look. He\'s particular.']],
 // ---- the clinic's rooms ----
 scanName:'THE SCAN',scanLook:'A light box on the wall. A scan clipped to it: a skull from the side.',scanMed:'Read the scan',scanAnyway:'Look anyway',
 scanDo:['Behind the left ear, a pale spot the size of a pea. Not a tumor. Too round, too smooth. Bone, but folded, like it was grown on purpose.',
  'And from it, down into the skull, a root. Thin as hair. It branches. Five branches, like fingers, holding on.'],
 scanH:'A root shaped like a hand',
 scanFail:'Gray and grayer. A skull. You can\'t make it say anything.',
 scanSeen:'You look anyway. Behind you, in the doorway, Dr. Rao clears his throat and doesn\'t say anything. He doesn\'t have to.',
 cabName:'CABINET',cabLook:'A glass cabinet. Gauze, swabs, a sharps box, and a locked drawer with a key in it.',cabOpt:'Find something useful',
 cabDo:'In the locked drawer, a sedative syringe in a sealed sleeve. Somebody wrote on the sleeve in marker: FOR EMERGENCIES ONLY (REAL ONES).',cabFail:'Swabs. More swabs. A tongue depressor somebody drew a face on.',
 readouts:'OBSERVATION DESK',readoutsLook:'A desk with a keyboard and a cold cup of coffee. The password\'s on a sticky note on the monitor. It\'s HUNTER2.',readoutsOpt:'Pull up Mr. Pruett\'s night',
 readoutsDo:['Ray\'s first study night. Brain waves crawling green across the screen, normal, normal, normal.','At 3:15 AM every line on the screen goes flat for nine seconds. Then a spike off a spot behind his left ear. Then nine seconds flat. Then the spike.',
  'Something in him sending. Like a beacon on a boat.'],
 readoutsFail:'HUNTER2 doesn\'t work. HUNTER3 doesn\'t either. Owen changes it every week.',
 labShut:'The sleep lab is locked for the night.',examShut:'The exam room is locked for the night.',
 sheriff:'A county car is parked outside the clinic, with a sheriff in it eating a sandwich. He\'s watching the door to the exam room through the window.',
 sheriffDoor:'EXAM ROOM',sheriffLook:'The sheriff\'s eyes are on this door. He\'s on his second sandwich.',sheriffPast:'You get past. He goes back to his sandwich.',sheriffFail:'He puts the sandwich down. You go sit in the waiting room like you meant to.',
 // ---- the hypnosis session (its own picture: the bed, the wires, the one-way window) ----
 sessionName:'THE SESSION',sessionLook:'The sleep lab bed. Wires on every side, the stickers still on them. Owen\'s good pillow.',sessionNeed:'Donna hasn\'t said yes yet. Talk to her at the house.',
 sessionOpt:'Start the session',
 sessionIn:['Owen dims the lights to half. Donna wants them on, so they stay on. The monitor\'s green line crawls.','You sit by the bed. Behind the one-way window, the dark glass shows your own reflection, and the Pruetts\', and nothing else. Yet.'],
 sOpt:{m1:'Take Donna back to the car',m1b:'Try again, gentler',m2r:'Take Ray back to the question',m2d:'Take Donna deeper',card:'Ask Donna about the card',push:'Push further, into the light',wake:'Wake them up'},
 m1Do:['You talk her down the mountain. Ten o\'clock, the Grange. The car. Her shoes off. Ray honking at her brother.','Mile thirty-one. The radio goes to a dial tone. Then it\'s cold.',
  ['DONNA','Tables. We\'re on tables. Ray\'s next to me. It\'s dark, it\'s so dark, except where they\'re working.'],['DONNA','They\'re very gentle. They\'re so gentle. I wish they\'d be rough. I could stand rough.'],
  'In the one-way window, behind your reflection, for one second, there are two long tables, and a light.'],
 m1Fail:['She gets as far as the Grange parking lot and stops.',['DONNA','No. No, no.'],'She wakes up crying, and apologizes for crying, and cries some more about that.'],
 m2rDo:['Ray goes under like a man going under a car. Hands folded.',['RAY','They want me to count. To nine. One two three four five six seven eight nine.'],['RAY','Again. One two three...'],
  'His voice changes on the second time through. Higher. Smoother. It\'s not his voice. It\'s counting perfectly.','In the window, something tall bends over a table, and listens.'],
 m2rFail:['Ray won\'t go under. He lies there with his eyes shut and his jaw tight, holding on to something with both hands.',['RAY','I feel fine.']],
 m2dDo:['Deeper. She goes quiet for a long time. The green line on the monitor stops crawling and waits.',['DONNA','They asked me something. In my own voice. They used my own voice to ask me.'],
  ['DONNA','Which one of you should we keep.'],['DONNA','And I said Ray.'],'Behind the glass, a long hand sets something small and pale behind a sleeping man\'s ear, like a jeweler setting a stone.',
  ['DONNA','I said Ray. Oh, God. I said him.']],
 m2dFail:['She shakes her head on the pillow. Her hand finds the flashlight in her pocket and turns it on, under the blanket.',['DONNA','Not that one. Please. Not that one.']],
 m2H:'Something asked them a question',
 cardDo:['You put the folded card in Donna\'s hands. Under, she turns it over the way you\'d turn a seashell.',['DONNA','Jenna\'s card. We got her a card with ducks on it. There\'s a check in it. Two thousand dollars, for the honeymoon.'],
  'She says what it was, out loud, every fold of it. And it comes open in her lap, like a flower in a time-lapse.','The card, with ducks. The check. And one more sheet that was never in it: old paper, ruled in red.'],
 pushQ:'Ray and Donna are both crying. Owen\'s got his hand on the light switch. Push further anyway?',pushOpts:['Push','Leave it'],
 pushDo:['You take them past the tables. Past the question. Up, into where the light comes from.',['DONNA','It\'s bright in there. It\'s the brightest place I\'ve ever been.'],
  ['DONNA','They love their light. It feeds them. They can\'t stand ours. Ours is dirty. Ours is HOT.'],'Ray\'s nose starts to bleed. Behind his ear, something hums, loud enough that Owen hears it from the desk.'],
 pushH:'The inside of the light',
 pushAfter:['Donna wakes up and doesn\'t say anything. Ray holds a tissue to his nose and doesn\'t say anything.','You got what you came for. They know you did.'],
 sessionEnd:['Owen brings the lights back up. Donna sits up and asks if she talked in her sleep, and laughs, and stops laughing.'],
 // ---- the deduction and the hard choice, at the kitchen table on day 2 ----
 tableName:'KITCHEN TABLE',tableLook:'The kitchen table. Coffee rings, a crossword, a flashlight.',tableOpt:'Sit down and call Big Hat',
 tableNeed:'The timeline has {n} of 7 boxes. Fill 3 before you call Big Hat.',
 phone:['You put the phone on speaker in the middle of the table, between the sugar bowl and the flashlight. Ray and Donna look at it like it might bite.',['BIG HAT','I\'m listenin\'.']],
 deduceQ:'So what do they want with him?',
 deduceOpts:['To finish what they started. They\'re coming back for it, and him with it.','It\'s a tracker. Dig it out and they lose him.','They want the card back.'],
 deduceRight:[['BIG HAT','Yeah.'],['BIG HAT','Fog\'s coming down tonight. Forecast says the thickest since March. That\'s their weather.'],['BIG HAT','That thing behind his ear\'s a tag. Whatever\'s got the tag, they come to.']],
 deduceHalf:[['BIG HAT','A tracker. Sure. Maybe.'],['BIG HAT','Trackers work both ways, {first}. Somethin\'s comin\' to read it. Tonight, I\'d guess, with this fog.']],
 deduceWrong:[['BIG HAT','The card.'],'There\'s a long pause. A dryer buzzes, somewhere behind him.',['BIG HAT','Go back and look again. I\'ll call you.'],'He calls back two hours later. Two hours Ray spends looking at the phone book.',['BIG HAT','It\'s behind his ear. Whatever wants him wants it. Fog\'s comin\' tonight.']],
 carrierQ:'Big Hat: "Somebody carries it up to the high pasture tonight. Who?"',
 carrierOpts:{ray:'Ray carries it, with us beside him',cut:'Cut it out first (Dr. Rao)',donna:'Donna carries it',agent:'One of us carries it'},
 carrierOptsWhy:{ray:'He has to agree to it.',cut:'Dr. Rao takes it out. Ray will lose some of himself with it.',donna:'She asked. It has to be moved to her.',agent:'It has to be moved. Somebody on the team keeps the mark.'},
 cutYes:[['RAY','Get it out of me. I don\'t care what it takes with it.'],['DONNA','Ray.'],['RAY','I don\'t care, Donna.'],['DR. RAO','I can do it this afternoon. I want one of you in there with me.']],
 donnaYes:[['DONNA','It was me. I said Ray. I told them to keep him.'],['DONNA','So they can come get me instead. Move it. You can move it, can\'t you? I saw you thinking it.']],
 agentWho:'WHO CARRIES IT?',
 agentYes:'{n} rolls up a sleeve. "Put it in me. I\'ve got nobody waiting up."',
 hatAfter:[['BIG HAT','High pasture above Laurel Street. Highest open ground in town. Fog sits right on it.'],['BIG HAT','Take light. All the light you can carry. Don\'t make me come up there.']],
 // ---- the procedure, in the exam room on day 2 ----
 procName:'THE PROCEDURE',procLook:'Dr. Rao has the tray laid out. He\'s washed his hands three times.',
 procCut:'Assist Dr. Rao',procCutAlone:'Let Dr. Rao do it alone',procMove:'Find where it lets go',procMove2:'Move it',
 cutDo:['It takes an hour. It doesn\'t want to come. The root lets go one finger at a time.','Dr. Rao drops it in a specimen jar. It\'s pearl-gray, the size of a pea, and it is humming.',
  ['RAY','Where\'d we have the reception? Donna? Where was it?'],['DONNA','The Grange, honey.'],['RAY','...Huh.'],'He doesn\'t remember the wedding. He remembers the cake.'],
 cutH:'Watching it come out',
 cutStroke:['Halfway through, Ray\'s left hand stops working. Then the left side of his face.','Dr. Rao gets it out anyway, fast and bloody. He\'s alive. He\'s going to be all right, mostly. He\'s going to walk with a cane.',
  'The thing in the jar hums like nothing happened.'],
 moveFind:['You find it in the books, and then in Ray: the place where it holds, and the place where it would let go, if something willing were offered instead.'],
 moveFail:'It won\'t let go of him. Not for that. Not today.',
 moveDo:{donna:['Donna lies down next to Ray on the exam table. She holds his hand. She says, out loud, "Me instead."','It moves under the skin like a bead on a string, out of him, and into her. Ray\'s ear stops humming. Hers starts.'],
  agent:['{n} lies down on the exam table next to Ray and says, out loud, "Me instead."','It moves under the skin like a bead on a string. Ray\'s ear stops humming. Behind {n}\'s left ear, something starts.']},
 // ---- the hardware store ----
 hardware:'TOLLIVER HARDWARE. Rakes and seed packets in the window. A sign: WE HAVE ROAD FLARES.',hwOpt:'Ask about the road flares',
 hwDo:'Mr. Tolliver sells you one road flare and won\'t take money for it. "For the study," he says, and winks. You don\'t know what the wink means. Nobody in Cullen Gap is going to tell you.',
 // ---- the Pruetts' car ----
 pcarName:'THE PRUETTS\' CAR',pcarLook:'A sedan under the carport. On the hood, a burned ring, perfectly round, the paint inside it like new.',
 pcarH:'A burned ring, perfectly round',
 pRadio:'Read the radio\'s clock',pFix:'Pull the radio',pRing:'Look at the ring',pCap:'Check the gas cap',
 radioDo:['The dashboard clock and the radio\'s clock don\'t agree. The dash says the right time. The radio says 10:35, and it doesn\'t move.','You pull the fuse. You put it back. 10:35. Like it got there and stayed.'],
 radioFix:['You pull the radio out of the dash. On the back, the circuit board is frosted over. In April. It\'s warm out.','The clock chip under the frost is stopped on 10:35.'],
 ringDo:['The ring isn\'t burned on. It\'s burned off: everything in the circle is new paint, like the factory, no dings, no pollen.','Somebody set the car down very carefully, on something very hot, at 10:35 by the radio.'],
 radioFail:'The radio plays a song about a truck. You\'ve learned nothing about trucks.',
 capDo:['The gas cap\'s on inside out. Threads facing the wrong way. You can\'t do that. You try, and you can\'t do that.','And the tank\'s full to the neck. Ray says it was on a quarter when they left.'],
 capFail:'A gas cap. A gas tank. A little smell of gas.',
 // ---- the pasture: night 2 ----
 gateQ:'The pasture gate stands open. Up the hill, the fog sits on the grass like it\'s waiting. Once you\'re up there, it\'s tonight or never.',
 gateIn:['Go in','Not yet'],
 fieldIn:['The high pasture. The fog\'s so thick the grass is wet with it. The cows have all gone down to the far fence and stand there, facing away.','In the middle of the hill, a ring of burned grass, perfectly round. Above it, the fog has a light in it. Cold. White. Waiting.'],
 fieldCar:'Down at the gate your car\'s headlights come on high, and two long yellow beams go up the hill into the fog. The cold light up there pulls back from them, a little.',
 fieldFlares:'Road flares spit red along the gate. The fog turns pink at the bottom. The cold light up there doesn\'t like it.',
 ringQ:'The burned ring. Step into it, and the light comes down. Nobody leaves until it\'s over.',bossOpts:['Go in','Not yet'],
 barnName:'HAY BARN',barnLook:'An old hay barn, the door off its track. Inside, it smells like 1950.',barnOpt:'Look around inside',barnFind:'Behind a hay bale, somebody\'s emergency kit: a road flare and a first-aid kit, from a pickup that hasn\'t run since Carter.',barnNone:'Hay. Mice. A calendar from 1979, still on April.',
 lightsOk:['You pull the car up to the pasture gate and rig the high beams to stay on. Two long beams go up the hill and into the fog.','Up there, the cold light in the fog flinches. You saw it flinch.'],
 lightsFail:'The fog eats the beams ten yards out. You\'ll have to get closer, or try something else.',
 flaresDo:'You crack two road flares and lay them along the gate. Red light hisses up into the fog.',
 lightsAgain:'Your headlights shine up the pasture into the fog. They\'ll stay on.',
 fieldOut:'Go back down to Laurel Street?',fieldOutOpts:['Go back','Stay'],
 // ---- the Orderly ----
 orderlyIn:['The exam room light\'s off. The light box is on. In front of it, something stands bent nearly double under the ceiling, studying Ray\'s scan.',
  'It\'s pale and tall and folded, like a closed umbrella that grew a man. Its fingers are too long and they end in instruments: a probe, a hook, a little silver mirror.','It turns its face to you. There\'s no face. Just more folds.'],
 orderlyMain:['Owen calls as the fog comes down. You can hear him running.',['OWEN','It\'s back! It\'s coming down Main! It\'s looking for him, it\'s looking for Mr. Pruett!'],'Under the street light by the bank, something pale and tall unfolds itself out of the fog, one long joint at a time.'],
 orderlyIntro:'The Orderly unfolds!',
 hold:'The Orderly lays one long finger on {t}. "Hold still." {t} holds still.',
 orderlyDone:['It folds down onto the floor, smaller and smaller, until it\'s a pale wet sheet, and then nothing.','The little silver mirror rolls under the cabinet and stops.'],
 // ---- the boss ----
 lamp:['The light in the fog comes down.','Not fast. The way a hand comes down to pick something up off a table. The grass under it goes white with frost.',
  'It\'s a hole in the night, round and white and cold, and something is climbing down out of it on legs like a surveyor\'s tripod.'],
 lampH:'The Lamp coming down',
 boss1:['Nine feet of pale, jointed patience in a coat of folded fog. Where a face should be, a lamp of cold white.','Its hands are calipers. It opens them, slowly, and measures the air between you.'],
 bossSay:['THE SURVEYOR','ONE. TWO. THREE. FOUR.'],
 bossSayR:['THE SURVEYOR','FIVE. SIX. SEVEN. EIGHT. RAY PRUETT IS NINE.'],
 bossSayD:['THE SURVEYOR','DONNA PRUETT SAID YES. DONNA PRUETT IS NINE.'],
 bossSayA:['THE SURVEYOR','{n} IS NINE.'],
 bossSayC:['THE SURVEYOR','NINE IS IN A JAR. THAT IS RUDE. WE WILL COUNT IT ANYWAY.'],
 bossIntro:'The Surveyor unfolds to its full height!',
 bossThin:'It looks thinner than it should. What you did weakened it.',
 bossIdent:'You know what it is. Donna told you from inside the light: its own light feeds it, and ours hurts it.',
 countDo:'{n} counts it, out loud, the way Ray counted under: "One. Two. Three. Four. Five. Six. Seven. Eight." And stops short of nine.',
 countOk:'The Surveyor loses its place. It stands there with its calipers open, counting back from the start.',countFail:'{n} loses the count at six. The Surveyor finishes it, in {n}\'s own voice.',
 cardBack:'You hold up the card, open, the way Donna told it. "This was hers. It\'s not yours." The Surveyor flinches from it like from a flame.',
 calipers:'reaches for',
 measure:'The Surveyor opens its calipers around {t}, head to foot, and writes something down somewhere. {t} has been measured.',
 measuredHit:'It knows exactly where {t} is.',
 allText:'The Surveyor counts you, all of you, out loud. Every number lands like a slap.',
 lampHeal:'The light above it pulses. It stands up straighter. It heals {n}.',lampSmall:'The light pulses, weaker. Your flares are in its eyes. It heals {n}.',lampNone:'It reaches up for its light, and the headlights are in its face. Nothing comes.',
 shield:'It pulls the fog in around itself like a coat. Layers and layers of it. It\'s going to be harder to hurt.',shieldNo:'It reaches for the fog to cover itself, and loses count of the layers. Nothing holds.',
 phase:'Its coat of fog comes open. Inside it\'s all hands, and every hand has an instrument.',
 take:{ray:'The Surveyor reaches past you all for Ray Pruett.',donna:'The Surveyor reaches past you all for Donna Pruett.',agent:'The Surveyor reaches for {t}, for the thing behind {t.their} ear.'},
 takeBlock:'{t} steps in front of it. The hands close on {t} instead.',
 takeMiss:'Ray jerks back out of its reach.',takeMissD:'Donna jerks back out of its reach.',
 takeHold:{ray:'Its hands close on Ray\'s coat. He\'s off his feet. Then he tears loose and drops.',donna:'Its hands close on Donna. She\'s off her feet. Then she tears loose and drops.'},
 taken:{ray:['Its hands close on Ray Pruett, and this time they don\'t open.','It folds up around him, and folds, and folds, and goes up into the light, and the light goes up into the fog.','The frost on the grass melts all at once. The cows at the far fence start eating again.'],
  donna:['Its hands close on Donna Pruett, and this time they don\'t open.','She doesn\'t scream. She says "Ray," once. Then it folds up around her and goes up into the light.','The frost on the grass melts all at once.'],
  agent:['It catches {t} on the ground, and lifts, and {t} goes up with it, into the light, out of reach of anybody\'s hand.','The light goes up into the fog. The frost on the grass melts all at once.']},
 fold:['The Surveyor starts folding itself up. Joint by joint, it\'s getting smaller, getting ready to go back up into the light.','It\'s leaving. It will be back in some other spring, for some other car.'],
 revengeQ:'It\'s getting away. {n} could hold it down and make it stay. It will cost.',revengeOpts:['Hold it down','Let it fold away'],
 revengeDo:['{n} gets both hands on it as it folds and holds on. It\'s cold enough to burn.','You light everything you\'ve got. It stays, and burns, and measures nothing, and while it burns it sings in Donna\'s own voice, every word she ever said to it.',
  'It takes a long time. Nobody who watches it will forget it.','When it\'s over, there\'s nothing on the grass but frost.'],
 revengeH:'Making it stay',
 revengeFail:'{n} grabs and gets a handful of fog. It folds away, up into the light.',
 folded:['It folds up small, and smaller, and goes up into the light like a moth up a chimney. The light goes up into the fog, and the fog thins.','It will remember this place. It will remember that this place was loud and bright and hot.'],
 bossDie:'comes apart into frost and cold white light',
 // ---- the ending ----
 end1:['The fog lifts off the high pasture like somebody pulled a sheet off a bed. There are stars. There\'s the ridge.','The cows at the far fence start eating again, like nothing happened.'],
 cardLets:'In your pocket, the folded card lets go of itself, quietly, and opens. The card with ducks. The check. And a sheet that was never in it: old paper, ruled in red.',
 dawn:{ray:'Ray Pruett walks down off the high pasture on his own feet with his good coat torn. Behind his ear, the hum is gone, and nothing is left but a scar like a bug bite.',
  cut:'Ray Pruett sleeps for fourteen hours. When he wakes up he asks Donna to tell him about the wedding, and she does, all of it, twice.',
  stroke:'Ray Pruett comes home from the hospital in Harrisonburg with a cane and half a smile. He tells everybody at the diner he feels fine. This time it\'s almost true.',
  donna:'Donna Pruett walks down off the high pasture holding her shoes. Behind her ear, the hum is gone. She sleeps that night with one lamp on.',
  agent:'{n} walks down off the high pasture. Behind {n.their} ear, the hum is quiet. It\'s not gone. In fog, it\'s going to come back.',
  takenray:'Donna Pruett leaves the porch light on. She leaves it on every night after. She tells people Ray\'s visiting his brother.',
  takendonna:'Ray Pruett leaves every lamp in the house on. Every one. He tells people Donna\'s visiting her sister in Roanoke, and Cullen Gap lets him.',
  takenagent:'Nobody in Cullen Gap ever knew {n}\'s name. Ray Pruett puts a bench on the overlook anyway, with a plaque: FOR THE STUDY.'},
 dawnSleep:'A month later, Ray and Donna sleep with one lamp on. By summer, none.',
 dawnPaper:'The Page Valley Courier runs it on page six: LOCAL COUPLE CLAIMS ABDUCTION. Next to it, a story about a cow that can count. Nobody believes either one.',
 hum:'{n}\'s ear hums on the drive home. It hums at every red light.',
 tester:['Ray comes out to the car before you leave and puts something in your hand. His old voltage tester, from the power company.',['RAY','Beeps when there\'s juice where there shouldn\'t be. Beeped at that thing in the fog. Figured you\'d want it.']],
 filed:['BIG HAT','This card. I\'ll file it. Records wants it by Monday.'],
 jarFiled:['BIG HAT','I\'ll take the jar. Don\'t shake it. It don\'t like bein\' shook.'],
 quarters:'He pushes a roll of quarters across the folding table. You didn\'t ask for them. He doesn\'t say what they\'re for.',
 // ---- overstepping: Noticed (Hensley), Local chief (the sheriff), Big Hat's call, the clean-up crew ----
 chief:['A county car rolls into Cullen Gap with its lights off and parks right outside the clinic.',['SHERIFF','Afternoon. County sheriff. Carla called me. Said the study\'s been upsetting folks.'],['SHERIFF','I\'ll just sit here a while. Don\'t mind me.']],
 call:['Your phone buzzes. Unknown number. You know who it is.',['BIG HAT','{first}. A sheriff in Page County called a number he shouldn\'t have had about a sleep study he shouldn\'t have heard of.'],['BIG HAT','Don\'t ask for anything next time. You won\'t get it.']],
 feds:['Black cars on Main Street with their headlights off. Four doors open at the same time.',['CLEAN-UP','Black Lantern. You\'re done here. Hand over what you\'ve found.'],['CLEAN-UP','The Pruetts are coming with us. For their own good.']],
 fedsIntro:'The clean-up crew draws down!',
 fedsWin:['The black cars leave the way they came, one short.','By morning the Pruett house has a For Sale sign on the lawn and nobody in it.','Nobody asks what you found. Nobody ever will.'],
 paper:['Ray calls the Page Valley Courier. You find out because Mae turns the radio up: the morning show\'s already got it.','"LOCAL COUPLE SAYS THEY WERE TAKEN." The host laughs. Then he plays a song about a truck.'],
 // ---- the debrief (spec 007): Big Hat's lines by ending ({x}/{t} timeline boxes, {v}/{n} brought home), what he says
 // about the choices, and the cover stories ----
 db:{
  clean:[['BIG HAT','Ray and Donna Pruett went to the diner Sunday. Two eggs over hard and a fight with Mae about the toast.'],['BIG HAT','{x} boxes outta {t} on your timeline. Nobody called the paper. Sit.']],
  costly:[['BIG HAT','It\'s gone. That\'s the good news.'],['BIG HAT','Rest of it, you know already. You were there.'],['BIG HAT','{x} boxes outta {t}. Sit.']],
  worst:[['BIG HAT','Case is closed. I don\'t like how.'],['BIG HAT','{x} boxes outta {t}. Sit down anyway.']],
  takenRay:[['BIG HAT','I got a call from Cullen Gap. A lady wants to know when her husband\'s comin\' back from visitin\' his brother.'],['SHOUT','HE DON\'T HAVE A BROTHER.']],
  takenDonna:[['BIG HAT','Ray Pruett called me. Don\'t ask me how he got the number. He wanted to know if his wife\'s comin\' home.'],['BIG HAT','I said I\'d look into it. I don\'t lie to people, as a rule. I made an exception.']],
  takenAgent:[['BIG HAT','{c} went up into the light and didn\'t come down. I\'m puttin\' it on the plaque as "on assignment."'],['SHOUT','IT IS NOT AN ASSIGNMENT.']],
  shut:[['BIG HAT','Black cars in Cullen Gap. The Pruetts are in a house in Maryland now with a man outside it. Nobody asked me.']],
  wrong:['BIG HAT','You told me they wanted a greetin\' card. I\'m still thinkin\' about it.'],
  pushed:['BIG HAT','Dr. Rao sent me a letter. Handwritten. It says "never again." That\'s all it says.'],
  dutyTold:['BIG HAT','Pruett girl knows. She\'s keepin\' it. I can tell from here she\'s the kind that keeps things.'],
  dutyHeld:['BIG HAT','You lied to the daughter\'s face to keep the cover. That\'s the job. That\'s the whole job, some days.'],
  paper:['BIG HAT','Page six. Next to a cow. I\'ve had worse press.'],
  cut:['BIG HAT','Ray don\'t remember his girl\'s weddin\'. Donna\'s gonna tell him about it till he does. Might take a while.'],
  agent:['BIG HAT','{c}\'s ear hums. I can hear it on the phone. We\'re gonna talk about that, later, when it matters.'],
  revenge:['BIG HAT','Heard you made it stay. Heard it sang. I don\'t want to hear any more about it.'],
  folded:['BIG HAT','It folded up and went home. Let it. It\'ll remember Cullen Gap was hot.'],
  med:'A study, a cyst and a bad reaction',medPass:[['BIG HAT','Sleep study, a cyst behind the ear, and a bad reaction to the sedative. Dr. Rao signs it. Ray\'s insurance pays for it, which is the only real miracle in this file.']],
  power:'A power-line fault on the ridge',powerPass:[['BIG HAT','Line fault at mile thirty-one. Knocked the car dead, scrambled the radio, they sat in the dark and lost track. Ray\'s old company files it. He signs it himself.']],
  weak:'They pulled off and slept in the fog',weakPass:[['BIG HAT','Old folks pulled off in the fog and fell asleep. Happens. Nobody looks at it twice. You got lucky.']],
  easy:'A good wedding. Nobody watched the clock',easyPass:[['BIG HAT','Best weddin\' in years. They danced till three and drove home happy. The whole town\'s heard it from Mae by now.']],
  safe:'Already filed: sealed study results',safePass:[['BIG HAT','Study results, sealed. Medical privacy. Nobody gets to read a word. Perfect.']]
 },
 // ---- looks around the maps ----
 west:'Route 211, back toward the highway. Not yet.',
 east:'Route 211 climbs out of town toward the ridge. Take the car.',
 shutDiner:'THE GAP DINER. A sign in the door: CLOSED. OPEN 6 AM.',
 shutStore:'Closed for the night.',
 post:'The post office. A flag on the pole, a box for outgoing mail. A flyer on the door: LOST DOG, ANSWERS TO DUKE, DOES NOT ANSWER TO DUKE.',
 church:'Cullen Gap Methodist. The marquee: SPRING SUPPER SAT 5PM. ALL WELCOME. Under it, smaller: KEEP YOUR LIGHTS ON.',
 neighbor:'A white house with green shutters. Nobody answers. The curtain moves.',
 gateShut:'A pasture gate at the end of Laurel Street, chained. The hill beyond is just a hill.',
 trailDown:'A trail goes down off the end of the wall, into the fog.',trailQ:'Climb down below the overlook?',trailOpts:['Climb down','Stay'],
 trailUp:'Climb back up to the overlook?',trailUpOpts:['Climb up','Stay'],
 roadW:'The road winds back down toward Cullen Gap. Take the car.',
 roadE:'The road climbs on over the ridge. Not tonight.',
 drop:'The guardrail, and past it, nothing but fog.',
 look:{
  clinic:'BLUE RIDGE SLEEP CENTER, in gold on the glass. Carved over the columns: FARMERS BANK 1911.',
  deposit:'A brass NIGHT DEPOSIT slot in the stone. Somebody taped a note over it: NOT A MAILBOX.',
  diner:'THE GAP DINER. Pie case in the window. Somebody drew a smiley face in the fog on the glass.',
  cruiser:'A county cruiser, engine running. The radio inside murmurs about a loose cow on 340.',
  mailbox:'PRUETT, in reflective stickers. One letter is peeling.',
  bench:'A bench. A plaque: IN MEMORY OF HAROLD, WHO SAT HERE.',
  photos:'Wedding photos. Jenna in white, Ray crying, Donna laughing at him. A reception in a hall full of people.',
  photosOpt:'Look closer at the photos',
  photosDo:['The last photo in the row is timestamped in orange in the corner, the way Donna\'s old camera does it: 10:01 PM. The Grange hall doors, wide open, everybody waving.',
   'Ray and Donna in the doorway, her shoes in her hand. One minute later they\'re in the car.'],
  photosFail:'Jenna in white. Ray crying. Donna laughing at him. Same as before.',
  cameo:['At the very back of the dancing crowd, by the door, in three of the photos: a tall man in a dark coat, with a book under his arm.','Nobody in the family knows who he was. In the fourth photo, he\'s gone.'],
  cameoH:'A stranger at the back of the photos',
  fridge:'The fridge. A save-the-date, a church bulletin, a magnet shaped like Virginia, a sticky note: CALL COURIER?? in Ray\'s handwriting.',
  stove:'A kettle on the stove, still warm.',
  lamp:'Every lamp in the house is on.',
  bed:'The bed is made. On Donna\'s side, a flashlight on the pillow.',
  nightlights:'A row of night-lights on the dresser. A duck, a moon, a lighthouse. All on.',
  lineman:'A photo of Ray up a power pole in a storm, grinning.',
  window:'The window faces the ridge. The curtain\'s pinned shut with a clothespin.',
  counter:'The counter. Every stool has a name scratched under it.',
  pie:'The pie case. COCONUT CREAM, a sign says, RESERVED: CECIL.',
  booth:'A red booth, the vinyl patched with tape.',
  jukebox:'A jukebox, unplugged. A sign: BROKE SINCE \'09.',
  desk:'The front desk, in the old teller cage. A bell, a clipboard, a jar of lollipops.',
  vault:'The old bank vault. Its door stands open. Inside: file boxes, floor to ceiling.',
  chairs:'Waiting room chairs. A magazine from 2019: TEN WAYS TO SLEEP BETTER TONIGHT.',
  clock:'A tall clock, five minutes slow.',
  monitor:'The monitor. A green line, crawling.',
  mirror:'A long window in the wall, black from this side. A one-way window.',
  examtable:'An exam table, the paper fresh.',
  marker:n=>`A mile marker. MILE ${n}.`,
  curve:'A yellow sign: CURVE. Somebody shot a hole in it.',
  viewer:'A coin viewer, pointed at the fog. 25¢ · 2 MIN.',
  sign:'BLUE RIDGE OVERLOOK · ELEV. 3,280 FT.',
  creek:'A creek, loud in the quiet. Too cold to wade.',
  thicket:'Rhododendron, too thick to push through.',
  trough:'A cattle trough. The water has a skin of frost on it. In April.',
  ring:'A ring of burned grass, perfectly round. The frost starts at its edge.',
  fence:'The pasture fence.'
 }
};
const fill=(t,o)=>String(t).replace(/\{(n|m|v|t|x)\}/g,(x,k)=>o[k]??x);
async function play(seq,o={}){for(const l of [].concat(seq)){if(Array.isArray(l))await say(l[0],fT(l[1],o));else await say('',fT(l,o))}}
// a line with an agent in it: fillT, so {n} and {n.their} follow that agent's pronouns (field.js)
const fT=(t,o)=>o&&(o.n||o.t)?fillT(fill(t,{m:o.m,v:o.v,x:o.x}),o):fill(t,o||{});
const said=(l,o)=>play([l],o);
// A point of no return (studio-bible/play.md): the cursor starts on Not yet, so mashing A can't take it.
async function askNotYet(text,opts){await say('',text,{keep:true,instant:false});const r=await choose(opts,{cancel:true,inBox:true,sel:opts.length-1});hideTB();return r<0?opts.length-1:r}

// The case board card (spec 016, The card)
const caseCard={file:4,title:'LOST HOUR',town:'CULLEN GAP',place:'RIDGE ROAD · CULLEN GAP, VA',
 hook:['Ten to three. Nobody remembers.','The car came home with a full tank.'],pin:'#c8b8ff'};

// ================= CASE DATA =================
// Enemy cards (Combat: Enemies and difficulty, Combat numbers). Fight sizes: roamers 10–18 enemy HP, story fights 20–35.
const EN={
 // Glims: cold lights on strings out of the fog (weak tier). Three on the ridge (21 HP, 1 skull); pairs in the woods (14)
 glim:{name:'Glim',tier:'weak',hp:7,dex:14,hit:40,dmg:'1d3',skulls:1,tags:['unnatural','lightshy'],resist:['bleed','poison'],weak:'light',
  weakLine:'A little piece of somebody else\'s light. Ours scatters it: a road flare sends it reeling.',moves:[['hit',1]],verb:'burns cold against',die:'goes out like a match in a puddle',face:[6,4,18],
  horror:{tier:'unsettling',kind:'unnatural',subj:'lights'}},
 // the stray: a deer that came back wrong, walking backward, a ring burned on its back (a woods roamer)
 stray:{name:'Stray',tier:'ordinary',hp:12,dex:11,hit:45,dmg:'1d3+1',skulls:1,tags:['unnatural','lightshy','beast'],resist:[],weak:'light',
  weakLine:'It came back from the light wrong. It hates ours. A flare, or bear spray, will turn it.',moves:[['hit',1]],verb:'kicks backward at',die:'folds its legs and lies down, and is just a deer',face:[30,6,22],
  horror:{tier:'disturbing',kind:'unnatural'}},
 // the Orderly: a Measurer's assistant (story fight 2, with one Glim: 29 HP, 2 skulls). "Hold still" costs an agent a turn
 orderly:{name:'Orderly',tier:'tough',hp:22,dex:10,hit:50,dmg:'1d4+1',skulls:2,tags:['unnatural','lightshy'],resist:['poison'],weak:'light',
  weakLine:'A thing that holds you still while the real work is done. Light makes it flinch: a flare Shakens it.',moves:[['hit',3],['hold',1]],verb:'probes',die:'folds down into a wet pale sheet, and then nothing',face:[16,2,22],
  horror:{tier:'severe',kind:'unnatural',subj:'medical procedures'}},
 // only if overstepping reaches Federal agents (the same clean-up crew as every case; its sprite is Still Harvest's SHB)
 fed:{name:'Clean-up agent',tier:'ordinary',hp:11,dex:12,hit:55,dmg:'1d4+1',skulls:3,tags:['human','living'],resist:[],weak:'human',weakLine:'Human. A flashbang or a badge will stop him for a second.',
  moves:[['hit',1]],verb:'fires at',die:'goes down and stays down',face:[10,2,20]},
 // the boss (tuned Nov 23, 2026 with tools/boss-sim.js against the Gleaner's bar). Its moves, phase 2 and HP are set per
 // run in bossFight() from the case's choices. Weakness: our light; its own light heals it.
 surveyor:{name:'The Surveyor',tier:'boss',boss:true,hp:65,dex:9,hit:60,dmg:'1d4+2',allDmg:'1d3',skulls:3,tags:['unnatural','lightshy'],resist:['stun2','poison','bleed'],weak:'light',
  weakLine:'Its own light feeds it, and ours hurts it: road flares Shaken it and dim its Lamp. It can\'t be stunned two turns running.',face:[38,6,30],
  moves:[['hit',5],['all',2],['measure',1],['lamp',2]],verb:TEXT.calipers,allText:TEXT.allText,die:TEXT.bossDie,
  horror:{tier:'boss',kind:'unnatural',subj:'the Surveyor',known:true}}
};
EN.orderly.acts={hold:e=>holdStill(e)};
// the case's horrors: tier, kind, phobia subject; once per case each (SAN loss table). The phobia subject this case
// fits is medical procedures (the scan, the session, the Orderly, the cut)
const HORRORS={
 ring:{id:'ring',tier:'unsettling',kind:'unnatural',label:TEXT.pcarH},
 seam:{id:'seam',tier:'unsettling',kind:'unnatural',label:TEXT.seamH},
 scan:{id:'scan',tier:'disturbing',kind:'unnatural',subj:'medical procedures',label:TEXT.scanH},
 m2:{id:'m2',tier:'disturbing',kind:'helplessness',subj:'medical procedures',all:true,label:TEXT.m2H},
 push:{id:'push',spec:['1d4','1d4'],kind:'unnatural',label:TEXT.pushH},
 cut:{id:'cut',tier:'disturbing',kind:'helplessness',subj:'medical procedures',label:TEXT.cutH},
 lamp:{id:'lamp',tier:'shattering',kind:'unnatural',all:true,known:true,label:TEXT.lampH},
 revenge:{id:'revenge',spec:['1d4','1d4'],kind:'violence',all:true,label:TEXT.revengeH},
 hum:{id:'hum',tier:'severe',kind:'helplessness',label:'The hum behind the ear'},
 cameo:{id:'cameo:tall',tier:'unsettling',kind:'unnatural',label:TEXT.look.cameoH}
};
// this case's own items (case-only: the pin icon; Big Hat sorts them at the debrief). The card is the key evidence.
const CASE_ITEMS={
 lhcard:{name:'The folded card',type:'Evidence',kind:'unnatural',pin:1,
  get desc(){return G.flags&&G.flags.unfolded?'Jenna\'s wedding card, open at last. The card, with ducks. The check. And a sheet that was never in it: old paper, ruled in red, numbered in the corner: 4.'
   :'Jenna\'s wedding card, folded into a shape your hands keep losing track of. It won\'t come open.'},
  mapUse:async()=>{await unfoldTry();return false}},
 lhjar:{name:'The tally, in a jar',type:'Evidence',kind:'unnatural',pin:1,desc:'A pearl-gray seed the size of a pea, in a specimen jar. It hums when the fog comes down. Don\'t shake it.',passive:1},
 lhtester:{name:'Ray\'s tester',type:'Tool',kind:'ordinary',pin:1,desc:'An old voltage tester. Battle: it beeps at an unnatural enemy, which is Exposed.',
  battleUse:async(m)=>{const fs=aliveFoes().filter(e=>(e.tags||[]).includes('unnatural'));if(!fs.length){await say('','The tester stays quiet. Nothing here is live.',{auto:900});return true}
   const t=fs.length>1?await uiTarget(m,{foes:true,info:e=>e.name}):fs[0];if(!t)return false;await say('',`${m.name}'s tester beeps like crazy.`,{auto:900});await foeStatus(t,'exposed');return true}},
 lhsyringe:{name:'Sedative syringe',type:'Med',kind:'ordinary',pin:1,desc:'Map: calms an agent\'s disorder flare. Battle: the same, or a living enemy is Stunned.',
  mapUse:async()=>{const t=await pickMember('WHO GETS IT?',flaringAny,'Nobody\'s flaring.');if(!t)return false;calmFlare(t);await say('',fillT(BLS.MAPMENU.sedated,{n:t.name}));return true},
  battleUse:async(m)=>{const t=await uiTarget(m,{info:e=>e.name});if(!t)return false;
   if(t.a){if(!flaringAny(t)){await say('',`${t.name} doesn't need it.`,{auto:800});return false}calmFlare(t);await say('',fillT(BLS.MAPMENU.sedated,{n:t.name}),{auto:1000});return true}
   if(!(t.tags||[]).includes('living')){await say('',`The needle won't go into ${t.name}. There's nothing in there to put to sleep.`,{auto:1100});return true}await foeStatus(t,'stun');return true}}
};
// a roamer's drop: 20% from this loot table (Where items come from, Loot): a small town and a clinic
const LOOT=['roadflare','painkillers','energy','bandage','cigs'];
const F_=()=>G.flags;
const has=id=>G.clues.some(c=>c.id===id);
// the timeline: seven boxes, 10 PM to 3:15 AM; the Case file lists the clues in this order
const TL=['left','radio','seam','tally','memory1','memory2','tank'];
const boxes=()=>G.clues.filter(c=>TL.includes(c.id)).length;
function addClue(id,text){if(has(id))return;clue(id,text);G.clues.sort((a,b)=>TL.indexOf(a.id)-TL.indexOf(b.id));checkpoint()}
const late=()=>G.flags.late|0;
async function addLate(){const F=G.flags;if(F.jennaTold||F.paper)return;F.late=late()+1;if(F.late>=3)await callPaper()}

// ================= THE DAY =================
// G.flags.ph: 0 day 1, 1 night 1 (the ridge road), 2 day 2 (rain), 3 night 2 (spec 016, Day and night). Each turn waits for
// Go on / Not yet at the car, naming what closes (Turning the day; play.md).
const ph=()=>G.flags.ph|0;
const isNight=()=>ph()===1||ph()===3;
// overstepping: which step the case is on (quiet case: Clean, Noticed, Local chief, Agency call, Federal agents)
const stepName=()=>stepsOf()[loadSeason().overstep|0]||'Clean';
const stepAt=n=>stepsOf().indexOf(n)>=0&&stepsOf().indexOf(n)<=(loadSeason().overstep|0);
// the briefing's edges (spec 013) and the session's trust: +10 Empathy with the Pruetts, −20 once you pushed them too far
const pMod=()=>(intelOn('pruetts')?10:0)-(G.flags.push?20:0);
const hMod=()=>intelOn('cover')?10:0;
const sMod=()=>pMod()+(G.flags.shoeBack?10:0);
// who carries the tally tonight: 'ray', 'cut' (in a jar), 'donna', 'agent' (G.flags.carrierId); and that agent
const carrierAgent=()=>G.flags.carrier==='agent'?party.find(m=>m.a.id===G.flags.carrierId&&!m.gone)||null:null;
const chiefOn=()=>!!G.flags.chief&&ph()<=2&&!G.flags.chiefPast;

// ================= MAPS =================
// Every map is drawn by cases/lost-hour-art.js from M.ground, M.pieces and M.light, like Lot 83. M.g is what blocks.
// Ground letters (none in engine.js's BLOCK set): ',' sidewalk, '.' spring grass, ':' wet grass, ';' mud, '=' road,
// '_' lot asphalt, 'g' gravel, 't' a trail's packed earth, 's' wooded slope, 'S' shaded slope, 'n' linoleum, 'c' carpet, 'v' tile, 'w' wood floor.
function blank(id,name,W,H,fillCh,light){const ground=mk(W,H,fillCh),g=mk(W,H,fillCh);
 return{id,name,w:W,h:H,ground,g,pieces:[],O:{},npcs:[],warps:{},light,art:window.LHA,bg:id,lines:[],ph:ph()}}
const lay=(M,x,y,w,h,c)=>{rect(M.ground,x,y,w,h,c);rect(M.g,x,y,w,h,c)};
const block=(M,x,y,w=1,h=1)=>rect(M.g,x,y,w,h,'#');
const open=(M,x,y)=>{M.g[y][x]=M.ground[y][x]};
function put(M,k,x,y,w=1,h=1,o={}){const p=Object.assign({k,x,y,w,h},o);M.pieces.push(p);if(!o.walk)block(M,x,y,w,h);return p}
const look=t=>({look:t});
const folkNPC=(n,talk)=>Object.assign(n,{talk:talk||(()=>Promise.resolve())});
const door=(M,x,y,to,tx,ty,dir='down')=>{open(M,x,y);M.warps[x+','+y]=()=>goTo(to,tx,ty,dir)};
async function goTo(to,x,y,dir){await fade(1);goMap(to,x,y,dir);checkpoint();await fade(0);if(G.M.arrive)await G.M.arrive()}
const bounceDir=(M,keys,text,dir)=>keys.forEach(k=>M.warps[k]=async()=>{await said(text);G.dir=dir;await stepBack()});
const range=(a,b)=>Array.from({length:b-a},(_,i)=>a+i);
const rebuild=()=>{G.M=MAPS[G.map]()};

// ---- CULLEN GAP: every phase (46 x 26). Main Street across the middle, Laurel Street south to the Pruetts' ----
function buildTown(){
 const N=isNight(),M=blank('town','CULLEN GAP',46,26,'.',N?'night':'day'),F=G.flags;M.alpha=.86;M.warm='#ffcf80';M.rain=ph()===2;
 block(M,0,0,46,2);put(M,'ridgeback',0,0,46,2,{walk:1});
 lay(M,0,2,46,5,'.');
 put(M,'bank',1,2,8,5,{door:5});
 if(ph()===3)M.O['5,6']=look(TEXT.shutStore);else door(M,5,6,'clinic',7,9,'up');
 M.O['3,6']=M.O['7,6']=look(TEXT.look.clinic);M.O['2,6']=look(TEXT.look.deposit);
 put(M,'store',10,2,7,5,{sign:'THE GAP DINER',col:'#5a7a8a',door:13,awning:1,diner:1});
 if(N)M.O['13,6']=look(TEXT.shutDiner);else door(M,13,6,'diner',7,8,'up');
 M.O['11,6']=M.O['15,6']=look(TEXT.look.diner);
 put(M,'blossom',17,4,1,1,{v:0});
 put(M,'store',18,2,5,5,{sign:'HARDWARE',col:'#8a3c24',door:21,upper:1});
 M.O['21,6']={id:'hardware',name:'HARDWARE',look:TEXT.hardware,opts:()=>N?[]:[{label:TEXT.hwOpt,once:'hwFlare',run:async()=>{await said(TEXT.hwDo);await pickup('roadflare');checkpoint()}}]};
 put(M,'store',23,2,4,5,{sign:'POST OFFICE',col:'#9a6a4a',door:25,flag:1});M.O['25,6']=look(TEXT.post);
 put(M,'blossom',27,4,1,1,{v:1,white:1});
 put(M,'church',29,0,7,7,{door:32});block(M,29,2,7,5);M.O['32,6']=look(TEXT.church);
 put(M,'blossom',37,4,1,1,{v:2});put(M,'house',39,2,6,5,{col:'#d8d0c0',roof:'#4a5a6a',door:41,seed:3,porch:1});M.O['41,6']=look(TEXT.neighbor);
 lay(M,0,7,46,1,',');lay(M,0,8,46,4,'=');lay(M,0,12,46,1,',');
 put(M,'road',0,8,46,4,{walk:1});
 [[4,7],[16,7],[28,7],[40,7],[9,12],[24,12],[36,12]].forEach(([x,y])=>put(M,'lamp',x,y));
 put(M,'bench',19,7);M.O['19,7']=look(TEXT.look.bench);put(M,'planter',8,7);put(M,'planter',26,7);
 bounceDir(M,['0,8','0,9','0,10','0,11'],TEXT.west,'right');bounceDir(M,['45,8','45,9','45,10','45,11'],TEXT.east,'left');
 lay(M,1,13,8,4,'_');put(M,'car',2,14,3,1,{tint:'#7a8494'});[2,3,4].forEach(x=>M.O[x+',14']={id:'car',name:'CAR',look:TEXT.car,opts:()=>carOpts(),used:()=>false});
 put(M,'phonebooth',7,13);
 put(M,'cruiser',36,13,3,1);[36,37,38].forEach(x=>M.O[x+',13']=look(TEXT.look.cruiser));
 put(M,'house',10,14,7,5,{col:'#e8e4d8',roof:'#3e5a4a',door:13,seed:5,shutters:'#3e6a4a'});M.O['13,18']=look(TEXT.neighbor);
 put(M,'blossom',17,15,1,1,{v:1,white:1});put(M,'picket',10,20,8,1);
 lay(M,19,13,3,11,'=');put(M,'laurel',19,13,3,11,{walk:1});
 put(M,'pruett',23,13,8,6,{door:26});door(M,26,18,'kitchen',6,8,'up');M.O['24,18']=M.O['29,18']=look(TEXT.look.lamp);
 put(M,'carport',31,14,4,5,{walk:1});block(M,31,14,4,1);block(M,34,15,1,3);
 put(M,'pcar',32,16,2,2);[32,33].forEach(x=>M.O[x+',18']={id:'pcar',name:TEXT.pcarName,look:lookPcar,opts:()=>pcarOpts(),used:()=>has('radio')&&has('tank')});
 lay(M,22,19,13,2,'g');lay(M,31,18,3,1,'g');put(M,'mailbox',22,20);M.O['22,20']=look(TEXT.look.mailbox);
 put(M,'blossom',38,16,1,1,{v:0});put(M,'blossom',42,13,1,1,{v:2,white:1});put(M,'blossom',2,19,1,1,{v:2});put(M,'blossom',6,21,1,1,{v:1,white:1});
 lay(M,36,19,7,3,';');lay(M,1,22,7,1,';');
 put(M,'shrub',24,21);put(M,'shrub',28,21);put(M,'shrub',35,21);put(M,'shrub',11,22);put(M,'shrub',43,19);
 // the pasture fence across the bottom, with its gate at Laurel's end (night 2: Go in / Not yet)
 put(M,'pasture',0,23,46,3,{walk:1,gate:20});block(M,0,24,46,2);block(M,0,23,19,1);block(M,22,23,24,1);
 if(ph()===3){open(M,20,24);M.warps['20,24']=enterField}else M.O['20,24']={id:'gate',name:'GATE',look:TEXT.gateShut};
 // people: who's where by phase
 const NP=[],p=ph();
 if(p===0)NP.push(folkNPC({id:'birdie',x:15,y:7,dir:'down'},talkBirdie),folkNPC({id:'hensley',x:35,y:12,dir:'down'},talkHensley),folkNPC({id:'ray',x:31,y:19,dir:'left'},talkRay),folkNPC({id:'jenna',x:25,y:20,dir:'down'},talkJenna));
 if(p===1)NP.push(folkNPC({id:'hensley',x:35,y:12,dir:'down'},talkHensley));
 if(p===2)NP.push(folkNPC({id:'hensley',x:35,y:12,dir:'down'},talkHensley));
 if(p===3){const c=F.carrier;NP.push(folkNPC({id:'jenna',x:25,y:20,dir:'down'},()=>play(TEXT.jennaAfter)));
  if(c==='donna')NP.push(folkNPC({id:'donna',x:21,y:22,dir:'down'},()=>play(TEXT.donnaNight2.donna)));
  else NP.push(folkNPC({id:'ray',x:21,y:22,dir:'down'},()=>play(TEXT.rayNight2[c]||TEXT.rayNight2.ray)));
  if(c!=='donna')NP.push(folkNPC({id:'donna',x:22,y:21,dir:'left'},()=>play(TEXT.donnaNight2[c]||TEXT.donnaNight2.ray)))}
 M.npcs=NP;
 M.arrive=townArrive;
 return M}

// ---- interiors: the back wall three tiles tall, the door in the bottom wall ----
function room(id,name,W,H,floor,o={}){const M=blank(id,name,W,H,floor,isNight()?'night':'day');M.alpha=o.alpha||.86;M.warm='#ffcf80';
 block(M,0,0,W,3);block(M,0,0,1,H);block(M,W-1,0,1,H);block(M,0,H-1,W,1);put(M,'room',0,0,W,H,{walk:1,floor});return M}
const backDoor=(M,x,to,tx,ty,shut)=>{put(M,'backdoor',x,1,1,2,{walk:1,shut:!!shut});if(shut){M.O[x+',2']=typeof shut==='string'?look(shut):shut}else{open(M,x,2);M.warps[x+',2']=()=>goTo(to,tx,ty,'down')}};
function buildKitchen(){const M=room('kitchen','PRUETT HOUSE',13,10,'n',{alpha:.6});
 put(M,'fridge',1,3);M.O['1,3']=look(TEXT.look.fridge);put(M,'stove',2,3);M.O['2,3']=look(TEXT.look.stove);put(M,'ksink',3,3,2,1);
 put(M,'photos',5,0,3,3,{walk:1});M.O['6,3']=M.O['5,3']=M.O['7,3']={id:'photos',name:'PHOTOS',look:TEXT.look.photos,opts:()=>photoOpts(),used:()=>!!G.fs.used['opt:photos']};
 put(M,'table',5,5,3,2);M.O['5,5']=M.O['6,5']=M.O['7,5']={id:'table',name:TEXT.tableName,look:TEXT.tableLook,opts:()=>tableOpts(),used:()=>ph()!==2||!!G.flags.deduce};
 put(M,'floorlamp',11,3);M.O['11,3']=look(TEXT.look.lamp);put(M,'floorlamp',1,7);put(M,'plant',11,7);put(M,'hutch',10,3);
 put(M,'fan',6,4,1,1,{walk:1});
 backDoor(M,9,'bedroom',5,6);
 const p=ph(),NP=[];NP.push(folkNPC({id:'donna',x:4,y:6,dir:'right'},talkDonna));if(p===1||p===2)NP.push(folkNPC({id:'ray',x:8,y:6,dir:'left'},talkRay));if(p===2)NP.push(folkNPC({id:'jenna',x:10,y:5,dir:'left'},talkJenna));
 M.npcs=NP;
 M.arrive=kitchenArrive;
 door(M,6,9,'town',26,19,'down');return M}
function buildBedroom(){const M=room('bedroom','PRUETT HOUSE · BEDROOM',11,8,'c',{alpha:.6});
 put(M,'bed',4,3,2,2);M.O['4,3']=M.O['5,3']=look(TEXT.look.bed);put(M,'floorlamp',1,3);put(M,'floorlamp',8,3);
 put(M,'dresser',7,3,1,1);M.O['7,3']=look(TEXT.look.nightlights);put(M,'lineman',1,0,2,3,{walk:1});M.O['2,3']=look(TEXT.look.lineman);
 put(M,'curtain',8,0,2,3,{walk:1});M.O['9,3']=look(TEXT.look.window);put(M,'rug',3,5,3,1,{walk:1});
 open(M,5,7);M.warps['5,7']=()=>goTo('kitchen',9,3,'down');return M}
function buildDiner(){const M=room('diner','THE GAP DINER',15,10,'n');
 const open_=!isNight();
 put(M,'counter',3,4,8,1);for(let x=3;x<11;x++)M.O[x+',4']=look(TEXT.look.counter);if(open_)M.O['6,4']=M.O['7,4']=talkMae;
 put(M,'piecase',11,4,2,1);M.O['11,4']=M.O['12,4']=look(TEXT.look.pie);put(M,'pass',3,0,6,3,{walk:1});put(M,'coffee',9,3,2,1,{walk:1});
 [[1,4],[1,7],[13,6]].forEach(([x,y])=>{put(M,'dbooth',x,y,1,2,{side:x<7?'l':'r'});M.O[x+','+y]=M.O[x+','+(y+1)]=look(TEXT.look.booth)});
 put(M,'jukebox',13,3);M.O['13,3']=look(TEXT.look.jukebox);put(M,'fan',5,6,1,1,{walk:1});put(M,'tablechairs',3,7,2,1);M.O['3,7']=M.O['4,7']=look(TEXT.look.booth);put(M,'tablechairs',10,7,2,1);
 if(open_)M.npcs=[folkNPC({id:'mae',x:6,y:3,dir:'down'},talkMae),folkNPC({id:'cecil',x:10,y:6,dir:'up'},talkCecil)];
 M.arrive=dinerArrive;
 door(M,7,9,'town',13,7,'down');return M}
function buildClinic(){const M=room('clinic','BLUE RIDGE SLEEP CENTER',15,11,'v');
 const p=ph(),who=p===1||p===3?'owen':'rao';
 put(M,'teller',4,4,7,1);for(let x=4;x<11;x++)M.O[x+',4']=look(TEXT.look.desk);M.O['6,4']=M.O['7,4']=M.O['8,4']=who==='owen'?talkOwen:talkRao;
 put(M,'vault',5,0,5,3,{walk:1});M.O['6,3']=M.O['7,3']=M.O['8,3']=look(TEXT.look.vault);
 put(M,'wchairs',1,6,3,1);M.O['1,6']=M.O['2,6']=M.O['3,6']=look(TEXT.look.chairs);put(M,'wchairs',11,7,3,1);M.O['11,7']=M.O['12,7']=M.O['13,7']=look(TEXT.look.chairs);
 put(M,'clock',13,3);M.O['13,3']=look(TEXT.look.clock);put(M,'plant',1,8);put(M,'plant',13,9);put(M,'fan',4,8,1,1,{walk:1});put(M,'column',4,7);put(M,'column',10,7);put(M,'runner',7,5,1,5,{walk:1});
 const shut=p===3;
 backDoor(M,2,'lab',5,6,shut?TEXT.labShut:null);
 // the Local chief's sheriff watches the exam room's door: Credentials, Sneak or Talk your way in gets past
 backDoor(M,12,'exam',5,6,shut?TEXT.examShut:chiefOn()?{id:'sheriff',name:TEXT.sheriffDoor,look:TEXT.sheriffLook,opts:sheriffList}:null);
 const NP=[folkNPC({id:who,x:7,y:3,dir:'down'},who==='owen'?talkOwen:talkRao)];if(p===2)NP.push(folkNPC({id:'owen',x:9,y:6,dir:'left'},talkOwen));
 M.npcs=NP;
 M.arrive=clinicArrive;
 door(M,7,10,'town',5,7,'down');return M}
function buildLab(){const M=room('lab','SLEEP LAB',11,8,'w',{alpha:.7});
 put(M,'labbed',4,3,2,2);M.O['4,3']=M.O['5,3']={id:'session',name:TEXT.sessionName,look:TEXT.sessionLook,opts:()=>ph()===2?[{label:TEXT.sessionOpt,run:session}]:[],used:()=>ph()!==2||sessionDone()};
 put(M,'monitor',7,3);M.O['7,3']=look(TEXT.look.monitor);
 put(M,'mirror',1,0,3,3,{walk:1});M.O['2,3']=look(TEXT.look.mirror);put(M,'obs',1,4,2,1);
 M.O['1,4']=M.O['2,4']={id:'obs',name:TEXT.readouts,look:TEXT.readoutsLook,opts:()=>ph()===1&&!has('tally')?[{use:'crack',label:TEXT.readoutsOpt,ok:async()=>{await play(TEXT.readoutsDo);addClue('tally',TEXT.cl.tally)},fail:()=>said(TEXT.readoutsFail)}]:[],used:()=>ph()!==1||has('tally')};
 put(M,'nightstand',8,3);put(M,'plant',9,6);
 open(M,5,7);M.warps['5,7']=()=>goTo('clinic',2,3,'down');return M}
function buildExam(){const M=room('exam','EXAM ROOM',11,8,'v');
 put(M,'examtable',4,3,2,2);M.O['4,3']=M.O['5,3']={id:'proc',name:TEXT.procName,look:()=>said(procDue()?TEXT.procLook:TEXT.look.examtable),opts:()=>procOpts(),used:()=>!procDue()};
 put(M,'lightbox',6,0,3,3,{walk:1});M.O['7,3']={id:'scan',name:TEXT.scanName,look:TEXT.scanLook,opts:()=>scanOpts(),used:()=>has('tally')};
 put(M,'cabinet',1,3);M.O['1,3']={id:'cab',name:TEXT.cabName,look:TEXT.cabLook,opts:[{use:'treat',label:TEXT.cabOpt,once:'syringe',ok:async()=>{await said(TEXT.cabDo);await pickup('lhsyringe')},fail:()=>{G.fs.used['opt:syringe']=0;return said(TEXT.cabFail)}}]};
 put(M,'stool',7,5,1,1);put(M,'sink2',9,3);put(M,'monitor',8,3);
 M.arrive=examArrive;
 open(M,5,7);M.warps['5,7']=()=>goTo('clinic',12,3,'down');return M}

// ---- THE RIDGE ROAD · MILE 31: night 1 only, in fog (48 x 20) ----
const RIDGE={y0:4,cx:36,cy:-4,r:10};
// the Pruetts' route, as trail dots: along the road to the pull-off, then straight at the wall where the tracks go up
const ROUTE=[...range(0,24).map(x=>[x,6]),[23,7],[23,8],[23,9],[23,10],[23,11],[23,12],[23,13]];
function buildRidge(){const M=blank('ridge','RIDGE ROAD · MILE 31',48,20,'s','night');M.alpha=.74;M.warm='#ffd9a0';M.fog='light';M.lantern=SHELF.fogReach(false)+(intelOn('ridge')?.12:0);
 lay(M,0,0,48,4,'S');block(M,0,0,48,4);put(M,'upslope',0,0,48,4,{walk:1});
 lay(M,0,4,37,4,'=');put(M,'ridgeroad',0,4,48,16,{walk:1});
 for(let y=0;y<12;y++)for(let x=36;x<48;x++){const d=Math.hypot(x+.5-RIDGE.cx,y+.5-RIDGE.cy);if(Math.abs(d-RIDGE.r)<1.95&&Math.atan2(y+.5-RIDGE.cy,x+.5-RIDGE.cx)>.25){M.ground[y][x]=M.g[y][x]='='}}
 lay(M,0,8,48,12,'S');block(M,0,8,48,12);
 block(M,0,8,17,1);block(M,31,8,6,1);put(M,'guardrail',0,8,17,1,{walk:1,ends:'right'});put(M,'guardrail',31,8,6,1,{walk:1,ends:'left'});
 lay(M,17,8,14,4,'g');lay(M,18,12,12,2,',');put(M,'pulloff',17,8,14,6,{walk:1});
 put(M,'stonewall',17,14,14,1,{walk:1});block(M,17,14,14,1);block(M,17,12,1,2);block(M,30,12,1,2);
 put(M,'drop',0,9,48,11,{walk:1});
 put(M,'viewer',26,13);M.O['26,13']=look(TEXT.look.viewer);
 put(M,'overlooksign',20,12);M.O['20,12']=look(TEXT.look.sign);
 // the wall: its tire tracks (Sweep, Track) give the 10:40 box
 for(let x=19;x<30;x++)if(!M.O[x+',14'])M.O[x+',14']={id:'tracks',name:TEXT.tracks,look:TEXT.tracksLook,opts:()=>trackOpts(),used:()=>has('seam')};
 // the hidden hotspot (Item list, Mushrooms): on the wall left of the coin viewer, only while the lead is High (field.js)
 M.O['25,14']={id:'seam',hidden:'mushrooms',name:TEXT.seamName,look:readSeam,used:()=>!!G.flags.seamSeen,glint:(c,x,y,now)=>LHA.seamGlint(c,x,y,now)};
 open(M,18,13);M.O['18,13']=look(TEXT.trailDown);put(M,'trailhead',18,12,1,1,{walk:1});
 M.warps['18,13']=async()=>{const r=await ask('',TEXT.trailQ,TEXT.trailOpts);if(r===0)await goTo('woods',14,1,'down');else{G.dir='up';await stepBack()}};
 put(M,'register',29,9);M.O['29,9']={id:'register',name:TEXT.register,look:TEXT.registerLook,opts:[{label:TEXT.registerOpt,once:'register',run:async()=>{await said(TEXT.registerFind);await pickup('shrooms');checkpoint()}}]};
 put(M,'mile',3,3,1,1,{n:30});M.O['3,4']=look(TEXT.look.marker(30));put(M,'mile',23,3,1,1,{n:31});M.O['23,4']=look(TEXT.look.marker(31));put(M,'curvesign',33,3);M.O['33,4']=look(TEXT.look.curve);
 range(0,17).forEach(x=>M.O[x+',8']=look(TEXT.drop));range(31,37).forEach(x=>M.O[x+',8']=look(TEXT.drop));
 put(M,'car',20,9,3,1,{tint:'#7a8494'});[20,21,22].forEach(x=>M.O[x+',9']=ridgeCar);
 bounceDir(M,['0,4','0,5','0,6','0,7'],TEXT.roadW,'right');
 for(let x=36;x<48;x++)if(M.g[0][x]==='=')bounceDir(M,[x+',0'],TEXT.roadE,'down');
 M.arrive=ridgeArrive;
 return M}

// ---- BELOW THE OVERLOOK: night 1 only, in heavy fog (30 x 22). The danger zone ----
// The tiles the woods' three roamers walk, in front of what each guards (Gameplay loop, Roamers)
const BEAT={shoe:[[22,9],[22,8],[22,7],[23,7]],box:[[22,15],[23,15],[24,15],[25,15],[26,15]],hub:[[5,10],[5,11],[5,12],[4,12]]};
function buildWoods(){const M=blank('woods','BELOW THE OVERLOOK',30,22,'S','night');if(G.flags.shoe)M.ph=ph()+10;  // the still layer is cached per M.ph: a new key once the shoe is picked up
 M.alpha=.68;M.warm='#ffd9a0';M.fog='heavy';M.lantern=SHELF.fogReach(true);
 block(M,0,0,30,22);put(M,'woodsbase',0,0,30,22,{walk:1});
 const trail=[[13,0,3,4],[6,3,10,2],[6,5,3,5],[6,9,16,2],[19,11,3,5],[8,15,14,2],[4,15,4,4],[4,18,22,1]];
 trail.forEach(([x,y,w,h])=>lay(M,x,y,w,h,'t'));
 M.blazes=[[12,1],[16,4],[5,4],[9,8],[5,11],[22,10],[18,13],[22,16],[7,16],[3,17],[12,17]];
 lay(M,0,19,30,3,'~');put(M,'creek',0,19,30,3,{walk:1});block(M,0,19,30,3);
 // side pockets off the trail, where things fell; part B links the shoe's and the hubcap's to the trail
 lay(M,23,5,4,3,'t');lay(M,22,6,1,4,'t');lay(M,1,12,4,3,'t');lay(M,5,10,1,3,'t');lay(M,24,14,4,3,'t');lay(M,22,15,2,1,'t');
 M.O['25,6']={id:'shoe',name:TEXT.shoeName,look:TEXT.shoeLook,opts:[{label:TEXT.shoeTake,once:'shoe',run:async()=>{G.flags.shoe=1;await said(TEXT.shoeDo);G.M=buildWoods();checkpoint()}}],used:()=>!!G.flags.shoe};
 if(!G.flags.shoe)put(M,'shoe',25,6,1,1,{walk:1});
 M.O['2,13']={id:'hub',name:TEXT.hubName,look:TEXT.hubLook,opts:()=>has('seam')?[]:[{use:'examine',label:TEXT.hubOpt,ok:hubDo,fail:()=>said(TEXT.hubFail)},{use:'identify',label:TEXT.hubOpt,ok:hubDo,fail:()=>said(TEXT.hubFail)}],used:()=>has('seam')};
 put(M,'hubcap',2,13,1,1,{walk:1});
 put(M,'ledge',24,13,4,1);M.O['25,13']=M.O['26,13']={id:'ledge',name:TEXT.ledgeName,look:TEXT.ledgeLook,opts:()=>G.fs.used['box:woods']?[]:[{label:TEXT.ledgeOpt,run:openBox}],used:()=>!!G.fs.used['box:woods']};
 [[1,1],[4,1],[18,1],[22,1],[26,2],[1,6],[11,6],[15,7],[24,9],[27,11],[1,10],[10,12],[14,13],[1,16],[24,17],[11,17],[28,16]].forEach(([x,y],i)=>{if(M.g[y][x]==='#'){put(M,'thicket',x,y,1,1,{v:i%3,buds:i%4===0});M.O[x+','+(y+1)]=M.O[x+','+(y+1)]||look(TEXT.look.thicket)}});
 [[20,3],[9,7],[16,12],[27,7],[3,8]].forEach(([x,y],i)=>put(M,'blossom',x,y,1,1,{v:i%3,white:1}));
 [[17,4],[12,11],[23,12],[9,16],[19,17]].forEach(([x,y])=>{if(M.g[y][x]==='#')put(M,'rock',x,y)});
 range(4,26).forEach(x=>M.O[x+',19']=M.O[x+',19']||look(TEXT.look.creek));
 open(M,14,0);M.warps['14,0']=async()=>{const r=await ask('',TEXT.trailUp,TEXT.trailUpOpts);if(r===0)await goTo('ridge',18,13,'up');else{G.dir='down';await stepBack()}};
 M.roamers=[
  {id:'wshoe',types:['stray'],sprite:'stray',name:'Stray',skulls:1,tags:EN.stray.tags,path:BEAT.shoe,look:'A deer stands in the trail, facing away from you. Then it walks toward you. Backward. There\'s a ring burned on its back, round as a plate.',guard:async()=>{if(!G.flags.shoe){G.flags.shoe=1;await said(TEXT.shoeDo);G.M=buildWoods()}}},
  {id:'wbox',types:['glim','glim'],sprite:'glim',name:'Glims',skulls:1,tags:EN.glim.tags,path:BEAT.box,look:'Two cold lights bob in front of the rock ledge, back and forth, humming a dial tone to each other.',guard:openBox},
  {id:'whub',types:['glim','glim'],sprite:'glim',name:'Glims',skulls:1,tags:EN.glim.tags,path:BEAT.hub,look:'Two cold lights hang over the side trail, turning slowly, like they\'re reading something written on the air.'}];
 M.danger=true;
 M.arrive=woodsArrive;
 return M}

// ---- THE HIGH PASTURE: night 2 only, the finale area (30 x 18); the boss waits in the burned ring ----
// The ring is 8 x 5 in the middle; stepping onto it asks Go in / Not yet. The barn, the trough and the fence are reached
// around it.
const RING={x:11,y:6,w:8,h:5};
const inRing=(x,y)=>x>=RING.x&&x<RING.x+RING.w&&y>=RING.y&&y<RING.y+RING.h;
async function enterField(){const r=await askNotYet(TEXT.gateQ,TEXT.gateIn);if(r===0)await goTo('field',15,16,'up');else{G.dir='up';await stepBack()}}
function buildField(){const M=blank('field','THE HIGH PASTURE',30,18,':','night'),F=G.flags;M.alpha=.82;M.warm='#ffd9a0';M.fog='light';M.lantern=SHELF.fogReach(false);M.lamp=!F.boss;
 block(M,0,0,30,2);block(M,0,0,1,18);block(M,29,0,1,18);block(M,0,17,30,1);put(M,'pasturebase',0,0,30,18,{walk:1});
 put(M,'barn',2,1,6,4);M.O['5,5']={id:'barn',name:TEXT.barnName,look:TEXT.barnLook,opts:[{use:'sweep',label:TEXT.barnOpt,once:'barn',ok:async()=>{await said(TEXT.barnFind);await pickup('roadflare');await pickup('firstaid');checkpoint()},fail:()=>{G.fs.used['opt:barn']=0;return said(TEXT.barnNone)}}]};
 put(M,'trough',21,5,2,1);M.O['21,5']=M.O['22,5']=look(TEXT.look.trough);
 put(M,'burnring',11,6,8,5,{walk:1});
 lay(M,1,13,6,3,';');lay(M,23,12,5,3,';');
 [[25,2],[27,8],[1,8],[3,14],[26,15]].forEach(([x,y],i)=>put(M,'blossom',x,y,1,1,{v:i%3,white:i%2}));[[9,2],[17,2],[12,15],[20,14]].forEach(([x,y])=>put(M,'rock',x,y));
 open(M,15,17);M.warps['15,17']=async()=>{const r=await ask('',TEXT.fieldOut,TEXT.fieldOutOpts);if(r===0)await goTo('town',20,23,'down');else{G.dir='up';await stepBack()}};
 M.onStep=async()=>{if(F.boss)return;if(inRing(G.x,G.y)){held=[];await bossAsk();return}M.lastOut=[G.x,G.y,G.dir]};
 M.arrive=fieldArrive;
 return M}
const MAPS={town:buildTown,kitchen:buildKitchen,bedroom:buildBedroom,diner:buildDiner,clinic:buildClinic,lab:buildLab,exam:buildExam,ridge:buildRidge,woods:buildWoods,field:buildField};

// ================= THE CAR AND THE DAY =================
function carOpts(){const p=ph(),o=[],D=TEXT.carOpt,F=G.flags;
 if(G.map==='town'){
  if(p===0)o.push({label:D.ridge,run:()=>turn(0)});
  if(p===1)o.push({label:D.ridge,run:()=>driveTo('ridge')},{label:D.rest,run:()=>turn(1)});
  if(p===2)o.push({label:D.dark,run:()=>turn(2)});
  // night 2: the light choice, before the pasture (the headlights cancel its Lamp; flares only dim it)
  if(p===3&&!F.boss&&F.light!=='car'){
   o.push({use:'fix',label:D.lights,ok:lightsOn,fail:()=>said(TEXT.lightsFail)},{use:'climb',label:D.lights,ok:lightsOn,fail:()=>said(TEXT.lightsFail)});
   if(!F.light)o.push({item:'roadflare',label:D.flares,run:async()=>{F.light='flares';await said(TEXT.flaresDo);checkpoint()}})}
  if(p===3&&F.light==='car')o.push({label:D.lights,run:()=>said(TEXT.lightsAgain)})}
 else if(p===1){
  if(F.owen&&!F.orderly)o.push({label:D.clinic,run:()=>driveTo('clinic')});
  o.push({label:D.down,run:()=>driveTo('town')},{label:D.rest,run:()=>turn(1)})}
 return o}
async function lightsOn(){G.flags.light='car';await play(TEXT.lightsOk);checkpoint()}
async function driveTo(where){const F=G.flags;await fade(1);
 if(where==='ridge'){F.drives=(F.drives|0)+1;await said(TEXT.secondDrive);await addLate();goMap('ridge',21,10,'up')}
 else if(where==='clinic'){await said(TEXT.driveTo.town);goMap('town',5,7,'up')}
 else{await said(TEXT.driveTo.town);goMap('town',3,15,'down')}
 checkpoint();await fade(0);if(G.M.arrive)await G.M.arrive()}
// day 1 → night 1 (the night drive), night 1 → day 2, day 2 → night 2: each names what closes
async function turn(i){const F=G.flags;if(ph()!==i)return;
 if(i===2){const n=boxes();if(n<3)return said(TEXT.needClues,{n});if(!F.deduce)return said(TEXT.needDeduce);if(!F.carrier)return said(TEXT.needCarrier);if(procDue())return said(TEXT.needProc)}
 const r=await askNotYet(TEXT.turnQ[i]+' '+TEXT.turnClose[i],TEXT.turnOpts);if(r!==0)return;
 await fade(1);F.ph=i+1;
 if(i===0){await nightDrive();goMap('ridge',21,10,'up');banner(TEXT.phase[1]);checkpoint();await fade(0);await G.M.arrive();return}
 await play(TEXT.rested[i]);await rest(1);goMap('town',3,15,'down');banner(TEXT.phase[i+1]);checkpoint();await fade(0);
 if(i===2&&!F.orderly)await orderlyMain()}
// the night drive (spec 016, Set pieces): the Pruetts' route in fog, in its own picture (cases/lost-hour-battle-art.js)
async function nightDrive(){const t0=performance.now();
 G.mode='scene';G.sceneArt=(c,W,H,now)=>LHB.drive(c,W,H,now-t0,{ridge:intelOn('ridge')});await fade(0);
 try{await cut('drive',()=>play(TEXT.drive))}finally{await fade(1);G.sceneArt=null;G.mode='world'}}
const caseNext=()=>{const N=TEXT.next,F=G.flags,p=ph(),n=boxes();
 if(F.boss)return N.home;
 if(p===0)return fill(N.day1,{n});
 if(p===1)return F.owen&&!F.orderly?N.owen:N.night1;
 if(p===2){if(n<3)return fill(N.day2,{n});if(!F.deduce)return N.deduce;if(!F.carrier)return N.carrier;if(procDue())return N.proc;return N.dark}
 return N.night2};

// ================= TOWN =================
async function townArrive(){}
async function lookPcar(){await said(TEXT.pcarLook);await horror(HORRORS.ring)}
function pcarOpts(){const r=!has('radio'),t=!has('tank');
 const R=async lines=>{await play(lines);addClue('radio',TEXT.cl.radio)},T=async lines=>{await play(lines);addClue('tank',TEXT.cl.tank)};
 return[{use:'sample',label:TEXT.pRadio,show:()=>r,ok:()=>R(TEXT.radioDo),fail:()=>said(TEXT.radioFail)},
  {use:'fix',label:TEXT.pFix,show:()=>r,ok:()=>R(TEXT.radioFix),fail:()=>said(TEXT.radioFail)},
  {use:'examine',label:TEXT.pRing,show:()=>r,ok:()=>R(TEXT.ringDo),fail:()=>said(TEXT.radioFail)},
  {use:'sweep',label:TEXT.pCap,show:()=>t,ok:()=>T(TEXT.capDo),fail:()=>said(TEXT.capFail)}]}
async function talkBirdie(){const F=G.flags;
 if(!F.birdie1){F.birdie1=1;await play(TEXT.birdie1);if(!haveCard())await pickup('lhcard');checkpoint()}
 const o=[{use:'read',label:TEXT.birdieOptRead,once:'birdieRead',ok:async()=>{await play(TEXT.birdieRead);addClue('seam',TEXT.cl.seam)},fail:()=>{G.fs.used['opt:birdieRead']=0;return said('She shrugs and looks at the sky for warblers.')}},
  {use:'calm',label:TEXT.birdieOptRead,once:'birdieRead',ok:async()=>{await play(TEXT.birdieRead);addClue('seam',TEXT.cl.seam)},fail:()=>{G.fs.used['opt:birdieRead']=0;return said('She shrugs and looks at the sky for warblers.')}},
  {use:'talk',label:TEXT.birdieOptShroom,once:'birdieShroom',ok:async()=>{await play(TEXT.birdieShroom);await pickup('shrooms');checkpoint()},fail:()=>{G.fs.used['opt:birdieShroom']=0;return said('"Lunch," she says. It\'s not lunch.')}},
  {use:'read',label:TEXT.birdieOptShroom,once:'birdieShroom',ok:async()=>{await play(TEXT.birdieShroom);await pickup('shrooms');checkpoint()},fail:()=>{G.fs.used['opt:birdieShroom']=0;return said('You ask about the warblers. She tells you about the warblers for a while.')}}];
 if(!hotOptsLeft(o)){await play(TEXT.birdieAfter);return}
 await hotspot({name:'BIRDIE',opts:o},'birdie')}
const hotOptsLeft=o=>o.some(x=>!(x.once&&G.fs.used['opt:'+x.once])&&(!x.use||teamHas(BLS.SKILLOPT[x.use].skill,BLS.SKILLOPT[x.use].tier)));
async function talkHensley(){const F=G.flags;
 if(isNight()){await play(TEXT.hensleyNight);return}
 if(!F.hensley1){F.hensley1=1;await play(TEXT.hensley1)}
 if(has('tank')){await play(TEXT.hensleyAfter);return}
 const tell=async()=>{F.hensleyCurious=1;await play(TEXT.hensleyTell);addClue('tank',TEXT.cl.tank)};
 await hotspot({name:'DEP. HENSLEY',look:()=>play(TEXT.hensleyAfter),opts:[{use:'talk',label:TEXT.hensleyOpt,ok:tell,fail:()=>said('"That\'s Pruett business," she says. "Ask a Pruett."')},
  {use:'paper',label:TEXT.hensleyPaper,mod:hMod,ok:tell,fail:()=>said('She looks at your clipboard, then at you, and doesn\'t reach for hers.')}]},'hensley')}
// Ray: a liar until the scan ("I feel fine": Paranoia)
async function talkRay(){const F=G.flags,p=ph();if(!has('tally'))await trigger('liar');
 if(p===2&&F.deduce&&!F.carrier){await chooseCarrier();return}
 if(!F.ray1){F.ray1=1;await play(TEXT.ray1)}
 if(F.rayOk){await play(F.carrier?(TEXT.rayNight2[F.carrier]||TEXT.rayAfter):[TEXT.rayOkLine]);return}
 const ok=async()=>{F.rayOk=1;await play(TEXT.rayRead);checkpoint()};
 await hotspot({name:'RAY',look:()=>play(TEXT.rayLie),opts:[{use:'read',mod:pMod,ok,fail:()=>play(TEXT.rayLie)},{use:'calm',mod:pMod,ok,fail:()=>play(TEXT.rayLie)},{use:'talk',mod:pMod,ok,fail:()=>play(TEXT.rayLie)}]},'ray')}
async function talkJenna(){const F=G.flags;
 if(has('left')){await play(TEXT.jennaAfter);return}
 if(!F.jenna1){F.jenna1=1;await play(TEXT.jenna1)}
 const tell=async()=>{await play(TEXT.jennaTell);addClue('left',TEXT.cl.left)};
 await hotspot({name:'JENNA',look:TEXT.jennaLie,opts:[{use:'read',mod:pMod,ok:tell,fail:()=>said('She looks at your ID for a long time. She hands it back without a word.')},{use:'calm',mod:pMod,ok:tell,fail:()=>said('She looks at your ID for a long time. She hands it back without a word.')},
  {use:'talk',ok:tell,fail:()=>said('"Uh huh," she says.')},
  // a scene on Laurel Street by day: shouting at a Pruett (overstepping, public)
  {use:'lean',ok:async()=>{F.leaned=1;await play(TEXT.jennaLean);addClue('left',TEXT.cl.left);await overstepHere('public')},fail:async()=>{F.leaned=1;await said('She doesn\'t back down an inch, and the whole street watched you try.');await overstepHere('public')}}]},'jenna')}

// ================= THE PRUETT HOUSE =================
async function talkDonna(){const F=G.flags,p=ph();
 if(!F.donnaOk){F.donnaOk=1;await play(TEXT.donna1);checkpoint();return}
 if(p===2&&F.shoe&&!F.shoeBack){F.shoeBack=1;await play(TEXT.donnaShoe);checkpoint();return}
 if(!F.donnaRead&&teamHas('Empathy',40)){await hotspot({name:'DONNA',opts:[{use:'read',mod:pMod,once:'donnaRead',ok:async()=>{F.donnaRead=1;await play(TEXT.donnaRead)},fail:()=>{G.fs.used['opt:donnaRead']=0;return play(TEXT.donnaAfter)}}]},'donna');return}
 await play(F.carrier&&TEXT.donnaNight2[F.carrier]&&p===2?TEXT.donnaNight2[F.carrier]:TEXT.donnaAfter)}
function photoOpts(){return[{use:'sweep',label:TEXT.look.photosOpt,once:'photos',ok:async()=>{await play(TEXT.look.photosDo);addClue('left',TEXT.cl.left);await cameo()},fail:()=>{G.fs.used['opt:photos']=0;return said(TEXT.look.photosFail)}}]}
// the cameo (an arc touch, at most one per case): the lead's first sighting ever rolls 0/1
async function cameo(){const L=lead();if(G.flags.cameo)return;G.flags.cameo=1;await play(TEXT.look.cameo);if(!L.a.sawTall){L.a.sawTall=1;await horror(HORRORS.cameo,{who:[L]})}checkpoint()}
// day 2, the first time in the kitchen: Jenna's question (motivation moment: Duty)
async function kitchenArrive(){const F=G.flags;if(ph()!==2||F.duty)return;F.duty=1;
 await cut('duty',()=>play(TEXT.duty));
 const r=await ask('',TEXT.dutyQ,[TEXT.dutyHold,TEXT.dutyTruth]);
 if(r===1){F.jennaTold=1;await play(TEXT.dutyTold);await overstepHere('seen');if(!has('left'))addClue('left',TEXT.cl.left);checkpoint();return}
 let held=false;
 await hotspot({name:'JENNA',opts:[{use:'talk',label:TEXT.dutyHold,ok:()=>{held=true},fail:()=>{}},{use:'paper',label:TEXT.dutyHold,ok:()=>{held=true},fail:()=>{}}]},'duty');
 if(held){F.dutyHeld=1;await play(TEXT.dutyHeld);for(const m of holdersOf('Duty'))await motivate(m)}
 else{F.dutyHeld=0;await play(TEXT.dutyFailed);await addLate()}
 await said(TEXT.dutyCost);checkpoint()}
function tableOpts(){const F=G.flags;if(ph()!==2||F.deduce)return[];return[{label:TEXT.tableOpt,run:deduce}]}
// The deduction (Gameplay loop, Deduction), at the kitchen table with Big Hat on speaker. Right needs `tally` plus
// `seam` or `memory2`; "a tracker" needs `tally`. A wrong answer costs time (late +1), never progress.
async function deduce(){const F=G.flags,L=lead(),n=boxes();if(n<3){await said(TEXT.tableNeed,{n});return}
 await play(TEXT.phone);
 if(skillVal(L.a,'Forensics')>=75&&has('radio')&&has('tank')&&!G.fs.used.recon){G.fs.used.recon=1;
  const o=SR.pct(chanceOf(L,'Forensics'));await say('',resultLine('RECONSTRUCT · FORENSICS',o),{auto:1100});
  if(o.ok)await said('The radio stopped at 10:35. The tank was filled. Somebody stopped the car on purpose and put it back on purpose, the way you put back a library book.');else tried(L,'Forensics')}
 else await hunch('It took them five hours and put them back nicer than it found them. Whatever did that isn\'t finished. People don\'t tag a thing they\'re done with.');
 const right=()=>has('tally')&&(has('seam')||has('memory2'));
 let r=await ask('BIG HAT',TEXT.deduceQ,TEXT.deduceOpts);
 const lt=!(r===0&&right())&&live().find(m=>perkOn(m,'truth'));  // Loose thread (an arc perk, spec 008)
 if(lt){await say('',fillT(BLS.HOMEW.perkUsed,{p:BLS.HOMEW.perks.truth[0],n:lt.name}));r=await ask('BIG HAT',TEXT.deduceQ,TEXT.deduceOpts)}
 if(r===0&&right()){F.deduce='right';await play(TEXT.deduceRight)}
 else if(r<2&&has('tally')){F.deduce='half';await play(TEXT.deduceHalf)}
 else{F.deduce='wrong';await play(TEXT.deduceWrong);await addLate()}
 checkpoint();await chooseCarrier()}
// The hard choice (spec 016): who carries the tally up the pasture tonight. Every option has a cost; none is a trap.
async function chooseCarrier(){const F=G.flags,O=TEXT.carrierOpts,W=TEXT.carrierOptsWhy;if(F.carrier)return;
 const ks=['ray','cut'];if(F.m2==='d'&&!F.noMove_donna&&teamHas('Occult',40))ks.push('donna');if(teamHas('Occult',40)&&!F.noMove_agent)ks.push('agent');
 await say('',TEXT.carrierQ,{keep:true,instant:false});
 const i=await choose(ks.map(k=>O[k]),{cancel:true,inBox:true,desc:ks.map(k=>W[k])});hideTB();if(i<0)return;
 const k=ks[i];
 if(k==='ray'){let ok=false;
  await hotspot({name:'RAY',opts:[{use:'read',label:TEXT.rayCarrierAsk,mod:pMod,ok:()=>{ok=true}},{use:'calm',label:TEXT.rayCarrierAsk,mod:pMod,ok:()=>{ok=true}},{use:'talk',label:TEXT.rayCarrierAsk,mod:pMod,ok:()=>{ok=true}},
   {label:'Ask him straight',show:()=>!teamHas('Empathy',40)&&!teamHas('Persuade',40),run:()=>{ok=Math.random()<.6}}]},'rayBait');
  if(!ok){await play(TEXT.rayNo);return}
  F.carrier='ray';await play(TEXT.rayYes)}
 else if(k==='cut'){F.carrier='cut';await play(TEXT.cutYes)}
 else if(k==='donna'){F.carrier='donna';await play(TEXT.donnaYes)}
 else{const m=await pickMember(TEXT.agentWho,()=>true);if(!m)return;F.carrier='agent';F.carrierId=m.a.id;await say('',fT(TEXT.agentYes,{n:m.name}))}
 await play(TEXT.hatAfter);checkpoint()}

// ================= THE DINER =================
async function dinerArrive(){const F=G.flags;
 // Noticed (quiet case): Hensley wants the study's paperwork; a fail and Mae and Cecil clam up
 if(F.noticeDue&&!isNight()){F.noticeDue=0;await cut('notice',()=>play(TEXT.notice));
  let ok=false;await hotspot({name:'DEP. HENSLEY',opts:[{use:'paper',label:'Show her the paperwork',mod:hMod,ok:()=>{ok=true}},{use:'creds',label:'Show her the paperwork',mod:hMod,ok:()=>{ok=true}}]},'notice');
  if(ok)await play(TEXT.noticeOk);else{F.clam=1;await play(TEXT.noticeFail)}checkpoint()}}
async function talkMae(){const F=G.flags;
 if(F.clam){await play(TEXT.maeClam);return}
 if(!F.mae1){F.mae1=1;await play(TEXT.mae1)}
 if(ph()===2&&!haveCard()&&!F.birdie1){await play(TEXT.maeCard);await pickup('lhcard');checkpoint();return}
 if(has('left')){await play(TEXT.maeAfter);return}
 await hotspot({name:'MAE',opts:[{use:'talk',ok:async()=>{await play(TEXT.maeTalk);addClue('left',TEXT.cl.left)},fail:()=>said('"You want pie," she says. "Everybody wants pie." That\'s all you get.')}]},'mae')}
async function talkCecil(){const F=G.flags;
 if(F.clam){await said('Cecil looks at his pie.');return}
 if(!F.cecil1){F.cecil1=1;await play(TEXT.cecil1)}
 if(has('radio')&&F.cecilTold){await play(TEXT.cecilAfter);return}
 await hotspot({name:'CECIL',opts:[{use:'talk',once:'cecil',ok:async()=>{F.cecilTold=1;await play(TEXT.cecilTalk);addClue('radio',TEXT.cl.radio)},fail:()=>{G.fs.used['opt:cecil']=0;return said('"Pie\'s good," he says, and that\'s the whole interview.')}}]},'cecil')}
const haveCard=()=>!!holderOf('lhcard')||(G.fs.pack||[]).some(it=>it.k==='lhcard');

// ================= THE CLINIC =================
async function clinicArrive(){const F=G.flags;if(ph()===1&&F.owen&&!F.orderly&&!F.owenIn){F.owenIn=1;await play(TEXT.owenOrderly)}}
async function talkOwen(){const F=G.flags,p=ph();
 if(!F.owen1){F.owen1=1;await play(TEXT.owen1)}
 if(p===1&&F.owen&&!F.orderly){await play(TEXT.owenOrderly);return}
 await play(p===2?TEXT.owenDay2:TEXT.owenAfter)}
async function talkRao(){const F=G.flags;if(!F.rao1){F.rao1=1;await play(TEXT.rao1);return}await play(TEXT.raoAfter)}
// (a data hotspot's opts: Credentials pushes overstepping back a step, as the bible says)
function sheriffList(){const past=async(back)=>{G.flags.chiefPast=1;if(back)await stepBack1();await said(TEXT.sheriffPast);G.M=buildClinic();checkpoint()};
 return[{use:'creds',ok:()=>past(true),fail:()=>said(TEXT.sheriffFail)},{use:'sneak',ok:()=>past(false),fail:()=>said(TEXT.sheriffFail)},{use:'talk',ok:()=>past(false),fail:()=>said(TEXT.sheriffFail)}]}
async function stepBack1(){const s=loadSeason();if((s.overstep|0)>0){s.overstep--;store.set(seasonKey(),s)}}
function scanOpts(){if(has('tally'))return[];const F=G.flags,day=!isNight();
 const got=async()=>{await play(TEXT.scanDo);await horror(HORRORS.scan);addClue('tally',TEXT.cl.tally)};
 if(!day)return[];
 if(!F.rayOk)return[{label:TEXT.scanAnyway,run:async()=>{await play(TEXT.raoNeedOk);await said(TEXT.scanSeen);F.scanStolen=1;await got();await overstepHere('seen')}}];
 return[{use:'treat',label:TEXT.scanMed,ok:got,fail:()=>said(TEXT.scanFail)},{use:'sample',label:TEXT.scanMed,ok:got,fail:()=>said(TEXT.scanFail)},
  {label:'Have Dr. Rao walk you through it',show:()=>!teamHas('Medicine',40)&&!teamHas('Science',40),run:got}]}
// night 1: the Orderly in the exam room (story fight 2), when Owen called
async function examArrive(){const F=G.flags;if(ph()!==1||!F.owen||F.orderly)return;
 await cut('orderly',()=>play(TEXT.orderlyIn));await fightOrderly()}
// night 2, if it wasn't met on night 1: it comes down Main Street
async function orderlyMain(){await cut('orderlyMain',()=>play(TEXT.orderlyMain));await fightOrderly()}
async function fightOrderly(){const F=G.flags;
 const r=await battle(['orderly','glim'],{story:true,intro:TEXT.orderlyIntro});if(r==='lose')return gameOver();
 F.orderly=1;await play(TEXT.orderlyDone);await play(TEXT.owenThanks);if(!has('tally'))addClue('tally',TEXT.cl.tally);checkpoint()}
// "Hold still": the Orderly lays a finger on an agent, who loses their next turn
async function holdStill(e){const ts=party.filter(m=>!m.ko&&!m.dead&&!m.gone&&!m.out),t=pick(ts);if(!t)return;await bsay(fT(TEXT.hold,{t:t.name}),1300);t.skip=1}

// ---- the procedure (day 2, the exam room): cut it out, or move it to a willing carrier ----
const procDue=()=>ph()===2&&['cut','donna','agent'].includes(G.flags.carrier)&&!G.flags.procDone;
function procOpts(){const F=G.flags;if(!procDue())return[];
 if(F.carrier==='cut')return[{use:'treat',label:TEXT.procCut,mod:20,ok:()=>cutDone(false),fail:()=>cutDone(true)},
  {label:TEXT.procCutAlone,run:()=>cutDone(Math.random()>=.5)}];
 return[{use:'identify',label:TEXT.procMove,ok:moveIt,fail:moveFailed},
  {label:'Not like this. Think again',run:async()=>{F.carrier=null;F.carrierId=null;await said('Dr. Rao puts the tray down. Nobody says anything for a while.');checkpoint()}}]}
async function cutDone(stroke){const F=G.flags;F.procDone=1;
 if(stroke){F.stroke=1;await play(TEXT.cutStroke)}else await play(TEXT.cutDo);
 await horror(HORRORS.cut);await pickup('lhjar');checkpoint()}
// the second half is the team's best Medicine (Treat) with Dr. Rao at the tray, so the lead who read it needn't be a medic
async function moveIt(){const F=G.flags;await play(TEXT.moveFind);
 const doc=live().filter(m=>skillVal(m.a,'Medicine')>=40).sort((a,b)=>chanceOf(b,'Medicine')-chanceOf(a,'Medicine'))[0];
 const x=SR.pct(doc?chanceOf(doc,'Medicine',10):50);
 await say('',fT(doc?'{n} does the cutting, with Dr. Rao at the tray.':'Dr. Rao does the cutting himself.',doc?{n:doc.name}:{}));await say('',resultLine(doc?'MOVE IT · MEDICINE':'DR. RAO',x),{auto:1200});
 if(!x.ok){if(doc)tried(doc,'Medicine');return moveFailed()}
 F.procDone=1;const m=carrierAgent();await play(TEXT.moveDo[F.carrier],m?{n:m.name}:{});checkpoint()}
async function moveFailed(){const F=G.flags;await said(TEXT.moveFail);F['noMove_'+F.carrier]=1;F.carrier=null;F.carrierId=null;checkpoint()}

// ---- the hypnosis session (spec 016, Set pieces), in its own picture: what's remembered plays in the one-way window ----
const sessionDone=()=>has('memory1')&&has('memory2')&&(!!G.flags.push||!!G.flags.pushNo)&&(G.flags.unfolded||!haveCard());
let stage=0,cardSt=0;  // cardSt: the folded card on show in the session picture (1 in Donna's hands, 2 open)
async function session(){const F=G.flags;
 if(!F.donnaOk){await said(TEXT.sessionNeed);return}
 const t0=performance.now();stage=0;
 await fade(1);G.mode='scene';G.sceneArt=(c,W,H,now)=>LHB.session(c,W,H,now-t0,stage,cardSt);await fade(0);
 try{
  await cut('session',()=>play(TEXT.sessionIn));
  for(;;){const S=TEXT.sOpt;let woke=false,acted=false;
   const o=[];
   if(!has('memory1')&&(F.m1t|0)<2)o.push({use:F.m1t?'calm':'read',label:F.m1t?S.m1b:S.m1,mod:()=>sMod()-(F.m1t?20:0),ok:m1Ok,fail:m1Fail},{use:F.m1t?'read':'calm',label:F.m1t?S.m1b:S.m1,mod:()=>sMod()-(F.m1t?20:0),ok:m1Ok,fail:m1Fail});
   if(!has('memory2')&&!F.m2rT)o.push({use:'treat',label:S.m2r,mod:sMod,ok:m2rOk,fail:async()=>{F.m2rT=1;await play(TEXT.m2rFail)}});
   if(has('memory1')&&!has('memory2')&&!F.m2dT)o.push({use:'read',label:S.m2d,mod:()=>sMod()-20,ok:m2dOk,fail:async()=>{F.m2dT=1;await play(TEXT.m2dFail)}},{use:'calm',label:S.m2d,mod:()=>sMod()-20,ok:m2dOk,fail:async()=>{F.m2dT=1;await play(TEXT.m2dFail)}});
   // never a dead end: a team that can't guide either of them still gets Donna's first memory, with Owen's help
   if(!has('memory1')&&!teamHas('Empathy',40)&&!teamHas('Medicine',40))o.push({label:S.m1,run:m1Ok});
   if(has('memory1')&&haveCard()&&!F.unfolded)o.push({label:S.card,run:async()=>{stage=1;cardSt=1;await play(TEXT.cardDo.slice(0,2));cardSt=2;await unfold(TEXT.cardDo.slice(2))}});
   if((has('memory1')||has('memory2'))&&!F.push&&!F.pushNo)o.push({label:S.push,run:pushFurther});
   o.push({label:S.wake,run:async()=>{woke=true}});
   // every option marks that something happened, so B (backing out) ends the session
   const mark=f=>async(...a)=>{acted=true;if(f)return f(...a)};
   o.forEach(x=>{if(x.use){x.ok=mark(x.ok);x.fail=mark(x.fail)}else x.run=mark(x.run)});
   await hotspot({name:TEXT.sessionName,opts:o},'session');
   if(woke||!acted)break;
  }
  await play(TEXT.sessionEnd);checkpoint();
 }finally{await fade(1);G.sceneArt=null;G.mode='world';stage=0;cardSt=0;await fade(0)}}
async function m1Ok(){stage=1;await play(TEXT.m1Do);addClue('memory1',TEXT.cl.memory1)}
async function m1Fail(){const F=G.flags;F.m1t=(F.m1t|0)+1;await play(TEXT.m1Fail);checkpoint()}
async function m2rOk(){const F=G.flags;stage=2;F.m2rT=1;F.m2='r';await play(TEXT.m2rDo);await horror(HORRORS.m2);addClue('memory2',TEXT.cl.m2r)}
async function m2dOk(){const F=G.flags;stage=2;F.m2dT=1;F.m2='d';await play(TEXT.m2dDo);await horror(HORRORS.m2);addClue('memory2',TEXT.cl.m2d)}
// Memory 3: pushing too far (no roll). The boss's weakness becomes known; the lead pays 1d4 SAN; the Pruetts' trust falls;
// it oversteps (seen: Dr. Rao and Jenna)
async function pushFurther(){const F=G.flags;const r=await askNotYet(TEXT.pushQ,TEXT.pushOpts);if(r!==0){F.pushNo=1;return}
 F.push=1;stage=3;await play(TEXT.pushDo);await horror(HORRORS.push,{who:[lead()]});
 G.fs.ident=G.fs.ident||[];if(!G.fs.ident.includes('en:surveyor'))G.fs.ident.push('en:surveyor');
 await play(TEXT.pushAfter);await overstepHere('seen');checkpoint()}
// the folded card: Donna, under, tells it what it was; or the card's own Use, with memory 1 and the seam
async function unfold(lines){const F=G.flags;if(F.unfolded)return;F.unfolded=1;await play(lines);checkpoint()}
async function unfoldTry(){const F=G.flags;
 if(F.unfolded){await said(CASE_ITEMS.lhcard.desc);return}
 if(!(has('memory1')&&has('seam'))){await said('It won\'t come open. Every time you think you\'ve got a corner, it\'s a different corner.');return}
 const lines=['You fold it backward, the way it went up the wall and came down twenty feet to the left. Corner, corner, the long fold, the one that goes inside itself.','It comes open in your hands. The card, with ducks. The check. And a sheet that was never in it: old paper, ruled in red.'];
 await hotspot({name:'THE FOLDED CARD',opts:[{use:'sample',label:'Follow the fold order',ok:()=>unfold(lines),fail:()=>said('You lose the fold on the third corner.')},{use:'identify',label:'Unfold it the way it was folded',ok:()=>unfold(lines),fail:()=>said('You lose the fold on the third corner.')}]},'card')}

// ================= THE RIDGE AND THE WOODS =================
// night 1: the route as trail dots; the Glims on arrival (story fight 1)
async function ridgeArrive(){const F=G.flags;
 if(!F.ridge1){F.ridge1=1;setTrail(ROUTE,'path');await said(TEXT.ridgeIn)}
 if(!F.glims){await cut('glims',()=>play(TEXT.glimsIn));
  const r=await battle(['glim','glim','glim'],{story:true,intro:TEXT.glimsIntro});if(r==='lose')return gameOver();
  F.glims=1;await play(TEXT.glimsDone);checkpoint()}}
// the car at the pull-off: the first time back at it after the Glims, Owen calls
async function ridgeCar(){const F=G.flags;if(F.glims&&!F.owen&&ph()===1){F.owen=1;await play(TEXT.owenCall);checkpoint()}
 await hotspot({id:'car',name:'CAR',look:TEXT.car,opts:carOpts()},'car')}
function trackOpts(){if(has('seam'))return[];const got=async()=>{await play(TEXT.tracksDo);addClue('seam',TEXT.cl.seam)};
 return[{use:'sweep',label:TEXT.tracksOpt,ok:got,fail:()=>said(TEXT.tracksFail)},{use:'track',label:TEXT.tracksOpt,ok:got,fail:()=>said(TEXT.tracksFail)}]}
// the hidden hotspot (Mushrooms): the seam, a clue (rules 1 and 2), the count that's due, and an Unsettling horror
async function readSeam(){const F=G.flags;
 await play(TEXT.seamLook);await horror(HORRORS.seam);
 if(!F.seamSeen){F.seamSeen=1;F.due=1;if(teamHas('Science',40)||teamHas('Occult',40))await said(TEXT.seamDue)}
 addClue('seam',TEXT.cl.seam);checkpoint()}
async function hubDo(){await play(TEXT.hubDo);addClue('seam',TEXT.cl.seam)}
async function openBox(){await lanternBox('woods',['roadflare','roadflare','firstaid'],TEXT.ledgeBox)}
async function woodsArrive(){const F=G.flags;if(F.woods1)return;F.woods1=1;await said(TEXT.woodsIn);
 // Survival finds a safe way down (Track shows the trail clear of the roamers' beats; Pathfinder too); Search's On guard spots the beats
 const L=lead(),sv=skillVal(L.a,'Survival');
 if(sv>=40){const o=SR.pct(chanceOf(L,'Survival'));await say('',resultLine((sv>=75?'PATHFINDER':'TRACK')+' · SURVIVAL',o),{auto:1000});
  if(o.ok){const beat=new Set(Object.values(BEAT).flat().map(p=>p+''));const safe=[];for(let y=0;y<19;y++)for(let x=0;x<30;x++)if(G.M.ground[y][x]==='t'&&!beat.has(x+','+y)&&[[13,0,3,4],[6,3,10,2],[6,5,3,5],[6,9,16,2],[19,11,3,5],[8,15,14,2],[4,15,4,4],[4,18,22,1]].some(([a,b,w,h])=>x>=a&&x<a+w&&y>=b&&y<b+h))safe.push([x,y]);
   setTrail(safe,'path');await said(TEXT.pathOk)}else{tried(L,'Survival');await said(TEXT.pathFail)}}
 if(skillVal(L.a,'Search')>=75){const o=SR.pct(chanceOf(L,'Search'));await say('',resultLine('ON GUARD · SEARCH',o),{auto:1000});if(o.ok)setTrail(G.M.roamers.flatMap(r=>r.path),'beat');else tried(L,'Search')}
 checkpoint()}

// ================= THE PASTURE AND THE BOSS =================
async function fieldArrive(){const F=G.flags;if(F.field1)return;F.field1=1;
 await cut('field',()=>play(TEXT.fieldIn));
 if(F.light==='car')await said(TEXT.fieldCar);else if(F.light==='flares')await said(TEXT.fieldFlares);
 checkpoint()}
// The boss waits for you (Gameplay loop; play.md): Go in / Not yet, cursor on Not yet
async function bossAsk(){const F=G.flags;if(F.boss)return;
 const r=await askNotYet(TEXT.ringQ,TEXT.bossOpts);
 if(r===0)return bossFight();
 const b=G.M.lastOut||[15,12,'down'];StudioMove.place(G,b[0],b[1],'down')}
// The Surveyor (Bosses; Combat numbers; tuned Nov 23, 2026 with tools/boss-sim.js). 65 HP, 60% to hit; −6 if it was counted
// (memory 1 and 2), −6 with the headlights on it, −6 if the card was unfolded and given back (47 with all three, 28% off).
// Phase 1: calipers (5), the count at everyone (2), measure (1: its next calipers on that agent does double), its Lamp (2:
// heals 5; 2 while Shaken or with flares; none with the headlights). Phase 2 at half: +5% to hit, a fog shield of 8 HP unless it was
// counted, one more calipers and count, and Take (2) on a carrier who's a person. On its own turn at a quarter HP or less
// it folds away: the fight ends, won (the Revenge moment comes then).
async function bossFight(o={}){
 const F=G.flags;F.bossSeen=1;
 await cut('lamp',()=>play(TEXT.lamp));
 G.mode='scene';await horror(HORRORS.lamp);G.mode='world';if(!party.some(m=>!m.gone))return;
 const ag=carrierAgent(),c=F.carrier||'ray';
 await cut('boss',async()=>{await play(TEXT.boss1);await said(TEXT.bossSay);
  if(c==='cut')await said(TEXT.bossSayC);else if(c==='donna')await said(TEXT.bossSayD);else if(c==='agent'&&ag)await said(TEXT.bossSayA,{n:ag.name.toUpperCase()});else await said(TEXT.bossSayR)});
 checkpoint();
 const E=EN.surveyor,cut_=c==='cut',count=has('memory1')&&has('memory2'),car=F.light==='car',flares=F.light==='flares',card=!!F.unfolded&&(haveCard()||o.noEnd);
 const takes=!cut_;
 E.dmg=cut_?'1d4+1':'1d4+2';
 E.moves=[['hit',5],['all',2],['measure',1],['lamp',2]].concat(takes?[['take',0]]:[]);  // Take only joins in phase 2 (weight 0 + 2)
 const S={holds:0,counted:false};
 const pre=async e=>{if(e.hp<=e.mhp*.25&&!e.folding){e.folding=1;await foldAway(e);return true}return false};
 E.acts={
  hit:async e=>{if(await pre(e))return;const t=pickTarget(e);if(!t)return;const m=t.measured;if(m){t.measured=0;await bsay(fT(TEXT.measuredHit,{t:t.name}),900)}await foeHits(e,t,m?(cut_?'2d4+2':'2d4+4'):e.dmg)},
  all:async e=>{if(await pre(e))return;await bsay(e.allText,1100);for(const m of targetsOf(e,true))await foeHits(e,m,e.allDmg)},
  measure:async e=>{if(await pre(e))return;const t=pickTarget(e);if(!t)return;t.measured=1;await bsay(fT(TEXT.measure,{t:t.name}),1300)},
  lamp:async e=>{if(await pre(e))return;if(car){await bsay(TEXT.lampNone,1200);return}const weak=flares||chip(e,'shaken'),h=Math.min(weak?2:5,e.mhp-e.hp);e.hp+=h;await bsay(fill(weak?TEXT.lampSmall:TEXT.lampHeal,{n:h}),1200)},
  take:async e=>{if(await pre(e))return;await take(e,c,S)}};
 E.phase2={at:.5,hit:5,moves:Object.assign({hit:1,all:1},takes?{take:2}:{}),line:TEXT.phase,
  on:async e=>{if(S.counted){await bsay(TEXT.shieldNo,1300);return}const h=Math.min(8,e.mhp-e.hp);e.hp+=h;await bsay(TEXT.shield,1400)}};
 const cuts=(count?6:0)+(car?6:0)+(card?6:0),hp=E.hp-cuts;
 const r=await battle(['surveyor'],{boss:true,hp,intro:TEXT.bossIntro,onStart:async()=>{
  const e=Bt.en[0];
  if(cuts)await say('',TEXT.bossThin,{auto:1500});
  if(F.push){G.fs.ident=G.fs.ident||[];if(!G.fs.ident.includes('en:surveyor'))G.fs.ident.push('en:surveyor');await say('',TEXT.bossIdent,{auto:1600})}
  // counting it (rule 5): the best counter on the team rolls Science or Occult; it loses its place: a lost turn, no shield
  if(count){const best=live().filter(m=>!m.ko).map(m=>[m,Math.max(chanceOf(m,'Science'),chanceOf(m,'Occult'))]).sort((a,b)=>b[1]-a[1])[0];
   if(best){const [m,p]=best;await say('',fT(TEXT.countDo,{n:m.name}),{auto:1600});const x=SR.pct(p);await say('',resultLine('COUNT IT',x),{auto:1000});
    if(x.ok){S.counted=true;e.stun=Math.max(e.stun,1);await say('',TEXT.countOk,{auto:1400})}else await say('',fT(TEXT.countFail,{n:m.name}),{auto:1400})}}
  // giving the card back (rule 4): one free round
  if(card){await say('',TEXT.cardBack,{auto:1600});e.stun=(e.stun|0)+1}}});
 if(r==='lose')return gameOver();
 const tm=F.takenAgent?party.find(m=>m.a.id===F.takenAgent):null;
 if(o.noEnd)return;  // the simulator stops at the fight's end
 if(tm)await loseAgent(tm,'taken');
 if(!party.length)return;
 F.boss=1;await ending();
}
// Take (phase 2): the hands go for the carrier. Draw fire puts them on that agent instead. Two holds lift Ray or Donna; an
// agent carrier is lifted only by a Take that lands while they're Downed.
async function take(e,c,S){const F=G.flags;
 const df=targetsOf(e).find(m=>m.drawFire);
 if(c==='agent'){const m=carrierAgent();if(!m||m.gone){const t=pickTarget(e);if(t)await foeHits(e,t,e.dmg);return}
  await bsay(fT(TEXT.take.agent,{t:m.name}),1200);
  if(df&&df!==m){await bsay(fT(TEXT.takeBlock,{t:df.name}),1000);await foeHits(e,df,e.dmg);return}
  if(m.ko){const x=SR.pct(foeHit(e));if(!x.ok){await bsay(fT('The hands close on air an inch from {t}.',{t:m.name}),900);return}
   m.gone=true;F.takenAgent=m.a.id;F.taken='agent';F.takenName=m.name;await play(TEXT.taken.agent,{t:m.name});e.gone=true;return}
  await foeHits(e,m,e.dmg);return}
 await bsay(TEXT.take[c==='donna'?'donna':'ray'],1200);
 if(df){await bsay(fT(TEXT.takeBlock,{t:df.name}),1000);await foeHits(e,df,e.dmg);return}
 const x=SR.pct(foeHit(e));if(!x.ok){await bsay(c==='donna'?TEXT.takeMissD:TEXT.takeMiss,1000);return}
 S.holds++;if(S.holds<2){await bsay(TEXT.takeHold[c==='donna'?'donna':'ray'],1300);return}
 F.taken=c==='donna'?'donna':'ray';for(const l of TEXT.taken[F.taken])await bsay(l,1600);e.gone=true}
// at a quarter HP, on its own turn, it folds away (the fight ends, won). The Revenge moment: hold it down, at a price.
async function foldAway(e){const F=G.flags;
 for(const l of TEXT.fold)await bsay(l,1400);
 const rv=holdersOf('Revenge').filter(m=>!m.ko&&!m.gone&&!m.out);
 if(rv.length){const m=rv[0];
  const r=await ask('',fT(TEXT.revengeQ,{n:m.name}),TEXT.revengeOpts);
  if(r===0){const p=Math.max(chanceOf(m,'Melee'),chanceOf(m,'Athletics')),x=SR.pct(p);await bsay(resultLine('HOLD IT DOWN',x),1000);
   if(x.ok){F.revenge='held';for(const l of TEXT.revengeDo)await bsay(fT(l,{n:m.name}),1700);await hurtAgent(m,roll(1,6),e,{tick:1});
    await horror(HORRORS.revenge);if(!m.gone&&m.san>0)await motivate(m);e.hp=0;e.dead=true;return}
   await bsay(fT(TEXT.revengeFail,{n:m.name}),1300)}
  else F.revenge='let'}
 F.folded=1;for(const l of TEXT.folded)await bsay(l,1600);e.gone=true}
window.lhBoss=()=>bossFight({noEnd:true});  // the boss simulator's entry (tools/boss-sim.js)

// ================= OVERSTEPPING (Skills and menus, Overstepping and cover stories) =================
// A quiet case: the agents came in as sleep-study researchers. Noticed (Hensley wants paperwork at the diner), Local chief
// (the county sheriff parks outside the clinic), Big Hat's call (Agency call), and the clean-up crew at the next area change.
async function overstepHere(seen){if(!(await overstep(seen)))return;await stepScene()}
async function stepScene(){
 const F=G.flags,s=stepName();
 if(s==='Noticed'&&!F.noticed){F.noticed=1;F.noticeDue=1}
 if(s==='Local chief'&&!F.chief){F.chief=1;await play(TEXT.chief);if(G.map==='clinic')rebuild()}
 if(s==='Agency call'&&!F.call){F.call=1;await play(TEXT.call)}
 if(s==='Federal agents')F.fedsDue=1;
 checkpoint()}
// the soft clock's last step: the Pruetts call the paper (public)
async function callPaper(){const F=G.flags;if(F.paper)return;F.paper=1;await play(TEXT.paper);await overstepHere('public')}
async function onArea(){
 const F=G.flags;if(!F.fedsDue||F.fedsDone)return;F.fedsDone=1;
 await cut('feds',()=>play(TEXT.feds));const r=await battle(['fed','fed','fed'],{story:true,intro:TEXT.fedsIntro});if(r==='lose')return gameOver();
 await play(TEXT.fedsWin);F.shutDown=1;await ending({worst:true})}

// ================= ENDING =================
// worst: the Lamp took Ray or Donna, or the clean-up crew shut the case down. clean: the Surveyor gone, Ray or Donna
// carried it and came home, no cut and no stroke, the paper never called, no agent lost, overstepping below Agency call.
// costly: any other win.
const lostHere=()=>(store.get(B.key('memorial'),[])||[]).filter(x=>x&&x.case===G.case&&!x.done);
function endingLabel(){const F=G.flags;if(F.shutDown||F.taken)return'worst';
 return(['ray','donna'].includes(F.carrier)&&!F.taken&&!F.stroke&&!F.paper&&!lostHere().length&&!stepAt('Agency call'))?'clean':'costly'}
function endingFacts(label){const F=G.flags;
 return{label,clues:G.clues.map(c=>c.id),saved:F.taken?0:1,overstep:stepName(),
  san:party.map(m=>({id:m.a.id,name:m.name,from:m.san0,to:m.san})),
  items:party.flatMap(m=>gearOf(m).it.filter(it=>it.pin).map(it=>it.k)).concat((G.fs.pack||[]).filter(it=>it.pin).map(it=>it.k)),
  choices:{deduce:F.deduce||null,carrier:F.carrier||null,taken:F.taken||null,stroke:!!F.stroke,push:!!F.push,unfolded:!!F.unfolded,light:F.light||null,revenge:F.revenge||null,folded:!!F.folded,
   duty:F.jennaTold?'told':F.dutyHeld?'held':F.duty?'failed':null,paper:!!F.paper,late:late(),scanStolen:!!F.scanStolen,leaned:!!F.leaned,m2:F.m2||null,
   shut:!!F.shutDown,takenCode:F.taken==='agent'?(F.takenName||'').split(' ')[0].toUpperCase():null,
   agent:F.carrier==='agent'&&!F.taken?(party.find(m=>m.a.id===F.carrierId)||{a:{}}).a.code||null:null},
  tried:party.map(m=>({id:m.a.id,skills:m.tried||[]})),
  lost:lostHere().map(x=>({name:x.name,how:x.how}))}}
async function ending(o={}){
 const F=G.flags,ag=carrierAgent();
 if(!o.worst){
  await play(TEXT.end1);
  if(!haveCard())await pickup('lhcard');
  if(!F.unfolded){F.unfolded=1;await said(TEXT.cardLets)}
  if(F.taken)await trigger('death')}
 await fade(1);G.mode='scene';await fade(0);
 if(!o.worst){const c=F.carrier||'ray';
  if(F.taken)await said(TEXT.dawn['taken'+F.taken],{n:F.takenName||''});
  else if(c==='cut')await said(F.stroke?TEXT.dawn.stroke:TEXT.dawn.cut);
  else if(c==='agent'&&ag)await said(TEXT.dawn.agent,{n:ag.name});
  else await said(TEXT.dawn[c]||TEXT.dawn.ray);
  if(!F.taken&&!F.paper)await said(TEXT.dawnSleep);
  if(F.paper)await said(TEXT.dawnPaper);
  // the agent who carried it keeps a hum behind the ear (Severe helplessness, their own roll)
  if(ag&&!F.taken){await said(TEXT.hum,{n:ag.name});await horror(HORRORS.hum,{who:[ag]})}
  // Ray's tester: a gift when the cover held (overstepping below Local chief) and Ray came home
  if(F.taken!=='ray'&&!stepAt('Local chief')){await play(TEXT.tester);await pickup('lhtester')}}
 G.rescued=F.taken?0:1;
 const label=endingLabel();await debrief(label,endingFacts(label));  // Big Hat's debrief and the case gains (debrief.js)
}

// ================= THE DEBRIEF (spec 007) =================
// The timeline boxes the card counts, the one person to bring home (the carrier), Big Hat's lines by ending and about
// the choices, the cover stories (Medicine and Bureaucracy, the weak Luck one, the easy one for a quiet clean case,
// Clean books'), and the lines after the card and the jar are bagged. It plays in the laundromat (registerCase place).
const DB=TEXT.db;
const DEBRIEF_DATA={
 clues:TL.slice(),victims:1,
 lines:{clean:DB.clean,costly:DB.costly,worst:DB.worst},
 react:F=>{const c=F.choices||{},out=[];
  if(c.shut)out.push(...DB.shut);else if(c.taken==='ray')out.push(...DB.takenRay);else if(c.taken==='donna')out.push(...DB.takenDonna);else if(c.taken==='agent')out.push(...DB.takenAgent.map(l=>[l[0],l[1].replace('{c}',c.takenCode||'Your agent')]));
  if(F.label==='worst')return out;
  if(c.revenge==='held')out.push(DB.revenge);else if(c.folded)out.push(DB.folded);
  if(c.carrier==='cut'&&!c.taken)out.push(DB.cut);
  if(c.agent)out.push(['BIG HAT',DB.agent[1].replace('{c}',c.agent)]);
  if(c.duty==='told')out.push(DB.dutyTold);else if(c.duty==='held')out.push(DB.dutyHeld);
  if(c.push)out.push(DB.pushed);if(c.paper)out.push(DB.paper);if(c.deduce==='wrong')out.push(DB.wrong);
  return out.slice(0,2)},
 end:[TEXT.quarters],
 stories:[{name:DB.med,skill:'Medicine',verb:'explain it',pass:DB.medPass},{name:DB.power,skill:'Bureaucracy',verb:'paper it',pass:DB.powerPass}],
 weak:{name:DB.weak,pass:DB.weakPass},
 easy:{name:DB.easy,skill:'Persuade',verb:'sell it',mod:40,pass:DB.easyPass},
 safe:{name:DB.safe,pass:DB.safePass},
 bagged:{lhcard:[TEXT.filed],lhjar:[TEXT.jarFiled]}
};

// ================= OPENING (Big Hat's briefing in the laundromat off I-81) =================
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
 },{place:window.LHA.laundromat});
 G.flags.ph=0;G.mode='world';goMap('town',3,15,'down');checkpoint();await fade(0);
 // the "missing hours" topic fills the timeline's first box (spec 013 edge)
 if(intelOn('hours'))addClue('left',TEXT.cl.left);
 await cut('arrive',async()=>{
  for(const m of squad())await say(m.name.toUpperCase()+' · '+profOf(m.a).name.toUpperCase(),TEXT.role[profOf(m.a).role]||TEXT.roleAny);
  await said(TEXT.arrive)});
}


// ================= ON THE CASE BOARD =================
// portraits: the townsfolk's faces (lost-hour-art.js) and the boss's (lost-hour-battle-art.js). sprite/spriteSize: battle
// sprites (the clean-up agent is Still Harvest's SHB).
registerCase({id:'lost-hour',card:caseCard,opening:caseOpening,intel:TEXT.intel,maps:MAPS,tiles:{},
 portraits:name=>window.LHA.portraits[name]||(name==='THE SURVEYOR'&&window.LHB?LHB.portrait:null),
 enemies:EN,sprite:(k,f,w)=>k==='fed'&&window.SHB?SHB.sprite('fed',f,w):LHB.sprite(k,f,w),spriteSize:k=>k==='fed'&&window.SHB?SHB.size('fed'):LHB.size(k),
 backdrop:(p,o)=>LHB.backdrop(p,Object.assign({rain:!!(G.M&&G.M.rain)},o)),  // the map's weather: Main Street's day-2 rain
 get place(){return window.LHA&&LHA.laundromat},  // Big Hat's place for this case: the briefing passes it, and the debrief plays there too (engine.js casePlace)
 items:CASE_ITEMS,next:caseNext,quiet:true,loot:LOOT,onArea,
 debrief:DEBRIEF_DATA,label:endingLabel,facts:endingFacts});
})();
