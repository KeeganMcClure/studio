// Black Lantern · cases/still-harvest.js
// CASE: Operation Still Harvest (Marrow Creek, Oregon), the demo case. Rewritten for Demo 5 part C (spec 006, Nov 22):
// its text block, skill-driven clues, a deduction, branching choices that rejoin, motivation moments, overstepping,
// two story fights, roamers in one danger zone, a Lantern Box, rests, and the Gleaner at the bible's numbers.
// Needs engine.js, field.js and battle.js loaded first. Everything here is plain data and small async scripts.

// ================= TEXT =================
// Every line of the case (Tech, Where text lives; Voice). Scripts refer to lines by key. A list plays box by box:
// a plain string is narration, ['WHO', 'line'] is someone talking. {code} and {first} are the lead's; other {keys} are
// filled by the script. Menu words, items and names stay in strings.js.
const TEXT={
 next:{dot:'Start with Dot at the diner, then find something Deputy Ross can believe: {n}/3 town clues.',proof:'Find something Deputy Ross can believe: {n}/3 town clues.',ross:'Take what you\'ve found to Deputy Ross, by his cruiser.',
  gate:'Get through the maze gate, on the east side of town.',maze:'Go through the maze gate, on the east side of town.',
  find:'Find the missing in the corn maze ({n}/3 cut down), then reach its center.',home:'Get home.'},
 rewritten:'This case file was rewritten while you were away. Your team starts it over from the briefing, with everything they carry.',
 // ---- the briefing ----
 open1:'SATURDAY · 11:52 PM',
 open2:'A text from an unlisted number: "BACK OF THE DONUT PLACE. EXIT 253. NOW."',
 brief:['The back room of a 24-hour donut shop off I-5. Spurs on linoleum.',['BIG HAT','Agent {code}. Sit.'],'There is no chair.',
  ['BIG HAT','Agency rang six teams tonight. You were awake.'],
  ['BIG HAT','Marrow Creek, Oregon. Eight hundred and twelve people and a Dairy Queen that closes at six.'],
  ['BIG HAT','Three of \'em gone in nine days. All durin\' the Harvest Lantern Walk.'],
  ['BIG HAT','Local police say they wandered off.'],['BIG HAT','Local police also mailed me a photo. Scarecrow in a church dress, wearin\' one victim\'s wedding ring.'],
  ['BIG HAT','I don\'t care for scarecrows, {first}. A scarecrow is a man with the man taken out.']],
 briefShout:'AND I WILL NOT HAVE IT IN MY JURISDICTION.',
 brief2:['He sets down his cruller. His hand is perfectly steady.'],
 // Big Hat's two questions (spec 013): the four topics, his two-box answer, the Case file's INTEL line. The edges are in
 // the scripts below (intelOn('town'), 'photo', 'law', 'maze'). "Two questions", "No questions" and "That's two" are strings.js BRIEF.
 intel:[
  {id:'town',label:'The town',answer:['Diner\'s the only thing open durin\' the Walk. Woman named Dot runs it.','Dot\'s known every soul in that town since the Carter administration. Start with the pie.'],
   note:'Dot runs the diner, the only place open during the Walk. She knows everybody.'},
  {id:'photo',label:'The scarecrow photo',answer:['Ring\'s real. I had a fella check.','Somebody dressed that scarecrow careful. Like for church. Count how many more they made.'],
   note:'The ring on the scarecrow is real. Somebody dressed it with care. Count the scarecrows.'},
  {id:'law',label:'The local law',answer:['One deputy. Ross. Only one who called it in, and he called from his own phone.','He won\'t hand you the key to anything on a hunch. Bring him three things that ain\'t crazy.'],
   note:'Deputy Ross called it in from his own phone. He needs three things that aren\'t crazy.'},
  {id:'maze',label:'The corn maze',answer:['Corn maze on the east side. Gate\'s chained till dusk.','You cut that chain loud, the whole town hears it. Find a key or find a quiet tool.'],
   note:'The gate is chained until dusk. Forcing it is loud.'}],
 brief3:[['BIG HAT','You go in with badges. Town knows you\'re federal. Act like it.'],['BIG HAT','Ask around. Find \'em. Bring \'em home if they\'ll come.']],
 brief4:[['BIG HAT','And {first}? Be home by Sunday. I don\'t do paperwork on a Sunday.'],'You never see his eyes. Just the brim, and under it, the toothpick, moving.'],
 arrive:'OPERATION STILL HARVEST. Talk to people with A. Press START for your notebook and party.',
 role:{Investigator:'Let\'s knock on some doors.',Healer:'I brought the good bandages.',Analyst:'For the record, I don\'t believe in any of this.',Vanguard:'Point me at it.',Lorekeeper:'I\'ve read about towns like this. None of the endings were happy.',Tech:'No cell signal. That\'s... not great.',Bruiser:'I\'ll do the talking. And the hitting.',Support:'Everybody drink some water.',Tracker:'Corn this tall in October is wrong.',Confessor:'I\'ll pray for us. Somebody should.',Courier:'I\'ve delivered to Marrow Creek. Nobody ever signs.',Undertaker:'Lovely town. Very... still.',Scrapper:'Got my keys, got my mop. Let\'s go.',Morale:'Anybody want a Bomb Pop? No? More for me.'},
 roleAny:'Let\'s get this over with.',
 tiles:{P:'A pumpkin. Someone carved a face in it, then a second, smaller face inside the mouth.',H:'A hay bale. Warm, like something was just sleeping in it.',L:'A paper lantern on a post. The candle burns but gives off no heat.',C:'Corn, taller than you. It rustles, though there\'s no wind.',T:'An old oak in full autumn color.',F:'A split-rail fence.',B:'Shingles. A crow on the roof watches you and does not blink.','#':'Clapboard and peeling paint.'},
 // ---- Dot, at the diner ----
 dot1:[['DOT','Hon, you look like you drove all night. We\'re closed for the Walk.'],['DOT','But I\'ll tell you what I tell everybody.'],['DOT','The pie is better than the coffee. And the coffee is better than you\'d think.']],
 dotQ:'What can I do you for?',dotOpts:['Ask about the missing','Ask about the Walk','Never mind'],
 dotM:[['DOT','Carol? Sweetest woman. Did the Henderson scarecrow this year. You should see it.'],['DOT','Spitting image of her. Even wears her ring. Real one.'],
  ['DOT','Every family builds one for the Walk, you know. Most of \'em look like straw.'],['DOT','This year three of them came out... finished.']],
 dotW:[['DOT','Fifty-one years I\'ve walked it. Never once went in the maze after dark, though.'],['DOT','That\'s just manners. You don\'t go in until you\'re asked.']],
 cScare:'Every family builds a scarecrow for the Walk. Carol Henderson\'s wears her real wedding ring.',
 // ---- Mayor Pell, at the podium ----
 pell1:[['MAYOR PELL','Welcome, welcome! Federal folks! How exciting.'],['MAYOR PELL','Have you tried the cider? Everyone tries the cider.']],
 pellLook:[['MAYOR PELL','Every year the whole town carries lanterns to the center of the maze and back.'],['MAYOR PELL','We give thanks for the harvest. And the harvest gives thanks for us.']],
 pellMiss:[['MAYOR PELL','Missing is such a strong word. They\'re where they\'re meant to be.'],['MAYOR PELL','Isn\'t that what we all want?']],
 pellChief:'Mayor Pell smiles at you and says nothing at all. The Sheriff\'s orders.',
 pellRead:['He hasn\'t blinked since you walked up.',['MAYOR PELL','Sixty-six good harvests in a row. We keep our word. Like always.'],['MAYOR PELL','Like always. Like always. Like always.'],'He smiles. He doesn\'t seem to know he did that. Under the smile, he is terrified.'],
 pellTalk:[['MAYOR PELL','Off the record? The Committee signed for this town in 1958. My father signed.'],['MAYOR PELL','We\'ve had sixty-six good harvests. Like always. Like always.'],'He stops. He looks at his own hand like it said something.'],
 pellTape:['You play him Pip\'s voice: "There\'s one more every morning."','The mayor\'s face does something complicated.',['MAYOR PELL','Children count. That\'s all. The Walk ends at the center. Like always.']],
 pellLean:[['MAYOR PELL','Fine. FINE. Take the binder. It\'s just names.'],['MAYOR PELL','It\'s been just names since 1958.']],
 cWalk:'The Walk ends at the maze center. The Committee "signed" for good harvests in 1958. The mayor loops when he talks about it.',
 podium:'PODIUM',
 podLook:['A podium wrapped in bunting. A brass plaque: HARVEST COMMITTEE, EST. 1958.','A black binder sits on the shelf underneath, next to a locked cash box.'],
 podGone:['A podium wrapped in bunting. A brass plaque: HARVEST COMMITTEE, EST. 1958.'],
 podRecords:['Under the plaque, a row of little engraved tags. One per year. 1958 to now.','Each tag says the same thing: GOOD HARVEST. THREE GIVEN.'],
 binder:'Lift the Committee binder',lockbox:'Force the cash box',
 podLift:'You lift the binder while the mayor is busy smiling at a lantern.',podCaught:[['MAYOR PELL','Ah ah. That\'s Committee property.'],'Half the square saw that.'],
 podForce:'The cash box pops. Inside, under the float, the Committee\'s binder. Heads turn across the square.',
 binderRead:['Three names a year, every year, since 1958. Each line signed by the Committee.','This year\'s: CAROL HENDERSON. DEV OKORO. WALTER ABBOT.','Under them, a fourth line, ruled and empty.'],
 cList:'The Committee\'s binder: three names a year since 1958, this year\'s three, and an empty fourth line.',
 // ---- Pip ----
 pip:[['PIP','My dad says don\'t count the scarecrows.'],['PIP','I counted anyway. There\'s one more every morning.'],['PIP','Yesterday\'s new one had glasses like Mr. Abbot.'],['PIP','Mr. Abbot gave me a butterscotch once.']],
 pipGift:['PIP','You can have my dad\'s coffee. He\'s not using it. He\'s been standing in the backyard since Tuesday.'],
 pipAfter:[['PIP','Dad\'s inside now. He\'s sleeping on the couch with his shoes on.'],['PIP','I\'m not counting anymore.']],
 cCount:'A kid has been counting scarecrows: one more every morning. The newest wears Walter Abbot\'s glasses.',
 // ---- the notice board ----
 board:['MISSING: CAROL HENDERSON (41). DEV OKORO (19). WALTER ABBOT (77).','All three were last seen boarding the hayride to the corn maze.','Someone has colored over each face in orange crayon. Carefully. Staying inside the lines.'],
 boardSweep:['Under the posters, pinned flat, an older flyer.','"LANTERN WALK CLOTHING DRIVE. Leave one thing you carry every day. The Committee will see it gets used."'],
 boardPaper:['The Walk\'s county permit is taped up in the corner, like they\'re proud of it.','Line 9, "Materials": straw, twine, lanterns, and "personal effects, three (3), collected by the Committee."'],
 boardExam:['The crayon on the posters is Crayola, Burnt Orange. Pressed hard, with a ruler for the edges.','The same orange labels the box at the podium: CLOTHING DRIVE. ONE ITEM, PLEASE.'],
 cDrive:'Before each Walk the Committee collects one everyday thing from chosen people. It "gets used."',
 // ---- the cider stand ----
 cider:['A folding table under a striped awning. FREE CIDER! PRESSED FROM OUR OWN MAZE APPLES.','Nobody is behind the table. The cups are already poured.'],
 ciderGone:'The cider jug is empty. You don\'t remember finishing it.',
 ciderDrink:'Everyone drinks (full heal)',
 ciderDrank:['It\'s sweet. Very sweet. Under the sweetness it tastes like old pennies.','Everyone feels great. Everyone feels like they belong here.'],
 ciderSample:['Under the lens: apple pulp, and fine gold fibers. Straw.','Apples grown in that maze. You\'d belong to it a little, after a cup.'],
 ciderExam:['Every cup is poured to the same line. Every cup has one blade of straw in it, floating.','Like a name tag.'],
 cCider:'The cider is pressed from apples grown inside the maze, straw and all. It makes you belong.',
 // ---- the church ----
 church:'CHURCH',
 churchLook:['A note on the church door: SERVICES SUSPENDED. PLEASE DO NOT RING THE BELL.','The bell rope hangs just inside. Above the door, a wheat sheaf is carved over a lantern.'],
 churchAfter:'The pews are full of scarecrows in Sunday clothes. None of them turn around. It\'s the quietest room in town.',
 ring:'Ring the bell',identify:'Identify the carving',
 bell:['BONNNNNNG.','All across town, every scarecrow turns its head toward the church.','Then, slowly, they turn back.'],
 bellAfter:'By the door hangs a brass handbell. Whatever is out there hated that sound.',
 carving:['A harvest mark, and over it, scratched in later, a binding sign.','Old-country stuff: a bell keeps the reaper off the parish. Somebody stopped ringing it.'],
 carvingAfter:'Inside the door, a brass handbell, polished from use. Somebody used to ring this every night.',
 cBell:'The scarecrows answer to the church bell. A brass handbell might hold them for a moment.',
 churchRest:'Rest in the church',
 churchRested:['Nothing follows you in. You sleep an hour in a back pew, between two scarecrows in their Sunday best.','Nobody snores. That\'s the worst part.'],
 // ---- Mr. Sutter, behind the fence (motivation moment: Family) ----
 sutter:'Past the fence, in a dark backyard, a man stands facing the corn. He hasn\'t moved. His coffee mug is still in his hand.',
 sutterAfter:'Mr. Sutter\'s backyard is empty. A coffee mug sits on the fence post, full of rain.',
 sutterOpt:'Bring him inside',
 sutterDo:['You take his elbow. His sleeve crunches. There\'s straw where his wrist should be warm.','He lets you walk him in. He says "thank you" to the couch, very politely.'],
 sutterH:'Mr. Sutter\'s sleeves',
 // ---- Deputy Ross ----
 ross0:[['DEPUTY ROSS','Deputy Ross. Look, I don\'t know what the Feds want with a couple of people who wandered off.'],['DEPUTY ROSS','Talk to folks. Bring me something that isn\'t crazy. ({n}/3)']],
 rossKey:['DEPUTY ROSS','Gate\'s on the east side. Go. I\'m staying with the car. Somebody has to drive whoever comes back.'],
 rossNo:['DEPUTY ROSS','Sheriff says you don\'t get the key. Sheriff signs my checks. You want in, find another way.'],
 rossChief:['DEPUTY ROSS','Sheriff was just here. Said you\'re done. I\'m supposed to say you\'re done.'],
 rossTalkOk:[['DEPUTY ROSS','...God help me.'],['DEPUTY ROSS','Fine. Sheriff never has to know.']],
 rossCredOk:[['DEPUTY ROSS','That\'s... a real federal order. With a seal.'],['DEPUTY ROSS','Sheriff can take it up with whoever signs those.']],
 rossTalkNo:'Ross shakes his head. He means it.',
 ross3:[['DEPUTY ROSS','...Okay. That\'s three people telling me the same crazy story.'],['DEPUTY ROSS','Sheriff told me to lose the key to the maze gate. Said the Walk would sort it out.']],
 rossAsk:'So who\'s doing it? Who picks?',
 rossOpts:['Nobody. It takes what it wants.','The Harvest Committee picks them.','Dot at the diner.'],
 rossRight:[['DEPUTY ROSS','The clothing drive. Jesus. My wife gave them her reading glasses.'],['DEPUTY ROSS','Mayor Pell is going to sit in my back seat tonight. He can say "like always" to the cage.']],
 rossNoProof:[['DEPUTY ROSS','The Committee is the mayor and four retirees with a bake sale.'],['DEPUTY ROSS','Prove it, or don\'t say it to me again.']],
 rossWrong:[['DEPUTY ROSS','That\'s... a theory.'],['DEPUTY ROSS','Doesn\'t matter. I\'m giving you the key.']],
 rossGive:['DEPUTY ROSS','Here. Bring them home.'],
 recon:'Reconstruct · tie it together',
 reconOk:'The ring on Carol\'s scarecrow. The flyer\'s "one thing you carry every day." Someone took her ring for the drive.',
 hunch:'Somebody had to put Carol\'s real ring on that scarecrow. Who collects things in this town?',
 cruiser:['Deputy Ross\'s cruiser. Cold coffee cups, a shotgun, and a child\'s drawing taped to the dash.','In the drawing, a scarecrow is crying.'],
 cruiserSweep:['DEPUTY ROSS','Trunk\'s got road flares. Take one. Take two. I\'m not going in there.'],
 cruiserRest:'Rest in the cruiser',
 cruiserRested:['Ross pours thermos coffee into a hubcap-sized lid and doesn\'t ask questions.','You sleep an hour in the back seat. It smells like dog and Armor All.'],
 dinerLook:'The diner door is locked. A sign in the window: GONE TO THE WALK. BACK SOON. BACK SOON. BACK SOON.',
 dinerSweep:'Under the kitchen window, a dented canister of rock salt for the steps.',dinerNone:'Nothing but cigarette butts and a coupon for half off pie.',
 hayLook:'A hay bale. Warm, like something was just sleeping in it.',
 haySweep:'Stuffed in the hay, a half-used brick of Black Cats from the Fourth.',
 sign:['WELCOME TO MARROW CREEK. HOME OF THE HARVEST LANTERN WALK. POP. 812.','Someone crossed out 812 in orange crayon and wrote 809. Under that, smaller: 808?'],
 home:'Big Hat said be home by Sunday. Not yet.',
 // ---- the Volunteer and the gate ----
 vol:[['VOLUNTEER','Hi there! Harvest Committee! The maze is closed until the Walk.'],['VOLUNTEER','You don\'t have a lantern. You can\'t go in without a lantern. You\'d get lost.'],['VOLUNTEER','You\'d get FOUND.'],['VOLUNTEER','Here. Let me hold your faces for you.']],
 volIntro:'The Volunteer\'s sack head splits into a wider smile!',
 volDone:['The volunteer folds over like an empty coat. Straw spills out of the sleeves.','His clipboard has a list of names. Three are crossed out.','The fourth line is blank, waiting.'],
 cClip:'The Volunteer\'s clipboard: three names crossed out, and a fourth line left blank.',
 gate:'MAZE GATE',
 gateShut:'A heavy gate wrapped in chain. A sign: LANTERN WALK TONIGHT. NO ENTRY BEFORE DUSK.',
 gateOpen:'Beyond the gate, the corn is taller than any corn should be.',
 gateIn:'Go in',gateKey:'The key turns. The chain slides off like it wanted to.',gateForce:'The chain gives with a bang that rolls across the whole town.',gateCut:'The bolt cutters bite through the chain. Quiet as a sigh.',
 gateNoForce:'The chain holds. Your shoulder doesn\'t.',
 enter:['Somewhere ahead in the dark, a lantern is moving.','(The maze is dark. Things walk it. Your light shrinks as your SAN drops.)'],
 leaveQ:'Head back out to town?',leaveOpts:['Go back','Stay'],
 clearQ:'The corn opens onto the clearing. Lantern light, and something tall that hasn\'t moved. Once you step in, there\'s no walking back out.',clearOpts:['Go in','Not yet'],
 // ---- the Sheriff (Local chief), Big Hat's call (Agency call), the clean-up crew (Federal agents) ----
 chief:[['SHERIFF DUNN','Sheriff Dunn. I don\'t care whose badge that is.'],['SHERIFF DUNN','Marrow Creek has a Walk to get through. Folks are going to stop talking to you now.'],'He tips his hat to a scarecrow on the way out. Out of habit, you think.'],
 call:['Your phone buzzes. Unknown number. You know who it is.',['BIG HAT','I am hearin\' about you on the police scanner, {first}.'],['BIG HAT','Don\'t ask for anything next time. You won\'t get it.']],
 feds:['Black cars at the edge of the light. Four doors open at the same time.',['CLEAN-UP','Black Lantern. You\'re done here. Hand over what you\'ve found.'],['CLEAN-UP','Or don\'t. Paperwork\'s the same either way.']],
 fedsIntro:'The clean-up crew draws down!',
 fedsWin:['The black cars leave the way they came, slower now, one short.','By dawn, the maze has a fence around it and a sign that says GAS LEAK.','Nobody asks what you found. Nobody ever will.'],
 // ---- the maze ----
 track:'Drag marks',trackLook:'Two grooves in the dirt, like heels dragged backward. They lead deeper in.',
 trackOk:'The marks are easy once you see them. You follow them in your head, turn by turn.',trackFail:'The grooves split, cross, and give out in the corn.',
 pathOk:'You read the maze like a field: where the corn was cut, where it was planted after. A safe way in shows itself.',pathFail:'Every row looks like every other row.',
 onguardOk:'You stop at the gate and listen. Things are walking the rows. You learn their beats before they learn you.',
 onguardFail:'Somewhere in the corn, something is walking. You can\'t tell where.',
 box:'LANTERN BOX',boxLook:'A cooler zip-tied shut and wrapped in a pink Walmart gift bag. A Post-it: "FOR THE FELLAS. - BH".',boxOpen:'Open it',
 boxLine:'Inside, packed in the bag\'s tissue paper, like a birthday:',
 pack:'A dropped backpack, Marrow Creek High. Inside, among the gum wrappers:',
 page:'PAGE',pageLook:'A torn page, pinned to a scarecrow\'s chest with a lantern hook.',
 pageRead:['A page from a Lantern Walk program, 1958:','"The Committee has signed in good faith, for good harvests. The Gleaner takes only what is offered."','"Each family offers its likeness. When the likeness is finished, it is harvested."','Someone has written underneath in pencil: "it gets weaker when they\'re cut down."'],
 cLore:'The 1958 page: the Committee signed for good harvests. The Gleaner harvests finished likenesses. Cutting them down weakens it.',
 pageTr:'Translate the margin',pageTrOk:['In the margin, in an older hand, in Latin: "Called the Gleaner. Answers to its name, if its name is spoken in the record."','You have the record. You could speak it.'],pageTrFail:'The margin is in Latin, or close to it. You get "harvest" and "name" and nothing in between.',
 pageAloud:'Read all of it aloud',
 pageAloudDo:['You read the whole page out loud, into the corn, so it\'s on the record.','The Committee\'s promise. The names of the first three, 1958. Their ages.','The corn goes quiet to listen. Then something far off starts walking toward your voice.'],
 pageH:'Reading the whole page',
 victimLook:'The twine is knotted tight.',
 cut:'Cut them down',
 longIntro:'Something unfolds out of the corn beside the pole, and keeps unfolding.',
 longStory:'The Long Man!',
 longDone:'The Long Man goes down like a felled tree. The scarecrow on the pole is still breathing.',
 limp:'{n} limps back toward the gate, toward Deputy Ross.',
 // ---- the center and the Gleaner ----
 fourth:['Just short of the center stands a fourth pole. A fresh scarecrow is tied to it.','It wears a lanyard. The name on it is {code}, in neat Committee handwriting.','Its hands are wrapped around a donut-shop coffee cup with a toothpick in it.'],
 fourthH:'Seeing yourself on a pole',
 cFourth:'A fourth pole at the maze center, with a scarecrow of {code} on it.',
 boss1:'At the center of the maze something tall is waiting. It is made of every harvest this town ever gave.',
 boss2:'Where its face should be, there is a lantern.',
 bossSay:['THE GLEANER','AGENT {code}.'],
 bossSay2:['THE GLEANER','YOU CAME WITHOUT BEING OFFERED. NO MATTER.'],
 bossLeft:['THE GLEANER','I HAVE {n} ALREADY. YOU WILL MAKE {m}.'],
 bossNone:['THE GLEANER','YOU TOOK MY LIKENESSES. THEN I WILL MAKE NEW ONES. FROM YOU.'],
 bossNoFourth:['THE GLEANER','THE FOURTH LINE IS EMPTY. WHO DID NOT DO THEIR PAPERWORK?'],
 bossIntro:'The Gleaner unfolds to its full height!',
 bossThin:'It looks thinner than it should. Cutting down {v} weakened it.',
 bossNames:'The Gleaner speaks your names, one by one, as if tasting them.',
 bossPhase:'The lantern flares white. The corn leans in to listen.',
 bossPhaseGlean:'The lantern flares white. On their poles, the ones you left start to glow. It\'s drinking from them.',
 // ---- the ending (Demo 6 plays the full debrief; this is the stand-in) ----
 end1:['The lantern goes out. The Gleaner comes apart like a sheaf with the twine cut.','In the dark you hear the corn settle, like a held breath let go.'],
 endLost:'The scarecrows still on their poles don\'t breathe anymore. {n} {v} gone.',
 dawn:'Dawn. The Lantern Walk never happens. Nobody in Marrow Creek can say why they canceled it.',
 dawn3:'All three walk out of the corn alive. Deputy Ross cries in the cruiser and says it\'s allergies.',
 dawnSome:'{n} of 3 walk out alive. Deputy Ross drives them to County General without a word.',
 dawnNone:'Nobody else comes out of the corn. Deputy Ross looks at your face and doesn\'t ask.',
 dawnPell:'Mayor Pell spent the night in Ross\'s back seat. In the morning he\'s just an old man who needs a bathroom.',
 cameo:['At the edge of the cruiser\'s lights stands a tall man in a long coat, a book under his arm.','You look again. It\'s a fence post.'],
 cameoH:'Someone at the edge of the light',
 filed:['BIG HAT','This page. I\'ll file it. Records wants it by Monday.'],
 cruller:'He slides you a cruller across the desk. It is, somehow, still warm.',
 // ---- the debrief (spec 007): Big Hat's lines by ending ({x}/{t} clues found, {v}/{n} saved), what he says about
 // the choices you made, the cover stories and the lines after them ----
 db:{
  clean:[['BIG HAT','All three walked out of the corn. Mayor\'s in county lockup, cryin\' about crop yields.'],['BIG HAT','{x} clues outta {t}. Seen worse bows on uglier packages. Sit.']],
  costly:[['BIG HAT','Corn\'s quiet. That\'s the good news.'],['BIG HAT','The rest is in your preliminary. I read it twice. It didn\'t get better the second time.'],['BIG HAT','{x} clues outta {t}. {v} of {n} home. Sit.']],
  worst:[['BIG HAT','Black cars. Men with no faces fillin\' out forms I\'m not cleared to read.'],['SHOUT','THAT WAS MY CASE.'],['BIG HAT','It\'s closed. Not by us. Don\'t ever make me say that sentence again.']],
  cider:['BIG HAT','You drank the cider. It\'s in the blood work. Lab tech threw up. Don\'t do that again.'],
  bell:['BIG HAT','Somebody rang a church bell they were asked real nice not to ring. Pastor sent me a fruit basket. I don\'t know what that means.'],
  wrong:['BIG HAT','Mayor Pell slept in his own bed Friday night. You think about that.'],
  sutter:['BIG HAT','Pip\'s dad is home. Kid called this office. I don\'t know how the kid got this number.'],
  caught:['BIG HAT','Man in a Committee sash says you tried to lift his binder. I told him we can\'t read.'],
  zip:['BIG HAT','Fella you zip-tied talked the whole ride. Mostly about his mother. Some of it was useful.'],
  gas:'Gas leak at the cider mill',gasPass:[['BIG HAT','Carbon monoxide. Mass hallucination. Cider mill gets condemned. Clean.']],
  fire:'Crop fire, nobody hurt',firePass:[['BIG HAT','Burn the field, call it an accident. Town\'ll thank you and never know why.']],
  weak:'Kids, pranks, gone too far',weakPass:[['BIG HAT','Teenagers and scarecrows. Nobody wants to know more than that. You got lucky.']],
  photo:'A hoax, with photos to prove it',photoPass:[['BIG HAT','Gazette runs your picture under HARVEST HOAX. Letters to the editor for a month. Perfect.']],
  safe:'Already filed: a quiet weekend',safePass:[['BIG HAT','Paperwork says Marrow Creek had a quiet weekend. Paperwork\'s never wrong.']]
 }
};
const fill=(t,o)=>String(t).replace(/\{(n|m|v|l|a|b|d|s)\}/g,(x,k)=>o[k]??x);
// plays a list of boxes: a string is narration, ['WHO', 'line'] is speech
async function play(seq,o={}){for(const l of [].concat(seq)){if(Array.isArray(l))await say(l[0],fill(l[1],o));else await say('',fill(l,o))}}
async function said(l,o={}){return play([l],o)}

