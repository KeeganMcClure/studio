// Black Lantern · cases/lot-83-battle-art.js · Lot 83's battle art (spec 011 part B, Nov 23, 2026).
// Made the way Good Manners' is (cases/good-manners-battle-art.js, GMB): big head-on battle sprites with the light rim,
// both damage steps for every enemy (Art, Townsfolk and monsters, Wounded enemies), the case's painted battle backdrops
// (Combat, Basics, Backgrounds) and the boss's 64 x 64 talking portrait. Art for this case only; it goes to the Asset
// Library's Lot 83 page. Exposes window.L83B.
//   L83B.sprite(key, frame, step) -> cached canvas; frame 0/1 is the idle; step 0 unhurt, 1 at half HP, 2 at a quarter.
//      key: nit, crawler, drone, lodger, lodger2 (its second phase). The clean-up agent is the agency's own and is
//      drawn by Still Harvest's file (SHB), the same crew in every case.
//   L83B.size(key) -> [w, h]   L83B.portrait(ctx, open) draws THE LODGER's face
//   L83B.held(on)  whether the boss still holds someone in its folds (the sprite shows a sleeve and a hand)
//   L83B.backdrop(place, {w, h, light, low, feet}) -> the backdrop for an apartment, the laundry room, the court
//      (by day, or under the tent at night) or the pump room; the map's id picks it
window.L83B=(()=>{
const OL='#120c1c',D='#24141e',W='#f4efe6',MR='#5a1a22';
const sh=(h,a)=>{const n=parseInt(h.slice(1),16),f=v=>Math.max(0,Math.min(255,Math.round(v+a)));return'#'+[n>>16,n>>8&255,n&255].map(v=>f(v).toString(16).padStart(2,'0')).join('')};
// a pixel layer w × h in drawing coordinates; ox adds room either side (a wounded sprite leans and spills past its box)
function Ly(w,h,ox=0){const WW=w+2*ox,d=new Array(WW*h).fill(null);const L={w,h,d,W:WW,ox,
 g:(x,y)=>{x=Math.round(x)+ox;y=Math.round(y);return(x<0||y<0||x>=WW||y>=h)?null:d[y*WW+x]},
 p(x,y,c){x=Math.round(x)+ox;y=Math.round(y);if(x>=0&&y>=0&&x<WW&&y<h)d[y*WW+x]=c},
 r(x,y,a,b,c){for(let j=0;j<b;j++)for(let i=0;i<a;i++)L.p(x+i,y+j,c)},
 e(cx,cy,rx,ry,c){for(let y=Math.floor(cy-ry);y<=cy+ry;y++)for(let x=Math.floor(cx-rx);x<=cx+rx;x++){const a=(x+.5-cx)/rx,b=(y+.5-cy)/ry;if(a*a+b*b<=1)L.p(x,y,c)}},
 em(cx,cy,rx,ry,c){for(let y=Math.floor(cy-ry);y<=cy+ry;y++)for(let x=Math.floor(cx-rx);x<=cx+rx;x++){const a=(x+.5-cx)/rx,b=(y+.5-cy)/ry;if(a*a+b*b<=1&&L.g(x,y))L.p(x,y,c)}},
 line(x0,y0,x1,y1,c,w=1){const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);for(let i=0;i<=n;i++){const x=Math.round(x0+(x1-x0)*i/n),y=Math.round(y0+(y1-y0)*i/n);L.r(x,y,w,w,c)}},
 tex(from,to,m=7){for(let y=0;y<h;y++)for(let x=-ox;x<w+ox;x++)if(L.g(x,y)===from&&(x*3+y*5)%m===0)L.p(x,y,to)}};return L}
// light from the upper left: the lit edge gets a rim, every edge a dark outline
function finish(L){const w=L.W,{h,d}=L,o=d.slice(),G=(x,y)=>(x<0||y<0||x>=w||y>=h)?null:d[y*w+x];for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x,v=d[i];
 if(v){if((x>0&&!G(x-1,y))||(y>0&&!G(x,y-1)))o[i]=sh(v,30)}
 else if(G(x-1,y)||G(x+1,y)||G(x,y-1)||G(x,y+1))o[i]=OL}return o}
function blit(c,L,ox=0,oy=0){const o=finish(L),w=L.W;for(let i=0;i<o.length;i++)if(o[i]){c.fillStyle=o[i];c.fillRect(ox+i%w,oy+(i/w|0),1,1)}}

