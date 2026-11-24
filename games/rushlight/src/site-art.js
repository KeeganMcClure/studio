// Rushlight · site-art.js
// Contract sites drawn in code, tile by tile (16 px), in the earth palette, after the approved site mockups
// (rushlight-mockups-site-v1, the charcoal camp; the rough site mockups 30–33 for Hollin, Sallow End, the causeway and
// Crookback). Exposes drawSiteTiles(M, camx, camy) for engine.js's drawWorld, and the site's light (sites at night or
// dusk use the shared night light, with Tallow pools from the rushlight, fires and lamps).
// Tile key: . ground · , path · T tree · H hut wall · D door · w woodpile · f fire pit · r drying rack · c charcoal clamp
//   ~ water · b boat · o osier beds · q causeway planks · g open grave · W stone wall · h house front · k church · s stook
//   y field (rye) · x bones · O oven · l ladder · p pump house · m whim · u spoil heap · L lamp · S shaft · a ash/ruin
const SA={peat:'#1c1814',soot:'#2c2621',bone:'#e6dcc4',ash:'#857e72',straw:'#c8a552',tallow:'#d9b45a',rust:'#9a4528',moss:'#56623a',mossD:'#434d2c',dusk:'#3b4757',duskL:'#5c6c7c',
 dirt:'#5a4a3a',dirtD:'#4a3c2e',dirtL:'#6a5846',path:'#7a6450',bark:'#3e2a1c',timber:'#5a3e2b',thatch:'#a8873e',thatchD:'#7e6430',stone:'#8a8274',stoneD:'#6a6458',water:'#2a3a48',waterL:'#3b5060',rye:'#c8a552',ryeD:'#a8873e'};
const siteTC={};
function siteTile(ch,v,tod,obj){const k=ch+v+tod+(obj?'o':'');if(siteTC[k])return siteTC[k];const c=document.createElement('canvas');c.width=c.height=16;const x=c.getContext('2d');
 const p=(a,b,w,h,col)=>{x.fillStyle=col;x.fillRect(a,b,w,h)};const gr=tod==='noon'?['#8a7a42','#a08c4a','#76683a']:[SA.dirt,SA.dirtL,SA.dirtD];
 const ground=()=>{if(obj)return;p(0,0,16,16,gr[0]);p((v*5)%13,3,2,1,gr[1]);p((v*7)%11+2,11,1,1,gr[2]);p(4,(v*3)%12+2,1,1,gr[2]);if(v===2)p(9,6,2,1,SA.mossD)};
 switch(ch){
 case '.':ground();break;
 case ',':p(0,0,16,16,SA.path);p((v*5)%13,4,2,1,'#6a5644');p(3,(v*7)%12,1,1,'#8a745e');break;
 case 'T':ground();p(6,9,4,7,SA.bark);p(1,0,14,11,SA.mossD);p(2,1,12,8,SA.moss);p(4,2,3,2,'#6a7a4a');p(1,9,14,2,'rgba(0,0,0,.3)');break;
 case 'H':p(0,0,16,16,SA.timber);for(let i=0;i<16;i+=4)p(0,i,16,1,SA.bark);p(0,0,16,3,SA.thatch);p(0,3,16,1,SA.thatchD);break;
 case 'D':p(0,0,16,16,SA.timber);p(0,0,16,3,SA.thatch);p(3,4,10,12,SA.peat);p(4,5,8,11,'#2a1e16');break;
 case 'w':ground();for(let r=0;r<3;r++)for(let q=0;q<3;q++){p(1+q*5,4+r*4,4,4,SA.timber);p(2+q*5,5+r*4,2,2,SA.straw)}break;
 case 'f':ground();p(2,6,12,8,SA.stoneD);p(3,7,10,6,SA.peat);p(5,8,2,2,SA.rust);p(9,9,2,1,SA.tallow);p(7,10,2,2,'#c8603a');break;
 case 'r':ground();p(1,2,2,14,SA.bark);p(13,2,2,14,SA.bark);p(1,2,14,2,SA.bark);for(let q=3;q<13;q+=3)p(q,4,1,4,SA.moss);break;
 case 'c':ground();p(1,6,14,9,'#3a3028');p(3,4,10,3,'#4a3c30');p(6,2,4,3,'#5a4a3c');p(4,9,2,1,SA.rust);break;
 case '~':p(0,0,16,16,SA.water);p((v*3)%12,4,4,1,SA.waterL);p((v*5)%10+3,11,3,1,SA.waterL);break;
 case 'b':p(0,0,16,16,SA.water);p(1,5,14,7,SA.timber);p(2,6,12,2,SA.bark);break;
 case 'o':ground();for(let q=0;q<16;q+=3)p(q,2+(q%2)*3,1,12,'#6a7a4a');break;
 case 'q':p(0,0,16,16,SA.water);p(0,2,16,12,SA.timber);for(let q=0;q<16;q+=4)p(q,2,1,12,SA.bark);break;
 case 'g':ground();p(3,4,10,9,SA.peat);p(2,3,12,1,SA.dirtL);p(13,2,2,5,SA.stone);break;
 case 'W':p(0,0,16,16,SA.stone);p(0,4,16,1,SA.stoneD);p(0,10,16,1,SA.stoneD);p(6,0,1,4,SA.stoneD);p(11,5,1,5,SA.stoneD);break;
 case 'h':p(0,0,16,16,'#b8ab8c');p(0,0,16,3,SA.thatchD);p(0,15,16,1,SA.bark);p(5,5,6,6,SA.peat);p(7,5,1,6,SA.bark);break;
 case 'k':p(0,0,16,16,SA.stone);p(0,5,16,1,SA.stoneD);p(6,6,4,10,SA.peat);x.fillStyle=SA.peat;x.beginPath();x.arc(8,6,2,Math.PI,0);x.fill();break;
 case 's':p(0,0,16,16,gr[0]);p(5,3,6,12,SA.rye);p(4,6,8,2,SA.ryeD);p(7,1,2,3,SA.rye);break;
 case 'y':p(0,0,16,16,SA.rye);for(let q=0;q<16;q+=2)p(q,(q*3+v)%5,1,6,SA.ryeD);break;
 case 'x':ground();p(3,7,8,1,SA.bone);p(4,10,6,1,SA.bone);p(2,8,1,2,SA.bone);break;
 case 'O':p(0,0,16,16,SA.stone);p(2,6,12,10,SA.stoneD);x.fillStyle=SA.peat;x.beginPath();x.arc(8,10,5,Math.PI,0);x.fill();p(3,10,10,6,SA.peat);break;
 case 'l':p(0,0,16,16,SA.peat);p(4,0,1,16,SA.timber);p(11,0,1,16,SA.timber);for(let q=2;q<16;q+=4)p(4,q,8,1,SA.timber);break;
 case 'S':p(0,0,16,16,SA.peat);p(0,0,16,2,SA.stoneD);p(0,14,16,2,SA.stoneD);break;
 case 'p':p(0,0,16,16,SA.stone);p(0,0,16,4,'#4a4a52');p(4,6,8,10,SA.peat);p(6,8,4,2,SA.rust);break;
 case 'm':ground();p(7,0,2,16,SA.bark);p(1,2,14,2,SA.bark);p(2,4,2,6,SA.bark);p(12,4,2,6,SA.bark);break;
 case 'u':ground();p(1,6,14,10,'#4a4038');p(3,3,10,4,'#5a5046');p(6,1,4,3,'#6a6054');break;
 case 'L':ground();p(7,6,2,10,SA.bark);p(5,2,6,5,SA.tallow);p(6,3,4,3,'#fff1c4');break;
 case 'a':ground();p(1,8,14,8,'#3a3028');p(2,4,3,5,SA.stoneD);p(10,2,4,7,SA.stoneD);p(6,10,4,2,SA.ash);break;
 default:ground();
 }
 return siteTC[k]=c}
