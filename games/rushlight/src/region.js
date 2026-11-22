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
function enterRegion(){G.mode='region';gEl.classList.add('region');const g=RG();MAPV={cur:g.at,key:false,page:null,log:[],cam:null};scout(g.at);applySan();saveRun()}
const SH=44;   // top strip height
function chartRect(){return {x:0,y:SH,w:VW,h:VH-SH-50}}
function camFor(k){const r=chartRect(),p=P_[k];return [clamp(p.x-r.w/2,0,MARCH.w-r.w),clamp(p.y-r.h/2,0,MARCH.h-r.h)]}
function drawRegion(){
 const r=chartRect(),g=RG();const want=camFor(MAPV.cur);if(!MAPV.cam)MAPV.cam=want.slice();MAPV.cam[0]+=(want[0]-MAPV.cam[0])*.2;MAPV.cam[1]+=(want[1]-MAPV.cam[1])*.2;
 const ox=Math.round(r.x-MAPV.cam[0]),oy=Math.round(r.y-MAPV.cam[1]);
 cx.save();cx.beginPath();cx.rect(r.x,r.y,r.w,r.h);cx.clip();drawChart(ox,oy);cx.restore();
 drawStrip();drawInset(r);drawTabs(r,ox,oy);drawRoadCard();
 if(MAPV.key)drawKey();if(MAPV.page==='contracts')drawContracts();
}
// the chart: parchment, river, scenery, roads, points, the coin token
const PARCH='#cfc2a0',PARCHD='#b8aa86',INK='#3a3028',INKL='#6a5c48';
function drawChart(ox,oy){
 const g=RG();pR(ox,oy,MARCH.w,MARCH.h,PARCH);
 for(let i=0;i<70;i++){const x=(i*97)%MARCH.w,y=(i*61)%MARCH.h;pR(ox+x,oy+y,2,1,PARCHD)}
 // river
 cx.strokeStyle='#5c6c7c';cx.lineWidth=5;cx.lineJoin='round';cx.beginPath();MARCH.river.forEach(([x,y],i)=>i?cx.lineTo(ox+x,oy+y):cx.moveTo(ox+x,oy+y));cx.stroke();
 cx.strokeStyle='#8a9aa8';cx.lineWidth=1;cx.stroke();
 MARCH.woods.forEach(([x,y])=>{[[0,0],[8,3],[3,8],[11,-4]].forEach(([a,b])=>{pR(ox+x+a,oy+y+b,6,5,'#56623a');pR(ox+x+a+1,oy+y+b+5,2,2,'#3a3028');pR(ox+x+a,oy+y+b,6,1,'#434d2c')})});
 MARCH.fields.forEach(([x,y])=>{for(let k=0;k<4;k++)pR(ox+x,oy+y+k*3,22,1,'#c8a552');pR(ox+x+24,oy+y,1,10,INKL)});
 MARCH.beds.forEach(([x,y])=>{for(let k=0;k<6;k++)pR(ox+x+k*4,oy+y+(k%2)*2,1,5,'#6a7a4a')});
 // roads: solid main roads, dashed side roads, day ticks; the march route in Tallow dots
 const rt=MAPV.cur!==g.at&&knownPt(MAPV.cur)?route(g.at,MAPV.cur):null,onRoute=new Set(rt?rt.legs.map(l=>l.road):[]);
 Object.keys(RD).forEach(id=>{if(!knownRoad(id))return;const R=RD[id],pts=[[P_[R[0]].x,P_[R[0]].y],...R[4],[P_[R[1]].x,P_[R[1]].y]];
  cx.strokeStyle=R[3]==='den'?'#5e1a18':INK;cx.lineWidth=R[3]==='main'?2:1;cx.setLineDash(R[3]==='main'?[]:[3,3]);cx.beginPath();pts.forEach(([x,y],i)=>i?cx.lineTo(ox+x,oy+y):cx.moveTo(ox+x,oy+y));cx.stroke();cx.setLineDash([]);
  // day ticks: one across the road for each day
  const n=roadDays(id);for(let d=1;d<=n;d++){const [tx,ty]=along(pts,d/(n+1));pR(ox+tx-1,oy+ty-1,3,3,INK)}
  if(onRoute.has(id)){const t=performance.now()/120;for(let q=0;q<14;q++){const [x,y]=along(pts,((q+t)%14)/14);pR(ox+x-1,oy+y-1,2,2,'#d9b45a')}}
  // roamer claws on a road where one was met
  Object.entries(g.roam).forEach(([k,ro])=>{if(ro.road===id&&ro.met&&!ro.dead){const [x,y]=along(pts,.5);claws(ox+x+4,oy+y-8)}});
 });
 // far ends not yet known: a pencil ? where a shown road leads
 g.roads.forEach(id=>RD[id].slice(0,2).forEach(k=>{if(!knownPt(k)){const p=P_[k];pT('?',ox+p.x-3,oy+p.y-8,INKL,16)}}));
 // points
 (g.seals||[]).forEach(k=>{const p=P_[k];if(!p)return;const x=ox+p.x+8,y=oy+p.y-12;cx.fillStyle='#9a4528';cx.beginPath();cx.arc(x,y,4,0,7);cx.fill();pR(x-1,y-1,2,2,'#5e1a18')});
 Object.keys(P_).forEach(k=>{if(!knownPt(k))return;const p=P_[k],x=ox+p.x,y=oy+p.y;
  if(p.kind==='lie'){const L=(G.run.rumors||{lies:{}}).lies[k]||{};pT('?',x-3,y-8,INKL,16);if(L.found){cx.strokeStyle=INK;cx.beginPath();cx.moveTo(x-6,y-6);cx.lineTo(x+6,y+6);cx.stroke()}pT(p.name,x-pW(p.name,11)/2,y+8,INKL,11);return}
  glyph(p.kind,x,y);
  const nm=p.kind==='town'?p.name:p.name,big=p.kind==='town';pT(nm,x-pW(nm,big?13:12)/2,y+8,INK,big?13:12)});
 // signs: margin notes by Lowmoor Pit's hills (Part D adds them where they're found)
 // the cursor
 const c=P_[MAPV.cur],b=Math.floor(performance.now()/300)%2;cx.strokeStyle='#d9b45a';cx.lineWidth=1;cx.strokeRect(ox+c.x-11-b,oy+c.y-11-b,22+2*b,22+2*b);
 // the coin token, struck with the lead's head
 const at=P_[g.at],coin=RLSP.coin(lead().sp);pR(ox+at.x+5,oy+at.y-4,15,3,'rgba(28,24,20,.3)');cx.drawImage(coin,ox+at.x+3,oy+at.y-20);
}
function along(pts,t){let L=0;const seg=[];for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);seg.push(d);L+=d}
 let want=t*L;for(let i=0;i<seg.length;i++){if(want<=seg[i]){const f=seg[i]?want/seg[i]:0;return [pts[i][0]+(pts[i+1][0]-pts[i][0])*f,pts[i][1]+(pts[i+1][1]-pts[i][1])*f]}want-=seg[i]}return pts[pts.length-1]}
