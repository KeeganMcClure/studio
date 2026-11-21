// Black Lantern · engine.js
// Game engine: map walking, dialog and menus, sanity, battle, Big Hat scenes, saves, pause, input. Exposes window.BLG.
// Shared by every case. Case content (maps, enemies, scripts, text) lives in cases/<case>.js.
// Loaded as a plain script (no wrapper) so case files can call say, ask, battle, clue, checkpoint and the rest.
const B=window.BL;
const $=s=>document.querySelector(s);
const scr=$('#screen'),gEl=$('#game'),cv=$('#gcv'),cx=cv.getContext('2d');
const dhost=$('#gdlg'),menuEl=$('#gmenu'),hud=$('#ghud'),ban=$('#gban'),fadeEl=$('#gfade'),sanEl=$('#gsan');
const {rnd,pick,esc,store,profOf,derived,skillVal,SKIN,HAIRC,OUTC}=B;
const roll=(n,s,b=0)=>{let t=b;for(let i=0;i<n;i++)t+=1+rnd(s);return t};
const dice=s=>{s=String(s);if(/^\d+$/.test(s))return +s;const m=s.match(/(\d+)d(\d+)/);return roll(+m[1],+m[2])};
const d100=()=>1+rnd(100);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
let VW=240,VH=160;
let G={active:false},Bt=null,party=[],raf=0,dlg=null,menu=null,held=[];
const lead=()=>party[0];
const DIRS=StudioMove.DIRS;  // walking, the camera and the canvas fit are shared: engine/move.js

// ================= DATA =================
const ABIL={
 'Badge Flash':{wp:2,t:'foe',fx:'stun',n:1,skill:'Persuade'},
 'Double Tap':{wp:3,t:'foe',fx:'multi',n:2},
 'Triage':{wp:3,t:'ally',fx:'heal',dice:[2,6,4]},
 'Sedate':{wp:3,t:'foe',fx:'stun',n:2,skill:'Medicine'},
 'Analyze':{wp:2,t:'foe',fx:'mark'},
 'Jury-Rig':{wp:3,t:'foe',fx:'dmg',dice:[2,6,2]},
 'Suppress':{wp:3,t:'none',fx:'blindAll',n:2},
 'Cover':{wp:2,t:'ally',fx:'cover'},
 'Recall Lore':{wp:2,t:'none',fx:'markAll'},
 'Ward':{wp:3,t:'none',fx:'ward'},
 'Overclock':{wp:2,t:'ally',fx:'extra'},
 'Spoof':{wp:2,t:'none',fx:'decoy'},
 'Baton':{wp:2,t:'foe',fx:'hitstun'},
 'Command Voice':{wp:2,t:'none',fx:'taunt'},
 'Patch Up':{wp:2,t:'ally',fx:'heal',dice:[1,8,4],revive:true},
 'Adrenaline':{wp:3,t:'ally',fx:'extra'},
 'Bear Spray':{wp:3,t:'none',fx:'blindAll',n:2},
 'Read the Woods':{wp:2,t:'none',fx:'focus'},
 'Last Rites':{wp:4,t:'none',fx:'sanAll',dice:[1,6,1]},
 'Sermon':{wp:3,t:'none',fx:'stunAll',chance:55},
 'Certified Delivery':{wp:2,t:'ally',fx:'heal',dice:[1,6,2],wp2:2},
 'Dog Sense':{wp:2,t:'foe',fx:'surehit'},
 'Composure':{wp:2,t:'none',fx:'ward'},
 'Final Arrangements':{wp:3,t:'foe',fx:'dmg',dice:[3,6,0]},
 'Mop Sweep':{wp:3,t:'none',fx:'dmgAll',dice:[1,6,1]},
 'Knows the Building':{wp:2,t:'none',fx:'escape'},
 'The Jingle':{wp:3,t:'none',fx:'wpAll',dice:[1,4,1]},
 'Rocket Pop':{wp:2,t:'foe',fx:'dmg',dice:[1,6,1],stun:1},
};
const ITEMS=B.ITEMDEF;
const DIS=BLS.DIS;
const BLOCK=new Set('TCB#DLlPHFSVKkYyNpGWIOX'.split(''));

// ================= HELPERS =================
const fmt=t=>t.replace(/\{code\}/g,lead().a.code||((lead().a.name||'').split(' ').pop()||'?').toUpperCase()).replace(/\{first\}/g,lead().name);
// Weapon from the profession (Bible: Starting kit; dice from Combat numbers). STR 13+ adds +1 Melee damage.
function weaponFor(a){const p=profOf(a),W=B.WEAP[(p&&p.weapon)||'handgun']||B.WEAP.handgun;
 return{name:W.name,skill:clamp(skillVal(a,W.skill)+(W.hit||0),5,99),dmg:W.dmg,bonus:(W.plus||0)+(W.melee&&a.stats.STR>=13?1:0),verb:W.verb}}
function member(a){const d=derived(a),c=a.cur||{};return{a,name:(a.name||'Agent').split(' ')[0].slice(0,9)||'Agent',hp:d.HP,mhp:d.HP,wp:d.WP,mwp:d.WP,san:c.san??d.SAN,msan:d.SAN,san0:c.san??d.SAN,bp:d.BP,dis:c.dis||null,dex:a.stats.DEX,w:weaponFor(a),ko:false,stun:0}}

// ================= TILES =================
const tc={};
function tile(ch,v){const k=ch+v;if(tc[k])return tc[k];const c=document.createElement('canvas');c.width=c.height=16;const x=c.getContext('2d');const p=(a,b,w,h,col)=>{x.fillStyle=col;x.fillRect(a,b,w,h)};drawTile(p,ch,v|0);return tc[k]=c}
function grass(p,v){p(0,0,16,16,'#4f6e35');const s=[[2,3],[9,5],[5,11],[12,12],[13,2],[7,8]];s.forEach(([a,b],i)=>{if((i+v)%3)p((a+v*3)%15,b,1,2,'#6a8a42')});if(v===2)p(10,9,2,1,'#d98a3a')}
function path(p,v){p(0,0,16,16,'#9a7a50');p((v*5)%13+1,4,2,1,'#7e6340');p((v*7)%12+2,11,1,1,'#b8956a');p(4,(v*3)%12+2,1,1,'#7e6340')}
function floor(p,v){p(0,0,16,16,'#4b3824');p((v*5)%13+1,5,2,1,'#5e4630');p((v*3)%13+2,12,1,1,'#3a2a1a');p(9,(v*7)%13+1,1,2,'#5e4630')}
function drawTile(p,ch,v){
 switch(ch){
 case '.':grass(p,v);break;
 case ',':path(p,v);break;
 case 'M':case 'X':floor(p,v);break;
 case 'T':{grass(p,0);p(7,10,2,6,'#4a3020');const col=['#c8572a','#d99a2b','#7a8a2a'][v%3],hi=['#e07a3a','#efc04a','#9aaa3a'][v%3];p(2,2,12,9,col);p(1,4,14,5,col);p(4,0,8,2,col);p(4,2,3,2,hi);p(9,5,2,2,hi);p(3,9,10,2,'rgba(0,0,0,.25)');break}
 case 'C':{p(0,0,16,16,'#2c2112');for(let i=0;i<4;i++){const xx=1+i*4;p(xx,0,2,16,i%2?'#a8892f':'#bf9f3c');p(xx+(i%2?-1:2),4+i*2,2,1,'#7a6a22');p(xx,i%2?1:0,2,2,'#e0c25a')}break}
 case 'B':{p(0,0,16,16,'#7a3b2e');for(let y=0;y<16;y+=4){p(0,y,16,1,'#5e2c22');p((y*3)%8,y+1,1,3,'#5e2c22');p((y*3)%8+8,y+1,1,3,'#5e2c22')}break}
 case '#':{p(0,0,16,16,'#cdb88f');p(0,5,16,1,'#ad9a72');p(0,10,16,1,'#ad9a72');if(v%2){p(4,3,8,7,'#2a2440');p(5,4,6,5,'#ffcf6a');p(7,4,1,5,'#2a2440');p(5,6,6,1,'#2a2440')}p(0,15,16,1,'#6b5a3a');break}
 case 'D':{p(0,0,16,16,'#cdb88f');p(3,2,10,14,'#4a2f1f');p(4,3,8,6,'#5e3c26');p(10,10,2,2,'#f2c94c');break}
 case 'L':case 'l':{ch==='l'?floor(p,v):grass(p,v);p(7,5,2,11,'#2b2b33');p(4,0,8,1,'#2b2b33');p(4,1,8,5,'#ffcf5a');p(5,2,6,3,'#fff1c2');p(6,6,4,1,'#2b2b33');break}
 case 'P':{grass(p,v);p(3,7,10,8,'#e07b26');p(2,9,12,4,'#e07b26');p(7,7,1,8,'#b85e16');p(4,8,1,6,'#b85e16');p(11,8,1,6,'#b85e16');p(7,5,2,2,'#4a6b2a');p(5,10,2,1,'#3a1a08');p(9,10,2,1,'#3a1a08');p(6,12,4,1,'#3a1a08');break}
 case 'H':{grass(p,v);p(1,5,14,10,'#d9b552');p(1,8,14,1,'#b8963a');p(1,12,14,1,'#b8963a');p(3,4,2,1,'#e8cc6a');break}
 case 'F':{grass(p,v);p(0,6,16,2,'#8a6a42');p(0,11,16,2,'#8a6a42');p(2,4,2,12,'#6b4a2a');p(10,4,2,12,'#6b4a2a');break}
 case 'S':case 'V':{const base=ch==='S';base?grass(p,v):floor(p,v);const sh=['#6b4a8a','#c0392b','#2d5a8a','#4a7a3a'][v%4];p(7,4,2,12,'#5a3e2b');p(1,6,14,2,'#5a3e2b');p(4,5,8,7,sh);p(2,6,2,3,'#e0c25a');p(12,6,2,3,'#e0c25a');p(5,0,6,6,'#d9c08a');p(6,2,1,1,'#2a1a10');p(9,2,1,1,'#2a1a10');p(6,4,4,1,'#2a1a10');if(base){p(4,0,8,1,'#3a2a1a');p(5,-1,6,1,'#3a2a1a')}else{p(6,10,4,1,'rgba(255,255,255,.25)')}break}
 case 'K':{path(p,v);p(1,5,15,8,'#e8e8e8');p(1,8,15,3,'#1b1b2a');p(4,5,10,3,'#5a7ab0');p(12,3,4,2,'#d33');p(3,12,4,4,'#111');break}
 case 'k':{path(p,v);p(0,5,15,8,'#e8e8e8');p(0,8,15,3,'#1b1b2a');p(2,5,8,3,'#5a7ab0');p(0,3,4,2,'#35f');p(9,12,4,4,'#111');break}
 case 'Y':case 'y':{path(p,v);for(let i=0;i<4;i++)p(i*4,1,4,4,i%2?'#f4f1e8':'#c0392b');p(0,8,16,7,'#8a5a2b');p(0,8,16,1,'#a8743a');p(ch==='Y'?3:9,5,3,3,'#e0a030');p(ch==='Y'?2:13,2,1,6,'#5a3e2b');break}
 case 'N':{path(p,v);p(2,9,2,7,'#5a3e2b');p(12,9,2,7,'#5a3e2b');p(0,1,16,9,'#7a5a3a');p(1,2,4,6,'#f4f4f4');p(6,3,4,6,'#f4f4f4');p(11,2,4,6,'#f4f4f4');p(2,3,2,2,'#ff7a1a');p(7,4,2,2,'#ff7a1a');p(12,3,2,2,'#ff7a1a');break}
 case 'p':{path(p,v);p(1,4,14,12,'#6b4a2a');p(1,4,14,1,'#8a6a42');p(3,7,10,4,'#c0392b');p(5,8,6,2,'#f2c94c');break}
 case 'W':{grass(p,v);p(3,9,2,7,'#5a3e2b');p(11,9,2,7,'#5a3e2b');p(0,2,16,8,'#e8dcc0');p(2,4,12,1,'#3a2a1a');p(2,6,9,1,'#3a2a1a');p(11,6,3,1,'#ff7a1a');break}
 case 'G':{path(p,v);p(0,2,16,2,'#7a5a3a');p(0,8,16,2,'#7a5a3a');p(0,13,16,2,'#7a5a3a');p(2,1,2,15,'#5a3e2b');p(12,1,2,15,'#5a3e2b');p(6,5,4,5,'#9aa0a6');p(7,6,2,3,'#4a4a52');break}
 case 'I':{floor(p,v);p(4,6,8,8,'#3e5c8a');p(4,6,8,3,'#2d4569');p(7,9,2,2,'#c9c9c9');break}
 case 'O':{floor(p,v);p(4,7,8,6,'#e8e2d0');p(5,8,6,1,'#7a6a5a');p(5,10,5,1,'#7a6a5a');break}
 default:p(0,0,16,16,'#000');
 }
}

