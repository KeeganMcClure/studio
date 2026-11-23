// Rushlight · content/jobs.js
// Each slice job on the ground (spec 006, D2): its hotspots, placed fights, endings, moments and pay, read by site.js.
// A job script: {next0, hotspots(chunk, job), fights(chunk, job), npcs, arrive, onStep, cache (item pool), pay}.
// The bestiary's text for each creature (BEAST_TEXT) is here too. Content data and small scripts only.
const BEAST_TEXT={
 pell:{desc:'PJ-PELL-DESC'},
 hag:{desc:'CR-HAG-BOARD',signs:['CR-HAG-SIGN-1','CR-HAG-SIGN-2','CR-HAG-SIGN-3'],under:'CR-HAG-BEST'},
 hedgecat:{desc:'CR-HCAT-DESC',signs:['CR-HCAT-SIGN-1','CR-HCAT-SIGN-2'],trophy:'Meat.'},
 rooks:{desc:'CR-ROOK-DESC',signs:['CR-ROOK-SIGN-1','CR-ROOK-SIGN-2'],trophy:'The rations back.'},
 candle:{desc:'CR-CANDLE-DESC',signs:['CR-CANDLE-SIGN-1','CR-CANDLE-SIGN-2'],under:'CR-CANDLE-UNDER',kind:'Corpselight',nature:'Hungry'},
 lamp:{desc:'CR-LAMP-DESC',signs:['CR-LAMP-SIGN-1','CR-LAMP-SIGN-2'],under:'CR-LAMP-UNDER',kind:'Lampwalkers',nature:'Bound'}
};
// a road bandit as Pell's cousins and the Hag's smugglers (Combat, Folk enemies: region 1), dressed by the seed
const cousin=()=>foe('bandit',{fits:['Greedy','Drunk']});
const JOB_SCRIPTS={
 // ---- Pell the poacher: bounty, short case, at the charcoal camp (People jobs; spec 006 D2) ----
 pell:{site:'camp',next0:null,
  init(job){job.next='Find Pell. Two men sit by his fire.'},
  hotspots(ch,job){const out=[];
   if(ch==='camp-trail'||ch==='camp-track')out.push({id:'dug',spot:'a',line:'ST-PELL-DUG',title:'THE DUG GROUND',opts:[{skill:'Search',min:0,verb:'SEARCH',run:async(m)=>{job.flags.snare=1;await say('',`${m.name} finds the snare line under the leaves. Nobody will step in it now.`)}}]});
   if(ch==='camp-clearing')out.push({id:'frogs',spot:'a',line:'ST-PELL-FROGS',title:'FROGS ON A LINE',opts:[{skill:'Survival',min:40,verb:'TRACK',run:async(m)=>{job.flags.exposed=1;await say('',`${m.name} reads where he went to check them. You'll know where he stands.`)}}]});
   if(ch==='camp-hut'){
    out.push({id:'kin',spot:'k',title:'THE HUT',when:j=>j.fights.pell,opts:[{skill:'Empathy',min:0,verb:'LISTEN',run:async()=>{job.flags.kin=1;await say('',RLT('PJ-PELL-KIN'))}}]});
    out.push({id:'thatch',spot:'t',line:'ST-PELL-THATCH',title:'THE THATCH',opts:[{skill:'Search',min:0,verb:'TAKE IT',roll:false,crime:'',dis:j=>j.flags.thatch,
     run:async(m)=>{const r=G.run,seen=job.flags.pellAlive?'seen':'unseen';r.purse+=10;job.flags.thatch=1;await say('','Ten groats in a twist of cloth. His kits\' winter.');
      await moment(job,'Money',m=>`${m.name} pockets it and doesn't look at the hut.`);job.flags.familyGone=1;if(seen==='seen')await crime('seen','Taking his winter money')}}]})}
   return out},
  fights(ch,job){const out=[];
   if(ch==='camp-clearing')out.push({id:'cousins',spot:'F',r:3,plate:'ROAD BANDIT L1 ☠ ×2',show:[{sp:'rat'},{sp:'hedgehog'}],
    foes:()=>[cousin(),cousin()],o:()=>({}),after:async(j,res,st)=>{j.next='Pell is in the hut. Mind your feet.';const c=G.run.contracts.find(x=>x.id==='pell');if(c)c.next=j.next;j.cousinsLeft=(st.yielded||[]).length}});
   if(ch==='camp-hut')out.push({id:'pell',spot:'P',r:2,plate:'PELL L3 ☠☠',show:[{sp:'fox',look:{shade:2,mark:1,neck:2}}],when:j=>!!j.fights.cousins,
    foes:()=>{const P=Object.assign(foe('bandit'),{name:'Pell',base:'Pell',lvl:3,hp:22,dex:16,hit:50,dmg:'1d4+1',nerve:'Skittish',target:true,sp:'fox',look:{shade:2,mark:1,neck:2},yieldLine:'PJ-PELL-YIELD',bestiary:'pell'});
     return [P]},
    o:()=>({bounty:true,exposedFirst:!!job.flags.exposed,onStart:async()=>{bestiary('pell','sighted',{name:'Pell the poacher',kind:'Folk'});
      // Snare line: the first merc to close on him rolls Search or is Stunned, unless the snare line was found
      if(!job.flags.snare){const m=lead();if(!StudioRoll.pct(skillOf(m,'Search')).ok){addSt(m,'Stunned');await bsay(`${m.name} steps in the snare line. Stunned.`,1100)}else await bsay(`${m.name} spots the snare line in time.`,900)}},
     onYield:async(e,c)=>{if(e.base!=='Pell')return null;return pellEnding(job,c==null?0:c)}}),
    after:async(j,res,st)=>{if(res==='flee'||res==='time')return;if(!j.ending)j.ending=st.killed.includes('Pell')?'dead':'gone';await pellDone(j)}});
   return out},
  cache:['bandage','snare','rope','knife','willow','salt']},
};
// Pell yields (Skittish, on purpose): Bind for +50%; Kill for the fee (the Severe roll, no crime on a bounty target);
// Rob as usual; or let him go (no pay, +1 Outlaws favor, ST-PELL-GO), the Family moment if a merc holds it
async function pellEnding(job,c){
 const rows=[{label:'Let him go'},{label:'Bind him (Manacles)',dis:!hasItem('manacles')},{label:`Rob him  ${crimeMark('unseen')}`},{label:'Kill him · no crime on a bounty'}];
 if(!job.flags.kin&&party.some(m=>!m.dead&&(m.sk.Empathy||0)>=10)){}
 const k=G.auto?(G.auto.yield?G.auto.yield({base:'Pell'},rows):1):await blist('PELL YIELDS',rows);
 if(k===1&&hasItem('manacles')){job.ending='bound';job.flags.pellAlive=1;await bsay('Pell holds his wrists out. He has done this before.',1100);return true}
 if(k===2){const g=StudioRoll.die(6)+StudioRoll.die(6);G.run.purse+=g;await bsay(`${g} gr off him. He watches.`,1000);await crime('unseen','Robbing a man who gave up');job.ending='robbed';job.flags.pellAlive=1;return true}
 if(k===3){const killer=party.filter(p=>!p.dead&&!p.ko)[0];job.ending='dead';Bt.stats.killed.push('Pell');await bsay(`${killer.name} does it.`,900);await sanRoll('Severe','violence',{who:[killer],label:`${killer.name} killed a man who gave up`});return true}
 job.ending='go';await bsay(RLT('ST-PELL-GO'),1600);await favor('outlaws',1);
 await moment(job,'Family',m=>`${m.name} watches the kits go. It was worth the fee.`);return true}