// ================= THE ENEMIES =================
// The case's things are pale, soft and blind: grub-cream bodies, a gut line you can half see through, a pink pucker
// for a mouth, and no eyes at all, except the one huge eye that can't see. Brine is the jars' cloudy yellow-green.
const GRUB='#e8dcc0',GRUBD=sh(GRUB,-34),GUT='#b89a78',PUCK='#c86a6a',BRINE='#b8c48a',BRINED='#8a9a60',GLASS='#c8d0a0',LID='#8a8a90',
 PIPE='#7a7e84',PIPED='#54585e',RUST='#8a5a3a',ROBE='#7a5a8a',HAND='#7a4a2c';
// a grub's body: segments as ellipses along a line, head first, each with its dark ring and a gut line through them
function grub(L,segs,f,o={}){const c=o.c||GRUB,cd=sh(c,-34);
 segs.forEach(([x,y,rx,ry],i)=>{const dy=f&&i%2?1:0;L.e(x+.5,y+dy+.8,rx,ry,cd);L.e(x,y+dy,rx-.6,ry-.8,c)});
 for(let i=1;i<segs.length;i++){const [x,y,,ry]=segs[i],[px]=segs[i-1],bx=Math.round((x+px)/2),dy=f&&i%2?1:0;for(let k=-Math.floor(ry*.7);k<=Math.floor(ry*.7);k++)if(L.g(bx,y+k+dy))L.p(bx,y+k+dy,cd)}
 const a=segs[0],b=segs[segs.length-1];L.line(a[0]+1,a[1]+1,b[0]-1,b[1],o.gut||GUT);
 segs.forEach(([x,y,rx,ry],i)=>{if(i<segs.length-1)L.p(x-rx*.3,y-ry*.55+(f&&i%2?1:0),sh(c,22))})}
