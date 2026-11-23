// Black Lantern · battle.js
// Demo 5 part B (spec 006): the battle, rebuilt under the bible's Combat tab.
//   B1 the head-on layout from the approved combat mockup (the studio's engine/battle.js frame): enemies at the top,
//      the three agents along the bottom from behind, the turn-order column, HP bars, the one-row command box,
//      the result line, and the case's painted backdrop for the kind of place the fight started in (a darkened map still
//      when a case has none; Nov 23 playtest)
//   B2 the rules: DEX order, Fight · Skills · Items · Guard, WP-costed moves, crits and fumbles, statuses,
//      enemy cards, targeting, horror on sight, flee, Downed and bleed-out, lasting injuries, snapping at 0 SAN
// Loaded after field.js as a plain script, so it shares engine.js's G, party, Bt, cx, say and the rest, and field.js's
// items, statuses, SAN rules and rolls. Words come from strings.js (BLS.BATTLEW, MOVES, INJURIES); the case gives the
// enemy cards and their battle sprites.
const BTW=BLS.BATTLEW,BL_=BTW.lines,MV=BLS.MOVES,INJ=BLS.INJURIES,SB=StudioBattle;
// the battle's theme for the studio frame: Black Lantern's navy, cream and gold
const BT_THEME={font:VTf,ink:PC.navy,dim:PC.dim,gold:PC.gold,cream:PC.cream,lav:PC.lav,line:PC.cream,box:'#1f2440',boxOn:'#2a2f52',
 strip:'#14172a',bar:'#d9772b',barBack:PC.plum,shadow:'#120e18',rule:'#4a4470',colBack:'rgba(27,31,51,.92)',faceBack:PC.plum,foeLine:'#5a5070'};
const later=ms=>sleep(fastOn()?Math.round(ms*.45):ms);
// dice like '1d4+2' (Combat numbers: a hit's dice always give at least 1)
function rollS(s){const m=String(s).match(/(\d+)d(\d+)([+-]\d+)?/);if(!m)return +s||0;return roll(+m[1],+m[2],+(m[3]||0))}

// ================= THE FIGHT =================
// battle(types, o): o.intro, o.hp (the first enemy's HP), o.boss, o.story (a story fight), o.roamer (can flee), o.onStart
async function battle(types,o={}){
 held=[];
 const c=caseById(G.case),EN=(c&&c.enemies)||{};
 // the background: a still of the map spot where the fight started (Combat, Basics)
 const bg=document.createElement('canvas');bg.width=VW;bg.height=VH;
 if(G.M&&G.mode==='world'){G.noHud=1;try{drawWorld()}catch(e){}G.noHud=0}
 bg.getContext('2d').drawImage(cv,0,0);
 G.mode='battle';gEl.classList.add('battle');hud.hidden=true;hideTB();
 const en=types.map((t,i)=>{const E=EN[t]||{name:t,hp:8,dex:10,hit:40,dmg:'1d3'};const hp=o.hp&&i===0?o.hp:E.hp;
  return Object.assign({},E,{t,base:E.name,hp,mhp:hp,st:[],stun:0,dead:false,gone:false,flash:0,alpha:1,last:0,lastHit:null,shk:0})});
 nameEnemies(en);
 Bt={en,boss:!!o.boss,story:!!o.story||!!o.boss,roamer:!!o.roamer||(!o.story&&!o.boss),t:0,round:0,queue:[],ui:null,msg:null,res:null,floaties:[],hits:[],bg,
  smoke:0,used:{},loud:0,active:null,phase:1,first:true,sprite:c&&c.sprite,
  place:(G.M&&G.M.bg)||G.map,light:(G.M&&G.M.light)||'day',bd:null,sourF:{}};  // where the fight started, for the case's backdrop
 party.forEach(m=>{Object.assign(m,{defend:false,slip:false,drawFire:false,vanish:false,vanishHit:false,tripwire:false,grap:null,braceB:false,koT:0,koLong:false,wasDowned:false,dead:false,skip:0,lastShot:-9,hatchet:false,shk:0,panUsed:false});
  m.stun=hasSt(m,'stun')?1:0;if(m.ko){m.wasDowned=true}});
 G.fs.fight=(G.fs.fight|0)+1;
 layoutFoes();
 await later(200);
 await bsay(o.intro||fillT(BTW.start,{e:en.map(e=>e.name).join(', '),v:en.length>1?'close in':'appears'}),1100);
 // horror on sight: each unnatural enemy type is a horror once per case, for all three, with the brace prompt
 for(const t of [...new Set(types)]){const E=EN[t]||{};if(E.horror)await horror(Object.assign({id:'sight:'+t,sight:true,label:`Seeing ${/^The /.test(E.name)?E.name:'the '+E.name}`},E.horror))}
 if(teamDown())return endBattle('lose');
 // Seen it before (an arc perk, spec 008): the first fight against each kind of enemy shows its weakness, as Identify
 const cur=party.find(m=>!m.gone&&m.a.arc&&m.a.arc.perk==='curious');
 if(cur){cur.a.seenT=cur.a.seenT||[];for(const e of en){if(cur.a.seenT.includes(e.t))continue;cur.a.seenT.push(e.t);G.fs.ident=G.fs.ident||[];if(!G.fs.ident.includes('en:'+e.t))G.fs.ident.push('en:'+e.t);
  await bsay(fillT(BLS.HOMEW.perkUsed,{p:BLS.HOMEW.perks.curious[0],n:cur.name})+' '+(e.weakLine||''),1400)}}
 if(o.onStart)await o.onStart();
 for(;;){
  Bt.round++;Bt.queue=turnOrder(Bt.first);Bt.first=false;
  while(Bt.queue.length){
   const a=Bt.queue[0];
   if(a.a){const r=await agentTurn(a);if(r==='flee')return endBattle('flee')}else await foeTurn(a);
   Bt.queue.shift();Bt.active=null;
   if(teamDown())return endBattle('lose');
   if(aliveFoes().length===0)return endBattle('win');
  }
  if(Bt.smoke>0)Bt.smoke--;
 }
}
function nameEnemies(en){const c={};en.forEach(e=>c[e.base]=(c[e.base]||0)+1);const s={};en.forEach(e=>{if(c[e.base]>1){s[e.base]=(s[e.base]||0)+1;e.name=e.base+' '+'ABC'[s[e.base]-1]}else e.name=e.base})}
function layoutFoes(){const n=Bt.en.length,x0=28,w=VW-x0-4;Bt.en.forEach((e,i)=>{e.x=Math.round(x0+w/(n+1)*(i+1))})}
// the whole team down (Downed, bled out, snapped or gone) loses the fight (Gameplay loop, Game over)
const teamDown=()=>party.every(m=>m.ko||m.dead||m.out||m.gone||m.san<=0);
const aliveFoes=()=>Bt?Bt.en.filter(e=>!e.dead&&!e.gone):[];
const upAgents=()=>party.filter(m=>!m.ko&&!m.dead&&!m.gone);
const dexOf=x=>x.a?x.a.stats.DEX:x.dex;
// DEX order, highest first, ties to agents (Turn order). Search's On guard: enemies never take the first turn.
// A Shoved enemy (or a golf club crit) drops to last.
function turnOrder(first){
 const all=[...party.filter(m=>!m.dead&&!m.gone),...Bt.en.filter(e=>!e.dead&&!e.gone)];
 const q=all.map((x,i)=>({x,i})).sort((p,r)=>(p.x.last?1:0)-(r.x.last?1:0)||dexOf(r.x)-dexOf(p.x)||(r.x.a?1:0)-(p.x.a?1:0)||p.i-r.i).map(p=>p.x);
 if(first&&q.length&&!q[0].a&&upAgents().some(m=>skillVal(m.a,'Search')>=75)){const i=q.findIndex(x=>x.a&&!x.ko);if(i>0)q.unshift(q.splice(i,1)[0])}
 return q}
const isFoe=x=>!!x&&!x.a;
function chip(e,k){return(e.st||[]).includes(k)}
async function foeStatus(e,k,o={}){
 if((e.resist||[]).includes(k)||(k==='stun'&&(e.resist||[]).includes('stun2')&&e.lastStun===Bt.round-1)){await bsay(fillT(BL_.resist,{e:e.name}));return false}
 if(k==='stun'){e.stun=Math.max(e.stun,1);await bsay(fillT(BL_.stunOn,{e:e.name}),900);return true}
 if(!chip(e,k))e.st.push(k);
 await bsay(fillT({exposed:BL_.exposed,shaken:BL_.shaken,bleed:BL_.bleeding,poison:BL_.poisoned}[k]||'',{e:e.name}),900);return true}

