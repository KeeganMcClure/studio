// Black Lantern · debrief.js
// The debrief and case gains (spec 007, Demo 6 of 6), built from the approved debrief mockup. After a case's last scene:
//   1. Big Hat's debrief in the donut-shop back room, with the case wrap-up card on top and a send-off for anyone lost
//   2. a recruit, if an agent was lost in the boss fight (Losing an agent)
//   3. bag or hide: Big Hat sorts the case-only items (ordinary kept, unnatural bagged unless hidden)
//   4. the cover story: pick a story and who tells it; the roll closes the case quietly or climbs overstepping
//   5. case gains: +1d4% to each skill tried and failed this case, unlocks flashed, then the heal-up
//   6. the funeral or retirement goodbye for anyone lost, the memorial entry finished, then the case board
// Each step autosaves when it ends (G.db in the checkpoint, bl.game), so closing the app picks up at the same step.
// Loaded after case-board.js as a plain script, sharing the engine's G, party, say, choose, the party menu's drawing
// helpers (pT, pW, pR, pBox, PC) and field.js (SCR, gearOf, itemDef, chanceOf, offerRecruit). Each case supplies its
// own lines, cover stories and which items are unnatural in registerCase({debrief}); this file never names a case.
// The chips and dice are the studio's engine/chip.js. Words: strings.js (DEBRIEF, UNLOCKS).

const DBW=BLS.DEBRIEF;
const dbCase=()=>caseById(G.case)||{};
const dbData=()=>dbCase().debrief||{};
const firstOf=n=>String(n||'Agent').split(' ')[0];
const codeOf=x=>x.code||String(x.name||'Agent').split(' ').pop().toUpperCase();
// plays a list of boxes: a string is narration, ['WHO', 'line'] is speech, ['SHOUT', 'LINE'] is Big Hat shouting
async function dbPlay(seq,o={}){for(const l of [].concat(seq||[])){if(Array.isArray(l)){if(l[0]==='SHOUT')await shout(fillT(l[1],o));else await say(l[0],fillT(l[1],o))}else await say('',fillT(l,o))}}

// ================= THE FLOW =================
// A case's ending calls debrief(label, facts) once its last scene has played (spec 006 C6 hands over the facts).
async function debrief(label,facts){
 held=[];const mem=store.get(B.key('memorial'),[]);
 const lost=(Array.isArray(mem)?mem:[]).filter(x=>x&&x.case===G.case&&!x.done).map(x=>({name:x.name,code:x.code,how:x.how,cases:x.cases|0}));
 G.db={step:1,label,facts:Object.assign({},facts,{fights:G.fights|0,zip:G.fs.zip|0}),lost};
 await fade(1);G.mode='scene';G.scene='bighat';hud.hidden=true;ban.hidden=true;menuEl.hidden=true;await fade(0);
 checkpoint();
 await runDebrief();
}
// runs from whatever step was reached (a fresh debrief, or a checkpoint reopened mid-debrief)
async function runDebrief(){
 const D=G.db;if(!D)return;
 G.mode='scene';if(G.scene!=='funeral')G.scene=D.step>=7?'home':'bighat';hud.hidden=true;
 if(D.step===1){await sleep(300);await dbTalk();D.step=2;checkpoint()}
 if(D.step===2){if(G.fs.recruit&&G.fs.recruit.length)await offerRecruit({ask:caseWord('recruit',DBW.recruit),late:true});D.step=3;checkpoint()}
 if(D.step===3)await dbItems();
 if(D.step===4)await dbCover();
 if(D.step===5)await dbGains();
 if(D.step===6){await dbFarewell();D.step=7;checkpoint()}
 if(D.step===7)await runHome();  // the home phase (home.js, spec 008)
 finish(D.label,D.facts);
}

// ---------- 1. Big Hat's debrief, under the wrap-up card ----------
function dbCount(){const D=G.db,X=dbData(),ids=X.clues||[],F=D.facts,z=F.zip&&X.zip?1:0;
 return{x:(F.clues||[]).filter(k=>ids.includes(k)).length+z,t:ids.length+z,v:F.saved|0,n:X.victims|0}}
