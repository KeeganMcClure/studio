// Black Lantern · engine.js
// Game engine: map walking, dialog and menus, sanity, battle, Big Hat scenes, saves, pause, input. Exposes window.BLG.
// Shared by every case. Case content (maps, enemies, scripts, text) lives in cases/<case>.js.
// Loaded as a plain script (no wrapper) so case files can call say, ask, battle, clue, checkpoint and the rest.
const B=window.BL;
const $=s=>document.querySelector(s);
const scr=$('#screen'),gEl=$('#game'),cv=$('#gcv'),cx=cv.getContext('2d');
const dhost=$('#gdlg'),menuEl=$('#gmenu'),hud=$('#ghud'),ban=$('#gban'),fadeEl=$('#gfade');
const {rnd,pick,esc,store,profOf,derived,skillVal,SKIN,HAIRC,OUTC}=B;
const roll=(n,s,b=0)=>{let t=b;for(let i=0;i<n;i++)t+=1+rnd(s);return t};
const dice=s=>{s=String(s);if(/^\d+$/.test(s))return +s;const m=s.match(/(\d+)d(\d+)/);return roll(+m[1],+m[2])};
const d100=()=>1+rnd(100);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
let VW=240,VH=160;
let G={active:false},Bt=null,party=[],raf=0,dlg=null,menu=null,held=[];
// Who leads: a seat index into party (seat order never changes). Spec 002: Select and Make lead move it (party-menu.js).
const lead=()=>party[G.lead|0]||party[0];
const squad=()=>party.filter(m=>m!==lead());
const DIRS=StudioMove.DIRS;  // walking, the camera and the canvas fit are shared: engine/move.js

// Battle moves, items and enemy cards: battle.js (spec 006 part B), strings.js (BLS.MOVES) and each case.
const BLOCK=new Set('TCB#DLlPHFSVKkYyNpGWIOX'.split(''));

// ================= HELPERS =================
const fmt=t=>t.replace(/\{code\}/g,lead().a.code||((lead().a.name||'').split(' ').pop()||'?').toUpperCase()).replace(/\{first\}/g,lead().name);
// Weapon from the profession (Bible: Starting kit; dice from Combat numbers); STR bonus for melee (field.js strBonus).
function weaponFor(a){const p=profOf(a),W=B.WEAP[(p&&p.weapon)||'handgun']||B.WEAP.handgun;
 return{name:W.name,skill:clamp(skillVal(a,W.skill)+(W.hit||0),5,99),dmg:W.dmg,bonus:(W.plus||0)+(W.melee||W.thrown?strBonus(a.stats.STR):0),verb:W.verb}}
function member(a){const d=derived(a),c=a.cur||{};return{a,name:(a.name||'Agent').split(' ')[0].slice(0,9)||'Agent',hp:d.HP,mhp:d.HP,wp:d.WP,mwp:d.WP,san:c.san??d.SAN,msan:d.SAN,san0:c.san??d.SAN,bp:d.BP,dis:c.dis||null,dex:a.stats.DEX,w:weaponFor(a),ko:false,stun:0}}

// ================= SPRITES =================
// Maps and townsfolk are drawn by each case's own art (spec 005: Still Harvest's is cases/still-harvest-art.js, on the Shared Shelf).
// Agents use agent-sprite.js on the map and agent-back.js in battle; enemies' battle sprites come from each case (spec 006 B3).

// ================= MAPS =================
const mk=(w,h,f)=>Array.from({length:h},()=>Array(w).fill(f));
const rect=(g,x,y,w,h,c)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(g[j]&&g[j][i]!==undefined)g[j][i]=c};
async function stepBack(){const [dx,dy]=DIRS[G.dir];if(passable(G.x+dx,G.y+dy)){G.x+=dx;G.y+=dy;G.px=G.x*16;G.py=G.y*16}}

function mulberry(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}

// ================= DIALOG / MENU =================
// Lantern Bust box (engine/dialog.js, copied unchanged from the Asset Library). `box` holds what the box shows;
// drawBox() runs every frame and redraws the box only when something visible changed.
let box=null,boxKey='';
const PORTRAITS={'BIG HAT':(c,f,sh)=>drawBigHatPortrait(c,sh,f)}; // speaker name -> (ctx, frame, shouting) 64 x 64
// a case's own speakers (its townsfolk) come from its registerCase({portraits: name -> (ctx, frame)}); signs and narration have none
// XPOR: faces set while a scene plays (home.js: the agent and their Bonds, spec 008)
const XPOR={};
function portraitOf(name){if(!name)return null;if(PORTRAITS[name])return PORTRAITS[name];if(XPOR[name])return XPOR[name];const c=caseById(G.case);return c&&c.portraits&&c.portraits(name)||null}
function say(name,text,o={}){
 return new Promise(res=>{
  if(dlg)clearTimeout(dlg.to);
  text=fmt(text);logLine(name,text);
  if(o.auto&&Bt&&fastOn())o.auto=Math.round(o.auto*.5);
  dlg={res,text,done:false,keep:o.keep,auto:o.auto};
  box={name:name||'',text,typed:0,more:false};
  if(o.instant||o.keep&&o.instant!==false&&Bt){finishType();return}
  typeNext(dlg);
 });
}
// typewriter at the Library's timing: one letter per letterMs, longer stops after . ! ? and , ; :
function typeNext(d){
 if(dlg!==d||d.done)return;
 box.typed++;if(box.typed>=d.text.length){finishType();return}
 const T=BLD.TIMING,ch=d.text[box.typed-1],nx=d.text[box.typed];
 d.to=setTimeout(()=>typeNext(d),T.letterMs+(/[.!?]/.test(ch)&&!/[.!?]/.test(nx)?T.stopMs:/[,;:]/.test(ch)?T.commaMs:0));
}
function finishType(){const d=dlg;clearTimeout(d.to);d.done=true;box.typed=d.text.length;
 if(d.keep){dlg=null;d.res()}else{box.more=true;if(d.auto)d.to=setTimeout(()=>{if(dlg===d)closeDlg()},d.auto)}}
