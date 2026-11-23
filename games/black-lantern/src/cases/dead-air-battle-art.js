// Black Lantern · cases/dead-air-battle-art.js · Dead Air's battle art (spec 020 part B, Nov 23, 2026).
// Made the way Good Manners' is (cases/good-manners-battle-art.js, GMB): big head-on battle sprites with the light rim,
// both damage steps for every enemy (Art, Townsfolk and monsters, Wounded enemies), the case's painted battle backdrops
// (Combat, Basics, Backgrounds) and the boss's 64 x 64 talking portrait. Art for this case only; it goes to the Asset
// Library's Dead Air page. Exposes window.DAB.
//   DAB.sprite(key, frame, step) -> cached canvas; frame 0/1 is the idle; step 0 unhurt, 1 at half HP, 2 at a quarter.
//      key: tireiron, gascan, shotgun, filmer (the crowd at Miss Odile's), static, listener, rowhand, nightline,
//      nightline2 (its second phase). The clean-up agent is the agency's own, drawn by Still Harvest's file (SHB).
//   DAB.size(key) -> [w, h]   DAB.portrait(ctx, open) draws THE NIGHT LINE's face   DAB.mapSprite(blink) -> {c, ax, ay}
//   DAB.backdrop(place, {w, h, light, low, feet}) -> the backdrop for 'halcott', 'booth', 'records', 'khlt', 'cane', 'radials'
window.DAB=(()=>{
const OL='#120c1c',D='#24141e',W='#f4efe6',MR='#5a1a22',DIAL='#ffb347',TOWER='#ff4a3d',CANE='#c8a850',MOSS='#8a9a7a';
const sh=(h,a)=>{const n=parseInt(h.slice(1),16),f=v=>Math.max(0,Math.min(255,Math.round(v+a)));return'#'+[n>>16,n>>8&255,n&255].map(v=>f(v).toString(16).padStart(2,'0')).join('')};
const hsh=(a,b,c=0)=>{let n=Math.imul(a|0,374761393)+Math.imul(b|0,668265263)+Math.imul(c|0,1442695041);n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967296};
// a pixel layer w × h in drawing coordinates; ox adds room either side (a wounded sprite leans and spills past its box)
function Ly(w,h,ox=0){const WW=w+2*ox,d=new Array(WW*h).fill(null);const L={w,h,d,W:WW,ox,
 g:(x,y)=>{x=Math.round(x)+ox;y=Math.round(y);return(x<0||y<0||x>=WW||y>=h)?null:d[y*WW+x]},
 p(x,y,c){x=Math.round(x)+ox;y=Math.round(y);if(x>=0&&y>=0&&x<WW&&y<h)d[y*WW+x]=c},
 r(x,y,a,b,c){for(let j=0;j<b;j++)for(let i=0;i<a;i++)L.p(x+i,y+j,c)},
 e(cx,cy,rx,ry,c){for(let y=Math.floor(cy-ry);y<=cy+ry;y++)for(let x=Math.floor(cx-rx);x<=cx+rx;x++){const a=(x+.5-cx)/rx,b=(y+.5-cy)/ry;if(a*a+b*b<=1)L.p(x,y,c)}},
 line(x0,y0,x1,y1,c,w=1){const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);for(let i=0;i<=n;i++){const x=Math.round(x0+(x1-x0)*i/n),y=Math.round(y0+(y1-y0)*i/n);L.r(x,y,w,w,c)}},
 tex(from,to,m=7){for(let y=0;y<h;y++)for(let x=-ox;x<w+ox;x++)if(L.g(x,y)===from&&(x*3+y*5)%m===0)L.p(x,y,to)}};return L}
// light from the upper left: the lit edge gets a rim, every edge a dark outline
function finish(L){const w=L.W,{h,d}=L,o=d.slice(),G=(x,y)=>(x<0||y<0||x>=w||y>=h)?null:d[y*w+x];for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x,v=d[i];
 if(v){if((x>0&&!G(x-1,y))||(y>0&&!G(x,y-1)))o[i]=sh(v,30)}
 else if(G(x-1,y)||G(x+1,y)||G(x,y-1)||G(x,y+1))o[i]=OL}return o}
function blit(c,L,ox=0,oy=0){const o=finish(L),w=L.W;for(let i=0;i<o.length;i++)if(o[i]){c.fillStyle=o[i];c.fillRect(ox+i%w,oy+(i/w|0),1,1)}}
// a small Storybook eye: white, iris, pupil and a lid line
function eye(L,x,y,ir){L.r(x,y,4,4,W);L.r(x+1,y+1,2,3,ir);L.p(x+1,y+2,D);L.p(x+2,y+1,'#ffffff');L.r(x,y-1,4,1,D)}
// a little transistor radio: case, grille, the amber dial
function transistor(L,x,y,w,h,c,lit){L.r(x,y,w,h,c);L.r(x+1,y+1,w-2,Math.max(2,h>>1),sh(c,-30));for(let j=y+2;j<y+1+(h>>1);j+=2)L.r(x+2,j,w-4,1,sh(c,-50));
 L.r(x+1,y+h-4,w-2,3,lit?DIAL:'#6a5a3a');L.p(x+2+((w-4)*.7|0),y+h-4,TOWER)}

// ================= THE ENEMIES =================
// The crowd at Miss Odile's steps: four frightened neighbors. One body, dressed four ways, with what each one carried.
// The one wrong detail: every one of them has a radio earbud in, the wire running into a shirt pocket.
const TOWN={tireiron:{sk:'#e0a882',shirt:'#5a7a9a',pants:'#3b4a6b',hat:'#c8b890',prop:'iron'},
 gascan:{sk:'#c98a62',shirt:'#8a5a3a',pants:'#4a4038',hat:'#2e4a3a',prop:'can'},
 shotgun:{sk:'#e6c0a0',shirt:'#c86a8a',pants:'#3a3a54',hair:'#6a3a1e',prop:'gun'},
 filmer:{sk:'#a8704a',shirt:'#3a8a5a',pants:'#2a2a34',hair:'#1a1418',prop:'phone',short:1}};
