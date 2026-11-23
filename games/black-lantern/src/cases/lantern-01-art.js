// Black Lantern · cases/lantern-01-art.js · LANTERN 01's art (spec 014 part A, Nov 23, 2026). Exposes window.L01A.
// Art for this case only (Bible, Art, Direction: one case, one set of art); never reuse it in another case.
// Generic pieces come from the Shared Shelf (engine/shelf.js, the versions in use), painted with Black Lantern's
// palette. This file adds the case's own pieces (the waterfront fronts, the cannery and its stairs, the pier and the
// river, the rooms' fittings), its townsfolk on the map and in the dialog box, the rain, and Big Hat's briefing place.
// No Shared Shelf pieces are added; the rain is a Shared Shelf candidate, to be proposed with Keegan's OK first.
//
//   L01A.paint(M)            the map's still layer -> {c, glows}; L01A.props(M) its standing pieces, sorted with people
//   L01A.folk(id, dir, idle, M)  a townsperson's map sprite -> {c, ax, ay, noShadow}
//   L01A.portraits           speaker name -> (ctx, mouth) drawing the 64 x 64 talking portrait
//   L01A.fx(ctx, o)          the case's light and air after the light pass: the rain, the lantern's warm pool at night,
//                            and the small moving things in each room (a stove's fire, a TV, neon, dripping water)
//   L01A.wheelhouse          Big Hat's briefing place: {back, front} (engine.js bigHatScene)
//   L01A.mirrorGlint         how the hidden hotspot looks while it shows
//
// The case's accent colors (Bible, Art, Palette), on top of the base palette: rain gray-blue, the river's green-gray,
// faded cannery red, oilskin olive and the tavern's neon.
const L01_ACCENT={rain:'#b8c8d8',river:'#3a4a48',riverLo:'#24302e',cannery:'#8a4436',oil:'#4a5636',neon:'#5ae0d0',sky:'#5a6878'};
window.L01A=(()=>{
const K=SHELF,T=16,S=.5,{F,shade,hsh,RGB,art}=K,A=L01_ACCENT;
const ART={};
const get=(k,spec)=>ART[k]||(ART[k]=K.prop(spec(),S));
const isNight=M=>M.light==='night';

// ================= GROUND =================
// everything outside is wet: the stone and the street a shade darker, with puddles that catch the sky
const wet=(c,x,y)=>{const n=hsh(x>>2,y>>2,501);return n<.5?shade(c,-.12):c};
const GP={
 ',':(x,y)=>wet(K.stoneSidewalk(x,y,T,false),x,y),
 '=':(x,y)=>wet(K.asphalt(x,y,T),x,y),
 b:(x,y)=>K.boardwalk(x,y,T),
 r:(x,y)=>K.dryDirt(x,y,T,true),
 '.':(x,y)=>K.grass(x,y,T),
 W:(x,y)=>{const n=hsh(x>>1,y,502),band=Math.sin(x*.09+y*.6+hsh(0,y>>2,503)*6);return band>.82?'#5a6a66':band<-.9?A.riverLo:n<.5?A.river:'#34423f'},
 w:(x,y)=>K.floor(x,y,T,'wood'),n:(x,y)=>K.floor(x,y,T,'lino'),c:(x,y)=>K.floor(x,y,T,'carpet'),
 o:(x,y)=>{const n=hsh(x>>1,y>>1,504);return n<.05?'#3e3c38':n>.95?'#7a7872':(x%32===0||y%32===0)?'#4e4c48':['#5e5c56','#585650','#64625a'][(hsh(x,y,505)*3)|0]}};
const at=(M,x,y)=>{const r=M.ground[y];return r?r[x]:undefined};

// ================= THE STILL LAYER =================
const still={};
function paint(M){
 const key=M.id+(isNight(M)?'n':'d');if(still[key])return still[key];
 const W=M.w*T,H=M.h*T,c=K.mk(W,H),g=c.getContext('2d'),img=g.createImageData(W,H),d=img.data,glows=[];
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const ch=at(M,(x/T)|0,(y/T)|0),col=(GP[ch]||GP[','])(x,y),v=RGB(col),i=(y*W+x)*4;d[i]=v[0];d[i+1]=v[1];d[i+2]=v[2];d[i+3]=255}
 g.putImageData(img,0,0);
 for(let ty=0;ty<M.h;ty++)for(let tx=0;tx<M.w;tx++){const a=at(M,tx,ty),b=at(M,tx,ty+1);
  // curbs, puddles on the street and the stone, the rails, the riverwalk's edge over the water
  if(a===','&&(b==='='||b==='r')){F(g,tx*T,ty*T+T-2,T,1,'#8a8a90');F(g,tx*T,ty*T+T-1,T,1,'#1c1820')}
  if(a==='='&&at(M,tx,ty-1)===','){F(g,tx*T,ty*T,T,1,'#1c1820')}
  if((a===','||a==='=')&&hsh(tx,ty,506)<.14){g.fillStyle='rgba(20,26,36,.45)';g.beginPath();g.ellipse(tx*T+8,ty*T+9,6,2.5,0,0,6.283);g.fill();g.fillStyle='rgba(184,200,216,.28)';g.fillRect(tx*T+4,ty*T+8,5,1)}
  if(a==='r'){F(g,tx*T,ty*T+4,T,2,'#5a5a64');F(g,tx*T,ty*T+4,T,1,'#9a9aa4');F(g,tx*T,ty*T+11,T,2,'#5a5a64');F(g,tx*T,ty*T+11,T,1,'#9a9aa4');for(let k=1;k<T;k+=5)F(g,tx*T+k,ty*T+3,2,11,'#4a3a2a')}
  if(a==='b'&&b==='W'){F(g,tx*T,ty*T+T-2,T,2,'#2a1e16');F(g,tx*T,ty*T+T,T,3,'rgba(10,16,16,.5)')}}
 (M.lines||[]).forEach(l=>K.paintLine(g,l.x,l.y,l.w,l.h,l.dashed,l.col||'#e8e4d8'));
 M.pieces.filter(p=>PROPK.has(p.k)&&!NOSHADOW.has(p.k)).forEach(p=>{const cx=(p.x+p.w/2)*T+2,cy=(p.y+p.h)*T-2,rx=Math.max(5,p.w*T*.42);
  g.fillStyle='rgba(16,10,20,.3)';g.beginPath();g.ellipse(cx,cy,rx,Math.max(2.5,rx*.28),0,0,6.283);g.fill()});
 M.pieces.filter(p=>STILL[p.k]).sort((a,b)=>(BACK.has(a.k)?-99:a.y+a.h)-(BACK.has(b.k)?-99:b.y+b.h)).forEach(p=>STILL[p.k](g,p,M,glows));
 return still[key]={c,glows};
}
const BACK=new Set(['room','floorroom','house','postoffice','tavern','cannery','pier']);
const shadowBelow=(g,x0,x1,fb)=>{g.fillStyle='rgba(16,10,20,.34)';g.fillRect(x0+3,fb,x1-x0,3);g.fillStyle='rgba(16,10,20,.16)';g.fillRect(x0+5,fb+3,x1-x0-2,2)};
function signOn(g,rect,text,col,ink){const[x,y,w,h]=rect,inner=K.signBlank(g,x,y,w,h,col);const tw=K.signWidth(text);
 K.signText(g,text,Math.round(inner[0]+(inner[2]-tw)/2),Math.round(inner[1]+(inner[3]-5)/2),ink)}
// a lit window: by day the glass; at night lit (its glow) or dark
function win(g,M,glows,x,y,w,h,lit,curt){const gl=K.windowPane(g,x,y,w,h,T,curt);if(isNight(M)){if(lit)glows.push([gl[0],gl[1],T*1.3,.42]);else F(g,x+1,y+1,w-2,h-2,'#1a1c26')}
 // rain running down the glass
 for(let i=0;i<w;i+=4)if(hsh(x+i,y,507)<.5)F(g,x+1+i,y+1+((hsh(i,y,508)*h*.4)|0),1,3,'rgba(200,220,240,.35)')}
const FB=7*T;  // the north side's fronts stand on row 7
const STILL={
 // the Halvorsen house: tall, narrow, blue clapboard, a steep roof, a porch with a key wind chime
 house(g,p,M,glows){const x0=p.x*T,x1=(p.x+p.w)*T,N=isNight(M);
  K.roof(g,x0,x1,0,38,'#3a3440',T,3,true);K.wall(g,x0,x1,38,FB,'siding','#4a6a8a',T);
  win(g,M,glows,x0+14,46,18,16,true,true);win(g,M,glows,x1-32,46,18,16,false,true);win(g,M,glows,x1-32,78,18,16,true,true);
  K.door(g,4*T+8,FB-.95*T,FB,'#6a3a2e',T);K.porch(g,x0+2*T,x0+6*T,FB,T,{stepX:4*T+8});
  for(let i=0;i<4;i++)F(g,x0+27+i*3,FB-22,1,6+i%2*2,'#c8a040');F(g,x0+25,FB-23,14,1,'#5a4a3a');shadowBelow(g,x0,x1,FB)},
 // the post office branch: brick, a flat parapet, the sign over the door, the hours on the glass
 postoffice(g,p,M,glows){const x0=p.x*T,x1=(p.x+p.w)*T,N=isNight(M);
  F(g,x0-2,0,x1-x0+4,10,'#5a5258');F(g,x0-2,0,x1-x0+4,2,'#7a7276');F(g,x0-2,9,x1-x0+4,1,'#2a2228');
  const s=K.storefront(g,x0,x1,10,FB,T,{col:'#7a4a3a',trim:'#d8d0b8',door:12*T+8,upper:true});
  signOn(g,[x0+14,s.sign[1]+1,x1-x0-28,10],'US POST OFFICE','#2e4a7a','#e8e4d8');
  if(!N)s.glows.forEach(gl=>glows.push(gl));else s.glows.forEach(([x,y])=>F(g,x-12,y-4,24,8,'rgba(10,12,20,.55)'));
  F(g,12*T+14,FB-12,10,7,'#e8e4d8');K.signText(g,'9-5',12*T+15,FB-11,'#2a2030');shadowBelow(g,x0,x1,FB)},
 // the Snag Tavern: dark green siding, small windows, a neon fish over the door (half its letters out)
 tavern(g,p,M,glows){const x0=p.x*T,x1=(p.x+p.w)*T;
  K.roof(g,x0,x1,0,30,'#2e2a30',T,7,false);K.wall(g,x0,x1,30,FB,'batten','#3e5a4a',T);
  win(g,M,glows,x0+12,60,20,14,true,false);win(g,M,glows,x1-34,60,20,14,true,false);
  K.door(g,20*T+8,FB-.95*T,FB,'#5a2e24',T);
  signOn(g,[x0+30,36,x1-x0-60,11],'THE SNAG','#1a1c22','#5ae0d0');
  F(g,x0+42,52,20,6,'#1a1c22');F(g,x0+46,54,10,2,'#ff6a9a');F(g,x0+56,53,4,4,'#ff6a9a');glows.push([x0+52,54,T*1.6,isNight(M)?.5:.18]);
  shadowBelow(g,x0,x1,FB)},
 // the cannery: big as a church, corrugated and faded red, BAY PACKING CO. across it, the loading doors rusted shut, the
 // side door, and the loft's windows up top
 cannery(g,p,M,glows){const x0=p.x*T,x1=(p.x+p.w)*T,N=isNight(M);
  F(g,x0-2,0,x1-x0+4,8,'#3a3236');F(g,x0-2,0,x1-x0+4,2,'#5a5256');F(g,x0-2,7,x1-x0+4,1,'#1a1418');
  F(g,x0,8,x1-x0,FB-8,A.cannery);for(let x=x0;x<x1;x+=4){F(g,x,8,1,FB-8,shade(A.cannery,.16));F(g,x+2,8,1,FB-8,shade(A.cannery,-.24))}
  for(let i=0;i<40;i++){const x=x0+hsh(i,1,509)*(x1-x0),y=10+hsh(i,2,509)*(FB-20);F(g,x,y,1+hsh(i,3,509)*2,4+hsh(i,4,509)*8,'rgba(60,36,26,.45)')}   // rust runs
  F(g,x0,8,x1-x0,2,'rgba(20,10,20,.35)');F(g,x0,8,2,FB-8,'#140d16');F(g,x1-2,8,2,FB-8,'#140d16');
  F(g,x0+20,14,112,12,'rgba(232,228,216,.75)');K.signText(g,'BAY PACKING CO',x0+29,17,'#6a2a24',2);
  // the loft's windows, high on the right; one lit at night
  win(g,M,glows,x0+150,16,16,14,false,false);win(g,M,glows,x0+180,16,16,14,true,false);
  // the loading doors, rusted shut, and the side door
  for(const dx of[31*T,33*T]){F(g,dx,FB-50,30,50,'#5a4a44');for(let y=FB-48;y<FB;y+=3)F(g,dx+1,y,28,1,'#4a3a36');F(g,dx,FB-50,30,2,'#7a6a64')}
  F(g,31*T+28,FB-30,6,5,'#8a8a90');F(g,31*T+30,FB-26,2,8,'#6a6a74');
  K.door(g,29*T+8,FB-.95*T,FB,'#3a3a44',T);
  if(!N){for(let i=0;i<5;i++)F(g,29*T+3+i*2,FB-9+(i%2),2,2,'#8a8a94')}  // the chain, by day
  shadowBelow(g,x0,x1,FB)},
 // the outside stairs up the cannery's side to the loft: a landing and its door under a bare bulb
 stairs(g,p,M,glows){const x0=35*T,N=isNight(M),w='#6a5040',wl='#8a6a50',wd='#3a281e';
  F(g,x0+2,10,30,8,wd);F(g,x0+2,10,30,2,wl);K.door(g,x0+10,-4,12,'#4a3a30',T);
  F(g,x0+4,14,1,FB-14,wd);for(let k=0;k<12;k++){const sx=x0+6+k*3.3,sy=18+k*7.8;F(g,sx,sy,12,3,w);F(g,sx,sy,12,1,wl);F(g,sx,sy+3,12,1,wd)}
  F(g,x0+8,18,1,FB-18,wd);F(g,x0+46,40,2,FB-40,wd);for(let k=0;k<7;k++)F(g,x0+8+k*6,18+k*13,8,1,'#8a7a64');
  F(g,x0+28,6,4,3,N?'#fff2c8':'#b8b0a0');if(N)glows.push([x0+30,8,T*1.6,.5])},
 // the pier: planks out into the river on pilings, rope rail both sides
 pier(g,p,M){const x0=p.x*T,x1=(p.x+p.w)*T,y0=p.y*T,y1=(p.y+p.h)*T;
  for(let x=x0;x<x1;x+=T)for(const k of[0,1])F(g,x+3+k*8,y1-2,3,8,'#3a281e');
  for(let y=y0;y<y1;y+=T){F(g,x0-3,y,3,T,'#4a3424');F(g,x1,y,3,T,'#4a3424');F(g,x0-3,y+2,3,2,'#c8b890');F(g,x1,y+2,3,2,'#c8b890')}
  F(g,x0-4,y1-4,x1-x0+8,4,'#3a281e');for(let x=x0-3;x<x1+3;x+=6)F(g,x,y1-6,2,2,'#c8b890')},
 // interiors: the back wall, the side walls and the bottom wall with its door gap, then each room's fittings
 room(g,p,M,glows){const W=M.w*T,H=M.h*T,kind={loft:['plain','#8a8070'],snag:['panel','#5a3a2a'],post:['plain','#c8c4b0'],halvorsen:['plain','#b8a0a8']}[M.id]||['plain','#b8a888'];
  K.innerWall(g,T,W-T,0,3*T,kind[0],kind[1],T);
  F(g,0,0,T,H,'#1e1826');F(g,T-2,0,2,H-T,'#3a3046');F(g,W-T,0,T,H,'#1e1826');F(g,W-T,0,2,H-T,'#2a2236');
  F(g,0,H-T,W,T,'#1e1826');F(g,T,H-T,W-2*T,2,'#3a3046');
  const dk=Object.keys(M.warps)[0];if(dk){const[x]=dk.split(',').map(Number);F(g,x*T+1,H-T,T-2,T,'#6a4a3a');F(g,x*T+3,H-T+3,T-6,T-6,'#8a5a3a');for(let i=0;i<4;i++)F(g,x*T+4,H-T+5+i*2,T-8,1,'#5a3a2a')}
  F(g,T,3*T,W-2*T,3,'rgba(16,10,20,.25)');
  (DECOR[M.id]||(()=>{}))(g,M,glows)},
 // the cannery floor: corrugated walls, high windows with the night through them, puddles everywhere
 floorroom(g,p,M,glows){const W=M.w*T,H=M.h*T,c='#5a4a46';F(g,T,0,W-2*T,3*T,c);for(let x=T;x<W-T;x+=4){F(g,x,0,1,3*T,shade(c,.14));F(g,x+2,0,1,3*T,shade(c,-.22))}
  for(let x=2*T;x<W-2*T;x+=3*T){if(x>9*T&&x<15*T)continue;F(g,x,6,22,12,'#1a1418');F(g,x+1,7,20,10,'#3a4658');F(g,x+1,7,20,3,'#5a6a7a');F(g,x+11,6,1,12,'#1a1418');glows.push([x+11,12,T*1.4,.3])}
  F(g,T,3*T-3,W-2*T,3,'#2a2224');F(g,0,0,T,H,'#1a1418');F(g,W-T,0,T,H,'#1a1418');F(g,0,H-T,W,T,'#141012');F(g,T,H-T,W-2*T,2,'#2a2224');
  F(g,3*T+1,H-T,T-2,T,'#3a3a44');F(g,3*T+3,H-T+3,T-6,T-6,'#4a4a54');
  for(let i=0;i<14;i++){const x=T+hsh(i,1,510)*(W-3*T),y=3.5*T+hsh(i,2,510)*(H-5*T);g.fillStyle='rgba(30,40,50,.5)';g.beginPath();g.ellipse(x,y,6+hsh(i,3,510)*10,2+hsh(i,4,510)*3,0,0,6.283);g.fill();g.fillStyle='rgba(150,170,190,.18)';g.fillRect(x-3,y-1,5,1)}
  for(let x=T;x<W-T;x+=2)F(g,x,3*T,1,1,'rgba(200,190,170,.15)')}
};
// each room's wall fittings
const DECOR={
 loft(g,M,glows){F(g,6*T,.6*T,1.4*T,.9*T,'#e8e4d8');for(let i=0;i<5;i++)F(g,6*T+3,.6*T+3+i*2,1.4*T-6,1,'#8a8070');F(g,6*T+3,.6*T+2,8,1,'#a8323e')},   // a duty roster, last month's
 snag(g,M,glows){for(let i=0;i<6;i++){F(g,9.4*T+i*3,.4*T,2,1.6*T,'#3a281e')}F(g,9.2*T,.4*T,1.4*T,.2*T,'#5a3a2a');                             // a rack of oars
  F(g,12.2*T,1.1*T,1.4*T,.9*T,'#2a2030');F(g,12.2*T+2,1.1*T+2,1.4*T-4,.9*T-4,'#c8b890');K.signText(g,'CASH',12.2*T+3,1.1*T+4,'#2a2030')},
 post(g,M,glows){win(g,M,glows,4*T,.5*T,2*T,1.4*T,true,false);F(g,6.6*T,.6*T,T,T,'#8a6a4a');F(g,6.6*T+2,.6*T+2,T-4,T-4,'#f4efe6');F(g,6.6*T+7,.6*T+4,1,5,'#2a2030');F(g,6.6*T+7,.6*T+8,4,1,'#2a2030')},
 halvorsen(g,M,glows){win(g,M,glows,2.2*T,.5*T,1.6*T,1.4*T,true,true);for(let i=0;i<5;i++){F(g,(5+i*1.1)*T,.6*T,.8*T,1*T,'#c8a040');F(g,(5+i*1.1)*T+2,.6*T+2,.8*T-4,1*T-4,['#a8b8c8','#c8a8a8','#a8c8a8','#d8c8a8','#b8a8c8'][i])}  // family photos
  F(g,9.4*T,.5*T,1.2*T,1.4*T,'#5a3a2a');F(g,9.4*T+2,.5*T+2,1.2*T-4,1.4*T-4,'#e8dcc4');K.signText(g,'TAK',9.4*T+5,.5*T+8,'#6a2a24')}  // a sampler: TAK (thanks)
};

// ================= STANDING PIECES =================
const SPEC={
 bench:()=>K.BENCH,
 // the pier's light at the end: a post and a caged lamp that swings a little in the wind
 pierlamp:()=>({size:[18,80,0,0],anchor:[9,78],lights:[[9,8,2.4,.5]],draw({R}){R(7,10,4,66,'#4a3a2a',{sh:1});R(3,74,12,4,'#3a281e');R(2,2,14,3,'#3a3a44');R(4,5,10,7,'#ffe2a0');R(4,5,10,1,'#fff2c8');for(const x of[6,9,12])R(x,5,1,7,'#3a3a44');R(2,12,14,2,'#3a3a44')}}),
 flag:()=>({size:[30,96,0,0],anchor:[4,94],lights:[],draw({R}){R(2,0,3,94,'#c0c0c8',{sh:1});R(1,90,5,4,'#5a5a64');R(5,6,8,26,'#a8323e');for(let y=10;y<32;y+=6)R(5,y,8,2,'#e8e4d8');R(5,6,5,10,'#2e4a7a');R(12,8,2,24,'#7a2a2a')}}),
 shelter:()=>({size:[96,70,0,0],anchor:[48,68],lights:[[48,8,1.4,.35]],draw({R}){R(0,0,96,6,'#3a4a5a',{sh:10});R(0,0,96,2,'#5a6a7a');R(2,6,3,62,'#5a6a7a');R(91,6,3,62,'#5a6a7a');R(6,8,84,40,'rgba(184,200,216,.35)');
  for(let x=10;x<88;x+=7)R(x,10+(x*7)%24,1,10,'rgba(230,240,250,.5)');R(10,48,76,5,'#6a4a32');R(10,48,76,1,'#8a6a4a');R(14,53,3,14,'#3a3a44');R(78,53,3,14,'#3a3a44');R(60,14,20,24,'#e8e4d8');R(62,16,16,4,'#2e4a7a');for(let y=22;y<36;y+=3)R(62,y,14,1,'#8a8a94')}}),
 barrel:()=>({size:[24,34,0,0],anchor:[12,32],lights:[],draw({R,E}){R(2,4,20,28,'#2e5a9a',{sh:6});E(12,4,10,3,'#4a7ab8');E(12,4,7,2,'#1a3a6a');R(2,12,20,2,'#1a3a6a');R(2,24,20,2,'#1a3a6a');R(6,15,12,6,'#e8e4d8');R(7,17,10,1,'#2a2030')}}),
 trash:()=>({size:[20,32,0,0],anchor:[10,30],lights:[],draw({R}){R(2,6,16,24,'#3a5a4a',{sh:5});R(0,3,20,4,'#4a6a5a');R(5,0,10,3,'#3a5a4a');for(let x=5;x<16;x+=4)R(x,9,1,18,'#2a4a3a')}}),
 planter:()=>({size:[30,36,0,0],anchor:[15,34],lights:[],draw({R,C}){R(3,22,24,12,'#5a5a64',{sh:6});R(2,20,26,3,'#7a7a84');const L=K.pal().grass;C(9,14,7,shade(L,-.1));C(20,12,8,L);C(15,8,6,shade(L,.2));for(let i=0;i<5;i++)R(6+i*4,4+(i%2)*4,2,3,'#c8a0c8')}}),
 // the loft
 cot:()=>({size:[32,62,0,0],anchor:[16,60],lights:[],draw({R}){R(2,6,28,50,'#5a6a3a',{sh:8});R(2,6,28,2,'#7a8a5a');R(4,6,24,10,'#e8e4d8');R(2,56,3,4,'#3a3a44');R(27,56,3,4,'#3a3a44');for(let y=20;y<54;y+=8)R(2,y,28,1,'#4a5a2a')}}),
 hotplate:()=>({size:[30,42,0,0],anchor:[15,40],lights:[],draw({R,E}){R(1,18,28,22,'#6a4a32',{sh:6});R(1,18,28,2,'#8a6a4a');R(3,10,24,8,'#2a2a30');E(10,13,5,2,'#5a2a1e');E(20,13,5,2,'#3a3a44');R(16,2,8,9,'#c0c0c8');R(16,2,8,2,'#e0e0e8');R(17,4,6,2,'#8a4a2a')}}),
 crate:()=>({size:[30,40,0,0],anchor:[15,38],lights:[],draw({R}){R(1,14,28,24,'#8a6a40',{sh:6});for(let y=18;y<38;y+=6)R(1,y,28,1,'#5a4024');R(4,4,20,10,'#2a2a30',{sh:4});R(6,2,16,4,'#3a3a44');R(8,6,4,4,'#c0c0c8');R(16,6,4,4,'#c0c0c8');R(24,8,4,1,'#2a2a30')}}),
 books:()=>({size:[28,36,0,0],anchor:[14,34],lights:[],draw({R}){const cs=['#5a2a3a','#2e4a3a','#3a3a5a','#6a5a2a','#4a2a2a','#2a3a4a'];for(let i=0;i<6;i++){R(2+(i%2)*3,28-i*5,22-(i%3)*2,5,cs[i],{sh:3});R(2+(i%2)*3,28-i*5,1,5,'#d8c8a0')}}}),
 lamp_in:()=>({size:[22,54,0,0],anchor:[11,52],lights:[[11,10,2.4,.5]],draw({R,E}){R(4,46,14,6,'#3a3a44');R(10,18,2,28,'#5a5a64');E(11,12,9,8,'#d8b878');E(11,10,7,5,'#f0d8a0');R(3,18,16,2,'#a88850')}}),
 // the Snag
 bar:()=>({size:[256,40,0,0],anchor:[128,38],lights:[],draw({R}){R(0,0,256,8,'#6a3a22',{sh:20});R(0,0,256,2,'#9a6a42');R(0,8,256,30,'#4a2a18');for(let x=8;x<256;x+=32){R(x,12,24,22,'#3a2012');R(x+1,12,1,22,'#5a3a22')}R(0,34,256,4,'#2a1a10');
  R(40,-14,22,14,'#d8d0a0',{sh:4});R(42,-12,18,10,'#e8e0b8');for(const[x,y]of[[45,-10],[52,-8],[47,-5],[55,-11]])R(x,y,4,3,'#f4f0e0');R(41,-16,20,2,'#a8a080');
  R(204,-12,26,12,'#c8a040',{sh:4});R(206,-10,22,4,'#2a2030');R(214,-14,6,2,'#c8a040');R(120,-6,10,6,'#c0a060');R(150,-8,6,8,'#3a7a4a')}}),
 stool:()=>({size:[16,30,0,0],anchor:[8,28],lights:[],draw({R,E}){E(8,4,7,3,'#a8323e');E(8,3,5,2,'#c8524e');R(7,6,2,18,'#8a8a94');R(3,24,10,2,'#5a5a64');R(2,26,2,2,'#5a5a64');R(12,26,2,2,'#5a5a64')}}),
 jukebox:()=>({size:[32,62,0,0],anchor:[16,60],lights:[[16,24,1.4,.5]],draw({R,E}){E(16,14,15,13,'#c8402e');R(1,14,30,46,'#c8402e',{sh:8});E(16,14,11,9,'#f0c040');E(16,14,8,6,'#ff8a5a');R(5,26,22,14,'#2a2030');for(let y=28;y<38;y+=3)R(7,y,18,1,'#e8e4d8');R(5,44,22,12,'#3a3a44');for(let x=7;x<26;x+=3)R(x,46,1,8,'#c0c0c8')}}),
 pooltable:()=>({size:[96,58,0,0],anchor:[48,56],lights:[],draw({R,C}){R(0,4,96,40,'#5a3a22',{sh:12});R(4,8,88,32,'#2e6a4a');R(4,8,88,2,'#3e8a5a');for(const[x,y]of[[4,8],[48,8],[92,8],[4,40],[48,40],[92,40]])C(x,y,2.5,'#14101a');C(30,24,2.5,'#e8e4d8');C(60,20,2.5,'#d8a040');C(64,26,2.5,'#c8402e');C(70,22,3,'#e8c84a');R(6,44,6,12,'#3a2012');R(84,44,6,12,'#3a2012');R(20,30,40,1,'#d8c8a0')}}),
 coatrack:()=>({size:[24,66,0,0],anchor:[12,64],lights:[],draw({R}){R(11,6,2,56,'#3a281e');R(5,60,14,3,'#3a281e');R(4,10,16,24,'#d8b030',{sh:4});R(6,6,12,6,'#e8c040');R(2,22,8,20,'#3a4a5a',{sh:3});R(14,20,8,22,'#5a3a2a',{sh:3})}}),
 // the post office
 pocounter:()=>({size:[224,46,0,0],anchor:[112,42],lights:[],draw({R}){R(0,4,224,10,'#c8c0a8',{sh:24});R(0,4,224,2,'#e8e0c8');R(0,14,224,28,'#6a5a4a');for(let x=8;x<224;x+=28)R(x,18,20,20,'#5a4a3a');R(0,40,224,2,'#3a2a20');
  R(60,-4,24,8,'#8a8a94',{sh:4});R(62,-6,20,3,'#c0c0c8');R(140,-6,8,10,'#2e4a7a');R(144,-10,1,5,'#3a3a44');R(150,-8,1,7,'#3a3a44');R(100,-2,20,6,'#e8e4d8');R(102,0,16,1,'#8a8070')}}),
 plant:()=>({size:[24,44,0,0],anchor:[12,42],lights:[],draw({R,C}){R(5,28,14,14,'#8a5a3a',{sh:3});R(4,27,16,3,'#a86a4a');const L=K.pal().grass;C(12,16,9,shade(L,-.1));C(8,12,6,shade(L,.1));C(16,10,6,L);C(12,5,5,shade(L,.25))}}),
 chair:()=>({size:[22,40,0,0],anchor:[11,38],lights:[],draw({R}){R(3,0,16,14,'#5a5a64',{sh:3});R(3,0,16,2,'#8a8a94');R(2,16,18,5,'#6a6a74',{sh:3});R(3,21,2,17,'#3a3a44');R(17,21,2,17,'#3a3a44');R(4,12,14,6,'#4a6a8a')}}),
 // the Halvorsen house
 sofa:()=>({size:[96,40,0,0],anchor:[48,38],lights:[],draw({R}){const c='#6a7a5a';R(4,0,88,18,c,{sh:10});R(4,0,88,2,shade(c,.2));R(0,8,10,24,shade(c,-.1));R(86,8,10,24,shade(c,-.2));R(8,18,80,14,shade(c,.1),{sh:8});R(8,32,80,4,shade(c,-.35));
  const cs=['#c8402e','#e8c84a','#3e8a8a','#a86aa8','#e8e4d8'];for(let i=0;i<10;i++)for(let j=0;j<3;j++)R(30+i*5,4+j*5,5,5,cs[(i+j)%5])}}),
 tv:()=>({size:[30,40,0,0],anchor:[15,38],lights:[[15,12,1,.3]],draw({R}){R(2,22,26,16,'#6a4a32',{sh:6});R(2,22,26,2,'#8a6a4a');R(1,2,28,20,'#2a2a30',{sh:4});R(3,4,22,15,'#4a6a8a');R(3,4,22,3,'#6a8aaa');R(8,10,12,5,'#e8e4d8');R(10,8,6,3,'#c0c8d8')}}),
 sidetable:()=>({size:[26,38,0,0],anchor:[13,36],lights:[],draw({R}){R(2,10,22,4,'#6a4a32',{sh:5});R(2,10,22,1,'#8a6a4a');R(4,14,3,22,'#4a3424');R(19,14,3,22,'#4a3424');R(4,4,16,6,'#5a2a2a');R(5,5,14,1,'#e8e4d8');R(16,2,1,6,'#2a2030')}}),
 woodstove:()=>({size:[30,62,0,0],anchor:[15,60],lights:[[15,40,1.6,.55]],draw({R}){R(13,0,4,22,'#2a2a30');R(3,22,24,32,'#2a2a30',{sh:6});R(3,22,24,2,'#4a4a54');R(7,32,16,14,'#1a1418');R(8,36,14,10,'#d9772b');R(10,38,10,6,'#f0c040');R(4,54,4,6,'#1a1a20');R(22,54,4,6,'#1a1a20')}}),
 // the cannery floor
 slime:()=>({size:[160,40,0,0],anchor:[80,38],lights:[],draw({R}){R(0,0,160,10,'#9aa4ae',{sh:20});R(0,0,160,2,'#c8d0d8');R(0,10,160,4,'#6a7480');for(let x=6;x<160;x+=38){R(x,14,4,24,'#5a6470')}R(0,24,160,2,'#5a6470');for(let x=10;x<150;x+=17)R(x,3,6,2,'#7a5a4a')}}),
 belt:()=>({size:[192,36,0,0],anchor:[96,34],lights:[],draw({R,C}){R(0,4,192,10,'#2a2a30',{sh:20});for(let x=2;x<192;x+=6)R(x,5,3,8,'#3a3a44');R(0,14,192,3,'#5a5a64');for(let x=8;x<192;x+=46){R(x,17,4,17,'#5a5a64');R(x+3,17,1,17,'#3a3a44')}R(80,0,12,6,'#e8c84a');R(82,-2,4,3,'#e8c84a');for(let x=20;x<180;x+=40)C(x,9,3,'#8a8a94')}}),
 cans:()=>({size:[64,50,0,0],anchor:[32,48],lights:[],draw({R}){for(let row=0;row<5;row++)for(let i=0;i<7-row%2;i++){const x=3+i*8+(row%2)*4,y=40-row*8;R(x,y,7,8,'#b8bcc4');R(x,y,7,1,'#e0e4ec');R(x+5,y,2,8,'#8a8e96')}}}),
 brine:()=>({size:[64,40,0,0],anchor:[32,38],lights:[],draw({R}){R(0,6,64,32,'#7a8a94',{sh:12});R(0,6,64,3,'#a8b4bc');R(4,9,56,8,'#2e4a5a');R(4,9,56,2,'#5a7a8a');R(6,12,10,1,'#c8dce8');R(30,13,14,1,'#c8dce8');R(2,30,60,3,'#5a6a74');R(26,20,12,6,'#e8e4d8');R(28,22,8,1,'#a8323e')}}),
 pallet:()=>({size:[64,44,0,0],anchor:[32,42],lights:[],draw({R}){R(0,34,64,8,'#8a6a40',{sh:10});for(let x=2;x<64;x+=12)R(x,36,6,6,'#5a4024');for(let i=0;i<3;i++){R(4+i*20,14,18,20,'#a88a5a',{sh:5});R(4+i*20,14,18,2,'#c8aa7a');R(8+i*20,20,10,5,'#e8e4d8');R(9+i*20,22,8,1,'#a8323e')}R(14,0,18,14,'#a88a5a',{sh:5});R(14,0,18,2,'#c8aa7a')}}),
 crabpot:()=>({size:[30,26,0,0],anchor:[15,24],lights:[],draw({R}){R(1,4,28,20,'#5a6a6a',{sh:6});for(let x=3;x<28;x+=4)R(x,4,1,20,'#8a9a9a');for(let y=8;y<24;y+=5)R(1,y,28,1,'#8a9a9a');R(1,4,28,2,'#2a3a3a');R(10,0,10,4,'#e8a040');R(18,10,6,6,'#d86a2a')}}),
 bollard:()=>({size:[16,24,0,0],anchor:[8,22],lights:[],draw({R,E}){R(3,6,10,16,'#2a2a30',{sh:3});E(8,6,6,3,'#3a3a44');E(8,5,4,2,'#5a5a64');R(2,12,12,2,'#c8b890')}}),
 piling:()=>({size:[16,48,0,0],anchor:[8,46],lights:[],draw({R,E}){R(4,4,8,42,'#4a3424',{sh:3});E(8,4,4,2,'#6a4a32');R(4,30,8,2,'#2a3a2a');R(4,38,8,8,'#2a3430');R(4,34,8,2,'#c8b890')}}),
 gull:()=>({size:[18,14,0,0],anchor:[9,12],lights:[],draw({R}){R(4,4,10,6,'#e8e4d8',{sh:3});R(12,2,4,4,'#e8e4d8');R(15,4,2,1,'#e8c040');R(2,5,6,3,'#9aa0a6');R(6,10,1,3,'#e8a040');R(10,10,1,3,'#e8a040')}}),
 hanglamp:()=>({size:[20,24,0,0],anchor:[10,22],lights:[[10,16,3.4,.5]],draw({R,E}){R(9,0,2,10,'#3a3834');E(10,14,9,5,'#5a6a5a');R(1,14,18,2,'#3a4a3a');E(10,17,4,2,'#fff2c8')}})
};
const PROPK=new Set(['lamp','pierlamp','bench','car','van','flag','shelter','barrel','trash','planter','cot','hotplate','crate','books','lamp_in','bar','backbar','jukebox','stool','pooltable','coatrack','neon',
 'pocounter','poboxes','stampposter','plant','chairs','sofa','tv','sidetable','woodstove','catbasket','rug','slime','belt','cans','brine','pallet','piling','bollard','crabpot','office','retort','drain','hanglamp','studywall','window','mirror','floorboard']);
const NOSHADOW=new Set(['backbar','neon','poboxes','stampposter','catbasket','rug','office','retort','drain','hanglamp','studywall','window','mirror','floorboard','stool','flag']);
function props(M){
 const out=[];
 const add=(a,fx,fy,p,o={})=>{const X=Math.round(fx-a.ax),Y=Math.round(fy-a.ay);
  out.push(Object.assign({tx:p.x,ty:p.y,x:fx,y:fy,top:Y,draw:(c,ox,oy)=>c.drawImage(a.c,X+ox,Y+oy),
   lights:(a.lights||[]).map(([lx,ly,r,al])=>[X+a.sx(lx),Y+a.sy(ly),r*T,al,!!o.pool])},o.extra||{}))};
 const dyn=(p,fx,fy,top,draw,o={})=>out.push(Object.assign({tx:p.x,ty:p.y,x:fx,y:fy,top,draw,lights:o.lights||[]},o.extra||{}));
 for(const p of M.pieces){if(!PROPK.has(p.k))continue;const cx=(p.x+p.w/2)*T,fy=(p.y+p.h)*T-2;
  switch(p.k){
  case'lamp':add(get('lamp',()=>K.LAMP),cx,fy+1,p,{pool:true});out[out.length-1].lights.push([cx,fy-2,1.8*T,.4,true]);break;
  case'pierlamp':add(get('pierlamp',SPEC.pierlamp),cx,fy+1,p,{pool:true});break;
  case'bench':add(get('bench',SPEC.bench),cx,fy,p);break;
  case'car':add(get('car'+p.tint,()=>K.sedan('side',p.tint||'cloth')),cx,fy,p);break;
  case'van':add(get('van',()=>K.van('side','#e8e4dc')),cx,fy+2,p);break;
  case'flag':add(get('flag',SPEC.flag),cx-4,fy,p);break;
  case'shelter':add(get('shelter',SPEC.shelter),cx,fy,p);break;
  case'barrel':add(get('barrel',SPEC.barrel),cx,fy,p);break;
  case'trash':add(get('trash',SPEC.trash),cx,fy,p);break;
  case'planter':add(get('planter',SPEC.planter),cx,fy,p);break;
  case'cot':add(get('cot',SPEC.cot),cx,fy,p);break;
  case'hotplate':add(get('hotplate',SPEC.hotplate),cx,fy,p);break;
  case'crate':add(get('crate',SPEC.crate),cx,fy,p);break;
  case'books':add(get('books',SPEC.books),cx,fy,p);break;
  case'lamp_in':add(get('lampin',SPEC.lamp_in),cx,fy,p,{pool:true});break;
  case'bar':add(get('bar',SPEC.bar),cx,fy+6,p);break;
  case'stool':add(get('stool',SPEC.stool),cx,fy+4,p);break;
  case'jukebox':add(get('juke',SPEC.jukebox),cx,fy,p,{extra:{juke:1}});break;
  case'pooltable':add(get('pool',SPEC.pooltable),cx,fy,p);break;
  case'coatrack':add(get('rack',SPEC.coatrack),cx,fy,p);break;
  case'pocounter':add(get('poc',SPEC.pocounter),cx,fy+4,p);break;
  case'plant':add(get('plant',SPEC.plant),cx,fy,p);break;
  case'chairs':{const a=get('chair',SPEC.chair);add(a,cx-8,fy,p);add(a,cx+8,fy,p);break}
  case'sofa':add(get('sofa',SPEC.sofa),cx,fy,p);break;
  case'tv':add(get('tv',SPEC.tv),cx,fy,p,{extra:{tv:1}});break;
  case'sidetable':add(get('side',SPEC.sidetable),cx,fy,p);break;
  case'woodstove':add(get('stove',SPEC.woodstove),cx,fy,p,{pool:true,extra:{fire:[cx,fy-12]}});break;
  case'slime':add(get('slime',SPEC.slime),cx,fy,p);break;
  case'crabpot':add(get('crabpot',SPEC.crabpot),cx,fy,p);break;
  case'bollard':add(get('bollard',SPEC.bollard),cx,fy,p);break;
  case'pallet':add(get('pallet',SPEC.pallet),cx,fy,p);break;
  case'piling':{add(get('piling',SPEC.piling),cx,fy+4,p);if(p.gull){const a=get('gull',SPEC.gull),X=Math.round(cx-a.ax),Y0=Math.round(fy+4-23-a.ay);dyn(p,cx,fy+5,Y0,(c,ox,oy)=>{const b=Math.floor(performance.now()/700+p.x)%5===0?1:0;c.drawImage(a.c,X+ox,Y0-b+oy)})}break}
  case'belt':add(get('belt',SPEC.belt),cx,fy,p);break;
  case'cans':add(get('cans',SPEC.cans),cx,fy,p);break;
  case'brine':add(get('brine',SPEC.brine),cx,fy,p);break;
  case'hanglamp':{const a=get('hang',SPEC.hanglamp);dyn(p,cx,9999,0,(c,ox,oy)=>{const sw=Math.round(Math.sin(performance.now()/900)*1.5);F(c,cx+ox,oy,1,p.y*T+4,'#3a3834');c.drawImage(a.c,Math.round(cx-a.ax+sw)+ox,Math.round(p.y*T+14-a.ay)+oy)},{lights:[[cx,p.y*T+12,3.6*T,.55,true]]});break}
  // flat pieces on the floor (no shadow, under everyone)
  case'catbasket':dyn(p,cx,-1,0,(c,ox,oy)=>{const x=p.x*T+1+ox,y=p.y*T+5+oy;c.fillStyle='#8a6a3a';c.beginPath();c.ellipse(x+7,y+5,8,5,0,0,6.283);c.fill();c.fillStyle='#c8402e';c.beginPath();c.ellipse(x+7,y+5,5,3,0,0,6.283);c.fill()});break;
  case'rug':dyn(p,cx,-1,0,(c,ox,oy)=>{const x=p.x*T+ox,y=p.y*T+3+oy;F(c,x,y,p.w*T,10,'#8a3a3a');F(c,x+2,y+2,p.w*T-4,6,'#c8a060');F(c,x+4,y+4,p.w*T-8,2,'#8a3a3a')});break;
  case'drain':dyn(p,cx,-1,0,(c,ox,oy)=>{const x=p.x*T+3+ox,y=p.y*T+4+oy;F(c,x,y,10,8,'#1a1418');for(let i=0;i<5;i++)F(c,x+1+i*2,y+1,1,6,'#4a4a54')});break;
  case'floorboard':dyn(p,cx,-1,0,(c,ox,oy)=>{const x=p.x*T+ox,y=p.y*T+oy;F(c,x+1,y+6,T-2,1,'#2a1a10');F(c,x+1,y+11,T-2,1,'#2a1a10');F(c,x+1,y+7,T-2,1,'#a8885a')});break;
  // wall fittings, drawn flat on the back wall (no shadow, behind everyone)
  case'backbar':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+ox,y=oy;F(c,x,y+.6*T,p.w*T,4,'#3a2012');F(c,x,y+1.5*T,p.w*T,4,'#3a2012');
   for(let i=0;i<p.w*4;i++){const bx=x+4+i*4+(i%3),cs=['#3a7a4a','#8a5a2a','#c8a040','#5a2a3a','#e8e4d8'][i%5];for(const sy of[.6*T-9,1.5*T-9])F(c,bx,y+sy+(i%2),3,9-(i%2),cs)}F(c,x+3*T,y+2.2*T,2*T,.6*T,'#c8b890');K.signText(c,'NO CREDIT',x+3*T+4,y+2.2*T+2,'#2a2030')});break;
  case'neon':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+4+ox,y=.6*T+oy,on=Math.floor(performance.now()/1300)%7!==0;F(c,x,y,40,16,'#1a1c22');c.globalAlpha=on?1:.35;K.signText(c,'TIDE ALE',x+4,y+3,'#ff5a6a');K.signText(c,'ON TAP',x+8,y+9,'#5ae0d0');c.globalAlpha=1},{lights:[[cx,.8*T,1.6*T,.3,false]]});break;
  case'poboxes':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+3+ox,y=.25*T+oy;F(c,x,y,58,40,'#5a4a3a');for(let j=0;j<4;j++)for(let i=0;i<6;i++){const bx=x+2+i*9,by=y+2+j*9.5;F(c,bx,by,8,8,'#c8a040');F(c,bx,by,8,1,'#e8c870');F(c,bx+2,by+2,4,3,'#3a3020');F(c,bx+5,by+6,2,1,'#5a4a3a');if(i===3&&j===2)F(c,bx+2,by+2,4,3,'#f4efe6')}});break;
  case'stampposter':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+4+ox,y=.4*T+oy;F(c,x,y,24,30,'#e8e4d8');F(c,x,y,24,4,'#2e4a7a');for(let i=0;i<6;i++){const sx=x+2+(i%3)*7,sy=y+7+((i/3)|0)*11;F(c,sx,sy,6,9,'#f4efe6');F(c,sx+2,sy+2,2,6,'#a8323e');F(c,sx+1,sy+1,4,1,'#e8c84a')}});break;
  case'office':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+2+ox,y=.2*T+oy;F(c,x,y,p.w*T-4,2.6*T,'#3a3034');F(c,x+2,y+2,p.w*T-8,1.4*T,'#2a3a4a');F(c,x+2,y+2,p.w*T-8,4,'#4a5a6a');F(c,x+(p.w*T-4)/2,y+2,1,1.4*T,'#3a3034');F(c,x+6,y+1.2*T,18,6,'#e8e4d8');K.signText(c,'OFFICE',x+8,y+1.7*T+4,'#c8b890')});break;
  case'retort':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+ox,y=oy,now=performance.now();F(c,x,y,p.w*T,3*T,'#2a2226');F(c,x+T-2,y+.4*T,2*T+4,2.6*T,'#4a5258');F(c,x+T,y+.4*T+2,2*T,2.6*T-2,'#6a747c');F(c,x+2*T-1,y+.4*T+2,2,2.6*T-2,'#3a4248');
   for(const hx of[x+T+6,x+3*T-10])F(c,hx,y+1.5*T,4,8,'#9aa4ae');F(c,x+T+4,y+.6*T,2*T-8,7,'#e8c84a');K.signText(c,'RETORT',x+T+8,y+.6*T+1,'#2a2030');
   const k=(now%2400)/2400;c.fillStyle=`rgba(120,150,150,${(.35-.2*k).toFixed(2)})`;c.beginPath();c.ellipse(x+2*T,y+3*T+2,12+k*14,2+k*2,0,0,6.283);c.fill()});break;
  case'studywall':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+2+ox,y=.25*T+oy;F(c,x,y,p.w*T-4,2.4*T,'#9a6a3a');F(c,x+1,y+1,p.w*T-6,2.4*T-2,'#b08050');
   for(let i=0;i<14;i++){const px=x+4+(i*13)%(p.w*T-16),py=y+3+((i*7)%4)*8;F(c,px,py,8,9,i%4===0?'#c8d0d8':'#e8e4d8');F(c,px+1,py+2,6,1,'#8a8070');F(c,px+1,py+4,5,1,'#8a8070');if(i%3===0){F(c,px+5,py+1,2,2,'#a8323e')}}
   c.strokeStyle='#c8402e';c.lineWidth=1;c.beginPath();c.moveTo(x+10,y+6);c.lineTo(x+40,y+20);c.lineTo(x+64,y+8);c.moveTo(x+40,y+20);c.lineTo(x+22,y+30);c.moveTo(x+64,y+8);c.lineTo(x+72,y+30);c.stroke()});break;
  case'window':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+4+ox,y=.4*T+oy,W_=p.w*T-8,H_=1.9*T,N=isNight(M);F(c,x-2,y-2,W_+4,H_+4,'#3a281e');F(c,x,y,W_,H_,N?'#141a26':'#7a8a9a');F(c,x,y+H_*.6,W_,H_*.4,N?'#1a2430':'#5a6a6a');
   if(N)for(let i=0;i<6;i++)F(c,x+4+i*6,y+H_*.55,2,1,i%2?'#fff2c8':'#ff9a5a');F(c,x+W_/2-1,y,2,H_,'#3a281e');F(c,x,y+H_/2,W_,2,'#3a281e');F(c,x-3,y+H_+2,W_+6,3,'#5a4030');
   const t=performance.now();for(let i=0;i<8;i++){const rx=x+2+((i*11)%(W_-4)),ry=y+((t/12+i*37)%H_);F(c,rx,ry,1,3,'rgba(220,235,250,.55)')}},{lights:[[cx,1.2*T,1.6*T,isNight(M)?.12:.3,false]]});break;
  case'mirror':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+2+ox,y=.5*T+oy;F(c,x,y,12,16,'#8a8a94');F(c,x+1,y+1,10,14,'#a8b8c4');F(c,x+1,y+1,10,4,'#c8d8e4');F(c,x+2,y+6,3,1,'#e8f0f8');F(c,x-1,y+18,14,4,'#e8e4dc');F(c,x+5,y+17,2,2,'#c0c0c8')});break;
  }}
 return out}

