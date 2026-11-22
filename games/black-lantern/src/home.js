// Black Lantern · home.js
// The home phase (spec 008, part A; approved home phase mockup). After the debrief's funeral or goodbye and before the
// case board: Sabbatical cards for agents away, anyone coming back, Bonds that broke, personal arc beats that are due,
// then each agent in seat order picks ONE home scene. Scenes play in the Lantern Bust box over a home backdrop with the
// Bond's face; a result card shows the roll and what changed. Every finished step saves (G.db.home in the checkpoint).
// Loaded after debrief.js as a plain script, sharing the engine, field.js (horror, breakingPoint, offerRecruit, bondNow,
// bondFold) and the party menu's drawing helpers. Screen words: strings.js (HOMEW). Scene and arc lines: the text block below.

// ================= TEXT =================
// A list plays box by box: a string is narration, ['A', line] the agent, ['B', line] the Bond, ['WHO', line] anyone else.
// {A} the agent's name, {B} the Bond's name, {T} a Therapist's name, {M} a motivation, {D} a disorder, {SKILL} a skill,
// {B2} the agent's other Bond. Arc beats also use {X}: someone the beat needs who isn't one of the agent's Bonds.
const HT={
 // Fulfill Responsibilities: the scene by Bond type and mood (before the roll), then the outcome box by mood
 fr:{
  partner:{close:['The kitchen smells like garlic and somebody trying.',['B','You\'re home. You smell like a campfire and a hospital.'],['A','Long week.'],['B','Don\'t want to know. Sit. I made the thing.'],'The thing is lasagna. It\'s still frozen in the middle. Nobody mentions it.'],
   strained:['{B} is on the couch with the TV on mute.',['B','Your phone was off for six days.'],['A','Work.'],['B','Work. Right. Pest control.'],'You eat on opposite ends of the couch. A cooking show nobody\'s watching wins.'],
   fraying:['There\'s a suitcase by the door. It isn\'t yours.',['B','I\'m not leaving. I just like knowing it\'s packed.'],['A','That\'s insane.'],['B','You came home with somebody else\'s blood in your hair. Twice, babe.'],'You sleep on the couch. The suitcase watches you all night.'],
   broken:['The house is quieter than a house should be.','The good knives are gone. The dog is gone. The suitcase is gone.','On the fridge, under the pizza magnet: "Don\'t call. I mean it this time."','You don\'t call. You\'ll think about that magnet a lot, later.']},
  kid:{close:['{B} has been at the front window since lunch.',['B','Did you catch any bad guys?'],['A','A couple.'],['B','Were they REAL bad or regular bad?'],['A','Regular. Mostly.'],'You get dragged out back to meet a worm named Kevin. Kevin is the most important thing that happened all week.'],
   strained:['{B} doesn\'t look up from the tablet.',['A','Hey, bud. I\'m back.'],['B','Okay.'],'You missed the recital. There\'s a video. {B} says you don\'t have to watch it.','You watch it four times in the truck.'],
   fraying:['{B}\'s door has a new sign. KEEP OUT. The OUT is underlined twice.',['A','Brought you a snow globe. It\'s got a little lighthouse in it.'],'A long quiet.',['B','Why do you always smell like that when you come back?'],'You don\'t have an answer. You leave the snow globe on the carpet.'],
   broken:['The family lawyer has a fern and a bowl of mints nobody eats.','"Supervised visits," she says. "Considering the... gaps."','The drawing {B} made of you is still in your wallet. You\'re tall in it. You\'re smiling.','You have a gun for a hand.']},
  parent:{close:['{B}\'s house still has the plastic on the good couch.',['B','You\'re thin. Are they feeding you at that job?'],['A','There\'s a donut shop.'],['B','A donut is not a meal. Sit. I\'ll heat up the roast.'],'There\'s always a roast. You\'ve never once seen it start out raw.'],
   strained:[['B','Your cousin Danny got promoted. Regional.'],['A','Good for Danny.'],['B','I\'m just saying. Danny calls his mother.'],'You fix the garbage disposal. It\'s the only thing in this house you\'re allowed to fix.'],
   fraying:[['B','Saw a fire on the news. Out in the sticks somewhere. Was that you?'],['A','No.'],['B','You said "no" just like you did at fifteen. With my keys in your pocket.'],'Dinner is the sound of forks. The hall clock ticks like it\'s counting something.'],
   broken:['Your birthday card comes back. RETURN TO SENDER, in {B}\'s handwriting.','Inside, under your note, one line: "I raised a liar. I\'m done raising."','You keep the card. You throw out the envelope. Then you dig the envelope back out.']},
  sibling:{close:[['B','Look who crawled out. You look like hell, dipshit.'],['A','Missed you too.'],['B','Beer\'s in the fridge. Don\'t drink the green ones, those are my roommate\'s.'],'You drink the green ones. The roommate can file a complaint.'],
   strained:[['B','Mom keeps asking what you do. I keep saying "something in insurance."'],['A','That\'s close.'],['B','Is it? Is it close?'],'You split a pizza and fight about who got the bigger half. It\'s the only fight either of you is willing to have.'],
   fraying:[['B','I bailed you out twice. Once with money, once with Mom.'],['A','I know.'],['B','I don\'t think you do. I think you think it\'s a joke.'],'It is a little bit a joke. You don\'t say that. For once in your life, you read the room.'],
   broken:['{B} blocked your number. Then your other number. Then the burner.','You find out about the wedding from a cousin\'s Instagram.','Nice barn. Fairy lights. Your name isn\'t on any of the little table cards.']},
  friend:{close:[['B','The prodigal shithead returns.'],'{B}\'s garage: two lawn chairs, a mini fridge, a dartboard with one dart.',['B','Don\'t tell me where you were. Tell me something stupid instead.'],['A','A guy tried to bite me. Full mouth.'],['B','See? That\'s a good week.']],
   strained:[['B','Trivia\'s gone to hell without you. We came in eleventh. Out of eleven.'],['A','Sorry.'],['B','"Quiz Khalifa" was your name. We can\'t even change it. It\'s laminated.'],'You promise to come next Thursday. You both know the odds.'],
   fraying:[['B','You flinched when I hugged you. You know that?'],['A','Long drive.'],['B','You\'ve been on a long drive for two years.'],'The beer goes warm. Neither of you opens the second one.'],
   broken:['{B}\'s number goes to a recording. This number is no longer in service.','A box shows up months later. Your hoodie. A DVD you lent in 2014. A photo of you two at the lake, cut neatly in half.','You keep your half. You were laughing in it. You can\'t remember at what.']},
  ex:{close:[['B','You look awful. It\'s kind of comforting.'],['A','Thanks.'],['B','Sit. Not there, that\'s the cat\'s spot. The cat outranks you. Always did.'],'You two were terrible at being together and great at this.'],
   strained:[['B','I\'m not doing this because I miss you. I\'m doing this because you still have my good pan.'],['A','I\'ll bring the pan.'],['B','You said that in March.'],'You stay for coffee. It\'s exactly as bad as you remember. That helps, somehow.'],
   fraying:[['B','You only show up when you need something. I\'m not a gas station.'],['A','I don\'t need anything.'],['B','Then why are your hands shaking?'],'You leave before the coffee\'s done. You leave the pan on the porch.'],
   broken:['New locks. New car in the driveway.','A new person waves at you from the kitchen window, friendly and confused.','The cat\'s in the window too. The cat doesn\'t wave.']},
  coworker:{close:[['B','Where were you? I covered your shift. Told Gary you had "a family thing out of state."'],['A','That\'s weirdly accurate.'],['B','I\'m a gifted liar. Breakroom. They got the good donuts.'],'The breakroom microwave smells like twelve years of fish. It\'s the best thing you\'ve smelled all week.'],
   strained:[['B','HR wants to talk about your "unexplained absences." Plural.'],['A','Great.'],['B','I said you were caring for a sick aunt. Do you have an aunt?'],['A','Somewhere.'],'You eat lunch at your desks together. It\'s the only meeting you both show up for.'],
   fraying:[['B','People here think you\'re doing crimes. I keep saying no.'],['B','I\'m running out of no\'s.'],'Your desk plant is dead. {B} stopped watering it a while ago.'],
   broken:['Your badge doesn\'t open the front door anymore.','{B} sees you through the glass, points at the security guard and mouths: sorry.','Then goes back into the meeting. Somebody else is in your chair.']},
  mentor:{close:[['B','Sit down before you fall down.'],'{B}\'s porch has a coffee can for butts and a view of nothing.',['B','You did the job. You came home. Everything else is weather.'],'That\'s all the advice you get. It\'s enough.'],
   strained:[['B','I didn\'t teach you to hide things from me.'],['A','You taught me to hide things from everybody.'],['B','...Huh. Guess I did.'],'You play cards. {B} cheats. You let it slide.'],
   fraying:[['B','I\'ve buried people who had your look. Don\'t make me buy another suit.'],['A','I\'m fine.'],['B','That\'s what they said. Word for word.'],'The porch light flickers. {B} doesn\'t get up to fix it.'],
   broken:['{B}\'s porch is empty. The coffee can is gone.','A neighbor says {B} moved to Arizona. No forwarding address. Left you one thing: a deck of cards with the aces missing.','You never did figure out how {B} cheated.']}
 },
 frOut:{
  close:{ok:'Somebody saves you the last slice.',crit:'For about an hour, you forget what\'s in the trunk.',fumble:'Your phone buzzes mid-sentence. You check it. {B} watches you check it.'},
  strained:{ok:'At the door, {B} says "Drive safe." It isn\'t nothing.',crit:'{B} laughs at one of your jokes. A real one, with the snort.',fumble:'You laugh at the wrong moment. You don\'t explain why.'},
  fraying:{ok:'At the door, {B} almost says something. Almost is a start.',crit:'{B} walks you to the car. Neither of you mentions it.',fumble:'You call {B} by a dead man\'s name. You don\'t know where it came from.'},
  fail:'Nothing breaks. Nothing heals. You drive home with the windows down.'},
 nature:[['The lake is flat. A heron stands in it like it\'s waiting for a bus.','You catch nothing all day. Perfect.'],['The campground has one other tent.','The guy in it eats cold beans from the can and nods at you like a coworker.'],
  ['You drive until the gas station signs stop.','At the last one, the hot dog roller is empty and turning anyway.'],['The trail sign says 2.1 miles. It\'s a lie.','Everyone on the trail knows it\'s a lie. You love them all a little.'],
  ['Six hours in the deer blind. A doe walks out, looks right at you,','and decides you aren\'t worth it. Fair.'],['The beach in November is yours and a man with a metal detector.','He finds a quarter. He holds it up like a medal.']],
 natureCost:['{B} texts: "u alive?"','You\'ll answer tomorrow.'],
 natureOut:{ok:'Something in your chest unclenches a notch.',crit:'You sleep eleven hours in the truck. No dreams. None.',fail:'The quiet is just quiet. You\'ll take it.',fumble:['Past the treeline, something is standing very still.','It\'s a stump. You\'re ninety percent sure it\'s a stump.']},
 pursue:{'Protect the innocent':['You volunteer at the animal shelter.','A three-legged pit bull named Biscuit picks you. You don\'t get a say.'],'Find the truth':['You spread the old files across the motel bed. Red string.','You bought red string. You\'re that person now.'],
  'Family':['You call everybody in your phone saved as family.','Uncle Ray talks about his gutters for forty minutes. You let him.'],'Faith':['Wednesday church is you, a lady with a walker, and the pastor rehearsing to empty pews.','He\'s on draft three of the joke. It still doesn\'t land. You laugh anyway.'],
  'Revenge':['The notebook used to be a grocery list. Now it\'s names.','You add one. You cross out none. You feel better than you should.'],'Duty':['You go to the range on your own dime and put two hundred rounds into paper men.','The paper men never get back up. It\'s restful.'],
  'Curiosity':['Three days in a used bookstore that smells like cat and basement.','You buy one book, about bees. It\'s about bees. Probably.'],'Money':['You count the hazard pay twice. Same both times.','Still not enough. But money doesn\'t ask what you did for it.'],
  'Redemption':['You mow the lawn of the widow down the street. She doesn\'t know why.','You don\'t tell her. You\'ll never tell her.']},
 pursueOut:{ok:'It\'s small. It holds.',crit:'For one afternoon, the reason is enough.',fail:'You go through the motions. The motions are something.'},
 newMot:['You lie awake making a list of reasons to get up. The old one\'s gone.','You write a new one on the back of a pizza coupon.'],
 newMain:'Somewhere, a story you were in the middle of just stops. You don\'t miss it yet.',
 use:[['The break is a blur with the blinds shut.','You remember a delivery driver. You remember being very nice to him.'],['You tell yourself it\'s maintenance, like an oil change.','Nobody\'s ever cried over an oil change.'],
  ['You wake up on the bathroom floor. The tile\'s cool.','The cat sits on the edge of the tub, watching you like a rerun.']],
 useCost:['{B} calls. You let it ring. On the fourth call you pick up','and lie so well it scares you.'],
 newBond:{partner:['You meet {B} at a laundromat at two in the morning.','You\'re both washing something you won\'t talk about. You don\'t talk about it.','Best date you\'ve had in years.'],
  kid:['The paperwork took months. {B} took four minutes.','They looked at your car, said "it\'s dirty," and decided you were okay.'],
  parent:['The number in the old address book still works.',['B','...Well.'],['B','Well. Look who it is.']],
  sibling:['A DNA kit, a 47% match, and a stranger in Tulsa named {B}.','By the second call, {B} already has a nickname for you. It\'s mean. It\'s perfect.'],
  friend:['{B} lives next door and brings your trash can in every week without being asked.','One day you carry over a six-pack. That\'s the whole ceremony.'],
  ex:['You run into {B} at Costco. Ten years.','Neither of you has changed your food court order.'],
  coworker:['{B} is the new hire at your cover job.',['B','You never take vacation, huh? Oh. You\'re one of those.'],'You don\'t know what that means. You like it anyway.'],
  mentor:['{B} runs the boxing gym two blocks over. Sixty-something, cauliflower ears.',['B','You hold your hands like somebody who\'s been hit. Come back Tuesday.']]},
 therOpen:['The waiting room has a fish tank with one fish in it.','The fish has seen things.'],
 therParty:['{T} sets up two lawn chairs in the motel parking lot.',['T','My office. Fifty-minute hour. I\'m billing Big Hat.']],
 therSan:[['THERAPIST','So. What brings you in?'],['A','Can\'t sleep.'],'It\'s true. It just isn\'t the whole truth. It isn\'t even most of it.'],
 therOut:{ok:'You say one true thing out loud. The room doesn\'t catch fire.',crit:'You cry in the parking lot after. Good crying. The kind with a sandwich after.',fail:'Fifty minutes about your childhood dog. Nice dog, though.',fumble:'You say too much. You watch the pen stop moving.'},
 therDis:[['You learn the thing\'s real name. It isn\'t a monster name.','It\'s a word from a pamphlet. That helps more than it should.'],['Homework is a worksheet with a cartoon brain on it.','You fill it out at a red light.'],
  ['You notice it\'s gone the way you notice a headache\'s gone:','late, and a little suspicious about it.']],
 skill:{'Firearms':'The range officer says you shoot like you\'re mad at the paper. You are.','Melee':'A seventeen-year-old at the boxing gym puts you on your back twice, then offers you a protein bar.',
  'Dodge':'Salsa class. The instructor says you move like someone avoiding something. Correct.','Search':'A thousand-piece lighthouse puzzle. The last piece was under the cat.',
  'Forensics':'Night class in crime scene work. You correct the instructor once. You don\'t explain how you know.','Occult':'A library book on folk magic. Somebody underlined all the wrong parts, in pencil, hard.',
  'History':'The county archive\'s microfiche machine is older than you and in better shape.','Science':'You dust off the old chemistry set. The landlord asks about the smell. "Candles," you say.',
  'Empathy':'You sit in a diner and guess what every customer is sad about. You\'re right about the trucker. Wrong about the clown.','Persuade':'You sell a used couch online for more than you paid for it new.',
  'Bureaucracy':'You fight a parking ticket for three days and win. The clerk shakes your hand.','Athletics':'You run every morning. Day four, a dog runs with you. Day five, the dog wins.',
  'Stealth':'You practice crossing the apartment without a creak. You get it down to one board. The one board is personal.','Survival':'You go camping with a knife and a tarp. You come back with the tarp.',
  'First Aid':'Weekend CPR class. The dummy\'s name is Annie. You save Annie eleven times.','Medicine':'A pharmacology textbook in the bathtub. You learn what\'s in your own medicine cabinet. Some of it goes in the trash.',
  'Computers':'You build a PC from three garage sales\' worth of parts. It boots first try. You don\'t trust it.','Craft':'You rebuild a mower engine on the kitchen table. Nobody can eat at the table now. Worth it.'},
 train:['{B} asks why you\'re learning that, all of a sudden.','"Work," you say. Second time this year.'],
 sabIn:[['BIG HAT','You\'re benched. Doctor says rest. I say rest. Don\'t argue with two doctors.'],'The facility is an old lake resort. The fence is new. The paddle boats are chained up.'],
 sabEach:['A nurse brings pudding at three every afternoon.','You start to love three o\'clock.'],
 sabCure:'One morning you realize you slept with the light off.',
 sabBack:['Your locker\'s been used. The recruit left a gum wrapper and a photo of a dog.','You keep the dog.'],
 // ---- personal arcs, season 1: one per motivation, three beats after the 1st, 3rd and 5th case survived ----
 // b1/b2: the beat (b2 opens with a lead-in that follows the beat 1 choice), then two choices (hold, slip);
 // good, bad: the finale; shield: the short bad finale after giving up the Main at a Breaking Point.
 arcs:{
  'Protect the innocent':{
   b1:['11:40 at night. A kid is sitting on your front steps in a Spider-Man hoodie.','Jojo, nine, from two doors down. He\'s not crying. He\'s eating dry Froot Loops from the box.',
    ['JOJO','Mom\'s boyfriend is being loud. I\'m not allowed back till it\'s quiet.'],['JOJO','You have cable? We had cable.'],'Through the wall of the next house: a thump. Then a TV, turned up.'],
   hold1:['Call it in right','You call the non-emergency line, then CPS. You sit with Jojo on the steps till a patrol car comes.','Jojo looks at you like you sold him out. Maybe you did.'],
   slip1:['Handle it yourself','You walk over. Two minutes.','The boyfriend\'s truck leaves with one headlight. Jojo sleeps on your couch. You sleep fine.'],
   b2hold:['Jojo\'s grandma is fighting for custody now. The boyfriend still gets weekends.'],b2slip:['The boyfriend filed an assault complaint. Jojo stopped coming outside.'],
   b2:['2 a.m. A knock. Jojo, with a bruise he explains too fast.',['JOJO','I fell off the monkey bars. At night.'],['JOJO','Can I sleep on your couch? I won\'t eat anything. Except the Froot Loops.'],['B','You can\'t adopt every stray on the block, {A}.']],
   hold2:['Do it the long way','You drive Jojo to his grandma\'s at 2 a.m. You wake a caseworker. You sign three statements.','Jojo falls asleep in the back seat before you\'re out of the driveway.'],
   slip2:['Let him stay. Tell no one.','He sleeps. Finally. Mouth open, one sock on.','You sit up and watch the door till the sky goes gray.'],
   good:['Grandma\'s porch, a Saturday. Jojo hands you a crayon drawing.','You, with a giant flashlight. Monsters running.',['JOJO','That\'s you. You\'re bigger in it.'],'You are. You\'ll keep it in your wallet till the crayon wears off.'],
   bad:['The house two doors down has a For Sale sign.','Nobody will say where Jojo went.','You check the lock three times before bed. Then four.'],
   shield:['You drive past the house two doors down.','The porch light is off. It\'s been off for weeks.','You stop driving past.'],
   perk:'protect',dis:'paranoia'},
  'Find the truth':{adult:1,
   b1:['A Facebook memory: "15 years ago today we lost Danny."','Danny Ruiz. High school. Drowned in a stock pond in 2009. Ruled an accident.','You bring it up. {B} changes the subject too fast.',
    ['B','He was drunk. Everybody was drunk. That\'s the whole story.'],'Nobody says "that\'s the whole story" about a whole story.'],
   hold1:['Ask his mother first','Mrs. Ruiz says yes over the phone.','Then she cries for a while, politely, and thanks you for calling.'],
   slip1:['Pull the file','Agency access. A sealed sheriff\'s report, in your inbox by lunch.','Page four is missing. Now it\'s a real lead.'],
   b2hold:['Mrs. Ruiz mailed you his yearbook. Somebody signed it "see you at the pond."'],b2slip:['Page four turns up in a county archive box. Two sets of tire tracks.'],
   b2:['Danny wasn\'t alone at the pond. There was a second set of tracks. A borrowed truck.','The person who drove away was {B}.',['B','He said he was fine. He said "go, I\'m fine." I was seventeen.'],
    ['B','I\'ve thought about it every day. You want to know a secret? Every day is not an exaggeration.']],
   hold2:['Ask {B} to tell her','You say you\'ll go with them. You\'ll sit in the car if that\'s easier.','{B} says nothing for a long time. Then: "Okay."'],
   slip2:['Tell her yourself','You call Mrs. Ruiz that night.','It comes out of you in about a minute. The relief is enormous. It shouldn\'t be.'],
   good:['The pond, early morning.','{B} and Mrs. Ruiz sit on a tailgate, not talking. She hands {B} a thermos.','That\'s not forgiveness. It\'s coffee. It\'s a start.'],
   bad:['{B}\'s number is disconnected.','A postcard comes from two states away. Five words.','"You could have let me."'],
   shield:['You close the file on Danny Ruiz.','You don\'t open it again.','{B} stops calling. You don\'t ask why.'],
   perk:'truth',badBond:1},
  'Family':{parent:1,
   b1:['{X} calls. The house on Pell Street is sold. Closing is in three weeks. Come help pack.',['X','I kept your lighters. In a box. Somewhere. Don\'t ask where.'],'{X} says it like a dare. Your room\'s still a ten-year-old\'s room. It always will be.'],
   hold1:['Go home','You give up the weekend {B} had planned.','You pack your childhood into liquor-store boxes. {X} labels every one wrong on purpose.'],
   slip1:['Send money for movers','You send the money. You spend the weekend with {B}.','It feels like a vacation. That\'s the problem with it.'],
   b2hold:['In the attic, under the Christmas boxes, you find a shoebox.',['X','I was going to burn those. I kept not doing it.']],b2slip:['The movers ship the boxes. In one of them, alone in your kitchen, you find a shoebox.'],
   b2:['Letters to a P.O. box. A photo of a toddler in a car seat. Born two years before you.','On the back: "Our Annie. We\'re sorry."'],
   hold2:['Find Annie','You ask {X} for their blessing. {X} gives it, the way you\'d give up a tooth.','You start looking.'],
   slip2:['Burn it. Keep the peace.','The box goes in the fire pit.','{X} hugs you and means it.'],
   good:['A diner booth. A woman with your exact nose.','She\'s brought her own kids\' school photos and lays them out like a hand of cards.',['ANNIE','So. You\'re the one they kept.'],'She laughs first. That\'s how you know it\'ll be all right.'],
   bad:['The last box comes out of Pell Street.','In it: the Christmas ornaments, a dead phone charger, and nothing else.','Some families keep secrets. Yours kept you.'],
   shield:['Pell Street closes without you.','{X} mails you a key that doesn\'t open anything anymore.','You keep it on your ring anyway.'],
   perk:'family',badBond:1,dis:'sleep'},
  'Faith':{
   b1:['{B} has been sick for a year. Pain no doctor can name.','A flyer on the fridge: HEALING REVIVAL. ALL WELCOME. ROUTE 9. NO COLLECTION TAKEN.','That last line is underlined twice.',
    ['B','No collection. When\'s the last time church didn\'t pass a plate?'],'Whatever you believe, or used to, it gets quiet in you when you read that line.'],
   hold1:['Go with them','You stand in the back of the tent. Folding chairs. A man with a tambourine and no rhythm.','At the far edge of the crowd, a tall man in an old deacon\'s coat. A ledger under his arm.','His eyes are closed. He\'s turned toward you anyway.'],
   slip1:['It\'s a con. Stay home.','{B} goes to bed angry. You sit up with the TV.','You\'re sure. Tonight, you\'re sure.'],
   b2hold:['{B} has been going back to the tent every week.'],b2slip:['{B} went to the tent without you.'],
   b2:['{B} is better. Not cured. Better.','They had a visit at home. A courteous man. A paper and a pen.',['B','He said I only have to sign when I\'m ready. He said there\'s no hurry. Isn\'t that the kindest thing?'],
    'You find the paper on the counter. The line for a signature is already a little worn.','Like a lot of thumbs have rested there.'],
   hold2:['Tear it up. Sit with them.','You tear it into eighths. You and {B} sit at the kitchen table till sunrise. Some of that is praying. Some of it isn\'t.','The pain is back by morning.'],
   slip2:['Sign it yourself, so they don\'t have to','You sign. The pen is warm, like somebody just put it down.','{B} sleeps without pain for the first time in a year.'],
   good:['Route 9. Where the tent was, a square of yellow grass.','{B} holds your hand and says the pain\'s bad today, and that\'s fine.','Nobody passed a plate. Nobody had to.'],
   bad:['You wake up with a pen in your hand.','You don\'t own a pen like that.'],
   shield:['You stop going to church. Any church.','On Route 9 the grass is still yellow in a square.','You take the long way around.'],
   perk:'faith',dis:'paranoia'},
  'Revenge':{
   b1:['You pull into a car wash. The guy drying windshields is Curtis Pyle.','Eleven years ago Curtis ran a red light drunk and killed your little brother, Tyler. He served eighteen months.','He has a name tag now. CURTIS.',
    ['CURTIS','Want the tire shine? It\'s two bucks but I\'ll do it for free.'],'He doesn\'t know you. That\'s the worst part. You\'ve known him every day.'],
   hold1:['Drive away','You drive away. Your hands are fine. Your hands are fine for almost a whole mile.'],
   slip1:['Follow him home','A duplex with a plastic slide in the yard.','You know where he sleeps now. That\'s something.'],
   b2hold:['You go back to the car wash once. Just once. He\'s not working that day.'],b2slip:['There\'s a note on your windshield: "I know who you are. I\'m sorry. I\'m not going anywhere."'],
   b2:['Curtis is sober. Nine years. He coaches T-ball on Saturdays.','His kid plays second base and picks flowers in the outfield.',['B','You want him dead or you want him sorry? Because he\'s already sorry.']],
   hold2:['Say it to his face','In daylight, on the bleachers. You say Tyler\'s name. You say all of it.','Then you leave before he can answer.'],
   slip2:['Let him see you. Every Saturday.','You sit in the same spot every Saturday.','He flinches every time. You don\'t.'],
   good:['The cemetery. You tell Tyler\'s headstone about the T-ball kid picking flowers.','You put the grudge down. It\'s heavier than you thought.','Your arms remember.'],
   bad:['Curtis didn\'t coach that Saturday. Or the next.','The league sent a card.','You wash your hands at the sink for a long time.'],
   shield:['You drive past the car wash.','You don\'t stop. You don\'t look.','You look.'],
   perk:'revenge',dis:'ptsd'},
  'Duty':{
   b1:['A call from your old life. Ruth Okafor, your partner from before Black Lantern.','A review board is reopening the Garza thing. Ruth wants you to back her version.',['RUTH','Remember it how I remember it. That\'s all I\'m asking. You owe me two ribs and a wedding toast.'],
    'You don\'t remember it how she remembers it. You remember it how it happened.'],
   hold1:['I\'ll tell it straight','Ruth goes quiet on the line.',['RUTH','Okay. Okay. You always were a pain in my ass.']],
   slip1:['I\'ve got your back','Old loyalty feels like a warm coat.',['RUTH','I knew it. Drinks after. On me.']],
   b2hold:['Ruth hasn\'t called since.'],b2slip:['Ruth calls twice a day now, going over it.'],
   b2:['The hearing is next week. Big Hat calls. On a Sunday.',['BIG HAT','You were never at that job. You\'ve got no last name in that room.'],['BIG HAT','You go in there and tell it straight, a lawyer pulls your file, and your file is a door I can\'t have open.'],['BIG HAT','Don\'t make it weird.']],
   hold2:['Testify anyway','You tell the truth. You keep the agency out of it, barely.','Big Hat doesn\'t call. That\'s how you know he heard.'],
   slip2:['Stay home, like he says','A box of crullers arrives Monday. No note.','They\'re still warm, somehow.'],
   good:['Ruth, outside the courthouse, smoking.',['RUTH','You sold me out.'],['RUTH','...Good. Somebody had to.'],'She owes you two ribs now. You\'ll collect.'],
   bad:['The board rules in Ruth\'s favor. The Garza family is on the news.','{B} watches it and doesn\'t look at you.'],
   shield:['The hearing happens without you.','You read about it in the paper, in a gas station, standing up.','{B} doesn\'t ask. You don\'t say.'],
   perk:'duty',badBond:1},
  'Curiosity':{
   b1:['3:12 a.m. The old clock radio in your kitchen plays. It\'s been unplugged for years.','A numbers station. The voice reading the numbers is {B}\'s.',['RADIO','Four. Eleven. Six. Six. Two. Four. Eleven.'],'{B} is asleep across town. You checked. You checked twice.'],
   hold1:['Write it down, turn it off','You write the numbers on a napkin. You turn the knob. It clicks off like any radio.'],
   slip1:['Talk back','"Who is this?" you say, into a radio.','The numbers stop. Breathing. Then they start again, a little faster.'],
   b2hold:['The napkin has been on your fridge for two months.'],b2slip:['The radio plays every night now. You stay up for it.'],
   b2:['The numbers were dates and house numbers.','Each one: a small fire, a gas leak, a car in a lake, a week later.','The newest set is {B}\'s address. And tomorrow.','You could be wrong. You\'ve never been wrong.'],
   hold2:['Get {B} out tonight','You drive {B} to a motel off the highway. No explanation. {B} is furious the whole way.','At 3:12 nothing happens. You still don\'t sleep.'],
   slip2:['Go alone and watch at 3:12','You park across the street and watch {B}\'s house.','At 3:12 nothing happens. Then the porch light goes out by itself.'],
   good:['3:12. The radio plays one last broadcast in {B}\'s voice.',['RADIO','Thank you for listening.'],'Then a song your grandmother used to hum. Then nothing. Forever.'],
   bad:['The radio is in the trash.','It plays from the trash.','You start writing numbers in the margins of case files without noticing.'],
   shield:['You unplug the radio. It was already unplugged.','You put it in the trunk of the car.','You can hear it at red lights.'],
   perk:'curious',dis:'paranoia'},
  'Money':{
   b1:['{B} needs money. Nine thousand dollars, by the end of the month.','Your account has four hundred and twelve.',['B','I\'ll pay you back. I\'ll pay you back with interest. I\'ll pay you back with my blood.'],
    'The case file in your bag has an ugly little statue in it.','A man online offered six figures for "anything from the Lantern program." He spelled it right.'],
   hold1:['Do it the hard way','A second job. The car sold. A payment plan with a man named Gary who calls you "chief."'],
   slip1:['Sell the statue','You meet the buyer in a Denny\'s. He wears gloves to eat pancakes.','The money is real. It\'s in your hand.'],
   b2hold:['The collector writes again. He heard you have access. He offers more.'],b2slip:['The collector writes again. He wants more. He knows your home address.'],
   b2:[['COLLECTOR','Not threatening. Just a fan. Big fan. Of your front door.']],
   hold2:['Tell Big Hat',['BIG HAT','Put a bow on this.'],'By morning the collector has vanished from the internet. All of it. Even his Yelp reviews.'],
   slip2:['Sell him one more thing','The bill is paid off.','{B} cries with relief in a parking lot. You hold them and you don\'t feel anything at all.'],
   good:['A kitchen table. A laptop. A spreadsheet called BROKE BUT ALIVE.','You and {B} eat cereal for dinner and laugh.','It isn\'t paid off. It isn\'t close. You\'re not alone with it.'],
   bad:['{B} finds the collector\'s texts.','They don\'t yell. They put the money on the counter in an envelope, every dollar, and leave.'],
   shield:['You stop checking your bank balance.','{B} stops asking.','It\'s quieter. That\'s not the same thing.'],
   perk:'money',badBond:1},
  'Redemption':{
   b1:['A letter at your door. No stamp. It\'s from Carla Dunmore.','Years ago you left Carla behind on the worst night of both your lives. The fire at the Dunmore place.','You got out a window. You didn\'t go back.',
    'Carla has burn scars and a diner now.',['LETTER','I know where you work. Not that work. The other one. Come eat. I won\'t spit in it.']],
   hold1:['Go to the diner','You go. She seats you herself. She doesn\'t spit in it.','You can\'t taste it anyway.'],
   slip1:['Don\'t. Change the locks.','You change the locks. You change them again.','Relief, like ice on a burn.'],
   b2hold:['You\'ve eaten at Carla\'s four times. Nobody has said the word "fire."'],b2slip:['Carla came to you. She\'s sitting in her car outside your building.'],
   b2:['Carla doesn\'t want an apology.','Her son, Eli, has started asking about the fire. She told him a kinder story.','She wants you to tell him the true one. With {B} there.',
    ['CARLA','You need a witness that you said it.'],['CARLA','I\'m not forgiving you. I\'m just tired of carrying both halves.']],
   hold2:['Tell Eli the truth','All of it. The window. The not going back.','Eli doesn\'t say anything. {B} holds your hand under the table.'],
   slip2:['Tell the better version','Smoke. Confusion. Nobody\'s fault.','Eli shakes your hand.'],
   good:['Carla\'s diner, a Tuesday. She refills your coffee without asking.','Eli is doing homework in a booth.',['CARLA','Pie\'s on the house. Coffee you\'re paying for.'],'That\'s the closest thing to grace you\'ll get in this life. It\'s enough.'],
   bad:['Eli finds the fire report online.','{B} was there for the better version.','Now two people know what you are.'],
   shield:['You never go back to Carla\'s.','You drive past it once, at night. The OPEN sign is on.','You keep driving.'],
   perk:'redeem',badBond:1,dis:'depression'}
 },
 arcGood:'The good ending. A perk: {p}.',arcCost:'{B} paid for it. {B} −{n}.',arcEnds:'{A}\'s story ends here for this season.',
 arcBondBad:'{B} is gone from {A}\'s life.',stand:['Sam','Toni','Lee','Jules','Pat','Robin']
};
const HW=BLS.HOMEW;

