// SHARED SHELF · v1 pieces, seeded Nov 20, 2026 from the Black Lantern Asset Library (Nov 15).
// Every color is a palette slot: P.outline, P.wood ... Call SHELF.use(palette) before drawing.
// Wide scale: 16 px tiles. Sprites are designed in "design pixels" and drawn at s = 0.5.
// UI pieces (shell, dialog) added Nov 20, 2026 from Rushlight's approved mockups; they draw in screen pixels.
const SHELF=(()=>{
const T=16,S=.5;

/* ---------- PALETTES ---------- */
const SLOTS=[
 ["outline","sprite outlines, darkest line"],["panel","UI panels, iron, posts"],["text","text, linen, eye whites"],["light","flame, lamp glass"],["accent","warnings, stripes, red gear"],
 ["shadeTo","what shade() darkens toward"],["lightTo","what shade() lightens toward"],["night","edge darkening at dusk"],["duskTint","dusk color wash"],["glow","color of light pools"],
 ["mouth","mouths"],["blush","cheeks"],["wood","planks, benches"],["woodDark","frames, gaps, trunks"],["earth","dirt road"],["stone","cool paving"],["stoneWarm","warm paving, steps"],
 ["grass","grass, stems"],["cream","paint, fences, sills"],["brick","brick, chimneys"],["brass","knobs, gold leaves"],["cloth","curtains"],["glass","lit windows"],["straw","hay, thatch"],["pumpkin","gourds, orange leaves"]];
const PALETTES={
 blacklantern:{outline:"#140d16",panel:"#2a2030",text:"#f3ede2",light:"#ffd166",accent:"#b5532e",shadeTo:"#22182e",lightTo:"#ffecc8",night:"#1b1f33",duskTint:"#a8806e",glow:"#ffbe60",
  mouth:"#6a2a32",blush:"#e0837a",wood:"#6a4a32",woodDark:"#3a281e",earth:"#6b4f37",stone:"#6b6270",stoneWarm:"#7a6c62",grass:"#4a5a2c",cream:"#cdbf9f",brick:"#8a3c24",brass:"#d6a43a",cloth:"#7a2a3a",glass:"#e7b65a",straw:"#c9a24a",pumpkin:"#d9772b"},
 rushlight:{outline:"#1c1814",panel:"#2c2621",text:"#e6dcc4",light:"#d9b45a",accent:"#9a4528",shadeTo:"#1c1814",lightTo:"#ece2c8",night:"#2a323e",duskTint:"#8f8070",glow:"#d9a85a",
  mouth:"#5e1a18",blush:"#b8705a",wood:"#5a4430",woodDark:"#33281e",earth:"#5e4b36",stone:"#857e72",stoneWarm:"#8a7a66",grass:"#56623a",cream:"#c8b896",brick:"#7a3a24",brass:"#c8a552",cloth:"#6a2a24",glass:"#cfa456",straw:"#c8a552",pumpkin:"#b8692e"}};
let P=PALETTES.blacklantern;

/* ---------- color helpers ---------- */
const RGBC=new Map();
function RGB(h){let v=RGBC.get(h);if(!v){const k=h.slice(1);v=[parseInt(k.slice(0,2),16),parseInt(k.slice(2,4),16),parseInt(k.slice(4,6),16)];RGBC.set(h,v);}return v;}
function hex(r,g,b){return"#"+[r,g,b].map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,"0")).join("");}
function rgba(h,a){const[r,g,b]=RGB(h);return`rgba(${r},${g},${b},${a})`;}
// shade(color, amount): negative darkens toward P.shadeTo, positive lightens toward P.lightTo.
const SHC=new Map();
function shade(h,a){const k=h+a;let v=SHC.get(k);if(v)return v;const[r,g,b]=RGB(h),[dr,dg,db]=RGB(a<0?P.shadeTo:P.lightTo),t=Math.abs(a);
  v=hex(r+(dr-r)*t,g+(dg-g)*t,b+(db-b)*t);SHC.set(k,v);return v;}
// hsh(x, y, seed): repeatable 0..1 noise, so every texture draws the same way every time.
function hsh(x,y,s){let h=(Math.imul(x,374761393)+Math.imul(y,668265263)+Math.imul(s|0,1442695041))|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967295;}
const mk=(w,h)=>{const c=document.createElement("canvas");c.width=w;c.height=h;return c;};
// use(palette): pick the palette every draw call reads. Clears the caches.
function use(pal){P=pal;SHC.clear();SPR.clear();}
const pal=()=>P;

/* ---------- SPRITE-DRAWING METHOD  (shared-sprites-method-v1) ----------
   Draw in design pixels, scale by s, then:
   1. hard shadow side: R(..., {sh}) paints the right part of a shape 32% darker
   2. light rim: R(..., {rim}) paints a 1 px lighter left edge (only when s >= 1)
   3. dark outline: every empty pixel touching the sprite becomes P.outline */
function art(LW,LH,ox,oy,s,draw,outline=true){
  const W=Math.ceil(LW*s)+2,H=Math.ceil(LH*s)+2,c=mk(W,H),g=c.getContext("2d");
  const big=s>=1,sx=v=>Math.round((v+ox)*s)+1,sy=v=>Math.round((v+oy)*s)+1;
  const R=(x,y,w,h,col,o)=>{let X=sx(x),Y=sy(y),X2=sx(x+w),Y2=sy(y+h);if(X2<=X)X2=X+1;if(Y2<=Y)Y2=Y+1;g.fillStyle=col;g.fillRect(X,Y,X2-X,Y2-Y);
    if(o){if(o.sh){const sw=Math.max(1,Math.round((o.sh===true?w*.3:o.sh)*s));if(X2-X>sw){g.fillStyle=shade(col,-.32);g.fillRect(X2-sw,Y,sw,Y2-Y);}}
      if(o.rim&&big&&X2-X>2){g.fillStyle=shade(col,.22);g.fillRect(X,Y,1,Y2-Y);}}};
  const Px=(x,y,col)=>{g.fillStyle=col;g.fillRect(sx(x),sy(y),1,1);};
  const disc=(cx,cy,r,f)=>{const X=(cx+ox)*s+1,Y=(cy+oy)*s+1,rr=r*s;
    for(let py=Math.floor(Y-rr-1);py<=Y+rr+1;py++)for(let px=Math.floor(X-rr-1);px<=X+rr+1;px++){const d=Math.hypot(px+.5-X,py+.5-Y);const col=f(d,rr,px,py);if(col){g.fillStyle=col;g.fillRect(px,py,1,1);}}};
  const C=(cx,cy,r,col)=>disc(cx,cy,Math.max(r,.6/s),(d,rr)=>d<=rr?col:null);
  const E=(cx,cy,rx,ry,col)=>{const X=(cx+ox)*s+1,Y=(cy+oy)*s+1,ax=Math.max(rx*s,.7),ay=Math.max(ry*s,.7);
    for(let py=Math.floor(Y-ay-1);py<=Y+ay+1;py++)for(let px=Math.floor(X-ax-1);px<=X+ax+1;px++){const dx=(px+.5-X)/ax,dy=(py+.5-Y)/ay;if(dx*dx+dy*dy<=1){g.fillStyle=col;g.fillRect(px,py,1,1);}}};
  const meta={};
  draw({R,P:Px,C,E,disc,g,big,s,meta});
  if(outline){const OUT=RGB(P.outline),id=g.getImageData(0,0,W,H),d=id.data,o=new Uint8ClampedArray(d);
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=(y*W+x)*4;if(d[i+3])continue;
      if((x>0&&d[i-1])||(x<W-1&&d[i+7])||(y>0&&d[i-W*4+3])||(y<H-1&&d[i+W*4+3])){o[i]=OUT[0];o[i+1]=OUT[1];o[i+2]=OUT[2];o[i+3]=255;}}
    g.putImageData(new ImageData(o,W,H),0,0);}
  return{c,sx,sy,meta,s};
}

/* ---------- PERSON TEMPLATE  (shared-sprites-person-v1) ----------
   One body for everyone. Design grid 28 wide x 50 tall (feet at row 50).
   dir: "down" | "up" | "side" (flip the canvas for the other side). fr: 0 stand, 1 and 2 walk. idle bit 1 = blink.
   sp = the game's character spec: skin, hair, hairStyle, iris, top, inner, coat, pants, shoes, cheeks, freckles, glasses, mouth.
   Game-only extras plug in through two hooks: sp.body(A, ty, sw) over the torso (down only); sp.face(A, y, idle) after the face. */
function drawChar(A,sp,dir,fr,idle){
  const{R,P:Px,C,disc,big}=A;
  const sk=sp.skin,skD=shade(sk,-.28),hr=sp.hair,hrD=shade(hr,-.35),tp=sp.top,tpD=shade(tp,-.32);
  const b=(fr===1||fr===2)?-1:0,lL=fr===1?-1:0,rL=fr===2?-1:0,ty=23+b,th=sp.coat?21:16;
  const sw=fr===1?1:fr===2?-1:0,blink=idle&1,DK=P.outline,LID=P.panel,MO=P.mouth,EYE=P.text,PUP=P.outline,GLINT=shade(P.text,.8);
  const lantern=(x,hy)=>{R(x+1,hy,1,2,P.panel);R(x-1,hy+2,7,1,P.woodDark);R(x,hy+3,5,6,P.woodDark);R(x+1,hy+4,3,4,P.light);if(big)Px(x+1,hy+4,shade(P.light,.5));R(x-1,hy+9,7,1,P.woodDark);A.meta.lx=x+2.5;A.meta.ly=hy+6;};

  if(dir==="side"){
    const fo=fr===1?-2:fr===2?2:0,ao=fr===1?2:fr===2?-2:0;
    R(13-fo,39,5,8,shade(sp.pants,-.3));R(12-fo,46,6,4,shade(sp.shoes,-.3));
    R(10+fo,39,5,8,sp.pants,{sh:2});R(9+fo,46,7,4,sp.shoes,{sh:2});
    R(8,ty,13,th,tp,{sh:4,rim:1});if(sp.coat)R(10,ty+14,1,th-14,tpD);
    R(12,21+b,5,3,skD);
    R(12+ao,ty+1,5,13,tp,{rim:1});R(12+ao,ty+14,5,3,sk);
    if(sp.lantern)lantern(12+ao,ty+16);
    R(6,3+b,17,19,sk,{sh:2,rim:1});R(4,13+b,2,3,sk);Px(4,15+b,skD);
    R(15,12+b,2,3,skD);
    const st=sp.hairStyle;
    if(st==="short"){R(7,1+b,17,6,hr,{sh:3});R(17,7+b,7,9,hr,{sh:2});R(7,7+b,4,2,hr);}
    else if(st==="cropped"){R(8,2+b,15,5,hr,{sh:2});R(18,7+b,5,6,hr);}
    else if(st==="bob"){R(6,1+b,18,7,hr,{sh:3});R(14,8+b,10,13,hr,{sh:2});R(6,8+b,4,2,hr);}
    else{R(6,1+b,18,7,hr,{sh:3});R(14,8+b,10,19,hr,{sh:2});R(6,8+b,4,2,hr);}
    if(big){if(blink)R(7,13+b,3,1,LID);else{R(7,11+b,3,5,EYE);R(7,12+b,2,4,sp.iris);Px(7,14+b,PUP);Px(8,12+b,GLINT);R(7,10+b,4,1,LID);}R(7,8+b,4,1,hrD);}
    else R(7,12+b,2,blink?1:4,DK);
    R(6,18+b,3,1,MO);
    if(sp.cheeks)R(9,16+b,2,1,P.blush);
    if(sp.freckles&&big){Px(8,16+b,skD);Px(10,17+b,skD);}
    return;
  }
  if(dir==="down"&&sp.hairStyle==="long")R(4,18+b,20,8,hrD);
  R(8,39+lL,5,8,sp.pants,{sh:2});R(15,39+rL,5,8,sp.pants,{sh:2});
  R(7,46+lL,6,4,sp.shoes,{sh:2});R(15,46+rL,6,4,sp.shoes,{sh:2});
  R(6,ty,16,th,tp,{sh:5,rim:1});
  if(dir==="down"){
    if(sp.inner){R(11,ty,6,7,sp.inner);R(13,ty,2,7,shade(sp.inner,-.25));}
    if(sp.coat){R(10,ty,1,8,tpD);R(17,ty,1,8,tpD);R(13,ty+14,1,th-14,tpD);}
  }else{R(10,ty,8,2,tpD);if(sp.coat)R(13,ty+13,1,th-13,tpD);}
  R(3,ty+1+sw,4,13,tp,{rim:1});R(21,ty+1-sw,4,13,tpD);
  R(3,ty+14+sw,4,3,sk);R(21,ty+14-sw,4,3,skD);
  if(dir==="down"&&sp.body)sp.body(A,ty,sw);
  if(sp.lantern)lantern(21,ty+16-sw);
  R(11,21+b,6,3,skD);
  R(5,3+b,18,19,sk,{sh:3,rim:1});R(4,6+b,1,13,sk);R(23,6+b,1,13,skD);
  const st=sp.hairStyle,y=b;
  if(dir==="up"){
    if(st==="short"){R(4,1+y,20,15,hr,{sh:4});R(5,16+y,18,2,hrD);}
    else if(st==="cropped")R(5,2+y,18,13,hr,{sh:3});
    else if(st==="bob")R(3,1+y,22,20,hr,{sh:4});
    else if(st==="long")R(3,1+y,22,26,hr,{sh:4});
    else R(4,1+y,20,15,hr,{sh:4});
    return;
  }
  if(st==="short"){R(4,1+y,20,6,hr,{sh:4});R(4,7+y,3,5,hr);R(21,7+y,3,4,hrD);R(7,7+y,6,2,hr);R(14,7+y,6,1,hr);if(big)R(8,2+y,7,1,shade(hr,.25));}
  else if(st==="cropped"){R(5,2+y,18,5,hr,{sh:3});R(5,7+y,2,3,hr);R(21,7+y,2,3,hrD);if(big)R(9,3+y,6,1,shade(hr,.2));}
  else if(st==="bob"){R(3,1+y,22,7,hr,{sh:4});R(3,8+y,4,13,hr);R(21,8+y,4,13,hrD);R(7,8+y,14,2,hr);if(big)R(7,2+y,8,1,shade(hr,.25));}
  else if(st==="long"){R(3,1+y,22,7,hr,{sh:4});R(3,8+y,4,17,hr);R(21,8+y,4,17,hrD);R(7,8+y,5,2,hr);R(15,8+y,6,1,hr);if(big)R(7,2+y,8,1,shade(hr,.25));}
  else if(st==="bun"){R(9,-4+y,10,6,hr,{sh:3});R(4,1+y,20,6,hr,{sh:4});R(4,7+y,3,6,hr);R(21,7+y,3,6,hrD);R(7,7+y,14,1,hr);}
  else if(st==="old"){R(4,7+y,3,8,hr);R(21,7+y,3,8,hrD);R(8,3+y,4,1,hr);R(15,2+y,3,1,hr);}
  else if(st==="hat"){R(4,8+y,3,6,hr);R(21,8+y,3,6,hrD);}
  const ey=11+y;
  if(sp.glasses){
    for(const cx of[9,19]){
      disc(cx,ey+2.5,6.2,(d,rr)=>d<=rr-1?shade(P.text,-.06):d<=rr?P.woodDark:null);
      if(blink)R(cx-2,ey+2,5,1,LID);
      else{C(cx,ey+2.5,3.3,EYE);C(cx+(cx<14?.8:-.8),ey+3,2,sp.iris);C(cx+(cx<14?.8:-.8),ey+3,1,PUP);Px(cx-1,ey+1,GLINT);}
      if(big){Px(cx-4,ey-1,GLINT);Px(cx-3,ey-2,GLINT);}
    }
    R(14,ey+1,2,1,P.woodDark);
  }else{
    if(big){R(8,ey-2,4,1,hrD);R(16,ey-2,4,1,hrD);}
    for(const[ex,ix]of[[8,9],[16,16]]){
      if(blink){big?R(ex,ey+2,4,1,LID):R(ex+1,ey+2,2,1,DK);continue;}
      if(big){R(ex,ey,4,5,EYE);R(ix,ey+1,3,4,sp.iris);R(ex===8?10:16,ey+2,2,2,PUP);Px(ix,ey+1,GLINT);R(ex-1,ey-1,6,1,LID);Px(ex===8?ex-1:ex+4,ey,LID);}
      else R(ex+1,ey+1,2,4,DK);
    }
  }
  if(big)R(13,15+y,2,1,skD);
  if(sp.cheeks){R(6,16+y,2,1,P.blush);R(20,16+y,2,1,P.blush);}
  if(sp.freckles&&big){Px(8,16+y,skD);Px(10,17+y,skD);Px(18,17+y,skD);Px(20,16+y,skD);}
  const m=sp.mouth||"flat";
  if(m==="grin"){R(6,16+y,16,4,shade(MO,-.4));R(7,16+y,14,2,P.text);if(big)for(let x=8;x<21;x+=2)Px(x,17+y,shade(P.text,-.2));R(8,19+y,12,1,shade(MO,.1));}
  else if(m==="open"){R(12,18+y,4,3,shade(MO,-.25));R(13,20+y,2,1,shade(MO,.45));}
  else if(m==="smile"){R(12,19+y,4,1,MO);Px(11,18+y,MO);Px(16,18+y,MO);}
  else R(12,18+y,4,1,MO);
  if(sp.face)sp.face(A,y,idle);
}
// charSprite: the sprite on its own canvas. ax/ay = the feet (where it stands on the map). lead = carries a lantern.
const SPR=new Map();
function charSprite(sp,dir,fr,idle,s=S,lead=false){
  const k=sp.id+dir+fr+idle+s+(lead?1:0);let v=SPR.get(k);
  if(!v){const spec=lead?Object.assign({},sp,{lantern:1}):sp;v=art(40,76,6,18,s,A=>drawChar(A,spec,dir,fr,idle));v.ax=v.sx(14);v.ay=v.sy(50);SPR.set(k,v);}
  return v;
}
// Black Lantern's four stand-in agents. Character specs are game data, so they stay in hex.
const SAMPLE_AGENTS=[
  {id:"reyes",name:"REYES",skin:"#b97a52",hair:"#2a1a14",hairStyle:"short",iris:"#5a3a22",top:"#8a6a42",coat:1,inner:"#d8cfb8",pants:"#3a3446",shoes:"#2a1e18"},
  {id:"okafor",name:"OKAFOR",skin:"#6e4430",hair:"#140e10",hairStyle:"cropped",iris:"#3a2418",top:"#2e3a5c",coat:1,inner:"#c8c2b4",pants:"#2a2a34",shoes:"#1a1418"},
  {id:"lind",name:"LINDQVIST",skin:"#e6b896",hair:"#b5532e",hairStyle:"long",iris:"#3f7a5a",top:"#4f5a34",inner:"#7a6a4a",pants:"#3b3328",shoes:"#2a1e18",freckles:1,cheeks:1},
  {id:"tran",name:"TRAN",skin:"#d8a47c",hair:"#18121a",hairStyle:"bob",iris:"#2e1f18",top:"#5b5a64",inner:"#8a2f3a",pants:"#23232c",shoes:"#d8d2c2"},
];

/* ---------- PROPS ----------
   A prop is a spec: design-pixel box [width, height, offsetX, offsetY], the anchor (where
   it stands on the map), its lights [x, y, radius in tiles, strength] and a draw function. */
// shared-props-streetlight-v1
const LAMP={size:[16,92,0,0],anchor:[8,90],lights:[[8,9,2.6,.55]],draw({R,big}){
  R(6,14,4,72,P.panel,{sh:1});R(4,84,8,6,P.panel);R(5,82,6,2,shade(P.panel,.1));
  R(2,2,12,3,P.panel);R(3,5,10,9,P.light);if(big)R(3,5,10,1,shade(P.light,.5));R(7,5,2,9,P.panel);R(1,14,14,2,P.panel);R(7,0,2,2,P.panel);}};
// shared-props-bench-v1
const BENCH={size:[52,28,0,0],anchor:[26,26],lights:[],draw({R}){
  R(4,14,3,12,P.woodDark);R(45,14,3,12,P.woodDark);R(2,0,48,3,P.wood,{sh:4});R(2,5,48,3,P.wood,{sh:4});R(2,11,48,4,shade(P.wood,.1),{sh:4});R(2,16,48,3,P.wood,{sh:4});}};
function prop(spec,s=S){const[LW,LH,ox,oy]=spec.size,a=art(LW,LH,ox,oy,s,spec.draw);a.ax=a.sx(spec.anchor[0]);a.ay=a.sy(spec.anchor[1]);a.lights=spec.lights;return a;}

/* ---------- GROUND TILES ----------
   Each returns the color of one pixel at world position (x, y), so they tile seamlessly.
   u = T / 16 keeps patterns the same size at any tile size. */
// shared-tiles-dirtroad-v1
function dirtRoad(x,y,T=16,ruts=[]){const u=T/16,nx=(x/u)|0,ny=(y/u)|0,n=hsh(nx,ny,1),ty=y/T,e=P.earth;
  if(hsh(nx,ny,7)<.014)return shade(P.stoneWarm,.15);
  if(ruts.some(r=>Math.abs(ty-r)<.11))return n<.5?shade(e,-.2):shade(e,-.14);
  return[e,shade(e,-.06),shade(e,.08),shade(e,-.12)][(n*4)|0];}
// shared-tiles-boardwalk-v1
function boardwalk(x,y,T=16){const u=T/16,nx=(x/u)|0,ny=(y/u)|0,pw=4*u,pi=(x/pw)|0,r=y%T,w=P.wood;
  if(x%pw===0||r>T-u)return P.woodDark;
  if((r===2*u||r===T-3*u)&&x%pw===1)return shade(P.stoneWarm,.1);
  return hsh(nx,ny,9)<.07?shade(w,-.25):[shade(w,-.1),shade(w,-.04),shade(w,-.16)][(hsh(pi,7,2)*3)|0];}
// shared-tiles-sidewalk-v1
function stoneSidewalk(x,y,T=16,warm=false){const u=T/16,pw=8*u,ph=6*u,ry=(y/ph)|0,ox=(ry%2)*pw/2,cx=((x+ox)/pw)|0,b=warm?P.stoneWarm:P.stone;
  if(y%ph===0||(x+ox)%pw===0)return shade(b,-.45);
  return[b,shade(b,-.05),shade(b,.05)][(hsh(cx,ry,3)*3)|0];}
// shared-tiles-grass-v1
function grass(x,y,T=16){const u=T/16,nx=(x/u)|0,ny=(y/u)|0,n=hsh(nx,ny,1),gr=P.grass;
  if(hsh(nx,ny,13)<.04)return shade(gr,.2);
  return[gr,shade(gr,-.08),shade(gr,.08),shade(gr,-.16)][(n*4)|0];}
// paint(w, h, pixel): fills a canvas from a pixel function like the four above.
function paint(w,h,pixel){const c=mk(w,h),g=c.getContext("2d"),img=g.createImageData(w,h),d=img.data;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const v=RGB(pixel(x,y)),i=(y*w+x)*4;d[i]=v[0];d[i+1]=v[1];d[i+2]=v[2];d[i+3]=255;}
  g.putImageData(img,0,0);return c;}

