// Black Lantern · cases/still-harvest-art.js · Operation Still Harvest's art (spec 005, Demo 4 of 6, Nov 22, 2026). Exposes window.SHA.
// Art for this case only (Bible, Art, Direction: one case, one set of art); never reuse it in another case.
// Generic pieces come from the Shared Shelf (engine/shelf.js, v1, painted with SHELF.use(PALETTES.blacklantern));
// this file adds the case's own pieces, its townsfolk and their portraits, and paints its two maps from their letter grids.
// Wide scale: 16 px tiles; pieces are drawn in design pixels at s = 0.5 with the shelf's sprite method (dark outline, hard shade).
// Nothing here changes the story: it only draws what cases/still-harvest.js already places.
//
//   SHA.paint(M)          the map's still layer: ground, buildings, trees, fence, corn. -> {c, glows: [[x, y, r, a]]} in map pixels
//   SHA.props(M)          the map's standing pieces (lamps, pumpkins, scarecrows, the cruiser...), sorted with people by the engine
//   SHA.folk(id, dir, idle) a townsperson's map sprite -> {c, ax, ay}; ax, ay = the feet
//   SHA.portraits         speaker name -> (ctx, mouth) drawing the 64 x 64 talking portrait
//
// Still Harvest's accent colors (Bible, Art, Palette: each case adds a few), on top of the base palette:
const SH_ACCENT={cornGold:'#bf9f3c',husk:'#8a7028',stalk:'#5e6a26',tassel:'#e0c25a',burlap:'#c9a36a',committee:'#ff7a1a',dinerPink:'#d86a8a'};
const SHA=(()=>{
const K=SHELF,T=16,S=.5,{F,shade,hsh,RGB,art,autumn}=K,A=SH_ACCENT;
const once=f=>{let v;return()=>v||(v=f())};
const piece=(spec)=>{const a=K.prop(spec,S);return a};

// ================= CASE PIECES (map props, this case only) =================
// Each is a shelf-style prop spec: design box [w, h, offsetX, offsetY], the feet anchor, and lights [x, y, radius in tiles, strength].
const ST='#2a1a14',BUR=A.burlap,BURD=shade(BUR,-.3),STRAW=K.pal().straw,POLE='#4a3226';
// a straw person on a pole: the family scarecrows and the missing townsfolk share the frame, dressed differently
function strawman(R,P,E,C,big,o){
 if(o.pole!==false){R(22,10,4,62,POLE,{sh:1});R(0,24,48,3,POLE)}
 if(o.legs!==false){R(15,46,7,16,o.pants,{sh:2});R(26,46,7,16,o.pants,{sh:2});R(16,62,5,4,STRAW);R(27,62,5,4,STRAW)}
 R(2,23,12,7,o.sleeve||o.shirt,{sh:2});R(34,23,12,7,shade(o.sleeve||o.shirt,-.12),{sh:2});
 R(-2,22,5,9,STRAW);R(45,22,5,9,STRAW);R(-3,25,2,2,shade(STRAW,.2));
 R(13,22,22,25,o.shirt,{sh:6});if(o.body)o.body(R,P);
 R(21,46,6,3,STRAW);
 E(24,13,10,10,BUR);E(26,15,6,6,BURD);for(let i=0;i<6;i++)P(17+i*3,9+(i%3)*3,shade(BUR,.15));
 R(18,23,12,2,'#5a3a22');
 if(o.head)o.head(R,P,C);
 else{C(20,12,1.8,ST);C(28,12,1.8,ST);for(let x=18;x<=30;x++){const y=17+Math.round(Math.sin((x-18)/12*3.14)*1.5);R(x,y,1,1,ST);if(x%3===0)R(x,y-1,1,3,ST)}}
 if(o.hat){R(12,2,24,3,o.hat);R(16,-6,16,9,o.hat,{sh:4});R(16,1,16,2,o.band||'#7a2a22')}
}
const SCARECROW=(kind)=>({size:[56,78,6,10],anchor:[24,70],lights:[],draw({R,P,E,C,big}){
 if(kind==='pell')strawman(R,P,E,C,big,{shirt:'#6b4a8a',sleeve:'#e8dcc0',pants:'#3a3446',hat:'#4a3a2a',
  body:(R,P)=>{for(let y=26;y<44;y+=6)for(let x=15;x<33;x+=6){R(x+2,y,2,2,'#d6a43a');R(x+1,y+1,4,2,'#d6a43a');R(x+2,y+3,2,1,'#d6a43a')}R(22,22,4,6,'#e8dcc0')}});
 else strawman(R,P,E,C,big,{shirt:'#a8323e',pants:'#3b4a6b',hat:'#6a5a3a',band:'#2a2030',
  body:(R)=>{for(const x of[17,23,29])R(x,22,1,25,'#5a1a22');for(const y of[29,36,43])R(13,y,22,1,'#5a1a22')}});
}});
// the three missing townsfolk, as the maze shows them (case text: a cardigan and a ring; a varsity jacket and earbuds; glasses in a lawn chair)
const VICTIM=[
 {size:[56,78,6,10],anchor:[24,70],lights:[],draw({R,P,E,C,big}){strawman(R,P,E,C,big,{shirt:'#8a4a6a',pants:'#4a3a48',
  body:(R,P)=>{R(22,22,4,25,'#e8dcc0');for(const y of[28,34,40])P(23,y,'#3a2030');R(13,22,3,25,shade('#8a4a6a',.12))},
  head:(R,P,C)=>{R(13,4,22,5,'#7a4a2a');R(12,8,4,14,'#7a4a2a');R(32,8,4,14,shade('#7a4a2a',-.3));C(20,12,1.8,ST);C(28,12,1.8,ST);R(20,17,9,1,ST)}});
  R(-2,28,2,2,'#f2c94c');if(big)P(-2,28,'#fff6c8')}},
 {size:[56,78,6,10],anchor:[24,70],lights:[],draw({R,P,E,C,big}){strawman(R,P,E,C,big,{shirt:'#a8323e',sleeve:'#e8dcc0',pants:'#2f3a52',
  body:(R)=>{R(15,30,6,7,'#d6a43a');R(16,31,4,1,'#a8323e');R(13,44,22,3,'#e8dcc0')},
  head:(R,P,C)=>{C(20,12,1.8,ST);C(28,12,1.8,ST);R(20,17,9,1,ST);R(12,13,3,3,'#f4f4f4');R(33,13,3,3,'#f4f4f4');R(13,16,1,10,'#c8c8d4');R(34,16,1,10,'#c8c8d4')}})}},
 {size:[60,64,8,0],anchor:[24,60],lights:[],draw({R,P,E,C,big}){
  const AL='#c8c8d4';R(4,30,40,3,AL);R(4,30,3,30,AL);R(41,30,3,30,AL);R(6,52,36,3,AL);R(0,40,6,3,AL);R(42,40,6,3,AL);
  for(let x=8;x<40;x+=5){R(x,34,3,20,x%10?'#3e7a4a':'#e8e8e8')}
  strawman(R,P,E,C,big,{pole:false,legs:false,shirt:'#5a6a7a',pants:'#4a4038',
   head:(R,P,C)=>{for(const x of[20,28]){C(x,12,3.6,'#2a2030');C(x,12,2.4,'#bfe3ff');C(x,12,1.2,ST)}R(23,12,2,1,'#2a2030');R(20,17,9,1,ST)}});
  R(15,46,18,6,'#4a4038',{sh:3});R(15,52,6,10,'#4a4038');R(27,52,6,10,'#4a4038');R(14,61,8,3,STRAW);R(26,61,8,3,STRAW)}}];
// Deputy Ross's cruiser, nose to the left. Car-sized (about 52 x 27 px, twice a person's length); it still blocks only its two tiles
const CRUISER={size:[112,64,4,8],anchor:[52,54],lights:[],draw({R,P,big}){const W='#e8e8e8',BK='#1b1b2a',GL='#5a7ab0',GD=shade(GL,-.15);
 R(42,-4,10,5,'#d33');R(52,-4,10,5,'#35f');R(40,1,24,2,'#2a2a34');
 R(26,3,54,19,W,{sh:8});R(30,6,22,13,GL);R(55,6,21,13,GD);R(30,6,22,3,shade(GL,.35));R(55,6,21,3,shade(GD,.3));R(52,6,3,13,W);
 R(-2,22,108,20,W,{sh:12});R(-2,22,108,2,shade(W,.2));R(-2,29,108,5,BK);R(52,22,1,20,shade(W,-.3));R(26,22,1,20,shade(W,-.25));
 R(58,35,6,6,'#d6a43a');R(60,34,2,8,'#d6a43a');R(30,25,6,2,shade(W,-.35));R(62,25,6,2,shade(W,-.35));
 R(-3,24,4,5,'#ffd166');R(102,24,4,5,'#c0392b');R(-4,40,112,3,shade(W,-.45));
 for(const x of[10,76]){R(x-2,36,20,4,shade(W,-.5));R(x,38,16,16,'#111014');R(x+4,42,8,8,'#9aa0a6');R(x+7,45,2,2,'#4a4a52')}}};
// the cider stand: a folding table under a striped awning, two tiles wide
const CIDER={size:[66,64,1,10],anchor:[32,56],lights:[],draw({R,P}){const W='#f4f1e8',RD='#c0392b',WD='#5a3e2b';
 R(3,4,3,52,WD);R(58,4,3,52,WD);
 for(let x=0;x<64;x+=8){R(x,-8,8,13,(x/8)%2?W:RD,{sh:2});R(x+2,5,4,2,(x/8)%2?W:RD)}R(0,-9,64,2,'#2a1a14');
 R(6,34,52,5,'#a8743a');R(6,39,52,3,'#6a4a2a');R(10,42,2,14,'#6a4a2a');R(52,42,2,14,'#6a4a2a');R(14,42,36,1,'#4a3020');
 R(12,20,9,14,A.committee,{sh:3});R(14,17,5,3,'#5a3e2b');R(21,23,3,6,'#e0a030');
 for(const x of[28,34,40,46])R(x,28,4,6,W,{sh:1});for(const x of[28,34,40,46])R(x+1,29,2,1,'#e0a030');
 R(38,44,16,9,W);R(40,46,6,2,A.committee);R(40,49,11,1,'#7a6a5a')}};
// the notice board with the three missing posters (their faces crayoned over in orange)
const BOARD={size:[38,50,3,4],anchor:[16,46],lights:[],draw({R}){const WD='#5a3e2b';
 R(4,22,3,24,WD,{sh:1});R(25,22,3,24,WD,{sh:1});R(0,0,32,24,'#7a5a3a',{sh:4});R(0,0,32,2,'#a07a4a');
 for(const x of[2,12,22]){R(x,4,8,13,'#f4f4f4');R(x+2,6,4,4,A.committee);R(x+1,12,6,1,'#7a6a5a');R(x+1,14,4,1,'#7a6a5a')}R(5,19,22,2,'#f4f4f4')}};
// WELCOME TO MARROW CREEK, with the population crossed out in crayon
const SIGN={size:[46,42,3,4],anchor:[20,38],lights:[],draw({R}){const WD='#5a3e2b',INK='#3a2a1a';
 R(5,20,3,18,WD,{sh:1});R(32,20,3,18,WD,{sh:1});R(0,2,40,20,'#e8dcc0',{sh:4});R(0,2,40,2,shade('#e8dcc0',.2));
 R(4,6,32,2,INK);R(4,10,24,2,INK);R(8,15,10,2,INK);R(20,15,8,2,INK);R(19,14,10,1,A.committee);R(30,14,6,3,A.committee);R(31,9,4,4,K.pal().pumpkin)}};
// the maze gate on the east edge, two tiles tall, chained shut
const GATE={size:[36,76,2,8],anchor:[16,66],lights:[],draw({R,P}){const WD='#5a3e2b',BD='#7a5a3a',CH='#9aa0a6';
 R(0,-6,5,72,WD,{sh:2});R(27,-6,5,72,WD,{sh:2});
 for(const y of[4,20,36,52])R(4,y,24,6,BD,{sh:3});for(let i=0;i<5;i++)R(8+i*4,10+i*9,4,4,BD);
 for(let y=24;y<40;y+=3){R(13,y,2,2,CH);R(17,y+1,2,2,CH)}R(12,38,8,7,'#4a4a52');R(14,36,4,3,CH);P(16,41,'#1a1418');
 R(5,-4,22,8,'#e8dcc0');R(7,-2,18,2,'#3a2a1a')}};
// the podium on the green, two tiles wide
const PODIUM={size:[60,48,2,10],anchor:[28,40],lights:[],draw({R,P}){const WD='#6b4a2a';
 R(12,10,32,30,WD,{sh:6});R(8,4,40,7,shade(WD,.2),{sh:6});R(12,16,32,9,'#c0392b');for(let x=12;x<44;x+=8)R(x+3,25,2,2,'#c0392b');
 R(25,18,6,5,'#f2c94c');R(27,17,2,7,'#f2c94c');R(10,38,36,3,shade(WD,-.4));R(27,-6,2,10,'#2b2b33');R(25,-8,6,3,'#2b2b33')}};
// loot in the maze: a dropped backpack, and the torn page of the 1958 Walk program
const PACK={size:[26,26,1,4],anchor:[12,20],lights:[],draw({R}){R(4,4,16,16,'#3e5c8a',{sh:4});R(4,4,16,6,'#2d4569');R(11,11,2,2,'#c9c9c9');R(6,2,3,4,'#2d4569');R(15,2,3,4,'#2d4569')}};
const PAGE={size:[26,18,1,4],anchor:[12,12],lights:[],draw({R,P}){R(2,2,20,10,'#e8e2d0');R(4,4,14,1,'#7a6a5a');R(4,6,12,1,'#7a6a5a');R(4,8,15,1,'#7a6a5a');for(const x of[3,8,14,19])P(x,12,'#e8e2d0');P(22,5,'#e8e2d0')}};

const ART={};
const get=(k,spec)=>ART[k]||(ART[k]=piece(spec()));
const LAMP=()=>get('lamp',()=>K.LAMP);

// ================= MAP PAINTING =================
const PATHS=new Set(',KkYyNpG'.split(''));
const at=(M,x,y)=>{const r=M.g[y];return r?r[x]:undefined};
// the still layer, painted once per map and kept
const still={};
function paint(M){
 const key=M.bg+M.w+'x'+M.h;if(still[key])return still[key];
 const W=M.w*T,H=M.h*T,c=K.mk(W,H),g=c.getContext('2d'),img=g.createImageData(W,H),d=img.data,maze=M.bg==='maze',glows=[];
 const LEAF=autumn.LEAF();
 // leaf litter gathers under trees
 const near=[];for(let y=0;y<M.h;y++){near.push([]);for(let x=0;x<M.w;x++){let n=0;for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++)if(at(M,x+i,y+j)==='T')n++;near[y].push(n)}}
 const C1=[A.stalk,A.husk,shade(A.cornGold,-.12),A.cornGold],BASE='#2c2112';
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){
  const tx=(x/T)|0,ty=(y/T)|0,ch=at(M,tx,ty),lx=x-tx*T,ly=y-ty*T;let col;
  if(maze&&ch==='C'){
   const open=at(M,tx,ty+1)!==undefined&&at(M,tx,ty+1)!=='C';
   if(open&&ly>=7){ // the corn's front, seen in 3/4: stalks in rows, leaves, a dark foot
    const ph=(x+tx*3)%4;
    if(ly===15)col='#1e160c';
    else if(ph<2){col=((x>>2)&1)?A.cornGold:A.husk;if(ly>11)col=shade(col,-.28);if(hsh(x,y,71)<.14)col=A.stalk;if(hsh(x>>1,ly>>2,72)<.05)col=A.tassel}
    else col=hsh(x,y,73)<.2?shade(A.stalk,-.3):BASE;
   }else{ // the tops of the rows
    const n=hsh(x>>1,y>>1,21);col=C1[(n*4)|0];
    if(hsh(x>>1,y,24)<.12)col='#3a2c14';if(hsh(x,y,23)<.035)col=A.tassel;
   }
  }else{
   // ragged path edges: look up the tile a couple of pixels away
   const jx=Math.min(W-1,Math.max(0,x+((hsh(x>>1,y>>1,61)*5)|0)-2)),jy=Math.min(H-1,Math.max(0,y+((hsh(x>>1,y>>1,62)*5)|0)-2));
   const jc=at(M,(jx/T)|0,(jy/T)|0),path=maze?jc!=='C'||PATHS.has(ch):PATHS.has(jc);
   if(maze||path){col=K.dirtRoad(x,y,T);const lf=K.autumn.leafLitter(x,y,T,.011);if(lf)col=lf}
   else{col=K.grass(x,y,T);const lf=K.autumn.leafLitter(x,y,T,Math.min(.3,.03+near[ty][tx]*.05));if(lf)col=lf}
   if(maze){
    const up=at(M,tx,ty-1);if(up==='C'&&ly<3)col=shade(col,-.45+ly*.12); // the corn's shadow on the path
    const dn=at(M,tx,ty+1);if(dn==='C'&&ly>=12&&(x%3===0)&&hsh(x,ly,25)<.5)col=hsh(x,y,26)<.5?A.tassel:A.stalk; // tassels over the row's top
   }
  }
  const v=RGB(col),i=(y*W+x)*4;d[i]=v[0];d[i+1]=v[1];d[i+2]=v[2];d[i+3]=255;
 }
 g.putImageData(img,0,0);
 if(!maze){
  // trees, buildings and the fence, back to front
  const items=[];
  // trees on the map's edge stand just outside it, so their crowns frame the town without hiding the fence, the sign or the lead
  // trees inside the map stand up with the pieces and people instead (SHA.props), so the cruiser and the lead sort with them
  for(let y=0;y<M.h;y++)for(let x=0;x<M.w;x++)if(M.g[y][x]==='T'&&!standingTree(M,x,y)){const v=(x*3+y*5)%3,a=get('tree'+v,()=>autumn.tree(v));
   let fx=x*T+8,fy=y*T+15;if(y===M.h-1)fy+=40;else if(x===0)fx-=14;else if(x===M.w-1)fx+=14;
   items.push({y:fy,f:()=>g.drawImage(a.c,Math.round(fx-a.ax),Math.round(fy-a.ay))})}
  for(const b of buildingsOf(M))items.push({y:b.fb,f:()=>building(g,b,glows)});
  fencesOf(M).forEach(([x0,x1,y])=>items.push({y:y*T+12,f:()=>K.picketFence(g,x0*T,x1*T,y*T+3,T)}));
  items.sort((a,b)=>a.y-b.y).forEach(it=>it.f());
 }
 return still[key]={c,glows};
}
// a tree off the map's edge and below the shop row is a standing piece, sorted by its feet like everything else
const standingTree=(M,x,y)=>y>=2&&y<M.h-1&&x>0&&x<M.w-1;
// buildings: each run of roof (B) over a wall row (#) with its door (D) becomes one front, 3/4 view
function buildingsOf(M){const out=[],seen=new Set();
 for(let y=0;y<M.h;y++)for(let x=0;x<M.w;x++){if(M.g[y][x]!=='B'||seen.has(x+','+y))continue;
  let x1=x;while(at(M,x1+1,y)==='B')x1++;let y1=y;while(at(M,x,y1+1)==='B')y1++;const wy=y1+1;
  for(let j=y;j<=wy;j++)for(let i=x;i<=x1;i++)seen.add(i+','+j);
  let door=x;for(let i=x;i<=x1;i++)if(at(M,i,wy)==='D')door=i;
  out.push({x0:x*T,x1:(x1+1)*T,rt:y*T-.45*T,rb:y1*T+.1*T,fb:(wy+1)*T,door:door*T+8,kind:out.length===0?'diner':'church'})}
 return out}
