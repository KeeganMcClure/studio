// Black Lantern · case-board.js
// The season's case board (spec 004, Demo 3 of 6; Bible: Story, Case board; approved mockup option A, cork board).
// Your team → START opens it; A on an open card starts that case with its briefing; finishing a case comes back here
// with the card stamped CLOSED. Also keeps the season save, bl.season (Bible: Tech, Saving).
// Loaded after engine.js and party-menu.js as a plain script, so it shares the engine's G, cx, VW, VH, enter, leave,
// and party-menu.js's drawing helpers (pT, pW, pR, pBox, PC, VTf, PXf). Each case file registers itself here with
// registerCase(); the board never names a case. The move-to-the-nearest-card cursor is the studio's engine/nearest.js.
// Drawn on the game canvas at 240 px wide, scaled down from the mockup's 340 px screen (sizes × 0.7).

const BW=BLS.BOARD;
const CB_COL={frame:'#3a2418',frameLo:'#24160f',cork:'#8a5a32',corkLo:'#5e3a20',dots:['#6a4224','#a26c3e','#74492a'],
 paper:PC.cream,paperShut:'#c9bc9c',file:'#7a6a4a',town:'#8a3a22',hint:'#9a92c8',sticky:PC.mus,stickyInk:'#3a2418',
 shadow:'rgba(18,14,24,.55)',folder:'#17141c',pinAg:'#7a1a18',seal:'#b02a22',agInk:'#c9bc9c',ring:'rgba(58,36,24,.45)',ringLo:'rgba(58,36,24,.2)',pinShut:'#7a6a4a',bRed:'#6e2e24',keyInk:'#fbe8d8'};

// ================= CASES AND THE SEASON SAVE =================
// Each case file calls registerCase({id, card, opening}) once it has loaded. card: {file, title, town, place, hook:[2 lines], pin}.
const CASES=[];
function registerCase(c){if(c&&c.id&&!CASES.some(x=>x.id===c.id))CASES.push(c)}
const caseById=id=>CASES.find(c=>c.id===id);
const seasonKey=()=>B.key('season');
// A fresh season: nothing closed, overstepping at Clean (spec 004, step 6; spec 009, The save). Which cases it holds
// comes from the season data file (season.js); the six card spots fill from its queue. played and playedNow: the home
// scenes played this season and this break (spec 008 part C, home.js poolPick), so a new season starts them empty.
function freshSeason(n=1){return{season:n,cases:{},closed:0,overstep:0,hidden:[],agency:[],ended:false,past:[],carried:[],slots:[null,null,null,null,null,null],played:{},playedNow:{}}}
// Reads bl.season. A case the season lists that the save doesn't know yet is added as open (no new save version needed).
function loadSeason(){
 let s=store.get(seasonKey(),null),changed=false;
 if(!s||typeof s!=='object'||Array.isArray(s)||!s.cases||typeof s.cases!=='object'){s=freshSeason();changed=true}
 if(!Number.isInteger(s.season))s.season=1;if(!Number.isInteger(s.closed))s.closed=0;if(!Number.isInteger(s.overstep))s.overstep=0;if(!Array.isArray(s.hidden))s.hidden=[];
 for(const k of ['agency','past','carried'])if(!Array.isArray(s[k]))s[k]=[];if(typeof s.ended!=='boolean')s.ended=false;
 for(const k of ['played','playedNow'])if(!s[k]||typeof s[k]!=='object'||Array.isArray(s[k]))s[k]={};
 for(const id of seasonCaseIds(s)){const c=caseById(id);if(c&&!s.cases[id]){s.cases[id]={file:c.card.file,state:'open',ending:null};changed=true}}
 if(fillSlots(s))changed=true;
 if(changed)store.set(seasonKey(),s);
 return s;
}
// Finishing a case closes it and saves; a regular case raises cases closed by one, an agency case doesn't (Agency arc).
// How it ended is saved but not shown on the card. `at` orders the CLOSED pile.
function closeCase(id,ending,facts){const s=loadSeason(),e=s.cases[id];if(!e||e.state==='closed')return false;
 e.state='closed';e.ending=ending||'closed';if(facts)e.facts=facts;e.at=Object.values(s.cases).reduce((t,x)=>Math.max(t,x&&x.at|0),0)+1;
 if(!isAgencyId(s,id))s.closed++;store.set(seasonKey(),s);return true}
