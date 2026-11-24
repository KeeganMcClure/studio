// Life After look: the palette, people, portraits, cars, icons, the top bar card and the cardboard menu surface.
// Final drawing code (studio.md: final sprites go in assets/ as drawing code). Built from the approved look mockups'
// shared code, mockups/la-look-rough-v3.js (04 street v2, 05 builder v2, 06 sprite reference v3, approved Nov 23),
// with the survivor's looks parts added (survivor.md, Looks parts): body, skin, face, hair style and color,
// the job's outfit in 4 color sets, and age.
// Light: one sun from the upper left. Hard shadows to the lower right. Flat shapes and tone, no grain (bible, Art).
(function(){
// ---------- palette (from the baseline frame, 02-baseline-san-rough-v2, NIGHT and DAY sets, grown into ramps) ----------
const P={
  out:'#0c0e10', ink:'#1e1a16',
  // asphalt, concrete, grass, dirt
  asph:['#7a766c','#6e6a62','#5e5a54','#4a4844'], conc:['#bcb59c','#a8a28a','#8e8a76','#6e6c5e'],
  grass:['#8c9058','#747852','#5e6444','#464c36'], dirt:['#9a845c','#84704e','#6a5a40','#4e4434'],
  // building walls
  stucco:['#c8c4aa','#aeae96','#9a9e8a','#7a8070'], tealw:['#7e9a96','#5a7472','#46605e','#34484a'],
  roof:['#8a8a80','#74746c','#5e5e58','#46464a'], brick:['#b4582e','#9a4a28','#7a3e26','#5a2e1e'],
  ochre:['#e8d0a0','#d8c08a','#b8a070','#8a7650'],
  // people
  skin:['#ecc09a','#d8a880','#b47e5e','#8a5a48'], skinB:['#b47e5e','#8e5e44','#6e4634','#4e3226'],
  zom:['#bcbe9a','#a8aa88','#868a6c','#5e6650'],
  jeans:['#6a86a0','#4e6a86','#3a5068','#283a4e'], coverall:['#7e9a96','#5a7472','#46605e','#30403e'],
  red:['#d06a3a','#b4582e','#8a4028','#6a3424'], mail:['#9aa8b4','#7e8c9a','#606e7c','#46525e'],
  navy:['#46526e','#36405a','#283046','#1c2232'], over:['#5a7a9a','#46647e','#344c62','#243646'],
  cap:['#6e8a4a','#56703a','#42582e','#2e3e20'], boot:['#5e4a3a','#46382c','#34281e','#221a14'],
  hairD:['#4a3a30','#3a2c24','#2a201a','#1a1410'], hairG:['#a8a49a','#8a867c','#6e6a62','#4e4a44'],
  blood:'#7a1e1a', bloodD:'#4a1210', bone:'#e8e0c8',
  cyan:'#3ff0e8', pink:'#ff4fa3', amber:'#ffb43a', warm:'#e8c88a',
  // UI
  card:'#14181a', cardHi:'#2a3234', line:'#8e9a94', text:'#e8dcc0', dim:'#9aa094',
  kraft:['#d2ac74','#c09a64','#a6824e','#86683c'], tape:['#c4c8c4','#a8aca8','#868a86'], marker:'#1c1a18', markR:'#8a2a1e'
};
window.LAP=P;

// ---------- pixel helpers ----------
function mk(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.imageSmoothingEnabled=false;return [c,g];}
function R(g,col,x,y,w,h){g.fillStyle=col;g.fillRect(x|0,y|0,w|0,h|0);}
function px(g,col,x,y){g.fillStyle=col;g.fillRect(x|0,y|0,1,1);}
// shaded ellipse: four tones from one upper-left light
function vol(g,cx,cy,rx,ry,ramp,clip,dir){const dx=dir?dir[0]:-.62,dy=dir?dir[1]:-.72;
  for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++)for(let x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++){
    const nx=(x+.5-cx)/rx,ny=(y+.5-cy)/ry,r2=nx*nx+ny*ny;if(r2>1)continue;if(clip&&!clip(x,y))continue;
    const nz=Math.sqrt(1-r2),l=.55*nz+.5*(dx*nx+dy*ny);
    px(g,l>.62?ramp[0]:l>.3?ramp[1]:l>.02?ramp[2]:ramp[3],x,y);}
}
// shaded box (cylinder across x): light on the left, deep on the right
function box(g,x,y,w,h,ramp){for(let i=0;i<w;i++){const t=(i+.5)/w;R(g,t<.25?ramp[0]:t<.6?ramp[1]:t<.88?ramp[2]:ramp[3],x+i,y,1,h);}}
function data(g,w,h){return g.getImageData(0,0,w,h);}
function hex(c){return [parseInt(c.slice(1,3),16),parseInt(c.slice(3,5),16),parseInt(c.slice(5,7),16)];}
// a four-tone ramp (light, base, shade, deep) from one base color
function mix(a,b,k){const x=hex(a),y=hex(b);return '#'+x.map((v,i)=>Math.round(v+(y[i]-v)*k).toString(16).padStart(2,'0')).join('');}
function ramp(c){return [mix(c,'#fff4e0',.22),c,mix(c,'#10141a',.28),mix(c,'#10141a',.52)];}
// selective outline: deep outline on the shadow side (right, bottom), a dark tone of the part's own color on the lit side
function outline(c,g){
  const w=c.width,h=c.height,d=data(g,w,h),o=new Uint8ClampedArray(d.data),A=(x,y)=>x<0||y<0||x>=w||y>=h?0:d.data[(y*w+x)*4+3];
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){if(A(x,y))continue;
    const L=A(x+1,y),T=A(x,y+1),Rr=A(x-1,y),B=A(x,y-1);if(!(L||T||Rr||B))continue;
    const i=(y*w+x)*4;let r=12,gg=14,b=16;
    if((L||T)&&!(Rr||B)){const j=L?(y*w+x+1)*4:((y+1)*w+x)*4;r=d.data[j]*.45;gg=d.data[j+1]*.45;b=d.data[j+2]*.48;}
    o[i]=r;o[i+1]=gg;o[i+2]=b;o[i+3]=255;}
  d.data.set(o);g.putImageData(d,0,0);
}
// rim light on the lit edge (portraits and big sprites)
function rim(c,g,col){
  const w=c.width,h=c.height,d=data(g,w,h),o=new Uint8ClampedArray(d.data),A=(x,y)=>x<0||y<0||x>=w||y>=h?0:d.data[(y*w+x)*4+3],[cr,cg,cb]=hex(col);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){if(!A(x,y))continue;if(A(x-1,y)&&A(x,y-1))continue;
    // the pixel just inside the outline gets the rim
    if(!(A(x-2,y)&&A(x,y-2))){} }
  for(let y=1;y<h;y++)for(let x=1;x<w;x++){const i=(y*w+x)*4;if(!A(x,y))continue;
    const edge=!A(x-2,y)||!A(x,y-2);const inner=A(x-1,y)&&A(x,y-1);
    if(edge&&inner){o[i]=(o[i]+cr*1.4)/2.4;o[i+1]=(o[i+1]+cg*1.4)/2.4;o[i+2]=(o[i+2]+cb*1.4)/2.4;}}
  d.data.set(o);g.putImageData(d,0,0);
}
function shadow(g,x,y,w,a){g.fillStyle='rgba(10,12,14,'+(a||.38)+')';g.beginPath();g.ellipse(x,y,w,w*.32,0,0,7);g.fill();}

