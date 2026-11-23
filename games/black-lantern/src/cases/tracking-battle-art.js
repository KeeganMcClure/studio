// Black Lantern · cases/tracking-battle-art.js · Tracking's battle art (spec 018 part B, Nov 23, 2026).
// Made the way Good Manners' is (cases/good-manners-battle-art.js, GMB): big head-on battle sprites with the light rim,
// both damage steps for every enemy (Art, Townsfolk and monsters, Wounded enemies), the case's painted battle backdrops
// (Combat, Basics, Backgrounds) and the boss's 64 x 64 talking portrait. Art for this case only; it goes to the Asset
// Library's Tracking page. Exposes window.TRKB.
//   TRKB.sprite(key, frame, step) -> cached canvas; frame 0/1 is the idle; step 0 unhurt, 1 at half HP, 2 at a quarter.
//      key: nephew, buddy, regular, watcher, vesper, vesper2 (her second phase). The clean-up agent is the agency's own
//      and is drawn by Still Harvest's file (SHB), the same crew in every case.
//   TRKB.size(key) -> [w, h]   TRKB.portrait(ctx, open) draws VESPER's face
//   TRKB.backdrop(place, {w, h, light, low, feet}) -> the backdrop for 'gideon', 'club', 'dub' or 'street'
// Palette: Tracking's accents (neon magenta, casino gold, sodium orange, the tape's washed-out blue) on the base palette.
window.TRKB=(()=>{
const OL='#120c1c',D='#24141e',W='#f4efe6',MR='#5a1a22',NEON='#ff3fa4',GOLD='#f2c14e',TAPE='#7fa0c8';
const sh=(h,a)=>{const n=parseInt(h.slice(1),16),f=v=>Math.max(0,Math.min(255,Math.round(v+a)));return'#'+[n>>16,n>>8&255,n&255].map(v=>f(v).toString(16).padStart(2,'0')).join('')};
const hsh=(a,b=0,s=0)=>{let n=Math.imul(a|0,374761393)+Math.imul(b|0,668265263)+Math.imul(s|0,2246822519);n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967296};
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
// light from the upper left: the lit edge gets a rim, every edge a dark outline
function finish(L){const w=L.W,{h,d}=L,o=d.slice(),G=(x,y)=>(x<0||y<0||x>=w||y>=h)?null:d[y*w+x];for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x,v=d[i];
 if(v){if((x>0&&!G(x-1,y))||(y>0&&!G(x,y-1)))o[i]=sh(v,30)}
 else if(G(x-1,y)||G(x+1,y)||G(x,y-1)||G(x,y+1))o[i]=OL}return o}
function blit(c,L,ox=0,oy=0){const o=finish(L),w=L.W;for(let i=0;i<o.length;i++)if(o[i]){c.fillStyle=o[i];c.fillRect(ox+i%w,oy+(i/w|0),1,1)}}
// a small Storybook eye: white, iris, pupil and a lid line
function eye(L,x,y,ir){L.r(x,y,4,4,W);L.r(x+1,y+1,2,3,ir);L.p(x+1,y+2,D);L.p(x+2,y+1,'#ffffff');L.r(x,y-1,4,1,D)}
// tape noise: the grey-blue snow of a tape with nothing on it, re-rolled each frame
const SNOW=['#e6ecf6','#a8b4c8','#6a7488','#3a4052','#1a1e2a'];
function noise(L,x0,y0,w,h,f,seed=0,only=false){for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++){if(only&&!L.g(x,y))continue;const v=hsh(x>>1,y,seed+f*7);L.p(x,y,SNOW[(v*5)|0])}}

