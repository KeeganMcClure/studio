// Black Lantern · creator.js
// The agent creator plus the shared shell (buttons, keyboard, portraits). Exposes window.BL.
// Needs strings.js loaded first.
// Flow (Bible: Agents and items, Agent creator): New game → Pick a team (6 templates + Blank team) → Your team
// (3 seats: Keep, Tweak or Rebuild each) → Start. Rebuild runs the full 7-step creator for that seat:
// Job, Stats, Skills, Identity, Bonds, Motivations, Dossier. Tweak runs only Identity, Bonds, Motivations, Dossier.
(()=>{
// ---------- DATA (text lists come from strings.js) ----------
const {SKILLS,SKILLJOB,PROFS,TEAMS,STATS,STATNAME,FEAT,RELS,RELTXT,FIRST,MOTIVES,MOTTXT,ADJ,NOUN,HAIRCN,HAIRS,EYES,EYEC,ACC,OUTCN,CREEP,ITEMDEF,WEAP,WEAPTXT,STEPNAME,STEPSHORT,STATJOB,HOBBY}=window.BLS;
const SKIN=['#f6d7b8','#e9b98f','#c98e62','#a26a43','#7a4a2c','#4e2f1f'];
const HAIRC=['#1b1414','#4a2c1a','#8a5a2b','#d8b25a','#b94a2c','#9aa0a6','#ece8de'];
const OUTC=['#2d3a5c','#3e5c3a','#7a2e3e','#4b3b6e','#8a7a52','#232326','#4f87a3'];
const IRIS=['#6b4426','#8a6a2e','#4a7a4e','#3f6fa8','#7a8494'];
const STEPS=['profession','stats','skills','identity','bonds','motives','dossier'];
const TWEAKABLE=['identity','bonds','motives','dossier'];  // Tweak: name, face, backstory, Bond names, motivations
const profOf=a=>PROFS.find(p=>p.id===(a&&a.prof));
// Today's engine reads kit items and weapon through specOf; the profession's stand-in pack fills it until the Demo 5 item rules.
const specOf=a=>{const p=profOf(a);return p?{items:p.pack,weapon:p.weapon}:null};

// ---------- STATE ----------
const rnd=n=>Math.floor(Math.random()*n), pick=a=>a[rnd(a.length)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clone=o=>JSON.parse(JSON.stringify(o));
const roll4d6=()=>{const r=[1,2,3,4].map(()=>1+rnd(6)).sort((a,b)=>a-b);return r[1]+r[2]+r[3]};
const rollStats=()=>Object.fromEntries(STATS.map(k=>[k,roll4d6()]));
const genCode=()=>pick(ADJ)+' '+pick(NOUN);
function newAgent(){return {prof:null,method:'buy',stats:Object.fromEntries(STATS.map(k=>[k,12])),roll:null,picks:{},bonds:[{rel:'Partner',name:''},{rel:'Friend',name:''}],look:{skin:1,hair:0,hairC:1,eyes:0,eyeC:0,acc:0,outfitC:-1},name:'',code:genCode(),backstory:'',age:34,motives:[],main:0}}
let idN=0;const newId=()=>Date.now()*10+(idN++%10);
function fromTemplate(t){const a=Object.assign(newAgent(),clone(t));a.id=newId();a.method='set';a.roll=null;a.bonds.forEach(b=>b.score=a.stats.CHA);return a}
function setProf(a,p){if(a.prof!==p.id)a.picks={};a.prof=p.id}
const derived=a=>{const s=a.stats;return{HP:Math.ceil((s.STR+s.CON)/2),WP:s.POW,SAN:s.POW*5,BP:s.POW*4}};
function skillVal(a,k){if(!(k in SKILLS))return 0;const p=profOf(a);return Math.max(SKILLS[k],(p&&p.skills[k])||0)+20*((a.picks||{})[k]||0)}
const picksUsed=a=>Object.values(a.picks).reduce((x,y)=>x+y,0);
const buyLeft=a=>72-STATS.reduce((t,k)=>t+a.stats[k],0);
const feature=(k,v)=>v<=5?FEAT[k][0]:v>=16?FEAT[k][1]:'';
const surname=a=>((a.name||'').trim().split(/\s+/).pop()||'Agent').toUpperCase();
const mainOf=a=>a.motives[a.main]||a.motives[0]||'';

// Save keys start with bl. on Release and dev.bl. on Dev (engine/studio.js), so testing never touches the
// stable saves. Outside the site (the Intake page, the checks) there is no Dev build, so it stays bl.
const BLP=window.Studio?Studio.savePrefix('bl.'):'bl.',K=k=>BLP+k;
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};

// ---------- SAVE VERSIONS ----------
// bl.version holds the save version. On load, every upgrade step above the stored version runs
// in order, bringing old saves forward before anything reads them. Before upgrading, the old
// saves are copied to bl.backup. Rules: never change an old step; a new save shape gets a new
// step and SAVE_V goes up by one. Saves from before numbering count as version 0.
const SAVE_V=2;
const fillAgent=a=>{if(!a||typeof a!=='object'||Array.isArray(a))return null;const d=newAgent();
  const o=Object.assign(d,a);o.look=Object.assign(newAgent().look,a.look||{});o.stats=Object.assign(newAgent().stats,a.stats||{});
  if(!o.picks||typeof o.picks!=='object')o.picks={};if(!Array.isArray(o.bonds))o.bonds=[];if(!Array.isArray(o.motives))o.motives=[];return o};
// Step 2 (Nov 21, Demo 1 agent creator): old professions, the 40 skills, up to 4 Bonds and free-text motivations
// move to the new rules. Name, face and stats stay; each agent takes the nearest new profession.
const OLDPROF={fed:'investigator',doc:'medic',sci:'scientist',ops:'shooter',occ:'occultist',hack:'hacker',cop:'bodyguard',medic:'cmedic',ranger:'ranger',priest:'therapist',mail:'reporter',mort:'funeral',jan:'exterminator',truck:'talker'};
const OLDSKILL={'Firearms':'Firearms','Heavy Weapons':'Firearms','Military Science':'Firearms','Melee Weapons':'Melee','Unarmed Combat':'Melee','Dodge':'Dodge','Search':'Search','Alertness':'Search','Forensics':'Forensics','Criminology':'Forensics','Occult':'Occult','History':'History','Anthropology':'History','Archeology':'History','Foreign Language':'History','Science':'Science','HUMINT':'Empathy','Psychotherapy':'Empathy','Persuade':'Persuade','Bureaucracy':'Bureaucracy','Law':'Bureaucracy','Accounting':'Bureaucracy','Athletics':'Athletics','Swim':'Athletics','Stealth':'Stealth','Disguise':'Stealth','Survival':'Survival','Navigate':'Survival','First Aid':'First Aid','Medicine':'Medicine','Surgery':'Medicine','Pharmacy':'Medicine','Computer Science':'Computers','SIGINT':'Computers','Craft':'Craft','Demolitions':'Craft'};
const OLDREL={Spouse:'Partner',Partner:'Partner',Child:'Kid',Parent:'Parent',Sibling:'Sibling','Best friend':'Friend',Ex:'Ex','Old partner':'Coworker',Mentor:'Mentor',Neighbor:'Friend',Roommate:'Friend',Bandmate:'Friend',Therapist:'Mentor',Coworker:'Coworker',Sponsor:'Mentor'};
const OLDMOT={'Protect my kid':'Family','Make it to retirement':'Money','Find out what happened to my brother':'Find the truth','Prove I\'m not crazy':'Find the truth','Finish my novel':'Curiosity','See the Grand Canyon':'Curiosity','Win the county chili cook-off':'Curiosity','Keep the dog alive':'Protect the innocent','Make Mom proud':'Family','Learn the truth':'Find the truth','Never be afraid again':'Redemption','Get even':'Revenge','Fix what I broke':'Redemption','Be somebody\'s hero':'Protect the innocent','Pay off the house':'Money','Stay sober':'Redemption'};
function convertAgent(o){
  if(!o||typeof o!=='object'||Array.isArray(o))return o;
  const a=Object.assign({},o);delete a.spec;
  a.prof=OLDPROF[o.prof]||(PROFS.some(p=>p.id===o.prof)?o.prof:'investigator');
  const folded={};for(const [k,n] of Object.entries(o.picks||{})){const nk=OLDSKILL[k];if(nk)folded[nk]=(folded[nk]||0)+(+n||0)}
  a.picks={};let left=8;  // picks in cut skills (Drive, Art...) or over the 80% cap are dropped
  for(const [k,n] of Object.entries(folded))for(let i=0;i<n&&left>0;i++)if(skillVal(a,k)+20<=80){a.picks[k]=(a.picks[k]||0)+1;left--}
  const cha=(o.stats&&+o.stats.CHA)||10;
  a.bonds=(Array.isArray(o.bonds)?o.bonds:[]).filter(b=>b&&typeof b==='object').slice(0,2).map(b=>({name:String(b.name||'').trim()||pick(FIRST),rel:OLDREL[b.rel]||(RELS.includes(b.rel)?b.rel:'Friend'),score:cha}));
  while(a.bonds.length<2)a.bonds.push({name:pick(FIRST),rel:a.bonds.length?'Friend':'Partner',score:cha});
  const m=[];(Array.isArray(o.motives)?o.motives:[]).forEach(x=>{const k=MOTIVES.includes(x)?x:OLDMOT[x];if(k&&!m.includes(k))m.push(k)});
  for(const k of ['Duty','Curiosity'])if(m.length<2&&!m.includes(k))m.push(k);
  a.motives=m.slice(0,2);a.main=0;
  a.look=Object.assign({eyeC:0},o.look||{});
  if(typeof a.backstory!=='string')a.backstory='';
  if(!a.code)a.code=genCode();
  return a}
const UPGRADES={
  // 0 → 1 (Nov 21): first numbered version. Drops the retired sound key, fills any missing agent
  // fields with creator defaults, and sets aside a checkpoint that can't be read.
  1(){
    try{localStorage.removeItem(K('sound'))}catch(e){}
    const r=store.get(K('roster'),[]);store.set(K('roster'),(Array.isArray(r)?r:[]).map(fillAgent).filter(Boolean));
    const d=store.get(K('draft'),null);if(d!==null){const f=fillAgent(d);f?store.set(K('draft'),f):localStorage.removeItem(K('draft'))}
    let g=store.get(K('game'),null);
    if(g!==null){try{const o=typeof g==='string'?JSON.parse(g):g;if(!o||!o.map||!Array.isArray(o.party)||!o.party.length)throw 0;
        o.party.forEach(m=>{m.a=fillAgent(m.a)||newAgent()});store.set(K('game'),JSON.stringify(o))}
      catch(e){localStorage.setItem(K('broken'),localStorage.getItem(K('game')));localStorage.removeItem(K('game'))}}
  },
  // 1 → 2 (Nov 21): the new creator. Agents move to the new professions, skills, Bonds and motivations
  // (convertAgent above). bl.draft now holds the team in progress: {team, a, edit, tweak}.
  2(){
    const r=store.get(K('roster'),[]);store.set(K('roster'),(Array.isArray(r)?r:[]).map(convertAgent).filter(Boolean));
    const d=store.get(K('draft'),null);
    if(d!==null)store.set(K('draft'),d&&typeof d==='object'&&'prof' in d?{team:null,a:convertAgent(d),edit:null,tweak:false}:null);
    const g=store.get(K('game'),null);
    if(g!==null){try{const o=JSON.parse(g);o.party.forEach(m=>{m.a=convertAgent(m.a)});store.set(K('game'),JSON.stringify(o))}
      catch(e){localStorage.setItem(K('broken'),localStorage.getItem(K('game')));localStorage.removeItem(K('game'))}}
  }
};
function upgradeSaves(){
  try{
    const keys=Object.keys(localStorage).filter(k=>k.startsWith(K(''))&&k!==K('backup')&&k!==K('version'));
    let v=+(localStorage.getItem(K('version'))||0);
    if(!keys.length){localStorage.setItem(K('version'),SAVE_V);return}  // fresh phone: nothing to upgrade
    if(v>=SAVE_V)return;  // up to date (or saved by a newer build: leave it alone)
    const old=store.get(K('backup'),null);  // a retry after a failed upgrade keeps the first, untouched copy
    if(!old||old.from!==v)localStorage.setItem(K('backup'),JSON.stringify({from:v,at:new Date().toISOString(),keys:Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)]))}));
    for(v=v+1;v<=SAVE_V;v++){UPGRADES[v]();localStorage.setItem(K('version'),v)}
  }catch(e){console.warn('Save upgrade stopped:',e)}
}
upgradeSaves();
const D=(()=>{const d=store.get(K('draft'),null);return d&&typeof d==='object'&&!Array.isArray(d)?d:{}})();
const okAgent=a=>a&&typeof a==='object'&&!Array.isArray(a)&&a.stats&&a.look?a:null;
const okTeam=t=>t&&Array.isArray(t.seats)&&t.seats.length===3?t:null;
// team: {tpl, seats:[agent|null x3], state:['kept'|'tweaked'|'rebuilt'|'built'|'roster'|null], opt:[cursor per seat]}
// edit: the seat being built or tweaked (S.a is a working copy until Done). view: a roster file opened read-only.
const S={step:'title',sel:{},a:okAgent(D.a)||newAgent(),team:okTeam(D.team),edit:D.edit??null,tweak:!!D.tweak,view:false,seatPick:null,
  roster:store.get(K('roster'),[]),san:99,swap:null,clearArm:false,leaveArm:false,saved:false};