// ================= SPRITES =================
// Townsfolk only (old 16 x 16 look until the Still Harvest rebuild). Agents use agent-sprite.js.
function drawChar(x,y,look,oc,dir,f,o={}){
 const P=(a,b,w,h,c)=>{cx.fillStyle=c;cx.fillRect(x+a,y+b,w,h)};
 const sk=SKIN[look.skin],hc=HAIRC[look.hairC],bob=f?1:0;
 P(3,14,10,2,'rgba(0,0,0,.3)');
 P(5,12,2,3-(f===1?1:0),'#2a2433');P(9,12,2,3-(f===2?1:0),'#2a2433');
 P(4,7+bob,8,6-bob,oc);P(3,8+bob,1,4,oc);P(12,8+bob,1,4,oc);P(3,12,1,1,sk);P(12,12,1,1,sk);
 if(o.sack){P(4,0+bob,8,8,'#c9a36a');P(4,7+bob,8,1,'#8a6a2a');if(dir!=='up'){P(5,3+bob,2,2,'#111');P(9,3+bob,2,2,'#111');P(5,6+bob,6,1,'#2a1a10')}return}
 P(4,1+bob,8,7,sk);
 if(look.hair!==3&&look.hair!==2){P(4,0+bob,8,2,hc);if(dir==='up')P(4,1+bob,8,5,hc);if(look.hair===1||look.hair===6){P(3,1+bob,1,6,hc);P(12,1+bob,1,6,hc)}if(look.hair===4)P(6,-2+bob,4,2,hc);if(look.hair===5){P(7,-2+bob,2,3,hc)}}
 else if(look.hair===2)P(4,0+bob,8,1,hc);
 const E='#120c1c';
 if(dir==='down'){P(6,4+bob,1,2,E);P(9,4+bob,1,2,E);if(look.acc===1||look.acc===2){P(5,4+bob,6,1,E)}if(look.acc===3)P(4,6+bob,8,2,hc)}
 else if(dir==='left'){P(5,4+bob,1,2,E);if(look.acc===3)P(4,6+bob,4,2,hc)}
 else if(dir==='right'){P(10,4+bob,1,2,E);if(look.acc===3)P(8,6+bob,4,2,hc)}
 if(o.hat)P(3,0+bob,10,2,o.hat);
}
function drawEnemy(t,x,y,tm,e){
 if(e&&e.flash>0&&(e.flash%4)<2)return;
 const sx=e&&e.shake?(Math.random()*4-2):0;x=Math.round(x+sx);y=Math.round(y);
 const P=(a,b,w,h,c)=>{cx.fillStyle=c;cx.fillRect(x+a,y+b,w,h)};
 const f=Math.floor(tm/10)%2;
 if(t==='crow'){P(-8,-6,16,10,'#151018');P(-7,-10,9,6,'#151018');P(-5,-9,2,2,'#ff8a1e');P(-12,-8,5,2,'#d9a43a');if(f)P(-2,-15,12,7,'#251d2e');else P(0,-4,15,4,'#251d2e');P(8,-3,7,3,'#151018');P(-2,4,1,5,'#d9a43a');P(2,4,1,5,'#d9a43a')}
 else if(t==='husk'){P(-6,-17,12,4,'#3e5c3a');P(-8,-13,15,1,'#2d4429');P(-6,-13,12,10,'#c9a36a');P(-4,-10,2,2,'#2a1a10');P(2,-10,2,2,'#2a1a10');P(-3,-6,6,1,'#2a1a10');P(-9,-12,3,4,'#e0c25a');P(6,-11,3,4,'#e0c25a');P(-7,-3,14,12,'#b59a5a');P(-3,-3,6,4,'#c0392b');P(3,1,2,2,'#f2c94c');P(-10,-2+f,3,9,'#b59a5a');P(-10,7+f,3,3,'#e0c25a');P(7,-2,3,9,'#b59a5a');P(7,7,3,3,'#e0c25a');P(-5,9,4,8,'#4b4b3a');P(1,9,4,8,'#4b4b3a')}
 else if(t==='hound'){P(-15,-6,28,12,'#d9b552');for(let i=-13;i<12;i+=5)P(i,-6,1,12,'#b8963a');P(10,-13,11,10,'#d9b552');P(16,-10,2,2,'#ff3b3b');P(12,-3,9,3,'#6a4a1a');P(13,-3,1,2,'#fff');P(16,-3,1,2,'#fff');P(19,-3,1,2,'#fff');P(-12,6,3,7-f,'#b8963a');P(-6,6,3,6+f,'#b8963a');P(3,6,3,7-f,'#b8963a');P(8,6,3,6+f,'#b8963a');P(-19,-9,5,3,'#e0c25a')}
 else if(t==='long'){const s=Math.round(Math.sin(tm*.04)*2);P(-9+s,-46,18,2,'#1b1414');P(-5+s,-54,10,8,'#1b1414');P(-5+s,-44,10,11,'#d9c8a0');P(-3+s,-41,1,1,'#000');P(2+s,-41,1,1,'#000');P(-1+s,-37,2,4,'#000');P(-4,-33,8,32,'#4a3a2e');P(-11,-32,7,28,'#4a3a2e');P(4,-32,7,28,'#4a3a2e');P(-11,-4,7,5,'#e0c25a');P(4,-4,7,5,'#e0c25a');P(-4,-1,3,18,'#2e241c');P(1,-1,3,18,'#2e241c')}
 else if(t==='vol'){P(-7,-24,14,13,'#c9a36a');P(-4,-20,2,2,'#000');P(2,-20,2,2,'#000');P(-5,-16,10,1,'#2a1a10');P(-6,-17,1,1,'#2a1a10');P(5,-17,1,1,'#2a1a10');P(-7,-12,14,1,'#8a6a2a');P(-8,-11,16,17,'#e8dcc0');P(-8,-11,5,17,'#ff7a1a');P(3,-11,5,17,'#ff7a1a');P(-8,-4,5,2,'#e6e6e6');P(3,-4,5,2,'#e6e6e6');P(-11,-10,3,12,'#ff7a1a');P(-11,2,3,3,'#e0c25a');P(8,-10,3,10,'#ff7a1a');P(9,-2+f,7,9,'#a07a4a');P(10,-1+f,5,7,'#f4f4f4');P(-6,6,5,12,'#3b4a6b');P(1,6,5,12,'#3b4a6b')}
 else if(t==='gleaner'){
  const ph2=Bt&&Bt.phase===2,fl=.55+.35*Math.sin(tm*.18)+Math.random()*.1;
  const g=cx.createRadialGradient(x,y-50,4,x,y-50,60);g.addColorStop(0,ph2?`rgba(255,255,240,${.45*fl})`:`rgba(255,190,80,${.4*fl})`);g.addColorStop(1,'rgba(255,150,40,0)');cx.fillStyle=g;cx.fillRect(x-60,y-110,120,120);
  for(let i=0;i<14;i++)P(-6-i*2,-34+i*5,12+i*4,5,i%2?'#4a3a18':'#3a2c10');
  for(let k=0;k<11;k++)P(-33+k*6,36+(k%2)*3,2,9,'#8a7030');
  P(-36,-18+f,8,30,'#3a2c10');P(-44,10+f,12,2,'#c8c8d4');P(-46,4+f,2,8,'#c8c8d4');P(28,-18-f,8,30,'#3a2c10');P(32,10-f,12,2,'#c8c8d4');P(44,4-f,2,8,'#c8c8d4');
  if(ph2){for(let k=0;k<6;k++)P(-18+k*7,-8+(k%3)*9,2,1,'#ff3b3b')}
  P(-3,-42,6,8,'#2a1f0a');P(-10,-64,20,23,'#1b1414');P(-8,-61,16,17,ph2?`rgba(255,255,230,${fl})`:`rgba(255,${170+rnd(30)},70,${fl})`);P(-2,-57,4,9,'#fff3c2');P(-6,-68,12,4,'#1b1414');P(-2,-72,4,4,'#1b1414');P(-10,-53,20,1,'#1b1414');
 }
}

