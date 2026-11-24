// Rushlight · region.js
// Slice part B (spec 004): the Withy March on the region map, travel, food, camp and inn, and road events.
//   The region map screen (Art, Region map; Mockup 3 rework and Mockup 5 C): the two-row top strip, the chart with its
//   glyphs, roads, day ticks, pencil ?, inset and edge tabs, the cursor (StudioNearest) and the road card, the coin token,
//   L for the Key, R for Contracts, Start for the map menu, Select for the lead.
//   Travel: route travel along known roads by fewest days; the road card plays itself a day at a time (forage, road
//   event, camp), stopping only for a choice; eating, Who eats, Hungry and Starving; the larder of 15; meat that rots.
//   Camp and inn; the night roll; road events and roamers met on the road.
// Loaded after battle.js and party-menu.js as a plain script; shares their state and drawing helpers.
const P_=MARCH.points,RD=MARCH.roads;
const RW={key:'L KEY',contracts:'R CONTRACTS',noContracts:'No contracts taken.',signs:'SIGNS',noSigns:'None found yet.',
 lost:'The larder is full. {n} lost.',rot:'{n} meat rotted.',cooked:'{n} meat cooked into rations.',hungry:'Hungry',starving:'Starving'};
const LARDER=15;
const rnd=n=>StudioRoll.die(n)-1;            // dice stream (saved), 0..n-1
const d100=()=>StudioRoll.d100();
const RG=()=>G.run.region;
const alive=()=>party.filter(m=>!m.dead);
const fill=(s,o)=>String(s).replace(/\{(\w+)\}/g,(m,k)=>o[k]!=null?o[k]:m);

// ================= THE REGION FROM THE SEED =================
// The world stream (spec 003) decides the hidden road and where each roamer walks. The slice is always autumn,
// and the March's regional tic is RT-SET-1, fixed to the Withy March (dev-notes, spec 004).
function makeRegion(run){
 const W=StudioSeed.load(run.streams.world),pick=a=>a[Math.floor(W.next()*a.length)];
 const hidden=pick(['ok','sh']);
 const cat=pick(ROAMER_ROADS.cat),rooks=pick(ROAMER_ROADS.rooks.filter(r=>r!==cat));
 const candle=pick(ROAMER_ROADS.candle),lamp=pick(ROAMER_ROADS.lamp);
 const species=RLSP.ORDER[Math.floor(W.next()*6)];
 run.streams.world=W.save();
 return {at:'harrow',known:Object.keys(P_).filter(k=>P_[k].start),roads:['he','hh'],hidden,hiddenFound:false,
  roam:{cat:{road:cat,met:0,dead:0},rooks:{road:rooks,met:0,dead:0},candle:{road:candle,met:0,dead:0},lamp:{road:lamp,met:0,dead:0}},
  signs:[],meat:[],innSan:{},trip:null,tic:'RT-SET-1',species,density:0,cur:'harrow'};
}
const knownPt=k=>RG().known.includes(k);
const knownRoad=r=>RG().roads.includes(r);
const otherEnd=(r,k)=>RD[r][0]===k?RD[r][1]:RD[r][0];
const denFound=()=>RG().signs.length>=3;
// a road can be shown once one end is known; the seed's hidden road waits to be found; den roads wait for 3 signs
function roadShowable(r){const R=RD[r];if(R[3]==='den')return denFound();if(P_[R[1]].kind==='lie')return !!(G.run.rumors&&G.run.rumors.lies[R[1]]);if(r===RG().hidden&&!RG().hiddenFound)return false;return true}
// Arriving at a point shows every road leaving it, with a ? at far ends not yet known (scouting)
function scout(k){const g=RG();if(!g.known.includes(k))g.known.push(k);Object.keys(RD).forEach(r=>{if((RD[r][0]===k||RD[r][1]===k)&&roadShowable(r)&&!g.roads.includes(r))g.roads.push(r)})}
function revealRoad(r){const g=RG();if(!g.roads.includes(r))g.roads.push(r)}
function findHidden(){const g=RG();g.hiddenFound=true;if(RD[g.hidden].some(knownPt))revealRoad(g.hidden)}
function addSign(id){const g=RG();if(g.signs.includes(id))return false;g.signs.push(id);if(denFound()){['cp','sp'].forEach(r=>{if(RD[r].some(knownPt))revealRoad(r)})}return true}
const roadDays=r=>RD[r][2]+(G.dev&&G.dev.winter?1:0);
// Route travel: fewest days along known roads (Dijkstra over 8 points)
function route(from,to){const dist={},prev={},Q=new Set(Object.keys(P_));Object.keys(P_).forEach(k=>dist[k]=Infinity);dist[from]=0;
 while(Q.size){let u=null;Q.forEach(k=>{if(u===null||dist[k]<dist[u])u=k});Q.delete(u);if(dist[u]===Infinity)break;
  RG().roads.forEach(r=>{if(RD[r][0]!==u&&RD[r][1]!==u)return;const v=otherEnd(r,u),d=dist[u]+roadDays(r);if(d<dist[v]){dist[v]=d;prev[v]=[u,r]}})}
 if(dist[to]===Infinity)return null;const legs=[];let k=to;while(k!==from){legs.unshift({road:prev[k][1],to:k});k=prev[k][0]}return {days:dist[to],legs}}
const rationsNeed=days=>days*alive().length;