async function dbTalk(){
 const D=G.db,X=dbData(),F=D.facts,o=dbCount();
 await dbPlay((X.lines||{})[D.label]||(X.lines||{}).costly,o);
 if(X.react)await dbPlay(X.react(F),o);
 if(F.zip&&X.zip)await dbPlay(X.zip,o);  // Bodyguard's Zip ties: the extra clue (counted on the card)
 // the send-off: one line per agent lost this case, a death or a retirement (Losing an agent)
 for(const x of D.lost){const t=x.how==='retired'?DBW.sendRetire:x.how==='0 SAN'?DBW.sendDark:DBW.sendDeath[(x.name||'').length%DBW.sendDeath.length];
  await say('BIG HAT',fillT(t,{c:codeOf(x),n:firstOf(x.name),k:x.cases|0}))}
 if(X.end)await dbPlay(X.end,o);
}
// the case wrap-up card across the top of the back room (Quality of life: Case wrap-up card); step 1 only
function dbCard(){
 const D=G.db;if(!D||D.step!==1||SCR)return;
 const F=D.facts,o=dbCount(),c=dbCase(),title=c.card?c.card.title:'',steps=stepsOf(),s=loadSeason();
 const san=(F.san||[]).slice(0,3),x=4,w=VW-8,h=san.length?60:38;
 pBox(x,3,w,h,PC.navy,PC.cream);
 pT(DBW.closed,x+5,7,PC.gold,8,PXf);const tt=pFit(title.charAt(0)+title.slice(1).toLowerCase(),100,14);pT(tt,x+w-5-pW(tt,14),4,PC.lav,14);
 const L=[[DBW.clues,`${o.x}/${o.t}`]];if(o.n)L.push([DBW.saved,`${o.v}/${o.n}`]);
 L.push([DBW.fights,String(F.fights|0)],[DBW.overstep,DBW.stepShort[steps[clamp(s.overstep|0,0,steps.length-1)]]||'']);
 L.forEach(([k,v],i)=>{const cx_=x+5+(i%2)*(w/2),cy=17+Math.floor(i/2)*11;pT(k,cx_,cy,PC.cream,13);pT(v,cx_+pW(k+' ',13),cy,i===L.length-1&&s.overstep>0?PC.gold:PC.cream,13)});
 if(!san.length)return;
 pR(x+5,41,w-10,1,PC.dim);
 san.forEach((m,i)=>{const cw=(w-10)/san.length,mx=x+5+cw*i+cw/2,lost=(m.from|0)-(m.to|0),t=lost>0?'−'+lost:lost<0?'+'+(-lost):'0',nm=pFit(String(m.name||'').toUpperCase(),cw-4,12);
  pT(nm,mx-pW(nm,12)/2,42,PC.lav,12);pT(t,mx-pW(t,13)/2,51,lost>0?PC.pink:PC.cream,13)});
}

// ---------- 3. Bag or hide (mockup screen 2) ----------
// every case-only item (pin) the party carries, from any agent's slots or the backpack, not yet sorted at a debrief
function dbItemRows(){const rows=[];
 live().forEach(m=>gearOf(m).it.forEach(it=>{if(it.pin&&!it.sorted)rows.push({it,m})}));
 (G.fs.pack||[]).forEach(it=>{if(it.pin&&!it.sorted)rows.push({it,m:null})});
 return rows}
