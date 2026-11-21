// Black Lantern · creator.js
// The agent creator plus the shared shell (buttons, keyboard, portraits). Exposes window.BL.
// Needs strings.js loaded first.
(()=>{
// ---------- DATA (text lists come from strings.js) ----------
const {SKILLS,P,PROFS,STATS,STATNAME,FEAT,RELS,FIRST,LAST,MOTIVES,ADJ,NOUN,HAIRCN,HAIRS,EYES,ACC,OUTCN,CREEP,ITEMDEF,WEAP,SP,SPECS,STEPNAME}=window.BLS;
const SKIN=['#f6d7b8','#e9b98f','#c98e62','#a26a43','#7a4a2c','#4e2f1f'];
const HAIRC=['#1b1414','#4a2c1a','#8a5a2b','#d8b25a','#b94a2c','#9aa0a6','#ece8de'];
const OUTC=['#2d3a5c','#3e5c3a','#7a2e3e','#4b3b6e','#8a7a52','#232326','#4f87a3'];
const specOf=a=>{const L=SPECS[a.prof]||[];return L.find(s=>s.id===a.spec)||L[0]||null};
const kitText=s=>Object.entries(s.items).map(([k,n])=>`${ITEMDEF[k].name}${n>1?' x'+n:''}`).join(' · ');
const STEPS=['profession','loadout','stats','skills','bonds','look','identity','dossier'];

// ---------- STATE ----------
const rnd=n=>Math.floor(Math.random()*n), pick=a=>a[rnd(a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const roll4d6=()=>{const r=[1,2,3,4].map(()=>1+rnd(6)).sort((a,b)=>a-b);return r[1]+r[2]+r[3]};
const rollStats=()=>Object.fromEntries(STATS.map(k=>[k,roll4d6()]));
const genCode=()=>pick(ADJ)+' '+pick(NOUN);
function newAgent(){return {prof:null,spec:null,method:'buy',stats:Object.fromEntries(STATS.map(k=>[k,12])),picks:{},bonds:[],look:{skin:1,hair:0,hairC:1,eyes:0,acc:0,outfitC:-1},name:'',code:'',age:34,motives:[]}}
const profOf=a=>PROFS.find(p=>p.id===a.prof);
function setProf(a,p){if(a.prof!==p.id)a.spec=null;a.prof=p.id;a.picks={};const old=a.bonds;a.bonds=[];for(let i=0;i<p.bonds;i++)a.bonds.push(old[i]||{name:'',rel:RELS[i%RELS.length]});}
function randomProf(){const odd=Math.random()<0.25;return pick(PROFS.filter(p=>!!p.odd===odd));}
const derived=a=>{const s=a.stats;return{HP:Math.ceil((s.STR+s.CON)/2),WP:s.POW,SAN:s.POW*5,BP:s.POW*4}};
function skillVal(a,k){const p=profOf(a);return Math.max(SKILLS[k],(p&&p.skills[k])||0)+20*(a.picks[k]||0)}
const picksUsed=a=>Object.values(a.picks).reduce((x,y)=>x+y,0);
const buyLeft=a=>72-STATS.reduce((t,k)=>t+a.stats[k],0);
const feature=(k,v)=>v<=5?FEAT[k][0]:v>=16?FEAT[k][1]:'';
const randomLook=()=>({skin:rnd(6),hair:rnd(7),hairC:rnd(7),eyes:rnd(3),acc:rnd(7),outfitC:-1});
function autoPicks(a){let n=8,g=0;const p=profOf(a),keys=Object.keys(p.skills).concat(Object.keys(p.skills),Object.keys(SKILLS));while(n>0&&g++<300){const k=pick(keys);if(skillVal(a,k)+20<=80){a.picks[k]=(a.picks[k]||0)+1;n--}}}
function randomAgent(){const a=newAgent();a.method='roll';a.stats=rollStats();a.code=genCode();setProf(a,randomProf());a.spec=pick(SPECS[a.prof]).id;a.bonds.forEach(b=>b.name=pick(FIRST));a.look=randomLook();a.name=pick(FIRST)+' '+pick(LAST);a.age=24+rnd(36);a.motives=shuffle(MOTIVES).slice(0,3);autoPicks(a);return a}

const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};

// ---------- SAVE VERSIONS ----------
// bl.version holds the save version. On load, every upgrade step above the stored version runs
// in order, bringing old saves forward before anything reads them. Before upgrading, the old
// saves are copied to bl.backup. Rules: never change an old step; a new save shape gets a new
// step and SAVE_V goes up by one. Saves from before numbering count as version 0.
const SAVE_V=1;
const fillAgent=a=>{if(!a||typeof a!=='object'||Array.isArray(a))return null;const d=newAgent();
  const o=Object.assign(d,a);o.look=Object.assign(newAgent().look,a.look||{});o.stats=Object.assign(newAgent().stats,a.stats||{});
  if(!o.picks||typeof o.picks!=='object')o.picks={};if(!Array.isArray(o.bonds))o.bonds=[];if(!Array.isArray(o.motives))o.motives=[];return o};
const UPGRADES={
  // 0 → 1 (Nov 21): first numbered version. Drops the retired sound key, fills any missing agent
  // fields with creator defaults, and sets aside a checkpoint that can't be read.
  1(){
    try{localStorage.removeItem('bl.sound')}catch(e){}
    const r=store.get('bl.roster',[]);store.set('bl.roster',(Array.isArray(r)?r:[]).map(fillAgent).filter(Boolean));
    const d=store.get('bl.draft',null);if(d!==null){const f=fillAgent(d);f?store.set('bl.draft',f):localStorage.removeItem('bl.draft')}
    let g=store.get('bl.game',null);
    if(g!==null){try{const o=typeof g==='string'?JSON.parse(g):g;if(!o||!o.map||!Array.isArray(o.party)||!o.party.length)throw 0;
        o.party.forEach(m=>{m.a=fillAgent(m.a)||newAgent()});store.set('bl.game',JSON.stringify(o))}
      catch(e){localStorage.setItem('bl.broken',localStorage.getItem('bl.game'));localStorage.removeItem('bl.game')}}
  }
};
function upgradeSaves(){
  try{
    const keys=Object.keys(localStorage).filter(k=>k.startsWith('bl.')&&k!=='bl.backup'&&k!=='bl.version');
    let v=+(localStorage.getItem('bl.version')||0);
    if(!keys.length){localStorage.setItem('bl.version',SAVE_V);return}  // fresh phone: nothing to upgrade
    if(v>=SAVE_V)return;  // up to date (or saved by a newer build: leave it alone)
    const old=store.get('bl.backup',null);  // a retry after a failed upgrade keeps the first, untouched copy
    if(!old||old.from!==v)localStorage.setItem('bl.backup',JSON.stringify({from:v,at:new Date().toISOString(),keys:Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)]))}));
    for(v=v+1;v<=SAVE_V;v++){UPGRADES[v]();localStorage.setItem('bl.version',v)}
  }catch(e){console.warn('Save upgrade stopped:',e)}
}
upgradeSaves();
const S={step:'title',sel:{},a:store.get('bl.draft',null)||newAgent(),roster:store.get('bl.roster',[]),san:99,swap:null,squad:null,clearArm:false,saved:false};