const B={
// A nit: a finger-long blind grub, curled, carrying warmth back through the walls. No eyes. The one wrong detail: it
// breathes, slow, like something asleep.
nit:{name:'Nit',w:30,h:18,pad:3,f(L,f){
 grub(L,[[7,10,5,5],[12,9,5,5.6],[17,9,5,5.6],[21,10,4.6,5],[25,12,3.6,4],[27.5,14,2.6,3]],f);
 L.e(3,11,2.4,2.2,PUCK);L.p(2,11,MR);L.p(3,12,MR);
 [8,12,16,20].forEach((x,i)=>L.r(x,14+(f&&i%2?1:0),2,2,GRUBD))}},
// A crawler: a grown nit carrying a whole jar of brine on its back, back to the nest, careful as a mother.
crawler:{name:'Crawler',w:40,h:34,f(L,f){const t=f?1:0;
 grub(L,[[8,26,6,6],[14,25,6,7],[20,25,6,7],[26,26,6,6],[31,28,4.6,4.6],[35,30,3,3]],f);
 L.e(3,27,2.6,2.6,PUCK);L.p(2,27,MR);L.p(3,28,MR);
 // the mason jar on its back: cloudy brine, something pale folded up inside, the lid's bands
 L.r(14,5+t,13,16,sh(GLASS,-30));L.r(15,6+t,11,14,GLASS);L.r(15,9+t,11,11,BRINE);L.e(20.5,14.5+t,3.6,4.4,'#ece4cc');L.e(19.5,13.5+t,1.6,1.8,'#f8f2e0');L.r(16,7+t,1,12,'#e8ecd0');
 L.r(13,2+t,15,4,LID);L.r(13,3+t,15,1,'#b0b0b8');L.r(14,1+t,13,1,sh(LID,-20));
 // the front legs hug the jar
 L.line(6,22,13,11+t,GRUBD,2);L.line(9,22,14,17+t,GRUB,2);
 [10,15,20,25,30].forEach((x,i)=>L.r(x,31+(f&&i%2?1:0),2,2,GRUBD))}},
// The Drone: a grown nit the size of a cat, its body swollen with the brine it has drunk, guarding the laundry's ice.
drone:{name:'Drone',w:54,h:40,f(L,f){const b=f?1:0;
 // the sac: big, see-through, brine sloshing in it, pale specks floating
 L.e(32,21,20+b,15+b,sh(BRINE,-26));L.e(31,20,19+b,14+b,BRINE);L.e(33,26,16,7,BRINED);L.e(26,14,8,5,sh(BRINE,22));
 [[24,22],[34,17],[40,24],[30,28],[44,19]].forEach(([x,y])=>{L.p(x,y+b,'#ece4cc');L.p(x+1,y+b,'#ece4cc')});
 for(const x of[22,30,38,46])for(let y=8;y<34;y++)if(L.g(x,y)&&(y+x)%3)L.p(x,y,sh(BRINE,-14));
 // the front: cream segments and the pucker
 grub(L,[[13,27,6,7],[7,28,5,6]],f);L.e(2,29,2.6,2.6,PUCK);L.p(1,29,MR);L.p(2,30,MR);
 [10,16,24,32,40,46].forEach((x,i)=>L.r(x,35+(f&&i%2?1:0),3,3,GRUBD))}},
// The boss: grown, the size of a sofa, pale and soft, one huge milky eye that can't see. In the first phase its body is
// woven into the warm pipes of the pump room, and someone is held in its folds: a sleeve of a purple bathrobe, a hand.
// Phase 2 ('lodger2'): it tears out of the pipes and rears up, the pipes bent and broken, and opens a wet mouth.
lodger:{name:'The Lodger',w:112,h:88,f(L,f,ph2){const t=f?1:0,c='#e0d4bc',cd=sh(c,-34),cl=sh(c,16);
 const rise=ph2?-8:0;
 // pipes behind it (phase 1: whole; phase 2: torn and hanging)
 if(!ph2){L.r(0,6,112,7,PIPED);L.r(0,7,112,4,PIPE);L.r(0,7,112,1,sh(PIPE,24));for(const x of[18,52,86])L.r(x,5,4,9,PIPED);[30,70].forEach(x=>L.r(x,8,6,2,RUST));
  for(const x of[12,98]){L.r(x,12,7,40,PIPED);L.r(x+1,12,4,40,PIPE);L.r(x+1,12,1,40,sh(PIPE,24))}}
 else{L.r(0,6,40,7,PIPED);L.r(0,7,40,4,PIPE);L.r(72,6,40,7,PIPED);L.r(72,7,40,4,PIPE);L.line(40,9,46,22,PIPED,4);L.line(72,9,66,18,PIPED,4);L.r(30,8,6,2,RUST);
  L.line(12,12,4,40,PIPED,5);L.line(13,12,5,40,PIPE,2);L.line(100,12,108,36,PIPED,5)}
 // the body: overlapping folds, darker underneath
 L.e(56,62+rise*.4,54,26,cd);L.e(55,60+rise*.4,52,24,c);
 [[22,58,18,14],[44,52,20,15],[68,52,20,15],[90,58,18,14],[56,70,30,12],[32,72,16,9],[80,72,16,9]].forEach(([x,y,rx,ry],i)=>{
  L.e(x+1,y+1+rise*.4+(t&&i%2?1:0),rx,ry,cd);L.e(x,y+rise*.4+(t&&i%2?1:0),rx-1,ry-1,c);L.e(x-rx*.35,y-ry*.4+rise*.4,rx*.4,ry*.3,cl)});
 L.tex(c,sh(c,-10),11);
 // phase 1: pipes pass right through it
 if(!ph2){L.r(0,48,10,6,PIPED);L.r(0,49,10,3,PIPE);L.r(102,46,10,6,PIPED);L.r(102,47,10,3,PIPE)}
 // the eye: huge, milky, blind; a faint grey iris and a cloudy pupil; pink threads; a soft lid fold over it
 const ey=34+rise+t;L.e(56,ey,19,16,cd);L.e(56,ey,17,14,'#eef0ea');L.e(56,ey+1,10,9,'#c8d0d0');L.e(56,ey+1,5,5,'#a8b0b2');L.e(54,ey-1,2,2,'#f8faf8');
 [[40,ey-4,46,ey-1],[70,ey+5,64,ey+3],[43,ey+8,48,ey+5],[68,ey-6,63,ey-3]].forEach(([a,b,x,y])=>L.line(a,b,x,y,'#d89a9a'));
 for(let x=38;x<=74;x++){const y=Math.round(ey-15+((x-56)/18)**2*5);L.p(x,y,cd);L.p(x,y-1,c)}
 // phase 2: a wet mouth opens under the eye
 if(ph2){L.e(56,ey+22,12,4+t,MR);L.e(56,ey+22,10,2+t,'#d8607a');for(let x=47;x<=65;x+=3)L.p(x,ey+20,'#f4e8d8')}
 // the one it holds: a sleeve of a purple bathrobe and a hand, folded in on the right side
 if(held){L.e(90,66,7,5,ROBE);L.e(89,65,5,3,sh(ROBE,18));L.r(94,68,7,3,HAND);L.r(100,69,2,2,HAND);L.r(96,71,1,2,sh(HAND,-20));L.r(98,71,1,2,sh(HAND,-20));L.e(84,62,8,4,c)}}}
};
let held=true;  // the boss still holds someone (the case says, L83B.held)