function fencesOf(M){const out=[];for(let y=0;y<M.h;y++){let x=0;while(x<M.w){if(M.g[y][x]==='F'){let x1=x;while(at(M,x1+1,y)==='F')x1++;out.push([x,x1+1,y]);x=x1+1}else x++}}return out}
// tiny pixel letters for the diner's sign
const GLYPH={D:'110101101101110',I:'111010010010111',N:'101111111111101',E:'111100110100111',R:'110101110101101',A:'010101111101101',T:'111010010010010'};
function word(g,s,x,y,col){for(const ch of s){const gl=GLYPH[ch];if(gl)for(let i=0;i<15;i++)if(gl[i]==='1')F(g,x+i%3,y+((i/3)|0),1,1,col);x+=4}}
function building(g,b,glows){
 const{x0,x1,rt,rb,fb,door}=b,w=x1-x0;
 if(b.kind==='diner'){
  K.roof(g,x0,x1,rt,rb,'#3d3346',T,1,true);K.wall(g,x0,x1,rb,fb,'brick','#8a3c24',T);
  K.awning(g,x0+2,x1-2,rb+.15*T,T);
  for(const wx of[x0+.35*T,x0+1.45*T,x1-2.3*T,x1-1.2*T])glows.push(K.windowPane(g,wx,rb+.75*T,.85*T,.75*T,T,true));
  K.door(g,door,fb-1.05*T,fb,'#3a2418',T);
  F(g,door-11,rb-10,22,8,'#2a1c18');F(g,door-10,rb-9,20,6,'#e8dcc0');word(g,'DINER',door-9,rb-8,'#a8323e');
 }else{
  K.roof(g,x0,x1,rt,rb,'#2f3d33',T,2,false);K.wall(g,x0,x1,rb,fb,'batten','#cdbf9f',T);
  // a bell gable on the roof, over the door (the bell the case's church rings)
  const bx=door-7,by=rt+5;for(let i=0;i<8;i++)F(g,bx+7-i,by-8+i,2*i+1,1,i===7?'#140d16':'#2f3d33');
  F(g,bx-1,by,16,15,'#140d16');F(g,bx,by,14,14,'#cdbf9f');F(g,bx+3,by+3,8,10,'#2a2030');F(g,bx+5,by+5,4,5,K.pal().brass);F(g,bx+4,by+9,6,1,K.pal().brass);
  for(const wx of[x0+.45*T,x0+1.75*T,x1-2.55*T,x1-1.25*T])glows.push(K.windowPane(g,wx,rb+.45*T,.75*T,1.05*T,T,false));
  K.door(g,door,fb-1.05*T,fb,'#5a2e22',T);
 }
 F(g,x0,fb,w,2,'rgba(10,6,14,.35)');
}