// ================= MAPS =================
const mk=(w,h,f)=>Array.from({length:h},()=>Array(w).fill(f));
const rect=(g,x,y,w,h,c)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(g[j]&&g[j][i]!==undefined)g[j][i]=c};
async function stepBack(){const [dx,dy]=DIRS[G.dir];if(passable(G.x+dx,G.y+dy)){G.x+=dx;G.y+=dy;G.px=G.x*16;G.py=G.y*16}}

function mulberry(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}

// ================= DIALOG / MENU =================
// Lantern Bust box (dialog.js, copied unchanged from the Asset Library). `box` holds what the box shows;
// drawBox() runs every frame and redraws the box only when something visible changed.
let box=null,boxKey='';
const PORTRAITS={'BIG HAT':(c,f,sh)=>drawBigHatPortrait(c,sh,f)}; // speaker name -> (ctx, frame, shouting) 64 x 64
function say(name,text,o={}){
 return new Promise(res=>{
  if(dlg)clearTimeout(dlg.to);
  text=fmt(text);
  dlg={res,text,done:false,keep:o.keep,auto:o.auto};
  box={name:name||'',text,typed:0,more:false};
  if(o.instant||o.keep&&o.instant!==false&&Bt){finishType();return}
  typeNext(dlg);
 });
}
// typewriter at the Library's timing: one letter per letterMs, longer stops after . ! ? and , ; :
function typeNext(d){
 if(dlg!==d||d.done)return;
 box.typed++;if(box.typed>=d.text.length){finishType();return}
 const T=BLD.TIMING,ch=d.text[box.typed-1],nx=d.text[box.typed];
 d.to=setTimeout(()=>typeNext(d),T.letterMs+(/[.!?]/.test(ch)&&!/[.!?]/.test(nx)?T.stopMs:/[,;:]/.test(ch)?T.commaMs:0));
}
function finishType(){const d=dlg;clearTimeout(d.to);d.done=true;box.typed=d.text.length;
 if(d.keep){dlg=null;d.res()}else{box.more=true;if(d.auto)d.to=setTimeout(()=>{if(dlg===d)closeDlg()},d.auto)}}
function closeDlg(){const d=dlg;dlg=null;clearTimeout(d.to);box=null;d.res()}
function hideTB(){box=null}
function drawBox(){
 if(!box){if(boxKey){dhost.replaceChildren();boxKey=''}return}
 const T=BLD.TIMING,now=performance.now(),n=Math.floor(now/T.flapMs);
 const typing=box.typed<box.text.length,por=PORTRAITS[box.name],sh=!!(G.shoutPor&&por);
 // mouth: bursts of open/shut while the line types, then shut; shout face: its counter runs while typing, then holds
 if(typing)box.n=n;const p=n%(T.burst+T.rest),f=sh?(box.n||0):(typing&&p<T.burst&&p%2===0?1:0);
 const arrow=box.more&&Math.floor(now/T.moreBlinkMs)%2===0;
 const key=[box.name,box.typed,box.text,box.choices?box.choices.join('|')+'#'+box.sel:'',arrow,por?f+':'+sh:'',gEl.clientWidth].join('~');
 if(key===boxKey)return;boxKey=key;
 const b=BLD.render(dhost,{name:box.name,narrate:!box.name,text:box.text,typed:box.choices?null:box.typed,more:arrow,choices:box.choices,sel:box.sel,
  portrait:por&&(c=>por(c,f,sh)),scale:2});
 // long choice lists scroll inside the box so the box never pushes the portrait off the screen
 const ul=b.querySelector('.bld-c');
 if(ul){const bust=b.querySelector('.bld-bust'),room=gEl.clientHeight-(bust?bust.offsetHeight:b.querySelector('.bld-tab')?18:0)-(b.offsetHeight-ul.offsetHeight)-10;
  ul.style.maxHeight=Math.max(60,room)+'px';const on=ul.querySelector('.on');
  if(on){if(on.offsetTop<ul.scrollTop)ul.scrollTop=on.offsetTop;else if(on.offsetTop+on.offsetHeight>ul.scrollTop+ul.clientHeight)ul.scrollTop=on.offsetTop+on.offsetHeight-ul.clientHeight}}
 posMenu();
}
function renderMenu(){const m=menu;if(!m)return;
 if(m.inBox){if(box){box.choices=m.items.map(it=>typeof it==='string'?it:it.label);box.sel=m.sel;box.more=false}if(m.onSel)m.onSel(m.sel);return}
 menuEl.hidden=false;
 menuEl.innerHTML=(m.title?`<div class="mt">${esc(m.title)}</div>`:'')+m.items.map((it,i)=>{const o=typeof it==='string'?{label:it}:it;return`<div class="gi ${i===m.sel?'on':''} ${o.dis?'dis':''}" data-i="${i}"><span class="gc">${i===m.sel?'▶':''}</span>${esc(o.label)}</div>`}).join('')+(m.desc&&m.desc[m.sel]?`<div class="md">${esc(m.desc[m.sel])}</div>`:'');
 if(m.onSel)m.onSel(m.sel);posMenu();const on=menuEl.querySelector('.gi.on');if(on)on.scrollIntoView({block:'nearest'})}
function posMenu(){if(menuEl.hidden)return;let b=6;const bx=dhost.querySelector('.bld'),tab=bx&&bx.querySelector('.bld-tab');
 if(G.mode==='battle'&&!hud.hidden)b=hud.offsetHeight+8;else if(bx)b=bx.offsetHeight+(tab?tab.offsetHeight:0)+10;menuEl.style.bottom=b+'px'}
function choose(items,o={}){return new Promise(res=>{menu={items,sel:o.sel||0,res,cancel:o.cancel,title:o.title,desc:o.desc,onSel:o.onSel,inBox:o.inBox};renderMenu()})}
function closeMenu(v){const m=menu;menu=null;menuEl.hidden=true;if(m.inBox&&box)box.choices=null;if(Bt)Bt.hover=-1;m.res(v)}
async function ask(name,text,opts){await say(name,text,{keep:true,instant:false});const r=await choose(opts,{cancel:true,inBox:true});hideTB();return r<0?opts.length-1:r}
function banner(t){ban.textContent=t;ban.hidden=false;clearTimeout(banner.t);banner.t=setTimeout(()=>ban.hidden=true,2200)}
function fade(on){fadeEl.style.opacity=on?1:0;return sleep(340)}
async function run(fn){G.busy=(G.busy||0)+1;try{await fn()}catch(e){console.error(e)}finally{G.busy--}}
function clue(id,text){if(G.clues.some(c=>c.id===id))return;G.clues.push({id,text});banner('NOTEBOOK UPDATED')}

// ================= SANITY =================
function applySan(){const m=lead();if(!m)return;const fr=clamp(m.san/m.msan,0,1),f=1-fr;
 scr.style.filter=f>.05?`hue-rotate(${(-f*80).toFixed(0)}deg) saturate(${(1+f*1.5).toFixed(2)}) contrast(${(1+f*.3).toFixed(2)})`:'';
 $('#vig').style.opacity=(Math.max(0,f-.1)*1.05).toFixed(2);scr.classList.toggle('glitch',fr<.4);
 sanEl.innerHTML=`SAN <b class="${fr<.4?'red':''}">${m.san}</b>`;}
