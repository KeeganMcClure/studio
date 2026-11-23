// Black Lantern · cases/tracking-art.js · Tracking's art (spec 018 part A, Nov 23, 2026). Exposes window.TRKA.
// Art for this case only (Bible, Art, Direction: one case, one set of art); never reuse it in another case.
// Generic pieces come from the Shared Shelf (engine/shelf.js: v1, spec 012's street, cars and room pieces, and the winter,
// city street and old electronics kits spec 019 draws first here), painted with Black Lantern's palette. This file adds the
// case's own pieces (Fourth Street's motel, pawn shop, closed club and casino glow put together from Shelf walls, windows,
// signs and neon; the rooms; the club under dust; the dub room), the tape's tracking lines, its townsfolk on the map and in
// the dialog box, and Big Hat's briefing place, a dying casino's shut buffet.
// Reno in winter (spec 018, Art): grey slush and hard snow by day; at night neon magenta, casino gold and sodium on snow.
// No autumn, summer or spring pieces from the Shelf.
//
//   TRKA.paint(M)            the map's still layer -> {c, glows}; TRKA.props(M) its standing pieces, sorted with people
//   TRKA.folk(id, dir, idle, M)  a townsperson's map sprite -> {c, ax, ay}
//   TRKA.portraits           speaker name -> (ctx, mouth) drawing the 64 x 64 talking portrait
//   TRKA.fx(ctx, o)          the case's light and air after the light pass: snow, neon, sodium on snow, and the tape's
//                            tracking lines at the edges of the screen (G.flags.trk, 0 to 4)
//   TRKA.tracking(ctx, step, now)  the tracking lines alone (for any screen of the case)
//   TRKA.buffet              Big Hat's briefing place: {back, front} (engine.js bigHatScene)
//   TRKA.foilGlint           how the hidden hotspot looks while it shows
//
// Tracking's accent colors (Bible, Art, Palette), on top of the base palette:
const TRK_ACCENT={neon:'#ff3fa4',gold:'#f2c14e',sodium:'#ff9a3c',tape:'#7fa0c8',motel:'#3e7a7a',club:'#1e1622',foil:'#c8ccd4'};
window.TRKA=(()=>{
const K=SHELF,T=16,S=.5,{F,shade,hsh,RGB,art}=K,A=TRK_ACCENT;
const ART={};
const get=(k,spec)=>ART[k]||(ART[k]=K.prop(spec(),S));
const isNight=M=>M.light==='night';

// ================= GROUND =================
// 's' fresh snow, 'S' trodden snow, '~' slush on the road, ';' slush on the sidewalk, ',' a shoveled sidewalk, '_' the
// motel lot (slushy asphalt); rooms: 'n' lino, 'c' carpet, 'w' wood, 'v' tile, 'o' concrete; the club: 'k' its carpet
// under dust, 'd' the dance floor.
const dust=(c,x,y)=>hsh(x>>1,y>>1,501)<.18?shade(c,.12):c;
const GP={s:(x,y)=>K.snow(x,y,T,false),S:(x,y)=>K.snow(x,y,T,true),'~':(x,y)=>K.slush(x,y,T,false),';':(x,y)=>K.slush(x,y,T,true),',':(x,y)=>K.stoneSidewalk(x,y,T,false),
 '_':(x,y)=>K.slush(x,y+3,T,false),n:(x,y)=>K.floor(x,y,T,'lino'),c:(x,y)=>K.floor(x,y,T,'carpet'),w:(x,y)=>K.floor(x,y,T,'wood'),v:(x,y)=>K.floor(x,y,T,'tile'),
 o:(x,y)=>{const n=hsh(x>>1,y>>1,502);return n<.06?'#4a4850':n>.96?'#7a7880':['#5e5c62','#58565c','#636168'][(hsh(x,y,503)*3)|0]},
 k:(x,y)=>{const a=((x>>3)+(y>>3))%2,b=((x>>2)^(y>>2))&1;return dust(a?(b?'#3a1a32':'#2e1428'):(b?'#2a1a3a':'#24142e'),x,y)},
 d:(x,y)=>{const a=((x>>4)+(y>>4))%2,edge=x%16===0||y%16===0;return dust(edge?'#14101a':a?'#5a4a6a':'#3a3046',x,y)}};
const SOFT=new Set('sS'.split(''));
const at=(M,x,y)=>{const r=M.ground[y];return r?r[x]:undefined};

// ================= THE STILL LAYER =================
const still={};
function paint(M){
 const key=M.id+(M.light||'')+(M.variant||'');if(still[key])return still[key];
 const W=M.w*T,H=M.h*T,c=K.mk(W,H),g=c.getContext('2d'),img=g.createImageData(W,H),d=img.data,glows=[];
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const tx=(x/T)|0,ty=(y/T)|0;let ch=at(M,tx,ty);
  if(SOFT.has(ch)){const jx=Math.min(W-1,Math.max(0,x+((hsh(x>>1,y>>1,61)*5)|0)-2)),jy=Math.min(H-1,Math.max(0,y+((hsh(x>>1,y>>1,62)*5)|0)-2)),jc=at(M,(jx/T)|0,(jy/T)|0);if(jc!==undefined)ch=jc}
  const col=(GP[ch]||GP[','])(x,y),v=RGB(col),i=(y*W+x)*4;d[i]=v[0];d[i+1]=v[1];d[i+2]=v[2];d[i+3]=255}
 g.putImageData(img,0,0);
 M.pieces.filter(p=>PROPK.has(p.k)&&!NOSHADOW.has(p.k)).forEach(p=>{const cx=(p.x+p.w/2)*T+2,cy=(p.y+p.h)*T-2,rx=Math.max(5,p.w*T*.42);
  g.fillStyle='rgba(16,10,20,.28)';g.beginPath();g.ellipse(cx,cy,rx,Math.max(2.5,rx*.28),0,0,6.283);g.fill()});
 M.pieces.filter(p=>STILL[p.k]).sort((a,b)=>(BACK.has(a.k)?-99:a.y+a.h)-(BACK.has(b.k)?-99:b.y+b.h)).forEach(p=>STILL[p.k](g,p,M,glows));
 return still[key]={c,glows};
}
const BACK=new Set(['room','street','clubroom','vault']);
const shadowBelow=(g,x0,x1,fb)=>{g.fillStyle='rgba(16,10,20,.32)';g.fillRect(x0+3,fb,x1-x0,3);g.fillStyle='rgba(16,10,20,.16)';g.fillRect(x0+5,fb+3,x1-x0-2,2)};
function signOn(g,rect,text,col,ink,k=1){const[x,y,w,h]=rect,inner=K.signBlank(g,x,y,w,h,col);const tw=K.signWidth(text,k);
 K.signText(g,text,Math.round(inner[0]+(inner[2]-tw)/2),Math.round(inner[1]+(inner[3]-5*k)/2),ink,k)}
function neonOn(g,rect,text,col,on,k=1,glows){const[x,y,w,h]=rect,n=K.neonSign(g,x,y,w,h,col,on);const tw=K.signWidth(text,k);
 K.neonText(g,text,Math.round(n.inner[0]+(n.inner[2]-tw)/2),Math.round(n.inner[1]+(n.inner[3]-5*k)/2),col,on,k);if(on&&glows)glows.push(n.glow);return n}
// a snowy roof edge: a flat parapet with snow lying on it and icicles under it
function snowRoof(g,x0,x1,y,seed){F(g,x0-2,y,x1-x0+4,6,'#4a4652');F(g,x0-2,y+5,x1-x0+4,1,'#1c1820');K.icicles(g,x0-2,x1+2,y-1,T,{seed});for(let x=x0-2;x<x1+2;x+=1)F(g,x,y-3+((hsh(x>>2,seed,504)*3)|0),1,3,'#e8eef4')}
const STILL={
 // ---- FOURTH STREET's still layer: the north-side fronts, the street, the south sidewalk and the lot past it ----
 street(g,p,M,glows){const N=isNight(M),fb=7*T,ph=M.ph|0,dusk=M.light==='dusk';
  // the sky over the roofs (the casino's glow at night, a flat winter grey by day) and downtown's towers far behind
  for(let y=0;y<fb;y++){const k=y/fb;F(g,0,y,M.w*T,1,N?`rgb(${22+k*30|0},${14+k*10|0},${34+k*16|0})`:dusk?`rgb(${120+k*60|0},${110+k*40|0},${140-k*10|0})`:`rgb(${158-k*24|0},${164-k*24|0},${176-k*22|0})`)}
  skyline(g,M.w*T,fb,N,glows)
  motel(g,0,16*T,fb,N,glows);pawnshop(g,17*T,27*T,fb,N,glows,ph);vacant(g,27*T,32*T,fb,N);club(g,32*T,42*T,fb,N,glows,ph);casino(g,42*T,M.w*T,fb,N,glows);
  // the street itself: four lanes, the double yellow, a crosswalk by the bus stop, slush banked along both curbs
  K.cityStreet(g,0,M.w*T,10*T,T,{cross:[22*T,25*T],slush:true});
  // past the south sidewalk: a chain-link lot of plowed snow with a casino billboard
  K.chainLink(g,0,M.w*T,16*T+2,T,{post:3});
  billboard(g,28*T,18*T,N,glows)},
 room(g,p,M,glows){const W=M.w*T,H=M.h*T,kind=ROOMWALL[M.id]||['plain','#a89a80'];
  if(kind[0]==='paneling')K.paneling(g,T,W-T,0,3*T,kind[1],T);else K.innerWall(g,T,W-T,0,3*T,kind[0],kind[1],T);
  F(g,0,0,T,H,'#1e1826');F(g,T-2,0,2,H-T,'#3a3046');F(g,W-T,0,T,H,'#1e1826');F(g,W-T,0,2,H-T,'#2a2236');
  F(g,0,H-T,W,T,'#1e1826');F(g,T,H-T,W-2*T,2,'#3a3046');
  const dk=Object.keys(M.warps).find(k=>+k.split(',')[1]===M.h-1);if(dk){const[x]=dk.split(',').map(Number);F(g,x*T+1,H-T,T-2,T,'#6a4a3a');F(g,x*T+3,H-T+3,T-6,T-6,'#8a5a3a');for(let i=0;i<4;i++)F(g,x*T+4,H-T+5+i*2,T-8,1,'#5a3a2a')}
  (DECOR[M.id]||(()=>{}))(g,M,glows)},
 // the club under dust: black walls, a mirror strip, the pole stage at the top, the bar on the right, dust over all of it
 clubroom(g,p,M,glows){const W=M.w*T,H=M.h*T;
  F(g,T,0,W-2*T,3*T,'#1a1220');for(let x=T;x<W-T;x+=24)F(g,x,0,1,3*T,'#120c18');F(g,T,2*T,W-2*T,4,'#3a2a40');for(let x=T;x<W-T;x+=3)F(g,x,2*T,1,4,hsh(x,1,505)<.5?'#6a5a7a':'#4a3a5a');
  F(g,T,3*T-3,W-2*T,3,'#0e0a12');
  // the back hall's three doors, top right
  for(const dx of[20,22,24]){F(g,dx*T+2,T+2,12,2*T-2,'#2a1a1e');F(g,dx*T+3,T+3,10,2*T-4,'#3a2428');F(g,dx*T+10,2*T-2,2,2,'#8a7a5a')}
  K.signText(g,'PRIVATE',21*T+4,T-6,'#6a3a4a');neonOn(g,[2*T,T-2,4*T,12],'COCKTAILS',A.neon,true,1,glows);
  // the exit sign over the lobby door, still lit on its battery
  F(g,12*T+2,H-T-9,26,8,'#2a0a0a');K.signText(g,'EXIT',12*T+6,H-T-8,'#ff4a3a');glows.push([13*T+4,H-T-5,T*1.4,.35]);
  F(g,0,0,T,H,'#120c16');F(g,W-T,0,T,H,'#120c16');F(g,0,H-T,W,T,'#120c16');F(g,T,H-T,W-2*T,2,'#2a1e30');
  // the lobby door in the bottom wall
  F(g,13*T+1,H-T,T-2,T,'#3a2a30');F(g,13*T+3,H-T+3,T-6,T-6,'#4a3038');
  // cobwebs in the corners, dust drifts along the walls
  for(const[x,y,sx]of[[T,3*T,1],[W-T,3*T,-1]]){g.strokeStyle='rgba(200,200,210,.25)';g.lineWidth=1;for(let i=0;i<4;i++){g.beginPath();g.moveTo(x,y+i*5);g.lineTo(x+sx*(18-i*4),y);g.stroke()}}
  for(let i=0;i<60;i++){const x=T+hsh(i,1,506)*(W-2*T),y=3*T+hsh(i,2,506)*(H-4*T);F(g,x,y,1+hsh(i,3,506)*3,1,'rgba(200,190,200,.14)')}},
 vault(g,p,M,glows){const W=M.w*T,H=M.h*T;F(g,0,0,W,2*T,'#3a3434');for(let y=0;y<2*T;y+=8)F(g,0,y,W,1,'#2a2424');for(let x=0;x<W;x+=24)F(g,x,0,1,2*T,'#2a2424');
  F(g,0,2*T-2,W,2,'#1a1414');F(g,0,0,T,H,'#1c1818');F(g,W-T,0,T,H,'#1c1818');F(g,0,H-T,W,T,'#141010')},
 // the wall of VCRs in the dub room: every deck on, every little screen showing snow
 vcrwall(g,p,M,glows){const x0=p.x*T,x1=(p.x+p.w)*T;for(let y=2;y<2*T-4;y+=9)for(let x=x0+2;x<x1-20;x+=22){F(g,x,y,20,8,'#2a2a30');F(g,x,y,20,1,'#4a4a54');F(g,x+2,y+2,10,2,'#0a0a0c');F(g,x+14,y+2,4,3,'#ff3fa4')}
  glows.push([(x0+x1)/2,T,T*2.4,.3])},
};
// a single-story motel: rooms 7 to 12 along the front, the office with an awning and a VACANCY sign
function motel(g,x0,x1,fb,N,glows){const top=fb-3*T-10,rb=top+8,col=A.motel;
 F(g,x0,top,x1-x0,rb-top,'#5a5662');snowRoof(g,x0,x1,top,11);
 K.wall(g,x0,x1,rb,fb,'siding',shade(col,.1),T);
 for(let i=0;i<6;i++){const cx=(1+2*i)*T+8,lit=!N||[1,5].includes(i);const gl=K.numberDoor(g,cx,fb-.95*T,fb,['#c8a040','#a8323e'][i%2],7+i,T,{lit});if(gl&&N)glows.push(gl);
  const w=K.windowPane(g,cx+9,rb+10,12,12,T,true);if(lit&&N&&i!==5)glows.push([w[0],w[1],T*.9,.25]);if(i===5){F(g,cx+10,rb+11,10,10,A.foil);for(let k=0;k<10;k+=2)F(g,cx+10+k,rb+11+(k%4),2,2,'#a8acb4')}}
 // the office: a lit window, an awning, a small VACANCY neon (NO dark), an ice machine
 const ox=13*T;F(g,ox,rb,3*T,fb-rb,shade(col,-.12));K.wall(g,ox,ox+3*T,rb,fb,'siding','#c8b898',T);K.door(g,14*T+8,fb-.95*T,fb,'#3e5a6a',T);
 glows.push(K.windowPane(g,ox+2,rb+8,12,14,T,false));K.awning(g,ox-2,ox+3*T+2,rb+2,T);
 const v=neonOn(g,[ox+18,rb+12,24,9],'VACANCY',A.neon,N,1,glows);F(g,ox+18,rb+4,10,7,'#1a1218');K.signText(g,'NO',ox+20,rb+5,'#5a2a3a');
 K.signText(g,'OFFICE',ox+4,rb+3,'#2a2030');shadowBelow(g,x0,x1,fb)}
// Lucky Buck Pawn: brick, barred windows, a painted sign and a small WE BUY GOLD neon; Wes's stair door on the left; his
// two windows upstairs, covered in foil
function pawnshop(g,x0,x1,fb,N,glows,ph){const top=fb-5*T,shopOpen=ph===0;
 F(g,x0,top,x1-x0,6,'#4a4652');snowRoof(g,x0,x1,top,22);
 K.wall(g,x0,x1,top+6,fb,'brick',null,T);
 for(const wx of[x0+2*T+4,x0+5*T+4]){F(g,wx-1,top+15,22,18,'#2a1a1a');F(g,wx,top+16,20,16,A.foil);for(let i=0;i<20;i+=2)for(let j=0;j<16;j+=2)F(g,wx+i,top+16+j,2,2,hsh(i,j,507)<.5?'#d8dce4':'#a8acb4');F(g,wx-2,top+34,24,2,'#c8bfa8');if(N)glows.push([wx+10,top+24,T*.8,.2])}
 for(const wx of[x0+8*T-6]){K.windowPane(g,wx,top+16,16,16,T,true);if(!N)F(g,wx+1,top+17,14,14,'#5a6a7a')}
 // Wes's stair door
 K.door(g,x0+T+8,fb-.95*T,fb,'#5a4a3a',T);F(g,x0+T+3,fb-T-8,10,6,'#c8c0a8');K.signText(g,'418',x0+T+4,fb-T-8,'#2a2030');
 // the shop: sign band, barred windows, the door with a cage
 signOn(g,[x0+2.6*T,fb-2.1*T,4.4*T,13],'LUCKY BUCK PAWN','#e8c84a','#7a2a1a');
 glows.push(K.barredWindow(g,x0+3*T,fb-1.3*T,1.7*T,.9*T,T,shopOpen));glows.push(K.barredWindow(g,x0+7.2*T,fb-1.3*T,1.7*T,.9*T,T,shopOpen));
 K.door(g,x0+6*T+8,fb-.95*T,fb,'#3a3a44',T);if(!shopOpen){for(let x=x0+6*T+1;x<x0+7*T-1;x+=3)F(g,x,fb-.95*T,1,.95*T,'#8a8a94');F(g,x0+6*T,fb-.55*T,T,1,'#8a8a94')}
 neonOn(g,[x0+7.2*T,fb-2.1*T-1,1.7*T+2,13],'GOLD',A.gold,shopOpen,1,glows);
 shadowBelow(g,x0,x1,fb)}
// the vacant lot between the shop and the club: plowed snow behind a chain-link fence, the club's brick side wall
function vacant(g,x0,x1,fb,N){const top=fb-5*T+6;K.wall(g,x0,x1,top,fb-T,'brick',null,T);F(g,x0,top,x1-x0,fb-T-top,'rgba(20,14,24,.45)');snowRoof(g,x0,x1,top-4,27);
 // a faded painted ad on the wall: a cocktail glass, the words long gone
 F(g,x0+16,top+12,48,26,'rgba(200,160,120,.22)');F(g,x0+30,top+16,10,8,'rgba(255,79,163,.28)');F(g,x0+34,top+24,2,8,'rgba(255,79,163,.28)');F(g,x0+30,top+32,10,2,'rgba(255,79,163,.28)');K.signText(g,'COCKTAILS',x0+46-18,top+42,'rgba(240,230,210,.25)');
 K.chainLink(g,x0,x1,fb-T+1,T,{post:2})}
// Club Satin, closed since 1996: black front, a dead marquee, boarded windows, a chained double door
function club(g,x0,x1,fb,N,glows,ph){const top=fb-5*T-6,col=A.club;
 F(g,x0,top,x1-x0,fb-top,col);for(let y=top+4;y<fb;y+=3)F(g,x0,y,x1-x0,1,'#241a2a');snowRoof(g,x0,x1,top,33);
 // the marquee: a big dead neon box with CLUB SATIN, and the reader board under it with letters missing
 neonOn(g,[x0+2*T,top+10,6*T,18],'CLUB SATIN',A.neon,false,2);
 F(g,x0+2*T,top+30,6*T,12,'#e8e4d8');F(g,x0+2*T,top+30,6*T,1,'#ffffff');F(g,x0+2*T,top+41,6*T,1,'#8a8478');K.signText(g,'CL  SED',x0+2*T+30,top+33,'#2a2030');
 for(let x=x0+2*T;x<x0+8*T;x+=6)F(g,x,top+42,2,2,'#5a5248');
 // boarded windows either side, flyers on the boards
 for(const wx of[x0+6,x0+8*T+4]){F(g,wx,fb-1.4*T,20,18,'#5a4a3a');for(let y=fb-1.4*T;y<fb-1.4*T+18;y+=5)F(g,wx,y,20,4,'#7a6448');F(g,wx+4,fb-1.3*T,8,10,'#e8e0c8');F(g,wx+5,fb-1.3*T+2,6,1,'#a8323e')}
 // the double door, chained and padlocked (the chain's off on night 2)
 const dx=x0+4*T+8;F(g,dx-1,fb-1.2*T-1,2*T+2,1.2*T+1,'#0a080c');F(g,dx,fb-1.2*T,T-1,1.2*T,'#2a1a2a');F(g,dx+T+1,fb-1.2*T,T-1,1.2*T,'#2a1a2a');
 for(const k of[0,1]){F(g,dx+k*(T+1)+3,fb-1.1*T,T-7,6,'#3a2a3a');F(g,dx+k*(T+1)+(k?3:T-5),fb-.6*T,2,4,'#8a7a5a')}
 if(ph!==3){for(let x=dx+4;x<dx+2*T-4;x+=3)F(g,x,fb-.6*T+((x/3)|0)%2,2,2,'#9a9aa4');F(g,dx+T-3,fb-.55*T,6,6,'#c8a040');F(g,dx+T-2,fb-.7*T,4,3,'#c8a040')}
 F(g,dx-6,fb-2,2*T+12,2,'#3a3040');shadowBelow(g,x0,x1,fb)}
// the Paydirt casino at the street's east end: gold bulbs around its front, a big neon name, its glow on the snow
function casino(g,x0,x1,fb,N,glows){const top=0;F(g,x0,top,x1-x0,fb,'#3a2a1e');F(g,x0,fb-1.4*T,x1-x0,1.4*T,'#2a1e16');
 for(let x=x0+4;x<x1;x+=6){F(g,x,6,2,2,N?'#fff0b0':'#c8a040');F(g,x,fb-1.5*T,2,2,N?'#fff0b0':'#c8a040')}for(let y=6;y<fb-1.5*T;y+=6)F(g,x0+4,y,2,2,N?'#fff0b0':'#c8a040');
 neonOn(g,[x0+12,12,x1-x0-18,22],'PAYDIRT',A.gold,true,2,N?glows:null);neonOn(g,[x0+18,38,x1-x0-30,10],'SLOTS 24 HRS',A.neon,N,1,glows);
 // revolving doors, lit
 F(g,x0+30,fb-1.2*T,26,1.2*T,'#e8c84a');for(let k=0;k<3;k++)F(g,x0+32+k*8,fb-1.1*T,6,1.1*T-2,'#fff0c0');if(N)glows.push([x0+43,fb-.6*T,T*2.2,.5]);
 if(N)for(let i=0;i<4;i++)glows.push([x0+20+i*20,24,T*1.8,.35])}
function skyline(g,W,fb,N,glows){const base=fb-2*T;for(let x=0,i=0;x<W;i++){const w=30+hsh(i,1,514)*50,h=30+hsh(i,2,514)*60,c=N?'#1a1428':'#8a8e9c';F(g,x,base-h,w,h+2*T,c);F(g,x,base-h,w,2,N?'#241c34':'#9a9eac');
  for(let wy=base-h+6;wy<base;wy+=7)for(let wx=x+4;wx<x+w-4;wx+=6)if(hsh(wx,wy,515)<(N?.22:.1))F(g,wx,wy,2,3,N?'#e8c070':'#6a7080');x+=w+4+hsh(i,3,514)*10}
 if(N)for(let x=40;x<W;x+=210){F(g,x,base-92,2,2,'#ff3a3a');glows.push([x,base-92,10,.3])}}
function billboard(g,x,y,N,glows){F(g,x+20,y+20,4,3*T,'#3a3a44');F(g,x+120,y+20,4,3*T,'#3a3a44');F(g,x,y-10,150,40,'#1a1218');F(g,x+2,y-8,146,36,'#3a2a1e');
 F(g,x+2,y-8,146,36,N?'#4a3420':'#6a4a2e');K.signText(g,'PAYDIRT',x+8,y-2,A.gold,2);K.signText(g,'LOOSE SLOTS',x+8,y+12,'#f4efe6');F(g,x+110,y-4,28,26,A.gold);F(g,x+116,y+2,16,14,'#c89a2e');
 for(let i=0;i<150;i+=2)F(g,x+i,y-12+((hsh(i,1,508)*3)|0),2,2,'#e8eef4');if(N)glows.push([x+75,y+10,T*3,.3])}

// each room's wall: ['plain' | 'panel' | 'paneling', color]
const ROOMWALL={pawn:['paneling','#7a5a3a'],wes:['plain','#8a8a78'],room8:['paneling','#8a6a46'],room12:['paneling','#7a5a40'],gideon:['plain','#5a6a7a'],records:['plain','#9aa094']};
// each room's wall fittings
const DECOR={
 pawn(g,M,glows){// guitars on the wall, a NO REFUNDS sign, the cage on the right
  for(let i=0;i<4;i++){const x=2*T+i*20,c=['#c86a2a','#2a2a30','#a8323e','#d8b070'][i];g.fillStyle=c;g.beginPath();g.ellipse(x+8,30,7,9,0,0,6.283);g.fill();F(g,x+7,6,2,18,'#4a3424');F(g,x+5,4,6,4,'#2a2030');F(g,x+6,28,4,4,'#14101a')}
  signOn(g,[7*T,10,2.6*T,11],'NO REFUNDS','#f4efe6','#a8323e');
  F(g,11*T,4,4*T,2.6*T,'#2a2a30');for(let x=11*T;x<15*T;x+=4)F(g,x,4,1,2.6*T,'#8a8a94');for(let y=4;y<2.6*T+4;y+=4)F(g,11*T,y,4*T,1,'#6a6a74');
  for(let i=0;i<5;i++)F(g,11*T+6+i*11,18+(i%2)*8,8,6,['#c8a040','#6a6a74','#a8a8b0','#4a6a8a','#c8402e'][i]);
  glows.push([8*T,T,T*1.6,.25])},
 wes(g,M,glows){// two foil windows, and the three words on the wall in marker, again and again
  for(const wx of[2*T,8*T]){F(g,wx-1,.4*T-1,2*T+2,1.6*T+2,'#3a3020');for(let i=0;i<2*T;i+=2)for(let j=0;j<1.6*T;j+=2)F(g,wx+i,.4*T+j,2,2,hsh(i+wx,j,509)<.5?'#d8dce4':'#a0a4ac');F(g,wx,.4*T,2*T,1,'#c8a040')}
  for(let i=0;i<9;i++){const x=T+6+hsh(i,1,510)*(10*T-30),y=6+hsh(i,2,510)*30;if(x>2*T-6&&x<4*T+2&&y<34)continue;if(x>8*T-30&&x<10*T+2&&y<34)continue;K.signText(g,'WE KNOW',x,y,hsh(i,3,510)<.5?'#2a2030':'#5a1a22')}
  K.signText(g,'WE KNOW',5*T,12,'#2a2030',2)},
 room8(g){F(g,4*T,6,3*T,1.2*T,'#c8b088');F(g,4*T+2,8,3*T-4,1.2*T-4,'#5a7a8a');F(g,4*T+2,8+T*.6,3*T-4,1.2*T*.4,'#d8c8a0');g.fillStyle='#e8e0c8';for(let i=0;i<5;i++)F(g,4*T+6+i*8,10+(i%2)*3,3,3,'#e8e0c8')},
 room12(g){F(g,4*T,.4*T,2*T,1.4*T,'#3a3020');for(let i=0;i<2*T;i+=2)for(let j=0;j<1.4*T;j+=2)F(g,4*T+i,.4*T+j,2,2,hsh(i,j,511)<.5?'#c8ccd4':'#9a9ea6')},
 gideon(g){// the back wall is tapes: spines in rows from floor to ceiling, hand-lettered labels
  for(let y=4;y<3*T-4;y+=10)for(let x=T+2;x<(13-1)*T-2;x+=4){const c=['#1a1a20','#2a2a34','#e8e4d8','#3a2a2a'][(hsh(x,y,512)*4)|0];F(g,x,y,3,9,c);if(c!=='#e8e4d8')F(g,x,y+3,3,3,'#e8e4d8')}
  for(let y=13;y<3*T;y+=10)F(g,T,y,11*T,1,'#4a3424')},
 records(g,M,glows){F(g,6*T,6,4*T,12,'#e8e4d8');K.signText(g,'RECORDS',6*T+8,9,'#2a3446');for(let i=0;i<3;i++){F(g,T*(2+i*4),T+4,14,10,'#c8c0a8');F(g,T*(2+i*4)+2,T+6,10,1,'#8a8070')}glows.push([8*T,T,T*1.6,.25])}
};

// ================= STANDING PIECES =================
const SPEC={
 // the five-for-a-dollar bin: a cardboard box of tapes, a hand-lettered sign
 bin:()=>({size:[44,40,0,0],anchor:[22,38],lights:[],draw({R}){R(2,14,40,24,'#a8885a',{sh:10});R(2,14,40,2,'#c8a87a');for(let i=0;i<8;i++)R(5+i*4.5,8+(i%3)*2,4,8,i%3===1?'#e8e4d8':'#1a1a20');R(8,0,28,12,'#f4efe6');R(8,0,28,2,'#d8d0b8')}}),
 // the glass counter: watches, rings and a pistol under glass
 glasscase:()=>({size:[96,40,0,0],anchor:[48,38],lights:[[48,14,1.2,.25]],draw({R}){R(0,10,96,28,'#4a3424',{sh:12});R(2,4,92,14,'#a8d0d8');R(2,4,92,2,'#e8f8ff');R(2,16,92,2,'#6a8a90');
  for(let i=0;i<10;i++)R(6+i*9,9,5,4,['#c8a040','#e8e4d8','#c8a040','#2a2a30'][i%4]);R(4,20,88,2,'#2a1e16');R(0,36,96,2,'#2a1e16')}}),
 chair:()=>({size:[22,40,0,0],anchor:[11,38],lights:[],draw({R}){R(3,0,16,14,'#5a5a64',{sh:3});R(2,16,18,5,'#6a6a74',{sh:3});R(3,21,2,17,'#3a3a44');R(17,21,2,17,'#3a3a44');R(4,12,14,6,'#7a3a4a')}}),
 // the viewing chair: a brown recliner angled at the TVs
 recliner:()=>({size:[36,44,0,0],anchor:[18,42],lights:[],draw({R}){const c='#5a3a2a';R(4,0,28,20,c,{sh:8});R(0,14,8,22,shade(c,-.1),{sh:3});R(28,14,8,22,shade(c,-.15));R(6,20,24,14,shade(c,.08),{sh:6});R(6,34,24,6,shade(c,-.3))}}),
 mattress:()=>({size:[64,30,0,0],anchor:[32,28],lights:[],draw({R}){R(0,6,64,20,'#d8d0b8',{sh:12});R(0,6,64,2,'#f0e8d8');R(4,8,16,8,'#f4efe6');R(26,10,34,14,'#4a5a8a');R(26,10,34,2,'#6a7aaa');R(0,26,64,2,'#8a8070')}}),
 crate:()=>({size:[30,22,0,0],anchor:[15,20],lights:[],draw({R}){R(1,2,28,18,'#2a5a8a',{sh:6});for(let x=4;x<28;x+=6)R(x,4,3,14,'#1a3a5a');R(1,2,28,2,'#4a7aaa')}}),
 hotplate:()=>({size:[30,40,0,0],anchor:[15,38],lights:[],draw({R}){R(2,16,26,22,'#6a4a32',{sh:6});R(4,10,22,6,'#2a2a30');R(7,11,6,3,'#c8402e');R(17,11,6,3,'#5a5a64');R(6,4,10,6,'#8a8a94')}}),
 nightstand:()=>({size:[26,34,0,0],anchor:[13,32],lights:[[13,2,.9,.3]],draw({R}){R(2,12,22,20,'#6a4a32',{sh:6});R(2,12,22,2,'#8a6a4a');R(6,20,14,2,'#3a2a1a');R(10,0,6,10,'#e8d8a0');R(11,10,4,3,'#3a3a44')}}),
 dresser:()=>({size:[64,30,0,0],anchor:[32,28],lights:[],draw({R}){R(2,2,60,26,'#6a4a32',{sh:12});R(2,2,60,2,'#8a6a4a');for(const y of[8,17])R(6,y,52,6,'#5a3a24');for(const y of[10,19])R(30,y,4,2,'#c8a040')}}),
 heater:()=>({size:[36,20,0,0],anchor:[18,18],lights:[[18,8,.8,.25]],draw({R}){R(1,2,34,16,'#c8c4b8',{sh:8});for(let x=4;x<32;x+=3)R(x,5,2,8,'#8a8a8a');R(26,4,6,3,'#ff7a3a')}}),
 fiche:()=>({size:[40,50,0,0],anchor:[20,48],lights:[[20,14,1.1,.4]],draw({R}){R(2,30,36,18,'#6a6a64',{sh:8});R(4,2,32,28,'#4a4a44',{sh:8});R(7,5,26,20,'#a8f0c8');R(7,5,26,3,'#d8fff0');for(let y=10;y<24;y+=3)R(9,y,20,1,'#4a8a6a')}}),
 tvstack:()=>({size:[48,70,0,0],anchor:[24,68],lights:[[24,20,1.2,.35],[24,44,1.2,.35]],draw({R}){R(2,54,44,14,'#3a2a1e',{sh:10});for(const y of[6,30]){R(3,y,42,24,'#2a2a30',{sh:6});R(6,y+3,32,18,'#5a6a8a');for(let k=y+4;k<y+20;k+=2)R(6,k,32,1,'#4a5a7a');R(40,y+18,3,2,'#c8402e')}}}),
 // the dance floor's pole stage: a low round stage, the pole, a dead light rig over it
 stage:()=>({size:[128,64,0,0],anchor:[64,62],lights:[[64,30,2.6,.3]],draw({R,E}){E(64,42,62,18,'#14101a');E(64,40,60,16,'#3a2a3a');E(64,38,58,14,'#4a3a4a');R(62,0,4,40,'#c8c8d0');R(63,0,1,40,'#f4f4f8');
  for(let i=0;i<5;i++)R(20+i*22,46+(i%2)*3,4,2,'rgba(200,190,200,.4)')}}),
 bar:()=>({size:[160,44,0,0],anchor:[80,40],lights:[],draw({R}){R(0,10,160,30,'#2a1a1a',{sh:20});R(0,6,160,6,'#5a3a2a');R(0,6,160,1,'#8a5a3a');for(let x=8;x<156;x+=20)R(x,18,12,14,'#3a2424');for(let i=0;i<8;i++)R(10+i*18,0,4,7,['#3a5a3a','#5a3a2a','#8a8a94'][i%3])}}),
 booth:()=>({size:[64,40,0,0],anchor:[32,38],lights:[],draw({R}){R(0,2,64,20,'#5a1a2a',{sh:12});R(0,2,64,3,'#7a2a3a');R(6,22,52,14,'#2a1a1a');R(10,18,44,6,'#3a2a2a');R(14,10,8,10,'#4a4a54');R(40,12,6,8,'#4a4a54')}}),
 djbooth:()=>({size:[64,50,0,0],anchor:[32,48],lights:[],draw({R}){R(0,18,64,30,'#1a1a20',{sh:14});R(0,14,64,6,'#3a3a44');R(6,8,20,8,'#2a2a30');R(36,8,20,8,'#2a2a30');R(14,9,4,4,'#4a4a54');R(44,9,4,4,'#4a4a54');R(4,24,56,2,'#ff3fa4')}}),
 coatcheck:()=>({size:[64,50,0,0],anchor:[32,48],lights:[],draw({R}){R(0,20,64,28,'#3a2a2a',{sh:14});R(0,18,64,4,'#5a3a2a');R(4,0,2,20,'#8a8a94');R(58,0,2,20,'#8a8a94');R(4,2,56,2,'#8a8a94');for(let x=10;x<56;x+=8)R(x,4,4,10,'#5a5a64');R(20,24,24,6,'#e8e4d8')}}),
 tables:()=>({size:[40,44,0,0],anchor:[20,42],lights:[],draw({R,E}){E(20,22,16,6,'#3a2a2a');R(18,24,4,16,'#2a1a1a');R(10,40,20,2,'#2a1a1a');R(6,2,10,18,'#5a4a4a');R(24,2,10,18,'#5a4a4a');R(6,2,10,2,'#7a6a6a');R(24,2,10,2,'#7a6a6a')}}),
 bench:()=>({size:[64,30,0,0],anchor:[32,28],lights:[],draw({R}){R(0,8,64,8,'#6a4a32',{sh:12});R(0,8,64,2,'#8a6a4a');R(4,16,4,12,'#3a2a1a');R(56,16,4,12,'#3a2a1a');R(30,0,14,8,'#3a3a44');R(32,1,10,2,'#ff3fa4');R(10,2,10,6,'#e8e4d8');R(12,3,6,1,'#5a1a22')}}),
 notebook:()=>({size:[22,16,0,0],anchor:[11,14],lights:[],draw({R}){R(1,2,20,12,'#5a2a1e',{sh:4});R(3,4,16,8,'#e8dcc0');R(10,4,1,8,'#8a7a5a')}})
};
const PROPK=new Set(['lamp','car','snowbank','busstop','hydrant','polesign','tree','bin','glasscase','shelf','crt','vcr','tape','counter','desk','bed','chair','recliner','mattress','crate','hotplate','nightstand','dresser','heater','fridge','fiche','tvstack','stage','bar','booth','djbooth','coatcheck','tables','bench','notebook','boxes','dumpster']);
const NOSHADOW=new Set(['vcr','tape','notebook']);
function props(M){
 const out=[],N=isNight(M);
 const add=(a,fx,fy,p,o={})=>{const X=Math.round(fx-a.ax),Y=Math.round(fy-a.ay);
  out.push(Object.assign({tx:p.x,ty:p.y,x:fx,y:fy,top:Y,draw:(c,ox,oy)=>c.drawImage(a.c,X+ox,Y+oy),
   lights:(a.lights||[]).map(([lx,ly,r,al])=>[X+a.sx(lx),Y+a.sy(ly),r*T,al,!!o.pool])},o.extra||{}))};
 const dyn=(p,fx,fy,top,draw,o={})=>out.push(Object.assign({tx:p.x,ty:p.y,x:fx,y:fy,top,draw,lights:o.lights||[]},o.extra||{}));
 for(const p of M.pieces){if(!PROPK.has(p.k))continue;const cx=(p.x+p.w/2)*T,fy=(p.y+p.h)*T-2;
  switch(p.k){
  case'lamp':add(get('lamp',()=>K.LAMP),cx,fy+1,p,{pool:true,extra:{sodium:[cx,fy-2]}});if(N)out[out.length-1].lights.push([cx,fy-2,1.8*T,.4,true]);else out[out.length-1].lights=[];break;
  case'car':{const a=get('car'+p.tint,()=>K.sedan('side',p.tint||'cloth'));add(a,cx,fy,p);const X=Math.round(cx-a.ax),Y=Math.round(fy-a.ay),w=a.c.width;
   out[out.length-1].draw=(c,ox,oy)=>{c.drawImage(a.c,X+ox,Y+oy);for(let i=6;i<w-6;i+=2)F(c,X+ox+i,Y+oy+8+((hsh(i,p.x,513)*3)|0),2,3,'#e8eef4')};break}  // snow on the roof
  case'snowbank':add(get('bank'+p.w,()=>K.snowbank(p.w)),cx,fy,p);break;
  case'busstop':{const a=get('bus',()=>K.BUSSTOP);if(!a.named){a.named=1;const g=a.c.getContext('2d'),[sx,sy]=K.BUSSTOP_SIGN,X=a.sx(sx),Y=a.sy(sy);K.signText(g,'12',X+1,Y+1,'#2a4a8a');F(g,X+1,Y+7,7,1,'#a8323e')}add(a,cx,fy,p);break}
  case'hydrant':add(get('hyd',()=>K.hydrant()),cx,fy,p);break;
  case'polesign':{const a=get('pole',()=>K.poleSign(64,40,A.motel));if(!a.named){a.named=1;const g=a.c.getContext('2d'),X=a.sx(4),Y=a.sy(4);
    K.signText(g,'STARLITE',X+2,Y+2,'#a8323e');K.signText(g,'MOTOR',X+6,Y+9,'#2a4a6a');K.signText(g,'LODGE',X+6,Y+15,'#2a4a6a')}
   add(a,cx,fy,p);if(!N)out[out.length-1].lights=[];break}
  case'bin':add(get('bin',SPEC.bin),cx,fy,p);break;
  case'glasscase':add(get('glass',SPEC.glasscase),cx,fy,p);break;
  case'shelf':add(get('shelf'+p.w,()=>K.shelving(true,p.w*30)),cx,fy,p);break;
  case'crt':{const on=!!p.on;if(!on){add(get('crt0',()=>K.crtTV(false)),cx,fy,p);break}
   const fr=[0,1,2,3].map(f=>get('crt1'+f,()=>K.crtTV(true,f)));const a=fr[0],X=Math.round(cx-a.ax),Y=Math.round(fy-a.ay);
   dyn(p,cx,fy,Y,(c,ox,oy)=>c.drawImage(fr[Math.floor(performance.now()/110)%4].c,X+ox,Y+oy),{lights:[[cx,fy-12,1.3*T,.4]]});break}
  case'vcr':{const a=get('vcr'+(p.tape?1:0),()=>K.vcr(!!p.tape));add(a,cx,p.y*T+(p.dy|0),p);break}
  case'tape':{const a=get('tape',()=>K.vhsTape('#f4efe6'));if(!a.named){a.named=1;const g=a.c.getContext('2d');F(g,a.sx(7),a.sy(7),5,1,'#a8323e');F(g,a.sx(7),a.sy(9),8,1,'#2a2030')}add(a,cx,p.y*T+(p.dy|0),p);break}
  case'counter':add(get('counter'+p.w,()=>K.counter(p.w)),cx,fy+10,p);break;
  case'desk':add(get('desk',()=>K.DESK),cx,fy,p);break;
  case'bed':add(get('bed',()=>K.BED),cx+2,fy,p);break;
  case'fridge':{const a=get('fridge',()=>K.kitchen('fridge'));if(!a.named){a.named=1;const g=a.c.getContext('2d'),[fx,fy2]=K.FRIDGE_FRONT;K.signText(g,'WE',a.sx(fx)+2,a.sy(fy2)+1,'#2a2030');K.signText(g,'KNOW',a.sx(fx),a.sy(fy2)+7,'#2a2030')}add(a,cx,fy,p);break}
  case'boxes':add(get('box'+(p.v|0),()=>K.boxes(p.v|0)),cx,fy,p);break;
  case'dumpster':add(get('dump',()=>K.dumpster(false,'#3e5a4a')),cx,fy,p);break;
  case'stage':add(get('stage',SPEC.stage),cx,fy,p,{pool:true});break;
  case'bar':add(get('bar',SPEC.bar),cx,fy,p);out[out.length-1].lights.push([cx-30,fy-30,1.6*T,.35,true]);break;
  default:if(SPEC[p.k])add(get(p.k,SPEC[p.k]),cx,fy,p);
  }}
 return out}

// ================= LIGHT AND AIR =================
// Outside: snow falling (light by day, heavier at night), at night the neon and the casino glow bleeding magenta and gold
// onto the snow and sodium orange under the lamps. Inside, the lantern's warm pool at night. Then the tape's tracking lines.
const OUTDOOR=new Set(['street']);
function fx(ctx,o){const M=o.M,now=o.now,N=isNight(M);
 if(OUTDOOR.has(M.id)){
  if(N){const pools=(M.props||[]).filter(p=>p.sodium).map(p=>[p.sodium[0]-o.camx,p.sodium[1]+20-o.camy,44]);K.sodium(ctx,pools,now);
   // neon bleeding onto the snowbanks and the sidewalk: magenta from the club side and the motel's sign, gold from the casino
   ctx.globalCompositeOperation='lighter';
   for(const[x,y,r,col]of[[15*T,6*T,70,'255,63,164'],[24*T,6*T,60,'242,193,78'],[45*T,7*T,140,'242,193,78'],[37*T,6*T,40,'255,63,164']]){const X=x-o.camx,Y=y-o.camy,gr=ctx.createRadialGradient(X,Y,0,X,Y,r);gr.addColorStop(0,`rgba(${col},.16)`);gr.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=gr;ctx.fillRect(X-r,Y-r,r*2,r*2)}
   ctx.globalCompositeOperation='source-over'}
  K.snowfall(ctx,now,{k:N?.55:.3,wind:.4})}
 if(N)lantern(ctx,o);
 tracking(ctx,(G.flags&&G.flags.trk)|0,now)}
function lantern(ctx,o){const lx=G.px+8-o.camx,ly=G.py+6-o.camy,lr=58;ctx.globalCompositeOperation='multiply';let gr=ctx.createRadialGradient(lx,ly,0,lx,ly,lr);
 gr.addColorStop(0,'rgba(240,196,120,.6)');gr.addColorStop(1,'rgba(240,196,120,0)');ctx.fillStyle=gr;ctx.fillRect(lx-lr,ly-lr,lr*2,lr*2);
 ctx.globalCompositeOperation='lighter';gr=ctx.createRadialGradient(lx,ly,0,lx,ly,lr*.5);gr.addColorStop(0,'rgba(214,164,58,.12)');gr.addColorStop(1,'rgba(214,164,58,0)');ctx.fillStyle=gr;ctx.fillRect(lx-lr,ly-lr,lr*2,lr*2);
 ctx.globalCompositeOperation='source-over'}

// ================= THE TRACKING LINES (case art, spec 019: it carries the case's story) =================
// The tape's look creeping in at the edges of the screen, one step per watch (0 = none, 4 = most). It stays in bands at
// the top and bottom (and, from step 3, thin strips at the sides), so the lead in the middle stays clear; the map HUD is
// drawn after it and the dialog box sits over the canvas, so text never wobbles. Steps:
//  1 · a faint rolling bar drifts down the screen, a thin band of tape noise along the bottom edge
//  2 · torn lines at the top and bottom: rows slide sideways a pixel or two, a washed-out blue creeps in, speckles
//  3 · deeper bands, a magenta and cyan fringe on the torn rows, thin noise strips at the sides, a tear across now and then
//  4 · the head-switch band: a hard, jittering stripe of noise along the bottom, and the washed-out blue over the edges
const TRK={c:null};
const DEPTH=[0,8,16,26,36];
function tracking(ctx,step,now){step=Math.max(0,Math.min(4,step|0));if(!step)return;const cv=ctx.canvas,w=cv.width,h=cv.height,d=DEPTH[step],t=(now/90)|0;
 if(!TRK.c||TRK.c.width!==w||TRK.c.height!==h)TRK.c=K.mk(w,h);const b=TRK.c.getContext('2d');b.clearRect(0,0,w,h);b.drawImage(cv,0,0);
 // the rolling bar: a soft band brighter and greyer, drifting down about once every seven seconds
 const ry=((now/7000)%1)*(h+40)-20;ctx.fillStyle=`rgba(200,210,230,${(.035+step*.012).toFixed(3)})`;ctx.fillRect(0,Math.round(ry),w,6);ctx.fillStyle='rgba(10,10,20,.05)';ctx.fillRect(0,Math.round(ry)+6,w,3);
 const band=(y0,y1,fromEdge)=>{for(let y=y0;y<y1;y++){const e=fromEdge(y),k=1-e/d;if(k<=0)continue;const n=hsh(y,t,601);
   if(step>=2&&n<.25+k*.35){const dx=Math.round((hsh(y,t,602)-.5)*2*(1+step*k*1.4));if(dx){ctx.drawImage(TRK.c,0,y,w,1,dx,y,w,1);
     if(step>=3){ctx.fillStyle=`rgba(255,63,164,${(.22*k).toFixed(2)})`;ctx.fillRect(dx>0?0:w+dx,y,Math.abs(dx)+1,1);ctx.fillStyle=`rgba(63,240,232,${(.18*k).toFixed(2)})`;ctx.fillRect(dx>0?w-dx:0,y,Math.abs(dx)+1,1)}}}
   ctx.fillStyle=`rgba(127,160,200,${(.06*step*k).toFixed(3)})`;ctx.fillRect(0,y,w,1);
   const sp=Math.round(w*.02*step*k);ctx.fillStyle=`rgba(230,236,246,${(.25+.35*k).toFixed(2)})`;for(let i=0;i<sp;i++)ctx.fillRect((hsh(i,y*31+t,603)*w)|0,y,1+(hsh(i,y,604)<.2?1:0),1)}};
 band(0,d,y=>y);band(h-d,h,y=>h-1-y);
 if(step>=3){const sw=step===3?5:8;for(let y=d;y<h-d;y+=2){const n=hsh(y,t,605);if(n<.5)continue;ctx.fillStyle=`rgba(220,228,240,${n<.8?.18:.32})`;ctx.fillRect(((hsh(y,t,606)*sw)|0),y,1,1);ctx.fillRect(w-1-((hsh(y,t,607)*sw)|0),y,1,1)}
  ctx.fillStyle='rgba(127,160,200,.08)';ctx.fillRect(0,d,sw,h-2*d);ctx.fillRect(w-sw,d,sw,h-2*d);
  if(hsh((now/1800)|0,step,608)<.45&&(now%1800)<110){const ty=d+((hsh((now/1800)|0,2,608)*(h-2*d))|0);ctx.drawImage(TRK.c,0,ty,w,2,4,ty,w,2)}}
 if(step>=4){const hy=h-7+((hsh(t,1,609)*3)|0);for(let x=0;x<w;x+=2){const v=hsh(x,t,610);ctx.fillStyle=v<.4?'#e6ecf6':v<.75?'#7a8aa8':'#1a1a2a';ctx.fillRect(x,hy,2,2)}ctx.drawImage(TRK.c,0,hy-4,w,4,6,hy-4,w,4)}}

// the hidden hotspot, while the lead is High on Mushrooms: the foil's crinkles catch light like a wall of eyes, a row of
// them blinking in time with the tape
function foilGlint(c,x,y,now){const a=.35+.2*Math.sin(now/500),blink=Math.floor(now/900)%4===0;
 for(let i=0;i<6;i++){const ex=x-10+(i%3)*9,ey=y-6+((i/3)|0)*8;c.fillStyle=`rgba(244,239,230,${a.toFixed(2)})`;c.fillRect(ex,ey,5,blink&&i<3?1:3);if(!(blink&&i<3)){c.fillStyle='rgba(30,20,40,.8)';c.fillRect(ex+2,ey+1,1,1)}}}

// ================= TOWNSFOLK ON THE MAP =================
// The Shared Shelf's person template (shared-sprites-person-v1, method v1), at the agents' size; hair from agent-sprite.js.
// About 1 in 3 has a weird trait (Art, Townsfolk): Manny's loupe, Luz's cockatiel, Gideon's white gloves, Ines's pencils.
const {SKIN}=window.BL;
const FOLK={
 manny:{look:{skin:2,hair:3,hairC:0,acc:3},top:'#7a2a3a',inner:'#e8e4d8',pants:'#3a3446',shoes:'#2a1e18',iris:'#3a2418',mouth:'smile',loupe:1,
  body:(A_,ty)=>{const{R}=A_;R(7,ty+2,2,12,'#c8a040');R(19,ty+2,2,12,'#c8a040')}},
 wes:{look:{skin:0,hair:6,hairC:3,acc:0},top:'#3a4a5a',pants:'#3a3a44',shoes:'#e8e4d8',iris:'#4a6a8a',mouth:'flat',
  body:(A_,ty,sw)=>{const{R}=A_;R(10,ty+3,8,3,shade('#3a4a5a',-.3));R(3,ty+10+sw,4,4,'#f4efe6')}},
 luz:{look:{skin:3,hair:1,hairC:0,acc:0},top:'#c8402e',coat:1,inner:'#e8e0c8',pants:'#2a2a34',shoes:'#2a1e18',iris:'#3a2418',mouth:'flat',bird:1,
  body:(A_,ty)=>{const{R}=A_;R(6,ty,16,2,'#e8e0c8')}},
 travis:{look:{skin:1,hair:2,hairC:2,acc:4},top:'#4a6a3a',pants:'#4a4a54',shoes:'#3a2a1e',iris:'#5a7a8a',mouth:'flat',
  body:(A_,ty)=>{const{R}=A_;for(let y=ty+2;y<ty+15;y+=4)R(6,y,16,1,'#2a3a2a');R(13,ty,2,16,'#2a3a2a')}},
 gideon:{look:{skin:0,hair:3,hairC:5,acc:1},top:'#8a6a4a',coat:1,inner:'#e8e4d8',pants:'#4a4038',shoes:'#2a1e18',iris:'#4a6a3a',mouth:'flat',gloves:1,
  body:(A_,ty)=>{const{R}=A_;R(12,ty,4,7,'#2a4a6a')}},
 teri:{look:{skin:4,hair:4,hairC:1,acc:0},top:'#2a3456',coat:1,inner:'#5a6a8a',pants:'#1e2440',shoes:'#141018',iris:'#2a1a14',mouth:'flat',cap:'#1e2440',
  body:(A_,ty)=>{const{R}=A_;R(16,ty+3,3,3,'#e8c84a');R(6,ty+14,16,2,'#141018')}},
 cherry:{look:{skin:1,hair:1,hairC:4,acc:0},top:'#5a3a5a',coat:1,inner:'#e88aa8',pants:'#e88aa8',shoes:'#f4efe6',iris:'#4a6a3a',mouth:'smile',cheeks:1,
  body:(A_,ty)=>{const{R}=A_;R(11,ty+8,6,8,'#f4efe6')}},
 ines:{look:{skin:3,hair:4,hairC:0,acc:1},top:'#5a8a7a',pants:'#3a3446',shoes:'#2a1e18',iris:'#3a2418',mouth:'smile',pencils:1,
  body:(A_,ty)=>{const{R}=A_;R(7,ty+8,4,4,shade('#5a8a7a',-.25));R(17,ty+8,4,4,shade('#5a8a7a',-.25));R(8,ty+6,1,3,'#f4d040');R(18,ty+6,1,3,'#f4d040')}}
};
// what the template lacks: a cap, Manny's loupe, Luz's cockatiel, Gideon's gloves, Ines's pencils
function topper(Ad,F_,dir){const{R,C}=Ad;
 if(F_.cap){const c=F_.cap,cd=shade(c,-.3);if(dir==='up'){R(5,0,18,7,c,{sh:3})}else if(dir==='side'){R(6,-1,17,7,c,{sh:3});R(0,5,8,2,cd)}
  else{R(5,-1,18,7,c,{sh:3});R(5,6,18,2,cd);R(12,1,4,3,'#e8c84a')}}
 if(F_.loupe&&dir!=='up'){const x=dir==='side'?3:15;R(x,10,6,6,'#2a2a30');R(x+1,11,4,4,'#a8d0e8');R(x+1,9,4,1,'#c8a040')}
 if(F_.bird){const x=dir==='side'?14:dir==='up'?18:19,y=18;R(x,y,6,6,'#c8c8c8',{sh:2});C(x+3,y-1,3,'#f0d040');R(x+4,y-6,1,4,'#f0d040');R(x+2,y-2,1,1,'#14101a');R(x+3,y,2,1,'#e88a3a');R(x+1,y+6,2,5,'#a8a8a8')}
 if(F_.gloves){R(3,37,4,4,'#f4f4f4');R(21,37,4,4,'#e4e4e4')}
 if(F_.pencils&&dir!=='side'){R(6,0,2,7,'#f4d040');R(6,0,2,1,'#e8a0a0');R(20,1,2,6,'#f4d040');R(20,1,2,1,'#2a2030')}}
const fcache=new Map();
function folk(id,dir,idle=0,M){
 const k=id+dir+idle;let v=fcache.get(k);if(v)return v;
 if(dir==='right'){const l=folk(id,'left',idle,M),c=K.mk(l.c.width,l.c.height),g=c.getContext('2d');g.translate(c.width,0);g.scale(-1,1);g.drawImage(l.c,0,0);v={c,ax:c.width-l.ax,ay:l.ay}}
 else{const F_=FOLK[id]||FOLK.manny,d=dir==='left'?'side':dir,L=F_.look,sk=SKIN[L.skin];
  const sp=Object.assign({skin:sk,hair:sk,hairStyle:'cropped',iris:F_.iris||'#3a2418'},F_);
  const a=art(40,90,6,30,F_.s||S,Ad=>{K.drawChar(Ad,sp,d,0,idle);BLA.extras(Ad,{look:L},dir,0);topper(Ad,F_,d)});
  v={c:a.c,ax:a.sx(14),ay:a.sy(50)}}
 fcache.set(k,v);return v;
}

// ================= PORTRAITS (64 x 64, Storybook faces, Lantern Bust box) =================
// The Asset Library's portrait kit (as in the other cases): drawn pixel by pixel in a layer, then a light rim on the lit
// edges and a dark outline. Each sits on a lit backing.
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
const glasses=(L,c,y=27)=>{for(const x of[19,35]){L.r(x,y,10,1,c);L.r(x,y+8,10,1,c);L.r(x,y,1,9,c);L.r(x+9,y,1,9,c)}L.r(29,y+2,6,1,c)};

const PORT={
// Manny Saldaña: owns Lucky Buck Pawn, fifties, bald on top with a black fringe and a short beard, a maroon sweater vest
// over a white shirt, gold chains, and a jeweler's loupe screwed into his right eye that he never takes out (his weird trait)
MANNY:{bg:'#3a2a24',f(L,t){const s='#c98e62',hc='#1b1414',u='#7a2a3a';
 body(L,'#e8e4d8');L.r(12,52,14,12,u);L.r(38,52,14,12,u);L.r(26,48,12,4,sh(s,-30));for(const[x,y]of[[26,52],[28,55],[30,57],[34,57],[36,55],[38,52]])L.r(x,y,2,2,'#e8c050');
 ears(L,s);head(L,32,31,15,15,s);L.r(17,24,3,10,hc);L.r(44,24,3,10,hc);L.e(32,42,12,6,sh(hc,10));L.e(32,40,8,3,s);
 eye(L,21,28,'#3a2418',-1);L.e(40,31,7,7,'#2a2a30');L.e(40,31,5,5,'#a8d0e8');L.e(39,30,2,2,'#e8f8ff');L.r(36,23,8,2,'#c8a040');L.r(44,31,3,1,'#c8a040');
 brows(L,hc,25,1);nose(L,s,36);L.r(27,38,10,2,sh(hc,10));if(t)mouth(L,32,41,8,true);else{L.r(28,42,8,1,MR);L.p(27,41,MR);L.p(36,41,MR)}}},
// Wes Pratt: the clerk, 23, pale, a mop of blond curls, hollow eyes that haven't slept, a hoodie, marker on his fingers
WES:{bg:'#26303a',f(L,t){const s='#f6d7b8',hc='#d8b25a',u='#3a4a5a';
 body(L,u);L.r(24,46,16,5,sh(u,-28));L.r(26,50,1,10,'#c8c0b0');L.r(37,50,1,10,'#c8c0b0');L.r(8,54,8,6,s);L.r(9,55,6,1,'#2a2030');L.r(10,57,4,1,'#5a1a22');
 ears(L,s);head(L,32,32,14,15,s);for(const[x,y,r]of[[20,20,5],[26,16,5],[33,15,5],[40,17,5],[45,22,4],[18,26,3],[46,27,3]])L.e(x,y,r,r,hc);for(const[x,y]of[[24,18],[36,16]])L.e(x,y,2,2,sh(hc,30));
 eye(L,21,28,'#4a6a8a',-1);eye(L,37,28,'#4a6a8a',1);L.r(21,35,6,2,'#a8a0b8');L.r(37,35,6,2,'#a8a0b8');
 brows(L,sh(hc,-30),25,-1);nose(L,s);if(t)mouth(L,32,41,6,true);else L.r(29,42,6,1,MR)}},
// Luz Ortega: the Starlite's desk clerk, forties, black hair in a low ponytail, a red parka, and Pancho the cockatiel on
// her shoulder (her weird trait)
LUZ:{bg:'#3a2a2e',f(L,t){const s='#a26a43',hc='#1b1414',u='#c8402e';
 body(L,u);L.r(24,46,16,6,'#e8e0c8');for(let x=10;x<56;x+=6)L.rm(x,52,1,12,sh(u,-24));
 L.r(54,44,4,16,'#6a6a72');L.e(53,42,6,9,'#8a8a92');L.e(51,40,3,6,'#a8a8b0');L.r(55,38,3,10,'#5a5a62');L.r(54,39,3,1,'#e8e8f0');L.r(54,42,3,1,'#e8e8f0');
 L.e(51,31,6,6,'#f0d040');L.e(50,30,3,3,'#f8e880');L.e(53,34,2,2,'#e8703a');L.r(50,21,2,6,'#f0d040');L.r(52,19,2,5,'#e8c030');L.r(53,18,2,2,'#e8c030');L.r(49,30,2,2,D);L.p(49,30,'#ffffff');L.r(45,33,4,2,'#a89060');L.p(45,35,'#a89060');L.r(50,51,2,3,'#c89a7a');L.r(53,51,2,3,'#c89a7a');
 L.e(32,18,15,8,hc);ears(L,s);head(L,32,32,14,15,s);L.e(31,20,14,6,hc);L.r(18,20,3,12,hc);L.r(43,20,3,10,hc);L.r(24,16,10,2,sh(hc,40));
 eye(L,21,28,'#3a2418',-1);eye(L,37,28,'#3a2418',1);brows(L,hc,25,1);nose(L,s);L.r(20,37,4,2,'#c8706a');L.r(40,37,4,2,'#c8706a');
 L.r(27,41,10,1,'#8a2a2e');if(t)mouth(L,32,41,8,true);else{L.r(28,42,8,1,MR)}}},
// Travis Boone: long-stay in Room 12, thirties, buzzed brown hair, a scar through one eyebrow, thin and grey, a flannel
TRAVIS:{bg:'#2a2a26',f(L,t){const s='#e9b98f',hc='#8a5a2b',u='#4a6a3a';
 body(L,u);for(let y=50;y<64;y+=5)L.rm(0,y,64,1,sh(u,-30));for(let x=10;x<60;x+=7)L.rm(x,48,1,16,sh(u,-30));L.r(28,46,8,5,sh(s,-30));
 ears(L,s);head(L,32,32,13,15,s);L.e(31,20,13,5,sh(hc,-10));L.tex(sh(hc,-10),hc,3);L.r(20,30,4,10,sh(s,-22));L.r(40,30,4,10,sh(s,-22));
 eye(L,21,28,'#5a7a8a',-1);eye(L,37,28,'#5a7a8a',1);L.r(21,35,6,1,'#8a6a7a');L.r(37,35,6,1,'#8a6a7a');brows(L,sh(hc,-20),25);L.r(39,23,1,4,'#f0d0b0');L.r(38,24,1,1,'#f0d0b0');
 nose(L,s);L.r(28,40,8,3,sh(hc,-10));L.tex(sh(hc,-10),s,3);if(t)mouth(L,32,42,7,true);else{L.r(28,43,8,1,MR);L.p(27,44,MR)}}},
// Gideon Marsh: the collector, sixties, bald with grey wisps, big round glasses, a cardigan over a bow tie, and white archival
// cotton gloves he never takes off (his weird trait), held up as if he's about to handle something old
GIDEON:{bg:'#24283a',f(L,t){const s='#f6d7b8',u='#8a6a4a';
 body(L,u);L.r(26,46,12,6,'#e8e4d8');L.r(28,47,8,4,'#2a4a6a');L.r(31,48,2,2,'#4a6a8a');for(const x of[24,40])L.r(x,52,1,12,sh(u,-28));
 L.e(8,50,6,7,'#f4f4f4');L.r(4,40,3,8,'#f4f4f4');L.r(7,38,3,9,'#f4f4f4');L.r(10,40,3,8,'#e4e4e4');L.r(3,55,10,9,sh(u,10));
 ears(L,s);head(L,32,31,15,16,s);L.r(17,24,3,6,'#c0c4c8');L.r(44,24,3,6,'#a8acb0');L.r(27,14,1,3,'#c0c4c8');L.r(33,13,1,3,'#c0c4c8');
 eye(L,22,28,'#4a6a3a',-1);eye(L,36,28,'#4a6a3a',1);glasses(L,'#3a2a24',26);brows(L,'#a8acb0',23,-1);nose(L,s,37);
 if(t)mouth(L,32,42,6,true);else{L.r(29,43,6,1,MR)}}},
// Officer Teri Kowalczyk: Reno PD, the beat on Fourth, thirties, dark hair in a bun under her cap, a navy winter jacket,
// the badge, a cold-pink nose
'OFFICER KO':{bg:'#1e2436',f(L,t){const s='#7a4a2c',hc='#2a1a14',u='#2a3456',cap='#1e2440';
 body(L,u);L.r(26,46,12,6,'#5a6a8a');L.r(40,52,6,7,'#e8c84a');L.r(41,53,4,4,'#c8a040');L.r(14,54,10,2,'#e8e4d8');
 L.e(32,40,4,4,hc);ears(L,s);head(L,32,32,14,15,s);L.r(18,24,2,8,hc);L.r(44,24,2,8,hc);
 L.e(31,19,16,7,sh(cap,-20));L.e(30,18,15,6,cap);L.r(16,22,32,3,sh(cap,-30));L.r(14,24,36,2,'#14182a');L.r(29,15,6,5,'#e8c84a');
 eye(L,21,29,'#2a1a14',-1);eye(L,37,29,'#2a1a14',1);brows(L,hc,27);L.r(31,35,3,3,'#b8605a');nose(L,s,35);
 if(t)mouth(L,32,42,7,true);else{L.r(28,43,8,1,MR)}}},
// Charlene "Cherry" Voss: danced at the club its last two years, now 58 and a waitress on her break, dyed red hair, a pink
// uniform under her coat, a lot of eyeliner and a kind, tired smile
CHERRY:{bg:'#3a2436',f(L,t){const s='#e9b98f',hc='#b94a2c',u='#5a3a5a';
 body(L,u);L.r(24,46,16,18,'#e88aa8');L.r(26,50,12,14,'#f4efe6');L.r(30,52,4,2,'#e88aa8');L.r(28,46,8,4,sh(s,-30));
 L.e(32,22,18,12,hc);L.r(14,24,6,26,hc);L.r(44,24,6,26,sh(hc,-30));ears(L,s);head(L,32,32,14,15,s);L.e(30,20,14,6,hc);L.r(20,16,8,2,sh(hc,40));L.r(18,22,4,10,hc);
 eye(L,21,28,'#4a6a3a',-1);eye(L,37,28,'#4a6a3a',1);L.r(19,27,9,1,D);L.r(36,27,9,1,D);L.p(18,26,D);L.p(45,26,D);L.r(21,35,6,1,sh(s,-24));L.r(37,35,6,1,sh(s,-24));
 brows(L,sh(hc,-50),24,1);nose(L,s);L.r(19,37,4,2,'#e8857a');L.r(41,37,4,2,'#e8857a');L.e(46,40,1,2,'#e8c84a');
 L.r(28,41,8,1,'#c8304e');if(t)mouth(L,32,41,8,true);else{L.r(28,42,8,1,MR);L.p(27,41,MR);L.p(36,41,MR)}}},
// Ines Park: county records clerk, thirties, black hair in a bun stuck through with pencils, half-moon glasses, a green
// cardigan with every pocket full of pencils (her weird trait)
INES:{bg:'#26322e',f(L,t){const s='#c98e62',hc='#1b1414',u='#5a8a7a';
 body(L,u);L.r(26,46,12,6,'#e8e4d8');for(const x of[14,42]){L.r(x,54,8,8,sh(u,-24));for(let k=0;k<3;k++)L.r(x+1+k*2,50,1,5,['#f4d040','#f4d040','#c8402e'][k])}
 L.e(32,12,7,6,hc);L.r(24,4,2,14,'#f4d040');L.r(24,4,2,2,'#e8a0a0');L.r(38,6,2,12,'#f4d040');L.r(38,6,2,2,'#2a2030');L.r(30,2,2,10,'#f4d040');
 ears(L,s);head(L,32,32,14,15,s);L.e(31,21,14,6,hc);L.r(18,22,3,8,hc);L.r(43,22,3,8,hc);L.r(14,26,4,1,'#f4d040');L.r(46,26,4,1,'#f4d040');
 eye(L,21,28,'#3a2418',-1);eye(L,37,28,'#3a2418',1);L.r(19,31,10,1,'#8a6a3a');L.r(35,31,10,1,'#8a6a3a');L.r(19,31,1,4,'#8a6a3a');L.r(28,31,1,4,'#8a6a3a');L.r(35,31,1,4,'#8a6a3a');L.r(44,31,1,4,'#8a6a3a');L.r(19,34,10,1,'#8a6a3a');L.r(35,34,10,1,'#8a6a3a');
 brows(L,hc,25,-1);nose(L,s,36);L.r(20,37,3,2,'#d8807a');L.r(41,37,3,2,'#d8807a');if(t)mouth(L,32,41,7,true);else{L.r(28,42,8,1,MR);L.p(36,41,MR)}}}
};
const pcache={};
function portraitCanvas(name,open){const k=name+(open?1:0);if(pcache[k])return pcache[k];
 const P_=PORT[name],L=Ly(64,64),c=K.mk(64,64),g=c.getContext('2d');P_.f(L,open?1:0);
 const gr=g.createRadialGradient(22,18,4,32,32,46);gr.addColorStop(0,sh(P_.bg,34));gr.addColorStop(1,P_.bg);g.fillStyle=gr;g.fillRect(0,0,64,64);
 const o=finish(L);for(let i=0;i<o.length;i++)if(o[i]){g.fillStyle=o[i];g.fillRect(i%64,(i/64)|0,1,1)}
 return pcache[k]=c}
const portraits={};
for(const name of Object.keys(PORT))portraits[name]=(ctx,open)=>{ctx.clearRect(0,0,64,64);ctx.drawImage(portraitCanvas(name,open),0,0)};

// ================= BIG HAT'S BRIEFING PLACE: the shut buffet (spec 018, Briefing) =================
// The shut buffet of a dying downtown casino: sneeze guards over empty steam pans, a row of dead slot machines along the
// back wall, a carpet in a pattern that's seen things. Drawn in the back room's layout (spec 013): his bust centered, the
// place behind him, and in front of him, where the desk would be, a buffet two-top with a plate of nothing. One working
// heat lamp over the steam table right behind him keeps his face clear.
const buffet={
 back(c,v){const{VW,VH,fy,mid,now}=v,R=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))};
  // the wall: flocked red wallpaper gone brown, a brass rail
  R(0,0,VW,VH,'#3a1a1e');for(let y=0;y<fy;y+=10)for(let x=((y/10)|0)%2*8;x<VW;x+=16){R(x+4,y+2,4,6,'#4a2228');R(x+3,y+4,6,2,'#4a2228')}
  R(0,fy-64,VW,3,'#c8a040');R(0,fy-61,VW,1,'#7a5a20');
  // the dead slots along the back: dark screens, a few reels stuck, one still blinking its candle
  for(let i=0;i<8;i++){const x=mid-150+i*38;if(Math.abs(x+15-mid)<36)continue;R(x,fy-112,30,50,'#2a2a34');R(x+2,fy-110,26,6,'#c8a040');R(x+4,fy-100,22,16,'#14141a');for(let k=0;k<3;k++)R(x+5+k*7,fy-98,6,12,i%3===1?'#e8e4d8':'#1e1e26');R(x+4,fy-80,22,4,'#4a4a54');R(x+12,fy-118,6,6,i===6&&Math.floor(now/600)%2?'#ff3a3a':'#3a1a1a')}
  // a sign on the wall: BUFFET with half the bulbs out
  R(mid-46,8,92,20,'#2a1a1e');for(let x=mid-44;x<mid+44;x+=4){R(x,9,2,2,hsh(x,1,701)<.6?'#5a4a2a':'#fff0b0');R(x,25,2,2,hsh(x,2,701)<.6?'#5a4a2a':'#fff0b0')}K.signText(c,'BUFFET',mid-23,13,'#f2c14e',2);
  // the steam table behind him: sneeze guard glass, empty pans, the one heat lamp still on
  R(mid-90,fy-48,180,30,'#8a8a94');R(mid-90,fy-48,180,3,'#c8c8d0');for(let x=mid-84;x<mid+84;x+=28){R(x,fy-44,24,8,'#4a4a54');R(x+1,fy-43,22,2,'#6a6a74')}
  R(mid-92,fy-70,184,3,'rgba(220,240,255,.45)');R(mid-92,fy-70,2,24,'#c8c8d0');R(mid+90,fy-70,2,24,'#c8c8d0');
  c.fillStyle='rgba(255,170,90,.12)';c.beginPath();c.moveTo(mid-12,30);c.lineTo(mid+12,30);c.lineTo(mid+70,fy);c.lineTo(mid-70,fy);c.fill();
  R(mid-1,0,2,26,'#3a3a44');R(mid-8,26,16,5,'#5a5a64');R(mid-6,31,12,2,'#ff9a3c');
  // the carpet: a casino pattern in purple, gold and teal that has seen things
  for(let y=fy-18;y<VH;y+=2)for(let x=0;x<VW;x+=2){const a=((x>>3)+(y>>3))%3,b=((x>>2)^(y>>2))&3;R(x,y,2,2,b===0?'#7a6026':a===0?'#2a1238':a===1?'#142a2a':'#1e1024')}},
 lift:2,
 front(c,v){const{VW,VH,fy,mid,now}=v,R=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))};
  // the two-top where the desk would be: a white tablecloth with a burn, a plate of nothing, his toothpicks, a sweating ice water
  for(let y=fy;y<VH;y+=2)for(let x=0;x<VW;x+=2){const a=((x>>3)+(y>>3))%3,b=((x>>2)^(y>>2))&3;R(x,y,2,2,b===0?'#5a4620':a===0?'#200e2c':a===1?'#102222':'#180c1c')}
  R(mid-116,fy,232,12,'#e8e4d8');R(mid-116,fy,232,2,'#ffffff');R(mid-116,fy+12,232,30,'#d8d0c0');for(let x=mid-112;x<mid+112;x+=14)R(x,fy+14,1,28,'#c8c0b0');R(mid-116,fy+42,232,3,'#a8a090');R(mid-116,fy+45,232,3,'rgba(0,0,0,.35)');
  c.fillStyle='rgba(120,90,50,.35)';c.beginPath();c.ellipse(mid+18,fy+6,9,3,0,0,6.283);c.fill();R(mid-96,fy+5,3,2,'#3a2418');R(mid+92,fy+20,10,14,'#c8402e');R(mid+93,fy+22,8,1,'#f4efe6');K.signText(c,'7',mid+95,fy+25,'#f4efe6');
  R(mid-70,fy+4,6,3,'#5a3a2a');c.fillStyle='#f4f4f8';c.beginPath();c.ellipse(mid-40,fy-2,22,6,0,0,6.283);c.fill();c.fillStyle='#d8d8e0';c.beginPath();c.ellipse(mid-40,fy-2,14,3.5,0,0,6.283);c.fill();
  R(mid+40,fy-16,10,16,'rgba(200,230,255,.6)');R(mid+40,fy-16,10,2,'#ffffff');R(mid+42,fy-12,6,8,'rgba(230,245,255,.7)');R(mid+62,fy-6,14,6,'#e8dcc0');for(let x=mid+63;x<mid+76;x+=3)R(x,fy-5,1,4,'#c8a060');
  R(mid+86,fy-10,18,10,'#2a1a1e');R(mid+86,fy-10,18,2,'#c8a040');K.signText(c,'KENO',mid+88,fy-7,'#f2c14e')}
};

return{paint,props,folk,portraits,fx,tracking,buffet,foilGlint,FOLK,PORT,portraitCanvas};
})();
