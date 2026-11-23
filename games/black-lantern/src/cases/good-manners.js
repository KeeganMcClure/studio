// Black Lantern · cases/good-manners.js
// CASE: Good Manners (FILE 02), Odessa Flats, Kansas, during the county fair's last week (spec 010).
// Part A (Nov 23, 2026): the card, every map in its day and night versions, the townsfolk and the two men on the map
// and in the dialog box, Big Hat's own briefing place, and stand-in scripts so every map walks and every door and drive
// goes where it should. No clues, fights or story yet: those are part B, written from the secret case file.
// Art is cases/good-manners-art.js (window.GMA), loaded right after this file. Needs engine.js and field.js first.
// The whole file sits in one function so its names never meet Still Harvest's (both cases load as plain scripts).
(function(){

// ================= TEXT =================
// Every line of the case. A list plays box by box: a plain string is narration, ['WHO', 'line'] is someone talking.
// Part A's lines are stand-ins, kept plain; part B rewrites them from the case file in Keegan's voice.
const TEXT={
 standin:'(Stand-in: the case\'s story comes in part B.)',
 next:['Day 1. Walk Odessa Flats. Rest at the motel to move the day on.','Night 1. Rest at the motel to move on to day 2.','Day 2. The fairground is open: take the car. Rest at the motel to move on to night 2.','Night 2. The fair\'s last night. Take the car to the fairground.'],
 phase:['DAY 1 · AFTERNOON','NIGHT 1','DAY 2','NIGHT 2 · THE FAIR\'S LAST NIGHT'],
 // ---- the briefing (stand-in) ----
 open1:'THURSDAY · 7:48 PM',
 open2:'A text from an unlisted number: "TRUCK STOP. EXIT 206. BEHIND IT. THE COMBINE."',
 brief:['The cab of a parked combine behind a truck stop off I-70. The fair\'s lights sit on the far edge of the wheat.',['BIG HAT','Agent {code}. Sit.'],'There is one seat. He\'s in it.',
  ['BIG HAT','Odessa Flats, Kansas. County fair\'s last week.'],['BIG HAT','Stand-in briefin\'. The real one comes with the story.']],
 // Big Hat's four topics (spec 013): their edges come in part B
 intel:[
  {id:'town',label:'The town',answer:['Nine hundred people and a sheriff named Toft.','She\'ll smell you comin\'. Let her.'],note:'Sheriff Toft runs Odessa Flats. She\'ll know you\'re coming.'},
  {id:'men',label:'The two men',answer:['Nobody\'s got a good picture of \'em.','Every photo came back blurry. Every one blurred the same way.'],note:'No clear photo of the two men exists.'},
  {id:'dead',label:'The dead',answer:['Coroner\'s in Plainview, two towns over.','She called it natural three times.'],note:'The county coroner works in Plainview, two towns over.'},
  {id:'fair',label:'The fair',answer:['Last week of the county fair.','Saturday night, that whole town\'s in one place.'],note:'The whole town goes to the fair\'s last night.'}],
 brief2:[['BIG HAT','You go in with badges. Check in with the sheriff. Act like it.'],['BIG HAT','Be smart, be careful, don\'t get burned.']],
 arrive:'GOOD MANNERS (stand-in). Walk the town with A. Rest at the motel, room 6, to move the day on. START for your notebook.',
 // ---- doors, the car and the day ----
 shut:'Locked.',
 lease:'A FOR LEASE sign in the window, sun-bleached to pink.',
 hardware:'Closed for the fair. A hand-lettered sign: BACK MONDAY.',
 coop:'The co-op office. The blinds are down.',
 gas:'The station\'s door is propped open with a brick.',
 room7:'Room 7. The DO NOT DISTURB tag hangs perfectly straight.',
 office:'The motel office. A bell on the counter and nobody behind it.',
 sign:['WELCOME TO ODESSA FLATS. POP. 900.'],
 west:'Main Street runs on west to the highway. Not yet.',
 edge:'Nothing out there but wheat. Not yet.',
 car:'Your car. Rental plates, hot seats.',carQ:'Where to?',
 drive:{morgue:'Drive to the county morgue (Plainview)',fair:'Drive to the fairground',stay:'Stay'},
 driveTo:{morgue:'Forty minutes of wheat. Then Plainview.',fair:'Ten minutes up the county road. The Ferris wheel comes up over the wheat first.',town:'Back to Odessa Flats.'},
 bed:'The bed. Clean, flat, smells like the dryer.',bedOpt:'Rest until the day moves on',
 turnQ:['Rest until night 1?','Rest until day 2?','Rest until night 2?'],
 turnClose:'The morgue closes for good, and the fair by day is over.',
 turnOpts:['Go on','Not yet'],
 restDone:'Last night of the fair. No resting now.',
 rested:['You sleep a few hours. The air unit rattles the whole time.','You wake up before the alarm.'],
 // ---- the fair ----
 gateIn:['Go in','Not yet'],
 underQ:'The gate under the grandstand stands open. Folding chairs in rows down there in the dark. Once you go in, there\'s no walking back out.',
 underShut:'A chain-link gate under the grandstand, padlocked.',
 underOut:'Head back up to the fair?',underOutOpts:['Go back','Stay'],
 fairExit:'Back to the car?',fairExitOpts:['Drive back to town','Stay'],
 tack:'TACK BOX',tackLook:'A dented tack box by the barn door. Somebody\'s initials scratched in the lid.',tackOpt:'Open it',
 tackFind:'Under the brushes, a baggie of dried mushrooms. "FAIR TEA" on a strip of tape.',
 // ---- the hidden hotspot: only there while the lead is High on Mushrooms (stand-in result) ----
 lessonName:'THE CURB',lessonLook:['Where the two men stand, the air is written on.','(Stand-in: what it says comes in part B.)'],
 // ---- people (stand-ins) ----
 folk:{
  toft:[['SHERIFF TOFT','Marlene Toft. Sheriff. You\'d be the federal people.'],['SHERIFF TOFT','Whatever you\'re here for, you do it where I can see you.']],
  cal:[['DEPUTY BRANDT','Deputy Cal Brandt. Ma\'am. Sir. Whoever.'],['DEPUTY BRANDT','I didn\'t see anything. Just so you know.']],
  doc:[['DR. ABERNATHY','Ines Abernathy. County coroner. Don\'t touch the drawers.'],['DR. ABERNATHY','Three of them. Natural, I wrote. Three times.']],
  rhonda:[['RHONDA','Sit anywhere, hon. Coffee\'s coming whether you want it or not.']],
  dusty:[['DUSTY','Spinner\'s two tickets. Bird\'s free.'],'The parakeet on his shoulder says something that might be "tickets".'],
  jolene:[['JOLENE','If you\'re here about the men, you\'re late.']],
  tanner:[['TANNER','Do you want to hear my laugh? I\'ve been practicing.']],
  orvel:[['ORVEL','Pump\'s cash only. Doris don\'t take cards.'],'The chicken on his shoulder looks at you like it agrees.'],
  voss:[['ARLEN VOSS','Arlen Voss. Co-op, fair board, whatever needs doin\'.'],['ARLEN VOSS','You come out Saturday night. Whole town\'ll be there.']],
  doe:[['MR. DOE','Good afternoon. It is a fine day for the time of year.'],['MR. ROE','...time of year.']],
  roe:[['MR. ROE','Good afternoon.'],['MR. DOE','He means good afternoon.']],
  fairgoer:'A fairgoer with a corn dog in each hand. Neither one bitten.',
  fairgoer2:'Two kids arguing about the spinner. Nobody\'s going on it.',
  fairgoer3:'A man in a seed cap, asleep in a lawn chair with his eyes open. No. Closed. Just squinting.'
 },
 // ---- looks around the maps (part B gives them skills and clues) ----
 look:{
  blackcar:'A black sedan, tinted all the way around. No dust on it. Every other car in Kansas has dust on it.',
  peck:'The Peck house. Every curtain shut, in the middle of the afternoon.',
  grissom:'A porch with a harmonica left on the rail.',
  mailbox:'A roadside mailbox. The flag\'s down.',
  pump:'One pump. No brand on it, just a price somebody repaints by hand.',
  tower:'The water tower. ODESSA FLATS in letters taller than you.',
  desk:'The sheriff\'s desk. Files in two stacks: done and not done. The not-done stack is taller.',
  cabinet:'A file cabinet. The top drawer is labeled DEATHS · 2026.',
  cell:'An empty holding cell. The cot is made with hospital corners.',
  booth:'Two cups of coffee on the table, full, with a skin on them.',
  counter:'The diner counter. Pie under a dome. Nobody\'s cut it.',
  drawers:'Three drawers with three cards: GRISSOM, MEEKS, OSTROW.',
  table:'A steel table under a sheet. Empty, for now.',
  wheel:'The Ferris wheel. The cars rock a little in the wind.',
  spinner:'The spinner, painted with stars. It\'s turning. Nobody\'s on it.',
  booth2:'A ring toss. Every bottle has the same fish in it.',
  barn:'The livestock barn. Somebody\'s goat is yelling about something.',
  stand:'The grandstand. Tonight there\'ll be a crowd up there.',
  chalk:'A chalkboard. The day\'s date in neat capitals, and nothing under it.',
  chairs:'Folding chairs in rows, facing the chalkboard.'
 }
};
const fill=(t,o)=>String(t).replace(/\{(n|m|v)\}/g,(x,k)=>o[k]??x);
async function play(seq,o={}){for(const l of [].concat(seq)){if(Array.isArray(l))await say(l[0],fill(l[1],o));else await say('',fill(l,o))}}
const said=(l,o)=>play([l],o);

// The case board card (spec 010, The card)
const caseCard={file:2,title:'GOOD MANNERS',town:'ODESSA FLATS',place:'COUNTY FAIR · ODESSA FLATS, KS',
 hook:['Two men in suits watch the houses.','The ones they watch don\'t wake up.'],pin:'#3ff0e8'};

// ================= THE DAY =================
// G.flags.ph: 0 day 1, 1 night 1, 2 day 2, 3 night 2 (spec 010, Day and night). Story beats turn it in part B; part A's
// stand-in is the motel bed. Each turn waits for Go on / Not yet (Turning the day); day 2 to night 2 names what closes.
const ph=()=>G.flags.ph|0;
const isNight=()=>ph()%2===1;
const outLight=()=>isNight()?'night':'day';

// ================= MAPS =================
// Every map is drawn by cases/good-manners-art.js from M.ground (what the ground is), M.pieces (buildings, props and
// people's things, each with its tiles) and M.light. M.g is what blocks: '#' blocks, anything else is ground.
// Ground letters (none of them in engine.js's BLOCK set): '.' dry grass, ':' lawn, ',' sidewalk, '=' road, '_' parking lot, 'g' gravel, 'x' dry dirt,
// 'r' dirt road, 'n' linoleum, 'c' carpet, 'v' tile, 'w' wood floor.
function blank(id,name,W,H,fillCh,light){const ground=mk(W,H,fillCh),g=mk(W,H,fillCh);
 return{id,name,w:W,h:H,ground,g,pieces:[],O:{},npcs:[],warps:{},light,art:window.GMA,bg:id,warm:'#ff9a3c',lines:[]}}
const lay=(M,x,y,w,h,c)=>{rect(M.ground,x,y,w,h,c);rect(M.g,x,y,w,h,c)};
const block=(M,x,y,w=1,h=1)=>rect(M.g,x,y,w,h,'#');
const open=(M,x,y)=>{M.g[y][x]=M.ground[y][x]};
// a piece: its kind, its tiles (they block unless o.walk), and anything the art needs to draw it
function put(M,k,x,y,w=1,h=1,o={}){const p=Object.assign({k,x,y,w,h},o);M.pieces.push(p);if(!o.walk)block(M,x,y,w,h);return p}
const look=t=>({look:t});
// a door you walk into: it opens on the far map at (x, y) facing dir
const door=(M,x,y,to,tx,ty,dir='down')=>{open(M,x,y);M.warps[x+','+y]=()=>goTo(to,tx,ty,dir)};
async function goTo(to,x,y,dir){await fade(1);goMap(to,x,y,dir);checkpoint();await fade(0)}
async function bounce(text){await said(text);await stepBack()}
const bounceDir=(M,keys,text,dir)=>keys.forEach(k=>M.warps[k]=async()=>{await said(text);G.dir=dir;await stepBack()});

// ---- MAIN STREET: day and night (44 x 21) ----
function buildMain(){
 const N=isNight(),M=blank('main','MAIN STREET',44,21,'.',outLight()),F=G.flags;
 lay(M,0,0,44,4,'g');block(M,0,0,44,4);put(M,'backlot',0,0,44,4,{walk:1});
 put(M,'elevator',23,0,8,4,{walk:1});
 lay(M,0,8,44,1,',');lay(M,0,9,44,3,'=');lay(M,0,12,44,1,',');
 M.lines.push({x:0,y:10*16-1,w:44*16,h:2,dashed:true});M.lines.push({x:0,y:11*16+15,w:44*16,h:1,col:'#e8dcc0'});
 // north side: storefronts on a gravel alley line, doors on their bottom row
 put(M,'store',1,4,6,4,{sign:'SHERIFF',col:'#9a6a4a',door:3,upper:true,flag:1});door(M,3,7,'office',7,9,'up');
 put(M,'store',8,4,6,4,{sign:'WHEAT KERNEL DINER',col:'#8a3c24',door:11,awning:1});door(M,11,7,'diner',7,9,'up');
 put(M,'store',14,4,3,4,{sign:'FEED',col:'#7a4a34',door:15,dark:1});M.O['15,7']=look(TEXT.lease);
 lay(M,17,4,2,4,'g');
 put(M,'store',19,4,3,4,{sign:'HARDWARE',col:'#8f5a3a',door:20,upper:true});M.O['20,7']=look(TEXT.hardware);
 lay(M,22,4,1,4,',');
 put(M,'coop',23,4,8,4,{sign:'ODESSA FLATS CO-OP',door:26});M.O['26,7']=look(TEXT.coop);
 lay(M,31,4,3,4,'x');put(M,'tree',32,5);
 lay(M,33,4,7,4,',');put(M,'station',34,5,5,3,{sign:'GAS',door:37});M.O['37,7']=look(TEXT.gas);
 put(M,'pump',35,8);M.O['35,8']=look(TEXT.look.pump);
 lay(M,40,4,4,4,'x');put(M,'tree',42,5);put(M,'tree',40,7);
 // lamps along both sidewalks, the blinking light over the alley crossing
 [[6,8],[16,8],[29,8],[41,8],[1,12],[12,12],[24,12],[36,12]].forEach(([x,y])=>put(M,'lamp',x,y));
 put(M,'traffic',17,9,2,3,{walk:1});
 put(M,'bench',23,8,1,1);
 // south side: the motel, its lot and the agents' car, the water tower in the dry grass
 lay(M,1,13,20,8,'_');
 put(M,'motel',2,13,18,4,{door:3,rooms:[6,8,10,12,14,16,18]});
 M.O['3,16']=look(TEXT.office);
 door(M,16,16,'motel',6,7,'up');M.O['18,16']=look(TEXT.room7);
 put(M,'motelsign',21,13,1,1);
 lay(M,1,17,20,1,',');
 put(M,'car',6,19,2,1,{tint:'#5a6a7a'});M.O['6,19']=M.O['7,19']={id:'car',name:'CAR',look:TEXT.car,opts:()=>carOpts()};
 lay(M,21,12,2,9,'_');
 put(M,'tower',33,16,4,2);M.O['34,17']=M.O['35,17']=look(TEXT.look.tower);
 put(M,'welcome',40,13);M.O['40,13']={look:()=>play(TEXT.sign)};
 [[25,15],[29,19],[39,18],[42,15],[26,20],[31,20],[37,20],[43,20],[0,20]].forEach(([x,y])=>put(M,'tree',x,y));
 lay(M,27,14,3,4,'x');
 // people: who's where by phase
 const NP=[];
 if(!N)NP.push({id:'orvel',x:38,y:8,dir:'down'});
 if(ph()<2)NP.push({id:'voss',x:27,y:8,dir:'down'});
 M.npcs=NP.map(n=>Object.assign(n,{talk:()=>play(TEXT.folk[n.id])}));
 bounceDir(M,['0,9','0,10','0,11'],TEXT.west,'right');
 ['43,9','43,10','43,11'].forEach((k,i)=>M.warps[k]=()=>goTo('elm',1,10+(i>1?1:0),'right'));
 return M}

// ---- ELM AND THIRD: day and night (32 x 22) ----
function buildElm(){
 const N=isNight(),M=blank('elm','ELM AND THIRD',32,22,':',outLight());
 lay(M,0,9,32,1,',');lay(M,0,10,32,2,'=');lay(M,0,12,32,1,',');lay(M,13,0,1,22,',');lay(M,16,0,1,22,',');lay(M,14,0,2,22,'=');
 lay(M,0,10,32,2,'=');
 // north side houses, fronts on Elm; the Peck house is watched
 put(M,'house',1,3,5,5,{col:'#c9b48a',roof:'#5a4a3e',door:3,seed:1});M.O['3,7']=look(TEXT.shut);
 put(M,'house',7,2,5,6,{col:'#8a9aa8',roof:'#3e3a46',door:8,porch:1,seed:2,shutters:'#3e5a4a'});M.O['8,7']=look(TEXT.look.grissom);
 put(M,'house',18,2,6,6,{col:'#d8cdb0',roof:'#6a3a2e',door:20,porch:1,curtains:1,seed:3,shut:1});M.O['20,7']=look(TEXT.look.peck);
 put(M,'house',25,3,6,5,{col:'#a8a070',roof:'#4a4038',door:26,garage:1,seed:4});M.O['26,7']=look(TEXT.shut);
 [[2,8,false],[9,8,true],[21,8,false],[28,8,false]].forEach(([x,y,f])=>{put(M,'mailbox',x,y,1,1,{flag:f});M.O[x+','+y]=look(TEXT.look.mailbox)});
 put(M,'fence',0,1,13,1);put(M,'fence',17,1,15,1);
 // south side: two houses with their backs to Elm, a vacant lot
 put(M,'fence',0,13,12,1);put(M,'fence',17,13,9,1);
 put(M,'house',2,15,6,5,{col:'#b8a8c0',roof:'#3e3a46',door:4,seed:5,back:1});
 put(M,'house',18,15,6,5,{col:'#c8b898',roof:'#5a3e2e',door:20,seed:6,back:1});
 lay(M,26,13,6,9,'.');lay(M,9,14,3,7,'.');
 [[0,0],[5,0],[11,0],[18,0],[24,0],[30,0],[27,14],[30,17],[26,19],[29,20],[10,15],[0,16],[24,20],[9,20],[1,21],[12,21]].forEach(([x,y])=>put(M,'tree',x,y));
 put(M,'swing',27,16,3,1);
 [[12,9],[27,9],[5,12],[17,12]].forEach(([x,y])=>put(M,'lamp',x,y));
 // the black car, parked across from the Peck house; the two men on the curb beside it
 put(M,'blackcar',19,11,2,1);M.O['19,11']=M.O['20,11']={id:'blackcar',name:'BLACK CAR',look:TEXT.look.blackcar};
 const NP=[];
 if(ph()<2){NP.push({id:'doe',x:21,y:12,dir:'up'},{id:'roe',x:22,y:12,dir:'up'})}
 if(!N&&ph()<2){NP.push({id:'jolene',x:22,y:8,dir:'down'},{id:'tanner',x:19,y:8,dir:'down'})}
 M.npcs=NP.map(n=>Object.assign(n,{talk:()=>play(TEXT.folk[n.id])}));
 // The hidden hotspot (Item list, Mushrooms): where the men stand, only while the lead is High (field.js, hidden)
 M.O['23,12']={id:'lesson',hidden:'mushrooms',name:TEXT.lessonName,look:()=>play(TEXT.lessonLook),glint:(c,x,y,now)=>GMA.lessonGlint(c,x,y,now)};
 ['0,10','0,11'].forEach((k,i)=>M.warps[k]=()=>goTo('main',42,10+i,'left'));
 bounceDir(M,['14,0','15,0'],TEXT.edge,'down');bounceDir(M,['14,21','15,21'],TEXT.edge,'up');bounceDir(M,['31,10','31,11'],TEXT.edge,'left');
 return M}

// ---- interiors: 15 tiles wide (the screen's width), the back wall three tiles tall, the door in the bottom wall ----
function room(id,name,W,H,floor){const M=blank(id,name,W,H,floor,'day');block(M,0,0,W,3);block(M,0,0,1,H);block(M,W-1,0,1,H);block(M,0,H-1,W,1);
 put(M,'room',0,0,W,H,{walk:1,floor});return M}
function buildOffice(){const M=room('office','SHERIFF\'S OFFICE',15,11,'n');
 put(M,'desk',3,3,2,1);M.O['3,3']=M.O['4,3']=look(TEXT.look.desk);
 put(M,'cabinet',1,3);M.O['1,3']=look(TEXT.look.cabinet);
 put(M,'cell',10,3,4,3);M.O['10,5']=M.O['11,5']=M.O['12,5']=M.O['13,5']=look(TEXT.look.cell);
 put(M,'benchin',1,8,2,1);put(M,'plant',13,8);put(M,'shelfin',6,3,2,1,{stocked:true});put(M,'rug',5,6,4,3,{walk:1,col:'#6a3a2e'});
 M.npcs=[{id:'toft',x:4,y:5,dir:'down'},{id:'cal',x:9,y:7,dir:'left'}].map(n=>Object.assign(n,{talk:()=>play(TEXT.folk[n.id])}));
 door(M,7,10,'main',3,8,'down');return M}
function buildDiner(){const M=room('diner','WHEAT KERNEL DINER',15,11,'n');
 put(M,'counter',1,4,7,1);M.O['2,4']=M.O['3,4']=M.O['6,4']=look(TEXT.look.counter);M.O['4,4']=M.O['5,4']=()=>play(TEXT.folk.rhonda);  // Rhonda talks across the counter
 put(M,'shelfin',1,3,2,1,{stocked:true});put(M,'piecase',5,3,2,1);
 [[10,4],[10,7]].forEach(([x,y])=>put(M,'table',x,y,2,1));put(M,'table',2,7,2,1);
 M.O['10,7']=M.O['11,7']=look(TEXT.look.booth);put(M,'cups',10,7,2,1,{walk:1});
 put(M,'jukebox',13,3);put(M,'plant',13,8);
 M.npcs=[{id:'rhonda',x:4,y:3,dir:'down'}].map(n=>Object.assign(n,{talk:()=>play(TEXT.folk[n.id])}));
 door(M,7,10,'main',11,8,'down');return M}
function buildMotel(){const M=room('motel','ROOM 6 · PRAIRIE REST MOTEL',12,9,'c');
 put(M,'bed',2,3,2,2);M.O['2,4']=M.O['3,4']={id:'bed',name:'BED',look:TEXT.bed,opts:()=>ph()<3?[{label:TEXT.bedOpt,run:turnDay}]:[],used:()=>false};
 put(M,'nightstand',4,3);put(M,'desk',8,3,2,1,{tv:1});put(M,'chair',9,6);put(M,'ac',6,2,1,1,{walk:1});put(M,'rug',4,5,4,2,{walk:1,col:'#4a5a3a'});put(M,'plant',10,6);
 door(M,6,8,'main',16,17,'down');return M}
function buildMorgue(){const M=room('morgue','COUNTY MORGUE · PLAINVIEW',15,11,'v');
 put(M,'drawers',6,0,6,3,{walk:1});M.O['7,3']=M.O['8,3']=M.O['9,3']=M.O['10,3']=look(TEXT.look.drawers);block(M,6,3,5,1);
 put(M,'slab',5,6,3,1);M.O['5,6']=M.O['6,6']=M.O['7,6']=look(TEXT.look.table);
 put(M,'desk',1,3,2,1);put(M,'sink',13,3);put(M,'shelfin',13,6,1,2,{stocked:true});put(M,'drain',7,8,1,1,{walk:1});put(M,'cabinet',1,7);put(M,'xray',2,0,2,3,{walk:1});
 M.npcs=[{id:'doc',x:10,y:6,dir:'left'}].map(n=>Object.assign(n,{talk:()=>play(TEXT.folk[n.id])}));
 M.warps['7,10']=()=>driveTo('town');open(M,7,10);return M}

// ---- THE FAIRGROUND: day 2, then night 2 (40 x 26); a danger zone on night 2 in part B ----
function buildFair(){
 const N=isNight(),M=blank('fair','COUNTY FAIRGROUND',40,26,'.',N?'night':'day');M.alpha=.8;  // the fair's last night is the brightest night in the case
 lay(M,0,0,40,2,'.');block(M,0,0,40,1);put(M,'fairfence',0,1,40,1);
 lay(M,2,11,36,3,'r');lay(M,18,11,4,15,'r');lay(M,12,14,3,4,'x');lay(M,22,14,4,3,'x');
 put(M,'wheel',3,6,8,4);M.O['6,9']=M.O['7,9']=look(TEXT.look.wheel);
 put(M,'spinner',28,4,7,5);M.O['30,8']=M.O['31,8']=M.O['32,8']=look(TEXT.look.spinner);
 [['RING TOSS','#ff6fae'],['DUCKS','#4fd8e0'],['DARTS','#d8b24a'],['CORN DOGS','#b5532e']].forEach(([t,c],i)=>{const x=13+i*3;put(M,'booth',x,8,2,2,{sign:t,stripe:c});M.O[x+','+9]=M.O[(x+1)+','+9]=look(TEXT.look.booth2)});
 put(M,'barn',1,15,9,6);M.O['4,20']=M.O['5,20']=M.O['6,20']=look(TEXT.look.barn);
 put(M,'pen',10,18,3,2);put(M,'tack',8,21);M.O['8,21']={id:'tack',name:TEXT.tack,look:TEXT.tackLook,opts:[{label:TEXT.tackOpt,once:'tack',run:async()=>{await said(TEXT.tackFind);await pickup('shrooms')}}]};
 put(M,'grandstand',26,15,13,7);M.O['29,21']=M.O['30,21']=look(TEXT.look.stand);
 // the gate under the grandstand: chained by day; on night 2 it stands open and asks Go in / Not yet
 if(N){open(M,33,21);M.warps['33,21']=enterUnder}else M.O['33,21']={id:'under',name:'GATE',look:TEXT.underShut};
 lay(M,26,22,13,1,'x');
 [[2,23],[6,24],[11,23],[27,24],[33,25],[37,23],[38,10],[1,10],[24,4],[14,4],[0,13],[39,14]].forEach(([x,y])=>put(M,'tree',x,y));
 [[12,11],[24,11],[17,16],[22,20]].forEach(([x,y])=>put(M,'pole',x,y));
 put(M,'lights',12,11,13,1,{walk:1,from:[12,11],to:[24,11]});put(M,'lights',17,16,6,5,{walk:1,from:[17,16],to:[22,20]});
 [[16,20],[24,23]].forEach(([x,y])=>put(M,'table',x,y,2,1));
 [[9,12],[27,12],[17,24],[22,24]].forEach(([x,y])=>put(M,'lamp',x,y));
 put(M,'arch',17,25,6,1,{walk:1});
 ['19,25','20,25','18,25','21,25'].forEach(k=>{M.warps[k]=async()=>{const r=await ask('',TEXT.fairExit,TEXT.fairExitOpts);if(r===0)await driveTo('town');else{G.dir='up';await stepBack()}}});
 const NP=[{id:'dusty',x:31,y:10,dir:'down'}];
 if(!N){NP.push({id:'voss',x:28,y:13,dir:'down'},{id:'jolene',x:9,y:11,dir:'right'},{id:'tanner',x:8,y:11,dir:'up'},{id:'doe',x:25,y:13,dir:'left'},{id:'roe',x:26,y:13,dir:'left'},
  {id:'fairgoer',x:15,y:13,dir:'up'},{id:'fairgoer2',x:21,y:17,dir:'left'},{id:'fairgoer3',x:16,y:21,dir:'down'})}
 else NP.push({id:'jolene',x:9,y:11,dir:'right'},{id:'fairgoer2',x:21,y:17,dir:'left'});
 M.npcs=NP.map(n=>Object.assign(n,{talk:()=>play(TEXT.folk[n.id])}));
 return M}
async function enterUnder(){const r=await ask('',TEXT.underQ,TEXT.gateIn);if(r===0)await goTo('under',10,8,'up');else{G.dir='down';await stepBack()}}
// ---- UNDER THE GRANDSTAND: night 2, the finale area (20 x 10); the boss waits here in part B ----
function buildUnder(){const M=blank('under','UNDER THE GRANDSTAND',20,10,'x','night');block(M,0,0,20,2);block(M,0,0,1,10);block(M,19,0,1,10);block(M,0,9,20,1);
 put(M,'underroom',0,0,20,10,{walk:1});put(M,'chalk',8,1,4,1,{walk:1});M.O['8,1']=M.O['11,1']=look(TEXT.look.chalk);
 for(const y of[4,6])for(const x of[4,6,8,11,13,15])put(M,'chair',x,y);M.O['8,6']=look(TEXT.look.chairs);
 M.npcs=[{id:'doe',x:9,y:2,dir:'down'},{id:'roe',x:10,y:2,dir:'down'}].map(n=>Object.assign(n,{talk:()=>play(TEXT.folk[n.id])}));
 open(M,10,9);M.warps['10,9']=async()=>{const r=await ask('',TEXT.underOut,TEXT.underOutOpts);if(r===0)await goTo('fair',33,23,'down');else{G.dir='up';await stepBack()}};
 return M}
const MAPS={main:buildMain,elm:buildElm,office:buildOffice,diner:buildDiner,motel:buildMotel,morgue:buildMorgue,fair:buildFair,under:buildUnder};

// ================= STAND-IN SCRIPTS =================
function carOpts(){const o=[];if(ph()%2===0&&ph()<3)o.push({label:TEXT.drive.morgue,run:()=>driveTo('morgue')});if(ph()>=2)o.push({label:TEXT.drive.fair,run:()=>driveTo('fair')});return o}
async function driveTo(where){await fade(1);await say('',TEXT.driveTo[where]);
 if(where==='morgue')goMap('morgue',7,9,'up');else if(where==='fair')goMap('fair',19,24,'up');else goMap('main',8,19,'left');checkpoint();await fade(0)}
// the stand-in for the story's turns of the day: the motel bed, with Go on / Not yet (studio-bible/play.md)
async function turnDay(){const p=ph();if(p>=3){await said(TEXT.restDone);return}
 const r=await ask('',TEXT.turnQ[p]+(p===2?' '+TEXT.turnClose:''),TEXT.turnOpts);if(r!==0)return;
 await fade(1);G.flags.ph=p+1;await play(TEXT.rested);goMap('motel',3,6,'down');banner(TEXT.phase[p+1]);checkpoint();await fade(0)}

// ================= OPENING (stand-in briefing in the combine cab) =================
async function caseOpening(){
 await cut('open',async()=>{await said(TEXT.open1);await said(TEXT.open2)});
 await bigHatScene(async()=>{
  await cut('brief',()=>play(TEXT.brief));
  await twoQuestions(TEXT.intel);
  await cut('brief2',()=>play(TEXT.brief2));
  await requisition();
 },{place:window.GMA.combine});
 G.flags.ph=0;G.mode='world';goMap('main',8,19,'left');checkpoint();await fade(0);
 await cut('arrive',()=>said(TEXT.arrive));
}
const caseNext=()=>TEXT.next[ph()]||'';

// ================= ON THE CASE BOARD =================
// Part A has no ending yet: the Dev map menu's Dev: finish case closes it through the real debrief, as a stand-in.
const facts=l=>({label:l,clues:[],saved:0,overstep:(stepsOf()[loadSeason().overstep|0]||'Clean'),san:party.map(m=>({id:m.a.id,name:m.name,from:m.san0,to:m.san})),items:[],choices:{},tried:[],lost:[]});
registerCase({id:'good-manners',card:caseCard,opening:caseOpening,intel:TEXT.intel,maps:MAPS,tiles:{},
 portraits:name=>window.GMA.portraits[name]||null,items:{},next:caseNext,quiet:false,loot:['energy','cigarettes','roadflare','painkillers','firecrackers'],
 label:()=>'clean',facts,
 debrief:{clues:[],lines:{clean:[['BIG HAT','Stand-in debrief. The real one comes with the story. Sit.']]},
  stories:[{name:'Nothing happened',skill:'Persuade',verb:'sell it',pass:[['BIG HAT','Nothing happened. Good.']]}],weak:{name:'Kids',pass:[]}}});
})();
