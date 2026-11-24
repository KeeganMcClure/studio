// Rushlight (forked from Black Lantern, Nov 21, 2026) · engine.js
// Game engine: map walking, dialog and menus, sanity, saves, pause, input. Exposes window.RLG.
// The battle is battle.js and the party menu party-menu.js (both on the studio's shared engine/ pieces, spec 002).
// Loaded as a plain script (no wrapper) so content files can call say, ask, battle, checkpoint and the rest.
const B=window.RL;
const $=s=>document.querySelector(s);
const scr=$('#screen'),gEl=$('#game'),cv=$('#gcv'),cx=cv.getContext('2d');
const dhost=$('#gdlg'),menuEl=$('#gmenu'),hud=$('#ghud'),ban=$('#gban'),fadeEl=$('#gfade'),sanEl=$('#gsan');
const {esc,store}=B;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
let VW=240,VH=160;
let G={active:false,lead:0},Bt=null,party=[],raf=0,dlg=null,menu=null,held=[];
const lead=()=>party[G.lead|0]||party[0];  // a lead index, not the first seat (spec 002; Select cycles it, party-menu.js)
const DIRS=StudioMove.DIRS;  // walking, the camera and the canvas fit are shared: engine/move.js

// ================= DATA =================
const BLOCK=new Set('TCB#DLlPHFSVKkYyNpGWIOXE'.split(''));

// ================= HELPERS =================
const fmt=t=>party.length?t.replace(/\{merc\}/g,lead().name).replace(/\{first\}/g,lead().name):t;
// ================= TILES =================
const tc={};
function tile(ch,v){const k=ch+v;if(tc[k])return tc[k];const c=document.createElement('canvas');c.width=c.height=16;const x=c.getContext('2d');const p=(a,b,w,h,col)=>{x.fillStyle=col;x.fillRect(a,b,w,h)};drawTile(p,ch,v|0);return tc[k]=c}
function grass(p,v){p(0,0,16,16,'#4f6e35');const s=[[2,3],[9,5],[5,11],[12,12],[13,2],[7,8]];s.forEach(([a,b],i)=>{if((i+v)%3)p((a+v*3)%15,b,1,2,'#6a8a42')});if(v===2)p(10,9,2,1,'#d98a3a')}
function path(p,v){p(0,0,16,16,'#9a7a50');p((v*5)%13+1,4,2,1,'#7e6340');p((v*7)%12+2,11,1,1,'#b8956a');p(4,(v*3)%12+2,1,1,'#7e6340')}
function floor(p,v){p(0,0,16,16,'#4b3824');p((v*5)%13+1,5,2,1,'#5e4630');p((v*3)%13+2,12,1,1,'#3a2a1a');p(9,(v*7)%13+1,1,2,'#5e4630')}
function drawTile(p,ch,v){
 switch(ch){
 case '.':grass(p,v);break;
 case ',':path(p,v);break;
 case 'M':case 'X':floor(p,v);break;
 case 'T':{grass(p,0);p(7,10,2,6,'#4a3020');const col=['#c8572a','#d99a2b','#7a8a2a'][v%3],hi=['#e07a3a','#efc04a','#9aaa3a'][v%3];p(2,2,12,9,col);p(1,4,14,5,col);p(4,0,8,2,col);p(4,2,3,2,hi);p(9,5,2,2,hi);p(3,9,10,2,'rgba(0,0,0,.25)');break}
 case 'C':{p(0,0,16,16,'#2c2112');for(let i=0;i<4;i++){const xx=1+i*4;p(xx,0,2,16,i%2?'#a8892f':'#bf9f3c');p(xx+(i%2?-1:2),4+i*2,2,1,'#7a6a22');p(xx,i%2?1:0,2,2,'#e0c25a')}break}
 case 'B':{p(0,0,16,16,'#7a3b2e');for(let y=0;y<16;y+=4){p(0,y,16,1,'#5e2c22');p((y*3)%8,y+1,1,3,'#5e2c22');p((y*3)%8+8,y+1,1,3,'#5e2c22')}break}
 case '#':{p(0,0,16,16,'#cdb88f');p(0,5,16,1,'#ad9a72');p(0,10,16,1,'#ad9a72');if(v%2){p(4,3,8,7,'#2a2440');p(5,4,6,5,'#ffcf6a');p(7,4,1,5,'#2a2440');p(5,6,6,1,'#2a2440')}p(0,15,16,1,'#6b5a3a');break}
 case 'D':{p(0,0,16,16,'#cdb88f');p(3,2,10,14,'#4a2f1f');p(4,3,8,6,'#5e3c26');p(10,10,2,2,'#f2c94c');break}
 case 'L':case 'l':{ch==='l'?floor(p,v):grass(p,v);p(7,5,2,11,'#2b2b33');p(4,0,8,1,'#2b2b33');p(4,1,8,5,'#ffcf5a');p(5,2,6,3,'#fff1c2');p(6,6,4,1,'#2b2b33');break}
 case 'P':{grass(p,v);p(3,7,10,8,'#e07b26');p(2,9,12,4,'#e07b26');p(7,7,1,8,'#b85e16');p(4,8,1,6,'#b85e16');p(11,8,1,6,'#b85e16');p(7,5,2,2,'#4a6b2a');p(5,10,2,1,'#3a1a08');p(9,10,2,1,'#3a1a08');p(6,12,4,1,'#3a1a08');break}
 case 'H':{grass(p,v);p(1,5,14,10,'#d9b552');p(1,8,14,1,'#b8963a');p(1,12,14,1,'#b8963a');p(3,4,2,1,'#e8cc6a');break}
 case 'F':{grass(p,v);p(0,6,16,2,'#8a6a42');p(0,11,16,2,'#8a6a42');p(2,4,2,12,'#6b4a2a');p(10,4,2,12,'#6b4a2a');break}
 case 'S':case 'V':{const base=ch==='S';base?grass(p,v):floor(p,v);const sh=['#6b4a8a','#c0392b','#2d5a8a','#4a7a3a'][v%4];p(7,4,2,12,'#5a3e2b');p(1,6,14,2,'#5a3e2b');p(4,5,8,7,sh);p(2,6,2,3,'#e0c25a');p(12,6,2,3,'#e0c25a');p(5,0,6,6,'#d9c08a');p(6,2,1,1,'#2a1a10');p(9,2,1,1,'#2a1a10');p(6,4,4,1,'#2a1a10');if(base){p(4,0,8,1,'#3a2a1a');p(5,-1,6,1,'#3a2a1a')}else{p(6,10,4,1,'rgba(255,255,255,.25)')}break}
 case 'K':{path(p,v);p(1,5,15,8,'#e8e8e8');p(1,8,15,3,'#1b1b2a');p(4,5,10,3,'#5a7ab0');p(12,3,4,2,'#d33');p(3,12,4,4,'#111');break}
 case 'k':{path(p,v);p(0,5,15,8,'#e8e8e8');p(0,8,15,3,'#1b1b2a');p(2,5,8,3,'#5a7ab0');p(0,3,4,2,'#35f');p(9,12,4,4,'#111');break}
 case 'Y':case 'y':{path(p,v);for(let i=0;i<4;i++)p(i*4,1,4,4,i%2?'#f4f1e8':'#c0392b');p(0,8,16,7,'#8a5a2b');p(0,8,16,1,'#a8743a');p(ch==='Y'?3:9,5,3,3,'#e0a030');p(ch==='Y'?2:13,2,1,6,'#5a3e2b');break}
 case 'N':{path(p,v);p(2,9,2,7,'#5a3e2b');p(12,9,2,7,'#5a3e2b');p(0,1,16,9,'#7a5a3a');p(1,2,4,6,'#f4f4f4');p(6,3,4,6,'#f4f4f4');p(11,2,4,6,'#f4f4f4');p(2,3,2,2,'#ff7a1a');p(7,4,2,2,'#ff7a1a');p(12,3,2,2,'#ff7a1a');break}
 case 'p':{path(p,v);p(1,4,14,12,'#6b4a2a');p(1,4,14,1,'#8a6a42');p(3,7,10,4,'#c0392b');p(5,8,6,2,'#f2c94c');break}
 case 'W':{grass(p,v);p(3,9,2,7,'#5a3e2b');p(11,9,2,7,'#5a3e2b');p(0,2,16,8,'#e8dcc0');p(2,4,12,1,'#3a2a1a');p(2,6,9,1,'#3a2a1a');p(11,6,3,1,'#ff7a1a');break}
 case 'G':{path(p,v);p(0,2,16,2,'#7a5a3a');p(0,8,16,2,'#7a5a3a');p(0,13,16,2,'#7a5a3a');p(2,1,2,15,'#5a3e2b');p(12,1,2,15,'#5a3e2b');p(6,5,4,5,'#9aa0a6');p(7,6,2,3,'#4a4a52');break}
 case 'I':{floor(p,v);p(4,6,8,8,'#3e5c8a');p(4,6,8,3,'#2d4569');p(7,9,2,2,'#c9c9c9');break}
 case 'O':{floor(p,v);p(4,7,8,6,'#e8e2d0');p(5,8,6,1,'#7a6a5a');p(5,10,5,1,'#7a6a5a');break}
 default:p(0,0,16,16,'#000');
 }
}

