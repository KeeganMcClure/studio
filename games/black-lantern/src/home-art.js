// Black Lantern · home-art.js
// The home phase's backdrops (spec 008, part B), drawn in code in the dark home palette of the approved mockup's kitchen.
// One per Bond type (Partner's living room, Kid's bedroom, Parent's kitchen, Sibling's diner booth, Friend's bar, Ex's
// front porch, Coworker's break room, Mentor's study) and one per place for choices with no Bond (the woods at the edge
// of town, a church pew, a cemetery bench, a motel room, a therapist's office, a firing range, a library, a parked car,
// a psych ward hallway). Each draws at the screen's size, with a night version, plus two dressings: 'broken' (a Bond's
// last scene: the lamp off, the room cold) and 'arc' (a personal arc beat: a lantern-gold edge).
// Drawn once per size and kept; only the lamps' flicker is drawn each frame. Window: BLHA.
// Every room is designed at 240 × 160 with the floor line at y 99; a taller screen adds wall above.
const BLHA=(()=>{
const FY=99,cache=new Map();
let c=null,BOT=220;  // BOT: the bottom of the screen in design pixels (more on taller screens)
const r=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h)};
const hs=(x,y,s)=>{const v=Math.sin(x*127.1+y*311.7+(s||0)*74.7)*43758.5453;return v-Math.floor(v)};  // repeatable noise
const glow=(x,y,rad,col,a)=>{const g=c.createRadialGradient(x,y,1,x,y,rad);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);c.fillStyle=g;c.fillRect(x-rad,y-rad,rad*2,rad*2)};
const WARM='255,190,96',COLD='170,200,255',FLUO='210,240,230';

// ---------- small parts shared by the rooms ----------
function wall(base,stripe,dot,top){r(0,top,240,FY-top,base);if(stripe)for(let x=0;x<240;x+=10)r(x,top,3,FY-top,stripe);if(dot)for(let x=5;x<240;x+=10)for(let y=top+((x/10)%2?6:13);y<FY;y+=14)r(x,y,1,1,dot)}
function wainscot(y,base,line,cap){r(0,y,240,FY-y,base);for(let x=0;x<240;x+=8)r(x,y,1,FY-y,line);r(0,y-2,240,2,cap)}
function boards(bot,base,line){r(0,FY,240,bot-FY,base);for(let y=FY+5,k=0;y<bot;y+=6,k++){r(0,y,240,1,line);for(let x=(k*37)%40;x<240;x+=40)r(x,y-5,1,5,line)}r(0,FY,240,2,line)}
function checker(bot,a,b){r(0,FY,240,bot-FY,a);for(let y=FY,k=0;y<bot;y+=8,k++)for(let x=(k%2)*8;x<240;x+=16)r(x,y,8,8,b)}
function carpet(bot,base,fleck){r(0,FY,240,bot-FY,base);for(let y=FY;y<bot;y+=2)for(let x=0;x<240;x+=3)if(hs(x,y)<.12)r(x,y,1,1,fleck)}
function baseboard(col){r(0,FY-3,240,3,col)}
// a window: night (stars, moon, a neighbor's light) or dusk (a low orange sky over rooftops)
function win(x,y,w,h,night,frame,o={}){
 r(x-2,y-2,w+4,h+4,frame);
 if(night){r(x,y,w,h,'#1b1f33');r(x+1,y+1,w-2,h-2,'#22284a');for(let i=0;i<w*h/90;i++)r(x+2+((i*11)%(w-4)),y+2+((i*7)%(h-8)),1,1,'#8a90c0');
  if(o.moon!==false){r(x+w-13,y+4,6,6,'#e8dcc0');r(x+w-9,y+5,2,4,'#c8bca0')}}
 else{const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,'#3a2a52');g.addColorStop(.6,'#a85a4a');g.addColorStop(1,'#e0904a');c.fillStyle=g;c.fillRect(x,y,w,h)}
 if(o.roofs!==false){const rb=y+h;r(x,rb-9,w*.35|0,9,'#14172a');r(x+(w*.45|0),rb-13,w*.4|0,13,'#14172a');r(x+(w*.45|0)+3,rb-10,3,3,night?'#d6a43a':'#3a2f22')}
 r(x+(w>>1)-1,y,2,h,frame);r(x,y+(h>>1)-1,w,2,frame);
 if(o.curtain){r(x-6,y-4,7,h+8,o.curtain);r(x-5,y-4,2,h+8,shadeHex(o.curtain,24));r(x+w-1,y-4,7,h+8,o.curtain);r(x+w+3,y-4,2,h+8,shadeHex(o.curtain,-20));r(x-8,y-6,w+16,3,'#6e4630')}
 if(o.sill!==false){r(x-4,y+h+2,w+8,3,'#6e4630');r(x-4,y+h+2,w+8,1,'#8e5e40')}
}
function shadeHex(h,a){const n=parseInt(h.slice(1),16),f=v=>Math.max(0,Math.min(255,v+a));return'#'+[f(n>>16),f(n>>8&255),f(n&255)].map(v=>v.toString(16).padStart(2,'0')).join('')}
function frameArt(x,y,w,h,inner,fr){r(x,y,w,h,fr||'#6e4630');r(x+2,y+2,w-4,h-4,inner)}
function books(x,y,w,h,k){for(let i=0;i<w;){const bw=2+(hs(i,y,k)*3|0),bh=h-(hs(y,i,k)*4|0);r(x+i,y+h-bh,bw,bh,['#7a3a2a','#3a4a6a','#4a5a2c','#8a6a2a','#5a3a5a','#2e4a4a','#9a8a6a'][hs(i,k,y)*7|0]);i+=bw+(hs(i,k)<.2?1:0)}}
function shelfBooks(x,y,w,rows,rh,k){r(x-2,y-2,w+4,rows*rh+4,'#3a2416');for(let j=0;j<rows;j++){r(x,y+j*rh,w,rh-2,'#1e140e');books(x,y+j*rh+1,w,rh-3,k+j);r(x-2,y+j*rh+rh-2,w+4,2,'#5a3a22')}}
function hangLamp(x,y,len,shadeCol){r(x,y,1,len,'#2a2028');r(x-8,y+len,17,6,shadeCol);r(x-10,y+len+6,21,2,shadeHex(shadeCol,-50));r(x-2,y+len+8,5,2,'#f4c96a')}
function cone(x,y,w,bot,spread,a){c.fillStyle=`rgba(217,119,43,${a})`;c.beginPath();c.moveTo(x-w,y);c.lineTo(x+w,y);c.lineTo(x+w+spread,bot);c.lineTo(x-w-spread,bot);c.fill()}
function chair(x,y,col){r(x,y,14,3,col);r(x,y,2,FY+20-y,shadeHex(col,-20));r(x+12,y,2,FY+20-y,shadeHex(col,-20));r(x,y+16,14,3,shadeHex(col,10))}
function mug(x,y,col){r(x,y,5,6,col);r(x+5,y+1,2,3,col);r(x,y,5,1,shadeHex(col,30))}
function clock(x,y,lit){r(x-6,y-6,13,13,'#2a2028');r(x-5,y-5,11,11,lit||'#e8e0d0');r(x,y-4,1,5,'#2a2028');r(x,y,4,1,'#2a2028')}
function tube(x,y,w,on){r(x,y,w,3,'#3a3a40');r(x+2,y+3,w-4,2,on?'#e8f4ec':'#6a7470')}