// The case board card (spec 004, step 3). Teaser lines only: no twist, no solution. Still true after the rewrite.
const caseCard={
 file:1,
 title:'STILL HARVEST',
 town:'MARROW CREEK',
 place:'LANTERN WALK · MARROW CREEK, OR',
 hook:['Three townsfolk went missing on the','Lantern Walk. The corn knows where.'],
 pin:'#d6a43a'
};

// ================= CASE DATA =================
// Enemy cards (Combat: Enemies and difficulty, Combat numbers): HP, DEX, attack %, damage dice, special moves, what it
// resists, its weakness (Identify shows it), threat skulls, horror on sight, and tags (beast, living, human, unnatural,
// burns, lightshy) the moves and items read. Fight sizes: roamers 10–18 enemy HP in all, story fights 20–35.
const EN={
 crow:{name:'Crowling',tier:'weak',hp:6,dex:14,hit:40,dmg:'1d3',skulls:1,tags:['beast','living','unnatural','lightshy'],resist:[],weak:'light',weakLine:'Light-shy. A road flare will send it reeling.',
  moves:[['hit',1]],verb:'pecks at',die:'bursts into black feathers',face:[4,4,22],horror:{tier:'unsettling',kind:'unnatural',subj:'birds'}},
 husk:{name:'Husk Scout',tier:'ordinary',hp:13,dex:9,hit:45,dmg:'1d3+1',skulls:1,tags:['unnatural','burns'],resist:['shaken'],weak:'fire',weakLine:'Dry straw. Fire takes it fast. Nothing in there to scare.',
  moves:[['hit',3],['san',1]],verb:'grabs at',sanText:'The Husk Scout recites the Scout Oath. Every word is a name you know.',sanHit:['0','1d2'],die:'comes apart into straw and merit badges',face:[10,0,24],horror:{tier:'disturbing',kind:'unnatural',subj:'scarecrows'}},
 hound:{name:'Bale Hound',tier:'ordinary',hp:15,dex:12,hit:50,dmg:'1d3+1',skulls:2,tags:['beast','unnatural','burns'],resist:['poison'],weak:'fire',weakLine:'A hay bale that thinks it\'s a dog. It burns. Poison does nothing.',
  moves:[['hit',2],['bleed',1]],verb:'bites',die:'collapses into loose hay',face:[48,0,24],horror:{tier:'disturbing',kind:'unnatural',subj:'dogs'}},
 long:{name:'Long Man',tier:'tough',hp:22,dex:7,hit:55,dmg:'1d4+1',skulls:2,tags:['unnatural'],resist:['bleed'],weak:null,weakLine:'No blood in him to spill. Slow. Hit him before he moves.',
  moves:[['hit',2],['san',1]],verb:'reaches down for',sanText:'The Long Man bends down and looks at you. Just looks.',sanHit:['0','1d4'],die:'topples like a felled tree',face:[8,0,24],horror:{tier:'disturbing',kind:'unnatural'}},
 vol:{name:'Volunteer',tier:'tough',hp:24,dex:10,hit:50,dmg:'1d4+1',skulls:2,tags:['unnatural','burns'],resist:[],weak:'fire',weakLine:'A coat stuffed with straw. Keep it away from candles.',
  moves:[['hit',3],['san',1]],verb:'swings a clipboard at',sanText:'The Volunteer reads your name off the clipboard. Then your mother\'s.',sanHit:['0','1d2'],die:'folds over like an empty coat',face:[11,0,24],horror:{tier:'disturbing',kind:'unnatural',subj:'scarecrows'}},
 // only if overstepping reaches Federal agents: a very hard human story fight (killing a person costs SAN as usual)
 fed:{name:'Clean-up agent',tier:'ordinary',hp:11,dex:12,hit:55,dmg:'1d4+1',skulls:3,tags:['human','living'],resist:[],weak:'human',weakLine:'Human. A flashbang or a badge will stop him for a second.',
  moves:[['hit',1]],verb:'fires at',die:'goes down and stays down',face:[10,2,20]},
 // the boss (tuned Nov 23 with tools/boss-sim.js): 65 HP, −8 per rescued victim (41 with all three); its moves and second
 // phase are set per run in bossIntro()
 gleaner:{name:'The Gleaner',tier:'boss',boss:true,hp:65,cut:8,dex:11,hit:60,dmg:'1d4+2',allDmg:'1d3',skulls:3,tags:['unnatural','burns'],resist:['stun2','poison','bleed'],weak:'fire',
  weakLine:'Every harvest this town gave it. Dry as kindling. It can\'t be stunned two turns running.',glow:true,face:[34,2,32],
  records:()=>G.clues.some(c=>c.id==='lore'),
  moves:[['hit',5],['all',2],['san',1]],verb:'reaps',allText:'The Gleaner sweeps its sickles through the corn!',sanText:TEXT.bossNames,sanHit:['1','1d4'],die:'goes out',
  phase2:{at:.5,hit:5,moves:{all:1},line:TEXT.bossPhase},
  horror:{tier:'boss',kind:'unnatural',subj:'the Gleaner',known:true}}
};
// the map's horrors: tier, kind, phobia subject; once per case each (SAN loss table)
const HORRORS={
 bell:{id:'bell',tier:'disturbing',kind:'unnatural',subj:'scarecrows',label:'Watching the scarecrows move'},
 sutter:{id:'sutter',tier:'disturbing',kind:'helplessness',label:TEXT.sutterH},
 page:{id:'page',tier:'severe',kind:'unnatural',label:TEXT.pageH},
 fourth:{id:'fourth',tier:'severe',kind:'unnatural',subj:'scarecrows',all:true,label:TEXT.fourthH},
 cameo:{id:'cameo:tall',tier:'unsettling',kind:'unnatural',label:TEXT.cameoH}
};
// this case's own items (case-only: the pin icon; Big Hat sorts them at the debrief)
const CASE_ITEMS={
 coffee:{name:'Thermos coffee',type:'Drink',desc:'Restore 1d4+1 WP.',pin:1,kind:'ordinary',
  mapUse:async()=>{const t=await pickMember('WHO DRINKS?',()=>true);if(!t)return false;const g=roll(1,4,1);t.wp=Math.min(t.mwp,t.wp+g);await say('',`${t.name} drinks gas-station coffee. +${g} WP.`);return true},
  battleUse:async(m)=>{const t=await pickAlly({title:'WHO DRINKS?',noKO:true});if(!t)return false;const g=roll(1,4,1);t.wp=Math.min(t.mwp,t.wp+g);await say('',`${t.name} drinks gas-station coffee. +${g} WP.`,{auto:1000});return true}},
 bell:{name:'Church handbell',type:'Tool',desc:'Battle: every foe flinches and freezes for a round.',pin:1,kind:'unnatural',
  battleUse:async(m)=>{aliveFoes().forEach(e=>e.stun+=1);await say('',`${m.name} rings the church handbell. BONNNG. Every foe flinches and freezes.`,{auto:1300});return true}},
 binder:{name:'Committee binder',type:'Evidence',kind:'ordinary',desc:'Three names a year since 1958, each signed by the Committee. A fourth line, empty.',pin:1,passive:1},
 clip:{name:'Volunteer\'s clipboard',type:'Evidence',kind:'unnatural',desc:'Three names crossed out in orange crayon. The fourth line is blank.',pin:1,passive:1},
 page:{name:'1958 program page',type:'Evidence',kind:'unnatural',desc:'Torn from a Lantern Walk program. A small "1" is inked in the top corner, in a hand older than the program.',pin:1,passive:1}
};
// a roamer's drop: 20% from this loot table (Where items come from, Loot)
const LOOT=['bandage','painkillers','energy','roadflare','salt','salts'];
const townClues=()=>G.clues.filter(c=>['scare','walk','count','drive','bell'].includes(c.id)).length;
const has=id=>G.clues.some(c=>c.id===id);
// the briefing's edges (spec 013): the scarecrow photo, +10% on every Search in town (Keegan's pick, Nov 22: the town's
// scarecrows have no Search of their own); the local law, +10% on Persuade with Ross. +10 is a first guess (spec 013).
const townEye=()=>intelOn('photo')?10:0,rossEdge=()=>intelOn('law')?10:0;
const caseNext=()=>{const N=TEXT.next,F=G.flags;
 if(!F.key&&!F.rossNo)return townClues()>=3?N.ross:(intelOn('town')&&!F.dotM?N.dot:N.proof).replace('{n}',townClues());  // the town intel puts Dot first (spec 013)
 if(!F.volDone)return N.gate;if(!F.gateOpen)return N.maze;if(!F.boss)return N.find.replace('{n}',G.rescued||0);return N.home};