// ================= WOUNDED ENEMIES (Art, Townsfolk and monsters, Wounded enemies) =================
// Two steps: at half HP and at a quarter. The grubs split and leak yellow-green ichor; the crawler's jar cracks and then
// breaks; the Drone's sac is punctured and then empties; the Lodger's folds tear open on raw pink and its eye goes red.
const WPAD=8,ICHOR='#c8c060',ICHORD='#8a8a3a',RAW='#c86a6a',RAWD='#8a3a3e';
const grey=(h,k)=>{const n=parseInt(h.slice(1),16),r=n>>16,g=n>>8&255,b=n&255,l=(r*.3+g*.59+b*.11)*.82,f=v=>Math.max(0,Math.min(255,Math.round(v+(l-v)*k-k*18)));
 return'#'+[r,g,b].map(v=>f(v).toString(16).padStart(2,'0')).join('')};
const inBlob=(x,y,cx,cy,rx,ry,sd)=>{const a=(x+.5-cx)/rx,b=(y+.5-cy)/ry,t=Math.atan2(b,a),r=1+.22*Math.sin(5*t+sd)+.12*Math.sin(9*t+sd*2.3);return a*a+b*b<=r*r};
const blob=(L,cx,cy,rx,ry,sd,fn)=>{for(let y=Math.floor(cy-ry*1.4);y<=cy+ry*1.4;y++)for(let x=Math.floor(cx-rx*1.4);x<=cx+rx*1.4;x++)if(inBlob(x,y,cx,cy,rx,ry,sd))fn(x,y)};
const Wk={
 bite(L,cx,cy,rx,ry,sd=1){blob(L,cx,cy,rx,ry,sd,(x,y)=>{if(L.g(x,y))L.p(x,y,null)})},
 gash(L,cx,cy,rx,ry,sd=2,c=RAWD){blob(L,cx,cy,rx,ry,sd,(x,y)=>{if(L.g(x,y))L.p(x,y,c)})},
 stain(L,cx,cy,rx,ry,sd=3,c=ICHORD,c2=ICHOR){blob(L,cx,cy,rx,ry,sd,(x,y)=>{if(L.g(x,y))L.p(x,y,c)});blob(L,cx-rx*.15,cy-ry*.2,rx*.5,ry*.5,sd+1,(x,y)=>{if(L.g(x,y))L.p(x,y,c2)})},
 drip(L,x,y,n,c=ICHOR,any){for(let j=0;j<n;j++)if(any||L.g(x,y+j))L.p(x,y+j,c);if(any)L.p(x,y+n,c)},
 puddle(L,cx,rx,c=ICHORD,c2=ICHOR){const y=L.h-1;L.e(cx,y,rx,2.2,c);L.e(cx-1,y,rx*.6,1.2,c2)},
 crack(L,x,y,n,sd=0,c='#f8faf0'){let cx=x,cy=y;for(let i=0;i<n;i++){if(L.g(cx,cy))L.p(cx,cy,c);cy++;cx+=((i*7+sd)%3)-1}},
 dull(L,x0,x1,amt){const d=x1>x0?1:-1;for(let y=0;y<L.h;y++)for(let x=x0;d>0?x<=x1:x>=x1;x+=d){const v=L.g(x,y);if(!v||v===ICHOR||v===ICHORD||v===RAW)continue;L.p(x,y,grey(v,amt*Math.min(1,.4+.6*Math.abs(x-x0)/Math.max(1,Math.abs(x1-x0)))))}},
 sag(L,x0,y0,w,h,dy,dx=0){const px=[];for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++){const v=L.g(x,y);if(v){px.push([x,y,v]);L.p(x,y,null)}}px.forEach(([x,y,v])=>L.p(x+dx,y+dy,v))},
 cut(L,x,y,w,h){for(let j=0;j<h;j++)for(let i=0;i<w;i++)L.p(x+i,y+j,null)}
};
const WOUND={
// a nit: its tail end bitten off and leaking; then it's split in two, the halves apart, in a puddle
nit(L,s){
 if(s===1){Wk.bite(L,27,13,3,3,2);Wk.stain(L,22,10,3,3,3);Wk.drip(L,21,12,4);Wk.dull(L,14,30,.3)}
 else{Wk.cut(L,15,0,3,18);Wk.sag(L,18,0,14,18,1,2);Wk.stain(L,14,9,2.5,4,2);Wk.stain(L,20,10,2.5,4,4);Wk.puddle(L,16,8);Wk.dull(L,10,32,.5)}},
// a crawler: the jar cracks and brine runs down; then the jar is broken open, the lid knocked off, the grub split
crawler(L,s,f){const t=f?1:0;
 Wk.crack(L,18,8+t,10,1);Wk.drip(L,16,20+t,8,BRINE,true);Wk.stain(L,26,25,3,3,2);
 if(s===2){Wk.cut(L,22,5+t,6,10);Wk.cut(L,13,0,16,4+t);L.r(30,1,12,3,LID);Wk.crack(L,21,9+t,11,2);Wk.stain(L,14,26,4,4,3);Wk.puddle(L,20,14,BRINED,BRINE);Wk.dull(L,20,40,.5)}
 else Wk.dull(L,26,40,.3)},
// the Drone: a hole in the sac, brine pouring out; then the sac hangs empty and wrinkled in a spreading puddle
drone(L,s){
 if(s===1){Wk.gash(L,38,20,3,3,1,BRINED);Wk.drip(L,38,23,15,BRINE,true);Wk.stain(L,12,26,3,3,2);Wk.puddle(L,38,8,BRINED,BRINE);Wk.dull(L,30,54,.25)}
 else{Wk.sag(L,14,4,40,24,6);Wk.gash(L,36,24,6,4,1,BRINED);Wk.gash(L,26,22,3,3,3,BRINED);for(let x=18;x<50;x+=4)Wk.drip(L,x,22+(x%3),3,sh(BRINE,-40));
  Wk.stain(L,10,27,4,4,2);Wk.puddle(L,30,22,BRINED,BRINE);Wk.dull(L,16,54,.5)}},
// the Lodger: its folds tear onto raw pink and ichor runs; then a big piece of it is gone, the eye bloodshot and cut,
// and it sits in its own spreading puddle
lodger(L,s,f,ph2){const ey=34+(ph2?-8:0)+(f?1:0);
 Wk.gash(L,30,58,s>1?8:5,s>1?7:4,2,RAW);Wk.gash(L,30,58,s>1?4:2,s>1?3:2,3,RAWD);Wk.gash(L,78,64,s>1?6:4,s>1?5:3,4,RAW);
 Wk.drip(L,30,62,s>1?14:8,ICHOR);Wk.drip(L,79,67,s>1?12:6,ICHOR);
 for(const [a,b,x,y] of[[39,ey,47,ey+2],[73,ey,65,ey-2],[56,ey-13,55,ey-6],[56,ey+14,58,ey+8]])L.line(a,b,x,y,'#c84a4a');
 if(s===1){Wk.dull(L,70,112,.25);Wk.puddle(L,56,18)}
 else{Wk.bite(L,100,52,10,12,2);Wk.gash(L,96,54,5,8,3,RAW);Wk.gash(L,62,ey-2,4,2,1,RAWD);Wk.sag(L,0,40,30,48,3);Wk.dull(L,60,112,.5);Wk.puddle(L,56,34)}}
};

