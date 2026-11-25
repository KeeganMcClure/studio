// Black Lantern · cases/lantern-02-battle-art.js · LANTERN 02's battle art (specs 014 and 015, Nov 25, 2026).
// SPOILERS for the case: its enemies and its boss. Made the way LANTERN 01's is (cases/lantern-01-battle-art.js): big
// head-on battle sprites with the light rim, both damage steps for every enemy (Art, Townsfolk and monsters, Wounded
// enemies), the case's painted battle backdrops (Combat, Basics, Backgrounds) and the boss's 64 x 64 talking portrait.
// Art for this case only; it goes to the Asset Library's LANTERN 02 page. Exposes window.L02B.
//   L02B.sprite(key, frame, step) -> cached canvas; frame 0/1 is the idle; step 0 unhurt, 1 at half HP, 2 at a quarter.
//      key: sheet, priest, twin, rdog, agnes, agnes2 (her second phase). The clean-up agent is the agency's own and is
//      drawn by Still Harvest's file (SHB), the same crew in every case.
//   L02B.size(key) -> [w, h]   L02B.portrait(ctx, open) draws THE OTHER AGNES's face
//   L02B.backdrop(place, {w, h, light, low, feet}) -> the backdrop for 'town', the rooms (the house, upstairs, the cafe,
//      the church) or 'hall'
window.L02B=(()=>{
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
function finish(L){const w=L.W,{h,d}=L,o=d.slice(),G=(x,y)=>(x<0||y<0||x>=w||y>=h)?null:d[y*w+x];for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x,v=d[i];
 if(v){if((x>0&&!G(x-1,y))||(y>0&&!G(x,y-1)))o[i]=sh(v,30)}
 else if(G(x-1,y)||G(x+1,y)||G(x,y-1)||G(x,y+1))o[i]=OL}return o}
function blit(c,L,ox=0,oy=0){const o=finish(L),w=L.W;for(let i=0;i<o.length;i++)if(o[i]){c.fillStyle=o[i];c.fillRect(ox+i%w,oy+(i/w|0),1,1)}}
// a mirror-thing's eye: silver where the white should be, the pupil on the wrong side
function glassEye(L,x,y,flip){L.r(x,y,5,4,'#d8e4ec');L.r(x+(flip?0:2),y+1,3,2,'#5a6a7a');L.p(x+(flip?1:3),y+1,D);L.r(x,y-2,5,1,D)}

// ================= THE ENEMIES =================
const SHEET='#d8d4cc',SHEETD='#a8a49c',SILVER='#b8c4cc',SILVERD='#7a8894',BLUE='#3e5a9a',SKIN='#f0d0b0';
const B={
// A dust sheet off the parlor furniture standing up with the shape of somebody sitting up straight under it. A head, two
// shoulders, the folds hanging. The wrong detail: the folds move like breathing, and there's nobody under it.
sheet:{name:'Dust sheet',w:50,h:76,f(L,f){const t=f?1:0;
 L.e(25,14,10,11,SHEETD);L.e(24,13,9,10,SHEET);
 for(let y=22;y<74;y++){const hw=11+Math.round((y-22)*.24)+((y>>3)%2&&y>40?1:0);L.r(25-hw,y,hw*2,1,SHEET);L.r(25+hw-4,y,4,1,SHEETD)}
 for(let x=10;x<42;x+=6)L.line(x,24+t,x+((x>>2)%2?2:-2),72,SHEETD);
 L.r(2,40-t,8,22,SHEET);L.r(40,38+t,8,22,SHEETD);L.e(6,62-t,4,3,SHEETD);L.e(44,60+t,4,3,SHEETD);
 L.e(21,14,2,2,'#c8c4bc');L.e(28,14,2,2,'#c8c4bc');
 for(let x=6;x<46;x+=3)L.p(x,74,(x%2)?SHEETD:SHEET)}},
// Father Tom's reflection: him in his bathrobe and reading glasses, a bingo card in his hand, everything backward
// (the robe's belt knotted on the wrong side, the part in his hair on the wrong side) and silvered at the edges like an
// old mirror. The wrong detail: he's smiling with the side of his mouth that has the missing tooth.
priest:{name:'His reflection',w:60,h:100,f(L,f){const t=f?1:0,rb='#6a2a3a',s=SKIN;
 L.r(20,82,8,18,'#c8c0b0');L.r(32,82,8,18,'#c8c0b0');L.r(18,96,11,4,'#5a3a2a');L.r(31,96,11,4,'#5a3a2a');
 for(let y=34;y<86;y++){const hw=15+Math.round((y-34)*.08);L.r(30-hw,y,hw*2,1,rb);L.r(30-hw,y,4,1,sh(rb,-30))}
 L.r(14,56,32,3,'#c8a040');L.e(44,58,3,3,'#c8a040');L.r(43,60,2,10,'#c8a040');L.tex(rb,sh(rb,14),6);
 L.r(4,36+t,9,40,rb);L.r(47,36-t,9,40,sh(rb,-20));L.e(8,78+t,4,4,s);L.e(52,76-t,4,4,s);L.r(50,66-t,10,12,'#f0c040');L.r(52,68-t,6,1,'#2a2030');
 L.r(24,28,12,8,'#f4efe6');L.r(26,30,8,4,'#1e1a22');
 L.e(31,16,13,14,sh(s,-40));L.e(30,15,12,13,s);L.e(30,5,12,5,'#a8a8a8');L.r(19,6,3,10,'#a8a8a8');L.r(38,6,3,10,'#8a8a8a');L.r(33,4,1,6,sh(s,-20));
 L.r(21,13,7,6,'#5a4a3a');L.r(32,13,7,6,'#5a4a3a');L.r(22,14,5,4,'#d8e4ec');L.r(33,14,5,4,'#d8e4ec');L.p(26,15,D);L.p(33,15,D);L.r(28,15,4,1,'#5a4a3a');
 L.r(24,23,12,1,MR);L.p(23,22,MR);L.r(26,24,2,2,'#2a1418');L.p(36,22,MR);
 // silvered edges, like the back of an old mirror showing through
 for(let i=0;i<30;i++){const x=6+((i*13)%48),y=10+((i*17)%86);if(L.g(x,y)&&!L.g(x+2,y)||L.g(x,y)&&!L.g(x-2,y))L.p(x,y,SILVER)}}},
// A reflection out walking: a man in a bathrobe and slippers, gray as a window at night, a second behind himself:
// a faint second outline trails him, offset.
twin:{name:'A reflection',w:46,h:84,f(L,f){const t=f?1:0,c='#5a6a7a',cd='#3e4a58';
 L.e(25,13,9,10,cd);for(let y=24;y<74;y++){const hw=10+Math.round((y-24)*.06);L.r(25-hw,y,hw*2,1,cd)}
 L.e(23,12,9,10,SILVER);for(let y=23;y<72;y++){const hw=10+Math.round((y-23)*.06);L.r(23-hw,y,hw*2,1,c);L.r(23-hw,y,3,1,SILVER)}
 L.r(14,46,18,2,'#2a3440');L.r(4,28-t,6,30,c);L.r(36,28+t,6,30,cd);L.r(14,72,8,10,cd);L.r(25,72,8,10,cd);L.r(12,80,11,4,'#2a3440');L.r(24,80,11,4,'#2a3440');
 glassEye(L,18,10,1);glassEye(L,25,10,0);L.r(20,18,7,1,'#2a3440')}},
// The dog: a big shaggy farm dog that died in '09, still walked on a leash nobody holds, see-through like a dog in a storm door
rdog:{name:'The dog',w:62,h:46,f(L,f){const t=f?1:0,c='#7a8a94',cd='#5a6a74';
 L.e(28,26,20,10,cd);L.e(27,25,19,9,c);L.tex(c,SILVER,5);L.r(12,32,5,13,cd);L.r(20,33,5,12,c);L.r(34,33,5,12,c);L.r(42,32,5,13,cd);
 L.e(50,16+t,9,8,c);L.e(57,19+t,5,4,cd);L.p(61,18+t,D);L.r(44,9+t,4,6,cd);L.r(52,8+t,4,6,cd);glassEye(L,46,13+t,0);glassEye(L,52,13+t,0);
 L.line(8,22,2,14-t,cd,2);L.line(48,24,40,4,'#c8402e');L.line(40,4,36,0,'#c8402e')}},
// The boss: Agnes in her good blue dress, white hair pinned up, her hands folded, perfect. Everything is backward: the
// dress's buttons on the wrong side, her part on the wrong side, the brooch on the wrong breast. A mirror's silver
// edge around all of her like she's cut out of the glass. Phase 2 ('agnes2'): she's out all the way, the silver edge
// cracked and spreading, her hands unfolded and reaching, and the reflection of the hall behind her showing through her.
agnes:{name:'The other Agnes',w:80,h:118,f(L,f,ph2){const t=f?1:0,s=SKIN,d=BLUE,dd=sh(BLUE,-34);
 // the silver edge of the glass she's cut out of
 L.e(40,20,17,19,SILVER);for(let y=32;y<116;y++){const hw=19+Math.round((y-32)*.16);L.r(40-hw,y,hw*2,1,SILVER)}
 // the dress: long, blue, buttoned on the wrong side, a lace collar, a brooch on the wrong breast
 for(let y=34;y<114;y++){const hw=16+Math.round((y-34)*.16);L.r(40-hw,y,hw*2,1,d);L.r(40-hw,y,5,1,dd)}
 L.tex(d,sh(d,12),8);[42,52,62,72].forEach(y=>L.r(46,y,2,2,'#e8e4dc'));L.r(30,34,20,4,'#f4efe6');for(let x=30;x<50;x+=3)L.p(x,38,'#f4efe6');L.e(34,44,2,2,'#c8a040');
 for(let y=60;y<112;y+=8)L.rm(24,y,32,1,sh(d,20));
 // the arms: folded at her waist in phase 1; reaching in phase 2
 if(!ph2){L.r(20,40,8,30,d);L.r(52,40,8,30,dd);L.e(40,70,10,4,s);L.r(32,68,16,4,s);L.r(35,67,10,1,sh(s,-30))}
 else{L.line(22,40,4,70+t,d,8);L.line(58,40,76,68-t,dd,8);L.e(5,74+t,4,4,s);L.e(75,72-t,4,4,s);[0,2,4].forEach(i=>{L.r(2+i,76+t,1,6,s);L.r(73+i,74-t,1,6,s)})}
 // the head: white hair pinned up, the part on the wrong side; the smile on the wrong side of her face
 L.r(34,28,12,7,sh(s,-28));
 L.e(41,17,12,13,sh(s,-40));L.e(40,16,11,12,s);L.e(44,11,5,4,sh(s,14));L.e(40,6,12,6,'#ece8de');L.e(40,0,6,4,'#ece8de');L.r(43,2,1,8,sh('#ece8de',-30));L.r(29,8,3,8,'#ece8de');L.r(49,8,3,8,'#d8d4cc');
 glassEye(L,32,13,1);glassEye(L,43,13,0);
 L.r(41,23,6,1,MR);L.p(47,22,MR);L.p(40,24,MR);L.r(44,22,1,1,sh(s,-40));
 if(ph2){// cracks spreading through her from the silver edge, the hall showing through
  for(const [x0,y0,x1,y1]of[[22,40,34,60],[34,60,30,84],[58,46,48,66],[48,66,52,90],[40,30,44,46]])L.line(x0,y0,x1,y1,'#e8f0f8');
  for(let i=0;i<12;i++){const x=26+((i*11)%30),y=60+((i*13)%48);if(L.g(x,y)===d||L.g(x,y)===dd)L.r(x,y,2,2,'#2a2e3a')}}}}
};

// ================= WOUNDED ENEMIES (Art, Townsfolk and monsters, Wounded enemies) =================
// Two steps: at half HP and at a quarter. The sheets tear onto nothing: holes show dark empty air. The reflections
// crack like glass: white crack lines, then pieces missing and silver showing, then a corner gone. Nothing here bleeds.
const WPAD=8,HOLLOW='#0e0c14',CRACK='#f0f6fa';
const grey=(h,k)=>{const n=parseInt(h.slice(1),16),r=n>>16,g=n>>8&255,b=n&255,l=(r*.3+g*.59+b*.11)*.82,f=v=>Math.max(0,Math.min(255,Math.round(v+(l-v)*k-k*18)));
 return'#'+[r,g,b].map(v=>f(v).toString(16).padStart(2,'0')).join('')};
const inBlob=(x,y,cx,cy,rx,ry,sd)=>{const a=(x+.5-cx)/rx,b=(y+.5-cy)/ry,t=Math.atan2(b,a),r=1+.22*Math.sin(5*t+sd)+.12*Math.sin(9*t+sd*2.3);return a*a+b*b<=r*r};
const blob=(L,cx,cy,rx,ry,sd,fn)=>{for(let y=Math.floor(cy-ry*1.4);y<=cy+ry*1.4;y++)for(let x=Math.floor(cx-rx*1.4);x<=cx+rx*1.4;x++)if(inBlob(x,y,cx,cy,rx,ry,sd))fn(x,y)};
const Wk={
 bite(L,cx,cy,rx,ry,sd=1){blob(L,cx,cy,rx,ry,sd,(x,y)=>{if(L.g(x,y))L.p(x,y,null)})},
 gash(L,cx,cy,rx,ry,sd=2,c=HOLLOW){blob(L,cx,cy,rx,ry,sd,(x,y)=>{if(L.g(x,y))L.p(x,y,c)})},
 // a crack across glass: a jagged white line from (x,y), branching
 crack(L,x,y,n,sd=0){let cx=x,cy=y;for(let i=0;i<n;i++){const nx=cx+((i*7+sd)%5)-2,ny=cy+3;for(let k=0;k<4;k++){const px=Math.round(cx+(nx-cx)*k/4),py=Math.round(cy+(ny-cy)*k/4);if(L.g(px,py))L.p(px,py,CRACK)}
  if((i+sd)%3===0){for(let k=1;k<5;k++){const px=cx+k*((i%2)?1:-1),py=cy+k;if(L.g(px,py))L.p(px,py,CRACK)}}cx=nx;cy=ny}},
 // a piece of glass gone: a shard-shaped hole with a silver lip
 shard(L,cx,cy,r,sd=0){for(let y=-r;y<=r;y++)for(let x=-r;x<=r;x++){if(Math.abs(x)+Math.abs(y)*((sd%2)?.7:1.3)>r)continue;if(L.g(cx+x,cy+y))L.p(cx+x,cy+y,Math.abs(x)+Math.abs(y)>r-2?SILVER:null)}},
 dull(L,x0,x1,amt){const d=x1>x0?1:-1;for(let y=0;y<L.h;y++)for(let x=x0;d>0?x<=x1:x>=x1;x+=d){const v=L.g(x,y);if(!v||v===CRACK||v===SILVER)continue;L.p(x,y,grey(v,amt*Math.min(1,.4+.6*Math.abs(x-x0)/Math.max(1,Math.abs(x1-x0)))))}},
 lean(L,dx,y0,y1){const W=L.W,d=L.d;for(let y=0;y<y1;y++){const s=Math.round(dx*Math.min(1,(y1-y)/Math.max(1,y1-y0)));if(!s)continue;const row=d.slice(y*W,y*W+W);for(let x=0;x<W;x++){const sx=x-s;d[y*W+x]=sx>=0&&sx<W?row[sx]:null}}},
 sag(L,x0,y0,w,h,dy,dx=0){const px=[];for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++){const v=L.g(x,y);if(v){px.push([x,y,v]);L.p(x,y,null)}}px.forEach(([x,y,v])=>L.p(x+dx,y+dy,v))},
 cut(L,x,y,w,h){for(let j=0;j<h;j++)for(let i=0;i<w;i++)L.p(x+i,y+j,null)},
 // shards on the floor under a broken reflection
 litter(L,cx,n,sd=0){for(let i=0;i<n;i++){const x=cx-n*3+i*6+((i*5+sd)%3),y=L.h-2-((i+sd)%2);L.r(x,y,3,1,SILVER);L.p(x+1,y-1,CRACK)}}
};
const WOUND={
 // the sheet: torn onto nothing, dark empty air; then a sleeve gone and the head caved in, folds slumping
 sheet(L,s){Wk.gash(L,22,44,s>1?6:4,s>1?9:5,2);Wk.bite(L,30,70,s>1?6:3,s>1?3:2,1);
  if(s===1){Wk.dull(L,26,50,.3);Wk.lean(L,2,6,40)}else{Wk.cut(L,40,36,10,26);Wk.gash(L,24,14,4,3,3);Wk.sag(L,12,2,26,20,4);Wk.dull(L,20,50,.55);Wk.lean(L,4,6,60)}},
 priest(L,s){Wk.crack(L,30,8,s>1?20:10,1);Wk.crack(L,18,40,s>1?14:6,2);
  if(s===1){Wk.dull(L,30,60,.3);Wk.lean(L,2,10,40)}else{Wk.shard(L,40,50,6,1);Wk.shard(L,22,70,5,2);Wk.cut(L,47,36,13,30);Wk.litter(L,30,6);Wk.dull(L,24,60,.55);Wk.lean(L,3,10,60)}},
 twin(L,s){Wk.crack(L,24,6,s>1?18:8,3);if(s===1){Wk.dull(L,23,46,.3)}else{Wk.shard(L,20,40,6,2);Wk.cut(L,36,26,10,34);Wk.litter(L,23,5);Wk.dull(L,10,46,.55);Wk.lean(L,3,8,50)}},
 rdog(L,s){Wk.crack(L,26,18,s>1?8:4,1);Wk.crack(L,50,10,s>1?6:3,2);if(s===1){Wk.dull(L,28,62,.3)}else{Wk.shard(L,30,26,6,1);Wk.cut(L,40,32,8,14);Wk.litter(L,30,5);Wk.dull(L,10,62,.55)}},
 agnes(L,s,f,ph2){Wk.crack(L,40,30,s>1?24:12,1);Wk.crack(L,26,60,s>1?16:8,2);Wk.crack(L,54,56,s>1?16:6,3);
  if(s===1){Wk.dull(L,40,80,.3);Wk.lean(L,2,10,40)}else{Wk.shard(L,32,70,7,1);Wk.shard(L,52,90,6,2);Wk.shard(L,44,40,4,3);Wk.cut(L,ph2?60:54,38,20,40);Wk.litter(L,40,8);Wk.dull(L,30,80,.55);Wk.lean(L,4,10,60)}}
};

