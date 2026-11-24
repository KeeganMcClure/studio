// Rushlight · town-art.js
// The two streets drawn in code at Wide scale (16 px tiles), in the earth palette, after the approved Harrowford mockup
// (rushlight-mockups-town-v1): half-timbered fronts, a stone chapel, the smithy, the guild hall, cobbles, the market
// stall with its striped awning, the notice board with its bills, the handcart with a body, the pillory, the well,
// a chalk plague cross; and for Saint Ebbe's the priory church, the priory wall and gate, and the gibbet outside the wall.
// Exposes drawStreet(M, camx, camy), called by engine.js's drawWorld for a town map.
const TA={peat:'#1c1814',soot:'#2c2621',bone:'#e6dcc4',ash:'#857e72',straw:'#c8a552',tallow:'#d9b45a',rust:'#9a4528',moss:'#56623a',dusk:'#3b4757',
 timber:'#5a3e2b',timberD:'#3e2a1c',plaster:'#d8ccb0',plasterD:'#b8ab8c',stone:'#8a8274',stoneD:'#6a6458',cob:'#7a7062',cobD:'#5e564a',cobL:'#948a7a',slate:'#4a4a52',thatch:'#a8873e',thatchD:'#7e6430'};
function sR(x,y,w,h,c){cx.fillStyle=c;cx.fillRect(Math.round(x),Math.round(y),w,h)}
function drawStreet(M,camx,camy){
 const T=TOWNS[M.town],ox=-camx,oy=-camy,W=M.w*16;
 // a dusk sky above the roofs and the hedge below, for screens taller than the street
 const g=cx.createLinearGradient(0,0,0,oy);g.addColorStop(0,'#3b4757');g.addColorStop(1,'#8a7a62');cx.fillStyle=g;cx.fillRect(0,0,VW,Math.max(0,oy));sR(0,oy+M.h*16,VW,VH,'#434d2c');
 // cobbles
 sR(ox,oy+64,W,(M.h-4)*16,TA.cob);
 for(let y=4;y<M.h-1;y++)for(let x=0;x<M.w;x++){const px=ox+x*16,py=oy+y*16;if(px<-16||px>VW)continue;const v=(x*7+y*13)%4;
  sR(px+((y%2)*8)%16,py,1,16,TA.cobD);sR(px,py+7,16,1,TA.cobD);sR(px+3+v,py+2,3,2,TA.cobL);sR(px+10-v,py+10,2,2,TA.cobL)}
 sR(ox,oy+(M.h-1)*16,W,16,TA.moss);for(let x=0;x<W;x+=6)sR(ox+x,oy+(M.h-1)*16,3,3,'#434d2c');
 // house fronts
 T.buildings.forEach(b=>building(b,ox+b.x*16,oy));
 // dressing: a chalk plague cross on a door, monks are folk sprites
 if(T.dressing.cross!=null){const x=ox+T.dressing.cross*16;sR(x+4,oy+52,8,1,TA.bone);sR(x+7,oy+49,1,8,TA.bone);sR(x+5,oy+50,1,1,TA.bone);sR(x+10,oy+50,1,1,TA.bone)}
 T.props.forEach(p=>prop(p,ox+p.x*16,oy+p.y*16));
 streetLook(M,camx,camy);
}
function building(b,x,y){const w=b.w*16;
 if(b.kind==='wall'){sR(x,y,w,64,TA.stone);for(let r=0;r<64;r+=8)for(let c=(r/8%2)*8;c<w;c+=16){sR(x+c,y+r,15,7,TA.stoneD);sR(x+c+1,y+r+1,13,5,TA.stone)}
  sR(x,y,w,4,TA.stoneD);for(let c=0;c<w;c+=8)sR(x+c,y-2,4,4,TA.stoneD);
  if(b.door>=0){const dx=x+(b.door-b.x)*16;sR(dx-4,y+30,24,34,TA.peat);sR(dx-2,y+32,20,32,TA.timberD);for(let k=0;k<20;k+=4)sR(dx-2+k,y+32,1,32,TA.timber);cx.fillStyle=TA.peat;cx.beginPath();cx.arc(dx+8,y+32,12,Math.PI,0);cx.fill()}
  return}
 if(b.kind==='stone'||b.kind==='priory'){sR(x,y,w,64,TA.stone);for(let r=6;r<64;r+=8)sR(x,y+r,w,1,TA.stoneD);for(let c=0;c<w;c+=12)for(let r=0;r<64;r+=16)sR(x+c+(r/16%2)*6,y+r+6,1,8,TA.stoneD);
  const cxm=x+w/2;cx.fillStyle=TA.peat;cx.beginPath();cx.arc(cxm,y+16,7,0,7);cx.fill();sR(cxm-1,y+9,2,14,TA.stoneD);sR(cxm-7,y+15,14,2,TA.stoneD);
  if(b.kind==='priory'){sR(cxm-2,y-14,4,14,TA.stone);sR(cxm-6,y-18,12,5,TA.stoneD);sR(cxm-1,y-24,2,6,TA.peat);sR(cxm-3,y-22,6,2,TA.peat)}
 }else if(b.kind==='hall'){sR(x,y,w,64,TA.plaster);sR(x,y,w,6,TA.slate);for(let c=0;c<w;c+=20){sR(x+c,y+6,3,58,TA.timber)}sR(x,y+30,w,3,TA.timber);sR(x+w/2-10,y+10,20,14,TA.straw);sR(x+w/2-9,y+11,18,12,TA.rust);sR(x+w/2-2,y+13,4,8,TA.bone)}
 else{ // timber-framed: plaster panels, dark beams, windows, a roof edge
  sR(x,y,w,64,TA.plaster);sR(x,y,w,7,b.kind==='smithy'?TA.slate:TA.thatch);for(let c=0;c<w;c+=3)sR(x+c,y+5,1,2,b.kind==='smithy'?TA.peat:TA.thatchD);
  sR(x,y+7,w,2,TA.timber);sR(x,y+34,w,2,TA.timber);sR(x,y+62,w,2,TA.timberD);for(let c=0;c<=w;c+=16){sR(x+c-1,y+7,3,57,TA.timber)}
  for(let c=8;c<w;c+=16){cx.strokeStyle=TA.timber;cx.lineWidth=2;cx.beginPath();cx.moveTo(x+c-6,y+33);cx.lineTo(x+c+6,y+11);cx.stroke()}
  for(let c=4;c<w-8;c+=16){sR(x+c,y+14,8,8,TA.peat);sR(x+c+1,y+15,6,6,b.place==='inn'||b.place==='tavern'||b.place==='brothel'?TA.tallow:TA.dusk);sR(x+c+4,y+15,1,6,TA.peat)}
  if(b.kind==='smithy'){sR(x+w-14,y+40,10,6,TA.peat);sR(x+w-12,y+38,6,3,TA.peat);sR(x+w-20,y+46,2,12,TA.peat)}
 }
 if(b.door>=0&&b.kind!=='wall'){const dx=x+(b.door-b.x)*16;sR(dx+2,y+40,12,24,TA.peat);sR(dx+3,y+41,10,23,TA.timberD);sR(dx+11,y+52,1,2,TA.tallow);
  // a hanging sign for the inn, tavern and brothel
  if(['inn','tavern','brothel'].includes(b.place)){sR(dx+16,y+36,8,1,TA.peat);sR(dx+18,y+37,6,7,TA.straw);sR(dx+19,y+38,4,5,b.place==='inn'?TA.dusk:b.place==='tavern'?TA.rust:TA.blood||'#5e1a18')}}
}
function prop(p,x,y){
 if(p.kind==='stall'){sR(x,y-10,32,4,TA.straw);for(let k=0;k<32;k+=8)sR(x+k,y-10,4,4,TA.moss);sR(x+1,y-6,2,14,TA.timberD);sR(x+29,y-6,2,14,TA.timberD);sR(x,y+2,32,8,TA.timber);sR(x+4,y,6,3,'#8a9aa8');sR(x+14,y,5,3,'#6a7a4a');sR(x+22,y,6,3,TA.rust)}
 else if(p.kind==='board'){sR(x+2,y-4,2,18,TA.timberD);sR(x+28,y-4,2,18,TA.timberD);sR(x,y-14,32,16,TA.timber);sR(x+1,y-13,30,14,TA.timberD);
  [[3,-12],[12,-12],[21,-11],[6,-5],[17,-6]].forEach(([a,b])=>{sR(x+a,y+b,8,6,TA.bone);sR(x+a+3,y+b,2,1,TA.rust)})}
 else if(p.kind==='cart'){sR(x-2,y+2,22,8,TA.timber);sR(x-2,y+2,22,2,TA.timberD);sR(x+2,y-3,14,6,TA.bone);sR(x+3,y-4,12,2,'#cfc5ad');cx.fillStyle=TA.peat;cx.beginPath();cx.arc(x+8,y+11,4,0,7);cx.fill();sR(x+20,y+5,8,1,TA.timberD)}
 else if(p.kind==='pillory'){sR(x+7,y-8,2,22,TA.timberD);sR(x,y-8,16,4,TA.timber);sR(x+5,y-12,6,5,'#857b72');sR(x+6,y-11,1,1,TA.peat);sR(x+9,y-11,1,1,TA.peat);sR(x+12,y+10,3,2,'#a8873e')}
 else if(p.kind==='well'){sR(x+1,y+2,14,10,TA.stone);sR(x+2,y+3,12,3,TA.peat);sR(x+1,y-10,2,12,TA.timberD);sR(x+13,y-10,2,12,TA.timberD);sR(x,y-12,16,3,TA.timber);sR(x+7,y-9,1,8,TA.ash)}
 else if(p.kind==='gibbet'){sR(x+2,y-24,3,38,TA.timberD);sR(x+2,y-24,14,3,TA.timberD);sR(x+12,y-21,1,6,TA.ash);sR(x+9,y-15,7,12,TA.ash);sR(x+10,y-14,5,10,'#5a5048')}
}

