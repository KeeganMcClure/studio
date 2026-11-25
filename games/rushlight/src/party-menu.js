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
// a name always shows whole (ui, Screen craft): the largest size it fits at, or null when even the smallest is too wide
function pSize(s,w,sizes=[16,15,14,13,12,11],font=VTf){for(const z of sizes)if(pW(String(s),z,font)<=w)return z;return null}
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
 if(!StudioParty.canSwap({battle:!!Bt||G.mode==='battle',dialog:!!dlg,menu:!!menu||!!PM,cutscene:G.mode!=='world'&&G.mode!=='region',moving:!!G.mv,busy:!!G.busy}))return;
 if(cycleLead())banner(PW.banner+lead().name.toUpperCase());
}

// ================= PARTY SCREEN =================
let PM=null;  // the open party screen: {view:'list'|'card', list, i, done}
function openParty(){return new Promise(res=>{
 PM={view:'list',done:res,i:0,list:StudioParty.list({
  count:()=>party.length,lead:()=>G.lead|0,cycle:cycleLead,close:closeParty,pulse:i=>party[i].hp<=3,
  actions:i=>[{label:PW.makeLead,dis:i===(G.lead|0)||!canLead(i),why:i===(G.lead|0)?PW.isLead:PW.cant,run:()=>setLead(i)},
   {label:PW.card,run:()=>{PM.view='card';PM.i=i}},
   ...(party[i].picks?[{label:`Level picks (${party[i].picks})`,run:()=>levelPicks(party[i],true)}]:[]),
   {label:PW.give,dis:party.length<2||!party[i].slots.length,why:PW.giveWhy,run:()=>giveItem(i)}],
  paint:{header:paintHeader,card:paintCard,detail:paintDetail},
  colors:{box:PT_.paper,border:PT_.edge,shadow:'#0e0c0a',on:'#e8cf86',text:IK.peat,dim:'#7a6a58',cursor:IK.rust},
  font:VTf(16),headerH:18,cardH:56,gap:4,detailMin:40})};
 PM.list.reset(G.lead|0);ban.hidden=true;gEl.classList.add('menu');
})}
function closeParty(){const p=PM;PM=null;gEl.classList.remove('menu');if(p)p.done()}
function partyPress(k){if(PM.view==='card'){if(k==='b'||k==='a'){PM.view='list';PM.list.reset(PM.i)}else if(k==='up'||k==='down'){const n=party.length;PM.i=(PM.i+(k==='up'?n-1:1))%n}else if(k==='select')cycleLead();return}PM.list.press(k)}
function partyTap(x,y){if(PM.view==='card'){partyPress('b');return}PM.list.tap(x,y)}
function drawParty(){pR(0,0,VW,VH,PAL.peat);if(PM.view==='card')drawMercCard(party[PM.i]);else PM.list.draw(cx,VW,VH,performance.now())}