function townie(o){return{w:46,h:o.short?66:72,f(L,f){const sk=o.sk,j=o.shirt,jd=sh(j,-30),pn=o.pants,y0=o.short?-6:0;
 L.r(12,64+y0,9,7,'#3a2a1e');L.r(24,64+y0,9,7,'#3a2a1e');L.r(12,70+y0,10,1,'#2a1a10');L.r(24,70+y0,10,1,'#2a1a10');
 L.r(13,44+y0,8,21,pn);L.r(24,44+y0,8,21,sh(pn,-22));L.r(12,42+y0,22,3,'#2a1a10');
 L.r(10,21+y0,26,22,j);L.r(30,21+y0,6,22,jd);L.r(17,21+y0,12,2,sh(j,18));L.tex(j,sh(j,-12),9);
 // the earbud wire into the shirt pocket
 L.r(27,25+y0,5,5,jd);L.line(28,15+y0,29,26+y0,'#e8e4d8');
 // arms: what they carry
 L.r(4,23+f+y0,7,17,j);L.r(4,39+f+y0,7,5,sk);L.r(35,22-f+y0,7,17,jd);L.r(35,38-f+y0,7,5,sk);
 if(o.prop==='iron'){L.line(38,40-f+y0,44,8-f+y0,'#6a6e78',2);L.line(43,9-f+y0,40,4-f+y0,'#6a6e78',2)}
 if(o.prop==='can'){L.r(1,43+f+y0,12,14,'#c0392b');L.r(2,44+f+y0,4,12,'#e05a4a');L.r(9,40+f+y0,3,4,'#d8b040');L.r(4,40+f+y0,5,2,'#2a2a30')}
 if(o.prop==='gun'){L.line(6,44+f+y0,40,30-f+y0,'#3a2a20',2);L.line(24,37+y0,44,28-f+y0,'#5a5e68',2)}
 if(o.prop==='phone'){L.r(36,24-f+y0,7,12,'#14121a');L.r(37,25-f+y0,5,9,'#8ad8ff');L.r(38,24-f+y0,2,1,'#ffffff');L.p(42,25-f+y0,'#fff8c0')}
 // the head: small eyes, a worried mouth; a cap or hair
 L.r(19,16+y0,8,5,sh(sk,-25));L.e(23,11+y0,8,9,sh(sk,-28));L.e(22,10+y0,7,8,sk);
 eye(L,17,8+y0,'#4a6a8a');eye(L,24,8+y0,'#4a6a8a');L.r(19,15+y0,7,1,MR);L.p(18,14+y0,MR);L.p(22,12+y0,sh(sk,-30));
 if(o.hat){L.e(23,3+y0,9,4,o.hat);L.r(14,5+y0,19,2,sh(o.hat,-25));L.r(10,5+y0,8,2,sh(o.hat,-35))}
 if(o.hair){L.e(22,4+y0,9,5,o.hair);L.r(13,4+y0,3,10,o.hair);L.r(29,4+y0,3,o.short?6:12,o.hair)}
 L.p(28,12+y0,'#e8e4d8')}}}