// ================= LIGHT AND AIR =================
// Rain on every outdoor map, day and night: thin slanted streaks falling, and splashes ticking on the ground. By day a
// gray February sky sits over it; at night the lantern's pool goes warm (the approved night mockup) and the streaks
// catch the lamps. Indoors: the woodstove's fire, the TV, the jukebox's lights.
const OUTDOOR=new Set(['town']);
const DROPS=Array.from({length:90},(_,i)=>({x:hsh(i,1,511),y:hsh(i,2,511),v:.8+hsh(i,3,511)*.5,l:3+((hsh(i,4,511)*4)|0)}));
function rain(ctx,o,night){const vw=ctx.canvas.width,vh=ctx.canvas.height,t=o.now/1000;
 ctx.fillStyle=night?'rgba(160,180,200,.32)':'rgba(220,232,244,.4)';
 for(const d of DROPS){const y=((d.y*vh+t*260*d.v)%(vh+10))-6,x=((d.x*vw-t*40*d.v-y*.18)%vw+vw)%vw;for(let k=0;k<d.l;k++)ctx.fillRect(Math.round(x-k*.25),Math.round(y+k),1,1)}
 for(let i=0;i<14;i++){const ph=(t*1.7+hsh(i,5,511))%1;if(ph>.25)continue;const x=Math.round(hsh(i,Math.floor(t*1.7+hsh(i,5,511)),512)*vw),y=Math.round(hsh(i,Math.floor(t*1.7+hsh(i,5,511)),513)*vh);
  ctx.fillStyle=night?'rgba(180,200,220,.35)':'rgba(230,240,250,.5)';ctx.fillRect(x-2,y,1,1);ctx.fillRect(x+2,y,1,1);ctx.fillRect(x-1,y-1,3,1)}}