// ================= THE ENEMIES =================
const B={
// Gideon's nephew Dale: a big fella in a work jacket and a beanie, an aluminum bat he's never hit a ball with. He's
// house-sitting the tapes for his uncle and taking it very seriously. People, so they bleed.
nephew:{name:'Dale',w:48,h:76,f(L,f){const sk='#e0a882',j='#8a5a2a',jd=sh(j,-28),jn='#2e3a52';
 L.r(13,66,10,9,'#2a1e16');L.r(26,66,10,9,'#2a1e16');L.r(12,74,12,2,'#1a120c');L.r(26,74,12,2,'#1a120c');
 L.r(14,46,9,21,jn);L.r(26,46,9,21,sh(jn,-20));L.r(22,48,2,16,sh(jn,-30));
 L.r(9,22,30,26,j);L.r(33,22,6,26,jd);L.r(22,24,2,22,'#5a3a1a');L.r(12,30,7,6,jd);L.r(29,30,7,6,jd);L.tex(j,sh(j,-12),8);L.r(9,44,30,3,'#4a3014');
 L.r(16,20,16,4,'#c8c0b0');  // a hoodie collar under the jacket
 // the bat arm (right, cocked over the shoulder) and the empty fist
 L.r(3,24+f,7,18,j);L.r(3,41+f,7,5,sk);L.r(38,22-f,7,14,jd);L.r(38,35-f,7,5,sk);L.line(41,36-f,46,2-f,'#b8bcc8',3);L.line(43,4-f,46,1-f,'#e8ecf4',1);L.r(40,34-f,5,3,'#1a1a20');
 // head: a round face, a fuzzy chin, small worried eyes, the beanie with a pom
 L.r(19,17,10,5,sh(sk,-25));L.e(24,11,9,10,sh(sk,-28));L.e(23,10,8,9,sk);L.e(23,17,6,3,'#7a4a2a');L.tex('#7a4a2a',sk,4);
 eye(L,18,9,'#5a4a3a');eye(L,25,9,'#5a4a3a');L.r(20,7,4,1,'#5a3a1a');L.r(26,7,4,1,'#5a3a1a');L.r(21,15,5,1,MR);
 L.e(23,3,10,5,'#c8402e');L.r(13,5,21,3,sh('#c8402e',-30));L.e(23,-2,3,3,'#e8e4d8')}},
// Kyle Q., the buddy: skinny, a puffer vest over a hoodie, a cap on backwards, a bike chain wrapped around one fist.
buddy:{name:'Kyle Q.',w:42,h:72,f(L,f){const sk='#c98e62',v='#2a6a5a',vd=sh(v,-26),hd='#5a5a64',jn='#4a5a7a';
 L.r(12,62,8,9,'#e8e4d8');L.r(23,62,8,9,'#e8e4d8');L.r(11,70,10,2,'#8a8a94');L.r(22,70,10,2,'#8a8a94');
 L.r(13,42,7,21,jn);L.r(23,42,7,21,sh(jn,-20));
 L.r(8,20,26,24,hd);L.r(10,21,22,20,v);L.r(26,21,6,20,vd);for(let y=24;y<41;y+=4)L.r(10,y,22,1,sh(v,-18));L.r(20,21,2,20,'#c8c0b0');
 L.r(3,22-f,6,20,hd);L.r(3,41-f,6,5,sk);L.r(33,22+f,6,18,sh(hd,-14));L.r(33,39+f,6,5,sk);
 for(let k=0;k<6;k++){L.r(32+(k%2),44+f+k*2,3,2,'#8a8e98');L.p(33+(k%2),44+f+k*2,'#c8ccd4')}  // the chain hanging off his fist
 L.r(18,15,7,6,sh(sk,-25));L.e(21,10,7,9,sh(sk,-28));L.e(20,9,6,8,sk);
 eye(L,16,8,'#3a2418');eye(L,22,8,'#3a2418');L.r(17,14,6,1,MR);L.p(23,13,MR);L.r(14,13,2,1,sh(sk,-30));
 L.e(20,3,8,4,'#1e2440');L.r(11,4,4,2,'#1e2440');L.r(24,1,6,2,sh('#1e2440',20))}},
// The Regular: somebody who's been watching since 1996. A long overcoat and a hat on a body made of tracking noise:
// where a face or a hand should show, there's snow, and two pale dots that are always looking at you.
regular:{name:'The Regular',w:56,h:94,f(L,f){const c='#3a3446',cd=sh(c,-22),hat='#26222e';
 L.r(16,86,10,7,'#100c14');L.r(30,86,10,7,'#100c14');
 for(let y=30;y<88;y++){const hw=15+Math.round((y-30)*.16);L.r(28-hw,y,hw*2,1,c);L.r(28+hw-6,y,6,1,cd)}
 L.r(27,32,2,54,cd);for(const y of[44,56,68])L.r(23,y,3,3,'#8a7a5a');L.r(14,30,28,6,sh(c,10));L.r(20,30,16,10,sh(c,-30));
 // sleeves hanging, the hands snow
 L.r(6,34+f,9,40,c);L.r(41,34-f,9,40,cd);noise(L,6,74+f,9,7,f,11);noise(L,41,74-f,9,7,f,12);
 // the head: a hat brim over a face of snow, two dots for eyes
 noise(L,18,10,20,22,f,13);for(let y=10;y<32;y++){const k=Math.abs(y-21)/11,hw=Math.round(10*Math.sqrt(Math.max(0,1-k*k)));L.r(18,y,10-hw,1,null);L.r(28+hw,y,10-hw,1,null)}
 L.r(22,18,3,2,'#ffffff');L.r(31,18,3,2,'#ffffff');
 L.e(28,7,15,4,hat);L.r(12,8,32,3,sh(hat,-14));L.r(18,0,20,8,hat);L.r(18,6,20,2,'#5a1a2a')}},
// The watchers: the Audience's other regulars, standing in the dark the way people stand at a bar's TV. Thin, in
// clothes from the club's last winter, their faces a screen of snow with two pale dots.
watcher:{name:'Watcher',w:36,h:68,f(L,f){const c='#4a3a52',jn='#2a3048',sk='#c8b0a0';
 L.r(10,62,6,6,'#100c14');L.r(20,62,6,6,'#100c14');L.r(11,42,6,21,jn);L.r(19,42,6,21,sh(jn,-12));
 L.r(8,20,20,24,c);L.r(22,20,6,24,sh(c,-24));L.r(14,20,8,6,'#e8d8c0');L.r(17,20,2,10,NEON);  // a satin club shirt, a skinny tie
 L.r(3,22+f,6,20,c);L.r(27,22-f,6,20,sh(c,-24));L.r(3,41+f,6,4,sk);L.r(27,41-f,6,4,sk);
 L.r(14,15,8,6,sh(sk,-30));L.e(18,9,8,9,'#2a2e3a');noise(L,10,0,17,18,f,21,true);L.r(14,8,2,2,'#ffffff');L.r(20,8,2,2,'#ffffff')}},
// The boss: Vesper, the best dancer the club ever had, still on her last winter: thin, pale, sores on her arms, a
// magenta sequined leotard under a sheer stage robe, long dark hair, mid-spin and too fast. Her face is the same face.
// Phase 2 ('vesper2'): the Audience comes through. Every sore opens into an eye, a halo of tracking noise flickers
// around her, and her own eyes go white with the glare of a screen.
vesper:{name:'Vesper',w:72,h:116,f(L,f,ph2){const sk='#e8cfc0',skd=sh(sk,-34),hair='#1a1018',suit=NEON,sd=sh(NEON,-50),robe='#c8a8d8',t=f?1:0;
 if(ph2)for(let y=0;y<116;y+=3)for(let x=0;x<72;x+=2){const r=Math.hypot(x-36,(y-50)*.7);if(r>30&&r<36&&hsh(x,y,f+71)<.5)L.p(x,y,SNOW[(hsh(x,y,f+72)*4)|0])}
 // the robe flaring out behind her in the spin
 for(let y=26;y<96;y++){const hw=10+Math.round((y-26)*.32)+(t?2:0);for(let x=36-hw;x<36+hw;x++)if((x+y)%3!==0)L.p(x,y,(x<36?sh(robe,-10):robe))}
 // legs in heels, one turned out
 L.r(29,72,5,36,sk);L.r(38,72,5,32,skd);L.line(43,104,49,110,skd,4);L.r(27,108,7,3,'#2a0a1a');L.r(26,110,3,6,'#2a0a1a');L.r(46,110,8,3,'#2a0a1a');L.r(52,112,2,4,'#2a0a1a');
 // the leotard: sequins catching light
 L.r(28,40,17,34,suit);L.r(40,40,5,34,sd);L.e(36,72,9,4,suit);for(let k=0;k<26;k++){const x=29+((k*7)%15),y=42+((k*11)%30);L.p(x,y,k%3?'#ffb0d8':'#ffffff')}
 L.r(31,36,11,6,sk);L.r(33,40,7,4,skd);
 // arms up and out, too long in the spin; the sores
 L.line(30,40,14,22-t*2,sk,4);L.line(14,22-t*2,8,6-t,sk,3);L.line(43,40,58,28+t,skd,4);L.line(58,28+t,66,14+t,skd,3);
 L.e(8,5-t,3,3,sk);L.e(66,13+t,3,3,skd);
 for(const[x,y]of[[22,32],[18,27],[12,15],[52,33],[60,23],[32,58],[41,80],[31,90],[35,46]])L.e(x,y,1.5,1.5,ph2?W:'#7a2a3a');
 if(ph2)for(const[x,y]of[[22,32],[18,27],[12,15],[52,33],[60,23],[32,58],[41,80],[31,90],[35,46]]){L.p(x,y,'#2a3a5a');L.p(x,y-1,'#ffffff')}
 // the head, turned to you mid-spin: hair whipping out the far side
 L.e(37,23,8,9,skd);L.e(36,22,7,8,sk);L.e(39,13,10,6,hair);for(let k=0;k<5;k++)L.line(44,14+k*2,56+k,8+k*5+t*2,hair,2);L.r(29,16,3,10,hair);
 if(!ph2){eye(L,31,20,'#3a2a3a');eye(L,37,20,'#3a2a3a');L.r(31,19,10,1,'#5a1a4a')}else{L.r(31,20,4,3,'#ffffff');L.r(37,20,4,3,'#ffffff');L.r(30,19,12,1,'#ffffff')}
 L.r(34,27,5,1,'#8a2a4a');L.e(31,25,1.2,1.2,'#7a2a3a');L.p(36,24,skd)}}
};