// ================= MESSAGES AND THE RESULT LINE =================
// Battle lines show in the command box (the mockup keeps the scene clear). A or B moves on early.
function bsay(text,ms=1000){if(!Bt)return Promise.resolve();Bt.msg=pWrap(fmt(String(text)),Math.min(226,VW-14),14,3);
 return new Promise(res=>{const done=()=>{clearTimeout(to);if(Bt&&Bt.ui&&Bt.ui.kind==='msg'){Bt.ui=null;Bt.msg=null}res()};
  const to=setTimeout(done,fastOn()?Math.round(ms*.5):ms);Bt.ui={kind:'msg',res:done}})}
function bres(word,o){if(!Bt)return;const w=o.crit?'CRIT':o.fumble?'FUMBLE':o.ok?'HIT':'MISS';
 Bt.res={text:`${word} ${o.target}% · rolled ${o.r} · `,word:w,col:o.ok?PC.gold:PC.pink,until:Bt.t+(fastOn()?50:95)}}
function floatOn(x,txt,col){if(!Bt)return;const L=bLayout();let fx,fy;
 if(isFoe(x)){fx=x.x;fy=L.enemyY-Math.min(70,spriteH(x))-2}else{const i=party.indexOf(x);fx=VW/6*(2*i+1);fy=L.agentY-50}
 Bt.floaties.push({x:fx,y:fy,txt:String(txt),t:0,col:col||PC.gold})}

// ================= THE BATTLE MENUS =================
function uiWait(ui){return new Promise(res=>{Bt.ui=Object.assign(ui,{res})})}
function battlePress(k){
 const u=Bt.ui;if(!u)return;
 if(u.kind==='msg'){if(k==='a'||k==='b')u.res();return}
 if(u.kind==='cmd'){const r=SB.nav(u,k,4,true);if(r==='pick'){Bt.ui=null;u.res(u.sel)}return}
 if(u.kind==='list'){const r=SB.nav(u,k,u.rows.length,false);if(r==='back'){Bt.ui=null;u.res(-1)}else if(r==='pick'){const row=u.rows[u.sel];if(row&&row.dis){u.flash=Bt.t;return}Bt.ui=null;u.res(u.sel)}return}
 if(u.kind==='target'){const n=u.opts.length;let r=null;
  if(k==='left'||k==='up')u.sel=(u.sel-1+n)%n;else if(k==='right'||k==='down')u.sel=(u.sel+1)%n;else if(k==='a')r='pick';else if(k==='b')r='back';
  if(r==='back'){Bt.ui=null;u.res(null)}else if(r==='pick'){Bt.ui=null;u.res(u.opts[u.sel])}}
}
// tap: command boxes, list rows, sprites (targets) and the party cards' status chips (status info on tap)
cv.addEventListener('click',e=>{if(!G.active||!Bt||dlg||menu)return;const r=cv.getBoundingClientRect();if(!r.width)return;
 const x=(e.clientX-r.left)*VW/r.width,y=(e.clientY-r.top)*VH/r.height;
 for(const h of Bt.hits)if(x>=h.x&&x<h.x+h.w&&y>=h.y&&y<h.y+h.h){h.fn();return}
 if(Bt.ui&&Bt.ui.kind==='msg')Bt.ui.res()});
// the command row: the agent's cursor is remembered (Quality of life: battle cursor memory)
function uiCmd(m){m.bcur=m.bcur||{cmd:0};return uiWait({kind:'cmd',sel:m.bcur.cmd,m}).then(i=>{m.bcur.cmd=i;return i})}
function uiList(m,key,rows){m.bcur=m.bcur||{cmd:0};const first=rows.findIndex(r=>!r.dis);let sel=(m.bcur[key]??first);if(sel<0||sel>=rows.length)sel=Math.max(0,first);
 return uiWait({kind:'list',rows,sel,top:0,m}).then(i=>{if(i>=0)m.bcur[key]=i;return i})}
// targets: enemies (and snapped teammates, who can be fought) or agents; odds shown for each (Quality of life)
async function uiTarget(m,o){
 const opts=o.foes?[...aliveFoes(),...(o.snapped?party.filter(x=>x.out&&!x.ko&&!x.dead&&x!==m):[])]:party.filter(x=>!x.dead&&!x.gone&&(o.ok?o.ok(x):true));
 if(!opts.length){await bsay(BTW.why.noTarget,800);return null}
 if(o.foes&&opts.length===1)return opts[0];  // auto-target when one enemy is left
 let sel=0;if(o.foes&&m.bcur&&m.bcur.foe!=null){const i=opts.indexOf(Bt.en[m.bcur.foe]);if(i>=0)sel=i}
 const t=await uiWait({kind:'target',opts,sel,info:o.info,m});if(t&&isFoe(t)){m.bcur=m.bcur||{};m.bcur.foe=Bt.en.indexOf(t)}return t}  // an index, never the enemy itself: party members are saved
async function pickAlly(o={}){const m=Bt&&Bt.active||lead();return uiTarget(m,{ok:x=>!(o.noKO&&x.ko)&&!x.out})}
function updHUD(){}  // the old HTML battle cards are gone; the party strip is drawn on the canvas every frame

// ================= AN AGENT'S TURN =================
async function agentTurn(m){
 Bt.active=m;if(m.dead||m.gone)return;
 // Downed: bleeds out after 3 of their own turns unless Revived (0 HP)
 if(m.ko){m.koT=(m.koT||0)+1;if(m.koT>=2)m.koLong=true;
  if(m.koT>=3){m.dead=true;await bsay(fillT(BL_.bledOut,{n:m.name}),1400);await trigger('death');return}
  await bsay(fillT(BL_.downTurn,{n:m.name,k:3-m.koT===1?BTW.down1:fillT(BTW.downT,{k:3-m.koT})}),1100);return}
 m.defend=false;m.slip=false;m.drawFire=false;m.vanish=false;
 // Bleeding and Poisoned take 1 HP a turn from agents (Combat numbers)
 if(hasSt(m,'bleed')&&!(hasSt(m,'high')&&m.high==='strongpk')){await hurtAgent(m,1,null,{tick:1});await bsay(fillT(BL_.bleedTick,{n:m.name,h:1}),800);if(m.ko)return}
 if(hasSt(m,'poison')){await hurtAgent(m,1,null,{tick:1});await bsay(fillT(BL_.poisonTick,{n:m.name,h:1}),800);if(m.ko)return}
 if(m.stun>0){m.stun--;clearStatus(m,'stun');await bsay(fillT(BL_.stunned,{n:m.name}),900);return}
 if(m.skip){m.skip=0;await bsay(fillT(BL_.stunned,{n:m.name}),900);return}
 if(m.grap){if(m.grap.dead||m.grap.gone)m.grap=null;else{await bsay(fillT(BL_.hold,{n:m.name,e:m.grap.name}),900);return}}
 if(m.out)return snapTurn(m);
 for(;;){
  const c=await uiCmd(m);
  let r;
  if(c===0)r=await doFight(m);
  else if(c===1)r=await skillsList(m);
  else if(c===2)r=await itemsList(m);
  else r=await guardList(m);
  if(r===false)continue;
  m.lastAct=Bt.round;return r;
 }
}
// the detail line under the row: the agent, their weapon, its dice and to-hit, "free"
function cmdDetail(m){const W=m.w;return fillT(BTW.detail,{n:m.name.toUpperCase(),wn:cap(W.name),d:diceTxt(W),s:W.sk||'Melee',p:fightChance(m,null)})}
const cap=s=>String(s).charAt(0).toUpperCase()+String(s).slice(1);
const diceTxt=W=>W.dmg&&W.dmg[0]?`${W.dmg[0]}d${W.dmg[1]}${W.bonus>0?'+'+W.bonus:W.bonus<0?W.bonus:''}`:'—';
const isGun=W=>W&&W.sk!=='Melee'&&!W.thrown&&W.key!=='fists'&&W.sk!=='Athletics';
// to-hit for a plain Fight, with every modifier (Fight floor 30%; thrown weapons skip the floor)
function attackChance(m,e,W,mod=0,floor=false){
 let p=skillVal(m.a,W.sk)+(W.hit||0)+rollMod(m,W.sk)+mod;
 if(e&&isFoe(e)){if(chip(e,'exposed'))p+=20;if(e.grapBy&&e.grapBy!==m)p+=20;if(e.downedAlly&&m.a.arc&&m.a.arc.perk==='revenge')p+=20}  // Cold head (spec 008)
 if(floor&&!W.thrown)p=Math.max(30,p);return clamp(p,1,99)}
