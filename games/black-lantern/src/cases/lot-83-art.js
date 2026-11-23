// Black Lantern · cases/lot-83-art.js · Lot 83's art (spec 011 part A, Nov 23, 2026). Exposes window.L83A.
// Art for this case only (Bible, Art, Direction: one case, one set of art); never reuse it in another case.
// Generic pieces come from the Shared Shelf (engine/shelf.js: v1, plus the apartments, night light, van and interiors
// pieces spec 012 draws first here), painted with Black Lantern's palette. This file adds the case's own pieces (the
// Pecan Court block put together from the Shelf's walkway, stairs, doors and window units; the striped fumigation tent;
// the storage row; the lot's jars, books and ledgers; the pump room), its townsfolk and Walt on the map and in the
// dialog box, and Big Hat's briefing place, the barbecue joint's walk-in cooler.
// August in Austin (spec 011, Art): hot white sky by day, sodium orange and bug-light purple by night, the tent's
// warning stripes. No autumn pieces from the Shelf.
//
//   L83A.paint(M)            the map's still layer -> {c, glows}; L83A.props(M) its standing pieces, sorted with people
//   L83A.folk(id, dir, idle, M)  a townsperson's map sprite -> {c, ax, ay, noShadow}
//   L83A.portraits           speaker name -> (ctx, mouth) drawing the 64 x 64 talking portrait
//   L83A.fx(ctx, o)          the case's light and air after the light pass: heat shimmer by day; at night the bug
//                            lights, the lantern's warm pool and lit things drawn back over the dark
//   L83A.cooler              Big Hat's briefing place: {back, front} (engine.js bigHatScene)
//   L83A.patchGlint          how the hidden hotspot looks while it shows
//
// Lot 83's accent colors (Bible, Art, Palette), on top of the base palette:
const L83_ACCENT={sodium:'#ff9a3c',zap:'#a070ff',teal:'#3fa8a0',tentR:'#c8402e',tentY:'#e8c84a',tentB:'#2e4a8a',stucco:'#d8c4a0',jar:'#c8d0a0'};
window.L83A=(()=>{
const K=SHELF,T=16,S=.5,{F,shade,hsh,RGB,art}=K,A=L83_ACCENT;
const ART={};
const get=(k,spec)=>ART[k]||(ART[k]=K.prop(spec(),S));
const isNight=M=>M.light==='night';
const TENT=[A.tentR,'#ece4d0',A.tentY,A.tentB];

// ================= GROUND =================
const GP={',':(x,y)=>K.stoneSidewalk(x,y,T,true),'.':(x,y)=>K.summerGrass(x,y,T,true),':':(x,y)=>K.summerGrass(x,y,T,false),'_':(x,y)=>K.asphalt(x,y,T),'=':(x,y)=>K.asphalt(x,y,T),
 g:(x,y)=>K.dryDirt(x,y,T,true),x:(x,y)=>K.dryDirt(x,y,T),n:(x,y)=>K.floor(x,y,T,'lino'),c:(x,y)=>K.floor(x,y,T,'carpet'),v:(x,y)=>K.floor(x,y,T,'tile'),w:(x,y)=>K.floor(x,y,T,'wood'),
 o:(x,y)=>{const n=hsh(x>>1,y>>1,401);return n<.06?'#5a5852':n>.96?'#8a8880':(x%32===0||y%32===0)?'#565450':['#6e6c66','#686660','#74726a'][(hsh(x,y,402)*3)|0]}};
const SOFT=new Set('.:xg'.split(''));
const at=(M,x,y)=>{const r=M.ground[y];return r?r[x]:undefined};

// ================= THE STILL LAYER =================
const still={};
function paint(M){
 const key=M.id+(isNight(M)?'n':'d');if(still[key])return still[key];
 const W=M.w*T,H=M.h*T,c=K.mk(W,H),g=c.getContext('2d'),img=g.createImageData(W,H),d=img.data,glows=[];
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const tx=(x/T)|0,ty=(y/T)|0;let ch=at(M,tx,ty);
  if(SOFT.has(ch)){const jx=Math.min(W-1,Math.max(0,x+((hsh(x>>1,y>>1,61)*5)|0)-2)),jy=Math.min(H-1,Math.max(0,y+((hsh(x>>1,y>>1,62)*5)|0)-2)),jc=at(M,(jx/T)|0,(jy/T)|0);if(SOFT.has(jc))ch=jc}
  const col=(GP[ch]||GP[','])(x,y),v=RGB(col),i=(y*W+x)*4;d[i]=v[0];d[i+1]=v[1];d[i+2]=v[2];d[i+3]=255}
 g.putImageData(img,0,0);
 // curbs where the courtyard's concrete meets the lot, and oil stains in the lot
 for(let ty=0;ty<M.h;ty++)for(let tx=0;tx<M.w;tx++){const a=at(M,tx,ty),b=at(M,tx,ty+1);
  if(a===','&&(b==='_'||b==='=')){F(g,tx*T,ty*T+T-2,T,1,shade(K.pal().stoneWarm,.2));F(g,tx*T,ty*T+T-1,T,1,'#1c1820')}
  if(a==='_'&&hsh(tx,ty,403)<.12){g.fillStyle='rgba(16,10,20,.28)';g.beginPath();g.ellipse(tx*T+8,ty*T+9,6,3,0,0,6.283);g.fill()}}
 (M.lines||[]).forEach(l=>K.paintLine(g,l.x,l.y,l.w,l.h,l.dashed,l.col||'#e8e4d8'));
 M.pieces.filter(p=>PROPK.has(p.k)&&!NOSHADOW.has(p.k)).forEach(p=>{const cx=(p.x+p.w/2)*T+2,cy=(p.y+p.h)*T-2,rx=Math.max(5,p.w*T*.42);
  g.fillStyle='rgba(16,10,20,.28)';g.beginPath();g.ellipse(cx,cy,rx,Math.max(2.5,rx*.28),0,0,6.283);g.fill()});
 M.pieces.filter(p=>STILL[p.k]).sort((a,b)=>(BACK.has(a.k)?-99:a.y+a.h)-(BACK.has(b.k)?-99:b.y+b.h)).forEach(p=>STILL[p.k](g,p,M,glows));
 if(M.id==='court'&&isNight(M))tent(g,M);
 return still[key]={c,glows};
}
const BACK=new Set(['room','bayroom','vault','block','pool']);
const box=p=>({x0:p.x*T,x1:(p.x+p.w)*T,y0:p.y*T,fb:(p.y+p.h)*T,w:p.w*T});
const shadowBelow=(g,x0,x1,fb)=>{g.fillStyle='rgba(16,10,20,.32)';g.fillRect(x0+3,fb,x1-x0,3);g.fillStyle='rgba(16,10,20,.16)';g.fillRect(x0+5,fb+3,x1-x0-2,2)};
function signOn(g,rect,text,col,ink){const[x,y,w,h]=rect,inner=K.signBlank(g,x,y,w,h,col);const tw=K.signWidth(text);
 K.signText(g,text,Math.round(inner[0]+(inner[2]-tw)/2),Math.round(inner[1]+(inner[3]-5)/2),ink)}
const UNITC=['#4a6a7a','#6a3a2e','#3e5a4a','#7a5a2e'];
const STILL={
 // the two-story block: a flat roof's parapet, the upper wall, the walkway, the lower wall; windows with AC units
 block(g,p,M,glows){const N=isNight(M),x0=p.x*T,x1=(p.x+p.w)*T,st=A.stucco;
  F(g,x0-T,0,x1-x0+2*T,7,'#5a5258');F(g,x0-T,0,x1-x0+2*T,2,'#7a7276');F(g,x0-T,6,x1-x0+2*T,1,'#2a2228');
  for(let x=x0+20;x<x1;x+=90){F(g,x,0,10,5,'#8a8a90');F(g,x+1,1,8,1,'#b0b0b8')}           // rooftop AC boxes peeking over
  K.wall(g,x0,x1,7,48,'siding',st,T);K.wall(g,x0,x1,64,112,'siding',st,T);
  F(g,x0,7,x1-x0,2,'rgba(20,10,20,.3)');
  for(let n=1;n<=8;n++){const dx=4*n*T+8;for(const[wy,fy]of[[18,48],[76,112]]){if(dx+28>x1)continue;
   const wx=dx+20,lit=!N||hsh(n,wy,404)<.35;const gl=K.windowPane(g,wx,wy,18,13,T,(n+wy)%3===0);if(lit&&!N)glows.push(gl);
   if(N&&!lit){F(g,wx+1,wy+1,16,11,'#1a1824')}else if(N)glows.push([wx+9,wy+6,T*1.1,.3]);
   if((n+wy)%2===0)K.windowAC(g,wx+2,wy+8,T,{drip:(n%3===0),on:!N})}}
  K.metalStairs(g,1*T,64,112,T);K.metalStairs(g,34*T,64,112,T);
  K.walkway(g,T,35*T,48,112,T,{post:4,gaps:[[T,2*T],[34*T,35*T]]});
  // bug lights hung under the walkway, between the doors
  for(let x=6;x<34;x+=8){F(g,x*T+7,67,1,4,'#2a2030');F(g,x*T+5,71,5,6,N?'#c8a8ff':'#8a80a0');F(g,x*T+5,71,5,1,'#2a2030');if(N)glows.push([x*T+8,74,T*1.3,.35])}
  // a little sign: no diving, no glass, no lifeguard on duty
  F(g,22*T,82,18,10,'#e8e4d8');F(g,22*T,82,18,2,'#a8323e');K.signText(g,'POOL',22*T+2,86,'#2a2030');F(g,22*T+8,92,2,8,'#5a5a64')},
 unitdoor(g,p,M,glows){const fb=(p.y+1)*T,cx=p.x*T+8,lit=!isNight(M)||p.n===6||p.n===12;
  const gl=K.numberDoor(g,cx,fb-.95*T,fb,UNITC[p.n%4],p.n,T,{lit});if(gl&&isNight(M))glows.push(gl);
  if(p.n===6){F(g,cx-6,fb-4,12,3,'#6a5a3a');for(let i=0;i<3;i++)F(g,cx-5+i*4,fb-3,2,1,'#8a7a5a');            // Walt's doormat, his newspapers piled on it
   F(g,cx+7,fb-6,6,5,'#d8d0b8');F(g,cx+8,fb-8,6,4,'#c8c0a8');F(g,cx+7,fb-6,6,1,'#8a8070')}},
 // the dry pool in its chain-link (the pool itself first, the fence over it)
 pool(g,p){const{x0,x1,y0,fb}=box(p);K.pool(g,x0,y0,x1,fb,T,{empty:true,ladder:x1-22,steps:true})},
 fence(g,p){const x0=p.x*T,x1=(p.x+p.w)*T,top=p.y*T+3,bot=(p.y+p.h-1)*T+3;
  K.chainLinkSide(g,x0+7,top+14,bot+2,T);K.chainLinkSide(g,x1-9,top+14,bot+2,T);
  K.chainLink(g,x0,x1,top,T,{post:2});K.chainLink(g,x0,x1,bot,T,{post:2,gate:[p.gate*T,(p.gate+1)*T],open:true});
  F(g,(p.gate)*T-12,bot-2,10,7,'#e8e4d8');F(g,(p.gate)*T-12,bot-2,10,2,'#a8323e');K.signText(g,'NO',(p.gate)*T-10,bot+1,'#2a2030')},
 hatch(g,p,M){const x=p.x*T+1,y=p.y*T+2,N=isNight(M);F(g,x-1,y-1,16,13,'#2a2a30');
  if(N){F(g,x,y,14,11,'#0a080c');for(let k=0;k<4;k++)F(g,x+4,y+1+k*3,6,1,'#5a5a64');F(g,x,y-7,14,6,'#7a7a84');F(g,x,y-7,14,1,'#9a9aa4');F(g,x+5,y-5,4,1,'#3a3a44')}
  else{F(g,x,y,14,11,'#7a7a84');F(g,x,y,14,1,'#a8a8b0');for(let k=2;k<13;k+=3)F(g,x+k,y+2,1,7,'#6a6a74');F(g,x+5,y+8,4,3,'#c8a040');F(g,x+6,y+7,2,1,'#c8a040')}},
 // the east block: the office and the laundry room, one story, a flat roof
 annex(g,p,M,glows){const{x0,x1,y0,fb}=box(p),rb=fb-2.4*T,N=isNight(M);
  F(g,x0-3,y0,x1-x0+6,rb-y0,'#5a5258');F(g,x0-3,y0,x1-x0+6,2,'#7a7276');for(let x=x0;x<x1;x+=4)F(g,x,y0+3,1,rb-y0-4,'#504a50');F(g,x0-3,rb-2,x1-x0+6,2,'#2a2228');
  F(g,x0+20,y0+4,12,8,'#8a8a90');F(g,x0+21,y0+5,10,1,'#b0b0b8');
  K.wall(g,x0,x1,rb,fb,'siding',A.stucco,T);
  const ox=p.office*T+8,lx=p.laundry*T+8;
  K.door(g,ox,fb-.95*T,fb,'#3e5a6a',T);K.door(g,lx,fb-.95*T,fb,'#6a6a74',T);
  signOn(g,[ox-14,rb+3,28,9],'OFFICE','#e8dcc0','#2e4a6a');signOn(g,[lx-18,rb+3,36,9],'LAUNDRY','#e8dcc0','#2e4a6a');
  glows.push(K.windowPane(g,x0+8,fb-1.25*T,20,13,T,true));
  // the laundry's frosted window, always lit
  F(g,lx+14,fb-1.3*T,22,15,'#2a2a30');F(g,lx+15,fb-1.3*T+1,20,13,'#d8f0f0');F(g,lx+15,fb-1.3*T+7,20,7,'#b8d8dc');glows.push([lx+25,fb-1.3*T+7,T*(N?2.6:1.2),N?.6:.3]);
  K.windowAC(g,x0+10,fb-1.25*T+7,T,{on:!N});shadowBelow(g,x0,x1,fb)},
 linkfence(g,p){const x0=p.x*T,x1=(p.x+p.w)*T,top=p.y*T+2,[a,b]=p.gap;K.chainLink(g,x0,a*T,top,T,{post:2});K.chainLink(g,b*T,x1,top,T,{post:2})},
 // night: the tent's skirt along the bottom, sandbagged
 skirt(g,p){const x0=p.x*T,x1=(p.x+p.w)*T,y=p.y*T;
  for(let x=x0;x<x1;x++){const k=((x/12)|0)%4,c=TENT[k],f=Math.sin(x*.5)*.12;F(g,x,y-6,1,T+6,shade(c,-.25+f))}
  for(let x=x0;x<x1;x+=12)F(g,x,y-6,1,T+6,'rgba(16,10,20,.35)');F(g,x0,y-7,x1-x0,2,'#2a2030');
  for(let x=x0+4;x<x1;x+=22){F(g,x,y+T-7,14,7,'#8a7a5a');F(g,x,y+T-7,14,2,'#a8987a');F(g,x+6,y+T-7,1,7,'#6a5a3a')}
  for(let x=x0+60;x<x1;x+=160){F(g,x,y-2,30,12,'#e8e4d8');F(g,x,y-2,30,3,A.tentR);K.signText(g,'DANGER',x+3,y+3,'#2a2030')}},
 // interiors: the back wall, the side walls and the bottom wall with its door gap, then each room's fittings
 room(g,p,M,glows){const W=M.w*T,H=M.h*T,kind={unit6:['plain','#c8b898'],office:['panel','#8a6a4a'],unit5:['plain','#d8c0b0'],unit9:['plain','#a8b0b8'],unit12:['plain','#7a8aa8'],laundry:['plain','#c8d4d0']}[M.id]||['plain','#b8a888'];
  K.innerWall(g,T,W-T,0,3*T,kind[0],kind[1],T);
  F(g,0,0,T,H,'#1e1826');F(g,T-2,0,2,H-T,'#3a3046');F(g,W-T,0,T,H,'#1e1826');F(g,W-T,0,2,H-T,'#2a2236');
  F(g,0,H-T,W,T,'#1e1826');F(g,T,H-T,W-2*T,2,'#3a3046');
  const dk=Object.keys(M.warps)[0];if(dk){const[x]=dk.split(',').map(Number);F(g,x*T+1,H-T,T-2,T,'#6a4a3a');F(g,x*T+3,H-T+3,T-6,T-6,'#8a5a3a');for(let i=0;i<4;i++)F(g,x*T+4,H-T+5+i*2,T-8,1,'#5a3a2a')}
  (DECOR[M.id]||(()=>{}))(g,M,glows)},
 bayroom(g,p,M){const W=M.w*T,H=M.h*T;F(g,T,0,W-2*T,3*T,'#8a8a90');for(let x=T;x<W-T;x+=6)F(g,x,0,2,3*T,'#9a9aa0');for(let x=T+3;x<W-T;x+=6)F(g,x,0,1,3*T,'#6a6a74');
  F(g,T,3*T-3,W-2*T,3,'#4a4a54');F(g,0,0,T,H,'#3a3a44');F(g,W-T,0,T,H,'#3a3a44');F(g,0,H-T,W,T,'#2a2a34');
  // the roll-up door, up a foot: daylight under it
  F(g,3*T,H-T,3*T,T,'#c87a3a');for(let y=H-T;y<H-6;y+=3)F(g,3*T,y,3*T,1,'#a85a2a');F(g,3*T,H-6,3*T,6,'#f8e8c0');
  F(g,T,0,W-2*T,2,'#2a2a34');F(g,W/2-2,4,5,4,'#fff6d8')},
 vault(g,p,M,glows){const W=M.w*T,H=M.h*T;F(g,0,0,W,2*T,'#4a4844');for(let y=0;y<2*T;y+=8)F(g,0,y,W,1,'#3a3834');for(let x=0;x<W;x+=24)F(g,x,0,1,2*T,'#3a3834');
  F(g,0,2*T-2,W,2,'#2a2824');F(g,0,0,T,H,'#24221e');F(g,W-T,0,T,H,'#24221e');F(g,0,H-T,W,T,'#1a1814');
  for(let i=0;i<30;i++){const x=T+hsh(i,1,405)*(W-2*T),y=2*T+hsh(i,2,405)*(H-3*T);F(g,x,y,2+hsh(i,3,405)*4,1,'rgba(40,30,20,.5)')}
  glows.push([8*T+8,T*.3,T*1.4,.35])},
 pipes(g,p){const x0=p.x*T,x1=(p.x+p.w)*T;for(const[y,c]of[[6,'#8a8070'],[13,'#7a6a5a'],[21,'#6a7a7a']]){F(g,x0,y,x1-x0,5,c);F(g,x0,y,x1-x0,1,shade(c,.3));F(g,x0,y+4,x1-x0,1,shade(c,-.4));
  for(let x=x0+20;x<x1;x+=40){F(g,x,y-1,4,7,shade(c,-.2))}}F(g,x1-8,6,5,26,'#8a8070');F(g,x1-8,6,1,26,'#aaa090')},
 sump(g,p){const x=p.x*T,y=p.y*T;g.fillStyle='#14120e';g.beginPath();g.ellipse(x+8,y+9,7,4,0,0,6.283);g.fill();F(g,x+3,y+8,10,1,'#3a4848')},
 ladder(g,p){const x=p.x*T+3;for(let y=0;y<2*T;y+=4)F(g,x,y,10,1,'#9a9aa4');F(g,x,0,1,2*T,'#7a7a84');F(g,x+9,0,1,2*T,'#7a7a84');F(g,x-2,0,14,3,'#0a080c')},
 // the storage row: a long metal building with orange roll-up doors and painted numbers
 units(g,p,M,glows){const x0=0,x1=M.w*T;F(g,x0,0,x1,10,'#6a6a72');F(g,x0,0,x1,2,'#8a8a92');for(let x=0;x<x1;x+=5)F(g,x,2,1,8,'#5a5a62');F(g,x0,10,x1,2,'#2a2a30');
  F(g,x0,12,x1,52,'#b8b4a8');for(let x=0;x<x1;x+=4)F(g,x,12,1,52,'#a8a498');
  for(let i=0;i<10;i++){const cx=(2+3*i)*T+8,n=p.first+i,dx=cx-20,up=n===83;F(g,dx-1,22,42,42,'#4a4a50');
   if(up){F(g,dx,22,40,30,'#c87a3a');for(let y=22;y<52;y+=3)F(g,dx,y,40,1,'#a85a2a');F(g,dx,52,40,12,'#1a1418');F(g,dx+4,55,10,6,'#8a6a4a');F(g,dx+24,56,8,5,'#c8d0a0')}
   else{F(g,dx,22,40,42,'#c87a3a');for(let y=22;y<64;y+=3)F(g,dx,y,40,1,'#a85a2a');F(g,dx+16,58,8,4,'#5a5a64');F(g,dx+18,57,4,2,'#c8a040')}
   F(g,cx-8,14,16,7,'#e8e4d8');K.signText(g,String(n),cx-3,15,'#2a2030')}}
};
// each room's wall fittings
const DECOR={
 unit6(g,M,glows){F(g,2*T,1.1*T,1.5*T,.9*T,'#e8e4d8');F(g,2*T+2,1.1*T+2,1.5*T-4,4,'#a8323e');for(let i=0;i<4;i++)F(g,2*T+3,1.1*T+8+i*2,1.5*T-6,1,'#8a8070');   // a calendar, stuck on last month
  F(g,6*T,.4*T,T,T,'#8a6a4a');F(g,6*T+2,.4*T+2,T-4,T-4,'#f4efe6');F(g,6*T+7,.4*T+4,1,5,'#2a2030');F(g,6*T+7,.4*T+8,4,1,'#2a2030');                          // a clock
  glows.push(K.windowPane(g,8*T,.5*T,1.6*T,1.2*T,T,true))},
 office(g,M,glows){glows.push(K.windowPane(g,7*T,.4*T,1.6*T,1.3*T,T,false));F(g,5*T,.5*T,22,14,'#e8e4d8');K.signText(g,'RENT',5*T+3,.5*T+2,'#a8323e');K.signText(g,'DUE 1',5*T+2,.5*T+8,'#2a2030')},
 unit5(g,M,glows){glows.push(K.windowPane(g,2*T,.5*T,1.6*T,1.2*T,T,true));for(let y=4;y<3*T-6;y+=10)for(let x=T+((y/10|0)%2)*8;x<M.w*T-T;x+=16){F(g,x,y,3,3,'#c8a0b0')}},
 unit9(g,M){F(g,1.2*T,.6*T,2*T,.4*T,'#3a3a44');K.signText(g,'NIGHTS',1.2*T+5,.6*T,'#e8e4d8')},
 unit12(g,M,glows){for(let i=0;i<5;i++){F(g,(1.5+i*1.1)*T,.4*T,.8*T,1.1*T,['#5a3a8a','#a8323e','#2e6a8a','#d8a040','#3a8a5a'][i]);F(g,(1.5+i*1.1)*T+2,.4*T+3,.8*T-4,4,'#e8e4d8')}glows.push(K.windowPane(g,9*T,.5*T,T,1.1*T,T,true))},
 laundry(g,M,glows){F(g,8.5*T,.5*T,2*T,1.2*T,'#e8e4d8');for(let i=0;i<6;i++)F(g,8.5*T+4+(i%3)*9,.5*T+4+((i/3)|0)*9,6,6,['#f4d040','#a8e0f0','#f0a8c8'][i%3]);K.signText(g,'BOARD',8.5*T+6,.5*T+16,'#2a2030')}
};

// ================= STANDING PIECES =================
const SPEC={
 aptsign:()=>({size:[96,56,0,0],anchor:[48,54],lights:[[48,14,1.3,.35]],draw({R,C}){R(8,30,6,24,'#8a7a5a',{sh:2});R(82,30,6,24,'#8a7a5a',{sh:2});R(2,48,92,6,'#a8987a');R(2,48,92,2,'#c8b89a');
  R(0,0,96,32,'#2e4a3e',{sh:8});R(0,0,96,2,'#4e6a5e');R(2,2,92,28,'#3e5a4e');C(14,15,9,'#8a5a2e');C(12,13,6,'#a87a4a');R(10,12,2,2,'#2a2030');R(16,12,2,2,'#2a2030');R(11,17,6,1,'#2a2030')}}),
 lawnchair:()=>({size:[24,30,0,0],anchor:[12,28],lights:[],draw({R}){R(2,2,20,14,'#e8e4d8',{sh:4});for(let y=4;y<16;y+=3)R(2,y,20,1,'#3e8a8a');R(4,6,16,2,'#c0c0c8');R(2,16,20,6,'#e8e4d8');for(let x=4;x<22;x+=4)R(x,16,1,6,'#3e8a8a');R(2,22,2,6,'#9a9aa4');R(20,22,2,6,'#9a9aa4');R(14,10,6,3,'#c0d8e8');R(15,7,2,3,'#c0d8e8')}}),
 lounger:()=>({size:[60,26,0,0],anchor:[30,24],lights:[],draw({R}){R(0,6,40,8,'#e8e4d8',{sh:4});for(let x=2;x<40;x+=4)R(x,6,2,8,'#3fa8a0');R(40,0,18,12,'#e8e4d8',{sh:3});for(let x=42;x<58;x+=4)R(x,0,2,12,'#3fa8a0');R(2,14,2,10,'#8a8a94');R(54,12,2,12,'#8a8a94')}}),
 planter:()=>({size:[30,40,0,0],anchor:[15,38],lights:[],draw({R,C}){R(3,24,24,14,'#a8786a',{sh:6});R(2,22,26,4,'#c8988a');const L=K.pal().leaf;for(let i=0;i<7;i++){const x=4+i*3.5;R(x,6+(i%3)*3,2,18,i%2?shade(L,-.2):L)}C(8,6,4,shade(L,.2));C(21,4,4,L);C(15,2,3,shade(L,.25))}}),
 grill:()=>({size:[26,40,0,0],anchor:[13,38],lights:[],draw({R,E}){R(12,22,2,16,'#3a3a44');R(5,36,16,2,'#3a3a44');E(13,16,11,9,'#2a2a30');E(13,13,11,7,'#3a3a44');E(10,10,5,2,'#5a5a64');R(2,18,22,2,'#1a1a20')}}),
 bench:()=>K.BENCH,
 shrub:()=>({size:[36,26,0,0],anchor:[18,24],lights:[],draw({C}){const L=K.pal().dry||K.pal().straw;C(10,16,8,shade(L,-.35));C(24,15,9,shade(L,-.3));C(17,11,9,shade(L,-.15));C(14,9,5,shade(L,.05));C(22,10,4,shade(L,.1))}}),
 cooler:()=>({size:[20,50,0,0],anchor:[10,48],lights:[],draw({R,E}){R(3,18,14,30,'#e8e4d8',{sh:4});E(10,9,7,9,'#7ab8d8');E(8,7,3,4,'#b8e0f0');R(6,16,8,3,'#5a8aa8');R(7,30,6,3,'#3a6aa8')}}),
 plant:()=>({size:[24,44,0,0],anchor:[12,42],lights:[],draw({R,C}){R(5,28,14,14,'#b5532e',{sh:3});R(4,27,16,3,'#c8683e');const L=K.pal().leaf;C(12,16,9,shade(L,-.2));C(8,12,6,L);C(16,10,6,L);C(12,5,5,shade(L,.2));C(6,20,4,shade(L,.1))}}),
 chair:()=>({size:[22,40,0,0],anchor:[11,38],lights:[],draw({R}){R(3,0,16,14,'#5a5a64',{sh:3});R(3,0,16,2,'#8a8a94');R(2,16,18,5,'#6a6a74',{sh:3});R(3,21,2,17,'#3a3a44');R(17,21,2,17,'#3a3a44');R(4,12,14,6,'#3e7a8a');R(4,12,14,1,'#5e9aaa')}}),
 // Walt's recliner: brown, the arms worn through, a blanket over it in August
 recliner:()=>({size:[36,44,0,0],anchor:[18,42],lights:[],draw({R}){const c='#6a4a32';R(4,0,28,20,c,{sh:8});R(4,0,28,3,shade(c,.2));R(0,14,8,22,shade(c,-.1),{sh:3});R(28,14,8,22,shade(c,-.15));R(2,16,4,3,'#c8a878');
  R(6,20,24,14,shade(c,.08),{sh:6});R(6,34,24,6,shade(c,-.3));R(10,4,16,30,'#7a5a8a',{sh:5});for(let y=8;y<34;y+=6)R(10,y,16,1,'#5a3a6a');R(4,40,3,4,'#2a1e16');R(29,40,3,4,'#2a1e16')}}),
 tv:()=>({size:[30,40,0,0],anchor:[15,38],lights:[[15,12,1,.3]],draw({R}){R(2,22,26,16,'#6a4a32',{sh:6});R(2,22,26,2,'#8a6a4a');R(1,2,28,20,'#2a2a30',{sh:4});R(3,4,22,15,'#3a5a6a');R(3,4,22,3,'#5a7a8a')}}),
 sofa:()=>({size:[96,40,0,0],anchor:[48,38],lights:[],draw({R}){const c='#a86a7a';R(4,0,88,18,c,{sh:10});R(4,0,88,2,shade(c,.2));for(let x=10;x<90;x+=12)R(x,4,6,6,'#e8c070');R(0,8,10,24,shade(c,-.1));R(86,8,10,24,shade(c,-.2));R(8,18,80,14,shade(c,.1),{sh:8});
  R(2,0,92,32,'rgba(220,240,255,.18)');R(6,2,2,28,'rgba(255,255,255,.35)');R(60,6,2,20,'rgba(255,255,255,.3)');R(8,32,80,4,shade(c,-.35))}}),
 rig:()=>({size:[96,48,0,0],anchor:[48,46],lights:[[30,10,1.2,.35]],draw({R}){R(2,20,92,6,'#2a2a30');R(2,20,92,1,'#4a4a54');R(6,26,4,20,'#1a1a20');R(86,26,4,20,'#1a1a20');
  for(const[x,c]of[[14,'#5ad0ff'],[46,'#ff5aa8']]){R(x,0,30,18,'#14141a',{sh:2});R(x+2,2,26,13,c);R(x+2,2,26,3,shade(c,.4));R(x+13,18,4,3,'#2a2a30')}R(76,12,14,8,'#2a2a30');R(78,10,10,3,'#ff3a3a');R(50,22,24,3,'#1a1a20');for(let x=52;x<72;x+=3)R(x,22,2,1,'#7aff7a')}}),
 ringlight:()=>({size:[24,66,0,0],anchor:[12,64],lights:[[12,10,1.6,.45]],draw({R,C}){R(11,20,2,42,'#2a2a30');for(let i=0;i<8;i++){R(11-i,56+i,2,1,'#2a2a30');R(11+i,56+i,2,1,'#2a2a30')}C(12,10,10,'#f4f4f8');C(12,10,7,'#1a1a20');C(9,6,2,'#ffffff')}}),
 beanbag:()=>({size:[30,24,0,0],anchor:[15,22],lights:[],draw({E}){E(15,14,14,9,'#5a3a8a');E(13,11,10,6,'#7a5aaa');E(11,9,4,2,'#9a7aca')}}),
 freezer:()=>({size:[64,40,0,0],anchor:[32,38],lights:[],draw({R}){R(2,10,60,28,'#e8e4dc',{sh:10});R(0,4,64,8,'#f4f0e8',{sh:10});R(0,4,64,2,'#ffffff');R(24,12,16,6,'#c8a040');R(26,14,12,1,'#5a3a1a');R(4,34,56,4,'#a8a49c')}}),
 soda:()=>({size:[32,64,0,0],anchor:[16,62],lights:[[16,20,1.2,.4]],draw({R}){R(1,0,30,62,'#a8323e',{sh:8});R(1,0,30,2,'#c8524e');R(4,4,16,40,'#fff0d8');R(5,6,14,10,'#e8a040');for(let y=20;y<42;y+=5)R(5,y,14,3,'#d8c8b0');R(22,8,6,20,'#2a2a30');for(let y=10;y<28;y+=4)R(23,y,4,2,'#5a5a64');R(4,48,24,8,'#2a2a30')}}),
 foldtable:()=>({size:[96,30,0,0],anchor:[48,28],lights:[],draw({R}){R(0,4,96,8,'#e8e4d8',{sh:10});R(0,4,96,2,'#ffffff');R(4,12,3,16,'#8a8a94');R(89,12,3,16,'#8a8a94');R(10,0,18,5,'#7aa8c8');R(30,1,14,4,'#e8a0b0');R(60,0,20,5,'#f4f0e0')}}),
 bin:()=>({size:[28,30,0,0],anchor:[14,28],lights:[],draw({R}){R(2,8,24,20,'#3a6aa8',{sh:6});R(0,6,28,4,'#4a7ab8');R(4,2,8,6,'#e8e4d8');R(14,0,10,8,'#f0c040');R(8,4,4,3,'#a8323e');R(4,14,20,6,'#e8e4d8')}}),
 booth:()=>({size:[96,62,0,0],anchor:[48,60],lights:[[48,24,1.6,.45]],draw({R}){R(0,0,96,8,'#5a5a62',{sh:20});R(0,0,96,2,'#7a7a82');R(2,8,92,52,'#d8d0b8',{sh:14});R(8,14,56,26,'#2a2a30');R(10,16,52,22,'#e8e0b0');R(10,16,52,4,'#fff6d8');
  R(20,28,10,8,'#d8a040');R(24,26,4,3,'#d8a040');R(70,14,18,42,'#6a5a4a');R(84,34,2,4,'#c8a040');R(4,40,60,4,'#a8a098')}}),
 pole:()=>({size:[24,96,0,0],anchor:[12,94],lights:[[18,6,3.2,.5]],draw({R}){R(10,4,4,90,'#5a5a64',{sh:1});R(6,90,12,4,'#3a3a44');R(12,2,12,4,'#4a4a54');R(16,6,8,3,'#fff6c8')}}),
 gracebox:()=>({size:[36,30,0,0],anchor:[18,28],lights:[],draw({R}){R(2,8,32,20,'#d8c0a0',{sh:8});R(0,4,36,6,'#e8d0b0');R(8,14,20,6,'#f4efe6');R(4,24,28,4,'#a89070')}}),
 filter:()=>({size:[64,62,0,0],anchor:[32,60],lights:[],draw({R,E}){R(8,14,48,44,'#5a7a7a',{sh:14});E(32,14,24,8,'#6a8a8a');E(28,12,12,4,'#8aaaaa');R(26,0,12,8,'#8a8070');R(4,40,8,4,'#8a8070');R(52,30,12,4,'#8a8070');R(30,24,4,4,'#c8a040');R(8,56,48,4,'#2a3030')}}),
 // the stand-in for the finale's nest: pale, soft folds woven into the warm pipes (part B draws the real thing)
 nest:()=>({size:[64,48,0,0],anchor:[32,46],lights:[[32,24,1.4,.3]],draw({E,R}){for(let i=0;i<9;i++)E(8+i*6,30+Math.sin(i)*6,9,12,i%2?'#c8b8a0':'#d8c8b0');E(32,22,20,14,'#e0d4bc');E(28,18,10,6,'#f0e8d8');for(let i=0;i<6;i++)R(6+i*10,6,2,26,'#8a8070')}})
};
// the lot on Walt's table: jars with something pale in cloudy brine, unreadable books, numbered ledgers
const LOTTABLE={size:[96,44,0,0],anchor:[48,42],lights:[],draw({R,E}){R(2,14,92,10,'#8a6a4a',{sh:12});R(2,14,92,2,'#a88a6a');R(2,24,92,3,'#5a3e2a');R(6,27,4,15,'#4a3424');R(86,27,4,15,'#4a3424');
 for(let i=0;i<7;i++){const x=4+i*5,y=2+(i%2)*3;R(x,y,5,12,'#c8d0a0');R(x,y,5,1,'#e8ecd0');R(x,y-1,5,2,'#8a8a90');E(x+2.5,y+8,1.6,2.4,'#f0e8d8');R(x+4,y+1,1,10,'rgba(255,255,255,.4)')}
 for(let i=0;i<4;i++){const x=42+i*7;R(x,4+i%2,6,10,['#5a2a3a','#3a3a5a','#2a4a3a','#5a4a2a'][i]);R(x,4+i%2,1,10,'#d8c8a0');R(x+2,6+i%2,3,1,'#c8a040')}
 for(let i=0;i<5;i++){const x=72+i*4;R(x,6,4,8,'#8a7a5a');R(x,6,4,1,'#c8b890');R(x+1,9,2,2,'#e8e4d8')}}};
const PROPK=new Set(['tree','lamp','bench','car','van','aptsign','dumpster','lawnchair','lounger','planter','grill','worklight','shrub','fridge','stove','ksink','table','recliner','tv','boxes','fan',
 'counter','desk','cooler','plant','chairs','sofa','bed','chair','rig','ringlight','beanbag','washer','dryer','freezer','soda','foldtable','bin','booth','pole','shelfin','gracebox','filter','nest',
 'stairs','bulb','keyboard','mailboxes','deadac','wac','photo','dogwall','dogbed','foil','tapewall','hole','tube']);
const NOSHADOW=new Set(['bulb','fan','stairs','bulb','keyboard','mailboxes','deadac','wac','photo','dogwall','dogbed','foil','tapewall','hole','tube','pole','worklight']);
function props(M){
 const out=[],N=isNight(M);
 const add=(a,fx,fy,p,o={})=>{const X=Math.round(fx-a.ax),Y=Math.round(fy-a.ay);
  out.push(Object.assign({tx:p.x,ty:p.y,x:fx,y:fy,top:Y,draw:(c,ox,oy)=>c.drawImage(a.c,X+ox,Y+oy),
   lights:(a.lights||[]).map(([lx,ly,r,al])=>[X+a.sx(lx),Y+a.sy(ly),r*T,al,!!o.pool])},o.extra||{}))};
 const dyn=(p,fx,fy,top,draw,o={})=>out.push(Object.assign({tx:p.x,ty:p.y,x:fx,y:fy,top,draw,lights:o.lights||[]},o.extra||{}));
 for(const p of M.pieces){if(!PROPK.has(p.k))continue;const cx=(p.x+p.w/2)*T,fy=(p.y+p.h)*T-2;
  switch(p.k){
  case'tree':{const v=(p.x*3+p.y*5)%3,a=get('tree'+v,()=>K.summerTree(v)),X=Math.round(cx-a.ax),Y=Math.round(fy+1-a.ay);add(a,cx,fy+1,p,{extra:{canopy:[X+6,Y,a.c.width-12,a.c.height-16]}});break}
  case'lamp':add(get('lamp',()=>K.LAMP),cx,fy+1,p,{pool:true,extra:{sodium:[cx,fy-2]}});out[out.length-1].lights.push([cx,fy-2,1.8*T,.4,true]);break;
  case'bench':add(get('bench',SPEC.bench),cx,fy,p);break;
  case'car':add(get('car'+p.tint,()=>K.sedan('side',p.tint||'cloth')),cx,fy,p);break;
  case'van':{const a=get('van',()=>K.van('side','#ece6d6'));if(!a.named){a.named=1;const g=a.c.getContext('2d'),[sx,sy,sw]=K.VAN_SIGN,X=a.sx(sx),Y=a.sy(sy),W=a.sx(sx+sw)-X;
    F(g,X,Y,W,3,A.tentR);K.signText(g,'STAR STATE',X+Math.round((W-K.signWidth('STAR STATE'))/2),Y+4,'#2e4a8a');F(g,X+4,Y+10,6,4,'#8a6a5a');F(g,X+5,Y+9,2,2,'#5a5a64');K.signText(g,'PEST',X+14,Y+10,'#a8323e')}
   add(a,cx,fy+2,p);break}
  case'aptsign':{const a=get('aptsign',SPEC.aptsign);if(!a.named){a.named=1;const g=a.c.getContext('2d');[['PECAN COURT',3],['APARTMENTS',9]].forEach(([t,y])=>K.signText(g,t,Math.round(a.sx(54)-K.signWidth(t)/2),a.sy(0)+y,'#e8dcc0'))}add(a,cx,fy,p);break}
  case'dumpster':add(get('dump',()=>K.dumpster(true,'#3e6a4a')),cx,fy,p);break;
  case'worklight':add(get('wl',()=>K.workLight(true)),cx,fy+1,p,{pool:true});out[out.length-1].lights.push([cx,fy-4,2.6*T,.5,true]);out[out.length-1].work=[cx,fy-24];break;
  case'fridge':{const a=get('fridge',()=>K.kitchen('fridge'));if(!a.named){a.named=1;const g=a.c.getContext('2d'),[fx,fy2]=K.FRIDGE_FRONT,X=a.sx(fx),Y=a.sy(fy2);
    F(g,X+1,Y+1,9,8,'#f8f4e8');F(g,X+5,Y,2,2,'#c8402e');F(g,X+3,Y+3,1,4,'#2a6ad8');F(g,X+2,Y+3,3,1,'#2a6ad8');F(g,X+4,Y+3,1,1,'#f0c040');F(g,X+6,Y+5,2,3,'#3a9a3a');F(g,X+2,Y+7,6,1,'#c8402e')}
   add(a,cx,fy,p);break}
  case'stove':add(get('stove',()=>K.kitchen('stove')),cx,fy,p);break;
  case'ksink':add(get('ksink',()=>K.kitchen('sink')),cx,fy,p);break;
  case'table':add(get('lot',()=>LOTTABLE),cx,fy,p);break;
  case'boxes':add(get('box'+(p.v|0),()=>K.boxes(p.v|0)),cx,fy,p);break;
  case'fan':{const fx=cx,fyy=p.y*T+2;dyn(p,fx,9999,fyy-20,(c,ox,oy)=>{F(c,fx+ox,fyy-22+oy,1,8,'#2a2030');K.ceilingFan(c,fx+ox,fyy-12+oy,14,Math.floor(performance.now()/90)%2)});break}
  case'recliner':add(get('recliner',SPEC.recliner),cx,fy,p);break;
  case'tv':add(get('tv',SPEC.tv),cx,fy,p);break;
  case'counter':add(get('counter'+p.w,()=>K.counter(p.w)),cx,fy+10,p);break;
  case'desk':add(get('desk',()=>K.DESK),cx,fy,p);break;
  case'cooler':add(get('cooler',SPEC.cooler),cx,fy,p);break;
  case'plant':add(get('plant',SPEC.plant),cx,fy,p);break;
  case'chairs':{const a=get('chair',SPEC.chair);add(a,cx-8,fy,p);add(a,cx+8,fy,p);break}
  case'chair':add(get('chair',SPEC.chair),cx,fy,p);break;
  case'sofa':add(get('sofa',SPEC.sofa),cx,fy,p);break;
  case'bed':add(get('bed',()=>K.BED),cx+2,fy,p);break;
  case'rig':add(get('rig',SPEC.rig),cx,fy,p);break;
  case'ringlight':add(get('ring',SPEC.ringlight),cx,fy,p);break;
  case'beanbag':add(get('bean',SPEC.beanbag),cx,fy,p);break;
  case'washer':add(get('washer',()=>K.washer('washer')),cx,fy,p);break;
  case'dryer':add(get('dryer'+(p.on?1:0),()=>K.washer('dryer',!!p.on)),cx,fy,p);break;
  case'freezer':add(get('freezer',SPEC.freezer),cx,fy,p);break;
  case'soda':add(get('soda',SPEC.soda),cx,fy,p);break;
  case'foldtable':add(get('fold',SPEC.foldtable),cx,fy,p);break;
  case'bin':add(get('bin',SPEC.bin),cx,fy,p);break;
  case'booth':add(get('booth',SPEC.booth),cx,fy,p);break;
  case'pole':add(get('pole',SPEC.pole),cx,fy,p,{extra:{buzz:1}});break;
  case'shelfin':{const a=get('shelf'+p.w,()=>K.shelving(true,p.w*30));if(p.jars&&!a.jarred){a.jarred=1;const g=a.c.getContext('2d');for(let i=0;i<6;i++){const x=a.sx(4+i*8),y=a.sy(8);F(g,x,y,3,6,A.jar);F(g,x,y,3,1,'#8a8a90')}}add(a,cx,fy,p);break}
  case'gracebox':add(get('grace',SPEC.gracebox),cx,fy,p);break;
  case'filter':add(get('filter',SPEC.filter),cx,fy,p);break;
  case'lawnchair':add(get('lawn',SPEC.lawnchair),cx,fy,p);break;
  case'lounger':add(get('lounger',SPEC.lounger),cx,fy,p);break;
  case'planter':add(get('planter',SPEC.planter),cx,fy,p);break;
  case'grill':add(get('grill',SPEC.grill),cx,fy,p);break;
  case'shrub':add(get('shrub',SPEC.shrub),cx,fy,p);break;
  // wall fittings, drawn as flat pieces on the back wall (no shadow, behind everyone)
  case'keyboard':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+4+ox,y=.6*T+oy;F(c,x,y,26,18,'#6a4a32');F(c,x+1,y+1,24,16,'#8a6a4a');for(let i=0;i<16;i++){const kx=x+3+(i%8)*3,ky=y+3+((i/8)|0)*7;F(c,kx,ky,1,2,'#c0c0c8');if(i!==5)F(c,kx,ky+2,2,3,'#d8a040')}});break;
  case'mailboxes':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+4+ox,y=.4*T+oy;F(c,x,y,56,34,'#5a4a3a');for(let j=0;j<3;j++)for(let i=0;i<6;i++){const bx=x+2+i*9,by=y+2+j*11;F(c,bx,by,8,10,'#c8a040');F(c,bx,by,8,1,'#e8c870');F(c,bx+5,by+5,2,2,'#5a4a3a');if(i===5&&j===0)F(c,bx+1,by+8,6,4,'#f4efe6')}});break;
  case'deadac':case'wac':dyn(p,cx,0,0,(c,ox,oy)=>{K.windowAC(c,p.x*T+2+ox,1.3*T+oy,T,{on:p.k==='wac',drip:p.k==='deadac'})});break;
  case'photo':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+3+ox,y=.5*T+oy;F(c,x,y,12,14,'#c8a040');F(c,x+1,y+1,10,12,'#e8e0d0');F(c,x+3,y+3,3,7,'#f4f4f4');F(c,x+3,y+2,3,2,'#4a2c1a');F(c,x+6,y+4,3,6,'#c86a8a');F(c,x+6,y+3,3,2,'#2a1a14')});break;
  case'dogwall':dyn(p,cx,0,0,(c,ox,oy)=>{for(let i=0;i<8;i++){const x=p.x*T+4+(i%4)*14+ox,y=.3*T+((i/4)|0)*18+oy;F(c,x,y,11,13,['#c8a040','#8a6a4a','#e8e4d8'][i%3]);F(c,x+1,y+1,9,11,'#e8e0d0');F(c,x+3,y+5,5,5,'#c89a6a');F(c,x+3,y+4,1,2,'#c89a6a');F(c,x+7,y+4,1,2,'#c89a6a');F(c,x+4,y+7,3,3,'#a8323e')}});break;
  case'dogbed':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+1+ox,y=p.y*T+4+oy;c.fillStyle='#8a3a4a';c.beginPath();c.ellipse(x+7,y+6,8,5,0,0,6.283);c.fill();c.fillStyle='#c86a7a';c.beginPath();c.ellipse(x+7,y+6,5,3,0,0,6.283);c.fill()});break;
  case'foil':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+4+ox,y=.5*T+oy;F(c,x,y,40,24,'#5a5a64');for(let i=0;i<40;i+=2)for(let j=0;j<24;j+=2)F(c,x+i,y+j,2,2,hsh(i,j,406)<.5?'#c8ccd4':'#a8acb4');F(c,x,y,40,2,'#8a7a5a');F(c,x,y+22,40,2,'#8a7a5a')});break;
  case'tapewall':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T-2+ox,y=1.2*T+oy;F(c,x,y,18,16,'#b8bcc4');for(let i=0;i<4;i++)F(c,x,y+i*4,18,3,'#9a9ea8');F(c,x+6,y+5,4,3,'#5a4a3a')});break;
  case'hole':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+3+ox,y=1.3*T+oy;F(c,x-1,y-1,12,11,'#e8e4dc');F(c,x,y,10,9,'#14101a');F(c,x+2,y+2,3,2,'#3a2a2a');for(const[a,b]of[[-2,2],[10,4],[4,-2],[3,9]])F(c,x+a,y+b,2,2,'#f4f0e8')});break;
  case'tube':dyn(p,cx,0,0,(c,ox,oy)=>{const on=Math.random()>.02;F(c,p.x*T+ox,2+oy,p.w*T,4,'#e8e4d8');F(c,p.x*T+2+ox,3+oy,p.w*T-4,2,on?'#f8fff8':'#8a8a90')},{lights:[[cx,40,4.5*T,.55,true]]});break;
  case'stairs':break;
  case'bulb':dyn(p,cx,0,0,(c,ox,oy)=>{F(c,cx+ox,oy,1,10,'#3a3834');F(c,cx-2+ox,10+oy,5,4,Math.random()>.03?'#fff2c8':'#8a8070')},{lights:[[cx,28,3*T,.45,true]]});break;
  case'nest':add(get('nest',SPEC.nest),cx,fy,p,{pool:true});break;
  }}
 return out}

