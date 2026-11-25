// Black Lantern · cases/lantern-03-battle-art.js · LANTERN 03's battle art (spec 015, Nov 25, 2026).
// SPOILERS for the case: its enemies and its boss. Made the way LANTERN 01's is (cases/lantern-01-battle-art.js): big
// head-on battle sprites with the light rim, both damage steps for every enemy (Art, Townsfolk and monsters, Wounded
// enemies), the case's painted battle backdrops (Combat, Basics, Backgrounds) and the boss's 64 x 64 talking portrait.
// Art for this case only; it goes to the Asset Library's LANTERN 03 page. Exposes window.L03B.
//   L03B.sprite(key, frame, step) -> cached canvas; frame 0/1 is the idle; step 0 unhurt, 1 at half HP, 2 at a quarter.
//      key: filing, sec, guard, almoner, almoner2 (its second phase). The clean-up agent is the agency's own and is
//      drawn by Still Harvest's file (SHB), the same crew in every case.
//   L03B.size(key) -> [w, h]   L03B.portrait(ctx, open) draws THE ALMONER's face
//   L03B.backdrop(place, {w, h, light, low, feet}) -> the backdrop for 'lot', the rooms ('lobby', 'intake'), 'stacks'
//      or 'basement' (the cold room)
window.L03B=(()=>{
const OL='#120c1c',D='#24141e',W='#f4efe6',MR='#5a1a22';
const sh=(h,a)=>{const n=parseInt(h.slice(1),16),f=v=>Math.max(0,Math.min(255,Math.round(v+a)));return'#'+[n>>16,n>>8&255,n&255].map(v=>f(v).toString(16).padStart(2,'0')).join('')};
function Ly(w,h,ox=0){const WW=w+2*ox,d=new Array(WW*h).fill(null);const L={w,h,d,W:WW,ox,
 g:(x,y)=>{x=Math.round(x)+ox;y=Math.round(y);return(x<0||y<0||x>=WW||y>=h)?null:d[y*WW+x]},
 p(x,y,c){x=Math.round(x)+ox;y=Math.round(y);if(x>=0&&y>=0&&x<WW&&y<h)d[y*WW+x]=c},
 r(x,y,a,b,c){for(let j=0;j<b;j++)for(let i=0;i<a;i++)L.p(x+i,y+j,c)},
 rm(x,y,a,b,c){for(let j=0;j<b;j++)for(let i=0;i<a;i++)if(L.g(x+i,y+j))L.p(x+i,y+j,c)},
 e(cx,cy,rx,ry,c){for(let y=Math.floor(cy-ry);y<=cy+ry;y++)for(let x=Math.floor(cx-rx);x<=cx+rx;x++){const a=(x+.5-cx)/rx,b=(y+.5-cy)/ry;if(a*a+b*b<=1)L.p(x,y,c)}},
 line(x0,y0,x1,y1,c,w=1){const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);for(let i=0;i<=n;i++){const x=Math.round(x0+(x1-x0)*i/n),y=Math.round(y0+(y1-y0)*i/n);L.r(x,y,w,w,c)}},
 tex(from,to,m=7){for(let y=0;y<h;y++)for(let x=-ox;x<w+ox;x++)if(L.g(x,y)===from&&(x*3+y*5)%m===0)L.p(x,y,to)}};return L}
function finish(L){const w=L.W,{h,d}=L,o=d.slice(),G_=(x,y)=>(x<0||y<0||x>=w||y>=h)?null:d[y*w+x];for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x,v=d[i];
 if(v){if((x>0&&!G_(x-1,y))||(y>0&&!G_(x,y-1)))o[i]=sh(v,30)}
 else if(G_(x-1,y)||G_(x+1,y)||G_(x,y-1)||G_(x,y+1))o[i]=OL}return o}
function blit(c,L,ox=0,oy=0){const o=finish(L),w=L.W;for(let i=0;i<o.length;i++)if(o[i]){c.fillStyle=o[i];c.fillRect(ox+i%w,oy+(i/w|0),1,1)}}
// a paper scrap with lines on it and a number in the corner
function page(L,x,y,w,h,c='#e8dcc0'){L.r(x,y,w,h,c);for(let j=2;j<h-1;j+=2)L.r(x+1,y+j,w-2,1,sh(c,-50));L.p(x+w-2,y+1,'#6a2a24')}

