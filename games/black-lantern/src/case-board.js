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
 shadow:'rgba(18,14,24,.55)',ring:'rgba(58,36,24,.45)',ringLo:'rgba(58,36,24,.2)',pinShut:'#7a6a4a',bRed:'#6e2e24',keyInk:'#fbe8d8'};

// ================= CASES AND THE SEASON SAVE =================
// Each case file calls registerCase({id, card, opening}) once it has loaded. card: {file, title, town, place, hook:[2 lines], pin}.
const CASES=[];
function registerCase(c){if(c&&c.id&&!CASES.some(x=>x.id===c.id))CASES.push(c)}
const caseById=id=>CASES.find(c=>c.id===id);
const seasonKey=()=>B.key('season');
// A fresh Season 1: every loaded case open, nothing closed, overstepping at Clean (spec 004, step 6)
function freshSeason(){const cases={};CASES.forEach(c=>{cases[c.id]={file:c.card.file,state:'open',ending:null}});return{season:1,cases,closed:0,overstep:0}}
// Reads bl.season. A case file the save doesn't know yet is added as open (no new save version needed).
function loadSeason(){
 let s=store.get(seasonKey(),null),changed=false;
 if(!s||typeof s!=='object'||Array.isArray(s)||!s.cases||typeof s.cases!=='object'){s=freshSeason();changed=true}
 for(const c of CASES)if(!s.cases[c.id]){s.cases[c.id]={file:c.card.file,state:'open',ending:null};changed=true}
 if(!Number.isInteger(s.season))s.season=1;if(!Number.isInteger(s.closed))s.closed=0;if(!Number.isInteger(s.overstep))s.overstep=0;
 if(changed)store.set(seasonKey(),s);
 return s;
}
// Finishing a case closes it, raises cases closed by one, and saves. How it ended is saved but not shown on the card.
function closeCase(id,ending,facts){const s=loadSeason(),e=s.cases[id];if(!e||e.state==='closed')return false;
 e.state='closed';e.ending=ending||'closed';if(facts)e.facts=facts;s.closed++;store.set(seasonKey(),s);return true}
const seasonClosed=()=>{const s=loadSeason();return Math.max(s.closed,Object.values(s.cases).filter(e=>e&&e.state==='closed').length)};
// New game: a fresh Season 1 over bl.season. The roster is never touched.
function newSeason(){store.set(seasonKey(),freshSeason())}

// ================= LAYOUT =================
// The mockup's five card spots on the cork (its px), filled in file order from the top left.
const SPOTS=[[10,12],[116,26],[222,8],[34,128],[150,140]];
const CARD_W=69,CARD_H=59,K=240/340;
function boardLayout(){
 const boxH=VH>=300?72:VH>=255?64:58;                 // the description box: all three lines and the key hints always fit
 const descY=VH-3-boxH,tabY=descY-12,hdr={x:3,y:3,w:VW-6,h:20};
 const cork={x:4,y:hdr.y+hdr.h+4,w:VW-8};cork.h=Math.max(CARD_H+10,tabY+4-cork.y);   // the cork gives up height first
 const sx=cork.w/328,sy=Math.min(K,(cork.h-CARD_H-6)/140);
 const spot=([x,y])=>({x:cork.x+Math.round(x*sx),y:cork.y+Math.max(5,Math.round(y*sy)),w:CARD_W,h:CARD_H});
 return{hdr,cork,descY,tabY,boxH,sx,sy,spot};
}

