// Rushlight · creator.js
// Everything from the title screen to "Sign them on" (spec 003, slice part A): the title (New run, Continue, Ledger, Import),
// the run seed, Pick a company (6 templates and Blank, three seat cards, Keep · Reroll · Tweak · Rebuild), the full creator
// (7 steps), the Muster roll, the save keys with their version number and upgrade steps, and the save code.
// Also the shell's own screens (rows in the HTML screen, tapped or moved with the D-pad) and where presses go. Exposes window.RL.
// Needs strings.js (window.RLS), species-art.js (window.RLSP) and engine/seed.js (StudioSeed) loaded first.
(()=>{
const {STATS,STATNAME,SKILLS,SPECIES,SIZE,TRADES,TEMPLATES,MOTIVES,KIN,ITEMS,STEPNAME}=window.RLS;
const ORDER=RLSP.ORDER;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const tradeOf=id=>TRADES.find(t=>t.id===id);
const T=(id,o)=>window.RLT(id,o);

// ================= SAVES =================
// Keys start with rl. on Release and dev.rl. on Dev (engine/studio.js). Outside the site (the checks) they stay rl.
const RLP=window.Studio?Studio.savePrefix('rl.'):'rl.',K=k=>RLP+k;
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{if(v==null)localStorage.removeItem(k);else localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
// The save version (studio-bible/saves.md): each change to what a save holds adds a step here. Old steps never change.
const VERSION=4;
const newLedger=()=>({bestiary:{},dead:[],companies:[]});
// Each step takes the save as one object {run, ledger, draft, legacy} and returns it at the next version.
const STEPS_UP={
 // 0 → 1 (spec 003): the setup copy's Black Lantern-shaped test data (rl.roster, rl.game, an agent draft) goes;
 // nothing in it is a real run. The ledger is made if missing.
 1:o=>{o.legacy=null;if(o.draft&&o.draft.prof)o.draft=null;if(o.run&&!o.run.seed)o.run=null;if(!o.ledger)o.ledger=newLedger();return o},
 // 1 → 2 (spec 004): the company leaves the stand-in town for Harrowford on day 1; the larder is set from the old ration
 // count (15 at most); the region is filled from the run's seed (makeRegion, region.js); each merc starts fed
 2:o=>{const r=o.run;if(r){r.place=null;r.day=1;r.rations=Math.min(15,r.rations|0);r.region=makeRegion(r);(r.party||[]).forEach(m=>{m.hunger=0})}return o},
 // 2 → 3 (spec 005): the boards, the pool's order, givers, hire pools, townsfolk, rumors, factions, the Hue and cry and the
 // between-contracts flags, all filled from the seed as if the company had just arrived (makeTowns, town.js)
 3:o=>{const r=o.run;if(r)makeTowns(r);return o},
 // 3 → 4 (spec 006, D1): empty versions of the job in progress, the fight in progress, each merc's injuries, XP and level
 // picks, and the ledger's bestiary and dead; everything else kept
 4:o=>{const r=o.run;if(r){r.job=r.job||null;r.fight=null;r.rests=r.rests|0;(r.party||[]).forEach(m=>{m.inj=m.inj||[];m.xp=m.xp|0;m.picks=m.picks|0;m.dis=m.dis||[];m.st=m.st||[];m.adapt=m.adapt||{v:0,h:0}})}
  o.ledger=o.ledger||newLedger();o.ledger.bestiary=o.ledger.bestiary||{};o.ledger.dead=o.ledger.dead||[];o.ledger.companies=o.ledger.companies||[];return o}
};
function upgradeSave(o,from){for(let v=from+1;v<=VERSION;v++)o=STEPS_UP[v](o);o.version=VERSION;return o}
// On open: back up older saves first (all rl.* keys in one block), then run each step above the stored version.
function openSaves(){
 let v=store.get(K('version'),null);
 const keys=[];try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k.startsWith(RLP)&&!k.startsWith(RLP+'backup.'))keys.push(k)}}catch(e){}
 if(v==null&&!keys.length){store.set(K('version'),VERSION);store.set(K('ledger'),newLedger());return}
 v=v|0;if(v>=VERSION){if(!store.get(K('ledger'),null))store.set(K('ledger'),newLedger());return}
 const backup={};keys.forEach(k=>{try{backup[k]=localStorage.getItem(k)}catch(e){}});store.set(K('backup.v'+v),backup);
 const o=upgradeSave({run:store.get(K('run'),null),ledger:store.get(K('ledger'),null),draft:store.get(K('draft'),null)},v);
 ['roster','game'].forEach(k=>store.set(K(k),null));
 store.set(K('run'),o.run);store.set(K('ledger'),o.ledger);store.set(K('draft'),o.draft);store.set(K('version'),VERSION);
}
// The save code: rl.version, rl.run and rl.ledger as one line of text
function exportCode(){const o={version:store.get(K('version'),VERSION),run:store.get(K('run'),null),ledger:store.get(K('ledger'),null)};
 return 'RL1:'+btoa(unescape(encodeURIComponent(JSON.stringify(o))))}
function readCode(code){try{code=String(code).trim();if(!code.startsWith('RL1:'))return null;const o=JSON.parse(decodeURIComponent(escape(atob(code.slice(4).replace(/\s+/g,'')))));
 if(!o||typeof o!=='object'||!('run' in o)||!('ledger' in o))return null;return upgradeSave({run:o.run,ledger:o.ledger||newLedger(),draft:null},o.version|0)}catch(e){return null}}
function applyCode(o){store.set(K('run'),o.run);store.set(K('ledger'),o.ledger);store.set(K('version'),VERSION)}