// ================= STANDING PIECES =================
// One entry per piece: the engine sorts them with the people by their feet (y) and draws them.
// lights: [x, y, r, a, pool] in map pixels; pool = it lights the ground at night (lamps), else it only glows.
function props(M){
 const out=[],seen=new Set(),PK=[0,1,2];let pk=0;
 const put=(a,fx,fy,tx,ty,o={})=>{const X=Math.round(fx-a.ax),Y=Math.round(fy-a.ay);
  out.push(Object.assign({tx,ty,x:fx,y:fy,top:Y,draw:(c,ox,oy)=>c.drawImage(a.c,X+ox,Y+oy),
   lights:(a.lights||[]).map(([lx,ly,r,al])=>[X+a.sx(lx),Y+a.sy(ly),r*T,al,!!o.pool])},o.extra||{}))};
 for(let y=0;y<M.h;y++)for(let x=0;x<M.w;x++){
  const ch=M.g[y][x],cx=x*T+8,fy=y*T+14;if(seen.has(x+','+y))continue;
  if(ch==='L'||ch==='l')put(LAMP(),cx,y*T+15,x,y,{pool:true});
  else if(ch==='P'){const v=PK[pk++%3];
   if(v===0)put(get('pumpkin',()=>autumn.PUMPKIN),cx,fy,x,y);
   else if(v===2)put(get('pile',()=>autumn.PILE),cx,fy+1,x,y);
   else out.push({tx:x,ty:y,x:cx,y:fy,top:fy-10,draw:(c,ox,oy)=>autumn.jackOLantern(c,cx+ox,y*T+10+oy,T),lights:[[cx,y*T+10,1.1*T,.5,false]]});}
  else if(ch==='H'){const a=get('hay'+((x+y)%2),()=>autumn.hay((x+y)%2===0));put(a,cx,fy,x,y)}
  else if(ch==='T'&&standingTree(M,x,y)){const v=(x*3+y*5)%3,a=get('tree'+v,()=>autumn.tree(v)),X=Math.round(cx-a.ax),Y=Math.round(y*T+15-a.ay);
   // canopy: while the lead is behind it, the engine draws the tree see-through so the lead never disappears
   put(a,cx,y*T+15,x,y,{extra:{canopy:[X+6,Y,a.c.width-12,a.c.height-14]}})}
  else if(ch==='S')put(get('crow'+(x<M.w/2?'pell':'ruiz'),()=>SCARECROW(x<M.w/2?'pell':'ruiz')),cx,fy,x,y);
  else if(ch==='V'){const i=(M.vv&&M.vv[x+','+y])|0;put(get('victim'+i,()=>VICTIM[i%3]),cx,fy,x,y)}
  else if(ch==='K'){seen.add((x+1)+','+y);put(get('cruiser',()=>CRUISER),x*T+16,fy+1,x,y)}
  else if(ch==='Y'){seen.add((x+1)+','+y);put(get('cider',()=>CIDER),x*T+16,fy+1,x,y)}
  else if(ch==='p'){seen.add((x+1)+','+y);put(get('podium',()=>PODIUM),x*T+16,fy,x,y)}
  else if(ch==='N')put(get('board',()=>BOARD),cx,fy,x,y);
  else if(ch==='W')put(get('sign',()=>SIGN),cx,fy,x,y);
  else if(ch==='G'&&at(M,x,y+1)==='G'){seen.add(x+','+(y+1));put(get('gate',()=>GATE),cx,(y+1)*T+14,x,y)}
  else if(ch==='G')put(get('gate',()=>GATE),cx,fy,x,y);
  else if(ch==='I')put(get('pack',()=>PACK),cx,fy-2,x,y);
  else if(ch==='O')put(get('page',()=>PAGE),cx,fy-3,x,y);
 }
 return out;
}