// ================= THE LOOK PASS (spec 008, 8B; mockup 34-look-town-rough-v2, "A lot better") =================
// Laid over the street above: late autumn sun from the upper left, roofs in 3/4 with chimneys and drifting smoke, dormers,
// jettied upper floors with the shadow under them, shade on each building's far side, hanging signs for the smith and barber;
// a worn mud lane with ruts and puddles that catch the sky, moss and leaves in the cobbles, barrels, crates and sacks by the doors,
// lamps on posts, the lower street dressed, the bottom edge a hedge with pollard willows; life: smoke, crows, a dog, washing, more
// townsfolk standing about; a paler lane where folk stand and a soft shadow under every person and prop.
const TL={mud:'#6b5640',mudL:'#82684c',leaf:'#b5652a',leafD:'#8a4a22',duskL:'#5c6c7c',mossD:'#434d2c'};
const tHash=(a,b)=>{let h=(a*374761393+b*668265263)|0;h=(h^(h>>13))*1274126177;return ((h^(h>>16))>>>0)/4294967296};
function tShadow(x,y,w){cx.fillStyle='rgba(28,24,20,.45)';cx.beginPath();cx.ellipse(x,y,w/2,Math.max(2,w/5),0,0,7);cx.fill()}
// each street's extras: standing townsfolk who don't talk, the dog, the lower street's dressing (tile positions)
const STREET_LIFE={
 harrow:{extras:[[8,6,'mouse',{shade:0,mark:0,neck:1,coat:'#9a4528'}],[12.5,7.5,'badger',{shade:1,mark:0,neck:0,coat:'#56623a'}],[21,5.6,'fox',{shade:1,mark:0,neck:0,coat:'#3b4757'}],[26,7.7,'hedgehog',{shade:2,mark:0,neck:1,coat:'#8a7458'}]],
  dog:[13,6.25],crows:[[15,-20],[15.56,-21],[30,-15]],washing:[4,7],doors:[['b',3,66],['b',3.75,68],['c',10,67],['s',10.9,69],['c',19,68],['b',26,66],['s',27,70],['c',31,67]],
  lower:[['trough',4,172],['bench',12,176],['wood',19,170],['fence',23,186,64],['sack',8,176],['barrel',30,170]],puddles:[[5,9],[13,8.6],[22,9.2],[29,8.8]]},
 ebbe:{extras:[[8,6.6,'mouse',{shade:1,mark:0,neck:2,coat:'#857e72'}],[14,7.6,'hare',{shade:0,mark:0,neck:1,coat:'#56623a'}],[25,8.2,'rat',{shade:2,mark:0,neck:0,coat:'#6a4a32'}],[2,8.4,'badger',{shade:1,mark:0,neck:0,coat:'#3b4757'}]],
  dog:[11,8.3],crows:[[16,-26],[16.6,-27],[22,-4]],washing:[4,7],doors:[['b',3,66],['c',8,67],['s',9,69],['b',13,66],['c',21,68],['s',22,70],['b',28,66]],
  lower:[['trough',6,172],['bench',14,176],['wood',20,170],['fence',26,186,48],['sack',10,176],['barrel',3,170]],puddles:[[6,9],[15,8.7],[23,9.1],[30,8.8]]}};
