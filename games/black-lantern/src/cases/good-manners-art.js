// Black Lantern · cases/good-manners-art.js · Good Manners' art (spec 010 part A, Nov 23, 2026). Exposes window.GMA.
// Art for this case only (Bible, Art, Direction: one case, one set of art); never reuse it in another case.
// Generic pieces come from the Shared Shelf (engine/shelf.js: v1, plus the summer, night light, main street, houses and
// cars, interiors and fair kits spec 012 draws first here), painted with Black Lantern's palette. This file adds the
// case's own pieces (the grain elevator, the motel, the barn, the grandstand, the spinner, the rooms' fittings), its
// townsfolk and the two men on the map and in the dialog box, and Big Hat's briefing place, the combine cab.
// Late summer on the plains (spec 010, Art): dry grass, hot white sky by day, sodium orange and ride colors by night.
// No autumn pieces from the Shelf.
//
//   GMA.paint(M)            the map's still layer -> {c, glows}; GMA.props(M) its standing pieces, sorted with people
//   GMA.folk(id, dir, idle, M)  a townsperson's map sprite -> {c, ax, ay, noShadow}
//   GMA.portraits           speaker name -> (ctx, mouth) drawing the 64 x 64 talking portrait
//   GMA.fx(ctx, o)          the case's light and air after the light pass: heat shimmer by day, sodium light and lit
//                           bulbs at night
//   GMA.combine             Big Hat's briefing place: {back, front} (engine.js bigHatScene)
//   GMA.lessonGlint         how the hidden hotspot looks while it shows
//
// Good Manners' accent colors (Bible, Art, Palette), on top of the base palette:
const GM_ACCENT={wheat:'#d8b24a',sodium:'#ff9a3c',rideCyan:'#4fd8e0',ridePink:'#ff6fae',suit:'#17151d',tan:'#b89a6a'};
window.GMA=(()=>{
const K=SHELF,T=16,S=.5,{F,shade,hsh,RGB,art}=K,A=GM_ACCENT;
const ART={};
const get=(k,spec)=>ART[k]||(ART[k]=K.prop(spec(),S));
const isNight=M=>M.light==='night';

// ================= GROUND =================
const GP={'.':(x,y)=>K.summerGrass(x,y,T,true),':':(x,y)=>K.summerGrass(x,y,T,false),',':(x,y)=>K.stoneSidewalk(x,y,T,true),'=':(x,y)=>K.asphalt(x,y,T),'_':(x,y)=>K.asphalt(x,y,T),
 g:(x,y)=>K.dryDirt(x,y,T,true),x:(x,y)=>K.dryDirt(x,y,T),r:(x,y)=>K.dirtRoad(x,y,T),n:(x,y)=>K.floor(x,y,T,'lino'),c:(x,y)=>K.floor(x,y,T,'carpet'),v:(x,y)=>K.floor(x,y,T,'tile'),w:(x,y)=>K.floor(x,y,T,'wood')};
const SOFT=new Set('.:xgr'.split(''));  // natural ground blends at its edges; paving keeps a crisp curb
const at=(M,x,y)=>{const r=M.ground[y];return r?r[x]:undefined};

// ================= THE STILL LAYER =================
const still={};
function paint(M){
 const key=M.id;if(still[key])return still[key];
 const W=M.w*T,H=M.h*T,c=K.mk(W,H),g=c.getContext('2d'),img=g.createImageData(W,H),d=img.data,glows=[];
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const tx=(x/T)|0,ty=(y/T)|0;let ch=at(M,tx,ty);
  if(SOFT.has(ch)){const jx=Math.min(W-1,Math.max(0,x+((hsh(x>>1,y>>1,61)*5)|0)-2)),jy=Math.min(H-1,Math.max(0,y+((hsh(x>>1,y>>1,62)*5)|0)-2)),jc=at(M,(jx/T)|0,(jy/T)|0);if(SOFT.has(jc))ch=jc}
  const col=(GP[ch]||GP['.'])(x,y),v=RGB(col),i=(y*W+x)*4;d[i]=v[0];d[i+1]=v[1];d[i+2]=v[2];d[i+3]=255}
 g.putImageData(img,0,0);
 // curbs: a dark edge and a lit lip where sidewalk meets road
 for(let ty=0;ty<M.h;ty++)for(let tx=0;tx<M.w;tx++){const a=at(M,tx,ty),b=at(M,tx,ty+1),r=at(M,tx+1,ty);
  if(a===','&&(b==='='||b==='_')){F(g,tx*T,ty*T+T-2,T,1,shade(K.pal().stoneWarm,.2));F(g,tx*T,ty*T+T-1,T,1,'#1c1820')}
  if(b===','&&(a==='='||a==='_'))F(g,tx*T,ty*T+T-1,T,1,'#1c1820');
  if((a===','&&(r==='='))||(r===','&&a==='='))F(g,tx*T+T-1,ty*T,1,T,'#1c1820')}
 (M.lines||[]).forEach(l=>K.paintLine(g,l.x,l.y,l.w,l.h,l.dashed,l.col||A.wheat));
 // soft shadows under the standing pieces (light from the upper left, so they fall a little right)
 M.pieces.filter(p=>PROPK.has(p.k)&&!NOSHADOW.has(p.k)).forEach(p=>{const cx=(p.x+p.w/2)*T+2,cy=(p.y+p.h)*T-2,rx=Math.max(5,p.w*T*.42);
  g.fillStyle='rgba(16,10,20,.28)';g.beginPath();g.ellipse(cx,cy,rx,Math.max(2.5,rx*.28),0,0,6.283);g.fill()});
 // the still pieces, back to front
 M.pieces.filter(p=>STILL[p.k]).sort((a,b)=>(BACK.has(a.k)?-99:a.y+a.h)-(BACK.has(b.k)?-99:b.y+b.h)).forEach(p=>STILL[p.k](g,p,M,glows));
 return still[key]={c,glows};
}
const BACK=new Set(['room','underroom','backlot']);  // walls and the back strip go down first
const box=p=>({x0:p.x*T,x1:(p.x+p.w)*T,y0:p.y*T,fb:(p.y+p.h)*T,w:p.w*T});
const shadowBelow=(g,x0,x1,fb)=>{g.fillStyle='rgba(16,10,20,.32)';g.fillRect(x0+3,fb,x1-x0,3);g.fillStyle='rgba(16,10,20,.16)';g.fillRect(x0+5,fb+3,x1-x0-2,2)};
function signOn(g,rect,text,col,ink){const[x,y,w,h]=rect,inner=K.signBlank(g,x,y,w,h,col);let k=1;const tw=K.signWidth(text,k);
 K.signText(g,text,Math.round(inner[0]+(inner[2]-tw)/2),Math.round(inner[1]+(inner[3]-5)/2),ink)}
const STILL={
 // the strip behind Main Street: a wheat field's edge, the rail siding, poles and dry weeds
 backlot(g,p){const{x0,x1}=box(p);for(let y=0;y<9;y++)for(let x=x0;x<x1;x++){const n=hsh(x,y,301);g.fillStyle=y<1?shade(A.wheat,-.35):(x+y*2)%5===0?shade(A.wheat,-.25):n<.2?shade(A.wheat,.2):A.wheat;g.fillRect(x,y,1,1)}
  F(g,x0,9,x1-x0,2,shade(A.wheat,-.45));
  for(let x=x0;x<x1;x+=5){F(g,x,30,3,9,'#4a3424');F(g,x,30,3,1,'#6a4a32')}F(g,x0,32,x1-x0,1,'#8e8a92');F(g,x0,36,x1-x0,1,'#8e8a92');F(g,x0,33,x1-x0,1,'#3a3640');F(g,x0,37,x1-x0,1,'#3a3640');
  for(let x=x0+40;x<x1;x+=150){F(g,x,6,2,50,'#4a3424');F(g,x-6,10,14,2,'#4a3424');F(g,x-5,9,2,1,'#c0c0c8');F(g,x+5,9,2,1,'#c0c0c8')}
  for(let x=x0;x<x1;x+=150)for(let i=0;i<150;i++){const yy=12+Math.round(Math.sin(i/150*3.14)*5);F(g,x+40+i,yy,1,1,'#2a2030')}
  for(let i=0;i<140;i++){const x=x0+hsh(i,1,302)*(x1-x0),y=42+hsh(i,2,302)*20;F(g,x,y,1,2+((hsh(i,3,302)*3)|0),hsh(i,4,302)<.5?shade(A.wheat,-.2):'#7a6a3a')}},
 // the grain co-op's elevator: four concrete silos and a head house, behind the co-op office
 elevator(g,p){const{x0,x1}=box(p),cw=24,base=62,tone=['#d8d2c4','#c4bcae','#a8a094','#8a8278','#6a6460'];
  for(let i=0;i<5;i++){const sx=x0+8+i*cw;for(let x=0;x<cw;x++){const t=x/cw,k=t<.12?0:t<.4?1:t<.7?2:t<.9?3:4;F(g,sx+x,14,1,base-14,tone[k])}
   F(g,sx,12,cw,3,tone[1]);F(g,sx+2,10,cw-4,2,tone[0]);for(let y=22;y<base;y+=10)F(g,sx,y,cw,1,'#8a8278');F(g,sx+cw-1,14,1,base-14,'#4a4448')}
  F(g,x0+52,0,30,26,'#b8b0a2');F(g,x0+52,0,6,26,'#d4cec0');F(g,x0+78,0,4,26,'#7a7470');F(g,x0+60,6,6,6,'#2a2030');F(g,x0+70,6,6,6,'#2a2030');F(g,x0+52,24,30,2,'#5a5458');
  for(let i=0;i<20;i++)F(g,x0+82+i*2,24+i,3,2,'#8a8278')},
 store(g,p,M,glows){const{x0,x1,y0,fb}=box(p),face=(p.upper?2.6:2)*T,top=fb-face;
  F(g,x0-1,y0+3,x1-x0+2,top-y0-1,'#45404c');for(let y=y0+4;y<top;y+=2)for(let x=x0;x<x1;x+=2)if(hsh(x,y,311)<.18)F(g,x,y,1,1,'#55505c');
  F(g,x0-1,y0+3,x1-x0+2,1,'#5a5662');F(g,x0+8,y0+7,12,6,'#8a8a94');F(g,x0+8,y0+7,12,1,'#aaaab4');F(g,x0+18,y0+7,2,6,'#5a5a64');
  const r=K.storefront(g,x0,x1,top,fb,T,{col:p.col,door:p.door*T+8,upper:p.upper,trim:p.dark?'#a89a84':undefined});
  if(p.awning)K.awning(g,x0+3,x1-3,fb-T*1.12,T);
  signOn(g,[r.sign[0],r.sign[1],r.sign[2],Math.min(9,r.sign[3])],p.sign,p.dark?'#a89a84':'#e8dcc0',p.dark?'#6a5a4a':'#7a2a2e');
  if(!p.dark)r.glows.forEach(x=>glows.push(x));else{F(g,x0+5,fb-12,18,7,'#e8dcc0');K.signText(g,'LEASE',x0+5,fb-11,'#a8323e')}
  shadowBelow(g,x0,x1,fb)},
 coop(g,p,M,glows){const{x0,x1,y0,fb}=box(p),top=fb-2.2*T;
  K.roof(g,x0,x1,y0+4,top,'#7a7f88',T,7,false);K.wall(g,x0,x1,top,fb,'batten','#a8acb2',T);
  signOn(g,[x0+8,top+3,x1-x0-16,9],p.sign,'#e8dcc0','#2e4a6a');
  glows.push(K.windowPane(g,x0+.5*T,fb-1.1*T,.9*T,.6*T,T,false));glows.push(K.windowPane(g,x0+1.6*T,fb-1.1*T,.9*T,.6*T,T,false));
  K.door(g,p.door*T+8,fb-.95*T,fb,'#4a5a6a',T);K.door(g,x1-1.6*T,fb-1.3*T,fb,'#6a6e76',T,true);shadowBelow(g,x0,x1,fb)},
 station(g,p,M,glows){const{x0,x1,y0,fb}=box(p),top=fb-1.6*T;
  F(g,x0-4,y0,x1-x0+8,top-y0,'#3e3a46');F(g,x0-4,y0,x1-x0+8,2,'#5a5662');F(g,x0-4,top-3,x1-x0+8,3,A.sodium);F(g,x0-4,top-1,x1-x0+8,1,'#8a4a1a');
  K.wall(g,x0,x1,top,fb,'siding','#e2dccb',T);signOn(g,[x0+6,top+2,26,9],p.sign,'#e8dcc0','#a8323e');
  glows.push(K.windowPane(g,x0+.4*T,fb-1*T,1.4*T,.62*T,T,false));K.door(g,p.door*T+8,fb-.95*T,fb,'#5a6a7a',T);
  F(g,x0+2.4*T,fb-.6*T,.8*T,.55*T,'#d8e8f0');F(g,x0+2.4*T,fb-.6*T,.8*T,2,'#3a6aa8');K.signText(g,'ICE',x0+2.45*T,fb-.4*T,'#3a6aa8');shadowBelow(g,x0,x1,fb)},
 motel(g,p,M,glows){const{x0,x1,y0,fb}=box(p),rb=fb-1.7*T;
  K.roof(g,x0,x1,y0+6,rb,'#3e5a5a',T,9,false);K.wall(g,x0,x1,rb,fb,'siding','#d8c8a0',T);F(g,x0,rb,x1-x0,3,'rgba(20,10,20,.3)');
  for(let x=x0+T*.2;x<x1;x+=2*T){F(g,x,rb+2,2,fb-rb-2,'#efe4c8');F(g,x+2,rb+2,1,fb-rb-2,'#9a8a6a')}
  // the office on the left, then the rooms, each with its number plate, a curtained window and an air unit
  glows.push(K.windowPane(g,x0+.25*T,fb-1.2*T,1.1*T,.7*T,T,false));glows.push([x0+.8*T,fb-.85*T,2*T,.5]);signOn(g,[x0+4,rb+3,24,8],'OFFICE','#e8dcc0','#2e4a6a');
  K.door(g,p.door*T+8,fb-.95*T,fb,'#6a3a2e',T);
  p.rooms.forEach((rx,i)=>{const cx=rx*T+8;F(g,cx-2,fb-1.42*T,5,3,'#ffe9b0');F(g,cx-3,fb-1.42*T-1,7,1,'#5a5a64');glows.push([cx,fb-1.3*T,1.4*T,.5]);  // a porch light over each door
   K.door(g,cx,fb-.95*T,fb,i%2?'#3e6a6a':'#4a7a7a',T);F(g,cx-3,fb-1.22*T,7,6,'#e8dcc0');K.signText(g,String(i+1),cx-1,fb-1.22*T+1,'#2a2030');
   if(rx+1<p.x+p.w){glows.push(K.windowPane(g,cx+.45*T,fb-1.1*T,.55*T,.45*T,T,true));F(g,cx+.5*T,fb-.55*T,.45*T,.25*T,'#b8b8c0');F(g,cx+.5*T,fb-.55*T,.45*T,1,'#d8d8e0')}});
  shadowBelow(g,x0,x1,fb)},
 house(g,p,M,glows){const{x0,x1,y0,fb,w}=box(p),rb=fb-1.3*T,dr=p.door*T+8;
  const r=K.ranchHouse(g,x0,x1,y0+4,rb,fb,T,{col:p.col,roofCol:p.roof,door:dr,garage:p.garage,curtains:p.curtains,shutters:p.shutters,seed:p.seed,chim:p.seed%2===1});
  r.glows.forEach(x=>glows.push(x));
  if(p.shut){const ww=.7*T,wh=Math.min(.6*T,fb-rb-.55*T);for(let wx=x0+.35*T;wx+ww<x1-.2*T;wx+=1.15*T){if(Math.abs(wx+ww/2-dr)<.75*T)continue;
   F(g,wx+1,rb+.28*T+1,ww-2,wh-2,'#8a3a4a');for(let k=wx+2;k<wx+ww-2;k+=2)F(g,k,rb+.28*T+1,1,wh-2,'#6a2a3a');F(g,wx+ww/2,rb+.28*T+1,1,wh-2,'#4a1a2a')}}
  if(p.porch)K.porch(g,dr-1.5*T,Math.min(x1-.2*T,dr+1.8*T),fb,T,{stepX:dr,roof:true});
  shadowBelow(g,x0,x1,fb)},
 fence(g,p){const{x0,x1,y0}=box(p);K.picketFence(g,x0,x1,y0+4,T)},
 fairfence(g,p){const{x0,x1,y0}=box(p);for(let x=x0;x<x1;x+=14){F(g,x,y0-2,3,16,'#5a4030');F(g,x,y0-2,1,16,'#7a5a40')}F(g,x0,y0+2,x1-x0,2,'#7a5a40');F(g,x0,y0+8,x1-x0,2,'#6a4a34');
  const cols=[A.ridePink,A.rideCyan,A.wheat,'#e8dcc0'];for(let x=x0;x<x1;x+=6){const k=((x/6)|0)%4;for(let i=0;i<4;i++)F(g,x+i/2,y0-6+i,4-i,1,cols[k])}F(g,x0,y0-7,x1-x0,1,'#2a2030')},
 // the livestock barn: red board-and-batten, a metal roof, a big sliding door and a painted sign
 barn(g,p,M,glows){const{x0,x1,y0,fb}=box(p),rb=fb-2*T;K.roof(g,x0,x1,y0+4,rb,'#8a8e96',T,11,false);for(let x=x0+6;x<x1;x+=10)F(g,x,y0+4,1,rb-y0-4,'#6a6e76');
  K.wall(g,x0,x1,rb,fb,'batten','#9a3a2a',T);K.door(g,(x0+x1)/2,fb-1.6*T,fb,'#7a2a1e',T,true);
  for(const[a,b]of[[x0+.5*T,x0+2.2*T],[x1-2.2*T,x1-.5*T]]){F(g,a,rb+.3*T,b-a,.6*T,'#e8dcc0');F(g,a+2,rb+.3*T+2,b-a-4,.6*T-4,'#2a1a18')}
  signOn(g,[x0+2.6*T,rb-9,x1-x0-5.2*T,9],'LIVESTOCK','#e8dcc0','#7a2a1e');shadowBelow(g,x0,x1,fb)},
 // the grandstand from its end: bench tiers stepping up, a roof on posts, the dark underside with a chain-link gate
 grandstand(g,p,M,glows){const{x0,x1,y0,fb}=box(p),under=fb-1.6*T,N=isNight(M);
  F(g,x0-2,y0,x1-x0+4,8,'#5a6a7a');F(g,x0-2,y0,x1-x0+4,2,'#7a8a9a');F(g,x0-2,y0+8,x1-x0+4,2,'#2a2a34');
  for(let y=y0+10,i=0;y<under;y+=7,i++){F(g,x0,y,x1-x0,4,i%2?'#a8865a':'#b8966a');F(g,x0,y,x1-x0,1,'#d0b088');F(g,x0,y+4,x1-x0,3,'#4a3a30');
   if(N||i%2)for(let x=x0+4;x<x1-4;x+=7)if(hsh(x,y,321)<(N?.45:.25)){const c=[A.ridePink,A.rideCyan,'#e8dcc0','#5a6a8a','#b5532e'][(hsh(x,y,322)*5)|0];F(g,x,y-3,3,4,c);F(g,x,y-5,3,2,'#c98e62')}}
  F(g,x0,under,x1-x0,fb-under,'#14101a');for(let x=x0;x<x1;x+=24){g.strokeStyle='#3a3440';g.lineWidth=1;g.beginPath();g.moveTo(x+.5,under);g.lineTo(x+24.5,fb);g.moveTo(x+24.5,under);g.lineTo(x+.5,fb);g.stroke();F(g,x,under,2,fb-under,'#5a5a64')}
  const gx=33*T;F(g,gx,under+3,T,fb-under-3,'#2a2a34');for(let y=under+3;y<fb;y+=3)for(let x=gx;x<gx+T;x+=3)F(g,x+(y%2),y,1,1,'#8a8e96');F(g,gx,under+3,T,1,'#aab0b8');
  if(!N){F(g,gx+6,under+9,4,4,'#8a8e96');F(g,gx+7,under+7,2,2,'#aab0b8')}
  for(const lx of[x0+4,x1-8]){F(g,lx,y0-30,3,30,'#5a5a64');F(g,lx-6,y0-36,15,7,'#3a3a44');for(let i=0;i<3;i++)F(g,lx-5+i*5,y0-35,3,5,N?'#fff6d8':'#c8c8d0');if(N)glows.push([lx+1,y0-32,3*T,.45])}
  shadowBelow(g,x0,x1,fb)},
 // interiors: the back wall, the side walls and the bottom wall with its door gap, then each room's fittings
 room(g,p,M,glows){const W=M.w*T,H=M.h*T,kind={office:['plain','#a8b4a0'],diner:['plain','#d8c49a'],motel:['plain','#b8a488'],morgue:['plain','#a8bcb4']}[M.id]||['plain','#b8a888'];
  K.innerWall(g,T,W-T,0,3*T,kind[0],kind[1],T);
  F(g,0,0,T,H,'#1e1826');F(g,T-2,0,2,H-T,'#3a3046');F(g,W-T,0,T,H,'#1e1826');F(g,W-T,0,2,H-T,'#2a2236');
  F(g,0,H-T,W,T,'#1e1826');F(g,T,H-T,W-2*T,2,'#3a3046');
  const dx=Object.keys(M.warps)[0];if(dx){const[x]=dx.split(',').map(Number);F(g,x*T+1,H-T,T-2,T,'#6a4a3a');F(g,x*T+3,H-T+3,T-6,T-6,'#8a5a3a');for(let i=0;i<4;i++)F(g,x*T+4,H-T+5+i*2,T-8,1,'#5a3a2a')}
  (DECOR[M.id]||(()=>{}))(g,M,glows)},
 rug(g,p){const{x0,x1,y0,fb}=box(p);F(g,x0+2,y0+2,x1-x0-4,fb-y0-4,p.col);F(g,x0+4,y0+4,x1-x0-8,fb-y0-8,shade(p.col,.15));F(g,x0+6,y0+6,x1-x0-12,fb-y0-12,p.col);
  for(let x=x0+8;x<x1-8;x+=6)F(g,x,(y0+fb)/2-1,3,3,'#d8b24a')},
 cell(g,p){const{x0,x1,y0,fb}=box(p);F(g,x0,y0,x1-x0,fb-y0,'#7a8478');F(g,x0+2,y0+4,30,10,'#5a6a4a');F(g,x0+2,y0+4,30,2,'#e8e8e0');F(g,x1-14,y0+6,10,8,'#c8c8c8');
  for(let x=x0;x<=x1;x+=5){F(g,x,y0-4,2,fb-y0+4,'#3a3a44');F(g,x,y0-4,1,fb-y0+4,'#8a8a94')}F(g,x0,y0-4,x1-x0+2,2,'#3a3a44');F(g,x0,fb-6,x1-x0+2,2,'#3a3a44')},
 drawers(g,p){const{x0,x1}=box(p);F(g,x0+4,4,x1-x0-8,42,'#8e9498');F(g,x0+4,4,x1-x0-8,2,'#c0c6ca');
  for(let j=0;j<3;j++)for(let i=0;i<4;i++){const x=x0+8+i*21,y=8+j*12;F(g,x,y,19,10,'#b0b6ba');F(g,x,y,19,1,'#d8dee2');F(g,x+18,y,1,10,'#6a7074');F(g,x+7,y+6,5,2,'#4a5054');if(j===1&&i<3){F(g,x+5,y+2,9,3,'#f4efe6');F(g,x+6,y+3,7,1,'#7a6a5a')}}},
 xray(g,p,M,glows){const{x0}=box(p);F(g,x0+2,10,26,20,'#2a2a30');F(g,x0+4,12,22,16,'#dff4f0');for(let i=0;i<5;i++)F(g,x0+9,14+i*3,12,1,'#8ab4b0');F(g,x0+14,13,2,14,'#8ab4b0');glows.push([x0+15,20,T,.25])},
 underroom(g,p,M,glows){const W=M.w*T;F(g,0,0,W,2*T,'#1a141c');
  for(let y=0,i=0;y<2*T;y+=5,i++){F(g,0,y,W,3,i%2?'#3a2c26':'#2e241e');F(g,0,y+3,W,1,'#0c080e')}
  for(let x=30;x<W;x+=46){F(g,x,0,1,2*T,'#ffcf80');F(g,x+1,0,1,2*T,'#c88a40');glows.push([x,T,T*1.2,.35])}
  for(let x=0;x<W;x+=40){g.strokeStyle='#4a3a40';g.beginPath();g.moveTo(x+.5,2*T);g.lineTo(x+20.5,M.h*T);g.stroke();F(g,x,2*T,3,M.h*T,'#2a2228')}
  F(g,0,0,T,M.h*T,'#0c080e');F(g,W-T,0,T,M.h*T,'#0c080e');F(g,0,M.h*T-T,W,T,'#0c080e');
  for(let x=40;x<W;x+=46)for(let y=2*T;y<M.h*T-T;y+=2)if((y>>1)%2)F(g,x-6+(y-2*T)*.3,y,4,1,'rgba(255,207,128,.08)')},
 drain(g,p){const x=p.x*T+4,y=p.y*T+4;F(g,x,y,8,8,'#5a6064');for(let i=0;i<4;i++)F(g,x+1,y+1+i*2,6,1,'#2a2e30');F(g,x,y,8,1,'#8a9094')},
 ac(g,p){const x=p.x*T;F(g,x+1,p.y*T+2,14,9,'#b8b8c0');F(g,x+1,p.y*T+2,14,1,'#e0e0e8');for(let i=0;i<5;i++)F(g,x+3,p.y*T+4+i*1.4,10,1,'#7a7a84');F(g,x+1,p.y*T+11,14,1,'#5a5a64')},
 chalk(g,p){const{x0,x1}=box(p);F(g,x0-2,6,x1-x0+4,22,'#5a3e2b');F(g,x0,8,x1-x0,18,'#22302a');for(let i=0;i<30;i++)F(g,x0+2+hsh(i,1,331)*(x1-x0-4),9+hsh(i,2,331)*16,2,1,'#3a4a42');
  K.signText(g,'SATURDAY',x0+(x1-x0-31)/2,11,'#e8e4d8');F(g,x0+6,19,x1-x0-12,1,'#8a9a90');F(g,x0-2,27,x1-x0+4,2,'#7a5a3e');F(g,x0+10,26,4,1,'#f4f4f4')}
};
// each room's wall fittings
const DECOR={
 office(g,M,glows){glows.push(K.windowPane(g,9*T,.7*T,1.6*T,1.2*T,T,false));F(g,9*T,.7*T,1.6*T,4,'#8a8e74');
  F(g,2*T,.6*T,1.5*T,1.1*T,'#9a6a3a');F(g,2*T+2,.6*T+2,1.5*T-4,1.1*T-4,'#c09060');for(let i=0;i<5;i++)F(g,2*T+4+i*4,.6*T+4+(i%2)*6,3,5,'#f4efe6');
  F(g,6*T,.5*T,10,10,'#e8e4d8');F(g,6*T+4,.5*T+2,1,4,'#2a2030');F(g,6*T+5,.5*T+5,3,1,'#2a2030');
  F(g,12*T,.5*T,12,16,'#e8dcc0');K.signText(g,'WANTED',12*T-6,.5*T+18,'#7a2a2e')},
 diner(g,M,glows){F(g,T,1.6*T,13*T,3,'#a8323e');glows.push(K.windowPane(g,10*T,.5*T,2.4*T,1.3*T,T,true));
  F(g,2*T,.35*T,6*T,.9*T,'#2a2030');F(g,2*T+2,.35*T+2,6*T-4,.9*T-4,'#3a3046');['PIE 3.50','COFFEE .75','EGGS 4.00'].forEach((t,i)=>K.signText(g,t,2*T+5+(i%2)*46,.35*T+3+(i>1?6:0),'#e8dcc0'));
  F(g,13*T,.5*T,10,10,'#e8e4d8');F(g,13*T+4,.5*T+2,1,4,'#2a2030')},
 motel(g,M,glows){for(let y=4;y<3*T-6;y+=8)for(let x=T+((y/8|0)%2)*6;x<M.w*T-T;x+=12){F(g,x,y,3,3,'#a07a6a');F(g,x+1,y-1,1,1,'#7a9a6a')}
  glows.push(K.windowPane(g,6*T,.6*T,1.8*T,1.1*T,T,true));F(g,2.2*T,.5*T,1.2*T,.8*T,'#7a5a3e');F(g,2.2*T+2,.5*T+2,1.2*T-4,.8*T-4,'#5a7a9a');F(g,2.2*T+2,.5*T+8,1.2*T-4,.8*T-10,'#d8b24a');
  F(g,10*T,.4*T,T,2.6*T,'#8a6a4a');F(g,10*T+2,.4*T+2,T-4,2.6*T-2,'#a07a5a');F(g,10*T+11,1.6*T,2,2,'#d6a43a')},
 morgue(g,M,glows){for(let y=4;y<3*T-4;y+=6)F(g,T,y,M.w*T-2*T,1,'#90a49c');for(let x=T;x<M.w*T-T;x+=6)F(g,x,4,1,3*T-8,'#90a49c');
  F(g,12*T,.4*T,10,10,'#e8e4d8');F(g,12*T+4,.4*T+2,1,4,'#2a2030');F(g,7*T,0,2*T,4,'#e8f4f0');glows.push([8*T,6,2*T,.3])}
};

// ================= STANDING PIECES =================
// Case pieces, drawn in the shelf's method (design pixels at s = 0.5, dark outline, hard shade)
const POLE='#4a3424';
const SPEC={
 welcome:()=>({size:[64,54,0,0],anchor:[32,52],lights:[],draw({R}){R(8,24,4,28,POLE,{sh:1});R(52,24,4,28,POLE,{sh:1});R(0,0,64,28,'#e8dcc0',{sh:6});R(0,0,64,2,'#fff6e0');R(2,2,60,24,'#3e6a4a');R(2,2,60,1,'#5e8a6a')}}),
 motelsign:()=>({size:[40,96,0,0],anchor:[20,94],lights:[[20,22,1.6,.45]],draw({R}){R(18,40,4,54,'#5a5a64',{sh:1});R(14,90,12,4,'#3a3a44');R(0,0,40,42,'#2e4a5a',{sh:8});R(0,0,40,2,'#4a6a7a');R(2,32,36,8,'#e8dcc0')}}),
 cabinet:()=>({size:[22,50,0,0],anchor:[11,48],lights:[],draw({R}){R(0,0,22,48,'#7a8478',{sh:5});R(0,0,22,2,'#9aa498');for(const y of[4,16,28,40]){R(2,y,18,10,'#8a9488');R(8,y+4,6,2,'#3a3a44');R(9,y+1,4,2,'#e8e4d8')}}}),
 plant:()=>({size:[24,44,0,0],anchor:[12,42],lights:[],draw({R,C}){R(5,28,14,14,'#b5532e',{sh:3});R(4,27,16,3,'#c8683e');const L=K.pal().leaf;C(12,16,9,shade(L,-.2));C(8,12,6,L);C(16,10,6,L);C(12,5,5,shade(L,.2));C(6,20,4,shade(L,.1))}}),
 piecase:()=>({size:[64,46,0,0],anchor:[32,44],lights:[[14,12,.9,.35]],draw({R,E}){R(0,18,64,26,'#8a6a4a',{sh:8});R(0,16,64,4,'#a88a6a');R(4,2,20,16,'#3a3a44',{sh:4});R(8,6,12,6,'#d6a43a');R(10,14,8,4,'#5a3a2a');
  E(44,10,14,9,'#cfe4ea');E(44,12,11,6,'#d9772b');E(44,10,10,4,'#e8a050');R(43,0,2,3,'#cfe4ea')}}),
 jukebox:()=>({size:[28,52,0,0],anchor:[14,50],lights:[[14,14,1,.45]],draw({R,E}){E(14,12,13,12,'#a8323e');R(1,12,26,38,'#a8323e',{sh:5});E(14,12,10,9,'#ff9a3c');E(14,12,7,6,'#ffd166');R(4,26,20,10,'#2a2030');for(let x=6;x<22;x+=3)R(x,28,2,6,'#e8dcc0');R(4,40,20,6,'#5a2a2e')}}),
 luggage:()=>({size:[28,36,0,0],anchor:[14,34],lights:[],draw({R}){R(2,26,24,8,'#5a4a3a');R(2,24,24,3,'#7a6a5a');R(4,8,20,16,'#6a3a5a',{sh:4});R(4,8,20,2,'#8a5a7a');R(11,4,6,5,'#3a2a2e');R(4,15,20,1,'#4a2a3e')}}),
 chair:()=>({size:[22,40,0,0],anchor:[11,38],lights:[],draw({R}){R(3,0,16,14,'#5a5a64',{sh:3});R(3,0,16,2,'#8a8a94');R(2,16,18,5,'#6a6a74',{sh:3});R(3,21,2,17,'#3a3a44');R(17,21,2,17,'#3a3a44');R(5,14,2,4,'#3a3a44');R(15,14,2,4,'#3a3a44')}}),
 slab:()=>({size:[96,40,0,0],anchor:[48,38],lights:[],draw({R}){R(2,8,92,14,'#b0b6ba',{sh:10});R(2,8,92,2,'#e0e6ea');R(6,4,84,10,'#e8ece8',{sh:8});R(6,4,84,2,'#ffffff');for(let x=14;x<86;x+=14)R(x,6,1,8,'#c8ccc8');
  R(10,22,4,14,'#6a7074');R(82,22,4,14,'#6a7074');R(44,22,8,14,'#7a8084');R(36,34,24,3,'#4a5054')}}),
 sink:()=>({size:[24,46,0,0],anchor:[12,44],lights:[],draw({R}){R(0,12,24,10,'#b0b6ba',{sh:4});R(2,14,20,5,'#6a7074');R(10,4,3,9,'#8a9094');R(10,4,7,2,'#8a9094');R(4,22,16,22,'#8e9498',{sh:4})}}),
 tack:()=>({size:[28,24,0,0],anchor:[14,22],lights:[],draw({R}){R(0,6,28,16,'#5a6a4a',{sh:5});R(0,4,28,4,'#6a7a5a');R(0,4,28,1,'#8a9a7a');R(11,10,6,4,'#c8c8c8');R(3,12,8,1,'#d8d4c4')}}),
 pole:()=>({size:[10,96,0,0],anchor:[5,94],lights:[],draw({R}){R(3,0,4,94,POLE,{sh:1});R(0,4,10,2,POLE);R(1,90,8,4,'#2a1e16')}}),
 swingset:()=>({size:[96,64,0,0],anchor:[48,60],lights:[],draw({R}){const m='#8a4a3a';for(const x of[4,88]){R(x,4,4,56,m,{sh:1});R(x-4,54,12,4,shade(m,-.3))}R(4,2,88,4,m,{sh:2});R(2,2,92,1,shade(m,.25))}}),
 pen:()=>({size:[96,52,0,0],anchor:[48,50],lights:[],draw({R}){const w='#8a6a4a';for(let x=0;x<=92;x+=23)R(x,8,4,40,w,{sh:1});for(const y of[14,28])R(0,y,96,4,shade(w,.1),{sh:0});R(0,14,96,1,shade(w,.3))}})
};
const PROPK=new Set(['tree','lamp','pump','bench','car','blackcar','tower','welcome','motelsign','mailbox','traffic','desk','cabinet','shelfin','benchin','plant','counter','piecase','table','cups','jukebox','bed','nightstand','chair','slab','sink','wheel','spinner','booth','pen','tack','pole','lights','arch','swing']);
const NOSHADOW=new Set(['traffic','lights','arch','cups','piecase','wheel','spinner','pole']);
function props(M){
 const out=[],N=isNight(M);
 const add=(a,fx,fy,p,o={})=>{const X=Math.round(fx-a.ax),Y=Math.round(fy-a.ay);
  out.push(Object.assign({tx:p.x,ty:p.y,x:fx,y:fy,top:Y,draw:(c,ox,oy)=>c.drawImage(a.c,X+ox,Y+oy),
   lights:(a.lights||[]).map(([lx,ly,r,al])=>[X+a.sx(lx),Y+a.sy(ly),r*T,al,!!o.pool])},o.extra||{}))};
 const dyn=(p,fx,fy,top,draw,o={})=>out.push(Object.assign({tx:p.x,ty:p.y,x:fx,y:fy,top,draw,lights:o.lights||[]},o.extra||{}));
 for(const p of M.pieces){if(!PROPK.has(p.k))continue;const cx=(p.x+p.w/2)*T,fy=(p.y+p.h)*T-2;
  switch(p.k){
  case'tree':{const v=(p.x*3+p.y*5)%3,a=get('tree'+v,()=>K.summerTree(v)),X=Math.round(cx-a.ax),Y=Math.round(fy+1-a.ay);add(a,cx,fy+1,p,{extra:{canopy:[X+6,Y,a.c.width-12,a.c.height-16]}});break}
  case'lamp':add(get('lamp',()=>K.LAMP),cx,fy+1,p,{pool:true,extra:{sodium:[cx,fy-2]}});out[out.length-1].lights.push([cx,fy-2,1.8*T,.4,true]);break;  // a second pool on the ground under the head
  case'pump':add(get('pump',()=>K.gasPump('#b5532e')),cx,fy,p);break;
  case'bench':case'benchin':add(get('bench',()=>K.BENCH),cx,fy,p);break;
  case'car':add(get('car',()=>K.sedan('side',p.tint||'cloth')),cx,fy,p);break;
  case'blackcar':{const a=get('blackcar',()=>K.sedan('side',A.suit,true));add(a,cx,fy,p,{extra:N?{over:(c,ox,oy)=>{c.fillStyle='rgba(255,154,60,.55)';c.fillRect(Math.round(cx-24+ox),Math.round(fy-17+oy),2,1);c.fillRect(Math.round(cx+8+ox),Math.round(fy-17+oy),2,1)}}:{}});break}
  case'tower':{const a=get('tower',()=>K.WATERTOWER);if(!a.named){a.named=1;const g=a.c.getContext('2d'),t='ODESSA FLATS';K.signText(g,t,Math.round(a.sx(60)-K.signWidth(t)/2),a.sy(64),'#2e3a5a')}add(a,cx,fy+1,p);break}
  case'welcome':{const a=get('welcome',SPEC.welcome);if(!a.named){a.named=1;const g=a.c.getContext('2d');[['WELCOME TO',4],['ODESSA FLATS',10],['POP. 900',16]].forEach(([t,y])=>K.signText(g,t,Math.round(a.sx(32)-K.signWidth(t)/2),a.sy(0)+y-2,'#e8dcc0'))}add(a,cx,fy,p);break}
  case'motelsign':{const a=get('motelsign',SPEC.motelsign);if(!a.named){a.named=1;const g=a.c.getContext('2d');K.signText(g,'MOTEL',a.sx(5),a.sy(6),A.wheat,1);K.signText(g,'PRAIRIE',a.sx(4),a.sy(18),'#e8dcc0');K.signText(g,'REST',a.sx(10),a.sy(25),'#e8dcc0');K.signText(g,'VACANCY',a.sx(5),a.sy(34),'#a8323e')}
   add(a,cx,fy,p,{extra:N?{over:(c,ox,oy)=>{if(Math.floor(performance.now()/900)%7===0)return;c.fillStyle='rgba(255,111,174,.85)';const X=Math.round(cx-a.ax)+a.sx(5),Y=Math.round(fy-a.ay)+a.sy(34);K.signText(c,'VACANCY',X+ox,Y+oy,A.ridePink)}}:{}});break}
  case'mailbox':add(get('mail'+(p.flag?1:0),()=>K.mailbox(p.flag)),cx,fy,p);break;
  case'traffic':{const x0=(p.x-1)*T+8,y0=(p.y-1)*T-22,x1=(p.x+p.w+1)*T+8,y1=(p.y+p.h)*T-22,mx=(x0+x1)/2,my=(y0+y1)/2+5;
   dyn(p,mx,(p.y+p.h+1)*T,y0,(c,ox,oy)=>{const lit=Math.floor(performance.now()/600)%2===0,a=get('tl'+(lit?1:0),()=>K.trafficLight(lit));
    c.fillStyle='#14101a';for(let i=0;i<=60;i++){const t=i/60,x=x0+(x1-x0)*t,y=y0+(y1-y0)*t+Math.sin(t*3.14)*5;c.fillRect(Math.round(x+ox),Math.round(y+oy),1,1)}
    c.drawImage(a.c,Math.round(mx-a.ax+ox),Math.round(my-a.ay+oy))},{lights:[[mx,my+11,1.1*T,.4,false]],extra:{over:(c,ox,oy)=>{if(Math.floor(performance.now()/600)%2)return;c.fillStyle='#ffd166';c.fillRect(Math.round(mx-2+ox),Math.round(my+9+oy),4,4)}}});break}
  case'desk':add(get(p.tv?'tvdesk':'desk',()=>p.tv?TVDESK:K.DESK),cx,fy,p);break;
  case'cabinet':add(get('cabinet',SPEC.cabinet),cx,fy,p);break;
  case'shelfin':add(get('shelf'+p.w,()=>K.shelving(p.stocked!==false,p.w*30)),cx,fy,p);break;
  case'plant':add(get('plant',SPEC.plant),cx,fy,p);break;
  case'counter':add(get('counter'+p.w,()=>K.counter(p.w)),cx,fy+10,p);break;
  case'piecase':add(get('piecase',SPEC.piecase),cx,fy,p);break;
  case'table':add(get(M.id==='fair'?'picnic':'table',()=>K.tableChairs(M.id==='fair'?'#a8865a':'#b8d0c8')),cx,fy,p);break;
  case'cups':dyn(p,cx,fy+1,fy-14,(c,ox,oy)=>{for(const dx of[-5,3]){c.fillStyle='#f4efe6';c.fillRect(Math.round(cx+dx+ox),Math.round(fy-13+oy),4,3);c.fillStyle='#3a2418';c.fillRect(Math.round(cx+dx+ox),Math.round(fy-13+oy),4,1)}});break;
  case'jukebox':add(get('jukebox',SPEC.jukebox),cx,fy,p);break;
  case'bed':add(get('bed',()=>K.BED),cx+2,fy,p);break;
  case'nightstand':add(get('luggage',SPEC.luggage),cx,fy,p);break;
  case'chair':add(get(M.id==='under'?'fold':'chair',SPEC.chair),cx,fy,p);break;
  case'slab':add(get('slab',SPEC.slab),cx,fy,p);break;
  case'sink':add(get('sink',SPEC.sink),cx,fy,p);break;
  case'tack':add(get('tack',SPEC.tack),cx,fy,p);break;
  case'pole':add(get('pole',SPEC.pole),cx,fy,p);break;
  case'swing':{const a=get('swing',SPEC.swingset);add(a,cx,fy,p);dyn(p,cx,fy+.5,fy-28,(c,ox,oy)=>{const sw=Math.sin(performance.now()/900)*3;for(const dx of[-12,10]){c.fillStyle='#3a3440';const bx=cx+dx+ox,by=fy-28+oy;
    for(let i=0;i<16;i++)c.fillRect(Math.round(bx+sw*i/16),Math.round(by+i),1,1);c.fillStyle='#a8323e';c.fillRect(Math.round(bx+sw-3),Math.round(by+16),7,2)}});break}
  case'pen':{const a=get('pen',SPEC.pen);dyn(p,cx,fy-1,fy-20,(c,ox,oy)=>goat(c,cx-14+Math.round(Math.sin(performance.now()/2300)*10)+ox,fy-6+oy,performance.now()));add(a,cx,fy,p);break}
  case'booth':{const a=get('booth'+p.sign,()=>K.booth(p.stripe));if(!a.named){a.named=1;const g=a.c.getContext('2d');K.signText(g,p.sign,Math.round(a.sx(36)-K.signWidth(p.sign)/2),a.sy(-11),'#7a2a2e')}
   add(a,cx,fy+2,p,{pool:N,extra:N?{over:(c,ox,oy)=>{const X=Math.round(cx-a.ax),Y=Math.round(fy+2-a.ay);c.fillStyle='rgba(255,246,200,.5)';c.fillRect(X+a.sx(6)+ox,Y+a.sy(2)+oy,a.sx(64)-a.sx(6),2)}}:{}});break}
  case'wheel':{const hx=cx,hy=(p.y-1)*T+8,r=3.6*T;dyn(p,hx,fy,hy-r-8,(c,ox,oy)=>K.ferrisWheel(c,hx+ox,hy+oy,r,performance.now()/(N?9000:6000),false),
   {lights:N?[[hx,hy,1.4*T,.35,false],[hx,fy,2.6*T,.5,true]]:[],extra:N?{over:(c,ox,oy)=>K.ferrisWheel(c,hx+ox,hy+oy,r,performance.now()/9000,true)}:{}});break}
  case'spinner':{const sx=cx,sy=fy-14;dyn(p,sx,fy,sy-46,(c,ox,oy)=>spinner(c,sx+ox,sy+oy,performance.now(),false),{lights:N?[[sx,sy-10,2.2*T,.5,true]]:[],extra:N?{over:(c,ox,oy)=>spinner(c,sx+ox,sy+oy,performance.now(),true,true)}:{}});break}
  case'lights':{const[a,b]=[p.from,p.to],x0=a[0]*T+8,y0=a[1]*T-30,x1=b[0]*T+8,y1=b[1]*T-30;
   dyn(p,(x0+x1)/2,Math.max(y0,y1)+60,Math.min(y0,y1),(c,ox,oy)=>K.stringLights(c,x0+ox,y0+oy,x1+ox,y1+oy,7,false,0),
    {extra:N?{over:(c,ox,oy)=>K.stringLights(c,x0+ox,y0+oy,x1+ox,y1+oy,7,true,performance.now())}:{}});break}
  case'arch':{const x0=p.x*T,x1=(p.x+p.w)*T,fy2=(p.y+1)*T;dyn(p,cx,fy2+40,fy2-62,(c,ox,oy)=>arch(c,x0+ox,x1+ox,fy2+oy,N));break}
  }}
 return out}
// the motel room's desk with a little TV on it instead of a lamp
const TVDESK={size:[64,54,0,0],anchor:[32,50],lights:[],draw(a){K.DESK.draw(a);const{R}=a;R(40,-2,20,16,'#2a2a30',{sh:4});R(42,0,16,11,'#5a7a8a');R(42,0,16,2,'#8aaaba');R(46,14,8,2,'#2a2a30')}};
// the fair's spinner: a star-painted platform, a striped center mast, six tub cars on arms going round
function spinner(c,x,y,now,lit,bulbsOnly){const px=(a,b,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(a),Math.round(b),w,h)},a0=now/700;
 if(!bulbsOnly){c.fillStyle='#3a2c4a';c.beginPath();c.ellipse(x,y+2,52,16,0,0,6.283);c.fill();c.fillStyle='#5a4a7a';c.beginPath();c.ellipse(x,y,50,14,0,0,6.283);c.fill();
  for(let i=0;i<8;i++){const t=i*.785;px(x+Math.cos(t)*36,y+Math.sin(t)*9,2,2,A.wheat)}px(x-50,y,100,1,'rgba(0,0,0,.2)')}
 const cars=[];for(let i=0;i<6;i++){const t=a0+i*1.047;cars.push([t,x+Math.cos(t)*38,y-6+Math.sin(t)*11])}
 cars.sort((p,q)=>p[2]-q[2]);
 const drawCar=([t,cx,cy],i)=>{if(bulbsOnly){px(cx-1,cy-12,2,2,'#fff6c8');return}c.strokeStyle='#5a5a64';c.beginPath();c.moveTo(x,y-34);c.lineTo(cx,cy-10);c.stroke();const col=[A.ridePink,A.rideCyan,A.wheat][((t*10|0)+i)%3];
  px(cx-7,cy-10,14,10,'#14101a');px(cx-6,cy-9,12,8,col);px(cx-6,cy-9,12,2,shade(col,.3));px(cx+3,cy-8,3,7,shade(col,-.3))};
 cars.filter(k=>k[2]<y-6).forEach(drawCar);
 if(!bulbsOnly){px(x-3,y-40,6,40,'#e8dcc0');for(let j=0;j<40;j+=6)px(x-3,y-40+j,6,3,A.ridePink);px(x+1,y-40,2,40,'rgba(0,0,0,.25)');
  c.fillStyle=A.rideCyan;c.beginPath();c.moveTo(x,y-56);c.lineTo(x-14,y-40);c.lineTo(x+14,y-40);c.fill();c.fillStyle='#14101a';c.fillRect(x-14,y-40,28,1)}
 if(lit||bulbsOnly)for(let i=0;i<7;i++)px(x-12+i*4,y-41,1,1,i%2?'#fff6c8':A.ridePink);
 cars.filter(k=>k[2]>=y-6).forEach(drawCar)}
