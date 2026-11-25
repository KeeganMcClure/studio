// 08 map screen, v2 (Nov 25, 2026): the Map screen (R), spec 002 part 12, at finished quality (Keegan, Nov 25: build to this).
// Page 1, This section: your survivor's own map of the houses section, drawn in black and red marker on the cardboard
// surface from 05. Seen places are drawn from above (gable roofs with a ridge, the school's flat roof, the church's steeple),
// streets have their curbs and a center line, and what you haven't seen is bare cardboard behind a hatched edge.
// Marks sit on paper discs so they read on any roof: looted = a cross, promising = a circle, danger = a red triangle.
// The view scrolls over the 60 x 60 section; this is the part around the main road. Design reference only.
(function(){
const {P,R,px}=LA;
const K=P.kraft, INK=P.marker, RED=P.markR, PAPER='#ece6d8', PAPERD='#d2ccbe';
const ROOF=['#e6cc98','#c9a872','#a8875a'], ROAD='#9a8462', ROADD='#86714f';
function cardboard(g,x,y,w,h){
  R(g,'rgba(0,0,0,.4)',x+2,y+2,w,h);R(g,K[1],x,y,w,h);
  g.save();g.beginPath();g.rect(x,y,w,h);g.clip();g.fillStyle=K[0];g.beginPath();g.ellipse(x+w*.32,y+h*.3,w*.34,h*.32,0,0,7);g.fill();g.restore();
  R(g,K[2],x,y,w,2);R(g,K[2],x,y,2,h);R(g,K[3],x,y+h-2,w,2);R(g,K[3],x+w-2,y,2,h);
  for(let i=x+3;i<x+w-3;i+=4){px(g,K[3],i,y+1);px(g,K[0],i+1,y);px(g,K[0],i+2,y);}
}
function tape(g,x,y,w,h){R(g,P.tape[1],x,y,w,h);R(g,P.tape[0],x,y,w,1);R(g,P.tape[2],x,y+h-1,w,1);for(let i=x;i<x+w;i+=3)px(g,P.tape[2],i,y+h);}
function ink(g,x,y,w,h){R(g,INK,x,y,w,1);R(g,INK,x,y+h-1,w,1);R(g,INK,x,y,1,h);R(g,INK,x+w-1,y,1,h);}

// ---------- the map, in tiles of 4 px. The window shows 56 x 36 tiles of the section ----------
const T=4, MW=56, MH=46;
// streets: [x,y,w,h]; the main road runs east to the highway strip
const STREETS=[[0,16,56,3],[11,0,2,46],[31,0,2,46],[45,19,2,27],[13,8,18,2],[33,27,12,2],[0,37,45,2]];
// homes: [x,y,facing] (a 5 x 4 lot; the house sits back from the street, a drive to one side)
const HOMES=[
  {x:4,y:10,f:'s',mark:'looted'},{x:4,y:20,f:'n',mark:'looted'},{x:4,y:26,f:'n'},
  {x:14,y:3,f:'s'},{x:21,y:3,f:'s',mark:'looted'},{x:14,y:11,f:'n'},{x:21,y:11,f:'n'},
  {x:14,y:20,f:'n',mark:'promising',bike:1},{x:21,y:20,f:'n'},{x:14,y:28,f:'s',mark:'danger'},{x:21,y:28,f:'s'},
  {x:34,y:30,f:'n'},{x:39,y:30,f:'n',mark:'looted'},{x:14,y:40,f:'n'},{x:21,y:40,f:'n'},{x:4,y:40,f:'n',mark:'looted'},{x:34,y:40,f:'n'},
  {x:48,y:21,f:'w',seen:0},{x:48,y:29,f:'w',seen:0},
];
const SCHOOL={x:34,y:4,w:16,h:10,mark:'promising'}, CHURCH={x:35,y:20,w:8,h:6};
const PARK={x:2,y:30,w:8,h:6};
// what's been seen: everything but the far east and the north-west corner
const seen=(x,y)=>!(x>=47&&y>=19)&&!(x<10&&y<8)&&!(x>=52)&&!(x>=27&&y>=40);

function house(g,X,Y,f,hl){
  // lot: a lighter yard, a gray drive, the house with a gable roof lit from the upper left
  const w=5*T,h=4*T;
  const drive=f==='s'||f==='n'?[X+w-6,f==='s'?Y+h-6:Y,4,6]:[f==='w'?X:X+w-6,Y+h-6,6,4];
  R(g,'#a89070',drive[0],drive[1],drive[2],drive[3]);R(g,'#8a7656',drive[0]+drive[2]-1,drive[1],1,drive[3]);
  const bx=X+1,by=f==='s'?Y+1:Y+4,bw=w-7,bh=h-6;
  R(g,'rgba(40,28,16,.35)',bx+2,by+2,bw,bh);           // hard shadow to the lower right
  R(g,ROOF[0],bx,by,bw,bh>>1);R(g,ROOF[1],bx,by+(bh>>1),bw,bh-(bh>>1));
  R(g,INK,bx,by+(bh>>1),bw,1);                          // the ridge
  ink(g,bx,by,bw,bh);
  px(g,PAPER,bx+1,by+1);px(g,PAPER,bx+2,by+1);            // a catch of light on the near eave
  R(g,INK,bx+bw-3,by-1,2,2);                             // chimney
  // a tree in the yard
  const tx=X+w-3,ty=f==='s'?Y+3:Y+h-3;
  g.fillStyle=K[3];g.beginPath();g.arc(tx+1,ty+1,2.6,0,7);g.fill();g.fillStyle='#b9a06e';g.beginPath();g.arc(tx,ty,2.6,0,7);g.fill();
  g.strokeStyle=INK;g.lineWidth=1;g.beginPath();g.arc(tx+.5,ty+.5,2.6,0,7);g.stroke();
}
function markDisc(g,kind,cx,cy){
  g.fillStyle='rgba(40,28,16,.35)';g.beginPath();g.arc(cx+1,cy+1,5.5,0,7);g.fill();
  g.fillStyle=PAPER;g.beginPath();g.arc(cx,cy,5.5,0,7);g.fill();g.strokeStyle=INK;g.lineWidth=1;g.beginPath();g.arc(cx+.5,cy+.5,5.5,0,7);g.stroke();
  glyph(g,kind,cx,cy,1);
}
function glyph(g,kind,cx,cy,sc){
  if(kind==='looted'){g.strokeStyle=INK;g.lineWidth=2;g.beginPath();g.moveTo(cx-3*sc,cy-3*sc);g.lineTo(cx+3*sc,cy+3*sc);g.moveTo(cx+3*sc,cy-3*sc);g.lineTo(cx-3*sc,cy+3*sc);g.stroke();}
  if(kind==='promising'){g.strokeStyle=INK;g.lineWidth=2;g.beginPath();g.arc(cx+.5,cy+.5,3*sc,0,7);g.stroke();}
  if(kind==='danger'){g.fillStyle=RED;g.beginPath();g.moveTo(cx+.5,cy-4*sc);g.lineTo(cx+4.5*sc,cy+3.5*sc);g.lineTo(cx-3.5*sc,cy+3.5*sc);g.closePath();g.fill();R(g,PAPER,cx,cy-1.5*sc,1,3*sc);px(g,PAPER,cx,cy+2*sc);}
}
function tag(g,x,y,text){g.font='12px VT323';const w=Math.ceil(g.measureText(text).width)+6;
  R(g,'rgba(40,28,16,.35)',x+1,y+1,w,10);R(g,PAPER,x,y,w,10);R(g,PAPERD,x,y+9,w,1);tape(g,x-2,y-1,4,3);
  g.fillStyle=RED;g.fillText(text,x+3,y-1);return w;}

function drawSection(){
  const c=document.createElement('canvas');c.width=MW*T;c.height=MH*T;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.textBaseline='top';
  // streets: fill, then curbs in marker, then the center line on the main road
  for(const [x,y,w,h] of STREETS)R(g,ROAD,x*T,y*T,w*T,h*T);
  for(const [x,y,w,h] of STREETS){
    if(w>h){R(g,INK,x*T,y*T,w*T,1);R(g,INK,x*T,(y+h)*T-1,w*T,1);}else{R(g,INK,x*T,y*T,1,h*T);R(g,INK,(x+w)*T-1,y*T,1,h*T);}
    R(g,ROADD,x*T+(w>h?0:w*T-3),y*T+(w>h?h*T-3:0),w>h?w*T:2,w>h?2:h*T);
  }
  // clear the curb lines where streets cross, so corners read
  for(const a of STREETS)for(const b of STREETS){if(a===b||!(a[2]>a[3])||b[2]>b[3])continue;
    const x0=Math.max(a[0],b[0]),x1=Math.min(a[0]+a[2],b[0]+b[2]),y0=Math.max(a[1],b[1]),y1=Math.min(a[1]+a[3],b[1]+b[3]);
    if(x0<x1&&y0<y1)R(g,ROAD,x0*T+1,y0*T-1,(x1-x0)*T-2,(y1-y0)*T+2);}
  for(let x=0;x<MW*T;x+=8)R(g,PAPER,x,17*T+1,4,1);
  // the park: dashed edge, trees, a shed
  g.strokeStyle=INK;g.setLineDash([2,2]);g.lineWidth=1;g.strokeRect(PARK.x*T+.5,PARK.y*T+.5,PARK.w*T-1,PARK.h*T-1);g.setLineDash([]);
  [[4,32],[8,31.5],[6,34.5]].forEach(([x,y])=>{g.fillStyle=K[3];g.beginPath();g.arc(x*T+1,y*T+1,3.5,0,7);g.fill();g.fillStyle='#b9a06e';g.beginPath();g.arc(x*T,y*T,3.5,0,7);g.fill();g.strokeStyle=INK;g.beginPath();g.arc(x*T+.5,y*T+.5,3.5,0,7);g.stroke();});
  // homes
  for(const h of HOMES)if(h.seen!==0)house(g,h.x*T,h.y*T,h.f);
  // the school: flat roof with a parapet, AC units, the gym's higher roof, a playground
  const S=SCHOOL,sx=S.x*T,sy=S.y*T,sw=S.w*T,sh=S.h*T;
  R(g,'rgba(40,28,16,.35)',sx+3,sy+3,sw,sh-12);
  R(g,'#d8cdb2',sx,sy,sw,sh-12);R(g,'#c4b896',sx,sy+sh-16,sw,4);ink(g,sx,sy,sw,sh-12);ink(g,sx+2,sy+2,sw-4,sh-16);
  R(g,'#cbbf9f',sx+sw-22,sy+3,18,sh-19);ink(g,sx+sw-22,sy+3,18,sh-19); // the gym
  [[sx+8,sy+6],[sx+20,sy+6],[sx+32,sy+6]].forEach(([x,y])=>{R(g,'rgba(40,28,16,.35)',x+1,y+1,6,4);R(g,PAPER,x,y,6,4);ink(g,x,y,6,4);});
  g.setLineDash([2,2]);g.strokeRect(sx+4.5,sy+sh-10.5,24,9);g.setLineDash([]);   // the playground
  R(g,INK,sx+8,sy+sh-8,6,1);R(g,INK,sx+8,sy+sh-8,1,5);R(g,INK,sx+13,sy+sh-8,1,5);  // swings
  R(g,INK,sx+40,sy+sh-11,1,8);R(g,RED,sx+41,sy+sh-11,4,3);                         // flagpole
  // the church: a long roof with its ridge, the steeple at the front, a cross
  const C=CHURCH,cx=C.x*T,cy=C.y*T;
  R(g,'rgba(40,28,16,.35)',cx+6,cy+3,18,C.h*T);
  R(g,ROOF[0],cx+4,cy,9,C.h*T);R(g,ROOF[1],cx+13,cy,9,C.h*T);R(g,INK,cx+13,cy,1,C.h*T);ink(g,cx+4,cy,18,C.h*T);
  R(g,'#d8cdb2',cx+9,cy+C.h*T-2,9,8);ink(g,cx+9,cy+C.h*T-2,9,8);R(g,INK,cx+13,cy+C.h*T,1,5);R(g,INK,cx+11,cy+C.h*T+1,5,1);
  // unseen: bare cardboard, with a hatched marker edge where the known map stops
  const known=document.createElement('canvas');known.width=c.width;known.height=c.height;const kg=known.getContext('2d');
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)if(!seen(x,y)){g.clearRect(x*T,y*T,T,T);}
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){if(!seen(x,y))continue;
    const edge=!seen(x+1,y)||!seen(x-1,y)||!seen(x,y+1)||!seen(x,y-1);if(!edge)continue;
    if((x+y)%2===0){g.strokeStyle=K[3];g.lineWidth=1;g.beginPath();g.moveTo(x*T,y*T+T);g.lineTo(x*T+T,y*T);g.stroke();}}
  return c;
}

