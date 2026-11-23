// Black Lantern · cases/lost-hour-battle-art.js · Lost Hour's battle art and set-piece pictures (spec 016 part B, Nov 23, 2026).
// Made the way Good Manners' is (cases/good-manners-battle-art.js, GMB): big head-on battle sprites with the light rim,
// both damage steps for every enemy (Art, Townsfolk and monsters, Wounded enemies), the case's painted battle backdrops
// (Combat, Basics, Backgrounds) and the boss's 64 x 64 talking portrait; plus the pictures behind the case's two set
// pieces, the night drive and the hypnosis session. Art for this case only; it goes to the Asset Library's Lost Hour page.
// Lost Hour's accents: fog violet #c8b8ff, redbud pink, wet-asphalt blue, and one cold white light. Exposes window.LHB.
//   LHB.sprite(key, frame, step) -> cached canvas; frame 0/1 is the idle; step 0 unhurt, 1 at half HP, 2 at a quarter.
//      key: glim, stray, orderly, surveyor, surveyor2 (its second phase). The clean-up agent is Still Harvest's (SHB).
//   LHB.size(key) -> [w, h]   LHB.portrait(ctx, open) draws THE SURVEYOR's face
//   LHB.backdrop(place, {w, h, light, low, feet, rain}) -> the backdrop for 'town' (rain: the day-2 rain), 'ridge',
//      'woods', 'field', and each room a fight can reach: 'clinic' (the old bank lobby), 'exam', 'lab', 'kitchen',
//      'bedroom', 'diner'
//   LHB.card(ctx, x, y, open)       the folded card (open: Jenna's card opened, with what was inside), at 1x
//   LHB.drive(ctx, W, H, t, o)      the night drive: through the windshield, up the ridge road in fog (t: ms since it began)
//   LHB.session(ctx, W, H, t, stage, card) the hypnosis session: the sleep lab bed and the one-way window, where what's
//      remembered plays (stage 0 nothing yet, 1 the tables, 2 the question, 3 the inside of the light); card 1: the
//      folded card in Donna's hands on the blanket, 2: open in her lap
window.LHB=(()=>{
const OL='#100c1a',D='#1c1426',W='#f4efe6',COLD='#eef4ff',FOG='#c8b8ff',FOGD='#8a7ab8';
const sh=(h,a)=>{const n=parseInt(h.slice(1),16),f=v=>Math.max(0,Math.min(255,Math.round(v+a)));return'#'+[n>>16,n>>8&255,n&255].map(v=>f(v).toString(16).padStart(2,'0')).join('')};
// a pixel layer w × h in drawing coordinates; ox adds room either side (a wounded sprite leans and spills past its box)
function Ly(w,h,ox=0){const WW=w+2*ox,d=new Array(WW*h).fill(null);const L={w,h,d,W:WW,ox,
 g:(x,y)=>{x=Math.round(x)+ox;y=Math.round(y);return(x<0||y<0||x>=WW||y>=h)?null:d[y*WW+x]},
 p(x,y,c){x=Math.round(x)+ox;y=Math.round(y);if(x>=0&&y>=0&&x<WW&&y<h)d[y*WW+x]=c},
 r(x,y,a,b,c){for(let j=0;j<b;j++)for(let i=0;i<a;i++)L.p(x+i,y+j,c)},
 rm(x,y,a,b,c){for(let j=0;j<b;j++)for(let i=0;i<a;i++)if(L.g(x+i,y+j))L.p(x+i,y+j,c)},
 e(cx,cy,rx,ry,c){for(let y=Math.floor(cy-ry);y<=cy+ry;y++)for(let x=Math.floor(cx-rx);x<=cx+rx;x++){const a=(x+.5-cx)/rx,b=(y+.5-cy)/ry;if(a*a+b*b<=1)L.p(x,y,c)}},
 em(cx,cy,rx,ry,c){for(let y=Math.floor(cy-ry);y<=cy+ry;y++)for(let x=Math.floor(cx-rx);x<=cx+rx;x++){const a=(x+.5-cx)/rx,b=(y+.5-cy)/ry;if(a*a+b*b<=1&&L.g(x,y))L.p(x,y,c)}},
 line(x0,y0,x1,y1,c,w=1){const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);for(let i=0;i<=n;i++){const x=Math.round(x0+(x1-x0)*i/n),y=Math.round(y0+(y1-y0)*i/n);L.r(x,y,w,w,c)}},
 tex(from,to,m=7){for(let y=0;y<h;y++)for(let x=-ox;x<w+ox;x++)if(L.g(x,y)===from&&(x*3+y*5)%m===0)L.p(x,y,to)}};return L}
// light from the upper left: the lit edge gets a rim, every edge a dark outline. Cold-light pixels keep no outline,
// so a glow reads as a glow.
const GLOWC=new Set([COLD,'#ffffff','#dfe8ff']);
function finish(L){const w=L.W,{h,d}=L,o=d.slice(),G=(x,y)=>(x<0||y<0||x>=w||y>=h)?null:d[y*w+x];for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x,v=d[i];
 if(v){if(!GLOWC.has(v)&&((x>0&&!G(x-1,y))||(y>0&&!G(x,y-1))))o[i]=sh(v,30)}
 else{const n=[G(x-1,y),G(x+1,y),G(x,y-1),G(x,y+1)].filter(Boolean);if(n.length&&!n.every(c=>GLOWC.has(c)))o[i]=OL}}return o}
function blit(c,L,ox=0,oy=0){const o=finish(L),w=L.W;for(let i=0;i<o.length;i++)if(o[i]){c.fillStyle=o[i];c.fillRect(ox+i%w,oy+(i/w|0),1,1)}}