function closeDlg(){const d=dlg;dlg=null;clearTimeout(d.to);box=null;d.res()}
function hideTB(){box=null}
function drawBox(){
 if(!box){if(boxKey){dhost.replaceChildren();boxKey=''}return}
 const T=BLD.TIMING,now=performance.now(),n=Math.floor(now/T.flapMs);
 // Spec 013 (ui.md, Dialog box): a speaker drawn large in the scene gets the name tab only. Inside his back room,
 // BIG HAT's lines show no portrait; the scene's bust takes his mouth frame and shout face from here (G.hatF).
 const typing=box.typed<box.text.length,face=portraitOf(box.name),inScene=box.name==='BIG HAT'&&hatOnScreen(),por=inScene?null:face,sh=!!(G.shoutPor&&face);
 // mouth: bursts of open/shut while the line types, then shut; shout face: its counter runs while typing, then holds
 if(typing)box.n=n;const p=n%(T.burst+T.rest),f=sh?(box.n||0):(typing&&p<T.burst&&p%2===0?1:0);
 G.hatF=inScene?{f,sh}:null;
 const arrow=box.more&&Math.floor(now/T.moreBlinkMs)%2===0;
 const key=[box.name,box.typed,box.text,box.choices?box.choices.join('|')+'#'+box.sel+'#'+(box.dis||[]).join(''):'',arrow,por?f+':'+sh:'',gEl.clientWidth,inScene].join('~');
 if(key===boxKey)return;boxKey=key;
 const b=BLD.render(dhost,{name:box.name,narrate:!box.name,text:box.text,typed:box.choices?null:box.typed,more:arrow,choices:box.choices,sel:box.sel,
  portrait:por&&(c=>por(c,f,sh)),scale:2});
 // long choice lists scroll inside the box so the box never pushes the portrait off the screen
 const ul=b.querySelector('.bld-c');
 if(ul){const bust=b.querySelector('.bld-bust'),top=bust?bust.offsetHeight:b.querySelector('.bld-tab')?18:0;let room=gEl.clientHeight-top-(b.offsetHeight-ul.offsetHeight)-10;
  // a greyed choice (spec 013: a question already asked) stays in the list but can't be picked
  if(box.dis)[...ul.children].forEach((li,i)=>{if(box.dis[i])li.classList.add('dis')});
  // in Big Hat's back room the list stops above his chin, so his face stays in view (spec 013); it scrolls instead
  if(hatOnScreen()&&G.hatChin)room=Math.min(room,gEl.clientHeight*(1-G.hatChin/VH)-top-(b.offsetHeight-ul.offsetHeight)-2);
  ul.style.maxHeight=Math.max(60,room)+'px';const on=ul.querySelector('.on');
  if(on){if(on.offsetTop<ul.scrollTop)ul.scrollTop=on.offsetTop;else if(on.offsetTop+on.offsetHeight>ul.scrollTop+ul.clientHeight)ul.scrollTop=on.offsetTop+on.offsetHeight-ul.clientHeight}}
 posMenu();
}
function renderMenu(){const m=menu;if(!m)return;
 if(m.inBox){if(box){box.choices=m.items.map(it=>typeof it==='string'?it:it.label);box.dis=m.items.some(it=>it&&it.dis)?m.items.map(it=>it&&it.dis?1:0):null;box.sel=m.sel;box.more=false}if(m.onSel)m.onSel(m.sel);return}
 menuEl.hidden=false;
 menuEl.innerHTML=(m.title?`<div class="mt">${esc(m.title)}</div>`:'')+m.items.map((it,i)=>{const o=typeof it==='string'?{label:it}:it;return`<div class="gi ${i===m.sel?'on':''} ${o.dis?'dis':''}" data-i="${i}"><span class="gc">${i===m.sel?'▶':''}</span>${esc(o.label)}</div>`}).join('')+(m.desc&&m.desc[m.sel]?`<div class="md">${esc(m.desc[m.sel])}</div>`:'');
 if(m.onSel)m.onSel(m.sel);posMenu();const on=menuEl.querySelector('.gi.on');if(on)on.scrollIntoView({block:'nearest'})}
function posMenu(){if(menuEl.hidden)return;let b=6;const bx=dhost.querySelector('.bld'),tab=bx&&bx.querySelector('.bld-tab');
 if(G.mode==='battle'&&!hud.hidden)b=hud.offsetHeight+8;else if(bx)b=bx.offsetHeight+(tab?tab.offsetHeight:0)+10;menuEl.style.bottom=b+'px'}
function choose(items,o={}){const first=Math.max(0,items.findIndex(it=>!(it&&it.dis)));return new Promise(res=>{menu={items,sel:o.sel??first,res,cancel:o.cancel,title:o.title,desc:o.desc,onSel:o.onSel,inBox:o.inBox};renderMenu()})}
function closeMenu(v){const m=menu;menu=null;menuEl.hidden=true;if(m.inBox&&box){box.choices=null;box.dis=null}if(Bt)Bt.hover=-1;m.res(v)}
async function ask(name,text,opts){await say(name,text,{keep:true,instant:false});const r=await choose(opts,{cancel:true,inBox:true});hideTB();return r<0?opts.length-1:r}
function banner(t,ms=2200){ban.textContent=t;ban.hidden=false;clearTimeout(banner.t);banner.t=setTimeout(()=>ban.hidden=true,ms)}
function fade(on){fadeEl.style.opacity=on?1:0;return sleep(340)}
async function run(fn){G.busy=(G.busy||0)+1;try{await fn()}catch(e){console.error(e)}finally{G.busy=Math.max(0,(G.busy||0)-1)}}  // never below 0: a case's ending opens the board, which resets it
function clue(id,text){if(G.clues.some(c=>c.id===id))return;G.clues.push({id,text});banner('NOTEBOOK UPDATED')}

// ================= SANITY =================
// The low-SAN look (spec 005) follows the lead's SAN every frame in drawWorld, and the lead card shows the number,
// so there is nothing to set here any more; callers still call it after a SAN change.
function applySan(){}
// SAN rolls, bracing, Steadying, Breaking Points and disorders are field.js (spec 006, A4); sanCheck(spec, label) still works there.

// ================= BATTLE =================
// The battle is battle.js (spec 006 part B); the studio's battle frame is engine/battle.js.

// ================= WORLD =================
function passable(x,y){const M=G.M;if(x<0||y<0||x>=M.w||y>=M.h)return false;if(BLOCK.has(M.g[y][x]))return false;if(M.npcs.some(n=>(!n.on||n.on())&&n.x===x&&n.y===y))return false;if(roamAt(x,y))return false;return true}
function goMap(name,x,y,dir,o={}){hud.hidden=true;gEl.classList.remove('battle');if(G.fs&&G.map&&G.map!==name&&!o.restore)G.fs.area=1;G.map=name;G.M=MAPS[name]();StudioMove.place(G,x,y,dir);
 banner(G.M.name);}