// ================= THE TENT (night, the court) =================
// From inside: the striped fabric over the roofline and down both sides, folds catching the work lights.
function tent(g,M){const W=M.w*T,H=M.h*T;
 const stripe=(x,y,w,h,vert)=>{for(let i=0;i<(vert?h:w);i++){const k=(((vert?y+i:x+i)/12)|0)%4,f=Math.sin((vert?y+i:x+i)*.45)*.1;F(g,vert?x:x+i,vert?y+i:y,vert?w:1,vert?1:h,shade(TENT[k],-.3+f))}};
 for(let x=0;x<W;x++){const k=((x/12)|0)%4,sag=Math.round(3+Math.sin(x/24*Math.PI)*3);F(g,x,0,1,sag+4,shade(TENT[k],-.28+Math.sin(x*.45)*.1))}
 for(let x=0;x<W;x+=12)F(g,x,0,1,10,'rgba(16,10,20,.4)');for(let x=0;x<W;x+=48){F(g,x+20,6,4,4,'#8a8a94')}
 stripe(0,0,T-4,H-T,true);stripe(W-T+4,0,T-4,H-T,true);F(g,T-4,0,2,H-T,'rgba(16,10,20,.45)');F(g,W-T+2,0,2,H-T,'rgba(16,10,20,.45)')}

