// Rushlight (forked from Black Lantern, Nov 21, 2026) · engine.js
// Game engine: map walking, dialog and menus, sanity, saves, pause, input. Exposes window.RLG.
// The battle is battle.js and the party menu party-menu.js (both on the studio's shared engine/ pieces, spec 002).
// Loaded as a plain script (no wrapper) so content files can call say, ask, battle, checkpoint and the rest.
const B=window.RL;
const $=s=>document.querySelector(s);
const scr=$('#screen'),gEl=$('#game'),cv=$('#gcv'),cx=cv.getContext('2d');
const dhost=$('#gdlg'),menuEl=$('#gmenu'),hud=$('#ghud'),ban=$('#gban'),fadeEl=$('#gfade'),sanEl=$('#gsan');
const {pick,esc,store,SKIN,HAIRC}=B;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
let VW=240,VH=160;
let G={active:false,lead:0},Bt=null,party=[],raf=0,dlg=null,menu=null,held=[];
const lead=()=>party[G.lead|0]||party[0];  // a lead index, not the first seat (spec 002; Select cycles it, party-menu.js)
const DIRS=StudioMove.DIRS;  // walking, the camera and the canvas fit are shared: engine/move.js

// ================= DATA =================
const BLOCK=new Set('TCB#DLlPHFSVKkYyNpGWIOX'.split(''));

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

// ================= SPRITES =================
// Townsfolk only (old 16 x 16 look until the Still Harvest rebuild). Agents use agent-sprite.js.
function drawChar(x,y,look,oc,dir,f,o={}){
 const P=(a,b,w,h,c)=>{cx.fillStyle=c;cx.fillRect(x+a,y+b,w,h)};
 const sk=SKIN[look.skin],hc=HAIRC[look.hairC],bob=f?1:0;
 P(3,14,10,2,'rgba(0,0,0,.3)');
 P(5,12,2,3-(f===1?1:0),'#2a2433');P(9,12,2,3-(f===2?1:0),'#2a2433');
 P(4,7+bob,8,6-bob,oc);P(3,8+bob,1,4,oc);P(12,8+bob,1,4,oc);P(3,12,1,1,sk);P(12,12,1,1,sk);
 if(o.sack){P(4,0+bob,8,8,'#c9a36a');P(4,7+bob,8,1,'#8a6a2a');if(dir!=='up'){P(5,3+bob,2,2,'#111');P(9,3+bob,2,2,'#111');P(5,6+bob,6,1,'#2a1a10')}return}
 P(4,1+bob,8,7,sk);
 if(look.hair!==3&&look.hair!==2){P(4,0+bob,8,2,hc);if(dir==='up')P(4,1+bob,8,5,hc);if(look.hair===1||look.hair===6){P(3,1+bob,1,6,hc);P(12,1+bob,1,6,hc)}if(look.hair===4)P(6,-2+bob,4,2,hc);if(look.hair===5){P(7,-2+bob,2,3,hc)}}
 else if(look.hair===2)P(4,0+bob,8,1,hc);
 const E='#120c1c';
 if(dir==='down'){P(6,4+bob,1,2,E);P(9,4+bob,1,2,E);if(look.acc===1||look.acc===2){P(5,4+bob,6,1,E)}if(look.acc===3)P(4,6+bob,8,2,hc)}
 else if(dir==='left'){P(5,4+bob,1,2,E);if(look.acc===3)P(4,6+bob,4,2,hc)}
 else if(dir==='right'){P(10,4+bob,1,2,E);if(look.acc===3)P(8,6+bob,4,2,hc)}
 if(o.hat)P(3,0+bob,10,2,o.hat);
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
 const rows=sel=>(m.title?`<div class="mt">${esc(m.title)}</div>`:'')+m.items.map((it,i)=>{const o=typeof it==='string'?{label:it}:it;return`<div class="gi ${i===sel?'on':''} ${o.dis?'dis':''}" data-i="${i}"><span class="gc">${i===sel?'▶':''}</span>${esc(o.label)}</div>`}).join('');
 // one fixed width, measured once when the menu opens from its widest row plus the cursor, never from the selected row
 if(!m.w)m.w=StudioMenu.lockWidth(menuEl,rows(-1));
 menuEl.innerHTML=rows(m.sel)+(m.desc&&m.desc[m.sel]?`<div class="md">${esc(m.desc[m.sel])}</div>`:'');
 if(m.onSel)m.onSel(m.sel);posMenu();const on=menuEl.querySelector('.gi.on');if(on)on.scrollIntoView({block:'nearest'})}
