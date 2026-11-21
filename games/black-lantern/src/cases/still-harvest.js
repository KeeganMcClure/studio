// Black Lantern · cases/still-harvest.js
// CASE: Operation Still Harvest (Marrow Creek, Oregon). Demo case, to be rebuilt in the vertical slice.
// Needs engine.js loaded first. Everything here is plain data and small async scripts the engine calls.

// ================= TEXT =================
// This case's text block. Empty for now: the Still Harvest rebuild moves its dialog, case text and line pools here.
// Until then the demo's lines stay inline in the scripts below.
const TEXT={};
// The case board card (spec 004, step 3). Teaser lines only: no twist, no solution.
const caseCard={
 file:1,
 title:'STILL HARVEST',
 town:'MARROW CREEK',
 place:'LANTERN WALK · MARROW CREEK, OR',
 hook:['Three townsfolk went missing on the','Lantern Walk. The corn knows where.'],
 pin:'#d6a43a'
};

// ================= CASE DATA =================
const EN={
 crow:{name:'Crowling',hp:10,dex:14,skill:45,dmg:[1,4],san:['0','1'],moves:[['hit',1]],verb:'pecks at',die:'bursts into black feathers'},
 husk:{name:'Husk Scout',hp:15,dex:9,skill:40,dmg:[1,6],san:['0','1d3'],moves:[['hit',3],['san',1]],verb:'grabs at',sanText:'The Husk Scout recites the Scout Oath. Every word is a name you know.',sanHit:['0','1d2'],die:'comes apart into straw and merit badges'},
 hound:{name:'Bale Hound',hp:20,dex:12,skill:50,dmg:[1,8],san:['0','1d3'],moves:[['hit',1]],verb:'bites',die:'collapses into loose hay'},
 long:{name:'Long Man',hp:28,dex:7,skill:50,dmg:[1,10],san:['1','1d6'],moves:[['hit',2],['san',1]],verb:'reaches down for',sanText:'The Long Man bends down and looks at you. Just looks.',sanHit:['0','1d4'],die:'topples like a felled tree'},
 vol:{name:'Volunteer',hp:18,dex:10,skill:45,dmg:[1,6],san:['0','1d3'],moves:[['hit',3],['san',1]],verb:'swings a clipboard at',sanText:'The Volunteer reads your name off the clipboard. Then your mother\'s.',sanHit:['0','1d2'],die:'folds over like an empty coat'},
 gleaner:{name:'The Gleaner',hp:110,dex:11,skill:55,dmg:[2,6],san:['1','1d8'],moves:[['hit',4],['all',2],['san',2]],verb:'reaps',allText:'The Gleaner sweeps its sickles through the corn!',allDmg:[1,6],sanText:'The Gleaner speaks your names, one by one, as if tasting them.',sanHit:['1','1d4'],die:'goes out'}
};
const ENC_EARLY=[['crow','crow'],['husk'],['crow'],['hound']];
const ENC_LATE=[['husk','crow'],['hound','crow'],['crow','crow','crow'],['long'],['husk','husk'],['hound']];
const ROLE_LINE={Investigator:'Let\'s knock on some doors.',Healer:'I brought the good bandages.',Analyst:'For the record, I don\'t believe in any of this.',Vanguard:'Point me at it.',Lorekeeper:'I\'ve read about towns like this. None of the endings were happy.',Tech:'No cell signal. That\'s... not great.',Bruiser:'I\'ll do the talking. And the hitting.',Support:'Everybody drink some water.',Tracker:'Corn this tall in October is wrong.',Confessor:'I\'ll pray for us. Somebody should.',Courier:'I\'ve delivered to Marrow Creek. Nobody ever signs.',Undertaker:'Lovely town. Very... still.',Scrapper:'Got my keys, got my mop. Let\'s go.',Morale:'Anybody want a Bomb Pop? No? More for me.'};
const BGPAL={town:['#3a1f3f','#4b2a4a','#6b3a4a','#8a4a3a','#6b3a4a'],maze:['#24170a','#3d2a12','#5a3c18','#6e4a1c','#3d2a12'],boss:['#14040e','#3a0a1e','#5c0f24','#2a0a3a','#5c0f24','#7a1530']};
const TILEDESC={P:'A pumpkin. Someone carved a face in it, then a second, smaller face inside the mouth.',H:'A hay bale. Warm, like something was just sleeping in it.',L:'A paper lantern on a post. The candle burns but gives off no heat.',C:'Corn, taller than you. It rustles, though there\'s no wind.',T:'An old oak in full autumn color.',F:'A split-rail fence.',B:'Shingles. A crow on the roof watches you and does not blink.','#':'Clapboard and peeling paint.'};