function update(){
 if(G.mode!=='world')return;
 if(!G.busy&&!dlg&&!menu&&!PM&&!SCR&&!G.mv&&fieldDue()){held=[];run(fieldTick);return}  // area-change ticks (field.js)
 if(!G.busy&&!dlg&&!menu&&!PM&&!SCR)roamTick();  // the danger zone's roamers walk (field.js, spec 006 C4)
 StudioMove.update(G,StudioMove.last(held),{passable,busy:()=>G.busy||dlg||menu||PM||SCR,arrive:()=>run(onStep)});
}
async function onStep(){const M=G.M,k=G.x+','+G.y;if(M.warps&&M.warps[k]){held=[];return M.warps[k]()}if(M.onStep)await M.onStep()}
async function interact(){
 const [tx,ty]=StudioMove.ahead(G),M=G.M,k=tx+','+ty;
 const n=M.npcs.find(n=>(!n.on||n.on())&&n.x===tx&&n.y===ty);
 if(n){n.dir={up:'down',down:'up',left:'right',right:'left'}[G.dir];held=[];await n.talk(n);G.fs.talked[n.id]=G.clues.length;return}
 const r=roamAt(tx,ty);if(r){held=[];await roamMenu(r);return}  // a roamer: fight, sneak or the rest (field.js)
 // a hotspot is a script (a function) or data that opens the lead's options (field.js, spec 006 A2)
 if(M.O[k]){held=[];const h=M.O[k];if(typeof h==='function')await h();else await hotspot(h,k);return}
 const ch=M.g[ty]&&M.g[ty][tx];if(ch&&TILEDESC[ch]){held=[];await say('',TILEDESC[ch])}
}
function cam(){return StudioMove.camera(G,G.M.w,G.M.h,VW,VH)}
// ================= MAP DRAWING AND LIGHT (spec 005) =================
// Each map names its art (M.art: paint, props, folk) and its light: 'day', 'dusk' or 'night' (Bible, Art, Light and mood).
// Day: the plain palette. Dusk: the Shared Shelf's dusk (shared-effects-dusk-v1), no lantern. Night: dark except the pools
// around the lead's lantern, the lamps and the boss; lit windows and carved pumpkins glow without lighting the ground.
// Below 40 SAN on the lead, the picture sours toward SAN pink and cyan, fading over half a second, and at night the lantern's
// circle is a third smaller and the lamps' a little smaller (the approved night and low-SAN mockup). The light pass is the
// studio's engine/light.js. The lead card, the NIGHT tag and the A bubble go on top and never sour.
const LOOK={dark:'#0a0812',alpha:.9,warm:'#d6a43a',pink:'#ff4fa3',cyan:'#3ff0e8',lowSan:40,lantern:[62,40],lamp:[34,26],boss:46};
const sourFade={};
function drawWorld(){
 const M=G.M,[camx,camy]=cam(),now=performance.now(),art=M.art,L=lead(),night=M.light==='night';
 if(!M.props)M.props=art.props(M);
 const st=art.paint(M);
 cx.fillStyle='#0a0710';cx.fillRect(0,0,VW,VH);cx.drawImage(st.c,-camx,-camy);
 // trail dots on the ground: On guard's roamer beats, Pathfinder's safe route, Track's drag marks (field.js)
 const post=[];  // drawn over the light, so they read in the dark: trail dots, threat skulls, the "!"
 const tr=G.fs&&G.fs.trail&&G.fs.trail[G.map];if(tr)post.push(()=>Object.entries(tr).forEach(([kind,pts])=>(pts||[]).forEach(([x,y],i)=>{cx.fillStyle=kind==='beat'?'rgba(255,79,163,.7)':'rgba(214,164,58,.75)';if((i+Math.floor(now/300))%3)cx.fillRect(x*16+7-camx,y*16+7-camy,2,2)})));
 const spr=[],roamLit=[],moving=!!G.mv,fr=StudioMove.walkFrame(G),midX=camx+VW/2,midY=camy+VH/2;
 // a piece with a canopy (a tree) turns see-through while the lead stands behind it
 const me=[G.px+1,G.py-15,14,28];
 M.props.forEach(p=>{if(Math.abs(p.x-midX)<VW/2+60&&p.y>camy-8&&p.top<camy+VH+8)spr.push({y:p.y,f:()=>{const see=p.canopy&&G.py+13<p.y&&overlaps(me,p.canopy);
  if(see)cx.globalAlpha=.45;p.draw(cx,-camx,-camy);cx.globalAlpha=1}})});
 // townsfolk stand still; they turn to face the lead when spoken to, and blink now and then
 M.npcs.forEach((n,i)=>{if(n.on&&!n.on())return;const fx=n.x*16+8-camx,fy=n.y*16+13-camy,bl=(now+i*1100)%4100<150?1:0;
  spr.push({y:n.y*16+13,f:()=>{const v=art.folk(n.id,n.dir,bl);cx.fillStyle='rgba(0,0,0,.3)';cx.fillRect(Math.round(fx-5),Math.round(fy-1),10,2);cx.drawImage(v.c,Math.round(fx-v.ax),Math.round(fy-v.ay))}})});
 // Only the lead walks the map (Bible, Art, Maps). Agent sprites from agent-sprite.js; lantern at night only; a blink every few seconds.
 const blink=!moving&&(now%3400)<150?1:0;
 spr.push({y:G.py+13,f:()=>BLA.draw(cx,L.a,G.px+8-camx,G.py+13-camy,G.dir,fr,blink,night)});
 // roamers (spec 006 C4): their battle sprite, small, with threat skulls over it and a "!" when they've seen the lead
 if(M.roamers){const c=caseById(G.case);M.roamers.forEach(r=>{const s=roamSt(r);if(!roamLive(r,s))return;const img=c&&c.sprite&&c.sprite(r.sprite||r.types[0],Math.floor(now/500)%2);if(!img)return;
  const k=Math.min(1,22/img.height,24/img.width),w=Math.round(img.width*k),h=Math.round(img.height*k),fx=s.w.x*16+8-camx,fy=s.w.y*16+15-camy;
  spr.push({y:s.w.y*16+14,f:()=>{if(s.held||s.passed)cx.globalAlpha=.55;cx.fillStyle='rgba(0,0,0,.3)';cx.fillRect(Math.round(fx-6),Math.round(fy-1),12,2);cx.drawImage(img,Math.round(fx-w/2),Math.round(fy-h),w,h);cx.globalAlpha=1}});
  roamLit.push([fx,fy-h/2,20]);
  post.push(()=>{const n=r.skulls||1;for(let i=0;i<n;i++)icoSkull(Math.round(fx-n*4+i*8),Math.round(fy-h-9),PC.cream);
   if(s.st==='alert'||s.st==='chase')pT('!',Math.round(fx+w/2-1),Math.round(fy-h-12),PC.pink,13)})})}
 if(M.boss){const c=caseById(G.case),img=c&&c.sprite&&c.sprite('gleaner',Math.floor(now/400)%2);if(img)spr.push({y:11*16+14,f:()=>cx.drawImage(img,13*16+8-camx-img.width/2,11*16+40-camy-img.height)})}
 spr.sort((a,b)=>a.y-b.y).forEach(s=>s.f());
 // light
 const k=StudioLight.fade(sourFade,L.san<LOOK.lowSan,now),glows=[],pools=[];
 st.glows.forEach(([x,y,r,a])=>glows.push([x-camx,y-camy,r,a]));
 M.props.forEach(p=>p.lights.forEach(([x,y,r,a,pool])=>(pool?pools:glows).push([x-camx,y-camy,r,a])));
 if(M.light==='dusk')SHELF.dusk(cx,glows.concat(pools),now);
 else if(night){
  const lamp=StudioLight.mix(LOOK.lamp[0],LOOK.lamp[1],k),ring=[[G.px+8-camx,G.py+6-camy,StudioLight.mix(LOOK.lantern[0],LOOK.lantern[1],k)*(G.fs&&G.fs.flareMap===G.map?1.6:1)]];
  pools.forEach(([x,y])=>ring.push([x,y,lamp]));roamLit.forEach(p=>ring.push(p));  // roamers walk in plain sight
  if(M.boss)ring.push([13*16+8-camx,11*16-38-camy,LOOK.boss+Math.random()*4]);
  StudioLight.night(cx,{dark:LOOK.dark,alpha:LOOK.alpha,warm:LOOK.warm,pools:ring,glows:glows.map(([x,y,r,a])=>[x,y,r*.7,a*.6])});
 }
 if(k>0)StudioLight.sour(cx,k,{pink:LOOK.pink,cyan:LOOK.cyan});
 post.forEach(f=>f());
 drawMapHud(camx,camy,night);
}
// ---- the lead card, the NIGHT tag and the A bubble (the approved On Map mockup) ----
const MH=BLS.MAPHUD;
const headCache=new Map();
// the lead's small face: the head of their own map sprite, so it matches who walks the map
function headOf(a){const k=JSON.stringify([a.prof,a.look]);let c=headCache.get(k);if(c)return c;
 const v=BLA.sprite(a,'down',0,0,false);c=document.createElement('canvas');c.width=c.height=16;c.getContext('2d').drawImage(v.c,v.ax-8,v.ay-27,16,16,0,0,16,16);headCache.set(k,c);return c}
