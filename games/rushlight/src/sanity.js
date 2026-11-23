// Rushlight · sanity.js
// The carried Sanity rules (bible Carried rules: Sanity, SAN loss table, Disorders; Systems: Bonds), slice part D (spec 006, 3):
// a SAN roll at a tier and kind, once per horror per contract; bracing; Steadying; Adapted marks; Breaking Points with a
// disorder, giving up a motivation or leaning on a Bond; 0 SAN; and what happens when a merc dies.
// Loaded after battle.js; shares the engine's party, say, choose and the run.
const TIERS={Unsettling:['0','1'],Disturbing:['0','1d4'],Severe:['1','1d6'],Shattering:['1d4','1d8'],Boss:['1d6','1d10']};
const DISORDERS={violence:['PTSD','Sleep disorder'],helplessness:['Depression','Sleep disorder'],unnatural:['Paranoia','Phobia']};
const ALL_DIS=['PTSD','Paranoia','Phobia','Depression','Sleep disorder'];
const sanDice=s=>/d/.test(s)?rollDice(s):+s;
// who's in it: everyone (battles, cutscenes) or only the lead (the map)
// o: {id (once per horror per contract), brace:Set of braced mercs, who:'all'|'lead'|[mercs], label, quiet}
async function sanRoll(tier,kind,o={}){
 const r=G.run,job=r&&r.job,seen=job?(job.horrors=job.horrors||{}):(G.horrors=G.horrors||{});
 const who=Array.isArray(o.who)?o.who:o.who==='lead'?[lead()]:party.filter(m=>!m.dead);
 const T=TIERS[tier],lines=[];
 for(const m of who){if(m.dead||m.snapped)continue;
  const key=(o.id||tier+kind)+':'+m.id;if(o.id&&seen[key])continue;if(o.id)seen[key]=1;
  if(kind!=='unnatural'&&m.adapt&&m.adapt[kind==='violence'?'V':'H']){const pass=sanDice(T[0]);if(pass)await loseSan(m,pass,kind,lines);continue}
  if(o.relic&&m.slots&&m.slots.some(s=>s.id==='relic')&&o.sight&&!m.relicUsed){m.relicUsed=1;useSlot(m,'relic');lines.push(`${m.name} holds the relic. Nothing gets in.`);continue}
  const roll=StudioRoll.pct(m.san);let loss=sanDice(roll.ok?T[0]:T[1]);
  // one halving per horror: bracing, Steadying, or Seen it in the books (Occult 90% against what they've Identified)
  let halved=false;if(o.brace&&o.brace.has(m)){loss=Math.floor(loss/2);halved=true}
  if(!halved&&o.known&&(m.sk.Occult||0)>=90){loss=Math.floor(loss/2);halved=true}
  if(!roll.ok&&loss>0&&!halved){const st=steadier(m);if(st){const s=StudioRoll.pct(st.sk.Empathy+(isClose(st,m)?20:0));if(s.crit){loss=0;lines.push(`${st.name} steadies ${m.name}: nothing lost.`)}else if(s.ok){loss=Math.floor(loss/2);lines.push(`${st.name} steadies ${m.name}.`)}}}
  if(m.st.includes('Drunk'))loss=Math.max(0,loss-1);
  if(o.halveFor&&o.halveFor===m)loss=Math.floor(loss/2);
  await loseSan(m,loss,kind,lines,!roll.ok)}
 if(lines.length&&!o.quiet)await sanSay(`${o.label?o.label+'. ':''}${lines.join(' ')}`);
 applySan();
}
function steadier(m){return party.filter(p=>p!==m&&!p.dead&&!p.ko&&!p.snapped&&(p.sk.Empathy||0)>=40).sort((a,b)=>b.sk.Empathy-a.sk.Empathy)[0]}
const isClose=(a,b)=>(a.bonds&&a.bonds[b.id]||0)>=Math.ceil((a.stats.CHA||10)*2/3);
async function loseSan(m,loss,kind,lines,failed){
 if(!(loss>0)){lines.push(`${m.name} holds.`);return}
 m.san=Math.max(0,m.san-loss);m.sanLost=(m.sanLost|0)+loss;if(G.run&&G.run.job){G.run.job.sanLost=G.run.job.sanLost||{};G.run.job.sanLost[m.id]=(G.run.job.sanLost[m.id]|0)+loss}
 lines.push(`${m.name} −${loss} SAN.`);
 // Adapted: violence and helplessness marks (3 makes the merc Adapted; it costs every Bond 1); the unnatural never adapts
 if(kind!=='unnatural'){const k=kind==='violence'?'v':'h';m.adapt=m.adapt||{v:0,h:0};m.adapt[k]=(m.adapt[k]|0)+1;
  if(m.adapt[k]>=3&&!m.adapt[k.toUpperCase()]){m.adapt[k.toUpperCase()]=1;m.kin.bond=Math.max(0,m.kin.bond-1);Object.keys(m.bonds).forEach(b=>m.bonds[b]=Math.max(0,m.bonds[b]-1));lines.push(`${m.name} has seen enough ${kind} that it stops landing. Every Bond pays 1 for it.`)}}
 if(m.san<=0){await zeroSan(m);return}
 if(m.san<=m.bp)await breakingPoint(m,kind);
}
async function sanSay(t){if(Bt)await bsay(t,1500);else await say('',t,{auto:G.auto&&G.auto.menu?1:undefined})}
// A Breaking Point: Shaken, then a disorder, a motivation given up, or a Bond leaned on; the point resets to SAN − POW
async function breakingPoint(m,kind){
 if(!m.st.includes('Shaken'))m.st.push('Shaken');
 const pool=DISORDERS[kind]||DISORDERS.unnatural,has=m.dis||[];
 const opts=[{label:'Take the scar (a disorder)'}];
 if(m.mot.length)opts.push({label:`Give up ${m.mot[m.main]||m.mot[0]} for good`});
 const bonds=[[`kin: ${m.kin.name}`,()=>m.kin.bond,v=>m.kin.bond=v],...party.filter(p=>p!==m&&!p.dead).map(p=>[p.name,()=>m.bonds[p.id]||0,v=>m.bonds[p.id]=v])];
 opts.push({label:'Lean on a Bond',dis:!bonds.some(b=>b[1]()>1)});
 if(Bt)await bsay(`${m.name} hits a Breaking Point.`,1200);else await say('',`${m.name} hits a Breaking Point.`);
 const c=G.auto&&G.auto.menu?0:await choose(opts,{title:`${m.name.toUpperCase()} · BREAKING POINT`});
 if(c===1&&m.mot.length){const gone=m.mot.splice(m.main<m.mot.length?m.main:0,1)[0];m.main=0;await sanSay(`${m.name} lets go of ${gone}. It doesn't come back.`)}
 else if(c===2){const ok=bonds.filter(b=>b[1]()>1);const k=await choose(ok.map(b=>({label:`${b[0]} (${b[1]()})`})),{title:'LEAN ON WHO?'});const b=ok[Math.max(0,k)];b[2](Math.max(1,b[1]()-StudioRoll.die(6)));await sanSay(`${m.name} leans on ${b[0].replace('kin: ','')}. It holds, this time.`)}
 else{let d=pool[StudioRoll.die(2)-1];if(has.includes(d))d=pool.find(x=>!has.includes(x))||ALL_DIS.find(x=>!has.includes(x));if(d){m.dis=has.concat([d]);await sanSay(`${m.name} comes out of it with ${d}.`)}}
 if(kind==='violence'||kind==='helplessness')m.adapt[kind==='violence'?'v':'h']=0;
 m.bp=m.san-m.stats.POW;
}
// 0 SAN: out of a fight, one straight line and they leave; in a fight they snap (battle.js plays it)
async function zeroSan(m){if(Bt){m.snapped=true;m.ko=false;await bsay(`${m.name} snaps. Nobody is steering now.`,1400);return}
 await say('',`${m.name} stands up from the fire, walks out past the light, and keeps walking.`);await mercGone(m,'LG-END-SNAP')}
