// Black Lantern · cases/lantern-02-art.js · LANTERN 02's art (specs 014 and 015, Nov 25, 2026). Exposes window.L02A.
// Art for this case only (Bible, Art, Direction: one case, one set of art); never reuse it in another case.
// Generic pieces come from the Shared Shelf first (engine/shelf.js, the versions in use: snow, slush, snowbank, icicles,
// snowfall, storefront, porch, sedan, van, lamp, counter, kitchen, the room floors and walls), painted with Black
// Lantern's palette. This file adds the case's own pieces (the Main Street fronts, the church and the Lindqvist house,
// the river and the falls, the rooms' fittings, the mirrors), its townsfolk on the map and in the dialog box, and Big
// Hat's briefing place. No Shared Shelf pieces are added.
//
//   L02A.paint(M)            the map's still layer -> {c, glows}; L02A.props(M) its standing pieces, sorted with people
//   L02A.folk(id, dir, idle, M)  a townsperson's map sprite -> {c, ax, ay}
//   L02A.portraits           speaker name -> (ctx, mouth) drawing the 64 x 64 talking portrait
//   L02A.fx(ctx, o)          the case's light and air after the light pass: falling snow, the lantern's warm pool at
//                            night, the mirrors' slow lag, the candles, the TV
//   L02A.icehouse            Big Hat's briefing place: {back, front} (engine.js bigHatScene)
//   L02A.mirrorGlint         how the hidden hotspot looks while it shows
//
// The case's accent colors (Bible, Art, Palette), on top of the base palette: thaw gray, river ice, the church's brick,
// Agnes's blue, mirror silver and the Lindqvist house's green trim.
const L02_ACCENT={ice:'#a8bcc8',river:'#2e3e48',riverLo:'#1c2830',brick:'#7a3a30',blue:'#3e5a9a',silver:'#b8c4cc',trim:'#3e6a4a',sky:'#8a96a4'};
window.L02A=(()=>{
const K=SHELF,T=16,S=.5,{F,shade,hsh,RGB,art}=K,A=L02_ACCENT;
const ART={};
const get=(k,spec)=>ART[k]||(ART[k]=K.prop(spec(),S));
const isNight=M=>M.light==='night';

// ================= GROUND =================
const GP={
 ',':(x,y)=>{const c=K.stoneSidewalk(x,y,T,false);return hsh(x>>2,y>>2,601)<.3?shade(c,-.1):c},
 '~':(x,y)=>K.slush(x,y,T,false),
 s:(x,y)=>K.snow(x,y,T,false),S:(x,y)=>K.snow(x,y,T,true),
 b:(x,y)=>K.boardwalk(x,y,T),
 // the river breaking up: dark water with plates of gray ice drifting in it
 W:(x,y)=>{const ice=hsh(x>>4,(y+((x>>5)*7))>>3,602)<.45,n=hsh(x>>1,y,603);if(ice){const e=hsh(x>>2,y>>2,604);return e<.08?'#d8e4ec':n<.5?A.ice:'#98acb8'}
  const band=Math.sin(x*.07+y*.5);return band>.85?'#4a5a64':n<.5?A.river:A.riverLo},
 w:(x,y)=>K.floor(x,y,T,'wood'),n:(x,y)=>K.floor(x,y,T,'lino'),c:(x,y)=>K.floor(x,y,T,'carpet')};
const at=(M,x,y)=>{const r=M.ground[y];return r?r[x]:undefined};

// ================= THE STILL LAYER =================
const still={};
function paint(M){
 const key=M.id+(isNight(M)?'n':'d')+(M.pieces.filter(p=>p.covered).length);if(still[key])return still[key];
 const W=M.w*T,H=M.h*T,c=K.mk(W,H),g=c.getContext('2d'),img=g.createImageData(W,H),d=img.data,glows=[];
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const ch=at(M,(x/T)|0,(y/T)|0),col=(GP[ch]||GP[','])(x,y),v=RGB(col),i=(y*W+x)*4;d[i]=v[0];d[i+1]=v[1];d[i+2]=v[2];d[i+3]=255}
 g.putImageData(img,0,0);
 for(let ty=0;ty<M.h;ty++)for(let tx=0;tx<M.w;tx++){const a=at(M,tx,ty),b=at(M,tx,ty+1);
  if(a===','&&b==='~'){F(g,tx*T,ty*T+T-2,T,1,'#8a8a90');F(g,tx*T,ty*T+T-1,T,1,'#1c1820')}
  if(a==='~'&&at(M,tx,ty-1)===','){F(g,tx*T,ty*T,T,1,'#1c1820')}
  if(a==='s'&&b==='W'){F(g,tx*T,ty*T+T-3,T,3,'#c8d4dc');F(g,tx*T,ty*T+T,T,2,'rgba(10,16,20,.5)')}}
 (M.lines||[]).forEach(l=>K.paintLine(g,l.x,l.y,l.w,l.h,l.dashed,l.col||'#e8e4d8'));
 M.pieces.filter(p=>PROPK.has(p.k)&&!NOSHADOW.has(p.k)).forEach(p=>{const cx=(p.x+p.w/2)*T+2,cy=(p.y+p.h)*T-2,rx=Math.max(5,p.w*T*.42);
  g.fillStyle='rgba(16,10,20,.3)';g.beginPath();g.ellipse(cx,cy,rx,Math.max(2.5,rx*.28),0,0,6.283);g.fill()});
 M.pieces.filter(p=>STILL[p.k]).sort((a,b)=>(BACK.has(a.k)?-99:a.y+a.h)-(BACK.has(b.k)?-99:b.y+b.h)).forEach(p=>STILL[p.k](g,p,M,glows));
 return still[key]={c,glows};
}
const BACK=new Set(['room','hallroom','realty','cafe','church','rectory','spruce','lindqvist','falls','bridge']);
const shadowBelow=(g,x0,x1,fb)=>{g.fillStyle='rgba(16,10,20,.34)';g.fillRect(x0+3,fb,x1-x0,3);g.fillStyle='rgba(16,10,20,.16)';g.fillRect(x0+5,fb+3,x1-x0-2,2)};
function signOn(g,rect,text,col,ink){const[x,y,w,h]=rect;const inner=K.signBlank(g,x,y,w,h,col);const tw=K.signWidth(text);
 K.signText(g,text,Math.round(inner[0]+(inner[2]-tw)/2),Math.round(inner[1]+(inner[3]-5)/2),ink)}
function win(g,M,glows,x,y,w,h,lit,curt){const gl=K.windowPane(g,x,y,w,h,T,curt);if(isNight(M)){if(lit)glows.push([gl[0],gl[1],T*1.3,.42]);else F(g,x+1,y+1,w-2,h-2,'#1a1c26')}}
// snow lying on a roof edge, with icicles under it
function snowEdge(g,x0,x1,y,seed){K.icicles(g,x0-2,x1+2,y+1,T,{seed,long:true});for(let x=x0-2;x<x1+2;x++)F(g,x,y-3+((hsh(x>>2,seed,605)*3)|0),1,4,'#e8eef4')}
const FB=7*T;
const STILL={
 // Sundby Realty & Notary: a narrow brick front, a sign, a picture window full of listings
 realty(g,p,M,glows){const x0=p.x*T,x1=(p.x+p.w)*T;
  F(g,x0-2,4,x1-x0+4,8,'#4a4250');snowEdge(g,x0,x1,8,1);
  const s=K.storefront(g,x0,x1,12,FB,T,{col:'#6a4a3a',trim:'#d8d0b8',door:4*T+8,upper:true});
  signOn(g,[x0+8,s.sign[1]+1,x1-x0-16,10],'SUNDBY REALTY','#2e4a3a','#e8e4d8');
  if(!isNight(M))s.glows.forEach(gl=>glows.push(gl));for(let i=0;i<4;i++)F(g,x0+10+i*8,FB-30,6,8,'#e8e4d8');shadowBelow(g,x0,x1,FB)},
 // Bev's Falls Cafe: white siding, a striped awning gone gray with slush, steamed windows
 cafe(g,p,M,glows){const x0=p.x*T,x1=(p.x+p.w)*T;
  K.roof(g,x0,x1,0,26,'#3a3440',T,5,false);snowEdge(g,x0,x1,26,2);K.wall(g,x0,x1,26,FB,'siding','#d8d4c8',T);
  win(g,M,glows,x0+10,58,30,20,true,false);win(g,M,glows,x1-40,58,30,20,true,false);
  for(let x=x0+6;x<x1-6;x+=8){F(g,x,48,4,8,'#a8323e');F(g,x+4,48,4,8,'#e8e4d8')}F(g,x0+6,56,x1-x0-12,1,'#2a2030');
  K.door(g,12*T+8,FB-.95*T,FB,'#5a2e24',T);signOn(g,[x0+22,32,x1-x0-44,11],'BEVS CAFE','#2a2030','#f0c040');
  for(let i=0;i<5;i++)F(g,x0+14+i*6,64+(i%2)*3,3,2,'rgba(255,255,255,.35)');shadowBelow(g,x0,x1,FB)},
 // St. Bridget's: red brick, a pointed door, two tall windows, and the bell tower with snow on one side
 church(g,p,M,glows){const x0=p.x*T,x1=(p.x+p.w)*T,N=isNight(M),mid=(x0+x1)/2;
  F(g,x0,30,x1-x0,FB-30,A.brick);for(let y=32;y<FB;y+=4)for(let x=x0+((y>>2)%2)*4;x<x1;x+=8)F(g,x,y,7,3,shade(A.brick,(hsh(x,y,606)-.5)*.2));
  for(let k=0;k<24;k++)F(g,x0+k*3,30-k*1.1,x1-x0-k*6,2,'#3a2a30');
  F(g,mid-12,0,24,32,shade(A.brick,-.1));F(g,mid-14,0,28,3,'#3a2a30');F(g,mid-5,8,10,14,'#1a1418');F(g,mid-4,10,8,10,N?'#3a3020':'#6a5a40');F(g,mid-1,10,2,10,'#c8a040');
  F(g,mid+6,0,6,32,'#e8eef4');F(g,mid-1,-2,2,6,'#c8c0a8');
  for(const wx of[x0+14,x1-24]){F(g,wx,46,10,30,'#2a2030');F(g,wx+1,47,8,28,N?'#4a2a5a':'#5a4a8a');F(g,wx+1,47,8,4,N?'#8a4a3a':'#c8a040');F(g,wx+4,47,1,28,'#2a2030');if(N)glows.push([wx+5,60,T*1.2,.3])}
  F(g,21*T-2,FB-34,20,34,'#3a2418');F(g,21*T,FB-32,16,32,'#5a3424');F(g,21*T+7,FB-32,2,32,'#3a2418');for(let k=0;k<5;k++)F(g,21*T+k,FB-36+k,16-k*2,1,'#3a2418');
  snowEdge(g,x0,x1,30,3);shadowBelow(g,x0,x1,FB)},
 // the rectory: a small brick house next door, a lit kitchen window, a bird feeder
 rectory(g,p,M,glows){const x0=p.x*T,x1=(p.x+p.w)*T;
  K.roof(g,x0,x1,10,40,'#3a2a30',T,4,true);snowEdge(g,x0,x1,40,4);K.wall(g,x0,x1,40,FB,'brick',A.brick,T);
  win(g,M,glows,x0+8,52,16,14,true,true);win(g,M,glows,x1-24,52,16,14,false,true);
  K.door(g,28*T+8,FB-.95*T,FB,'#3a4a5a',T);F(g,x1-10,FB-34,2,20,'#4a3a2a');F(g,x1-16,FB-36,14,4,'#6a4a32');shadowBelow(g,x0,x1,FB)},
 // a stand of black spruce between the rectory and the house, snow in their arms
 spruce(g,p,M){const x0=p.x*T;for(const [cx,top]of[[x0+8,4],[x0+24,14]]){for(let k=0;k<7;k++){const w=6+k*3,y=top+k*12;F(g,cx-w,y,w*2,10,'#1e3a2e');F(g,cx-w,y+8,w*2,2,'#e8eef4');F(g,cx-w+2,y,4,2,'#2e4a3e')}F(g,cx-2,top+84,4,FB-top-84,'#3a281e')}},
 // 9 Orchard Row: a white house with green trim, every curtain drawn, a porch with long icicles, a picket fence
 lindqvist(g,p,M,glows){const x0=p.x*T,x1=(p.x+p.w)*T,N=isNight(M);
  K.roof(g,x0,x1,0,38,'#3a3440',T,6,true);snowEdge(g,x0,x1,38,5);K.wall(g,x0,x1,38,FB,'siding','#e8e4dc',T);
  for(const [wx,wy]of[[x0+12,46],[x1-30,46],[x1-30,74],[x0+12,74]]){F(g,wx-2,wy-2,22,20,A.trim);win(g,M,glows,wx,wy,18,16,N&&wy===46&&wx>x0+20,true)}
  K.door(g,36*T+8,FB-.95*T,FB,A.trim,T);K.porch(g,x0+2*T,x0+5*T,FB,T,{stepX:36*T+8});K.icicles(g,x0+2*T,x0+5*T,FB-.5*T-1,T,{seed:9,long:true});
  F(g,x0+50,FB-24,10,6,'#c8a040');K.signText(g,'9',x0+53,FB-23,'#2a2030');
  if(N)glows.push([36*T+8,FB-20,T*1.6,.45]);shadowBelow(g,x0,x1,FB)},
 // the footbridge out over the ice: planks on posts, a rail both sides
 bridge(g,p,M){const x0=p.x*T,x1=(p.x+p.w)*T,y0=p.y*T,y1=(p.y+p.h)*T;
  for(let y=y0;y<y1;y+=T){F(g,x0-3,y,3,T,'#4a3424');F(g,x1,y,3,T,'#4a3424');F(g,x0-3,y+2,3,2,'#e8eef4');F(g,x1,y+2,3,2,'#e8eef4')}F(g,x0-4,y1-4,x1-x0+8,4,'#3a281e')},
 // the falls: a low wide drop across the river, white water under a skin of ice
 falls(g,p,M){const y=p.y*T,W=M.w*T;F(g,0,y,W,4,'#e8eef4');for(let x=0;x<W;x+=3){F(g,x,y+4,2,6+((hsh(x,1,607)*8)|0),hsh(x,2,607)<.5?'#c8d8e4':'#a8bcc8')}F(g,0,y+14,W,2,'rgba(230,240,250,.4)')},
 // interiors: the back wall, the side walls and the bottom wall with its door gaps, then each room's fittings
 room(g,p,M,glows){const W=M.w*T,H=M.h*T,kind={house:['plain','#c8b8a0'],upstairs:['plain','#b8a8b8'],cafe:['panel','#8a6a4a'],church:['plain','#d8d0c0']}[M.id]||['plain','#b8a888'];
  K.innerWall(g,T,W-T,0,3*T,kind[0],kind[1],T);
  F(g,0,0,T,H,'#1e1826');F(g,T-2,0,2,H-T,'#3a3046');F(g,W-T,0,T,H,'#1e1826');F(g,W-T,0,2,H-T,'#2a2236');
  F(g,0,H-T,W,T,'#1e1826');F(g,T,H-T,W-2*T,2,'#3a3046');
  Object.keys(M.warps).map(k=>k.split(',').map(Number)).filter(([x,y])=>y===M.h-1).forEach(([x])=>{F(g,x*T+1,H-T,T-2,T,'#6a4a3a');F(g,x*T+3,H-T+3,T-6,T-6,'#8a5a3a');for(let i=0;i<4;i++)F(g,x*T+4,H-T+5+i*2,T-8,1,'#5a3a2a')});
  F(g,T,3*T,W-2*T,3,'rgba(16,10,20,.25)');
  (DECOR[M.id]||(()=>{}))(g,M,glows)},
 // the upstairs hall that goes on too long: dark wallpaper down both sides, a runner, a ceiling light every few steps
 hallroom(g,p,M,glows){const W=M.w*T,H=M.h*T;F(g,0,0,W,H,'#14101a');
  for(let y=0;y<H;y+=6)for(const x0 of[0,(M.w-2)*T]){F(g,x0,y,2*T,6,y%12?'#3a2a3a':'#2e2230');for(let x=x0+3;x<x0+2*T;x+=8)F(g,x,y+2,2,2,'#5a3a4a')}
  F(g,2*T,0,W-4*T,3*T,'#2e2230');F(g,2*T-2,0,2,H,'#0a080e');F(g,W-2*T,0,2,H,'#0a080e');
  for(let y=4*T;y<H-T;y+=4*T){F(g,W/2-3,y-2,6,3,'#c8b890');glows.push([W/2,y,T*1.4,.25])}
  F(g,0,H-T,W,T,'#0a080e');F(g,5*T+1,H-T,T-2,T,'#6a4a3a')},
};
// each room's wall fittings
const DECOR={
 house(g,M,glows){F(g,10*T,.5*T,.8*T,1.1*T,'#8a6a4a');F(g,10*T+2,.5*T+2,.8*T-4,1.1*T-4,'#c8c0a8');F(g,10*T+4,.5*T+6,5,6,'#5a6a8a');  // Arne, in a frame
  for(let i=0;i<3;i++)F(g,(13+i*.4)*T,1.6*T,4,4,['#c8a040','#a8323e','#3e6a4a'][i])},
 upstairs(g,M,glows){F(g,1.2*T,.6*T,.8*T,1*T,'#c8a040');F(g,1.2*T+2,.6*T+2,.8*T-4,1*T-4,'#e8dcc4');K.signText(g,'AML',1.2*T+2,.6*T+6,'#3e5a9a')},  // a sampler: AML
 cafe(g,M,glows){F(g,7*T,.5*T,3*T,1.2*T,'#2a2030');F(g,7*T+2,.5*T+2,3*T-4,1.2*T-4,'#e8e4d8');K.signText(g,'PIE 4',7*T+6,.5*T+5,'#a8323e');K.signText(g,'COFFEE 1',7*T+6,.5*T+12,'#2a2030')},
 church(g,M,glows){for(let i=0;i<5;i++)F(g,(14+i*.8)*T,1*T,3,8,'#6a4a32');F(g,13.5*T,.5*T,4*T,2,'#5a3a2a')}  // the rectory's coat hooks
};

// ================= STANDING PIECES =================
const SPEC={
 shelter:()=>({size:[96,70,0,0],anchor:[48,68],lights:[[48,8,1.4,.3]],draw({R}){R(0,0,96,6,'#3a4a5a',{sh:10});R(0,0,96,2,'#e8eef4');R(2,6,3,62,'#5a6a7a');R(91,6,3,62,'#5a6a7a');R(6,8,84,40,'rgba(184,200,216,.3)');
  R(10,48,76,5,'#6a4a32');R(10,48,76,1,'#8a6a4a');R(14,53,3,14,'#3a3a44');R(78,53,3,14,'#3a3a44');R(60,14,20,24,'#e8e4d8');R(62,16,16,4,'#2e4a7a');K.signText&&0;for(let y=22;y<36;y+=3)R(62,y,14,1,'#8a8a94');R(20,40,22,1,'#2a2030')}}),
 // the house
 gclock:()=>({size:[18,52,0,0],anchor:[9,50],lights:[],draw({R,C}){R(2,0,14,50,'#5a3424',{sh:4});R(2,0,14,2,'#7a4a34');C(9,9,6,'#e8e0c8');R(9,5,1,5,'#2a2030');R(9,9,3,1,'#2a2030');R(5,20,8,22,'#3a2418');R(8,22,2,14,'#c8a040');C(9,37,3,'#c8a040')}}),
 readdesk:()=>({size:[40,38,0,0],anchor:[20,36],lights:[[30,4,1.4,.45]],draw({R,E}){R(1,12,38,6,'#6a4430',{sh:8});R(1,12,38,1,'#8a5a3e');R(3,18,4,18,'#4a2e1e');R(33,18,4,18,'#4a2e1e');R(10,18,20,8,'#5a3424');
  R(8,6,14,6,'#3e5a9a');R(8,6,14,1,'#6a8aca');R(14,6,1,6,'#2a3a6a');R(28,0,2,12,'#2a4a3a');E(29,2,6,3,'#2e6a4a');R(26,2,6,2,'#3e8a5a')}}),
 readchair:()=>({size:[22,30,0,0],anchor:[11,28],lights:[],draw({R}){R(3,4,16,16,'#6a3a4a',{sh:4});R(3,4,16,2,'#8a5a6a');R(2,16,18,6,'#5a2a3a');R(3,22,2,6,'#3a2418');R(17,22,2,6,'#3a2418')}}),
 sheetsofa:()=>({size:[96,40,0,0],anchor:[48,38],lights:[],draw({R,E}){const c='#d8d4cc';E(48,16,46,14,shade(c,-.15));R(2,10,92,26,c,{sh:10});E(24,8,10,8,c);E(70,8,10,8,c);R(2,30,92,6,shade(c,-.2));for(let x=8;x<92;x+=14)R(x,14,1,20,shade(c,-.1))}}),
 sheetchair:()=>({size:[30,40,0,0],anchor:[15,38],lights:[],draw({R,E}){const c='#d8d4cc';E(15,8,9,8,c);R(3,10,24,26,c,{sh:6});R(3,30,24,6,shade(c,-.2));R(9,14,1,18,shade(c,-.1))}}),
 sheetpile:()=>({size:[96,20,0,0],anchor:[48,18],lights:[],draw({E}){const c='#d8d4cc';E(30,12,22,6,shade(c,-.1));E(28,10,18,5,c);E(70,13,20,5,shade(c,-.15));E(68,11,16,4,c)}}),
 ktable:()=>({size:[40,34,0,0],anchor:[20,32],lights:[],draw({R}){R(1,8,38,6,'#e8e4d8',{sh:8});for(let x=1;x<39;x+=4)R(x,8,2,6,'#a8323e');R(3,14,3,18,'#8a8a94');R(34,14,3,18,'#8a8a94');R(30,-4,8,12,'#6a4430');R(16,4,6,4,'#c8a040')}}),
 stove:()=>({size:[24,40,0,0],anchor:[12,38],lights:[],draw({R,E}){R(1,10,22,28,'#e8e4dc',{sh:6});R(1,10,22,2,'#f8f4ec');E(7,13,4,2,'#3a3a44');E(17,13,4,2,'#3a3a44');R(4,20,16,12,'#c8c4bc');R(10,2,8,8,'#3a3a44');R(17,4,3,2,'#3a3a44')}}),
 fridge:()=>({size:[22,48,0,0],anchor:[11,46],lights:[],draw({R}){R(1,2,20,44,'#e8e4dc',{sh:6});R(1,2,20,2,'#f8f4ec');R(1,18,20,1,'#a8a49c');R(17,8,2,6,'#8a8a94');R(17,24,2,10,'#8a8a94');R(5,24,6,4,'#c8402e')}}),
 lamp_in:()=>({size:[22,54,0,0],anchor:[11,52],lights:[[11,10,2.4,.5]],draw({R,E}){R(4,46,14,6,'#3a3a44');R(10,18,2,28,'#5a5a64');E(11,12,9,8,'#d8b878');E(11,10,7,5,'#f0d8a0');R(3,18,16,2,'#a88850')}}),
 // upstairs
 vanity:()=>({size:[40,38,0,0],anchor:[20,36],lights:[],draw({R}){R(1,12,38,6,'#e8dcc4',{sh:8});R(1,12,38,1,'#f8f0e0');R(3,18,4,18,'#c8b8a0');R(33,18,4,18,'#c8b8a0');R(12,20,16,6,'#d8c8b0');R(18,22,4,1,'#c8a040');
  R(8,6,6,6,'#e8e4dc');R(9,4,4,2,'#b8b0a8');R(24,8,8,4,'#c8a040');R(26,6,4,2,'#f0c040')}}),
 bed:()=>({size:[40,44,0,0],anchor:[20,42],lights:[],draw({R}){R(1,0,38,10,'#6a4430',{sh:6});R(1,0,38,2,'#8a5a3e');R(2,10,36,28,'#e8e4d8',{sh:6});R(4,10,10,6,'#f8f4ec');R(15,10,10,6,'#f8f4ec');R(26,10,10,6,'#f8f4ec');
  const cs=['#c8402e','#e8c84a','#3e8a8a','#a86aa8','#3e5a9a'];for(let i=0;i<7;i++)for(let j=0;j<4;j++)R(3+i*5,18+j*5,5,5,cs[(i+j)%5]);R(2,38,3,4,'#4a2e1e');R(35,38,3,4,'#4a2e1e')}}),
 sink:()=>({size:[22,34,0,0],anchor:[11,32],lights:[],draw({R,E}){R(2,6,18,8,'#e8e4dc',{sh:5});E(11,8,6,2,'#a8b4bc');R(9,14,4,18,'#e8e4dc');R(10,2,2,5,'#c0c0c8');R(7,2,8,2,'#c0c0c8')}}),
 trunk:()=>({size:[40,28,0,0],anchor:[20,26],lights:[],draw({R}){R(1,6,38,20,'#8a5a3a',{sh:6});R(1,6,38,2,'#aa7a5a');R(1,14,38,2,'#5a3a24');R(18,12,4,5,'#c8a040');for(const x of[6,32])R(x,6,2,20,'#5a3a24')}}),
 // the cafe
 counter:()=>K.counter(3),
 booth:()=>({size:[72,34,0,0],anchor:[36,32],lights:[],draw({R}){R(0,0,72,12,'#a8323e',{sh:10});R(0,0,72,2,'#c8524e');R(4,14,64,6,'#e8e4d8');R(4,14,64,1,'#ffffff');R(34,20,4,12,'#8a8a94');R(14,10,8,4,'#c8a040');R(48,10,6,4,'#5a3a1a')}}),
 stool:()=>({size:[16,30,0,0],anchor:[8,28],lights:[],draw({R,E}){E(8,4,7,3,'#a8323e');E(8,3,5,2,'#c8524e');R(7,6,2,18,'#c0c0c8');R(3,24,10,2,'#8a8a94')}}),
 coatrack:()=>({size:[24,66,0,0],anchor:[12,64],lights:[],draw({R}){R(11,6,2,56,'#3a281e');R(5,60,14,3,'#3a281e');R(4,10,16,24,'#2a4a8a',{sh:4});R(6,6,12,6,'#3a5a9a');R(2,22,8,20,'#1a1a20',{sh:3});R(14,20,8,22,'#c8402e',{sh:3})}}),
 // the church
 pew:()=>({size:[48,30,0,0],anchor:[24,28],lights:[],draw({R}){R(0,0,48,14,'#6a4430',{sh:10});R(0,0,48,2,'#8a5a3e');R(0,14,48,6,'#5a3424');R(1,20,3,8,'#3a2418');R(44,20,3,8,'#3a2418');R(10,4,8,4,'#3a2a5a')}}),
 candles:()=>({size:[36,34,0,0],anchor:[18,32],lights:[[18,6,1.8,.5]],draw({R}){R(0,10,36,6,'#3a2a20',{sh:6});R(0,16,36,4,'#2a1a14');R(4,20,2,12,'#2a1a14');R(30,20,2,12,'#2a1a14');
  for(let i=0;i<4;i++)for(let j=0;j<2;j++){R(3+i*8,4+j*4,5,5,'#a8323e');R(5+i*8,1+j*4,1,3,(i+j)%2?'#ffe8a0':'#3a2a20')}R(14,24,8,6,'#8a8a94')}}),
 partition:()=>({size:[16,100,0,0],anchor:[8,96],lights:[],draw({R}){R(2,0,12,96,'#c8c0b0',{sh:4});R(2,0,12,2,'#e8e0d0');R(2,30,12,32,'#3a2418');R(4,32,8,28,'#14101a')}}),
 rdesk:()=>({size:[40,38,0,0],anchor:[20,36],lights:[[30,6,1.2,.4]],draw({R}){R(1,12,38,6,'#5a3424',{sh:8});R(3,18,4,18,'#3a2418');R(33,18,4,18,'#3a2418');for(let i=0;i<5;i++)R(6+i*2,8-i,12,4,i%2?'#e8e4d8':'#f0c040');R(28,4,2,8,'#3a3a44');R(26,2,6,3,'#c8a040')}}),
 // the hall
 sidetable:()=>({size:[22,34,0,0],anchor:[11,32],lights:[],draw({R,E}){R(1,10,20,4,'#5a3424',{sh:5});R(3,14,2,18,'#3a2418');R(17,14,2,18,'#3a2418');E(11,10,9,2,'#e8e4dc');E(11,8,5,2,'#c8a040')}}),
};
const PROPK=new Set(['lamp','car','van','snowbank','shelter','gclock','readdesk','readchair','sheetsofa','sheetchair','sheetpile','ktable','stove','fridge','lamp_in','vanity','bed','sink','trunk','counter','booth','stool','coatrack','pew','candles','partition','rdesk','sidetable',
 'window','hallmirror','stairs','wallphone','kwindow','spicerack','runner','uwindow','bathdoor','rug','piecase','coffee','tv','altar','cabinet','glass','rbath','bigmirror','wallmirror']);
const NOSHADOW=new Set(['window','hallmirror','stairs','wallphone','kwindow','spicerack','runner','uwindow','bathdoor','rug','piecase','coffee','tv','altar','cabinet','glass','rbath','bigmirror','wallmirror','stool','gclock','partition']);
// a mirror drawn on a wall: silver glass, a frame, the room a shade darker in it; covered, a sheet over it
function mirrorAt(c,x,y,w,h,frame,covered,night,now){F(c,x-2,y-2,w+4,h+4,frame);F(c,x,y,w,h,night?'#3a4450':A.silver);F(c,x,y+h*.55,w,h*.45,night?'#2a323c':'#98a4ac');F(c,x+2,y+2,Math.max(1,w*.2),h-4,'rgba(255,255,255,.35)');
 const k=(now%5200)/5200;if(k<.2)F(c,Math.round(x+w*.3+Math.sin(k*30)),Math.round(y+h*.3),Math.max(2,w*.3),Math.round(h*.5),'rgba(30,24,40,.35)');  // the lag: something moves a beat late
 if(covered){F(c,x-3,y-3,w+6,h+8,'#d8d4cc');F(c,x-3,y+h+3,w+6,2,'#a8a49c');for(let i=2;i<w;i+=5)F(c,x+i,y,1,h+4,'#c0bcb4')}}
function props(M){
 const out=[],now0=0;
 const add=(a,fx,fy,p,o={})=>{const X=Math.round(fx-a.ax),Y=Math.round(fy-a.ay);
  out.push(Object.assign({tx:p.x,ty:p.y,x:fx,y:fy,top:Y,draw:(c,ox,oy)=>c.drawImage(a.c,X+ox,Y+oy),
   lights:(a.lights||[]).map(([lx,ly,r,al])=>[X+a.sx(lx),Y+a.sy(ly),r*T,al,!!o.pool])},o.extra||{}))};
 const dyn=(p,fx,fy,top,draw,o={})=>out.push(Object.assign({tx:p.x,ty:p.y,x:fx,y:fy,top,draw,lights:o.lights||[]},o.extra||{}));
 const N=isNight(M);
 for(const p of M.pieces){if(!PROPK.has(p.k))continue;const cx=(p.x+p.w/2)*T,fy=(p.y+p.h)*T-2;
  switch(p.k){
  case'lamp':add(get('lamp',()=>K.LAMP),cx,fy+1,p,{pool:true});out[out.length-1].lights.push([cx,fy-2,1.8*T,.4,true]);break;
  case'car':add(get('car'+p.tint,()=>K.sedan('side',p.tint||'cloth')),cx,fy,p);break;
  case'van':add(get('van',()=>K.van('side','#e8e4dc')),cx,fy+2,p);break;
  case'snowbank':add(get('bank'+p.len,()=>K.snowbank(p.len||1)),cx,fy+2,p);break;
  case'counter':add(get('counter',SPEC.counter),cx,fy+4,p);break;
  case'stool':add(get('stool',SPEC.stool),cx,fy+4,p);break;
  case'lamp_in':add(get('lampin',SPEC.lamp_in),cx,fy,p,{pool:true});break;
  case'vanity':add(get('vanity',SPEC.vanity),cx,fy,p);dyn(p,cx,0,0,(c,ox,oy)=>mirrorAt(c,p.x*T+9+ox,.9*T+oy,14,1.7*T,'#c8a040',p.covered,N,performance.now()+2600));break;
  case'candles':add(get('candles',SPEC.candles),cx,fy,p,{extra:{candles:1}});break;
  case'partition':add(get('partition',SPEC.partition),cx,fy,p);break;
  case'sidetable':{add(get('sidetable',SPEC.sidetable),cx,fy,p);if(p.compact)dyn(p,cx,fy+1,fy-14,(c,ox,oy)=>{F(c,cx-3+ox,fy-14+oy,6,4,'#c8a040');F(c,cx-2+ox,fy-17+oy,4,3,'#e8eef4')});break}
  case'tv':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+1+ox,y=.4*T+oy;F(c,x,y,14,12,'#2a2a30');F(c,x+1,y+1,12,9,'#4a7a4a');F(c,x+1,y+6,12,1,'#e8e4d8');F(c,x+3+(Math.floor(performance.now()/500)%6),y+4,2,2,'#e8e4d8')},{lights:[[cx,.9*T,1.1*T,.25,false]],extra:{tv:1}});break;
  // wall pieces, drawn flat on the back wall (no shadow, behind everyone)
  case'window':case'uwindow':case'kwindow':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+3+ox,y=.4*T+oy,W_=p.w*T-6,H_=1.9*T;F(c,x-2,y-2,W_+4,H_+4,'#5a3a2a');F(c,x,y,W_,H_,N?'#141a26':'#a8b8c8');F(c,x,y+H_*.6,W_,H_*.4,N?'#1a2430':'#e8eef4');
   F(c,x+W_/2-1,y,2,H_,'#5a3a2a');if(p.k!=='kwindow'){F(c,x-3,y-3,5,H_+6,'#8a3a3a');F(c,x+W_-2,y-3,5,H_+6,'#8a3a3a')}else F(c,x,y,W_,3,'#e8e4d8')},{lights:[[cx,1.2*T,1.6*T,N?.1:.3,false]]});break;
  case'hallmirror':dyn(p,cx,0,0,(c,ox,oy,now)=>mirrorAt(c,p.x*T+2+ox,.3*T+oy,12,2.2*T,'#c8a040',p.covered,N,performance.now()));break;
  case'bigmirror':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+4+ox,y=.1*T+oy,t=performance.now();mirrorAt(c,x,y,p.w*T-8,2.7*T,'#c8a040',false,true,t);
   // Agnes in her good blue dress, waiting in the glass with her hands folded
   const ax=x+(p.w*T-8)/2,ay=y+12,b=Math.round(Math.sin(t/900));F(c,ax-4,ay+b,8,8,'#f0d0b0');F(c,ax-5,ay-2+b,10,4,'#e8e4dc');F(c,ax-6,ay+8+b,12,18,A.blue);F(c,ax-3,ay+16+b,6,3,'#f0d0b0');F(c,ax-2,ay+3+b,1,1,'#14101a');F(c,ax+1,ay+3+b,1,1,'#14101a')},{lights:[[cx,1.4*T,2.4*T,.3,false]]});break;
  case'wallmirror':dyn(p,cx,p.y*T+T,p.y*T-8,(c,ox,oy)=>{const sh=[[10,14],[8,10],[12,16],[6,8],[10,12],[14,10]][p.i%6],x=(p.side==='l'?p.x*T+T-sh[0]-1:p.x*T+1)+ox,y=p.y*T-sh[1]/2+oy;
   mirrorAt(c,x,y,sh[0],sh[1]+4,['#c8a040','#3a3a44','#8a5a3a'][p.i%3],false,true,performance.now()+p.i*900)});break;
  case'stairs':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+ox,y=oy;F(c,x,y,p.w*T,3*T,'#3a2418');for(let k=0;k<7;k++){F(c,x+2,y+3*T-6-k*6,p.w*T-4,4,'#6a4430');F(c,x+2,y+3*T-6-k*6,p.w*T-4,1,'#8a5a3e')}F(c,x,y,2,3*T,'#8a5a3e');F(c,x+p.w*T-2,y,2,3*T,'#5a3424')});break;
  case'wallphone':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+4+ox,y=.9*T+oy;F(c,x,y,8,12,'#d8ccb0');F(c,x+1,y+1,6,3,'#c8bca0');F(c,x+2,y+5,4,4,'#a89c80');F(c,x+3,y+12,1,10,'#8a7c60');F(c,x+6,y-4,10,8,'#e8e4d8');K.signText(c,'BEV',x+7,y-3,'#2a2030')});break;
  case'spicerack':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+1+ox,y=.7*T+oy;F(c,x,y,14,20,'#6a4430');for(let j=0;j<3;j++){F(c,x,y+6+j*6,14,1,'#3a2418');for(let i=0;i<4;i++)F(c,x+1+i*3,y+2+j*6,2,4,['#a8323e','#c8a040','#3e6a4a','#e8e4d8'][(i+j)%4])}F(c,x+10,y+14,4,5,'#8a9aa8')});break;
  case'gclock':add(get('gclock',SPEC.gclock),cx,3*T-1,p);break;
  case'bathdoor':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+ox,y=oy;F(c,x+2,y+.3*T,14,2.7*T,'#e8e4dc');F(c,x+4,y+.6*T,10,2.3*T,'#c8c4bc');mirrorAt(c,x+1.2*T,.6*T+oy,12,14,'#c0c0c8',p.covered,N,performance.now()+400);F(c,x+2.4*T,y+.3*T,12,2.7*T,'#7a8a94')});break;
  case'piecase':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+3+ox,y=.6*T+oy;F(c,x,y,p.w*T-6,1.8*T,'#5a3a2a');F(c,x+2,y+2,p.w*T-10,1.8*T-4,'rgba(220,235,245,.5)');for(let j=0;j<2;j++)for(let i=0;i<3;i++){const px=x+5+i*13,py=y+6+j*12;F(c,px,py,10,4,['#e8c070','#5a3a8a','#c8a050'][i]);F(c,px,py,10,1,'#f0d890')}});break;
  case'coffee':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+4+ox,y=1.2*T+oy;F(c,x,y,20,14,'#3a3a44');F(c,x+2,y+2,7,8,'#2a2030');F(c,x+11,y+2,7,8,'#2a2030');F(c,x+3,y+6,5,4,'#5a3a1a');F(c,x+12,y+8,5,2,'#5a3a1a')});break;
  case'altar':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+ox,y=oy;F(c,x+4,y+1.6*T,p.w*T-8,1.4*T,'#e8e4dc');F(c,x+4,y+1.6*T,p.w*T-8,2,'#c8a040');F(c,x+p.w*T/2-1,y+.2*T,2,1.2*T,'#c8a040');F(c,x+p.w*T/2-6,y+.5*T,12,2,'#c8a040');F(c,x+8,y+1.2*T,2,6,'#c8a040');F(c,x+p.w*T-10,y+1.2*T,2,6,'#c8a040')},{lights:[[cx,1.4*T,1.6*T,.3,false]]});break;
  case'cabinet':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+2+ox,y=.1*T+oy;F(c,x,y,p.w*T-4,2.8*T,'#4a2e1e');for(let j=0;j<3;j++){F(c,x+2,y+4+j*14,p.w*T-8,1,'#2a1a10');for(let i=0;i<6;i++)F(c,x+3+i*4,y+5+j*14,3,9,['#2e4a3a','#3a2a5a','#5a2a2a','#2a3a4a'][(i+j)%4])}});break;
  case'glass':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+10+ox,y=.2*T+oy,w=p.w*T-20;F(c,x-2,y-2,w+4,2.4*T+4,'#2a2030');const cs=N?['#3a2a5a','#5a2a2a','#2a4a3a']:['#6a5aaa','#c8402e','#3e8a5a','#e8c84a'];
   for(let j=0;j<6;j++)for(let i=0;i<3;i++)F(c,x+i*(w/3),y+j*6,w/3-1,5,cs[(i*2+j)%cs.length]);F(c,x+w/2-1,y,2,2.4*T,'#2a2030')},{lights:[[cx,1.2*T,1.8*T,N?.15:.35,false]]});break;
  case'rbath':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+ox,y=oy;F(c,x+2,y+.2*T,p.w*T-4,2.8*T,'#c8d4d8');for(let k=x+2;k<x+p.w*T-2;k+=6)F(c,k,y+.2*T,1,2.8*T,'#a8b4b8');mirrorAt(c,x+p.w*T/2-6,.6*T+oy,12,16,'#c0c0c8',false,N,performance.now()+1300)});break;
  // flat pieces on the floor (under everyone)
  case'runner':dyn(p,cx,-1,0,(c,ox,oy)=>{const x=p.x*T+4+ox,y=p.y*T+oy;F(c,x,y,p.w*T-8,p.h*T,'#6a2a3a');F(c,x+2,y,p.w*T-12,p.h*T,'#8a3a4a');for(let yy=y+6;yy<y+p.h*T;yy+=12)F(c,x+4,yy,p.w*T-16,2,'#c8a040')});break;
  case'rug':dyn(p,cx,-1,0,(c,ox,oy)=>{const x=p.x*T+ox,y=p.y*T+3+oy;F(c,x,y,p.w*T,10,'#3e5a9a');F(c,x+2,y+2,p.w*T-4,6,'#c8a060');F(c,x+4,y+4,p.w*T-8,2,'#3e5a9a')});break;
  default:if(SPEC[p.k])add(get(p.k,SPEC[p.k]),cx,fy,p);
  }}
 return out}