function overlaps(a,b){return a[0]<b[0]+b[2]&&b[0]<a[0]+a[2]&&a[1]<b[1]+b[3]&&b[1]<a[1]+a[3]}
function drawMapHud(camx,camy,night){
 if(G.noHud)return;  // the still behind a battle (battle.js) is the map alone
 if(box||menu||!menuEl.hidden)return;  // hidden while the dialog box or a menu is up
 const L=lead(),me=[G.px+8-camx-8,G.py+13-camy-28,16,30];
 // card: face, name, HP numbers and bar, WP · SAN (SAN pink below 40)
 const cw=94,ch=30;let x=3,y=3;if(overlaps(me,[x,y,cw,ch]))y=VH-ch-3;  // never over the lead
 pBox(x,y,cw,ch,PC.navy,PC.cream);pBox(x+3,y+3,20,20,PC.plum,PC.mus);cx.drawImage(headOf(L.a),x+5,y+5);
 const hp=`${L.hp}/${L.mhp}`;pT(pFit(L.name.toUpperCase(),cw-30-pW(hp,13),13),x+26,y+1,PC.gold,13);pT(hp,x+cw-4-pW(hp,13),y+1,PC.cream,13);
 pT(MH.hp,x+26,y+9,PC.lav,11);pBar(x+26+pW(MH.hp,11)+2,y+12,cw-32-pW(MH.hp,11),L.hp/L.mhp,PC.green);
 const wp=`${MH.wp} ${L.wp} · `;pT(wp,x+26,y+18,PC.lav,12);pT(`${MH.san} ${L.san}`,x+26+pW(wp,12),y+18,L.san<LOOK.lowSan?PC.pink:PC.lav,12);
 drawLeadIcons(x,y,cw,ch);  // status icons and the low-health pulse (field.js)
 // NIGHT tag, top right, night maps only
 if(night){const tw=pW(MH.night,13)+19,th=14;let tx=VW-tw-3,ty=3;if(overlaps(me,[tx,ty,tw,th]))ty=VH-th-3;
  pBox(tx,ty,tw,th,PC.navy,PC.cream);
  [[2,0,3],[1,1,2],[0,2,2],[0,3,2],[0,4,2],[1,5,2],[2,6,3]].forEach(([a,b,w])=>pR(tx+5+a,ty+3+b,w,1,PC.cream));
  pT(MH.night,tx+14,ty+1,PC.cream,13)}
 // A bubble over the person or thing the lead faces, only when A would use it now (hidden hotspots stay hidden)
 if(G.busy||G.mv||G.mode!=='world')return;
 const [ax,ay]=StudioMove.ahead(G),M=G.M,n=M.npcs.find(n=>(!n.on||n.on())&&n.x===ax&&n.y===ay);let word,bx,top,bot;
 let dim=false,out=false;
 if(n){word=MH.talk;bx=n.x*16+8;bot=n.y*16+14;top=bot-(n.id==='pip'?24:28);out=talkedOut(n)}
 else if(M.O[ax+','+ay]){word=MH.look;dim=hotUsed(M.O[ax+','+ay],ax+','+ay);const p=M.props.find(p=>(p.tx===ax||p.tx===ax-1)&&(p.ty===ay||p.ty===ay-1)&&M.O[p.tx+','+p.ty]);
  bx=p?p.x:ax*16+8;top=p?p.top:ay*16;bot=p?p.y:ay*16+16}
 else return;
 // talked out: a small "…" instead of the speech bubble; a used hotspot's bubble turns grey (Quality of life)
 if(out)word='…';const w=out?pW(word,12)+8:pW(word,12)+17,h=12,below=G.dir==='down';bx=clamp(Math.round(bx-camx-w/2),2,VW-w-2);
 let by=below?bot-camy+5:top-camy-h-5;by=clamp(Math.round(by),2,VH-h-2);
 const px=clamp(Math.round((n?n.x*16+8:(bx+camx+w/2))-camx),bx+4,bx+w-4);
 const ln=dim?PC.dim:PC.cream;pBox(bx,by,w,h,PC.navy,ln);
 if(below){pR(px-2,by-2,5,1,ln);pR(px-1,by-3,3,1,ln);pR(px,by-4,1,1,ln)}else{pR(px-2,by+h,5,1,ln);pR(px-1,by+h+1,3,1,ln);pR(px,by+h+2,1,1,ln)}
 if(out){pT(word,bx+4,by,PC.lav,12);return}
 cx.fillStyle=dim?PC.dim:PC.rust;cx.beginPath();cx.arc(bx+7,by+6,4.5,0,7);cx.fill();pT(MH.a,bx+5,by+1,PC.chipInk,11);
 pT(word,bx+13,by,dim?PC.dim:PC.cream,12);
}
// ---- BIG HAT: the handler. Back-room scene reused before and after every mission. ----
// Spec 013: he is his approved portrait (drawBigHatPortrait below) drawn at double size, a 128 x 128 bust behind the desk,
// so the scene and the box can never drift apart. The old small desk sprite is gone. The room is the spec 013 mockup's.
// Big Hat is on screen when the loop draws this scene (not the board, a battle, a menu screen, the party or the map).
const hatOnScreen=()=>G.scene==='bighat'&&G.mode!=='world'&&!CB&&!Bt&&!SCR&&!PM;
let hatCv=null;
function drawOffice(){
 const now=performance.now(),t=now/1000,sh=G.shout&&now<G.shout;
 // the face: his line's mouth frame and shout face come from drawBox (G.hatF); between lines, calm and shut
 const hf=G.hatF&&box&&box.name==='BIG HAT'?G.hatF:{f:0,sh:false};
 const fy=Math.round(VH*(VH>=300?.48:.43)),mid=VW/2,dx=mid-85,dy=fy-128;  // fy: the desk top, higher on short screens so the question list fits under his chin. dx, dy: the mockup's room (170 wide, desk at 128) moved onto this screen
 G.hatChin=fy-10;  // the question list stops above his chin (drawBox)
 cx.save();if(sh)cx.translate(rnd(5)-2,rnd(3)-1);
 const r=(x,y,w,h,c)=>{cx.fillStyle=c;cx.fillRect(x+dx,y+dy,w,h)},R=(x,y,w,h,c)=>{cx.fillStyle=c;cx.fillRect(x,y,w,h)};
 // wall, wainscot and floor, edge to edge
 R(-4,-4,VW+8,VH+8,'#2a2030');for(let x=(dx%12+12)%12;x<VW;x+=12)R(x,0,1,dy+150,'#241a2a');
 R(-4,dy+112,VW+8,3,'#3a2c3c');R(-4,dy+115,VW+8,35,'#221a28');for(let x=(dx+4)%10;x<VW;x+=10)R(x,dy+115,1,35,'#1c1622');
 R(-4,dy+150,VW+8,VH,'#1b1f33');for(let y=dy+156;y<VH;y+=8)R(0,y,VW,1,'#161a2c');for(let y=dy+152,i=0;y<VH;y+=8,i++)R((i*23)%60+dx,y,1,8,'#161a2c');
 // the flickering tube's pool of light
 const on=Math.random()>.03;
 if(on){cx.fillStyle='rgba(220,240,230,.06)';cx.beginPath();cx.moveTo(60+dx,70+dy);cx.lineTo(130+dx,70+dy);cx.lineTo(160+dx,150+dy);cx.lineTo(30+dx,150+dy);cx.fill()}
 // door with a little lit window
 r(10,62,30,88,'#3a2a34');r(11,63,28,86,'#45333e');r(16,70,18,14,'#d9772b');r(17,71,16,12,'#e8a050');r(24,71,1,12,'#45333e');r(34,108,3,3,'#c0c0c8');
 r(12,92,26,7,'#e8dcc0');for(let x=14;x<36;x+=3)r(x,94,2,3,'#2a2030');
 // corkboard with the scarecrow photo, off to his right so the brim never covers it
 r(98,58,64,44,'#5a3a1c');r(100,60,60,40,'#9a6a3a');for(let i=0;i<40;i++)r(100+(i*37)%60,60+(i*17)%40,1,1,'#84582e');
 r(106,64,14,18,'#e8dcc0');r(107,65,12,14,'#1b1f33');r(110,66,6,3,'#6e4630');r(109,69,8,1,'#6e4630');r(111,70,4,4,'#d6a43a');r(112,71,1,1,'#1b1f33');r(114,71,1,1,'#1b1f33');r(108,75,10,1,'#8a6a3a');r(112,74,2,5,'#6e4a2a');r(112,63,2,2,'#b5532e');
 r(126,66,18,12,'#d8cdb4');for(let y=68;y<77;y+=2)r(128,y,13,1,'#8a8070');r(134,64,2,2,'#b5532e');
 r(146,72,10,14,'#e8dcc0');r(148,74,6,6,'#7a6a8a');r(150,71,2,2,'#b5532e');
 r(108,86,22,10,'#d6a43a');r(110,88,16,1,'#6e4a2a');r(110,91,12,1,'#6e4a2a');r(118,84,2,2,'#b5532e');
 cx.strokeStyle='#b5532e';cx.lineWidth=1;cx.beginPath();cx.moveTo(113.5+dx,64+dy);cx.lineTo(135+dx,65+dy);cx.lineTo(151+dx,72+dy);cx.moveTo(135+dx,65+dy);cx.lineTo(119+dx,85+dy);cx.stroke();
 // Big Hat: the portrait without its backdrop, doubled. The toothpick switches sides every few seconds;
 // two pinprick glints show in the brim shadow, rarely (Cast).
 if(!hatCv){hatCv=document.createElement('canvas');hatCv.width=hatCv.height=64}
 const hc=hatCv.getContext('2d');hc.clearRect(0,0,64,64);drawBigHatPortrait(hc,hf.sh,hf.f,true,Math.floor(t/4)%2===1);
 const bx=mid-64,by=fy-112;cx.imageSmoothingEnabled=false;cx.drawImage(hatCv,bx,by,128,128);
 if(!hf.sh&&t%7>6.6){R(bx+54,by+66,1,1,'#ffe9b0');R(bx+73,by+66,1,1,'#ffe9b0')}
 // the desk in front of him covers his lower vest; a box of crullers and a styrofoam cup on top
 r(20,128,130,6,'#7a5234');r(20,128,130,1,'#9a6c44');r(22,134,126,22,'#5a3a24');r(22,134,126,1,'#3e2818');r(26,138,30,14,'#4e3220');r(114,138,30,14,'#4e3220');
 r(108,118,34,10,'#e8dcc0');r(108,118,34,2,'#ff9ec8');r(107,116,36,2,'#d8c8b0');
 [[112,121],[121,121],[130,121]].forEach(([x,y])=>{r(x,y,7,4,'#d9772b');r(x+1,y,5,1,'#f0a860');r(x+3,y+1,1,2,'#8a4a1c')});
 r(30,119,7,9,'#d8cdb4');r(37,121,2,4,'#d8cdb4');r(31,119,5,1,'#3a2418');
 // the tube itself, humming, and now and then giving up
 R(dx+62,6,46,3,on?'#e8f0e0':'#4a5048');R(dx+60,5,2,5,'#8a8a94');R(dx+108,5,2,5,'#8a8a94');if(on)R(dx+62,9,46,1,'#a0b0a8');  // pinned to the ceiling
 cx.restore();
 if(sh){cx.fillStyle='rgba(170,0,30,.28)';cx.fillRect(0,0,VW,VH)}
}
// ---- BIG HAT PORTRAIT: 64 x 64, stands on the text box whenever BIG HAT speaks (Art build pass 2, Nov 21, 2026). ----
// Drawing code copied from the Asset Library (bighat.js). Spec 013 adds two options for the scene, which draws this same
// art at double size: noBg leaves out the plain backdrop, and pickL puts the calm face's toothpick in the other corner.
function drawBigHatPortrait(c,shout,frame,noBg,pickL){
  const SK='#c98a62',SS='#a86a46',SD='#7a4a30',MU='#4a2e1c',MH='#6e4630',MS='#341e12',DK='#0c0a10',TP='#e6c98a',TD='#b8955a';
  const H='#7a5a34',HL='#a07a48',HS='#5a4024',HD='#3a2814',HX='#24180c';
  const V='#6b3a22',VL='#8e522e',VS='#4a2616',CR='#d8cdb4',CS='#b0a68e';
  const sh=shout,f=frame;
  const ox=sh?(f%2?1:-1):0,oy=0;
  const r=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x+ox,y+oy,w,h)};
  const px=(a,col)=>a.forEach(p=>r(p[0],p[1],1,1,col));
  // backdrop (plain; the scene shows behind the dialog box)
  if(!noBg){c.fillStyle='#2b2a35';c.fillRect(0,0,64,64);c.fillStyle='#25242e';c.fillRect(0,52,64,12)}
  if(sh){c.fillStyle=f%2?'#e0503a':'#ff7a5a';[[4,8],[7,5],[5,11],[3,14],[56,7],[59,4],[57,11],[60,14],[3,42],[59,43]].forEach(p=>c.fillRect(p[0],p[1],2,1))}
  const open=sh?true:f;
  // vest, shirt, bolo
  r(18,50,28,1,V);r(15,51,34,1,V);r(14,52,36,12,V);
  r(14,52,3,12,VL);r(15,51,3,1,VL);r(46,52,4,12,VS);r(45,51,4,1,VS);
  for(let y=52;y<64;y++){const w=Math.max(2,6-((y-52)>>1));r(32-w-1,y,1,1,VS);r(32+w,y,1,1,VS);r(32-w,y,w*2,1,CR)}
  r(26,49,12,2,CR);r(25,50,3,2,CR);r(36,50,3,2,CR);r(26,51,2,1,CS);r(36,51,2,1,CS);
  r(29,49,1,12,'#1a1210');r(34,49,1,12,'#1a1210');r(29,61,1,2,'#c0c0c8');r(34,61,1,2,'#c0c0c8');
  r(28,54,8,5,'#c0c0c8');r(28,54,8,1,'#e0e0e8');r(29,55,6,3,'#2e9a8a');r(30,55,4,2,'#3fb8a6');r(30,55,1,1,'#9af0e0');r(28,58,8,1,'#8a8a94');
  px([[18,55],[18,58],[18,61],[46,56],[46,59],[46,62]],'#7e4628');
  // neck and face
  r(27,47,11,3,SD);
  const end=sh?51:48;
  for(let y=26;y<=end;y++){let a=22,b=42;if(y===end-2){a=23;b=41}if(y===end-1){a=24;b=40}if(y===end){a=26;b=38}
    r(a,y,b-a+1,1,SK);r(a,y,2,1,SS);r(b-1,y,2,1,SS);if(y>40&&y<end-1){r(a,y,1,1,SD);r(b,y,1,1,SD)}}
  // brim shadow down to the mustache
  r(22,26,21,11,DK);for(let x=22;x<43;x++){r(x,37,1,1,x%2?DK:SD)}for(let x=22;x<43;x+=2)r(x,38,1,1,SD);
  if(!sh){
    // calm: horseshoe mustache, mouth, toothpick, stubble
    r(24,38,17,3,MU);r(25,38,15,1,MH);r(32,38,1,1,MS);px([[27,39],[30,40],[35,40],[38,39]],MS);
    r(23,40,2,4,MU);r(40,40,2,4,MU);r(23,44,1,2,MU);r(41,44,1,2,MU);r(23,40,1,5,MS);r(41,40,1,5,MS);
    if(open){r(28,42,9,3,'#2a0c0a');r(29,42,7,1,'#f0e8d8');r(30,44,5,1,'#a03a32');r(28,45,9,1,'#a85a4a')}
    else{r(27,42,11,1,'#3a1a14');r(28,43,9,1,'#a85a4a')}
    const tp=(x,y,w,col)=>r(pickL?64-x-w:x,y,w,1,col);  // mirrored across his face when pickL
    tp(37,42,1,'#5a3a2a');tp(38,41,2,TP);tp(40,40,2,TP);tp(42,39,1,TP);tp(43,38,1,TD);
    px([[25,46],[27,47],[29,46],[35,46],[37,47],[39,46],[26,44],[38,44],[31,47],[33,47],[30,48],[34,48]],SS);
    r(32,47,1,2,SD);
  }else{
    // shout: flared mustache, wide mouth, flying toothpick
    const m=f%2;
    r(23,37,19,2,MU);r(24,37,17,1,MH);r(18,36,5,1,MU);r(42,36,5,1,MU);r(16,35,3,1,MU);r(46,35,3,1,MU);r(15,34,2,1,MS);r(48,34,2,1,MS);r(32,37,1,1,MS);
    r(26,40,13,m?8:9,'#4a0c0c');r(27,40,11,1,'#f0e8d8');r(27,m?47:48,11,1,'#f0e8d8');r(28,m?45:46,9,2,'#c04a4a');r(29,m?45:46,3,1,'#d86a60');
    r(24,40,2,9,SS);r(39,40,2,9,SS);r(32,50,1,1,SD);
    px([[25,49],[29,50],[35,50],[39,49],[27,50],[37,50]],SS);
    const t=m?0:2;r(47+t,33-t,2,1,TP);r(49+t,32-t,2,1,TP);r(51+t,31-t,1,1,TD);
    r(45,38,1,2,'#ffffff');r(46,40,1,1,'#ffffff');
  }
  // ten-gallon hat: crown, cattleman crease, band with turquoise concho, brim
  r(21,3,9,1,H);r(35,3,9,1,H);r(29,4,7,1,HS);r(30,3,5,1,HD);
  for(let y=4;y<19;y++){const i=y<7?7-y:0;const a=19+i,b=45-i;r(a,y,b-a+1,1,H);r(a,y,3,1,HL);r(b-5,y,4,1,HS);r(b-1,y,2,1,HD)}
  for(let y=5;y<18;y++){r(32,y,1,1,HS);r(31,y,1,1,HL)}
  px([[24,8],[27,11],[36,7],[38,13],[25,15],[40,10],[34,16],[22,12]],HS);px([[26,6],[35,10],[29,14]],HL);
  r(19,18,27,4,HD);r(19,18,27,1,HX);r(19,21,27,1,HX);
  r(28,18,9,4,'#c0c0c8');r(29,19,7,2,'#2e9a8a');r(30,19,4,1,'#3fb8a6');r(30,19,1,1,'#9af0e0');r(28,21,9,1,'#8a8a94');
  [[17,0,2],[18,0,3],[19,0,4],[20,0,6],[21,0,9]].forEach(([y,a,w])=>{r(a,y,w,1,H);r(64-a-w,y,w,1,H)});
  r(0,17,1,4,HL);r(1,17,1,2,HL);r(63,17,1,5,HS);r(62,17,1,2,HD);
  r(9,22,46,1,H);r(0,23,64,3,H);r(3,23,58,1,HL);r(0,25,64,1,HS);
  r(4,26,56,1,HS);r(10,27,44,1,HD);r(16,28,32,1,HX);
  px([[12,24],[20,24],[44,24],[52,24],[6,24],[58,24]],HS);
}
// ---- BIG HAT'S TWO QUESTIONS (spec 013): every case's briefing asks them the same way ----
// topics: the case's four, [{id, label, answer: [line, line], note: 'its INTEL line'}]. Pick one, he answers, and the list
// comes back with it greyed; after two he says "That's two." No questions ends it at once. The picks save on the case's
// state in bl.season (intel: [ids]), so a reload keeps the notes and edges; every briefing asks again from none.
// A save without intel plays as if no questions were asked.
function intelOf(id=G.case){const s=loadSeason(),e=s.cases[id];return e&&Array.isArray(e.intel)?e.intel.filter(k=>typeof k==='string'):[]}
const intelOn=k=>intelOf().includes(k);
function setIntel(ids){const s=loadSeason(),e=s.cases[G.case];if(!e)return;e.intel=ids.slice();store.set(seasonKey(),s)}
async function twoQuestions(topics){
 const W=BLS.BRIEF,got=[];setIntel(got);
 while(got.length<2){
  await say('BIG HAT',W.ask,{keep:true,instant:got.length>0});
  const items=topics.map(t=>({label:t.label,dis:got.includes(t.id)})).concat([W.none]);
  const r=await choose(items,{inBox:true});hideTB();
  const t=topics[r];if(!t){await say('BIG HAT',W.noQ);return got}
  got.push(t.id);setIntel(got);
  for(const l of t.answer)await say('BIG HAT',l);
  banner(W.banner);
 }
 await say('BIG HAT',W.two);return got;
}
async function shout(text){G.shout=performance.now()+750;G.shoutPor=true;try{return await say('BIG HAT',text)}finally{G.shoutPor=false}}
async function bigHatScene(fn){await fade(1);G.mode='scene';G.scene='bighat';await fade(0);await sleep(400);await fn();await fade(1);G.scene=null}
function drawScene(){if(G.scene==='bighat'){drawOffice();if(G.db)dbCard();return}if(G.scene==='funeral')return drawFuneral();if(G.scene==='home')return drawHome();cx.fillStyle='#05040a';cx.fillRect(0,0,VW,VH);const t=performance.now()/1000,fl=.7+.3*Math.sin(t*7)*Math.sin(t*3.1);const x=VW/2,y=VH*.38;const g=cx.createRadialGradient(x,y,2,x,y,44);g.addColorStop(0,`rgba(255,190,80,${.35*fl})`);g.addColorStop(1,'rgba(255,190,80,0)');cx.fillStyle=g;cx.fillRect(x-50,y-50,100,100);const P=(a,b,w,h,c)=>{cx.fillStyle=c;cx.fillRect(x+a,y+b,w,h)};P(-1,-16,2,3,'#3a3460');P(-5,-13,10,2,'#2a2440');P(-6,-11,1,16,'#2a2440');P(5,-11,1,16,'#2a2440');P(-5,-11,10,16,`rgba(255,${180+rnd(20)},80,${fl})`);P(-2,-8,4,9,'#fff6d8');P(-6,5,12,2,'#2a2440')}
// Logic runs at 60 ticks a second on any screen (engine/clock.js); frames with no tick due are skipped.
const clock=StudioClock.make();
function loop(now){if(!G.active)return;const n=clock.ticks(now);if(!n){raf=requestAnimationFrame(loop);return}try{for(let i=0;i<n;i++)update();if(CB)drawBoard();else if(G.mode==='battle'&&Bt)drawBattle();else if(SCR)drawScr();else if(PM)drawParty();else if(G.mode==='world')drawWorld();else drawScene();drawBox()}catch(e){console.error(e)}raf=requestAnimationFrame(loop)}
function fit(){const v=StudioMove.fit(gEl,cv);if(!v)return;VW=v.w;VH=v.h;gEl.style.setProperty('--pu',(64*v.boxW/VW)+'px');boxKey='';posMenu()}
window.addEventListener('resize',()=>{if(G.active)fit()});

