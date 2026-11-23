// Black Lantern · cases/dead-air-art.js · Dead Air's art (spec 020 part A, Nov 23, 2026). Exposes window.DAA.
// Art for this case only (Bible, Art, Direction: one case, one set of art); never reuse it in another case.
// Generic pieces come from the Shared Shelf (engine/shelf.js: v1, the summer, main street, houses and interiors kits,
// and the Deep South and towers kits spec 021 draws first here: cane field, live oak, cypress, bayou, raised house,
// tower, cinder block, porch radio, mic and mixing board), painted with Black Lantern's palette. This file adds the
// case's own pieces (Main Street's storefronts and signs, the Gas-N-Go, the church hall set for the fish fry, the feed
// store, the KHLT station with its dead sign, the broadcast booth and record room, the radial field), the broadcast
// look, its townsfolk on the map and in the dialog box, and Big Hat's briefing place, a bait shop's back porch.
// Early March in south Louisiana (spec 020, Art): green coming back, wet ground, live oaks and moss, raised houses on
// piers; at night porch lights and moths, the tower's slow red blink, radio dials glowing. No autumn or summer-only
// pieces from the Shelf.
//
//   DAA.paint(M)             the map's still layer -> {c, glows}; DAA.props(M) its standing pieces, sorted with people
//   DAA.folk(id, dir, idle, M)  a townsperson's map sprite -> {c, ax, ay}
//   DAA.portraits            speaker name -> (ctx, mouth) drawing the 64 x 64 talking portrait
//   DAA.fx(ctx, o)           the case's light and air after the light pass: birds and the bayou by day; at night moths
//                            round the porch lights, the tower's blink, the lantern's warm pool; the broadcast look on top
//   DAA.onAir(on)            turns the broadcast look on or off (a dial and a waveform over the top of the screen)
//   DAA.porch                Big Hat's briefing place: {back, front} (engine.js bigHatScene)
//   DAA.micGlint             how the hidden hotspot looks while it shows
//
// Dead Air's accent colors (spec 020, Art; Bible, Art, Palette), on top of the base palette:
const DA_ACCENT={tower:'#ff4a3d',dial:'#ffb347',moss:'#8a9a7a',cane:'#c8a850',paint:'#e8e2d0',hall:'#d8d4c8',green:'#4a6a4a'};
window.DAA=(()=>{
const K=SHELF,T=16,S=.5,{F,shade,hsh,RGB,art}=K,A=DA_ACCENT;
const ART={};
const get=(k,spec)=>ART[k]||(ART[k]=K.prop(spec(),S));
const isNight=M=>M.light==='night';

// ================= GROUND =================
const GP={',':(x,y)=>K.stoneSidewalk(x,y,T,true),'.':(x,y)=>K.summerGrass(x,y,T,false),'=':(x,y)=>K.asphalt(x,y,T),d:(x,y)=>K.dirtRoad(x,y,T),g:(x,y)=>K.dryDirt(x,y,T,true),
 a:(x,y)=>K.bayou(x,y,T),u:(x,y)=>K.caneField(x,y,T,'young'),s:(x,y)=>K.caneField(x,y,T,'stubble'),
 e:(x,y)=>{const n=hsh(x>>1,y>>1,501),c=K.pal().earth;return n<.08?shade(c,-.25):n>.94?shade(c,.15):[shade(c,-.05),c,shade(c,-.1)][(hsh(x,y,502)*3)|0]},
 n:(x,y)=>K.floor(x,y,T,'lino'),c:(x,y)=>K.floor(x,y,T,'carpet'),v:(x,y)=>K.floor(x,y,T,'tile'),w:(x,y)=>K.floor(x,y,T,'wood'),
 o:(x,y)=>{const n=hsh(x>>1,y>>1,503);return n<.06?'#5a5852':(x%32===0||y%32===0)?'#565450':['#6e6c66','#686660','#74726a'][(hsh(x,y,504)*3)|0]}};
const SOFT=new Set('.dgeus'.split(''));
const at=(M,x,y)=>{const r=M.ground[y];return r?r[x]:undefined};

// ================= THE STILL LAYER =================
const still={};
function paint(M){
 const key=M.id+M.light+M.ph;if(still[key])return still[key];
 const W=M.w*T,H=M.h*T,c=K.mk(W,H),g=c.getContext('2d'),img=g.createImageData(W,H),d=img.data,glows=[];
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const tx=(x/T)|0,ty=(y/T)|0;let ch=at(M,tx,ty);
  if(SOFT.has(ch)){const jx=Math.min(W-1,Math.max(0,x+((hsh(x>>1,y>>1,61)*5)|0)-2)),jy=Math.min(H-1,Math.max(0,y+((hsh(x>>1,y>>1,62)*5)|0)-2)),jc=at(M,(jx/T)|0,(jy/T)|0);if(SOFT.has(jc))ch=jc}
  const col=(GP[ch]||GP['.'])(x,y),v=RGB(col),i=(y*W+x)*4;d[i]=v[0];d[i+1]=v[1];d[i+2]=v[2];d[i+3]=255}
 g.putImageData(img,0,0);
 // curbs where sidewalk meets road, puddles on dirt (early March: wet ground)
 for(let ty=0;ty<M.h;ty++)for(let tx=0;tx<M.w;tx++){const a=at(M,tx,ty),b=at(M,tx,ty+1);
  if(a===','&&b==='='){F(g,tx*T,ty*T+T-2,T,1,shade(K.pal().stoneWarm,.2));F(g,tx*T,ty*T+T-1,T,1,'#1c1820')}
  if(a==='='&&b===','){F(g,tx*T,ty*T+T-1,T,1,'#1c1820')}
  if((a==='d'||a==='e')&&hsh(tx,ty,505)<.07){g.fillStyle='rgba(60,70,80,.55)';g.beginPath();g.ellipse(tx*T+8,ty*T+9,6,2.5,0,0,6.283);g.fill();F(g,tx*T+4,ty*T+8,3,1,'rgba(200,210,220,.4)')}}
 if(M.id==='halcott')for(let x=1;x<44;x+=3)K.paintLine(g,x*T,7*T+7,T,2,true,'#d8c060');
 (M.lines||[]).forEach(l=>K.paintLine(g,l.x,l.y,l.w,l.h,l.dashed,l.col||'#e8e4d8'));
 M.pieces.filter(p=>PROPK.has(p.k)&&!NOSHADOW.has(p.k)).forEach(p=>{const cx=(p.x+p.w/2)*T+2,cy=(p.y+p.h)*T-2,rx=Math.max(5,p.w*T*.42);
  g.fillStyle='rgba(16,10,20,.28)';g.beginPath();g.ellipse(cx,cy,rx,Math.max(2.5,rx*.28),0,0,6.283);g.fill()});
 M.pieces.filter(p=>STILL[p.k]).sort((a,b)=>(BACK.has(a.k)?-99:a.y+a.h)-(BACK.has(b.k)?-99:b.y+b.h)).forEach(p=>STILL[p.k](g,p,M,glows));
 return still[key]={c,glows};
}
const BACK=new Set(['room','tower','circle','lot','ditch']);
const pbox=p=>({x0:p.x*T,x1:(p.x+p.w)*T,y0:p.y*T,fb:(p.y+p.h)*T,w:p.w*T});
const shadowBelow=(g,x0,x1,fb)=>{g.fillStyle='rgba(16,10,20,.32)';g.fillRect(x0+3,fb,x1-x0,3);g.fillStyle='rgba(16,10,20,.16)';g.fillRect(x0+5,fb+3,x1-x0-2,2)};
function signOn(g,rect,text,col,ink,k=1){const[x,y,w,h]=rect,inner=K.signBlank(g,x,y,w,h,col);const tw=K.signWidth(text,k);
 K.signText(g,text,Math.round(inner[0]+(inner[2]-tw)/2),Math.round(inner[1]+(inner[3]-5*k)/2),ink,k)}
// a porch light by a door: a small lamp; at night it glows and lights a pool (fx adds its moths)
const porchLights=[];
function porchLight(g,x,y,M,glows){F(g,x,y,4,5,'#2a2030');F(g,x+1,y+1,2,3,isNight(M)?'#fff2b8':'#d8d0a8');if(isNight(M)){glows.push([x+2,y+3,T*1.3,.5]);porchLights.push([M.id,x+2,y+3])}}
const STILL={
 // ---- Main Street's north side: each building fills rows 0-4, its door in row 4 ----
 hall(g,p,M,glows){const{x0,x1,fb}=pbox(p),N=isNight(M),dx=p.door*T+8;K.roof(g,x0,x1,0,22,'#5a4a5a',T,3);
  K.cinderBlock(g,x0,x1,22,fb,T,{painted:A.hall});F(g,x0,22,x1-x0,2,'rgba(20,10,20,.35)');
  F(g,dx-2,2,4,14,'#e8e4d8');F(g,dx-6,6,12,3,'#e8e4d8');                                   // the cross on the gable
  K.door(g,dx-6,fb-.95*T,fb,'#7a2a3a',T);K.door(g,dx+6,fb-.95*T,fb,'#7a2a3a',T);
  for(const wx of[x0+10,x0+34,x1-46,x1-22])glows.push(K.windowPane(g,wx,30,12,18,T,false));
  signOn(g,[x0+14,fb-1.9*T,x1-x0-28,10],'GOOD SHEPHERD HALL','#e8e2d0','#3a2a4a');
  if(M.ph===2){F(g,x0+6,fb-2.6*T,x1-x0-12,9,'#e8e2d0');F(g,x0+6,fb-2.6*T,x1-x0-12,2,A.tower);K.signText(g,'FISH FRY TONIGHT',x0+Math.round((x1-x0-K.signWidth('FISH FRY TONIGHT'))/2),fb-2.6*T+3,'#2a2030')}
  porchLight(g,dx-14,fb-1.1*T,M,glows);shadowBelow(g,x0,x1,fb)},
 sheriffs(g,p,M,glows){const{x0,x1,fb}=pbox(p),N=isNight(M);const s=K.storefront(g,x0,x1,8,fb,T,{col:'#8a5a3e',door:p.door*T+8,upper:true,trim:'#d8d0b8'});
  signOn(g,s.sign,'SHERIFF','#2e3a5a','#e8d890');if(!N)s.glows.forEach(gl=>glows.push(gl));else glows.push(s.glows[0]);
  F(g,x0+6,fb-1.4*T,10,6,'#c8a040');F(g,x0+7,fb-1.4*T+1,8,4,'#e8c860');K.signText(g,'*',x0+9,fb-1.4*T+1,'#8a6a20');   // the star
  porchLight(g,p.door*T+16,fb-1.15*T,M,glows);shadowBelow(g,x0,x1,fb)},
 feedst(g,p,M,glows){const{x0,x1,fb}=pbox(p),N=isNight(M),dx=p.door*T+8;
  F(g,x0,4,x1-x0,16,'#7a7a82');for(let x=x0;x<x1;x+=4)F(g,x,4,2,16,'#9a9aa2');F(g,x0,18,x1-x0,2,'#3a3a42');        // tin roof
  K.wall(g,x0,x1,20,fb,'batten','#a88a5a',T);F(g,x0-2,8,x1-x0+4,14,'#c8a870');F(g,x0-2,8,x1-x0+4,2,'#e8c890');  // false front
  signOn(g,[x0+6,10,x1-x0-12,10],'ARCENEAUX FEED & SEED','#e8e2d0','#6a2a1e');
  K.door(g,dx,fb-.95*T,fb,'#5a3a2a',T,true);glows.push(K.windowPane(g,x0+10,fb-1.6*T,16,14,T,false));glows.push(K.windowPane(g,x1-26,fb-1.6*T,16,14,T,false));
  for(let i=0;i<3;i++){F(g,x1-24+i*7,fb-8,6,8,'#d8c8a0');F(g,x1-24+i*7,fb-8,6,1,'#f0e0c0')}                           // feed sacks out front
  shadowBelow(g,x0,x1,fb)},
 baitst(g,p,M,glows){const{x0,x1,fb}=pbox(p),N=isNight(M),dx=p.door*T+8;K.roof(g,x0,x1,8,24,'#3a4a4a',T,5);
  K.wall(g,x0,x1,24,fb,'siding','#6a8a8a',T);K.awning(g,x0+4,x1-4,fb-1.5*T,T);
  signOn(g,[x0+6,26,x1-x0-12,10],'GUIDRY\'S BAIT','#e8e2d0','#2a4a6a');
  K.door(g,dx,fb-.95*T,fb,'#3a4a5a',T);glows.push(K.windowPane(g,x0+8,fb-1.1*T,14,12,T,false));
  F(g,x1-22,fb-1.15*T,16,9,'#e8e2d0');K.signText(g,'ICE',x1-19,fb-1.15*T+2,'#2a6aa8');if(N)glows.push([x1-14,fb-1.1*T,T,.4]);
  shadowBelow(g,x0,x1,fb)},
 // the empty lot at the east end: a weathered billboard over a board fence
 lot(g,p,M){const{x0,x1}=pbox(p);for(let x=x0;x<x1;x+=5){F(g,x,40,4,26,'#7a6a52');F(g,x,40,1,26,'#9a8a6a')}F(g,x0,48,x1-x0,2,'#5a4a3a');F(g,x0,60,x1-x0,2,'#5a4a3a');
  F(g,x0+14,2,4,40,'#5a4a3a');F(g,x1-24,2,4,40,'#5a4a3a');signOn(g,[x0+6,4,x1-x0-18,22],'HALCOTT','#3a6a4a','#f0e8c0',2)},
 gasgo(g,p,M,glows){const{x0,x1,y0,fb}=pbox(p),N=isNight(M),dx=p.door*T+8;
  F(g,x0-6,y0,x1-x0+12,8,'#e8e2d0');F(g,x0-6,y0,x1-x0+12,2,'#ffffff');F(g,x0-6,y0+6,x1-x0+12,2,A.tower);
  K.cinderBlock(g,x0,x1,y0+8,fb,T,{painted:'#e8dcc0'});signOn(g,[x0+8,y0+10,x1-x0-16,9],'GAS-N-GO','#2a3a6a','#ffd860');
  K.door(g,dx,fb-.95*T,fb,'#6a8aa8',T);for(const wx of[x0+6,x1-30]){F(g,wx,fb-1.2*T,24,15,'#2a2030');F(g,wx+1,fb-1.2*T+1,22,13,N?'#fff2c8':'#a8c8d8');F(g,wx+1,fb-1.2*T+8,22,6,N?'#e8d098':'#88a8b8');glows.push([wx+12,fb-1.2*T+7,T*(N?2.2:1),N?.55:.25])}
  F(g,x0+8,fb-1.2*T+3,8,6,'#c8402e');F(g,x0+18,fb-1.2*T+4,4,4,'#e8c840');                                                 // signs taped in the window
  shadowBelow(g,x0,x1,fb)},
 house(g,p,M,glows){const{x0,x1,y0,fb}=pbox(p),N=isNight(M);const r=K.raisedHouse(g,x0+4,x1-4,y0+2,y0+20,fb,T,{col:p.col,roofCol:p.roof,door:p.door*T+8,porch:!!p.porch,shutters:p.shut,curtains:true,seed:p.x});
  r.glows.forEach((gl,i)=>{if(!N||hsh(p.x,i,506)<.5)glows.push(gl)});porchLight(g,p.door*T+16,r.floor-.85*T,M,glows);
  if(p.porch){for(let i=0;i<3;i++){const rx=x0+40+i*14;F(g,rx,r.floor-8,10,7,['#6a4a32','#8a6a4a','#5a3a2a'][i]);F(g,rx+6,r.floor-7,3,2,N?A.dial:'#5a4a3a')}}   // more radios on her rail
  shadowBelow(g,x0+4,x1-4,fb)},
 bank(g,p,M){K.bayouEdge(g,0,M.w*T,p.y*T,T,{knees:(p.knees||[]).map(x=>x*T+8)})},
 shed(g,p,M){const{x0,x1,y0,fb}=pbox(p);F(g,x0,y0,x1-x0,8,'#8a8a92');for(let x=x0;x<x1;x+=4)F(g,x,y0,2,8,'#a8a8b0');F(g,x0,y0+8,x1-x0,2,'#2a2a30');
  K.wall(g,x0+2,x1-2,y0+10,fb,'batten','#8a7a5a',T);F(g,x0+12,fb-18,12,18,'#4a3a2a');F(g,x0+20,fb-10,2,2,'#c8a040');for(let x=x0+2;x<x1-2;x+=6)if(hsh(x,y0,507)<.4)F(g,x,y0+12,4,3,'#a85a2a');shadowBelow(g,x0,x1,fb)},
 // ---- KHLT: the cinder-block station, its dead sign, the transmitter shed, the tower ----
 station(g,p,M,glows){const{x0,x1,y0,fb}=pbox(p),N=isNight(M),dx=p.door*T+8;
  F(g,x0-3,y0-6,x1-x0+6,10,'#5a5a62');F(g,x0-3,y0-6,x1-x0+6,2,'#7a7a82');F(g,x0-3,y0+3,x1-x0+6,2,'#2a2a30');
  K.cinderBlock(g,x0,x1,y0+5,fb,T,{painted:'#d0ccb8'});F(g,x0,y0+5,x1-x0,3,'rgba(20,10,20,.3)');
  // the dead sign on the roof: KHLT 1340, letters missing
  F(g,x0+20,y0-30,5,26,'#4a4a52');F(g,x0+120,y0-30,5,26,'#4a4a52');F(g,x0+12,y0-34,124,18,'#2a2a34');F(g,x0+14,y0-32,120,14,'#3a3a46');
  const t='KHLT 1340';for(let i=0;i<t.length;i++){if(i===2||i===6)continue;K.signText(g,t[i],x0+24+i*12,y0-30,N?'#5a2a2a':'#8a3a32',2)}F(g,x0+48,y0-30,6,10,'#4a2a2a');
  K.door(g,dx,fb-.95*T,fb,'#5a6a7a',T);F(g,dx-6,fb-1.3*T,12,4,'#2a2030');F(g,dx-5,fb-1.3*T+1,10,2,'#5a1a1a');                     // an ON AIR box over the door, dark
  for(const wx of[x0+18,x1-48]){F(g,wx,fb-1.6*T,22,12,'#2a2030');F(g,wx+1,fb-1.6*T+1,20,10,N?'#1a1824':'#5a6a78');for(let k=wx+2;k<wx+20;k+=4)F(g,k,fb-1.6*T+1,1,10,'#2a2030')}
  K.windowAC(g,x1-44,fb-1.6*T+8,T,{on:false,drip:true});F(g,x0+4,fb-12,3,12,'#6a6a72');F(g,x0+3,fb-14,5,3,'#8a8a92');           // a service meter
  porchLight(g,dx+12,fb-1.1*T,M,glows);shadowBelow(g,x0,x1,fb)},
 // the tower's foot in its clearing: the guy wires fan out to the anchors, the lattice runs off the top of the map
 tower(g,p,M){const cx=p.x*T+8,fb=(p.y+1)*T-4;
  g.strokeStyle='rgba(200,200,210,.55)';g.lineWidth=1;for(const[ax,ay]of[[21,4],[31,4],[21,12],[31,12]]){g.beginPath();g.moveTo(ax*T+8,ay*T+12);g.lineTo(cx,ay<8?-20:fb-60);g.stroke()}
  K.latticeMast(g,cx,-10,fb-8,12,T);const b=K.prop(K.TOWER_BASE,S);g.drawImage(b.c,Math.round(cx-b.ax),Math.round(fb-b.ay))},
 towerfence(g,p){const x0=p.x*T,x1=(p.x+p.w)*T,top=p.y*T+3,bot=(p.y+p.h-1)*T+3;K.chainLinkSide(g,x0+7,top+14,bot+2,T);K.chainLinkSide(g,x1-9,top+14,bot+2,T);
  K.chainLink(g,x0,x1,top,T,{post:2});K.chainLink(g,x0,x1,bot,T,{post:2,gate:[p.gate*T,(p.gate+1)*T],open:false});
  F(g,(p.gate+1)*T+2,bot-2,18,9,'#e8e4d8');F(g,(p.gate+1)*T+2,bot-2,18,3,A.tower);K.signText(g,'DANGER',(p.gate+1)*T+3,bot+2,'#2a2030')},
 txshed(g,p,M,glows){const{x0,x1,y0,fb}=pbox(p);F(g,x0-2,y0,x1-x0+4,6,'#5a5a62');K.cinderBlock(g,x0,x1,y0+6,fb,T,{});F(g,x0+18,fb-18,12,18,'#5a6a6a');F(g,x0+26,fb-10,3,3,'#c8a040');shadowBelow(g,x0,x1,fb)},
 // ---- the cane fields: a drainage ditch with a plank culvert ----
 ditch(g,p,M){const y=p.y*T,[a,b]=p.bridge;K.bayouEdge(g,0,M.w*T,y+2,T,{knees:[]});F(g,0,y+T-2,M.w*T,2,'rgba(16,10,20,.5)');
  for(let x=a*T;x<b*T;x+=4){F(g,x,y,3,T,'#7a6a4a');F(g,x,y,3,1,'#9a8a6a');F(g,x+3,y,1,T,'#3a2a1e')}},
 // ---- the radial field: a bare circle, copper wires coming up out of it like spokes ----
 circle(g,p,M){const cx=11*T,cy=8*T;for(let i=0;i<24;i++){const a=i/24*6.283;g.strokeStyle=i%3?'rgba(214,140,70,.8)':'rgba(255,190,110,.95)';g.lineWidth=1;g.beginPath();
   for(let r=6;r<130;r+=3){const x=cx+Math.cos(a)*r+Math.sin(r*.2+i)*1.2,y=cy+Math.sin(a)*r*.75;if(hsh(i,r,508)<.35){g.moveTo(x,y);continue}g.lineTo(x,y)}g.stroke()}
  g.fillStyle='rgba(16,10,20,.35)';g.beginPath();g.ellipse(cx,cy+4,18,8,0,0,6.283);g.fill();F(g,cx-3,cy-2,6,4,'#8a5a2a');F(g,cx-2,cy-2,4,1,'#c88a4a')},
 // ---- interiors: the back wall, the side walls and the bottom wall with its door gap, then each room's fittings ----
 room(g,p,M,glows){const W=M.w*T,H=M.h*T,kind={sheriff:['panel','#7a6a4a'],achord:['plain','#d8c8a8'],hebert:['plain','#a8b8b0'],hall:['plain','#d8d4c4'],feed:['panel','#8a6a42'],booth:['panel','#6a5038'],records:['plain','#8a8478']}[M.id]||['plain','#b8a888'];
  K.innerWall(g,T,W-T,0,3*T,kind[0],kind[1],T);
  F(g,0,0,T,H,'#1e1826');F(g,T-2,0,2,H-T,'#3a3046');F(g,W-T,0,T,H,'#1e1826');F(g,W-T,0,2,H-T,'#2a2236');
  F(g,0,H-T,W,T,'#1e1826');F(g,T,H-T,W-2*T,2,'#3a3046');
  for(const k of Object.keys(M.warps)){const[x,y]=k.split(',').map(Number);
   if(y===M.h-1){F(g,x*T+1,H-T,T-2,T,'#6a4a3a');F(g,x*T+3,H-T+3,T-6,T-6,'#8a5a3a');for(let i=0;i<4;i++)F(g,x*T+4,H-T+5+i*2,T-8,1,'#5a3a2a')}
   else{const sx=x===0?0:W-T;F(g,sx,y*T-14,T,T+14,'#4a3828');F(g,sx+(x===0?T-4:2),y*T-12,2,T+12,'#2a1e16')}}
  (DECOR[M.id]||(()=>{}))(g,M,glows)}
};
// each room's wall fittings
const DECOR={
 sheriff(g,M,glows){glows.push(K.windowPane(g,13*T,.4*T,1.2*T,1.3*T,T,false));F(g,1.2*T,.5*T,22,22,'#c8a040');F(g,1.2*T+2,.5*T+2,18,18,'#3a3a5a');K.signText(g,'ST.',1.2*T+4,.5*T+4,'#e8d890');K.signText(g,'ODILE',1.2*T+1,.5*T+11,'#e8d890');
  F(g,7.5*T,.6*T,12,12,'#f4efe6');F(g,7.5*T+5,.6*T+2,1,5,'#2a2030');F(g,7.5*T+5,.6*T+6,4,1,'#2a2030')},
 achord(g,M,glows){glows.push(K.windowPane(g,1.5*T,.5*T,1.6*T,1.2*T,T,true));F(g,4*T,.6*T,14,18,'#c8a040');F(g,4*T+2,.6*T+2,10,14,'#e8e0d0');F(g,4*T+5,.6*T+4,4,8,'#5a3a2a')},
 hebert(g,M,glows){glows.push(K.windowPane(g,6*T,.5*T,1.6*T,1.2*T,T,true));F(g,9.5*T,.5*T,20,14,'#2e4a6a');F(g,9.5*T+2,.5*T+2,16,10,'#5a8aa8');F(g,9.5*T+6,.5*T+6,8,2,'#e8e4d8')},
 hall(g,M,glows){for(const x of[1.5,13.5])glows.push(K.windowPane(g,x*T,.5*T,1.4*T,1.6*T,T,false));F(g,12*T,.4*T,10,14,'#8a6a4a');F(g,12*T+4,.4*T+2,2,10,'#e8e4d8');F(g,12*T+1,.4*T+5,8,2,'#e8e4d8')},
 feed(g,M,glows){glows.push(K.windowPane(g,8*T,.5*T,1.4*T,1.2*T,T,false));F(g,10*T,.4*T,30,16,'#e8e2d0');K.signText(g,'CASH',10*T+3,.4*T+2,'#a8323e');K.signText(g,'ONLY',10*T+3,.4*T+9,'#2a2030')},
 booth(g,M,glows){for(let y=4;y<3*T-4;y+=6)for(let x=T+4;x<M.w*T-T-4;x+=6)if((x+y)%12===0)F(g,x,y,3,3,'rgba(30,20,20,.35)');       // the acoustic tiles' holes
  F(g,1.4*T,.5*T,30,20,'#e8e2d0');K.signText(g,'LOG',1.4*T+3,.5*T+2,'#2a2030');for(let i=0;i<3;i++)F(g,1.4*T+3,.5*T+9+i*3,22,1,'#8a8070')},
 records(g,M){F(g,7*T,.4*T,14,10,'#e8e2d0');K.signText(g,'78',7*T+3,.4*T+2,'#2a2030')}
};

// ================= STANDING PIECES =================
const SPEC={
 pot:()=>({size:[36,40,0,0],anchor:[18,38],lights:[[18,34,1,.4]],draw({R,E}){R(6,30,24,4,'#3a3a44');R(8,34,3,6,'#3a3a44');R(25,34,3,6,'#3a3a44');E(18,33,9,2,'#5ad0ff');
  E(18,20,15,12,'#2a2a30');E(16,17,10,7,'#3a3a44');E(18,10,14,4,'#1a1a20');E(18,10,12,3,'#c89a40');R(30,4,2,10,'#6a4a32')}}),
 picnic:()=>({size:[64,34,0,0],anchor:[32,32],lights:[],draw({R}){R(2,8,60,8,'#e8e2d0',{sh:10});R(2,8,60,2,'#ffffff');R(6,16,4,16,'#6a4a32');R(54,16,4,16,'#6a4a32');R(0,22,64,4,'#8a6a4a');
  R(10,4,4,6,'#c8402e');R(12,2,2,3,'#e8e4d8');R(40,5,10,4,'#e8c870')}}),
 polesign:()=>({size:[36,110,0,0],anchor:[18,108],lights:[[18,16,1.6,.45]],draw({R}){R(16,30,4,78,'#5a5a64',{sh:1});R(2,0,32,32,'#2a3a6a',{sh:6});R(4,2,28,28,'#e8e2d0');R(4,2,28,8,'#c8402e');R(4,20,28,10,'#2a3a6a')}}),
 cell:()=>({size:[64,56,0,0],anchor:[32,54],lights:[],draw({R}){R(0,0,64,4,'#3a3a44');R(0,52,64,4,'#3a3a44');for(let x=2;x<64;x+=6)R(x,0,2,54,'#6a6a74');R(4,30,24,8,'#8a8a94');R(4,30,24,2,'#a8a8b0')}}),
 coffee:()=>({size:[24,44,0,0],anchor:[12,42],lights:[],draw({R}){R(2,24,20,18,'#6a4a32',{sh:4});R(5,6,14,18,'#2a2a30',{sh:3});R(7,14,10,8,'#3a2418');R(7,14,10,2,'#8a5a3a');R(14,8,3,3,'#e83a2a')}}),
 plant:()=>({size:[24,44,0,0],anchor:[12,42],lights:[],draw({R,C}){R(5,28,14,14,'#b5532e',{sh:3});R(4,27,16,3,'#c8683e');const L=K.pal().leaf;C(12,16,9,shade(L,-.2));C(8,12,6,L);C(16,10,6,L);C(12,5,5,shade(L,.2))}}),
 chair:()=>({size:[22,40,0,0],anchor:[11,38],lights:[],draw({R}){R(3,0,16,14,'#5a5a64',{sh:3});R(3,0,16,2,'#8a8a94');R(2,16,18,5,'#6a6a74',{sh:3});R(3,21,2,17,'#3a3a44');R(17,21,2,17,'#3a3a44')}}),
 sofa:()=>({size:[96,40,0,0],anchor:[48,38],lights:[],draw({R}){const c='#6a7a5a';R(4,0,88,18,c,{sh:10});R(4,0,88,2,shade(c,.2));R(0,8,10,24,shade(c,-.1));R(86,8,10,24,shade(c,-.2));R(8,18,80,14,shade(c,.1),{sh:8});R(20,4,16,12,'#c8a070');R(8,32,80,4,shade(c,-.35))}}),
 lampstand:()=>({size:[20,60,0,0],anchor:[10,58],lights:[[10,8,1.4,.45]],draw({R}){R(9,16,2,40,'#3a3a44');R(4,54,12,4,'#3a3a44');R(2,2,16,14,'#e8d8a8',{sh:4});R(2,2,16,2,'#fff6d8')}}),
 recliner:()=>({size:[36,44,0,0],anchor:[18,42],lights:[],draw({R}){const c='#5a4a3a';R(4,0,28,20,c,{sh:8});R(0,14,8,22,shade(c,-.1),{sh:3});R(28,14,8,22,shade(c,-.15));R(6,20,24,14,shade(c,.08),{sh:6});R(6,34,24,6,shade(c,-.3))}}),
 tv:()=>({size:[30,40,0,0],anchor:[15,38],lights:[[15,12,1,.3]],draw({R}){R(2,22,26,16,'#6a4a32',{sh:6});R(1,2,28,20,'#2a2a30',{sh:4});R(3,4,22,15,'#3a5a6a');R(3,4,22,3,'#5a7a8a')}}),
 cooler:()=>({size:[64,40,0,0],anchor:[32,38],lights:[[32,16,1,.3]],draw({R}){R(2,10,60,28,'#e8e4dc',{sh:10});R(0,4,64,8,'#f4f0e8',{sh:10});R(0,4,64,2,'#ffffff');R(6,14,52,10,'#a8d8e8');R(6,14,52,2,'#d8f0f8');
  R(20,26,24,8,'#2a6aa8');R(22,28,20,4,'#e8e4d8')}}),
 safe:()=>({size:[30,56,0,0],anchor:[15,54],lights:[],draw({R,C}){R(1,2,28,52,'#3a5a3a',{sh:8});R(1,2,28,2,'#5a7a5a');R(4,6,22,44,'#2e4a2e');C(15,24,5,'#c8c0a0');C(15,24,3,'#5a5a64');R(22,30,3,8,'#c8c0a0');R(2,52,26,2,'#1a2a1a')}}),
 seedrack:()=>({size:[60,56,0,0],anchor:[30,54],lights:[],draw({R}){R(2,0,56,52,'#8a6a4a',{sh:8});for(let y=4;y<48;y+=11)for(let x=5;x<54;x+=7)R(x,y,6,9,['#e8c840','#c8402e','#5aa84a','#a86ad8','#e88a3a'][(x+y)%5]);R(0,50,60,4,'#5a3e2a')}}),
 sackpile:()=>({size:[64,36,0,0],anchor:[32,34],lights:[],draw({R,E}){for(const[x,y]of[[4,18],[22,18],[40,18],[12,4],[30,4]]){E(x+10,y+8,11,8,'#d8c8a0');E(x+8,y+6,6,3,'#f0e0c0');R(x+4,y+6,12,3,'#a8323e')}}}),
 longtable:()=>({size:[128,30,0,0],anchor:[64,28],lights:[],draw({R}){R(0,4,128,10,'#e8e2d0',{sh:10});R(0,4,128,2,'#ffffff');R(4,14,3,14,'#8a8a94');R(121,14,3,14,'#8a8a94');
  for(let x=8;x<120;x+=24){R(x,5,10,4,'#e8e8e8');R(x+2,5,6,3,'#c8963a')}for(let x=20;x<120;x+=36){R(x,0,3,6,'#c8402e')}}}),
 serving:()=>({size:[128,40,0,0],anchor:[64,38],lights:[],draw({R,E}){R(0,10,128,26,'#c8c8d0',{sh:12});R(0,8,128,4,'#e8e8f0');for(let i=0;i<4;i++){const x=6+i*31;R(x,2,26,8,'#9a9aa4');R(x+2,3,22,5,['#c8963a','#e8e0b0','#f4f0e0','#a86a2a'][i])}}}),
 console:()=>({size:[224,52,0,0],anchor:[112,50],lights:[[180,18,1.2,.35]],draw({R}){R(0,20,224,30,'#5a4632',{sh:20});R(0,18,224,4,'#7a6448');R(8,50,6,2,'#2a1e16')}}),
 cartmachines:()=>({size:[64,48,0,0],anchor:[32,46],lights:[],draw({R}){R(0,12,64,34,'#4a4a52',{sh:8});for(let i=0;i<3;i++){R(4+i*20,16,16,10,'#2a2a30');R(6+i*20,18,12,4,'#8a6a4a');R(8+i*20,28,4,3,'#c83a2a')}R(2,0,60,12,'#6a5a4a');for(let x=4;x<60;x+=4)R(x,2,3,9,['#e8d8a8','#c8a870','#e8e2d0'][x%3])}}),
 turntable:()=>({size:[64,36,0,0],anchor:[32,34],lights:[],draw({R,E}){R(0,10,64,24,'#5a4632',{sh:8});for(const x of[16,48]){E(x,20,12,7,'#1a1a20');E(x,20,3,2,'#c8402e')}R(26,12,2,8,'#c0c0c8')}}),
 recrack:()=>({size:[96,40,0,0],anchor:[48,38],lights:[],draw({R}){R(0,6,96,32,'#6a5a48',{sh:10});for(let x=3;x<92;x+=3)R(x,8,2,26,['#2a2030','#5a2a2a','#2a3a5a','#e8e2d0','#3a4a2a'][(x*7)%5]);R(0,4,96,3,'#8a7a62')}}),
 cabinet:()=>({size:[28,56,0,0],anchor:[14,54],lights:[],draw({R}){R(1,2,26,52,'#7a7a72',{sh:6});for(let y=6;y<50;y+=12){R(4,y,20,10,'#8a8a82');R(10,y+4,8,2,'#c0c0b8')}}}),
 barrel:()=>({size:[22,30,0,0],anchor:[11,28],lights:[],draw({R}){R(2,4,18,24,'#3a5a7a',{sh:5});R(2,4,18,2,'#5a7a9a');R(2,12,18,2,'#2a3a5a');R(2,22,18,2,'#2a3a5a');R(5,14,6,4,'#a85a2a')}}),
 pole:()=>({size:[40,140,0,0],anchor:[20,138],lights:[],draw({R}){R(18,10,4,128,'#5a4632',{sh:1});R(4,12,32,3,'#4a3a2a');R(6,8,4,4,'#c8c8d0');R(30,8,4,4,'#c8c8d0');R(22,30,10,14,'#6a6a74',{sh:3})}}),
 anchor:()=>({size:[20,14,0,0],anchor:[10,12],lights:[],draw({R}){R(2,4,16,8,'#8a8a82',{sh:4});R(2,4,16,2,'#a8a8a0');R(8,0,4,5,'#6a6a72')}}),
 pumpshed:()=>({size:[96,64,0,0],anchor:[48,62],lights:[[24,20,2.4,.5]],draw({R}){R(0,0,96,14,'#8a8a92',{sh:20});for(let x=0;x<96;x+=6)R(x,0,3,14,'#a8a8b0');R(4,14,88,46,'#7a6a52',{sh:16});for(let x=6;x<90;x+=8)R(x,14,2,46,'#5a4a3a');R(40,30,18,30,'#3a2a1e');R(16,22,12,10,'#a85a2a')}}),
 palmetto:()=>({size:[40,30,0,0],anchor:[20,28],lights:[],draw({R}){const L=K.pal().leaf;for(let i=0;i<9;i++){const a=-2.6+i*.33,len=13+(i%3)*3;for(let s=2;s<len;s++){R(20+Math.cos(a)*s,26+Math.sin(a)*s*.8,2,2,s>len-4?shade(L,.18):i%2?shade(L,-.15):L)}}R(18,22,4,6,shade(L,-.4))}}),
 boat:()=>({size:[124,40,0,0],anchor:[62,38],lights:[],draw({R,E}){R(4,30,116,3,'#3a3a44');E(20,34,6,5,'#1a1a20');E(100,34,6,5,'#1a1a20');R(8,10,108,18,'#6a8a6a',{sh:14});R(8,10,108,3,'#8aaa8a');R(4,6,116,5,'#e8e2d0');R(112,12,10,14,'#4a6a4a');R(118,4,4,12,'#3a3a44');R(20,16,70,5,'#e8e2d0')}}),
 traps:()=>({size:[64,40,0,0],anchor:[32,38],lights:[],draw({R}){for(const[x,y]of[[2,20],[24,20],[42,20],[12,2],[32,2]]){R(x,y,20,18,'#2a3a3a',{sh:5});for(let k=2;k<20;k+=3){R(x+k,y,1,18,'#5a7a7a');R(x,y+k,20,1,'#5a7a7a')}R(x+6,y+6,8,6,'#c8402e')}}}),
 scarepole:()=>({size:[24,80,0,0],anchor:[12,78],lights:[],draw({R}){R(10,6,4,72,'#6a5a42',{sh:1});R(2,12,20,3,'#6a5a42');R(4,15,6,20,'#c8b8a0');R(14,15,5,14,'#a83a2a')}})
};
const PROPK=new Set(['oakbig','oaksmall','cypress','lamp','car','truck','pump','polesign','pot','picnic','mailbox','porchradio','tallcane','anchor','barrel','pole','pumpshed','scarepole','palmetto','boat','traps','flowers','radioglow',
 'counter','desk','board','radioshelf','cell','coffee','plant','chairs','kitchentable','photos','sofa','lampstand','rug','knick','fridge','recliner','tv','toys','stage','serving','longtable',
 'sacks','sackpile','seedrack','safe','baitcooler','console','carts','onair','txwindow','turntable','records','recrack','cabinet','boxes','bulb','shed']);
const NOSHADOW=new Set(['board','radioshelf','photos','rug','knick','toys','stage','sacks','onair','txwindow','records','bulb','flowers','radioglow','lamp','polesign','pole','tallcane','shed','oakbig','oaksmall','cypress','txshed']);
function props(M){
 const out=[],N=isNight(M);
 const add=(a,fx,fy,p,o={})=>{const X=Math.round(fx-a.ax),Y=Math.round(fy-a.ay);
  out.push(Object.assign({tx:p.x,ty:p.y,x:fx,y:fy,top:Y,draw:(c,ox,oy)=>c.drawImage(a.c,X+ox,Y+oy),
   lights:(a.lights||[]).map(([lx,ly,r,al])=>[X+a.sx(lx),Y+a.sy(ly),r*T,al,!!o.pool])},o.extra||{}))};
 const dyn=(p,fx,fy,top,draw,o={})=>out.push(Object.assign({tx:p.x,ty:p.y,x:fx,y:fy,top,draw,lights:o.lights||[]},o.extra||{}));
 const canopy=(a,cx,fy,p,inset=10)=>{const X=Math.round(cx-a.ax),Y=Math.round(fy-a.ay);add(a,cx,fy,p,{extra:{canopy:[X+inset,Y,a.c.width-inset*2,a.c.height-18]}})};
 for(const p of M.pieces){if(!PROPK.has(p.k))continue;const cx=(p.x+p.w/2)*T,fy=(p.y+p.h)*T-2;
  switch(p.k){
  case'oakbig':canopy(get('oak0',()=>K.liveOak(0)),cx,fy+1,p,14);break;
  case'oaksmall':canopy(get('oak1',()=>K.liveOak(1)),cx,fy+1,p,10);break;
  case'cypress':canopy(get('cyp'+(p.x%2),()=>K.cypress(p.x%2)),cx,fy+1,p,8);break;
  case'tallcane':canopy(get('cane'+p.w+(p.x%3),()=>K.tallCane(p.w,p.x%3)),cx,fy+1,p,2);break;
  case'lamp':add(get('lamp',()=>K.LAMP),cx,fy+1,p,{pool:true,extra:{lamp:[cx,fy-40]}});out[out.length-1].lights.push([cx,fy-2,1.8*T,.4,true]);break;
  case'car':add(get('car'+p.tint,()=>K.sedan('side',p.tint)),cx,fy,p);break;
  case'truck':add(get('car'+p.tint,()=>K.sedan('side',p.tint)),cx,fy,p);break;
  case'pump':add(get('pump',()=>K.gasPump('#c8402e')),cx,fy,p);break;
  case'polesign':{const a=get('polesign',SPEC.polesign);if(!a.named){a.named=1;const g=a.c.getContext('2d');K.signText(g,'GAS',a.sx(10),a.sy(12),'#2a3a6a');K.signText(g,'3.89',a.sx(8),a.sy(22),'#ffd860')}add(a,cx,fy,p);break}
  case'pot':add(get('pot',SPEC.pot),cx,fy,p,{extra:{steam:[cx,fy-18]}});break;
  case'picnic':add(get('picnic',SPEC.picnic),cx,fy,p);break;
  case'mailbox':add(get('mail',()=>K.mailbox(true)),cx,fy,p);break;
  case'porchradio':add(get('radio'+(p.on?1:0),()=>K.porchRadio(!!p.on)),cx,fy,p,{extra:{radio:[cx,fy-6]}});break;
  case'anchor':add(get('anchor',SPEC.anchor),cx,fy,p);break;
  case'barrel':add(get('barrel',SPEC.barrel),cx,fy,p);break;
  case'pole':add(get('pole',SPEC.pole),cx,fy,p);break;
  case'pumpshed':add(get('pshed',SPEC.pumpshed),cx,fy,p,{pool:true});break;
  case'palmetto':add(get('palm'+(p.x%2),SPEC.palmetto),cx,fy,p);break;
  case'boat':{const a=get('boat',SPEC.boat);if(!a.named){a.named=1;K.signText(a.c.getContext('2d'),'GUIDRY',a.sx(30),a.sy(16),'#2a3a2a')}add(a,cx,fy,p);break}
  case'traps':add(get('traps',SPEC.traps),cx,fy,p);break;
  case'flowers':dyn(p,cx,0,0,(c,ox,oy)=>{for(let i=0;i<p.w*5;i++){const x=p.x*T+2+hsh(i,p.y,511)*(p.w*T-4)+ox,y=p.y*T+3+hsh(i,p.x,512)*10+oy;F(c,x,y,2,2,['#e8d860','#f0f0f0','#c87ab8','#e87a5a'][i%4]);F(c,x,y+2,1,2,'#3a6a2a')}});break;
  case'radioglow':dyn(p,cx,0,0,()=>{},{lights:[[cx,p.y*T+4,2.2*T,.5,true]],extra:{radio:[cx+6,p.y*T-6]}});break;
  case'scarepole':add(get('scare',SPEC.scarepole),cx,fy,p);break;
  case'shed':break;
  case'counter':add(get('counter'+p.w,()=>K.counter(p.w)),cx,fy+10,p);break;
  case'desk':add(get('desk',()=>K.DESK),cx+8,fy,p);break;
  case'cell':add(get('cell',SPEC.cell),cx,fy,p);break;
  case'coffee':add(get('coffee',SPEC.coffee),cx,fy,p);break;
  case'plant':add(get('plant',SPEC.plant),cx,fy,p);break;
  case'chairs':{const a=get('chair',SPEC.chair);for(let i=0;i<p.w;i++)add(a,p.x*T+8+i*T,fy,p);break}
  case'kitchentable':{add(get('ktable',()=>K.tableChairs('#e8e2d0')),cx,fy,p);const a=get('radio0',()=>K.porchRadio(false));add(a,cx-4,fy-14,p);break}
  case'sofa':add(get('sofa',SPEC.sofa),cx,fy,p);break;
  case'lampstand':add(get('lampst',SPEC.lampstand),cx,fy,p);break;
  case'fridge':add(get('fridge',()=>K.kitchen('fridge')),cx,fy,p);break;
  case'recliner':add(get('recliner',SPEC.recliner),cx,fy,p);break;
  case'tv':add(get('tv',SPEC.tv),cx,fy,p);break;
  case'serving':add(get('serving',SPEC.serving),cx,fy,p);break;
  case'longtable':add(get('ltable',SPEC.longtable),cx,fy,p);break;
  case'sackpile':add(get('sackpile',SPEC.sackpile),cx,fy,p);break;
  case'seedrack':add(get('seedrack',SPEC.seedrack),cx,fy,p);break;
  case'safe':add(get('safe',SPEC.safe),cx,fy,p);break;
  case'baitcooler':add(get('cooler',SPEC.cooler),cx,fy,p);break;
  case'console':{const a=get('console',SPEC.console);if(!a.dressed){a.dressed=1;const g=a.c.getContext('2d'),mb=K.prop(K.mixBoard(8,true),S),mic=K.prop(K.DESKMIC,S);
    g.drawImage(mb.c,a.sx(30),a.sy(2));g.drawImage(mic.c,a.sx(120),a.sy(-10));g.drawImage(mic.c,a.sx(196),a.sy(-10))}add(a,cx,fy,p);break}
  case'carts':add(get('carts',SPEC.cartmachines),cx,fy,p);break;
  case'turntable':add(get('tt',SPEC.turntable),cx,fy,p);break;
  case'recrack':add(get('recrack',SPEC.recrack),cx,fy,p);break;
  case'cabinet':add(get('cabinet',SPEC.cabinet),cx,fy,p);break;
  case'boxes':add(get('box'+(p.v|0),()=>K.boxes(p.v|0)),cx,fy,p);break;
  case'bulb':dyn(p,cx,0,0,(c,ox,oy)=>{F(c,cx+ox,oy,1,10,'#3a3834');F(c,cx-2+ox,10+oy,5,4,Math.random()>.03?'#fff2c8':'#8a8070')},{lights:[[cx,28,3.4*T,.45,true]]});break;
  // wall fittings, drawn flat on the back wall (no shadow, behind everyone)
  case'board':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+2+ox,y=.4*T+oy;F(c,x,y,60,30,'#8a6a42');F(c,x+2,y+2,56,26,'#c8a878');F(c,x+6,y+5,12,15,'#e8e4d8');F(c,x+8,y+7,8,8,'#a88a6a');F(c,x+22,y+5,12,15,'#e8e4d8');F(c,x+24,y+7,8,8,'#6a5a4a');
   F(c,x+38,y+4,18,20,'#d8e0c8');c.strokeStyle='#c8302e';c.beginPath();c.moveTo(x+12,y+5);c.lineTo(x+46,y+12);c.moveTo(x+28,y+5);c.lineTo(x+46,y+12);c.stroke()});break;
  case'radioshelf':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+2+ox,y=.3*T+oy;for(let j=0;j<2;j++){F(c,x,y+12+j*16,44,2,'#6a4a32');for(let i=0;i<4;i++){const rx=x+2+i*11;F(c,rx,y+3+j*16,9,9,['#6a4a32','#c8c0a8','#2a2a30','#8a3a2a'][(i+j)%4]);F(c,rx+5,y+5+j*16,3,2,'#5a5a64');F(c,rx+1,y+8+j*16,3,3,'#3a3a44')}}F(c,x+2,y+1,40,2,'#e8e2d0')});break;
  case'photos':dyn(p,cx,0,0,(c,ox,oy)=>{for(let i=0;i<6;i++){const x=p.x*T+4+(i%3)*18+ox,y=.4*T+((i/3)|0)*16+oy;F(c,x,y,13,12,'#c8a040');F(c,x+1,y+1,11,10,['#e8e0d0','#c8d0d8','#e0d0c0'][i%3]);F(c,x+4,y+3,4,5,'#7a5a3a')}});break;
  case'knick':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+2+ox,y=.5*T+oy;for(let j=0;j<2;j++){F(c,x,y+12+j*14,44,2,'#6a4a32');F(c,x+4,y+4+j*14,6,8,'#c8a8d8');F(c,x+30,y+6+j*14,8,6,'#e8c840')}F(c,x+16,y+22,12,4,'#a8986a');F(c,x+17,y+23,10,2,'#c8b88a')});break;
  case'toys':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+ox,y=p.y*T+6+oy;F(c,x+2,y,8,6,'#c8402e');F(c,x+14,y+2,6,6,'#e8c840');F(c,x+22,y+1,6,4,'#3a7ad8')});break;
  case'rug':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+ox,y=p.y*T+2+oy;F(c,x,y,p.w*T,12,'#8a3a3a');F(c,x+2,y+2,p.w*T-4,8,'#a85a4a');F(c,x+6,y+5,p.w*T-12,2,'#e8c870')});break;
  case'stage':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+ox,y=oy;F(c,x,y+28,p.w*T,20,'#6a4a32');F(c,x,y+28,p.w*T,2,'#8a6a4a');F(c,x+6,y+4,p.w*T-12,12,'#e8e2d0');K.signText(c,'GOOD SHEPHERD FISH FRY',x+8,y+7,'#3a2a4a');
   F(c,x+10,y+18,8,14,'#2a2a30');F(c,x+p.w*T-18,y+18,8,14,'#2a2a30');F(c,x+12,y+20,4,4,'#5a5a64');F(c,x+p.w*T-16,y+20,4,4,'#5a5a64')});break;
  case'sacks':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+ox,y=oy;for(let j=0;j<4;j++)for(let i=0;i<6;i++){const sx=x+2+i*13+(j%2)*5,sy=y+4+j*10;F(c,sx,sy,12,9,j%2?'#d8c8a0':'#c8b890');F(c,sx+2,sy+3,8,2,['#a8323e','#2a6aa8','#3a8a4a'][(i+j)%3])}});break;
  case'onair':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+4+ox,y=.6*T+oy,lit=M.ph===3&&Math.floor(performance.now()/1200)%3===0;F(c,x,y,24,10,'#2a2030');F(c,x+1,y+1,22,8,lit?'#ff4a3d':'#4a1a1a');K.signText(c,'ON AIR',x+1,y+2,lit?'#fff0e0':'#6a2a2a')},{lights:M.ph===3?[[cx,.6*T+5,1.4*T,.35,false]]:[]});break;
  case'txwindow':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+2+ox,y=.4*T+oy;F(c,x,y,44,24,'#2a2030');F(c,x+2,y+2,40,20,'#1a2a2a');for(let i=0;i<5;i++){F(c,x+5+i*8,y+6,4,14,'#5a6a6a');F(c,x+6+i*8,y+7,2,4,'#8a9a9a')}F(c,x+2,y+2,40,2,'rgba(200,220,220,.25)')});break;
  case'records':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+ox,y=oy;for(let j=0;j<3;j++){F(c,x,y+14+j*14,p.w*T,2,'#5a4632');for(let i=0;i<p.w*T;i+=2)F(c,x+i,y+3+j*14,2,11,['#2a2030','#5a2a2a','#e8e2d0','#2a3a5a','#8a6a2a','#3a4a2a'][(hsh(i,j,509)*6)|0])}});break;
  }}
 return out}