// ================= HELPERS =================
const HTYPE=r=>String(r||'Friend').toLowerCase();
const moodOf=(s,cha)=>s<=0?'broken':s>=cha*2/3?'close':s>=cha/3?'strained':'fraying';
const MOODCOL={close:PC.green,strained:PC.mus,fraying:PC.pump,broken:PC.pink};
const chaOf=a=>a.stats.CHA||10;
const nameOf=m=>m.name;
const bondsOf=a=>(a.bonds||[]).map((b,j)=>({b,j,s:Math.max(0,b.score??chaOf(a)),cha:chaOf(a)})).map(x=>Object.assign(x,{mood:moodOf(x.s,x.cha)}));
// a Bond's face: Storybook face parts, picked the first time the Bond appears, then kept (Parents and Mentors greyer)
function bondLook(b){
 if(!b.look){const old=/Parent|Mentor/.test(b.rel);b.look={skin:rnd(6),hair:rnd(7),hairC:old?5+rnd(2):rnd(5),eyes:rnd(3),eyeC:rnd(5),acc:old?pick([0,9,9,1,3]):b.rel==='Kid'?pick([0,0,7]):pick([0,0,3,7,8]),outfitC:rnd(7)}}
 return b.look}
// how a Bond's face is drawn: its saved parts, plus its age from its type (Parents and Mentors older, Kids the kid
// face; not saved, so Bonds saved before Part B age too) and plain clothes (a cardigan for the older ones)
const bondAgent=(a,b)=>{const old=/Parent|Mentor/.test(b.rel);return{prof:a.prof,look:Object.assign({},bondLook(b),{age:old?'old':b.rel==='Kid'?'kid':'',outfit:old?'cardigan':'plain'})}};
const bondFace=(a,b)=>{const x=bondAgent(a,b);return faceCanvas(x,'b'+JSON.stringify(x.look))};
const porCache={};
function faceCanvas(a,key){if(!porCache[key]){const c=document.createElement('canvas');B.drawPortrait(c,a,2,false);porCache[key]=c}return porCache[key]}
// sets who can speak in a scene, with their faces: the agent and each of their Bonds
function castFor(m,extra={}){
 Object.keys(XPOR).forEach(k=>delete XPOR[k]);
 const a=m.a,me=faceCanvas(a,'a'+JSON.stringify([a.prof,a.look]));XPOR[m.name.toUpperCase()]=c=>c.drawImage(me,0,0);
 (a.bonds||[]).forEach(b=>{const f=bondFace(a,b);XPOR[String(b.name).toUpperCase()]=c=>c.drawImage(f,0,0)});
 Object.entries(extra).forEach(([k,f])=>XPOR[k]=f);
}
// plays scene lines: 'A' the agent, 'B' the Bond, 'T' a Therapist, 'X' an arc stand-in; anyone else by name
async function hPlay(seq,m,o={}){
 const fo=Object.assign({A:m.name,B:o.B||'',B2:o.B2||'',T:o.T||'',X:o.X||'',M:o.M||'',D:o.D||'',SKILL:o.SKILL||''},o);
 for(const l of [].concat(seq||[])){
  if(Array.isArray(l)){const who=l[0]==='A'?m.name:l[0]==='B'?fo.B:l[0]==='T'?fo.T:l[0]==='X'?fo.X:l[0];await say(String(who).toUpperCase(),fillT(l[1],fo))}
  else await say('',fillT(l,fo))}}