// a goat in its pen, walking back and forth and yelling about it
function goat(c,x,y,now){const px=(a,b,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(a),Math.round(b),w,h)},st=Math.floor(now/250)%2;
 px(x-1,y-8,14,8,'#14101a');px(x,y-7,12,6,'#e8e4d8');px(x,y-7,12,1,'#ffffff');px(x+8,y-3,4,2,'#c8c4b8');px(x+11,y-11,5,6,'#14101a');px(x+12,y-10,3,4,'#e8e4d8');px(x+12,y-12,1,2,'#8a7a6a');px(x+14,y-12,1,2,'#8a7a6a');
 px(x+1,y-1,1,3+st,'#14101a');px(x+4,y-1,1,4-st,'#14101a');px(x+8,y-1,1,3+st,'#14101a');px(x+10,y-1,1,4-st,'#14101a');px(x+13,y-8,1,1,'#14101a')}
// the fairground's entrance arch: two posts and a lit arched sign
function arch(c,x0,x1,fy,N){const px=(a,b,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(a),Math.round(b),w,h)};
 for(const x of[x0+4,x1-8]){px(x-1,fy-62,6,60,'#14101a');px(x,fy-61,4,58,'#8a4a3a');px(x,fy-61,1,58,'#aa6a5a')}
 for(let i=0;i<=x1-x0-8;i++){const t=i/(x1-x0-8),yy=fy-62-Math.sin(t*3.14)*8;px(x0+4+i,yy,1,12,'#14101a');px(x0+4+i,yy+1,1,10,'#e8dcc0');if(i%5===0)px(x0+4+i,yy+1,1,1,N?'#fff6c8':'#d8b24a')}
 const t='COUNTY FAIR',tw=K.signWidth(t);K.signText(c,t,Math.round((x0+x1)/2-tw/2),fy-66,'#7a2a2e')}

