// Rushlight · town.js
// Slice part C (spec 005): Harrowford and Saint Ebbe's as walkable streets, the notice board and the two givers, the
// slice's pool of 6 jobs posted a few at a time, the Contracts page, hiring into an empty seat, the shops and services,
// rumors, faction standing and favors, and the Hue and cry with its crimes, settling and fights.
// Loaded after region.js as a plain script; shares the engine's state and region.js's map, travel and road events.
const I_=RLS.ITEMS;
const STEPS=['HATED','WARY','NEUTRAL','TRUSTED','SWORN'];
const FACS={lord:'Lord',church:'Church',town:'Town',outlaws:'Outlaws'};
const HUE=['Quiet','Noticed','Wanted','Outlawed'];
const LETTERS=40;

// ================= THE TOWNS' STATE FROM THE SEED =================
// Fills everything Part C adds to rl.run, from the world stream, as if the company had just arrived (also upgrade step 2 → 3)
function makeTowns(run){
 const W=StudioSeed.load(run.streams.world),rn=n=>Math.floor(W.next()*n),pick=a=>a[rn(a.length)],shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=rn(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};
 const used=run.used||(run.used=[]);
 const order=shuf(Object.keys(JOBS).filter(k=>JOBS[k].by!=='none'));
 // 4 up at the start, at least one at each town
 let posted=order.slice(0,4);['harrow','ebbe'].forEach(t=>{if(!posted.some(j=>JOBS[j].town===t)){const j=order.find(x=>JOBS[x].town===t&&!posted.includes(x));posted[3]=j}});
 const givers={};Object.keys(GIVERS).forEach(k=>{givers[k]={name:pickName2(W,used),sp:RLSP.ORDER[rn(6)],look:{shade:rn(3),mark:rn(4),neck:rn(3)},quirk:pick(['Tight-fisted','Desperate','Pious','Grieving']),haggled:{},read:false,met:false}});
 const rumors={order:shuf(RUMORS),bought:0,lies:{}};
 run.boards={order,posted,taken:[],done:[]};run.contracts=run.contracts||[];run.givers=givers;run.rumors=rumors;
 run.fac={lord:{step:2,fav:0},church:{step:2,fav:0},town:{step:2,fav:0},outlaws:{step:2,fav:0}};run.hue=0;
 run.between={bless:{},brothel:{}};run.restock={};run.folk={};
 Object.keys(TOWNS).forEach(t=>{run.folk[t]=TOWNS[t].folk.map(f=>({sp:RLSP.ORDER[rn(6)],look:{shade:rn(3),mark:0,neck:rn(3)},name:rn(2)?pickName2(W,used):null,line:rn(1e6)}))});
 run.streams.world=W.save();
 run.hires={};Object.keys(TOWNS).forEach(t=>run.hires[t]=rollPool(run,t));
}
function pickName2(W,used){const pool=Object.keys(RL_TEXT).filter(k=>RL_TEXT[k].p==='name.given').map(k=>RL_TEXT[k].t).filter(n=>!used.includes(n)&&n!=='Pell'&&n!=='Hester');const n=pool[Math.floor(W.next()*pool.length)]||'Nobody';used.push(n);return n}
// a town's hire pool (spec 005, 4): 2-4 mercs, half the March's primary species (rounded up), level 1, fee 25;
// learned trades first at Saint Ebbe's; hires get 2-3 bumps in place of the 8 picks; 1 in 6 is Weak-willed (hidden)
function rollPool(run,t){const W=StudioSeed.load(run.streams.world),T=TOWNS[t],n=T.hires+(facStep('town',run)>=3?1:0),out=[];
 const learned=['friar','scribe','witch','barb'],trades=RLS.TRADES.map(x=>x.id),prim=run.region?run.region.species:'hare';
 for(let i=0;i<n;i++){const tr=T.learned&&i<2?learned[Math.floor(W.next()*4)]:trades[Math.floor(W.next()*13)];
  const c=B.rollDraft(W,tr,run.used,{bumps:2+Math.floor(W.next()*2)});if(i<Math.ceil(n/2))c.sp=prim;
  const m=B.build(c);m.weak=W.next()<1/6;m.fee=15+10*m.lvl;m.readDone=false;out.push(m)}
 run.streams.world=W.save();return out}
const facStep=(f,run)=>((run||G.run).fac||{})[f]?((run||G.run).fac[f].step):2;
const facWord=f=>STEPS[facStep(f)];

// ================= FAVORS, OFFENSES AND PRICES =================
async function favor(f,n){const F=G.run.fac[f];F.fav+=n;
 while(F.fav>=2&&F.step<4){F.fav-=2;F.step++;banner(`${FACS[f].toUpperCase()}: ${STEPS[F.step]}`)}
 while(F.fav<0){if(F.step>0){F.step--;F.fav+=2;banner(`${FACS[f].toUpperCase()}: ${STEPS[F.step]}`)}else{F.fav=0}}saveRun()}
function offense(f,why){const F=G.run.fac[f];if(F.step>0)F.step--;F.fav=0;banner(`${FACS[f].toUpperCase()}: ${STEPS[F.step]}`);if(why)logLine(why);saveRun()}
// Wary: +25% with that faction; Town Trusted: −10% at market
function priceOf(id,shop){let p=PRICE[id]!=null?PRICE[id]:(I_[id]&&(I_[id].slot==='weapon'&&I_[id].skill)?8:5);
 const fac=shop==='church'?'church':'town';if(facStep(fac)<=1)p=Math.ceil(p*1.25);if(shop==='market'&&facStep('town')>=3)p=Math.max(1,Math.floor(p*.9));return p}