// ================= WOUNDED ENEMIES (Art, Townsfolk and monsters, Wounded enemies) =================
// Two steps: at half HP and at a quarter. Dale and Kyle are people and bleed. The Regular and the watchers are noise in
// clothes: a hit tears the picture and the snow shows through, then a piece of them is just gone. Vesper bleeds noise:
// her sores split and tape ribbon spills out of them.
const WPAD=8,BLOOD='#6e121c',BLOODW='#a8202c',RIBBON='#2a2026',RIBBONL='#4a4050';
const grey=(h,k)=>{const n=parseInt(h.slice(1),16),r=n>>16,g=n>>8&255,b=n&255,l=(r*.3+g*.59+b*.11)*.82,f=v=>Math.max(0,Math.min(255,Math.round(v+(l-v)*k-k*18)));
 return'#'+[r,g,b].map(v=>f(v).toString(16).padStart(2,'0')).join('')};
const inBlob=(x,y,cx,cy,rx,ry,sd)=>{const a=(x+.5-cx)/rx,b=(y+.5-cy)/ry,t=Math.atan2(b,a),r=1+.22*Math.sin(5*t+sd)+.12*Math.sin(9*t+sd*2.3);return a*a+b*b<=r*r};
const blob=(L,cx,cy,rx,ry,sd,fn)=>{for(let y=Math.floor(cy-ry*1.4);y<=cy+ry*1.4;y++)for(let x=Math.floor(cx-rx*1.4);x<=cx+rx*1.4;x++)if(inBlob(x,y,cx,cy,rx,ry,sd))fn(x,y)};
const Wk={
 bite(L,cx,cy,rx,ry,sd=1){blob(L,cx,cy,rx,ry,sd,(x,y)=>{if(L.g(x,y))L.p(x,y,null)})},
 stain(L,cx,cy,rx,ry,sd=3,c=BLOOD,c2=BLOODW){blob(L,cx,cy,rx,ry,sd,(x,y)=>{if(L.g(x,y))L.p(x,y,c)});blob(L,cx-rx*.15,cy-ry*.2,rx*.5,ry*.5,sd+1,(x,y)=>{if(L.g(x,y))L.p(x,y,c2)})},
 drip(L,x,y,n,c=BLOOD){for(let j=0;j<n;j++)for(const i of[0,1])if(L.g(x+i,y+j))L.p(x+i,y+j,c)},
 // snow showing through a tear in the picture
 tear(L,cx,cy,rx,ry,sd=2,f=0){blob(L,cx,cy,rx,ry,sd,(x,y)=>{if(L.g(x,y))L.p(x,y,SNOW[(hsh(x>>1,y,sd+f*7)*5)|0])})},
 // tape ribbon spilling from (x, y) down to the ground row gy, in loose loops
 ribbon(L,x,y,gy,sd=0){let px=x;for(let yy=y;yy<=gy;yy++){px+=Math.round(Math.sin((yy+sd*5)/3)*1.2);L.p(px,yy,RIBBON);L.p(px+1,yy,(yy+sd)%4?RIBBON:RIBBONL)}L.e(px,gy,5,2,RIBBON);L.r(px-3,gy-1,6,1,RIBBONL)},
 dull(L,x0,x1,amt){const d=x1>x0?1:-1;for(let y=0;y<L.h;y++)for(let x=x0;d>0?x<=x1:x>=x1;x+=d){const v=L.g(x,y);if(!v||SNOW.includes(v)||v===RIBBON||v===RIBBONL)continue;L.p(x,y,grey(v,amt*Math.min(1,.4+.6*Math.abs(x-x0)/Math.max(1,Math.abs(x1-x0)))))}},
 lean(L,dx,y0,y1){const W_=L.W,d=L.d;for(let y=0;y<y1;y++){const s=Math.round(dx*Math.min(1,(y1-y)/Math.max(1,y1-y0)));if(!s)continue;const row=d.slice(y*W_,y*W_+W_);for(let x=0;x<W_;x++){const sx=x-s;d[y*W_+x]=sx>=0&&sx<W_?row[sx]:null}}},
 sag(L,x0,y0,w,h,dy,dx=0){const px=[];for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++){const v=L.g(x,y);if(v){px.push([x,y,v]);L.p(x,y,null)}}px.forEach(([x,y,v])=>L.p(x+dx,y+dy,v))},
 cut(L,x,y,w,h){for(let j=0;j<h;j++)for(let i=0;i<w;i++)L.p(x+i,y+j,null)}
};
const WOUND={
// Dale: a bloody nose into the fuzzy chin and a torn sleeve; then his side soaked, the bat arm hanging, the beanie gone
nephew(L,s){
 if(s===1){Wk.stain(L,23,16,3,2,2);Wk.drip(L,22,18,6);Wk.stain(L,34,30,4,4,3);Wk.dull(L,24,48,.3);Wk.lean(L,-1,8,26)}
 else{Wk.stain(L,23,16,4,3,2);Wk.drip(L,21,19,9);Wk.stain(L,30,34,7,7,3);Wk.drip(L,28,40,12);Wk.drip(L,33,40,10);Wk.sag(L,37,0,12,44,8,-1);Wk.cut(L,12,-3,24,7);L.r(16,2,14,2,'#6a3a1a');Wk.dull(L,22,48,.5);Wk.lean(L,-3,8,44)}},
// Kyle: a split eyebrow and blood on the vest; then the vest torn open, the chain arm down and his knees going
buddy(L,s){
 if(s===1){Wk.stain(L,17,7,2,2,2);Wk.drip(L,16,9,5);Wk.stain(L,14,30,4,4,3);Wk.dull(L,20,42,.3);Wk.lean(L,1,8,24)}
 else{Wk.stain(L,17,7,3,3,2);Wk.drip(L,15,10,8);Wk.stain(L,16,31,6,7,3);Wk.drip(L,13,38,10);Wk.sag(L,32,20,10,40,6);Wk.sag(L,0,0,42,20,2,1);Wk.dull(L,18,42,.5);Wk.lean(L,3,8,40)}},
// the Regular: the coat tears onto snow; then a sleeve is empty and hangs, the hat's knocked askew and half the face is gone
regular(L,s,f){
 Wk.tear(L,24,52,s>1?7:4,s>1?10:6,2,f);Wk.tear(L,36,70,s>1?5:3,s>1?7:4,3,f);
 if(s===1){Wk.dull(L,28,56,.3);Wk.lean(L,2,10,40)}
 else{Wk.cut(L,41,34,9,47);Wk.bite(L,33,20,6,8,2);Wk.sag(L,10,0,36,10,3,3);Wk.dull(L,24,56,.55);Wk.lean(L,4,10,70)}},
// a watcher: the face's snow tears down into the shirt; then a shoulder is gone and the face is half dark
watcher(L,s,f){
 Wk.tear(L,18,24,s>1?5:3,s>1?6:3,1,f);
 if(s===1){Wk.dull(L,18,36,.3);Wk.lean(L,1,6,22)}
 else{Wk.bite(L,24,4,5,6,2);Wk.cut(L,27,20,9,26);Wk.tear(L,14,34,4,6,3,f);Wk.dull(L,16,36,.5);Wk.lean(L,3,6,44)}},
// Vesper: the sores split and the snow shows through them; then an arm is static to the shoulder, the robe hangs in
// rags, and tape ribbon spills from her side to the floor
vesper(L,s,f){
 for(const[x,y]of s>1?[[22,32],[52,33],[32,58],[41,80],[35,46],[18,27]]:[[22,32],[32,58],[52,33]])Wk.tear(L,x,y,s>1?3:2,s>1?3:2,x,f);
 if(s===1){Wk.dull(L,36,72,.25);Wk.lean(L,2,10,50);Wk.ribbon(L,44,60,115,1)}
 else{for(let k=0;k<14;k++)Wk.tear(L,58-k*.6,30-k*1.2,2,2,k,f);Wk.bite(L,20,80,6,12,3);Wk.bite(L,52,86,5,10,4);Wk.dull(L,30,72,.5);Wk.lean(L,4,10,70);Wk.ribbon(L,42,58,115,2);Wk.ribbon(L,30,64,115,3)}}
};