async function pellDone(job){const r=G.run,c=r.contracts.find(x=>x.id==='pell');job.resolved=true;
 if(job.ending==='go'){job.next='Done. Pell is gone, and so is the fee.';if(c)c.next=job.next;await payScreen('pell',{noFee:true});r.job=null;return}
 bestiary('pell','killed',{name:'Pell the poacher',kind:'Folk'});
 job.payWith=job.ending==='bound'?1.5:1;job.next=`Take ${job.ending==='bound'?'Pell':'the body'} to Harrowford for the pay.`;if(c){c.next=job.next;c.payAt='harrow'}
 await say('',job.ending==='bound'?'Pell walks between you, quiet, the whole way.':'You load him over a shoulder. He weighs less than you thought.');saveRun()}
// a motivation moment: each merc holding the motivation gains 1d4 SAN (Depression stops it)
async function moment(job,mot,line){job.moments=job.moments||{};if(job.moments[mot])return;job.moments[mot]=1;
 for(const m of party.filter(p=>!p.dead&&p.mot.includes(mot)&&!(p.dis||[]).includes('Depression'))){const s=StudioRoll.die(4);m.san=Math.min(m.msan,m.san+s);await say('',`${line(m)} +${s} SAN.`)}applySan()}

// ================= D2: THE OTHER FIVE JOBS =================
Object.assign(BEAST_TEXT,{
 noonwife:{desc:'CR-NOON-DESC',signs:['CR-NOON-SIGN-1','CR-NOON-SIGN-2','CR-NOON-SIGN-3'],tales:['CR-NOON-TALE-1','CR-NOON-TALE-2','CR-NOON-TALE-3'],under:'CR-NOON-UNDER',kind:'Poludnica',nature:'Bound',weak:'Keep her talking until the noon bell.',trophy:'Her headcloth. The church burns it.'},
 counter:{desc:'CR-COUNT-DESC',signs:['CR-COUNT-SIGN-1','CR-COUNT-SIGN-2','CR-COUNT-SIGN-3'],tales:['CR-COUNT-TALE-1','CR-COUNT-TALE-2','CR-COUNT-TALE-3'],under:'CR-COUNT-UNDER',kind:'the Counter',nature:'Hungry',weak:'It hunts by sound. The silent are safe.',trophy:'Its teeth, too many for its jaw.'},
 severa:{desc:'CR-OWL-DESC',signs:[],trophy:'Her pinions (a part).'},
});
const TALES={noonwife:['true','true','legend'],counter:['legend','legend','true'],monk:['true','legend','true']};
// sort a tale: the job's own record and the bestiary (which keeps it for later runs)
function sortTale(key,n){const job=G.run.job;if(job){job.tales=job.tales||{};job.tales[n]=TALES[key][n-1]}bestiary(key,null,{tale:[n,TALES[key][n-1]]})}
const taleKnown=(key,n)=>{const b=ledger().bestiary[key];return b&&b.tales[n]};
// the next of the Hollow Monk's signs not yet found (a repeated source gives the next one instead)
async function monkSign(prefer){const g=RG(),order=[prefer,'CR-MONK-SIGN-1','CR-MONK-SIGN-2','CR-MONK-SIGN-3','CR-MONK-SIGN-4'];const id=order.find(s=>s&&!g.signs.includes(s));if(!id)return;addSign(id);
 (g.notes=g.notes||[]).push({id,at:g.at});await say('',RLT(id));await say('','You write it on the Signs list.'+(denFound()?' Three now. They all point at Lowmoor Pit.':''))}
