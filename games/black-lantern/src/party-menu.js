// Black Lantern · party-menu.js
// Start → Party (spec 002, Demo 2 of 6): three agent cards in seat order with the lead marked, a detail box,
// the Make lead / Dossier / Give item popup, the Dossier (INFO, SKILLS, BONDS), and Select cycling the lead on the map.
// The card list itself (cursor, wrap, popup, taps, blink) and the lead cycling are the studio's shared engine/party.js;
// this file says what a card shows, the words (strings.js, PARTY and STATUS) and the colors.
// Loaded after engine.js as a plain script, so it shares the engine's party, G, cx, lead() and the rest.
// Drawn on the game canvas at 240 px wide, matching the spec 002 mockup and the approved Nov 20 party and dossier mockups.

const PW=BLS.PARTY,PST=BLS.STATUS;
const PC={navy:'#1b1f33',deep:'#14172a',card:'#1f2440',cardOn:'#2a2f52',plum:'#2a2030',cream:'#e8dcc0',lav:'#b9a8e0',mus:'#d6a43a',gold:'#f4c96a',
 rust:'#b5532e',pump:'#d9772b',pink:'#ff4fa3',green:'#7fbf6a',dim:'#5a5070',dark:'#120e18',sanbar:'#9aa3d6',blink:'#3a2238',chipInk:'#fbe8d8'};
const VTf=s=>`${s}px "VT323",monospace`,PXf=s=>`${s}px "Press Start 2P",monospace`;
function pT(s,x,y,col,size=16,font=VTf){cx.font=font(size);cx.fillStyle=col;cx.textBaseline='top';cx.fillText(s,Math.round(x),Math.round(y))}
function pW(s,size=16,font=VTf){cx.font=font(size);return cx.measureText(s).width}
function pR(x,y,w,h,c){cx.fillStyle=c;cx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))}
function pBox(x,y,w,h,fill,line,lw=1){pR(x,y,w,h,line);pR(x+lw,y+lw,w-2*lw,h-2*lw,fill)}
function pFit(s,w,size=16,font=VTf){s=String(s);if(pW(s,size,font)<=w)return s;while(s.length>1&&pW(s+'…',size,font)>w)s=s.slice(0,-1);return s.replace(/\s+$/,'')+'…'}
function pWrap(s,w,size=16,max=9){const out=[];let line='';for(const word of String(s).split(/\s+/).filter(Boolean)){const t=line?line+' '+word:word;if(pW(t,size)<=w||!line)line=t;else{out.push(line);line=word}}if(line)out.push(line);
 if(out.length>max){out.length=max;out[max-1]=pFit(out[max-1]+' …',w,size)}return out.map(l=>pFit(l,w,size))}
function pBar(x,y,w,frac,col){pR(x,y,w,5,PC.dark);pR(x+1,y+1,w-2,3,PC.plum);pR(x+1,y+1,Math.round((w-2)*clamp(frac,0,1)),3,col)}
function pLantern(x,y){pR(x+1,y,3,1,PC.navy);pR(x,y+1,5,5,PC.navy);pR(x+1,y+2,3,3,'#fff1c4');pR(x+1,y+6,3,1,PC.navy)}
function pLeadTag(right,y){const w=pW(PW.lead,14)+12;pR(right-w,y,w,11,PC.mus);pLantern(right-w+2,y+2);pT(PW.lead,right-w+9,y-1,PC.navy,14);return right-w}
// the creator's 32 × 32 Storybook face, cached per look (scale 2 = the 64 × 64 dossier face)
const faceCache={};
function faceOf(a,scale){const k=JSON.stringify([a.prof,a.look,scale]);if(!faceCache[k]){const c=document.createElement('canvas');B.drawPortrait(c,a,scale,false);faceCache[k]=c}return faceCache[k]}

