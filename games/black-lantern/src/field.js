// Black Lantern · field.js
// Demo 5 part A (spec 006): the field rules, what happens on the map and in menus.
//   A1 each agent's own kit and items, the backpack, the item screens, Give item, pickups
//   A2 skills at hotspots (the lead's options with their odds), the map menu's Skills row, INT Hunch, failed tries
//   A3 the nine statuses, their ticks on area changes, icons, the low-health pulse, CON shrugs and Retch
//   A4 SAN by the bible: horrors as data, bracing, Steadying, Breaking Points, disorders and flares, Adapted, Luck
//   A5 the map menu: Party, Skills, Items, Case file, Log, Settings, Save; Last time; talked out and dim hotspots
//   A6 losing an agent off the battlefield, Big Hat's three recruits, bl.memorial
// Loaded after engine.js and party-menu.js as a plain script, so it shares their party, G, cx, say, choose, pT and the rest.
// Words come from strings.js; the d100 roll with crits and fumbles is the studio's engine/roll.js.
// Case state that saves with the checkpoint lives in G.fs; each agent's own state lives on its party member,
// and what carries between cases (SAN, disorders, Breaking Point, Adapted marks, gear) goes on the agent (a.cur, a.gear).

const FI=BLS.ITEMS,IU=BLS.ITEMUI,DZ=BLS.DISORDERS,SW=BLS.SANW,MMW=BLS.MAPMENU,SOPT=BLS.SKILLOPT,SKW=BLS.SKILLW,REC=BLS.RECRUITS,RW=BLS.RECRUITW;
const SR=StudioRoll;
const fillT=(t,o)=>String(t).replace(/\{(\w+)\}/g,(x,k)=>k.length===1||k in o?o[k]??'':x);  // {n} and longer keys ({wn}); unknown long ones like {code} stay
const live=()=>party.filter(m=>!m.gone);

// ================= SETTINGS (bl.settings) =================
const settings=()=>{const s=store.get(B.key('settings'),null);return s&&typeof s==='object'?s:{fast:false}};
const fastOn=()=>!!settings().fast;

// ================= ITEMS (A1) =================
function itemDef(k){const c=caseById(G.case),ci=c&&c.items;return FI[k]||(ci&&ci[k])||{name:String(k),type:'?',desc:''}}
function newItem(k,o={}){const d=itemDef(k);const it={k,u:o.u??(d.uses||1)};if(o.kit)it.kit=o.kit;if(d.pin)it.pin=1;return it}
const isWeap=it=>!!itemDef(it.k).w;
const isWorn=it=>!!itemDef(it.k).worn;
function gearOf(m){const a=m.a;if(!a.gear||!Array.isArray(a.gear.w))a.gear={w:[],eq:0,it:[],worn:[]};const g=a.gear;g.it=g.it||[];g.worn=g.worn||[];return g}
function slotsUsed(m){return gearOf(m).it.length}
// STR bonus for melee, fists and thrown weapons (Combat numbers, Delta Green; set Nov 19)
const strBonus=v=>v<=4?-2:v<=8?-1:v<=12?0:v<=16?1:2;
function refreshW(m){
 const g=gearOf(m),eq=g.w[g.eq]||g.w[0],key=eq?itemDef(eq.k).w:'fists',W=B.WEAP[key]||B.WEAP.fists,a=m.a;
 if(!g.w[g.eq])g.eq=0;
 m.w={key,name:W.name,skill:clamp(skillVal(a,W.skill)+(W.hit||0),5,99),dmg:W.dmg,bonus:(W.plus||0)+(W.melee||W.thrown?strBonus(a.stats.STR):0),verb:W.verb,loud:!!W.loud,sk:W.skill,hit:W.hit||0,melee:!!W.melee,thrown:!!W.thrown};
}
// Every agent starts a case with a handgun plus their profession's kit weapon and kit item (Starting kit).
// Kit items (marked with the owner's id) refill at the start of each case; everything else carries over.
function kitUp(m,newCase){
 const a=m.a,g=gearOf(m),p=profOf(a)||{},kk=BLS.KIT[p.id];a.id=a.id||Date.now()+rnd(1000);
 if(!a.gear.made){a.gear.made=1;
  if(!g.w.length){g.w.push(newItem('w_handgun'));if(p.weapon&&p.weapon!=='handgun'){g.w.push(newItem('w_'+p.weapon));g.eq=1}}
  if(kk&&!newCase){const it=newItem(kk,{kit:a.id,u:BLS.KITUSES[kk]});if(g.it.length<8)g.it.push(it);else G.fs.pack.push(it)}}  // an agent picked up mid-case by an old save
 if(newCase){
  const all=[...live().flatMap(x=>[...gearOf(x).it,...gearOf(x).w]),...G.fs.pack];
  all.forEach(it=>{if(it.kit)it.u=BLS.KITUSES[it.k]||itemDef(it.k).uses||1});
  if(kk&&!all.some(it=>it.kit===a.id&&it.k===kk)){const it=newItem(kk,{kit:a.id,u:BLS.KITUSES[kk]});if(g.it.length<8)g.it.push(it);else G.fs.pack.push(it)}
 }
 refreshW(m);
}
const uses=it=>{const d=itemDef(it.k);return d.w||d.worn?'':(d.uses>1||it.kit||BLS.KITUSES[it.k])?` ×${it.u}`:''};
function rowName(it){const d=itemDef(it.k);if(d.w){const W=B.WEAP[d.w];return`${d.name} ${BLS.diceOf(W)}`}return d.name+uses(it)}
// the detail box: the effect, then weapon numbers for this agent, then what the row's icons mean (3 lines at most)
function detailOf(it,m){
 const d=itemDef(it.k),out=[];
 if(d.w){const W=B.WEAP[d.w],base=skillVal(m.a,W.skill);out.push(`${BLS.diceOf(W)} · ${W.skill} ${base}%${W.hit?' '+W.hit:''} · ${W.loud?'Loud':W.silent?'silent':'quiet'}${W.extra?' · '+W.extra:''}`)}
 else out.push(d.desc);
 if(it.kit&&!it.u)out.push(IU.spent);
 if(it.kit)out.push(IU.kit);if(it.pin)out.push(IU.pin);if(d.loud||(d.w&&B.WEAP[d.w].loud))out.push(IU.bang);
 return out.join(' ')}
// a found item goes to the lead's slots if there's room, otherwise the backpack (Item display, Pickups)
async function pickup(k,o={}){
 const it=newItem(k,o),d=itemDef(k),L=lead(),g=gearOf(L);let where;
 if(d.w&&g.w.length<2){g.w.push(it);refreshW(L);where=fillT(IU.toLead,{n:L.name})}
 else if(d.worn&&!g.worn.some(x=>x.k===k)&&!d.w){g.worn.push(it);where=fillT(IU.toLead,{n:L.name})}
 else if(!d.w&&!d.worn&&g.it.length<8){g.it.push(it);where=fillT(IU.toLead,{n:L.name})}
 else{G.fs.pack.push(it);where=fillT(IU.toPack,{n:L.name})}
 await say('',IU.found+(o.line||`${d.name}. ${d.w?'':d.desc}`)+where);
}
function holderOf(k){for(const m of live()){const i=gearOf(m).it.findIndex(it=>it.k===k&&it.u>0);if(i>=0)return{m,i,it:gearOf(m).it[i]}}return null}
function spend(m,it){it.u--;if(it.u<=0&&!it.kit){const g=gearOf(m),i=g.it.indexOf(it);if(i>=0)g.it.splice(i,1)}}
const wearing=(m,k)=>gearOf(m).worn.some(x=>x.k===k);

// ================= ROLLS AND MODIFIERS (A2, A3) =================
const PHYS=['Athletics','Stealth','Melee','Firearms','Dodge'],DRUNKSK=['Search','Forensics','Firearms','Computers'];
const hasSt=(m,k)=>(m.st||[]).includes(k);
const flaring=(m,k)=>!!(m.flare&&m.flare[k]);
// status and flare penalties on a roll (skill '' = a stat roll: CON, INT). SAN rolls take only Mushrooms.
function rollMod(m,skill){let x=0;
 if(hasSt(m,'poison'))x-=20;if(hasSt(m,'shaken'))x-=20;
 if(hasSt(m,'sick')&&PHYS.includes(skill))x-=20;if(hasSt(m,'drunk')&&DRUNKSK.includes(skill))x-=20;
 if(hasSt(m,'high'))x+=m.high==='coke'&&(skill==='Persuade'||skill==='Melee')?20:-20;
 if(flaring(m,'ptsd')&&!Bt)x-=20;if(flaring(m,'paranoia')&&(skill==='Persuade'||skill==='Empathy'))x-=20;
 if(flaring(m,'phobia')&&Bt)x-=20;if(flaring(m,'addiction')&&!m.calmW)x-=10;return x}
const chanceOf=(m,skill,mod=0)=>clamp(skillVal(m.a,skill)+mod+rollMod(m,skill),1,99);
function tried(m,skill){m.tried=m.tried||[];if(skill&&!m.tried.includes(skill))m.tried.push(skill)}
const resultLine=(word,o)=>SR.line(word,o,SKW.result);

// ================= STATUSES (A3) =================
async function addStatus(m,k,o={}){
 if(!m||m.gone||hasSt(m,k))return false;
 if((k==='poison'||k==='sick')&&o.air&&wearing(m,'gasmask'))return false;
 if((k==='poison'||k==='sick')&&!o.noShrug){const r=SR.pct(m.a.stats.CON*5+rollMod(m,''));
  if(r.ok){await say('',`${m.name} shrugs it off. (${resultLine('CON',r)})`,{auto:1300});return false}}
 m.st=m.st||[];m.st.push(k);m.stc=m.stc||{};
 if(k==='drunk'||k==='high')m.stc[k]=4;if(k==='poison')m.stc.poison=0;
 return true}
