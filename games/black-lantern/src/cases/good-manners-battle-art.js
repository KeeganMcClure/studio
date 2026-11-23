// Black Lantern · cases/good-manners-battle-art.js · Good Manners' battle art (spec 010 part B, Nov 23, 2026).
// Made the way Still Harvest's is (cases/still-harvest-battle-art.js, SHB): big head-on battle sprites with the light rim,
// both damage steps for every enemy (Art, Townsfolk and monsters, Wounded enemies), the case's painted battle backdrops
// (Combat, Basics, Backgrounds) and the boss's 64 x 64 talking portrait. Art for this case only; it goes to the Asset
// Library's Good Manners page. Exposes window.GMB.
//   GMB.sprite(key, frame, step) -> cached canvas; frame 0/1 is the idle; step 0 unhurt, 1 at half HP, 2 at a quarter.
//      key: nightman, understudy, usher, graduate, graduate2 (its second phase). The clean-up agent is the agency's own
//      and is drawn by Still Harvest's file (SHB), the same crew in every case.
//   GMB.size(key) -> [w, h]   GMB.portrait(ctx, open) draws THE GRADUATE's face
//   GMB.backdrop(place, {w, h, light, low, feet}) -> the backdrop for 'main', 'elm', 'fair' or 'under'
window.GMB=(()=>{
const OL='#120c1c',D='#24141e',W='#f4efe6',MR='#5a1a22';
const sh=(h,a)=>{const n=parseInt(h.slice(1),16),f=v=>Math.max(0,Math.min(255,Math.round(v+a)));return'#'+[n>>16,n>>8&255,n&255].map(v=>f(v).toString(16).padStart(2,'0')).join('')};
// a pixel layer w × h in drawing coordinates; ox adds room either side (a wounded sprite leans and spills past its box)
function Ly(w,h,ox=0){const WW=w+2*ox,d=new Array(WW*h).fill(null);const L={w,h,d,W:WW,ox,
 g:(x,y)=>{x=Math.round(x)+ox;y=Math.round(y);return(x<0||y<0||x>=WW||y>=h)?null:d[y*WW+x]},
 p(x,y,c){x=Math.round(x)+ox;y=Math.round(y);if(x>=0&&y>=0&&x<WW&&y<h)d[y*WW+x]=c},
 r(x,y,a,b,c){for(let j=0;j<b;j++)for(let i=0;i<a;i++)L.p(x+i,y+j,c)},
 rm(x,y,a,b,c){for(let j=0;j<b;j++)for(let i=0;i<a;i++)if(L.g(x+i,y+j))L.p(x+i,y+j,c)},
 e(cx,cy,rx,ry,c){for(let y=Math.floor(cy-ry);y<=cy+ry;y++)for(let x=Math.floor(cx-rx);x<=cx+rx;x++){const a=(x+.5-cx)/rx,b=(y+.5-cy)/ry;if(a*a+b*b<=1)L.p(x,y,c)}},
 em(cx,cy,rx,ry,c){for(let y=Math.floor(cy-ry);y<=cy+ry;y++)for(let x=Math.floor(cx-rx);x<=cx+rx;x++){const a=(x+.5-cx)/rx,b=(y+.5-cy)/ry;if(a*a+b*b<=1&&L.g(x,y))L.p(x,y,c)}},
 line(x0,y0,x1,y1,c,w=1){const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);for(let i=0;i<=n;i++){const x=Math.round(x0+(x1-x0)*i/n),y=Math.round(y0+(y1-y0)*i/n);L.r(x,y,w,w,c)}},
 tex(from,to,m=7){for(let y=0;y<h;y++)for(let x=-ox;x<w+ox;x++)if(L.g(x,y)===from&&(x*3+y*5)%m===0)L.p(x,y,to)}};return L}
// light from the upper left: the lit edge gets a rim, every edge a dark outline
function finish(L){const w=L.W,{h,d}=L,o=d.slice(),G=(x,y)=>(x<0||y<0||x>=w||y>=h)?null:d[y*w+x];for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x,v=d[i];
 if(v){if((x>0&&!G(x-1,y))||(y>0&&!G(x,y-1)))o[i]=sh(v,30)}
 else if(G(x-1,y)||G(x+1,y)||G(x,y-1)||G(x,y+1))o[i]=OL}return o}
function blit(c,L,ox=0,oy=0){const o=finish(L),w=L.W;for(let i=0;i<o.length;i++)if(o[i]){c.fillStyle=o[i];c.fillRect(ox+i%w,oy+(i/w|0),1,1)}}
// a small Storybook eye: white, iris, pupil and a lid line
function eye(L,x,y,ir){L.r(x,y,4,4,W);L.r(x+1,y+1,2,3,ir);L.p(x+1,y+2,D);L.p(x+2,y+1,'#ffffff');L.r(x,y-1,4,1,D)}