function drawSiteTilesOld(M,camx,camy){
 const x0=Math.floor(camx/16),y0=Math.floor(camy/16)-1;
 for(let ty=y0;ty<=y0+Math.ceil(VH/16)+1;ty++)for(let tx=x0;tx<=x0+Math.ceil(VW/16)+1;tx++){let ch=M.g[ty]&&M.g[ty][tx];if(!ch){if(tx<0||tx>=M.w)continue;ch=M.edge||'T'}cx.drawImage(siteTile(ch,(tx*7+ty*13)%4,M.tod),tx*16-camx,ty*16-camy)}
}
// the site's light: dusk and night darken everything but the rushlight's pool, fires and lamps (engine/light.js)
function siteLightOld(M,camx,camy){
 if(M.tod==='noon'||M.tod==='day')return;
 const pools=[[G.px+8-camx,G.py+6-camy,(M.tod==='night'?52:70)+(G.site&&G.site.lit?30:0)]];
 for(let ty=0;ty<M.h;ty++)for(let tx=0;tx<M.w;tx++){const ch=M.g[ty][tx];if(ch==='f'||ch==='L')pools.push([tx*16+8-camx,ty*16+8-camy,ch==='f'?46:30])}
 StudioLight.night(cx,{dark:'#1c1814',alpha:M.tod==='night'?.86:M.tod==='overcast'?.25:.55,warm:'#d9b45a',pools});
}

