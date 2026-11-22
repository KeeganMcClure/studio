// Rushlight · battle.js
// The battle on the studio's shared frame (engine/battle.js, spec 002), in Rushlight's earth palette, with the approved
// mockup's own extras drawn on top (bible Art, Battle in the GBA shell): the one-line log across the top, a countdown
// under it when a fight has one, the enemy nameplate (name, level, threat skulls, HP bar hatched and ??? until
// Identified), the party from behind (species back views), a one-row party strip and the Fight · Skills · Items · Guard box.
// Rolls are the studio's StudioRoll (engine/roll.js), drawing from the run's dice stream (engine/seed.js).
// Loaded after engine.js as a plain script, so it shares G, party, cx, VW, VH, say and the rest.
const SB=StudioBattle;
const PAL={peat:'#1c1814',soot:'#2c2621',duskD:'#3b4757',dusk:'#5c6c7c',moss:'#56623a',rust:'#9a4528',tallow:'#d9b45a',straw:'#c8a552',
 bone:'#e6dcc4',ash:'#857e72',blood:'#5e1a18',pink:'#ff4fa3',cyan:'#3ff0e8',card:'#231e1a',cardOn:'#3b3229',line:'#4d4134'};
const VTf=s=>`${s}px "VT323",monospace`,PXf=s=>`${s}px "Press Start 2P",monospace`;
const BT_THEME={font:VTf,ink:PAL.peat,dim:PAL.ash,gold:PAL.tallow,cream:PAL.bone,lav:'#c4b99e',line:PAL.bone,box:PAL.soot,boxOn:PAL.cardOn,
 strip:PAL.peat,bar:PAL.rust,barBack:PAL.peat,shadow:'#0e0c0a',rule:PAL.line,colBack:'rgba(28,24,20,.92)',faceBack:PAL.soot,foeLine:PAL.rust};
// Rushlight's words for the roll line and the box (Combat, Basics; Battle menu)
const BW={cmds:['Fight','Skills','Items','Guard'],words:{hit:'HIT',miss:'MISS',crit:'CRIT',fumble:'FUMBLE'},
 skill:{Melee:'MELEE',Shooting:'SHOOTING',Athletics:'ATHLETICS'},guard:['Defend','Flee'],fumble:['The swing goes wide.','The string snaps.','A foot slips in the mud.']};
const R_=StudioRoll;
const die=n=>R_.die(n);
// dice like '1d4+2' or '1d4-1'; a hit always does at least 1 (Combat numbers, Rounding)
function rollDice(s){const m=String(s).match(/(\d+)d(\d+)([+-]\d+)?/);if(!m)return +s||0;let t=+(m[3]||0);for(let i=0;i<+m[1];i++)t+=die(+m[2]);return t}
// STR bonus for melee, fists and thrown weapons (Carried rules, Numbers)
const strBonus=s=>s<=4?-2:s<=8?-1:s<=12?0:s<=16?1:2;
const FIGHT_FLOOR=30;