// ================= MAPS =================
const mk=(w,h,f)=>Array.from({length:h},()=>Array(w).fill(f));
const rect=(g,x,y,w,h,c)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(g[j]&&g[j][i]!==undefined)g[j][i]=c};
async function stepBack(){const [dx,dy]=DIRS[G.dir];if(passable(G.x+dx,G.y+dy)){G.x+=dx;G.y+=dy;G.px=G.x*16;G.py=G.y*16}}


// ================= DIALOG / MENU =================
// Lantern Bust box (engine/dialog.js, copied unchanged from the Asset Library). `box` holds what the box shows;
// drawBox() runs every frame and redraws the box only when something visible changed.
let box=null,boxKey='';
const PORTRAITS={}; // speaker name -> (ctx, frame, shouting) 64 x 64
function say(name,text,o={}){
 if(G.auto&&G.auto.menu){if(G.auto.said)G.auto.said.push(fmt(text));return Promise.resolve()}
 return new Promise(res=>{
  if(dlg)clearTimeout(dlg.to);
  text=fmt(text);
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
 const typing=box.typed<box.text.length,por=PORTRAITS[box.name],sh=!!(G.shoutPor&&por);
 // mouth: bursts of open/shut while the line types, then shut; shout face: its counter runs while typing, then holds
 if(typing)box.n=n;const p=n%(T.burst+T.rest),f=sh?(box.n||0):(typing&&p<T.burst&&p%2===0?1:0);
 const arrow=box.more&&Math.floor(now/T.moreBlinkMs)%2===0;
 const key=[box.name,box.typed,box.text,box.choices?box.choices.join('|')+'#'+box.sel:'',arrow,por?f+':'+sh:'',gEl.clientWidth].join('~');
 if(key===boxKey)return;boxKey=key;
 const b=BLD.render(dhost,{name:box.name,narrate:!box.name,text:box.text,typed:box.choices?null:box.typed,more:arrow,choices:box.choices,sel:box.sel,
  portrait:por&&(c=>por(c,f,sh)),scale:2});
 // long choice lists scroll inside the box so the box never pushes the portrait off the screen
 const ul=b.querySelector('.bld-c');
 if(ul){const bust=b.querySelector('.bld-bust'),room=gEl.clientHeight-(bust?bust.offsetHeight:b.querySelector('.bld-tab')?18:0)-(b.offsetHeight-ul.offsetHeight)-10;
  ul.style.maxHeight=Math.max(60,room)+'px';const on=ul.querySelector('.on');
  if(on){if(on.offsetTop<ul.scrollTop)ul.scrollTop=on.offsetTop;else if(on.offsetTop+on.offsetHeight>ul.scrollTop+ul.clientHeight)ul.scrollTop=on.offsetTop+on.offsetHeight-ul.clientHeight}}
 posMenu();
}
function renderMenu(){const m=menu;if(!m)return;
 if(m.inBox){if(box){box.choices=m.items.map(it=>typeof it==='string'?it:it.label);box.sel=m.sel;box.more=false}if(m.onSel)m.onSel(m.sel);return}
 menuEl.hidden=false;
 const face=f=>f?`<canvas class="face" width="64" height="64" data-sp="${f.sp}" data-look='${JSON.stringify(f.look||{})}'></canvas>`:'';
 const rows=sel=>(m.title?`<div class="mt">${m.tface?face(m.tface):''}${esc(m.title)}</div>`:'')+m.items.map((it,i)=>{const o=typeof it==='string'?{label:it}:it;const ic=o.icon&&window.RL_ICONS&&RL_ICONS[String(o.icon).toLowerCase()];// a row may show a face, a name with a second line under it, and a value on the right (spec 008, 8C: hire rows, the hotspot prompt);
  // its label stays the plain text the auto-player and the checks read
  const body=o.name||o.sub||o.right||o.face?`${face(o.face)}<span class="gl">${esc(o.name||o.label)}${o.sub?`<br><span class="gs">${esc(o.sub)}</span>`:''}</span>${o.right!=null?`<span class="r">${o.rface?face(o.rface):''}${esc(o.right)}</span>`:''}`:esc(o.label);
  return`<div class="gi ${i===sel?'on':''} ${o.dis?'dis':''}" data-i="${i}"><span class="gc">${i===sel?'▶':''}</span>${ic?`<img class="gic" src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(ic)}">`:''}${body}</div>`}).join('');
 // one fixed width, measured once when the menu opens from its widest row plus the cursor, never from the selected row
 if(!m.w)m.w=StudioMenu.lockWidth(menuEl,rows(-1));
 menuEl.innerHTML=rows(m.sel)+(m.desc&&m.desc[m.sel]?`<div class="md">${esc(m.desc[m.sel])}</div>`:'');
 menuEl.querySelectorAll('canvas.face').forEach(c=>{const x=c.getContext('2d');x.imageSmoothingEnabled=false;x.drawImage(RLSP.portrait(c.dataset.sp,JSON.parse(c.dataset.look)),0,0)});
 if(m.onSel)m.onSel(m.sel);posMenu();const on=menuEl.querySelector('.gi.on');if(on)on.scrollIntoView({block:'nearest'})}
function posMenu(){if(menuEl.hidden)return;let b=6;const bx=dhost.querySelector('.bld'),tab=bx&&bx.querySelector('.bld-tab');
 if(G.mode==='battle'&&!hud.hidden)b=hud.offsetHeight+8;else if(bx)b=bx.offsetHeight+(tab?tab.offsetHeight:0)+10;menuEl.style.bottom=b+'px'}
function choose(items,o={}){if(G.auto&&G.auto.menu)return Promise.resolve(G.auto.menu(items,o));return new Promise(res=>{menu={items,sel:o.sel||0,res,cancel:o.cancel,title:o.title,tface:o.tface,desc:o.desc,onSel:o.onSel,inBox:o.inBox,onSelect:o.onSelect};renderMenu()})}
function closeMenu(v){const m=menu;menu=null;menuEl.hidden=true;StudioMenu.unlock(menuEl);if(m.inBox&&box)box.choices=null;if(Bt)Bt.hover=-1;m.res(v)}
async function ask(name,text,opts){if(G.auto&&G.auto.menu){await say(name,text);return G.auto.menu(opts,{title:text})}await say(name,text,{keep:true,instant:false});const r=await choose(opts,{cancel:true,inBox:true});hideTB();return r<0?opts.length-1:r}
// the banner sits under the HUD cards on a street, a site or the map (spec 008, 8B), in screen pixels from the canvas's scale
function banner(t){ban.textContent=t;ban.hidden=false;{const c=document.getElementById('gcv'),k=c&&c.clientWidth?c.clientWidth/VW:1,under=G.mode==='region'?SH+16:G.site?64:G.town?50:0;ban.style.top=under?Math.round(under*k+4)+'px':''}clearTimeout(banner.t);banner.t=setTimeout(()=>ban.hidden=true,2200)}
function fade(on){fadeEl.style.opacity=on?1:0;return sleep(340)}
async function run(fn){G.busy=(G.busy||0)+1;try{await fn()}catch(e){console.error(e)}finally{G.busy--}}

// ================= SANITY =================
// Low SAN sours the picture toward SAN pink and cyan (engine/light.js, drawn in drawWorld); the thresholds are the old ones.
const LOOK={dark:'#1c1814',alpha:.9,warm:'#d9b45a',pink:'#ff4fa3',cyan:'#3ff0e8',sour:.6};
const sourFade={};
function applySan(){const m=lead();if(!m)return;const fr=clamp(m.san/m.msan,0,1);sanEl.innerHTML=`SAN <b class="${fr<.4?'red':''}">${m.san}</b>`;}

// ================= WORLD =================
const SITE_BLOCK=new Set('THDwfrc~bogWhksOpmuLa'.split(''));
function passable(x,y){const M=G.M;if(x<0||y<0||x>=M.w||y>=M.h)return false;if((M.site?SITE_BLOCK:BLOCK).has(M.g[y][x]))return false;if(M.npcs.some(n=>(!n.on||n.on())&&n.x===x&&n.y===y))return false;return true}
function goMap(name,x,y,dir){hud.hidden=true;gEl.classList.remove('battle','region','site','town');if(name.startsWith('site_'))gEl.classList.add('site');if(name.startsWith('town_'))gEl.classList.add('town');G.map=name;G.M=MAPS[name]();StudioMove.place(G,x,y,dir);
 banner(G.M.name);saveRun()}
function update(){
 if(G.mode!=='world')return;
 StudioMove.update(G,StudioMove.last(held),{passable,busy:()=>G.busy||dlg||menu||PM||IV||EX||CV||BV,arrive:()=>run(onStep)});
}
async function onStep(){const M=G.M,k=G.x+','+G.y;if(M.warps&&M.warps[k]){held=[];return M.warps[k]()}if(M.onStep)await M.onStep()}
async function interact(){
 const [tx,ty]=StudioMove.ahead(G),M=G.M,k=tx+','+ty;
 const n=M.npcs.find(n=>(!n.on||n.on())&&n.x===tx&&n.y===ty);
 if(n){n.dir={up:'down',down:'up',left:'right',right:'left'}[G.dir];held=[];talker=n;try{await n.talk(n)}finally{talker=null}return}
 if(M.O[k]){held=[];await M.O[k]();return}
}
// who is talking on the map, so their sprite flaps while the line types (art-style, Animation: Talk)
let talker=null;
function mouthOpen(){if(!box||box.typed>=box.text.length)return false;const T=BLD.TIMING,n=Math.floor(performance.now()/T.flapMs),p=n%(T.burst+T.rest);return p<T.burst&&p%2===0}
// a map sprite's frame from the shared rig: the talk flap, else a blink or an idle breath now and then (each person out of step)
function idleFrame(seed,now){return StudioRig.blink(now,seed)?'blink':StudioRig.idle(now,seed)||'stand'}
// ---- the HUD cards (spec 008, 8B; mockup 34): the lead card top left, the place card top right, on the shared frame ----
const HUDT={outer:'#1c1814',line:'#e6dcc4',fill:'rgba(44,38,33,.97)',backTop:'#a8906c',backBot:'#6a5a44',bar:'#9a4528'};
// the lead: a portrait on its lit backing, the name in Tallow, the HP bar, HP, WP and SAN (SAN pink under 40). Returns its bottom.
function leadCard(){const m=party[G.lead|0];if(!m)return 0;StudioHUD.card(cx,2,2,108,44,HUDT);
 StudioHUD.portrait(cx,RLSP.portrait(m.sp,m.look),4,0,56,60,5,5,34,37,HUDT);
 const nm=m.name.toUpperCase(),z=pSize(nm,61,[14,13,12,11,10])||10;pT(nm,42,3+(14-z)/2,'#d9b45a',z);
 StudioHUD.bar(cx,42,17,60,m.hp/m.mhp,HUDT);pT(`HP ${m.hp}/${m.mhp}`,42,20,'#e6dcc4',12);
 let s=`WP ${m.wp} · SAN `;if(pW(s+m.san,12)>62)s=`WP ${m.wp} SAN `;const sz=pW(s+m.san,12)>62?11:12;pT(s,42,31,"#e6dcc4",sz);pT(String(m.san),42+pW(s,sz),31,m.san<40?"#ff4fa3":"#e6dcc4",sz);return 46}
// the place: rows of [text, color, size]; the first is the name and wraps rather than being cut. As wide as it needs, up to the lead card.
function placeCard(rows){const maxW=VW-116,need=Math.max(...rows.slice(1).map(([t,,z])=>pW(t,z)+10),pW(rows[0][0],rows[0][2])+10,78),w=Math.min(maxW,Math.ceil(need));
 const name=pW(rows[0][0],rows[0][2])+10<=w?[rows[0][0]]:pWrap(rows[0][0],w-10,12,2),nz=name.length>1?12:rows[0][2],h=Math.max(44,6+name.length*(nz-1)+(rows.length-1)*12+2);
 const x=VW-w-2;StudioHUD.card(cx,x,2,w,h,HUDT);let y=3;name.forEach(l=>{pT(l,x+5,y,rows[0][1],nz);y+=nz-1});y+=1;
 rows.slice(1).forEach(([t,c,z])=>{pT(pFit(t,w-10,z),x+5,y,c,z);y+=12});return h+2}
// on a town street the camera sits 34 px higher, so the rooftops and smoke show under the HUD cards (spec 008, 8B)
function cam(){const c=StudioMove.camera(G,G.M.w,G.M.h,VW,VH);if(G.M&&G.M.town)c[1]-=34;return c}
function drawWorld(){
 const M=G.M,[camx,camy]=cam();cx.fillStyle='#0a0710';cx.fillRect(0,0,VW,VH);
 const x0=Math.floor(camx/16),y0=Math.floor(camy/16);
 if(M.town)drawStreet(M,camx,camy);else if(M.site)drawSiteTiles(M,camx,camy);else for(let ty=y0;ty<=y0+Math.ceil(VH/16)+1;ty++)for(let tx=x0;tx<=x0+Math.ceil(VW/16)+1;tx++){const ch=M.g[ty]&&M.g[ty][tx];if(!ch)continue;let v=(tx*7+ty*13)%4;if(ch==='V')v=M.vv[tx+','+ty];if(ch==='T')v=(tx*3+ty*5)%3;cx.drawImage(tile(ch,v),tx*16-camx,ty*16-camy)}
 const spr=[];
 const now=performance.now();
 M.npcs.forEach(n=>{if(n.on&&!n.on())return;const fr=n===talker&&mouthOpen()?'talk':idleFrame(n.x*31+n.y*17,now);
  spr.push({y:n.y*16,f:()=>cx.drawImage(RLSP.map(n.sp,n.look,fr),n.x*16+1-camx,n.y*16+16-26-camy)})});
 // Only the lead walks the map (Bible, Art, Maps). The walk is four beats, step, pass, step, pass, one beat per half tile
 // (art-style, Animation); standing, the lead breathes and blinks like everyone else
 const moving=!!G.mv,lfr=moving?StudioRig.WALK[StudioRig.walkBeat(G.anim,StudioMove.STEPF/2)]:idleFrame(7,now);
 spr.push({y:G.py,f:()=>{const s=RLSP.map(lead().sp,lead().look,lfr);cx.drawImage(s,Math.round(G.px+1-camx),Math.round(G.py+16-26-camy))}});
 spr.sort((a,b)=>a.y-b.y).forEach(s=>s.f());
 if(M.site){drawSiteOver(M,camx,camy);siteLight(M,camx,camy);drawSiteStrip()}else if(M.town){townLight(M,camx,camy);drawTownStrip()}else lights(M,camx,camy)
}
// Night and lamps on the shared light (engine/light.js): the dark from Peat, Tallow pools from the rushlight and lamps.
// The rushlight's pool shrinks as the lead's SAN falls (the old rule), and below 40% SAN the picture sours.
function lights(M,camx,camy){
 const fr=clamp(lead().san/lead().msan,0,1),lamps=[];
 for(let ty=0;ty<M.h;ty++)for(let tx=0;tx<M.w;tx++)if(M.g[ty][tx]==='L'||M.g[ty][tx]==='l')lamps.push([tx*16+8-camx,ty*16+4-camy,M.dark?26:24,.3]);
 if(M.dark)StudioLight.night(cx,{dark:LOOK.dark,alpha:LOOK.alpha,warm:LOOK.warm,pools:[[G.px+8-camx,G.py+6-camy,34+36*fr],...lamps.map(l=>[l[0],l[1],l[2]])]});
 else StudioLight.night(cx,{dark:LOOK.dark,alpha:0,warm:LOOK.warm,pools:[],glows:lamps});
 const k=StudioLight.fade(sourFade,fr<.4,performance.now());if(k>0)StudioLight.sour(cx,k*LOOK.sour,{pink:LOOK.pink,cyan:LOOK.cyan});
}
function drawTitleCard(){cx.fillStyle='#05040a';cx.fillRect(0,0,VW,VH);const t=performance.now()/1000,fl=.7+.3*Math.sin(t*7)*Math.sin(t*3.1);const x=VW/2,y=VH*.38;const g=cx.createRadialGradient(x,y,2,x,y,44);g.addColorStop(0,`rgba(255,190,80,${.35*fl})`);g.addColorStop(1,'rgba(255,190,80,0)');cx.fillStyle=g;cx.fillRect(x-50,y-50,100,100);const P=(a,b,w,h,c)=>{cx.fillStyle=c;cx.fillRect(x+a,y+b,w,h)};P(-1,-16,2,3,'#3a3460');P(-5,-13,10,2,'#2a2440');P(-6,-11,1,16,'#2a2440');P(5,-11,1,16,'#2a2440');P(-5,-11,10,16,`rgba(255,${180+Math.floor(Math.random()*20)},80,${fl})`);P(-2,-8,4,9,'#fff6d8');P(-6,5,12,2,'#2a2440')}
// Logic runs at 60 ticks a second on any screen (engine/clock.js); frames with no tick due are skipped.
const clock=StudioClock.make();
function loop(now){if(!G.active)return;const n=clock.ticks(now);if(!n){raf=requestAnimationFrame(loop);return}try{for(let i=0;i<n;i++)update();if(G.mode==='battle'&&Bt)drawBattle();else if(BV)drawBestiary();else if(IV)drawItems();else if(PM)drawParty();else if(G.mode==='region')drawRegion();else if(G.mode==='world')drawWorld();else drawTitleCard();if(CV)drawCard();drawBox()}catch(e){console.error(e)}raf=requestAnimationFrame(loop)}
function fit(){const v=StudioMove.fit(gEl,cv);if(!v)return;VW=v.w;VH=v.h;gEl.style.setProperty('--pu',(64*v.boxW/VW)+'px');boxKey='';if(menu&&!menu.inBox){menu.w=0;renderMenu()}posMenu()}
window.addEventListener('resize',()=>{if(G.active)fit()});

// ================= THE RUN AND ITS SAVE (spec 003) =================
// rl.run holds the run: seed, the three streams' positions, the company, lead, purse, pack and where they stand.
// It autosaves on every screen change (a map, a menu closing, the lead changing). Deaths stick: nothing reloads a roll.
let DICE=null;
// the Dev settings' forced rolls (spec 006, D1): G.dev.rolls is a queue of d100 results the next rolls take, in order,
// so any rule (a crit, a fumble, a break, an injury, a horror) can be forced; with the queue empty, the run's dice stream
function useDice(saved){DICE=StudioSeed.load(saved);StudioRoll.use(()=>{const q=G.dev&&G.dev.rolls;if(q&&q.length)return (q.shift()-1)/100+0.0001;return DICE.next()})}
function saveRun(){const r=G.run;if(!r||r.ended)return;r.party=party;r.lead=G.lead|0;if(DICE)r.streams.dice=DICE.save();
 if(G.M&&G.mode==='world')r.place={map:G.map,x:G.x,y:G.y,dir:G.dir};else if(G.mode==='region')r.place=null;store.set(B.key('run'),r)}
function enter(){G.active=true;scr.classList.add('gaming');sanEl.hidden=false;fit();cancelAnimationFrame(raf);clock.reset();raf=requestAnimationFrame(loop)}
function leave(){saveRun();G.active=false;PM=null;IV=null;cancelAnimationFrame(raf);scr.classList.remove('gaming','glitch');scr.style.filter='';$('#vig').style.opacity=0;box=null;boxKey='';dhost.replaceChildren();menuEl.hidden=true;hud.hidden=true;exportEl.hidden=true;if(dlg)clearTimeout(dlg.to);dlg=null;menu=null;Bt=null;held=[];StudioRoll.use(null)}
function quit(){leave();B.goto('title');B.render()}
// Sign them on: the company drops into the stand-in town (spec 003, 10; Part C replaces it with Harrowford)
function begin(rn){
 G=Object.assign(G,{active:true,run:rn,lead:rn.lead|0,flags:{},busy:0,mode:'region'});party=rn.party;useDice(rn.streams.dice);
 if(!rn.region)rn.region=makeRegion(rn);
 enter();
 // a street or site the company stood in (Parts C and D), else the region map; a march saved mid-road picks up again
 if(!rn.boards)makeTowns(rn);
 const p=rn.place;if(p&&p.map&&p.map.startsWith('town_')){G.town=p.map.slice(5);MAPS[p.map]=()=>townMap(G.town)}
 // a contract site the company stood in (D1): rebuild its chunk, and a fight saved mid-round picks up at that round
 if(p&&p.map&&p.map.startsWith('site_')&&rn.job){const J=JOBS[rn.job.id],S=SITES[J.site]||{};G.site={name:(S.name||P_[J.site].name).toUpperCase(),kind:J.kind,shape:J.shape};MAPS[p.map]=()=>chunkMap(rn.job,rn.job.chunk,rn.job.chunks[rn.job.chunk])}
 if(p&&p.map&&MAPS[p.map]){G.mode='world';goMap(p.map,p.x,p.y,p.dir)}else enterRegion();
 applySan();saveRun();
 if(rn.fight&&rn.fight.key&&rn.job){const F=rn.fight,key=F.key;run(async()=>{const M=G.M,f=(M&&M.fights||[]).find(x=>x.id===key);if(key==='monk')await monkFight(rn.job,{en:F.en,round:F.round});else if(f)await siteFight(f,{en:F.en,round:F.round})})}
 else if(rn.region.trip)run(async()=>{await say('','On the road, where you left off.',{auto:900});await walk()});
}
function resume(){const r=store.get(B.key('run'),null);if(!r||r.ended||!r.party)return false;begin(r);return true}
G.onLead=()=>{saveRun()};

// ================= THE MAP MENU =================
async function pauseMenu(){
 held=[];
 for(;;){
  const rows=['Party','Items','Bestiary','Export','Title','Close'];if(G.town&&G.mode==='world')rows.splice(2,0,'Sleep rough');
  const r0=await choose(rows,{cancel:true,title:'MENU · '+(G.mode==='region'?'THE WITHY MARCH':G.M.name)});
  if(rows[r0]==='Sleep rough'){G.run.day++;await eatDay();await camp({road:false});await say('','You sleep rough by the wall. Free, and it feels it.');continue}
  if(rows[r0]==='Bestiary'){await openBestiary();continue}
  const r=r0<0?-1:['Party','Items','Export','Title','Close'].indexOf(rows[r0]);
  if(r===0)await openParty();
  else if(r===1)await openItems(G.lead|0);
  else if(r===2)await showExport();
  else if(r===3){quit();return}
  else {saveRun();return}
 }
}
// Start → Export: the save code with a Copy row (spec 003, 9)
const exportEl=document.createElement('div');exportEl.className='gbox';exportEl.id='gexport';exportEl.hidden=true;gEl.appendChild(exportEl);
function showExport(){saveRun();const code=B.exportCode();return new Promise(res=>{
 exportEl.innerHTML=`<div class="mt">SAVE CODE</div><textarea readonly spellcheck="false">${esc(code)}</textarea><div class="gi" data-k="copy"><span class="gc">▶</span>Copy</div><div class="gi" data-k="close"><span class="gc"></span>Close</div>`;
 exportEl.hidden=false;let sel=0;const rows=[...exportEl.querySelectorAll('.gi')];const paint=()=>rows.forEach((r,i)=>{r.classList.toggle('on',i===sel);r.querySelector('.gc').textContent=i===sel?'▶':''});paint();
 const done=()=>{exportEl.hidden=true;EX=null;res()};
 const copy=()=>{const t=exportEl.querySelector('textarea');t.select();try{navigator.clipboard.writeText(code).catch(()=>document.execCommand('copy'))}catch(e){try{document.execCommand('copy')}catch(e2){}}B.toast('COPIED')};
 rows[0].onclick=copy;rows[1].onclick=done;
 EX={press:k=>{if(k==='up'||k==='down'){sel=1-sel;paint()}else if(k==='a'){if(sel)done();else copy()}else if(k==='b')done()}};
})}
let EX=null;

// ================= ITEMS (read-only in Part A; Mockup 4's layout) =================
let IV=null;
// a parchment card over the scene (spec 008, 8C): the pay, and other summaries. rows: [[label, value, color]]; any button closes it
let CV=null;
function showCard(o){if(G.auto)return Promise.resolve();return new Promise(res=>{CV=Object.assign({done:res},o)})}
function closeCard(){const d=CV&&CV.done;CV=null;if(d)d()}
function drawCard(){const o=CV,w=VW-12,rows=o.rows||[],sub=o.sub?pWrap(o.sub,w-16,14,4):[],h=22+sub.length*12+rows.length*13+(o.note?pWrap(o.note,w-16,14,3).length*12+6:0)+16,x=6,y=Math.max(6,Math.round((VH-h)/2));
 pR(0,0,VW,VH,'rgba(28,24,20,.55)');StudioParch.panel(cx,x,y,w,h,PT_);pT(o.title,x+8,y+6,IK.rust,8,PXf);if(o.right)pT(o.right,x+w-8-pW(o.right,15),y+2,IK.rust,15);let yy=y+20;
 sub.forEach(l=>{pT(l,x+8,yy,IK.soot,14);yy+=12});
 rows.forEach(([l,v,c],i)=>{if(i)pR(x+8,yy-1,w-16,1,'rgba(90,62,43,.25)');pT(l,x+8,yy,IK.dim,14);const vz=pSize(v,w-24-pW(l,14),[14,13,12,11])||11;pT(v,x+w-8-pW(v,vz),yy+(14-vz)/2,c||IK.peat,vz);yy+=13});
 if(o.note){yy+=3;pWrap(o.note,w-16,14,3).forEach(l=>{cx.font='italic '+VTf(14);cx.fillStyle=IK.soot;cx.textBaseline='top';cx.fillText(l,x+8,yy);yy+=12})}
 const t='A: GO ON';pT(t,x+w-8-pW(t,12),y+h-14,IK.dim,12)}
function openItems(i){return new Promise(res=>{IV={i,done:res};ban.hidden=true;gEl.classList.add('menu')})}
// L and R flip between mercs; Up and Down move through what the merc carries (spec 008, 8C); A, B or Start close
function itemsPress(k){const n=party.length,c=party[IV.i].slots.length;if(k==='l')IV.i=(IV.i+n-1)%n,IV.c=0;else if(k==='r')IV.i=(IV.i+1)%n,IV.c=0;else if(k==='up')IV.c=Math.max(0,(IV.c|0)-1);else if(k==='down')IV.c=Math.min(Math.max(0,c-1),(IV.c|0)+1);else if(k==='b'||k==='a'||k==='start'){const d=IV.done;IV=null;gEl.classList.remove('menu');d()}}
const WEAR=['Sound','Worn','Cracked','Broken'];
// Items (spec 008, 8C; mockup 42): a tab per merc; the worn gear with its slot written out and its wear pips; what the merc carries
// with a count and what the picked one does; the pack with rations and days. The purse in the header.
function drawItems(){const m=party[IV.i],I=RLS.ITEMS,r=G.run;pR(0,0,VW,VH,PAL.peat);
 let y=frameTop('ITEMS',`PURSE ${r.purse} gr`);const bot=frameFoot('L/R: MERC · ▲▼: ITEM · B: BACK');
 const tw=Math.floor((VW-8-(party.length-1)*3)/party.length);party.forEach((p,j)=>{const x=4+j*(tw+3),on=j===IV.i;
  StudioParch.button(cx,x,y,tw,16,PT_,{on:false});if(on){pR(x,y,tw,16,PAL.tallow);pR(x+1,y+1,tw-2,14,'#e8cf86')}faceAt(p,x+2,y+2,12,p.dead);
  const z=pSize(p.name,tw-20,[14,13,12,11]);pT(z?p.name:p.name.split(/\s/)[0],x+17,y+(15-(z||11))/2,on?IK.peat:PAL.bone,z||11)});y+=20;
 // the worn gear: the slot written out, the item and its dice, wear as pips
 const g=m.gear,rows=[['Weapon 1',g.w1,g.hand==='w1'],['Weapon 2',g.w2,g.hand==='w2'],['Body',g.body],['Head',g.head]];
 parch(4,y,VW-8,13+rows.length*13);const NM=m.name.toUpperCase();pT(NM,10,y+3,IK.peat,pSize(NM,120,[8,7],PXf)||7,PXf);pT(m.trade,VW-10-pW(m.trade,14),y+1,IK.rust,14);let yy=y+14;
 rows.forEach(([l,it,hand])=>{pT(l,10,yy-1,IK.dim,14);if(hand)pR(58,yy+4,3,3,PAL.tallow);const nm=it?I[it.id].name+(I[it.id].dmg?' '+I[it.id].dmg:''):'—';
  pT(nm,63,yy-1,IK.peat,pSize(nm,VW-63-40,[14,13,12])||12);if(it){for(let q=0;q<3;q++)pR(VW-30+q*6,yy+3,4,5,q<3-(it.wear|0)?IK.moss:'rgba(90,62,43,.3)');const w=WEAR[it.wear|0];if(it.wear)pT(w,VW-34-pW(w,12),yy,IK.rust,12)}yy+=13});
 y=yy+5;
 // what the merc carries: a row per thing with its count, the picked one's use under the list
 const sl=m.slots,c=Math.min(IV.c|0,Math.max(0,sl.length-1)),it=sl[c],dsc=it?pWrap(I[it.id].desc||'',VW-22,14,3):[],h=14+Math.max(1,sl.length)*13+(dsc.length?dsc.length*12+4:0);
 parch(4,y,VW-8,h);pT('CARRIED',10,y+3,IK.peat,7,PXf);const sc=`slots ${sl.length} of 8`;pT(sc,VW-10-pW(sc,13),y+1,IK.dim,13);yy=y+14;
 if(!sl.length){pT('Nothing carried.',10,yy-1,IK.soot,14);yy+=13}
 sl.forEach((s2,k)=>{const on=k===c;if(on){pR(6,yy-1,VW-12,13,'rgba(217,180,90,.35)');StudioParch.seal(cx,13,yy+5,PT_)}const nm=I[s2.id].name+(s2.kit?'  (kit)':'');pT(nm,22,yy-1,IK.peat,pSize(nm,VW-60,[14,13,12])||12);
  const cn=s2.n>1?'×'+s2.n:'';if(cn)pT(cn,VW-12-pW(cn,14),yy-1,IK.rust,14);yy+=13});
 if(dsc.length){pR(10,yy+1,VW-20,1,'rgba(90,62,43,.5)');yy+=3;dsc.forEach(l=>{cx.font='italic '+VTf(14);cx.fillStyle=IK.soot;cx.textBaseline='top';cx.fillText(l,10,yy);yy+=12})}
 y+=h+4;
 // the pack: shared, with rations and the days they cover
 const days=Math.floor((r.rations|0)/Math.max(1,party.filter(p=>!p.dead).length)),pack=r.pack||[],room=Math.max(1,Math.floor((bot-y-18)/12)),shown=pack.slice(0,room);
 const ph=Math.min(bot-y-2,16+Math.max(1,shown.length)*12);parch(4,y,VW-8,ph);pT('PACK',10,y+3,IK.peat,7,PXf);const rs=`rations ${r.rations}/15 · ${days} day${days===1?'':'s'}`;pT(rs,VW-10-pW(rs,13),y+1,IK.dim,13);yy=y+14;
 if(!pack.length){cx.font='italic '+VTf(14);cx.fillStyle=IK.soot;cx.textBaseline='top';cx.fillText('Nothing in the pack.',10,yy-1)}
 shown.forEach(p=>{pT(I[p.id]?I[p.id].name+(p.n>1?' ×'+p.n:''):p.id,10,yy-1,IK.peat,14);yy+=12});if(pack.length>shown.length)pT(`and ${pack.length-shown.length} more`,VW-10-pW(`and ${pack.length-shown.length} more`,13),yy-13,IK.dim,13);
}

// ================= INPUT =================
function input(k){
 if(!G.active)return;
 if(EX){EX.press(k);return}
 if(G.mode==='battle'&&Bt&&!dlg&&!menu){battlePress(k);return}
 if(CV&&!dlg&&!menu){if(k==='a'||k==='b')closeCard();return}
 if(BV&&!dlg&&!menu){bestiaryPress(k);return}
 if(IV&&!dlg&&!menu){itemsPress(k);return}
 if(PM&&!dlg&&!menu){partyPress(k);return}
 if(dlg){if(k==='a'||k==='b'){if(!dlg.done)finishType();else closeDlg()}return}
 if(menu){const n=menu.items.length;
  if(k==='up'){menu.sel=(menu.sel-1+n)%n;renderMenu()}
  else if(k==='down'){menu.sel=(menu.sel+1)%n;renderMenu()}
  else if(k==='a'){const it=menu.items[menu.sel];if(it&&it.dis)return;closeMenu(menu.sel)}
  else if(k==='b'&&menu.cancel){closeMenu(-1)}
  else if(k==='select'&&menu.onSelect){const i=menu.onSelect();if(i>=0)closeMenu(i)}
  return}
 if(G.mode==='region'){regionPress(k);return}
 if(k==='select'){mapSelect();return}
 if(G.mode==='world'&&!G.busy&&!G.mv){if(k==='a')run(interact);else if(k==='start')run(pauseMenu)}
}
function hold(d,on){held=StudioMove.hold(held,d,on)}
dhost.addEventListener('click',e=>{if(!e.target.closest('.bld'))return;const li=e.target.closest('.bld-c li');
 if(menu){if(!li||!menu.inBox)return;const i=[...li.parentNode.children].indexOf(li);if(menu.sel!==i){menu.sel=i;renderMenu()}}input('a')});
menuEl.addEventListener('click',e=>{const el=e.target.closest('.gi');if(!el||!menu)return;const i=+el.dataset.i;if(menu.sel!==i){menu.sel=i;renderMenu()}input('a')});
// The shelf's Continue button opens straight into the run (studio-bible/launcher.md, Title cards); with none, the title.
window.addEventListener('load',()=>{if(!(window.Studio&&Studio.continued)||G.active)return;resume()});
// Saves on close, so closing the phone mid-walk loses nothing
window.addEventListener('pagehide',()=>{if(G.active)saveRun()});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&G.active)saveRun()});
// A canvas tap goes to the battle, the party list or the items page when one is open
cv.addEventListener('click',e=>{if(!G.active)return;const r=cv.getBoundingClientRect();if(!r.width)return;
 const x=(e.clientX-r.left)*VW/r.width,y=(e.clientY-r.top)*VH/r.height;if(CV){closeCard();return}if(BV){bestiaryPress(y<VH/2?'up':'down');return}if(G.mode==='battle'&&Bt)battleTap(x,y);else if(IV)itemsPress(x<VW/3?'l':x>VW*2/3?'r':'b');else if(PM)partyTap(x,y);else if(G.mode==='region'&&!menu&&!dlg)regionTap(x,y)});