const B={tireiron:townie(TOWN.tireiron),gascan:townie(TOWN.gascan),shotgun:townie(TOWN.shotgun),filmer:townie(TOWN.filmer),
// The Static: a man's outline made of the grey snow between stations, standing up out of the booth's speakers. Too many
// mouths in it, open at different heights, all of them a beat apart. It flickers: the snow is new every frame.
static:{w:50,h:80,f(L,f){const sd=f?7:3,sn=['#8a8a98','#5a5a6a','#b8b8c4','#3a3a4a','#e8e8f0','#6a6a7a','#2a2a38'];
 const fill=(x,y)=>L.p(x,y,sn[(hsh(x,y,sd)*7)|0]);
 // the outline: shoulders, head, arms hanging, legs that fade into a speaker cone at the bottom
 for(let y=0;y<80;y++)for(let x=0;x<50;x++){const head=((x-25)/9)**2+((y-11)/10)**2<1,body=y>=20&&y<62&&Math.abs(x-25)<15-Math.max(0,y-50)*.3,
  arms=y>=22&&y<58&&(Math.abs(x-7-(f&&y>40?1:0))<3.5||Math.abs(x-43+(f&&y>40?1:0))<3.5),legs=y>=60&&(Math.abs(x-18)<5||Math.abs(x-32)<5)&&hsh(x,y,sd+1)>(y-60)/22;
  if(head||body||arms||legs)fill(x,y)}
 // scanlines through it
 for(let y=2;y<78;y+=5)for(let x=0;x<50;x++)if(L.g(x,y))L.p(x,y,'#3a3a48');
 // the mouths: dark slots, one in the face, four more in the chest and arms, each with a pale line of teeth
 [[25,15,8],[18,29,6],[32,35,7],[24,46,8],[7,42,3],[43,30,3]].forEach(([x,y,w],i)=>{const o=(i+f)%2;L.r(x-w/2-1,y-1,w+2,5+o,'#3a1a24');L.r(x-w/2,y,w,3+o,'#0c0a12');for(let k=0;k<w;k+=2){L.p(x-w/2+k,y,'#e8e8f0');L.p(x-w/2+k+1,y+2+o,'#e8e8f0')}});
 // two eye-glints, not quite where eyes go
 L.r(20,8,2,2,'#ffffff');L.r(29,9,2,2,'#ffffff')}},
// The listeners in the cane: a townsman from 1979 made of cane trash and copper wire, in the shape of a man walking,
// with an old transistor radio where its head should be, its dial lit, held up to listen. Mud to the knees.
listener:{w:40,h:72,f(L,f){const tr=CANE,trd=sh(CANE,-50),wire='#c87a3a',mud='#4a3a2a';
 for(let y=22;y<68;y++)for(let x=8;x<32;x++){const body=y<46?Math.abs(x-20)<9:(Math.abs(x-15+(f&&y>56?1:0))<4||Math.abs(x-25-(f&&y>56?1:0))<4);
  if(body)L.p(x,y,hsh(x,y,4)<.5?tr:hsh(x,y,5)<.6?trd:'#8a7a4a')}
 // stalks sticking out of it, bound with wire
 for(let i=0;i<6;i++){const y=24+i*7;L.line(10,y,30,y+2,wire);L.line(9+((i*5)%4),y-2,4+((i*7)%5),y-8,tr)}
 L.r(11,58,20,10,mud);L.tex(mud,'#3a2a1e',4);
 // the arms: one hangs, one holds the radio up to where the ear would be
 L.line(10,26,4,48+f,trd,3);L.line(30,26,36,14-f,trd,3);L.line(36,14-f,32,6-f,trd,2);
 // the head: an old transistor radio, a little crooked, its dial lit
 transistor(L,12,0,16,20,'#7a5a3a',true);L.r(14,1,12,1,'#a88a5a');L.r(19,20,3,3,wire)}},
// The rowhand: taller, broader, its arms ending in cane knives instead of hands. A radio for a head, cracked.
rowhand:{w:50,h:86,f(L,f){const tr=CANE,trd=sh(CANE,-50),wire='#c87a3a',mud='#4a3a2a',knife='#8a8e98';
 for(let y=24;y<82;y++)for(let x=8;x<42;x++){const body=y<54?Math.abs(x-25)<12-Math.max(0,24-y)*.2:(Math.abs(x-18+(f&&y>70?1:0))<5||Math.abs(x-32-(f&&y>70?1:0))<5);
  if(body)L.p(x,y,hsh(x,y,6)<.5?tr:hsh(x,y,7)<.6?trd:'#8a7a4a')}
 for(let i=0;i<7;i++){const y=26+i*7;L.line(13,y,37,y+3,wire)}
 L.r(12,70,28,12,mud);L.tex(mud,'#3a2a1e',4);
 // the cane knives: long, flat, rust at the edge
 L.line(12,28,3,52+f,trd,3);L.line(3,52+f,1,80+f,knife,3);L.line(2,60+f,0,76+f,'#c8ccd4');L.p(1,79+f,'#8a3a2a');
 L.line(38,28,47,48-f,trd,3);L.line(47,48-f,49,74-f,knife,3);L.line(48,56-f,49,70-f,'#c8ccd4');
 // its head: a bigger radio, the case cracked across the dial
 transistor(L,14,0,22,24,'#5a3a2a',true);L.line(16,15,33,9,'#1a1010');L.r(22,24,6,3,wire)}},
// The boss: a tall thin man in a short-sleeved shirt and a skinny tie, dressed for work in 1979. Where his head should
// be, an old chrome desk microphone on its stand, the grille breathing. Cords run out of his back into the ground.
// Phase 2 ('nightline2'): it stops pretending. The grille splits open into a mouth, the cords stand up off the ground
// like a fan of wires, and every transistor dial along them is lit.
nightline:{w:88,h:128,f(L,f,ph2){const sk='#e6c8b0',skd=sh(sk,-30),sh1='#e8e2c8',shd=sh(sh1,-36),tie='#6a3a2a',pn='#4a4a5a',chrome='#c8ccd4',cd=sh(chrome,-60),t=f?1:0;
 // the cords from his back, down into the dirt, a wheel of them spreading at the floor
 const cords=ph2?[[30,40,4,0],[58,40,84,4],[34,44,0,40],[54,44,88,44],[40,48,16,126],[48,48,72,126]]:[[34,60,2,126],[54,60,86,126],[40,64,18,126],[48,64,70,126]];
 cords.forEach(([x0,y0,x1,y1],i)=>{L.line(x0,y0,x1,y1+(i%2?t:-t),'#2a2a30',2);if(ph2)L.r(x1-3+(x1>44?-2:2),y1-3,6,6,DIAL)});
 // legs, trousers too short, white socks, work shoes
 L.r(36,92,7,32,pn);L.r(46,92,7,32,sh(pn,-14));L.r(36,118,7,3,'#f4f0e8');L.r(46,118,7,3,'#f4f0e8');L.r(34,121,10,6,'#1a1418');L.r(45,121,10,6,'#1a1418');
 // the shirt: short sleeves, a pocket with pens, the skinny tie
 L.r(32,46,24,48,sh1);L.r(50,46,6,48,shd);L.r(32,90,24,4,'#2a2030');for(let y=50;y<90;y+=6)L.r(33,y,22,1,sh(sh1,-10));
 L.r(42,46,4,40,tie);L.r(41,46,6,4,sh(tie,-20));L.r(42,86,4,3,sh(tie,-30));
 L.r(35,56,7,7,shd);L.r(36,53,1,5,'#3a5ab0');L.r(38,53,1,5,'#c83a2a');
 // the arms: long, thin, too long; short sleeves; the hands hang open at the knees
 L.r(24,46,9,12,sh1);L.r(55,46,9,12,shd);L.r(26,58+t,5,40,skd);L.r(57,58-t,5,40,sh(sk,-40));L.r(25,98+t,7,7,sk);L.r(56,98-t,7,7,skd);
 [26,28,30].forEach(x=>L.r(x,105+t,1,5,sk));[57,59,61].forEach(x=>L.r(x,105-t,1,5,skd));
 // the collar, then the mic stand coming up out of it where the neck would be, and the big chrome mic head
 L.r(38,42,12,5,sh1);L.r(42,28,4,16,cd);L.r(43,28,1,16,chrome);
 L.e(44,16,13,15,cd);L.e(43,15,12,14,chrome);L.e(39,9,4,5,'#f4f8ff');
 if(!ph2){for(let y=6;y<26;y+=3)for(let x=34;x<54;x+=3)if(((x-44)/10)**2+((y-15)/11)**2<1)L.r(x,y+(t&&y>14?1:0),2,1,'#3a3e48');
  L.r(36,20,16,1,'#5a5e68')}
 else{for(let y=6;y<26;y+=3)for(let x=34;x<54;x+=3)if(((x-44)/10)**2+((y-15)/11)**2<1&&Math.abs(y-16)>3)L.r(x,y,2,1,'#3a3e48');
  L.e(44,16,10,4,'#0c0a12');for(let x=36;x<53;x+=2)L.r(x,13,1,2,'#e8e8f0');for(let x=37;x<52;x+=2)L.r(x,18,1,2,'#e8e8f0');L.r(41,15,6,2,MR)}
 // the ring that holds the mic on its yoke
 L.r(30,14,3,4,cd);L.r(55,14,3,4,cd);L.line(31,18,42,30,cd,2);L.line(56,18,46,30,cd,2)}}
};