// ================= SEEDS =================
// A seed is four digits, a dash and a letter (4471-K): 260,000 seeds (spec 003, 2).
const LET='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const seedNum=s=>{const m=/^(\d{4})-?([A-Z])$/i.exec(String(s).trim());return m?(+m[1])*26+LET.indexOf(m[2].toUpperCase()):null};
const seedText=n=>String(Math.floor(n/26)).padStart(4,'0')+'-'+LET[n%26];
const randomSeed=()=>seedText(Math.floor(Math.random()*260000));
// The run seed makes three streams: the world (region n is the seed plus n), the muster and the dice.
const streams=n=>({world:StudioSeed.stream(n+1).save(),muster:StudioSeed.stream(StudioSeed.hash('muster:'+n)).save(),dice:StudioSeed.stream(StudioSeed.hash('dice:'+n)).save()});

// ================= ROLLING A MERC =================
const given=()=>Object.keys(window.RL_TEXT||{}).filter(k=>RL_TEXT[k].p==='name.given').map(k=>RL_TEXT[k].t)
 .filter(n=>!['Pell','Hester'].includes(n));  // the slice's own cast keep their names (dev-notes, spec 003)
function roll4d6(R){const r=[0,0,0,0].map(()=>1+R.int(6)).sort((a,b)=>a-b);return r[1]+r[2]+r[3]}
function pickName(R,used){const pool=given().filter(n=>!used.includes(n));const n=pool.length?pool[R.int(pool.length)]:'Nameless';used.push(n);return n}
const tradeBase=(tr,k)=>{if(!tr)return SKILLS[k];if(tr.strong.includes(k))return 50;if(tr.backup.includes(k))return ['Melee','Dodge','Athletics'].includes(k)?40:30;return SKILLS[k]};
// A creator draft {trade, base stats, picks, name, sp, look, back, kin, mot, main} becomes a full merc (spec 003, 7)
function finalStats(c){const S=SPECIES[c.sp],o={};STATS.forEach(k=>o[k]=clamp((c.base[k]|0)+(S&&S.up===k?2:0)-(S&&S.down===k?2:0),3,18));return o}
function skillsOf(c){const tr=tradeOf(c.trade),S=SPECIES[c.sp]||{},sz=SIZE[S.size]||{},o={};
 Object.keys(SKILLS).forEach(k=>{let v=Math.min(80,tradeBase(tr,k)+20*((c.picks||{})[k]|0));if(k==='Stealth')v+=sz.Stealth|0;if(S.skill&&S.skill[k])v+=S.skill[k];o[k]=v});return o}
function rawSkill(c,k){return Math.min(80,tradeBase(tradeOf(c.trade),k)+20*((c.picks||{})[k]|0))}
function backText(c){return c.backT!=null?c.backT:c.back?T(c.back):''}
function build(c,prev){
 const st=finalStats(c),S=SPECIES[c.sp],tr=tradeOf(c.trade),sz=SIZE[S.size];
 const hp=Math.ceil((st.STR+st.CON)/2)+sz.hp,wp=st.POW,san=st.POW*5;
 const m={id:c.id,c:JSON.parse(JSON.stringify(c)),name:c.name,sp:c.sp,trade:tr.name,tradeId:tr.id,look:Object.assign({},c.look),stats:st,sk:skillsOf(c),
  size:S.size,trait:S.trait,lvl:1,xp:0,hp,mhp:hp,wp,mwp:wp,san,msan:san,bp:san-wp,back:backText(c),
  kin:{type:c.kin.type,name:c.kin.name,bond:st.CHA},bonds:{},mot:c.mot.slice(),main:c.main|0,adapt:{v:0,h:0},dis:[],st:[],nick:[],ko:false};
 // gear (spec 003, 7): the trade's weapon in WPN 1, a knife in WPN 2 (the Scribe's knife is WPN 1, WPN 2 empty), armor, the kit item
 m.gear={w1:{id:tr.weapon,wear:0},w2:tr.weapon==='knife'?null:{id:'knife',wear:0},body:null,head:null,hand:'w1'};
 tr.armor.forEach(a=>{const it=ITEMS[a];m.gear[it.slot]={id:a,wear:0}});
 m.slots=[{id:tr.kit,n:tr.n,kit:true}];
 return m;
}
// Rolling a merc for a template seat, a Reroll or a hire (spec 003, 4), all from the muster stream R
function rollDraft(R,tradeId,used,o={}){
 const tr=tradeOf(tradeId),vals=[0,1,2,3,4,5].map(()=>roll4d6(R)).sort((a,b)=>b-a),base={};
 base[tr.key[0]]=vals[0];base[tr.key[1]]=vals[1];
 const rest=STATS.filter(k=>!tr.key.includes(k)),left=vals.slice(2);
 rest.forEach(k=>{base[k]=left.splice(R.int(left.length),1)[0]});
 const sp=ORDER[R.int(ORDER.length)],picks={};
 const job=[...tr.strong,...tr.backup];
 if(o.bumps){ // hires: 2-3 bumps (strong, backup, then maybe an odd hobby)
  picks[tr.strong[R.int(2)]]=1;picks[tr.backup[R.int(2)]]=1;
  if(o.bumps>2){const odd=Object.keys(SKILLS).filter(k=>!job.includes(k));picks[odd[R.int(odd.length)]]=1}
 }else{
  job.forEach(k=>picks[k]=1);const b=tr.backup[R.int(2)];picks[b]=2;
  const odd=Object.keys(SKILLS).filter(k=>!job.includes(k));for(let i=0;i<3;i++){const k=odd.splice(R.int(odd.length),1)[0];picks[k]=1}
 }
 const name=pickName(R,used),look={shade:R.int(3),mark:R.int(4),neck:R.int(3)};
 const back=`BK-${tr.bk}-${1+R.int(2)}`,kin={type:KIN[R.int(4)],name:pickName(R,used)};
 const ms=MOTIVES.slice(),mot=[ms.splice(R.int(ms.length),1)[0],ms.splice(R.int(ms.length),1)[0]];
 return {id:'m'+Math.floor(R.next()*1e9).toString(36),trade:tradeId,method:'roll',base,rerolls:1,picks,name,sp,look,back,backT:null,kin,mot,main:R.int(2),done:true};
}
const freeNames=(c,used)=>{[c.name,c.kin&&c.kin.name].forEach(n=>{const i=used.indexOf(n);if(i>=0)used.splice(i,1)})};