// ================= LIGHT AND AIR =================
// Falling snow on Main Street, light by day and a little heavier on the last night; the lantern's warm pool at night;
// the candles flicker; the mirrors run a beat late (drawn in mirrorAt).
const OUTDOOR=new Set(['town']);
function fx(ctx,o){const M=o.M,N=o.night;
 if(OUTDOOR.has(M.id)){if(!N){ctx.fillStyle='rgba(120,136,152,.12)';ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height)}K.snowfall(ctx,o.now,{k:N?.55:.3,wind:.2})}
 (M.props||[]).forEach(p=>{const x=p.x-o.camx,y=p.y-o.camy;
  if(p.candles){for(let i=0;i<4;i++){const f=Math.sin(o.now/(70+i*13)+i);if(f<-.4)continue;ctx.fillStyle=`rgba(255,210,120,${(.4+.3*f).toFixed(2)})`;ctx.fillRect(Math.round(x-13+i*8),Math.round(y-30),2,2)}}
  if(p.tv&&Math.floor(o.now/600)%3===0){ctx.fillStyle='rgba(200,255,200,.12)';ctx.fillRect(Math.round(x-8),Math.round(8-o.camy),18,14)}});
 if(M.id==='hall'){const t=o.now/1000;ctx.fillStyle=`rgba(180,200,220,${(.05+.04*Math.sin(t*1.3)).toFixed(3)})`;ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height)}
 if(N){const lx=G.px+8-o.camx,ly=G.py+6-o.camy,lr=58*(M.lanternK||1);ctx.globalCompositeOperation='multiply';let gr=ctx.createRadialGradient(lx,ly,0,lx,ly,lr);
  gr.addColorStop(0,'rgba(240,196,120,.7)');gr.addColorStop(1,'rgba(240,196,120,0)');ctx.fillStyle=gr;ctx.fillRect(lx-lr,ly-lr,lr*2,lr*2);
  ctx.globalCompositeOperation='lighter';gr=ctx.createRadialGradient(lx,ly,0,lx,ly,lr*.5);gr.addColorStop(0,'rgba(214,164,58,.14)');gr.addColorStop(1,'rgba(214,164,58,0)');ctx.fillStyle=gr;ctx.fillRect(lx-lr,ly-lr,lr*2,lr*2);
  ctx.globalCompositeOperation='source-over'}}