if(!Array.isArray(S.roster))S.roster=[];
const saveDraft=()=>store.set(K('draft'),{team:S.team,a:S.a,edit:S.edit,tweak:S.tweak});

// ---------- PIXEL PORTRAIT: 32 × 32 Storybook face (Art: Storybook; approved creator mockup, Nov 21) ----------
function shade(hex,amt){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const f=v=>Math.max(0,Math.min(255,Math.round(v+amt)));return'#'+[f(r),f(g),f(b)].map(v=>v.toString(16).padStart(2,'0')).join('')}
function mix(a,b,t){const p=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];const x=p(a),y=p(b);return'#'+x.map((v,i)=>Math.round(v+(y[i]-v)*t).toString(16).padStart(2,'0')).join('')}
function outfit32(px,o,oc,od,ol,sk){
  const W='#ece8de';
  if(o==='suit'){px(12,27,2,5,od);px(18,27,2,5,od);px(13,26,6,1,W);px(14,27,4,1,W);px(15,28,2,1,W);px(15,28,2,4,'#8c2f39')}
  else if(o==='labcoat'){px(4,29,24,3,'#e6e6ea');px(8,27,16,2,'#e6e6ea');px(21,28,7,4,'#c4c4cc');px(13,27,6,5,oc);px(12,27,1,5,'#b8b8c4');px(19,27,1,5,'#b8b8c4');px(22,29,1,2,'#2d6ad1')}
  else if(o==='scrubs'){px(14,27,4,1,sk);px(15,28,2,1,sk);px(20,29,3,1,od)}
  else if(o==='tactical'){px(9,27,2,5,'#1d1d1f');px(21,27,2,5,'#1d1d1f');px(12,29,3,2,ol);px(17,29,3,2,ol)}
  else if(o==='cardigan'){px(14,27,4,5,'#e8dcc0');px(13,28,1,1,'#ddd');px(13,30,1,1,'#ddd')}
  else if(o==='hoodie'){px(8,25,16,2,od);px(13,28,1,3,'#ddd');px(18,28,1,3,'#ddd')}
  else if(o==='uniform'){px(13,26,6,1,od);px(20,29,2,2,'#f2c94c');px(9,29,3,1,od)}
  else if(o==='clerical'){px(15,26,2,1,'#f4f4f4')}
  else if(o==='ranger'){px(13,26,6,1,od);px(20,29,2,2,'#f2c94c');px(9,29,2,2,'#3e5c3a')}
  else if(o==='mail'){for(let i=0;i<6;i++)px(8+i*2,26+i,2,1,'#5a3e2b')}
  else if(o==='janitor'){px(10,28,12,4,'#3b5b8a');px(11,27,2,1,'#3b5b8a');px(19,27,2,1,'#3b5b8a');px(14,29,3,1,'#f2c94c')}
  else if(o==='apron'){px(10,27,12,5,'#f4f1e8');px(10,27,12,1,'#e86a92')}
}
function drawPortrait(cv,a,scale,blink){
  const p=profOf(a)||PROFS[0],L=Object.assign({eyeC:0},a.look),ctx=cv.getContext('2d');cv.width=32*scale;cv.height=32*scale;
  ctx.imageSmoothingEnabled=false;ctx.setTransform(scale,0,0,scale,0,0);ctx.clearRect(0,0,32,32);
  const px=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,w,h)};
  const OL='#120e18',sk=SKIN[L.skin]||SKIN[1],sd=shade(sk,-30),sl=shade(sk,16),hc=HAIRC[L.hairC]||HAIRC[1],hd=shade(hc,-26),hl=shade(hc,30),H=L.hair;
  let oc=L.outfitC>=0?OUTC[L.outfitC]:OUTC[p.color];if(p.outfit==='clerical'&&L.outfitC<0)oc='#1d1b22';
  const od=shade(oc,-24),ol=shade(oc,26);
  px(0,0,32,32,'#2a2030');
  // hair that falls behind the head
  if(H===1){px(4,5,24,22,OL);px(5,6,5,20,hc);px(22,6,5,20,hd);px(10,6,12,6,hc)}
  if(H===6){px(4,3,24,17,OL);px(5,4,22,15,hc);px(6,5,2,2,hl);px(23,9,2,2,hd);px(5,12,2,2,hd);px(24,15,2,2,hd)}
  // shoulders, neck, outfit
  px(3,28,26,4,OL);px(7,26,18,2,OL);px(4,29,24,3,oc);px(8,27,16,2,oc);px(21,28,7,4,od);px(5,29,3,1,ol);
  px(12,22,8,5,sd);px(13,26,6,1,shade(sk,-45));
  outfit32(px,p.outfit,oc,od,ol,sk);
  // head and ears
  px(7,7,18,17,OL);px(8,8,16,15,sk);px(9,23,14,1,sk);px(21,9,3,14,sd);px(8,10,1,11,sl);
  px(5,14,1,4,OL);px(26,14,1,4,OL);px(6,14,2,4,sk);px(24,14,2,4,sd);
  // hair in front
  const top=()=>{px(7,3,18,7,OL);px(8,4,16,5,hc);px(8,8,7,3,hc);px(17,8,6,1,hc);px(7,6,2,8,hc);px(23,6,2,6,hd);px(10,5,7,1,hl)};
  if(H===0)top();
  else if(H===1){top();px(7,8,2,15,hc);px(23,8,2,15,hd)}
  else if(H===2){px(7,5,18,4,OL);px(8,6,16,3,hd);px(8,8,16,1,shade(hc,-8));px(10,6,5,1,hc)}
  else if(H===3){px(11,9,5,1,sl);px(10,10,2,1,sl)}
  else if(H===4){top();px(11,0,10,4,OL);px(12,1,8,3,hc);px(13,1,3,1,hl)}
  else if(H===5){px(13,0,6,10,OL);px(14,1,4,9,hc);px(14,1,1,7,hl)}
  else if(H===6){px(7,8,3,3,hc);px(22,8,3,3,hd);px(10,8,4,2,hc);px(16,8,5,2,hc);px(13,7,2,1,hl)}
  // eyes: whites, colored iris, glint (Storybook); 0 Bright, 1 Wide, 2 Tired
  const e=L.eyes,ey=e===1?13:e===2?15:14,eh=e===1?4:e===2?2:3,ir=IRIS[L.eyeC]||IRIS[0],by=e===1?11:12;
  px(10,by,4,1,H===3?sd:hd);px(18,by,4,1,H===3?sd:hd);
  if(blink){px(10,15,4,1,OL);px(18,15,4,1,OL)}
  else{for(const x of[10,18]){px(x,ey-1,4,1,OL);px(x,ey,4,eh,'#f4ecd8');px(x+1,ey,2,eh,ir);px(x+1,ey+eh-1,2,1,shade(ir,-40));px(x+1,ey,1,1,'#ffffff')}
    if(e===1){px(9,ey-1,1,1,OL);px(22,ey-1,1,1,OL)}
    if(e===2){px(10,17,4,1,sd);px(18,17,4,1,sd)}}
  // nose, rosy cheeks, open smile
  const cheek=mix(sk,'#e0606a',.45),lip='#5a1e1a';
  px(15,17,2,2,sd);px(9,19,2,1,cheek);px(21,19,2,1,cheek);
  const A=L.acc;
  if(A===3){px(8,17,16,6,hc);px(9,23,14,1,hc);px(8,15,2,2,hc);px(22,15,2,2,hd);px(12,19,8,1,hd);px(15,17,2,2,sd)}
  px(13,20,6,1,lip);px(12,19,1,1,lip);px(19,19,1,1,lip);px(14,21,4,1,A===3?lip:'#8a3a2e');
  // extras: 1 glasses, 2 shades, 3 beard (above), 4 scar, 5 earpiece, 6 eyepatch, 7 freckles, 8 earring
  if(A===1){for(const x of[9,17]){px(x,ey-1,6,1,OL);px(x,ey+eh,6,1,OL);px(x,ey-1,1,eh+2,OL);px(x+5,ey-1,1,eh+2,OL)}px(15,ey,2,1,OL)}
  else if(A===2){px(9,13,14,4,OL);px(10,14,4,2,'#2a3550');px(18,14,4,2,'#2a3550');px(10,14,1,1,'#7a88b0');px(18,14,1,1,'#7a88b0')}
  else if(A===4){const sc=mix(sk,'#8a3040',.55);px(19,17,1,1,sc);px(20,18,1,1,sc);px(21,19,1,1,sc);px(22,20,1,1,sc)}
  else if(A===5){px(25,13,2,3,'#6d737a');px(26,16,1,8,'#9aa0a6')}
  else if(A===6){px(8,11,16,1,OL);px(18,13,5,5,OL);px(19,14,3,3,'#2a2030')}
  else if(A===7){const fr=shade(sk,-42);for(const [x,y] of[[9,17],[11,18],[13,17],[18,17],[20,18],[22,17],[14,19],[17,19]])px(x,y,1,1,fr)}
  else if(A===8){px(6,18,1,2,'#d6a43a')}
}
const urlCache={};
function portraitURL(a,scale){const k=JSON.stringify([a.prof,a.look,scale]);if(!urlCache[k]){const c=document.createElement('canvas');drawPortrait(c,a,scale,false);urlCache[k]=c.toDataURL()}return urlCache[k]}