// ================= THE ENEMIES =================
const PALE='#d8d4e4',PALED='#a8a2bc',PALEDD='#787090',STEEL='#9aa4b4',STEELL='#d0d8e4';
const B={
// Glims: a fist-sized cold light hanging on a string from nothing, a halo of fog violet, three little filaments
// trailing under it like a jellyfish's. Frame 1 bobs a pixel.
glim:{name:'Glim',w:26,h:34,f(L,f){const y0=f?1:0;
 L.line(13,0,13,8+y0,'#5a5478');
 L.e(13,17+y0,10,10,FOGD);L.e(13,17+y0,8,8,FOG);L.e(13,17+y0,5.5,5.5,'#dfe8ff');L.e(13,16+y0,3.5,3.5,COLD);L.e(12,15+y0,1.5,1.5,'#ffffff');
 for(const [x,k] of[[8,0],[13,1],[18,2]]){for(let j=0;j<7;j++)L.p(x+((j+k+f)%3===0?1:(j+k+f)%3===1?0:-1),26+y0+j,j<4?FOG:FOGD)}}},
// The stray: a deer that came back wrong. Seen from behind, walking backward toward you; its head is turned all the way
// round over its shoulder to look at you, with cold white eyes. A ring burned on its back, round as a plate.
stray:{name:'Stray',w:62,h:60,f(L,f){const hd='#8a5a34',hdd=sh(hd,-28),belly='#c8a070',t=f?1:0;
 // legs (back pair nearer), hooves
 for(const [x,d] of[[14,0],[24,1],[36,-1],[46,0]]){L.r(x,38,5,18+(d===1?t:0),d?hdd:hd);L.r(x,55,5,4,'#2a1a14')}
 // the body, the rump toward you, a white tail
 L.e(31,32,22,12,hd);L.e(31,36,18,7,sh(hd,-12));L.e(31,40,12,4,belly);L.tex(hd,hdd,9);
 L.e(31,26,5,4,'#f4ece0');L.e(31,25,3,2,'#ffffff');
 // the ring burned on its back: black at the edge, the hide inside it new and pale
 L.e(31,29,11,6,'#1a1014');L.e(31,29,9,4.5,'#e8d8c0');L.e(30,28,6,3,'#f4ece0');
 // the neck twisted round, the head facing you over its shoulder
 L.r(44,14,7,16,hd);L.r(46,12,6,6,hdd);L.e(49,10,8,7,hd);L.e(51,13,5,4,belly);L.r(49,15,4,2,'#2a1a14');
 L.e(43,4,3,5,hdd);L.e(56,4,3,5,hdd);L.e(43,5,1.5,3,'#c88a70');L.e(56,5,1.5,3,'#c88a70');
 L.r(45,8,3,3,COLD);L.r(52,8,3,3,COLD);L.p(46,9,'#ffffff');L.p(53,9,'#ffffff')}},
// The Orderly: a Measurer's assistant, bent nearly double under the ceiling. Pale and folded like a closed umbrella that
// grew a man; no face, just more folds. Too-long fingers end in instruments: a probe, a hook, a little silver mirror.
orderly:{name:'Orderly',w:60,h:110,f(L,f){const t=f?1:0;
 // two thin legs, knees bent the wrong way
 L.line(24,70,20,90,PALED,3);L.line(20,90,24,108,PALED,3);L.line(36,70,40,90,PALEDD,3);L.line(40,90,36,108,PALEDD,3);L.r(19,107,8,3,PALEDD);L.r(33,107,8,3,PALEDD);
 // the folded body: a long closed umbrella, ribs showing
 for(let y=16;y<76;y++){const hw=Math.round(4+Math.sin((y-16)/60*Math.PI)*12);L.r(30-hw,y,hw*2,1,PALE);L.r(30+hw-4,y,4,1,PALED)}
 for(let k=0;k<5;k++){const x=20+k*5;L.line(x,18,x+(k-2)*2,74,PALED)}
 // the head: a bent-over bundle of folds, no face
 L.e(30,10,10,9,PALE);for(let k=0;k<4;k++)L.line(22+k*5,3,24+k*4,18,PALED);L.e(28,8,3,2,sh(PALE,18));
 // the long arms down to the instruments
 L.line(18,24,8,56+t,PALE,3);L.line(8,56+t,6,80+t,PALED,2);L.line(42,24,52,54-t,PALE,3);L.line(52,54-t,54,76-t,PALED,2);
 L.line(6,80+t,4,92+t,STEEL);L.line(5,80+t,7,92+t,STEEL);L.p(4,93+t,STEELL);                        // the probe
 L.line(54,76-t,55,86-t,STEEL);L.line(55,86-t,51,90-t,STEEL);L.p(51,89-t,STEELL);                    // the hook
 L.e(2,84+t,2.5,2.5,STEELL);L.p(2,84+t,'#ffffff');L.line(6,82+t,3,84+t,PALED);                        // the mirror on a third finger
 L.e(58,80-t,2,2,STEELL);L.line(54,78-t,57,80-t,PALED)}},
// The boss: a Measurer. Nine feet of pale, jointed patience on legs like a surveyor's tripod, in a coat of folded fog;
// where a face should be, a lamp of cold white; its hands are calipers. Phase 2 ('surveyor2'): the coat comes open,
// and inside it's all hands, each holding an instrument.
surveyor:{name:'The Surveyor',w:96,h:128,f(L,f,ph2){const t=f?1:0;
 // the tripod legs
 L.line(40,78,22,126,PALED,3);L.line(56,78,74,126,PALEDD,3);L.line(48,80,48,126,PALED,3);
 for(const x of[22,48,74])L.r(x-3,124,7,4,PALEDD);
 // the coat of folded fog: layers, wider at the hem
 for(let y=34;y<92;y++){const hw=12+Math.round((y-34)*.42);L.r(48-hw,y,hw*2,1,'#9890b4');}
 for(let k=0;k<6;k++){const y=40+k*9;for(let x=-24;x<=24;x++){const yy=y+Math.round(Math.abs(x)*.25);if(L.g(48+x,yy))L.p(48+x,yy,'#6e6496')}}
 L.tex('#9890b4','#867ea6',8);
 if(ph2){L.r(38,40,20,52,'#2a2238');
  for(let k=0;k<6;k++){const hx=40+(k%2)*10,hy=46+k*7;L.r(hx,hy,7,3,PALE);L.line(hx+(k%2?7:0),hy+1,hx+(k%2?12:-5),hy-2,STEEL)}}
 // the shoulders and the long caliper arms
 L.e(48,34,18,6,'#c8c0dc');
 L.line(32,34,14,62+t,PALE,4);L.line(14,62+t,10,88+t,PALE,3);L.line(10,88+t,4,104+t,STEEL,2);L.line(10,88+t,14,106+t,STEEL,2);L.p(4,105+t,STEELL);L.p(14,107+t,STEELL);
 L.line(64,34,82,60-t,PALE,4);L.line(82,60-t,86,86-t,PALE,3);L.line(86,86-t,80,102-t,STEEL,2);L.line(86,86-t,92,102-t,STEEL,2);L.p(80,103-t,STEELL);L.p(92,103-t,STEELL);
 // the neck and the lamp where a face should be: a ring of pale bone round a cold white light
 L.r(44,20,8,14,PALED);L.e(48,14,15,14,PALEDD);L.e(48,14,13,12,PALE);L.e(48,14,10,9,'#dfe8ff');L.e(48,14,7,6,COLD);L.e(46,12,3,2,'#ffffff');
 for(let a=0;a<8;a++){const an=a/8*Math.PI*2;L.p(48+Math.cos(an)*12,14+Math.sin(an)*11,PALEDD)}
 if(ph2){L.e(48,14,4,3,'#ffffff')}}}
};

// ================= WOUNDED ENEMIES (Art, Townsfolk and monsters, Wounded enemies) =================
// Two steps: at half HP and at a quarter. Glims crack and go dim, then break and flicker in pieces. The stray bleeds
// dark and its ring spreads; then a leg goes. The Orderly's folds tear open onto nothing, then an arm is gone and it
// sags like a wet sheet. The Surveyor's coat splits onto cold light; then its lamp cracks and frost pours off it.
const WPAD=8,HOLLOW='#0c0814',BLOOD='#4a1020',BLOODW='#7a2034',FROST=['#e8f0ff','#c8d4f0','#a8b4d8'];
const grey=(h,k)=>{const n=parseInt(h.slice(1),16),r=n>>16,g=n>>8&255,b=n&255,l=(r*.3+g*.59+b*.11)*.82,f=v=>Math.max(0,Math.min(255,Math.round(v+(l-v)*k-k*18)));
 return'#'+[r,g,b].map(v=>f(v).toString(16).padStart(2,'0')).join('')};
const inBlob=(x,y,cx,cy,rx,ry,sd)=>{const a=(x+.5-cx)/rx,b=(y+.5-cy)/ry,t=Math.atan2(b,a),r=1+.22*Math.sin(5*t+sd)+.12*Math.sin(9*t+sd*2.3);return a*a+b*b<=r*r};
const blob=(L,cx,cy,rx,ry,sd,fn)=>{for(let y=Math.floor(cy-ry*1.4);y<=cy+ry*1.4;y++)for(let x=Math.floor(cx-rx*1.4);x<=cx+rx*1.4;x++)if(inBlob(x,y,cx,cy,rx,ry,sd))fn(x,y)};
const Wk={
 bite(L,cx,cy,rx,ry,sd=1){blob(L,cx,cy,rx,ry,sd,(x,y)=>{if(L.g(x,y))L.p(x,y,null)})},
 gash(L,cx,cy,rx,ry,sd=2,c=HOLLOW){blob(L,cx,cy,rx,ry,sd,(x,y)=>{if(L.g(x,y))L.p(x,y,c)})},
 stain(L,cx,cy,rx,ry,sd=3,c=BLOOD,c2=BLOODW){blob(L,cx,cy,rx,ry,sd,(x,y)=>{if(L.g(x,y))L.p(x,y,c)});blob(L,cx-rx*.15,cy-ry*.2,rx*.5,ry*.5,sd+1,(x,y)=>{if(L.g(x,y))L.p(x,y,c2)})},
 drip(L,x,y,n,c=BLOOD,any){for(let j=0;j<n;j++)for(const i of[0,1])if(any||L.g(x+i,y+j))L.p(x+i,y+j,c)},
 // a crack of cold light through a dark split
 crack(L,x0,y0,x1,y1,sd=0){const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);for(let i=0;i<=n;i++){const x=Math.round(x0+(x1-x0)*i/n+((i*7+sd)%3-1)),y=Math.round(y0+(y1-y0)*i/n);
  if(L.g(x,y)){L.p(x,y,COLD);if(L.g(x+1,y))L.p(x+1,y,HOLLOW)}}},
 // frost pouring from (x, y) to the ground row gy
 pour(L,x,y,w,gy,sd=0,cols=FROST){for(let i=0;i<w;i+=2){const top=y+((i*5+sd)%4),bot=gy-((i*3+sd)%3);for(let yy=top;yy<=bot;yy++){const wob=((yy+i+sd)>>2)%2;if((yy+i)%3)L.p(x+i+wob,yy,cols[(i>>1)%cols.length])}}},
 heap(L,cx,rx,ry=3,cols=FROST){const y=L.h-1;L.e(cx,y,rx,ry,cols[2]);L.e(cx-1,y,rx*.8,ry*.75,cols[1]);for(let i=1;i<rx*2-2;i+=3)L.line(cx-rx+i,y-ry+2,cx-rx+i+2,y-ry,cols[0])},
 dull(L,x0,x1,amt){const d=x1>x0?1:-1;for(let y=0;y<L.h;y++)for(let x=x0;d>0?x<=x1:x>=x1;x+=d){const v=L.g(x,y);if(!v||GLOWC.has(v)||FROST.includes(v))continue;L.p(x,y,grey(v,amt*Math.min(1,.4+.6*Math.abs(x-x0)/Math.max(1,Math.abs(x1-x0)))))}},
 dim(L,amt){for(let i=0;i<L.d.length;i++){const v=L.d[i];if(v&&v[0]==='#')L.d[i]=sh(v,-amt)}},
 lean(L,dx,y0,y1){const W=L.W,d=L.d;for(let y=0;y<y1;y++){const s=Math.round(dx*Math.min(1,(y1-y)/Math.max(1,y1-y0)));if(!s)continue;const row=d.slice(y*W,y*W+W);for(let x=0;x<W;x++){const sx=x-s;d[y*W+x]=sx>=0&&sx<W?row[sx]:null}}},
 sag(L,x0,y0,w,h,dy,dx=0){const px=[];for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++){const v=L.g(x,y);if(v){px.push([x,y,v]);L.p(x,y,null)}}px.forEach(([x,y,v])=>L.p(x+dx,y+dy,v))},
 cut(L,x,y,w,h){for(let j=0;j<h;j++)for(let i=0;i<w;i++)L.p(x+i,y+j,null)}
};
const WOUND={
// a Glim: a dark crack across the light and the halo thins; then half of it's gone and the pieces hang apart
glim(L,s){
 if(s===1){Wk.gash(L,11,17,1.5,6,2);Wk.bite(L,20,12,3,3,1);Wk.dim(L,10)}
 else{Wk.cut(L,13,8,14,20);Wk.gash(L,10,18,2,4,3);L.r(17,13,3,3,'#dfe8ff');L.r(19,21,2,2,COLD);L.r(16,25,2,2,FOG);Wk.dim(L,22)}},
// the stray: blood dark as tar on its flank, the ring spreading; then a back leg folds, the ring's eaten half its back,
// and frost comes off the burn
stray(L,s){
 Wk.stain(L,20,34,s>1?6:4,s>1?5:3,3);Wk.drip(L,19,38,s>1?10:5);
 if(s===1){Wk.gash(L,31,29,12,7,2,'#1a1014');Wk.dull(L,10,52,.25);Wk.lean(L,1,10,40)}
 else{Wk.gash(L,31,29,15,9,2,'#1a1014');L.e(31,29,8,4,'#e8d8c0');Wk.sag(L,22,38,8,20,6);Wk.pour(L,26,30,8,59,1);Wk.stain(L,48,22,3,3,1);Wk.dull(L,8,56,.5);Wk.lean(L,-3,8,50);Wk.heap(L,30,8,3)}},
// the Orderly: a fold tears open onto nothing; then its hook arm is gone, its folds slump and it drips like a wet sheet
orderly(L,s){
 Wk.gash(L,26,44,s>1?5:3,s>1?10:6,2);Wk.crack(L,34,20,30,60,1);
 if(s===1){Wk.dull(L,30,60,.3);Wk.lean(L,2,10,60)}
 else{Wk.cut(L,42,22,18,70);Wk.gash(L,32,60,4,6,3);Wk.sag(L,10,16,40,40,6);for(let x=14;x<46;x+=5)Wk.drip(L,x,64+(x%3),8,PALED);Wk.dull(L,24,60,.5);Wk.lean(L,4,10,90);Wk.heap(L,30,12,3,[PALE,PALED,PALEDD])}},
// the Surveyor: its coat splits onto cold light; then a caliper arm hangs broken, the lamp cracks and frost pours off it
surveyor(L,s,f,ph2){
 Wk.crack(L,34,44,40,88,1);Wk.crack(L,60,40,56,84,2);Wk.bite(L,70,46,s>1?6:3,s>1?6:3,1);
 if(s===1){Wk.dull(L,48,96,.25);Wk.lean(L,2,10,60)}
 else{Wk.crack(L,40,6,54,22,3);Wk.crack(L,44,4,40,24,4);Wk.sag(L,76,40,20,70,10);Wk.cut(L,80,92,16,20);Wk.gash(L,30,60,5,8,2);
  Wk.dull(L,44,96,.5);Wk.lean(L,4,10,80);Wk.pour(L,40,90,16,127,1);Wk.heap(L,48,18,4)}}
};