// ================= THE LOOK PASS (spec 008, 8B; mockups 40-site-look-rough-v1 and 41-environment-readability-v1) =================
// Same maps and walk grid; only the drawing changes (art-style, Maps are lit and dressed; the readability rules):
//   the floor you walk on is the calm middle value; things that block sit a step darker at night or carry a hard foot line by day;
//   the rye is one quiet mass with a lit top edge and a dark lip; a lone spoil heap is one whole mound, never a dark square;
//   texture is one or two steps apart; the warmest colours belong to people, lit windows and hotspots;
//   cottages, the church tower, the pump house and the whim stand up in 3/4 with lit and shaded sides; stooks, fences, carts and a
//   tram road; noon shadows pool straight down; night keeps its dark with a cool moon lift, and windows, lamps and fires glow.
// Tiles this pass doesn't redraw keep their drawing, on the new ground.
const SH_={peat:'#1c1814',tallow:'#d9b45a'};
const sHash=(x,y)=>(((x*73856093)^(y*19349663))>>>0);
const sDay=M=>M.tod==='noon'||M.tod==='day'||M.tod==='overcast';
const SGR={noon:['#8a8a46','#a29a52','#6e7038','#5a5a30'],dusk:['#5e5a3c','#746a48','#4a4a30','#3a3826'],night:['#5e5a46','#68644e','#524e3e','#46432f'],overcast:['#6a6a4a','#7e7a56','#56583e','#44462e'],day:['#7a7a48','#92884e','#62643a','#50502e']};
function sShadow(x,y,w,k=.35){cx.fillStyle=`rgba(28,24,20,${k})`;cx.beginPath();cx.ellipse(x,y,w,Math.max(2,w*.22),0,0,7);cx.fill()}
function sGround(M,ch,tx,ty,X,Y){const g=SGR[M.tod]||SGR.dusk,h=sHash(tx,ty),n=M.tod==='noon';
 if(ch===','){sR(X,Y,16,16,n?'#9a8462':'#6e5c46');sR(X,Y+4,16,1,n?'#82704e':'#5a4a38');sR(X,Y+11,16,1,n?'#82704e':'#5a4a38');sR(X,Y+7,16,2,n?'#ae9872':'#7e6a52');
  if(h%5===0){sR(X+(h%9),Y+12,5,2,n?'#8a96a0':'#4a5664');sR(X+(h%9),Y+14,5,1,'#4a3c2e')}return}
 if(ch==='~'){sR(X,Y,16,16,'#2a3a48');sR(X+(h%10),Y+4,5,1,'#5c6c7c');sR(X+(h%7)+3,Y+11,4,1,'#3b5060');return}
 sR(X,Y,16,16,g[0]);
 for(let i=0;i<3;i++){const k=sHash(tx*7+i,ty*3+i),px=k%15,py=(k>>4)%14;sR(X+px,Y+py,1,2,g[2]);if(i===0)sR(X+px,Y+py,1,1,g[1])}
 if(h%5===0)sR(X+(h%13),Y+(h>>3)%12,2,1,g[2]);
 if(n&&h%23===0){sR(X+(h%12)+2,Y+6,1,1,'#c8402a');sR(X+(h%12)+3,Y+7,1,1,'#a83020')}
 if(h%29===0){sR(X+5,Y+9,3,2,g[3]);sR(X+5,Y+9,2,1,g[2])}}
function sRye(M,tx,ty,X,Y,t){const n=M.tod==='noon',base=n?'#b0904a':'#6a5a30',st=n?'#9a7c3c':'#5a4c2a',hd=n?'#c8a85a':'#7a6a3c';
 const up=M.g[ty-1]&&M.g[ty-1][tx],dn=M.g[ty+1]&&M.g[ty+1][tx];sR(X,Y,16,16,base);
 for(let i=0;i<4;i++){const sx=X+i*4+1+((ty+i)%2)*2,sway=Math.round(Math.sin(t*.0015+(tx*16+i*4)*.06));sR(sx,Y+6,1,9,st);sR(sx+sway,Y+3+(i%2)*2,1,3,hd)}
 sR(X,Y+8+(tx%2),16,1,st);
 if(up&&up!=='y'){sR(X,Y,16,3,n?'#d8bc6a':'#8a7a48');for(let i=0;i<16;i+=2)sR(X+i,Y-1,1,2,n?'#d8bc6a':'#8a7a48')}
 if(dn&&dn!=='y'){sR(X,Y+14,16,2,n?'#6e5a2a':'#3a3020');sR(X,Y+16,16,1,'rgba(28,24,20,.35)')}}
function sHeap(M,tx,ty,X,Y){const d=sDay(M),c=d?['#8a8070','#6a6256','#544e46','#46413a']:['#7e889c','#3a3a3c','#2c2c2e','#222224'];
 const at=(x,y)=>M.g[y]&&M.g[y][x],fl=ch=>ch&&ch!=='u'&&ch!=='T',open=[[0,1],[0,-1],[1,0],[-1,0]].filter(([a,b])=>fl(at(tx+a,ty+b))).length;
 if(open>=2){sGround(M,'.',tx,ty,X,Y);sShadow(X+8,Y+14,8,.5);
  for(let y=2;y<15;y++)for(let x=0;x<16;x++){const dx=(x-7.5)/7.5,dy=(y-14)/12,q=dx*dx+dy*dy;if(q>1)continue;sR(X+x,Y+y,1,1,q>.72&&dy<-.5&&dx<.2?c[0]:dx<-.15?c[1]:c[2])}
  sR(X+1,Y+14,14,1,'#141210');return}
 sR(X,Y,16,16,c[3]);
 if(sHash(tx*3,ty*7)%2===0){const hx=5+sHash(tx,ty)%7,hy=9+sHash(ty,tx)%4,hr=7+sHash(tx*3,ty)%4,hv=hr*.6;
  for(let y=-6;y<16;y++)for(let x=-4;x<20;x++){const dx=(x-hx)/hr,dy=(y-hy)/hv,q=dx*dx+dy*dy;if(q>1||dy>.4)continue;sR(X+x,Y+y,1,1,q>.7&&dy<0&&dx<.3?c[0]:(dx<-.1?c[1]:c[2]))}}
 if(fl(at(tx,ty+1))){sR(X,Y+13,16,2,'#141210');sR(X,Y+12,16,1,d?c[1]:'#4a4c54')}
 if(fl(at(tx,ty-1)))sR(X,Y,16,1,c[0]);if(fl(at(tx-1,ty)))sR(X,Y,1,16,'#141210');if(fl(at(tx+1,ty)))sR(X+15,Y,1,16,'#141210')}