// ================= TOWNSFOLK ON THE MAP =================
// The Shared Shelf's person template (shared-sprites-person-v1, method v1), at the agents' size; hair from agent-sprite.js.
// look: creator indexes (skin, hair, hair color, extra) so the agents' hair code draws them. Dot wears the town's one weird trait: huge glasses.
const {SKIN,HAIRC}=window.BL;
const FOLK={
 dot:{look:{skin:1,hair:4,hairC:6,acc:0},top:A.dinerPink,pants:'#4a3a48',shoes:'#3a2a24',bigGlasses:1,iris:'#3f8a5a',cheeks:1,mouth:'smile',
  body:(A_,ty)=>{const{R}=A_;R(9,ty+4,10,12,'#f4f1e8');R(9,ty+4,10,1,shade('#f4f1e8',-.2));R(16,ty+7,2,4,'#f2c94c');R(16,ty+6,2,1,'#3a3a3a')}},
 pell:{look:{skin:0,hair:3,hairC:5,acc:1},top:'#2d3a5c',coat:1,inner:'#ece8de',pants:'#232838',shoes:'#1d1414',mouth:'smile',
  body:(A_,ty)=>{const{R}=A_;R(13,ty,2,8,'#a8323e');R(17,ty+3,3,2,'#d9772b')}},
 pip:{look:{skin:3,hair:6,hairC:0,acc:0},top:'#e0a030',pants:'#3b5b8a',shoes:'#d8d2c2',s:.42,cheeks:1,mouth:'open'},
 ross:{look:{skin:2,hair:2,hairC:1,acc:0},top:'#5a6a4a',pants:'#4a553c',shoes:'#141014',hat:'#7a5f3a',
  body:(A_,ty)=>{const{R}=A_;R(13,ty,2,16,shade('#5a6a4a',-.3));R(16,ty+3,3,3,'#f2c94c');R(6,ty+13,16,2,'#141014')}},
 vol:{look:{skin:0,hair:3,hairC:0,acc:0},top:A.committee,inner:'#e8dcc0',pants:'#3b4a6b',shoes:'#2a1e18',sack:1,
  body:(A_,ty)=>{const{R}=A_;R(11,ty+7,6,9,'#e8dcc0');R(6,ty+8,5,2,'#e6e6e6');R(17,ty+8,5,2,'#e6e6e6');R(20,ty+9,7,8,'#a07a4a');R(21,ty+10,5,6,'#f4f4f4')}}
};
// the Volunteer's burlap sack head with its stitched smile (Bible: touched by the case, so it's wrong by daylight too)
function sack(Ad,dir,b){const{R,P}=Ad,bd=shade(BUR,-.3);
 if(dir==='up'){R(4,0+b,20,21,BUR,{sh:4});R(9,20+b,10,3,'#7a5a2a');R(12,18+b,4,2,'#5a3a1a');return}
 if(dir==='side'){R(5,0+b,19,21,BUR,{sh:3});R(5,20+b,18,3,'#7a5a2a');R(7,10+b,3,3,'#1a1418');for(let x=6;x<=12;x++)P(x,16+b-(x>10?1:0),ST);return}
 R(4,0+b,20,21,BUR,{sh:4});for(let i=0;i<7;i++)P(6+i*3,3+(i%2)*4+b,shade(BUR,.15));R(4,20+b,20,3,'#7a5a2a');
 R(8,9+b,4,4,'#1a1418');R(17,9+b,3,3,'#4a1c26');
 for(let x=7;x<=21;x++){const y=16+b+Math.round(((x-14)/7)**2*-2+2)-2;R(x,y,1,1,ST);if(x%3===0)R(x,y-1,1,3,ST)}
}
function hat(Ad,dir,b,col){const{R}=Ad; // the deputy's campaign hat
 if(dir==='side'){R(2,1+b,24,3,col,{sh:4});R(8,-4+b,13,6,col,{sh:3});R(8,0+b,13,1,'#3a2a18');return}
 R(1,2+b,26,3,col,{sh:5});R(7,-4+b,14,7,col,{sh:4});R(7,1+b,14,1,'#3a2a18');if(dir==='down')R(13,-2+b,2,2,'#e0b84a')}