// ================= NEW RUNS FOR THE CHECKS (spec 003; src/CLAUDE.md rule 5) =================
// RLG.newRun(seed): makes the first company a seed offers, checks every template's mercs against the rules, signs on
// the Free Company and lands in the stand-in town. Returns {ok, problems}.
async function newRun(seedArg){
 const seed=typeof seedArg==='number'?B.seedText(Math.abs(seedArg)%260000):String(seedArg),problems=[],T_=RLS.TRADES;
 const d=B._t.draftFor(seed);
 RLS.TEMPLATES.forEach((tp,ti)=>{if(!tp.trades.length)return;B._t.pickTemplate(ti);d.seats.forEach(c=>{const m=B.build(c),tr=B.tradeOf(c.trade);
  RLS.STATS.forEach(k=>{if(m.stats[k]<3||m.stats[k]>18)problems.push(`${tp.name}: ${m.name} ${k} ${m.stats[k]}`)});
  Object.keys(RLS.SKILLS).forEach(k=>{const raw=m.sk[k]-(k==='Stealth'?(RLS.SIZE[m.size].Stealth|0):0)-((RLS.SPECIES[m.sp].skill||{})[k]|0);if(raw>80)problems.push(`${tp.name}: ${m.name} ${k} ${m.sk[k]}`)});
  tr.strong.forEach(k=>{const raw=m.sk[k]-(k==='Stealth'?(RLS.SIZE[m.size].Stealth|0):0)-((RLS.SPECIES[m.sp].skill||{})[k]|0);if(raw!==70)problems.push(`${tp.name}: ${m.name} strong ${k} at ${raw}`)});
  if(m.gear.w1.id!==tr.weapon||m.slots[0].id!==tr.kit||m.slots[0].n!==tr.n)problems.push(`${tp.name}: ${m.name} has the wrong kit`)})});
 const names=d.used.slice();if(new Set(names).size!==names.length)problems.push('a name repeats in the run');
 B._t.draftFor(seed);B._t.signOn();await sleep(50);
 if(!G.active||party.length!==3)problems.push('the company did not sign on');
 return {ok:!problems.length,problems};
}
window.RLG={begin,resume,input,hold,newRun,saveRun,dev:o=>{G.dev=Object.assign(G.dev||{},o);return G.dev},get active(){return G.active},
 _t:{start:testStart,sim,simSeq,foe:(k,o)=>foe(k,o),fight:(o={})=>{run(async()=>{const r=await battle([foe('manatarms'),foe('manatarms')],Object.assign({roamer:true,bg:'dusk',countdown:{label:'COUNT',n:12}},o));G.lastFight=r});return true},
  go:(m,x,y)=>goMap(m,x,y,'right'),G:()=>G,party:()=>party,Bt:()=>Bt,PM:()=>PM,IV:()=>IV,EX:()=>EX,lead:()=>G.lead|0,quit}};