// ================= LIGHT AND AIR =================
// by day outside: the Shelf's heat shimmer. At night: bug-light purple under the walkway, the work lights' white
// pools, the lantern's warm pool, and the lit things drawn back over the dark.
const OUTDOOR=new Set(['court','storage']);
function fx(ctx,o){const M=o.M;
 if(M.light==='day'){if(OUTDOOR.has(M.id))K.heat(ctx,o.now,.55);
  if(M.id==='storage'){(M.props||[]).forEach(p=>{if(p.buzz&&Math.floor(o.now/130)%9===0){ctx.fillStyle='rgba(255,246,200,.5)';ctx.fillRect(Math.round(p.x+4-o.camx),Math.round(p.y-92-o.camy),8,3)}})}
  return}
 if(M.id==='court'){const zaps=[];for(let x=6;x<34;x+=8)zaps.push([x*T+8-o.camx,74-o.camy,26]);K.bugZap(ctx,zaps,o.now);
  (M.props||[]).forEach(p=>{if(p.work){const x=p.work[0]-o.camx,y=p.work[1]-o.camy;ctx.globalCompositeOperation='lighter';const gr=ctx.createRadialGradient(x,y+18,0,x,y+18,40);gr.addColorStop(0,'rgba(255,246,220,.22)');gr.addColorStop(1,'rgba(255,246,220,0)');ctx.fillStyle=gr;ctx.fillRect(x-40,y-22,80,80);ctx.globalCompositeOperation='source-over'}})}
 // the lead's lantern: its pool goes warm (the approved night mockup)
 const lx=G.px+8-o.camx,ly=G.py+6-o.camy,lr=58;ctx.globalCompositeOperation='multiply';let gr=ctx.createRadialGradient(lx,ly,0,lx,ly,lr);
 gr.addColorStop(0,'rgba(240,196,120,.7)');gr.addColorStop(1,'rgba(240,196,120,0)');ctx.fillStyle=gr;ctx.fillRect(lx-lr,ly-lr,lr*2,lr*2);
 ctx.globalCompositeOperation='lighter';gr=ctx.createRadialGradient(lx,ly,0,lx,ly,lr*.5);gr.addColorStop(0,'rgba(214,164,58,.14)');gr.addColorStop(1,'rgba(214,164,58,0)');ctx.fillStyle=gr;ctx.fillRect(lx-lr,ly-lr,lr*2,lr*2);
 ctx.globalCompositeOperation='source-over';(M.props||[]).forEach(p=>{if(p.over)p.over(ctx,-o.camx,-o.camy)})}