// ================= THE MAP SCREEN =================
let MAPV={cur:'harrow',key:false,page:null,log:[],cam:null};
function enterRegion(){G.mode='region';gEl.classList.remove('site','town');gEl.classList.add('region');const g=RG();MAPV={cur:g.at,key:false,page:null,log:[],cam:null};scout(g.at);applySan();saveRun()}
// ---- the region map's look (spec 008, 8B; mockup 43-map-look-rough-v1, "Looks good"). Same chart data (content/march.js). ----
// The chart is aged parchment (a lit middle, stained edges, foxing, low-contrast fibres); the river inked with a blue-grey wash;
// woods as clumps of inked trees lit from the upper left; fields hatched with an ochre wash; reed beds as ink tufts; hachured hills;
// a compass rose. Roads in ink: main roads a double line with a pale bed, side roads dashed, den roads Blood, a cross stroke per day,
// the route being picked in Tallow dots with an ink edge. Each place a little picture with its name on a pale ribbon.
const SH=64;   // the HUD cards and the faction line
function chartRect(){return {x:0,y:SH,w:VW,h:VH-SH-54}}
function camFor(k){const r=chartRect(),p=P_[k];return [clamp(p.x-r.w/2,0,MARCH.w-r.w),clamp(p.y-r.h/2,0,MARCH.h-r.h)]}
function drawRegion(){
 const r=chartRect(),g=RG();const want=camFor(MAPV.cur);if(!MAPV.cam)MAPV.cam=want.slice();MAPV.cam[0]+=(want[0]-MAPV.cam[0])*.2;MAPV.cam[1]+=(want[1]-MAPV.cam[1])*.2;
 const ox=Math.round(r.x-MAPV.cam[0]),oy=Math.round(r.y-MAPV.cam[1]);
 pR(0,0,VW,VH,'#1c1814');
 cx.save();cx.beginPath();cx.rect(r.x,r.y,r.w,r.h);cx.clip();drawChart(ox,oy);cx.restore();
 drawStrip();drawInset(r);
 // a name the inset covers is drawn again on top of it, so no name is ever cut
 const ins={x:r.x+r.w-51,y:r.y+3,w:48,h:42};(MAPV.ribs||[]).forEach(([t,x,y,big,w])=>{if(x+w/2>ins.x&&x-w/2<ins.x+ins.w&&y+13>ins.y&&y<ins.y+ins.h)ribbon(t,x,y,big)});
 drawTabs(r,ox,oy);drawRoadCard();
 if(MAPV.key)drawKey();if(MAPV.page==='contracts')drawContracts();
}
const PARCH='#d6c6a0',PARCHD='#b8aa86',INK='#3a2c20',INKL='#5a4632',RIB='rgba(242,234,214,.85)';
let chartSheet=null;
function bakeChart(){
 const c=document.createElement('canvas');c.width=MARCH.w;c.height=MARCH.h;const x=c.getContext('2d'),W=MARCH.w,Hh=MARCH.h,H=(a,b)=>(((a*73856093)^(b*19349663))>>>0);
 const r=(a,b,w,h,col)=>{x.fillStyle=col;x.fillRect(Math.round(a),Math.round(b),w,h)};
 r(0,0,W,Hh,PARCH);
 let g=x.createRadialGradient(W*.4,Hh*.4,10,W*.4,Hh*.4,W*.7);g.addColorStop(0,'rgba(255,248,222,.55)');g.addColorStop(1,'rgba(255,248,222,0)');x.fillStyle=g;x.fillRect(0,0,W,Hh);
 g=x.createRadialGradient(W/2,Hh/2,Math.min(W,Hh)*.35,W/2,Hh/2,W*.72);g.addColorStop(0,'rgba(120,84,40,0)');g.addColorStop(1,'rgba(120,84,40,.45)');x.fillStyle=g;x.fillRect(0,0,W,Hh);
 for(const [fx,fy,fr] of [[60,300,14],[380,80,10],[260,40,7],[30,30,9]]){const f=x.createRadialGradient(fx,fy,1,fx,fy,fr);f.addColorStop(0,'rgba(140,96,48,.28)');f.addColorStop(1,'rgba(140,96,48,0)');x.fillStyle=f;x.fillRect(fx-fr,fy-fr,fr*2,fr*2)}
 for(let i=0;i<900;i++){const k=H(i,7),a=k%W,b=(k>>9)%Hh;r(a,b,1+(k>>20)%3,1,(k>>3)%2?'rgba(150,118,74,.22)':'rgba(255,248,225,.35)')}
 const hill=(hx,hy,w)=>{for(let i=0;i<w;i+=2){const h0=Math.round(Math.sin(i/w*Math.PI)*7);r(hx+i,hy-h0,1,1,INKL);if(i%4===0&&i<w/2)r(hx+i,hy-h0+1,1,3,'rgba(90,70,50,.55)')}};
 [[280,330,26],[330,296,22],[350,340,30],[300,352,18],[392,260,24],[20,250,26],[12,300,22]].forEach(a=>hill(...a));
 const riv=(w,col)=>{x.strokeStyle=col;x.lineWidth=w;x.lineJoin=x.lineCap='round';x.beginPath();MARCH.river.forEach(([a,b],i)=>i?x.lineTo(a,b):x.moveTo(a,b));x.stroke()};
 riv(9,INKL);riv(7,'#9aa8ae');riv(3,'#b4c0c2');
 for(let i=0;i<MARCH.river.length-1;i++){const [a,b]=MARCH.river[i],[c2,d]=MARCH.river[i+1];for(let t=.25;t<1;t+=.35)r(a+(c2-a)*t-1,b+(d-b)*t,3,1,'#7c8c98')}
 MARCH.fields.forEach(([a,b])=>{r(a-2,b-2,30,16,'rgba(200,165,82,.35)');for(let k=0;k<5;k++)r(a,b+k*3,26,1,k%2?'#a8873e':'#8a6c2e');for(let k=0;k<30;k+=3)r(a-2+k,b+14,2,1,INKL)});
 MARCH.beds.forEach(([a,b])=>{for(let k=0;k<7;k++){const tx=a+k*4,ty=b+(k%2)*3;r(tx,ty,1,5,'#5a6a3a');r(tx-1,ty+1,1,2,'#5a6a3a');r(tx+1,ty+2,1,2,'#5a6a3a');r(tx-1,ty+5,4,1,INKL)}});
 MARCH.woods.forEach(([a,b])=>{[[0,0],[9,3],[3,9],[12,-4],[15,7]].forEach(([dx,dy])=>{const tx=a+dx,ty=b+dy;r(tx+1,ty+9,7,1,'rgba(58,44,32,.35)');r(tx+3,ty+6,2,3,INK);
  for(let yy=0;yy<7;yy++)for(let xx=0;xx<8;xx++){const q=((xx-3.5)/4)**2+((yy-3)/3.6)**2;if(q>1)continue;r(tx+xx,ty+yy,1,1,q>.7?INK:xx+yy<6?'#7a8a4a':'#56623a')}})});
 const cx0=26,cy0=Hh-30;x.strokeStyle=INKL;x.lineWidth=1;x.beginPath();x.arc(cx0,cy0,11,0,7);x.stroke();
 x.fillStyle=INK;x.beginPath();x.moveTo(cx0,cy0-16);x.lineTo(cx0+3,cy0);x.lineTo(cx0,cy0+16);x.lineTo(cx0-3,cy0);x.fill();
 x.beginPath();x.moveTo(cx0-16,cy0);x.lineTo(cx0,cy0-3);x.lineTo(cx0+16,cy0);x.lineTo(cx0,cy0+3);x.fill();
 x.font='8px "Press Start 2P"';x.fillStyle=INK;x.textBaseline='top';x.fillText('N',cx0-3,cy0-27);
 chartSheet=c;
}
function drawChart(ox,oy){
 const g=RG();if(!chartSheet)bakeChart();cx.drawImage(chartSheet,ox,oy);MAPV.ribs=[];
 const rt=MAPV.cur!==g.at&&knownPt(MAPV.cur)?route(g.at,MAPV.cur):null,onRoute=new Set(rt?rt.legs.map(l=>l.road):[]);
 Object.keys(RD).forEach(id=>{if(!knownRoad(id))return;const R=RD[id],pts=[[P_[R[0]].x,P_[R[0]].y],...R[4],[P_[R[1]].x,P_[R[1]].y]];
  const path=()=>{cx.beginPath();pts.forEach(([x,y],i)=>i?cx.lineTo(ox+x,oy+y):cx.moveTo(ox+x,oy+y))};cx.lineJoin=cx.lineCap='round';
  if(R[3]==='main'){path();cx.strokeStyle=INK;cx.lineWidth=4;cx.stroke();path();cx.strokeStyle='#e8dcc0';cx.lineWidth=2;cx.stroke()}
  else{path();cx.strokeStyle=R[3]==='den'?'#5e1a18':INK;cx.lineWidth=1.5;cx.setLineDash([4,3]);cx.stroke();cx.setLineDash([])}
  // one short cross stroke for each day of road
  const n=roadDays(id);for(let d=1;d<=n;d++){const [x,y]=along(pts,d/(n+1)),[x2,y2]=along(pts,Math.min(1,d/(n+1)+.02)),a=Math.atan2(y2-y,x2-x)+Math.PI/2;
   cx.strokeStyle=INK;cx.lineWidth=1.5;cx.beginPath();cx.moveTo(ox+x-Math.cos(a)*4,oy+y-Math.sin(a)*4);cx.lineTo(ox+x+Math.cos(a)*4,oy+y+Math.sin(a)*4);cx.stroke()}
  if(onRoute.has(id)){const t=performance.now()/120;for(let q=0;q<14;q++){const [x,y]=along(pts,((q+t)%14)/14);pR(ox+x-2,oy+y-2,4,4,INK);pR(ox+x-1,oy+y-1,2,2,'#d9b45a')}}
  Object.entries(g.roam).forEach(([k,ro])=>{if(ro.road===id&&ro.met&&!ro.dead){const [x,y]=along(pts,.5);claws(ox+x+4,oy+y-8)}});
 });
 // far ends not yet known: a pencil ? where a shown road leads
 g.roads.forEach(id=>RD[id].slice(0,2).forEach(k=>{if(!knownPt(k)){const p=P_[k];pT('?',ox+p.x-3,oy+p.y-8,INKL,16)}}));
 (g.seals||[]).forEach(k=>{const p=P_[k];if(!p)return;const x=ox+p.x+10,y=oy+p.y-12;cx.fillStyle='#5e1a18';cx.beginPath();cx.arc(x,y,5,0,7);cx.fill();cx.fillStyle='#9a4528';cx.beginPath();cx.arc(x-1,y-1,3.5,0,7);cx.fill();pR(x-1,y-2,2,3,'#5e1a18')});
 Object.keys(P_).forEach(k=>{if(!knownPt(k))return;const p=P_[k],x=ox+p.x,y=oy+p.y;
  if(p.kind==='lie'){const L=(G.run.rumors||{lies:{}}).lies[k]||{};pT('?',x-3,y-8,INKL,16);if(L.found){cx.strokeStyle=INK;cx.lineWidth=1;cx.beginPath();cx.moveTo(x-6,y-6);cx.lineTo(x+6,y+6);cx.stroke()}ribbon(p.name,x,y+9,false);return}
  glyph(p.kind,x,y,k);ribbon(p.kind==='town'?p.name:p.name.replace(/^the /,'The '),x,y+8,p.kind==='town')});
 // the cursor: four Tallow corner brackets with a Peat edge, framing the picture
 const c=P_[MAPV.cur],b=Math.floor(performance.now()/300)%2,s=11+b,X=ox+c.x,Y=oy+c.y-4;
 for(const [sx,sy] of [[-1,-1],[1,-1],[-1,1],[1,1]]){const ax=X+sx*s,ay=Y+sy*s;pR(ax-(sx>0?5:0)-1,ay-1,7,3,'#1c1814');pR(ax-1,ay-(sy>0?5:0)-1,3,7,'#1c1814');pR(ax-(sx>0?4:0),ay,5,1,'#d9b45a');pR(ax,ay-(sy>0?4:0),1,5,'#d9b45a')}
 // the coin token, struck with the lead's head, with its shadow
 const at=P_[g.at],coin=RLSP.coin(lead().sp);cx.fillStyle='rgba(28,24,20,.35)';cx.beginPath();cx.ellipse(ox+at.x+12,oy+at.y-2,8,2.5,0,0,7);cx.fill();cx.drawImage(coin,ox+at.x+3,oy+at.y-20);
}
// a name on a pale ribbon, slid in from the edge rather than cut, never on texture
function ribbon(t,x,y,big){const s=big?13:12,w=pW(t,s)+8,xc=Math.max(w/2+2,Math.min(VW-w/2-2,x));if(Math.abs(xc-x)>w/2)return;x=xc;if(MAPV.ribs)MAPV.ribs.push([t,x,y,big,w]);
 pR(x-w/2,y,w,s-1,RIB);pR(x-w/2,y+s-1,w,1,'rgba(58,44,32,.4)');pT(t,x-w/2+4,y-2,INK,s)}
