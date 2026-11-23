// Black Lantern · cases/dead-air.js
// CASE: Dead Air (FILE 06), Halcott, Louisiana, a sugarcane parish town in early March (spec 020).
// Part A (Nov 23, 2026): the card, every map (Halcott's Main Street and Bayou Street by day and night, the sheriff's
// office, two homes, the church hall set for the fish fry, the feed store, the KHLT station grounds by day and night, its
// broadcast booth and record room, the cane fields and the finale area), the broadcast look, the townsfolk on the map
// and in the dialog box, Big Hat's own briefing place, and stand-in scripts so every map walks and every door and drive
// goes where it should. No clues, fights or story yet: those are part B, written from the secret case file.
// Art is cases/dead-air-art.js (window.DAA), loaded right after this file. Needs engine.js and field.js first.
// The whole file sits in one function so its names never meet another case's (every case loads as a plain script).
(function(){

// ================= TEXT =================
// Every line of the case. A list plays box by box: a plain string is narration, ['WHO', 'line'] is someone talking.
// Part A's lines are stand-ins, kept plain; part B rewrites them from the case file in Keegan's voice.
const TEXT={
 next:['Day 1. Walk Halcott. When you\'re ready, wait in the car for three in the morning.',
  'Night 1. Listen to the show from Miss Odile\'s porch.',
  'Day 2. The station, the tower, and the fish fry at the church hall. The car drives to KHLT.',
  'Night 2. The station, and the cane fields north of the tower.'],
 phase:['DAY 1 · AFTERNOON','NIGHT 1 · 2:50 AM','DAY 2 · FRIDAY','NIGHT 2 · 2:40 AM'],
 // ---- the briefing (stand-in) ----
 open1:'THURSDAY · 11:14 PM · 64°F',
 open2:'A text from an unlisted number: "I-10, EXIT 92. THE BAIT SHOP. AROUND BACK. COME HUNGRY."',
 brief:['The back porch of a bait shop off I-10. A crawfish pot steams on a burner. A radio sits on the rail, unplugged, its cord wrapped tight around it.',
  ['BIG HAT','Agent {code}. Sit. Mind the bait tanks.'],'He\'s on a cooler, peeling a crawfish with one hand.',
  ['BIG HAT','Halcott, Louisiana. A radio station that died in 1979 came back on two weeks ago. Three in the mornin\'.'],
  ['BIG HAT','Stand-in briefin\'. The real one comes with the story.']],
 // Big Hat's four topics (spec 013); their edges come in part B
 intel:[
  {id:'station',label:'The station',answer:['KHLT. Off the air since \'79. Tower never came down.','Now it comes on at three in the mornin\', and it\'s got callers.'],note:'KHLT 1340 AM, off the air since 1979, broadcasts again at 3 AM.'},
  {id:'missing',label:'The missing',answer:['Two named on the air. Two gone.','Their families\'ll talk to a badge.'],note:'Two people named on the show have gone missing.'},
  {id:'sheriff',label:'The sheriff',answer:['Dutch Fontenot. Called it in himself, which sheriffs don\'t.','He\'ll help while the town stays calm.'],note:'Sheriff Dutch Fontenot asked for help himself.'},
  {id:'town',label:'The town',answer:['Two thousand people, and every one of \'em owns a radio.','They\'re scared, and lookin\' for somebody to be scared of.'],note:'Halcott is scared and looking for someone to blame.'}],
 brief2:[['BIG HAT','You go in with badges. Federal radio inspectors. Nobody knows what that is, so nobody argues.'],['BIG HAT','Be smart, be careful, don\'t get burned.']],
 arrive:'DEAD AIR (stand-in). Walk Halcott with A. Wait in the car for 3 AM to move on to night. START for your notebook.',
 // ---- doors, the car and the days ----
 shut:'Locked. Nobody answers.',
 shutNight:'Dark inside. Locked for the night.',
 hallShut:'The church hall. A sign on the door: FISH FRY FRIDAY 5 PM · ALL WELCOME. Locked till then.',
 houseShut:'Somebody\'s home. The TV\'s on, the radio isn\'t. They don\'t come to the door.',
 hwy:'The road out to the interstate. Not yet.',
 bayou:'The bayou. Still and brown, a turtle on a log.',
 stationShut:'The station\'s back door. Not tonight, it isn\'t going anywhere.',
 rowsDay:'Cane in rows to the horizon. The fields wait for dark.',
 fieldRoad:'The field road, back to the station.',
 car:'The car. A government sedan, and it looks it.',carQ:'Where to?',
 carOpt:{khlt:'Drive out to KHLT',town:'Drive back to Halcott',wait:'Wait for 3 AM',sleep:'Call it a night'},
 driveTo:{khlt:'Four miles out the field road, cane on both sides. The tower comes up over it.',town:'Back into Halcott.'},
 turnOpts:['Go on','Not yet'],
 wait1Q:'Wait in the car for three in the morning?',wait1Close:'The shops and the sheriff\'s office close for the night.',
 wait1:['The shops close. The streetlights come on. Porch lights, one by one, all down Bayou Street.','At a quarter to three, the radios start to hum.'],
 sleepQ:'Call it a night?',sleepClose:'Night 1 ends. The show won\'t come on again till tomorrow night.',
 sleep:['You sleep in the car, badly.','Friday comes up grey and warm. Somebody\'s already frying something.'],
 wait2Q:'Wait for three in the morning out at the station?',wait2Close:'The fish fry ends, and the tower by daylight is gone for good.',
 wait2:['The fish fry winds down. The church hall\'s lights go off.','Out at KHLT the tower\'s red light blinks over the cane. The radios start to hum.'],
 // ---- the broadcast (stand-in): the porch radio, night 1 ----
 radioName:'THE PORCH RADIO',radioLook:'An old tabletop radio on Miss Odile\'s porch, its dial glowing amber. The needle sits on 1340.',
 radioDay:'An old tabletop radio on Miss Odile\'s porch. Unplugged.',
 radioOpt:'Listen',
 show:['3:00 AM. The hum goes quiet. Then a click, and a room, and someone breathing close to a microphone.',
  ['THE HOST','Good mornin\', Halcott. You\'re on the Night Line.'],
  ['THE HOST','(Stand-in: the host\'s lines come in part B.)'],
  ['CALLER','(Stand-in: a caller, and the names, come in part B.)'],
  '3:33 AM. Three seconds of breathing, and the carrier drops to hiss.'],
 // ---- KHLT and the fields ----
 sign:'A dead sign on the roof: KHLT 1340. Half the letters are gone.',
 towerLook:'The tower. Red and white, a hundred and ninety feet, guy wires humming. Its red light blinks.',
 towerFence:'A chain-link fence around the tower\'s foot. DANGER · HIGH VOLTAGE, on a sign older than you.',
 shed:'The transmitter shed. Padlocked.',
 caneIn:'The rows go north toward a clearing. The tower\'s light blinks behind you.',
 edgeQ:'The cane opens on a bare circle of dirt. Something is standing in the middle of it.',
 gateIn:['Go in','Not yet'],
 outQ:'Back into the cane?',outOpts:['Back','Stay'],
 // ---- the hidden hotspot: only there while the lead is High on Mushrooms (stand-in result) ----
 micName:'THE GUEST MIC',micLook:['The guest mic\'s foam is wet. It breathes, slow, like someone asleep with their mouth near it.','(Stand-in: what it means comes in part B.)'],
 cooler:'THE BAIT COOLER',coolerLook:'A bait cooler humming by the back door. Night crawlers, crickets, a carton of something else.',coolerOpt:'Dig through it',
 coolerFind:'Behind the crickets, a paper sack of dried mushrooms, folded over twice. Somebody\'s written SWAMP CANDY on it.',
 // ---- people (stand-ins) ----
 folk:{
  sheriff:[['SHERIFF','Dutch Fontenot. I called you. I didn\'t think anybody\'d come.'],['SHERIFF','Keep this quiet and I\'ll keep the town off your back.']],
  deputy:[['DEPUTY','Renée Theriot.'],'Her scanner crackles on her belt.',['DEPUTY','I keep it on 1340. Just in case. You think that\'s crazy?']],
  joelle:[['JOELLE','Joelle. Darlene\'s my mother.'],['JOELLE','Two weeks. And this town wants to talk about radios.']],
  marcy:[['MARCY','Marcy Hebert. Wade\'s my husband.'],['MARCY','I heard his name. I turned it up. I turned it up.']],
  lucien:[['MR. ARCENEAUX','Arceneaux Feed and Seed, since 1951.'],['MR. ARCENEAUX','I don\'t have a radio in here. Never did.']],
  pastor:[['PASTOR','Ellis Batiste. Good Shepherd.'],'He fans himself with a church fan.',['PASTOR','Fish fry Friday. Come hungry. Come anyway.']],
  lou:[['MAMA LOU','Catfish is a dollar a piece, baby. Federal or not.'],'She stirs the oil. A cigarette behind each ear, never lit.'],
  toby:[['TOBY','We\'re open. I mean, it says open.'],['TOBY','I don\'t listen to it. That radio\'s just for company.']],
  odile:[['MISS ODILE','You\'re the radio people.'],'The nutria on her leash looks up at you.',['MISS ODILE','Chou-Chou don\'t bite. Most days.']],
  remy:[['REMY','Remy. Bait shop\'s mine.'],'Something moves in his shirt pocket. A crawfish.',['REMY','You need a boat, I got a boat. You need the field road, I know the field road.']],
  darlene:'A woman stands in the dirt with a transistor radio to her ear. She doesn\'t look at you.',
  wade:'A man in work boots stands in the dirt with a radio to his ear. His lips move with something you can\'t hear.',
  crowd:'Busy with a plate of catfish. They nod at you and don\'t stop eating.',
  night:'They\'re asleep on the porch swing. Best let them be.'
 },
 // ---- looks around the maps (part B gives them skills and clues) ----
 look:{
  gasgo:'GAS-N-GO. BOUDIN · COLD BEER · LIVE BAIT. A hand-lettered sign: RADIO STAYS ON.',
  pump:'One pump, no brand left on it. $3.89 a gallon in rolling numbers.',
  sheriffSign:'ST. ODILE PARISH SHERIFF · HALCOTT SUBSTATION.',
  feedSign:'ARCENEAUX FEED & SEED · SINCE 1951.',
  baitSign:'GUIDRY\'S BAIT · LIVE CRAWFISH · ICE.',
  hallSign:'GOOD SHEPHERD CHURCH HALL. FISH FRY FRIDAY.',
  oak:'A live oak older than the town, Spanish moss hanging to the grass.',
  pot:'An iron pot of oil over a gas ring. Mama Lou\'s.',
  picnic:'A picnic table under butcher paper, weighed down with hot sauce.',
  porch:'Miss Odile\'s porch. Every radio she owns is out here, all of them playing static.',
  carParked:'A pickup, rust over red, a dog bed in the back.',
  mailbox:'A mailbox on a post. The flag\'s up.',
  counterS:'The front counter. A bell, a clipboard, a jar of peppermints.',
  board:'The missing-persons board. Two photos, a map, a lot of pins.',
  radios:'A shelf of radios, tagged and bagged. CONFISCATED, on the shelf in tape.',
  cell:'The holding cell. Empty, and the door open.',
  coffee:'A coffee maker on its third pot.',
  achordRadio:'A radio on the kitchen table, unplugged. A note under it in a careful hand: TURN IT OFF.',
  photos:'Family photos up the wall. A wedding, a graduation, a baby in a christening gown.',
  shelfGap:'A shelf of knickknacks with a clean square in the dust where something used to sit.',
  drawings:'Kids\' drawings on the fridge. A house, a dog, a man with a fishing pole.',
  tables:'Long tables under butcher paper, set for a hundred. Hot sauce every three feet.',
  serving:'The serving line. Catfish, potato salad, white bread, sweet tea.',
  stage:'A little stage with an old PA and a hand-lettered banner: GOOD SHEPHERD FISH FRY.',
  sacks:'Feed sacks to the ceiling. LAYER PELLETS, SWEET FEED, CRACKED CORN.',
  seeds:'A rack of seed packets. Okra, purple hull peas, Creole tomatoes.',
  safe:'An old safe in the back, painted green, taller than you. Locked.',
  counterF:'The feed store counter. A cash register older than the building.',
  stationDoor:'The station\'s front door, steel, a sticker that says ON AIR · DO NOT ENTER.',
  boardB:'The broadcast board. Faders, knobs, two VU meters, all dead. Or they should be.',
  mic:'The host\'s mic on its arm, a foam cover gone hard with age.',
  carts:'Cart machines, three in a row, and a rack of tape cartridges with handwritten labels.',
  onair:'The ON AIR light over the door. Dark.',
  turntable:'Two turntables, a record still on one.',
  window:'A window into the transmitter room. Glass tubes the size of your arm, cold and dark.',
  shelves:'Records floor to ceiling, and carts in boxes, and boxes of logs.',
  cabinet:'A file cabinet. PROGRAM LOGS 1970–1979.',
  radial:'A copper wire comes up out of the dirt and goes back in, like a root.',
  boat:'A flat-bottom boat on a trailer. GUIDRY\'S BAIT on the side, in house paint.',
  traps:'Crawfish traps stacked by the curb, still dripping.',
  ditch:'A drainage ditch, black water, frogs going quiet as you pass.',
  tall:'A stand of old cane nobody cut. Taller than you.'
 }
};
const fill=(t,o)=>String(t).replace(/\{(n|m|v)\}/g,(x,k)=>o[k]??x);
async function play(seq,o={}){for(const l of [].concat(seq)){if(Array.isArray(l))await say(l[0],fill(l[1],o));else await say('',fill(l,o))}}
const said=(l,o)=>play([l],o);
// A point of no return (studio-bible/play.md): the cursor starts on Not yet, so mashing A can't take it.
async function askNotYet(text,opts){await say('',text,{keep:true,instant:false});const r=await choose(opts,{cancel:true,inBox:true,sel:opts.length-1});hideTB();return r<0?opts.length-1:r}

// The case board card (spec 020, The card). The call letters are made up (checked Nov 23, 2026).
const caseCard={file:6,title:'DEAD AIR',town:'HALCOTT',place:'KHLT 1340 AM · HALCOTT, LA',
 hook:['A dead station is back at 3 AM.','Its callers know who\'s next.'],pin:'#ff4a3d'};

// ================= THE DAYS =================
// G.flags.ph: 0 day 1, 1 night 1 (the first broadcast), 2 day 2 (Friday, the fish fry), 3 night 2 (spec 020, Day and
// night). Each turn waits for Go on / Not yet naming what closes (Turning the day); part A's stand-ins are the car and
// the porch radio.
const ph=()=>G.flags.ph|0;
const isNight=()=>ph()===1||ph()===3;
const light=()=>isNight()?'night':'day';

// ================= MAPS =================
// Every map is drawn by cases/dead-air-art.js from M.ground, M.pieces and M.light, like Lot 83. M.g is what blocks.
// Ground letters (none in engine.js's BLOCK set): ',' sidewalk, '=' road, '.' grass, 'd' dirt road, 'g' gravel, 'a' bayou
// water, 'u' young cane, 's' cane stubble, 'e' bare dirt, 'n' linoleum, 'c' carpet, 'w' wood floor, 'v' tile, 'o' concrete.
function blank(id,name,W,H,fillCh,lt){const ground=mk(W,H,fillCh),g=mk(W,H,fillCh);
 return{id,name,w:W,h:H,ground,g,pieces:[],O:{},npcs:[],warps:{},light:lt||light(),ph:ph(),art:window.DAA,lines:[]}}
const lay=(M,x,y,w,h,c)=>{rect(M.ground,x,y,w,h,c);rect(M.g,x,y,w,h,c)};
const block=(M,x,y,w=1,h=1)=>rect(M.g,x,y,w,h,'#');
const open=(M,x,y)=>{M.g[y][x]=M.ground[y][x]};
function put(M,k,x,y,w=1,h=1,o={}){const p=Object.assign({k,x,y,w,h},o);M.pieces.push(p);if(!o.walk)block(M,x,y,w,h);return p}
const look=t=>({look:t});
const lookAll=(M,keys,t)=>keys.forEach(k=>M.O[k]=look(t));
const row=(x,y,w)=>Array.from({length:w},(_,i)=>(x+i)+','+y);
const folkOf=list=>list.map(n=>Object.assign(n,{talk:()=>play(TEXT.folk[n.talkAs||n.id])}));
const door=(M,x,y,to,tx,ty,dir='down')=>{open(M,x,y);M.warps[x+','+y]=()=>goTo(to,tx,ty,dir)};
async function goTo(to,x,y,dir){await fade(1);goMap(to,x,y,dir);checkpoint();await fade(0)}
const bounceDir=(M,keys,text,dir)=>keys.forEach(k=>M.warps[k]=async()=>{await said(text);G.dir=dir;await stepBack()});
// a door that only opens by day (night: locked) or only on day 2 (the hall)
const dayDoor=(M,x,y,to,tx,ty,shutText)=>{if(isNight())M.O[x+','+y]=look(shutText||TEXT.shutNight);else door(M,x,y,to,tx,ty,'up')};

// ---- HALCOTT: Main Street across the top, Bayou Street's raised houses below it, the bayou along the bottom (44 x 30) ----
// Main Street's north side (rows 0-4, doors in row 4): the church hall, the sheriff's office, the feed store, the bait
// shop. The road is rows 6-8. South of it: the church yard (the fish fry pot on day 2), the big live oak, the Gas-N-Go.
// A dirt cross street (x 32-33) runs down to Bayou Street (rows 18-19); the houses' doors are in row 17.
const HOUSES=[{id:'achord',x:2,w:6,door:4,col:'#d8cdb0',roof:'#4a3a46'},{id:'hebert',x:10,w:6,door:13,col:'#8aa4ac',roof:'#2e3a4a',shut:'#3a5a4a'},
 {id:'n1',x:18,w:5,door:20,col:'#c8a890',roof:'#3a2e2a'},{id:'odile',x:24,w:7,door:26,col:'#b8c8a8',roof:'#4a3a2e',porch:1}];
const STORES=[{k:'hall',x:1,w:9,door:5,to:'hall'},{k:'sheriffs',x:11,w:6,door:13,to:'sheriff'},{k:'feedst',x:18,w:7,door:21,to:'feed'},{k:'baitst',x:26,w:5,door:28}];
function buildHalcott(){
 const N=isNight(),M=blank('halcott','HALCOTT',44,30,'.');M.alpha=.88;M.warm='#ffcf80';
 // Main Street
 block(M,0,0,44,5);lay(M,0,5,44,1,',');lay(M,0,6,44,3,'=');lay(M,0,9,32,1,',');lay(M,34,9,10,1,',');
 for(const s of STORES){put(M,s.k,s.x,0,s.w,5,{walk:1,door:s.door});
  if(s.to==='hall'){if(ph()===2)door(M,s.door,4,'hall',8,9,'up');else{open(M,s.door,4);M.warps[s.door+',4']=async()=>{await said(TEXT.hallShut);G.dir='down';await stepBack()}}}
  else if(s.to){if(N){open(M,s.door,4);M.warps[s.door+',4']=async()=>{await said(TEXT.shutNight);G.dir='down';await stepBack()}}else door(M,s.door,4,s.to,s.to==='sheriff'?7:6,s.to==='sheriff'?8:7,'up')}
  else M.O[s.door+',4']=look(TEXT.look.baitSign)}
 M.O['3,4']=look(TEXT.look.hallSign);M.O['15,4']=look(TEXT.look.sheriffSign);M.O['23,4']=look(TEXT.look.feedSign);
 put(M,'lot',35,0,9,5,{walk:1});lay(M,35,4,9,1,'.');open(M,36,4);
 put(M,'oakbig',38,3,3,1);M.O['38,3']=M.O['39,3']=M.O['40,3']=look(TEXT.look.oak);
 bounceDir(M,['0,6','0,7','0,8'],TEXT.hwy,'right');bounceDir(M,['43,6','43,7','43,8'],TEXT.hwy,'left');
 // street lights along Main Street, the team's car at the curb
 [[10,5],[25,5],[2,9],[19,9],[36,9]].forEach(([x,y])=>put(M,'lamp',x,y));
 put(M,'car',22,8,3,1,{tint:'#3a3e48'});[22,23,24].forEach(x=>M.O[x+',8']={id:'car',name:'CAR',look:TEXT.car,opts:()=>carOpts()});
 put(M,'truck',6,8,3,1,{tint:'#8a3a2e'});[6,7,8].forEach(x=>M.O[x+',8']=look(TEXT.look.carParked));
 // the church yard: the fish fry pot and tables on day 2
 lay(M,1,10,9,3,'d');
 if(ph()===2){put(M,'pot',5,11);M.O['5,11']=look(TEXT.look.pot);put(M,'picnic',2,12,2,1);put(M,'picnic',7,12,2,1);M.O['2,12']=M.O['3,12']=M.O['7,12']=M.O['8,12']=look(TEXT.look.picnic)}
 else{put(M,'picnic',2,12,2,1);M.O['2,12']=M.O['3,12']=look(TEXT.look.picnic)}
 // the big live oak on the green, and the Gas-N-Go at the east end
 put(M,'oakbig',18,12,3,1);lookAll(M,['18,12','19,12','20,12'],TEXT.look.oak);
 lay(M,34,10,10,7,'g');put(M,'gasgo',36,10,7,3,{door:39});M.O['39,12']=look(TEXT.look.gasgo);
 put(M,'pump',38,14);put(M,'pump',41,14);M.O['38,14']=M.O['41,14']=look(TEXT.look.pump);put(M,'polesign',35,10);M.O['35,10']=look(TEXT.look.gasgo);
 // the cross street down to Bayou Street
 lay(M,32,9,2,11,'d');
 // Bayou Street: raised houses on piers (rows 13-17), the street (rows 18-19), yards, the bayou
 lay(M,0,18,34,2,'d');
 for(const h of HOUSES){put(M,'house',h.x,13,h.w,5,Object.assign({walk:1},h));block(M,h.x,13,h.w,5);
  if(h.id==='achord'||h.id==='hebert')dayDoor(M,h.door,17,h.id,5,6,TEXT.shutNight);
  else if(h.id==='odile')M.O[h.door+',17']=look(TEXT.look.porch);
  else M.O[h.door+',17']=look(TEXT.houseShut)}
 // Miss Odile's porch radio: the night-1 broadcast (stand-in)
 put(M,'porchradio',29,17,1,1,{on:N});M.O['29,17']={id:'radio',name:TEXT.radioName,look:()=>N?TEXT.radioLook:TEXT.radioDay,opts:()=>radioOpts()};
 [[1,20],[8,20],[16,20],[23,20]].forEach(([x,y])=>{put(M,'mailbox',x,y);M.O[x+','+y]=look(TEXT.look.mailbox)});
 put(M,'oaksmall',11,22,2,1);put(M,'cypress',4,24);put(M,'cypress',27,24);put(M,'cypress',38,23);put(M,'shed',20,21,3,2);
 put(M,'lamp',30,20);put(M,'lamp',8,17);
 [[10,11],[15,12],[26,11],[30,12],[2,22],[24,23],[14,24],[35,18],[42,21],[17,24],[31,24],[8,23]].forEach(([x,y])=>put(M,'palmetto',x,y));
 put(M,'boat',36,20,4,1);lookAll(M,row(36,20,4),TEXT.look.boat);put(M,'traps',30,10,2,1);lookAll(M,['30,10','31,10'],TEXT.look.traps);
 put(M,'oaksmall',40,24,2,1);put(M,'flowers',12,10,2,1,{walk:1});put(M,'flowers',22,11,3,1,{walk:1});put(M,'flowers',28,21,3,1,{walk:1});put(M,'flowers',4,21,2,1,{walk:1});
 // the bayou along the bottom
 lay(M,0,26,44,4,'a');block(M,0,26,44,4);put(M,'bank',0,26,44,1,{walk:1,knees:[6,15,29,36]});lookAll(M,row(0,25,44),TEXT.bayou);
 lay(M,34,17,10,9,'.');
 // people, by the day (night: only Toby at the Gas-N-Go and Miss Odile on her porch are up)
 const NP=[];
 if(ph()===0)NP.push({id:'deputy',x:14,y:5,dir:'down'},{id:'pastor',x:6,y:5,dir:'down'},{id:'remy',x:29,y:5,dir:'down'},{id:'odile',x:28,y:18,dir:'down'},{id:'toby',x:40,y:13,dir:'down'});
 else if(ph()===2)NP.push({id:'lou',x:6,y:11,dir:'down'},{id:'pastor',x:4,y:10,dir:'right'},{id:'remy',x:29,y:5,dir:'down'},{id:'deputy',x:16,y:9,dir:'down'},{id:'odile',x:28,y:18,dir:'down'},
  {id:'f1',x:1,y:11,dir:'right',talkAs:'crowd'},{id:'f2',x:9,y:11,dir:'left',talkAs:'crowd'});
 else NP.push({id:'odile',x:27,y:18,dir:'down'},{id:'toby',x:40,y:13,dir:'down'});
 M.npcs=folkOf(NP);
 return M}

// ---- interiors: the back wall three tiles tall, the door in the bottom wall ----
function room(id,name,W,H,floor,o={}){const M=blank(id,name,W,H,floor);M.alpha=o.alpha||.86;M.warm='#ffcf80';
 block(M,0,0,W,3);block(M,0,0,1,H);block(M,W-1,0,1,H);block(M,0,H-1,W,1);put(M,'room',0,0,W,H,{walk:1,floor});return M}
function buildSheriff(){const M=room('sheriff','SHERIFF\'S OFFICE',15,10,'n');
 put(M,'counter',2,5,6,1);lookAll(M,['2,5','3,5','4,5','5,5','6,5','7,5'],TEXT.look.counterS);
 put(M,'desk',9,4,1,1);put(M,'desk',12,4,1,1);put(M,'board',3,0,4,3,{walk:1});lookAll(M,['3,3','4,3','5,3','6,3'],TEXT.look.board);
 put(M,'radioshelf',9,0,3,3,{walk:1});lookAll(M,['9,3','10,3','11,3'],TEXT.look.radios);
 put(M,'cell',12,6,2,2);lookAll(M,['12,6','13,6','12,7','13,7'],TEXT.look.cell);put(M,'coffee',1,3);M.O['1,3']=look(TEXT.look.coffee);put(M,'plant',13,3);put(M,'chairs',2,8,2,1);
 M.npcs=folkOf([{id:'sheriff',x:10,y:5,dir:'down'}]);
 door(M,7,9,'halcott',13,5,'down');return M}
function buildAchord(){const M=room('achord','ACHORD HOUSE',12,8,'w');
 put(M,'kitchentable',2,4,3,1);M.O['2,4']=M.O['3,4']=M.O['4,4']=look(TEXT.look.achordRadio);put(M,'photos',6,0,4,3,{walk:1});lookAll(M,['6,3','7,3','8,3','9,3'],TEXT.look.photos);
 put(M,'sofa',7,5,3,1);put(M,'lampstand',10,4);put(M,'rug',4,6,3,1,{walk:1});
 M.npcs=folkOf([{id:'joelle',x:5,y:5,dir:'down'}]);
 door(M,5,7,'halcott',4,18,'down');return M}
function buildHebert(){const M=room('hebert','HEBERT HOUSE',12,8,'c');
 put(M,'knick',2,0,3,3,{walk:1});lookAll(M,['2,3','3,3','4,3'],TEXT.look.shelfGap);put(M,'fridge',8,3);M.O['8,3']=look(TEXT.look.drawings);
 put(M,'recliner',3,5);put(M,'tv',6,3);put(M,'toys',9,6,2,1,{walk:1});
 M.npcs=folkOf([{id:'marcy',x:6,y:5,dir:'left'}]);
 door(M,5,7,'halcott',13,18,'down');return M}
function buildHall(){const M=room('hall','CHURCH HALL',17,11,'v',{alpha:.8});
 put(M,'stage',5,0,7,3,{walk:1});lookAll(M,['6,3','7,3','8,3','9,3','10,3'],TEXT.look.stage);
 put(M,'serving',1,4,4,1);lookAll(M,['1,4','2,4','3,4','4,4'],TEXT.look.serving);
 for(const[x,y]of[[6,5],[11,5],[6,7],[11,7]]){put(M,'longtable',x,y,4,1);lookAll(M,row(x,y,4),TEXT.look.tables)}
 M.npcs=folkOf([{id:'pastor',x:8,y:4,dir:'down'},{id:'lou',x:2,y:5,dir:'down'},{id:'f3',x:7,y:6,dir:'up',talkAs:'crowd'},{id:'f4',x:13,y:6,dir:'up',talkAs:'crowd'},
  {id:'f5',x:9,y:8,dir:'up',talkAs:'crowd'},{id:'f1',x:12,y:8,dir:'up',talkAs:'crowd'},{id:'f2',x:15,y:5,dir:'left',talkAs:'crowd'}]);
 door(M,8,10,'halcott',5,5,'down');return M}
function buildFeed(){const M=room('feed','ARCENEAUX FEED & SEED',14,9,'o');
 put(M,'sacks',1,0,5,3,{walk:1});lookAll(M,['1,3','2,3','3,3','4,3','5,3'],TEXT.look.sacks);put(M,'sackpile',1,5,2,1);M.O['1,5']=M.O['2,5']=look(TEXT.look.sacks);
 put(M,'seedrack',7,3,2,1);M.O['7,3']=M.O['8,3']=look(TEXT.look.seeds);put(M,'safe',12,3);M.O['12,3']=look(TEXT.look.safe);
 put(M,'counter',5,6,4,1);lookAll(M,['5,6','6,6','8,6'],TEXT.look.counterF);
 put(M,'baitcooler',10,3,2,1);
 M.O['10,3']=M.O['11,3']={id:'cooler',name:TEXT.cooler,look:TEXT.coolerLook,opts:[{label:TEXT.coolerOpt,once:'cooler',run:async()=>{await said(TEXT.coolerFind);await pickup('shrooms')}}]};
 M.npcs=folkOf([{id:'lucien',x:7,y:5,dir:'down'}]);
 door(M,6,8,'halcott',21,5,'down');return M}

// ---- KHLT 1340: the station, its gravel lot, the tower in a clearing, cane all around (36 x 26) ----
function buildKhlt(){const N=isNight(),M=blank('khlt','KHLT 1340',36,26,'u');M.alpha=.8;M.warm='#ffcf80';
 // the station: cinder block, rows 1-6, the front door at (9, 6)
 block(M,3,0,13,7);put(M,'station',3,2,13,5,{walk:1,door:9});
 if(N||ph()===2)door(M,9,6,'booth',6,6,'up');else{open(M,9,6);M.O['9,6']=look(TEXT.look.stationDoor)}
 M.O['5,6']=look(TEXT.sign);
 lay(M,2,7,16,6,'g');lay(M,8,13,3,13,'d');lay(M,3,0,13,1,'s');
 put(M,'car',3,10,3,1,{tint:'#3a3e48'});[3,4,5].forEach(x=>M.O[x+',10']={id:'car',name:'CAR',look:TEXT.car,opts:()=>carOpts()});
 put(M,'lamp',15,7);put(M,'lamp',29,11);put(M,'barrel',2,8);put(M,'pole',16,11);
 // the tower in its clearing: the fence around its foot, the guy-wire anchors, the transmitter shed
 lay(M,20,3,13,11,'e');put(M,'towerfence',23,6,6,5,{walk:1,gate:25});block(M,23,6,6,1);block(M,23,6,1,5);block(M,28,6,1,5);block(M,23,10,6,1);open(M,25,10);
 put(M,'tower',25,8,1,1);M.O['25,9']=look(TEXT.towerLook);M.O['24,7']=M.O['27,7']=look(TEXT.towerFence);
 [[21,4],[31,4],[21,12],[31,12]].forEach(([x,y])=>put(M,'anchor',x,y));put(M,'shed',30,8,3,2);lookAll(M,['30,9','31,9','32,9'],TEXT.shed);
 // cane on every side, stubble along the road, a stand of tall cane, the path north into the fields
 lay(M,17,14,19,12,'s');lay(M,0,14,8,12,'s');
 [[0,2,2],[33,0,3],[18,0,2],[0,22,3],[30,18,3]].forEach(([x,y,w])=>{put(M,'tallcane',x,y,w,1);lookAll(M,row(x,y,w),TEXT.look.tall)});
 lay(M,26,0,1,3,'d');
 if(N)M.warps['26,0']=()=>goTo('cane',20,28,'up');else bounceDir(M,['26,0'],TEXT.rowsDay,'down');
 bounceDir(M,['8,25','9,25','10,25'],TEXT.hwy,'up');
 return M}
function buildBooth(){const M=room('booth','KHLT · BROADCAST BOOTH',13,8,'c',{alpha:.82});
 put(M,'console',2,3,7,1);lookAll(M,['2,3','3,3','4,3','5,3','7,3'],TEXT.look.boardB);M.O['6,3']=look(TEXT.look.mic);
 put(M,'carts',9,3,2,1);M.O['9,3']=M.O['10,3']=look(TEXT.look.carts);put(M,'onair',5,0,2,1,{walk:1});M.O['5,2']=look(TEXT.look.onair);
 put(M,'txwindow',8,0,3,2,{walk:1});lookAll(M,['8,2','9,2','10,2'],TEXT.look.window);put(M,'turntable',1,5,2,1);M.O['1,5']=M.O['2,5']=look(TEXT.look.turntable);
 // The hidden hotspot (Item list, Mushrooms): the guest mic at the board's right end, only while the lead is High (field.js)
 M.O['8,3']={id:'guestmic',hidden:'mushrooms',name:TEXT.micName,look:()=>play(TEXT.micLook),glint:(c,x,y,now)=>DAA.micGlint(c,x,y,now)};
 // the record room through the side door
 open(M,12,5);M.warps['12,5']=()=>goTo('records',1,5,'right');
 door(M,6,7,'khlt',9,7,'down');return M}
function buildRecords(){const M=room('records','KHLT · RECORD ROOM',10,8,'o',{alpha:.8});
 put(M,'records',1,0,8,3,{walk:1});lookAll(M,row(1,3,8),TEXT.look.shelves);put(M,'recrack',4,5,3,1);lookAll(M,row(4,5,3),TEXT.look.shelves);
 put(M,'cabinet',8,3);M.O['8,3']=look(TEXT.look.cabinet);put(M,'boxes',1,6,1,1,{v:2});put(M,'boxes',8,6,1,1,{v:1});put(M,'bulb',5,0,1,1,{walk:1});
 open(M,0,5);M.warps['0,5']=()=>goTo('booth',11,5,'left');return M}

// ---- THE CANE FIELDS: night 2 only, the danger zone (40 x 30); part B walks its roamers here ----
function buildCane(){const M=blank('cane','THE CANE FIELDS',40,30,'u','night');M.alpha=.76;M.warm='#ffcf80';
 // the field road up the middle, a drainage ditch across, stands of tall cane, the clearing's edge at the top
 lay(M,19,0,3,30,'d');lay(M,0,15,40,1,'a');block(M,0,15,19,1);block(M,22,15,18,1);put(M,'ditch',0,15,40,1,{walk:1,bridge:[19,22]});lookAll(M,row(0,14,19).concat(row(22,14,18)),TEXT.look.ditch);
 put(M,'culvert',19,15,3,1,{walk:1});
 [[3,3,3],[11,6,2],[27,4,3],[34,9,2],[6,20,3],[13,24,2],[26,21,3],[33,26,3],[1,11,2],[30,12,2]].forEach(([x,y,w])=>{put(M,'tallcane',x,y,w,1);lookAll(M,row(x,y,w),TEXT.look.tall)});
 put(M,'pumpshed',35,17,3,2);put(M,'scarepole',8,9);
 lay(M,19,0,3,1,'e');
 M.warps['20,0']=M.warps['19,0']=M.warps['21,0']=enterRadials;
 lay(M,19,29,3,1,'d');M.warps['19,29']=M.warps['20,29']=M.warps['21,29']=()=>goTo('khlt',26,1,'down');
 return M}
// ---- THE RADIAL FIELD: night 2, the finale area (22 x 21); the boss waits here in part B ----
async function enterRadials(){const r=await askNotYet(TEXT.edgeQ,TEXT.gateIn);if(r===0)await goTo('radials',11,18,'up');else{G.dir='down';await stepBack()}}
function buildRadials(){const M=blank('radials','THE RADIAL FIELD',22,21,'u','night');M.alpha=.74;M.warm='#ffcf80';
 put(M,'circle',2,1,18,14,{walk:1});
 for(let y=1;y<15;y++)for(let x=2;x<20;x++){const dx=(x+.5-11)/8.5,dy=(y+.5-8)/6.5;if(dx*dx+dy*dy<1)lay(M,x,y,1,1,'e')}
 lay(M,10,14,3,7,'d');
 [[5,4],[16,4],[4,11],[17,11],[11,2]].forEach(([x,y])=>M.O[x+','+y]=look(TEXT.look.radial));
 [[0,0,2],[20,0,2],[0,14,2],[20,14,2],[3,18,3],[16,18,3]].forEach(([x,y,w])=>put(M,'tallcane',x,y,w,1));
 put(M,'radioglow',9,7,1,1,{walk:1});put(M,'radioglow',13,7,1,1,{walk:1});
 M.npcs=folkOf([{id:'darlene',x:9,y:7,dir:'up'},{id:'wade',x:13,y:7,dir:'up'}]);
 M.warps['11,20']=M.warps['10,20']=M.warps['12,20']=async()=>{const r=await ask('',TEXT.outQ,TEXT.outOpts);if(r===0)await goTo('cane',20,1,'down');else{G.dir='up';await stepBack()}};
 return M}
const MAPS={halcott:buildHalcott,sheriff:buildSheriff,achord:buildAchord,hebert:buildHebert,hall:buildHall,feed:buildFeed,khlt:buildKhlt,booth:buildBooth,records:buildRecords,cane:buildCane,radials:buildRadials};

// ================= STAND-IN SCRIPTS =================
function carOpts(){const o=[],p=ph();
 if(G.map==='halcott'){if(p>=2)o.push({label:TEXT.carOpt.khlt,run:()=>driveTo('khlt')})}
 else o.push({label:TEXT.carOpt.town,run:()=>driveTo('halcott')});
 if(p===0)o.push({label:TEXT.carOpt.wait,run:waitNight1});
 if(p===1&&G.flags.heard)o.push({label:TEXT.carOpt.sleep,run:sleepDay2});
 if(p===2)o.push({label:TEXT.carOpt.wait,run:waitNight2});
 return o}
async function driveTo(where){await fade(1);await say('',TEXT.driveTo[where==='khlt'?'khlt':'town']);
 if(where==='khlt')goMap('khlt',4,11,'up');else goMap('halcott',23,7,'down');checkpoint();await fade(0)}
// the stand-ins for the story's turns of the day, with Go on / Not yet and what closes (studio-bible/play.md)
async function turn(q,close,lines,p,map,x,y,dir){const r=await askNotYet(q+' '+close,TEXT.turnOpts);if(r!==0)return false;
 await fade(1);G.flags.ph=p;await play(lines);goMap(map,x,y,dir);banner(TEXT.phase[p]);checkpoint();await fade(0);return true}
const waitNight1=()=>turn(TEXT.wait1Q,TEXT.wait1Close,TEXT.wait1,1,'halcott',29,18,'up');
const sleepDay2=()=>turn(TEXT.sleepQ,TEXT.sleepClose,TEXT.sleep,2,'halcott',23,7,'down');
const waitNight2=()=>turn(TEXT.wait2Q,TEXT.wait2Close,TEXT.wait2,3,'khlt',4,11,'up');
// the porch radio: night 1's broadcast (stand-in), in the broadcast look (DAA.onAir), then the night can end
function radioOpts(){if(ph()!==1)return[];const o=[{label:TEXT.radioOpt,run:broadcast}];if(G.flags.heard)o.push({label:TEXT.carOpt.sleep,run:sleepDay2});return o}
async function broadcast(){DAA.onAir(true);try{await play(TEXT.show)}finally{DAA.onAir(false)}G.flags.heard=1;checkpoint()}

// ================= OPENING (stand-in briefing on the bait shop's back porch) =================
async function caseOpening(){
 await cut('open',async()=>{await said(TEXT.open1);await said(TEXT.open2)});
 await bigHatScene(async()=>{
  await cut('brief',()=>play(TEXT.brief));
  await twoQuestions(TEXT.intel);
  await cut('brief2',()=>play(TEXT.brief2));
  await requisition();
 },{place:window.DAA.porch});
 G.flags.ph=0;G.mode='world';goMap('halcott',23,7,'down');checkpoint();await fade(0);
 await cut('arrive',()=>said(TEXT.arrive));
}
const caseNext=()=>TEXT.next[ph()]||'';

// ================= ON THE CASE BOARD =================
// Part A has no ending yet: the Dev map menu's Dev: finish case closes it through the real debrief, as a stand-in.
const facts=l=>({label:l,clues:[],saved:0,overstep:(stepsOf()[loadSeason().overstep|0]||'Clean'),san:party.map(m=>({id:m.a.id,name:m.name,from:m.san0,to:m.san})),items:[],choices:{},tried:[],lost:[]});
registerCase({id:'dead-air',card:caseCard,opening:caseOpening,intel:TEXT.intel,maps:MAPS,tiles:{},get place(){return window.DAA&&window.DAA.porch},
 portraits:name=>window.DAA.portraits[name]||null,items:{},next:caseNext,loot:['energy','cigarettes','roadflare','painkillers','coffee'],
 label:()=>'clean',facts,
 debrief:{clues:[],lines:{clean:[['BIG HAT','Stand-in debrief. The real one comes with the story. Sit.']]},
  stories:[{name:'Faulty transmitter',skill:'Bureaucracy',verb:'file it',pass:[['BIG HAT','A faulty transmitter. Good.']]}],weak:{name:'Kids with a CB radio',pass:[]}}});
})();