/* ---------- WALL PIECES (drawn with rectangles, in pixels) ---------- */
const F=(g,x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)));};
// shared-tiles-fence-v1
function picketFence(g,x0,x1,top,T=16){const u=T/16,c=P.cream;
  for(let x=x0;x<x1;x+=3*u){F(g,x,top+.05*T,2*u,.6*T,c);F(g,x+u,top+.05*T,u,.6*T,shade(c,-.18));F(g,x,top,2*u,u,shade(c,.25));}
  for(const ry of[.2,.45])for(let x=x0;x<x1;x++)F(g,x,top+ry*T,1,u,shade(c,-.35));}
// shared-tiles-wall-v1. mat is "brick", "siding" or "batten". Brick uses P.brick and ignores col. rb = top, fb = bottom.
function wall(g,x0,x1,rb,fb,mat,col,T=16){const u=T/16,w=x1-x0;F(g,x0,rb,w,fb-rb,col);
  if(mat==="brick"){const bk=P.brick;F(g,x0,rb,w,fb-rb,shade(bk,-.4));for(let y=rb;y<fb;y+=3){const row=((y-rb)/3)|0;for(let x=x0-((row%2)*3);x<x1;x+=6){const xs=Math.max(x,x0),xe=Math.min(x+5,x1);if(xe>xs)F(g,xs,y,xe-xs,2,[bk,shade(bk,-.08),shade(bk,.06)][(hsh(x,y,40)*3)|0]);}}}
  else if(mat==="siding"){for(let y=rb;y<fb;y+=3){F(g,x0,y,w,1,shade(col,.12));F(g,x0,y+2,w,1,shade(col,-.22));}}
  else{for(let x=x0;x<x1;x+=6){F(g,x,rb,2,fb-rb,shade(col,.1));F(g,x+2,rb,1,fb-rb,shade(col,-.3));}}
  F(g,x1-.25*T,rb,.25*T,fb-rb,rgba(P.outline,.28));F(g,x0,rb,u,fb-rb,P.outline);F(g,x1-u,rb,u,fb-rb,P.outline);}
// shared-tiles-roof-v1. Shingle rows, a lit ridge and a dark eave. seed varies the speckle; chim adds a chimney.
function roof(g,x0,x1,rt,rb,col,T=16,seed=0,chim=false){const u=T/16,w=x1-x0;
  F(g,x0-.15*T,rt,w+.3*T,rb-rt,col);
  for(let y=rt;y<rb;y+=3){const row=((y-rt)/3)|0;F(g,x0-.15*T,y,w+.3*T,1,shade(col,-.3));
    for(let x=x0-.15*T+(row%2?0:3);x<x1+.15*T;x+=6)F(g,x,y,1,3,shade(col,-.22));}
  for(let k=0;k<w/4;k++){if(hsh(k,seed,30)<.3)F(g,x0+hsh(k,seed,31)*w,rt+hsh(k,seed,32)*(rb-rt),u,u,shade(col,.18));}
  F(g,x0-.15*T,rt,w+.3*T,2*u,shade(col,.2));F(g,x0-.15*T,rb-2*u,w+.3*T,2*u,P.outline);
  if(chim){F(g,x0+w*.75,rt-.5*T,.6*T,.9*T,shade(P.brick,-.15));F(g,x0+w*.75,rt-.55*T,.6*T,2*u,shade(P.brick,-.55));}}
// shared-tiles-window-v1. Lit glass, cross bars, sill. Returns its glow for the dusk pass.
function windowPane(g,wx,wy,ww,wh,T=16,curtains=false){const u=T/16,fr=shade(P.woodDark,-.15);
  F(g,wx,wy,ww,wh,fr);F(g,wx+u,wy+u,ww-2*u,wh-2*u,P.glass);F(g,wx+u,wy+u+(wh-2*u)*.55,ww-2*u,(wh-2*u)*.45,shade(P.glass,-.2));
  if(curtains){F(g,wx+u,wy+u,2*u,wh-2*u,P.cloth);F(g,wx+ww-3*u,wy+u,2*u,wh-2*u,P.cloth);}
  F(g,wx+ww/2-u/2,wy,u,wh,fr);F(g,wx,wy+wh/2,ww,u,fr);F(g,wx-u,wy+wh,ww+2*u,1.5*u,shade(P.cream,-.05));
  return[wx+ww/2,wy+wh/2,1.0*T,.28];}
// shared-tiles-door-v1. Centered on cx, top at dy, bottom at fb. barn = wide double door with cross braces.
function door(g,cx,dy,fb,col,T=16,barn=false){const u=T/16,dw=(barn?1.6:.95)*T,dx=cx-dw/2,fr=shade(P.outline,.05);
  F(g,dx-u,dy-u,dw+2*u,fb-dy+u,fr);F(g,dx,dy,dw,fb-dy,col);
  if(barn){F(g,dx+dw/2-u/2,dy,u,fb-dy,fr);for(const k of[0,1]){const ex=dx+k*dw/2;g.strokeStyle=shade(P.wood,-.1);g.lineWidth=u;g.beginPath();g.moveTo(ex+u,dy+u);g.lineTo(ex+dw/2-u,fb-u);g.stroke();}}
  else{F(g,dx+2*u,dy+2*u,dw-4*u,.5*T,shade(col,-.25));F(g,dx+2*u,dy+.75*T,dw-4*u,.55*T,shade(col,-.25));F(g,dx+dw-4*u,dy+.75*T,1.5*u,1.5*u,P.brass);}
  F(g,dx-.1*T,fb-u,dw+.2*T,u,shade(P.stoneWarm,-.15));}
// shared-tiles-awning-v1. Striped in P.text and P.accent.
function awning(g,x0,x1,top,T=16){const u=T/16;
  for(let x=x0;x<x1;x+=3*u){const c=((x-x0)/(3*u))%2?shade(P.text,-.05):P.accent;F(g,x,top,3*u,.38*T,c);F(g,x+u,top+.38*T,u,u,c);}
  F(g,x0,top,x1-x0,u,P.outline);}

/* ---------- DUSK LIGHTING  (shared-effects-dusk-v1) ----------
   After everything is drawn: wash the scene in P.duskTint, darken the edges toward P.night, then add each glow.
   A glow is [x, y, radius px, strength]. Radii by source, in tiles:
   street light 2.6 @ .55 · window 1.0 @ .28 · lead's lantern 2.9 @ .55 */
function light(ctx,x,y,r,a){const cv=ctx.canvas;if(x+r<0||y+r<0||x-r>cv.width||y-r>cv.height)return;const g=ctx.createRadialGradient(x,y,0,x,y,r);
  g.addColorStop(0,rgba(P.glow,a));g.addColorStop(.4,rgba(shade(P.glow,-.05),a*.42));g.addColorStop(1,rgba(P.glow,0));ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);}
function dusk(ctx,glows,now=0){const vw=ctx.canvas.width,vh=ctx.canvas.height;
  ctx.globalCompositeOperation="multiply";ctx.fillStyle=P.duskTint;ctx.fillRect(0,0,vw,vh);
  ctx.globalCompositeOperation="source-over";const vg=ctx.createRadialGradient(vw/2,vh/2,Math.min(vw,vh)*.25,vw/2,vh/2,Math.max(vw,vh)*.72);
  vg.addColorStop(0,rgba(P.night,0));vg.addColorStop(1,rgba(P.night,.6));ctx.fillStyle=vg;ctx.fillRect(0,0,vw,vh);
  ctx.globalCompositeOperation="lighter";
  glows.forEach(([x,y,r,a],i)=>light(ctx,x,y,r,a*(.9+.1*Math.sin(now/170+i*1.9))));
  ctx.globalCompositeOperation="source-over";}

/* ===== SEASONAL · Autumn / Halloween ===== */
const autumn=(()=>{
const LEAF=()=>[P.pumpkin,P.accent,P.brass,shade(P.accent,-.25)];
// shared-props-autumntree-v1: three color variants (v = 0, 1, 2). No lights.
const TREE_COLS=()=>[[shade(P.pumpkin,-.1),shade(P.pumpkin,.15),shade(P.accent,-.25)],[P.accent,P.pumpkin,shade(P.accent,-.4)],[shade(P.brass,-.1),shade(P.brass,.2),shade(P.brass,-.45)]];
function tree(v){return{size:[100,120,0,0],anchor:[50,114],lights:[],draw({R,C}){const cols=TREE_COLS()[v%3];
  R(44,72,12,44,shade(P.wood,-.25),{sh:true});R(38,110,24,6,P.woodDark);
  C(50,52,38,cols[0]);C(28,62,22,cols[0]);C(72,62,22,cols[0]);C(50,30,26,cols[0]);
  C(70,74,16,cols[2]);C(52,82,14,cols[2]);C(80,56,12,cols[2]);
  C(38,34,14,cols[1]);C(26,52,10,cols[1]);C(54,22,10,cols[1]);
  for(let i=0;i<70;i++){const an=hsh(i,v,3)*6.283,rd=Math.sqrt(hsh(i,v,4))*40;const x=50+Math.cos(an)*rd,y=52+Math.sin(an)*rd*.9;R(x,y,3,2,[cols[1],cols[2],P.brass][i%3]);}}};}
// shared-props-haybale-v1: optionally topped with a carved pumpkin (glow 1.3 tiles @ .5).
function hay(jack=true){return{size:[44,44,0,14],anchor:[22,28],lights:jack?[[22,0,1.3,.5]]:[],draw({R,P:Px,E,big}){const st=P.straw;
  R(2,8,40,20,st,{sh:true});R(2,6,40,4,shade(st,.15));R(2,14,40,1,shade(st,-.18));R(2,21,40,1,shade(st,-.18));R(12,6,2,22,shade(st,-.45));R(30,6,2,22,shade(st,-.45));
  if(!jack)return;
  E(22,0,10,8,P.pumpkin);R(17,-7,1,14,P.accent);R(27,-7,1,14,P.accent);R(21,-10,3,3,P.grass);
  R(16,-3,4,3,P.light);R(25,-3,4,3,P.light);R(17,3,11,2,P.light);if(big){Px(19,3,P.pumpkin);Px(23,3,P.pumpkin);}}};}
// shared-props-pumpkin-v1
const PUMPKIN={size:[24,24,0,4],anchor:[12,19],lights:[],draw({R,E}){
  E(12,10,11,9,P.pumpkin);R(12-5.5,2,1,16,P.accent);R(12+5.5,2,1,16,P.accent);R(11,-2,3,3,P.grass);}};
// shared-props-pumpkinpile-v1: five pumpkins, the middle one carved (glow 1.2 tiles @ .45).
const PILE={size:[64,40,0,8],anchor:[32,32],lights:[[34,24,1.2,.45]],draw({R,E}){const pk=[[14,22,11,9],[34,24,12,9],[52,22,10,8],[24,10,10,8],[44,10,10,8]];
  pk.forEach(([x,y,rx,ry],i)=>{E(x,y,rx,ry,i%2?shade(P.pumpkin,-.08):P.pumpkin);R(x-rx/2,y-ry+1,1,ry*2-2,P.accent);R(x+rx/2,y-ry+1,1,ry*2-2,P.accent);R(x-1,y-ry-3,3,3,P.grass);});
  R(29,20,3,3,P.light);R(37,20,3,3,P.light);R(30,26,9,2,P.light);}};
// shared-props-jackolantern-v1: porch size, drawn straight onto a map at (px, py). Returns its glow (1.1 tiles @ .5).
function jackOLantern(g,px,py,T=16){const u=T/16;
  g.fillStyle=P.pumpkin;g.beginPath();g.ellipse(px,py,.28*T,.21*T,0,0,6.283);g.fill();
  F(g,px-.1*T,py-.2*T,u,.4*T,P.accent);F(g,px+.1*T,py-.2*T,u,.4*T,P.accent);F(g,px-u,py-.27*T,2*u,.08*T,P.grass);
  F(g,px-.15*T,py-.06*T,.09*T,.07*T,P.light);F(g,px+.06*T,py-.06*T,.09*T,.07*T,P.light);F(g,px-.12*T,py+.06*T,.24*T,.05*T,P.light);
  return[px,py,1.1*T,.5];}
// shared-effects-leaves-v1. Leaf litter: lay over grass or dirt; returns a leaf color or null (keep the ground).
// Black Lantern's street test uses .03 on grass (more under trees) and .011 on a dirt road.
function leafLitter(x,y,T=16,density=.03){const u=T/16,nx=(x/u)|0,ny=(y/u)|0;
  return hsh(nx,ny,11)<density?LEAF()[(hsh(nx,ny,12)*4)|0]:null;}
// Falling leaves: a dozen drift down and right across the screen, drawn above the scene.
const LEAVES=Array.from({length:12},(_,i)=>({x:hsh(i,1,70),y:hsh(i,2,70),v:.3+hsh(i,3,70)*.4,ph:hsh(i,4,70)*6,c:i%4}));
function fallingLeaves(ctx,now,s=.5,leaves=LEAVES){const vw=ctx.canvas.width,vh=ctx.canvas.height,L=LEAF();
  for(const lf of leaves){const yy=((lf.y*vh+now/1000*lf.v*18)%(vh+10))-5,xx=((lf.x*vw+Math.sin(now/700+lf.ph)*6+now/1000*6)%(vw+10))-5;
    ctx.fillStyle=L[lf.c];ctx.fillRect(Math.round(xx),Math.round(yy),Math.max(1,Math.round(2*s)),Math.max(1,Math.round(s+.5)));}}
return{LEAF,TREE_COLS,tree,hay,PUMPKIN,PILE,jackOLantern,leafLitter,LEAVES,fallingLeaves};
})();

/* ===== UI ===== drawn in screen pixels, not design pixels. Fonts are game data: pass opts.font. */
// rr: a rounded rectangle path. r = one radius or [topLeft, topRight, bottomRight, bottomLeft].
function rr(g,x,y,w,h,r){const[a,b,c,d]=Array.isArray(r)?r:[r,r,r,r];g.beginPath();g.moveTo(x+a,y);g.lineTo(x+w-b,y);g.arcTo(x+w,y,x+w,y+b,b);
  g.lineTo(x+w,y+h-c);g.arcTo(x+w,y+h,x+w-c,y+h,c);g.lineTo(x+d,y+h);g.arcTo(x,y+h,x,y+h-d,d);g.lineTo(x,y+a);g.arcTo(x,y,x+a,y,a);g.closePath();}
// shared-ui-shell-v1. A handheld body around the game screen: bezel, label, D-pad, A and B, L / Select / Start / R.
// Fills a 375 × 667 canvas (iPhone SE). Returns the screen's rect {x, y, w, h} (340 × 442) for the game to draw into.
// opts: label (the game's name), l and r (button labels, default "L" and "R"), font (CSS font family).
function shell(g,opts={}){const W=375,H=667,f=opts.font||"monospace",lab=shade(P.text,-.3),body=shade(P.panel,.1);
  g.fillStyle=body;g.fillRect(0,0,W,H);g.fillStyle=shade(P.panel,.18);g.fillRect(0,0,W,4);
  g.fillStyle=P.outline;rr(g,7,10,361,466,[10,10,28,10]);g.fill();
  const scr={x:17,y:22,w:340,h:442};g.fillStyle=P.outline;g.fillRect(scr.x,scr.y,scr.w,scr.h);
  // label with its lamp
  g.font=`bold 10px ${f}`;g.textBaseline="middle";const ls="letterSpacing" in g;if(ls)g.letterSpacing="2px";const name=opts.label||"",tw=g.measureText(name).width,lx=(W-tw-14)/2;
  g.save();g.shadowColor=P.light;g.shadowBlur=6;g.fillStyle=P.light;g.fillRect(lx,486,6,6);g.restore();
  g.fillStyle=lab;g.fillText(name,lx+14,489.5);if(ls)g.letterSpacing="0px";
  // D-pad: a plus of three cells, each 35 px, with a lip on the top edges
  const dx=25,dy=508,k=106/3,cells=[[1,0,"▲",[4,4,0,0]],[0,1,"◀",[4,0,0,4]],[1,1,"",0],[2,1,"▶",[0,4,4,0]],[1,2,"▼",[0,0,4,4]]];
  for(const[cx,cy,ch,r]of cells){const x=dx+cx*k,y=dy+cy*k;g.fillStyle=P.outline;rr(g,x,y,k+.5,k+.5,r);g.fill();
    if(cy<2&&ch){g.fillStyle=P.panel;g.fillRect(x+(r[0]?2:0),y,k-(r[0]?2:0)-(r[1]?2:0),2);}
    if(ch){g.fillStyle=shade(P.panel,.2);g.font=`12px ${f}`;g.textAlign="center";g.fillText(ch,x+k/2,y+k/2+1);g.textAlign="left";}}
  // B then A, round, with a darker lower lip and a drop shadow
  const btn=(cx,cy,fill,ink,t)=>{g.fillStyle=shade(body,-.5);g.beginPath();g.arc(cx,cy+2,26,0,6.283);g.fill();
    g.fillStyle=shade(fill,-.3);g.beginPath();g.arc(cx,cy,26,0,6.283);g.fill();g.fillStyle=fill;g.beginPath();g.arc(cx,cy-2,24.5,0,6.283);g.fill();
    g.fillStyle=ink;g.font=`bold 15px ${f}`;g.textAlign="center";g.fillText(t,cx,cy);g.textAlign="left";};
  btn(254,574,P.mouth,shade(P.text,-.06),"B");btn(320,542,P.accent,shade(P.text,.4),"A");
  // shoulder and menu pills
  const pills=[[opts.l||"L",54,P.panel],["SELECT",72,P.outline],["START",72,P.outline],[opts.r||"R",54,P.panel]];
  let px=(W-(54+72+72+54+3*14))/2;g.font=`bold 9px ${f}`;g.textAlign="center";
  for(const[t,w,c]of pills){g.fillStyle=c;rr(g,px,626,w,26,13);g.fill();g.fillStyle=lab;g.fillText(t,px+w/2,639.5);px+=w+14;}
  g.textAlign="left";g.textBaseline="alphabetic";
  return scr;}
// shared-ui-dialog-v1. The dialog box with the speaker standing on it: a framed portrait on the box's left, the name on a tab beside it,
// up to 3 lines of text and the advance mark. Drawn into the screen at (x, y), w wide; the box is h tall and the portrait rises above it.
// opts: name, lines (array of strings), portrait (a canvas, drawn to fill the frame; game data), size (portrait frame, default 128),
// font (CSS font family), advance (show the ▼, default true).
function dialog(g,x,y,w,h,opts={}){const f=opts.font||"monospace",sz=opts.size||128,b=3,line=P.text;
  g.fillStyle=P.panel;rr(g,x,y,w,h,3);g.fill();g.strokeStyle=line;g.lineWidth=b;rr(g,x+b/2,y+b/2,w-b,h-b,3);g.stroke();
  const px=x+4,py=y-sz;
  g.fillStyle=P.panel;g.fillRect(px,py,sz,sz+b);g.fillStyle=line;g.fillRect(px,py,sz,b);g.fillRect(px,py,b,sz+b);g.fillRect(px+sz-b,py,b,sz+b);
  if(opts.portrait){g.imageSmoothingEnabled=false;g.drawImage(opts.portrait,px+b,py+b,sz-2*b,sz-b);}
  if(opts.name){g.font=`bold 13px ${f}`;const tw=g.measureText(opts.name).width+16,tx=px+sz,ty=y-22;
    g.fillStyle=P.panel;g.fillRect(tx,ty,tw,22+b);g.fillStyle=line;g.fillRect(tx,ty,tw,b);g.fillRect(tx+tw-b,ty,b,22+b);
    g.fillStyle=P.light;g.textBaseline="middle";g.fillText(opts.name,tx+8,ty+12);}
  g.fillStyle=P.text;g.font=`14px ${f}`;g.textBaseline="top";(opts.lines||[]).slice(0,3).forEach((t,i)=>g.fillText(t,x+12,y+10+i*20));
  if(opts.advance!==false){g.fillStyle=P.light;g.font=`12px ${f}`;g.textBaseline="bottom";g.fillText("▼",x+w-18,y+h-5);}
  g.textBaseline="alphabetic";}


/* ===== SUMMER, NIGHT LIGHT, MAIN STREET, HOUSES AND CARS, INTERIORS, FAIR · v1 pieces, added Nov 23, 2026 =====
   Drawn first for Black Lantern's Good Manners (its spec 012 lists the kits). Every piece reads palette slots, so each
   game paints it in its own colors. New slots for these pieces (a game's palette without them falls back as noted):
   leaf (summer foliage), dry (dry grass), sodium (sodium street light), asphalt (paved road), lino and carpet (floors). */
SLOTS.push(["leaf","summer leaves, green grass"],["dry","dry grass, stubble"],["sodium","sodium street light"],["asphalt","paved road"],["lino","linoleum, light floors"],["carpet","carpet"]);
Object.assign(PALETTES.blacklantern,{leaf:"#4f7a34",dry:"#a8975a",sodium:"#ff9a3c",asphalt:"#3b3742",lino:"#b8ae96",carpet:"#5a4660"});
Object.assign(PALETTES.rushlight,{leaf:"#5a7040",dry:"#a0925e",sodium:"#e08a3c",asphalt:"#3c3a36",lino:"#b0a48a",carpet:"#5a4a3e"});
const slot=(k,alt)=>P[k]||P[alt];

/* ---------- SUMMER (seasonal) ---------- */
// shared-tiles-summergrass-v1: green (dry = false) or dry late-summer grass (dry = true). Pixel function like grass().
function summerGrass(x,y,T=16,dry=false){const u=T/16,nx=(x/u)|0,ny=(y/u)|0,g=dry?slot("dry","straw"):slot("leaf","grass");
  const patch=hsh(nx>>2,ny>>2,81)<.3?shade(g,-.1):g;
  if(ny%3===0&&hsh(nx,ny,83)<.16)return shade(patch,.22);          // blade tips catching the light
  if(hsh(nx,ny,84)<.025)return dry?shade(P.earth,.1):slot("dry","straw");  // a dry stalk in the green, bare dirt in the dry
  return[patch,shade(patch,-.09),shade(patch,.06),shade(patch,-.18)][(hsh(nx,ny,82)*4)|0];}
// shared-props-summertree-v1: a full green shade tree, lit from the upper left in four tones. v = 0, 1, 2 varies the crown.
function summerTree(v=0){return{size:[100,124,0,0],anchor:[50,118],lights:[],draw({R,C}){const L=slot("leaf","grass"),t=[shade(L,.28),shade(L,.1),L,shade(L,-.22),shade(L,-.42)];
  R(44,74,12,46,shade(P.wood,-.2),{sh:true});R(40,114,20,4,P.woodDark);R(47,80,2,20,shade(P.wood,.1));
  const lobes=[[50,54,36],[26,64,20],[74,62,22],[50,30,26],[32,40,16],[68,40,16]].map(([x,y,r],i)=>[x+((hsh(i,v,5)-.5)*8)|0,y+((hsh(i,v,6)-.5)*6)|0,r]);
  lobes.forEach(([x,y,r])=>C(x+3,y+4,r,t[4]));lobes.forEach(([x,y,r])=>C(x+1,y+2,r,t[3]));lobes.forEach(([x,y,r])=>C(x,y,r-2,t[2]));
  lobes.forEach(([x,y,r])=>C(x-r*.3,y-r*.3,r*.55,t[1]));lobes.forEach(([x,y,r])=>C(x-r*.42,y-r*.45,r*.22,t[0]));
  for(let i=0;i<90;i++){const an=hsh(i,v,3)*6.283,rd=Math.sqrt(hsh(i,v,4))*42,x=50+Math.cos(an)*rd,y=50+Math.sin(an)*rd*.85;R(x,y,3,2,x+y<96?t[1]:t[3]);}}};}