// ================= THE BOSS'S PORTRAIT (it talks) =================
// Agnes's own face, kind, a librarian's face, white hair pinned up, a lace collar. Backward: the part, the mole, the
// smile on the wrong side. Silver eyes. Behind her head, a mirror's edge.
function portraitLayer(open){const L=Ly(64,64),s=SKIN,u=BLUE;
 L.e(32,30,22,24,SILVER);L.e(32,30,20,22,'#8a98a4');
 L.e(34,66,24,15,sh(u,-34));L.e(30,65,22,14,u);L.r(22,46,20,5,'#f4efe6');for(let x=22;x<42;x+=3)L.p(x,51,'#f4efe6');L.e(38,56,2,2,'#c8a040');L.r(27,43,10,5,sh(s,-28));
 L.e(17,33,3,4,s);L.e(47,33,3,4,sh(s,-30));
 L.e(33,34,15,15,sh(s,-46));L.e(33,33,15,14,sh(s,-26));L.e(31,32,14,14,s);L.e(37,28,6,5,sh(s,14));
 L.e(32,19,15,7,'#ece8de');L.e(32,11,7,5,'#ece8de');L.r(36,13,1,8,sh('#ece8de',-30));L.r(17,20,3,10,'#ece8de');L.r(44,20,3,9,'#d8d4cc');
 for(const x of[20,37]){L.r(x,27,7,6,'#d8e4ec');L.r(x+(x>30?1:3),28,3,3,'#5a6a7a');L.p(x+(x>30?2:4),29,D);L.r(x,25,7,1,D)}
 L.p(41,38,'#8a5a4a');L.p(32,36,sh(s,-40));L.p(31,37,sh(s,-40));
 if(open){L.r(30,41,8,4,MR);L.r(31,42,6,1,'#0e0c14');L.r(31,43,6,1,'#5a6a7a')}else{L.r(30,42,8,1,MR);L.p(38,41,MR);L.p(29,43,MR)}
 return L}