// ---------- map sprite: 14 x 26 in a 18 x 30 frame (room for the outline) ----------
// o: {skin, hair, hairStyle, top, legs, boots, kind:'surv'|'zom', job, cap, gore, arm, face:'down'|'right'}
function person(o){
  const [c,g]=mk(18,30),X=2,S=o.skin||P.skin,top=o.top||P.coverall,legs=o.legs||P.jeans,bt=o.boots||P.boot,z=o.kind==='zom';
  const sh=o.short?3:0,Y=2+sh,lean=z?(o.lean==null?1:o.lean):0,hx=lean,hy=z?1:0,lh=6-sh;
  const H=o.hair||P.hairD;
  // long hair hangs behind the head and shoulders
  if(o.hairStyle==='long')vol(g,X+7+hx,Y+8+hy,5.6,7,H,(x,y)=>x<X+4+hx||x>X+10+hx||y<Y+6);
  if(o.hairStyle==='pony'){vol(g,X+12+hx,Y+7+hy,2,4,H);px(g,'#c8503a',X+11+hx,Y+4+hy);}
  if(o.hairStyle==='mullet')vol(g,X+7+hx,Y+8+hy,5.4,4,H,(x,y)=>x<X+4+hx||x>X+10+hx);
  // legs and boots (a deep gap between the legs, shade on the far side)
  // walking: one leg lifts a pixel on each step (o.step 1 or 2)
  const u1=o.step===1?1:0,u2=o.step===2?1:0;
  box(g,X+3,Y+18,3,lh-u1,legs);box(g,X+8,Y+18,3,lh-u2,legs);
  if(o.shorts){R(g,S[1],X+3,Y+21,3,lh-3);R(g,S[2],X+5,Y+21,1,lh-3);R(g,S[1],X+8,Y+21,3,lh-3);R(g,S[2],X+10,Y+21,1,lh-3);}
  const fy=Y+18+lh;box(g,X+2,fy-u1,4,2,bt);box(g,X+8,fy-u2,4,2,bt);px(g,'#9a8a74',X+3,fy-u1);px(g,'#9a8a74',X+9,fy-u2);
  // body: rounded, shaded from its shape
  vol(g,X+7,Y+15,o.bw||5.4,5.2,top,(x,y)=>y>=Y+11&&y<Y+19);
  if(o.apron){R(g,o.apron[1],X+4,Y+14,6,4);R(g,o.apron[2],X+9,Y+14,1,4);R(g,o.apron[0],X+5,Y+11,1,3);R(g,o.apron[0],X+8,Y+11,1,3);}
  if(o.vest){R(g,o.vest[1],X+3,Y+12,2,6);R(g,o.vest[2],X+9,Y+12,2,6);R(g,'#e8e8d8',X+3,Y+15,2,1);R(g,'#c8c8b8',X+9,Y+15,2,1);}
  if(o.overalls){vol(g,X+7,Y+17,4.2,3.4,P.over,(x,y)=>y>=Y+14&&y<Y+19);R(g,P.over[0],X+4,Y+11,1,3);R(g,P.over[2],X+9,Y+11,1,3);px(g,'#e8d08a',X+4,Y+14);px(g,'#e8d08a',X+9,Y+14);}
  // belt
  R(g,'#2a221c',X+3,Y+18,8,1);px(g,'#c8b070',X+7,Y+18);
  // collar, seams and details
  px(g,top[0],X+5,Y+11);px(g,top[0],X+6,Y+12);px(g,top[3],X+8,Y+12);px(g,top[2],X+9,Y+11);R(g,top[3],X+7,Y+13,1,5);
  if(o.patch){R(g,'#f0e6d0',X+4,Y+14,2,1);}
  if(o.badge)px(g,'#e8d08a',X+4,Y+13);
  if(o.tag)R(g,'#f0ece0',X+4,Y+13,2,1);
  if(o.number)R(g,o.number,X+6,Y+14,2,2);
  if(o.bag){for(let i=0;i<7;i++)px(g,'#5e4026',X+3+i,Y+11+i);box(g,X+9,Y+16,4,4,['#a87e4e','#84603a','#6a4a2e','#4e3622']);px(g,'#c8a070',X+10,Y+16);}
  // arms: separate from the body by a deep line, with hands
  const armL=o.arm!=='noL',armR=o.arm!=='noR',dl=top[3];
  if(z){ // reaching
    if(armL){box(g,X,Y+12,2,4,top);R(g,dl,X+2,Y+12,1,3);box(g,X,Y+16,2,2,S);}
    if(armR){box(g,X+12,Y+11-(o.lean<0?0:1),2,4,top);R(g,dl,X+11,Y+12,1,3);box(g,X+12,Y+15-(o.lean<0?0:1),2,2,S);}
    else{px(g,P.blood,X+12,Y+12);px(g,P.bone,X+12,Y+13);px(g,P.bloodD,X+12,Y+14);}
  }else{box(g,X,Y+11,2,6,top);box(g,X+12,Y+11,2,6,top);R(g,dl,X+2,Y+12,1,5);R(g,dl,X+11,Y+12,1,5);box(g,X,Y+17,2,2,S);box(g,X+12,Y+17,2,2,S);}
  // neck and head
  vol(g,X+7+hx,Y+6+hy,4.6,5,S);
  // hair or cap
  if(o.cap){vol(g,X+7+hx,Y+3+hy,5,3,o.cap,(x,y)=>y<Y+4+hy);R(g,o.cap[2],X+3+hx,Y+4+hy,9,1);R(g,o.cap[3],X+5+hx,Y+5+hy,6,1);}
  else if(o.hairStyle==='buzz'){vol(g,X+7+hx,Y+4+hy,4.8,3.4,[H[1],H[1],H[2],H[2]],(x,y)=>y<Y+3+hy);}
  else if(o.hairStyle!=='bald'){vol(g,X+7+hx,Y+3.6+hy,5,3.6,H,(x,y)=>y<Y+4+hy||x<X+3+hx||x>X+10+hx);px(g,H[0],X+5+hx,Y+2+hy);px(g,H[2],X+8+hx,Y+4+hy);
    if(o.hairStyle==='curly'){for(const [a,b] of [[2,2],[4,0],[7,0],[10,1],[12,3]])px(g,H[1],X+a+hx,Y+b+hy);px(g,H[0],X+5+hx,Y+1+hy);}
    if(o.hairStyle==='part')R(g,H[3],X+5+hx,Y+1+hy,1,2);}
  if(o.gray&&o.hairStyle!=='bald'&&!o.cap){px(g,P.hairG[0],X+4+hx,Y+3+hy);px(g,P.hairG[1],X+10+hx,Y+4+hy);}
  // face
  if(o.face==='up'){vol(g,X+7+hx,Y+6+hy,4.6,5,H,(x,y)=>y<Y+9+hy);}
  else if(o.face==='right'){px(g,z?'#d8d8b0':'#2a1e1a',X+9+hx,Y+6+hy);px(g,S[2],X+10+hx,Y+8+hy);}
  else{px(g,z?'#e0e0c0':'#2a1e1a',X+5+hx,Y+6+hy);px(g,z?'#e0e0c0':'#2a1e1a',X+8+hx,Y+6+hy);px(g,S[2],X+6+hx,Y+8+hy);px(g,S[2],X+7+hx,Y+8+hy);}
  if(z){ // gore on top: torn cloth, wounds, bone
    px(g,P.blood,X+4,Y+13);px(g,P.bloodD,X+5,Y+14);px(g,P.blood,X+4,Y+15);
    px(g,P.bone,X+9+hx,Y+3+hy);px(g,P.blood,X+8+hx,Y+9+hy);px(g,P.bloodD,X+7+hx,Y+9+hy);
    if(o.gore==='heavy'){R(g,P.blood,X+6,Y+15,3,2);px(g,P.bone,X+7,Y+15);px(g,P.bloodD,X+9,Y+19);}
  }
  outline(c,g);return c;
}