const unnatural=it=>itemDef(it.k).kind==='unnatural';
function dbItems(){
 if(!dbItemRows().length){G.db.step=4;checkpoint();return}
 return new Promise(res=>{SCR={kind:'db',v:'items',sel:0,top:0,hits:[],done:res};ban.hidden=true});
}
async function dbItemAct(){
 const s=SCR,rows=dbItemRows();
 if(s.sel>=rows.length){dbSort(rows);return}
 const r=rows[s.sel];if(!unnatural(r.it)||r.it.hidden)return;
 s.lock=1;try{
  const i=await ask('',fillT(DBW.hideAsk,{i:itemDef(r.it.k).name.toLowerCase()}),[DBW.hideYes,DBW.hideNo]);
  // Confirm what sticks: a hide saves at once and can't be undone
  if(i===0){r.it.hidden=1;r.it.by=(r.m||lead()).a.name;checkpoint()}
 }finally{s.lock=0}
}
// Done: kept items stay where they are, bagged ones leave the party, hidden ones stay and go on the season's hidden list
function dbSort(rows){
 const D=G.db,s=loadSeason(),X=dbData(),bagged=[];
 rows.forEach(({it,m})=>{
  if(unnatural(it)&&!it.hidden){bagged.push(it.k);const L=m?gearOf(m).it:G.fs.pack,j=L.indexOf(it);if(j>=0)L.splice(j,1);return}
  it.sorted=1;if(it.hidden){s.hidden.push({k:it.k,case:G.case,who:it.by||(m||lead()).a.name});delete it.hidden;delete it.by}});
 store.set(seasonKey(),s);D.facts.bagged=bagged;D.step=4;checkpoint();
 const done=SCR.done;SCR=null;
 run(async()=>{for(const k of bagged)if(X.bagged&&X.bagged[k])await dbPlay(X.bagged[k]);done()});
}
function dbDrawItems(){
 const s=SCR,rows=dbItemRows(),n=rows.length+1;s.sel=clamp(s.sel,0,n-1);s.hits=[];
 pR(0,0,VW,VH,PC.navy);dbHeader(DBW.items,DBW.itemsHint);
 // the detail box fits the longest item's whole text (no cut-off lines; Keegan, Nov 24), sized once for all rows so it
 // doesn't jump as the cursor moves; the list gets the room that's left (at least one row, scrolling as before)
 const detOf=r=>{if(!r)return pWrap(DBW.itemKeys,220,15,9).map(t=>[t,PC.lav]);const d=itemDef(r.it.k),un=unnatural(r.it),who=firstOf((r.m||lead()).a.name);
  const st=un?(r.it.hidden?fillT(DBW.hideLine,{n:who}):DBW.bagLine):DBW.keepLine,sc=un&&r.it.hidden?PC.pink:PC.lav;
  return[...pWrap(d.desc,220,15,9).map(t=>[t,PC.cream]),...pWrap(st,220,15,4).map(t=>[t,sc])]};
 const RH=24,top=26,maxL=Math.max(1,...rows.map(r=>detOf(r).length),detOf(null).length),
  detH=Math.min(8+maxL*13,VH-top-RH-24),avail=Math.max(1,Math.floor((VH-top-detH-24)/RH));
 if(s.sel<s.top)s.top=s.sel;if(s.sel>=s.top+avail)s.top=s.sel-avail+1;
 for(let k=0;k<avail&&s.top+k<n;k++){const j=s.top+k,y=top+k*RH,on=j===s.sel,r=rows[j];
  pBox(4,y,232,RH-3,on?PC.cardOn:PC.card,on?PC.gold:PC.dim);if(on)pT('▶',7,y+3,PC.gold,15);
  s.hits.push({x:4,y,w:232,h:RH-3,fn:()=>{if(s.sel===j)dbPress('a');else s.sel=j}});
  if(!r){pT(DBW.done,20,y+3,on?PC.gold:PC.cream,16);continue}
  const d=itemDef(r.it.k),un=unnatural(r.it);icoPin(17,y+5,PC.pink);
  pT(pFit(d.name,150,15),26,y,on?PC.gold:PC.cream,15);pT(un?DBW.unnatural:DBW.ordinary,26,y+10,PC.lav,12);
  const chip=un?(r.it.hidden?DBW.hide:DBW.bag):DBW.keep,col=un?(r.it.hidden?PC.pink:PC.lav):PC.mus;
  const cw=StudioChip.width(cx,chip,{font:PXf(6),pad:4});StudioChip.draw(cx,229-cw,y+5,chip,{font:PXf(6),pad:4,h:11,fill:PC.deep,ink:col,line:col,dy:3});
 }
 const dy=top+avail*RH+2,r=rows[s.sel];pBox(4,dy,232,detH,PC.deep,PC.cream,2);
 detOf(r).slice(0,Math.floor((detH-6)/13)).forEach(([t,c],k)=>pT(pFit(t,220,15),10,dy+3+k*13,c,15));
}

