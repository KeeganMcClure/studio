// 07 bag, rough v1 (Nov 25, 2026): the Bag screen (L), spec 002 parts 8 and 10, on the cardboard menu surface from 05.
// Pockets are one row of 4; the worn school backpack adds 6 more. The picked square is edged in cyan, and the picked
// item gets its own card with its actions as buttons. Item icons are 16 x 16, drawn here in code. Design reference only.
(function(){
const {P,R,px,portrait}=LA;
const K=P.kraft;
function cardboard(g,x,y,w,h){
  R(g,'rgba(0,0,0,.4)',x+2,y+2,w,h);R(g,K[1],x,y,w,h);
  g.save();g.beginPath();g.rect(x,y,w,h);g.clip();g.fillStyle=K[0];g.beginPath();g.ellipse(x+w*.32,y+h*.3,w*.34,h*.32,0,0,7);g.fill();g.restore();
  R(g,K[2],x,y,w,2);R(g,K[2],x,y,2,h);R(g,K[3],x,y+h-2,w,2);R(g,K[3],x+w-2,y,2,h);
  for(let i=x+3;i<x+w-3;i+=4){px(g,K[3],i,y+1);px(g,K[0],i+1,y);px(g,K[0],i+2,y);}
}
function tape(g,x,y,w,h){R(g,P.tape[1],x,y,w,h);R(g,P.tape[0],x,y,w,1);R(g,P.tape[2],x,y+h-1,w,1);for(let i=x;i<x+w;i+=3)px(g,P.tape[2],i,y+h);}
function wrap(g,t,max){const out=[];let line='';for(const w of t.split(' ')){const s=line?line+' '+w:w;if(g.measureText(s).width>max){out.push(line);line=w;}else line=s;}if(line)out.push(line);return out;}

// ---------- 16 x 16 item icons, one light from the upper left ----------
const I={
  beans(g,x,y){R(g,'#6e6c5e',x+3,y+2,10,13);R(g,'#a8a28a',x+3,y+2,3,13);R(g,'#bcb59c',x+3,y+2,10,2);R(g,'#8e8a76',x+3,y+13,10,2);
    R(g,'#b4582e',x+3,y+5,10,6);R(g,'#d06a3a',x+3,y+5,3,6);R(g,'#e8d0a0',x+6,y+7,4,2);R(g,'#7a3e26',x+11,y+5,2,6);},
  ravioli(g,x,y){R(g,'#6e6c5e',x+3,y+3,10,12);R(g,'#bcb59c',x+3,y+3,10,2);R(g,'#a8a28a',x+3,y+3,3,12);
    R(g,'#6e8a4a',x+3,y+6,10,6);R(g,'#8ca060',x+3,y+6,3,6);R(g,'#e8c88a',x+7,y+8,3,2);R(g,'#42582e',x+11,y+6,2,6);},
  soda(g,x,y){R(g,'#8a4028',x+4,y+2,8,13);R(g,'#d06a3a',x+4,y+2,3,13);R(g,'#bcb59c',x+5,y+1,6,2);R(g,'#e8e0c8',x+5,y+6,6,3);R(g,'#6a3424',x+10,y+2,2,13);},
  water(g,x,y){R(g,'#46647e',x+5,y+4,6,11);R(g,'#9ab8d0',x+5,y+4,2,11);R(g,'#5a7a9a',x+7,y+4,3,11);R(g,'#e8e0c8',x+6,y+1,4,2);R(g,'#7e9a96',x+5,y+8,6,3);R(g,'#344c62',x+10,y+4,1,11);},
  bat(g,x,y){for(let i=0;i<12;i++){const t=i<5?1:2;R(g,'#b8a070',x+2+i,y+13-i,t,t);R(g,'#e8d0a0',x+2+i,y+13-i,1,1);}R(g,'#5e4a3a',x+1,y+13,3,2);R(g,'#8a7650',x+12,y+2,3,3);},
  flash(g,x,y){R(g,'#46464a',x+2,y+6,9,5);R(g,'#74746c',x+2,y+6,9,2);R(g,'#5e5e58',x+10,y+4,4,9);R(g,'#8a8a80',x+10,y+4,4,2);R(g,'#ffe08a',x+14,y+5,1,7);R(g,'#3ff0e8',x+5,y+9,2,1);},
  batt(g,x,y){[[2,3],[8,5]].forEach(([dx,dy])=>{R(g,'#34484a',x+dx,y+dy,5,9);R(g,'#7e9a96',x+dx,y+dy,2,9);R(g,'#e8c88a',x+dx,y+dy+6,5,3);R(g,'#bcb59c',x+dx+1,y+dy-1,3,1);});},
  tape(g,x,y){g.fillStyle='#868a86';g.beginPath();g.arc(x+8,y+8,6.5,0,7);g.fill();g.fillStyle='#c4c8c4';g.beginPath();g.arc(x+7,y+7,5.5,0,7);g.fill();
    g.fillStyle='#c09a64';g.beginPath();g.arc(x+8,y+8,2.6,0,7);g.fill();R(g,'#a8aca8',x+12,y+11,3,4);},
  rags(g,x,y){R(g,'#8e8a76',x+2,y+7,12,7);R(g,'#bcb59c',x+2,y+7,6,3);R(g,'#6a86a0',x+4,y+4,8,4);R(g,'#9ab8d0',x+4,y+4,3,2);R(g,'#6e6c5e',x+11,y+10,3,4);},
  opener(g,x,y){R(g,'#9aa8b4',x+3,y+3,3,10);R(g,'#606e7c',x+5,y+3,1,10);R(g,'#7e8c9a',x+6,y+6,6,3);R(g,'#b4582e',x+3,y+11,3,4);R(g,'#46525e',x+11,y+5,2,2);},
  tapeC(g,x,y){R(g,'#1c2232',x+1,y+4,14,9);R(g,'#46526e',x+1,y+4,14,2);R(g,'#e8e0c8',x+3,y+6,10,3);
    R(g,'#1c2232',x+4,y+7,2,1);R(g,'#1c2232',x+10,y+7,2,1);R(g,'#ff4fa3',x+3,y+10,10,1);},
  pills(g,x,y){R(g,'#d8c08a',x+4,y+5,8,10);R(g,'#e8d0a0',x+4,y+5,3,10);R(g,'#e8e0c8',x+3,y+2,10,3);R(g,'#c8503a',x+5,y+8,6,3);R(g,'#b8a070',x+10,y+5,2,10);},
};
// what's in the bag: [icon, name, count, wear (0..4 pips left of 4) or null, slots]
const POCKETS=[['bat','Slugger bat',1,3],['flash','Beamline flashlight',1,2],['opener','Can opener',1,null],['pills','Relievo painkillers',2,null]];
const PACK=[['beans','Farmstead beans',3,null],['ravioli',"Chef Tony's ravioli",1,null],['soda','Kola King soda',2,null],['water','Clear Springs water',4,null],['tape','Duct tape',1,null],['rags','Rags',5,null]];

function slot(g,x,y,s,item,on){
  R(g,'rgba(60,40,20,.35)',x+1,y+1,s,s);R(g,item?'#e2c48e':K[2],x,y,s,s);
  R(g,K[3],x,y+s-1,s,1);R(g,K[3],x+s-1,y,1,s);R(g,K[0],x,y,s,1);R(g,K[0],x,y,1,s);
  if(!item){for(let i=x+3;i<x+s-3;i+=3){px(g,K[3],i,y+3);px(g,K[3],i,y+s-4);}return;}
  I[item[0]](g,x+((s-16)>>1),y+3);
  if(item[2]>1){g.font='12px VT323';g.fillStyle=P.marker;const t='x'+item[2];g.fillText(t,x+s-g.measureText(t).width-2,y+s-11);}
  if(item[3]!=null)for(let i=0;i<4;i++)R(g,i<item[3]?P.marker:K[3],x+3+i*4,y+s-4,3,2);
  if(on){g.strokeStyle=P.cyan;g.lineWidth=2;g.strokeRect(x-1,y-1,s+2,s+2);}
}

window.drawBag=function(cv){
  const W=cv.width,H=cv.height,g=cv.getContext('2d');g.imageSmoothingEnabled=false;g.textBaseline='top';
  R(g,'#101416',0,0,W,H);
  // header: the two pages, the clock stopped
  R(g,P.card,0,0,W,20);R(g,'#4e5854',0,20,W,1);
  g.font='8px "Press Start 2P"';g.fillStyle=P.dim;g.fillText('<L',4,6);g.fillText('R>',W-20,6);
  const tabs=[['BAG',true],['RECIPES',false]];let tx=W/2-62;
  tabs.forEach(([t,on])=>{const w=g.measureText(t).width+10;R(g,on?P.cardHi:P.card,tx,3,w,15);if(on){R(g,P.cyan,tx,16,w,2);}
    g.fillStyle=on?P.warm:P.dim;g.fillText(t,tx+5,7);tx+=w+6;});
  // the clock line under the header
  g.font='12px VT323';g.fillStyle=P.dim;const cl='Clock stopped · Day 3 · 7:40 AM';g.fillText(cl,(W-g.measureText(cl).width)/2,23);

  // the grid panel
  const py=35,s=26,gap=4,gx=12;
  const ph=10+12+s+10+12+2*s+gap+8;
  cardboard(g,4,py,W-8,ph);
  tape(g,W-30,py-2,20,5);
  g.font='8px "Press Start 2P"';g.fillStyle=P.markR;g.fillText('POCKETS',gx,py+8);
  g.font='12px VT323';g.fillStyle=P.marker;g.fillText('4 slots',gx+62,py+6);
  POCKETS.forEach((it,i)=>slot(g,gx+i*(s+gap),py+20,s,it,false));
  const by=py+20+s+8;
  g.font='8px "Press Start 2P"';g.fillStyle=P.markR;g.fillText('SCHOOL BACKPACK',gx,by+2);
  g.font='12px VT323';g.fillStyle=P.marker;g.fillText('+6',gx+126,by);
  const pick=0;
  for(let i=0;i<8;i++){const c=i%4,r=(i/4)|0,x=gx+c*(s+gap),y=by+14+r*(s+gap);if(i<6)slot(g,x,y,s,PACK[i],i===pick);}
  // right column: in hand and worn
  const rx=gx+4*(s+gap)+6,rw=W-8-rx;
  g.font='8px "Press Start 2P"';g.fillStyle=P.markR;g.fillText('IN HAND',rx,py+8);
  R(g,'rgba(60,40,20,.35)',rx+1,py+21,rw-2,s);R(g,'#e2c48e',rx,py+20,rw-4,s);I.bat(g,rx+4,py+25);
  g.font='12px VT323';g.fillStyle=P.marker;g.fillText('Slugger',rx+23,py+22);g.fillText('bat',rx+23,py+32);
  g.fillText('Slots',rx,by+14);g.fillText('9 of 10',rx,by+25);
  g.fillText('Walk',rx,by+42);g.fillText('1 min',rx,by+53);

  // the picked item's card
  const it=PACK[pick],cy=py+ph+6;
  const lines=['A solid meal: Hunger +40.','Opening it takes 10 minutes with your can opener.'];
  g.font='16px VT323';let body=[];lines.forEach(l=>body=body.concat(wrap(g,l,W-28)));
  const ch=8+10+13+body.length*13+10+18+6;
  cardboard(g,4,cy,W-8,Math.min(ch,H-cy-18));
  I[it[0]](g,12,cy+6);
  g.font='8px "Press Start 2P"';g.fillStyle=P.markR;g.fillText(it[1].toUpperCase(),32,cy+7);
  g.font='12px VT323';g.fillStyle=P.marker;g.fillText('Food · 1 slot · stacks to 5',32,cy+16);
  g.font='16px VT323';g.fillStyle=P.marker;body.forEach((t,k)=>g.fillText(t,12,cy+28+k*13));
  // actions as buttons on the card
  const btY=cy+28+body.length*13+8;
  [['EAT',true],['DROP',false]].forEach(([t,on],i)=>{g.font='8px "Press Start 2P"';const w=g.measureText(t).width+14,x=12+i*(w+8+ (i?10:0));
    R(g,'rgba(60,40,20,.35)',x+1,btY+1,w,15);R(g,on?'#e2c48e':K[0],x,btY,w,15);R(g,K[3],x,btY+14,w,1);
    if(on){g.strokeStyle=P.cyan;g.lineWidth=2;g.strokeRect(x-1,btY-1,w+2,17);}
    g.fillStyle=P.marker;g.fillText(t,x+7,btY+4);});
  // key help
  g.font='12px VT323';g.fillStyle=P.dim;const kh='A use   B back   L/R page';g.fillText(kh,(W-g.measureText(kh).width)/2,H-14);
};
})();