// ================= THE BOSS'S PORTRAIT (it talks) =================
// A lamp of cold white where a face should be, a ring of bone round it, the collar of its coat of fog, a caliper hand
// raised. When it talks, the light opens up.
function portraitLayer(open){const L=Ly(64,64);
 L.r(4,48,56,16,'#b8b0d0');for(let k=0;k<4;k++)for(let x=4;x<60;x++){const y=50+k*4+Math.round(Math.abs(x-32)*.12);L.p(x,y,FOGD)}
 L.r(26,38,12,12,PALED);
 L.e(32,24,20,19,PALEDD);L.e(32,24,18,17,PALE);for(let a=0;a<10;a++){const an=a/10*Math.PI*2;L.r(32+Math.cos(an)*16,24+Math.sin(an)*15,2,2,PALEDD)}
 L.e(32,24,13,12,'#dfe8ff');L.e(32,24,open?11:9,open?10:8,COLD);L.e(29,21,3,2,'#ffffff');if(open)L.e(32,24,5,5,'#ffffff');
 L.line(6,30,12,46,STEEL,2);L.line(14,30,12,46,STEEL,2);L.p(6,29,STEELL);L.p(14,29,STEELL);L.r(10,44,5,8,PALE);
 return L}
const pc={};
function portrait(ctx,open){const k=open?1:0;if(!pc[k]){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');
  const gr=x.createRadialGradient(32,24,4,32,32,46);gr.addColorStop(0,'#3a3456');gr.addColorStop(1,'#141020');x.fillStyle=gr;x.fillRect(0,0,64,64);
  blit(x,portraitLayer(k));x.globalCompositeOperation='lighter';const g2=x.createRadialGradient(32,24,2,32,24,26);g2.addColorStop(0,`rgba(238,244,255,${open?.5:.3})`);g2.addColorStop(1,'rgba(238,244,255,0)');x.fillStyle=g2;x.fillRect(0,0,64,64);x.globalCompositeOperation='source-over';pc[k]=c}
 ctx.clearRect(0,0,64,64);ctx.drawImage(pc[k],0,0)}

// ================= A DRAWING KIT (backdrops and scenes) =================
function kit(g){const R=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))};
 const K={g,R,
  hash:(a,b=0)=>{let n=Math.imul(a|0,374761393)+Math.imul(b|0,668265263);n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967296},
  bands(y0,y1,cols,W){const n=cols.length,hh=(y1-y0)/n;for(let i=0;i<n;i++){const a=Math.round(y0+i*hh),b=Math.round(y0+(i+1)*hh);R(0,a,W,b-a,cols[i]);
   if(i<n-1)for(let x=0;x<W;x++){if((x&1)===0)R(x,b-1,1,1,cols[i+1]);if((x&3)===1)R(x,b-2,1,1,cols[i+1])}}},
  ell(cx,cy,rx,ry,c){for(let y=-Math.ceil(ry);y<=Math.ceil(ry);y++){const q=1-(y/ry)**2;if(q<0)continue;const hw=rx*Math.sqrt(q);R(cx-hw,cy+y,hw*2,1,c)}},
  line(x0,y0,x1,y1,c,w=1){const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);for(let i=0;i<=n;i++)R(x0+(x1-x0)*i/n,y0+(y1-y0)*i/n,w,w,c)},
  poly(pts,c){g.fillStyle=c;g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fill()},
  pool(cx,cy,rx,ry,c,a,steps=4){g.globalCompositeOperation='lighter';g.globalAlpha=a/steps;for(let i=0;i<steps;i++){const k=1-i/steps;K.ell(cx,cy,rx*k,ry*k,c)}g.globalAlpha=1;g.globalCompositeOperation='source-over'},
  // fog: soft bands that drift (t in ms; 0 for a still backdrop)
  fog(W,y0,y1,a,t=0,col='200,184,255'){for(let i=0;i<7;i++){const y=y0+(y1-y0)*(i/7),off=(t/(60+i*17)+K.hash(i,9)*W)%W;
   for(let k=-1;k<2;k++){const x=k*W+off;const gr=g.createRadialGradient(x+W/2,y,4,x+W/2,y,W*.6);gr.addColorStop(0,`rgba(${col},${(a/3).toFixed(3)})`);gr.addColorStop(1,`rgba(${col},0)`);g.fillStyle=gr;g.fillRect(x,y-W*.3,W,W*.6)}}},
  // 3 × 5 capitals for painted signs and markers (made-up names only)
  text(s,x,y,c){const F={A:'010101111101101',B:'110101110101110',C:'111100100100111',D:'110101101101110',E:'111100110100111',F:'111100110100100',G:'111100101101111',H:'101101111101101',I:'111010010010111',K:'101101110101101',L:'100100100100111',M:'101111111101101',N:'101111111111101',O:'111101101101111',P:'110101110100100',R:'110101110101101',S:'111100111001111',T:'111010010010010',U:'101101101101111',V:'101101101101010',W:'101101101111101',Y:'101101010010010',
    '0':'111101101101111','1':'010110010010111','2':'111001111100111','3':'111001111001111','4':'101101111001001','5':'111100111001111','6':'111100111101111','7':'111001001001001','8':'111101111101111','9':'111101111001111',':':'000010000010000','.':'000000000000010','-':'000000111000000'};
   [...s].forEach((ch,i)=>{const b=F[ch];if(b)for(let j=0;j<15;j++)if(b[j]==='1')R(x+i*4+j%3,y+(j/3|0),1,1,c)})}};
 return K}