// shared-tiles-drydirt-v1: cracked dry dirt (gravel = false) or loose gravel (gravel = true). Pixel function.
function dryDirt(x,y,T=16,gravel=false){const u=T/16,nx=(x/u)|0,ny=(y/u)|0,e=shade(P.earth,.14);
  if(gravel){const n=hsh(nx,ny,91);if(n<.16)return shade(P.stone,.12+hsh(nx,ny,92)*.25);if(n<.27)return shade(P.stoneWarm,-.08);if(n<.33)return shade(e,-.32);
    return[e,shade(e,-.07),shade(e,.06)][(hsh(nx,ny,93)*3)|0];}
  const c=10,gx=Math.floor(nx/c),gy=Math.floor(ny/c);let d1=1e9,d2=1e9;
  for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const px=(gx+i+hsh(gx+i,gy+j,94))*c,py=(gy+j+hsh(gx+i,gy+j,95))*c,d=Math.hypot(nx-px,ny-py);if(d<d1){d2=d1;d1=d;}else if(d<d2)d2=d;}
  if(d2-d1<.7&&hsh(nx,ny,99)<.85)return shade(e,-.36);if(d2-d1<1.3&&hsh(nx,ny,90)<.35)return shade(e,-.14);if(d2-d1>4.5&&hsh(nx,ny,98)<.3)return shade(e,.1);
  const n=hsh(nx,ny,97);return n<.06?shade(P.stoneWarm,.1):[e,shade(e,-.05),shade(e,.04)][(n*3)|0];}
// shared-effects-heat-v1: heat shimmer for bright afternoons. After the scene is drawn: thin bands sway a pixel sideways
// and a faint hot wash lies over the top of the screen. k = 0..1 strength. Whole-pixel moves, so pixels stay crisp.
const HEATC={c:null};
function heat(ctx,now,k=1){if(k<=0)return;const cv=ctx.canvas,w=cv.width,h=cv.height;
  if(!HEATC.c||HEATC.c.width!==w||HEATC.c.height!==h)HEATC.c=mk(w,h);const b=HEATC.c.getContext("2d");b.clearRect(0,0,w,h);b.drawImage(cv,0,0);
  for(let y=0;y<h;y+=2){const dx=Math.round(Math.sin(now/260+y*.21)*Math.sin(now/1100+y*.05)*1.4*k);if(dx)ctx.drawImage(HEATC.c,0,y,w,2,dx,y,w,2);}
  const g=ctx.createLinearGradient(0,0,0,h*.6);g.addColorStop(0,rgba(P.lightTo,.12*k));g.addColorStop(1,rgba(P.lightTo,0));ctx.fillStyle=g;ctx.fillRect(0,0,w,h*.6);}

/* ---------- NIGHT LIGHT ---------- */
// shared-effects-sodium-v1: sodium-orange light under street lights, after the night darkness is drawn. pools: [[x, y, r], ...]
// in canvas pixels. Inside each pool the picture turns the one flat orange sodium lamps give (multiplied), with a soft
// orange bloom on top that hums a little.
function sodium(ctx,pools,now=0){const S_=slot("sodium","glow");
  ctx.globalCompositeOperation="multiply";
  pools.forEach(([x,y,r])=>{const c=ctx.createRadialGradient(x,y,0,x,y,r);c.addColorStop(0,rgba(S_,.9));c.addColorStop(.6,rgba(S_,.6));c.addColorStop(1,rgba(S_,0));ctx.fillStyle=c;ctx.fillRect(x-r,y-r,r*2,r*2);});
  ctx.globalCompositeOperation="lighter";
  pools.forEach(([x,y,r],i)=>{const f=.9+.1*Math.sin(now/90+i*2.3)*Math.sin(now/37+i),c=ctx.createRadialGradient(x,y,0,x,y,r*.75);
    c.addColorStop(0,rgba(S_,.2*f));c.addColorStop(1,rgba(S_,0));ctx.fillStyle=c;ctx.fillRect(x-r,y-r,r*2,r*2);});
  ctx.globalCompositeOperation="source-over";}

/* ---------- MAIN STREET ---------- */
// shared-tiles-storefront-v1: a flat-front brick storefront in the 3/4 view, drawn in pixels like wall(). Two widths read
// best: 2 tiles (narrow) and 3 tiles (wide); any width works. top = the parapet's top, fb = the ground line.
// o: col (brick tint; P.brick when left out), door (x of the door's center), upper (true: a row of upstairs windows),
// trim (cornice color). Returns {sign: [x, y, w, h] (the sign band, for a sign blank), glows: [...], door}.
function storefront(g,x0,x1,top,fb,T=16,o={}){const u=T/16,w=x1-x0,bk=o.col||P.brick,trim=o.trim||P.cream,h=fb-top,dr=o.door??(x0+w*.72);
  F(g,x0,top,w,h,shade(bk,-.42));
  for(let y=top+4*u;y<fb;y+=3*u){const row=((y-top)/(3*u))|0;for(let x=x0-((row%2)*3*u);x<x1;x+=6*u){const xs=Math.max(x,x0),xe=Math.min(x+5*u,x1);if(xe>xs)F(g,xs,y,xe-xs,2*u,[bk,shade(bk,-.08),shade(bk,.07),shade(bk,-.14)][(hsh(x,y,141)*4)|0]);}}
  F(g,x0-u,top,w+2*u,3*u,trim);F(g,x0-u,top,w+2*u,u,shade(trim,.25));F(g,x0-u,top+3*u,w+2*u,u,shade(trim,-.45));      // cornice
  for(let x=x0+2*u;x<x1-2*u;x+=4*u)F(g,x,top+3*u,2*u,u,shade(trim,-.2));                                         // dentils
  const sy=top+6*u,sh_=Math.max(6*u,.42*T);
  if(o.upper){for(let wx=x0+.28*T;wx+.5*T<=x1-.2*T;wx+=.82*T){F(g,wx-u,sy+sh_+3*u-u,.5*T+2*u,.62*T+2*u,shade(trim,-.1));F(g,wx,sy+sh_+3*u,.5*T,.62*T,shade(P.night,.12));F(g,wx,sy+sh_+3*u,.5*T,u,shade(P.night,.35));F(g,wx+.25*T-u/2,sy+sh_+3*u,u,.62*T,shade(trim,-.1));}}
  const gy=fb-.95*T,glows=[];
  F(g,x0+u,gy-2*u,w-2*u,2*u,shade(trim,-.15));                                                                    // transom beam
  const dw=.62*T,dx=dr-dw/2;
  for(const[a,b]of[[x0+2*u,dx-2*u],[dx+dw+2*u,x1-2*u]]){if(b-a<4*u)continue;F(g,a,gy,b-a,.72*T,shade(P.outline,.1));F(g,a+u,gy+u,b-a-2*u,.72*T-2*u,P.glass);
    F(g,a+u,gy+u+(.72*T-2*u)*.5,b-a-2*u,(.72*T-2*u)*.5,shade(P.glass,-.22));for(let k=a+u;k<b-u;k+=5*u)if(hsh(k,gy,142)<.5)F(g,k,gy+.45*T,2*u,.2*T,shade(P.glass,-.45));
    F(g,a+2*u,gy+2*u,u,.3*T,shade(P.glass,.35));F(g,a-u,gy+.72*T,b-a+2*u,.23*T,shade(bk,-.3));glows.push([(a+b)/2,gy+.36*T,.9*T,.26]);}
  F(g,dx-u,gy-u,dw+2*u,.95*T+u,shade(P.outline,.05));F(g,dx,gy,dw,.95*T,shade(P.woodDark,-.1));F(g,dx+u,gy+u,dw-2*u,.45*T,P.glass);F(g,dx+u,gy+u,dw-2*u,.2*T,shade(P.glass,.2));
  F(g,dx+dw-3*u,gy+.55*T,u,u,P.brass);F(g,dx-.1*T,fb-u,dw+.2*T,u,shade(P.stoneWarm,-.15));
  F(g,x1-.2*T,top+4*u,.2*T,h-4*u,rgba(P.outline,.25));F(g,x0,top,u,h,P.outline);F(g,x1-u,top,u,h,P.outline);
  return{sign:[x0+3*u,sy,w-6*u,sh_],glows,door:dr};}
// shared-props-signblank-v1: a painted sign blank, and a small 3 x 5 pixel alphabet to paint names on it (the case paints the
// name; no real brands). signBlank(g, x, y, w, h, col) draws the board; signText(g, text, x, y, col, scale) letters it.
// signWidth(text, scale) measures it.
function signBlank(g,x,y,w,h,col=P.cream,T=16){const u=T/16;F(g,x-u,y-u,w+2*u,h+2*u,P.outline);F(g,x,y,w,h,col);F(g,x,y,w,u,shade(col,.3));F(g,x,y+h-u,w,u,shade(col,-.3));
  F(g,x+u,y+u,u,h-2*u,shade(col,.15));for(let i=0;i<w;i+=7*u)if(hsh(i,y,151)<.4)F(g,x+i,y+2*u,2*u,u,shade(col,-.12));return[x+2*u,y+2*u,w-4*u,h-4*u];}
const GLYPH3={A:"010101111101101",B:"110101110101110",C:"011100100100011",D:"110101101101110",E:"111100110100111",F:"111100110100100",G:"011100101101011",H:"101101111101101",I:"111010010010111",J:"001001001101010",K:"101101110101101",L:"100100100100111",M:"101111111101101",N:"110101101101101",O:"010101101101010",P:"110101110100100",Q:"010101101110011",R:"110101110101101",S:"011100010001110",T:"111010010010010",U:"101101101101111",V:"101101101101010",W:"101101111111101",X:"101101010101101",Y:"101101010010010",Z:"111001010100111",
  "0":"111101101101111","1":"010110010010111","2":"110001010100111","3":"110001010001110","4":"101101111001001","5":"111100110001110","6":"011100111101111","7":"111001010010010","8":"111101111101111","9":"111101111001110",".":"000000000000010","'":"010010000000000","&":"010101010101011","-":"000000111000000","·":"000000010000000"};
const signWidth=(s,k=1)=>String(s).length*4*k-k;
function signText(g,s,x,y,col,k=1){for(const ch of String(s).toUpperCase()){const gl=GLYPH3[ch];if(gl)for(let i=0;i<15;i++)if(gl[i]==="1")F(g,x+(i%3)*k,y+((i/3)|0)*k,k,k,col);x+=4*k;}}
// shared-props-watertower-v1: a small-town water tower, blank tank (the case paints the town's name). Big: about 3 x 6 tiles.
const WATERTOWER={size:[120,210,0,0],anchor:[60,206],lights:[[60,92,1.2,.35]],draw({R,C,E}){const st=P.stone,sd=shade(st,-.3),sl=shade(st,.25);
  for(const[x,lean]of[[18,6],[96,-6],[44,2],[72,-2]]){for(let y=86;y<204;y+=2)R(x+lean*(204-y)/118,y,4,2,x<60?sl:sd);}
  for(const y of[120,160]){R(24,y,74,2,sd);}for(let i=0;i<8;i++){R(26+i*9,120+i*5,3,2,sd);R(92-i*9,120+i*5,3,2,sd);R(26+i*9,160+i*5,3,2,sd);R(92-i*9,160+i*5,3,2,sd);}
  R(56,80,8,126,sd);R(12,204,96,3,shade(P.earth,-.3));
  E(60,54,50,40,sd);E(58,52,48,38,st);E(46,42,26,22,sl);R(12,58,96,26,st,{sh:16});R(12,58,26,26,sl);R(12,82,96,6,sd);R(10,84,100,3,P.outline);
  for(let x=14;x<108;x+=8)R(x,88,2,4,sd);R(10,90,100,2,sd);C(60,12,6,sd);R(59,2,2,8,P.panel);R(56,2,8,2,P.accent);
  for(let y=62;y<84;y+=6)R(14,y,92,1,shade(st,-.1));}};
// shared-props-trafficlight-v1: a traffic light hung on a wire. trafficLight(lit): lit = true shows its blinking amber;
// a blinking light swaps lit and unlit every half second. Lights: the amber glow while lit.
function trafficLight(lit){return{size:[20,40,0,0],anchor:[10,0],lights:lit?[[10,22,1.1,.5]]:[],draw({R,C,P:Px,big}){const bx=P.panel,am=P.light;
  R(9,0,2,4,P.outline);R(2,4,16,34,shade(bx,.08),{sh:5});R(2,4,16,2,shade(bx,.3));
  for(const[y,c,on]of[[10,P.accent,false],[22,am,lit],[34,P.grass,false]]){R(1,y-6,18,2,shade(bx,-.3));C(10,y-1,4.6,on?shade(c,.35):shade(c,-.55));if(on){C(9,y-2,2,shade(c,.75));if(big)Px(8,y-3,"#ffffff");}}}};}
// shared-props-gaspump-v1: one old gas pump, no brand: rounded top, a blank lit face, dials, the hose and nozzle.
// col: the body color (P.accent when left out).
function gasPump(col){return{size:[30,62,0,0],anchor:[15,60],lights:[[15,12,.8,.3]],draw({R,E,C}){const b=col||P.accent,bd=shade(b,-.32),bl=shade(b,.25);
  R(4,54,22,6,shade(P.stone,-.2));R(6,16,18,40,b,{sh:5});R(6,16,4,40,bl);E(15,12,10,8,b);E(13,10,6,4,bl);
  R(9,6,12,10,P.text);R(10,7,10,2,shade(P.text,-.15));R(9,22,12,9,P.outline);R(10,23,10,3,P.light);R(10,27,10,3,shade(P.light,-.2));
  R(11,34,8,1,bd);R(11,37,8,1,bd);R(24,24,4,3,P.outline);R(26,26,2,20,P.outline);R(24,44,6,3,P.panel);R(5,54,20,2,bd);}};}

/* ---------- HOUSES AND CARS ---------- */
// shared-tiles-ranchhouse-v1: a ranch house front in the 3/4 view, built from wall(), roof(), windowPane() and door().
// x0..x1 wide, rt = roof top, rb = eave (wall top), fb = ground line. o: wall ("siding" | "batten" | "brick"), col (wall),
// roofCol, door (x of the door's center), garage (true: a garage door on the right third), curtains, shutters (a color).
// Returns {glows, door}.
function ranchHouse(g,x0,x1,rt,rb,fb,T=16,o={}){const u=T/16,w=x1-x0,col=o.col||P.cream,rc=o.roofCol||P.panel,dr=o.door??(x0+w*.42),glows=[];
  roof(g,x0,x1,rt,rb,rc,T,o.seed|0,!!o.chim);
  wall(g,x0,x1,rb,fb,o.wall||"siding",col,T);
  F(g,x0,rb,w,2*u,rgba(P.outline,.35));
  const gx0=o.garage?x1-w*.34:x1;
  if(o.garage){F(g,gx0,rb+.25*T,x1-gx0-2*u,fb-rb-.25*T,shade(col,-.1));for(let y=rb+.3*T;y<fb-u;y+=3*u){F(g,gx0+u,y,x1-gx0-4*u,2*u,shade(col,.08));F(g,gx0+u,y+2*u,x1-gx0-4*u,u,shade(col,-.25));}
    F(g,gx0,rb+.25*T,u,fb-rb-.25*T,shade(col,-.4));}
  const ww=.7*T,wh=Math.min(.6*T,fb-rb-.55*T);
  for(let wx=x0+.35*T;wx+ww<gx0-.2*T;wx+=1.15*T){if(Math.abs(wx+ww/2-dr)<.75*T)continue;glows.push(windowPane(g,wx,rb+.28*T,ww,wh,T,!!o.curtains));
    if(o.shutters){F(g,wx-.22*T,rb+.28*T,.18*T,wh,o.shutters);F(g,wx+ww+.04*T,rb+.28*T,.18*T,wh,o.shutters);}}
  door(g,dr,fb-.95*T,fb,o.doorCol||shade(P.accent,-.15),T);
  return{glows,door:dr};}
// shared-tiles-porch-v1: a porch on the front of a house: a plank floor, posts, a rail with balusters and steps at stepX.
// Drawn over the house's lower front. x0..x1, fb = the ground line. o: roof (true: a little porch roof on the posts).
function porch(g,x0,x1,fb,T=16,o={}){const u=T/16,top=fb-.5*T,w=x1-x0,sx=o.stepX??(x0+w/2),cr=P.cream;
  if(o.roof){F(g,x0-u,fb-1.55*T,w+2*u,.22*T,shade(P.panel,.1));F(g,x0-u,fb-1.55*T+.22*T,w+2*u,u,P.outline);}
  F(g,x0,top,w,.26*T,P.wood);for(let x=x0;x<x1;x+=4*u)F(g,x,top,u,.26*T,shade(P.wood,-.25));F(g,x0,top,w,u,shade(P.wood,.2));F(g,x0,top+.26*T,w,.24*T,shade(P.woodDark,-.1));
  for(const px of[x0,x1-2*u])F(g,px,fb-1.35*T,2*u,1.35*T-.24*T,cr);
  if(o.roof)for(let px=x0+.9*T;px<x1-.5*T;px+=1.4*T)F(g,px,fb-1.35*T,2*u,1.1*T,cr);
  for(let x=x0;x<x1;x+=3*u){if(Math.abs(x-sx)<.42*T)continue;F(g,x,top-.42*T,u,.42*T,shade(cr,-.12));}
  F(g,x0,top-.45*T,w,u*1.5,cr);F(g,x0,top-.45*T,w,u*.5,shade(cr,.2));
  for(let i=0;i<3;i++)F(g,sx-.38*T-i*u,top+i*.17*T,.76*T+2*i*u,.17*T,i%2?shade(P.stoneWarm,-.05):P.stoneWarm);}
// shared-props-mailbox-v1: a roadside mailbox on a post, flag up (flag = true) or down.
function mailbox(flag=false){return{size:[22,40,0,4],anchor:[10,38],lights:[],draw({R,E}){const m=P.stone,md=shade(m,-.35),ml=shade(m,.3);
  R(8,14,4,24,P.wood,{sh:1});R(6,34,8,4,P.woodDark);E(11,6,8,5,m);R(3,6,16,8,m,{sh:4});R(3,5,10,2,ml);R(2,7,2,7,md);
  if(flag){R(18,-4,2,10,P.accent);R(18,-4,5,4,P.accent);}else R(18,6,6,2,P.accent);}};}
// shared-props-sedan-v1: a parked sedan, 2 facings: "side" (nose left; flip the canvas for nose right) and "front"
// (nose toward the viewer). col: a palette slot name ("cloth", "panel"...) or a case's own tint as a hex color.
function sedan(face="side",col="cloth",tint=false){const B_=col[0]==="#"?col:(P[col]||P.cloth),bd=shade(B_,-.35),bl=shade(B_,.3),gl=tint?shade(P.outline,.12):shade(P.stone,.35),gd=shade(gl,-.25);
  if(face==="front")return{size:[52,52,0,6],anchor:[26,48],lights:[],draw({R,E}){
    R(2,40,48,5,rgba(P.outline,.4));R(8,2,36,14,B_,{sh:6});R(11,4,30,10,gl);R(11,4,30,3,tint?shade(gl,.15):shade(gl,.35));R(11,11,30,3,gd);
    R(2,16,48,22,B_,{sh:8});R(2,16,48,3,bl);R(6,24,9,5,P.light);R(37,24,9,5,P.light);R(16,26,20,6,bd);for(let x=17;x<35;x+=3)R(x,27,1,4,P.outline);
    R(0,33,52,4,shade(P.stone,.2));R(4,37,8,9,P.outline);R(40,37,8,9,P.outline);R(-2,18,4,4,bd);R(50,18,4,4,bd);}};
  return{size:[108,52,4,6],anchor:[52,46],lights:[],draw({R,P:Px}){
    R(2,40,100,4,rgba(P.outline,.4));
    R(24,4,52,16,B_,{sh:6});R(28,6,22,12,gl);R(53,6,20,12,gd);R(28,6,22,3,tint?shade(gl,.15):shade(gl,.4));R(50,6,3,14,B_);
    R(0,20,104,18,B_,{sh:10});R(0,20,104,3,bl);R(0,28,104,1,bd);R(50,20,1,16,bd);R(24,20,1,16,shade(B_,-.2));
    R(-2,22,4,5,P.light);R(102,22,4,6,P.accent);R(-3,34,110,4,shade(P.stone,.15));R(30,24,6,2,bd);R(60,24,6,2,bd);
    for(const x of[10,74]){R(x-2,32,22,4,bd);R(x,34,18,14,P.outline);R(x+5,39,8,6,shade(P.stone,.1));R(x+8,41,2,2,P.panel);}}};}

/* ---------- INTERIORS ---------- */
// shared-tiles-floor-v1: floors, pixel functions. kind: "lino" (checker), "carpet", "wood" (planks), "tile" (small squares).
function floor(x,y,T=16,kind="lino"){const u=T/16,nx=(x/u)|0,ny=(y/u)|0,n=hsh(nx,ny,161);
  if(kind==="carpet"){const c=slot("carpet","cloth");return n<.06?shade(c,.12):(nx+ny*3)%11===0?shade(c,-.14):[c,shade(c,-.05),shade(c,.04)][(hsh(nx,ny,162)*3)|0];}
  if(kind==="wood"){const pw=5*u,row=(y/pw)|0,off=(hsh(row,0,163)*40*u)|0,seg=((x+off)/(22*u))|0,w=P.wood;
    if(y%pw===0||(x+off)%(22*u)===0)return shade(P.woodDark,-.1);return hsh(nx,ny,164)<.05?shade(w,-.2):[shade(w,-.06),w,shade(w,.06)][(hsh(seg,row,165)*3)|0];}
  if(kind==="tile"){const s=5*u;if(x%s===0||y%s===0)return shade(P.stone,.05);const c=shade(P.text,-.12);return n<.04?shade(c,-.12):[c,shade(c,-.04)][(hsh((x/s)|0,(y/s)|0,166)*2)|0];}
  const s=8*u,L=slot("lino","cream"),ck=(((x/s)|0)+((y/s)|0))%2,c=ck?L:shade(L,-.3);return n<.05?shade(c,-.08):n>.97?shade(c,.08):c;}
// shared-tiles-innerwall-v1: an interior wall seen from the room, in pixels: top = ceiling line, bot = the floor line.
// kind: "plain" or "panel" (wood paneling). Trim along the top, a chair rail (plain), and a baseboard.
function innerWall(g,x0,x1,top,bot,kind="plain",col,T=16){const u=T/16,w=x1-x0,c=col||(kind==="panel"?P.wood:P.cream);
  F(g,x0,top,w,bot-top,c);
  if(kind==="panel"){for(let x=x0;x<x1;x+=4*u){F(g,x,top,u,bot-top,shade(c,-.3));if(hsh(x,top,171)<.4)F(g,x+2*u,top,u,bot-top,shade(c,.08));}}
  else{for(let y=top;y<bot;y+=2*u)for(let x=x0;x<x1;x+=2*u)if(hsh(x,y,172)<.07)F(g,x,y,u,u,shade(c,-.07));F(g,x0,top+(bot-top)*.58,w,u,shade(c,-.22));F(g,x0,top+(bot-top)*.58+u,w,u,shade(c,.15));}
  F(g,x0,top,w,2*u,shade(P.woodDark,.1));F(g,x0,top+2*u,w,u,rgba(P.outline,.35));
  F(g,x0,bot-3*u,w,3*u,shade(P.woodDark,.05));F(g,x0,bot-3*u,w,u,shade(P.woodDark,.3));F(g,x0,bot,w,u,rgba(P.outline,.4));}