// ================= OPENING (Big Hat's briefing) =================
async function caseOpening(){
  await say('','SATURDAY · 11:52 PM');
  await say('','A text from an unlisted number: "BACK OF THE DONUT PLACE. EXIT 253. NOW."');
  await bigHatScene(async()=>{
   await say('','The back room of a 24-hour donut shop off I-5. Spurs on linoleum.');
   await say('BIG HAT','Agent {code}. Sit.');
   await say('','There is no chair.');
   await say('BIG HAT','Marrow Creek, Oregon. Population eight hundred and twelve. Three folks gone in nine days. All during their Harvest Lantern Walk.');
   await say('BIG HAT','Local police say they wandered off. Local police also mailed me a photo of a scarecrow wearin\' one victim\'s wedding ring.');
   await say('BIG HAT','I don\'t care for scarecrows, {first}. A scarecrow is a man with the man taken out.');
   await shout('AND I WILL NOT HAVE IT IN MY JURISDICTION.');
   await say('','He sets down his cruller. His hand is perfectly steady.');
   const q=await ask('BIG HAT','Questions.',['Who are you?','Why us?','No questions.']);
   if(q===0)await say('BIG HAT','I\'m the fella in the big hat. That\'s the whole file.');
   if(q===1)await say('BIG HAT','You were awake.');
   if(q===2)await say('BIG HAT','Good. I like you. Don\'t make it weird.');
   await say('BIG HAT','Your team meets you at the welcome sign. Ask around. Find \'em. Keep it quiet.');
   await say('BIG HAT','And {first}? Be home by Sunday. I don\'t do paperwork on a Sunday.');
   await say('','You never see his eyes. Just the brim, and under it, the toothpick, moving.');
  });
  G.mode='world';goMap('town',14,16,'up');checkpoint();await fade(0);
  for(const m of squad())await say(m.name.toUpperCase()+' · '+profOf(m.a).name.toUpperCase(),ROLE_LINE[profOf(m.a).role]||'Let\'s get this over with.');
  await say('','OPERATION STILL HARVEST. Talk to people with A. Press START for your notebook and party.');
}

// ================= CLUES =================
const townClues=()=>G.clues.filter(c=>['scare','walk','count','posters','bell'].includes(c.id)).length;