function clearStatus(m,k){if(!hasSt(m,k))return false;m.st=m.st.filter(x=>x!==k);if(k==='high')m.high=null;return true}
// each area or room change: damage ticks, Drunk and High wear off (Statuses table). Map ticks stop at 1 HP.
async function tickStatuses(){
 const out=[];
 for(const m of live()){m.stc=m.stc||{};
  if(hasSt(m,'bleed')&&!(hasSt(m,'high')&&m.high==='strongpk')&&m.hp>1){m.hp--;out.push(`${m.name} bleeds. −1 HP.`)}
  if(hasSt(m,'poison')){m.stc.poison=(m.stc.poison||0)+1;if(m.stc.poison%2===0&&m.hp>1){m.hp--;out.push(`The poison works on ${m.name}. −1 HP.`)}}
  if(hasSt(m,'drunk')&&--m.stc.drunk<=0){clearStatus(m,'drunk');out.push(`${m.name} sobers up.`)}
  if(hasSt(m,'high')&&--m.stc.high<=0){const drug=m.high;clearStatus(m,'high');out.push(`${m.name} comes down.`);
   if(drug==='uppers'&&await addStatus(m,'tired',{noShrug:true}))out.push(`${m.name} crashes. Exhausted.`);
   if(drug==='coke'){const w=roll(1,4);m.wp=Math.max(0,m.wp-w);out.push(`${m.name} −${w} WP.`)}}
 }
 if(out.length)await say('',out.join(' '),{auto:1600});
}
// the end of a scene (an area change on the map, the end of a fight): Shaken clears, flares end, Retch comes back
function sceneEnd(){for(const m of live()){clearStatus(m,'shaken');m.flared={};m.retched=false;m.nerve=false;m.calmW=false;
 if(m.flare)for(const k of Object.keys(m.flare))if(m.flare[k]==='scene')delete m.flare[k]}}
async function rest(frac=1){
 for(const m of live()){m.hp=Math.min(m.mhp,m.hp+Math.ceil(m.mhp*frac));
  if(!hasSt(m,'tired'))m.wp=Math.min(m.mwp,m.wp+Math.ceil(m.mwp*frac));['bleed','sick','tired'].forEach(k=>clearStatus(m,k))}
 await trigger('rest');
}
// Status info (Quality of life): one line on what an icon does and when it ends
function chipsOf(m){
 const out=(m.st||[]).filter(k=>PST[k]).map(k=>({k,chip:PST[k].chip,col:PST[k].col,line:`${PST[k].name}: ${PST[k].line}`,pulse:PST[k].pulse}));
 (m.dis||[]).forEach(d=>{if(flaring(m,d.k)){const D=DZ[d.k];out.push({k:'dz:'+d.k,chip:D.chip,col:PC.pink,flare:1,line:`${D.name} (flaring): ${D.flare}`})}});
 return out}

// ================= DISORDER FLARES (A4) =================
// tags: 'loud', 'echo', 'liar', 'subject' (with a subject), 'death', 'rest', 'night', 'start'.
// A trigger the agent must see or hear checks the lead on the map, everyone in cutscenes and battles;
// one that happens to the whole party (a rest, a death, a new case) checks everyone with that disorder.
const TRIG={loud:'ptsd',echo:'ptsd',liar:'paranoia',subject:'phobia',death:'depression',rest:'sleep',night:'sleep',start:'addiction'};
async function trigger(tag,subj){
 const k=TRIG[tag];if(!k)return;
 const whole=['death','rest','start'].includes(tag)||(tag==='night'),who=whole||Bt||G.mode==='scene'?live():[lead()];
 for(const m of who){
  const d=(m.dis||[]).find(x=>x.k===k&&(k!=='phobia'||x.s===subj));if(!d)continue;
  m.flared=m.flared||{};if(m.flared[k]||flaring(m,k))continue;m.flared[k]=1;m.flare=m.flare||{};
  if(k==='addiction'){m.flare.addiction='case';await say('',fillT(DZ.addiction.line,{n:m.name}),{auto:1500});continue}
  const r=SR.pct(m.san);if(r.ok){await say('',fillT(SW.flareHold,{n:m.name})+` (${resultLine('SAN',r)})`,{auto:1200});continue}
  m.flare[k]='scene';await say('',fillT(DZ[k].line,{n:m.name}),{auto:1600});
  if(k==='sleep')await addStatus(m,'tired',{noShrug:true});
  if(k==='ptsd'&&Bt)m.stun=Math.max(m.stun||0,1);
  if(k==='phobia'&&!Bt&&m===lead()){const i=party.indexOf(m),nx=StudioParty.next(party.length,i,canLead);
   if(nx!==i){G.lead=nx;banner(PW.banner+lead().name.toUpperCase(),1000)}else await addStatus(m,'shaken',{noShrug:true})}
 }
}
function calmFlare(m){let any=false;if(m.flare)for(const k of Object.keys(m.flare)){if(k==='addiction'){if(!m.calmW){m.calmW=true;any=true}}else{delete m.flare[k];any=true}}return any}
const flaringAny=m=>!!(m.flare&&Object.keys(m.flare).some(k=>k!=='addiction'||!m.calmW));