const seasonClosed=()=>{const s=loadSeason();return Math.max(s.closed,Object.values(s.cases).filter(e=>e&&e.state==='closed').length)};
// New game: a fresh Season 1 over bl.season (past seasons cleared too). The roster and memorial are never touched.
function newSeason(){store.set(seasonKey(),freshSeason(1))}

// ================= LAYOUT =================
// Six card spots, two rows of three (spec 009, Keegan picked Nov 22), then the bottom row: the CLOSED pile, the
// memorial plaque, and Big Hat's sticky note, which an open agency case covers. The cork gives up height first.
const CARD_W=69,CARD_H=59;
function boardLayout(){
 const boxH=VH>=300?72:VH>=255?64:58;                 // the description box: all three lines and the key hints always fit
 const descY=VH-3-boxH,tabY=descY-12,hdr={x:3,y:3,w:VW-6,h:20};
 const cork={x:4,y:hdr.y+hdr.h+4,w:VW-8};cork.h=Math.max(2*CARD_H+50,tabY+4-cork.y);
 const bh=clamp(cork.h-2*CARD_H-18,32,48),free=Math.max(0,cork.h-bh-2*CARD_H-20),gx=Math.floor((cork.w-12-3*CARD_W)/2);
 const y0=cork.y+6+Math.floor(free/3),y1=y0+CARD_H+4+Math.floor(free/3),by=cork.y+cork.h-bh-4;
 const spots=[0,1,2,3,4,5].map(i=>({x:cork.x+6+(i%3)*(CARD_W+gx),y:i<3?y0:y1,w:CARD_W,h:CARD_H}));
 const pile={x:cork.x+6,y:by,w:66,h:bh},plaque={x:cork.x+Math.round((cork.w-58)/2),y:by+Math.max(0,Math.round((bh-28)/2)),w:58,h:Math.min(28,bh)};
 const agency={x:spots[2].x,y:by,w:CARD_W,h:bh};
 return{hdr,cork,descY,tabY,boxH,spots,pile,plaque,agency};
}

// ================= THE BOARD SCREEN =================
let CB=null;  // the open board: {from, sel, stamp:{id, t0}, mem, files, end, thud, drop}
// The memorial plaque (spec 007, step 7) appears once bl.memorial has someone on it; it stays through New game.
const memorial=()=>{const m=store.get(B.key('memorial'),[]);return(Array.isArray(m)?m:[]).filter(x=>x&&typeof x==='object'&&x.name)};
// everything the cursor can reach: the cards in their spots, the CLOSED pile, the plaque, an open agency case
function boardTargets(L){const s=loadSeason(),t=[];
 s.slots.forEach((id,i)=>{const c=id&&caseById(id);if(c)t.push({kind:'card',id,c,shut:s.cases[id]&&s.cases[id].state==='closed',r:L.spots[i]})});
 const ag=openAgency(s);if(ag)t.push({kind:'card',id:ag,c:caseById(ag),agency:true,finale:isFinaleId(s,ag),r:L.agency});
 if(closedList(s).length)t.push({kind:'pile',r:L.pile});
 if(memorial().length)t.push({kind:'plaque',r:L.plaque});
 return t}