// the hidden hotspot, while the lead is High on Mushrooms: the patch on the wall breathes, a warm glow turning
// slowly behind it like something asleep
function patchGlint(c,x,y,now){const r=5+Math.sin(now/700)*1.5,a=.25+.15*Math.sin(now/700);
 const gr=c.createRadialGradient(x+Math.cos(now/1500)*3,y+Math.sin(now/1500)*2,0,x,y,r*2);gr.addColorStop(0,`rgba(255,200,150,${(a+.2).toFixed(2)})`);gr.addColorStop(1,'rgba(255,200,150,0)');c.fillStyle=gr;c.fillRect(x-r*2,y-r*2,r*4,r*4);
 c.fillStyle=`rgba(243,237,226,${a.toFixed(2)})`;c.fillRect(x-7,y-7,14,1);c.fillRect(x-7,y+6,14,1);c.fillRect(x-7,y-7,1,14);c.fillRect(x+6,y-7,1,14)}

// ================= TOWNSFOLK AND WALT ON THE MAP =================
// The Shared Shelf's person template (shared-sprites-person-v1, method v1), at the agents' size; hair from agent-sprite.js.
// About 1 in 3 has a weird trait (Art, Townsfolk): Lorraine's headset, Mrs. Ybarra's dog in a sweater, Gus's spray bottle.
const {SKIN}=window.BL;
const FOLK={
 walt:{look:{skin:4,hair:3,hairC:6,acc:3},top:'#7a5a8a',coat:1,inner:'#e8e4d8',pants:'#4a4a54',shoes:'#6a4a3a',iris:'#3a2418',mouth:'flat',
  body:(A_,ty)=>{const{R}=A_;R(6,ty+11,16,2,'#5a3a6a');R(13,ty+13,2,8,'#5a3a6a')}},
 lorraine:{look:{skin:1,hair:4,hairC:4,acc:0},top:'#5a8aa8',pants:'#3a3446',shoes:'#2a1e18',iris:'#4a6a3a',mouth:'flat',headset:1,
  body:(A_,ty)=>{const{R}=A_;R(16,ty+2,3,4,'#e8e4d8');R(6,ty+14,16,2,'#2a2030')}},
 dolores:{look:{skin:2,hair:6,hairC:6,acc:0},top:'#c86a8a',pants:'#c86a8a',shoes:'#e8e4d8',iris:'#b8c8d0',mouth:'smile',cheeks:1,
  body:(A_,ty)=>{const{R}=A_;for(let y=ty+3;y<ty+16;y+=4)for(let x=8;x<20;x+=5)R(x,y,2,2,'#f4d0e0');R(21,ty+10,4,1,'#c8402e')}},
 trey:{look:{skin:5,hair:2,hairC:0,acc:0},top:'#3e7a8a',pants:'#3e7a8a',shoes:'#e8e4d8',iris:'#2a1a14',mouth:'flat',
  body:(A_,ty)=>{const{R}=A_;R(11,ty,6,3,shade('#3e7a8a',-.3));R(16,ty+4,4,5,'#e8e4d8');R(17,ty+5,2,1,'#2a6ad8')}},
 kenny:{look:{skin:1,hair:0,hairC:0,acc:0},top:'#e05a3a',pants:'#3b4a6b',shoes:'#e8e4d8',iris:'#2a1a14',mouth:'open',s:.44,phones:1,
  body:(A_,ty)=>{const{R}=A_;R(10,ty+4,8,6,'#f4d040');R(12,ty+6,4,2,'#e05a3a')}},
 gus:{look:{skin:2,hair:3,hairC:5,acc:0},top:'#e8e0c8',pants:'#8a7a5a',shoes:'#6a4a3a',iris:'#3a2418',mouth:'smile',spray:1,
  body:(A_,ty)=>{const{R}=A_;for(const x of[9,18])R(x,ty+2,1,12,'#c8c0a8');R(13,ty+4,2,1,'#c8c0a8');R(13,ty+8,2,1,'#c8c0a8')}},
 denise:{look:{skin:4,hair:4,hairC:0,acc:0},top:'#d8a040',pants:'#2a3446',shoes:'#e8e4d8',iris:'#3a2418',mouth:'flat',
  body:(A_,ty)=>{const{R}=A_;R(19,ty+2,4,10,'#6a3a2e');R(18,ty,2,4,'#6a3a2e')}},
 dale:{look:{skin:0,hair:0,hairC:5,acc:3},top:'#6a7a4a',pants:'#5a5048',shoes:'#3a2a1e',iris:'#4a6a8a',mouth:'flat',cap:'#3e5a3a',
  body:(A_,ty)=>{const{R}=A_;R(11,ty,6,4,shade('#6a7a4a',-.25));R(15,ty+3,3,2,'#e8e4d8')}},
 hector:{look:{skin:2,hair:2,hairC:0,acc:0},top:'#3e5a8a',coat:1,inner:'#e8e4d8',pants:'#2a2a34',shoes:'#2a1e18',iris:'#3a2418',mouth:'flat',cap:'#c8402e',
  body:(A_,ty)=>{const{R}=A_;R(7,ty+3,5,3,'#e8e4d8');R(8,ty+4,3,1,'#c8402e')}}
};
// what the template lacks: a cap, Lorraine's headset, Kenny's headphones, Gus's spray bottle
function topper(Ad,F_,dir){const{R,C}=Ad;
 if(F_.cap){const c=F_.cap,cd=shade(c,-.3);if(dir==='up'){R(5,0,18,7,c,{sh:3})}else if(dir==='side'){R(6,-1,17,7,c,{sh:3});R(0,5,8,2,cd)}
  else{R(5,-1,18,7,c,{sh:3});R(5,-1,18,1,shade(c,.25));R(5,6,18,2,cd);R(11,1,6,3,'#e8e4d8')}}
 if(F_.headset){if(dir==='side'){R(10,0,2,12,'#2a2a30');R(9,10,4,5,'#2a2a30');R(4,15,6,1,'#2a2a30');R(3,14,2,3,'#5a5a64')}else if(dir==='down'){R(4,0,20,2,'#2a2a30');R(2,9,4,6,'#2a2a30');R(22,9,4,6,'#2a2a30');R(4,15,6,1,'#2a2a30');R(9,15,3,2,'#5a5a64')}else{R(4,0,20,2,'#2a2a30');R(2,9,4,6,'#2a2a30');R(22,9,4,6,'#2a2a30')}}
 if(F_.phones){const c='#2a2a30',l='#5ad0ff';if(dir==='side'){R(9,-1,10,2,c);R(11,9,6,7,c);R(12,10,4,2,l)}else{R(3,-1,22,2,c);R(1,8,5,8,c);R(22,8,5,8,c);R(2,9,2,2,l);R(24,9,2,2,l)}}
 if(F_.spray&&dir!=='up'){const x=dir==='side'?16:22;R(x,30,5,8,'#7ad0e8');R(x+1,28,3,3,'#e8e4d8');R(x+3,27,4,2,'#e8e4d8');R(x+1,32,3,4,'#aae8f8')}}