function tBarrel(x,y){tShadow(x+6,y+14,14);sR(x,y,12,14,TA.peat);sR(x+1,y+1,10,12,TA.timber);sR(x+7,y+1,4,12,TA.timberD);sR(x+1,y+3,10,1,TA.peat);sR(x+1,y+10,10,1,TA.peat);sR(x+2,y+1,8,1,TL.mudL)}
function tCrate(x,y){tShadow(x+7,y+12,16);sR(x,y,14,12,TA.peat);sR(x+1,y+1,12,10,'#a8873e');sR(x+1,y+1,12,2,'#bea05a');sR(x+9,y+3,4,8,'#86692e');sR(x+1,y+6,12,1,TA.timber);sR(x+6,y+1,1,10,TA.timber)}
function tSack(x,y){tShadow(x+5,y+10,12);sR(x+1,y+2,9,8,TA.peat);sR(x+2,y+3,7,7,'#b8ab8c');sR(x+6,y+4,3,6,'#9c8f72');sR(x+3,y+1,4,2,'#9c8f72')}
function tLamp(x,y){tShadow(x+2,y+2,10);sR(x+1,y-30,2,32,TA.peat);sR(x-3,y-36,10,8,TA.peat);sR(x-2,y-35,8,6,'#f2d27a');sR(x-4,y-37,12,2,TA.peat)}
function tWillow(x,y){tShadow(x+12,y+2,40);
 sR(x+6,y-26,12,28,TA.peat);sR(x+7,y-25,10,27,TA.timber);sR(x+13,y-25,4,27,TA.timberD);sR(x+8,y-20,2,6,TL.mudL);
 [[22,14,TA.peat],[21,13,TL.mossD]].forEach(([a,b,c])=>{cx.fillStyle=c;cx.beginPath();cx.ellipse(x+12,y-36,a,b,0,0,7);cx.fill()});
 cx.fillStyle=TA.moss;cx.beginPath();cx.ellipse(x+8,y-40,14,8,0,0,7);cx.fill();cx.fillStyle='#6e7a48';cx.beginPath();cx.ellipse(x+5,y-43,7,4,0,0,7);cx.fill();
 for(let i=0;i<14;i++){const sx=x-8+i*3.2,len=10+tHash(i,x)*12;for(let k=0;k<len;k+=2)sR(sx+(tHash(i,k)-.5)*2,y-28+k,1,2,i>9?TL.mossD:TA.moss)}
 if(tHash(x,3)>.4){sR(x+2,y-40,2,2,TL.leaf);sR(x+18,y-34,2,2,TL.leaf)}}