const fightChance=(m,e)=>attackChance(m,e,m.w,0,true);
async function doFight(m){
 const W=m.w;
 if((W.key==='huntrifle'||W.key==='taser')&&m.lastShot===Bt.round-1){await bsay(BTW.why.twice,900);return false}
 const t=await uiTarget(m,{foes:true,snapped:true,info:e=>fillT(BTW.target,{e:e.name,p:fightChance(m,e),d:diceTxt(W)})});
 if(!t)return false;
 await attack(m,t,{fight:true});return true}
// one attack with a weapon: o.W (default: the equipped one), o.mod, o.half, o.double, o.auto (no roll, no crit),
// o.fight (the Fight floor), o.stun / o.bleed on a hit. Returns {hit, crit, dmg}.
async function attack(m,t,o={}){
 const W=o.W||m.w,word=(o.word||W.sk||'Melee').toUpperCase(),p=attackChance(m,t,W,o.mod||0,!!o.fight);
 if((W.loud||o.loud)&&!Bt.loud){Bt.loud=1;await trigger('loud')}  // PTSD: the first Loud attack in a fight
 if(W.key==='huntrifle'||W.key==='taser')m.lastShot=Bt.round;
 const r=o.auto?{ok:true,crit:false,fumble:false}:SR.pct(p);
 if(!o.auto)bres(word,r);
 if(!r.ok){tried(m,W.sk);await bsay(r.fumble?fillT(isGun(W)?BL_.fumbleGun:BL_.fumbleMelee,{n:m.name,wn:W.name}):fillT(BL_.miss,{n:m.name,v:W.verb,e:t.name}),1000);return{hit:false}}
 let dmg=0;
 if(W.key!=='taser'){dmg=Math.max(1,roll(W.dmg[0],W.dmg[1],W.bonus||0));
  if(r.crit)dmg*=2;if(o.double)dmg*=2;if(o.half)dmg=Math.floor(dmg/2);
  if(W.key==='flaregun'&&isFoe(t)&&t.weak==='fire')dmg*=2}
 await bsay(fillT(r.crit?BL_.crit:BL_.hit,{n:m.name,v:W.verb,e:t.name,h:dmg}),1000);
 if(isFoe(t))await hurtFoe(t,dmg,m);else await hurtAgent(t,dmg,m);
 // weapon extras: machete, nail gun and broken bottle bleed; revolver crits bleed; hockey stick crits Stun;
 // a golf club crit drops the enemy to last; the taser Stuns a human; the chainsaw leaves you Sickened; Vanish's next hit bleeds
 if(isFoe(t)&&!t.dead){
  if(o.bleed||['machete','nailgun','bottle'].includes(W.key)||(W.key==='revolver'&&r.crit)||m.vanishHit)await foeStatus(t,'bleed');
  if(o.stun||(W.key==='stick'&&r.crit)||(W.key==='taser'&&(t.tags||[]).includes('human')))await foeStatus(t,'stun');
  if(W.key==='golf'&&r.crit){t.last=1;toBack(t);await bsay(fillT(BL_.shoved,{e:t.name}),800)}
  if(W.key==='pitchfork')t.noHit=m}
 m.vanishHit=false;
 if(W.key==='chainsaw'&&await addStatus(m,'sick'))await bsay(fillT(BL_.chainsaw,{n:m.name}),900);
 if(W.thrown){m.hatchet=true;const g=gearOf(m),j=g.w.findIndex(it=>itemDef(it.k).w===W.key);if(j>=0){m.hatchetIt=g.w.splice(j,1)[0];g.eq=0;refreshW(m)}await bsay(BL_.hatchet,800)}
 return{hit:true,crit:r.crit,dmg}}
function toBack(e){const i=Bt.queue.indexOf(e);if(i>0){Bt.queue.splice(i,1);Bt.queue.push(e)}}
async function hurtFoe(e,d,src){
 e.hp=Math.max(0,e.hp-d);e.flash=16;e.shk=10;floatOn(e,fillT(BL_.dmgFloat,{h:d}));if(src)e.lastHit=src;
 if(e.hp<=0&&!e.dead){e.dead=true;if(e.grapBy){e.grapBy.grap=null;e.grapBy=null}await bsay(fillT(BL_.eDie,{e:e.name,d:e.die||'falls'}),1000);return}
 // a boss's second phase (stand-in until Part C designs the Gleaner's phases)
 if(e.phase2&&Bt.phase===1&&e.hp<=e.mhp*(e.phase2.at||.5)){Bt.phase=2;e.ph2=true;await bsay(e.phase2.line||fillT(BL_.phase,{e:e.name}),1800)}}
// damage to an agent: Defend halves (round down), body armor takes 1 off, the frying pan blocks the first hit while Defending
async function hurtAgent(m,d,src,o={}){
 // Not on my watch (an arc perk, spec 008): once per fight, an ally takes the hit that would Down this agent, at half damage
 if(!o.tick&&!o.cover&&d>0&&!m.ko&&m.hp-d<=0){const p=party.find(x=>x!==m&&!x.ko&&!x.gone&&!x.out&&x.a.arc&&x.a.arc.perk==='protect');
  if(p&&Bt&&!Bt.used['watch'+p.a.id]){Bt.used['watch'+p.a.id]=1;await bsay(fillT(BLS.HOMEW.perkUsed,{p:BLS.HOMEW.perks.protect[0],n:p.name}),900);return hurtAgent(p,Math.floor(d/2),src,{cover:true})}}
 if(!o.tick){if(m.defend&&m.w.key==='pan'&&!m.panUsed){m.panUsed=true;d=0}
  if(m.defend)d=Math.floor(d/2);if(wearing(m,'armor')&&d>0)d=Math.max(0,d-1)}
 if(d>0)m.hurt=G.fs.fight|0;m.hp=Math.max(0,m.hp-d);m.shk=10;if(d>0||!o.tick)floatOn(m,fillT(BL_.dmgFloat,{h:d}),PC.pump);
 if(m.hp<=0&&!m.ko){m.ko=true;m.koT=0;m.wasDowned=true;if(src&&isFoe(src))src.downedAlly=true;if(m.grap){m.grap.grapBy=null;m.grap=null}
  await bsay(fillT(BL_.downed,{n:m.name}),1000);
  // whoever Downs a snapped teammate makes a Severe violence roll (Losing an agent)
  if(m.out&&src&&src.a&&src!==m)await horror({tier:'severe',kind:'violence',label:`Putting ${m.name} down`},{who:[src]})}}
// 0 SAN in a fight: the agent snaps. 25% each: hurt themselves, a random ally, a random enemy, nothing.
async function snapTurn(m){
 const k=rnd(4);
 if(k===0){const d=Math.max(1,roll(m.w.dmg[0]||1,m.w.dmg[1]||4,m.w.bonus||0));await bsay(fillT(BL_.snapSelf,{n:m.name,wn:m.w.name}),1100);await hurtAgent(m,d,m,{tick:1});return}
 if(k===1){const a=party.filter(x=>x!==m&&!x.ko&&!x.dead&&!x.gone);if(a.length){const t=pick(a);await bsay(fillT(BL_.snapAlly,{n:m.name,t:t.name}),1000);await attack(m,t,{fight:true});return}}
 if(k===2){const f=aliveFoes();if(f.length){const t=pick(f);await bsay(fillT(BL_.snapFoe,{n:m.name,e:t.name}),1000);await attack(m,t,{fight:true});return}}
 await bsay(fillT(BL_.snapNone,{n:m.name}),1100)}

// ================= SKILLS: battle moves, status moves and the other skills in battle =================
const hasMove=(m,mv)=>skillVal(m.a,mv.skill)>=mv.tier;
const costOf=(m,mv)=>mv.key==='burst'&&m.w.key==='smg'?1:mv.wp;
function foeOk(m,mv,e){const tg=e.tags||[];
 if(mv.human&&!tg.includes('human'))return false;if(mv.living&&!tg.includes('living'))return false;if(mv.hurt&&e.hp>=e.mhp)return false;
 if(mv.bound&&!(tg.includes('unnatural')&&((G.fs.identBy||{})[e.t]||[]).includes(m.a.id)))return false;
 if(mv.records&&!(e.records&&e.records()))return false;return true}
function allyOk(mv,x){if(mv.t==='downed')return x.ko&&!x.dead;if(x.ko||x.out)return false;
 if(mv.shaken)return hasSt(x,'shaken');if(mv.treat)return['bleed','poison','sick'].some(k=>hasSt(x,k));if(mv.flare)return flaringAny(x);return true}
