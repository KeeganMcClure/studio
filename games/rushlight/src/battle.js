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

// ================= THE FIGHT (spec 006, D1: Rushlight's numbers) =================
// battle(foes, o): foes are enemy cards {name, kind, lvl, hp, dex, hit, dmg, armor, nerve, sprite|sp, faceless, known,
//   horror:{tier,id}, target (a contract target: no quirk), ai (a FOE_AI move set), loot}
// o: bg, countdown {label, n, end}, roamer (Flee works), ambush, onGuard, stunFirst, exposedFirst, intro, setFight,
//   bounty (killing the yielded target is no crime), crime ('town'|'seen'|... for a fight that is itself a crime), resume
async function battle(foes,o={}){
 held=[];hideTB();
 const en=o.resume?o.resume.en:foes.map(E=>{const e=Object.assign({},E,{foe:true,base:E.name,mhp:E.hp,dead:false,flash:0,alpha:1,st:[],stun:0,lost:0,lines:0,lastHurt:null});
  if(!e.target&&!e.noQuirk&&(o.roamer||o.setFight||e.kind!=='Unnatural')&&e.kind!=='Unnatural'&&StudioRoll.rand()<.75)rollQuirk(e);
  e.skulls=skullsFor(e.lvl+(e.quirk==='Veteran'?1:0));return e});
 if(!o.resume)nameFoes(en);
 if(o.stunFirst)en.forEach(e=>e.stun=1);if(o.exposedFirst)en.forEach(e=>e.exposed=1);
 const prev=G.mode==='battle'?'world':G.mode;G.mode='battle';gEl.classList.add('battle');ban.hidden=true;
 Bt={en,t:0,round:o.resume?o.resume.round-1:0,queue:[],ui:null,log:'',res:null,hits:[],roamer:!!o.roamer,bg:o.bg||'dusk',count:o.countdown?Object.assign({},o.countdown):null,
  active:null,floaties:[],prev,o,stats:{dealt:0,taken:0,took:0,killed:[]},yielded:[],fled:[],used:{},seal:0,loud:0,downed:new Set()};
 party.forEach(m=>{m.defend=false;m.slip=false;m.drawFire=false;m.vanish=false;m.reload=false;m.lastShot=-9;m.koT=m.koT|0;m.brace=false;m.tripwire=false;m.hatchetOut=false;if(m.hp<=0&&!m.dead)m.ko=true;m.kettleUsed=false;m.heaterUsed=false});
 if(!o.resume){
  await bsay(o.intro||`${en.map(e=>e.name).join(', ')} ${en.length>1?'close in.':'is here.'}`,1100);
  // horror on sight: an unnatural enemy's first appearance, for all 3, at its card's tier; bracing halves it
  for(const e of en)if(e.horror){const br=await braceAsk(`${e.base} is coming into the light.`);await sanRoll(e.horror.tier,'unnatural',{id:'sight:'+(e.horror.id||e.base),brace:br,label:`Seeing ${e.base}`,sight:true,relic:true,known:e.known});}
  if(teamOut())return endBattle('lose');
  if(o.onStart)await o.onStart();
 }
 for(;;){
  Bt.round++;saveFight();
  let q=turnOrder();
  if(Bt.round===1&&o.ambush&&!party.some(m=>!m.dead&&m.sp==='mouse'))q=[...q.filter(a=>a.foe),...q.filter(a=>!a.foe)];
  if(Bt.round===1){const lurk=q.filter(a=>a.foe&&a.lurker);q=[...lurk,...q.filter(a=>!lurk.includes(a))]}
  if(o.onGuard){const fo=q.findIndex(a=>!a.foe);if(fo>0)q=[q[fo],...q.filter((a,i)=>i!==fo)]}
  Bt.queue=q;
  while(Bt.queue.length){
   const a=Bt.queue[0];
   if(a.foe){if(!a.dead&&!a.gone){await tickFoe(a);if(!a.dead){if(a.stun>0){a.stun--;await bsay(`${a.name} is Stunned and loses the turn.`,700)}else if(a.grappled){await grappleTurn(a)}else await foeTurn(a)}}}
   else if(!a.dead){const r=await mercTurn(a);if(r==='flee')return endBattle('flee')}
   Bt.queue.shift();Bt.active=null;
   if(teamOut())return endBattle('lose');
   if(foesOut())return endBattle('win');
  }
  if(Bt.smoke>0)Bt.smoke--;
  if(Bt.count){Bt.count.n--;if(Bt.count.n<=0){await bsay(Bt.count.end||'The bell rings. It is over for today.',1400);return endBattle('time')}}
  if(o.onRound)await o.onRound(Bt.round);
 }
}
const teamOut=()=>party.every(m=>m.dead||m.ko||m.snapped&&false);
const foesOut=()=>Bt.en.every(e=>e.dead||e.gone);
function nameFoes(en){const c={};en.forEach(e=>c[e.base]=(c[e.base]||0)+1);const s={};en.forEach(e=>{if(c[e.base]>1){s[e.base]=(s[e.base]||0)+1;e.name=e.base+' '+'ABCDE'[s[e.base]-1]}else e.name=e.base})}
// DEX order, highest first; ties go to mercs (Combat, Basics); Old beasts act last
// Downed mercs keep their place in the order: each of their own turns counts toward bleeding out
function turnOrder(){const dx=a=>a.foe?(a.quirk==='Old'?-99:a.dex):a.stats.DEX;return [...party.filter(m=>!m.dead),...Bt.en.filter(e=>!e.dead&&!e.gone)].sort((a,b)=>(dx(b)-dx(a))||((a.foe?1:0)-(b.foe?1:0)))}
// quirks: about 3 in 4 roamers and set-fight enemies roll one, rerolled if it doesn't fit the kind
const QUIRKS=['Wounded','Starving','Veteran','Frenzied','Drunk','Armored','Cowardly','Sick','Sworn','Greedy','Rabid','Old','Maneater'];
function rollQuirk(e){for(let t=0;t<20;t++){const q=QUIRKS[StudioRoll.die(QUIRKS.length)-1];
 if(['Armored','Greedy'].includes(q)&&e.kind!=='Folk')continue;if(['Rabid','Old','Maneater'].includes(q)&&e.kind!=='Beast')continue;
 if(e.fits&&!e.fits.includes(q)&&StudioRoll.rand()<.5)continue;
 e.quirk=q;if(q==='Wounded')e.hp=Math.ceil(e.hp*.75);if(q==='Armored')e.armor=(e.armor|0)+1;if(q==='Drunk')e.st.push('Drunk');if(q==='Sick')e.st.push('Sickened');if(q==='Old'){e.hp=Math.ceil(e.hp*1.25);e.mhp=e.hp}
 return}}