// o.from: 'team' (Your team → START; B goes back to Your team), 'finish' (after a case) or 'title' (B goes to the title)
function board(o={}){
 const t=boardTargets(boardLayout()),first=t.findIndex(x=>x.kind==='card'&&!x.shut);
 CB={from:o.from||'team',sel:first>=0?first:0,stamp:o.stamp?{id:o.stamp,t0:performance.now()+300}:null};
 G=Object.assign(G,{busy:0,mode:'board',scene:null});
 enter();ban.hidden=true;run(boardIntro);  // the stamp's slide, an agency unlock, or the season's end (season.js)
}
function closeBoard(){CB=null}
function boardPress(k){
 if(CB.mem){memPress(k);return}
 if(CB.files){filesPress(k);return}
 if(CB.end){if(k==='a'&&!CB.busy){CB.end=null;nextSeason();CB.sel=0}return}  // the season end screen: A begins the next season
 if(CB.busy&&k!=='b')return;  // the board's own scene is playing (season.js); B still leaves
 if(k==='start'&&window.Studio&&Studio.channel==='dev'){run(devPinAgency);return}  // Dev only: pin the next agency case (season.js)
 const L=boardLayout(),t=boardTargets(L),rects=t.map(x=>x.r);
 if(k==='up'||k==='down'||k==='left'||k==='right'){CB.sel=StudioNearest.step(rects,CB.sel,k);return}
 const x=t[CB.sel];
 if(k==='a'&&x&&x.kind==='plaque'){CB.mem={top:0};return}
 if(k==='a'&&x&&x.kind==='pile'){CB.files={top:0};return}
 // closed cases stay closed; the Dev build only lets one be played again, to test the home phase (spec 008 Done when)
 if(k==='a'){if(!x||x.kind!=='card'||x.shut&&!(window.Studio&&Studio.channel==='dev'))return;
  const from=CB.from;closeBoard();if(!B.beginCase(x.id)){board({from});B.toast('BUILD A TEAM FIRST')}return}
 if(k==='b'){const back=CB.from==='team'?'team':'title';closeBoard();leave();B.goto(back);B.render();return}
}
cv.addEventListener('click',e=>{if(!CB||!G.active)return;const r=cv.getBoundingClientRect();if(!r.width)return;
 const x=(e.clientX-r.left)*VW/r.width,y=(e.clientY-r.top)*VH/r.height;
 if(CB.mem||CB.files||CB.end){if(CB.end){boardPress('a');return}for(const h of CB.hits||[])if(x>=h.x&&x<h.x+h.w&&y>=h.y&&y<h.y+h.h){boardPress(h.k);return}return}
 const rects=boardTargets(boardLayout()).map(t=>({x:t.r.x,y:t.r.y-5,w:t.r.w,h:t.r.h+5}));
 const i=StudioNearest.at(rects,x,y);
 if(i>=0){if(i===CB.sel)boardPress('a');else CB.sel=i;return}
 for(const h of CB.hits||[])if(x>=h.x&&x<h.x+h.w&&y>=h.y&&y<h.y+h.h){boardPress(h.k);return}
});

