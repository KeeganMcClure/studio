// Rushlight · ledger.js
// Slice part E (spec 007): how a run ends.
//   Lowmoor Pit: the den, its hotspots and the prep away from it (a church-lit lamp, a mass for his soul), the shaft
//   down (committed), the Hollow Monk's fight (The hill falls, Lamp out, rising once, Greet him, lighting a lamp), the
//   kill, the nickname, the pay screen with no fee, the end card, and the ledger.
//   A merc's death: the death line, comrades' SAN rolls, the kit to the pack, the ledger line, the empty seat, and the
//   body: buried at a church (1d4 SAN to each survivor) or left in a ditch (a Disturbing helplessness roll for each).
//   The ledger in rl.ledger (one entry per company, one line per merc), the death screen on a wipe, and the ledger screen.
// Loaded after site.js as a plain script.

// ================= THE DEN =================
BEAST_TEXT.monk={desc:'CR-MONK-DESC',signs:['CR-MONK-SIGN-1','CR-MONK-SIGN-2','CR-MONK-SIGN-3','CR-MONK-SIGN-4'],tales:['CR-MONK-TALE-1','CR-MONK-TALE-2','CR-MONK-TALE-3'],under:'CR-MONK-UNDER',kind:'the Hollow Monk',nature:'Bound',weak:'Greet him rightly, and keep a church-lit lamp burning.',trophy:'His lamp, which never goes out.'};
JOBS.monk={title:'THE HOLLOW MONK',town:'',by:'none',kind:'great creature',shape:'great creature',pay:0,site:'pit',tags:[],threat:{kind:'Unnatural',lvl:4},xp:200};
// the den opens once 3 signs show Lowmoor Pit (region.js); its own state lives in rl.run.den
async function openDen(){const r=G.run;if(!denFound())return false;r.den=r.den||{pumps:false,greeting:false,greeter:null,lamp:false,mass:false,risen:false,shut:-1};
 if(!r.job||r.job.id!=='monk'){r.contracts.push({id:'monk',title:'THE HOLLOW MONK',next:RLT('ST-MONK-NEXT'),day:r.day});}
 await startSite('monk');return true}
JOB_SCRIPTS.monk={site:'pit',next0:'ST-MONK-NEXT',
 init(job){job.tod='night';job.great=true},
 async arrive(job){bestiary('monk','sighted',{name:'The Hollow Monk'})},
 hotspots(ch,job){const out=[],D=G.run.den;
  if(ch==='pit-head')out.push({id:'pumps',spot:'p',title:'THE PUMP HOUSE',opts:[{skill:'Craft',min:0,verb:'RESTART THE PUMPS',failLine:null,run:async()=>{D.pumps=true;job.prep.push('The pumps are running (−15% HP, and he can\'t rise).');await say('',RLT('ST-MONK-PUMPS'))}}]});
  if(ch==='pit-row'){out.push({id:'miner',spot:'d',title:'THE ONE OPEN DOOR',when:()=>D.shut!==G.run.day,opts:[{skill:'Empathy',min:0,verb:'TALK THROUGH THE DOOR',run:async()=>{D.greeting=true;job.prep.push('You know the greeting.');await say('',RLT('ST-MONK-MINER'));sortTale('monk',1)}}]});
   out.push({id:'lamps',spot:'s',title:'LAMPS IN A SEALED GALLERY',opts:[{skill:'Search',min:0,verb:'SEARCH',run:async()=>{if(!RG().signs.includes('CR-MONK-SIGN-1'))await monkSign('CR-MONK-SIGN-1');else{await say('',RLT('CR-MONK-SIGN-1'));await sanRoll('Unsettling','unnatural',{id:'monk-lamps',who:'lead',label:'The lamps'})}}}]})}
  if(ch==='pit-house')out.push({id:'books',spot:'b',title:'THE RECKONING HOUSE',opts:[
   {skill:'Letters',min:40,verb:'READ THE SHIFT BOOK',run:async()=>{D.greeting=true;job.prep.push('You know the greeting.');await say('',RLT('ST-MONK-RECORDS'));sortTale('monk',3)}},
   {skill:'History',min:40,verb:'READ THE SHIFT BOOK',run:async()=>{D.greeting=true;job.prep.push('You know the greeting.');await say('',RLT('ST-MONK-RECORDS'));sortTale('monk',3)}}]});
  if(ch==='pit-shaft')out.push({id:'down',spot:'h',title:'THE SHAFT HEAD',opts:[{skill:'Search',min:0,verb:'GO DOWN · NO COMING BACK',roll:false,run:async()=>{
   await say('',RLT('ST-MONK-DOWN'));await sanRoll('Disturbing','unnatural',{id:'monk-down',who:'lead',label:'Going down'});await monkFight(job)}}]});
  return out},
 fights(){return[]},
 cache:['rope','rope','salt','rushbundle','willow']};