// ================= THE ENEMIES =================
const SUIT='#17151d',SUITL='#2a2632',SHIRT='#ecebf0',PAPER='#efe6cc',RULE='#7a9ac8',RED='#c8504a';
const B={
// Co-op night men: two fellas Voss pays to keep the feds off the elevator. Feed cap, a work jacket, a tire iron and a
// flashlight. People, so they bleed. The one wrong detail: the cap's patch is blank, like somebody picked the logo off.
nightman:{name:'Night man',w:46,h:72,f(L,f){const sk='#e0a882',j='#a8783a',jd=sh(j,-30),jn='#3b4a6b',cap='#c0392b';
 L.r(12,64,9,7,'#3a2a1e');L.r(24,64,9,7,'#3a2a1e');L.r(12,70,10,1,'#2a1a10');L.r(24,70,10,1,'#2a1a10');
 L.r(13,44,8,21,jn);L.r(24,44,8,21,sh(jn,-22));L.r(20,46,1,14,sh(jn,-30));
 L.r(12,42,22,3,'#2a1a10');L.r(20,42,5,3,'#d6a43a');
 L.r(10,21,26,22,j);L.r(30,21,6,22,jd);L.r(14,19,18,3,'#6a4a24');L.r(22,23,1,19,'#4a3a20');L.r(13,30,6,5,jd);L.r(27,30,5,5,sh(jd,10));
 L.tex(j,sh(j,-12),9);
 // flashlight arm (left) and the tire-iron arm (right, raised a little)
 L.r(4,23+f,7,19,j);L.r(4,23+f,2,19,sh(j,18));L.r(4,41+f,7,5,sk);L.r(2,44+f,5,11,'#2a2a30');L.r(2,55+f,5,2,'#fff0b0');L.r(3,44+f,1,11,'#4a4a54');
 L.r(35,22-f,7,15,jd);L.r(35,36-f,7,5,sk);L.line(38,38-f,44,6-f,'#6a6e78',2);L.line(43,7-f,40,3-f,'#6a6e78',2);L.p(39,37-f,'#9aa0aa');
 // head: stubble, small eyes, a flat mouth; the feed cap with its blank patch
 L.r(19,16,8,5,sh(sk,-25));L.e(23,11,8,9,sh(sk,-28));L.e(22,10,7,8,sk);
 L.tex(sk,'#b88a6a',5);for(let x=17;x<28;x++)if(x%2)L.p(x,15,'#a87a5a');
 eye(L,17,8,'#4a6a8a');eye(L,24,8,'#4a6a8a');L.r(19,15,7,1,MR);L.p(22,12,sh(sk,-30));
 L.e(23,3,9,4,cap);L.r(14,5,19,2,sh(cap,-25));L.r(10,5,8,2,sh(cap,-35));L.r(20,1,6,3,'#d8d2c2')}},
// The Understudies: practice copies the men made of the first lessons. A suit too big, stuffed with grain dust from the
// elevator; the face is a dust oval with a face drawn on it in pencil, the way a kid draws a person. Their heads tilt the
// same way, and the dust keeps sifting out of their cuffs.
understudy:{name:'Understudy',w:44,h:74,f(L,f){const s='#4a4652',sd=sh(s,-22),dust='#d8b870',dd='#b8984a',pen='#5a5a64';
 L.r(13,62,7,11,s);L.r(24,62,7,11,sd);L.r(11,71,10,3,'#2a2630');L.r(23,71,10,3,'#2a2630');
 L.r(10,24,24,40,s);L.r(28,24,6,40,sd);L.r(18,24,8,13,'#d8d4c4');L.r(21,25,2,12,'#2a2630');
 for(let i=0;i<10;i++){L.p(13+i,24+i,sh(s,14));L.p(31-i,24+i,sh(s,-10))}
 L.r(5,26-f,6,26,s);L.r(33,26+f,6,26,sd);
 // grain dust: the hands are little heaps, and it sifts from the cuffs to the ground
 L.e(8,54-f,4,4,dust);L.e(36,54+f,4,4,dd);for(let y=58;y<74;y+=3){L.p(7+(y%2),y-f,dust);L.p(36-(y%2),y+f,dd)}
 L.e(22,21,4,3,dust);
 // the head: a dust oval, tilted, with a face drawn on in pencil
 const t=f?1:0;L.e(23+t,11,9,10,dd);L.e(22+t,10,8,9,dust);L.tex(dust,dd,6);
 L.line(17+t,8,20+t,7,pen);L.line(24+t,7,27+t,8,pen);
 for(const ex of[18,25]){L.p(ex+t,10,pen);L.p(ex+1+t,9,pen);L.p(ex+2+t,10,pen);L.p(ex+1+t,11,pen);L.p(ex+1+t,10,'#1a1820')}
 for(let x=18;x<=27;x++)L.p(x+t,Math.round(15+((x-22.5)/5)**2*-1.6+1.6),pen);L.p(22+t,12,pen)}},
// The ushers on the fairground at night: vest, white shirt, bow tie, the little paper hat, a flashlight. No face at all,
// just skin, smooth as the back of a hand.
usher:{name:'Usher',w:38,h:66,f(L,f){const sk='#e6c0a0',v='#b02a3a',vd=sh(v,-30),sl='#1e1c26';
 L.r(11,60,7,6,'#0c0a10');L.r(20,60,7,6,'#0c0a10');L.r(12,40,6,21,sl);L.r(20,40,6,21,sh(sl,-8));
 L.r(9,20,20,21,SHIRT);L.r(10,22,7,18,v);L.r(21,22,7,18,vd);[26,31,36].forEach(y=>{L.p(18,y,'#d6a43a');L.p(19,y,'#d6a43a')});
 L.r(15,19,8,3,'#14101a');L.r(18,20,2,1,'#3a3440');
 L.r(4,22+f,6,18,SHIRT);L.r(28,22-f,6,16,SHIRT);L.r(4,39+f,6,4,sk);L.r(28,37-f,6,4,sk);
 L.r(30,40-f,4,10,'#2a2a30');L.r(30,50-f,4,2,'#fff0b0');L.r(31,40-f,1,10,'#4a4a54');
 L.r(15,15,8,5,sh(sk,-20));L.e(19,9,8,9,sh(sk,-25));L.e(18,8,7,8,sk);L.e(16,6,3,2,sh(sk,14));
 L.r(11,0,16,4,'#f4f1e8');L.r(11,2,16,1,v);L.r(13,-1,12,2,'#f4f1e8')}},
// The boss: the two men folded together into one tall figure in a suit too long in the arms, its glasses gone: a smooth
// blank where the eyes should be. Over its face, in turn, the faces it learned float like masks on strings.
// Phase 2 ('graduate2'): the faces come loose and hang at angles, and the blank splits into a mouth of ruled paper.
graduate:{name:'The Graduate',w:84,h:124,f(L,f,ph2){const sk='#e6c8b0',skd=sh(sk,-30),t=f?1:0;
 // legs and shoes, the long jacket, the long arms down past the knees
 L.r(30,92,9,30,SUIT);L.r(45,92,9,30,sh(SUIT,-6));L.r(28,120,12,4,'#060508');L.r(44,120,12,4,'#060508');
 for(let y=40;y<98;y++){const hw=15+Math.round((y-40)*.12);L.r(42-hw,y,hw*2,1,SUIT);L.r(42+hw-5,y,5,1,'#0e0c12')}
 L.r(34,40,16,22,SHIRT);for(let k=0;k<12;k++)L.r(38+(k>6?1:0),42+k*1.8,8-k*.4,2,'#0c0a10');L.r(40,40,4,3,'#0c0a10');
 for(let k=0;k<20;k++){L.p(33-k*.2,41+k,SUITL);L.p(51+k*.2,41+k,'#0a090e')}
 L.r(18,44+t,8,64,SUIT);L.r(18,44+t,2,64,SUITL);L.r(58,44-t,8,64,'#0e0c12');
 L.r(16,106+t,10,4,SHIRT);L.r(58,106-t,10,4,SHIRT);
 for(const [x,d] of[[16,t],[58,-t]]){L.r(x+1,110+d,8,6,sk);[1,3,5,7].forEach((i,k)=>L.r(x+i,115+d,1,5+(k%2)*2,sk))}
 // neck and the blank head
 L.r(37,30,10,10,skd);L.e(43,18,14,17,skd);L.e(41,17,13,16,sk);L.e(36,9,4,3,sh(sk,16));
 if(!ph2){L.r(30,17,22,2,sh(sk,-12));L.r(36,28,12,1,sh(sk,-34))}
 else{L.r(33,23,18,7,PAPER);for(let x=33;x<51;x+=4)L.r(x,23,1,7,RULE);L.r(33,25,18,1,RED);L.r(33,22,18,1,'#2a1a20');L.r(33,30,18,1,'#2a1a20')}
 // the learned faces, floating: an old man's grin, a teacher's red glasses, a pastor's collar. In phase 2 they hang loose.
 const masks=ph2?[[10,8+t,0],[66,10-t,1],[22,-1+t,0],[60,30+t,2]]:[[14,14+t,0],[66,12-t,1],[40,0,2]];
 masks.forEach(([mx,my,k],i)=>{const tint=['#d8c0a8','#e8c8a0','#c8a888'][k%3];L.e(mx,my+6,7,7,sh(tint,-20));L.e(mx-1,my+5,6,6,tint);
  L.r(mx-4,my+4,2,2,D);L.r(mx+1,my+4,2,2,D);
  if(k===0){for(let x=mx-4;x<=mx+3;x++)L.p(x,my+9+(x===mx-4||x===mx+3?-1:0),MR);L.r(mx-5,my,10,2,'#c8c8d0')}
  if(k===1){L.r(mx-5,my+3,4,4,RED);L.r(mx,my+3,4,4,RED);L.r(mx-4,my+4,2,2,D);L.r(mx+1,my+4,2,2,D);L.r(mx-1,my+4,1,1,RED);L.r(mx-3,my+9,5,1,MR)}
  if(k===2){L.r(mx-3,my+9,6,1,MR);L.r(mx-4,my+12,8,2,'#0c0a10');L.r(mx-1,my+12,2,2,'#f4f4f4')}
  if(ph2)L.line(mx,my-1,42,8,'#8a8090');else L.p(mx,my-2,'#8a8090')});
 if(ph2)[[22,40],[64,44],[30,98],[56,96]].forEach(([x,y])=>{L.r(x,y,6,8,PAPER);L.r(x,y+2,6,1,RULE);L.r(x,y+5,6,1,RULE)})}}
};