// overstepping: which step the case is on (open case: Clean, Local chief, Agency call, Federal agents)
const stepName=()=>stepsOf()[loadSeason().overstep|0]||'Clean';
const stepAt=n=>stepsOf().indexOf(n)<=(loadSeason().overstep|0)&&stepsOf().indexOf(n)>=0;

// ================= OPENING (Big Hat's briefing) =================
// Each cut is a cutscene B skips once seen (engine.js, Skip replays); the questions and requisition always play.
async function caseOpening(){
 if(G.rewrote){G.rewrote=0;await said(TEXT.rewritten)}
 await cut('open',async()=>{await said(TEXT.open1);await said(TEXT.open2)});
 await bigHatScene(async()=>{
  await cut('brief',async()=>{await play(TEXT.brief);await shout(TEXT.briefShout);await play(TEXT.brief2)});
  await twoQuestions(TEXT.intel);  // two of four topics, each an INTEL note and an edge (spec 013, engine.js)
  await cut('brief3',()=>play(TEXT.brief3));
  await requisition();  // each agent may roll Bureaucracy once for one catalog item (field.js)
  await cut('brief4',()=>play(TEXT.brief4));
 });
 G.mode='world';goMap('town',14,16,'up');checkpoint();await fade(0);
 await cut('arrive',async()=>{
  for(const m of squad())await say(m.name.toUpperCase()+' · '+profOf(m.a).name.toUpperCase(),TEXT.role[profOf(m.a).role]||TEXT.roleAny);
  await said(TEXT.arrive)});
}