// shared-props-counter-v1: a counter with stools in front (a diner counter, an office front desk). n = tiles long.
function counter(n=3){const W_=n*32;return{size:[W_+4,52,2,0],anchor:[W_/2,48],lights:[],draw({R,C}){const top=shade(P.text,-.06),fr=P.accent;
  R(0,6,W_,4,top);R(0,6,W_,1,shade(top,.2));R(0,10,W_,2,shade(top,-.35));R(0,12,W_,18,fr,{sh:8});R(0,14,W_,2,shade(fr,.2));for(let x=6;x<W_;x+=12)R(x,18,6,8,shade(fr,-.18));
  for(let x=10;x<W_-4;x+=16){R(x+3,34,2,12,P.panel);R(x-1,44,10,3,P.panel);C(x+4,32,5,P.accent);R(x,30,8,2,shade(P.accent,.3));R(x+4,33,5,2,shade(P.accent,-.3));}}};}
// shared-props-tablechairs-v1: a table and chairs seen from the 3/4 view. top = the tabletop color (P.cream when left out).
function tableChairs(top){return{size:[52,46,0,4],anchor:[26,42],lights:[],draw({R,E}){const t=top||P.cream;
  for(const x of[4,40]){R(x,10,8,22,P.wood,{sh:2});R(x,8,8,3,shade(P.wood,.2));R(x+1,32,2,8,P.woodDark);R(x+5,32,2,8,P.woodDark);}
  R(10,16,32,10,t,{sh:6});R(10,16,32,2,shade(t,.2));R(10,26,32,3,shade(t,-.4));R(14,29,3,12,P.woodDark);R(35,29,3,12,P.woodDark);
  R(18,18,6,4,P.text);R(28,17,4,6,shade(P.stone,.2));E(21,20,2,1,shade(P.woodDark,-.2));}};}
// shared-props-desk-v1: a desk with a chair and a lamp (the lamp glows; lights 1.1 tiles @ .4).
const DESK={size:[64,54,0,0],anchor:[32,50],lights:[[50,8,1.1,.4]],draw({R,E}){const w=P.wood;
  R(18,30,26,16,P.panel,{sh:4});R(20,26,22,6,shade(P.panel,.15));R(24,46,3,6,P.outline);R(36,46,3,6,P.outline);
  R(2,14,60,6,shade(w,.1));R(2,14,60,1,shade(w,.3));R(2,20,60,16,w,{sh:8});R(4,22,18,6,shade(w,-.15));R(4,29,18,6,shade(w,-.15));R(12,24,4,1,P.brass);R(12,31,4,1,P.brass);
  R(2,36,4,12,P.woodDark);R(58,36,4,12,P.woodDark);
  R(8,8,14,6,P.text);R(9,9,12,1,shade(P.text,-.3));R(26,10,10,4,shade(P.stone,.2));
  R(49,6,2,8,P.panel);E(50,5,7,4,P.cloth);E(50,4,5,2,shade(P.cloth,.3));R(46,13,8,2,P.panel);E(50,9,3,1,P.light);}};
// shared-props-bed-v1: a bed and a nightstand with a lamp (lights 1 tile @ .35). Seen from the foot, in the 3/4 view.
const BED={size:[64,58,0,0],anchor:[30,54],lights:[[56,18,1,.35]],draw({R,E}){const sh=P.text,q=P.cloth;
  R(2,2,44,10,P.wood,{sh:6});R(2,2,44,2,shade(P.wood,.25));R(4,10,40,8,sh);R(6,11,14,6,shade(sh,.05));R(26,11,14,6,shade(sh,.05));
  R(2,18,44,28,q,{sh:8});R(2,18,44,3,shade(q,.25));for(let y=24;y<46;y+=6)R(4,y,40,1,shade(q,-.2));R(2,44,44,4,shade(q,-.35));R(2,48,4,6,P.woodDark);R(42,48,4,6,P.woodDark);
  R(48,26,16,20,P.wood,{sh:4});R(48,26,16,2,shade(P.wood,.25));R(52,34,8,1,P.brass);R(49,46,3,6,P.woodDark);R(60,46,3,6,P.woodDark);
  R(55,16,2,10,P.panel);E(56,15,6,4,P.cream);E(56,14,4,2,shade(P.cream,.3));}};
// shared-props-shelf-v1: shelving. stocked = true fills it with boxes, cans and jars; false leaves it bare and dusty.
function shelving(stocked=true,w=44){return{size:[w+4,70,2,0],anchor:[w/2,66],lights:[],draw({R}){const m=shade(P.stone,.05);
  R(0,0,3,66,m,{sh:1});R(w-3,0,3,66,shade(m,-.3));for(const y of[6,24,42,60])R(0,y,w,3,shade(m,.2));
  if(!stocked){for(const y of[6,24,42])R(4,y-1,w-8,1,shade(m,-.15));return;}
  const cols=[P.accent,P.cream,P.cloth,P.brass,P.grass,P.pumpkin];
  for(const[i,y]of[[0,6],[1,24],[2,42],[3,60]]){let x=4;while(x<w-6){const k=(hsh(x,i,181)*6)|0,bw=4+((hsh(x,i,182)*5)|0),bh=8+((hsh(x,i,183)*8)|0);if(x+bw>w-4)break;
    R(x,y-bh,bw,bh,cols[k],{sh:1});R(x,y-bh,bw,1,shade(cols[k],.3));x+=bw+1;}}}};}

/* ---------- FAIR (seasonal) ---------- */
// shared-props-stringlights-v1: a string of bulbs on a sagging wire, drawn straight onto the scene from (x0, y0) to
// (x1, y1) in canvas pixels. lit = true shows them on, twinkling a little with now. Returns their glows for the light pass.
function stringLights(ctx,x0,y0,x1,y1,sag=6,lit=true,now=0,gap=6){const n=Math.max(2,Math.round(Math.hypot(x1-x0,y1-y0)/gap)),cols=[P.light,P.accent,slot("leaf","grass"),P.glass,P.text],glows=[];
  ctx.fillStyle=P.outline;for(let i=0;i<=n*3;i++){const t=i/(n*3),x=x0+(x1-x0)*t,y=y0+(y1-y0)*t+Math.sin(t*Math.PI)*sag;ctx.fillRect(Math.round(x),Math.round(y),1,1);}
  for(let i=1;i<n;i++){const t=i/n,x=Math.round(x0+(x1-x0)*t),y=Math.round(y0+(y1-y0)*t+Math.sin(t*Math.PI)*sag)+1,c=cols[i%5],on=lit&&!(hsh(i,(now/700)|0,191)<.06);
    ctx.fillStyle=on?shade(c,.35):shade(c,-.5);ctx.fillRect(x,y,1,2);if(on){ctx.fillStyle=shade(c,.8);ctx.fillRect(x,y,1,1);glows.push([x,y+1,5,.25]);}}
  return glows;}
// shared-props-booth-v1: a fair game booth with a striped awning, a counter, prizes on the back wall and a blank sign
// across the top (the case paints the game's name at design [10, -10], 52 x 10). stripe: the awning's second color.
function booth(stripe){return{size:[72,74,0,14],anchor:[36,58],lights:[[36,4,1.4,.4]],draw({R,E,C}){const s2=stripe||P.accent,s1=P.text;
  R(4,-14,64,14,P.cream,{sh:6});R(4,-14,64,2,shade(P.cream,.3));R(6,-12,60,10,shade(P.cream,-.04));
  R(2,0,4,58,P.wood,{sh:1});R(66,0,4,58,shade(P.wood,-.25));R(6,4,60,26,shade(P.panel,.1));
  for(let x=8;x<64;x+=8){const k=((hsh(x,1,192)*4)|0);E(x+3,14,3.5,4,[P.accent,P.brass,P.cloth,slot("leaf","grass")][k]);C(x+2,12,1,P.outline);C(x+4,12,1,P.outline);}
  for(let x=8;x<64;x+=6)R(x,22,4,6,[P.cloth,P.brass,P.glass][((x/6)|0)%3]);
  for(let x=0;x<72;x+=9){R(x,0,9,8,((x/9)|0)%2?s1:s2,{sh:2});R(x+2,8,5,2,((x/9)|0)%2?s1:s2);}R(0,-1,72,2,P.outline);
  R(4,32,64,6,shade(P.wood,.15));R(4,32,64,1,shade(P.wood,.35));R(4,38,64,20,s2,{sh:10});for(let x=8;x<64;x+=8)R(x,40,4,16,shade(s2,.18));}};}
// shared-props-ferriswheel-v1: a Ferris wheel drawn straight onto the scene: the A-frame, rim, spokes and 8 cars.
// (cx, cy) the hub in canvas pixels, r the rim's radius, a the turn in radians (a fixed a = still; a growing a = turning).
// lit = bulbs on the rim and the hub. Returns its glows.
function ferrisWheel(ctx,cx,cy,r,a=0,lit=false){const fr=P.panel,fl=shade(P.stone,.2),glows=[],px=(x,y,c,w=1,h=1)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h);};
  const line=(x0,y0,x1,y1,c,w=1)=>{const n=Math.ceil(Math.hypot(x1-x0,y1-y0));for(let i=0;i<=n;i++)px(x0+(x1-x0)*i/n,y0+(y1-y0)*i/n,c,w,w);};
  line(cx-r*.75,cy+r+12,cx,cy,shade(fr,.2),2);line(cx+r*.75,cy+r+12,cx,cy,fr,2);line(cx-r*.45,cy+r*.62,cx+r*.45,cy+r*.62,fr);px(cx-r*.75-3,cy+r+11,shade(fr,-.3),r*1.5+8,3);
  for(let k=0;k<16;k++){const t=a+k*Math.PI/8;line(cx,cy,cx+Math.cos(t)*r,cy+Math.sin(t)*r,k%2?shade(fl,-.25):fl);}
  for(let i=0;i<Math.ceil(r*6.3);i++){const t=i/r;px(cx+Math.cos(t)*r,cy+Math.sin(t)*r,fl);px(cx+Math.cos(t)*(r-3),cy+Math.sin(t)*(r-3),shade(fl,-.3));}
  if(lit)for(let k=0;k<24;k++){const t=a+k*Math.PI/12,x=cx+Math.cos(t)*r,y=cy+Math.sin(t)*r,c=[P.light,P.accent,P.glass][k%3];px(x,y,shade(c,.5),1,1);glows.push([x,y,4,.2]);}
  const cars=[P.accent,P.brass,P.cloth,slot("leaf","grass")];
  for(let k=0;k<8;k++){const t=a+k*Math.PI/4,x=cx+Math.cos(t)*r,y=cy+Math.sin(t)*r;px(x,y,P.outline,1,3);const c=cars[k%4];
    px(x-4,y+3,P.outline,9,7);px(x-3,y+3,c,7,5);px(x-3,y+3,shade(c,.3),7,1);px(x+2,y+4,shade(c,-.3),2,4);px(x-2,y+5,shade(P.night,.1),5,2);if(lit)px(x-1,y+5,shade(P.light,.2),2,1);}
  px(cx-2,cy-2,P.outline,5,5);px(cx-1,cy-1,lit?P.light:fl,3,3);if(lit)glows.push([cx,cy,8,.3]);
  return glows;}
// shared-tiles-parkinglot-v1 (Lot 83 lists it; drawn here first for Good Manners' paved main street): asphalt, a pixel
// function, plus painted lines drawn with paintLine(g, x, y, w, h, dashed).
function asphalt(x,y,T=16){const u=T/16,nx=(x/u)|0,ny=(y/u)|0,a=slot("asphalt","panel"),n=hsh(nx,ny,201);
  if(n<.05)return shade(a,.18);if(n>.985)return shade(P.stone,.1);if(hsh(nx>>3,ny>>3,202)<.12&&hsh(nx,ny,203)<.5)return shade(a,-.18);return[a,shade(a,-.05),shade(a,.05)][(hsh(nx,ny,204)*3)|0];}
function paintLine(g,x,y,w,h,dashed=false,col){const c=col||P.light;if(!dashed){F(g,x,y,w,h,c);return;}const horiz=w>=h,L=horiz?w:h;for(let i=0;i<L;i+=12)horiz?F(g,x+i,y,Math.min(7,L-i),h,c):F(g,x,y+i,w,Math.min(7,L-i),c);}


/* ===== APARTMENTS, NIGHT LIGHT, HOUSES AND CARS, INTERIORS · more v1 pieces, added Nov 23, 2026 =====
   Drawn first for Black Lantern's Lot 83 (its spec 012 lists the kits): a two-story apartment block's walkway, stairs,
   numbered doors, window units, chain-link and pool, a work van and work light, the bug-light glow, and more rooms.
   Two new palette slots (a game's palette without them falls back as noted): zap (bug-light purple), pooltile (pool tile). */
SLOTS.push(["zap","bug-light purple"],["pooltile","pool tile"]);
Object.assign(PALETTES.blacklantern,{zap:"#a070ff",pooltile:"#3fa8a0"});
Object.assign(PALETTES.rushlight,{zap:"#8a6ac8",pooltile:"#4a8a80"});

/* ---------- NIGHT LIGHT ---------- */
// shared-effects-bugzap-v1: bug-light purple glow over porches and walkways, after the night darkness is drawn.
// pools: [[x, y, r], ...] in canvas pixels. The glow buzzes, and now and then the zapper sparks. BUGLIGHT is the fixture.
function bugZap(ctx,pools,now=0){const Z=slot("zap","glow");
  ctx.globalCompositeOperation="lighter";
  pools.forEach(([x,y,r],i)=>{const f=.85+.15*Math.sin(now/53+i*1.7)*Math.sin(now/131+i),c=ctx.createRadialGradient(x,y,0,x,y,r);
    c.addColorStop(0,rgba(Z,.36*f));c.addColorStop(.45,rgba(Z,.15*f));c.addColorStop(1,rgba(Z,0));ctx.fillStyle=c;ctx.fillRect(x-r,y-r,r*2,r*2);
    if(hsh(i,(now/160)|0,211)<.05){ctx.fillStyle=rgba(P.lightTo,.95);ctx.fillRect(Math.round(x)-1,Math.round(y)-1,3,2);ctx.fillRect(Math.round(x),Math.round(y)-3,1,6);}});
  ctx.globalCompositeOperation="source-over";}
const BUGLIGHT={size:[14,24,0,0],anchor:[7,22],lights:[[7,13,1.2,.25]],draw({R}){const Z=slot("zap","glow");
  R(6,0,2,5,P.panel);R(2,5,10,2,P.panel);R(3,7,8,12,shade(Z,.25));R(3,7,8,2,shade(Z,.55));for(let x=3;x<11;x+=2)R(x,7,1,12,shade(P.panel,.1));R(2,19,10,2,P.panel);R(5,21,4,2,P.panel);}};
// shared-props-worklight-v1: a work light on a tripod, two halogen heads. workLight(on): on = lit, with its pool of light.
function workLight(on=true){return{size:[30,66,0,0],anchor:[15,64],lights:on?[[15,8,3.2,.6]]:[],draw({R}){const m=P.panel,y=P.light;
  for(let i=0;i<13;i++){R(14-i*.95,38+i*2,2,2,shade(m,.15));R(15+i*.95,38+i*2,2,2,shade(m,-.15));}
  R(14,14,2,48,shade(P.stone,.1),{sh:1});R(13,36,4,3,m);R(5,13,20,2,m);R(14,11,2,3,m);
  for(const x of[2,16]){R(x,1,12,12,m,{sh:3});R(x,1,12,1,shade(m,.3));R(x+1,2,10,9,on?shade(y,.35):shade(P.stone,-.25));if(on)R(x+1,2,10,3,shade(y,.75));
    for(let k=x+2;k<x+11;k+=3)R(k,2,1,9,on?shade(y,-.05):shade(m,.1));}
  R(6,62,18,2,shade(m,-.2));R(20,40,1,24,shade(P.accent,-.2));R(19,62,6,2,shade(P.accent,-.3));}};}

/* ---------- HOUSES AND CARS ---------- */
// shared-props-van-v1: a work van, blank sides (the case paints the company), 2 facings like the sedan: "side" (nose left)
// and "front". col: a palette slot name or a hex color. The side's blank panel, in design pixels, is VAN_SIGN [x, y, w, h].
const VAN_SIGN=[40,10,70,20];
function van(face="side",col="cream"){const B_=col[0]==="#"?col:(P[col]||P.cream),bd=shade(B_,-.35),bl=shade(B_,.3),gl=shade(P.stone,.35),gd=shade(gl,-.25);
  if(face==="front")return{size:[56,66,0,6],anchor:[28,62],lights:[],draw({R}){
    R(2,54,52,5,rgba(P.outline,.4));R(4,0,48,22,B_,{sh:8});R(4,0,48,3,bl);R(8,6,40,14,gl);R(8,6,40,4,shade(gl,.3));R(8,16,40,4,gd);
    R(2,22,52,26,B_,{sh:9});R(2,22,52,3,bl);R(6,30,10,6,P.light);R(40,30,10,6,P.light);R(18,32,20,8,bd);for(let x=19;x<37;x+=3)R(x,33,1,6,P.outline);
    R(0,44,56,5,shade(P.stone,.2));R(4,49,9,11,P.outline);R(43,49,9,11,P.outline);R(-2,24,4,5,bd);R(54,24,4,5,bd);}};
  return{size:[126,62,4,6],anchor:[62,56],lights:[],draw({R}){
    R(2,50,120,4,rgba(P.outline,.4));
    R(34,0,86,40,B_,{sh:10});R(34,0,86,3,bl);R(118,2,2,38,bd);                       // the box
    R(6,8,30,32,B_);R(6,8,30,2,bl);R(10,10,22,13,gl);R(10,10,22,3,shade(gl,.4));R(10,19,22,4,gd);R(32,8,3,32,bd);  // the cab
    R(0,22,10,18,B_,{sh:3});R(0,22,10,2,bl);R(-2,26,4,6,P.light);R(0,34,10,2,bd);
    R(38,4,1,36,shade(B_,-.18));R(92,4,1,36,shade(B_,-.18));R(88,18,3,8,P.panel);R(26,24,6,2,bd);   // door seams, handles
    R(114,6,5,9,shade(P.accent,-.05));R(114,6,5,2,shade(P.accent,.3));R(64,-4,28,4,P.panel);R(64,-4,28,1,shade(P.panel,.3));  // taillight, roof rack
    R(-3,38,128,4,shade(P.stone,.15));
    for(const x of[12,94]){R(x-2,34,24,5,bd);R(x,36,20,16,P.outline);R(x+6,41,8,8,shade(P.stone,.1));R(x+9,44,2,2,P.panel);}}};}

/* ---------- APARTMENTS ---------- */
// shared-tiles-walkway-v1: a second-floor open walkway in the 3/4 view, in pixels. top = the walkway floor's top (it is
// one tile deep, so people walk on it), fb = the ground line its posts stand on. o: post (tiles between posts, 3),
// rail (rail color, P.panel), gaps ([[x0, x1], ...] in pixels where the rail opens for stairs).
function walkway(g,x0,x1,top,fb,T=16,o={}){const u=T/16,w=x1-x0,c=shade(P.stone,.2),lip=top+T,rc=o.rail||P.panel,gaps=o.gaps||[];
  const inGap=x=>gaps.some(([a,b])=>x>=a&&x<b);
  F(g,x0,top,w,T,c);for(let y=top+4*u;y<lip;y+=5*u)F(g,x0,y,w,u,shade(c,-.06));
  for(let x=x0;x<x1;x+=2*u)if(hsh(x,top,221)<.14)F(g,x,top+2*u+((hsh(x,1,222)*(T-4*u))|0),2*u,u,shade(c,-.15));
  for(let x=x0+7*u;x<x1;x+=23*u)F(g,x,top+u,u,T-2*u,shade(c,-.1));                    // slab joints
  F(g,x0,top,w,2*u,rgba(P.outline,.3));                                                 // where it meets the upper wall
  F(g,x0,lip,w,3*u,shade(c,-.22));F(g,x0,lip,w,u,shade(c,.18));F(g,x0,lip+3*u,w,5*u,rgba(P.outline,.32));  // slab edge, its shadow below
  const step=(o.post||3)*T;for(let x=x0+.4*T;x<x1;x+=step){F(g,x,lip+3*u,2*u,fb-lip-3*u,shade(rc,.2));F(g,x+2*u,lip+3*u,u,fb-lip-3*u,shade(rc,-.25));F(g,x-u,fb-2*u,4*u,2*u,shade(rc,-.1));}
  const rt=lip-.6*T;
  for(let x=x0;x<x1;x+=3*u)if(!inGap(x))F(g,x,rt,u,lip-rt,shade(rc,.05));
  for(let x=x0;x<x1;x++)if(!inGap(x)){F(g,x,rt-u,1,2*u,shade(rc,.28));F(g,x,rt+u,1,u,shade(rc,-.3));F(g,x,lip-2*u,1,u,shade(rc,-.1));}
  return{lip,rail:rt};}
// shared-tiles-metalstairs-v1: outdoor metal stairs running up the screen, from the ground line fb to the walkway at top.
// x0 is the flight's left edge; o: w (width in pixels, one tile), col (the stringers, P.panel).
function metalStairs(g,x0,top,fb,T=16,o={}){const u=T/16,w=o.w||T,m=o.col||P.panel,ml=shade(m,.3),md=shade(m,-.3),tr=shade(P.stone,.12);
  F(g,x0+u,top,w-2*u,fb-top,rgba(P.outline,.55));
  for(let y=top+u;y<fb-u;y+=4*u){F(g,x0+2*u,y,w-4*u,2*u,tr);F(g,x0+2*u,y,w-4*u,u,shade(tr,.25));for(let x=x0+3*u+((y/(4*u))%2)*u;x<x0+w-3*u;x+=3*u)F(g,x,y+u,u,u,shade(tr,-.15));F(g,x0+2*u,y+2*u,w-4*u,u,md);}
  F(g,x0,top,2*u,fb-top,m);F(g,x0,top,u,fb-top,ml);F(g,x0+w-2*u,top,2*u,fb-top,md);
  for(const[rx,c]of[[x0,ml],[x0+w-u,m]]){F(g,rx,top-.55*T,u,fb-top,c);for(let y=top;y<fb;y+=.75*T)F(g,rx,y-.55*T,u,.55*T,shade(c,-.15));}
  F(g,x0-u,fb-u,w+2*u,2*u,shade(P.stoneWarm,-.2));F(g,x0-u,top-.55*T,2*u,u,ml);F(g,x0+w-u,top-.55*T,2*u,u,m);}
// shared-tiles-numberdoor-v1: an apartment or motel door with a number plate, a peephole and a porch light.
// Like door(): centered on cx, top dy, bottom fb. o: plate (plate color, P.brass), lamp (false: no light), lit (false: the
// light is off). Returns the porch light's glow, or null.
function numberDoor(g,cx,dy,fb,col,num,T=16,o={}){const u=T/16;door(g,cx,dy,fb,col,T);
  const s=String(num),pl=o.plate||P.brass,pw=signWidth(s)+4*u,px=Math.round(cx-pw/2),py=Math.round(dy+.2*T);
  F(g,px,py,pw,7*u,shade(pl,-.35));F(g,px+u,py,pw-2*u,6*u,pl);F(g,px+u,py,pw-2*u,u,shade(pl,.3));signText(g,s,px+2*u,py+u,P.outline);
  F(g,cx-u/2,dy+.62*T,u,u,P.outline);
  if(o.lamp===false)return null;const lx=Math.round(cx+.55*T);F(g,lx-u,dy-.05*T,4*u,4*u,P.panel);F(g,lx,dy-.05*T+u,2*u,2*u,o.lit===false?shade(P.light,-.55):shade(P.light,.4));
  return o.lit===false?null:[lx+u,dy+2*u,1.1*T,.4];}