function along(pts,t){let L=0;const seg=[];for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);seg.push(d);L+=d}
 let want=t*L;for(let i=0;i<seg.length;i++){if(want<=seg[i]){const f=seg[i]?want/seg[i]:0;return [pts[i][0]+(pts[i+1][0]-pts[i][0])*f,pts[i][1]+(pts[i+1][1]-pts[i][1])*f]}want-=seg[i]}return pts[pts.length-1]}
// each place as a little picture: a walled town with towers (Saint Ebbe's with a spire), cottages for a hamlet, a pictogram for each
// wild site, the pit head on a Blood ground for the den. k: the place (the map Key passes none)
function glyph(kind,x,y,k){const r=(a,b,w,h,c)=>pR(x+a,y+b,w,h,c);
 r(-10,4,20,2,'rgba(58,44,32,.3)');
 if(kind==='town'){r(-10,-6,20,10,INK);r(-9,-5,18,8,'#efe4c8');r(-9,-5,3,8,'#fff6dc');r(4,-5,5,8,'#cdbf9c');
  r(-11,-10,5,14,INK);r(-10,-9,3,12,'#efe4c8');r(6,-10,5,14,INK);r(7,-9,3,12,'#cdbf9c');
  [-11,-9,-7,6,8,10].forEach(a=>r(a,-11,1,1,INK));r(-2,-1,4,5,INK);r(-1,0,2,4,'#6a4a2c');
  if(k==='ebbe'){r(-1,-18,2,12,INK);r(-3,-13,6,1,INK);r(-2,-8,4,3,INK)}else{r(-6,-9,3,3,'#9a4528');r(-1,-9,3,3,'#9a4528')}}
 else if(kind==='hamlet'){[[-9,0],[-1,-3],[5,1]].forEach(([a,b])=>{r(a,b-2,7,6,INK);r(a+1,b-1,5,4,'#efe4c8');r(a-1,b-5,9,3,INK);r(a,b-4,7,2,'#c8a552');r(a+3,b+1,1,3,INK)})}
 else if(kind==='den'){r(-9,-3,18,9,'#5e1a18');r(-6,-1,12,5,'#1c1814');r(-5,-12,2,11,INK);r(3,-12,2,11,INK);r(-6,-13,12,2,INK);r(-1,-11,2,2,'#7a7a7a');r(-1,-9,1,8,INKL)}
 else{if(k==='camp'){r(-6,-2,12,6,INK);r(-5,-1,10,4,'#6a5a4a');r(-3,-6,6,4,INK);r(-2,-5,4,3,'#4a3e34');for(let i=0;i<3;i++)r(-1+i,-10-i*3,2,2,'rgba(90,80,70,.5)')}
  else if(k==='cause'){for(let i=-9;i<10;i+=3)r(i,-1,2,5,INK);r(-10,0,20,1,INKL);r(-10,3,20,1,INKL)}
  else if(k==='crook'){r(-7,-4,7,8,INK);r(-6,-3,5,6,'#cdbf9c');r(1,-2,7,6,INK);r(2,-1,5,4,'#cdbf9c');r(-8,-6,9,2,INK);r(0,-4,9,2,INK);r(-5,-1,3,3,'#5e1a18');r(-4,-2,1,5,'#5e1a18')}
  else if(k==='hollin'){r(-9,-1,18,6,'rgba(200,165,82,.6)');for(let i=-8;i<9;i+=3)r(i,-3,1,7,'#8a6c2e');r(-3,-9,6,8,INK);r(-2,-8,4,7,'#efe4c8');r(-4,-10,8,2,INK)}
  else if(k==='sallow'){r(-8,-4,7,7,INK);r(-7,-3,5,5,'#efe4c8');r(-9,-6,9,2,INK);r(2,-9,5,12,INK);r(3,-8,3,10,'#cdbf9c');r(2,-11,5,2,INK)}
  else{r(-5,-5,10,9,INK);r(-4,-4,8,7,'#c8a552');r(-1,-8,2,3,INK);r(-1,0,2,3,INK)}}}