// ================= MAPS =================
// Each map says its light: 'day', 'dusk' or 'night' (spec 005). The town stays at dusk and the maze is night. The layout
// is Demo 4's; part C adds hotspots only (the podium, the hay bale, the fence, the cruiser's trunk). Art is SHA.
function buildTown(){
 const W=30,H=20,g=mk(W,H,'.');
 rect(g,0,0,W,1,'T');rect(g,0,H-1,W,1,'T');rect(g,0,0,1,H,'T');rect(g,W-1,0,1,H,'T');
 rect(g,9,1,10,1,'T');
 rect(g,1,4,28,1,',');rect(g,1,9,28,2,',');rect(g,14,4,2,15,',');rect(g,5,4,1,5,',');rect(g,23,4,1,5,',');
 rect(g,10,6,10,6,',');
 rect(g,2,1,7,2,'B');rect(g,2,3,7,1,'#');g[3][5]='D';
 rect(g,19,1,8,2,'B');rect(g,19,3,8,1,'#');g[3][23]='D';
 g[7][14]='p';g[7][15]='p';g[7][11]='S';g[7][18]='S';
 [[9,5],[20,5],[9,12],[20,12]].forEach(([x,y])=>g[y][x]='L');
 [[3,6],[26,6],[4,12],[25,15],[11,15],[18,15],[1,2]].forEach(([x,y])=>g[y][x]='P');
 [[3,11],[26,12],[2,7],[27,2]].forEach(([x,y])=>g[y][x]='H');
 rect(g,2,17,10,1,'F');rect(g,18,17,10,1,'F');
 g[15][3]='K';g[15][4]='k';g[13][8]='Y';g[13][9]='y';g[11][12]='N';g[17][12]='W';
 g[9][29]=G.flags.gateOpen?',':'G';g[10][29]=G.flags.gateOpen?',':'G';
 g[19][14]=',';g[19][15]=',';
 [[1,14],[1,15],[1,16],[28,14],[28,15],[28,16],[27,16],[2,16],[1,18],[28,18]].forEach(([x,y])=>g[y][x]='T');
 const O={},F=G.flags;
 // out: nothing new to say, so the bubble shows "…" (spec 006 A5); Deputy Ross uses the engine's rule (no new clue since)
 const npcs=[
  {id:'dot',x:6,y:5,dir:'down',talk:talkDot,out:()=>!!(F.dotM&&F.dotW)},
  {id:'pell',x:14,y:6,dir:'down',talk:talkMayor,on:()=>!F.pellHeld,out:()=>has('walk')&&(has('list')||F.binderTried)},
  {id:'pip',x:21,y:13,dir:'left',talk:talkPip,out:()=>!!F.pipGift&&(!F.sutter||F.pipAfter)},
  {id:'ross',x:6,y:14,dir:'down',talk:talkRoss},
  {id:'vol',x:28,y:9,dir:'left',talk:talkVol,on:()=>(F.key||F.rossNo)&&!F.volDone}
 ];
 // Hotspots (spec 006 A2): A opens the lead's options with their odds, Look first. once: an option that goes once done.
 O['5,3']={id:'diner',look:TEXT.dinerLook,opts:[{use:'sweep',mod:townEye,once:'dinerSalt',ok:async()=>{await said(TEXT.dinerSweep);await pickup('salt')},fail:()=>said(TEXT.dinerNone)}]};
 O['23,3']={id:'church',name:TEXT.church,look:()=>play(F.bell||F.carving?[TEXT.churchAfter]:TEXT.churchLook),opts:()=>churchOpts(),used:()=>!!((F.bell||F.carving)&&F.churchRest)};
 O['14,7']=O['15,7']={id:'podium',name:TEXT.podium,look:()=>play(F.binder?TEXT.podGone:TEXT.podLook),opts:()=>podiumOpts(),used:()=>has('walk')&&(F.binder||F.binderTried)};
 O['11,7']={id:'pellScare',look:'The Pell family scarecrow. A cheerful straw man in a sweater vest. Its stitched smile is wider than when you first looked.'};
 O['18,7']={id:'ruizScare',look:'The Ruiz family scarecrow. It\'s facing you. You\'re almost sure it was facing the podium a second ago.'};
 O['12,11']={id:'board',name:'NOTICE BOARD',look:()=>play(TEXT.board),opts:()=>has('drive')?[]:[
  {use:'sweep',mod:townEye,ok:()=>findDrive(TEXT.boardSweep)},{use:'paper',ok:()=>findDrive(TEXT.boardPaper)},{use:'examine',ok:()=>findDrive(TEXT.boardExam)}],used:()=>has('drive')};
 O['8,13']=O['9,13']={id:'cider',name:'CIDER',look:()=>F.cider?said(TEXT.ciderGone):play(TEXT.cider),opts:()=>ciderOpts(),used:()=>!!F.cider&&has('cider')};
 O['12,17']={id:'sign',look:()=>play(TEXT.sign)};
 O['29,9']=O['29,10']={id:'gate',name:TEXT.gate,look:()=>said(F.gateOpen?TEXT.gateOpen:TEXT.gateShut),opts:()=>gateOpts(),used:()=>false};
 O['3,15']=O['4,15']={id:'cruiser',name:'CRUISER',look:()=>play(TEXT.cruiser),opts:()=>cruiserOpts(),used:()=>!!(F.flares&&F.cruiserRest)};
 O['3,11']={id:'hay',look:TEXT.hayLook,opts:[{use:'sweep',mod:townEye,once:'hayCrackers',ok:async()=>{await said(TEXT.haySweep);await pickup('firecrackers')},fail:()=>said('Just hay. Warm hay.')}]};
 // Mr. Sutter, Pip's dad, behind the south fence (motivation moment: Family; Motivations)
 O['22,17']={id:'sutter',name:'BACKYARD',look:()=>said(F.sutter?TEXT.sutterAfter:TEXT.sutter),
  opts:()=>F.sutter?[]:[{label:TEXT.sutterOpt,show:()=>holdersOf('Family').length>0,run:sutterHome}],used:()=>!!F.sutter};
 const warps={'14,19':bounceHome,'15,19':bounceHome};
 return{name:'MARROW CREEK',w:W,h:H,g,O,npcs,warps,light:'dusk',art:SHA,bg:'town'};
}
async function bounceHome(){await said(TEXT.home);G.dir='up';await stepBack()}