async function endBattle(res){
 Bt.active=null;const o=Bt.o;
 // Downed mercs who live through it stand at 1 HP; the dead stay dead
 party.forEach(m=>{m.defend=false;m.slip=false;m.wrung=null;m.carried=false;if(m.ko&&res!=='lose'){m.ko=false;m.hp=Math.max(1,m.hp)}if(m.snapped&&!m.dead){m.snapped=false;mercGone(m,'LG-END-SNAP')}});
 const back=Bt.en.filter(e=>e.thief&&e.dead).reduce((a,e)=>a+(e.took|0),0);if(back&&G.run)G.run.rations=Math.min(15,G.run.rations+back);
 G.lastStats=Object.assign({},Bt.stats,{rounds:Bt.round,back,res,yielded:Bt.yielded.map(e=>e.base),fled:Bt.fled.map(e=>e.base)});
 if(res!=='lose'){
  // the yield box for each Folk enemy who yielded (Spare, Bind, Rob, Kill)
  for(const e of Bt.yielded)await yieldBox(e,o);
  await lootFight(res);
  for(const m of party)if(Bt.downed.has(m)&&!m.dead)await injuryRoll(m,o);
 }
 if(G.run)G.run.fight=null;
 const prev=Bt.prev;gEl.classList.remove('battle');Bt=null;G.mode=prev||'world';hideTB();saveRun&&saveRun();return res;
}
// autosave each round, so reopening mid-fight resumes the same round with the same dice position
function saveFight(){if(!G.run||G.auto)return;const o=Object.assign({},Bt.o);['onStart','onRound'].forEach(k=>delete o[k]);
 G.run.fight={en:Bt.en.map(e=>{const c=Object.assign({},e);return c}),round:Bt.round,o,key:Bt.o.key||null};saveRun()}
const aliveFoes=()=>Bt.en.filter(e=>!e.dead&&!e.gone&&!e.burrowed);  // a burrowed foe can't be targeted, but the fight isn't over
function bsay(text,ms=900){Bt.log=text;if(G.auto)return Promise.resolve();return new Promise(res=>{Bt.ui={kind:'msg',res:()=>{clearTimeout(t);Bt.ui=null;res()}};const t=setTimeout(()=>{if(Bt&&Bt.ui&&Bt.ui.kind==='msg')Bt.ui.res()},fastOn()?Math.round(ms*.45):ms)})}
function bcmd(m){if(G.auto)return Promise.resolve(G.auto.cmd(m));return new Promise(res=>{Bt.ui={kind:'cmd',m,sel:m.bsel||0,res:i=>{m.bsel=i;res(i)}}})}
function blist(title,rows,o={}){if(G.auto)return Promise.resolve(G.auto.list(title,rows,o));return new Promise(res=>{Bt.ui={kind:'list',title,rows,sel:Math.max(0,rows.findIndex(r=>!r.dis)),top:0,res,hover:o.hover}})}
const fastOn=()=>!!(G.dev&&G.dev.fast||G.run&&G.run.fast);
async function braceAsk(why){const br=new Set();if(G.auto)return br;
 for(const m of party.filter(p=>!p.dead&&!p.ko&&p.wp>0&&!(p.dis||[]).includes('Depression')||false)){const cost=m.st.includes('Exhausted')?'2d4':'1d4';
  const r=await blist(`${m.name}: BRACE? (${cost} WP)`,[{label:'Brace',right:cost+' WP'},{label:'No'}]);if(r===0){m.wp=Math.max(0,m.wp-rollDice(cost));br.add(m)}}return br}

// ================= MERCS =================
// the weapon in hand (WPN 1 or WPN 2), or fists; Broken gear is useless until mended
function weaponOf(m){const g=m.gear,it=g&&g[g.hand||'w1'];const w=it&&RLS.ITEMS[it.id];if(!w||!w.dmg||(it.wear|0)>=3||m.hatchetOut&&w.id==='hatchet')return RLS.FISTS;return w}
const wearOf=m=>{const g=m.gear,it=g&&g[g.hand||'w1'];return it?it.wear|0:0};
const statPen=(m,sk)=>{let p=0;const st=m.st||[];if(st.includes('Shaken'))p-=20;if(st.includes('Poisoned'))p-=20;if(st.includes('Sickened')&&['Athletics','Stealth','Melee','Shooting','Dodge'].includes(sk))p-=20;
 if(st.includes('Drunk')&&['Shooting','Search','Butchery'].includes(sk))p-=20;if(st.includes('High'))p-=20;if(sk==='Melee'&&st.includes('Fire-root'))p+=40;
 (m.inj||[]).forEach(i=>{if(i.sk&&i.sk[sk])p-=i.sk[sk]});const b=m.gear&&m.gear.body&&m.gear.body.id;if(b==='mail'&&['Dodge','Stealth'].includes(sk))p-=10;if(b==='plate'&&['Dodge','Stealth','Athletics'].includes(sk))p-=20;
 if(m.gear&&m.gear.head&&m.gear.head.id==='kettle'&&sk==='Search')p-=10;if(sk==='Dodge'&&(m.gear.w2&&m.gear.w2.id==='heater'))p-=10;if(Bt&&Bt.lampOut&&['Shooting','Search'].includes(sk))p-=20;if(Bt&&Bt.o.rafters&&sk==='Dodge')p-=10;return p};
const skillOf=(m,sk)=>Math.max(0,(m.sk[sk]||0)+statPen(m,sk));
function hitChance(m,e,o={}){const w=weaponOf(m);let p=skillOf(m,w.skill)+(w.hit|0)+(o.mod||0);if(w.id==='longbow'&&m.stats.STR<12)p-=20;
 if(e){if(e.exposed)p+=20;if(e.grappled&&e.grappled!==m)p+=20;if(e.silent&&!e.hitOnce)p-=10;if(Bt.o.behindPavise&&w.skill==='Shooting')p-=20}
 if(!o.special&&!w.thrown)p=Math.max(FIGHT_FLOOR,p);return Math.max(1,Math.min(99,p))}
async function mercTurn(m){
 Bt.active=m;m.defend=false;m.slip=false;m.drawFire=false;
 // Downed: bleeds out after 3 of their own turns unless Revived
 if(m.ko){m.koT=(m.koT|0)+1;Bt.koLong=Bt.koLong||new Set();if(m.koT>=2)Bt.koLong.add(m);
  if(m.koT>=3){await bsay(`${m.name} stops breathing.`,1400);await mercDies(m,'LG-END-BLEED');return}
  await bsay(`${m.name} is Downed. ${3-m.koT} turn${3-m.koT>1?'s':''} to live.`,1000);return}
 await tickMerc(m);if(m.dead||m.ko)return;
 if(Bt.o.mercPre&&await Bt.o.mercPre(m))return;
 if((m.st||[]).includes('Stunned')){m.st=m.st.filter(s=>s!=='Stunned');await bsay(`${m.name} is Stunned and loses the turn.`,800);return}
 if(m.reload){m.reload=false;await bsay(`${m.name} reloads the hand cannon.`,800);return}
 if(m.snapped)return snappedTurn(m);
 if(m.grapple&&!m.grapple.dead){await bsay(`${m.name} holds ${m.grapple.name} down.`,700);return}
 if(G.auto&&G.auto.smart)return smartTurn(m);
 for(let tries=0;;tries++){
  if(G.auto&&tries>3){m.defend=true;return}
  const c=await bcmd(m);
  if(c===0){if(!canFire(m)){if(G.auto){m.defend=true;return}await bsay('The crossbow needs a turn to span.',700);continue}const e=await pickFoe(m,{});if(!e)continue;await attack(m,e,{});return}
  if(c===1){const r=await skillMenu(m);if(r===false)continue;return r}
  if(c===2){const r=await itemMenu(m);if(r===false)continue;return}
  if(c===3){const r=await guardMenu(m);if(r===false)continue;return r}
 }
}
const canFire=m=>{const w=weaponOf(m);return !(w.id==='crossbow'&&m.lastShot===Bt.round-1)};
async function pickFoe(m,o){const f=aliveFoes();if(f.length===1&&!o.list)return f[0];
 const rows=f.map(e=>({label:e.name+(e.quirk?' · '+e.quirk:''),right:hitChance(m,e,o)+'%'}));
 const r=await blist('TARGET',rows,{hover:i=>f[i]});return r<0?null:f[r]}