// ================= THE BOSS'S PORTRAIT (she talks) =================
// Her face from the tape, the same as in 1996: thin and pale, dark eyes, sores at her jaw and collarbone, long dark
// hair, the magenta of the leotard at the bottom edge. Under the club's light she almost looks well.
function portraitLayer(open){const L=Ly(64,64),sk='#e8cfc0',hair='#1a1018';
 L.e(32,30,22,26,hair);L.r(10,30,10,34,hair);L.r(44,30,10,34,sh(hair,8));
 L.r(14,54,36,10,NEON);L.r(40,54,10,10,sh(NEON,-50));for(let k=0;k<10;k++)L.p(16+k*3,56+(k%2)*3,'#ffb0d8');
 L.r(26,44,12,10,sh(sk,-30));L.e(32,30,13,16,sh(sk,-30));L.e(31,29,12,15,sk);L.e(26,22,4,3,sh(sk,14));L.e(31,16,13,6,hair);L.r(18,18,5,14,hair);L.r(41,18,4,12,hair);
 for(const[x,y]of[[22,38],[41,40],[24,50],[38,52]])L.e(x,y,1.5,1.5,'#7a2a3a');
 L.r(21,27,7,5,W);L.r(23,28,3,4,'#3a2a3a');L.p(24,29,D);L.p(25,28,'#ffffff');L.r(21,26,7,1,D);
 L.r(35,27,7,5,W);L.r(37,28,3,4,'#3a2a3a');L.p(38,29,D);L.p(39,28,'#ffffff');L.r(35,26,7,1,D);
 L.r(21,33,6,1,sh(sk,-24));L.r(36,33,6,1,sh(sk,-24));L.p(31,35,sh(sk,-40));L.p(32,36,sh(sk,-40));
 if(open){L.r(28,39,8,1,MR);L.r(27,40,10,3,MR);L.r(28,41,8,1,'#d8607a')}else{L.r(28,40,8,1,'#8a2a4a');L.p(27,39,MR);L.p(36,39,MR)}
 return L}