// ---------- VIEWS ----------
const R=(label,o={})=>Object.assign({label},o);
const ST=html=>({static:html});
const goto=step=>{S.step=step;S.swap=null;S.clearArm=false;S.leaveArm=false};
const steps=()=>S.tweak?STEPS.filter(s=>TWEAKABLE.includes(s)):STEPS;
// L/R only stops you moving on without a profession, or with point buy not spent; Done checks everything.
function gate(a,step){if(step==='profession'&&!a.prof)return'PICK A PROFESSION FIRST';if(step==='stats'&&a.method==='buy'&&buyLeft(a)!==0)return'SPEND EXACTLY 72 POINTS';return null}
function problem(a,step){const g=gate(a,step);if(g)return g;
  if(step==='skills'&&picksUsed(a)<8)return'SPEND ALL 8 BONUS PICKS';
  if(step==='identity'&&!a.name.trim())return'GIVE THEM A NAME';
  if(step==='bonds'&&a.bonds.some(b=>!b.name.trim()))return'NAME BOTH BONDS';
  if(step==='motives'&&a.motives.length<2)return'PICK 2 MOTIVATIONS';return null}
const nextStep=()=>{if(S.view)return;const L=steps(),i=L.indexOf(S.step);if(i<0||i>=L.length-1)return;const g=gate(S.a,S.step);if(g)return toast(g);goto(L[i+1])};
const prevStep=()=>{
  if(S.view){S.view=false;goto('roster');return}
  const L=steps(),i=L.indexOf(S.step);
  if(i>0)return goto(L[i-1]);
  if(i===0)return leaveEdit();
  if(S.step==='roster'){const back=S.seatPick!==null?'team':'title';S.seatPick=null;return goto(back)}
  if(S.step==='team'||S.step==='pick'||S.step==='title')return goto('title');
};
function leaveEdit(){if(!S.leaveArm){S.leaveArm=true;return toast('B AGAIN TO DROP THIS EDIT')}S.a=newAgent();S.edit=null;S.tweak=false;goto(S.team?'team':'title');toast('EDIT DROPPED')}
const nextRow=lab=>R(lab||'Next ▶',{cls:'go',a:nextStep});