// ---------- 4. The cover story (mockup screen 3) ----------
// the case's 2–3 stories, the weak Luck story, then any earned: the easy one (a quiet case still Clean), Clean books'
// safe story (an agent with Bureaucracy 90), the Small-town reporter's Camera story (a clue was photographed)
function dbStories(){
 const X=dbData(),F=G.db.facts,c=dbCase(),cur=loadSeason().overstep|0,st=[];
 (X.stories||[]).forEach(o=>st.push(Object.assign({type:'skill'},o)));
 st.push(Object.assign({type:'luck',skill:'Luck',verb:'',name:DBW.weak},X.weak||{}));
 if(c.quiet&&cur===0&&X.easy)st.push(Object.assign({type:'skill'},X.easy));
 if(live().some(m=>skillVal(m.a,'Bureaucracy')>=90))st.push(Object.assign({type:'safe',skill:'Bureaucracy',verb:'Clean books'},X.safe||{name:DBW.safeStory}));
 if(X.camera&&(!X.camera.show||X.camera.show(F)))st.push(Object.assign({type:'skill'},X.camera));
 return st}
const dbTellers=()=>live();
function dbChance(m,o){return o.type==='safe'?100:o.type==='luck'?50:chanceOf(m,o.skill,o.mod||0)}
function dbBest(o){const ms=dbTellers();let b=0;ms.forEach((m,i)=>{if(dbChance(m,o)>dbChance(ms[b],o))b=i});return b}
function dbClimbed(){const cur=loadSeason().overstep|0;return!!G.fs.climbed||(G.fs.step0!=null?cur>G.fs.step0:cur>0)}
// where a held story drops overstepping to (Overstepping, Carry-over; Nov 24, 2026): one step even if it climbed this
// case, two if it never climbed; never below Clean
function dbDropTo(cur){return Math.max(0,cur-(dbClimbed()?1:2))}
// Off the books (arc): once the first agency case has closed, every later debrief but the finale's asks about the page
// before the cover story. Keeping it off the books costs a step of overstepping unless Clean books or Credentials (a
// Bureaucracy roll) covers it. The season keeps the list (bl.season.kept; missing means none, so no save step).
async function dbOffBooks(){
 const D=G.db;if(D.off||!offBooksOpen()||isFinaleCase(G.case)){D.off=1;return}
 const i=await ask('BIG HAT',DBW.offAsk,[DBW.offFile,DBW.offKeep]);
 const s=loadSeason();if(!Array.isArray(s.kept))s.kept=[];
 if(i===1){if(!s.kept.includes(G.case))s.kept.push(G.case);store.set(seasonKey(),s);D.off=2;checkpoint();await say('',DBW.offKept);
  const ms=live(),clean=ms.find(m=>skillVal(m.a,'Bureaucracy')>=90);let who=clean;
  if(!who&&ms.length){const b=ms.slice().sort((a,b)=>chanceOf(b,'Bureaucracy')-chanceOf(a,'Bureaucracy'))[0],x=SR.pct(chanceOf(b,'Bureaucracy'));
   await say('',resultLine('BUREAUCRACY · '+b.name.toUpperCase(),x),{auto:1100});if(x.ok)who=b;else tried(b,'Bureaucracy')}
  if(who)await say('',fillT(DBW.offCover,{n:who.name}));
  else{const st=stepsOf(),s2=loadSeason(),cur=s2.overstep|0;if(cur<st.length-1){s2.overstep=cur+1;store.set(seasonKey(),s2);G.fs.climbed=1;await say('',fillT(DBW.offCost,{s:st[s2.overstep]}))}else await say('',DBW.offTop)}}
 else{D.off=1;checkpoint();await say('',DBW.offFiled)}
 D.off=D.off||1;checkpoint()}