// ================= THE FIGHT =================
// battle(foes, o): foes are enemy cards {name, lvl, skulls, hp, dex, hit, dmg, sprite, faceless, known}
// o.bg ('noon'|'dusk'|'night'), o.countdown {label, n} (rounds), o.roamer (Flee works), o.intro
async function battle(foes,o={}){
 held=[];hideTB();
 const en=foes.map(E=>Object.assign({},E,{foe:true,base:E.name,mhp:E.hp,dead:false,flash:0,alpha:1,defend:false}));
 nameFoes(en);
 G.mode='battle';gEl.classList.add('battle');ban.hidden=true;
 Bt={en,t:0,round:0,queue:[],ui:null,log:'',res:null,hits:[],roamer:!!o.roamer,bg:o.bg||'dusk',count:o.countdown?Object.assign({},o.countdown):null,active:null,floaties:[]};
 party.forEach(m=>{m.defend=false;if(m.hp<=0)m.ko=true});
 await bsay(o.intro||`${en.map(e=>e.name).join(', ')} ${en.length>1?'close in.':'is here.'}`,1100);
 for(;;){
  Bt.round++;
  Bt.queue=turnOrder();
  while(Bt.queue.length){
   const a=Bt.queue[0];
   if(a.foe){if(!a.dead)await foeTurn(a)}else if(!a.ko){const r=await mercTurn(a);if(r==='flee')return endBattle('flee')}
   Bt.queue.shift();Bt.active=null;
   if(party.every(m=>m.ko))return endBattle('lose');
   if(en.every(e=>e.dead))return endBattle('win');
  }
  if(Bt.count){Bt.count.n--;if(Bt.count.n<=0){await bsay(Bt.count.end||'The bell rings. It is over for today.',1400);return endBattle('time')}}
 }
}
function nameFoes(en){const c={};en.forEach(e=>c[e.base]=(c[e.base]||0)+1);const s={};en.forEach(e=>{if(c[e.base]>1){s[e.base]=(s[e.base]||0)+1;e.name=e.base+' '+'ABCD'[s[e.base]-1]}else e.name=e.base})}
// DEX order, highest first; ties go to mercs (Combat, Basics)
function turnOrder(){const dx=a=>a.foe?a.dex:a.stats.DEX;return [...party.filter(m=>!m.ko),...Bt.en.filter(e=>!e.dead)].sort((a,b)=>(dx(b)-dx(a))||((a.foe?1:0)-(b.foe?1:0)))}
function endBattle(res){
 Bt.active=null;const out=res;
 party.forEach(m=>{m.defend=false;if(m.ko&&res!=='lose'){m.ko=false;m.hp=Math.max(1,m.hp)}});
 gEl.classList.remove('battle');Bt=null;G.mode='world';hideTB();return out;
}
const aliveFoes=()=>Bt.en.filter(e=>!e.dead);
// a log line across the top; waits ms, or until A
function bsay(text,ms=900){Bt.log=text;return new Promise(res=>{Bt.ui={kind:'msg',res:()=>{clearTimeout(t);Bt.ui=null;res()}};const t=setTimeout(()=>{if(Bt&&Bt.ui&&Bt.ui.kind==='msg')Bt.ui.res()},fastOn()?Math.round(ms*.45):ms)})}
function bcmd(m){return new Promise(res=>{Bt.ui={kind:'cmd',m,sel:m.bsel||0,res:i=>{m.bsel=i;res(i)}}})}
function blist(title,rows,o={}){return new Promise(res=>{Bt.ui={kind:'list',title,rows,sel:Math.max(0,rows.findIndex(r=>!r.dis)),top:0,res,hover:o.hover}})}
const fastOn=()=>!!(G.dev&&G.dev.fast);

// ================= MERCS =================
// the weapon in hand (WPN 1 or WPN 2), or fists
function weaponOf(m){const g=m.gear,it=g&&g[g.hand||'w1'];return it&&RLS.ITEMS[it.id]||RLS.FISTS}
function hitChance(m,e,o={}){const w=weaponOf(m);let p=(m.sk[w.skill]||0)+(w.hit|0)+(o.mod||0);if(!o.special)p=Math.max(FIGHT_FLOOR,p);return Math.max(1,Math.min(99,p))}
async function mercTurn(m){
 Bt.active=m;m.defend=false;
 for(;;){
  const c=await bcmd(m);
  if(c===0){const e=await pickFoe(m,{});if(!e)continue;await attack(m,e,{});return}
  if(c===1){const r=await skillMenu(m);if(r===false)continue;return r}
  if(c===2){const r=await itemMenu(m);if(r===false)continue;return}
  if(c===3){const rows=[{label:BW.guard[0],right:'half dmg'},{label:BW.guard[1],right:Bt.roamer?'':'not here',dis:!Bt.roamer}];
   const r=await blist('GUARD',rows);if(r<0)continue;
   if(r===0){m.defend=true;await bsay(`${m.name} sets their feet and waits.`,800);return}
   if(r===1){const ath=Math.min(...party.filter(p=>!p.ko).map(p=>p.sk.Athletics||0)),o=R_.pct(ath);showRes(R_.line(BW.skill.Athletics,o,BW.words),o);
    if(o.ok){await bsay('The company gets clear.',900);return 'flee'}await bsay('Nowhere to run.',900);return}
  }
 }
}
async function pickFoe(m,o){const f=aliveFoes();if(f.length===1)return f[0];
 const rows=f.map(e=>({label:e.name,right:hitChance(m,e,o)+'%'}));
 const r=await blist('TARGET',rows,{hover:i=>f[i]});return r<0?null:f[r]}