const pc={};
function portrait(ctx,open){const k=open?1:0;if(!pc[k]){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');
  const gr=x.createRadialGradient(22,18,4,32,32,46);gr.addColorStop(0,'#5a2a4a');gr.addColorStop(1,'#1e1024');x.fillStyle=gr;x.fillRect(0,0,64,64);
  x.fillStyle='rgba(127,160,200,.12)';for(let y=0;y<64;y+=3)x.fillRect(0,y,64,1);blit(x,portraitLayer(k));pc[k]=c}
 ctx.clearRect(0,0,64,64);ctx.drawImage(pc[k],0,0)}

// ================= BATTLE BACKDROPS (Combat, Basics, Backgrounds) =================
// Head-on at battle scale, one per kind of place the case fights in: Gideon's apartment ('gideon': walls of tapes, the
// two stacked TVs, the viewing chair), Club Satin ('club': the dead pole stage, the bar, the booths, under dust, its
// neon off unless the lights are woken), the dub room ('dub': a wall of VCRs and screens all playing snow) and Fourth
// Street at night ('street': the motel's pole sign, neon on snow, the casino's glow). Low SAN shrinks the lights like on
// the map, and battle.js lays the sour over it.
const BDC={};
function backdrop(place,o){const f=BDRAW[place];if(!f)return null;const lit=place==='club'&&!!(window.G&&G.flags&&G.flags.lights);
 const key=[place,o.light,o.low?1:0,o.w,o.h,o.feet,lit?1:0,place==='dub'?((performance.now()/250)|0)%4:0].join('|');if(BDC[key])return BDC[key];
 const c=document.createElement('canvas');c.width=o.w;c.height=o.h;const g=c.getContext('2d');
 const hz=Math.round(Math.max(30,Math.min(o.feet-12,o.h*.44)));
 f(bdKit(g),o.w,o.h,hz,Object.assign({lit},o));BDC[key]=c;return c}