// ================= LIGHT AND AIR =================
// by day outside: the Shelf's heat shimmer. At night outside: sodium light under the lamps, then the lit bulbs,
// neon and windows drawn back over the dark so they glow.
const OUTDOOR=new Set(['main','elm','fair']);
function fx(ctx,o){const M=o.M;if(!OUTDOOR.has(M.id))return;
 if(M.light==='day'){K.heat(ctx,o.now,.5);return}
 const lamps=[];(M.props||[]).forEach(p=>{if(p.sodium){lamps.push([p.sodium[0]-o.camx,p.sodium[1]-o.camy-38,38]);lamps.push([p.sodium[0]-o.camx,p.sodium[1]-o.camy-2,40])}});
 K.sodium(ctx,lamps,o.now);
 // the lead's lantern: its pool goes warm instead of showing the day's colors (the approved night mockup)
 const lx=G.px+8-o.camx,ly=G.py+6-o.camy,lr=58;ctx.globalCompositeOperation='multiply';let gr=ctx.createRadialGradient(lx,ly,0,lx,ly,lr);
 gr.addColorStop(0,'rgba(240,196,120,.75)');gr.addColorStop(1,'rgba(240,196,120,0)');ctx.fillStyle=gr;ctx.fillRect(lx-lr,ly-lr,lr*2,lr*2);
 ctx.globalCompositeOperation='lighter';gr=ctx.createRadialGradient(lx,ly,0,lx,ly,lr*.5);gr.addColorStop(0,'rgba(214,164,58,.16)');gr.addColorStop(1,'rgba(214,164,58,0)');ctx.fillStyle=gr;ctx.fillRect(lx-lr,ly-lr,lr*2,lr*2);ctx.globalCompositeOperation='source-over';
 (M.props||[]).forEach(p=>{if(p.over)p.over(ctx,-o.camx,-o.camy)})}