// the hidden hotspot, while the lead is High on Mushrooms: the vanity's glass fogs, and a small gray hand presses flat in it
function mirrorGlint(c,x,y,now){const a=.25+.2*Math.sin(now/600);c.fillStyle=`rgba(220,235,250,${a.toFixed(2)})`;c.fillRect(x-6,y-14,12,12);
 const k=(now%3600)/3600;c.fillStyle=`rgba(90,90,110,${(.6*Math.sin(k*Math.PI)).toFixed(2)})`;c.fillRect(x-2,y-11,4,5);c.fillRect(x-3,y-13,1,3);c.fillRect(x-1,y-14,1,3);c.fillRect(x+1,y-14,1,3);
 c.fillStyle=`rgba(243,237,226,${(a+.15).toFixed(2)})`;c.fillRect(x-8,y-16,16,1);c.fillRect(x-8,y,16,1)}

// ================= TOWNSFOLK ON THE MAP =================
// The Shared Shelf's person template (shared-sprites-person-v1, method v1), at the agents' size; hair from agent-sprite.js.
// About 1 in 3 has a weird trait (Art, Townsfolk): Bev's pen behind her ear and her crossword, Nils's too-small jacket,
// the kid's empty sled with its seatbelt.
const {SKIN}=window.BL;
const FOLK={
 marit:{look:{skin:0,hair:3,hairC:2,acc:0},top:'#c8302e',coat:1,inner:'#3a3a44',pants:'#2a2a34',shoes:'#2a1e18',iris:'#4a6a8a',mouth:'flat',
  body:(A_,ty)=>{const{R}=A_;R(6,ty+2,16,2,'#e8e4d8');R(17,ty+8,6,8,'#e8e4d8');R(18,ty+9,4,1,'#2a2030')}},
 bev:{look:{skin:0,hair:4,hairC:6,acc:1},top:'#5a8aaa',pants:'#3a3a46',shoes:'#e8e4d8',iris:'#4a6a8a',mouth:'smile',cheeks:1,
  body:(A_,ty)=>{const{R}=A_;R(8,ty+6,12,10,'#e8e4d8');R(9,ty+7,10,1,'#a8323e');R(20,ty-2,1,5,'#3a3a8a')}},
 kessler:{look:{skin:1,hair:3,hairC:6,acc:0},top:'#1e1a22',pants:'#1e1a22',shoes:'#1a1418',iris:'#3a2418',mouth:'smile',
  body:(A_,ty)=>{const{R}=A_;R(12,ty,4,3,'#f4efe6');R(9,ty+10,10,7,'#e8e4d8')}},
 dag:{look:{skin:1,hair:1,hairC:3,acc:3},top:'#7a5a2a',coat:1,inner:'#3a3a44',pants:'#2e3a5a',shoes:'#3a2418',iris:'#4a6a8a',mouth:'flat',cap:'#3a4a3a',
  body:(A_,ty)=>{const{R}=A_;R(13,ty,2,18,shade('#7a5a2a',-.3))}},
 erik:{look:{skin:1,hair:2,hairC:3,acc:0},top:'#3a4a6a',coat:1,inner:'#5a5a64',pants:'#2e3a5a',shoes:'#3a2418',iris:'#4a6a8a',mouth:'flat',cap:'#a8323e'},
 nils:{look:{skin:1,hair:1,hairC:4,acc:0},top:'#2a4a2a',pants:'#2e3a5a',shoes:'#3a2418',iris:'#4a6a8a',mouth:'flat',
  body:(A_,ty)=>{const{R}=A_;R(6,ty,16,10,'#2a4a2a');R(6,ty+10,16,3,'#e8e4d8');R(10,ty+2,8,4,'#f0c040')}},
 sledkid:{look:{skin:2,hair:1,hairC:1,acc:0},top:'#d86a2a',coat:1,inner:'#d86a2a',pants:'#3a5a8a',shoes:'#2a2a30',iris:'#3a2418',mouth:'flat',hood:'#d86a2a',s:.42},
 fisher:{look:{skin:0,hair:2,hairC:6,acc:3},top:'#2a2a30',coat:1,inner:'#c8402e',pants:'#2a2a30',shoes:'#2a2a30',iris:'#5a7a9a',mouth:'flat',cap:'#c8402e',
  body:(A_,ty)=>{const{R}=A_;R(6,ty+4,16,2,'#c8402e')}}
};
function topper(Ad,F_,dir){const{R}=Ad;
 if(F_.cap){const c=F_.cap,cd=shade(c,-.3);if(dir==='up'){R(5,0,18,7,c,{sh:3})}else if(dir==='side'){R(6,-1,17,7,c,{sh:3});R(0,5,8,2,cd)}else{R(5,-1,18,7,c,{sh:3});R(5,-1,18,1,shade(c,.25));R(5,6,18,2,cd)}}
 if(F_.hood){const c=F_.hood,cd=shade(c,-.3);if(dir==='side'){R(5,-1,19,9,c,{sh:3});R(17,7,7,12,cd)}else if(dir==='up'){R(4,-1,20,20,c,{sh:4})}else{R(4,-1,20,6,c,{sh:3});R(3,4,3,16,c);R(22,4,3,16,cd)}}}