// Dot's glasses, as big as her face (the template's storybook lenses, drawn after the hair so nothing covers them)
function glasses(Ad,dir,idle,ir){const{C,disc,R}=Ad,P_=K.pal(),ey=11;if(dir==='up')return;
 const lensAt=dir==='side'?[8]:[9,19];
 for(const cx of lensAt){disc(cx,ey+2.5,6.2,(d,rr)=>d<=rr-1?shade(P_.text,-.06):d<=rr?'#7a2a4a':null);
  if(idle&1)R(cx-2,ey+2,5,1,P_.panel);else{C(cx,ey+2.5,3,P_.text);C(cx+(cx<14?.8:-.8),ey+3,2,ir);C(cx+(cx<14?.8:-.8),ey+3,1,P_.outline)}}
 if(dir!=='side')R(14,ey+1,2,1,'#7a2a4a')}
const fcache=new Map();
function folk(id,dir,idle=0){
 const k=id+dir+idle;let v=fcache.get(k);if(v)return v;const F_=FOLK[id];
 if(dir==='right'){const l=folk(id,'left',idle),c=K.mk(l.c.width,l.c.height),g=c.getContext('2d');g.translate(c.width,0);g.scale(-1,1);g.drawImage(l.c,0,0);v={c,ax:c.width-l.ax,ay:l.ay}}
 else{const d=dir==='left'?'side':dir,L=F_.look,sk=SKIN[L.skin];
  const sp=Object.assign({skin:sk,hair:sk,hairStyle:'cropped',iris:F_.iris||'#3a2418'},F_);
  const a=art(40,76,6,18,F_.s||S,Ad=>{K.drawChar(Ad,sp,d,0,idle);
   if(F_.sack)sack(Ad,d,0);else{BLA.extras(Ad,{look:L},dir,0);if(F_.hat)hat(Ad,d,0,F_.hat);if(F_.bigGlasses)glasses(Ad,d,idle,sp.iris)}});
  v={c:a.c,ax:a.sx(14),ay:a.sy(50)}}
 fcache.set(k,v);return v;
}