// ================= SAN BY THE BIBLE (A4) =================
// A horror: {id, tier, kind ('violence','helplessness','unnatural'), subj (phobia subject), label, known (bracing),
//   all (everyone rolls, as in a cutscene), sight (horror on sight), gore (Forensics 90 Hardened skips it), ident}
// or a raw SAN hit {spec:['0','1d3'], label, kind}: an enemy's words in a fight, rolled every time.
function lossSpec(h){return h.spec||BLS.TIERS[h.tier]||['0','1']}
async function horror(h,o={}){
 if(Bt&&Bt.ward){Bt.ward=false;await say('',`${h.label}... but the ward holds. No one loses SAN.`,{auto:1100});return}
 const who=(o.who||(h.all||Bt||G.mode==='scene'?live():[lead()])).filter(m=>!m.gone&&m.san>0&&!(h.id&&(m.seen||[]).includes(h.id)));
 if(!who.length)return;
 who.forEach(m=>{if(h.id){m.seen=m.seen||[];m.seen.push(h.id)}});
 const spec=lossSpec(h),kind=h.kind||'unnatural',kk=kind==='violence'?'v':kind==='helplessness'?'h':null;
 // bracing: before a horror the case marks as known-coming, each roller may spend 1d4 WP (double if Exhausted) to halve it
 const braced=new Set();
 if(h.known)for(const m of who){if(m.wp<=0||flaring(m,'depression')||(kk&&m.adapt&&m.adapt[kk.toUpperCase()]))continue;
  const x=hasSt(m,'tired')?' ×2':'';const r=await ask(m.name.toUpperCase(),fillT(SW.braceAsk,{n:m.name,x}),[SW.brace,SW.noBrace]);
  if(r===0){const w=Math.min(m.wp,roll(1,4)*(x?2:1));m.wp-=w;braced.add(m);await say('',fillT(SW.braced,{n:m.name,w}),{auto:900})}}
 const parts=[],helpers=new Set(),broke=[];
 for(const m of who){
  let loss,note='',half=false;
  const adapted=kk&&m.adapt&&m.adapt[kk.toUpperCase()];
  if(h.gore&&skillVal(m.a,'Forensics')>=90){parts.push(fillT(SW.hardened,{n:m.name}));continue}
  if(h.sight&&!G.fs.charm){const c=holderOf('charm');if(c&&c.m===m){spend(m,c.it);G.fs.charm=1;parts.push(fillT(SW.charm,{n:m.name}));continue}}
  const r=SR.pct(m.san-(m.high==='shrooms'?20:0));const pass=adapted||r.ok;
  loss=dice(pass?spec[0]:spec[1]);
  if(braced.has(m)){half=true;note=' braced'}
  else if(m.braceB&&Bt){half=true;m.braceB=false;note=' braced'}
  else if(m.nerve){half=true;m.nerve=false;note=' pills'}
  else if(h.ident&&(G.fs.ident||[]).includes(h.ident)&&skillVal(m.a,'Occult')>=90){half=true;note=' read up'}
  // Steadying: a teammate at 40%+ Empathy rolls when this agent fails, once per horror each, no turn
  if(!pass&&loss>0&&!flaring(m,'paranoia')){
   const hs=live().filter(x=>x!==m&&!helpers.has(x)&&x.san>0&&skillVal(x.a,'Empathy')>=40).sort((a,b)=>chanceOf(b,'Empathy')-chanceOf(a,'Empathy'));
   const hp=hs[0];if(hp){helpers.add(hp);let s=SR.pct(chanceOf(hp,'Empathy'));
    if(!s.ok&&skillVal(hp.a,'Empathy')>=90&&!(G.fs.perk['anchor'+hp.a.id])){G.fs.perk['anchor'+hp.a.id]=1;s=SR.pct(chanceOf(hp,'Empathy'))}
    if(s.crit){loss=0;half=false;note=' '+fillT(SW.steadyAll,{h:hp.name,n:m.name})}else if(s.ok&&!half){half=true;note=' '+fillT(SW.steady,{h:hp.name,n:m.name})}else if(!s.ok)tried(hp,'Empathy')}}
  if(half)loss=Math.floor(loss/2);
  if(hasSt(m,'drunk'))loss-=1;
  loss=Math.max(0,loss);
  m.san=Math.max(0,m.san-loss);
  parts.push(`${m.name} −${loss}${note?' ('+note.trim()+')':''}`);
  if(loss>0&&kk&&!adapted){m.adapt=m.adapt||{v:0,h:0};m.adapt[kk]=(m.adapt[kk]||0)+1;if(m.adapt[kk]>=3){m.adapt[kk.toUpperCase()]=true;broke.push([m,'adapt'])}}
  if(loss>0)broke.push([m,'loss']);
 }
 applySan();if(Bt)updHUD();
 await say('',`${h.label}. `+(parts.length?'SAN: '+parts.join(', ')+'.':SW.keep),{auto:1500});
 for(const [m,what] of broke){
  if(what==='adapt'){bondsLose(m,1);const b=(m.a.bonds||[])[0];await say('',fillT(b?SW.adapted:SW.adaptedNoBond,{n:m.name,b:b&&b.name}));continue}
  if(m.san<=0){await zeroSan(m);continue}
  if(!m.noBP&&m.san<=m.bp)await breakingPoint(m,kind,h.subj);
 }
 if(h.subj)await trigger('subject',h.subj);
}
// the old engine call (enemies' SAN attacks): a raw SAN hit through the same rules
async function sanCheck(spec,label,who){return horror({spec,label,kind:'unnatural'},{who})}
function bondsLose(m,n){const a=m.a;a.bondDmg=a.bondDmg||[];(a.bonds||[]).forEach((b,j)=>{a.bondDmg[j]=(a.bondDmg[j]||0)+n})}
const bondNow=(a,j)=>{const b=a.bonds[j],cha=a.stats.CHA||10;return Math.max(0,(b.score??cha)-((a.bondDmg||[])[j]||0))};
// Breaking Point: SAN minus POW, reset after each one (Sanity; SAN loss table)
async function breakingPoint(m,kind,subj){
 await addStatus(m,'shaken',{noShrug:true});
 await say('',fillT(SW.bp,{n:m.name}));
 const kk=kind==='violence'?'v':kind==='helplessness'?'h':null;if(kk&&m.adapt)m.adapt[kk]=0;
 for(;;){
  const a=m.a,mots=a.motives||[],bonds=(a.bonds||[]).map((b,j)=>[b,j,bondNow(a,j)]),canLean=bonds.some(x=>x[2]>1);
  const r=await choose([SW.takeDis,{label:SW.giveMot,dis:!mots.length},{label:SW.lean,dis:!canLean}],{title:fillT(SW.bpAsk,{})+' · '+m.name.toUpperCase()});
  if(r===1){const i=await choose(mots.map(x=>x),{cancel:true,title:SW.giveMot.toUpperCase()});if(i<0)continue;
   const ok=await choose([SW.yes,SW.no],{cancel:true,title:SW.sure});if(ok!==0)continue;
   const gone=mots.splice(i,1)[0];if(a.main>=mots.length)a.main=0;await say('',fillT(SW.motLine,{n:m.name,m:gone}));break}
  if(r===2){const i=await choose(bonds.map(([b,j,s])=>({label:`${b.name} · ${s}`,dis:s<=1})),{cancel:true,title:SW.lean.toUpperCase(),desc:bonds.map(x=>x[2]<=1?SW.bondLow:'')});if(i<0)continue;
   const j=bonds[i][1],loss=Math.min(roll(1,6),bondNow(a,j)-1);a.bondDmg=a.bondDmg||[];a.bondDmg[j]=(a.bondDmg[j]||0)+loss;await say('',fillT(SW.bondLine,{n:m.name,b:a.bonds[j].name}));break}
  if(r===0||r<0){await giveDisorder(m,kind,subj);break}
 }
 m.bp=m.san-m.a.stats.POW;if(m.bp<=0){m.bp=0;m.noBP=true;await say('',fillT(SW.noBP,{n:m.name}))}
}
// the kind of horror sets the pool; 50/50 between its two (Disorders, Getting one)
async function giveDisorder(m,kind,subj){
 const pool={violence:['ptsd','sleep'],helplessness:['depression','sleep'],unnatural:['paranoia','phobia']}[kind]||['paranoia','phobia'];
 const has=k=>(m.dis||[]).some(d=>d.k===k);
 let pickK=pool[rnd(2)];if(has(pickK))pickK=pool.find(k=>!has(k));
 if(!pickK){const rest=Object.keys(DZ).filter(k=>k!=='addiction'&&!has(k));pickK=rest.length?pick(rest):null}
 if(!pickK)return;
 const d={k:pickK};if(pickK==='phobia')d.s=subj||'the dark';m.dis=m.dis||[];m.dis.push(d);
 await say('',fillT(DZ[pickK].gain,{n:m.name,s:d.s||''}));
}
// 0 SAN on the map or in a cutscene: the straight line, and the agent leaves (A6). In a fight they leave when it ends.
async function zeroSan(m){if(Bt){m.out=true;updHUD();return}await say('',fillT(SW.zero,{n:m.name}));await loseAgent(m,'0 SAN')}
// Motivation moments (Motivations): a case marks a moment for a type; it shows when anyone holds it
const holdersOf=type=>live().filter(m=>(m.a.motives||[]).includes(type));
async function motivate(m){if(flaring(m,'depression'))return 0;const g=roll(1,4);m.san=Math.min(m.msan,m.san+g);applySan();await say('',fillT(SW.motive,{n:m.name,g}));return g}
// Luck: a flat 50%, for overstepping and pure-chance moments (Agent creator, Luck)
const luck=mod=>SR.luck(mod);
// INT Hunch: once per case, stuck on a deduction, roll INT × 5 for a hint (stat jobs). A case calls hunch(hint) there.
async function hunch(hint){
 if(G.fs.hunch)return false;const L=lead(),p=clamp(L.a.stats.INT*5+rollMod(L,''),1,99);
 const r=await ask('',fillT(MMW.hunchAsk,{n:L.name,p}),[MMW.hunchYes,MMW.hunchNo]);if(r!==0)return false;
 G.fs.hunch=1;const o=SR.pct(p);await say('',resultLine('INT',o),{auto:1000});await say('',o.ok?hint:MMW.hunchFail);return o.ok}
// Overstepping (Skills and menus): the Luck roll, −20 if someone saw, −40 if public; a fail climbs one step
async function overstep(seen){
 if(G.fs.jam&&G.fs.jam[G.map])return false;
 const o=luck(seen==='public'?-40:seen?-20:0);if(o.ok)return false;
 const s=loadSeason(),steps=stepsOf();s.overstep=Math.min(steps.length-1,(s.overstep|0)+1);store.set(seasonKey(),s);
 await say('',BLS.OVERSTEP.climb[steps[s.overstep]]||'');return true}
function stepsOf(){const c=caseById(G.case);return c&&c.quiet?BLS.OVERSTEP.quiet:BLS.OVERSTEP.open}
function noise(){roamLoud();const M=G.M;if(M&&M.onLoud)run(M.onLoud)}

// ================= HOTSPOTS (A2) =================
// A case's hotspot (M.O[x,y]) is a function (a person, a scripted moment) or data:
//   {name, look: 'text' | async fn, opts: [...] | fn → [...], used: fn}
// opts: {use:'force'} a skill unlock (SKILLOPT) with {ok, fail, fumble, crit, mod, once}; {item:'cash', label, run}
// a kit or tool item someone carries; or {label, run} a plain choice. once: an id, so the option goes once it's done.
function optOf(o,L){
 if(o.use){const S=SOPT[o.use],v=skillVal(L.a,S.skill),lock=v<S.tier,lbl=o.label||S.label,p=chanceOf(L,S.skill,o.mod||0);
  const loud=S.loud&&!(o.use==='force'&&gearOf(L).w.some(w=>itemDef(w.k).w==='crowbar'));
  return{label:lock?`${lbl} · ${S.skill}`:`${lbl} · ${S.skill} ${p}%`,dis:lock,why:lock?fillT(SKW.lacks,{s:S.skill,t:S.tier}):loud?SKW.loud:'',S,p,loud}}
 if(o.item){const h=holderOf(o.item);return{label:o.label||itemDef(o.item).name,dis:!h,why:h?itemDef(o.item).desc:`Nobody carries ${itemDef(o.item).name}.`,h}}
 return{label:o.label,why:o.why||''}}
const optDone=o=>o.once&&G.fs.used['opt:'+o.once];
function hotOpts(h){return(typeof h.opts==='function'?h.opts():h.opts||[]).filter(o=>!optDone(o)&&(!o.show||o.show()))}
async function hotspot(h,key){
 const L=lead(),opts=hotOpts(h),rows=[],acts=[],desc=[];
 if(h.look){rows.push(SKW.look);acts.push(()=>lookAt(h,key));desc.push('')}
 opts.forEach(o=>{const r=optOf(o,L);rows.push({label:r.label,dis:r.dis});desc.push(r.why||'');acts.push(()=>runOpt(o,r,key))});
 if(!rows.length)return;
 if(rows.length===1&&!rows[0].dis)return acts[0]();
 const i=await choose(rows,{cancel:true,title:h.name||'',desc});if(i<0)return;await acts[i]();
}
async function lookAt(h,key){G.fs.used[h.id||key]=1;if(typeof h.look==='function')await h.look();else await say('',h.look)}
async function runOpt(o,r,key){
 if(o.once)G.fs.used['opt:'+o.once]=1;
 if(o.use){const L=lead(),S=r.S,v=skillVal(L.a,S.skill);let x=SR.pct(r.p),perk='';
  if(!x.ok&&S.skill==='Persuade'&&v>=90&&!G.fs.perk.retry){G.fs.perk.retry=1;await say('',SKW.retry,{auto:900});x=SR.pct(r.p)}
  if(!x.ok&&v>=90&&BLS.AUTOPERK[S.skill]&&!G.fs.perk[S.skill]){G.fs.perk[S.skill]=1;perk=fillT(SKW.perk,{p:BLS.AUTOPERK[S.skill]});x=Object.assign({},x,{ok:true,fumble:false})}
  await say('',resultLine(`${(o.label||S.label).toUpperCase()} · ${S.skill.toUpperCase()}`,x)+(perk?' '+perk:''),{auto:1300});
  if(r.loud)noise();if(!x.ok)tried(L,S.skill);
  const f=x.crit&&o.crit?o.crit:x.ok?o.ok:x.fumble&&o.fumble?o.fumble:o.fail;if(f)await f(x);return}
 if(o.item){spend(r.h.m,r.h.it);if(o.run)await o.run(r.h.m);return}
 if(o.run)await o.run();
}
// dim used hotspots: nothing left to look at or try (Quality of life)
function hotUsed(h,key){if(typeof h==='function')return false;if(h.used)return !!h.used();return !!G.fs.used[h.id||key]&&!hotOpts(h).length}
// talked out: a townsperson with nothing new (case npc.out(), else talked to since the last new clue)
function talkedOut(n){if(n.out)return !!n.out();return G.fs.talked[n.id]===G.clues.length}