// ---------- drawing ----------
function cbText(s,x,y,col,size,font=VTf,alpha=1){cx.globalAlpha=alpha;pT(s,x,y,col,size,font);cx.globalAlpha=1}
function cbWrap(s,w,size,max){const out=[];let line='';for(const word of String(s).split(/\s+/).filter(Boolean)){const t=line?line+' '+word:word;if(pW(t,size)<=w||!line)line=t;else{out.push(line);line=word}}if(line)out.push(line);return out.slice(0,max)}
function cbDisc(x,y,r,col){cx.fillStyle=col;cx.beginPath();cx.arc(x,y,r,0,Math.PI*2);cx.fill()}
// the cork, its dots and the frame around it
function drawCork(L){
 pR(0,0,VW,L.descY-2,CB_COL.frame);pR(0,L.descY-4,VW,2,CB_COL.frameLo);
 const c=L.cork;pR(c.x,c.y,c.w,c.h,CB_COL.cork);
 for(let k=0;k<3;k++){const gx=[5,8,9][k],gy=[6,5,9][k],ox=[0,3,6][k],oy=[0,2,4][k];cx.fillStyle=CB_COL.dots[k];
  for(let y=c.y+oy;y<c.y+c.h;y+=gy)for(let x=c.x+ox+((y/gy|0)%2)*2;x<c.x+c.w;x+=gx)cx.fillRect(x,y,1,1)}
 pR(c.x,c.y,c.w,2,CB_COL.corkLo);pR(c.x,c.y,2,c.h,CB_COL.corkLo);
}
// the coffee ring and Big Hat's sticky note: not cases, just the board. An open agency case covers the note.
function drawDecor(L,s){
 const c=L.cork,rx=c.x+c.w-40,ry=L.spots[3].y+CARD_H-6;
 cx.lineWidth=3;cx.strokeStyle=CB_COL.ring;cx.beginPath();cx.arc(rx,ry,13,Math.PI*.35,Math.PI*1.85);cx.stroke();
 cx.strokeStyle=CB_COL.ringLo;cx.beginPath();cx.arc(rx,ry,13,-Math.PI*.15,Math.PI*.35);cx.stroke();
 if(openAgency(s))return;
 const r=L.agency,lines=seasonDef(s.season)?BW.sticky:BW.stickyMore,h=Math.min(r.h,lines.length*9+6);
 cx.save();cx.translate(r.x+r.w/2,r.y+h/2);cx.rotate(3*Math.PI/180);cx.translate(-r.w/2,-h/2);
 pR(2,2,r.w-6,h,'rgba(18,14,24,.5)');pBox(0,0,r.w-6,h,CB_COL.sticky,PC.dark);
 lines.forEach((l,i)=>pT(l,4,1+i*9,CB_COL.stickyInk,11));
 cx.restore();
}
function drawPin(x,y,col){cbDisc(x+.5,y+.5,5,PC.dark);cbDisc(x+.5,y+.5,4,col);cx.fillStyle='rgba(0,0,0,.3)';cx.fillRect(x+1,y+1,3,3);cx.fillStyle=col;cx.fillRect(x-2,y-2,3,3);pR(x-2,y-2,2,2,'#fff6dc')}
function drawCard(c,r,on,now){
 const W=r.w,H=r.h,lift=on?2:0,x=r.x-lift;let y=r.y-lift;
 if(c.agency&&CB.thud){const p=clamp((now-CB.thud.t0)/220,0,1);y-=Math.round((1-p)*14)}  // the folder pins on with a thud
 if(!c.agency&&CB.drop){const p=clamp((now-CB.drop.t0)/250,0,1);if(p<1&&!c.shut)y-=Math.round((1-p)*10)}
 pR(x+3+lift,y+3+lift,W,H,CB_COL.shadow);
 if(on)pR(x-2,y-2,W+4,H+4,PC.gold);
 if(c.agency){pBox(x,y,W,H,CB_COL.folder,c.finale?PC.gold:PC.dark,c.finale?2:1);drawPin(x+Math.round(W/2)-1,y,CB_COL.pinAg);
  pT(`${BW.lantern} ${String(c.c.card.file).padStart(2,'0')}`,x+5,y+3,c.finale?PC.gold:CB_COL.agInk,11);
  const lines=cbWrap(c.c.card.title,W-22,H>=44?14:13,H>=44?2:1);lines.forEach((l,i)=>pT(l,x+5,y+13+i*11,PC.cream,H>=44?14:13));
  if(H>=48)pT(c.finale?BW.finale:c.c.card.town,x+5,y+35,c.finale?PC.gold:CB_COL.town,11);  // the finale says FINALE under its number
  else if(c.finale&&H>=36)pT(BW.finale,x+5,y+H-11,PC.gold,11);  // a short card still says FINALE, under its one title line
  cbDisc(x+W-9,y+H-9,6,CB_COL.seal);cbDisc(x+W-9,y+H-9,4,'#8a1a18');pR(x+W-10,y+H-12,2,5,'#f0c070');return}
 pBox(x,y,W,H,c.shut?CB_COL.paperShut:CB_COL.paper,PC.dark);
 drawPin(x+Math.round(W/2)-1,y,c.shut?CB_COL.pinShut:c.c.card.pin);
 const fade=c.shut?.55:1,tw=W-10,lines=cbWrap(c.c.card.title,tw,14,2);
 cbText(`${BW.file} ${String(c.c.card.file).padStart(2,'0')}`,x+5,y+6,CB_COL.file,11,VTf,fade);
 lines.forEach((l,i)=>cbText(l,x+5,y+16+i*11,PC.navy,14,VTf,fade));
 cbText(c.c.card.town,x+5,y+18+lines.length*11,CB_COL.town,11,VTf,fade);
 if(c.shut){  // the rust CLOSED stamp; just after a case closes it stamps down over about a quarter second
  let p=1;if(CB.stamp&&CB.stamp.id===c.id)p=clamp((now-CB.stamp.t0)/250,0,1);
  if(p>0){const s=1+(1-p)*1.4;cx.save();cx.globalAlpha=.9*p;cx.translate(x+W/2,y+40);cx.rotate(-12*Math.PI/180);cx.scale(s,s);
   const w=pW(BW.stamp,8,PXf)+8;pR(-w/2,-7,w,14,PC.rust);pR(-w/2+2,-5,w-4,10,'rgba(201,188,156,.85)');pT(BW.stamp,-w/2+4,-4,PC.rust,8,PXf);cx.restore()}
 }
}
// the CLOSED pile: a short stack of greyed cards with the rust stamp and the count
function drawPile(r,on,n){
 const x=r.x-(on?1:0),y=r.y-(on?1:0);
 for(let i=Math.min(2,n-1);i>=0;i--)pBox(x+i*3,y+i*2,r.w-6,r.h-4,CB_COL.paperShut,PC.dark);
 pR(x+3,y+r.h,r.w-6,2,CB_COL.shadow);if(on){cx.strokeStyle=PC.gold;cx.lineWidth=2;cx.strokeRect(x-2,y-2,r.w+2,r.h+2)}
 cx.save();cx.translate(x+24,y+Math.round(r.h/2)-5);cx.rotate(-8*Math.PI/180);const w=pW(BW.stamp,6,PXf)+6;pR(-w/2,-6,w,12,PC.rust);pR(-w/2+1,-5,w-2,10,'rgba(201,188,156,.9)');pT(BW.stamp,-w/2+3,-3,PC.rust,6,PXf);cx.restore();
 const t=fillT(n===1?BW.file1:BW.files,{n});pT(t,x+r.w-8-pW(t,12),y+r.h-16,PC.navy,12)}
