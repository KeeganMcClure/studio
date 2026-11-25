// Black Lantern · cases/lantern-03-art.js · LANTERN 03's art (spec 015, Nov 25, 2026). Exposes window.L03A.
// Art for this case only (Bible, Art, Direction: one case, one set of art); never reuse it in another case.
// Generic pieces come from the Shared Shelf (engine/shelf.js, the versions in use: cinder block, snow, asphalt, the lamp
// post, the sedan, the van, the dumpster, shelving, the desk, the monitor, waiting chairs, boxes, the snowbank, the
// numbered door, floors, inner walls and snowfall), painted with Black Lantern's palette. This file adds the case's own
// pieces (the annex front, the lobby, Intake, the stacks and the sub-basement's fittings), its people on the map and in
// the dialog box, the light and air (fluorescent before midnight, red emergency light after), and Big Hat's briefing
// place. No Shared Shelf pieces are added.
//
//   L03A.paint(M)            the map's still layer -> {c, glows}; L03A.props(M) its standing pieces, sorted with people
//   L03A.folk(id, dir, idle, M)  a person's map sprite -> {c, ax, ay}
//   L03A.portraits           speaker name -> (ctx, mouth) drawing the 64 x 64 talking portrait
//   L03A.fx(ctx, o)          the case's light and air after the light pass
//   L03A.payphone            Big Hat's briefing place: {back, front} (engine.js bigHatScene)
//   L03A.lilyGlint           how the hidden hotspot looks while it shows
//
// The case's accent colors (Bible, Art, Palette), on top of the base palette: filing-cabinet gray, the emergency red,
// sodium orange, and Wren's gray wool.
const L03_ACCENT={gray:'#6a7078',grayD:'#4a5058',red:'#ff3a2a',sodium:'#ffb860',wool:'#8a8a90',cork:'#9a6a3a'};
window.L03A=(()=>{
const K=SHELF,T=16,S=.5,{F,shade,hsh,RGB,art}=K,A=L03_ACCENT;
const ART={};
const get=(k,spec)=>ART[k]||(ART[k]=K.prop(spec(),S));
const isNight=M=>M.light==='night';

// ================= GROUND =================
const GP={
 ',':(x,y)=>{const c=K.stoneSidewalk(x,y,T,false);return hsh(x>>1,y>>1,701)<.35?shade(c,.25):c},
 '=':(x,y)=>{const c=K.asphalt(x,y,T);return hsh(x>>2,y>>2,702)<.18?shade(c,.35):c},
 s:(x,y)=>K.snow(x,y,T,false),
 n:(x,y)=>K.floor(x,y,T,'lino'),c:(x,y)=>K.floor(x,y,T,'carpet'),t:(x,y)=>K.floor(x,y,T,'tile'),
 o:(x,y)=>{const n=hsh(x>>1,y>>1,703);return n<.04?'#3e3c3a':(x%48===0||y%48===0)?'#4a4846':['#5a5856','#56544f','#5e5c58'][(hsh(x,y,704)*3)|0]}};
const at=(M,x,y)=>{const r=M.ground[y];return r?r[x]:undefined};

// ================= THE STILL LAYER =================
const still={};
function paint(M){
 const key=M.id+(isNight(M)?'n':'d');if(still[key])return still[key];
 const W=M.w*T,H=M.h*T,c=K.mk(W,H),g=c.getContext('2d'),img=g.createImageData(W,H),d=img.data,glows=[];
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const ch=at(M,(x/T)|0,(y/T)|0),col=(GP[ch]||GP.o)(x,y),v=RGB(col),i=(y*W+x)*4;d[i]=v[0];d[i+1]=v[1];d[i+2]=v[2];d[i+3]=255}
 g.putImageData(img,0,0);
 for(let ty=0;ty<M.h;ty++)for(let tx=0;tx<M.w;tx++){const a=at(M,tx,ty),b=at(M,tx,ty+1);
  if(a===','&&b==='='){F(g,tx*T,ty*T+T-2,T,1,'#8a8a90');F(g,tx*T,ty*T+T-1,T,1,'#1c1820')}
  if(a==='='&&(b==='s'||at(M,tx+1,ty)==='s')&&hsh(tx,ty,705)<.6)F(g,tx*T+((hsh(tx,ty,706)*10)|0),ty*T+12,6,3,'#d8dce4')}
 (M.lines||[]).forEach(l=>{g.fillStyle='rgba(232,228,200,.55)';g.fillRect(l.x+7,l.y,l.w,l.h)});
 M.pieces.filter(p=>PROPK.has(p.k)&&!NOSHADOW.has(p.k)).forEach(p=>{const cx=(p.x+p.w/2)*T+2,cy=(p.y+p.h)*T-2,rx=Math.max(5,p.w*T*.42);
  g.fillStyle='rgba(16,10,20,.3)';g.beginPath();g.ellipse(cx,cy,rx,Math.max(2.5,rx*.28),0,0,6.283);g.fill()});
 M.pieces.filter(p=>STILL[p.k]).forEach(p=>STILL[p.k](g,p,M,glows));
 return still[key]={c,glows};
}
const STILL={
 // the annex front: cinder block the color of a filing cabinet, a flat roof, grilled windows, RECORDS ANNEX 9 over the
 // wired-glass doors, and the loading dock's roll-up door with its keypad and camera on the right
 annex(g,p,M,glows){const W=M.w*T,FB=6*T;F(g,0,0,W,10,'#2a2a30');F(g,0,8,W,2,'#d8dce4');
  K.cinderBlock(g,0,W,10,FB,T,{painted:'#6a7078'});F(g,0,FB-4,W,4,'#4a4e56');
  for(const x of[2,5,8,15,18]){const wx=x*T+2,wy=30;F(g,wx-1,wy-1,26,20,'#2a2a30');F(g,wx,wy,24,18,'#1a2030');if(hsh(x,1,707)<.4){F(g,wx,wy,24,18,'#3a3a30');glows.push([wx+12,wy+9,T*1.2,.35])}
   for(let i=3;i<24;i+=5)F(g,wx+i,wy,1,18,'#8a8e96');F(g,wx,wy+9,24,1,'#8a8e96')}
  // the doors
  const dx=11*T;F(g,dx-4,FB-46,40,46,'#3a3e46');F(g,dx,FB-42,15,42,'#7a8a9a');F(g,dx+17,FB-42,15,42,'#7a8a9a');
  for(let y=FB-40;y<FB;y+=4)for(let x=dx;x<dx+32;x+=4)F(g,x,y,1,1,'#5a6a7a');F(g,dx+15,FB-42,2,42,'#2a2a30');
  F(g,dx+2,FB-30,11,22,'rgba(255,232,170,.5)');F(g,dx+19,FB-30,11,22,'rgba(255,232,170,.5)');glows.push([dx+16,FB-20,T*1.8,.45]);
  K.signBlank(g,dx-22,FB-62,76,11,'#2a2e36');K.signText(g,'RECORDS ANNEX 9',dx-18,FB-59,'#e8e4d8');
  F(g,dx+38,FB-26,4,6,'#c8c0a8');F(g,dx+39,FB-24,2,2,'#ff3a2a');
  // the dock
  const kx=22*T;F(g,kx-6,FB-56,44,56,'#3a3e46');F(g,kx-2,FB-52,36,52,'#8a8e96');for(let y=FB-50;y<FB;y+=3)F(g,kx-2,y,36,1,'#6a6e76');F(g,kx-8,FB-4,48,4,'#2a2a30');
  K.signBlank(g,kx-4,FB-66,40,8,'#c8a040');K.signText(g,'DOCK',kx+6,FB-64,'#2a2030');
  F(g,kx+36,FB-30,5,8,'#2a2a30');F(g,kx+37,FB-28,3,2,'#5ae080');F(g,kx-12,FB-60,6,4,'#2a2a30');F(g,kx-13,FB-59,2,2,'#ff3a2a');
  // snow along the roof line and the sills
  for(let x=0;x<W;x+=3)F(g,x,10,3,1+((hsh(x,2,708)*3)|0),'#eef0f4')},
 // interiors: the back wall, the side walls and the bottom wall with its door gaps, then each room's fittings
 room(g,p,M,glows){const W=M.w*T,H=M.h*T,N=isNight(M),kind={lobby:['plain','#b8b4a0'],intake:['panel','#7a5a3a'],stacks:['plain','#8a8e8a']}[M.id]||['plain','#a8a898'];
  K.innerWall(g,T,W-T,0,3*T,kind[0],kind[1],T);
  F(g,0,0,T,H,'#1e1826');F(g,T-2,0,2,H-T,'#3a3046');F(g,W-T,0,T,H,'#1e1826');F(g,W-T,0,2,H-T,'#2a2236');
  F(g,0,H-T,W,T,'#1e1826');F(g,T,H-T,W-2*T,2,'#3a3046');
  for(const k of Object.keys(M.warps)){const[x,y]=k.split(',').map(Number);if(y===M.h-1){F(g,x*T+1,H-T,T-2,T,'#5a5e66');F(g,x*T+3,H-T+3,T-6,T-6,'#7a7e86')}
   else if(y===2){F(g,x*T,T*.6,T,2.4*T,'#3a3e46');F(g,x*T+2,T*.8,T-4,2.2*T,'#6a6e76');F(g,x*T+T-5,T*1.9,2,2,'#c8c0a8')}}
  // a fluorescent tube in the ceiling every few tiles; out after midnight, an EXIT sign glows red instead
  for(let x=2*T;x<W-2*T;x+=4*T){F(g,x,2,22,3,N?'#3a3a40':'#e8f0f0');if(!N)glows.push([x+11,6,T*1.6,.25])}
  if(N){F(g,W-3*T,4,16,7,'#2a0a0a');K.signText(g,'EXIT',W-3*T+1,5,'#ff3a2a');glows.push([W-2.5*T,8,T*1.4,.5])}
  F(g,T,3*T,W-2*T,3,'rgba(16,10,20,.25)');
  (DECOR[M.id]||(()=>{}))(g,M,glows)},
 // the sub-basement: poured concrete, sweating, a ceiling of pipes
 baseroom(g,p,M,glows){const W=M.w*T,H=M.h*T;K.cinderBlock(g,T,W-T,0,3*T,T,{painted:'#4a4e52'});
  for(let y=4;y<3*T-4;y+=9)F(g,T,y,W-2*T,3,'#3a3e40');for(let x=T;x<W-T;x+=24)F(g,x,0,2,3*T,'#2e3234');
  F(g,0,0,T,H,'#141218');F(g,W-T,0,T,H,'#141218');F(g,0,H-T,W,T,'#141218');F(g,10*T+1,H-T,T-2,T,'#4a4e56');
  for(let i=0;i<10;i++){const x=T+hsh(i,1,709)*(W-3*T),y=3.5*T+hsh(i,2,709)*(H-5*T);g.fillStyle='rgba(20,30,34,.5)';g.beginPath();g.ellipse(x,y,5+hsh(i,3,709)*8,2,0,0,6.283);g.fill()}}
};
const DECOR={
 lobby(g,M,glows){F(g,3*T,.6*T,1.4*T,1.6*T,'#2a2e36');F(g,3*T+2,.6*T+2,1.4*T-4,10,'#e8e4d8');K.signText(g,'FLOOR',3*T+3,.6*T+4,'#2a2030');for(let i=0;i<4;i++)F(g,3*T+3,.6*T+15+i*4,1.4*T-6,1,'#8a8e96')},
 intake(g,M,glows){F(g,9.4*T,.5*T,1.3*T,1.3*T,'#e8e4d8');F(g,9.4*T,.5*T,1.3*T,3,'#a8323e');for(let i=0;i<3;i++)for(let j=0;j<4;j++)F(g,9.4*T+3+j*5,.5*T+6+i*5,3,3,'#8a8070');
  F(g,9.4*T+4,.5*T+14,3,3,'#ff3a2a')},  // a wall calendar: November, Sundays ringed
 stacks(g,M,glows){F(g,13*T,.4*T,3*T,.8*T,'#2a2e36');K.signText(g,'RECORDS',13*T+4,.4*T+4,'#c8c0a8');K.signText(g,'STACKS B',13*T+4,.4*T+11,'#c8c0a8')}
};

// ================= STANDING PIECES (design units: 2 per screen pixel) =================
const SPEC={
 deadpole:()=>({size:[16,92,0,0],anchor:[8,90],lights:[],draw({R}){R(6,8,4,82,'#2a2a30',{sh:1});R(2,2,14,6,'#3a3a44');R(4,8,10,3,'#4a4a50');R(2,0,14,2,'#eef0f4')}}),
 payphone:()=>({size:[24,60,0,0],anchor:[12,58],lights:[],draw({R}){R(10,30,4,28,'#4a4a54');R(2,2,20,30,'#8a8e96',{sh:5});R(4,6,16,12,'#2a2a30');R(6,20,4,8,'#2a2a30');R(14,20,6,8,'#c0c0c8');R(2,0,20,3,'#eef0f4')}}),
 gdesk:()=>({size:[128,46,0,0],anchor:[64,42],lights:[[100,0,1,.35]],draw({R,E}){R(0,6,128,8,'#c8c0a8',{sh:20});R(0,6,128,2,'#e8e0c8');R(0,14,128,28,'#5a5048');for(let x=6;x<128;x+=30)R(x,18,24,20,'#4a4038');
  R(10,0,24,8,'#e8e4d8');R(12,2,20,1,'#8a8070');R(12,4,16,1,'#8a8070');R(22,-2,1,4,'#8a8a94');R(96,-10,22,16,'rgba(160,200,230,.55)');R(96,-10,22,2,'#c8dce8');E(104,0,3,2,'#e8902a');R(70,-4,12,10,'#3a3a44');R(72,-2,8,3,'#5a5a64')}}),
 detector:()=>({size:[34,70,0,0],anchor:[17,68],lights:[],draw({R}){R(0,0,6,68,'#8a8e96',{sh:2});R(28,0,6,68,'#7a7e86');R(0,0,34,8,'#9a9ea6');R(8,10,20,30,'#4a5a3a')}}),
 bin:()=>({size:[30,30,0,0],anchor:[15,28],lights:[],draw({R}){R(1,6,28,22,'#a88a5a',{sh:6});R(1,6,28,3,'#c8aa7a');R(4,2,8,6,'#a8323e');R(16,0,10,8,'#3a5a6a');R(6,14,18,6,'#e8e4d8');R(8,16,14,1,'#2a2030')}}),
 chairs:()=>K.waitingChairs(3,'#5a6a8a'),
 plant:()=>({size:[24,44,0,0],anchor:[12,42],lights:[],draw({R,C}){R(5,28,14,14,'#8a5a3a',{sh:3});R(4,27,16,3,'#a86a4a');const L=K.pal().grass;C(12,16,9,shade(L,-.1));C(8,12,6,shade(L,.1));C(16,10,6,L)}}),
 cabinet:()=>({size:[30,62,0,0],anchor:[15,60],lights:[],draw({R}){R(1,2,28,58,'#6a7078',{sh:6});for(let y=4;y<58;y+=14){R(3,y,24,12,'#7a8088');R(11,y+4,8,2,'#c0c0c8')}R(12,-1,6,4,'#c8a040')}}),
 wdesk:()=>({size:[128,50,0,0],anchor:[64,46],lights:[[110,4,1.1,.4]],draw({R,E}){R(0,8,128,8,'#6a4a32',{sh:20});R(0,8,128,2,'#8a6a4a');R(2,16,124,30,'#4a3424');R(8,22,30,20,'#3a2818');R(90,22,30,20,'#3a2818');
  R(4,-6,14,14,'#c8a040');R(6,-4,10,10,'#8ab0d8');R(9,-1,4,4,'#e8c0a0');R(8,3,6,4,'#c84a4a');R(44,0,22,8,'#e8e4d8');R(46,2,18,1,'#8a8070');R(70,-2,20,10,'#2a2a30');R(74,0,12,4,'#5a5a64');R(108,-12,6,20,'#c8a040');E(111,-12,8,5,'#e8d8a0')}}),
 kettle:()=>({size:[30,46,0,0],anchor:[15,44],lights:[],draw({R,E}){R(1,20,28,24,'#6a4a32',{sh:6});R(1,20,28,2,'#8a6a4a');E(12,12,8,8,'#c0c0c8');R(18,8,6,3,'#c0c0c8');R(8,2,8,3,'#2a2a30');R(20,14,7,6,'#e8e4d8')}}),
 lamp_in:()=>({size:[22,54,0,0],anchor:[11,52],lights:[[11,10,2.4,.5]],draw({R,E}){R(4,46,14,6,'#3a3a44');R(10,18,2,28,'#5a5a64');E(11,12,9,8,'#d8b878');E(11,10,7,5,'#f0d8a0');R(3,18,16,2,'#a88850')}}),
 paper:()=>({size:[28,40,0,0],anchor:[14,38],lights:[],draw({R}){for(let i=0;i<7;i++)R(2+(i%2),34-i*5,24,5,i%3?'#e8e4d8':'#d8d0b8',{sh:3});R(4,0,20,4,'#c8a040')}}),
 shelfu:()=>K.shelving(true,28),
 cage:()=>({size:[160,96,0,0],anchor:[80,94],lights:[],draw({R}){for(let r=0;r<4;r++)for(let i=0;i<8;i++){const c=['#a88a5a','#b89a6a','#98804e'][(r+i)%3];R(6+i*19,6+r*22,16,18,c,{sh:4});R(8+i*19,10+r*22,12,5,'#e8e4d8')}
  for(let x=0;x<=160;x+=8)R(x,0,1,94,'#9aa0a8');for(let y=0;y<94;y+=8)R(0,y,160,1,'#9aa0a8');R(0,0,160,3,'#6a7078');R(0,90,160,4,'#6a7078')}}),
 stock:()=>({size:[128,64,0,0],anchor:[64,62],lights:[[120,20,.8,.4]],draw({R}){for(let r=0;r<2;r++)for(let i=0;i<5;i++){R(6+i*24,8+r*26,22,22,'#2a2a30',{sh:4});R(8+i*24,10+r*26,18,2,'#c8a040');R(14+i*24,16+r*26,6,8,'#c8a040')}
  for(let x=0;x<=128;x+=8)R(x,0,1,62,'#9aa0a8');for(let y=0;y<62;y+=8)R(0,y,128,1,'#9aa0a8');R(0,0,128,3,'#6a7078');R(116,18,8,10,'#2a2a30');R(118,20,4,3,'#ff3a2a')}}),
 terminal:()=>({size:[32,72,0,0],anchor:[16,70],lights:[[16,14,.9,.4]],draw({R}){R(2,40,28,30,'#5a5a64',{sh:4});R(4,66,4,4,'#2a2a30');R(24,66,4,4,'#2a2a30');R(1,6,30,32,'#c8c0a8',{sh:5});R(4,9,24,20,'#0a2a14');for(let y=12;y<26;y+=3)R(6,y,10+(y%5)*2,1,'#5ae080');R(6,32,20,4,'#a8a090')}}),
 dotdesk:()=>({size:[64,54,0,0],anchor:[32,50],lights:[],draw({R}){R(0,8,64,8,'#8a6a40',{sh:12});R(0,8,64,2,'#a88a5a');R(2,16,60,32,'#6a4a2a');R(6,22,22,20,'#5a3a1e');R(34,22,22,20,'#5a3a1e');R(14,30,6,2,'#c0c0c8');R(42,30,6,2,'#c0c0c8')}}),
 boxes:()=>K.boxes(0),
 incin:()=>({size:[96,70,0,0],anchor:[48,66],lights:[],draw({R,E}){R(2,6,92,60,'#3a3634',{sh:16});R(2,6,92,4,'#5a5654');R(26,22,44,32,'#1a1614');R(28,24,40,28,'#2a2420');R(44,20,8,4,'#6a6460');R(40,60,16,4,'#5a5654');
  for(let x=8;x<92;x+=14)R(x,10,4,4,'#6a6460');R(78,30,10,14,'#8a8a94');R(80,32,6,4,'#c84a2a');R(40,-6,16,12,'#3a3634')}}),
 cart:()=>({size:[32,40,0,0],anchor:[16,38],lights:[],draw({R}){for(let i=0;i<6;i++)R(3+(i%2)*2,8+i*3,26,4,i%2?'#e8dcc0':'#d8c8a0');R(1,28,30,3,'#8a8e96');for(let x=1;x<32;x+=5)R(x,8,1,22,'#8a8e96');R(3,32,3,6,'#2a2a30');R(26,32,3,6,'#2a2a30')}}),
 boiler:()=>({size:[96,72,0,0],anchor:[48,68],lights:[[30,36,.7,.3]],draw({R,E}){E(48,30,44,26,'#5a3a2a');R(4,30,88,36,'#5a3a2a',{sh:16});E(48,30,40,22,'#6a4a36');R(22,40,16,12,'#2a2a30');R(24,42,12,8,'#e86a2a');E(70,24,8,8,'#c8c0a8');R(69,20,2,6,'#a8323e');R(40,-4,10,20,'#4a4a54')}}),
 hanglamp:()=>({size:[20,24,0,0],anchor:[10,22],lights:[[10,16,3.2,.45]],draw({R,E}){R(9,0,2,10,'#3a3834');E(10,14,9,5,'#4a5a5a');R(1,14,18,2,'#3a4a4a');E(10,17,4,2,'#ffd8b0')}})
};
const PROPK=new Set(['lamp','van','car','dumpster','deadpole','payphone','snowbank','gdesk','detector','bin','chairs','plant','cabinet','wdesk','kettle','lamp_in','stacks_paper','shelf','cage','stockcage','terminal','dotdesk','boxes','incinerator','cart','boiler','hanglamp',
 'elevator','photos','routeboard','window','scarf','stairsdoor','vault','pipes','ninedoor']);
const NOSHADOW=new Set(['elevator','photos','routeboard','window','scarf','stairsdoor','vault','pipes','ninedoor','hanglamp','snowbank','cage','stockcage']);
function props(M){
 const out=[],N=isNight(M);
 const add=(a,fx,fy,p,o={})=>{const X=Math.round(fx-a.ax),Y=Math.round(fy-a.ay);
  out.push(Object.assign({tx:p.x,ty:p.y,x:fx,y:fy,top:Y,draw:(c,ox,oy)=>c.drawImage(a.c,X+ox,Y+oy),
   lights:(a.lights||[]).map(([lx,ly,r,al])=>[X+a.sx(lx),Y+a.sy(ly),r*T,al,!!o.pool])},o.extra||{}))};
 const dyn=(p,fx,fy,top,draw,o={})=>out.push(Object.assign({tx:p.x,ty:p.y,x:fx,y:fy,top,draw,lights:o.lights||[]},o.extra||{}));
 for(const p of M.pieces){if(!PROPK.has(p.k))continue;const cx=(p.x+p.w/2)*T,fy=(p.y+p.h)*T-2;
  switch(p.k){
  case'lamp':add(get('lamp',()=>K.LAMP),cx,fy+1,p,{pool:true});out[out.length-1].lights.push([cx,fy-2,1.8*T,.45,true]);break;
  case'van':add(get('van',()=>K.van('side','#e8e4dc')),cx,fy+2,p);break;
  case'car':add(get('car'+p.tint,()=>K.sedan('side',p.tint||'cloth')),cx,fy,p);break;
  case'dumpster':add(get('dump',()=>K.dumpster(false,'#3a5a4a')),cx,fy,p);break;
  case'snowbank':add(get('sbank'+p.w,()=>K.snowbank(p.w)),cx,fy+4,p);break;
  case'deadpole':add(get('deadpole',SPEC.deadpole),cx,fy+1,p);break;
  case'payphone':add(get('payphone',SPEC.payphone),cx,fy,p);break;
  case'gdesk':add(get('gdesk',SPEC.gdesk),cx,fy+4,p);break;
  case'detector':add(get('detector',SPEC.detector),cx,fy,p);break;
  case'bin':add(get('bin',SPEC.bin),cx,fy,p);break;
  case'chairs':add(get('chairs',SPEC.chairs),cx,fy,p);break;
  case'plant':add(get('plant',SPEC.plant),cx,fy,p);break;
  case'cabinet':add(get('cabinet',SPEC.cabinet),cx,fy,p);break;
  case'wdesk':add(get('wdesk',SPEC.wdesk),cx,fy+4,p);break;
  case'kettle':add(get('kettle',SPEC.kettle),cx,fy,p);break;
  case'lamp_in':add(get('lampin',SPEC.lamp_in),cx,fy,p,{pool:true});break;
  case'stacks_paper':add(get('paper',SPEC.paper),cx,fy,p);break;
  case'shelf':{const a=get('shelfu',SPEC.shelfu);for(let i=0;i<p.w;i++)add(a,(p.x+i+.5)*T,fy+2,p);break}
  case'cage':add(get('cage',SPEC.cage),cx,fy+2,p);break;
  case'stockcage':add(get('stock',SPEC.stock),cx,fy+2,p);break;
  case'terminal':add(get('term',SPEC.terminal),cx,fy,p,{extra:{term:!N}});break;
  case'dotdesk':add(get('dotdesk',SPEC.dotdesk),cx,fy,p);break;
  case'boxes':add(get('boxes',SPEC.boxes),cx,fy,p);break;
  case'incinerator':add(get('incin',SPEC.incin),cx,fy+2,p,{extra:{fire:[cx,fy-14]}});break;
  case'cart':add(get('cart',SPEC.cart),cx,fy,p);break;
  case'boiler':add(get('boiler',SPEC.boiler),cx,fy+2,p);break;
  case'hanglamp':{const a=get('hang',SPEC.hanglamp);dyn(p,cx,9999,0,(c,ox,oy)=>{const sw=Math.round(Math.sin(performance.now()/1100)*1.2);F(c,cx+ox,oy,1,p.y*T+4,'#3a3834');c.drawImage(a.c,Math.round(cx-a.ax+sw)+ox,Math.round(p.y*T+14-a.ay)+oy)},{lights:[[cx,p.y*T+12,3.4*T,.5,true]]});break}
  // flat pieces on the floor: Wren's scarf, eleven years long, running off under the cabinet
  case'scarf':dyn(p,cx,-1,0,(c,ox,oy)=>{const x0=p.x*T+ox,y=p.y*T+6+oy;for(let i=0;i<p.w*T;i+=2){const yy=y+Math.round(Math.sin(i/9)*2);F(c,x0+i,yy,2,4,i%6<2?'#7a7a80':A.wool)}});break;
  // wall fittings, drawn flat on the back wall (no shadow, behind everyone)
  case'elevator':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+3+ox,y=.5*T+oy;F(c,x-2,y-2,p.w*T-2,2.5*T,'#3a3e46');F(c,x,y,p.w*T/2-4,2.3*T,'#9aa0a8');F(c,x+p.w*T/2-2,y,p.w*T/2-4,2.3*T,'#8a9098');F(c,x+6,y+4,10,6,'#e8e4d8');K.signText(c,'OUT',x+7,y+5,'#a8323e')});break;
  case'photos':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+2+ox,y=.5*T+oy;for(let i=0;i<6;i++){const px=x+(i%3)*15,py=y+((i/3)|0)*15;F(c,px,py,12,12,'#c8a040');F(c,px+1,py+1,10,10,i<3?'#8a8a8a':'#8a9ab0');F(c,px+4,py+3,4,4,'#d8c0a0');F(c,px+3,py+7,6,4,'#3a3a44')}
   F(c,x+15+3,y+15+1,6,3,'#2a2030');K.signText(c,'HANDLERS',x+4,y+31,'#c8c0a8')});break;
  case'routeboard':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+2+ox,y=.25*T+oy,w=p.w*T-4;F(c,x,y,w,2.4*T,'#5a3a1c');F(c,x+2,y+2,w-4,2.4*T-4,A.cork);
   for(let i=0;i<16;i++){const px=x+4+(i*11)%(w-14),py=y+3+((i*5)%4)*8;F(c,px,py,8,6,i===7?'#ffe0a0':'#e8e4d8');F(c,px+1,py+2,6,1,'#8a8070');F(c,px+3,py,2,2,'#a8323e')}
   c.strokeStyle='#c8402e';c.lineWidth=1;c.beginPath();for(let i=0;i<16;i++){if(i===7)continue;c.moveTo(x+8+(i*11)%(w-14),y+6+((i*5)%4)*8);c.lineTo(x+8+(7*11)%(w-14),y+6+((7*5)%4)*8)}c.stroke()});break;
  case'window':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+4+ox,y=.4*T+oy,W_=p.w*T-8,H_=1.9*T;F(c,x-2,y-2,W_+4,H_+4,'#3a3e46');F(c,x,y,W_,H_,N?'#140a0c':'#3a4048');
   for(let i=0;i<5;i++){F(c,x+2+i*8,y+4,5,H_-6,N?'#2a1214':'#5a6068');F(c,x+3+i*8,y+5,3,2,N?'#6a1a14':'#8a9098')}if(N)F(c,x+W_-8,y+3,3,3,'#ff3a2a');F(c,x+W_/2-1,y,2,H_,'#3a3e46')});break;
  case'stairsdoor':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+ox,y=.5*T+oy;F(c,x,y,p.w*T,2.5*T,'#3a3e46');F(c,x+16,y+2,14,2.5*T-2,N?'#0a0808':'#7a7e86');F(c,x+3,y+4,11,6,'#c8a040');K.signText(c,'B2',x+5,y+5,'#2a2030');F(c,x+3,y+14,4,5,'#2a2a30');F(c,x+4,y+15,2,2,N?'#5ae080':'#ff3a2a')});break;
  case'vault':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+ox,y=oy,now=performance.now();F(c,x,y,p.w*T,3*T,'#2a2e30');F(c,x+6,y+.3*T,p.w*T-12,2.7*T,'#7a8288');F(c,x+8,y+.3*T+2,p.w*T-16,2.7*T-2,'#8a9298');
   c.fillStyle='#5a6268';c.beginPath();c.arc(x+p.w*T/2,y+1.6*T,9,0,6.283);c.fill();for(let k=0;k<6;k++){const a=k/6*6.283+now/4000;F(c,x+p.w*T/2+Math.cos(a)*7-1,y+1.6*T+Math.sin(a)*7-1,2,2,'#c0c8cc')}
   F(c,x+p.w*T/2-1,y+.3*T,2,2.7*T,'#1a1e20');K.signText(c,'COLD',x+20,y+.4*T+2,'#2a2030');const k=(now%3000)/3000;c.fillStyle=`rgba(200,220,240,${(.25-.15*k).toFixed(2)})`;c.fillRect(x+p.w*T/2-4,y+3*T-4-k*8,8,4)});break;
  case'pipes':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+ox,y=oy;for(let i=0;i<3;i++){F(c,x,y+6+i*12,p.w*T,5,['#5a4a3a','#4a5a5a','#6a5a4a'][i]);F(c,x,y+6+i*12,p.w*T,1,'#8a8a84')}F(c,x+10,y+4,4,40,'#4a4a4a')});break;
  case'ninedoor':dyn(p,cx,0,0,(c,ox,oy)=>{const x=p.x*T+ox,y=oy+.4*T,open=!!G.flags.nineSeen;F(c,x+2,y,p.w*T-4,2.6*T,'#4a4e52');F(c,x+4,y+2,p.w*T-8,2.6*T-2,open?'#06080a':'#5a5e62');
   F(c,x+p.w*T/2-5,y+6,10,9,'#c8a040');K.signText(c,'9',x+p.w*T/2-1,y+8,'#2a2030');if(open){c.fillStyle='rgba(190,210,230,.18)';c.fillRect(x+4,y+2,p.w*T-8,2.6*T-2)}});break;
  }}
 return out}