// ================= MAPS =================
const NPCL={
 dot:{skin:1,hair:4,hairC:4,acc:0},pell:{skin:0,hair:3,hairC:5,acc:1},pip:{skin:3,hair:6,hairC:0,acc:0},ross:{skin:2,hair:2,hairC:1,acc:2},vol:{skin:0,hair:3,hairC:0,acc:0}};

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
 const O={};
 const npcs=[
  {id:'dot',x:6,y:5,dir:'down',look:NPCL.dot,oc:'#d86a8a',talk:talkDot},
  {id:'pell',x:14,y:6,dir:'down',look:NPCL.pell,oc:'#3a3a5a',talk:talkMayor},
  {id:'pip',x:21,y:13,dir:'left',look:NPCL.pip,oc:'#e0a030',talk:talkPip},
  {id:'ross',x:6,y:14,dir:'down',look:NPCL.ross,oc:'#5a6a4a',hat:'#3a3a2a',talk:talkRoss},
  {id:'vol',x:28,y:9,dir:'left',look:NPCL.vol,oc:'#ff7a1a',sack:true,talk:talkVol,on:()=>G.flags.key&&!G.flags.volDone}
 ];
 O['5,3']=async()=>{await say('','The diner door is locked. A sign in the window: GONE TO THE WALK. BACK SOON. BACK SOON. BACK SOON.')};
 O['23,3']=talkChurch;
 O['14,7']=O['15,7']=talkMayor;
 O['11,7']=async()=>{await say('','The Pell family scarecrow. A cheerful straw man in a sweater vest. Its stitched smile is wider than when you first looked.')};
 O['18,7']=async()=>{await say('','The Ruiz family scarecrow. It\'s facing you. You\'re almost sure it was facing the podium a second ago.')};
 O['12,11']=talkBoard;
 O['8,13']=O['9,13']=talkCider;
 O['12,17']=async()=>{await say('','WELCOME TO MARROW CREEK. HOME OF THE HARVEST LANTERN WALK. POP. 812.');await say('','Someone crossed out 812 in orange crayon and wrote 809. Under that, smaller: 808?')};
 O['29,9']=O['29,10']=talkGate;
 O['3,15']=O['4,15']=async()=>{await say('','Deputy Ross\'s cruiser. Cold coffee cups, a shotgun, and a child\'s drawing of a scarecrow taped to the dash. The scarecrow in the drawing is crying.')};
 const warps={'14,19':bounceHome,'15,19':bounceHome};
 return{name:'MARROW CREEK',w:W,h:H,g,O,npcs,warps,dark:false,bg:'town'};
}
async function bounceHome(){await say('','Big Hat said be home by Sunday. Not yet.');G.dir='up';await stepBack()}
let MAZE=null;
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
 return{W,H,g,vict,items};
}
const VICTIMS=[
 {id:'carol',name:'Carol Henderson',see:'A scarecrow in a cardigan. A wedding ring glints on one straw finger.',cue:'It\'s breathing.',free:'You cut the twine. Straw pours away and Carol Henderson drops into your arms, gasping.',line:'"It knows our names. It said it only needed one more."'},
 {id:'dev',name:'Dev Okoro',see:'A scarecrow in a varsity jacket, earbuds still in.',cue:'The earbuds are playing something. It\'s your own voice, saying your name.',free:'You pull the earbuds out and cut the ropes. Dev Okoro stumbles forward and throws up in the corn.',line:'"How long was I up there? It felt like a week. It felt like I was the field."'},
 {id:'walt',name:'Walter Abbot',see:'A scarecrow with thick glasses, seated politely in a lawn chair someone placed here.',cue:'His hand twitches. He is trying to wave.',free:'You lift the burlap away. Walter Abbot blinks up at you through cracked lenses.',line:'"Seventy-seven Walks. I always said I\'d never go in after dark. Then it asked so nicely."'}
];
const LOOT=['aid','coffee','aid','flare','note'];
function buildMaze(){
 if(!MAZE)MAZE=genMaze();
 const {W,H,vict,items}=MAZE,g=MAZE.g.map(r=>r.slice()),O={},vv={};
 [[10,8],[16,8],[10,14],[16,14]].forEach(([x,y])=>g[y][x]='l');
 vict.forEach(([x,y],i)=>{const V=VICTIMS[i];if(G.flags['saved_'+V.id]){g[y][x]='M';return}g[y][x]='V';vv[x+','+y]=i;O[x+','+y]=()=>talkVictim(i)});
 items.forEach(([x,y],i)=>{const k='loot'+i;if(G.flags[k])return;const it=LOOT[i%LOOT.length];g[y][x]=it==='note'?'O':'I';O[x+','+y]=()=>takeLoot(k,it)});
 if(!G.flags.boss){g[11][13]='X';g[10][13]='X'}
 const warps={'0,11':leaveMaze};
 return{name:'THE CORN MAZE',w:W,h:H,g,O,vv,npcs:[],warps,dark:true,bg:'maze',boss:!G.flags.boss,onStep:mazeStep};
}
const MAPS={town:buildTown,maze:buildMaze};