function tHedge(x0,y,w){for(let x=x0;x<x0+w;x+=6){const h=14+tHash(x,y)*8;sR(x-1,y-h-1,9,h+8,TA.peat)}
 for(let x=x0;x<x0+w;x+=6){const h=14+tHash(x,y)*8;sR(x,y-h,7,h+6,TL.mossD);sR(x+1,y-h+1,4,3,TA.moss);if(tHash(x,9)>.7)sR(x+3,y-h+5,2,2,TL.leaf);if(tHash(x,4)>.85)sR(x+1,y-h+8,2,2,'#a8323a')}}
const LOWER={
 trough(x,y){tShadow(x+14,y+11,32);sR(x,y,28,10,TA.peat);sR(x+1,y+1,26,8,'#8a8274');sR(x+3,y+2,22,3,TA.dusk);sR(x+4,y+2,8,1,TL.duskL);sR(x+1,y+7,26,2,'#6a6458')},
 bench(x,y){tShadow(x+14,y+9,30);sR(x,y,28,4,TA.peat);sR(x+1,y+1,26,2,TA.timber);sR(x+2,y+4,3,6,TA.timberD);sR(x+23,y+4,3,6,TA.timberD)},
 wood(x,y){tShadow(x+10,y+10,24);for(let r=0;r<3;r++)for(let c=0;c<4-r;c++){const px=x+c*6+r*3,py=y+6-r*5;sR(px,py,6,5,TA.peat);sR(px+1,py+1,4,3,TL.mudL);sR(px+2,py+2,2,1,TA.timberD)}},
 fence(x0,y,w){for(let x=x0;x<x0+w;x+=12){sR(x,y-12,3,14,TA.peat);sR(x+1,y-11,1,12,TA.timber)}sR(x0,y-9,w,3,TA.peat);sR(x0,y-8,w,1,TA.timber);sR(x0,y-3,w,3,TA.peat);sR(x0,y-2,w,1,TA.timber)},
 sack:tSack,barrel:tBarrel};