function sCottage(M,X,Y,w,o){const nit=!sDay(M),wall=o.timber?(nit?['#4a3a2c','#3a2e22','#2a2018']:['#7a5a3e','#5a3e2b','#3e2a1c']):nit?['#6a6252','#544e42','#3e3a32']:['#d8cba6','#b8ab8c','#968a6e'],hgt=o.hgt||18,dx=o.door!=null?o.door:6;
 sShadow(X+w/2+(M.tod==='noon'?0:6),Y+1,w*.55,.4);
 sR(X,Y-hgt,w,hgt,wall[1]);sR(X,Y-hgt,3,hgt,wall[0]);sR(X+w-4,Y-hgt,4,hgt,wall[2]);
 for(let i=0;i<w;i+=7)sR(X+i,Y-hgt,1,hgt,nit?'#3a3028':'#6a5038');sR(X,Y-9,w,1,nit?'#3a3028':'#6a5038');
 if(dx>=0){sR(X+dx,Y-11,6,11,'#2a1e16');sR(X+dx,Y-11,6,1,'#5a3e2b');sR(X+dx+1,Y-10,1,10,'#3e2a1c')}
 const wx=X+w-14;if(o.timber)for(let i=0;i<w;i+=4)sR(X+i,Y-hgt,1,hgt,nit?'#2a2018':'#4a3424');sR(wx,Y-15,6,5,o.lit?'#e8b85a':'#2a2420');sR(wx+2,Y-15,1,5,'#3e2a1c');sR(wx,Y-10,6,1,wall[2]);
 const ry=Y-hgt,rh=15,th=o.slate?(nit?['#4a4a56','#3a3a44','#2a2a32']:['#7a7a88','#5a5a68','#44444e']):(nit?['#6a5a30','#544624','#3e341c']:['#c8a552','#a8873e','#7e6430']);
 for(let y=0;y<rh;y++){const ins=Math.round(y*.2);sR(X-2+ins,ry-y,w+4-ins*2,1,y<3?th[2]:y>rh-4?th[0]:th[1]);
  if(!o.slate){for(let i=0;i<w;i+=3)if(sHash(i,y)%3===0)sR(X-2+ins+i,ry-y,1,1,th[2])}else if(y%3===0)sR(X,ry-y,w,1,th[2])}
 sR(X-2,ry,w+4,1,SH_.peat);sR(X,ry+1,w,2,'rgba(28,24,20,.45)');
 sR(X+w-9,ry-rh-4,4,8,nit?'#4a3e34':'#8a7058');sR(X+w-9,ry-rh-4,4,1,'#3a3028');
 if(o.smoke)for(let i=0;i<5;i++){const t=performance.now()*.001+i;sR(X+w-8+Math.sin(t)*2+i,ry-rh-8-i*4,3,2,`rgba(${nit?'120,120,130':'200,196,186'},${.5-i*.08})`)}}
function sChurch(M,X,Y){const s=sDay(M)?['#a49c8c','#8a8274','#6a6458']:['#5a564e','#4a4640','#36332e'];
 sShadow(X+12,Y+1,14,.4);sR(X-4,Y-44,24,44,s[1]);sR(X-4,Y-44,4,44,s[0]);sR(X+16,Y-44,4,44,s[2]);
 for(let y=Y-40;y<Y;y+=6)for(let x=X-4+((y/6)%2)*3;x<X+20;x+=6)sR(x,y,1,1,s[2]);
 sR(X+4,Y-34,6,8,SH_.peat);sR(X+4,Y-34,6,1,s[0]);sR(X+6,Y-32,2,4,'#6a4a2c');
 for(let y=0;y<10;y++)sR(X-6+y,Y-44-y,28-y*2,1,y<2?'#2a2a32':sDay(M)?'#5a5a68':'#33333c');
 sR(X+2,Y-12,8,12,'#2a1e16');sR(X+2,Y-13,8,1,s[0])}
function sStook(M,X,Y){const c=sDay(M)?['#e8cc7a','#c8a552','#8a6c2e']:['#8a7a48','#6a5a30','#3e341c'];sShadow(X+8,Y+1,7,.45);
 for(let y=0;y<15;y++){const w=2+Math.round(y*.45);sR(X+8-w,Y-15+y,w*2,1,c[1]);sR(X+8-w,Y-15+y,2,1,c[0]);sR(X+8+w-2,Y-15+y,2,1,c[2])}
 sR(X+4,Y-7,8,1,c[2]);sR(X+7,Y-17,2,3,c[0])}