// the gold arrow cursor (the mockup's 10 × 8 pixel arrow), pointing at the selected card
function drawCursor(r,now){
 const x=Math.max(0,r.x-14)+(Math.floor(now/400)%2),y=r.y+20;
 [2,4,6,8,10,8,6,4,2].forEach((w,i)=>pR(x,y+i,w,1,PC.dark));
 [0,1,3,5,7,5,3,1,0].forEach((w,i)=>{if(w)pR(x+1,y+i,w,1,PC.gold)});
}
// a round key badge (A rust, B dark red) with its letter drawn in pixels, so it stays crisp at any size
const KEY_GLYPH={A:['010','101','111','101','101'],B:['110','101','110','101','110']};
function drawKey(x,y,k){cbDisc(x+4.5,y+4.5,5,k==='A'?PC.rust:CB_COL.bRed);KEY_GLYPH[k].forEach((row,j)=>[...row].forEach((b,i)=>{if(b==='1')pR(x+3+i,y+2+j,1,1,CB_COL.keyInk)}))}
function drawDesc(L,t){
 const c=Object.assign({},t.c,{card:Object.assign({},t.c.card)}),sh=t.shut;
 if(t.agency)c.card.place=`${t.finale?BW.finalePlace:BW.agencyPlace} · ${t.c.card.place}`;
 const right=VW-3,x0=3,inner=VW-6-14;
 // tab with the case title, then the box
 const tw=Math.min(VW-12,pW(c.card.title,14)+10);
 pR(6,L.tabY,tw,13,PC.cream);pR(7,L.tabY+1,tw-2,13,PC.navy);pT(c.card.title,11,L.tabY,PC.gold,14);
 pBox(x0,L.descY,VW-6,L.boxH,PC.navy,PC.cream);pR(7,L.descY,tw-2,1,PC.navy);
 // largest size that fits the place line and both hook lines across the box
 const lines=[c.card.place,...c.card.hook];let fs=14;while(fs>11&&lines.some(l=>pW(l,fs)>inner))fs--;
 const lh=fs-1,ty=L.descY+3+Math.max(0,Math.floor((L.boxH-16-3*lh)/3));
 pT(c.card.place,x0+7,ty,PC.mus,fs);
 c.card.hook.forEach((l,i)=>pT(l,x0+7,ty+lh*(i+1),PC.cream,fs));
 // key hints, bottom right: A BRIEFING (or CLOSED on a closed card) and B BACK
 const ky=L.descY+L.boxH-13,hits=[];
 let kx=right-7-pW(BW.back,12);pT(BW.back,kx,ky-1,CB_COL.hint,12);kx-=13;drawKey(kx,ky,'B');hits.push({k:'b',x:kx-2,y:ky-3,w:right-kx,h:16});
 if(sh){kx-=8+pW(BW.closed,12);pT(BW.closed,kx,ky-1,PC.rust,12)}
 else{const bx=kx-8-pW(BW.briefing,12);pT(BW.briefing,bx,ky-1,CB_COL.hint,12);kx=bx-13;drawKey(kx,ky,'A');hits.push({k:'a',x:kx-2,y:ky-3,w:bx+pW(BW.briefing,12)-kx+4,h:16})}
 CB.hits=hits;
}
// the plaque: small dark wood with a brass edge and two lines of brass letters
function drawPlaque(r,on,n){
 const x=r.x-(on?1:0),y=r.y-(on?1:0);pR(x+2,y+2,r.w,r.h,CB_COL.shadow);if(on)pR(x-2,y-2,r.w+4,r.h+4,PC.gold);
 pBox(x,y,r.w,r.h,'#2a1a10','#b8955a',2);pR(x+3,y+3,r.w-6,1,'#4a2f1a');
 const a=BLS.DEBRIEF.plaque,t=String(n);pT(a,x+(r.w-pW(a,5,PXf))/2,y+6,'#d6b46a',5,PXf);pT(t,x+(r.w-pW(t,12))/2,y+11,'#d6b46a',12);
 drawPin(x+Math.round(r.w/2)-1,y,'#b8955a')}