function tRoof(b,x,y){
 const w=b.w*16,slate=b.kind==='smithy'||b.kind==='hall',c=slate?'#4a4a52':'#a8873e',cd=slate?'#35353c':'#7e6430',h=14+(b.x*7%3)*4;
 cx.fillStyle=TA.peat;cx.beginPath();cx.moveTo(x-3,y+8);cx.lineTo(x+6,y-h-1);cx.lineTo(x+w-6,y-h-1);cx.lineTo(x+w+3,y+8);cx.fill();
 cx.fillStyle=c;cx.beginPath();cx.moveTo(x-1,y+7);cx.lineTo(x+7,y-h);cx.lineTo(x+w-7,y-h);cx.lineTo(x+w+1,y+7);cx.fill();
 for(let k=y-h+3;k<y+7;k+=3)sR(x,k,w,1,cd);
 sR(x+7,y-h,w-14,2,slate?'#6a6a74':'#d8bd6c');
 if(b.kind!=='hall'){const chx=x+w-16;sR(chx,y-h-10,7,12,TA.peat);sR(chx+1,y-h-9,5,11,'#8a8274');sR(chx+4,y-h-9,2,11,'#6a6458');
  const t=performance.now()/900;for(let i=0;i<5;i++){const k=(t+i*.2)%1;cx.fillStyle=`rgba(200,190,175,${.35*(1-k)})`;cx.beginPath();cx.arc(chx+3+Math.sin(k*6+i)*3+k*8,y-h-12-k*22,2+k*4,0,7);cx.fill()}}
 if(b.w>=4&&!slate){const dx=x+10;sR(dx-1,y-h+2,12,11,TA.peat);sR(dx,y-h+3,10,9,'#d8ccb0');sR(dx+2,y-h+5,6,5,TA.peat);sR(dx+3,y-h+6,4,4,'#f2d27a')}}
function tJetty(b,x,y){if(b.kind==='stone'||b.kind==='priory'||b.kind==='wall')return;const w=b.w*16;sR(x-2,y+34,w+4,3,TA.peat);sR(x-2,y+33,w+4,1,TL.mudL);
 const g=cx.createLinearGradient(0,y+37,0,y+44);g.addColorStop(0,'rgba(28,24,20,.45)');g.addColorStop(1,'rgba(28,24,20,0)');cx.fillStyle=g;cx.fillRect(x,y+37,w,7)}
function tSideShade(b,x,y){const w=b.w*16,g=cx.createLinearGradient(x+w-10,0,x+w,0);g.addColorStop(0,'rgba(40,44,70,0)');g.addColorStop(1,'rgba(40,44,70,.4)');cx.fillStyle=g;cx.fillRect(x+w-10,y,10,64)}
function tSign(kind,x,y){sR(x,y,10,1,TA.peat);sR(x+9,y-2,1,3,TA.peat);
 if(kind==='smith'){sR(x+1,y+1,1,4,TA.peat);sR(x-2,y+5,10,3,TA.peat);sR(x-4,y+5,3,2,TA.peat);sR(x+1,y+8,4,3,TA.peat);sR(x-1,y+6,8,1,'#6a6a74')}
 if(kind==='barber'){sR(x+2,y+1,3,12,TA.peat);for(let k=0;k<11;k+=3)sR(x+3,y+2+k,1,2,k%6?'#e6dcc4':'#9a4528');sR(x+3,y+2,1,1,'#e6dcc4')}}