// ================= LIGHT AND AIR =================
// The lot: snow falling under sodium light, and the lantern's warm pool. Before midnight the rooms are fluorescent (a
// tube that buzzes and dips now and then); after it, red emergency light breathing over everything, and the lantern.
const OUTDOOR=new Set(['lot']);
function fx(ctx,o){const M=o.M,N=o.night,vw=ctx.canvas.width,vh=ctx.canvas.height,t=o.now;
 if(OUTDOOR.has(M.id))K.snowfall(ctx,t,{k:.35,wind:.4});
 else if(!N){if(Math.floor(t/2300)%9===0&&(t%2300)<120){ctx.fillStyle='rgba(10,12,20,.18)';ctx.fillRect(0,0,vw,vh)}ctx.fillStyle='rgba(200,230,240,.05)';ctx.fillRect(0,0,vw,vh)}
 else{const k=.5+.5*Math.sin(t/900);ctx.fillStyle=`rgba(255,40,30,${(.05+.05*k).toFixed(3)})`;ctx.fillRect(0,0,vw,vh)}
 (M.props||[]).forEach(p=>{const x=p.x-o.camx,y=p.y-o.camy;
  if(p.fire&&G.flags.lit){const f=.5+.5*Math.sin(t/90)*Math.sin(t/37);ctx.fillStyle=`rgba(255,170,60,${(.35+.3*f).toFixed(2)})`;ctx.fillRect(Math.round(p.fire[0]-o.camx-10),Math.round(p.fire[1]-o.camy-6),20,10)}
  if(p.term&&Math.floor(t/500)%2){ctx.fillStyle='#5ae080';ctx.fillRect(Math.round(x-4),Math.round(y-25),2,1)}});
 if(N){const lx=G.px+8-o.camx,ly=G.py+6-o.camy,lr=58*(M.lanternK||1);ctx.globalCompositeOperation='multiply';let gr=ctx.createRadialGradient(lx,ly,0,lx,ly,lr);
  gr.addColorStop(0,'rgba(240,196,120,.7)');gr.addColorStop(1,'rgba(240,196,120,0)');ctx.fillStyle=gr;ctx.fillRect(lx-lr,ly-lr,lr*2,lr*2);
  ctx.globalCompositeOperation='lighter';gr=ctx.createRadialGradient(lx,ly,0,lx,ly,lr*.5);gr.addColorStop(0,'rgba(214,164,58,.14)');gr.addColorStop(1,'rgba(214,164,58,0)');ctx.fillStyle=gr;ctx.fillRect(lx-lr,ly-lr,lr*2,lr*2);
  ctx.globalCompositeOperation='source-over'}}