// ================= WOUNDED ENEMIES (Art, Townsfolk and monsters, Wounded enemies) =================
// Two steps: at half HP and at a quarter. The crowd are people and bleed. The Static breaks up like a bad signal: rows
// go missing, then whole bands drop out. The cane things come apart into cane trash and spill wire; the radio heads
// crack. The Night Line's chrome dents and its grille caves, its shirt tears onto wires, and its cords snap.
const WPAD=8,BLOOD='#6e121c',BLOODW='#a8202c',HOLLOW='#140c12',TRASH=[CANE,'#8a7a4a',sh(CANE,-50)];
const grey=(h,k)=>{const n=parseInt(h.slice(1),16),r=n>>16,g=n>>8&255,b=n&255,l=(r*.3+g*.59+b*.11)*.82,f=v=>Math.max(0,Math.min(255,Math.round(v+(l-v)*k-k*18)));
 return'#'+[r,g,b].map(v=>f(v).toString(16).padStart(2,'0')).join('')};
const inBlob=(x,y,cx,cy,rx,ry,sd)=>{const a=(x+.5-cx)/rx,b=(y+.5-cy)/ry,t=Math.atan2(b,a),r=1+.22*Math.sin(5*t+sd)+.12*Math.sin(9*t+sd*2.3);return a*a+b*b<=r*r};
const blob=(L,cx,cy,rx,ry,sd,fn)=>{for(let y=Math.floor(cy-ry*1.4);y<=cy+ry*1.4;y++)for(let x=Math.floor(cx-rx*1.4);x<=cx+rx*1.4;x++)if(inBlob(x,y,cx,cy,rx,ry,sd))fn(x,y)};
const Wk={
 bite(L,cx,cy,rx,ry,sd=1){blob(L,cx,cy,rx,ry,sd,(x,y)=>{if(L.g(x,y))L.p(x,y,null)})},
 gash(L,cx,cy,rx,ry,sd=2,c=HOLLOW){blob(L,cx,cy,rx,ry,sd,(x,y)=>{if(L.g(x,y))L.p(x,y,c)})},
 stain(L,cx,cy,rx,ry,sd=3,c=BLOOD,c2=BLOODW){blob(L,cx,cy,rx,ry,sd,(x,y)=>{if(L.g(x,y))L.p(x,y,c)});blob(L,cx-rx*.15,cy-ry*.2,rx*.5,ry*.5,sd+1,(x,y)=>{if(L.g(x,y))L.p(x,y,c2)})},
 drip(L,x,y,n,c=BLOOD){for(let j=0;j<n;j++)for(const i of[0,1])if(L.g(x+i,y+j))L.p(x+i,y+j,c)},
 // wires spilling out of a hole: copper loops hanging down
 wires(L,x,y,n,len,sd=0){for(let i=0;i<n;i++){const x0=x+i*2-n;for(let j=0;j<len-((i*3+sd)%4);j++)L.p(x0+Math.round(Math.sin((j+i*2)*.6)),y+j,i%2?'#c87a3a':'#e0a060')}},
 // cane trash heaped at the feet
 heap(L,cx,rx,ry=3){const y=L.h-1;L.e(cx,y,rx,ry,TRASH[2]);L.e(cx-1,y,rx*.8,ry*.75,TRASH[1]);for(let i=1;i<rx*2-2;i+=3)L.line(cx-rx+i,y-ry+2,cx-rx+i+3,y-ry,TRASH[0])},
 // bad signal: rows drop out
 rows(L,y0,y1,step,sd){for(let y=y0;y<y1;y++)if((y*7+sd)%step===0)for(let x=-L.ox;x<L.w+L.ox;x++)L.p(x,y,null)},
 dull(L,x0,x1,amt){const d=x1>x0?1:-1;for(let y=0;y<L.h;y++)for(let x=x0;d>0?x<=x1:x>=x1;x+=d){const v=L.g(x,y);if(!v)continue;L.p(x,y,grey(v,amt*Math.min(1,.4+.6*Math.abs(x-x0)/Math.max(1,Math.abs(x1-x0)))))}},
 lean(L,dx,y0,y1){const W_=L.W,d=L.d;for(let y=0;y<y1;y++){const s=Math.round(dx*Math.min(1,(y1-y)/Math.max(1,y1-y0)));if(!s)continue;const row=d.slice(y*W_,y*W_+W_);for(let x=0;x<W_;x++){const sx=x-s;d[y*W_+x]=sx>=0&&sx<W_?row[sx]:null}}},
 sag(L,x0,y0,w,h,dy,dx=0){const px=[];for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++){const v=L.g(x,y);if(v){px.push([x,y,v]);L.p(x,y,null)}}px.forEach(([x,y,v])=>L.p(x+dx,y+dy,v))},
 cut(L,x,y,w,h){for(let j=0;j<h;j++)for(let i=0;i<w;i++)L.p(x+i,y+j,null)}
};
const person=(L,s,short)=>{const y=short?-6:0;
 if(s===1){Wk.stain(L,25,33+y,4,4,3);Wk.drip(L,24,36+y,7);Wk.stain(L,21,14+y,2.5,1.6,2);Wk.dull(L,24,46,.3);Wk.lean(L,-1,8,24)}
 else{Wk.stain(L,25,33+y,6,6,3);Wk.drip(L,22,38+y,9);Wk.drip(L,28,38+y,12);Wk.stain(L,17,52+y,2.5,6,4,BLOODW,'#c0303a');Wk.stain(L,21,14+y,3,2,2);
  Wk.sag(L,34,0,13,42,5,-1);Wk.dull(L,22,46,.5);Wk.lean(L,-3,8,40)}};