const V={};
V.title=()=>{
  const n=S.roster.length;
  return{rows:[
    ST(`<canvas class="lantern pix" id="lantern" width="96" height="96" style="border:0;background:transparent"></canvas><div class="logo">BLACK LANTERN<small>PERSONNEL INTAKE · FORM 7-B</small></div><div class="static small" style="text-align:center;padding-top:0">Build a team. Lose them later.</div>`),
    ...(store.get(K('game'),null)?[R('Continue Chapter One',{cls:'go',a:()=>{if(window.BLG)BLG.resume()}})]:[]),
    ...(S.team?[R('Continue team',{val:esc(S.team.name||''),a:()=>{goto(S.edit!==null?(S.tweak?'identity':'profession'):'team')}})]:[]),
    R('New game',{a:()=>goto('pick')}),
    R('Roster',{val:n+' on file',a:()=>{S.seatPick=null;goto('roster')}}),
    // Back to the studio's game shelf, only when the game was opened from it (launcher.md)
    ...(window.Studio&&Studio.fromShelf?[R('Game shelf',{val:'◀',a:()=>Studio.toShelf()})]:[]),
    ST(`<div class="small" style="text-align:center;margin-top:6px">Keyboard: arrows · Z = A · X = B · Q/W = L/R · Enter = Start</div>`)
  ],foot:'A: SELECT',bare:true};
};
V.pick=()=>{
  const rows=TEAMS.map(t=>R(`<span class="tn">${esc(t.name.toUpperCase())}</span><span class="ts">${t.seats.map(s=>esc(profOf(s).name)).join(' · ')}</span>`,{cls:'two',val:`<span class="small">${esc(t.tag)}</span>`,t,a:()=>chooseTeam(t)}));
  rows.push(R(`<span class="tn">BLANK TEAM</span><span class="ts">Build all 3 seats yourself</span>`,{cls:'two blank',val:'<span class="small">Custom</span>',a:()=>chooseTeam(null)}));
  const hov=rows[S.sel.pick||0];
  const pane=`<div>${esc(hov&&hov.t?hov.t.blurb:'Three empty seats. Build each agent from scratch, or pull them from the roster.')}</div>`+(S.team?`<div class="small" style="margin-top:4px">Picking a team replaces the one in progress (${esc(S.team.name)}).</div>`:'');
  return{rows,pane,foot:'A: PICK · B: TITLE',bare:true,sub:'NEW GAME'};
};
function chooseTeam(t){S.team={tpl:t?t.id:'blank',name:t?t.name:'Blank team',seats:t?t.seats.map(fromTemplate):[null,null,null],state:t?['kept','kept','kept']:[null,null,null],opt:[0,0,0]};S.edit=null;S.tweak=false;S.sel.team=0;goto('team')}
const filled=()=>S.team&&S.team.seats.every(Boolean);
V.team=()=>{
  const T=S.team;if(!T){goto('title');return V.title()}
  const rows=T.seats.map((a,i)=>{
    const opts=a?['Keep','Tweak','Rebuild']:['Build','Roster'],o=Math.min(T.opt[i]||0,opts.length-1),st=T.state[i];
    const shown=opts.map((n,j)=>{let lab=n.toUpperCase();if(a&&j===1&&st==='tweaked')lab='TWEAKED';if(a&&j===2&&(st==='rebuilt'||st==='built'))lab='REBUILT';
      const isState=a&&((j===1&&st==='tweaked')||(j===2&&(st==='rebuilt'||st==='built')));
      return`<span class="opt${j===o?' sel':''}${isState?' state':''}" data-act="o${j}">${j===o&&S.sel.team===i?'▶ ':''}${lab}</span>`}).join('');
    const p=a&&profOf(a);
    const who=a?`<span class="n">${esc(surname(a))}</span><span class="p">${esc(p.name)} · ${p.strong.map(k=>`${esc(k)} ${skillVal(a,k)}`).join(' · ')}</span><span>Main: ${esc(mainOf(a))}</span>`
      :`<span class="n dim">SEAT ${i+1}</span><span class="p">Empty. Build an agent, or pick one from the roster.</span>`;
    const run=j=>()=>{T.opt[i]=j;seatAction(i,j)};
    return R(`<div class="seat-top">${a?`<img class="face" src="${portraitURL(a,2)}" width="64" height="64" alt="${esc(a.name)}">`:'<span class="face empty">?</span>'}<div class="who">${who}</div></div><div class="opts" style="grid-template-columns:repeat(${opts.length},minmax(0,1fr))">${shown}</div>`,
      {cls:'seat',left:()=>{T.opt[i]=Math.max(0,o-1)},right:()=>{T.opt[i]=Math.min(opts.length-1,o+1)},a:()=>seatAction(i,o),o0:run(0),o1:run(1),o2:run(2)});
  });
  rows.push(R('START ▶',{cls:'start'+(filled()?'':' off'),a:startGame}));
  return{rows,pane:'<div class="small">Up/Down: seat · Left/Right: '+(T.seats.some(x=>!x)?'Keep / Tweak / Rebuild, or Build / Roster':'Keep / Tweak / Rebuild')+' · START: begin</div>',foot:'A: CHOOSE · B: TITLE',bare:true,sub:`${esc(T.name.toUpperCase())} · ${T.seats.filter(Boolean).length}/3 seats`};
};
function seatAction(i,j){
  const T=S.team,a=T.seats[i];
  if(!(a&&j===0)&&!(!a&&j===1))STEPS.forEach(s=>delete S.sel[s]);  // a new build or tweak starts every step at the top
  if(!a){if(j===0){S.a=newAgent();S.edit=i;S.tweak=false;goto('profession')}else{S.seatPick=i;goto('roster')}return}
  if(j===0){if(!T.state[i]||T.state[i]==='kept')T.state[i]='kept';toast('KEEPING '+surname(a))}
  else if(j===1){S.a=clone(a);S.edit=i;S.tweak=true;goto('identity')}
  else{S.a=newAgent();S.edit=i;S.tweak=false;goto('profession')}
}
function fileToRoster(a){a.id=a.id||newId();const i=S.roster.findIndex(x=>x.id===a.id);const c=clone(a);if(i>=0)S.roster[i]=c;else S.roster.unshift(c);store.set(K('roster'),S.roster)}
function startGame(){
  if(!filled())return toast('FILL ALL 3 SEATS FIRST');
  const seats=S.team.seats.map(clone);seats.forEach(fileToRoster);
  S.team=null;S.edit=null;S.tweak=false;S.a=newAgent();saveDraft();
  if(window.BLG)BLG.start(seats[0],seats.slice(1));
}
const info=(l,r)=>`<span>${l}</span><span>${r}</span>`;
const whoLine=a=>`<span class="hi">${esc(a.name?surname(a):'NEW AGENT')}</span>${profOf(a)?' · '+esc(profOf(a).name):''}`;
V.profession=()=>{
  const a=S.a,rows=[];let team='';
  PROFS.forEach(p=>{if(p.team!==team){team=p.team;rows.push(ST(`<h3>${esc(team.toUpperCase())}</h3>`))}rows.push(R(esc(p.name),{p,val:a.prof===p.id?'<span class="mt">YOURS</span>':'',a:()=>{setProf(a,p);goto('stats')}}))});
  const hov=rows[S.sel.profession??1]?.p||profOf(a)||PROFS[0];
  const W=WEAP[hov.weapon];
  const pane=`<div><span class="hi">${esc(hov.name.toUpperCase())}</span> <span class="small">· ${esc(hov.team)}</span></div><div class="small">${esc(hov.blurb)}</div>`+
    `<div class="small"><span class="fg">Strong</span> ${hov.strong.map(esc).join(', ')} 50 · <span class="fg">Backup</span> ${hov.backup.map(k=>`${esc(k)} ${hov.skills[k]}`).join(', ')}</div>`+
    `<div class="small"><span class="fg">Kit</span> ${hov.weapon!=='handgun'?esc(W.name[0].toUpperCase()+W.name.slice(1))+' '+esc(WEAPTXT[hov.weapon])+' · handgun':'Handgun 1d8'} · ${esc(hov.kit[0])}: ${esc(hov.kit[1])}</div>`;
  return{rows,pane,info:info(whoLine(a),'2 strong · 2 backup'),foot:'A: CHOOSE · B: BACK · R: NEXT'};
};
V.stats=()=>{
  const a=S.a,buy=a.method==='buy',set=a.method==='set',d=derived(a);
  const tog=()=>{if(buy){if(!a.roll)a.roll={vals:rollStats(),left:1};a.method='roll';a.stats=clone(a.roll.vals)}else{a.method='buy';a.stats=Object.fromEntries(STATS.map(k=>[k,12]))}S.swap=null};
  const rows=[R('Method',{val:set?'SET':buy?'POINT BUY':'ROLL 4d6',left:tog,right:tog,a:tog})];
  STATS.forEach(k=>{
    const v=a.stats[k];
    const adj=dd=>()=>{if(!buy)return;const nv=v+dd;if(nv<3||nv>18||(dd>0&&buyLeft(a)<=0))return;a.stats[k]=nv};
    rows.push(R(`${k} <span class="small">${STATNAME[k]}</span>`,{k,cls:S.swap===k?'pickd':'',val:`<span${v>=16?' class="grn"':v<=5?' class="red"':''}>${String(v).padStart(2,' ')}</span>`,left:buy?adj(-1):null,right:buy?adj(1):null,
      a:buy?adj(1):()=>{if(!S.swap){S.swap=k}else if(S.swap===k){S.swap=null}else{[a.stats[S.swap],a.stats[k]]=[a.stats[k],a.stats[S.swap]];S.swap=null}}}));
  });
  if(a.method==='roll')rows.push(a.roll&&a.roll.left>0?R('Reroll all',{val:'once',a:()=>{a.roll.vals=rollStats();a.roll.left=0;a.stats=clone(a.roll.vals);S.swap=null;toast('THAT\'S YOUR ONE REROLL')}}):ST('<div class="small">Reroll used. These are the numbers.</div>'));
  rows.push(nextRow());
  const hk=rows[S.sel.stats||0]?.k;
  const feats=STATS.map(k=>feature(k,a.stats[k])&&`<div class="small">${k}: ${esc(feature(k,a.stats[k]))}</div>`).filter(Boolean).join('');
  const pane=`<div class="kv" style="grid-template-columns:repeat(4,auto 1fr)"><span>HP</span><span class="hi">${d.HP}</span><span>WP</span><span class="hi">${d.WP}</span><span>SAN</span><span class="hi">${d.SAN}</span><span>BP</span><span class="hi">${d.BP}</span></div>`+
    (hk?`<div class="small"><span class="hi">${hk}</span> · ${esc(STATJOB[hk])}</div>`:'')+
    (buy?`<div>Points left: <span class="${buyLeft(a)===0?'grn':'red'}">${buyLeft(a)}</span> <span class="small">(72 total, 3–18 each)</span></div>`:a.method==='roll'?`<div class="small">${S.swap?'Now pick a stat to swap with '+S.swap+'.':'4d6, drop the lowest. A on two stats to swap them.'}</div>`:'<div class="small">Template stats come set. Switch method to build your own.</div>')+feats;
  return{rows,pane,info:info(whoLine(a),`SAN ${d.SAN} · BP ${d.BP}`),foot:buy?'◀▶: ADJUST · L/R: STEP':'A: SWAP · L/R: STEP'};
};
V.skills=()=>{
  const a=S.a,p=profOf(a),left=8-picksUsed(a);
  const rank=k=>p.strong.includes(k)?0:p.backup.includes(k)?1:2;
  // fixed order (job skills first, then by base), so adding a pick never moves the cursor to another skill
  const keys=Object.keys(SKILLS).sort((x,y)=>rank(x)-rank(y)||SKILLS[y]-SKILLS[x]||x.localeCompare(y));
  const rows=keys.map(k=>{
    const v=skillVal(a,k),n=a.picks[k]||0,job=!!p.skills[k];
    const add=()=>{if(picksUsed(a)>=8)return toast('NO BONUS PICKS LEFT');if(v+20>80)return toast('BONUS PICKS CAP AT 80%');a.picks[k]=n+1};
    const rem=()=>{if(!n)return;a.picks[k]=n-1;if(!a.picks[k])delete a.picks[k]};
    return R(`<span class="sk">${esc(k)}</span><span class="bar"><i style="width:${v}%;background:${n?'var(--gold)':job?'#9aa3d6':'#5a5070'}"></i></span>`,{k,cls:'skill',val:`<span class="num">${v}</span><span class="tg">${n?'+'+20*n:job?'<span class="small">job</span>':''}</span>`,left:rem,right:add,a:add});
  });
  rows.push(nextRow());
  const hk=rows[S.sel.skills||0]?.k;let pane='';
  if(hk){const n=a.picks[hk]||0,base=Math.max(SKILLS[hk],p.skills[hk]||0),from=p.strong.includes(hk)?'strong':p.backup.includes(hk)?'backup':'base';
    pane=`<div><span class="hi">${esc(hk.toUpperCase())} ${skillVal(a,hk)}%</span> · ${from} ${base}${n?`, ${['','one pick','two picks','three picks'][n]||n+' picks'}`:''}.${n&&!p.skills[hk]?` A ${esc(p.name)} who ${esc(HOBBY[hk])}.`:''}</div><div class="small">${esc(SKILLJOB[hk])}</div>`}
  pane+=`<div class="small">◀ ▶: −/+20 · bonus picks cap at 80%</div>`;
  return{rows,pane,info:info(whoLine(a),`PICKS <span class="${left?'hi':'grn'}">${8-left}</span>/8 · cap 80%`),foot:'◀▶: PICK · L/R: STEP'};
};
V.identity=()=>{
  const a=S.a,L=a.look;
  const cyc=(key,n,lo=0)=>[()=>{L[key]=((L[key]??lo)-lo-1+n)%n+lo},()=>{L[key]=((L[key]??lo)-lo+1)%n+lo}];
  const r=(lab,key,n,names,lo=0)=>{const [l,rr]=cyc(key,n,lo);return R(lab,{val:esc(names(L[key]??lo)),left:l,right:rr,a:rr})};
  return{side:true,rows:[
    R('',{input:{bind:'name',value:a.name,ph:'Full name'},val:''}),
    R('',{input:{bind:'code',value:a.code,ph:'Codename'},val:'<b data-act="right">↻</b>',right:()=>{a.code=genCode()}}),
    R('',{input:{bind:'back',value:a.backstory,ph:'One-line backstory',max:120},val:''}),
    r('Skin','skin',6,v=>'Tone '+(v+1)),
    r('Hair','hair',7,v=>HAIRS[v]),
    r('Color','hairC',7,v=>HAIRCN[v]),
    r('Eyes','eyes',3,v=>EYES[v]),
    r('Iris','eyeC',5,v=>EYEC[v]),
    r('Extra','acc',ACC.length,v=>ACC[v]),
    r('Outfit','outfitC',8,v=>v<0?'Issue':OUTCN[v],-1),
    nextRow()],
    pane:`<canvas class="pix face" id="pbig"></canvas><div class="small" style="text-align:center;line-height:1">${esc(profOf(a)?.name||'')}</div>`,
    info:info(whoLine(a),S.tweak?'TWEAK':'NAME · FACE'),foot:'A: TYPE · ◀▶: CHANGE · L/R: STEP'};
};
V.bonds=()=>{
  const a=S.a,cha=a.stats.CHA,rows=[];
  a.bonds.forEach((b,i)=>{
    const setT=j=>()=>{if(S.tweak)return toast('TWEAK RENAMES BONDS. REBUILD TO CHANGE TYPES');b.rel=RELS[j]};
    const cyc=d=>()=>setT((RELS.indexOf(b.rel)+d+RELS.length)%RELS.length)();
    const o={cls:'chiprow',bi:i,val:'',left:cyc(-1),right:cyc(1),a:cyc(1)};
    RELS.forEach((x,j)=>o['t'+j]=setT(j));
    rows.push(R(`<span class="bn">${i+1}</span><span class="chips">${RELS.map((x,j)=>`<span class="chip${b.rel===x?' on':''}${S.tweak?' lock':''}" data-act="t${j}">${esc(x)}</span>`).join('')}</span>`,o));
    rows.push(R('',{bi:i,input:{bind:'bond'+i,value:b.name,ph:`${b.rel}'s name`},val:`<span class="small">BOND</span> <span class="hi">${b.score??cha}</span>`}));
  });
  rows.push(nextRow());
  const hb=a.bonds[rows[S.sel.bonds||0]?.bi??0]||a.bonds[0];
  const pane=`<div><span class="hi">${esc(hb.rel.toUpperCase())}</span> · ${esc(RELTXT[hb.rel])} Their type sets which home scenes you get together.</div>`+
    `<div class="small">${S.tweak?'Template agents arrive with both Bonds filled in; Tweak renames them.':'Each Bond starts at CHA and wears thin when you lean on it.'}</div>`;
  return{rows,pane,info:info(whoLine(a),`Bonds start at CHA ${cha}`),foot:'◀▶: TYPE · A: NAME · L/R: STEP'};
};
function toggleMot(a,m){const i=a.motives.indexOf(m);if(i>=0){a.motives.splice(i,1);if(a.main>=a.motives.length||a.main===i)a.main=0;else if(a.main>i)a.main--;return}
  if(a.motives.length>=2)return toast('TWO AT MOST. A ON ONE TO DROP IT');a.motives.push(m)}
