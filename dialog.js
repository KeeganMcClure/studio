// Black Lantern dialog box · "Lantern Bust" · chosen Nov 15, 2026.
// Sits at the bottom of the game screen, over the map, inside the GBA shell.
// The 64 x 64 portrait stands on top of the box at the map's pixel size; the name hangs on a tab beside it.
// BLD.render(host, state) draws ONE still frame of the box into host (any element with position:relative).
// The game's typewriter and mouth flap call render again on each tick, using BLD.TIMING.
//
// state = {
//   name:     'BIG HAT' | 'SIGN' | ...   speaker tag, shown in caps (omit for narration)
//   portrait: (ctx, mouth) => draws 64 x 64, mouth 0 shut / 1 open   (omit for signs and narration)
//   text:     the page of text (3 lines at most; about 22 letters a line on the smallest phone)
//   typed:    letters shown so far (omit = whole page shown)
//   mouth:    0 or 1, passed to portrait
//   more:     true shows the blinking down arrow (page done, more to come or press A to close)
//   choices:  ['Yes, sir.', ...] with sel: index of the highlighted one; text becomes the prompt line
//   narrate:  true for narration: no tab, lavender text
//   scale:    game pixel size in CSS px (2 on iPhone SE; same as the map's scale)
// }
const BLD=(()=>{
const COLORS={
  box:'rgba(13,19,34,.94)', // navy box, lets a hint of the map through
  boxSolid:'#0d1322',       // tab fill, so the tab hides the box's top edge
  edge:'#ebe5c8',           // cream border, 1 game px
  ring:'#05040a',           // near-black outer ring, 1 game px
  text:'#ebe5c8',           // speech
  name:'#ffd166',           // speaker tag, more arrow, choice cursor
  narr:'#b9aee8',           // narration text
  prompt:'#9a93c4',         // the question line above choices
  cursorBg:'#22305a'        // highlighted choice row
};
const TIMING={
  letterMs:30,   // one letter every 30 ms
  stopMs:200,    // extra pause after . ! ?
  commaMs:100,   // extra pause after , ; :
  flapMs:140,    // mouth frame length (Bible)
  burst:6,       // flap frames per burst (open, shut, open, shut, open, shut)
  rest:2,        // shut frames between bursts
  moreBlinkMs:500// more arrow: 500 ms on, 500 ms off
};
const F={px:'"Press Start 2P",ui-monospace,Menlo,monospace',vt:'"VT323",ui-monospace,Menlo,monospace'};
const C=COLORS,U=n=>`calc(var(--u) * ${n})`;
const CSS=`
.bld{--u:2px;position:absolute;left:${U(2)};right:${U(2)};bottom:${U(2)};box-sizing:border-box;background:${C.box};border:var(--u) solid ${C.edge};box-shadow:0 0 0 var(--u) ${C.ring};border-radius:var(--u);padding:${U(4)} ${U(5)} ${U(7)};color:${C.text};font:${U(9.5)}/1 ${F.vt};text-align:left;-webkit-font-smoothing:none}
.bld-bust{position:absolute;left:${U(2)};bottom:100%;margin-bottom:calc(var(--u) * -1);border:var(--u) solid ${C.edge};box-shadow:0 0 0 var(--u) ${C.ring};line-height:0}
.bld-bust canvas{display:block;width:${U(64)};height:${U(64)};image-rendering:pixelated;image-rendering:crisp-edges}
.bld-tab{position:absolute;bottom:100%;margin-bottom:calc(var(--u) * -1);left:${U(69)};max-width:calc(100% - ${U(71)});box-sizing:border-box;background:${C.boxSolid};border:var(--u) solid ${C.edge};border-bottom-color:${C.boxSolid};padding:${U(3)} ${U(3)} ${U(2.5)};font:${U(4)}/1 ${F.px};letter-spacing:.04em;color:${C.name};white-space:nowrap;overflow:hidden}
.bld-tab.small{font-size:${U(3)};padding-top:${U(3.5)}}
.bld.np .bld-tab{left:${U(3)};max-width:calc(100% - ${U(6)})}
.bld-t{margin:0;min-height:${U(28.5)};overflow-wrap:break-word}
.bld-t .rest{visibility:hidden}
.bld.narr .bld-t{color:${C.narr}}
.bld-q{min-height:0;color:${C.prompt}}
.bld-c{list-style:none;margin:${U(1)} 0 0;padding:0;display:grid;gap:${U(1)}}
.bld-c li{position:relative;padding:${U(1)} ${U(2)} ${U(1)} ${U(7)}}
.bld-c li.on{background:${C.cursorBg}}
.bld-cur{position:absolute;left:${U(2)};top:50%;margin-top:${U(-2.5)};width:${U(3)};height:${U(5)};display:block}
.bld-more{position:absolute;right:${U(4)};bottom:${U(3)};width:${U(5)};height:${U(3)};display:block}`;
function css(){if(document.getElementById('bld-css'))return;const s=document.createElement('style');s.id='bld-css';s.textContent=CSS;document.head.append(s)}
// pixel arrows: more = 5 x 3 game px pointing down, cursor = 3 x 5 pointing right
const svg=(cls,w,h,rects)=>`<svg class="${cls}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges" aria-hidden="true">${rects.map(([x,y,a,b])=>`<rect x="${x}" y="${y}" width="${a}" height="${b}" fill="${C.name}"/>`).join('')}</svg>`;
const MORE=svg('bld-more',5,3,[[0,0,5,1],[1,1,3,1],[2,2,1,1]]);
const CUR=svg('bld-cur',3,5,[[0,0,1,5],[1,1,1,3],[2,2,1,1]]);
const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
function render(host,s){
  css();const old=host.querySelector(':scope > .bld');if(old)old.remove();
  const b=el('div','bld'+(s.portrait?'':' np')+(s.narrate?' narr':''));b.style.setProperty('--u',(s.scale||2)+'px');
  b.setAttribute('role','dialog');b.setAttribute('aria-label',s.narrate?'Narration':(s.name||'Dialog'));
  if(s.portrait){const f=el('div','bld-bust'),c=el('canvas');c.width=c.height=64;s.portrait(c.getContext('2d'),s.mouth?1:0);f.append(c);b.append(f)}
  if(s.name&&!s.narrate)b.append(el('span','bld-tab',s.name.toUpperCase()));
  if(s.choices){
    if(s.text)b.append(el('p','bld-t bld-q',s.text));
    const ul=el('ul','bld-c');s.choices.forEach((t,i)=>{const li=el('li',i===s.sel?'on':'',t);if(i===s.sel)li.insertAdjacentHTML('afterbegin',CUR);ul.append(li)});b.append(ul);
  }else{
    // untyped letters are laid out but hidden, so words never jump lines while typing
    const p=el('p','bld-t'),n=s.typed==null?s.text.length:s.typed;p.append(s.text.slice(0,n));if(n<s.text.length)p.append(el('span','rest',s.text.slice(n)));b.append(p);
  }
  if(s.more)b.insertAdjacentHTML('beforeend',MORE);
  host.append(b);
  // long names: tags up to 9 letters fit at full size; 10 to 13 step down one size. Write tags at 13 letters or fewer.
  const fit=()=>{const t=b.querySelector('.bld-tab');if(t&&t.scrollWidth>t.clientWidth+1)t.classList.add('small')};
  fit();if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);
  return b;
}
return{COLORS,TIMING,CSS,render};
})();