// a weapon attack: the roll, crits and fumbles, damage after wear, STR and armor, and the weapon's extras
async function attack(m,e,o){
 const w=weaponOf(m),p=hitChance(m,e,o),r=o.sure?{ok:true,crit:false,fumble:false,r:0,target:99}:R_.pct(p);
 if(!o.sure)showRes(R_.line(BW.skill[w.skill]||w.skill.toUpperCase(),r,BW.words),r);
 if(w.skill==='Shooting')m.lastShot=Bt.round;if(w.loud){Bt.loud++;Bt.loudest=m;if(G.site)G.site.loud=1}
 if(w.id==='cannon')m.reload=true;if(w.thrown)m.hatchetOut=true;
 if(r.fumble){await bsay(`${m.name}: ${BW.fumble[die(BW.fumble.length)-1]}`,1000);wearWeapon(m);
  if(w.id==='cannon'||w.id==='flail'){const d=die(4);hurtMerc(m,d,null);await bsay(`${m.name} is hurt by their own ${w.name.toLowerCase()} for ${d}.`,900)}return false}
 if(!r.ok){await bsay(`${m.name} misses ${e.name}.`,900);return false}
 let d=rollDice(w.dmg)-wearOf(m)+(w.melee&&!w.thrownless?strBonus(m.stats.STR):0);if(o.half)d=Math.floor(d/2);if(r.crit)d*=2;if(o.double)d*=2;
 if(w.id==='torch'&&e.burns)d*=2;
 let arm=e.armor|0;if(w.id==='crossbow'||w.id==='hammer'||w.id==='mace')arm=Math.max(0,arm-1);if(w.id==='cannon'||m.bodkin&&w.skill==='Shooting')arm=0;if(m.bodkin&&w.skill==='Shooting')m.bodkin=0;
 if(!r.crit)d-=arm;d=Math.max(1,d);
 if(e.pool&&o.area)d=d;  // a shared pool takes each area hit once per body (card rule)
 await bsay(`${m.name} hits ${e.name} for ${d}.${r.crit?' A crit.':''}`,1000);
 await hurtFoe(e,d,m,{crit:r.crit});
 if(!e.dead){if(w.id==='cleaver'||(r.crit&&(w.id==='sickle'||w.id==='sword'))||m.venom&&w.melee){addSt(e,m.venom&&w.melee?'Poisoned':'Bleeding');if(m.venom&&w.melee)m.venom--}
  if(w.id==='spear')e.blockT=m;if(r.crit&&w.id==='halberd'){const q=Bt.queue.indexOf(e);if(q>0){Bt.queue.splice(q,1);Bt.queue.push(e)}}
  if(e.hedgehog&&w.melee){}}
 if(e.onHurt&&FOE_AI[e.ai]&&FOE_AI[e.ai].onHurt)await FOE_AI[e.ai].onHurt(e,m,d,r);
 return true;
}
function wearWeapon(m){const g=m.gear,it=g&&g[g.hand||'w1'];if(it&&RLS.ITEMS[it.id].dmg){it.wear=Math.min(3,(it.wear|0)+1);if(it.wear>=3)bsay(`${m.name}'s ${RLS.ITEMS[it.id].name.toLowerCase()} breaks.`,800)}}
const addSt=(x,s)=>{x.st=x.st||[];if(!x.st.includes(s))x.st.push(s)};
// damage to a foe; breaking at 75%, 50% and 25% for Folk and Beasts (Nerve: Steady half, Skittish 1.5×)
async function hurtFoe(e,d,by,o={}){
 if(e.pool){d=Math.min(d,e.hp)}
 Bt.stats.dealt+=Math.min(d,e.hp);e.hp=Math.max(0,e.hp-d);e.flash=16;floaty(e,d);e.lastHurt=by||e.lastHurt;e.hitOnce=1;
 if(e.hp<=0){if(e.onZero&&await FOE_AI[e.ai].onZero(e,by))return;e.dead=true;Bt.stats.killed.push(e.base);
  if(by&&e.kind==='Folk'){await sanRoll('Disturbing','violence',{who:[by],quiet:false,label:`${by.name} killed a man`})}
  if(Bt.o.onKill)await Bt.o.onKill(e,by);return}
 if(e.kind==='Unnatural'||e.quirk==='Frenzied'||e.quirk==='Rabid'||e.target&&e.kind!=='Folk'||e.noBreak)return;
 const lost=1-e.hp/e.mhp,line=lost>=.75?3:lost>=.5?2:lost>=.25?1:0;
 if(line>e.lines){e.lines=line;let ch=line*.25*({Steady:.5,Normal:1,Skittish:1.5}[e.nerve||'Normal']||1);if(e.quirk==='Starving')ch+=.25;
  if(o.crit&&e.quirk==='Cowardly')ch=1;
  if(StudioRoll.rand()<ch){e.gone=true;if(e.kind==='Folk'){Bt.yielded.push(e);await bsay(e.yieldLine?RLT(e.yieldLine):`${e.name} drops the weapon and kneels.`,1300)}else{Bt.fled.push(e);await bsay(`${e.name} breaks and flees.`,1000)}}}
}
// a merc's own statuses each turn: Bleeding and Poisoned 1 HP (badgers stop bleeding after a turn)
async function tickMerc(m){if((m.st||[]).includes('Bleeding')){hurtMerc(m,1,null);await bsay(`${m.name} bleeds.`,600);if(m.sp==='badger')m.st=m.st.filter(s=>s!=='Bleeding')}
 if((m.st||[]).includes('Poisoned')){m.poisonT=(m.poisonT|0)+1;if(m.poisonT%1===0){hurtMerc(m,1,null);await bsay(`${m.name}: the poison works.`,600)}}}
async function tickFoe(e){if((e.st||[]).includes('Bleeding')||(e.st||[]).includes('Poisoned')){const n=(e.st.includes('Bleeding')?2:0)+(e.st.includes('Poisoned')?2:0);await hurtFoe(e,n,e.lastHurt);await bsay(`${e.name} loses ${n}.`,600)}
 if(e.shakenT){e.shakenT--;if(!e.shakenT)e.st=e.st.filter(s=>s!=='Shaken')}if(e.exposed&&e.exposedT!==Bt.round){e.exposed=0}}
// battle moves (Carried rules, Battle moves; Combat, Battle moves): at 40%, 75% and 90%, with their WP costs
const MOVES=[
 ['Shooting',40,'Aimed shot',1,'foe'],['Shooting',75,'Volley',2,'all'],['Shooting',90,'Through the eye',3,'foe'],
 ['Melee',40,'Shove',1,'foe'],['Melee',75,'Haymaker',2,'foe'],['Melee',90,'Grapple',3,'foe'],
 ['Dodge',40,'Slip',0,'self'],['Dodge',75,'Draw fire',2,'self'],
 ['Search',40,'Spot weak point',1,'foe'],['Letters',40,'Show the seal',1,'folk'],['Athletics',40,'Tackle',1,'foe'],['Survival',40,'Rushlight brand',1,'beasts'],
 ['Occult',40,'Identify',1,'foe'],['First Aid',40,'Patch up',1,'ally'],['First Aid',75,'Triage',2,'none'],['Medicine',40,'Treat',1,'ally'],['Medicine',75,'Revive',2,'down'],['Medicine',90,'Sedate',1,'ally'],
 ['Butchery',75,'Find the wound',2,'foe'],['Stealth',75,'Vanish',2,'self'],['Alchemy',75,'Quicklime',2,'foe'],['Occult',75,'Bind',2,'foe'],['Persuade',75,'Intimidate',2,'folk'],
 ['Craft',75,'Tripwire',2,'self'],['Empathy',75,'Calm',2,'ally'],['Beasts',75,'Cow',2,'beast']];