function glyph(kind,x,y){const P=(a,b,w,h,c)=>pR(x+a,y+b,w,h,c);
 if(kind==='town'){P(-9,-6,18,10,INK);P(-8,-5,16,8,'#e6dcc4');P(-8,-9,4,4,INK);P(4,-9,4,4,INK);P(-2,-11,4,6,INK);P(-1,-2,2,5,INK);P(-6,-3,2,2,INK);P(4,-3,2,2,INK)}
 else if(kind==='hamlet'){P(-6,-4,6,6,INK);P(-5,-3,4,5,'#e6dcc4');P(1,-3,6,5,INK);P(2,-2,4,4,'#c8a552');P(-6,-6,6,2,INK);P(1,-5,6,2,INK)}
 else if(kind==='den'){P(-7,-4,14,8,'#5e1a18');P(-5,-2,10,4,'#1c1814');P(-1,-8,2,4,INK)}
 else{P(-5,-5,10,9,INK);P(-4,-4,8,7,'#c8a552');P(-1,-8,2,3,INK);P(-1,0,2,3,INK)}}
function claws(x,y){for(let k=0;k<3;k++){pR(x+k*3,y,1,5,'#9a4528');pR(x+k*3+1,y+4,1,2,'#9a4528')}}
// the top strip: row 1 party heads (lead in Tallow), where, purse, day, rations and the days they cover
function drawStrip(){const g=RG(),r=G.run;pR(0,0,VW,SH,'rgba(44,38,33,.97)');pR(0,SH-2,VW,2,'#e6dcc4');
 let x=3;party.forEach((m,i)=>{const on=i===(G.lead|0);pR(x-1,2,16,16,on?'#d9b45a':'#857e72');cx.drawImage(RLSP.portrait(m.sp,m.look),0,0,64,64,x,3,14,14);if(m.dead)pR(x,3,14,14,'rgba(28,24,20,.7)');x+=18});
 const where=(g.trip?'ON THE ROAD':'AT '+P_[g.at].name.toUpperCase());pT(pFit(where,92,13),x+2,3,'#e6dcc4',13);
 const live=Math.max(1,alive().length),days=Math.floor(r.rations/live),rs=`${r.rations}·${days}d`,ps=`${r.purse}gr`,ds=`DAY ${r.day}`;
 let rx=VW-3;[[ds,'#e6dcc4'],[rs,r.rations<live?'#c8603a':'#e6dcc4'],[ps,'#d9b45a']].forEach(([t,c])=>{rx-=pW(t,13);pT(t,rx,3,c,13);rx-=6});
 if((g.meat||[]).some(l=>l.d<=1))pT('MEAT ROTS TOMORROW',VW-3-pW('MEAT ROTS TOMORROW',11),13,'#c8603a',11);
 // row 2: the Hue and cry pips and the four factions (their rules come in Part C; here they only draw)
 const hue=(r.hue|0);pT('HUE',3,24,'#857e72',12);for(let k=0;k<4;k++)pR(22+k*6,28,4,6,k<hue?'#9a4528':'#4d4134');
 const F=[['LORD','lord'],['CHURCH','church'],['TOWN','town'],['OUTLAWS','outlaws']];let fx=52;
 F.forEach(([n,k])=>{const st=r.fac&&r.fac[k]?['HATED','WARY','NEUTRAL','TRUSTED','SWORN'][r.fac[k].step]:'NEUTRAL',t=n[0]+' '+st;pT(t,fx,24,'#c4b99e',11);fx+=pW(t,11)+6});
}
function drawInset(r){const w=46,h=40,x=r.x+r.w-w-3,y=r.y+3;pR(x,y,w,h,'#1c1814');pR(x+1,y+1,w-2,h-2,PARCH);
 Object.keys(P_).forEach(k=>{if(!knownPt(k))return;const p=P_[k];pR(x+1+p.x*(w-2)/MARCH.w-1,y+1+p.y*(h-2)/MARCH.h-1,3,3,k===RG().at?'#9a4528':INK)});
 const cr=chartRect();cx.strokeStyle='#d9b45a';cx.strokeRect(x+1+MAPV.cam[0]*(w-2)/MARCH.w,y+1+MAPV.cam[1]*(h-2)/MARCH.h,cr.w*(w-2)/MARCH.w,cr.h*(h-2)/MARCH.h)}
