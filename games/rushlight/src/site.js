// Rushlight · site.js
// Slice part D1 (spec 006): contract sites on the ground and what every job uses.
//   Sites from room chunks (content/sites.js), joined left to right; the site strip with its NEXT line; hotspots with the
//   A prompt (who rolls, their odds, the best other merc on Select, which swaps the lead first; options the lead lacks
//   greyed with the skill's name); placed fights with their plates; caches; Loud; light; leaving (a started job left
//   is a failed job); statuses tick on each chunk change.
//   The pay screen: the fee (full, half for a hunt with no trophy, giver +25% and favor), XP, SAN lost, trophies and loot,
//   level-ups with their pick screen (or later, from the Party menu); then the contract's flags.
//   Trophies and parts in the pack, sold to the church and the markets; the bestiary in rl.ledger.
// Job scripts live in content/jobs.js (JOB_SCRIPTS). Loaded after town.js as a plain script.
const XP_AT=[0,100,300,600,1000,1500,2100,2800,3600,4500];
const JOB_XP={'quick job':100,'short case':150,'road job':150,hunt:200};
function jobXP(id){return JOB_XP[JOBS[id].shape]||100}

// ================= ENTERING A SITE =================
// A point with a taken contract opens its site; others keep their cards until their job is built (openPlace hook)
const _openPlaceTown=openPlace;
openPlace=async function(k){
 if(await _openPlaceTown(k))return true;
 const r=G.run,c=(r.contracts||[]).find(c=>!c.done&&!c.resolved&&JOBS[c.id].site===k&&JOB_SCRIPTS[c.id]&&!JOBS[c.id].road);
 if(c){await startSite(c.id);return true}
 if(typeof openDen==='function'&&k==='pit'&&await openDen())return true;
 return false};
async function startSite(id){
 const r=G.run,J=JOBS[id],S=SITES[J.site]||SITES[JOB_SCRIPTS[id].site],JS=JOB_SCRIPTS[id];
 if(!r.job||r.job.id!==id){const W=StudioSeed.load(r.streams.world);
  const chunks=(JS.chunks||S.chunks).map(c=>Array.isArray(c)?c[Math.floor(W.next()*c.length)]:c);
  const caches=Math.floor(W.next()*3);r.streams.world=W.save();
  r.job={id,site:J.site,chunks,chunk:0,used:{},fights:{},flags:{},caches,started:false,next:JS.next0?RLT(JS.next0):`Do the job at ${P_[J.site].name}.`,horrors:{},sanLost:{},tales:{},prep:[]};
  if(JS.init)JS.init(r.job)}
 const c=r.contracts.find(x=>x.id===id);if(c)c.next=r.job.next;
 G.site={name:(S.name||P_[J.site].name).toUpperCase(),kind:J.kind,shape:J.shape,lit:false};
 enterChunk(r.job.chunk,'left');
 if(JS.arrive&&!r.job.flags.arrived){r.job.flags.arrived=1;await JS.arrive(r.job)}
 saveRun()}
function siteMapName(i){return 'site_'+G.run.job.id+'_'+i}
function enterChunk(i,side){const r=G.run,job=r.job,key=job.chunks[i],C=CHUNKS[key];job.chunk=i;
 const name=siteMapName(i);MAPS[name]=()=>chunkMap(job,i,key);G.mode='world';gEl.classList.remove('region');
 const ent=C.rows.findIndex(row=>row[side==='left'?0:row.length-1]===','||row[side==='left'?0:row.length-1]==='.');
 const y=ent<0?5:ent;goMap(name,side==='left'?0:C.rows[0].length-1,y,side==='left'?'right':'left');
 // statuses tick on each chunk change (Carried rules, Statuses)
 tickStatuses();applySan()}