function claws(x,y){for(let k=0;k<3;k++){pR(x+k*3,y,1,5,'#9a4528');pR(x+k*3+1,y+4,1,2,'#9a4528')}}
// the HUD: a party card (the three faces on their backings, the lead's in Tallow, the lead's name) and a place card (the place,
// the purse, the day, food and the days it covers); then the Hue and the four factions on one line, each written out
function drawStrip(){const g=RG(),r=G.run;
 StudioHUD.card(cx,2,2,104,46,HUDT);let x=6;
 party.forEach((m,i)=>{const on=i===(G.lead|0);pR(x-1,5,32,32,on?'#d9b45a':'#5a4a3a');StudioHUD.portrait(cx,RLSP.portrait(m.sp,m.look),4,0,56,56,x,6,30,30,HUDT);if(m.dead)pR(x,6,30,30,'rgba(28,24,20,.7)');x+=33});
 const ln=party[G.lead|0].name.toUpperCase();pT(ln,6,35,'#d9b45a',pSize(ln,96,[12,11,10])||10);
 const live=Math.max(1,alive().length),days=Math.floor(r.rations/live),where=g.trip?'ON THE ROAD':P_[g.at].name.toUpperCase();
 const rows=[[where,'#e6dcc4',13],[`${r.purse} gr · DAY ${r.day}`,'#d9b45a',12],[`Food ${r.rations} · ${days} day${days===1?'':'s'}`,r.rations<live?'#c8603a':'#e6dcc4',12]];
 if((g.meat||[]).some(l=>l.d<=1))rows.push(['Meat rots tomorrow','#c8603a',11]);
 const h=Math.max(48,placeCard(rows));
 pR(0,h+1,VW,14,'rgba(28,24,20,.92)');const hue=r.hue|0;pT('HUE',4,h+1,'#d9b45a',12);for(let k=0;k<4;k++)pR(24+k*6,h+5,4,7,k<hue?'#9a4528':'#4d4134');
 let fx=54;const F=[['Lord','lord'],['Church','church'],['Town','town'],['Outlaws','outlaws']],st=k=>r.fac&&r.fac[k]?['hated','wary','–','trusted','sworn'][r.fac[k].step]:'–';
 const z=pW(F.map(([n,k])=>n+' '+st(k)).join('   '),12)+54<=VW?12:11;
 F.forEach(([n,k])=>{const s=st(k);pT(n,fx,h+1,'#c8bea8',z);fx+=pW(n,z)+3;pT(s,fx,h+1,s==='hated'?'#c8603a':s==='–'?'#e6dcc4':'#d9b45a',z);fx+=pW(s,z)+(z===12?8:5)});
}
// the inset: the chart itself in small, in an ink frame, with the view marked
function drawInset(rr){const w=46,h=40,x=rr.x+rr.w-w-4,y=rr.y+4;pR(x-1,y-1,w+2,h+2,'#1c1814');pR(x,y,w,h,INK);if(chartSheet)cx.drawImage(chartSheet,x+1,y+1,w-2,h-2);
 Object.keys(P_).forEach(k=>{if(!knownPt(k))return;const p=P_[k];pR(x+1+p.x*(w-2)/MARCH.w-1,y+1+p.y*(h-2)/MARCH.h-1,3,3,k===RG().at?'#9a4528':INK)});
 const cr=chartRect();cx.strokeStyle='#d9b45a';cx.lineWidth=1;cx.strokeRect(x+1+MAPV.cam[0]*(w-2)/MARCH.w,y+1+MAPV.cam[1]*(h-2)/MARCH.h,cr.w*(w-2)/MARCH.w,cr.h*(h-2)/MARCH.h)}
// edge tags: parchment with an ink edge; places below or above line up along that edge, places to the sides stack; none overlap
function drawTabs(rr,ox,oy){MAPV.tabs=[];const bot=[],top=[];
 const tab=(t,tx,ty,w,k)=>{pR(tx,ty,w,13,INK);pR(tx+1,ty+1,w-2,11,'#efe4c8');pT(t,tx+4,ty,INK,11);MAPV.tabs.push({x:tx,y:ty,w,h:13,k})};
 Object.keys(P_).forEach(k=>{if(!knownPt(k))return;const p=P_[k],x=ox+p.x,y=oy+p.y;if(x>=rr.x&&x<rr.x+rr.w&&y>=rr.y&&y<rr.y+rr.h)return;
  const nm=p.name.replace(/^the /,'').toUpperCase();
  if(y>=rr.y+rr.h&&x>=rr.x&&x<rr.x+rr.w){bot.push([x,nm+' ▼',k]);return}if(y<rr.y&&x>=rr.x&&x<rr.x+rr.w){top.push([x,nm+' ▲',k]);return}
  const t=(x<rr.x?'◀ ':'')+nm+(x>=rr.x+rr.w?' ▶':''),w=pW(t,11)+8,tx=x<rr.x?rr.x+2:rr.x+rr.w-w-2;let ty=clamp(y-6,rr.y+48,rr.y+rr.h-30);
  let guard=0;while(MAPV.tabs.some(o=>tx<o.x+o.w&&tx+w>o.x&&Math.abs(ty-o.y)<14)&&guard++<20)ty-=15;tab(t,tx,ty,w,k)});
 [[bot,rr.y+rr.h-15],[top,rr.y+2]].forEach(([L,y])=>{if(!L.length)return;L.sort((a,b)=>a[0]-b[0]);const ws=L.map(([,t])=>pW(t,11)+8),tot=ws.reduce((a,b)=>a+b+3,0);
  let x=Math.max(rr.x+2,Math.min(rr.x+rr.w-2-tot,L[0][0]-ws[0]/2));L.forEach(([,t,k],i)=>{tab(t,x,y,ws[i],k);x+=ws[i]+3})});
}
// the road card: the same card as the HUD, tall enough that nothing is cut: the place under the cursor, its days, the food it
// needs against what's carried, event rolls and threat
function drawRoadCard(){const g=RG(),r=G.run,y=VH-54,c=MAPV.cur,p=P_[c];StudioHUD.card(cx,2,y,VW-4,52,HUDT);
 if(MAPV.log.length&&(g.trip||G.busy)){MAPV.log.slice(-3).flatMap(l=>pWrap(l,VW-16,13,2)).slice(-3).forEach((l,i)=>pT(l,8,y+4+i*15,PAL.bone,13));return}
 const nm=p.name.toUpperCase(),tz=pSize(nm,VW-24-pW(p.type,12),[15,14,13,12])||12;pT(nm,8,y+3+(15-tz)/2,PAL.tallow,tz);pT(p.type,VW-8-pW(p.type,12),y+5,'#c8bea8',12);
 if(c===g.at){pT('You are here. A: go in.',8,y+19,PAL.bone,14);pT('◀▶▲▼ pick a place · L key · R contracts',8,y+34,'#c8bea8',pSize('◀▶▲▼ pick a place · L key · R contracts',VW-16,[12,11])||11);return}
 const rt=route(g.at,c);if(!rt){pT('No known road there.',8,y+19,PAL.bone,14);return}
 const need=rationsNeed(rt.days);pT(`Road ${rt.days} day${rt.days>1?'s':''}`,8,y+19,PAL.bone,14);pT(`Food ${need} of ${r.rations}`,84,y+19,r.rations<need?'#c8603a':PAL.bone,14);
 const ev=`${rt.days} event roll${rt.days>1?'s':''}`;pT(ev,VW-8-pW(ev,14),y+19,PAL.bone,14);
 pT('Threat ???',8,y+34,'#c8bea8',14);pT('A: go',VW-8-pW('A: go',14),y+34,PAL.tallow,14);
}
// the map Key (spec 008, 8C; mockup 44): a parchment card over the dimmed chart that uses the chart's own pictures; every row fits
function drawKey(){pR(0,0,VW,VH,'rgba(28,24,20,.7)');
 const rows=[['town','Town'],['hamlet','Hamlet'],['site','Wild site'],['den','Den'],['main','Main road, a stroke per day'],['side','Side road'],['denroad','Road to a den'],['route','The way you\'ve picked'],['?','Not yet known'],['claws','Roamer met here'],['seal','A contract here'],['coin','The company (the lead)']];
 const rh=Math.max(13,Math.min(17,Math.floor((VH-48)/rows.length))),w=Math.min(VW-8,206),h=26+rows.length*rh+16,x=(VW-w)/2,y=Math.max(4,(VH-h)/2);
 StudioParch.panel(cx,x,y,w,h,PT_);pT('THE KEY',x+8,y+6,IK.rust,8,PXf);const sub='The Withy March';pT(sub,x+w-8-pW(sub,13),y+3,IK.dim,13);
 rows.forEach(([k,l],i)=>{const yy=y+22+i*rh,ix=x+24,iy=yy+rh/2;
  if(['town','hamlet','site','den'].includes(k))glyph(k,ix,iy+2,k==='site'?'camp':null);
  else if(k==='main'){pR(ix-14,iy-2,28,4,INK);pR(ix-14,iy-1,28,2,'#e8dcc0');pR(ix-1,iy-5,2,10,INK)}
  else if(k==='side'||k==='denroad')for(let q=-14;q<14;q+=7)pR(ix+q,iy-1,4,2,k==='side'?INK:'#5e1a18');
  else if(k==='route')for(let q=-12;q<14;q+=6){pR(ix+q-1,iy-2,4,4,INK);pR(ix+q,iy-1,2,2,'#d9b45a')}
  else if(k==='?')pT('?',ix-3,iy-9,INKL,16);
  else if(k==='claws')claws(ix-4,iy-4);
  else if(k==='seal'){cx.fillStyle='#5e1a18';cx.beginPath();cx.arc(ix,iy,5,0,7);cx.fill();cx.fillStyle='#9a4528';cx.beginPath();cx.arc(ix-1,iy-1,3.5,0,7);cx.fill()}
  else if(k==='coin'){const c=RLSP.coin(lead().sp);cx.drawImage(c,ix-7,iy-9)}
  pT(l,x+46,yy+(rh-15)/2,IK.peat,pSize(l,w-54,[15,14,13,12])||12)});
 pT('L or B: close',x+(w-pW('L or B: close',13))/2,y+h-15,IK.dim,13)}