// ================= THE HUE AND CRY =================
// A crime calls for a Luck roll: no penalty unseen, −20% seen, −40% in a town or on a busy road. Fail: up one step.
const crimeMod=w=>w==='town'||w==='busy'?-40:w==='seen'?-20:0;
const crimeMark=w=>`✖ crime · Luck ${50+crimeMod(w)}%`;
async function crime(w,what){
 const o=StudioRoll.luck(crimeMod(w));G.run.climbed=G.run.climbed||0;
 if(o.ok){logLine(`${what}: nobody makes anything of it.`);return false}
 await hueUp();return true}
async function hueUp(){const r=G.run;if(r.hue>=3)return;r.hue++;r.climbed=(r.climbed|0)+1;
 await say('',RLT(['','HC-NOTICED','HC-WANTED','HC-OUTLAWED'][r.hue]));
 if(r.hue===2){offense('lord');r.reeveScene=1}
 if(r.hue===3){r.fac.lord.step=0;r.fac.lord.fav=0;await favor('outlaws',1)}
 saveRun()}
async function hueDown(line){const r=G.run;if(r.hue>0)r.hue--;await say('',RLT(line||'HC-SETTLE'));saveRun()}

// ================= ENTERING A TOWN =================
// A town on the region map opens its street (the point cards stay for hamlets and wild sites until Part D)
async function openPlace(k){
 if(!TOWNS[k])return false;
 const r=G.run;
 // Town Hated: the gates are shut without a bribe or a Writ
 if(facStep('town')===0){const w=best('Letters');const c=await ask('','The gate stays shut. The watch looks at you over it.',[`Bribe the watch (10 gr)`,`Show a Writ (Letters · ${odds(w,'Letters')})`,'Leave']);
  if(c===0&&r.purse>=10)r.purse-=10;else if(c===1&&(w.sk.Letters||0)>=75&&StudioRoll.pct(w.sk.Letters).ok){}else return true}
 enterTown(k,'left');
 if(!r.seenTown)r.seenTown={};if(!r.seenTown[k]){r.seenTown[k]=1;await say('',RLT(TOWNS[k].arrive))}
 if(typeof onTownArrive==='function')await onTownArrive(k);
 // Lord Hated: his men attack on sight in his holdings
 if(facStep('lord')===0){await say('','The lord\'s men see you and come at once.');await townFight([foe('manatarms'),foe('manatarms')],'The lord\'s men')}
 return true}
function enterTown(k,side){const T=TOWNS[k];G.town=k;MAPS['town_'+k]=()=>townMap(k);G.mode='world';gEl.classList.remove('region');goMap('town_'+k,side==='left'?1:T.w-2,6,side==='left'?'right':'left')}
// the street as a tile map: rows 0-3 house fronts (doors on row 3), 4-9 cobbles, 10 the edge; props and folk block
function townMap(k){const T=TOWNS[k],g=mk(T.w,T.h,',');rect(g,0,0,T.w,4,'H');rect(g,0,T.h-1,T.w,1,'E');
 const O={},npcs=[],names={};
 T.buildings.forEach(b=>{if(b.door>=0){g[3][b.door]='D';if(b.place)O[b.door+',3']=()=>place(k,b.place,b.name)}});
 T.props.forEach(p=>{g[p.y][p.x]='P';if(p.kind==='stall'||p.kind==='board')g[p.y][p.x+1]='P';if(p.place){O[p.x+','+p.y]=()=>place(k,p.place,p.name);O[(p.x+1)+','+p.y]=O[p.x+','+p.y]}else O[p.x+','+p.y]=async()=>say('',propLine(p.kind))});
 (G.run.folk[k]||[]).forEach((f,i)=>{const [x,y,arch]=T.folk[i];npcs.push({x,y,sp:f.sp,look:arch==='monk'?Object.assign({},f.look,{coat:'#857e72',neck:2}):f.look,dir:'down',arch,talk:()=>folkTalk(k,i)})});
 // Saint Ebbe's dressing: monks in grey (hooded, no word for strangers) and a beggar at the gate
 const D=T.dressing||{};(D.monks||[]).forEach(([x,y],i)=>npcs.push({x,y,sp:RLSP.ORDER[(i*2+1)%6],look:{shade:1,mark:0,neck:2,coat:'#857e72'},dir:'down',talk:()=>say('','The monk keeps his eyes on the cobbles and walks on.')}));
 if(D.beggar){const [x,y]=D.beggar;npcs.push({x,y,sp:'rat',look:{shade:2,mark:3,neck:0,coat:'#5a5048'},dir:'down',talk:()=>say('BEGGAR','A groat for a soldier of the Grey Summer? No? A groat for the rest of us, then.')})}
 return {name:T.name,w:T.w,h:T.h,g,npcs,O,vv:{},town:k,warps:{},onStep:async()=>{if(G.x<=0||G.x>=T.w-1)await leaveTown()}}}