// taking proof after a hunt (Trophies): any merc can hack off crude proof; Butchery's Dress the kill takes a clean trophy and 1–2 parts
async function takeProof(key,name,unnatural){const b=party.filter(p=>!p.dead).sort((a,c)=>(c.sk.Butchery||0)-(a.sk.Butchery||0))[0];
 const c=G.auto&&G.auto.menu?((b.sk.Butchery||0)>=40?1:0):await choose([{label:'Take crude proof (no roll)'},{label:`Dress the kill (Butchery · ${b.name} ${skillOf(b,'Butchery')}%)`,dis:(b.sk.Butchery||0)<40}],{title:'PROOF'});
 if(c===1){const o=StudioRoll.pct(skillOf(b,'Butchery'));if(o.ok){addTrophy({id:'tr-'+key,name,trophy:true,unnatural,clean:true,pious:true});const n=StudioRoll.die(2);for(let i=0;i<n;i++)addTrophy({id:'part-'+key,name:'Spare part ('+name.toLowerCase()+')',part:true,value:3+StudioRoll.die(6)});await say('',`${b.name} takes it cleanly, and ${n} spare part${n>1?'s':''}.`);return true}
  await say('',`${b.name} makes a mess of it. Crude proof will have to do.`)}
 addTrophy({id:'tr-'+key,name,trophy:true,unnatural,pious:true});return true}

// ---- the Withy Hag: false alarm, quick job, at the osier causeway at night ----
const hagSmuggler=()=>foe('bandit',{fits:['Greedy','Drunk']});
JOB_SCRIPTS.hag={site:'cause',
 init(job){job.next='Find what screams in the withies.';job.tod='night'},
 async arrive(job){bestiary('hag','sighted',{name:'The Withy Hag'})},
 hotspots(ch,job){const out=[];
  if(ch.startsWith('cause-beds'))out.push({id:'claws',spot:'k',title:'CLAW MARKS',opts:[
   {skill:'Search',min:0,verb:'SEARCH',run:async()=>{job.flags.prints=1;await say('',RLT('ST-HAG-PRINTS'))}},
   {skill:'Survival',min:40,verb:'TRACK',run:async()=>{job.flags.prints=1;await say('',RLT('ST-HAG-PRINTS'))}},
   {skill:'Occult',min:40,verb:'IDENTIFY',note:'1 WP',run:async(m)=>{m.wp=Math.max(0,m.wp-1);job.flags.nolaw=1;await say('',RLT('ST-HAG-NOLAW'));bestiary('hag','identified')}}]});
  if(ch==='cause-causeway')out.push({id:'skull',spot:'m',title:'THE HERON SKULL',opts:[{skill:'Search',min:0,verb:'LOOK',roll:false,run:async()=>{await say('',RLT('CR-HAG-SIGN-2'))}}]});
  if(ch==='cause-boats')out.push({id:'salt',spot:'b',title:'AN UPTURNED BOAT',opts:[{skill:'Search',min:0,verb:'SEARCH',run:async()=>{job.flags.salt=1;await say('',RLT('ST-HAG-SALT'))}}]});
  return out},
 fights(ch,job){if(ch!=='cause-boats')return[];return[{id:'hag',spot:'F',r:3,plate:'THE WITHY HAG ☠☠',show:[{sp:'rat'}],
  foes:()=>[Object.assign(hagSmuggler(),{name:'The Withy Hag',base:'The Withy Hag',quirk:'Veteran',noQuirk:true,sprite:'hag',leader:true,yieldLine:'ST-HAG-UNMASK'}),hagSmuggler(),hagSmuggler(),hagSmuggler()],
  intro:null,o:()=>({onStart:async()=>{await bsay('Something tall comes out of the withies, screaming.',1400)},onYield:async(e,c)=>{if(e.leader)job.flags.unmasked=1;return null}}),
  pre:async(job)=>hagMeet(job),
  after:async(j,res,st)=>{if(res!=='win')return;j.flags.unmasked=1;bestiary('hag','killed');await say('','The mask comes off the leader. A stoat, sweating, very alive or very dead.');
   const bound=(st.bound||[]).length;j.resolved=true;await payScreen('hag',{bonus:10+(bound?5:0)});G.run.purse+=10+(bound?5:0);await say('',`The reeve adds his bounty: ${10+(bound?5:0)} gr.`);await favor('town',1);G.run.job=null}}]}};