// ================= ROAMERS (spec 006 C4; Systems, Gameplay loop; Combat, Enemies and difficulty) =================
// A danger zone's roamers walk a short beat in plain sight with their threat skulls, each guarding something.
// A map lists them: M.roamers = [{id, types: ['hound'], path: [[x, y], ...], name, look, skulls, sprite, guard: async fn}].
// Their state saves with the checkpoint in G.fs.roam[id]: the walker (engine/patrol.js), what it's doing, and how it
// was dealt with: beaten (won the fight), passed (snuck past: ignores you this visit), held (a ward or salt line: it
// backs off and stays put), away (firecrackers: gone for a while). Passed, held and away end at the next area change.
// Fight it, sneak past with a roll, or go another way. Loud actions within 8 tiles draw it (noise → M.onLoud).
const RW_=BLS.ROAMW;
const SP=StudioPatrol;
function roamSt(r){G.fs.roam=G.fs.roam||{};let s=G.fs.roam[r.id];if(!s||!s.w){s=G.fs.roam[r.id]={w:SP.beat(r.path),st:'patrol',t:0}}return s}
const roamLive=(r,s=roamSt(r))=>!s.beaten&&!s.away;
const roamOn=(r,s=roamSt(r))=>roamLive(r,s)&&!s.passed&&!s.held;
function roamers(){const M=G.M;return M&&M.roamers?M.roamers:[]}
function roamAt(x,y){return roamers().find(r=>{const s=roamSt(r);return roamLive(r,s)&&s.w.x===x&&s.w.y===y})}
// tiles a roamer can walk: the map's open ground, not the lead, not another roamer
function roamOk(r){const M=G.M;return(x,y)=>x>=0&&y>=0&&x<M.w&&y<M.h&&!BLOCK.has(M.g[y][x])&&!(x===G.x&&y===G.y)&&!roamers().some(o=>o!==r&&roamLive(o)&&roamSt(o).w.x===x&&roamSt(o).w.y===y)}
const near=(s,n=1)=>Math.abs(s.w.x-G.x)+Math.abs(s.w.y-G.y)<=n;
// the engine calls this once a tick while the lead is free on the map. Patrol steps every 36 ticks; on sight
// (a straight line within 3 tiles) it stops with a "!" for 50 ticks, then chases every 18; next to the lead, it catches them.
// More than 10 tiles off its beat, or after losing the lead for a while, it walks home.
function roamTick(){
 for(const r of roamers()){const s=roamSt(r);if(!roamOn(r,s))continue;s.t=(s.t|0)+1;const ok=roamOk(r);
  if(s.st==='patrol'){
   if(SP.sees(s.w,G.x,G.y,3,ok)||near(s)){s.st='alert';s.t=0;continue}
   if(s.t>=36){s.t=0;const [nx,ny]=s.w.path[(s.w.i+s.w.dir+s.w.path.length)%s.w.path.length]||[];if(ok(nx,ny)||s.w.path.length<2)SP.next(s.w)}}
  else if(s.st==='alert'){if(s.t>=50){s.st='chase';s.t=0;s.lost=0}}
  else if(s.st==='chase'){
   if(near(s)){s.st='patrol';s.t=0;held=[];run(()=>roamCaught(r));return}
   if(s.t>=18){s.t=0;const far=Math.abs(s.w.x-G.x)+Math.abs(s.w.y-G.y)>10;
    if(far||(s.lost|0)>8){s.st='home';continue}
    if(!SP.toward(s.w,G.x,G.y,ok))s.lost=(s.lost|0)+1;
    if(near(s)){s.st='patrol';held=[];run(()=>roamCaught(r));return}}}
  else if(s.st==='home'){if(s.t>=24){s.t=0;if(SP.home(s.w,ok))s.st='patrol'}}
 }
}
// Loud actions draw every roamer within 8 tiles (Skill unlocks: Loud actions draw nearby roamers)
function roamLoud(){let any=false;for(const r of roamers()){const s=roamSt(r);if(!roamOn(r,s))continue;
 if(Math.abs(s.w.x-G.x)+Math.abs(s.w.y-G.y)<=8){s.st='chase';s.t=0;s.lost=0;any=true}}
 if(any)banner(RW_.drawn,1400)}
// it caught the lead: Dodge's Slip free (75%) can break away before the fight starts
async function roamCaught(r){
 const L=lead(),s=roamSt(r);await say('',fillT(RW_.caught,{e:r.name}),{auto:1000});
 if(skillVal(L.a,'Dodge')>=75){const p=chanceOf(L,'Dodge');const i=await choose([`${SOPT.slipfree.label} · Dodge ${p}%`,RW_.fight],{title:r.name.toUpperCase()});
  if(i===0){const x=SR.pct(p);await say('',resultLine('SLIP FREE · DODGE',x),{auto:1000});
   if(x.ok){s.st='home';s.t=-90;await say('',fillT(RW_.slipped,{n:L.name,e:r.name}));return}tried(L,'Dodge')}}
 return roamFight(r)}
// a roamer fight: Flee works; a win leaves it beaten, a flee sends it home a while, a loss is the usual game over
async function roamFight(r,o={}){
 const s=roamSt(r);const res=await battle(r.types,{roamer:true,intro:r.intro,onStart:o.onStart});
 if(res==='lose')return gameOver();
 if(res==='win'){s.beaten=1;checkpoint();if(r.won)await r.won()}
 else{s.st='home';s.t=-120;s.w.x=s.w.path[s.w.path.length-1][0];s.w.y=s.w.path[s.w.path.length-1][1];s.w.i=s.w.path.length-1}
 return res}
// the roamer ahead (A on it), or next to the lead (an item used from the menu)
function roamNear(){const [tx,ty]=StudioMove.ahead(G);return roamAt(tx,ty)||roamers().find(r=>{const s=roamSt(r);return roamLive(r,s)&&near(s)})}
// A on a roamer: the lead's options, through the same hotspot menu (odds, greyed options naming the skill)
async function roamMenu(r){
 const s=roamSt(r),ghost=()=>skillVal(lead().a,'Stealth')>=90;
 const pass=async(line)=>{s.passed=1;s.st='patrol';await say('',fillT(line,{n:lead().name,e:r.name}));if(ghost()&&r.guard&&!s.lifted){s.lifted=1;await say('',RW_.ghost);await r.guard()}checkpoint()};
 const hold=async(line)=>{s.held=1;s.st='home';await say('',fillT(line,{n:lead().name,e:r.name}));checkpoint()};
 const flare=G.fs.flareMap===G.map?-20:0;  // a road flare lights the area, so Stealth there gets harder
 const h={name:r.name.toUpperCase(),look:r.look,opts:[
  {label:RW_.fight,run:()=>roamFight(r)},
  {use:'sneak',mod:flare,ok:()=>pass(RW_.snuck),fail:async()=>{await say('',fillT(RW_.spotted,{e:r.name}));return roamFight(r)}},
  {use:'jump',ok:()=>roamFight(r,{onStart:async()=>{const e=Bt.en[0];await bsay(fillT(RW_.jumped,{n:lead().name,e:e.name}),900);await attack(lead(),e,{fight:true})}}),fail:async()=>{await say('',fillT(RW_.spotted,{e:r.name}));return roamFight(r)}},
  {use:'ward',show:()=>(r.tags||[]).includes('unnatural'),ok:()=>hold(RW_.warded),fail:async()=>say('',RW_.wardFail)},
  {item:'salt',label:RW_.salt,show:()=>(r.tags||[]).includes('unnatural'),run:()=>hold(RW_.salted)},
  {item:'firecrackers',run:async()=>{s.away=1;await say('',fillT(RW_.crackers,{e:r.name}));checkpoint()}},
  {item:'snare',run:async()=>{const i=await choose([RW_.snarePast,RW_.snareFight],{title:'SNARE TRAP'});
   if(i===1)return roamFight(r,{onStart:async()=>{await foeStatus(Bt.en[0],'stun')}});return pass(RW_.snared)}}
 ]};
 await hotspot(h,'roam:'+r.id);
}
// the next area change: snuck-past, warded and scared-off roamers are back at their posts
function roamReset(){if(!G.fs.roam)return;Object.values(G.fs.roam).forEach(s=>{if(s.beaten)return;s.passed=0;s.held=0;s.away=0;s.st='patrol';s.t=0;
 s.w.i=0;s.w.dir=1;s.w.x=s.w.path[0][0];s.w.y=s.w.path[0][1];s.w.off=false})}
// a roamer fight's drop: 20% from the case's loot table of 4–6 field items (Where items come from, Loot)
async function lootDrop(){const c=caseById(G.case),t=c&&c.loot;if(!t||!t.length||Math.random()>=.2)return;await pickup(pick(t))}
// a Lantern Box: a stash site with 2–3 catalog items, opened once (Where items come from)
async function lanternBox(id,items,line){if(G.fs.used['box:'+id]){await say('',RW_.boxEmpty);return}G.fs.used['box:'+id]=1;
 if(line)await say('',line);for(const k of items)await pickup(k);checkpoint()}