function bdKit(g){const R=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))};
 const K={g,R,
  hash:(a,b=0)=>hsh(a,b,9),
  bands(y0,y1,cols,W_){const n=cols.length,hh=(y1-y0)/n;for(let i=0;i<n;i++){const a=Math.round(y0+i*hh),b=Math.round(y0+(i+1)*hh);R(0,a,W_,b-a,cols[i]);
   if(i<n-1)for(let x=0;x<W_;x++){if((x&1)===0)R(x,b-1,1,1,cols[i+1]);if((x&3)===1)R(x,b-2,1,1,cols[i+1])}}},
  ell(cx,cy,rx,ry,c){for(let y=-Math.ceil(ry);y<=Math.ceil(ry);y++){const q=1-(y/ry)**2;if(q<0)continue;const hw=rx*Math.sqrt(q);R(cx-hw,cy+y,hw*2,1,c)}},
  line(x0,y0,x1,y1,c,w=1){const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);for(let i=0;i<=n;i++)R(x0+(x1-x0)*i/n,y0+(y1-y0)*i/n,w,w,c)},
  pool(cx,cy,rx,ry,c,a,steps=4){g.globalCompositeOperation='lighter';g.globalAlpha=a/steps;for(let i=0;i<steps;i++){const k=1-i/steps;K.ell(cx,cy,rx*k,ry*k,c)}g.globalAlpha=1;g.globalCompositeOperation='source-over'},
  // 3 × 5 capitals for painted signs (made-up names only)
  text(s,x,y,c,k=1){const F={A:'010101111101101',B:'110101110101110',C:'111100100100111',D:'110101101101110',E:'111100110100111',H:'101101111101101',I:'111010010010111',K:'101101110101101',L:'100100100100111',M:'101111111101101',N:'101111111111101',O:'111101101101111',P:'110101110100100',R:'110101110101101',S:'111100111001111',T:'111010010010010',U:'101101101101111',V:'101101101101010',W:'101101101111101',Y:'101101010010010',G:'111100101101111',Z:'111001010100111'};
   [...s].forEach((ch,i)=>{const b=F[ch];if(b)for(let j=0;j<15;j++)if(b[j]==='1')R(x+(i*4+j%3)*k,y+(j/3|0)*k,k,k,c)})},
  // a CRT: a dark case and a screen of snow (or a solid colour)
  crt(x,y,w,h,seed,col){R(x,y,w,h,'#1e1e26');R(x+1,y+1,w-2,1,'#3a3a44');const sx=x+3,sy=y+3,sw=w-6,shh=h-7;
   if(col){R(sx,sy,sw,shh,col);for(let j=0;j<shh;j+=2)R(sx,sy+j,sw,1,'rgba(0,0,0,.18)')}
   else for(let j=0;j<shh;j++)for(let i=0;i<sw;i+=2)R(sx+i,sy+j,2,1,SNOW[(hsh(i+seed,j,seed)*4)|0]);
   R(x+w-4,y+h-3,2,1,'#c8402e')}};
 return K}