// edge tabs: known points off screen, named on the edge they lie past
function drawTabs(r,ox,oy){MAPV.tabs=[];Object.keys(P_).forEach(k=>{if(!knownPt(k))return;const p=P_[k],x=ox+p.x,y=oy+p.y;if(x>=r.x&&x<r.x+r.w&&y>=r.y&&y<r.y+r.h)return;
 const t=(x<r.x?'◀ ':'')+p.name.replace(/^the /,'').toUpperCase()+(x>=r.x+r.w?' ▶':''),w=pW(t,11)+6,tx=clamp(x-w/2,r.x+2,r.x+r.w-w-2),ty=clamp(y-6,r.y+46,r.y+r.h-14);
 pR(tx,ty,w,12,'#1c1814');pT(t,tx+3,ty-1,'#e6dcc4',11);MAPV.tabs.push({x:tx,y:ty,w,h:12,k})})}
// the road card: the point under the cursor, its days, rations needed against carried, event rolls, contract, threat
function drawRoadCard(){const g=RG(),r=G.run,y=VH-50,c=MAPV.cur,p=P_[c];pBox(2,y,VW-4,48,PAL.soot,PAL.bone,2);
 if(MAPV.log.length&&(g.trip||G.busy)){MAPV.log.slice(-3).forEach((l,i)=>pT(pFit(l,VW-14,14),7,y+3+i*14,i===MAPV.log.slice(-3).length-1?PAL.bone:'#c4b99e',14));return}
 pT(p.name.toUpperCase(),7,y+2,PAL.tallow,15);pT(p.type,VW-7-pW(p.type,13),y+3,'#c4b99e',13);
 if(c===g.at){pT('You are here. A: go in.',7,y+17,PAL.bone,14);pT('◀ ▶ ▲ ▼ pick a point · L key · R contracts',7,y+31,PAL.ash,12);return}
 const rt=route(g.at,c);if(!rt){pT('No known road there.',7,y+17,PAL.bone,14);return}
 const need=rationsNeed(rt.days);pT(`Road ${rt.days} day${rt.days>1?'s':''}`,7,y+17,PAL.bone,14);pT(`Food ${need} of ${r.rations}`,78,y+17,r.rations<need?'#c8603a':PAL.bone,14);
 const ev=`${rt.days} event roll${rt.days>1?'s':''}`;pT(ev,VW-7-pW(ev,14),y+17,PAL.bone,14);
 pT(`Threat ???`,7,y+31,'#c4b99e',14);pT('A go',VW-7-pW('A go',14),y+31,PAL.tallow,14);
}
function drawKey(){pR(0,0,VW,VH,'rgba(28,24,20,.7)');const w=200,h=168,x=(VW-w)/2,y=Math.max(8,(VH-h)/2);pBox(x,y,w,h,PAL.soot,PAL.bone,2);pT('KEY',x+8,y+4,PAL.tallow,8,PXf);
 const rows=[['town','Town'],['hamlet','Hamlet'],['site','Wild site'],['den','Den']];rows.forEach(([k,l],i)=>{const yy=y+26+i*18;pR(x+10,yy-4,24,16,PARCH);glyph(k,x+22,yy+4);pT(l,x+42,yy-2,PAL.bone,14)});
 let yy=y+26+4*18;[['main','Main road'],['side','Side road']].forEach(([k,l])=>{cx.strokeStyle=PAL.bone;cx.lineWidth=k==='main'?2:1;cx.setLineDash(k==='main'?[]:[3,3]);cx.beginPath();cx.moveTo(x+10,yy+4);cx.lineTo(x+34,yy+4);cx.stroke();cx.setLineDash([]);pT(l,x+42,yy-2,PAL.bone,14);yy+=16});
 pT('?',x+18,yy-3,PAL.bone,16);pT('Not yet known',x+42,yy-2,PAL.bone,14);yy+=16;claws(x+16,yy);pT('Roamer met here',x+42,yy-2,PAL.bone,14);yy+=16;
 cx.drawImage(RLSP.coin(lead().sp),x+14,yy-4);pT('The company (the lead)',x+42,yy-2,PAL.bone,14);pT('L or B: close',x+8,y+h-16,PAL.ash,13)}