// shared-props-windowac-v1: a window AC unit, drawn onto a wall in pixels with its top left at (x, y), about 0.8 x 0.5
// tiles. o: on (false: the power light is out), drip (true: a rust stain runs down the wall under it).
function windowAC(g,x,y,T=16,o={}){const u=T/16,w=Math.round(.82*T),h=Math.round(.5*T),c=shade(P.stone,.34),cd=shade(c,-.32);
  if(o.drip){F(g,x+w*.3,y+h+2*u,2*u,.45*T,rgba(P.woodDark,.35));F(g,x+w*.3,y+h+2*u,u,.6*T,rgba(P.woodDark,.25));}
  F(g,x-u,y-u,w+2*u,h+3*u,P.outline);F(g,x,y,w,h,c);F(g,x,y,w,u,shade(c,.28));F(g,x+w-2*u,y,2*u,h,cd);
  for(let k=y+2*u;k<y+h-u;k+=2*u)F(g,x+2*u,k,Math.round(w*.55),u,cd);F(g,x+Math.round(w*.68),y+2*u,Math.round(w*.2),h-4*u,shade(c,-.12));
  F(g,x+Math.round(w*.72),y+3*u,u,u,o.on===false?cd:P.accent);F(g,x+u,y+h,w-2*u,2*u,shade(P.panel,.1));}
// shared-tiles-chainlink-v1: a chain-link fence along the screen, in pixels: top = its top rail, o.h its height (0.85
// tiles). o: post (tiles between posts, 2), gate ([x0, x1] in pixels), open (the gate stands open), col (the mesh).
// chainLinkSide(g, x, y0, y1) is the same fence running up the screen, seen end-on.
function chainLink(g,x0,x1,top,T=16,o={}){const u=T/16,h=Math.round(o.h||.85*T),fb=top+h,m=o.col||shade(P.stone,.32),md=shade(m,-.35),gt=o.gate;
  for(let y=top+u;y<fb;y+=u)for(let x=x0;x<x1;x+=u){if(gt&&o.open&&x>=gt[0]&&x<gt[1])continue;const i=Math.round((x-x0)/u),j=Math.round((y-top)/u);
    if((i+j)%4===0||((i-j)%4+4)%4===0)F(g,x,y,u,u,hsh(x,y,231)<.6?m:md);}
  F(g,x0,top,x1-x0,u,shade(m,.25));F(g,x0,top+u,x1-x0,u,md);F(g,x0,fb-u,x1-x0,u,md);
  for(let x=x0;x<x1-2*u;x+=(o.post||2)*T){F(g,x,top-u,2*u,h+u,shade(P.panel,.25));F(g,x+u,top-u,u,h+u,P.panel);}
  F(g,x1-2*u,top-u,2*u,h+u,shade(P.panel,.25));
  if(gt){F(g,gt[0],top-u,2*u,h+u,P.panel);F(g,gt[1]-2*u,top-u,2*u,h+u,P.panel);if(!o.open){F(g,gt[0],top+h/2,gt[1]-gt[0],u,md);F(g,gt[1]-5*u,top+h/2-u,3*u,3*u,P.brass);}}
  return fb;}
function chainLinkSide(g,x,y0,y1,T=16,o={}){const u=T/16,h=Math.round(o.h||.85*T),m=o.col||shade(P.stone,.32),md=shade(m,-.35);
  for(let y=y0-h;y<y1;y+=u)if(((y/u)|0)%2===0)F(g,x,y,u,u,m);else F(g,x+u,y,u,u,md);
  F(g,x-u,y0-h,u,y1-y0+h,shade(m,.2));for(let y=y0;y<=y1;y+=(o.post||2)*T){F(g,x-u,y-h-u,3*u,h+u,shade(P.panel,.25));F(g,x+u,y-h-u,u,h+u,P.panel);}}
// shared-tiles-pool-v1: a small pool in the 3/4 view, in pixels, its water (or floor) from (x0, y0) to (x1, y1): coping
// around it, a tile band on the far wall, and the water, or with o.empty the dry plaster floor (stains, cracks, leaves, a
// drain in the deep end). o: deep ("left" or "right", "right"), ladder (x of a ladder on the far wall), steps (true: steps
// at the shallow end). Returns {floor: the y where the far wall meets the floor, deep: [x0, x1] of the deep end}.
function pool(g,x0,y0,x1,y1,T=16,o={}){const u=T/16,w=x1-x0,h=y1-y0,t=slot("pooltile","glass"),cp=shade(P.cream,.12),pl=shade(P.text,-.2),wallH=Math.round(.75*T);
  const dr=o.deep!=="left",dx0=dr?x0+w*.62:x0,dx1=dr?x1:x0+w*.38,fl=y0+wallH;
  F(g,x0-3*u,y0-3*u,w+6*u,h+6*u,cp);for(let x=x0-3*u;x<x1+3*u;x+=6*u){F(g,x,y0-3*u,u,3*u,shade(cp,-.22));F(g,x,y1,u,3*u,shade(cp,-.22));}
  for(let y=y0;y<y1;y+=6*u){F(g,x0-3*u,y,3*u,u,shade(cp,-.22));F(g,x1,y,3*u,u,shade(cp,-.22));}
  F(g,x0-3*u,y0-3*u,w+6*u,u,shade(cp,.22));F(g,x0-3*u,y1+2*u,w+6*u,u,shade(cp,-.4));
  if(!o.empty){for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x+=u){const deep=x>=dx0&&x<dx1,b=deep?shade(t,-.18):t,r=Math.sin(x*.21+y*.5)+Math.sin(x*.07-y*.31);
      F(g,x,y,u,1,r>1.5?shade(b,.35):r<-1.4?shade(b,-.12):b);}
    for(let x=x0;x<x1;x+=4*u)F(g,x,y0,4*u,3*u,((x-x0)/(4*u))%2?shade(t,.15):shade(t,-.1));F(g,x0,y0+3*u,w,u,rgba(P.lightTo,.35));}
  else{
    F(g,x0,fl,w,y1-fl,pl);
    for(let y=fl;y<y1;y++){const k=(y-fl)/(y1-fl);F(g,dx0,y,dx1-dx0,1,shade(pl,-.12-.18*k));}
    for(let y=fl;y<y1;y+=u)for(let x=x0;x<x1;x+=u){const n=hsh(x,y,241);if(n<.03)F(g,x,y,u,u,shade(pl,-.25));else if(n>.985)F(g,x,y,u,u,shade(pl,.15));}
    for(let i=0;i<5;i++){let cx=x0+hsh(i,1,242)*w,cy=fl+hsh(i,2,242)*(y1-fl);for(let k=0;k<18;k++){F(g,cx,cy,u,u,shade(pl,-.45));cx+=(hsh(i,k,243)-.3)*3*u;cy+=(hsh(i,k,244)-.5)*2*u;if(cy<fl||cy>=y1)break;}}
    for(let i=0;i<7;i++)F(g,x0+hsh(i,3,245)*w,fl+3*u+hsh(i,4,245)*(y1-fl-4*u),2*u,u,[shade(P.wood,.1),slot("dry","straw"),shade(P.earth,.1)][i%3]);
    F(g,dx0,fl,u,y1-fl,shade(pl,-.32));for(let y=fl;y<y1;y+=3*u)F(g,dx0-2*u,y,2*u,u,shade(pl,-.18));
    const sx=(dx0+dx1)/2,sy=y1-.4*T;F(g,sx-3*u,sy-2*u,6*u,4*u,shade(P.stone,-.3));for(let k=0;k<3;k++)F(g,sx-2*u,sy-u+k*u,4*u,u/2,P.outline);
    F(g,x0,y1-3*u,w,3*u,rgba(P.outline,.12));}
  // the far wall's tile band and plaster, the side walls' edges
  if(o.empty){F(g,x0,y0,w,wallH,shade(pl,-.08));F(g,x0,fl-u,w,u,shade(pl,-.35));for(let y=y0+4*u;y<fl-u;y+=u)if(hsh(x0,y,246)<.5)F(g,x0+hsh(y,1,247)*w,y,3*u,u,shade(pl,-.15));}
  for(let x=x0;x<x1;x+=4*u)F(g,x,y0,4*u,4*u,((x-x0)/(4*u))%2?t:shade(t,-.2));F(g,x0,y0+4*u,w,u,shade(t,-.45));
  F(g,x0,y0,2*u,h,rgba(P.outline,.28));F(g,x1-2*u,y0,2*u,h,rgba(P.lightTo,.12));
  if(o.ladder!=null){const lx=o.ladder;for(const k of[0,5*u]){F(g,lx+k,y0-5*u,u,wallH+5*u,shade(P.stone,.4));F(g,lx+k,y0-6*u,u,u,shade(P.stone,.55));}for(let y=y0+2*u;y<fl;y+=3*u)F(g,lx,y,6*u,u,shade(P.stone,.25));}
  if(o.steps){const sx=dr?x0+2*u:x1-.9*T;for(let i=0;i<3;i++){F(g,sx,fl+i*3*u,.85*T,2*u,shade(pl,.12-i*.05));F(g,sx,fl+i*3*u+2*u,.85*T,u,shade(pl,-.3));}}
  return{floor:fl,deep:[dx0,dx1]};}
// shared-props-dumpster-v1: a dumpster. open = the lid up with trash showing. col: its paint (P.leaf, or P.grass).
function dumpster(open=false,col){return{size:[68,52,0,10],anchor:[34,48],lights:[],draw({R}){const c=col||slot("leaf","grass"),cd=shade(c,-.35),cl=shade(c,.25);
  R(2,40,64,6,rgba(P.outline,.35));R(4,12,60,30,c,{sh:12});R(4,12,60,3,cl);for(let x=12;x<58;x+=10)R(x,16,2,22,cd);R(2,38,64,4,cd);
  R(6,42,6,6,P.outline);R(56,42,6,6,P.outline);R(0,18,4,4,cd);R(64,18,4,4,cd);R(24,24,20,6,shade(c,-.15));R(25,25,18,1,shade(P.text,-.2));
  if(open){R(2,-8,64,6,shade(c,-.15));R(2,-8,64,2,cl);R(6,4,56,9,P.outline);R(10,2,12,7,P.text);R(10,2,12,1,shade(P.text,.2));R(26,5,8,5,shade(P.wood,.25));R(38,1,12,8,shade(P.cream,-.15));R(52,4,6,6,shade(P.accent,-.2));}
  else{R(2,6,64,8,shade(c,-.08),{sh:10});R(2,6,64,2,cl);R(14,10,6,2,cd);R(48,10,6,2,cd);}}};}

/* ---------- INTERIORS ---------- */
// shared-props-kitchen-v1: kitchen pieces in the 3/4 view: kitchen("fridge"), kitchen("stove"), kitchen("sink").
// The fridge's door front, in design pixels, is FRIDGE_FRONT [x, y, w, h] (for magnets and drawings the case adds).
const FRIDGE_FRONT=[4,30,24,30];
function kitchen(kind="fridge"){const wt=shade(P.text,-.06),wd=shade(wt,-.3);
  if(kind==="stove")return{size:[34,48,0,0],anchor:[17,46],lights:[],draw({R,E}){
    R(1,10,32,36,wt,{sh:6});R(1,8,32,4,shade(wt,.15));R(1,4,32,4,shade(P.panel,.2));for(let x=5;x<31;x+=6)R(x,5,3,2,P.text);
    for(const[x,y]of[[9,10],[25,10]]){E(x,y,5,2,P.outline);E(x,y,3,1,shade(P.panel,.2));}R(4,18,26,20,shade(wt,-.1));R(6,20,22,10,P.outline);R(7,21,20,3,shade(P.panel,.3));R(6,33,22,2,P.panel);R(1,44,32,2,wd);}};
  if(kind==="sink")return{size:[40,46,0,0],anchor:[20,44],lights:[],draw({R}){const cab=P.wood;
    R(0,14,40,30,cab,{sh:6});R(2,18,17,22,shade(cab,-.12));R(21,18,17,22,shade(cab,-.12));R(16,26,2,4,P.brass);R(22,26,2,4,P.brass);
    R(0,10,40,5,shade(P.text,-.15));R(0,10,40,1,shade(P.text,.15));R(8,11,24,3,shade(P.stone,-.15));R(18,2,3,9,shade(P.stone,.35));R(18,2,8,2,shade(P.stone,.35));R(25,3,2,3,shade(P.stone,.2));R(0,42,40,2,shade(cab,-.4));}};
  return{size:[32,66,0,0],anchor:[16,64],lights:[],draw({R}){
    R(2,0,28,64,wt,{sh:6});R(2,0,28,2,shade(wt,.2));R(2,26,28,2,wd);R(24,6,2,14,shade(P.stone,.15));R(24,32,2,18,shade(P.stone,.15));R(3,2,2,60,shade(wt,.12));R(2,62,28,2,P.outline);}};}
// shared-props-ceilingfan-v1: a ceiling fan seen from above, drawn straight onto the scene at its hub (cx, cy), canvas
// pixels; r = blade length. frame 0 or 1 (swap them every 100 ms or so for a turning fan); still = no blur.
function ceilingFan(ctx,cx,cy,r=13,frame=0,still=false){const px=(x,y,c,w=1,h=1)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h);},a0=frame?Math.PI/4:0,bl=P.wood,bd=shade(bl,-.35);
  if(!still){ctx.fillStyle=rgba(P.outline,.12);ctx.beginPath();ctx.ellipse(cx,cy,r+1,(r+1)*.55,0,0,6.283);ctx.fill();}
  for(let k=0;k<4;k++){const a=a0+k*Math.PI/2;for(let i=3;i<=r;i++){const x=cx+Math.cos(a)*i,y=cy+Math.sin(a)*i*.55,wd=i<5?1:2;px(x-wd/2,y-wd/2,P.outline,wd+1,wd+1);}
    for(let i=3;i<=r-1;i++){const x=cx+Math.cos(a)*i,y=cy+Math.sin(a)*i*.55;px(x-.5,y-.5,i>r*.6?bd:bl,i<5?1:2,i<5?1:2);}}
  px(cx-2,cy-2,P.outline,5,4);px(cx-1,cy-1,shade(P.brass,-.1),3,2);px(cx-1,cy-1,shade(P.brass,.3),1,1);px(cx,cy+2,P.outline,1,4);}
// shared-props-boxes-v1: cardboard boxes, taped. v = 0 (one box), 1 (two stacked), 2 (a stack of three, the top one open).
// col: the cardboard (a warm tan when left out).
function boxes(v=0,col){return{size:[40,50,0,0],anchor:[20,48],lights:[],draw({R}){const c=col||shade(P.straw,-.18),cd=shade(c,-.3),cl=shade(c,.2),tp=shade(P.cream,.15);
  const box=(x,y,w,h,open)=>{R(x,y,w,h,c,{sh:Math.round(w*.3)});R(x,y,w,2,cl);R(x+w/2-1,y,2,h*.45,tp);R(x,y+h-2,w,2,cd);R(x+3,y+h*.55,w*.35,h*.2,shade(P.text,-.15));
    if(open){R(x-3,y-4,w*.45,4,cl);R(x+w*.6,y-5,w*.45,5,c);R(x+2,y,w-4,3,P.outline);}};
  if(v===0)box(4,26,32,22);
  else if(v===1){box(2,28,34,20);box(6,10,26,18);}
  else{box(2,30,36,18);box(4,14,30,16);box(9,0,22,14,true);}}};}
// shared-props-washer-v1: a coin washer (kind "washer", top-loading) or dryer ("dryer", round window). on = running:
// the dryer's drum shows clothes and its window glows a little.
function washer(kind="washer",on=false){return{size:[34,48,0,0],anchor:[17,46],lights:on&&kind==="dryer"?[[17,28,.8,.25]]:[],draw({R,E,C}){const wt=shade(P.text,-.05),wd=shade(wt,-.3);
  R(1,6,32,40,wt,{sh:6});R(1,4,32,4,shade(wt,.12));R(1,2,32,3,shade(P.stone,.15));R(4,3,10,1,P.outline);R(24,2,6,3,shade(P.stone,-.1));R(25,3,4,1,P.brass);
  if(kind==="dryer"){E(16,26,10,10,P.outline);E(16,26,8,8,on?shade(P.glass,-.15):shade(P.stone,-.4));if(on){C(13,29,3,P.cloth);C(19,24,3,P.accent);C(17,30,2,P.cream);}E(13,23,3,2,rgba(P.lightTo,.5));}
  else{R(4,10,26,4,wd);R(5,11,24,2,shade(wt,.1));R(6,18,22,22,shade(wt,-.06));R(14,20,6,2,P.outline);}
  R(1,44,32,2,P.outline);}};}
/* ===== Lost Hour part A pieces (spec 017) ===== */
/* SPRING, WEATHER, ROADS AND WILD GROUND, CLINIC · more v1 pieces, added Nov 23, 2026.
   Drawn first for Black Lantern's Lost Hour (its spec 017 lists the kits): spring grass, blossom trees and mud; a night
   fog and light rain; a two-lane mountain road with its guardrail, mile markers, a low stone wall and a coin viewer;
   steep wooded ground, evergreen thickets and a creek; and a hospital bed, a bedside monitor and waiting room chairs.
   Four new palette slots (a game's palette without them falls back as noted): fog (fog), blossom (blossom pink),
   mud (wet earth), water (creek and puddle water, wet asphalt's sheen). */
SLOTS.push(["fog","night fog"],["blossom","blossom pink"],["mud","wet earth"],["water","creek water, wet shine"]);
Object.assign(PALETTES.blacklantern,{fog:"#b4a8e0",blossom:"#e886b0",mud:"#4e3a2e",water:"#4a6886"});
Object.assign(PALETTES.rushlight,{fog:"#a8a8b2",blossom:"#d49aa8",mud:"#4a3a2a",water:"#4a6470"});

/* ---------- SPRING (seasonal) ---------- */
// shared-tiles-springgrass-v1: new green spring grass (wet = false), or rain-wet (wet = true: darker, with drops that
// catch the light). Pixel function like grass().
function springGrass(x,y,T=16,wet=false){const u=T/16,nx=(x/u)|0,ny=(y/u)|0,L=slot("leaf","grass"),g=wet?shade(L,-.12):shade(L,.16);
  const patch=hsh(nx>>2,ny>>2,251)<.28?shade(g,-.12):hsh(nx>>2,ny>>2,252)<.15?shade(g,.1):g;
  if(ny%2===0&&hsh(nx,ny,253)<.14)return shade(patch,wet?.3:.26);                       // blade tips in the light
  if(hsh(nx,ny,254)<.012)return wet?shade(slot("water","glass"),.5):shade(P.text,-.1);      // a drop of rain, or a tiny white flower
  if(hsh(nx,ny,255)<.008)return slot("blossom","accent");                                 // a fallen petal
  return[patch,shade(patch,-.1),shade(patch,.05),shade(patch,-.2)][(hsh(nx,ny,256)*4)|0];}
// shared-props-blossomtree-v1: a flowering tree in spring (redbud or dogwood), lit from the upper left in four tones.
// white = false paints it in P.blossom (pink), true in white. v = 0, 1, 2 varies the crown. Its canopy box is like summerTree's.
function blossomTree(v=0,white=false){return{size:[100,124,0,0],anchor:[50,118],lights:[],draw({R,C}){const B=white?shade(P.text,-.04):slot("blossom","accent"),L=slot("leaf","grass");
  const t=[shade(B,.35),shade(B,.12),B,shade(B,-.24),shade(B,-.46)];
  R(45,70,10,50,shade(P.woodDark,.1),{sh:true});R(40,114,20,4,P.woodDark);R(46,76,2,22,shade(P.wood,-.1));
  for(const[a,b,c]of[[50,82,-1],[50,78,1]])for(let i=0;i<16;i++)R(a+c*i*1.4,b-i*1.6,3,2,shade(P.woodDark,.15));     // two forked limbs
  const lobes=[[50,50,30],[28,60,18],[72,58,19],[50,28,22],[32,38,14],[68,38,15],[50,66,16]].map(([x,y,r],i)=>[x+((hsh(i,v,15)-.5)*8)|0,y+((hsh(i,v,16)-.5)*6)|0,r]);
  lobes.forEach(([x,y,r])=>C(x+3,y+4,r,t[4]));lobes.forEach(([x,y,r])=>C(x+1,y+2,r,t[3]));lobes.forEach(([x,y,r])=>C(x,y,r-3,t[2]));
  lobes.forEach(([x,y,r])=>C(x-r*.3,y-r*.3,r*.5,t[1]));lobes.forEach(([x,y,r])=>C(x-r*.42,y-r*.45,r*.2,t[0]));
  for(let i=0;i<70;i++){const an=hsh(i,v,17)*6.283,rd=Math.sqrt(hsh(i,v,18))*40,x=50+Math.cos(an)*rd,y=48+Math.sin(an)*rd*.85;R(x,y,2,2,hsh(i,v,19)<.2?shade(L,.1):x+y<94?t[0]:t[3]);}
  for(let i=0;i<10;i++)R(20+hsh(i,v,20)*60,114+hsh(i,v,21)*6,2,1,t[1]);}};}                    // petals under it
// shared-tiles-mud-v1: mud with puddles that hold the sky (dark = false), or rain-dark mud (dark = true). Pixel function.
function mud(x,y,T=16,dark=false){const u=T/16,nx=(x/u)|0,ny=(y/u)|0,m=dark?shade(slot("mud","earth"),-.18):slot("mud","earth"),W=slot("water","glass");
  const c=12,gx=Math.floor(nx/c),gy=Math.floor(ny/c);
  if(hsh(gx,gy,261)<.45){const px=(gx+.25+hsh(gx,gy,262)*.5)*c,py=(gy+.3+hsh(gx,gy,263)*.4)*c,rx=2.5+hsh(gx,gy,264)*3,ry=rx*.55,d=((nx-px)/rx)**2+((ny-py)/ry)**2;
    if(d<1)return ny<py-ry*.35?shade(W,.28):d<.5&&hsh(nx,ny,265)<.1?shade(W,.45):shade(W,dark?-.12:0);  // the puddle: sky at its far edge
    if(d<1.5)return shade(m,-.3);}                                                                  // its wet rim
  if(hsh(nx,ny,266)<.05)return shade(m,.18);if(ny%3===0&&hsh(nx>>1,ny,267)<.3)return shade(m,-.15);   // tire ridges, crumbs
  return[m,shade(m,-.07),shade(m,.06)][(hsh(nx,ny,268)*3)|0];}