// with the bootprints, A on the Hag offers Unmask before any fight: a Persuade scene with four ways out
async function hagMeet(job){if(!job.flags.prints)return false;
 await say('','Something tall comes out of the withies, screaming. Under the screaming, hobnails on wet planks.');
 const c=await ask('','Unmask her, or fight?',['Unmask her','Fight']);if(c!==0)return false;
 await say('',RLT('ST-HAG-UNMASK'));job.flags.unmasked=1;bestiary('hag','killed');await moment(job,'Find the truth',m=>`${m.name} wanted to know. Now they do.`);
 const P=best('Persuade'),k=await ask('STOAT','What now?',[`Turn them in (Persuade · ${P.name} ${skillOf(P,'Persuade')+distrust(P)}%)`,`Take a cut (15 gr)  ${crimeMark('seen')}`,'Sell the guild the mask as the head','Fight']);
 const r=G.run;job.fights.hag='talked';job.resolved=true;
 if(k===0){const o=StudioRoll.pct(skillOf(P,'Persuade')+distrust(P));if(o.ok){await say('','They come quietly. The reeve will want them alive.');r.purse+=15;await payScreen('hag',{});await say('','The reeve\'s bounty, alive: 15 gr.');await favor('town',1);r.job=null;return true}
  await say('','They don\'t like that answer.');job.fights.hag=null;job.resolved=false;return false}
 if(k===1){r.purse+=15;await crime('seen','Taking the smugglers\' cut');await favor('outlaws',1);r.fence=true;await say('','Fifteen groats, and a name at Harrowford who buys what nobody asks about.');await payScreen('hag',{noFee:true});r.job=null;return true}
 if(k===2){r.hagLie=1;await say('','You wrap the mask in a sack. It looks like a head if nobody looks.');await payScreen('hag',{});r.job=null;return true}
 job.fights.hag=null;job.resolved=false;return false}

// ---- the wool buyer: escort, road job, Harrowford to Saint Ebbe's ----
// the client walks with the company: he eats a ration a day; 1 in 4 enemy attacks go at him (HP 12); day 1 brings the felled tree
JOB_SCRIPTS.wool={road:true};
async function onTake(id){const r=G.run;if(id==='wool'){r.escort={hp:12,mhp:12,alive:true,days:0,tree:false,purse:null};const c=r.contracts.find(x=>x.id==='wool');c.next="Walk him to Saint Ebbe's. He eats too.";
 await say('WOOL BUYER',RLT('PJ-WOOL-BARK-1'))}}
const _evHookTown=eventHook;
eventHook=async function(kind,L){const r=G.run,e=r.escort;
 // day 1 of the escort always brings the felled tree on the wool road
 if(e&&e.alive&&!e.tree&&(L.road==='he')){e.tree=true;if(kind!=='tree'){return EV.tree(L)}}
 return _evHookTown(kind,L)};
async function afterCamp(){const r=G.run,e=r.escort;if(!e||!e.alive||e.purse)return;e.purse='looked';
 const m=best('Search'),o=StudioRoll.pct(skillOf(m,'Search'));if(!o.ok)return;e.purse='found';
 await say('',RLT('PJ-WOOL-PURSE'));await say('WOOL BUYER',RLT('PJ-WOOL-BEG'));
 const c=await ask('','The second purse. 20 gr.',['Keep it for the guild master (+1 Town favor at Harrowford)',`Keep it all (20 gr)  ${crimeMark('seen')}`,'Take his split (10 gr)']);
 const job=r.job||{};if(c===0){e.purse='return';r.woolPurse=1;await moment(job,'Duty',m=>`${m.name} knots it shut. It goes back where it belongs.`)}
 else if(c===1){r.purse+=20;e.purse='kept';await crime('seen','Keeping the skim')}
 else{r.purse+=10;e.purse='split';await moment(job,'Money',m=>`${m.name} counts their half twice.`)}}
async function woolArrive(){const r=G.run,e=r.escort;if(!e)return false;
 if(!e.alive){r.escort=null;return false}
 await say('',RLT('ST-WOOL-ARRIVE'));r.escort=null;await payScreen('wool',{});return true}