// ================= LIGHT AND AIR =================
// By day outside: a few birds cross now and then, ripples on the bayou. At night: moths round the porch lights and street
// lights, the tower's slow red blink over everything near it, the lantern's warm pool. The broadcast look goes on top.
let ON_AIR=0;
function onAir(on){ON_AIR=on?performance.now():0}
const OUT=new Set(['halcott','khlt','cane','radials']);
function fx(ctx,o){const M=o.M,now=o.now,N=isNight(M);
 if(OUT.has(M.id)&&!N){for(let i=0;i<3;i++){const t=((now/1000+i*7)%22)/22,x=-20+t*(ctx.canvas.width+40),y=24+i*14+Math.sin(t*9+i)*4,w=Math.floor(now/180+i)%2;ctx.fillStyle='#2a2030';ctx.fillRect(Math.round(x),Math.round(y),1,1);ctx.fillRect(Math.round(x)-2,Math.round(y)-1+w,2,1);ctx.fillRect(Math.round(x)+1,Math.round(y)-1+w,2,1)}}
 // steam off the fish fry pot, ripples on the bayou
 (M.props||[]).forEach(p=>{if(p.steam){for(let i=0;i<4;i++){const t=((now/1400)+i/4)%1,x=p.steam[0]-o.camx+Math.sin(t*6+i)*3,y=p.steam[1]-o.camy-t*20;ctx.fillStyle=`rgba(240,240,240,${(.4*(1-t)).toFixed(2)})`;ctx.fillRect(Math.round(x)-1,Math.round(y),3,2)}}});
 if(M.id==='halcott'){for(let i=0;i<6;i++){const t=((now/2600)+i/6)%1,x=(i*7.3%44)*T+8-o.camx,y=27*T+(i%3)*12-o.camy;ctx.fillStyle=`rgba(200,220,220,${(.35*(1-t)).toFixed(2)})`;ctx.fillRect(Math.round(x-t*6),Math.round(y),Math.round(2+t*12),1)}}
 if(N){
  // moths round every porch light and street light on screen
  const lamps=[];porchLights.forEach(([id,x,y])=>{if(id===M.id)lamps.push([x,y])});(M.props||[]).forEach(p=>{if(p.lamp)lamps.push(p.lamp);if(p.radio)lamps.push(p.radio)});
  ctx.fillStyle='#f4ead8';lamps.forEach(([x,y],j)=>{for(let i=0;i<3;i++){const a=now/(260+i*70)+i*2+j,r=4+i*2;ctx.fillRect(Math.round(x-o.camx+Math.cos(a)*r),Math.round(y-o.camy+Math.sin(a*1.3)*r*.7),1,1)}});
  // the tower's light: on the station grounds you see the beacon itself at the mast's top; out in the fields its red
  // pulse washes over everything
  if(M.id==='khlt')K.beacon(ctx,25*T+8-o.camx,-6-o.camy+16,now,26);
  if(M.id==='cane'||M.id==='radials'||M.id==='khlt'){const ph=(now%2400)/2400,on=ph<.5?Math.sin(ph/.5*Math.PI):0;if(on>0){ctx.fillStyle=`rgba(255,74,61,${(.07*on).toFixed(3)})`;ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height)}}
  // the lead's lantern: its pool goes warm (the approved night mockup)
  const lx=G.px+8-o.camx,ly=G.py+6-o.camy,lr=58;ctx.globalCompositeOperation='multiply';let gr=ctx.createRadialGradient(lx,ly,0,lx,ly,lr);
  gr.addColorStop(0,'rgba(240,196,120,.7)');gr.addColorStop(1,'rgba(240,196,120,0)');ctx.fillStyle=gr;ctx.fillRect(lx-lr,ly-lr,lr*2,lr*2);
  ctx.globalCompositeOperation='lighter';gr=ctx.createRadialGradient(lx,ly,0,lx,ly,lr*.5);gr.addColorStop(0,'rgba(214,164,58,.14)');gr.addColorStop(1,'rgba(214,164,58,0)');ctx.fillStyle=gr;ctx.fillRect(lx-lr,ly-lr,lr*2,lr*2);
  ctx.globalCompositeOperation='source-over'}
 if(M.id==='khlt'&&!N)K.beacon(ctx,25*T+8-o.camx,-6-o.camy+16,now,14);
 if(ON_AIR)broadcastLook(ctx,now);
}
// ================= THE BROADCAST LOOK (spec 020, Art: a dial and a waveform, drawn in code) =================
// While the show plays, a radio's face hangs over the top of the screen, clear of the dialog box at the bottom: the dial
// glowing amber with its needle on 1340, the signal's waveform scrolling beside it, a red ON AIR lamp and the clock.
// The map dims behind it so the words read; the lead card is hidden while the box is up anyway.
function broadcastLook(ctx,now){const W=ctx.canvas.width,t=(now-ON_AIR)/1000,R=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))};
 ctx.fillStyle='rgba(10,8,18,.45)';ctx.fillRect(0,0,W,ctx.canvas.height);
 const x0=6,y0=6,w=W-12,h=62,d=A.dial;
 R(x0-1,y0-1,w+2,h+2,'#120c1c');R(x0,y0,w,h,'#5a3a24');R(x0,y0,w,2,'#7a5a3a');R(x0,y0+h-3,w,3,'#3a2418');
 // the dial window: the band from 540 to 1600, ticks, numbers, the needle on 1340
 const dx=x0+6,dy=y0+6,dw=w-12,dh=22;R(dx-1,dy-1,dw+2,dh+2,'#120c1c');
 const g=ctx.createLinearGradient(0,dy,0,dy+dh);g.addColorStop(0,'#ffd890');g.addColorStop(1,d);ctx.fillStyle=g;ctx.fillRect(dx,dy,dw,dh);
 const kx=f=>dx+4+(f-540)/(1600-540)*(dw-8);
 for(let f=550;f<=1600;f+=50){const big=f%200===0;R(kx(f),dy+dh-(big?7:4),1,big?7:4,'#6a3a14')}
 [600,800,1000,1200,1400].forEach(f=>K.signText(ctx,String(f/10|0),Math.round(kx(f)-5),dy+3,'#6a3a14'));
 const nx=kx(1340)+Math.sin(t*1.7)*.6;R(nx-1,dy,2,dh,'#c8302e');R(nx,dy,1,dh,'#ff6a5a');
 ctx.globalCompositeOperation='lighter';const gl=ctx.createRadialGradient(nx,dy+dh/2,0,nx,dy+dh/2,26);gl.addColorStop(0,'rgba(255,180,80,.35)');gl.addColorStop(1,'rgba(255,180,80,0)');ctx.fillStyle=gl;ctx.fillRect(nx-26,dy-6,52,dh+12);ctx.globalCompositeOperation='source-over';
 // the waveform: a voice in the hiss
 const wy=y0+40,ww=w-60,wh=16;R(dx-1,wy-1,ww+2,wh+2,'#120c1c');R(dx,wy,ww,wh,'#14181a');
 const talking=typeof box!=='undefined'&&box&&box.typed<box.text.length;
 ctx.fillStyle='#7aff9a';for(let i=0;i<ww;i++){const s=Math.sin(i*.35+t*14)*Math.sin(i*.07+t*3),n=(hsh(i,(t*30)|0,510)-.5),a=(talking?6:1.5)*s+n*(talking?3:2);R(dx+i,wy+wh/2+a,1,1,'#7aff9a')}
 R(dx,wy+wh/2,ww,1,'rgba(122,255,154,.18)');
 // ON AIR lamp and the clock
 const lx=dx+ww+6,on=Math.floor(now/700)%2===0;R(lx,wy,40,8,'#2a1414');R(lx+1,wy+1,38,6,on?'#ff4a3d':'#6a2020');K.signText(ctx,'ON AIR',lx+8,wy+2,on?'#fff0e0':'#a84a4a');
 const m=Math.min(33,(t/4)|0);K.signText(ctx,'3',lx+4,wy+11,'#ffd890');R(lx+8,wy+12,1,1,'#ffd890');R(lx+8,wy+14,1,1,'#ffd890');K.signText(ctx,String(m).padStart(2,'0')+' AM',lx+10,wy+11,'#ffd890')}