// the town strip (Art, Town street): party heads with the lead in Tallow, the town's name and type, purse, day
function drawTownStrip(){const r=G.run,T=TOWNS[G.town];if(!T)return;pR(0,0,VW,18,'rgba(44,38,33,.96)');pR(0,17,VW,1,'#e6dcc4');
 let x=3;party.forEach((m,i)=>{if(m.dead)return;const on=i===(G.lead|0);pR(x-1,2,14,14,on?'#d9b45a':'#857e72');cx.drawImage(RLSP.portrait(m.sp,m.look),0,0,64,64,x,3,12,12);x+=16});
 pT(T.name,x+2,2,'#e6dcc4',13);pT(T.type,x+6+pW(T.name,13),4,'#857e72',11);const ds=`DAY ${r.day}`,ps=`${r.purse} gr`;pT(ds,VW-3-pW(ds,13),2,'#e6dcc4',13);pT(ps,VW-9-pW(ds,13)-pW(ps,13),2,'#d9b45a',13)}
const propLine=k=>({cart:'A handcart with something under a sheet. The sheet is the wrong shape.',pillory:'A rat in the pillory. Somebody threw a turnip and missed.',well:'The well. A bucket, a chain, a smell.',gibbet:'The gibbet outside the wall. Its man has been there since Lent.'})[k]||'';
async function leaveTown(){const r=G.run;G.town=null;saveRun();enterRegion();}
// townsfolk: one line each on A, from the Voice pools (barks, the March's tic, sayings, texture)
function folkTalk(k,i){const f=G.run.folk[k][i],pool=Object.keys(RL_TEXT).filter(id=>/^(SY|TX)-/.test(id)),line=RLT(pool[f.line%pool.length]);
 const tic=RLT(G.run.region.tic).match(/Says: "([^"]+)"/);
 return say(f.name?f.name.toUpperCase():'',f.line%5===0&&tic?tic[1]:line)}

// ================= PLACES =================
async function place(k,p,name){held=[];
 if(G.run.reeveScene&&p==='reeve'){await reeveScene(k);return}
 const fn=PLACES[p];if(fn)await fn(k,name);saveRun()}
const PLACES={
 board:(k)=>openBoard(k),
 market:(k)=>shop(k,'market'),
 smith:(k)=>shop(k,'smith'),
 apothecary:(k)=>shop(k,'apothecary'),
 async inn(k,name){for(;;){const r=G.run,n=alive().length,free=facStep('town')===4;
  const rows=[free?'A night (free, Town Sworn)':`A night (${2*n} gr)`,...(k==='harrow'?['Mercs for hire']:[]),'Leave'];
  const c=await choose(rows,{cancel:true,title:name.toUpperCase()});
  if(c===0){const ok=free?await restInn(false):await restInn();if(ok)r.day++}
  else if(rows[c]==='Mercs for hire')await hireCorner(k);else return}},
 async tavern(k,name){for(;;){const r=G.run,left=r.rumors.order.length-r.rumors.bought;
  const c=await choose([{label:`A rumor (3 gr)`,dis:!left||r.purse<3},{label:'Ale (1 gr, into the pack)',dis:r.purse<1},...(r.fence&&k==='harrow'?[{label:'The fence (sells anything)'}]:[]),'Leave'],{cancel:true,title:name.toUpperCase()});
  if(c===2&&r.fence&&k==='harrow'){await sell('fence');continue}
  if(c===0){if(!left){await say('','Nobody has anything new.');continue}r.purse-=3;await buyRumor()}
  else if(c===1){r.purse-=1;toPack('ale',1);banner('ALE → PACK')}else return}},
 async barber(k,name){const r=G.run,hurt=alive().filter(m=>m.hp<m.mhp);for(;;){
  const rows=hurt.filter(m=>m.hp<m.mhp).map(m=>({label:`Heal ${m.name} to full (5 gr)`,dis:r.purse<5}));rows.push({label:'Lasting injuries (30 gr): come with Part D',dis:true});rows.push('Leave');
  const c=await choose(rows,{cancel:true,title:name.toUpperCase()});const hs=hurt.filter(m=>m.hp<m.mhp);if(c<0||c>=hs.length)return;r.purse-=5;hs[c].hp=hs[c].mhp;banner(hs[c].name.toUpperCase()+': FULL HP')}},
 async church(k,name){const r=G.run;if(facStep('church')===0){await say('','The door is barred to you. Somebody inside says a prayer about it.');return}
  for(;;){const half=facStep('church')>=3,bp=half?5:10,ip=priceOf('holywater','church');
   const c=await choose([{label:`A priest's blessing (${bp} gr a merc, 1d4 SAN)`},{label:'An indulgence (20 gr, +1 Church favor)',dis:r.purse<20},{label:`Holy water (${ip} gr)`,dis:r.purse<ip},...churchExtra(k),'Leave'],{cancel:true,title:name.toUpperCase()});
   if(c===0)await blessing(bp);else if(c===1){r.purse-=20;await favor('church',1);await say('','The pardoner writes your names in a nice hand.')}
   else if(c===2){r.purse-=ip;toPack('holywater',1);banner('HOLY WATER → PACK')}
   else if(typeof churchAct==='function'&&c<3+churchExtra(k).length)await churchAct(k,c-3);else return}},
 async brothel(k,name){const r=G.run,n=alive().filter(m=>!r.between.brothel[m.id]).length;
  const c=await choose([{label:`An evening (5 gr a merc, a day passes)`,dis:!n||r.purse<5},'Leave'],{cancel:true,title:name.toUpperCase()});if(c!==0)return;
  const got=[];for(const m of alive()){if(r.between.brothel[m.id]||r.purse<5)continue;r.purse-=5;r.between.brothel[m.id]=1;const s=StudioRoll.die(4);m.san=Math.min(m.msan,m.san+s);got.push(`${m.name} +${s}`);
   if(!StudioRoll.pct(m.stats.CON*5).ok&&m.sp!=='rat'&&!m.st.includes('Sickened'))m.st.push('Sickened')}
  r.day++;await eatDay();applySan();await say('',`The evening happens off the page. A day passes. SAN: ${got.join(', ')||'nobody'}.${party.some(m=>m.st.includes('Sickened'))?' Someone wakes up Sickened.':''}`)},
 async reeve(k){for(;;){const r=G.run,step=HUE[r.hue],L=best('Letters'),P=best('Persuade'),bm=[0,15,30,45][r.hue];
  const rows=r.hue?[{label:`Blood-money (${bm} gr, no roll)`,dis:r.purse<bm},{label:`Show a Writ (Letters · ${(L.sk.Letters||0)>=75?odds(L,'Letters'):'needs 75%'})`,dis:(L.sk.Letters||0)<75||L.writUsed},{label:`Talk to the reeve (Persuade · ${odds(P,'Persuade',distrust(P))})`},'Leave']:['Leave'];
  const c=await choose(rows,{cancel:true,title:`THE REEVE · HUE AND CRY: ${step.toUpperCase()}`});
  if(!r.hue||c<0||c===3)return;
  if(c===0){r.purse-=bm;await hueDown()}
  else if(c===1){L.writUsed=1;const o=StudioRoll.pct(L.sk.Letters);if(o.ok)await hueDown();else if(o.fumble){await say('','He holds your Writ up to the light. It doesn\'t take the light well.');await hueUp()}else await say('','He reads it twice and hands it back. Not today.')}
  else{const o=StudioRoll.pct((P.sk.Persuade||0)+distrust(P));if(o.ok)await hueDown();else{await say('','He doesn\'t like the way you said that.');await hueUp()}}}},
 guild:(k)=>giverPlace('guild'),
 prior:(k)=>giverPlace('prior'),
 hire:(k)=>hireCorner(k)
};
const churchExtra=k=>typeof churchRows==='function'?churchRows(k):[];
function toPack(id,n){const p=G.run.pack.find(x=>x.id===id);if(p)p.n=(p.n||1)+n;else G.run.pack.push({id,n})}
async function blessing(price){const r=G.run,got=[];for(const m of alive()){if(r.between.bless[m.id]||r.purse<price)continue;r.purse-=price;r.between.bless[m.id]=1;const s=StudioRoll.die(4);m.san=Math.min(m.msan,m.san+s);got.push(`${m.name} +${s}`)}
 applySan();await say('',got.length?`The priest says the words over each of you. SAN: ${got.join(', ')}.`:'You\'ve each had your blessing since the last job.')}