// the hidden hotspot, while the lead is High on Mushrooms: chalk handwriting hanging in the air over the curb,
// rising toward the watched house, flickering like breath on glass
function lessonGlint(c,x,y,now){for(let line=0;line<4;line++){const yy=Math.round(y-6-line*7-((now/90)%7)),a=.25+.2*Math.sin(now/300+line);if(yy<y-34)continue;
  c.fillStyle=`rgba(243,237,226,${a.toFixed(2)})`;let xx=x-12+line*2;for(let i=0;i<9;i++){if(hsh(i,line,341)<.75){const h=1+((hsh(i,line,342)*3)|0);c.fillRect(xx,yy-h+2,1,h);c.fillRect(xx+1,yy+(hsh(i,line,343)<.5?0:-1),1,1)}xx+=3}}
 c.fillStyle='rgba(243,237,226,.6)';c.fillRect(x-6,y+4,12,1)}

// ================= TOWNSFOLK AND THE TWO MEN ON THE MAP =================
// The Shared Shelf's person template (shared-sprites-person-v1, method v1), at the agents' size; hair from agent-sprite.js.
// About 1 in 3 has a weird trait (Art, Townsfolk): Rhonda's beehive, Orvel's chicken, Dusty's parakeet, Voss's grin.
const {SKIN}=window.BL;
const FOLK={
 toft:{look:{skin:1,hair:0,hairC:5,acc:0},top:A.tan,pants:'#4a3a2a',shoes:'#2a1e18',iris:'#5a7a9a',mouth:'flat',
  body:(A_,ty)=>{const{R}=A_;R(13,ty,2,16,shade(A.tan,-.3));R(16,ty+3,4,4,'#d6a43a');R(17,ty+2,2,6,'#d6a43a');R(6,ty+13,16,2,'#2a1e18');R(16,ty+13,3,2,'#c0c0c8')}},
 cal:{look:{skin:0,hair:2,hairC:4,acc:0},top:A.tan,pants:'#4a3a2a',shoes:'#2a1e18',iris:'#4a7a5a',freckles:1,cheeks:1,mouth:'open',
  body:(A_,ty)=>{const{R}=A_;R(13,ty,2,16,shade(A.tan,-.3));R(16,ty+3,3,3,'#c0c0c8');R(6,ty+13,16,2,'#2a1e18')}},
 doc:{look:{skin:3,hair:4,hairC:0,acc:1},top:'#e6e6ea',coat:1,inner:'#3e8a8a',pants:'#2e6a6a',shoes:'#e6e6ea',iris:'#3a2418',
  body:(A_,ty)=>{const{R}=A_;R(18,ty+6,2,2,'#2d6ad1');R(7,ty+4,2,6,'#3a3a44')}},
 rhonda:{look:{skin:1,hair:3,hairC:4,acc:0},top:'#8ad0b8',pants:'#8ad0b8',shoes:'#f4f1e8',iris:'#5a7a3a',cheeks:1,mouth:'smile',beehive:'#b94a2c',
  body:(A_,ty)=>{const{R}=A_;R(9,ty+4,10,12,'#f4f1e8');R(9,ty+4,10,1,shade('#f4f1e8',-.2));R(15,ty+7,3,4,'#e8dcc0');R(11,ty,6,2,'#f4f1e8')}},
 dusty:{look:{skin:2,hair:1,hairC:1,acc:3},top:'#a8323e',pants:'#3b4a6b',shoes:'#3a2a1e',iris:'#3a2418',mouth:'smile',bird:'para',
  body:(A_,ty)=>{const{R}=A_;R(5,ty,4,14,'#3b5b8a');R(19,ty,4,14,'#2b4b7a');R(6,ty+13,16,2,'#3a2a1e');R(12,ty+13,4,2,'#d6a43a')}},
 jolene:{look:{skin:0,hair:1,hairC:3,acc:0},top:'#d86a8a',pants:'#3b5b8a',shoes:'#e8e4d8',iris:'#4a6a9a',mouth:'flat',
  body:(A_,ty)=>{const{R}=A_;R(16,ty+3,3,2,'#f4f1e8');R(6,ty+14,16,2,shade('#3b5b8a',-.2))}},
 tanner:{look:{skin:0,hair:2,hairC:2,acc:0},top:'#4a8a4a',pants:'#3b5b8a',shoes:'#d8d2c2',s:.42,cheeks:1,freckles:1,mouth:'open',cap:'#2e4a8a',capBack:1,
  body:(A_,ty)=>{const{R}=A_;for(let y=ty+2;y<ty+16;y+=4)R(6,y,16,2,'#e8e4d8')}},
 orvel:{look:{skin:1,hair:3,hairC:6,acc:3},top:'#c8b898',pants:'#4a6a8a',shoes:'#3a2a1e',iris:'#5a6a7a',mouth:'flat',cap:'#d8d4c4',bird:'hen',
  body:(A_,ty)=>{const{R}=A_;R(8,ty+3,12,13,'#4a6a8a');R(9,ty,2,4,'#4a6a8a');R(17,ty,2,4,'#4a6a8a');R(9,ty+3,2,2,'#c0c0c8');R(17,ty+3,2,2,'#c0c0c8')}},
 voss:{look:{skin:0,hair:0,hairC:5,acc:0},top:'#e8e0c8',pants:'#3b4a6b',shoes:'#5a3a22',iris:'#4a6a8a',mouth:'grin',straw:'#d8c07a',
  body:(A_,ty)=>{const{R}=A_;R(7,ty,3,6,'#8a5a3a');R(18,ty,3,6,'#8a5a3a');R(6,ty+13,16,2,'#5a3a22');R(11,ty+12,6,4,'#c8c8d0');R(12,ty+13,4,2,'#d6a43a')}},
 // the two men: black suits, white shirts, black ties, dark glasses. Never twins (Art, No twins): Doe's hair is slicked
 // with a side part and a pocket square; Roe wears a hat. At night they cast no shadow and their glasses catch the light.
 doe:{look:{skin:0,hair:0,hairC:0,acc:2},top:A.suit,coat:1,inner:'#f4f4f4',pants:A.suit,shoes:'#0c0a10',mouth:'flat',man:1,
  body:(A_,ty)=>{const{R}=A_;R(13,ty,2,9,'#0c0a10');R(16,ty+3,3,2,'#f4f4f4')}},
 roe:{look:{skin:0,hair:2,hairC:0,acc:2},top:A.suit,coat:1,inner:'#f4f4f4',pants:A.suit,shoes:'#0c0a10',mouth:'flat',man:1,fedora:A.suit,
  body:(A_,ty)=>{const{R}=A_;R(13,ty,2,9,'#0c0a10')}},
 fairgoer:{look:{skin:4,hair:4,hairC:0,acc:0},top:'#e0a030',pants:'#4a4038',shoes:'#e8e4d8',iris:'#3a2418',mouth:'smile',
  body:(A_,ty)=>{const{R}=A_;R(2,ty+12,2,6,'#c87a3a');R(24,ty+12,2,6,'#c87a3a');R(2,ty+18,2,4,'#e8dcc0');R(24,ty+18,2,4,'#e8dcc0')}},
 fairgoer2:{look:{skin:3,hair:6,hairC:1,acc:0},top:'#3e8ad0',pants:'#3a3446',shoes:'#e8e4d8',s:.42,iris:'#3a2418',mouth:'open',cheeks:1},
 fairgoer3:{look:{skin:2,hair:3,hairC:5,acc:3},top:'#6a8a4a',pants:'#4a4038',shoes:'#3a2a1e',iris:'#3a2418',mouth:'flat',cap:'#a8323e'},
 // part B: the co-op's two night men (night 1), work jackets and feed caps with the patch picked off
 nightman:{look:{skin:1,hair:3,hairC:2,acc:0},top:'#a8783a',pants:'#3b4a6b',shoes:'#3a2a1e',iris:'#4a6a8a',mouth:'flat',cap:'#c0392b'},
 nightman2:{look:{skin:3,hair:1,hairC:0,acc:3},top:'#7a6a4a',pants:'#3a3446',shoes:'#3a2a1e',iris:'#3a2418',mouth:'flat',cap:'#3e5a8a',capBack:1}
};
// hats and hair the template lacks: a feed cap (forward or backwards), Voss's straw hat, Roe's fedora, Rhonda's beehive
function topper(Ad,F_,dir){const{R,C}=Ad;
 if(F_.cap){const c=F_.cap,cd=shade(c,-.3);if(dir==='up'){R(5,0,18,7,c,{sh:3});if(!F_.capBack)R(8,7,12,1,cd)}else if(dir==='side'){R(6,-1,17,7,c,{sh:3});if(F_.capBack)R(20,5,6,2,cd);else R(0,5,8,2,cd)}
  else{R(5,-1,18,7,c,{sh:3});R(5,-1,18,1,shade(c,.25));if(F_.capBack)R(12,5,4,2,cd);else R(5,6,18,2,cd);if(!F_.capBack)R(11,1,6,3,'#e8e4d8')}}
 if(F_.straw){const c=F_.straw,cd=shade(c,-.3);if(dir==='side'){R(0,4,28,3,c,{sh:5});R(7,-4,14,9,c,{sh:3});R(7,2,14,2,'#7a4a2a')}else{R(-1,4,30,3,c,{sh:6});R(1,3,26,1,shade(c,.2));R(7,-4,14,9,c,{sh:4});R(12,-4,4,3,cd);R(7,2,14,2,'#7a4a2a')}}
 if(F_.fedora){const c=F_.fedora;if(dir==='side'){R(2,4,24,2,c,{sh:4});R(8,-2,14,7,c,{sh:3});R(8,3,14,1,'#3a3440')}else{R(1,4,26,2,c,{sh:5});R(7,-2,14,7,c,{sh:4});R(12,-2,4,2,shade(c,-.3));R(7,3,14,1,'#3a3440')}}
 if(F_.beehive){const c=F_.beehive,cd=shade(c,-.3),cl=shade(c,.25);C(14,-6,11,cd);C(13,-7,10,c);C(10,-11,5,cl);C(14,-18,8,c);C(13,-19,6,cl);if(dir!=='up'){R(20,-16,1,8,'#d6a43a');R(22,-12,1,7,'#a8323e');R(6,-14,1,7,'#3a6aa8')}}}