// Requisition at the briefing: every agent may roll Bureaucracy once for one catalog item; easy items +20%,
// throwables +0, heavy gear −20 (Where items come from). Items go in the backpack. After an Agency call, Big Hat says no.
async function requisition(){
 const s=loadSeason(),steps=stepsOf();if(steps[s.overstep|0]==='Agency call'||steps[s.overstep|0]==='Federal agents'){await say('BIG HAT',RW_.reqRefused);return}
 const cat=Object.entries(FI).filter(([k,x])=>x.lb&&x.req!=null);
 if((await ask('BIG HAT',RW_.reqAsk,[RW_.reqYes,RW_.reqNo]))!==0)return;
 for(const m of live()){
  const p=k=>chanceOf(m,'Bureaucracy',FI[k].req||0);
  const i=await choose(cat.map(([k,x])=>`${x.name} · ${p(k)}%`).concat([RW_.reqSkip]),{cancel:true,title:fillT(RW_.reqWho,{n:m.name.toUpperCase()}),desc:cat.map(([k,x])=>x.desc).concat([''])});
  if(i<0||i>=cat.length)continue;
  const [k,x]=cat[i],o=SR.pct(p(k));await say('',resultLine('BUREAUCRACY',o),{auto:1000});
  if(!o.ok){tried(m,'Bureaucracy');await say('BIG HAT',fillT(RW_.reqNoLine,{i:x.name}));continue}
  G.fs.pack.push(newItem(k));await say('BIG HAT',fillT(RW_.reqOk,{i:x.name,n:m.name}));
 }
}
// map trail dots (On guard routes, Pathfinder's safe route, Track's drag marks): [[x, y], ...] per map, drawn by the engine
function setTrail(pts,kind){G.fs.trail=G.fs.trail||{};const t=G.fs.trail[G.map]=G.fs.trail[G.map]||{};t[kind]=pts}

// ================= CASE STATE, START, AREA CHANGES =================
function freshFs(){return{pack:[],used:{},talked:{},perk:{},log:[],jam:{},uv:{},recruit:[],hunch:0,night:0,ident:[],samples:[],camped:0,charm:0,start:1,flareMap:null,fight:0}}
function fillMember(m){
 const a=m.a,c=a.cur||{},d=derived(a);
 m.st=Array.isArray(m.st)?m.st:[];m.stc=m.stc||{};m.flare=m.flare||{};m.flared=m.flared||{};
 if(!Array.isArray(m.dis))m.dis=normDis(m.dis??c.dis);
 if(m.bp==null)m.bp=c.bp??d.BP;if(m.noBP==null)m.noBP=!!c.noBP;m.adapt=m.adapt||c.adapt||{v:0,h:0};
 m.tried=m.tried||[];m.seen=m.seen||[];m.hurt=m.hurt|0;m.aided=m.aided|0;m.doses=m.doses||{};
 return m}
// disorders carry as [{k, s}]; older saves held one name (save step 5 maps them)
function normDis(x){if(!x)return[];if(Array.isArray(x))return x.filter(d=>d&&DZ[d.k]);const k=OLDDIS[x];return k?[{k,s:k==='phobia'?'the dark':undefined}]:[]}
const OLDDIS={'Jumpy':'ptsd','Night terrors':'sleep','Counting compulsion':'paranoia','Hypervigilance':'paranoia','Hollow stare':'depression','Can\'t stop smiling':'phobia'};
function fieldStart(){
 const p=store.get(B.key('party'),null);G.fs=freshFs();G.fs.pack=p&&Array.isArray(p.pack)?p.pack.filter(it=>it&&it.k):[];
 party.forEach(fillMember);party.forEach(m=>kitUp(m,true));
}
function fieldRestore(o){G.fs=Object.assign(freshFs(),o.fs||{});if(!o.fs&&o.items)G.fs.pack=oldPack(o.items);G.fs.start=0;party.forEach(fillMember);party.forEach(m=>kitUp(m,false))}
// the old shared pack's items, as backpack items (save step 5)
const OLDITEM={aid:'firstaid',coffee:'coffee',flare:'roadflare',bell:'bell',salts:'salts',tape:'bandage',spray:'bearspray'};
function oldPack(items){const out=[];Object.entries(items||{}).forEach(([k,n])=>{const nk=OLDITEM[k];for(let i=0;i<(+n||0)&&nk;i++)out.push({k:nk,u:1})});return out}
// carried into bl.roster when the case ends (Between cases: SAN, disorders, Breaking Point, Adapted, gear)
function carry(m){const a=m.a;a.cur=Object.assign(a.cur||{},{san:m.san,dis:m.dis,bp:m.bp,noBP:!!m.noBP,adapt:m.adapt,tried:m.tried});return a}
// the engine runs this when the lead is free on the map: the case's first moment, then each area change
async function fieldTick(){
 if(G.fs.start){G.fs.start=0;await trigger('start')}
 if(G.fs.area){G.fs.area=0;sceneEnd();await tickStatuses();
  if(G.M.light==='night'){if(!G.fs.night){G.fs.night=1;await trigger('night')}await trigger('subject','the dark')}
  if(G.fs.recruit.length)await offerRecruit();
  roamReset();const c=caseById(G.case);if(c&&c.onArea)await c.onArea()}
}
const fieldDue=()=>G.fs&&(G.fs.start||G.fs.area);

// ================= LOSING AN AGENT (A6) =================
async function loseAgent(m,how){
 const i=party.indexOf(m);if(i<0)return;const wasLead=i===(G.lead|0);m.gone=true;
 // case-only items pass to the lead, so a case never dead-ends; the rest goes with them
 party.splice(i,1);if(!party.length){await gameOver();return}
 if(wasLead)G.lead=Math.min(i,party.length-1);else if((G.lead|0)>i)G.lead--;
 const L=lead(),pins=gearOf(m).it.filter(it=>it.pin);pins.forEach(it=>{if(gearOf(L).it.length<8)gearOf(L).it.push(it);else G.fs.pack.push(it)});gearOf(m).it=gearOf(m).it.filter(it=>!it.pin);
 const mem=store.get(B.key('memorial'),[]);(Array.isArray(mem)?mem:[]).push({name:m.a.name,code:m.a.code,prof:m.a.prof,how,case:G.case,when:new Date().toISOString().slice(0,10),a:JSON.parse(JSON.stringify(carry(m)))});
 store.set(B.key('memorial'),Array.isArray(mem)?mem:[mem]);
 B.S.roster=(B.S.roster||[]).filter(x=>x.id!==m.a.id);store.set(B.key('roster'),B.S.roster);
 G.fs.recruit.push(m.a.prof);applySan();checkpoint();
}
// at the next area change, Big Hat offers three recruits (one shares the lost agent's profession) or the creator
async function offerRecruit(){
 while(G.fs.recruit.length){
  const prof=G.fs.recruit[0],same=REC.find(r=>r.prof===prof),others=REC.filter(r=>r.prof!==prof&&!party.some(m=>m.a.prof===r.prof)).sort(()=>Math.random()-.5).slice(0,2);
  const opts=[same,...others].filter(Boolean).sort(()=>Math.random()-.5);
  await say('',RW.ask);
  const rows=opts.map(r=>`${r.name} · ${(profOf(r)||{}).name}`).concat([RW.build]);
  const i=await choose(rows,{title:'RECRUIT',desc:opts.map(r=>r.backstory).concat([''])});
  let a,line;
  if(i===opts.length){a=await buildRecruit();if(!a)continue;line=RW.built}
  else{a=B.fromTemplate(opts[i]);delete a.first;line=fillT(RW.hat,{p:(profOf(a)||{}).name,n:a.name})}
  G.fs.recruit.shift();
  const m=fillMember(member(a));a.gear=null;gearOf(m);kitUp(m,true);party.push(m);
  B.S.roster=B.S.roster||[];B.S.roster.unshift(JSON.parse(JSON.stringify(a)));store.set(B.key('roster'),B.S.roster);
  await say('BIG HAT',line);
  const first=(REC.find(r=>r.prof===a.prof)||{}).first;if(first)await say(m.name.toUpperCase()+' · '+((profOf(a)||{}).name||'').toUpperCase(),first);
  checkpoint();
 }
}
// "Build my own": the game steps aside for the creator, then comes back with the new agent (or none, on B)
let recruitWait=null;
function buildRecruit(){return new Promise(res=>{recruitWait=res;held=[];G.active=false;cancelAnimationFrame(raf);scr.classList.remove('gaming');box=null;boxKey='';dhost.replaceChildren();
 B.S.recruit=true;B.S.a=B.newAgent();B.S.edit=null;B.S.tweak=false;B.goto('profession');B.render()})}
function recruitBuilt(a){const r=recruitWait;recruitWait=null;B.S.recruit=false;enter();if(r)r(a||null)}