// the kid's sled, with nothing on it and its seatbelt buckled
function sled(){const v=art(34,14,2,2,S,({R})=>{R(2,4,28,6,'#c8402e');R(2,4,28,1,'#e8604e');R(0,10,32,2,'#8a8a94');R(30,6,4,2,'#8a8a94');R(10,4,2,6,'#2a2a30');R(20,4,2,6,'#2a2a30');R(10,6,12,1,'#2a2a30');R(14,5,3,3,'#c0c0c8')});v.ax=v.sx(17);v.ay=v.sy(12);return v}
const fcache=new Map();
function folk(id,dir,idle=0,M){
 const k=id+dir+idle;let v=fcache.get(k);if(v)return v;
 if(dir==='right'){const l=folk(id,'left',idle,M),c=K.mk(l.c.width,l.c.height),g=c.getContext('2d');g.translate(c.width,0);g.scale(-1,1);g.drawImage(l.c,0,0);v={c,ax:c.width-l.ax,ay:l.ay}}
 else{const F_=FOLK[id]||FOLK.erik,d=dir==='left'?'side':dir,L=F_.look,sk=SKIN[L.skin];
  const sp=Object.assign({skin:sk,hair:sk,hairStyle:'cropped',iris:F_.iris||'#3a2418'},F_);
  const a=art(40,90,6,30,F_.s||S,Ad=>{K.drawChar(Ad,sp,d,0,idle);BLA.extras(Ad,{look:L},dir,0);topper(Ad,F_,d)});
  v={c:a.c,ax:a.sx(14),ay:a.sy(50)};
  if(id==='sledkid'){const s=sled(),c=K.mk(a.c.width+s.c.width,Math.max(a.c.height,s.c.height)),g=c.getContext('2d');g.drawImage(a.c,s.c.width,0);g.drawImage(s.c,0,v.ay-s.ay);v={c,ax:v.ax+s.c.width,ay:v.ay}}}
 fcache.set(k,v);return v;
}