// ================= SHOPS =================
// A list box: the item's type icon, its price, and better or worse arrows against each merc's equipped piece;
// Restock (consumables used since the last market, at this shop's price); Sell (half the buy price; Sell all here)
function better(id){const it=I_[id];if(!it)return'';return party.filter(m=>!m.dead).map(m=>{
 if(it.slot==='weapon'&&it.dmg){const cur=m.gear.w1?I_[m.gear.w1.id]:null;const a=avgDmg(it.dmg),b=cur&&cur.dmg?avgDmg(cur.dmg):0;return a>b?'▲':a<b?'▼':'='}
 if(it.slot==='body'||it.slot==='head'){const cur=m.gear[it.slot];const a=armorOf(id),b=cur?armorOf(cur.id):0;return cur&&cur.id===id?'=':a>b?'▲':a<b?'▼':'='}return''}).join('')}
const avgDmg=s=>{const m=String(s).match(/(\d+)d(\d+)([+-]\d+)?/);return m?(+m[1])*((+m[2])+1)/2+(+(m[3]||0)):0};
const armorOf=id=>({jack:1,mail:2,plate:3,hood:.1,kettle:.3,coif:.4,herbmask:.2})[id]||0;
async function shop(k,s){const r=G.run;
 for(;;){const stock=SHOPS[s],rows=stock.map(id=>({label:I_[id].name,right:`${priceOf(id,s)} gr ${better(id)}`,dis:priceOf(id,s)>r.purse,icon:I_[id].type}));
  if(s==='market')rows.unshift({label:'Rations',right:`${Math.ceil(1*(G.dev&&G.dev.winter?1.5:1))} gr`});
  const re=Object.entries(r.restock||{}).filter(([id,n])=>n>0&&stock.includes(id)),reCost=re.reduce((a,[id,n])=>a+n*priceOf(id,s),0);
  if(re.length)rows.push({label:`Restock (${re.map(([id,n])=>I_[id].name+(n>1?' ×'+n:'')).join(', ')})`,right:`${reCost} gr`,dis:reCost>r.purse});
  if(s==='smith')rows.push({label:'Mend',right:mendTotal()?`all ${mendTotal()} gr`:'nothing worn',dis:!mendTotal()});
  rows.push({label:'Sell',right:'half price'});rows.push({label:'Leave'});
  const c=await choose(rows.map(x=>Object.assign({},x,{label:x.label+(x.right?'  ·  '+x.right:'')})),{cancel:true,title:`${s.toUpperCase()} · ${r.purse} gr`});
  if(c<0||rows[c].label==='Leave')return;
  const L=rows[c].label;
  if(L==='Rations'){await buyRations(1);continue}
  if(L.startsWith('Restock')){for(const [id,n] of re){r.purse-=n*priceOf(id,s);toPack(id,n);r.restock[id]=0}banner('RESTOCKED');continue}
  if(L==='Mend'){await mend();continue}
  if(L==='Sell'){await sell(s);continue}
  const id=stock[c-(s==='market'?1:0)];if(!id)continue;const p=priceOf(id,s);if(p>r.purse)continue;r.purse-=p;toPack(id,I_[id].uses||1);banner(I_[id].name.toUpperCase()+' → PACK');
  if(s==='market')r.restock={};saveRun()}}