// Biscuit: a chihuahua in a knitted sweater, ears up, trembling a little
function dog(dir){const v=art(28,24,2,2,S,({R,E,C})=>{const sk='#c89a6a',sw='#c8402e';
 if(dir==='up'){E(12,14,7,5,sw);R(5,13,14,2,'#e8c84a');C(12,7,4,sk);R(8,1,2,5,sk);R(14,1,2,5,sk);R(8,18,2,4,sk);R(15,18,2,4,sk);return}
 const side=dir==='side';
 if(side){E(13,14,8,5,sw);R(6,12,14,2,'#e8c84a');R(7,17,2,5,sk);R(17,17,2,5,sk);R(20,12,4,2,sk);C(6,8,5,sk);R(1,9,3,2,sk);R(4,1,2,5,sk);R(8,1,2,5,sk);R(3,7,2,2,'#14101a');R(1,10,1,1,'#14101a')}
 else{E(12,15,7,5,sw);R(5,13,14,2,'#e8c84a');R(8,18,2,4,sk);R(14,18,2,4,sk);C(12,8,5,sk);R(6,0,3,6,sk);R(15,0,3,6,sk);R(7,1,1,4,'#e8a0a0');R(16,1,1,4,'#e8a0a0');R(9,7,2,3,'#14101a');R(13,7,2,3,'#14101a');R(9,7,1,1,'#ffffff');R(13,7,1,1,'#ffffff');R(11,11,2,1,'#14101a')}});
 v.ax=v.sx(12);v.ay=v.sy(22);return v}