function tCrow(x,y,t){const f=Math.floor(t/300+x)%2;sR(x,y,4,3,TA.peat);sR(x+3,y-1,2,2,TA.peat);sR(x+5,y,1,1,'#b8913a');sR(x-2,y+f,2,1,TA.peat);sR(x+1,y+3,1,2,TA.peat);sR(x+3,y+3,1,2,TA.peat)}
function tDog(x,y,t){tShadow(x+7,y+9,16);const w=Math.floor(t/200)%2;sR(x,y+2,12,5,TA.peat);sR(x+1,y+3,10,3,'#8a6a44');sR(x+10,y,5,5,TA.peat);sR(x+11,y+1,3,3,'#8a6a44');sR(x+14,y+2,2,2,TA.peat);
 sR(x-2,y+1+w,3,1,TA.peat);sR(x+1,y+7,1,3,TA.peat);sR(x+9,y+7,1,3,TA.peat);sR(x+4,y+7,1,3-w,TA.peat)}
function tWashing(x0,x1,y){cx.strokeStyle=TA.peat;cx.lineWidth=1;cx.beginPath();cx.moveTo(x0,y);cx.quadraticCurveTo((x0+x1)/2,y+6,x1,y);cx.stroke();
 [['#d8ccb0',8],['#56623a',6],['#9a4528',7],['#3b4757',6]].forEach(([c,w],i)=>{const px=x0+6+i*((x1-x0-14)/4),py=y+3+Math.sin(i)*1.5;sR(px,py,w,7,TA.peat);sR(px+1,py,w-2,6,c)})}