// ================= THE MAP MENU (A5) =================
async function pauseMenu(){
 held=[];
 for(;;){
  // Dev build only (never Release): a row that finishes the case at once, just above the last row
  const dev=!!(window.Studio&&Studio.channel==='dev'),R=MMW.rows,rows=[...R.slice(0,-1),...(dev?[MMW.dev]:[]),R[R.length-1]];
  const r=await choose(rows,{cancel:true,title:MMW.title+' · '+G.M.name,sel:Math.min(pauseMenu.sel|0,rows.length-1)});
  if(r<0){pauseMenu.sel=0;return}const w=rows[r];pauseMenu.sel=r;
  if(w===MMW.dev){pauseMenu.sel=0;finish();return}
  if(w===R[0])await openParty();
  else if(w===R[1])await skillsMenu();
  else if(w===R[2])await openItems({i:G.lead|0});
  else if(w===R[3])await openCaseFile();
  else if(w===R[4])await openLog();
  else if(w===R[5])await settingsMenu();
  else if(w===R[6]){checkpoint();const q=await ask('',MMW.saved,[MMW.keepPlaying,MMW.quit]);pauseMenu.sel=0;if(q===1){quit();return}return}
 }
}
async function settingsMenu(){for(;;){const s=settings();const r=await choose([`${MMW.fast}: ${s.fast?MMW.on:MMW.off}`],{cancel:true,title:MMW.settings,desc:[MMW.fastLine]});if(r<0)return;s.fast=!s.fast;store.set(B.key('settings'),s)}}
// Map menu → Skills: the lead's skills that work away from hotspots (greyed with the skill name when the lead lacks them)
async function skillsMenu(){
 for(;;){
  const L=lead(),sv=k=>skillVal(L.a,k),rows=[],desc=[],acts=[];
  const add=(name,skill,tier,ok,why,fn)=>{const has=sv(skill)>=tier;rows.push({label:has?`${name} · ${skill} ${chanceOf(L,skill)}%`:`${name} · ${skill}`,dis:!has||!ok});
   desc.push(!has?fillT(SKW.lacks,{s:skill,t:tier}):ok?'':why);acts.push(fn)};
  const hurt=live().filter(m=>m.hurt>m.aided&&m.hp<m.mhp);
  add(MMW.patch,'First Aid',40,hurt.length,MMW.patchWhy,patchUp);
  add(MMW.triage,'First Aid',75,hurt.length,MMW.triageWhy,triage);
  add(MMW.treat,'Medicine',40,live().some(m=>['bleed','poison','sick'].some(k=>hasSt(m,k))),MMW.treatWhy,treat);
  add(MMW.sedate,'Medicine',90,live().some(flaringAny),MMW.sedateWhy,sedate);
  add(MMW.camp,'Survival',90,!G.fs.camped&&!G.M.danger,G.fs.camped?MMW.campUsed:MMW.campWhy,makeCamp);
  add(MMW.analyze,'Science',75,G.fs.samples.length&&(G.M.safe||sv('Science')>=90),G.fs.samples.length?MMW.analyzeSafe:MMW.analyzeWhy,analyze);
  // Retch (Statuses, Sickened): a CON × 5 roll, once per scene on the map
  const sick=live().filter(m=>hasSt(m,'sick')&&!m.retched);rows.push({label:MMW.retch+' · CON',dis:!sick.length});desc.push(sick.length?'':MMW.retchWhy);acts.push(retch);
  const r=await choose(rows,{cancel:true,title:MMW.skills+' · '+L.name.toUpperCase(),desc:desc.map(d=>d||MMW.skillsKey)});
  if(r<0)return;await acts[r]();
 }
}
async function pickMember(title,ok,why){const ms=live();const r=await choose(ms.map(m=>({label:`${m.name}  ${m.hp}/${m.mhp}`,dis:!ok(m)})),{cancel:true,title,desc:ms.map(m=>ok(m)?'':why||'')});return r<0?null:ms[r]}
async function patchUp(){const L=lead(),t=await pickMember(MMW.patch.toUpperCase(),m=>m.hurt>m.aided&&m.hp<m.mhp,MMW.patchWhy);if(!t)return;
 t.aided=t.hurt;const sure=skillVal(L.a,'First Aid')>=90,o=SR.pct(chanceOf(L,'First Aid'));if(!sure)await say('',resultLine('PATCH UP · FIRST AID',o),{auto:1000});
 if(sure||o.ok){const h=roll(1,4);t.hp=Math.min(t.mhp,t.hp+h);await say('',fillT(MMW.healed,{n:t.name,h}))}else{tried(L,'First Aid');await say('',fillT(MMW.patchFail,{n:t.name}))}}
async function triage(){const L=lead(),ts=live().filter(m=>m.hurt>m.aided&&m.hp<m.mhp);ts.forEach(m=>m.aided=m.hurt);
 const sure=skillVal(L.a,'First Aid')>=90,o=SR.pct(chanceOf(L,'First Aid'));if(!sure)await say('',resultLine('TRIAGE · FIRST AID',o),{auto:1000});
 if(!(sure||o.ok)){tried(L,'First Aid');await say('',MMW.treatFail);return}
 await say('',ts.map(m=>{const h=roll(1,2);m.hp=Math.min(m.mhp,m.hp+h);return fillT(MMW.healed,{n:m.name,h})}).join(' '))}
async function treat(){const L=lead(),t=await pickMember(MMW.treat.toUpperCase(),m=>['bleed','poison','sick'].some(k=>hasSt(m,k)),MMW.treatWhy);if(!t)return;
 const ks=['bleed','poison','sick'].filter(k=>hasSt(t,k)),k=ks.length>1?ks[await choose(ks.map(x=>PST[x].name),{title:MMW.treat.toUpperCase()})]:ks[0];if(!k)return;
 const named=k==='poison'&&(G.fs.named||[]).length,o=SR.pct(chanceOf(L,'Medicine',k==='poison'&&!named?-20:0));await say('',resultLine('TREAT · MEDICINE',o),{auto:1000});
 if(o.ok){clearStatus(t,k);await say('',fillT(MMW.treated,{n:t.name,s:PST[k].name}))}else{tried(L,'Medicine');await say('',MMW.treatFail)}}
async function sedate(){const L=lead(),t=await pickMember(MMW.sedate.toUpperCase(),flaringAny,MMW.sedateWhy);if(!t)return;
 const o=SR.pct(chanceOf(L,'Medicine'));await say('',resultLine('SEDATE · MEDICINE',o),{auto:1000});if(o.ok){calmFlare(t);await say('',fillT(MMW.sedated,{n:t.name}))}else{tried(L,'Medicine');await say('',MMW.treatFail)}}
async function makeCamp(){G.fs.camped=1;await say('',MMW.camped);await rest(.5)}
async function analyze(){const L=lead(),o=SR.pct(chanceOf(L,'Science'));await say('',resultLine('ANALYZE · SCIENCE',o),{auto:1000});
 if(!o.ok){tried(L,'Science');await say('',MMW.treatFail);return}const c=caseById(G.case);const s=G.fs.samples.splice(0);await say('',fillT(MMW.analyzed,{n:L.name}));if(c&&c.analyze)await c.analyze(s)}
async function retch(){const t=await pickMember(MMW.retch.toUpperCase(),m=>hasSt(m,'sick')&&!m.retched,MMW.retchWhy);if(!t)return;t.retched=true;
 const o=SR.pct(t.a.stats.CON*5+rollMod(t,''));await say('',resultLine('RETCH · CON',o),{auto:1000});if(o.ok){clearStatus(t,'sick');await say('',fillT(MMW.retched,{n:t.name}))}else await say('',fillT(MMW.retchFail,{n:t.name}))}

// ================= USING AN ITEM ON THE MAP (A1, Item list) =================
// returns true when a use was spent
async function useItem(m,it){
 const d=itemDef(it.k);if(d.mapUse)return !!(await d.mapUse(m,it));
 const who=(title,ok,why)=>pickMember(title||d.name.toUpperCase(),ok||(()=>true),why);
 const heal=async(t,h)=>{t.hp=Math.min(t.mhp,t.hp+h);await say('',fillT(MMW.healed,{n:t.name,h}))};
 const clearIt=async(k)=>{const t=await who(null,x=>hasSt(x,k),`No one is ${PST[k].name}.`);if(!t)return false;clearStatus(t,k);await say('',fillT(MMW.treated,{n:t.name,s:PST[k].name}));return true};
 const drug=async t=>{t.doses=t.doses||{};t.doses[it.k]=(t.doses[it.k]||0)+1;await addStatus(t,'high',{noShrug:true});t.stc.high=4;t.high=it.k;
  const ad=(t.dis||[]).find(x=>x.k==='addiction'&&x.s===d.name);
  if(ad){if(t.flare)delete t.flare.addiction;if(!G.fs.perk['used'+t.a.id]){G.fs.perk['used'+t.a.id]=1;bondsLoseOne(t)}}
  else if(t.doses[it.k]===2){const r=SR.pct(t.san);await say('',resultLine('SAN',r),{auto:1000});if(!r.ok){t.dis=t.dis||[];t.dis.push({k:'addiction',s:d.name});await say('',`${t.name} needs more ${d.name.toLowerCase()} than they should.`)}}};
 switch(d.map){
  case 'heal4':{const t=await who();if(!t)return false;await heal(t,roll(1,4));return true}
  case 'heal6':{const t=await who();if(!t)return false;await heal(t,roll(1,6));return true}
  case 'bandage':return clearIt('bleed');
  case 'salts':return clearIt('sick');
  case 'antitoxin':return clearIt('poison');
  case 'cigs':return clearIt('shaken');
  case 'energy':{const t=await who();if(!t)return false;clearStatus(t,'tired');const w=roll(1,4);t.wp=Math.min(t.mwp,t.wp+w);await say('',`${t.name} +${w} WP.`);return true}
  case 'icepack':{const t=await who();if(!t)return false;clearStatus(t,'stun');await heal(t,roll(1,4));return true}
  case 'booze':{const t=await who();if(!t)return false;await addStatus(t,'drunk',{noShrug:true});t.stc.drunk=4;await say('',`${t.name} drinks. Drunk.`);
   const g=gearOf(m),b=newItem('w_bottle');if(g.w.length<2)g.w.push(b);else G.fs.pack.push(b);return true}
  case 'joint':case 'nerve':case 'uppers':case 'strongpk':case 'coke':case 'shrooms':{const t=await who();if(!t)return false;await drug(t);
   if(d.map==='joint')clearStatus(t,'shaken');if(d.map==='nerve')t.nerve=true;
   if(d.map==='uppers'){clearStatus(t,'tired');const w=roll(1,4);t.wp=Math.min(t.mwp,t.wp+w)}
   if(d.map==='strongpk')t.hp=Math.min(t.mhp,t.hp+roll(1,6));
   await say('',`${t.name} takes the ${d.name.toLowerCase()}. High.`);return true}
  case 'flare':if(G.M.light!=='night'){await say('','It isn\'t dark enough here to need it.');return false}
   G.fs.flareMap=G.map;await say('','The road flare hisses red. The dark backs off.');return true
  case 'roamer':{const r=roamNear();if(!r){await say('',RW_.none);return false}
   await roamMenu(r);return false}  // the roamer's own menu spends the item if it's used
  case 'sedative':{const t=await who(null,flaringAny,MMW.sedateWhy);if(!t)return false;calmFlare(t);await say('',fillT(MMW.sedated,{n:t.name}));return true}
  case 'jammer':G.fs.jam[G.map]=1;await say('','Phones and cameras die all around you.');return true
  case 'uv':G.fs.uv[G.map]=1;await say('','The UV lamp sweeps the area. Nothing hidden glows here.');return true
  case 'hotline':{const cat=Object.entries(FI).filter(([k,x])=>x.lb);
   await say('',IU.hotlineAsk);const i=await choose(cat.map(([k,x])=>`${x.name} · ${x.req>=0?'+':''}${x.req}%`),{cancel:true,title:'HOTLINE'});if(i<0)return false;
   const [k,x]=cat[i],o=SR.pct(chanceOf(m,'Bureaucracy',(x.req||0)+15));await say('',resultLine('BUREAUCRACY',o),{auto:1000});
   if(!o.ok){tried(m,'Bureaucracy');await say('BIG HAT',IU.hotlineNo);return true}
   const n=newItem(k),g=gearOf(m);if(x.w&&g.w.length<2)g.w.push(n);else if(!x.w&&!x.worn&&g.it.length<8)g.it.push(n);else G.fs.pack.push(n);refreshW(m);await say('',IU.hotlineOk+` ${x.name}.`);return true}
 }
 return false}