const fcache=new Map();
function folk(id,dir,idle=0,M){
 const k=id+dir+idle;let v=fcache.get(k);if(v)return v;
 if(dir==='right'){const l=folk(id,'left',idle,M),c=K.mk(l.c.width,l.c.height),g=c.getContext('2d');g.translate(c.width,0);g.scale(-1,1);g.drawImage(l.c,0,0);v={c,ax:c.width-l.ax,ay:l.ay}}
 else if(id==='biscuit'){const d=dog(dir==='left'?'side':dir);v={c:d.c,ax:d.ax,ay:d.ay}}
 else{const F_=FOLK[id]||FOLK.gus,d=dir==='left'?'side':dir,L=F_.look,sk=SKIN[L.skin];
  const sp=Object.assign({skin:sk,hair:sk,hairStyle:'cropped',iris:F_.iris||'#3a2418'},F_);
  const a=art(40,90,6,30,F_.s||S,Ad=>{K.drawChar(Ad,sp,d,0,idle);BLA.extras(Ad,{look:L},dir,0);topper(Ad,F_,d)});
  v={c:a.c,ax:a.sx(14),ay:a.sy(50)}}
 fcache.set(k,v);return v;
}

// ================= PORTRAITS (64 x 64, Storybook faces, Lantern Bust box) =================
// The Asset Library's portrait kit (as in Still Harvest and Good Manners): drawn pixel by pixel in a layer, then a light
// rim on the lit edges and a dark outline. Each sits on a lit backing (Quality bar, Rim and backing).
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