function drawPlaqueDesc(L){
 const right=VW-3,ms=memorial(),W=BLS.DEBRIEF,tw=pW(W.memorial,14)+10;
 pR(6,L.tabY,tw,13,PC.cream);pR(7,L.tabY+1,tw-2,13,PC.navy);pT(W.memorial,11,L.tabY,PC.gold,14);
 pBox(3,L.descY,VW-6,L.boxH,PC.navy,PC.cream);pR(7,L.descY,tw-2,1,PC.navy);
 ms.slice(-2).reverse().forEach((x,i)=>pT(pFit(`${String(x.name).split(' ')[0].toUpperCase()} · ${W.how[x.how]||x.how||''}`,VW-20,14),10,L.descY+4+i*13,i?PC.lav:PC.cream,14));
 const ky=L.descY+L.boxH-13,hits=[];let kx=right-7-pW(BW.back,12);pT(BW.back,kx,ky-1,CB_COL.hint,12);kx-=13;drawKey(kx,ky,'B');hits.push({k:'b',x:kx-2,y:ky-3,w:right-kx,h:16});
 const bx=kx-8-pW(W.memA,12);pT(W.memA,bx,ky-1,CB_COL.hint,12);kx=bx-13;drawKey(kx,ky,'A');hits.push({k:'a',x:kx-2,y:ky-3,w:bx+pW(W.memA,12)-kx+4,h:16});CB.hits=hits}