// ================= TEST HOOKS (the automatic checks only) =================
// The checks' fight (spec 002's test fight, replaced in D1 by a real card): two men-at-arms, as the reeve's men
function testStart(seed){if(!G.active)newRun(seed||'0001-A')}
// a sequence of fights on one company (a job's fights in order), HP and statuses carried between them; per run: how many
// different mercs went down, how many died, and whether every fight was won. o.level raises the company first.
async function simSeq(seed,mks,n,o={}){
 await newRun(seed);if(o.level){for(const m of party){m.lvl=o.level;m.mhp+=o.level-1;m.hp=m.mhp;const sk=RLS.TRADES.find(t=>t.id===m.tradeId).strong;for(let i=0;i<(o.level-1)*2;i++){const k=sk[i%2];m.sk[k]=Math.min(95,m.sk[k]+5)}}}
 if(o.kit)o.kit(party);if(o.den)G.run.den=Object.assign({},o.den);const base=JSON.parse(JSON.stringify(party)),out=[];
 G.auto={cmd:()=>0,list:(t,rows)=>Math.max(0,rows.findIndex(r=>!r.dis)),menu:items=>Math.max(0,items.indexOf('Leave')),choice:()=>0,yield:o.yieldPick||(()=>0),smart:true};
 for(let i=0;i<n;i++){party=JSON.parse(JSON.stringify(base));G.lead=0;G.run.party=party;G.run.job={id:'sim',sanLost:{},horrors:{}};const downed=new Set();let won=true,rounds=0;
  const client=o.client?{hp:12,mhp:12,alive:true}:null;
  for(const mk of mks){if(party.every(m=>m.dead||m.ko))break;const res=await battle(mk(i),Object.assign({},o.battle?(typeof o.battle==='function'?o.battle():o.battle):{},client?{client}:{}));party.forEach(m=>{if(m.downs)downed.add(m.id)});rounds+=(G.lastStats||{}).rounds|0;if(res!=='win'){won=false;break}}
  out.push({clientAlive:client?client.hp>0:null,won,downed:downed.size,dead:party.filter(m=>m.dead).length,rounds,hp:party.reduce((a,m)=>a+m.hp,0),san:base.reduce((a,m,j)=>a+(m.san-party[j].san),0)})}
 G.auto=null;G.run.job=null;return out}
// Tuning sims (spec 004 onward): the seed's Free Company, fresh each fight, against foes made by mk(), auto-played
// (Fight, at the first target), with the run's own dice. Returns one row per fight.
async function sim(seed,mk,n,o={}){
 await newRun(seed);const base=JSON.parse(JSON.stringify(party)),out=[];
 G.auto={cmd:()=>0,list:(t,rows)=>Math.max(0,rows.findIndex(r=>!r.dis)),menu:items=>Math.max(0,items.indexOf('Leave')),choice:()=>0,smart:true};
 for(let i=0;i<n;i++){party=JSON.parse(JSON.stringify(base));G.lead=0;G.run.party=party;G.run.rations=o.rations==null?9:o.rations;
  const hp0=party.reduce((a,m)=>a+m.hp,0),r0=G.run.rations;
  const res=await battle(mk(),Object.assign({},o.battle||{}));
  out.push({res,downs:party.filter(m=>m.downs).length,hpLost:hp0-party.reduce((a,m)=>a+m.hp,0),taken:(G.lastStats||{}).took|0,netRations:r0-G.run.rations,rounds:(G.lastStats||{}).rounds|0})}
 G.auto=null;return out}