function fx(ctx,o){const M=o.M,N=o.night;
 // at night the lamps and the far bridge's lights lie on the river in broken warm streaks that shimmer
 if(M.id==='town'&&N){const t=o.now/1000;for(let i=0;i<26;i++){const wx=hsh(i,1,514)*M.w*T,wy=(16.3+hsh(i,2,514)*7.4)*T;if(wx>27*T&&wx<32*T)continue;const k=Math.sin(t*2+i*1.7);if(k<-.3)continue;
  ctx.fillStyle=`rgba(255,${190+(i%3)*20},120,${(.18+.18*k).toFixed(2)})`;ctx.fillRect(Math.round(wx-o.camx+Math.sin(t+i)*2),Math.round(wy-o.camy),3+(i%4),1)}}
 if(OUTDOOR.has(M.id)){if(!N){ctx.fillStyle='rgba(70,86,104,.16)';ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height)}rain(ctx,o,N)}
 (M.props||[]).forEach(p=>{const x=p.x-o.camx,y=p.y-o.camy;
  if(p.fire){const f=.5+.5*Math.sin(o.now/90)*Math.sin(o.now/37);ctx.fillStyle=`rgba(255,190,80,${(.25+.25*f).toFixed(2)})`;ctx.fillRect(Math.round(p.fire[0]-o.camx-6),Math.round(p.fire[1]-o.camy-6),12,5)}
  if(p.tv&&Math.floor(o.now/700)%3===0){ctx.fillStyle='rgba(200,220,255,.18)';ctx.fillRect(Math.round(x-10),Math.round(y-36),20,16)}
  if(p.juke){const k=Math.floor(o.now/260)%4;ctx.fillStyle=['#ff5a6a','#5ae0d0','#f0c040','#ff8a5a'][k];ctx.fillRect(Math.round(x-6+k*3),Math.round(y-50),2,2)}});
 if(M.id==='cannery'){for(let i=0;i<5;i++){const x=(2+i*4)*T+8-o.camx,ph=((o.now/1000)*(.6+i*.13)+i*.37)%1,y=3*T+ph*(7*T)-o.camy;ctx.fillStyle='rgba(190,210,230,.55)';ctx.fillRect(Math.round(x),Math.round(y),1,3)}}
 if(N){const lx=G.px+8-o.camx,ly=G.py+6-o.camy,lr=58*(M.lanternK||1);ctx.globalCompositeOperation='multiply';let gr=ctx.createRadialGradient(lx,ly,0,lx,ly,lr);
  gr.addColorStop(0,'rgba(240,196,120,.7)');gr.addColorStop(1,'rgba(240,196,120,0)');ctx.fillStyle=gr;ctx.fillRect(lx-lr,ly-lr,lr*2,lr*2);
  ctx.globalCompositeOperation='lighter';gr=ctx.createRadialGradient(lx,ly,0,lx,ly,lr*.5);gr.addColorStop(0,'rgba(214,164,58,.14)');gr.addColorStop(1,'rgba(214,164,58,0)');ctx.fillStyle=gr;ctx.fillRect(lx-lr,ly-lr,lr*2,lr*2);
  ctx.globalCompositeOperation='source-over'}}