// ================= THE BOSS'S PORTRAIT (it talks, in a kind voice that isn't its own) =================
function portraitLayer(open){const L=Ly(64,64),c='#e0d4bc',cd=sh(c,-34);
 L.e(32,40,34,26,cd);L.e(31,39,32,24,c);[[10,44,12,10],[52,44,12,10],[32,56,18,8]].forEach(([x,y,rx,ry])=>{L.e(x+1,y+1,rx,ry,cd);L.e(x,y,rx-1,ry-1,c)});
 L.e(32,28,20,17,cd);L.e(32,28,18,15,'#eef0ea');L.e(32,29,11,10,'#c8d0d0');L.e(32,29,5,5,'#a8b0b2');L.e(29,26,2,2,'#f8faf8');
 [[15,24,21,27],[49,33,43,31],[18,36,23,33],[46,20,41,24]].forEach(([a,b,x,y])=>L.line(a,b,x,y,'#d89a9a'));
 for(let x=13;x<=51;x++){const y=Math.round(13+((x-32)/19)**2*5);L.p(x,y,cd);L.p(x,y-1,c)}
 if(open){L.e(32,52,8,3,MR);L.e(32,52,6,1.6,'#d8607a')}else{L.r(26,52,12,1,MR);L.p(25,51,MR);L.p(38,51,MR)}
 return L}
const pc={};
function portrait(ctx,open){const k=open?1:0;if(!pc[k]){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');x.fillStyle='#16121a';x.fillRect(0,0,64,64);
  x.fillStyle='#22181e';for(let y=0;y<64;y+=4)x.fillRect(0,y,64,1);blit(x,portraitLayer(k));pc[k]=c}
 ctx.clearRect(0,0,64,64);ctx.drawImage(pc[k],0,0)}