function posMenu(){if(menuEl.hidden)return;let b=6;const bx=dhost.querySelector('.bld'),tab=bx&&bx.querySelector('.bld-tab');
 if(G.mode==='battle'&&!hud.hidden)b=hud.offsetHeight+8;else if(bx)b=bx.offsetHeight+(tab?tab.offsetHeight:0)+10;menuEl.style.bottom=b+'px'}
function choose(items,o={}){return new Promise(res=>{menu={items,sel:o.sel||0,res,cancel:o.cancel,title:o.title,desc:o.desc,onSel:o.onSel,inBox:o.inBox};renderMenu()})}
function closeMenu(v){const m=menu;menu=null;menuEl.hidden=true;StudioMenu.unlock(menuEl);if(m.inBox&&box)box.choices=null;if(Bt)Bt.hover=-1;m.res(v)}
async function ask(name,text,opts){await say(name,text,{keep:true,instant:false});const r=await choose(opts,{cancel:true,inBox:true});hideTB();return r<0?opts.length-1:r}
function banner(t){ban.textContent=t;ban.hidden=false;clearTimeout(banner.t);banner.t=setTimeout(()=>ban.hidden=true,2200)}
function fade(on){fadeEl.style.opacity=on?1:0;return sleep(340)}
async function run(fn){G.busy=(G.busy||0)+1;try{await fn()}catch(e){console.error(e)}finally{G.busy--}}

// ================= SANITY =================
// Low SAN sours the picture toward SAN pink and cyan (engine/light.js, drawn in drawWorld); the thresholds are the old ones.
const LOOK={dark:'#1c1814',alpha:.9,warm:'#d9b45a',pink:'#ff4fa3',cyan:'#3ff0e8',sour:.6};
const sourFade={};
function applySan(){const m=lead();if(!m)return;const fr=clamp(m.san/m.msan,0,1);sanEl.innerHTML=`SAN <b class="${fr<.4?'red':''}">${m.san}</b>`;}

// ================= WORLD =================
function passable(x,y){const M=G.M;if(x<0||y<0||x>=M.w||y>=M.h)return false;if(BLOCK.has(M.g[y][x]))return false;if(M.npcs.some(n=>(!n.on||n.on())&&n.x===x&&n.y===y))return false;return true}
function goMap(name,x,y,dir){hud.hidden=true;gEl.classList.remove('battle');G.map=name;G.M=MAPS[name]();StudioMove.place(G,x,y,dir);
 banner(G.M.name);}