// ================= BATTLE BACKDROPS (Combat, Basics, Backgrounds) =================
// Head-on at battle scale, one per kind of place the case fights in: Cullen Gap's Main Street ('town': the old bank's
// columns, the diner, a street light, wet asphalt), the ridge road ('ridge': two lanes in fog with the yellow line, the
// guardrail, mile marker 31 and the overlook's wall), the woods below the overlook ('woods': rhododendron, trunks, the
// creek, heavy fog), the clinic's exam room ('exam': the light box with Ray's scan, the exam table, the cabinet) and the
// high pasture ('field': the fence, the old barn, the burned ring and the cold light coming down). Lit for day or night;
// low SAN shrinks the lights like on the map, and battle.js lays the sour over it. o.rain (the map's weather) puts Main
// Street under the day-2 rain. The clean-up crew can catch you on any map once they're called, so every room a fight can
// reach has its own (ROOMS, below): the clinic's lobby, the sleep lab, the Pruetts' kitchen and bedroom and the diner.
const BDC={};
function backdrop(place,o){const f=BDRAW[place];if(!f)return null;
 const key=[place,o.light,o.low?1:0,o.w,o.h,o.feet,o.rain?1:0].join('|');if(BDC[key])return BDC[key];
 const c=document.createElement('canvas');c.width=o.w;c.height=o.h;const g=c.getContext('2d');
 const hz=Math.round(Math.max(30,Math.min(o.feet-12,o.h*.44)));
 f(kit(g),o.w,o.h,hz,o);BDC[key]=c;return c}
function nightSky(K,W,base,fogged){K.bands(0,base,fogged?['#100e1c','#16142a','#1e1a34','#28223e']:['#06081a','#0a0e24','#10142c','#1a1a34'],W);
 if(!fogged)for(let i=0;i<40;i++){const x=K.hash(i,3)*W|0,y=K.hash(i,4)*(base-6)|0;K.R(x,y,1,1,i%6?'#4a5070':'#c8c8e0')}}