// the hidden hotspot, while the lead is High on Mushrooms: the mirror fogs and clears, and something moves in it late
function mirrorGlint(c,x,y,now){const a=.25+.2*Math.sin(now/600);c.fillStyle=`rgba(220,235,250,${a.toFixed(2)})`;c.fillRect(x-5,y-6,10,13);
 const k=(now%3000)/3000;c.fillStyle=`rgba(40,30,50,${(.5*Math.sin(k*Math.PI)).toFixed(2)})`;c.fillRect(Math.round(x-2+Math.sin(now/800)*2),y-4,4,8);
 c.fillStyle=`rgba(243,237,226,${(a+.15).toFixed(2)})`;c.fillRect(x-7,y-8,14,1);c.fillRect(x-7,y+8,14,1);c.fillRect(x-7,y-8,1,17);c.fillRect(x+6,y-8,1,17)}

// ================= TOWNSFOLK ON THE MAP =================
// The Shared Shelf's person template (shared-sprites-person-v1, method v1), at the agents' size; hair from agent-sprite.js.
// About 1 in 3 has a weird trait (Art, Townsfolk): Mrs. Halvorsen's cat on her shoulder, Hap's sou'wester indoors, the dog's boots.
const {SKIN}=window.BL;
const FOLK={
 teague:{look:{skin:1,hair:0,hairC:5,acc:3},top:A.oil,coat:1,inner:'#5a5a64',pants:'#2a2a34',shoes:'#2a1e18',iris:'#5a6a7a',mouth:'flat',
  body:(A_,ty)=>{const{R}=A_;R(6,ty+2,4,14,shade(A.oil,.18));R(13,ty,2,6,'#e8e4d8');R(20,ty+10,2,3,'#c8a040')}},
 inga:{look:{skin:0,hair:4,hairC:6,acc:1},top:'#8a5a8a',pants:'#4a3a46',shoes:'#3a2418',iris:'#4a7a9a',mouth:'smile',cheeks:1,cat:1,
  body:(A_,ty)=>{const{R}=A_;for(let y=ty+2;y<ty+16;y+=3)R(8,y,12,1,shade('#8a5a8a',-.2));R(13,ty,2,16,'#e8e4d8')}},
 ray:{look:{skin:1,hair:3,hairC:5,acc:1},top:'#8aa8c8',pants:'#2e3a5a',shoes:'#1a1418',iris:'#3a2418',mouth:'flat',
  body:(A_,ty)=>{const{R}=A_;R(13,ty,2,10,'#2e3a5a');R(7,ty+3,5,3,'#2e4a7a');R(8,ty+4,3,1,'#e8e4d8')}},
 mo:{look:{skin:3,hair:0,hairC:0,acc:0},top:'#2a2a30',pants:'#3a4a6a',shoes:'#1a1418',iris:'#2a1a14',mouth:'flat',
  body:(A_,ty)=>{const{R}=A_;R(6,ty+6,3,6,'#3a6a8a');R(19,ty+6,3,6,'#3a6a8a');R(8,ty+12,12,4,'#e8e4d8')}},
 hap:{look:{skin:0,hair:2,hairC:6,acc:3},top:'#d8b030',coat:1,inner:'#5a4a3a',pants:'#3a3a44',shoes:'#2a2a30',iris:'#5a7a9a',mouth:'smile',cap:'#e8c040',souwester:1,
  body:(A_,ty)=>{const{R}=A_;R(13,ty,2,20,shade('#d8b030',-.3));for(const y of[4,9,14])R(15,ty+y,2,2,'#2a2a30')}},
 walker:{look:{skin:2,hair:1,hairC:1,acc:0},top:'#b8302e',coat:1,inner:'#b8302e',pants:'#2a3446',shoes:'#e8e4d8',iris:'#3a2418',mouth:'flat',hood:'#b8302e',
  body:(A_,ty)=>{const{R}=A_;R(6,ty+2,16,1,shade('#b8302e',.2))}},
 fisher:{look:{skin:4,hair:2,hairC:0,acc:3},top:'#d86a2a',coat:1,inner:'#d86a2a',pants:'#d86a2a',shoes:'#2a2a30',iris:'#2a1a14',mouth:'flat',cap:'#2a3446',
  body:(A_,ty)=>{const{R}=A_;R(8,ty,3,16,'#2a2a30');R(17,ty,3,16,'#2a2a30')}}
};
// what the template lacks: a cap, Hap's sou'wester, the walker's hood, Mrs. Halvorsen's cat on her shoulder
function topper(Ad,F_,dir){const{R,C}=Ad;
 if(F_.cap&&!F_.souwester){const c=F_.cap,cd=shade(c,-.3);if(dir==='up'){R(5,0,18,7,c,{sh:3})}else if(dir==='side'){R(6,-1,17,7,c,{sh:3});R(0,5,8,2,cd)}else{R(5,-1,18,7,c,{sh:3});R(5,-1,18,1,shade(c,.25));R(5,6,18,2,cd)}}
 if(F_.souwester){const c=F_.cap,cd=shade(c,-.3);if(dir==='side'){R(6,-3,16,8,c,{sh:3});R(2,4,24,3,c);R(16,6,8,5,cd)}else{R(6,-3,16,8,c,{sh:3});R(6,-3,16,1,shade(c,.25));R(1,4,26,3,c);R(1,6,26,1,cd);if(dir==='up')R(4,6,20,6,cd)}}
 if(F_.hood){const c=F_.hood,cd=shade(c,-.3);if(dir==='side'){R(5,-1,19,9,c,{sh:3});R(17,7,7,12,cd)}else if(dir==='up'){R(4,-1,20,20,c,{sh:4})}else{R(4,-1,20,6,c,{sh:3});R(3,4,3,16,c);R(22,4,3,16,cd)}}
 if(F_.cat){const c='#4a4a50',cl='#7a7a84';const x=dir==='side'?14:dir==='up'?2:17;R(x,16,10,6,c,{sh:2});R(x+1,14,4,4,c);R(x+1,12,1,2,c);R(x+4,12,1,2,c);if(dir!=='up'){R(x+2,15,1,1,'#e8c84a');R(x+4,15,1,1,'#e8c84a')}R(x+9,14,2,9,cl)}}
