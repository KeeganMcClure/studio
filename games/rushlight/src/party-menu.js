// Rushlight · party-menu.js
// Who leads, Select cycling the lead on the map, and Start → Party: the studio's shared card list (engine/party.js,
// studio-bible/ui.md Party menu; bible Skills and menus, Map menu). Three merc cards in seat order with HP, SAN, WP,
// status and the lead marked; each opens Make lead, Merc card and Give item.
// Loaded after battle.js as a plain script, so it shares engine.js's party, G, cx, lead() and battle.js's PAL and fonts.
const PW={title:'PARTY',hint:'SELECT: lead',lead:'LEAD',banner:'LEADING: ',makeLead:'Make lead',card:'Merc card',give:'Give item',
 isLead:'Already leading.',cant:'Downed or lost: can\'t lead.',giveWhy:'Nothing to give yet.',none:'No statuses.',low:'Badly hurt.'};
function pT(s,x,y,col,size=16,font=VTf){cx.font=font(size);cx.fillStyle=col;cx.textBaseline='top';cx.fillText(s,Math.round(x),Math.round(y))}
function pW(s,size=16,font=VTf){cx.font=font(size);return cx.measureText(s).width}
function pR(x,y,w,h,c){cx.fillStyle=c;cx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))}
function pBox(x,y,w,h,fill,line,lw=1){pR(x,y,w,h,line);pR(x+lw,y+lw,w-2*lw,h-2*lw,fill)}
function pFit(s,w,size=16,font=VTf){s=String(s);if(pW(s,size,font)<=w)return s;while(s.length>1&&pW(s+'…',size,font)>w)s=s.slice(0,-1);return s.replace(/\s+$/,'')+'…'}
function pWrap(s,w,size=16,max=9){const out=[];let line='';for(const word of String(s).split(/\s+/).filter(Boolean)){const t=line?line+' '+word:word;if(pW(t,size)<=w||!line)line=t;else{out.push(line);line=word}}if(line)out.push(line);
 if(out.length>max){out.length=max;out[max-1]=pFit(out[max-1]+' …',w,size)}return out}
function pBar(x,y,w,frac,col){pR(x,y,w,5,PAL.peat);pR(x+1,y+1,w-2,3,PAL.soot);pR(x+1,y+1,Math.round((w-2)*clamp(frac,0,1)),3,col)}

// ================= WHO LEADS =================
// A Downed or dead merc can't lead (canLead)
const canLead=i=>{const m=party[i];return !!m&&!m.ko&&!m.dead&&m.san>0};
function setLead(i){const old=G.lead|0;if(i===old||!canLead(i))return false;G.lead=i;applySan();if(G.onLead)G.onLead(old,i);return true}
function cycleLead(){return setLead(StudioParty.next(party.length,G.lead|0,canLead))}
// Select on the map, only while the lead is free to walk. The new lead takes the old lead's tile and facing (the
// map keeps one position for the company, so that holds by itself). Presses while it can't are ignored, not saved.
function mapSelect(){
 if(!StudioParty.canSwap({battle:!!Bt||G.mode==='battle',dialog:!!dlg,menu:!!menu||!!PM,cutscene:G.mode!=='world',moving:!!G.mv,busy:!!G.busy}))return;
 if(cycleLead())banner(PW.banner+lead().name.toUpperCase());
}

// ================= PARTY SCREEN =================
let PM=null;  // the open party screen: {view:'list'|'card', list, i, done}
function openParty(){return new Promise(res=>{
 PM={view:'list',done:res,i:0,list:StudioParty.list({
  count:()=>party.length,lead:()=>G.lead|0,cycle:cycleLead,close:closeParty,pulse:i=>party[i].hp<=3,
  actions:i=>[{label:PW.makeLead,dis:i===(G.lead|0)||!canLead(i),why:i===(G.lead|0)?PW.isLead:PW.cant,run:()=>setLead(i)},
   {label:PW.card,run:()=>{PM.view='card';PM.i=i}},
   {label:PW.give,dis:true,why:PW.giveWhy,run:()=>{}}],
  paint:{header:paintHeader,card:paintCard,detail:paintDetail},
  colors:{box:PAL.soot,border:PAL.bone,shadow:'#0e0c0a',on:PAL.cardOn,text:PAL.bone,dim:PAL.ash,cursor:PAL.tallow},
  font:VTf(16),headerH:18,cardH:50,gap:4,detailMin:44})};
 PM.list.reset(G.lead|0);ban.hidden=true;gEl.classList.add('menu');
})}
function closeParty(){const p=PM;PM=null;gEl.classList.remove('menu');if(p)p.done()}
function partyPress(k){if(PM.view==='card'){if(k==='b'||k==='a'){PM.view='list';PM.list.reset(PM.i)}else if(k==='up'||k==='down'){const n=party.length;PM.i=(PM.i+(k==='up'?n-1:1))%n}else if(k==='select')cycleLead();return}PM.list.press(k)}
function partyTap(x,y){if(PM.view==='card'){partyPress('b');return}PM.list.tap(x,y)}
function drawParty(){pR(0,0,VW,VH,PAL.peat);if(PM.view==='card')drawMercCard(party[PM.i]);else PM.list.draw(cx,VW,VH,performance.now())}