// a failed Empathy at the miner's door shuts it until tomorrow; a failed Craft at the pumps costs a day's work
const _hotspotD1=hotspot;
hotspot=async function(h){const job=G.run.job,D=G.run.den;await _hotspotD1(h);
 if(job&&job.id==='monk'&&job.used[h.id]&&job.used[h.id].fail!=null){if(h.id==='miner'){D.shut=G.run.day;await say('','He shuts the door. Maybe tomorrow.')}if(h.id==='pumps'){G.run.day++;await eatDay();job.used.pumps=undefined;await say('','A day of work on the pumps, and they don\'t catch. You can try again.')}}};
// the church-lit lamp and the mass for his soul, at either church (spec 007, 1)
function churchRowsE(k){const r=G.run;if(!denFound())return[];const free=facStep('church')>=3;
 return[{label:`Light a lamp from the church candle (${free?'free':'10 gr'})`,dis:!free&&r.purse<10||(r.den&&r.den.lamp)},{label:'A mass for his soul (10 gr)',dis:r.purse<10||(r.den&&r.den.mass)}]}
async function churchActE(k,i){const r=G.run;r.den=r.den||{};
 if(i===0){if(facStep('church')<3)r.purse-=10;r.den.lamp=true;const m=party.filter(p=>!p.dead).sort((a,b)=>a.slots.length-b.slots.length)[0];m.slots.push({id:'churchlamp',n:1,name:'Church-lit lamp'});
  RLS.ITEMS.churchlamp=RLS.ITEMS.churchlamp||{id:'churchlamp',name:'Church-lit lamp',type:'Gear',uses:0,desc:'Lit from the church candle. While it burns, the Lamp out does nothing.'};
  (G.run.job||{prep:[]}).prep&&G.run.job&&G.run.job.prep.push('A church-lit lamp.');await say('',`The priest lights it from the altar candle and hands it to ${m.name}. It takes a slot.`)}
 else if(i===1){r.purse-=10;r.den.mass=true;sortTale('monk',2);await say('','The priest says the mass for a monk nobody walled up. He takes the coin all the same.')}}
// ---- the fight in the flooded gallery ----
FOE_AI.monk={async turn(e){const r=R_.die(4);
  if(r===1){await areaAttack(e,'The hill falls. Stone comes down on all of you.');party.filter(m=>!m.dead).forEach(m=>{const b=m.gear.body;if(b)b.wear=Math.min(3,(b.wear|0)+1)});return true}
  if(r===2&&!Bt.lampOut){if(party.some(m=>!m.dead&&m.slots.some(s=>s.id==='churchlamp'))){await bsay('His lamp gutters. The church-lit lamp doesn\'t.',1200);return true}
   Bt.lampOut=true;await bsay('Lamp out. The dark comes in all at once.',1200);await sanRoll('Disturbing','unnatural',{id:'monk-lampout-'+Bt.round,label:'The dark'});return true}
  // the greeted merc isn't attacked until they strike him; area attacks still reach them
  const t=pickTarget(e,{skip:m=>m===Bt.greeted&&!m.struck});if(!t)return true;await foeAttack(e,t);return true},
 async onHurt(e,m){if(m===Bt.greeted)m.struck=true}};