function sPump(M,X,Y){const s=['#4a4640','#3a3632','#2c2a26'];sShadow(X+16,Y+1,18,.5);
 sR(X,Y-22,32,22,s[1]);sR(X,Y-22,4,22,s[0]);sR(X+28,Y-22,4,22,s[2]);for(let y=Y-20;y<Y;y+=5)sR(X,y,32,1,s[2]);
 sR(X+8,Y-14,8,14,'#1a1614');sR(X+20,Y-16,6,5,'#e8b85a');sR(X+22,Y-16,1,5,'#3a2a1c');
 for(let y=0;y<12;y++)sR(X-3+y*.3,Y-22-y,38-y*.6,1,y<2?'#1e1e24':'#33333c');sR(X-3,Y-22,38,1,SH_.peat);
 sR(X+33,Y-30,3,30,'#4a3424');sR(X+22,Y-31,20,3,'#5a3e2b');sR(X+22,Y-31,20,1,'#7a5a3e');sR(X+40,Y-28,1,14,'#6a6a6a')}
function sWhim(M,X,Y){sShadow(X+8,Y+1,14,.45);sR(X+1,Y-26,2,26,'#4a3424');sR(X+13,Y-26,2,26,'#3a2a1c');sR(X-2,Y-28,20,3,'#5a3e2b');sR(X-2,Y-28,20,1,'#7a5a3e');
 sR(X+4,Y-14,8,6,'#3e2a1c');sR(X+4,Y-14,8,1,'#6a4a2c');sR(X-6,Y-11,28,1,'#5a3e2b');sR(X+7,Y-25,1,11,'#7a7a7a')}
function sLamp(M,X,Y){sShadow(X+8,Y+1,4,.4);sR(X+7,Y-18,2,18,'#3a2a1c');sR(X+4,Y-18,8,1,'#3a2a1c');sR(X+4,Y-17,3,5,'#ffe0a0');sR(X+4,Y-17,3,1,'#9a7428')}
function sCart(M,X,Y){sShadow(X+12,Y+1,12,.45);sR(X,Y-10,22,6,'#4a3424');sR(X,Y-10,22,1,'#6a4a2c');sR(X+1,Y-13,20,3,'#2a2620');sR(X+2,Y-14,6,2,'#3a3834');
 for(const wx of [3,15]){sR(X+wx,Y-5,5,5,'#2a1e16');sR(X+wx+2,Y-3,1,1,'#7a5a3e')}}
function sFence(M,X,Y){const c=sDay(M)?['#8a6a48','#5a3e2b']:['#4a3a2c','#2e241c'];sR(X,Y-7,16,1,c[0]);sR(X,Y-4,16,1,c[1]);sR(X+2,Y-9,2,9,c[0]);sR(X+3,Y-9,1,9,c[1])}
// small dressing so no stretch of floor sits bare: by day a lying sheaf, a rake, a dropped hat; by night coal lumps, an ore tub, a puddle with the moon in it
function sBits(M,X,Y,k){if(M.edge!=='u'&&!(M.tod==='noon')){ // the woods, the marsh, the villages: a stone, fallen leaves, a dry tuft
  if(k===0){sShadow(X+8,Y+12,4,.35);sR(X+5,Y+9,6,3,'#6a665c');sR(X+5,Y+9,4,1,'#8a8478');sR(X+5,Y+12,6,1,'#2a2622')}
  else if(k===1){[[3,9],[8,11],[11,8]].forEach(([a,b],i)=>sR(X+a,Y+b,2,1,i%2?'#7a4422':'#8a5a2a'))}
  else{for(let i=0;i<4;i++)sR(X+5+i*2,Y+8+(i%2),1,4,'#6a6440');sR(X+4,Y+12,9,1,'rgba(20,18,14,.3)')}return}
 if(sDay(M)){if(k===0){sShadow(X+8,Y+12,6,.35);sR(X+3,Y+9,10,3,'#8a7a4a');sR(X+3,Y+9,10,1,'#9e8c58');sR(X+7,Y+9,1,3,'#5e5030')}
  else if(k===1){sR(X+2,Y+11,12,1,'#8a6a48');for(let i=0;i<4;i++)sR(X+2+i*2,Y+9,1,2,'#6a5038')}
  else{sShadow(X+8,Y+12,5,.35);sR(X+4,Y+9,8,2,'#7a6a4a');sR(X+6,Y+7,4,2,'#8a7a56');sR(X+4,Y+10,8,1,'#4e4230')}}
 else{if(k===0){for(let i=0;i<4;i++)sR(X+3+i*3,Y+9+(i%2),2,2,i%2?'#2a2826':'#4a4844')}
  else if(k===1){sShadow(X+8,Y+13,6,.4);sR(X+3,Y+6,10,6,'#4a4038');sR(X+3,Y+6,10,1,'#6a6258');sR(X+4,Y+12,2,1,'#2a2622');sR(X+10,Y+12,2,1,'#2a2622')}
  else{sR(X+2,Y+9,12,3,'#2a3446');sR(X+4,Y+10,3,1,'#5c6c84')}}}