function moveWhy(m,mv){
 if(m.wp<costOf(m,mv))return BTW.why.wp;if(mv.gun&&!isGun(m.w))return BTW.why.gun;if(mv.perFight&&Bt.used[mv.key+m.a.id])return BTW.why.once;
 if(mv.t==='foe'&&!aliveFoes().some(e=>foeOk(m,mv,e)))return BTW.why.noTarget;
 if((mv.t==='ally'||mv.t==='downed')&&!party.some(x=>!x.dead&&!x.gone&&allyOk(mv,x)))return BTW.why.noTarget;
 if(mv.key==='flare'&&!aliveFoes().some(e=>(e.tags||[]).includes('beast')))return BTW.why.noTarget;
 return''}
function moveChance(m,mv){if(mv.noRoll||mv.key==='deadeye')return null;if(['aimed','burst'].includes(mv.key))return attackChance(m,null,m.w,mv.hit||0);
 if(['shove','haymaker','grapple'].includes(mv.key))return attackChance(m,null,meleeW(m),mv.hit||0);return chanceOf(m,mv.skill,mv.hit||0)}
// the melee weapon for Melee moves: the equipped one if it's a melee weapon, else fists
function meleeW(m){if(m.w.sk==='Melee'&&!m.w.thrown)return m.w;const F=B.WEAP.fists;return{key:'fists',name:F.name,dmg:F.dmg,bonus:(F.plus||0)+strBonus(m.a.stats.STR),verb:F.verb,sk:'Melee',melee:1,hit:0}}
async function skillsList(m){
 const mvs=MV.filter(mv=>hasMove(m,mv));
 if(!mvs.length){await bsay(BTW.noSkills,900);return false}
 const rows=mvs.map(mv=>{const why=moveWhy(m,mv),p=moveChance(m,mv);return{label:mv.name,right:fillT(BTW.wp,{w:costOf(m,mv)})+(p!=null?` · ${p}%`:''),dis:!!why,desc:why||mv.line}});
 const i=await uiList(m,'skill',rows);if(i<0)return false;
 return runMove(m,mvs[i])}
async function runMove(m,mv){
 let t=null;
 if(mv.t==='foe'){t=await uiTarget(m,{foes:true,info:e=>foeOk(m,mv,e)?`${e.name} · ${moveTargetOdds(m,mv,e)}`:`${e.name} · ${BTW.why.noTarget}`});if(!t)return false;
  if(!foeOk(m,mv,t)){await bsay(BTW.why.noTarget,800);return false}}
 if(mv.t==='ally'||mv.t==='downed'){t=await uiTarget(m,{ok:x=>allyOk(mv,x),info:x=>`${x.name} · ${x.ko?'DOWN':x.hp+'/'+x.mhp+' HP'}`});if(!t)return false}
 let k=null;if(mv.key==='treat'){const ks=['bleed','poison','sick'].filter(s=>hasSt(t,s));if(ks.length>1){const j=await uiList(m,'treat',ks.map(s=>({label:PST[s].name,desc:PST[s].line})));if(j<0)return false;k=ks[j]}else k=ks[0]}
 m.wp-=costOf(m,mv);if(mv.perFight)Bt.used[mv.key+m.a.id]=1;
 if(mv.loud&&!Bt.loud){Bt.loud=1;await trigger('loud')}
 const MW=meleeW(m);
 switch(mv.key){
  case'aimed':await attack(m,t,{mod:-20,double:true});return true
  case'deadeye':await attack(m,t,{auto:true,bleed:true});return true
  case'burst':{const d=SR.d100();for(const e of aliveFoes()){const o=SR.pct(attackChance(m,e,m.w),d);bres((m.w.sk||'Firearms').toUpperCase(),o);
    if(!o.ok){await bsay(fillT(BL_.miss,{n:m.name,v:m.w.verb,e:e.name}),700);continue}
    let dmg=Math.max(1,roll(m.w.dmg[0],m.w.dmg[1],m.w.bonus||0));if(o.crit)dmg*=2;dmg=Math.floor(dmg/2);await bsay(fillT(BL_.hit,{n:m.name,v:m.w.verb,e:e.name,h:dmg}),700);await hurtFoe(e,dmg,m)}
   if((m.w.loud)&&!Bt.loud){Bt.loud=1;await trigger('loud')}return true}
  case'shove':{const r=await attack(m,t,{W:MW,half:true});if(r.hit&&!t.dead){t.last=1;toBack(t);await bsay(fillT(BL_.shoved,{e:t.name}),800)}return true}
  case'haymaker':await attack(m,t,{W:MW,mod:-20,stun:true});return true
  case'grapple':{const o=SR.pct(attackChance(m,t,MW));bres('MELEE',o);if(!o.ok){tried(m,'Melee');await bsay(fillT(o.fumble?BL_.fumbleMelee:BL_.grappleFail,{n:m.name,e:t.name}),900);return true}
   if(t.grapBy)t.grapBy.grap=null;t.grapBy=m;m.grap=t;await bsay(fillT(BL_.grapple,{n:m.name,e:t.name}),1000);return true}
  case'drawfire':m.defend=true;m.drawFire=true;await bsay(fillT(BL_.drawFire,{n:m.name}),1000);return true
  case'vanish':if(!await skillRoll(m,mv))return true;m.vanish=true;m.vanishHit=true;await bsay(fillT(BL_.vanish,{n:m.name}),900);return true
  case'tripwire':if(!await skillRoll(m,mv))return true;m.tripwire=true;await bsay(fillT(BL_.tripwire,{n:m.name}),900);return true
  case'triage':{if(!await skillRoll(m,mv))return true;const hs=party.filter(x=>!x.ko&&!x.dead&&!x.gone&&!x.out).map(x=>{const h=roll(1,2);x.hp=Math.min(x.mhp,x.hp+h);floatOn(x,'+'+h,PC.green);return`${x.name} +${h}`});await bsay(hs.join(', ')+' HP.',1200);return true}
  case'flare':{if(!await skillRoll(m,mv))return true;for(const e of aliveFoes().filter(e=>(e.tags||[]).includes('beast')))await foeStatus(e,'shaken');return true}
 }
 if(!await skillRoll(m,mv,t))return true;
 switch(mv.key){
  case'spot':t.spotted=true;await bsay(fillT(BL_.spot,{n:m.name}),800);await foeStatus(t,'exposed');break
  case'alarm':await foeStatus(t,'exposed');break
  case'badge':case'tackle':case'bind':await foeStatus(t,'stun');if(mv.key==='tackle'){m.skip=1;await bsay(fillT(BL_.tackle,{n:m.name}),800)}break
  case'wound':await foeStatus(t,'bleed');break
  case'caustic':await foeStatus(t,'poison');break
  case'name':await foeStatus(t,'shaken');break
  case'intimidate':if(Bt.lastRoll&&Bt.lastRoll.crit){t.gone=true;await bsay(fillT(BL_.eFlees,{e:t.name}),1000)}else await foeStatus(t,'shaken');break
  case'calm':clearStatus(t,'shaken');await bsay(fillT(BL_.calm,{n:m.name,t:t.name}),1000);break
  case'patch':{const h=roll(1,4);t.hp=Math.min(t.mhp,t.hp+h);floatOn(t,'+'+h,PC.green);await bsay(fillT(MMW.healed,{n:t.name,h}),1000);break}
  case'treat':clearStatus(t,k);await bsay(fillT(MMW.treated,{n:t.name,s:PST[k].name}),1000);break
  case'revive':await standUp(t,roll(1,4));break
  case'sedate':calmFlare(t);await bsay(fillT(MMW.sedated,{n:t.name}),1000);break
  case'identify':{G.fs.ident=G.fs.ident||[];if(!G.fs.ident.includes('en:'+t.t))G.fs.ident.push('en:'+t.t);G.fs.identBy=G.fs.identBy||{};(G.fs.identBy[t.t]=G.fs.identBy[t.t]||[]).push(m.a.id);
   await bsay(fillT(BL_.identify,{n:m.name,w:t.weakLine||''}),1600);break}
 }
 return true}
function moveTargetOdds(m,mv,e){if(['aimed'].includes(mv.key))return attackChance(m,e,m.w,-20)+'%';if(['shove','haymaker','grapple'].includes(mv.key))return attackChance(m,e,meleeW(m),mv.hit||0)+'%';if(mv.key==='deadeye')return'100%';return chanceOf(m,mv.skill,mv.hit||0)+'%'}
// a status or skill move: a roll against the skill (WP is already spent, even on a fumble)
async function skillRoll(m,mv){const o=SR.pct(chanceOf(m,mv.skill,mv.hit||0));Bt.lastRoll=o;bres(mv.skill.toUpperCase(),o);
 if(o.ok)return true;tried(m,mv.skill);await bsay(o.fumble?BL_.fumbleSkill:mv.key==='identify'?fillT(BL_.identifyFail,{n:m.name}):`${mv.name}: it doesn't take.`,900);return false}