// the walker's dog, in four little rubber boots
function dog(dir){const v=art(30,24,2,2,S,({R,E,C})=>{const fur='#8a6a4a',boot='#e8c040';
 if(dir==='up'){E(13,13,8,6,fur);C(13,6,4,fur);R(9,1,2,4,fur);R(15,1,2,4,fur);R(8,17,3,5,boot);R(16,17,3,5,boot);return}
 if(dir==='side'){E(14,13,10,5,fur);R(6,16,3,6,boot);R(19,16,3,6,boot);R(23,10,5,2,fur);C(6,8,5,fur);R(1,9,3,2,fur);R(4,2,2,4,shade(fur,-.3));R(3,7,2,2,'#14101a');R(1,10,1,1,'#14101a');return}
 E(13,14,8,6,fur);R(8,17,3,5,boot);R(15,17,3,5,boot);C(13,8,5,fur);R(7,2,3,5,shade(fur,-.3));R(16,2,3,5,shade(fur,-.3));R(10,7,2,2,'#14101a');R(14,7,2,2,'#14101a');R(10,7,1,1,'#ffffff');R(14,7,1,1,'#ffffff');R(12,11,2,1,'#14101a')});
 v.ax=v.sx(13);v.ay=v.sy(22);return v}
// the bull on the dock (part B): a sea lion hauled out on the pier, head up, looking at you and not blinking
function bull(){const v=art(46,30,2,2,S,({R,E,C})=>{const b='#7a5a3a',bd=shade(b,-.3);
 E(20,22,18,6,bd);E(19,21,17,5,b);R(2,24,6,3,bd);E(34,14,7,9,bd);E(33,13,6,8,b);E(37,7,6,5,b);E(42,9,3,2,shade(b,.1));
 R(33,5,3,3,'#f4efe6');R(39,5,3,3,'#f4efe6');R(34,6,1,1,'#14101a');R(40,6,1,1,'#14101a');R(44,9,1,1,'#14101a');R(28,26,5,2,bd);R(36,26,5,2,bd)});
 v.ax=v.sx(22);v.ay=v.sy(28);return v}