const PORT={
// Walt Okafor: 71, a white close beard, reading glasses on a cord, a plaid bathrobe over a T-shirt in August, kind and foggy
WALT:{bg:'#2e2a3e',f(L,t){const s='#7a4a2c',b='#e8e4d8',robe='#7a5a8a';
 body(L,robe);for(let y=52;y<64;y+=4)L.rm(0,y,64,1,sh(robe,-24));for(let x=8;x<60;x+=8)L.rm(x,48,1,16,sh(robe,22));L.r(26,48,12,16,'#e8e4d8');L.r(22,48,4,16,sh(robe,-30));L.r(38,48,4,16,sh(robe,-30));L.r(27,44,10,6,sh(s,-24));
 ears(L,s);head(L,32,32,15,15,s);L.e(31,19,13,5,sh(s,-14));L.r(18,22,3,6,'#c8c4b8');L.r(43,22,3,6,'#a8a498');
 L.e(32,43,13,7,b);L.e(32,45,9,5,sh(b,-20));L.r(26,38,12,2,b);
 for(const x of[20,36]){L.r(x,27,9,8,'#3a2a24');L.r(x+1,28,7,6,'#e6eef4')}L.r(29,29,6,1,'#3a2a24');eye(L,21,28,'#4a2a18',-1);eye(L,37,28,'#4a2a18',1);L.r(21,28,6,2,sh(s,-20));L.r(37,28,6,2,sh(s,-20));
 L.r(17,31,3,1,'#c8a040');L.p(16,32,'#c8a040');L.r(15,33,1,18,'#c8a040');L.r(47,31,2,1,'#c8a040');L.r(49,32,1,18,'#c8a040');
 brows(L,b,24,-1);nose(L,s,35);L.r(29,36,6,2,sh(s,-30));
 if(t)mouth(L,32,41,7,true);else L.r(29,42,6,1,MR)}},
// Lorraine Pike: building manager, fifties, dyed red hair in a clip, a phone headset she never takes off (her weird trait)
LORRAINE:{bg:'#2a3346',f(L,t){const s='#e9b98f',hc='#b94a2c',hd=sh(hc,-40),u='#5a8aa8';
 body(L,u);L.r(27,44,10,8,sh(s,-32));shirtV(L,sh(u,-28));L.r(38,54,6,8,'#e8e4d8');L.r(39,56,4,1,'#5a5a6a');
 L.e(36,12,9,6,hd);L.e(35,11,8,5,hc);L.r(30,10,10,2,'#c8a040');ears(L,s);head(L,32,32,15,15,s);L.e(31,20,15,6,hc);L.r(17,20,3,10,hc);L.r(44,20,3,10,hd);L.r(22,17,9,2,sh(hc,35));
 L.r(16,18,2,18,'#2a2a30');L.r(13,29,6,8,'#2a2a30');L.r(14,30,4,6,'#5a5a64');L.r(17,38,12,1,'#2a2a30');L.r(28,38,3,2,'#5a5a64');L.r(16,16,32,2,'#2a2a30');
 brows(L,hd,24,1);eye(L,21,28,'#4a6a3a',-1);eye(L,37,28,'#4a6a3a',1);L.r(20,27,7,1,D);L.r(37,27,7,1,D);
 L.r(19,37,4,2,'#e8857a');L.r(41,37,4,2,'#e8857a');nose(L,s);L.r(28,42,8,1,'#a8323e');if(t)mouth(L,32,41,8,true);else{L.r(28,42,8,1,MR);L.p(36,41,MR)}}},
// Mrs. Dolores Ybarra: Unit 5, 78, white curls, cataract-glassy eyes that still miss nothing, a flowered housedress,
// and Biscuit in his sweater under her arm (her weird trait)
'MRS. YBARRA':{bg:'#3a2a3a',f(L,t){const s='#c98e62',hc='#ece8de',u='#c86a8a';
 body(L,u);for(let y=50;y<64;y+=5)for(let x=6;x<60;x+=8)L.rm(x+(y%10),y,3,3,'#f4d0e0');L.r(27,44,10,8,sh(s,-32));
 L.e(50,50,9,7,'#c8402e');L.r(42,48,16,2,'#e8c84a');L.e(52,40,6,5,'#c89a6a');L.r(48,32,3,6,'#c89a6a');L.r(54,32,3,6,'#c89a6a');L.r(49,39,2,2,D);L.r(54,39,2,2,D);L.p(52,43,D);
 for(const[x,y]of[[18,18],[24,14],[31,13],[38,14],[44,18],[17,24],[46,24]])L.e(x,y,5,5,sh(hc,-12));for(const[x,y]of[[22,16],[30,12],[38,13]])L.e(x,y,3,3,hc);
 ears(L,s);head(L,32,32,14,15,s);for(const[x,y]of[[20,20],[27,18],[34,18],[41,20]])L.e(x,y,4,3,hc);
 eye(L,21,28,'#b8c8d0',-1);eye(L,37,28,'#b8c8d0',1);L.r(22,29,3,3,'#d8e4ea');L.r(38,29,3,3,'#d8e4ea');L.r(21,35,6,1,sh(s,-28));L.r(37,35,6,1,sh(s,-28));
 brows(L,sh(hc,-30),25);L.r(19,38,4,2,'#e0837a');L.r(41,38,4,2,'#e0837a');nose(L,s);L.r(26,40,1,3,sh(s,-30));L.r(37,40,1,3,sh(s,-30));
 L.e(47,36,1,2,'#c8a040');if(t)mouth(L,32,42,7,true);else{L.r(28,43,8,1,MR);L.p(27,42,MR);L.p(36,42,MR)}}},
// Trey Banks: ER nurse on nights, mid-thirties, a fresh fade, tired eyes, teal scrubs, his badge on a reel
TREY:{bg:'#24303a',f(L,t){const s='#4e2f1f',hc='#141010',u='#3e7a8a';
 body(L,u);L.r(26,46,12,4,sh(u,-30));for(let j=0;j<8;j++)L.r(32-(8-j),48+j,2,1,sh(u,-30));L.r(40,52,6,8,'#e8e4d8');L.r(41,53,4,2,'#2a6ad8');L.r(42,49,2,3,'#5a5a64');
 ears(L,s);head(L,32,32,15,15,s);L.e(31,20,14,5,hc);L.r(18,22,2,6,sh(hc,10));L.r(44,22,2,6,hc);L.tex(hc,'#2a2424',4);
 eye(L,21,28,'#2a1a14',-1);eye(L,37,28,'#2a1a14',1);L.r(21,28,6,1,sh(s,10));L.r(37,28,6,1,sh(s,10));L.r(21,35,6,1,sh(s,-18));L.r(37,35,6,1,sh(s,-18));L.r(22,36,4,1,sh(s,-12));L.r(38,36,4,1,sh(s,-12));
 brows(L,hc,25,2);nose(L,s);L.r(28,37,8,2,sh(s,-14));if(t)mouth(L,32,41,7,true);else{L.r(28,42,8,1,MR);L.p(27,43,MR)}}},
// Kenny Duong: 16, streams games at 3 a.m., big headphones round his neck, a bright tee, eyebrows always up
KENNY:{bg:'#2a2346',f(L,t){const s='#e9b98f',hc='#1b1414',u='#e05a3a';
 body(L,u);L.r(24,52,16,8,'#f4d040');L.r(28,54,8,3,u);L.r(28,46,8,5,sh(s,-32));
 L.e(20,48,6,5,'#2a2a30');L.e(44,48,6,5,'#2a2a30');L.r(20,50,24,2,'#2a2a30');L.e(20,48,3,2,'#5ad0ff');L.e(44,48,3,2,'#5ad0ff');
 ears(L,s,35);head(L,32,34,13,14,s);L.e(31,22,15,8,hc);L.r(17,22,4,12,hc);L.r(43,22,4,10,hc);L.r(22,25,14,4,hc);L.r(26,16,8,2,sh(hc,40));
 eye(L,21,31,'#2a1a14',-1);eye(L,37,31,'#2a1a14',1);brows(L,hc,27,-2);nose(L,s,38);L.r(19,40,3,2,'#f0a0a0');L.r(42,40,3,2,'#f0a0a0');
 if(t)mouth(L,32,43,8,true);else{L.r(29,44,6,1,MR);L.p(35,43,MR)}}},
// Gus Villarreal: retired, sun-dark and bald, a white guayabera, a spray bottle he mists himself with (his weird trait)
GUS:{bg:'#33302a',f(L,t){const s='#a26a43',u='#e8e0c8';
 body(L,u);for(const x of[22,40])L.r(x,50,1,14,sh(u,-24));L.r(28,46,8,4,sh(s,-30));L.r(30,52,1,1,'#c0c0c8');L.r(30,56,1,1,'#c0c0c8');
 L.r(6,38,8,14,'#7ad0e8');L.r(6,38,8,2,'#aae8f8');L.r(7,32,6,7,'#e8e4d8');L.r(2,32,6,3,'#e8e4d8');L.r(12,36,3,4,'#e8e4d8');L.r(9,52,6,6,s);
 if(t)for(const[x,y]of[[0,26],[2,24],[1,28],[4,22]])L.p(x,y,'#d8f4ff');
 ears(L,s);head(L,32,30,15,16,s);L.e(26,19,6,3,sh(s,20));L.r(17,26,3,6,'#9aa0a6');L.r(44,26,3,6,'#8a9096');
 for(const[x,y]of[[24,22],[38,21],[30,42]])L.p(x,y,sh(s,22));
 eye(L,21,28,'#3a2418',-1);eye(L,37,28,'#3a2418',1);L.r(20,34,7,1,sh(s,-26));L.r(37,34,7,1,sh(s,-26));brows(L,'#c8c4b8',25,-1);nose(L,s,35);
 L.r(25,38,14,2,'#d8d4c8');L.r(25,38,1,4,'#d8d4c8');L.r(38,38,1,4,'#d8d4c8');if(t)mouth(L,32,41,8,true);else{L.r(28,42,8,1,MR);L.p(27,41,MR);L.p(36,41,MR)}}},
// Denise Okafor: Walt's daughter, forties, down from Houston, hair up in a wrap, a mustard top, her keys in her fist
DENISE:{bg:'#2a2a40',f(L,t){const s='#7a4a2c',hc='#1b1414',u='#d8a040',wr='#2e6a6a';
 body(L,u);L.r(27,44,10,8,sh(s,-26));L.r(26,50,12,2,sh(u,-30));L.r(44,54,8,8,s);L.r(44,52,6,3,'#c0c0c8');L.r(46,50,2,3,'#c0c0c8');
 L.e(32,14,15,10,sh(wr,-30));L.e(31,13,14,9,wr);L.e(28,9,6,4,sh(wr,30));for(let x=20;x<44;x+=5)L.r(x,10,1,10,sh(wr,-20));
 ears(L,s);head(L,32,33,14,14,s);L.r(18,22,28,3,wr);L.e(47,36,1,2,'#d8b25a');
 eye(L,21,29,'#3a2418',-1);eye(L,37,29,'#3a2418',1);L.r(20,28,7,1,D);L.r(37,28,7,1,D);brows(L,hc,26,2);
 nose(L,s,36);L.r(19,38,4,2,sh(s,14));L.r(41,38,4,2,sh(s,14));L.r(28,42,8,1,'#8a2a3a');if(t)mouth(L,32,42,7,true);else{L.r(28,43,8,1,MR);L.p(27,44,MR);L.p(36,44,MR)}}},
// Dale Rusk: storage row clerk, sixties, a gray beard and a feed-store cap, sleepy-lidded, a green polo with a name tag
DALE:{bg:'#2e3328',f(L,t){const s='#f0c8a0',b='#9aa0a6',u='#6a7a4a',cap='#3e5a3a';
 body(L,u);L.r(26,46,12,5,sh(u,-28));L.r(40,54,8,4,'#e8e4d8');L.r(41,55,6,1,'#5a5a6a');L.r(28,46,8,4,sh(s,-30));
 ears(L,s);head(L,32,32,15,15,s);L.e(32,42,13,8,b);L.e(32,44,9,5,sh(b,-20));L.r(26,38,12,2,b);
 L.e(31,20,16,7,sh(cap,-30));L.e(30,19,15,6,cap);L.r(16,23,32,3,sh(cap,-40));L.r(14,25,36,2,sh(cap,-20));L.r(26,15,10,5,'#e8e4d8');L.r(28,16,6,3,cap);
 eye(L,21,29,'#4a6a8a',-1);eye(L,37,29,'#4a6a8a',1);L.r(21,29,6,3,sh(s,-24));L.r(37,29,6,3,sh(s,-24));brows(L,b,27);
 nose(L,s,35);if(t)mouth(L,32,41,7,true);else L.r(29,42,6,1,MR)}},
// Hector Salas: the tech whose crew quit, thirties, a red work cap, a navy uniform shirt with a name patch, wary
HECTOR:{bg:'#24283a',f(L,t){const s='#c98e62',hc='#1b1414',u='#3e5a8a',cap='#c8402e';
 body(L,u);L.r(26,46,12,18,'#e8e4d8');L.r(22,48,4,16,sh(u,-28));L.r(38,48,4,16,sh(u,-28));L.r(14,54,8,4,'#e8e4d8');L.r(15,55,6,1,'#c8402e');L.r(28,46,8,4,sh(s,-30));
 ears(L,s);head(L,32,33,14,15,s);L.e(32,42,12,6,sh(s,-14));L.tex(sh(s,-14),sh(s,-42),4);
 L.e(31,20,16,7,sh(cap,-30));L.e(30,19,15,6,cap);L.r(16,23,32,3,sh(cap,-40));L.r(14,25,36,2,sh(cap,-25));L.r(27,15,8,4,'#e8e4d8');
 eye(L,21,29,'#3a2418',-1);eye(L,37,29,'#3a2418',1);brows(L,hc,27,-2);L.r(18,28,4,1,hc);L.r(43,28,4,1,hc);
 nose(L,s,36);L.r(27,40,10,2,hc);if(t)mouth(L,32,42,7,true);else{L.r(28,43,8,1,MR);L.p(36,42,MR)}}}
};
const pcache={};
function portraitCanvas(name,open){const k=name+(open?1:0);if(pcache[k])return pcache[k];
 const P_=PORT[name],L=Ly(64,64),c=K.mk(64,64),g=c.getContext('2d');P_.f(L,open?1:0);
 const gr=g.createRadialGradient(22,18,4,32,32,46);gr.addColorStop(0,sh(P_.bg,34));gr.addColorStop(1,P_.bg);g.fillStyle=gr;g.fillRect(0,0,64,64);
 const o=finish(L);for(let i=0;i<o.length;i++)if(o[i]){g.fillStyle=o[i];g.fillRect(i%64,(i/64)|0,1,1)}
 return pcache[k]=c}