function drawContracts(){pR(0,0,VW,VH,PAL.peat);pBox(4,4,VW-8,18,PAL.soot,PAL.bone);pT('CONTRACTS',9,9,PAL.tallow,8,PXf);let y=28;
 const cs=(G.run.contracts||[]).filter(c=>!c.done);if(!cs.length){pT(RW.noContracts,8,y,'#c4b99e',15);y+=18}
 else cs.forEach((c,i)=>{if(typeof CP_SEL!=='undefined'&&i===CP_SEL%cs.length)pR(4,y-1,3,12,PAL.tallow);pT(pFit(c.title,VW-16,15),8,y,PAL.bone,15);pT(pFit('NEXT: '+(c.next||''),VW-16,13),8,y+13,'#c4b99e',13);y+=30});
 pT(RW.signs,8,y+4,PAL.tallow,8,PXf);y+=18;const sg=RG().signs;if(!sg.length){pT(RW.noSigns,8,y,'#c4b99e',15);y+=14}
 sg.forEach(id=>{pWrap(RLT(id),VW-16,14,3).forEach(l=>{pT(l,8,y,PAL.bone,14);y+=12});y+=3});
 if(typeof drawContractsExtra==='function')y=drawContractsExtra(y);
 pT(cs.length?'A: keep or drop · R or B: back':'R or B: back',8,VH-16,PAL.ash,13)}

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
 const daysNow=roadDays(L.road)+L.extra;
 if(L.day<daysNow){await camp({road:true});if(!G.active)return 'end'}
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
 const extra=(o.client?1:0);
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
 const got=[];live.forEach(m=>{m.ko=false;m.hp=m.mhp;m.wp=m.mwp;m.hunger=0;m.st=(m.st||[]).filter(s=>s!=='Hungry'&&s!=='Starving');m.rest=(m.rest|0)+1;
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