const WOUND={
 tireiron:(L,s)=>person(L,s),gascan:(L,s)=>person(L,s),shotgun:(L,s)=>person(L,s),filmer:(L,s)=>person(L,s,true),
 // the Static: the signal breaks up, then whole bands of it are gone and the outline leans like a bad picture
 static(L,s){Wk.rows(L,0,80,s>1?3:5,s);Wk.bite(L,36,40,s>1?6:3,s>1?10:5,2);if(s>1){Wk.bite(L,12,20,4,8,3);Wk.lean(L,5,0,60);Wk.dull(L,0,50,.4)}else Wk.lean(L,2,0,40)},
 // a listener: its chest comes open and spills wire; then the radio head cracks and hangs and an arm is gone
 listener(L,s){Wk.gash(L,20,34,s>1?5:3,s>1?7:4,2);Wk.wires(L,20,36,s>1?6:3,s>1?14:8,1);
  if(s===1){Wk.dull(L,20,40,.3);Wk.lean(L,1,6,30);Wk.heap(L,20,7)}
  else{Wk.cut(L,29,6,11,40);Wk.gash(L,18,9,4,3,3,'#1a1010');Wk.sag(L,10,0,20,22,3,2);Wk.dull(L,18,40,.55);Wk.lean(L,3,6,50);Wk.heap(L,22,13,4)}},
 rowhand(L,s){Wk.gash(L,25,40,s>1?6:4,s>1?9:5,2);Wk.wires(L,25,44,s>1?8:4,s>1?16:9,2);
  if(s===1){Wk.dull(L,24,50,.3);Wk.lean(L,1,6,40);Wk.heap(L,25,8)}
  else{Wk.cut(L,38,26,12,60);Wk.gash(L,25,11,6,4,3,'#1a1010');Wk.sag(L,12,0,26,26,4,-2);Wk.dull(L,22,50,.55);Wk.lean(L,-3,6,60);Wk.heap(L,26,15,4)}},
 // the Night Line: the chrome dents and the grille caves in; then the shirt tears open onto wires and dials, a sleeve
 // and an arm are gone, and two of its cords hang snapped
 nightline(L,s,f,ph2){Wk.gash(L,48,10,s>1?5:3,s>1?5:3,2,'#3a3e48');Wk.gash(L,40,64,s>1?5:3,s>1?8:5,3);Wk.wires(L,40,68,s>1?7:3,s>1?16:8,1);
  if(s===1){Wk.dull(L,44,88,.3);Wk.lean(L,2,10,46)}
  else{Wk.cut(L,55,44,12,70);Wk.wires(L,57,46,4,10,2);Wk.bite(L,36,6,4,4,1);Wk.gash(L,47,80,4,6,4);Wk.cut(L,0,100,14,28);Wk.cut(L,76,100,12,28);
   Wk.dull(L,40,88,.55);Wk.lean(L,4,10,64)}}
};

// ================= THE BOSS'S PORTRAIT (it talks) =================
// The big chrome mic over a short-sleeved collar and a skinny tie. Open: the grille parts into a mouth.
function portraitLayer(open){const L=Ly(64,64),chrome='#c8ccd4',cd=sh(chrome,-60);
 L.r(10,52,44,12,'#e8e2c8');L.r(30,52,4,12,'#6a3a2a');L.r(18,50,28,4,'#e8e2c8');L.r(29,40,6,12,cd);L.r(30,40,1,12,chrome);
 L.e(32,22,19,20,cd);L.e(31,21,18,19,chrome);L.e(24,12,5,6,'#f4f8ff');
 for(let y=8;y<38;y+=3)for(let x=15;x<49;x+=3)if(((x-32)/15)**2+((y-22)/15)**2<1&&(!open||Math.abs(y-24)>4))L.r(x,y,2,1,'#3a3e48');
 if(open){L.e(32,24,13,5,'#0c0a12');for(let x=21;x<44;x+=3)L.r(x,20,1,2,'#e8e8f0');for(let x=22;x<43;x+=3)L.r(x,27,1,2,'#e8e8f0')}
 L.r(10,20,4,6,cd);L.r(50,20,4,6,cd);return L}
const pc={};
function portrait(ctx,open){const k=open?1:0;if(!pc[k]){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');
  const g=x.createRadialGradient(22,18,4,32,32,46);g.addColorStop(0,'#3a2a24');g.addColorStop(1,'#120c14');x.fillStyle=g;x.fillRect(0,0,64,64);
  x.fillStyle='rgba(255,74,61,.18)';x.fillRect(48,4,12,6);blit(x,portraitLayer(k));pc[k]=c}
 ctx.clearRect(0,0,64,64);ctx.drawImage(pc[k],0,0)}