// ================= STATE =================
const S={step:'title',sel:{},draft:null,ed:null,confirm:null,review:0,seedIn:'',seedBad:false,importIn:'',importBad:false,pop:null};
function freshDraft(seed){const n=seedNum(seed);return {seed,mpos:streams(n).muster,tpl:null,seats:[null,null,null],kept:[false,false,false],used:[],name:''}}
const muster=()=>StudioSeed.load(S.draft.mpos);
function withMuster(fn){const R=muster();const r=fn(R);S.draft.mpos=R.save();return r}
function saveDraft(){if(S.draft)store.set(K('draft'),Object.assign({},S.draft,{step:S.step,ed:S.ed,review:S.review}))}
function pickTemplate(i){const d=S.draft,tp=TEMPLATES[i];
 d.seats.forEach(c=>{if(c)freeNames(c,d.used)});d.tpl=tp.id;d.kept=[false,false,false];
 d.seats=tp.trades.length?withMuster(R=>tp.trades.map(t=>rollDraft(R,t,d.used))):[null,null,null];S.pop=null}
function reroll(i){const d=S.draft,c=d.seats[i];freeNames(c,d.used);d.seats[i]=withMuster(R=>rollDraft(R,c.trade,d.used));d.kept[i]=false}

// ================= THE SCREENS =================
const R_=(label,o={})=>Object.assign({label},o);
const ST=html=>({static:html});
const V={};
const runSaved=()=>{const r=store.get(K('run'),null);return r&&!r.ended?r:null};
const ledgerHas=()=>{const l=store.get(K('ledger'),null);return !!(l&&l.companies&&l.companies.length)};
function goto(step){S.step=step;S.pop=null;saveDraft()}
function ask(q,yes,no,labels){S.confirm={q,yes,no,labels:labels||['Yes','No'],back:S.step};S.step='confirm'}

V.title=()=>({rows:[
 ST(`<canvas class="lantern pix" id="lantern" width="96" height="96" style="border:0;background:transparent"></canvas><div class="logo">RUSHLIGHT<small>THE WITHY MARCH</small></div>`),
 R_('New run',{a:newRun}),
 ...(runSaved()?[R_('Continue',{cls:'go',val:esc(runSaved().seed),a:()=>window.RLG&&RLG.resume()})]:[]),
 ...(ledgerHas()&&window.RLG&&RLG.ledger?[R_('Ledger',{a:()=>RLG.ledger()})]:[]),
 R_('Import',{a:()=>{S.importIn='';S.importBad=false;goto('import')}}),
 ...(window.Studio&&Studio.fromShelf?[R_('Game shelf',{val:'◀',a:()=>Studio.toShelf()})]:[]),
 ST(`<div class="small" style="text-align:center;margin-top:6px">Keyboard: arrows · Z = A · X = B · Q/W = L/R · Enter = Start</div>`)],foot:'A: SELECT'});
function newRun(){
 const d=store.get(K('draft'),null);
 const fresh=()=>{if(runSaved())ask('This ends the run you have. The ledger stays.',()=>{abandonRun();toSeed()},()=>goto('title'),['End it','Keep it']);else toSeed()};
 if(d&&d.seed&&d.seats)ask('Pick up the company you were making?',()=>{S.draft=d;S.ed=d.ed||null;S.review=d.review|0;goto(d.step&&V[d.step]&&d.step!=='confirm'?d.step:'company')},()=>{store.set(K('draft'),null);S.draft=null;fresh()});
 else fresh();
}
function toSeed(){S.seedIn=randomSeed();S.seedBad=false;S.typed='';goto('seed')}
// A run ended by a new one is abandoned: its mercs go into the ledger as having left the company (spec 003, 1)
function abandonRun(){const r=runSaved();if(!r)return;const L=store.get(K('ledger'),null)||newLedger();L.companies=L.companies||[];
 L.companies.unshift({name:r.company&&r.company.name||'The company',seed:r.seed,end:'abandoned',contracts:r.done|0,great:0,days:r.day|0,
  mercs:(r.joined||r.party||[]).map(m=>({name:m.name,nick:m.nick||[],end:'LG-END-LEFT'}))});
 store.set(K('ledger'),L);store.set(K('run'),null)}
V.seed=()=>({rows:[
 ST('<h3>THE RUN SEED</h3><div>The same seed gives the same first company and the same March.</div>'),
 R_('Random seed',{val:esc(S.seedIn),a:()=>startPick(S.seedIn)}),
 R_('Type a seed',{input:{bind:'seed',value:S.typed||'',ph:'4471-K',max:6}}),
 R_('Start with this seed ▶',{cls:'go',a:()=>{if(seedNum(S.typed||'')==null){S.seedBad=true;return}startPick(seedText(seedNum(S.typed)))}}),
 ...(S.seedBad?[ST('<span class="red">Four numbers and a letter, like 4471-K</span>')]:[])],foot:'A: PICK · B: BACK'});