/* ---------- WEATHER ---------- */
// shared-effects-fog-v1: drifting night fog, after the night darkness is drawn. It hides distance, never the ground under
// the party: around each clear spot (the lantern) the air stays clear, then the fog thickens to its full veil a little way
// out. o: heavy (true: thick fog), clear ([[x, y, r], ...] canvas pixels: the lantern and lamps), ox, oy (the camera, so
// the fog drifts across the world), col (P.fog: the glow where a light catches it), veil (the fog in the dark, col darkened). fogReach(heavy) is how much a light's radius shrinks in it (light .8,
// heavy .62); a game multiplies its lantern by it.
const FOGC={c:null,t:null};
function fogTile(){if(FOGC.t)return FOGC.t;const N=128,c=mk(N,N),g=c.getContext("2d"),img=g.createImageData(N,N),d=img.data,P8=8;
  const lat=(i,j)=>hsh(((i%P8)+P8)%P8,((j%P8)+P8)%P8,271),sm=t=>t*t*(3-2*t);
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){let v=0,a=1,f=1,tot=0;for(let o=0;o<3;o++){const s=N/(P8*f),fx=x/s,fy=y/s,i=Math.floor(fx),j=Math.floor(fy),tx=sm(fx-i),ty=sm(fy-j),p=P8*f;
      const L=(a_,b_)=>hsh(((a_%p)+p)%p,((b_%p)+p)%p,271+o);v+=a*((L(i,j)*(1-tx)+L(i+1,j)*tx)*(1-ty)+(L(i,j+1)*(1-tx)+L(i+1,j+1)*tx)*ty);tot+=a;a*=.5;f*=2;}
    v/=tot;const k=Math.max(0,Math.min(1,(v-.32)*2.2)),i4=(y*N+x)*4;d[i4]=d[i4+1]=d[i4+2]=255;d[i4+3]=Math.round(k*255);}
  g.putImageData(img,0,0);return FOGC.t=c;}
const fogReach=heavy=>heavy?.62:.8;
function fog(ctx,now=0,o={}){const cv=ctx.canvas,w=cv.width,h=cv.height,col=o.col||slot("fog","night"),veil=o.veil||shade(col,-.5),hv=!!o.heavy,base=hv?.3:.22,top=hv?.54:.46;
  if(!FOGC.c)FOGC.c=mk(w,h);const B=FOGC.c;if(B.width!==w||B.height!==h){B.width=w;B.height=h;}const b=B.getContext("2d");b.globalCompositeOperation="source-over";b.clearRect(0,0,w,h);
  b.fillStyle=rgba(veil,base);b.fillRect(0,0,w,h);
  const t=fogTile(),N=t.width,ox=o.ox||0,oy=o.oy||0;
  for(const[sp,al,dy]of[[.012,top-base,0],[-.007,(top-base)*.8,47]]){const sx=((-(ox*.9+now*sp))%N+N)%N,sy=((-(oy*.9+dy))%N+N)%N;b.globalAlpha=al*2.2;
    for(let y=-sy;y<h;y+=N)for(let x=-sx;x<w;x+=N)b.drawImage(t,Math.round(x),Math.round(y));}
  b.globalAlpha=1;b.globalCompositeOperation="source-in";b.fillStyle=veil;b.fillRect(0,0,w,h);
  b.globalCompositeOperation="destination-out";
  (o.clear||[]).forEach(([x,y,r])=>{const gr=b.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,"rgba(0,0,0,1)");gr.addColorStop(.5,"rgba(0,0,0,.92)");gr.addColorStop(1,"rgba(0,0,0,0)");b.fillStyle=gr;b.fillRect(x-r,y-r,r*2,r*2);});
  b.globalCompositeOperation="source-over";ctx.drawImage(B,0,0);
  // a light in fog blooms: a soft halo at the edge of each clear spot
  ctx.globalCompositeOperation="lighter";
  (o.clear||[]).forEach(([x,y,r])=>{const gr=ctx.createRadialGradient(x,y,r*.35,x,y,r*1.05);gr.addColorStop(0,rgba(col,0));gr.addColorStop(.7,rgba(col,hv?.22:.16));gr.addColorStop(1,rgba(col,0));ctx.fillStyle=gr;ctx.fillRect(x-r*1.1,y-r*1.1,r*2.2,r*2.2);});
  ctx.globalCompositeOperation="source-over";}
// shared-effects-rain-v1: light rain over a map, after everything else on the map. Slanted streaks fall, drops splash,
// and on wet roads a sheen of sky slides along. o: k (0..1, how hard), shine ([[x, y, w, h], ...] canvas pixels of road that
// shines), col (the drops: P.water lightened). Whole pixels only.
function rain(ctx,now=0,o={}){const cv=ctx.canvas,w=cv.width,h=cv.height,k=o.k==null?.6:o.k,W=slot("water","glass"),dc=o.col||shade(W,.55);
  ctx.fillStyle=rgba(shade(W,-.4),.08*k);ctx.fillRect(0,0,w,h);
  (o.shine||[]).forEach(([x,y,sw,sh],i)=>{for(let j=0;j<sw;j+=3)for(let r=0;r<sh;r+=4){const n=hsh(((x+j)/3)|0,((y+r)/4)|0,281),ph=Math.sin(now/700+n*6.28+j*.05);
      if(ph>.82){ctx.fillStyle=rgba(shade(W,.6),.28*k*(ph-.82)/.18);ctx.fillRect(Math.round(x+j),Math.round(y+r+n*3),3,1);}}});
  const n=Math.round(70*k*(w*h)/(240*320));ctx.fillStyle=rgba(dc,.5);
  for(let i=0;i<n;i++){const sx=hsh(i,1,282)*w,sp=.22+hsh(i,2,282)*.1,yy=(hsh(i,3,282)*h+now*sp)%(h+12)-6,xx=(sx-yy*.25+w)%w;
    ctx.fillRect(Math.round(xx),Math.round(yy),1,3);ctx.fillRect(Math.round(xx-1),Math.round(yy+3),1,2);}
  ctx.fillStyle=rgba(dc,.55);for(let i=0;i<n/3;i++){const c=((now/90)|0)+i,x=hsh(c,i,283)*w,y=hsh(c,i,284)*h;if(hsh(c,i,285)<.5){ctx.fillRect(Math.round(x)-1,Math.round(y),1,1);ctx.fillRect(Math.round(x)+1,Math.round(y),1,1);ctx.fillRect(Math.round(x),Math.round(y)-1,1,1);}}}

/* ---------- ROADS AND WILD GROUND ---------- */
// shared-tiles-twolane-v1: a two-lane road with a center line and shoulders, in pixels. twoLane(g, x0, x1, top, T, o)
// runs straight across the screen; top = the top shoulder's top. o: lanes (each lane's width, 1.5 tiles), shoulder (0.4
// tiles of gravel each side), pass (true: a dashed center line; false: a double solid), wet (a darker, shinier top).
// Returns {top, bot, center} (the asphalt's top and bottom and the center line's y). twoLaneCurve(g, cx, cy, r, a0, a1, T, o)
// is the same road bending around (cx, cy): r is the center line's radius, a0..a1 the angles it covers (radians).
function roadPx(x,y,T,wet){const a=slot("asphalt","panel"),u=T/16,nx=(x/u)|0,ny=(y/u)|0,n=hsh(nx,ny,291),b=wet?shade(a,-.12):a;
  if(n<.04)return shade(b,.2);if(hsh(nx>>2,ny>>3,292)<.1&&n<.5)return shade(b,-.15);if(wet&&hsh(nx>>1,ny,293)<.06)return shade(slot("water","glass"),-.1);
  return[b,shade(b,-.05),shade(b,.06)][(hsh(nx,ny,294)*3)|0];}
function shoulderPx(x,y,T){const u=T/16,nx=(x/u)|0,ny=(y/u)|0,n=hsh(nx,ny,295),e=shade(P.stoneWarm,-.1);
  return n<.18?shade(P.stone,.15):n<.3?shade(e,-.25):[e,shade(e,.06),shade(e,-.08)][(hsh(nx,ny,296)*3)|0];}
function twoLane(g,x0,x1,top,T=16,o={}){const u=T/16,ln=(o.lanes||1.5)*T,sh=(o.shoulder==null?.4:o.shoulder)*T,a0=top+sh,a1=a0+2*ln,b1=a1+sh,cy=a0+ln,yl=P.light,wt=shade(P.text,-.08);
  for(let y=top;y<b1;y++)for(let x=x0;x<x1;x++)F(g,x,y,1,1,(y<a0||y>=a1)?shoulderPx(x,y,T):roadPx(x,y,T,o.wet));
  F(g,x0,a0,x1-x0,u,rgba(P.outline,.35));F(g,x0,a1-u,x1-x0,u,rgba(P.lightTo,.12));
  for(const ey of[a0+2*u,a1-3*u])for(let x=x0;x<x1;x++)if(hsh(x>>2,ey,297)>.08)F(g,x,ey,1,u,wt);       // edge lines, worn in places
  for(let x=x0;x<x1;x++){if(o.pass){if(((x-x0)/(6*u)|0)%2===0)F(g,x,cy-u,1,2*u,yl);}else if(hsh(x>>2,cy,298)>.05){F(g,x,cy-2*u,1,u,yl);F(g,x,cy+u,1,u,yl);}}
  return{top:a0,bot:a1,center:cy};}
function twoLaneCurve(g,cx,cy,r,a0,a1,T=16,o={}){const u=T/16,ln=(o.lanes||1.5)*T,sh=(o.shoulder==null?.4:o.shoulder)*T,R0=r-ln-sh,R1=r+ln+sh,yl=P.light,wt=shade(P.text,-.08);
  const lo=Math.min(a0,a1),hi=Math.max(a0,a1);
  for(let y=Math.floor(cy-R1);y<cy+R1;y++)for(let x=Math.floor(cx-R1);x<cx+R1;x++){const d=Math.hypot(x+.5-cx,y+.5-cy);if(d<R0||d>=R1)continue;let an=Math.atan2(y+.5-cy,x+.5-cx);
    while(an<lo)an+=6.2832;while(an>hi+1e-6&&an-6.2832>=lo)an-=6.2832;if(an<lo||an>hi)continue;
    const q=d-r;let c=Math.abs(q)>=ln?shoulderPx(x,y,T):roadPx(x,y,T,o.wet);
    if(Math.abs(Math.abs(q)-(ln-2.5*u))<.6*u&&hsh(x>>2,y>>2,297)>.08)c=wt;
    if(o.pass?(Math.abs(q)<u&&((an*r/(6*u))|0)%2===0):(Math.abs(Math.abs(q)-1.5*u)<.55*u))c=yl;
    F(g,x,y,1,1,c);}}
// shared-props-guardrail-v1: a metal W-beam guardrail on wooden posts, in pixels along the screen at its rail top y.
// o: ends ("left", "right" or "both": a flared end piece), post (tiles between posts, 1), reflectors (true: amber reflectors
// on the posts). Returns the reflectors' [x, y] (for a glint in the dark).
function guardrail(g,x0,x1,y,T=16,o={}){const u=T/16,m=shade(P.stone,.38),md=shade(m,-.4),ml=shade(m,.35),out=[],ends=o.ends||"";
  for(let x=x0+.3*T;x<x1;x+=(o.post||1)*T){F(g,x,y+2*u,3*u,.6*T,P.woodDark);F(g,x,y+2*u,u,.6*T,shade(P.wood,-.1));F(g,x-u,y+.6*T+2*u,5*u,u,rgba(P.outline,.4));
    if(o.reflectors!==false){F(g,x,y+u,3*u,2*u,P.brass);F(g,x,y+u,u,u,shade(P.brass,.5));out.push([x+1.5*u,y+2*u]);}}
  F(g,x0,y,x1-x0,u,ml);F(g,x0,y+u,x1-x0,u,m);F(g,x0,y+2*u,x1-x0,u,md);F(g,x0,y+3*u,x1-x0,u,m);F(g,x0,y+4*u,x1-x0,u,md);F(g,x0,y+5*u,x1-x0,u,rgba(P.outline,.5));
  for(let x=x0;x<x1;x+=2*u)if(hsh(x,y,299)<.12)F(g,x,y+u+((hsh(x,1,299)*3)|0)*u,u,u,shade(P.accent,-.3));  // rust
  const end=(ex,dir)=>{for(let i=0;i<4*u;i++)F(g,ex+dir*i,y+i*.5,u,5*u-i*.5,i%2?m:md);F(g,ex+dir*4*u,y+2*u,2*u,.55*T,P.woodDark);};
  if(ends==="left"||ends==="both")end(x0,-1);if(ends==="right"||ends==="both")end(x1-u,1);
  return out;}
// shared-props-milemarker-v1: mileMarker(n) is a small green mile marker on a post (n up to 3 digits); roadSign(kind) a blank
// road sign on a post: kind "curve" (yellow diamond, a bending arrow), "diamond" (blank yellow) or "plate" (a blank white
// plate for the case to letter).
function digits(R,s,x,y,k,c){for(const ch of String(s)){const gl=GLYPH3[ch];if(gl)for(let i=0;i<15;i++)if(gl[i]==="1")R(x+(i%3)*k,y+((i/3)|0)*k,k,k,c);x+=4*k;}}
function mileMarker(n=0){const s=String(n);return{size:[18,48,0,0],anchor:[9,46],lights:[],draw({R}){const gr=shade(slot("leaf","grass"),-.3);
  R(8,18,3,28,shade(P.stone,.2),{sh:1});R(1,0,16,20,shade(P.text,-.05));R(2,1,14,18,gr,{sh:2});R(2,1,14,1,shade(gr,.3));digits(R,"MI",4,3,1.5,shade(P.text,-.05));
  const k=s.length>2?1.2:2;digits(R,s,9-(s.length*4*k-k)/2,10,k,shade(P.text,-.05));R(7,44,5,2,shade(P.earth,-.2));}};}
function roadSign(kind="curve"){return{size:[30,62,0,0],anchor:[15,60],lights:[],draw({R}){const y=P.light,yd=shade(y,-.35);
  R(14,24,3,36,shade(P.stone,.2),{sh:1});R(12,58,7,2,shade(P.earth,-.2));
  if(kind==="plate"){R(2,0,26,22,P.outline);R(3,1,24,20,shade(P.text,-.04));R(3,1,24,1,shade(P.text,.2));return;}
  for(let i=0;i<14;i++){R(15-i,i,2*i+1,1,P.outline);R(15-i,28-i,2*i+1,1,P.outline);}
  for(let i=0;i<13;i++){R(16-i,i+1,2*i-1,1,i<4?shade(y,.2):y);R(16-i,27-i,2*i-1,1,yd);}R(3,14,25,1,y);
  if(kind==="curve"){R(13,8,4,12,P.outline);R(13,8,8,3,P.outline);R(19,6,2,7,P.outline);R(21,8,2,3,P.outline);}}};}
// shared-tiles-stonewall-v1: a low dry-stone wall along the screen (overlooks, bridges, old farms), in pixels; top = its
// cap's top. o: h (its height, 0.7 tiles), cap (false: no cap stones). stoneWallSide(g, x, y0, y1, T) runs up the screen.
function stoneWall(g,x0,x1,top,T=16,o={}){const u=T/16,h=Math.round((o.h||.7)*T),s=P.stone,fb=top+h;
  F(g,x0,top,x1-x0,h,shade(s,-.5));
  for(let row=0,y=top+(o.cap===false?0:4*u);y<fb-u;row++){const rh=(3+((hsh(row,x0,301)*2)|0))*u;let x=x0-((row%2)*3*u);
    while(x<x1){const sw=(4+((hsh(x,row,302)*5)|0))*u,xs=Math.max(x,x0),xe=Math.min(x+sw-u,x1),c=[s,shade(s,-.1),shade(s,.08),shade(P.stoneWarm,-.05)][(hsh(x,row,303)*4)|0];
      if(xe>xs){F(g,xs,y,xe-xs,rh-u,c);F(g,xs,y,xe-xs,u,shade(c,.22));if(hsh(x,row,304)<.25)F(g,xs+u,y+u,Math.min(2*u,xe-xs-u),u,shade(slot("leaf","grass"),-.15));}x+=sw;}
    y+=rh;}
  if(o.cap!==false){F(g,x0-u,top,x1-x0+2*u,4*u,shade(s,.12));F(g,x0-u,top,x1-x0+2*u,u,shade(s,.4));for(let x=x0;x<x1;x+=(5+((hsh(x,top,305)*4)|0))*u)F(g,x,top+u,u,3*u,shade(s,-.35));}
  F(g,x0,fb-u,x1-x0,u,P.outline);F(g,x0,fb,x1-x0,2*u,rgba(P.outline,.3));return fb;}
function stoneWallSide(g,x,y0,y1,T=16){const u=T/16,s=P.stone,w=.5*T;
  for(let y=y0;y<y1;y+=3*u)F(g,x,y,w,3*u,[s,shade(s,-.12),shade(s,.1)][(hsh(x,y,306)*3)|0]);F(g,x,y0,u,y1-y0,shade(s,.35));F(g,x+w-u,y0,u,y1-y0,P.outline);}
// shared-props-coinviewer-v1: a coin-operated viewer on a post, binocular head tilted out at the view, no brand.
const COINVIEWER={size:[30,58,0,0],anchor:[14,56],lights:[],draw({R,C,E}){const b=shade(slot("leaf","grass"),-.15),m=shade(P.stone,.2);
  R(12,28,6,26,m,{sh:2});R(7,52,16,4,shade(m,-.3));R(10,22,10,8,shade(b,-.2));
  R(4,6,22,16,b,{sh:6});R(4,6,22,2,shade(b,.3));E(15,6,11,4,shade(b,.12));R(2,10,6,7,P.outline);R(22,10,6,7,P.outline);C(5,13,2.5,shade(P.stone,-.3));C(25,13,2.5,shade(P.stone,-.3));
  R(10,14,10,5,shade(P.text,-.15));R(11,15,8,1,shade(P.text,-.45));R(14,16,2,2,P.outline);R(26,18,3,6,m);R(13,24,4,2,P.brass);}};
// shared-tiles-slope-v1: steep wooded ground with rocks: last year's leaves, moss, roots and the slope's fall lines (dark =
// true: the shaded side). Pixel function.
function slope(x,y,T=16,dark=false){const u=T/16,nx=(x/u)|0,ny=(y/u)|0,e=dark?shade(P.earth,-.25):P.earth,L=slot("leaf","grass");
  const c=14,gx=Math.floor(nx/c),gy=Math.floor(ny/c);
  if(hsh(gx,gy,311)<.3){const px=(gx+.5)*c+(hsh(gx,gy,312)-.5)*6,py=(gy+.5)*c+(hsh(gx,gy,313)-.5)*6,rx=3+hsh(gx,gy,314)*3,d=((nx-px)/rx)**2+((ny-py)/(rx*.7))**2;
    if(d<1){const s=P.stone;return ny<py-rx*.3?shade(s,.25):nx>px+rx*.3?shade(s,-.3):d<.3&&hsh(nx,ny,315)<.3?shade(L,-.1):s;}
    if(d<1.4&&ny>py)return shade(e,-.45);}
  const fall=((nx*2+ny*5+((hsh(nx>>3,0,316)*9)|0))%23);if(fall===0)return shade(e,-.3);if(fall===1)return shade(e,.14);         // fall lines down the hill
  const n=hsh(nx,ny,317);if(n<.12)return shade(L,-.2+hsh(nx,ny,318)*.25);if(n<.2)return shade(P.wood,.15);if(n<.24)return shade(P.straw,-.25);
  if(hsh(nx>>3,ny>>1,319)<.06)return shade(P.woodDark,.1);                                                                       // a root
  return[e,shade(e,-.07),shade(e,.07),shade(P.wood,-.05)][(hsh(nx,ny,320)*4)|0];}
// shared-props-thicket-v1: dense evergreen shrubs (rhododendron, laurel, holly) with glossy leaves, lit from the upper left.
// v = 0, 1, 2 varies the shape; buds = true dots it with pale P.blossom buds.
function thicket(v=0,buds=false){return{size:[56,44,0,0],anchor:[28,42],lights:[],draw({R,C,E}){const L=shade(slot("leaf","grass"),-.28),t=[shade(L,.3),shade(L,.12),L,shade(L,-.25),shade(L,-.48)];
  const lobes=[[14,26,12],[30,22,14],[44,27,11],[22,14,10],[38,13,9]].map(([x,y,r],i)=>[x+((hsh(i,v,321)-.5)*6)|0,y+((hsh(i,v,322)-.5)*4)|0,r]);
  E(28,38,26,5,t[4]);lobes.forEach(([x,y,r])=>C(x+2,y+3,r,t[4]));lobes.forEach(([x,y,r])=>C(x,y+1,r-1,t[3]));lobes.forEach(([x,y,r])=>C(x-1,y,r-3,t[2]));
  for(let i=0;i<46;i++){const an=hsh(i,v,323)*6.283,rd=Math.sqrt(hsh(i,v,324))*20,x=28+Math.cos(an)*rd*1.1,y=22+Math.sin(an)*rd*.7;R(x,y,3,1,x+y<44?t[0]:t[1]);R(x+1,y+1,2,1,t[3]);}
  if(buds)for(let i=0;i<7;i++){const x=10+hsh(i,v,325)*36,y=8+hsh(i,v,326)*20;R(x,y,2,2,shade(slot("blossom","accent"),.3));}}};}
// shared-tiles-creek-v1: a small creek's water with stones and ripples. Pixel function for the water tiles; o.bank: the
// tile's edge toward the bank ("top", "bottom", "left", "right"), where it shallows to mud and pebbles.
function creek(x,y,T=16,o={}){const u=T/16,nx=(x/u)|0,ny=(y/u)|0,W=slot("water","glass"),ty=(y%T)/T,tx=(x%T)/T;
  const edge=o.bank==="top"?ty:o.bank==="bottom"?1-ty:o.bank==="left"?tx:o.bank==="right"?1-tx:1;
  if(edge<.2)return hsh(nx,ny,331)<.4?shade(P.stone,.1+hsh(nx,ny,332)*.2):shade(slot("mud","earth"),-.1);
  const c=6,gx=Math.floor(nx/c),gy=Math.floor(ny/c);
  if(hsh(gx,gy,333)<.22){const px=(gx+.5)*c,py=(gy+.5)*c,d=((nx-px)/2.6)**2+((ny-py)/1.8)**2;if(d<1)return ny<py?shade(P.stone,.3):shade(P.stone,-.1);if(d<1.6)return shade(W,.5);}
  const r=Math.sin(nx*.9+ny*.35)+Math.sin(nx*.23-ny*.7);if(r>1.55)return shade(W,.38);if(r<-1.5)return shade(W,-.2);
  return edge<.35?shade(W,.12):[W,shade(W,-.06)][(hsh(nx,ny,334)*2)|0];}

/* ---------- CLINIC ---------- */
// shared-props-hospitalbed-v1: a hospital bed with rails, seen from the foot in the 3/4 view: a wheeled frame, the
// headboard's controls, a white sheet and a pale blanket. empty = false puts a pillow dent and a folded blanket on it.
function hospitalBed(empty=true){return{size:[56,66,0,0],anchor:[28,62],lights:[],draw({R,C}){const m=shade(P.stone,.35),sh=shade(P.text,-.02),bl=shade(slot("water","glass"),.45);
  R(6,0,44,12,m,{sh:6});R(6,0,44,2,shade(m,.3));R(10,3,10,5,shade(P.panel,.2));R(11,4,2,1,P.accent);R(14,4,2,1,P.grass);
  R(8,12,40,8,sh);R(12,13,18,6,shade(sh,.06));R(14,14,14,1,shade(sh,-.15));
  R(6,20,44,30,sh,{sh:8});R(6,20,44,2,shade(sh,.2));R(8,28,40,20,bl,{sh:8});R(8,28,40,2,shade(bl,.25));for(let y=34;y<48;y+=5)R(8,y,40,1,shade(bl,-.15));
  if(!empty){R(26,24,16,6,shade(bl,-.1));R(26,24,16,1,shade(bl,.2));}
  for(const x of[2,50]){R(x,18,4,22,m,{sh:1});R(x,18,4,1,shade(m,.4));for(let y=22;y<38;y+=5)R(x,y,4,1,shade(m,-.35));}
  R(6,50,44,4,shade(m,-.25));R(6,54,44,2,P.outline);for(const x of[8,44])C(x+2,58,3,P.outline);}};}
