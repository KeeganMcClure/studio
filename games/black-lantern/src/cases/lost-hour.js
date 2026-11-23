// Black Lantern · cases/lost-hour.js
// CASE: Lost Hour (FILE 04), Cullen Gap, Virginia, on a two-lane road through the Blue Ridge, in April (spec 016).
// Part A (Nov 23, 2026): the card, every map (Cullen Gap by day and night, the Pruett house, the diner, the clinic and its
// sleep lab and exam room, the ridge road and the woods below the overlook in fog by night, and the finale area), the
// townsfolk and the Pruetts on the map and in the dialog box, Big Hat's own briefing place, and stand-in scripts so every
// map walks and every door and drive goes where it should. No clues, fights or story yet: those are part B, written from
// the secret case file.
// Art is cases/lost-hour-art.js (window.LHA), loaded right after this file. Needs engine.js and field.js first.
// The whole file sits in one function so its names never meet another case's (every case loads as a plain script).
(function(){

// ================= TEXT =================
// Every line of the case. A list plays box by box: a plain string is narration, ['WHO', 'line'] is someone talking.
// Part A's lines are stand-ins, kept plain; part B rewrites them from the case file in Keegan's voice.
const TEXT={
 next:['Day 1. Walk Cullen Gap. When you\'re ready, take the car up the ridge road.','Night 1. The ridge road, in fog. The car can take you back down, or call it a night.','Day 2. It\'s raining. When you\'re ready, wait for dark at the car.','Night 2. The pasture gate at the end of Laurel Street.'],
 phase:['DAY 1 · AFTERNOON','NIGHT 1 · THE RIDGE ROAD','DAY 2 · RAIN','NIGHT 2'],
 // ---- the briefing (stand-in) ----
 open1:'TUESDAY · 4:06 AM',
 open2:'A text from an unlisted number: "I-81, EXIT 247. THE SPIN CITY. BRING QUARTERS."',
 brief:['A 24-hour laundromat off the interstate. One tube light flickering. Every dryer is turning, and nobody else is here.',['BIG HAT','Agent {code}. Sit. Don\'t touch that basket, it ain\'t mine.'],
  'He\'s in a molded plastic chair. A dryer behind him turns something red, around and around.',['BIG HAT','Cullen Gap, Virginia. Two folks lost an evenin\'.'],['BIG HAT','Stand-in briefin\'. The real one comes with the story.']],
 // Big Hat's four topics (spec 013): their edges come in part B
 intel:[
  {id:'pruetts',label:'The Pruetts',answer:['Ray and Donna. Married forty years.','Signed up for a sleep study. She can\'t sleep, he won\'t say.'],note:'Ray and Donna Pruett, Laurel Street, Cullen Gap.'},
  {id:'hours',label:'The missing hours',answer:['Left a weddin\' at ten. Home at a quarter past three.','It\'s forty minutes of road.'],note:'They left at 10 PM and got home at 3:15 AM.'},
  {id:'ridge',label:'The ridge road',answer:['Mile thirty-one.','Fog sits on it like it pays rent.'],note:'The ridge road, around mile 31.'},
  {id:'cover',label:'The cover',answer:['You\'re from the sleep study.','Lab coats, clipboards. A consent form you won\'t read neither.'],note:'Cover: researchers from the sleep study.'}],
 brief2:[['BIG HAT','Quiet case. They asked for help. Don\'t make \'em sorry.'],['BIG HAT','Be smart, be careful, don\'t get burned.']],
 arrive:'LOST HOUR (stand-in). Walk Cullen Gap with A. Take the car up the ridge road to move on to night. START for your notebook.',
 // ---- the car and the day ----
 car:'Your car. A rental, with a SLEEP STUDY parking permit on the dash.',carQ:'Where to?',
 carOpt:{ridge:'Drive up the ridge road',down:'Drive back down to Cullen Gap',rest:'Call it a night',dark:'Wait for dark'},
 driveTo:{ridge:'Up the two-lane, switchback after switchback. The fog comes down to meet you.',town:'Back down the mountain. The fog lets go at the town line.'},
 turnOpts:['Go on','Not yet'],
 turnQ:['Drive up the ridge road? The day ends on the mountain.','Call it a night? Day 2 starts in the morning.','Wait for dark? Night 2 starts.'],
 turnClose:['Birdie leaves Cullen Gap tonight.','The ridge road and the woods below the overlook close for good.','The sleep lab and the exam room close, and the session can\'t be run again.'],
 turned:[['The road up the ridge is all curves. By the time you reach the pull-off, the sun is gone and the fog has the mountain.'],
  ['You find a motel off the highway. Nobody sleeps much.','In the morning it\'s raining.'],
  ['The rain stops at dusk. The fog doesn\'t.','Up on the hill above Laurel Street, the pasture is white with it.']],
 // ---- town edges and doors ----
 west:'Route 211, back toward the highway. Not yet.',
 east:'Route 211 climbs out of town toward the ridge. Take the car.',
 shutDiner:'THE GAP DINER. A sign in the door: CLOSED. OPEN 6 AM.',
 shutStore:'Closed for the night.',
 hardware:'TOLLIVER HARDWARE. Rakes and seed packets in the window. A sign: WE HAVE ROAD FLARES.',
 post:'The post office. A flag on the pole, a box for outgoing mail.',
 church:'Cullen Gap Methodist. The marquee: SPRING SUPPER SAT 5PM. ALL WELCOME.',
 neighbor:'A white house with green shutters. Nobody answers.',
 gateShut:'A pasture gate at the end of Laurel Street, chained. The hill beyond is just a hill.',
 gateQ:'The pasture gate stands open. Up the hill, the fog sits on the grass like it\'s waiting.',
 gateIn:['Go in','Not yet'],
 fieldOut:'Go back down to Laurel Street?',fieldOutOpts:['Go back','Stay'],
 trailDown:'A trail goes down off the end of the wall, into the fog.',trailQ:'Climb down below the overlook?',trailOpts:['Climb down','Stay'],
 trailUp:'Climb back up to the overlook?',trailUpOpts:['Climb up','Stay'],
 roadW:'The road winds back down toward Cullen Gap. Take the car.',
 roadE:'The road climbs on over the ridge. Not tonight.',
 drop:'The guardrail, and past it, nothing but fog.',
 labShut:'The sleep lab is locked for the night.',examShut:'The exam room is locked for the night.',
 // ---- the hidden hotspot: only there while the lead is High on Mushrooms (stand-in result) ----
 seamName:'THE SEAM',seamLook:['Over the wall, the fog has a seam in it, straight as a fold in paper.','(Stand-in: what it means comes in part B.)'],
 register:'TRAIL REGISTER',registerLook:'A wooden box on a post. SIGN IN. A pencil on a string. The book inside is damp.',registerOpt:'Look in the box',
 registerFind:'Under the book, a sandwich bag of little dried mushrooms. A note: FOR THE VIEW.',
 // ---- people (stand-ins) ----
 folk:{
  ray:[['RAY','You\'re the sleep people.'],['RAY','I feel fine. It\'s her that can\'t sleep.']],
  donna:[['DONNA','Come in, come in. Don\'t mind the lights.'],['DONNA','I like it bright in here. That\'s all.']],
  jenna:[['JENNA','Jenna. Their daughter.'],['JENNA','A sleep study. Sure. Let me see some ID.']],
  mae:[['MAE','Sit anywhere. Coffee\'s on.'],['MAE','You\'re not from here. I\'d remember.']],
  owen:[['OWEN','Oh! Hi. I\'m the night tech. Owen.'],['OWEN','Don\'t mind the headlamp. The lab lights are out back there.']],
  hensley:[['DEP. HENSLEY','Deputy Hensley. You\'re the study folks.'],['DEP. HENSLEY','The Pruetts are good people. Be good to them.']],
  birdie:[['BIRDIE','I\'m the one found the card. Up at the overlook.'],['BIRDIE','I\'m off tonight. The warblers won\'t wait.']],
  rao:[['DR. RAO','Anand Rao. I run the center.'],['DR. RAO','We should talk about Mr. Pruett\'s scan. Not out here.']],
  cecil:[['CECIL','Coconut cream. Every day since 1987.'],['CECIL','Saw a light that night, too. Over the ridge. Didn\'t blink.']]
 },
 // ---- looks around the maps (part B gives them skills and clues) ----
 look:{
  clinic:'BLUE RIDGE SLEEP CENTER, in gold on the glass. Carved over the columns: FARMERS BANK 1911.',
  deposit:'A brass NIGHT DEPOSIT slot in the stone. Somebody taped a note over it: NOT A MAILBOX.',
  diner:'THE GAP DINER. Pie case in the window. Somebody drew a smiley face in the fog on the glass.',
  car:'A sedan under the carport. On the hood, a burned ring, perfectly round, the paint inside it like new.',
  cruiser:'A county cruiser, engine running. The radio inside murmurs about a loose cow on 340.',
  mailbox:'PRUETT, in reflective stickers. One letter is peeling.',
  tree:'A redbud in full bloom. The petals are everywhere.',
  dogwood:'A dogwood, white as a sheet.',
  bench:'A bench. A plaque: IN MEMORY OF HAROLD, WHO SAT HERE.',
  table:'The kitchen table. Coffee rings, a crossword, a flashlight.',
  photos:'Wedding photos. Jenna in white, Ray crying, Donna laughing at him. A reception in a hall full of people.',
  fridge:'The fridge. A save-the-date, a church bulletin, a magnet shaped like Virginia.',
  stove:'A kettle on the stove, still warm.',
  lamp:'Every lamp in the house is on.',
  bed:'The bed is made. On Donna\'s side, a flashlight on the pillow.',
  nightlights:'A row of night-lights on the dresser. A duck, a moon, a lighthouse. All on.',
  lineman:'A photo of Ray up a power pole in a storm, grinning.',
  window:'The window faces the ridge. The curtain\'s pinned shut.',
  counter:'The counter. Every stool has a name scratched under it.',
  pie:'The pie case. COCONUT CREAM, a sign says, RESERVED: CECIL.',
  booth:'A red booth, the vinyl patched with tape.',
  jukebox:'A jukebox, unplugged. A sign: BROKE SINCE \'09.',
  desk:'The front desk, in the old teller cage. A bell, a clipboard, a jar of lollipops.',
  vault:'The old bank vault. Its door stands open. Inside: file boxes, floor to ceiling.',
  chairs:'Waiting room chairs. A magazine from 2019.',
  clock:'A tall clock, five minutes slow.',
  labbed:'The sleep lab bed. Wires on every side, the stickers still on them.',
  monitor:'The monitor. A green line, crawling.',
  mirror:'A long window in the wall, black from this side. A one-way window.',
  obs:'A desk with a keyboard and a cold cup of coffee.',
  examtable:'An exam table, the paper fresh.',
  lightbox:'A light box on the wall. A scan clipped to it: a skull from the side.',
  cabinet:'A glass cabinet. Gauze, swabs, a sharps box.',
  marker:n=>`A mile marker. MILE ${n}.`,
  curve:'A yellow sign: CURVE. Somebody shot a hole in it.',
  viewer:'A coin viewer, pointed at the fog. 25¢ · 2 MIN.',
  wall:'The overlook\'s stone wall. Below it, fog, and the tops of trees.',
  sign:'BLUE RIDGE OVERLOOK · ELEV. 3,280 FT.',
  shoe:'A woman\'s shoe, half in the mud. A nice one, for a wedding.',
  hubcap:'A hubcap in the leaves, scratched on the inside.',
  creek:'A creek, loud in the quiet. Too cold to wade.',
  ledge:'A rock ledge. Dry underneath.',
  thicket:'Rhododendron, too thick to push through.',
  trough:'A cattle trough. The water has a skin of fog on it.',
  ring:'A ring of flattened grass, perfectly round.',
  barn:'An old hay barn, the door off its track.',
  fence:'The pasture fence.'
 }
};
const fill=(t,o)=>String(t).replace(/\{(n|m|v)\}/g,(x,k)=>o[k]??x);
async function play(seq,o={}){for(const l of [].concat(seq)){if(Array.isArray(l))await say(l[0],fill(l[1],o));else await say('',fill(l,o))}}
const said=(l,o)=>play([l],o);
// A point of no return (studio-bible/play.md): the cursor starts on Not yet, so mashing A can't take it.
async function askNotYet(text,opts){await say('',text,{keep:true,instant:false});const r=await choose(opts,{cancel:true,inBox:true,sel:opts.length-1});hideTB();return r<0?opts.length-1:r}

// The case board card (spec 016, The card)
const caseCard={file:4,title:'LOST HOUR',town:'CULLEN GAP',place:'RIDGE ROAD · CULLEN GAP, VA',
 hook:['Ten to three. Nobody remembers.','The car came home with a full tank.'],pin:'#c8b8ff'};

// ================= THE DAY =================
// G.flags.ph: 0 day 1, 1 night 1 (the ridge road), 2 day 2 (rain), 3 night 2 (spec 016, Day and night). Each turn waits for
// Go on / Not yet at the car, naming what closes (Turning the day); part B moves them onto the story's beats.
const ph=()=>G.flags.ph|0;
const isNight=()=>ph()===1||ph()===3;

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
const folkOf=list=>list.map(n=>Object.assign(n,{talk:()=>play(TEXT.folk[n.id])}));
const door=(M,x,y,to,tx,ty,dir='down')=>{open(M,x,y);M.warps[x+','+y]=()=>goTo(to,tx,ty,dir)};
async function goTo(to,x,y,dir){await fade(1);goMap(to,x,y,dir);checkpoint();await fade(0)}
const bounceDir=(M,keys,text,dir)=>keys.forEach(k=>M.warps[k]=async()=>{await said(text);G.dir=dir;await stepBack()});
const range=(a,b)=>Array.from({length:b-a},(_,i)=>a+i);

// ---- CULLEN GAP: every phase (46 x 26). Main Street across the middle, Laurel Street south to the Pruetts' ----
function buildTown(){
 const N=isNight(),M=blank('town','CULLEN GAP',46,26,'.',N?'night':'day');M.alpha=.86;M.warm='#ffcf80';M.rain=ph()===2;
 // the ridge behind town, then the north side's buildings; their doors open on row 6
 block(M,0,0,46,2);put(M,'ridgeback',0,0,46,2,{walk:1});
 lay(M,0,2,46,5,'.');
 put(M,'bank',1,2,8,5,{door:5});
 if(ph()===3)M.O['5,6']=look(TEXT.shutStore);else door(M,5,6,'clinic',7,9,'up');
 M.O['3,6']=M.O['7,6']=look(TEXT.look.clinic);M.O['2,6']=look(TEXT.look.deposit);
 put(M,'store',10,2,7,5,{sign:'THE GAP DINER',col:'#5a7a8a',door:13,awning:1,diner:1});
 if(N)M.O['13,6']=look(TEXT.shutDiner);else door(M,13,6,'diner',7,8,'up');
 M.O['11,6']=M.O['15,6']=look(TEXT.look.diner);
 put(M,'blossom',17,4,1,1,{v:0});
 put(M,'store',18,2,5,5,{sign:'HARDWARE',col:'#8a3c24',door:21,upper:1});M.O['21,6']=look(TEXT.hardware);
 put(M,'store',23,2,4,5,{sign:'POST OFFICE',col:'#9a6a4a',door:25,flag:1});M.O['25,6']=look(TEXT.post);
 put(M,'blossom',27,4,1,1,{v:1,white:1});
 put(M,'church',29,0,7,7,{door:32});block(M,29,2,7,5);M.O['32,6']=look(TEXT.church);
 put(M,'blossom',37,4,1,1,{v:2});put(M,'house',39,2,6,5,{col:'#d8d0c0',roof:'#4a5a6a',door:41,seed:3,porch:1});M.O['41,6']=look(TEXT.neighbor);
 // Main Street: the sidewalks, the two-lane, a crossing at Laurel
 lay(M,0,7,46,1,',');lay(M,0,8,46,4,'=');lay(M,0,12,46,1,',');
 put(M,'road',0,8,46,4,{walk:1});
 [[4,7],[16,7],[28,7],[40,7],[9,12],[24,12],[36,12]].forEach(([x,y])=>put(M,'lamp',x,y));
 put(M,'bench',19,7);M.O['19,7']=look(TEXT.look.bench);put(M,'planter',8,7);put(M,'planter',26,7);
 bounceDir(M,['0,8','0,9','0,10','0,11'],TEXT.west,'right');bounceDir(M,['45,8','45,9','45,10','45,11'],TEXT.east,'left');
 // the south side: the team's car in a little lot, Hensley's cruiser, Laurel Street, the Pruett house
 lay(M,1,13,8,4,'_');put(M,'car',2,14,3,1,{tint:'#7a8494'});[2,3,4].forEach(x=>M.O[x+',14']={id:'car',name:'CAR',look:TEXT.car,opts:()=>carOpts(),used:()=>false});
 put(M,'phonebooth',7,13);
 put(M,'cruiser',36,13,3,1);[36,37,38].forEach(x=>M.O[x+',13']=look(TEXT.look.cruiser));
 put(M,'house',10,14,7,5,{col:'#e8e4d8',roof:'#3e5a4a',door:13,seed:5,shutters:'#3e6a4a'});M.O['13,18']=look(TEXT.neighbor);
 put(M,'blossom',17,15,1,1,{v:1,white:1});put(M,'picket',10,20,8,1);
 lay(M,19,13,3,11,'=');put(M,'laurel',19,13,3,11,{walk:1});
 put(M,'pruett',23,13,8,6,{door:26});door(M,26,18,'kitchen',6,8,'up');M.O['24,18']=M.O['29,18']=look(TEXT.look.lamp);
 put(M,'carport',31,14,4,5,{walk:1});block(M,31,14,4,1);block(M,34,15,1,3);
 put(M,'pcar',32,16,2,2);[32,33].forEach(x=>M.O[x+',18']=look(TEXT.look.car));
 lay(M,22,19,13,2,'g');lay(M,31,18,3,1,'g');put(M,'mailbox',22,20);M.O['22,20']=look(TEXT.look.mailbox);
 put(M,'blossom',38,16,1,1,{v:0});put(M,'blossom',42,13,1,1,{v:2,white:1});put(M,'blossom',2,19,1,1,{v:2});put(M,'blossom',6,21,1,1,{v:1,white:1});
 lay(M,36,19,7,3,';');lay(M,1,22,7,1,';');
 put(M,'shrub',24,21);put(M,'shrub',28,21);put(M,'shrub',35,21);put(M,'shrub',11,22);put(M,'shrub',43,19);
 // the pasture fence across the bottom, with its gate at Laurel's end (night 2: Go in / Not yet)
 put(M,'pasture',0,23,46,3,{walk:1,gate:20});block(M,0,24,46,2);block(M,0,23,19,1);block(M,22,23,24,1);
 if(ph()===3){open(M,20,24);M.warps['20,24']=enterField}else M.O['20,24']={id:'gate',name:'GATE',look:TEXT.gateShut};
 // people: who's where by phase
 const NP=[],p=ph();
 if(p===0)NP.push({id:'birdie',x:15,y:7,dir:'down'},{id:'hensley',x:35,y:12,dir:'down'},{id:'ray',x:31,y:19,dir:'left'},{id:'jenna',x:25,y:20,dir:'down'});
 if(p===1)NP.push({id:'hensley',x:35,y:12,dir:'down'});
 if(p===2)NP.push({id:'hensley',x:35,y:12,dir:'down'},{id:'jenna',x:25,y:20,dir:'down'});
 M.npcs=folkOf(NP);
 return M}

// ---- interiors: the back wall three tiles tall, the door in the bottom wall ----
function room(id,name,W,H,floor,o={}){const M=blank(id,name,W,H,floor,isNight()?'night':'day');M.alpha=o.alpha||.86;M.warm='#ffcf80';
 block(M,0,0,W,3);block(M,0,0,1,H);block(M,W-1,0,1,H);block(M,0,H-1,W,1);put(M,'room',0,0,W,H,{walk:1,floor});return M}
// a door in the back wall you walk up into
const backDoor=(M,x,to,tx,ty,shut)=>{put(M,'backdoor',x,1,1,2,{walk:1,shut:!!shut});if(shut){M.O[x+',2']=look(shut)}else{open(M,x,2);M.warps[x+',2']=()=>goTo(to,tx,ty,'down')}};
function buildKitchen(){const M=room('kitchen','PRUETT HOUSE',13,10,'n',{alpha:.6});
 put(M,'fridge',1,3);M.O['1,3']=look(TEXT.look.fridge);put(M,'stove',2,3);M.O['2,3']=look(TEXT.look.stove);put(M,'ksink',3,3,2,1);
 put(M,'photos',5,0,3,3,{walk:1});M.O['6,3']=M.O['5,3']=M.O['7,3']=look(TEXT.look.photos);
 put(M,'table',5,5,3,2);M.O['5,5']=M.O['6,5']=M.O['7,5']=look(TEXT.look.table);
 put(M,'floorlamp',11,3);M.O['11,3']=look(TEXT.look.lamp);put(M,'floorlamp',1,7);put(M,'plant',11,7);put(M,'hutch',10,3);
 put(M,'fan',6,4,1,1,{walk:1});
 backDoor(M,9,'bedroom',5,6);
 const p=ph(),NP=[];NP.push({id:'donna',x:4,y:6,dir:'right'});if(p!==0)NP.push({id:'ray',x:8,y:6,dir:'left'});if(p>=2)NP.push({id:'jenna',x:10,y:5,dir:'left'});
 M.npcs=folkOf(NP);
 door(M,6,9,'town',26,19,'down');return M}
function buildBedroom(){const M=room('bedroom','PRUETT HOUSE · BEDROOM',11,8,'c',{alpha:.6});
 put(M,'bed',4,3,2,2);M.O['4,3']=M.O['5,3']=look(TEXT.look.bed);put(M,'floorlamp',1,3);put(M,'floorlamp',8,3);
 put(M,'dresser',7,3,1,1);M.O['7,3']=look(TEXT.look.nightlights);put(M,'lineman',1,0,2,3,{walk:1});M.O['2,3']=look(TEXT.look.lineman);
 put(M,'curtain',8,0,2,3,{walk:1});M.O['9,3']=look(TEXT.look.window);put(M,'rug',3,5,3,1,{walk:1});
 open(M,5,7);M.warps['5,7']=()=>goTo('kitchen',9,3,'down');return M}
function buildDiner(){const M=room('diner','THE GAP DINER',15,10,'n');
 const open_=!isNight();
 put(M,'counter',3,4,8,1);for(let x=3;x<11;x++)M.O[x+',4']=look(TEXT.look.counter);if(open_)M.O['6,4']=M.O['7,4']=()=>play(TEXT.folk.mae);
 put(M,'piecase',11,4,2,1);M.O['11,4']=M.O['12,4']=look(TEXT.look.pie);put(M,'pass',3,0,6,3,{walk:1});put(M,'coffee',9,3,2,1,{walk:1});
 [[1,4],[1,7],[13,6]].forEach(([x,y])=>{put(M,'dbooth',x,y,1,2,{side:x<7?'l':'r'});M.O[x+','+y]=M.O[x+','+(y+1)]=look(TEXT.look.booth)});
 put(M,'jukebox',13,3);M.O['13,3']=look(TEXT.look.jukebox);put(M,'fan',5,6,1,1,{walk:1});put(M,'tablechairs',3,7,2,1);M.O['3,7']=M.O['4,7']=look(TEXT.look.booth);put(M,'tablechairs',10,7,2,1);
 if(open_)M.npcs=folkOf([{id:'mae',x:6,y:3,dir:'down'},{id:'cecil',x:10,y:6,dir:'up'}]);
 door(M,7,9,'town',13,7,'down');return M}
function buildClinic(){const M=room('clinic','BLUE RIDGE SLEEP CENTER',15,11,'v');
 const p=ph(),who=p===1||p===3?'owen':'rao';
 put(M,'teller',4,4,7,1);for(let x=4;x<11;x++)M.O[x+',4']=look(TEXT.look.desk);M.O['6,4']=M.O['7,4']=M.O['8,4']=()=>play(TEXT.folk[who]);
 put(M,'vault',5,0,5,3,{walk:1});M.O['6,3']=M.O['7,3']=M.O['8,3']=look(TEXT.look.vault);
 put(M,'wchairs',1,6,3,1);M.O['1,6']=M.O['2,6']=M.O['3,6']=look(TEXT.look.chairs);put(M,'wchairs',11,7,3,1);M.O['11,7']=M.O['12,7']=M.O['13,7']=look(TEXT.look.chairs);
 put(M,'clock',13,3);M.O['13,3']=look(TEXT.look.clock);put(M,'plant',1,8);put(M,'plant',13,9);put(M,'fan',4,8,1,1,{walk:1});put(M,'column',4,7);put(M,'column',10,7);put(M,'runner',7,5,1,5,{walk:1});
 const shut=p===3;backDoor(M,2,'lab',5,6,shut?TEXT.labShut:null);backDoor(M,12,'exam',5,6,shut?TEXT.examShut:null);
 const NP=[{id:who,x:7,y:3,dir:'down'}];if(p===2)NP.push({id:'owen',x:9,y:6,dir:'left'});
 M.npcs=folkOf(NP);
 door(M,7,10,'town',5,7,'down');return M}
function buildLab(){const M=room('lab','SLEEP LAB',11,8,'w',{alpha:.7});
 put(M,'labbed',4,3,2,2);M.O['4,3']=M.O['5,3']=look(TEXT.look.labbed);put(M,'monitor',7,3);M.O['7,3']=look(TEXT.look.monitor);
 put(M,'mirror',1,0,3,3,{walk:1});M.O['2,3']=look(TEXT.look.mirror);put(M,'obs',1,4,2,1);M.O['1,4']=M.O['2,4']=look(TEXT.look.obs);put(M,'nightstand',8,3);put(M,'plant',9,6);
 open(M,5,7);M.warps['5,7']=()=>goTo('clinic',2,3,'down');return M}
function buildExam(){const M=room('exam','EXAM ROOM',11,8,'v');
 put(M,'examtable',4,3,2,2);M.O['4,3']=M.O['5,3']=look(TEXT.look.examtable);put(M,'lightbox',6,0,3,3,{walk:1});M.O['7,3']=look(TEXT.look.lightbox);
 put(M,'cabinet',1,3);M.O['1,3']=look(TEXT.look.cabinet);put(M,'stool',7,5,1,1);put(M,'sink2',9,3);put(M,'monitor',8,3);
 open(M,5,7);M.warps['5,7']=()=>goTo('clinic',12,3,'down');return M}

// ---- THE RIDGE ROAD · MILE 31: night 1 only, in fog (48 x 20). The road across the top half, curving up and away at
// the east end; the pull-off, the overlook and its wall below it; the drop past the wall ----
const RIDGE={y0:4,cx:36,cy:-4,r:10};
function buildRidge(){const M=blank('ridge','RIDGE ROAD · MILE 31',48,20,'s','night');M.alpha=.74;M.warm='#ffd9a0';M.fog='light';M.lantern=SHELF.fogReach(false);
 // the uphill side: wooded slope, rocks and thickets, all blocked
 lay(M,0,0,48,4,'S');block(M,0,0,48,4);put(M,'upslope',0,0,48,4,{walk:1});
 // the road (rows 4-7, the shoulders inside them) and its curve up and away past x 36
 lay(M,0,4,37,4,'=');put(M,'ridgeroad',0,4,48,16,{walk:1});
 for(let y=0;y<12;y++)for(let x=36;x<48;x++){const d=Math.hypot(x+.5-RIDGE.cx,y+.5-RIDGE.cy);if(Math.abs(d-RIDGE.r)<1.95&&Math.atan2(y+.5-RIDGE.cy,x+.5-RIDGE.cx)>.25){M.ground[y][x]=M.g[y][x]='='}}
 // the downhill side: guardrail, the pull-off and the overlook, and the drop
 lay(M,0,8,48,12,'S');block(M,0,8,48,12);
 block(M,0,8,17,1);block(M,31,8,6,1);put(M,'guardrail',0,8,17,1,{walk:1,ends:'right'});put(M,'guardrail',31,8,6,1,{walk:1,ends:'left'});
 lay(M,17,8,14,4,'g');lay(M,18,12,12,2,',');put(M,'pulloff',17,8,14,6,{walk:1});
 put(M,'stonewall',17,14,14,1,{walk:1});block(M,17,14,14,1);block(M,17,12,1,2);block(M,30,12,1,2);
 put(M,'drop',0,9,48,11,{walk:1});
 put(M,'viewer',26,13);M.O['26,13']=look(TEXT.look.viewer);
 put(M,'overlooksign',20,12);M.O['20,12']=look(TEXT.look.sign);
 for(let x=19;x<30;x++)if(!M.O[x+',14'])M.O[x+',14']=look(TEXT.look.wall);
 // the hidden hotspot (Item list, Mushrooms): on the wall left of the coin viewer, only while the lead is High (field.js)
 M.O['25,14']={id:'seam',hidden:'mushrooms',name:TEXT.seamName,look:()=>play(TEXT.seamLook),glint:(c,x,y,now)=>LHA.seamGlint(c,x,y,now)};
 // the trail down, at the wall's west end
 open(M,18,13);M.O['18,13']=look(TEXT.trailDown);put(M,'trailhead',18,12,1,1,{walk:1});
 M.warps['18,13']=async()=>{const r=await ask('',TEXT.trailQ,TEXT.trailOpts);if(r===0)await goTo('woods',14,1,'down');else{G.dir='up';await stepBack()}};
 // the trail register (the stand-in dose of Mushrooms, so the hidden hotspot can be tested)
 put(M,'register',29,9);M.O['29,9']={id:'register',name:TEXT.register,look:TEXT.registerLook,opts:[{label:TEXT.registerOpt,once:'register',run:async()=>{await said(TEXT.registerFind);await pickup('shrooms')}}]};
 // mile markers and the curve sign on the uphill shoulder
 put(M,'mile',3,3,1,1,{n:30});M.O['3,4']=look(TEXT.look.marker(30));put(M,'mile',23,3,1,1,{n:31});M.O['23,4']=look(TEXT.look.marker(31));put(M,'curvesign',33,3);M.O['33,4']=look(TEXT.look.curve);
 range(0,17).forEach(x=>M.O[x+',8']=look(TEXT.drop));range(31,37).forEach(x=>M.O[x+',8']=look(TEXT.drop));
 // the team's car at the pull-off
 put(M,'car',20,9,3,1,{tint:'#7a8494'});[20,21,22].forEach(x=>M.O[x+',9']={id:'car',name:'CAR',look:TEXT.car,opts:()=>carOpts(),used:()=>false});
 bounceDir(M,['0,4','0,5','0,6','0,7'],TEXT.roadW,'right');
 for(let x=36;x<48;x++)if(M.g[0][x]==='=')bounceDir(M,[x+',0'],TEXT.roadE,'down');
 return M}

// ---- BELOW THE OVERLOOK: night 1 only, in heavy fog (30 x 22). A switchback trail down a steep wooded slope to a creek.
// Part B's danger zone ----
function buildWoods(){const M=blank('woods','BELOW THE OVERLOOK',30,22,'S','night');M.alpha=.68;M.warm='#ffd9a0';M.fog='heavy';M.lantern=SHELF.fogReach(true);
 block(M,0,0,30,22);put(M,'woodsbase',0,0,30,22,{walk:1});
 // the trail: down from the wall, switching back twice, to the creek bank
 const trail=[[13,0,3,4],[6,3,10,2],[6,5,3,5],[6,9,16,2],[19,11,3,5],[8,15,14,2],[4,15,4,4],[4,18,22,1]];
 trail.forEach(([x,y,w,h])=>lay(M,x,y,w,h,'t'));
 M.blazes=[[12,1],[16,4],[5,4],[9,8],[5,11],[22,10],[18,13],[22,16],[7,16],[3,17],[12,17]];  // white trail blazes on the trees, which catch the lantern
 lay(M,0,19,30,3,'~');put(M,'creek',0,19,30,3,{walk:1});block(M,0,19,30,3);
 // a few side pockets off the trail, where things fell
 lay(M,23,5,4,3,'t');lay(M,22,6,1,1,'t');lay(M,1,12,4,3,'t');lay(M,5,12,1,1,'t');lay(M,24,14,4,3,'t');lay(M,22,15,2,1,'t');
 M.O['25,6']=look(TEXT.look.shoe);put(M,'shoe',25,6,1,1,{walk:1});M.O['2,13']=look(TEXT.look.hubcap);put(M,'hubcap',2,13,1,1,{walk:1});
 put(M,'ledge',24,13,4,1);M.O['25,13']=M.O['26,13']=look(TEXT.look.ledge);
 // dressing: thickets, dogwoods and rocks between the switchbacks
 [[1,1],[4,1],[18,1],[22,1],[26,2],[1,6],[11,6],[15,7],[24,9],[27,11],[1,10],[10,12],[14,13],[1,16],[24,17],[11,17],[28,16]].forEach(([x,y],i)=>{if(M.g[y][x]==='#'){put(M,'thicket',x,y,1,1,{v:i%3,buds:i%4===0});M.O[x+','+(y+1)]=M.O[x+','+(y+1)]||look(TEXT.look.thicket)}});
 [[20,3],[9,7],[16,12],[27,7],[3,8]].forEach(([x,y],i)=>put(M,'blossom',x,y,1,1,{v:i%3,white:1}));
 [[17,4],[12,11],[23,12],[9,16],[19,17]].forEach(([x,y])=>put(M,'rock',x,y));
 range(4,26).forEach(x=>M.O[x+',19']=M.O[x+',19']||look(TEXT.look.creek));
 open(M,14,0);M.warps['14,0']=async()=>{const r=await ask('',TEXT.trailUp,TEXT.trailUpOpts);if(r===0)await goTo('ridge',18,13,'up');else{G.dir='down';await stepBack()}};
 return M}

// ---- THE HIGH PASTURE: night 2 only, the finale area (30 x 18); the boss waits here in part B ----
async function enterField(){const r=await askNotYet(TEXT.gateQ,TEXT.gateIn);if(r===0)await goTo('field',15,16,'up');else{G.dir='up';await stepBack()}}
function buildField(){const M=blank('field','THE HIGH PASTURE',30,18,':','night');M.alpha=.82;M.warm='#ffd9a0';M.fog='light';M.lantern=SHELF.fogReach(false);
 block(M,0,0,30,2);block(M,0,0,1,18);block(M,29,0,1,18);block(M,0,17,30,1);put(M,'pasturebase',0,0,30,18,{walk:1});
 put(M,'barn',2,1,6,4);M.O['5,5']=look(TEXT.look.barn);
 put(M,'trough',21,5,2,1);M.O['21,5']=M.O['22,5']=look(TEXT.look.trough);
 put(M,'burnring',11,6,8,5,{walk:1});M.O['15,8']=look(TEXT.look.ring);
 lay(M,1,13,6,3,';');lay(M,23,12,5,3,';');
 [[25,2],[27,8],[1,8],[3,14],[26,15]].forEach(([x,y],i)=>put(M,'blossom',x,y,1,1,{v:i%3,white:i%2}));[[9,2],[17,2],[12,15],[20,14]].forEach(([x,y])=>put(M,'rock',x,y));
 open(M,15,17);M.warps['15,17']=async()=>{const r=await ask('',TEXT.fieldOut,TEXT.fieldOutOpts);if(r===0)await goTo('town',20,23,'down');else{G.dir='up';await stepBack()}};
 return M}
const MAPS={town:buildTown,kitchen:buildKitchen,bedroom:buildBedroom,diner:buildDiner,clinic:buildClinic,lab:buildLab,exam:buildExam,ridge:buildRidge,woods:buildWoods,field:buildField};

// ================= STAND-IN SCRIPTS =================
// The car: drives between town and the ridge on night 1, and moves the day on with Go on / Not yet (studio-bible/play.md)
function carOpts(){const p=ph(),o=[],D=TEXT.carOpt;
 if(G.map==='town'){if(p===0)o.push({label:D.ridge,run:()=>turn(0)});if(p===1)o.push({label:D.ridge,run:()=>driveTo('ridge')},{label:D.rest,run:()=>turn(1)});if(p===2)o.push({label:D.dark,run:()=>turn(2)})}
 else if(p===1)o.push({label:D.down,run:()=>driveTo('town')},{label:D.rest,run:()=>turn(1)});
 return o}
async function driveTo(where){await fade(1);await say('',TEXT.driveTo[where]);
 if(where==='ridge')goMap('ridge',21,10,'up');else goMap('town',3,15,'down');checkpoint();await fade(0)}
// day 1 → night 1 (up the ridge), night 1 → day 2, day 2 → night 2: each names what closes
async function turn(i){if(ph()!==i)return;
 const r=await askNotYet(TEXT.turnQ[i]+' '+TEXT.turnClose[i],TEXT.turnOpts);if(r!==0)return;
 await fade(1);G.flags.ph=i+1;await play(TEXT.turned[i]);
 if(i===0)goMap('ridge',21,10,'up');else goMap('town',3,15,'down');banner(TEXT.phase[i+1]);checkpoint();await fade(0)}

// ================= OPENING (stand-in briefing in the laundromat off I-81) =================
async function caseOpening(){
 await cut('open',async()=>{await said(TEXT.open1);await said(TEXT.open2)});
 await bigHatScene(async()=>{
  await cut('brief',()=>play(TEXT.brief));
  await twoQuestions(TEXT.intel);
  await cut('brief2',()=>play(TEXT.brief2));
  await requisition();
 },{place:window.LHA.laundromat});
 G.flags.ph=0;G.mode='world';goMap('town',3,15,'down');checkpoint();await fade(0);
 await cut('arrive',()=>said(TEXT.arrive));
}
const caseNext=()=>TEXT.next[ph()]||'';

// ================= ON THE CASE BOARD =================
// Part A has no ending yet: the Dev map menu's Dev: finish case closes it through the real debrief, as a stand-in.
const facts=l=>({label:l,clues:[],saved:0,overstep:(stepsOf()[loadSeason().overstep|0]||'Clean'),san:party.map(m=>({id:m.a.id,name:m.name,from:m.san0,to:m.san})),items:[],choices:{},tried:[],lost:[]});
registerCase({id:'lost-hour',card:caseCard,opening:caseOpening,intel:TEXT.intel,maps:MAPS,tiles:{},
 portraits:name=>window.LHA.portraits[name]||null,items:{},next:caseNext,quiet:true,loot:['roadflare','painkillers','energy','bandage','cigarettes'],
 get place(){return window.LHA&&LHA.laundromat},  // Big Hat's place for this case: the briefing passes it, and the debrief plays there too (engine.js casePlace)
 label:()=>'clean',facts,
 debrief:{clues:[],lines:{clean:[['BIG HAT','Stand-in debrief. The real one comes with the story. Sit.']]},
  stories:[{name:'Sleep apnea',skill:'Medicine',verb:'explain it',pass:[['BIG HAT','Sleep apnea. Good.']]}],weak:{name:'Swamp gas',pass:[]}}});
})();