// ---- the corn maze: Demo 4's seeded layout ----
let MAZE=null;
// the one way into the Gleaner's clearing, and the tile just outside it, where Not yet steps the lead back to
const DOOR=[13,14],DOOR_OUT=[13,15];
function genMaze(){
 const cw=13,chh=11,W=cw*2+1,H=chh*2+1,g=mk(W,H,'C'),r=mulberry(4127),seen=mk(cw,chh,false);
 const st=[[0,5]];seen[5][0]=true;g[11][1]='M';
 while(st.length){const [cx_,cy]=st[st.length-1];const nb=[[1,0],[-1,0],[0,1],[0,-1]].map(([dx,dy])=>[cx_+dx,cy+dy,dx,dy]).filter(([x,y])=>x>=0&&y>=0&&x<cw&&y<chh&&!seen[y][x]);
  if(!nb.length){st.pop();continue}const [nx,ny,dx,dy]=nb[Math.floor(r()*nb.length)];seen[ny][nx]=true;g[cy*2+1+dy][cx_*2+1+dx]='M';g[ny*2+1][nx*2+1]='M';st.push([nx,ny])}
 rect(g,10,8,7,7,'M');g[11][0]='M';
 // extra loops so it's less linear
 for(let i=0;i<10;i++){const x=2+Math.floor(r()*(W-4)),y=2+Math.floor(r()*(H-4));if(g[y][x]==='C'&&((g[y][x-1]==='M'&&g[y][x+1]==='M')||(g[y-1][x]==='M'&&g[y+1][x]==='M')))g[y][x]='M'}
 const inClear=(x,y)=>x>=10&&x<=16&&y>=8&&y<=14;
 const dist=mk(W,H,-1),q=[[1,11]];dist[11][1]=0;
 while(q.length){const [x,y]=q.shift();[[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{const nx=x+dx,ny=y+dy;if(g[ny]&&g[ny][nx]==='M'&&dist[ny][nx]<0){dist[ny][nx]=dist[y][x]+1;q.push([nx,ny])}})}
 const dead=[];for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(g[y][x]!=='M'||inClear(x,y)||(x<=2&&y===11))continue;const n=[[1,0],[-1,0],[0,1],[0,-1]].filter(([dx,dy])=>g[y+dy][x+dx]==='M').length;if(n===1)dead.push([x,y,dist[y][x]])}
 dead.sort((a,b)=>b[2]-a[2]);
 const vict=[];for(const d of dead){if(vict.length>=3)break;if(vict.every(v=>Math.abs(v[0]-d[0])+Math.abs(v[1]-d[1])>=9))vict.push(d)}
 const rest=dead.filter(d=>!vict.includes(d));const items=rest.slice(0,5);
 // a roamer's beat: from the tile in front of what it guards, back toward the gate along the shortest way, 5 tiles
 const beatFrom=([x,y])=>{const out=[];let cx_=x,cy=y;for(let k=0;k<6;k++){const nb=[[1,0],[-1,0],[0,1],[0,-1]].map(([dx,dy])=>[cx_+dx,cy+dy]).find(([nx,ny])=>dist[ny]&&dist[ny][nx]===dist[cy][cx_]-1);if(!nb)break;[cx_,cy]=nb;if(inClear(cx_,cy))break;out.push([cx_,cy])}return out};
 // The boss waits for you (spec 006, Revision after the demo playtest): the clearing is a dead end you walk into on
 // purpose. Its edge turns to corn, all but one gap on the south side (DOOR), and three hedges open so the rows the
 // clearing used to join still meet without it. The victims, the loot and the roamers' beats stay where they were.
 for(let y=8;y<=14;y++)for(let x=10;x<=16;x++)if(x===10||x===16||y===8||y===14)g[y][x]='C';
 g[DOOR[1]][DOOR[0]]='M';[[2,9],[20,7],[8,10]].forEach(([x,y])=>g[y][x]='M');
 return{W,H,g,vict,items,dist,beatFrom};
}
// the three missing, at the three deepest dead ends: victim 0 is the farthest, guarded by the Long Man (a story fight);
// victim 1 by the Crowlings (a roamer pair)
const VICTIMS=[
 {id:'walt',name:'Walter Abbot',see:'A scarecrow with thick glasses, seated politely in a lawn chair someone placed here.',cue:'His hand twitches. He is trying to wave.',free:'You lift the burlap away. Walter Abbot blinks up at you through cracked lenses.',line:'"Seventy-seven Walks. I always said I\'d never go in after dark. Then it asked so nicely."'},
 {id:'carol',name:'Carol Henderson',see:'A scarecrow in a cardigan. A wedding ring glints on one straw finger.',cue:'It\'s breathing.',free:'You cut the twine. Straw pours away and Carol Henderson drops into your arms, gasping.',line:'"It knows our names. It said it only needed one more."'},
 {id:'dev',name:'Dev Okoro',see:'A scarecrow in a varsity jacket, earbuds still in.',cue:'The earbuds are playing something. It\'s your own voice, saying your name.',free:'You pull the earbuds out and cut the ropes. Dev Okoro stumbles forward and throws up in the corn.',line:'"How long was I up there? It felt like a week. It felt like I was the field."'}
];
function buildMaze(){
 if(!MAZE)MAZE=genMaze();
 const {W,H,vict,items}=MAZE,g=MAZE.g.map(r=>r.slice()),O={},vv={},F=G.flags;
 [[10,8],[16,8],[10,14],[16,14]].forEach(([x,y])=>g[y][x]='l');
 vict.forEach(([x,y],i)=>{const V=VICTIMS[i];if(F['saved_'+V.id]){g[y][x]='M';return}g[y][x]='V';vv[x+','+y]=i;
  O[x+','+y]={id:'victim'+i,name:V.name.toUpperCase(),look:()=>victimLook(i),opts:[{label:TEXT.cut,run:()=>cutDown(i)},{item:'camera',label:'Photograph it',show:()=>!F.photo,run:async()=>{F.photo=1;await said('The flash goes off. In the photo, the scarecrow has its eyes open.')}}]}});
 // items[0]: the Lantern Box (the Bale Hound guards it); items[1]: the 1958 page (the Husk Scout); items[2]: a dropped backpack
 const [bx,by]=items[0],[px,py]=items[1],[kx,ky]=items[2];
 g[by][bx]='I';O[bx+','+by]={id:'box',name:TEXT.box,look:TEXT.boxLook,opts:()=>G.fs.used['box:maze']?[]:[{label:TEXT.boxOpen,run:openBox}],used:()=>!!G.fs.used['box:maze']};
 if(!F.page){g[py][px]='O';O[px+','+py]={id:'page',name:TEXT.page,look:TEXT.pageLook,opts:()=>pageOpts()}}
 if(!F.pack){g[ky][kx]='I';O[kx+','+ky]=async()=>{F.pack=1;G.M=buildMaze();await said(TEXT.pack);await pickup('energy');checkpoint()}}
 // drag marks by the gate (Survival): a corn tile beside the way in
 const tk=[[1,10],[1,12],[2,10],[2,12]].find(([x,y])=>g[y][x]==='C')||[1,10];
 O[tk[0]+','+tk[1]]={id:'track',name:TEXT.track.toUpperCase(),look:TEXT.trackLook,opts:[{use:'track',once:'track',ok:trackOk,fail:()=>said(TEXT.trackFail)},{use:'path',once:'path',ok:pathOk,fail:()=>said(TEXT.pathFail)}]};
 if(!F.boss){g[11][13]='X';g[10][13]='X'}
 const roamers=[
  {id:'hound',types:['hound'],name:'Bale Hound',skulls:2,tags:EN.hound.tags,path:MAZE.beatFrom(items[0]),look:'A hay bale on four legs, nosing the dirt in front of a pink gift bag.',guard:openBox},
  {id:'crows',types:['crow','crow'],sprite:'crow',name:'Crowlings',skulls:1,tags:EN.crow.tags,path:MAZE.beatFrom(vict[1]),look:'Two crows hop back and forth in front of a scarecrow in a cardigan. One of them has a human eye.'},
  {id:'husk',types:['husk'],name:'Husk Scout',skulls:1,tags:EN.husk.tags,path:MAZE.beatFrom(items[1]),look:'A scarecrow in a Scout uniform walks the row, saluting nothing. Something is pinned behind it.',guard:takePage}
 ].filter(r=>r.path.length);
 const warps={'0,11':leaveMaze};
 return{name:'THE CORN MAZE',w:W,h:H,g,O,vv,npcs:[],roamers,warps,light:'night',art:SHA,bg:'maze',boss:!F.boss,onStep:mazeStep,danger:true};
}
const MAPS={town:buildTown,maze:buildMaze};