// ================= PORTRAITS (64 x 64, Storybook faces, Lantern Bust box) =================
const OL='#120c1c',D='#24141e',WH='#f4efe6',MR='#5a1a22';
const sh=(h,a)=>{const n=parseInt(h.slice(1),16),f=v=>Math.max(0,Math.min(255,Math.round(v+a)));return'#'+[n>>16,n>>8&255,n&255].map(v=>f(v).toString(16).padStart(2,'0')).join('')};
function Ly(w,h){const d=new Array(w*h).fill(null);const L={w,h,d,
 g:(x,y)=>(x<0||y<0||x>=w||y>=h)?null:d[y*w+x],
 p(x,y,c){x=Math.round(x);y=Math.round(y);if(x>=0&&y>=0&&x<w&&y<h)d[y*w+x]=c},
 r(x,y,a,b,c){for(let j=0;j<b;j++)for(let i=0;i<a;i++)L.p(x+i,y+j,c)},
 rm(x,y,a,b,c){for(let j=0;j<b;j++)for(let i=0;i<a;i++)if(L.g(x+i,y+j))L.p(x+i,y+j,c)},
 e(cx,cy,rx,ry,c){for(let y=Math.floor(cy-ry);y<=cy+ry;y++)for(let x=Math.floor(cx-rx);x<=cx+rx;x++){const a=(x+.5-cx)/rx,b=(y+.5-cy)/ry;if(a*a+b*b<=1)L.p(x,y,c)}},
 tex(from,to,k=7){for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(L.g(x,y)===from&&(x*3+y*5)%k===0)L.p(x,y,to)}};return L}