async function standUp(t,h){t.ko=false;t.hp=Math.min(t.mhp,h);floatOn(t,'+'+h,PC.green);await bsay(fillT(BL_.revived,{n:t.name,h}),1000)}

// ================= GUARD: Defend, Slip, Brace, Retch, Flee =================
async function guardList(m){
 const G_=BTW.guard,dodge=skillVal(m.a,'Dodge')>=40,rows=[],acts=[];
 const add=(k,why,fn)=>{rows.push({label:G_[k][0],right:k==='brace'?'1d4 WP':BTW.free,dis:!!why,desc:why||G_[k][1]});acts.push(fn)};
 add('defend','',async()=>{m.defend=true;await bsay(fillT(BL_.defend,{n:m.name}),800)});
 if(dodge)add('slip','',async()=>{m.defend=true;m.slip=true;await bsay(fillT(BL_.slipOn,{n:m.name}),800)});
 add('brace',m.wp<=0||flaring(m,'depression')?BTW.why.brace:'',async()=>{const w=Math.min(m.wp,roll(1,4)*(hasSt(m,'tired')?2:1));m.wp-=w;m.braceB=true;await bsay(fillT(BL_.brace,{n:m.name,w}),900)});
 add('retch',hasSt(m,'sick')&&!m.retched?'':BTW.why.retch,async()=>{m.retched=true;const o=SR.pct(m.a.stats.CON*5+rollMod(m,''));bres('CON',o);if(o.ok){clearStatus(m,'sick');await bsay(fillT(MMW.retched,{n:m.name}),900)}else await bsay(fillT(MMW.retchFail,{n:m.name}),900)});
 add('flee',Bt.roamer?'':BTW.why.flee,async()=>flee(m));
 const i=await uiList(m,'guard',rows);if(i<0)return false;return acts[i]()}
// Flee: roamer fights only; the party's lowest Athletics is rolled (Outrun: an agent at 75%+ rolls for everyone;
// Second wind: once per case, a failed flee succeeds anyway; a smoke grenade makes it succeed)
async function flee(m){
 if(Bt.smoke){await bsay(BL_.smokeFlee,1000);return'flee'}
 const up=party.filter(x=>!x.ko&&!x.dead&&!x.gone&&!x.out),fast=up.filter(x=>skillVal(x.a,'Athletics')>=75).sort((a,b)=>chanceOf(b,'Athletics')-chanceOf(a,'Athletics'));
 const who=fast[0]||up.slice().sort((a,b)=>chanceOf(a,'Athletics')-chanceOf(b,'Athletics'))[0]||m;
 const o=SR.pct(chanceOf(who,'Athletics'));bres('ATHLETICS',o);
 if(!o.ok){const sw=up.find(x=>skillVal(x.a,'Athletics')>=90&&!G.fs.perk['wind'+x.a.id]);if(sw){G.fs.perk['wind'+sw.a.id]=1;await bsay(fillT(SKW.perk,{p:'Second wind'}),900)}else{tried(who,'Athletics');await bsay(BL_.fleeFail,900);return true}}
 await bsay(BL_.flee,1000);return'flee'}

// ================= ITEMS: only what this agent carries =================
// Their 2 weapons first (picking the other swaps and ends the turn), then their items. Items are free.
async function itemsList(m){
 const g=gearOf(m),rows=[],acts=[];
 g.w.forEach((it,j)=>{rows.push({label:(j===g.eq?'E ':'')+rowName(it),right:j===g.eq?'':BTW.free,dis:j===g.eq,desc:detailOf(it,m).split('\n')[0]});
  acts.push(async()=>{g.eq=j;refreshW(m);await bsay(fillT(BL_.swap,{n:m.name,wn:m.w.name}),900);return true})});
 g.it.forEach(it=>{const why=itemWhy(m,it);rows.push({label:rowName(it),right:BTW.free,dis:!!why,desc:why||itemDef(it.k).desc});
  acts.push(async()=>{const ok=await battleItem(m,it);if(ok){spend(m,it);return true}return false})});
 if(!rows.length){await bsay(BTW.noItems,800);return false}
 for(;;){const i=await uiList(m,'item',rows);if(i<0)return false;const r=await acts[i]();if(r!==false)return r}}
const THROW=['frag','flashbang','molotov','smoke','roadflare'];
function itemWhy(m,it){const d=itemDef(it.k);if(it.u<=0)return BTW.why.spent;
 if(d.battleUse)return'';
 if(it.k==='bugbomb'&&Bt.used.bug)return BTW.why.once;
 if(it.k==='adrenaline'&&!party.some(x=>x.ko&&!x.dead))return BTW.why.noTarget;
 if(it.k==='bearspray'&&!aliveFoes().some(e=>(e.tags||[]).includes('beast')))return BTW.why.noTarget;
 if(it.k==='zipties'&&!aliveFoes().some(e=>(e.tags||[]).includes('human')&&(e.hp<=e.mhp/4||e.stun>0)))return BTW.why.noTarget;
 if(it.k==='roadflare'&&!aliveFoes().some(e=>(e.tags||[]).includes('lightshy')))return BTW.why.noTarget;
 if(THROW.includes(it.k)||['bearspray','zipties','adrenaline','bugbomb'].includes(it.k))return'';
 if(d.map&&!['flare','roamer','jammer','uv','hotline'].includes(d.map))return'';
 return IU.notFight}
async function throwIt(m,it){const o=SR.pct(chanceOf(m,'Athletics'));bres('ATHLETICS',o);if(it.loud&&!Bt.loud){Bt.loud=1;await trigger('loud')}
 if(!o.ok){tried(m,'Athletics');await bsay(o.fumble?BL_.fumbleSkill:`The ${itemDef(it.k).name.toLowerCase()} goes wide.`,900)}return o.ok}
async function battleItem(m,it){
 const d=itemDef(it.k),k=it.k;
 if(d.battleUse)return !!(await d.battleUse(m,it));
 const ally=async(ok)=>uiTarget(m,{ok:x=>!x.ko&&!x.out&&(ok?ok(x):true),info:x=>`${x.name} · ${x.hp}/${x.mhp} HP`});
 const heal=async(t,h)=>{t.hp=Math.min(t.mhp,t.hp+h);floatOn(t,'+'+h,PC.green);await bsay(fillT(MMW.healed,{n:t.name,h}),1000)};
 const clearIt=async s=>{const t=await ally(x=>hasSt(x,s));if(!t)return false;clearStatus(t,s);await bsay(fillT(MMW.treated,{n:t.name,s:PST[s].name}),1000);return true};
 if(THROW.includes(k)){
  if(k==='molotov'){const t=await uiTarget(m,{foes:true,info:e=>`${e.name} · ${chanceOf(m,'Athletics')}%`});if(!t)return false;if(!await throwIt(m,{k,loud:d.loud}))return true;
   const h=roll(1,8)*(t.weak==='fire'||(t.tags||[]).includes('burns')?2:1);await bsay(`The Molotov bursts over ${t.name}. ${h} damage.`,1000);await hurtFoe(t,h,m);return true}
  if(k==='roadflare'){const t=await uiTarget(m,{foes:true,info:e=>e.name});if(!t)return false;if(!await throwIt(m,{k}))return true;if((t.tags||[]).includes('lightshy'))await foeStatus(t,'shaken');else await bsay(fillT(BL_.resist,{e:t.name}),800);return true}
  if(!await throwIt(m,{k,loud:d.loud}))return true;
  if(k==='frag'){await bsay('The grenade goes off.',700);for(const e of aliveFoes())await hurtFoe(e,roll(1,6),m);return true}
  if(k==='flashbang'){const hs=aliveFoes().filter(e=>(e.tags||[]).includes('human'));if(!hs.length)await bsay('A white bang. Nothing here cares.',900);for(const e of hs)await foeStatus(e,'stun');return true}
  if(k==='smoke'){Bt.smoke=2;await bsay('Smoke rolls over everything. Enemies −20% to hit.',1000);return true}}
 switch(k){
  case'bearspray':{const t=await uiTarget(m,{foes:true,info:e=>e.name});if(!t)return false;if((t.tags||[]).includes('beast'))await foeStatus(t,'stun');else await bsay(fillT(BL_.resist,{e:t.name}),800);return true}
  case'zipties':{const t=await uiTarget(m,{foes:true,info:e=>e.name});if(!t)return false;if(!((t.tags||[]).includes('human')&&(t.hp<=t.mhp/4||t.stun>0))){await bsay(BTW.why.noTarget,800);return false}
   t.gone=true;G.fs.zip=(G.fs.zip||0)+1;await bsay(fillT(BL_.zip,{n:m.name,e:t.name}),1000);return true}
  case'adrenaline':{const t=await uiTarget(m,{ok:x=>x.ko&&!x.dead,info:x=>x.name});if(!t)return false;await standUp(t,roll(1,4));return true}
  case'bugbomb':{Bt.used.bug=1;await bsay('The bug bomb hisses.',800);for(const e of aliveFoes().filter(e=>(e.tags||[]).includes('living')))await foeStatus(e,'poison');return true}
 }
 switch(d.map){
  case'heal4':{const t=await ally();if(!t)return false;await heal(t,roll(1,4));return true}
  case'heal6':{const t=await ally();if(!t)return false;await heal(t,roll(1,6));return true}
  case'bandage':return clearIt('bleed');
  case'salts':return clearIt('sick');
  case'antitoxin':return clearIt('poison');
  case'cigs':return clearIt('shaken');
  case'energy':{const t=await ally();if(!t)return false;clearStatus(t,'tired');const w=roll(1,4);t.wp=Math.min(t.mwp,t.wp+w);await bsay(`${t.name} +${w} WP.`,900);return true}
  case'icepack':{const t=await ally();if(!t)return false;clearStatus(t,'stun');t.stun=0;await heal(t,roll(1,4));return true}
 }
 // drinks, drugs and sedatives work exactly as on the map (field.js)
 return useItem(m,it)}