// ---------- the Bond types ----------
const ROOMS={
 // Partner: the agent's own living room. Couch under a framed photo, a floor lamp, the TV's glow
 partner(o){
  wall('#2e2a3a','#34304a','#4a4460',-99);wainscot(70,'#2a2230','#241c28','#4a3a40');baseboard('#3a2a22');
  win(18,22,40,34,o.night,'#4a3a30',{curtain:'#5a2a3a'});
  frameArt(96,24,44,30,'#3a4a5a');r(104,34,8,14,'#c89a6a');r(104,30,8,5,'#3a2418');r(120,36,8,12,'#d8b08a');r(120,32,8,4,'#8a5a2b');r(98,48,40,4,'#4a5a3a');
  carpet(BOT,'#2a2430','#3a3240');r(70,FY+8,110,10,'#5a2a2e');for(let x=72;x<178;x+=6)r(x,FY+10,3,6,'#6a3438');
  // couch
  r(84,60,76,26,'#4a3a5a');r(86,62,72,10,'#5a4a6a');r(80,70,10,26,'#4a3a5a');r(154,70,10,26,'#4a3a5a');r(88,76,68,14,'#5a4a6a');r(88,76,68,2,'#6e5e80');r(84,96,4,4,'#2a1e18');r(156,96,4,4,'#2a1e18');
  r(96,72,14,9,'#8a6a2a');r(97,73,12,2,'#a8843a');r(136,72,14,9,'#3a6a6a');
  // floor lamp and TV
  r(185,30,2,68,'#3a3028');r(178,22,16,10,'#d6a43a');r(176,30,20,2,'#a8742a');r(181,96,10,3,'#3a3028');
  r(204,62,32,26,'#1a1a20');r(206,64,28,20,o.night?'#2a3a5a':'#1e2430');r(207,65,10,2,'#4a5a7a');r(200,88,40,11,'#4a2f1f');r(202,90,36,2,'#5a3a26');
  if(o.night)glow(220,74,30,'120,150,230',.18);
  return[[186,28,52,WARM]]},
 // Kid: a kid's bedroom. A bed with a quilt, drawings taped up, glow stars, a nightlight, a toy chest
 kid(o){
  wall('#2a3048','#2e3552',null,-99);for(let i=0;i<22;i++){const x=hs(i,1)*236|0,y=-99+(hs(i,2)*170|0);if(y<FY-6){r(x,y,1,1,'#c8d070');if(i%3==0){r(x-1,y,3,1,'#a8b05a');r(x,y-1,1,3,'#a8b05a')}}}
  baseboard('#4a3a5a');
  win(168,20,38,32,o.night,'#5a4a6a',{curtain:'#3a5a7a'});r(176,24,2,2,'#e8f070');r(194,30,2,2,'#e8f070');
  // drawings taped up
  [[18,24,'#f4efe4',0],[38,30,'#f0e8a0',1],[124,22,'#f4efe4',2]].forEach(([x,y,p,k])=>{r(x,y,16,14,p);r(x+6,y-1,4,2,'#c8c4b8');
   if(k===0){r(x+3,y+8,10,4,'#5a7ad8');r(x+5,y+4,6,4,'#d84a4a');r(x+7,y+2,2,2,'#f0c040')}else if(k===1){r(x+4,y+3,4,4,'#f0c040');r(x+3,y+10,3,3,'#3a8a5a');r(x+10,y+9,3,4,'#3a8a5a')}else{r(x+3,y+4,4,8,'#b5532e');r(x+9,y+4,4,8,'#5a7ad8');r(x+3,y+3,10,1,'#2a2028')}});
  carpet(BOT,'#3a3048','#4a3e5a');r(80,FY+6,60,14,'#4a7a6a');r(82,FY+8,56,10,'#5a8a7a');
  // bed with a quilt and a stuffed bear
  r(10,52,8,48,'#6e4630');r(10,52,8,2,'#8e5e40');r(18,74,86,14,'#d8d0c0');r(18,70,22,10,'#f4efe4');r(20,72,18,6,'#e8e0d0');
  for(let x=40;x<104;x+=8)for(let y=74;y<96;y+=6)r(x,y,8,6,((x+y)/2)%3<1?'#b5532e':((x+y)/2)%3<2?'#d6a43a':'#4a7a9a');r(40,96,64,3,'#3a2416');r(100,60,6,40,'#6e4630');
  r(26,62,9,9,'#8a5a2b');r(25,60,3,3,'#8a5a2b');r(33,60,3,3,'#8a5a2b');r(28,65,1,1,'#14101a');r(31,65,1,1,'#14101a');r(29,67,2,2,'#c89a6a');
  // toy chest, ball, the nightlight
  r(150,76,40,22,'#5a3a2a');r(150,76,40,4,'#6e4a34');r(168,82,5,4,'#d6a43a');r(160,70,8,6,'#d84a4a');r(158,72,4,4,'#5a7ad8');r(198,88,10,10,'#d84a4a');r(200,90,6,2,'#f4efe4');
  r(222,84,6,6,'#f0e8a0');glow(225,87,22,'240,232,160',.3);
  return[[225,87,26,'240,232,160']]},
 // Parent: the kitchen, as in the approved mockup. Window, cabinets, counter and stove, the fridge, the lamp, a saved plate
 parent(o){
  wall('#3a2a2e','#42303a','#5a4048',-99);r(0,62,240,2,'#4a3440');wainscot(64,'#2e2228','#281e24','#4a3440');
  win(18,20,42,36,o.night,'#4a3a30',{curtain:'#9a4e3a'});r(24,58,6,3,'#4a7a3a');r(26,55,2,3,'#5e9a48');
  // cabinets above, counter and stove below
  r(78,8,60,28,'#5a3e2a');r(80,10,27,24,'#4e3424');r(109,10,27,24,'#4e3424');r(104,20,2,4,'#c0a070');r(110,20,2,4,'#c0a070');
  r(76,60,66,4,'#7a5a3a');r(76,60,66,1,'#9a7a52');r(76,64,66,35,'#5a3e2a');r(80,68,26,16,'#4e3424');r(110,68,28,16,'#4e3424');r(103,74,2,4,'#c0a070');r(112,74,2,4,'#c0a070');
  r(114,54,18,6,'#3a3a40');r(116,52,5,3,'#2a2a30');r(124,52,6,2,'#2a2a30');r(84,54,12,6,'#d8cdb4');r(85,54,10,1,'#f0e8d8');r(88,50,4,4,'#d8cdb4');
  // the fridge with magnets and a kid's drawing
  r(178,14,40,85,'#c8c4b8');r(179,15,38,83,'#dcd8cc');r(214,15,3,83,'#b0aca0');r(179,46,38,2,'#9a968a');r(208,24,2,16,'#8a867a');r(208,54,2,18,'#8a867a');
  r(184,20,14,16,'#f4efe4');r(186,24,3,8,'#5a7ad8');r(191,27,5,1,'#d84a4a');r(190,22,4,3,'#f0c040');r(189,18,3,3,'#b5532e');r(200,32,4,4,'#3a8a5a');r(184,52,5,4,'#d6a43a');r(194,58,10,7,'#f4efe4');r(195,60,8,1,'#8a867a');r(195,62,6,1,'#8a867a');
  checker(BOT,'#3a3438','#2e2a30');
  // the hanging lamp and its warm pool, the table with a saved plate, two chairs
  hangLamp(152,-99,129,'#b5532e');cone(152,38,10,150,46,.12);
  chair(126,78,'#6e4630');chair(170,78,'#6e4630');
  r(120,96,72,5,'#8a5e3a');r(120,96,72,1,'#aa7a4e');r(124,101,4,30,'#5a3a22');r(184,101,4,30,'#5a3a22');
  r(132,90,20,6,'#e8e0d0');r(134,89,16,2,'#c8c4b8');r(136,90,12,3,'#8a4a2a');r(139,90,5,1,'#b86a3a');r(170,90,8,6,'#d8cdb4');r(172,88,4,2,'#d8cdb4');
  return[[152,42,60,WARM]]},
 // Sibling: a diner booth by the window. Red vinyl, the street outside, coffee for two, a pendant lamp
 sibling(o){
  wall('#2a3a3a',null,null,-99);for(let x=0;x<240;x+=8){r(x,58,4,4,'#d8d0c0');r(x+4,58,4,4,'#2a2028');r(x,62,4,4,'#2a2028');r(x+4,62,4,4,'#d8d0c0')}r(0,66,240,33,'#6a2a2e');
  // the big window: the street, a neon sign's back reflected
  r(20,6,200,50,'#3a3a40');r(22,8,196,46,o.night?'#141830':'#4a3a5a');
  if(!o.night){const g=c.createLinearGradient(0,8,0,54);g.addColorStop(0,'#3a2a52');g.addColorStop(1,'#d07a4a');c.fillStyle=g;c.fillRect(22,8,196,46)}
  r(22,38,196,16,'#1e1a24');r(40,26,30,12,'#1a1820');r(44,30,4,4,'#d6a43a');r(120,20,44,18,'#1a1820');r(126,24,4,4,'#d6a43a');r(150,24,4,4,'#3a2f22');r(180,44,2,10,'#3a3a40');r(176,42,10,3,'#f4c96a');
  for(let x=66;x<104;x+=6)r(x,12,4,6,'#ff4f6a');c.fillStyle='rgba(255,79,106,.18)';c.fillRect(60,8,50,16);r(118,8,2,46,'#3a3a40');
  checker(BOT,'#3a3438','#2e2a30');
  // booth seats facing each other, the table
  r(6,52,40,47,'#8a2a2e');r(8,54,36,4,'#a83a3a');for(let y=60;y<92;y+=8)r(8,y,36,1,'#6a1e22');r(194,52,40,47,'#8a2a2e');r(196,54,36,4,'#a83a3a');for(let y=60;y<92;y+=8)r(196,y,36,1,'#6a1e22');
  r(46,80,148,6,'#c8c0b0');r(46,80,148,2,'#e8e0d0');r(46,86,148,2,'#8a8478');r(116,88,8,30,'#5a5a60');
  mug(80,72,'#e8e0d0');mug(150,72,'#e8e0d0');r(81,72,4,1,'#3a2416');r(151,72,4,1,'#3a2416');
  r(112,68,8,12,'#c8c4b8');r(113,70,6,8,'#f4efe4');r(124,70,4,10,'#b5332e');r(124,68,4,2,'#f4efe4');r(130,74,10,6,'#d8cdb4');r(132,72,6,2,'#a8742a');
  hangLamp(120,-99,135,'#3a6a5a');cone(120,44,9,80,30,.1);
  return[[120,48,50,WARM],[86,16,30,'255,79,106']]},
 // Friend: a bar. Bottles on the back bar, a mirror, a beer sign, the counter and stools
 friend(o){
  wall('#2a1e1a','#30221e',null,-99);r(0,0,240,4,'#1a1210');
  // back bar: mirror, shelves of bottles, the neon sign
  r(30,10,180,46,'#4a3020');r(34,14,172,22,'#2a3036');r(36,16,40,2,'#4a5056');r(150,24,30,1,'#4a5056');
  for(let j=0;j<2;j++){const y=j?52:36;r(30,y,180,3,'#6e4630');for(let x=36;x<206;x+=7){const h=10+(hs(x,j)*6|0),col=['#3a6a3a','#7a4a1a','#8a8a6a','#5a2a1a','#2a4a5a'][hs(j,x)*5|0];r(x,y-h,5,h,col);r(x+1,y-h-3,3,3,col);r(x+1,y-h+2,1,h-4,shadeHex(col,40))}}
  r(214,12,22,14,'#1a1210');[[216,15],[221,15],[226,15],[231,15]].forEach(([x,y],i)=>r(x,y,4,8,i%2?'#ffd166':'#ff4f6a'));glow(225,19,22,'255,140,90',.28);
  // the counter, stools, the glasses
  boards(BOT,'#2a1e18','#20160e');
  r(0,66,240,8,'#7a4a2a');r(0,66,240,2,'#9a6a3a');r(0,74,240,25,'#4a2a1a');for(let x=8;x<240;x+=30)r(x,76,22,20,'#3e2416');r(0,97,240,2,'#d6a43a');
  r(60,58,7,8,'rgba(220,230,230,.5)');r(61,60,5,5,'#d6a43a');r(61,59,5,1,'#f4efe4');r(150,58,7,8,'rgba(220,230,230,.5)');r(151,61,5,4,'#7a4a1a');r(110,63,14,3,'#3a3a40');
  [40,100,160,210].forEach(x=>{r(x,100,20,5,'#6a2a2e');r(x+2,100,16,1,'#8a3a3a');r(x+9,105,2,20,'#3a3a40');r(x+4,116,12,2,'#3a3a40')});
  [70,170].forEach(x=>{r(x,-99,1,103,'#1a1210');r(x-5,4,11,5,'#3a2a20');r(x-2,9,5,2,'#ffd166')});
  return[[70,12,40,WARM],[170,12,40,WARM]]},
 // Ex: their front porch. Siding, the door behind a screen, the porch light with moths, railing and steps
 ex(o){
  const night=o.night;wall(night?'#2a3038':'#4a4a52',null,null,-99);for(let y=-99;y<FY;y+=6)r(0,y,240,1,night?'#20262e':'#3a3a42');
  // the door, its screen door, the window with a lamp behind the blind
  r(96,22,40,77,'#3a2a22');r(98,24,36,75,'#5a2a2e');r(102,30,12,18,'#4a2226');r(118,30,12,18,'#4a2226');r(102,54,12,22,'#4a2226');r(118,54,12,22,'#4a2226');r(126,58,3,3,'#d6a43a');
  r(94,20,4,79,'#c8bca0');r(134,20,4,79,'#c8bca0');r(94,20,44,3,'#c8bca0');c.fillStyle='rgba(40,40,50,.35)';c.fillRect(98,23,36,76);r(98,58,36,2,'#c8bca0');
  r(28,30,44,34,'#3a2a22');r(30,32,40,30,night?'#e7b65a':'#5a5048');for(let y=33;y<62;y+=3)r(30,y,40,1,night?'#c8943a':'#4a4038');r(26,64,48,3,'#c8bca0');
  r(170,30,40,34,'#3a2a22');r(172,32,36,30,'#1e2028');r(189,32,2,30,'#3a2a22');r(172,46,36,2,'#3a2a22');r(168,64,44,3,'#c8bca0');
  // porch light and moths
  r(148,30,8,10,'#2a2028');r(149,32,6,6,'#ffe8a0');if(night){glow(152,35,44,'255,220,140',.35);[[160,28],[146,24],[158,40]].forEach(([x,y])=>r(x,y,2,1,'#c8bca0'))}
  // porch boards, railing, a chair, the steps down
  boards(118,'#6a5a4a','#4a3e32');r(0,118,240,BOT-118,night?'#14181a':'#2a3424');for(let x=0;x<240;x+=3)if(hs(x,1)<.5)r(x,118,1,2,night?'#1e2a20':'#3a4a2c');
  r(0,70,80,3,'#d8d0c0');for(let x=4;x<80;x+=8)r(x,73,3,26,'#c8c0b0');r(0,96,80,3,'#d8d0c0');r(176,70,64,3,'#d8d0c0');for(let x=180;x<240;x+=8)r(x,73,3,26,'#c8c0b0');r(176,96,64,3,'#d8d0c0');
  r(56,78,18,3,'#6e4630');r(56,64,3,36,'#5a3a22');r(56,64,18,3,'#6e4630');r(71,78,3,22,'#5a3a22');r(56,88,18,3,'#6e4630');
  r(96,104,44,4,'#7a6a5a');r(92,110,52,4,'#6a5a4a');r(88,116,60,4,'#5a4a3a');
  r(196,84,12,12,'#5a3a2a');r(198,82,8,3,'#6a4a3a');r(200,78,4,4,'#4a7a3a');
  return night?[[152,35,40,'255,220,140']]:[]},
 // Coworker: the office break room. Fluorescent tubes, a vending machine, the corkboard, coffee, a round table
 coworker(o){
  wall('#4a5048',null,null,-99);for(let y=-99;y<FY;y+=8)for(let x=((y+99)/8%2)*8;x<240;x+=16)r(x,y,1,8,'#40463e');for(let y=-99;y<FY;y+=8)r(0,y,240,1,'#40463e');
  r(0,0,240,6,'#3a3a3a');tube(40,6,50,true);tube(150,6,50,!o.night);
  // corkboard with notices, the clock
  r(20,18,56,36,'#6e4630');r(22,20,52,32,'#a87a4a');[[25,23,14,16,'#f4efe4'],[42,22,12,10,'#f0e8a0'],[57,24,14,12,'#e8b0b0'],[40,36,16,12,'#f4efe4'],[60,40,10,9,'#b0d0e8']].forEach(([x,y,w,h,p])=>{r(x,y,w,h,p);r(x+w/2|0,y,2,2,'#d84a4a');for(let k=y+3;k<y+h-2;k+=2)r(x+2,k,w-4,1,'#c8c4b8')});
  clock(110,22);
  // counter with the coffee maker and a microwave
  r(88,62,70,4,'#9a968a');r(88,66,70,33,'#6a6a62');r(92,70,30,26,'#5e5e56');r(126,70,28,26,'#5e5e56');
  r(94,48,14,14,'#2a2a2e');r(96,56,10,6,'#4a3020');r(97,57,8,4,'#2a1a10');r(105,51,2,2,'#d84a4a');r(118,46,28,16,'#d8d4c8');r(120,48,18,12,'#2a2a2e');r(140,50,4,8,'#9a968a');
  // the vending machine
  r(178,14,44,85,'#2a3a5a');r(182,18,28,60,'#1a2030');for(let j=0;j<5;j++)for(let i=0;i<4;i++)r(184+i*7,21+j*12,5,8,['#d84a4a','#f0c040','#3a8a5a','#5a7ad8','#e8e0d0'][(i+j)%5]);r(212,22,6,30,'#4a5a7a');r(213,24,4,4,'#3ff0e8');r(184,84,26,8,'#141820');
  glow(196,48,40,'140,180,255',.16);
  checker(BOT,'#5a5a52','#4e4e46');
  // a round table, two plastic chairs, a box of donuts
  r(54,96,64,5,'#d8d0c0');r(54,96,64,1,'#f4efe4');r(84,101,4,30,'#6a6a62');chair(36,82,'#b5532e');chair(122,82,'#3a6a8a');
  r(64,90,22,6,'#f4efe4');r(66,91,4,2,'#c86a8a');r(74,91,4,2,'#8a5a2b');mug(98,89,'#c8c4b8');
  return[[65,8,50,FLUO]]},
 // Mentor: a cluttered study. Shelves to the ceiling, a banker's lamp, papers, a globe, the armchair
 mentor(o){
  wall('#2a2420','#302822',null,-99);
  shelfBooks(6,-60,56,8,18,1);shelfBooks(178,-60,56,8,18,5);
  win(86,14,40,40,o.night,'#3a2a20',{curtain:'#3a4a32'});
  frameArt(136,18,28,22,'#e8dcc0','#8a6a2a');r(142,24,16,1,'#5a4a3a');r(144,28,12,1,'#5a4a3a');r(146,33,8,3,'#b5332e');
  carpet(BOT,'#3a2a24','#4a3a2a');r(60,FY+6,120,14,'#5a3028');for(let x=64;x<176;x+=8){r(x,FY+8,4,4,'#7a4a2a');r(x+4,FY+12,4,4,'#3a2a24')}
  // the desk with papers, a banker's lamp, a skull for a paperweight
  r(68,64,80,5,'#5a3a22');r(68,64,80,1,'#7a5232');r(70,69,76,30,'#4a2f1f');r(74,73,26,10,'#3e2618');r(74,85,26,10,'#3e2618');r(86,77,4,2,'#d6a43a');r(86,89,4,2,'#d6a43a');
  r(76,58,16,6,'#e8e0d0');r(78,56,14,2,'#d8cdb4');r(80,54,12,2,'#f4efe4');r(100,60,10,4,'#8a3a2a');r(100,57,10,3,'#3a4a6a');r(112,58,7,6,'#e8dcc0');r(113,60,2,2,'#2a2028');r(116,60,2,2,'#2a2028');
  r(128,62,12,2,'#c0a070');r(133,52,2,10,'#c0a070');r(124,46,18,6,'#2a6a3a');r(124,46,18,1,'#4a9a5a');r(126,52,14,1,'#f4c96a');
  // a globe and the armchair, papers on the floor
  r(160,56,14,14,'#3a5a4a');r(162,58,6,4,'#8a7a3a');r(168,64,4,3,'#8a7a3a');r(158,54,2,20,'#c0a070');r(162,72,10,2,'#c0a070');r(164,74,6,25,'#4a2f1f');
  r(14,70,40,30,'#6a2a2e');r(10,62,10,38,'#5a2226');r(48,62,10,38,'#5a2226');r(18,78,32,8,'#7a3438');r(16,62,36,10,'#6a2a2e');
  r(140,104,14,8,'#f4efe4');r(152,108,12,6,'#e8e0d0');r(60,108,10,6,'#d8cdb4');
  return[[133,50,44,WARM]]},

 // ---------- the places for choices with no Bond ----------
 // Back to Nature: the woods at the edge of town. Dusk over the treeline, the town's lights far off, a truck's tailgate
 nature(o){
  const g=c.createLinearGradient(0,-99,0,FY);g.addColorStop(0,o.night?'#0e1226':'#2a2448');g.addColorStop(.7,o.night?'#1b1f33':'#8a4a4a');g.addColorStop(1,o.night?'#22284a':'#d0804a');c.fillStyle=g;c.fillRect(0,-99,240,FY+99);
  for(let i=0;i<30;i++)if(o.night||i<8)r(hs(i,3)*240|0,-99+(hs(i,4)*150|0),1,1,'#c8c8e0');
  r(0,82,240,17,'#1e1e2c');for(let x=60;x<180;x+=9){const h=4+(hs(x,7)*8|0);r(x,82-h,6,h,'#1e1e2c');if(hs(x,8)<.6)r(x+2,84-h,1,1,'#ffd166')}
  // treeline: pines, darker in front
  const pine=(x,base,h,col)=>{for(let k=0;k<h;k+=2){const w=Math.max(1,(k*0.45)|0);r(x-w,base-h+k,w*2+1,2,col)}r(x,base,1,6,col)};
  for(let x=-4;x<250;x+=11)pine(x,84,22+(hs(x,2)*16|0),'#1a2420');
  for(let x=-10;x<250;x+=26)if(x<60||x>178)pine(x,104,44+(hs(x,5)*20|0),'#0e1612');
  r(0,FY,240,BOT-FY,'#1e2a1a');for(let x=0;x<240;x+=2)for(let y=FY;y<BOT;y+=3)if(hs(x,y)<.25)r(x,y,1,2,'#2a3a22');
  // a fallen log and the truck's tailgate at the left edge
  r(110,100,60,9,'#3a2a1e');r(110,100,60,2,'#5a3e2a');r(166,100,6,9,'#6a4e36');r(168,102,2,4,'#3a2a1e');
  r(0,82,48,26,'#3a4a5a');r(0,82,48,3,'#5a6a7a');r(4,88,40,10,'#2e3a48');r(36,90,8,4,'#b5332e');r(4,108,14,12,'#141418');r(6,110,10,8,'#2a2a30');
  return[]},
 // Personal Motivation (Faith, Redemption, Protect the innocent): a church pew under the stained glass, candles
 church(o){
  wall('#2e2a36','#34303e',null,-99);
  // the stained glass, pointed arch
  const gx=96,gy=4,gw=48,gh=60;r(gx-3,gy+6,gw+6,gh-3,'#4a4450');for(let k=0;k<12;k++){const w=Math.round(gw*Math.sin((k+1)/12*Math.PI/2));r(gx+(gw-w)/2-3,gy+k-6,w+6,1,'#4a4450')}
  const cols=['#7a2a3a','#2a4a7a','#c8943a','#3a6a3a','#5a2a6a'];for(let y=0;y<gh-6;y+=6)for(let x=0;x<gw;x+=6)r(gx+x,gy+6+y,5,5,cols[(x/6+y/6*2)%5|0]);for(let k=0;k<10;k++){const w=Math.round(gw*Math.sin((k+1)/12*Math.PI/2));r(gx+(gw-w)/2,gy+k-4,w,1,cols[k%5])}
  r(gx+gw/2-1,gy-4,2,gh+2,'#2a2430');r(gx,gy+30,gw,2,'#2a2430');if(!o.night)glow(120,36,60,'240,200,140',.18);else{c.fillStyle='rgba(13,15,30,.35)';c.fillRect(gx,gy-6,gw,gh)}
  // candles on a rack
  r(178,62,46,4,'#3a3036');r(182,66,4,33,'#2a2228');r(216,66,4,33,'#2a2228');for(let x=180;x<222;x+=6){const h=4+(hs(x,9)*5|0);r(x,62-h,3,h,'#e8e0d0');r(x+1,60-h,1,2,'#ffd166')}glow(201,54,34,WARM,.3);
  // a stone floor and the pews from behind
  r(0,FY,240,BOT-FY,'#2a2630');for(let y=FY;y<BOT;y+=10)for(let x=((y-FY)/10%2)*14;x<240;x+=28)r(x,y,1,10,'#221e28');for(let y=FY;y<BOT;y+=10)r(0,y,240,1,'#221e28');
  [[70,8],[100,0]].forEach(([y,i])=>{r(8,y,96,6,'#5a3a22');r(8,y,96,1,'#7a5232');r(8,y+6,96,14,'#4a2f1f');r(136,y,96,6,'#5a3a22');r(136,y,96,1,'#7a5232');r(136,y+6,96,14,'#4a2f1f');r(6,y-4,4,30,'#3a2416');r(230,y-4,4,30,'#3a2416')});
  r(40,62,10,8,'#3a2a3a');r(41,64,8,1,'#d6a43a');
  return[[201,54,30,WARM]]},
 // Personal Motivation (Family, Revenge, Duty): a cemetery bench under a lamp, the iron fence, a bare tree
 cemetery(o){
  const night=o.night!==false,g=c.createLinearGradient(0,-99,0,FY);g.addColorStop(0,night?'#0e1226':'#2a2448');g.addColorStop(1,night?'#2a2c44':'#8a5a5a');c.fillStyle=g;c.fillRect(0,-99,240,FY+99);
  for(let i=0;i<24;i++)r(hs(i,6)*240|0,-99+(hs(i,7)*160|0),1,1,'#a8a8c8');r(30,10,8,8,'#e8dcc0');r(30,10,3,8,'#c8bca0');
  // the bare tree
  r(196,20,6,80,'#14121a');[[176,30,20,2],[200,24,26,2],[184,40,14,2],[202,44,22,2],[180,22,2,10],[220,16,2,10],[188,10,2,22]].forEach(([x,y,w,h])=>r(x,y,w,h,'#14121a'));
  // iron fence along the back, headstones
  r(0,66,240,2,'#1a1a22');for(let x=2;x<240;x+=7){r(x,52,2,30,'#1a1a22');r(x,50,2,2,'#2a2a34')}r(0,80,240,2,'#1a1a22');
  r(0,82,240,BOT-82,'#1a2420');for(let x=0;x<240;x+=2)for(let y=82;y<BOT;y+=4)if(hs(x,y,2)<.2)r(x,y,1,2,'#22302a');
  [[20,78,14,18],[50,82,12,14],[160,80,14,16],[214,84,12,14]].forEach(([x,y,w,h])=>{r(x,y-h,w,h,'#6a6a72');r(x+1,y-h-1,w-2,1,'#6a6a72');r(x+3,y-h+4,w-6,1,'#4a4a52');r(x+3,y-h+7,w-6,1,'#4a4a52');r(x,y,w,2,'#141a18')});
  // the lamp and the bench under it
  r(134,24,3,76,'#1a1a22');r(130,18,11,8,'#2a2a34');r(132,20,7,5,'#ffe8a0');glow(135,24,46,'255,220,140',.28);
  r(84,88,46,4,'#6a4a32');r(84,88,46,1,'#8a6a4a');r(84,80,46,3,'#6a4a32');r(84,76,46,3,'#6a4a32');r(86,92,3,10,'#2a2a30');r(125,92,3,10,'#2a2a30');r(86,76,2,16,'#2a2a30');r(126,76,2,16,'#2a2a30');
  r(100,86,10,2,'#c8c4b8');r(108,84,3,4,'#d84a4a');
  return[[135,24,40,'255,220,140']]},
 // Personal Motivation (Find the truth, Curiosity, Money): a motel room, the VACANCY sign's red through the curtain
 motel(o){
  wall('#4a3a26','#52402a','#6a5434',-99);baseboard('#2a1e14');
  // curtain with the neon leaking in, the AC unit
  r(14,16,60,62,'#6a5a3a');for(let x=14;x<74;x+=5)r(x,16,2,62,'#5a4a30');r(42,16,4,62,'#ff4f6a');glow(44,46,36,'255,79,106',o.night?.35:.15);r(10,12,68,4,'#3a2a1a');
  r(22,80,44,14,'#c8c4b8');r(24,82,40,10,'#9a968a');for(let x=26;x<62;x+=3)r(x,83,1,8,'#6a6a62');
  // a painting of a boat, the bed, the nightstand and its lamp, a TV on the dresser
  frameArt(110,20,42,26,'#3a5a6a','#c0a070');r(114,36,34,6,'#2a4a5a');r(124,30,14,4,'#e8e0d0');r(130,24,1,6,'#e8e0d0');r(131,24,5,5,'#f4efe4');
  carpet(BOT,'#3a4a3a','#4a5a42');
  r(96,62,72,8,'#4a2f1f');r(92,70,82,26,'#8a6a3a');for(let x=92;x<174;x+=10)r(x,70,5,26,'#7a5a30');r(92,70,82,3,'#d8d0c0');r(102,64,22,8,'#e8e0d0');r(136,64,22,8,'#e8e0d0');r(92,96,82,3,'#3a2416');
  r(178,74,20,25,'#5a3a22');r(180,78,16,1,'#3a2416');r(184,62,8,12,'#d6a43a');r(182,58,12,5,'#e8d8a8');
  r(204,74,34,25,'#5a3a22');r(208,56,26,18,'#2a2a2e');r(210,58,22,14,o.night?'#3a4a6a':'#2a3038');r(214,74,18,2,'#3a3a40');
  if(o.night)glow(221,65,22,'120,150,230',.2);
  r(150,108,18,8,'#2a2a30');r(152,106,14,2,'#3a3a40');
  return[[188,60,34,WARM],[44,46,30,'255,79,106']]},
 // Therapy: a therapist's office. Two armchairs, tissues, a plant, diplomas, blinds, a soft floor lamp
 therapy(o){
  wall('#3a4a4a','#3e4e4e',null,-99);baseboard('#2a2a26');
  r(20,14,48,40,'#d8d0c0');r(22,16,44,36,o.night?'#1e2440':'#a8805a');for(let y=16;y<52;y+=3)r(22,y,44,2,'#e8e0d0');r(18,54,52,3,'#d8d0c0');
  frameArt(96,18,22,16,'#f4efe4','#3a2416');r(100,22,14,1,'#5a4a3a');r(102,26,10,1,'#5a4a3a');r(104,29,6,3,'#b5332e');frameArt(122,18,22,16,'#f4efe4','#3a2416');r(126,22,14,1,'#5a4a3a');r(128,26,10,1,'#5a4a3a');r(130,29,6,3,'#2a4a7a');
  clock(170,24);
  shelfBooks(196,22,38,4,19,3);
  carpet(BOT,'#4a3e3a','#584a44');r(50,FY+6,140,14,'#6a5a4a');r(52,FY+8,136,10,'#7a6a58');
  // armchairs facing each other
  const arm=(x,col,flip)=>{r(x,62,36,36,col);r(x+(flip?26:0),56,10,42,shadeHex(col,-20));r(x+(flip?0:26),74,10,24,shadeHex(col,-10));r(x+4,76,28,8,shadeHex(col,14));r(x+2,98,4,3,'#2a1e18');r(x+30,98,4,3,'#2a1e18')};
  arm(48,'#6a5a7a',false);arm(152,'#5a6a5a',true);
  // side table with tissues and water, the plant, the lamp
  r(106,80,26,4,'#5a3a22');r(110,84,3,15,'#4a2f1f');r(125,84,3,15,'#4a2f1f');r(110,72,12,8,'#e8e0f0');r(114,70,4,2,'#f4f4f4');r(124,72,5,8,'rgba(200,220,230,.6)');
  r(14,84,14,15,'#8a4a2a');r(16,82,10,3,'#6a3a22');for(let k=0;k<8;k++)r(10+k*3,64+(k%3)*4,3,20-(k%3)*4,k%2?'#3a6a3a':'#4a8a4a');
  r(92,30,2,68,'#3a3028');r(86,24,14,8,'#e8d8a8');r(88,96,10,3,'#3a3028');
  return[[93,30,46,WARM]]},
 // Improve Skill / Special Training (physical skills): a firing range. Lanes, paper targets, the counter, ear muffs
 range(o){
  r(0,-99,240,FY+99,'#3a3a3a');r(0,0,240,8,'#2a2a2a');tube(30,8,40,true);tube(100,8,40,true);tube(170,8,40,true);
  // the back wall down range and the lanes in perspective
  r(40,14,160,40,'#5a5048');for(let x=40;x<200;x+=10)r(x,14,1,40,'#4a4038');
  [[64,1],[120,0],[176,1]].forEach(([x,k])=>{r(x-1,16,2,8,'#2a2a2a');r(x-8,24,16,22,'#e8e0d0');r(x-4,26,8,8,'#2a2a30');r(x-7,34,14,12,'#2a2a30');r(x-3,36,6,6,'#e8e0d0');r(x-1,38,2,2,'#d84a4a');if(k){r(x-2,28,1,1,'#e8e0d0');r(x+3,40,1,1,'#e8e0d0')}});
  c.fillStyle='#2e2e30';c.beginPath();c.moveTo(40,54);c.lineTo(200,54);c.lineTo(240,FY);c.lineTo(0,FY);c.fill();
  [[92,40],[148,200]].forEach(([a,b])=>{c.fillStyle='#4a4a44';c.beginPath();c.moveTo(a,54);c.lineTo(a+2,54);c.lineTo(b===40?40:b,FY);c.lineTo((b===40?40:b)-14,FY);c.fill()});
  r(0,-99,40,FY+99,'#4a4a44');r(200,-99,40,FY+99,'#4a4a44');r(38,14,2,85,'#2a2a2a');r(200,14,2,85,'#2a2a2a');
  // the shooting counter, ear muffs, a box of rounds
  r(0,FY,240,BOT-FY,'#3a3632');r(0,74,240,6,'#6a5a4a');r(0,74,240,1,'#8a7a62');r(0,80,240,19,'#4a3e32');
  r(60,66,18,8,'#b5332e');r(62,64,14,2,'#2a2a2a');r(60,64,2,4,'#2a2a2a');r(76,64,2,4,'#2a2a2a');r(150,68,14,6,'#8a6a2a');r(152,69,10,1,'#c8a04a');r(110,70,20,4,'#2a2a30');
  for(let i=0;i<5;i++)r(100+i*9,96+(i%2),3,2,'#c8a04a');
  return[[100,10,50,FLUO]]},
 // Improve Skill / Special Training (everything else): a library. Tall shelves, a reading table with green lamps
 library(o){
  wall('#2a2420',null,null,-99);for(let x=4;x<240;x+=56)shelfBooks(x,-80,46,9,18,x);
  r(96,-99,48,FY+99,'#2a2420');const ax=100,aw=40;r(ax-2,8,aw+4,60,'#3a2a20');r(ax,14,aw,52,o.night?'#1b1f33':'#6a5a7a');for(let k=0;k<8;k++){const w=Math.round(aw*Math.sin((k+1)/8*Math.PI/2));r(ax+(aw-w)/2,8+k,w,1,o.night?'#1b1f33':'#6a5a7a')}
  r(ax+aw/2-1,8,2,58,'#3a2a20');r(ax,40,aw,2,'#3a2a20');if(o.night)for(let i=0;i<6;i++)r(ax+4+i*6,18+(i%3)*6,1,1,'#8a90c0');
  boards(BOT,'#3a2a1e','#2e2016');
  // the reading table with green lamps, an open book, the card catalogue
  r(40,80,160,5,'#6a4630');r(40,80,160,1,'#8a6040');r(44,85,4,26,'#4a2f1f');r(192,85,4,26,'#4a2f1f');
  [[80],[160]].forEach(([x])=>{r(x-1,70,2,10,'#c0a070');r(x-8,64,16,6,'#2a6a3a');r(x-8,64,16,1,'#4a9a5a');r(x-6,70,12,1,'#f4c96a')});
  r(110,76,22,4,'#f4efe4');r(120,76,2,4,'#c8c4b8');r(112,77,6,1,'#8a867a');r(124,77,6,1,'#8a867a');r(56,74,12,6,'#5a2a2e');r(56,72,12,2,'#3a4a6a');
  r(208,62,28,37,'#5a3a22');for(let j=0;j<4;j++)for(let i=0;i<3;i++){r(210+i*9,64+j*9,7,7,'#6e4a2e');r(213+i*9,67+j*9,2,1,'#c0a070')}
  return[[80,70,40,WARM],[160,70,40,WARM]]},
 // Use: a parked car at night, from the driver's seat. The lot, one sodium light, rain on the glass
 use(o){
  const g=c.createLinearGradient(0,-99,0,70);g.addColorStop(0,'#0a0c18');g.addColorStop(1,'#1e1e2c');c.fillStyle=g;c.fillRect(0,-99,240,170);
  // the lot through the windshield: a store front shut for the night, the light pole
  r(20,34,120,26,'#14141c');r(24,38,30,14,'#2a2a34');r(60,38,30,14,'#2a2a34');r(96,40,24,12,'#3a3a20');r(98,42,20,8,'#e7b65a');
  r(170,8,3,60,'#2a2a30');r(164,6,15,4,'#3a3a40');r(166,10,11,2,'#ffb050');glow(171,12,60,'255,170,80',.3);c.fillStyle='rgba(255,170,80,.1)';c.beginPath();c.moveTo(166,12);c.lineTo(176,12);c.lineTo(230,70);c.lineTo(112,70);c.fill();
  r(0,60,240,10,'#1a1a22');[[30,63],[90,63],[150,63],[210,63]].forEach(([x,y])=>r(x,y,14,1,'#e8e0d0'));
  for(let i=0;i<40;i++){const x=hs(i,11)*236|0,y=-99+(hs(i,12)*165|0);r(x,y,1,2,'rgba(200,210,230,.5)')}
  // the car around the glass: pillars, roof, the rear-view mirror with something hanging, the dash and the wheel
  c.fillStyle='#0c0c10';c.beginPath();c.moveTo(0,-99);c.lineTo(240,-99);c.lineTo(240,4);c.lineTo(0,4);c.fill();c.beginPath();c.moveTo(0,4);c.lineTo(22,4);c.lineTo(0,74);c.fill();c.beginPath();c.moveTo(240,4);c.lineTo(218,4);c.lineTo(240,74);c.fill();
  r(102,4,36,10,'#1a1a20');r(104,6,32,6,'#2a3040');r(119,14,1,14,'#6a6a70');r(117,28,5,7,'#3a8a5a');r(118,30,3,3,'#4aaa6a');
  r(0,70,240,BOT-70,'#141418');r(0,70,240,3,'#2a2a30');r(150,76,40,10,'#0a0a0e');r(156,78,6,6,'#3ff0e8');r(170,78,6,6,'#3a4a4a');r(180,80,6,4,'#d84a4a');
  c.strokeStyle='#1e1e24';c.lineWidth=7;c.beginPath();c.arc(76,118,40,Math.PI*1.08,Math.PI*1.92);c.stroke();r(70,82,12,16,'#1e1e24');
  r(108,90,20,10,'#2a2a30');r(112,92,12,6,'#e8e0d0');r(114,93,8,1,'#8a867a');
  return[[171,12,40,'255,170,80']]},
 // Sabbatical: a psych ward hallway. Pale green walls, a long run of doors, the tubes (one flickers), the station's glow
 sab(o){
  r(0,-99,240,FY+99,'#7a8a7a');const vx=120,vy=50;
  // one-point perspective: ceiling, walls, floor to the far end
  c.fillStyle='#9aa89a';c.beginPath();c.moveTo(0,-99);c.lineTo(240,-99);c.lineTo(140,36);c.lineTo(100,36);c.fill();
  c.fillStyle='#6a7a6a';c.beginPath();c.moveTo(0,-99);c.lineTo(100,36);c.lineTo(100,64);c.lineTo(0,140);c.fill();
  c.fillStyle='#62725f';c.beginPath();c.moveTo(240,-99);c.lineTo(140,36);c.lineTo(140,64);c.lineTo(240,140);c.fill();
  c.fillStyle='#8a9a92';c.beginPath();c.moveTo(0,140);c.lineTo(100,64);c.lineTo(140,64);c.lineTo(240,140);c.lineTo(240,BOT);c.lineTo(0,BOT);c.fill();
  r(100,36,40,28,'#4a5a52');r(112,40,16,24,'#3a4a42');r(114,44,12,8,'#c8e0d8');r(119,40,2,24,'#2a3a32');
  // tubes down the ceiling, getting smaller
  [[30,-10,60],[66,14,32],[88,28,14]].forEach(([d,y,w],i)=>{r(vx-w/2,y,w,3,'#e8f4ec');if(i===0){r(vx-w/2,y,w,3,'#c8d4cc');r(vx-w/2+4,y,w/3|0,3,'#e8f4ec')}});
  // doors along both walls, each with a small window
  // a wall's top and bottom edge at x (the walls run from the screen's edge to the far end at x 100 or 140)
  const door=(x0,x1,side)=>{const f=x=>side?(240-x)/100:x/100,top=x=>-99+135*f(x),bot=x=>140-76*f(x),ya=x=>bot(x)-(bot(x)-top(x))*.62;
   c.fillStyle='#4a5a6a';c.beginPath();c.moveTo(x0,ya(x0));c.lineTo(x1,ya(x1));c.lineTo(x1,bot(x1));c.lineTo(x0,bot(x0));c.fill();
   const mx=(x0+x1)/2|0,mw=Math.max(2,Math.abs(x1-x0)/4|0);r(mx-(mw>>1),(ya(x0)+ya(x1))/2+4|0,mw,Math.max(2,(bot(x0)-ya(x0))/5|0),'#c8e0d8')};
  door(12,34,0);door(58,72,0);door(86,92,0);door(228,206,1);door(182,168,1);door(154,148,1);
  // a wheelchair left in the hall, the floor's shine
  r(176,98,22,3,'#9aa0a6');r(178,84,3,16,'#9aa0a6');r(180,86,16,8,'#3a5a7a');c.strokeStyle='#6a7076';c.lineWidth=2;c.beginPath();c.arc(186,106,8,0,7);c.stroke();
  c.fillStyle='rgba(232,244,236,.12)';c.fillRect(108,70,24,60);r(0,140,240,1,'#6a7a6a');
  return[[120,-6,50,FLUO]]},
};
// which place each motivation sends you to (Personal Motivation) and each skill (Improve Skill, Special Training)
const MOTPLACE={'Faith':'church','Redemption':'church','Protect the innocent':'church','Family':'cemetery','Revenge':'cemetery','Duty':'cemetery','Find the truth':'motel','Curiosity':'motel','Money':'motel'};
const RANGE=['Firearms','Melee','Dodge','Athletics'];
const motPlace=m=>MOTPLACE[m]||'motel',skillPlace=k=>RANGE.includes(k)?'range':'library';
// the rooms that read as night by default (whatever the scene asks)
const ALWAYS_NIGHT={use:1,cemetery:1};
// indoor rooms get a ceiling on taller screens, so the wall above a room isn't bare: its color (the outdoor places,
// the car and the hallway have none)
const CEIL={partner:'#221e2c',kid:'#20243a',parent:'#2a1e22',sibling:'#1e2a2a',friend:'#1a1210',ex:'#3a3430',coworker:'#5a5e56',mentor:'#1e1814',
 church:'#1e1a24',motel:'#3a2c1c',therapy:'#2e3a3a',range:'#2a2a2a',library:'#1e1814'};