// woods: one canopy mass (readability rules), crowns lit from the upper left, crowns breaking the top edge, trunks and a dark lip
// where the wood ends on the floor; quiet inside
function sWoodPal(M){return {noon:['#5e6c36','#4a5a2c','#384422','#7e8c4a'],day:['#56643a','#44522e','#344022','#74824c'],overcast:['#4e5a3a','#3e4a2e','#303a24','#66724c'],dusk:['#3e4a2c','#323c24','#262e1c','#56603a'],night:['#344038','#2a342e','#202824','#4a5650']}[M.tod]||['#3e4a2c','#323c24','#262e1c','#56603a']}
function sCrown(X,Y,r,c){for(let y=-r;y<=r;y++)for(let x=-r;x<=r;x++){const q=(x*x+y*y)/(r*r);if(q>1)continue;sR(X+x,Y+y,1,1,(x+y)<-r*.5&&q>.3?c[3]:(x+y)>r*.6&&q>.4?c[2]:c[0])}}
function sWood(M,tx,ty,X,Y){const c=sWoodPal(M),at=(x,y)=>M.g[y]&&M.g[y][x],isT=ch=>!ch||ch==='T';sR(X,Y,16,16,c[1]);
 const h=sHash(tx,ty),top=!isT(at(tx,ty-1))&&ty>0;
 sCrown(X+4+h%4,Y+5+(h>>4)%3,top?6:5,c);sCrown(X+11-(h>>6)%3,Y+10+(h>>8)%3,5,c);if(h%3===0)sCrown(X+8,Y+3,4,c);
 for(let i=0;i<4;i++){const k=sHash(tx*5+i,ty*3),px=k%15,py=(k>>5)%15;sR(X+px,Y+py,1,1,c[2])}}
function sWoodEdge(M,tx,ty,X,Y){const c=sWoodPal(M),at=(x,y)=>M.g[y]&&M.g[y][x];const dn=at(tx,ty+1);if(!dn||dn==='T')return;
 const h=sHash(tx,ty);sR(X,Y+15,16,2,'rgba(20,18,14,.45)');sR(X+3+h%5,Y+12,2,5,'#3e2a1c');if(h%2)sR(X+11,Y+13,2,4,'#3e2a1c');sCrown(X+5+h%5,Y+9,5,c);sCrown(X+12,Y+11,4,c)}
// a building of hut wall tiles (H, with its door D): stands up in 3/4 from its bottom row, timber walls, a thatch roof
function sHutBlock(M,tx,ty,X,Y){const at=(x,y)=>M.g[y]&&M.g[y][x],hd=ch=>ch==='H'||ch==='D';let w=0;while(hd(at(tx+w,ty)))w++;let h=0;while(hd(at(tx,ty+h)))h++;
 let door=-1;for(let i=0;i<w;i++)if(at(tx+i,ty+h-1)==='D')door=i*16+5;
 return [Y+h*16,()=>sCottage(M,X,Y+h*16,w*16,{hgt:h*16-6,timber:true,door,lit:!sDay(M)&&door>=0,smoke:true})]}
const S_KEEP=new Set(['W','b','q','S','l','O']);           // solid tiles: their own drawing whole
const S_OBJ=new Set(['w','f','r','g','x']);
// the osier beds: flooded ground of cut stools, each sprouting red withies, lit on the left; quiet between, a dark lip at the edge
function sOsier(M,tx,ty,X,Y){const n=!sDay(M),at=(x,y)=>M.g[y]&&M.g[y][x],is=ch=>!ch||ch==='o',h=sHash(tx,ty);
 const open=[[0,1],[0,-1],[1,0],[-1,0]].filter(([a,b])=>!is(at(tx+a,ty+b))).length;
 if(open>=2){sGround(M,'.',tx,ty,X,Y);sShadow(X+8,Y+13,7,.4)}else{sR(X,Y,16,16,n?'#2c3438':'#4a5244');sR(X+(h%9),Y+(h>>4)%12,5,1,n?'#3a4650':'#5c6a6a')}
 const stool=(x,y)=>{sR(x-2,y,5,2,n?'#2a2018':'#4a3424');sR(x-2,y,2,1,n?'#3e2e22':'#6a4a2c');
  for(let r=0;r<5;r++){const len=5+(sHash(x+r,y)%4);for(let k=0;k<len;k++)sR(x-2+r+(k>3&&r%2?1:0)*(r<2?-1:1),y-1-k,1,1,k>len-2?(n?'#7a3a2e':'#c86a4a'):r<2?(n?'#6a2e22':'#b8584a'):(n?'#4e2218':'#8a3a2a'))}};
 stool(X+4+h%4,Y+11);stool(X+11+(h>>5)%3,Y+6+(h>>7)%3);
 if(open<2&&!is(at(tx,ty+1))){sR(X,Y+15,16,1,'#141210')}}