// ---------- cars: side view with the roof showing (3/4), front to the right ----------
// o: {len, ramp, wagon, wreck}
function car(o){
  const L=o.len||46,[c,g]=mk(L+4,30),x=2,y=2,K=o.ramp,glass=['#9ab8c0','#4e6e78','#34505a','#22343c'];
  const c0=x+Math.round(L*.24),c1=x+Math.round(L*(o.wagon?.86:.7)); // cabin from the back pillar to the windshield
  // body: a long box with rounded ends, lit along the top edge, deep along the sill
  for(let i=0;i<L;i++){const end=i<2||i>L-3;const top=y+9+(end?1:0),bot=y+19-(end?1:0);
    R(g,K[0],x+i,top,1,1);R(g,K[1],x+i,top+1,1,5);R(g,K[2],x+i,top+6,1,bot-top-7);R(g,K[3],x+i,bot-1,1,1);}
  // hood and trunk dip a little below the beltline
  R(g,K[1],x+L-9,y+9,9,1);
  // cabin: roof seen from above, then the glass with a slanted windshield and back window
  for(let j=0;j<8;j++){const a=c0+Math.round((7-j)*.6),b=c1-Math.round((7-j)*(o.wagon?.4:1.1))+ (j>5?2:0);
    R(g,j<2?K[0]:glass[j<4?1:2],a,y+1+j,Math.max(1,b-a+(j<2?0:0)),1);}
  R(g,K[1],c0+3,y+1,c1-c0-6,1);
  // pillars and a sky streak on the glass
  const mid=Math.round((c0+c1)/2);R(g,K[2],mid,y+3,2,6);if(o.wagon)R(g,K[2],c0+Math.round((c1-c0)*.75),y+3,2,6);
  for(let j=0;j<4;j++)px(g,glass[0],c1-6-j,y+3+j);for(let j=0;j<3;j++)px(g,glass[0],mid-4-j,y+3+j);
  // door seams, handles, a chrome strip, bumpers and lights
  R(g,K[3],mid,y+10,1,7);R(g,K[3],c0+1,y+10,1,7);px(g,'#d8d8d0',mid+3,y+12);px(g,'#d8d8d0',c0+4,y+12);
  if(o.wagon){R(g,'#7a5230',x+4,y+12,L-10,3);R(g,'#a87a48',x+4,y+12,L-10,1);R(g,'#5a3a20',x+4,y+14,L-10,1);}
  else R(g,'#c8ccc8',x+3,y+13,L-6,1);
  R(g,'#c8ccc8',x,y+16,3,2);R(g,'#c8ccc8',x+L-3,y+16,3,2);
  R(g,'#f0e0a0',x+L-2,y+11,2,2);R(g,'#c8503a',x,y+11,2,2);
  // wheels under arches
  for(const wx of [x+Math.round(L*.2),x+Math.round(L*.8)]){
    g.fillStyle='#14161a';g.beginPath();g.arc(wx,y+18,5,Math.PI,0);g.fill();
    const flat=o.wreck&&wx>x+L/2;
    g.fillStyle='#1e1e20';g.beginPath();g.ellipse(wx,y+18+(flat?1:0),4,flat?3:4,0,0,7);g.fill();
    R(g,'#8a8e90',wx-1,y+17+(flat?1:0),2,2);px(g,'#c8ccc8',wx-1,y+17+(flat?1:0));}
  if(o.wreck){ // crumpled nose, starred windshield, rust and blood
    R(g,K[3],x+L-6,y+9,6,2);px(g,K[3],x+L-8,y+10);R(g,'#2a2e30',x+L-3,y+11,3,2);
    for(const [dx,dy] of [[0,0],[1,-1],[-1,1],[2,1],[-2,-1],[1,2]])px(g,'#d8e8ec',c1-5+dx,y+5+dy);
    R(g,P.blood,mid+4,y+15,3,1);
  }
  outline(c,g);return c;
}