async function gameOver(){
 held=[];G.mode='scene';
 const L=lead();
 await say('',L&&L.san<=0?'Agent {code} walks into the corn, smiling, and does not come back.':'Agent {code} doesn\'t get up. The lantern goes out.');
 const r=await ask('','The file stays open.',['Retry from checkpoint','Quit to title']);
 if(r===0){await fade(1);restore(G.cp);await fade(0)}else quit();
}

// ================= SAVE / FLOW =================
// fs: the field state (field.js): backpack, used hotspots, who was talked to, perks used, the Log, recruits due and more
function snap(){return JSON.stringify({case:G.case,map:G.map,x:G.x,y:G.y,dir:G.dir,party,lead:G.lead|0,flags:G.flags,clues:G.clues,fs:G.fs,fights:G.fights,enc:G.enc,rescued:G.rescued,db:G.db||null})}  // db: the debrief step reached (spec 007)
function checkpoint(){G.cp=snap();store.set(B.key('game'),G.cp)}
function restore(s){const o=JSON.parse(s);G.case=o.case||(CASES[0]&&CASES[0].id);party=o.party;G.lead=o.lead>=0&&o.lead<party.length?o.lead|0:0;G.flags=o.flags;G.clues=o.clues;G.fights=o.fights;G.enc=o.enc;G.rescued=o.rescued||0;
 fieldRestore(o);G.db=o.db||null;
 // paused mid-debrief (spec 007): back in Big Hat's back room at the step reached; the map stays as it was
 if(G.db){G.map=o.map;G.mode='scene';G.scene='bighat';hud.hidden=true;return}
 G.mode='world';goMap(o.map,o.x,o.y,o.dir,{restore:true});applySan()}