async function monkFight(job,resume){const r=G.run,D=r.den;
 if(!resume){enterChunkGallery();await say('',RLT('CR-MONK-DESC'))}
 const hp=Math.round(78*(D.pumps?.85:1));
 const M={name:'The Hollow Monk',base:'The Hollow Monk',kind:'Unnatural',lvl:4,hp,dex:12,hit:60,dmg:'1d4+2',sprite:'monk',target:true,great:true,ai:'monk',onHurt:true,onZero:true,horror:{tier:'Severe',id:'monk'},bestiary:'monk',known:!!(ledger().bestiary.monk||{pieces:{}}).pieces.identified,weakLine:'Greet him rightly. A church-lit lamp keeps him off.'};
 const res=await battle(resume?null:[M],{resume,target:true,great:true,setFight:true,key:'monk',bg:'night',
  extraMoves:m=>[...(D.greeting&&!Bt.greetUsed?[{label:'Greet him',right:'the turn',run:async(mm)=>{Bt.greetUsed=true;Bt.greeted=mm;mm.struck=false;await bsay(RLT('ST-MONK-GREET',{merc:mm.name}),1600)}}]:[]),
   ...(Bt.lampOut&&m.slots.some(s=>['torch','lantern','rushbundle'].includes(s.id))||Bt.lampOut&&(m.gear.w1&&m.gear.w1.id==='torch')?[{label:'Light a lamp',right:'the turn',run:async(mm)=>{Bt.lampOut=false;await bsay(`${mm.name} gets a light going. The dark backs off.`,1100)}}]:[])]});
 if(res==='lose'){await wipe();return}
 await monkKilled(job)}
function enterChunkGallery(){const job=G.run.job;if(!job.chunks.includes('pit-gallery'))job.chunks.push('pit-gallery');enterChunk(job.chunks.indexOf('pit-gallery'),'left')}
// he rises once at half his full HP, unless the pumps run
FOE_AI.monk.onZero=async function(e,by){if(G.run.den.pumps||e.risen)return false;e.risen=true;G.run.den.risen=true;e.hp=Math.round(78/2);e.mhp=Math.max(e.mhp,e.hp);await bsay(RLT('ST-MONK-RISE'),1700);return true};
async function monkKilled(job){const r=G.run,killer=Bt&&Bt.active||null,last=(G.lastStats||{});
 bestiary('monk','killed',{allTales:{1:'true',2:'legend',3:'true'}});await say('',RLT('ST-MONK-KILL'));
 const by=party.find(m=>m.id===r.monkKiller)||party.filter(m=>!m.dead)[0];if(by){by.nick=(by.nick||[]).concat([RLT('NM-NICK-MONK')]);await say('',`${by.name} lands the last blow. The others start calling them ${RLT('NM-NICK-MONK')}.`)}
 addTrophy({id:'tr-monk',name:'The Hollow Monk\'s lamp',trophy:true,unnatural:true});
 job.resolved=true;await payScreen('monk',{noFee:true,xp:200,keep:true});r.great=(r.great|0)+1;
 await say('',RLT('ST-MONK-END'));
 await endRun('end');}

// ================= DEATH, BURIAL AND THE DITCH =================
// called by sanity.js's mercGone for every merc who leaves the company for good
async function onMercGone(m,end,o){const r=G.run;
 const line={name:m.name,nick:(m.nick||[]).slice(),end,place:m.endPlace||'',killer:m.killer||'',owed:''};
 r.lines=r.lines||{};r.lines[m.id]=line;
 if(end==='LG-END-FIGHT'||end==='LG-END-BLEED'||end==='LG-END-SNAP'||end==='LG-END-STARVE'){
  if(end!=='LG-END-SNAP'){await say('',RLT('VO-NARR-DEATH-1',{merc:m.name}).replace(/ The priest charged extra for the frost\./,''));
   // the body: carried to a church for burial, or left in a ditch by the end of the next contract
   r.bodies=r.bodies||[];r.bodies.push({id:m.id,name:m.name,by:(r.done|0)+1,with:party.filter(p=>!p.dead&&p!==m).map(p=>p.id)})}
  // comrades who saw it: Severe violence, or Shattering if Close (a merc lost to 0 SAN out of sight costs no roll)
  if(!Bt&&end!=='LG-END-SNAP')for(const p of party.filter(p=>!p.dead&&p!==m))await sanRoll(isClose(p,m)?'Shattering':'Severe','violence',{who:[p],label:`${p.name} saw ${m.name} die`});
 }
 // hire pools refresh when a seat opens (spec 005, 4)
 Object.keys(TOWNS).forEach(t=>r.hires[t]=rollPool(r,t));
 if(party.every(p=>p.dead)&&!Bt)await wipe();
}
// Burial at either church: 10 gr, 5 at Church Trusted; 1d4 SAN to every survivor who was with them; LG-BURIED
function churchRowsBury(){const b=G.run.bodies||[];return b.map(x=>({label:`Bury ${x.name} (${facStep('church')>=3?5:10} gr)`,dis:G.run.purse<(facStep('church')>=3?5:10)}))}
async function bury(i,k){const r=G.run,b=r.bodies[i],cost=facStep('church')>=3?5:10;r.purse-=cost;r.bodies.splice(i,1);
 await say('',RLT('LG-BURIED-LINE'));const got=[];for(const p of party.filter(p=>!p.dead&&b.with.includes(p.id))){const s=StudioRoll.die(4);p.san=Math.min(p.msan,p.san+s);got.push(`${p.name} +${s}`)}
 if(got.length)await say('',`SAN: ${got.join(', ')}.`);r.lines[b.id].owed=RLT('LG-BURIED',{church:TOWNS[k].name==='HARROWFORD'?'Harrowford':"Saint Ebbe's"});applySan();saveRun()}