const fcache=new Map();
function folk(id,dir,idle=0,M){
 const k=id+dir+idle;let v=fcache.get(k);if(v)return v;
 if(dir==='right'){const l=folk(id,'left',idle,M),c=K.mk(l.c.width,l.c.height),g=c.getContext('2d');g.translate(c.width,0);g.scale(-1,1);g.drawImage(l.c,0,0);v={c,ax:c.width-l.ax,ay:l.ay}}
 else if(id==='dog'){const d=dog(dir==='left'?'side':dir);v={c:d.c,ax:d.ax,ay:d.ay}}
 else if(id==='bull'){const d=bull();v={c:d.c,ax:d.ax,ay:d.ay}}
 else{const F_=FOLK[id]||FOLK.ray,d=dir==='left'?'side':dir,L=F_.look,sk=SKIN[L.skin];
  const sp=Object.assign({skin:sk,hair:sk,hairStyle:'cropped',iris:F_.iris||'#3a2418'},F_);
  const a=art(40,90,6,30,F_.s||S,Ad=>{K.drawChar(Ad,sp,d,0,idle);BLA.extras(Ad,{look:L},dir,0);topper(Ad,F_,d)});
  v={c:a.c,ax:a.sx(14),ay:a.sy(50)}}
 fcache.set(k,v);return v;
}