// ---------- 64 x 64 portrait on a lit backing ----------
// o: {skin, hair, hairStyle, top, mood:'ok'|'scared'|'hurt'|'tired', zom, cap, stubble, back}
function portrait(o){
  const [f,g]=mk(64,64),S=o.skin||P.skin,H=o.hair||P.hairD,T=o.top||P.coverall,z=!!o.zom;
  // shoulders and collar
  vol(g,32,62,o.sw||28,15,T);
  if(o.apron){R(g,o.apron[1],22,50,4,14);R(g,o.apron[2],38,50,4,14);}
  if(o.vest){R(g,o.vest[1],12,52,12,12);R(g,o.vest[2],40,52,12,12);R(g,'#e8e8d8',12,58,12,2);R(g,'#c8c8b8',40,58,12,2);}
  if(o.badge){R(g,'#e8d08a',42,54,4,4);px(g,'#a88a40',45,57);}
  if(o.tag){R(g,'#f0ece0',40,55,9,4);R(g,'#8a2a1e',41,56,7,1);}
  if(o.number){R(g,o.number,29,54,2,8);R(g,o.number,33,54,4,2);R(g,o.number,35,56,2,6);}
  if(o.overalls){R(g,P.over[1],20,54,5,10);R(g,P.over[2],40,54,5,10);}
  R(g,T[0],22,47,6,3);R(g,T[2],37,47,6,3); // collar points
  if(o.patch){R(g,'#e8dcc0',14,55,8,4);R(g,'#8a4028',15,56,6,1);}
  const F=FACES[o.faceN||0];
  if(o.hairStyle==='long'&&!o.cap)vol(g,32,36,F[0]+4,24,H,(x,y)=>x<21||x>43||y<27);
  if(o.hairStyle==='pony'&&!o.cap){vol(g,47,30,4,8,H);R(g,'#c8503a',44,24,3,3);}
  if(o.hairStyle==='mullet'&&!o.cap)vol(g,32,40,F[0]+2,10,H,(x,y)=>(x<23||x>41)&&y>30);
  // neck
  box(g,26,40,12,8,S);R(g,S[3],27,46,10,1);R(g,S[2],27,40,10,2);
  // head
  const cx=32+(z?2:0),cy=28+(z?2:0);
  const fx=F[0],fy=F[1];
  vol(g,cx,cy,fx,fy,[S[0],S[1],S[2],S[2]],null,[-.9,-.15]);
  if(F[3]===1){vol(g,cx,cy+fy-5,fx-1,5,[S[1],S[1],S[2],S[2]],null,[-.9,-.15]);} // square jaw
  R(g,S[2],cx-5,cy+fy-1,11,1); // one clean shadow line under the jaw
  // ears
  vol(g,cx-fx,cy+1,2.6,4,S);vol(g,cx+fx,cy+1,2.6,4,S);px(g,S[3],cx+fx,cy+1);px(g,S[2],cx-fx,cy+1);
  // jaw shading and stubble as flat tone, no grain
  if(o.stubble){vol(g,cx+1,cy+9,10,6,[S[1],S[2],S[2],S[3]],(x,y)=>y>cy+5);}
  // hair
  if(o.cap){vol(g,cx,cy-9,14,8,o.cap,(x,y)=>y<cy-6);R(g,o.cap[2],cx-14,cy-7,28,2);R(g,o.cap[3],cx-10,cy-5,22,1);}
  else if(o.hairStyle!=='bald'){
    if(o.hairStyle==='buzz'){vol(g,cx,cy-8,fx+.3,9,[H[1],H[1],H[2],H[3]],(x,y)=>y<cy-7);}
    else{
    vol(g,cx,cy-8,fx+1.5,10,H,(x,y)=>y<cy-6||((x<cx-fx+3||x>cx+fx-2)&&y<cy+2));
    // locks that break the hairline
    for(const [x,y] of [[cx-6,cy-6],[cx-1,cy-5],[cx+5,cy-6],[cx+9,cy-5]]){px(g,H[1],x,y);px(g,H[2],x,y+1);}
    if(o.hairStyle==='curly')for(let a=0;a<9;a++){const t=Math.PI*(1.05+a*.11);vol(g,cx+Math.cos(t)*(fx+1),cy-8+Math.sin(t)*9,3,3,H);}
    if(o.hairStyle==='part'){R(g,H[3],cx-5,cy-17,1,7);R(g,H[0],cx-4,cy-16,6,1);R(g,H[0],cx-3,cy-14,8,1);}
    if(o.hairStyle==='pony')R(g,H[3],cx+fx-1,cy-6,2,3);
    }
    if(o.gray)for(const [x,y] of [[cx-9,cy-10],[cx-4,cy-13],[cx+3,cy-12],[cx+8,cy-9],[cx-fx+1,cy-2],[cx+fx-2,cy-1]])R(g,P.hairG[0],x,y,2,1);
  }
  // brows, eyes, nose, mouth by mood
  const m=o.mood||'ok',ey=cy+1,lx=cx-F[2],rx=cx+F[2]-1;
  const brow=(x,dy,tilt)=>{R(g,H[3],x-1,ey-4+dy,5,1);px(g,H[3],tilt>0?x+3:x-1,ey-5+dy);};
  if(z){R(g,'#d8d8b0',lx-1,ey,4,2);R(g,'#d8d8b0',rx-1,ey,4,2);px(g,'#7a7a60',lx+1,ey+1);px(g,S[3],rx+2,ey+1);
    R(g,S[3],lx-2,ey-2,5,1);R(g,S[3],rx-2,ey-2,5,1);}
  else{
    if(m==='scared'){
      // fear, not surprise: inner brows pulled up and together, eyes wide with the pupils darting to one side,
      // a tight grimace with the lower teeth showing, a sweat bead, and the face a shade paler
      for(const [ex,dir] of [[lx,1],[rx,-1]]){R(g,'#f2eadc',ex-1,ey,4,3);R(g,'#2a1e1a',ex+(dir>0?1:0)+1,ey+1,2,2);px(g,'#f8f4ec',ex+(dir>0?2:1),ey+1);R(g,S[2],ex-1,ey+3,4,1);}
      // brows: outer end low, inner end high, a crease between them
      R(g,H[3],lx-2,ey-3,3,1);R(g,H[3],lx+1,ey-4,2,1);px(g,H[3],lx+3,ey-5);
      R(g,H[3],rx+2,ey-3,3,1);R(g,H[3],rx,ey-4,2,1);px(g,H[3],rx-1,ey-5);
      R(g,S[2],cx,ey-5,1,3);
      px(g,'#e8f4f8',cx-12,ey-3);px(g,'#bcd4dc',cx-12,ey-2);
    }else{
    const wide=m==='tired'?1:2;
    R(g,'#f2eadc',lx-1,ey,4,wide);R(g,'#f2eadc',rx-1,ey,4,wide);
    R(g,'#2a1e1a',lx+1,ey,2,wide);R(g,'#2a1e1a',rx,ey,2,wide);px(g,'#f8f4ec',lx+1,ey);px(g,'#f8f4ec',rx,ey);
    if(m==='tired'){R(g,S[2],lx-1,ey+1,4,1);R(g,S[2],rx-1,ey+1,4,1);}
    brow(lx,0,1);brow(rx,0,-1);}
    if(m==='hurt'){R(g,S[3],rx-1,ey,4,1);R(g,'#2a1e1a',rx-1,ey+1,4,1);} // squint
  }
  // nose: a shade plane on the right, a light on the bridge
  R(g,S[2],cx+1,ey+2,2,5);px(g,S[0],cx-1,ey+3);R(g,S[3],cx-1,ey+7,4,1);
  // mouth
  if(z){R(g,'#3a1e1a',cx-4,ey+10,9,3);R(g,P.bone,cx-3,ey+10,1,1);R(g,P.bone,cx+1,ey+10,1,1);R(g,P.bone,cx+3,ey+12,1,1);}
  else if(m==='scared'){R(g,'#4a2420',cx-4,ey+10,9,2);R(g,'#e8e2d0',cx-3,ey+11,7,1);px(g,S[3],cx-5,ey+11);px(g,S[3],cx+5,ey+11);R(g,S[2],cx-3,ey+13,7,1);}
  else{R(g,S[3],cx-4,ey+11,8,1);px(g,S[2],cx-5,ey+10);px(g,S[1],cx-1,ey+12);}
  // age: lines under the eyes and beside the mouth, as flat tone
  if(!z&&o.age>=1){R(g,S[2],lx-1,ey+4,3,1);R(g,S[2],rx,ey+4,3,1);}
  if(!z&&o.age>=2){px(g,S[2],cx-6,ey+8);px(g,S[2],cx-6,ey+9);px(g,S[2],cx+6,ey+8);px(g,S[2],cx+6,ey+9);R(g,S[2],cx-4,cy-5,8,1);}
  // injuries and gore
  if(m==='hurt'){R(g,'#e8e2d0',cx-13,cy-8,26,4);R(g,'#c8c0aa',cx-13,cy-5,26,1);R(g,P.blood,cx+4,cy-8,4,3);px(g,P.blood,cx+8,cy-3);R(g,P.blood,cx+7,cy-2,1,3);
    R(g,S[3],lx-2,ey+4,3,2);}
  if(z){R(g,P.blood,cx+5,cy+6,4,3);px(g,P.bone,cx+6,cy+7);R(g,P.bloodD,cx+4,cy+9,3,2);R(g,P.blood,cx-12,cy-6,5,2);R(g,S[3],cx+9,cy-12,3,3);px(g,P.bone,cx+10,cy-11);
    R(g,P.blood,20,49,6,4);R(g,P.bloodD,22,53,3,6);}
  outline(f,g);rim(f,g,o.rimCol||'#fff0c8');
  // lit backing
  const [c,b]=mk(64,64),bk=o.back||['#5a7472','#46605e','#34484a'];
  R(b,bk[2],0,0,64,64);
  for(let r=30;r>0;r-=3){b.fillStyle=r>22?bk[2]:r>13?bk[1]:bk[0];b.beginPath();b.arc(24,22,r,0,7);b.fill();}
  b.drawImage(f,0,0);return c;
}