async function attack(m,e,o){
 const w=weaponOf(m),p=hitChance(m,e,o),r=R_.pct(p);
 showRes(R_.line(BW.skill[w.skill]||w.skill.toUpperCase(),r,BW.words),r);
 if(r.fumble){await bsay(`${m.name}: ${BW.fumble[die(BW.fumble.length)-1]}`,1000);return false}
 if(!r.ok){await bsay(`${m.name} misses ${e.name}.`,900);return false}
 let d=rollDice(w.dmg)+(w.melee?strBonus(m.stats.STR):0);if(o.half)d=Math.floor(d/2);if(r.crit)d*=2;if(o.double)d*=2;d=Math.max(1,d);
 await bsay(`${m.name} hits ${e.name} for ${d}.${r.crit?' A crit.':''}`,1000);hurtFoe(e,d);return true;
}
function hurtFoe(e,d){e.hp=Math.max(0,e.hp-d);e.flash=16;floaty(e,d);if(e.hp<=0)e.dead=true}
// Skills: the battle moves of Shooting and Melee at 40% (Carried rules, Battle moves). The rest come in Part D.
async function skillMenu(m){
 const w=weaponOf(m),rows=[],acts=[];
 if(w.skill==='Shooting'&&(m.sk.Shooting||0)>=40){rows.push({label:'Aimed shot',right:'1 WP',dis:m.wp<1});acts.push(async()=>{const e=await pickFoe(m,{mod:-20,special:true});if(!e)return false;m.wp--;await attack(m,e,{mod:-20,special:true,double:true})})}
 if(w.skill==='Melee'&&(m.sk.Melee||0)>=40){rows.push({label:'Shove',right:'1 WP',dis:m.wp<1});acts.push(async()=>{const e=await pickFoe(m,{special:true});if(!e)return false;m.wp--;const hit=await attack(m,e,{special:true,half:true});if(hit&&!e.dead){const q=Bt.queue.indexOf(e);if(q>0){Bt.queue.splice(q,1);Bt.queue.push(e)}}})}
 if(!rows.length){rows.push({label:'No battle moves',dis:true});acts.push(null)}
 const r=await blist('SKILLS · '+m.wp+' WP',rows);if(r<0||!acts[r])return false;return acts[r]();
}
// Items: the merc's own slots (what each item does in a fight comes in Part D)
async function itemMenu(m){
 const rows=m.slots.map(s=>({label:RLS.ITEMS[s.id].name,right:s.n>1?'x'+s.n:'',dis:true}));if(!rows.length)rows.push({label:'Nothing in hand',dis:true});
 const r=await blist('ITEMS',rows);return false;
}
async function pickMerc(title){const rows=party.map(p=>({label:p.name,right:p.ko?'DOWN':p.hp+'/'+p.mhp,dis:p.ko}));const r=await blist(title,rows);return r<0?null:party[r]}