// ================= BATTLE BACKDROPS (Combat, Basics, Backgrounds) =================
// Head-on at battle scale, one per kind of place the case fights in: Bayou Street at night ('halcott': raised houses
// on piers, porch lights, Miss Odile's porch of radios), the broadcast booth ('booth', and the record room: acoustic
// tile, the board, the ON AIR light), the station lot ('khlt': cinder block, the dead sign, the tower), the cane at
// night ('cane': rows over your head, the tower's red light far off) and the radial field ('radials': bare dirt, copper
// wires like spokes, a wall of cane all round). Low SAN shrinks the lights; battle.js lays the sour over it.
const BDC={};
function backdrop(place,o){const f=BDRAW[place==='records'?'booth':place];if(!f)return null;const key=[place,o.light,o.low?1:0,o.w,o.h,o.feet].join('|');if(BDC[key])return BDC[key];
 const c=document.createElement('canvas');c.width=o.w;c.height=o.h;const g=c.getContext('2d');
 const hz=Math.round(Math.max(30,Math.min(o.feet-12,o.h*.44)));
 f(bdKit(g),o.w,o.h,hz,o);BDC[key]=c;return c}
function bdKit(g){const R=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))};
 const K={g,R,hash:(a,b=0)=>hsh(a,b,9),
  bands(y0,y1,cols,W_){const n=cols.length,hh=(y1-y0)/n;for(let i=0;i<n;i++){const a=Math.round(y0+i*hh),b=Math.round(y0+(i+1)*hh);R(0,a,W_,b-a,cols[i]);
   if(i<n-1)for(let x=0;x<W_;x++){if((x&1)===0)R(x,b-1,1,1,cols[i+1]);if((x&3)===1)R(x,b-2,1,1,cols[i+1])}}},
  ell(cx,cy,rx,ry,c){for(let y=-Math.ceil(ry);y<=Math.ceil(ry);y++){const q=1-(y/ry)**2;if(q<0)continue;const hw=rx*Math.sqrt(q);R(cx-hw,cy+y,hw*2,1,c)}},
  line(x0,y0,x1,y1,c,w=1){const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);for(let i=0;i<=n;i++)R(x0+(x1-x0)*i/n,y0+(y1-y0)*i/n,w,w,c)},
  pool(cx,cy,rx,ry,c,a,steps=4){g.globalCompositeOperation='lighter';g.globalAlpha=a/steps;for(let i=0;i<steps;i++){const k=1-i/steps;K.ell(cx,cy,rx*k,ry*k,c)}g.globalAlpha=1;g.globalCompositeOperation='source-over'},
  text(s,x,y,c){const F={A:'010101111101101',C:'111100100100111',D:'110101101101110',E:'111100110100111',H:'101101111101101',I:'111010010010111',K:'101101110101101',L:'100100100100111',N:'101111111111101',O:'111101101101111',R:'110101110101101',T:'111010010010010',1:'010110010010111',3:'111001111001111',4:'101101111001001',0:'111101101101111',' ':'000000000000000'};
   [...s].forEach((ch,i)=>{const b=F[ch];if(b)for(let j=0;j<15;j++)if(b[j]==='1')R(x+i*4+j%3,y+(j/3|0),1,1,c)})}};
 return K}
// the south Louisiana night: a humid blue-black with a few stars through the haze; by day, a warm washed-out white
function sky(K,W_,base,nt){if(nt){K.bands(0,base,['#06081a','#0a0e22','#10142a','#1a1a30','#22202e'],W_);for(let i=0;i<30;i++){const x=K.hash(i,3)*W_|0,y=K.hash(i,4)*(base*.7)|0;K.R(x,y,1,1,i%5?'#3a4060':'#a8a8c8')}}
 else{K.bands(0,base,['#a8c0cc','#bccad0','#d0d6d4','#e2e0d4','#ece6d4'],W_)}}
// the tower far off: a thin red-and-white mast with its light
function tower(K,x,top,base,nt,low){const R=K.R;for(let y=top;y<base;y+=2)R(x-(y-top)*.03,y,1+((y-top)*.05|0),2,((y-top)>>3)%2?(nt?'#3a2a30':'#e8e2d8'):(nt?'#5a2228':'#c8402e'));
 R(x-2,top-3,4,3,TOWER);K.pool(x,top-1,low?6:9,low?6:9,TOWER,nt?.6:.3,3)}