async function woolDied(){const r=G.run;r.escort.alive=false;await say('','The wool buyer is dead in the road, his silver under him.');
 const c=r.contracts.find(x=>x.id==='wool');if(c){c.next='Failed. The guild will hear.';await payScreen('wool',{failed:true});await favor('town',-1)}r.escort=null}

// ---- the Noonwife: hunt, at Hollin, at noon ----
// her card (Creatures): HP 58 · DEX 16 · 60% · 1d4+2 · Wring (ignores armor) and The Question; no HP bar until Identified;
// a blank face; no shadow; the noon bell ends noon after 12 rounds, a failed attempt, not a failed job
FOE_AI.noon={async turn(e){const W=e.wring;
  if(W&&!W.dead&&!W.ko&&W.wrung){const d=rollDice('1d4+2');await bsay(`She wrings ${W.name}. ${d}, and no armor helps.`,1100);hurtMerc(W,d,e);return true}
  e.wring=null;const pick=R_.die(3);
  if(pick===1&&!Bt.o.noQuestion){const t=pickTarget(e);if(!t)return true;await bsay(`She leans down to ${t.name} and asks a question.`,1300);
   const sk=skillOf(t,'History')>=skillOf(t,'Persuade')?'History':'Persuade',o=R_.pct(skillOf(t,sk));showRes(R_.line(sk.toUpperCase(),o,BW.words),o);
   if(!o.ok){await sanRoll('Disturbing','unnatural',{who:[t],label:`${t.name} answers wrong`});addSt(t,'Stunned')}else await bsay(`${t.name} keeps her talking.`,900);return true}
  if(pick===2){const t=pickTarget(e);if(!t)return true;const r=R_.pct(e.hit);showRes(R_.line('THE NOONWIFE',r,BW.words),r);if(r.ok){e.wring=t;t.wrung=e;await bsay(`Her long hands close on ${t.name}.`,1100)}else await bsay(`Her hands close on air.`,900);return true}
  return false}};
async function noonMerc(m){if(!m.wrung)return false;const e=m.wrung;if(e.dead){m.wrung=null;return false}const o=R_.pct(skillOf(m,'Athletics'));showRes(R_.line('ATHLETICS',o,BW.words),o);
 if(o.ok){m.wrung=null;e.wring=null;await bsay(`${m.name} breaks her grip.`,900);return false}await bsay(`${m.name} can't get loose.`,900);return true}