const portraits={};
for(const name of Object.keys(PORT))portraits[name]=(ctx,open)=>{ctx.clearRect(0,0,64,64);ctx.drawImage(portraitCanvas(name,open),0,0)};

// ================= BIG HAT'S BRIEFING PLACE: the walk-in cooler (spec 011, Briefing) =================
// The walk-in cooler of a barbecue joint off US-290, closed for the night, frost on the brisket racks while it's 104
// outside. Drawn in the back room's layout (spec 013): his bust centered, the place behind him, and in front of him,
// where the desk would be, a stainless prep table with a brisket on butcher paper. A caged bulb right over him keeps his
// face clear; his breath shows.
const cooler={
 back(c,v){const{VW,VH,fy,mid,now}=v,R=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))};
  // the steel walls: ribbed panels, frost creeping in from the corners
  R(0,0,VW,VH,'#2a3440');for(let x=(mid%20+20)%20;x<VW;x+=20){R(x,0,1,VH,'#3c4854');R(x+1,0,1,VH,'#1e2630')}
  for(let y=0;y<VH;y+=46)R(0,y,VW,2,'#26303c');
  const fr=c.createRadialGradient(0,0,0,0,0,VW*.5);fr.addColorStop(0,'rgba(200,228,250,.16)');fr.addColorStop(1,'rgba(230,244,255,0)');c.fillStyle=fr;c.fillRect(0,0,VW,VH);
  const fr2=c.createRadialGradient(VW,0,0,VW,0,VW*.45);fr2.addColorStop(0,'rgba(200,228,250,.14)');fr2.addColorStop(1,'rgba(230,244,255,0)');c.fillStyle=fr2;c.fillRect(0,0,VW,VH);
  for(let i=0;i<80;i++){const x=hsh(i,1,410)*VW,y=hsh(i,2,410)*fy;R(x,y,1,1,'rgba(240,250,255,.35)')}
  // the cooler door on the left: a thick insulated slab, a frosted porthole with the kitchen's red exit sign beyond, the latch
  const dx=mid-112;R(dx,fy-128,52,128,'#5a6876');R(dx+2,fy-126,48,124,'#6a7886');R(dx+2,fy-126,2,124,'#8a98a6');R(dx+48,fy-126,2,124,'#46525f');
  c.fillStyle='#2a1a20';c.beginPath();c.arc(dx+26,fy-96,11,0,6.283);c.fill();c.fillStyle='#4a2028';c.beginPath();c.arc(dx+26,fy-96,9,0,6.283);c.fill();
  R(dx+20,fy-99,12,5,'#c8302e');R(dx+21,fy-98,10,3,'#ff5a4a');c.fillStyle='rgba(230,244,255,.35)';c.beginPath();c.arc(dx+23,fy-99,6,0,6.283);c.fill();
  R(dx+40,fy-70,8,18,'#c0c8d0');R(dx+40,fy-70,8,2,'#e8f0f8');R(dx+44,fy-62,10,4,'#c0c8d0');R(dx-2,fy-128,2,128,'#3a4654');
  // wire racks both sides with briskets in butcher paper, a rail of hanging sausage links
  for(const[rx,rw]of[[mid-58,36],[mid+30,82]]){for(const ry of[fy-118,fy-84,fy-50]){R(rx,ry,rw,2,'#7a8692');for(let x=rx;x<rx+rw;x+=4)R(x,ry+2,1,2,'#5a6672');
    for(let x=rx+2;x<rx+rw-14;x+=16){R(x,ry-10,14,10,'#a89070');R(x,ry-10,14,2,'#c8b090');R(x+3,ry-8,8,1,'#7a6448');R(x+1,ry-11,12,1,'rgba(240,250,255,.45)')}}
   R(rx,fy-122,2,122,'#8a96a2');R(rx+rw-2,fy-122,2,122,'#6a7682')}
  R(mid-60,8,120,2,'#8a96a2');for(let x=mid-56;x<mid+56;x+=10){if(Math.abs(x-mid)<22)continue;for(let k=0;k<4;k++){R(x,10+k*7,5,7,k%2?'#8a3a2a':'#9a4a32');R(x+1,11+k*7,2,2,'#b86a4a')}}
  // a thermometer dial on the wall: 34°F
  c.fillStyle='#e8e4d8';c.beginPath();c.arc(mid+96,fy-108,9,0,6.283);c.fill();c.fillStyle='#2a2030';c.beginPath();c.arc(mid+96,fy-108,9,0,6.283);c.lineWidth=1;c.strokeStyle='#2a2030';c.stroke();R(mid+96,fy-114,1,6,'#c8302e');K.signText(c,'34',mid+92,fy-104,'#2a2030');
  // the caged bulb right over his hat, and its cone of warm light so his face reads
  R(mid-1,0,2,10,'#3a4654');c.fillStyle='#fff2c8';c.beginPath();c.arc(mid,14,5,0,6.283);c.fill();for(let k=-4;k<=4;k+=4)R(mid+k,9,1,10,'#3a4654');R(mid-6,13,12,1,'#3a4654');
  c.fillStyle='rgba(255,236,190,.1)';c.beginPath();c.moveTo(mid-10,16);c.lineTo(mid+10,16);c.lineTo(mid+70,fy);c.lineTo(mid-70,fy);c.fill();
  // the floor: frosty diamond plate
  R(0,fy-4,VW,VH,'#28303a')},
 lift:3,
 front(c,v){const{VW,VH,fy,mid,now}=v,R=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))};
  // his breath, fogging up past his chin every few seconds
  const br=(now%3600)/3600;if(br<.45){const a=(.45-br)*.7,y=fy-30-br*26;c.fillStyle=`rgba(240,248,255,${a.toFixed(2)})`;c.beginPath();c.ellipse(mid+30+br*26,y,4+br*10,2+br*4,0,0,6.283);c.fill()}
  // the stainless prep table where the desk would be: a brisket on butcher paper, a cleaver, a squeeze bottle, his toothpicks
  R(0,fy,VW,VH-fy,'#28303a');for(let y=fy+14;y<VH;y+=8)for(let x=((y/8)|0)%2*4;x<VW;x+=8)R(x,y,3,1,'#323c48');R(mid-118,fy,236,10,'#c8d0d8');R(mid-118,fy,236,2,'#f0f4f8');R(mid-118,fy+10,236,3,'#7a8692');
  R(mid-112,fy+13,4,VH-fy-13,'#9aa4ae');R(mid+108,fy+13,4,VH-fy-13,'#9aa4ae');R(mid-112,fy+40,224,3,'#9aa4ae');R(mid-108,fy+13,216,27,'#1e252e');
  for(let i=0;i<9;i++){const x=mid-104+i*24,col=['#e8e4d8','#d8a040','#e8e4d8','#a8323e'][i%4];R(x,fy+22,20,18,col);R(x,fy+22,20,3,shade(col,.25));R(x+2,fy+28,16,5,shade(col,-.2));R(x+18,fy+22,2,18,shade(col,-.35))}
  for(let i=0;i<4;i++){const x=mid-100+i*52;R(x,fy+46,44,26,'#8a6a4a');R(x,fy+46,44,3,'#a88a6a');for(let k=x+4;k<x+44;k+=8)R(k,fy+50,2,22,'#5a4030');R(x+6,fy+44,10,4,'#c8402e');R(x+22,fy+43,8,5,'#e8c84a')}
  R(mid-96,fy-14,58,16,'#e8dcc4');R(mid-96,fy-14,58,2,'#f8f0e0');R(mid-90,fy-12,46,10,'#5a2a1e');R(mid-88,fy-12,42,3,'#3a1812');R(mid-86,fy-8,38,1,'#8a4a32');R(mid-84,fy-5,34,1,'#a86a4a');for(let x=mid-80;x<mid-50;x+=6)R(x,fy-11,1,6,'#2a0e0a');
  R(mid-34,fy-4,24,4,'#c0c8d0');R(mid-34,fy-4,24,1,'#f0f4f8');R(mid-12,fy-5,10,6,'#3a2418');
  R(mid+40,fy-22,10,22,'#a8323e');R(mid+40,fy-22,10,3,'#c8524e');R(mid+43,fy-28,4,6,'#e8e4d8');R(mid+44,fy-31,2,3,'#e8e4d8');R(mid+41,fy-14,8,5,'#e8dcc0');
  R(mid+60,fy-8,26,8,'#e8e4d8');R(mid+60,fy-8,26,1,'#ffffff');for(let x=mid+62;x<mid+84;x+=3)R(x,fy-7,1,6,'#c8a060');
  R(mid+92,fy-12,14,12,'#d8cdb4');R(mid+92,fy-12,14,1,'#f4efe6');R(mid+94,fy-14,3,3,'#e0d8c0');}
};

return{paint,props,folk,portraits,fx,cooler,patchGlint,FOLK,PORT,portraitCanvas};
})();