async function sanCheck(spec,label,who){
 if(Bt&&Bt.ward){Bt.ward=false;await say('',`${label}... but the ward holds. No one loses SAN.`,{auto:1100});return}
 const parts=[];(who||party).forEach(m=>{const r=d100(),loss=r<=m.san?dice(spec[0]):dice(spec[1]);m.san=Math.max(0,m.san-loss);if(loss)parts.push(`${m.name} -${loss}`)});
 applySan();if(Bt)updHUD();
 await say('',`${label}. `+(parts.length?'SAN: '+parts.join(', ')+'.':'Everyone keeps it together.'),{auto:1400});
 for(const m of party){if(m.san<=m.bp&&!m.dis&&m.san>0){m.dis=pick(DIS);await say('',`${m.name} hits a breaking point. Something cracks for good. New disorder: ${m.dis}.`,{auto:1800})}}
}
const hitPenalty=m=>m.dis?10:0;

// ================= BATTLE =================
function updHUD(){hud.innerHTML=party.map(m=>`<div class="hb ${Bt&&m===Bt.active?'on':''} ${m.ko?'ko':''}"><div class="nm">${esc(m.name)}</div><div>HP <b class="${m.hp<=m.mhp/3?'red':''}">${m.hp}</b>/${m.mhp}</div><div>WP ${m.wp} <span class="sn">S${m.san}</span></div></div>`).join('')}
function nameEnemies(en){const c={};en.forEach(e=>c[e.base]=(c[e.base]||0)+1);const s={};en.forEach(e=>{if(c[e.base]>1){s[e.base]=(s[e.base]||0)+1;e.name=e.base+' '+'ABC'[s[e.base]-1]}else e.name=e.base})}
async function battle(types,o={}){
 held=[];G.mode='battle';gEl.classList.add('battle');
 const en=types.map((t,i)=>({...EN[t],t,base:EN[t].name,hp:o.hp&&i===0?o.hp:EN[t].hp,mhp:o.hp&&i===0?o.hp:EN[t].hp,stun:0,blind:0,mark:false,dead:false,flash:0,alpha:1}));
 nameEnemies(en);
 Bt={en,bg:o.bg||G.M.bg,t:0,boss:!!o.boss,phase:1,focus:0,ward:false,decoy:false,taunt:null,hover:-1,active:null,floaties:[],queue:[]};
 party.forEach(m=>{m.defend=false;m.covering=null;m.stun=0});
 hud.hidden=false;updHUD();
 await sleep(250);
 await say('',o.intro||`${en.map(e=>e.name).join(', ')} ${en.length>1?'close in':'appears'}!`,{auto:1000});
 for(const t of [...new Set(types)])await sanCheck(EN[t].san,`Seeing ${/^The /.test(EN[t].name)?EN[t].name:'the '+EN[t].name}`);
 if(lead().san<=0)return endBattle('lose');
 if(o.onStart)await o.onStart();
 for(;;){
  Bt.queue=[...party.filter(m=>!m.ko),...en.filter(e=>!e.dead)].map(a=>({a,i:a.dex+rnd(5)})).sort((x,y)=>y.i-x.i).map(x=>x.a);
  while(Bt.queue.length){
   const a=Bt.queue.shift();if(a.dead||a.ko)continue;
   if(a.a){const r=await memberTurn(a);if(r==='flee')return endBattle('flee')}else await enemyTurn(a);
   if(lead().ko||lead().san<=0)return endBattle('lose');
   if(en.every(e=>e.dead))return endBattle('win');
  }
  if(Bt.focus>0)Bt.focus--;en.forEach(e=>{if(e.blind>0)e.blind--});Bt.taunt=null;
  if(Bt.boss&&Bt.phase===1&&en[0].hp<=en[0].mhp/2){Bt.phase=2;await say('','The lantern flares white. The corn leans in to listen. The Gleaner moves faster now.',{auto:1800})}
 }
}
async function endBattle(res){
 Bt.active=null;updHUD();
 if(res==='win'){
  await say('','You survived. For now.',{auto:900});
  party.forEach(m=>{if(m.ko){m.ko=false;m.hp=1}m.wp=Math.min(m.mwp,m.wp+2)});
  if(!Bt.boss&&Math.random()<.35){const it=pick(['aid','coffee','aid']);G.items[it]=(G.items[it]||0)+1;await say('',`You find a ${ITEMS[it].name} in the straw.`,{auto:1100})}
  G.fights=(G.fights||0)+1;
 }
 hud.hidden=true;gEl.classList.remove('battle');Bt=null;G.mode='world';hideTB();return res;
}
function aliveFoes(){return Bt.en.filter(e=>!e.dead)}
async function pickFoe(){const f=aliveFoes();if(f.length===1)return f[0];const r=await choose(f.map(e=>`${e.name}${e.mark?' ★':''}`),{cancel:true,title:'TARGET',onSel:i=>{Bt.hover=Bt.en.indexOf(f[i])}});return r<0?null:f[r]}
async function pickAlly(o={}){const r=await choose(party.map(m=>({label:`${m.name}  ${m.ko?'DOWN':m.hp+'/'+m.mhp}`,dis:o.noKO&&m.ko})),{cancel:true,title:o.title||'WHO?'});return r<0?null:party[r]}
function floaty(e,txt,col){const i=Bt.en.indexOf(e),n=Bt.en.length,x=VW/(n+1)*(i+1);Bt.floaties.push({x,y:VH*.42-20,txt:String(txt),t:0,col:col||'#fff'})}
async function hurtEnemy(e,d){e.hp=Math.max(0,e.hp-d);e.flash=16;floaty(e,d);if(e.hp<=0&&!e.dead){e.dead=true;await say('',`${e.name} ${e.die}.`,{auto:900})}}
async function attack(m,e,o={}){
 const w=m.w,sk=clamp(w.skill+(Bt.focus?20:0)-hitPenalty(m),5,99),r=d100();
 if(o.sure||r<=sk){let dmg=roll(w.dmg[0],w.dmg[1],w.bonus);const crit=!o.sure&&r<=Math.max(1,Math.floor(sk/10));if(crit)dmg*=2;if(e.mark)dmg=Math.ceil(dmg*1.5);
  await say('',`${m.name} ${w.verb}! ${crit?'CRITICAL! ':''}${o.sure?'':`(${r} vs ${sk}) `}${e.name} takes ${dmg}.`,{auto:1000});await hurtEnemy(e,dmg);return true}
 await say('',`${m.name} ${w.verb}... and misses. (${r} vs ${sk})`,{auto:950});return false}