// ---------- PIXEL PORTRAIT ----------
function shade(hex,amt){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const f=v=>Math.max(0,Math.min(255,Math.round(v+amt)));return'#'+[f(r),f(g),f(b)].map(v=>v.toString(16).padStart(2,'0')).join('')}
function drawPortrait(cv,a,scale,blink){
  const p=profOf(a)||PROFS[0],L=a.look,ctx=cv.getContext('2d');cv.width=24*scale;cv.height=24*scale;
  ctx.imageSmoothingEnabled=false;ctx.setTransform(scale,0,0,scale,0,0);ctx.clearRect(0,0,24,24);
  const px=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,w,h)};
  const OL='#120c1c',sk=SKIN[L.skin],sd=shade(sk,-28),hc=HAIRC[L.hairC],hd=shade(hc,-25);
  let oc=L.outfitC>=0?OUTC[L.outfitC]:OUTC[p.color];
  if(p.outfit==='clerical'&&L.outfitC<0)oc='#1d1b22';
  const od=shade(oc,-22),ol=shade(oc,24);
  // long hair behind
  if(L.hair===1){px(6,7,2,11,hc);px(16,7,2,11,hc);px(5,8,1,9,OL);px(18,8,1,9,OL)}
  // body
  px(5,19,14,5,oc);px(6,18,12,1,oc);px(4,19,1,5,OL);px(19,19,1,5,OL);px(5,18,1,1,OL);px(18,18,1,1,OL);px(6,17,4,1,OL);px(14,17,4,1,OL);
  const o=p.outfit;
  if(o==='suit'){px(9,18,6,1,'#ece8de');px(10,19,4,1,'#ece8de');px(11,20,2,1,'#ece8de');px(11,19,2,1,'#8c2f39');px(11,20,2,3,'#8c2f39');px(9,19,1,4,od);px(14,19,1,4,od)}
  else if(o==='labcoat'){px(5,19,14,5,'#e6e6ea');px(6,18,12,1,'#e6e6ea');px(10,18,4,6,oc);px(9,18,1,6,'#b8b8c4');px(14,18,1,6,'#b8b8c4');px(15,21,2,1,'#b8b8c4');px(16,20,1,1,'#2d6ad1')}
  else if(o==='scrubs'){px(10,18,4,1,sk);px(11,19,2,1,sk);px(15,21,2,1,od)}
  else if(o==='tactical'){px(7,19,10,5,od);px(8,18,1,6,'#1d1d1f');px(15,18,1,6,'#1d1d1f');px(9,21,2,2,ol);px(13,21,2,2,ol)}
  else if(o==='cardigan'){px(11,18,2,6,'#e8dcc0');px(10,20,1,1,'#ddd');px(10,22,1,1,'#ddd');px(6,22,3,1,od)}
  else if(o==='hoodie'){px(8,17,8,2,od);px(10,19,1,3,'#ddd');px(13,19,1,3,'#ddd');px(9,22,6,2,od)}
  else if(o==='uniform'){px(10,18,4,1,od);px(15,20,2,2,'#f2c94c');px(7,20,3,1,od);px(12,19,1,5,od)}
  else if(o==='clerical'){px(11,18,2,1,'#f4f4f4')}
  else if(o==='ranger'){px(6,20,2,2,'#3e5c3a');px(15,20,2,2,'#f2c94c');px(10,18,4,1,od)}
  else if(o==='mail'){for(let i=0;i<6;i++)px(7+i*2,18+i,2,1,'#5a3e2b');px(15,20,2,1,'#c0392b')}
  else if(o==='janitor'){px(8,20,8,4,'#3b5b8a');px(9,18,1,2,'#3b5b8a');px(14,18,1,2,'#3b5b8a');px(11,21,2,1,'#f2c94c')}
  else if(o==='apron'){px(8,19,8,5,'#f4f1e8');px(8,19,8,1,'#e86a92');px(8,22,8,1,'#7fd6e6')}
  // neck
  px(10,16,4,2,sk);px(10,16,4,1,sd);px(9,16,1,1,OL);px(14,16,1,1,OL);
  // head
  px(8,6,8,10,sk);px(8,5,8,1,OL);px(7,6,1,9,OL);px(16,6,1,9,OL);px(8,15,1,1,OL);px(15,15,1,1,OL);px(9,16,1,0,OL);
  px(7,10,1,2,sk);px(16,10,1,2,sk);px(6,10,1,2,OL);px(17,10,1,2,OL);
  // brows/eyes
  px(9,8,2,1,L.hair===3?sd:hd);px(13,8,2,1,L.hair===3?sd:hd);
  if(blink){px(9,11,2,1,OL);px(13,11,2,1,OL)}
  else if(L.eyes===0){px(10,10,1,2,OL);px(13,10,1,2,OL)}
  else if(L.eyes===1){px(9,10,2,2,'#f4f4f4');px(13,10,2,2,'#f4f4f4');px(10,10,1,2,OL);px(13,10,1,2,OL)}
  else{px(9,10,2,1,sd);px(13,10,2,1,sd);px(10,11,1,1,OL);px(13,11,1,1,OL);px(9,12,2,1,shade(sk,-15));px(13,12,2,1,shade(sk,-15))}
  px(12,12,1,1,sd);px(11,14,2,1,'#7a3b3b');
  // hair front
  const top=()=>{px(8,4,8,3,hc);px(7,5,1,4,hc);px(16,5,1,4,hc);px(8,3,8,1,OL);px(7,4,1,1,OL);px(16,4,1,1,OL);px(9,6,3,1,hc);px(13,6,2,1,hc)};
  if(L.hair===0||L.hair===1)top();
  else if(L.hair===2){px(8,5,8,2,hd)}
  else if(L.hair===3){px(10,6,2,1,'rgba(255,255,255,.35)')}
  else if(L.hair===4){top();px(10,1,4,3,hc);px(10,0,4,1,OL);px(9,1,1,2,OL);px(14,1,1,2,OL)}
  else if(L.hair===5){px(11,1,2,6,hc);px(11,0,2,1,OL)}
  else if(L.hair===6){px(7,3,10,4,hc);px(6,4,1,4,hc);px(17,4,1,4,hc);px(9,2,2,1,hc);px(13,2,2,1,hc);px(7,7,1,2,hc);px(16,7,1,2,hc);px(10,4,1,1,hd);px(14,5,1,1,hd);px(8,5,1,1,hd)}
  // accessory
  const A=L.acc;
  if(A===1){px(8,9,4,4,OL);px(12,9,4,4,OL);px(9,10,2,2,'#bfe3ff');px(13,10,2,2,'#bfe3ff');if(!blink){px(10,10,1,2,OL);px(13,10,1,2,OL)}}
  else if(A===2){px(8,10,8,2,OL);px(9,10,1,1,'#5a5a66');px(13,10,1,1,'#5a5a66')}
  else if(A===3){px(8,12,8,4,hc);px(9,16,6,1,hc);px(12,12,1,1,sd);px(11,14,2,1,'#3a1d1d')}
  else if(A===4){px(13,12,1,1,'#c0566b');px(14,13,1,1,'#c0566b');px(15,14,1,1,'#c0566b')}
  else if(A===5){px(17,10,1,2,'#9aa0a6');px(17,12,1,5,'#6d737a')}
  else if(A===6){px(8,8,8,1,OL);px(12,9,4,4,OL)}
}
const urlCache={};
function portraitURL(a,scale){const k=JSON.stringify([a.prof,a.look,scale]);if(!urlCache[k]){const c=document.createElement('canvas');drawPortrait(c,a,scale,false);urlCache[k]=c.toDataURL()}return urlCache[k]}