// ================= THE BOARD SCREEN =================
let CB=null;  // the open board: {from:'team'|'finish', sel, stamp:{id, t0}}
function boardCards(){
 const s=loadSeason();
 return CASES.filter(c=>s.cases[c.id]).sort((a,b)=>a.card.file-b.card.file).slice(0,SPOTS.length)
  .map(c=>({id:c.id,card:c.card,shut:s.cases[c.id].state==='closed'}));
}
// o.from: 'team' (Your team → START; B goes back to Your team) or 'finish' (after a case; B goes to the title)
function board(o={}){
 const cards=boardCards(),first=cards.findIndex(c=>!c.shut);
 CB={from:o.from||'team',sel:first>=0?first:0,stamp:o.stamp?{id:o.stamp,t0:performance.now()+300}:null};
 G=Object.assign(G,{busy:0,mode:'board',scene:null});
 enter();ban.hidden=true;
}
function closeBoard(){CB=null}
function boardPress(k){
 const cards=boardCards(),L=boardLayout(),rects=cards.map((c,i)=>L.spot(SPOTS[i]));
 if(k==='up'||k==='down'||k==='left'||k==='right'){CB.sel=StudioNearest.step(rects,CB.sel,k);return}
 if(k==='a'){const c=cards[CB.sel];if(!c||c.shut)return;     // closed cases stay closed
  const from=CB.from;closeBoard();if(!B.beginCase(c.id)){board({from});B.toast('BUILD A TEAM FIRST')}return}
 if(k==='b'){const back=CB.from==='team'?'team':'title';closeBoard();leave();B.goto(back);B.render();return}
}
cv.addEventListener('click',e=>{if(!CB||!G.active)return;const r=cv.getBoundingClientRect();if(!r.width)return;
 const x=(e.clientX-r.left)*VW/r.width,y=(e.clientY-r.top)*VH/r.height;
 const cards=boardCards(),L=boardLayout(),rects=cards.map((c,i)=>{const s=L.spot(SPOTS[i]);return{x:s.x,y:s.y-5,w:s.w,h:s.h+5}});
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
// the coffee ring and Big Hat's sticky note: not cases, just the board
function drawDecor(L){
 const c=L.cork,rx=c.x+Math.round(244*L.sx)+16,ry=c.y+Math.round(212*L.sy)+16;
 cx.lineWidth=3;cx.strokeStyle=CB_COL.ring;cx.beginPath();cx.arc(rx,ry,13,Math.PI*.35,Math.PI*1.85);cx.stroke();
 cx.strokeStyle=CB_COL.ringLo;cx.beginPath();cx.arc(rx,ry,13,-Math.PI*.15,Math.PI*.35);cx.stroke();
 const sx=c.x+Math.round(254*L.sx),sy=c.y+Math.round(122*L.sy);
 cx.save();cx.translate(sx+26,sy+23);cx.rotate(3*Math.PI/180);cx.translate(-26,-23);
 pR(2,2,52,46,'rgba(18,14,24,.5)');pBox(0,0,52,46,CB_COL.sticky,PC.dark);
 BW.sticky.forEach((l,i)=>pT(l,4,2+i*10,CB_COL.stickyInk,11));
 cx.restore();
}
function drawPin(x,y,col){cbDisc(x+.5,y+.5,5,PC.dark);cbDisc(x+.5,y+.5,4,col);cx.fillStyle='rgba(0,0,0,.3)';cx.fillRect(x+1,y+1,3,3);cx.fillStyle=col;cx.fillRect(x-2,y-2,3,3);pR(x-2,y-2,2,2,'#fff6dc')}
function drawCard(c,r,on,now){
 const lift=on?2:0,x=r.x-lift,y=r.y-lift;
 pR(x+3+lift,y+3+lift,CARD_W,CARD_H,CB_COL.shadow);
 if(on)pR(x-2,y-2,CARD_W+4,CARD_H+4,PC.gold);
 pBox(x,y,CARD_W,CARD_H,c.shut?CB_COL.paperShut:CB_COL.paper,PC.dark);
 drawPin(x+Math.round(CARD_W/2)-1,y,c.shut?CB_COL.pinShut:c.card.pin);
 const fade=c.shut?.55:1,tw=CARD_W-10,lines=cbWrap(c.card.title,tw,14,2);
 cbText(`${BW.file} ${String(c.card.file).padStart(2,'0')}`,x+5,y+6,CB_COL.file,11,VTf,fade);
 lines.forEach((l,i)=>cbText(l,x+5,y+16+i*11,PC.navy,14,VTf,fade));
 cbText(c.card.town,x+5,y+18+lines.length*11,CB_COL.town,11,VTf,fade);
 if(c.shut){  // the rust CLOSED stamp; just after a case closes it stamps down over about a quarter second
  let p=1;if(CB.stamp&&CB.stamp.id===c.id)p=clamp((now-CB.stamp.t0)/250,0,1);
  if(p>0){const s=1+(1-p)*1.4;cx.save();cx.globalAlpha=.9*p;cx.translate(x+CARD_W/2,y+40);cx.rotate(-12*Math.PI/180);cx.scale(s,s);
   const w=pW(BW.stamp,8,PXf)+8;pR(-w/2,-7,w,14,PC.rust);pR(-w/2+2,-5,w-4,10,'rgba(201,188,156,.85)');pT(BW.stamp,-w/2+4,-4,PC.rust,8,PXf);cx.restore()}
 }
}
// the gold arrow cursor (the mockup's 10 × 8 pixel arrow), pointing at the selected card
function drawCursor(r,now){
 const x=Math.max(0,r.x-14)+(Math.floor(now/400)%2),y=r.y+20;
 [2,4,6,8,10,8,6,4,2].forEach((w,i)=>pR(x,y+i,w,1,PC.dark));
 [0,1,3,5,7,5,3,1,0].forEach((w,i)=>{if(w)pR(x+1,y+i,w,1,PC.gold)});
}
// a round key badge (A rust, B dark red) with its letter drawn in pixels, so it stays crisp at any size
const KEY_GLYPH={A:['010','101','111','101','101'],B:['110','101','110','101','110']};
function drawKey(x,y,k){cbDisc(x+4.5,y+4.5,5,k==='A'?PC.rust:CB_COL.bRed);KEY_GLYPH[k].forEach((row,j)=>[...row].forEach((b,i)=>{if(b==='1')pR(x+3+i,y+2+j,1,1,CB_COL.keyInk)}))}
function drawDesc(L,c){
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
 if(c.shut){kx-=8+pW(BW.closed,12);pT(BW.closed,kx,ky-1,PC.rust,12)}
 else{const bx=kx-8-pW(BW.briefing,12);pT(BW.briefing,bx,ky-1,CB_COL.hint,12);kx=bx-13;drawKey(kx,ky,'A');hits.push({k:'a',x:kx-2,y:ky-3,w:bx+pW(BW.briefing,12)-kx+4,h:16})}
 CB.hits=hits;
}
function drawBoard(){
 const now=performance.now(),L=boardLayout(),s=loadSeason(),cards=boardCards();
 pR(0,0,VW,VH,PC.navy);drawCork(L);
 cx.save();cx.beginPath();cx.rect(L.cork.x,L.cork.y-6,L.cork.w,L.cork.h+6);cx.clip();
 drawDecor(L);
 cards.forEach((c,i)=>{if(i!==CB.sel)drawCard(c,L.spot(SPOTS[i]),false,now)});
 if(cards[CB.sel])drawCard(cards[CB.sel],L.spot(SPOTS[CB.sel]),true,now);
 cx.restore();
 if(cards[CB.sel])drawCursor(L.spot(SPOTS[CB.sel]),now);
 // header bar: SEASON n · CASE BOARD on the left, CLOSED n on the right
 const h=L.hdr,cl=`${BW.closed} ${s.closed}`;
 pBox(h.x,h.y,h.w,h.h,'rgba(27,31,51,.95)',PC.cream);
 pT(`${BW.season} ${s.season} · ${BW.title}`,h.x+6,h.y+3,PC.gold,15);pT(cl,h.x+h.w-6-pW(cl,15),h.y+3,PC.lav,15);
 if(cards[CB.sel])drawDesc(L,cards[CB.sel]);
}