async function skillMenu(m){
 const mv=MOVES.filter(x=>(m.sk[x[0]]||0)>=x[1]&&!(x[2]==='Show the seal'&&Bt.seal)&&!(x[0]==='Shooting'&&weaponOf(m).skill!=='Shooting'));
 const extra=Bt.o.extraMoves?Bt.o.extraMoves(m):[];
 const rows=[...mv.map(x=>({label:x[2],right:(x[3]?x[3]+' WP':'free')+(x[2]==='Identify'?' · '+Math.max(1,skillOf(m,'Occult')-20)+'%':''),dis:m.wp<x[3]||x[2]==='Slip'&&false})),...extra.map(x=>({label:x.label,right:x.right||'',dis:x.dis}))];
 if(!rows.length){await blist('SKILLS',[{label:'No battle moves',dis:true}]);return false}
 const r=await blist('SKILLS · '+m.wp+' WP',rows);if(r<0)return false;
 if(r>=mv.length)return extra[r-mv.length].run(m);
 return useMove(m,mv[r]);
}
async function useMove(m,x){const [sk,,name,wp]=x;const S=()=>R_.pct(skillOf(m,sk));
 const spend=()=>{m.wp-=wp};
 if(name==='Aimed shot'){if(!canFire(m))return false;const e=await pickFoe(m,{mod:-20,special:true,list:1});if(!e)return false;spend();return attack(m,e,{mod:-20,special:true,double:true})}
 if(name==='Volley'){spend();const r=R_.pct(hitChance(m,null,{special:true}));showRes(R_.line('SHOOTING',r,BW.words),r);m.lastShot=Bt.round;if(!r.ok){await bsay(`${m.name}'s volley goes wide.`,900);return}for(const e of aliveFoes()){let d=Math.max(1,Math.floor(rollDice(weaponOf(m).dmg)/2)-(e.armor|0));await hurtFoe(e,d,m)}await bsay(`${m.name} looses into all of them.`,900);return}
 if(name==='Through the eye'){const e=await pickFoe(m,{special:true,list:1});if(!e)return false;spend();await attack(m,e,{sure:true});if(!e.dead)addSt(e,'Bleeding');return}
 if(name==='Shove'){const e=await pickFoe(m,{special:true,list:1});if(!e)return false;spend();const hit=await attack(m,e,{special:true,half:true});if(hit&&!e.dead){const q=Bt.queue.indexOf(e);if(q>0){Bt.queue.splice(q,1);Bt.queue.push(e)}}return}
 if(name==='Haymaker'){const e=await pickFoe(m,{mod:-20,special:true,list:1});if(!e)return false;spend();const hit=await attack(m,e,{mod:-20,special:true});if(hit&&!e.dead){e.stun=1;await bsay(`${e.name} is Stunned.`,700)}return}
 if(name==='Grapple'){const e=await pickFoe(m,{special:true,list:1});if(!e)return false;spend();const o=S();if(o.ok){e.grappled=m;m.grapple=e;await bsay(`${m.name} pins ${e.name}.`,900)}else await bsay(`${e.name} twists free.`,800);return}
 if(name==='Slip'){m.defend=true;m.slip=true;await bsay(`${m.name} defends, ready to slip the blows.`,800);return}
 if(name==='Draw fire'){spend();m.defend=true;m.drawFire=true;await bsay(`${m.name} draws every eye.`,800);return}
 if(name==='Spot weak point'){const e=await pickFoe(m,{special:true,list:1});if(!e)return false;spend();const o=S();if(o.ok){e.exposed=1;e.exposedT=Bt.round+1;e.knownHP=1;await bsay(`${m.name} finds the gap. ${e.name} is Exposed.`,900)}else await bsay(`${m.name} can't find an opening.`,800);return}
 if(name==='Show the seal'){const f=aliveFoes().filter(e=>e.kind==='Folk');if(!f.length){await bsay('No one here cares about a seal.',800);return false}const e=f.length>1?await pickFoe(m,{special:true,list:1}):f[0];if(!e)return false;spend();Bt.seal=1;if(S().ok){e.stun=1;await bsay(`${e.name} sees the seal and hesitates. Stunned.`,900)}else await bsay(`${e.name} doesn't read.`,800);return}
 if(name==='Tackle'){const e=await pickFoe(m,{special:true,list:1});if(!e)return false;spend();if(S().ok){e.stun=1;addSt(m,'Stunned');await bsay(`${m.name} takes ${e.name} down. Both are Stunned.`,900)}else await bsay(`${m.name} misses the tackle.`,800);return}
 if(name==='Rushlight brand'){spend();if(S().ok){aliveFoes().filter(e=>e.kind==='Beast').forEach(e=>{addSt(e,'Shaken')});await bsay(`${m.name} swings the burning rushes. The beasts shy.`,900)}else await bsay('The rushes sputter.',800);return}
 if(name==='Identify'){const e=await pickFoe(m,{special:true,list:1});if(!e)return false;spend();const o=R_.pct(Math.max(1,skillOf(m,'Occult')-20));showRes(R_.line('OCCULT',o,BW.words),o);
  if(o.ok){e.known=1;if(typeof identify==='function')await identify(e.bestiary||e.base,m);await bsay(`${m.name} knows it now. ${e.weakLine||''}`,1300)}else await bsay(`${m.name} can't place it.`,900);return}
 if(name==='Patch up'){const t=await pickMerc('PATCH WHO?',{noKO:true});if(!t)return false;spend();if(S().ok){const h=die(4);t.hp=Math.min(t.mhp,t.hp+h);await bsay(`${m.name} patches ${t.name}. +${h} HP.`,900)}else await bsay('The bandage slips.',800);return}
 if(name==='Triage'){spend();if(S().ok){party.filter(p=>!p.dead&&!p.ko).forEach(p=>p.hp=Math.min(p.mhp,p.hp+die(2)));await bsay(`${m.name} works down the line. Everyone gets a little back.`,900)}else await bsay('No time to do it right.',800);return}
 if(name==='Treat'){const t=await pickMerc('TREAT WHO?',{noKO:true});if(!t)return false;spend();if(S().ok){t.st=(t.st||[]).filter(s=>!['Bleeding','Poisoned','Sickened'].includes(s));await bsay(`${m.name} treats ${t.name}.`,900)}else await bsay('It doesn\'t take.',800);return}
 if(name==='Revive'){const t=await pickMerc('REVIVE WHO?',{down:true});if(!t)return false;spend();if(S().ok){t.ko=false;t.hp=die(4);t.koT=0;await bsay(`${m.name} gets ${t.name} back on their feet.`,1000)}else await bsay(`${t.name} doesn't come round.`,900);return}
 if(name==='Sedate'){const t=await pickMerc('SEDATE WHO?',{noKO:true});if(!t)return false;spend();if(S().ok){t.st=(t.st||[]).filter(s=>s!=='Flare');t.sedated=1;await bsay(`${t.name} goes quiet and steady.`,900)}return}
 if(name==='Find the wound'){const e=await pickFoe(m,{special:true,list:1});if(!e)return false;spend();if(e.hp<e.mhp&&S().ok){addSt(e,'Bleeding');await bsay(`${m.name} opens the wound. ${e.name} is Bleeding.`,900)}else await bsay('Nothing to open.',800);return}
 if(name==='Vanish'){spend();if(S().ok){m.vanish=true;await bsay(`${m.name} is gone from sight.`,800)}else await bsay(`${m.name} is still in plain view.`,800);return}
 if(name==='Quicklime'){const e=await pickFoe(m,{special:true,list:1});if(!e)return false;spend();if(e.kind!=='Unnatural'&&S().ok){addSt(e,'Poisoned');await bsay(`${e.name} is Poisoned.`,800)}else await bsay('It does nothing.',800);return}
 if(name==='Bind'){const e=await pickFoe(m,{special:true,list:1});if(!e)return false;spend();if(e.kind==='Unnatural'&&e.known&&S().ok){e.stun=1;await bsay(`${m.name} says the binding. ${e.name} is held.`,900)}else await bsay('The words don\'t catch.',800);return}
 if(name==='Intimidate'){Bt.loudest=m;const f=aliveFoes().filter(e=>e.kind==='Folk');if(!f.length)return false;const e=f.length>1?await pickFoe(m,{special:true,list:1}):f[0];if(!e)return false;spend();const o=S();if(o.crit){e.gone=true;Bt.fled.push(e);await bsay(`${e.name} runs.`,800)}else if(o.ok){addSt(e,'Shaken');await bsay(`${e.name} is Shaken.`,800)}else await bsay(`${e.name} laughs.`,800);return}
 if(name==='Tripwire'){spend();if(S().ok){m.tripwire=true;await bsay(`${m.name} strings a tripwire.`,800)}return}
 if(name==='Calm'){const t=await pickMerc('CALM WHO?',{noKO:true});if(!t)return false;spend();if(S().ok){t.st=(t.st||[]).filter(s=>s!=='Shaken');await bsay(`${t.name} breathes again.`,800)}return}
 if(name==='Cow'){const f=aliveFoes().filter(e=>e.kind==='Beast');if(!f.length)return false;const e=f.length>1?await pickFoe(m,{special:true,list:1}):f[0];if(!e)return false;spend();if(S().ok){addSt(e,'Shaken');await bsay(`${e.name} is Shaken.`,800)}return}
}
async function pickMerc(title,o={}){const rows=party.map(p=>({label:p.name,right:p.dead?'GONE':p.ko?'DOWN':p.hp+'/'+p.mhp,dis:p.dead||(o.noKO&&p.ko)||(o.down&&!p.ko)}));if(rows.every(r=>r.dis))return null;const r=await blist(title,rows);return r<0?null:party[r]}
// Items: the merc's own slots and the swap between weapons (Battle menu: swapping lives in Items and ends the turn)
const MEDS={bandage:async(m,t)=>{t.st=(t.st||[]).filter(s=>s!=='Bleeding');return `${t.name}'s bleeding stops.`},willow:async(m,t)=>{const h=die(4);t.hp=Math.min(t.mhp,t.hp+h);return `${t.name} +${h} HP.`},
 tonic:async(m,t)=>{t.st=(t.st||[]).filter(s=>s!=='Exhausted');const w=die(4);t.wp=Math.min(t.mwp,t.wp+w);return `${t.name} +${w} WP.`},sponge:async(m,t)=>{t.st=(t.st||[]).filter(s=>s!=='Sickened');return `${t.name} is clear of it.`},
 surgeonsroll:async(m,t)=>{const h=die(6);t.hp=Math.min(t.mhp,t.hp+h);return `${t.name} +${h} HP.`},theriac:async(m,t)=>{t.st=(t.st||[]).filter(s=>s!=='Poisoned');return `${t.name}'s poison is drawn.`},
 herbbundle:async(m,t)=>{t.st=(t.st||[]).filter(s=>s!=='Poisoned'&&s!=='Sickened');return `${t.name} chews the herbs.`},chewroot:async(m,t)=>{t.st=(t.st||[]).filter(s=>s!=='Shaken');return `${t.name} chews and steadies.`},
 poppytinct:async(m,t)=>{const h=die(6);t.hp=Math.min(t.mhp,t.hp+h);addSt(t,'High');return `${t.name} +${h} HP, and High.`},hemp:async(m,t)=>{t.st=(t.st||[]).filter(s=>s!=='Shaken');addSt(t,'High');return `${t.name} is High and calm.`},
 wakeleaf:async(m,t)=>{t.st=(t.st||[]).filter(s=>s!=='Exhausted');t.wp=Math.min(t.mwp,t.wp+die(4));addSt(t,'High');return `${t.name} is wide awake.`},fireroot:async(m,t)=>{addSt(t,'High');addSt(t,'Fire-root');return `${t.name} burns with it.`},
 poppysyrup:async(m,t)=>{addSt(t,'High');t.poppy=1;return `${t.name} goes soft at the edges.`},ale:async(m,t)=>{addSt(t,'Drunk');return `${t.name} drinks.`}};