// ================= FOES =================
async function foeTurn(e){
 Bt.active=e;await later(350);
 const alive=party.filter(m=>!m.ko);if(!alive.length)return;
 const t=alive[R_.die(alive.length)-1],r=R_.pct(e.hit);
 showRes(R_.line(e.name.toUpperCase(),r,BW.words),r);
 if(r.ok){let d=Math.max(1,rollDice(e.dmg));if(r.crit)d*=2;if(t.defend)d=Math.floor(d/2);d=Math.max(1,d);await bsay(`${e.name} hits ${t.name} for ${d}.`,1000);hurtMerc(t,d)}
 else await bsay(`${e.name} misses ${t.name}.`,900);
}
function hurtMerc(m,d){m.hp=Math.max(0,m.hp-d);m.shk=10;if(m.hp<=0)m.ko=true}
const later=ms=>sleep(fastOn()?Math.round(ms*.45):ms);
function showRes(text,o){Bt.res={text:text.replace(/ (HIT|MISS|CRIT|FUMBLE)$/,' '),word:o.crit?'CRIT':o.fumble?'FUMBLE':o.ok?'HIT':'MISS',col:o.ok?PAL.tallow:PAL.ash,until:Bt.t+90}}
function floaty(e,txt){Bt.floaties.push({e,txt:String(txt),t:0})}

// ================= INPUT =================
function battlePress(k){
 const u=Bt&&Bt.ui;if(!u)return;
 if(u.kind==='msg'){if(k==='a'||k==='b')u.res();return}
 if(u.kind==='cmd'){const r=SB.nav(u,k,4,true);if(r==='pick'){Bt.ui=null;u.res(u.sel)}return}
 if(u.kind==='list'){const r=SB.nav(u,k,u.rows.length,false);if(r==='back'){Bt.ui=null;u.res(-1)}else if(r==='pick'){const row=u.rows[u.sel];if(row&&row.dis)return;Bt.ui=null;u.res(u.sel)}}
}
function battleTap(x,y){if(!Bt)return;for(let i=Bt.hits.length-1;i>=0;i--){const h=Bt.hits[i];if(x>=h.x&&y>=h.y&&x<h.x+h.w&&y<h.y+h.h){h.fn();return}}if(Bt.ui&&Bt.ui.kind==='msg')Bt.ui.res()}

