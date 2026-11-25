// Black Lantern · season.js
// The season, start to finish (spec 009): which cases a season holds, the queue that keeps six regular cases open, the
// agency cases that unlock after enough regular cases close, the finale, and the season's end. The numbers live in a
// season data file (seasons/season-N.js, loaded after this part) and are read fresh on every load, never saved.
// Loaded right after case-board.js as a plain script; the board (case-board.js) draws what this decides.
//
// A season data file calls registerSeason({n, regular:[case ids in queue order], agency:[{id, at, finale}],
//  text:{unlock:{id:[lines]}, end:[lines]}}). A Dev-only test season (seasons/test-season.js) registers as 'test'.

const SEASONS={};
function registerSeason(d){if(d&&(d.n||d.id))SEASONS[d.id||d.n]=d}
// the Dev build's test season stands in for Season 1 while it's switched on (Dev: test season on the title)
const testSeasonOn=()=>!!(window.Studio&&Studio.channel==='dev'&&SEASONS.test&&settings().testSeason);
function seasonDef(n){if(n===1&&testSeasonOn())return SEASONS.test;return SEASONS[n]||null}
// every case this season can hold: carried over first, then the season's regular cases, then unlocked agency cases
function regularIds(s){const d=seasonDef(s.season),out=[];[...(s.carried||[]),...(d?d.regular:[])].forEach(id=>{if(!out.includes(id))out.push(id)});return out}
const agencyDefs=s=>{const d=seasonDef(s.season);return d&&d.agency?d.agency:[]};
const isAgencyId=(s,id)=>agencyDefs(s).some(a=>a.id===id);
const isFinaleId=(s,id)=>agencyDefs(s).some(a=>a.id===id&&a.finale);
const isFinaleCase=id=>isFinaleId(loadSeason(),id);
function seasonCaseIds(s){return[...regularIds(s),...(s.agency||[]).map(x=>x.id)]}
// the open agency case (only one at a time), or null
function openAgency(s){const x=(s.agency||[]).find(a=>a.played&&s.cases[a.id]&&s.cases[a.id].state!=='closed'&&caseById(a.id));return x?x.id:null}
// the six card spots: a free spot takes the next open regular case from the queue
function fillSlots(s){let ch=false;if(!Array.isArray(s.slots)||s.slots.length!==6){s.slots=[null,null,null,null,null,null];ch=true}
 const queue=regularIds(s).filter(id=>caseById(id)&&s.cases[id]&&s.cases[id].state!=='closed'&&!s.slots.includes(id));
 s.slots.forEach((id,i)=>{if(!id&&queue.length){s.slots[i]=queue.shift();ch=true}});return ch}
// a closed card leaves its spot for the pile (after its stamp lands)
function clearShut(s){let ch=false;s.slots=(s.slots||[]).map(id=>{if(id&&s.cases[id]&&s.cases[id].state==='closed'){ch=true;return null}return id});return ch}
const closedList=s=>Object.entries(s.cases).filter(([id,e])=>e&&e.state==='closed').sort((a,b)=>(b[1].at|0)-(a[1].at|0)).map(([id,e])=>({id,e,c:caseById(id)}));
// the next agency case due: closed regular cases reached its count, it isn't open yet, and no other agency case is open
function agencyDue(s){if(openAgency(s))return null;
 const half=(s.agency||[]).find(a=>!a.played&&caseById(a.id));if(half)return half.id;  // unlocked, but its scene didn't finish
 const a=agencyDefs(s).find(a=>!(s.agency||[]).some(x=>x.id===a.id)&&s.closed>=a.at&&caseById(a.id));return a?a.id:null}
// the finale closed and its end screen not yet seen
function seasonOver(s){const f=agencyDefs(s).find(a=>a.finale);return!!(f&&s.cases[f.id]&&s.cases[f.id].state==='closed'&&!s.ended)}

// The arc's season tally (agency cases read it): Off the books opens once a closed case's facts say so; kept pages
// (bl.season.kept), hidden items (bl.season.hidden), and what each agency case left behind (its facts.arc).
function offBooksOpen(s=loadSeason()){return Object.values(s.cases||{}).some(e=>e&&e.state==='closed'&&e.facts&&e.facts.offBooks)}
function arcTally(s=loadSeason()){const arc={};Object.values(s.cases||{}).forEach(e=>{if(e&&e.state==='closed'&&e.facts&&e.facts.arc)Object.assign(arc,e.facts.arc)});
 return{kept:(s.kept||[]).length,hidden:(s.hidden||[]).length,arc}}