const BDRAW={
gideon(K,W_,H,hz,o){const R=K.R,low=o.low;
 // the walls are tapes, floor to ceiling, every spine labeled in the same careful hand
 R(0,0,W_,hz,'#2a2420');
 for(let y=2;y<hz-4;y+=9){R(0,y+7,W_,2,'#5a4430');for(let x=0;x<W_;x+=5){const v=K.hash(x,y);R(x,y,4,7,v<.15?'#e8e4d8':v<.3?'#2a3a5a':'#14141a');R(x+1,y+2,2,2,v<.6?'#e8dcc0':'#c8402e')}}
 // the two stacked TVs on their stand, snow on both, and the viewing chair
 const tx=Math.round(W_*.5)-26,ty=Math.max(4,hz-62);R(tx-4,hz-10,60,10,'#3a2a1e');K.crt(tx,ty+28,52,26,3,null);K.crt(tx+4,ty,44,26,5,null);
 if(!low)K.pool(tx+26,ty+30,40,30,'#a8b8d8',.18,4);
 R(Math.round(W_*.78),hz-30,30,30,'#5a3a2a');R(Math.round(W_*.78)-4,hz-22,8,22,'#4a3022');R(Math.round(W_*.78)+28,hz-22,8,22,'#4a3022');
 // the floor: old wood and a braided rug
 K.bands(hz,H,['#4a3626','#52402e','#5a4632'],W_);for(let x=0;x<W_;x+=18)R(x,hz,1,H-hz,'#3a2a1c');
 K.ell(W_/2,hz+(H-hz)*.55,W_*.36,(H-hz)*.3,'#6a3a3a');K.ell(W_/2,hz+(H-hz)*.55,W_*.28,(H-hz)*.22,'#7a5a3a');K.ell(W_/2,hz+(H-hz)*.55,W_*.18,(H-hz)*.14,'#5a3a4a')},
club(K,W_,H,hz,o){const R=K.R,low=o.low,lit=o.lit;
 // the back wall in dust, the dead neon over the stage (lit pink only when the lights are woken)
 K.bands(0,hz,['#140c18','#180e1c','#1c1020','#201224'],W_);
 const nx=Math.round(W_*.5);R(nx-40,6,80,14,'#1a1018');K.text('SATIN',nx-29,9,lit?NEON:'#3a2038',2);if(lit)K.pool(nx,13,46,16,NEON,.4,4);
 // the pole stage in the middle, the pole cloudy chrome; at the sides, booths in split red vinyl; the bar at the right
 const sy=hz-8;K.ell(nx,sy,58,10,'#14101a');K.ell(nx,sy-2,56,9,lit?'#6a3a5a':'#3a2a3a');R(nx-2,4,4,sy-6,'#a8a8b4');R(nx-1,4,1,sy-6,'#e0e0ea');
 if(lit){K.pool(nx,sy-20,60,40,'#ffd8f0',.22,4);K.pool(nx,sy,70,14,NEON,.2,3)}
 for(const bx of[4,W_-70]){R(bx,hz-28,66,24,'#5a1a2a');R(bx,hz-28,66,3,'#7a2a3a');R(bx+6,hz-8,54,8,'#2a1a1a');for(let k=0;k<5;k++)R(bx+8+k*12,hz-24+((k*7)%5),1,6,'#2a0a14')}
 R(W_-64,hz-46,64,12,'#2a1a1a');for(let k=0;k<7;k++)R(W_-60+k*9,hz-54,3,8,['#3a5a3a','#5a3a2a','#8a8a94'][k%3]);
 // chairs stacked upside down on the near tables, and the dust on the floor
 for(const x of[30,W_-40]){K.ell(x,hz+4,14,4,'#2a1a1a');R(x-8,hz-14,6,14,'#3a2a2a');R(x+2,hz-14,6,14,'#3a2a2a')}
 K.bands(hz,H,['#24142a','#2a1830','#2e1a34'],W_);for(let i=0;i<70;i++){const x=K.hash(i,61)*W_|0,y=hz+2+(K.hash(i,62)*(H-hz-3)|0);R(x,y,2,1,'#4a3a52')}
 const k=low?.6:1;K.pool(W_/2,H+4,110*k,(H-hz)*.6*k,lit?'#ffd8f0':'#d9772b',lit?.18:.2,5)},
dub(K,W_,H,hz,o){const R=K.R,low=o.low;
 // under the stage: a wall of VCRs and TVs wired together, every one on, every one playing the same snow
 R(0,0,W_,H,'#0a0a10');const cols=Math.ceil(W_/30),rows=Math.max(2,Math.floor((hz-4)/22)),seed=((performance.now()/250)|0)%4;
 for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const x=i*30-((j%2)*12),y=2+j*22;K.crt(x,y,28,20,i*13+j*7+seed,null)}
 for(let i=0;i<cols;i++)for(let j=0;j<rows;j++)K.line(i*30+14,2+j*22+20,i*30+20,hz,'#1a1a22');
 K.pool(W_/2,hz*.5,W_*.6,hz*.6,'#a8b8d8',low?.1:.18,4);
 // the concrete floor and the bench with the one deck apart
 K.bands(hz,H,['#3a3a40','#424248','#4a4a50'],W_);for(let x=0;x<W_;x+=24)R(x,hz,1,H-hz,'#2a2a30');
 const bx=Math.round(W_*.5)-30;R(bx,hz-6,60,6,'#6a4a32');R(bx,hz-6,60,1,'#8a6a4a');R(bx+22,hz-12,16,6,'#3a3a44');R(bx+24,hz-11,12,2,NEON)},