// the Contracts page (spec 008, 8C; mockup 44): one parchment card per contract (its title, the pay, where with days and food, who it's
// for and the kind of job, what's known, whose motivation it touches), then Signs and The dead as their own cards
function drawContracts(){pR(0,0,VW,VH,PAL.peat);let y=frameTop('CONTRACTS',`DAY ${G.run.day}`)+2;
 const cs=(G.run.contracts||[]).filter(c=>!c.done),bot=frameFoot(cs.length?'A: KEEP OR DROP · R OR B: BACK':'R OR B: BACK'),g=RG(),r=G.run;
 const card=(lines,title,on,right)=>{const h=(title?14:4)+lines.length*12+8;if(y+h>bot)return false;parch(4,y,VW-8,h,on);let yy=y+3;
  if(title){const tz=pSize(title,VW-(on?32:14)-(right?pW(right,15)+10:0),[8,7],PXf);if(tz)pT(title,on?22:10,yy+(8-tz)/2+1,IK.peat,tz,PXf);else pT(title,on?22:10,yy-2,IK.peat,14);if(right)pT(right,VW-10-pW(right,15),yy-3,IK.rust,15);yy+=14}
  lines.forEach(([t,c,it])=>{cx.font=(it?'italic ':'')+VTf(14);cx.fillStyle=c||IK.soot;cx.textBaseline='top';cx.fillText(t,on&&!title?22:10,yy);yy+=12});y+=h+4;return true};
 const wrap=(t,c,it)=>pWrap(t,VW-22,14,4).map(l=>[l,c,it]);
 if(!cs.length)card(wrap(RW.noContracts,IK.soot));
 cs.forEach((c,i)=>{const J=(typeof JOBS!=='undefined'&&JOBS[c.id])||{},on=typeof CP_SEL!=='undefined'&&i===CP_SEL%cs.length,L=[];
  if(J.site&&P_[J.site]){const rt=g.at===J.site?null:route(g.at,J.site);L.push(...wrap(rt?`Where: ${P_[J.site].name} · ${rt.days} day${rt.days>1?'s':''} · food ${rationsNeed(rt.days)} of ${r.rations}`:`Where: ${P_[J.site].name}`))}
  if(J.kind){const gv=J.by==='giver'&&r.givers&&r.givers[J.giver];L.push(...wrap(`For: ${gv?gv.name+', the '+GIVERS[J.giver].title:J.by==='none'?'nobody':'the notice board'} · a ${J.kind}`))}
  const mt=(J.tags||[]).map(t=>{const who=party.filter(m=>!m.dead&&(m.mot||[]).includes(t)).map(m=>m.name);return who.length?`${who.join(', ')} (${t})`:''}).filter(Boolean);if(mt.length)L.push(...wrap('Moment: '+mt.join(' · '),IK.moss));
  L.push(...wrap('Next: '+(c.next||''),IK.peat));
  card(L,c.title,on,c.pay?c.pay+' gr':'')});
 const sg=g.signs||[];card(sg.length?sg.flatMap(id=>wrap(RLT(id),IK.soot,true)):wrap(RW.noSigns,IK.dim),RW.signs.toUpperCase());
 const bodies=r.bodies||[];if(bodies.length)card(bodies.flatMap(b=>wrap(`${b.name} · bury by the end of the next job${G.town?' · at the church':''}`)),'THE DEAD');
 if(typeof drawContractsExtra==='function')drawContractsExtra(card,wrap);
}

// ================= MAP INPUT =================
function regionPress(k){
 if(MAPV.key){if(k==='l'||k==='b'||k==='a')MAPV.key=false;return}
 if(MAPV.page){if(k==='r'||k==='b'||k==='a')MAPV.page=null;else if(typeof contractsPress==='function')contractsPress(k);return}
 if(G.busy)return;
 if(['up','down','left','right'].includes(k)){const ks=Object.keys(P_).filter(knownPt),rects=ks.map(q=>({x:P_[q].x-4,y:P_[q].y-4,w:8,h:8}));
  const i=StudioNearest.step(rects,ks.indexOf(MAPV.cur),k);MAPV.cur=ks[i];return}
 if(k==='l'){MAPV.key=true;return}
 if(k==='r'){MAPV.page='contracts';return}
 if(k==='a'){if(MAPV.cur===RG().at)run(()=>openPoint(RG().at));else run(()=>march(MAPV.cur));return}
 if(k==='start'){run(pauseMenu);return}
 if(k==='select'){mapSelect();return}
}
function regionTap(x,y){if(MAPV.key||MAPV.page){regionPress('b');return}
 for(const t of MAPV.tabs||[])if(x>=t.x&&x<t.x+t.w&&y>=t.y&&y<t.y+t.h){MAPV.cur=t.k;return}
 if(y>=VH-50){regionPress('a');return}
 const r=chartRect(),ox=r.x-MAPV.cam[0],oy=r.y-MAPV.cam[1];let best=null,bd=18;
 Object.keys(P_).filter(knownPt).forEach(k=>{const d=Math.hypot(P_[k].x+ox-x,P_[k].y+oy-y);if(d<bd){bd=d;best=k}});
 if(best){if(best===MAPV.cur)regionPress('a');else MAPV.cur=best}}