function bird(Ad,F_,dir){const{R}=Ad;if(!F_.bird||dir==='up')return;const sx=dir==='side'?14:20,y=16;
 if(F_.bird==='hen'){R(sx-2,y-6,9,8,'#e8e4d8',{sh:3});R(sx+5,y-10,4,5,'#e8e4d8');R(sx+6,y-12,2,2,'#c0392b');R(sx+9,y-8,2,1,'#e0a030');R(sx+6,y-9,1,1,'#14101a');R(sx-3,y-5,2,3,'#d8d4c4')}
 else{R(sx,y-4,5,6,'#6ac04a',{sh:2});R(sx+1,y-7,4,4,'#8ae06a');R(sx+4,y-6,2,1,'#e0a030');R(sx+2,y-6,1,1,'#14101a');R(sx-2,y+1,3,2,'#3a7aca')}}
const fcache=new Map();
function folk(id,dir,idle=0,M){
 const F_=FOLK[id]||FOLK.fairgoer,night=!!(M&&isNight(M)&&F_.man),k=id+dir+idle+(night?'n':'');let v=fcache.get(k);if(v)return v;
 if(dir==='right'){const l=folk(id,'left',idle,M),c=K.mk(l.c.width,l.c.height),g=c.getContext('2d');g.translate(c.width,0);g.scale(-1,1);g.drawImage(l.c,0,0);v={c,ax:c.width-l.ax,ay:l.ay,noShadow:l.noShadow}}
 else{const d=dir==='left'?'side':dir,L=F_.look,sk=SKIN[L.skin];
  const sp=Object.assign({skin:sk,hair:sk,hairStyle:'cropped',iris:F_.iris||'#3a2418'},F_);
  const a=art(40,90,6,30,F_.s||S,Ad=>{K.drawChar(Ad,sp,d,0,F_.man?0:idle);BLA.extras(Ad,{look:L},dir,0);topper(Ad,F_,d);bird(Ad,F_,d);
   if(F_.man&&d!=='up'){const{R}=Ad;if(d==='side')R(5,11,6,4,'#0c0a10');else{R(7,11,6,4,'#0c0a10');R(15,11,6,4,'#0c0a10');R(13,12,2,1,'#0c0a10')}
    if(night){if(d==='side')R(6,12,2,1,A.sodium);else{R(8,12,2,1,A.sodium);R(16,12,2,1,A.sodium)}}else{if(d==='side')R(6,11,1,1,'#5a5a6a');else{R(8,11,1,1,'#5a5a6a');R(16,11,1,1,'#5a5a6a')}}}
   if(id==='doe'&&d==='down')Ad.R(7,27,3,2,'#f4f4f4')});
  v={c:a.c,ax:a.sx(14),ay:a.sy(50),noShadow:night}}
 fcache.set(k,v);return v;
}