// ================= PORTRAITS (64 x 64, Storybook faces, Lantern Bust box) =================
// Drawn pixel by pixel in a layer, then a light rim on the lit edges and a dark outline (the portrait kit from the Asset Library).
const OL='#120c1c',D='#24141e',WH='#f4efe6',MR='#5a1a22';
const sh=(h,a)=>{const n=parseInt(h.slice(1),16),f=v=>Math.max(0,Math.min(255,Math.round(v+a)));return'#'+[n>>16,n>>8&255,n&255].map(v=>f(v).toString(16).padStart(2,'0')).join('')};
function Ly(w,h){const d=new Array(w*h).fill(null);const L={w,h,d,
 g:(x,y)=>(x<0||y<0||x>=w||y>=h)?null:d[y*w+x],
 p(x,y,c){x=Math.round(x);y=Math.round(y);if(x>=0&&y>=0&&x<w&&y<h)d[y*w+x]=c},
 r(x,y,a,b,c){for(let j=0;j<b;j++)for(let i=0;i<a;i++)L.p(x+i,y+j,c)},
 rm(x,y,a,b,c){for(let j=0;j<b;j++)for(let i=0;i<a;i++)if(L.g(x+i,y+j))L.p(x+i,y+j,c)},
 e(cx,cy,rx,ry,c){for(let y=Math.floor(cy-ry);y<=cy+ry;y++)for(let x=Math.floor(cx-rx);x<=cx+rx;x++){const a=(x+.5-cx)/rx,b=(y+.5-cy)/ry;if(a*a+b*b<=1)L.p(x,y,c)}},
 tex(from,to){for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(L.g(x,y)===from&&(x*3+y*5)%7===0)L.p(x,y,to)}};return L}
function finish(L){const{w,h,d}=L,o=d.slice();for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x,v=d[i];
 if(v){if((x>0&&!L.g(x-1,y))||(y>0&&!L.g(x,y-1)))o[i]=sh(v,30)}
 else if(L.g(x-1,y)||L.g(x+1,y)||L.g(x,y-1)||L.g(x,y+1))o[i]=OL}return o}
const body=(L,c)=>{L.e(34,66,24,15,sh(c,-32));L.e(30,65,22,14,c)};
const head=(L,cx,cy,rx,ry,s)=>{L.e(cx+1,cy+1,rx,ry,sh(s,-30));L.e(cx-1,cy,rx-1,ry-1,s)};
function eye(L,x,y,ir,s,tiny){L.r(x+1,y,4,1,WH);L.r(x,y+1,6,5,WH);L.r(x+1,y+6,4,1,WH);
 if(tiny){L.r(x+2,y+2,2,3,ir);L.p(x+2,y+3,D);L.p(x+3,y+3,D)}
 else{L.r(x+1,y+1,4,5,ir);L.r(x+1,y+1,4,1,sh(ir,-45));L.r(x+2,y+2,2,3,D);L.p(x+3,y+2,'#ffffff');L.p(x+4,y+5,sh(ir,45))}
 L.r(x,y-1,6,1,D);L.p(x+(s<0?-1:6),y,D);L.p(x+(s<0?-2:7),y-1,D)}