// the hidden hotspot, while the lead is High on Mushrooms: the window glass fogs, and a small figure stands in it
function lilyGlint(c,x,y,now){const a=.22+.18*Math.sin(now/700);c.fillStyle=`rgba(220,230,250,${a.toFixed(2)})`;c.fillRect(x-6,y-8,12,15);
 const k=.4+.3*Math.sin(now/1300);c.fillStyle=`rgba(200,120,140,${k.toFixed(2)})`;c.fillRect(x-1,y-4,3,6);c.fillStyle=`rgba(240,210,190,${k.toFixed(2)})`;c.fillRect(x-1,y-6,3,2);
 c.fillStyle=`rgba(243,237,226,${(a+.15).toFixed(2)})`;c.fillRect(x-7,y-9,14,1);c.fillRect(x-7,y+7,14,1)}

// ================= PEOPLE ON THE MAP =================
// The Shared Shelf's person template at the agents' size; hair from agent-sprite.js. Weird traits (Art, Townsfolk):
// Wren's knitting, Desmond's goldfish (on the desk). The tall man is his own sprite: too tall, eyes shut.
const {SKIN}=window.BL;
const FOLK={
 wren:{look:{skin:0,hair:4,hairC:6,acc:1},top:'#8a8a90',pants:'#4a4a54',shoes:'#3a2418',iris:'#6a8aa0',mouth:'smile',cheeks:1,
  body:(A_,ty)=>{const{R}=A_;for(let y=ty+2;y<ty+16;y+=3)R(8,y,12,1,shade('#8a8a90',-.2));R(18,ty+10,6,4,'#7a7a80');R(22,ty+6,1,8,'#c8a040')}},
 desmond:{look:{skin:3,hair:3,hairC:6,acc:0},top:'#2e3a5a',pants:'#2a2a34',shoes:'#1a1418',iris:'#2a1a14',mouth:'flat',
  body:(A_,ty)=>{const{R}=A_;R(13,ty,2,10,'#a8323e');R(7,ty+3,5,3,'#c8a040');R(6,ty+10,16,1,'#1e2a44')}}
};
function tall(dir){const v=art(40,120,0,0,S,({R,E})=>{const c='#1a1a22',cl='#2e2e3a',s='#d8c8b4';
 R(10,30,20,86,c,{sh:5});R(12,30,4,86,cl);R(8,112,10,6,'#0e0e12');R(22,112,10,6,'#0e0e12');
 E(20,18,8,10,s);R(13,10,14,5,'#3a3640');R(14,19,5,1,'#5a4a40');R(22,19,5,1,'#5a4a40');R(18,25,4,1,'#8a5a50');
 if(dir!=='up')R(28,52,8,14,'#e8dcc0');R(29,54,6,1,'#8a8070');R(4,40,5,40,c);R(31,40,5,30,c)});
 v.ax=v.sx(20);v.ay=v.sy(118);return v}