async function itemMenu(m){
 const g=m.gear,other=g.hand==='w1'?'w2':'w1',rows=[],acts=[];
 if(g[other]&&RLS.ITEMS[g[other].id].slot==='weapon'){rows.push({label:`Swap to ${RLS.ITEMS[g[other].id].name}`,right:'ends turn'});acts.push(async()=>{g.hand=other;await bsay(`${m.name} switches to the ${RLS.ITEMS[g[other].id].name.toLowerCase()}.`,800)})}
 m.slots.forEach(s=>{const it=RLS.ITEMS[s.id];if(!it)return;const n=s.n>1?'×'+s.n:'';
  if(MEDS[s.id]){rows.push({label:it.name,right:n});acts.push(async()=>{const t=await pickMerc('WHO?',{noKO:true});if(!t)return false;useSlot(m,s.id);await bsay(`${m.name}: ${await MEDS[s.id](m,t)}`,900)})}
  else if(['powderpot','thunderpot','firepot','smokepot','rushbundle','holywater','coldiron','silver'].includes(s.id)){rows.push({label:it.name,right:n+(s.id.endsWith('pot')?' · Athletics '+skillOf(m,'Athletics')+'%':'')});acts.push(()=>throwItem(m,s.id))}
  else if(s.id==='bodkin'){rows.push({label:'Bodkin bolts',right:n,dis:weaponOf(m).skill!=='Shooting'});acts.push(async()=>{useSlot(m,'bodkin');m.bodkin=1;await bsay(`${m.name} sets a bodkin bolt.`,700)})}
  else if(s.id==='venom'){rows.push({label:'Blade venom',right:n});acts.push(async()=>{useSlot(m,'venom');m.venom=1;await bsay(`${m.name} wipes venom on the blade.`,700)})}
  else if(s.id==='caltrops'){rows.push({label:'Caltrops',right:n});acts.push(async()=>{useSlot(m,'caltrops');m.caltrops=1;await bsay(`${m.name} scatters caltrops.`,700)})}
  else if(Bt.o.itemUse&&Bt.o.itemUse[s.id]){rows.push({label:it.name,right:n});acts.push(()=>Bt.o.itemUse[s.id](m))}
  else{rows.push({label:it.name,right:n,dis:true});acts.push(null)}});
 if(!rows.length){await blist('ITEMS',[{label:'Nothing in hand',dis:true}]);return false}
 const r=await blist('ITEMS',rows);if(r<0||!acts[r])return false;return acts[r]();
}
async function throwItem(m,id){const it=RLS.ITEMS[id];
 if(['powderpot','firepot','thunderpot','smokepot'].includes(id)){const o=R_.pct(skillOf(m,'Athletics'));showRes(R_.line('ATHLETICS',o,BW.words),o);useSlot(m,id);if(id==='powderpot'||id==='thunderpot'){Bt.loud++;if(G.site)G.site.loud=1}
  if(!o.ok){await bsay(`The ${it.name.toLowerCase()} lands wrong.`,800);return}
  if(id==='powderpot'){for(const e of aliveFoes())await hurtFoe(e,die(6),m);await bsay('The pot goes up. Everyone in front of it is hit.',900)}
  else if(id==='thunderpot'){aliveFoes().filter(e=>e.kind==='Folk').forEach(e=>e.stun=1);await bsay('The bang leaves them reeling. Stunned.',900)}
  else if(id==='smokepot'){Bt.smoke=1;if(Bt.roamer){await bsay('In the smoke the company slips away.',900);return 'flee'}await bsay('Smoke fills the place.',800)}
  else{const e=await pickFoe(m,{special:true,list:1})||aliveFoes()[0];let d=die(8);if(e.burns)d*=2;await hurtFoe(e,d,m);await bsay(`Fire on ${e.name}: ${d}.`,900)}return}
 if(id==='rushbundle'){useSlot(m,id);const e=aliveFoes().find(x=>x.lightShy);if(e){addSt(e,'Shaken');await bsay(`${e.name} shrinks from the light.`,900)}else await bsay('The light flares and dies.',800);return}
 // folk remedies: work only on an unnatural thing whose true tale names them (Stunned and −10% HP)
 const e=aliveFoes().find(x=>x.kind==='Unnatural')||aliveFoes()[0];useSlot(m,id);
 if(e.remedy===id){e.stun=1;e.hp=Math.max(1,e.hp-Math.ceil(e.mhp*.1));await bsay(`The ${it.name.toLowerCase()} bites. ${e.name} reels.`,1000)}else if(e.backfire===id&&e.onBackfire)await e.onBackfire(m);else await bsay(`It does nothing to ${e.name}.`,900)}
