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