// ================= WOUNDED ENEMIES (Art, Townsfolk and monsters, Wounded enemies) =================
// Two steps: at half HP and at a quarter. The night men are people and bleed. The Understudies are grain dust in a suit:
// it splits and pours. The ushers are empty inside: a crack in the face shows dark, then a chunk goes. The Graduate is
// made of the lessons: its suit tears onto ruled copybook paper, and then pages pour out of it.
const WPAD=8,GRAIN=['#e8cc66','#c9a24a','#9c7a34'],HOLLOW='#140c12',BLOOD='#6e121c',BLOODW='#a8202c',PAGES=[PAPER,'#e0d4b0','#f8f2e0'];
const grey=(h,k)=>{const n=parseInt(h.slice(1),16),r=n>>16,g=n>>8&255,b=n&255,l=(r*.3+g*.59+b*.11)*.82,f=v=>Math.max(0,Math.min(255,Math.round(v+(l-v)*k-k*18)));
 return'#'+[r,g,b].map(v=>f(v).toString(16).padStart(2,'0')).join('')};
const inBlob=(x,y,cx,cy,rx,ry,sd)=>{const a=(x+.5-cx)/rx,b=(y+.5-cy)/ry,t=Math.atan2(b,a),r=1+.22*Math.sin(5*t+sd)+.12*Math.sin(9*t+sd*2.3);return a*a+b*b<=r*r};
const blob=(L,cx,cy,rx,ry,sd,fn)=>{for(let y=Math.floor(cy-ry*1.4);y<=cy+ry*1.4;y++)for(let x=Math.floor(cx-rx*1.4);x<=cx+rx*1.4;x++)if(inBlob(x,y,cx,cy,rx,ry,sd))fn(x,y)};
const Wk={
 bite(L,cx,cy,rx,ry,sd=1){blob(L,cx,cy,rx,ry,sd,(x,y)=>{if(L.g(x,y))L.p(x,y,null)})},
 gash(L,cx,cy,rx,ry,sd=2,c=HOLLOW){blob(L,cx,cy,rx,ry,sd,(x,y)=>{if(L.g(x,y))L.p(x,y,c)})},
 stain(L,cx,cy,rx,ry,sd=3,c=BLOOD,c2=BLOODW){blob(L,cx,cy,rx,ry,sd,(x,y)=>{if(L.g(x,y))L.p(x,y,c)});blob(L,cx-rx*.15,cy-ry*.2,rx*.5,ry*.5,sd+1,(x,y)=>{if(L.g(x,y))L.p(x,y,c2)})},
 drip(L,x,y,n,c=BLOOD,any){for(let j=0;j<n;j++)for(const i of[0,1])if(any||L.g(x+i,y+j))L.p(x+i,y+j,c);if(any){L.p(x,y+n,c);L.p(x+1,y+n,c)}},
 // ruled paper showing through a tear: cream, blue lines, the red margin
 paper(L,cx,cy,rx,ry,sd=2){Wk.gash(L,cx,cy,rx+1,ry+1,sd);blob(L,cx,cy,rx*.75,ry*.8,sd+2,(x,y)=>{if(L.g(x,y))L.p(x,y,y%3===0?RULE:Math.round(x-cx)===-1?RED:PAPER)})},
 // grain pouring from (x, y) to the ground row gy
 pour(L,x,y,w,gy,sd=0,cols=GRAIN){for(let i=0;i<w;i+=2){const top=y+((i*5+sd)%4),bot=gy-((i*3+sd)%3);for(let yy=top;yy<=bot;yy++){const wob=((yy+i+sd)>>2)%2;L.p(x+i+wob,yy,cols[(i>>1)%cols.length])}}},
 heap(L,cx,rx,ry=3,cols=GRAIN){const y=L.h-1;L.e(cx,y,rx,ry,cols[2]);L.e(cx-1,y,rx*.8,ry*.75,cols[1]);for(let i=1;i<rx*2-2;i+=3)L.line(cx-rx+i,y-ry+2,cx-rx+i+2,y-ry,cols[0])},
 // loose pages: a few tilted sheets on the ground
 sheets(L,cx,n,sd=0){for(let i=0;i<n;i++){const x=cx-n*4+i*8+((i*5+sd)%3),y=L.h-3-((i+sd)%2)*2;L.r(x,y,7,3,PAGES[i%3]);L.r(x,y+1,7,1,RULE);L.p(x+1,y,RED)}},
 dull(L,x0,x1,amt){const d=x1>x0?1:-1;for(let y=0;y<L.h;y++)for(let x=x0;d>0?x<=x1:x>=x1;x+=d){const v=L.g(x,y);if(!v||GRAIN.includes(v)||PAGES.includes(v)||v===RULE)continue;L.p(x,y,grey(v,amt*Math.min(1,.4+.6*Math.abs(x-x0)/Math.max(1,Math.abs(x1-x0)))))}},
 lean(L,dx,y0,y1){const W=L.W,d=L.d;for(let y=0;y<y1;y++){const s=Math.round(dx*Math.min(1,(y1-y)/Math.max(1,y1-y0)));if(!s)continue;const row=d.slice(y*W,y*W+W);for(let x=0;x<W;x++){const sx=x-s;d[y*W+x]=sx>=0&&sx<W?row[sx]:null}}},
 sag(L,x0,y0,w,h,dy,dx=0){const px=[];for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++){const v=L.g(x,y);if(v){px.push([x,y,v]);L.p(x,y,null)}}px.forEach(([x,y,v])=>L.p(x+dx,y+dy,v))},
 cut(L,x,y,w,h){for(let j=0;j<h;j++)for(let i=0;i<w;i++)L.p(x+i,y+j,null)}
};
const WOUND={
// a night man: a bloody shirt and a split lip, then a soaked side running to his boots, the tire-iron arm hanging and
// the cap knocked off
nightman(L,s){
 if(s===1){Wk.stain(L,26,32,4,4,3);Wk.drip(L,25,35,6);Wk.stain(L,22,15,2.5,1.6,2);Wk.dull(L,24,46,.3);Wk.lean(L,-1,8,24)}
 else{Wk.stain(L,25,33,6,6,3);Wk.drip(L,22,38,9);Wk.drip(L,28,38,12);Wk.stain(L,27,52,2.5,6,4,BLOODW,'#c0303a');Wk.stain(L,22,15,3,2,2);
  Wk.sag(L,34,0,13,42,6,-1);Wk.cut(L,10,-1,26,6);L.r(14,4,16,2,'#7a3a2a');Wk.dull(L,22,46,.5);Wk.lean(L,-3,8,40)}},
// an Understudy: its chest seam splits and grain pours, the pencil face smears; then an arm is gone, the head caves on
// one side and the dust heaps up at its feet
understudy(L,s){
 Wk.gash(L,21,40,s>1?4:2.5,s>1?7:4,2,'#9c7a34');Wk.gash(L,21,40,s>1?2:1,s>1?5:3,3,'#e8cc66');
 Wk.pour(L,19,44,s>1?6:3,73,1);Wk.bite(L,30,5,s>1?5:3,s>1?5:3,2);
 if(s===1){Wk.dull(L,24,44,.3);Wk.lean(L,2,6,26);Wk.heap(L,21,6)}
 else{Wk.cut(L,32,24,10,34);Wk.pour(L,32,26,4,73,2);Wk.sag(L,0,0,44,22,2,1);Wk.dull(L,20,44,.55);Wk.lean(L,4,6,40);Wk.heap(L,24,13,4)}},
// an usher: the blank face cracks and the vest tears onto nothing; then a piece of its head is gone, dark inside, and
// the flashlight arm hangs
usher(L,s){
 if(s===1){Wk.gash(L,20,9,1.6,4,1);Wk.gash(L,23,31,2.5,4,2);Wk.dull(L,20,38,.3);Wk.lean(L,1,6,22)}
 else{Wk.bite(L,23,4,5,5,2);Wk.gash(L,19,10,2,5,1);Wk.gash(L,22,31,4,7,3);Wk.sag(L,27,20,10,34,5);Wk.dull(L,18,38,.5);Wk.lean(L,3,6,40);Wk.sag(L,0,-1,38,18,2)}},
// the Graduate: its suit rips onto ruled paper; then a sleeve tears away, its head is missing a piece with lines of
// handwriting in the hole, and pages pour out of it into a drift on the floor
graduate(L,s,f,ph2){
 Wk.paper(L,32,62,s>1?6:4,s>1?9:6,2);Wk.paper(L,54,78,s>1?5:3,s>1?7:5,3);Wk.bite(L,56,4,s>1?6:4,s>1?5:3,1);
 if(s===1){Wk.dull(L,44,84,.3);Wk.lean(L,2,10,40);Wk.sheets(L,42,3,1)}
 else{Wk.cut(L,56,42,12,72);Wk.paper(L,56,44,3,5,2);Wk.paper(L,46,16,5,6,4);Wk.sag(L,14,40,14,72,6);
  Wk.dull(L,40,84,.55);Wk.lean(L,4,10,60);Wk.pour(L,50,82,8,122,1,PAGES);Wk.sheets(L,42,7,2)}}
};