const pc={};
function portrait(ctx,open){const k=open?1:0;if(!pc[k]){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');
  const gr=x.createRadialGradient(22,18,4,32,32,46);gr.addColorStop(0,'#4a5868');gr.addColorStop(1,'#16141e');x.fillStyle=gr;x.fillRect(0,0,64,64);blit(x,portraitLayer(k));pc[k]=c}
 ctx.clearRect(0,0,64,64);ctx.drawImage(pc[k],0,0)}

// ================= BATTLE BACKDROPS (Combat, Basics, Backgrounds) =================
// Head-on at battle scale, one per kind of place the case fights in: Main Street ('town': the steeple, the white
// house, snowbanks, a lamp post, falling snow), a room (the house, upstairs, the cafe, the church: flowered wallpaper,
// a covered mirror, a window, a hanging lamp) and the hall ('hall': mirrors going back forever, a runner, the big
// mirror at the end). Lit for day or night; low SAN shrinks the lights like on the map, and battle.js lays the sour over it.
const BDC={};
const PLACE={town:'town',house:'room',upstairs:'room',cafe:'room',church:'room',hall:'hall'};
function backdrop(place,o){const f=BDRAW[PLACE[place]];if(!f)return null;const key=[place,o.light,o.low?1:0,o.w,o.h,o.feet].join('|');if(BDC[key])return BDC[key];
 const c=document.createElement('canvas');c.width=o.w;c.height=o.h;const g=c.getContext('2d');
 const hz=Math.round(Math.max(30,Math.min(o.feet-12,o.h*.44)));
 f(bdKit(g),o.w,o.h,hz,o,place);BDC[key]=c;return c}