function finish(L){const{w,h,d}=L,o=d.slice();for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x,v=d[i];
 if(v){if((x>0&&!L.g(x-1,y))||(y>0&&!L.g(x,y-1)))o[i]=sh(v,30)}
 else if(L.g(x-1,y)||L.g(x+1,y)||L.g(x,y-1)||L.g(x,y+1))o[i]=OL}return o}
const body=(L,c)=>{L.e(34,66,24,15,sh(c,-34));L.e(30,65,22,14,c);L.e(24,60,10,6,sh(c,18))};
const head=(L,cx,cy,rx,ry,s)=>{L.e(cx+1,cy+2,rx,ry,sh(s,-46));L.e(cx+1,cy+1,rx,ry-1,sh(s,-26));L.e(cx-1,cy,rx-1,ry-1,s);L.e(cx-5,cy-4,rx*.45,ry*.4,sh(s,14))};
function eye(L,x,y,ir,s){L.r(x+1,y,4,1,WH);L.r(x,y+1,6,5,WH);L.r(x+1,y+6,4,1,WH);
 L.r(x+1,y+1,4,5,ir);L.r(x+1,y+1,4,1,sh(ir,-45));L.r(x+2,y+2,2,3,D);L.p(x+3,y+2,'#ffffff');L.p(x+4,y+5,sh(ir,45));
 L.r(x,y-1,6,1,D);L.p(x+(s<0?-1:6),y,D);L.p(x+(s<0?-2:7),y-1,D)}