// ================= THE BOSS'S PORTRAIT (it talks) =================
// A blank face over a black suit and a white collar. No eyes. Its mouth is the only thing on it, and it is very polite.
function portraitLayer(open){const L=Ly(64,64),sk='#e6c8b0';
 L.r(8,50,48,14,SUIT);L.r(26,48,12,10,SHIRT);L.r(30,50,4,14,'#0c0a10');L.r(20,48,6,16,SUITL);L.r(38,48,6,16,'#0a090e');
 L.r(27,40,10,10,sh(sk,-28));L.e(33,24,16,19,sh(sk,-30));L.e(31,23,15,18,sk);L.e(25,12,5,3,sh(sk,16));
 L.r(19,22,24,2,sh(sk,-12));L.r(26,24,10,1,sh(sk,-6));
 if(open){L.r(25,33,14,6,MR);L.r(26,34,12,1,PAPER);L.r(26,35,12,3,'#3a1a20');L.r(27,37,10,1,PAPER)}else{L.r(25,35,14,1,MR);L.p(24,34,MR);L.p(39,34,MR)}
 [[6,10,'#d8c0a8'],[56,8,'#e8c8a0']].forEach(([x,y,c])=>{L.e(x,y,5,6,c);L.r(x-3,y-1,2,2,D);L.r(x+1,y-1,2,2,D);L.r(x-2,y+3,4,1,MR)});
 return L}