// Crookback's burnt ruin: one charred mass, blackened stones with a lit top, a fallen beam, ash between; quiet inside
function sRuin(M,tx,ty,X,Y){const at=(x,y)=>M.g[y]&&M.g[y][x],is=ch=>!ch||ch==='a',h=sHash(tx,ty),d=sDay(M);
 sR(X,Y,16,16,d?'#4a443c':'#2e2a26');for(let i=0;i<3;i++){const k=sHash(tx*5+i,ty*7),px=k%14,py=(k>>5)%13;sR(X+px,Y+py,2,1,d?'#5a544a':'#3a3630')}
 const stone=(x,y,w)=>{sR(x,y,w,4,d?'#6a645a':'#3e3a34');sR(x,y,w,1,d?'#8a8478':'#56524a');sR(x,y+4,w,1,'#1c1814')};
 if(h%3===0)stone(X+2+h%6,Y+3+(h>>4)%6,5+h%3);if(h%4===1){sR(X+1,Y+9,13,2,d?'#3a2a1e':'#24180e');sR(X+1,Y+9,13,1,d?'#5a4030':'#3a2a1e')}
 if(!is(at(tx,ty-1))&&ty>0){sR(X,Y,16,1,d?'#7a7468':'#4a4640')}if(!is(at(tx,ty+1))){sR(X,Y+14,16,2,'#141210')}}
// a charcoal clamp: one whole earth mound with a lit crest, a smouldering seam at dusk and night, smoke drifting off it
function sClamp(M,X,Y){const d=sDay(M),c=d?['#7a6a58','#5a4e42','#463c32']:['#5a5450','#3a3430','#2a2622'];sShadow(X+8,Y+14,8,.5);
 for(let y=3;y<15;y++)for(let x=0;x<16;x++){const dx=(x-7.5)/7.5,dy=(y-14)/11,q=dx*dx+dy*dy;if(q>1)continue;sR(X+x,Y+y,1,1,q>.7&&dy<-.5&&dx<.2?c[0]:dx<-.1?c[1]:c[2])}
 if(!d){sR(X+4,Y+11,3,1,'#c8603a');sR(X+10,Y+9,2,1,'#9a4528')}
 const t=performance.now()*.001;for(let i=0;i<4;i++)sR(X+7+Math.sin(t+i)*2+i,Y+1-i*4,3,2,`rgba(${d?'190,186,176':'120,118,124'},${.45-i*.1})`)}         // objects that stood on their own ground: now on the new ground