function mouth(L,cx,y,w,o){const x=cx-(w>>1);
 if(o){L.r(x+1,y,w-2,1,MR);L.r(x,y+1,w,3,MR);L.r(x+1,y+4,w-2,1,MR);L.r(x+1,y+1,w-2,1,WH);L.r(x+2,y+3,w-4,2,'#d8607a')}
 else{L.r(x+1,y+1,w-2,1,MR);L.p(x,y,MR);L.p(x+w-1,y,MR)}}
const ring=(L,x,y,w,h,c)=>{L.r(x+1,y,w-2,1,c);L.r(x+1,y+h-1,w-2,1,c);L.r(x,y+1,1,h-2,c);L.r(x+w-1,y+1,1,h-2,c)};
const button=(L,x,y,r,c)=>{L.e(x,y,r,r,c);L.p(x-1,y-1,sh(c,40));L.p(x+1,y-1,sh(c,40));L.p(x-1,y+1,sh(c,40));L.p(x+1,y+1,sh(c,40))};
// a round lens: the frame, the glass, then the eye seen through it, bigger than life
function lens(L,cx,cy,r,frame,ir,t){L.e(cx,cy,r,r,frame);L.e(cx,cy,r-1.6,r-1.6,'#e6eef4');L.e(cx,cy,r-2.6,r-2.6,WH);
 L.e(cx+1,cy+1,4.2,4.6,ir);L.e(cx+1,cy+1.5,2.2,2.6,D);L.p(cx+2,cy-1,'#ffffff');L.p(cx,cy-1,'#ffffff');L.p(cx-r+3,cy-r+4,'#ffffff');L.p(cx-r+4,cy-r+3,'#ffffff')}