async function dbCover(){await dbOffBooks();return new Promise(res=>{const st=dbStories();SCR={kind:'db',v:'cover',sel:0,who:dbBest(st[0]),focus:'list',hits:[],done:res};ban.hidden=true})}
async function dbTell(){
 const s=SCR,o=dbStories()[s.sel],m=dbTellers()[s.who]||lead(),D=G.db,steps=stepsOf(),sv=loadSeason(),cur=sv.overstep|0;
 let x=null,ok=true;
 if(o.type==='luck')x=SR.luck(0);else if(o.type==='skill')x=SR.pct(dbChance(m,o));
 if(x){ok=x.ok;if(!ok&&o.type==='skill')tried(m,o.skill)}  // a failed cover-story roll is a failed try for the teller
 // a pass closes it quietly and drops overstepping (one step, two on a clean case); a fail climbs one (held at the top)
 let climb=false,drop=false;
 if(!ok){if(cur<steps.length-1){sv.overstep=cur+1;climb=true}}
 else if(cur>0){sv.overstep=dbDropTo(cur);drop=true}
 store.set(seasonKey(),sv);
 D.cover={story:o.name,who:o.type==='skill'?m.name:null,ok,climb,drop,step:steps[sv.overstep]};D.facts.cover=D.cover;D.step=5;checkpoint();
 const done=s.done;SCR=null;
 run(async()=>{
  if(x)await say('',resultLine(o.type==='luck'?DBW.luck.toUpperCase():`${o.skill.toUpperCase()} · ${m.name.toUpperCase()}`,x),{auto:1200});
  if(ok){await dbPlay(o.pass);await say('',drop?fillT(DBW.heldDrop,{s:D.cover.step}):DBW.held)}
  else await say('',climb?fillT(DBW.broke,{s:D.cover.step}):fillT(DBW.brokeTop,{s:D.cover.step}));
  done()});
}
function dbDrawCover(){
 const s=SCR,st=dbStories(),ms=dbTellers(),steps=stepsOf(),cur=clamp(loadSeason().overstep|0,0,steps.length-1);s.sel=clamp(s.sel,0,st.length-1);s.hits=[];
 const o=st[s.sel];pR(0,0,VW,VH,PC.navy);dbHeader(DBW.cover,DBW.coverHint);
 // the overstepping track, the current step lit
 const tw=(232-(steps.length-1)*2)/steps.length;let y=25;
 steps.forEach((k,i)=>{const tx=4+i*(tw+2),on=i===cur,t=DBW.stepShort[k]||k;pBox(tx,y,tw,10,on?'#5a2a18':PC.deep,on?PC.rust:PC.dim);pT(t,tx+(tw-pW(t,6,PXf))/2,y+2,on?PC.gold:PC.lav,6,PXf)});
 y+=13;
 // the stories, each with its skill and its best odds in the party
 // a long story name wraps onto a second line and its row grows to fit (no "…"; Keegan, Nov 24), as long as the faces
 // and the pass / fail box still fit below; on a screen too short for that, the old one-line rows come back
 const room=VH-y-(9+50+3+30+3),base=Math.min(23,Math.max(18,Math.floor((VH-y-150)/st.length)));
 let nl=st.map(r=>Math.min(2,pWrap(r.name,170,15,2).length));
 if(st.reduce((t,r,j)=>t+(base>=21?23:base)+(nl[j]-1)*12,0)>room)nl=nl.map(()=>1);
 const rh=st.map((r,j)=>(base>=21?23:base)+(nl[j]-1)*12);let ry=y;
 st.forEach((r,j)=>{const RH=rh[j],on=j===s.sel,wrap=nl[j]>1;pBox(4,ry,232,RH-2,on?PC.cardOn:PC.card,on?PC.gold:PC.dim);if(on)pT('▶',6,ry+1,PC.gold,14);
  const col=on?PC.gold:r.type==='luck'?PC.lav:PC.cream;
  if(wrap)pWrap(r.name,170,15,2).forEach((t,k)=>pT(k?pFit(t,170,15):t,16,ry-1+k*12,col,15));else pT(pFit(r.name,170,15),16,ry-1,col,15);
  const sub=r.type==='luck'?`${DBW.weak} · ${DBW.luck}`:r.type==='safe'?`${r.skill} · ${r.verb}`:`${r.skill} · ${r.verb}`;if(RH>=21)pT(pFit(sub,170,11),16,ry+10+(nl[j]-1)*12,PC.lav,11);
  const p=r.type==='safe'?DBW.safe:dbChance(ms[dbBest(r)],r)+'%';pT(p,229-pW(p,15),ry+(RH-2)/2-8,r.type==='safe'?PC.green:PC.cream,15);
  const hy=ry;s.hits.push({x:4,y:hy,w:232,h:RH-2,fn:()=>{if(s.sel===j)dbPress('a');else{s.sel=j;s.focus='list';s.who=dbBest(st[j])}}});ry+=RH});
 y=ry+2;
 // who tells it: each agent's face and chance for the highlighted story (not for Luck or a safe story)
 const pick=o.type==='skill';
 pT(DBW.who,6,y,pick?PC.lav:PC.dim,6,PXf);y+=9;
 const cw=(232-(ms.length-1)*3)/ms.length,ch=50;
 ms.forEach((m,i)=>{const bx=4+i*(cw+3),on=pick&&i===s.who,foc=on&&s.focus==='who';
  pBox(bx,y,cw,ch,foc?PC.cardOn:PC.card,on?PC.gold:PC.dim,foc?2:1);
  if(!pick)cx.globalAlpha=.45;pR(bx+cw/2-17,y+3,34,34,PC.plum);cx.drawImage(faceOf(m.a,1),bx+cw/2-16,y+4);
  const nm=pFit(m.name.toUpperCase(),cw-4,12);pT(nm,bx+(cw-pW(nm,12))/2,y+37,on?PC.gold:PC.cream,12);cx.globalAlpha=1;
  if(pick){const p=dbChance(m,o)+'%';pT(p,bx+cw-4-pW(p,12),y+1,on?PC.gold:PC.lav,12)}
  s.hits.push({x:bx,y,w:cw,h:ch,fn:()=>{if(!pick)return;if(s.focus==='who'&&s.who===i)dbPress('a');else{s.who=i;s.focus='who'}}})});
 y+=ch+3;
 // what happens on a pass and on a fail, naming the step it would drop to and the step it would climb to
 const dh=Math.max(30,Math.min(56,VH-y-3));pBox(4,y,232,dh,PC.deep,PC.cream,2);
 const lines=[];
 const pass=cur>0?fillT(DBW.passDrop,{s:steps[dbDropTo(cur)]}):DBW.passQuiet;
 if(o.type==='safe')lines.push([DBW.safeLine+(cur>0?' '+fillT(DBW.safeDrop,{s:steps[dbDropTo(cur)]}):''),PC.cream]);
 else{lines.push([pass,PC.cream]);lines.push([cur<steps.length-1?fillT(DBW.failClimb,{s:steps[cur+1]}):fillT(DBW.failTop,{s:steps[cur]}),PC.cream])}
 lines.push([pick&&s.focus==='who'?DBW.tellKeys:pick?DBW.coverKeys:DBW.tellKeys.replace(' · B: back',''),PC.lav]);
 const out=[];lines.forEach(([t,c])=>pWrap(t,220,13,3).forEach(l=>out.push([l,c])));
 out.slice(0,Math.floor((dh-4)/11)).forEach(([t,c],k)=>pT(t,10,y+2+k*11,c,13));
}