// shared-props-monitor-v1: a bedside monitor on a rolling stand. MONITOR is the prop; its screen, in design pixels, is
// MONITOR_SCREEN [x, y, w, h]. monitorLine(ctx, x, y, w, h, now, col) draws the moving heartbeat line straight onto a scene
// (canvas pixels, over the screen), with a blinking dot; col defaults to P.grass lightened.
const MONITOR_SCREEN=[4,4,22,14];
const MONITOR={size:[30,72,0,0],anchor:[15,70],lights:[[15,11,.8,.35]],draw({R,C}){const m=shade(P.stone,.3),bx=shade(P.panel,.15);
  R(14,24,3,42,m,{sh:1});for(const[x,d]of[[4,1],[22,-1]])R(x,64,6,3,shade(m,-.3));R(6,66,18,2,shade(m,-.3));C(6,68,2,P.outline);C(24,68,2,P.outline);
  R(1,0,28,24,bx,{sh:5});R(1,0,28,2,shade(bx,.3));R(4,4,22,14,P.outline);R(5,5,20,12,shade(slot("water","glass"),-.6));R(5,10,20,1,shade(P.grass,.2));
  R(4,20,4,2,P.accent);R(10,20,4,2,P.light);R(16,20,8,2,shade(bx,-.3));R(18,26,10,4,m);}};
function monitorLine(ctx,x,y,w,h,now=0,col){const c=col||shade(P.grass,.55),mid=y+h*.55,t=(now/16)%w;ctx.fillStyle=rgba(c,.9);
  for(let i=0;i<w;i++){const ph=(i+w-t)%w,beat=ph%22,dy=beat===10?-h*.4:beat===11?h*.3:beat===12?-h*.15:0,age=(t-i+w)%w;if(age>w*.8)continue;ctx.globalAlpha=1-age/(w*.8);ctx.fillRect(Math.round(x+i),Math.round(mid+dy),1,1);}
  ctx.globalAlpha=1;if(((now/500)|0)%2){ctx.fillStyle=rgba(P.accent,.9);ctx.fillRect(Math.round(x+w-3),Math.round(y+1),2,2);}}
// shared-props-waitingchairs-v1: a row of waiting room chairs on one rail, n seats (3 when left out); col: the seats (P.cloth).
function waitingChairs(n=3,col){const W_=n*16+4;return{size:[W_,34,0,0],anchor:[W_/2,32],lights:[],draw({R}){const c=col||P.cloth,m=shade(P.stone,.25);
  R(1,22,W_-2,3,m);R(1,22,W_-2,1,shade(m,.3));for(const x of[4,W_-7])R(x,25,3,8,shade(m,-.2));
  for(let i=0;i<n;i++){const x=3+i*16;R(x,2,14,12,c,{sh:4});R(x,2,14,2,shade(c,.25));R(x+1,14,13,6,shade(c,.08),{sh:4});R(x+1,19,13,2,shade(c,-.35));if(i<n-1)R(x+14,8,2,13,m);}}};}
/* ===== Tracking part A pieces (spec 019) ===== */
/* WINTER, CITY STREET, OLD ELECTRONICS AND PANELING · v1 pieces, added Nov 23, 2026
   Drawn first for Black Lantern's Tracking (its spec 019 lists the kits): snow and slush, snowbanks, icicles, falling snow,
   a four-lane city street with a crosswalk, a bus stop, a blank neon sign, a tall pole sign, a barred shop window, a fire
   hydrant, an old CRT TV, a VCR and a tape, and wood paneling. No words or logos on any of them: the case letters its own.
   Three new palette slots (a game's palette without them falls back as noted): snow, slush (grey road slush), neon (a tube). */
SLOTS.push(["snow","snow, frost"],["slush","grey road slush"],["neon","neon tube"]);
Object.assign(PALETTES.blacklantern,{snow:"#dfe6ee",slush:"#77757e",neon:"#ff3fa4"});
Object.assign(PALETTES.rushlight,{snow:"#dcdad0",slush:"#75716a",neon:"#d06a5a"});

/* ---------- WINTER ---------- */
// shared-tiles-snow-v1: snow ground, a pixel function. trodden = true: packed paths, boot prints and grey patches.
function snow(x,y,T=16,trodden=false){const u=T/16,nx=(x/u)|0,ny=(y/u)|0,s=slot("snow","text"),n=hsh(nx,ny,301);
  if(n<.025)return shade(s,.35);
  const drift=hsh(nx>>2,ny>>1,302);let c=drift<.25?shade(s,-.08):drift>.85?shade(s,.06):s;
  if(trodden){const bx=nx%6,by=ny%10,col=(nx/6)|0;if(hsh(col,(ny/10)|0,303)<.45&&bx>0&&bx<3&&by<4)return shade(s,-.26);
    if(hsh(nx>>3,ny>>3,304)<.3)c=shade(c,-.14);if(hsh(nx,ny,305)<.04)return shade(slot("slush","stone"),.25);}
  return hsh(nx,ny,306)<.12?shade(c,-.05):c;}
// shared-tiles-slush-v1: grey slush, a pixel function. On a road (walk = false) it lies in wet tire ruts over asphalt;
// on a sidewalk (walk = true) it lies in melt patches over paving. Both have a dark wet shine.
function slush(x,y,T=16,walk=false){const u=T/16,nx=(x/u)|0,ny=(y/u)|0,sl=slot("slush","stone"),n=hsh(nx,ny,311);
  const base=walk?stoneSidewalk(x,y,T,false):asphalt(x,y,T);
  const rut=walk?hsh(nx>>2,ny>>2,312)<.42:((ny%8)<2||((ny+4)%16)<1);
  if(rut){if(n<.08)return shade(sl,.3);if(n>.9)return shade(sl,-.3);return[sl,shade(sl,-.08),shade(sl,.08)][(hsh(nx,ny,313)*3)|0];}
  if(hsh(nx>>1,ny,314)<.05)return shade(base,-.3);
  return base;}
// shared-props-snowbank-v1: a plowed snowbank, len tiles long (1 to 4 read best), grey and gritty at its foot.
function snowbank(len=2){const W_=len*32;return{size:[W_+4,30,2,0],anchor:[W_/2,28],lights:[],draw({R,E}){const s=slot("snow","text"),sd=shade(s,-.22),sl=slot("slush","stone");
  for(let i=0;i<len*2;i++){const cx=8+i*16+(hsh(i,len,321)*6-3),h=10+hsh(i,len,322)*7;E(cx,26-h*.5,11,h*.6,sd);E(cx-1,25-h*.6,10,h*.55,s);E(cx-4,22-h*.8,4,2,shade(s,.3));}
  R(0,24,W_,4,shade(sl,.1));for(let x=2;x<W_;x+=5)R(x,23+(hsh(x,1,323)*3|0),2,1,shade(sl,-.25));R(0,27,W_,1,shade(sl,-.3));}};}
// shared-props-icicles-v1: icicles drawn straight onto the scene along a roof edge or sign bottom, from x0 to x1 hanging
// from y. o.seed varies them; o.long makes them longer.
function icicles(g,x0,x1,y,T=16,o={}){const u=T/16,s=slot("snow","text"),ic=shade(slot("snow","text"),.15),id=shade(P.glass,.2);F(g,x0,y,x1-x0,u,s);
  for(let x=x0+u;x<x1-u;x+=2*u){const n=hsh(x,o.seed|0,331);if(n<.3)continue;const L=Math.round((1+n*(o.long?7:4))*u);F(g,x,y+u,u,L,ic);if(L>2*u)F(g,x,y+u,u,u,id);F(g,x,y+u+L-u,u,u,shade(ic,.4));}}
// shared-effects-snowfall-v1: falling snow over a map, after everything else on the map (and after the night pass, so the
// flakes catch the light). o.k: how hard (light .35, heavy 1). o.wind: the drift sideways (-1 to 1). Sparse whole pixels, so
// the ground, the people and the dialog box stay readable.
function snowfall(ctx,now=0,o={}){const cv=ctx.canvas,w=cv.width,h=cv.height,k=o.k==null?.4:o.k,wind=o.wind==null?.3:o.wind,n=Math.round((w*h/900)*k),s=shade(slot("snow","text"),.3);
  for(let i=0;i<n;i++){const sp=.012+hsh(i,1,341)*.02,big=hsh(i,2,341)<.25,t=now*sp+hsh(i,3,341)*h*3,y=t%(h+8)-4,x=((hsh(i,4,341)*w+wind*t*.35+Math.sin(t*.03+i)*3)%w+w)%w;
    ctx.fillStyle=rgba(s,big?.9:.6);ctx.fillRect(Math.round(x),Math.round(y),big?2:1,big?2:1);}}

/* ---------- CITY STREET ---------- */
// shared-tiles-citystreet-v1: a four-lane street across the screen, drawn in pixels over a road ground (asphalt or slush):
// a curb at top and bottom, dashed white lane lines, a double yellow center line. top = the top curb's y; the street is
// 4 lanes of one tile each between the curbs (so 4 tiles plus the curbs). o.cross: [x0, x1] a zebra crosswalk; o.slush:
// grey slush banked along both curbs.
function cityStreet(g,x0,x1,top,T=16,o={}){const u=T/16,w=x1-x0,bot=top+4*T,cb=shade(P.stone,.18),wl=shade(P.text,-.04),yl=P.light,cr=o.cross;
  const lane=(y,col,dash)=>{for(let x=x0;x<x1;x+=12*u){if(cr&&x+7*u>cr[0]&&x<cr[1])continue;F(g,x,y,dash?7*u:12*u,u,col);}};
  lane(top+T-u/2,wl,true);lane(top+3*T-u/2,wl,true);lane(top+2*T-1.5*u,yl,false);lane(top+2*T+.5*u,yl,false);
  if(cr)for(let y=top+2*u;y<bot-2*u;y+=4*u)F(g,cr[0],y,cr[1]-cr[0],2*u,wl);
  for(const[y,dn]of[[top-2*u,1],[bot,0]]){F(g,x0,y,w,2*u,cb);F(g,x0,dn?y+2*u-u:y,w,u,shade(cb,-.4));for(let x=x0;x<x1;x+=T)F(g,x,y,u,2*u,shade(cb,-.25));}
  if(o.slush){const sl=slot("slush","stone");for(const y of[top,bot-3*u])for(let x=x0;x<x1;x+=u){const n=hsh(x,y,351);if(n<.7)F(g,x,y,u,n<.3?3*u:2*u,n<.15?shade(sl,.25):sl);}}
  return{top,bot};}
// shared-props-busstop-v1: a bus stop shelter with a bench and a blank sign on a post (BUSSTOP_SIGN: [x, y, w, h] of its face,
// in design pixels, for the case's route name). About 3 tiles wide.
const BUSSTOP_SIGN=[78,4,16,18];
const BUSSTOP={size:[100,84,0,0],anchor:[46,82],lights:[[40,10,1.2,.25]],draw({R}){const m=P.panel,ml=shade(m,.3),gl=shade(P.stone,.45);
  R(84,22,3,60,shade(P.stone,.1));R(76,2,20,22,P.text,{sh:4});R(78,4,16,18,shade(P.text,-.06));R(76,2,20,2,shade(P.text,.25));
  R(2,10,70,6,m,{sh:12});R(2,10,70,2,ml);R(4,16,3,64,m);R(66,16,3,64,shade(m,-.2));
  for(const x of[8,28,48])R(x,18,18,48,rgba(gl,.38));R(8,18,58,2,rgba(P.lightTo,.35));for(const x of[10,30,50])R(x,22,1,36,rgba(P.lightTo,.3));
  R(10,56,50,6,P.wood,{sh:10});R(10,56,50,2,shade(P.wood,.25));R(12,62,3,16,P.outline);R(55,62,3,16,P.outline);R(36,14,12,2,shade(P.light,.2));}};

// shared-props-neonsign-v1: a blank neon sign drawn straight onto the scene: a dark backing board at (x, y), w x h, with a
// tube running round its edge in col (P.neon when left out). on = lit. Returns its glow and the inner box [x, y, w, h] for the
// case's words, which it letters with neonText(g, text, x, y, col, on, k): k = 1 for the small size, 2 for the big one.
// neonFlicker(now, seed) gives 0 (dark this instant) or 1 for a sign that stutters; a case redraws the words when it changes.
function neonSign(g,x,y,w,h,col,on=true,T=16){const u=T/16,c=col||slot("neon","accent"),tube=on?shade(c,.45):shade(c,-.55),halo=on?c:shade(c,-.7);
  F(g,x-u,y-u,w+2*u,h+2*u,P.outline);F(g,x,y,w,h,shade(P.panel,-.2));F(g,x+u,y+u,w-2*u,h-2*u,shade(P.panel,-.35));
  for(const[a,b,c2,d]of[[x+u,y+u,w-2*u,u],[x+u,y+h-2*u,w-2*u,u],[x+u,y+u,u,h-2*u],[x+w-2*u,y+u,u,h-2*u]]){F(g,a,b,c2,d,halo);}
  for(const[a,b,c2,d]of[[x+2*u,y+2*u,w-4*u,u],[x+2*u,y+h-3*u,w-4*u,u],[x+2*u,y+2*u,u,h-4*u],[x+w-3*u,y+2*u,u,h-4*u]])F(g,a,b,c2,d,tube);
  return{glow:[x+w/2,y+h/2,Math.max(w,h)*.9,on?.45:0],inner:[x+4*u,y+4*u,w-8*u,h-8*u]};}
function neonText(g,s,x,y,col,on=true,k=1){const c=col||slot("neon","accent");
  if(on){signText(g,s,x-1,y,rgba(c,.55),k);signText(g,s,x+1,y,rgba(c,.55),k);signText(g,s,x,y-1,rgba(c,.55),k);signText(g,s,x,y+1,rgba(c,.55),k);signText(g,s,x,y,shade(c,.6),k);}
  else signText(g,s,x,y,shade(c,-.5),k);}
const neonFlicker=(now,seed=0)=>{const t=(now/70)|0;return hsh(t,seed,361)<.06||(hsh((t/12)|0,seed,362)<.08&&t%3===0)?0:1;};
// shared-props-polesign-v1: a tall roadside sign blank on a pole (motels, diners, gas), with a lit face. poleSign(w, h, col):
// the face is w x h design pixels (POLESIGN face at spec.face [x, y, w, h]); the case letters it. Stands about 5 tiles tall.
function poleSign(w=64,h=40,col){const W_=w+8,H_=h+132,c=col||P.accent;return{face:[4,4,w,h],size:[W_,H_,0,0],anchor:[W_/2,H_-2],lights:[[W_/2,4+h/2,2.2,.45]],draw({R}){
  R(W_/2-4,h+6,8,H_-h-8,shade(P.stone,.05),{sh:3});R(W_/2-4,h+6,2,H_-h-8,shade(P.stone,.3));R(W_/2-8,H_-6,16,4,shade(P.stone,-.3));
  R(0,0,W_,h+8,P.outline);R(2,2,W_-4,h+4,c,{sh:6});R(2,2,W_-4,2,shade(c,.3));R(4,4,w,h,shade(P.text,-.02));R(4,4,w,2,shade(P.text,.2));
  for(let x=6;x<W_-4;x+=8)R(x,h+4,3,3,shade(P.light,.2));}};}
// shared-tiles-barredwindow-v1: a shop window with security bars, drawn onto a wall at (x, y), w x h pixels. lit = the shop's
// lights on behind it. Returns its glow.
function barredWindow(g,x,y,w,h,T=16,lit=true){const u=T/16,fr=shade(P.woodDark,-.2),gl=lit?P.glass:shade(P.night,.1),bar=shade(P.panel,.25);
  F(g,x-u,y-u,w+2*u,h+2*u,fr);F(g,x,y,w,h,gl);F(g,x,y+h*.55,w,h*.45,shade(gl,-.2));if(lit)for(let k=x+u;k<x+w-u;k+=5*u)if(hsh(k,y,371)<.55)F(g,k,y+h*.4,2*u,h*.25,shade(gl,-.45));
  F(g,x+u,y+u,u,h*.4,shade(gl,.3));for(let bx=x+2*u;bx<x+w-u;bx+=3*u){F(g,bx,y,u,h,bar);F(g,bx+u,y,u,h,rgba(P.outline,.3));}
  F(g,x,y+2*u,w,u,bar);F(g,x,y+h-3*u,w,u,bar);F(g,x-u,y+h,w+2*u,1.5*u,shade(P.cream,-.1));
  return[x+w/2,y+h/2,Math.max(w,h)*.8/T*T,lit?.3:0];}
// shared-props-hydrant-v1: a fire hydrant (P.accent when no col).
function hydrant(col){return{size:[22,30,0,0],anchor:[11,28],lights:[],draw({R,E}){const c=col||P.accent;
  R(5,8,12,18,c,{sh:4});E(11,7,6,4,c);R(9,1,4,3,shade(c,-.2));R(1,12,4,5,shade(c,-.1));R(17,12,4,5,shade(c,-.3));R(5,8,2,18,shade(c,.25));R(3,25,16,3,shade(c,-.35));R(9,14,4,3,P.brass);}};}

/* ---------- OLD ELECTRONICS AND PANELING ---------- */
// shared-props-crttv-v1: an old CRT TV on a little stand. on = showing static (frame picks the noise, so a case can flicker
// it by passing a changing number). CRT_SCREEN: [x, y, w, h] of the glass in design pixels, for a case's own picture.
const CRT_SCREEN=[6,6,32,24];
function crtTV(on=false,frame=0,col){return{size:[44,58,0,0],anchor:[22,56],lights:on?[[22,18,1.3,.4]]:[],draw({R}){const b=col||shade(P.panel,.12);
  R(2,36,40,6,P.wood,{sh:8});R(2,36,40,2,shade(P.wood,.25));R(5,42,3,14,P.woodDark);R(36,42,3,14,P.woodDark);R(8,50,28,2,P.woodDark);
  R(1,0,42,36,b,{sh:6});R(1,0,42,2,shade(b,.3));R(4,3,36,30,P.outline);
  if(on){for(let y=6;y<30;y+=2)for(let x=6;x<38;x+=2){const v=hsh(x+frame*31,y,381);R(x,y,2,2,v<.33?shade(P.text,.2):v<.66?shade(P.stone,.2):shade(P.panel,-.1));}R(6,6+((frame*3)%24),32,2,rgba(P.text,.5));}
  else{R(6,6,32,24,shade(P.stone,-.55));R(8,8,10,3,rgba(P.lightTo,.18));}
  R(36,31,3,2,on?P.light:shade(P.accent,-.3));R(30,31,4,1,shade(b,-.3));}};}
// shared-props-vcr-v1: a VCR with no brand (tape = true: a tape half in the slot), and vhsTape(label): a VHS tape lying flat,
// its blank label in label's color (P.text when left out) for the case to write on.
function vcr(tape=false){return{size:[44,16,0,0],anchor:[22,14],lights:[[34,6,.5,.3]],draw({R}){const b=shade(P.panel,.2);
  R(1,2,42,12,b,{sh:5});R(1,2,42,1,shade(b,.35));R(4,5,22,3,P.outline);if(tape){R(6,2,18,4,shade(P.outline,.15));R(9,2,12,2,P.text);}
  R(30,5,10,4,shade(P.outline,.1));R(31,6,8,2,shade(P.neon||P.light,.1));R(4,10,3,2,shade(b,-.3));R(9,10,3,2,shade(b,-.3));R(1,13,42,1,shade(b,-.4));}};}
function vhsTape(label){return{size:[28,18,0,0],anchor:[14,16],lights:[],draw({R}){const b=shade(P.outline,.12);
  R(1,2,26,14,b,{sh:4});R(1,2,26,1,shade(b,.3));R(5,5,18,6,label||P.text);R(5,5,18,1,shade(label||P.text,-.2));R(4,12,6,3,shade(b,.2));R(18,12,6,3,shade(b,.2));}};}
// shared-tiles-paneling-v1: wood paneling on an interior wall seen from the room, in pixels: top = the ceiling line, bot =
// the floor line. Grooved sheets, a lighter grain, a baseboard. col: the wood (P.wood when left out).
function paneling(g,x0,x1,top,bot,col,T=16){const u=T/16,c=col||P.wood,w=x1-x0;F(g,x0,top,w,bot-top,c);
  for(let x=x0;x<x1;x+=u){const n=hsh(x,7,391);if(n<.35)F(g,x,top,u,bot-top,shade(c,.07));else if(n>.85)F(g,x,top,u,bot-top,shade(c,-.07));}
  for(let x=x0+6*u;x<x1;x+=6*u)F(g,x,top,u,bot-top,shade(c,-.42));for(let x=x0;x<x1;x+=24*u)F(g,x,top,u,bot-top,shade(c,-.6));
  for(let k=0;k<w/10;k++){const gx=x0+hsh(k,1,392)*w,gy=top+hsh(k,2,392)*(bot-top-6*u);F(g,gx,gy,u,(2+hsh(k,3,392)*4)*u,shade(c,-.2));}
  F(g,x0,top,w,2*u,shade(c,-.5));F(g,x0,bot-3*u,w,3*u,shade(c,-.3));F(g,x0,bot-3*u,w,u,shade(c,.2));}
/* ===== Dead Air part A pieces (spec 021) ===== DEEP SOUTH, TOWERS AND SMALL BUILDINGS · v1 pieces, added Nov 23, 2026
   Drawn first for Black Lantern's Dead Air (its spec 021 lists the kits): a sugarcane field (stubble, young cane, tall
   cane), a live oak with Spanish moss, a bald cypress, a still bayou and its bank with cypress knees and reeds, a house
   raised on piers, a lattice radio tower with its blinking light, a cinder-block wall, an old radio with a glowing dial,
   and a desk microphone and small mixing board. No brands or call letters on any piece.
   Six new palette slots (a game's palette without them falls back as noted): cane (cane-field gold), moss (Spanish moss),
   bayou (still dark water), beacon (a tower's red light), dial (a radio dial's amber glow), cinder (cinder block). */
SLOTS.push(["cane","cane-field gold, cane stalks"],["moss","Spanish moss, grey-green"],["bayou","still dark water"],["beacon","tower warning light"],["dial","radio dial glow"],["cinder","cinder block"]);
Object.assign(PALETTES.blacklantern,{cane:"#c8a850",moss:"#8a9a7a",bayou:"#1e2a2a",beacon:"#ff4a3d",dial:"#ffb347",cinder:"#9a968c"});
Object.assign(PALETTES.rushlight,{cane:"#b89a52",moss:"#7e8a6e",bayou:"#22302c",beacon:"#d8483a",dial:"#e0a04a",cinder:"#948e82"});