// Guard: Defend, Brace, Retch, Flee (roamers only; the company's lowest Athletics, a hare +10%; Outrun overrides)
async function guardMenu(m){const sick=(m.st||[]).includes('Sickened');
 const rows=[{label:'Defend',right:'half dmg'},{label:'Brace',right:(m.st.includes('Exhausted')?'2d4':'1d4')+' WP',dis:m.wp<1||(m.dis||[]).includes('Depression')},{label:'Retch',right:`CON×5 ${m.stats.CON*5}%`,dis:!sick},{label:'Flee',right:Bt.roamer?fleeOdds()+'%':'not here',dis:!Bt.roamer}];
 const r=await blist('GUARD',rows);if(r<0)return false;
 if(r===0){m.defend=true;await bsay(`${m.name} sets their feet and waits.`,800);return}
 if(r===1){m.wp=Math.max(0,m.wp-rollDice(m.st.includes('Exhausted')?'2d4':'1d4'));m.brace=true;await bsay(`${m.name} braces for what's coming.`,800);return}
 if(r===2){if(R_.pct(m.stats.CON*5).ok){m.st=m.st.filter(s=>s!=='Sickened');await bsay(`${m.name} retches and feels clearer.`,800)}else await bsay(`${m.name} retches. It doesn't help.`,800);return}
 const o=R_.pct(fleeOdds());showRes(R_.line('ATHLETICS',o,BW.words),o);if(o.ok||Bt.smoke){await bsay('The company gets clear.',900);return 'flee'}await bsay('Nowhere to run.',900)}
function fleeOdds(){const up=party.filter(p=>!p.dead&&!p.ko),out=up.find(p=>(p.sk.Athletics||0)>=75);if(out)return skillOf(out,'Athletics')+(out.sp==='hare'?10:0);return Math.min(...up.map(p=>skillOf(p,'Athletics')+(p.sp==='hare'?10:0)))}
// the careful auto-player used by the tuning sims: revive a Downed comrade, patch a badly hurt one, else fight the weakest
async function smartTurn(m){const has=n=>MOVES.find(x=>x[2]===n&&(m.sk[x[0]]||0)>=x[1]&&m.wp>=x[3]);
 const down=party.find(p=>p.ko&&!p.dead),low=party.filter(p=>!p.ko&&!p.dead&&p.hp<=Math.max(3,p.mhp/3)).sort((a,b)=>a.hp-b.hp)[0];
 if(down&&has('Revive')){m.wp-=2;if(R_.pct(skillOf(m,'Medicine')).ok){down.ko=false;down.hp=die(4);down.koT=0;await bsay(`${m.name} gets ${down.name} up.`,1)}return}
 if(low&&has('Patch up')){m.wp-=1;if(R_.pct(skillOf(m,'First Aid')).ok)low.hp=Math.min(low.mhp,low.hp+die(4));return}
 const sr=m.slots.find(s=>s.id==='surgeonsroll');if((low||down)&&sr){const t=low||down;useSlot(m,'surgeonsroll');t.hp=Math.min(t.mhp,t.hp+die(6));if(t.ko){t.ko=false;t.koT=0}return}
 if(!canFire(m)){m.defend=true;return}
 const e=aliveFoes().sort((a,b)=>a.hp-b.hp)[0];if(e)await attack(m,e,{})}
// 0 SAN in a fight: each turn the game picks one of four at 25% each
async function snappedTurn(m){const r=die(4);
 if(r===1){const w=weaponOf(m);const d=Math.max(1,rollDice(w.dmg));hurtMerc(m,d,null);await bsay(`${m.name} turns the ${w.name.toLowerCase()} on themself. ${d}.`,1100)}
 else if(r===2){const o=party.filter(p=>p!==m&&!p.dead&&!p.ko);if(o.length){const t=o[die(o.length)-1],d=Math.max(1,rollDice(weaponOf(m).dmg));hurtMerc(t,d,m);await bsay(`${m.name} goes for ${t.name}. ${d}.`,1100)}}
 else if(r===3){const e=aliveFoes()[0];if(e)await attack(m,e,{})}
 else await bsay(`${m.name} stands there, looking at nothing.`,1000)}
// a merc dies in a fight: comrades who see it roll Severe violence (spec 006, 2; Part E's mercGone does the rest)
async function mercDies(m,end,killer){m.ko=false;await mercGone(m,end,{killer:killer||''});
 const w=party.filter(p=>!p.dead&&p!==m);for(const p of w){const tier=isClose(p,m)?'Shattering':'Severe';await sanRoll(tier,'violence',{who:[p],label:`${p.name} saw ${m.name} die`})}}
// lasting injuries (Carried rules): CON × 5 to walk it off, else 1d12 + mods on the table
const INJ=[[1,'Black eye','Minor',{Search:10}],[2,'Sprained wrist','Minor',{Shooting:10}],[3,'Rolled ankle','Minor',{Athletics:10}],[4,'Bruised ribs','Minor',{Dodge:10}],[5,'Split knuckles','Minor',{Melee:10}],
 [6,'Bad knee','Serious',{Athletics:20}],[7,'Cracked ribs','Serious',{Dodge:20}],[8,'Torn shoulder','Serious',{Melee:20}],[9,'Nerve-damaged hand','Serious',{Shooting:20}],[10,'Concussion','Serious',{Search:20}],
 [11,'Lost eye','Grave',{Shooting:20,Search:10}],[12,'Facial scarring','Grave',{Persuade:20}],[13,'Chronic pain','Grave',{},2],[14,'Ruined leg','Grave',{Athletics:20,Dodge:10}]];