// ================= TOWN SCRIPTS =================
async function talkDot(){
 if(!G.flags.dot1){G.flags.dot1=1;await say('DOT','Hon, you look like you drove all night. We\'re closed for the Walk, but I\'ll tell you what I tell everybody.');await say('DOT','The pie is better than the coffee, and the coffee is better than you\'d think.')}
 const r=await ask('DOT','What can I do you for?',['Ask about the missing','Ask about the Walk','Never mind']);
 if(r===0){await say('DOT','Carol? Sweetest woman. She made her family\'s scarecrow this year. You should see it. It\'s out in the maze now.');await say('DOT','Spitting image of her. Even has her ring. Every family builds one for the fair, you know.');await say('DOT','This year three of them came out... finished.');clue('scare','Every family builds a scarecrow for the fair. Three of them now look exactly like the missing people.')}
 if(r===1){await say('DOT','Fifty-one years I\'ve walked it. Never once went in the maze after dark, though.');await say('DOT','That\'s just manners. You don\'t go in until you\'re asked.')}
}
async function talkMayor(){
 if(!G.flags.may1){G.flags.may1=1;await say('MAYOR PELL','Welcome, welcome! Federal folks! How exciting. Have you tried the cider? Everyone tries the cider.')}
 const r=await ask('MAYOR PELL','What brings you to our little harvest?',['Ask about the Walk','Ask about the missing','Leave']);
 if(r===0){await say('MAYOR PELL','Every year the whole town carries lanterns through the maze to the center and back. We give thanks for the harvest.');await say('MAYOR PELL','And the harvest gives thanks for us.');await say('MAYOR PELL','Like always. Like always. Like always. Like always.');await say('','He blinks. He smiles. He doesn\'t seem to know he did that.');clue('walk','The Lantern Walk ends at the center of the corn maze. The mayor got stuck repeating himself when he talked about it.')}
 if(r===1){await say('MAYOR PELL','Missing is such a strong word. They\'re simply where they\'re meant to be.');await say('MAYOR PELL','Isn\'t that what we all want? To be where we\'re meant to be?')}
}
async function talkPip(){
 await say('PIP','My dad says don\'t count the scarecrows.');await say('PIP','I counted anyway. There\'s one more every morning.');await say('PIP','Yesterday\'s new one had glasses like Mr. Abbot. Mr. Abbot gave me a butterscotch once.');
 clue('count','A kid has been counting scarecrows. There\'s one more every morning. The newest one wears Walter Abbot\'s glasses.');
 if(!G.flags.pipGift){G.flags.pipGift=1;G.items.coffee=(G.items.coffee||0)+1;await say('PIP','You can have my dad\'s coffee. He\'s not using it. He\'s been standing in the backyard since Tuesday.');await say('','Got a Thermos Coffee.')}
}
async function talkBoard(){
 await say('','MISSING: CAROL HENDERSON (41). DEV OKORO (19). WALTER ABBOT (77).');await say('','All three were last seen boarding the hayride to the corn maze.');await say('','Someone has colored over each face in orange crayon. Carefully. Staying inside the lines.');
 clue('posters','All three missing people were last seen on the hayride to the corn maze.');
}
async function talkCider(){
 if(G.flags.cider){await say('','The cider jug is empty. You don\'t remember finishing it.');return}
 await say('','A folding table under a striped awning. FREE CIDER! PRESSED FROM OUR OWN MAZE APPLES.');
 const r=await ask('','Nobody is behind the table. The cups are already poured.',['Everyone drinks (full heal)','Leave it']);
 if(r===0){G.flags.cider=1;party.forEach(m=>{m.hp=m.mhp;m.wp=m.mwp});await say('','It\'s sweet. Very sweet. Under the sweetness it tastes like old pennies.');await say('','Everyone feels great. Everyone feels like they belong here.')}
}
async function talkChurch(){
 if(G.flags.bell){await say('','The church door is unlocked now. The pews are full of scarecrows wearing Sunday clothes. You close the door.');return}
 await say('','A note on the church door: SERVICES SUSPENDED. PLEASE DO NOT RING THE BELL.');
 const r=await ask('','The bell rope hangs just inside.',['Ring the bell','Leave it alone']);
 if(r===0){G.flags.bell=1;await say('','BONNNNNNG.');await say('','All across town, every scarecrow turns its head toward the church.');await say('','Then, slowly, they turn back.');await sanCheck(['0','1d4'],'Watching the scarecrows move');
  await say('','By the door you find a brass handbell. Whatever is out there hated that sound. You take the bell.');G.items.bell=1;
  clue('bell','The scarecrows react to the church bell. You took a brass handbell. It might stop them for a moment.')}
}
async function talkRoss(){
 if(G.flags.key){await say('DEPUTY ROSS','Gate\'s on the east side. Go. I\'m staying with the car. Somebody has to drive whoever comes back.');return}
 const n=townClues();
 if(n<3){await say('DEPUTY ROSS','Deputy Ross. Look, I don\'t know what the Feds want with a couple of people who wandered off.');await say('DEPUTY ROSS',`Talk to folks. Bring me something that isn't crazy. (Clues: ${n}/3)`);return}
 await say('DEPUTY ROSS','...Okay. That\'s three people telling me the same crazy story.');await say('DEPUTY ROSS','The Sheriff told me to lose the key to the maze gate. Said the Walk would sort it out.');await say('DEPUTY ROSS','I\'m giving it to you instead. Bring them home.');
 G.flags.key=1;banner('GOT: MAZE GATE KEY');checkpoint();
}
async function talkVol(){
 await say('VOLUNTEER','Hi there! Harvest Committee! The maze is closed until the Walk.');await say('VOLUNTEER','You don\'t have a lantern. You can\'t go in without a lantern. You\'d get lost.');await say('VOLUNTEER','You\'d get FOUND.');await say('VOLUNTEER','Here. Let me hold your faces for you.');
 const r=await battle(['vol'],{intro:'The Volunteer\'s sack head splits into a wider smile!'});
 if(r==='lose')return gameOver();
 G.flags.volDone=1;await say('','The volunteer folds over like an empty coat. Straw spills out of the sleeves.');await say('','His clipboard has a list of names. Three are crossed out. The fourth line is blank, waiting.');checkpoint();
}
async function talkGate(){
 if(!G.flags.key){await say('','A heavy gate wrapped in chain. A sign: LANTERN WALK TONIGHT. NO ENTRY BEFORE DUSK.');return}
 if(!G.flags.volDone){return talkVol()}
 const r=await ask('','The key turns. Beyond the gate, the corn is taller than any corn should be.',['Go in','Not yet']);
 if(r===0){G.flags.gateOpen=1;await fade(1);goMap('maze',1,11,'right');G.enc=8;checkpoint();await fade(0);await say('','Somewhere ahead in the dark, a lantern is moving.');await say('','(The maze is dark. Your light shrinks as your SAN drops.)')}
}