function makeMain(a,m){let i=a.motives.indexOf(m);if(i<0){if(a.motives.length>=2)return toast('PICK IT FIRST');a.motives.push(m);i=a.motives.length-1}a.main=i}
V.motives=()=>{
  const a=S.a;
  const rows=MOTIVES.map(m=>{const i=a.motives.indexOf(m),on=i>=0,main=on&&i===a.main;
    return R(`<span class="mk">${main?'★':on?'✓':''}</span>${esc(m)}`,{m,cls:'mot'+(on?' picked':''),val:main?'<span class="mt">MAIN</span>':'',a:()=>toggleMot(a,m),right:()=>makeMain(a,m),sel:()=>makeMain(a,m)})});
  rows.push(nextRow());
  const hm=rows[S.sel.motives||0]?.m;
  const pane=(hm?`<div><span class="hi">${esc(hm.toUpperCase())}</span> · ${esc(MOTTXT[hm])}</div>`:'')+`<div class="small">★ MAIN drives this agent's own story, told in home scenes between cases. The other one still counts.</div>`;
  return{rows,pane,info:info(`${whoLine(a)} · why do this job?`,`PICKED ${a.motives.length}/2`),foot:'A: PICK · SELECT or ▶: MAIN · L/R: STEP'};
};
function dossierCard(a){
  const p=profOf(a),d=derived(a),W=WEAP[p.weapon];
  const top=Object.keys(SKILLS).map(k=>[k,skillVal(a,k)]).sort((x,y)=>y[1]-x[1]).slice(0,6);
  const feats=STATS.map(k=>feature(k,a.stats[k])).filter(Boolean);
  const h=t=>`<h3 style="font:8px var(--px);color:var(--scr-hi);margin:7px 0 2px">${t}</h3>`;
  return`<div class="card"><div class="top"><img class="pix face" src="${portraitURL(a,3)}" width="96" height="96" alt="Agent portrait"><div class="who"><div class="n">${esc(a.name||'Unnamed Agent')}</div><div class="hi">AGENT ${esc(a.code||surname(a))}</div><div>${esc(p.name)}</div><div class="small">${esc(p.team)}</div>${a.cur?`<div class="red">SAN now ${a.cur.san}/${d.SAN}${a.cur.dis?' · '+esc(a.cur.dis):''}</div>`:''}<span class="stamp">CLEARED</span></div></div>
  ${a.backstory?`<div class="small" style="margin-top:5px;color:var(--scr-fg)">${esc(a.backstory)}</div>`:''}
  <div class="sgrid">${STATS.map(k=>`<span><span class="small">${k}</span> ${a.stats[k]}</span>`).join('')}</div>
  <div class="sgrid" style="grid-template-columns:repeat(4,1fr)"><span><span class="small">HP</span> ${d.HP}</span><span><span class="small">WP</span> ${d.WP}</span><span><span class="small">SAN</span> ${d.SAN}</span><span><span class="small">BP</span> ${d.BP}</span></div>
  ${h('BEST SKILLS')}<div class="small" style="color:var(--scr-fg)">${top.map(([k,v])=>`${esc(k)} ${v}%`).join(' · ')}</div>
  ${h('KIT')}<div class="small" style="color:var(--scr-fg)">${W.name==='handgun'?'Handgun 1d8':`${esc(W.name[0].toUpperCase()+W.name.slice(1))} ${esc(WEAPTXT[p.weapon])} · handgun 1d8`}</div><div class="small" style="color:var(--scr-fg)">${esc(p.kit[0])}: ${esc(p.kit[1])}</div>
  ${h('BONDS')}<div class="small" style="color:var(--scr-fg)">${a.bonds.map(b=>`${esc(b.name||'?')} (${esc(b.rel.toLowerCase())}) ${b.score??a.stats.CHA}`).join(' · ')}</div>
  ${h('MOTIVATIONS')}<div class="small" style="color:var(--scr-fg)">${a.motives.map((m,i)=>(i===a.main?'★ ':'')+esc(m)+(i===a.main?' (Main)':'')).join(' · ')||'None yet'}</div>
  ${feats.length?`${h('NOTED')}<div class="small" style="color:var(--scr-fg)">${feats.map(esc).join(' · ')}</div>`:''}</div>`;
}
function done(){
  const a=S.a;for(const st of steps()){const pr=problem(a,st);if(pr){goto(st);return toast(pr)}}
  a.bonds.forEach(b=>{if(b.score==null)b.score=a.stats.CHA});a.name=a.name.trim();
  const T=S.team,i=S.edit,was=T.seats[i];a.id=a.id||newId();  // a tweak keeps the agent's id; a rebuild is a new person
  T.seats[i]=clone(a);T.state[i]=S.tweak?'tweaked':was?'rebuilt':'built';T.opt[i]=0;
  S.a=newAgent();S.edit=null;S.tweak=false;S.sel.team=i;goto('team');toast('SEAT '+(i+1)+' FILLED');
}
V.dossier=()=>{
  const a=S.a;if(!profOf(a)){goto(S.view?'roster':'profession');return V[S.step]()}
  const rows=[ST(dossierCard(a))];
  if(S.view){
    rows.push(R('Copy agent code',{a:()=>copyCode(a)}));
    rows.push(R(S.clearArm?'Press A again to shred':'Shred this file',{cls:'warn',a:()=>{if(!S.clearArm){S.clearArm=true;return}S.roster=S.roster.filter(x=>x.id!==a.id);store.set(K('roster'),S.roster);S.view=false;goto('roster');toast('FILE SHREDDED')}}));
    rows.push(R('Back to roster',{a:()=>{S.view=false;goto('roster')}}));
  }else{
    rows.push(R('Done ▶',{cls:'go',val:`seat ${S.edit+1}`,a:done}));
    rows.push(R(S.saved?'Filed ✓':'File to roster too',{a:()=>{const pr=steps().map(st=>problem(a,st)).find(Boolean);if(pr)return toast(pr);a.id=a.id||newId();fileToRoster(a);S.saved=true;toast('FILED UNDER '+(a.code||'?'))}}));
    rows.push(R('Copy agent code',{a:()=>copyCode(a)}));
  }
  return{rows,info:info(whoLine(a),S.view?'ROSTER FILE':'REVIEW'),foot:S.view?'A: SELECT · B: ROSTER':'A: SELECT · START: DONE · L: BACK',bare:true};
};
V.roster=()=>{
  const picking=S.seatPick!==null,onTeam=id=>S.team&&S.team.seats.some(x=>x&&x.id===id);
  const rows=S.roster.length?S.roster.map(a=>R(esc(a.name||'Unnamed'),{val:esc(profOf(a)?.name||''),cls:picking&&onTeam(a.id)?'dim':'',a:()=>{
      if(picking){if(onTeam(a.id))return toast('ALREADY ON THE TEAM');const i=S.seatPick;S.team.seats[i]=clone(a);S.team.state[i]='roster';S.team.opt[i]=0;S.seatPick=null;S.sel.team=i;goto('team');return toast(surname(a)+' TAKES SEAT '+(i+1))}
      S.a=clone(a);S.view=true;goto('dossier')}})):[ST('No agents on file yet. Agents are filed when you start a case, or from the Dossier step.')];
  if(S.roster.length&&!picking)rows.push(R(S.clearArm?'Press A again to shred all':'Shred roster',{cls:'warn',a:()=>{if(S.clearArm){S.roster=[];store.set(K('roster'),[]);S.clearArm=false;toast('ROSTER SHREDDED')}else{S.clearArm=true}}}));
  return{rows,foot:picking?'A: PUT IN SEAT · B: BACK':'A: OPEN FILE · B: BACK',sub:picking?`SEAT ${S.seatPick+1}`:`${S.roster.length} ON FILE`};
};
function copyCode(a){
  const code='BL1:'+btoa(unescape(encodeURIComponent(JSON.stringify(a))));
  const done=()=>{toast('AGENT CODE COPIED')};
  try{navigator.clipboard.writeText(code).then(done,()=>fallback(code))}catch(e){fallback(code)}
  function fallback(c){const t=document.createElement('textarea');t.value=c;t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.select();let ok=false;try{ok=document.execCommand('copy')}catch(e){}t.remove();ok?done():toast('COPY BLOCKED HERE')}
}