// An agency case that was walked away from leaves a mark (facts.arc.nine): until the finale, every other case opens with
// one extra SAN roll, once. The finale itself uses it instead (its own file).
async function arcNine(){const T=arcTally();if(!T.arc.nine||!G.active||G.flags.nine||isFinaleCase(G.case)||isAgencyId(loadSeason(),G.case)&&T.arc.nineFrom===G.case)return;
 G.flags.nine=1;const W=BLS.NINE;if(!W)return;await say('',W.see[(G.case||'').length%W.see.length]);
 await BLF.horror({id:'nine',tier:'unsettling',kind:'unnatural',label:W.label,all:true})}

// ---- what the board plays when it opens: the closed card's slide, an agency unlock, the season's end ----
async function boardIntro(){
 if(!CB)return;const me=CB;me.busy=true;try{await introSteps()}finally{me.busy=false}}
async function introSteps(){
 // the board can be left (B) while this plays; each step after a wait checks it's still the same board
 if(CB.stamp){await sleep(1250);if(!CB||CB.busy!==true)return;const s=loadSeason();if(clearShut(s)|fillSlots(s)){store.set(seasonKey(),s);CB.drop={t0:performance.now()}}CB.stamp=null;CB.sel=Math.min(CB.sel,boardTargets(boardLayout()).length-1)}
 else{const s=loadSeason();if(clearShut(s)|fillSlots(s))store.set(seasonKey(),s)}
 let s=loadSeason();
 if(seasonOver(s)){CB.end={t0:performance.now()};const d=seasonDef(s.season);await sleep(400);if(!CB)return;
  for(const l of [].concat((d&&d.text&&d.text.end)||[]))await say('BIG HAT',l);return}
 const due=agencyDue(s);
 if(due){if(!s.agency.some(a=>a.id===due))s.agency.push({id:due,played:false});const c=caseById(due);
  if(!s.cases[due])s.cases[due]={file:c.card.file,state:'open',ending:null};store.set(seasonKey(),s);
  const d=seasonDef(s.season),lines=(d&&d.text&&d.text.unlock&&d.text.unlock[due])||c.unlock||[];  // the case's own stand-in lines until the season data has them
  await sleep(300);if(!CB)return;for(const l of [].concat(lines))await say('BIG HAT',l);
  s=loadSeason();const x=s.agency.find(a=>a.id===due);if(x)x.played=true;store.set(seasonKey(),s);
  if(!CB)return;CB.thud={t0:performance.now()};const t=boardTargets(boardLayout());CB.sel=Math.max(0,t.findIndex(x=>x.id===due))}
}
// A on the season end screen: the next season begins. Overstepping goes back to Clean; open regular cases carry over,
// first in the queue; everyone's survived-case count starts over, except where an arc is still running (spec 008, A2).
function nextSeason(){
 const s=loadSeason(),mem=memorial().filter(x=>x.season===s.season).length,steps=BLS.OVERSTEP.open;
 const agencyShut=(s.agency||[]).filter(a=>s.cases[a.id]&&s.cases[a.id].state==='closed').length;
 s.ended=true;store.set(seasonKey(),s);
 const past=(s.past||[]).concat([{season:s.season,closed:s.closed,agency:agencyShut,lost:mem,step:steps[Math.min(s.overstep|0,steps.length-1)]}]);
 const carried=regularIds(s).filter(id=>s.cases[id]&&s.cases[id].state!=='closed');
 const n=freshSeason(s.season+1);n.past=past;n.carried=carried;carried.forEach(id=>{n.cases[id]=Object.assign({},s.cases[id])});
 store.set(seasonKey(),n);
 const R=B.S.roster||[];R.forEach(a=>{const run=a.arc&&a.arc.beat>0&&a.arc.beat<3&&!a.arc.over;if(!run){a.sc=0;if(a.arc&&a.arc.beat>=3)a.arc=null;else if(a.arc)a.arc.base=0}});
 store.set(B.key('roster'),R);
 const s2=loadSeason();fillSlots(s2);store.set(seasonKey(),s2);
}
// Dev only (spec 014, Playing it on Dev): Start on the board opens a small Dev menu that pins the season's next built
// agency case straight away, through its real unlock scene and thud. Release builds never reach it (Studio.channel).
async function devPinAgency(){
 if(!CB||CB.busy||!(window.Studio&&Studio.channel==='dev'))return;
 const s=loadSeason(),a=agencyDefs(s).find(a=>!(s.agency||[]).some(x=>x.id===a.id)&&caseById(a.id)),W=BLS.BOARD;
 if(!a||openAgency(s)){B.toast(W.devNone);return}
 const c=caseById(a.id),name=`${W.lantern} ${String(c.card.file).padStart(2,'0')}`;
 const r=await ask('',W.devQ,[fillT(W.devPin,{n:name}),W.devClose]);if(r!==0||!CB)return;
 s.agency.push({id:a.id,played:false});store.set(seasonKey(),s);await boardIntro()}