// the hidden hotspot, while the lead is High on Mushrooms: the guest mic breathes, a slow pale glow swelling on it
function micGlint(c,x,y,now){const b=(Math.sin(now/900)+1)/2,r=4+b*4;const gr=c.createRadialGradient(x,y-6,0,x,y-6,r*2);gr.addColorStop(0,`rgba(220,240,255,${(.25+b*.3).toFixed(2)})`);gr.addColorStop(1,'rgba(220,240,255,0)');
 c.fillStyle=gr;c.fillRect(x-r*2,y-6-r*2,r*4,r*4);c.fillStyle=`rgba(243,237,226,${(.3+b*.4).toFixed(2)})`;c.fillRect(x-1,y-8-Math.round(b*2),3,1)}

// ================= TOWNSFOLK ON THE MAP =================
// The Shared Shelf's person template (shared-sprites-person-v1, method v1), at the agents' size; hair from agent-sprite.js.
// About 1 in 3 has a weird trait (Art, Townsfolk): the deputy's scanner, the pastor's church fan, Mama Lou's cigarettes
// behind her ears, Miss Odile's nutria on a leash, Remy's crawfish in his pocket.
const {SKIN}=window.BL;
const FOLK={
 sheriff:{look:{skin:1,hair:1,hairC:5,acc:0},top:'#c8b890',pants:'#6a5a3a',shoes:'#3a2a1e',iris:'#4a6a8a',mouth:'flat',hat:'#e8dcc0',
  body:(A_,ty)=>{const{R}=A_;R(16,ty+2,4,4,'#c8a040');R(6,ty+14,16,2,'#3a2a1e');R(10,ty+15,3,2,'#c8a040')}},
 deputy:{look:{skin:2,hair:4,hairC:0,acc:0},top:'#c8b890',pants:'#4a4a3a',shoes:'#2a1e18',iris:'#3a2418',mouth:'flat',scanner:1,
  body:(A_,ty)=>{const{R}=A_;R(8,ty+2,4,3,'#c8a040');R(6,ty+14,16,2,'#2a2030')}},
 joelle:{look:{skin:2,hair:5,hairC:1,acc:0},top:'#6a9ab8',pants:'#6a9ab8',shoes:'#e8e4d8',iris:'#3a2418',mouth:'flat',
  body:(A_,ty)=>{const{R}=A_;R(16,ty+2,3,4,'#e8e4d8')}},
 marcy:{look:{skin:1,hair:4,hairC:3,acc:0},top:'#c8402e',pants:'#3a4a6a',shoes:'#e8e4d8',iris:'#4a6a3a',mouth:'flat',
  body:(A_,ty)=>{const{R}=A_;R(10,ty+3,8,3,'#e8e4d8')}},
 lucien:{look:{skin:0,hair:2,hairC:6,acc:1},top:'#5a6a8a',coat:1,inner:'#e8e4d8',pants:'#4a4038',shoes:'#3a2a1e',iris:'#4a6a8a',mouth:'flat',cap:'#c8a040',
  body:(A_,ty)=>{const{R}=A_;R(16,ty+4,3,3,'#e8e4d8')}},
 pastor:{look:{skin:5,hair:2,hairC:5,acc:1},top:'#2a2a34',coat:1,inner:'#e8e4d8',pants:'#2a2a34',shoes:'#1a1418',iris:'#2a1a14',mouth:'smile',fan:1,
  body:(A_,ty)=>{const{R}=A_;R(13,ty,2,2,'#ffffff')}},
 lou:{look:{skin:3,hair:6,hairC:6,acc:0},top:'#e8a8b8',pants:'#5a4a6a',shoes:'#e8e4d8',iris:'#3a2418',mouth:'smile',cigs:1,cheeks:1,
  body:(A_,ty)=>{const{R}=A_;R(7,ty+4,14,12,'#f4f0e8');R(8,ty+6,12,1,'#c8a8b8')}},
 toby:{look:{skin:1,hair:0,hairC:2,acc:0},top:'#3a8a5a',pants:'#3b4a6b',shoes:'#e8e4d8',iris:'#4a6a8a',mouth:'open',freckles:1,
  body:(A_,ty)=>{const{R}=A_;R(16,ty+3,4,3,'#e8e4d8');R(17,ty+4,2,1,'#c8402e')}},
 odile:{look:{skin:4,hair:6,hairC:6,acc:1},top:'#8a5a9a',pants:'#8a5a9a',shoes:'#3a2a1e',iris:'#3a2418',mouth:'flat',nutria:1,
  body:(A_,ty)=>{const{R}=A_;for(let y=ty+3;y<ty+16;y+=4)for(let x=8;x<20;x+=5)R(x,y,2,2,'#c8a8d8')}},
 remy:{look:{skin:2,hair:1,hairC:1,acc:3},top:'#6a7a5a',pants:'#5a5a48',shoes:'#e8e4d8',iris:'#3a2418',mouth:'smile',cap:'#2e4a3a',craw:1,
  body:(A_,ty)=>{const{R}=A_;R(16,ty+3,5,5,shade('#6a7a5a',-.25))}},
 darlene:{look:{skin:1,hair:4,hairC:5,acc:0},top:'#d8c8e0',pants:'#5a5a6a',shoes:'#e8e4d8',iris:'#4a6a8a',mouth:'flat',radio:1},
 wade:{look:{skin:2,hair:1,hairC:1,acc:3},top:'#4a6a8a',pants:'#3a3a44',shoes:'#5a3a2a',iris:'#3a2418',mouth:'flat',radio:1},
 // the fish fry's crowd: they don't talk, but a place full of people has people in it (Art style, Maps are alive)
 f1:{look:{skin:3,hair:2,hairC:0,acc:0},top:'#a86a3a',pants:'#3a4a5a',shoes:'#2a1e18',mouth:'smile'},
 f2:{look:{skin:0,hair:5,hairC:3,acc:0},top:'#4a8a8a',pants:'#5a4a3a',shoes:'#e8e4d8',mouth:'open'},
 f3:{look:{skin:4,hair:3,hairC:0,acc:0},top:'#e8c840',pants:'#2a2a34',shoes:'#2a1e18',mouth:'smile'},
 f4:{look:{skin:1,hair:0,hairC:5,acc:1},top:'#7a3a5a',pants:'#4a4a54',shoes:'#3a2a1e',mouth:'flat'},
 f5:{look:{skin:2,hair:4,hairC:1,acc:0},top:'#5a8a4a',pants:'#3a4a6a',shoes:'#e8e4d8',mouth:'smile'}
};
// what the template lacks: caps and the sheriff's hat, the scanner, the church fan, cigarettes, a radio to the ear,
// Remy's crawfish, Miss Odile's nutria
function topper(Ad,F_,dir){const{R,E,C}=Ad;
 if(F_.cap){const c=F_.cap,cd=shade(c,-.3);if(dir==='up')R(5,0,18,7,c,{sh:3});else if(dir==='side'){R(6,-1,17,7,c,{sh:3});R(0,5,8,2,cd)}else{R(5,-1,18,7,c,{sh:3});R(5,-1,18,1,shade(c,.25));R(5,6,18,2,cd)}}
 if(F_.hat){const c=F_.hat;R(1,4,26,3,shade(c,-.2));R(6,-3,16,8,c,{sh:3});R(6,3,16,2,'#6a4a2a')}
 if(F_.scanner&&dir!=='up'){const x=dir==='side'?10:20;R(x,34,4,7,'#2a2a30');R(x+1,30,1,4,'#2a2a30');R(x+1,36,2,1,'#7aff9a')}
 if(F_.fan&&dir!=='up'){const x=dir==='side'?2:22;R(x+2,30,1,8,'#c8a878');E(x+2,26,5,5,'#e8e2d0');R(x,25,5,1,'#c8402e')}
 if(F_.cigs){if(dir!=='side')R(1,13,4,1,'#f4f0e8');if(dir!=='side')R(23,13,4,1,'#f4f0e8');else R(3,13,4,1,'#f4f0e8')}
 if(F_.radio&&dir!=='up'){const x=dir==='side'?2:22;R(x,12,6,9,'#5a4a3a');R(x+1,14,4,2,A.dial);R(x+1,18,4,2,'#2a2a30')}
 if(F_.craw&&dir==='down'){R(17,27,3,3,'#c83a2a');R(16,26,1,2,'#c83a2a');R(20,26,1,2,'#c83a2a')}
 if(F_.nutria&&dir!=='up'){const nx=dir==='side'?-8:28;E(nx+6,47,7,4,'#7a5a3a');E(nx+4,46,4,3,'#8a6a4a');R(nx+1,45,2,2,'#e8a040');R(nx+12,47,6,1,'#4a3a2a');R(nx+2,44,1,1,'#14101a');
  R(dir==='side'?4:24,32,1,1,'#a8323e');for(let i=0;i<10;i++)R((dir==='side'?4:24)+(nx+4-(dir==='side'?4:24))*i/10,32+i*1.2,1,1,'#a8323e')}}