// ---------- VIEWS ----------
const R=(label,o={})=>Object.assign({label},o);
const ST=html=>({static:html});
const goto=step=>{S.step=step;S.swap=null;if(step!=='dossier')S.squad=null;S.clearArm=false};
const nextStep=()=>{const i=STEPS.indexOf(S.step);if(i>=0&&i<STEPS.length-1){if(!S.a.prof)return toast('PICK A PROFESSION FIRST');if(S.step==='loadout'&&!S.a.spec)return toast('PICK A SPECIALTY');if(S.step==='stats'&&S.a.method==='buy'&&buyLeft(S.a)!==0)return toast('SPEND EXACTLY 72 POINTS');goto(STEPS[i+1])}};
const prevStep=()=>{const i=STEPS.indexOf(S.step);if(i>0){goto(STEPS[i-1])}else if(i===0||S.step==='roster'){goto('title')}};
const nextRow=lab=>R(lab||'Next ▶',{cls:'go',a:nextStep});

const V={};
V.title=()=>{
  const n=S.roster.length,has=!!S.a.prof;
  return{rows:[
    ST(`<canvas class="lantern pix" id="lantern" width="96" height="96" style="border:0;background:transparent"></canvas><div class="logo">BLACK LANTERN<small>PERSONNEL INTAKE · FORM 7-B</small></div><div class="static small" style="text-align:center;padding-top:0">Build an agent. Lose them later.</div>`),
    ...(store.get('bl.game',null)?[R('Continue Chapter One',{cls:'go',a:()=>{if(window.BLG)BLG.resume()}})]:[]),
    ...(has?[R('Continue draft',{val:esc(profOf(S.a).name),a:()=>{goto('dossier')}})]:[]),
    R('New agent',{a:()=>{S.a=newAgent();goto('profession')}}),
    R('Quick roll',{val:'random',a:()=>{S.a=randomAgent();goto('dossier');toast('A NEW FILE LANDS ON YOUR DESK')}}),
    R('Roster',{val:n+' on file',a:()=>{goto('roster')}}),
    ST(`<div class="small" style="text-align:center;margin-top:6px">Keyboard: arrows · Z = A · X = B · Q/W = L/R · Enter = Start</div>`)
  ],foot:'A: SELECT'};
};
V.roster=()=>{
  const rows=S.roster.length?S.roster.map((a,i)=>R(esc(a.name||'Unnamed'),{val:esc(profOf(a)?.name||''),a:()=>{S.a=JSON.parse(JSON.stringify(a));goto('dossier')}})):[ST('No agents on file yet. Save one from the dossier screen.')];
  if(S.roster.length)rows.push(R(S.clearArm?'Press A again to shred all':'Shred roster',{cls:'warn',a:()=>{if(S.clearArm){S.roster=[];store.set('bl.roster',[]);S.clearArm=false;toast('ROSTER SHREDDED')}else{S.clearArm=true}}}));
  return{rows,foot:'A: OPEN FILE · B: BACK'};
};
V.profession=()=>{
  const a=S.a,rows=[R('?? Random draw',{val:'1 in 4 odd',a:()=>{const p=randomProf();setProf(a,p);S.sel.profession=PROFS.indexOf(p)+1+(p.odd?1:0);toast('DRAWN: '+p.name.toUpperCase()+(p.odd?' (ODDBALL)':''))}})];
  PROFS.forEach((p,i)=>{if(i===8)rows.push(ST('<h3>ODDBALLS</h3>'));rows.push(R(esc(p.name)+(a.prof===p.id?'<span class="tag mine">YOU</span>':''),{p,a:()=>{setProf(a,p);goto('loadout')}}))});
  const hov=rows[S.sel.profession||0]?.p;
  const pane=hov?`<div><span class="hi">${esc(hov.role.toUpperCase())}</span> · ${hov.bonds} bonds</div><div class="small" style="margin:3px 0">${esc(hov.blurb)}</div>${hov.abil.map(x=>`<div><span class="grn">${esc(x[0])}</span> <span class="small">${esc(x[1])}</span></div>`).join('')}<div class="small" style="margin-top:3px">${Object.entries(hov.skills).sort((x,y)=>y[1]-x[1]).slice(0,4).map(([k,v])=>`${k} ${v}%`).join(' · ')}</div>`
    :`<div class="small">Draws any profession. About one draw in four is an oddball.</div>`;
  return{rows,pane,foot:'A: CHOOSE · B: BACK · R: NEXT'};
};
V.loadout=()=>{
  const a=S.a,L=SPECS[a.prof]||[];
  const rows=L.map(s=>R(esc(s.name)+(a.spec===s.id?'<span class="tag mine">YOU</span>':''),{s,a:()=>{a.spec=s.id;goto('stats')}}));
  const hov=rows[S.sel.loadout||0]?.s||L[0];
  const w=hov&&hov.weapon?WEAP[hov.weapon]:null;
  const pane=hov?`<div class="small" style="margin-bottom:3px">${esc(hov.blurb)}</div><div class="hi" style="font:7px/1.8 var(--px)">STARTING KIT</div>`+Object.entries(hov.items).map(([k,n])=>`<div><span class="grn">${esc(ITEMDEF[k].name)}${n>1?' x'+n:''}</span> <span class="small">${esc(ITEMDEF[k].desc)}</span></div>`).join('')+
    `<div class="hi" style="font:7px/1.8 var(--px);margin-top:3px">WEAPON</div><div class="small" style="color:var(--scr-fg)">${w?`${esc(w.name)} · ${w.skill} · ${w.dmg[0]}d${w.dmg[1]} dmg`:'None issued. You fight with whatever you\'re best at.'}</div><div class="small" style="margin-top:3px">Kit goes in the squad's shared pack. Squadmates each add one item.</div>`:'';
  return{rows,pane,foot:'A: CHOOSE · B: BACK · R: NEXT'};
};
V.stats=()=>{
  const a=S.a,buy=a.method==='buy',d=derived(a);
  const tog=()=>{a.method=buy?'roll':'buy';a.stats=a.method==='buy'?Object.fromEntries(STATS.map(k=>[k,12])):rollStats();S.swap=null};
  const rows=[R('Method',{val:buy?'POINT BUY':'ROLL 4d6',left:tog,right:tog,a:tog})];
  STATS.forEach(k=>{
    const v=a.stats[k];
    const adj=dd=>()=>{if(!buy)return;const nv=v+dd;if(nv<3||nv>18||(dd>0&&buyLeft(a)<=0))return;a.stats[k]=nv};
    rows.push(R(`${k} <span class="small">${STATNAME[k]}</span>`,{k,cls:S.swap===k?'pickd':'',val:`<span${v>=16?' class="grn"':v<=5?' class="red"':''}>${String(v).padStart(2,' ')}</span>`,left:buy?adj(-1):null,right:buy?adj(1):null,
      a:buy?adj(1):()=>{if(!S.swap){S.swap=k}else if(S.swap===k){S.swap=null}else{[a.stats[S.swap],a.stats[k]]=[a.stats[k],a.stats[S.swap]];S.swap=null}}}));
  });
  if(!buy)rows.push(R('Reroll all',{a:()=>{a.stats=rollStats();S.swap=null}}));
  rows.push(nextRow());
  const feats=STATS.map(k=>feature(k,a.stats[k])&&`<div class="small">${k}: ${esc(feature(k,a.stats[k]))}</div>`).filter(Boolean).join('');
  const pane=`<div class="kv" style="grid-template-columns:repeat(4,auto 1fr)"><span>HP</span><span class="hi">${d.HP}</span><span>WP</span><span class="hi">${d.WP}</span><span>SAN</span><span class="hi">${d.SAN}</span><span>BP</span><span class="hi">${d.BP}</span></div>`+
    (buy?`<div style="margin-top:3px">Points left: <span class="${buyLeft(a)===0?'grn':'red'}">${buyLeft(a)}</span> <span class="small">(3–18 each)</span></div>`:`<div class="small" style="margin-top:3px">${S.swap?'Now pick a stat to swap with '+S.swap+'.':'A on two stats to swap them.'}</div>`)+
    (feats||'<div class="small">Scores of 16+ or 5 or less earn a distinguishing feature.</div>')+
    `<div class="small" style="margin-top:3px">SAN = POW×5. Hit Breaking Point and something in you cracks for good.</div>`;
  return{rows,pane,foot:buy?'◀▶: ADJUST · L/R: STEP':'A: SWAP · L/R: STEP'};
};
V.skills=()=>{
  const a=S.a,p=profOf(a),left=8-picksUsed(a);
  const keys=Object.keys(SKILLS).sort((x,y)=>(p.skills[y]?1:0)-(p.skills[x]?1:0)||skillVal(a,y)-skillVal(a,x)||x.localeCompare(y));
  const rows=keys.map(k=>{
    const v=skillVal(a,k),n=a.picks[k]||0;
    const add=()=>{if(picksUsed(a)>=8)return toast('NO BONUS PICKS LEFT');if(v+20>80)return toast('BONUS CAPS AT 80%');a.picks[k]=n+1};
    const rem=()=>{if(!n)return;a.picks[k]=n-1;if(!a.picks[k])delete a.picks[k]};
    return R(`${p.skills[k]?'<span class="hi">*</span>':''}${esc(k)}`,{cls:v===SKILLS[k]&&!p.skills[k]?'dim':'',val:`<span class="pip">${'+'.repeat(n)}</span>${String(v).padStart(2,' ')}%`,left:rem,right:add,a:add});
  });
  rows.push(nextRow());
  const pane=`<div>Bonus picks: <span class="${left?'hi':'grn'}">${left}</span>/8 <span class="small">· each adds +20%</span></div><div class="small">* trained by your profession. ◀ removes a pick.</div>`;
  return{rows,pane,foot:'◀▶: PICK · L/R: STEP'};
};
V.bonds=()=>{
  const a=S.a,cha=a.stats.CHA;
  const rows=a.bonds.map((b,i)=>{const cyc=d=>()=>{b.rel=RELS[(RELS.indexOf(b.rel)+d+RELS.length)%RELS.length]};
    return R('',{input:{bind:'bond'+i,value:b.name,ph:'Name'},val:`<span class="small hi">${esc(b.rel)}</span>`,left:cyc(-1),right:cyc(1)})});
  rows.push(R('Randomize names',{a:()=>{a.bonds.forEach(b=>b.name=pick(FIRST))}}));
  rows.push(nextRow());
  const pane=`<div>Each bond starts at <span class="hi">${cha}</span> <span class="small">(your CHA)</span></div><div class="small">The people who keep you human. Lean on them to recover SAN between missions, and the bond wears thin.</div>`;
  return{rows,pane,foot:'A: TYPE NAME · ◀▶: RELATION'};
};
V.look=()=>{
  const a=S.a,L=a.look;
  const cyc=(key,n,lo=0)=>[()=>{L[key]=(L[key]-lo-1+n)%n+lo},()=>{L[key]=(L[key]-lo+1)%n+lo}];
  const r=(lab,key,n,names,lo=0)=>{const [l,rr]=cyc(key,n,lo);return R(lab,{val:esc(names(L[key])),left:l,right:rr,a:rr})};
  const sanAdj=d=>()=>{const before=S.san;S.san=Math.max(0,Math.min(99,S.san+d));};
  return{side:true,rows:[
    r('Skin','skin',6,v=>'Tone '+(v+1)),
    r('Hair','hair',7,v=>HAIRS[v]),
    r('Hair color','hairC',7,v=>HAIRCN[v]),
    r('Eyes','eyes',3,v=>EYES[v]),
    r('Extra','acc',7,v=>ACC[v]),
    r('Outfit','outfitC',8,v=>v<0?'Issue':OUTCN[v],-1),
    R('SAN preview',{val:`<span class="${S.san<30?'red':'hi'}">${S.san}</span>`,left:sanAdj(-10),right:sanAdj(10),a:sanAdj(-10)}),
    R('Randomize look',{a:()=>{a.look=randomLook()}}),
    nextRow()],
    pane:`<canvas class="pix" id="pbig"></canvas><div class="small" style="text-align:center">${esc(profOf(a).name)}</div><div class="small" style="text-align:center;font-size:15px">The world's colors shift as SAN drops.</div>`,
    foot:'◀▶: CHANGE · L/R: STEP'};
};
V.identity=()=>{
  const a=S.a;
  const ageAdj=d=>()=>{a.age=Math.max(21,Math.min(75,a.age+d))};
  const rows=[
    R('',{input:{bind:'name',value:a.name,ph:'Full name'},val:''}),
    R('',{input:{bind:'code',value:a.code,ph:'Codename'},val:'<b data-act="right">↻</b>',right:()=>{a.code=genCode()}}),
    R('Age',{val:a.age,left:ageAdj(-1),right:ageAdj(1),a:ageAdj(1)}),
    ST(`<h3>MOTIVATIONS · ${a.motives.length}/5</h3>`),
    R('',{input:{bind:'newMot',value:S.newMot||'',ph:'Write your own...',max:40},val:'<b data-act="right">+</b>',right:addMotive})];
  a.motives.filter(m=>!MOTIVES.includes(m)).forEach(m=>rows.push(R(esc(m),{cls:'go wrap',val:'<span class="grn">[x]</span>',a:()=>{a.motives=a.motives.filter(x=>x!==m)}})));
  rows.push(ST('<div class="small">Or pick from these:</div>'));
  MOTIVES.forEach(m=>{const on=a.motives.includes(m);rows.push(R(esc(m),{val:on?'<span class="grn">[x]</span>':'<span class="small">[ ]</span>',a:()=>{if(on)a.motives=a.motives.filter(x=>x!==m);else if(a.motives.length>=5)return toast('FIVE IS ENOUGH TO LOSE');else a.motives.push(m)}}))});
  rows.push(nextRow('Review dossier ▶'));
  return{rows,foot:'A: TYPE / TOGGLE · +: ADD YOUR OWN'};
};
function addMotive(){const a=S.a,v=(S.newMot||'').trim();
  if(!v)return toast('TYPE A MOTIVATION FIRST');if(a.motives.length>=5)return toast('FIVE IS ENOUGH TO LOSE');if(a.motives.includes(v))return;
  a.motives.push(v);S.newMot=''}