// MEMORIAL, in the Lantern Bust style: one row per agent, newest first. Up/Down scroll, B closes.
function memPress(k){const n=memorial().length;if(k==='up')CB.mem.top=Math.max(0,CB.mem.top-1);else if(k==='down')CB.mem.top=Math.min(Math.max(0,n-1),CB.mem.top+1);else if(k==='b'||k==='a')CB.mem=null}
function drawMemorial(){
 const W=BLS.DEBRIEF,ms=memorial().slice().reverse(),RH=44,top=26,avail=Math.max(1,Math.floor((VH-top-20)/RH));CB.mem.top=clamp(CB.mem.top,0,Math.max(0,ms.length-avail));
 pR(0,0,VW,VH,PC.navy);pBox(4,4,232,18,PC.deep,PC.cream);pT(W.memorial,10,9,PC.gold,8,PXf);const c=`${ms.length}`;pT(c,230-pW(c,14),5,PC.lav,14);
 ms.slice(CB.mem.top,CB.mem.top+avail).forEach((x,k)=>{const y=top+k*RH,ret=x.how==='retired',a=x.a&&x.a.look?x.a:null;
  pBox(4,y,232,RH-3,PC.card,PC.dim);pR(8,y+4,34,34,PC.plum);if(a)cx.drawImage(faceOf(a,1),9,y+5);
  pT(pFit(String(x.name).split(' ')[0].toUpperCase(),110,16),48,y+1,PC.gold,16);
  const pf=(profOf(a||{prof:x.prof})||{}).name||'';pT(pFit(pf,80,12),231-pW(pFit(pf,80,12),12),y+3,PC.lav,12);
  pT(`${fillT(W.memCases,{k:x.cases|0})} · ${fillT(W.memSeason,{s:x.season||1})}`,48,y+14,PC.lav,13);
  pT(W.how[x.how]||x.how||'',48,y+26,ret?PC.lav:PC.pink,14)});
 if(ms.length>avail)pT(`${CB.mem.top+1}–${Math.min(ms.length,CB.mem.top+avail)}/${ms.length}`,230-pW(`${CB.mem.top+1}–${Math.min(ms.length,CB.mem.top+avail)}/${ms.length}`,12),VH-16,PC.lav,12);
 pT(W.memKeys,8,VH-16,PC.dim,13);
 CB.hits=[{k:'b',x:0,y:0,w:VW,h:24}];
}
// CLOSED FILES, in the Lantern Bust style: one row per closed case, newest first (FILE or LANTERN number, title, town)
function filesPress(k){const n=closedList(loadSeason()).length;if(k==='up')CB.files.top=Math.max(0,CB.files.top-1);else if(k==='down')CB.files.top=Math.min(Math.max(0,n-1),CB.files.top+1);else if(k==='b'||k==='a')CB.files=null}
function drawFiles(){
 const s=loadSeason(),fs=closedList(s),RH=30,top=26,avail=Math.max(1,Math.floor((VH-top-20)/RH));CB.files.top=clamp(CB.files.top,0,Math.max(0,fs.length-avail));
 pR(0,0,VW,VH,PC.navy);pBox(4,4,232,18,PC.deep,PC.cream);pT(BW.closedFiles,10,9,PC.gold,8,PXf);const c=`${fs.length}`;pT(c,230-pW(c,14),5,PC.lav,14);
 fs.slice(CB.files.top,CB.files.top+avail).forEach((f,k)=>{const y=top+k*RH,ag=isAgencyId(s,f.id),card=f.c?f.c.card:{file:f.e.file,title:f.id,town:''};
  pBox(4,y,232,RH-3,ag?CB_COL.folder:PC.card,PC.dim);pT(`${ag?BW.lantern:BW.file} ${String(card.file).padStart(2,'0')}`,10,y+1,ag?CB_COL.agInk:PC.lav,12);
  pT(pFit(card.title,150,15),10,y+11,PC.cream,15);const t=pFit(card.town||'',80,12);pT(t,230-pW(t,12),y+13,CB_COL.town,12)});
 pT(MMW.rulesKeys,8,VH-16,PC.dim,13);CB.hits=[{k:'b',x:0,y:0,w:VW,h:24}];
}
// the season end screen: SEASON n CLOSED over the board, with every card on the pile, and one box that sums it up
function drawSeasonEnd(L,s){
 const st=BLS.OVERSTEP.open,mem=memorial().filter(x=>x.season===s.season).length,ag=(s.agency||[]).filter(a=>s.cases[a.id]&&s.cases[a.id].state==='closed').length;
 const n=closedList(s).length;if(n)drawPile(L.pile,false,n);
 const y=L.cork.y+16,h=Math.min(96,L.cork.h-L.pile.h-28);cx.fillStyle='rgba(10,8,18,.6)';cx.fillRect(L.cork.x,L.cork.y,L.cork.w,L.cork.h-L.pile.h-8);
 pBox(14,y,VW-28,h,PC.navy,PC.gold,2);const t=fillT(BW.endTitle,{n:s.season});pT(t,(VW-pW(t,9,PXf))/2,y+7,PC.gold,9,PXf);
 [[BW.endRegular,s.closed],[BW.endAgency,ag],[BW.endLost,mem],[BW.endStep,st[Math.min(s.overstep|0,st.length-1)]]].forEach(([k,v],i)=>{const ry=y+22+i*15;if(ry+12>y+h)return;
  pT(k,24,ry,PC.lav,14);const vs=String(v);pT(vs,VW-24-pW(vs,14),ry,PC.cream,14)});
 if(!CB.busy)pT(BW.endKeys,(VW-pW(BW.endKeys,13))/2,L.descY+L.boxH-16,PC.lav,13);
}
function drawBoard(){
 if(CB.mem)return drawMemorial();
 if(CB.files)return drawFiles();
 const now=performance.now(),L=boardLayout(),s=loadSeason(),t=boardTargets(L),mem=memorial();if(CB.sel>=t.length)CB.sel=Math.max(0,t.length-1);
 pR(0,0,VW,VH,PC.navy);drawCork(L);
 // header bar: SEASON n · CASE BOARD on the left, CLOSED n (regular cases) on the right
 const h=L.hdr,cl=`${BW.closed} ${s.closed}`;
 if(CB.end){drawSeasonEnd(L,s);pBox(h.x,h.y,h.w,h.h,'rgba(27,31,51,.95)',PC.cream);pT(`${BW.season} ${s.season} · ${BW.title}`,h.x+6,h.y+3,PC.gold,15);pT(cl,h.x+h.w-6-pW(cl,15),h.y+3,PC.lav,15);CB.hits=[];return}
 cx.save();cx.beginPath();cx.rect(L.cork.x,L.cork.y-6,L.cork.w,L.cork.h+6);cx.clip();
 drawDecor(L,s);
 const draw=(x,on)=>{if(x.kind==='card'){
   // just after a case closes: its stamp lands in its spot, then it slides onto the pile (spec 009, step 2)
   let r=x.r;if(x.shut&&CB.stamp&&CB.stamp.id===x.id){const p=clamp((now-CB.stamp.t0-650)/350,0,1);if(p>=1)return;r={x:r.x+(L.pile.x-r.x)*p,y:r.y+(L.pile.y-r.y)*p,w:r.w,h:r.h}}
   drawCard(x,r,on,now)}
  else if(x.kind==='pile')drawPile(x.r,on,closedList(s).length);else drawPlaque(x.r,on,mem.length)};
 t.forEach((x,i)=>{if(i!==CB.sel)draw(x,false)});if(t[CB.sel])draw(t[CB.sel],true);
 cx.restore();
 const sel=t[CB.sel];if(sel)drawCursor(sel.kind==='card'?sel.r:Object.assign({},sel.r,{y:sel.r.y-Math.max(0,20-sel.r.h/2)}),now);
 pBox(h.x,h.y,h.w,h.h,'rgba(27,31,51,.95)',PC.cream);
 pT(`${BW.season} ${s.season} · ${BW.title}`,h.x+6,h.y+3,PC.gold,15);pT(cl,h.x+h.w-6-pW(cl,15),h.y+3,PC.lav,15);
 if(!sel){CB.hits=[];return}
 if(sel.kind==='plaque')drawPlaqueDesc(L);else if(sel.kind==='pile')drawPileDesc(L,s);else drawDesc(L,sel);
}
function drawPileDesc(L,s){
 const right=VW-3,fs=closedList(s),tw=pW(BW.closedFiles,14)+10;
 pR(6,L.tabY,tw,13,PC.cream);pR(7,L.tabY+1,tw-2,13,PC.navy);pT(BW.closedFiles,11,L.tabY,PC.gold,14);
 pBox(3,L.descY,VW-6,L.boxH,PC.navy,PC.cream);pR(7,L.descY,tw-2,1,PC.navy);
 fs.slice(0,2).forEach((f,i)=>pT(pFit(f.c?f.c.card.title:f.id,VW-20,14),10,L.descY+4+i*13,i?PC.lav:PC.cream,14));
 const ky=L.descY+L.boxH-13,hits=[];let kx=right-7-pW(BW.back,12);pT(BW.back,kx,ky-1,CB_COL.hint,12);kx-=13;drawKey(kx,ky,'B');hits.push({k:'b',x:kx-2,y:ky-3,w:right-kx,h:16});
 const bx=kx-8-pW(BLS.DEBRIEF.memA,12);pT(BLS.DEBRIEF.memA,bx,ky-1,CB_COL.hint,12);kx=bx-13;drawKey(kx,ky,'A');hits.push({k:'a',x:kx-2,y:ky-3,w:bx+pW(BLS.DEBRIEF.memA,12)-kx+4,h:16});CB.hits=hits}