// ================= TRAVEL =================
const pace=ms=>sleep(G.auto&&G.auto.menu||(G.dev&&G.dev.fast)?0:ms);
function logLine(t){MAPV.log.push(t);if(MAPV.log.length>12)MAPV.log.shift()}
// march to a known point: stops at every point on the way, and can be cancelled at any stop
async function march(to){
 const g=RG(),rt=route(g.at,to);if(!rt){await say('','No known road goes there.');return}
 const need=rationsNeed(rt.days);
 const r=await choose([`Set out (${rt.days} day${rt.days>1?'s':''}, food ${need} of ${G.run.rations})`,'Not yet'],{cancel:true,title:P_[to].name.toUpperCase()});
 if(r!==0)return;
 g.trip={to,legs:rt.legs.map(l=>({road:l.road,to:l.to,day:0,extra:0})),leg:0};saveRun();
 await walk();
}
// walk the trip in rl.run, a day at a time; also how a save made mid-road picks up again
async function walk(){
 const g=RG();MAPV.log=[];
 while(g.trip){
  const L=g.trip.legs[g.trip.leg],days=roadDays(L.road)+L.extra;
  if(L.day<days){
   const res=await travelDay(L,days);if(res==='back'||res==='end')return;
   if(!g.trip)return;
   continue;
  }
  // a leg ends at a point: arrive, scout, and ask whether to go on
  g.at=L.to;MAPV.cur=L.to;scout(L.to);g.trip.leg++;
  if(g.trip.leg>=g.trip.legs.length){g.trip=null;atSite(g.at);saveRun();await say('',`You reach ${P_[g.at].name}.`,{auto:900});await openPoint(g.at);return}
  saveRun();
  const go=await choose([`Go on to ${P_[g.trip.legs[g.trip.leg].to].name}`,`Stop at ${P_[g.at].name}`],{title:P_[g.at].name.toUpperCase()});
  if(go!==0){g.trip=null;saveRun();await openPoint(g.at);return}
 }
}
// one travel day: forage, the road event (or the roamer on its road), then eat and camp, or arrive
async function travelDay(L,days){
 const g=RG(),r=G.run;r.day++;L.day++;
 logLine(`Day ${r.day}. ${RD[L.road][3]==='main'?'The main road':'A side road'} toward ${P_[L.to].name}.`);await pace(500);
 tickMeat();
 await forage();
 // the first day on a roamer's road always meets it, instead of the road event roll
 const ro=Object.entries(g.roam).find(([k,v])=>v.road===L.road&&!v.dead&&L.day===1&&!L.metHere);
 let res=null;
 if(ro){L.metHere=1;res=await meetRoamer(ro[0],ro[1],L)}
 else if(G.dev&&G.dev.event||!(G.dev&&G.dev.noevents)&&d100()<=25*(G.dev&&G.dev.eventx||1))res=await roadEvent(L);
 if(res==='back'||res==='end'||!G.active)return res;
 await eatDay();if(!G.active)return 'end';
 if(G.run.escort&&G.run.escort.alive&&G.run.escort.hp<=0)await woolDied();
 const daysNow=roadDays(L.road)+L.extra;
 if(L.day<daysNow){await camp({road:true});if(!G.active)return 'end';if(typeof afterCamp==='function')await afterCamp()}
 saveRun();return null;
}
async function forage(){
 if(G.dev&&G.dev.noforage)return;
 const f=alive().filter(m=>!m.ko).sort((a,b)=>(b.sk.Survival||0)-(a.sk.Survival||0))[0];if(!f)return;
 const p=(f.sk.Survival||0)-(G.dev&&G.dev.winter?20:0),o=StudioRoll.pct(p);
 if(o.ok){const n=StudioRoll.die(2);addRations(n,`${f.name} forages ${n} ration${n>1?'s':''} (Survival ${o.target}%).`)}
 else logLine(`${f.name} forages and finds nothing.`);await pace(400);
}
function addRations(n,why){const r=G.run,room=LARDER-r.rations,got=Math.min(n,Math.max(0,room));r.rations+=got;logLine(why+(got<n?' '+fill(RW.lost,{n:n-got}):''))}
function tickMeat(){const g=RG();if(!g.meat.length)return;g.meat.forEach(l=>l.d--);const rot=g.meat.filter(l=>l.d<=0).reduce((a,l)=>a+l.n,0);g.meat=g.meat.filter(l=>l.d>0);if(rot)logLine(fill(RW.rot,{n:rot}))}
function cookMeat(){const g=RG(),n=g.meat.reduce((a,l)=>a+l.n,0);if(!n)return;g.meat=[];addRations(n,fill(RW.cooked,{n}))}

// ================= EATING AND GOING HUNGRY =================
// At the end of each day every merc eats one ration. When there aren't enough, the Who eats box comes pre-filled:
// whoever went hungry yesterday eats first, then the lowest HP. One tap confirms it or changes it.
async function eatDay(o={}){
 const r=G.run,live=alive();if(!live.length)return;
 let eaters=live;G.whoEats=0;
 const extra=(o.client||G.run.escort&&G.run.escort.alive?1:0);
 if(r.rations<live.length+extra){
  const n=Math.max(0,r.rations-extra),order=live.slice().sort((a,b)=>((b.hunger|0)>0)-((a.hunger|0)>0)||a.hp-b.hp);
  let pick=new Set(order.slice(0,n));G.whoEats=1;
  if(!(G.auto&&G.auto.menu))for(;;){const names=[...pick].map(m=>m.name).join(', ')||'nobody';
   const c=await choose([`Eat: ${names}`,'Change who eats'],{title:`WHO EATS? ${r.rations} RATION${r.rations===1?'':'S'}`});
   if(c!==1)break;
   for(;;){const rows=live.map(m=>({label:`${pick.has(m)?'✓':'·'} ${m.name}  HP ${m.hp}${m.hunger?' · hungry':''}`}));rows.push({label:'Done'});
    const t=await choose(rows,{title:`PICK ${n}`});if(t<0||t===live.length)break;const m=live[t];if(pick.has(m))pick.delete(m);else if(pick.size<n)pick.add(m)}}
  eaters=[...pick];
 }
 r.rations=Math.max(0,r.rations-eaters.length-extra);
 for(const m of live){
  if(eaters.includes(m)){if(m.hunger)logLine(`${m.name} eats. Not hungry now.`);m.hunger=0;m.st=(m.st||[]).filter(s=>s!=='Hungry'&&s!=='Starving')}
  else{m.hunger=(m.hunger|0)+1;m.st=(m.st||[]).filter(s=>s!=='Hungry'&&s!=='Starving');m.st.push(m.hunger>=2?'Starving':'Hungry');
   if(m.hunger>=2){m.hp=Math.max(1,m.hp-1);m.san=Math.max(0,m.san-1);logLine(`${m.name} is Starving: −1 HP, −1 SAN.`)}
   else logLine(RLT('RE-HUNGRY-1',{merc:m.name}));
   if(typeof weakWilled==='function')await weakWilled(m)}
 }
 applySan();
}