async function injuryRoll(m,o){const c=R_.pct(m.stats.CON*5);if(c.ok){await sayB(`${m.name} walks it off.`);return}
 let n=die(12)+((o&&(o.target||o.great))?2:0)+(Bt&&Bt.koLong&&Bt.koLong.has(m)?2:0)+(c.fumble?2:0);
 if(n>=15){await sayB(`${m.name} can't hold a weapon now. They're done with fighting.`);await mercGone(m,'LG-END-RETIRED',{});return}
 const row=INJ.find(x=>x[0]===n)||INJ[0],inj=m.inj=m.inj||[],have=inj.find(x=>x.name===row[1]);
 if(have&&row[2]==='Grave'){return injuryRoll(m,o)}
 if(have){if(row[2]==='Serious')have.tier='Grave';have.left=1}else{inj.push({name:row[1],tier:row[2],sk:row[3],left:row[2]==='Minor'?1:0});if(row[4]){m.mhp-=row[4];m.hp=Math.min(m.hp,m.mhp)}}
 await sayB(`${m.name}: ${row[1]} (${row[2]}).`);
 if(row[2]==='Grave')await sanRoll('Disturbing','violence',{who:[m],label:`${m.name} sees what it did`})}
const sayB=t=>Bt?bsay(t,1200):say('',t);
async function lootFight(res){if(res!=='win'||!G.run)return;const r=G.run,got=[];
 for(const e of Bt.en.filter(x=>x.dead||x.robbed)){
  if(e.kind==='Folk'){if(StudioRoll.rand()<.7){const c=die(6);r.purse+=c;got.push(c+' gr')}if(StudioRoll.rand()<.4&&r.rations<15){r.rations++;got.push('1 ration')}}
  if(e.kind==='Beast'&&!e.thief&&StudioRoll.rand()<.3){RG().meat.push({n:1,d:2});got.push('meat')}
  if(Bt.o.roamer&&e.loot&&StudioRoll.rand()<.3){const id=e.loot[die(e.loot.length)-1];toPack(id,1);got.push(RLS.ITEMS[id]?RLS.ITEMS[id].name:id)}
  if(e.drops)e.drops.forEach(d=>{toPack(d.id,d.n||1);got.push(d.name||(RLS.ITEMS[d.id]||{}).name||d.id)})}
 if(got.length)await bsay(`From the bodies: ${got.join(', ')}.`,1300)}
// the yield box (Combat, A yielded enemy): Spare, Bind (Manacles), Rob, Kill
async function yieldBox(e,o){const r=G.run,man=hasItem('manacles'),who=party.filter(p=>!p.dead&&!p.ko),seen=Bt.yielded.length>1||party.some(p=>p.dead)?'seen':'unseen';
 const rows=[{label:'Spare'},{label:'Bind (Manacles)',dis:!man},{label:`Rob  ${o.bounty&&e.target?'':crimeMark(seen)}`},{label:`Kill  ${o.bounty&&e.target?'· no crime on a bounty':crimeMark(seen)}`}];
 const c=G.auto?(G.auto.yield?G.auto.yield(e,rows):0):await blist(`${e.name.toUpperCase()} YIELDS`,rows);
 const out=Bt.o.onYield?await Bt.o.onYield(e,c):null;if(out)return;
 if(c===1&&man){e.bound=true;Bt.stats.bound=(Bt.stats.bound||[]).concat([e.base]);await bsay(`${e.name} goes in the manacles.`,900);return}
 if(c===2){e.robbed=true;const g=die(6)+die(6);r.purse+=g;if(r.rations<15)r.rations++;await bsay(`${g} gr and a ration off ${e.name}.`,900);await crime(seen,'Robbing a man who gave up');
  const k=G.auto?0:await blist('THEN?',[{label:'Let them go'},{label:`Kill them  ${crimeMark(seen)}`}]);if(k===1)return yieldKill(e,o,seen);return}
 if(c===3)return yieldKill(e,o,seen);
 await bsay(`${e.name} goes, and doesn't look back.`,900);Bt.stats.spared=(Bt.stats.spared||[]).concat([e.base])}
async function yieldKill(e,o,seen){const k=party.filter(p=>!p.dead&&!p.ko)[0];e.dead=true;Bt.stats.killed.push(e.base);
 await bsay(`${k.name} does it.`,900);await sanRoll('Severe','violence',{who:[k],label:`${k.name} killed a man who gave up`});
 if(!(o.bounty&&e.target))await crime(seen,'Killing a man who yielded')}

// ================= FOES =================
const FOE_AI={};
async function foeTurn(e){
 Bt.active=e;await later(350);
 // an escorted client (the wool buyer): 1 in 4 enemy attacks go at him (People jobs)
 const cl=Bt.o.client||(G.run&&G.run.escort&&G.run.escort.alive?G.run.escort:null);
 if(cl&&cl.hp>0&&!e.ai&&R_.rand()<.25){const r=R_.pct(e.hit);showRes(R_.line(e.name.toUpperCase(),r,BW.words),r);if(r.ok){const d=Math.max(1,rollDice(e.dmg));cl.hp=Math.max(0,cl.hp-d);await bsay(`${e.name} goes for the wool buyer. ${d}.${cl.hp<=0?' He falls.':''}`,1100)}else await bsay(`${e.name} swings at the wool buyer and misses.`,900);return}
 if(e.ai&&FOE_AI[e.ai]&&FOE_AI[e.ai].turn){const done=await FOE_AI[e.ai].turn(e);if(done)return}
 const t=pickTarget(e);if(!t)return;await foeAttack(e,t);
}
// targeting: Draw fire forces it; Vanish hides; Downed aren't targeted; about half its attacks go at whoever hurt it last
function pickTarget(e,o={}){let alive=party.filter(m=>!m.ko&&!m.dead&&!m.vanish&&!(e.blockT===m)&&!(o.skip&&o.skip(m)));
 if(e.blockT)e.blockT=null;if(!alive.length)alive=party.filter(m=>!m.ko&&!m.dead);if(!alive.length)return null;
 const df=alive.find(m=>m.drawFire);if(df)return df;
 if(e.quirk==='Maneater'){const b=alive.find(m=>m.st.includes('Bleeding'));if(b)return b}
 if(o.pref){const p=o.pref(alive);if(p)return p}
 if(e.lastHurt&&alive.includes(e.lastHurt)&&R_.rand()<.5)return e.lastHurt;
 return alive[R_.die(alive.length)-1]}