function startPick(seed){S.draft=freshDraft(seed);S.ed=null;S.review=0;pickTemplate(0);goto('company')}

// ---- Pick a company (Mockup 6, rushlight-mockups-company-v1) ----
const topSkills=c=>{const s=skillsOf(c);return Object.keys(s).sort((a,b)=>s[b]-s[a]||(a<b?-1:1)).slice(0,3).map(k=>`${k} ${s[k]}`).join(' · ')};
const face=(c,px)=>`<canvas class="face" data-sp="${c.sp}" data-look="${c.look.shade}${c.look.mark}${c.look.neck}" width="${px}" height="${px}"></canvas>`;
function seatCard(i){const d=S.draft,c=d.seats[i],tr=c&&tradeOf(c.trade),on=S.sel.company===seatRow(i),pop=S.pop&&S.pop.seat===i;
 if(!c)return `<div class="seat empty">EMPTY SEAT ${i+1}<span>A: make a merc</span></div>`;
 const acts=['KEEP','REROLL','TWEAK','REBUILD'];
 return `<div class="seat ${on?'on':''} ${d.kept[i]?'kept':''}">${face(c,40)}<div class="si"><div><b>${esc((c.name||'?').toUpperCase())}</b> <span>${esc(SPECIES[c.sp].name.toLowerCase())} · ${esc(tr.name.toLowerCase())}</span>${d.kept[i]?' <i>✓</i>':''}</div>
  <div>${esc(topSkills(c))}</div><div class="dim">Main: ${esc(c.mot[c.main])} · kin: ${esc(c.kin.name)}, ${esc(c.kin.type.toLowerCase())}</div><div class="bk">${esc(backText(c))}</div>
  ${pop?`<div class="acts">${acts.map((a,k)=>`<em class="${S.pop.sel===k?'on':''}" data-act="pop${k}">${a}</em>`).join('')}</div>`:''}</div></div>`}
const seatRow=i=>8+i;
V.company=()=>{const d=S.draft,tp=TEMPLATES.find(t=>t.id===d.tpl)||TEMPLATES[0],ready=d.seats.every(Boolean);
 const rows=TEMPLATES.map((t,i)=>R_(`<b class="${t.id===d.tpl?'hi':''}">${esc(t.name)}</b>`,{cls:'tpl',val:`<span class="small">${t.trades.length?t.trades.map(x=>tradeOf(x).short).join(' · '):'full creator, any trades'}</span>`,a:()=>{if(t.id!==d.tpl||t.id!=='blank')pickTemplate(i)}}));
 rows.push(ST(`<div class="small">${esc(T(tp.line))}</div>`));
 [0,1,2].forEach(i=>rows.push(R_(seatCard(i),{cls:'seatrow',a:()=>seatA(i),left:S.pop&&S.pop.seat===i?()=>{S.pop.sel=(S.pop.sel+3)%4}:null,right:S.pop&&S.pop.seat===i?()=>{S.pop.sel=(S.pop.sel+1)%4}:null,pop:k=>{S.pop={seat:i,sel:k};seatA(i)}})));
 rows.push(R_(`START ▸ sign them on`,{cls:ready?'go':'dim',val:'30 gr · 9 rations',a:()=>{if(ready){S.review=0;goto('review')}}}));
 return {rows,foot:'A: PICK · B: BACK',seed:d.seed,back:()=>{if(S.pop){S.pop=null;return}goto('title')}}};
function seatA(i){const d=S.draft,c=d.seats[i];
 if(!c){openCreator(i,null);return}
 if(!S.pop||S.pop.seat!==i){S.pop={seat:i,sel:0};return}
 const k=S.pop.sel;S.pop=null;
 if(k===0)d.kept[i]=true;
 else if(k===1)reroll(i);
 else if(k===2){S.ed={seat:i,c:JSON.parse(JSON.stringify(c)),tweak:true};goto('tweak')}
 else openCreator(i,c);
}
// ---- Tweak: name, species, face, backstory, kin name, motivations ----
V.tweak=()=>{const c=S.ed.c,tr=tradeOf(c.trade);return {rows:[
 R_('Name',{input:{bind:'name',value:c.name,ph:'Name',max:14}}),
 R_('Species',{val:esc(SPECIES[c.sp].name),left:()=>cycleSp(c,-1),right:()=>cycleSp(c,1),a:()=>cycleSp(c,1)}),
 ...faceRows(c),
 R_('Backstory',{val:'<span class="small">roll</span>',a:()=>{c.backT=null;c.back=c.back===`BK-${tr.bk}-1`?`BK-${tr.bk}-2`:`BK-${tr.bk}-1`}}),
 ST(`<div class="small">${esc(backText(c))}</div>`),
 R_('Kin name',{input:{bind:'kin',value:c.kin.name,ph:'Kin name',max:14}}),
 R_('Motivations',{val:esc(c.mot.join(', ')),a:()=>{S.ed.from='tweak';goto('motives')}}),
 R_('Done ▶',{cls:'go',a:()=>{const d=S.draft;freeNames(d.seats[S.ed.seat],d.used);d.used.push(c.name,c.kin.name);d.seats[S.ed.seat]=c;d.kept[S.ed.seat]=false;S.ed=null;goto('company')}})],
 pane:`<div class="mpane">${face(c,64)}<div class="small">${esc(SPECIES[c.sp].size)} · ${esc(SPECIES[c.sp].trait)}</div><div class="small">${esc(speciesLine(c.sp))}</div></div>`,side:true,foot:'◀ ▶ CHANGE · B: CANCEL',back:()=>{S.ed=null;goto('company')}}};