// ================= PORTRAITS (64 x 64, Storybook faces, Lantern Bust box) =================
// The Asset Library's portrait kit (as in the other cases): drawn pixel by pixel in a layer, then a light rim on the
// lit edges and a dark outline. Each sits on a lit backing (Quality bar, Rim and backing).
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
const shirtV=(L,c,y=50)=>{for(let j=0;j<12;j++){const w=Math.max(1,6-(j>>1));L.r(32-w,y+j,w*2,1,c)}};
// rain beaded on someone who just came in from it
const drops=(L,seed)=>{for(let i=0;i<7;i++){const x=12+((i*17+seed)%40),y=8+((i*11+seed)%24);if(L.g(x,y))L.p(x,y,'#d8e8f4')}};

const PORT={
// Abel Teague (SEXTON): fifties, gray stubble going white, wet gray hair flat to his head, an oilskin coat's collar up,
// pale gray eyes that look a little past you, too polite
TEAGUE:{bg:'#2a3038',f(L,t){const s='#e0b088',hc='#9aa0a6',u=A.oil;
 body(L,u);L.r(18,46,8,18,sh(u,-26));L.r(38,46,8,18,sh(u,-26));L.r(26,48,12,16,'#5a5a64');L.r(30,48,4,10,'#e8e4d8');L.r(27,44,10,6,sh(s,-28));for(let y=50;y<64;y+=5)L.rm(0,y,64,1,sh(u,18));
 ears(L,s);head(L,32,32,15,15,s);L.e(31,19,14,5,hc);L.r(17,20,3,10,hc);L.r(44,20,3,9,sh(hc,-20));for(let x=20;x<44;x+=3)L.r(x,22,1,3,sh(hc,-24));
 L.e(32,43,12,6,sh(s,-12));L.tex(sh(s,-12),'#b8b8b8',3);
 eye(L,21,28,'#8a9aa8',-1);eye(L,37,28,'#8a9aa8',1);L.r(22,29,1,1,WH);L.r(38,29,1,1,WH);L.r(21,35,6,1,sh(s,-30));L.r(37,35,6,1,sh(s,-30));
 brows(L,sh(hc,-30),25);nose(L,s,35);drops(L,3);
 if(t)mouth(L,32,41,7,true);else{L.r(28,42,8,1,MR)}}},
// Mrs. Inga Halvorsen: seventies, white hair in a bun with a pencil through it, round glasses, a plum cardigan, and
// Pastor the cat on her shoulder (her weird trait)
'MRS. HALVORSEN':{bg:'#3a2a38',f(L,t){const s='#f2cfae',hc='#ece8de',u='#8a5a8a';
 body(L,u);for(let y=50;y<64;y+=3)L.rm(10,y,44,1,sh(u,-20));L.r(28,46,8,18,'#e8e4d8');L.r(27,44,10,6,sh(s,-30));
 L.e(50,46,10,7,'#4a4a50');L.e(54,38,7,6,'#4a4a50');L.r(49,30,3,5,'#4a4a50');L.r(56,30,3,5,'#4a4a50');L.r(51,37,2,2,'#e8c84a');L.r(56,37,2,2,'#e8c84a');L.p(54,41,'#e8a0a0');L.r(58,50,4,12,'#5a5a60');
 L.e(32,11,7,6,sh(hc,-10));L.r(38,6,2,10,'#d8a040');L.r(38,5,2,2,'#e8a0a0');
 ears(L,s);head(L,32,32,14,15,s);L.e(31,20,14,6,hc);L.r(18,20,3,8,hc);L.r(43,20,3,8,sh(hc,-20));
 for(const x of[20,36]){L.r(x,27,9,9,'#6a5a4a');L.r(x+1,28,7,7,'#e6eef4')}L.r(29,30,6,1,'#6a5a4a');eye(L,21,28,'#4a7a9a',-1);eye(L,37,28,'#4a7a9a',1);
 brows(L,sh(hc,-34),24,-1);L.r(19,38,4,2,'#e8857a');L.r(41,38,4,2,'#e8857a');nose(L,s);
 if(t)mouth(L,32,42,7,true);else{L.r(28,43,8,1,MR);L.p(27,42,MR);L.p(36,42,MR)}}},
// Ray Pulkkinen: postmaster, sixties, bald with a gray fringe, wire glasses, a pale blue postal shirt and a navy tie, strict
RAY:{bg:'#26304a',f(L,t){const s='#ecc09a',hc='#9aa0a6',u='#8aa8c8';
 body(L,u);shirtV(L,'#e8e4d8',46);L.r(30,48,4,16,'#2e3a5a');L.r(29,47,6,3,'#2e3a5a');L.r(40,52,8,4,'#2e4a7a');L.r(41,53,6,1,'#e8e4d8');L.r(27,44,10,4,sh(s,-30));
 ears(L,s);head(L,32,31,15,16,s);L.e(27,19,7,3,sh(s,20));L.r(17,26,3,8,hc);L.r(44,26,3,8,sh(hc,-20));
 for(const x of[20,36]){L.r(x,27,9,1,'#c0c0c8');L.r(x,34,9,1,'#c0c0c8');L.r(x,27,1,8,'#c0c0c8');L.r(x+8,27,1,8,'#c0c0c8')}L.r(29,29,6,1,'#c0c0c8');
 eye(L,21,28,'#3a2418',-1);eye(L,37,28,'#3a2418',1);brows(L,hc,25,1);nose(L,s,35);L.r(26,39,12,1,sh(s,-24));
 if(t)mouth(L,32,41,7,true);else L.r(28,42,8,1,MR)}},
// Mo Duarte: bartender, forties, ex-Coast Guard, buzzed hair, a black tee and knot tattoos on her forearms, a bar towel
// on her shoulder, flat and steady
MO:{bg:'#2a2430',f(L,t){const s='#a26a43',hc='#1b1414',u='#2a2a30';
 body(L,u);L.r(27,44,10,6,sh(s,-28));L.r(10,50,12,8,'#e8e4d8');for(let x=11;x<22;x+=3)L.r(x,51,1,6,'#a8a498');L.r(4,56,8,8,s);L.r(5,58,6,1,'#3a6a8a');L.r(6,60,4,1,'#3a6a8a');L.p(8,57,'#3a6a8a');
 ears(L,s);head(L,32,32,14,15,s);L.e(31,19,14,5,hc);L.tex(hc,'#3a2a2a',3);L.r(17,22,2,5,hc);L.r(45,22,2,5,hc);
 L.e(47,38,1,2,'#c0c0c8');L.e(17,38,1,2,'#c0c0c8');
 eye(L,21,28,'#2a1a14',-1);eye(L,37,28,'#2a1a14',1);L.r(20,27,7,1,D);L.r(37,27,7,1,D);brows(L,hc,25,0);nose(L,s);
 if(t)mouth(L,32,41,7,true);else L.r(28,42,8,1,MR)}},
// Hap Lindgren: an old gillnetter, eighties, a yellow sou'wester he wears indoors (his weird trait), a white beard, red
// cheeks, rheumy blue eyes, an oilskin buttoned to the throat
HAP:{bg:'#2e2a24',f(L,t){const s='#f0b898',b='#ece8de',u='#d8b030',hat='#e8c040';
 body(L,u);L.r(31,46,2,18,sh(u,-34));for(const y of[50,56,62])L.r(34,y,2,2,'#2a2a30');for(let x=6;x<60;x+=9)L.rm(x,50,1,14,sh(u,22));
 ears(L,s,34);head(L,32,33,15,15,s);L.e(32,44,14,9,b);L.e(32,47,10,6,sh(b,-18));L.r(25,39,14,2,b);
 L.e(32,17,16,8,sh(hat,-30));L.e(31,16,15,7,hat);L.e(32,25,26,4,sh(hat,-20));L.e(31,24,25,3,hat);L.r(8,26,48,2,sh(hat,-40));L.r(24,12,10,2,sh(hat,30));
 eye(L,21,30,'#6a8ab0',-1);eye(L,37,30,'#6a8ab0',1);L.r(21,36,6,1,'#e8a0a0');L.r(37,36,6,1,'#e8a0a0');L.r(18,38,5,3,'#e87a6a');L.r(41,38,5,3,'#e87a6a');
 brows(L,b,27,-1);nose(L,s,37);L.r(31,37,3,3,'#e8907a');
 if(t)mouth(L,32,43,7,true);else L.r(29,44,6,1,MR)}}
};
const pcache={};
function portraitCanvas(name,open){const k=name+(open?1:0);if(pcache[k])return pcache[k];
 const P_=PORT[name],L=Ly(64,64),c=K.mk(64,64),g=c.getContext('2d');P_.f(L,open?1:0);
 const gr=g.createRadialGradient(22,18,4,32,32,46);gr.addColorStop(0,sh(P_.bg,34));gr.addColorStop(1,P_.bg);g.fillStyle=gr;g.fillRect(0,0,64,64);
 const o=finish(L);for(let i=0;i<o.length;i++)if(o[i]){g.fillStyle=o[i];g.fillRect(i%64,(i/64)|0,1,1)}
 return pcache[k]=c}