const fcache=new Map();
function folk(id,dir,idle=0,M){
 const k=id+dir+idle;let v=fcache.get(k);if(v)return v;
 if(dir==='right'){const l=folk(id,'left',idle,M),c=K.mk(l.c.width,l.c.height),g=c.getContext('2d');g.translate(c.width,0);g.scale(-1,1);g.drawImage(l.c,0,0);v={c,ax:c.width-l.ax,ay:l.ay}}
 else if(id==='tall'){const d=tall(dir);v={c:d.c,ax:d.ax,ay:d.ay}}
 else{const F_=FOLK[id]||FOLK.desmond,d=dir==='left'?'side':dir,L=F_.look,sk=SKIN[L.skin];
  const sp=Object.assign({skin:sk,hair:sk,hairStyle:'cropped',iris:F_.iris||'#3a2418'},F_);
  const a=art(40,90,6,30,F_.s||S,Ad=>{K.drawChar(Ad,sp,d,0,idle);BLA.extras(Ad,{look:L},dir,0)});
  v={c:a.c,ax:a.sx(14),ay:a.sy(50)}}
 fcache.set(k,v);return v;
}

// ================= PORTRAITS (64 x 64, Storybook faces, Lantern Bust box) =================
// The Asset Library's portrait kit (as in the other cases): drawn pixel by pixel in a layer, then a light rim on the
// lit edges and a dark outline, on a lit backing.
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
const PORT={
// Wren Hollis: sixty-one, small, silver hair cut short and neat, half-moon glasses on a chain, a gray cardigan, a
// knitting needle stuck behind one ear (her weird trait), tired kind eyes
WREN:{bg:'#2e2a34',f(L,t){const s='#f0c8a8',hc='#d8d8dc',u='#8a8a90';
 body(L,u);for(let y=50;y<64;y+=3)L.rm(10,y,44,1,sh(u,-18));L.r(27,44,10,6,sh(s,-30));L.r(30,48,4,16,'#c8c0d0');
 ears(L,s);head(L,32,32,14,15,s);L.e(31,20,15,7,hc);L.r(17,20,3,9,hc);L.r(44,20,3,9,sh(hc,-20));L.tex(hc,'#b8b8c0',4);
 L.r(46,10,2,24,'#c8a040');L.p(46,9,'#e8c870');
 for(const x of[20,36]){L.r(x,30,9,6,'#5a4a3a');L.r(x+1,31,7,4,'#e6eef4')}L.r(29,31,6,1,'#5a4a3a');L.r(19,33,1,12,'#c8a040');L.r(45,33,1,12,'#c8a040');
 eye(L,21,28,'#6a8aa0',-1);eye(L,37,28,'#6a8aa0',1);L.r(21,36,6,1,sh(s,-30));L.r(37,36,6,1,sh(s,-30));
 brows(L,sh(hc,-50),25,1);nose(L,s,37);L.r(19,39,4,2,'#e8a090');L.r(41,39,4,2,'#e8a090');
 if(t)mouth(L,32,43,7,true);else{L.r(28,44,8,1,MR);L.p(27,43,MR);L.p(36,43,MR)}}},
// Desmond Pryor: sixty-four, a night guard's navy blazer and a red tie, a gray mustache like a push broom, reading
// glasses pushed up on a bald head, a pen behind his ear
DESMOND:{bg:'#26304a',f(L,t){const s='#9a6a48',hc='#c8c8c8',u='#2e3a5a';
 body(L,u);L.r(28,46,8,18,'#e8e4d8');L.r(30,48,4,16,'#a8323e');L.r(40,52,8,6,'#c8a040');L.r(27,44,10,4,sh(s,-30));
 ears(L,s);head(L,32,31,15,16,s);L.e(27,19,8,4,sh(s,22));L.r(17,26,3,8,hc);L.r(44,26,3,8,sh(hc,-20));
 for(const x of[22,35]){L.r(x,16,8,1,'#c0c0c8');L.r(x,20,8,1,'#c0c0c8')}L.r(44,18,8,2,'#2a3a6a');
 eye(L,21,28,'#2a1a14',-1);eye(L,37,28,'#2a1a14',1);brows(L,hc,25,1);nose(L,s,35);
 L.r(24,38,16,4,hc);L.tex(hc,'#a8a8a8',3);
 if(t)mouth(L,32,42,7,true);else L.r(28,43,8,1,MR)}}
};
PORT['MS. HOLLIS']=PORT.WREN;
const pcache={};
function portraitCanvas(name,open){const k=name+(open?1:0);if(pcache[k])return pcache[k];
 const P_=PORT[name],L=Ly(64,64),c=K.mk(64,64),g=c.getContext('2d');P_.f(L,open?1:0);
 const gr=g.createRadialGradient(22,18,4,32,32,46);gr.addColorStop(0,sh(P_.bg,34));gr.addColorStop(1,P_.bg);g.fillStyle=gr;g.fillRect(0,0,64,64);
 const o=finish(L);for(let i=0;i<o.length;i++)if(o[i]){g.fillStyle=o[i];g.fillRect(i%64,(i/64)|0,1,1)}
 return pcache[k]=c}