// ================= THE ENEMIES =================
const NAVY='#2a3450',NAVYD='#1c2438',SK='#c89070',COAT='#1a1a22',COATL='#2e2e3c',FACE='#dccab4';
const B={
// The Filing: the season's pages, stood up into a man. Folders for shoulders, a box lid for a head, evidence tags for
// teeth, string for veins. The wrong detail: every page has a number, and they're in order.
filing:{name:'The Filing',w:60,h:92,f(L,f){const t=f?1:0;
 for(let y=26;y<90;y++){const hw=12+Math.round(Math.sin(y/7+t)*2)+(y>70?(y-70)/3:0);for(let x=30-hw;x<30+hw;x++)if((x*7+y*3)%11<9)L.p(x,y,(x+y)%5?'#e8dcc0':'#d0c4a4')}
 for(let i=0;i<18;i++){const x=10+((i*13)%36),y=28+((i*17)%58);page(L,x,y,7,6,i%4?'#e8dcc0':'#f4ecd8')}
 L.r(4,22,18,10,'#c8a040');L.r(38,22,18,10,'#c8a040');L.r(4,22,18,2,'#e8c870');L.r(38,22,18,2,'#e8c870');
 L.r(16-t,2,28,20,'#a88a5a');L.r(16-t,2,28,3,'#c8aa7a');L.r(20-t,9,20,5,'#e8e4d8');L.r(22-t,11,16,1,'#2a2030');
 for(let i=0;i<5;i++){L.r(20-t+i*4,16,3,5,'#e8e4d8');L.p(21-t+i*4,20,'#a8323e')}
 L.r(2,30,6,34,'#d8ccb0');L.r(52,30,6,34,'#d8ccb0');for(let k=0;k<4;k++){page(L,0,58+k*3,8,4);page(L,52,58+k*3,8,4)}
 L.line(12,36,40,70,'#c8402e');L.line(44,34,22,80,'#c8402e')}},
// Internal Security: a navy blazer, a badge on the pocket, a flashlight up by the ear, a clipboard under the arm. Tired.
sec:{name:'Internal Security',w:46,h:92,f(L,f){const t=f?1:0;
 L.r(12,60,9,30,'#22222c');L.r(25,60,9,30,'#1c1c26');L.r(10,88,12,4,'#0e0e12');L.r(24,88,12,4,'#0e0e12');
 for(let y=28;y<64;y++){const hw=12+Math.round((y-28)*.06);L.r(23-hw,y,hw*2,1,NAVY);L.r(23+hw-4,y,4,1,NAVYD)}
 L.r(20,28,6,16,'#e8e4d8');L.r(22,30,2,14,'#3a3a44');L.r(27,36,6,5,'#c8a040');L.r(28,37,4,2,'#e8c870');
 L.r(6,30,6,30,NAVY);L.r(34,30,6,26,NAVYD);L.r(6,58,6,6,SK);L.r(33,24-t,8,8,SK);L.r(34,12-t,6,14,'#3a3a44');L.r(35,10-t,4,3,'#ffe8a0');
 L.r(2,40,10,14,'#a88a5a');L.r(3,42,8,1,'#e8e4d8');L.r(3,45,8,1,'#e8e4d8');
 L.e(23,16,9,10,SK);L.e(23,9,9,4,'#2a1e18');L.r(18,15,3,2,W);L.r(26,15,3,2,W);L.p(19,15,D);L.p(27,15,D);L.r(20,22,6,1,MR);L.r(17,13,4,1,D);L.r(26,13,4,1,D)}},
// The Almoner: tall, courteous, in an old deacon's long black coat buttoned to the throat, a white collar, the Ledger
// held open in both hands like a hymnal. His face too even, drawn from a description; his eyes shut, and he tracks you.
// Phase 2 ('almoner2'): his eyes open, ordinary and kind and brown, and the pages come loose around him in a storm.
almoner:{name:'The Almoner',w:72,h:132,f(L,f,ph2){const t=f?1:0,c=COAT,cl=COATL,s=FACE;
 L.r(24,112,10,20,'#14141a');L.r(38,112,10,20,'#101016');
 for(let y=32;y<116;y++){const hw=14+Math.round((y-32)*.14);L.r(36-hw,y,hw*2,1,c);L.r(36-hw,y,3,1,cl)}
 L.r(35,34,2,80,'#0a0a10');for(let y=40;y<110;y+=9)L.r(33,y,2,2,'#5a5a64');
 L.r(29,28,14,6,W);L.r(30,30,12,1,'#d8d8d8');
 // the arms forward, the Ledger open in his hands
 L.r(14,38+t,8,40,c);L.r(50,38-t,8,40,c);L.r(14,74,44,4,c);
 L.r(16,62,40,18,'#4a2a1e');L.r(18,63,17,15,'#e8dcc0');L.r(37,63,17,15,'#e4d8bc');for(let j=66;j<77;j+=2){L.r(20,j,13,1,'#8a7a64');L.r(39,j,13,1,'#8a7a64')}L.r(35,62,2,18,'#2a1810');
 L.r(16,78,6,4,s);L.r(50,78,6,4,s);
 // the head: long, too even, the hair combed flat, the eyes shut (open in phase 2)
 L.e(36,16,12,15,sh(s,-36));L.e(36,15,11,14,s);L.e(36,4,11,6,'#2a2228');L.r(25,4,3,10,'#2a2228');L.r(44,4,3,10,'#2a2228');
 if(ph2){for(const x of[29,39]){L.r(x,13,6,4,W);L.r(x+2,13,3,4,'#6a4a2a');L.p(x+3,14,D)}}
 else{L.r(29,15,6,1,'#5a4a44');L.r(39,15,6,1,'#5a4a44');L.p(29,14,'#5a4a44');L.p(44,14,'#5a4a44')}
 L.r(35,18,2,5,sh(s,-24));L.r(32,25,8,1,MR);L.p(31,24,MR);L.p(40,24,MR);
 // phase 2: pages loose in the air around him
 if(ph2)for(let i=0;i<14;i++){const x=2+((i*23+t*5)%64),y=6+((i*31)%100);if(x>20&&x<52&&y>20)continue;page(L,x,y,7,5,i%3?'#e8dcc0':'#f4ecd8')}}}
};
B.guard=Object.assign({},B.sec,{name:'Night security'});