// ================= AN ENEMY'S TURN =================
async function foeTurn(e){
 if(e.dead||e.gone)return;Bt.active=e;
 e.st=e.st.filter(k=>k!=='exposed');  // Exposed lasts until its next turn
 if(e.last)e.last=0;
 // Bleeding and Poisoned take 2 HP a turn from enemies (bigger bodies, bigger HP)
 if(chip(e,'bleed')){await bsay(fillT(BL_.eBleed,{e:e.name,h:2}),800);await hurtFoe(e,2,null);if(e.dead)return}
 if(chip(e,'poison')){await bsay(fillT(BL_.ePoison,{e:e.name,h:2}),800);await hurtFoe(e,2,null);if(e.dead)return}
 if(e.stun>0){e.stun--;e.lastStun=Bt.round;await bsay(fillT(BL_.eStunned,{e:e.name}),900);return}
 // Grapple: it rolls its attack % against the grappler's Melee to break free
 if(e.grapBy){const g=e.grapBy;if(g.ko||g.dead||g.out){g.grap=null;e.grapBy=null}else{
  const a=SR.pct(foeHit(e)),b=SR.pct(chanceOf(g,'Melee'));
  if(a.ok&&(!b.ok||a.r>b.r)){g.grap=null;e.grapBy=null;await bsay(fillT(BL_.breakFree,{e:e.name}),900)}else{await bsay(fillT(BL_.pinned,{e:e.name}),900);return}}}
 const pool=[];(e.moves||[['hit',1]]).forEach(([k,w])=>{const ww=w+(e.ph2&&e.phase2&&e.phase2.moves&&e.phase2.moves[k]||0);for(let i=0;i<ww;i++)pool.push(k)});
 const mv=pick(pool);
 if(mv==='san'){await bsay(e.sanText||'',1400);await horror({spec:e.sanHit||['0','1'],label:e.sanLabel||'The words get inside',kind:'unnatural'});return}
 if(mv==='all'){await bsay(e.allText||'',1100);for(const m of targetsOf(e,true))await foeHits(e,m,e.allDmg||'1d3');return}
 const t=pickTarget(e);if(!t){await bsay(fillT(BL_.eFumble,{e:e.name}),800);return}
 await foeHits(e,t,e.dmg,{bleed:mv==='bleed'})}
// an enemy's attack %: Shaken and Poisoned −20 each, smoke −20, a boss's second phase can add to it
function foeHit(e){let p=e.hit+(e.ph2&&e.phase2?e.phase2.hit||0:0);if(chip(e,'shaken'))p-=20;if(chip(e,'poison'))p-=20;if(Bt.smoke)p-=20;return clamp(p,1,99)}
function targetsOf(e,all){return party.filter(m=>!m.ko&&!m.dead&&!m.gone&&(all||!m.vanish))}
// targeting: Draw fire forces it; Vanish hides; otherwise random, leaning toward whoever hurt it last (about half)
function pickTarget(e){
 let ts=targetsOf(e);if(!ts.length)ts=targetsOf(e,true);if(!ts.length)return null;
 if(e.noHit&&ts.length>1)ts=ts.filter(m=>m!==e.noHit);e.noHit=null;
 const df=ts.find(m=>m.drawFire);if(df)return df;
 if(e.lastHit&&ts.includes(e.lastHit)&&Math.random()<.5)return e.lastHit;
 return pick(ts)}
async function foeHits(e,t,dmgS,o={}){
 const r=SR.pct(foeHit(e));
 if(!r.ok){await bsay(r.fumble?fillT(BL_.eFumble,{e:e.name}):fillT(BL_.eMiss,{e:e.name,v:e.verb||'attacks',n:t.name}),900);return}
 // Slip: while Defending, roll Dodge against each attack; a pass takes no damage (and Riposte counters at 90%)
 if(t.slip){const s=SR.pct(chanceOf(t,'Dodge'));bres('DODGE',s);
  if(s.ok){await bsay(fillT(BL_.slip,{n:t.name}),900);if(skillVal(t.a,'Dodge')>=90&&!e.dead){await bsay(BL_.riposte,600);await attack(t,e,{fight:true})}return}tried(t,'Dodge')}
 let d=Math.max(1,rollS(dmgS));if(r.crit)d*=2;
 const pre=d,def=t.defend;
 await bsay(fillT(r.crit?BL_.eCrit:BL_.eHit,{e:e.name,v:e.verb||'hits',n:t.name,h:def?Math.floor(d/2):d}),1000);
 await hurtAgent(t,d,e);
 if(o.bleed&&!t.ko&&pre>0)await addStatus(t,'bleed',{noShrug:true});
 if(t.tripwire&&!e.dead){t.tripwire=false;await foeStatus(e,'stun')}}

// ================= THE END OF A FIGHT =================
async function endBattle(res){
 const boss=Bt.boss,roamer=Bt.roamer;Bt.ui=null;Bt.active=null;
 if(res==='win')await bsay(BL_.win,900);
 const dead=party.filter(m=>m.dead),hurt=party.filter(m=>m.wasDowned&&!m.dead&&!m.out&&!m.gone);
 party.forEach(m=>{if(m.ko&&!m.dead){m.ko=false;m.hp=Math.max(1,m.hp)}m.stun=0;m.defend=m.slip=m.drawFire=m.vanish=m.vanishHit=m.tripwire=false;m.grap=null;m.braceB=false;if(m.bcur)delete m.bcur.foe;
  if(m.hatchetIt){const g=gearOf(m);if(g.w.length<2)g.w.push(m.hatchetIt);else G.fs.pack.push(m.hatchetIt);m.hatchetIt=null;refreshW(m)}});
 gEl.classList.remove('battle');Bt=null;G.mode='world';hideTB();
 sceneEnd();clearStatusAll('stun');
 if(res==='lose')return'lose';
 // bleeding out is death, for good (0 HP); the lost agent leaves as at 0 SAN
 for(const m of dead){await loseAgent(m,'bled out');if(!party.length)return'lose'}
 // lasting injuries: every agent Downed during the fight who survived it, Revived or not
 for(const m of hurt){if(party.includes(m))await injuryRoll(m,boss||isFinaleCase(G.case));  // +2 in a boss or season finale fight (spec 009)
 if(!party.length)return'lose'}
 // agents who hit 0 SAN in the fight leave when it ends (Losing an agent)
 for(const m of party.filter(m=>m.out||m.san<=0)){await say('',fillT(SW.zero,{n:m.name}));await loseAgent(m,'0 SAN');if(!party.length)return'lose'}
 // a roamer's drop: 20% from the case's loot table (field.js lootDrop; spec 006 C4)
 if(res==='win'&&roamer)await lootDrop();
 if(res==='win')G.fights=(G.fights||0)+1;
 return res}