const BDRAW={
halcott(K,W_,H,hz,o){const R=K.R,nt=o.light!=='day',low=o.low,base=hz-6;
 sky(K,W_,base,nt);
 // live oaks with moss behind the houses
 for(let x=-10;x<W_;x+=46){K.ell(x+20,base-44,26,16,nt?'#10181a':'#4a6a4a');for(let k=0;k<9;k++)R(x+6+k*4,base-34,1,10+(k%3)*6,nt?'#2a3430':MOSS)}
 // raised houses on piers: siding, a porch with posts, steps, the dark under them
 [[-8,92,'#d8cdb0'],[96,98,'#b8c8a8'],[196,W_-188,'#8aa4ac']].forEach(([x,w,c],i)=>{const top=base-46,fl=base-14,bc=nt?sh(c,-96):c;
  R(x,top,w,fl-top,bc);for(let y=top+3;y<fl;y+=3)R(x,y,w,1,sh(bc,-14));for(let k=0;k<12;k++)R(x-4+k,top-k,w+8-k*2,1,nt?'#1a1418':'#4a3a2e');
  R(x,fl,w,3,nt?'#2a2024':'#8a6a4a');for(let px=x+4;px<x+w;px+=18)R(px,fl+3,4,base-fl-3,nt?'#1a1418':'#6a5a4a');R(x,fl+3,w,base-fl-3,'rgba(0,0,0,.35)');
  for(const wx of[x+10,x+w-26]){R(wx,top+10,16,12,nt?'#0e0c12':'#3a3440');R(wx+1,top+11,14,10,nt?(i===1?'#3a3040':'#e7b65a'):'#7a9ab8')}
  // the middle house is Miss Odile's: nine radios on the porch rail, dials lit
  if(i===1)for(let k=0;k<6;k++){const rx=x+8+k*14;R(rx,fl-9,10,8,['#6a4a32','#8a6a4a','#5a3a2a','#c8c0a8'][k%4]);R(rx+2,fl-4,6,2,nt?DIAL:'#5a4a3a');if(nt)K.pool(rx+5,fl-4,6,4,DIAL,.4,2)}
  if(nt){R(x+w/2-2,top+6,4,4,'#fff2b8');K.pool(x+w/2,top+8,low?14:20,low?10:14,'#ffcf80',.45,3)}});
 // the dirt street the fighters stand on, and a mailbox
 const C=nt?['#1e1a1c','#221d20','#262024']:['#8a7a5a','#857452','#7a6a4a'];R(0,hz-1,W_,2,nt?'#3a3034':'#a89070');K.bands(hz+1,H,C,W_);
 for(let i=0;i<36;i++){const x=K.hash(i,21)*W_|0,y=Math.round(hz+3+K.hash(i,22)*(H-hz-6));R(x,y,2,1,nt?'#302a2c':'#6a5a3a')}
 R(W_*.9,hz-20,2,22,nt?'#2a2a30':'#5a5a64');R(W_*.9-4,hz-26,10,6,nt?'#3a3a44':'#8a8a94');
 if(nt){const k=low?.65:1;K.pool(W_/2,H+4,118*k,(H-hz)*.7*k,'#ffcf80',.24,5)}},
booth(K,W_,H,hz,o){const R=K.R,low=o.low,nt=o.light!=='day';
 // the back wall: acoustic tiles with their holes, the ON AIR light, the window into the transmitter room
 R(0,0,W_,hz,'#3a2e2a');for(let y=4;y<hz-8;y+=12)for(let x=4;x<W_;x+=12){R(x,y,10,10,'#4a3e36');for(let k=0;k<3;k++)for(let j=0;j<3;j++)R(x+2+k*3,y+2+j*3,1,1,'#2a2020')}
 const ox=Math.round(W_*.5)-20,oy=6,lit=nt;R(ox-1,oy-1,42,12,'#14101a');R(ox,oy,40,10,lit?TOWER:'#4a1a1a');K.text('ON AIR',ox+8,oy+3,lit?'#fff0e0':'#6a2a2a');if(lit)K.pool(ox+20,oy+5,30,14,TOWER,.35,3);
 const wx=Math.round(W_*.72),wy=Math.max(22,hz-56);R(wx-2,wy-2,60,38,'#14101a');R(wx,wy,56,34,'#1a2a2a');for(let i=0;i<6;i++){R(wx+5+i*9,wy+8,5,22,nt?'#c86a3a':'#5a6a6a');R(wx+6+i*9,wy+10,2,6,nt?'#ffd890':'#8a9a9a');if(nt)K.pool(wx+7+i*9,wy+16,6,10,'#ff9a3c',.3,2)}
 // the board along the horizon: faders, VU meters, the host's mic on its arm
 const by=hz-22;R(0,by,W_,24,'#5a4632');R(0,by,W_,3,'#7a6448');for(let x=8;x<W_-8;x+=7){R(x,by+6,3,12,'#2a2020');R(x,by+8+((x*7)%8),3,3,'#c8c0a8')}
 for(const vx of[W_*.2,W_*.3]){R(vx,by-14,20,12,'#14101a');R(vx+1,by-13,18,10,'#e8d890');K.line(vx+3,by-4,vx+12+(nt?4:0),by-11,'#2a2020')}
 R(W_*.12,by-30,2,30,'#5a5e68');R(W_*.12-6,by-40,12,12,'#c8ccd4');R(W_*.12-5,by-39,10,10,'#8a8e98');
 // the carpet the fighters stand on, burned through in one spot
 const C=['#3a2a3a','#3e2e3e','#422e40'];K.bands(hz+1,H,C,W_);for(let i=0;i<40;i++){const x=K.hash(i,61)*W_|0,y=Math.round(hz+3+K.hash(i,62)*(H-hz-6));R(x,y,2,1,'#2e2030')}
 K.ell(W_*.3,hz+(H-hz)*.5,10,3,'#1a1018');
 const k=low?.65:1;K.pool(W_/2,-6,W_*.5*k,hz*.8*k,'#fff2c8',.14,4)},
khlt(K,W_,H,hz,o){const R=K.R,nt=o.light!=='day',low=o.low,base=hz-4;
 sky(K,W_,base,nt);
 // cane on the horizon, the tower on the right
 for(let x=0;x<W_;x+=3)R(x,base-10-((x*7)%5),2,10+((x*7)%5),nt?'#141c14':'#6a8a4a');
 tower(K,Math.round(W_*.8),4,base-8,nt,low);
 // the cinder-block station with its dead sign
 const sx=Math.round(W_*.08),sw=Math.round(W_*.5),st=base-40,bc=nt?'#3a3a44':'#c8c4b8';R(sx,st,sw,base-st,bc);for(let y=st+4;y<base;y+=5)for(let x=sx+((y/5|0)%2?0:6);x<sx+sw;x+=12)R(x,y,1,4,sh(bc,-20));for(let y=st+4;y<base;y+=5)R(sx,y,sw,1,sh(bc,-14));
 R(sx+10,st-12,52,10,nt?'#2a2030':'#e8e2d0');K.text('KH T 13 0',sx+12,st-9,nt?'#5a2a2a':'#a8323e');
 R(sx+sw-30,st+12,14,base-st-12,nt?'#14101a':'#5a5a64');if(nt){R(sx+sw-30,st+12,14,3,TOWER);K.pool(sx+sw-23,st+14,10,8,TOWER,.4,2)}
 const C=nt?['#22201e','#262320','#2a2622']:['#a89a84','#a09280','#988a78'];R(0,hz-1,W_,2,nt?'#3a3430':'#c8b8a0');K.bands(hz+1,H,C,W_);
 for(let i=0;i<50;i++){const x=K.hash(i,71)*W_|0,y=Math.round(hz+3+K.hash(i,72)*(H-hz-6));R(x,y,2,2,nt?'#3a3430':'#7a6a5a')}
 if(nt){const k=low?.65:1;K.pool(W_/2,H+4,118*k,(H-hz)*.7*k,'#ffcf80',.22,5)}},
cane(K,W_,H,hz,o){const R=K.R,low=o.low;
 sky(K,W_,hz-30,true);tower(K,Math.round(W_*.62),Math.max(4,hz-70),hz-30,true,low);
 // rows of cane over your head: three walls of stalks, the nearest tallest and darkest, leaves catching the red
 for(let layer=0;layer<3;layer++){const top=hz-30+layer*8-layer*4,col=['#1a2418','#141c12','#0e140c'][layer];
  for(let x=-2;x<W_;x+=2+layer){const h=hz-top+12+((x*13+layer*7)%10);R(x,hz+6-h,1,h,col);if((x+layer)%5===0)K.line(x,hz+6-h+8,x+6,hz+6-h+4,sh(col,20))}}
 for(let x=0;x<W_;x+=17){K.line(x,hz-20,x+10,hz-34,'#2a3420');R(x+10,hz-34,2,1,'#6a2a28')}
 // the row the fighters stand in: wet dirt, cane trash, a radio face-down in the mud
 const C=['#1c1612','#201914','#241c16'];R(0,hz-1,W_,2,'#2e2418');K.bands(hz+1,H,C,W_);
 for(let i=0;i<40;i++){const x=K.hash(i,81)*W_|0,y=Math.round(hz+3+K.hash(i,82)*(H-hz-6));K.line(x,y,x+5,y-1,'#4a3e28')}
 R(W_*.7,hz+(H-hz)*.4,10,6,'#5a3a2a');R(W_*.7+2,hz+(H-hz)*.4+4,6,2,DIAL);
 const k=low?.65:1;K.pool(W_/2,H+4,110*k,(H-hz)*.65*k,'#ffcf80',.2,5);K.pool(W_*.62,hz-60,30,20,TOWER,.12,3)},
radials(K,W_,H,hz,o){const R=K.R,low=o.low;
 sky(K,W_,hz-16,true);tower(K,Math.round(W_*.18),4,hz-24,true,low);
 // the wall of cane all round the circle
 for(let x=-2;x<W_;x+=2){const h=26+((x*11)%9);R(x,hz-h,1,h,x%4?'#141c12':'#1a2418')}
 // the bare circle: pale dirt, the copper wires coming up out of it like spokes toward a center, little dials glowing
 const C=['#3a3026','#40352a','#463a2e'];R(0,hz-1,W_,2,'#4a3e30');K.bands(hz+1,H,C,W_);
 const cx=W_/2,cy=hz+4;for(let i=0;i<14;i++){const a=Math.PI*(.05+i/13*.9),x1=cx+Math.cos(a)*W_*.7,y1=cy+Math.sin(a)*(H-hz)*1.4;K.line(cx,cy,x1,y1,'#a8602a');K.line(cx,cy+1,x1,y1+1,'#5a3018')}
 for(let i=0;i<7;i++){const x=W_*(.12+i*.13),y=hz+8+((i*5)%3)*6;R(x,y,6,4,'#5a3a2a');R(x+1,y+2,4,1,DIAL);K.pool(x+3,y+2,5,4,DIAL,.4,2)}
 const k=low?.65:1;K.pool(W_/2,H+4,110*k,(H-hz)*.65*k,'#ffcf80',.18,5);K.pool(cx,cy,40*k,10*k,DIAL,.2,3)}
};