// SAN changes at home: gains never above the agent's starting SAN; losses can set off a Breaking Point
function sanUp(m,n){const b=m.san;m.san=Math.min(m.msan,m.san+n);return[b,m.san]}
async function sanDown(m,n){const b=m.san;m.san=Math.max(0,m.san-n);
 if(m.san<=0){await zeroSan(m);if(G.fs.recruit&&G.fs.recruit.length)await offerRecruit({late:true});homeMemorial()}
 else if(!m.noBP&&m.san<=m.bp)await breakingPoint(m,'helplessness');return[b,m.san]}
function homeMemorial(){const mem=store.get(B.key('memorial'),[]),s=loadSeason();if(Array.isArray(mem)){mem.forEach(x=>{if(x&&x.case===G.case&&!x.done){x.done=true;x.season=s.season|0||1;x.cases=x.cases|0}});store.set(B.key('memorial'),mem)}}
const rollWord=x=>x.crit?HW.crit:x.fumble?HW.fumble:x.ok?HW.pass:HW.fail;
const outKey=x=>x.crit?'crit':x.fumble?'fumble':x.ok?'ok':'fail';
// a Therapist in the party (not this agent) can run Therapy with their Empathy
const therapistFor=m=>live().filter(x=>x!==m&&x.a.prof==='therapist').sort((p,q)=>chanceOf(q,'Empathy')-chanceOf(p,'Empathy'))[0]||null;
const perkOf=(m,id)=>!!(m&&m.a&&m.a.arc&&m.a.arc.perk===id);
const perkHolder=id=>live().find(m=>perkOf(m,id))||null;