const fcache=new Map();
function folk(id,dir,idle=0,M){
 const k=id+dir+idle;let v=fcache.get(k);if(v)return v;
 if(dir==='right'){const l=folk(id,'left',idle,M),c=K.mk(l.c.width,l.c.height),g=c.getContext('2d');g.translate(c.width,0);g.scale(-1,1);g.drawImage(l.c,0,0);v={c,ax:c.width-l.ax,ay:l.ay}}
 else{const F_=FOLK[id]||FOLK.f1,d=dir==='left'?'side':dir,L=F_.look,sk=SKIN[L.skin];
  const sp=Object.assign({skin:sk,hair:sk,hairStyle:'cropped',iris:F_.iris||'#3a2418'},F_);
  const wide=F_.nutria?20:0;
  const a=art(40+wide,90,6+(d==='side'?wide:0),30,F_.s||S,Ad=>{K.drawChar(Ad,sp,d,0,idle);BLA.extras(Ad,{look:L},dir,0);topper(Ad,F_,d)});
  v={c:a.c,ax:a.sx(14),ay:a.sy(50)}}
 fcache.set(k,v);return v;
}

// ================= PORTRAITS (64 x 64, Storybook faces, Lantern Bust box) =================
// The Asset Library's portrait kit (as in Lot 83): drawn pixel by pixel in a layer, then a light rim on the lit edges and
// a dark outline. Each sits on a lit backing (Quality bar, Rim and backing).
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
const shut=(L,y)=>{L.r(21,y+3,6,1,D);L.r(37,y+3,6,1,D)};
const PORT={
// Sheriff Dutch Fontenot: sixties, heavy, a cream Stetson-style hat, a gray mustache, a khaki uniform with a star, tired eyes
SHERIFF:{bg:'#2e3a3a',f(L,t){const s='#e9b98f',hat='#e8dcc0',u='#c8b890',m='#a8a8a8';
 body(L,u);L.r(27,44,10,8,sh(s,-30));shirtV(L,sh(u,-30));L.r(40,52,6,6,'#c8a040');L.p(43,54,'#fff0a0');L.r(18,54,8,2,sh(u,-30));
 ears(L,s);head(L,32,33,16,15,s);L.e(32,42,11,4,sh(s,-14));
 L.e(32,18,19,4,sh(hat,-40));L.e(32,17,19,3,hat);L.e(32,13,12,7,hat);L.r(20,15,24,3,'#6a4a2a');L.e(28,10,5,3,sh(hat,20));L.r(31,7,2,6,sh(hat,-24));
 eye(L,21,29,'#4a6a8a',-1);eye(L,37,29,'#4a6a8a',1);L.r(21,29,6,2,sh(s,-22));L.r(37,29,6,2,sh(s,-22));L.r(21,36,6,1,sh(s,-26));L.r(37,36,6,1,sh(s,-26));brows(L,m,26,1);
 nose(L,s,36);L.r(24,39,16,3,m);L.r(23,41,3,3,m);L.r(38,41,3,3,m);if(t)mouth(L,32,43,7,true);else L.r(29,44,6,1,MR)}},
// Deputy Renée Theriot: twenties, a dark bun, sharp eyes, khaki uniform, the scanner on her shoulder strap glowing green
DEPUTY:{bg:'#2a2e40',f(L,t){const s='#c98e62',hc='#1b1414',u='#c8b890';
 body(L,u);L.r(27,44,10,8,sh(s,-30));shirtV(L,sh(u,-30));L.r(18,52,6,3,'#c8a040');L.r(42,48,8,12,'#2a2a30');L.r(43,50,6,3,'#7aff9a');L.r(45,44,1,5,'#2a2a30');
 L.e(32,12,9,6,hc);L.e(31,10,5,3,sh(hc,40));ears(L,s);head(L,32,33,14,15,s);L.e(31,21,15,6,hc);L.r(17,21,3,8,hc);L.r(44,21,3,8,hc);
 eye(L,21,29,'#3a2418',-1);eye(L,37,29,'#3a2418',1);L.r(20,28,7,1,D);L.r(37,28,7,1,D);brows(L,hc,25,2);
 L.r(19,38,4,2,sh(s,14));L.r(41,38,4,2,sh(s,14));nose(L,s);if(t)mouth(L,32,42,7,true);else{L.r(28,43,8,1,MR);L.p(36,42,MR)}}},
// Joelle Achord: thirties, a nurse in blue scrubs, hair pulled back hard, red-rimmed eyes, a badge reel
JOELLE:{bg:'#2a3346',f(L,t){const s='#c98e62',hc='#4a2c1a',u='#6a9ab8';
 body(L,u);L.r(26,46,12,4,sh(u,-30));for(let j=0;j<8;j++)L.r(32-(8-j),48+j,2,1,sh(u,-30));L.r(40,52,6,8,'#e8e4d8');L.r(41,53,4,2,'#3a7ad8');
 L.e(33,13,8,5,hc);ears(L,s);head(L,32,33,14,15,s);L.e(31,21,15,6,hc);L.r(17,21,3,9,hc);L.r(44,21,3,9,sh(hc,-20));L.r(24,18,10,2,sh(hc,30));
 eye(L,21,29,'#4a2a18',-1);eye(L,37,29,'#4a2a18',1);L.r(21,35,6,1,'#c8706a');L.r(37,35,6,1,'#c8706a');brows(L,hc,25,-1);
 nose(L,s);if(t)mouth(L,32,42,7,true);else{L.r(28,43,8,1,MR);L.p(27,44,MR);L.p(36,44,MR)}}},
// Marcy Hebert: thirties, blonde ponytail, a red gas station polo with a white name patch, chewed lip, worn out
MARCY:{bg:'#33302a',f(L,t){const s='#e9b98f',hc='#d8b25a',u='#c8402e';
 body(L,u);L.r(26,46,12,5,sh(u,-28));L.r(40,54,10,4,'#e8e4d8');L.r(41,55,8,1,'#5a5a6a');L.r(28,46,8,4,sh(s,-30));
 L.e(46,20,5,10,sh(hc,-20));ears(L,s);head(L,32,33,14,15,s);L.e(31,21,15,6,hc);L.r(17,21,3,8,hc);L.r(44,21,3,6,sh(hc,-24));L.r(22,18,12,2,sh(hc,30));
 eye(L,21,29,'#4a6a3a',-1);eye(L,37,29,'#4a6a3a',1);L.r(21,35,6,1,sh(s,-24));L.r(37,35,6,1,sh(s,-24));brows(L,sh(hc,-40),26,2);
 L.r(19,38,4,2,'#e8857a');L.r(41,38,4,2,'#e8857a');nose(L,s);if(t)mouth(L,32,42,7,true);else{L.r(28,43,8,1,MR);L.r(30,44,4,1,'#c8605a')}}},
// Lucien Arceneaux: sixty-six, white hair under a seed cap, glasses, a work jacket over a white shirt, a guarded face
'MR. ARCENEAUX':{bg:'#2e3328',f(L,t){const s='#f0c8a0',hc='#ece8de',u='#5a6a8a',cap='#c8a040';
 body(L,u);L.r(26,46,12,18,'#e8e4d8');L.r(22,48,4,16,sh(u,-28));L.r(38,48,4,16,sh(u,-28));L.r(28,46,8,4,sh(s,-30));
 ears(L,s);head(L,32,33,15,15,s);L.r(17,24,3,8,hc);L.r(44,24,3,8,hc);
 L.e(31,20,16,7,sh(cap,-30));L.e(30,19,15,6,cap);L.r(16,23,32,3,sh(cap,-40));L.r(14,25,36,2,sh(cap,-20));L.r(26,15,10,5,'#3a6a3a');
 for(const x of[20,36]){L.r(x,28,9,8,'#3a2a24');L.r(x+1,29,7,6,'#e6eef4')}L.r(29,30,6,1,'#3a2a24');eye(L,21,29,'#4a6a8a',-1);eye(L,37,29,'#4a6a8a',1);
 brows(L,hc,27,-1);nose(L,s,37);L.r(22,40,2,3,sh(s,-30));L.r(40,40,2,3,sh(s,-30));if(t)mouth(L,32,42,7,true);else L.r(28,43,8,1,MR)}},
// Pastor Ellis Batiste: fifties, a big laugh, a gray beard, a black suit and white collar tab, a church fan (his weird trait)
PASTOR:{bg:'#3a2a3a',f(L,t){const s='#4e2f1f',b='#9aa0a6',u='#2a2a34';
 body(L,u);L.r(28,46,8,8,'#e8e4d8');L.r(30,47,4,2,'#ffffff');L.r(22,48,4,16,sh(u,22));L.r(38,48,4,16,sh(u,22));
 L.r(4,30,16,18,'#e8e2d0');L.r(4,30,16,3,'#c8402e');L.r(8,36,8,6,'#5a8ac8');L.r(11,48,2,14,'#c8a878');
 ears(L,s);head(L,32,32,15,15,s);L.e(32,19,14,5,sh(s,10));L.e(32,42,13,7,b);L.e(32,44,9,5,sh(b,-20));L.r(25,38,14,2,b);
 eye(L,21,28,'#2a1a14',-1);eye(L,37,28,'#2a1a14',1);brows(L,b,24,-1);L.r(19,36,4,2,sh(s,22));L.r(41,36,4,2,sh(s,22));nose(L,s,35);
 if(t)mouth(L,32,40,9,true);else{L.r(27,41,10,1,MR);L.p(26,40,MR);L.p(37,40,MR)}}},
// Mama Lou Guidry: seventies, a white bun and a pink housecoat under an apron, a cigarette behind each ear, never lit
'MAMA LOU':{bg:'#3a2a2a',f(L,t){const s='#a26a43',hc='#ece8de',u='#e8a8b8';
 body(L,u);L.r(20,50,24,14,'#f4f0e8');L.r(20,50,24,2,'#d8d0c0');L.r(27,44,10,8,sh(s,-30));
 L.e(32,13,8,5,hc);ears(L,s);head(L,32,33,15,15,s);L.e(31,21,16,6,hc);L.r(16,21,3,8,hc);L.r(45,21,3,8,sh(hc,-20));
 L.r(8,30,10,2,'#f4f0e8');L.r(8,30,2,2,'#e88a3a');L.r(47,30,10,2,'#f4f0e8');L.r(55,30,2,2,'#e88a3a');
 eye(L,21,29,'#3a2418',-1);eye(L,37,29,'#3a2418',1);L.r(21,36,6,1,sh(s,-24));L.r(37,36,6,1,sh(s,-24));brows(L,sh(hc,-30),26);
 L.r(19,38,4,2,'#d87a6a');L.r(41,38,4,2,'#d87a6a');nose(L,s);if(t)mouth(L,32,42,8,true);else{L.r(28,43,8,1,MR);L.p(27,42,MR);L.p(36,42,MR)}}},
// Toby Cormier: nineteen, the night clerk, freckles, a green store polo, a shaggy fringe, eyes too wide from no sleep
TOBY:{bg:'#24303a',f(L,t){const s='#e9b98f',hc='#8a5a2b',u='#3a8a5a';
 body(L,u);L.r(26,46,12,5,sh(u,-28));L.r(40,54,8,4,'#e8e4d8');L.r(41,55,6,1,'#c8402e');L.r(28,46,8,4,sh(s,-30));
 ears(L,s,35);head(L,32,34,13,14,s);L.e(31,22,15,8,hc);L.r(18,22,26,6,hc);L.r(20,26,6,3,hc);L.r(36,26,6,3,sh(hc,-20));L.r(26,17,8,2,sh(hc,40));
 eye(L,21,31,'#4a6a8a',-1);eye(L,37,31,'#4a6a8a',1);L.r(21,38,6,1,'#8a7aa8');L.r(37,38,6,1,'#8a7aa8');
 for(const[x,y]of[[22,40],[25,41],[39,40],[42,41],[24,39]])L.p(x,y,sh(s,-40));nose(L,s,38);if(t)mouth(L,32,43,8,true);else{L.r(29,44,6,1,MR);L.p(35,43,MR)}}},
// Miss Odile Broussard: eighty, a white braid, a purple flowered housedress, small round glasses, and Chou-Chou the nutria
'MISS ODILE':{bg:'#33283a',f(L,t){const s='#7a4a2c',hc='#ece8de',u='#8a5a9a';
 body(L,u);for(let y=50;y<64;y+=5)for(let x=6;x<60;x+=8)L.rm(x+(y%10),y,3,3,'#c8a8d8');L.r(27,44,10,8,sh(s,-30));
 L.e(50,54,9,6,'#7a5a3a');L.e(46,52,5,4,'#8a6a4a');L.r(42,52,3,2,'#e8a040');L.p(44,50,D);L.r(58,56,6,2,'#4a3a2a');
 ears(L,s);head(L,32,33,14,15,s);L.e(31,21,15,6,hc);L.r(17,21,3,12,hc);L.r(44,21,3,22,sh(hc,-14));for(let y=34;y<46;y+=3)L.r(44,y,4,2,sh(hc,-30));
 for(const x of[20,36]){L.e(x+4,31,5,5,'#c8a040');L.e(x+4,31,4,4,'#e6eef4')}eye(L,21,28,'#3a2418',-1);eye(L,37,28,'#3a2418',1);
 L.r(21,36,6,1,sh(s,-24));L.r(37,36,6,1,sh(s,-24));brows(L,hc,24);nose(L,s,37);L.r(26,40,1,3,sh(s,-30));L.r(37,40,1,3,sh(s,-30));
 if(t)mouth(L,32,43,7,true);else{L.r(28,44,8,1,MR);L.p(27,45,MR);L.p(36,45,MR)}}},
// Remy Guidry: forties, a green cap, stubble, waders' straps over a work shirt, and a live crawfish in his shirt pocket
REMY:{bg:'#283328',f(L,t){const s='#c98e62',hc='#4a2c1a',u='#6a7a5a',cap='#2e4a3a';
 body(L,u);L.r(20,46,4,18,'#3a3a2a');L.r(40,46,4,18,'#3a3a2a');L.r(28,46,8,4,sh(s,-30));L.r(38,52,10,8,sh(u,-24));L.e(43,52,3,2,'#c83a2a');L.r(40,50,2,2,'#c83a2a');L.r(46,50,2,2,'#c83a2a');L.p(42,51,D);L.p(44,51,D);
 ears(L,s);head(L,32,33,15,15,s);L.e(32,42,13,6,sh(s,-12));L.tex(sh(s,-12),sh(s,-40),3);
 L.e(31,20,16,7,sh(cap,-30));L.e(30,19,15,6,cap);L.r(16,23,32,3,sh(cap,-40));L.r(14,25,36,2,sh(cap,-25));L.r(27,15,8,4,'#c8a040');
 eye(L,21,29,'#3a2418',-1);eye(L,37,29,'#3a2418',1);brows(L,hc,27,-1);nose(L,s,36);L.r(19,38,4,2,sh(s,16));L.r(41,38,4,2,sh(s,16));
 if(t)mouth(L,32,42,8,true);else{L.r(27,43,10,1,MR);L.p(26,42,MR);L.p(37,42,MR)}}}
};
const pcache={};
function portraitCanvas(name,open){const k=name+(open?1:0);if(pcache[k])return pcache[k];
 const P_=PORT[name],L=Ly(64,64),c=K.mk(64,64),g=c.getContext('2d');P_.f(L,open?1:0);
 const gr=g.createRadialGradient(22,18,4,32,32,46);gr.addColorStop(0,sh(P_.bg,34));gr.addColorStop(1,P_.bg);g.fillStyle=gr;g.fillRect(0,0,64,64);
 const o=finish(L);for(let i=0;i<o.length;i++)if(o[i]){g.fillStyle=o[i];g.fillRect(i%64,(i/64)|0,1,1)}
 return pcache[k]=c}