// ================= WHO LEADS =================
const statusesOf=m=>(m.st||[]).filter(k=>PST[k]);
const canLead=i=>{const m=party[i];return !!m&&!m.ko&&m.san>0};  // lost or Downed agents are skipped
const lowPulse=m=>m.hp<=3||statusesOf(m).some(k=>PST[k].pulse);  // Quality of life: low-health pulse
// The lead goes into the checkpoint at once, so it survives closing the game and a Retry from checkpoint.
function saveLead(){if(!G.cp)return;try{const o=JSON.parse(G.cp);o.lead=G.lead|0;G.cp=JSON.stringify(o);store.set(B.key('game'),G.cp)}catch(e){}}
function setLead(i){if(i===(G.lead|0)||!canLead(i))return false;G.lead=i;applySan();saveLead();return true}
function cycleLead(){return setLead(StudioParty.next(party.length,G.lead|0,canLead))}
// Select on the map: only while the lead is free to walk (not in dialog, menus, cutscenes, scripted moves, mid-step or battle)
function mapSelect(){
 if(!StudioParty.canSwap({battle:!!Bt||G.mode==='battle',dialog:!!dlg,menu:!!menu||!!PM,cutscene:G.mode!=='world',moving:!!G.mv,busy:!!G.busy}))return;
 if(cycleLead())banner(PW.banner+lead().name.toUpperCase(),1000);
}

// ================= PARTY SCREEN =================
let PM=null;  // the open party screen: {view:'list'|'dossier', list, d:{i, tab}, done}
function openParty(){return new Promise(res=>{
 PM={view:'list',done:res,d:null,list:StudioParty.list({
  count:()=>party.length,lead:()=>G.lead|0,cycle:cycleLead,close:closeParty,pulse:i=>lowPulse(party[i]),
  actions:i=>[{label:PW.makeLead,dis:i===(G.lead|0)||!canLead(i),why:PW.isLead,run:()=>setLead(i)},
   {label:PW.dossier,run:()=>openDossier(i)},
   {label:PW.give,dis:true,why:PW.giveWhy}],  // greyed until Demo 5 brings item slots (spec 002, Open question 2)
  paint:{header:paintHeader,card:paintCard,detail:paintDetail},
  colors:{box:PC.deep,border:PC.cream,shadow:'#0a0812',on:PC.cardOn,text:PC.cream,dim:PC.dim,cursor:PC.gold},
  font:VTf(16),headerH:18,cardH:50,gap:4,detailMin:44})};
 PM.list.reset(G.lead|0);sanEl.hidden=true;ban.hidden=true;
})}
function closeParty(){const p=PM;PM=null;sanEl.hidden=false;if(p)p.done()}
function partyPress(k){if(PM.view==='dossier')dossierPress(k);else PM.list.press(k)}
function drawParty(){pR(0,0,VW,VH,PC.navy);if(PM.view==='dossier')drawDossier();else PM.list.draw(cx,VW,VH,performance.now())}
cv.addEventListener('click',e=>{if(!PM||!G.active)return;const r=cv.getBoundingClientRect();if(!r.width)return;
 const x=(e.clientX-r.left)*VW/r.width,y=(e.clientY-r.top)*VH/r.height;PM.view==='dossier'?dossierTap(x,y):PM.list.tap(x,y)});