// ================= TOWN SCRIPTS =================
async function talkDot(){
 const F=G.flags;if(!F.dot1){F.dot1=1;if(!intelOn('town'))await play(TEXT.dot1)}  // the town intel skips her warm-up (spec 013)
 const r=await ask('DOT',TEXT.dotQ,TEXT.dotOpts);
 if(r===0){F.dotM=1;await play(TEXT.dotM);clue('scare',TEXT.cScare)}
 if(r===1){F.dotW=1;await play(TEXT.dotW)}
}
// the mayor: he talks freely about the Walk; the clue hides under it (Empathy, Persuade, or Pip's words on the recorder).
// He's hiding something, so talking to him is a liar trigger (Paranoia). At Local chief he stops talking.
async function talkMayor(){
 const F=G.flags;await trigger('liar');
 if(stepAt('Local chief')&&!F.key){await said(TEXT.pellChief);return}
 if(!F.may1){F.may1=1;await play(TEXT.pell1)}
 const h={name:'MAYOR PELL',look:async()=>{await play(TEXT.pellLook);await play(TEXT.pellMiss)},opts:[
  {use:'read',official:1,show:()=>!has('walk'),ok:async()=>{await play(TEXT.pellRead);clue('walk',TEXT.cWalk)}},
  {use:'talk',official:1,show:()=>!has('walk'),ok:async()=>{await play(TEXT.pellTalk);clue('walk',TEXT.cWalk)}},
  {item:'recorder',label:'Play him Pip\'s words',show:()=>!has('walk')&&has('count'),run:async()=>{await play(TEXT.pellTape);clue('walk',TEXT.cWalk)}},
  {use:'lean',official:1,show:()=>!F.binder,ok:async()=>{await play(TEXT.pellLean);await getBinder()}}
 ]};
 await hotspot(h,'pell');
}
function podiumOpts(){const F=G.flags;return[
 {use:'records',show:()=>!has('walk'),ok:async()=>{await play(TEXT.podRecords);clue('walk',TEXT.cWalk)}},
 {use:'sneak',label:TEXT.binder,show:()=>!F.binder&&!F.pellHeld&&!F.binderTried,ok:async()=>{await said(TEXT.podLift);await getBinder()},
  fail:async()=>{F.binderTried=1;await play(TEXT.podCaught);await overstepHere('seen')}},
 {use:'sneak',label:TEXT.binder,show:()=>!F.binder&&F.pellHeld,ok:async()=>{await said(TEXT.podLift);await getBinder()},fail:()=>said('You fumble the binder back onto the shelf. Nobody saw. Try again.')},
 {use:'force',label:TEXT.lockbox,show:()=>!F.binder,ok:async()=>{await said(TEXT.podForce);await getBinder();await overstepHere('seen')},fail:()=>said('The cash box holds. It\'s a better box than it looks.')},
 {item:'bolt',label:'Cut the cash box open',show:()=>!F.binder,run:async()=>{await said(TEXT.podForce.replace(' Heads turn across the square.',''));await getBinder()}}
]}
async function getBinder(){G.flags.binder=1;await pickup('binder');await play(TEXT.binderRead);clue('list',TEXT.cList);checkpoint()}
async function talkPip(){
 const F=G.flags;
 if(F.sutter&&!F.pipAfter){F.pipAfter=1;await play(TEXT.pipAfter);return}
 await play(TEXT.pip);clue('count',TEXT.cCount);
 if(!F.pipGift){F.pipGift=1;await said(TEXT.pipGift);await pickup('coffee')}
}
async function findDrive(lines){await play(lines);clue('drive',TEXT.cDrive);checkpoint()}
function ciderOpts(){const F=G.flags;return[
 {use:'sample',show:()=>!has('cider'),ok:async()=>{await play(TEXT.ciderSample);clue('cider',TEXT.cCider);G.fs.samples=G.fs.samples||[];G.fs.samples.push('cider')}},
 {use:'examine',show:()=>!has('cider'),ok:async()=>{await play(TEXT.ciderExam);clue('cider',TEXT.cCider)}},
 {label:TEXT.ciderDrink,show:()=>!F.cider,run:drinkCider}
]}
// the cider heals everyone, and it makes them belong: the Gleaner's names hit harder later
async function drinkCider(){G.flags.cider=1;live().forEach(m=>{m.hp=m.mhp;m.wp=m.mwp});await play(TEXT.ciderDrank);checkpoint()}
function churchOpts(){const F=G.flags,done=F.bell||F.carving;return[
 {label:TEXT.ring,show:()=>!done,run:ringBell},
 {use:'identify',label:TEXT.identify,show:()=>!done,ok:readCarving},
 {label:TEXT.churchRest,show:()=>done&&!F.churchRest,run:async()=>{F.churchRest=1;await play(TEXT.churchRested);await rest(1);checkpoint()}}
]}
// ringing it: Loud, public (overstepping −40), a horror for the lead; reading the carving: the same clue, quietly
async function ringBell(){
 G.flags.bell=1;await play(TEXT.bell);noise();await horror(HORRORS.bell);
 await said(TEXT.bellAfter);await pickup('bell');clue('bell',TEXT.cBell);checkpoint();
 await overstepHere('public');
}
async function readCarving(){G.flags.carving=1;await play(TEXT.carving);await said(TEXT.carvingAfter);await pickup('bell');clue('bell',TEXT.cBell);checkpoint()}
// motivation moment (Family): bringing Mr. Sutter in costs the lead a horror; each Family agent gets 1d4 SAN back
async function sutterHome(){G.flags.sutter=1;await play(TEXT.sutterDo);await horror(HORRORS.sutter);for(const m of holdersOf('Family'))await motivate(m);checkpoint()}
function cruiserOpts(){const F=G.flags;return[
 {use:'sweep',mod:townEye,show:()=>!F.flares,ok:async()=>{F.flares=1;await said(TEXT.cruiserSweep);await pickup('roadflare')},fail:()=>said('Fast-food bags. A sock. Ross clears his throat.')},
 {label:TEXT.cruiserRest,show:()=>F.volDone&&!F.cruiserRest,run:async()=>{F.cruiserRest=1;await play(TEXT.cruiserRested);await rest(1);checkpoint()}}
]}
// Deputy Ross: 3 town clues get the key, and the deduction (who picks?). At Local chief he needs talking round.
async function talkRoss(){
 const F=G.flags;
 if(F.key){await said(TEXT.rossKey);return}
 if(F.rossNo){await said(TEXT.rossNo);return}
 const n=townClues();
 if(n<3){await play(TEXT.ross0,{n});return}
 if(stepAt('Local chief')&&!F.rossOk){
  await said(TEXT.rossChief);let ok=false;
  await hotspot({name:'DEPUTY ROSS',opts:[
   {use:'talk',official:1,mod:rossEdge,ok:async()=>{ok=true;await play(TEXT.rossTalkOk)},fail:()=>said(TEXT.rossTalkNo)},
   {use:'creds',official:1,ok:async()=>{ok=true;await play(TEXT.rossCredOk);await stepBack1()},fail:()=>said(TEXT.rossTalkNo)},
   {item:'cash',label:'Slip him the cash',run:async()=>{ok=true;await said('Ross looks at the roll of twenties for a long time. Then he puts it in his hat.')}}]},'ross');
  if(!ok){F.rossNo=1;await said(TEXT.rossNo);checkpoint();return}
  F.rossOk=1;
 }
 await play(TEXT.ross3);
 await deduce();
 await said(TEXT.rossGive);F.key=1;banner('GOT: MAZE GATE KEY');checkpoint();
}
// The deduction (Gameplay loop, Deduction): who picks the victims? Right needs the drive or the binder (clue IDs).
// Reconstruct (Forensics 75) ties scare + drive together first; INT Hunch offers a hint. A wrong answer costs a better
// ending and leaves the fourth likeness to be finished; it never blocks the way on.
async function deduce(){
 const F=G.flags,L=lead();
 if(skillVal(L.a,'Forensics')>=75&&has('scare')&&has('drive')&&!G.fs.used.recon){G.fs.used.recon=1;
  const p=chanceOf(L,'Forensics'),o=SR.pct(p);await say('',resultLine('RECONSTRUCT · FORENSICS',o),{auto:1100});if(o.ok)await said(TEXT.reconOk);else tried(L,'Forensics')}
 else await hunch(TEXT.hunch);
 let r=await ask('DEPUTY ROSS',TEXT.rossAsk,TEXT.rossOpts);
 // Loose thread (an arc perk, spec 008): once per case, a wrong answer costs nothing and you can answer again
 const lt=!(r===1&&(has('drive')||has('list')))&&live().find(m=>perkOn(m,'truth'));
 if(lt){await say('',fillT(BLS.HOMEW.perkUsed,{p:BLS.HOMEW.perks.truth[0],n:lt.name}));r=await ask('DEPUTY ROSS',TEXT.rossAsk,TEXT.rossOpts)}
 if(r===1&&(has('drive')||has('list'))){F.deduce='right';F.pellHeld=1;await play(TEXT.rossRight)}
 else if(r===1){F.deduce='noproof';await play(TEXT.rossNoProof)}
 else{F.deduce='wrong';await play(TEXT.rossWrong)}
}
async function stepBack1(){const s=loadSeason();if((s.overstep|0)>0){s.overstep--;store.set(seasonKey(),s)}}
async function talkVol(){
 await play(TEXT.vol);
 const r=await battle(['vol','crow'],{story:true,intro:TEXT.volIntro});
 if(r==='lose')return gameOver();
 G.flags.volDone=1;await play(TEXT.volDone);await pickup('clip');clue('clip',TEXT.cClip);checkpoint();
}
function gateOpts(){const F=G.flags;if(F.gateOpen||!F.volDone)return[];
 if(F.key)return[{label:TEXT.gateIn,run:async()=>{await said(TEXT.gateKey);await enterMaze()}}];
 return[{use:'force',ok:async()=>{await said(TEXT.gateForce);await enterMaze()},fail:()=>said(TEXT.gateNoForce)},
  {use:'shoot',ok:async()=>{await said(TEXT.gateForce);await enterMaze()},fail:()=>said(TEXT.gateNoForce)},
  {item:'bolt',label:'Cut the chain',run:async()=>{await said(TEXT.gateCut);await enterMaze()}}]}