const portraits={};
for(const name of Object.keys(PORT))portraits[name]=(ctx,open)=>{ctx.clearRect(0,0,64,64);ctx.drawImage(portraitCanvas(name,open),0,0)};

// ================= BIG HAT'S BRIEFING PLACE: a payphone in the snow =================
// A payphone booth outside a gas station that closed in the spring, first snow, at night. Drawn in the back room's
// layout (spec 013): his bust centered in the booth's steel frame, the dead canopy and the price sign behind him, one
// lamp over the booth so his face reads, snow coming down past it; in front of him, where the desk would be, the booth's
// shelf with the phone book on its chain, a stack of quarters and the receiver's cord.
const payphone={
 back(c,v){const{VW,VH,fy,mid,now}=v,R=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))};
  R(0,0,VW,VH,'#0c0e18');for(let y=0;y<fy;y+=6)R(0,y,VW,3,y%12?'#0e1220':'#10142a');
  // the gas station canopy, dark, and the price sign still lit at the edge
  R(0,fy-112,VW,10,'#2a2a34');R(0,fy-102,VW,2,'#3a3a44');for(let x=((mid-30)%60+60)%60;x<VW;x+=60)R(x,fy-100,6,100,'#1e1e28');
  const sx=mid+70;R(sx,fy-96,28,40,'#2a2a34');R(sx+2,fy-94,24,36,'#e8e0c8');c.font='8px monospace';c.fillStyle='#a8323e';c.fillText('2.89',sx+4,fy-82);c.fillText('2.99',sx+4,fy-70);R(sx+12,fy-56,4,56,'#2a2a34');
  // the booth: a steel frame round him, wired glass, the lamp over it
  R(mid-46,fy-122,92,6,'#6a7078');R(mid-46,fy-116,4,116,'#6a7078');R(mid+42,fy-116,4,116,'#6a7078');
  c.fillStyle='rgba(150,170,190,.12)';c.fillRect(mid-42,fy-116,10,116);c.fillRect(mid+32,fy-116,10,116);
  R(mid-14,fy-128,28,6,'#c8a040');R(mid-10,fy-122,20,2,'#fff2c8');
  c.fillStyle='rgba(255,226,170,.12)';c.beginPath();c.moveTo(mid-12,fy-120);c.lineTo(mid+12,fy-120);c.lineTo(mid+50,fy);c.lineTo(mid-50,fy);c.fill();
  // the phone on the booth's back wall, at his right shoulder
  R(mid+18,fy-70,20,30,'#8a8e96');R(mid+20,fy-66,16,10,'#2a2a30');for(let i=0;i<9;i++)R(mid+21+(i%3)*5,fy-52+((i/3)|0)*4,3,2,'#c0c0c8');
  // snow falling past
  for(let i=0;i<60;i++){const x=(hsh(i,1,711)*VW+now/40*(.5+hsh(i,2,711)))%VW,y=(hsh(i,3,711)*VH+now/26*(.6+hsh(i,4,711)))%VH;R(x,y,i%5?1:2,i%5?1:2,'rgba(240,244,250,.8)')}
  R(0,fy-4,VW,VH,'#1a1c26')},
 lift:2,
 front(c,v){const{VW,VH,fy,mid}=v,R=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))};
  // the ground: snow over asphalt, his footprints in it
  R(0,fy,VW,VH-fy,'#c8ccd4');for(let i=0;i<40;i++)R(hsh(i,5,712)*VW,fy+6+hsh(i,6,712)*(VH-fy),3,1,'#a8acb8');for(let i=0;i<6;i++)R(mid-12+(i%2)*14,fy+24+i*9,6,3,'#8a8e9a');
  // the booth's shelf where the desk would be: a phone book on a chain, quarters, the receiver cord
  R(mid-60,fy,120,8,'#6a7078');R(mid-60,fy,120,2,'#8a9098');R(mid-56,fy+8,112,4,'#3a3e46');
  R(mid-50,fy-12,36,12,'#e8c84a');R(mid-50,fy-12,36,2,'#f8e070');R(mid-46,fy-8,28,1,'#2a2030');for(let i=0;i<5;i++)R(mid-12+i*2,fy-4+((i%2)),2,2,'#c0c0c8');
  for(let i=0;i<5;i++)R(mid+18,fy-3-i*2,8,2,i%2?'#d8d8e0':'#b8b8c0');
  c.strokeStyle='#2a2a30';c.lineWidth=2;c.beginPath();c.moveTo(mid+36,fy-40);for(let i=0;i<8;i++)c.lineTo(mid+38+((i%2)?4:-2),fy-36+i*4);c.stroke();
  R(mid-60,fy+12,4,VH,'#6a7078');R(mid+56,fy+12,4,VH,'#6a7078')}
};

return{paint,props,folk,portraits,fx,payphone,lilyGlint,FOLK,PORT,portraitCanvas};
})();