function chunkMap(job,i,key){const C=CHUNKS[key],JS=JOB_SCRIPTS[job.id],h=C.rows.length,w=C.rows[0].length,g=C.rows.map(r=>r.split(''));
 const S=SITES[job.site]||{},M={name:G.site?G.site.name:'',w,h,g,npcs:[],O:{},vv:{},site:true,tod:job.tod||S.tod||'dusk',hot:[],fights:[],edge:S.edge||'T'};
 const spot=k=>C.spots[k];
 // hotspots and fights from the job's script, placed on the chunk's marked spots
 (JS.hotspots?JS.hotspots(key,job):[]).forEach(hs=>{const p=hs.at||spot(hs.spot);if(!p)return;const h_=Object.assign({},hs,{x:p[0],y:p[1]});M.hot.push(h_);
  [[0,0],[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{const k=(p[0]+dx)+','+(p[1]+dy);if(!M.O[k]||dx===0&&dy===0)M.O[k]=()=>hotspot(h_)})});
 if(spot('c')&&i===job.chunks.length-1-(job.chunks.length>2?1:0)&&job.caches>0){const p=spot('c');const h_={id:'cache',x:p[0],y:p[1],line:SITES[job.site].cache||'ST-CACHE-1',opts:[{skill:'Search',min:0,verb:'SEARCH',run:openCache}]};M.hot.push(h_);M.O[p.join(',')]=()=>hotspot(h_)}
 (JS.fights?JS.fights(key,job):[]).forEach(f=>{if(job.fights[f.id])return;const p=f.at||spot(f.spot);if(!p)return;M.fights.push(Object.assign({},f,{x:p[0],y:p[1]}))});
 (JS.npcs?JS.npcs(key,job):[]).forEach(n=>M.npcs.push(n));
 M.onStep=async()=>{
  // a placed fight opens when the lead walks up to it
  for(const f of M.fights){if(job.fights[f.id]||f.when&&!f.when(job))continue;if(Math.abs(G.x-f.x)+Math.abs(G.y-f.y)<=(f.r||2)){await siteFight(f);return}}
  if(G.x>=w-1&&i<job.chunks.length-1){enterChunk(i+1,'left');return}
  if(G.x<=0){if(i>0){enterChunk(i-1,'right');return}await leaveSite()}
  if(JS.onStep)await JS.onStep(key,job)};
 return M}
// the site's own drawing: tiles, then hotspot diamonds and fight plates (drawn by engine.js's drawWorld)
function drawSiteOver(M,camx,camy){
 const job=G.run.job;if(!job)return;
 hotDiamonds(M,camx,camy,job);
 M.fights.forEach(f=>{if(job.fights[f.id]||f.when&&!f.when(job))return;const x=f.x*16+8-camx,y=f.y*16-camy;
  (f.show||[]).forEach((sp,k)=>{const s=RLSP.map(sp.sp||'rat',sp.look);cx.drawImage(s,x-14+k*16,y-10)});
  const t=f.plate,w=pW(t,12)+8;pR(x-w/2,y-24,w,12,'rgba(28,24,20,.9)');pR(x-w/2,y-24,w,1,SA.rust);pT(t,x-w/2+4,y-25,SA.bone,12)});
}
// The site strip: heads, the site's whole name and the day; its kind and shape; then the NEXT line, wrapped rather than cut
// (bug batch, Nov 24: names and NEXT ended in …). It grows a line when it must; 8B replaces it with the HUD cards.
// the site's HUD (spec 008, 8B; mockups 40 and 41): the lead card and a place card (the site's whole name, its kind, the day),
// then the NEXT line under the cards: one line, or a second when it won't fit, never cut
function drawSiteStrip(){if(!G.site)return;const r=G.run;const h=Math.max(leadCard(),placeCard([[G.site.name,'#e6dcc4',13],[G.site.kind,'#c8bea8',12],[`DAY ${r.day}`,'#e6dcc4',12]]));
 const nx=pWrap(r.job?r.job.next:'',VW-36,12,3);pR(0,h,VW,nx.length*11+3,'rgba(28,24,20,.88)');pT('NEXT',4,h,'#d9b45a',12);nx.forEach((l,k)=>pT(l,32,h+k*11,'#e6dcc4',12))}
function tickStatuses(){for(const m of party.filter(x=>!x.dead)){if(m.st.includes('Bleeding')){m.hp=Math.max(1,m.hp-1);if(m.sp==='badger')m.st=m.st.filter(s=>s!=='Bleeding')}
 if(m.st.includes('Poisoned')){m.pt=(m.pt|0)+1;if(m.pt%2===0)m.hp=Math.max(1,m.hp-1)}
 ['Drunk','High'].forEach(s=>{if(m.st.includes(s)){m[s+'T']=(m[s+'T']|0)+1;if(m[s+'T']>=4){m.st=m.st.filter(x=>x!==s&&x!=='Fire-root');m[s+'T']=0;if(s==='High'&&m.st.includes('Fire-root'))m.wp=Math.max(0,m.wp-StudioRoll.die(4))}}})}}

// ================= HOTSPOTS =================
// The A prompt: the action, what's there (its ST- line), who rolls and their odds; Select swaps to the best other merc
// before rolling; options the lead lacks show greyed with the skill's name. Tried once; a fail can be retried after a rest.
async function hotspot(h){
 const job=G.run.job;if(h.when&&!h.when(job))return;
 if(job.used[h.id]==='done'){if(h.after)await say('',RLT(h.after));else await say('','Nothing more here.');return}
 if(job.used[h.id]&&job.used[h.id].fail===G.run.rests){await say('','You tried that. Rest first, then try again.');return}
 const L=lead(),rows=[],acts=[];
 if(h.line)await say('',RLT(h.line));
 for(const o of h.opts){const sk=o.skill,can=!o.min||(L.sk[sk]||0)>=o.min,odds=o.roll===false?'':` · ${L.name.toUpperCase()} ${clamp(skillOf(L,sk)+(o.mod|0),1,99)}%`;
  if(o.dis&&o.dis(job))continue;
  // shown: the choice on the left; the roller's small face and odds on the right, "no roll", or what a locked choice needs (spec 008, 8C)
  const verb=`${o.verb||sk}${o.note?' · '+o.note:''}${o.crime?'  '+o.crime:''}`,pct=clamp(skillOf(L,sk)+(o.mod|0),1,99);
  rows.push({label:`${o.verb||sk.toUpperCase()}${o.note?' · '+o.note:''}${can?odds:` (${sk} ${o.min}%)`}${o.crime?'  '+o.crime:''}`,dis:!can,name:verb,right:o.roll===false?'no roll':can?`${L.name.toUpperCase()} ${pct}%`:`needs ${sk} ${o.min}%`,rface:can&&o.roll!==false?{sp:L.sp,look:L.look}:null});acts.push({o,m:L});
  const other=party.filter(p=>p!==L&&!p.dead&&!p.ko&&(p.sk[sk]||0)>=(o.min||0)).sort((a,b)=>skillOf(b,sk)-skillOf(a,sk))[0];
  if(other&&o.roll!==false&&(skillOf(other,sk)>skillOf(L,sk)||!can)){const op=clamp(skillOf(other,sk)+(o.mod|0),1,99);rows.push({label:`  SELECT · ${other.name.toUpperCase()} ${op}%`,name:`SELECT: ${other.name} tries`,right:`${other.name.toUpperCase()} ${op}%`,rface:{sp:other.sp,look:other.look},cls:'sel'});acts.push({o,m:other,swap:true})}}
 rows.push({label:'Leave it'});
 const c=await choose(rows,{cancel:true,title:h.title||'',onSelect:()=>{const i=acts.findIndex(a=>a.swap);return i}});
 if(c<0||c>=acts.length)return;
 const a=acts[c];if(a.swap){G.lead=party.indexOf(a.m);applySan();banner('LEADING: '+a.m.name.toUpperCase())}
 job.started=true;
 if(a.o.loud){G.site.loud=1;job.flags.loud=1}
 let res={ok:true};if(a.o.roll!==false){res=StudioRoll.pct(skillOf(a.m,a.o.skill)+(a.o.mod|0));await say('',StudioRoll.line(a.o.verb||a.o.skill.toUpperCase(),res,BW.words),{auto:900})}
 if(!res.ok&&!a.o.alwaysRun){job.used[h.id]={fail:G.run.rests|0};await say('',a.o.failLine?RLT(a.o.failLine):'It doesn\'t work this time.');saveRun();return}
 job.used[h.id]=h.repeat?undefined:'done';
 await a.o.run(a.m,res,job,h);saveRun()}
async function openCache(m,res,job){const W=StudioSeed.load(G.run.streams.world),pool=JOB_SCRIPTS[job.id].cache||['bandage','willow','rope','snare','salt','torch','firepot','tonic'];
 const n=2+Math.floor(W.next()*2),got=[];for(let i=0;i<n;i++){const id=pool[Math.floor(W.next()*pool.length)];toPack(id,1);got.push(RLS.ITEMS[id].name)}G.run.streams.world=W.save();
 job.caches--;await say('',`Inside: ${got.join(', ')}. Into the pack.`)}
// a placed fight on the site
async function siteFight(f,resume){const job=G.run.job;job.started=true;
 if(f.pre&&!resume&&await f.pre(job))return;
 if(job.fights[f.id])return;
 const foes=resume?null:f.foes(job);if(f.intro&&!resume)await say('',RLT(f.intro));
 const o=Object.assign({bg:job.tod||SITES[job.site].tod,setFight:true,key:f.id},f.o?f.o(job):{});if(resume)o.resume=resume;
 const res=await battle(foes,o);
 if(res==='lose'){await wipe();return}
 job.fights[f.id]=res;if(f.after)await f.after(job,res,G.lastStats);
 if(G.run.escort&&G.run.escort.hp<=0&&G.run.escort.alive)await woolDied();
 saveRun()}
// leaving: any time, by walking off the first chunk's edge; a started, unfinished job then counts as failed
async function leaveSite(){const r=G.run,job=r.job;
 if(job&&job.started&&!job.resolved){const c=await choose(['Stay','Leave (the job counts as failed)'],{title:'LEAVE THE SITE?'});if(c!==1){StudioMove.place(G,1,G.y,'right');return}
  await payScreen(job.id,{failed:true});r.job=null}
 else if(job&&!job.started){r.job=null}
 G.site=null;saveRun();enterRegion()}

// ================= THE PAY SCREEN =================
// o: {fee (fraction of the fee: 1, .5 half, 1.5 alive), failed, noFee, extra lines, trophies:[names]}
async function payScreen(id,o={}){
 const r=G.run,J=JOBS[id],c=r.contracts.find(x=>x.id===id)||{pay:jobPay(id)},lines=[],card=[];
 let fee=o.failed||o.noFee?0:Math.round(c.pay*(o.fee==null?1:o.fee)),xp=jobXP(id)/(o.failed?2:1);
 if(o.xp!=null)xp=o.xp;
 r.purse+=fee;
 await say('',fee?RLT(o.fee===.5?'ST-PAY-HALF':'ST-PAY-1')+` ${fee} gr.`:o.failed?'No fee. A failed job.':'No fee.');
 if(J&&J.by==='giver'&&!o.failed&&!o.noFee){await favor(GIVERS[J.giver].faction,1);lines.push(`+1 favor with the ${FACS[GIVERS[J.giver].faction]}.`);card.push(['Favor',`+1 the ${FACS[GIVERS[J.giver].faction]}`,IK.moss])}
 const live=party.filter(m=>!m.dead);live.forEach(m=>{m.xp=(m.xp|0)+xp});lines.push(`${xp} XP each.`);card.unshift(['XP',`${xp} each`]);
 const sl=r.job&&r.job.sanLost?Object.entries(r.job.sanLost).map(([k,v])=>{const m=party.find(p=>p.id===k);return m?`${m.name} −${v}`:''}).filter(Boolean):[];
 lines.push(sl.length?`SAN lost: ${sl.join(', ')}.`:'SAN lost: none.');card.push(['SAN lost',sl.length?sl.join(' · '):'none']);
 if(o.got&&o.got.length){lines.push(`Gained: ${o.got.join(', ')}.`);card.push(['Gained',o.got.join(', ')])}
 // the pay as one card (spec 008, 8C; mockup 44): the fee, then XP, favor, SAN lost and what was gained as right-aligned rows
 if(G.auto)await say('',lines.join(' '));else await showCard({title:'THE FEE',right:fee?fee+' gr':'none',sub:J?J.title:'',rows:card});
 // level-ups: 2 picks of +5% (cap 95%) and +1 max HP; can be put off (a badge on the Party menu)
 for(const m of live){while((m.lvl|0)<10&&m.xp>=XP_AT[m.lvl]){m.lvl++;m.mhp++;m.hp++;m.picks=(m.picks|0)+2;await say('',`${m.name} reaches level ${m.lvl}.`)}if(m.picks)await levelPicks(m,true)}
 // the contract's flags: statuses clear; between-contracts SAN is ready again; hire pools refresh; the Hue and cry fades
 if(c&&!o.keep){c.done=true;r.boards.done.push(id);r.boards.taken=r.boards.taken.filter(j=>j!==id)}
 r.partD=true;r.done=(r.done|0)+(o.failed?0:1);
 live.forEach(m=>{m.st=(m.st||[]).filter(s=>s==='Hungry'||s==='Starving');(m.inj||[]).forEach(x=>{if(x.tier==='Minor')x.left--});m.inj=(m.inj||[]).filter(x=>x.tier!=='Minor'||x.left>0)});
 r.between={bless:{},brothel:{}};RG().innSan={};Object.keys(TOWNS).forEach(t=>r.hires[t]=rollPool(r,t));
 if(!r.climbed&&r.hue>0){r.hue--;await say('','Word dies down. The Hue and cry drops a step.')}r.climbed=0;
 const g=RG();g.seals=(g.seals||[]).filter(s=>r.contracts.some(x=>!x.done&&JOBS[x.id].site===s));
 if(typeof afterPay==='function')await afterPay(id,o);
 saveRun()}
async function levelPicks(m,canWait){const SK=Object.keys(RLS.SKILLS);
 while(m.picks>0){const rows=SK.map(k=>({label:`${k} ${m.sk[k]}%`,dis:m.sk[k]>=95}));if(canWait)rows.push({label:'Later (Party menu)'});
  rows.forEach((r2,i)=>{const k=SK[i];if(!k)return;r2.name=k;r2.right=m.sk[k]>=95?`${m.sk[k]}% (top)`:`${m.sk[k]}% → ${Math.min(95,m.sk[k]+5)}%`});
  const c=G.auto&&G.auto.menu?0:await choose(rows,{cancel:canWait,tface:{sp:m.sp,look:m.look},title:`${m.name.toUpperCase()} · LEVEL ${m.lvl} · ${m.picks} PICK${m.picks>1?'S':''} LEFT · +5% EACH · MAX HP +1`});
  if(c<0||c>=SK.length)return;m.sk[SK[c]]=Math.min(95,m.sk[SK[c]]+5);m.picks--}saveRun()}

// ================= TROPHIES AND THE BESTIARY =================
// trophies sell wherever there's a buyer: in the slice the church buys unnatural ones (5, 8 at Church Trusted, +1 Church
// favor), markets and the apothecary buy spare parts (3–8); the fence (the Withy Hag's cut) buys stolen goods and trophies
function trophyPrice(p,shop){if(p.trophy&&p.unnatural)return shop==='church'?(facStep('church')>=3?8:5):shop==='fence'?10:0;if(p.trophy)return shop==='fence'?8:0;if(p.part)return shop==='market'||shop==='apothecary'||shop==='fence'?p.value||5:0;return 0}
function addTrophy(t){G.run.pack.push(Object.assign({n:1},t));saveRun()}
function churchRows(k){const tr=(G.run.pack||[]).filter(p=>p.trophy&&p.unnatural);const rows=[];if(tr.length)rows.push({label:`Give a trophy to be burned (${trophyPrice(tr[0],'church')} gr, +1 Church favor)`});if(typeof churchRowsE==='function')rows.push(...churchRowsE(k));return rows}
async function churchAct(k,i){const tr=(G.run.pack||[]).filter(p=>p.trophy&&p.unnatural);
 if(tr.length&&i===0){const t=tr[0];G.run.pack.splice(G.run.pack.indexOf(t),1);G.run.purse+=trophyPrice(t,'church');await favor('church',1);await say('',`The priest takes the ${t.name.toLowerCase()} at arm's length and burns it behind the church.`);if(t.pious&&typeof onPious==='function')await onPious(t);return}
 if(typeof churchActE==='function')await churchActE(k,i-(tr.length?1:0))}
// the bestiary lives in rl.ledger, so it survives a wipe; pieces: sighted, identified, killed; tales: true or legend
function ledger(){return store.get(B.key('ledger'),null)||B.newLedger()}
function saveLedger(L){store.set(B.key('ledger'),L)}
function bestiary(key,piece,o={}){const L=ledger(),b=L.bestiary[key]=L.bestiary[key]||{name:o.name||key,region:'The Withy March',kind:o.kind||'',pieces:{},tales:{}};
 if(piece)b.pieces[piece]=1;if(o.tale)b.tales[o.tale[0]]=o.tale[1];if(o.allTales)Object.assign(b.tales,o.allTales);saveLedger(L);return b}
async function identify(key,m){const b=bestiary(key,'identified');if(typeof onIdentify==='function')await onIdentify(key,m)}
// Map menu → Bestiary (spec 008, 8C; mockup 42): the list of entries with what's known (sighted, identified, killed); the picked
// entry's card with its drawing beside the name, kind and nature, then signs and tales. What isn't known yet says how to learn it.
let BV=null;
const BEAST_ART={noonwife:'noonwife',counter:'counter',monk:'monk',candle:'candle',lamp:'lampwalkers',lampwalkers:'lampwalkers',severa:'severa',hedgecat:'hedgecat',cat:'hedgecat',rooks:'rooks',rook:'rooks',hag:'hag'};
function openBestiary(){const L=ledger(),keys=Object.keys(L.bestiary);if(!keys.length)return say('','Nothing written in the bestiary yet.');
 return new Promise(res=>{BV={keys,sel:0,top:0,done:res};ban.hidden=true;gEl.classList.add('menu')})}
function bestiaryPress(k){const n=BV.keys.length;if(k==='up')BV.sel=(BV.sel+n-1)%n;else if(k==='down')BV.sel=(BV.sel+1)%n;else if(k==='b'||k==='a'||k==='start'){const d=BV.done;BV=null;gEl.classList.remove('menu');d()}}
function drawBestiary(){const L=ledger(),B=BV;pR(0,0,VW,VH,PAL.peat);let y=frameTop('BESTIARY','The Withy March')+2;const bot=frameFoot('▲▼: ENTRY · B: BACK');
 const known=k=>['sighted','identified','killed'].filter(p=>L.bestiary[k].pieces[p]).join(', ')||'heard of';
 const vis=Math.max(2,Math.min(B.keys.length,Math.floor((bot-y)/3/13)));B.top=Math.max(0,Math.min(B.sel,Math.max(B.top,B.sel-vis+1)));
 const lh=8+vis*13;parch(4,y,VW-8,lh);B.keys.slice(B.top,B.top+vis).forEach((k,i)=>{const yy=y+4+i*13,on=B.top+i===B.sel;if(on){pR(6,yy-1,VW-12,13,'rgba(217,180,90,.35)');StudioParch.seal(cx,13,yy+5,PT_)}
  pT(L.bestiary[k].name,22,yy-1,IK.peat,14);const kn=known(k);pT(kn,VW-10-pW(kn,13),yy,IK.moss,13)});y+=lh+4;
 const k=B.keys[B.sel],b=L.bestiary[k],T_=BEAST_TEXT[k]||{},art=RLArt.sprite(BEAST_ART[k]||k),out=[];
 const ch=bot-y-2;parch(4,y,VW-8,ch);let yy=y+5,ax=10;
 if(art&&b.pieces.sighted){const sc=art.height>60?.5:1,aw=Math.round(art.width*sc),ah=Math.round(art.height*sc);cx.imageSmoothingEnabled=false;cx.drawImage(art,10,yy,aw,ah);ax=Math.min(16+aw,110)}
 const tw=VW-14-ax;pT(b.name.toUpperCase(),ax,yy+1,IK.peat,pSize(b.name.toUpperCase(),tw,[8,7],PXf)||7,PXf);yy+=13;
 if(b.pieces.identified&&T_.kind){pWrap(`${T_.kind} · ${T_.nature||'—'}`,tw,14,2).forEach(l=>{pT(l,ax,yy,IK.rust,14);yy+=12})}else{pWrap('Identify it to learn its kind and nature.',tw,13,2).forEach(l=>{pT(l,ax,yy,IK.dim,13);yy+=11})}
 if(b.pieces.sighted&&T_.desc)pWrap(RLT(T_.desc),tw,14,3).forEach(l=>{cx.font='italic '+VTf(14);cx.fillStyle=IK.soot;cx.textBaseline='top';cx.fillText(l,ax,yy);yy+=12});
 yy=Math.max(yy,y+5+(art&&b.pieces.sighted?Math.round(art.height*(art.height>60?.5:1)):0))+3;pR(10,yy,VW-20,1,'rgba(90,62,43,.5)');yy+=3;
 // the text takes a size down when it would run past the card, so nothing is cut
 const parts=[];if(b.pieces.sighted){if(T_.signs)parts.push(['Signs. ',T_.signs.map(q=>RLT(q)).join(' ')]);(T_.tales||[]).forEach((t,i)=>parts.push([`Tale ${i+1}. `,`${RLT(t)}${b.tales[i+1]?' ('+b.tales[i+1]+')':''}`]))}
 else parts.push(['','Only its name, so far. Sight it to learn more.',IK.dim]);
 if(b.pieces.killed){if(T_.weak)parts.push(['Weakness. ',T_.weak]);if(T_.trophy)parts.push(['Trophy. ',T_.trophy]);if(T_.under)parts.push(['',RLT(T_.under)])}else parts.push(['','Weakness and trophy: kill it to learn them.',IK.dim]);
 const fit=z=>parts.reduce((a,[l,t])=>a+pWrap(l+t,VW-20,z,9).length,0)*(z===14?12:z===13?11:10)<=y+ch-4-yy,z=[14,13,12].find(fit)||12,lz=z===14?12:z===13?11:10;
 const add=(lab,t,c)=>pWrap(`${lab}${t}`,VW-20,z,9).forEach((l,i)=>{if(yy>y+ch-lz)return;if(i===0&&lab){pT(lab,10,yy,IK.dim,z);pT(l.slice(lab.length),10+pW(lab,z),yy,c||IK.soot,z)}else pT(l,10,yy,c||IK.soot,z);yy+=lz});
 parts.forEach(([l,t,c])=>add(l,t,c));
}

// a job resolved on its site and paid in town (a bounty brought in): the pay screen when the company walks into that town
async function onTownArrive(k){const r=G.run;
 if(k==='ebbe'&&r.escort&&await woolArrive())return;
 if(k==='harrow'){if(r.woolPurse){r.woolPurse=0;await say('','You hand the guild master his skim back. He looks at you differently after that.');await favor('town',1)}
  if(r.hagLie===1){r.hagLie=2;if(!StudioRoll.luck(0).ok){await say('','The guild has seen salt come over the causeway again. They know what you sold them.');offense('town')}}}
 const job=r.job;if(!job||!job.resolved)return;const c=r.contracts.find(x=>x.id===job.id);if(!c||c.payAt!==k)return;
 await say('',job.ending==='bound'?'The reeve takes Pell off your hands and signs for him.':'The reeve has the body looked at, then pays.');
 await payScreen(job.id,{fee:job.payWith||1});r.job=null;saveRun()}

// the Contracts page lists the job in progress's prep and the tales sorted so far (spec 006, 4)
function drawContractsExtra(card,wrap){const job=G.run.job;if(!job||typeof card!=='function')return;
 if(job.prep&&job.prep.length)card(job.prep.flatMap(p=>wrap(p)),'PREP');
 const key={noon:'noonwife',counter:'counter'}[job.id];if(key){const b=ledger().bestiary[key]||{tales:{}};
  card((BEAST_TEXT[key].tales||[]).flatMap((t,i)=>{const s2=b.tales[i+1];return wrap(`${i+1}. ${RLT(t)}${s2?' ('+s2+')':''}`)}),'TALES')}}