function bondsLoseOne(m){const a=m.a;if(!(a.bonds||[]).length)return;const j=rnd(a.bonds.length);a.bondDmg=a.bondDmg||[];a.bondDmg[j]=(a.bondDmg[j]||0)+1}
function useWhy(it){const d=itemDef(it.k);if(it.u<=0)return IU.spent;if(d.mapUse||d.map)return'';if(d.battle||d.battleUse)return IU.battleOnly;if(d.hot)return IU.hotOnly;if(d.passive)return IU.passive;return IU.battleOnly}

// ================= THE ITEM SCREENS (A1, Item display) =================
// One look for Items and Give item: a header with the owner and slots used (RAINE 5/8), rows on top, a navy detail box under them.
// L/R flip agents (Quality of life). Drawn on the 240 px canvas like the party menu. SCR is the open screen.
let SCR=null;
function openItems(o){return new Promise(res=>{SCR={kind:'items',i:o.i|0,sel:0,top:0,give:!!o.give,pack:false,done:res,hits:[]};ban.hidden=true})}
function closeScr(){const s=SCR;SCR=null;if(s&&s.done)s.done()}
function itemRows(s){
 if(s.pack)return G.fs.pack.map((it,j)=>({it,where:'pack',j}));
 const m=party[s.i],g=gearOf(m),rows=[];
 rows.push({head:IU.weapons});
 for(let j=0;j<2;j++)rows.push(g.w[j]?{it:g.w[j],where:'w',j,eq:j===g.eq}:{empty:1});
 if(g.worn.length){rows.push({head:IU.worn});g.worn.forEach((it,j)=>rows.push({it,where:'worn',j}))}
 rows.push({head:`${IU.slots} ${g.it.length}/8`});
 for(let j=0;j<8;j++)rows.push(g.it[j]?{it:g.it[j],where:'it',j}:{empty:1});
 if(!s.give)rows.push({pack:1});
 return rows}
const pickable=r=>!r.head&&!r.empty;
function scrPress(k){
 const s=SCR;if(!s)return;
 if(s.kind==='page')return pagePress(k);if(s.kind==='log')return logPress(k);
 const rows=itemRows(s),n=rows.length;
 const step=d=>{if(!rows.some(pickable))return;let j=s.sel;do{j=(j+d+n)%n}while(!pickable(rows[j]));s.sel=j};
 if(!pickable(rows[s.sel]||{}))step(1);
 if(k==='up')step(-1);else if(k==='down')step(1);
 else if((k==='l'||k==='r')&&party.length>1){s.i=(s.i+(k==='l'?-1:1)+party.length)%party.length;s.sel=0;s.top=0}
 else if(k==='b'){if(s.pack){s.pack=false;s.sel=0;s.top=0}else closeScr()}
 else if(k==='a'){const r=rows[s.sel];if(r){s.lock=1;run(async()=>{try{await itemAct(s,r)}finally{s.lock=0}})}}
}
async function itemAct(s,r){
 if(r.pack){s.pack=true;s.sel=0;s.top=0;return}
 if(!r.it)return;const m=party[s.i],g=gearOf(m),d=itemDef(r.it.k);
 if(s.give)return giveFlow(m,r);
 if(r.where==='pack'){
  const opts=[];if(d.w)opts.push([IU.take,g.w.length<2,IU.noWeapRoom]);else if(d.worn)opts.push([IU.wear,!wearing(m,r.it.k),IU.worn1]);else opts.push([IU.take,g.it.length<8,IU.noRoom]);
  const c=await choose(opts.map(([l,ok])=>({label:`${l} → ${m.name}`,dis:!ok})),{cancel:true,title:d.name.toUpperCase(),desc:opts.map(([l,ok,w])=>ok?'':w)});if(c<0)return;
  const it=G.fs.pack.splice(r.j,1)[0];(d.w?g.w:d.worn?g.worn:g.it).push(it);refreshW(m);s.sel=Math.min(s.sel,Math.max(0,G.fs.pack.length-1));return}
 const acts=[];
 if(r.where==='w'){acts.push([IU.equip,!r.eq,IU.equipped,()=>{g.eq=r.j;refreshW(m)}])}
 else if(r.where==='worn'){acts.push([IU.remove,true,'',()=>{G.fs.pack.push(g.worn.splice(r.j,1)[0])}])}
 else{const why=useWhy(r.it);acts.push([IU.use,!why,why,async()=>{if(await useItem(m,r.it))spend(m,r.it)}]);if(d.worn)acts.push([IU.wear,!wearing(m,r.it.k),IU.worn1,()=>{g.worn.push(g.it.splice(r.j,1)[0])}])}
 if(party.length>1)acts.push([IU.give,true,'',()=>giveFlow(m,r)]);
 if(r.where!=='worn')acts.push([IU.stash,true,'',()=>{const L=r.where==='w'?g.w:g.it;G.fs.pack.push(L.splice(r.j,1)[0]);if(r.where==='w'){if(g.eq>=g.w.length)g.eq=0;else if(r.j<g.eq)g.eq--}refreshW(m)}]);
 const c=await choose(acts.map(([l,ok])=>({label:l,dis:!ok})),{cancel:true,title:d.name.toUpperCase(),desc:acts.map(([l,ok,w])=>ok?'':w)});
 if(c<0)return;await acts[c][3]();refreshW(m);
}
// Give item: pick a teammate; each row shows slots used (5/8) and weapons (1/2), full ones greyed (Item display)
async function giveFlow(m,r){
 const d=itemDef(r.it.k),others=party.filter(x=>x!==m&&!x.gone);if(!others.length)return;
 const full=x=>d.w?gearOf(x).w.length>=2:d.worn&&r.where==='worn'?wearing(x,r.it.k):gearOf(x).it.length>=8;
 const why=x=>flaring(x,'paranoia')?IU.paranoid:full(x)?(d.w?IU.noWeapRoom:d.worn&&r.where==='worn'?IU.worn1:IU.noRoom):'';
 const c=await choose(others.map(x=>({label:`${x.name}  ${slotsUsed(x)}/8 · ${gearOf(x).w.length}/2`,dis:!!why(x)})),{cancel:true,title:IU.giveTo+' · '+d.name.toUpperCase(),desc:others.map(why)});
 if(c<0)return;const t=others[c],g=gearOf(m),L=r.where==='w'?g.w:r.where==='worn'?g.worn:g.it,it=L.splice(r.j,1)[0];
 if(r.where==='w'){if(g.eq>=g.w.length)g.eq=0;else if(r.j<g.eq)g.eq--}
 (d.w?gearOf(t).w:r.where==='worn'?gearOf(t).worn:gearOf(t).it).push(it);refreshW(m);refreshW(t);
 const s=SCR;if(s&&s.kind==='items')s.sel=0;
}
// small pixel icons: lantern (kit), pin (case-only), bang (Loud)
function icoLantern(x,y,c){pR(x+1,y,3,1,c);pR(x,y+1,5,5,c);pR(x+1,y+2,3,3,'#fff1c4');pR(x+1,y+6,3,1,c)}
function icoPin(x,y,c){pR(x+1,y,3,3,c);pR(x,y+1,5,1,c);pR(x+2,y+3,1,4,PC.cream)}
function icoBang(x,y,c){pR(x+2,y,1,5,c);pR(x+2,y+6,1,1,c);pR(x,y+2,1,1,c);pR(x+4,y+2,1,1,c)}
function icoSkull(x,y,c){pR(x+1,y,5,4,c);pR(x,y+1,7,3,c);pR(x+1,y+2,2,1,PC.navy);pR(x+4,y+2,2,1,PC.navy);pR(x+2,y+4,3,2,c);pR(x+2,y+5,1,1,PC.navy);pR(x+4,y+5,1,1,PC.navy)}
function drawScr(){
 const s=SCR;if(s.kind==='page')return drawPage();if(s.kind==='log')return drawLog();
 pR(0,0,VW,VH,PC.navy);s.hits=[];
 const m=party[s.i];if(!m){closeScr();return}
 const rows=itemRows(s);if(!pickable(rows[s.sel]||{})){const j=rows.findIndex(pickable);s.sel=j<0?0:j}
 // header: whose list and slots used, L/R arrows
 pBox(4,4,232,18,PC.deep,PC.cream);
 const title=s.pack?`${IU.pack} ${G.fs.pack.length} → ${m.name.toUpperCase()} ${slotsUsed(m)}/8`:`${s.give?IU.give.toUpperCase()+' · ':''}${m.name.toUpperCase()} ${slotsUsed(m)}/8`;
 pT(pFit(title,190,16),12,5,PC.gold,16);if(party.length>1){pT('L',222-pW('L R',15)+0,6,PC.lav,15);pT('R',226,6,PC.lav,15);
  s.hits.push({x:200,y:2,w:16,h:22,fn:()=>scrPress('l')},{x:220,y:2,w:16,h:22,fn:()=>scrPress('r')})}
 // rows (scrolling), detail box under them
 const RH=13,detH=46,top=26,avail=Math.max(3,Math.floor((VH-top-detH-22)/RH));
 if(s.sel<s.top)s.top=s.sel;if(s.sel>=s.top+avail)s.top=s.sel-avail+1;s.top=clamp(s.top,0,Math.max(0,rows.length-avail));
 const listH=avail*RH+4;pBox(4,top,232,listH,PC.card,PC.dim);
 if(!rows.length)pT(IU.noPack,10,top+2,PC.lav,15);
 rows.slice(s.top,s.top+avail).forEach((r,k)=>{const y=top+2+k*RH,j=s.top+k,on=j===s.sel;
  if(r.head){pT(r.head,9,y-1,PC.mus,13);return}
  if(on)pR(6,y,228,RH,PC.cardOn);
  if(on)pT('▶',7,y-2,PC.gold,15);
  if(r.empty){pT(IU.empty,18,y-2,PC.dim,15);return}
  if(r.pack){pT(`${IU.packRow} (${G.fs.pack.length}) ▸`,18,y-2,PC.cream,15);s.hits.push({x:6,y,w:228,h:RH,fn:()=>{s.sel=j;scrPress('a')}});return}
  const d=itemDef(r.it.k),spent=r.it.kit&&!r.it.u;
  pT(pFit((r.eq?'E ':'')+rowName(r.it),170,15),18,y-2,spent?PC.dim:r.eq?PC.gold:PC.cream,15);
  let ix=228;const W=d.w&&B.WEAP[d.w];
  if(d.loud||(W&&W.loud)){ix-=7;icoBang(ix,y+3,PC.pump)}if(r.it.pin){ix-=7;icoPin(ix,y+3,PC.pink)}if(r.it.kit){ix-=7;icoLantern(ix,y+3,PC.mus)}
  s.hits.push({x:6,y,w:228,h:RH,fn:()=>{if(s.sel===j)scrPress('a');else s.sel=j}});
 });
 const dy=top+listH+3,r=rows[s.sel];pBox(4,dy,232,detH,PC.deep,PC.cream,2);
 if(r&&r.it)pWrap(detailOf(r.it,m),220,15,3).forEach((l,k)=>pT(l,10,dy+3+k*13,k?PC.lav:PC.cream,15));
 else if(r&&r.pack)pT(IU.packKeys,10,dy+3,PC.lav,15);
 if(VH-(dy+detH)>=16)pT(s.pack?IU.packKeys:IU.keys,8,dy+detH+2,PC.dim,14);
}