// ================= SABBATICAL WHILE AWAY (run once per closed case, from caseCounts) =================
// Each case the party closes while an agent is away: SAN +1d6 (up to max); a 40% roll cures one disorder (picked at
// the card in the home phase); every Serious lasting injury clears on the first case sat out (Lasting injuries).
function sabTick(){
 const R=B.S.roster||[],inParty=new Set(live().map(m=>m.a.id)),out=[];
 R.forEach(a=>{const S=a.sab;if(!S||!(S.left>0)||inParty.has(a.id))return;
  const c=a.cur=a.cur||{},max=(a.stats.POW|0)*5,from=c.san??max,g=roll(1,6);c.san=Math.min(max,from+g);
  if(!(S.sat|0)&&Array.isArray(a.inj))a.inj=a.inj.filter(x=>!(x.tier==='serious'&&!x.perm));
  S.sat=(S.sat|0)+1;S.left--;const cure=(c.dis||[]).length>0&&Math.random()<.4;
  out.push({id:a.id,g,from,to:c.san,cure,back:S.left<=0});
  if(cure&&!G.db){c.dis.splice(rnd(c.dis.length),1)}});  // no home phase to pick at (a Dev finish): one at random
 store.set(B.key('roster'),R);
 if(G.db){G.db.home=G.db.home||{stage:'away',i:0,b:0,picks:[]};G.db.home.away=out}
}