// ================= WOUNDED ENEMIES (Art, Townsfolk and monsters, Wounded enemies) =================
// Two steps: at half HP and at a quarter. The Filing tears and sheds pages; the guards bruise and bleed and sag; the
// Almoner's coat tears onto paper, not flesh, and at a quarter whole leaves of him are missing, edges charred.
const WPAD=8;
const blob=(L,cx,cy,rx,ry,fn)=>{for(let y=Math.floor(cy-ry);y<=cy+ry;y++)for(let x=Math.floor(cx-rx);x<=cx+rx;x++){const a=(x+.5-cx)/rx,b=(y+.5-cy)/ry,r=1+.2*Math.sin(5*Math.atan2(b,a));if(a*a+b*b<=r*r)fn(x,y)}};
const Wk={
 bite(L,cx,cy,rx,ry){blob(L,cx,cy,rx,ry,(x,y)=>{if(L.g(x,y))L.p(x,y,null)})},
 stain(L,cx,cy,rx,ry,c='#6e121c'){blob(L,cx,cy,rx,ry,(x,y)=>{if(L.g(x,y))L.p(x,y,c)})},
 papery(L,cx,cy,rx,ry){blob(L,cx,cy,rx,ry,(x,y)=>{if(L.g(x,y))L.p(x,y,(x+y)%3?'#e8dcc0':'#3a2a1e')})},
 dull(L,amt){for(let y=0;y<L.h;y++)for(let x=-L.ox;x<L.w+L.ox;x++){const v=L.g(x,y);if(!v)continue;const n=parseInt(v.slice(1),16),r=n>>16,g=n>>8&255,b=n&255,l=(r*.3+g*.59+b*.11)*.8;
  L.p(x,y,'#'+[r,g,b].map(q=>Math.max(0,Math.min(255,Math.round(q+(l-q)*amt-amt*16))).toString(16).padStart(2,'0')).join(''))}},
 lean(L,dx,y1){const Wd=L.W,d=L.d;for(let y=0;y<y1;y++){const s=Math.round(dx*(y1-y)/y1);if(!s)continue;const row=d.slice(y*Wd,y*Wd+Wd);for(let x=0;x<Wd;x++){const sx=x-s;d[y*Wd+x]=sx>=0&&sx<Wd?row[sx]:null}}},
 scraps(L,n,sd=0){for(let i=0;i<n;i++)page(L,2+((i*19+sd)%(L.w-10)),L.h-6-((i+sd)%3)*2,6,4)},
 cut(L,x,y,w,h){for(let j=0;j<h;j++)for(let i=0;i<w;i++)L.p(x+i,y+j,null)}
};
const WOUND={
 filing(L,s){Wk.bite(L,22,46,s>1?7:4,s>1?9:5);Wk.scraps(L,s>1?8:4,1);if(s>1){Wk.cut(L,38,20,22,14);Wk.bite(L,36,70,6,8);Wk.lean(L,4,60)}Wk.dull(L,s>1?.5:.25)},
 sec(L,s){Wk.stain(L,20,18,2,2);Wk.stain(L,14,44,3,4);if(s>1){Wk.stain(L,28,50,4,6);Wk.lean(L,3,60);Wk.stain(L,24,22,3,2)}Wk.dull(L,s>1?.45:.2)},
 almoner(L,s){Wk.papery(L,24,60,s>1?6:4,s>1?10:6);Wk.papery(L,48,90,s>1?5:3,s>1?8:5);if(s>1){Wk.papery(L,36,10,4,3);Wk.bite(L,58,50,6,12);Wk.lean(L,3,80);Wk.scraps(L,6,2)}Wk.dull(L,s>1?.4:.15)}
};
WOUND.guard=WOUND.sec;