async function memberTurn(m){
 m.defend=false;m.covering=null;Bt.active=m;updHUD();
 if(m.stun>0){m.stun--;await say('',`${m.name} is frozen and can't act.`,{auto:900});return}
 for(;;){
  await say('',`What will ${m.name} do?`,{keep:true,instant:true});
  const nAb=profOf(m.a).abil,itc=Object.values(G.items).reduce((a,b)=>a+b,0);
  const c=await choose(['Attack','Skill','Item'+(itc?'':' (none)'),'Defend',{label:'Run',dis:Bt.boss}],{title:m.name.toUpperCase()+` · ${m.w.name}`});
  hideTB();
  if(c===0){const e=await pickFoe();if(!e)continue;await attack(m,e);return}
  if(c===1){const s=await choose(nAb.map(x=>({label:`${x[0]} (${ABIL[x[0]].wp} WP)`,dis:m.wp<ABIL[x[0]].wp})),{cancel:true,title:`SKILL · ${m.wp} WP`,desc:nAb.map(x=>x[1])});if(s<0)continue;const r=await useAbil(m,nAb[s][0]);if(r===false)continue;if(r==='flee')return'flee';return}
  if(c===2){const r=await itemMenu(m,true);if(r===false)continue;return}
  if(c===3){m.defend=true;await say('',`${m.name} braces and watches the dark.`,{auto:800});return}
  if(c===4){if(Math.random()<.6){await say('','You back away into the corn. You get away!',{auto:1000});return'flee'}await say('','There\'s nowhere to run!',{auto:900});return}
 }
}
async function useAbil(m,name){
 const A=ABIL[name];let tgt=null;
 if(A.t==='foe'){tgt=await pickFoe();if(!tgt)return false}
 if(A.t==='ally'){tgt=await pickAlly({title:name.toUpperCase(),noKO:!A.revive});if(!tgt)return false;if(A.fx==='extra'&&(tgt===m))return false}
 m.wp-=A.wp;updHUD();
 const fx=A.fx;
 if(fx==='stun'){const sk=skillVal(m.a,A.skill),r=d100();if(r<=sk){tgt.stun+=A.n;await say('',`${m.name} uses ${name}! (${r} vs ${sk}) ${tgt.name} is stunned.`,{auto:1100})}else await say('',`${m.name} uses ${name}... it doesn't take. (${r} vs ${sk})`,{auto:1100})}
 else if(fx==='multi'){for(let i=0;i<A.n&&!tgt.dead;i++)await attack(m,tgt)}
 else if(fx==='heal'){const h=roll(A.dice[0],A.dice[1],A.dice[2]);if(tgt.ko){tgt.ko=false;tgt.hp=Math.min(tgt.mhp,h);await say('',`${m.name} gets ${tgt.name} back on their feet! (+${h} HP)`,{auto:1100})}else{tgt.hp=Math.min(tgt.mhp,tgt.hp+h);if(A.wp2)tgt.wp=Math.min(tgt.mwp,tgt.wp+A.wp2);await say('',`${m.name} uses ${name}. ${tgt.name} recovers ${h} HP${A.wp2?' and '+A.wp2+' WP':''}.`,{auto:1100})}}
 else if(fx==='mark'){tgt.mark=true;await say('',`${m.name} studies ${tgt.name} and finds the weak seam. It takes extra damage now. ★`,{auto:1300})}
 else if(fx==='markAll'){aliveFoes().forEach(e=>e.mark=true);await say('',`${m.name} remembers an old woodcut of things like these. Every foe takes extra damage now. ★`,{auto:1400})}
 else if(fx==='dmg'){const d=roll(A.dice[0],A.dice[1],A.dice[2]);await say('',`${m.name} uses ${name}! ${tgt.name} takes ${d}.`,{auto:1000});if(A.stun){tgt.stun+=A.stun}await hurtEnemy(tgt,tgt.mark?Math.ceil(d*1.5):d)}
 else if(fx==='surehit'){await attack(m,tgt,{sure:true})}
 else if(fx==='hitstun'){const hit=await attack(m,tgt);if(hit&&!tgt.dead){tgt.stun+=1;await say('',`${tgt.name} is stunned.`,{auto:800})}}
 else if(fx==='blindAll'){aliveFoes().forEach(e=>e.blind=A.n);await say('',`${m.name} uses ${name}! The enemies can barely see straight.`,{auto:1100})}
 else if(fx==='cover'){m.covering=tgt;await say('',`${m.name} steps in front of ${tgt.name}.`,{auto:900})}
 else if(fx==='ward'){Bt.ward=true;await say('',`${m.name} steadies everyone. The next horror won't touch your minds.`,{auto:1200})}
 else if(fx==='extra'){Bt.queue.unshift(tgt);await say('',`${m.name} uses ${name}! ${tgt.name} acts next.`,{auto:1000})}
 else if(fx==='decoy'){Bt.decoy=true;await say('',`${m.name} rigs a phone to play footsteps in the corn. Decoy set.`,{auto:1100})}
 else if(fx==='taunt'){Bt.taunt=m;m.defend=true;await say('',`${m.name} bellows. Every eye turns toward them.`,{auto:1000})}
 else if(fx==='focus'){Bt.focus=2;await say('',`${m.name} reads the ground and calls out where they'll come from. Party +20 to hit for 2 rounds.`,{auto:1400})}
 else if(fx==='sanAll'){const parts=party.map(p=>{const g=roll(A.dice[0],A.dice[1],A.dice[2]);p.san=Math.min(p.msan,p.san+g);return`${p.name} +${g}`});applySan();await say('',`${m.name} speaks old words of comfort. SAN: ${parts.join(', ')}.`,{auto:1500})}
 else if(fx==='stunAll'){let n=0;aliveFoes().forEach(e=>{if(rnd(100)<A.chance){e.stun+=1;n++}});await say('',`${m.name} preaches into the dark. ${n?n+' of them hesitate.':'Nothing listens.'}`,{auto:1200})}
 else if(fx==='dmgAll'){await say('',`${m.name} uses ${name}!`,{auto:700});for(const e of aliveFoes()){const d=roll(A.dice[0],A.dice[1],A.dice[2]);await hurtEnemy(e,e.mark?Math.ceil(d*1.5):d)}}
 else if(fx==='escape'){if(Bt.boss){party.forEach(p=>p.defend=true);await say('',`${m.name} pulls everyone behind a hay wagon. The party braces.`,{auto:1200})}else{await say('',`${m.name} knows a gap in the corn. You slip away.`,{auto:1100});return'flee'}}
 else if(fx==='wpAll'){const parts=party.map(p=>{const g=roll(A.dice[0],A.dice[1],A.dice[2]);p.wp=Math.min(p.mwp,p.wp+g);return`${p.name} +${g}`});await say('',`${m.name} hums the ice cream song. It shouldn't help. It does. WP: ${parts.join(', ')}.`,{auto:1500})}
 updHUD();
}
async function itemMenu(m,inBattle){
 const keys=Object.keys(G.items).filter(k=>G.items[k]>0);if(!keys.length){await say('','You have nothing useful.',{auto:inBattle?800:0});return false}
 const r=await choose(keys.map(k=>({label:`${ITEMS[k].name} x${G.items[k]}`,dis:!inBattle&&ITEMS[k].battle})),{cancel:true,title:'ITEMS',desc:keys.map(k=>ITEMS[k].desc)});if(r<0)return false;const k=keys[r];
 if(k==='aid'){const t=await pickAlly({title:'HEAL WHO?'});if(!t)return false;const h=roll(1,8,3);if(t.ko){t.ko=false;t.hp=Math.min(t.mhp,h)}else t.hp=Math.min(t.mhp,t.hp+h);G.items.aid--;await say('',`${t.name} is patched up. +${h} HP.`,{auto:inBattle?1000:0})}
 else if(k==='coffee'){const t=await pickAlly({title:'WHO DRINKS?',noKO:true});if(!t)return false;const g=roll(1,4,1);t.wp=Math.min(t.mwp,t.wp+g);G.items.coffee--;await say('',`${t.name} drinks gas-station coffee. +${g} WP.`,{auto:inBattle?1000:0})}
 else if(k==='flare'){const e=await pickFoe();if(!e)return false;G.items.flare--;const d=roll(2,6,2);await say('',`${m.name} lights a road flare and jams it into the straw! ${e.name} takes ${d}.`,{auto:1100});await hurtEnemy(e,d)}
 else if(k==='bell'){G.items.bell--;aliveFoes().forEach(e=>e.stun+=1);await say('',`${m.name} rings the church handbell. BONNNG. Every foe flinches and freezes.`,{auto:1300})}
 else if(k==='salts'){const t=await pickAlly({title:'WHO?',noKO:true});if(!t)return false;const g=roll(1,4);t.san=Math.min(t.msan,t.san+g);G.items.salts--;applySan();await say('',`${t.name} takes a sharp breath of smelling salts. The world snaps back into focus. +${g} SAN.`,{auto:inBattle?1200:0})}
 else if(k==='tape'){const t=await pickAlly({title:'PATCH WHO?',noKO:true});if(!t)return false;const h=roll(1,4,1);t.hp=Math.min(t.mhp,t.hp+h);G.items.tape--;await say('',`${t.name} gets taped up. It's not pretty. +${h} HP.`,{auto:inBattle?1000:0})}
 else if(k==='tranq'){const e=await pickFoe();if(!e)return false;G.items.tranq--;e.stun+=2;await say('',`${m.name} jabs a tranquilizer into ${e.name}. It sways and goes still.`,{auto:1100})}
 else if(k==='spray'){G.items.spray--;aliveFoes().forEach(e=>e.blind=Math.max(e.blind,2));await say('',`${m.name} empties the pepper spray. The enemies can barely see.`,{auto:1100})}
 if(inBattle)updHUD();return true;
}
async function enemyTurn(e){
 if(e.stun>0){e.stun--;await say('',`${e.name} is stunned.`,{auto:800});return}
 const n=Bt.boss&&e.t==='gleaner'&&Bt.phase===2?2:1;
 for(let i=0;i<n;i++){if(lead().ko)return;await enemyAct(e)}
}
async function enemyAct(e){
 const pool=[];e.moves.forEach(([mv,w])=>{for(let i=0;i<w;i++)pool.push(mv)});let mv=pick(pool);
 const alive=party.filter(m=>!m.ko);if(!alive.length)return;
 if(mv==='san'){await say('',e.sanText,{auto:1300});let spec=e.sanHit;if(e.t==='gleaner'&&G.flags.cider)spec=[spec[0],'1d6'];await sanCheck(spec,'The words get inside');return}
 if(mv==='all'){await say('',e.allText,{auto:1000});for(const m of alive){const r=d100(),hit=e.skill-(e.blind?30:0)-(m.defend?20:0);if(r<=hit){let d=roll(e.allDmg[0],e.allDmg[1]);if(m.defend)d=Math.ceil(d/2);await hurtMember(m,d)}}return}
 let t=Bt.taunt&&!Bt.taunt.ko?Bt.taunt:pick(alive);
 if(Bt.decoy){Bt.decoy=false;await say('',`${e.name} lunges at the decoy in the corn. The phone shatters.`,{auto:1100});return}
 const cov=party.find(p=>p.covering===t&&!p.ko&&p!==t);if(cov){await say('',`${cov.name} takes the hit for ${t.name}!`,{auto:800});t=cov}
 const hit=e.skill-(e.blind?30:0)-(t.defend?20:0),r=d100();
 if(r<=hit){let d=roll(e.dmg[0],e.dmg[1]);if(t.defend)d=Math.ceil(d/2);await say('',`${e.name} ${e.verb} ${t.name}! ${d} damage.`,{auto:1000});await hurtMember(t,d)}
 else await say('',`${e.name} ${e.verb} ${t.name}... and misses.`,{auto:900});
}
async function hurtMember(m,d){m.hp=Math.max(0,m.hp-d);hud.classList.add('shake');setTimeout(()=>hud.classList.remove('shake'),250);updHUD();if(m.hp<=0&&!m.ko){m.ko=true;updHUD();await say('',m===lead()?`${m.name} goes down.`:`${m.name} goes down!`,{auto:1000})}}