const portraits={};
for(const name of Object.keys(PORT))portraits[name]=(ctx,open)=>{ctx.clearRect(0,0,64,64);ctx.drawImage(portraitCanvas(name,open),0,0)};
// voices off screen (the host, the callers): the porch radio in close-up stands in for a face; its dial brightens and its
// grille shivers while the voice talks
const radioFace={};
function radioPortrait(name,open){const k=name+(open?1:0);if(radioFace[k])return radioFace[k];const c=K.mk(64,64),g=c.getContext('2d');
 const gr=g.createRadialGradient(22,18,4,32,32,46);gr.addColorStop(0,name==='CALLER'?'#3a2a3a':'#3a2a24');gr.addColorStop(1,'#140e18');g.fillStyle=gr;g.fillRect(0,0,64,64);
 const a=K.prop(K.porchRadio(true),1.5);g.drawImage(a.c,Math.round(32-a.c.width/2),Math.round(36-a.c.height/2));
 const ox=Math.round(32-a.c.width/2),oy=Math.round(36-a.c.height/2);
 if(open){g.fillStyle='rgba(255,200,120,.35)';g.fillRect(ox+a.sx(25),oy+a.sy(11),a.sx(35)-a.sx(25),a.sy(16)-a.sy(11));g.fillStyle='rgba(20,10,20,.5)';for(let y=a.sy(11);y<a.sy(24);y+=2)g.fillRect(ox+a.sx(5)+1,oy+y,a.sx(21)-a.sx(5),1)}
 if(name==='CALLER'){g.fillStyle='#c8402e';g.fillRect(50,6,8,4);g.fillRect(52,4,4,8)}
 return radioFace[k]=c}