// ================= THE BOSS'S PORTRAIT (it talks) =================
// His face, close: long and too even, combed flat, the white collar, eyes shut and a little smile, like a man listening
// to a hymn he likes. Behind him, the Ledger's pages.
function portraitLayer(open){const L=Ly(64,64),s=FACE;
 for(let i=0;i<8;i++)page(L,2+(i*17)%56,2+(i*11)%20,8,6);
 L.e(34,66,24,15,'#0a0a10');L.e(30,65,22,14,COAT);L.r(26,46,12,6,W);L.r(27,48,10,1,'#d8d8d8');
 L.e(33,32,14,18,sh(s,-40));L.e(32,31,13,17,s);L.e(28,26,5,6,sh(s,12));L.e(32,15,13,6,'#2a2228');L.r(19,15,3,12,'#2a2228');L.r(43,15,3,12,'#2a2228');
 L.r(22,30,7,1,'#5a4a44');L.r(36,30,7,1,'#5a4a44');L.p(22,29,'#5a4a44');L.p(42,29,'#5a4a44');L.r(21,27,8,1,'#3a2a28');L.r(35,27,8,1,'#3a2a28');
 L.r(31,33,2,7,sh(s,-28));
 if(open){L.r(27,42,10,4,MR);L.r(28,43,8,2,'#1a0a0c')}else{L.r(27,43,10,1,MR);L.p(26,42,MR);L.p(37,42,MR)}
 return L}
const pc={};
function portrait(ctx,open){const k=open?1:0;if(!pc[k]){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');
  const gr=x.createRadialGradient(22,18,4,32,32,46);gr.addColorStop(0,'#3a3630');gr.addColorStop(1,'#14120e');x.fillStyle=gr;x.fillRect(0,0,64,64);blit(x,portraitLayer(k));pc[k]=c}
 ctx.clearRect(0,0,64,64);ctx.drawImage(pc[k],0,0)}

// ================= BATTLE BACKDROPS (Combat, Basics, Backgrounds) =================
// Head-on at battle scale, one per kind of place the case fights in: the lot ('lot': the annex front in snow under
// sodium light), an office ('lobby', 'intake': a wall, a desk, a tube light), the stacks ('stacks': rolling shelves going
// back, lit or red) and the cold room ('basement': shelves of boxes, the lectern, the vault door, cold). Low SAN shrinks
// the lights like on the map, and battle.js lays the sour over it.
const BDC={};
const PLACE={lot:'lot',lobby:'room',intake:'room',stacks:'stacks',basement:'cold'};
function backdrop(place,o){const f=BDRAW[PLACE[place]];if(!f)return null;const key=[place,o.light,o.low?1:0,o.w,o.h,o.feet].join('|');if(BDC[key])return BDC[key];
 const c=document.createElement('canvas');c.width=o.w;c.height=o.h;const g=c.getContext('2d');
 const hz=Math.round(Math.max(30,Math.min(o.feet-12,o.h*.44)));
 f(kit(g),o.w,o.h,hz,o,place);BDC[key]=c;return c}
function kit(g){const R=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))};
 const K={g,R,
  hash:(a,b=0)=>{let n=Math.imul(a|0,374761393)+Math.imul(b|0,668265263);n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967296},
  bands(y0,y1,cols,Wd){const n=cols.length,hh=(y1-y0)/n;for(let i=0;i<n;i++){const a=Math.round(y0+i*hh),b=Math.round(y0+(i+1)*hh);R(0,a,Wd,b-a,cols[i])}},
  pool(cx,cy,rx,ry,c,a,steps=4){g.globalCompositeOperation='lighter';g.globalAlpha=a/steps;for(let i=0;i<steps;i++){const k=1-i/steps;g.fillStyle=c;g.beginPath();g.ellipse(cx,cy,Math.max(1,rx*k),Math.max(1,ry*k),0,0,6.283);g.fill()}g.globalAlpha=1;g.globalCompositeOperation='source-over'}};
 return K}