// ================= THE FLOW =================
async function runHome(){
 const D=G.db;if(!D.counted)caseCounts();
 const H=D.home=D.home||{stage:'away',i:0,b:0,picks:[]};if(!H.picks)H.picks=[];if(!H.stage)H.stage='away';
 G.mode='scene';G.scene='home';HS.card=null;setBg();hud.hidden=true;
 if(H.stage==='away'){for(const x of H.away||[])if(!x.shown){await awayCard(x);x.shown=1;checkpoint()}H.stage='back';checkpoint()}
 if(H.stage==='back'){for(const x of H.away||[])if(x.back&&!x.backDone){await backScreen(x);x.backDone=1;checkpoint()}H.stage='broken';checkpoint()}
 if(H.stage==='broken'){for(const m of live().slice())await brokenBonds(m);H.stage='beats';checkpoint()}
 if(H.stage==='beats'){while(H.b<party.length){const m=party[H.b];if(m&&!m.gone)await arcBeat(m);H.b++;checkpoint()}H.stage='pick';checkpoint()}
 if(H.stage==='pick'){while(H.i<party.length){const done=await homePick(H.i);if(done===false)continue;H.i++;checkpoint()}}
 HS.card=null;
}
const HS={card:null,bg:'home',night:false,dress:''};  // what the home backdrop shows: the result card over it, which backdrop (a Bond type or a place, home-art.js), night or not, and the 'broken' or 'arc' dressing
// sets the backdrop for the next scene; with no arguments, back to the agent's own living room
function setBg(k,night,dress){HS.bg=k||'home';HS.night=!!night;HS.dress=dress||''}

// ---- away on Sabbatical: one card per agent ----
async function awayCard(x){
 const a=(B.S.roster||[]).find(r=>r.id===x.id);if(!a)return;const m={name:firstName(a),a};
 setBg('sab');castFor({name:m.name,a});
 await hPlay(HT.sabEach,m);
 const rows=[{l:fillT(HW.sanUp,{a:x.from,b:x.to}),chip:StudioChip.die(6,x.g)}];
 if(x.cure){const ds=(a.cur.dis||[]);let i=0;if(ds.length>1){i=await choose(ds.map(d=>BLS.DISORDERS[d.k].name),{title:HW.cureQ});if(i<0)i=0}
  const d=ds.splice(i,1)[0];store.set(B.key('roster'),B.S.roster);if(d){rows.push({l:fillT(HW.cured,{d:BLS.DISORDERS[d.k].name}),chip:'40%'});await hPlay(HT.sabCure,m)}}
 HS.card={title:fillT(HW.awayT,{n:m.name.toUpperCase()}),sub:fillT(HW.sabTag,{k:a.sab&&a.sab.left>0?a.sab.left:0}),rows};
 await say('',x.back?HW.back:fillT(HW.sabTag,{k:a.sab.left}));HS.card=null;setBg();
}
const firstName=a=>(a.name||'Agent').split(' ')[0].slice(0,9);
// ---- coming back: the agent and the recruit who covered, side by side; the player picks who keeps the seat ----
async function backScreen(x){
 const R=B.S.roster||[],a=R.find(r=>r.id===x.id);if(!a)return;const cov=a.sab&&a.sab.cover,ri=party.findIndex(m=>m.a.id===cov);
 if(ri<0){delete a.sab;store.set(B.key('roster'),R);await say('',fillT(HW.backRoster,{n:firstName(a)}));return}
 const r=party[ri];
 const keep=await new Promise(res=>{SCR={kind:'home',v:'back',a,r,sel:0,hits:[],done:res};ban.hidden=true});
 if(keep===0){
  // the agent comes back into the recruit's seat; the recruit goes to the roster with everything they've earned
  const out=carry(r);const i=R.findIndex(y=>y.id===out.id);const cp=JSON.parse(JSON.stringify(out));if(i>=0)R[i]=cp;else R.unshift(cp);
  delete a.sab;const m=fillMember(member(a));gearOf(m);kitUp(m,false);party[ri]=m;
  castFor(m);await hPlay(HT.sabBack,m)}
 else delete a.sab;
 store.set(B.key('roster'),R);
}

// ---- Bonds at 0: the last scene, then the slot empties (a Bond breaking is a Severe helplessness horror) ----
async function brokenBonds(m){
 const a=m.a;bondFold(a);
 for(let j=(a.bonds||[]).length-1;j>=0;j--){const b=a.bonds[j];if((b.score|0)>0)continue;
  castFor(m);setBg(HTYPE(b.rel),true,'broken');await hPlay(((HT.fr[HTYPE(b.rel)]||HT.fr.friend).broken),m,{B:b.name});setBg();
  a.bonds.splice(j,1);await horror({tier:'severe',kind:'helplessness',label:fillT(HT.arcBondBad,{B:b.name,A:m.name})},{who:[m]})}
}

// ---- personal arc beats: after the 1st, 3rd and 5th case survived this season (Personal arcs) ----
function arcOf(m){const a=m.a,main=(a.motives||[])[a.main|0];if(!main)return null;
 // a first arc counts from the season's start; a Main changed since starts its arc fresh, counting from the next case
 if(!a.arc)a.arc={m:main,beat:0,ch:[],base:0};else if(a.arc.m!==main&&!a.arc.over)a.arc={m:main,beat:0,ch:[],base:a.sc|0};
 return a.arc.m===main?a.arc:null}
// who stars: the higher Bond (not broken); an arc that needs an adult skips a Kid; nobody fits: a stand-in
function arcCast(m,A){const a=m.a,bs=bondsOf(a).filter(x=>x.s>0&&!(A.adult&&x.b.rel==='Kid')).sort((p,q)=>q.s-p.s);
 const b1=bs[0]?bs[0].b.name:(a.arc.stand=a.arc.stand||pick(HT.stand)),b2=bs[1]?bs[1].b.name:'';
 const par=bondsOf(a).find(x=>x.b.rel==='Parent'&&x.s>0);const X=A.parent?(par?par.b.name:(a.arc.standX=a.arc.standX||pick(HT.stand))):'';
 return{B:b1,B2:b2,X,bond:bs[0]?bs[0].b:null,par:par?par.b:null}}
async function arcBeat(m){
 const a=m.a,arc=arcOf(m);if(!arc||arc.over||arc.beat>=3)return;
 const n=(a.sc|0)-(arc.base|0);if(![1,3,5].includes(n)||arc.at===n)return;arc.at=n;
 const A=HT.arcs[arc.m];if(!A)return;const cast=arcCast(m,A);castFor(m);setBg(cast.bond?HTYPE(cast.bond.rel):'home',true,'arc');
 if(arc.beat===0||arc.beat===1){
  const k=arc.beat===0?1:2;
  if(k===2)await hPlay(arc.ch[0]==='hold'?A.b2hold:A.b2slip,m,cast);
  await hPlay(A['b'+k],m,cast);
  const H=A['hold'+k],S=A['slip'+k];
  const i=await choose([fillT(H[0],cast),fillT(S[0],cast)],{title:arc.m.toUpperCase()});
  const c=i===1?'slip':'hold';arc.ch.push(c);arc.beat++;
  await hPlay((c==='hold'?H:S).slice(1),m,cast);
  if(c==='slip')arcSlip(m,arc,k);
 }else await arcEnd(m,arc,A,cast);
 setBg();checkpoint();
}
// Slip always pays something right now (+1 SAN that night), and some carry a cost the arc names
function arcSlip(m,arc,k){sanUp(m,1);
 if(arc.m==='Protect the innocent'&&k===1)m.a.osNext=(m.a.osNext|0)+1;
 if(arc.m==='Faith'&&k===2)m.a.acct=1;
 if(arc.m==='Money'&&k===1){const s=loadSeason();s.hidden.push({k:'statue',case:'arc',who:m.a.name});store.set(seasonKey(),s)}}