const speciesLine=k=>{const S2=SPECIES[k];return `${S2.up} +2, ${S2.down} −2. ${S2.tdesc}`};
function cycleSp(c,d){c.sp=ORDER[(ORDER.indexOf(c.sp)+d+ORDER.length)%ORDER.length]}
function faceRows(c){const L=c.look,cy=(k,n,d)=>{L[k]=(L[k]+d+n)%n};
 return [R_('Coat',{val:['lighter','middle','darker'][L.shade],left:()=>cy('shade',3,-1),right:()=>cy('shade',3,1),a:()=>cy('shade',3,1)}),
  R_('Mark',{val:['none','scar','torn ear','grey muzzle'][L.mark],left:()=>cy('mark',4,-1),right:()=>cy('mark',4,1),a:()=>cy('mark',4,1)}),
  R_('Neckwear',{val:['none','kerchief','hood'][L.neck],left:()=>cy('neck',3,-1),right:()=>cy('neck',3,1),a:()=>cy('neck',3,1)})]}

// ---- The full creator: 7 steps, L/R between them ----
const CSTEPS=['trade','stats','skills','identity','kin','motives','muster'];
function openCreator(seat,c){const d=S.draft;
 const nc=c?JSON.parse(JSON.stringify(c)):{id:'m'+Math.floor(Math.random()*1e9).toString(36),trade:null,method:'roll',base:null,rerolls:1,picks:{},name:'',sp:'hare',look:{shade:1,mark:0,neck:0},back:null,backT:null,kin:{type:'Sibling',name:''},mot:[],main:0};
 S.ed={seat,c:nc,lock:!!c};goto(c?'stats':'trade')}
const picksLeft=c=>8-Object.values(c.picks).reduce((a,b)=>a+b,0);
const buyLeft=c=>72-STATS.reduce((t,k)=>t+(c.base[k]|0),0);
function cStep(d){const i=CSTEPS.indexOf(S.step),j=i+d;if(j<0){if(S.ed.lock||!S.ed.c.trade){S.ed=null;goto('company')}else goto('trade');return}
 if(j>=CSTEPS.length)return;const why=stepWhy(S.step);if(d>0&&why){toast(why);return}if(S.ed.lock&&CSTEPS[j]==='trade')return;goto(CSTEPS[j])}
function stepWhy(st){const c=S.ed.c;if(st==='trade'&&!c.trade)return'PICK A TRADE';if(st==='stats'&&(!c.base||c.method==='buy'&&buyLeft(c)!==0))return c.base?'SPEND EXACTLY 72 POINTS':'ROLL OR BUY STATS';
 if(st==='identity'&&!c.name.trim())return'NAME THEM';if(st==='kin'&&!c.kin.name.trim())return'NAME THE KIN';if(st==='motives'&&c.mot.length!==2)return'PICK 2 MOTIVATIONS';return''}
const stepFoot='L/R: STEP · A: PICK · B: BACK';
V.trade=()=>({rows:TRADES.map(t=>R_(`${S.ed.c.trade===t.id?'<b class="hi">':''}${esc(t.name)}${S.ed.c.trade===t.id?'</b>':''}`,{val:`<span class="small">${t.strong.join(', ')} · ${t.backup.join(', ')} · ${t.key.join('/')}</span>`,cls:'wrap',
 a:()=>{const c=S.ed.c;if(c.trade!==t.id){c.trade=t.id;c.picks={};c.back=`BK-${t.bk}-1`;c.backT=null}goto('stats')}})),foot:stepFoot,step:1});
V.stats=()=>{const c=S.ed.c,sp=SPECIES[c.sp],rows=[
 R_('Method',{val:c.method==='roll'?'Roll 4d6':'Point buy (72)',left:()=>flipMethod(c),right:()=>flipMethod(c),a:()=>flipMethod(c)})];
 if(c.method==='roll'){rows.push(R_(c.base?`Reroll all (${c.rerolls} left)`:'Roll',{cls:c.base&&!c.rerolls?'dim':'',a:()=>{if(!c.base||c.rerolls>0){if(c.base)c.rerolls--;c.base=withMuster(R=>Object.fromEntries(STATS.map(k=>[k,roll4d6(R)])))}}}));
  if(c.base)rows.push(ST(`<div class="kv">${STATS.map(k=>`<span>${k}</span><span>${c.base[k]}</span>`).join('')}</div>`))}
 else{if(!c.base||c.base._buy!==1)c.base=Object.assign(Object.fromEntries(STATS.map(k=>[k,12])),{_buy:1});
  STATS.forEach(k=>rows.push(R_(STATNAME[k],{val:String(c.base[k]),left:()=>{if(c.base[k]>3)c.base[k]--},right:()=>{if(c.base[k]<18&&buyLeft(c)>0)c.base[k]++}})));
  rows.push(ST(`Points left: <b class="${buyLeft(c)?'red':'grn'}">${buyLeft(c)}</b>`))}
 rows.push(ST(`<div class="small">Species changes (${esc(sp.name)}): ${sp.up} +2, ${sp.down} −2, kept between 3 and 18. Set the species on step 4.</div>`));
 rows.push(R_('Next ▶',{cls:'go',a:()=>cStep(1)}));return {rows,foot:stepFoot,step:2}};
