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

return{T,S,SLOTS,PALETTES,use,pal,RGB,hex,rgba,shade,hsh,mk,art,drawChar,charSprite,SAMPLE_AGENTS,LAMP,BENCH,prop,summerGrass,summerTree,dryDirt,heat,sodium,storefront,signBlank,signText,signWidth,WATERTOWER,trafficLight,gasPump,ranchHouse,porch,mailbox,sedan,floor,innerWall,counter,tableChairs,DESK,BED,shelving,stringLights,booth,ferrisWheel,asphalt,paintLine,
  dirtRoad,boardwalk,stoneSidewalk,grass,paint,F,picketFence,wall,roof,windowPane,door,awning,light,dusk,autumn,rr,shell,dialog};
})();