function drawSiteTiles(M,camx,camy){
 const t=performance.now(),x0=Math.floor(camx/16),y0=Math.floor(camy/16)-1,objs=[],at=(x,y)=>M.g[y]&&M.g[y][x];
 for(let ty=y0;ty<=y0+Math.ceil(VH/16)+2;ty++)for(let tx=x0;tx<=x0+Math.ceil(VW/16)+1;tx++){
  let ch=at(tx,ty);if(!ch){if(tx<0||tx>=M.w)continue;ch=M.edge||'T'}
  const X=tx*16-camx,Y=ty*16-camy,v=(tx*7+ty*13)%4;
  if(S_KEEP.has(ch)){cx.drawImage(siteTile(ch,v,M.tod),X,Y);continue}
  if(ch==='y')sRye(M,tx,ty,X,Y,t);else if(ch==='u')sHeap(M,tx,ty,X,Y);else if(ch==='~'||ch===',')sGround(M,ch,tx,ty,X,Y);else if(ch!=='T'&&ch!=='o'&&ch!=='a')sGround(M,'.',tx,ty,X,Y);
  if(ch==='T'){sWood(M,tx,ty,X,Y);objs.push([Y+16,()=>sWoodEdge(M,tx,ty,X,Y)])}
  if(ch==='o')sOsier(M,tx,ty,X,Y);if(ch==='a')sRuin(M,tx,ty,X,Y);
  if(S_OBJ.has(ch))cx.drawImage(siteTile(ch,v,M.tod,true),X,Y);
  if(ch==='c')objs.push([Y+15,()=>sClamp(M,X,Y)]);
  if((ch==='H'||ch==='D')&&!'HD'.includes(at(tx-1,ty)||'.')&&!'HD'.includes(at(tx,ty-1)||'.'))objs.push(sHutBlock(M,tx,ty,X,Y));
  if(ch==='h'&&at(tx-1,ty)!=='h'){let w=1;while(at(tx+w,ty)==='h')w++;objs.push([Y+16,()=>sCottage(M,X,Y+16,w*16,{lit:!sDay(M)&&(tx+ty)%2===0,smoke:(tx*3+ty)%2===0,slate:M.edge==='u'})])}
  if(ch==='k'&&at(tx,ty+1)!=='k')objs.push([Y+16,()=>sChurch(M,X,Y+16)]);
  if(ch==='s')objs.push([Y+15,()=>sStook(M,X,Y+15)]);
  if(ch==='p'&&at(tx-1,ty)!=='p'&&at(tx,ty+1)!=='p')objs.push([Y+16,()=>sPump(M,X,Y+16)]);
  if(ch==='m')objs.push([Y+16,()=>sWhim(M,X,Y+16)]);
  if(ch==='L')objs.push([Y+16,()=>sLamp(M,X,Y+16)]);
  if(ch==='.'&&at(tx,ty+1)===','&&M.tod==='noon'&&(tx%5)!==2)objs.push([Y+16,()=>sFence(M,X,Y+16)]);
  if(ch==='.'&&M.edge==='u'&&sHash(tx,ty)%11===0)objs.push([Y+15,()=>sCart(M,X,Y+15)]);
  if(ch==='.'&&at(tx,ty+1)!==','&&at(tx,ty-1)!==','&&sHash(tx*3,ty*5)%6===0){const k=sHash(tx,ty*7)%3;objs.push([Y+12,()=>sBits(M,X,Y,k)])}
 }
 // a tram road along the pit's lane
 if(M.edge==='u'){const ry=M.g.findIndex(r=>r[0]===','&&r[1]===',');if(ry>=0){const Y=ry*16-camy;for(let tx=x0;tx<=x0+Math.ceil(VW/16)+1;tx++){sR(tx*16-camx,Y+5,16,1,'#5a5650');sR(tx*16-camx,Y+10,16,1,'#5a5650');for(let i=0;i<16;i+=4)sR(tx*16-camx+i,Y+4,2,8,'#3a2a1c')}}}
 objs.sort((a,b)=>a[0]-b[0]).forEach(o=>o[1]());
 // crows over the rye at noon, drifting
 if(M.tod==='noon')for(let i=0;i<3;i++){const bx=((t*.02+i*90)%(VW+40))-20,by=70+i*9+Math.sin(t*.003+i)*3;sR(bx,by,5,1,SH_.peat);sR(bx+1,by-1,1,1,SH_.peat);sR(bx+3,by-1,1,1,SH_.peat)}
 // every person stands on a firm contact shadow (straight down at noon)
 sShadow(G.px+8-camx,G.py+15-camy,7,.6);
 (M.npcs||[]).forEach(n=>{if(!n.on||n.on())sShadow(n.x*16+8-camx,n.y*16+15-camy,7,.55)});
}
// the light: noon a hot white-gold grade; dusk and night keep their dark with a cool moon lift; windows, lamps and fires glow;
// at night the hotspots draw again on top of the dark so they keep their glow
function siteLight(M,camx,camy){
 if(M.tod==='noon'){cx.fillStyle='rgba(255,236,180,.10)';cx.fillRect(0,0,VW,VH);const g=cx.createLinearGradient(0,0,0,VH);g.addColorStop(0,'rgba(255,250,230,.12)');g.addColorStop(1,'rgba(255,250,230,0)');cx.fillStyle=g;cx.fillRect(0,0,VW,VH);return}
 if(M.tod==='day'||M.tod==='overcast')return siteLightOld(M,camx,camy);
 const pools=[[G.px+8-camx,G.py+6-camy,(M.tod==='night'?56:72)+(G.site&&G.site.lit?30:0)]];
 for(let ty=0;ty<M.h;ty++)for(let tx=0;tx<M.w;tx++){const ch=M.g[ty][tx],X=tx*16+8-camx,Y=ty*16+8-camy;
  if(ch==='f'||ch==='L')pools.push([X,Y-(ch==='L'?12:0),ch==='f'?46:34]);
  if(ch==='h'&&M.g[ty][tx+1]==='h'&&(tx+ty)%2===0)pools.push([X+14,Y-4,20]);
  if(ch==='p'&&M.g[ty][tx+1]==='p'&&M.g[ty+1]&&M.g[ty+1][tx]==='p')pools.push([X+15,Y+4,26])}
 StudioLight.night(cx,{dark:'#141826',alpha:M.tod==='night'?.66:.45,warm:'#d9b45a',pools});
 cx.fillStyle='rgba(120,140,190,.06)';cx.fillRect(0,0,VW,VH);
 if(G.run&&G.run.job&&M.hot)hotDiamonds(M,camx,camy,G.run.job);
}
// hotspots: a Tallow diamond with a Peat outline and a slow bob; Ash once used; a glow when the lead is next to it
function hotDiamonds(M,camx,camy,job){const t=performance.now();
 M.hot.forEach(h=>{if(h.when&&!h.when(job))return;const used=job.used[h.id]==='done',x=h.x*16+8-camx,y=h.y*16+3-camy+(used?0:Math.round(Math.sin(t*.004)*1.5)),
  near=Math.abs(G.x-h.x)+Math.abs(G.y-h.y)<=1,s=near&&!used?4:3,col=used?SA.ash:SA.tallow;
  if(near&&!used){cx.fillStyle='rgba(217,180,90,.25)';cx.beginPath();cx.arc(x,y,9,0,7);cx.fill()}
  const dia=(s,c)=>{for(let k=0;k<=s;k++)sR(x-k,y-s+k,2*k+1,1,c);for(let k=s-1;k>=0;k--)sR(x-k,y+s-k,2*k+1,1,c)};
  dia(s+1,SA.peat);dia(s,col);if(!used)sR(x-1,y-s+1,1,1,'#fff0c8')})}