function mouth(L,cx,y,w,o){const x=cx-(w>>1);
 if(o){L.r(x+1,y,w-2,1,MR);L.r(x,y+1,w,3,MR);L.r(x+1,y+4,w-2,1,MR);L.r(x+1,y+1,w-2,1,WH);L.r(x+2,y+3,w-4,2,'#d8607a')}
 else{L.r(x+1,y+1,w-2,1,MR);L.p(x,y,MR);L.p(x+w-1,y,MR)}}
const ears=(L,s,y=33)=>{L.e(17,y,3,4,s);L.e(47,y,3,4,sh(s,-30));L.p(17,y,sh(s,-30))};
const nose=(L,s,y=36)=>{L.p(32,y,sh(s,-40));L.p(33,y+1,sh(s,-40));L.p(31,y+1,sh(s,10))};
const brows=(L,c,y=25,tilt=0)=>{L.r(21,y+tilt,6,1,c);L.r(37,y-tilt,6,1,c)};
// snow melting on someone who just came in from it
const flakes=(L,seed)=>{for(let i=0;i<6;i++){const x=12+((i*17+seed)%40),y=6+((i*11+seed)%20);if(L.g(x,y))L.p(x,y,'#f4f8fc')}};

const PORT={
// Marit Sundby: fifties, a red parka zipped to the chin, ash-blond bob, reading glasses pushed up, a pen in her teeth's place
MARIT:{bg:'#3a2a2e',f(L,t){const s='#f0c8a8',hc='#c8b080',u='#c8302e';
 body(L,u);L.r(26,44,12,8,sh(u,-30));L.r(31,46,2,18,'#8a2020');for(let y=50;y<64;y+=4)L.rm(10,y,44,1,sh(u,16));
 ears(L,s);head(L,32,32,14,15,s);L.e(31,20,15,7,hc);L.r(17,20,4,16,hc);L.r(43,20,4,16,sh(hc,-20));
 L.r(21,16,9,3,'#5a4a3a');L.r(34,16,9,3,'#5a4a3a');L.r(30,17,4,1,'#5a4a3a');
 eye(L,21,28,'#4a6a8a',-1);eye(L,37,28,'#4a6a8a',1);brows(L,sh(hc,-40),25,1);nose(L,s);L.r(19,37,4,2,'#e8a090');L.r(41,37,4,2,'#e8a090');flakes(L,5);
 if(t)mouth(L,32,41,7,true);else L.r(28,42,8,1,MR)}},
// Bev Ostlund: seventies, a white bun with a pen through it, glasses on a chain, a blue cafe smock, a wry mouth
BEV:{bg:'#2a3a44',f(L,t){const s='#f2cfae',hc='#ece8de',u='#5a8aaa';
 body(L,u);L.r(20,48,24,16,'#e8e4d8');L.r(22,50,20,1,'#a8323e');L.r(27,44,10,6,sh(s,-30));
 L.e(32,11,7,6,sh(hc,-10));L.r(36,4,2,12,'#3a3a8a');
 ears(L,s);head(L,32,32,14,15,s);L.e(31,20,14,6,hc);L.r(18,20,3,8,hc);L.r(43,20,3,8,sh(hc,-20));
 for(const x of[20,36]){L.r(x,27,9,9,'#8a6a4a');L.r(x+1,28,7,7,'#e6eef4')}L.r(29,30,6,1,'#8a6a4a');L.r(18,35,1,12,'#c8a040');L.r(46,35,1,12,'#c8a040');
 eye(L,21,28,'#4a6a8a',-1);eye(L,37,28,'#4a6a8a',1);brows(L,sh(hc,-34),24,-1);L.r(19,38,4,2,'#e8857a');L.r(41,38,4,2,'#e8857a');nose(L,s);
 if(t)mouth(L,32,42,7,true);else{L.r(28,43,8,1,MR);L.p(36,42,MR)}}},
// Father Tom Kessler: sixties, big, a goalie's broken nose, short gray hair, black clerical shirt and white collar tab, a
// gap where an eyetooth was
'FATHER TOM':{bg:'#2a2430',f(L,t){const s='#e8b890',hc='#a8a8a8',u='#1e1a22';
 body(L,u);L.r(26,44,12,6,u);L.r(29,45,6,4,'#f4efe6');L.r(27,44,10,2,sh(s,-30));
 ears(L,s);head(L,32,31,16,16,s);L.e(31,18,15,5,hc);L.tex(hc,'#8a8a8a',3);L.r(16,22,3,8,hc);L.r(45,22,3,8,hc);
 eye(L,21,28,'#3a2418',-1);eye(L,37,28,'#3a2418',1);brows(L,sh(hc,-50),25,0);
 L.p(32,34,sh(s,-40));L.p(33,35,sh(s,-40));L.p(31,36,sh(s,-50));L.p(34,36,sh(s,10));L.r(31,37,3,1,sh(s,-30));
 if(t){mouth(L,32,41,8,true);L.r(30,42,1,2,'#2a1418')}else{L.r(27,42,10,1,MR);L.p(26,41,MR);L.p(37,41,MR)}}},
// Dag Haugen: forties, a big man in a canvas work coat, a feed cap, a beard gone red at the corners, tired gray eyes
DAG:{bg:'#2a2a24',f(L,t){const s='#e8b090',b='#8a5a3a',u='#7a5a2a';
 body(L,u);L.r(30,46,4,18,sh(u,-34));for(let x=8;x<60;x+=8)L.rm(x,50,1,14,sh(u,18));L.r(26,44,12,6,'#3a3a44');
 ears(L,s,34);head(L,32,33,15,15,s);L.e(32,44,13,8,b);L.tex(b,'#a86a3a',4);L.r(26,39,12,2,b);
 L.e(32,18,16,7,'#3a4a3a');L.e(32,24,18,3,sh('#3a4a3a',-20));L.r(26,14,12,6,'#e8e4d8');L.r(28,16,8,2,'#3a4a3a');
 eye(L,21,29,'#7a8a9a',-1);eye(L,37,29,'#7a8a9a',1);L.r(21,36,6,1,sh(s,-30));L.r(37,36,6,1,sh(s,-30));brows(L,b,26,1);nose(L,s,37);
 if(t)mouth(L,32,43,7,true);else L.r(28,44,8,1,MR)}}
};
const pcache={};
function portraitCanvas(name,open){const k=name+(open?1:0);if(pcache[k])return pcache[k];
 const P_=PORT[name],L=Ly(64,64),c=K.mk(64,64),g=c.getContext('2d');P_.f(L,open?1:0);
 const gr=g.createRadialGradient(22,18,4,32,32,46);gr.addColorStop(0,sh(P_.bg,34));gr.addColorStop(1,P_.bg);g.fillStyle=gr;g.fillRect(0,0,64,64);
 const o=finish(L);for(let i=0;i<o.length;i++)if(o[i]){g.fillStyle=o[i];g.fillRect(i%64,(i/64)|0,1,1)}
 return pcache[k]=c}