const BDRAW={
lot(K,Wd,H,hz,o){const R=K.R,low=o.low,base=hz-4;
 K.bands(0,base,['#06080e','#0a0c16','#0e1220','#121828'],Wd);
 const t=Math.max(4,base-80);R(0,t,Wd,base-t,'#4a5058');for(let y=t;y<base;y+=4)for(let x=(y/4%2)*8;x<Wd;x+=16)R(x,y,15,3,'#525860');R(0,t,Wd,5,'#2a2a30');R(0,t+4,Wd,2,'#e8ecf0');
 for(let i=0;i<4;i++){const x=12+i*60;R(x,t+16,26,18,'#1a2030');for(let k=3;k<26;k+=5)R(x+k,t+16,1,18,'#8a8e96')}
 const dx=Math.round(Wd*.45);R(dx,base-44,34,44,'#7a8a9a');R(dx+16,base-44,2,44,'#2a2a30');K.pool(dx+17,base-22,24,24,'#ffe8a0',.25,3);
 const lx=Math.round(Wd*.82),lt=Math.max(6,base-74);R(lx-1,lt,3,base-lt,'#14121a');R(lx-5,lt,11,4,'#14121a');R(lx-4,lt+4,9,3,'#ffb860');
 const k=low?.7:1;K.pool(lx,lt+8,26*k,26*k,'#ffb860',.4,4);K.pool(lx,base+6,50*k,12*k,'#ffb860',.3,4);
 R(0,hz-1,Wd,2,'#9aa0aa');K.bands(hz+1,H,['#c8ccd4','#bcc0ca','#b0b4c0'],Wd);for(let i=0;i<30;i++)R(K.hash(i,81)*Wd,hz+4+K.hash(i,82)*(H-hz-6),4,1,'#9aa0ac');
 for(let i=0;i<80;i++){const x=K.hash(i,61)*Wd|0,y=K.hash(i,62)*H|0;R(x,y,i%4?1:2,i%4?1:2,'rgba(240,244,250,.75)')}},
room(K,Wd,H,hz,o,place){const R=K.R,nt=o.light==='night',low=o.low,base=hz-2;
 R(0,0,Wd,base,place==='intake'?'#5a4030':'#8a8878');for(let x=8;x<Wd;x+=place==='intake'?10:40)R(x,0,1,base,place==='intake'?'#3a2a1e':'#7a786a');
 R(0,base-14,Wd,3,'#3a3632');
 if(place==='intake'){const bx=10,by=Math.max(6,base-80);R(bx,by,90,52,'#5a3a1c');R(bx+3,by+3,84,46,'#9a6a3a');for(let i=0;i<14;i++)R(bx+6+(i%5)*16,by+6+((i/5)|0)*14,12,9,'#e8e4d8');
  for(let i=0;i<6;i++){g_line(K,bx+12+(i%5)*16,by+10,bx+44,by+24,'#c8402e')}}
 else{for(let i=0;i<6;i++){const px=14+i*20,py=Math.max(6,base-70);R(px,py,16,16,'#c8a040');R(px+2,py+2,12,12,'#8a8a8a')}}
 const tx=Math.round(Wd*.55);R(tx-24,2,48,4,nt?'#3a3a40':'#e8f0f0');if(!nt)K.pool(tx,8,60,40,'#e8f0f0',low?.12:.2,4);
 if(nt){R(Wd-40,6,22,9,'#2a0a0a');R(Wd-38,8,18,5,'#ff3a2a');K.pool(Wd-29,10,30,20,'#ff3a2a',.3,4)}
 R(Math.round(Wd*.6),base-30,90,28,'#5a4a3a');R(Math.round(Wd*.6),base-30,90,3,'#7a6a5a');
 R(0,hz-1,Wd,2,'#2a2624');K.bands(hz+1,H,place==='intake'?['#5a4a5a','#544454','#4e3e4e']:['#a8a498','#9e9a8e','#949084'],Wd);
 if(nt){g_tint(K,Wd,H,'rgba(120,10,10,.28)')}},
stacks(K,Wd,H,hz,o){const R=K.R,nt=o.light==='night',low=o.low,base=hz-2;
 R(0,0,Wd,base,nt?'#0e0808':'#3a3e40');
 // rolling shelves going back, a vanishing aisle in the middle
 const cx=Wd/2;for(let i=0;i<6;i++){const k=i/6,w=(1-k)*Wd*.42,hh=(1-k)*base*.9,y=base-hh;
  for(const sgn of[-1,1]){const x0=sgn<0?cx-w-(1-k)*20:cx+(1-k)*20;R(x0,y,w,hh,nt?'#2a1a1a':'#6a7078');for(let r=0;r<5;r++){R(x0,y+r*hh/5,w,2,nt?'#1a0e0e':'#4a5058');for(let b=0;b<w;b+=10*(1-k)+3)R(x0+b+1,y+r*hh/5+3,8*(1-k)+2,hh/5-4,nt?'#3a2418':'#a88a5a')}}}
 if(nt){K.pool(cx,base*.4,30,30,'#ff3a2a',low?.25:.4,4);R(cx-6,6,12,5,'#ff3a2a')}else K.pool(cx,10,80,40,'#e8f0f0',low?.12:.22,4);
 R(0,hz-1,Wd,2,nt?'#1a1010':'#5a5856');K.bands(hz+1,H,nt?['#1e1414','#221616','#261818']:['#5e5c58','#585650','#52504a'],Wd);
 for(let x=0;x<Wd;x+=24)R(x,hz+2,1,H-hz,nt?'#2e1c1c':'#4a4846')},
cold(K,Wd,H,hz,o){const R=K.R,low=o.low,base=hz-2;
 K.bands(0,base,['#0a0e12','#0c1216','#10161a'],Wd);
 for(let s=0;s<2;s++){const x0=s?Wd-70:0;for(let r=0;r<6;r++){R(x0,8+r*((base-8)/6),70,2,'#2a3034');for(let b=0;b<6;b++)R(x0+3+b*11,10+r*((base-8)/6),9,(base-8)/6-4,'#5a4a34')}}
 const vx=Math.round(Wd/2);g_ring(K,vx,base-40,30,'#4a5258');g_ring(K,vx,base-40,24,'#06080a');
 R(vx-10,base-30,20,30,'#3a2418');R(vx-14,base-34,28,6,'#4a2a1e');R(vx-12,base-38,11,5,'#e8dcc0');R(vx+1,base-38,11,5,'#e4d8bc');
 const k=low?.6:1;K.pool(vx,base-36,40*k,30*k,'#ffe8c0',.3,5);
 for(let i=0;i<30;i++){const x=K.hash(i,71)*Wd,y=K.hash(i,72)*base;R(x,y,3,2,'rgba(232,220,192,.35)')}
 R(0,hz-1,Wd,2,'#2a3438');K.bands(hz+1,H,['#1a2226','#1e262a','#222a2e'],Wd);for(let i=0;i<12;i++)R(K.hash(i,91)*Wd,hz+3+K.hash(i,92)*(H-hz-4),10,1,'rgba(180,200,220,.18)')}
};
function g_line(K,x0,y0,x1,y1,c){const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);for(let i=0;i<=n;i++)K.R(x0+(x1-x0)*i/n,y0+(y1-y0)*i/n,1,1,c)}
function g_ring(K,cx,cy,r,c){K.g.fillStyle=c;K.g.beginPath();K.g.arc(cx,cy,r,0,6.283);K.g.fill()}
function g_tint(K,Wd,H,c){K.g.fillStyle=c;K.g.fillRect(0,0,Wd,H)}

const SZ=k=>{const A=B[k==='almoner2'?'almoner':k];return A?[A.w,A.h]:[16,16]};
const cache=new Map();
// step: 0 unhurt, 1 at half HP, 2 at a quarter. A wounded sprite is 8 px wider each side so a lean isn't cut off.
function sprite(k,frame,step){step=step|0;const ph2=k==='almoner2',base=ph2?'almoner':k,key=k+(frame?1:0)+':'+step;let c=cache.get(key);if(c)return c;const A=B[base];if(!A)return null;
 const L=Ly(A.w,A.h,step?WPAD:0);A.f(L,frame?1:0,ph2);if(step&&WOUND[base])WOUND[base](L,step,frame?1:0,ph2);
 c=document.createElement('canvas');c.width=L.W;c.height=A.h;blit(c.getContext('2d'),L);cache.set(key,c);return c}
return{B,sprite,size:SZ,portrait,backdrop};
})();
