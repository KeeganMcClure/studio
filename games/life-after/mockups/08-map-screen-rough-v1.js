// 08 map screen, rough v1 (Nov 25, 2026): the Map screen (R), spec 002 part 12, on the cardboard surface from 05.
// Page 1, This section: your survivor's own marker map of the houses section. What you haven't seen is bare cardboard.
// Marks are shapes as well as colors: looted = a cross, promising = a circle, dangerous = a red triangle.
// The picked place is edged in cyan and gets a card; A cycles its mark. Page 2 (L/R) is the Road map. Design reference only.
(function(){
const {P,R,px}=LA;
const K=P.kraft;
function cardboard(g,x,y,w,h){
  R(g,'rgba(0,0,0,.4)',x+2,y+2,w,h);R(g,K[1],x,y,w,h);
  g.save();g.beginPath();g.rect(x,y,w,h);g.clip();g.fillStyle=K[0];g.beginPath();g.ellipse(x+w*.32,y+h*.3,w*.34,h*.32,0,0,7);g.fill();g.restore();
  R(g,K[2],x,y,w,2);R(g,K[2],x,y,2,h);R(g,K[3],x,y+h-2,w,2);R(g,K[3],x+w-2,y,2,h);
  for(let i=x+3;i<x+w-3;i+=4){px(g,K[3],i,y+1);px(g,K[0],i+1,y);px(g,K[0],i+2,y);}
}
function tape(g,x,y,w,h){R(g,P.tape[1],x,y,w,h);R(g,P.tape[0],x,y,w,1);R(g,P.tape[2],x,y+h-1,w,1);for(let i=x;i<x+w;i+=3)px(g,P.tape[2],i,y+h);}
function wrap(g,t,max){const out=[];let line='';for(const w of t.split(' ')){const s=line?line+' '+w:w;if(g.measureText(s).width>max){out.push(line);line=w;}else line=s;}if(line)out.push(line);return out;}

// the houses section, in tiles (60 x 60). Roads: [x,y,w,h]. Places: [x,y,w,h,name,mark,seen]
const ROADS=[[0,27,60,3],[14,4,3,52],[34,4,3,52],[48,30,3,26],[17,12,17,2],[37,44,11,2]];
const PLACES=[
  [4,20,6,5,'Home','looted',1],[4,32,6,5,'Home','looted',1],[19,15,6,5,'Home','looted',1],[26,15,6,5,'Home',null,1],
  [19,31,6,5,'Home','promising',1],[26,31,6,5,'Home',null,1],[4,40,6,5,'Home',null,1],[19,40,6,5,'Home','dangerous',1],
  [38,16,14,9,'Lincoln Elementary','promising',1],[38,33,8,8,'First Grace Church',null,1],[26,40,6,5,'Home',null,1],
  [52,36,6,5,'Home',null,0],[52,46,6,5,'Home',null,0],[38,48,8,6,'Home',null,0],[4,6,6,5,'Home',null,0],
];
const PARK=[19,47,13,9],SHED=[28,51,3,3];
// what's been on screen so far (tiles): a few rectangles; the rest stays bare cardboard
const SEEN=[[0,12,46,32],[12,10,24,40],[34,12,20,32],[16,40,20,16]];
const seen=(x,y)=>SEEN.some(r=>x>=r[0]&&y>=r[1]&&x<r[0]+r[2]&&y<r[1]+r[3]);

function mark(g,kind,cx,cy){
  if(kind==='looted'){g.strokeStyle=P.marker;g.lineWidth=2;g.beginPath();g.moveTo(cx-4,cy-4);g.lineTo(cx+4,cy+4);g.moveTo(cx+4,cy-4);g.lineTo(cx-4,cy+4);g.stroke();}
  if(kind==='promising'){g.strokeStyle=P.marker;g.lineWidth=2;g.beginPath();g.arc(cx,cy,4.5,0,7);g.stroke();}
  if(kind==='dangerous'){g.fillStyle=P.markR;g.beginPath();g.moveTo(cx,cy-5);g.lineTo(cx+5,cy+4);g.lineTo(cx-5,cy+4);g.closePath();g.fill();R(g,K[0],cx-.5,cy-2,1,3);R(g,K[0],cx-.5,cy+2,1,1);}
}

window.drawMapScreen=function(cv){
  const W=cv.width,H=cv.height,g=cv.getContext('2d');g.imageSmoothingEnabled=false;g.textBaseline='top';
  R(g,'#101416',0,0,W,H);
  // header: two pages
  R(g,P.card,0,0,W,20);R(g,'#4e5854',0,20,W,1);
  g.font='8px "Press Start 2P"';g.fillStyle=P.dim;g.fillText('<L',4,6);g.fillText('R>',W-20,6);
  const tabs=[['THIS SECTION',true],['ROAD MAP',false]];let tw=0;tabs.forEach(([t])=>tw+=g.measureText(t).width+10+6);let tx=(W-tw+6)/2;
  tabs.forEach(([t,on])=>{const w=g.measureText(t).width+10;R(g,on?P.cardHi:P.card,tx,3,w,15);if(on)R(g,P.cyan,tx,16,w,2);
    g.fillStyle=on?P.warm:P.dim;g.fillText(t,tx+5,7);tx+=w+6;});
  g.font='12px VT323';g.fillStyle=P.dim;const cl='Clock stopped · Day 3 · 7:40 AM';g.fillText(cl,(W-g.measureText(cl).width)/2,23);

  // the picked place's card height first, so the map takes what's left
  const pick=PLACES[8];
  const cardH=50, helpH=16, top=35;
  const avail=H-top-cardH-helpH-14;
  const sc=3, rows=Math.min(60,Math.floor((avail-36)/sc)), y0=Math.max(0,Math.min(60-rows,Math.round(33-rows/2)));
  const mw=60*sc, mh=rows*sc, panW=W-8, panH=mh+36;
  cardboard(g,4,top,panW,panH);tape(g,10,top-2,20,5);tape(g,W-30,top-2,20,5);
  const ox=4+((panW-mw)>>1), oy=top+18-y0*sc;
  g.save();g.beginPath();g.rect(4,top+18,panW,mh);g.clip();
  g.font='8px "Press Start 2P"';
  const s=sc;
  // unseen: bare cardboard with a few faint dashes at the edge of what's known
  for(let y=0;y<60;y++)for(let x=0;x<60;x++){if(seen(x,y))continue;if(((x+y)&3)===0&&(seen(x+1,y)||seen(x-1,y)||seen(x,y+1)||seen(x,y-1)))R(g,K[2],ox+x*s,oy+y*s,s,s);}
  // roads: marker lines, drawn only where seen
  for(const r of ROADS)for(let y=r[1];y<r[1]+r[3];y++)for(let x=r[0];x<r[0]+r[2];x++)if(seen(x,y))R(g,'#8a7656',ox+x*s,oy+y*s,s,s);
  // road edges in marker
  for(const r of ROADS){for(let x=r[0];x<r[0]+r[2];x++){if(seen(x,r[1]))R(g,P.marker,ox+x*s,oy+r[1]*s,s,1);if(seen(x,r[1]+r[3]-1))R(g,P.marker,ox+x*s,oy+(r[1]+r[3])*s-1,s,1);}
    for(let y=r[1];y<r[1]+r[3];y++){if(seen(r[0],y))R(g,P.marker,ox+r[0]*s,oy+y*s,1,s);if(seen(r[0]+r[2]-1,y))R(g,P.marker,ox+(r[0]+r[2])*s-1,oy+y*s,1,s);}}
  // the highway out, with an arrow and its name
  g.font='12px VT323';g.fillStyle=P.marker;g.fillText('Hwy 9 ->',ox+mw-40,oy+30*s+1);
  // park and shed
  g.strokeStyle=P.marker;g.lineWidth=1;g.setLineDash([2,2]);g.strokeRect(ox+PARK[0]*s+.5,oy+PARK[1]*s+.5,PARK[2]*s-1,PARK[3]*s-1);g.setLineDash([]);
  R(g,'#a6824e',ox+SHED[0]*s,oy+SHED[1]*s,SHED[2]*s,SHED[3]*s);g.strokeRect(ox+SHED[0]*s+.5,oy+SHED[1]*s+.5,SHED[2]*s-1,SHED[3]*s-1);
  g.fillText('park',ox+PARK[0]*s+3,oy+PARK[1]*s+2);
  // places
  PLACES.forEach(p=>{const [x,y,w,h,name,mk,sn]=p;if(!sn||!seen(x,y))return;
    const X=ox+x*s,Y=oy+y*s,Wp=w*s,Hp=h*s;
    R(g,'#e2c48e',X,Y,Wp,Hp);g.strokeStyle=P.marker;g.lineWidth=1;g.strokeRect(X+.5,Y+.5,Wp-1,Hp-1);
    if(name!=='Home'){g.font='12px VT323';g.fillStyle=P.markR;const short=name==='Lincoln Elementary'?'School':'Church';g.fillText(short,X+3,Y+2);}
    if(mk)mark(g,mk,X+Wp-7,Y+Hp-7);
    if(p===pick){g.strokeStyle=P.cyan;g.lineWidth=2;g.strokeRect(X-1,Y-1,Wp+2,Hp+2);}
  });
  // you are here: a small pin with YOU
  const yx=ox+15.5*s,yy=oy+24*s;R(g,P.markR,yx-2,yy-2,5,5);R(g,'#c8503a',yx-2,yy-2,2,2);R(g,P.marker,yx,yy+3,1,4);
  g.font='12px VT323';g.fillStyle=P.markR;g.fillText('YOU',yx+5,yy-5);
  g.restore();
  g.font='8px "Press Start 2P"';g.fillStyle=P.markR;g.fillText('HOUSES',12,top+6);
  g.font='12px VT323';g.fillStyle=P.marker;const nt='12 of 15 places found';g.fillText(nt,W-12-g.measureText(nt).width,top+4);
  // the key, along the panel's foot
  const ky=top+18+mh+4;g.font='12px VT323';g.fillStyle=P.marker;
  let kx=12;[['looted','Looted'],['promising','Promising'],['dangerous','Danger']].forEach(([k,t])=>{mark(g,k,kx+5,ky+6);g.fillStyle=P.marker;g.fillText(t,kx+13,ky);kx+=g.measureText(t).width+26;});

  // the picked place's card
  const cy=top+panH+6;
  cardboard(g,4,cy,W-8,cardH);
  g.font='8px "Press Start 2P"';g.fillStyle=P.markR;g.fillText('LINCOLN ELEMENTARY',12,cy+7);
  g.font='12px VT323';g.fillStyle=P.marker;g.fillText('School · the nurse\'s office is locked',12,cy+17);
  // the mark: A changes it (none, looted, promising, dangerous)
  const by=cy+30;g.font='12px VT323';g.fillStyle=P.marker;g.fillText('Mark',12,by+2);
  R(g,'rgba(60,40,20,.35)',43,by+1,96,15);R(g,'#e2c48e',42,by,96,15);g.strokeStyle=P.cyan;g.lineWidth=2;g.strokeRect(41,by-1,98,17);
  mark(g,'promising',52,by+7);g.font='8px "Press Start 2P"';g.fillStyle=P.marker;g.fillText('PROMISING',62,by+4);
  g.font='12px VT323';g.fillStyle=P.marker;g.fillText('A: next mark',146,by+2);
  g.font='12px VT323';g.fillStyle=P.dim;const kh='D-pad pick   A mark   B back   L/R page';g.fillText(kh,(W-g.measureText(kh).width)/2,H-14);
};
})();