window.drawMapScreen=function(cv){
  const W=cv.width,H=cv.height,g=cv.getContext('2d');g.imageSmoothingEnabled=false;g.textBaseline='top';
  R(g,'#101416',0,0,W,H);
  // header: two pages
  R(g,P.card,0,0,W,20);R(g,'#4e5854',0,20,W,1);
  g.font='8px "Press Start 2P"';g.fillStyle=P.dim;g.fillText('<L',4,6);g.fillText('R>',W-20,6);
  const tabs=[['THIS SECTION',true],['ROAD MAP',false]];let tw=0;tabs.forEach(([t])=>tw+=g.measureText(t).width+16);let tx=(W-tw+6)/2;
  tabs.forEach(([t,on])=>{const w=g.measureText(t).width+10;R(g,on?P.cardHi:P.card,tx,3,w,15);if(on)R(g,P.cyan,tx,16,w,2);
    g.fillStyle=on?P.warm:P.dim;g.fillText(t,tx+5,7);tx+=w+6;});
  g.font='12px VT323';g.fillStyle=P.dim;const cl='Clock stopped · Day 3 · 7:40 AM';g.fillText(cl,(W-g.measureText(cl).width)/2,23);

  const cardH=52, top=35;
  const panW=W-8, mapW=MW*T, ox=4+((panW-mapW)>>1);
  const mapH=Math.min(MH*T,H-top-cardH-16-10-34), panH=mapH+34;
  cardboard(g,4,top,panW,panH);tape(g,12,top-2,20,5);tape(g,W-32,top-2,20,5);
  g.font='8px "Press Start 2P"';g.fillStyle=RED;g.fillText('HOUSES',12,top+7);
  g.font='12px VT323';g.fillStyle=INK;const nt='12 of 15 places found';g.fillText(nt,W-12-g.measureText(nt).width,top+5);
  const oy=top+18, scrollY=Math.max(0,Math.min(MH*T-mapH,SCHOOL.y*T-8));
  const sec=drawSection();
  g.drawImage(sec,0,scrollY,mapW,mapH,ox,oy,mapW,mapH);
  const at=(tx,ty)=>[ox+tx*T,oy+ty*T-scrollY];
  const vis=(y)=>y>=oy+4&&y<=oy+mapH-4;
  g.save();g.beginPath();g.rect(4,oy,panW,mapH);g.clip();
  // marks on paper discs
  for(const h of HOMES){if(h.seen===0||!h.mark)continue;const [x,y]=at(h.x,h.y);const my=y+(h.f==='s'?6:10);if(vis(my))markDisc(g,h.mark,x+5,my);}
  {const [x,y]=at(SCHOOL.x,SCHOOL.y);markDisc(g,SCHOOL.mark,x+SCHOOL.w*T-10,y+10);}
  // the picked place: the school, edged in cyan
  {const [x,y]=at(SCHOOL.x,SCHOOL.y);g.strokeStyle=P.cyan;g.lineWidth=2;g.strokeRect(x-2,y-2,SCHOOL.w*T+4,SCHOOL.h*T-8);}
  // labels on taped paper tags
  {const [x,y]=at(SCHOOL.x,SCHOOL.y);if(vis(y+12))tag(g,x+5,y+19,'LINCOLN ELEM.');}
  {const [x,y]=at(CHURCH.x,CHURCH.y);if(vis(y))tag(g,x+25,y+10,'FIRST GRACE');}
  {const [x,y]=at(52,16);if(vis(y)){g.font='12px VT323';tag(g,W-56,y-12,'HWY 9 >');}}
  // the bike, parked in the promising house's drive
  {const h=HOMES[7],[x,y]=at(h.x,h.y);if(vis(y)){g.strokeStyle=INK;g.lineWidth=1;g.beginPath();g.arc(x+15.5,y+3.5,2,0,7);g.arc(x+21.5,y+3.5,2,0,7);g.stroke();R(g,RED,x+16,y+1,5,1);}}
  // you are here: a red pushpin with a tag
  {const [x,y]=at(7,17.5);if(vis(y)){g.fillStyle='rgba(40,28,16,.4)';g.beginPath();g.ellipse(x+3,y+6,4,1.6,0,0,7);g.fill();
    R(g,INK,x,y,1,6);g.fillStyle=RED;g.beginPath();g.arc(x+.5,y-2,3.5,0,7);g.fill();g.fillStyle='#d06a3a';g.beginPath();g.arc(x-.5,y-3,1.4,0,7);g.fill();
    tag(g,x+6,y-3,'YOU');}}
  g.restore();
  // scroll hints where the map goes on
  g.font='8px "Press Start 2P"';g.fillStyle=INK;g.fillText('▲',W/2-4,oy-1);g.fillText('▼',W/2-4,oy+mapH-7);
  // the key along the panel's foot
  const ky=oy+mapH+5;g.font='12px VT323';let kx=12;
  [['looted','Looted'],['promising','Promising'],['danger','Danger']].forEach(([k,t])=>{glyph(g,k,kx+4,ky+5,1);g.fillStyle=INK;g.fillText(t,kx+12,ky-1);kx+=g.measureText(t).width+24;});

  // the picked place's card
  const cy=top+panH+6;
  cardboard(g,4,cy,W-8,cardH);
  g.font='8px "Press Start 2P"';g.fillStyle=RED;g.fillText('LINCOLN ELEMENTARY',12,cy+7);
  g.font='12px VT323';g.fillStyle=INK;g.fillText("School · 3 of 9 spots searched · a locked door",12,cy+17);
  const by=cy+31;g.font='12px VT323';g.fillStyle=INK;g.fillText('Mark',12,by+2);
  R(g,'rgba(60,40,20,.35)',43,by+1,100,15);R(g,'#e2c48e',42,by,100,15);g.strokeStyle=P.cyan;g.lineWidth=2;g.strokeRect(41,by-1,102,17);
  glyph(g,'promising',52,by+7,1);g.font='8px "Press Start 2P"';g.fillStyle=INK;g.fillText('PROMISING',62,by+4);
  g.font='12px VT323';g.fillStyle=INK;g.fillText('A: next mark',150,by+2);
  g.font='12px VT323';g.fillStyle=P.dim;const kh='D-pad pick   A mark   B back   L/R page';g.fillText(kh,(W-g.measureText(kh).width)/2,H-14);
};
})();