const BDRAW={
town(K,W,H,hz,o){const R=K.R,nt=o.light!=='day',low=o.low,base=hz-6,wet=!!o.rain;
 if(nt)nightSky(K,W,base,true);else K.bands(0,base,wet?['#7a8294','#8a92a2','#9aa0ac','#a8acb4']:['#9ab4c8','#b0c4d0','#c8d4d8','#dcdcd4'],W);
 // the ridge behind town, dark green, with the church steeple
 for(let x=0;x<W;x++){const y=base-48-Math.round(Math.sin(x/W*Math.PI*1.3+.4)*14+Math.sin(x/17)*3);R(x,y,1,base-y,nt?'#141c20':'#4a6a4a')}
 R(W*.72,base-70,4,24,nt?'#2a2a36':'#e8e4d8');K.poly([[W*.72-3,base-70],[W*.72+7,base-70],[W*.72+2,base-84]],nt?'#2a2a36':'#c8c0b0');
 // the old Farmers Bank: limestone columns, the clinic's gold letters on the glass
 const bx=8,bw=96,bt=base-58,lime=nt?'#4a4858':'#c8c0ae';R(bx,bt,bw,base-bt,lime);R(bx-2,bt,bw+4,6,nt?'#5a5868':'#d8d0be');R(bx,bt+6,bw,2,sh(lime,-20));
 for(let k=0;k<4;k++){const x=bx+8+k*24;R(x,bt+10,8,base-bt-10,nt?'#5a5868':'#e0d8c6');R(x+6,bt+10,2,base-bt-10,sh(lime,-24))}
 K.text('FARMERS BANK',bx+24,bt+1,nt?'#2a2838':'#7a705e');R(bx+30,bt+24,36,22,nt?'#e7c070':'#4a6a8a');K.text('SLEEP',bx+38,bt+30,nt?'#7a5a20':'#e8c84a');
 // the diner front with its sign
 const dx=118,dw=W-dx-6,dt=base-44,dc=nt?'#2a3a44':'#5a7a8a';R(dx,dt,dw,base-dt,dc);R(dx,dt,dw,8,nt?'#3a2a30':'#e8e4d8');K.text('GAP DINER',dx+8,dt+2,nt?'#ff6a8a':'#a8323e');
 R(dx+6,dt+14,dw-12,20,nt?'#14181e':'#a8c8d8');if(nt)R(dx+6,dt+14,dw-12,20,'#1e2228');R(dx,dt+10,dw,3,'#c8402e');for(let x=dx;x<dx+dw;x+=8)R(x,dt+10,4,3,'#f4efe6');
 // a redbud by day, a street light by night
 if(!nt){K.ell(W*.47,base-30,14,12,'#e070a8');K.ell(W*.47-6,base-34,8,7,'#f090c0');R(W*.47-1,base-20,3,20,'#5a3a2a')}
 R(W*.47,base-58,3,58,'#14121a');R(W*.47,base-58,12,2,'#14121a');R(W*.47+10,base-56,5,3,nt?'#ffcf80':'#d8d4cc');if(nt){const k=low?.7:1;K.pool(W*.47+12,base-50,26*k,24*k,'#ffcf80',.42,4)}
 // the sidewalk and Main Street, wet
 R(0,base,W,6,nt?'#3a3646':'#b8b0a4');R(0,hz-1,W,2,nt?'#4a4656':'#c8c0b4');K.bands(hz+1,H,nt?['#1a1c26','#1e2030','#222434']:['#4a5468','#525c70','#5a6478'],W);
 const ly=hz+1+Math.round((H-hz)*.45);for(let x=-6;x<W;x+=28)R(x,ly,14,2,'#d8b24a');
 for(let i=0;i<24;i++){const x=K.hash(i,31)*W|0,y=Math.round(hz+3+K.hash(i,32)*(H-hz-6));R(x,y,6,1,nt?'#3a3c4c':'#7a8498')}
 if(nt){const k=low?.65:1;K.pool(W/2,H+4,118*k,(H-hz)*.7*k,'#ffcf80',.2,5);K.fog(W,base-40,H,.06)}
 // the day-2 rain: puddles holding the gray sky, cloud down on the ridge, and the Shared Shelf's rain
 // (shared-effects-rain-v1) over it all, stopped at one moment since the backdrop is a still
 if(wet){for(let i=0;i<7;i++){const x=K.hash(i,41)*(W-30)|0,y=Math.round(hz+6+K.hash(i,42)*(H-hz-16)),w=14+(K.hash(i,43)*18|0);K.ell(x+w/2,y,w/2,2,'#7a8498');K.ell(x+w/2-2,y,w/4,1,'#9aa2b4')}
  K.fog(W,0,base-20,.12,0,'200,204,214');
  if(window.SHELF&&SHELF.rain)SHELF.rain(K.g,4321,{k:.85,shine:[[0,hz+2,W,H-hz-2]]});
  // at battle scale the Shelf's fine drops barely show, so heavier slanted streaks and splashes on the road go over it
  for(let i=0;i<140;i++){const x=K.hash(i,51)*(W+20)-10,y=K.hash(i,52)*H,l=3+(K.hash(i,53)*3|0);for(let j=0;j<l;j++)R(x-j*.4,y+j,1,1,i%3?'rgba(200,212,230,.55)':'rgba(230,236,248,.7)')}
  for(let i=0;i<26;i++){const x=K.hash(i,54)*W|0,y=Math.round(hz+4+K.hash(i,55)*(H-hz-8));R(x-1,y,1,1,'#b8c4d8');R(x+1,y,1,1,'#b8c4d8');R(x,y-1,1,1,'#d8e0ec')}}},
ridge(K,W,H,hz,o){const R=K.R,low=o.low,base=hz-4;
 nightSky(K,W,base,true);
 // the far ridgeline, barely there in the fog, and one cold light over the trees
 for(let x=0;x<W;x++){const y=base-30-Math.round(Math.sin(x/W*Math.PI*2+1)*10+Math.sin(x/9)*2);R(x,y,1,base-y,'#1e1a2e')}
 K.pool(W*.78,18,30,20,'#eef4ff',.3,5);K.ell(W*.78,18,3,3,'#eef4ff');
 // the uphill side's trees on the left, the curve sign and mile marker 31
 for(let i=0;i<9;i++){const x=i*14-4,h=40+K.hash(i,5)*20;K.poly([[x,base],[x+10,base-h],[x+20,base]],'#141a20')}
 R(W*.36,base-34,2,34,'#3a3a44');K.poly([[W*.36-12,base-40],[W*.36+12,base-40],[W*.36+12,base-29],[W*.36-12,base-29]],'#c8a020');K.text('CURVE',W*.36-9,base-37,'#2a2010');
 R(W*.56,base-18,6,18,'#d8d8d0');R(W*.56,base-18,6,3,'#2a6a3a');K.text('31',W*.56-1,base-13,'#1a1a22');
 // the guardrail along the drop, its reflectors catching your lantern, the stone wall of the overlook on the right
 R(0,hz-12,W*.7,4,'#8a8a94');R(0,hz-10,W*.7,1,'#c8c8d0');for(let x=6;x<W*.7;x+=22){R(x,hz-12,3,12,'#5a5a64');R(x,hz-11,2,2,'#ffd040')}
 const sx=Math.round(W*.7);R(sx,hz-16,W-sx,16,'#5a5664');for(let y=hz-16;y<hz;y+=5)for(let x=sx+((y/5|0)%2)*6;x<W;x+=12)R(x,y,11,4,'#6a6676');
 R(W*.86,hz-30,4,14,'#3a3a44');R(W*.86-4,hz-36,12,7,'#4a4a58');R(W*.86-2,hz-34,4,3,'#1a1a24');
 // the two-lane: wet asphalt, a dashed yellow line running away, white edge lines
 K.bands(hz,H,['#1c1e28','#20222e','#242634','#28293a'],W);
 for(let x=-10;x<W;x+=26)R(x,hz+Math.round((H-hz)*.42),14,2,'#d8b24a');R(0,hz+2,W,1,'#c8c8c0');R(0,H-8,W,1,'#8a8a88');
 const k=low?.65:1;K.pool(W/2,H+4,110*k,(H-hz)*.7*k,'#ffd9a0',.22,5);
 K.fog(W,8,H,.16);K.fog(W,hz-20,H,.1)},
woods(K,W,H,hz,o){const R=K.R,low=o.low,base=hz+2;
 R(0,0,W,base,'#12121e');
 // trunks going up into the fog, and rhododendron thickets in front of them
 for(let i=0;i<10;i++){const x=K.hash(i,7)*W|0,w=4+K.hash(i,8)*8|0;R(x,0,w,base,i%3?'#1e1a26':'#26222e');R(x,0,1,base,'#2e2a38')}
 for(let i=0;i<14;i++){const x=i*20-6+K.hash(i,11)*8,y=base-10-K.hash(i,12)*24;K.ell(x,y,16,12,'#1a2a22');K.ell(x-4,y-4,10,7,'#24382c');
  for(let k=0;k<3;k++)K.ell(x-8+k*7,y-6+(k%2)*4,2,2,k%2?'#e8dce8':'#c890b0')}
 K.pool(W*.3,base*.4,40,30,'#c8b8ff',.12,4);
 // white trail blazes on two trees, the trail, the loud creek in front
 R(W*.2,base-40,3,5,'#e8e8e0');R(W*.74,base-46,3,5,'#e8e8e0');
 K.bands(base,H,['#2a2420','#2e2822','#322c26'],W);for(let i=0;i<30;i++){const x=K.hash(i,21)*W|0,y=base+3+(K.hash(i,22)*(H-base-14)|0);R(x,y,3,1,i%4?'#3e342c':'#5a4a3a')}
 const cy=H-12;R(0,cy,W,12,'#1a2a3a');for(let x=0;x<W;x+=6)R(x+((x/6|0)%2)*3,cy+2+((x/6|0)%3)*3,4,1,'#5a7a9a');
 for(let i=0;i<6;i++)K.ell(K.hash(i,25)*W,cy+1,6,3,'#3a3a44');
 const k=low?.6:1;K.pool(W/2,H,90*k,(H-base)*.8*k,'#ffd9a0',.18,5);
 K.fog(W,0,H,.16,0,'150,140,190');K.fog(W,base-30,H,.1,0,'150,140,190')},
exam(K,W,H,hz,o){const R=K.R,low=o.low,nt=o.light!=='day';
 // pale green tile, the light box glowing with the skull, a cabinet, the exam table, the room's one lamp off
 R(0,0,W,hz,'#8aa89a');for(let y=6;y<hz;y+=8)R(0,y,W,1,'#7a9888');for(let x=4;x<W;x+=8)R(x,0,1,hz,'#7a9888');R(0,hz-18,W,18,'#6a8a7a');
 if(nt)R(0,0,W,hz,'rgba(10,12,24,.55)');
 const lx=Math.round(W*.5)-34,ly=Math.max(6,hz-82);R(lx-3,ly-3,74,52,'#3a3a44');R(lx,ly,68,46,'#e8f0f8');
 K.ell(lx+34,ly+22,18,17,'#a8b4c4');K.ell(lx+34,ly+22,14,13,'#c8d0dc');K.ell(lx+44,ly+26,3,3,'#f8f8ff');for(let k=0;k<5;k++)K.line(lx+44,ly+26,lx+38+k*2,ly+34,'#f8f8ff');
 K.pool(lx+34,ly+22,46,36,'#e8f0f8',low?.18:.32,4);
 R(12,hz-62,30,62,'#c8d0d8');R(14,hz-60,26,28,'#e8eef4');for(let k=0;k<3;k++)R(16+k*8,hz-56,6,10,['#e8e4f0','#f8f8ff','#d8e0e8'][k]);R(12,hz-30,30,2,'#9aa4b0');R(36,hz-24,3,6,'#3a3a44');
 R(W-60,hz-34,48,10,'#e8e8f0');R(W-60,hz-24,48,4,'#9aa4b0');R(W-56,hz-20,3,20,'#7a8494');R(W-18,hz-20,3,20,'#7a8494');R(W-60,hz-36,48,3,'#f8f8ff');
 K.bands(hz,H,['#5a6a68','#5e6e6c','#627270'],W);for(let y=hz+6;y<H;y+=10)for(let x=((y/10|0)%2)*10;x<W;x+=20)R(x,y,10,10,'rgba(0,0,0,.08)');
 const k=low?.6:1;K.pool(W/2,hz-20,80*k,50*k,'#e8f0f8',.12,4)},
field(K,W,H,hz,o){const R=K.R,low=o.low,base=hz-4;
 nightSky(K,W,base,true);
 // the Lamp: a round cold hole in the fog straight overhead, and a column of its light coming down
 const lx=Math.round(W*.5);K.pool(lx,10,60,26,'#eef4ff',.42,6);K.ell(lx,8,18,6,'#eef4ff');K.ell(lx,8,12,4,'#ffffff');
 g2col(K,lx,10,base,W);
 // the old hay barn on the left, the fence line, the trough
 R(8,base-40,52,40,'#2a1e22');K.poly([[4,base-40],[34,base-58],[64,base-40]],'#22181c');R(24,base-26,20,26,'#120c10');R(24,base-26,20,2,'#3a2a2a');
 for(let x=0;x<W;x+=18){R(x,base-14,3,14,'#3a3030')}R(0,base-12,W,2,'#4a3e3a');R(0,base-6,W,2,'#4a3e3a');
 R(W-52,base-8,30,8,'#4a4a54');R(W-50,base-8,26,2,'#c8d4f0');
 // the pasture, wet with fog, frosted white under the light, and the burned ring
 K.bands(hz,H,['#1a2420','#1e2a24','#222e28'],W);
 K.ell(lx,hz+(H-hz)*.45,W*.4,(H-hz)*.28,'#8a96b0');K.ell(lx,hz+(H-hz)*.45,W*.39,(H-hz)*.26,'#14181a');K.ell(lx,hz+(H-hz)*.45,W*.36,(H-hz)*.22,'#1e2622');
 for(let i=0;i<40;i++){const x=K.hash(i,61)*W|0,y=hz+2+(K.hash(i,62)*(H-hz-4)|0);R(x,y,1,2,'#c8d4f0')}
 const k=low?.6:1;K.pool(lx,hz+(H-hz)*.45,W*.4*k,(H-hz)*.5*k,'#eef4ff',.07,5);
 K.fog(W,base-50,H,.12,0,'150,140,190')}
};
// ================= THE ROOMS' BACKDROPS =================
// One shell for all: the back wall to hz with a baseboard, the floor in front; at night everything dims and the room's
// own lights pool back after (roomNight). Each room adds its pieces, sized to hz so a short screen keeps them whole.
function roomShell(K,W,H,hz,wall,line,base,floor){const R=K.R;R(0,0,W,hz,wall);for(let x=6;x<W;x+=14)R(x,0,1,hz-8,line);R(0,hz-8,W,8,base);R(0,hz-8,W,1,sh(base,24));
 K.bands(hz,H,floor,W);for(let x=0;x<W;x+=24)R(x+((x/24|0)%2)*6,hz,1,H-hz,'rgba(0,0,0,.12)')}
// pools: [x, y, rx, ry, color, strength]; by day they're faint
function roomNight(K,W,H,o,pools){const k=o.low?.6:1,nt=o.light!=='day';if(nt)K.R(0,0,W,H,'rgba(10,8,24,.55)');
 pools.forEach(([x,y,rx,ry,c,a])=>K.pool(x,y,rx*k,ry*k,c,nt?a:a*.35,4))}
// a window: daylight (green yard under it), or night with one far porch light
function roomWindow(K,x,y,w,h,o,frame){const R=K.R;R(x-2,y-2,w+4,h+4,frame);
 if(o.light!=='day'){R(x,y,w,h,'#0e1020');R(x+w*.7,y+h*.6,1,1,'#ffcf80')}else{for(let j=0;j<h;j++)R(x,y+j,w,1,['#a8b8c8','#b4c2ce','#c0ccd4','#ccd4d8'][Math.floor(j/h*4)]);R(x,y+h*.72,w,h*.28,'#5a7a5a')}
 R(x+w/2-1,y,2,h,frame);R(x,y+h/2-1,w,2,frame)}
