// Black Lantern · cases/lost-hour-art.js · Lost Hour's art (spec 016 part A, Nov 23, 2026). Exposes window.LHA.
// Art for this case only (Bible, Art, Direction: one case, one set of art); never reuse it in another case.
// Generic pieces come from the Shared Shelf (engine/shelf.js: v1, plus the spring, weather, road and wild ground and clinic
// kits spec 017 draws first here), painted with Black Lantern's palette. This file adds the case's own pieces (Cullen Gap's
// old bank, diner, church and the Pruett house with its carport and scorched car; the sleep lab and exam room fittings;
// the ridge road's pull-off, overlook and drop; the woods and the high pasture), its townsfolk and the Pruetts on the map
// and in the dialog box, and Big Hat's briefing place, the 24-hour laundromat off I-81.
// April in the Blue Ridge (spec 016, Art): new green, redbud and dogwood, wet asphalt and mud by day; thick fog by night
// that swallows the lantern a few tiles out. No autumn or summer-only pieces from the Shelf.
//
//   LHA.paint(M)            the map's still layer -> {c, glows, reflect}; LHA.props(M) its standing pieces
//   LHA.folk(id, dir, idle, M)  a townsperson's map sprite -> {c, ax, ay}
//   LHA.portraits           speaker name -> (ctx, mouth) drawing the 64 x 64 talking portrait
//   LHA.fx(ctx, o)          the case's light and air after the light pass: falling petals and rain by day; fog, the
//                           lantern's warm pool and the guardrail's reflectors by night; the monitors' moving line
//   LHA.laundromat          Big Hat's briefing place: {back, front, lift} (engine.js bigHatScene)
//   LHA.seamGlint           how the hidden hotspot looks while it shows
//
// Lost Hour's accent colors (Bible, Art, Palette; spec 016: fog violet, redbud pink, wet-asphalt blue, one cold white light):
const LH_ACCENT={fog:'#c8b8ff',redbud:'#e070a8',wet:'#3a4a66',cold:'#eef4ff',limestone:'#c8c0ae',diner:'#5a7a8a',neon:'#ff6a8a'};
window.LHA=(()=>{
const K=SHELF,T=16,S=.5,{F,shade,hsh,RGB,art}=K,A=LH_ACCENT;
const ART={};
const get=(k,spec)=>ART[k]||(ART[k]=K.prop(spec(),S));
const isNight=M=>M.light==='night';

// ================= GROUND =================
const GP={',':(x,y)=>K.stoneSidewalk(x,y,T,true),'.':(x,y,M)=>K.springGrass(x,y,T,!!M.rain),':':(x,y)=>K.springGrass(x,y,T,true),';':(x,y,M)=>K.mud(x,y,T,!!M.rain),
 '=':(x,y)=>K.asphalt(x,y,T),'_':(x,y)=>K.asphalt(x,y,T),g:(x,y)=>K.dryDirt(x,y,T,true),t:(x,y)=>{const c=K.dryDirt(x,y,T,false);return hsh(x>>1,y>>1,571)<.05?shade(K.pal().leaf,-.15):shade(c,.3)},s:(x,y)=>K.slope(x,y,T),S:(x,y)=>K.slope(x,y,T,true),'~':(x,y)=>K.creek(x,y,T),
 n:(x,y)=>K.floor(x,y,T,'lino'),c:(x,y)=>K.floor(x,y,T,'carpet'),v:(x,y)=>K.floor(x,y,T,'tile'),w:(x,y)=>K.floor(x,y,T,'wood')};
const SOFT=new Set('.:;gsSt'.split(''));
const at=(M,x,y)=>{const r=M.ground[y];return r?r[x]:undefined};

// ================= THE STILL LAYER =================
const still={};
function paint(M){
 const key=M.id+(isNight(M)?'n':'d')+(M.rain?'r':'')+(M.ph|0);if(still[key])return still[key];
 const W=M.w*T,H=M.h*T,c=K.mk(W,H),g=c.getContext('2d'),img=g.createImageData(W,H),d=img.data,glows=[],reflect=[];
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const tx=(x/T)|0,ty=(y/T)|0;let ch=at(M,tx,ty);
  if(SOFT.has(ch)){const jx=Math.min(W-1,Math.max(0,x+((hsh(x>>1,y>>1,61)*5)|0)-2)),jy=Math.min(H-1,Math.max(0,y+((hsh(x>>1,y>>1,62)*5)|0)-2)),jc=at(M,(jx/T)|0,(jy/T)|0);if(SOFT.has(jc))ch=jc}
  const col=(GP[ch]||GP['.'])(x,y,M),v=RGB(col),i=(y*W+x)*4;d[i]=v[0];d[i+1]=v[1];d[i+2]=v[2];d[i+3]=255}
 g.putImageData(img,0,0);
 // curbs where sidewalk meets road
 for(let ty=0;ty<M.h;ty++)for(let tx=0;tx<M.w;tx++){const a=at(M,tx,ty),b=at(M,tx,ty+1);
  if(a===','&&(b==='='||b==='_')){F(g,tx*T,ty*T+T-2,T,1,shade(K.pal().stoneWarm,.2));F(g,tx*T,ty*T+T-1,T,1,'#1c1820')}}
 M.pieces.filter(p=>PROPK.has(p.k)&&!NOSHADOW.has(p.k)).forEach(p=>{const cx=(p.x+p.w/2)*T+2,cy=(p.y+p.h)*T-2,rx=Math.max(5,p.w*T*.42);
  g.fillStyle='rgba(16,10,20,.28)';g.beginPath();g.ellipse(cx,cy,rx,Math.max(2.5,rx*.28),0,0,6.283);g.fill()});
 M.pieces.filter(p=>STILL[p.k]).sort((a,b)=>(BACK.has(a.k)?-99:a.y+a.h)-(BACK.has(b.k)?-99:b.y+b.h)).forEach(p=>STILL[p.k](g,p,M,glows,reflect));
 return still[key]={c,glows,reflect};
}
const BACK=new Set(['room','ridgeback','drop','upslope','ridgeroad','woodsbase','pasturebase','road','laurel']);
const box=p=>({x0:p.x*T,x1:(p.x+p.w)*T,y0:p.y*T,fb:(p.y+p.h)*T,w:p.w*T});
const shadowBelow=(g,x0,x1,fb)=>{g.fillStyle='rgba(16,10,20,.32)';g.fillRect(x0+3,fb,x1-x0,3);g.fillStyle='rgba(16,10,20,.16)';g.fillRect(x0+5,fb+3,x1-x0-2,2)};
function signOn(g,rect,text,col,ink){const[x,y,w,h]=rect,inner=K.signBlank(g,x,y,w,h,col);const tw=K.signWidth(text);
 K.signText(g,text,Math.round(inner[0]+(inner[2]-tw)/2),Math.round(inner[1]+(inner[3]-5)/2),ink)}
const N_=M=>isNight(M);
const STILL={
 // the Blue Ridge behind town: three layers of mountain, blue going to violet, a little mist between; night is darker
 ridgeback(g,p,M){const W=M.w*T,n=N_(M),cols=n?['#262a40','#1e2236','#181a2c']:M.rain?['#8a92a8','#6e7890','#5a6478']:['#9aa8c8','#7a8ab0','#5e6e94'];
  F(g,0,0,W,2*T,n?'#14162a':M.rain?'#a8aebc':'#c8d4e8');
  cols.forEach((col,i)=>{for(let x=0;x<W;x++){const h=8+i*7+Math.sin(x/(60-i*12)+i*2)*5+Math.sin(x/17+i)*2+hsh(x>>2,i,501)*2;F(g,x,2*T-h-(2-i)*3,1,h+(2-i)*3,col)}
   if(i<2)for(let x=0;x<W;x+=2)F(g,x,2*T-6-i*5,2,1,n?'rgba(200,184,255,.08)':'rgba(255,255,255,.25)')});
  if(n){g.fillStyle='rgba(238,244,255,.5)';g.fillRect(W*.62,4,2,2);g.fillStyle='rgba(238,244,255,.15)';g.fillRect(W*.62-2,2,6,6)}},
 // the clinic in the old Farmers Bank: limestone, a pediment, four columns, gold letters on the glass, a night-deposit slot
 bank(g,p,M,glows){const{x0,x1,y0,fb}=box(p),L=A.limestone,Ld=shade(L,-.3),Ll=shade(L,.25),mid=(x0+x1)/2;
  for(let i=0;i<14;i++){F(g,mid-i*4.6,y0+4+i,i*9.2,1,i<2?Ll:L)}F(g,x0+4,y0+18,x1-x0-8,4,Ll);F(g,x0+2,y0+22,x1-x0-4,3,Ld);
  signOn(g,[mid-30,y0+9,60,8],'FARMERS BANK',L,shade(L,-.55));
  F(g,x0+4,y0+25,x1-x0-8,fb-y0-31,shade(L,-.08));for(let y=y0+29;y<fb-6;y+=6)F(g,x0+4,y,x1-x0-8,1,shade(L,-.2));
  const cols=[x0+10,x0+38,x1-46,x1-18];
  for(let i=0;i<cols.length-1;i++){const a=cols[i]+8,b=cols[i+1];if(b-a<10)continue;F(g,a+2,y0+34,b-a-4,fb-y0-46,'#20242c');F(g,a+3,y0+35,b-a-6,fb-y0-48,N_(M)?'#e7b65a':'#8aa0b4');F(g,a+3,y0+35,b-a-6,5,N_(M)?'#ffd88a':'#b0c4d4');glows.push([(a+b)/2,y0+44,T*1.2,.35])}
  K.door(g,mid,fb-1.05*T,fb-4,'#3a2a24',T);F(g,mid-6,fb-1.05*T+2,12,4,A.limestone);
  K.signText(g,'SLEEP',mid-28,y0+38,'#d6a43a');K.signText(g,'CENTER',mid+8,y0+38,'#d6a43a');
  cols.forEach(cx=>{F(g,cx,y0+25,8,fb-y0-31,L);F(g,cx,y0+25,2,fb-y0-31,Ll);F(g,cx+6,y0+25,2,fb-y0-31,Ld);F(g,cx-1,y0+25,10,3,Ll);F(g,cx-1,fb-8,10,3,Ld)});
  F(g,x0+2,fb-6,x1-x0-4,3,shade(L,.1));F(g,x0,fb-3,x1-x0,3,Ld);
  F(g,x0+20,fb-20,8,3,'#8a6a2a');F(g,x0+21,fb-19,6,1,'#1a1418');shadowBelow(g,x0,x1,fb)},
 store(g,p,M,glows){const{x0,x1,y0,fb}=box(p),face=(p.upper?2.6:2.2)*T,top=fb-face,n=N_(M);
  // the flat tar roof seen from above: gravel, a parapet, a vent and an AC box, rain puddles on day 2
  F(g,x0-1,y0+3,x1-x0+2,top-y0-1,'#4a4450');for(let y=y0+5;y<top;y++)for(let x=x0;x<x1;x+=2)if(hsh(x,y,581)<.22)F(g,x,y,1,1,hsh(x,y,582)<.5?'#5a5662':'#3a3440');
  F(g,x0-1,y0+3,x1-x0+2,2,'#6a6472');F(g,x0-1,top-3,x1-x0+2,2,'#2e2834');F(g,x0-1,y0+3,2,top-y0-3,'#5e5866');F(g,x1-1,y0+3,2,top-y0-3,'#2e2834');
  F(g,x0+8,y0+8,14,9,'#8a8a94');F(g,x0+8,y0+8,14,2,'#aaaab4');for(let k=0;k<4;k++)F(g,x0+10+k*3,y0+11,2,5,'#5a5a64');F(g,x0+21,y0+8,1,9,'#4a4a54');
  F(g,x1-14,y0+10,4,5,'#6a6a74');F(g,x1-15,y0+9,6,2,'#8a8a94');if(M.rain){g.fillStyle='rgba(120,150,190,.5)';g.beginPath();g.ellipse((x0+x1)/2+6,top-8,9,2,0,0,6.283);g.fill()}
  const r=K.storefront(g,x0,x1,top,fb,T,{col:p.col,door:p.door*T+8,upper:p.upper});
  if(p.awning)K.awning(g,x0+3,x1-3,fb-T*1.12,T);
  signOn(g,[r.sign[0],r.sign[1],r.sign[2],Math.min(9,r.sign[3])],p.sign,'#e8dcc0',p.diner?'#a8323e':'#2e4a6a');
  if(p.diner){F(g,x0+6,fb-T*.85,14,6,'#2a1a20');K.signText(g,'OPEN',x0+7,fb-T*.85+1,n?'#3a2a30':A.neon);if(!n)glows.push([x0+13,fb-T*.8,T,.4])}
  if(p.flag){F(g,x1-6,y0+6,1,top-y0+4,'#c0c0c8');F(g,x1-16,y0+6,10,6,'#a8323e');for(let i=0;i<3;i++)F(g,x1-16,y0+7+i*2,10,1,'#e8e4d8');F(g,x1-16,y0+6,4,3,'#2e4a8a')}
  if(!n||p.diner)r.glows.forEach(x=>glows.push(x));
  shadowBelow(g,x0,x1,fb)},
 // the church: white clapboard, a steeple with a louvered belfry, arched windows, double doors
 church(g,p,M,glows){const{x0,x1,fb}=box(p),rb=fb-2.6*T,w=x1-x0,mid=(x0+x1)/2,wc='#e8e4dc';
  K.roof(g,x0,x1,rb-1.4*T,rb,'#4a4e5a',T,4,false);K.wall(g,x0,x1,rb,fb,'siding',wc,T);
  F(g,mid-12,4,24,rb-1.2*T,wc);for(let y=6;y<rb-T*1.2;y+=3)F(g,mid-12,y,24,1,shade(wc,-.12));F(g,mid+8,4,4,rb-1.2*T,'rgba(20,10,20,.2)');
  F(g,mid-8,10,16,12,'#3a3440');for(let y=12;y<22;y+=2)F(g,mid-8,y,16,1,'#6a6470');
  for(let i=0;i<14;i++)F(g,mid-12+i*.86,4-i*.3-i,24-i*1.72,1,'#4a4e5a');F(g,mid,-20,1,8,'#c8c0a0');F(g,mid-3,-17,7,1,'#c8c0a0');
  for(const wx of[x0+10,x1-22]){F(g,wx,rb+8,12,20,'#2a2430');F(g,wx+1,rb+9,10,18,N_(M)?'#c89a5a':'#7a8ab0');F(g,wx+2,rb+6,8,3,'#2a2430');F(g,wx+5,rb+9,1,18,'#2a2430');glows.push([wx+6,rb+18,T,.3])}
  K.door(g,mid,fb-1.1*T,fb,'#7a2a2e',T,true);signOn(g,[mid-22,rb+2,44,8],'METHODIST',wc,'#2a2030');shadowBelow(g,x0,x1,fb)},
 house(g,p,M,glows){const{x0,x1,y0,fb}=box(p),rb=fb-1.4*T,dr=p.door*T+8;
  const r=K.ranchHouse(g,x0,x1,y0+6,rb,fb,T,{col:p.col,roofCol:p.roof,door:dr,shutters:p.shutters,seed:p.seed,chim:p.seed%2===1,curtains:1});
  if(!N_(M)||p.seed%2)r.glows.forEach(x=>glows.push(x));
  if(p.porch)K.porch(g,dr-1.5*T,Math.min(x1-.2*T,dr+1.8*T),fb,T,{stepX:dr,roof:true});shadowBelow(g,x0,x1,fb)},
 // the Pruett house: pale yellow siding, blue shutters, a porch, and every window lit (Donna leaves every light on)
 pruett(g,p,M,glows){const{x0,x1,y0,fb}=box(p),rb=fb-1.5*T,dr=p.door*T+8,n=N_(M);
  const r=K.ranchHouse(g,x0,x1,y0+8,rb,fb,T,{col:'#e8d8a0',roofCol:'#5a4a4a',door:dr,shutters:'#3e5a8a',seed:2,chim:true,curtains:1,doorCol:'#3e5a8a'});
  r.glows.forEach(([x,y,rr,a])=>glows.push([x,y,rr*(n?1.8:1),n?.6:a]));
  K.porch(g,dr-1.6*T,dr+1.6*T,fb,T,{stepX:dr,roof:true});
  F(g,dr+.7*T,fb-1.25*T,4,4,'#fff2c8');glows.push([dr+.7*T+2,fb-1.2*T,T*1.4,.55]);    // the porch light, on day and night
  shadowBelow(g,x0,x1,fb)},
 carport(g,p,M){const{x0,x1,y0,fb}=box(p),m='#8a8e96';
  F(g,x0+2,y0+8,x1-x0-4,fb-y0-14,'rgba(16,10,20,.25)');
  F(g,x0,y0+2,x1-x0,8,m);F(g,x0,y0+2,x1-x0,2,shade(m,.3));for(let x=x0;x<x1;x+=4)F(g,x,y0+4,1,6,shade(m,-.2));F(g,x0,y0+10,x1-x0,2,'#2a2a30');
  for(const px of[x0+2,x1-5]){F(g,px,y0+12,3,fb-y0-14,'#c0c0c8');F(g,px+2,y0+12,1,fb-y0-14,'#7a7a84')}
  F(g,x0+6,y0+14,10,8,'#5a4a3a');F(g,x0+7,y0+15,8,6,'#7a6a5a');F(g,x1-14,y0+18,8,10,'#3e6a4a')},  // a tool chest, a garden bag
 picket(g,p){const{x0,x1,y0}=box(p);K.picketFence(g,x0,x1,y0+4,T)},
 // Main Street: the Shelf's two-lane, wet on day 2, a crosswalk at Laurel
 road(g,p,M){const{x0,x1,y0}=box(p);K.twoLane(g,x0,x1,y0,T,{lanes:1.5,shoulder:.5,wet:!!M.rain,pass:true});
  for(let x=19*T+2;x<22*T-2;x+=5)F(g,x,(p.y+p.h)*T-14,3,12,'#e8e4d8')},
 laurel(g,p){const{x0,x1,y0,fb}=box(p);F(g,x0,y0,1,fb-y0,'#1c1820');F(g,x1-1,y0,1,fb-y0,'#1c1820');for(let y=y0+8;y<fb;y+=14)F(g,(x0+x1)/2-1,y,2,7,'#d6a43a')},
 // the pasture fence across the bottom, the gate at Laurel's end, and the hill going up into fog beyond it
 pasture(g,p,M){const{x0,x1,y0,fb}=box(p),gx=p.gate*T,top=y0+T;
  for(let y=top;y<fb;y++)for(let x=x0;x<x1;x++){const k=(y-top)/(fb-top);g.fillStyle=k>.5?shade(K.pal().leaf,-.2-k*.2):shade(K.pal().leaf,-.05);if(hsh(x,y,511)<.3)g.fillRect(x,y,1,1)}
  for(let x=x0;x<x1;x+=T){if(x>=gx-T&&x<gx+2*T)continue;F(g,x+6,top-10,3,14,'#5a4030');F(g,x+6,top-10,1,14,'#7a5a40')}
  for(const ry of[top-8,top-3])for(let x=x0;x<x1;x++){if(x>=gx-6&&x<gx+T+6)continue;F(g,x,ry,1,2,(x>>3)%2?'#8a6a4a':'#7a5a3a')}
  for(const px of[gx-6,gx+T+3]){F(g,px,top-14,4,18,'#5a4030');F(g,px,top-14,1,18,'#8a6a4a')}
  if(M.ph===3){F(g,gx+T+4,top-12,3,14,'#9a9aa4');for(let i=0;i<5;i++)F(g,gx+T+6,top-12+i*3,12,1,'#9a9aa4')}
  else{for(let i=0;i<4;i++)F(g,gx-2,top-11+i*3,T+4,1,'#9a9aa4');F(g,gx+5,top-6,4,4,'#6a6a74')}},
 // interiors: the back wall, the side walls and the bottom wall with its door gap, then each room's fittings
 room(g,p,M,glows){const W=M.w*T,H=M.h*T,kind={kitchen:['plain','#d8c890'],bedroom:['plain','#b8c0d8'],diner:['panel','#8a5a4a'],clinic:['plain','#d8d4c4'],lab:['plain','#a8b8c0'],exam:['plain','#c8d8d0']}[M.id]||['plain','#b8a888'];
  K.innerWall(g,T,W-T,0,3*T,kind[0],kind[1],T);
  F(g,0,0,T,H,'#1e1826');F(g,T-2,0,2,H-T,'#3a3046');F(g,W-T,0,T,H,'#1e1826');F(g,W-T,0,2,H-T,'#2a2236');
  F(g,0,H-T,W,T,'#1e1826');F(g,T,H-T,W-2*T,2,'#3a3046');
  const dk=Object.keys(M.warps).find(k=>+k.split(',')[1]===M.h-1);if(dk){const[x]=dk.split(',').map(Number);F(g,x*T+1,H-T,T-2,T,'#6a4a3a');F(g,x*T+3,H-T+3,T-6,T-6,'#8a5a3a');for(let i=0;i<4;i++)F(g,x*T+4,H-T+5+i*2,T-8,1,'#5a3a2a')}
  (DECOR[M.id]||(()=>{}))(g,M,glows)},
 backdoor(g,p){const x=p.x*T+8;K.door(g,x,1.15*T,3*T,p.shut?'#5a5a64':'#7a6a5a',T);if(!p.shut){F(g,x-3,1.3*T,6,4,'#e8e4d8')}},
 photos(g,p){const bx=p.x*T+2;[[0,4,14,12],[17,2,12,15],[32,5,12,10],[6,20,10,8],[22,20,14,9]].forEach(([x,y,w,h],i)=>{F(g,bx+x,y,w,h,i%2?'#c8a040':'#e8e4d8');F(g,bx+x+1,y+1,w-2,h-2,['#f4f0e8','#d8d0c0','#e8e0f0'][i%3]);
  F(g,bx+x+3,y+3,3,h-6,'#f8f8f8');F(g,bx+x+3,y+2,3,2,'#6a4a2a');F(g,bx+x+w-6,y+4,3,h-7,'#3a3a4a');F(g,bx+x+w-6,y+3,3,2,'#9aa0a6')})},
 lineman(g,p){const x=p.x*T+6,y=.4*T;F(g,x,y,20,16,'#6a4a32');F(g,x+1,y+1,18,14,'#7a8aa0');F(g,x+9,y+2,1,13,'#3a2a24');F(g,x+4,y+4,12,1,'#3a2a24');F(g,x+10,y+6,3,4,'#d6a43a');F(g,x+10,y+5,3,1,'#f4f0e8')},
 curtain(g,p,M,glows){const x=p.x*T+2,y=.3*T;F(g,x,y,26,24,'#3a3046');F(g,x+1,y+1,24,22,'#d8c0e0');for(let i=0;i<24;i+=3)F(g,x+1+i,y+1,1,22,'#b8a0c8');F(g,x+12,y+1,2,22,'#2a2030');F(g,x-2,y-1,30,2,'#8a6a4a');F(g,x+11,y+10,4,2,'#c8a040')},
 pass(g,p){const x0=p.x*T,x1=(p.x+p.w)*T;F(g,x0,.7*T,x1-x0,1.6*T,'#2a2030');F(g,x0+2,.8*T,x1-x0-4,1.3*T,'#5a4a3a');for(let x=x0+6;x<x1-6;x+=14){F(g,x,1.5*T,10,4,'#e8e4d8');F(g,x+2,1.4*T,6,2,'#d8a040')}
  F(g,x0,2.1*T,x1-x0,3,'#c0c0c8');F(g,x0+10,.9*T,24,8,'#f4efe6');for(let i=0;i<3;i++)F(g,x0+12+i*8,.9*T+2,6,4,'#c8b8a0')},
 coffee(g,p){const x=p.x*T+2,y=1.4*T;F(g,x,y,26,16,'#3a3a44');F(g,x+2,y+3,8,10,'#2a1a14');F(g,x+14,y+3,8,10,'#2a1a14');F(g,x+3,y+6,6,6,'#5a2a14');F(g,x+15,y+8,6,4,'#5a2a14');F(g,x+2,y+1,22,1,'#d8a040')},
 vault(g,p){const cx=(p.x+p.w/2)*T,cy=1.6*T;g.fillStyle='#2a2a30';g.beginPath();g.arc(cx,cy,22,0,6.283);g.fill();g.fillStyle='#8a8a94';g.beginPath();g.arc(cx,cy,20,0,6.283);g.fill();
  g.fillStyle='#1a1a22';g.beginPath();g.arc(cx,cy,15,0,6.283);g.fill();for(let i=0;i<5;i++)F(g,cx-12+i*5,cy-8,4,14,'#c8b090');F(g,cx-13,cy+6,26,2,'#5a4a3a');
  g.fillStyle='#a8a8b0';g.beginPath();g.arc(cx+26,cy,7,0,6.283);g.fill();g.fillStyle='#6a6a74';g.beginPath();g.arc(cx+26,cy,4,0,6.283);g.fill()},
 mirror(g,p){const x=p.x*T+4,y=.45*T;F(g,x,y,40,24,'#4a4e58');F(g,x+2,y+2,36,20,'#0e1018');F(g,x+4,y+4,8,1,'#3a4050');F(g,x+6,y+6,4,1,'#3a4050');F(g,x+30,y+16,6,1,'#2a3040')},
 lightbox(g,p){const x=p.x*T+6,y=.4*T;F(g,x,y,34,26,'#5a5a64');F(g,x+2,y+2,30,22,'#e8f0f8');g.fillStyle='#2a3040';g.beginPath();g.ellipse(x+16,y+12,9,8,0,0,6.283);g.fill();
  g.fillStyle='#c8d0dc';g.beginPath();g.ellipse(x+16,y+12,7,6,0,0,6.283);g.fill();F(g,x+12,y+16,6,4,'#c8d0dc');F(g,x+21,y+13,2,2,'#f4f8ff')},
 runner(g,p){const{x0,x1,y0,fb}=box(p);F(g,x0+3,y0,x1-x0-6,fb-y0,'#7a2a3a');F(g,x0+5,y0,x1-x0-10,fb-y0,'#9a3a4a');for(let y=y0+4;y<fb;y+=8)F(g,x0+7,y,x1-x0-14,1,'#c8a040')},
 rug(g,p){const{x0,x1,y0}=box(p);F(g,x0+2,y0+3,x1-x0-4,T-4,'#7a3a4a');F(g,x0+4,y0+5,x1-x0-8,T-8,'#9a5a6a');for(let x=x0+2;x<x1-2;x+=3)F(g,x,y0+T-2,1,2,'#d8c0a0')},
 // THE RIDGE ROAD: the uphill bank, the road with its curve, the drop's fog sea and treetops, guardrails, pull-off and wall
 upslope(g,p,M){const W=M.w*T;for(let x=0;x<W;x+=3){const h=8+hsh(x>>3,1,521)*20;F(g,x,0,3,h,'#1a1e1a');F(g,x,h,3,2,'#2a2a22')}
  for(let i=0;i<14;i++){const x=hsh(i,2,521)*W,w=10+hsh(i,3,521)*18;F(g,x,30,w,22,'#5a5a5e');F(g,x,30,w,3,'#7a7a7e');F(g,x+w-3,30,3,22,'#3a3a3e')}},
 ridgeroad(g,p,M,glows){K.twoLane(g,0,37*T,4*T,T,{lanes:1.5,shoulder:.5,wet:true});K.twoLaneCurve(g,36*T,-4*T,10*T,.1,Math.PI/2,T,{lanes:1.5,shoulder:.5,wet:true})},
 drop(g,p,M){const W=M.w*T,y0=p.y*T,H=M.h*T;
  const isDrop=(x,y)=>at(M,(x/T)|0,(y/T)|0)==='S';
  for(let y=y0;y<H;y++)for(let x=0;x<W;x++){if(!isDrop(x,y))continue;const k=(y-y0)/(H-y0);g.fillStyle=k<.22?shade(K.slope(x,y,T,true),-.15-k*2):'#141a1c';if(k<.25||hsh(x,y,531)<.5)g.fillRect(x,y,1,1)}
  for(let i=0;i<90;i++){const x=hsh(i,1,532)*W,y=y0+40+hsh(i,2,532)*(H-y0-40),r=6+hsh(i,3,532)*8;if(!isDrop(x,y-r)||!isDrop(x,y))continue;g.fillStyle=['#1e2e24','#243828','#1a2620'][i%3];g.beginPath();g.arc(x,y,r,0,6.283);g.fill();g.fillStyle='rgba(120,140,120,.15)';g.beginPath();g.arc(x-2,y-3,r*.5,0,6.283);g.fill()}
  for(let y=y0+30;y<H;y+=3){const a=Math.min(.55,(y-y0-30)/(H-y0)*.9);g.fillStyle=`rgba(200,184,255,${a.toFixed(2)})`;for(let x=0;x<W;x+=T)if(isDrop(x,y))g.fillRect(x,y,T,3)}},
 guardrail(g,p,M,glows,reflect){const{x0,x1,y0}=box(p);K.guardrail(g,x0,x1,y0+3,T,{ends:p.ends}).forEach(r=>reflect.push(r))},
 pulloff(g,p,M){const x0=p.x*T,y0=(p.y+4)*T;F(g,x0+T,y0,(p.w-2)*T,1,'#1c1820');F(g,x0+T,y0+1,(p.w-2)*T,1,'#8a8478');
  for(let x=x0+2*T;x<x0+(p.w-2)*T;x+=3*T){F(g,x,p.y*T+40,8,1,'rgba(232,228,216,.35)')}},
 stonewall(g,p){const{x0,x1,y0}=box(p);K.stoneWallSide(g,x0,y0-2*T,y0+4,T);K.stoneWallSide(g,x1-.5*T,y0-2*T,y0+4,T);K.stoneWall(g,x0,x1,y0+2,T,{h:.8})},
 // the trail's sign at its placed tile (p.x, p.y), by the overlook wall's end; the worn path runs down past it onto the trail tile
 trailhead(g,p){const x=p.x*T,y=p.y*T;F(g,x+4,y+T+2,8,T-2,shade(K.pal().earth,-.1));F(g,x+6,y,3,T-2,'#3a2a20');F(g,x+6,y,1,T-2,'#5a4030');
  F(g,x-3,y-7,22,10,'#2a1e18');F(g,x-2,y-6,20,8,'#6a5a3a');F(g,x-2,y-6,20,1,'#8a7a58');K.signText(g,'TRAIL',x-1,y-4,'#e8dcc0')},
 // THE WOODS: the steep slope's dark under the trees, a few fallen logs; the creek's banks
 woodsbase(g,p,M,glows,reflect){const W=M.w*T,H=M.h*T;for(let i=0;i<9;i++){const x=hsh(i,4,541)*W,y=hsh(i,5,541)*(H-60),w=30+hsh(i,6,541)*30;if(at(M,(x/T)|0,(y/T)|0)==='s')continue;
   F(g,x,y,w,5,'#4a3424');F(g,x,y,w,1,'#6a4a32');F(g,x+w-4,y-1,5,7,'#3a281e')}
  for(let ty=0;ty<M.h;ty++)for(let tx=0;tx<M.w;tx++){if(at(M,tx,ty)!=='t')continue;const up=at(M,tx,ty-1),dn=at(M,tx,ty+1);if(up&&up!=='t')F(g,tx*T,ty*T,T,2,'rgba(16,10,20,.4)');if(dn&&dn!=='t')for(let x=tx*T;x<tx*T+T;x+=4)F(g,x+(hsh(x,ty,572)*2|0),ty*T+T-2,3,2,'#6a6058')}
  (M.blazes||[]).forEach(([bx,by])=>{const x=bx*T+5,y=by*T-6;F(g,x,y-14,6,22,'#3a2a20');F(g,x+1,y-14,1,22,'#5a4030');F(g,x+1,y-6,4,6,'#e8e4d8');reflect.push([x+3,y-3,1])})},
 creek(g,p,M){const y0=p.y*T;F(g,0,y0,M.w*T,2,'#2a2018');for(let x=0;x<M.w*T;x+=7)F(g,x,y0+2,4,2,'#8a8478')},
 shoe(g,p){const x=p.x*T+3,y=p.y*T+9;F(g,x,y,9,3,'#a8323e');F(g,x+6,y-3,3,3,'#a8323e');F(g,x+1,y,7,1,'#c8524e');F(g,x+7,y+3,1,2,'#3a1a1a')},
 hubcap(g,p){const x=p.x*T+8,y=p.y*T+9;g.fillStyle='#9a9aa4';g.beginPath();g.ellipse(x,y,6,3,0,0,6.283);g.fill();g.fillStyle='#c8c8d0';g.beginPath();g.ellipse(x-1,y-1,3,1.5,0,0,6.283);g.fill()},
 // THE HIGH PASTURE: the fence all round, a ring of flattened grass
 pasturebase(g,p,M){const W=M.w*T,H=M.h*T;
  for(let x=0;x<W;x++)F(g,x,0,1,2*T,shade('#1e2a20',hsh(x>>3,0,551)*.2));for(let x=0;x<W;x+=T){F(g,x+6,T,3,T+4,'#4a3424')}F(g,0,T+6,W,2,'#6a4a32');F(g,0,T+14,W,2,'#5a4030');
  for(let y=2*T;y<H;y+=T){F(g,6,y,3,T,'#4a3424');F(g,W-9,y,3,T,'#4a3424')}F(g,0,H-T+4,W,2,'#6a4a32');F(g,0,H-T+10,W,2,'#5a4030');
  for(let i=0;i<220;i++){const x=hsh(i,1,553)*W,y=2.2*T+hsh(i,2,553)*(H-3.4*T),L=K.pal().leaf;F(g,x,y,1,3,shade(L,-.3));F(g,x+2,y+1,1,2,shade(L,-.2));F(g,x-1,y+1,1,2,shade(L,-.35));if(i%5===0)F(g,x+1,y-1,1,1,i%10?'#f4f0e8':'#e8c040')}
  F(g,15*T-4,H-T,T+8,T,'#3a3428');for(let i=0;i<4;i++)F(g,15*T-2,H-T+2+i*3,T+4,1,'#9a9aa4')},
 burnring(g,p){const cx=(p.x+p.w/2)*T,cy=(p.y+p.h/2)*T,rx=p.w*T/2-6,ry=p.h*T/2-6;
  for(let a=0;a<6.283;a+=.02){const r=1+hsh((a*50)|0,1,552)*.08;for(let k=-3;k<=3;k++){F(g,cx+Math.cos(a)*(rx+k)*r,cy+Math.sin(a)*(ry+k*.7)*r,1,1,Math.abs(k)<2?'#2a2a20':'#4a4a30')}}}
};
// each room's wall fittings
const DECOR={
 kitchen(g,M,glows){glows.push(K.windowPane(g,2.5*T,.4*T,1.4*T,1.2*T,T,true));F(g,10.5*T,.5*T,12,12,'#e8e4d8');F(g,10.5*T+1,.5*T+1,10,10,'#f4f0e8');F(g,10.5*T+6,.5*T+3,1,4,'#2a2030');F(g,10.5*T+6,.5*T+6,3,1,'#2a2030')},
 bedroom(g,M,glows){F(g,4*T,.6*T,2*T,.8*T,'#8a6a4a');F(g,4*T+2,.6*T+2,2*T-4,.8*T-4,'#c8b8a0');K.signText(g,'HOME',4*T+8,.6*T+4,'#7a2a3a')},
 diner(g,M,glows){F(g,9.5*T,.4*T,3.5*T,1.4*T,'#2a2030');F(g,9.5*T+2,.4*T+2,3.5*T-4,1.4*T-4,'#f4efe6');K.signText(g,'PIE 3.50',9.5*T+5,.4*T+4,'#a8323e');K.signText(g,'EGGS 2.75',9.5*T+5,.4*T+11,'#2a2030');K.signText(g,'COFFEE 1',9.5*T+5,.4*T+18,'#2a2030')},
 clinic(g,M,glows){for(const x of[1.2,11.4])glows.push(K.windowPane(g,x*T,.4*T,1.4*T,1.6*T,T,false));signOn(g,[3.5*T,.2*T-1,4*T,8],'RECORDS','#e8dcc0','#2e4a6a')},
 lab(g,M,glows){F(g,6*T,.5*T,2*T,1.2*T,'#e8e4d8');for(let i=0;i<4;i++)F(g,6*T+3,.5*T+3+i*4,2*T-6,1,'#8a8a94');K.signText(g,'QUIET',6*T+7,.5*T+2,'#a8323e')},
 exam(g,M,glows){F(g,1.5*T,.5*T,2*T,1.4*T,'#e8e4d8');F(g,1.5*T+2,.5*T+2,2*T-4,1.4*T-4,'#f4f0e8');K.signText(g,'EYE',1.5*T+8,.5*T+4,'#2a2030');for(let i=0;i<3;i++)F(g,1.5*T+6+i,.5*T+11+i*4,12-i*3,2,'#2a2030')}
};

// ================= STANDING PIECES =================
const SPEC={
 planter:()=>({size:[30,40,0,0],anchor:[15,38],lights:[],draw({R,C}){R(3,24,24,14,'#8a6a5a',{sh:6});R(2,22,26,4,'#a88a7a');const L=K.pal().leaf;for(let i=0;i<6;i++)C(6+i*4,16+(i%2)*3,4,i%2?shade(L,-.1):L);for(let i=0;i<5;i++)C(7+i*4,13+(i%3)*2,2,i%2?'#e8c040':A.redbud)}}),
 phonebooth:()=>({size:[24,66,0,0],anchor:[12,64],lights:[[12,10,1,.4]],draw({R}){R(1,6,22,58,'#5a6a7a',{sh:6});R(1,6,22,2,'#7a8a9a');R(3,10,18,44,'#a8c0d0');R(3,10,18,3,'#d0e0ea');R(11,10,2,44,'#5a6a7a');R(3,32,18,2,'#5a6a7a');R(2,0,20,7,'#3a4a5a');R(5,2,14,3,'#e8e4d8');R(6,40,6,10,'#2a2a30')}}),
 mailbox:()=>K.mailbox(true),
 cruiser:()=>{const s=K.sedan('side','#e8e4d8');return{size:[108,62,4,16],anchor:[52,46],lights:[],draw(o){s.draw(o);const{R}=o;R(40,-6,24,6,'#2a2a30');R(41,-5,10,4,'#c8302e');R(53,-5,10,4,'#2e5ac8');R(4,26,96,3,'#2e4a6a');R(58,22,10,6,'#d6a43a');R(60,23,6,4,'#2e4a6a')}}},
 hutch:()=>({size:[32,66,0,0],anchor:[16,64],lights:[],draw({R}){const w=K.pal().wood;R(1,0,30,30,shade(w,.05),{sh:6});R(3,3,26,24,'#3a2a24');for(const y of[3,15])for(const x of[4,12,20])R(x,y+2,6,7,['#e8e4d8','#7aa8c8','#e8a0b0'][(x+y)%3]);R(0,30,32,4,shade(w,.2));R(1,34,30,30,w,{sh:6});R(4,38,11,22,shade(w,-.12));R(17,38,11,22,shade(w,-.12));R(13,46,2,4,K.pal().brass);R(17,46,2,4,K.pal().brass)}}),
 floorlamp:()=>({size:[22,70,0,0],anchor:[11,68],lights:[[11,10,1.8,.5]],draw({R,E}){R(10,18,2,48,'#3a3030');R(5,64,12,4,'#3a3030');E(11,12,10,8,'#f0d8a0');E(11,10,8,5,'#fff0c8');R(2,16,18,3,'#d8b880')}}),
 plant:()=>({size:[24,44,0,0],anchor:[12,42],lights:[],draw({R,C}){R(5,28,14,14,'#b5532e',{sh:3});R(4,27,16,3,'#c8683e');const L=K.pal().leaf;C(12,16,9,shade(L,-.2));C(8,12,6,L);C(16,10,6,L);C(12,5,5,shade(L,.2));C(6,20,4,shade(L,.1))}}),
 dresser:()=>({size:[34,46,0,0],anchor:[17,44],lights:[[17,8,1,.4]],draw({R}){const w=K.pal().wood;R(1,14,32,30,w,{sh:6});R(0,12,34,3,shade(w,.25));for(const y of[18,28,38]){R(3,y,28,8,shade(w,-.1));R(15,y+3,4,1,K.pal().brass)}
  [['#f0d040',3],['#e8e4f8',10],['#a8e0f0',17],['#f0a8c8',25]].forEach(([c,x])=>{R(x,6,6,6,c);R(x+1,5,4,1,shade(c,.4))})}}),
 counter:()=>K.counter(8),
 tablechairs:()=>K.tableChairs('#c8402e'),
 runner:()=>({size:[32,96,0,0],anchor:[16,96],lights:[],draw({R}){R(0,0,32,96,'#7a2a3a');R(2,0,28,96,'#9a3a4a');for(let y=4;y<96;y+=8)R(6,y,20,1,'#c8a040')}}),
 piecase:()=>({size:[64,52,0,0],anchor:[32,48],lights:[[32,14,1.2,.35]],draw({R}){R(2,24,60,24,'#8a3a3a',{sh:10});R(0,2,64,24,'#a8b8c0');R(2,4,60,20,'#e8f4f8');for(let i=0;i<3;i++){R(6+i*20,12,14,8,['#f4e8c0','#c86a3a','#a83a5a'][i]);R(6+i*20,12,14,2,'#f8f4e8')}R(0,0,64,3,'#c0c8d0')}}),
 dbooth:()=>({size:[32,62,0,0],anchor:[16,60],lights:[],draw({R}){R(4,0,24,34,'#a8323e',{sh:6});R(4,0,24,3,'#c8524e');for(let x=8;x<26;x+=6)R(x,4,1,28,'#8a2a32');R(2,32,28,10,'#c8524e',{sh:6});R(0,40,32,4,'#e8e4d8');R(6,44,4,14,'#5a5a64');R(22,44,4,14,'#5a5a64')}}),
 jukebox:()=>({size:[30,62,0,0],anchor:[15,60],lights:[[15,16,1.2,.35]],draw({R,E}){E(15,14,13,12,'#c86a3a');R(2,14,26,46,'#c86a3a',{sh:6});E(15,14,10,9,'#f0c060');for(let i=0;i<5;i++)R(5+i*4,30,2,24,['#f04a6a','#4ac0f0','#f0d040','#6af06a','#c06af0'][i]);R(4,54,22,4,'#3a2a24')}}),
 teller:()=>({size:[224,60,0,0],anchor:[112,56],lights:[],draw({R}){const w='#6a4a32',b='#c8a040';R(0,24,224,32,w,{sh:20});R(0,22,224,4,shade(w,.25));for(let x=8;x<216;x+=28)R(x,30,20,20,shade(w,-.12));
  for(let x=0;x<224;x+=6){if(x>84&&x<140)continue;R(x,0,2,22,b)}R(0,0,224,2,shade(b,.3));R(0,10,224,1,shade(b,-.2));R(100,18,24,4,'#e8e4d8');R(140,16,6,6,'#d8a040')}}),
 wchairs:()=>K.waitingChairs(3,'#3e6a8a'),
 clock:()=>({size:[22,72,0,0],anchor:[11,70],lights:[],draw({R,C}){R(3,10,16,60,'#5a3a24',{sh:4});C(11,10,9,'#5a3a24');C(11,10,7,'#f4efe6');R(11,5,1,5,'#2a2030');R(11,10,4,1,'#2a2030');R(7,30,8,26,'#3a2418');R(10,32,2,18,'#c8a040');C(11,50,3,'#d8b050')}}),
 column:()=>({size:[22,80,0,0],anchor:[11,78],lights:[],draw({R}){const L=A.limestone;R(2,0,18,6,shade(L,.2));R(4,6,14,66,L,{sh:4});R(4,6,3,66,shade(L,.25));for(let x=8;x<16;x+=3)R(x,8,1,62,shade(L,-.12));R(2,72,18,6,shade(L,-.15))}}),
 labbed:()=>{const b=K.hospitalBed(false);return{size:b.size,anchor:b.anchor,lights:[],draw(o){b.draw(o);const{R}=o;[[20,8,'#c83a3a'],[30,6,'#3a8ac8'],[38,9,'#e8c040'],[44,12,'#3ac86a']].forEach(([x,y,c],i)=>{for(let k=0;k<10;k++)R(x+Math.sin(k*.7+i)*2,y+k*1.6,1,1,c);R(x-1,y,3,2,c)})}}},
 examtable:()=>({size:[60,50,0,0],anchor:[30,46],lights:[],draw({R}){R(4,10,52,10,'#6a8aa0',{sh:8});R(4,8,52,3,'#8aaac0');R(14,6,32,14,'#f4f4f0');for(let y=8;y<20;y+=3)R(14,y,32,1,'#e0e0d8');R(10,20,40,22,'#c8ccd0',{sh:8});R(12,24,16,8,'#a8acb0');R(32,24,16,8,'#a8acb0');R(4,0,16,10,'#6a8aa0');R(4,40,52,4,'#5a5e64')}}),
 monitor:()=>K.MONITOR,
 obs:()=>K.DESK,
 nightstand:()=>({size:[22,34,0,0],anchor:[11,32],lights:[],draw({R}){R(1,8,20,24,'#c8ccd0',{sh:5});R(1,6,20,3,'#e0e4e8');R(4,14,14,6,'#a8acb0');R(5,0,6,6,'#e8e4d8');R(12,2,6,4,'#7aa8c8')}}),
 cabinet:()=>({size:[30,66,0,0],anchor:[15,64],lights:[],draw({R}){R(1,0,28,64,'#d8dce0',{sh:6});R(3,3,24,34,'#b8d0dc');for(const y of[14,26])R(3,y,24,1,'#8a9aa4');R(6,6,4,7,'#e8e4d8');R(12,8,8,5,'#f4f0e8');R(6,18,5,7,'#c8e0e8');R(14,28,10,8,'#f0d040');R(3,40,24,22,'#c8ccd0');R(14,48,2,4,'#7a7a84');R(18,30,4,4,'#a8323e')}}),
 stool:()=>({size:[18,28,0,0],anchor:[9,26],lights:[],draw({R,E}){E(9,6,8,4,'#3a3a44');E(9,5,6,2,'#5a5a64');R(8,8,2,16,'#9a9aa4');R(3,24,12,2,'#7a7a84')}}),
 sink2:()=>({size:[30,46,0,0],anchor:[15,44],lights:[],draw({R}){R(1,12,28,32,'#c8ccd0',{sh:6});R(0,8,30,6,'#e8ecf0');R(5,9,20,4,'#a8b0b8');R(13,0,3,9,'#9a9aa4');R(13,0,8,2,'#9a9aa4');R(4,20,22,18,'#b8bcc0')}}),
 viewer:()=>K.COINVIEWER,
 overlooksign:()=>({size:[40,52,0,0],anchor:[20,50],lights:[],draw({R}){R(6,22,3,28,'#5a4030');R(31,22,3,28,'#5a4030');R(0,0,40,24,'#4a3424',{sh:6});R(2,2,36,20,'#6a4a2e');R(2,2,36,2,'#8a6a4a')}}),
 register:()=>({size:[22,50,0,0],anchor:[11,48],lights:[],draw({R}){R(9,22,4,26,'#5a4030');R(1,4,20,18,'#6a4a2e',{sh:5});R(0,0,22,5,'#4a3424');R(3,8,16,8,'#3a2a1e');R(5,9,12,6,'#e8e0c8')}}),
 curvesign:()=>K.roadSign('curve'),
 rock:()=>({size:[40,26,0,0],anchor:[20,24],lights:[],draw({R,E}){const s=K.pal().stone;E(20,16,18,9,shade(s,-.35));E(18,14,16,8,s);E(14,10,9,5,shade(s,.2));R(26,10,6,2,shade(K.pal().leaf,-.2))}}),
 ledge:()=>({size:[128,36,0,0],anchor:[64,34],lights:[],draw({R}){const s=K.pal().stone;R(0,4,128,14,s,{sh:20});R(0,4,128,3,shade(s,.25));R(4,18,120,14,'#141018');R(14,22,20,8,'#2a2430')}}),
 barn:()=>({size:[192,124,0,0],anchor:[96,120],lights:[],draw({R}){const w='#6a3a2e';for(let i=0;i<40;i++)R(96-i*2.4,10+i,i*4.8,1,shade('#5a5a64',i<3?.2:-.1));R(10,50,172,70,w,{sh:30});for(let x=12;x<180;x+=8)R(x,50,1,70,shade(w,-.25));
  R(70,64,52,56,'#2a1a16');R(66,62,56,4,'#4a3a30');R(70,64,26,56,shade(w,-.1));for(let i=0;i<20;i++)R(72+i*1.2,66+i*2.6,2,2,'#4a2a22');R(84,24,24,18,'#2a1a16');R(86,26,20,14,'#1a1412')}}),
 trough:()=>({size:[64,26,0,0],anchor:[32,24],lights:[],draw({R}){R(2,6,60,16,'#8a8e96',{sh:10});R(2,6,60,2,'#a8acb4');R(5,9,54,6,'#3a4a5a');R(5,9,54,1,'#6a7a8a');R(4,22,4,3,'#5a5e64');R(56,22,4,3,'#5a5e64')}})
};
const PROPK=new Set(['lamp','bench','planter','blossom','car','cruiser','phonebooth','pcar','mailbox','shrub','fridge','stove','ksink','table','floorlamp','plant','hutch','fan','bed','dresser',
 'counter','piecase','dbooth','jukebox','teller','wchairs','clock','column','labbed','monitor','obs','nightstand','examtable','cabinet','stool','sink2','viewer','overlooksign','register','mile',
 'curvesign','thicket','rock','ledge','barn','trough','upslope','tablechairs']);
const NOSHADOW=new Set(['fan','upslope','teller','counter']);
function props(M){
 const out=[];
 const add=(a,fx,fy,p,o={})=>{const X=Math.round(fx-a.ax),Y=Math.round(fy-a.ay);
  out.push(Object.assign({tx:p.x,ty:p.y,k:p.k,x:fx,y:fy,top:Y,draw:(c,ox,oy)=>c.drawImage(a.c,X+ox,Y+oy),
   lights:(a.lights||[]).map(([lx,ly,r,al])=>[X+a.sx(lx),Y+a.sy(ly),r*T,al,!!o.pool])},o.extra||{}))};
 const dyn=(p,fx,fy,top,draw,o={})=>out.push(Object.assign({tx:p.x,ty:p.y,k:p.k,x:fx,y:fy,top,draw,lights:o.lights||[]},o.extra||{}));
 for(const p of M.pieces){if(!PROPK.has(p.k))continue;const cx=(p.x+p.w/2)*T,fy=(p.y+p.h)*T-2;
  switch(p.k){
  case'blossom':{const v=p.v|0,a=get('bl'+v+(p.white?'w':''),()=>K.blossomTree(v,!!p.white)),X=Math.round(cx-a.ax),Y=Math.round(fy+1-a.ay);add(a,cx,fy+1,p,{extra:{canopy:[X+6,Y,a.c.width-12,a.c.height-16],petals:[cx,fy-40]}});break}
  case'lamp':add(get('lamp',()=>K.LAMP),cx,fy+1,p,{pool:true});out[out.length-1].lights.push([cx,fy-2,1.8*T,.4,true]);break;
  case'bench':add(get('bench',()=>K.BENCH),cx,fy,p);break;
  case'shrub':add(get('shrub'+(p.x%3),()=>K.thicket(p.x%3,true)),cx,fy,p);break;
  case'thicket':add(get('th'+(p.v|0)+(p.buds?1:0),()=>K.thicket(p.v|0,!!p.buds)),cx,fy+2,p);break;
  case'car':add(get('car'+p.tint,()=>K.sedan('side',p.tint||'cloth')),cx,fy,p);break;
  case'pcar':{const a=get('pcar',()=>K.sedan('front','#8a2a2e'));if(!a.ringed){a.ringed=1;const g=a.c.getContext('2d'),X=a.sx(26),Y=a.sy(21);g.strokeStyle='#1a1214';g.lineWidth=1;g.beginPath();g.ellipse(X+.5,Y+.5,6,2,0,0,6.283);g.stroke();g.fillStyle='rgba(255,255,255,.22)';g.fillRect(X-4,Y,8,1)}
   add(a,cx,fy+2,p);break}
  case'fridge':add(get('fridge',()=>K.kitchen('fridge')),cx,fy,p);break;
  case'stove':add(get('stove',()=>K.kitchen('stove')),cx,fy,p);break;
  case'ksink':add(get('ksink',()=>K.kitchen('sink')),cx,fy,p);break;
  case'table':add(get('tc',()=>K.tableChairs('#e8dcc0')),cx,fy,p);break;
  case'bed':add(get('bed',()=>K.BED),cx+2,fy,p);break;
  case'fan':{const fx=cx,fyy=p.y*T+2;dyn(p,fx,9999,fyy-20,(c,ox,oy)=>K.ceilingFan(c,fx+ox,fyy-12+oy,14,Math.floor(performance.now()/90)%2));break}
  case'counter':add(get('counter',SPEC.counter),cx,fy+10,p);break;
  case'teller':add(get('teller',SPEC.teller),cx,fy+4,p);break;
  case'mile':add(get('mile'+p.n,()=>K.mileMarker(p.n)),cx,fy+4,p);break;
  case'upslope':for(let i=0;i<M.w;i+=2){const v=i%3,a=get('th'+v+'0',()=>K.thicket(v,false));add(a,(i+.5+hsh(i,1,561))*T,(2.7+hsh(i,2,561)*.7)*T,p)}break;
  default:if(SPEC[p.k])add(get(p.k,SPEC[p.k]),cx,fy,p)}}
 return out}

// ================= LIGHT AND AIR =================
// by day outside: petals off the blossom trees; day 2 rains (the Shelf's shared-effects-rain-v1, the roads shining).
// At night: the fog (shared-effects-fog-v1) with the lantern and lamps clearing pockets in it, the lantern's warm pool,
// and the guardrail's reflectors catching the lantern a little further out than it lights the road. Indoors at the
// clinic: the monitors' moving line.
const OUTDOOR=new Set(['town','ridge','woods','field']);
function petals(ctx,o){(o.M.props||[]).forEach((p,i)=>{if(!p.petals)return;for(let k=0;k<3;k++){const t=(o.now/30+k*90+i*37)%160,x=p.petals[0]-o.camx+Math.sin(t/14+k)*10+t*.18-12,y=p.petals[1]-o.camy+t*.5;
  if(x<-4||y<-4||x>ctx.canvas.width||y>ctx.canvas.height)continue;ctx.fillStyle=k%2?'#f8e0ec':A.redbud;ctx.fillRect(Math.round(x),Math.round(y),2,1)}})}
function fx(ctx,o){const M=o.M,now=o.now;
 (M.props||[]).forEach(p=>{if(p.k!=='monitor')return;const sc=K.MONITOR_SCREEN,X=p.x-15*S+sc[0]*S+1,Y=p.top+sc[1]*S+1;K.monitorLine(ctx,Math.round(X-o.camx+1),Math.round(Y-o.camy+1),Math.round(sc[2]*S)-2,Math.round(sc[3]*S)-2,now)});
 if(!o.night){if(OUTDOOR.has(M.id)){petals(ctx,o);if(M.rain)K.rain(ctx,now,{k:.7,shine:[[-o.camx,8*T-o.camy,M.w*T,4*T],[19*T-o.camx,13*T-o.camy,3*T,11*T]]})}return}
 const lx=G.px+8-o.camx,ly=G.py+6-o.camy,lr=o.lantern||58;
 ctx.globalCompositeOperation='multiply';let gr=ctx.createRadialGradient(lx,ly,0,lx,ly,lr);gr.addColorStop(0,'rgba(240,196,120,.7)');gr.addColorStop(1,'rgba(240,196,120,0)');ctx.fillStyle=gr;ctx.fillRect(lx-lr,ly-lr,lr*2,lr*2);
 ctx.globalCompositeOperation='source-over';
 if(M.fog){const clear=[[lx,ly,lr*1.25]].concat((o.pools||[]).map(([x,y,r])=>[x,y,r*.8]));K.fog(ctx,now,{heavy:M.fog==='heavy',clear,ox:o.camx,oy:o.camy});
  // the trail you can walk shows as a faint pale ribbon a little past the lantern, so the fog hides distance, never the way
  if(M.id==='woods'){const r2=lr*2.4;for(let ty=0;ty<M.h;ty++)for(let tx=0;tx<M.w;tx++){if(M.ground[ty][tx]!=='t')continue;const sx=tx*T+8-o.camx,sy=ty*T+8-o.camy,d=Math.hypot(sx-lx,sy-ly);if(d>r2||d<lr*.6)continue;
   ctx.fillStyle=`rgba(232,220,200,${(.22*(1-d/r2)).toFixed(3)})`;ctx.fillRect(Math.round(sx-8),Math.round(sy-8),T,T)}}
  const st=paint(M),reach=lr*2.6;st.reflect.forEach(([x,y,wh])=>{const sx=x-o.camx,sy=y-o.camy,d=Math.hypot(sx-lx,sy-ly);if(d>reach)return;const a=Math.max(0,1-d/reach);
   const rc=wh?'240,236,220':'255,200,90';ctx.fillStyle=`rgba(${rc},${(a*.95).toFixed(2)})`;ctx.fillRect(Math.round(sx)-1,Math.round(sy)-1,3,wh?3:2);ctx.fillStyle=`rgba(${rc},${(a*.25).toFixed(2)})`;ctx.fillRect(Math.round(sx)-3,Math.round(sy)-2,7,4)})}
 ctx.globalCompositeOperation='lighter';gr=ctx.createRadialGradient(lx,ly,0,lx,ly,lr*.5);gr.addColorStop(0,'rgba(214,164,58,.14)');gr.addColorStop(1,'rgba(214,164,58,0)');ctx.fillStyle=gr;ctx.fillRect(lx-lr,ly-lr,lr*2,lr*2);
 ctx.globalCompositeOperation='source-over';
 // part B: on night 2, the cold light waits in the fog over the high pasture's burned ring until the boss is met
 if(M.id==='field'&&M.lamp){const cx_=15*T+8-o.camx,cy_=8*T-o.camy,fl=.8+.2*Math.sin(now/300)*Math.sin(now/170);
  ctx.globalCompositeOperation='lighter';let g2=ctx.createRadialGradient(cx_,cy_-40,2,cx_,cy_-40,70);g2.addColorStop(0,`rgba(238,244,255,${(.55*fl).toFixed(3)})`);g2.addColorStop(.4,`rgba(200,184,255,${(.18*fl).toFixed(3)})`);g2.addColorStop(1,'rgba(200,184,255,0)');
  ctx.fillStyle=g2;ctx.fillRect(cx_-80,cy_-120,160,160);
  ctx.save();ctx.translate(cx_,cy_-20);ctx.scale(.35,1);g2=ctx.createRadialGradient(0,0,2,0,0,70);g2.addColorStop(0,`rgba(238,244,255,${(.22*fl).toFixed(3)})`);g2.addColorStop(1,'rgba(238,244,255,0)');ctx.fillStyle=g2;ctx.fillRect(-70,-70,140,140);ctx.restore();
  ctx.globalCompositeOperation='source-over'}}
// the hidden hotspot, while the lead is High on Mushrooms: a straight seam in the fog over the wall, faintly cold, and
// neat scratches on the stone
function seamGlint(c,x,y,now){const a=.35+.2*Math.sin(now/500);c.fillStyle=`rgba(238,244,255,${a.toFixed(2)})`;c.fillRect(x,y-60,1,58);c.fillStyle=`rgba(200,184,255,${(a*.5).toFixed(2)})`;c.fillRect(x-1,y-60,3,58);
 c.fillStyle=`rgba(238,244,255,${(a+.2).toFixed(2)})`;for(let i=0;i<4;i++)c.fillRect(x-6+i*3,y+3,1,4);c.fillRect(x-7,y+5,12,1)}

// ================= TOWNSFOLK AND THE PRUETTS ON THE MAP =================
// The Shared Shelf's person template (shared-sprites-person-v1, method v1), at the agents' size; hair from agent-sprite.js.
// About 1 in 3 has a weird trait (Art, Townsfolk): Mae's beehive with pencils, Owen's headlamp, Birdie's feather hat.
const {SKIN}=window.BL;
const FOLK={
 ray:{look:{skin:1,hair:0,hairC:5,acc:0},top:'#8a3a2e',pants:'#3b4a6b',shoes:'#5a4030',iris:'#3a4a6a',mouth:'flat',cap:'#2e4a6a',bandage:1,
  body:(A_,ty)=>{const{R}=A_;for(let y=ty+2;y<ty+16;y+=4)R(6,y,16,1,'#5a2a22');for(const x of[10,16])R(x,ty,1,16,'#5a2a22')}},
 donna:{look:{skin:0,hair:1,hairC:5,acc:1},top:'#7a8a6a',coat:1,inner:'#e8dcc0',pants:'#5a4a5a',shoes:'#3a2a24',iris:'#4a6a3a',mouth:'flat',cheeks:1,flash:1,
  body:(A_,ty)=>{const{R}=A_;R(18,ty+12,3,5,'#3a3a44');R(18,ty+11,3,1,'#c8c8d0')}},
 jenna:{look:{skin:1,hair:1,hairC:2,acc:0},top:'#3e8a8a',pants:'#3b4a6b',shoes:'#e8e4d8',iris:'#4a6a3a',mouth:'flat',
  body:(A_,ty)=>{const{R}=A_;R(17,ty+4,2,2,'#e8e4f8')}},
 mae:{look:{skin:2,hair:4,hairC:4,acc:0},top:'#e890a8',pants:'#e890a8',shoes:'#e8e4d8',iris:'#3a2418',mouth:'smile',cheeks:1,beehive:'#b94a2c',
  body:(A_,ty)=>{const{R}=A_;R(8,ty+4,12,13,'#f4f0e8');R(9,ty+11,10,1,'#d8d0c8');R(11,ty+12,4,3,'#e8e0d8')}},
 owen:{look:{skin:0,hair:0,hairC:3,acc:0},top:'#8ab8d8',pants:'#8ab8d8',shoes:'#e8e4d8',iris:'#4a6a8a',mouth:'open',s:.46,headlamp:1,
  body:(A_,ty)=>{const{R}=A_;R(11,ty,6,3,shade('#8ab8d8',-.3));R(16,ty+4,3,5,'#e8e4d8')}},
 hensley:{look:{skin:4,hair:4,hairC:0,acc:0},top:'#b8a478',pants:'#3e4a32',shoes:'#2a1e18',iris:'#3a2418',mouth:'flat',hat:'#6a4a2a',
  body:(A_,ty)=>{const{R}=A_;R(8,ty+3,3,3,'#d6a43a');R(6,ty+14,16,2,'#2a2018');R(19,ty+12,3,5,'#2a2018');for(const x of[9,18])R(x,ty+1,1,5,shade('#b8a478',-.2))}},
 birdie:{look:{skin:1,hair:6,hairC:6,acc:0},top:'#8a8a5a',coat:1,inner:'#c86a3a',pants:'#6a5a3a',shoes:'#5a3a24',iris:'#3a6a8a',mouth:'smile',featherhat:1,
  body:(A_,ty)=>{const{R}=A_;R(10,ty+5,3,4,'#2a2a30');R(15,ty+5,3,4,'#2a2a30');R(12,ty+6,4,1,'#2a2a30');R(11,ty,1,6,'#5a3a24');R(16,ty,1,6,'#5a3a24')}},
 rao:{look:{skin:3,hair:0,hairC:0,acc:1},top:'#f4f4f0',coat:1,inner:'#4a6a9a',pants:'#3a3a44',shoes:'#1a1418',iris:'#2a1a14',mouth:'flat',
  body:(A_,ty)=>{const{R}=A_;R(13,ty+1,2,9,'#a8323e');R(17,ty+6,4,3,'#e8e4d8')}},
 cecil:{look:{skin:2,hair:3,hairC:6,acc:3},top:'#3e5a8a',pants:'#3e5a8a',shoes:'#5a4030',iris:'#3a2418',mouth:'smile',cap:'#3e6a3e',
  body:(A_,ty)=>{const{R}=A_;R(8,ty,12,10,'#e8dcc0');R(9,ty,2,16,'#2e4a7a');R(17,ty,2,16,'#2e4a7a');R(9,ty+1,1,1,'#c8a040');R(18,ty+1,1,1,'#c8a040')}}
};
// what the template lacks: caps and hats, Mae's beehive, Owen's headlamp, Ray's bandage, Donna's flashlight
function topper(Ad,F_,dir){const{R,C,E}=Ad;
 if(F_.cap){const c=F_.cap,cd=shade(c,-.3);if(dir==='up'){R(5,0,18,7,c,{sh:3})}else if(dir==='side'){R(6,-1,17,7,c,{sh:3});R(0,5,8,2,cd)}
  else{R(5,-1,18,7,c,{sh:3});R(5,-1,18,1,shade(c,.25));R(5,6,18,2,cd);R(11,1,6,3,'#e8e4d8')}}
 if(F_.hat){const c=F_.hat;R(1,4,26,3,shade(c,-.15));R(6,-3,16,8,c,{sh:3});R(13,-4,2,3,shade(c,-.3));if(dir==='down')R(12,1,4,3,'#d6a43a')}
 if(F_.featherhat){const c='#d8c890';R(0,4,28,3,shade(c,-.1));R(6,-2,16,7,c,{sh:3});R(6,3,16,1,'#6a4a2a');[[8,'#3a6aa8'],[13,'#c8402e'],[18,'#2a2a30']].forEach(([x,col],i)=>{R(x,-7+i,2,7,col);R(x+1,-8+i,1,2,shade(col,.3))})}
 if(F_.beehive){const c=F_.beehive;E(14,-4,9,8,c);E(12,-7,5,4,shade(c,.25));R(5,1,18,6,c,{sh:3});R(9,-14,1,8,'#e8c040');R(17,-12,1,7,'#e8c040');R(14,-15,1,6,'#e8c040');R(9,-15,1,1,'#f0a0a0')}
 if(F_.headlamp){if(dir==='up')R(4,6,20,2,'#2a2a30');else if(dir==='side'){R(4,6,18,2,'#2a2a30');R(2,4,4,4,'#c8c8d0');R(2,5,2,2,'#fff6c8')}else{R(4,6,20,2,'#2a2a30');R(11,3,6,5,'#c8c8d0');R(12,4,4,3,'#fff6c8')}}
 if(F_.bandage&&dir!=='down'){const x=dir==='side'?17:20;R(x,11,4,4,'#f4f0e8');R(x,12,4,1,'#d8d0c8')}
 if(F_.flash&&dir!=='up'){const x=dir==='side'?14:20;R(x,34,3,7,'#3a3a44');R(x,34,3,1,'#fff6c8')}}
const fcache=new Map();
function folk(id,dir,idle=0,M){
 const night=M&&isNight(M)&&id==='ray',k=id+dir+idle+(night?'n':'');let v=fcache.get(k);if(v)return v;
 if(dir==='right'){const l=folk(id,'left',idle,M),c=K.mk(l.c.width,l.c.height),g=c.getContext('2d');g.translate(c.width,0);g.scale(-1,1);g.drawImage(l.c,0,0);v={c,ax:c.width-l.ax,ay:l.ay}}
 else{const F_=FOLK[id]||FOLK.cecil,d=dir==='left'?'side':dir,L=F_.look,sk=SKIN[L.skin];
  const sp=Object.assign({skin:sk,hair:sk,hairStyle:'cropped',iris:night?'#eef4ff':(F_.iris||'#3a2418')},F_);
  const a=art(40,96,6,36,F_.s||S,Ad=>{K.drawChar(Ad,sp,d,0,idle);BLA.extras(Ad,{look:L},dir,0);topper(Ad,F_,d)});
  v={c:a.c,ax:a.sx(14),ay:a.sy(50)}}
 fcache.set(k,v);return v;
}

// ================= PORTRAITS (64 x 64, Storybook faces, Lantern Bust box) =================
// The Asset Library's portrait kit (as in Lot 83): drawn pixel by pixel in a layer, then a light rim on the lit edges and a dark
// outline. Each sits on a lit backing (Quality bar, Rim and backing).
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
// Ray Pruett: 64, retired lineman, a power-company cap, gray stubble, a square jaw, a bandage behind his left ear, plaid
RAY:{bg:'#2a3346',f(L,t){const s='#e0a882',u='#8a3a2e',cap='#2e4a6a',st='#a8a49c';
 body(L,u);for(let y=50;y<64;y+=5)L.rm(0,y,64,1,sh(u,-30));for(let x=10;x<60;x+=7)L.rm(x,48,1,16,sh(u,-30));L.r(27,44,10,6,sh(s,-30));shirtV(L,sh(u,-40));
 ears(L,s);head(L,32,32,15,15,s);L.e(32,41,13,6,sh(s,-12));for(let y=36;y<48;y++)for(let x=19;x<46;x++)if(L.g(x,y)===sh(s,-12)&&hsh(x,y,591)<.3)L.p(x,y,sh(st,-10));
 L.r(14,30,5,6,'#f4f0e8');L.r(14,32,5,1,'#d8d0c8');L.p(15,31,'#c8a0a0');
 L.e(31,20,16,7,sh(cap,-30));L.e(30,19,15,6,cap);L.r(16,23,32,3,sh(cap,-40));L.r(14,25,36,2,sh(cap,-20));L.r(26,15,10,5,'#d6a43a');L.r(28,16,6,3,cap);
 eye(L,21,29,'#3a4a6a',-1);eye(L,37,29,'#3a4a6a',1);brows(L,'#7a7a7a',27,1);L.r(20,35,7,1,sh(s,-26));L.r(37,35,7,1,sh(s,-26));
 nose(L,s,36);L.r(30,38,4,1,sh(s,-30));if(t)mouth(L,32,42,7,true);else{L.r(28,43,8,1,MR);L.p(27,44,MR);L.p(36,44,MR)}}},
// Donna Pruett: 62, retired librarian, a silver bob, reading glasses, tired eyes, a sage cardigan, a flashlight in her pocket
DONNA:{bg:'#33283e',f(L,t){const s='#f0c8a6',hc='#c8c4c0',hd=sh(hc,-30),u='#7a8a6a';
 body(L,u);L.r(26,46,12,18,'#e8dcc0');L.r(22,48,4,16,sh(u,-28));L.r(38,48,4,16,sh(u,-28));for(let y=50;y<64;y+=3)L.rm(28,y,1,1,'#c8a040');L.r(42,52,5,10,'#3a3a44');L.r(42,52,5,2,'#fff6c8');
 L.e(32,26,18,17,hd);L.e(31,24,17,15,hc);ears(L,s);head(L,32,32,14,14,s);L.e(30,20,15,6,hc);L.r(16,22,4,20,hc);L.r(44,22,4,20,hd);L.r(22,17,10,2,sh(hc,30));
 for(const x of[20,36]){L.r(x,27,9,8,'#7a2a3a');L.r(x+1,28,7,6,'#eef0f4')}L.r(29,29,6,1,'#7a2a3a');eye(L,21,28,'#4a6a3a',-1);eye(L,37,28,'#4a6a3a',1);
 L.r(21,36,6,1,sh(s,-30));L.r(37,36,6,1,sh(s,-30));L.r(22,37,4,1,'#b89aa8');L.r(38,37,4,1,'#b89aa8');brows(L,hd,25);
 L.r(19,39,4,2,'#e0837a');L.r(41,39,4,2,'#e0837a');nose(L,s,37);if(t)mouth(L,32,42,7,true);else{L.r(28,43,8,1,MR);L.p(27,42,MR);L.p(36,42,MR)}}},
// Jenna Albright: 31, married three weeks, long brown hair, a teal top, her wedding ring, arms folded, not buying it
JENNA:{bg:'#24363a',f(L,t){const s='#e9b98f',hc='#8a5a2b',hd=sh(hc,-34),u='#3e8a8a';
 L.r(14,30,8,30,hd);L.r(42,30,8,30,hd);body(L,u);L.r(27,44,10,8,sh(s,-30));shirtV(L,sh(u,-30),48);L.r(14,54,36,6,sh(u,-18));L.r(16,54,32,2,sh(u,10));L.r(40,55,3,2,'#e8e4f8');
 ears(L,s);head(L,32,32,14,15,s);L.e(31,20,15,7,hc);L.r(17,20,5,16,hc);L.r(42,20,5,16,hd);L.r(24,17,14,3,sh(hc,30));
 eye(L,21,29,'#4a6a3a',-1);eye(L,37,29,'#4a6a3a',1);brows(L,hd,25,2);L.r(20,28,7,1,D);L.r(37,28,7,1,D);
 L.r(19,38,4,2,'#e8857a');L.r(41,38,4,2,'#e8857a');nose(L,s,36);if(t)mouth(L,32,42,7,true);else{L.r(28,43,8,1,MR);L.p(36,42,MR)}}},
// Mae Tolliver: diner owner, sixties, a towering red beehive with three pencils stuck in it (her weird trait), cat-eye glasses, a pink uniform and apron
MAE:{bg:'#3a2a30',f(L,t){const s='#c98e62',hc='#b94a2c',hd=sh(hc,-40),u='#e890a8';
 body(L,u);L.r(20,50,24,14,'#f4f0e8');L.r(20,50,24,2,'#d8d0c8');L.r(27,44,10,6,sh(s,-30));L.r(44,52,6,8,'#e8e4d8');L.r(45,53,4,1,'#a8323e');
 L.e(33,10,14,12,hd);L.e(32,9,13,11,hc);L.e(29,5,6,4,sh(hc,30));for(let y=2;y<20;y+=4)L.rm(20,y,26,1,sh(hc,-20));
 for(const[x,y]of[[22,0],[36,1],[44,6]]){L.r(x,y,2,8,'#e8c040');L.p(x,y,'#f0a0a0');L.p(x+1,y,'#f0a0a0')}
 ears(L,s);head(L,32,34,14,14,s);L.e(31,23,14,5,hc);L.r(17,24,3,8,hc);L.r(44,24,3,8,hd);
 for(const x of[19,36]){L.r(x,28,10,8,'#2a2030');L.r(x+1,29,8,6,'#f4f0e8')}L.r(18,27,3,2,'#2a2030');L.r(45,27,3,2,'#2a2030');eye(L,21,29,'#3a2418',-1);eye(L,37,29,'#3a2418',1);
 brows(L,hd,25,-1);L.r(19,39,4,2,'#e0837a');L.r(41,39,4,2,'#e0837a');nose(L,s,37);L.r(28,43,8,1,'#c83a5a');if(t)mouth(L,32,42,8,true);else{L.r(27,43,10,1,'#a8323e');L.p(26,42,MR);L.p(37,42,MR)}}},
// Owen Sizemore: 24, the sleep lab's night tech, a headlamp he never turns off (his weird trait), scruffy blond, light blue scrubs, eyebrows always worried
OWEN:{bg:'#22303e',f(L,t){const s='#f6d7b8',hc='#d8b25a',hd=sh(hc,-34),u='#8ab8d8';
 body(L,u);L.r(26,46,12,4,sh(u,-30));for(let j=0;j<8;j++)L.r(32-(8-j),48+j,2,1,sh(u,-30));L.r(40,52,6,8,'#e8e4d8');L.r(41,53,4,2,'#3a6aa8');
 ears(L,s,35);head(L,32,34,13,14,s);L.e(31,22,15,8,hc);for(const[x,y]of[[18,22],[24,17],[33,16],[42,20]])L.e(x,y,3,3,sh(hc,(x%2)?20:-10));L.r(17,22,4,10,hd);L.r(43,22,4,9,hd);
 L.r(16,23,32,3,'#2a2a30');L.r(27,19,10,7,'#c8c8d0');L.r(28,20,8,5,'#fff6c8');L.p(29,21,'#ffffff');
 eye(L,21,31,'#4a6a8a',-1);eye(L,37,31,'#4a6a8a',1);L.r(21,28,6,1,hd);L.r(37,28,6,1,hd);L.p(27,27,hd);L.p(37,27,hd);
 nose(L,s,38);L.r(20,40,3,2,'#f0a0a0');L.r(41,40,3,2,'#f0a0a0');for(const[x,y]of[[30,46],[34,45],[26,44]])L.p(x,y,sh(hc,-10));if(t)mouth(L,32,43,7,true);else{L.r(29,44,6,1,MR);L.p(35,43,MR)}}},
// Deputy Carla Hensley: forties, the county's one deputy in Cullen Gap, a campaign hat, a tan uniform shirt with a star, steady eyes
'DEP. HENSLEY':{bg:'#2a3328',f(L,t){const s='#7a4a2c',hc='#1b1414',u='#b8a478',hat='#6a4a2a';
 body(L,u);L.r(26,46,12,5,sh(u,-28));for(const x of[22,41])L.r(x,50,1,14,sh(u,-24));L.r(16,52,6,6,'#d6a43a');L.p(18,51,'#d6a43a');L.p(18,58,'#d6a43a');L.r(42,52,8,3,'#2a2018');L.r(28,46,8,4,sh(s,-26));
 L.r(18,34,28,14,hc);ears(L,s);head(L,32,33,14,15,s);
 L.e(32,18,22,4,sh(hat,-30));L.e(32,17,22,3,hat);L.e(32,12,11,8,hat);L.r(31,5,2,8,sh(hat,-30));L.r(21,15,22,3,'#3a2a18');L.r(29,15,6,3,'#d6a43a');
 eye(L,21,30,'#3a2418',-1);eye(L,37,30,'#3a2418',1);brows(L,hc,27);nose(L,s,37);L.r(19,39,4,2,sh(s,14));L.r(41,39,4,2,sh(s,14));
 if(t)mouth(L,32,43,7,true);else L.r(28,44,8,1,MR)}},
// Birdie Haskins: sixties, a hiker and forager, a sun hat stuck full of bird feathers and binoculars on a cord (her weird trait), white braid, wind-burned
BIRDIE:{bg:'#2e3428',f(L,t){const s='#e8a888',hc='#ece8de',u='#8a8a5a',hat='#d8c890';
 body(L,u);L.r(26,46,12,18,'#c86a3a');L.r(22,48,4,16,sh(u,-26));L.r(38,48,4,16,sh(u,-26));L.r(24,52,6,8,'#2a2a30');L.r(34,52,6,8,'#2a2a30');L.r(25,53,4,3,'#5a7a9a');L.r(35,53,4,3,'#5a7a9a');L.r(24,44,1,8,'#5a3a24');L.r(39,44,1,8,'#5a3a24');
 L.r(44,30,5,26,hc);L.r(44,30,5,26,hc);for(let y=32;y<56;y+=4)L.r(44,y,5,1,sh(hc,-24));
 ears(L,s);head(L,32,33,14,15,s);for(const[x,y]of[[24,24],[40,26],[28,40],[36,41]])L.p(x,y,sh(s,-20));
 L.e(32,21,24,4,sh(hat,-30));L.e(32,20,24,3,hat);L.e(32,14,12,8,hat);L.r(20,18,24,2,'#6a4a2a');
 [[22,'#3a6aa8',4],[28,'#c8402e',2],[38,'#2a2a30',3],[43,'#e8c040',6]].forEach(([x,c,y])=>{L.r(x,y,2,12,c);L.r(x+2,y+2,1,8,sh(c,30))});
 eye(L,21,30,'#3a6a8a',-1);eye(L,37,30,'#3a6a8a',1);L.r(19,30,2,1,sh(s,-30));L.r(43,30,2,1,sh(s,-30));brows(L,hc,27,-1);
 L.r(19,38,4,2,'#e0837a');L.r(41,38,4,2,'#e0837a');nose(L,s,37);if(t)mouth(L,32,42,8,true);else{L.r(28,43,8,1,MR);L.p(27,42,MR);L.p(36,42,MR)}}},
// Dr. Anand Rao: fifties, runs the sleep center, a white coat over a blue shirt and a red tie, gray at the temples, wire glasses, careful
'DR. RAO':{bg:'#283040',f(L,t){const s='#a26a43',hc='#1b1414',u='#f4f4f0';
 body(L,u);L.r(26,46,12,18,'#4a6a9a');L.r(30,48,4,16,'#a8323e');L.r(31,48,2,2,sh('#a8323e',30));L.r(22,46,4,18,sh(u,-20));L.r(38,46,4,18,sh(u,-20));L.r(42,52,6,8,sh(u,-10));L.r(43,52,1,4,'#3a6aa8');
 ears(L,s);head(L,32,32,14,15,s);L.e(31,20,15,6,hc);L.r(17,22,3,10,'#9aa0a6');L.r(44,22,3,10,'#8a9096');L.r(22,17,12,2,sh(hc,40));
 for(const x of[20,36]){L.r(x,27,9,8,'#c0c0c8');L.r(x+1,28,7,6,'#e8eef4')}L.r(29,29,6,1,'#c0c0c8');eye(L,21,28,'#2a1a14',-1);eye(L,37,28,'#2a1a14',1);
 brows(L,hc,25,1);nose(L,s,36);L.r(27,40,10,2,hc);if(t)mouth(L,32,42,7,true);else L.r(29,43,6,1,MR)}},
// Cecil: diner regular, eighties, overalls, a green feed cap, big white mustache, a crumb of coconut cream on it
CECIL:{bg:'#33302a',f(L,t){const s='#f0c8a0',u='#3e5a8a',cap='#3e6a3e',b='#ece8de';
 body(L,'#e8dcc0');L.r(20,50,24,14,u);L.r(20,48,4,16,u);L.r(40,48,4,16,u);L.r(22,50,2,2,'#c8a040');L.r(40,50,2,2,'#c8a040');L.r(28,54,8,6,sh(u,-20));L.r(28,46,8,4,sh(s,-30));
 ears(L,s);head(L,32,33,14,15,s);
 L.e(31,20,16,7,sh(cap,-30));L.e(30,19,15,6,cap);L.r(16,23,32,3,sh(cap,-40));L.r(14,25,36,2,sh(cap,-20));L.r(26,15,10,5,'#e8e4d8');L.r(28,16,6,3,'#c8402e');
 eye(L,21,30,'#3a2418',-1);eye(L,37,30,'#3a2418',1);L.r(21,30,6,2,sh(s,-24));L.r(37,30,6,2,sh(s,-24));brows(L,b,27,-1);nose(L,s,36);
 L.e(32,40,10,3,b);L.e(26,41,4,2,b);L.e(38,41,4,2,b);L.p(35,39,'#f8f0d8');L.r(19,37,3,2,'#e0837a');L.r(42,37,3,2,'#e0837a');
 if(t)mouth(L,32,44,7,true);else L.r(29,45,6,1,MR)}}
};
const pcache={};
function portraitCanvas(name,open){const k=name+(open?1:0);if(pcache[k])return pcache[k];
 const P_=PORT[name],L=Ly(64,64),c=K.mk(64,64),g=c.getContext('2d');P_.f(L,open?1:0);
 const gr=g.createRadialGradient(22,18,4,32,32,46);gr.addColorStop(0,sh(P_.bg,34));gr.addColorStop(1,P_.bg);g.fillStyle=gr;g.fillRect(0,0,64,64);
 const o=finish(L);for(let i=0;i<o.length;i++)if(o[i]){g.fillStyle=o[i];g.fillRect(i%64,(i/64)|0,1,1)}
 return pcache[k]=c}
