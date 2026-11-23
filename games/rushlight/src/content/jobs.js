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