function flipMethod(c){c.method=c.method==='roll'?'buy':'roll';c.base=null;c.rerolls=1}
V.skills=()=>{const c=S.ed.c;const rows=[ST(`Picks left: <b class="hi">${picksLeft(c)}</b> of 8 · +20% each, cap 80%`)];
 Object.keys(SKILLS).forEach(k=>{const v=rawSkill(c,k),n=c.picks[k]|0;rows.push(R_(esc(k)+(n?` <span class="pip">${'+'.repeat(n)}</span>`:''),{val:`${skillsOf(c)[k]}%`,left:()=>{if(n){c.picks[k]--;if(!c.picks[k])delete c.picks[k]}},right:()=>{if(picksLeft(c)>0&&v+20<=80)c.picks[k]=n+1},a:()=>{if(picksLeft(c)>0&&v+20<=80)c.picks[k]=n+1;else if(n){c.picks[k]--;if(!c.picks[k])delete c.picks[k]}}}))});
 rows.push(R_('Next ▶',{cls:'go',a:()=>cStep(1)}));return {rows,foot:'◀ UNPICK · ▶ PICK · L/R: STEP',step:3}};
V.identity=()=>{const c=S.ed.c,tr=tradeOf(c.trade);return {rows:[
 R_('Name',{input:{bind:'name',value:c.name,ph:'Name',max:14}}),
 R_('Roll a name',{a:()=>{const d=S.draft;freeNames({name:c.name},d.used);c.name=withMuster(R=>pickName(R,d.used))}}),
 R_('Species',{val:esc(SPECIES[c.sp].name),left:()=>cycleSp(c,-1),right:()=>cycleSp(c,1),a:()=>cycleSp(c,1)}),
 ...faceRows(c),
 R_('Backstory',{val:'<span class="small">roll</span>',a:()=>{c.backT=null;c.back=c.back===`BK-${tr.bk}-1`?`BK-${tr.bk}-2`:`BK-${tr.bk}-1`}}),
 R_('Or type one',{input:{bind:'back',value:c.backT||'',ph:'One line',max:60}}),
 ST(`<div class="small">${esc(backText(c))}</div>`),
 R_('Next ▶',{cls:'go',a:()=>cStep(1)})],
 pane:`<div class="mpane">${face(c,64)}<div class="small"><b>${esc(SPECIES[c.sp].name)}</b> · ${esc(SPECIES[c.sp].size)}</div><div class="small">${esc(speciesLine(c.sp))}</div></div>`,side:true,foot:stepFoot,step:4}};
V.kin=()=>{const c=S.ed.c,cha=c.base?finalStats(c).CHA:'?';return {rows:[
 R_('Kin',{val:esc(c.kin.type),left:()=>{c.kin.type=KIN[(KIN.indexOf(c.kin.type)+3)%4]},right:()=>{c.kin.type=KIN[(KIN.indexOf(c.kin.type)+1)%4]},a:()=>{c.kin.type=KIN[(KIN.indexOf(c.kin.type)+1)%4]}}),
 R_('Name',{input:{bind:'kin',value:c.kin.name,ph:'Kin name',max:14}}),
 R_('Roll a name',{a:()=>{const d=S.draft;freeNames({kin:{name:c.kin.name}},d.used);const i=d.used.indexOf(c.kin.name);if(i>=0)d.used.splice(i,1);c.kin.name=withMuster(R=>pickName(R,d.used))}}),
 ST(`Kin Bond starts at CHA: <b class="hi">${cha}</b>. Comrade Bonds start at 1.`),
 R_('Next ▶',{cls:'go',a:()=>cStep(1)})],foot:stepFoot,step:5}};
V.motives=()=>{const c=S.ed.c;const rows=[ST('Pick 2, then mark one Main.')];
 MOTIVES.forEach(m=>{const i=c.mot.indexOf(m);rows.push(R_(esc(m)+(i>=0?` <span class="tag mine">${c.main===i?'MAIN':'✓'}</span>`:''),{a:()=>{if(i>=0){c.mot.splice(i,1);c.main=0}else if(c.mot.length<2)c.mot.push(m)}}))});
 rows.push(R_('Main',{val:esc(c.mot[c.main]||'—'),left:()=>{c.main=c.mot.length>1?1-c.main:0},right:()=>{c.main=c.mot.length>1?1-c.main:0},a:()=>{c.main=c.mot.length>1?1-c.main:0}}));
 if(S.ed.from==='tweak')rows.push(R_('Done ▶',{cls:'go',a:()=>{if(c.mot.length===2){S.ed.from=null;goto('tweak')}}}));
 else rows.push(R_('Next ▶',{cls:'go',a:()=>cStep(1)}));
 return {rows,foot:stepFoot,step:S.ed.from?0:6,back:S.ed.from==='tweak'?()=>{if(c.mot.length===2){S.ed.from=null;goto('tweak')}}:null}};
// The Muster roll: the whole merc on one page (spec 003, 7)
function musterHTML(m,seed){const g=m.gear,it=x=>x?ITEMS[x.id].name:'—';
 const above=Object.keys(SKILLS).filter(k=>m.sk[k]>SKILLS[k]).map(k=>`${k} ${m.sk[k]}`).join(' · ');
 return `<div class="muster"><div class="mh">${face(m,48)}<div><b class="hi">${esc(m.name.toUpperCase())}</b><div>${esc(SPECIES[m.sp].name)} · ${esc(m.trade)}</div><div class="small">${esc(m.size)} · ${esc(m.trait)}</div></div><span class="seedtag">${esc(seed)}</span></div>
 <div class="kv6">${STATS.map(k=>`<span>${k}<b>${m.stats[k]}</b></span>`).join('')}</div>
 <div>HP <b>${m.mhp}</b> · WP <b>${m.mwp}</b> · SAN <b>${m.msan}</b> · Breaking Point <b>${m.bp}</b> · Luck 50%</div>
 <div class="small">${esc(above)}</div>
 <div>Kin: ${esc(m.kin.name)}, ${esc(m.kin.type.toLowerCase())} · Bond ${m.kin.bond}</div>
 <div>Motivations: ${m.mot.map((x,i)=>i===m.main?`<b class="hi">${esc(x)} (Main)</b>`:esc(x)).join(', ')}</div>
 <div class="small">WPN 1 ${esc(it(g.w1))} · WPN 2 ${esc(it(g.w2))} · BODY ${esc(it(g.body))} · HEAD ${esc(it(g.head))} · KIT ${esc(m.slots.map(s=>ITEMS[s.id].name+(s.n>1?' ×'+s.n:'')).join(', '))}</div>
 <div class="bk">${esc(m.back)}</div></div>`}