// ================= CAMP AND INN =================
// Camp: each merc heals 1d4, WP refills (not if Hungry), once-per-rest refreshes, meat is cooked. No SAN.
// The night roll: half the road-event odds. Before it, the best Search merc rolls On guard (Search 75%) if they have it;
// a pass, or a mouse in the company, means the company isn't Ambushed.
async function camp(o={}){
 const live=alive();
 const makeCamp=live.find(m=>(m.sk.Survival||0)>=90&&StudioRoll.pct(m.sk.Survival).ok);
 if(makeCamp){logLine(`${makeCamp.name} makes a proper camp: it counts as an inn night.`);await restInn(false);return}
 cookMeat();
 G.run.rests=(G.run.rests|0)+1;
 live.forEach(m=>{if(m.ko){m.ko=false;m.hp=Math.max(1,m.hp)}m.hp=Math.min(m.mhp,m.hp+StudioRoll.die(4));if(!(m.hunger>0))m.wp=m.mwp;m.rest=(m.rest|0)+1});
 if(o.road!==false&&(G.dev&&G.dev.night||!(G.dev&&G.dev.noevents)&&d100()<=12.5*(G.dev&&G.dev.eventx||1))){
  const guard=live.filter(m=>(m.sk.Search||0)>=75).sort((a,b)=>b.sk.Search-a.sk.Search)[0];
  const spotted=live.some(m=>m.sp==='mouse')||(guard&&StudioRoll.pct(guard.sk.Search).ok);
  await say('',RLT(spotted?'RE-CAMP-GUARD':'RE-CAMP-RAID'),{auto:G.auto?1:1400});
  const kind=d100()<=50?'rooks':'bandits';
  const res=await roadFight(kind==='rooks'?rookFoes():banditFoes(2),{ambush:!spotted,bg:'night',night:true,roamer:kind==='rooks'});
  if(res==='lose')return;
 }else logLine(RLT('RE-CAMP-1'));
 saveRun();
}
// Inn: 2 gr a merc; full HP and WP, the day's meals, and 1d4 SAN once per merc between contracts
async function restInn(pay=true){
 const r=G.run,g=RG(),live=alive(),cost=2*live.length;
 if(pay){if(r.purse<cost){await say('',`The inn wants ${cost} gr. You have ${r.purse}.`);return false}r.purse-=cost}
 r.rests=(r.rests|0)+1;const got=[];live.forEach(m=>{m.ko=false;m.hp=m.mhp;m.wp=m.mwp;m.hunger=0;m.st=(m.st||[]).filter(s=>s!=='Hungry'&&s!=='Starving');m.rest=(m.rest|0)+1;
  if(!g.innSan[m.id]){g.innSan[m.id]=1;const s=StudioRoll.die(4);m.san=Math.min(m.msan,m.san+s);got.push(`${m.name} +${s}`)}});
 cookMeat();applySan();
 await say('',`A night at the inn${pay?` for ${cost} gr`:''}. Full HP and WP.${got.length?' SAN: '+got.join(', ')+'.':''}`);
 saveRun();return true;
}

// ================= POINT CARDS (until Parts C and D build the streets and sites) =================
async function openPoint(k){
 const p=P_[k];if(typeof openPlace==='function'&&await openPlace(k))return;
 if(p.kind==='lie'){const L=G.run.rumors.lies[k];await say('',RLT('RU-NOTHING'));if(L)L.found=1;return}
 if(p.kind==='town'){
  for(;;){const r=G.run,c=await choose(['Rest at the inn','Sleep rough',`Buy rations (1 gr each)`,'Leave'],{cancel:true,title:p.name});
   if(c===0){if(await restInn())r.day++}
   else if(c===1){r.day++;await eatDay();await camp({road:false});await say('','You sleep rough by the wall. Free, and it feels it.')}
   else if(c===2)await buyRations(1);
   else return}
 }else{await choose(['Leave'],{cancel:true,title:p.name.toUpperCase()+' · Nothing here yet'})}
}
async function buyRations(price){const r=G.run;price=Math.ceil(price*(G.dev&&G.dev.winter?1.5:1));
 const room=LARDER-r.rations;if(room<=0){await say('','The larder is full (15).');return}
 const opts=[1,3,5,room].filter((n,i,a)=>n<=room&&a.indexOf(n)===i);
 const c=await choose(opts.map(n=>({label:`${n} ration${n>1?'s':''} · ${n*price} gr`,dis:n*price>r.purse})),{cancel:true,title:`RATIONS ${r.rations}/15 · ${r.purse} gr`});
 if(c<0)return;const n=opts[c];r.purse-=n*price;r.rations+=n;saveRun()}

// ================= ROAD EVENTS =================
// One roll each travel day (25% in region 1). A choice that needs a roll shows who rolls and their odds.
const EVENTS=[[25,'tree'],[40,'toll'],[55,'refugee'],[70,'wound'],[80,'proc'],[95,'storm'],[100,'sign']];
async function roadEvent(L){
 let kind=G.dev&&G.dev.event;
 if(!kind){for(let t=0;t<5&&!kind;t++){const r=d100();kind=EVENTS.find(e=>r<=e[0])[1];if(kind==='sign'&&!signRoadOk(L))kind=null}}
 if(G.dev&&G.dev.event)G.dev.event=null;
 if(!kind)kind='storm';
 // Outlaws Hated: bandit road events come twice as often
 if(kind!=='tree'&&G.run.fac&&G.run.fac.outlaws.step===0&&d100()<=25)kind='tree';
 if(typeof eventHook==='function'){const h=await eventHook(kind,L);if(h)return h==='none'?null:h}
 return EV[kind](L);
}
const best=sk=>alive().filter(m=>!m.ko).sort((a,b)=>(b.sk[sk]||0)-(a.sk[sk]||0))[0];
const odds=(m,sk,mod=0)=>`${m.name} ${clamp((m.sk[sk]||0)+mod,1,99)}%`;
async function evAsk(line,opts){return G.auto&&G.auto.menu?G.auto.choice(opts):ask('',line,opts.map(o=>o.label||o))}
const EV={
 async tree(L){const n=alive().length,cost=2*n;
  await say('',RLT('RE-TREE-1'));await say('BANDIT',RLT('VO-BANDIT-1'));
  const c=await evAsk('Pay or fight?',[{label:`Pay the toll (${cost} gr)`,dis:G.run.purse<cost},'Fight']);
  if(c===0&&G.run.purse>=cost){G.run.purse-=cost;await say('',RLT('RE-TREE-PAY'));return null}
  const guard=best('Search'),spotted=alive().some(m=>m.sp==='mouse')||(guard&&(guard.sk.Search||0)>=75&&StudioRoll.pct(guard.sk.Search).ok);
  return roadFight(banditFoes(3),{ambush:!spotted,bg:'dusk'})},
 async toll(L){const n=alive().length,m=best('Persuade');
  const c=await evAsk(RLT('RE-TOLL-1'),[{label:`Pay (${n} gr)`,dis:G.run.purse<n},`Talk (Persuade · ${odds(m,'Persuade',distrust(m))})`,'Go round (+1 day)']);
  if(c===0){G.run.purse-=n;return null}
  if(c===1){const o=StudioRoll.pct((m.sk.Persuade||0)+distrust(m));if(o.ok){await say('',RLT('RE-TOLL-TALK'));return null}
   const d=Math.min(G.run.purse,2*n);G.run.purse-=d;await say('',`He doesn't like your tone. You pay double: ${d} gr.`);return null}
  L.extra++;await say('',RLT('RE-TOLL-ROUND'));return null},
 async refugee(L){const c=await evAsk(RLT('RE-REFUGEE-1'),[{label:'Give 2 rations',dis:G.run.rations<2},'Pass by']);
  if(c===0){G.run.rations-=2;await say('',RLT('RE-REFUGEE-GIVE'));const pm=alive().filter(m=>m.mot.includes('Protect the innocent'));
   for(const m of pm){const s=StudioRoll.die(4);m.san=Math.min(m.msan,m.san+s);await say('',`${m.name} needed that. +${s} SAN.`,{auto:G.auto?1:1200})}applySan();return null}
  await say('',RLT('RE-REFUGEE-PASS'));return null},
 async wound(L){const m=best('First Aid');const c=await evAsk(RLT('RE-WOUND-1'),[`Help (First Aid · ${odds(m,'First Aid')})`,'Pass by']);
  if(c!==0)return null;return woundHelp(m)}};