function update(){
 if(G.mode!=='world')return;
 StudioMove.update(G,StudioMove.last(held),{passable,busy:()=>G.busy||dlg||menu,arrive:()=>run(onStep)});
}
async function onStep(){const M=G.M,k=G.x+','+G.y;if(M.warps&&M.warps[k]){held=[];return M.warps[k]()}if(M.onStep)await M.onStep()}
async function interact(){
 const [tx,ty]=StudioMove.ahead(G),M=G.M,k=tx+','+ty;
 const n=M.npcs.find(n=>(!n.on||n.on())&&n.x===tx&&n.y===ty);
 if(n){n.dir={up:'down',down:'up',left:'right',right:'left'}[G.dir];held=[];await n.talk(n);return}
 if(M.O[k]){held=[];await M.O[k]();return}
 const ch=M.g[ty]&&M.g[ty][tx];if(ch&&TILEDESC[ch]){held=[];await say('',TILEDESC[ch])}
}
function cam(){return StudioMove.camera(G,G.M.w,G.M.h,VW,VH)}
function drawWorld(){
 const M=G.M,[camx,camy]=cam();cx.fillStyle='#0a0710';cx.fillRect(0,0,VW,VH);
 const x0=Math.floor(camx/16),y0=Math.floor(camy/16);
 for(let ty=y0;ty<=y0+Math.ceil(VH/16)+1;ty++)for(let tx=x0;tx<=x0+Math.ceil(VW/16)+1;tx++){const ch=M.g[ty]&&M.g[ty][tx];if(!ch)continue;let v=(tx*7+ty*13)%4;if(ch==='V')v=M.vv[tx+','+ty];if(ch==='T')v=(tx*3+ty*5)%3;cx.drawImage(tile(ch,v),tx*16-camx,ty*16-camy)}
 const spr=[];
 M.npcs.forEach(n=>{if(n.on&&!n.on())return;spr.push({y:n.y*16,f:()=>drawChar(n.x*16-camx,n.y*16-camy-3,n.look,n.oc,n.dir,0,{sack:n.sack,hat:n.hat})})});
 const moving=!!G.mv,fr=StudioMove.walkFrame(G);
 // Only the lead walks the map (Bible, Art, Maps). Agent sprites from agent-sprite.js; lantern at night only; a blink every few seconds.
 const blink=!moving&&(performance.now()%3400)<150?1:0;
 spr.push({y:G.py,f:()=>{const s=RLSP.map(lead().sp,lead().look);cx.drawImage(s,Math.round(G.px+1-camx),Math.round(G.py+16-26-camy+(moving&&fr%2?-1:0)))}});
 spr.sort((a,b)=>a.y-b.y).forEach(s=>s.f());
 lights(M,camx,camy);
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
function loop(now){if(!G.active)return;const n=clock.ticks(now);if(!n){raf=requestAnimationFrame(loop);return}try{for(let i=0;i<n;i++)update();if(G.mode==='battle'&&Bt)drawBattle();else if(PM)drawParty();else if(G.mode==='world')drawWorld();else drawTitleCard();drawBox()}catch(e){console.error(e)}raf=requestAnimationFrame(loop)}
function fit(){const v=StudioMove.fit(gEl,cv);if(!v)return;VW=v.w;VH=v.h;gEl.style.setProperty('--pu',(64*v.boxW/VW)+'px');boxKey='';if(menu&&!menu.inBox){menu.w=0;renderMenu()}posMenu()}
window.addEventListener('resize',()=>{if(G.active)fit()});

async function gameOver(){
 held=[];G.mode='scene';
 const L=lead();
 await say('',L.san<=0?'{merc} walks off into the dark and does not come back.':'{merc} doesn\'t get up.');
 const r=await ask('','The file stays open.',['Retry from checkpoint','Quit to title']);
 if(r===0){await fade(1);restore(G.cp);await fade(0)}else quit();
}

// ================= SAVE / FLOW =================
function snap(){return JSON.stringify({map:G.map,x:G.x,y:G.y,dir:G.dir,party,lead:G.lead|0,flags:G.flags,kit:G.kit})}
function checkpoint(){G.cp=snap();store.set(B.key('game'),G.cp)}
function restore(s){const o=JSON.parse(s);party=o.party;G.lead=o.lead|0;G.flags=o.flags||{};G.kit=o.kit||{};G.mode='world';goMap(o.map,o.x,o.y,o.dir);applySan()}
function enter(){G.active=true;scr.classList.add('gaming');sanEl.hidden=false;fit();cancelAnimationFrame(raf);clock.reset();raf=requestAnimationFrame(loop)}
function leave(){G.active=false;PM=null;cancelAnimationFrame(raf);scr.classList.remove('gaming','glitch');scr.style.filter='';$('#vig').style.opacity=0;box=null;boxKey='';dhost.replaceChildren();menuEl.hidden=true;hud.hidden=true;if(dlg)clearTimeout(dlg.to);dlg=null;menu=null;Bt=null;held=[]}
function quit(){checkpoint();leave();B.goto('title');B.render()}
// Until Part A makes real mercs, Black Lantern's creator still hands over agents; each becomes a stand-in merc.
function member(a,i){return testMerc(i)}
async function start(agent,squad){
 party=[member(agent,0),...squad.map((a,i)=>member(a,i+1))];
 G=Object.assign(G,{active:true,lead:0,flags:{},kit:{bandage:2},busy:0,mode:'scene',scene:null});
 MAZE=null;enter();applySan();
 run(caseOpening);
}
function resume(){const s=store.get(B.key('game'),null);if(!s)return false;G=Object.assign(G,{active:true,busy:0,mode:'world'});MAZE=null;enter();restore(s);G.cp=s;return true}

// ================= PAUSE =================
async function pauseMenu(){
 held=[];
 for(;;){
  const r=await choose(['Party','Save & quit','Close'],{cancel:true,title:'MENU · '+G.M.name});
  if(r===0){await openParty()}
  else if(r===1){quit();return}
  else return;
 }
}

// ================= INPUT =================
function input(k){
 if(!G.active)return;
 if(G.mode==='battle'&&Bt&&!dlg&&!menu){battlePress(k);return}
 if(PM&&!dlg&&!menu){partyPress(k);return}
 if(dlg){if(k==='a'||k==='b'){if(!dlg.done)finishType();else closeDlg()}return}
 if(menu){const n=menu.items.length;
  if(k==='up'){menu.sel=(menu.sel-1+n)%n;renderMenu()}
  else if(k==='down'){menu.sel=(menu.sel+1)%n;renderMenu()}
  else if(k==='a'){const it=menu.items[menu.sel];if(it&&it.dis)return;closeMenu(menu.sel)}
  else if(k==='b'&&menu.cancel){closeMenu(-1)}
  return}
 if(k==='select'){mapSelect();return}
 if(G.mode==='world'&&!G.busy&&!G.mv){if(k==='a')run(interact);else if(k==='start')run(pauseMenu)}
}
function hold(d,on){held=StudioMove.hold(held,d,on)}
dhost.addEventListener('click',e=>{if(!e.target.closest('.bld'))return;const li=e.target.closest('.bld-c li');
 if(menu){if(!li||!menu.inBox)return;const i=[...li.parentNode.children].indexOf(li);if(menu.sel!==i){menu.sel=i;renderMenu()}}input('a')});
menuEl.addEventListener('click',e=>{const el=e.target.closest('.gi');if(!el||!menu)return;const i=+el.dataset.i;if(menu.sel!==i){menu.sel=i;renderMenu()}input('a')});
// The shelf's Continue button opens straight into the save (studio-bible/launcher.md, Title cards): the
// checkpoint if there is one, else the agent draft's dossier; with neither, the title screen opens as usual.
window.addEventListener('load',()=>{if(!(window.Studio&&Studio.continued)||G.active)return;
 if(resume())return;if(B.S.a&&B.S.a.prof){B.goto('dossier');B.render()}});
// A canvas tap goes to the battle or the party list when either is open
cv.addEventListener('click',e=>{if(!G.active)return;const r=cv.getBoundingClientRect();if(!r.width)return;
 const x=(e.clientX-r.left)*VW/r.width,y=(e.clientY-r.top)*VH/r.height;if(G.mode==='battle'&&Bt)battleTap(x,y);else if(PM)partyTap(x,y)});

// ================= TEST HOOKS (the automatic checks only; spec 002) =================
// A test party, a small test map and a test fight against one stand-in enemy. The enemy's numbers are placeholders,
// not the Noonwife's real card (the real fights come with spec Part D).
function testMerc(i){const T=[{name:'Ostra',sp:'badger',str:15,dex:9,hp:13,wp:11,san:55,sk:{Melee:70,Athletics:70,Dodge:60},w:{name:'Halberd',skill:'Melee',dmg:'1d10',melee:true}},
 {name:'Wendel',sp:'hare',str:10,dex:15,hp:10,wp:12,san:60,sk:{Shooting:70,Dodge:70,Search:50,Athletics:40},w:{name:'Crossbow',skill:'Shooting',dmg:'2d6+3'}},
 {name:'Tomas',sp:'rat',str:9,dex:12,hp:9,wp:13,san:65,sk:{Medicine:70,'First Aid':70,Melee:30,Athletics:30},w:{name:'Knife',skill:'Melee',dmg:'1d6',melee:true}}][i%3];
 return Object.assign({look:{shade:1,mark:0,neck:0},mhp:T.hp,mwp:T.wp,msan:T.san,ko:false},JSON.parse(JSON.stringify(T)))}
const TEST_FOE={name:'Stand-in',lvl:1,skulls:1,hp:16,dex:11,hit:45,dmg:'1d4+1',sprite:'noonwife',faceless:true,known:false,foe:true};
const testMap=()=>{const g=mk(16,10,'.');rect(g,0,4,16,1,',');g[2][3]='L';return{name:'TEST LANE',w:16,h:10,g,npcs:[],O:{},vv:{}}};
function testStart(){MAPS.test=testMap;party=[0,1,2].map(testMerc);G=Object.assign(G,{active:true,lead:0,flags:{},kit:{bandage:2},busy:0,mode:'world'});enter();goMap('test',4,4,'right');applySan()}
window.RLG={start,resume,input,hold,get active(){return G.active},
 _t:{start:testStart,fight:(o={})=>{run(async()=>{const r=await battle([Object.assign({},TEST_FOE)],Object.assign({roamer:true,bg:'noon',countdown:{label:'NOON BELL',n:12}},o));G.lastFight=r});return true},
  go:(m,x,y)=>goMap(m,x,y,'right'),G:()=>G,party:()=>party,Bt:()=>Bt,PM:()=>PM,lead:()=>G.lead|0}};