// the smith mends a step at a time: 3 to lift Worn, 6 to lift Cracked, 10 to lift Broken
const MEND=[0,3,6,10];
function wornPieces(){const out=[];party.filter(m=>!m.dead).forEach(m=>['w1','w2','body','head'].forEach(s=>{const it=m.gear[s];if(it&&it.wear)out.push({m,s,it})}));(G.run.pack||[]).forEach(p=>{if(p.wear)out.push({pack:p,it:p})});return out}
const mendCost=w=>{let t=0;for(let k=w;k>0;k--)t+=MEND[k];return t};
const mendTotal=()=>wornPieces().reduce((a,x)=>a+mendCost(x.it.wear),0);
async function mend(){const r=G.run,ws=wornPieces();const rows=ws.map(x=>({label:`${x.m?x.m.name+': ':''}${I_[x.it.id].name} (${WEAR[x.it.wear]})`,right:mendCost(x.it.wear)+' gr',dis:mendCost(x.it.wear)>r.purse}));
 rows.unshift({label:`Mend all`,right:mendTotal()+' gr',dis:mendTotal()>r.purse});
 const c=await choose(rows.map(x=>Object.assign({},x,{label:x.label+'  ·  '+x.right})),{cancel:true,title:'MEND'});if(c<0)return;
 const list=c===0?ws:[ws[c-1]];list.forEach(x=>{r.purse-=mendCost(x.it.wear);x.it.wear=0});banner('MENDED')}
async function sell(s){const r=G.run;for(;;){const items=[];
  (r.pack||[]).forEach(p=>items.push({p,from:'pack'}));party.filter(m=>!m.dead).forEach(m=>m.slots.forEach(p=>{if(!p.kit)items.push({p,from:m})}));
  const val=x=>sellPrice(x.p,s),ok=items.filter(x=>val(x)>0);
  const rows=ok.map(x=>({label:`${itemName(x.p)}${x.p.n>1?' ×'+x.p.n:''}${x.from!=='pack'?' ('+x.from.name+')':''}  ·  ${val(x)} gr`}));
  if(!ok.length){await say('','Nothing here they\'ll buy.');return}
  rows.push({label:`Sell all here  ·  ${ok.reduce((a,x)=>a+val(x)*(x.p.n||1),0)} gr`});
  const c=await choose(rows,{cancel:true,title:'SELL'});if(c<0)return;
  const go=c===ok.length?ok:[ok[c]];go.forEach(x=>{const n=c===ok.length?(x.p.n||1):1;r.purse+=val(x)*n;x.p.n=(x.p.n||1)-n;const L=x.from==='pack'?r.pack:x.from.slots;if(x.p.n<=0)L.splice(L.indexOf(x.p),1)});saveRun()}}
const itemName=p=>p.name||(I_[p.id]?I_[p.id].name:p.id);
function sellPrice(p,s){if(p.trophy||p.part)return typeof trophyPrice==='function'?trophyPrice(p,s):0;if(!I_[p.id])return 0;return Math.max(1,Math.floor(priceOf(p.id,s==='church'?'market':s)/2))}

// ================= RUMORS =================
async function buyRumor(){const r=G.run,R=r.rumors,id=R.order[R.bought++],g=RG();
 const line=id==='ROAD'?(g.hidden==='ok'?'RU-ROAD-A':'RU-ROAD-B'):id;await say('',RLT(line));
 if(id==='ROAD'){findHidden();RD[g.hidden].forEach(k=>{if(!knownPt(k))scout(k)});await say('',`You mark it on the chart: ${roadName(g.hidden)}.`)}
 else if(id==='RU-CAMP'||id==='RU-CAUSE'||id==='RU-SALLOW'||id==='RU-CROOK'){const k={'RU-CAMP':'camp','RU-CAUSE':'cause','RU-SALLOW':'sallow','RU-CROOK':'crook'}[id];showSite(k)}
 else if(id==='RU-MONK'){if(!addSign('CR-MONK-SIGN-4'))addSign(['CR-MONK-SIGN-1','CR-MONK-SIGN-2','CR-MONK-SIGN-3','CR-MONK-SIGN-4'].find(s=>!g.signs.includes(s))||'CR-MONK-SIGN-4');await say('','You write it on the Signs list.')}
 else{const k=id==='RU-LIE-1'?'lie1':'lie2';R.lies[k]={shown:1,found:0};g.known.push(k);revealRoad(k==='lie1'?'l1':'l2');await say('','You pencil a ? on the chart.')}
 saveRun()}
// a site and the roads to it shown on the map (a true rumor, or a taken contract)
function showSite(k){const g=RG();if(!g.known.includes(k))g.known.push(k);Object.keys(RD).forEach(r=>{if(RD[r].includes(k)&&roadShowable(r)&&RD[r].some(q=>q!==k&&knownPt(q)))revealRoad(r)})}