function enter(){G.active=true;scr.classList.add('gaming');fit();cancelAnimationFrame(raf);clock.reset();raf=requestAnimationFrame(loop)}
function leave(){G.active=false;PM=null;CB=null;SCR=null;cancelAnimationFrame(raf);scr.classList.remove('gaming','glitch');scr.style.filter='';$('#vig').style.opacity=0;box=null;boxKey='';dhost.replaceChildren();menuEl.hidden=true;hud.hidden=true;if(dlg)clearTimeout(dlg.to);dlg=null;menu=null;Bt=null;held=[]}
function quit(){checkpoint();leave();B.goto('title');B.render()}
// The end of a case (spec 004, step 5; spec 007): the case is stamped closed in bl.season and the case board opens with
// the CLOSED stamp landing on its card. A case passes its ending label (spec 006 C6: clean, costly, worst...) and the
// facts the debrief used; both save with the case in bl.season. The debrief (debrief.js) calls this as its last step.
function finish(ending,facts){
 store.set(B.key('game'),null);const a=lead().a;const id=G.case;closeCase(id,ending,facts);const counted=!!(G.db&&G.db.counted);G.db=null;B.S.stampCase=id;
 // every agent in the field carries SAN, disorders, Breaking Point, Adapted marks, skill gains and gear back to the
 // roster, and counts one more case closed; statuses cleared at the debrief's heal-up; the backpack goes to bl.party
 // Minor injuries last through the next case and clear at that case's end-of-case heal-up (Lasting injuries)
 if(!counted)caseCounts();
 live().forEach(m=>{const a=m.a;if(Array.isArray(a.inj))a.inj=a.inj.filter(x=>!(x.tier==='minor'&&--x.left<=0))});
 const R=B.S.roster;live().forEach(m=>{const x=carry(m);x.id=x.id||Date.now()+rnd(1000);const i=R.findIndex(y=>y.id===x.id);const copy=JSON.parse(JSON.stringify(x));if(i>=0)R[i]=copy;else if(x===a)R.unshift(copy)});store.set(B.key('roster'),R);
 // the party carries to the next case (spec 008): its seats by agent id and who leads, with the backpack
 store.set(B.key('party'),{pack:G.fs?G.fs.pack:[],seats:live().map(m=>m.a.id),lead:Math.min(G.lead|0,Math.max(0,live().length-1))});
 leave();B.goto('title');board({from:'finish',stamp:id});B.toast('FILED. CASE CLOSED.');
}
// Counts the case for everyone who finished it in the party (cases closed, and this season's count for arc beats, spec 008).
// Recruits who joined at the debrief weren't in the case. Agents away on Sabbatical count it down (home.js).
function caseCounts(){if(G.db)G.db.counted=1;live().forEach(m=>{if(m.late)return;m.a.cases=(m.a.cases|0)+1;m.a.sc=(m.a.sc|0)+1});if(typeof sabTick==='function')sabTick()}
// Starts a case (A on its card): its briefing (the case's opening) plays first. Seat 1 leads.
async function start(agent,squad,id){
 const c=caseById(id)||CASES[0];
 party=[member(agent),...squad.map(member)];
 G=Object.assign(G,{active:true,case:c.id,lead:0,db:null,flags:{},clues:[],fights:0,enc:10,rescued:0,busy:0,mode:'scene',scene:null,map:null});
 fieldStart();  // each agent's kit and items, the backpack, the field state (field.js)
 MAZE=null;enter();applySan();
 run(c.opening);
}
// A checkpoint from before a case was rewritten (save step 7, spec 006 Saves) can't land in the new story's middle:
// the same team starts the case again from its briefing, keeping their SAN, disorders, injuries, gear and backpack.
function restartCase(o){
 const ag=o.party.filter(m=>m&&m.a&&!m.gone).map(m=>{fillMember(m);return carry(m)});if(!ag.length)return false;
 const p=store.get(B.key('party'),null),pack=(p&&Array.isArray(p.pack)?p.pack:[]).concat(o.fs&&Array.isArray(o.fs.pack)?o.fs.pack:[]);store.set(B.key('party'),{pack});
 G.rewrote=1;start(ag[0],ag.slice(1),o.case);if(Number.isInteger(o.lead)&&o.lead>=0&&o.lead<ag.length)G.lead=o.lead;return true}