// A merc leaves the company for good: dead, snapped, deserted or retired. Their seat empties; their kit goes to the pack.
async function mercGone(m,end,o={}){
 if(m.goneDone)return;m.goneDone=1;m.dead=true;m.ko=false;m.end=end;m.endPlace=o.place||placeName();m.killer=o.killer||'';
 const r=G.run;['w1','w2','body','head'].forEach(s=>{const it=m.gear[s];if(it&&(end!=='LG-END-DESERT'))r.pack.push({id:it.id,n:1,wear:it.wear|0})});
 if(end!=='LG-END-DESERT')m.slots.forEach(s=>r.pack.push({id:s.id,n:s.n||1}));
 m.slots=[];if(end!=='LG-END-DESERT')m.gear={w1:null,w2:null,body:null,head:null,hand:'w1'};
 if(typeof onMercGone==='function')await onMercGone(m,end,o);
 if((G.lead|0)===party.indexOf(m)){const n=StudioParty.next(party.length,G.lead|0,i=>!party[i].dead&&!party[i].ko);G.lead=n}
 saveRun()}
const niceName=n=>n===n.toUpperCase()?n.charAt(0)+n.slice(1).toLowerCase().replace(/ (e|s)/g,(m)=>m.toUpperCase()).replace("saint ebbe's","Saint Ebbe's"):n;
const placeName=()=>{const g=G.run&&G.run.region,j=G.run&&G.run.job;if(j&&JOBS[j.id]&&P_[JOBS[j.id].site])return niceName(P_[JOBS[j.id].site].name);if(g&&g.trip)return 'the road to '+niceName(P_[g.trip.to].name);return g?niceName(P_[g.at].name):'the road'};
function useSlot(m,id){const s=m.slots.find(x=>x.id===id);if(!s)return false;if(RLS.ITEMS[id]&&RLS.ITEMS[id].uses===0)return true;s.n=(s.n||1)-1;if(s.n<=0)m.slots.splice(m.slots.indexOf(s),1);
 G.run.restock=G.run.restock||{};G.run.restock[id]=(G.run.restock[id]|0)+1;return true}