// ---------- small pixel icons for the top bar (7 x 7) ----------
const ICONS={
  food:['..xxx..','.x...x.','xxxxxxx','x.....x','x.xxx.x','x.....x','.xxxxx.'], // a can
  hp:['..xxx..','..xxx..','xxxxxxx','xxxxxxx','xxxxxxx','..xxx..','..xxx..'], // a cross
  rest:['...xx..','..xx...','.xx....','.xx....','.xx....','..xx..x','...xxx.'], // a moon
  san:['.......','..xxx..','.x...x.','x..x..x','.x...x.','..xxx..','.......'], // an eye
  leaf:['....xx.','..xxxx.','.xxxxx.','.xxxx..','x.xx...','.x.....','x......']
};
function icon(g,name,x,y,col){const m=ICONS[name];for(let j=0;j<7;j++)for(let i=0;i<7;i++)if(m[j][i]==='x')px(g,col,x+i,y+j);}

// ---------- the HUD: one framed card across the top ----------
// lead face (crop of the portrait), the four bars with icons and labels, then day, clock, season and place.
function hud(g,W,o){
  const h=42,x0=3,y0=3,w=W-6;
  R(g,'rgba(0,0,0,.35)',x0+2,y0+2,w,h);
  R(g,P.card,x0,y0,w,h);R(g,P.line,x0,y0,w,1);R(g,P.line,x0,y0,1,h);R(g,'#4e5854',x0,y0+h-1,w,1);R(g,'#4e5854',x0+w-1,y0,1,h);
  // face: the portrait's head, 32 x 32, on its own backing
  const fp=o.portrait;R(g,'#4e5854',x0+3,y0+3,36,36);g.drawImage(fp,14,10,34,34,x0+4,y0+4,34,34);
  // bars
  const bars=[['food','FOOD',o.food,'#d06a3a'],['hp','HP',o.hp,'#c8503a'],['rest','REST',o.rest,'#d8c08a'],['san','SAN',o.san,'#3ff0e8']];
  g.font='8px "Press Start 2P"';g.textBaseline='top';
  bars.forEach((b,i)=>{const bx=x0+44+(i%2)*56,by=y0+6+((i/2)|0)*17;
    icon(g,b[0],bx,by,b[3]);
    g.fillStyle=P.dim;g.font='8px VT323';
    R(g,"#2a3234",bx+10,by+1,42,5);R(g,b[3],bx+10,by+1,Math.round(42*b[2]/100),5);R(g,'rgba(255,255,255,.25)',bx+10,by+1,Math.round(42*b[2]/100),1);
    g.font="12px VT323";g.fillStyle=P.dim;g.fillText(b[1],bx+10,by+7);
  });
  // time and place
  const tx=x0+w-50;R(g,'#4e5854',tx-4,y0+4,1,h-8);
  g.font='8px "Press Start 2P"';g.fillStyle=P.warm;g.fillText('DAY '+o.day,tx,y0+6);
  g.font='16px VT323';g.fillStyle=P.text;g.fillText(o.clock,tx,y0+15);
  icon(g,'leaf',tx,y0+30,o.seasonCol||'#c8a050');g.font='12px VT323';g.fillStyle=P.dim;g.fillText(o.season,tx+9,y0+29);
  return h+3;
}