const PORT={
// Dot runs the diner: older, warm, in her pink; the town's one weird trait is hers, glasses as big as her face
DOT:{bg:'#2a2030',f(L,t){const s='#e9b98f',sd=sh(s,-32),hc='#d8d4cc',hd=sh(hc,-40),hl='#f6f2ea',u=SH_ACCENT.dinerPink;
 L.e(32,13,13,12,hd);L.e(31,12,12,11,hc);L.r(26,4,2,7,hl);L.r(31,2,2,6,hl);L.r(30,11,10,1,hd);L.r(25,15,6,1,hd);
 for(let i=0;i<8;i++){L.p(40+i,9-i,'#f2c94c');L.p(41+i,9-i,'#c98a1a')}L.p(39,10,'#3a3a3a');L.r(48,0,2,2,'#e86a92');
 body(L,u);L.r(27,44,10,8,sd);L.r(24,50,16,14,'#f4f1e8');L.r(24,50,16,1,sh('#f4f1e8',-30));L.r(27,52,3,1,u);L.r(34,52,3,1,u);
 L.r(38,56,3,5,'#f2c94c');L.p(39,55,'#3a3a3a');
 L.e(18,33,3,4,s);L.e(46,33,3,4,sd);head(L,32,32,15,15,s);
 L.e(31,20,15,5,hc);L.r(17,20,4,9,hc);L.r(43,20,4,9,hd);L.r(22,22,5,1,hd);L.r(35,23,6,1,hd);
 L.r(22,40,1,1,sd);L.r(41,40,1,1,sd);L.p(19,26,sd);L.p(44,26,sd);
 lens(L,23,32,8.5,'#7a2a4a','#3f8a5a',t);lens(L,41,32,8.5,'#7a2a4a','#3f8a5a',t);L.r(30,30,4,2,'#7a2a4a');L.r(13,30,2,2,'#7a2a4a');L.r(49,30,2,2,'#7a2a4a');
 L.r(17,41,4,2,'#e8857a');L.r(43,41,4,2,'#e8857a');L.p(32,40,sh(s,-40));
 mouth(L,32,44,8,t);L.p(27,44,sd);L.p(37,44,sd)}},
// Mayor Pell: bald, little gold glasses, navy suit, the Lantern Walk sash; cheerful and eager
'MAYOR PELL':{bg:'#2a2030',f(L,t){const s='#f6d7b8',sd=sh(s,-32),su='#2d3a5c',gl='#c9a85a';
 body(L,su);L.r(27,44,10,7,sd);L.r(28,50,8,14,WH);L.r(30,50,4,2,'#a8323e');L.r(31,52,2,9,'#a8323e');
 for(let i=0;i<13;i++)L.rm(17+i*2,52+i,4,3,i%4?'#e07b26':'#f29a4a');
 L.r(42,53,2,4,'#e0c25a');L.p(42,53,'#f6e6a0');
 L.e(17,34,3,4,s);L.e(47,34,3,4,sd);L.e(18,31,4,6,'#c0c4ca');L.e(46,31,4,6,'#8e9298');head(L,32,31,16,15,s);
 L.r(24,19,5,2,'#fffaf2');L.r(23,21,2,1,'#fffaf2');L.r(21,24,6,1,'#9aa0a6');L.r(37,24,6,1,'#9aa0a6');
 eye(L,21,28,'#5a7ab0',-1);eye(L,37,28,'#5a7ab0',1);ring(L,19,26,10,10,gl);ring(L,35,26,10,10,gl);L.r(29,30,6,1,gl);
 L.p(32,36,sh(s,-40));L.p(33,37,sh(s,-40));L.r(18,36,4,2,'#f0a0a0');L.r(42,36,4,2,'#f0a0a0');
 if(t)mouth(L,32,40,10,true);else{L.r(27,41,10,1,MR);L.p(26,40,MR);L.p(37,40,MR);L.r(28,42,8,1,sh(s,-20))}}},
// Pip: a kid who counts the scarecrows. Curly hair, mustard top
PIP:{bg:'#2a2030',f(L,t){const s='#a26a43',sd=sh(s,-32),hc='#1b1414',hl='#4a3434',c='#e0a030';
 body(L,c);L.r(28,45,8,6,sd);L.r(22,50,20,3,sh(c,-30));L.r(31,56,2,2,'#5a3e2b');L.r(31,60,2,2,'#5a3e2b');
 [[19,30],[45,30],[18,37],[46,37]].forEach(([x,y])=>L.e(x,y,4,4,hc));head(L,32,33,13,13,s);
 [[21,22],[27,19],[34,18],[40,20],[44,25],[19,26]].forEach(([x,y])=>{L.e(x,y,5,4,hc);L.p(x-1,y-2,hl);L.p(x,y-2,hl)});
 eye(L,21,30,'#6b3a1a',-1);eye(L,37,30,'#6b3a1a',1);L.r(22,27,4,1,hc);L.r(38,27,4,1,hc);
 L.p(32,36,sh(s,-42));L.p(29,36,sd);L.p(35,36,sd);L.p(30,37,sd);L.p(34,37,sd);
 L.r(20,38,4,2,'#c86a5a');L.r(40,38,4,2,'#c86a5a');
 mouth(L,32,41,6,t)}},
// Deputy Ross: tired local deputy, olive uniform and campaign hat
'DEPUTY ROSS':{bg:'#2a2030',f(L,t){const s='#c98e62',sd=sh(s,-32),u='#5a6a4a',hat='#7a5f3a',hd=sh(hat,-35),hl=sh(hat,30);
 body(L,u);L.r(27,44,10,8,sd);L.r(25,50,6,3,sh(u,-25));L.r(33,50,6,3,sh(u,-25));
 L.r(41,55,5,5,'#e0b84a');L.p(43,54,'#e0b84a');L.p(40,57,'#e0b84a');L.p(46,57,'#e0b84a');L.p(43,57,'#8a6a1a');L.p(42,55,'#fff1b0');
 L.r(12,56,4,5,'#3a4a6a');L.p(13,57,'#e0b84a');
 L.e(17,33,3,4,s);L.e(47,33,3,4,sd);head(L,32,32,15,15,s);
 L.r(17,22,4,7,'#3a2a1e');L.r(43,22,4,7,'#2a1e16');
 L.e(32,19,27,4,hd);L.e(31,18,26,3,hat);L.r(20,6,24,11,hat);L.r(20,6,4,11,hl);L.r(40,6,4,11,hd);
 L.r(22,4,8,2,hat);L.r(34,4,8,2,hat);L.r(30,6,4,2,hd);L.r(20,14,24,2,'#3a2a18');L.r(30,14,4,2,'#e0b84a');
 L.r(21,25,6,1,'#3a2a1e');L.r(37,25,6,1,'#3a2a1e');
 for(const x of[21,37]){eye(L,x,28,'#5a7a9a',x<30?-1:1);L.r(x,28,6,1,sd);L.r(x+1,35,5,1,sh(s,-22))}
 L.p(32,36,sh(s,-42));L.p(33,37,sh(s,-42));
 [[25,45],[28,46],[36,46],[39,45],[31,47],[34,47]].forEach(([x,y])=>L.p(x,y,sd));
 if(t)mouth(L,32,41,7,true);else{L.r(28,42,8,1,MR);L.p(27,43,MR)}}},
// the Volunteer: Harvest Committee. A burlap sack with a stitched smile, the orange vest, the clipboard
VOLUNTEER:{bg:'#1b1f33',f(L,t){const b=BUR,bd='#9c7a44',st='#e0c25a',th='#2a1a10';
 body(L,'#e8dcc0');L.rm(0,50,25,14,SH_ACCENT.committee);L.rm(39,50,25,14,'#e8650e');L.rm(0,57,25,2,'#e6e6e6');L.rm(39,57,25,2,'#c8c8c8');
 L.r(41,52,9,6,WH);L.r(41,52,9,2,'#c0392b');L.r(42,55,6,1,'#3a3a5a');L.p(43,56,'#3a3a5a');
 [[24,47],[23,48],[22,49],[40,47],[41,48],[42,49],[29,49],[35,50],[36,51]].forEach(([x,y])=>L.p(x,y,st));
 L.e(17,11,5,5,bd);L.e(48,9,5,6,bd);L.e(34,28,17,18,bd);L.e(32,27,16,17,b);L.e(16,10,4,4,b);
 L.tex(b,'#b8925a');L.tex(bd,'#86663a');
 L.r(23,11,1,3,bd);L.r(29,9,1,3,bd);L.r(38,9,1,4,bd);L.r(44,12,1,3,bd);
 L.r(24,44,16,2,'#7a5a2a');L.r(30,45,3,3,'#7a5a2a');L.p(30,48,'#7a5a2a');L.p(33,49,'#7a5a2a');
 button(L,25,25,4,'#1a1418');L.p(25,25,'#e8dcc0');button(L,41,23,3,'#4a1c26');
 const yy=x=>Math.round(39-((x-33)/16)**2*6);
 if(t){for(let x=27;x<=39;x++)L.r(x,yy(x)+1,1,3,'#1a0e08');L.p(30,41,st);L.p(34,42,st);L.p(36,41,st)}
 for(let x=17;x<=49;x++){L.p(x,yy(x),th);if(x%3===0){L.p(x,yy(x)-1,th);L.p(x,yy(x)+1,th)}}}}
};
// each face is drawn once per mouth frame, then reused
const pcache={};
function portraitCanvas(name,open){const k=name+(open?1:0);if(pcache[k])return pcache[k];
 const P_=PORT[name],L=Ly(64,64),c=K.mk(64,64),g=c.getContext('2d');P_.f(L,open?1:0);g.fillStyle=P_.bg;g.fillRect(0,0,64,64);
 const o=finish(L);for(let i=0;i<o.length;i++)if(o[i]){g.fillStyle=o[i];g.fillRect(i%64,(i/64)|0,1,1)}
 return pcache[k]=c}
const portraits={};
for(const name of Object.keys(PORT))portraits[name]=(ctx,open)=>{ctx.clearRect(0,0,64,64);ctx.drawImage(portraitCanvas(name,open),0,0)};

return{paint,props,folk,portraits,FOLK,PORT,portraitCanvas,pieces:{SCARECROW,VICTIM,CRUISER,CIDER,BOARD,SIGN,GATE,PODIUM,PACK,PAGE}};
})();

window.SHA=SHA;