async function enterMaze(){
 G.flags.gateOpen=1;await fade(1);goMap('maze',1,11,'right');checkpoint();await fade(0);await cut('enter',()=>play(TEXT.enter));
 // the corn maze intel (spec 013): the roamers' beats show on the first way in, as On guard's do, with no roll
 if(intelOn('maze')&&!G.fs.used.mazeIntel){G.fs.used.mazeIntel=1;G.fs.used.onguard=1;setTrail(G.M.roamers.flatMap(r=>r.path),'beat');await said(TEXT.onguardOk)}
 // Search's On guard (75): entering a danger zone, roll to spot the roamers' beats
 const L=lead();if(skillVal(L.a,'Search')>=75&&!G.fs.used.onguard){G.fs.used.onguard=1;const o=SR.pct(chanceOf(L,'Search'));
  await say('',resultLine('ON GUARD · SEARCH',o),{auto:1000});
  if(o.ok){setTrail(G.M.roamers.flatMap(r=>r.path),'beat');await said(TEXT.onguardOk)}else{tried(L,'Search');await said(TEXT.onguardFail)}}
}

// ================= MAZE SCRIPTS =================
// The way into the clearing asks first: go in starts the boss fight (committed), not yet steps the lead back one tile.
// Anywhere else inside it (only an old save stands there) the fight starts as before.
async function mazeStep(){
 if(G.flags.boss)return;
 if(G.x===DOOR[0]&&G.y===DOOR[1]){held=[];const r=await ask('',TEXT.clearQ,TEXT.clearOpts);if(r===0)return bossIntro();
  StudioMove.place(G,DOOR_OUT[0],DOOR_OUT[1],'down');return}
 const inClear=G.x>=10&&G.x<=16&&G.y>=8&&G.y<=14;
 if(inClear){held=[];return bossIntro()}
}
async function leaveMaze(){const r=await ask('',TEXT.leaveQ,TEXT.leaveOpts);if(r===0){await fade(1);goMap('town',28,10,'left');await fade(0)}else{G.dir='right';await stepBack()}}
const ok_=()=>(x,y)=>{const M=G.M;return x>=0&&y>=0&&x<M.w&&y<M.h&&!BLOCK.has(M.g[y][x])};
// Track (Survival 40): drag marks to the nearest victim still on a pole. Pathfinder (75): a safe route to the center.
async function trackOk(){await said(TEXT.trackOk);const left=MAZE.vict.filter((v,i)=>!G.flags['saved_'+VICTIMS[i].id]);
 const routes=left.map(([x,y])=>StudioPatrol.route(G.x,G.y,x,y,ok_())).filter(r=>r.length).sort((a,b)=>a.length-b.length);if(routes[0])setTrail(routes[0],'trail')}
async function pathOk(){await said(TEXT.pathOk);const beats=new Set(G.M.roamers.flatMap(r=>r.path.map(p=>p.join(','))));const ok=ok_();
 let r=StudioPatrol.route(G.x,G.y,13,12,(x,y)=>ok(x,y)&&!beats.has(x+','+y));if(!r.length)r=StudioPatrol.route(G.x,G.y,13,12,ok);setTrail(r,'path')}
async function openBox(){await lanternBox('maze',['molotov','roadflare','firstaid'],TEXT.boxLine);G.M=buildMaze()}
function pageOpts(){return[
 {label:'Take it',run:takePage},
 {use:'translate',show:()=>!G.flags.pageTr,ok:async()=>{G.flags.pageTr=1;await takePage();await play(TEXT.pageTrOk)},fail:async()=>{await said(TEXT.pageTrFail);await takePage()}},
 // motivation moment (Find the truth): reading it all aloud is Loud and a Severe horror for the lead
 {label:TEXT.pageAloud,show:()=>holdersOf('Find the truth').length>0,run:async()=>{G.flags.pageAloud=1;await takePage();await play(TEXT.pageAloudDo);noise();await horror(HORRORS.page);for(const m of holdersOf('Find the truth'))await motivate(m)}}]}