const ROOMS={
// the clinic's lobby: the old Farmers Bank inside. Marble, two columns, the round vault door open at the back, the
// teller counter with its brass grille, a wall clock, the waiting chairs, a red runner
clinic(K,W,H,hz,o){const R=K.R;roomShell(K,W,H,hz,'#d8d4c4','#ccc8b6','#8a8070',['#c8c0ae','#bcb4a2','#b0a896']);
 for(let i=0;i<10;i++){const x=K.hash(i,71)*W,y=K.hash(i,72)*(hz-20);K.line(x,y,x+8,y+6,'#c4beac')}
 R(0,0,W,5,'#c8c0ae');for(let x=2;x<W;x+=6)R(x,5,3,3,'#b8b09e');
 const vr=Math.round(Math.min(26,hz*.3)),vx=Math.round(W*.5),vy=hz-12-vr;K.ell(vx,vy,vr+3,vr+3,'#5a5a64');K.ell(vx,vy,vr,vr,'#1a1a22');
 for(let k=0;k<5;k++)R(vx-vr*.6+k*vr*.3,vy-vr*.5,vr*.2,vr,'#c8b090');K.ell(vx+vr+10,vy,7,vr+2,'#8a8a94');K.ell(vx+vr+10,vy,4,vr-4,'#6a6a74');
 for(const x of[W*.3,W*.7]){R(x-5,4,10,hz-12,'#e0d8c6');R(x+3,4,2,hz-12,'#b8b09e');R(x-7,4,14,4,'#ece4d2');R(x-7,hz-12,14,4,'#ece4d2')}
 const ct=hz-30;R(0,ct,W*.24,22,'#6a4a32');R(0,ct-2,W*.24,4,'#8a6a4a');for(let x=4;x<W*.24;x+=6)R(x,ct-22,1,20,'#c8a040');R(0,ct-23,W*.24,2,'#c8a040');
 const ky=Math.max(12,hz-54);K.ell(W*.86,ky,8,8,'#3a3a44');K.ell(W*.86,ky,6,6,'#f4efe6');K.line(W*.86,ky,W*.86+3,ky+2,'#1a1a22');K.line(W*.86,ky,W*.86-1,ky-4,'#1a1a22');
 for(let i=0;i<3;i++){const x=W*.78+i*16;R(x,hz-20,12,6,'#5a6a7a');R(x,hz-30,12,10,'#6a7a8a');R(x+1,hz-14,2,6,'#3a3a44');R(x+9,hz-14,2,6,'#3a3a44')}
 K.poly([[W*.5-14,hz],[W*.5+14,hz],[W*.5+40,H],[W*.5-40,H]],'#7a2a3a');K.poly([[W*.5-10,hz],[W*.5+10,hz],[W*.5+32,H],[W*.5-32,H]],'#9a3a4a');
 roomNight(K,W,H,o,[[W*.12,ct-10,40,30,'#ffd9a0',.3],[W*.5,hz-8,70,40,'#e8f0f8',.12]])},
// the sleep lab: the one-way window (black from this side) on the left, the bed with its wires, the monitor's green line
lab(K,W,H,hz,o){const R=K.R;roomShell(K,W,H,hz,'#a8b8c0','#9cacb4','#6a7a84',['#4a3e34','#4e4238','#52463c']);
 const mx=8,my=Math.max(6,hz-62),mw=Math.round(W*.36),mh=Math.min(40,hz-my-14);R(mx-3,my-3,mw+6,mh+6,'#4a4e58');R(mx,my,mw,mh,'#0e1018');K.line(mx+6,my+mh-4,mx+20,my+4,'#1e2230',3);R(mx+4,my+3,10,1,'#2a3040');
 const bx=Math.round(W*.46),bw=Math.round(W*.32),by=hz-20;R(bx,by-14,4,22,'#9aa4b0');R(bx,by,bw,8,'#d8dce4');R(bx,by+8,bw,3,'#9aa4b0');R(bx+4,by+11,3,8,'#7a8494');R(bx+bw-7,by+11,3,8,'#7a8494');R(bx+5,by-4,16,5,'#f4f4f8');R(bx+20,by-2,bw-22,4,'#7a8ab0');
 const nx=Math.round(W*.86),ny=hz-46;R(nx,ny,28,20,'#2a2a32');R(nx+2,ny+2,24,14,'#0a120c');for(let x=0;x<22;x++)R(nx+3+x,ny+9+(x%9<2?-3:0),1,1,'#5aff9a');R(nx+12,ny+20,4,24,'#3a3a44');R(nx+4,ny+42,20,2,'#3a3a44');
 for(let k=0;k<4;k++)K.line(bx+12+k*2,by-4,nx+2,ny+16+k,['#a89040','#9a3a30','#3a5a8a','#a8a49c'][k]);
 roomNight(K,W,H,o,[[nx+14,ny+9,30,22,'#5aff9a',.18],[W*.5,hz-40,60,40,'#ffd9a0',.12]])},
// the Pruetts' kitchen: yellow wallpaper, the wedding photos up the wall, the fridge and stove, the window over the sink
kitchen(K,W,H,hz,o){const R=K.R;roomShell(K,W,H,hz,'#d8c890','#d8c890','#8a6a4a',['#c8b890','#bcac84','#b0a078']);
 for(let y=6;y<hz-10;y+=10)for(let x=((y/10|0)%2)*6;x<W;x+=12)R(x,y,2,2,'#c4b47c');
 R(6,hz-60,26,52,'#e8e4d8');R(6,hz-60,26,2,'#f8f4ec');R(6,hz-36,26,1,'#a8a49c');R(28,hz-56,2,14,'#a8a49c');R(28,hz-32,2,14,'#a8a49c');
 R(36,hz-28,30,20,'#e8e4d8');R(36,hz-30,30,3,'#3a3a44');K.ell(44,hz-29,4,1,'#5a5a64');K.ell(58,hz-29,4,1,'#5a5a64');R(40,hz-22,22,10,'#2a2a30');
 const wy=Math.max(8,hz-58);roomWindow(K,Math.round(W*.74),wy,40,28,o,'#f4f0e8');R(W*.74-6,wy-5,52,3,'#c8a040');R(W*.68,hz-26,W*.32,18,'#8a6a4a');R(W*.68,hz-28,W*.32,3,'#d8d0c0');R(W*.82,hz-28,14,3,'#9aa4b0');
 const px=Math.round(W*.32),py=Math.max(6,hz-62);[[0,4,16,13],[19,0,14,17],[36,5,14,11],[8,22,12,10],[24,21,16,11]].forEach(([x,y,w,h],i)=>{R(px+x,py+y,w,h,i%2?'#c8a040':'#e8e4d8');R(px+x+1,py+y+1,w-2,h-2,['#f4f0e8','#d8d0c0','#e8e0f0'][i%3]);
  R(px+x+w/2-3,py+y+h/2-2,2,5,'#2a2030');R(px+x+w/2+1,py+y+h/2-2,2,5,'#f4f4f8')});
 roomNight(K,W,H,o,[[W*.5,hz-30,70,44,'#ffcf80',.3]])},
// their bedroom: blue wallpaper, the bed under its quilt, the lineman's picture, the curtained window, the nightlights
bedroom(K,W,H,hz,o){const R=K.R;roomShell(K,W,H,hz,'#b8c0d8','#aab2cc','#6a5a6a',['#6a5a6a','#625262','#5a4a5a']);
 const wy=Math.max(8,hz-60),wx=Math.round(W*.76);roomWindow(K,wx,wy,34,30,o,'#f4f0e8');R(wx-8,wy-4,10,40,'#d8c0e0');R(wx+32,wy-4,10,40,'#d8c0e0');R(wx-10,wy-6,54,3,'#8a6a4a');
 const ly=Math.max(6,hz-56),lx=Math.round(W*.1);R(lx,ly,22,18,'#6a4a32');R(lx+1,ly+1,20,16,'#7a8aa0');R(lx+10,ly+2,1,14,'#3a2a24');R(lx+4,ly+5,14,1,'#3a2a24');
 const bx=Math.round(W*.32),bw=Math.round(W*.36);R(bx,hz-34,bw,26,'#6a4a32');R(bx+2,hz-32,bw-4,4,'#8a6a4a');R(bx-2,hz-14,bw+4,12,'#a8506a');for(let x=bx;x<bx+bw;x+=8)R(x,hz-14,4,12,'#c8708a');R(bx+6,hz-20,18,6,'#f4f0e8');R(bx+bw-24,hz-20,18,6,'#f4f0e8');
 R(10,hz-22,26,14,'#7a5a3a');R(10,hz-24,26,3,'#9a7a5a');[14,22,30].forEach(x=>R(x,hz-27,2,3,'#ffe9a0'));
 roomNight(K,W,H,o,[[23,hz-26,26,18,'#ffe9a0',.3],[W*.5,hz-20,50,30,'#ffcf80',.1]])},
// the diner: wood panel under cream, the pass-through to the kitchen, the counter and its stools, the pie case, a booth
diner(K,W,H,hz,o){const R=K.R,nt=o.light!=='day';roomShell(K,W,H,hz,'#e8e4d8','#dcd8cc','#6a3a2e',['#e8e4dc','#d8d4cc','#c8c4bc']);
 R(0,hz-30,W,22,'#8a5a4a');for(let x=4;x<W;x+=10)R(x,hz-30,1,22,'#7a4a3a');R(0,hz-31,W,2,'#a87a5a');
 for(let y=hz+4;y<H;y+=10)for(let x=((y/10|0)%2)*10;x<W;x+=20)R(x,y,10,10,'rgba(30,30,40,.55)');
 const py=Math.max(6,hz-62);R(W*.22,py,W*.42,26,'#2a2020');R(W*.22,py+20,W*.42,6,'#c8c0b0');for(let i=0;i<4;i++)R(W*.26+i*20,py+4,8,10,'#f4f0e8');R(W*.22,py-3,W*.42,3,'#9a9aa4');
 const ct=hz-26;R(W*.12,ct,W*.62,18,'#c8402e');for(let x=W*.12;x<W*.74;x+=8)R(x,ct+4,4,2,'#f4efe6');R(W*.1,ct-3,W*.66,4,'#e8e4d8');
 for(let i=0;i<6;i++){const x=W*.15+i*24;R(x+2,hz-8,2,8,'#9a9aa4');K.ell(x+3,hz-10,6,2,'#c8402e')}
 R(W*.78,ct-10,30,22,'#a8b8c0');R(W*.78+2,ct-8,26,16,'#e8f4f8');R(W*.78+4,ct-2,8,5,'#c86a3a');R(W*.78+16,ct-2,8,5,'#a83a5a');
 R(W-14,hz-44,14,36,'#a8323e');R(W-14,hz-44,14,3,'#c8524e');R(6,hz-46,18,38,'#c86a3a');K.ell(15,hz-46,9,7,'#f0c060');for(let i=0;i<4;i++)R(8+i*4,hz-34,2,20,['#f04a6a','#4ac0f0','#f0d040','#6af06a'][i]);
 if(nt){const ex=Math.round(W*.88);R(ex,6,16,7,'#2a2030');R(ex+1,7,14,5,'#a8201e');R(ex+4,9,7,1,'#ffd0c8');R(ex+9,8,1,3,'#ffd0c8');R(ex+10,9,1,1,'#ffd0c8')}  // the exit sign, an arrow
 roomNight(K,W,H,o,[[W*.5,hz-20,90,40,nt?'#ff6a6a':'#ffe9b0',nt?.12:.2],[W*.84,ct,26,18,'#e8f4f8',.25],[15,hz-36,16,14,'#f0c060',.3]])}
};
Object.assign(BDRAW,ROOMS);