// ---- the parchment look (spec 008, 8C; mockup 42): parchment cards in a dark Soot frame, ink text, the picked card with a
// Tallow edge and a wax-seal cursor, numbers right-aligned beside their bars, labels written out in full ----
const PT_={paper:'#dccca4',on:'#ead9a8',ink:'#1c1814',edge:'#5a3e2b',stain:[140,104,50],hi:'#d9b45a',sealA:'#c8603a',sealB:'#9a4528',sealC:'#5e1a18',leather:'#3b3229',leatherOn:'#9a4528'};
const IK={peat:'#1c1814',soot:'#2c2621',rust:'#76331d',moss:'#4e5a24',dim:'#5a4a3a',pink:'#a0306a'};
function parch(x,y,w,h,on){StudioParch.panel(cx,x,y,w,h,PT_,{on});if(on)StudioParch.seal(cx,x+8,y+Math.min(14,h/2),PT_)}
function frameTop(title,right){pR(0,0,VW,18,PAL.soot);pR(0,17,VW,1,PAL.bone);pT(title,5,5,PAL.tallow,8,PXf);if(right)pT(right,VW-5-pW(right,15),1,PAL.bone,15);return 20}
function frameFoot(t){pR(0,VH-14,VW,14,PAL.soot);pR(0,VH-14,VW,1,PAL.bone);const z=pSize(t,VW-8,[13,12,11])||11;pT(t,(VW-pW(t,z))/2,VH-14+(13-z)/2,PAL.bone,z);return VH-15}
// a merc's face on its lit backing, with an ink frame
function faceAt(m,x,y,s,grey){pR(x-1,y-1,s+2,s+2,IK.peat);StudioHUD.portrait(cx,RLSP.portrait(m.sp,m.look),2,0,60,60,x,y,s,s,HUDT);if(grey){pR(x,y,s,s,'rgba(60,54,48,.55)')}}
function inkBar(x,y,w,frac,col){pR(x,y,w,5,IK.peat);pR(x+1,y+1,Math.max(0,Math.round((w-2)*Math.max(0,Math.min(1,frac)))),3,col)}
function paintHeader(c,r){pR(r.x-4,r.y-4,VW,r.h+5,PAL.soot);pR(0,r.y+r.h,VW,1,PAL.bone);pT(PW.title,r.x+5,r.y+5,PAL.tallow,8,PXf);pT(PW.hint,r.x+r.w-5-pW(PW.hint,15),r.y+1,PAL.bone,15)}
function leadTag(right,y){const w=pW(PW.lead,14)+8;pR(right-w,y,w,11,PAL.tallow);pR(right-w,y+11,w,1,IK.peat);pT(PW.lead,right-w+4,y-1,IK.peat,14);return right-w}
// Party: one card per merc: face, name, the LEAD tag, trade · species, the HP bar with HP beside it, WP, SAN and statuses on one line
function paintCard(c,i,r,st){
 const m=party[i],{x,y,w,h}=r,right=x+w-6;
 StudioParch.panel(c,x,y,w,h,PT_,{on:st.on});if(st.blink)pR(x+1,y+1,w-2,h-2,'rgba(94,26,24,.35)');if(st.on)StudioParch.seal(c,x+8,y+h/2,PT_);
 faceAt(m,x+17,y+6,h-12,m.dead);
 const tx=x+h+11,tagL=st.lead?leadTag(right,y+5):right,nm=m.name.toUpperCase()+(m.picks?' ▲':'')+(m.dead?' (gone)':''),nz=pSize(nm,tagL-4-tx,[18,16,15,14,13])||13;
 pT(nm,tx,y+3+(18-nz)/2,IK.peat,nz);
 const sub=[m.trade,m.sp].filter(Boolean).join(' · '),sz=pSize(sub,right-tx,[15,14,13,12,11])||11;pT(sub,tx,y+17,IK.rust,sz);
 const hs=m.ko?'DOWN':`${m.hp}/${m.mhp}`,hw=pW(hs,15),lo=m.hp<=3;
 pT('HP',tx,y+28,IK.dim,15);inkBar(tx+14,y+32,right-hw-5-(tx+14),m.hp/m.mhp,PAL.rust);pT(hs,right-hw,y+28,lo||m.ko?PAL.rust:IK.peat,15);
 const wp=`WP ${m.wp} · SAN `;pT(wp,tx,y+40,IK.peat,15);const sx=tx+pW(wp,15);pT(String(m.san),sx,y+40,m.san<40?IK.pink:IK.peat,15);
 // status chips, written out in full; the ones that don't fit are in the box under the cards
 const sts=statusChips(m);let cr=right;
 if(!sts.length){const t=PW.none;if(pW(t,14)<right-(sx+24))pT(t,right-pW(t,14),y+41,IK.moss,14)}
 for(const s of sts.reverse()){const cw=pW(s,13)+6;if(cr-cw<sx+30)break;pR(cr-cw,y+42,cw,11,PAL.rust);pT(s,cr-cw+3,y+41,PAL.bone,13);cr-=cw+3}
}
const statusChips=m=>(m.st||[]).map(s=>String(s).toUpperCase());
function paintDetail(c,r,i,st){
 const m=party[i];StudioParch.panel(c,r.x,r.y,r.w,r.h,PT_);
 const x=r.x+7,av=st.avoid,w=av&&av.y<r.y+r.h&&av.y+av.h>r.y?av.x-x-6:r.w-14;let y=r.y+4;
 const lines=[];if(st.why)lines.push(st.why);else{const s=statusChips(m);lines.push(s.length?s.join(', '):PW.none);if(m.hp<=3)lines.push(PW.low)}
 lines.forEach(l=>pWrap(l,w,16,3).forEach(t=>{if(y<r.y+r.h-14){pT(t,x,y,IK.soot,16);y+=14}}));
}
// Give item: one of the merc's slot items to another merc with a free slot (8 slots each; bible Items)
async function giveItem(i){const m=party[i],I=RLS.ITEMS;
 const k=await choose(m.slots.map(s=>I[s.id].name+(s.n>1?' ×'+s.n:'')),{cancel:true,title:'GIVE WHAT?'});if(k<0)return;
 const to=party.map((p,j)=>({label:`${p.name}  ${p.slots.length}/8`,dis:j===i||p.slots.length>=8||p.dead}));
 const t=await choose(to,{cancel:true,title:'TO WHO?'});if(t<0)return;
 const it=m.slots.splice(k,1)[0];delete it.kit;party[t].slots.push(it);banner(`${I[it.id].name.toUpperCase()} → ${party[t].name.toUpperCase()}`);if(window.RLG)RLG.saveRun();
}
// Merc card (spec 008, 8C; mockup 42): the merc on top; the six stats in a row of small cards; HP, WP and SAN bars with their
// numbers right-aligned; Breaking point and Luck; then skills, kin, motivations and the backstory. Up/Down change merc, B back.
function drawMercCard(m){
 const top=frameTop('MERC CARD',G.run?G.run.seed:''),bot=frameFoot('B: BACK · ▲▼: MERC');let y=top+2;
 parch(4,y,VW-8,52);faceAt(m,10,y+5,42);
 const tx=58,NM=m.name.toUpperCase(),pz=pSize(NM,VW-tx-8,[10,8,7],PXf);if(pz)pT(NM,tx,y+6+(10-pz)/2,IK.peat,pz,PXf);else pT(NM,tx,y+3,IK.peat,pSize(NM,VW-tx-8,[16,15,14,13,12])||12);
 const tl=`${m.trade} · ${m.sp} · L${m.lvl}`;pT(tl,tx,y+17,IK.rust,pSize(tl,VW-tx-8,[15,14,13,12,11])||11);
 const sl=`${m.size} · ${m.trait}`;pWrap(sl,VW-tx-8,13,2).forEach((l,k)=>pT(l,tx,y+29+k*11,IK.dim,13));y+=56;
 const cw=Math.floor((VW-8-5*3)/6);RLS.STATS.forEach((k,j)=>{const x=4+j*(cw+3);StudioParch.panel(cx,x,y,cw,24,PT_);pT(k,x+(cw-pW(k,12))/2,y+1,IK.dim,12);const v=String(m.stats[k]);pT(v,x+(cw-pW(v,16))/2,y+9,IK.peat,16)});y+=28;
 parch(4,y,VW-8,51);
 [['HP',m.hp,m.mhp,PAL.rust],['WP',m.wp,m.mwp,'#4a5a7a'],['SAN',m.san,m.msan,'#b8902e']].forEach(([l,v,mx,col],k)=>{const yy=y+4+k*11,vs=`${v}/${mx}`;pT(l,10,yy-1,IK.dim,14);inkBar(34,yy+4,VW-8-34-pW('00/00',14)-14,v/mx,col);pT(vs,VW-12-pW(vs,14),yy-1,l==='SAN'&&v<40?IK.pink:IK.peat,14)});
 pT(`Breaking point ${m.bp} · Luck 50%`,10,y+36,IK.dim,13);y+=55;
 const sk=Object.keys(RLS.SKILLS).filter(k=>m.sk[k]>RLS.SKILLS[k]).map(k=>`${k} ${m.sk[k]}`).join(' · ');
 const L=[],add=(t,col,z,it)=>pWrap(t,VW-20,z,20).forEach(l=>L.push([l,col,z,it]));
 add(sk,IK.peat,14);L.push(null);
 add(`Kin: ${m.kin.name}, ${m.kin.type.toLowerCase()} · Bond ${m.kin.bond}`,IK.soot,14);
 add(`Motivations: ${m.mot.map((x,i)=>i===m.main?x+' (Main)':x).join(', ')}`,IK.soot,14);L.push(null);
 add(m.back||'',IK.soot,14,true);
 const room=bot-y-8,need=L.reduce((a,l)=>a+(l?12:4),0),z=need<=room?14:13;
 if(z===13){L.length=0;add(sk,IK.peat,13);L.push(null);add(`Kin: ${m.kin.name}, ${m.kin.type.toLowerCase()} · Bond ${m.kin.bond}`,IK.soot,13);add(`Motivations: ${m.mot.map((x,i)=>i===m.main?x+' (Main)':x).join(', ')}`,IK.soot,13);L.push(null);add(m.back||'',IK.soot,13,true)}
 const h=Math.min(bot-y-2,L.reduce((a,l)=>a+(l?(z===14?12:11):4),0)+8);parch(4,y,VW-8,h);let yy=y+4;
 const pt=PT_;L.forEach(l=>{if(!l){pR(10,yy+1,VW-20,1,'rgba(90,62,43,.5)');yy+=4;return}if(yy>y+h-12)return;cx.font=(l[3]?'italic ':'')+VTf(l[2]);cx.fillStyle=l[1];cx.textBaseline='top';cx.fillText(l[0],10,yy);yy+=z===14?12:11});
}