// ================= MAZE SCRIPTS =================
async function mazeStep(){
 const inClear=G.x>=10&&G.x<=16&&G.y>=8&&G.y<=14;
 if(inClear&&!G.flags.boss){held=[];return bossIntro()}
 if(inClear)return;
 G.enc=(G.enc??10)-1;
 if(G.enc<=0){held=[];G.enc=11+rnd(12);const grp=pick((G.fights||0)<3?ENC_EARLY:ENC_LATE);const r=await battle(grp);if(r==='lose')return gameOver()}
}
async function leaveMaze(){const r=await ask('','Head back out to town?',['Go back','Stay']);if(r===0){await fade(1);goMap('town',28,10,'left');await fade(0)}else{G.dir='right';await stepBack()}}
async function talkVictim(i){
 const V=VICTIMS[i];await say('',V.see);await say('',V.cue);
 if(!G.flags['seen_'+V.id]){G.flags['seen_'+V.id]=1;await sanCheck(['0','1d4'],`Recognizing ${V.name}`)}
 const r=await ask('','The twine is knotted tight.',['Cut them down','Leave them for now']);
 if(r===0){G.flags['saved_'+V.id]=1;G.rescued=(G.rescued||0)+1;await say('',V.free);await say(V.name.toUpperCase(),V.line);await say('',`${V.name.split(' ')[0]} limps back toward the gate, toward Deputy Ross.`);G.M=buildMaze();checkpoint()}
}
async function takeLoot(k,it){G.flags[k]=1;G.M=buildMaze();
 if(it==='note'){await say('','A torn page from a Lantern Walk program, from 1958:');await say('','"The Gleaner takes only what is offered. Each family offers its likeness. When the likeness is finished, it is harvested."');await say('','Someone has written underneath in pencil: "it gets weaker when they\'re cut down."');clue('lore','The Gleaner feeds on the scarecrows that look like people. Cutting the victims down weakens it.');return}
 G.items[it]=(G.items[it]||0)+1;await say('',`A dropped backpack. Inside: a ${ITEMS[it].name}.`)}