// ================= WORLD =================
function passable(x,y){const M=G.M;if(x<0||y<0||x>=M.w||y>=M.h)return false;if(BLOCK.has(M.g[y][x]))return false;if(M.npcs.some(n=>(!n.on||n.on())&&n.x===x&&n.y===y))return false;return true}
function goMap(name,x,y,dir){hud.hidden=true;gEl.classList.remove('battle');G.map=name;G.M=MAPS[name]();StudioMove.place(G,x,y,dir);
 banner(G.M.name);}
function update(){
 if(G.mode!=='world')return;
 StudioMove.update(G,StudioMove.last(held),{passable,busy:()=>G.busy||dlg||menu,arrive:()=>run(onStep)});
}
async function onStep(){const M=G.M,k=G.x+','+G.y;if(M.warps&&M.warps[k]){held=[];return M.warps[k]()}if(M.onStep)await M.onStep()}
async function interact(){
 const [tx,ty]=StudioMove.ahead(G),M=G.M,k=tx+','+ty;
 const n=M.npcs.find(n=>(!n.on||n.on())&&n.x===tx&&n.y===ty);
 if(n){n.dir={up:'down',down:'up',left:'right',right:'left'}[G.dir];held=[];await n.talk(n);return}
 if(M.O[k]){held=[];await M.O[k]();return}
 const ch=M.g[ty]&&M.g[ty][tx];if(ch&&TILEDESC[ch]){held=[];await say('',TILEDESC[ch])}
}
function cam(){return StudioMove.camera(G,G.M.w,G.M.h,VW,VH)}
function drawWorld(){
 const M=G.M,[camx,camy]=cam();cx.fillStyle='#0a0710';cx.fillRect(0,0,VW,VH);
 const x0=Math.floor(camx/16),y0=Math.floor(camy/16);
 for(let ty=y0;ty<=y0+Math.ceil(VH/16)+1;ty++)for(let tx=x0;tx<=x0+Math.ceil(VW/16)+1;tx++){const ch=M.g[ty]&&M.g[ty][tx];if(!ch)continue;let v=(tx*7+ty*13)%4;if(ch==='V')v=M.vv[tx+','+ty];if(ch==='T')v=(tx*3+ty*5)%3;cx.drawImage(tile(ch,v),tx*16-camx,ty*16-camy)}
 const spr=[];
 M.npcs.forEach(n=>{if(n.on&&!n.on())return;spr.push({y:n.y*16,f:()=>drawChar(n.x*16-camx,n.y*16-camy-3,n.look,n.oc,n.dir,0,{sack:n.sack,hat:n.hat})})});
 const moving=!!G.mv,fr=StudioMove.walkFrame(G);
 // Only the lead walks the map (Bible, Art, Maps). Agent sprites from agent-sprite.js; lantern at night only; a blink every few seconds.
 const blink=!moving&&(performance.now()%3400)<150?1:0;
 spr.push({y:G.py,f:()=>BLA.draw(cx,lead().a,G.px+8-camx,G.py+13-camy,G.dir,fr,blink,!!M.dark)});
 if(M.boss)spr.push({y:11*16,f:()=>drawEnemy('gleaner',13*16+8-camx,11*16+14-camy,performance.now()/16)});
 spr.sort((a,b)=>a.y-b.y).forEach(s=>s.f());
 if(M.dark)darkness(camx,camy);else{cx.fillStyle='rgba(80,20,70,.16)';cx.fillRect(0,0,VW,VH);glows(camx,camy)}
}
const dk=document.createElement('canvas'),dx=dk.getContext('2d');
function darkness(camx,camy){
 if(dk.width!==VW||dk.height!==VH){dk.width=VW;dk.height=VH}
 dx.globalCompositeOperation='source-over';dx.clearRect(0,0,VW,VH);dx.fillStyle='rgba(6,4,14,.94)';dx.fillRect(0,0,VW,VH);dx.globalCompositeOperation='destination-out';
 const hole=(x,y,r)=>{const g=dx.createRadialGradient(x,y,r*.2,x,y,r);g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(1,'rgba(0,0,0,0)');dx.fillStyle=g;dx.beginPath();dx.arc(x,y,r,0,7);dx.fill()};
 const fr=clamp(lead().san/lead().msan,0,1);hole(G.px+8-camx,G.py+6-camy,34+36*fr+Math.random()*3);
 const M=G.M;for(let ty=0;ty<M.h;ty++)for(let tx=0;tx<M.w;tx++)if(M.g[ty][tx]==='L'||M.g[ty][tx]==='l')hole(tx*16+8-camx,ty*16+4-camy,26);
 if(M.boss)hole(13*16+8-camx,11*16-38-camy,46+Math.random()*4);
 cx.drawImage(dk,0,0);
 const g=cx.createRadialGradient(G.px+8-camx,G.py+6-camy,2,G.px+8-camx,G.py+6-camy,50);g.addColorStop(0,'rgba(255,170,60,.16)');g.addColorStop(1,'rgba(255,170,60,0)');cx.fillStyle=g;cx.fillRect(0,0,VW,VH);
}
function glows(camx,camy){cx.globalCompositeOperation='lighter';const M=G.M;for(let ty=0;ty<M.h;ty++)for(let tx=0;tx<M.w;tx++)if(M.g[ty][tx]==='L'){const x=tx*16+8-camx,y=ty*16+3-camy;if(x<-30||y<-30||x>VW+30||y>VH+30)continue;const g=cx.createRadialGradient(x,y,1,x,y,24);g.addColorStop(0,'rgba(255,170,60,.35)');g.addColorStop(1,'rgba(255,120,40,0)');cx.fillStyle=g;cx.fillRect(x-24,y-24,48,48)}cx.globalCompositeOperation='source-over'}
function drawBattle(){
 const t=Bt.t++,pal=BGPAL[Bt.boss?'boss':Bt.bg];
 for(let y=0;y<VH;y+=2){const off=Math.sin(y*.06+t*.035)*12+t*.35;const idx=Math.floor((y+off)/9);cx.fillStyle=pal[((idx%pal.length)+pal.length)%pal.length];cx.fillRect(0,y,VW,2)}
 cx.fillStyle='rgba(0,0,0,.18)';for(let x=0;x<VW;x+=4){const o=Math.sin(x*.08+t*.05)*6;cx.fillRect(x,0,2,VH*.12+o)}
 const n=Bt.en.length;
 Bt.en.forEach((e,i)=>{if(e.dead){e.alpha=Math.max(0,e.alpha-.04)}if(e.alpha<=0)return;const x=VW/(n+1)*(i+1),y=Bt.boss?VH*.62:VH*.48;cx.globalAlpha=e.alpha;drawEnemy(e.t,x,y,t,e);cx.globalAlpha=1;if(e.flash>0)e.flash--;
  if(Bt.hover===i){cx.fillStyle='#ffd166';const ay=y-(e.t==='long'?62:e.t==='gleaner'?80:28)+Math.sin(t*.2)*2;cx.fillRect(x-3,ay,7,2);cx.fillRect(x-2,ay+2,5,2);cx.fillRect(x-1,ay+4,3,2)}
  if(e.stun>0&&!e.dead){cx.fillStyle='#ffd166';cx.font='8px "Press Start 2P",monospace';cx.fillText('z',x+12+Math.sin(t*.1)*3,y-20)}});
 cx.font='9px "Press Start 2P",monospace';cx.textAlign='center';
 Bt.floaties=Bt.floaties.filter(f=>f.t<50);Bt.floaties.forEach(f=>{f.t++;cx.fillStyle='#000';cx.fillText(f.txt,f.x+1,f.y-f.t*.5+1);cx.fillStyle=f.col;cx.fillText(f.txt,f.x,f.y-f.t*.5)});cx.textAlign='left';
}
// ---- BIG HAT: the handler. Back-office scene reused before and after every mission. ----
function drawBigHat(x,base,k,t,s=2){
 const P=(a,b,w,h,c)=>{cx.fillStyle=c;cx.fillRect(Math.round(x+a*s),Math.round(base+b*s),Math.round(w*s),Math.round(h*s))};
 // shoulders + vest + bolo
 P(-9,-6,18,6,'#7a4a2c');P(-3,-6,6,6,'#ece4d0');P(-1,-5,2,2,'#3fb8a8');P(-1,-3,1,3,'#1b1414');P(0,-3,1,3,'#1b1414');P(-9,-6,1,6,'#5a341e');P(8,-6,1,6,'#5a341e');
 // face, almost all of it lost under the brim
 P(-4,-12,8,6,'#e9b98f');P(-4,-12,8,4,'#0d0a12');P(-4,-8,8,1,'rgba(13,10,18,.55)');
 // toothpick, shifts sides every so often
 const tp=Math.floor(t/1.3)%3;P(tp===2?-4:1,-7,4,1,'#d9c08a');
 // two pinprick glints in the shadow, rarely
 if((t%7)>6.6){P(-2,-10,1,1,'#ffe9b0');P(1,-10,1,1,'#ffe9b0')}
 // the hat (fixed size; the growing-hat gag was dropped)
 const bw=Math.round(30*k),cw=Math.round(16*k),ch=Math.round(9*k);
 P(-bw/2,-14,bw,2,'#5a3a1e');P(-bw/2,-15,2,1,'#5a3a1e');P(bw/2-2,-15,2,1,'#5a3a1e');
 P(-cw/2,-14-ch,cw,ch,'#6b4626');P(-cw/2,-14-ch,cw,1,'#7e5530');P(-1,-14-ch,2,2,'#4a2f1a');
 P(-cw/2,-16,cw,2,'#1b1414');P(-2,-16,2,2,'#e0c25a');
}
function drawOffice(){
 const t=performance.now()/1000,sh=G.shout&&performance.now()<G.shout;
 cx.save();if(sh)cx.translate(rnd(5)-2,rnd(3)-1);
 const fy=Math.round(VH*.5),mid=VW/2,S3=VH>=170?3:2;
 cx.fillStyle='#161b30';cx.fillRect(-4,-4,VW+8,VH+8);
 cx.fillStyle='#3a2616';cx.fillRect(-4,fy-28,VW+8,VH);for(let x=0;x<VW;x+=12){cx.fillStyle='#2c1c10';cx.fillRect(x,fy-28,1,VH)}
 // corkboard with one photo of a scarecrow, a calendar stuck on October
 cx.fillStyle='#8a6a3a';cx.fillRect(14,18,46,30);cx.fillStyle='#ece4d0';cx.fillRect(20,23,14,16);cx.fillStyle='#d9b552';cx.fillRect(25,26,4,4);cx.fillRect(23,30,8,6);cx.fillStyle='#c0392b';cx.fillRect(26,22,2,2);
 cx.fillStyle='#ece4d0';cx.fillRect(40,24,15,18);cx.fillStyle='#c0392b';cx.fillRect(40,24,15,4);
 // humming fluorescent tube that occasionally gives up
 const on=Math.random()>.03;cx.fillStyle=on?'#e6f0dc':'#4a5048';cx.fillRect(mid-40,4,80,3);
 if(on){const g=cx.createRadialGradient(mid,6,4,mid,6,110);g.addColorStop(0,'rgba(220,240,210,.14)');g.addColorStop(1,'rgba(220,240,210,0)');cx.fillStyle=g;cx.fillRect(0,0,VW,VH)}
 drawBigHat(mid,fy,1,t,S3);
 // desk, a box of crullers, a styrofoam cup
 cx.fillStyle='#4a2f1f';cx.fillRect(mid-72,fy,144,VH-fy);cx.fillStyle='#5e3c26';cx.fillRect(mid-72,fy,144,3);
 cx.fillStyle='#ece4d0';cx.fillRect(mid+26,fy-7,28,7);cx.fillStyle='#d99a2b';cx.fillRect(mid+29,fy-9,8,3);cx.fillRect(mid+40,fy-9,8,3);
 cx.fillStyle='#f4f1e8';cx.fillRect(mid-50,fy-9,8,9);cx.fillStyle='#3a2616';cx.fillRect(mid-49,fy-9,6,1);
 cx.restore();
 if(sh){cx.fillStyle='rgba(170,0,30,.28)';cx.fillRect(0,0,VW,VH)}
}
// ---- BIG HAT PORTRAIT: 64 x 64, stands on the text box whenever BIG HAT speaks (Art build pass 2, Nov 21, 2026). ----
// Drawing code copied from the Asset Library (bighat.js), renamed so it doesn't clash with the desk sprite above.
function drawBigHatPortrait(c,shout,frame){
  const SK='#c98a62',SS='#a86a46',SD='#7a4a30',MU='#4a2e1c',MH='#6e4630',MS='#341e12',DK='#0c0a10',TP='#e6c98a',TD='#b8955a';
  const H='#7a5a34',HL='#a07a48',HS='#5a4024',HD='#3a2814',HX='#24180c';
  const V='#6b3a22',VL='#8e522e',VS='#4a2616',CR='#d8cdb4',CS='#b0a68e';
  const sh=shout,f=frame;
  const ox=sh?(f%2?1:-1):0,oy=0;
  const r=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x+ox,y+oy,w,h)};
  const px=(a,col)=>a.forEach(p=>r(p[0],p[1],1,1,col));
  // backdrop (plain; the scene shows behind the dialog box)
  c.fillStyle='#2b2a35';c.fillRect(0,0,64,64);c.fillStyle='#25242e';c.fillRect(0,52,64,12);
  if(sh){c.fillStyle=f%2?'#e0503a':'#ff7a5a';[[4,8],[7,5],[5,11],[3,14],[56,7],[59,4],[57,11],[60,14],[3,42],[59,43]].forEach(p=>c.fillRect(p[0],p[1],2,1))}
  const open=sh?true:f;
  // vest, shirt, bolo
  r(18,50,28,1,V);r(15,51,34,1,V);r(14,52,36,12,V);
  r(14,52,3,12,VL);r(15,51,3,1,VL);r(46,52,4,12,VS);r(45,51,4,1,VS);
  for(let y=52;y<64;y++){const w=Math.max(2,6-((y-52)>>1));r(32-w-1,y,1,1,VS);r(32+w,y,1,1,VS);r(32-w,y,w*2,1,CR)}
  r(26,49,12,2,CR);r(25,50,3,2,CR);r(36,50,3,2,CR);r(26,51,2,1,CS);r(36,51,2,1,CS);
  r(29,49,1,12,'#1a1210');r(34,49,1,12,'#1a1210');r(29,61,1,2,'#c0c0c8');r(34,61,1,2,'#c0c0c8');
  r(28,54,8,5,'#c0c0c8');r(28,54,8,1,'#e0e0e8');r(29,55,6,3,'#2e9a8a');r(30,55,4,2,'#3fb8a6');r(30,55,1,1,'#9af0e0');r(28,58,8,1,'#8a8a94');
  px([[18,55],[18,58],[18,61],[46,56],[46,59],[46,62]],'#7e4628');
  // neck and face
  r(27,47,11,3,SD);
  const end=sh?51:48;
  for(let y=26;y<=end;y++){let a=22,b=42;if(y===end-2){a=23;b=41}if(y===end-1){a=24;b=40}if(y===end){a=26;b=38}
    r(a,y,b-a+1,1,SK);r(a,y,2,1,SS);r(b-1,y,2,1,SS);if(y>40&&y<end-1){r(a,y,1,1,SD);r(b,y,1,1,SD)}}
  // brim shadow down to the mustache
  r(22,26,21,11,DK);for(let x=22;x<43;x++){r(x,37,1,1,x%2?DK:SD)}for(let x=22;x<43;x+=2)r(x,38,1,1,SD);
  if(!sh){
    // calm: horseshoe mustache, mouth, toothpick, stubble
    r(24,38,17,3,MU);r(25,38,15,1,MH);r(32,38,1,1,MS);px([[27,39],[30,40],[35,40],[38,39]],MS);
    r(23,40,2,4,MU);r(40,40,2,4,MU);r(23,44,1,2,MU);r(41,44,1,2,MU);r(23,40,1,5,MS);r(41,40,1,5,MS);
    if(open){r(28,42,9,3,'#2a0c0a');r(29,42,7,1,'#f0e8d8');r(30,44,5,1,'#a03a32');r(28,45,9,1,'#a85a4a')}
    else{r(27,42,11,1,'#3a1a14');r(28,43,9,1,'#a85a4a')}
    r(37,42,1,1,'#5a3a2a');r(38,41,2,1,TP);r(40,40,2,1,TP);r(42,39,1,1,TP);r(43,38,1,1,TD);
    px([[25,46],[27,47],[29,46],[35,46],[37,47],[39,46],[26,44],[38,44],[31,47],[33,47],[30,48],[34,48]],SS);
    r(32,47,1,2,SD);
  }else{
    // shout: flared mustache, wide mouth, flying toothpick
    const m=f%2;
    r(23,37,19,2,MU);r(24,37,17,1,MH);r(18,36,5,1,MU);r(42,36,5,1,MU);r(16,35,3,1,MU);r(46,35,3,1,MU);r(15,34,2,1,MS);r(48,34,2,1,MS);r(32,37,1,1,MS);
    r(26,40,13,m?8:9,'#4a0c0c');r(27,40,11,1,'#f0e8d8');r(27,m?47:48,11,1,'#f0e8d8');r(28,m?45:46,9,2,'#c04a4a');r(29,m?45:46,3,1,'#d86a60');
    r(24,40,2,9,SS);r(39,40,2,9,SS);r(32,50,1,1,SD);
    px([[25,49],[29,50],[35,50],[39,49],[27,50],[37,50]],SS);
    const t=m?0:2;r(47+t,33-t,2,1,TP);r(49+t,32-t,2,1,TP);r(51+t,31-t,1,1,TD);
    r(45,38,1,2,'#ffffff');r(46,40,1,1,'#ffffff');
  }
  // ten-gallon hat: crown, cattleman crease, band with turquoise concho, brim
  r(21,3,9,1,H);r(35,3,9,1,H);r(29,4,7,1,HS);r(30,3,5,1,HD);
  for(let y=4;y<19;y++){const i=y<7?7-y:0;const a=19+i,b=45-i;r(a,y,b-a+1,1,H);r(a,y,3,1,HL);r(b-5,y,4,1,HS);r(b-1,y,2,1,HD)}
  for(let y=5;y<18;y++){r(32,y,1,1,HS);r(31,y,1,1,HL)}
  px([[24,8],[27,11],[36,7],[38,13],[25,15],[40,10],[34,16],[22,12]],HS);px([[26,6],[35,10],[29,14]],HL);
  r(19,18,27,4,HD);r(19,18,27,1,HX);r(19,21,27,1,HX);
  r(28,18,9,4,'#c0c0c8');r(29,19,7,2,'#2e9a8a');r(30,19,4,1,'#3fb8a6');r(30,19,1,1,'#9af0e0');r(28,21,9,1,'#8a8a94');
  [[17,0,2],[18,0,3],[19,0,4],[20,0,6],[21,0,9]].forEach(([y,a,w])=>{r(a,y,w,1,H);r(64-a-w,y,w,1,H)});
  r(0,17,1,4,HL);r(1,17,1,2,HL);r(63,17,1,5,HS);r(62,17,1,2,HD);
  r(9,22,46,1,H);r(0,23,64,3,H);r(3,23,58,1,HL);r(0,25,64,1,HS);
  r(4,26,56,1,HS);r(10,27,44,1,HD);r(16,28,32,1,HX);
  px([[12,24],[20,24],[44,24],[52,24],[6,24],[58,24]],HS);
}
async function shout(text){G.shout=performance.now()+750;G.shoutPor=true;try{return await say('BIG HAT',text)}finally{G.shoutPor=false}}
async function bigHatScene(fn){await fade(1);G.mode='scene';G.scene='bighat';await fade(0);await sleep(400);await fn();await fade(1);G.scene=null}
function drawScene(){if(G.scene==='bighat')return drawOffice();cx.fillStyle='#05040a';cx.fillRect(0,0,VW,VH);const t=performance.now()/1000,fl=.7+.3*Math.sin(t*7)*Math.sin(t*3.1);const x=VW/2,y=VH*.38;const g=cx.createRadialGradient(x,y,2,x,y,44);g.addColorStop(0,`rgba(255,190,80,${.35*fl})`);g.addColorStop(1,'rgba(255,190,80,0)');cx.fillStyle=g;cx.fillRect(x-50,y-50,100,100);const P=(a,b,w,h,c)=>{cx.fillStyle=c;cx.fillRect(x+a,y+b,w,h)};P(-1,-16,2,3,'#3a3460');P(-5,-13,10,2,'#2a2440');P(-6,-11,1,16,'#2a2440');P(5,-11,1,16,'#2a2440');P(-5,-11,10,16,`rgba(255,${180+rnd(20)},80,${fl})`);P(-2,-8,4,9,'#fff6d8');P(-6,5,12,2,'#2a2440')}
function loop(){if(!G.active)return;try{update();if(G.mode==='battle'&&Bt)drawBattle();else if(G.mode==='world')drawWorld();else drawScene();drawBox()}catch(e){console.error(e)}raf=requestAnimationFrame(loop)}
function fit(){const v=StudioMove.fit(gEl,cv);if(!v)return;VW=v.w;VH=v.h;gEl.style.setProperty('--pu',(64*v.boxW/VW)+'px');boxKey='';posMenu()}
window.addEventListener('resize',()=>{if(G.active)fit()});