let tLeaves=null;
function streetLook(M,camx,camy){
 const T=TOWNS[M.town],L=STREET_LIFE[M.town]||STREET_LIFE.harrow,ox=-camx,oy=-camy,W=M.w*16,H=M.h*16,t=performance.now();
 T.buildings.forEach(b=>{const x=ox+b.x*16;if(b.kind!=='wall'&&b.kind!=='stone'&&b.kind!=='priory')tRoof(b,x,oy);tJetty(b,x,oy);tSideShade(b,x,oy);
  if(b.place==='smith'||b.place==='barber')tSign(b.place,ox+b.door*16+16,oy+38)});
 tWashing(ox+L.washing[0]*16+4,ox+L.washing[1]*16-2,oy-2);
 L.crows.forEach(([x,y])=>tCrow(ox+x*16,oy+y,t));
 // the lane people walk: paler, smoother cobbles so folk stand out from the ground
 {const g=cx.createLinearGradient(0,oy+76,0,oy+128);g.addColorStop(0,'rgba(230,220,196,0)');g.addColorStop(.5,'rgba(230,220,196,.16)');g.addColorStop(1,'rgba(230,220,196,0)');cx.fillStyle=g;cx.fillRect(ox,oy+76,W,52)}
 // a worn mud lane along the street, uneven edges, wheel ruts
 for(let x=0;x<W;x+=4){const top=128+Math.round(Math.sin(x/37)*5+tHash(x,1)*3),bot=top+26+Math.round(tHash(x,2)*5);sR(ox+x,oy+top,4,bot-top,TL.mud);sR(ox+x,oy+top,4,2,TL.mudL)}
 for(let x=0;x<W;x+=2){sR(ox+x,oy+138+Math.round(Math.sin(x/37)*5),2,1,'#5a4634');sR(ox+x,oy+147+Math.round(Math.sin(x/37)*5),2,1,'#5a4634')}
 // puddles that catch the sky
 L.puddles.forEach(([tx,ty],i)=>{const x=ox+tx*16,y=oy+ty*16;cx.fillStyle=TA.dusk;cx.beginPath();cx.ellipse(x,y,9+i%2*3,3,0,0,7);cx.fill();sR(x-4,y-1,5,1,TL.duskL);sR(x+2,y+1,3,1,'#8a7a62')});
 // moss in the cracks and autumn leaves blown into corners
 if(!tLeaves){tLeaves=[];for(let i=0;i<260;i++)tLeaves.push([tHash(i,7)*W,70+tHash(i,8)*(H-90),tHash(i,9)])}
 tLeaves.forEach(([x,y,k])=>{if(k<.45)sR(ox+x,oy+y,2,1,TL.mossD);else if(k<.75)sR(ox+x,oy+y,2,2,k<.6?TL.leaf:TL.leafD)});
 // a shadow at the foot of every building (the light comes from the upper left)
 const g=cx.createLinearGradient(0,oy+64,0,oy+76);g.addColorStop(0,'rgba(28,24,20,.55)');g.addColorStop(1,'rgba(28,24,20,0)');cx.fillStyle=g;cx.fillRect(ox,oy+64,W,12);
 // shadows under the street's props and every person
 T.props.forEach(p=>tShadow(ox+p.x*16+14,oy+p.y*16+13,28));
 M.npcs.forEach(n=>{if(!n.on||n.on())tShadow(ox+n.x*16+8,oy+n.y*16+15,12)});
 tShadow(G.px-camx+8,G.py-camy+15,12);
 // townsfolk standing about (not talking); they breathe and blink like everyone else
 L.extras.forEach(([tx,ty,sp,look],i)=>{const x=ox+tx*16,y=oy+ty*16;tShadow(x+8,y+15,12);cx.drawImage(RLSP.map(sp,look,idleFrame(100+i*13,t)),x+1,y+16-26)});
 tDog(ox+L.dog[0]*16,oy+L.dog[1]*16,t);
 L.doors.forEach(([k,tx,y])=>({b:tBarrel,c:tCrate,s:tSack})[k](ox+tx*16+2,oy+y));
 [7,16,25].forEach(tx=>tLamp(ox+tx*16+4,oy+120));
 // the bottom edge framed by a hedge and pollard willows, so the screen never ends on bare ground
 sR(ox,oy+H-16,W,VH,TL.mossD);tHedge(ox,oy+H-6,W);
 [1,8,15,21,28].forEach(tx=>tWillow(ox+tx*16,oy+H+4));
 L.lower.forEach(([k,tx,y,w])=>LOWER[k](ox+tx*16,oy+y,w));
}
// the street's light: late autumn sun from the upper left, gold on the fronts, blue-brown in the shade, lamps just lit and windows glowing
function townLight(M,camx,camy){
 const T=TOWNS[M.town],ox=-camx,oy=-camy,lamps=[7,16,25].map(t=>[ox+t*16+6,oy+86,46]);
 const wins=[];T.buildings.forEach(b=>{if(b.kind==='wall'||b.kind==='stone')return;for(let c=4;c<b.w*16-8;c+=16)wins.push([ox+b.x*16+c+4,oy+18,10,.3])});
 cx.globalCompositeOperation='multiply';
 let g=cx.createLinearGradient(0,0,VW,VH);g.addColorStop(0,'#ffe2b0');g.addColorStop(.55,'#e8c79a');g.addColorStop(1,'#8c84a0');cx.fillStyle=g;cx.fillRect(0,0,VW,VH);
 cx.globalCompositeOperation='soft-light';
 g=cx.createLinearGradient(0,oy-30,0,oy+70);g.addColorStop(0,'rgba(255,200,110,0)');g.addColorStop(.35,'rgba(255,190,100,.55)');g.addColorStop(1,'rgba(255,190,100,.15)');cx.fillStyle=g;cx.fillRect(0,oy-30,VW,100);
 cx.globalCompositeOperation='source-over';
 const fr=Math.max(0,Math.min(1,lead().san/lead().msan));
 StudioLight.night(cx,{dark:'#2a2236',alpha:.16,warm:LOOK.warm,pools:[[G.px-camx+8,G.py-camy+8,22+14*fr],...lamps],glows:[...wins,...lamps.map(l=>[l[0],l[1]-34,14,.45])]});
 // below 40% SAN the picture sours, as everywhere (engine.js lights)
 const k=StudioLight.fade(sourFade,fr<.4,performance.now());if(k>0)StudioLight.sour(cx,k*LOOK.sour,{pink:LOOK.pink,cyan:LOOK.cyan});
}