function resume(){const s=store.get(B.key('game'),null);if(!s)return false;
 try{const o=JSON.parse(s);if(o&&o.rewrite){G=Object.assign(G,{busy:0});if(restartCase(o))return true}}catch(e){}
 G=Object.assign(G,{active:true,busy:0,mode:'world'});MAZE=null;enter();
 // a checkpoint that won't open goes back to the title with a message instead of freezing; the save is kept
 try{restore(s)}catch(e){console.warn('Checkpoint would not open:',e);leave();B.goto('title');B.render();B.toast('CHECKPOINT WON\'T OPEN');return false}
 G.cp=s;
 if(G.db){run(runDebrief);return true}  // the debrief picks up at the same step (debrief.js)
 // Last time (Quality of life): one box with where you were and the Case file's Next goal
 const c=caseById(G.case),nx=c&&c.next?c.next():'';
 run(()=>say('',fillT(MMW.lastTime,{m:G.M.name})+(nx?'\n'+fillT(MMW.lastNext,{g:nx}):'')));
 return true}

// ================= PAUSE =================
// The map menu is field.js (spec 006, A5).

// ================= INPUT =================
function input(k){
 if(!G.active)return;
 if(CB&&!dlg&&!menu){boardPress(k);return}  // the board's own scenes (an agency unlock, the season end) use the dialog box
 if(dlg){if(k==='a'||k==='b'){if(!dlg.done)finishType();else closeDlg()}return}
 if(menu){const n=menu.items.length;
  if(k==='up'){menu.sel=(menu.sel-1+n)%n;renderMenu()}
  else if(k==='down'){menu.sel=(menu.sel+1)%n;renderMenu()}
  else if(k==='a'){const it=menu.items[menu.sel];if(it&&it.dis)return;closeMenu(menu.sel)}
  else if(k==='b'&&menu.cancel){closeMenu(-1)}
  return}
 if(Bt&&Bt.ui){battlePress(k);return}  // the battle's own menus (battle.js)
 if(Bt)return;
 if(SCR){if(!SCR.lock)scrPress(k);return}
 if(PM){partyPress(k);return}
 if(G.mode==='world'&&!G.busy&&!G.mv){if(k==='a')run(interact);else if(k==='start')run(pauseMenu)}
 if(k==='select')mapSelect();
}
function hold(d,on){held=StudioMove.hold(held,d,on)}
dhost.addEventListener('click',e=>{if(!e.target.closest('.bld'))return;const li=e.target.closest('.bld-c li');
 if(menu){if(!li||!menu.inBox)return;const i=[...li.parentNode.children].indexOf(li);if(menu.sel!==i){menu.sel=i;renderMenu()}}input('a')});