// ================= THE NOTICE BOARD AND CONTRACTS =================
const canRead=()=>alive().some(m=>(m.sk.Letters||0)>=LETTERS);
const jobPay=(id,g)=>{const J=JOBS[id];let p=J.pay;if(J.by==='giver'){const gv=G.run.givers[J.giver];p=Math.round(p*1.25);if(gv.quirk==='Desperate')p=Math.round(p*1.25);if(gv.haggled[id]==='pass')p=Math.round(p*1.25)}return p};
const moments=id=>alive().filter(m=>JOBS[id].tags.some(t=>m.mot.includes(t))).map(m=>`${m.name.toUpperCase()} (${JOBS[id].tags.filter(t=>m.mot.includes(t)).join(', ')})`).join(', ')||'—';
const threatText=id=>{const t=JOBS[id].threat,sk=skullsFor(t.lvl);return `${t.kind} · L${t.lvl} ${'☠'.repeat(sk)}${t.note?' · '+t.note:''}`};
function siteDays(id){const J=JOBS[id],rt=route(RG().at,J.site);return rt?rt.days:null}
// the contract card (Mockup 6): title, kind and shape; the bill's words; WHERE; PAYS; XP; THREAT; MOMENT
function cardLines(id,spoken){const J=JOBS[id],read=spoken||canRead(),d=siteDays(id),r=G.run,pay=jobPay(id),lines=[];
 lines.push(`${J.kind} · ${J.shape} · ${J.by==='board'?'board job, no haggling':'giver job'}`);
 if(read)lines.push(RLT(J.bill,{town:"Saint Ebbe's"}));else lines.push('Nobody here reads. You can make out the fee and the place.');
 lines.push(`WHERE  ${P_[J.site].name}${d!=null?` · ${d} day${d>1?'s':''} · food ${rationsNeed(d)}/${r.rations}`:' · no known road'}`);
 lines.push(`PAYS  ${pay} gr${J.alive?` dead · ${Math.round(pay*(1+J.alive))} gr alive (Manacles)`:''}`);
 if(read){lines.push(`XP  ${typeof jobXP==='function'?jobXP(id):'—'}`);lines.push(`THREAT  ${threatText(id)}`)}
 lines.push(`MOMENT  ${moments(id)}`);return lines}
async function openBoard(k){const r=G.run,B_=r.boards;
 for(;;){const here=B_.posted.filter(j=>JOBS[j].town===k&&JOBS[j].by==='board');
  if(!here.length){await say('','Old bills, a church notice, a mass for the dead. No work posted here.');return}
  const rows=here.map(j=>({label:canRead()?JOBS[j].title:`A bill · ${jobPay(j)} gr`}));rows.push({label:'Leave'});
  const c=await choose(rows,{cancel:true,title:`${TOWNS[k].name} · NOTICE BOARD`});if(c<0||c>=here.length)return;
  await jobCard(here[c],false)}}
async function jobCard(id,spoken){const lines=cardLines(id,spoken);
 const c=await ask(JOBS[id].title,lines.join('\n'),['Take it','Back']);if(c===0)await takeJob(id)}
async function takeJob(id){const r=G.run,B_=r.boards,J=JOBS[id];
 B_.posted=B_.posted.filter(j=>j!==id);B_.taken.push(id);
 const next=B_.order.find(j=>!B_.posted.includes(j)&&!B_.taken.includes(j)&&!B_.done.includes(j)&&!(B_.dropped||[]).includes(j));
 if(next)B_.posted.push(next);
 r.contracts.push({id,title:J.title,next:`Go to ${P_[J.site].name}`,day:r.day,pay:jobPay(id),started:false});
 showSite(J.site);RG().seals=RG().seals||[];if(!RG().seals.includes(J.site))RG().seals.push(J.site);
 if(typeof onTake==='function')await onTake(id);
 banner('TAKEN: '+J.title);saveRun()}
async function dropJob(id){const r=G.run,B_=r.boards,J=JOBS[id];r.contracts=r.contracts.filter(c=>c.id!==id);B_.taken=B_.taken.filter(j=>j!==id);
 if(J.by==='board'){B_.posted.push(id);await say('','You take the bill back to the board.')}
 else{(B_.dropped=B_.dropped||[]).push(id);await favor(GIVERS[J.giver].faction,-1);await say('',`The ${GIVERS[J.giver].title} hears you've dropped it. It costs you.`)}
 const g=RG();g.seals=(g.seals||[]).filter(s=>r.contracts.some(c=>JOBS[c.id].site===s));saveRun()}
// the Contracts page (R on the map): taken jobs with their Next lines, A to drop one; then the Signs list
let CP_SEL=0;
function drawContractsExtra(y){return y}
function contractsPress(k){const cs=G.run.contracts.filter(c=>!c.done);if(!cs.length)return;
 if(k==='up')CP_SEL=(CP_SEL+cs.length-1)%cs.length;else if(k==='down')CP_SEL=(CP_SEL+1)%cs.length;
 else if(k==='a'||k==='select'){const c=cs[CP_SEL];MAPV.page=null;run(async()=>{const x=await choose([`Keep ${c.title}`,`Drop ${c.title}`],{cancel:true,title:'CONTRACT'});if(x===1)await dropJob(c.id)})}}
