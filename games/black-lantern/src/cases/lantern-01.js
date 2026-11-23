// Black Lantern · cases/lantern-01.js
// CASE: LANTERN 01, the first agency case (spec 014). SPOILERS for the case live in story/cases/lantern-01.md only.
// Part A (Nov 23, 2026): the black folder card, every map by day and night, the townsfolk on the map and in the dialog
// box, Big Hat's own briefing place, and stand-in scripts so every map walks and every door goes where it should, with a
// placeholder briefing, unlock scene and Go on / Not yet at the case's points of no return. No clues, fights or story
// yet: those are part B, written from the secret case file.
// Art is cases/lantern-01-art.js (window.L01A), loaded right after this file. Needs engine.js and field.js first.
// The whole file sits in one function so its names never meet another case's (every case loads as a plain script).
(function(){

// ================= TEXT =================
// Every line of the case. A list plays box by box: a plain string is narration, ['WHO', 'line'] is someone talking.
// Part A's lines are stand-ins, kept plain; part B rewrites them from the case file in Keegan's voice.
const TEXT={
 next:['Day. Walk Marine Drive. When you\'re ready, wait for dark at the loft\'s window.','Night. The cannery\'s side door is open.'],
 phase:['DAY · RAIN','NIGHT · RAIN'],
 // ---- the unlock scene on the board (spec 009, step 3; stand-in lines, part B writes them) ----
 unlock:['Sit. Somethin\'s come down from upstairs.','This one\'s ours.'],
 // ---- the briefing (stand-in) ----
 open1:'TUESDAY · 9:40 PM · 41°F · RAIN',
 open2:'A text from an unlisted number: "MARINE DRIVE. THE OLD LIGHTSHIP. GANGWAY\'S UNLOCKED."',
 brief:['The wheelhouse of a lightship tied up for good, after hours. Rain on every window.',['BIG HAT','Agent {code}. Wipe your feet. It\'s a museum.'],
  'He\'s standing at the ship\'s wheel like he\'s steering it somewhere.',['BIG HAT','Abel Teague. Code name SEXTON. One of ours.'],['BIG HAT','Stand-in briefin\'. The real one comes with the story.']],
 // Big Hat's four topics (spec 013): their edges come in part B
 intel:[
  {id:'sexton',label:'Sexton',answer:['Abel Teague. Nineteen years in.','Longest I ever had.'],note:'Agent Teague, code name SEXTON, has nineteen years in the field.'},
  {id:'mail',label:'His mail',answer:['His reports went up.','Nothin\' came back down.'],note:'Teague\'s reports went up the line. No answer came back.'},
  {id:'town',label:'The town',answer:['Cannery town.','Every bar on Marine Drive knows his stool.'],note:'Teague drank on Marine Drive. The bars know him.'},
  {id:'rain',label:'The rain',answer:['February. It don\'t stop.','Keep your powder dry.'],note:'It rains all February in Astoria.'}],
 brief2:[['BIG HAT','You go in quiet. You\'re family, come to check on him.'],['BIG HAT','He\'s one of ours. Bring him home, or bring me why not.']],
 arrive:'LANTERN 01 (stand-in). Walk Marine Drive with A. Wait for dark at the loft\'s window to move on to night. START for your notebook.',
 // ---- doors, the street and the day ----
 edge:'Marine Drive goes on in the rain. Not yet.',
 postShut:'POST OFFICE. Closed. HOURS 9–5, and a wet flyer about a lost cat.',
 canneryShut:'The cannery\'s side door. Chained. CLOSED FOR SEASON, in paint that\'s older than you.',
 canneryQ:'The chain on the cannery\'s side door hangs loose. Inside, water is running somewhere.',
 gateIn:['Go in','Not yet'],
 retortQ:'Big steel doors: RETORT ROOM. Water seeps out under them, and it\'s warm.',
 retortIn:'(Stand-in: what waits in here comes in part B.)',
 canneryOut:'The side door, back out to Marine Drive.',
 van:'The van. A rental, a little too clean, with a parking ticket already under the wiper.',
 shelter:'A bus shelter. The schedule\'s behind plastic, and the plastic\'s fogged on the inside.',
 // ---- the day's turn: the loft's window (Go on / Not yet, naming what closes) ----
 windowName:'THE WINDOW',windowLook:'The window over the river. Rain on the glass, the bridge lights out past it.',windowOpt:'Wait for dark',
 duskQ:'Wait here till dark?',
 duskClose:'The post office closes for the night.',
 turnOpts:['Go on','Not yet'],
 dusk:['The light goes gray, then grayer, then it\'s just the bridge\'s lights and the rain.','Down on Marine Drive the post office\'s sign clicks off.'],
 // ---- the hidden hotspot: only there while the lead is High on Mushrooms (stand-in result) ----
 mirrorName:'THE MIRROR',mirrorLook:['The mirror runs a few seconds behind the room. Someone\'s in it who isn\'t in here.','(Stand-in: what it means comes in part B.)'],
 rack:'COAT RACK',rackLook:'A coat rack by the door, three wet coats deep. A yellow oilskin on top.',rackOpt:'Check the pockets',
 rackFind:'In the oilskin, a paper bag of dried little mushrooms. FOR MY KNEES, in pencil.',
 // ---- people (stand-ins) ----
 folk:{
  teague:[['TEAGUE','Evening.'],'He doesn\'t seem to notice the rain running into his eyes.',['TEAGUE','Can\'t stop. I\'ve got to get the mail.']],
  teagueN:[['TEAGUE','Evening.'],['TEAGUE','You\'re letting the cold in.']],
  inga:[['MRS. HALVORSEN','You\'re here about Abel? Come in, come in, you\'re soaked.'],'The cat on her shoulder watches the ceiling.',['MRS. HALVORSEN','He\'s paid up. He\'s always paid up.']],
  ray:[['RAY','Window\'s open till five.'],['RAY','I can\'t open a box without paper. You know that. Everybody knows that.']],
  mo:[['MO','What can I get you.'],['MO','His stool\'s the one by the jukebox. Nobody sits there. Not a rule. Just don\'t.']],
  hap:[['HAP','You hear that, Marjorie? Strangers.'],'He\'s talking to the pickled egg jar.',['HAP','Abel used to buy me one of those. Then he quit eating.']],
  walker:'A woman in a red poncho walks a dog in four little rubber boots. Neither of them looks at the river.',
  dog:'The dog in the boots stops, stares at the cannery, and won\'t move till it\'s pulled along.',
  fisher:'A man in orange rain gear fishes off the pier under the light. He hasn\'t caught anything. He doesn\'t look like he wants to.'
 },
 // ---- looks around the maps (part B gives them skills and clues) ----
 look:{
  river:'The Columbia, gray and wide and going out. Somewhere under it, a sea lion barks.',
  pier:'The pier\'s planks are slick with rain. The rail\'s been patched with rope.',
  barrel:'A blue barrel by the pier steps. BRINE, in marker. It smells like the ocean got stored.',
  rail:'The old rail line. The trolley runs in summer. It\'s not summer.',
  bench:'A bench with a brass plaque: FOR LEIF, WHO LOVED THE RIVER. Wet through.',
  car:'A parked car, fogged up. A bumper sticker: I\'D RATHER BE CRABBING.',
  flag:'The post office flag, soaked and stuck to its pole.',
  snag:'THE SNAG TAVERN. A neon fish over the door with half its letters out.',
  cannery:'BAY PACKING CO., faded across a cannery as big as a church. The loading doors are rusted shut.',
  stairs:'Wooden stairs up the cannery\'s side to the loft, every step a different board.',
  house:'A tall narrow house, painted blue once. A wind chime made of old keys.',
  // loft
  wall:'A wall of string, photos and paper, pinned in rows. Page numbers circled in red.',
  cot:'An army cot, made with hospital corners. Nobody\'s slept in it.',
  hotplate:'A hot plate and a can of chili with the lid peeled back. The chili\'s gone gray.',
  floor:'One floorboard sits a hair higher than the others.',
  phone:'An old landline on a crate. The cord\'s been taped where it frayed.',
  books:'A stack of books with the library stickers scraped off.',
  // the Snag
  bar:'The bar. Forty years of elbows worn into it.',
  eggs:'A big jar of pickled eggs, cloudy. Somebody\'s drawn a face on it in grease pencil.',
  jukebox:'The jukebox. Every song on it is about a boat.',
  pool:'The pool table. The 8-ball\'s been replaced by a crab float.',
  register:'An old brass register. A wad of napkins tucked in behind the drawer.',
  stool:'The stool by the jukebox. Nobody\'s on it. Nobody\'s been on it in a while.',
  // the post office
  counter:'The post office counter. A bell, a scale, a cup of pens on chains.',
  boxes:'Brass PO boxes, floor to ceiling. Box 418 has a slip stuck in its little window.',
  stamps:'A poster of stamps: LIGHTHOUSES OF THE NORTHWEST.',
  // the Halvorsen house
  sofa:'A sofa with an afghan on it in every color they had.',
  tv:'The TV\'s on mute. The weather: rain, with a little picture of rain.',
  ledger:'A rent ledger on the side table, a pen in the crease.',
  basket:'The cat\'s basket, by the front door, as far from the stairs as it goes.',
  stove:'A woodstove, ticking. The only warm thing for a mile.',
  // the cannery
  tables:'Steel slime tables, long as boats, scrubbed and rusting.',
  belt:'The conveyor, stopped mid-run. A rubber glove still on it.',
  cans:'Stacks of empty cans, labels never put on.',
  tanks:'Brine tanks, waist high. The water in them is very still and very salty.',
  office:'The cannery office, a box of glass on stilts. Papers on the desk.',
  drain:'A floor drain. Water running in, not out.'
 }
};
const fill=(t,o)=>String(t).replace(/\{(n|m|v)\}/g,(x,k)=>o[k]??x);
async function play(seq,o={}){for(const l of [].concat(seq)){if(Array.isArray(l))await say(l[0],fill(l[1],o));else await say('',fill(l,o))}}
const said=(l,o)=>play([l],o);
// A point of no return (studio-bible/play.md): the cursor starts on Not yet, so mashing A can't take it.
async function askNotYet(text,opts){await say('',text,{keep:true,instant:false});const r=await choose(opts,{cancel:true,inBox:true,sel:opts.length-1});hideTB();return r<0?opts.length-1:r}

// The case board card (spec 014, Card; spec 009, step 3): LANTERN 01, the black folder. The board adds AGENCY CASE ·.
const caseCard={file:1,title:'DEAD LETTER',town:'ASTORIA',place:'ASTORIA, OR',
 hook:['One of ours stopped answering the call.','His last letters never got logged.'],pin:'#7a1a18'};

// ================= THE DAY =================
// G.flags.ph: 0 day, 1 night. The day turns at the loft's window (part A's stand-in), with Go on / Not yet naming what
// closes (Turning the day).
const ph=()=>G.flags.ph|0;
const isNight=()=>ph()===1;

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
const folkOf=list=>list.map(n=>Object.assign(n,{talk:n.talk||(()=>play(TEXT.folk[n.say||n.id]))}));
const door=(M,x,y,to,tx,ty,dir='down')=>{open(M,x,y);M.warps[x+','+y]=()=>goTo(to,tx,ty,dir)};
async function goTo(to,x,y,dir){await fade(1);goMap(to,x,y,dir);checkpoint();await fade(0)}
const bounceDir=(M,keys,text,dir)=>keys.forEach(k=>M.warps[k]=async()=>{await said(text);G.dir=dir;await stepBack()});

// ---- MARINE DRIVE: day, and night (40 x 24) ----
// The north side, left to right: the Halvorsen house, the post office, the Snag Tavern, the cannery with its outside
// stairs to the loft. Then the sidewalk, the street, the river-side sidewalk, the rail line, the riverwalk and the river,
// with the pier going out into it.
const DOORS={halvorsen:4,post:12,snag:20,cannery:29,loft:37};
function buildTown(){
 const N=isNight(),M=blank('town','MARINE DRIVE',40,24,',',N?'night':'day');M.alpha=N?.88:.86;M.warm='#ffcf80';
 block(M,0,0,40,7);
 put(M,'house',1,0,7,7,{walk:1});put(M,'postoffice',9,0,7,7,{walk:1});put(M,'tavern',17,0,8,7,{walk:1});put(M,'cannery',26,0,14,7,{walk:1});
 lay(M,0,9,40,3,'=');M.lines.push({x:0,y:10*16+7,w:40*16,h:2,dashed:true,col:'#e8c84a'});
 lay(M,0,13,40,1,'r');lay(M,0,14,40,2,'b');lay(M,0,16,40,8,'W');lay(M,27,16,5,7,'b');
 put(M,'pier',27,16,5,7,{walk:1});
 // doors along the north side
 door(M,DOORS.halvorsen,6,'halvorsen',6,6,'up');
 open(M,DOORS.post,6);if(N)M.O[DOORS.post+',6']=look(TEXT.postShut);else M.warps[DOORS.post+',6']=()=>goTo('post',6,7,'up');
 door(M,DOORS.snag,6,'snag',7,8,'up');
 open(M,DOORS.cannery,6);if(N)M.warps[DOORS.cannery+',6']=enterCannery;else M.O[DOORS.cannery+',6']=look(TEXT.canneryShut);
 door(M,DOORS.loft,6,'loft',6,7,'up');
 // looks at the fronts
 M.O['2,6']=look(TEXT.look.house);M.O['22,6']=look(TEXT.look.snag);M.O['32,6']=M.O['33,6']=look(TEXT.look.cannery);
 // the street's dressing
 put(M,'van',3,10,4,1,{face:'side'});[3,4,5,6].forEach(x=>M.O[x+',10']=look(TEXT.van));
 put(M,'car',11,9,3,1,{tint:'#3e5a6a'});put(M,'car',32,11,3,1,{tint:'#7a2a3a'});[11,12,13].forEach(x=>M.O[x+',9']=look(TEXT.look.car));[32,33,34].forEach(x=>M.O[x+',11']=look(TEXT.look.car));
 [[1,8],[16,8],[25,8],[39,8],[8,12],[24,12],[38,12]].forEach(([x,y])=>put(M,'lamp',x,y));
 put(M,'flag',15,7);M.O['15,7']=look(TEXT.look.flag);
 put(M,'stairs',35,0,3,7,{walk:1});
 put(M,'shelter',13,12,3,1);M.O['13,12']=M.O['14,12']=M.O['15,12']=look(TEXT.shelter);
 put(M,'bench',5,14);M.O['5,14']=look(TEXT.look.bench);put(M,'bench',19,14);M.O['19,14']=look(TEXT.look.bench);
 put(M,'barrel',32,15);M.O['32,15']=look(TEXT.look.barrel);put(M,'trash',10,14);
 put(M,'planter',8,7);put(M,'planter',23,7);
 // the pier: rails both sides, its light at the end
 block(M,27,22,5,1);put(M,'pierlamp',31,21);M.O['29,22']=look(TEXT.look.river);
 for(let x=0;x<40;x++){if(x<27||x>31)M.O[x+',16']=look(TEXT.look.river)}
 M.O['3,13']=M.O['36,13']=look(TEXT.look.rail);
 [[3,17,1],[8,19,0],[13,17,0],[18,20,1],[22,17,0],[25,18,0],[34,17,1],[37,20,0],[11,22,0],[2,21,0]].forEach(([x,y,gull])=>put(M,'piling',x,y,1,1,{walk:1,gull}));
 [[2,15],[26,15],[36,15]].forEach(([x,y])=>put(M,'bollard',x,y));
 put(M,'crabpot',28,18);put(M,'crabpot',28,19);put(M,'crabpot',30,20);M.O['28,17']=M.O['30,19']=look(TEXT.look.pier);
 // the edges: Marine Drive goes on both ways
 bounceDir(M,[7,8,9,10,11,12,13,14,15].map(y=>'0,'+y),TEXT.edge,'right');
 bounceDir(M,[7,8,9,10,11,12,13,14,15].map(y=>'39,'+y),TEXT.edge,'left');
 // people: who's where by phase
 const NP=[];
 if(!N)NP.push({id:'teague',x:24,y:15,dir:'down'},{id:'walker',x:9,y:8,dir:'right'},{id:'dog',x:10,y:8,dir:'right'});
 else NP.push({id:'fisher',x:29,y:21,dir:'down'});
 M.npcs=folkOf(NP).map(n=>typeof TEXT.folk[n.id]==='string'?Object.assign(n,{talk:()=>said(TEXT.folk[n.id])}):n);
 return M}

// ---- interiors: the back wall three tiles tall, the door in the bottom wall ----
function room(id,name,W,H,floor,o={}){const M=blank(id,name,W,H,floor,isNight()?'night':'day');M.alpha=o.alpha||.84;M.warm='#ffcf80';
 block(M,0,0,W,3);block(M,0,0,1,H);block(M,W-1,0,1,H);block(M,0,H-1,W,1);put(M,'room',0,0,W,H,{walk:1,floor});return M}
const out=(M,x,y,to)=>door(M,x,y,'town',DOORS[to],7,'down');

// THE LOFT: Teague's room over the cannery (13 x 9). The day turns at its window.
function buildLoft(){const M=room('loft','THE LOFT · TEAGUE',13,9,'w');
 put(M,'studywall',1,0,5,3,{walk:1});[1,2,3,4,5].forEach(x=>M.O[x+',2']=look(TEXT.look.wall));
 put(M,'window',8,0,3,3,{walk:1});M.O['8,2']=M.O['9,2']=M.O['10,2']={id:'window',name:TEXT.windowName,look:TEXT.windowLook,opts:()=>isNight()?[]:[{label:TEXT.windowOpt,run:waitForDark}]};
 // The hidden hotspot (Item list, Mushrooms): the shaving mirror over the basin, only while the lead is High (field.js)
 put(M,'mirror',11,0,1,3,{walk:1});
 M.O['11,2']={id:'mirror',hidden:'mushrooms',name:TEXT.mirrorName,look:()=>play(TEXT.mirrorLook),glint:(c,x,y,now)=>L01A.mirrorGlint(c,x,y,now)};
 put(M,'cot',1,4,1,2);M.O['1,4']=M.O['1,5']=look(TEXT.look.cot);
 put(M,'hotplate',11,4);M.O['11,4']=look(TEXT.look.hotplate);put(M,'crate',9,6);M.O['9,6']=look(TEXT.look.phone);
 put(M,'books',3,6);M.O['3,6']=look(TEXT.look.books);put(M,'floorboard',5,5,1,1,{walk:1});M.O['5,5']=look(TEXT.look.floor);
 put(M,'lamp_in',7,4);
 out(M,6,8,'loft');return M}
// THE SNAG TAVERN (15 x 10): Mo behind the bar, Hap on his stool, by day and night
function buildSnag(){const M=room('snag','THE SNAG TAVERN',15,10,'w');
 put(M,'bar',1,4,8,1);[1,2,3,4,5,6,7,8].forEach(x=>M.O[x+',4']=look(TEXT.look.bar));
 M.O['5,4']=()=>play(TEXT.folk.mo);M.O['7,4']=look(TEXT.look.register);M.O['2,4']=look(TEXT.look.eggs);
 put(M,'backbar',1,0,8,3,{walk:1});put(M,'jukebox',11,3);M.O['11,3']=look(TEXT.look.jukebox);
 [2,4,6].forEach(x=>put(M,'stool',x,5,1,1,{walk:1}));put(M,'stool',10,4,1,1,{walk:1,empty:1});M.O['10,3']=look(TEXT.look.stool);
 put(M,'pooltable',10,6,3,2);[10,11,12].forEach(x=>{M.O[x+',6']=M.O[x+',7']=look(TEXT.look.pool)});
 put(M,'coatrack',1,8);
 M.O['1,8']={id:'rack',name:TEXT.rack,look:TEXT.rackLook,opts:[{label:TEXT.rackOpt,once:'rack',run:async()=>{await said(TEXT.rackFind);await pickup('shrooms')}}]};
 put(M,'neon',11,0,3,3,{walk:1});
 M.npcs=folkOf([{id:'mo',x:5,y:3,dir:'down'},{id:'hap',x:2,y:6,dir:'up'}]);
 out(M,7,9,'snag');return M}
// POST OFFICE (13 x 9): day only, Ray at the counter
function buildPost(){const M=room('post','POST OFFICE',13,9,'n');
 put(M,'pocounter',1,4,7,1);[1,2,3,5,6,7].forEach(x=>M.O[x+',4']=look(TEXT.look.counter));M.O['4,4']=()=>play(TEXT.folk.ray);
 put(M,'poboxes',8,0,4,3,{walk:1});[8,9,10,11].forEach(x=>M.O[x+',2']=look(TEXT.look.boxes));put(M,'stampposter',1,0,2,3,{walk:1});M.O['2,2']=look(TEXT.look.stamps);
 put(M,'plant',11,6);put(M,'chairs',9,6,2,1);put(M,'lamp_in',1,6);
 M.npcs=folkOf([{id:'ray',x:4,y:3,dir:'down'}]);
 out(M,6,8,'post');return M}
// HALVORSEN HOUSE (12 x 8): Inga's front room, by day and night
function buildHalvorsen(){const M=room('halvorsen','HALVORSEN HOUSE',12,8,'c');
 put(M,'sofa',2,3,3,1);[2,3,4].forEach(x=>M.O[x+',3']=look(TEXT.look.sofa));put(M,'tv',8,3);M.O['8,3']=look(TEXT.look.tv);
 put(M,'sidetable',6,3);M.O['6,3']=look(TEXT.look.ledger);put(M,'woodstove',10,3);M.O['10,3']=look(TEXT.look.stove);
 put(M,'catbasket',4,6,1,1,{walk:1});M.O['4,6']=look(TEXT.look.basket);put(M,'lamp_in',1,4);put(M,'rug',3,5,5,1,{walk:1});
 M.npcs=folkOf([{id:'inga',x:5,y:4,dir:'down'}]);
 out(M,6,7,'halvorsen');return M}
// THE CANNERY FLOOR (26 x 20): night only, the finale area. The retort room waits at the top; the rest of the floor
// (the brine tanks, the office, the stacks) is reached without crossing its doors (The boss waits for you).
async function enterCannery(){const r=await askNotYet(TEXT.canneryQ,TEXT.gateIn);if(r===0)await goTo('cannery',3,18,'up');else{G.dir='down';await stepBack()}}
async function enterRetort(){const r=await askNotYet(TEXT.retortQ,TEXT.gateIn);if(r===0){await said(TEXT.retortIn)}G.dir='down';await stepBack()}
function buildCannery(){const W=26,H=20,M=blank('cannery','THE CANNERY FLOOR',W,H,'o','night');M.alpha=.84;M.warm='#ffcf80';
 block(M,0,0,W,3);block(M,0,0,1,H);block(M,W-1,0,1,H);block(M,0,H-1,W,1);put(M,'floorroom',0,0,W,H,{walk:1});
 put(M,'retort',11,0,4,3,{walk:1});open(M,12,2);open(M,13,2);M.warps['12,2']=M.warps['13,2']=enterRetort;
 for(const y of[6,10,14]){put(M,'slime',3,y,5,1);[3,4,5,6,7].forEach(x=>M.O[x+','+y]=look(TEXT.look.tables))}
 put(M,'belt',11,8,7,1);[11,12,13,14,15,16,17].forEach(x=>M.O[x+',8']=look(TEXT.look.belt));
 put(M,'cans',20,13,2,1);M.O['20,13']=M.O['21,13']=look(TEXT.look.cans);put(M,'cans',11,15,2,1);M.O['11,15']=M.O['12,15']=look(TEXT.look.cans);
 put(M,'pallet',22,16,2,1);put(M,'pallet',16,17,2,1);put(M,'pallet',20,5,1,1);
 put(M,'brine',18,3,2,1);put(M,'brine',21,3,2,1);[18,19,21,22].forEach(x=>M.O[x+',3']=look(TEXT.look.tanks));
 put(M,'office',1,0,4,3,{walk:1});M.O['2,2']=M.O['3,2']=look(TEXT.look.office);
 put(M,'drain',14,12,1,1,{walk:1});M.O['14,12']=look(TEXT.look.drain);
 put(M,'hanglamp',6,4,1,1,{walk:1});put(M,'hanglamp',20,9,1,1,{walk:1});put(M,'hanglamp',8,16,1,1,{walk:1});
 M.npcs=folkOf([{id:'teague',x:15,y:4,dir:'down',say:'teagueN'}]);  // part B: the boss waits behind the doors
 open(M,3,H-1);M.warps['3,'+(H-1)]=async()=>{await goTo('town',DOORS.cannery,7,'down')};
 return M}
const MAPS={town:buildTown,loft:buildLoft,snag:buildSnag,post:buildPost,halvorsen:buildHalvorsen,cannery:buildCannery};

// ================= STAND-IN SCRIPTS =================
// the stand-in for the story's turn at dusk: the loft's window, with Go on / Not yet and what closes (studio-bible/play.md)
async function waitForDark(){if(isNight())return;
 const r=await askNotYet(TEXT.duskQ+' '+TEXT.duskClose,TEXT.turnOpts);if(r!==0)return;
 await fade(1);G.flags.ph=1;await play(TEXT.dusk);goMap('loft',9,3,'up');banner(TEXT.phase[1]);checkpoint();await fade(0)}

// ================= OPENING (stand-in briefing in the lightship's wheelhouse) =================
async function caseOpening(){
 await cut('open',async()=>{await said(TEXT.open1);await said(TEXT.open2)});
 await bigHatScene(async()=>{
  await cut('brief',()=>play(TEXT.brief));
  await twoQuestions(TEXT.intel);
  await cut('brief2',()=>play(TEXT.brief2));
  await requisition();
 },{place:window.L01A.wheelhouse});
 G.flags.ph=0;G.mode='world';goMap('town',8,10,'up');checkpoint();await fade(0);
 await cut('arrive',()=>said(TEXT.arrive));
}
const caseNext=()=>TEXT.next[ph()]||'';

// ================= ON THE CASE BOARD =================
// An agency case (spec 009, step 3): seasons/season-1.js lists it and its unlock count; unlock: the stand-in unlock
// lines (season.js plays them when the season data has none). Part A has no ending yet: the Dev map menu's
// Dev: finish case closes it through the real debrief, as a stand-in. Closing it never raises closed (case-board.js).
const facts=l=>({label:l,clues:[],saved:0,overstep:(stepsOf()[loadSeason().overstep|0]||'Clean'),san:party.map(m=>({id:m.a.id,name:m.name,from:m.san0,to:m.san})),items:[],choices:{},tried:[],lost:[]});
registerCase({id:'lantern-01',card:caseCard,opening:caseOpening,intel:TEXT.intel,maps:MAPS,tiles:{},unlock:TEXT.unlock,
 portraits:name=>window.L01A.portraits[name]||null,items:{},next:caseNext,quiet:true,loot:['energy','painkillers','roadflare','cigs','booze'],
 get place(){return window.L01A&&L01A.wheelhouse},  // Big Hat's place for this case: the briefing passes it, and the debrief plays there too
 label:()=>'clean',facts,
 debrief:{clues:[],lines:{clean:[['BIG HAT','Stand-in debrief. The real one comes with the story. Sit.']]},
  stories:[{name:'Family matter',skill:'Persuade',verb:'sell it',pass:[['BIG HAT','Family matter. Good.']]}],weak:{name:'Went fishing',pass:[]}}});
})();