V.muster=()=>{const c=S.ed.c,why=['trade','stats','identity','kin','motives'].map(stepWhy).find(Boolean);
 return {rows:[why?ST(`<span class="red">${why}</span>`):ST(musterHTML(build(c),S.draft.seed)),
  R_('Sign on ▶',{cls:why?'dim':'go',a:()=>{if(why)return;const d=S.draft,old=d.seats[S.ed.seat];if(old&&old.name!==c.name)freeNames(old,d.used);
   [c.name,c.kin.name].forEach(n=>{if(!d.used.includes(n))d.used.push(n)});c.done=true;d.seats[S.ed.seat]=c;d.kept[S.ed.seat]=true;S.ed=null;goto('company')}})],foot:stepFoot,step:7}};
// START: the Muster roll for the whole company, one page each, L/R to flip; Sign them on starts the run
V.review=()=>{const d=S.draft,i=S.review,m=build(d.seats[i]);
 return {rows:[ST(`<div class="small">Page ${i+1} of 3 · L/R to flip</div>`+musterHTML(m,d.seed)),
  ...(d.tpl==='blank'?[R_('Company name',{input:{bind:'cname',value:d.name||'',ph:'Name your company',max:22}})]:[]),
  R_('Sign them on ▶',{cls:'go',a:signOn})],foot:'L/R: FLIP · A: SIGN · B: BACK',back:()=>goto('company')}};
// Sign them on: the run begins (spec 003, 7 and 10)
function signOn(){const d=S.draft,n=seedNum(d.seed),st=streams(n),tp=TEMPLATES.find(t=>t.id===d.tpl);
 st.muster=d.mpos;
 const party=d.seats.map(c=>build(c));party.forEach(m=>party.forEach(o=>{if(o!==m)m.bonds[o.id]=1}));
 const run={seed:d.seed,seedN:n,streams:st,company:{tpl:d.tpl,name:d.tpl==='blank'?(d.name||'').trim()||'The company':tp.name},
  party,joined:party.map(m=>({id:m.id,name:m.name,nick:[]})),lead:0,purse:30,rations:9,pack:[],used:d.used.slice(),day:1,done:0,place:null};
 store.set(K('run'),run);store.set(K('draft'),null);S.draft=null;S.ed=null;S.step='title';
 if(window.RLG)RLG.begin(run);
}
V.confirm=()=>{const c=S.confirm;return {rows:[ST(`<div style="padding:8px 0">${esc(c.q)}</div>`),R_(c.labels[0],{cls:'go',a:()=>{S.confirm=null;c.yes()}}),R_(c.labels[1],{a:()=>{S.confirm=null;c.no()}})],foot:'A: PICK',back:()=>{S.confirm=null;c.no()}}};
V.import=()=>({rows:[ST('Paste a save code.'),R_('Code',{input:{bind:'import',value:S.importIn,ph:'RL1:…',max:200000}}),
 R_('Read it ▶',{cls:'go',a:()=>{const o=readCode(S.importIn);if(!o){S.importBad=true;return}ask('Replace your run and ledger with this one?',()=>{applyCode(o);toast('LOADED');goto('title')},()=>goto('title'))}}),
 ...(S.importBad?[ST('<span class="red">That code doesn\'t read</span>')]:[])],foot:'A: PICK · B: BACK'});

// ================= RENDER =================
const list=$('#list'),pane=$('#pane'),body=$('#body'),screen=$('#screen');
function $(s){return document.querySelector(s)}
let cur=null;
function selectable(rows){return rows.map((r,i)=>r.static?null:i).filter(i=>i!==null)}
function fixSel(rows){const ok=selectable(rows);let s=S.sel[S.step]??ok[0];if(!ok.includes(s)){s=ok.find(i=>i>=s)??ok[ok.length-1]}S.sel[S.step]=s;return s}
function render(scroll=true){
 if(!V[S.step])S.step='title';
 cur=V[S.step]();
 const s=fixSel(cur.rows);
 $('#hTitle').textContent=STEPNAME[S.step]||'';
 $('#hStep').textContent=cur.seed?'SEED '+cur.seed:cur.step?`${cur.step}/7`:S.draft&&S.step!=='title'&&S.step!=='seed'?'SEED '+S.draft.seed:'';
 list.innerHTML=cur.rows.map((r,i)=>r.static?`<div class="static">${r.static}</div>`:
  `<div class="row ${i===s?'on':''} ${r.cls||''}" data-i="${i}"><span class="cur">▶</span>${r.input?`<input data-bind="${r.input.bind}" value="${esc(r.input.value)}" placeholder="${esc(r.input.ph)}" maxlength="${r.input.max||28}" autocomplete="off" spellcheck="false">`:`<span class="lab">${r.label}</span>`}<span class="val">${r.left?'<b data-act="left">◀</b>':''}${r.val??''}${r.right?'<b data-act="right">▶</b>':''}</span></div>`).join('');
 body.classList.toggle('side',!!cur.side);
 pane.innerHTML=cur.pane||'';
 document.querySelectorAll('#screen canvas.face').forEach(c=>{const L=c.dataset.look,x=c.getContext('2d');x.imageSmoothingEnabled=false;x.drawImage(RLSP.portrait(c.dataset.sp,{shade:+L[0],mark:+L[1],neck:+L[2]}),0,0,64,64,0,0,c.width,c.height)});
 if(S.step==='title')drawLantern();
 $('#ftr').textContent=cur.foot||'';
 if(scroll){const el=list.querySelector('.row.on');if(el)el.scrollIntoView({block:'nearest'});if(s===selectable(cur.rows)[0])list.scrollTop=0}
 saveDraft();
}
function drawLantern(){const c=$('#lantern');if(!c)return;const x=c.getContext('2d');x.imageSmoothingEnabled=false;x.setTransform(6,0,0,6,0,0);x.clearRect(0,0,16,16);const p=(a,b,w,h,col)=>{x.fillStyle=col;x.fillRect(a,b,w,h)};
 // a lit rushlight in its holder: the pith stem, its flame, and the iron nip that holds it
 const fl=Math.random()<.5;p(7,1,2,3,fl?'#ffe08a':'#d9b45a');p(7,2,2,1,'#fff1c4');p(8,0,1,1,'#d9b45a');p(7,4,2,8,'#c8a552');p(6,6,1,1,'#2c2621');p(9,6,1,1,'#2c2621');p(5,11,6,1,'#2c2621');p(7,12,2,3,'#3b4757');p(4,15,8,1,'#2c2621')}