async function ditch(b){const r=G.run;r.lines[b.id].owed=RLT('LG-DITCH');
 for(const p of party.filter(p=>!p.dead&&b.with.includes(p.id)))await sanRoll('Disturbing','helplessness',{who:[p],label:`Nobody went back for ${b.name}`})}
// a body not buried by the end of the next contract is left
const _payD=payScreen;
payScreen=async function(id,o={}){await _payD(id,o);const r=G.run;if(!r.bodies)return;const due=r.bodies.filter(b=>(r.done|0)>=b.by&&id!=='monk');for(const b of due){r.bodies.splice(r.bodies.indexOf(b),1);await ditch(b)}};
// the church rows: burials, then the den's lamp and mass
const _churchRowsE=churchRowsE,_churchActE=churchActE;
churchRowsE=k=>[...churchRowsBury(),..._churchRowsE(k)];
churchActE=async(k,i)=>{const n=(G.run.bodies||[]).length;if(i<n)return bury(i,k);return _churchActE(k,i-n)};
// the Contracts page: the dead, with a Bury row while a church is in reach
const _drawCE=drawContractsExtra;
drawContractsExtra=function(y){y=_drawCE(y);const b=G.run.bodies||[];if(!b.length)return y;pT('THE DEAD',8,y+4,PAL.tallow,8,PXf);y+=16;
 b.forEach(x=>{pT(`${x.name} · bury by the end of the next job${G.town?' · at the church':''}`,8,y,PAL.bone,13);y+=12});return y};

// ================= THE LEDGER =================
// one entry per company, newest first: name, seed, how far, how it ended, and one line per merc who served
function lineText(l){const nm=l.nick&&l.nick.length?RLT('LG-NAME',{name:l.name,nicknames:l.nick.join(', ')}):`${l.name}.`;
 const k=l.killer||'',killer=!k?'something with no name':/^The /.test(k)?k.replace(/^The /,'the '):['Severa','Pell'].includes(k)?k:'a '+k.toLowerCase().replace(/ [a-d]$/,'');
 const end=RLT(l.end||'LG-LIVING',{killer,place:l.place||'the road'});return `${nm} ${end}${l.owed?' '+l.owed:''}`}
function companyEntry(how){const r=G.run;r.lines=r.lines||{};
 const mercs=(r.joined||[]).map(j=>{const m=party.find(p=>p.id===j.id)||{};const l=r.lines[j.id]||{name:j.name,nick:(m.nick||[]).slice(),end:how==='end'?'LG-LIVING':how==='abandoned'?'LG-END-LEFT':'LG-END-FIGHT',place:placeName(),killer:m.lastBy?m.lastBy.base:'',owed:''};
  if(!r.lines[j.id]&&m.nick)l.nick=m.nick.slice();return l});
 return {name:r.company&&r.company.name||'The company',seed:r.seed,end:how,regions:0,contracts:r.done|0,great:r.great|0,days:r.day|0,where:placeName(),mercs}}
async function endRun(how){const r=G.run,L=ledger();L.companies=L.companies||[];
 // bodies still waiting are left (the company leaves the March)
 if(how==='end'&&r.bodies)for(const b of r.bodies.splice(0))await ditch(b);
 L.companies.unshift(companyEntry(how));saveLedger(L);
 r.ended=true;store.set(B.key('run'),how==='end'?r:null);G.run.ended=true;
 leave();B.S.ledgerOpen={company:0,from:how};B.goto(how==='wipe'?'death':'ledger');B.render()}
// a wipe: the death screen, then the ledger (rl.run is cleared; the bestiary and ledger stay)
async function deathScreen(){await endRun('wipe')}