JOB_SCRIPTS.noon={site:'hollin',
 init(job){job.next='Find what is killing the reapers. Noon is near.';job.tod='noon';job.hpOff=0},
 async arrive(job){bestiary('noonwife','sighted',{name:'The Noonwife'});await say('',RLT('CR-NOON-DESC'))},
 hotspots(ch,job){const out=[];
  if(ch==='hollin-lane'){
   out.push({id:'roll',spot:'r',title:'THE CHURCH ROLL',opts:[{skill:'History',min:40,verb:'OLD STONES',run:async()=>{await say('',RLT('ST-NOON-ROLL'));sortTale('noonwife',1)}}]});
   out.push({id:'sexton',spot:'s',title:'THE SEXTON',line:'ST-NOON-SEXTON',opts:[
    {skill:'Persuade',min:0,verb:'PERSUADE',run:async()=>{job.hpOff+=.15;job.prep.push('The sexton rings the bell early (−15% HP).');await say('','He\'ll ring it early. Noon will be short.')}},
    {skill:'Persuade',min:0,verb:'PAY 5 GR',roll:false,dis:()=>G.run.purse<5,run:async()=>{G.run.purse-=5;job.hpOff+=.15;job.prep.push('The sexton rings the bell early (−15% HP).');await say('','He takes the coin and the key to the bell rope.')}}]});
   out.push({id:'miner',spot:'m',title:'AN OLD MINER',line:'ST-NOON-MINER',opts:[{skill:'Search',min:0,verb:'LISTEN',roll:false,run:async()=>{await monkSign('CR-MONK-SIGN-4')}}]});
   out.push({id:'mass',spot:'c',title:"HOLLIN'S CHURCH",when:j=>party.some(m=>!m.dead&&m.mot.includes('Faith'))&&!j.moments?.Faith,opts:[{skill:'Search',min:0,verb:'A MASS FOR THE REAPER · 10 GR',roll:false,dis:()=>G.run.purse<10,run:async()=>{G.run.purse-=10;await moment(job,'Faith',m=>`${m.name} kneels through the whole mass.`)}}]})}
  if(ch==='hollin-cottages'){
   out.push({id:'witness',spot:'w',title:'THE REAPER WHO LIVED',line:'ST-NOON-WITNESS',opts:[{skill:'Empathy',min:0,verb:'SIT WITH HIM',run:async()=>{await say('',RLT('ST-NOON-ASKED'));job.noQuestion=1;job.prep.push('The reaper told what she asks (no Question).');sortTale('noonwife',2);
     if(party.some(m=>!m.dead&&m.mot.includes('Protect the innocent'))){const c=await ask('','Stay with him the day?',['Sit with him (a day passes)','Go']);if(c===0){G.run.day++;await eatDay();await moment(job,'Protect the innocent',m=>`${m.name} stays until he sleeps.`)}}}}]});
   out.push({id:'crows',spot:'g',title:'THE CROWS',opts:[{skill:'Search',min:0,verb:'LOOK',roll:false,run:async()=>{await say('',RLT('CR-NOON-SIGN-2'))}}]})}
  if(ch==='hollin-edge'){
   out.push({id:'reaper',spot:'d',title:'A REAPER AT THE EDGE',line:'ST-NOON-REAPER',opts:[{skill:'Butchery',min:40,verb:'EXAMINE',alwaysRun:true,run:async(m,res)=>{await sanRoll('Disturbing','violence',{id:'noon-reaper',who:'lead',label:'The reaper'});if(res.ok){await say('',RLT('CR-NOON-SIGN-1'))}}}]});
   out.push({id:'shimmer',spot:'k',title:'THE SHIMMER',opts:[{skill:'Search',min:0,verb:'LOOK',roll:false,run:async()=>{await say('',RLT('CR-NOON-SIGN-3'))}}]})}
  return out},
 fights(ch,job){if(ch!=='hollin-field')return[];return[{id:'noonwife',spot:'F',r:3,plate:'??? L3 ☠☠☠',show:[],
  foes:()=>{const hp=Math.round(58*(1-Math.min(.4,job.hpOff)));return[{name:'The Noonwife',base:'The Noonwife',kind:'Unnatural',lvl:3,hp,dex:16,hit:60,dmg:'1d4+2',sprite:'noonwife',faceless:true,target:true,known:!!(ledger().bestiary.noonwife||{pieces:{}}).pieces.identified,ai:'noon',horror:{tier:'Disturbing',id:'noonwife'},bestiary:'noonwife',weakLine:'Keep her talking until the noon bell.',remedy:null,backfire:'coldiron'}]},
  o:()=>({target:true,countdown:{label:'NOON BELL',n:12,end:'The noon bell rings. She is gone from the field, and the field is quiet until tomorrow.'},noQuestion:!!job.noQuestion,
   mercPre:noonMerc,extraMoves:m=>[{label:'Hold up iron',right:'tale 3',run:async(mm)=>{await bsay(RLT('ST-NOON-LAUGH'),1500);sortTale('noonwife',3)}}],
   onStart:async()=>{await bsay('A tall shape in white stands up in the rye. It casts no shadow.',1500)}}),
  after:async(j,res,st)=>{if(res==='time'){j.fights.noonwife=null;j.next='Noon is over. Try again tomorrow.';G.run.day++;await eatDay();await say('','A day waits on the edge of the field. The rations go down.');return}
   if(res!=='win')return;bestiary('noonwife','killed',{allTales:{1:'true',2:'true',3:'legend'}});await say('',RLT('CR-NOON-UNDER'));
   await takeProof('noonwife','Her headcloth',true);j.resolved=true;await payScreen('noon',{});G.run.job=null}}]}};

// ---- Severa the owl: beast job, quick job, at Sallow End ----
// HP 20 · DEX 18 · 55% · 1d4+1 · Tough, Lurker, Skittish · Carry off (the smallest merc) · Silent wing at night · a quirk
FOE_AI.owl={async turn(e){const c=e.carry;
  if(c&&!c.dead){c.carried=false;e.carry=null;if(e.hitSinceLift){await bsay(`Severa lets ${c.name} go short of the rafters.`,900);return true}
   const d=rollDice(Bt.o.rafters?'1d3':'1d6');await bsay(`Severa drops ${c.name}. ${d}.`,1100);hurtMerc(c,d,e);return true}
  if(R_.die(3)===1){const size={Small:0,Middle:1,Tall:2},up=party.filter(m=>!m.dead&&!m.ko).sort((a,b)=>size[a.size]-size[b.size]);const t=up[0];if(!t)return true;
   const r=R_.pct(e.hit);showRes(R_.line('SEVERA',r,BW.words),r);if(r.ok){e.carry=t;t.carried=true;e.hitSinceLift=false;await bsay(`Severa lifts ${t.name} off the ground.`,1100)}else await bsay('Her talons close on nothing.',900);return true}
  return false},
 async onHurt(e){if(e.carry)e.hitSinceLift=true}};