function paintHeader(c,r){pBox(r.x,r.y,r.w,r.h,PAL.soot,PAL.bone);pT(PW.title,r.x+5,r.y+5,PAL.tallow,8,PXf);pT(PW.hint,r.x+r.w-5-pW(PW.hint,15),r.y+1,'#c4b99e',15)}
function leadTag(right,y){const w=pW(PW.lead,14)+8;pR(right-w,y,w,11,PAL.tallow);pT(PW.lead,right-w+4,y-1,PAL.peat,14);return right-w}
function paintCard(c,i,r,st){
 const m=party[i],{x,y,w,h}=r,right=x+w-5;
 pBox(x,y,w,h,st.blink?PAL.blood:st.on?PAL.cardOn:PAL.card,st.on?PAL.tallow:st.lead?PAL.bone:PAL.line);
 if(st.lead)pR(x+1,y+1,w-2,2,PAL.tallow);
 pBox(x+9,y+8,34,34,PAL.soot,st.lead?PAL.tallow:PAL.line);c.imageSmoothingEnabled=false;c.drawImage(RLSP.portrait(m.sp,m.look),0,0,64,64,x+10,y+9,32,32);
 const tagL=st.lead?leadTag(right,y+5):right,nm=m.name.toUpperCase();
 pT(nm,x+48,y+3,st.lead?PAL.tallow:PAL.bone,18);const px=x+48+pW(nm+' ',18);
 const sub=[m.sp,m.trade].filter(Boolean).join(' · ');if(tagL-4-px>12)pT(pFit(sub,tagL-4-px,15),px,y+5,'#c4b99e',15);
 const hs=m.ko?'DOWN':`${m.hp}/${m.mhp}`,hw=pW(hs,15),lo=m.hp<=3;
 pT('HP',x+48,y+19,'#c4b99e',15);pBar(x+62,y+23,right-hw-6-(x+62),m.hp/m.mhp,lo?PAL.rust:PAL.rust);pT(hs,right-hw,y+19,lo||m.ko?PAL.rust:PAL.bone,15);
 const wp=`WP ${m.wp} · SAN `;pT(wp,x+48,y+33,'#c4b99e',15);const sx=x+48+pW(wp,15);pT(String(m.san),sx,y+33,m.san<40?PAL.pink:'#c4b99e',15);
 const sts=statusChips(m);let cr=right;
 for(const s of sts.reverse()){const cw=pW(s,13)+6;if(cr-cw<sx+30)break;pR(cr-cw,y+35,cw,11,PAL.rust);pT(s,cr-cw+3,y+34,PAL.bone,13);cr-=cw+3}
}
const statusChips=m=>(m.st||[]).map(s=>String(s).toUpperCase().slice(0,7));
function paintDetail(c,r,i,st){
 const m=party[i];pBox(r.x,r.y,r.w,r.h,PAL.card,PAL.bone,2);
 const x=r.x+6,av=st.avoid,w=av&&av.y<r.y+r.h&&av.y+av.h>r.y?av.x-x-6:r.w-12;let y=r.y+3;
 const lines=[];if(st.why)lines.push(st.why);else{const s=statusChips(m);lines.push(s.length?s.join(', '):PW.none);if(m.hp<=3)lines.push(PW.low)}
 lines.forEach(l=>pWrap(l,w,16,3).forEach(t=>{if(y<r.y+r.h-14){pT(t,x,y,'#c4b99e',16);y+=14}}));
}
// Merc card: a placeholder until Part A makes real mercs (name, species, HP, WP, SAN and the weapon)
function drawMercCard(m){
 pBox(4,4,VW-8,VH-8,PAL.card,PAL.bone,2);
 pBox(8,8,68,68,PAL.soot,PAL.tallow);cx.drawImage(RLSP.portrait(m.sp,m.look),10,10);
 pT(m.name.toUpperCase(),84,10,PAL.tallow,10,PXf);pT([m.sp,m.trade].filter(Boolean).join(' · '),84,24,PAL.bone,16);
 [['HP',m.hp,m.mhp],['WP',m.wp,m.mwp],['SAN',m.san,m.msan]].forEach(([l,v,mx],k)=>{const y=82+k*14;pT(l,10,y,'#c4b99e',15);pBar(40,y+4,120,v/mx,l==='SAN'?PAL.tallow:l==='WP'?PAL.dusk:PAL.rust);pT(`${v}/${mx}`,166,y,PAL.bone,15)});
 const w=m.w||{};pT(`${w.name||'Fists'} · ${w.dmg||'1d4-1'}`,10,126,PAL.bone,16);
 pT('B: back',10,VH-24,PAL.ash,15);
}