// ---------- RENDER ----------
const list=$('#list'),pane=$('#pane'),body=$('#body'),screen=$('#screen');
function $(s){return document.querySelector(s)}
let cur=null;
function selectable(rows){return rows.map((r,i)=>r.static?null:i).filter(i=>i!==null)}
function fixSel(rows){const ok=selectable(rows);let s=S.sel[S.step]??ok[0];if(!ok.includes(s)){s=ok.find(i=>i>=s)??ok[ok.length-1]}S.sel[S.step]=s;return s}
function header(){
  const L=steps(),si=STEPS.indexOf(S.step),hb=$('#hBar');
  if(si>=0&&!S.view){
    const k=L.indexOf(S.step);
    $('#hTitle').innerHTML=`<span class="lr">L</span><span>${k+1}/${L.length} ${STEPNAME[S.step]}</span><span class="lr">R</span>`;$('#hStep').textContent='';
    hb.innerHTML=STEPS.map(s=>{const j=STEPS.indexOf(s),lock=!L.includes(s),c=s===S.step?'on':lock?'lock':j<si?'done':'';return`<span class="${c}">${STEPSHORT[s]}</span>`}).join('');hb.hidden=false;$('.hdr').classList.add('steps');
  }else{$('#hTitle').textContent=STEPNAME[S.step]||'';$('#hStep').innerHTML=cur.sub||'';hb.hidden=true;$('.hdr').classList.remove('steps')}
}
function render(scroll=true){
  if(S.step!=='dossier')S.saved=false;
  cur=V[S.step]();
  const s=fixSel(cur.rows);
  header();
  const inf=$('#info');inf.innerHTML=cur.info||'';inf.hidden=!cur.info;
  list.innerHTML=cur.rows.map((r,i)=>r.static?`<div class="static">${r.static}</div>`:
    `<div class="row ${i===s?'on':''} ${r.cls||''}" data-i="${i}"><span class="cur">▶</span>${r.input?`<input data-bind="${r.input.bind}" value="${esc(r.input.value)}" placeholder="${esc(r.input.ph)}" maxlength="${r.input.max||28}" autocomplete="off" spellcheck="false">`:`<span class="lab">${r.label}</span>`}<span class="val">${r.left&&!/seat|chiprow/.test(r.cls||'')?'<b data-act="left">◀</b>':''}${r.val??''}${r.right&&!/seat|chiprow|mot/.test(r.cls||'')&&!String(r.val??'').includes('data-act')?'<b data-act="right">▶</b>':''}</span></div>`).join('');
  body.classList.toggle('side',!!cur.side);
  list.classList.toggle('bare',!!cur.bare);
  pane.innerHTML=cur.pane||'';pane.hidden=!cur.pane;
  if(S.step==='identity')drawBig(false);
  if(S.step==='title')drawLantern();
  // sanity palette
  const f=1-S.san/99;
  screen.style.filter=f>0?`hue-rotate(${(-f*70).toFixed(0)}deg) saturate(${(1+f*1.4).toFixed(2)}) contrast(${(1+f*.25).toFixed(2)})`:'';
  $('#vig').style.opacity=(f*.9).toFixed(2);
  screen.classList.toggle('glitch',S.san<30);
  const ft=$('#ftr');
  if(S.san<25&&Math.random()<.3){ft.textContent=pick(CREEP);ft.classList.add('creep')}else{ft.textContent=cur.foot||'';ft.classList.remove('creep')}
  if(scroll){const el=list.querySelector('.row.on');if(el)el.scrollIntoView({block:'nearest'});if(s===selectable(cur.rows)[0])list.scrollTop=0}
  saveDraft();
}
function drawBig(blink){const c=$('#pbig');if(c){drawPortrait(c,S.a,3,blink);c.style.width='96px';c.style.height='96px'}}
function drawLantern(){const c=$('#lantern');if(!c)return;const x=c.getContext('2d');x.imageSmoothingEnabled=false;x.setTransform(6,0,0,6,0,0);x.clearRect(0,0,16,16);const p=(a,b,w,h,col)=>{x.fillStyle=col;x.fillRect(a,b,w,h)};
  const fl=Math.random()<.5;p(7,0,2,2,'#5d5888');p(5,2,6,1,'#2a2440');p(4,3,8,1,'#3a3460');p(4,4,1,9,'#2a2440');p(11,4,1,9,'#2a2440');p(5,4,6,9,fl?'#ffd166':'#ffbf3f');p(6,6,4,5,fl?'#fff1c2':'#ffe08a');p(7,7,2,3,'#fffaf0');p(4,13,8,1,'#3a3460');p(5,14,6,1,'#2a2440');p(7,4,2,9,'rgba(20,12,30,.18)')}
