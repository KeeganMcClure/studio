// Black Lantern · cases/lot-83.js
// CASE: Lot 83 (FILE 03), the Pecan Court Apartments, Austin, Texas, in an August heat wave (spec 011).
// Part A (Nov 23, 2026): the card, every map (the court by day and tented by night, the units, the office, the laundry
// room, the storage row and the finale area), the townsfolk and Walt on the map and in the dialog box, Big Hat's own
// briefing place, and stand-in scripts so every map walks and every door and drive goes where it should. No clues,
// fights or story yet: those are part B, written from the secret case file.
// Art is cases/lot-83-art.js (window.L83A), loaded right after this file. Needs engine.js and field.js first.
// The whole file sits in one function so its names never meet another case's (every case loads as a plain script).
(function(){

// ================= TEXT =================
// Every line of the case. A list plays box by box: a plain string is narration, ['WHO', 'line'] is someone talking.
// Part A's lines are stand-ins, kept plain; part B rewrites them from the case file in Keegan's voice.
const TEXT={
 next:['Day 1. Walk Pecan Court. When you\'re ready, call in the tent crew from the van.','Night 1. The tent is up. Walk the building.'],
 phase:['DAY 1 · AFTERNOON','NIGHT 1 · UNDER THE TENT'],
 // ---- the briefing (stand-in) ----
 open1:'SUNDAY · 11:52 PM · 91°F',
 open2:'A text from an unlisted number: "US-290. THE SMOKEHOUSE. AROUND BACK. BRING A JACKET."',
 brief:['The walk-in cooler of a barbecue joint, closed for the night. Frost on the brisket racks. It\'s a hundred and four outside.',['BIG HAT','Agent {code}. Shut the door. You\'re lettin\' the cold out.'],
  'He\'s sitting on an upturned pickle bucket. There isn\'t another one.',['BIG HAT','Pecan Court Apartments. Austin. Twenty-three tenants and one problem.'],['BIG HAT','Stand-in briefin\'. The real one comes with the story.']],
 // Big Hat's four topics (spec 013): their edges come in part B
 intel:[
  {id:'building',label:'The building',answer:['Pecan Court. Sixteen units, twenty-three people.','One manager, on hold with the owners since Tuesday.'],note:'Pecan Court has 16 units. The manager is Lorraine Pike.'},
  {id:'lot',label:'The lot',answer:['A dead man\'s estate, bought by the pallet.','The family wouldn\'t say one word about him. That\'s a word.'],note:'The lot came from a dead collector\'s estate auction.'},
  {id:'walt',label:'Walt',answer:['Walt Okafor. Seventy-one. Widower.','Stopped answerin\' his phone Thursday.'],note:'Walt Okafor, Unit 6, stopped answering his phone Thursday.'},
  {id:'tent',label:'The tent',answer:['You\'re the bug men. Tent goes up at dusk.','Comes down at dawn. Nobody comes back in between.'],note:'The tent goes up at dusk and comes down at dawn.'}],
 brief2:[['BIG HAT','You go in quiet. Coveralls, clipboards, a van with a bug on it.'],['BIG HAT','Be smart, be careful, don\'t get burned.']],
 arrive:'LOT 83 (stand-in). Walk Pecan Court with A. Call in the tent crew from the van to move on to night. START for your notebook.',
 // ---- doors, the van and the day ----
 shut:'Locked. A TV going somewhere inside.',
 shutQuiet:'Locked. Nobody home.',
 unit:n=>`Unit ${n}. Locked.`,
 tentShut:'Unit {n}. The tenant\'s gone to the motel for the night. Locked.',
 street:'Lamar Boulevard. The heat comes up off it in sheets. Not yet.',
 edge:'A cinderblock wall, still warm from the sun.',
 skirt:'The tent\'s skirt, sandbagged to the ground. Sealed till dawn.',
 van:'The van. STAR STATE EXTERMINATING, and a cartoon armadillo in a gas mask.',vanQ:'Where to?',
 vanOpt:{storage:'Drive to the storage row',court:'Drive back to Pecan Court',tent:'Call in the tent crew'},
 driveTo:{storage:'Twelve minutes out the highway. A row of orange doors in the gravel.',court:'Back to Pecan Court.'},
 tentQ:'Call in the tent crew? The tent goes up for the night.',
 tentClose:'Walt\'s storage unit and the tenants are out of reach till dawn.',
 turnOpts:['Go on','Not yet'],
 tented:['The tent crew works fast. Stripes go up over the roofline, sandbags go down along the skirt.','The tenants file out to a motel on the highway. The last one locks the gate behind them.','Under the tent, the building is very quiet.'],
 night:'The tent\'s up. The van is outside it till dawn.',
 // ---- the finale area ----
 hatchShut:'A steel hatch in the deep end, padlocked. PUMP ROOM stenciled on it.',
 hatchQ:'The hatch in the deep end stands open. A ladder goes down into the warm dark.',
 gateIn:['Go in','Not yet'],
 pumpOut:'Climb back up to the pool?',pumpOutOpts:['Climb up','Stay'],
 steps:'The pool steps, down into the dry pool.',
 // ---- the hidden hotspot: only there while the lead is High on Mushrooms (stand-in result) ----
 wallName:'THE PATCH',wallLook:['The patch on the wall is thin as skin. Something warm moves behind it.','(Stand-in: what it means comes in part B.)'],
 bin:'LOST AND FOUND',binLook:'A plastic bin of single socks, a swim noodle and somebody\'s phone charger.',binOpt:'Dig through it',
 binFind:'At the bottom, a little foil pouch of gummies. FUN GUY, a cartoon mushroom with a thumbs-up.',
 // ---- people (stand-ins) ----
 folk:{
  walt:[['WALT','You\'re the bug people.'],['WALT','There\'s nothing in here but junk. You can see that. It\'s just junk.']],
  lorraine:[['LORRAINE','Lorraine Pike, I manage. Hold on.'],'She taps her headset. Hold music, faintly.',['LORRAINE','Still on hold. Tent goes up at dusk. Do your thing.']],
  dolores:[['MRS. YBARRA','You\'re not the usual bug men.'],['MRS. YBARRA','I remember faces. I\'ll remember yours.']],
  biscuit:'The little dog in the sweater barks at you without stopping. Then it looks at Unit 6 and goes quiet.',
  trey:[['TREY','I work nights. Do you know what time it is for me right now?'],['TREY','Something\'s in my wall. Kill it quieter.']],
  kenny:[['KENNY','Are you guys, like, real exterminators?'],['KENNY','It\'s a rat. In my wall. Probably a rat.']],
  gus:[['GUS','Pool\'s been dry since \'19.'],'He mists himself with a spray bottle.',['GUS','Used to swim laps every morning. Now I just sit.']],
  denise:[['DENISE','Denise. Walt\'s daughter. I drove up from Houston.'],['DENISE','He won\'t open the door. He always opens the door for me.']],
  dale:[['DALE','Office closes at six. Bathroom\'s out of order.'],['DALE','Which unit you here for?']],
  hector:[['HECTOR','You\'re the new crew? Good luck.'],['HECTOR','I\'m just here for my sprayer. I\'m not going past that pool fence.']]
 },
 // ---- looks around the maps (part B gives them skills and clues) ----
 look:{
  sign:'PECAN COURT APARTMENTS. NOW LEASING. A pecan with a smiling face.',
  denisecar:'A silver hatchback with Harris County plates. A booster seat in the back.',
  car:'A parked car, sunshade up. The windshield is too hot to touch.',
  dumpster:'The dumpster. A box of moving blankets on top, still in plastic.',
  tree:'The pecan tree the building\'s named for. Half its nuts are on the ground, cooked.',
  pool:'The dry pool. A crack runs down the plaster like a river on a map.',
  chair:'Gus\'s lawn chair, the webbing patched with duct tape.',
  jars:'Jars on the table, rows of them, each with something pale folded up in cloudy liquid.',
  books:'Books in a language you can\'t place. Not even the alphabet.',
  ledgers:'Cloth ledgers with numbers on the spines. 81, 82, 84, 85...',
  boxes:'Boxes to the ceiling. MASON JARS. BOOKS. MISC. In marker, in a careful hand.',
  fridge:'The fridge. A crayon drawing on the door: a stick man with a big smile. GRAMPA.',
  fan:'The ceiling fan shrieks on every turn.',
  recliner:'A brown recliner, the arms worn through. A blanket on it, in this heat.',
  photo:'A wedding photo. A tall man in a white suit, and a woman laughing at him.',
  ac:'The window unit. Dead. A towel underneath, dry.',
  keys:'The key board: a hook for every unit, a tag on every key.',
  counter:'The office counter. A bell, a bowl of hard candy, a sign: RENT DUE 1ST.',
  mailboxes:'Brass mailboxes. Unit 6\'s is stuffed full.',
  sofa:'A flowered sofa under a clear plastic cover.',
  dogs:'A wall of framed photos, all of the same little dog.',
  foil:'Foil over the windows, taped at the edges. Not a crack of light.',
  scrubs:'Scrubs over a chair. A badge: T. BANKS, RN, NIGHTS.',
  tape:'A square of drywall duct-taped over, in the bathroom doorway.',
  rig:'A gaming setup, a ring light, a mic on an arm. A sticky note: GOING LIVE 3AM.',
  hole:'A hole in the drywall, fist-sized, with the edges pushed out. Not in.',
  washers:'Coin washers. One has a sock stuck to the inside of the lid.',
  dryers:'Coin dryers. One is still warm.',
  freezer:'A chest freezer. DO NOT OPEN · DEER · RAY, on masking tape.',
  soda:'A soda machine. Every button but one says SOLD OUT.',
  rolldoor:'A roll-up door, padlocked. A number painted above it.',
  door83:'Unit 83. The roll-up door is up a foot off the gravel.',
  booth:'The office booth. A fan blowing on a sleeping cat.',
  lamp:'One light on a pole, buzzing.',
  shelf:'Steel shelving. More jars.',
  grace:'A box marked GRACE in a different hand. Not the lot.',
  filter:'The pool\'s filter tank. The pipes off it are warm to the touch.',
  pipes:'Pipes along the wall, sweating in the heat.',
  sump:'A sump in the floor, dark water at the bottom.',
  ladder:'The ladder back up to the hatch.'
 }
};
const fill=(t,o)=>String(t).replace(/\{(n|m|v)\}/g,(x,k)=>o[k]??x);
async function play(seq,o={}){for(const l of [].concat(seq)){if(Array.isArray(l))await say(l[0],fill(l[1],o));else await say('',fill(l,o))}}
const said=(l,o)=>play([l],o);
// A point of no return (studio-bible/play.md): the cursor starts on Not yet, so mashing A can't take it.
async function askNotYet(text,opts){await say('',text,{keep:true,instant:false});const r=await choose(opts,{cancel:true,inBox:true,sel:opts.length-1});hideTB();return r<0?opts.length-1:r}

// The case board card (spec 011, The card)
const caseCard={file:3,title:'LOT 83',town:'AUSTIN',place:'PECAN COURT APTS · AUSTIN, TX',
 hook:['A dead man\'s boxes came to Unit 6.','Something in them is still growing.'],pin:'#a8e04a'};

// ================= THE DAY =================
// G.flags.ph: 0 day 1, 1 night 1 (spec 011, Day and night). The tenting at dusk turns it; part A's stand-in is the van's
// "Call in the tent crew", with Go on / Not yet naming what closes (Turning the day).
const ph=()=>G.flags.ph|0;
const isNight=()=>ph()===1;

// ================= MAPS =================
// Every map is drawn by cases/lot-83-art.js from M.ground, M.pieces and M.light, like Good Manners. M.g is what blocks.
// Ground letters (none in engine.js's BLOCK set): ',' concrete deck, '_' parking lot, '=' road, '.' dry grass, ':' lawn,
// 'g' gravel, 'x' dry dirt, 'n' linoleum, 'c' carpet, 'v' tile, 'w' wood floor, 'o' bare concrete.
function blank(id,name,W,H,fillCh,light){const ground=mk(W,H,fillCh),g=mk(W,H,fillCh);
 return{id,name,w:W,h:H,ground,g,pieces:[],O:{},npcs:[],warps:{},light,art:window.L83A,bg:id,lines:[]}}
const lay=(M,x,y,w,h,c)=>{rect(M.ground,x,y,w,h,c);rect(M.g,x,y,w,h,c)};
const block=(M,x,y,w=1,h=1)=>rect(M.g,x,y,w,h,'#');
const open=(M,x,y)=>{M.g[y][x]=M.ground[y][x]};
function put(M,k,x,y,w=1,h=1,o={}){const p=Object.assign({k,x,y,w,h},o);M.pieces.push(p);if(!o.walk)block(M,x,y,w,h);return p}
const look=t=>({look:t});
const folkOf=list=>list.map(n=>Object.assign(n,{talk:()=>play(TEXT.folk[n.id])}));
// a door you walk into: it opens on the far map at (x, y) facing dir
const door=(M,x,y,to,tx,ty,dir='down')=>{open(M,x,y);M.warps[x+','+y]=()=>goTo(to,tx,ty,dir)};
async function goTo(to,x,y,dir){await fade(1);goMap(to,x,y,dir);checkpoint();await fade(0)}
const bounceDir=(M,keys,text,dir)=>keys.forEach(k=>M.warps[k]=async()=>{await said(text);G.dir=dir;await stepBack()});

// ---- PECAN COURT: day 1, and night 1 under the tent (36 x 28 by day; 36 x 19 at night, the lot shut outside the skirt) ----
// The two-story block runs across the top: upstairs units 9-16 open off the walkway (row 3), downstairs units 1-8
// off the courtyard (row 7), metal stairs at both ends. Door x for unit n: 4 * n (downstairs), 4 * (n - 8) (upstairs).
const UNITS={6:'unit6',5:'unit5',9:'unit9',12:'unit12'};
const unitX=n=>n<=8?4*n:4*(n-8);
function buildCourt(){
 const N=isNight(),H=N?19:28,M=blank('court','PECAN COURT',36,H,',',N?'night':'day');M.alpha=N?.9:.86;M.warm='#ffcf80';
 // the block: upstairs wall, walkway, downstairs wall; the stairs at x 1 and x 34
 block(M,0,0,36,3);lay(M,1,3,34,1,',');block(M,0,4,36,3);
 put(M,'block',2,0,32,7,{walk:1});
 for(const sx of[1,34]){for(let y=3;y<7;y++)open(M,sx,y);put(M,'stairs',sx,3,1,4,{walk:1})}
 for(let n=1;n<=16;n++){const x=unitX(n),y=n<=8?6:2,back=n<=8?7:3;
  if(UNITS[n])door(M,x,y,UNITS[n],UNITS[n]==='unit6'?7:5,UNITS[n]==='unit6'?9:6,'up');
  else{open(M,x,y);M.O[x+','+y]=look(N?fill(TEXT.tentShut,{n}):(n%3?TEXT.shut:TEXT.shutQuiet))}
  M.pieces.push({k:'unitdoor',x,y,w:1,h:1,n,walk:1,back})}
 // the edges: cinderblock walls left and right of the courtyard
 block(M,0,7,1,9);block(M,35,7,1,9);
 // the pool in its chain-link fence (gate at x 14 on the south side); the dry pool walks from its steps
 put(M,'pool',10,10,10,4,{walk:1});block(M,10,10,10,1);open(M,10,10);M.O['10,9']=look(TEXT.steps);
 block(M,10,13,10,1);
 put(M,'fence',8,8,14,8,{walk:1,gate:14});block(M,8,8,14,1);block(M,8,8,1,8);block(M,21,8,1,8);block(M,8,15,14,1);open(M,14,15);
 M.O['15,12']=look(TEXT.look.pool);
 put(M,'hatch',18,12,1,1,{walk:1});
 if(N){M.warps['18,12']=enterPump}else M.O['18,12']={id:'hatch',name:'HATCH',look:TEXT.hatchShut};
 put(M,'lawnchair',19,14);M.O['19,14']=look(TEXT.look.chair);put(M,'lounger',11,14,2,1);
 // the east block: the manager's office and the laundry room
 put(M,'annex',25,9,9,4,{office:27,laundry:31});door(M,27,12,'office',7,8,'up');door(M,31,12,'laundry',6,6,'up');
 // the courtyard's dressing
 put(M,'tree',3,10);M.O['3,10']=look(TEXT.look.tree);put(M,'tree',23,11);
 put(M,'dumpster',1,14,2,1);M.O['1,14']=M.O['2,14']=look(TEXT.look.dumpster);
 put(M,'bench',5,13);put(M,'planter',7,7);put(M,'planter',29,7);put(M,'grill',33,14);
 lay(M,1,15,6,1,'.');lay(M,22,13,3,3,'.');lay(M,30,13,5,2,'x');
 // night: the tent's skirt shuts the lot outside; work lights on stands, bug lights under the walkway
 if(N){put(M,'skirt',0,16,36,1);M.O['17,16']=look(TEXT.skirt);lay(M,0,17,36,2,'_');block(M,0,17,36,2);
  [[6,8],[23,8],[30,14],[3,12]].forEach(([x,y])=>put(M,'worklight',x,y))}
 else{
  // the chain-link between the courtyard and the lot, open at x 16-18
  put(M,'linkfence',0,16,36,1,{gap:[16,19]});block(M,0,16,16,1);block(M,19,16,17,1);
  lay(M,0,17,36,10,'_');lay(M,0,26,36,1,'.');lay(M,0,27,36,1,'=');lay(M,16,16,3,1,',');
  for(let x=1;x<16;x+=3)M.lines.push({x:x*16,y:17*16,w:1,h:30});for(let x=20;x<36;x+=3)M.lines.push({x:x*16,y:17*16,w:1,h:30});
  for(let x=1;x<36;x+=3)M.lines.push({x:x*16,y:23*16+2,w:1,h:44});
  put(M,'van',4,20,4,1,{face:'side'});[4,5,6,7].forEach(x=>M.O[x+',20']={id:'van',name:'VAN',look:TEXT.van,opts:()=>vanOpts()});
  put(M,'car',23,18,3,1,{tint:'#b8bcc4'});M.O['23,18']=M.O['24,18']=M.O['25,18']=look(TEXT.look.denisecar);
  put(M,'car',11,24,3,1,{tint:'#7a2a3a'});put(M,'car',27,24,3,1,{tint:'#3e5a6a'});put(M,'car',2,24,3,1,{tint:'#d8c890'});put(M,'car',30,18,3,1,{tint:'#4a4a54'});put(M,'car',11,18,3,1,{tint:'#5a7a4a'});
  [2,3,4,11,12,13,27,28,29].forEach(x=>M.O[x+',24']=look(TEXT.look.car));[11,12,13,30,31,32].forEach(x=>M.O[x+',18']=look(TEXT.look.car));
  [[2,17],[33,17],[19,26]].forEach(([x,y])=>put(M,'lamp',x,y));
  put(M,'aptsign',30,26,3,1);M.O['30,26']=M.O['31,26']=M.O['32,26']=look(TEXT.look.sign);
  [[0,26],[8,26],[25,26],[35,26]].forEach(([x,y])=>put(M,'tree',x,y));
  bounceDir(M,Array.from({length:36},(_,x)=>x+',27'),TEXT.street,'up');
 }
 // people: who's where by phase (night: the tenants are at the motel)
 const NP=[];
 if(!N)NP.push({id:'dolores',x:19,y:7,dir:'down'},{id:'biscuit',x:18,y:8,dir:'right'},{id:'gus',x:18,y:14,dir:'down'},{id:'denise',x:26,y:19,dir:'left'},{id:'hector',x:10,y:18,dir:'down'});
 M.npcs=folkOf(NP);
 return M}

// ---- interiors: the back wall three tiles tall, the door in the bottom wall ----
function room(id,name,W,H,floor,o={}){const M=blank(id,name,W,H,floor,isNight()?'night':'day');M.alpha=o.alpha||.86;M.warm='#ffcf80';
 block(M,0,0,W,3);block(M,0,0,1,H);block(M,W-1,0,1,H);block(M,0,H-1,W,1);put(M,'room',0,0,W,H,{walk:1,floor});return M}
const out=(M,x,y,n)=>door(M,x,y,'court',unitX(n),n<=8?7:3,'down');
function buildUnit6(){const M=room('unit6','UNIT 6',15,11,'c');
 put(M,'fridge',2,3);M.O['2,3']=look(TEXT.look.fridge);put(M,'stove',3,3);put(M,'ksink',4,3,2,1);M.O['4,3']=M.O['5,3']=look(TEXT.look.boxes);
 put(M,'table',5,6,3,1,{lot:1});M.O['5,6']=look(TEXT.look.jars);M.O['6,6']=look(TEXT.look.books);M.O['7,6']=look(TEXT.look.ledgers);
 put(M,'recliner',10,5);M.O['10,5']=look(TEXT.look.recliner);put(M,'tv',12,3);put(M,'deadac',8,1,1,1,{walk:1});M.O['8,2']=look(TEXT.look.ac);
 put(M,'photo',11,1,1,1,{walk:1});M.O['11,2']=look(TEXT.look.photo);
 [[1,5,2],[1,7,1],[1,8,0],[7,3,2],[9,3,1],[13,5,2],[13,7,1],[3,8,1],[12,8,0],[10,8,2]].forEach(([x,y,v])=>{put(M,'boxes',x,y,1,1,{v});M.O[x+','+y]=look(TEXT.look.boxes)});
 put(M,'fan',7,5,1,1,{walk:1});
 // The hidden hotspot (Item list, Mushrooms): the patched wall left of the fridge, only while the lead is High (field.js)
 M.O['1,2']={id:'patch',hidden:'mushrooms',name:TEXT.wallName,look:()=>play(TEXT.wallLook),glint:(c,x,y,now)=>L83A.patchGlint(c,x,y,now)};
 if(!isNight())M.npcs=folkOf([{id:'walt',x:10,y:6,dir:'down'}]);
 out(M,7,10,6);return M}
function buildOffice(){const M=room('office','MANAGER\'S OFFICE',15,10,'n');
 put(M,'counter',2,5,7,1);M.O['3,5']=M.O['4,5']=M.O['7,5']=M.O['8,5']=look(TEXT.look.counter);M.O['5,5']=M.O['6,5']=()=>isNight()?said(TEXT.shutQuiet):play(TEXT.folk.lorraine);
 put(M,'keyboard',2,1,2,1,{walk:1});M.O['2,2']=M.O['3,2']=look(TEXT.look.keys);put(M,'mailboxes',10,0,4,3,{walk:1});M.O['11,3']=M.O['12,3']=look(TEXT.look.mailboxes);
 put(M,'desk',4,3,2,1);put(M,'wac',7,1,1,1,{walk:1});put(M,'cooler',13,6);put(M,'plant',1,8);put(M,'chairs',10,7,2,1);
 if(!isNight())M.npcs=folkOf([{id:'lorraine',x:5,y:4,dir:'down'}]);
 door(M,7,9,'court',27,13,'down');return M}
function buildUnit5(){const M=room('unit5','UNIT 5 · YBARRA',11,8,'c');
 put(M,'sofa',2,4,3,1);M.O['2,4']=M.O['3,4']=M.O['4,4']=look(TEXT.look.sofa);put(M,'dogwall',5,0,4,3,{walk:1});M.O['6,3']=M.O['7,3']=look(TEXT.look.dogs);
 put(M,'tv',8,3);put(M,'dogbed',8,5,1,1,{walk:1});put(M,'plant',1,3);
 out(M,5,7,5);return M}
function buildUnit9(){const M=room('unit9','UNIT 9 · BANKS',11,8,'w');
 put(M,'bed',1,3,2,2);put(M,'foil',4,0,3,3,{walk:1});M.O['5,3']=look(TEXT.look.foil);put(M,'chair',7,4);M.O['7,4']=look(TEXT.look.scrubs);
 put(M,'tapewall',9,0,1,3,{walk:1});M.O['9,3']=look(TEXT.look.tape);put(M,'boxes',9,5,1,1,{v:0});
 if(!isNight())M.npcs=folkOf([{id:'trey',x:5,y:5,dir:'down'}]);
 out(M,5,7,9);return M}
function buildUnit12(){const M=room('unit12','UNIT 12 · DUONG',11,8,'c');
 put(M,'rig',1,3,3,1);M.O['1,3']=M.O['2,3']=M.O['3,3']=look(TEXT.look.rig);put(M,'ringlight',4,3);put(M,'hole',7,0,1,3,{walk:1});M.O['7,3']=look(TEXT.look.hole);
 put(M,'bed',8,3,2,2);put(M,'beanbag',3,5,1,1);
 M.npcs=folkOf([{id:'kenny',x:5,y:5,dir:'left'}]);  // he stays behind at night (part B)
 out(M,5,7,12);return M}
function buildLaundry(){const M=room('laundry','LAUNDRY ROOM',13,8,'v',{alpha:.72});
 [[1,'washer'],[2,'washer'],[3,'washer'],[5,'dryer'],[6,'dryer'],[7,'dryer']].forEach(([x,k],i)=>{put(M,k,x,3,1,1,{on:k==='dryer'&&i===4&&!isNight()});M.O[x+',3']=look(k==='washer'?TEXT.look.washers:TEXT.look.dryers)});
 put(M,'freezer',9,3,2,1);M.O['9,3']=M.O['10,3']=look(TEXT.look.freezer);put(M,'soda',11,3);M.O['11,3']=look(TEXT.look.soda);
 put(M,'foldtable',3,5,3,1);put(M,'bin',10,6);
 M.O['10,6']={id:'bin',name:TEXT.bin,look:TEXT.binLook,opts:[{label:TEXT.binOpt,once:'bin',run:async()=>{await said(TEXT.binFind);await pickup('shrooms')}}]};
 put(M,'tube',4,0,5,1,{walk:1});
 door(M,6,7,'court',31,13,'down');return M}

// ---- HWY 71 SELF STORAGE: day only (30 x 14), reached by van ----
function buildStorage(){
 const M=blank('storage','HWY 71 SELF STORAGE',30,14,'g','day');
 block(M,0,0,30,4);put(M,'units',0,0,30,4,{walk:1,first:78});
 for(let i=0;i<10;i++){const x=2+3*i,n=78+i;open(M,x,3);if(n===83)door(M,x,3,'bay',4,5,'up');else M.O[x+',3']=look(TEXT.look.rolldoor)}
 put(M,'booth',24,6,3,2);M.O['24,7']=M.O['26,7']=look(TEXT.look.booth);put(M,'pole',13,6);M.O['13,6']=look(TEXT.look.lamp);
 put(M,'van',5,9,4,1,{face:'side'});[5,6,7,8].forEach(x=>M.O[x+',9']={id:'van',name:'VAN',look:TEXT.van,opts:()=>vanOpts()});
 put(M,'linkfence',0,11,30,1,{gap:[13,16]});block(M,0,11,13,1);block(M,16,11,14,1);
 lay(M,0,12,30,1,'.');lay(M,0,13,30,1,'=');lay(M,13,11,3,1,'g');
 bounceDir(M,Array.from({length:30},(_,x)=>x+',13'),'The highway. Trucks, and heat. Not yet.','up');
 [[1,12],[9,12],[20,12],[28,12],[28,6]].forEach(([x,y])=>put(M,'shrub',x,y));
 M.npcs=folkOf([{id:'dale',x:25,y:8,dir:'down'}]);
 return M}
function buildBay(){const M=blank('bay','STORAGE UNIT 83',9,7,'o','day');block(M,0,0,9,3);block(M,0,0,1,7);block(M,8,0,1,7);block(M,0,6,9,1);
 put(M,'bayroom',0,0,9,7,{walk:1});put(M,'shelfin',1,3,2,1,{stocked:true,jars:1});M.O['1,3']=M.O['2,3']=look(TEXT.look.shelf);
 put(M,'boxes',6,3,1,1,{v:2});put(M,'boxes',7,3,1,1,{v:1});put(M,'gracebox',6,5);M.O['6,5']=look(TEXT.look.grace);put(M,'boxes',1,5,1,1,{v:0});
 open(M,4,6);M.warps['4,6']=()=>goTo('storage',17,4,'down');return M}

// ---- THE POOL PUMP ROOM: night 1, the finale area (16 x 9); the boss waits here in part B ----
async function enterPump(){const r=await askNotYet(TEXT.hatchQ,TEXT.gateIn);if(r===0)await goTo('pump',8,2,'down');else{G.dir='up';await stepBack()}}
function buildPump(){const M=blank('pump','THE POOL PUMP ROOM',16,9,'o','night');M.alpha=.86;M.warm='#ffcf80';
 block(M,0,0,16,2);block(M,0,0,1,9);block(M,15,0,1,9);block(M,0,8,16,1);put(M,'vault',0,0,16,9,{walk:1});
 put(M,'filter',2,2,2,2);M.O['2,4']=M.O['3,4']=look(TEXT.look.filter);put(M,'pipes',4,0,10,2,{walk:1});M.O['5,2']=look(TEXT.look.pipes);
 put(M,'sump',11,6,1,1,{walk:1});put(M,'bulb',5,1,1,1,{walk:1});M.O['11,6']=look(TEXT.look.sump);put(M,'nest',10,2,4,2);
 M.npcs=folkOf([{id:'walt',x:12,y:4,dir:'up'}]);
 open(M,8,1);M.pieces.push({k:'ladder',x:8,y:0,w:1,h:2,walk:1});
 M.warps['8,1']=async()=>{const r=await ask('',TEXT.pumpOut,TEXT.pumpOutOpts);if(r===0)await goTo('court',17,11,'left');else{G.dir='down';await stepBack()}};
 return M}
const MAPS={court:buildCourt,unit6:buildUnit6,office:buildOffice,unit5:buildUnit5,unit9:buildUnit9,unit12:buildUnit12,laundry:buildLaundry,storage:buildStorage,bay:buildBay,pump:buildPump};

// ================= STAND-IN SCRIPTS =================
function vanOpts(){if(isNight())return[];const o=[];
 if(G.map==='court')o.push({label:TEXT.vanOpt.storage,run:()=>driveTo('storage')},{label:TEXT.vanOpt.tent,run:tentUp});
 else o.push({label:TEXT.vanOpt.court,run:()=>driveTo('court')});
 return o}
async function driveTo(where){await fade(1);await say('',TEXT.driveTo[where]);
 if(where==='storage')goMap('storage',7,10,'up');else goMap('court',8,21,'down');checkpoint();await fade(0)}
// the stand-in for the story's tenting at dusk: the van, with Go on / Not yet and what closes (studio-bible/play.md)
async function tentUp(){if(isNight())return;
 const r=await askNotYet(TEXT.tentQ+' '+TEXT.tentClose,TEXT.turnOpts);if(r!==0)return;
 await fade(1);G.flags.ph=1;await play(TEXT.tented);goMap('court',17,14,'up');banner(TEXT.phase[1]);checkpoint();await fade(0)}

// ================= OPENING (stand-in briefing in the barbecue joint's walk-in cooler) =================
async function caseOpening(){
 await cut('open',async()=>{await said(TEXT.open1);await said(TEXT.open2)});
 await bigHatScene(async()=>{
  await cut('brief',()=>play(TEXT.brief));
  await twoQuestions(TEXT.intel);
  await cut('brief2',()=>play(TEXT.brief2));
  await requisition();
 },{place:window.L83A.cooler});
 G.flags.ph=0;G.mode='world';goMap('court',8,21,'down');checkpoint();await fade(0);
 await cut('arrive',()=>said(TEXT.arrive));
}
const caseNext=()=>TEXT.next[ph()]||'';

// ================= ON THE CASE BOARD =================
// Part A has no ending yet: the Dev map menu's Dev: finish case closes it through the real debrief, as a stand-in.
const facts=l=>({label:l,clues:[],saved:0,overstep:(stepsOf()[loadSeason().overstep|0]||'Clean'),san:party.map(m=>({id:m.a.id,name:m.name,from:m.san0,to:m.san})),items:[],choices:{},tried:[],lost:[]});
registerCase({id:'lot-83',card:caseCard,opening:caseOpening,intel:TEXT.intel,maps:MAPS,tiles:{},
 portraits:name=>window.L83A.portraits[name]||null,items:{},next:caseNext,quiet:true,loot:['energy','painkillers','roadflare','cigarettes','firecrackers'],
 label:()=>'clean',facts,
 debrief:{clues:[],lines:{clean:[['BIG HAT','Stand-in debrief. The real one comes with the story. Sit.']]},
  stories:[{name:'Termites',skill:'Persuade',verb:'sell it',pass:[['BIG HAT','Termites. Good.']]}],weak:{name:'Gas leak',pass:[]}}});
})();