async function owlMerc(m){if(m.carried){await bsay(`${m.name} hangs from her talons.`,800);return true}return false}
JOB_SCRIPTS.owl={site:'sallow',
 init(job){job.next='Find the owl before dark, or bait her after.';job.tod='dusk'},
 async arrive(job){bestiary('severa','sighted',{name:'Severa the owl',kind:'Beast'})},
 hotspots(ch,job){const out=[];
  if(ch==='sallow-church')out.push({id:'loft',spot:'l',title:'THE LOFT LADDER',line:'ST-OWL-LOFT',when:j=>!j.flags.night,opts:[{skill:'Athletics',min:0,verb:'CLIMB',run:async()=>{job.flags.loft=1;await owlFight(job,'day')}}]});
  if(ch==='sallow-cottage')out.push({id:'parents',spot:'p',title:"THE PARENTS' DOOR",line:'ST-OWL-PARENTS',opts:[
   {skill:'Persuade',min:0,verb:'ASK FOR THE SMOCK',run:async()=>{job.flags.night=1;job.tod='night';await say('','You stake the smock out in the yard and wait for dark.');await owlFight(job,'night')}},
   {skill:'Empathy',min:0,verb:'SIT WITH THEM',roll:false,dis:()=>!party.some(m=>!m.dead&&m.mot.includes('Family')),run:async()=>{await moment(job,'Family',m=>`${m.name} sits with them until the light goes.`);job.flags.night=1;job.tod='night';await owlFight(job,'night')}}]});
  return out},
 fights(){return[]}};
async function owlFight(job,when){const night=when==='night';
 const sev={name:'Severa',base:'Severa',kind:'Beast',lvl:3,hp:20,dex:18,hit:55,dmg:'1d4+1',sprite:'severa',nerve:'Skittish',lurker:night,silent:night,ai:'owl',onHurt:true,fits:['Old','Maneater'],bestiary:'severa'};
 const res=await battle([sev],{bg:night?'night':'dusk',stunFirst:!night,rafters:!night,mercPre:owlMerc,setFight:true});
 if(res==='lose'){await wipe();return}
 if(res!=='win'||(G.lastStats.fled||[]).includes('Severa')){job.next='She flew. She will be back tomorrow night.';G.run.day++;await eatDay();job.used.loft=undefined;job.used.parents=undefined;await say('','Severa is gone into the dark. She\'ll come back tomorrow night, and the job isn\'t done.');return}
 bestiary('severa','killed',{name:'Severa the owl',kind:'Beast'});await say('',RLT('CR-OWL-ROOST'));addTrophy({id:'part-severa',name:'Her pinions',part:true,value:6});
 if(party.some(m=>!m.dead&&m.mot.includes('Protect the innocent'))){const c=await ask('','The shoes.',['Carry them to the priest (a day)','Leave them for the hamlet']);if(c===0){G.run.day++;await eatDay();await moment(job,'Protect the innocent',m=>`${m.name} carries them the whole way.`)}}
 job.resolved=true;await payScreen('owl',{});G.run.job=null}

// ---- the Counter: hunt, at Crookback, overcast ----
// HP 48 · DEX 18 · 65% · 1d6+2 · Frenzy (two attacks on the loudest merc) · Burrow · a blank face; it comes to the loudest
// place on the site: the first Loud action, or the pit if nothing is Loud
FOE_AI.counter={async turn(e){
  if(e.burrowed){e.burrowed=false;await bsay('The ground opens beside '+loudest(e).name+'.',1000);await foeAttack(e,loudest(e));return true}
  if(!e.burrowedOnce&&R_.die(4)===1){e.burrowed=true;e.burrowedOnce=true;await bsay('It goes into the ground.',1000);return true}
  e.burrowedOnce=false;const t=loudest(e);if(!t)return true;await bsay('It goes for the loudest of you.',800);await foeAttack(e,t);if(!t.ko&&!t.dead)await foeAttack(e,loudest(e));return true}};