const pc={};
function portrait(ctx,open){const k=open?1:0;if(!pc[k]){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');x.fillStyle='#14121c';x.fillRect(0,0,64,64);
  x.fillStyle='#1e1a2a';for(let y=0;y<64;y+=4)x.fillRect(0,y,64,1);blit(x,portraitLayer(k));pc[k]=c}
 ctx.clearRect(0,0,64,64);ctx.drawImage(pc[k],0,0)}

// ================= BATTLE BACKDROPS (Combat, Basics, Backgrounds) =================
// Head-on at battle scale, one per kind of place the case fights in: Main Street ('main': the grain elevator, flat-front
// brick, the water tower and the blinking light), Elm and Third ('elm': ranch houses, a picket fence and the tinted black
// car), the fairground ('fair': the Ferris wheel, striped booths and string lights) and under the grandstand ('under':
// the bleachers' underside with light slicing through, the chalkboard and the folding chairs). Lit for day or night; low
// SAN shrinks the lights like on the map, and battle.js lays the sour over it.
const BDC={};
function backdrop(place,o){const f=BDRAW[place];if(!f)return null;const key=[place,o.light,o.low?1:0,o.w,o.h,o.feet].join('|');if(BDC[key])return BDC[key];
 const c=document.createElement('canvas');c.width=o.w;c.height=o.h;const g=c.getContext('2d');
 const hz=Math.round(Math.max(30,Math.min(o.feet-12,o.h*.44)));
 f(bdKit(g),o.w,o.h,hz,o);BDC[key]=c;return c}
function bdKit(g){const R=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))};
 const K={g,R,
  hash:(a,b=0)=>{let n=Math.imul(a|0,374761393)+Math.imul(b|0,668265263);n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967296},
  bands(y0,y1,cols,W){const n=cols.length,hh=(y1-y0)/n;for(let i=0;i<n;i++){const a=Math.round(y0+i*hh),b=Math.round(y0+(i+1)*hh);R(0,a,W,b-a,cols[i]);
   if(i<n-1)for(let x=0;x<W;x++){if((x&1)===0)R(x,b-1,1,1,cols[i+1]);if((x&3)===1)R(x,b-2,1,1,cols[i+1])}}},
  ell(cx,cy,rx,ry,c){for(let y=-Math.ceil(ry);y<=Math.ceil(ry);y++){const q=1-(y/ry)**2;if(q<0)continue;const hw=rx*Math.sqrt(q);R(cx-hw,cy+y,hw*2,1,c)}},
  line(x0,y0,x1,y1,c,w=1){const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);for(let i=0;i<=n;i++)R(x0+(x1-x0)*i/n,y0+(y1-y0)*i/n,w,w,c)},
  pool(cx,cy,rx,ry,c,a,steps=4){g.globalCompositeOperation='lighter';g.globalAlpha=a/steps;for(let i=0;i<steps;i++){const k=1-i/steps;K.ell(cx,cy,rx*k,ry*k,c)}g.globalAlpha=1;g.globalCompositeOperation='source-over'},
  // 3 × 5 capitals for painted signs (made-up names only)
  text(s,x,y,c){const F={A:'010101111101101',C:'111100100100111',D:'110101101101110',E:'111100110100111',F:'111100110100100',G:'111100101101111',H:'101101111101101',I:'111010010010111',K:'101101110101101',L:'100100100100111',M:'101111111101101',N:'101111111111101',O:'111101101101111',P:'110101110100100',R:'110101110101101',S:'111100111001111',T:'111010010010010',U:'101101101101111',W:'101101101111101',Y:'101101010010010','-':'000000111000000'};
   [...s].forEach((ch,i)=>{const b=F[ch];if(b)for(let j=0;j<15;j++)if(b[j]==='1')R(x+i*4+j%3,y+(j/3|0),1,1,c)})}};
 return K}