const portraits={};
for(const name of Object.keys(PORT))portraits[name]=(ctx,open)=>{ctx.clearRect(0,0,64,64);ctx.drawImage(portraitCanvas(name,open),0,0)};

// ================= BIG HAT'S BRIEFING PLACE: the lightship's wheelhouse =================
// The wheelhouse of a lightship tied up for good as a museum, after hours, in the rain. Drawn in the back room's layout
// (spec 013): his bust centered, the place behind him, and in front of him, where the desk would be, the chart table
// with a chart and brass dividers, and the ship's wheel off to his left. A brass lamp right over him keeps his face
// clear; rain runs down the windows behind him, the harbor lights beyond.
const wheelhouse={
 back(c,v){const{VW,VH,fy,mid,now}=v,R=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))};
  // varnished wood all round: panels with dark seams
  R(0,0,VW,VH,'#4a2e1e');for(let x=((mid-4)%26+26)%26;x<VW;x+=26){R(x,0,1,VH,'#2e1c12');R(x+1,0,1,VH,'#6a4430')}
  R(0,fy-62,VW,3,'#6a4430');R(0,fy-59,VW,2,'#2e1c12');
  // the windows across the back: the night harbor, the far bridge's lights, rain running down
  const wy=fy-124,wh=56;for(let i=-2;i<=2;i++){const wx=mid+i*50-22;if(wx>VW||wx+44<0)continue;R(wx-3,wy-3,50,wh+6,'#2e1c12');R(wx,wy,44,wh,'#16202e');R(wx,wy+wh*.62,44,wh*.38,'#1a2a34');
   for(let k=0;k<5;k++){const lx=wx+4+((k*13+i*7+40)%38);R(lx,wy+wh*.58,2,1,k%2?'#ffd27a':'#ff9a5a');R(lx,wy+wh*.64,1,3,'rgba(255,200,120,.35)')}
   R(wx,wy+wh*.3,44,1,'rgba(180,200,220,.15)');
   for(let k=0;k<7;k++){const rx=wx+2+((k*9+i*5)%40),ry=wy+((now/14+k*31+i*17)%wh);R(rx,ry,1,4,'rgba(210,225,245,.5)')}
   R(wx+21,wy,2,wh,'#2e1c12')}
  // the big lens, dark, on its pedestal to his left; a ship's clock and a barometer on the right
  const lx=mid-92,ly=fy-40;R(lx-14,ly,28,40,'#3a3a44');R(lx-14,ly,28,2,'#5a5a64');c.fillStyle='#7a8a8a';c.beginPath();c.arc(lx,ly-18,18,0,6.283);c.fill();
  for(let r=16;r>3;r-=4){c.strokeStyle=r%8?'#a8bcbc':'#5a6a6a';c.lineWidth=1;c.beginPath();c.arc(lx,ly-18,r,0,6.283);c.stroke()}R(lx-1,ly-36,2,36,'#c8a040');c.fillStyle='rgba(255,250,230,.25)';c.beginPath();c.arc(lx-6,ly-24,4,0,6.283);c.fill();
  for(const[cx_,cy_,col]of[[mid+80,fy-48,'#e8e4d8'],[mid+104,fy-48,'#d8c8a0']]){c.fillStyle='#c8a040';c.beginPath();c.arc(cx_,cy_,10,0,6.283);c.fill();c.fillStyle=col;c.beginPath();c.arc(cx_,cy_,8,0,6.283);c.fill()}
  R(mid+80,fy-54,1,6,'#2a2030');R(mid+80,fy-48,4,1,'#2a2030');R(mid+103,fy-53,1,5,'#a8323e');
  // the brass lamp right over his hat, and its cone of warm light so his face reads
  R(mid-1,0,2,12,'#8a6a2a');c.fillStyle='#c8a040';c.beginPath();c.moveTo(mid-9,20);c.lineTo(mid+9,20);c.lineTo(mid+5,12);c.lineTo(mid-5,12);c.fill();R(mid-4,20,8,3,'#fff2c8');
  c.fillStyle='rgba(255,226,170,.12)';c.beginPath();c.moveTo(mid-10,22);c.lineTo(mid+10,22);c.lineTo(mid+76,fy);c.lineTo(mid-76,fy);c.fill();
  R(0,fy-4,VW,VH,'#3a2418')},
 lift:2,
 front(c,v){const{VW,VH,fy,mid,now}=v,R=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))};
  // the deck: worn planks
  R(0,fy,VW,VH-fy,'#4a3020');for(let y=fy+10;y<VH;y+=7)R(0,y,VW,1,'#3a2418');for(let y=fy+10,i=0;y<VH;y+=7,i++)R((i*37)%50,y,1,7,'#3a2418');
  // the chart table where the desk would be: a chart of the river's mouth, brass dividers, a mug, his toothpicks
  R(mid-118,fy,236,10,'#6a4430');R(mid-118,fy,236,2,'#8a5a3e');R(mid-118,fy+10,236,3,'#2e1c12');R(mid-112,fy+13,226,30,'#4a2e1e');for(let x=mid-106;x<mid+106;x+=36){R(x,fy+18,30,20,'#3a2418');R(x+13,fy+26,4,2,'#c8a040')}
  R(mid-104,fy-12,74,13,'#e8dcc0');R(mid-104,fy-12,74,1,'#f8f0e0');c.strokeStyle='#6a8aa8';c.lineWidth=1;c.beginPath();c.moveTo(mid-102,fy-4);c.bezierCurveTo(mid-84,fy-11,mid-62,fy-2,mid-32,fy-8);c.stroke();
  for(let i=0;i<8;i++)R(mid-98+i*8,fy-10+((i*3)%6),1,1,'#4a6a8a');R(mid-60,fy-9,4,4,'#a8323e');
  R(mid-46,fy-16,1,12,'#c8a040');R(mid-42,fy-16,1,12,'#c8a040');R(mid-46,fy-17,5,2,'#e8c870');
  R(mid+40,fy-14,12,14,'#e8e4d8');R(mid+40,fy-14,12,2,'#ffffff');R(mid+52,fy-11,3,6,'#e8e4d8');R(mid+42,fy-9,8,4,'#5a3a1a');
  R(mid+64,fy-6,24,6,'#d8cdb4');R(mid+64,fy-6,24,1,'#f4efe6');for(let x=mid+66;x<mid+86;x+=3)R(x,fy-5,1,4,'#c8a060');
  // the ship's wheel off to his left, its spokes catching the lamp
  const wx=mid-74,wy=fy-6;c.strokeStyle='#6a4430';c.lineWidth=3;c.beginPath();c.arc(wx,wy,18,Math.PI,2*Math.PI);c.stroke();c.strokeStyle='#8a5a3e';c.lineWidth=1;c.beginPath();c.arc(wx,wy,19,Math.PI*1.1,Math.PI*1.6);c.stroke();
  for(let i=0;i<5;i++){const a=Math.PI+i*Math.PI/4;R(wx+Math.cos(a)*22-1,wy+Math.sin(a)*22-1,3,3,'#8a5a3e');c.strokeStyle='#5a3a26';c.lineWidth=2;c.beginPath();c.moveTo(wx,wy);c.lineTo(wx+Math.cos(a)*24,wy+Math.sin(a)*24);c.stroke()}
  c.fillStyle='#c8a040';c.beginPath();c.arc(wx,wy,4,0,6.283);c.fill();
  // a life ring hung on the table's front, and a coil of line on the deck: the floor never ends on bare planks
  const rx=mid+84,ry=fy+28;for(let k=0;k<8;k++){c.strokeStyle=k%2?'#e8e4d8':'#c8402e';c.lineWidth=5;c.beginPath();c.arc(rx,ry,11,k*Math.PI/4,(k+1)*Math.PI/4);c.stroke()}
  c.strokeStyle='#8a7a5a';c.lineWidth=1;c.beginPath();c.arc(rx,ry,14,0,6.283);c.stroke();
  const qx=mid-80,qy=Math.min(VH-14,fy+62);for(let r=14;r>2;r-=3){c.strokeStyle=r%2?'#c8b890':'#a8986a';c.lineWidth=2;c.beginPath();c.ellipse(qx,qy,r,r*.45,0,0,6.283);c.stroke()}
  R(0,fy+44,VW,2,'#2e1c12');R(0,fy+46,VW,1,'#6a4430')}
};

return{paint,props,folk,portraits,fx,wheelhouse,mirrorGlint,FOLK,PORT,portraitCanvas};
})();