const portraits={};
for(const name of Object.keys(PORT))portraits[name]=(ctx,open)=>{ctx.clearRect(0,0,64,64);ctx.drawImage(portraitCanvas(name,open),0,0)};

// ================= BIG HAT'S BRIEFING PLACE: the laundromat (spec 016, Briefing) =================
// A 24-hour laundromat off I-81 at 4 AM, dryers turning, one flickering tube light. Drawn in the back room's layout
// (spec 013): his bust centered, the place behind him (a wall of stacked dryers, the window onto the interstate with
// trucks going by, the change machine and a corkboard of flyers), and in front of him, where the desk would be, a
// folding table with somebody's laundry basket. The tube right over him keeps his face clear.
const laundromat={
 back(c,v){const{VW,VH,fy,mid,now}=v,R=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))};
  const on=Math.floor(now/90)%37!==0&&Math.floor(now/70)%53!==3;
  // the wall: pale green tile to shoulder height, cream paint above
  R(0,0,VW,VH,'#b0ac94');for(let x=0;x<VW;x+=12)R(x,0,1,fy-70,'#a09c86');R(0,fy-70,VW,70,'#8ab0a0');for(let y=fy-70;y<fy;y+=8)R(0,y,VW,1,'#7a9a8c');for(let x=(mid%8+8)%8;x<VW;x+=8)R(x,fy-70,1,70,'#7a9a8c');R(0,fy-72,VW,3,'#5a7a6c');
  // the window on the left: the dark lot and the interstate, a truck's lights going by now and then. On a short screen
  // (fy is higher) the window and the corkboard stop a few pixels under the top edge instead of going off it, the way
  // the back room's pieces hold to the screen (spec 013), and stay clear of the dryers' second row
  const wx=mid-118,wy=Math.max(fy-118,9);R(wx,wy,52,40,'#3a3a44');R(wx+2,wy+2,48,36,'#141828');R(wx+2,wy+28,48,10,'#0e1018');for(let i=0;i<3;i++)R(wx+4+i*16,wy+33,8,1,'#e8c84a');
  const tx=((now/12)%160)-60;if(tx>-10&&tx<52){R(wx+2+Math.max(0,tx),wy+24,Math.min(14,50-tx),6,'#6a6a7a');R(wx+2+Math.max(0,tx),wy+26,2,2,'#ffd88a')}
  R(wx+25,wy+2,2,36,'#3a3a44');K.signText(c,'24 HR',wx+6,wy+5,'#ff6a8a');K.signText(c,'OPEN',wx+30,wy+5,'#ff6a8a');
  // two rows of stacked dryers behind him, each drum turning; one has something red going round
  const dw=26,rows=[fy-112,fy-68];for(let i=0;i<9;i++){const x=mid-110+i*dw;if(x+dw>VW+20)continue;for(const[j,y]of rows.entries()){if(i<2&&j===0)continue;
    R(x,y,dw-2,42,'#e8e4dc');R(x,y,dw-2,2,'#f8f4ec');R(x+dw-4,y,2,42,'#b8b4ac');R(x+2,y+3,dw-6,5,'#5a5a64');R(x+4,y+4,4,3,'#c8302e');
    const cx=x+dw/2-1,cy=y+25;c.fillStyle='#3a3a44';c.beginPath();c.arc(cx,cy,10,0,6.283);c.fill();c.fillStyle='#1e2430';c.beginPath();c.arc(cx,cy,8,0,6.283);c.fill();
    if((i+j)%3!==2){const a=now/(220+i*23)+i;for(let k=0;k<3;k++){const aa=a+k*2.1;c.fillStyle=(i===6&&j===1&&k===0)?'#c8302e':['#e8dcc0','#7a8ab0','#c8b8a0'][k];c.beginPath();c.arc(cx+Math.cos(aa)*4,cy+Math.sin(aa)*4+2,3,0,6.283);c.fill()}}
    c.fillStyle='rgba(255,255,255,.18)';c.beginPath();c.arc(cx-3,cy-3,3,0,6.283);c.fill()}}
  // the change machine and a corkboard of flyers on the right, kept 6 px in from the edge; the board sits above the machine
  // and both hold under the top edge on a short screen (ck: the board's top, cm: the machine's)
  const cmx=mid+86,ck=Math.max(10,fy-150),cm=Math.max(ck+28,fy-120);
  R(cmx,cm,28,46,'#5a6a7a');R(cmx,cm,28,1,'#7a8a9a');R(cmx+1,cm+2,26,8,'#e8e4d8');K.signText(c,'CHANGE',cmx+3,cm+3,'#2a2030');R(cmx+10,cm+16,8,4,'#2a2a30');R(cmx+8,cm+28,12,10,'#3a3a44');
  R(cmx-1,ck,30,24,'#9a6a3a');[[1,2,'#f4f0e8'],[14,4,'#f0d040'],[5,13,'#a8e0f0'],[17,14,'#f4f0e8']].forEach(([x,y,col])=>{R(cmx+x,ck+y,10,9,col);R(cmx+x+4,ck+y,2,2,'#c8302e')});
  // the one tube light, right over his hat, flickering, and its cone of light so his face reads
  R(mid-40,2,80,5,'#e8e4d8');R(mid-38,3,76,3,on?'#f8fff8':'#8a8a90');R(mid-42,0,2,4,'#5a5a64');R(mid+40,0,2,4,'#5a5a64');
  if(on){c.fillStyle='rgba(230,255,240,.12)';c.beginPath();c.moveTo(mid-40,7);c.lineTo(mid+40,7);c.lineTo(mid+90,fy);c.lineTo(mid-90,fy);c.fill()}
  else{c.fillStyle='rgba(10,8,20,.25)';c.fillRect(0,0,VW,VH)}
  R(0,fy-4,VW,VH,'#8a8a78')},
 lift:4,
 front(c,v){const{VW,VH,fy,mid,now}=v,R=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))};
  // the floor: black and white lino
  R(0,fy,VW,VH-fy,'#a8a494');for(let y=fy+12;y<VH;y+=10)for(let x=((y/10|0)%2)*10;x<VW;x+=20)R(x,y,10,10,'#3a3a44');
  // the folding table where the desk would be: a laundry basket, a detergent jug (no brand), dryer sheets, quarters, his toothpicks
  R(mid-118,fy,236,9,'#e8e8e0');R(mid-118,fy,236,2,'#ffffff');R(mid-118,fy+9,236,3,'#9a9a94');R(mid-108,fy+12,3,VH-fy-12,'#7a7a84');R(mid+105,fy+12,3,VH-fy-12,'#7a7a84');
  for(let i=0;i<10;i++){const x=mid-112+i*24;R(x,fy+12,1,VH-fy-12,'rgba(40,40,50,.25)')}
  // under the table: a wire laundry cart with a sheet hanging out, a dropped sock, a yellow wet-floor sign, a mop bucket
  const cy=fy+30;R(mid-96,cy,44,26,'#9a9aa4');for(let x=mid-94;x<mid-52;x+=4)R(x,cy+2,1,22,'#6a6a74');for(let y=cy+4;y<cy+26;y+=5)R(mid-96,y,44,1,'#6a6a74');R(mid-96,cy,44,2,'#c0c0c8');
  R(mid-90,cy-4,30,8,'#e8e4f0');R(mid-66,cy+2,8,16,'#e8e4f0');R(mid-98,cy+26,4,6,'#3a3a44');R(mid-56,cy+26,4,6,'#3a3a44');
  R(mid-20,cy+24,8,4,'#c8302e');R(mid-14,cy+20,3,6,'#c8302e');
  for(let i=0;i<16;i++)R(mid+60-i*.5,cy+i*1.6,i+1,2,'#f0d040');R(mid+52,cy+26,18,2,'#a88a20');K.signText(c,'WET',mid+55,cy+14,'#2a2030');
  R(mid+80,cy+12,22,18,'#3a6aa8');R(mid+80,cy+12,22,3,'#5a8ac8');R(mid+90,cy-14,2,28,'#c8a060');R(mid+84,cy+8,14,4,'#d8d0c0');
  R(mid-104,fy-22,52,22,'#e8e4dc');for(let x=mid-102;x<mid-54;x+=5)R(x,fy-20,2,18,'#c8c4bc');R(mid-106,fy-24,56,4,'#f8f4ec');
  R(mid-98,fy-30,14,8,'#7a8ab0');R(mid-86,fy-32,16,10,'#e8dcc0');R(mid-70,fy-29,12,7,'#c8302e');R(mid-62,fy-31,6,4,'#f4f0e8');
  R(mid+38,fy-26,18,26,'#e8a040');R(mid+38,fy-26,18,3,'#f0c060');R(mid+42,fy-32,8,6,'#e8a040');R(mid+44,fy-35,4,3,'#3a6aa8');R(mid+41,fy-16,12,8,'#f4f0e8');R(mid+43,fy-14,8,1,'#3a6aa8');
  R(mid+62,fy-12,24,12,'#a8d0e8');R(mid+62,fy-12,24,2,'#c8e8f8');R(mid+66,fy-9,16,4,'#f4f0e8');
  for(let i=0;i<5;i++){R(mid+92,fy-3-i*2,10,2,'#c0c0c8');R(mid+92,fy-3-i*2,10,1,'#e0e0e8')}
  R(mid-30,fy-3,20,2,'#d8c890');R(mid-24,fy-5,16,1,'#d8c890');
  // 4 AM: the corners fall off into shadow, so the tube's light sits on him
  const vg=c.createRadialGradient(mid,fy-70,40,mid,fy-40,VW*.85);vg.addColorStop(0,'rgba(12,8,22,0)');vg.addColorStop(1,'rgba(12,8,22,.55)');c.fillStyle=vg;c.fillRect(0,0,VW,VH)}
};

return{paint,props,folk,portraits,fx,laundromat,seamGlint,FOLK,PORT,portraitCanvas};
})();
