// Black Lantern · cases/tracking.js
// CASE: Tracking (FILE 05), Fourth Street, Reno, Nevada, in winter (spec 018).
// Part A (Nov 23, 2026): the card, every map (Fourth Street in snow by day and by night, the pawn shop, the clerk's place,
// two motel rooms, the collector's apartment, the records room, the closed club and the finale area), the tape's tracking
// lines on the screen, the townsfolk on the map and in the dialog box, Big Hat's own briefing place, and stand-in scripts
// so every map walks and every door and bus ride goes where it should. No clues, fights or story yet: those are part B,
// written from the secret case file.
// Art is cases/tracking-art.js (window.TRKA), loaded right after this file. Needs engine.js and field.js first.
// The whole file sits in one function so its names never meet another case's (every case loads as a plain script).
(function(){

// ================= TEXT =================
// Every line of the case. A list plays box by box: a plain string is narration, ['WHO', 'line'] is someone talking.
// Part A's lines are stand-ins, kept plain; part B rewrites them from the case file in Keegan's voice.
const TEXT={
 next:['Day 1. Walk Fourth Street. Rest in Room 8 at the Starlite when you\'re ready for night.','Night 1. Walk Fourth Street. Rest in Room 8 to move on to day 2.',
  'Day 2. Ride the bus from the stop on Fourth. Rest in Room 8 when you\'re ready for night 2.','Night 2. Club Satin\'s door is open.'],
 phase:['DAY 1 · LATE AFTERNOON','NIGHT 1','DAY 2','NIGHT 2'],
 // ---- the briefing (stand-in) ----
 open1:'TUESDAY · 3:10 PM · 27°F',
 open2:'A text from an unlisted number: "DOWNTOWN. THE OLD BUFFET, SECOND FLOOR. IT\'S CLOSED. COME IN ANYWAY."',
 brief:['A casino buffet, shut for good. Sneeze guards over empty pans. Slot machines asleep along the wall.',['BIG HAT','Agent {code}. Sit. Don\'t touch the carpet.'],
  'He\'s at a two-top with a plate of nothing in front of him.',['BIG HAT','Fourth Street. Reno. A tape with a mouth on it.'],['BIG HAT','Stand-in briefin\'. The real one comes with the story.']],
 // Big Hat's four topics (spec 013): their edges come in part B
 intel:[
  {id:'tape',label:'The tape',answer:['Five-for-a-dollar bin. Somebody wrote on the label.','Somebody else believed it.'],note:'The tape came out of a pawn shop\'s bargain bin on Fourth Street.'},
  {id:'clerk',label:'The clerk',answer:['Wes Pratt. Twenty-three.','Foiled his windows Friday.'],note:'Wes Pratt, the pawn shop\'s clerk, lives over the shop.'},
  {id:'club',label:'The club',answer:['Club Satin. Closed in \'96.','Somebody\'s still payin\' the light bill.'],note:'Club Satin, on Fourth Street, closed in 1996.'},
  {id:'cover',label:'The cover',answer:['You\'re collectors. Collectors are cheap.','Act like it.'],note:'Cover: collectors buying old tapes. Don\'t overpay.'}],
 brief2:[['BIG HAT','Room 8 at the Starlite\'s yours. The heater works if you kick it.'],['BIG HAT','Be smart, be careful, don\'t get burned.']],
 arrive:'TRACKING (stand-in). Walk Fourth Street with A. Rest in Room 8 at the Starlite to move the day on. The bus stop goes across town. START for your notebook.',
 // ---- doors, the street and the bus ----
 room:n=>`Room ${n}. Do Not Disturb on the knob.`,
 room7:'Room 7. The curtains are shut and the TV\'s on loud.',
 office:'The motel office. A bell on the counter, a TV with the sound off.',
 pawnShut:'CLOSED. A cage is pulled across the door.',
 clubShut:'Club Satin. A chain through both handles and a padlock gone white with frost.',
 clubQ:'The chain is gone from the club\'s door. It\'s dark inside.',
 casino:'The Paydirt. Warm air and bells through the revolving door. The case is out here.',
 westEnd:'Fourth Street runs on toward downtown. Not yet.',
 eastEnd:'Past the casino, the street goes under the freeway. Not yet.',
 back12:'Room 12. Checked out. The maid\'s cart is outside it.',
 bus:'BUS STOP',busLook:'Route 12. A bench under a shelter, a schedule behind scratched plastic.',busQ:'Where to?',
 busOpt:{gideon:'Ride to Wells Avenue',records:'Ride to the county building',street:'Ride back to Fourth Street'},
 busRide:{gideon:'Ten minutes, two transfers\' worth of heat. Wells Avenue, an apartment over a laundromat.',records:'The county building. The records room is in the basement.',street:'Back to Fourth Street.'},
 recordsShut:'The county building is closed for the night.',
 exitBus:'Back out to the bus stop?',exitBusOpts:['Catch the bus','Stay'],
 // ---- turning the day (stand-in: the beds in Room 8) ----
 bedName:'BED',bedLook:'A motel bed. The spread has cigarette burns in a pattern.',
 restOpt:['Rest till dark','Sleep till morning','Rest till dark'],
 restQ:['Rest till dark? Day 1 ends.','Sleep till morning? Night 1 ends.','Rest till dark? Day 2 ends.'],
 restClose:['Lucky Buck Pawn closes for good tonight.','Travis checks out of Room 12 and leaves town.','The records room closes, and Gideon stops answering his door.'],
 rested:[['The sun goes down behind the casinos at a quarter to five.','The neon comes on all at once.'],['The heater ticks all night.','In the morning there\'s a car with its trunk open outside Room 12, then there isn\'t.'],['It gets dark early in Reno in winter.','Down the street, the chain on Club Satin\'s door is gone.']],
 restDone:'No more rest. The club\'s waiting.',
 turnOpts:['Go on','Not yet'],
 // ---- the tracking lines (stand-in: the TV in Room 8; watching for real comes in part B) ----
 tvName:'TV',tvLook:'An old TV on a stand with a VCR on top. There\'s a tape in it.',tvOpt:'Play the tape (stand-in)',
 tvStep:n=>n?`(Stand-in: the tracking lines are at step ${n} of 4.)`:'(Stand-in: the tracking lines are gone again.)',
 // ---- the club and the finale area ----
 gateIn:['Go in','Not yet'],
 trapQ:'Behind the stage, a trapdoor stands open. Stairs go down to a room full of humming.',
 hall:'A back room. The door\'s swollen shut. (Part B.)',
 dubOut:'Climb back up to the club?',dubOutOpts:['Climb up','Stay'],
 // ---- the hidden hotspot: only there while the lead is High on Mushrooms (stand-in result) ----
 foilName:'THE FOIL',foilLook:['The foil on the window isn\'t foil. It\'s eyes, hundreds of them, all looking in.','(Stand-in: what it means comes in part B.)'],
 standName:'NIGHTSTAND',standLook:'A nightstand. A Gideon Bible in the drawer, and something under it.',standOpt:'Look under the Bible',
 standFind:'A little paper baggie of dried mushroom caps.',
 // ---- people (stand-ins) ----
 folk:{
  manny:[['MANNY','Lucky Buck. Manny. What are you buyin\', what are you sellin\'?'],'He looks at you through the loupe like you\'re a watch.',['MANNY','Tapes? Bin by the door. Five for a dollar. Don\'t haggle, it\'s a dollar.']],
  wes:[['WES','Close the door. Close it.'],['WES','You can see it too, right? The way they look at you?']],
  luz:[['LUZ','You\'re in 8. Ice machine\'s broken. Don\'t ask me about 7.'],'The bird on her shoulder says "Don\'t ask me about 7."'],
  travis:[['TRAVIS','I\'m not buyin\' anything.'],['TRAVIS','I\'m checkin\' out tomorrow. Bus to Sacramento. Then I\'m done.']],
  gideon:[['GIDEON','Gloves, please, if you\'re going to touch anything.'],['GIDEON','I don\'t sell. I keep. That\'s the difference between us.']],
  teri:[['OFFICER KO','Evening.'],['OFFICER KO','You two are the ones buying up junk. Manny told me. Stay warm.']],
  cherry:[['CHERRY','I\'m on my break, hon. Fifteen minutes and I\'m back on my feet.'],['CHERRY','I used to dance on this street. Don\'t look at me like that.']],
  ines:[['INES','Records. Fill out a slip, I\'ll pull a box.'],'She takes a pencil out of her hair, then another out of her pocket.',['INES','We close at five. Sharp.']]
 },
 // ---- looks around the maps (part B gives them skills and clues) ----
 look:{
  pole:'STARLITE MOTOR LODGE. COLOR TV. WEEKLY RATES.',
  car:'A parked car under a crust of snow.',
  bank:'A plowed snowbank, grey at the bottom, hard as a curb.',
  hydrant:'A fire hydrant with a hat of snow.',
  glass:'The glass counter. Watches, rings, a class ring from 1979.',
  bin:'A box by the door. TAPES 5 FOR $1. Movies, a workout tape, home videos nobody wanted.',
  pawntv:'A TV and a VCR on the counter, for testing tapes before you buy.',
  shelf:'Shelves of drills, lamps and somebody\'s bowling trophies.',
  mattress:'A mattress on the floor. The sheet has WE KNOW on it in marker.',
  westv:'The TV\'s off. The tape is still in the VCR.',
  fridge:'WE KNOW on the fridge door. Inside, nothing but mustard.',
  heater:'A wall heater that clanks like a radiator.',
  dresser:'A dresser. The bottom drawer\'s glued shut.',
  bed12:'A bed with the sheets pulled up over the window, under the foil.',
  hotplate:'A hot plate with a pan of something gone hard.',
  tvstack:'Two TVs stacked, both playing snow with the sound down.',
  recliner:'A viewing chair, the arms worn shiny.',
  tapes:'Tapes. Thousands. Every spine labeled in the same careful hand.',
  fiche:'A microfiche reader, humming.',
  stacks:'Shelves of file boxes. FIRE INSP. 1990-1999.',
  counter:'The records counter. A bell, a slip pad, a cup of pencils.',
  stage:'The stage. A pole, top to bottom, the chrome gone cloudy.',
  bar:'The bar. Bottles with an inch of something left, under an inch of dust.',
  booth:'A booth in red vinyl, split along every seam.',
  dj:'The DJ booth. Two turntables, a VCR, a microphone on a bent arm.',
  coat:'The coat check. One coat still on its hanger.',
  tables:'Chairs stacked upside down on the tables.',
  vcrs:'VCRs, dozens, wired together. Every one of them is on.',
  bench:'A workbench. One deck sits apart from the others, a tape in it.',
  notebook:'A notebook. Every page in the same hand, the same words, backward.'
 }
};
const fill=(t,o)=>String(t).replace(/\{(n|m|v)\}/g,(x,k)=>o[k]??x);
async function play(seq,o={}){for(const l of [].concat(seq)){if(Array.isArray(l))await say(l[0],fill(l[1],o));else await say('',fill(l,o))}}
const said=(l,o)=>play([l],o);
// A point of no return (studio-bible/play.md): the cursor starts on Not yet, so mashing A can't take it.
async function askNotYet(text,opts){await say('',text,{keep:true,instant:false});const r=await choose(opts,{cancel:true,inBox:true,sel:opts.length-1});hideTB();return r<0?opts.length-1:r}

// The case board card (spec 018, The card)
const caseCard={file:5,title:'TRACKING',town:'RENO',place:'FOURTH STREET · RENO, NV',
 hook:['A pawn-shop tape says WE KNOW.','Everyone who watched it agrees.'],pin:'#ff3fa4'};

// ================= THE DAY =================
// G.flags.ph: 0 day 1, 1 night 1, 2 day 2, 3 night 2 (spec 018, Day and night). Each turn waits for Go on / Not yet and
// names what closes (Turning the day); part A's stand-in is resting in Room 8. G.flags.trk: the tracking lines' step, 0-4
// (case checkpoint data, so it clears when the case ends).
const ph=()=>G.flags.ph|0;
const isNight=()=>ph()%2===1;
const outLight=()=>isNight()?'night':ph()===0?'dusk':'day';

// ================= MAPS =================
// Every map is drawn by cases/tracking-art.js from M.ground, M.pieces and M.light. M.g is what blocks.
// Ground letters (none in engine.js's BLOCK set): 's' snow, 'S' trodden snow, '~' slush road, ';' slush sidewalk,
// '_' the motel lot, 'n' lino, 'c' carpet, 'w' wood, 'o' concrete, 'k' the club's carpet, 'd' its dance floor.
function blank(id,name,W,H,fillCh,light){const ground=mk(W,H,fillCh),g=mk(W,H,fillCh);
 return{id,name,w:W,h:H,ground,g,pieces:[],O:{},npcs:[],warps:{},light,art:window.TRKA,bg:id}}
const lay=(M,x,y,w,h,c)=>{rect(M.ground,x,y,w,h,c);rect(M.g,x,y,w,h,c)};
const block=(M,x,y,w=1,h=1)=>rect(M.g,x,y,w,h,'#');
const open=(M,x,y)=>{M.g[y][x]=M.ground[y][x]};
function put(M,k,x,y,w=1,h=1,o={}){const p=Object.assign({k,x,y,w,h},o);M.pieces.push(p);if(!o.walk)block(M,x,y,w,h);return p}
const look=t=>({look:t});
const lookAll=(M,x,y,w,t)=>{for(let i=0;i<w;i++)M.O[(x+i)+','+y]=look(t)};
const folkOf=list=>list.map(n=>Object.assign(n,{talk:()=>play(TEXT.folk[n.id])}));
// a door you walk into: it opens on the far map at (x, y) facing dir
const door=(M,x,y,to,tx,ty,dir='down')=>{open(M,x,y);M.warps[x+','+y]=()=>goTo(to,tx,ty,dir)};
async function goTo(to,x,y,dir){await fade(1);goMap(to,x,y,dir);checkpoint();await fade(0)}
const bounce=(M,keys,text,dir)=>keys.forEach(k=>M.warps[k]=async()=>{await said(text);G.dir=dir;await stepBack()});
const shut=(M,x,y,text)=>{open(M,x,y);M.warps[x+','+y]=async()=>{await said(typeof text==='function'?text():text);G.dir='down';await stepBack()}};

// ---- FOURTH STREET: every phase (48 x 22). North side, west to east: the Starlite Motor Lodge (rooms 7-12 and the
// office), Lucky Buck Pawn with Wes's stair door, a vacant lot, Club Satin, the Paydirt casino. The street, then the
// south sidewalk with the bus stop, then a fenced lot. Doors sit in the fronts' bottom row (row 6).
const ROOMS={8:'room8',12:'room12'};
const SY=6;  // the fronts' bottom row: the doors
function buildStreet(){
 const N=isNight(),p=ph(),M=blank('street','FOURTH STREET',48,22,';',outLight());M.alpha=.88;M.warm='#ffbe70';M.ph=p;M.variant=p;
 block(M,0,0,48,SY+1);rect(M.ground,0,0,48,SY+1,'s');put(M,'street',0,0,48,22,{walk:1});
 lay(M,0,SY+1,16,3,'_');lay(M,0,SY+4,48,4,'~');lay(M,0,SY+8,48,2,';');rect(M.ground,0,SY+10,48,6,'s');rect(M.ground,4,SY+12,40,2,'S');block(M,0,SY+10,48,6);
 // the motel: rooms 7-12, door x for room n: 2 * (n - 7) + 1; the office door at x 14
 for(let n=7;n<=12;n++){const x=2*(n-7)+1;
  if(ROOMS[n]&&!(n===12&&p>=2))door(M,x,SY,ROOMS[n],5,6,'up');else shut(M,x,SY,n===12?TEXT.back12:n===7?TEXT.room7:TEXT.room(n))}
 shut(M,14,SY,TEXT.office);
 // Wes's stair door, and the pawn shop (day 1 only: it closes for good at the first turn)
 door(M,18,SY,'wes',6,7,'up');
 if(p>=1)shut(M,23,SY,TEXT.pawnShut);else door(M,23,SY,'pawn',8,8,'up');
 // Club Satin: chained shut until night 2, then Go in / Not yet
 for(const x of[37,38]){open(M,x,SY);M.warps[x+','+SY]=p===3?enterClub:async()=>{await said(TEXT.clubShut);G.dir='down';await stepBack()}}
 shut(M,44,SY,TEXT.casino);
 // the street's dressing: the motel's pole sign, parked cars, lamps, snowbanks, the bus stop, a hydrant
 put(M,'polesign',16,SY+3);M.O['16,'+(SY+3)]=look(TEXT.look.pole);
 put(M,'car',5,SY+2,3,1,{tint:'#7a2a3a'});put(M,'car',9,SY+2,3,1,{tint:'#3e5a6a'});lookAll(M,5,SY+2,3,TEXT.look.car);lookAll(M,9,SY+2,3,TEXT.look.car);
 [[6,SY+3],[20,SY+3],[34,SY+3],[46,SY+3],[12,SY+9],[40,SY+9],[22,SY+9]].forEach(([x,y])=>put(M,'lamp',x,y));
 [[27,SY+3,2],[41,SY+3,2],[31,SY+8,2],[2,SY+8,2]].forEach(([x,y,w])=>{put(M,'snowbank',x,y,w,1);lookAll(M,x,y,w,TEXT.look.bank)});
 put(M,'hydrant',35,SY+8);M.O['35,'+(SY+8)]=look(TEXT.look.hydrant);
 put(M,'busstop',26,SY+8,3,1);for(const x of[26,27,28])M.O[x+','+(SY+8)]={id:'bus',name:TEXT.bus,look:TEXT.busLook,opts:()=>busOpts()};
 // past the fence: the lot's own dressing (it doesn't walk)
 [[3,SY+12,3],[16,SY+11,2],[38,SY+13,3],[24,SY+14,2]].forEach(([x,y,w])=>put(M,'snowbank',x,y,w,1,{walk:1}));
 put(M,'car',9,SY+13,3,1,{tint:'#4a4a54',walk:1});put(M,'car',44,SY+12,3,1,{tint:'#d8c890',walk:1});put(M,'dumpster',20,SY+12,2,1,{walk:1});
 // the street runs on past both ends
 const ends=[1,2,3,4,5,6,7,8,9].map(d=>SY+d);bounce(M,ends.map(y=>'0,'+y),TEXT.westEnd,'right');bounce(M,ends.map(y=>'47,'+y),TEXT.eastEnd,'left');
 // people: who's where by phase
 const NP=[{id:'luz',x:15,y:SY+1,dir:'down'}];
 if(p>=1)NP.push({id:'teri',x:30,y:SY+2,dir:'left'});
 if(!N)NP.push({id:'cherry',x:25,y:SY+9,dir:'up'});
 M.npcs=folkOf(NP);
 return M}

// ---- interiors: the back wall three tiles tall, the door in the bottom wall ----
function room(id,name,W,H,floor,o={}){const M=blank(id,name,W,H,floor,isNight()?'night':'day');M.alpha=o.alpha||.55;M.warm='#ffcf80';
 block(M,0,0,W,3);block(M,0,0,1,H);block(M,W-1,0,1,H);block(M,0,H-1,W,1);put(M,'room',0,0,W,H,{walk:1,floor});return M}
function buildPawn(){const M=room('pawn','LUCKY BUCK PAWN',16,10,'n');
 put(M,'glasscase',3,5,3,1);put(M,'glasscase',6,5,3,1);lookAll(M,3,5,6,TEXT.look.glass);M.O['5,5']=M.O['6,5']=()=>play(TEXT.folk.manny);
 put(M,'crt',10,5,1,1,{on:false});put(M,'vcr',10,5,1,1,{walk:1,dy:-6});M.O['10,5']=look(TEXT.look.pawntv);
 put(M,'shelf',13,3,2,1);lookAll(M,13,3,2,TEXT.look.shelf);put(M,'shelf',1,3,2,1);lookAll(M,1,3,2,TEXT.look.shelf);
 put(M,'bin',12,7);M.O['12,7']=look(TEXT.look.bin);put(M,'boxes',1,7,1,1,{v:1});put(M,'boxes',14,6,1,1,{v:2});
 M.npcs=folkOf([{id:'manny',x:5,y:4,dir:'down'}]);
 door(M,8,9,'street',23,SY+1,'down');return M}
function buildWes(){const M=room('wes','WES\'S PLACE',12,9,'c',{alpha:.72});
 put(M,'mattress',1,4,2,1);lookAll(M,1,4,2,TEXT.look.mattress);put(M,'crate',7,4);put(M,'crt',7,4,1,1,{walk:1,on:true});put(M,'vcr',7,4,1,1,{walk:1,dy:-18,tape:1});M.O['7,4']=look(TEXT.look.westv);
 put(M,'fridge',10,3);M.O['10,3']=look(TEXT.look.fridge);put(M,'boxes',10,6,1,1,{v:0});
 // The hidden hotspot (Item list, Mushrooms): the foil on the left window, only while the lead is High (field.js)
 M.O['3,2']={id:'foil',hidden:'mushrooms',name:TEXT.foilName,look:()=>play(TEXT.foilLook),glint:(c,x,y,now)=>TRKA.foilGlint(c,x,y,now)};
 M.npcs=folkOf([{id:'wes',x:5,y:5,dir:'down'}]);
 door(M,6,8,'street',18,SY+1,'down');return M}
function buildRoom8(){const M=room('room8','ROOM 8 · STARLITE',11,8,'c');
 put(M,'bed',1,3,2,2);put(M,'bed',4,3,2,2);
 for(const k of['1,4','2,4','4,4','5,4','1,3','2,3','4,3','5,3'])M.O[k]={id:'bed',name:TEXT.bedName,look:TEXT.bedLook,opts:()=>restOpts()};
 put(M,'dresser',7,3,2,1);M.O['7,3']=look(TEXT.look.dresser);put(M,'crt',9,3,1,1,{on:true});put(M,'vcr',9,3,1,1,{walk:1,dy:-12,tape:1});
 M.O['9,3']={id:'tv',name:TEXT.tvName,look:TEXT.tvLook,opts:[{label:TEXT.tvOpt,run:async()=>{G.flags.trk=((G.flags.trk|0)+1)%5;checkpoint();await said(TEXT.tvStep(G.flags.trk))}}]};
 put(M,'heater',8,6);M.O['8,6']=look(TEXT.look.heater);
 door(M,5,7,'street',3,SY+1,'down');return M}
function buildRoom12(){const M=room('room12','ROOM 12 · STARLITE',11,8,'c',{alpha:.7});
 put(M,'bed',1,3,2,2);lookAll(M,1,3,2,TEXT.look.bed12);lookAll(M,1,4,2,TEXT.look.bed12);
 put(M,'nightstand',3,3);M.O['3,3']={id:'stand',name:TEXT.standName,look:TEXT.standLook,opts:[{label:TEXT.standOpt,once:'caps',run:async()=>{await said(TEXT.standFind);await pickup('shrooms')}}]};
 put(M,'hotplate',8,3);M.O['8,3']=look(TEXT.look.hotplate);put(M,'boxes',9,5,1,1,{v:0});
 if(ph()<2)M.npcs=folkOf([{id:'travis',x:6,y:5,dir:'down'}]);
 door(M,5,7,'street',11,SY+1,'down');return M}
// across town by bus: the collector's apartment and the records room (days only)
const busBack=(M,x,y)=>{open(M,x,y);M.warps[x+','+y]=async()=>{const r=await ask('',TEXT.exitBus,TEXT.exitBusOpts);if(r===0)await ride('street');else{G.dir='up';await stepBack()}}};
function buildGideon(){const M=room('gideon','GIDEON\'S APARTMENT',13,10,'w');
 for(let x=1;x<12;x++)M.O[x+',2']=look(TEXT.look.tapes);
 put(M,'tvstack',3,3,2,1);lookAll(M,3,3,2,TEXT.look.tvstack);put(M,'recliner',4,6);M.O['4,6']=look(TEXT.look.recliner);
 put(M,'shelf',10,4,2,1);put(M,'shelf',10,6,2,1);lookAll(M,10,4,2,TEXT.look.tapes);lookAll(M,10,6,2,TEXT.look.tapes);put(M,'boxes',1,7,1,1,{v:2});put(M,'boxes',1,5,1,1,{v:1});
 M.npcs=folkOf([{id:'gideon',x:7,y:5,dir:'down'}]);
 busBack(M,6,9);return M}
function buildRecords(){const M=room('records','COUNTY RECORDS',14,10,'n');
 [[1,3],[1,5],[1,7],[11,3],[11,5],[11,7]].forEach(([x,y])=>{put(M,'shelf',x,y,2,1);lookAll(M,x,y,2,TEXT.look.stacks)});
 put(M,'fiche',5,3);M.O['5,3']=look(TEXT.look.fiche);
 put(M,'counter',5,6,4,1);lookAll(M,5,6,4,TEXT.look.counter);M.O['7,6']=()=>play(TEXT.folk.ines);
 M.npcs=folkOf([{id:'ines',x:7,y:5,dir:'down'}]);
 busBack(M,7,9);return M}

// ---- CLUB SATIN: night 2, the danger zone (26 x 18): the dance floor and the pole stage, the bar, the booths, the DJ
// booth, the coat check by the lobby door, the back hall's three doors; the trapdoor behind the stage ----
function buildClub(){const M=blank('club','CLUB SATIN',26,18,'k','night');M.alpha=.74;M.warm='#ffbe90';
 block(M,0,0,26,3);block(M,0,0,1,18);block(M,25,0,1,18);block(M,0,17,26,1);put(M,'clubroom',0,0,26,18,{walk:1});
 lay(M,6,6,14,7,'d');
 put(M,'stage',11,3,4,2);lookAll(M,11,3,4,TEXT.look.stage);lookAll(M,11,4,4,TEXT.look.stage);
 open(M,16,3);M.warps['16,3']=enterDub;
 for(const x of[20,22,24])M.O[x+',2']=look(TEXT.hall);
 put(M,'djbooth',6,3,2,1);lookAll(M,6,3,2,TEXT.look.dj);
 put(M,'bar',19,8,5,1);lookAll(M,19,8,5,TEXT.look.bar);
 [[2,4],[2,7],[2,10]].forEach(([x,y])=>{put(M,'booth',x,y,2,1);lookAll(M,x,y,2,TEXT.look.booth)});
 [[8,14],[17,14],[21,12]].forEach(([x,y])=>{put(M,'tables',x,y);M.O[x+','+y]=look(TEXT.look.tables)});
 put(M,'coatcheck',2,14,2,1);lookAll(M,2,14,2,TEXT.look.coat);
 door(M,13,17,'street',37,SY+1,'down');return M}
async function enterClub(){const r=await askNotYet(TEXT.clubQ,TEXT.gateIn);if(r===0)await goTo('club',13,16,'up');else{G.dir='down';await stepBack()}}
// ---- THE DUB ROOM: night 2, the finale area (16 x 9); the boss waits here in part B ----
async function enterDub(){const r=await askNotYet(TEXT.trapQ,TEXT.gateIn);if(r===0)await goTo('dub',8,7,'up');else{G.dir='down';await stepBack()}}
function buildDub(){const M=blank('dub','THE DUB ROOM',16,9,'o','night');M.alpha=.84;M.warm='#c8d8ff';
 block(M,0,0,16,2);block(M,0,0,1,9);block(M,15,0,1,9);block(M,0,8,16,1);put(M,'vault',0,0,16,9,{walk:1});
 put(M,'vcrwall',1,0,14,2,{walk:1});for(let x=1;x<15;x++)M.O[x+',1']=look(TEXT.look.vcrs);
 put(M,'bench',7,3,2,1);lookAll(M,7,3,2,TEXT.look.bench);put(M,'notebook',10,3);M.O['10,3']=look(TEXT.look.notebook);
 put(M,'boxes',2,5,1,1,{v:2});put(M,'boxes',13,5,1,1,{v:1});
 open(M,8,8);M.warps['8,8']=async()=>{const r=await ask('',TEXT.dubOut,TEXT.dubOutOpts);if(r===0)await goTo('club',16,4,'down');else{G.dir='up';await stepBack()}};
 return M}
const MAPS={street:buildStreet,pawn:buildPawn,wes:buildWes,room8:buildRoom8,room12:buildRoom12,gideon:buildGideon,records:buildRecords,club:buildClub,dub:buildDub};

// ================= STAND-IN SCRIPTS =================
function busOpts(){const o=[];if(G.map!=='street')return o;
 o.push({label:TEXT.busOpt.gideon,run:()=>ride('gideon')});
 o.push({label:TEXT.busOpt.records,run:()=>isNight()?said(TEXT.recordsShut):ride('records')});
 return o}
async function ride(where){await fade(1);await say('',TEXT.busRide[where]);
 if(where==='gideon')goMap('gideon',6,8,'up');else if(where==='records')goMap('records',7,8,'up');else goMap('street',27,SY+9,'down');checkpoint();await fade(0)}
// the stand-in for the story's turns of the day: the beds in Room 8, with Go on / Not yet and what closes (studio-bible/play.md)
function restOpts(){const p=ph();if(p>=3)return[{label:TEXT.restOpt[2],run:()=>said(TEXT.restDone)}];return[{label:TEXT.restOpt[p],run:turnDay}]}
async function turnDay(){const p=ph();if(p>=3){await said(TEXT.restDone);return}
 const r=await askNotYet(TEXT.restQ[p]+' '+TEXT.restClose[p],TEXT.turnOpts);if(r!==0)return;
 await fade(1);G.flags.ph=p+1;await play(TEXT.rested[p]);await rest(1);goMap('room8',5,6,'up');banner(TEXT.phase[p+1]);checkpoint();await fade(0)}

// ================= OPENING (stand-in briefing in the casino's shut buffet) =================
async function caseOpening(){
 await cut('open',async()=>{await said(TEXT.open1);await said(TEXT.open2)});
 await bigHatScene(async()=>{
  await cut('brief',()=>play(TEXT.brief));
  await twoQuestions(TEXT.intel);
  await cut('brief2',()=>play(TEXT.brief2));
  await requisition();
 },{place:window.TRKA.buffet});
 G.flags.ph=0;G.flags.trk=0;G.mode='world';goMap('street',23,SY+2,'down');checkpoint();await fade(0);
 await cut('arrive',()=>said(TEXT.arrive));
}
const caseNext=()=>TEXT.next[ph()]||'';

// ================= ON THE CASE BOARD =================
// Part A has no ending yet: the Dev map menu's Dev: finish case closes it through the real debrief, as a stand-in.
const facts=l=>({label:l,clues:[],saved:0,overstep:(stepsOf()[loadSeason().overstep|0]||'Clean'),san:party.map(m=>({id:m.a.id,name:m.name,from:m.san0,to:m.san})),items:[],choices:{},tried:[],lost:[]});
registerCase({id:'tracking',card:caseCard,opening:caseOpening,intel:TEXT.intel,maps:MAPS,tiles:{},
 get place(){return window.TRKA&&TRKA.buffet},  // Big Hat's place for this case: the briefing passes it, and the debrief plays there too (engine.js casePlace)
 portraits:name=>window.TRKA.portraits[name]||null,items:{},next:caseNext,quiet:true,loot:['energy','painkillers','roadflare','cigs','booze'],
 label:()=>'clean',facts,
 debrief:{clues:[],lines:{clean:[['BIG HAT','Stand-in debrief. The real one comes with the story. Sit.']]},
  stories:[{name:'Estate sale',skill:'Persuade',verb:'sell it',pass:[['BIG HAT','Collectors. Good.']]}],weak:{name:'Space heater fire',pass:[]}}});
})();