async function gameOver(){
 held=[];G.mode='scene';
 const L=lead();
 await say('',L.san<=0?'Agent {code} walks into the corn, smiling, and does not come back.':'Agent {code} doesn\'t get up. The lantern goes out.');
 const r=await ask('','The file stays open.',['Retry from checkpoint','Quit to title']);
 if(r===0){await fade(1);restore(G.cp);await fade(0)}else quit();
}

// ================= SAVE / FLOW =================
function snap(){return JSON.stringify({map:G.map,x:G.x,y:G.y,dir:G.dir,party,flags:G.flags,clues:G.clues,items:G.items,fights:G.fights,enc:G.enc,rescued:G.rescued})}
function checkpoint(){G.cp=snap();store.set('bl.game',G.cp)}
function restore(s){const o=JSON.parse(s);party=o.party;G.flags=o.flags;G.clues=o.clues;G.items=o.items;G.fights=o.fights;G.enc=o.enc;G.rescued=o.rescued||0;G.mode='world';goMap(o.map,o.x,o.y,o.dir);applySan()}
function enter(){G.active=true;scr.classList.add('gaming');sanEl.hidden=false;fit();cancelAnimationFrame(raf);raf=requestAnimationFrame(loop)}
function leave(){G.active=false;cancelAnimationFrame(raf);scr.classList.remove('gaming','glitch');scr.style.filter='';$('#vig').style.opacity=0;box=null;boxKey='';dhost.replaceChildren();menuEl.hidden=true;hud.hidden=true;if(dlg)clearTimeout(dlg.to);dlg=null;menu=null;Bt=null;held=[]}
function quit(){checkpoint();leave();B.goto('title');B.render()}
function finish(){
 store.set('bl.game',null);const a=lead().a;
 a.id=a.id||Date.now();const R=B.S.roster,i=R.findIndex(x=>x.id===a.id);const copy=JSON.parse(JSON.stringify(a));if(i>=0)R[i]=copy;else R.unshift(copy);store.set('bl.roster',R);
 B.S.a=a;B.S.view=true;leave();B.goto('dossier');B.render();B.toast('FILED. CHAPTER ONE CLOSED.');
}
function startKit(){const it={aid:1};const add=(k,n)=>{it[k]=(it[k]||0)+n};
 const s=B.specOf(lead().a);if(s)Object.entries(s.items).forEach(([k,n])=>add(k,n));else{add('aid',1);add('coffee',1);add('flare',1)}
 party.slice(1).forEach(m=>{const t=B.specOf(m.a);if(t)add(Object.keys(t.items)[0],1)});return it}