// ================= THE FOLDED CARD (a prop, at 1x) =================
// Jenna's wedding card, folded into a shape your eye can't follow: a cream square whose folds don't add up, one corner
// tucked into itself (11 x 10). Open (22 x 12): the card with ducks, the check, and the old sheet ruled in red.
function card(c,x,y,open){const R=(a,b,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x+a),Math.round(y+b),w,h)};
 if(!open){R(0,1,11,8,'#2a2030');R(1,0,9,10,'#2a2030');R(1,1,9,8,'#f4efe6');R(1,1,9,1,'#ffffff');R(2,5,7,1,'#c8bca8');R(5,2,1,6,'#c8bca8');R(6,2,3,3,'#e0d6c4');R(7,3,1,1,'#a89880');R(1,8,3,1,'#d8ccb8');R(3,6,1,1,'#f4f8ff');return}
 R(-1,-1,24,14,'#2a2030');R(0,0,10,12,'#e8f0f8');R(11,0,11,12,'#f4efe6');R(10,0,1,12,'#c8bca8');
 R(13,3,4,3,'#f0d040');R(16,2,2,2,'#f0d040');R(18,3,1,1,'#e8803a');R(14,8,3,2,'#f0d040');R(16,7,2,2,'#f0d040');R(18,8,1,1,'#e8803a');
 R(1,1,8,4,'#c8e8c0');R(2,2,4,1,'#3a5a3a');R(2,3,6,1,'#8aa88a');R(1,6,8,5,'#e8dcc8');for(let k=0;k<3;k++)R(1,7+k*1.5|0,8,1,'#c8302e');R(7,6,2,1,'#3a3044')}
// the Lamp's column of light, top to the ground
function g2col(K,x,y0,y1,W){const g=K.g,gr=g.createLinearGradient(0,y0,0,y1);gr.addColorStop(0,'rgba(238,244,255,.28)');gr.addColorStop(1,'rgba(238,244,255,.02)');
 g.globalCompositeOperation='lighter';g.fillStyle=gr;g.beginPath();g.moveTo(x-14,y0);g.lineTo(x+14,y0);g.lineTo(x+60,y1);g.lineTo(x-60,y1);g.closePath();g.fill();g.globalCompositeOperation='source-over'}

// ================= THE NIGHT DRIVE (its own picture) =================
// Through the windshield: the two-lane coming at you in the headlights, the yellow line, fog swallowing the beams a few
// car lengths out, mile markers going by (27, 28, ... 31), the radio's green clock. As the drive goes on, the radio's
// clock sticks, and one cold light shows over the trees.
function drive(c,W,H,t,o){const K=kit(c),R=K.R,hzY=Math.round(H*.34),dashY=Math.round(H*.58);
 c.fillStyle='#0a0a14';c.fillRect(0,0,W,H);
 const prog=Math.min(1,t/26000),mile=27+Math.min(4,Math.floor(t/5200));
 // the sky and the ridge, then fog
 K.bands(0,hzY,['#0c0c18','#12101e','#181628'],W);
 for(let x=0;x<W;x++){const y=hzY-10-Math.round(Math.sin(x/W*Math.PI*2+t/9000)*6);R(x,y,1,hzY-y,'#14141e')}
 if(prog>.55){const a=Math.min(1,(prog-.55)*3);K.pool(W*.7,hzY-26,22,16,'#eef4ff',.35*a,4);R(W*.7-1,hzY-27,3,3,`rgba(238,244,255,${a.toFixed(2)})`)}
 // the road: a trapezoid down to the dash, curving a little, with the yellow line's dashes sliding toward you
 const curve=Math.sin(t/4000)*18;
 K.poly([[W/2-6+curve,hzY],[W/2+6+curve,hzY],[W*.98,dashY],[W*.02,dashY]],'#22222c');
 for(let i=0;i<8;i++){const z=((i/8)+(t/900)%1/8)%1,y=hzY+(dashY-hzY)*z*z,w=1+z*5,x=W/2+curve*(1-z*z);if(z>.05)R(x-w/2,y,w,Math.max(1,z*10),'#d8b24a')}
 K.line(W/2-6+curve,hzY,W*.02,dashY,'#8a8a90');K.line(W/2+6+curve,hzY,W*.98,dashY,'#8a8a90');
 // guardrail on the right, its reflectors flicking past
 for(let i=0;i<6;i++){const z=((i/6)+(t/1300)%1/6)%1,y=hzY+(dashY-hzY)*z*z,x=W/2+8+curve*(1-z*z)+(W*.46)*z*z;if(z>.08){R(x,y-2-z*8,2+z*4,2+z*4,'#ffd040')}}
 // the mile marker coming up on the right shoulder
 const mz=((t%5200)/5200),my=hzY+(dashY-hzY)*mz*mz,mx=W/2+20+curve*(1-mz*mz)+(W*.4)*mz*mz,ms=1+mz*3;
 if(mz>.15){R(mx,my-14*ms,4*ms,14*ms,'#d8d8d0');R(mx,my-14*ms,4*ms,3*ms,'#2a6a3a');if(ms>2.2)K.text(String(mile),mx+1,my-10*ms,'#1a1a22')}
 // headlight beams, swallowed by fog a few lengths out
 c.globalCompositeOperation='lighter';const gr=c.createRadialGradient(W/2,dashY,10,W/2,hzY+10,(dashY-hzY)*1.1);gr.addColorStop(0,'rgba(255,230,170,.28)');gr.addColorStop(1,'rgba(255,230,170,0)');c.fillStyle=gr;c.fillRect(0,hzY-10,W,dashY-hzY+10);c.globalCompositeOperation='source-over';
 K.fog(W,hzY-20,dashY,.12+.1*prog,t,'150,140,190');
 // the windshield's frame and the dash: the wheel, the speedometer, the radio's green clock
 R(0,0,W,6,'#060608');R(0,0,10,dashY,'#060608');R(W-10,0,10,dashY,'#060608');K.poly([[0,0],[26,0],[10,dashY*.7],[0,dashY*.8]],'#08080c');K.poly([[W,0],[W-26,0],[W-10,dashY*.7],[W,dashY*.8]],'#08080c');
 R(W*.4,6,W*.2,10,'#0c0c12');R(W*.45,8,W*.1,6,'#1a1a24');
 R(0,dashY,W,H-dashY,'#16141c');R(0,dashY,W,3,'#24222c');
 const cxw=Math.round(W*.32),cyw=dashY+Math.round((H-dashY)*.55),rw=Math.round(Math.min(W*.22,(H-dashY)*.9));
 c.strokeStyle='#2a2832';c.lineWidth=5;c.beginPath();c.arc(cxw,cyw,rw,Math.PI*1.05,Math.PI*1.95);c.stroke();c.lineWidth=1;R(cxw-3,cyw-rw*.6,6,rw*.6,'#2a2832');
 R(cxw-14,dashY+8,28,14,'#0e0c12');K.ell(cxw,dashY+18,9,8,'#1a1822');const sa=Math.PI*(.85+.12*Math.sin(t/3000));K.line(cxw,dashY+18,cxw+Math.cos(sa)*7,dashY+18-Math.sin(sa)*7,'#ff6a3a');
 const rx=Math.round(W*.62),ry=dashY+10;R(rx,ry,52,18,'#0c0e10');R(rx+2,ry+2,48,14,'#0e1a12');
 const clk=prog<.75?`10:${String(20+Math.floor(prog/.75*15)).padStart(2,'0')}`:'10:35';K.text(clk,rx+6,ry+6,'#5aff9a');
 const fm=prog>.6?'- - -':'99.1';K.text(fm,rx+30,ry+6,prog>.6&&Math.floor(t/300)%2?'#2a5a3a':'#5aff9a');
 // a hanging air freshener shaped like a pine tree, swinging (no brand)
 const sw=Math.sin(t/700)*3;K.line(W*.5,16,W*.5+sw,26,'#3a3a44');K.poly([[W*.5+sw,26],[W*.5+sw-5,40],[W*.5+sw+5,40]],'#2e6a3a')}