// the plains sky: hot white by day, deep blue with stars by night
function sky(K,W,base,nt){if(nt){K.bands(0,base,['#06081a','#0a0e24','#10142c','#1a1a34'],W);for(let i=0;i<46;i++){const x=K.hash(i,3)*W|0,y=K.hash(i,4)*(base-6)|0;K.R(x,y,1,1,i%6?'#4a5070':'#c8c8e0')}}
 else{K.bands(0,base,['#a8c4d8','#c0d4e0','#d8e2e6','#ece8de','#f4ecd8'],W);K.ell(W*.82,10,12,3,'#f8f4ea')}}
// the street the fighters stand on: a curb line at the horizon, asphalt, a near curb at the bottom
function street(K,W,H,hz,nt,low){const R=K.R,C=nt?['#1c1a24','#201d28','#24202c']:['#6a6470','#726c78','#7a7480'];
 R(0,hz-1,W,2,nt?'#4a4656':'#c8c0b4');K.bands(hz+1,H,C,W);
 const ly=hz+1+Math.round((H-hz)*.45);for(let x=-6;x<W;x+=28)R(x,ly,14,2,nt?'#6a5a3a':'#e8d070');
 for(let i=0;i<30;i++){const t=K.hash(i,31),x=K.hash(i,32)*W|0,y=Math.round(hz+3+t*(H-hz-6));R(x,y,2,1,nt?'#2c2834':'#5a5460')}
 const ny=H-Math.max(9,Math.round((H-hz)*.12));R(0,ny,W,2,nt?'#4e4a5a':'#d0c8c0');R(0,ny+2,W,H-ny-2,nt?'#3a3646':'#b0a8a0');
 if(nt){const k=low?.65:1;K.pool(W/2,H+4,118*k,(H-hz)*.7*k,'#ff9a3c',.26,5)}}
// a sodium street light on a pole, lit at night
function sodium(K,x,top,base,nt,low){const R=K.R,ir=nt?'#14121a':'#3a3a44';R(x-1,top,3,base-top,ir);R(x-1,top,12,2,ir);R(x+8,top+2,6,3,ir);R(x+9,top+5,4,1,nt?'#ffcf80':'#d8d4cc');
 if(nt){const k=low?.7:1;K.pool(x+11,top+8,22*k,22*k,'#ff9a3c',.42,4);K.pool(x+11,base+6,40*k,10*k,'#ff9a3c',.3,4)}}