function render(key,w,h,o){
 const cv=document.createElement('canvas');cv.width=w;cv.height=h;c=cv.getContext('2d');c.imageSmoothingEnabled=false;
 // the floor line sits at half the screen's height (the dialog box covers the lower part)
 const fy=Math.max(FY,Math.round(h*.5)),T=fy-FY,sx=w/240;BOT=h-T;c.save();c.scale(sx,1);c.translate(0,T);
 c.fillStyle='#1c1622';c.fillRect(0,-T,240,h);
 const night=!!(o.night||ALWAYS_NIGHT[key]),room=ROOMS[key]?key:'partner';
 const lights=ROOMS[room]({night});
 const cc=CEIL[room];if(cc&&T>16){const cb=-14;r(0,-T,240,cb-3+T,cc);for(let x=0;x<240;x+=30)r(x,-T,1,cb-3+T,shadeHex(cc,-8));r(0,cb-3,240,2,shadeHex(cc,28));r(0,cb-1,240,1,shadeHex(cc,-14))}
 // the night shade over the room, or dusk's warm wash
 c.fillStyle=night?'rgba(13,15,30,.28)':'rgba(120,70,40,.08)';c.fillRect(0,-T,240,h);
 if(o.dress==='broken'){c.fillStyle='rgba(30,40,70,.38)';c.fillRect(0,-T,240,h)}
 else lights.forEach(([x,y,rad,col])=>glow(x,y,rad,col,.12));
 c.restore();
 if(o.dress==='arc'){const g=c.createRadialGradient(w/2,h*.4,h*.35,w/2,h*.4,w*.7);g.addColorStop(0,'rgba(214,164,58,0)');g.addColorStop(1,'rgba(214,164,58,.22)');c.fillStyle=g;c.fillRect(0,0,w,h);
  c.fillStyle='rgba(214,164,58,.5)';c.fillRect(0,0,w,1);c.fillRect(0,h-1,w,1);c.fillRect(0,0,1,h);c.fillRect(w-1,0,1,h)}
 return{cv,lights:o.dress==='broken'?[]:lights.map(([x,y,rad,col])=>[x*sx,y+T,rad,col])};
}
// draws a backdrop onto ctx at w × h: key is a Bond type or a place; o.night, o.dress ('broken' or 'arc')
function draw(ctx,key,w,h,o={}){
 const k=[key,w,h,!!o.night,o.dress||''].join('|');let e=cache.get(k);if(!e){e=render(key,w,h,o);cache.set(k,e);if(cache.size>40)cache.delete(cache.keys().next().value)}
 ctx.drawImage(e.cv,0,0);
 const t=performance.now()/1000;e.lights.forEach(([x,y,rad,col],i)=>{const f=.5+.5*Math.sin(t*2+i*1.7)*Math.sin(t*3.3+i);c=ctx;glow(x,y,rad,col,.05*f)});
}
const KEYS=Object.keys(ROOMS);
return{draw,KEYS,motPlace,skillPlace,has:k=>!!ROOMS[k]};
})();