const portraits={};
for(const name of Object.keys(PORT))portraits[name]=(ctx,open)=>{ctx.clearRect(0,0,64,64);ctx.drawImage(portraitCanvas(name,open),0,0)};

// ================= BIG HAT'S BRIEFING PLACE: an ice house on Lake Tamarack =================
// A plywood ice-fishing house a quarter mile out on a frozen lake, the last weekend before the ice goes bad. Drawn in the
// back room's layout (spec 013): his bust centered, the house behind him, and in front of him, where the desk would
// be, the hole in the ice with its tip-up. A lamp hung right over his hat keeps his face clear; the propane heater goes
// orange in the corner; through the little window, the frozen lake and the other houses' lights.
const icehouse={
 back(c,v){const{VW,VH,fy,mid,now}=v,R=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))};
  // plywood walls, green paint gone pale, screw heads
  R(0,0,VW,VH,'#4a5a44');for(let x=((mid-6)%48+48)%48;x<VW;x+=48){R(x,0,1,VH,'#2e3a2a');R(x+1,0,1,VH,'#6a7a5e')}for(let y=10;y<fy;y+=40)for(let x=((mid)%24+24)%24;x<VW;x+=24)R(x,y,1,1,'#8a9a7a');
  // the window: the frozen lake at dusk, the other ice houses' lights, snow blowing
  const wx=mid+40,wy=fy-118,ww=48,wh=32;R(wx-3,wy-3,ww+6,wh+6,'#2e3a2a');R(wx,wy,ww,wh,'#1a2232');R(wx,wy+wh*.55,ww,wh*.45,'#9aa8b8');
  for(let k=0;k<4;k++){const lx=wx+5+k*11;R(lx,wy+wh*.42,6,5,'#3a3a44');R(lx+2,wy+wh*.46,2,2,k%2?'#ffd27a':'#ff9a5a')}
  for(let k=0;k<9;k++){const sx=wx+((k*13+now/20)%ww),sy=wy+((k*7+now/30)%wh);R(sx,sy,1,1,'#e8eef4')}R(wx+ww/2-1,wy,2,wh,'#2e3a2a');
  // the bait-shop calendar, a rod rack, a coffee can of tip-ups
  R(mid-110,fy-100,26,32,'#e8e4d8');R(mid-110,fy-100,26,8,'#2e4a7a');for(let i=0;i<12;i++)R(mid-107+(i%4)*6,fy-88+((i/4)|0)*6,4,4,i===10?'#a8323e':'#b8b4a8');
  for(let i=0;i<3;i++)R(mid-70+i*6,fy-116,1,70,'#8a6a40');R(mid-74,fy-50,22,3,'#5a4024');
  // the propane heater in the corner, glowing orange
  const hx=mid+96,hy=fy-34;R(hx-8,hy,16,34,'#c8c0b0');R(hx-6,hy-14,12,14,'#5a5a64');const fl=.6+.4*Math.sin(now/160);c.fillStyle=`rgba(255,${120+40*fl|0},60,.9)`;c.fillRect(hx-5,hy-12,10,10);
  c.fillStyle=`rgba(255,150,60,${(.12*fl).toFixed(3)})`;c.beginPath();c.arc(hx,hy-8,40,0,6.283);c.fill();
  // the lamp hung right over his hat, and its cone of warm light so his face reads
  R(mid-1,0,2,12,'#3a3a44');R(mid-6,12,12,6,'#3a3a44');R(mid-4,18,8,3,'#fff2c8');
  c.fillStyle='rgba(255,226,170,.12)';c.beginPath();c.moveTo(mid-10,22);c.lineTo(mid+10,22);c.lineTo(mid+76,fy);c.lineTo(mid-76,fy);c.fill();
  R(0,fy-4,VW,VH,'#3a3024')},
 lift:2,
 front(c,v){const{VW,VH,fy,mid,now}=v,R=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))};
  // the plank floor with frost in the cracks
  R(0,fy,VW,VH-fy,'#5a4a36');for(let y=fy+8;y<VH;y+=8)R(0,y,VW,1,'#3a2e22');for(let x=8;x<VW;x+=21)R(x,fy,1,VH-fy,'#e8eef4');
  // the hole in the ice where the desk would be: black water, a skim of slush, the line going down, the tip-up's flag
  c.fillStyle='#d8e4ec';c.beginPath();c.ellipse(mid,fy+16,62,13,0,0,6.283);c.fill();c.fillStyle='#0e1820';c.beginPath();c.ellipse(mid,fy+16,54,10,0,0,6.283);c.fill();
  c.fillStyle='rgba(120,150,170,.4)';c.beginPath();c.ellipse(mid-14,fy+14,16,3,0,0,6.283);c.fill();
  R(mid+20,fy-14,1,30,'#e8e4d8');R(mid+18,fy+10,24,2,'#8a6a40');R(mid+40,fy-6,2,18,'#8a6a40');R(mid+42,fy-6,8,6,'#e8402e');
  // a bucket for a seat, a thermos, a box of tackle, a minnow bucket: the floor never ends on bare planks
  R(mid-96,fy+4,20,20,'#e8e4dc');R(mid-96,fy+4,20,2,'#f8f4ec');R(mid-68,fy+8,8,16,'#3e6a4a');R(mid-68,fy+6,8,3,'#c0c0c8');
  R(mid+70,fy+10,30,12,'#3a5a8a');R(mid+70,fy+10,30,2,'#5a7aaa');R(mid+82,fy+6,6,4,'#c0c0c8');
  R(0,fy+44,VW,2,'#2e2418');R(0,fy+46,VW,1,'#6a5a46')}
};

return{paint,props,folk,portraits,fx,icehouse,mirrorGlint,FOLK,PORT,portraitCanvas};
})();