// ================= PORTRAITS (64 x 64, Storybook faces, Lantern Bust box) =================
// The Asset Library's portrait kit (as in Still Harvest): drawn pixel by pixel in a layer, then a light rim on the lit
// edges and a dark outline. Each sits on a lit backing (Quality bar, Rim and backing).
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
// a body in clothes: shoulders with a lit left side and a shaded right, a collar
const body=(L,c)=>{L.e(34,66,24,15,sh(c,-34));L.e(30,65,22,14,c);L.e(24,60,10,6,sh(c,18))};
// a head with four tones: lit cheek, base, shade on the right, deep shade under the jaw
const head=(L,cx,cy,rx,ry,s)=>{L.e(cx+1,cy+2,rx,ry,sh(s,-46));L.e(cx+1,cy+1,rx,ry-1,sh(s,-26));L.e(cx-1,cy,rx-1,ry-1,s);L.e(cx-5,cy-4,rx*.45,ry*.4,sh(s,14))};
function eye(L,x,y,ir,s){L.r(x+1,y,4,1,WH);L.r(x,y+1,6,5,WH);L.r(x+1,y+6,4,1,WH);
 L.r(x+1,y+1,4,5,ir);L.r(x+1,y+1,4,1,sh(ir,-45));L.r(x+2,y+2,2,3,D);L.p(x+3,y+2,'#ffffff');L.p(x+4,y+5,sh(ir,45));
 L.r(x,y-1,6,1,D);L.p(x+(s<0?-1:6),y,D);L.p(x+(s<0?-2:7),y-1,D)}
function mouth(L,cx,y,w,o){const x=cx-(w>>1);
 if(o){L.r(x+1,y,w-2,1,MR);L.r(x,y+1,w,3,MR);L.r(x+1,y+4,w-2,1,MR);L.r(x+1,y+1,w-2,1,WH);L.r(x+2,y+3,w-4,2,'#d8607a')}
 else{L.r(x+1,y+1,w-2,1,MR);L.p(x,y,MR);L.p(x+w-1,y,MR)}}
const ring=(L,x,y,w,h,c)=>{L.r(x+1,y,w-2,1,c);L.r(x+1,y+h-1,w-2,1,c);L.r(x,y+1,1,h-2,c);L.r(x+w-1,y+1,1,h-2,c)};
const ears=(L,s,y=33)=>{L.e(17,y,3,4,s);L.e(47,y,3,4,sh(s,-30));L.p(17,y,sh(s,-30))};
const nose=(L,s,y=36)=>{L.p(32,y,sh(s,-40));L.p(33,y+1,sh(s,-40));L.p(31,y+1,sh(s,10))};
const brows=(L,c,y=25,tilt=0)=>{L.r(21,y+tilt,6,1,c);L.r(37,y-tilt,6,1,c)};
const shirtV=(L,c,y=50)=>{for(let j=0;j<12;j++){const w=Math.max(1,6-(j>>1));L.r(32-w,y+j,w*2,1,c)}};
const badge=(L,x,y)=>{L.r(x,y,5,5,'#e0b84a');L.p(x+2,y-1,'#e0b84a');L.p(x-1,y+2,'#e0b84a');L.p(x+5,y+2,'#e0b84a');L.p(x+2,y+2,'#8a6a1a');L.p(x+1,y+1,'#fff1b0')};