// ---------- the survivor's looks parts (survivor.md, Looks parts) ----------
// Faces: [half width, half height, eye gap, jaw]. Round, Long, Square, Soft, Sharp, Wide.
const FACES=[[14,15,6,0],[12,17,5,0],[14,16,6,1],[13,16,6,0],[12,16,5,0],[15,15,7,1]];
// Skin: Fair, Light (the mockups' skin), Tan, Olive, Brown, Dark
const SKINS=[ramp('#ecc4a4'),P.skin,ramp('#c8926a'),ramp('#b08a60'),P.skinB,ramp('#6a4430')];
// Hair: Black, Dark brown (the mockups' hair), Brown, Red, Blond, Gray
const HAIRS=[ramp('#2a2624'),P.hairD,ramp('#6a4a30'),ramp('#9a4a2a'),ramp('#c8a860'),P.hairG];
const STYLES=['short','buzz','part','curly','long','pony','mullet','bald'];
const BODY=[[4.6,25],[5.4,28],[6.3,31]]; // map sprite body width, portrait shoulders
const C=(a,b,c,d)=>[a,b,c,d].map(ramp);
// Each job's outfit in 4 color sets: the top's color, plus legs and what's on it.
const OUTFITS={
  scrubs:{top:C('#6a9a9a','#7a8ab4','#a87a8a','#7a9a6e'),legs:'top'},
  coverall:{top:[P.coverall,ramp('#5e6a7e'),ramp('#7e6a4e'),ramp('#6e7468')],patch:1},
  overalls:{top:C('#b4582e','#5e7aa0','#a8984e','#7e4e6a'),over:1,legs:'over'},
  uniform:{top:C('#46526e','#8a7a5a','#5e5a4e','#6a7480'),badge:1,legs:P.navy},
  cardigan:{top:C('#7e3e3e','#a88a3a','#5e6e4a','#4e5e7e'),legs:ramp('#8a7e66')},
  flannel:{top:C('#a83e2e','#3e6e4e','#3e5a8a','#7e5a3a'),patch:0},
  apron:{top:[ramp('#e0dccc'),ramp('#e0dccc'),ramp('#d8d0b8'),ramp('#e0dccc')],apron:C('#c8c4b4','#5a6a7a','#8a4a3a','#4e4e4e'),legs:ramp('#3e3e44')},
  jersey:{top:C('#c8a030','#a83a3a','#3a5a9a','#3a7a4e'),number:['#3a2a10','#f0e8d8','#f0e8d8','#f0e8d8'],shorts:1,legs:ramp('#3e3e44')},
  layers:{top:C('#6e6450','#5a5e4e','#7a6a5a','#4e5258'),legs:ramp('#4e4a40')},
  vest:{top:C('#8a8a80','#5e6e7e','#7e6a5a','#6e6e6e'),vest:C('#e88a2a','#d8d040','#e88a2a','#d8d040')},
  fatigues:{top:C('#6a6e4a','#8a7e5a','#5a5e46','#6e6a5a'),legs:'top'},
  polo:{top:C('#a83a3a','#3a5a8a','#3e7a5a','#b8902e'),tag:1,legs:ramp('#9a8a6a')}
};
// Turn a survivor's looks and job into drawing options for person() and portrait().
function dress(look,outfit){
  look=look||{};const O=OUTFITS[outfit]||OUTFITS.coverall,k=look.colors||0,age=look.age||0;
  let hair=HAIRS[look.hairColor||0];if(age===2)hair=hair.map(c=>mix(c,'#a8a49a',.45));
  const top=O.top[k],legs=O.legs==='top'?top:O.legs==='over'?P.over:(O.legs||P.jeans);
  return {skin:SKINS[look.skin||0],hair,hairStyle:STYLES[look.hairStyle||0],top,legs,
    bw:BODY[look.body==null?1:look.body][0],sw:BODY[look.body==null?1:look.body][1],faceN:look.face||0,age,gray:age===2,
    patch:O.patch,overalls:O.over,badge:O.badge,tag:O.tag,apron:O.apron&&O.apron[k],vest:O.vest&&O.vest[k],number:O.number&&O.number[k],shorts:O.shorts};
}