// one enemy attack: its roll (Veteran +10, Shaken −20, Drunk), Defend, Slip and Riposte, armor (floor 1; crits through),
// the kettle hat's first crit, shields, wear, spines, caltrops and tripwires
async function foeAttack(e,t,o={}){
 let p=e.hit+(Bt.round===1&&Bt.o.foesFirstBonus?Bt.o.foesFirstBonus:0)+(e.quirk==='Veteran'?10:0)+((e.quirk==='Sworn'&&Bt.en.some(x=>x.dead))?10:0)-((e.st||[]).includes('Shaken')?20:0)-(Bt.smoke?20:0)+(o.mod|0)+(e.quirk==='Maneater'&&t.st.includes('Bleeding')?10:0);
 const r=R_.pct(p);showRes(R_.line(e.name.toUpperCase(),r,BW.words),r);
 if(!r.ok){await bsay(`${e.name} misses ${t.name}.`,800);return false}
 if(t.slip&&t.defend){const s=R_.pct(skillOf(t,'Dodge'));if(s.ok){await bsay(`${t.name} slips it.`,800);if((t.sk.Dodge||0)>=90&&!e.dead){await attack(t,e,{})}return false}}
 let d=o.dmg!=null?o.dmg:Math.max(1,rollDice(e.dmg)+(e.quirk==='Frenzied'?1:0));let crit=r.crit&&!o.noCrit;
 const head=t.gear&&t.gear.head,body=t.gear&&t.gear.body;
 if(crit&&head&&head.id==='kettle'&&!t.kettleUsed){t.kettleUsed=true;crit=false;head.wear=Math.min(3,(head.wear|0)+1);await bsay(`The kettle hat turns it.`,700)}
 if(crit){d*=2;if(body&&body.id){body.wear=Math.min(3,(body.wear|0)+1)}}
 if(t.defend){d=Math.floor(d/2);const sh=t.gear.w2&&t.gear.w2.id;if(sh==='buckler'||t.slots.some(s=>s.id==='buckler'))d=Math.max(0,d-1);if((sh==='roundshield'||sh==='heater')&&!RLS.ITEMS[(t.gear.w1||{}).id||'knife'].two)d=Math.floor(d/2)}
 if(t.gear.w2&&t.gear.w2.id==='heater'&&!t.heaterUsed&&!t.defend){t.heaterUsed=true;d=Math.floor(d/2)}
 if(!crit&&!o.throughArmor&&body&&!e.pierce){const A={jack:1,mail:2,plate:3}[body.id]|0;d-=Math.max(0,A-(body.wear|0))}
 d=Math.max(1,d);
 await bsay(`${e.name} hits ${t.name} for ${d}.${crit?' A crit.':''}`,1000);hurtMerc(t,d,e);
 if(e.thief&&G.run&&G.run.rations>0){G.run.rations--;e.took=(e.took|0)+1;Bt.stats.took++;await bsay(`${e.name} makes off with a ration.`,700)}
 if(!e.ranged&&!o.area){if(t.sp==='hedgehog'){await hurtFoe(e,1,t);await bsay(`${e.name} gets a face of spines.`,600)}
  if(t.caltrops&&(e.kind==='Folk'||e.kind==='Beast')){t.caltrops=0;e.stun=1;await bsay(`${e.name} treads in the caltrops. Stunned.`,700)}
  if(t.tripwire){t.tripwire=false;e.stun=1;await bsay(`${e.name} trips the wire. Stunned.`,700)}}
 if(t.vanish){t.vanish=false}
 if(e.onHit)await FOE_AI[e.ai].onHit(e,t,d);
 return true}
// an area attack: 1–3 to each merc (armor helps as usual; the card says if it goes through)
async function areaAttack(e,label,o={}){await bsay(label,1000);for(const m of party.filter(x=>!x.dead&&!x.ko)){let d=o.dmg?rollDice(o.dmg):die(3);const body=m.gear.body;if(!o.throughArmor&&body)d-=({jack:1,mail:2,plate:3}[body.id]|0);d=Math.max(1,d);if(m.defend)d=Math.max(1,Math.floor(d/2));hurtMerc(m,d,e)}}
async function grappleTurn(e){const g=e.grappled;if(!g||g.dead||g.ko){e.grappled=null;return foeTurn(e)}
 const a=R_.pct(e.hit),b=R_.pct(skillOf(g,'Melee'));if(a.ok&&(!b.ok||a.r>b.r)){e.grappled=null;g.grapple=null;await bsay(`${e.name} breaks free.`,800);return foeTurn(e)}await bsay(`${e.name} can't get loose.`,800)}
function hurtMerc(m,d,by){if(m.dead)return;Bt.stats.taken+=Math.min(d,m.hp);m.hp=Math.max(0,m.hp-d);m.shk=10;
 if(m.hp<=0&&!m.ko){m.ko=true;m.koT=0;m.downs=(m.downs|0)+1;Bt.stats.downs=(Bt.stats.downs|0)+1;Bt.downed.add(m);Bt.log=`${m.name} goes down.`;if(m.grapple){m.grapple.grappled=null;m.grapple=null}}}
const later=ms=>G.auto?Promise.resolve():sleep(fastOn()?Math.round(ms*.45):ms);
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
const folkCache={};
function spriteOf(e){if(e.sprite)return RLArt.sprite(e.sprite);if(e.group)return RLArt.sprite(e.group);
 if(e.sp){const k=e.sp+(e.look?e.look.shade:1);if(!folkCache[k]){const s=RLSP.map(e.sp,e.look),c=document.createElement('canvas');c.width=28;c.height=52;const x=c.getContext('2d');x.imageSmoothingEnabled=false;x.drawImage(s,0,0,28,52);folkCache[k]=c}return folkCache[k]}return null}
function foeX(i){const n=Bt.en.length;return Math.round(26+(VW-26)/(n+1)*(i+1))}
function drawBattle(){
 Bt.t++;const t=Bt.t,tall=Math.max(0,...Bt.en.map(e=>{const s=spriteOf(e);return s?s.height:40}));
 const L=SB.layout(VW,VH,{tallest:tall});Bt.hits=[];
 drawScene(L);
 // enemies, each with its nameplate under it
 Bt.en.forEach((e,i)=>{
  if(e.dead)e.alpha=Math.max(0,e.alpha-.04);if(e.alpha<=0)return;
  const x=foeX(i),s=spriteOf(e),by=L.enemyY;cx.globalAlpha=e.alpha;
  const lead=e.group&&Bt.en.find(f=>f.group===e.group);
  if(!(e.flash>0&&e.flash%4<2)){if(e.group){if(lead===e&&s){const gx=Math.round((foeX(Bt.en.indexOf(Bt.en.filter(f=>f.group===e.group)[0]))+foeX(Bt.en.lastIndexOf(Bt.en.filter(f=>f.group===e.group).slice(-1)[0])))/2);cx.globalAlpha=Math.max(.3,Bt.en.filter(f=>f.group===e.group&&!f.dead).length/Bt.en.filter(f=>f.group===e.group).length);cx.drawImage(s,Math.round(gx-s.width/2),by-s.height)}}
   else if(s){cx.imageSmoothingEnabled=false;cx.drawImage(s,Math.round(x-s.width/2),by-s.height)}else bR(x-10,by-30,20,30,PAL.ash)}
  if(e.flash>0)e.flash--;cx.globalAlpha=1;
  const hov=Bt.ui&&Bt.ui.kind==='list'&&Bt.ui.hover&&Bt.ui.hover(Bt.ui.sel)===e;
  if(hov){const ay=by-(s?s.height:30)-8+Math.sin(t*.2)*2;bR(x-3,ay,7,2,PAL.tallow);bR(x-2,ay+2,5,2,PAL.tallow);bR(x-1,ay+4,3,2,PAL.tallow)}
  if(!e.dead)plate(e,x,by+2+(e.group?(i%2)*24:0),i);
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
function cmdDetail(m,sel){const w=weaponOf(m);return [`${w.name} · ${w.dmg}${wearOf(m)?'−'+wearOf(m):''} · ${hitChance(m,null)}%${canFire(m)?'':' · spanning'}`,`${m.wp} WP`,`${m.slots.length} in slots`,Bt.roamer?'Defend, Brace, Retch, Flee':'Defend, Brace, Retch'][sel]}
// the nameplate: name, level, threat skulls, and an HP bar hatched and marked ??? until Identified
function plate(e,x,y){
 const nm=`${e.name} L${e.lvl||1}`,sk=e.skulls||1,w=Math.min(VW-28,Math.max(Bt.en.length>2?40:54,bW(nm,13)+sk*7+8)),x0=Math.round(Math.max(26,Math.min(VW-2-w,x-w/2)));
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