async function bossIntro(){
 G.flags.bossSeen=1;
 await say('','At the center of the maze something tall is waiting. It is made of every harvest this town ever gave.');
 await say('','Where its face should be, there is a lantern.');
 await say('THE GLEANER','AGENT {code}.');
 await sanCheck(['0','1d3'],'Hearing your name in that voice');
 const left=3-(G.rescued||0);
 await say('THE GLEANER','YOU CAME WITHOUT BEING OFFERED. NO MATTER.');
 await say('THE GLEANER',left?`I HAVE ${left} ALREADY. YOU WILL MAKE ${left+1}.`:'YOU TOOK MY LIKENESSES. THEN I WILL MAKE NEW ONES. FROM YOU.');
 checkpoint();
 const hp=110-22*(G.rescued||0);
 const r=await battle(['gleaner'],{boss:true,hp,intro:'The Gleaner unfolds to its full height!',onStart:async()=>{if(G.rescued)await say('',`It looks thinner than it should. Cutting down ${G.rescued===1?'one victim':G.rescued+' victims'} weakened it.`,{auto:1500})}});
 if(r==='lose')return gameOver();
 G.flags.boss=1;await ending();
}

// ================= ENDING =================
async function ending(){
 await say('','The lantern goes out. The Gleaner comes apart like a sheaf with the twine cut.');
 await say('','In the dark you hear the corn settle, like a held breath let go.');
 const lost=VICTIMS.filter(V=>!G.flags['saved_'+V.id]);
 if(lost.length)await say('',`The scarecrows still on their poles don't breathe anymore. ${lost.map(v=>v.name).join(' and ')} ${lost.length>1?'are':'is'} gone.`);
 await fade(1);G.mode='scene';await fade(0);
 const n=G.rescued||0;
 await say('','Dawn. The Lantern Walk never happens. Nobody in Marrow Creek can say why they canceled it.');
 await say('',n===3?'All three victims walk out of the corn alive. Deputy Ross cries in the cruiser and pretends it\'s allergies.':n?`${n} of 3 victims walk out alive. Deputy Ross drives them to County General without a word.`:'Nobody else comes out of the corn. Deputy Ross looks at your face and doesn\'t ask.');
 await bigHatScene(async()=>{
  await say('BIG HAT','Agent {code}. Read your preliminary. Twice. Once upside down. Tell me what goes in the official one.');
  const c=await ask('BIG HAT','What happened in Marrow Creek?',['Gas leak at the cider mill','Crop fire, nobody hurt','The truth']);
  if(c===0)await say('BIG HAT','Carbon monoxide. Mass hallucination. Cider mill gets condemned. Clean.');
  if(c===1)await say('BIG HAT','Burn the field, call it an accident. Town\'ll thank you and never know why. That\'s the job, partner.');
  if(c===2){await say('BIG HAT','...');await shout('I AM GOING TO WRITE "GAS LEAK."');await say('BIG HAT','You\'re gonna forget you said that. Go home. Hug somebody.')}
  await say('','He slides you a cruller across the desk. It is, somehow, still warm.');
 });
 await fade(0);
 await say('','Sunday. You made it home.');
 const L=lead(),bonds=L.a.bonds||[];L.a.bondDmg=L.a.bondDmg||[];
 const opts=bonds.map(b=>`Spend the day with ${b.name||'them'} (${(b.rel||'').toLowerCase()})`).concat(['Keep it to yourself']);
 const r=await ask('','Who do you lean on?',opts);
 if(r<bonds.length){const g=roll(1,6);L.san=Math.min(L.msan,L.san+g);L.a.bondDmg[r]=(L.a.bondDmg[r]||0)+1;applySan();await say('',`You spend the day with ${bonds[r].name}. You don't talk about Marrow Creek. You laugh at something stupid. It helps. It costs something too.`);await say('',`+${g} SAN. Your bond with ${bonds[r].name} wears a little thinner.`)}
 else{await say('','You sit in the dark kitchen until the sun comes up. You don\'t call anyone.');await say('','No SAN recovered. Your bonds stay intact. For now.')}
 const sq=squad().map(m=>`${m.name}${m.dis?' ('+m.dis+')':''}`).join(', ');
 await say('',`OPERATION STILL HARVEST · CLOSED\nVictims saved: ${n}/3\n${L.name}'s SAN: ${L.san0} → ${L.san}${L.dis?'\nDisorder: '+L.dis:''}\nSquad: ${sq}`);
 await ask('','Your file has been updated.',['Save agent and return to the file']);
 L.a.cur={san:L.san,dis:L.dis,ch1:true,saved:n};
 finish();
}

// ================= ON THE CASE BOARD =================
// A on this card plays caseOpening as Big Hat's briefing (spec 004, step 4; Demo 5 replaces it).
registerCase({id:'still-harvest',card:caseCard,opening:caseOpening});