async function arcEnd(m,arc,A,cast){
 arc.beat=3;const good=arc.ch.filter(c=>c==='hold').length>=1&&!(arc.ch[0]==='slip'&&arc.ch[1]==='slip');
 if(arc.m==='Duty'&&arc.ch[1]==='hold')m.a.osNext=(m.a.osNext|0)+1;
 if(good){await hPlay(A.good,m,cast);arc.end='good';arc.perk=A.perk;
  const P=HW.perks[A.perk];HS.card={title:arc.m.toUpperCase(),sub:'',rows:[{l:fillT(HW.perk,{p:P[0]}),chip:'★'},{l:P[1]}]};
  if(arc.ch.includes('slip')&&cast.bond){const b=cast.bond,n=Math.min(roll(1,4),Math.max(0,(b.score|0)-1));b.score-=n;HS.card.rows.push({l:fillT(HT.arcCost,{B:b.name,n})})}
  await say('',fillT(HT.arcGood,{p:P[0]}));HS.card=null}
 else{await hPlay(A.bad,m,cast);arc.end='bad';await arcBad(m,A,cast)}
}
async function arcBad(m,A,cast){
 const bond=A.parent?cast.par:cast.bond;
 if(A.badBond&&bond){bond.score=0;await brokenBonds(m);return}
 const has=k=>(m.dis||[]).some(d=>d.k===k),k=[A.dis||'depression','sleep','depression','paranoia','ptsd'].find(x=>!has(x));if(!k)return;
 m.dis=m.dis||[];m.dis.push({k});await say('',fillT(BLS.DISORDERS[k].gain,{n:m.name,s:''}))}
// Shield link (field.js calls it): giving up the Main at a Breaking Point plays the short bad finale; the arc is over
async function arcShield(m,mot){
 const a=m.a;if(!a.arc||a.arc.m!==mot||a.arc.beat>=3)return;const A=HT.arcs[mot];if(!A)return;
 const cast=arcCast(m,A);await hPlay(A.shield,m,cast);a.arc.beat=3;a.arc.end='bad';a.arc.over=1;await arcBad(m,A,cast);await say('',fillT(HT.arcEnds,{A:m.name}))}

// ================= ONE AGENT'S PICK =================
// returns true when the agent has picked and their scene has played; false to show the list again
function homePick(i){return new Promise(res=>{const m=party[i];if(!m||m.gone){res(true);return}bondFold(m.a);setBg();
 SCR={kind:'home',v:'list',i,sel:0,top:0,hits:[],done:res};ban.hidden=true})}
// the nine rows for this agent, with odds, tags and why a row is greyed (Odds on home scenes)
function homeRows(m){
 const a=m.a,bs=bondsOf(a).filter(x=>x.s>0),payer=bs.some(x=>x.s>1),san=clamp(m.san,1,99),T=therapistFor(m),out=[];
 const untrained=Object.keys(B.SKILLS).filter(k=>skillVal(a,k)<=10);
 HW.rows.forEach(r=>{let dis='',odds='';
  if(r.k==='fr'){odds=`SAN ${san}%`;if(!bs.length)dis=HW.noBondAny}
  if(r.k==='nature'){odds=`SAN ${san}%`;if(!payer)dis=HW.noBond}
  if(r.k==='mot'){odds=`SAN ${san}%`}
  if(r.k==='therapy'){odds=T?`${T.name} ${Math.max(san,chanceOf(T,'Empathy'))}%`:`SAN ${san}%`}
  if(r.k==='train'){if(!untrained.length)dis=HW.noUntrained;else if(!payer)dis=HW.noBond}
  if(r.k==='use'&&!(m.dis||[]).some(d=>d.k==='addiction'))return;  // Use only shows with Addiction
  if(r.k==='bond'&&(a.bonds||[]).length>=2)dis=HW.noSlot;
  out.push(Object.assign({},r,{dis,odds}))});
 return out}
async function homeAct(m,r){
 const f={fr:actFR,nature:actNature,mot:actMot,therapy:actTherapy,skill:actSkill,train:actTrain,sab:actSab,use:actUse,bond:actBond}[r.k];
 return f?await f(m,r):false}

// ---- the Bond picker (mockup screen 2): WHO TO SEE? or WHO PAYS? ----
function pickBond(m,pay,r){return new Promise(res=>{const all=bondsOf(m.a).filter(x=>x.s>0);if(!all.length){res(null);return}
 const sel=Math.max(0,all.findIndex(x=>!pay||x.s>1));SCR={kind:'home',v:'bond',m,pay,r,sel,hits:[],done:res}})}

// ---- the scene's result card (mockup screen 4) and the closing box ----
async function result(m,choice,rows,line,o={}){
 HS.card={title:`${HW.title} · ${m.name.toUpperCase()}`,sub:choice,rows,mood:o.mood||null};
 await hPlay([line].flat(),m,o);HS.card=null;
 if(o.bond&&(o.bond.score|0)<=0)await brokenBonds(m);  // a Bond at 0: its last scene right after the card
}
function sanRow(x,p,who){return{l:who?fillT(HW.empRoll,{t:who,p}):fillT(HW.sanRoll,{p}),chip:StudioChip.die(100,x.r),res:rollWord(x),col:x.ok?PC.gold:PC.pink}}
function moodChange(b,before,cha){const m0=moodOf(before,cha),m1=moodOf(b.score|0,cha);return m0===m1?null:{from:m0,to:m1,up:(b.score|0)>before}}

// ---- the nine choices ----
async function actFR(m,r){
 const x0=await pickBond(m,false,r);if(!x0)return false;const b=x0.b,cha=chaOf(m.a),before=b.score|0,mood=moodOf(before,cha);
 castFor(m);setBg(HTYPE(b.rel),mood!=='close');const o={B:b.name,bond:b};
 await hPlay((HT.fr[HTYPE(b.rel)]||HT.fr.friend)[mood],m,o);
 const p=clamp(m.san,1,99),x=SR.pct(p),rows=[sanRow(x,p)];
 if(x.ok){const g=roll(1,6);b.score=Math.min(cha,before+g);rows.push({l:fillT(HW.bondUp,{b:b.name,x:before,y:b.score}),chip:StudioChip.die(6,g)});
  if(x.crit){const [s0,s1]=sanUp(m,1);rows.push({l:fillT(HW.sanUp,{a:s0,b:s1}),chip:'+1'})}}
 else if(x.fumble){const g=roll(1,4);b.score=Math.max(0,before-g);rows.push({l:fillT(HW.bondUp,{b:b.name,x:before,y:b.score}),chip:StudioChip.die(4,g)});const [s0,s1]=await sanDown(m,1);rows.push({l:fillT(HW.sanUp,{a:s0,b:s1}),chip:'−1'})}
 const O=HT.frOut[mood]||HT.frOut.close,line=x.ok?(x.crit?O.crit:O.ok):x.fumble?O.fumble:HT.frOut.fail;
 await result(m,r.name,rows,line,Object.assign(o,{mood:moodChange(b,before,cha)}));return true}
async function actNature(m,r){
 const x0=await pickBond(m,true,r);if(!x0)return false;const b=x0.b,cha=chaOf(m.a),before=b.score|0;
 castFor(m);setBg('nature');const a=m.a;a.nat=Array.isArray(a.nat)&&a.nat.length<HT.nature.length?a.nat:[];
 const left=HT.nature.map((v,i)=>i).filter(i=>!a.nat.includes(i)),vi=pick(left);a.nat.push(vi);
 b.score=before-1;await hPlay(HT.nature[vi],m);await hPlay(HT.natureCost,m,{B:b.name});
 const p=clamp(m.san,1,99),x=SR.pct(p),rows=[{l:fillT(HW.bondUp,{b:b.name,x:before,y:b.score}),chip:'−1'},sanRow(x,p)];
 if(x.ok){const g=x.crit?4:roll(1,4),[s0,s1]=sanUp(m,g);rows.push({l:fillT(HW.sanUp,{a:s0,b:s1}),chip:x.crit?'+4':StudioChip.die(4,g)})}
 else if(x.fumble){const g=roll(1,4),[s0,s1]=await sanDown(m,g);rows.push({l:fillT(HW.sanUp,{a:s0,b:s1}),chip:StudioChip.die(4,g)})}
 const O=HT.natureOut;await result(m,r.name,rows,x.ok?(x.crit?O.crit:O.ok):x.fumble?O.fumble:O.fail,{mood:moodChange(b,before,cha),bond:b});return true}
async function actMot(m,r){
 const a=m.a,mots=a.motives||[],free=BLS.MOTIVES.filter(k=>!mots.includes(k));
 const opts=mots.map(k=>({label:fillT(HW.pursue,{m:k}),k:'p',m:k}));
 if(mots.length<2)opts.push({label:HW.replace,k:'r'});if(mots.length)opts.push({label:HW.swap,k:'s'});
 const c=await choose(opts,{cancel:true,title:HW.motT});if(c<0)return false;const o=opts[c];castFor(m);setBg(BLHA.motPlace(o.m||mots[a.main|0]),true);
 if(o.k==='p'){await hPlay(HT.pursue[o.m]||HT.pursue.Duty,m);const p=clamp(m.san,1,99),x=SR.pct(p),rows=[sanRow(x,p)];
  if(x.ok){const g=x.crit?2:roll(1,2),[s0,s1]=sanUp(m,g);rows.push({l:fillT(HW.sanUp,{a:s0,b:s1}),chip:x.crit?'+2':StudioChip.die(2,g)})}
  const O=HT.pursueOut;await result(m,r.name,rows,x.ok?(x.crit?O.crit:O.ok):O.fail);return true}
 let which=-1;
 if(o.k==='s'){which=await choose(mots,{cancel:true,title:HW.whichSwap});if(which<0)return false;
  if(which===(a.main|0)){const ok=await choose([HW.yes,HW.no],{cancel:true,title:fillT(HW.swapSure,{n:m.name})});if(ok!==0)return false}}
 const n=await choose(free,{cancel:true,title:HW.newMot});if(n<0)return false;
 const wasMain=which>=0&&which===(a.main|0)||!mots.length;
 if(which>=0)mots[which]=free[n];else mots.push(free[n]);a.motives=mots;
 if(mots.length>1){const mi=await choose(mots,{title:HW.mainQ});a.main=mi<0?(a.main|0):mi}else a.main=0;
 setBg(BLHA.motPlace(free[n]),true);await hPlay(HT.newMot,m);
 // a new or swapped Main ends the old arc with no payoff; the new arc starts at beat 1 and counts from the next case
 if(wasMain||(a.arc&&a.arc.m!==mots[a.main])){if(a.arc&&a.arc.beat<3&&a.arc.m!==mots[a.main])await hPlay(HT.newMain,m);a.arc={m:mots[a.main],beat:0,ch:[],base:a.sc|0}}
 await result(m,r.name,[{l:`${HW.newMot}: ${free[n]}`,chip:'✓'}],`[${free[n]}]`);return true}