const PORT={
// Sheriff Marlene Toft: fifties, practical, a short gray-blond cut, tan uniform with the star, reading glasses pushed up
'SHERIFF TOFT':{bg:'#3a3346',f(L,t){const s='#e9b98f',hc='#b8b0a0',hd=sh(hc,-40),u=A.tan;
 body(L,u);L.r(27,44,10,8,sh(s,-32));shirtV(L,sh(u,-28));L.r(31,50,2,14,sh(u,-40));badge(L,40,54);L.r(20,54,6,2,sh(u,-30));L.r(14,57,4,4,'#4a3a2a');
 ears(L,s);head(L,32,32,15,15,s);
 L.e(31,19,15,7,hd);L.e(30,18,14,6,hc);L.r(17,18,4,10,hc);L.r(43,18,4,10,hd);L.r(22,21,10,2,hc);L.r(24,15,6,1,sh(hc,30));
 L.r(21,16,9,3,'#5a4a3a');L.r(34,16,9,3,'#5a4a3a');L.r(22,16,7,1,'#9ac0d8');L.r(35,16,7,1,'#9ac0d8');L.r(30,17,4,1,'#5a4a3a');
 brows(L,hd,25,1);eye(L,21,28,'#5a7a9a',-1);eye(L,37,28,'#5a7a9a',1);L.r(21,28,6,1,sh(s,-30));L.r(37,28,6,1,sh(s,-30));
 nose(L,s);L.r(20,38,4,1,sh(s,-24));L.r(40,38,4,1,sh(s,-24));L.p(23,41,sh(s,-28));L.p(41,41,sh(s,-28));
 if(t)mouth(L,32,41,8,true);else{L.r(28,42,8,1,MR);L.p(27,41,MR)}}},
// Deputy Cal Brandt: young, red crop, freckles, eyes a little too wide
'DEPUTY BRANDT':{bg:'#2a3346',f(L,t){const s='#f6d7b8',hc='#b94a2c',u=A.tan;
 body(L,u);L.r(27,44,10,8,sh(s,-32));shirtV(L,sh(u,-28));badge(L,40,54);L.r(19,55,6,4,'#c0c0c8');
 ears(L,s,34);head(L,32,33,14,15,s);L.e(31,20,14,6,hc);L.r(18,20,3,8,hc);L.r(43,20,3,7,sh(hc,-40));L.r(24,17,4,2,sh(hc,40));L.r(34,18,5,2,sh(hc,40));
 brows(L,sh(hc,-30),25,-1);eye(L,21,28,'#4a8a5a',-1);eye(L,37,28,'#4a8a5a',1);
 [[22,37],[25,38],[39,38],[42,37],[24,36],[40,36],[23,39],[41,39]].forEach(([x,y])=>L.p(x,y,'#c87a4a'));L.r(19,38,3,2,'#f0a0a0');L.r(43,38,3,2,'#f0a0a0');
 nose(L,s,36);mouth(L,32,41,6,t)}},
// Dr. Ines Abernathy: county coroner, dark bun, round glasses, lab coat over teal scrubs, a pen behind her ear
'DR. ABERNATHY':{bg:'#2e3e44',f(L,t){const s='#a26a43',hc='#1b1414',hl='#4a3434';
 body(L,'#e6e6ea');L.r(26,48,12,16,'#3e8a8a');L.r(26,48,12,2,sh('#3e8a8a',-30));L.r(24,50,2,14,sh('#e6e6ea',-40));L.r(38,50,2,14,sh('#e6e6ea',-40));L.r(41,54,6,4,'#2d6ad1');L.r(42,52,1,6,'#3a3a44');
 L.e(32,10,8,7,hc);L.p(30,6,hl);L.p(31,6,hl);ears(L,s);head(L,32,32,15,15,s);L.e(31,20,15,6,hc);L.r(17,20,3,9,hc);L.r(44,20,3,9,hc);L.r(24,17,8,1,hl);
 L.r(46,24,6,1,'#e8e4d8');L.r(51,23,1,3,'#3a3a44');
 for(const x of[20,36]){L.e(x+4,31,7,6,'#2a2030');L.e(x+4,31,6,5,'#e6eef4');}eye(L,21,28,'#6b3a1a',-1);eye(L,37,28,'#6b3a1a',1);L.r(30,30,4,1,'#2a2030');
 brows(L,hc,23);nose(L,s);L.r(19,38,4,2,sh(s,-18));L.r(41,38,4,2,sh(s,-18));
 if(t)mouth(L,32,42,7,true);else{L.r(28,43,8,1,MR)}}},
// Rhonda Kuehl: diner waitress, a red beehive so tall it holds pencils and a lighter (her weird trait), mint uniform
RHONDA:{bg:'#3a2a3a',f(L,t){const s='#e9b98f',hc='#b94a2c',hd=sh(hc,-40),hl=sh(hc,35),u='#8ad0b8';
 body(L,u);L.r(27,44,10,8,sh(s,-32));L.r(22,50,20,3,'#f4f1e8');L.r(37,54,6,5,'#f4f1e8');L.r(38,55,4,1,'#5a5a6a');L.r(18,52,3,3,'#e86a92');
 L.e(32,12,12,10,hd);L.e(31,11,11,9,hc);L.e(32,5,9,6,hc);L.e(28,7,4,3,hl);L.e(27,14,3,3,hl);
 L.r(41,3,1,10,'#d6a43a');L.r(41,3,1,1,'#f4c6a0');L.r(23,5,1,9,'#3a6aa8');L.r(37,6,3,6,'#a8323e');L.r(37,6,3,1,'#c0c0c8');
 ears(L,s);head(L,32,33,15,14,s);L.e(31,22,15,5,hc);L.r(17,22,4,9,hc);L.r(43,22,4,9,hd);L.r(26,20,8,2,hl);
 L.e(47,36,1,2,'#d6a43a');
 brows(L,hd,24,-1);eye(L,21,28,'#5a8a3a',-1);eye(L,37,28,'#5a8a3a',1);L.r(20,27,7,1,D);L.r(37,27,7,1,D);
 L.r(19,37,4,2,'#e8857a');L.r(41,37,4,2,'#e8857a');nose(L,s);L.r(28,41,8,1,'#c0392b');mouth(L,32,41,8,t);L.p(36,46,sh(s,-30))}},
// Dusty Lamarr: carnival worker, a sun-beat mullet and stubble, a gold tooth, his parakeet on his shoulder (weird trait)
DUSTY:{bg:'#2a2040',f(L,t){const s='#c98e62',hc='#4a2c1a',hd=sh(hc,-30),u='#a8323e';
 body(L,u);L.rm(0,50,20,14,'#3b5b8a');L.rm(44,50,20,14,'#2b4b7a');L.r(27,44,10,8,sh(s,-32));
 L.e(50,46,5,6,'#6ac04a');L.e(49,43,4,4,'#8ae06a');L.r(46,43,2,1,'#e0a030');L.p(48,42,D);L.r(52,50,4,5,'#3a7aca');
 L.r(17,28,4,16,hc);L.r(43,28,4,16,hd);ears(L,s);head(L,32,32,15,15,s);L.e(31,20,15,6,hc);L.r(20,17,6,2,sh(hc,30));
 [[22,40],[25,42],[28,43],[36,43],[39,42],[42,40],[24,44],[40,44],[31,45],[33,45]].forEach(([x,y])=>L.p(x,y,sh(s,-38)));
 brows(L,hd,25,1);eye(L,21,28,'#3a2418',-1);eye(L,37,28,'#3a2418',1);L.r(21,34,6,1,sh(s,-28));L.r(37,34,6,1,sh(s,-28));nose(L,s);
 if(t){mouth(L,32,40,10,true);L.r(34,41,2,2,'#e0b84a')}else{L.r(27,41,10,1,MR);L.p(37,40,MR);L.r(33,41,2,1,'#e0b84a')}}},
// Jolene Peck: Tanner's mom, blond ponytail, scrub top from the night shift, tired and furious
JOLENE:{bg:'#2a2a40',f(L,t){const s='#f6d7b8',hc='#d8b25a',hd=sh(hc,-40),u='#d86a8a';
 body(L,u);L.r(27,44,10,8,sh(s,-32));L.r(26,50,12,2,sh(u,-30));L.r(23,54,4,3,'#f4f1e8');
 L.e(46,16,5,8,hd);L.e(47,24,3,7,hc);ears(L,s);head(L,32,32,15,15,s);L.e(31,20,15,6,hc);L.r(17,20,3,10,hc);L.r(44,20,3,8,hd);L.r(18,22,2,9,hc);L.r(22,17,9,2,sh(hc,30));
 brows(L,hd,25,2);eye(L,21,28,'#4a6a9a',-1);eye(L,37,28,'#4a6a9a',1);L.r(21,35,6,1,'#c8a0b0');L.r(37,35,6,1,'#c8a0b0');L.r(22,36,4,1,sh(s,-20));L.r(38,36,4,1,sh(s,-20));
 nose(L,s);if(t)mouth(L,32,42,7,true);else{L.r(28,43,8,1,MR);L.p(27,44,MR);L.p(36,44,MR)}}},
// Tanner Peck: 9, a backwards cap, freckles, a striped tee, a gap in his teeth
TANNER:{bg:'#2a3a40',f(L,t){const s='#f6d7b8',c='#2e4a8a',u='#4a8a4a';
 body(L,u);for(let y=52;y<64;y+=4)L.rm(0,y,64,2,'#e8e4d8');L.r(28,46,8,5,sh(s,-32));
 ears(L,s,35);head(L,32,35,13,13,s);L.e(31,23,14,7,sh(c,-30));L.e(30,22,13,6,c);L.r(28,27,8,3,sh(c,-40));L.r(29,16,6,2,sh(c,30));L.r(22,26,3,4,'#8a5a2b');L.r(40,26,3,4,'#8a5a2b');
 eye(L,21,31,'#4a7aaa',-1);eye(L,37,31,'#4a7aaa',1);brows(L,'#8a5a2b',28,-1);
 [[23,40],[26,41],[38,41],[41,40],[25,39],[39,39]].forEach(([x,y])=>L.p(x,y,'#d08a5a'));L.r(19,40,3,2,'#f0a0a0');L.r(42,40,3,2,'#f0a0a0');nose(L,s,38);
 if(t){mouth(L,32,43,8,true);L.r(32,44,1,2,MR)}else{L.r(29,44,6,1,MR);L.p(28,43,MR);L.p(35,43,MR)}}},
// Orvel Danner: runs the one-pump station, old, white whiskers, a feed cap, and Doris the hen on his shoulder (weird trait)
ORVEL:{bg:'#3a3020',f(L,t){const s='#e9b98f',w='#e8e4d8',u='#4a6a8a',cap='#d8d4c4';
 body(L,'#c8b898');L.r(20,52,8,12,u);L.r(36,52,8,12,u);L.r(21,52,3,3,'#c0c0c8');L.r(40,52,3,3,'#c0c0c8');
 L.e(8,44,8,8,'#e8e4d8');L.e(8,40,5,6,'#f4f0e8');L.r(3,33,3,3,'#c0392b');L.r(1,40,3,2,'#e0a030');L.p(6,38,D);L.e(12,48,4,3,'#d8d4c4');
 ears(L,s);head(L,32,32,15,15,s);L.e(32,42,13,7,w);L.e(32,44,9,5,sh(w,-20));
 L.e(31,20,16,7,sh(cap,-30));L.e(30,19,15,6,cap);L.r(16,23,32,3,sh(cap,-40));L.r(14,25,36,2,'#2e4a6a');L.r(26,15,10,5,'#2e4a6a');L.r(28,16,6,3,cap);
 eye(L,21,29,'#5a6a7a',-1);eye(L,37,29,'#5a6a7a',1);L.r(21,29,6,2,sh(s,-24));L.r(37,29,6,2,sh(s,-24));brows(L,w,27);
 nose(L,s,35);L.r(26,39,12,2,w);if(t)mouth(L,32,41,7,true);else L.r(29,42,6,1,MR)}},
// Arlen Voss: co-op and fair board, a straw hat, a pressed western shirt, a grin a little too wide that won't stop
'ARLEN VOSS':{bg:'#3a2a24',f(L,t){const s='#f0c8a0',h='#d8c07a',hd=sh(h,-40),u='#e8e0c8';
 body(L,u);L.r(27,44,10,8,sh(s,-32));L.r(28,50,8,14,sh(u,-20));for(let y=52;y<64;y+=4)L.p(32,y,'#c0c0c8');L.r(16,52,8,3,'#8a5a3a');L.r(40,52,8,3,'#8a5a3a');
 ears(L,s,34);head(L,32,33,15,14,s);L.r(18,28,3,6,'#c8c4b8');L.r(43,28,3,6,'#a8a498');
 L.e(32,22,30,5,hd);L.e(31,21,29,4,h);L.r(19,8,26,13,h);L.r(19,8,5,13,sh(h,30));L.r(40,8,5,13,hd);L.r(29,8,6,3,hd);L.r(19,17,26,3,'#7a4a2a');L.tex(h,sh(h,-18),5);
 eye(L,21,28,'#4a6a8a',-1);eye(L,37,28,'#4a6a8a',1);brows(L,'#9a9488',25,-2);nose(L,s);
 L.r(19,42,26,4,MR);L.r(20,42,24,2,WH);for(let x=22;x<44;x+=3)L.p(x,43,'#c8c0b0');L.p(18,41,MR);L.p(45,41,MR);L.p(17,40,sh(s,-30));L.p(46,40,sh(s,-30));if(t)L.r(22,44,20,2,'#a03a4a')}},
// the two men: perfectly ordinary faces drawn too evenly, black suits, black ties, dark glasses that show nothing.
// No twins: Doe has a side-parted slick of hair; Roe a black hat and a thinner face.
'MR. DOE':{bg:'#1b1f33',f(L,t){const s='#e6c8b0',hc='#14101a',su=A.suit;
 body(L,su);L.r(26,46,12,18,'#f4f4f4');L.r(30,48,4,16,'#0c0a10');L.r(30,48,4,2,'#2a2630');L.r(42,54,5,2,'#f4f4f4');L.p(43,53,'#f4f4f4');
 ears(L,s);head(L,32,32,14,15,s);L.e(32,20,14,7,hc);L.r(18,20,3,8,hc);L.r(43,20,3,8,hc);L.r(26,15,1,6,sh(s,-20));L.r(28,15,10,2,'#3a3440');
 L.r(19,28,11,6,'#0c0a10');L.r(34,28,11,6,'#0c0a10');L.r(30,29,4,1,'#0c0a10');L.r(20,29,3,1,'#5a5a6a');L.r(35,29,3,1,'#5a5a6a');
 L.p(32,37,sh(s,-30));L.r(27,42,10,1,MR);if(t){L.r(28,43,8,2,'#2a0c10')}}},
'MR. ROE':{bg:'#1b1f33',f(L,t){const s='#e6c8b0',su=A.suit;
 body(L,su);L.r(26,46,12,18,'#f4f4f4');L.r(30,48,4,16,'#0c0a10');
 ears(L,s,35);head(L,32,34,13,15,s);
 L.e(32,21,26,4,'#0c0a10');L.e(31,20,25,3,su);L.r(20,9,24,11,su);L.r(20,9,4,11,sh(su,22));L.r(29,9,6,3,'#0c0a10');L.r(20,16,24,3,'#3a3440');
 L.r(20,29,10,6,'#0c0a10');L.r(34,29,10,6,'#0c0a10');L.r(30,30,4,1,'#0c0a10');L.r(21,30,3,1,'#5a5a6a');L.r(35,30,3,1,'#5a5a6a');
 L.p(32,38,sh(s,-30));L.r(28,43,8,1,MR);if(t){L.r(29,44,6,2,'#2a0c10')}}}
};
const pcache={};
function portraitCanvas(name,open){const k=name+(open?1:0);if(pcache[k])return pcache[k];
 const P_=PORT[name],L=Ly(64,64),c=K.mk(64,64),g=c.getContext('2d');P_.f(L,open?1:0);
 const gr=g.createRadialGradient(22,18,4,32,32,46);gr.addColorStop(0,sh(P_.bg,34));gr.addColorStop(1,P_.bg);g.fillStyle=gr;g.fillRect(0,0,64,64);
 const o=finish(L);for(let i=0;i<o.length;i++)if(o[i]){g.fillStyle=o[i];g.fillRect(i%64,(i/64)|0,1,1)}
 return pcache[k]=c}