// ================= THE HYPNOSIS SESSION (its own picture) =================
// The sleep lab at half light: the one-way window along the back wall, black from this side, with the room reflected in
// it; the bed with its wires and someone under the blanket; the monitor's green line. In the dark glass, behind the
// reflection, what's remembered plays: stage 1 two long tables under one light, 2 something tall bending to listen,
// 3 the inside of the light, too bright to look at.
function session(c,W,H,t,stage,cardSt){const K=kit(c),R=K.R,top=6,winH=Math.round(H*.36),floorY=Math.round(H*.6);
 c.fillStyle='#1a1e28';c.fillRect(0,0,W,H);
 // the wall, the window's frame and its dark glass
 R(0,0,W,floorY,'#3a4048');for(let x=0;x<W;x+=16)R(x,0,1,floorY,'#343a42');
 const wx=14,ww=W-28;R(wx-3,top-3,ww+6,winH+6,'#5a5a64');R(wx,top,ww,winH,'#06080e');
 // what's remembered, faint behind the glass
 const fl=.6+.4*Math.sin(t/240)*Math.sin(t/97);
 if(stage>=1&&stage<3){const cx0=wx+ww/2;c.globalCompositeOperation='lighter';
  const gr=c.createRadialGradient(cx0,top+6,2,cx0,top+winH*.6,winH*.8);gr.addColorStop(0,`rgba(238,244,255,${(.32*fl).toFixed(3)})`);gr.addColorStop(1,'rgba(238,244,255,0)');c.fillStyle=gr;c.fillRect(wx,top,ww,winH);c.globalCompositeOperation='source-over';
  const ty=top+winH*.66;R(cx0-70,ty,56,4,'#4a5060');R(cx0+14,ty,56,4,'#4a5060');R(cx0-66,ty+4,3,12,'#3a3e4a');R(cx0-20,ty+4,3,12,'#3a3e4a');R(cx0+18,ty+4,3,12,'#3a3e4a');R(cx0+64,ty+4,3,12,'#3a3e4a');
  K.ell(cx0-42,ty-3,18,3,'#6a7080');K.ell(cx0+42,ty-3,18,3,'#6a7080');K.ell(cx0-58,ty-4,4,3,'#8a8a98');K.ell(cx0+26,ty-4,4,3,'#8a8a98')}
 if(stage===2){const cx0=wx+ww/2+30,by=top+winH*.66;for(let y=top+8;y<by;y++){const hw=Math.round(3+(y-top)*.08);R(cx0-hw,y,hw*2,1,'rgba(216,212,228,.5)')}
  K.ell(cx0-6,top+14,6,6,'rgba(238,244,255,.7)');K.line(cx0-4,top+30,cx0-34,by-8,'rgba(216,212,228,.5)',2);R(cx0-36,by-10,3,3,'#eef4ff')}
 if(stage>=3){c.globalCompositeOperation='lighter';c.fillStyle=`rgba(238,244,255,${(.55+.25*fl).toFixed(3)})`;c.fillRect(wx,top,ww,winH);c.globalCompositeOperation='source-over';
  for(let i=0;i<5;i++){const x=wx+20+i*(ww-40)/4;R(x,top+winH*.3,2,winH*.5,'rgba(120,110,150,.5)');R(x-6,top+winH*.3,14,2,'rgba(120,110,150,.5)')}}
 // the reflection: the room in the glass, dim (the bed, the monitor, you)
 c.globalAlpha=.18;R(wx+ww*.3,top+winH*.62,ww*.4,winH*.3,'#c8c8d8');R(wx+ww*.78,top+winH*.5,18,14,'#5aff9a');c.globalAlpha=1;
 R(wx,top,ww,2,'rgba(255,255,255,.08)');K.line(wx+ww*.1,top+winH,wx+ww*.25,top,'rgba(255,255,255,.05)',3);
 // the floor
 K.bands(floorY,H,['#4a3e34','#4e4238','#52463c'],W);for(let x=0;x<W;x+=24)R(x,floorY,1,H-floorY,'#3e342c');
 // the bed with its wires, someone under the blanket, a flashlight glowing under the edge of it
 const bx=Math.round(W*.2),by=floorY-14,bw=Math.round(W*.5);
 R(bx,by,bw,14,'#d8dce4');R(bx,by+14,bw,6,'#9aa4b0');R(bx+4,by+20,3,10,'#7a8494');R(bx+bw-7,by+20,3,10,'#7a8494');
 R(bx+6,by-6,26,8,'#f4f4f8');K.ell(bx+20,by-6,9,6,'#e9b98f');R(bx+12,by-12,18,6,'#8a5a2b');
 R(bx+30,by-4,bw-34,10,'#7a8ab0');R(bx+30,by-4,bw-34,2,'#9aaad0');
 const fl2=.5+.5*Math.sin(t/400);c.globalCompositeOperation='lighter';c.fillStyle=`rgba(255,230,170,${(.15+.1*fl2).toFixed(3)})`;c.fillRect(bx+bw-30,by+2,20,8);c.globalCompositeOperation='source-over';
 for(let k=0;k<4;k++){const x0=bx+14+k*3,y0=by-10,x1=bx+bw+22,y1=floorY-46+k*3;for(let i=0;i<=24;i++){const f=i/24;K.R(x0+(x1-x0)*f,y0+(y1-y0)*f+Math.sin(f*Math.PI)*-10,1,1,['#a89040','#9a3a30','#3a5a8a','#a8a49c'][k])}}
 // the monitor on its cart: a green line crawling, flattening during a memory
 const mx=bx+bw+22,my=floorY-58;R(mx,my,40,30,'#2a2a32');R(mx+3,my+3,34,22,'#0a120c');R(mx+18,my+30,4,28,'#3a3a44');R(mx+6,my+56,28,3,'#3a3a44');
 for(let x=0;x<32;x++){const ph=(x+t/40)%32,amp=stage>=2&&Math.floor(t/1500)%3===0?0:(ph%11<2?8:1.5);R(mx+4+x,my+14+Math.round(Math.sin(ph*.8)*amp),1,1,'#5aff9a')}
 // the observation desk's lamp on the left, warm
 R(4,floorY-20,30,4,'#5a4a3a');R(18,floorY-36,2,16,'#3a3a44');R(12,floorY-40,14,5,'#e8c070');K.pool(19,floorY-34,30,22,'#ffd9a0',.24,4);
 // the folded card in her hands on the blanket (drawn at 2x so it reads), then open in her lap
 if(cardSt){const ox=bx+(cardSt>1?30:38),oy=by-(cardSt>1?24:20);c.save();c.translate(ox,oy);c.scale(2,2);card(c,0,0,cardSt>1);c.restore()}}

const SZ=k=>{const A=B[k==='surveyor2'?'surveyor':k];return A?[A.w,A.h]:[16,16]};
const cache=new Map();
// step: 0 unhurt, 1 at half HP, 2 at a quarter. A wounded sprite is 8 px wider each side so a lean or a spill isn't cut
// off; drawn centred, so it stays put, and the same height, so the feet stay on the ground.
function sprite(k,frame,step){step=step|0;const ph2=k==='surveyor2',base=ph2?'surveyor':k,key=k+(frame?1:0)+':'+step;let c=cache.get(key);if(c)return c;const A=B[base];if(!A)return null;
 const L=Ly(A.w,A.h,step?WPAD:0);A.f(L,frame?1:0,ph2);if(step){Wk.cut(L,-WPAD,0,WPAD,A.h);Wk.cut(L,A.w,0,WPAD,A.h);if(WOUND[base])WOUND[base](L,step,frame?1:0,ph2)}
 c=document.createElement('canvas');c.width=L.W;c.height=A.h;blit(c.getContext('2d'),L);cache.set(key,c);return c}
return{B,sprite,size:SZ,portrait,backdrop,drive,session,card};
})();