// ================= BATTLE BACKDROPS (Combat, Basics, Backgrounds) =================
// Head-on at battle scale, one per kind of place the case fights in: an apartment ('apt': a beige wall, a window unit,
// a shrieking ceiling fan and moving boxes), the laundry room ('laundry': coin washers and dryers under a buzzing tube),
// Pecan Court ('court': the two-story block with its walkway, numbered doors and metal stairs under a hot white sky by
// day; under the striped tent at night, lit by a work light and a bug light), and the pool pump room ('pump': a
// concrete vault, sweating pipes, the filter tank and a bare bulb). Low SAN shrinks the lights; battle.js lays the sour.
const KIND={unit6:'apt',unit5:'apt',unit9:'apt',unit12:'apt',office:'apt',laundry:'laundry',court:'court',pump:'pump'};
const BDC={};
function backdrop(place,o){const kind=KIND[place]||place,f=BDRAW[kind];if(!f)return null;const key=[kind,o.light,o.low?1:0,o.w,o.h,o.feet].join('|');if(BDC[key])return BDC[key];
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
  // 3 × 5 digits and capitals for unit numbers and signs (made-up names only)
  text(s,x,y,c){const F={0:'111101101101111',1:'010110010010111',2:'111001111100111',3:'111001111001111',4:'101101111001001',5:'111100111001111',6:'111100111101111',7:'111001001001001',8:'111101111101111',9:'111101111001111',
   A:'010101111101101',M:'101111111101101',C:'111100100100111',E:'111100110100111',H:'101101111101101',I:'111010010010111',L:'100100100100111',N:'101111111111101',O:'111101101101111',P:'110101110100100',R:'110101110101101',S:'111100111001111',T:'111010010010010',U:'101101101101111',D:'110101101101110',Y:'101101010010010',' ':'000000000000000'};
   [...String(s)].forEach((ch,i)=>{const b=F[ch];if(b)for(let j=0;j<15;j++)if(b[j]==='1')R(x+i*4+j%3,y+(j/3|0),1,1,c)})}};
 return K}
// a floor the fighters stand on: bands from the wall's foot to the bottom, with a little scatter
function floor(K,W,H,hz,cols,dot,seed){K.R(0,hz-1,W,2,sh(cols[0],-24));K.bands(hz+1,H,cols,W);
 for(let i=0;i<34;i++){const t=K.hash(i,seed),x=K.hash(i,seed+1)*W|0,y=Math.round(hz+3+t*t*(H-hz-4));K.R(x,y,2,1,dot)}}