let toastT;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),1500)}

// ---------- INPUT ----------
function rowAt(i){return cur.rows[i]}
const inCreator=()=>STEPS.includes(S.step)&&!S.view;
function act(kind){
  const r=rowAt(S.sel[S.step]);
  if(kind!=='b')S.leaveArm=false;
  if(kind==='up'||kind==='down'){const ok=selectable(cur.rows),k=ok.indexOf(S.sel[S.step]);const nk=kind==='up'?Math.max(0,k-1):Math.min(ok.length-1,k+1);if(nk!==k){S.sel[S.step]=ok[nk]}render();return}
  if(kind==='left'||kind==='right'){if(r&&r[kind])r[kind]();render();return}
  if(kind==='a'){if(r&&r.input){focusInput(S.sel[S.step]);return}if(r&&r.a)r.a();render();return}
  if(kind==='b'){if(S.swap){S.swap=null}else prevStep();render();return}
  if(kind==='l'){if(inCreator())prevStep();render();return}
  if(kind==='r'){if(inCreator())nextStep();render();return}
  if(kind==='select'){if(r&&r.sel)r.sel();render();return}
  if(kind==='start'){
    if(S.step==='team')startGame();
    else if(S.step==='dossier'&&!S.view)done();
    else if(inCreator()){const g=gate(S.a,'profession');if(g)toast(g);else goto('dossier')}
    if(!(window.BLG&&BLG.active))render();return}
}
function focusInput(i){const el=list.querySelector(`.row[data-i="${i}"] input`);if(el){el.focus();const n=el.value.length;try{el.setSelectionRange(n,n)}catch(e){}}}
// Buttons and keyboard are shared (engine/input.js). While the game screen is up every press goes to the engine; otherwise to the creator.
StudioInput.start({press:k=>window.BLG&&BLG.active?BLG.input(k):act(k),walking:()=>!!(window.BLG&&BLG.active),hold:(d,on)=>{if(window.BLG)BLG.hold(d,on)}});
// taps on rows
list.addEventListener('click',e=>{
  const row=e.target.closest('.row');if(!row)return;const i=+row.dataset.i;const r=rowAt(i);if(!r)return;
  const actEl=e.target.closest('[data-act]');
  if(e.target.tagName==='INPUT'){if(S.sel[S.step]!==i){S.sel[S.step]=i;list.querySelectorAll('.row.on').forEach(x=>x.classList.remove('on'));row.classList.add('on')}return}
  S.sel[S.step]=i;S.leaveArm=false;
  if(actEl){r[actEl.dataset.act]&&r[actEl.dataset.act]();if(!(window.BLG&&BLG.active))render(false);return}
  if(r.input){render(false);focusInput(i);return}
  if(r.a)r.a();
  if(!(window.BLG&&BLG.active))render(false);
});
list.addEventListener('input',e=>{const t=e.target,b=t.dataset.bind;if(!b)return;
  if(b==='name')S.a.name=t.value;else if(b==='code')S.a.code=t.value.toUpperCase();else if(b==='back')S.a.backstory=t.value;else if(b.startsWith('bond'))S.a.bonds[+b.slice(4)].name=t.value;saveDraft()});
list.addEventListener('focusout',e=>{if(e.target.tagName==='INPUT')setTimeout(()=>{if(!list.contains(document.activeElement)||document.activeElement.tagName!=='INPUT')render(false)},0)});

// ambient: blink + lantern flicker
setInterval(()=>{if(S.step==='identity'&&!(window.BLG&&BLG.active)){drawBig(true);setTimeout(()=>drawBig(false),140)}},3200);
setInterval(()=>{if(S.step==='title'&&!(window.BLG&&BLG.active))drawLantern()},180);

window.BL={key:K,S,PROFS,ITEMDEF,WEAP,specOf,profOf,derived,skillVal,newAgent,fromTemplate,drawPortrait,portraitURL,store,render,goto,toast,esc,pick,rnd,SKILLS,HAIRC,SKIN,OUTC};
render();
})();