async function actUse(m,r){
 castFor(m);setBg('use',true);const a=m.a;await hPlay(pick(HT.use),m);
 const bs=bondsOf(a).filter(x=>x.s>0),x=bs.length?pick(bs):null,rows=[];
 if(x){const before=x.b.score|0,g=roll(1,4);x.b.score=Math.max(0,before-g);await hPlay(HT.useCost,m,{B:x.b.name});rows.push({l:fillT(HW.bondUp,{b:x.b.name,x:before,y:x.b.score}),chip:StudioChip.die(4,g)})}
 const [s0,s1]=await sanDown(m,1);rows.push({l:fillT(HW.sanUp,{a:s0,b:s1}),chip:'−1'});a.noWD=1;
 await result(m,r.name,rows,HW.rows.find(q=>q.k==='use').line,{bond:x&&x.b});return true}
async function actBond(m,r){
 const t=await choose(BLS.RELS,{cancel:true,title:HW.typeT});if(t<0)return false;
 const names=BLS.FIRST.slice().sort(()=>Math.random()-.5).slice(0,4),n=await choose([...names,HW.typeName],{cancel:true,title:HW.nameT});if(n<0)return false;
 let name=names[n];if(n===names.length){let v=null;try{v=window.prompt(HW.namePrompt,names[0])}catch(e){}name=String(v||names[0]).trim().slice(0,14)||names[0]}
 const a=m.a,b={rel:BLS.RELS[t],name,score:Math.ceil(chaOf(a)/2)};a.bonds=a.bonds||[];a.bonds.push(b);bondLook(b);
 castFor(m);setBg(HTYPE(b.rel));await hPlay(HT.newBond[HTYPE(b.rel)]||[],m,{B:name});
 await result(m,r.name,[{l:`${name} · ${b.rel}`,chip:`${b.score}/${chaOf(a)}`}],`[New Bond: ${name}]`);return true}
async function actTherapy(m,r){
 const a=m.a,ds=m.dis||[],opts=[{label:HW.therSan}].concat(ds.map(d=>({label:fillT(HW.therDis,{d:BLS.DISORDERS[d.k].name,k:((a.ther||{})[d.k]|0)+1})})));
 const c=await choose(opts,{cancel:true,title:HW.therT});if(c<0)return false;const T=therapistFor(m);castFor(m);setBg('therapy');
 await hPlay(T?HT.therParty:HT.therOpen,m,{T:T?T.name:''});
 if(c===0){await hPlay(HT.therSan,m);const ps=clamp(m.san,1,99),pe=T?chanceOf(T,'Empathy'):0,useT=pe>ps,p=useT?pe:ps,x=SR.pct(p),rows=[sanRow(x,p,useT?T.name:null)];
  if(x.ok){const g=x.crit?4:roll(1,4),[s0,s1]=sanUp(m,g);rows.push({l:fillT(HW.sanUp,{a:s0,b:s1}),chip:x.crit?'+4':StudioChip.die(4,g)})}
  else if(x.fumble)a.noReq=1;  // Big Hat refuses this agent's requisition at the next briefing
  const O=HT.therOut;await result(m,r.name,rows,O[outKey(x)]);return true}
 const d=ds[c-1];a.ther=a.ther||{};a.ther[d.k]=(a.ther[d.k]|0)+1;const k=a.ther[d.k],nm=BLS.DISORDERS[d.k].name;
 await hPlay(HT.therDis[Math.min(2,k-1)],m,{D:nm});
 if(k>=3){m.dis=ds.filter(x=>x!==d);delete a.ther[d.k];await result(m,r.name,[{l:fillT(HW.cured,{d:nm}),chip:'3/3'}],`[${nm} cured]`);return true}
 await result(m,r.name,[{l:nm,chip:`${k} of 3`}],HT.therDis[k-1].slice(-1)[0]);return true}
async function actSkill(m,r){
 const a=m.a,ks=Object.keys(B.SKILLS),c=await choose(ks.map(k=>`${k} · ${skillVal(a,k)}%`),{cancel:true,title:HW.skillT});if(c<0)return false;
 const k=ks[c];castFor(m);setBg(BLHA.skillPlace(k));await hPlay(HT.skill[k]||'',m,{SKILL:k});
 const old=skillVal(a,k),g=roll(1,6),up=Math.max(0,Math.min(g,99-old));a.grow=a.grow||{};a.grow[k]=(a.grow[k]||0)+up;const nw=skillVal(a,k),t=[40,75,90].findIndex(t=>old<t&&nw>=t);
 const rows=[{l:fillT(HW.skillUp,{k,x:old,y:nw}),chip:StudioChip.die(6,g)}];if(t>=0)rows.push({l:fillT(BLS.DEBRIEF.newUnlock,{u:BLS.UNLOCKS[k][t].toUpperCase()}),star:1});
 await result(m,r.name,rows,`[${k} +${up}%]`);return true}
async function actTrain(m,r){
 const a=m.a,ks=Object.keys(B.SKILLS).filter(k=>skillVal(a,k)<=10),c=await choose(ks,{cancel:true,title:HW.trainT});if(c<0)return false;
 const x0=await pickBond(m,true,r);if(!x0)return false;const b=x0.b,cha=chaOf(a),before=b.score|0,k=ks[c];
 castFor(m);setBg(BLHA.skillPlace(k));await hPlay(HT.skill[k]||'',m);await hPlay(HT.train,m,{B:b.name});
 const old=skillVal(a,k);a.grow=a.grow||{};a.grow[k]=(a.grow[k]||0)+(30-old);b.score=before-1;
 await result(m,r.name,[{l:fillT(HW.skillUp,{k,x:old,y:skillVal(a,k)}),chip:'30%'},{l:fillT(HW.bondUp,{b:b.name,x:before,y:b.score}),chip:'−1'}],`[${k} now 30%, ${b.name} −1]`,{mood:moodChange(b,before,cha)});return true}
// Sabbatical: 1–3 cases, Can't be undone, then the recruit takes the seat and the agent waits in the roster
async function actSab(m,r){
 const n=await choose(HW.sabN,{cancel:true,title:HW.sabT});if(n<0)return false;
 const ok=await choose([HW.yes,HW.no],{cancel:true,title:fillT(HW.sabSure,{n:m.name,k:HW.sabN[n]})});if(ok!==0)return false;
 castFor(m);setBg('sab');await hPlay(HT.sabIn,m);
 const i=party.indexOf(m),before=party.length;G.fs.recruit=G.fs.recruit||[];G.fs.recruit.push(m.a.prof);await offerRecruit({ask:HW.sabRecruit,late:true});
 const rec=party.length>before?party.pop():null;if(!rec){return true}
 const a=carry(m);a.sab={left:n+1,seat:i,cover:rec.a.id,sat:0};const R=B.S.roster||(B.S.roster=[]);const j=R.findIndex(y=>y.id===a.id);const cp=JSON.parse(JSON.stringify(a));if(j>=0)R[j]=cp;else R.unshift(cp);store.set(B.key('roster'),R);
 party[i]=rec;rec.picked=1;if((G.lead|0)===i)G.lead=i;
 HS.card={title:`${HW.title} · ${m.name.toUpperCase()}`,sub:r.name,rows:[{l:fillT(HW.sabTag,{k:HW.sabN[n]}),chip:'✓'},{l:`${rec.name} · ${(profOf(rec.a)||{}).name||''}`}]};
 await say('',HT.sabIn[1]);HS.card=null;return true}