// ---------- 5. Case gains (mockup screen 4) ----------
// each skill an agent tried and failed (once per skill) rolls 1d4, up to 99%; crossing 40, 75 or 90 flashes the unlock.
// Rolled once and saved before they show, so reopening the app shows the same dice. Recruits who joined at this
// debrief take no part.
function dbRollGains(){
 const D=G.db;if(D.gains)return;
 D.gains=live().filter(m=>!m.late).map(m=>{const a=m.a,rows=[];
  [...new Set(m.tried||[])].filter(k=>k in B.SKILLS).forEach(k=>{const old=skillVal(a,k),d=roll(1,4),up=Math.max(0,Math.min(d,99-old));
   if(up){a.grow=a.grow||{};a.grow[k]=(a.grow[k]||0)+up}const nw=skillVal(a,k),t=[40,75,90].findIndex(t=>old<t&&nw>=t);
   rows.push({k,d,old,nw,u:t>=0&&BLS.UNLOCKS[k]?BLS.UNLOCKS[k][t]:null})});
  return{id:a.id,name:m.name,prof:(profOf(a)||{}).name||'',rows}});
 // then the failed-tries list starts over for the next case
 live().forEach(m=>{m.tried=[];if(m.a.cur)m.a.cur.tried=[]});
 checkpoint();
}
function dbGains(){dbRollGains();return new Promise(res=>{SCR={kind:'db',v:'gains',off:0,hits:[],done:res};ban.hidden=true})}
// the heal-up: HP and WP refill and statuses clear (Minor injuries from the case before clear in finish())
function dbHeal(){
 live().forEach(m=>{m.hp=m.mhp;m.wp=m.mwp;m.st=[];m.stc={};m.flare={};m.flared={};m.high=null;m.ko=false;m.stun=0});
 G.db.step=6;checkpoint();const done=SCR.done;SCR=null;done()}