async function start(agent,squad){
 party=[member(agent),...squad.map(member)];
 G=Object.assign(G,{active:true,flags:{},clues:[],items:startKit(),fights:0,enc:10,rescued:0,busy:0,mode:'scene',scene:null});
 MAZE=null;enter();applySan();
 run(caseOpening);
}
function resume(){const s=store.get('bl.game',null);if(!s)return false;G=Object.assign(G,{active:true,busy:0,mode:'world'});MAZE=null;enter();
 // a checkpoint that won't open goes back to the title with a message instead of freezing; the save is kept
 try{restore(s)}catch(e){console.warn('Checkpoint would not open:',e);leave();B.goto('title');B.render();B.toast('CHECKPOINT WON\'T OPEN');return false}
 G.cp=s;return true}

// ================= PAUSE =================
async function pauseMenu(){
 held=[];
 for(;;){
  const r=await choose(['Party','Items','Notebook','Save & quit','Close'],{cancel:true,title:'MENU · '+G.M.name});
  if(r===0){for(const m of party)await say(m.name.toUpperCase(),`${profOf(m.a).name}\nHP ${m.hp}/${m.mhp}   WP ${m.wp}/${m.mwp}\nSAN ${m.san}/${m.msan}   Breaking Point ${m.bp}${m.dis?'\nDisorder: '+m.dis:''}\nWeapon: ${m.w.name} (${m.w.skill}%)`)}
  else if(r===1){await itemMenu(lead(),false);hideTB()}
  else if(r===2){if(!G.clues.length)await say('NOTEBOOK','Nothing yet. Talk to the townsfolk.');for(const c of G.clues)await say('NOTEBOOK',c.text);if(!G.flags.key)await say('NOTEBOOK',`Deputy Ross wants proof: ${townClues()}/3 town clues.`)}
  else if(r===3){quit();return}
  else return;
 }
}

// ================= INPUT =================
function input(k){
 if(!G.active)return;
 if(dlg){if(k==='a'||k==='b'){if(!dlg.done)finishType();else closeDlg()}return}
 if(menu){const n=menu.items.length;
  if(k==='up'){menu.sel=(menu.sel-1+n)%n;renderMenu()}
  else if(k==='down'){menu.sel=(menu.sel+1)%n;renderMenu()}
  else if(k==='a'){const it=menu.items[menu.sel];if(it&&it.dis)return;closeMenu(menu.sel)}
  else if(k==='b'&&menu.cancel){closeMenu(-1)}
  return}
 if(G.mode==='world'&&!G.busy&&!G.mv){if(k==='a')run(interact);else if(k==='start')run(pauseMenu)}
}
function hold(d,on){held=StudioMove.hold(held,d,on)}
dhost.addEventListener('click',e=>{if(!e.target.closest('.bld'))return;const li=e.target.closest('.bld-c li');
 if(menu){if(!li||!menu.inBox)return;const i=[...li.parentNode.children].indexOf(li);if(menu.sel!==i){menu.sel=i;renderMenu()}}input('a')});
menuEl.addEventListener('click',e=>{const el=e.target.closest('.gi');if(!el||!menu)return;const i=+el.dataset.i;if(menu.sel!==i){menu.sel=i;renderMenu()}input('a')});
window.BLG={start,resume,input,hold,get active(){return G.active},_t:{fight:t=>run(async()=>{const r=await battle(t);if(r==='lose')await gameOver()}),go:(m,x,y)=>goMap(m,x,y,'right'),G:()=>G,party:()=>party,boss:()=>run(bossIntro)}};