function dossierCard(a){
  const p=profOf(a),d=derived(a);
  const top=Object.keys(SKILLS).map(k=>[k,skillVal(a,k)]).sort((x,y)=>y[1]-x[1]).slice(0,6);
  const feats=STATS.map(k=>feature(k,a.stats[k])).filter(Boolean);
  return`<div class="card"><div class="top"><img class="pix" src="${portraitURL(a,4)}" width="96" height="96" alt="Agent portrait"><div class="who"><div class="n">${esc(a.name||'Unnamed Agent')}</div><div class="hi">AGENT ${esc(a.code||((a.name||'').split(' ').pop()||'?').toUpperCase())}</div><div>${esc(p.name)}, ${a.age}</div><div class="small">${esc(p.role)}${specOf(a)?' · '+esc(specOf(a).name):''}</div>${a.cur?`<div class="red">SAN now ${a.cur.san}/${d.SAN}${a.cur.dis?' · '+esc(a.cur.dis):''}</div>`:''}${p.odd?'<span class="stamp">ODDBALL</span>':'<span class="stamp">CLEARED</span>'}</div></div>
  <div class="sgrid">${STATS.map(k=>`<span><span class="small">${k}</span> ${a.stats[k]}</span>`).join('')}</div>
  <div class="sgrid"><span><span class="small">HP</span> ${d.HP}</span><span><span class="small">WP</span> ${d.WP}</span><span><span class="small">SAN</span> ${d.SAN}/<span class="small">BP</span>${d.BP}</span></div>
  <h3 style="font:8px var(--px);color:var(--scr-hi);margin:7px 0 2px">ABILITIES</h3>${p.abil.map(x=>`<div><span class="grn">${esc(x[0])}</span> <span class="small">${esc(x[1])}</span></div>`).join('')}
  ${specOf(a)?`<h3 style="font:8px var(--px);color:var(--scr-hi);margin:7px 0 2px">KIT</h3><div class="small" style="color:var(--scr-fg)">${esc(kitText(specOf(a)))}${specOf(a).weapon?' · '+esc(WEAP[specOf(a).weapon].name):''}</div>`:''}
  <h3 style="font:8px var(--px);color:var(--scr-hi);margin:7px 0 2px">BEST SKILLS</h3><div class="small" style="color:var(--scr-fg)">${top.map(([k,v])=>`${esc(k)} ${v}%`).join(' · ')}</div>
  <h3 style="font:8px var(--px);color:var(--scr-hi);margin:7px 0 2px">BONDS · ${a.stats.CHA} each</h3><div class="small" style="color:var(--scr-fg)">${a.bonds.map(b=>`${esc(b.name||'?')} (${esc(b.rel.toLowerCase())})`).join(' · ')}</div>
  ${a.motives.length?`<h3 style="font:8px var(--px);color:var(--scr-hi);margin:7px 0 2px">MOTIVATIONS</h3><div class="small" style="color:var(--scr-fg)">${a.motives.map(esc).join(' · ')}</div>`:''}
  ${feats.length?`<h3 style="font:8px var(--px);color:var(--scr-hi);margin:7px 0 2px">NOTED</h3><div class="small" style="color:var(--scr-fg)">${feats.map(esc).join(' · ')}</div>`:''}</div>`;
}
V.dossier=()=>{
  const a=S.a;
  const rows=[ST(dossierCard(a)),
    R('Begin Chapter One ▶',{cls:'go',val:'Still Harvest',a:()=>{const sq=S.squad||[randomAgent(),randomAgent(),randomAgent()];S.squad=null;window.BLG&&BLG.start(S.a,sq)}}),
    R(S.saved?'Saved ✓':'Save to roster',{cls:'go',a:()=>{const i=S.roster.findIndex(x=>x.id===a.id);a.id=a.id||Date.now();const copy=JSON.parse(JSON.stringify(a));if(i>=0)S.roster[i]=copy;else S.roster.unshift(copy);store.set('bl.roster',S.roster);S.saved=true;toast('FILED UNDER '+(a.code||'?'))}}),
    R('Roll a squad',{val:'3 agents',a:()=>{S.squad=[randomAgent(),randomAgent(),randomAgent()]}}),
    R('Copy agent code',{a:()=>copyCode(a)}),
    R('Edit agent',{a:()=>{goto('profession');S.sel.profession=PROFS.indexOf(profOf(a))+1+(profOf(a).odd?1:0)}}),
    R('New agent',{a:()=>{S.a=newAgent();S.saved=false;goto('profession')}})];
  if(S.squad){rows.push(ST(`<h3>YOUR SQUAD THIS MISSION</h3><div class="small">Randomized every mission. Oddballs turn up about 1 in 4.</div>`));
    rows.push(ST(`<div class="squad">${S.squad.map(m=>`<div class="m"><img class="pix" src="${portraitURL(m,2)}" width="48" height="48" alt=""><div>${esc(m.name.split(' ')[0])}</div><div class="p">${esc(profOf(m).name)}</div>${profOf(m).odd?'<div class="red" style="font-size:14px">ODDBALL</div>':''}</div>`).join('')}</div>`));
    rows.push(R('Reroll squad',{a:()=>{S.squad=[randomAgent(),randomAgent(),randomAgent()]}}));}
  return{rows,foot:'A: SELECT · L: BACK TO IDENTITY'};
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
function render(scroll=true){
  if(S.step!=='dossier')S.saved=false;
  cur=V[S.step]();
  const s=fixSel(cur.rows);
  $('#hTitle').textContent=STEPNAME[S.step];
  const si=STEPS.indexOf(S.step);$('#hStep').textContent=si>=0?`${si+1}/${STEPS.length}`:'';
  list.innerHTML=cur.rows.map((r,i)=>r.static?`<div class="static">${r.static}</div>`:
    `<div class="row ${i===s?'on':''} ${r.cls||''}" data-i="${i}"><span class="cur">▶</span>${r.input?`<input data-bind="${r.input.bind}" value="${esc(r.input.value)}" placeholder="${esc(r.input.ph)}" maxlength="${r.input.max||28}" autocomplete="off" spellcheck="false">`:`<span class="lab">${r.label}</span>`}<span class="val">${r.left?'<b data-act="left">◀</b>':''}${r.val??''}${r.right&&!String(r.val??'').includes('data-act')?'<b data-act="right">▶</b>':''}</span></div>`).join('');
  body.classList.toggle('side',!!cur.side);
  pane.innerHTML=cur.pane||'';
  if(S.step==='look')drawBig(false);
  if(S.step==='title')drawLantern();
  // sanity palette
  const f=1-S.san/99;
  screen.style.filter=f>0?`hue-rotate(${(-f*70).toFixed(0)}deg) saturate(${(1+f*1.4).toFixed(2)}) contrast(${(1+f*.25).toFixed(2)})`:'';
  $('#vig').style.opacity=(f*.9).toFixed(2);
  screen.classList.toggle('glitch',S.san<30);
  const ft=$('#ftr');
  if(S.san<25&&Math.random()<.3){ft.textContent=pick(CREEP);ft.classList.add('creep')}else{ft.textContent=cur.foot||'';ft.classList.remove('creep')}
  if(scroll){const el=list.querySelector('.row.on');if(el)el.scrollIntoView({block:'nearest'});if(s===selectable(cur.rows)[0])list.scrollTop=0}
  store.set('bl.draft',S.a);
}
function drawBig(blink){const c=$('#pbig');if(c){drawPortrait(c,S.a,5,blink);c.style.width='120px';c.style.height='120px'}}
function drawLantern(){const c=$('#lantern');if(!c)return;const x=c.getContext('2d');x.imageSmoothingEnabled=false;x.setTransform(6,0,0,6,0,0);x.clearRect(0,0,16,16);const p=(a,b,w,h,col)=>{x.fillStyle=col;x.fillRect(a,b,w,h)};
  const fl=Math.random()<.5;p(7,0,2,2,'#5d5888');p(5,2,6,1,'#2a2440');p(4,3,8,1,'#3a3460');p(4,4,1,9,'#2a2440');p(11,4,1,9,'#2a2440');p(5,4,6,9,fl?'#ffd166':'#ffbf3f');p(6,6,4,5,fl?'#fff1c2':'#ffe08a');p(7,7,2,3,'#fffaf0');p(4,13,8,1,'#3a3460');p(5,14,6,1,'#2a2440');p(7,4,2,9,'rgba(20,12,30,.18)')}
let toastT;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),1500)}