async function woundHelp(m){{const o=StudioRoll.pct(m.sk['First Aid']||0);
  if(o.ok){await say('',RLT('RE-WOUND-SAVED'));const g=RG();if(!g.hiddenFound){findHidden();await say('',`He marks a road you didn't know: ${roadName(g.hidden)}.`)}
   else{const un=Object.keys(P_).filter(k=>!knownPt(k)&&P_[k].kind!=='den');if(un.length){const k=un[rnd(un.length)];scout(k);g.known=g.known.filter(x=>x!==k).concat([k]);
    Object.keys(RD).forEach(r=>{if(RD[r].includes(k)&&roadShowable(r)&&RD[r].some(q=>q!==k&&knownPt(q)))revealRoad(r)});await say('',`He tells you how to find ${P_[k].name}.`)}}
   return null}
  await say('',RLT('RE-WOUND-DIED'));return null}}
Object.assign(EV,{
 async proc(L){const faith=alive().find(m=>m.mot.includes('Faith'));
  const opts=['Wait for them (+1 day)','Walk through (CON × 5 each)'];if(faith)opts.push(`${faith.name} walks with them (+1d4 SAN)`);
  const c=await evAsk(RLT('RE-PROC-1'),opts);
  if(c===0){L.extra++;await say('',RLT('RE-PROC-WAIT'));return null}
  await say('',RLT('RE-PROC-THROUGH'));
  if(c===2){const s=StudioRoll.die(4);faith.san=Math.min(faith.msan,faith.san+s);await say('',`${faith.name} walks with them a while. +${s} SAN.`,{auto:G.auto?1:1200})}
  for(const m of alive()){if(m.sp==='rat')continue;if(!StudioRoll.pct(m.stats.CON*5).ok){if(!m.st.includes('Sickened'))m.st.push('Sickened');await say('',`${m.name} is Sickened.`,{auto:G.auto?1:900})}}
  applySan();return null},
 async storm(L){L.extra++;await say('',RLT('RE-STORM-1'),{auto:G.auto?1:1400});return null},
 async sign(L){const id=['CR-MONK-SIGN-1','CR-MONK-SIGN-2','CR-MONK-SIGN-3','CR-MONK-SIGN-4'].find(s=>!RG().signs.includes(s));
  RG().signStrange=1;if(id){addSign(id);await say('',RLT(id));await say('','You write it down. Something under the hills.',{auto:G.auto?1:1200})}return null}
});
// a strange sign comes only within 2 roads of Lowmoor Pit, once per run
function signRoadOk(L){if(RG().signStrange)return false;const near=new Set(['crook','cause','pit','ebbe','hollin','harrow']);return RD[L.road].slice(0,2).some(k=>near.has(k))&&['ec','ok','hs','cp','sp'].includes(L.road)}
const distrust=m=>m&&(m.sp==='fox'||m.sp==='stoat')?-10:0;
const roadName=r=>`${P_[RD[r][0]].name} to ${P_[RD[r][1]].name}`;

// ================= ROAMERS ON THE ROAD =================
async function meetRoamer(k,ro,L){
 const first=!ro.met;ro.met=1;
 const desc={cat:'CR-HCAT-DESC',rooks:'CR-ROOK-DESC',candle:'CR-CANDLE-DESC',lamp:'RE-LAMP-1'}[k];
 await say('',RLT(desc));
 if(k==='lamp'){const c=await evAsk('They are coming down the road.',['Wait them out (+1 day)','Stand']);
  if(c===0){L.extra++;await say('',RLT('CR-LAMP-PASS'));if(addSign('CR-LAMP-SIGN-1'))await say('','Their line runs back toward the hills. You note where.',{auto:G.auto?1:1200});return null}
  const res=await roadFight([foe('lamp')],{bg:'night',roamer:true,horror:'Unsettling'});if(res==='win'){ro.dead=1;addSign('CR-LAMP-SIGN-1')}return res}
 const lead_=lead(),sneak=`Sneak past (Stealth · ${odds(lead_,'Stealth')})`,opts=[sneak,'Fight','Turn back'];
 const items=[];if(hasItem('bangers'))items.push(['bangers','Bangers (slip past)']);if(hasItem('snare'))items.push(['snare','Snare']);if(k==='candle'&&hasItem('salt'))items.push(['salt','Salt line']);
 items.forEach(i=>opts.push(i[1]));
 const c=await evAsk('What does the company do?',opts);
 const foes=k==='cat'?[foe('hedgecat')]:k==='rooks'?rookFoes():[foe('candle')],o={roamer:true,bg:k==='candle'?'night':'dusk',horror:k==='candle'?'Unsettling':null};
 if(c===0){const s=StudioRoll.pct(lead_.sk.Stealth||0);if(s.ok){await say('',`${lead_.name} leads them past without a sound.`);return null}
  await say('','A stick cracks. It turns.');const r=await roadFight(foes,Object.assign(o,{ambush:true}));if(r==='win')ro.dead=1;return r}
 if(c===1){const r=await roadFight(foes,o);if(r==='win')ro.dead=1;return r}
 if(c===2){await say('','You turn back. The day is spent.');const g=RG(),back=RD[L.road][0]===L.to?RD[L.road][1]:RD[L.road][0];g.at=back;MAPV.cur=back;g.trip=null;await eatDay();saveRun();return 'back'}
 const it=items[c-3][0];useItem(it);
 if(it==='bangers'||it==='salt'){await say('',it==='salt'?'A line of salt across the road. It will not cross it.':'The bangers go off down the hedge. It goes after the noise.');return null}
 const r=await roadFight(foes,Object.assign(o,{stunFirst:true}));if(r==='win')ro.dead=1;return r;
}
function hasItem(id){return party.some(m=>!m.dead&&m.slots.some(s=>s.id===id))||(G.run.pack||[]).some(p=>p.id===id)}
function useItem(id){for(const m of party){const s=m.slots.find(s=>s.id===id);if(s){s.n=(s.n||1)-1;if(s.n<=0)m.slots.splice(m.slots.indexOf(s),1);return true}}
 const p=(G.run.pack||[]).find(p=>p.id===id);if(p){p.n=(p.n||1)-1;if(p.n<=0)G.run.pack.splice(G.run.pack.indexOf(p),1);return true}return false}

// ================= ROAD FIGHTS =================
// Folk enemies are dressed by the seed with a species from the March (their sprite is the species' map sprite).
function foe(k,o){const F=FOES[k],e=Object.assign({},F,o||{});if(F.folk&&!e.sp)e.sp=RLSP.ORDER[rnd(6)];e.skulls=skullsFor(e.lvl);return e}
function skullsFor(lvl){const avg=alive().reduce((a,m)=>a+m.lvl,0)/Math.max(1,alive().length),d=lvl-avg;return d<=0?1:d<=2?2:3}
const banditFoes=n=>Array.from({length:n},()=>foe('bandit'));
const rookFoes=()=>[0,1,2,3].map(()=>foe('rook'));
async function roadFight(foes,o){
 const res=await battle(foes,o);
 if(res==='lose'){await wipe();return 'end'}
 saveRun();return res;
}
// a wipe ends the run (Part E builds the death screen; until then, back to the title with rl.run cleared)
async function wipe(){
 if(typeof deathScreen==='function'){await deathScreen();return}
 await say('','Nobody gets up.');store.set(B.key('run'),null);G.run.ended=true;leave();B.goto('title');B.render();
}

// Until Part D's pay screen clears them, the between-contracts SAN at the inn, brothel and blessing clears when the
// company reaches a site it holds a contract for (spec 005, 5)
function atSite(k){const r=G.run;if(!r.contracts)return;if(r.contracts.some(c=>!c.done&&JOBS[c.id].site===k)&&!r.partD){r.between={bless:{},brothel:{}};RG().innSan={}}}