function dbDrawGains(){
 const s=SCR,D=G.db,gs=D.gains||[];s.hits=[];pR(0,0,VW,VH,PC.navy);dbHeader(DBW.gains,DBW.gainsHint);
 const foot=30,top=26,maxRows=3,byId=id=>live().find(m=>m.a.id===id);
 let y=top;const most=Math.max(0,...gs.map(g=>g.rows.length));s.off=clamp(s.off|0,0,Math.max(0,most-maxRows));
 gs.forEach(g=>{const vis=g.rows.slice(s.off,s.off+maxRows),un=vis.filter(r=>r.u).length,bh=Math.max(38,14+Math.max(1,vis.length)*12+un*11+3);
  if(y+bh>VH-foot-3)return;
  pBox(4,y,232,bh,PC.card,PC.dim);const m=byId(g.id);pR(8,y+3,34,34,PC.plum);if(m)cx.drawImage(faceOf(m.a,1),9,y+4);
  pT(g.name.toUpperCase(),48,y,PC.gold,15);const pf=pFit(g.prof,90,12);pT(pf,231-pW(pf,12),y+2,PC.lav,12);
  let ry=y+14;
  if(!g.rows.length)pT(DBW.noGains,48,ry-1,PC.dim,13);
  vis.forEach(r=>{pT(r.k,48,ry-1,PC.cream,14);const t=`${r.old} → ${r.nw}`,tw=pW(t,14);pT(t,231-tw,ry-1,r.nw>r.old?PC.cream:PC.lav,14);
   const chip=StudioChip.die(4,r.d),o={font:VTf(12),pad:3,h:10,fill:PC.deep,ink:'#3ff0e8',line:'#2a6a7a'};StudioChip.draw(cx,231-tw-6-StudioChip.width(cx,chip,o),ry+1,chip,o);ry+=12;
   if(r.u){const t=fillT(DBW.newUnlock,{u:r.u.toUpperCase()}),w=pW(t,11)+6;if(Math.floor(performance.now()/350)%4){pR(48,ry,w,10,PC.mus);pT(t,51,ry-1,PC.navy,11)}ry+=11}});
  if(g.rows.length>maxRows){const t=`▲▼ ${s.off+1}–${Math.min(g.rows.length,s.off+maxRows)}/${g.rows.length}`;pT(t,52+pW(g.name.toUpperCase(),15),y+2,PC.lav,11)}
  y+=bh+3});
 const fy=Math.min(y,VH-foot-2);pBox(4,fy,232,foot-2,PC.deep,PC.cream,2);pT(DBW.patched,10,fy+2,PC.cream,13);pT(DBW.next,10,fy+13,PC.lav,13);
 s.hits.push({x:4,y:fy,w:232,h:foot,fn:()=>dbPress('a')});
}