// ================= DRAWING =================
function bR(x,y,w,h,c){cx.fillStyle=c;cx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))}
function bT(s,x,y,col,size=14,font=VTf){cx.font=font(size);cx.fillStyle=col;cx.textBaseline='top';cx.fillText(s,Math.round(x),Math.round(y))}
function bW(s,size=14,font=VTf){cx.font=font(size);return cx.measureText(s).width}
const SCENES={noon:['#e0c47a','#c8a552','#a88a3e'],dusk:['#5c6c7c','#7a6a5a','#4a3a2a'],night:['#1c2230','#2a3040','#1c1814']};
function drawScene(L){
 const s=SCENES[Bt.bg]||SCENES.dusk,h=L.scene.h,hz=Math.round(h*.42);
 const g=cx.createLinearGradient(0,0,0,hz);g.addColorStop(0,s[0]);g.addColorStop(1,s[1]);cx.fillStyle=g;cx.fillRect(0,0,VW,hz);
 bR(0,hz,VW,h-hz,s[2]);for(let x=0;x<VW;x+=6)bR(x+(x/6%2)*3,hz+4+((x*7)%9),2,1,PAL.peat);
 bR(0,hz,VW,1,PAL.peat);
}
function spriteOf(e){return e.sprite&&RLArt.sprite(e.sprite)}
function foeX(i){const n=Bt.en.length;return Math.round(26+(VW-26)/(n+1)*(i+1))}
function drawBattle(){
 Bt.t++;const t=Bt.t,tall=Math.max(0,...Bt.en.map(e=>{const s=spriteOf(e);return s?s.height:40}));
 const L=SB.layout(VW,VH,{tallest:tall});Bt.hits=[];
 drawScene(L);
 // enemies, each with its nameplate under it
 Bt.en.forEach((e,i)=>{
  if(e.dead)e.alpha=Math.max(0,e.alpha-.04);if(e.alpha<=0)return;
  const x=foeX(i),s=spriteOf(e),by=L.enemyY;cx.globalAlpha=e.alpha;
  if(!(e.flash>0&&e.flash%4<2)){if(s){cx.imageSmoothingEnabled=false;cx.drawImage(s,Math.round(x-s.width/2),by-s.height)}else bR(x-10,by-30,20,30,PAL.ash)}
  if(e.flash>0)e.flash--;cx.globalAlpha=1;
  const hov=Bt.ui&&Bt.ui.kind==='list'&&Bt.ui.hover&&Bt.ui.hover(Bt.ui.sel)===e;
  if(hov){const ay=by-(s?s.height:30)-8+Math.sin(t*.2)*2;bR(x-3,ay,7,2,PAL.tallow);bR(x-2,ay+2,5,2,PAL.tallow);bR(x-1,ay+4,3,2,PAL.tallow)}
  if(!e.dead)plate(e,x,by+2,i);
 });
 // damage numbers
 Bt.floaties=Bt.floaties.filter(f=>f.t<50);Bt.floaties.forEach(f=>{f.t++;const i=Bt.en.indexOf(f.e),x=foeX(i),y=L.enemyY-30-f.t*.5;bT(f.txt,x-3+1,y+1,PAL.peat,16);bT(f.txt,x-3,y,PAL.bone,16)});
 // the party from behind, waist up, standing on the strip
 party.forEach((m,i)=>{const b=RLSP.back(m.sp,m.look),x=Math.round(VW/2+(i-1)*62-15),sh=m.shk>0?(m.shk--%2?1:-1):0;
  cx.globalAlpha=m.ko?.45:1;cx.drawImage(b,x+sh,L.agentY-b.height);cx.globalAlpha=1;
  if(Bt.active===m){bR(x+12,L.agentY-b.height-7,7,2,PAL.tallow);bR(x+13,L.agentY-b.height-5,5,2,PAL.tallow);bR(x+14,L.agentY-b.height-3,3,2,PAL.tallow)}});
 strip(L.strip);
 // turn column down the left (a blank face for a creature whose rule break is having no face)
 const faces=(Bt.queue.length?Bt.queue:turnOrder()).filter(a=>a.foe?!a.dead:!a.ko).slice(0,6).map(a=>({img:a.foe?(a.faceless?null:spriteOf(a)):RLSP.portrait(a.sp,a.look),foe:!!a.foe}));
 SB.turnColumn(cx,BT_THEME,L.col.x,L.col.y+30,faces,L.agentY-30-60);
 // the log line across the top, and the countdown under it
 SB.box(cx,26,2,VW-28,14,PAL.soot,PAL.bone,1);bT(SB.fit(cx,BT_THEME,Bt.log||'',VW-36,14),30,2,PAL.bone,14);
 if(Bt.count){const s=`${Bt.count.label} · ${Bt.count.n}`;const w=bW(s,13)+10;SB.box(cx,VW-2-w,17,w,12,PAL.peat,PAL.tallow,1);bT(s,VW-2-w+5,16,PAL.tallow,13)}
 if(Bt.res&&t<Bt.res.until)SB.result(cx,BT_THEME,VW/2+12,Math.min(L.enemyY+22,L.agentY-56),Bt.res.text,Bt.res.word,Bt.res.col);
 // the command box: the row and its info line, or a list box over the scene
 const u=Bt.ui;
 if(u&&u.kind==='cmd'){const hs=SB.commands(cx,BT_THEME,L.cmd,BW.cmds,u.sel,cmdDetail(u.m,u.sel));hs.forEach(h=>Bt.hits.push({x:h.x,y:h.y,w:h.w,h:h.h,fn:()=>{if(u.sel!==h.i)u.sel=h.i;else battlePress('a')}}))}
 else if(u&&u.kind==='list'){const m=Bt.active;SB.commands(cx,BT_THEME,L.cmd,BW.cmds,m&&m.bsel||0,u.title,{});
  const r={x:40,y:L.cmd.y-104,w:VW-44,h:100},res=SB.list(cx,BT_THEME,r,u.rows,u.sel,u.top);u.top=res.top;
  res.hits.forEach(h=>Bt.hits.push({x:h.x,y:h.y,w:h.w,h:h.h,fn:()=>{if(u.sel!==h.i)u.sel=h.i;else battlePress('a')}}));
  Bt.hits.push({x:0,y:L.cmd.y,w:VW,h:L.cmd.h,fn:()=>battlePress('b')})}
 else{SB.commands(cx,BT_THEME,L.cmd,[],0,'',{msg:[Bt.active?(Bt.active.foe?Bt.active.name+'…':Bt.active.name):''],more:!!(u&&u.kind==='msg')});if(u&&u.kind==='msg')Bt.hits.push({x:0,y:0,w:VW,h:VH,fn:()=>u.res()})}
}
function cmdDetail(m,sel){const w=weaponOf(m);return [`${w.name} · ${w.dmg} · ${hitChance(m,null)}%`,`${m.wp} WP`,`${m.slots.length} in slots`,Bt.roamer?'Defend or Flee':'Defend'][sel]}
// the nameplate: name, level, threat skulls, and an HP bar hatched and marked ??? until Identified
function plate(e,x,y){
 const nm=`${e.name} L${e.lvl||1}`,sk=e.skulls||1,w=Math.max(54,bW(nm,13)+sk*7+8),x0=Math.round(Math.max(26,Math.min(VW-2-w,x-w/2)));
 SB.box(cx,x0,y,w,22,'rgba(28,24,20,.9)',PAL.line,1);bT(nm,x0+3,y-1,PAL.bone,13);
 for(let k=0;k<sk;k++)skull(x0+w-4-(k+1)*7,y+2);
 const bx=x0+3,bw=w-6,by=y+13;
 if(e.known){SB.hpBar(cx,BT_THEME,bx,by,bw,e.hp/e.mhp,4)}
 else{bR(bx,by,bw,6,PAL.peat);for(let k=0;k<bw-2;k+=3)bR(bx+1+k,by+1,1,4,PAL.rust);const q='???';bT(q,bx+bw/2-bW(q,11)/2,by-3,PAL.bone,11)}
}
function skull(x,y){bR(x,y,5,4,PAL.bone);bR(x+1,y+4,3,1,PAL.bone);bR(x+1,y+1,1,1,PAL.peat);bR(x+3,y+1,1,1,PAL.peat)}
// the one-row party strip: name, HP bar, WP and SAN (SAN pink under 40)
function strip(r){
 bR(r.x,r.y,r.w,r.h,PAL.peat);const cw=Math.floor((r.w-4)/3);
 party.forEach((m,i)=>{const x=r.x+2+i*cw,on=Bt.active===m;SB.box(cx,x,r.y+1,cw-2,r.h-2,on?PAL.cardOn:PAL.card,on?PAL.tallow:m.ko?PAL.rust:PAL.line,1);
  bT(SB.fit(cx,BT_THEME,m.name.toUpperCase(),cw-30,13),x+3,r.y,on?PAL.tallow:PAL.bone,13);
  const hs=m.ko?'DOWN':String(m.hp);bT(hs,x+cw-5-bW(hs,13),r.y,m.ko?PAL.rust:PAL.bone,13);
  SB.hpBar(cx,BT_THEME,x+3,r.y+12,cw-8,m.hp/m.mhp,3);
  const s=`WP ${m.wp} SAN `;bT(s,x+3,r.y+16,PAL.ash,11);bT(String(m.san),x+3+bW(s,11),r.y+16,m.san<40?PAL.pink:PAL.ash,11)});
}