function paintHeader(c,r){pBox(r.x,r.y,r.w,r.h,PC.deep,PC.cream);pT(PW.title,r.x+5,r.y+5,PC.gold,8,PXf);pT(PW.hint,r.x+r.w-5-pW(PW.hint,15),r.y+1,PC.lav,15)}
function paintCard(c,i,r,st){
 const m=party[i],a=m.a,{x,y,w,h}=r,right=x+w-5;
 pBox(x,y,w,h,st.blink?PC.blink:st.on?PC.cardOn:PC.card,st.blink?PC.pump:st.on?PC.mus:st.lead?PC.cream:PC.dim);
 if(st.lead)pR(x+1,y+1,w-2,2,PC.mus);
 pBox(x+9,y+8,34,34,PC.plum,st.lead?PC.mus:PC.dim);c.drawImage(faceOf(a,1),x+10,y+9);
 // name and profession, with the LEAD tag on the right
 const tagL=st.lead?pLeadTag(right,y+5):right,nm=m.name.toUpperCase();
 pT(nm,x+48,y+3,st.lead?PC.gold:PC.cream,18);const px=x+48+pW(nm+' ',18);
 if(tagL-4-px>12)pT(pFit((profOf(a)||{}).name||'',tagL-4-px,15),px,y+5,PC.lav,15);
 // HP bar and numbers (pumpkin at 3 or less)
 const lo=m.hp<=3,hs=`${m.hp}/${m.mhp}`,hw=pW(hs,15);
 pT('HP',x+48,y+19,PC.lav,15);pBar(x+62,y+23,right-hw-6-(x+62),m.hp/m.mhp,lo?PC.pump:PC.green);pT(hs,right-hw,y+19,lo?PC.pump:PC.cream,15);
 // WP and SAN (SAN pink below 40)
 const wp=`WP ${m.wp} · SAN `;pT(wp,x+48,y+33,PC.lav,15);const sx=x+48+pW(wp,15);pT(String(m.san),sx,y+33,m.san<40?PC.pink:PC.lav,15);
 // status chips, right to left; tapping one shows its line in the detail box
 let cr=right;const textEnd=sx+pW(String(m.san),15)+4;
 for(const k of statusesOf(m).reverse()){const s=PST[k],cw=pW(s.chip,13)+6;if(cr-cw<textEnd)break;
  pR(cr-cw,y+35,cw,11,s.col);pT(s.chip,cr-cw+3,y+34,PC.chipInk,13);st.hit({x:cr-cw-1,y:y+31,w:cw+2,h:17},()=>{PM.list.note=k});cr-=cw+3}
}
function paintDetail(c,r,i,st){
 const m=party[i];pBox(r.x,r.y,r.w,r.h,PC.card,PC.cream,2);
 const x=r.x+6;let y=r.y+3;
 // while the popup is open, text keeps to its left so the reason line isn't hidden under it
 const av=st.avoid,w=av&&av.y<r.y+r.h&&av.y+av.h>r.y?av.x-x-6:r.w-12;
 if(r.h>=60){pT(m.name.toUpperCase(),x,y,PC.cream,17);pT(pFit((profOf(m.a)||{}).name||'',w,16),x,y+14,PC.lav,16);y+=32}
 const lines=[];  // [text, color]
 const add=(t,col)=>pWrap(t,w,16).forEach(l=>lines.push([l,col]));
 if(st.why)add(st.why,PC.lav);
 else{
  const ks=statusesOf(m),note=st.note&&ks.includes(st.note)?st.note:null;
  if(note)add(`${PST[note].name}: ${PST[note].line}`,PC.cream);
  ks.filter(k=>k!==note).forEach(k=>add(`${PST[k].name}: ${PST[k].line}`,PC.lav));
  if(!ks.length)add(PW.none,PC.lav);
  if(m.hp<=3)add(PW.lowHP,PC.pump);
 }
 const fit=Math.max(1,Math.floor((r.y+r.h-4-y)/14));
 lines.slice(0,fit).forEach(([t,col],k)=>pT(k===fit-1&&lines.length>fit?pFit(t+' …',w,16):t,x,y+k*14,col,16));
}

// ================= DOSSIER =================
// L/R change tabs, Up/Down change agent (spec 002, Open question 3; Quality of life, L/R flips agents). B back to the cards.
function openDossier(i){PM.view='dossier';PM.d={i,tab:0,tabs:[]}}
function dossierPress(k){const d=PM.d,n=party.length;
 if(k==='l')d.tab=(d.tab+2)%3;else if(k==='r')d.tab=(d.tab+1)%3;
 else if(k==='up')d.i=(d.i-1+n)%n;else if(k==='down')d.i=(d.i+1)%n;
 else if(k==='select')cycleLead();
 else if(k==='b'){PM.view='list';PM.list.reset(d.i)}}