// ---------- 6. Funeral or goodbye, the memorial, then the board ----------
async function dbFarewell(){
 const D=G.db,late=live().filter(m=>m.late),r=late.length?late[0].name:null;
 for(const x of D.lost){const o={n:firstOf(x.name),r:r||'','r@':late.length?late[0].a:null};
  if(x.how==='retired'){await dbPlay(DBW.goodbye,o);if(r)await dbPlay(DBW.goodbyeNew,o);await dbPlay(DBW.goodbyeEnd,o)}
  else{await fade(1);G.scene='funeral';await fade(0);await dbPlay(DBW.funeral,o);if(r)await dbPlay(DBW.funeralNew,o);await dbPlay(DBW.funeralEnd,o);await fade(1);G.scene='bighat';await fade(0)}}
 // each lost agent's memorial entry is finished: cases closed, how, the case and the season
 const mem=store.get(B.key('memorial'),[]),s=loadSeason(),c=dbCase();
 if(Array.isArray(mem)){mem.forEach(x=>{if(x&&x.case===G.case&&!x.done){x.done=true;x.season=s.season|0||1;x.cases=x.cases|0;x.title=c.card?c.card.title:''}});store.set(B.key('memorial'),mem)}
}
// the funeral backdrop: a cemetery off the interstate in thin rain
function drawFuneral(){
 const t=performance.now()/1000,hz=Math.round(VH*.55);
 const g=cx.createLinearGradient(0,0,0,hz);g.addColorStop(0,'#2a2c3a');g.addColorStop(1,'#4a4c5a');cx.fillStyle=g;cx.fillRect(0,0,VW,hz);
 pR(0,hz,VW,VH-hz,'#1e2a22');pR(0,hz,VW,2,'#2c3a2e');
 [[24,0],[62,6],[176,2],[214,8]].forEach(([x,d])=>{const y=hz+10+d;pR(x,y-14,12,16,'#6a6a72');pR(x+1,y-15,10,1,'#6a6a72');pR(x+3,y-10,6,1,'#4a4a52')});
 // the casket and the mourners, from behind
 const mx=VW/2;pR(mx-24,hz+22,48,10,'#3a2418');pR(mx-24,hz+22,48,2,'#5a3a26');
 [-46,-30,-14,10,26,42].forEach((dx,i)=>{const x=mx+dx,y=hz+48+(i%2)*3;pR(x-4,y-18,8,18,'#121018');pR(x-3,y-24,6,6,'#121018')});
 pR(mx+60-7,hz+30,14,2,'#5a3a1e');pR(mx+60-4,hz+26,8,4,'#6b4626');pR(mx+60-3,hz+32,6,14,'#2a1a10');  // a hat at the back
 cx.strokeStyle='rgba(180,190,220,.35)';cx.lineWidth=1;cx.beginPath();
 for(let i=0;i<46;i++){const x=(i*53+t*40)%(VW+20)-10,y=(i*37+t*190)%(VH+20)-10;cx.moveTo(x,y);cx.lineTo(x-2,y+7)}cx.stroke();
}

// ================= THE SCREENS (SCR kind 'db': drawn on the 240 px canvas like the party menu) =================
function dbHeader(t,hint){pBox(4,4,232,18,PC.deep,PC.cream);pT(t,10,9,PC.gold,8,PXf);pT(hint,230-pW(hint,14),5,PC.lav,14)}
function dbDraw(){const v=SCR.v;if(v==='items')dbDrawItems();else if(v==='cover')dbDrawCover();else dbDrawGains()}
function dbPress(k){
 const s=SCR;if(!s||s.lock)return;
 if(s.v==='items'){const n=dbItemRows().length+1;
  if(k==='up')s.sel=(s.sel-1+n)%n;else if(k==='down')s.sel=(s.sel+1)%n;else if(k==='a')run(dbItemAct);return}
 if(s.v==='cover'){const st=dbStories(),o=st[s.sel],n=dbTellers().length;
  if(s.focus==='who'){if(k==='left')s.who=(s.who-1+n)%n;else if(k==='right')s.who=(s.who+1)%n;else if(k==='b')s.focus='list';else if(k==='a'){s.lock=1;dbTell()}return}
  if(k==='up'||k==='down'){s.sel=(s.sel+(k==='up'?-1:1)+st.length)%st.length;s.who=dbBest(st[s.sel])}
  else if(k==='a'){if(o.type==='skill')s.focus='who';else{s.lock=1;dbTell()}}
  return}
 if(s.v==='gains'){if(k==='up')s.off=Math.max(0,(s.off|0)-1);else if(k==='down')s.off=(s.off|0)+1;else if(k==='a')dbHeal()}
}