// ================= CASE FILE AND RULES (A5) =================
function openCaseFile(){return new Promise(res=>{SCR={kind:'page',top:0,rules:false,done:res,hits:[]};ban.hidden=true})}
function pageLines(rules){
 const L=[],add=(t,col,ico)=>pWrap(t,ico?204:220,15,20).forEach((l,k)=>L.push([l,col,k?null:ico]));
 if(!rules){
  const c=caseById(G.case),next=c&&c.next?c.next():'';
  L.push([MMW.next,PC.mus]);add(next||'—',PC.gold);L.push(['',PC.dim]);
  L.push([`${MMW.clues} (${G.clues.length})`,PC.mus]);if(!G.clues.length)add(MMW.noClues,PC.lav);G.clues.forEach(cl=>add('• '+cl.text,PC.cream));
  L.push(['',PC.dim]);const s=loadSeason(),st=stepsOf();L.push([MMW.overstep,PC.mus]);add(st[clamp(s.overstep|0,0,st.length-1)],PC.cream);
  L.push(['',PC.dim]);L.push(['▸ '+MMW.rules+' (A)',PC.lav]);
 }else{
  L.push([MMW.statuses,PC.mus]);Object.values(PST).forEach(x=>add(`${x.name}: ${x.line}`,PC.cream));
  L.push(['',PC.dim]);L.push([MMW.icons,PC.mus]);add(IU.kit,PC.cream,'lantern');add(IU.pin,PC.cream,'pin');add(IU.bang,PC.cream,'bang');
  L.push(['',PC.dim]);L.push([MMW.skulls,PC.mus]);MMW.skullLines.forEach((t,k)=>add(t,PC.cream,'skull'+(k+1)));
 }
 return L}
function pagePress(k){const s=SCR;if(k==='up')s.top=Math.max(0,s.top-3);else if(k==='down')s.top+=3;else if(k==='a'&&!s.rules){s.rules=true;s.top=0}else if(k==='b'){if(s.rules){s.rules=false;s.top=0}else closeScr()}}
function drawPage(){
 const s=SCR;pR(0,0,VW,VH,PC.navy);pBox(4,4,232,18,PC.deep,PC.cream);pT(s.rules?MMW.rulesT:MMW.caseFile,10,9,PC.gold,8,PXf);
 const lines=pageLines(s.rules),RH=13,top=26,avail=Math.floor((VH-top-20)/RH);s.top=clamp(s.top,0,Math.max(0,lines.length-avail));
 pBox(4,top,232,avail*RH+4,PC.card,PC.dim);
 lines.slice(s.top,s.top+avail).forEach(([t,col,ico],k)=>{const y=top+2+k*RH;let x=10;
  if(ico){if(ico==='lantern')icoLantern(x,y+3,PC.mus);else if(ico==='pin')icoPin(x,y+3,PC.pink);else if(ico==='bang')icoBang(x,y+3,PC.pump);else{const n=+ico.slice(5);for(let q=0;q<n;q++)icoSkull(x+q*8,y+3,PC.cream);x+=n*8-8}x+=14}
  pT(t,x,y-2,col,15)});
 pT(s.rules?MMW.rulesKeys:MMW.pageKeys,8,top+avail*RH+6,PC.dim,14);
}
// ================= LOG (A5): the last 30 boxes, reread in the Lantern Bust box =================
function logLine(name,text){if(!G.fs||Bt)return;const L=G.fs.log;if(L.length&&L[L.length-1].t===text)return;L.push({n:name||'',t:text});if(L.length>30)L.splice(0,L.length-30)}
function openLog(){return new Promise(res=>{const L=G.fs.log;if(!L.length){say('',MMW.noLog).then(res);return}SCR={kind:'log',i:L.length-1,done:res,hits:[]};showLog();ban.hidden=true})}
function showLog(){const e=G.fs.log[SCR.i];box={name:e.n,text:e.t,typed:e.t.length,more:false};boxKey=''}
function logPress(k){const s=SCR,n=G.fs.log.length;if(k==='up'||k==='l'){s.i=Math.max(0,s.i-1);showLog()}else if(k==='down'||k==='r'){s.i=Math.min(n-1,s.i+1);showLog()}else if(k==='b'||k==='a'&&s.i===n-1){box=null;closeScr()}else if(k==='a'){s.i++;showLog()}}
function drawLog(){pR(0,0,VW,VH,PC.navy);pBox(4,4,232,18,PC.deep,PC.cream);pT(`${MMW.log} ${SCR.i+1}/${G.fs.log.length}`,10,9,PC.gold,8,PXf);pT(MMW.logKeys,8,26,PC.lav,14)}
// taps on the item screens, the case file and the lead card's status icons
cv.addEventListener('click',e=>{if(!G.active)return;const r=cv.getBoundingClientRect();if(!r.width)return;const x=(e.clientX-r.left)*VW/r.width,y=(e.clientY-r.top)*VH/r.height;
 const hits=SCR?SCR.hits:(!PM&&!dlg&&!menu&&G.mode==='world'&&G.hudHits)||[];for(const h of hits)if(x>=h.x&&x<h.x+h.w&&y>=h.y&&y<h.y+h.h){h.fn();return}});

// ================= THE LEAD CARD'S ICONS AND PULSE (A3) =================
// status icons sit just under the lead card; flaring disorders pulse; the card blinks at 3 HP or less, Bleeding or Poisoned
function drawLeadIcons(x,y,cw,ch){
 const L=lead(),now=performance.now(),on=Math.floor(now/400)%2===0;G.hudHits=[];
 if(lowPulse(L)&&on){pR(x,y,cw,1,PC.pump);pR(x,y+ch-1,cw,1,PC.pump);pR(x,y,1,ch,PC.pump);pR(x+cw-1,y,1,ch,PC.pump)}
 let ix=x;const iy=y+ch+2;
 for(const c of chipsOf(L)){const w=pW(c.chip,11)+5;if(ix+w>VW-2)break;if(!(c.flare&&!on)){pR(ix,iy,w,10,c.col);pT(c.chip,ix+3,iy-1,PC.chipInk,11)}
  G.hudHits.push({x:ix,y:iy-2,w,h:14,fn:()=>run(()=>say('',c.line))});ix+=w+2}
}
// the lead can't be someone whose phobia is flaring (Disorders, Phobia)
const canLeadField=m=>!flaring(m,'phobia');

window.BLF={horror,trigger,addStatus,clearStatus,pickup,hunch,overstep,luck,holdersOf,motivate,rest,recruitBuilt,itemDef,gearOf,live};