function clearStatusAll(k){party.forEach(m=>clearStatus(m,k))}
// Lasting injuries (Combat): CON × 5%; a failure rolls 1d12 + 2 in a boss fight, + 2 if Downed 2+ of their own turns,
// + 2 if the CON roll fumbled. Minor fades after the next case; Serious needs rehab; Grave is permanent and costs SAN.
async function injuryRoll(m,boss){
 const a=m.a,o=SR.pct(a.stats.CON*5);await say('',resultLine('CON',o),{auto:1000});
 if(o.ok){await say('',fillT(BL_.walkOff,{n:m.name}),{auto:1000});return}
 const mods=(boss?2:0)+(m.koLong?2:0)+(o.fumble?2:0);a.inj=Array.isArray(a.inj)?a.inj:[];
 let n,I,tries=0;
 for(;;){n=Math.min(15,roll(1,12)+mods);I=INJ[n];const was=a.inj.find(x=>x.k===n);if(I.tier==='grave'&&was&&tries++<4)continue;  // a repeat Grave rerolls
  if(was&&I.tier==='minor'){was.left=2;break}
  if(was&&I.tier==='serious'){was.perm=true;await say('',BTW.injW.repeat);break}
  if(I.tier!=='career')a.inj.push(I.tier==='minor'?{k:n,tier:'minor',left:2}:{k:n,tier:I.tier});break}
 if(I.tier==='career'){await say('',fillT(BTW.injW.got,{n:m.name,i:I.name,p:I.line}));await say('',fillT(BTW.injW.career,{n:m.name}));await loseAgent(m,'retired');return}
 await say('',fillT(BTW.injW.got,{n:m.name,i:I.name,p:I.line}));
 const d=derived(a);m.mhp=d.HP;m.hp=Math.min(m.hp,m.mhp);refreshW(m);
 if(I.tier==='grave')await horror({tier:'disturbing',kind:'violence',label:BTW.injW.graveLabel},{who:[m]})}
// the injury's tag for the Dossier: Minor (with cases left), Rehab or Permanent, and the penalty in plain words
function injuryTags(a){return(Array.isArray(a.inj)?a.inj:[]).filter(x=>INJ[x.k]).map(x=>{const I=INJ[x.k],W=BTW.injW;
 const tag=x.tier==='minor'?`${W.minor}, ${x.left>1?W.left2:W.left1}`:x.perm||x.tier==='grave'?W.grave:W.serious;return{name:I.name,tag,line:I.line}})}

// ================= DRAWING (B1: the approved combat mockup) =================
const spriteH=e=>{const c=caseById(G.case),s=c&&c.spriteSize?c.spriteSize(e.t):[24,24];return s[1]};
const faceC=new Map();
function foeFace(e){const k=e.t;let f=faceC.get(k);if(f)return f;const c=caseById(G.case),img=c&&c.sprite?c.sprite(e.t,0):null;f=document.createElement('canvas');f.width=f.height=16;
 if(img){const x=f.getContext('2d'),fc=e.face||[0,0,Math.min(img.width,img.height)];x.imageSmoothingEnabled=false;x.drawImage(img,fc[0],fc[1],fc[2],fc[2],0,0,16,16)}faceC.set(k,f);return f}
// the layout for this fight: the baseline drops for a tall enemy so its head stays on screen
function bLayout(){if(Bt.tall==null)Bt.tall=Math.max(0,...Bt.en.map(spriteH));return SB.layout(VW,VH,{tallest:Bt.tall,detailLines:2})}  // a move's whole line shows (Nov 23 playtest)
// the battle backdrop (Combat, Basics, Backgrounds, Nov 23 playtest): the case paints one per kind of place it fights in,
// head-on at battle scale, from where the fight started (Bt.place, the map's id) and its light ('day', 'dusk', 'night').
// case.backdrop(place, {w, h, light, low, feet}) -> a canvas, or null for a place it has none for. low: the lead is
// below 40 SAN, so the case can shrink its lights; the pink and cyan sour itself is laid on here, fading like the map's.
// Cached per size and look, so it's painted once; only a sour fade in progress redraws it.
function battleBackdrop(L){
 const c=caseById(G.case);if(!c||!c.backdrop)return null;
 const m=party[G.lead|0],low=!!(m&&m.san<LOOK.lowSan),k=StudioLight.fade(Bt.sourF,low,performance.now());
 const key=[Bt.place,Bt.light,low?1:0,VW,L.scene.h,L.enemyY].join('|');
 if(!Bt.bd||Bt.bd.key!==key){let art=null;try{art=c.backdrop(Bt.place,{w:VW,h:L.scene.h,light:Bt.light,low,feet:L.enemyY})}catch(e){}
  Bt.bd={key,art,out:null,k:-1};if(art){Bt.bd.out=document.createElement('canvas');Bt.bd.out.width=VW;Bt.bd.out.height=L.scene.h}}
 const b=Bt.bd;if(!b.art)return null;
 if(b.k!==k){const x=b.out.getContext('2d');x.clearRect(0,0,VW,L.scene.h);x.drawImage(b.art,0,0);if(k>0)StudioLight.sour(x,k,{pink:LOOK.pink,cyan:LOOK.cyan});b.k=k}
 return b.out}