// ---------- INPUT ----------
function rowAt(i){return cur.rows[i]}
function act(kind){
  if(window.BLG&&BLG.active){BLG.input(kind);return}
  const r=rowAt(S.sel[S.step]);
  if(kind==='up'||kind==='down'){const ok=selectable(cur.rows),k=ok.indexOf(S.sel[S.step]);const nk=kind==='up'?Math.max(0,k-1):Math.min(ok.length-1,k+1);if(nk!==k){S.sel[S.step]=ok[nk]}render();return}
  if(kind==='left'||kind==='right'){if(r&&r[kind])r[kind]();render();return}
  if(kind==='a'){if(r&&r.input){focusInput(S.sel[S.step]);return}if(r&&r.a)r.a();render();return}
  if(kind==='b'){if(S.swap){S.swap=null}else prevStep();render();return}
  if(kind==='l'){prevStep();render();return}
  if(kind==='r'){nextStep();render();return}
  if(kind==='start'){if(S.a.prof&&S.step!=='dossier'){goto('dossier')}else if(S.step==='dossier'){goto('title')}else{toast('PICK A PROFESSION FIRST')}render();return}
}
function focusInput(i){const el=list.querySelector(`.row[data-i="${i}"] input`);if(el){el.focus();const n=el.value.length;try{el.setSelectionRange(n,n)}catch(e){}}}
// D-pad with hold-repeat
document.querySelectorAll('[data-pad]').forEach(b=>{let t1,t2;const stop=()=>{clearTimeout(t1);clearInterval(t2);b.classList.remove('down');if(window.BLG&&BLG.active)BLG.hold(b.dataset.pad,false)};
  b.addEventListener('pointerdown',e=>{e.preventDefault();if(document.activeElement&&document.activeElement.tagName==='INPUT')document.activeElement.blur();b.classList.add('down');if(window.BLG&&BLG.active)BLG.hold(b.dataset.pad,true);act(b.dataset.pad);t1=setTimeout(()=>{t2=setInterval(()=>act(b.dataset.pad),85)},320)});
  ['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,stop));b.addEventListener('contextmenu',e=>e.preventDefault())});
const btn=(id,k)=>$(id).addEventListener('click',()=>act(k));
btn('#bA','a');btn('#bB','b');btn('#bL','l');btn('#bR','r');btn('#bStart','start');btn('#bSel','select');
// taps on rows
list.addEventListener('click',e=>{
  const row=e.target.closest('.row');if(!row)return;const i=+row.dataset.i;const r=rowAt(i);
  const actEl=e.target.closest('[data-act]');
  if(e.target.tagName==='INPUT'){if(S.sel[S.step]!==i){S.sel[S.step]=i;list.querySelectorAll('.row.on').forEach(x=>x.classList.remove('on'));row.classList.add('on')}return}
  S.sel[S.step]=i;
  if(actEl){r[actEl.dataset.act]&&r[actEl.dataset.act]();render(false);return}
  if(r.input){render(false);focusInput(i);return}
  if(r.a)r.a();
  render(false);
});
list.addEventListener('input',e=>{const t=e.target,b=t.dataset.bind;if(!b)return;
  if(b==='name')S.a.name=t.value;else if(b==='code')S.a.code=t.value.toUpperCase();else if(b==='newMot'){S.newMot=t.value;return}else if(b.startsWith('bond'))S.a.bonds[+b.slice(4)].name=t.value;store.set('bl.draft',S.a)});
list.addEventListener('focusout',e=>{if(e.target.tagName==='INPUT')setTimeout(()=>{if(!list.contains(document.activeElement)||document.activeElement.tagName!=='INPUT')render(false)},0)});
list.addEventListener('keydown',e=>{if(e.target.dataset&&e.target.dataset.bind==='newMot'&&e.key==='Enter'){e.preventDefault();addMotive();render(false);const el=list.querySelector('input[data-bind="newMot"]');if(el)el.focus();return}if(e.target.tagName==='INPUT'&&(e.key==='Enter'||e.key==='Escape')){e.preventDefault();e.target.blur()}});
const KEYS={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',z:'a',Z:'a',' ':'a',x:'b',X:'b',Backspace:'b',q:'l',Q:'l',w:'r',W:'r',Enter:'start',Shift:'select'};
document.addEventListener('keydown',e=>{if(document.activeElement&&document.activeElement.tagName==='INPUT')return;const k=KEYS[e.key];if(!k)return;e.preventDefault();if(window.BLG&&BLG.active&&['up','down','left','right'].includes(k)){if(e.repeat)return;BLG.hold(k,true)}act(k)});
document.addEventListener('keyup',e=>{const k=KEYS[e.key];if(k&&window.BLG&&['up','down','left','right'].includes(k))BLG.hold(k,false)});
window.addEventListener('blur',()=>{if(window.BLG)['up','down','left','right'].forEach(d=>BLG.hold(d,false))});

// ambient: blink + lantern flicker
setInterval(()=>{if(S.step==='look'){drawBig(true);setTimeout(()=>drawBig(false),140)}},3200);
setInterval(()=>{if(S.step==='title')drawLantern()},180);

window.BL={S,PROFS,ITEMDEF,WEAP,specOf,profOf,derived,skillVal,randomAgent,drawPortrait,store,render,goto,toast,esc,pick,rnd,SKILLS,HAIRC,SKIN,OUTC};
render();
})();