const BDRAW={
main(K,W,H,hz,o){const R=K.R,nt=o.light==='night',low=o.low,sd=6,base=hz-sd;
 sky(K,W,base,nt);
 // the grain elevator behind everything: a tall concrete head house and its row of silos
 const ec=nt?'#3a3848':'#d8d0c0',ed=nt?'#2a2838':'#b0a898',ex=10,et=Math.max(4,base-118);
 R(ex,et,26,base-et,ec);R(ex+20,et,6,base-et,ed);for(let y=et+6;y<base;y+=10)R(ex,y,26,1,ed);R(ex+4,et-6,18,6,ed);
 for(let i=0;i<4;i++){const sx=ex+28+i*15,st=et+26;R(sx,st,14,base-st,ec);R(sx+10,st,4,base-st,ed);K.ell(sx+7,st,7,3,ec)}
 if(nt){R(ex+11,et+10,4,4,'#ff9a3c');R(ex+11,et+30,4,4,'#4a3a2a')}
 // the water tower on the right, ODESSA FLATS on the tank
 const tx=Math.round(W*.8),tt=Math.max(6,base-96),tc=nt?'#5a6070':'#c8ccd0';
 for(const dx of[-14,14])K.line(tx+dx,base,tx+dx*.6,tt+22,nt?'#2a2c38':'#8a8c90',2);K.line(tx-12,base-20,tx+12,tt+30,nt?'#2a2c38':'#8a8c90');
 K.ell(tx,tt+12,20,12,tc);R(tx-20,tt+12,40,8,tc);K.ell(tx,tt+20,20,4,sh(tc,-30));K.ell(tx,tt,10,4,sh(tc,-20));K.text('ODESSA',tx-11,tt+9,nt?'#2a2c38':'#3a3a48');
 // flat-front brick storefronts with painted signs (made-up names)
 const top=base-46;[[0,58,'#9a4a30','FEED'],[58,52,'#8a3c24','CAFE'],[110,50,'#a85a3a','HARDWARE'],[160,W-160,'#7a4a34','CO-OP']].forEach(([x,w,c,sg],i)=>{
  const tt2=top+(i%2?6:0),bc=nt?sh(c,-70):c;R(x,tt2,w,base-tt2,bc);for(let y=tt2+3;y<base;y+=3)R(x,y,w,1,sh(bc,-16));R(x,tt2-3,w,3,nt?'#1a1418':'#3a2a24');
  R(x+4,tt2+5,w-8,9,nt?'#2a2024':'#e8dcc0');K.text(sg,x+w/2-sg.length*2,tt2+7,nt?'#8a6a4a':'#5a2a1e');
  const wy=tt2+18;R(x+5,wy,w-10,base-wy-4,nt?(i===1?'#e7b65a':'#141018'):'#5a7ab0');R(x+5,wy,w-10,2,nt?'#2a2024':'#3e5a8a');R(x+Math.round(w/2),wy,1,base-wy-4,'#1a1418')});
 R(0,base,W,sd,nt?'#3a3646':'#c8c0b8');for(let x=10;x<W;x+=24)R(x,base,1,sd,nt?'#2a2634':'#a8a098');
 // the blinking traffic light on its wire over the crossing
 const lx=Math.round(W*.47),ly0=Math.max(4,top-22);K.line(0,ly0-4,W,ly0-6,'#14121a');R(lx-3,ly0-4,7,16,'#2a2a20');R(lx-2,ly0-2,5,4,nt?'#ffb020':'#a88a20');R(lx-2,ly0+3,5,4,'#3a2a20');R(lx-2,ly0+8,5,3,'#2a3a20');
 if(nt)K.pool(lx,ly0,10,10,'#ffb020',.4,3);
 street(K,W,H,hz,nt,low);sodium(K,Math.round(W*.06),Math.max(6,top-16),hz,nt,low)},
elm(K,W,H,hz,o){const R=K.R,nt=o.light==='night',low=o.low,base=hz-8;
 sky(K,W,base,nt);
 // a far line of trees, then three ranch houses with porches
 for(let x=0;x<W;x+=10)K.ell(x+5,base-30,9,8,nt?'#141a1c':'#5a7a4a');
 [[-6,78,'#c9b48a','#5a4a3e'],[82,80,'#d8cdb0','#6a3a2e'],[170,W-164,'#8a9aa8','#3e3a46']].forEach(([x,w,c,rf],i)=>{
  const top=base-30,bc=nt?sh(c,-90):c,rc=nt?sh(rf,-30):rf;R(x,top,w,base-top,bc);for(let y=top+3;y<base;y+=4)R(x,y,w,1,sh(bc,-14));
  for(let k=0;k<12;k++)R(x-4+k,top-k,w+8-k*2,1,rc);
  const lit=nt&&i!==1;[x+8,x+w-24].forEach(wx=>{R(wx,top+8,16,11,nt?'#0e0c12':'#3a3440');R(wx+1,top+9,14,9,lit?'#e7b65a':nt?'#1a1822':'#7a9ab8');R(wx+8,top+9,1,9,'#2a2430')});
  // the middle house is the watched one: every curtain shut
  if(i===1)[x+8,x+w-24].forEach(wx=>{R(wx+1,top+9,14,9,nt?'#5a3040':'#c86a7a');for(let k=0;k<14;k+=3)R(wx+1+k,top+9,1,9,nt?'#3a2030':'#a04a5a')});
  R(x+w/2-6,top+10,12,base-top-10,nt?'#1a1418':'#5a3a2a');if(nt&&lit)K.pool(x+w/2,top+12,10,8,'#e7b65a',.25,2)});
 // the picket fence and the lawn
 R(0,base,W,8,nt?'#1a2a1a':'#7a9a4a');for(let x=2;x<W;x+=6){R(x,base-10,3,12,nt?'#4a4a54':'#f4f1e8');R(x+1,base-11,1,1,nt?'#4a4a54':'#f4f1e8')}R(0,base-6,W,2,nt?'#3a3a44':'#e0dcd0');
 street(K,W,H,hz,nt,low);
 // the tinted black car at the far curb: no dust on it
 const cx0=Math.round(W*.6),cy=hz-2;R(cx0,cy-14,64,12,'#0e0d12');R(cx0+12,cy-22,36,9,'#0e0d12');R(cx0+14,cy-20,32,6,nt?'#1a1a26':'#2a2a3a');R(cx0+29,cy-20,2,6,'#0e0d12');
 R(cx0,cy-14,64,1,nt?'#3a3a48':'#5a5a6a');K.ell(cx0+14,cy-2,6,5,'#060508');K.ell(cx0+50,cy-2,6,5,'#060508');K.ell(cx0+14,cy-2,2,2,'#5a5a64');K.ell(cx0+50,cy-2,2,2,'#5a5a64');
 sodium(K,Math.round(W*.08),Math.max(6,base-60),hz,nt,low)},
fair(K,W,H,hz,o){const R=K.R,nt=o.light==='night',low=o.low,base=hz-6,now=0;
 sky(K,W,base,nt);
 // the Ferris wheel, big behind the booths: spokes, rim, cars, and at night its bulbs
 const fx=Math.round(W*.28),fy=Math.max(34,base-58),fr=Math.min(52,fy+10),fc=nt?'#3a3850':'#e8e4dc';
 for(let k=0;k<12;k++){const a=k/12*Math.PI*2;K.line(fx,fy,fx+Math.cos(a)*fr,fy+Math.sin(a)*fr,fc)}
 for(let k=0;k<80;k++){const a=k/80*Math.PI*2;R(fx+Math.cos(a)*fr,fy+Math.sin(a)*fr,2,2,fc)}
 for(let k=0;k<12;k++){const a=k/12*Math.PI*2,x=fx+Math.cos(a)*fr,y=fy+Math.sin(a)*fr;R(x-4,y+2,8,6,['#c8504a','#4fd8e0','#d8b24a','#ff6fae'][k%4]);R(x,y,1,3,fc)}
 if(nt)for(let k=0;k<24;k++){const a=k/24*Math.PI*2;R(fx+Math.cos(a)*fr,fy+Math.sin(a)*fr,2,2,['#ff6fae','#4fd8e0','#ffe9b0'][k%3])}
 K.line(fx,fy,fx-22,base,nt?'#2a2838':'#c8c0b4',3);K.line(fx,fy,fx+22,base,nt?'#2a2838':'#c8c0b4',3);
 if(nt)K.pool(fx,fy,fr+14,fr+14,'#ff6fae',.16,4);
 // the spinner's lit top on the right
 const sx=Math.round(W*.82),st=base-40;K.ell(sx,st,26,7,nt?'#3a2a50':'#7a6aa8');for(let k=0;k<8;k++)R(sx-24+k*6,st-2,3,3,nt?'#ffe9b0':'#f4f1e8');R(sx-2,st,4,base-st,nt?'#2a2838':'#8a8494');
 // striped game booths with painted signs
 const top=base-34;[[0,'#ff6fae','DUCKS'],[64,'#4fd8e0','DARTS'],[128,'#d8b24a','RING TOSS'],[192,'#c8504a','CORN DOGS']].forEach(([x,c,sg])=>{
  const bw=60,cc=nt?sh(c,-60):c;R(x+2,top+10,bw-4,base-top-10,nt?'#2a2030':'#e8dcc0');for(let k=0;k<bw;k+=8)R(x+k,top,4,10,cc);for(let k=4;k<bw;k+=8)R(x+k,top,4,10,nt?'#2a2a38':'#f4f1e8');
  R(x,top+10,bw,2,nt?'#14101a':'#5a3a2a');R(x+6,top+16,bw-12,8,nt?'#1a1420':'#f8f4ea');K.text(sg.replace(' ',''),x+bw/2-sg.replace(' ','').length*2,top+18,nt?sh(c,-10):sh(c,-50));
  R(x+6,base-8,bw-12,8,nt?'#1a1420':'#a8783a');if(nt)K.pool(x+bw/2,top+18,18,10,'#ffe9b0',.22,3)});
 // string lights swagged across, the dirt midway the fighters stand on
 for(let x=0;x<W;x++){const y=Math.max(3,top-14)+Math.round(Math.sin(x/W*Math.PI*3)**2*8);R(x,y,1,1,nt?'#3a3440':'#6a6070');if(x%9===4){R(x-1,y+1,3,3,nt?['#ff6fae','#4fd8e0','#ffe9b0','#d8b24a'][(x/9|0)%4]:'#f4f1e8');if(nt)K.pool(x,y+2,5,5,'#ffe9b0',.3,2)}}
 const C=nt?['#2a2026','#2e232a','#33262e']:['#b08a5a','#a8824e','#9c7a46'];R(0,hz-1,W,2,nt?'#3a2c30':'#c8a070');K.bands(hz+1,H,C,W);
 for(let i=0;i<50;i++){const t=K.hash(i,41),x=K.hash(i,42)*W|0,y=Math.round(hz+3+t*t*(H-hz-4));R(x,y,2,1,nt?'#3e3034':'#8a6a3a');if(i%7===0)R(x,y-1,3,2,nt?'#c8504a':'#e8dcc0')}
 if(nt){const k=low?.65:1;K.pool(W/2,H+4,120*k,(H-hz)*.7*k,'#ff9a3c',.22,5)}},
under(K,W,H,hz,o){const R=K.R,low=o.low;
 // the underside of the bleachers: dark, with the stadium lights cutting through the gaps in thin bright bars
 R(0,0,W,H,'#0c0a12');
 for(let i=0;i<9;i++){const x0=-40+i*36;K.line(x0,0,x0+80,hz,'#1e1a28',4);K.line(x0+4,0,x0+84,hz,'#2a2434',1)}
 for(let i=0;i<7;i++){const y=6+i*Math.round((hz-6)/7);R(0,y,W,3,'#16121e');R(0,y,W,1,'#2a2434')}
 for(let i=0;i<5;i++){const x=20+i*48+((i*7)%11);R(x,0,2,hz,'#3a3448');if(!low||i%2)K.pool(x,hz*.5,6,hz*.6,'#e8eef8',.18,3)}
 // the chalkboard, and the date in neat capitals with nothing under it
 const bx=Math.round(W*.5)-46,by=Math.max(6,hz-52);R(bx-3,by-3,98,48,'#5a3a22');R(bx,by,92,42,'#1e3a2c');R(bx,by,92,2,'#2e4a3c');
 K.text('SATURDAY',bx+6,by+5,'#d8d4c4');for(let k=0;k<4;k++)R(bx+6,by+16+k*7,80,1,'#3a5a4a');R(bx+10,by+38,10,2,'#e8e4d8');R(bx+60,by+42,20,2,'#5a3a22');
 // folding chairs in rows, facing the board
 const C=['#1a1620','#1e1924','#221c28'];R(0,hz-1,W,2,'#2a2430');K.bands(hz+1,H,C,W);
 for(let row=0;row<2;row++)for(let i=0;i<7;i++){const x=6+i*34+row*14,y=hz-14+row*14,c=row?'#5a5a64':'#4a4a54';R(x,y,14,3,c);R(x+1,y-12,12,10,sh(c,-12));R(x+1,y-12,12,2,c);R(x+1,y+3,2,9,c);R(x+11,y+3,2,9,c)}
 for(let i=0;i<24;i++){const x=K.hash(i,51)*W|0,y=hz+4+(K.hash(i,52)*(H-hz-6)|0);R(x,y,3,1,'#2e2834')}
 const k=low?.65:1;K.pool(W/2,H+4,110*k,(H-hz)*.65*k,'#d9772b',.26,5)}
};

const SZ=k=>{const A=B[k==='graduate2'?'graduate':k];return A?[A.w,A.h]:[16,16]};
const cache=new Map();
// step: 0 unhurt, 1 at half HP, 2 at a quarter. A wounded sprite is 8 px wider each side so a lean or a spill isn't cut
// off; drawn centred, so it stays put, and the same height, so the feet stay on the ground.
function sprite(k,frame,step){step=step|0;const ph2=k==='graduate2',base=ph2?'graduate':k,key=k+(frame?1:0)+':'+step;let c=cache.get(key);if(c)return c;const A=B[base];if(!A)return null;
 const L=Ly(A.w,A.h,step?WPAD:0);A.f(L,frame?1:0,ph2);if(step){Wk.cut(L,-WPAD,0,WPAD,A.h);Wk.cut(L,A.w,0,WPAD,A.h);if(WOUND[base])WOUND[base](L,step,frame?1:0,ph2)}
 c=document.createElement('canvas');c.width=L.W;c.height=A.h;blit(c.getContext('2d'),L);cache.set(key,c);return c}
return{B,sprite,size:SZ,portrait,backdrop};
})();