function loudest(e){const up=party.filter(m=>!m.dead&&!m.ko);return up.find(m=>m===Bt.loudest)||(e.lastHurt&&up.includes(e.lastHurt)?e.lastHurt:up[R_.die(up.length)-1])}
JOB_SCRIPTS.counter={site:'crook',
 init(job){job.next='Find what eats the dead. Keep quiet.';job.tod='overcast';job.hpOff=0},
 async arrive(job){bestiary('counter','sighted',{name:'The Counter'});await say('',RLT('CR-COUNT-DESC'))},
 onStep:async(ch,job)=>{if(job.flags.loud&&!job.fights.counter&&!job.flags.coming){job.flags.coming=1;await say('','Something under the village heard that. It\'s coming.');await counterFight(job)}},
 hotspots(ch,job){const out=[];
  if(ch==='crook-church')out.push({id:'graves',spot:'g',title:'THE CHURCHYARD',line:'ST-COUNT-GRAVES',opts:[{skill:'Butchery',min:40,verb:'EXAMINE',alwaysRun:true,run:async(m,res)=>{await sanRoll('Disturbing','unnatural',{id:'count-graves',who:'lead',label:'The open graves'});if(res.ok)await say('',RLT('CR-COUNT-SIGN-1'))}}]},
   {id:'parish',spot:'b',title:'THE PARISH BOOK',opts:[{skill:'History',min:40,verb:'READ',run:async()=>{await say('',RLT('ST-COUNT-PARISH'));sortTale('counter',3);
     if(party.some(m=>!m.dead&&m.mot.includes('Curiosity'))){const c=await ask('','Read the whole book?',['Read all of it (tonight\'s camp counts as sleeping rough)','Enough']);if(c===0){job.flags.read=1;await moment(job,'Curiosity',m=>`${m.name} reads it to the last page.`)}}}},
    {skill:'Letters',min:40,verb:'READ',run:async()=>{await say('',RLT('ST-COUNT-PARISH'));sortTale('counter',3)}}]});
  if(ch==='crook-ditch')out.push({id:'rows',spot:'r',title:'THE BONE ROWS',line:'ST-COUNT-ROWS',opts:[{skill:'Search',min:0,verb:'SEARCH',run:async()=>{await say('',RLT('CR-COUNT-SIGN-2'))}}]},
   {id:'pit',spot:'p',title:'THE PLAGUE PIT',line:'ST-COUNT-PIT',opts:[{skill:'Search',min:0,verb:'TURN THE BODY',roll:false,run:async()=>{await sanRoll('Severe','violence',{id:'count-pit',who:'lead',label:'Turning the body'});sortTale('counter',2);await say('','It was a plague body. That\'s all it was.')}}]});
  if(ch==='crook-bakehouse')out.push({id:'nest',spot:'n',title:'THE OVEN',line:'ST-COUNT-NEST',opts:[{skill:'Search',min:0,verb:'BURN THE NEST',roll:false,run:async(m)=>{
   const how=hasItem('firepot')?'firepot':hasItem('torch')?'torch':'oven';if(how==='firepot')useItem('firepot');job.hpOff+=.15;job.prep.push('Burned its nest (−15% HP).');
   await say('',`You burn it${how==='oven'?' in the oven itself':''}. It smells like a bad year.`);await sanRoll('Disturbing','unnatural',{id:'count-nest',who:[m],label:`${m.name} handles the bones`})}}]});
  if(ch==='crook-street')out.push({id:'fleece',spot:'f',title:'AN EMPTY HOUSE',line:'ST-COUNT-FLEECE',opts:[{skill:'Craft',min:40,verb:'MUFFLE THE KIT',run:async()=>{job.flags.muffled=1;job.prep.push('Boots and kit muffled (it opens Stunned).');await say('','Rags round the boots, fleece round the buckles. The company goes soft-footed.')}}]},
   {id:'lamp',spot:'s',title:'A SHUTTERED ROOM',line:'ST-COUNT-LAMP',opts:[{skill:'Search',min:0,verb:'LOOK IN',roll:false,run:async()=>{await monkSign('CR-MONK-SIGN-1')}}]},
   {id:'sealed',spot:'l',title:'THE SEALED HOUSE',when:()=>party.some(m=>!m.dead&&m.mot.includes('Revenge')),opts:[{skill:'Melee',min:40,verb:'FORCE IT · LOUD',loud:true,run:async()=>{await moment(job,'Revenge',m=>`${m.name} puts the door in. The last family is still in there.`)}}]});
  if(ch==='crook-ruin')out.push({id:'seed',spot:'e',title:"THE APOTHECARY'S RUIN",line:'ST-COUNT-SEED',opts:[{skill:'Search',min:0,verb:'SPILL THE SEED',roll:false,run:async()=>{job.flags.seed=1;await say('','You spill it in a long trail. The tale says it has to stop and count.')}}]});
  return out},
 fights(ch,job){if(ch!=='crook-ditch')return[];return[{id:'counter-pit',spot:'F',r:1,plate:'??? L3 ☠☠☠',show:[],when:j=>!j.fights.counter&&!j.flags.coming,foes:()=>counterFoes(job),o:()=>counterO(job),pre:async()=>{},after:async(j,res)=>counterAfter(j,res)}]}};
function counterFoes(job){const hp=Math.round(48*(1-Math.min(.4,job.hpOff)));return[{name:'The Counter',base:'The Counter',kind:'Unnatural',lvl:3,hp,dex:18,hit:65,dmg:'1d6+2',sprite:'counter',faceless:true,target:true,ai:'counter',horror:{tier:'Disturbing',id:'counter'},bestiary:'counter',known:!!(ledger().bestiary.counter||{pieces:{}}).pieces.identified,weakLine:'It hunts by sound. The silent are safe.'}]}
function counterO(job){return{target:true,stunFirst:!!job.flags.muffled,foesFirstBonus:job.flags.seed?20:0,onStart:async()=>{if(job.flags.seed){await bsay('It followed the seed trail straight to you. It eats as it comes.',1400);sortTale('counter',1)}}}}
async function counterFight(job){const res=await battle(counterFoes(job),counterO(job));if(res==='lose'){await wipe();return}job.fights.counter=res;await counterAfter(job,res)}
async function counterAfter(job,res){job.fights.counter=res;if(res!=='win')return;bestiary('counter','killed',{allTales:{1:'legend',2:'legend',3:'true'}});await say('',RLT('CR-COUNT-UNDER'));
 await takeProof('counter','Its teeth',true);job.resolved=true;await payScreen('counter',{});if(job.flags.read)G.run.roughTonight=1;G.run.job=null}