function bdKit(g){const R=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))};
 const K={g,R,
  hash:(a,b=0)=>{let n=Math.imul(a|0,374761393)+Math.imul(b|0,668265263);n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967296},
  bands(y0,y1,cols,W){const n=cols.length,hh=(y1-y0)/n;for(let i=0;i<n;i++){const a=Math.round(y0+i*hh),b=Math.round(y0+(i+1)*hh);R(0,a,W,b-a,cols[i]);
   if(i<n-1)for(let x=0;x<W;x++){if((x&1)===0)R(x,b-1,1,1,cols[i+1]);if((x&3)===1)R(x,b-2,1,1,cols[i+1])}}},
  ell(cx,cy,rx,ry,c){for(let y=-Math.ceil(ry);y<=Math.ceil(ry);y++){const q=1-(y/ry)**2;if(q<0)continue;const hw=rx*Math.sqrt(q);R(cx-hw,cy+y,hw*2,1,c)}},
  line(x0,y0,x1,y1,c,w=1){const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);for(let i=0;i<=n;i++)R(x0+(x1-x0)*i/n,y0+(y1-y0)*i/n,w,w,c)},
  pool(cx,cy,rx,ry,c,a,steps=4){g.globalCompositeOperation='lighter';g.globalAlpha=a/steps;for(let i=0;i<steps;i++){const k=1-i/steps;K.ell(cx,cy,rx*k,ry*k,c)}g.globalAlpha=1;g.globalCompositeOperation='source-over'},
  flakes(W,H,n,c){for(let i=0;i<n;i++){const x=K.hash(i,61)*W|0,y=K.hash(i,62)*H|0;R(x,y,i%4?1:2,i%4?1:2,c)}},
  // a framed mirror, head-on
  mirror(x,y,w,h,frame,glass,cover){R(x-3,y-3,w+6,h+6,frame);R(x,y,w,h,glass);R(x+2,y+2,Math.max(1,w*.15),h-4,'rgba(255,255,255,.25)');R(x,y+h*.6,w,h*.4,'rgba(0,0,0,.15)');
   if(cover){R(x-5,y-5,w+10,h+14,'#d8d4cc');for(let i=4;i<w;i+=7)R(x+i,y-4,1,h+12,'#b8b4ac')}}};
 return K}