// a window unit in a wall: on (a drip and a hum) or dead
function windowAC(K,x,y,on){const R=K.R;R(x,y,30,18,'#c8c4b8');R(x+1,y+1,28,16,'#e0dccc');for(let i=0;i<6;i++)R(x+3,y+3+i*2,16,1,'#9a968a');R(x+21,y+3,6,6,'#8a867a');R(x+22,y+11,4,2,on?'#6ad04a':'#5a5a52');R(x-2,y+18,34,2,'#8a867a')}
const BDRAW={
apt(K,W,H,hz,o){const R=K.R,nt=o.light==='night',low=o.low;
 // the back wall: beige, a baseboard, scuffs; a window with blinds (the heat white behind it by day)
 const wall=nt?'#4a4038':'#d8c8a8';R(0,0,W,hz,wall);for(let y=4;y<hz;y+=9)R(0,y,W,1,sh(wall,-6));R(0,hz-6,W,5,nt?'#2e2822':'#a89878');
 const wx=Math.round(W*.58),wy=Math.max(6,hz-74),ww=56,wh=42;R(wx-2,wy-2,ww+4,wh+4,nt?'#2a2420':'#f4efe6');R(wx,wy,ww,wh,nt?'#141826':'#f8f4e4');
 for(let y=wy+2;y<wy+wh;y+=4)R(wx,y,ww,2,nt?'#2a2e40':'#d8d0b8');if(!nt)K.pool(wx+ww/2,wy+wh/2,40,30,'#fff8d8',.25,3);
 windowAC(K,wx+13,wy+wh-6,false);
 // the ceiling fan: a black X near the top, blades blurred in two places
 const fx=Math.round(W*.3),fy=Math.max(4,hz-96);R(fx-1,0,2,fy,'#2a2030');R(fx-4,fy,8,4,'#3a3040');K.line(fx-30,fy+1,fx+30,fy+5,'#5a4a3a',2);K.line(fx-20,fy+6,fx+20,fy-1,sh('#5a4a3a',-20),2);
 // moving boxes stacked against the wall, marked in marker
 [[8,0],[8,1],[40,0],[150,0],[176,0],[176,1],[202,0]].forEach(([x,lv],i)=>{const bw=26+(i%2)*4,bh=20,by=hz-6-bh*(lv+1);R(x,by,bw,bh,nt?'#5a4630':'#b08a5a');R(x,by,bw,2,nt?'#6a5440':'#c8a070');R(x+bw/2-1,by,2,6,nt?'#7a6450':'#d8c098');R(x+4,by+9,bw-8,1,nt?'#2a1e14':'#3a2a1a')});
 K.text('JARS',48,hz-20,nt?'#2a1e14':'#3a2a1a');
 floor(K,W,H,hz,nt?['#3a3040','#3e3444','#423848']:['#8a7a68','#86766a','#827264'],nt?'#2e2636':'#6a5a4a',61);
 if(nt){const k=low?.65:1;K.pool(W/2,H+4,110*k,(H-hz)*.7*k,'#ffcf80',.22,5)}},
laundry(K,W,H,hz,o){const R=K.R,low=o.low;
 // white tile, the buzzing tube up top, the machines along the back: washers left, dryers right, the soda machine
 R(0,0,W,hz,'#c8ccc4');for(let y=0;y<hz;y+=8)R(0,y,W,1,'#b0b4ac');for(let x=0;x<W;x+=8)R(x,0,1,hz,'#b0b4ac');
 R(20,4,W-40,5,'#e8e4d8');R(22,5,W-44,3,'#f8fff8');K.pool(W/2,8,W*.6,40,'#f0fff0',low?.16:.28,4);
 for(let i=0;i<6;i++){const x=8+i*36,top=hz-46;R(x,top,32,44,'#f0eee8');R(x,top,32,3,'#d8d4cc');R(x+1,top+44,30,2,'#8a8880');
  K.ell(x+16,top+26,10,10,'#7a7e84');K.ell(x+16,top+26,8,8,i<3?'#a8c0d0':'#3a3a40');if(i===4)K.ell(x+16,top+26,8,8,'#d89040');R(x+4,top+6,8,3,'#8a8880');R(x+22,top+6,6,3,'#c8402e')}
 const sx=W-26;R(sx,hz-64,24,62,'#c8302e');R(sx+3,hz-58,18,24,'#f4efe6');for(let k=0;k<5;k++)R(sx+4,hz-30+k*5,7,3,k===2?'#6ad04a':'#5a2a2a');
 floor(K,W,H,hz,['#9a9a92','#a2a29a','#aaaaa2'],'#7a7a72',71);for(let x=0;x<W;x+=16)R(x,hz+1,1,H-hz,'#8a8a82')},
court(K,W,H,hz,o){const R=K.R,nt=o.light==='night',low=o.low;
 const top=Math.max(4,hz-110);
 if(nt){// under the tent: wide warning stripes overhead, sagging between the ropes
  const S=['#c8402e','#ece4d0','#e8c84a','#2e4a8a'];for(let y=0;y<Math.max(24,top+18);y++)for(let x=0;x<W;x++){const s=((x+y*1.6)/16|0)%4;R(x,y,1,1,sh(S[s],-120))}
  for(let x=0;x<W;x+=40)K.line(x,0,x+20,top+18,'#0c0a10',1)}
 else K.bands(0,top+20,['#ece8de','#f4ecd8','#f8f2e4','#fbf6ea'],W);
 // the two-story block: stucco, the upstairs walkway with its railing, numbered doors, window units, the metal stairs
 const st=nt?'#3a3036':'#d8c4a0',std=sh(st,-24),base=hz-4;R(0,top+16,W,base-top-16,st);
 const mid=Math.round((top+16+base)/2);R(0,mid-3,W,4,nt?'#2a2228':'#a89070');for(let x=0;x<W;x+=6)R(x,mid-14,2,11,nt?'#4a4248':'#5a5a64');R(0,mid-15,W,2,nt?'#4a4248':'#6a6a74');
 [0,1].forEach(row=>{const y0=row?mid+2:top+20,dh=row?base-mid-4:mid-top-38;for(let i=0;i<5;i++){const x=10+i*48,n=row?i+4:i+12;
  R(x,y0,18,dh,nt?'#2a1e22':'#7a3e2e');R(x+1,y0+1,16,2,nt?'#3a2a2e':'#9a5040');K.text(n,x+5,y0+5,nt?'#8a7a5a':'#e8c870');R(x+14,y0+dh/2,2,2,'#c8a040');
  windowAC(K,x+24,y0+4,!nt||i%2===0);if(nt&&i===2&&row)R(x+25,y0+5,28,16,'#0c0a10')}});
 if(nt){K.g.fillStyle='rgba(8,6,16,.55)';K.g.fillRect(0,top+16,W,base-top-16)}
 // metal stairs at the right
 const sx=W-34;for(let k=0;k<10;k++){const y=mid-4+k*((base-mid)/10);R(sx+k*2,y,26,2,nt?'#5a5a64':'#8a8a94')}K.line(sx,mid-6,sx+22,base,nt?'#6a6a74':'#9a9aa4',2);K.line(sx+26,mid-6,sx+48,base,nt?'#6a6a74':'#9a9aa4',2);
 // the courtyard's concrete deck, and at night the work light and the bug light
 floor(K,W,H,hz,nt?['#2a2630','#2e2a34','#322e38']:['#c8c0b0','#c0b8a8','#b8b0a0'],nt?'#3a3640':'#a8a090',81);
 for(let x=0;x<W;x+=32)R(x,hz+1,1,H-hz,nt?'#24202a':'#a8a090');
 if(nt){const k=low?.65:1,wx=Math.round(W*.16);R(wx,hz-40,2,40,'#3a3a40');K.line(wx+1,hz,wx-8,hz+4,'#3a3a40');K.line(wx+1,hz,wx+10,hz+4,'#3a3a40');R(wx-6,hz-46,14,8,'#e8c84a');R(wx-5,hz-45,12,5,'#fff8d0');
  K.pool(wx,hz-42,40*k,30*k,'#ffe9b0',.45,4);K.pool(wx+20,H,100*k,(H-hz)*.6*k,'#ffcf80',.24,5);
  const bx=Math.round(W*.62);R(bx,mid-12,6,5,'#a070ff');K.pool(bx+3,mid-10,18*k,14*k,'#a070ff',.4,3)}},
pump(K,W,H,hz,o){const R=K.R,low=o.low;
 // a concrete vault under the deep end: block walls, sweating pipes running across, the filter tank, one bare bulb
 R(0,0,W,hz,'#4a4844');for(let y=0;y<hz;y+=10)R(0,y,W,1,'#3e3c38');for(let y=0;y<hz;y+=10)for(let x=(y/10%2)*12;x<W;x+=24)R(x,y,1,10,'#3e3c38');
 [[10,8],[28,6],[hz-30,7]].forEach(([y,h])=>{R(0,y,W,h,'#54585e');R(0,y+1,W,h-3,'#7a7e84');R(0,y+1,W,1,'#9a9ea4');for(let x=18;x<W;x+=44)R(x,y-1,4,h+2,'#54585e');for(let x=30;x<W;x+=60)R(x,y+h,1,3,'#8ab0c0')});
 const tx=24,ty=hz-56;R(tx,ty,34,54,'#3e5a6a');R(tx+3,ty,6,54,'#5a7a8a');K.ell(tx+17,ty,17,5,'#4e6a7a');R(tx+12,ty+20,10,10,'#2a3a44');K.text('PUMP',tx+9,ty+36,'#c8d0d8');
 // the nest's edges, pale folds woven into the pipes at the right
 for(let i=0;i<7;i++){const x=W-80+i*12,y=hz-40+((i*5)%3)*8;K.ell(x,y,9,14,i%2?'#c8b8a0':'#d8c8b0');K.ell(x-2,y-4,4,5,'#e8dcc8')}
 const bx=Math.round(W*.42);R(bx,0,1,16,'#2a2824');R(bx-2,16,5,5,'#fff2c8');K.pool(bx,18,60*(low?.65:1),46*(low?.65:1),'#ffe0a0',.4,4);
 floor(K,W,H,hz,['#3a3834','#3e3c38','#42403c'],'#2e2c28',91);R(Math.round(W*.6),hz+8,26,6,'#141210');R(Math.round(W*.6)+2,hz+9,22,3,'#2a3a40');
 K.pool(W/2,H+4,110*(low?.65:1),(H-hz)*.6*(low?.65:1),'#ffcf80',.2,5)}
};

const SZ=k=>{const A=B[k==='lodger2'?'lodger':k];return A?[A.w,A.h]:[16,16]};
const cache=new Map();
// step: 0 unhurt, 1 at half HP, 2 at a quarter. A wounded sprite is 8 px wider each side so a spill isn't cut off; drawn
// centred, so it stays put, and the same height, so it stays on the ground.
function sprite(k,frame,step){step=step|0;const ph2=k==='lodger2',base=ph2?'lodger':k,key=k+(frame?1:0)+':'+step+(base==='lodger'&&held?'h':'');let c=cache.get(key);if(c)return c;const A=B[base];if(!A)return null;
 const P=A.pad||WPAD,L=Ly(A.w,A.h,step?P:0);A.f(L,frame?1:0,ph2);if(step){Wk.cut(L,-P,0,P,A.h);Wk.cut(L,A.w,0,P,A.h);if(WOUND[base])WOUND[base](L,step,frame?1:0,ph2)}
 c=document.createElement('canvas');c.width=L.W;c.height=A.h;blit(c.getContext('2d'),L);cache.set(key,c);return c}
return{B,sprite,size:SZ,portrait,backdrop,held:on=>{held=!!on}};
})();