const portraits={};
for(const name of Object.keys(PORT))portraits[name]=(ctx,open)=>{ctx.clearRect(0,0,64,64);ctx.drawImage(portraitCanvas(name,open),0,0)};

// ================= BIG HAT'S BRIEFING PLACE: the combine cab (spec 010, Briefing) =================
// The cab of a parked combine behind a truck stop off I-70, at dusk, the fair's lights far off across the wheat. Drawn in
// the back room's layout (spec 013): his bust centered, the place behind him, and in front of him, where the desk would
// be, the combine's dash and wheel (with a sack of truck-stop crullers on it, since he's still Big Hat).
const combine={
 back(c,v){const{VW,VH,fy,mid,now}=v,R=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))};
  const hz=Math.round(fy-58);
  const sky=c.createLinearGradient(0,0,0,hz);sky.addColorStop(0,'#2a2046');sky.addColorStop(.55,'#7a3a5a');sky.addColorStop(1,'#e8834a');c.fillStyle=sky;c.fillRect(0,0,VW,hz);
  R(mid+70,hz-22,3,2,'#ffe9b0');[[30,20],[70,12],[150,26],[200,8],[110,30]].forEach(([x,y])=>R(x*VW/240,y,1,1,'#f4e8d8'));
  // the fair, far off: a lit Ferris wheel and a haze of ride colors on the horizon
  const fx=mid+74,fyy=hz-14,gl=c.createRadialGradient(fx,fyy,0,fx,fyy,44);gl.addColorStop(0,'rgba(255,170,90,.45)');gl.addColorStop(1,'rgba(255,170,90,0)');c.fillStyle=gl;c.fillRect(fx-40,fyy-40,80,80);
  const a=now/5000;for(let k=0;k<16;k++){const t=a+k*.3927;R(fx+Math.cos(t)*13,fyy+Math.sin(t)*13,2,1,[A.ridePink,A.rideCyan,'#ffe9b0'][k%3])}R(fx-6,fyy+10,1,3,'#2a2030');R(fx+5,fyy+10,1,3,'#2a2030');
  for(let i=0;i<14;i++)R(fx-28+i*4+Math.sin(i)*2,hz-2,1,1,[A.ridePink,A.rideCyan,'#ffe9b0',A.wheat][i%4]);
  // the truck stop: a tall sign on a pole and a row of sodium lights
  const sx=mid-78,st=Math.max(16,hz-66);R(sx,st+14,3,hz-st-14,'#2a2030');R(sx-16,st,34,16,'#2a2030');R(sx-15,st+1,32,14,Math.random()>.02?'#e8a040':'#7a4a20');K.signText(c,'DIESEL',sx-11,st+4,'#2a1a18');R(sx-16,st+17,34,8,'#2a2030');K.signText(c,'OPEN 24',sx-12,st+18,'#ff9a3c');
  for(let i=0;i<4;i++){const lx=mid-60+i*22;R(lx,hz-18,1,18,'#2a2030');R(lx-2,hz-20,5,2,'#ffcf80');const s=c.createRadialGradient(lx,hz-18,0,lx,hz-18,9);s.addColorStop(0,'rgba(255,154,60,.5)');s.addColorStop(1,'rgba(255,154,60,0)');c.fillStyle=s;c.fillRect(lx-9,hz-27,18,18)}
  // the wheat, gold in the last light, darker toward the cab
  for(let y=hz;y<VH;y++){const t=(y-hz)/(VH-hz);c.fillStyle=t<.08?'#e8b04a':t<.3?'#c8903a':t<.6?'#9a6a2e':'#6a4a24';c.fillRect(0,y,VW,1);
   if(y%3===0)for(let x=(y*7)%9;x<VW;x+=9)R(x,y,1,1,t<.3?'#f0c868':'#7a5a2a')}
  // the cab: roof liner and dome light, the corner posts, the rear window's frame, his seat
  R(0,0,VW,14,'#3a3a42');R(0,12,VW,2,'#24242c');R(mid-8,2,16,6,'#d8d4c4');R(mid-7,3,14,1,'#ffffff');
  for(const x of[mid-110,mid+100]){R(x,0,10,VH,'#2c2c34');R(x,0,2,VH,'#4a4a54');R(x+8,0,2,VH,'#1a1a20')}
  R(0,0,mid-110,VH,'#3a3a42');R(mid+110,0,VW,VH,'#3a3a42');R(mid-114,30,4,40,'#1a1a20');R(mid+112,30,4,40,'#1a1a20');
  R(mid-100,hz+34,200,3,'#24242c');
  c.fillStyle='rgba(255,220,180,.06)';c.fillRect(mid-100,14,200,hz+20);
  R(mid-40,fy-92,80,80,'#3a2a24');R(mid-40,fy-92,80,3,'#5a3e32');for(let y=fy-84;y<fy-12;y+=8)R(mid-36,y,72,1,'#2a1c18');R(mid-46,fy-30,8,30,'#2a1c18');R(mid+38,fy-30,8,30,'#2a1c18')},
 lift:8,  // he sits up in the cab a little higher than behind the desk, so his face clears the wheel
 front(c,v){const{VW,VH,fy,mid,now}=v,R=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))};
  // the dash: a lit top edge, gauges and the yield monitor, the shift lever
  const db=fy+26;R(0,fy,VW,db-fy,'#2e2e36');R(0,fy,VW,2,'#5a5a64');R(0,fy+2,VW,1,'#14141a');R(0,db-2,VW,2,'#16161c');
  for(let x=mid-100;x<mid+100;x+=5)R(x,fy+5,3,1,'#3a3a44');
  [[mid-86,fy+14],[mid-66,fy+14]].forEach(([x,y],i)=>{c.fillStyle='#0c0c12';c.beginPath();c.arc(x,y,9,0,6.283);c.fill();c.fillStyle='#24240e';c.beginPath();c.arc(x,y,7.5,0,6.283);c.fill();
   for(let k=0;k<7;k++){const a=-3.6+k*.6;R(x+Math.cos(a)*6,y+Math.sin(a)*6,1,1,'#c8b070')}const an=-2.6+(i?1.1:1.9)+Math.sin(now/1700+i)*.05;for(let k=0;k<6;k++)R(x+Math.cos(an)*k,y+Math.sin(an)*k,1,1,'#ff9a3c');R(x-1,y-1,2,2,'#a8a8b0')});
  R(mid+52,fy+3,38,22,'#0c0c12');R(mid+54,fy+5,34,18,'#123a24');for(let x=0;x<32;x+=2){const h=4+Math.round(Math.sin(x*.7+now/900)*2+hsh(x,1,351)*6);R(mid+55+x,fy+22-h,1,h,'#5ad08a')}R(mid+54,fy+5,34,1,'#3a7a5a');
  // under the dash: the cab floor and its ribbed mat, the dusk coming in low through the door glass
  R(0,db,VW,VH-db,'#26262e');
  R(mid-96,db+4,192,VH-db-4,'#1a1a20');for(let y=db+7;y<VH;y+=4){R(mid-92,y,184,1,'#2c2c34');R(mid-92,y+1,184,1,'#121216')}
  c.fillStyle='rgba(232,150,74,.13)';c.beginPath();c.moveTo(mid+20,db+4);c.lineTo(mid+96,db+4);c.lineTo(mid+96,VH);c.lineTo(mid-30,VH);c.fill();
  // the door panel on the left: armrest, chrome handle, a map pocket stuffed with papers, a speaker grille
  R(0,db,mid-96,VH-db,'#34343e');R(mid-98,db,2,VH-db,'#14141a');R(0,db+8,mid-98,6,'#4a4a56');R(0,db+8,mid-98,1,'#6a6a76');R(0,db+14,mid-98,1,'#1c1c22');
  R(mid-122,db+18,14,4,'#a8acb4');R(mid-122,db+18,14,1,'#e0e4ea');
  const pk=db+30;R(4,pk,mid-108,Math.min(22,VH-pk-4),'#24242c');R(4,pk,mid-108,2,'#40404a');
  R(10,pk-6,16,10,'#e8dcc0');R(11,pk-5,10,1,'#8a7a6a');R(11,pk-3,12,1,'#8a7a6a');R(22,pk-8,14,10,'#c8a060');R(23,pk-6,8,1,'#7a5a2a');R(30,pk-7,4,3,'#a8323e');
  for(let y=pk+28;y<VH-4;y+=3)for(let x=8;x<mid-112;x+=3)R(x,y,1,1,'#1a1a22');
  // the steering column and two pedals; the shift lever with its rubber boot and red knob; a cup in its holder
  const wx=mid-34;R(wx-3,fy-4,6,db-fy+4,'#1a1a20');R(wx-1,fy-4,2,db-fy+4,'#3a3a42');
  for(const[px,pw]of[[wx-24,12],[wx+10,16]]){R(px,VH-26,pw,12,'#3a3a42');R(px,VH-26,pw,1,'#6a6a74');for(let y=VH-24;y<VH-15;y+=2)R(px+1,y,pw-2,1,'#26262e');R(px+pw/2-1,VH-14,2,14,'#14141a')}
  const gx=mid+14,gy=db+20;R(gx-9,gy+8,18,8,'#14141a');R(gx-8,gy+6,16,4,'#24242c');R(gx-2,gy-10,4,18,'#5a5a64');R(gx-1,gy-10,1,18,'#8a8a94');R(gx-5,gy-17,10,8,'#a8323e');R(gx-4,gy-16,4,2,'#d85a5e');
  R(mid+40,db+10,14,12,'#14141a');R(mid+42,db+4,10,14,'#d8cdb4');R(mid+42,db+4,10,1,'#f4efe6');R(mid+44,db+2,2,4,'#e0d8c0');R(mid+42,db+9,10,2,'#c0b49a');
  // a manila envelope and a crumpled cruller bag on the floor mat
  R(mid-6,VH-20,30,16,'#c8a060');R(mid-6,VH-20,30,1,'#e0bc80');R(mid-2,VH-16,12,1,'#7a5a2a');R(mid+14,VH-14,6,4,'#a8323e');R(mid+62,VH-18,16,10,'#c8a87a');R(mid+64,VH-19,5,3,'#a8885a');R(mid+71,VH-12,4,2,'#a8885a');
  // the buddy seat's edge on the right: cracked brown vinyl with a stitched seam
  R(mid+98,db,VW-mid-98,VH-db,'#4a3228');R(mid+98,db,2,VH-db,'#2a1a14');R(mid+100,db+6,VW,2,'#6a4a3a');for(let y=db+14;y<VH;y+=10)for(let x=mid+104;x<VW;x+=4)R(x,y,2,1,'#2e1e18');
  // the crullers in a paper sack and a styrofoam cup on the dash, off to his side (he's still Big Hat)
  R(mid+56,fy-12,24,12,'#c8a87a');R(mid+56,fy-12,24,2,'#a8885a');R(mid+59,fy-15,6,4,'#d9772b');R(mid+67,fy-14,7,3,'#d9772b');R(mid+60,fy-15,4,1,'#f0a860');
  R(mid-76,fy-11,7,11,'#d8cdb4');R(mid-69,fy-9,2,4,'#d8cdb4');R(mid-75,fy-11,5,1,'#3a2418');
  // the steering wheel, tilted, low in front of him so his face stays clear above it
  const wy=fy+6;c.lineWidth=5;c.strokeStyle='#0c0c12';c.beginPath();c.ellipse(wx,wy,30,8,-.1,Math.PI*1.05,Math.PI*1.95);c.stroke();
  c.lineWidth=3;c.strokeStyle='#3a3a42';c.beginPath();c.ellipse(wx,wy,30,8,-.1,Math.PI*1.05,Math.PI*1.95);c.stroke();
  c.lineWidth=1;c.strokeStyle='#6a6a74';c.beginPath();c.ellipse(wx,wy-1,30,8,-.1,Math.PI*1.1,Math.PI*1.45);c.stroke();R(wx-4,wy-3,8,4,'#24242c')}
};

return{paint,props,folk,portraits,fx,combine,lessonGlint,FOLK,PORT,portraitCanvas};
})();