// an enemy's damage step for its battle sprite (Art, Townsfolk and monsters, Wounded enemies): 0 unhurt, 1 at half HP, 2 at a quarter
const woundStep=e=>e.hp<=e.mhp*.25?2:e.hp<=e.mhp*.5?1:0;
function drawBattle(){
 const L=bLayout(),t=Bt.t++,u=Bt.ui;Bt.hits=[];
 // background: the case's painted backdrop for this place; a case without one gets the map spot, darkened so the sprites read
 cx.imageSmoothingEnabled=false;const bd=battleBackdrop(L);
 if(bd)cx.drawImage(bd,0,0);
 else{cx.drawImage(Bt.bg,0,0,VW,L.scene.h,0,0,VW,L.scene.h);pR(0,0,VW,L.scene.h,'rgba(14,10,26,.68)');pR(0,L.scene.h-30,VW,30,'rgba(14,10,26,.35)')}
 shimmer(performance.now(),L.scene.h);  // the lead High on Mushrooms: the backdrop sways, sprites and numbers hold still (engine.js)
 pR(0,L.scene.h,VW,VH-L.scene.h,PC.deep);
 // enemies, facing you. Their bars, names, tags and target arrow are drawn after the agents, so on a short screen,
 // where a tall enemy's feet stand behind the agents' heads (L.over), what you read stays on top
 const labels=[];
 const tgt=u&&u.kind==='target'?u.opts[u.sel]:null;
 Bt.en.forEach(e=>{
  if(e.dead||e.gone)e.alpha=Math.max(0,e.alpha-.04);if(e.alpha<=0)return;
  const img=Bt.sprite?Bt.sprite(e.ph2?e.t+'2':e.t,Math.floor((t+e.x)/32)%2,woundStep(e)):null,w=img?img.width:20,h=img?img.height:20;
  const sx=e.shk>0?(e.shk--%2?2:-2):0,x=Math.round(e.x-w/2+sx),y=L.enemyY-h;
  // its shadow on the ground it stands on
  if(bd){cx.globalAlpha=e.alpha*.4;cx.fillStyle='#07050c';const sw=Math.round(Math.min(w,60)*.8);cx.beginPath();cx.ellipse(e.x,L.enemyY-1,sw/2,3,0,0,Math.PI*2);cx.fill();cx.globalAlpha=1}
  if(e.glow){const fl=.55+.35*Math.sin(t*.18);const g=cx.createRadialGradient(e.x,y+h*.2,4,e.x,y+h*.2,70);g.addColorStop(0,e.ph2?`rgba(255,255,240,${.35*fl})`:`rgba(255,190,80,${.32*fl})`);g.addColorStop(1,'rgba(255,150,40,0)');cx.fillStyle=g;cx.fillRect(e.x-80,y-60,160,160)}
  cx.globalAlpha=e.alpha;if(!(e.flash>0&&(e.flash%4)<2)&&img)cx.drawImage(img,x,y);cx.globalAlpha=1;if(e.flash>0)e.flash--;
  if(e.dead||e.gone)return;
  labels.push(()=>{
  // HP bar under the sprite, no numbers until Identify (case) or Spot weak point (fight)
  const known=e.spotted||(G.fs.ident||[]).includes('en:'+e.t),bw=Bt.boss&&e.boss?100:Math.max(30,Math.min(48,w));
  // a boss gets one line: its name, a wide bar, and its HP once known (GLEANER ▬▬▬ 38/60, the mockup)
  if(Bt.boss&&e.boss){const nm=e.base.replace(/^The /,'').toUpperCase(),hs=known?`${e.hp}/${e.mhp}`:'',nw=pW(nm,13)+4,hw=hs?pW(hs,13)+4:0,tw=Math.min(VW-34,nw+96+hw),x0=Math.round(clamp(e.x-tw/2,28,VW-4-tw));
   pT(nm,x0,L.enemyY+1,PC.cream,13);SB.hpBar(cx,BT_THEME,x0+nw,L.enemyY+5,tw-nw-hw,e.hp/e.mhp,5);if(hs)pT(hs,x0+tw-hw+4,L.enemyY+1,PC.cream,13)}
  else{SB.hpBar(cx,BT_THEME,e.x-bw/2,L.enemyY+3,bw,e.hp/e.mhp,4);if(known){const s=`${e.hp}/${e.mhp}`;pT(s,e.x-pW(s,12)/2,L.enemyY+9,PC.cream,12)}}
  // status tags over it (Exposed, Shaken, Bleeding, Poisoned, Stunned)
  let ty=Math.max(2,y-12);const tags=[...e.st,...(e.stun>0?['stun']:[])];tags.forEach(k=>{const S=PST[k];if(!S)return;const tw=pW(S.chip,11)+6;pR(e.x-tw/2,ty,tw,10,S.col);pT(S.chip,e.x-tw/2+3,ty-1,PC.chipInk,11);ty+=11});
  if(tgt===e){const ay=Math.max(2,y-10)+Math.round(Math.sin(t*.2)*2);pR(e.x-3,ay,7,2,PC.gold);pR(e.x-2,ay+2,5,2,PC.gold);pR(e.x-1,ay+4,3,2,PC.gold)}});
  if(u&&u.kind==='target'&&u.opts.includes(e))Bt.hits.push({x:x,y:y,w:w,h:h+12,fn:()=>{u.sel=u.opts.indexOf(e);battlePress('a')}});
 });
 // the three agents along the bottom, backs to the camera, waist up
 party.forEach((m,i)=>{const cxm=VW/6*(2*i+1),act=Bt.active===m,img=BLB.back(m.a,{lantern:i===(G.lead|0)&&!m.ko,downed:m.ko||m.dead});
  const sx=m.shk>0?(m.shk--%2?2:-2):0,dy=m.ko||m.dead?12:act?-3:0;
  if(!m.gone)cx.drawImage(img,Math.round(cxm-BLB.AX+sx),L.agentY-BLB.AY+dy);
  if(tgt===m||(act&&u&&u.kind==='cmd')){const ay=L.agentY-BLB.H+2+dy+Math.round(Math.sin(t*.2)*2);if(tgt===m){pR(cxm-3,ay,7,2,PC.gold);pR(cxm-2,ay+2,5,2,PC.gold);pR(cxm-1,ay+4,3,2,PC.gold)}}
  if(u&&u.kind==='target'&&u.opts.includes(m))Bt.hits.push({x:cxm-40,y:L.agentY-46,w:80,h:46+L.strip.h,fn:()=>{u.sel=u.opts.indexOf(m);battlePress('a')}})});
 labels.forEach(f=>f());
 // the turn-order column down the left edge (Turn order, Nov 23 playtest): this round only, each fighter once, the one
 // acting now on top (bigger). A face drops off once that fighter has acted and the full order is back next round.
 // Enemies that die or flee leave; a Downed agent stays, greyed, since their bleed-out counts their turns.
 // Before the first round (the intro and any horror) it shows the round about to start.
 const faces=(Bt.queue.length?Bt.queue:turnOrder(Bt.first)).filter(x=>!x.dead&&!x.gone).map(x=>({img:x.a?headOf(x.a):foeFace(x),foe:!x.a,out:!!(x.a&&x.ko)}));
 SB.turnColumn(cx,BT_THEME,L.col.x,L.col.y,faces,L.agentY-56);
 // damage numbers, then the result line
 Bt.floaties=Bt.floaties.filter(f=>f.t<(fastOn()?30:50));Bt.floaties.forEach(f=>{f.t++;const s=f.txt,w=pW(s,18);pT(s,f.x-w/2+1,f.y-f.t*.5+1,PC.shadowInk||'#120e18',18);pT(s,f.x-w/2,f.y-f.t*.5,f.col,18)});
 if(Bt.res&&Bt.t<Bt.res.until)SB.result(cx,BT_THEME,VW/2+10,Math.min(L.enemyY+16,L.agentY-60),Bt.res.text,Bt.res.word,Bt.res.col);
 drawStrip(L);
 // the command box: the row (with the detail line), a list over the scene, or a battle line
 const am=Bt.active&&Bt.active.a?Bt.active:null;
 if(u&&u.kind==='msg'||(!u&&Bt.msg)){SB.commands(cx,BT_THEME,L.cmd,[],0,'',{msg:Bt.msg||[''],more:true});Bt.hits.push({x:0,y:L.cmd.y,w:VW,h:L.cmd.h,fn:()=>u&&u.res()})}
 else if(u&&u.kind==='cmd'){const hs=SB.commands(cx,BT_THEME,L.cmd,BTW.cmds,u.sel,cmdDetail(u.m));hs.forEach(h=>Bt.hits.push({x:h.x,y:h.y,w:h.w,h:h.h,fn:()=>{if(u.sel!==h.i)u.sel=h.i;battlePress('a')}}))}
 else if(u&&(u.kind==='list'||u.kind==='target')){
  const m=u.m||am,row=u.kind==='list'?u.rows[u.sel]:null;
  const det=u.kind==='list'?(row?row.desc:''):(u.info?u.info(u.opts[u.sel]):'');
  SB.commands(cx,BT_THEME,L.cmd,BTW.cmds,m&&m.bcur?m.bcur.cmd:0,det,{});
  if(u.kind==='list'){const r={x:26,y:Math.max(4,L.agentY-118),w:VW-30,h:Math.min(118,L.agentY-6)};
   const res=SB.list(cx,BT_THEME,r,u.rows,u.sel,u.top);u.top=res.top;res.hits.forEach(h=>Bt.hits.push({x:h.x,y:h.y,w:h.w,h:h.h,fn:()=>{if(u.sel!==h.i){u.sel=h.i}else battlePress('a')}}));
   if(u.flash&&Bt.t-u.flash<30){pR(L.cmd.x+4,L.cmd.y+22,L.cmd.w-8,1,PC.pink)}}}
 else{SB.commands(cx,BT_THEME,L.cmd,[],0,'',{msg:['']})}
}
// the party cards: name and HP, an HP bar, WP · SAN (pink below 40), one status tag; Downed shows turns left
function drawStrip(L){
 const y=L.strip.y,h=L.strip.h,cw=VW/3;pR(0,y,VW,h,BT_THEME.strip);pR(0,y,VW,2,PC.cream);
 party.forEach((m,i)=>{const x=Math.round(i*cw),act=Bt.active===m;
  if(act){pR(x,y+2,cw,h-2,'#232744');pR(x,y+2,cw,3,PC.mus)}
  const hp=m.dead?'—':`${m.hp}/${m.mhp}`,hw=pW(hp,13),chips=chipsOf(m).filter(c=>c.k!=='stun'||m.stun>0);
  const nm=pFit(m.name.toUpperCase(),cw-14-hw,13);pT(nm,x+5,y+3,act?PC.gold:PC.cream,13);
  // one status tag at the right end of the HP bar, which shortens to make room (tap for every status's one-line rule)
  let bw=cw-10;if(chips[0]&&!m.dead){const c=chips[0],s4=c.chip.slice(0,4)+(chips.length>1?'+':''),tw=pW(s4,10)+4,tx=x+cw-5-tw;bw-=tw+3;pR(tx,y+13,tw,8,c.col);pT(s4,tx+2,y+11,PC.chipInk,10);
   Bt.hits.push({x:tx-3,y:y+8,w:tw+6,h:16,fn:()=>{if(!Bt.ui||Bt.ui.kind!=='target')run(()=>say('',chips.map(c=>c.line).join('\n')))}})}
  pT(hp,x+cw-5-hw,y+3,m.hp<=3&&!m.dead?PC.pump:PC.cream,13);
  pR(x+5,y+15,bw,4,'#120e18');pR(x+6,y+16,Math.round((bw-2)*clamp(m.hp/m.mhp,0,1)),2,m.hp/m.mhp>.5?'#7fbf6a':'#d9772b');
  let line,col=PC.lav;
  if(m.dead){line=BTW.gone;col=PC.pump}else if(m.ko){const k=Math.max(1,3-(m.koT||0));line=fillT(BTW.down,{k:k===1?BTW.down1:fillT(BTW.downT,{k})});col=PC.pump}
  else if(m.out){line=BTW.snap;col=PC.pink}
  if(line)pT(line,x+5,y+18,col,12);
  else{const w=`WP ${m.wp} · SAN `;pT(w,x+5,y+18,PC.lav,12);pT(String(m.san),x+5+pW(w,12),y+18,m.san<40?PC.pink:PC.lav,12)}
 })}