/* ---------- DEEP SOUTH (regional) ---------- */
// shared-tiles-canefield-v1: a sugarcane field in rows that run left to right. Pixel function like grass().
// stage: "stubble" (cut stalks in dark rows), "young" (green shoots coming up the rows). Each 16 px tile holds one row:
// a dark furrow at its top, the raised bed in the middle, so the rows read as paths to walk along.
// tallCane(w, v) is the standing tall cane, a prop w tiles wide; give it a see-through canopy so it never hides the party.
function caneField(x,y,T=16,stage="young"){const u=T/16,nx=(x/u)|0,ny=(y/u)|0,ry=ny%16,e=P.earth,cn=slot("cane","straw"),lf=slot("leaf","grass");
  if(ry<3)return hsh(nx,ny,301)<.12?shade(e,-.2):shade(e,-.38);                                   // the furrow
  if(ry>13)return[shade(e,-.12),shade(e,-.2)][(hsh(nx,ny,302)*2)|0];
  const clump=(nx+((ny>>4)*5))%7,n=hsh(nx,ny,303);
  if(stage==="stubble"){if(clump<2&&ry>5&&ry<11)return ry<7?shade(cn,.25):shade(cn,-.1+n*.2);
    if(n<.08)return shade(cn,-.3);return[shade(e,.05),e,shade(e,-.06)][(hsh(nx,ny,304)*3)|0];}
  if(clump<3&&ry>3&&ry<12){const tip=ry<6;return tip?shade(lf,.25):hsh(nx,ny,305)<.3?shade(lf,-.28):lf;}
  if(clump===3&&ry>8&&ry<12)return shade(cn,-.15);
  if(n<.06)return shade(lf,-.4);return[shade(e,.04),e,shade(e,-.07)][(hsh(nx,ny,306)*3)|0];}
function tallCane(w=2,v=0){const W_=w*32;return{size:[W_+8,120,4,0],anchor:[W_/2,116],lights:[],draw({R}){const cn=slot("cane","straw"),lf=slot("leaf","grass"),dl=shade(cn,.2);
  for(let i=0;i<w*9;i++){const x=1+i*(W_/(w*9))+((hsh(i,v,311)-.5)*3),h=78+hsh(i,v,312)*30,top=116-h,c=i%3===0?shade(cn,-.18):cn;
    R(x,top,2,h,c,{sh:1});for(let k=top+10;k<116;k+=11)R(x,k,2,1,shade(c,-.4));
    const lean=(hsh(i,v,313)-.5)*14;for(let j=0;j<3;j++){const ly=top+4+j*9,dir=(i+j)%2?1:-1;
      for(let s=0;s<9;s++)R(x+dir*s,ly+s*.7+Math.abs(lean)*s/40,2,1,j===0?shade(lf,-.1):s>5?shade(dl,-.1):dl);}}
  R(0,112,W_+2,4,shade(P.earth,-.3));}};}
// shared-props-liveoak-v1: a live oak, wider than it is tall, low heavy limbs and grey-green Spanish moss hanging off
// them. v = 0 (big, about 5 tiles across), 1 (small, about 3). Give it a canopy so it turns see-through over the party.
function liveOak(v=0){const big=v===0,W_=big?170:110,H_=big?128:100;return{size:[W_,H_,0,0],anchor:[W_/2,H_-4],lights:[],draw({R,C}){const L=shade(slot("leaf","grass"),-.18),t=[shade(L,.22),shade(L,.06),L,shade(L,-.24),shade(L,-.45)],m=slot("moss","stone"),bk=shade(P.wood,-.25),cx=W_/2,base=H_-4;
  R(cx-7,base-46,14,46,bk,{sh:true});R(cx-12,base-4,24,4,P.woodDark);R(cx-4,base-40,2,26,shade(bk,.18));
  const limbs=big?[[-1,.9],[1,.85],[-1,.45],[1,.5]]:[[-1,.7],[1,.75]];
  limbs.forEach(([d,k],i)=>{for(let s=0;s<W_*.42*k;s+=2){const x=cx+d*s,y=base-40-s*.32+Math.pow(s/(W_*.4),2)*14-i*3;R(x-1,y,4,4,shade(bk,i%2?-.1:.05));}});
  const lobes=[];const n=big?11:7;for(let i=0;i<n;i++){const a=i/(n-1),x=10+a*(W_-20)+((hsh(i,v,321)-.5)*8),y=(big?38:34)-Math.sin(a*Math.PI)*(big?20:14)+((hsh(i,v,322)-.5)*8),r=(big?20:16)+hsh(i,v,323)*8;lobes.push([x,y,r]);}
  lobes.forEach(([x,y,r])=>C(x+3,y+4,r,t[4]));lobes.forEach(([x,y,r])=>C(x+1,y+2,r,t[3]));lobes.forEach(([x,y,r])=>C(x,y,r-2,t[2]));
  lobes.forEach(([x,y,r])=>C(x-r*.3,y-r*.35,r*.5,t[1]));lobes.forEach(([x,y,r])=>C(x-r*.4,y-r*.5,r*.2,t[0]));
  for(let i=0;i<(big?120:70);i++){const an=hsh(i,v,324)*6.283,rd=Math.sqrt(hsh(i,v,325));R(cx+Math.cos(an)*rd*W_*.44,(big?34:30)+Math.sin(an)*rd*22,3,2,hsh(i,v,326)<.5?t[1]:t[3]);}
  for(let i=0;i<(big?22:13);i++){const x=8+hsh(i,v,327)*(W_-16),y=(big?44:40)+hsh(i,v,328)*14,len=10+hsh(i,v,329)*(big?26:18);
    for(let k=0;k<len;k+=2){const sw=Math.sin(k*.35+i)*1.5;R(x+sw,y+k,k<len-4?3:2,2,k%6<2?shade(m,.2):k%6<4?m:shade(m,-.25));}}}};}
// shared-props-cypress-v1: a bald cypress: a flared, buttressed trunk, a tall narrow crown of feathery needles, a little
// moss. v varies it.
function cypress(v=0){return{size:[70,150,0,0],anchor:[35,146],lights:[],draw({R,C}){const L=shade(slot("leaf","grass"),-.05),t=[shade(L,.25),L,shade(L,-.25),shade(L,-.45)],bk=shade(P.wood,-.1),m=slot("moss","stone");
  for(let y=60;y<146;y++){const fl=y>118?Math.pow((y-118)/28,2)*14:0;R(35-5-fl,y,10+fl*2,1,y%5?bk:shade(bk,-.2));R(35+3+fl*.6,y,2+fl*.4,1,shade(bk,-.35));}
  for(let k=0;k<4;k++)R(28+k*4,120,1,24,shade(bk,.15));
  for(let i=0;i<16;i++){const y=8+i*7+((hsh(i,v,331)-.5)*4),w=10+Math.sin(i/15*Math.PI)*18+hsh(i,v,332)*6,x=35+((hsh(i,v,333)-.5)*8);
    C(x+2,y+2,w*.55,t[3]);C(x,y,w*.5,t[2]);C(x-w*.15,y-2,w*.34,t[1]);C(x-w*.25,y-3,w*.12,t[0]);}
  for(let i=0;i<40;i++){const x=12+hsh(i,v,334)*46,y=6+hsh(i,v,335)*104;R(x,y,2,1,hsh(i,v,336)<.5?t[0]:t[3]);}
  for(let i=0;i<5;i++){const x=20+hsh(i,v,337)*30,y=50+hsh(i,v,338)*40;for(let k=0;k<12;k+=2)R(x+Math.sin(k*.4)*1.2,y+k,2,2,k%4?m:shade(m,-.25));}}};}
// shared-tiles-bayouedge-v1: still dark bayou water (bayou: pixel function) and its bank (bayouEdge: drawn along a
// horizontal edge in pixels, the water below y). The bank has a mud lip, reeds and cypress knees poking up from the water.
// knees: [x, ...] where knees stand. Returns the knees' spots, for a case's ripple or fog.
function bayou(x,y,T=16){const u=T/16,nx=(x/u)|0,ny=(y/u)|0,w=slot("bayou","night"),n=hsh(nx,ny,341);
  if(n<.035)return shade(slot("leaf","grass"),-.2);                                              // duckweed
  if(ny%5===0&&hsh(nx>>2,ny,342)<.25)return shade(w,.18);                                         // a slow ripple
  return[w,shade(w,-.12),shade(w,.05)][(hsh(nx>>1,ny>>1,343)*3)|0];}
function bayouEdge(g,x0,x1,y,T=16,o={}){const u=T/16,e=P.earth,w=slot("bayou","night"),L=slot("leaf","grass"),knees=o.knees||[],out=[];
  for(let x=x0;x<x1;x+=u){const d=Math.round((Math.sin(x*.07)+Math.sin(x*.19))*u);F(g,x,y-2*u+d,u,3*u,shade(e,-.3));F(g,x,y+u+d,u,u,shade(w,.25));}
  for(let x=x0+2*u;x<x1;x+=3*u){if(hsh(x,y,344)<.45)continue;const h=(4+hsh(x,y,345)*7)*u;F(g,x,y-h,u,h,hsh(x,y,346)<.5?shade(L,-.15):slot("cane","straw"));if(hsh(x,y,347)<.25)F(g,x-u,y-h-2*u,2*u,3*u,shade(P.woodDark,-.1));}
  for(const kx of knees){const ky=y+3*u+hsh(kx,y,348)*4*u,h=(5+hsh(kx,y,349)*4)*u;F(g,kx-2*u,ky-h,4*u,h,shade(P.wood,-.15));F(g,kx-2*u,ky-h,u,h,shade(P.wood,.1));F(g,kx-u,ky-h-u,2*u,u,shade(P.wood,-.05));
    F(g,kx-3*u,ky,6*u,u,shade(w,.3));out.push([kx,ky]);}
  return out;}
// shared-tiles-raisedhouse-v1: a house front raised on piers in the 3/4 view: the roof, the wall up on its piers, the dark
// crawlspace between them, a door with steps down to the ground. x0..x1 wide, rt = roof top, rb = eave, fb = ground line.
// o: col (wall), roofCol, wall ("siding" | "batten"), door (x of the door's center), pier (pier height, about .9 tile),
// porch (true: a porch along the front at floor height, with a rail), curtains. Returns {glows, door, floor (y of the floor)}.
function raisedHouse(g,x0,x1,rt,rb,fb,T=16,o={}){const u=T/16,w=x1-x0,col=o.col||P.cream,ph=o.pier??Math.round(.9*T),fl=fb-ph,dr=o.door??(x0+w*.4),glows=[];
  F(g,x0,fl,w,ph,shade(P.outline,.04));for(let x=x0+u;x<x1-u;x+=u)if(hsh(x,fl,351)<.2)F(g,x,fl+ph-2*u,u,u,shade(P.earth,-.3));
  for(let px=x0+u;px<x1-2*u;px+=Math.max(2.2*T,w/Math.max(2,Math.round(w/(2.4*T))))){F(g,px,fl,3*u,ph,shade(P.stoneWarm,-.05));F(g,px,fl,u,ph,shade(P.stoneWarm,.15));F(g,px+2*u,fl,u,ph,shade(P.stoneWarm,-.35));}
  F(g,x1-4*u,fl,3*u,ph,shade(P.stoneWarm,-.05));F(g,x0,fl,w,2*u,shade(P.woodDark,-.1));
  roof(g,x0,x1,rt,rb,o.roofCol||P.panel,T,o.seed|0,!!o.chim);
  wall(g,x0,x1,rb,fl,o.wall||"siding",col,T);F(g,x0,rb,w,2*u,rgba(P.outline,.35));
  const ww=.62*T,wh=Math.min(.6*T,fl-rb-.45*T);
  for(let wx=x0+.35*T;wx+ww<x1-.2*T;wx+=1.2*T){if(Math.abs(wx+ww/2-dr)<.7*T)continue;glows.push(windowPane(g,wx,rb+.25*T,ww,wh,T,!!o.curtains));
    if(o.shutters){F(g,wx-.2*T,rb+.25*T,.16*T,wh,o.shutters);F(g,wx+ww+.04*T,rb+.25*T,.16*T,wh,o.shutters);}}
  door(g,dr,fl-.9*T,fl,o.doorCol||shade(P.accent,-.15),T);
  if(o.porch){F(g,x0,fl-u,w,2*u,P.wood);F(g,x0,fl-.45*T,w,u*1.5,P.cream);for(let x=x0;x<x1;x+=3*u){if(Math.abs(x-dr)<.5*T)continue;F(g,x,fl-.45*T,u,.42*T,shade(P.cream,-.12));}
    for(const px of[x0,x1-2*u])F(g,px,rb,2*u,fl-rb,P.cream);}
  const n=Math.max(2,Math.round(ph/(.2*T)));for(let i=0;i<n;i++){const sw=.7*T+i*2*u,sy=fl+i*(ph/n);F(g,dr-sw/2,sy,sw,ph/n,i%2?shade(P.wood,-.1):P.wood);F(g,dr-sw/2,sy+ph/n-u,sw,u,shade(P.woodDark,-.2));}
  F(g,dr-.35*T-n*u-u,fl,u,ph,shade(P.woodDark,-.1));F(g,dr+.35*T+n*u,fl,u,ph,shade(P.woodDark,-.1));
  return{glows,door:dr,floor:fl};}

/* ---------- TOWERS AND SMALL BUILDINGS ---------- */
// shared-props-tower-v1: a lattice radio or cell tower, painted in bands (P.accent and P.text). Three pieces:
// latticeMast(g, cx, top, bot, w, T) draws the open lattice between two heights in pixels (any height, so a map can run it
// off the top of the screen); TOWER_BASE is its foot (a concrete pier and the base insulator), a prop; towerTop(lit) is
// the top section with its warning light. beacon(ctx, x, y, now, r) draws the light's slow red blink after the night pass.
function latticeMast(g,cx,top,bot,w=12,T=16){const u=T/16,hw=w/2,band=Math.round(T*1.4);
  for(let y=top;y<bot;y+=u){const k=((bot-y)/band)|0,c=k%2?shade(P.text,-.08):P.accent;F(g,cx-hw,y,u,u,c);F(g,cx+hw-u,y,u,u,shade(c,-.3));}
  for(let y=bot;y>top;y-=w){const k=((bot-y)/band)|0,c=k%2?shade(P.text,-.2):shade(P.accent,-.15);
    for(let i=0;i<w;i+=u){const yy=y-i;if(yy<top)break;F(g,cx-hw+i,yy,u,u,c);F(g,cx+hw-u-i,yy,u,u,shade(c,-.25));}F(g,cx-hw,y,w,u,shade(c,-.1));}}
const TOWER_BASE={size:[40,30,0,0],anchor:[20,28],lights:[],draw({R}){const c=P.stone;R(4,16,32,12,shade(c,.15),{sh:8});R(4,16,32,2,shade(c,.35));R(2,26,36,2,shade(c,-.3));
  R(14,8,12,8,shade(P.panel,.1),{sh:3});R(16,4,8,5,P.cream);for(let y=5;y<9;y+=2)R(16,y,8,1,shade(P.cream,-.25));R(17,0,2,5,P.accent);R(21,0,2,5,shade(P.accent,-.3));}};
function towerTop(lit=true){return{size:[24,40,0,0],anchor:[12,38],lights:lit?[[12,4,1.6,.55]]:[],draw({R,C}){const b=slot("beacon","accent");
  for(let y=10;y<38;y+=2){const k=((38-y)/10)|0,c=k%2?shade(P.text,-.08):P.accent;R(6,y,2,2,c);R(16,y,2,2,shade(c,-.3));}
  for(let y=36;y>12;y-=8){R(6,y,12,1,shade(P.accent,-.2));for(let i=0;i<8;i+=2){R(7+i,y-i,1,1,shade(P.text,-.25));R(16-i,y-i,1,1,shade(P.text,-.4));}}
  R(4,8,16,3,P.panel);R(11,1,2,8,P.panel);C(12,4,3.2,lit?shade(b,.25):shade(b,-.5));if(lit)C(11,3,1.2,shade(b,.7));}};}
function beacon(ctx,x,y,now,r=18){const ph=(now%2400)/2400,on=ph<.5?Math.sin(ph/.5*Math.PI):0;if(on<=0)return;const b=slot("beacon","accent");
  ctx.globalCompositeOperation="lighter";const c=ctx.createRadialGradient(x,y,0,x,y,r);c.addColorStop(0,rgba(b,.85*on));c.addColorStop(.3,rgba(b,.35*on));c.addColorStop(1,rgba(b,0));ctx.fillStyle=c;ctx.fillRect(x-r,y-r,r*2,r*2);
  ctx.globalCompositeOperation="source-over";ctx.fillStyle=rgba(P.lightTo,on);ctx.fillRect(Math.round(x)-1,Math.round(y)-1,2,2);}
// shared-tiles-cinderblock-v1: a cinder-block wall in pixels, from top to fb (the ground line). Blocks in running bond,
// mortar lines, a stain or chip now and then. o: painted (a paint color: the blocks painted over, the mortar still showing
// through, the paint peeling near the ground), cap (true: a row of solid cap blocks on top).
function cinderBlock(g,x0,x1,top,fb,T=16,o={}){const u=T/16,c=o.painted||slot("cinder","stone"),bw=8*u,bh=4*u,mo=shade(c,-.35);
  F(g,x0,top,x1-x0,fb-top,mo);
  for(let y=top,row=0;y<fb;y+=bh,row++){for(let x=x0-((row%2)*bw/2);x<x1;x+=bw){const xs=Math.max(x,x0),xe=Math.min(x+bw-u,x1),n=hsh(x,y,361),v=[c,shade(c,-.06),shade(c,.05)][(n*3)|0];if(xe<=xs)continue;
    F(g,xs,y,xe-xs,bh-u,v);F(g,xs,y,xe-xs,u,shade(v,.12));if(!o.painted&&hsh(x,y,362)<.25)F(g,xs+2*u,y+u,u,u,shade(v,-.25));
    if(o.painted&&y>fb-3*bh&&hsh(x,y,363)<.35)F(g,xs+u,y+u,Math.min(3*u,xe-xs-u),bh-2*u,slot("cinder","stone"));}}
  if(o.cap){F(g,x0-u,top-2*u,x1-x0+2*u,3*u,shade(c,.15));F(g,x0-u,top-2*u,x1-x0+2*u,u,shade(c,.3));F(g,x0-u,top+u,x1-x0+2*u,u,mo);}
  for(let x=x0;x<x1;x+=u)if(hsh(x,fb,364)<.3)F(g,x,fb-(1+(hsh(x,fb,365)*3|0))*u,u,u,shade(P.earth,-.1));
  F(g,x0,top,u,fb-top,P.outline);F(g,x1-u,top,u,fb-top,P.outline);}
// shared-props-porchradio-v1: an old tabletop radio, no brand: a wood cabinet with a rounded top, a cloth speaker grille,
// a dial window and two knobs. porchRadio(on): on = the dial glows (and lights a little pool). Draw it at any scale with
// prop(spec, s): at s = 2 or more it reads as a close-up.
function porchRadio(on=false){return{size:[40,30,0,0],anchor:[20,28],lights:on?[[29,14,.9,.35]]:[],draw({R,E,C,big}){const w=P.wood,wl=shade(w,.25),wd=shade(w,-.35),d=slot("dial","glass");
  E(20,9,19,8,w);R(1,9,38,19,w,{sh:6});E(16,6,12,4,wl);R(1,9,6,19,wl);R(1,26,38,2,wd);
  R(4,10,18,14,shade(P.cloth,-.2));for(let y=11;y<24;y+=2)R(5,y,16,1,shade(P.cloth,-.4));for(let x=7;x<22;x+=4)R(x,10,1,14,shade(w,-.2));
  R(24,10,12,7,P.outline);R(25,11,10,5,on?d:shade(d,-.6));for(let x=26;x<35;x+=2)R(x,11,1,2,on?shade(d,-.35):shade(d,-.75));R(29,11,1,5,on?P.accent:shade(P.accent,-.5));
  if(on&&big)R(25,11,10,1,shade(d,.4));C(27,21,2.4,shade(P.stone,-.2));C(33,21,2.4,shade(P.stone,-.2));C(26.5,20.5,.9,shade(P.stone,.3));C(32.5,20.5,.9,shade(P.stone,.3));
  R(3,28,4,2,wd);R(33,28,4,2,wd);}};}
// shared-props-mic-v1: a desk microphone on its stand (DESKMIC), and a small mixing board (mixBoard(n, lit): n channels
// of faders and knobs with two meters; lit = the meters and the board's lamps glow).
const DESKMIC={size:[20,34,0,0],anchor:[10,32],lights:[],draw({R,E}){const m=shade(P.stone,.2),md=shade(m,-.35);
  R(3,28,14,4,P.panel,{sh:3});R(3,28,14,1,shade(P.panel,.3));R(9,14,2,14,md);R(6,14,8,2,md);
  E(10,8,6,8,m);E(9,7,4,6,shade(m,.2));for(let y=2;y<15;y+=2)R(5,y,10,1,md);R(4,7,12,2,shade(P.panel,.2));}};
function mixBoard(n=6,lit=true){const W_=n*10+12;return{size:[W_,30,0,0],anchor:[W_/2,28],lights:lit?[[W_-8,6,.7,.3]]:[],draw({R,C}){const b=P.panel,bl=shade(b,.25),d=slot("dial","glass");
  R(0,8,W_,20,b,{sh:6});R(0,8,W_,2,bl);R(0,26,W_,2,shade(b,-.4));
  for(let i=0;i<n;i++){const x=4+i*10;C(x+3,13,1.8,shade(P.text,-.2));C(x+2.5,12.5,.6,P.text);R(x+2,16,2,9,P.outline);R(x,17+((i*5)%6),6,3,i%3===0?P.accent:shade(P.text,-.1));}
  R(W_-12,0,10,8,P.outline);R(W_-11,1,4,6,lit?d:shade(d,-.6));R(W_-6,1,4,6,lit?shade(d,-.1):shade(d,-.6));R(W_-9,3,1,4,P.outline);R(W_-4,2,1,5,P.outline);}};}
return{T,S,SLOTS,PALETTES,use,pal,RGB,hex,rgba,shade,hsh,mk,art,drawChar,charSprite,SAMPLE_AGENTS,LAMP,BENCH,prop,summerGrass,summerTree,dryDirt,heat,sodium,storefront,signBlank,signText,signWidth,WATERTOWER,trafficLight,gasPump,ranchHouse,porch,mailbox,sedan,floor,innerWall,counter,tableChairs,DESK,BED,shelving,stringLights,booth,ferrisWheel,asphalt,paintLine,bugZap,BUGLIGHT,workLight,VAN_SIGN,van,walkway,metalStairs,numberDoor,windowAC,chainLink,chainLinkSide,pool,dumpster,FRIDGE_FRONT,kitchen,ceilingFan,boxes,washer,springGrass,blossomTree,mud,fog,fogReach,rain,twoLane,twoLaneCurve,guardrail,mileMarker,roadSign,stoneWall,stoneWallSide,COINVIEWER,slope,thicket,creek,hospitalBed,MONITOR,MONITOR_SCREEN,monitorLine,waitingChairs,snow,slush,snowbank,icicles,snowfall,cityStreet,BUSSTOP,BUSSTOP_SIGN,neonSign,neonText,neonFlicker,poleSign,barredWindow,hydrant,crtTV,CRT_SCREEN,vcr,vhsTape,paneling,caneField,tallCane,liveOak,cypress,bayou,bayouEdge,raisedHouse,latticeMast,TOWER_BASE,towerTop,beacon,cinderBlock,porchRadio,DESKMIC,mixBoard,
  dirtRoad,boardwalk,stoneSidewalk,grass,paint,F,picketFence,wall,roof,windowPane,door,awning,light,dusk,autumn,rr,shell,dialog};
})();
