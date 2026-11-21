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

return{T,S,SLOTS,PALETTES,use,pal,RGB,hex,rgba,shade,hsh,mk,art,drawChar,charSprite,SAMPLE_AGENTS,LAMP,BENCH,prop,
  dirtRoad,boardwalk,stoneSidewalk,grass,paint,F,picketFence,wall,roof,windowPane,door,awning,light,dusk,autumn,rr,shell,dialog};
})();