menuEl.addEventListener('click',e=>{const el=e.target.closest('.gi');if(!el||!menu)return;const i=+el.dataset.i;if(menu.sel!==i){menu.sel=i;renderMenu()}input('a')});
// The shelf's Continue button opens straight into the case checkpoint (launcher.md, Title cards).
// With no checkpoint (only agents on the roster) the title screen opens as usual.
window.addEventListener('load',()=>{if(window.Studio&&Studio.continued&&!G.active)resume()});
window.BLG={start,resume,input,hold,recruitBuilt:a=>recruitBuilt(a),get active(){return G.active},
 board:o=>board(Object.assign({stamp:o&&o.from==='finish'?B.S.stampCase:null},o)),seasonClosed:()=>seasonClosed(),seasonNo:()=>loadSeason().season,newSeason:()=>newSeason(),_t:{hp:(i,n)=>{party[i].hp=n},status:(i,k)=>{const m=party[i];m.st=m.st||[];if(!m.st.includes(k))m.st.push(k)},
 box:()=>box&&box.text||"",skipBox:()=>{if(dlg){if(!dlg.done)finishType();if(dlg)closeDlg()}},hot:h=>run(()=>hotspot(h,'test')),run:fn=>run(()=>fn({party,G,lead,horror,trigger,addStatus,pickup,loseAgent,say})),scr:()=>SCR&&SCR.kind,lead:()=>G.lead|0,fight:t=>run(async()=>{const r=await battle(t);if(r==='lose')await gameOver()}),go:(m,x,y)=>goMap(m,x,y,'right'),G:()=>G,party:()=>party,boss:()=>run(bossIntro),finish:()=>finish(),board:()=>CB,
 bt:()=>Bt?{ui:Bt.ui?Bt.ui.kind:null,sel:Bt.ui?Bt.ui.sel:null,rows:Bt.ui&&Bt.ui.rows?Bt.ui.rows.map(r=>r.label+(r.dis?'*':'')):null,round:Bt.round,msg:Bt.msg,en:Bt.en.map(e=>[e.name,e.hp,e.dead||e.gone]),party:party.map(m=>[m.name,m.hp,m.wp,m.san,!!m.ko,!!m.dead])}:null}};