// ================= DRAWING =================
// the backdrop for the scene (home-art.js): a Bond type's room or a place, night or not, with its dressing.
// 'home' is the agent's own living room (the Partner backdrop), for scenes with no Bond and no place of their own.
function drawHome(){
 BLHA.draw(cx,HS.bg==='home'||!BLHA.has(HS.bg)?'partner':HS.bg,VW,VH,{night:HS.night,dress:HS.dress});
 if(HS.card)drawHomeCard();
}
function drawHomeCard(){
 const c=HS.card;cx.fillStyle='rgba(10,8,18,.55)';cx.fillRect(0,0,VW,VH);
 const rows=c.rows||[],h=22+rows.length*12+(c.mood?13:0)+4;pBox(4,4,232,h,PC.navy,PC.cream);
 pT(c.title,10,8,PC.gold,7,PXf);if(c.sub){const s=pFit(c.sub,110,13);pT(s,230-pW(s,13),4,PC.lav,13)}
 let y=19;rows.forEach(r=>{if(r.star){const w=pW(r.l,12)+6;pR(10,y+1,w,10,PC.mus);pT(r.l,13,y,PC.navy,12)}else pT(pFit(r.l,150,14),10,y-1,PC.cream,14);
  let rx=229;if(r.res){rx-=pW(r.res,13);pT(r.res,rx,y-1,r.col||PC.gold,13);rx-=4}
  if(r.chip){const o={font:VTf(12),pad:3,h:10,fill:PC.deep,ink:'#3ff0e8',line:'#2a6a7a'};const w=StudioChip.width(cx,r.chip,o);StudioChip.draw(cx,rx-w,y+1,r.chip,o)}y+=12});
 if(c.mood){const M=c.mood,a=HW.moods[M.from],b=HW.moods[M.to];let x=10;const chip=(t,col)=>{const w=pW(t,6,PXf)+6;pBox(x,y+1,w,10,PC.deep,col);pT(t,x+3,y+3,col,6,PXf);x+=w+4};
  chip(a,MOODCOL[M.from]);pT('→',x,y-1,PC.lav,13);x+=10;chip(b,MOODCOL[M.to]);pT(pFit(M.to==='broken'?'':M.up?HW.moodUp:HW.moodDown,230-x,12),x,y,PC.lav,12)}
}
// ---- the home list (mockup screen 1) ----
function drawHomeList(){
 const s=SCR,m=party[s.i],rows=homeRows(m);s.sel=clamp(s.sel,0,rows.length-1);s.hits=[];
 pR(0,0,VW,VH,PC.navy);pBox(4,4,232,18,PC.deep,PC.cream);pT(HW.title,10,9,PC.gold,8,PXf);pT(HW.hint,230-pW(HW.hint,14),5,PC.lav,14);
 // the team strip: faces, names and each one's state
 const n=party.length,cw=(232-(n-1)*3)/n,sy=25,sh=40,H=G.db.home;
 party.forEach((p,k)=>{const x=4+k*(cw+3),on=k===s.i;pBox(x,sy,cw,sh,on?PC.cardOn:PC.card,on?PC.gold:PC.dim);
  pR(x+cw/2-9,sy+2,18,18,PC.plum);cx.drawImage(faceOf(p.a,1),x+cw/2-8,sy+3,16,16);
  const nm=pFit(p.name.toUpperCase(),cw-4,12);pT(nm,x+(cw-pW(nm,12))/2,sy+20,on?PC.gold:PC.cream,12);
  const st=k<s.i?(H.picks[k]||'—'):k===s.i?HW.choosing:HW.waiting,stt=pFit(st,cw-4,11);pT(stt,x+(cw-pW(stt,11))/2,sy+29,k<s.i?'#3ff0e8':on?PC.gold:PC.lav,11);
  if(k<s.i)pT('✓',x+cw-9,sy,'#3ff0e8',11)});
 // the rows
 const detH=Math.min(56,Math.max(40,VH-sy-sh-4-rows.length*16-6)),top=sy+sh+4,RH=Math.max(13,Math.min(16,Math.floor((VH-top-detH-6)/rows.length)));
 rows.forEach((r,k)=>{const y=top+k*RH,on=k===s.sel;pBox(4,y,232,RH-2,on?PC.cardOn:PC.card,on?PC.gold:PC.dim);if(on)pT('▶',6,y-2,PC.gold,14);
  pT(pFit(r.name,r.odds&&!r.dis?128:160,14),16,y-2,r.dis?PC.dim:on?PC.gold:PC.cream,14);
  const tag=r.dis||r.tag,tw=pW(tag,5,PXf)+6,tc=r.dis?PC.dim:/BOND|NO WD/.test(tag)&&r.k!=='fr'&&r.k!=='bond'?PC.mus:'#3ff0e8';pBox(229-tw,y+1,tw,RH-5,PC.deep,tc);pT(tag,232-tw,y+(RH-8)/2-1,tc,5,PXf);
  if(r.odds&&!r.dis){const o=pFit(r.odds,70,11);pT(o,226-tw-pW(o,11),y,PC.lav,11)}
  s.hits.push({x:4,y,w:232,h:RH-2,fn:()=>{if(s.sel===k)homePress('a');else s.sel=k}})});
 const dy=top+rows.length*RH+2,r=rows[s.sel];pBox(4,dy,232,VH-dy-3,PC.deep,PC.cream,2);
 if(r){const L=[[r.line,PC.cream],[r.roll,PC.lav],[HW.keysFirst,PC.dim]];const out=[];L.forEach(([t,c])=>pWrap(t,220,13,3).forEach(l=>out.push([l,c])));
  out.slice(0,Math.floor((VH-dy-7)/11)).forEach(([t,c],k)=>pT(t,10,dy+2+k*11,c,13))}
}
// ---- the Bond picker (mockup screen 2) ----
function drawBondPick(){
 const s=SCR,m=s.m,a=m.a,all=bondsOf(a).filter(x=>x.s>0);s.sel=clamp(s.sel,0,all.length-1);s.hits=[];
 pR(0,0,VW,VH,PC.navy);pBox(4,4,232,18,PC.deep,PC.cream);const t=s.pay?HW.pays:HW.see;pT(t,10,9,PC.gold,8,PXf);const sub=pFit(s.r.name,110,13);pT(sub,230-pW(sub,13),5,PC.lav,13);
 pR(8,26,12,12,PC.plum);cx.drawImage(faceOf(a,1),8,26,12,12);pT(`${m.name.toUpperCase()} · ${fillT(HW.cha,{c:chaOf(a),s:m.san})}`,24,25,PC.cream,14);
 let y=42;all.forEach((x,k)=>{const on=k===s.sel,dis=s.pay&&x.s<=1,bh=46;pBox(4,y,232,bh,on?PC.cardOn:PC.card,on?PC.gold:PC.dim);
  const f=bondFace(a,x.b);pR(8,y+4,38,38,PC.plum);cx.drawImage(f,9,y+5,36,36);
  if(on)pT('▶',50,y,PC.gold,15);pT(pFit(String(x.b.name).toUpperCase(),110,16),60,y,dis?PC.dim:PC.gold,16);
  const mw=pW(HW.moods[x.mood],5,PXf)+6;pBox(229-mw,y+4,mw,10,PC.deep,MOODCOL[x.mood]);pT(HW.moods[x.mood],232-mw,y+6,MOODCOL[x.mood],5,PXf);
  pT(x.b.rel,60,y+13,PC.lav,12);
  const bx=60,bw=166;pR(bx,y+27,bw,5,PC.dark);pR(bx+1,y+28,Math.round((bw-2)*x.s/x.cha),3,MOODCOL[x.mood]);[1/3,2/3].forEach(f=>pR(bx+Math.round(bw*f),y+25,1,9,PC.cream));
  pT(fillT(HW.bondLine,{s:x.s,c:x.cha}),60,y+33,PC.lav,12);
  s.hits.push({x:4,y,w:232,h:bh,fn:()=>{if(s.sel===k)homePress('a');else s.sel=k}});y+=bh+3});
 const x=all[s.sel],dh=Math.max(36,VH-y-3);pBox(4,y,232,dh,PC.deep,PC.cream,2);
 if(x){const L=[[fillT(HW.moodLine[x.mood]||'',{b:x.b.name,n:m.name}),PC.cream],[s.r.roll,PC.lav],[s.pay&&x.s<=1?HW.noBond:s.pay?HW.payKeys:HW.bondKeys,PC.dim]];const out=[];L.forEach(([t,c])=>pWrap(t,220,13,3).forEach(l=>out.push([l,c])));
  out.slice(0,Math.floor((dh-4)/11)).forEach(([t,c],k)=>pT(t,10,y+2+k*11,c,13))}
}
// ---- BACK FROM SABBATICAL: the agent and the recruit side by side ----
function drawBack(){
 const s=SCR;s.hits=[];pR(0,0,VW,VH,PC.navy);pBox(4,4,232,18,PC.deep,PC.cream);pT(HW.back,10,9,PC.gold,7,PXf);
 pT(HW.backQ,8,26,PC.cream,15);
 const cards=[[s.a,firstName(s.a),(s.a.cur&&s.a.cur.san)??s.a.stats.POW*5,''],[s.r.a,s.r.name,s.r.san,fillT(HW.recruitCases,{k:s.r.a.cases|0})]];
 cards.forEach(([a,nm,san,ex],k)=>{const x=4+k*118,on=k===s.sel;pBox(x,44,114,110,on?PC.cardOn:PC.card,on?PC.gold:PC.dim,on?2:1);
  pR(x+25,50,66,66,PC.plum);cx.drawImage(faceOf(a,2),x+26,51);
  pT(pFit(String(nm).toUpperCase(),104,15),x+6,118,on?PC.gold:PC.cream,15);pT(pFit((profOf(a)||{}).name||'',104,12),x+6,130,PC.lav,12);
  pT(`SAN ${san}${ex?' · '+ex:''}`,x+6,141,PC.lav,12);s.hits.push({x,y:44,w:114,h:110,fn:()=>{if(s.sel===k)homePress('a');else s.sel=k}})});
 pT(HW.backKeys,8,160,PC.dim,13);
}
function homeDraw(){const v=SCR.v;if(v==='list')drawHomeList();else if(v==='bond')drawBondPick();else if(v==='back')drawBack()}
function homePress(k){
 const s=SCR;if(!s||s.lock)return;
 if(s.v==='list'){const m=party[s.i],rows=homeRows(m),n=rows.length;
  if(k==='up')s.sel=(s.sel-1+n)%n;else if(k==='down')s.sel=(s.sel+1)%n;
  else if(k==='a'){const r=rows[s.sel];if(!r||r.dis)return;const done=s.done,i=s.i;SCR=null;
   run(async()=>{const ok=await homeAct(m,r);setBg();if(ok){G.db.home.picks[i]=r.name;done(true)}else{SCR={kind:'home',v:'list',i,sel:s.sel,hits:[],done}}})}
  return}
 if(s.v==='bond'){const all=bondsOf(s.m.a).filter(x=>x.s>0),n=all.length;
  if(k==='up')s.sel=(s.sel-1+n)%n;else if(k==='down')s.sel=(s.sel+1)%n;
  else if(k==='b'){SCR=null;s.done(null)}else if(k==='a'){const x=all[s.sel];if(s.pay&&x.s<=1)return;SCR=null;s.done(x)}return}
 if(s.v==='back'){if(k==='left'||k==='right')s.sel=1-s.sel;
  else if(k==='a'){s.lock=1;run(async()=>{const nm=s.sel?s.r.name:firstName(s.a),o=s.sel?firstName(s.a):s.r.name;
   const ok=await choose([HW.yes,HW.no],{cancel:true,title:fillT(HW.backSure,{n:nm,o})});s.lock=0;if(ok===0){SCR=null;s.done(s.sel)}})}}
}