// the givers (spec 005, 3): name, archetype, faction and its step, a showing quirk, and the job; haggling; Read
async function giverPlace(gk){const r=G.run,gv=r.givers[gk],G_=GIVERS[gk],k=G_.town;
 PORTRAITS[gv.name.toUpperCase()]=(c,f)=>{c.imageSmoothingEnabled=false;c.drawImage(RLSP.portrait(gv.sp,gv.look),0,0)};
 if(!gv.met){gv.met=true;await say(gv.name.toUpperCase(),RLT(G_.line))}
 for(;;){const jobs=r.boards.posted.filter(j=>JOBS[j].by==='giver'&&JOBS[j].giver===gk),wary=facStep(G_.faction)<=1;
  const head=`${gv.name}, ${G_.title} · ${FACS[G_.faction]} ${facWord(G_.faction)}${['Tight-fisted','Desperate','Pious','Grieving'].includes(gv.quirk)?' · '+gv.quirk:''}`;
  const rows=[];if(wary)rows.push({label:'No work for you (Wary)',dis:true});else jobs.forEach(j=>rows.push({label:`${JOBS[j].title} · ${jobPay(j)} gr`}));
  const E=best('Empathy');rows.push({label:`Read them (Empathy · ${odds(E,'Empathy')})`,dis:gv.read||(E.sk.Empathy||0)<40});rows.push({label:'Leave'});
  const c=await choose(rows,{cancel:true,title:head});if(c<0||rows[c].label==='Leave')return;
  if(rows[c].label.startsWith('Read')){gv.read=true;const o=StudioRoll.pct(E.sk.Empathy);await say('',o.ok?'Nothing hidden. What they show is what they are.':'You can\'t read them today.');continue}
  if(wary)continue;const id=jobs[c];
  for(;;){const P=best('Persuade'),mod=(gv.quirk==='Tight-fisted'?-20:0)+distrust(P),can=!gv.haggled[id]&&gv.quirk!=='Desperate';
   const x=await ask(gv.name.toUpperCase(),cardLines(id,true).join('\n'),['Take it',...(can?[`Haggle (Persuade · ${odds(P,'Persuade',mod)})`]:[]),'Back']);
   if(x===0){await takeJob(id);break}
   if(can&&x===1){const o=StudioRoll.pct((P.sk.Persuade||0)+mod);
    if(o.ok){gv.haggled[id]='pass';await say(gv.name.toUpperCase(),'Fine. A quarter more. Don\'t make me sorry.')}
    else if(o.fumble){gv.haggled[id]='fumble';await favor(G_.faction,-1);await say(gv.name.toUpperCase(),'Get out of my sight, and take the job or don\'t.')}
    else{gv.haggled[id]='fail';await say(gv.name.toUpperCase(),'That\'s the price.')}continue}
   break}}}

// ================= HIRING =================
// Only into an empty seat (the company is always 3). The hire card: the Pick a company seat card with the fee.
async function hireCorner(k){const r=G.run;
 for(;;){const pool=r.hires[k]||[],open=party.filter(m=>!m.dead).length<3;
  if(!pool.length){await say('','Nobody here is looking for work.');return}
  const rows=pool.map(m=>({label:`${m.name} · ${m.sp} · ${m.trade} · L${m.lvl} · ${m.fee} gr`}));rows.push({label:'Leave'});
  const c=await choose(rows,{cancel:true,title:open?'MERCS FOR HIRE':'MERCS FOR HIRE · NO SEAT OPEN'});if(c<0||c>=pool.length)return;
  const m=pool[c],E=best('Empathy');
  const card=`${m.name}, ${m.sp}, ${m.trade}. ${Object.keys(m.sk).sort((a,b)=>m.sk[b]-m.sk[a]).slice(0,3).map(s=>s+' '+m.sk[s]).join(', ')}. Main: ${m.mot[m.main]}. Kin: ${m.kin.name}, ${m.kin.type.toLowerCase()}. ${m.back}${m.readDone&&m.weak?' Weak-willed: they won\'t stay hungry long.':''}`;
  PORTRAITS[m.name.toUpperCase()]=(cc)=>{cc.imageSmoothingEnabled=false;cc.drawImage(RLSP.portrait(m.sp,m.look),0,0)};
  const x=await ask(m.name.toUpperCase(),card,[open?`Hire (${m.fee} gr)`:'Hire (no seat open)',`Read (Empathy · ${odds(E,'Empathy')})`,'Back']);
  if(x===0){if(!open){await say('','No seat open.');continue}if(r.purse<m.fee){await say('','Not enough in the purse.');continue}
   r.purse-=m.fee;pool.splice(c,1);const seat=party.findIndex(p=>p.dead);m.bonds={};party.filter(p=>!p.dead).forEach(p=>{p.bonds[m.id]=1;m.bonds[p.id]=1});
   if(seat>=0)party[seat]=m;else party.push(m);(r.joined=r.joined||[]).push({id:m.id,name:m.name,nick:[]});banner(m.name.toUpperCase()+' SIGNS ON');saveRun();return}
  if(x===1){if(m.readDone){await say('','You already read them.');continue}m.readDone=true;const o=StudioRoll.pct(E.sk.Empathy||0);
   await say('',o.ok?(m.weak?'Weak-willed. They\'ll walk the first time the bread runs short.':'Nothing hidden. They\'ll stay.'):'You can\'t read them.')}
 }}
// Weak-willed hires (bible Systems): grumble on the first unfed day; from the third, Luck each day to stay or desert
async function weakWilled(m){if(!m.weak)return;
 if(m.hunger===1)logLine(`${m.name} grumbles about the bread.`);
 if(m.hunger>=3&&!StudioRoll.luck(0).ok){m.dead=true;m.gone='desert';m.ko=false;await say('',`${m.name} is gone in the morning, with their own kit.`);if(typeof onMercGone==='function')await onMercGone(m,'LG-END-DESERT');saveRun()}}