// ---------- the menu surface (bible.md, Art, Menu surface; mockup 05) ----------
// Flattened cardboard: a lit spot upper left, darker edges, the flutes showing on the cut top edge. Flat tones only.
function cardboard(g,x,y,w,h){
  const K=P.kraft;
  R(g,'rgba(0,0,0,.4)',x+2,y+2,w,h);
  R(g,K[1],x,y,w,h);
  g.save();g.beginPath();g.rect(x,y,w,h);g.clip();g.fillStyle=K[0];g.beginPath();g.ellipse(x+w*.32,y+h*.3,w*.3,Math.max(8,h*.28),0,0,7);g.fill();g.restore();
  R(g,K[2],x,y,w,2);R(g,K[2],x,y,2,h);R(g,K[3],x,y+h-2,w,2);R(g,K[3],x+w-2,y,2,h);
  for(let i=x+3;i<x+w-3;i+=4){px(g,K[3],i,y+1);px(g,K[0],i+1,y);px(g,K[0],i+2,y);}
}
function tape(g,x,y,w,h){R(g,P.tape[1],x,y,w,h);R(g,P.tape[0],x,y,w,1);R(g,P.tape[2],x,y+h-1,w,1);for(let i=x;i<x+w;i+=3)px(g,P.tape[2],i,y+h);}
// a card on the cardboard: lighter kraft, a shadow, the picked one edged in cyan with a cursor
function card(g,x,y,w,h,on){
  const K=P.kraft;R(g,'rgba(60,40,20,.35)',x+2,y+2,w,h);R(g,on?'#e2c48e':K[0],x,y,w,h);R(g,K[2],x,y+h-1,w,1);R(g,K[2],x+w-1,y,1,h);
  if(on){g.strokeStyle=P.cyan;g.lineWidth=2;g.strokeRect(x-1,y-1,w+2,h+2);R(g,P.cyan,x-6,y+4,3,7);px(g,P.cyan,x-3,y+7);}
}
// the taped photo of a portrait, 72 x 82, with the name under it in marker
function photo(g,x,y,por,name){
  R(g,'rgba(0,0,0,.35)',x+2,y+2,72,82);R(g,'#ece6d8',x,y,72,82);R(g,'#d2ccbe',x,y+79,72,2);
  g.drawImage(por,x+4,y+4);tape(g,x-4,y-2,14,5);tape(g,x+62,y-2,14,5);
  if(name){g.font='16px VT323';g.textBaseline='top';g.fillStyle=P.marker;const t=fit(g,name.toUpperCase(),64);g.fillText(t,x+36-g.measureText(t).width/2,y+67);}
}
// word wrap to a width, in the current font. A word longer than the line is split, never cut.
function wrap(g,t,max){const out=[];let line='';for(const w of String(t).split(' ')){const s=line?line+' '+w:w;if(line&&g.measureText(s).width>max){out.push(line);line=w;}else line=s;}if(line)out.push(line);return out;}
// a name that must fit one line: steps the font down rather than cutting it (ui.md, No cut-off names)
function fit(g,t,max){if(g.measureText(t).width<=max)return t;g.font='12px VT323';return t;}

window.LA={P,mk,R,px,vol,box,outline,rim,shadow,person,portrait,icon,hud,car,ramp,mix,dress,FACES,cardboard,tape,card,photo,wrap,fit};
})();