let toastT;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),1500)}

// ================= INPUT =================
function rowAt(i){return cur.rows[i]}
function act(kind){
 const r=rowAt(S.sel[S.step]);
 if(kind==='up'||kind==='down'){S.pop=null;const ok=selectable(cur.rows),k=ok.indexOf(S.sel[S.step]);const nk=kind==='up'?Math.max(0,k-1):Math.min(ok.length-1,k+1);if(nk!==k)S.sel[S.step]=ok[nk];render();return}
 if(kind==='left'||kind==='right'){if(r&&r[kind])r[kind]();render();return}
 if(kind==='a'){if(r&&r.input){focusInput(S.sel[S.step]);return}if(r&&r.a)r.a();render();return}
 if(kind==='b'){if(cur.back)cur.back();else if(CSTEPS.includes(S.step))cStep(-1);else if(S.step!=='title')goto('title');render();return}
 if(kind==='l'||kind==='r'){const d=kind==='l'?-1:1;if(CSTEPS.includes(S.step)&&!(S.step==='motives'&&S.ed.from))cStep(d);else if(S.step==='review')S.review=(S.review+d+3)%3;render();return}
}
function focusInput(i){const el=list.querySelector(`.row[data-i="${i}"] input`);if(el){el.focus();const n=el.value.length;try{el.setSelectionRange(n,n)}catch(e){}}}
// Buttons and keyboard are shared (engine/input.js). While the game screen is up every press goes to the engine; otherwise here.
StudioInput.start({press:k=>window.RLG&&RLG.active?RLG.input(k):act(k),walking:()=>!!(window.RLG&&RLG.active),hold:(d,on)=>{if(window.RLG)RLG.hold(d,on)}});
list.addEventListener('click',e=>{
 const row=e.target.closest('.row');if(!row)return;const i=+row.dataset.i;const r=rowAt(i);
 const actEl=e.target.closest('[data-act]');
 if(e.target.tagName==='INPUT'){if(S.sel[S.step]!==i){S.sel[S.step]=i;list.querySelectorAll('.row.on').forEach(x=>x.classList.remove('on'));row.classList.add('on')}return}
 if(S.sel[S.step]!==i&&S.pop&&!actEl)S.pop=null;
 S.sel[S.step]=i;
 if(actEl){const k=actEl.dataset.act;if(k.startsWith('pop'))r.pop(+k.slice(3));else if(r[k])r[k]();render(false);return}
 if(r.input){render(false);focusInput(i);return}
 if(r.a)r.a();
 render(false);
});
list.addEventListener('input',e=>{const t=e.target,b=t.dataset.bind;if(!b)return;const c=S.ed&&S.ed.c;
 if(b==='seed'){S.typed=t.value.toUpperCase();S.seedBad=false}else if(b==='import'){S.importIn=t.value;S.importBad=false}
 else if(b==='name'&&c)c.name=t.value;else if(b==='kin'&&c)c.kin.name=t.value;else if(b==='back'&&c)c.backT=t.value||null;else if(b==='cname'&&S.draft)S.draft.name=t.value;saveDraft()});
list.addEventListener('focusout',e=>{if(e.target.tagName==='INPUT')setTimeout(()=>{if(!list.contains(document.activeElement)||document.activeElement.tagName!=='INPUT')render(false)},0)});
setInterval(()=>{if(S.step==='title'&&!(window.RLG&&RLG.active))drawLantern()},180);

window.RL={key:K,S,store,render,goto,toast,esc,build,rollDraft,skillsOf,finalStats,tradeOf,seedNum,seedText,streams,exportCode,readCode,applyCode,openSaves,upgradeSave,VERSION,newLedger,abandonRun,
 // checks (spec 003): the company a seed offers, and its next rerolls
 _t:{draftFor:seed=>{S.draft=freshDraft(seed);pickTemplate(0);return S.draft},pickTemplate,reroll,signOn,S}};
// the saves open and the title draws once every part has loaded (an upgrade step can need region.js)
window.addEventListener('DOMContentLoaded',()=>{openSaves();render()});
})();