street(K,W_,H,hz,o){const R=K.R,low=o.low,nt=o.light!=='day'&&o.light!=='dusk';
 K.bands(0,hz,nt?['#06081a','#0a0e24','#141430','#1e1838']:['#9aa8b8','#b0bcc8','#c8d0d8'],W_);
 // the motel's row and its tall pole sign, the club's dead marquee, the casino's glow at the far end
 R(0,hz-40,W_*.45,40,nt?'#2a2a36':'#8a8a94');for(let x=6;x<W_*.45;x+=22){R(x,hz-28,10,28,nt?'#1a1a22':'#3e5a6a');R(x+12,hz-24,8,8,nt?'#e7b65a':'#a8c4d8')}
 const px=Math.round(W_*.38);R(px,hz-90,4,90,'#3a3a44');R(px-20,hz-96,44,24,'#3e7a7a');K.text('STARLITE',px-18,hz-92,'#ffffff');K.text('MOTOR',px-12,hz-84,nt?GOLD:'#2a2a36');
 R(W_*.55,hz-46,W_*.3,46,nt?'#1e1622':'#5a4a5a');R(W_*.55,hz-52,W_*.3,8,'#14101a');K.text('SATIN',Math.round(W_*.55)+6,hz-50,'#3a2038');
 if(nt){K.pool(W_*.95,hz-30,60,50,GOLD,.3,4);K.pool(px+2,hz-84,30,20,'#3e7a7a',.3,3)}
 // the snowbank along the curb, the street, slush
 for(let x=0;x<W_;x+=8)K.ell(x+4,hz-1,7,4,nt?'#8a8ea8':'#e8ecf2');
 K.bands(hz+1,H,nt?['#1c1a24','#201d28','#24202c']:['#6a6a74','#74747e','#7e7e88'],W_);
 for(let i=0;i<40;i++){const x=K.hash(i,71)*W_|0,y=hz+3+(K.hash(i,72)*(H-hz-5)|0);R(x,y,3,1,nt?'#3a3646':'#9a9aa4')}
 if(nt){const k=low?.65:1;K.pool(W_*.2,H,80*k,(H-hz)*.5*k,'#ff9a3c',.2,4);K.pool(W_*.7,H,70*k,(H-hz)*.5*k,NEON,.16,4)}}
};

const SZ=k=>{const A=B[k==='vesper2'?'vesper':k];return A?[A.w,A.h]:[16,16]};
const cache=new Map();
// step: 0 unhurt, 1 at half HP, 2 at a quarter. A wounded sprite is 8 px wider each side so a lean or a spill isn't cut
// off; drawn centred, so it stays put, and the same height, so the feet stay on the ground.
function sprite(k,frame,step){step=step|0;const ph2=k==='vesper2',base=ph2?'vesper':k,key=k+(frame?1:0)+':'+step;let c=cache.get(key);if(c)return c;const A=B[base];if(!A)return null;
 const L=Ly(A.w,A.h,step?WPAD:0);A.f(L,frame?1:0,ph2);if(step){Wk.cut(L,-WPAD,0,WPAD,A.h);Wk.cut(L,A.w,0,WPAD,A.h);if(WOUND[base])WOUND[base](L,step,frame?1:0,ph2)}
 c=document.createElement('canvas');c.width=L.W;c.height=A.h;blit(c.getContext('2d'),L);cache.set(key,c);return c}
return{B,sprite,size:SZ,portrait,backdrop};
})();