// ================= CRIMES ON THE ROAD (Part B's events gain Rob them and a fight at the toll) =================
async function eventHook(kind,L){const r=G.run,busy=['he','hh'].includes(L.road)?'busy':'seen';
 if(kind==='storm'&&r.hue===3&&StudioRoll.die(15)<=10){ // Outlawed: bounty hunters replace Storm 81–90
  await say('','Two men with a bill of your faces come down the road. They\'ve been looking.');return await roadFightTown([foe('manatarms'),foe('manatarms')])||'none'}
 if(kind==='tree'&&facStep('outlaws')>=3){await say('',RLT('RE-TREE-1'));await say('','The bandits know your company. You pay a token toll and walk on.');r.purse=Math.max(0,r.purse-1);return 'none'}
 if(kind==='tree'&&facStep('outlaws')===0&&StudioRoll.die(2)===1){}
 if(kind==='toll'){const n=alive().length,m=best('Persuade');
  if(facStep('lord')>=3){await say('','The lord\'s man waves you through. Your name is good here.');return 'none'}
  const c=await evAsk(RLT('RE-TOLL-1'),[`Pay (${n} gr)`,`Talk (Persuade · ${odds(m,'Persuade',distrust(m))})`,'Go round (+1 day)',`Fight the lord's man  ${crimeMark(busy)}`]);
  if(c===3){const res=await roadFightTown([foe('manatarms')]);await crime(busy,'A fight at the toll');return res||'none'}
  if(c===0){r.purse=Math.max(0,r.purse-n);return 'none'}
  if(c===1){const o=StudioRoll.pct((m.sk.Persuade||0)+distrust(m));if(o.ok){await say('',RLT('RE-TOLL-TALK'));return 'none'}const d=Math.min(r.purse,2*n);r.purse-=d;await say('',`He doesn't like your tone. You pay double: ${d} gr.`);return 'none'}
  L.extra++;await say('',RLT('RE-TOLL-ROUND'));return 'none'}
 if(kind==='refugee'){const c=await evAsk(RLT('RE-REFUGEE-1'),[{label:'Give 2 rations',dis:r.rations<2},'Pass by',`Rob them  ${crimeMark(busy==='busy'?'busy':'seen')}`]);
  if(c===2){const g=StudioRoll.die(6);r.purse+=g;await say('',`They don't fight. ${g} gr, and the youngest's shoes.`);await crime(busy==='busy'?'busy':'seen','Robbing refugees');await favor('outlaws',1);return 'none'}
  if(c===0&&r.rations>=2){r.rations-=2;await say('',RLT('RE-REFUGEE-GIVE'));for(const m of alive().filter(m=>m.mot.includes('Protect the innocent'))){const s=StudioRoll.die(4);m.san=Math.min(m.msan,m.san+s);await say('',`${m.name} needed that. +${s} SAN.`)}applySan();return 'none'}
  await say('',RLT('RE-REFUGEE-PASS'));return 'none'}
 if(kind==='wound'){const m=best('First Aid');const c=await evAsk(RLT('RE-WOUND-1'),[`Help (First Aid · ${odds(m,'First Aid')})`,'Pass by',`Rob him  ${crimeMark(busy==='busy'?'busy':'seen')}`]);
  if(c===2){const g=StudioRoll.die(6)+StudioRoll.die(6);r.purse+=g;await say('',`He has ${g} gr on him. He watches you take it.`);await crime(busy==='busy'?'busy':'seen','Robbing a wounded man');await favor('outlaws',1);return 'none'}
  if(c===1)return 'none';
  await woundHelp(m);return 'none'}
 return null}
async function roadFightTown(foes){const res=await battle(foes,{bg:'dusk'});if(res==='lose'){await wipe();return 'end'}((G.lastStats||{}).killed||[]).forEach(n=>{if(n==='Man-at-arms')offense('lord')});saveRun();return null}
// a fight inside a town is a crime with the town penalty (the Hue and cry's fights, and the lord's men)
async function townFight(foes,who){const res=await battle(foes,{bg:'dusk'});if(res==='lose'){await wipe();return 'lose'}
 ((G.lastStats||{}).killed||[]).forEach(n=>{if(n==='Man-at-arms')offense('lord')});await crime('town','A fight in the street');return res}
// Wanted: the reeve turns up for one scene at the next town's door: Settle, Lean on them (Persuade 75%) or a fight
async function reeveScene(k){const r=G.run;r.reeveScene=0;const P=best('Persuade');
 await say('REEVE',RLT('VO-REEVE-1'));
 const rows=[`Settle (blood-money ${[0,15,30,45][r.hue]} gr)`,...((P.sk.Persuade||0)>=75?[`Lean on them (Persuade · ${odds(P,'Persuade')})`]:[]),'Fight his men'];
 const c=await ask('REEVE','Well?',rows);
 if(c===0&&r.purse>=[0,15,30,45][r.hue]){r.purse-=[0,15,30,45][r.hue];await hueDown();return}
 if(rows[c]&&rows[c].startsWith('Lean')&&StudioRoll.pct(P.sk.Persuade).ok){await say('','He thinks about it and finds somewhere else to be.');return}
 await townFight([foe('manatarms'),foe('manatarms')],'The reeve\'s men')}