const SZ=k=>{const A=B[k==='nightline2'?'nightline':k];return A?[A.w,A.h]:[16,16]};
const cache=new Map();
// step: 0 unhurt, 1 at half HP, 2 at a quarter. A wounded sprite is 8 px wider each side so a lean or a spill isn't cut
// off; drawn centred, so it stays put, and the same height, so the feet stay on the ground.
function sprite(k,frame,step){step=step|0;const ph2=k==='nightline2',base=ph2?'nightline':k,key=k+(frame?1:0)+':'+step;let c=cache.get(key);if(c)return c;const A=B[base];if(!A)return null;
 const L=Ly(A.w,A.h,step?WPAD:0);A.f(L,frame?1:0,ph2);if(step){Wk.cut(L,-WPAD,0,WPAD,A.h);Wk.cut(L,A.w,0,WPAD,A.h);if(WOUND[base])WOUND[base](L,step,frame?1:0,ph2)}
 c=document.createElement('canvas');c.width=L.W;c.height=A.h;blit(c.getContext('2d'),L);cache.set(key,c);return c}
// the boss on the radial field's map, before the fight: its battle sprite at about a townsperson's height
let mapC=null;
function mapSprite(blink){if(!mapC){const s=sprite('nightline',0,0),k=40/s.height,c=document.createElement('canvas');c.width=Math.round(s.width*k);c.height=40;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(s,0,0,c.width,c.height);mapC={c,ax:Math.round(c.width/2),ay:38,noShadow:false}}
 return mapC}
return{B,sprite,size:SZ,portrait,backdrop,mapSprite};
})();