const BDRAW={
// Main Street: a gray March sky (or night), the steeple, the white house with green trim, snowbanks, a lamp post, snow
town(K,W,H,hz,o){const R=K.R,nt=o.light==='night',low=o.low,base=hz-4;
 K.bands(0,base,nt?['#080c16','#0c121e','#121a26','#1a2230']:['#8a96a4','#98a2ae','#a8b0ba','#b8c0c8'],W);
 // the steeple on the left
 const sx=Math.round(W*.18),st=Math.max(2,base-110);R(sx-12,st+40,24,base-st-40,nt?'#3a1e1a':'#7a3a30');for(let k=0;k<20;k++)R(sx-12+k*.6,st+40-k*2,24-k*1.2,2,nt?'#241418':'#3a2a30');R(sx-1,st-6,2,10,'#c8c0a8');R(sx-4,st-2,8,2,'#c8c0a8');
 R(sx-4,st+50,8,12,nt?'#14101a':'#1a1418');R(sx+6,st+40,6,base-st-40,'#e8eef4');
 // the white house with green trim on the right, a lit window at night
 const hx=Math.round(W*.62),ht=Math.max(10,base-74);for(let k=0;k<20;k++)R(hx-4+k*2,ht-k*1.5+30,80-k*4,2,nt?'#241e28':'#3a3440');R(hx,ht+30,72,base-ht-30,nt?'#3a3a44':'#e8e4dc');
 for(const wx of[hx+8,hx+48]){R(wx-2,ht+38,18,18,'#3e6a4a');R(wx,ht+40,14,14,nt?(wx>hx+20?'#e7b65a':'#1a1c26'):'#a8b8c8')}if(nt)K.pool(hx+55,ht+47,12,12,'#e7b65a',.3,3);
 R(hx+28,base-26,14,26,'#3e6a4a');for(let x=hx;x<hx+72;x+=4)R(x,ht+30,1,6+((x*7)%5),'#e8eef4');
 // the lamp post, lit at night
 const lx=Math.round(W*.42),lt=Math.max(6,base-70);R(lx-1,lt,3,base-lt,nt?'#14121a':'#3a3a44');R(lx-4,lt,9,4,nt?'#14121a':'#3a3a44');R(lx-3,lt+4,7,3,nt?'#ffcf80':'#d8d4cc');
 if(nt){const k=low?.7:1;K.pool(lx,lt+8,24*k,24*k,'#ffcf80',.4,4);K.pool(lx,base+6,44*k,10*k,'#ffcf80',.28,4)}
 // snowbanks along the curb, gray and gritty at the foot
 for(let i=0;i<6;i++){const cx=i*W/5+((i*13)%20);K.ell(cx,base,26,10,nt?'#5a6070':'#dfe6ee');K.ell(cx-4,base-2,18,7,nt?'#6a7080':'#eef2f6')}R(0,base,W,3,nt?'#3a3a44':'#77757e');
 // the slushy street they stand on
 R(0,hz-1,W,2,nt?'#2a2a30':'#5a5a64');K.bands(hz+1,H,nt?['#1e1e24','#22222a','#26262e']:['#5e5e68','#56565e','#4e4e56'],W);
 for(let i=0;i<30;i++){const x=K.hash(i,81)*W|0,y=hz+4+(K.hash(i,82)*(H-hz-6)|0);R(x,y,6+(i%8),2,nt?'#3a3a44':'#8a8a94')}
 if(nt){const k=low?.65:1;K.pool(W/2,H+4,110*k,(H-hz)*.65*k,'#ffcf80',.2,5)}
 K.flakes(W,H,70,nt?'rgba(220,230,240,.6)':'rgba(255,255,255,.75)')},
// a room: flowered wallpaper, a mirror (covered with a sheet in the house), a window, a hanging lamp, wood floor
room(K,W,H,hz,o,place){const R=K.R,nt=o.light==='night',low=o.low,base=hz-2,wall=place==='church'?'#c8c0b0':place==='cafe'?'#8a6a4a':'#b8a8a0';
 R(0,0,W,base,wall);if(place!=='cafe'&&place!=='church')for(let y=8;y<base-20;y+=16)for(let x=((y/16)%2)*10;x<W;x+=20){R(x,y,3,3,'#a86a7a');R(x+1,y+3,1,3,'#5a7a4a')}
 R(0,base-22,W,4,'#6a4430');R(0,base-18,W,base-base+18,shade2(wall));
 const wx=Math.round(W*.66),wy=Math.max(6,base-92);R(wx-4,wy-4,56,52,'#5a3a2a');R(wx,wy,48,44,nt?'#141a26':'#a8b8c8');R(wx,wy+26,48,18,nt?'#1a2430':'#e8eef4');R(wx+23,wy,2,44,'#5a3a2a');R(wx-6,wy-6,6,56,'#8a3a3a');R(wx+48,wy-6,6,56,'#8a3a3a');
 if(place==='church'){const gx=Math.round(W*.2),gy=Math.max(4,base-96);R(gx-3,gy-3,30,60,'#2a2030');const cs=nt?['#3a2a5a','#5a2a2a','#2a4a3a']:['#6a5aaa','#c8402e','#3e8a5a','#e8c84a'];for(let j=0;j<9;j++)for(let i=0;i<3;i++)R(gx+i*8,gy+j*6,7,5,cs[(i+j)%cs.length])}
 else K.mirror(Math.round(W*.2),Math.max(8,base-90),34,50,'#c8a040',nt?'#3a4450':'#b8c4cc',place==='house'||place==='upstairs');
 const bx=Math.round(W*.45);R(bx,0,1,Math.max(6,base-84),'#1a1410');R(bx-5,Math.max(6,base-84),11,6,nt?'#ffe8a8':'#e8e0c8');
 const k=low?.65:1;K.pool(bx,Math.max(6,base-78),40*k,40*k,'#ffcf80',nt?.36:.2,4);
 R(0,hz-1,W,2,'#2e1c12');K.bands(hz+1,H,['#5a3a24','#52341f','#4a2e1c'],W);for(let y=hz+6;y<H;y+=7)R(0,y,W,1,'#2e1c12');for(let y=hz+6,i=0;y<H;y+=7,i++)for(let x=(i*31)%44;x<W;x+=44)R(x,y,1,7,'#2e1c12');
 K.pool(W/2,H+4,100*k,(H-hz)*.6*k,'#ffcf80',.16,4)},
// the hall that goes on too long: mirrors down both walls getting smaller toward a vanishing point, the runner going
// back forever, the big mirror at the end with a blue dress in it
hall(K,W,H,hz,o){const R=K.R,low=o.low,base=hz-2,vx=W/2,vy=Math.round(base*.55);
 R(0,0,W,base,'#2e2230');
 for(let i=0;i<7;i++){const k=1-i/8,x0=vx-(vx)*k,x1=vx+(W-vx)*k,y0=vy-(vy)*k,y1=vy+(base-vy)*k;R(x0,y0,1,y1-y0,'#14101a');R(x1,y0,1,y1-y0,'#14101a');
  const mh=(y1-y0)*.4,mw=Math.max(3,18*k);K.mirror(x0+4*k,y0+(y1-y0)*.2,mw,mh,['#c8a040','#3a3a44','#8a5a3a'][i%3],'#3a4450');K.mirror(x1-4*k-mw,y0+(y1-y0)*.2,mw,mh,['#8a5a3a','#c8a040','#3a3a44'][i%3],'#3a4450')}
 // the big mirror at the end, and the blue dress in it
 K.mirror(vx-10,vy-14,20,26,'#c8a040','#4a5868');R(vx-3,vy-8,6,4,'#f0d0b0');R(vx-4,vy-4,8,12,'#3e5a9a');
 for(let y=4;y<base;y+=24){R(vx-2,y,4,2,'#c8b890')}const k=low?.6:1;K.pool(vx,base*.3,50*k,50*k,'#e8dcc0',.2,5);
 // the runner going back, and the floorboards
 R(0,hz-1,W,2,'#1a1218');K.bands(hz+1,H,['#2a1e24','#261a20','#22161c'],W);
 g2(K,vx,hz,W,H)}
};
function shade2(c){return'#'+[1,3,5].map(i=>Math.max(0,parseInt(c.slice(i,i+2),16)-40).toString(16).padStart(2,'0')).join('')}
function g2(K,vx,hz,W,H){const R=K.R;for(let y=hz+1;y<H;y++){const k=(y-hz)/(H-hz),hw=8+k*W*.22;R(vx-hw,y,hw*2,1,'#6a2a3a');R(vx-hw*.8,y,hw*1.6,1,'#8a3a4a')}
 for(let y=hz+6;y<H;y+=9){const k=(y-hz)/(H-hz),hw=8+k*W*.22;R(vx-hw*.6,y,hw*1.2,1,'#c8a040')}}

const SZ=k=>{const A=B[k==='agnes2'?'agnes':k];return A?[A.w,A.h]:[16,16]};
const cache=new Map();
// step: 0 unhurt, 1 at half HP, 2 at a quarter. A wounded sprite is 8 px wider each side so a lean or a spill isn't cut
// off; drawn centred, so it stays put, and the same height, so the feet stay on the ground.
function sprite(k,frame,step){step=step|0;const ph2=k==='agnes2',base=ph2?'agnes':k,key=k+(frame?1:0)+':'+step;let c=cache.get(key);if(c)return c;const A=B[base];if(!A)return null;
 const L=Ly(A.w,A.h,step?WPAD:0);A.f(L,frame?1:0,ph2);if(step){Wk.cut(L,-WPAD,0,WPAD,A.h);Wk.cut(L,A.w,0,WPAD,A.h);if(WOUND[base])WOUND[base](L,step,frame?1:0,ph2)}
 c=document.createElement('canvas');c.width=L.W;c.height=A.h;blit(c.getContext('2d'),L);cache.set(key,c);return c}
return{B,sprite,size:SZ,portrait,backdrop};
})();