for(const name of['THE HOST','CALLER'])portraits[name]=(ctx,open)=>{ctx.clearRect(0,0,64,64);ctx.drawImage(radioPortrait(name,open),0,0)};

// ================= BIG HAT'S BRIEFING PLACE: a bait shop's back porch off I-10 (spec 020, Briefing) =================
// Night, March. Behind him: the bait shop's painted cinder-block back wall with its screen door and a bug light, the live
// bait tanks bubbling, a string of bulbs, and past the rail the interstate up on its pilings over the swamp, truck lights
// crossing. The radio on the rail is unplugged on purpose, its cord wrapped round it. In front of him, where the desk
// would be: the porch's plank table with the crawfish pot steaming on a propane ring, a spill of crawfish on newspaper,
// a roll of paper towels and a cooler. A bulb right over him keeps his face clear (back room layout, spec 013).
const porch={
 back(c,v){const{VW,VH,fy,mid,now}=v,R=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))};
  // the night past the porch: sky, the swamp, the interstate on its pilings with truck lights crossing
  const sk=c.createLinearGradient(0,0,0,fy);sk.addColorStop(0,'#141a2e');sk.addColorStop(1,'#2a2a3a');c.fillStyle=sk;c.fillRect(0,0,VW,VH);
  for(let i=0;i<40;i++)R(hsh(i,1,520)*VW,hsh(i,2,520)*fy*.4,1,1,'rgba(240,240,255,.5)');
  const hy=fy-96;R(0,hy,VW,6,'#3a3a46');R(0,hy,VW,1,'#5a5a66');for(let x=(mid%40+40)%40;x<VW;x+=40)R(x,hy+6,4,40,'#2a2a36');
  for(let i=0;i<3;i++){const t=((now/(5200+i*900))+i*.37)%1,x=i%2?t*VW:VW-t*VW;R(x,hy-2,3,2,i%2?'#fff0c0':'#ff4a3a');c.fillStyle=i%2?'rgba(255,240,190,.2)':'rgba(255,74,58,.18)';c.fillRect(x-6,hy-4,15,6)}
  R(0,hy+46,VW,fy,'#1a2420');for(let i=0;i<20;i++)R(hsh(i,3,520)*VW,hy+50+hsh(i,4,520)*30,6,1,'rgba(120,160,150,.25)');
  for(const x of[mid-104,mid+92]){R(x,hy+10,6,40,'#2a2420');for(let k=0;k<5;k++)R(x-6+k*3,hy+12,2,14+k%2*6,'#4a5a4a')}       // cypress knees and moss in the dark
  // the bait shop's back wall on the left: painted cinder block, the screen door, a bug light, a tin sign
  const wx=mid-120;K.cinderBlock(c,wx,mid-50,fy-140,fy,T,{painted:'#6a8a8a'});R(wx,fy-142,70,4,'#3a4a4a');
  R(wx+12,fy-80,26,80,'#2a2030');R(wx+14,fy-78,22,76,'#4a3a2a');for(let y=fy-76;y<fy-4;y+=3)R(wx+15,y,20,1,'rgba(200,200,200,.18)');R(wx+31,fy-42,3,4,'#c8a040');
  R(wx+44,fy-100,8,12,'#2a2030');R(wx+45,fy-98,6,8,'#c8a8ff');c.fillStyle='rgba(160,112,255,.18)';c.beginPath();c.arc(wx+48,fy-94,18,0,6.283);c.fill();
  R(wx+4,fy-128,40,18,'#e8e2d0');R(wx+4,fy-128,40,3,'#c8402e');K.signText(c,'LIVE BAIT',wx+7,fy-123,'#2a2030');K.signText(c,'ICE',wx+17,fy-117,'#2a6aa8');
  // live bait tanks on the right, bubbling
  for(const tx of[mid+48,mid+82]){R(tx,fy-44,30,40,'#2a3a3a');R(tx+2,fy-42,26,30,'#3a6a6a');R(tx+2,fy-42,26,3,'#6aa8a8');R(tx,fy-6,30,6,'#1a2424');
   for(let i=0;i<4;i++){const t=((now/900)+i/4)%1;R(tx+6+i*5,fy-14-t*26,2,2,'rgba(220,250,250,.7)')}}
  // the porch roof's string of bulbs, and the bulb right over his hat
  c.strokeStyle='#2a2030';c.lineWidth=1;c.beginPath();c.moveTo(0,10);c.quadraticCurveTo(mid,26,VW,10);c.stroke();
  for(let x=10;x<VW;x+=22){const y=10+(1-Math.pow((x-mid)/(VW/2),2))*8;R(x-1,y,3,4,Math.abs(x-mid)<14?'#2a2030':'#ffe8a8')}
  R(mid-1,0,2,12,'#2a2030');c.fillStyle='#fff2c8';c.beginPath();c.arc(mid,16,5,0,6.283);c.fill();
  c.fillStyle='rgba(255,236,190,.1)';c.beginPath();c.moveTo(mid-10,18);c.lineTo(mid+10,18);c.lineTo(mid+70,fy);c.lineTo(mid-70,fy);c.fill();
  // the porch rail behind him, the radio on it unplugged with its cord wrapped round
  R(0,fy-34,VW,4,'#6a5038');R(0,fy-34,VW,1,'#8a6a4a');for(let x=(mid%14+14)%14;x<VW;x+=14)R(x,fy-30,3,30,'#5a4030');
  const ra=K.prop(K.porchRadio(false),1);c.drawImage(ra.c,Math.round(mid+66-ra.ax),Math.round(fy-34-ra.ay+1));
  c.strokeStyle='#1a1418';c.beginPath();c.ellipse(mid+66,fy-44,11,6,0,0,6.283);c.stroke();R(mid+76,fy-40,2,6,'#1a1418');R(mid+75,fy-34,4,3,'#c8c0a8');
  R(0,fy-4,VW,VH,'#4a3626')},
 lift:3,
 front(c,v){const{VW,VH,fy,mid,now}=v,R=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))};
  // the porch floor and the plank table where the desk would be, its front boarded down like the back room's desk
  R(0,fy,VW,VH-fy,'#4a3626');for(let y=fy+6;y<VH;y+=7)R(0,y,VW,1,'#3a2a1e');
  R(mid-118,fy,236,10,'#8a6a4a');R(mid-118,fy,236,2,'#a88a6a');for(let x=mid-118;x<mid+118;x+=20)R(x,fy,1,10,'#6a4e36');R(mid-118,fy+10,236,3,'#3a2818');
  R(mid-114,fy+13,228,30,'#6a4e36');for(let y=fy+13;y<fy+43;y+=6){R(mid-114,y,228,1,'#7a5e44');R(mid-114,y+5,228,1,'#4a3424')}R(mid-114,fy+43,228,3,'#3a2818');
  for(const x of[mid-100,mid+86])R(x,fy+46,6,VH-fy-46,'#5a4030');
  // a newspaper with a spill of boiled crawfish, corn and potatoes, off to his left
  R(mid+40,fy-6,72,8,'#d8d0c0');R(mid+40,fy-6,72,1,'#f0e8d8');for(let x=mid+44;x<mid+108;x+=6)R(x,fy-4,3,1,'#8a8478');
  for(let i=0;i<14;i++){const x=mid+44+hsh(i,5,520)*60,y=fy-9+hsh(i,6,520)*5;R(x,y,5,3,'#c8402e');R(x,y,5,1,'#e8604a');R(x+4,y+1,2,1,'#a83020')}
  R(mid+80,fy-10,6,4,'#e8c840');R(mid+96,fy-9,5,4,'#c8a878');R(mid+30,fy-16,6,16,'#c8302e');R(mid+31,fy-20,4,4,'#e8e4d8');
  // the pot on its propane ring at the table's right end (his left), the blue flame, steam rising past the bulbs
  R(mid-112,fy-6,40,6,'#2a2a30');for(let i=0;i<6;i++)R(mid-108+i*6,fy-8+((now/90+i)|0)%2,3,2,'#5ad0ff');
  R(mid-114,fy-40,44,34,'#9a9aa4');R(mid-114,fy-40,44,3,'#c0c0c8');R(mid-80,fy-40,10,34,'#7a7a84');R(mid-118,fy-42,52,4,'#b0b0b8');R(mid-96,fy-48,10,6,'#7a7a84');
  for(let i=0;i<6;i++){const t=((now/1600)+i/6)%1,x=mid-92+Math.sin(t*5+i)*8,y=fy-50-t*44;c.fillStyle=`rgba(240,240,245,${(.35*(1-t)).toFixed(2)})`;c.beginPath();c.ellipse(x,y,4+t*8,2+t*4,0,0,6.283);c.fill()}
  R(mid-66,fy-20,12,20,'#f4f0e8');R(mid-66,fy-20,12,2,'#ffffff');R(mid-61,fy-22,2,22,'#c8c0b0');
  // under the table: a mesh sack of live crawfish, a bucket, rubber boots
  const by=fy+52;R(mid-92,by,34,26,'#8a3a2a');for(let x=mid-92;x<mid-58;x+=4)R(x,by,1,26,'#c85a3a');for(let y=by;y<by+26;y+=4)R(mid-92,y,34,1,'#c85a3a');R(mid-80,by-4,10,5,'#6a2a1e');
  R(mid-30,by+2,28,26,'#c8c8d0');R(mid-30,by+2,28,3,'#e8e8f0');R(mid-28,by+8,24,4,'#9a9aa4');R(mid-34,by-2,36,3,'#8a8a94');
  for(const x of[mid+30,mid+48]){R(x,by,12,24,'#e8e2d0');R(x,by,12,3,'#ffffff');R(x+8,by+18,10,6,'#e8e2d0');R(x,by+22,18,2,'#b8b0a0')}},
};

return{paint,props,folk,portraits,fx,onAir,porch,micGlint,FOLK,PORT,portraitCanvas};
})();
