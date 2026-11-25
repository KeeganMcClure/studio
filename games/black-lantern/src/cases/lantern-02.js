// Black Lantern · cases/lantern-02.js
// CASE: LANTERN 02, the second agency case (specs 014 and 015). SPOILERS for the case live in story/cases/lantern-02.md only.
// Parts A and B (Nov 25, 2026), built in one go: the black folder card, every map by day and night, the townsfolk on the
// map and in the dialog box, Big Hat's own briefing place, and the story and play written from the secret case file: the
// text block, the briefing's four topics and their edges, seven short days with a page a day, a deduction on the kitchen
// phone, the day turns (Go on / Not yet), overstepping (a quiet case), two story fights, the last night's roamers, a
// Lantern Box, the boss and its tuning, the ending choice, the dawn, the debrief's facts and cover stories, and the endings.
// The unlock scene's lines live in seasons/season-1.js (spec 009).
// Art is cases/lantern-02-art.js (window.L02A, the maps and people) and cases/lantern-02-battle-art.js (window.L02B, the
// enemies, the boss's face and the battle backdrops), loaded right after this file. Needs engine.js, field.js and
// battle.js first. The whole file sits in one function so its names never meet another case's.
(function(){

// ================= TEXT =================
// Every line of the case (Voice). A list plays box by box: a plain string is narration, ['WHO', 'line'] is someone
// talking. {code} and {first} are the lead's, with pronoun tokens like {first.they} (Agent creator, Pronouns and body);
// {n}, {d} and the other one-letter keys are filled by the script (agents' names go through fillT, so their pronouns follow).
const TEXT={
 next:{read:'Day {d}. Today\'s page is waiting on the parlor desk at 9 Orchard Row.',key:'Get the key from Marit Sundby at the gate of 9 Orchard Row.',
  town:'Day {d}. Ask around Corley Falls. Sleep on it in the guest bed upstairs.',phone:'Day 5. The kitchen phone is going to ring. Answer it.',
  dusk:'Day 7. Wait for dark at the parlor window.',night3:'The third night. Something\'s up in the parlor. Then back to bed.',
  night:'The seventh night. Upstairs, the hall goes on longer than the house does.',home:'Get home.'},
 phase:['DAY 1 · MONDAY · THAW','DAY 2 · TUESDAY · THAW','DAY 3 · WEDNESDAY · SLEET','DAY 4 · THURSDAY · THAW','DAY 5 · FRIDAY · FOG','DAY 6 · SATURDAY · THAW','DAY 7 · SUNDAY · CLEAR'],
 night3Banner:'THE THIRD NIGHT · 3:10 AM',night7Banner:'THE SEVENTH NIGHT',
 // ---- the briefing, in an ice house on Lake Tamarack ----
 open1:'SUNDAY · 7:15 PM · 29°F · LAKE TAMARACK',
 open2:'A text from an unlisted number: "LAKE TAMARACK. GREEN ICE HOUSE, NO. 14. KNOCK TWICE. DON\'T STEP ON THE CRACK."',
 brief:['An ice-fishing house a quarter mile out on a frozen lake. Plywood walls, a propane heater going orange, a hole in the floor full of black water.',
  ['BIG HAT','Agent {code}. Shut the door. Heat\'s on.'],'He\'s on a bucket by the hole, jigging a line. He has not caught anything. He has the air of a man who has not caught anything for years.',
  ['BIG HAT','Agnes Lindqvist. Corley Falls, Minnesota. Died in November, seventy-one, in her front hall.'],
  ['BIG HAT','She left a will. The will leaves her house to her sister and her diary to "the people with the lantern."'],
  ['BIG HAT','The lawyer looked us up. We\'re not in the book. We\'re not in any book. The lawyer mailed it anyway, to an address nobody\'s supposed to have.'],
  ['BIG HAT','It got to me.']],
 briefShout:'NOBODY OUTSIDE THIS OUTFIT KNOWS OUR NAME.',
 brief1b:['The line twitches. He looks at it. It stops.'],
 // Big Hat's two questions (spec 013): the four topics, his two-box answer, the Case file's INTEL line. The edges are in
 // the scripts: 'agnes' +10 Empathy and Persuade with Bev, 'letter' +10 History and Bureaucracy at the parish register,
 // 'town' Father Tom tells you about the blessing with no roll, 'nights' the lantern's light reaches farther at night.
 intel:[
  {id:'agnes',label:'Agnes',answer:['School librarian forty years. Widow. Husband Arne went in \'19.','Best friend runs the cafe on Main. Bev. Fifty years of coffee. Be good to her.'],
   note:'Agnes\'s best friend is Bev, at the cafe on Main. Be good to her.'},
  {id:'letter',label:'The letter',answer:['Lawyer\'s a notary. Marit Sundby. She\'s got the key.','If you want to know a woman\'s hand, the church keeps the parish books. Marriages. Baptisms. Signatures.'],
   note:'St. Bridget\'s keeps the parish books, with signatures in them.'},
  {id:'town',label:'The town',answer:['Corley Falls. Twelve hundred people and a waterfall.','Priest there is Tom Kessler. Played goalie at Duluth before God got him. Tell him Hat says hello. He\'ll talk.'],
   note:'Father Tom Kessler at St. Bridget\'s knows the name Hat. He\'ll talk.'},
  {id:'nights',label:'The nights',answer:['Dark by six up there. Darker than here.','I put a new mantle in your lantern. You\'ll see farther.'],
   note:'Nights up north are long. Your lantern reaches farther.'}],
 brief2:[['BIG HAT','You go in quiet. You\'re appraisers from the Cities. The sister\'s selling.'],
  ['BIG HAT','Read the diary. Read all of it. Find out how a dead librarian got our name.']],
 brief3:[['BIG HAT','One more thing. Lawyer says the diary\'s seven days long.'],['BIG HAT','Lawyer says nobody\'s finished it.'],
  'He pulls up the line. Nothing on the hook. He puts it back down the hole anyway.'],
 arrive:'LANTERN 02. Talk to people with A. Press START for your notebook and party.',
 role:{Investigator:'A diary\'s just a witness that can\'t lie to you twice.',Healer:'Seventy-one, in her front hall. I want to see the coroner\'s sheet.',
  Analyst:'Twelve hundred people. Four churches. One stoplight. It blinks.',Vanguard:'Appraisers. Fine. I\'ll appraise.',Lorekeeper:'A house that names its own heirs. I\'ve read about this. It never ends with the house sold.',
  Tech:'No cell bars. Not one. On Main Street.',Bruiser:'It\'s March. Why is it still snowing. Who decided this.',Support:'Everybody hat. Everybody gloves. I packed extra gloves.',
  Tracker:'Thaw\'s on. Every print in town is a puddle by noon.',Confessor:'Nobody leaves their diary to strangers unless they need it read out loud.',
  Courier:'I delivered up here once. The dogs follow the truck to the county line and stop. Every one.',Undertaker:'Front hall. You don\'t die in a front hall. You die in a bed or a car.',
  Scrapper:'My grandma\'s from up here. She said you never say a house is pretty out loud.',Morale:'There\'s a cafe. There\'s pie. I can see the pie from here.'},
 roleAny:'Let\'s go read a dead woman\'s diary.',
 // ---- Main Street by day ----
 edgeEast:'Orchard Row ends at the tree line and a sign: DEAD END. Somebody\'s added, in marker, NO KIDDING.',
 leaveQ:'Drive out of Corley Falls?',leaveOpts:['Drive out','Not yet'],
 leave1:['You get the van as far as the county road. Every phone in the van rings at once.','Nobody has bars. They ring anyway.',['THE PHONE','"Aggie? Aggie, is that you? It\'s so cold, Aggie. Come home."'],
  'The line goes dead, the way a line goes dead when somebody puts a hand over it. Then all four tires go flat.'],
 leaveH:'A dead man on the phone, calling for his wife',
 leaveAgain:['You get to the county line. The tires go flat, all four, slow, like a sigh.','By the time you\'ve walked it back to Main Street, they\'re full again.'],
 leaveBus:['You wait for the bus. The schedule says the 9:09 to Duluth.','It doesn\'t come. A pickup goes by, slows down to look at you, speeds up.'],
 van:'The van. Rented in the Cities. All four tires look fine. The van looks like it\'s waiting for you to try.',
 shelter:'A bus shelter. The schedule behind the plastic lists one bus: 9:09 to Duluth. Somebody\'s scratched into the bench: IT DONT COME.',
 shelterWait:'Wait for the bus',
 realty:'SUNDBY REALTY & NOTARY. A sign on the glass: BACK IN 5 MIN. The sign has faded.',
 cafeFront:'BEV\'S FALLS CAFE. PIE · COFFEE · BAIT, the BAIT painted out but still showing through.',churchFront:'ST. BRIDGET\'S. Mass 9 and 11. Bingo Tuesdays. The bell tower has snow on one side.',
 rectoryFront:'The rectory. A shoveled path, a bird feeder, a doormat that says PEACE BE WITH YOU in letters worn down to PEA E W TH YOU.',
 houseFront:'9 ORCHARD ROW. A white house with green trim and every curtain drawn. The icicles on the porch are longer than the porch is high.',
 houseLocked:'Locked. Marit Sundby has the key.',
 churchShut:'St. Bridget\'s, locked. A sign: MASS CANCELED. PLEASE PRAY AT HOME.',churchNight:'The front doors are chained. The sheriff did that.',
 cafeShut:'CLOSED. BACK AT 6 AM. —BEV. Under it, smaller: GO HOME.',
 tape:'Sheriff\'s tape across the rectory door, yellow, wet. A deputy in a cruiser at the curb, eating something out of foil.',
 tapeAsk:'THE RECTORY',tapeDuck:'Duck under the tape',tapeCreds:'Show the deputy your credentials',tapeTalk:'Tell the deputy you\'re with the estate',
 tapeDuckDo:'You go under the tape. The deputy stops chewing.',tapeCredsDo:'You show him a card with a seal on it. He reads it twice and waves you in with the foil.',
 tapeTalkDo:['DEPUTY','"Estate. Huh. The sister\'s?" He shrugs. "Don\'t touch the bathroom. Touch everything else, I don\'t care."'],
 tapeFail:'The deputy gets out of the cruiser. You walk on like you meant to.',
 marit:'MARIT',
 marit1:[['MARIT','You\'re the appraisers. From the Cities. You look like the Cities.'],'A red parka, a clipboard, a smoker\'s cough. She stays on the sidewalk side of the gate like the gate is a line in a road.',
  ['MARIT','Key. Furnace works. Water\'s on. The sister wants it sold by May.']],
 maritKey:[['MARIT','I don\'t go in. Not since the reception. That\'s not a thing, it\'s just a me thing.'],['MARIT','It\'s a drafty old house, that\'s all.']],
 maritRead:'Look at her, not her clipboard',
 maritReadDo:[['MARIT','...At the reception there was a mirror in the hall. I was fixing my lipstick.'],['MARIT','Agnes was standing behind me. In the mirror. Not in the hall.'],['MARIT','I sold her that house in 1979. I know what she looked like. That was her, in her good blue dress.']],
 maritReadFail:'She checks something on the clipboard that doesn\'t need checking.',
 maritDays:[[['MARIT','Still standing? Good. Good. The sister called. She asked if you\'d "finished it" yet. I don\'t know what that means.']],
  [['MARIT','Phone rang at my house at three in the morning. Nobody. Just cold. You know what cold sounds like on the phone? I do now.']],
  [['MARIT','I\'ve got a buyer from Fargo. He wants to know about the windows. I don\'t know what to tell him about the windows.']],
  [['MARIT','I don\'t want to talk about Father Tom. I want to talk about square footage.']],
  [['MARIT','I\'m going to my daughter\'s in Brainerd tonight. I\'m not running. I\'m visiting.']]],
 maritNoticed:[['MARIT','I\'ve heard about you. Appraisers. Sure.']],
 sledkid:['A kid drags a sled down the sidewalk. There\'s nothing on the sled. It has a seatbelt, buckled.','"My brother," the kid says, about the sled, and keeps going.'],
 fisher:['An old man in a snowmobile suit sits on a bucket at the river\'s edge with a line through a hole in the shore ice.','"Ice goes out Thursday," he says. "Always goes out Thursday. You at Agnes\'s? She\'d bring me coffee."',
  '"She stopped. Then last week she was at her window again. Waving." He winds his line. "She\'s been dead since November."'],
 footbridge:'The footbridge ends where the ice starts. On the far bank, more Minnesota.',
 river:'The river\'s breaking up. Plates of gray ice go by, slow, turning, like they\'re looking for somebody.',
 falls:'The falls, half frozen. Water comes over the lip under a skin of ice and you can hear it, but you can\'t see it move.',
 // ---- Bev at the cafe ----
 bev1:[['BEV','Sit anywhere. Not there. That\'s Agnes\'s booth. Sit anywhere else.'],'She\'s doing the crossword in pen, out loud.',['BEV','Seven letters, "a place of rest." CASSEROLE. That fits. It doesn\'t fit. I\'m putting it in.']],
 bevHat:[['BEV','You\'re the ones she left it to.'],'It isn\'t a question. She puts down the pen.'],
 bevName:'BEV',bevAsk:'Ask about Agnes\'s gentleman',bevPlain:'Ask about the man who bought her pie',
 bevPie:[['BEV','He came in every Tuesday for a year. Tall. A long black coat like a funeral home. Polite like a funeral home.'],
  ['BEV','He bought two slices of sour cream raisin and walked them down to her house. Paid in silver dollars. Never ate here.'],
  ['BEV','Two Novembers ago Agnes was yellow as a legal pad. The doctor in Duluth gave her a year.'],
  ['BEV','Then she wasn\'t. Like a light switched on. I asked her what she did. She said she sat at a bus stop.']],
 cPie:'A tall, polite man bought Agnes pie every Tuesday for a year. She was dying, and then, overnight, she wasn\'t.',
 bevNo:[['BEV','Pie\'s four dollars. Gossip\'s more than you\'ve got.']],
 bevNoticed:[['BEV','Folks say you\'re not appraisers. I said folks talk. Pie\'s four dollars.']],
 bevAfter:[[['BEV','She tipped in quarters, Agnes. Exact quarters. Twenty percent of four dollars. Eighty cents. Three quarters and a nickel.']],
  [['BEV','Seven letters, "what\'s left behind." CASSEROLE. Still doesn\'t fit.']],
  [['BEV','The Haugen boys are in the back booth. Leave them be. They lost their little brother in January.']],
  [['BEV','I heard about Father Tom. I\'m not going to cry in front of the coffee.']],
  [['BEV','You finished it? You look like you finished it.']]],
 // ---- the Haugen brothers (with care: their youngest brother died in January; no detail) ----
 dag:'DAG',
 dag1:['Three big men in work coats in the back booth, not eating. The youngest of them wears a high-school hockey jacket two sizes small.',
  ['DAG','You\'re at Agnes\'s. She used to sub at the high school library. Taught our Toby to use the card catalog. He thought it was a joke. It wasn\'t a joke to her.'],
  'Nobody at the table says anything else about Toby. You don\'t ask.'],
 dagTom:[['DAG','You\'ll hear about me and Father Tom. Everybody tells it.'],['DAG','He said something at the lunch after. Toby\'s lunch. I don\'t remember what. I remember the coffee urn.'],['DAG','I\'d do it again. I\'d also say sorry. Both.']],
 dagRead:'Ask about Toby, carefully',dagReadDo:[['DAG','...He was nineteen. He liked loud music and he liked his brothers.'],['DAG','That\'s what you get. That\'s what anybody gets.'],'Nils, the one in the jacket, looks at the window the whole time. It\'s just a window.'],
 dagReadFail:'Dag looks at you until you look at the menu.',
 dagAlibi:'Ask where they were Friday night',
 dagAlibiDo:[['DAG','Brainerd. Toby\'s old team had the section final. Forty people saw us. We were the loudest ones there.'],['DAG','Sheriff\'s going to come asking anyway. I know how it looks. I put a priest in a coffee urn.'],['DAG','Tell him Brainerd. Tell him Toby\'s team won.']],
 cHaugen:'The Haugen brothers were at a hockey game in Brainerd the night Father Tom died. Forty people saw them.',
 dagAfter:[['DAG','We\'re not leaving town. Where would we go. The bus doesn\'t come.']],
 dag6:[['DAG','Father Tom. I know. Everybody\'s looking at this booth. Let them look.']],
 // ---- Father Tom at St. Bridget's ----
 kessler:'FATHER TOM',
 kessler1:[['FATHER TOM','Welcome. Mind the bingo cards. I write my homilies on the backs. This one\'s B-7 through G-52.'],'He\'s big, sixties, with a goalie\'s nose and a gap where an eyetooth was.'],
 kesslerHat:[['FATHER TOM','Hat says hello? Hat says hello. Lord.'],'He sits down in a pew like he\'s been checked into the boards.'],
 kesslerAsk:'Ask about the house',kesslerPlain:'Ask if he ever went in',
 kesslerBless:[['FATHER TOM','I blessed that house in December. After the funeral. The sister asked.'],['FATHER TOM','I got as far as the front hall. The mirror there cracked, top to bottom, like a shot. I finished the blessing anyway. I\'m stubborn.'],
  ['FATHER TOM','I went back the next morning for my scarf. The mirror was whole.'],
  ['FATHER TOM','There\'s an older way. From the old country, not the Church. My grandmother knew it. It takes a life for a life in the glass.'],['FATHER TOM','I won\'t say more than that in here. I won\'t say it anywhere.']],
 cBlessing:'Father Tom blessed the house in December. The hall mirror cracked top to bottom, and was whole the next morning.',
 kesslerNo:[['FATHER TOM','I don\'t gossip about the dead. I\'m not allowed. It\'s in the contract.']],
 kesslerAfter:[[['FATHER TOM','Agnes read every book in that library twice. She said the second time was for the book.']],
  [['FATHER TOM','If you hear me on the phone at three in the morning, it isn\'t me. Hang up.']],
  [['FATHER TOM','I\'ve been sleeping with the bathroom light off. I don\'t like what it does to the mirror.']]],
 candle:'THE CANDLES',candleLook:'A rack of votive candles, half of them lit. A coin box: 50¢ A CANDLE. Somebody\'s put in a button.',candleOpt:'Light one for Agnes, and pray',
 candleDo:['You light one for Agnes Lindqvist. Father Tom says the words with you, low, like a man counting a slow clock.',
  'In the dark window behind the rack, the candle\'s flame leans the wrong way. Toward the glass.','In the glass, a woman in a blue dress stands at the back of the church, praying too. She doesn\'t have a candle.',
  'When you turn around, there\'s nobody in the back pew. Father Tom keeps praying. He saw it. He keeps praying anyway.'],
 candleH:'Agnes in the church window, praying',
 cabinet:'SACRISTY CABINET',cabinetLook:'A tall cabinet of parish books, the oldest bound in green cloth gone black at the corners.',
 cabRecords:'Find her in the marriage book',cabPaper:'Ask for a certified copy',cabSneak:'Slip the page out',
 cabDo:['MARRIAGES 1974. LINDQVIST, ARNE O. and DAHL, AGNES M. June 8.','Her signature, young and careful. The A of Agnes is open at the top, like a tent, no crossbar. You\'d know it anywhere now.'],
 cabPaperDo:'The parish secretary\'s form is three pages long. Father Tom signs it without reading it. "Bureaucracy," he says, "is a kind of prayer."',
 cabSneakDo:'You tear it out along the binding, slow, so it doesn\'t make a sound. It makes a sound.',
 cabFail:'Twenty years of marriages and no Lindqvists. You\'ve got the wrong book. You\'ve got the wrong shelf.',
 cRegister:'Agnes\'s real signature, from the parish marriage book: her A is open at the top, like a tent, no crossbar.',
 altar:'The altar. A white cloth, two brass candlesticks, and a hymnal left open to a hymn about the sea.',pew:'A pew. A kneeler with a hole worn in it the shape of one particular knee.',
 // ---- the rectory, the sixth day ----
 desk:'Father Tom\'s desk. A stack of bingo cards with homilies on the backs. The top one says, in pencil: "Sunday. Mirrors. NO. Talk about the falls instead."',
 bath:'THE BATHROOM',bathLook:'His bathroom. The mirror over the sink is cracked, a star in the middle and lines going out. Something\'s been cleaned up off the sink. Not all of it.',
 bathExam:'Read the scene',bathSweep:'Go over the bathroom',
 bathDo:['The crack starts on the glass\'s far side. The pieces bow out, toward the room, like something put its fist through from in there.',
  'Two sets of handprints in the steam on the glass, the size of his. One set on this side. One on that.','The coroner will call it a fall. He\'ll call it a fall because what else would he call it.'],
 bathH:'Father Tom\'s bathroom',
 bathFail:'A bathroom. A cracked mirror. A bad night. You can\'t see past it.',
 cRectory:'Father Tom died in front of his bathroom mirror. The glass was broken from the inside, and the handprints are on both sides.',
 priest1:['The steam on the mirror clears by itself, from the middle out.','Father Tom is in it. In his bathrobe, in his reading glasses, a bingo card in his hand.','He isn\'t on this side of the glass. Then he is.'],
 priestIntro:'Father Tom\'s reflection steps out of the mirror!',
 priestDone:['It goes back into the glass the way it came, and the glass lets go, all at once, into the sink.','On the floor, a bingo card. On the back, in pencil, in his hand: "She doesn\'t want the house. She wants to be the one who reads it."'],
 priestSan:'It says your name in his voice, then the worst thing you ever did, in order, like a homily.',
 // ---- 9 Orchard Row ----
 houseIn:['The front hall smells like lemon furniture polish and a radiator. It\'s very clean. Somebody\'s been keeping it clean.','There\'s a mirror in the hall, big, in a gold frame, and the first thing you do is not look at it.'],
 desk1:'THE READING DESK',deskLook:'Agnes\'s reading desk: a green lamp, a magnifier, and the diary, blue cloth, a library sticker on the spine.',
 deskRead:'Read today\'s page',deskBack:'Read the back pages',deskWait:'Not yet. The next page won\'t turn. It isn\'t tomorrow yet.',
 deskRead1:'You open the diary to the first page. The pages after it are stuck together, all of them, like the book was left out in the rain. It wasn\'t.',
 diaryPick:'You take the diary. It\'s heavier than a book that size has any right to be.',
 diary:[null,
  ['MONDAY. "My name is Agnes Marie Lindqvist and I am writing this down because I am a librarian and that is what we do with things we don\'t understand. We shelve them."',
   '"Two Novembers ago the doctor in Duluth said a year. I took the bus home. The bus didn\'t come. I sat in the shelter on Main Street and cried like a fool."',
   '"A gentleman sat down beside me. Tall, in a long coat. He took my hand. He didn\'t say anything for the length of one bus not coming."',
   '"When I stood up I was well. I knew it the way you know a fever\'s broken. I was hungry for the first time in a month. I had two pieces of pie at Bev\'s."'],
  ['TUESDAY. "He came for coffee. He came every Tuesday for a year. He brought sour cream raisin from Bev\'s and we argued about books."',
   '"He has read everything. He has read things that aren\'t written yet, I think, though he\'s too polite to say so."','"He carries a big ledger under his arm, like a church treasurer."','"He never opens it in front of me. He is the kindest man I ever met, and I was married to Arne for forty-one years."'],
  ['WEDNESDAY. "Today he opened the book. He asked would I sign it. \'Just your name, Agnes. For the records.\'"',
   '"I asked him what records. He laughed and said the men with the lantern carry his mail, and the rest is paperwork."','"I said I\'d think about it. I have never in my life said I\'d think about it and meant no. I meant no."'],
  ['THURSDAY. "I read his book over his shoulder while he looked at my bookshelf. I have read upside down since I was seven."',
   '"Names. Hundreds. Beside each name, a thing they wanted, and beside that a thing it cost. The costs were not in money."',
   '"I told him no. Plainly, at my own kitchen table. He was not angry. He smiled like a man who has already been paid."','"He said, \'No hurry, Agnes. I have your page already.\' He finished his pie. He has not come back."'],
  ['FRIDAY. "My reflection does not follow me."','"I raise my hand and she raises hers a moment late. Yesterday I left the hall and she stayed. She was writing something. I have not been writing anything."',
   '"I have covered the mirrors with sheets, the way Mother did when somebody died."','"This morning the sheets were folded on the floor. Folded. I never folded a sheet that well in my life."',
   '"She is the part of me that wanted to say yes. Every woman has one. Mine has my face and none of my manners."'],
  ['SATURDAY. "I found where she goes. She writes in my hand. I found a page of hers in the back of a drawer."',
   '"It is my name. It is my hand, or nearly. My A is closed at the top. I have never closed my A in my life. Mother would have smacked me."',
   '"I never wrote it. Somebody wrote it for me. Somebody wrote it so well it fooled the part of me that wanted to be fooled."',
   '"He has my page. My real page. It\'s in the house. I can feel it in the house like a tooth."'],
  ['SUNDAY. "I don\'t think I will finish this. If you are reading this, you have read for seven days, and the house knows your name now."','"I\'m sorry. I needed somebody to know."',
   '"Burn my page, if you find it. Burn it right. Not in anger. A lie burns badly; you have to show it what it is first."',
   '"I copied what I could of his book in the back. I\'m a librarian. I wanted a record that wasn\'t his."','"Don\'t let her keep the house. She\'ll only want the next one."']],
 diaryH:[null,'','','','Agnes, refusing him at her own kitchen table','','','The last page, and the house knowing your name'],
 cDiary:[null,'Agnes\'s diary, Monday: dying, she sat at the bus stop, a tall gentleman held her hand, and she was well.',
  'Agnes\'s diary, Tuesday: he came for coffee every Tuesday for a year, kind, with a big ledger under his arm.',
  'Agnes\'s diary, Wednesday: he asked her to sign his book "for the records." He said the men with the lantern carry his mail.',
  'Agnes\'s diary, Thursday: she read his book, names and what each one cost, and refused. He said he had her page already.',
  'Agnes\'s diary, Friday: her reflection doesn\'t follow her anymore. It\'s the part of her that wanted to say yes. She covered the mirrors.',
  'Agnes\'s diary, Saturday: a page with her name in her hand, but her A closed at the top. She never wrote it. Her real page is in the house.',
  'Agnes\'s diary, Sunday: burn her page, and burn it right. She copied his book into the back.'],
 backH:'The back pages',
 back:['The back pages are a different paper, older, ruled in red. A number in the top corner: 7.','In Agnes\'s small careful print, a list, copied upside down over somebody\'s shoulder:',
  '"PAULSEN, ODD · FOR RAIN · 1988." "A HARVEST COMMITTEE · SEVEN NAMES · FOR GOOD YEARS." "LINDQVIST, AGNES · FOR A YEAR · (UNSIGNED)."',
  '"HOLLIS, WREN · FOR LILY · OCT. 9, 2015."','Under that one she\'s written, smaller: "A mother. It was always going to be a mother."'],
 // ---- the hall mirror and Agnes's page ----
 hallMirror:'THE HALL MIRROR',hallLook:'A big mirror in a gold frame. In it, the hall, the stairs, the door, you. You don\'t look at you for very long.',
 hallLookNight:'The hall mirror. The hall in it is a little darker than the hall out here.',
 mirrorCover:'Cover it with a sheet',mirrorCovered:'There\'s a sheet over it. Under the sheet, the glass is cold to the touch, colder than the wall.',
 coverDo:'You hang a sheet over it, the way Agnes did, the way her mother did. It hangs still. You don\'t turn your back on it right away.',
 hallBehind:'Look behind the backing',hallFix:'Take it off the wall',
 hallBehindDo:['Behind the backing board, pinned with one old tack, a page. Old paper, ruled in red.','Her name, in her hand. Her A closed at the top.','The page is warm. Paper isn\'t warm.'],
 hallBehindFail:'The backing\'s nailed tight and the frame is heavier than it looks. Something on the other side of the glass is leaning on it.',
 // ---- the kitchen ----
 phone:'THE PHONE',phoneLook:'A beige phone on the kitchen wall with a cord long enough to reach the stove. Taped beside it, numbers in Agnes\'s hand: BEV. FR. TOM. RUTH (DULUTH).',
 phoneDead:'You pick it up. No dial tone. Something on the line breathes in, and doesn\'t breathe out.',
 phonePick:'Pick it up',ring:'The kitchen phone is ringing. It keeps ringing. You know who it is, and he\'ll wait.',
 ruthOpt:'Call Ruth in Duluth',
 ruth:[['RUTH','Hello? ...Is this about the house? Are you the ones she left it to? The diary, I mean.'],['RUTH','Aggie and I didn\'t talk much at the end. She said she\'d told a man no. She was so proud of it. Like she\'d won the county fair.'],
  ['RUTH','She always signed her A open at the top, like a little tent. Since she was six. Mother tried to make her close it. She never would.']],
 ruthCut:['Under Ruth\'s voice, another one, closer, as if the phone were pressed to your other ear.',['THE PHONE','"Don\'t tell her I\'m here. She\'ll worry."'],'It\'s Agnes\'s voice. It\'s almost Agnes\'s voice.',['RUTH','...Hello? I lost you. Hello?']],
 ruthH:'Agnes on the line under her sister',
 cRuth:'Agnes\'s sister: Agnes refused a man and was proud of it. She always signed her A open at the top, like a tent.',
 ruthFamily:'You\'ve got a sister somewhere, or a mother, or somebody. You think about calling them. You don\'t. You\'re glad they\'re there.',
 hatCall:[['BIG HAT','It\'s me. You\'re five days in. Talk.']],
 hatAsk:'What\'s in that house?',
 hatOpts:['Agnes. She never left.','Her reflection. The part of her that wanted to sign, and something gave it legs.','The man with the book.'],
 hatRight:[['BIG HAT','...'],['BIG HAT','Then don\'t look at it longer than you have to.'],['BIG HAT','Old trick. A thing like that can\'t stand its own face. Remember that when it counts.']],
 hatNoProof:[['BIG HAT','Her reflection.'],['BIG HAT','You show me how you know and I\'ll believe you. Till then you\'re guessin\' on my dime.']],
 hatHalf:[['BIG HAT','...'],['BIG HAT','He ain\'t why I sent you.'],['BIG HAT','...Is he.'],'He hangs up. The kitchen clock says 9:09. It said 4:15 a second ago.'],
 hatNoHalf:[['BIG HAT','What man. You got a name? You got a page? You got pie.'],['BIG HAT','Bring me paper or don\'t bring it up.']],
 hatWrong:[['BIG HAT','Ghosts don\'t write letters to lawyers, {first}.'],['BIG HAT','Look harder.'],'Click.'],
 hunch:'A woman who said no. A reflection that runs a second late. What would want a yes that badly?',
 wrongCost:'You told him it was a ghost. Lying in the guest bed listening to the house, you know better, and knowing it costs you.',
 spice:'SPICE RACK',spiceLook:'A spice rack, alphabetized. Allspice to Thyme, and on the end, a mason jar.',spiceOpt:'Look at the jar',
 spiceFind:'A jar of dried little mushrooms. A label in Agnes\'s hand: ARNE\'S. FOR HIS BACK. DO NOT.',
 // ---- upstairs ----
 bed:'THE GUEST BED',bedLook:'A guest bed with an afghan in every color they had, and three pillows, one per agent. Agnes made it up before she died. For you, maybe.',
 bedOpt:'Sleep on it',sleepQ:'Sleep till morning?',sleepClose:'Nothing in town closes tonight.',sleepClose5:'St. Bridget\'s won\'t open tomorrow.',turnOpts:['Go on','Not yet'],
 bedUnread:'Not yet. You haven\'t read today\'s page. The diary\'s waiting on the parlor desk.',bedPhone:'Not yet. The phone\'s going to ring. You can feel it in your teeth.',
 bed7:'No more sleeping. It\'s Sunday. Wait for dark downstairs.',bedNight3:'Back to bed?',
 vanity:'THE VANITY',vanityLook:'Agnes\'s vanity: a round mirror, a hairbrush with white hair in it, a little drawer.',vanitySweep:'Go through the drawer',
 vanityFind:'In the drawer, under a hairnet and a church envelope: a gold compact. You open it. Your own face, small, a little surprised.',
 vanityNone:'Hairpins, a church envelope, a bus schedule with 9:09 circled in pencil.',
 vanityMirror:'THE VANITY MIRROR',
 vanityHigh:['The mirror shows the room empty. No you in it.','Then, small and gray, far back in the glass like at the end of a hallway: Agnes. The real one, in a housecoat, with her hair down.',
  'She presses her right hand flat to the glass. She breathes on it and writes in the fog, backward, carefully, a librarian\'s print:','"NOT MY HAND."'],
 vanityHighCovered:['There\'s a sheet over it. Through the cloth, something presses a hand flat from the other side, and writes on the fabric with a finger: "NOT MY HAND."'],
 vanityH:'Agnes, the real one, behind the glass',
 cStill:'In the vanity mirror, the real Agnes, far back in the glass: "NOT MY HAND." She never signed.',
 bathUp:'THE BATHROOM CABINET',bathUpLook:'A medicine cabinet with a mirror door. Aspirin, Arne\'s razor, a toothbrush in a glass. The mirror\'s spotted at the corners.',
 trunk:'THE SEWING TRUNK',trunkLook:'A cedar trunk at the foot of a sewing table. Quilting squares, and under them, letters in bundles.',trunkSweep:'Go through the letters',
 trunkDo:['Letters to Ruth in Duluth she never sent, thirty years of them, every one signed the same.','"Love, Aggie." The A open at the top like a little tent.'],
 trunkFail:'Quilting squares, more quilting squares. You find a thimble. It\'s a nice thimble.',
 cLetters:'Agnes\'s unsent letters to her sister, every one signed with her A open at the top, like a tent.',
 window:'THE WINDOW',windowLook:'The parlor window, the curtain drawn. Through the gap, Main Street, the steeple, the falls.',windowOpt:'Wait for dark',
 duskQ:'Wait here till dark?',duskClose:'Bev\'s closes. Marit leaves town for the night.',
 dusk:['The light goes gray, then blue, then the kind of dark Minnesota keeps for March.','Down on Main Street, Bev turns the sign. Marit\'s car goes by with its brights on, headed for Brainerd, fast.','Upstairs, something walks the length of the hall. The hall isn\'t that long.'],
 clock:'The grandfather clock. It says 9:09. It has said 9:09 since you got here, and it ticks.',
 sheetsLook:'Furniture under dust sheets. A sofa, an armchair. The sheets hang the way sheets hang over people sitting very still.',
 sheetsDone:'The dust sheets, on the floor in a heap. Just sheets now. Good for covering things.',
 // ---- the nights ----
 night:[null,
  ['You sleep. Then you don\'t. It\'s 3 a.m. by the feel of it.','Downstairs, every clock in the house has stopped at 9:09. They\'re still ticking.',
   'In the hall mirror the hall is a second behind. You lift a hand. The hand in the glass thinks about it first.'],
  ['At 3 a.m. somebody isn\'t in bed.','{n} is standing in the front hall in {n.their} socks, in front of the mirror, not moving. {n.They} {n:doesn\'t|don\'t} know how {n.they} got there.',
   ['{N}','"She was saying my name. She was saying it nice."']],
  null,
  ['At 4 a.m. the mirrors in the house show the same thing, all of them, the way TVs in a store show the same channel.',
   'The front hall. November. Agnes at the foot of the stairs, sitting down slow, with one hand on the banister. Her reflection standing over her, not helping.','Then just the hall.'],
  ['At 2 a.m. a siren goes up Main Street and stops. Red light walks across the guest-room ceiling, slow, back and forth.','Nobody gets up. Nobody says anything. In the morning you\'ll all say you slept.'],
  ['At 3 a.m. {n} gets up, puts {n.their} shoes on, and walks downstairs to the hall mirror with {n.their} eyes shut.','{n} reaches out to the glass like {n.they} {n:is|are} reaching for a doorknob.']],
 nightH:[null,'Every clock at 9:09, the mirror a second late','{n}, at the mirror at 3 a.m.',null,'Agnes dying in the front hall, in every mirror',null,null],
 cLag:'The hall mirror runs a second behind the hall. Every clock in the house stopped at 9:09, and they still tick.',
 sleepwalkQ:'{n} is reaching for the glass. Who brings {n.them} back?',sleepwalkOk:['"Hey. Hey. It\'s us. Come on back to bed."','{n} opens {n.their} eyes. {n.They} {n:looks|look} at {n.their} hand, inches from the glass, like it belongs to somebody else.'],
 sleepwalkFail:['{n} doesn\'t hear you. {n.Their} hand flattens on the glass for a long second.','Then {n.they} {n:turns|turn} around, {n:walks|walk} back upstairs and {n:gets|get} into bed, eyes shut. In the morning {n.they} {n:doesn\'t|don\'t} remember.'],
 sleepwalkNone:'Nobody wakes up in time. In the morning {n} has a cold red handprint on {n.their} palm and doesn\'t know why.',
 morning:[null,null,'Tuesday. The coffee maker was on when you came down. Nobody set it. It\'s good coffee.','Wednesday. Sleet. Every faucet in the house is dripping in time, like a metronome.',
  'Thursday. The sheets from the parlor are in the laundry basket, washed, folded. Nobody did that.','Friday. Fog on the river. You can\'t see the falls from the window, just hear them.',
  'Saturday. Out the guest-room window: the sheriff\'s cruiser at St. Bridget\'s, lights going, no siren. Tape across the rectory door.','Sunday. Clear and cold. Church bells at nine. St. Bridget\'s has no priest to ring them. They ring.'],
 obsessLines:['{n} keeps glancing at the hall mirror like somebody called {n.their} name.','{n} straightens the doilies on the parlor table. Nobody asked {n.them} to. {n.They} {n:does|do} it very well.',
  '{n} says "our house" and doesn\'t notice.','{n} knows which stair creaks without stepping on it.'],
 // ---- the third night: the sheets (a story fight, 2 skulls) ----
 sheets1:['You wake up at 3:10. Downstairs, in the parlor, somebody stands up off the sofa.','Then somebody else, off the armchair. Two shapes under the dust sheets, the size of people, the shape of people sitting up straight.',
  'The sheets turn their heads to the stairs. There\'s nobody under them.'],
 sheetsIntro:'The dust sheets stand up!',
 sheetsDone2:['The sheets drop, one, two, the way laundry drops off a line in a storm.','The house goes quiet like a house that\'s been told to go to bed.'],
 night3Out:'The front door won\'t open. It\'s minus eight out there and something is sitting on the porch swing. Go back to bed.',
 smother:'smothers',
 // ---- the seventh night (the town is a danger zone) ----
 night7:['Main Street at night. Every house on it has its porch light on.','In the windows, people move. In the dark glass of every window, their reflections move a little later, and one or two of them are out walking.'],
 nightOk:'You stand in the shadow of the shelter and count their beats. A neighbor walking. A dog that died in \'09, still walked.',nightFail:'Something out on Main Street turns its head toward you a second after its owner does.',
 shelterBox:'Under the shelter bench, something in a grocery bag with a gas-station bow on it.',shelterOpen:'Open it',
 shelterBoxLine:'In the bag, under a hat that says I ICE FISHED LAKE TAMARACK in Big Hat\'s handwriting:',
 rectoryNight:'The rectory door, unlocked. Nobody\'s left to lock it.',
 // ---- the hall: the boss waits for you (Go in / Not yet) ----
 stairsUp:'The stairs up.',stairsNight:'At the top of the stairs, the upstairs hall goes on. It goes on longer than the house does.',
 hallIn:['The upstairs hall is a hundred feet long in a house forty feet wide.','Mirrors down both walls, every kind: a vanity, a compact, a rearview, a bathroom cabinet, a store window. In every one of them, you.',
  'A hundred of you, all looking back. One of them is late.'],
 hallH:'A hundred of you in the glass, and one of them late',
 hallMirrorLook:['In it you\'re a little older, alone in a kitchen, listening to a clock.','In it you\'re at a bus stop in the rain.','In it you\'re asleep in the guest bed, and somebody\'s standing over you.','In it you\'re the one who stayed.'],
 sideTable:'A little table with a doily and a glass dish of butterscotch. Nobody\'s eaten one in years.',
 compactTable:'On a little table, a gold compact, open, face up.',compactTake:'Take the compact',
 bigQ:'At the end of the hall, the big mirror, taller than a door. In it, Agnes in her good blue dress, waiting, with her hands folded.',
 bigClose:'Once you\'re in, it ends one way or another.',gateIn:['Go in','Not yet'],
 hallBack:'The stairs back down. The house is waiting at the bottom.',
 boss1:['You step up to the big mirror. Agnes steps up to it from the other side.','She smiles. Her smile is perfect. It\'s on the wrong side of her face.','Then the glass isn\'t between you anymore.'],
 bossSay:['THE OTHER AGNES','Agent {code}. You read it. All of it. Every day. That\'s more than anybody ever did for me.'],
 bossSay2:['THE OTHER AGNES','{o}, dear. You\'ve been so good to the house. Wouldn\'t you like to stay?'],
 bossSayNo:['THE OTHER AGNES','She said no for both of us. She always said no. Somebody had to say yes.'],
 bossIntro:'The other Agnes steps out of the glass!',
 bossThin:'She\'s thinner than she should be. The house has fewer places to put her. What you did this week has cost her.',
 bossIdent:'You know what she can\'t stand. Big Hat said it. Her own face.',
 bossHand:'Agnes\'s own hand is in your pocket. Her real A, open at the top. Show it to her when it counts.',
 bossOffer:'She shows you yourself, older, alone, in a clean house, listening to a clock tick at 9:09. It looks restful. It looks like it would be no trouble at all.',
 bossCrack:'Every mirror in the hall cracks at once, a hundred little guns going off!',
 bossPhase:'She comes the rest of the way out of the glass. Her dress is backward. Her face is backward. All her buttons are on the wrong side.',
 bossShield:'Every mirror down the hall shows her, and every one of them takes a little of what you hit her with.',
 bossShown:'She looks at the A, open like a tent, and her face does something Agnes\'s face never did. The mirrors stop helping her.',
 bossHeal:'She leans back into an uncovered mirror like into a warm bath. The other Agnes heals {n}.',
 bossNoHeal:'She reaches for the hall mirror downstairs, the vanity, the cabinet. Covered, covered, covered. She can\'t get back in.',
 bossStill:'From somewhere far back in the glass, Agnes\'s real voice, a librarian\'s voice: "That will do." The other one stops, mid-step, like a child told twice.',
 handName:'Her own hand',handRead:'{n} holds up Agnes\'s signature, the A open at the top, like a little tent: "This is her hand. Not yours."',
 handHit:'The other Agnes flinches from it like it\'s a lit match.',handFail:'The other Agnes won\'t look at it. Her eyes go to {n} instead.',handDone:'She\'s seen it. She knows whose it is.',
 compactUse:'{n} opens the compact and turns it on her.',compactHit:'{e} sees her own face. She screams with Agnes\'s mouth. {h} damage.',compactNo:'{e} looks at itself in the compact and doesn\'t mind.',
 // ---- after the fight: the ending choice (never a dead end) ----
 after:['She goes back into the big mirror the way water goes back down a drain.','She\'s small in there now, at the far end of the glass, like something at the bottom of a well. She\'s still there. She\'s waiting to see what you\'ll do.'],
 endQ:'What do you do with her?',
 endBurn:'Burn her page',endGive:'The old way: a life for the life in the glass',endWalk:'Leave her in the glass and go',
 burnNeed:'To burn it right you have to show it what it is first. Prove it\'s not her hand, then burn it so it takes.',
 burnHist:'{n} holds the page beside the light and shows it what it is: "Her A is open. This one\'s closed. This isn\'t her. You never were."',
 burnHistSure:'Agnes, far back in the glass, nods once. You don\'t need to prove it. She already did.',
 burnSci:'{n} holds a match under the page\'s corner, slow, steady, the way you burn a letter you mean to.',
 burnFail:'The page won\'t take it. It curls away from the flame like a cat from a bath. {n} loses 1 SAN.',
 burnOut:'Nobody can make it take. The page is cold and whole in your hand. There are other ways. Worse ones.',
 burnDo:['The page catches. It burns blue, then gold, then the color of a candle in a church.',
  'In the big mirror, the other Agnes holds up her hands, and her hands are gone, and the rest of her goes after them, politely, like a guest who knows when to leave.',
  'And then, far back in the glass, the real Agnes Lindqvist, in her good blue dress, lifts one hand to you. Then the mirror is a mirror.'],
 giveQ:'Who says the words?',giveSure:'There\'s no taking it back.',giveYes:'Say the words',giveNo:'No',
 giveLine:['THE OTHER AGNES','"Oh. Oh, yes. One of you. That\'s all it ever takes. That\'s all anybody ever wanted."'],
 giveDo:['{n} steps up to the big mirror and says the words Father Tom wouldn\'t say in church.','The glass takes {n.them} like a lake takes a stone, no splash at all.','The other Agnes goes the other way, out, gone, the way a held breath goes.',
  'The mirror shows the hall. The hall has three people in it. Then two.'],
 giveH:'{n}, going into the glass',
 giveOne:'It needs one of you to say the words, and somebody left to hear them.',
 walkDo:['You go down the stairs and out the front door and nobody stops you.','At the bus shelter on Main Street, for the first time in seven days, the 9:09 to Duluth pulls in with its lights on and nobody driving.',
  'You get on. On the inside of the bus window, in the fog, someone has drawn a 9 with a fingertip. From the outside.'],
 // ---- the dawn: the brothers (with care) ----
 dawn:'Morning. Corley Falls. The ice is going out on the river, the whole sheet of it, groaning like a church floor.',
 brothers1:['Outside Bev\'s, the sheriff\'s cruiser. In the back seat, the three Haugen brothers, shoulder to shoulder, Nils in the jacket two sizes small.',
  ['SHERIFF','Morning. Appraisers.'],['SHERIFF','It\'s the Haugens. Everybody saw the coffee urn. I don\'t like it either. It\'s what I\'ve got.'],
  'Dag looks at you through the cruiser glass. He doesn\'t ask you for anything.'],
 brothersQ:'The sheriff is waiting for you to say something.',brothersOpts:['Say nothing. Let it ride.','Tell him what really killed Father Tom'],
 brothersCarry:['You don\'t say anything. The sheriff nods like you did.','The cruiser pulls out. Bev, at the cafe window, turns her sign to CLOSED and stands there.'],
 brothersCarryH:'Three brothers in the back of a cruiser, and you said nothing',
 brothersTrue:['You tell him. All of it: the mirror, the glass broken from the inside, the handprints on both sides.','The sheriff writes down every word. His pen stops twice.',['SHERIFF','...Brainerd. Forty people. Fine.'],
  'He lets them out. Dag shakes your hand without looking at you.','Then the sheriff makes a phone call, and somebody makes another one, and you know where the last one rings.'],
 brothersAlibi:['SHERIFF','"Brainerd," you say. "The section final. Forty people." He writes that down too.'],
 // ---- overstepping (a quiet case): Noticed, Sheriff Pell, Big Hat's call, the clean-up crew ----
 noticed:['Corley Falls is a small town. Word gets around: the appraisers aren\'t appraising.','Bev and Marit won\'t be as friendly now.'],
 chief:['The sheriff\'s cruiser pulls up alongside you on Main Street. The window comes down a crack.',['SHERIFF','Gary Pell. You\'re the appraisers. Folks say you\'re not.'],['SHERIFF','I\'ve got a town that\'s scared of a dead woman\'s house. Don\'t make it worse.']],
 call:['The kitchen phone rings. You know who.',['BIG HAT','I said quiet, {first}. The Corley Falls sheriff called a number he shouldn\'t have. Now I got to explain appraisers to people.'],['BIG HAT','Don\'t ask for nothin\' next time.']],
 feds:['Three black cars come up Main Street in the slush with their lights off and stop at the curb.',['CLEAN-UP','Black Lantern. Internal. You\'re done here.'],['CLEAN-UP','The Lindqvist estate is a records matter. Step away from the records.']],
 fedsIntro:'The clean-up crew draws down!',
 fedsWin:['The black cars go back down Main Street, one short.'],
 // ---- the debrief (spec 007), in the ice house: Big Hat's lines by ending ({x}/{t} clues), what he says about the
 // choices, the will (every ending), the back pages if read, and the cover stories ----
 db:{
  clean:[['BIG HAT','Shut the door. Heat\'s on.'],'The line\'s down the hole. He doesn\'t look at it.',['BIG HAT','She burned clean? Good.'],['BIG HAT','Sister gets a house that\'s just a house. {x} clues outta {t}. That\'s a week well spent.']],
  costly:[['BIG HAT','Shut the door.'],'He doesn\'t say heat\'s on. It\'s on.',['BIG HAT','The old way. I know the old way.'],['BIG HAT','{x} clues outta {t}. The house is clean. It cost what it costs. I\'ll carry that one with you.']],
  worst:[['BIG HAT','You walked.'],['BIG HAT','I don\'t blame you. I\'d have walked. I\'m sayin\' it out loud so you know I mean it.'],['BIG HAT','{x} clues outta {t}. And she\'s still in that glass, waitin\' on a buyer from Fargo.']],
  brothersCarry:['BIG HAT','The Haugen boys. ...I read the sheriff\'s report. I\'m gonna think about that one a while. So are you.'],
  brothersTrue:['BIG HAT','You told a county sheriff the truth. Lord. Somebody upstairs had a very long Monday.'],
  wrong:['BIG HAT','"A ghost." I\'m gonna think about that one too, {first}.'],
  tape:['BIG HAT','Deputy says one of you went under his tape like it was a limbo contest.'],
  given:['BIG HAT','I know what it took. I won\'t say it in here. I won\'t say it anywhere.'],
  will:['Big Hat takes a folded paper out of his coat and flattens it on his knee.',['BIG HAT','The will. "My diary to the people with the lantern." She knew what we were. She knew what we carry.'],
   ['BIG HAT','Somebody told her.'],'The line in the hole goes taut. He doesn\'t touch it. After a while it goes slack again.'],
  wren:['He takes the diary\'s back pages out of the folder and reads down the list, slow, with his finger.','His finger stops. It sits on one line a long time.',
   ['BIG HAT','...Never heard of her.'],'He folds the page very small and puts it in his vest, not the folder.'],
  furnace:'Old furnace. Carbon monoxide. She went quiet in her sleep.',furnacePass:[['BIG HAT','Old furnace, CO, a librarian who wouldn\'t buy a detector. Coroner signs it Monday.']],
  sold:'Appraised and sold. Nothing in the house but a draft.',soldPass:[['BIG HAT','Sold. Fargo. He likes the windows. God help him.']],
  weak:'Kids on a dare, breaking in.',weakPass:[['BIG HAT','Kids. In Corley Falls everything\'s kids. You got lucky.']],
  easy:'Nobody asked',easyPass:[['BIG HAT','Appraisers came, appraisers left. Small town minds its own business in March.']],
  safe:'Already filed: estate closed, no findings',safePass:[['BIG HAT','Paper says estate closed. Paper\'s never wrong.']],
  filed:[['BIG HAT','The diary. I\'ll file it. Records wants it by Monday.'],'He says Records like he\'s just learned the word.'],
  filedPage:[['BIG HAT','And her page. It goes with the diary.'],'He holds it by one corner, like it\'s warm. It is.']
 }
};
const fill=(t,o)=>fillT(t,o);
async function play(seq,o={}){for(const l of [].concat(seq)){if(Array.isArray(l))await say(fill(l[0],o),fill(l[1],o));else await say('',fill(l,o))}}
const said=(l,o)=>play([l],o);
// A point of no return (studio-bible/play.md): the cursor starts on Not yet, so mashing A can't take it.
async function askNotYet(text,opts){await say('',text,{keep:true,instant:false});const r=await choose(opts,{cancel:true,inBox:true,sel:opts.length-1});hideTB();return r<0?opts.length-1:r}

// The case board card (spec 014, Card; spec 009, step 3): LANTERN 02, the black folder. The board adds AGENCY CASE ·.
const caseCard={file:2,title:'SEVEN DAYS',town:'CORLEY FALLS',place:'CORLEY FALLS, MN',
 hook:['A dead widow left us her diary.','It takes a week to read.'],pin:'#7a1a18'};

// ================= CASE DATA =================
// Enemy cards (Combat: Enemies and difficulty, Combat numbers). Fight sizes: roamers 10–18 enemy HP, story fights 20–35.
// 'glass': it lives in the mirrors, so its own face (the compact) does double and stuns it.
const EN={
 // the dust sheets (an unnatural story fight at night 3, 2 skulls, 24 HP between them): Smother costs an agent a turn
 sheet:{name:'Dust sheet',tier:'ordinary',hp:12,dex:12,hit:50,dmg:'1d3+1',skulls:2,tags:['unnatural','burns'],resist:['shaken'],weak:'fire',
  weakLine:'Nobody under it. Fire takes it fast: things that burn take double. Nothing in there to scare.',
  moves:[['hit',3],['smother',2]],verb:'wraps around',die:'drops in a heap of linen',face:[14,4,24],horror:{tier:'disturbing',kind:'unnatural'}},
 // Father Tom's reflection (an unnatural story fight on day 6, 2 skulls, Tough)
 priest:{name:'His reflection',tier:'tough',hp:24,dex:10,hit:55,dmg:'1d4+1',skulls:2,tags:['unnatural','glass'],resist:[],weak:'glass',
  weakLine:'It lives in the glass. Its own face held up to it does double and stuns it.',
  moves:[['hit',3],['san',1]],verb:'reaches for',sanText:TEXT.priestSan,sanHit:['0','1'],die:'goes back into the glass',face:[20,4,26],
  horror:{tier:'disturbing',kind:'unnatural',subj:'mirrors'}},
 // the seventh night's roamers on Main Street: a neighbor's reflection out walking, and a dog's
 twin:{name:'A reflection',tier:'ordinary',hp:14,dex:11,hit:45,dmg:'1d3+1',skulls:2,tags:['unnatural','glass'],resist:['shaken'],weak:'glass',
  weakLine:'Somebody\'s reflection, out walking. Its own face does double and stops it a turn.',moves:[['hit',1]],verb:'reaches for',die:'goes back into a window',face:[16,2,22],
  horror:{tier:'unsettling',kind:'unnatural',subj:'mirrors'}},
 rdog:{name:'The dog',tier:'ordinary',hp:10,dex:14,hit:45,dmg:'1d3',skulls:1,tags:['unnatural','beast','glass'],resist:[],weak:'glass',
  weakLine:'A dog that died in \'09, still walked. Its own face sends it home.',moves:[['hit',1]],verb:'snaps at',die:'goes back into a storm door',face:[14,2,20]},
 // only if overstepping reaches Federal agents (the same clean-up crew as every case; its sprite is Still Harvest's SHB)
 fed:{name:'Clean-up agent',tier:'ordinary',hp:11,dex:12,hit:55,dmg:'1d4+1',skulls:3,tags:['human','living'],resist:[],weak:'human',weakLine:'Human. A flashbang or a badge will stop him for a second.',
  moves:[['hit',1]],verb:'fires at',die:'goes down and stays down',face:[10,2,20]},
 // the boss (tuned Nov 25, 2026 with tools/boss-sim.js against the Gleaner's bar). Its HP, phase 2, shield and heal are
 // set per run in bossFight() from the case's choices. Weakness: her own face (the compact).
 agnes:{name:'The other Agnes',tier:'boss',boss:true,hp:62,dex:11,hit:58,dmg:'1d4+2',allDmg:'1d3',skulls:3,tags:['unnatural','glass'],resist:['stun2','poison'],weak:'glass',shield:1,heal:1,
  weakLine:'She lives in the glass. Her own face held up to her does double and stuns her. She can\'t be stunned two turns running.',glow:true,face:[30,4,26],
  moves:[['hit',5],['all',2],['san',1]],verb:'reaches for',allText:TEXT.bossCrack,sanText:TEXT.bossOffer,sanHit:['0','1'],sanLabel:'It looks restful',die:'goes back into the big mirror',
  horror:{tier:'boss',kind:'unnatural',subj:'mirrors',known:true}}
};
// the case's horrors: tier, kind, phobia subject; once per case each (SAN loss table). The hall is for all three; the
// rest are the lead's on the map, or the one agent they happen to.
const HORRORS={
 night1:{id:'night1',tier:'unsettling',kind:'unnatural',subj:'mirrors',label:TEXT.nightH[1]},
 leave:{id:'leave',tier:'unsettling',kind:'unnatural',label:TEXT.leaveH},
 night2:{id:'night2',tier:'disturbing',kind:'unnatural',subj:'mirrors'},
 day4:{id:'day4',tier:'unsettling',kind:'unnatural',label:TEXT.diaryH[4]},
 night4:{id:'night4',tier:'unsettling',kind:'helplessness',label:TEXT.nightH[4]},
 bath:{id:'bath',tier:'disturbing',kind:'violence',label:TEXT.bathH},
 last:{id:'last',tier:'disturbing',kind:'unnatural',label:TEXT.diaryH[7]},
 back:{id:'back',tier:'disturbing',kind:'unnatural',label:TEXT.backH},
 candle:{id:'candle',tier:'unsettling',kind:'unnatural',subj:'mirrors',label:TEXT.candleH},
 ruth:{id:'ruth',tier:'unsettling',kind:'unnatural',label:TEXT.ruthH},
 vanity:{id:'vanity',tier:'unsettling',kind:'unnatural',subj:'mirrors',label:TEXT.vanityH},
 hall:{id:'hall',tier:'shattering',kind:'unnatural',all:true,subj:'mirrors',label:TEXT.hallH},
 brothers:{id:'brothers',tier:'disturbing',kind:'helplessness',all:true,label:TEXT.brothersCarryH},
 given:{id:'given',tier:'severe',kind:'violence',all:true}
};
// this case's own items (case-only: the pin icon; Big Hat sorts them at the debrief). The diary is the key evidence.
const holdItem=k=>holderOf(k)||(G.fs.pack||[]).some(it=>it.k===k);
const CASE_ITEMS={
 diary:{name:'Agnes\'s diary',type:'Evidence',kind:'unnatural',pin:1,passive:1,
  desc:'Blue cloth, a library sticker on the spine, seven entries. The back pages are older paper, ruled in red, numbered in the corner: 7.'},
 page:{name:'Agnes\'s page',type:'Evidence',kind:'unnatural',pin:1,passive:1,desc:'Old paper, ruled in red. Her name in her hand, nearly: the A closed at the top. Warm, the way paper isn\'t.'},
 hand:{name:'Her own hand',type:'Evidence',kind:'ordinary',pin:1,desc:'Agnes\'s real signature, the A open at the top like a tent. Battle: show it to her (History or Empathy).',
  battleUse:async m=>{const F=G.flags;if(F.shown){await bsay(TEXT.handDone,900);return false}
   const t=aliveFoes().find(e=>e.t==='agnes');if(!t){await bsay('There\'s nobody here who needs to see it.',900);return false}
   const sk=chanceOf(m,'History')>=chanceOf(m,'Empathy')?'History':'Empathy',o=SR.pct(chanceOf(m,sk));bres(sk.toUpperCase(),o);
   await bsay(fillT(TEXT.handRead,{n:m.name}),1500);
   if(!o.ok){tried(m,sk);await bsay(fillT(TEXT.handFail,{n:m.name}),1000);return true}
   F.shown=1;await bsay(TEXT.handHit,1200);if(t.ph2)await bsay(TEXT.bossShown,1600);return true}},
 compact:{name:'Agnes\'s compact',type:'Tool',kind:'ordinary',pin:1,uses:3,desc:'A gold compact with a mirror in it. Battle: turn it on one enemy, no roll. Things that live in the glass take double damage and are Stunned.',
  battleUse:async m=>{const t=await uiTarget(m,{foes:true,info:e=>e.name});if(!t)return false;
   await bsay(fillT(TEXT.compactUse,{n:m.name}),800);
   if(t.weak!=='glass'){await bsay(fill(TEXT.compactNo,{e:t.name}),900);return true}
   const h=roll(1,6)*2;await bsay(fill(TEXT.compactHit,{e:t.name,h}),1100);await hurtFoe(t,h,m);if(!t.dead)await foeStatus(t,'stun');return true}}
};
// a roamer's drop: 20% from this loot table (Where items come from, Loot): a Minnesota town in the thaw
const LOOT=['energy','painkillers','cigs','booze','bandage'];
const has=id=>G.clues.some(c=>c.id===id);

// ================= THE DAYS =================
// G.flags.day: 1 to 7. G.flags.nt: 1 on the third and seventh nights (the only nights you walk). G.flags.read: the
// highest diary entry read. The guest bed turns each day (Go on / Not yet, naming what closes; play.md).
const day=()=>G.flags.day|0||1;
const isNight=()=>!!G.flags.nt;
const night7=()=>isNight()&&day()===7;
const read=()=>G.flags.read|0;
// the obsessed agent (the lowest SAN on the second night): by agent id; if they're gone, nobody
const obsessed=()=>live().find(m=>m.a.id===G.flags.obs)||null;
// overstepping: a quiet case (Noticed, then Local chief, Agency call, Federal agents)
const stepName=()=>stepsOf()[loadSeason().overstep|0]||'Clean';
const stepAt=n=>stepsOf().indexOf(n)>=0&&stepsOf().indexOf(n)<=(loadSeason().overstep|0);
// Noticed and later: Bev and Marit clam up (−20 to talk to them)
const clam=()=>stepAt('Noticed')?-20:0;
const mirrorsCovered=()=>{const F=G.flags;return!!(F.cHall&&F.cVan&&F.cBath)};
const knowsHand=()=>has('register')||has('ruth')||has('letters');

// ================= MAPS =================
// Every map is drawn by cases/lantern-02-art.js from M.ground, M.pieces and M.light. M.g is what blocks.
// Ground letters (non-walkable ones in engine.js's BLOCK set): ',' shoveled sidewalk, '~' slush on the street, 's' snow,
// 'S' trodden snow, 'b' the footbridge's planks, 'W' the river (blocks), 'w' wood floor, 'n' linoleum, 'c' carpet.
function blank(id,name,W,H,fillCh,light){const ground=mk(W,H,fillCh),g=mk(W,H,fillCh);
 return{id,name,w:W,h:H,ground,g,pieces:[],O:{},npcs:[],warps:{},light,art:window.L02A,bg:id,lines:[]}}
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
const lightOf=()=>isNight()?'night':'day';

// ---- MAIN STREET · CORLEY FALLS: by day, and the seventh night (40 x 24); on the seventh night it's a danger zone ----
// The north side, left to right: Sundby Realty, Bev's Falls Cafe, St. Bridget's and its rectory, a stand of spruce,
// then 9 Orchard Row in its yard. Then the sidewalk, Main Street, the south sidewalk with the bus shelter, a strip of
// park snow, and the river with the falls across it and a footbridge going out over the ice.
const DOORS={realty:4,cafe:12,church:21,rectory:28,house:36};
// the beats the seventh night's two roamers walk, in front of what each guards (Gameplay loop, Roamers)
const BEAT={shelter:[[3,11],[4,11],[5,11],[6,11],[7,11],[8,11],[9,11],[9,10],[8,10],[7,10],[6,10],[5,10],[4,10],[3,10]],
 rectory:[[25,7],[26,7],[27,7],[28,7],[29,7],[30,7],[30,8],[29,8],[28,8],[27,8],[26,8],[25,8]]};
function buildTown(){
 const N=isNight(),F=G.flags,M=blank('town','MAIN STREET · CORLEY FALLS',40,24,',',lightOf());M.alpha=N?.88:.86;M.warm='#ffcf80';
 block(M,0,0,40,7);
 put(M,'realty',1,0,6,7,{walk:1});put(M,'cafe',8,0,8,7,{walk:1});put(M,'church',17,0,9,7,{walk:1});put(M,'rectory',26,0,5,7,{walk:1});
 put(M,'spruce',31,0,2,7,{walk:1});put(M,'lindqvist',33,0,7,7,{walk:1});
 lay(M,0,8,40,4,'~');M.lines.push({x:0,y:10*16-1,w:40*16,h:2,dashed:true,col:'#e8c84a'});
 lay(M,0,13,40,2,'s');lay(M,0,15,40,9,'W');lay(M,10,15,2,8,'b');
 put(M,'bridge',10,15,2,8,{walk:1});put(M,'falls',0,19,40,1,{walk:1});
 // doors along the north side
 open(M,DOORS.realty,6);M.O[DOORS.realty+',6']=look(TEXT.realty);
 open(M,DOORS.cafe,6);if(N)M.O[DOORS.cafe+',6']=look(TEXT.cafeShut);else M.warps[DOORS.cafe+',6']=()=>goTo('cafe',6,7,'up');
 open(M,DOORS.church,6);if(N)M.O[DOORS.church+',6']=look(TEXT.churchNight);else if(day()>=6)M.O[DOORS.church+',6']=look(TEXT.churchShut);else M.warps[DOORS.church+',6']=()=>goTo('church',5,8,'up');
 open(M,DOORS.rectory,6);M.warps[DOORS.rectory+',6']=enterRectory;
 open(M,DOORS.house,6);M.warps[DOORS.house+',6']=enterHouse;
 // looks at the fronts
 M.O['10,6']=M.O['14,6']=look(TEXT.cafeFront);M.O['19,6']=M.O['23,6']=look(TEXT.churchFront);M.O['27,6']=M.O['29,6']=look(TEXT.rectoryFront);M.O['34,6']=M.O['38,6']=look(TEXT.houseFront);
 // the street's dressing: the van (leaving early), parked cars, lamps, snowbanks, the bus shelter
 put(M,'van',2,9,4,1,{face:'side'});[2,3,4,5].forEach(x=>M.O[x+',9']={id:'van',name:'THE VAN',look:TEXT.van,opts:()=>N?[]:[{label:TEXT.leaveOpts[0],run:leaveTry}]});
 put(M,'car',22,10,3,1,{tint:'#5a6a4a'});[22,23,24].forEach(x=>M.O[x+',10']=look('A pickup with a plow blade on the front, parked crooked. The plow blade has a Bible verse on it in reflective letters.'));
 [[7,7],[16,7],[30,7],[0,12],[13,12],[26,12],[39,12]].forEach(([x,y])=>put(M,'lamp',x,y));
 [[17,12,1],[33,12,2],[2,13,2],[20,13,1],[36,13,1]].forEach(([x,y,n])=>put(M,'snowbank',x,y,n,1,{len:n}));
 put(M,'shelter',5,12,3,1);[5,6,7].forEach(x=>M.O[x+',12']={id:'shelter',name:'BUS SHELTER',look:N?TEXT.shelterBox:TEXT.shelter,
  opts:()=>N?(!G.fs.used['box:shelter']?[{label:TEXT.shelterOpen,run:openBox}]:[]):[{label:TEXT.shelterWait,run:leaveBus}],used:()=>N&&!!G.fs.used['box:shelter']});
 for(let x=0;x<40;x++){if(x<10||x>11)M.O[x+',14']=look(x>14&&x<26?TEXT.falls:TEXT.river)}
 bounceDir(M,['10,22','11,22'],TEXT.footbridge,'up');
 // the edges: the county road west (leaving early is punished), the dead end east
 [7,8,9,10,11,12,13,14].forEach(y=>M.warps['0,'+y]=async()=>{if(!N)await leaveTry();else await said(TEXT.leaveAgain[1]);G.dir='right';await stepBack()});
 bounceDir(M,[7,8,9,10,11,12,13,14].map(y=>'39,'+y),TEXT.edgeEast,'left');
 // people: who's where by day. Marit waits at the gate on the first day, then outside her office.
 const NP=[];
 if(!N){NP.push(F.key?{id:'marit',x:3,y:7,dir:'down',talk:talkMarit}:{id:'marit',x:35,y:7,dir:'down',talk:talkMarit});
  NP.push({id:'sledkid',x:18+(day()%4),y:13,dir:'left'},{id:'fisher',x:27,y:14,dir:'down'})}
 M.npcs=folkOf(NP);
 if(N){M.danger=true;if(intelOn('nights'))M.lanternK=1.3;
  M.roamers=[
   {id:'rshelter',types:['twin'],sprite:'twin',name:'A reflection',skulls:2,tags:EN.twin.tags,path:BEAT.shelter,look:'A man in a bathrobe walking up and down by the bus shelter, a second behind himself. His house\'s windows are dark. He\'s in bed. This isn\'t him.',guard:openBox},
   {id:'rrectory',types:['rdog'],sprite:'rdog',name:'The dog',skulls:1,tags:EN.rdog.tags,path:BEAT.rectory,look:'A dog walks the rectory steps on a leash nobody\'s holding. It\'s a little see-through, like a dog in a storm door.',guard:enterRectory}];
  M.arrive=townNight}
 return M}
async function townNight(){const F=G.flags;if(F.n7town)return;F.n7town=1;
 await cut('night7',()=>play(TEXT.night7));
 // Search's On guard (75): spot the roamers' beats
 const L=lead();if(skillVal(L.a,'Search')>=75&&!G.fs.used.onguard){G.fs.used.onguard=1;const o=SR.pct(chanceOf(L,'Search'));
  await say('',resultLine('ON GUARD · SEARCH',o),{auto:1000});
  if(o.ok){setTrail(G.M.roamers.flatMap(r=>r.path),'beat');await said(TEXT.nightOk)}else{tried(L,'Search');await said(TEXT.nightFail)}}
 checkpoint()}
async function openBox(){await lanternBox('shelter',['firstaid','bandage','roadflare'],TEXT.shelterBoxLine);rebuild()}
// leaving early (rule 2): the first time, a dead voice on the phone (Unsettling, the lead) and four flat tires
async function leaveTry(){const F=G.flags;const r=await askNotYet(TEXT.leaveQ,TEXT.leaveOpts);if(r!==0)return;
 await fade(1);await fade(0);
 if(!F.left){F.left=1;await play(TEXT.leave1);await horror(HORRORS.leave)}else await play(TEXT.leaveAgain);
 if(G.map==='town'){G.dir='right';StudioMove.place(G,Math.max(1,G.x),G.y,'right')}checkpoint()}
async function leaveBus(){await play(TEXT.leaveBus)}
async function enterHouse(){const F=G.flags;if(!F.key){await said(TEXT.houseLocked);G.dir='down';await stepBack();return}await goTo('house',7,8,'up')}
// the rectory: through the church by day before the sixth day; taped off on the sixth; open on the seventh night
async function enterRectory(){const F=G.flags;
 if(night7())return goTo('church',16,8,'up');
 if(day()<6){await said(TEXT.rectoryFront);G.dir='down';await stepBack();return}
 if(F.tapeOk)return goTo('church',16,8,'up');
 let inn=false;const go=()=>{inn=true;F.tapeOk=1};
 await hotspot({name:TEXT.tapeAsk,look:TEXT.tape,opts:[
  {use:'creds',label:TEXT.tapeCreds,ok:async()=>{await said(TEXT.tapeCredsDo);go()},fail:()=>said(TEXT.tapeFail)},
  {use:'talk',label:TEXT.tapeTalk,mod:()=>clam(),ok:async()=>{await play([TEXT.tapeTalkDo]);go()},fail:()=>said(TEXT.tapeFail)},
  {label:TEXT.tapeDuck,run:async()=>{F.ducked=1;await said(TEXT.tapeDuckDo);go();await overstepHere('seen')}}]},'tape');
 if(inn)return goTo('church',16,8,'up');G.dir='down';await stepBack()}

// ---- interiors: the back wall three tiles tall, the door in the bottom wall ----
function room(id,name,W,H,floor,o={}){const M=blank(id,name,W,H,floor,o.light||lightOf());M.alpha=o.alpha||.84;M.warm='#ffcf80';
 block(M,0,0,W,3);block(M,0,0,1,H);block(M,W-1,0,1,H);block(M,0,H-1,W,1);put(M,'room',0,0,W,H,{walk:1,floor});return M}
const out=(M,x,y,to)=>door(M,x,y,'town',DOORS[to],7,'down');

// 9 ORCHARD ROW, the ground floor (16 x 10): the parlor, the front hall with the mirror and the stairs, the kitchen
function buildHouse(){const M=room('house','9 ORCHARD ROW',16,10,'w'),F=G.flags;
 put(M,'gclock',1,0,1,3,{walk:1});M.O['1,2']=look(TEXT.clock);
 put(M,'window',3,0,2,3,{walk:1});M.O['3,2']=M.O['4,2']={id:'window',name:TEXT.window,look:TEXT.windowLook,opts:()=>day()===7&&!isNight()?[{label:TEXT.windowOpt,run:waitForDark}]:[]};
 put(M,'hallmirror',6,0,1,3,{walk:1,covered:!!F.cHall});M.O['6,2']={id:'hallmirror',name:TEXT.hallMirror,look:()=>said(F.cHall?TEXT.mirrorCovered:isNight()?TEXT.hallLookNight:TEXT.hallLook),opts:()=>hallOpts(),used:()=>!!F.cHall&&(holdItem('page')||!(has('forged')||has('stillhere')))};
 put(M,'stairs',8,0,2,3,{walk:1});open(M,8,2);open(M,9,2);M.warps['8,2']=M.warps['9,2']=goUp;
 put(M,'wallphone',11,0,1,3,{walk:1});M.O['11,2']={id:'phone',name:TEXT.phone,look:TEXT.phoneLook,opts:()=>phoneOpts()};
 put(M,'kwindow',12,0,2,3,{walk:1});put(M,'spicerack',14,0,1,3,{walk:1});
 M.O['14,2']={id:'spice',name:TEXT.spice,look:TEXT.spiceLook,opts:[{label:TEXT.spiceOpt,once:'spice',run:async()=>{await said(TEXT.spiceFind);await pickup('shrooms')}}]};
 put(M,'readdesk',2,4,2,1);M.O['2,4']=M.O['3,4']={id:'desk',name:TEXT.desk1,look:TEXT.deskLook,opts:()=>deskOpts()};
 put(M,'readchair',2,5,1,1,{walk:1});
 put(M,F.sheets?'sheetpile':'sheetsofa',1,7,3,1);[1,2,3].forEach(x=>M.O[x+',7']=look(F.sheets?TEXT.sheetsDone:TEXT.sheetsLook));
 if(!F.sheets){put(M,'sheetchair',5,6);M.O['5,6']=look(TEXT.sheetsLook)}
 put(M,'ktable',12,5,2,1);[12,13].forEach(x=>M.O[x+',5']=look('The kitchen table. Two chairs. One pulled out, like somebody just got up, or is just about to sit down.'));
 put(M,'stove',14,4);M.O['14,4']=look('A white enamel stove. A kettle on it, still warm. Nobody\'s put the kettle on.');
 put(M,'fridge',12,3,1,1);M.O['12,3']=look('The fridge. A hotdish in foil from somebody at church, dated November. A magnet: I\'D RATHER BE READING.');
 put(M,'lamp_in',5,3);put(M,'runner',6,4,3,4,{walk:1});
 out(M,7,9,'house');
 M.arrive=houseArrive;
 return M}
// UPSTAIRS (14 x 9): the guest bed (the day's turn), Agnes's vanity, the bathroom cabinet, the sewing trunk
function buildUpstairs(){const M=room('upstairs','UPSTAIRS · 9 ORCHARD ROW',14,9,'c'),F=G.flags;
 put(M,'vanity',2,3,2,1,{covered:!!F.cVan});M.O['2,3']={id:'vanity',name:TEXT.vanity,look:TEXT.vanityLook,opts:()=>vanityOpts(),used:()=>!!F.cVan&&(holdItem('compact')||!!G.fs.used['opt:drawer'])};
 // The hidden hotspot (Item list, Mushrooms): the vanity's mirror, only while the lead is High (field.js)
 M.O['3,3']={id:'vanitymirror',hidden:'mushrooms',name:TEXT.vanityMirror,look:readVanity,used:()=>has('stillhere'),glint:(c,x,y,now)=>L02A.mirrorGlint(c,x,y,now)};
 put(M,'uwindow',5,0,2,3,{walk:1});M.O['5,2']=M.O['6,2']=look('The guest-room window. Main Street, the steeple, the river. Your breath on the glass. Only yours.');
 put(M,'bed',7,3,2,2);[[7,3],[8,3],[7,4],[8,4]].forEach(([x,y])=>M.O[x+','+y]={id:'bed',name:TEXT.bed,look:TEXT.bedLook,opts:()=>bedOpts()});
 put(M,'bathdoor',10,0,3,3,{walk:1,covered:!!F.cBath});put(M,'sink',11,3);M.O['11,3']={id:'cabinet',name:TEXT.bathUp,look:()=>said(F.cBath?TEXT.mirrorCovered:TEXT.bathUpLook),opts:()=>coverOpt('cBath'),used:()=>!!F.cBath};
 put(M,'trunk',11,6,2,1);M.O['11,6']=M.O['12,6']={id:'trunk',name:TEXT.trunk,look:TEXT.trunkLook,opts:()=>has('letters')?[]:[{use:'sweep',label:TEXT.trunkSweep,ok:findLetters,fail:()=>said(TEXT.trunkFail)}],used:()=>has('letters')};
 put(M,'lamp_in',1,5);put(M,'rug',3,6,4,1,{walk:1});
 door(M,7,8,'house',8,3,'down');
 return M}
// BEV'S FALLS CAFE (14 x 9): Bev at the counter, the Haugen brothers in the back booth, by day
function buildCafe(){const M=room('cafe','BEV\'S FALLS CAFE',14,9,'n');
 put(M,'counter',1,4,6,1);[1,2,3,5,6].forEach(x=>M.O[x+',4']=look('The counter. Forty years of elbows. A pie under a glass dome, one slice gone.'));M.O['4,4']=()=>talkBev();
 put(M,'piecase',1,0,3,3,{walk:1});M.O['2,2']=look('The pie case. Sour cream raisin, blueberry, a bar pan of something with a crust and a green layer nobody can name. A card: AGNES\'S RECIPE.');
 put(M,'coffee',4,0,2,3,{walk:1});
 put(M,'booth',9,3,4,1);put(M,'booth',9,6,4,1);M.O['9,6']=M.O['10,6']=M.O['11,6']=M.O['12,6']=look('Agnes\'s booth, by the window. A RESERVED sign made out of a folded placemat. Bev keeps it there.');
 put(M,'tv',12,0,1,3,{walk:1});M.O['12,2']=look('A TV on a bracket: the high school section semifinal, the sound off. Everybody in here watches it like a fire.');
 [2,4,6].forEach(x=>put(M,'stool',x,5,1,1,{walk:1}));put(M,'coatrack',1,7);M.O['1,7']=look('A coat rack, six snowmobile suits deep. Somebody\'s wearing a seventh one, asleep in the corner.');
 M.npcs=folkOf([{id:'bev',x:4,y:3,dir:'down',talk:talkBev,out:()=>has('pie')},{id:'dag',x:10,y:4,dir:'down',talk:talkDag,out:()=>day()>=6?has('haugen'):!!G.flags.dag1},
  {id:'erik',x:11,y:4,dir:'down',say:'dag1'},{id:'nils',x:12,y:4,dir:'left',say:'dag1'}]);
 out(M,6,8,'cafe');return M}
// ST. BRIDGET'S (20 x 10): the nave (pews, the altar, the candles, the parish books) and, through the arch, the
// rectory (his desk, his bathroom). Two doors out: the church's and the rectory's.
function buildChurch(){const M=room('church','ST. BRIDGET\'S',20,10,'n'),F=G.flags;
 put(M,'altar',4,0,3,3,{walk:1});M.O['5,2']=look(TEXT.altar);
 put(M,'cabinet',1,0,2,3,{walk:1});M.O['1,2']=M.O['2,2']={id:'cabinet',name:TEXT.cabinet,look:TEXT.cabinetLook,opts:()=>cabOpts(),used:()=>has('register')};
 put(M,'candles',9,3,2,1);M.O['9,3']=M.O['10,3']={id:'candles',name:TEXT.candle,look:TEXT.candleLook,opts:()=>candleOpts()};
 put(M,'glass',8,0,3,3,{walk:1});
 [[2,5],[6,5],[2,7],[6,7]].forEach(([x,y])=>{put(M,'pew',x,y,3,1);[x,x+1,x+2].forEach(xx=>M.O[xx+','+y]=look(TEXT.pew))});
 // the wall between the nave and the rectory, with an arch through it
 put(M,'partition',12,3,1,6);open(M,12,5);M.pieces[M.pieces.length-1].arch=5;
 put(M,'rdesk',14,4,2,1);M.O['14,4']=M.O['15,4']=look(TEXT.desk);
 put(M,'rbath',16,0,3,3,{walk:1});put(M,'sink',17,3);M.O['17,3']={id:'rbath',name:TEXT.bath,look:()=>said(day()>=6?TEXT.bathLook:'Father Tom\'s bathroom. A shaving mug, a towel with a hockey stick on it, the mirror over the sink. He keeps the light off.'),opts:()=>bathOpts(),used:()=>has('rectory')&&!!F.priest};
 put(M,'lamp_in',13,6);
 M.npcs=folkOf(day()<=5&&!isNight()?[{id:'kessler',x:5,y:3,dir:'down',talk:talkKessler,out:()=>has('blessing')&&(!holdersOf('Faith').length||!!F.faith)}]:[]);
 open(M,5,9);M.warps['5,9']=()=>goTo('town',DOORS.church,7,'down');
 open(M,16,9);M.warps['16,9']=()=>goTo('town',DOORS.rectory,7,'down');
 return M}
// THE UPSTAIRS HALL (11 x 22): the seventh night only, the finale area. Mirrors down both walls; the big mirror waits
// at the top. Everything along the hall (the compact, the mirrors) is reached without crossing its last step.
async function goUp(){if(night7())return goTo('hall',5,20,'up');await goTo('upstairs',7,7,'up')}
function buildHall(){const W=11,H=22,M=blank('hall','THE UPSTAIRS HALL',W,H,'c','night'),F=G.flags;M.alpha=.78;M.warm='#ffcf80';if(intelOn('nights'))M.lanternK=1.3;
 block(M,0,0,W,3);block(M,0,0,2,H);block(M,W-2,0,2,H);block(M,0,H-1,W,1);put(M,'hallroom',0,0,W,H,{walk:1});
 put(M,'bigmirror',4,0,3,3,{walk:1});open(M,5,2);M.warps['5,2']=bossAsk;M.O['4,2']=M.O['6,2']=look(TEXT.bigQ);
 for(let i=0,y=4;y<19;y+=3,i++){put(M,'wallmirror',1,y,1,1,{walk:1,side:'l',i});put(M,'wallmirror',9,y,1,1,{walk:1,side:'r',i:i+3});
  M.O['2,'+y]=look(TEXT.hallMirrorLook[i%4]);M.O['8,'+y]=look(TEXT.hallMirrorLook[(i+2)%4])}
 put(M,'sidetable',2,8);M.O['2,8']=look(TEXT.sideTable);
 put(M,'sidetable',8,14,1,1,{compact:!holdItem('compact')});M.O['8,14']={id:'ctable',name:'THE TABLE',look:()=>said(holdItem('compact')?TEXT.sideTable:TEXT.compactTable),opts:()=>holdItem('compact')?[]:[{label:TEXT.compactTake,run:async()=>{await pickup('compact');rebuild();checkpoint()}}]};
 put(M,'runner',4,3,3,18,{walk:1});
 open(M,5,H-1);M.warps['5,'+(H-1)]=async()=>{await said(TEXT.hallBack);await goTo('house',8,3,'down')};
 M.arrive=async()=>{if(!F.hallIn){F.hallIn=1;await cut('hallIn',()=>play(TEXT.hallIn));await horror(HORRORS.hall);if(!party.some(m=>!m.gone&&m.san>0))return gameOver();checkpoint()}};
 return M}
const MAPS={town:buildTown,house:buildHouse,upstairs:buildUpstairs,cafe:buildCafe,church:buildChurch,hall:buildHall};

// ================= MAIN STREET =================
// Marit: the key on the first day (at the gate), a liar about the house (Paranoia); Empathy's Read gets the reception
async function talkMarit(){const F=G.flags;await trigger('liar');
 if(!F.key){if(!F.marit1){F.marit1=1;await play(TEXT.marit1)}F.key=1;await play(TEXT.maritKey);rebuild();checkpoint()}
 else if(stepAt('Noticed'))await play(TEXT.maritNoticed);
 else await play(TEXT.maritDays[Math.min(TEXT.maritDays.length-1,day()-2)]||TEXT.maritDays[0]);
 if(!G.fs.used['opt:mread'])await hotspot({name:TEXT.marit,opts:[{use:'read',label:TEXT.maritRead,once:'mread',mod:()=>clam(),ok:()=>play(TEXT.maritReadDo),fail:()=>said(TEXT.maritReadFail)}]},'marit')}

// ================= BEV'S =================
// Bev: the gentleman and the pie (Persuade or Empathy, +10 with the Agnes intel; or plainly, once day 2's page is read,
// since he's in it: never a dead end)
async function talkBev(){const F=G.flags;
 if(!F.bev1){F.bev1=1;await play(TEXT.bev1);if(read()>=1)await play(TEXT.bevHat)}
 if(has('pie')){await play(TEXT.bevAfter[Math.min(TEXT.bevAfter.length-1,day()-1)]);return}
 if(stepAt('Noticed'))await play(TEXT.bevNoticed);
 const tell=async()=>{await play(TEXT.bevPie);clue('pie',TEXT.cPie);checkpoint()},m=()=>clam()+(intelOn('agnes')?10:0);
 await hotspot({name:TEXT.bevName,opts:[{use:'talk',label:TEXT.bevAsk,mod:m,ok:tell,fail:()=>play(TEXT.bevNo)},{use:'read',label:TEXT.bevAsk,mod:m,ok:tell,fail:()=>play(TEXT.bevNo)},
  {label:TEXT.bevPlain,show:()=>read()>=2,run:tell}]},'bev')}
// Dag Haugen: Toby (with care), the coffee urn, and on the sixth day, where the brothers were
async function talkDag(){const F=G.flags;
 if(!F.dag1){F.dag1=1;await play(TEXT.dag1);await play(TEXT.dagTom);checkpoint()}
 else if(day()>=6)await play(TEXT.dag6);else await play(TEXT.dagAfter);
 await hotspot({name:TEXT.dag,opts:[{use:'read',label:TEXT.dagRead,once:'toby',ok:()=>play(TEXT.dagReadDo),fail:()=>said(TEXT.dagReadFail)},
  {use:'talk',label:TEXT.dagAlibi,show:()=>day()>=6&&!has('haugen'),ok:findAlibi,fail:()=>said(TEXT.dagReadFail)},
  {use:'read',label:TEXT.dagAlibi,show:()=>day()>=6&&!has('haugen'),ok:findAlibi,fail:()=>said(TEXT.dagReadFail)}]},'dag')}
async function findAlibi(){await play(TEXT.dagAlibiDo);clue('haugen',TEXT.cHaugen);checkpoint()}

// ================= ST. BRIDGET'S =================
// Father Tom (days 1–5): the blessing and the old way (Persuade; free with the town intel; or Empathy), and the
// candle (motivation moment: Faith)
async function talkKessler(){const F=G.flags;
 if(!F.kessler1){F.kessler1=1;await play(TEXT.kessler1);if(intelOn('town'))await play(TEXT.kesslerHat)}
 if(has('blessing')){await play(TEXT.kesslerAfter[Math.min(2,day()-2)]||TEXT.kesslerAfter[0]);return}
 const tell=async()=>{await play(TEXT.kesslerBless);clue('blessing',TEXT.cBlessing);F.rite=1;checkpoint()};
 await hotspot({name:TEXT.kessler,opts:[{label:TEXT.kesslerAsk,show:()=>intelOn('town'),run:tell},
  {use:'talk',label:TEXT.kesslerAsk,show:()=>!intelOn('town'),ok:tell,fail:()=>play(TEXT.kesslerNo)},
  {use:'read',label:TEXT.kesslerPlain,show:()=>!intelOn('town'),ok:tell,fail:()=>play(TEXT.kesslerNo)}]},'kessler')}
// the candle with Father Tom (motivation moment: Faith): a horror for the Faith holders, then they regain 1d4
function candleOpts(){const F=G.flags;if(F.faith||day()>=6||isNight())return[];const fs=holdersOf('Faith');if(!fs.length)return[];
 return[{label:TEXT.candleOpt,run:async()=>{F.faith=1;await play(TEXT.candleDo);await horror(HORRORS.candle,{who:fs});for(const m of fs)await motivate(m);checkpoint()}}]}
// the parish register: Agnes's real hand (History or Bureaucracy, +10 with the letter intel; or Stealth, seen if it fails)
function cabOpts(){if(has('register'))return[];const m=()=>intelOn('letter')?10:0,get=async()=>{await play(TEXT.cabDo);await gotHand('register',TEXT.cRegister)};return[
 {use:'records',label:TEXT.cabRecords,mod:m,ok:get,fail:()=>said(TEXT.cabFail)},
 {use:'paper',label:TEXT.cabPaper,mod:m,show:()=>day()<=5&&!isNight(),ok:async()=>{await said(TEXT.cabPaperDo);await get()},fail:()=>said(TEXT.cabFail)},
 {use:'sneak',label:TEXT.cabSneak,ok:async()=>{await said(TEXT.cabSneakDo);await get()},fail:async()=>{await said(TEXT.cabSneakDo);await overstepHere('seen')}}]}
async function gotHand(id,text){clue(id,text);if(!holdItem('hand'))await pickup('hand');checkpoint()}
async function findLetters(){await play(TEXT.trunkDo);await gotHand('letters',TEXT.cLetters)}
// the rectory's bathroom on the sixth day: read the scene (Forensics or Search), then his reflection steps out
function bathOpts(){const F=G.flags;if(day()<6)return[];
 const opts=[];if(!has('rectory')){const ok=async()=>{await play(TEXT.bathDo);await horror(HORRORS.bath);clue('rectory',TEXT.cRectory);checkpoint();await priestFight()};
  opts.push({use:'examine',label:TEXT.bathExam,ok,fail:async()=>{await said(TEXT.bathFail);await priestFight()}},{use:'sweep',label:TEXT.bathSweep,ok,fail:async()=>{await said(TEXT.bathFail);await priestFight()}})}
 else if(!F.priest)opts.push({label:'Look at the mirror',run:priestFight});
 return opts}
async function priestFight(){const F=G.flags;if(F.priest||isNight())return;
 await cut('priest',()=>play(TEXT.priest1));
 const r=await battle(['priest'],{story:true,intro:TEXT.priestIntro});if(r==='lose')return gameOver();
 F.priest=1;await play(TEXT.priestDone);checkpoint();
 await overstepHere(G.fs.lastLoud?'public':'seen')}

// ================= 9 ORCHARD ROW =================
async function houseArrive(){const F=G.flags;
 if(!F.house1){F.house1=1;await cut('house',()=>play(TEXT.houseIn));checkpoint()}
 if(isNight()&&day()===3&&!F.sheets)return sheetsFight();
 const o=obsessed();if(o&&!isNight()&&day()>=3&&G.fs.obsDay!==day()){G.fs.obsDay=day();await said(TEXT.obsessLines[day()%TEXT.obsessLines.length],{n:o.name})}}
// the reading desk: one page a day (rule 1), the back pages once the last page is read
function deskOpts(){const F=G.flags,out=[];
 if(read()<day()&&!isNight())out.push({label:TEXT.deskRead,run:()=>readEntry(read()+1)});
 if(read()>=7&&!F.back)out.push({label:TEXT.deskBack,run:readBack});
 return out}
async function readEntry(n){const F=G.flags;if(n>7||n>day())return;
 if(n===1){await said(TEXT.deskRead1);if(!holdItem('diary'))await pickup('diary')}
 F.read=n;await play(TEXT.diary[n]);
 const ids=[null,'healed','visits','book','refused','glass','forged','ledger'];clue(ids[n],TEXT.cDiary[n]);checkpoint();
 if(n===4)await horror(HORRORS.day4);
 if(n===5&&!F.deduce){F.ringing=1;await said(TEXT.ring)}
 if(n===7)await lastPage();
 checkpoint()}
// The last page (the obsession): unless a teammate brought them back on the sixth night, it's a Breaking Point for the
// obsessed agent (disorder, give up a motivation, or lean on a Bond: field.js), no SAN lost. Everyone else: a horror.
async function lastPage(){const F=G.flags,o=obsessed();
 if(o&&!F.anchored&&!o.noBP&&!F.bpDone){F.bpDone=1;await said('{n} reads the last line twice. Then {n.they} {n:sits|sit} down on the parlor floor, very carefully, like the floor might not be there.',{n:o.name});await breakingPoint(o,'unnatural','mirrors');applySan()}
 await horror(HORRORS.last,{who:live().filter(m=>m!==o||F.anchored||o.noBP)})}
async function readBack(){const F=G.flags;F.back=1;await play(TEXT.back);await horror(HORRORS.back);checkpoint()}
// the hall mirror: cover it (once its glass is known), and, once you know her page is in the house, behind its backing
function coverOpt(k){const F=G.flags;if(F[k]||!has('glass'))return[];return[{label:TEXT.mirrorCover,run:async()=>{F[k]=1;await said(TEXT.coverDo);rebuild();checkpoint()}}]}
function hallOpts(){const F=G.flags,out=coverOpt('cHall');
 if(!holdItem('page')&&!F.pageGone&&(has('forged')||has('stillhere'))){const ok=async()=>{await play(TEXT.hallBehindDo);await pickup('page');checkpoint()};
  out.push({use:'sweep',label:TEXT.hallBehind,ok,fail:()=>said(TEXT.hallBehindFail)},{use:'fix',label:TEXT.hallFix,ok,fail:()=>said(TEXT.hallBehindFail)})}
 return out}
// the kitchen phone: dead till the third day; Ruth (motivation moment: Family) from the third; Big Hat on the fifth
function phoneOpts(){const F=G.flags,out=[];
 if(F.ringing&&!F.deduce)out.push({label:TEXT.phonePick,run:deduce});
 if(day()>=3&&!F.ruth&&!isNight())out.push({label:TEXT.ruthOpt,run:callRuth});
 if(!out.length)out.push({label:TEXT.phonePick,run:()=>said(TEXT.phoneDead)});
 return out}
async function callRuth(){const F=G.flags;F.ruth=1;await play(TEXT.ruth.slice(0,2));await play(TEXT.ruthCut);await horror(HORRORS.ruth);await play(TEXT.ruth.slice(2));
 clue('ruth',TEXT.cRuth);const fs=holdersOf('Family');if(fs.length){await said(TEXT.ruthFamily);for(const m of fs)await motivate(m)}checkpoint()}
// The deduction (Gameplay loop, Deduction), on the kitchen phone on the fifth day: what's in that house? Right needs
// `refused` and `glass` plus one of `blessing`, `ruth`, `pie`; the man with the book needs `book`. A wrong answer costs
// SAN when the next night comes, never progress: the day turns either way.
async function deduce(){const F=G.flags;if(F.deduce)return;
 await hunch(TEXT.hunch);
 await play(TEXT.hatCall);
 const right=()=>has('refused')&&has('glass')&&(has('blessing')||has('ruth')||has('pie'));
 let r=await ask('BIG HAT',TEXT.hatAsk,TEXT.hatOpts);
 // Loose thread (an arc perk, spec 008): once per case, a wrong answer costs nothing and you can answer again
 const lt=!(r===1&&right())&&live().find(m=>perkOn(m,'truth'));
 if(lt){await say('',fillT(BLS.HOMEW.perkUsed,{p:BLS.HOMEW.perks.truth[0],n:lt.name}));r=await ask('BIG HAT',TEXT.hatAsk,TEXT.hatOpts)}
 if(r===1&&right()){F.deduce='right';await play(TEXT.hatRight)}
 else if(r===1){F.deduce='noproof';await play(TEXT.hatNoProof)}
 else if(r===2&&has('book')){F.deduce='half';await play(TEXT.hatHalf)}
 else if(r===2){F.deduce='noproof';await play(TEXT.hatNoHalf)}
 else{F.deduce='wrong';await play(TEXT.hatWrong)}
 checkpoint()}
// the vanity: Agnes's compact in the drawer (Search), the cover; the hidden hotspot is its mirror (High only)
function vanityOpts(){const out=[];if(!holdItem('compact'))out.push({use:'sweep',label:TEXT.vanitySweep,once:'drawer',ok:async()=>{await said(TEXT.vanityFind);await pickup('compact');checkpoint()},fail:()=>said(TEXT.vanityNone)});
 return out.concat(coverOpt('cVan'))}
async function readVanity(){await play(G.flags.cVan?TEXT.vanityHighCovered:TEXT.vanityHigh);await horror(HORRORS.vanity);if(!has('stillhere')){clue('stillhere',TEXT.cStill);checkpoint()}}

// ================= THE DAY'S TURN =================
// The guest bed: needs the day's page; the fifth day's needs Big Hat's call too. Go on / Not yet, naming what closes.
function bedOpts(){const F=G.flags;
 if(isNight()&&day()===3)return F.sheets?[{label:TEXT.bedOpt,run:()=>morning()}]:[];
 if(isNight())return[];
 return[{label:TEXT.bedOpt,run:sleep}]}
async function sleep(){const F=G.flags;
 if(day()===7){await said(TEXT.bed7);return}
 if(read()<day()){await said(TEXT.bedUnread);return}
 if(day()===5&&!F.deduce){await said(TEXT.bedPhone);return}
 const r=await askNotYet(TEXT.sleepQ+' '+(day()===5?TEXT.sleepClose5:TEXT.sleepClose),TEXT.turnOpts);if(r!==0)return;
 await nightOf(day())}
// each night: a short scene in the house; the third is played (the sheets), the rest go straight to morning
async function nightOf(d){const F=G.flags;
 await fade(1);
 if(d===3){F.nt=1;goMap('house',8,4,'down');banner(TEXT.night3Banner);checkpoint();await fade(0);await trigger('night');return sheetsFight()}
 G.mode='world';await fade(0);
 if(F.deduce==='wrong'&&!F.wrongPaid&&d>=5){F.wrongPaid=1;await said(TEXT.wrongCost);live().forEach(m=>{m.san=Math.max(1,m.san-1)});applySan()}
 if(d===1){await play(TEXT.night[1]);await horror(HORRORS.night1);if(!has('lag'))clue('lag',TEXT.cLag)}
 if(d===2){const o=live().slice().sort((a,b)=>a.san-b.san)[0];if(o){F.obs=o.a.id;const nm={n:o.name,N:o.name.toUpperCase()};await play(TEXT.night[2],nm);
  await horror(Object.assign({label:fillT(TEXT.nightH[2],{n:o.name})},HORRORS.night2),{who:[o]})}}
 if(d===4){await play(TEXT.night[4]);await horror(HORRORS.night4)}
 if(d===5)await play(TEXT.night[5]);
 if(d===6)await sleepwalk();
 await morning()}
async function morning(){const F=G.flags;
 await fade(1);F.nt=0;F.day=day()+1;await rest(.5);goMap('upstairs',7,5,'down');banner(TEXT.phase[day()-1]);checkpoint();await fade(0);
 if(TEXT.morning[day()])await said(TEXT.morning[day()]);
 await trigger('rest')}
// the sixth night: the obsessed agent sleepwalks to the hall mirror. A teammate brings them back (Empathy: Calm, or
// Read at −20); brought back, the last page is a horror for them, not a Breaking Point.
async function sleepwalk(){const F=G.flags,o=obsessed();if(!o)return;const n={n:o.name};
 await play(TEXT.night[6],n);
 const ms=live().filter(m=>m!==o);if(!ms.length){await said(TEXT.sleepwalkNone,n);return}
 const i=await choose(ms.map(m=>{const c=skillVal(m.a,'Empathy')>=75?chanceOf(m,'Empathy'):chanceOf(m,'Empathy',-20);return`${m.name} · Empathy ${c}%`}),{title:fillT(TEXT.sleepwalkQ,n).toUpperCase().slice(0,30)});
 const m=ms[i<0?0:i],c=skillVal(m.a,'Empathy')>=75?chanceOf(m,'Empathy'):chanceOf(m,'Empathy',-20),x=SR.pct(c);
 await say('',m.name+': '+resultLine('BRING '+o.name.toUpperCase()+' BACK · EMPATHY',x),{auto:1200});
 if(x.ok){F.anchored=1;await play(TEXT.sleepwalkOk,n)}else{tried(m,'Empathy');await play(TEXT.sleepwalkFail,n)}}
// the seventh day's turn: the parlor window, Go on / Not yet, naming what closes
async function waitForDark(){const F=G.flags;if(isNight())return;
 if(read()<7){await said(TEXT.bedUnread);return}
 const r=await askNotYet(TEXT.duskQ+' '+TEXT.duskClose,TEXT.turnOpts);if(r!==0)return;
 await fade(1);F.nt=1;await play(TEXT.dusk);goMap('house',3,3,'up');banner(TEXT.night7Banner);checkpoint();await fade(0);await trigger('night')}

// ================= THE THIRD NIGHT: THE SHEETS =================
async function sheetsFight(){const F=G.flags;if(F.sheets)return;
 await cut('sheets',()=>play(TEXT.sheets1));
 EN.sheet.acts={smother};
 const r=await battle(['sheet','sheet'],{story:true,intro:TEXT.sheetsIntro});if(r==='lose')return gameOver();
 F.sheets=1;await play(TEXT.sheetsDone2);rebuild();checkpoint()}
// Smother: a sheet wraps an agent's head; they lose their next turn
async function smother(e){const ts=party.filter(m=>!m.ko&&!m.dead&&!m.gone&&!m.out);const t=pick(ts);if(!t)return;
 const o=SR.pct(e.hit);if(!o.ok){await bsay(`A sheet swings for ${t.name}'s head and catches air.`,900);return}
 const d=roll(1,3);await bsay(`A sheet wraps around ${t.name}'s head and pulls tight. ${d} damage.`,1100);await hurtAgent(t,d,e);if(!t.ko)t.skip=1}

// ================= THE BOSS =================
// The boss waits for you (Gameplay loop; play.md): Go in / Not yet at the big mirror, cursor on Not yet
async function bossAsk(){const F=G.flags;if(F.boss)return;
 const r=await askNotYet(TEXT.bigQ+' '+TEXT.bigClose,TEXT.gateIn);
 if(r===0)return bossFight();
 G.dir='down';await stepBack()}
// The other Agnes (Bosses; Combat numbers; tuned Nov 25, 2026 with tools/boss-sim.js). 62 HP; −6 for the right
// deduction (Identify free), −6 with all three mirrors covered, −8 with her page found (42 with all three, 32% off).
// Phase 1, kind: a reach (5), the mirrors cracking at everyone (2), the offer (1, 0/1 SAN). Phase 2 at half: +5% to hit,
// one more reach and crack; a shield takes 1 off every hit until her own hand is shown to her, and she heals 1 a turn
// through an uncovered mirror unless all three are covered. Her own face (the compact) is her weakness.
async function bossFight(o={}){
 const F=G.flags;F.bossSeen=1;
 await cut('boss',async()=>{await play(TEXT.boss1);await said(TEXT.bossSay);const ob=obsessed();if(ob)await said(TEXT.bossSay2,{o:ob.name});await said(TEXT.bossSayNo)});
 checkpoint();
 const E=EN.agnes,right=F.deduce==='right',cov=mirrorsCovered(),page=holdItem('page');
 E.onHurt=(e,d)=>e.ph2&&!G.flags.shown&&d>0?Math.max(1,d-(e.shield|0)):d;
 E.onTurn=async e=>{if(!e.ph2||e.hp>=e.mhp)return;if(mirrorsCovered()){if(!e.saidNoHeal){e.saidNoHeal=1;await bsay(TEXT.bossNoHeal,1200)}return}const h=Math.min(e.heal|0,e.mhp-e.hp);if(!h)return;e.hp+=h;await bsay(fill(TEXT.bossHeal,{n:h}),1100)};
 E.phase2={at:.5,hit:5,moves:{hit:1,all:1},line:TEXT.bossPhase,on:async e=>{await bsay(G.flags.shown?TEXT.bossShown:TEXT.bossShield,1600);if(has('stillhere')){await bsay(TEXT.bossStill,1600);e.stun=Math.max(e.stun,1)}}};
 const cuts=(right?6:0)+(cov?6:0)+(page?8:0),hp=E.hp-cuts;
 const r=await battle(['agnes'],{boss:true,hp,intro:TEXT.bossIntro,onStart:async()=>{
  if(cuts)await bsay(TEXT.bossThin,1500);
  if(right){G.fs.ident=G.fs.ident||[];if(!G.fs.ident.includes('en:agnes'))G.fs.ident.push('en:agnes');await bsay(TEXT.bossIdent,1500)}
  if(holdItem('hand'))await bsay(TEXT.bossHand,1400)}});
 if(r==='lose')return gameOver();
 if(o.noEnd)return;  // the simulator stops at the fight's end
 F.boss=1;checkpoint();await afterBoss();
}
window.l02Boss=()=>bossFight({noEnd:true});  // the boss simulator's entry (tools/boss-sim.js)
// After the fight: what to do with her (the arc's three options; never a dead end). Burn her page (it needs the page
// in hand: History proves it a forgery, Science burns it right; each agent tries each once, a fail costs 1 SAN), the old
// way (an agent's life, with two or more left), or walk away (the 9 follows).
async function afterBoss(){const F=G.flags;
 await play(TEXT.after);
 for(;;){
  const opts=[],acts=[];
  if(holdItem('page')&&!F.burnOut){opts.push(TEXT.endBurn);acts.push(burnPage)}
  opts.push(TEXT.endGive);acts.push(givePage);
  opts.push(TEXT.endWalk);acts.push(async()=>{F.agnes='walk';await play(TEXT.walkDo);return true});
  const i=await ask('',TEXT.endQ,opts);if(i<0)continue;
  if(await acts[i]())break}
 await ending()}
async function burnPage(){const F=G.flags;F.tries=F.tries||{h:[],s:[]};
 await said(TEXT.burnNeed);
 // History: prove it a forgery (+20 knowing her real hand; sure with the real Agnes's word from the vanity)
 if(!F.burnH){if(has('stillhere')){await said(TEXT.burnHistSure);F.burnH=1}
  else{const ms=live().filter(m=>!F.tries.h.includes(m.a.id));if(!ms.length)return burnFails();
   const m=ms.sort((a,b)=>chanceOf(b,'History',knowsHand()?20:0)-chanceOf(a,'History',knowsHand()?20:0))[0];F.tries.h.push(m.a.id);
   const x=SR.pct(chanceOf(m,'History',knowsHand()?20:0));await said(TEXT.burnHist,{n:m.name});await say('',m.name+': '+resultLine('HISTORY',x),{auto:1200});
   if(!x.ok){tried(m,'History');await failCost(m);checkpoint();return false}F.burnH=1}}
 // Science: burn it right
 const ms=live().filter(m=>!F.tries.s.includes(m.a.id));if(!ms.length)return burnFails();
 const m=ms.sort((a,b)=>chanceOf(b,'Science')-chanceOf(a,'Science'))[0];F.tries.s.push(m.a.id);
 const x=SR.pct(chanceOf(m,'Science'));await said(TEXT.burnSci,{n:m.name});await say('',m.name+': '+resultLine('SCIENCE',x),{auto:1200});
 if(!x.ok){tried(m,'Science');await failCost(m);checkpoint();return false}
 F.agnes='burn';const h=holderOf('page');if(h){h.it.u=1;spend(h.m,h.it)}G.fs.pack=(G.fs.pack||[]).filter(it=>it.k!=='page');
 await play(TEXT.burnDo);const o=obsessed();if(o)await motivate(o);checkpoint();return true}
async function failCost(m){await said(TEXT.burnFail,{n:m.name});m.san=Math.max(1,m.san-1);applySan()}
async function burnFails(){G.flags.burnOut=1;await said(TEXT.burnOut);return false}
async function givePage(){const F=G.flags,ms=live();
 if(ms.length<2){await said(TEXT.giveOne);return false}
 const o=obsessed(),order=o?[o,...ms.filter(m=>m!==o)]:ms;
 const i=await choose(order.map(m=>m.name).concat(['No one']),{cancel:true,title:TEXT.giveQ.toUpperCase()});if(i<0||i>=order.length)return false;
 const m=order[i];const ok=await ask('',TEXT.giveSure,[TEXT.giveNo,TEXT.giveYes]);if(ok!==1)return false;
 F.agnes='sacrifice';F.given=m.a.name;await play([TEXT.giveLine]);await play(TEXT.giveDo,{n:m.name});
 await loseAgent(m,'the glass');
 await horror(Object.assign({label:fillT(TEXT.giveH,{n:m.name})},HORRORS.given));
 checkpoint();return true}

// ================= OVERSTEPPING (Skills and menus, Overstepping and cover stories) =================
// A quiet case: the agents came as appraisers. A climb plays its line, then the step's scene: Noticed (Bev and Marit
// clam up), Sheriff Pell (Local chief), Big Hat's call (Agency call), and the clean-up crew at the next area change.
async function overstepHere(seen){if(!(await overstep(seen)))return;await stepScene()}
async function stepScene(){
 const F=G.flags,s=stepName();
 if(s==='Noticed'&&!F.noticed){F.noticed=1;await play(TEXT.noticed)}
 if(s==='Local chief'&&!F.chief){F.chief=1;await play(TEXT.chief)}
 if(s==='Agency call'&&!F.call){F.call=1;await play(TEXT.call)}
 if(s==='Federal agents')F.fedsDue=1;
 checkpoint()}
async function onArea(){if(G.flags.boss)return;await feds(TEXT,play)}

// ================= ENDING =================
// clean: her page burned. costly: the old way, an agent's life. worst: walked away, and the 9 follows.
function endingLabel(){const a=G.flags.agnes;return a==='burn'?'clean':a==='sacrifice'?'costly':a==='walk'?'worst':'costly'}
const lostHere=()=>(store.get(B.key('memorial'),[])||[]).filter(x=>x&&x.case===G.case&&!x.done);
// what the debrief and later agency cases read (bl.season, the case's facts). arc: the finale's contract (agnes, nine,
// nineFrom, ledgerCopy); season.js's arcTally merges it and arcNine plays the 9 in every later case after a walk-away.
function endingFacts(label){const F=G.flags,ag=F.agnes||(label==='clean'?'burn':label==='worst'?'walk':'sacrifice');
 return{label,clues:G.clues.map(c=>c.id),saved:0,overstep:stepName(),
  san:party.map(m=>({id:m.a.id,name:m.name,from:m.san0,to:m.san})),
  items:party.flatMap(m=>gearOf(m).it.filter(it=>it.pin).map(it=>it.k)).concat((G.fs.pack||[]).filter(it=>it.pin).map(it=>it.k)),
  choices:{deduce:F.deduce||null,mirrors:mirrorsCovered(),shown:!!F.shown,page:F.agnes==='burn'?'burned':holdItem('page')?'kept':'never',faith:!!F.faith,ruth:!!F.ruth,
   brothers:F.brothers||null,ducked:!!F.ducked,anchored:!!F.anchored,given:F.given||null,stillhere:has('stillhere')},
  arc:{agnes:ag,nine:ag==='walk',nineFrom:'lantern-02',ledgerCopy:!!F.back},
  tried:party.map(m=>({id:m.a.id,skills:m.tried||[]})),
  lost:lostHere().map(x=>({name:x.name,how:x.how}))}}
async function ending(){
 const F=G.flags;
 if(!holdItem('diary'))await pickup('diary');
 if(endingLabel()!=='clean')await trigger('death');
 await fade(1);G.mode='scene';await fade(0);
 await said(TEXT.dawn);
 await brothers();
 const label=endingLabel();await debrief(label,endingFacts(label));  // Big Hat's debrief and the case gains (debrief.js)
}
// The dawn: the Haugens in the sheriff's cruiser for Father Tom. Say nothing (a helplessness horror for all), or tell
// the truth (a true report: overstepping climbs one step, no roll).
async function brothers(){const F=G.flags;if(F.brothers)return;
 await play(TEXT.brothers1);
 const r=await ask('',TEXT.brothersQ,TEXT.brothersOpts);
 if(r===1){F.brothers='true';await play(TEXT.brothersTrue);if(has('haugen'))await play([TEXT.brothersAlibi]);
  const s=loadSeason(),st=stepsOf(),cur=s.overstep|0;if(cur<st.length-1){s.overstep=cur+1;store.set(seasonKey(),s);G.fs.climbed=1;await say('',BLS.OVERSTEP.climb[st[s.overstep]]||'')}}
 else{F.brothers='carry';await play(TEXT.brothersCarry);await horror(HORRORS.brothers)}
 checkpoint()}

// ================= THE DEBRIEF (spec 007) =================
// The clues the card counts, Big Hat's lines by ending and about the choices, the will (every ending) and the back
// pages if they were read, the cover stories (2 with a skill, the weak Luck one, the easy one for a quiet case kept
// Clean, Clean books'), and the lines after the diary and the page are bagged. Nobody to keep safe in this one.
const DB=TEXT.db;
const DEBRIEF_DATA={
 clues:['healed','visits','book','refused','glass','forged','ledger','lag','pie','blessing','ruth','register','rectory','haugen','stillhere'],victims:0,
 lines:{clean:DB.clean,costly:DB.costly,worst:DB.worst},
 react:F=>{const c=F.choices||{},out=[];if(c.brothers==='carry')out.push(DB.brothersCarry);if(c.brothers==='true')out.push(DB.brothersTrue);
  if(c.given)out.push(DB.given);if(c.deduce==='wrong')out.push(DB.wrong);if(c.ducked)out.push(DB.tape);return out.slice(0,2)},
 get end(){const F=(G.db&&G.db.facts)||{};return DB.will.concat(F.arc&&F.arc.ledgerCopy?DB.wren:[])},
 stories:[{name:DB.furnace,skill:'Bureaucracy',verb:'paper it',pass:DB.furnacePass},{name:DB.sold,skill:'Persuade',verb:'sell it',pass:DB.soldPass}],
 weak:{name:DB.weak,pass:DB.weakPass},
 easy:{name:DB.easy,skill:'Persuade',verb:'sell it',mod:30,pass:DB.easyPass},
 safe:{name:DB.safe,pass:DB.safePass},
 bagged:{diary:DB.filed,page:DB.filedPage}
};

// ================= OPENING (Big Hat's briefing in the ice house on Lake Tamarack) =================
// Each cut is a cutscene B skips once seen (engine.js); the questions and requisition always play.
async function caseOpening(){
 await cut('open',async()=>{await said(TEXT.open1);await said(TEXT.open2)});
 await bigHatScene(async()=>{
  await cut('brief',async()=>{await play(TEXT.brief);await shout(TEXT.briefShout);await play(TEXT.brief1b)});
  await twoQuestions(TEXT.intel);
  await cut('brief2',()=>play(TEXT.brief2));
  await requisition();
  await cut('brief3',()=>play(TEXT.brief3));
 },{place:window.L02A.icehouse});
 G.flags.day=1;G.flags.nt=0;G.mode='world';goMap('town',35,9,'up');banner(TEXT.phase[0]);checkpoint();await fade(0);
 await cut('arrive',async()=>{
  for(const m of squad())await say(m.name.toUpperCase()+' · '+profOf(m.a).name.toUpperCase(),TEXT.role[profOf(m.a).role]||TEXT.roleAny);
  await said(TEXT.arrive)});
}
// the Case file's Next line
const caseNext=()=>{const N=TEXT.next,F=G.flags,d=day();
 if(F.boss)return N.home;if(night7())return N.night;if(isNight())return N.night3;
 if(!F.key)return N.key;if(read()<d)return N.read.replace('{d}',d);if(d===5&&!F.deduce)return N.phone;if(d===7)return N.dusk;return N.town.replace('{d}',d)};

// ================= ON THE CASE BOARD =================
// An agency case (spec 009, step 3): seasons/season-1.js lists it, its unlock count and Big Hat's unlock lines.
// Closing it never raises closed (case-board.js). portraits: the townsfolk's faces (lantern-02-art.js) and the boss's
// (lantern-02-battle-art.js). sprite/spriteSize: battle sprites (the clean-up agent is Still Harvest's SHB).
registerCase({id:'lantern-02',card:caseCard,opening:caseOpening,intel:TEXT.intel,maps:MAPS,tiles:{},
 portraits:name=>window.L02A.portraits[name]||(name==='THE OTHER AGNES'?window.L02B.portrait:null),
 enemies:EN,sprite:(k,f,w)=>k==='fed'&&window.SHB?SHB.sprite('fed',f,w):L02B.sprite(k,f,w),spriteSize:k=>k==='fed'&&window.SHB?SHB.size('fed'):L02B.size(k),
 backdrop:(p,o)=>L02B.backdrop(p,o),
 get place(){return window.L02A&&L02A.icehouse},  // Big Hat's place for this case: the briefing passes it, and the debrief plays there too
 items:CASE_ITEMS,next:caseNext,quiet:true,loot:LOOT,onArea,
 debrief:DEBRIEF_DATA,label:endingLabel,facts:endingFacts});
})();