function dossierTap(x,y){const d=PM.d;for(const t of d.tabs)if(x>=t.x&&x<t.x+t.w&&y>=t.y&&y<t.y+t.h){t.fn();return}}
function bondInfo(a,b,j){const cha=a.stats.CHA||10,s=Math.max(0,(b.score??cha)-((a.bondDmg||[])[j]||0)),M=PW.moods;
 const mood=s<=0?'broken':s>=cha*2/3?'close':s>=cha/3?'strained':'fraying';
 return{s,cha,mood,word:M[mood],col:{close:PC.green,strained:PC.mus,fraying:PC.pump,broken:PC.pink}[mood]}}
function skillOrder(a){const p=profOf(a)||{strong:[],backup:[],skills:{}},SK=B.SKILLS,rank=k=>p.strong.includes(k)?0:p.backup.includes(k)?1:2;
 return Object.keys(SK).sort((x,y)=>rank(x)-rank(y)||SK[y]-SK[x]||x.localeCompare(y)).map(k=>({k,v:B.skillVal(a,k),job:!!p.skills[k]}))}
function drawDossier(){
 const d=PM.d,m=party[d.i],a=m.a,lead=d.i===(G.lead|0);
 // tabs: L INFO SKILLS BONDS R
 pBox(4,4,232,18,PC.deep,PC.cream);d.tabs=[];
 pT('L',9,5,PC.lav,16);pT('R',226,5,PC.lav,16);
 d.tabs.push({x:4,y:2,w:16,h:22,fn:()=>dossierPress('l')},{x:220,y:2,w:16,h:22,fn:()=>dossierPress('r')});
 PW.tabs.forEach((t,k)=>{const tx=20+k*67,on=k===d.tab;if(on){pR(tx,5,67,16,PC.cardOn);pR(tx,19,67,2,PC.mus)}
  pT(t,tx+(67-pW(t,17))/2,4,on?PC.gold:PC.cream,17);d.tabs.push({x:tx,y:2,w:67,h:22,fn:()=>{d.tab=k}})});
 let y=26;
 if(d.tab===0)y=dossierInfo(m,a,lead,y);else if(d.tab===1)y=dossierSkills(a,y);else y=dossierBonds(a,y);
 // key hints, when there's room
 if(VH-4-y>=32){const hy=VH-4-32;pBox(4,hy,232,32,PC.card,PC.cream,2);pT(PW.keys[0],10,hy+3,PC.lav,15);pT(PW.keys[1],10,hy+16,PC.lav,15)}
}
function dossierInfo(m,a,lead,y){
 pBox(4,y,68,68,PC.plum,lead?PC.mus:PC.cream,2);cx.drawImage(faceOf(a,2),6,y+2);
 const x=78,right=232;let nr=right;if(lead)nr=pLeadTag(right,y+2)-4;
 pT(pFit(m.name.toUpperCase(),nr-x,10,PXf),x,y+3,PC.gold,10,PXf);
 pT(pFit((profOf(a)||{}).name||'',right-x,17),x,y+15,PC.cream,17);
 pT(PW.main,x,y+33,PC.lav,14);pT(pFit((a.motives||[])[a.main]||(a.motives||[])[0]||'—',right-x,17),x,y+45,PC.cream,17);
 y+=71;
 const roomy=VH>=300;
 const back=a.backstory?pWrap(a.backstory,228,15,roomy?2:1):[PW.noBack];
 back.forEach((l,k)=>pT(l,8,y+k*12,a.backstory?PC.lav:PC.dim,15));y+=back.length*12+4;
 // HP, WP, SAN with the Breaking Point
 pBox(4,y,232,46,PC.card,PC.dim);
 [['HP',m.hp,m.mhp,m.hp<=3?PC.pump:PC.green,''],['WP',m.wp,m.mwp,PC.mus,''],['SAN',m.san,m.msan,PC.sanbar,` ${PW.bp} ${m.bp}`]].forEach(([l,v,mx,col,ex],k)=>{const ry=y+3+k*14;
  pT(l,9,ry,PC.lav,15);pBar(36,ry+4,104,v/mx,col);const s=`${v}/${mx}`;pT(s,146,ry,l==='SAN'&&v<40?PC.pink:PC.cream,15);if(ex)pT(ex,146+pW(s,15),ry,PC.lav,15)});
 y+=50;
 // the six stats
 BLS.STATS.forEach((k,j)=>{const sx=4+j*39;pBox(sx,y,36,30,PC.card,PC.dim);pT(k,sx+(36-pW(k,14))/2,y+1,PC.lav,14);const v=String(a.stats[k]);pT(v,sx+(36-pW(v,18))/2,y+12,PC.cream,18)});
 y+=34;
 // weapon, to-hit, disorder
 const W=B.WEAP[(profOf(a)||{}).weapon||'handgun']||B.WEAP.handgun,wn=m.w.name.charAt(0).toUpperCase()+m.w.name.slice(1);
 const dice=`${m.w.dmg[0]}d${m.w.dmg[1]}${m.w.bonus?'+'+m.w.bonus:''}`;
 pBox(4,y,232,46,PC.card,PC.dim);
 [[PW.equipped,`${wn} · ${dice}`],[PW.toHit,`${W.skill} ${m.w.skill}%`],[PW.disorder,m.dis||PW.noDis]].forEach(([l,v],k)=>{const ry=y+3+k*14;pT(l,9,ry,PC.lav,15);const t=pFit(v,150,15);pT(t,231-pW(t,15),ry,PC.cream,15)});
 return y+50;
}
function dossierSkills(a,y){
 const rows=skillOrder(a),hint=VH-y>=18*13+36?36:0,rh=Math.min(13,Math.floor((VH-4-hint-y)/rows.length));
 if(rh>=11){pBox(4,y,232,rows.length*rh+6,PC.card,PC.dim);
  rows.forEach((s,k)=>{const ry=y+3+k*rh;pT(s.k,9,ry-1,s.job?PC.cream:PC.lav,15);pBar(104,ry+3,100,s.v/100,s.job?PC.mus:PC.sanbar);const v=s.v+'%';pT(v,231-pW(v,15),ry-1,PC.cream,15)});
  return y+rows.length*rh+10}
 // short screens: two columns
 const half=Math.ceil(rows.length/2),r2=Math.max(10,Math.floor((VH-8-y)/half));pBox(4,y,232,half*r2+6,PC.card,PC.dim);
 rows.forEach((s,k)=>{const col=k<half?0:1,ry=y+3+(k%half)*r2,x=9+col*114;pT(pFit(s.k,78,14),x,ry-1,s.job?PC.cream:PC.lav,14);const v=s.v+'%';pT(v,x+106-pW(v,14),ry-1,PC.cream,14)});
 return y+half*r2+10}
function dossierBonds(a,y){
 const bonds=(a.bonds||[]).filter(b=>b&&typeof b==='object');
 if(!bonds.length){pT(PW.noBonds,9,y+4,PC.lav,16);return y+24}
 bonds.forEach((b,j)=>{const I=bondInfo(a,b,j),bh=62;pBox(4,y,232,bh,PC.card,PC.dim);
  pT(pFit(b.name||'—',140,18),9,y+2,PC.cream,18);const rel=b.rel||'';pT(rel,231-pW(rel,15),y+4,PC.lav,15);
  pT(PW.score,9,y+19,PC.lav,15);pBar(50,y+23,100,I.s/I.cha,I.col);pT(`${I.s}/${I.cha}`,156,y+19,PC.cream,15);pT(I.word,231-pW(I.word,15),y+19,I.col,15);
  const t=BLS.RELTXT[rel]?pWrap(`${(b.name||'They').split(' ')[0]} ${BLS.RELTXT[rel]}`,222,15,2):[];t.forEach((l,k)=>pT(l,9,y+33+k*12,PC.lav,15));
  y+=bh+4});
 return y}
