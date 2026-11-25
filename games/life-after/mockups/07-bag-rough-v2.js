// 07 bag, v2 (Nov 25, 2026): v1 (approved) with 20 x 20 icons at finished quality and bigger slots.
// v1 notes:: the Bag screen (L), spec 002 parts 8 and 10, on the cardboard menu surface from 05.
// Pockets are one row of 4; the worn school backpack adds 6 more. The picked square is edged in cyan, and the picked
// item gets its own card with its actions as buttons. Item icons are 16 x 16, drawn here in code. Design reference only.
(function(){
const {P,R,px,vol,box,portrait}=LA;
const K=P.kraft;
function cardboard(g,x,y,w,h){
  R(g,'rgba(0,0,0,.4)',x+2,y+2,w,h);R(g,K[1],x,y,w,h);
  g.save();g.beginPath();g.rect(x,y,w,h);g.clip();g.fillStyle=K[0];g.beginPath();g.ellipse(x+w*.32,y+h*.3,w*.34,h*.32,0,0,7);g.fill();g.restore();
  R(g,K[2],x,y,w,2);R(g,K[2],x,y,2,h);R(g,K[3],x,y+h-2,w,2);R(g,K[3],x+w-2,y,2,h);
  for(let i=x+3;i<x+w-3;i+=4){px(g,K[3],i,y+1);px(g,K[0],i+1,y);px(g,K[0],i+2,y);}
}
function tape(g,x,y,w,h){R(g,P.tape[1],x,y,w,h);R(g,P.tape[0],x,y,w,1);R(g,P.tape[2],x,y+h-1,w,1);for(let i=x;i<x+w;i+=3)px(g,P.tape[2],i,y+h);}
function wrap(g,t,max){const out=[];let line='';for(const w of t.split(' ')){const s=line?line+' '+w:w;if(g.measureText(s).width>max){out.push(line);line=w;}else line=s;}if(line)out.push(line);return out;}

// ---------- 20 x 20 item icons: shaded from one light at the upper left, with the game's selective outline ----------
const MET=['#d8d8d0','#b4b4ac','#8e8e86','#64645e'], WOOD=['#e8c88a','#c8a060','#9a7444','#6a4e2e'];
function can(g,lab,x,y,w,h){box(g,x,y,w,h,MET);R(g,MET[0],x,y,w,1);R(g,MET[3],x,y+h-1,w,1);for(let i=x;i<x+w;i+=2)px(g,MET[2],i,y+1);box(g,x,y+3,w,h-6,lab);}
const DRAW={
  beans(g){can(g,['#e07a46','#c8602e','#9a4426','#6e301c'],4,2,12,16);vol(g,10,10,3,2.2,['#f0dcb0','#d8c08a','#b8a070','#8a7650']);px(g,'#6e301c',9,10);},
  ravioli(g){can(g,['#8ca060','#6e8a4a','#56703a','#3e5228'],4,3,12,15);R(g,'#f0d890',7,8,6,5);R(g,'#d8b868',7,12,6,1);R(g,'#d8b868',12,8,1,5);px(g,'#c8503a',9,10);px(g,'#c8503a',10,10);},
  soda(g){box(g,6,2,9,16,['#e8704a','#c8502e','#a03a22','#74281a']);R(g,MET[1],6,2,9,2);R(g,MET[3],6,17,9,1);R(g,'#f0ead8',6,8,9,3);R(g,'#c8502e',9,9,3,1);px(g,MET[0],9,2);},
  water(g){box(g,6,5,8,13,['#cfe2ee','#9ab8d0','#6e8eaa','#4e6a86']);box(g,7,3,6,2,['#cfe2ee','#9ab8d0','#6e8eaa','#4e6a86']);box(g,8,1,4,2,['#f0f0e8','#d8d8d0','#b4b4ac','#8e8e86']);
    R(g,'#46647e',6,10,8,4);R(g,'#7ea6c0',6,10,8,1);R(g,'#f0f0e8',8,6,1,3);},
  bat(g){for(let i=0;i<15;i++){const t=i<6?2:i<11?3:4,cx=3+i,cy=17-i;for(let k=0;k<t;k++){const col=k===0?WOOD[0]:k===t-1?WOOD[3]:WOOD[1];px(g,col,cx+k,cy);px(g,col,cx+k,cy-1+k*0);}}
    R(g,'#3a2c24',2,16,4,2);R(g,'#5e4a3a',3,15,3,1);px(g,WOOD[0],16,3);},
  flash(g){box(g,2,8,10,5,['#74746c','#5e5e58','#46464a','#2e2e32']);box(g,11,6,5,9,['#8a8a80','#74746c','#5e5e58','#46464a']);R(g,'#ffe8a0',16,7,2,7);R(g,'#fff6d0',16,8,1,3);
    R(g,'#c8503a',6,8,2,1);for(let i=3;i<10;i+=2)px(g,'#2e2e32',i,12);},
  opener(g){box(g,3,4,4,13,MET);box(g,9,4,4,13,MET);R(g,'#b4582e',3,12,4,5);R(g,'#b4582e',9,12,4,5);R(g,'#d06a3a',3,12,1,5);R(g,'#d06a3a',9,12,1,5);
    vol(g,14,5,3,3,MET);px(g,MET[3],14,5);R(g,MET[2],6,6,4,2);},
  pills(g){box(g,5,6,10,12,['#e8a050','#c87a30','#9a5a22','#6e3e18']);box(g,4,2,12,4,['#f8f4ea','#e8e0d0','#c8c0b0','#9a9488']);R(g,'#f0ead8',6,9,8,5);R(g,'#c8503a',7,10,6,1);R(g,'#8a8478',7,12,5,1);},
  tape(g){vol(g,10,10,7.5,7.5,['#dcdedc','#b8bcb8','#929692','#6a6e6a']);vol(g,10,10,3.2,3.2,['#c09a64','#a6824e','#86683c','#5e4a2a']);
    g.clearRect(9,9,2,2);R(g,'#b8bcb8',14,15,4,4);R(g,'#929692',14,18,4,1);},
  rags(g){box(g,2,11,16,6,['#d8d0b8','#bcb59c','#9a9480','#74705e']);box(g,4,7,12,5,['#9ab8d0','#6a86a0','#4e6a86','#344c62']);box(g,6,4,8,4,['#e07a46','#c8602e','#9a4426','#6e301c']);
    R(g,'#74705e',5,14,10,1);R(g,'#344c62',6,10,8,1);},
};
const I={};
for(const k in DRAW){const [c,g]=LA.mk(20,20);DRAW[k](g);LA.outline(c,g);I[k]=(dst,x,y)=>dst.drawImage(c,x,y);}
// what's in the bag: [icon, name, count, wear (0..4 pips left of 4) or null, slots]
const POCKETS=[['bat','Slugger bat',1,3],['flash','Beamline flashlight',1,2],['opener','Can opener',1,null],['pills','Relievo painkillers',2,null]];
const PACK=[['beans','Farmstead beans',3,null],['ravioli',"Chef Tony's ravioli",1,null],['soda','Kola King soda',2,null],['water','Clear Springs water',4,null],['tape','Duct tape',1,null],['rags','Rags',5,null]];

function slot(g,x,y,s,item,on){
  R(g,'rgba(60,40,20,.35)',x+1,y+1,s,s);R(g,item?'#e2c48e':K[2],x,y,s,s);
  R(g,K[3],x,y+s-1,s,1);R(g,K[3],x+s-1,y,1,s);R(g,K[0],x,y,s,1);R(g,K[0],x,y,1,s);
  if(!item){for(let i=x+3;i<x+s-3;i+=3){px(g,K[3],i,y+3);px(g,K[3],i,y+s-4);}return;}
  I[item[0]](g,x+((s-20)>>1),y+2);
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
  const py=35,s=30,gap=4,gx=10;
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
  R(g,'rgba(60,40,20,.35)',rx+1,py+21,rw-2,s);R(g,'#e2c48e',rx,py+20,rw-4,s);I.bat(g,rx+3,py+25);
  g.font='12px VT323';g.fillStyle=P.marker;g.fillText('Slugger',rx+24,py+24);g.fillText('bat',rx+24,py+34);
  g.fillText('Slots',rx,by+14);g.fillText('9 of 10',rx,by+25);
  g.fillText('Walk',rx,by+42);g.fillText('1 min',rx,by+53);

  // the picked item's card
  const it=PACK[pick],cy=py+ph+6;
  const lines=['A solid meal: Hunger +40.','Opening it takes 10 minutes with your can opener.'];
  g.font='16px VT323';let body=[];lines.forEach(l=>body=body.concat(wrap(g,l,W-28)));
  const ch=8+10+13+body.length*13+10+18+6;
  cardboard(g,4,cy,W-8,Math.min(ch,H-cy-18));
  I[it[0]](g,10,cy+4);
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