async function takePage(){const F=G.flags;if(F.page)return;F.page=1;await play(TEXT.pageRead);await pickup('page');clue('lore',TEXT.cLore);G.M=buildMaze();checkpoint()}
// a victim: Look plays their lines and the horror (the first is Disturbing; after that the party knows, can brace,
// and it's Unsettling). The farthest one is guarded by the Long Man, a story fight, the first time you get close.
async function victimLook(i){
 const V=VICTIMS[i],F=G.flags;
 if(i===0&&!F.longDone){await cut('long',()=>said(TEXT.longIntro));const r=await battle(['long','husk'],{story:true,intro:TEXT.longStory});if(r==='lose')return gameOver();F.longDone=1;await said(TEXT.longDone);checkpoint()}
 await said(V.see);await said(V.cue);
 if(!F['seen_'+V.id]){const known=VICTIMS.some(v=>v!==V&&F['seen_'+v.id]);F['seen_'+V.id]=1;
  await horror({id:'victim:'+V.id,tier:known?'unsettling':'disturbing',kind:'helplessness',known,label:`Recognizing ${V.name}`})}
 await said(TEXT.victimLook);
}
async function cutDown(i){
 const V=VICTIMS[i],F=G.flags;if(!F['seen_'+V.id])await victimLook(i);if(!party.length)return;
 F['saved_'+V.id]=1;G.rescued=(G.rescued||0)+1;await said(V.free);await say(V.name.toUpperCase(),V.line);await said(TEXT.limp,{n:V.name.split(' ')[0]});G.M=buildMaze();checkpoint()
}
// the boss (Bosses; Combat numbers; tuned Nov 23 with tools/boss-sim.js): 65 HP −8 per victim cut down. Phase 1, the
// Reaping: 60% to hit; sickles (weight 5), sweeps (2), and the names (1) if the fourth likeness was finished (1/1d4, or
// 1/1d6 after the cider). Phase 2 at half HP, the Gleaning: +5% to hit (65%), two more sickle strikes and one more sweep
// for each victim still on a pole, one more names if they're live.
async function bossIntro(){
 const F=G.flags;F.bossSeen=1;
 const names=F.deduce!=='right';
 if(names&&!F.fourthSeen){F.fourthSeen=1;await cut('fourth',()=>play(TEXT.fourth));clue('fourth',fmt(TEXT.cFourth));await horror(HORRORS.fourth)}
 if(!party.length)return;
 const left=3-(G.rescued||0);
 await cut('boss',async()=>{await said(TEXT.boss1);await said(TEXT.boss2);await said(TEXT.bossSay);await said(TEXT.bossSay2);
  await said(left?TEXT.bossLeft:TEXT.bossNone,{n:left,m:left+1});if(!names)await said(TEXT.bossNoFourth)});
 checkpoint();
 const E=EN.gleaner;
 E.moves=[['hit',5],['all',2]].concat(names?[['san',1]]:[]);
 E.sanHit=F.cider?['1','1d6']:['1','1d4'];
 E.phase2={at:.5,hit:5,moves:{hit:2*left,all:left,san:names?1:0},line:left?TEXT.bossPhaseGlean:TEXT.bossPhase};
 const hp=E.hp-E.cut*(G.rescued||0);
 const r=await battle(['gleaner'],{boss:true,hp,intro:TEXT.bossIntro,onStart:async()=>{if(G.rescued)await say('',fill(TEXT.bossThin,{v:G.rescued===1?'one victim':G.rescued+' victims'}),{auto:1500})}});
 if(r==='lose')return gameOver();
 F.boss=1;await ending();
}

// ================= OVERSTEPPING (Skills and menus, Overstepping and cover stories) =================
// An open case: the agents came with badges. Each overstepping choice calls the Luck roll; a climb plays its line, then
// the step's scene: the Sheriff for one scene (Local chief), Big Hat's call (Agency call), and the clean-up crew at the
// next area change (Federal agents).
async function overstepHere(seen){if(!(await overstep(seen)))return;await stepScene()}
async function stepScene(){
 const F=G.flags,s=stepName();
 if(s==='Local chief'&&!F.chief){F.chief=1;await play(TEXT.chief)}
 if(s==='Agency call'&&!F.call){F.call=1;await play(TEXT.call)}
 if(s==='Federal agents')F.fedsDue=1;
 checkpoint();
}
// the case's area-change hook (field.js): the Federal agents arrive as a very hard human story fight; win and the case
// shuts down on its worst ending
async function onArea(){
 const F=G.flags;if(!F.fedsDue||F.fedsDone)return;F.fedsDone=1;
 await cut('feds',()=>play(TEXT.feds));const r=await battle(['fed','fed','fed'],{story:true,intro:TEXT.fedsIntro});if(r==='lose')return gameOver();
 await play(TEXT.fedsWin);F.shutDown=1;await ending({worst:true});
}

// ================= ENDING (spec 006 C6; Demo 6 plays the full debrief) =================
// The ending label: clean (all three cut down, the right deduction, overstepping below Agency call), costly (the
// Gleaner beaten any other way), worst (the clean-up crew shut the case down). Plus the facts Demo 6 needs.
function endingLabel(){const F=G.flags;if(F.shutDown)return'worst';
 return(G.rescued===3&&F.deduce==='right'&&!stepAt('Agency call'))?'clean':'costly'}
function endingFacts(label){const F=G.flags;
 return{label,clues:G.clues.map(c=>c.id),saved:G.rescued||0,overstep:stepName(),
  san:party.map(m=>({id:m.a.id,name:m.name,from:m.san0,to:m.san})),
  items:party.flatMap(m=>gearOf(m).it.filter(it=>it.pin).map(it=>it.k)).concat((G.fs.pack||[]).filter(it=>it.pin).map(it=>it.k)),
  choices:{bell:F.bell?'rang':F.carving?'read':null,cider:!!F.cider,binder:F.binder?'taken':F.binderTried?'caught':null,deduce:F.deduce||null,
   sutter:!!F.sutter,page:F.pageAloud?'aloud':F.page?'taken':null,rest:{cruiser:!!F.cruiserRest,church:!!F.churchRest},photo:!!F.photo},
  tried:party.map(m=>({id:m.a.id,skills:m.tried||[]})),
  lost:(store.get(B.key('memorial'),[])||[]).filter(x=>x&&x.case===G.case&&!x.done).map(x=>({name:x.name,how:x.how}))}}
async function ending(o={}){
 const F=G.flags;
 if(!o.worst){await play(TEXT.end1);
  const lost=VICTIMS.filter(V=>!F['saved_'+V.id]);
  if(lost.length){await said(TEXT.endLost,{n:lost.map(v=>v.name).join(' and '),v:lost.length>1?'are':'is'});await trigger('death')}}
 await fade(1);G.mode='scene';await fade(0);
 const n=G.rescued||0,L=lead();
 if(!o.worst){await said(TEXT.dawn);await said(n===3?TEXT.dawn3:n?fill(TEXT.dawnSome,{n}):TEXT.dawnNone);if(F.pellHeld)await said(TEXT.dawnPell);
  // one sighting at dawn: the lead rolls, once ever per agent (saved on the agent, so it carries to the roster)
  if(!L.a.sawTall){L.a.sawTall=1;await play(TEXT.cameo);await horror(HORRORS.cameo,{who:[L]})}}
 L.a.cur=Object.assign(L.a.cur||{},{ch1:true,saved:n});
 const label=endingLabel();await debrief(label,endingFacts(label));  // Big Hat's debrief and the case gains (debrief.js)
}

// ================= THE DEBRIEF (spec 007) =================
// What debrief.js needs from this case: the clues the card counts, the victims, Big Hat's lines by ending and about
// the choices, the cover stories (2 with a skill, the weak Luck one, the Camera's, Clean books'), and the line after
// a bagged item. Which items are unnatural is on CASE_ITEMS (kind).
const DB=TEXT.db;
const DEBRIEF_DATA={
 clues:['scare','count','walk','drive','bell','cider','list','clip','lore'],victims:3,
 lines:{clean:DB.clean,costly:DB.costly,worst:DB.worst},
 react:F=>{const c=F.choices||{},out=[];if(c.cider)out.push(DB.cider);if(c.bell==='rang')out.push(DB.bell);if(c.deduce&&c.deduce!=='right')out.push(DB.wrong);
  if(c.sutter)out.push(DB.sutter);if(c.binder==='caught')out.push(DB.caught);return F.label==='worst'?out.slice(0,1):out.slice(0,2)},
 zip:[DB.zip],end:[TEXT.cruller],
 stories:[{name:DB.gas,skill:'Bureaucracy',verb:'paper it',pass:DB.gasPass},{name:DB.fire,skill:'Persuade',verb:'sell it',pass:DB.firePass}],
 weak:{name:DB.weak,pass:DB.weakPass},
 camera:{name:DB.photo,skill:'Persuade',verb:'sell it',mod:20,pass:DB.photoPass,show:F=>!!(F.choices&&F.choices.photo)},
 safe:{name:DB.safe,pass:DB.safePass},
 bagged:{page:[TEXT.filed]}
};

// ================= ON THE CASE BOARD =================
// portraits: the townsfolk's talking faces (spec 005), drawn in cases/still-harvest-art.js, loaded right after this file.
// A on this card plays caseOpening as Big Hat's briefing (spec 004, step 4).
// items: this case's own items. next: the Case file's Next line. quiet: false, an open case (they came as feds).
// loot: the roamers' drop table. onArea: the case's area-change hook (the clean-up crew).
const TILEDESC=TEXT.tiles;
registerCase({id:'still-harvest',card:caseCard,opening:caseOpening,intel:TEXT.intel,portraits:name=>SHA.portraits[name]||(name==='THE GLEANER'?SHB.portrait:null),
 enemies:EN,sprite:(k,f,w)=>SHB.sprite(k,f,w),spriteSize:k=>SHB.size(k),items:CASE_ITEMS,next:caseNext,quiet:false,loot:LOOT,onArea,
 backdrop:(p,o)=>SHB.backdrop(p,o),  // battle backdrops for the town street and the maze (cases/still-harvest-battle-art.js)
 debrief:DEBRIEF_DATA,label:endingLabel,facts:endingFacts});
