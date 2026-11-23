// Black Lantern · cases/lantern-01-battle-art.js · LANTERN 01's battle art (spec 014 part B, Nov 23, 2026).
// SPOILERS for the case: its enemies and its boss. Made the way Good Manners' is (cases/good-manners-battle-art.js):
// big head-on battle sprites with the light rim, both damage steps for every enemy (Art, Townsfolk and monsters,
// Wounded enemies), the case's painted battle backdrops (Combat, Basics, Backgrounds) and the boss's 64 x 64 talking
// portrait. Art for this case only; it goes to the Asset Library's LANTERN 01 page. Exposes window.L01B.
//   L01B.sprite(key, frame, step) -> cached canvas; frame 0/1 is the idle; step 0 unhurt, 1 at half HP, 2 at a quarter.
//      key: bull, coat, gull, piling, tenant, tenant2 (its second phase). The clean-up agent is the agency's own and is
//      drawn by Still Harvest's file (SHB), the same crew in every case.
//   L01B.size(key) -> [w, h]   L01B.portrait(ctx, open) draws THE TENANT's face
//   L01B.backdrop(place, {w, h, light, low, feet}) -> the backdrop for 'town', the rooms ('loft' and the other
//      interiors) or 'cannery'
window.L01B=(()=>{
const OL='#120c1c',D='#24141e',W='#f4efe6',MR='#5a1a22';
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
// light from the upper left: the lit edge gets a rim, every edge a dark outline
function finish(L){const w=L.W,{h,d}=L,o=d.slice(),G=(x,y)=>(x<0||y<0||x>=w||y>=h)?null:d[y*w+x];for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x,v=d[i];
 if(v){if((x>0&&!G(x-1,y))||(y>0&&!G(x,y-1)))o[i]=sh(v,30)}
 else if(G(x-1,y)||G(x+1,y)||G(x,y-1)||G(x,y+1))o[i]=OL}return o}
function blit(c,L,ox=0,oy=0){const o=finish(L),w=L.W;for(let i=0;i<o.length;i++)if(o[i]){c.fillStyle=o[i];c.fillRect(ox+i%w,oy+(i/w|0),1,1)}}
// a pale gray eye that doesn't blink: too much white, a small iris, the lid line pulled up off it
function stare(L,x,y,ir='#9aa8b4'){L.r(x,y,5,4,W);L.r(x+1,y+1,3,2,ir);L.p(x+2,y+1,D);L.p(x+1,y+1,'#ffffff');L.r(x,y-2,5,1,D)}

// ================= THE ENEMIES =================
const OIL='#4a5636',OILD='#323b24',BRINE='#2c4a46',BRINEL='#5a8a80',SEA='#3a4a48',SKIN='#e0b088',HAIR='#9aa0a6';
const B={
// The bull on the dock: a sea lion bull hauled out on the pier, something sublet in it. Thick brown neck, the mane gone
// dark with rain, little ears, whiskers. The wrong detail: its eyes don't blink, and its mouth is pursed, whistling.
bull:{name:'The bull',w:98,h:66,f(L,f){const b='#7a5a3a',bd=sh(b,-30),bl=sh(b,22),t=f?1:0;
 // the long body lying back along the planks, rear flippers out behind
 L.e(40,52,34,12,bd);L.e(38,50,32,11,b);L.e(30,46,16,5,bl);L.r(4,56,14,6,bd);L.line(2,60,10,54,bd,3);
 for(let x=14;x<70;x+=7)L.p(x,57-((x*3)%4),sh(b,-14));
 // the front flippers, braced
 L.e(58,60,6,4,bd);L.e(76,61,7,4,bd);L.r(54,61,10,3,'#3a2a1e');L.r(72,62,12,3,'#3a2a1e');
 // the thick neck rising, the mane, the head up and turned to you
 L.e(70,38,14,18,bd);L.e(68,37,13,17,b);L.tex(b,sh(b,-18),5);L.e(64,30,6,8,bl);
 L.e(78-t,18,12,10,bd);L.e(77-t,17,11,9,b);L.e(86-t,21,7,5,sh(b,10));L.p(92-t,20,'#1a1410');L.p(92-t,23,'#1a1410');
 L.r(72-t,9,2,3,bd);L.r(80-t,9,2,3,bd);
 // the eyes: open, gray, wet, not blinking
 stare(L,72-t,14);stare(L,80-t,14);
 // the mouth pursed small, like it's whistling; whiskers
 L.e(89-t,26,2,2,'#2a1a14');L.p(89-t,26,'#5a3a2a');
 for(let k=0;k<4;k++){L.line(86-t,22+k,96-t,20+k*2,'#e8dcc0');}
 // rain beaded on the coat, a few barnacles where no sea lion has them
 for(let i=0;i<14;i++){const x=12+((i*23)%64),y=40+((i*13)%16);if(L.g(x,y))L.p(x,y,'#c8d8e4')}
 [[46,44],[52,47],[60,42]].forEach(([x,y])=>{L.r(x,y,2,2,'#d8d0c0');L.p(x+1,y+1,'#6a6a64')})}},
// The empty coat: Teague's spare oilskin and his boots, standing up off the hook with nothing in them. The collar is up
// around a dark hole where a head would be; the sleeves hang a little too long; the boots don't touch the floor.
coat:{name:'Empty coat',w:52,h:86,f(L,f){const c=OIL,cd=OILD,cl=sh(c,20),t=f?1:0;
 // the boots, a hand's width off the floor, no legs in the gap
 L.r(13,74+t,10,10,'#2a1e18');L.r(28,74+t,10,10,'#2a1e18');L.r(11,82+t,13,3,'#1a1410');L.r(27,82+t,13,3,'#1a1410');L.r(14,74+t,8,1,'#3a2e26');L.r(29,74+t,8,1,'#3a2e26');
 // the coat: long, flared, its buttons done all the way up
 for(let y=16;y<70;y++){const hw=12+Math.round((y-16)*.14);L.r(26-hw,y+t,hw*2,1,c);L.r(26+hw-5,y+t,5,1,cd)}
 L.r(25,18+t,2,50,cd);[24,32,40,48,56].forEach(y=>L.r(23,y+t,2,2,'#c8a040'));
 L.tex(c,sh(c,-10),9);for(let y=22;y<68;y+=9)L.rm(8,y+t,36,1,cl);
 // the sleeves, too long, lifting toward you; no hands, the cuffs just open
 L.r(4,20+t,8,40,c);L.r(4,20+t,2,40,cl);L.r(40,18-t,8,38,cd);L.e(8,60+t,4,3,'#0e0c10');L.e(44,56-t,4,3,'#0e0c10');
 // the collar up and the hole in it
 L.r(14,6+t,24,12,c);L.r(14,6+t,24,2,cl);L.e(26,12+t,8,6,'#0a080c');L.e(26,13+t,6,4,'#020104');
 // rain running off it, and the river: a dark wet line down the front that keeps dripping
 for(let i=0;i<10;i++){const x=10+((i*13)%34),y=24+((i*17)%42);if(L.g(x,y+t))L.p(x,y+t,'#b8c8d8')}
 L.r(17,66+t,2,6,BRINE);L.r(33,68+t,2,4,BRINE)}},
// The gulls: a flock of three on the rail at night, rain on their backs. Gulls, yellow beaks with the red spot, all
// three heads turned the same way. The wrong detail: their eyes are a man's eyes, gray, with whites.
gull:{name:'Gulls',w:66,h:52,f(L,f){const w='#e8e8e8',g='#9aa4ac',gd=sh(g,-30),y='#e8c040';
 const one=(x,yy,s,flap)=>{L.e(x,yy+8*s,9*s,7*s,w);L.e(x+2,yy+6*s,9*s,4*s,g);if(flap){L.line(x-2,yy+4*s,x-14*s,yy-6*s,g,3);L.line(x-2,yy+4*s,x-12*s,yy-2*s,gd,2)}else{L.e(x+4,yy+6*s,8*s,3*s,gd)}
  L.r(x+8*s,yy+3*s,3,4,'#1a1820');L.e(x-6*s,yy+1*s,5*s,5*s,w);L.r(x-15*s,yy+1*s,6*s,2,y);L.p(x-11*s,yy+2*s,'#d8402e');
  L.r(x-8*s,yy-1*s,3,3,W);L.p(x-7*s,yy,'#9aa8b4');L.p(x-7*s,yy,D);L.r(x-8*s,yy-2*s,3,1,D);
  L.r(x-2,yy+14*s,1,5*s,'#d89a3a');L.r(x+2,yy+14*s,1,5*s,'#d89a3a')};
 one(22,18+(f?1:0),1,f);one(48,14-(f?1:0),1,!f);one(36,30,1.15,0);
 L.r(0,48,66,4,'#5a4a3a');L.r(0,48,66,1,'#7a6a5a')}},
// The piling: a drowned thing tangled in old green gillnet, standing up out of the river like a stake. Pale and
// swollen, kelp for hair, barnacles on its shoulders, a cork float hanging off the net. It walks the pier at night.
piling:{name:'The piling',w:56,h:90,f(L,f){const sk='#b8c0b0',skd=sh(sk,-34),net='#3a6a4a',kelp='#4a5a2a',t=f?1:0;
 L.r(16,72,10,18,skd);L.r(30,72,10,18,sh(skd,-10));L.r(14,86,13,4,'#2a3028');L.r(29,86,13,4,'#2a3028');
 L.e(28,48,16,26,skd);L.e(26,47,15,25,sk);L.tex(sk,'#a0aa98',5);
 L.r(6,32+t,8,34,sk);L.r(42,30-t,8,36,skd);L.e(10,68+t,5,4,skd);L.e(46,66-t,5,4,skd);
 L.e(28,16,11,12,skd);L.e(27,15,10,11,sk);L.r(20,13,4,3,'#2a3a30');L.r(31,13,4,3,'#2a3a30');L.p(21,14,'#c8d8c8');L.p(32,14,'#c8d8c8');L.r(23,21,9,3,'#2a2a24');
 // kelp for hair, hanging over the face
 for(let i=0;i<7;i++){const x=17+i*3;L.line(x,4,x+((i%2)?2:-1),22+(i%3)*3,kelp,2)}
 // the net: diagonal strands over everything, and a cork float
 const mline=(x0,y0,x1,y1)=>{const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0));for(let i=0;i<=n;i++){const x=Math.round(x0+(x1-x0)*i/n),y=Math.round(y0+(y1-y0)*i/n);if(L.g(x,y))L.p(x,y,net)}};
 for(let k=-60;k<70;k+=9){mline(k,10,k+50,90);mline(k+50,10,k,90)}
 L.e(46,46+t,4,5,'#c8783a');L.r(45,40+t,1,6,net);
 [[14,28],[38,26],[30,34]].forEach(([x,y])=>{L.rm(x,y,3,2,'#e0d8c8');L.p(x+1,y,'#6a6a64')});
 for(let i=0;i<8;i++){const x=10+((i*11)%38),y=30+((i*19)%50);if(L.g(x,y))L.p(x,y,'#8ab0a8')}}},
// The boss: Abel Teague, upright in the flooded retort room, the water around his shins. His oilskin, his wet gray
// hair, a polite face with the eyes too wide and the rain still running into them. Behind and around him, a shade
// darker and an inch bigger, the shape of what's sitting in him, its hands an inch inside his hands.
// Phase 2 ('tenant2'), the lease breaks: his head sits at a wrong angle, the shape pushes up out of his collar, and a
// second pair of hands comes out of his sleeves.
tenant:{name:'The Tenant',w:80,h:116,f(L,f,ph2){const c=OIL,cd=OILD,cl=sh(c,20),s=SKIN,t=f?1:0,shade='#1c2422';
 // the shape around him: a dark outline an inch bigger than he is
 L.e(40,20,17,19,shade);for(let y=32;y<112;y++){const hw=19+Math.round((y-32)*.12);L.r(40-hw,y,hw*2,1,shade)}
 L.r(4,40+t,12,62,shade);L.r(64,40-t,12,62,shade);
 // the legs into the water, the long oilskin buttoned to the throat
 L.r(28,96,9,24,'#2a2a34');L.r(43,96,9,24,'#22222c');
 for(let y=34;y<102;y++){const hw=16+Math.round((y-34)*.12);L.r(40-hw,y,hw*2,1,c);L.r(40+hw-5,y,5,1,cd)}
 L.r(39,36,2,64,cd);[42,52,62,72,82].forEach(y=>L.r(37,y,2,2,'#c8a040'));L.tex(c,sh(c,-10),9);for(let y=44;y<100;y+=10)L.rm(22,y,36,1,cl);
 // the arms down at his sides, hands open, and the other hands an inch inside them
 L.r(8,40+t,9,56,c);L.r(8,40+t,2,56,cl);L.r(63,40-t,9,56,cd);
 for(const [x,d] of[[8,t],[63,-t]]){L.r(x+1,96+d,8,8,s);[1,3,5,7].forEach((i,k)=>L.r(x+i,103+d,1,4+(k%2)*2,s));L.rm(x+2,97+d,5,6,sh(s,-40))}
 if(ph2){L.r(6,86+t,6,8,'#5a6a64');[0,2,4].forEach(i=>L.r(4+i,94+t,1,8,'#5a6a64'));L.r(70,84-t,6,8,'#5a6a64');[0,2,4].forEach(i=>L.r(72+i,92-t,1,8,'#5a6a64'))}
 // the collar up, the head; in phase 2 the head tilts and the shape comes up out of the collar behind it
 L.r(28,26,24,10,c);L.r(28,26,24,2,cl);L.r(34,28,12,8,sh(s,-28));
 const hx=ph2?44:40,hy=ph2?16:15;
 if(ph2){L.e(34,14,12,13,'#2a3634');L.e(33,13,10,11,'#3a4a46');stare(L,27,10,'#c8d8d0');stare(L,35,10,'#c8d8d0')}
 L.e(hx+1,hy+1,12,13,sh(s,-40));L.e(hx,hy,11,12,s);L.e(hx-4,hy-5,5,4,sh(s,14));
 L.e(hx-1,hy-9,11,5,HAIR);L.r(hx-11,hy-8,3,8,HAIR);L.r(hx+9,hy-8,3,7,sh(HAIR,-20));for(let x=hx-9;x<hx+9;x+=3)L.r(x,hy-7,1,3,sh(HAIR,-24));
 L.e(hx,hy+8,9,4,sh(s,-12));L.tex(sh(s,-12),'#b8b8b8',3);
 stare(L,hx-8,hy-2);stare(L,hx+3,hy-2);
 // rain running into the open eyes and down the face
 L.r(hx-6,hy+2,1,5,'#c8d8e4');L.r(hx+5,hy+2,1,6,'#c8d8e4');
 // the polite mouth
 L.r(hx-3,hy+7,7,1,MR);L.p(hx-4,hy+6,MR);L.p(hx+4,hy+6,MR);
 // the water around his shins: not quite water, breathing
 const wy=104;for(let y=wy;y<116;y++){const k=y-wy;L.r(0,y,80,1,k%3===0?BRINEL:k<3?sh(BRINE,12):BRINE)}
 for(let x=4;x<80;x+=11)L.r(x+(t*2),wy+1,6,1,'#8ab8b0');L.e(40,wy+1,20,2,sh(BRINEL,20))}}
};

// ================= WOUNDED ENEMIES (Art, Townsfolk and monsters, Wounded enemies) =================
// Two steps: at half HP and at a quarter. The bull is a living animal and bleeds, and what runs out with the blood is
// sea water. The coat and the piling are empty or drowned: tears show dark wet nothing and the river pours out. The
// gulls lose feathers, then one of them. The Tenant's coat tears onto something that isn't a man, gray-green and wet,
// and then the water pours out of him and the shape inside shows through.
const WPAD=8,HOLLOW='#0e1412',BLOOD='#6e121c',BLOODW='#a8202c',WATER=[BRINEL,BRINE,'#8ab8b0'];
const grey=(h,k)=>{const n=parseInt(h.slice(1),16),r=n>>16,g=n>>8&255,b=n&255,l=(r*.3+g*.59+b*.11)*.82,f=v=>Math.max(0,Math.min(255,Math.round(v+(l-v)*k-k*18)));
 return'#'+[r,g,b].map(v=>f(v).toString(16).padStart(2,'0')).join('')};
const inBlob=(x,y,cx,cy,rx,ry,sd)=>{const a=(x+.5-cx)/rx,b=(y+.5-cy)/ry,t=Math.atan2(b,a),r=1+.22*Math.sin(5*t+sd)+.12*Math.sin(9*t+sd*2.3);return a*a+b*b<=r*r};
const blob=(L,cx,cy,rx,ry,sd,fn)=>{for(let y=Math.floor(cy-ry*1.4);y<=cy+ry*1.4;y++)for(let x=Math.floor(cx-rx*1.4);x<=cx+rx*1.4;x++)if(inBlob(x,y,cx,cy,rx,ry,sd))fn(x,y)};
const Wk={
 bite(L,cx,cy,rx,ry,sd=1){blob(L,cx,cy,rx,ry,sd,(x,y)=>{if(L.g(x,y))L.p(x,y,null)})},
 gash(L,cx,cy,rx,ry,sd=2,c=HOLLOW){blob(L,cx,cy,rx,ry,sd,(x,y)=>{if(L.g(x,y))L.p(x,y,c)})},
 stain(L,cx,cy,rx,ry,sd=3,c=BLOOD,c2=BLOODW){blob(L,cx,cy,rx,ry,sd,(x,y)=>{if(L.g(x,y))L.p(x,y,c)});blob(L,cx-rx*.15,cy-ry*.2,rx*.5,ry*.5,sd+1,(x,y)=>{if(L.g(x,y))L.p(x,y,c2)})},
 drip(L,x,y,n,c=BLOOD,any){for(let j=0;j<n;j++)for(const i of[0,1])if(any||L.g(x+i,y+j))L.p(x+i,y+j,c);if(any){L.p(x,y+n,c);L.p(x+1,y+n,c)}},
 // the river pouring out of a hole, down to the ground row gy
 pour(L,x,y,w,gy,sd=0,cols=WATER){for(let i=0;i<w;i+=2){const top=y+((i*5+sd)%4),bot=gy-((i*3+sd)%3);for(let yy=top;yy<=bot;yy++){const wob=((yy+i+sd)>>2)%2;L.p(x+i+wob,yy,cols[(i>>1)%cols.length])}}},
 puddle(L,cx,rx,ry=2,cols=WATER){const y=L.h-1;L.e(cx,y,rx,ry,cols[1]);L.e(cx-1,y,rx*.7,ry*.6,cols[0]);for(let i=2;i<rx*2-2;i+=5)L.p(cx-rx+i,y-1,cols[2])},
 // a wet gray-green inside showing through a tear: not meat, not water
 inside(L,cx,cy,rx,ry,sd=2){Wk.gash(L,cx,cy,rx+1,ry+1,sd);blob(L,cx,cy,rx*.75,ry*.8,sd+2,(x,y)=>{if(L.g(x,y))L.p(x,y,(x+y)%4===0?'#8ab8b0':(x*2+y)%5===0?'#2a3634':'#4a6a62')})},
 feathers(L,cx,n,sd=0){for(let i=0;i<n;i++){const x=cx-n*4+i*7+((i*5+sd)%3),y=L.h-6-((i+sd)%3)*3;L.r(x,y,4,2,'#e8e8e8');L.p(x+4,y+1,'#9aa4ac')}},
 dull(L,x0,x1,amt){const d=x1>x0?1:-1;for(let y=0;y<L.h;y++)for(let x=x0;d>0?x<=x1:x>=x1;x+=d){const v=L.g(x,y);if(!v||WATER.includes(v))continue;L.p(x,y,grey(v,amt*Math.min(1,.4+.6*Math.abs(x-x0)/Math.max(1,Math.abs(x1-x0)))))}},
 lean(L,dx,y0,y1){const W=L.W,d=L.d;for(let y=0;y<y1;y++){const s=Math.round(dx*Math.min(1,(y1-y)/Math.max(1,y1-y0)));if(!s)continue;const row=d.slice(y*W,y*W+W);for(let x=0;x<W;x++){const sx=x-s;d[y*W+x]=sx>=0&&sx<W?row[sx]:null}}},
 sag(L,x0,y0,w,h,dy,dx=0){const px=[];for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++){const v=L.g(x,y);if(v){px.push([x,y,v]);L.p(x,y,null)}}px.forEach(([x,y,v])=>L.p(x+dx,y+dy,v))},
 cut(L,x,y,w,h){for(let j=0;j<h;j++)for(let i=0;i<w;i++)L.p(x+i,y+j,null)}
};
const WOUND={
// the bull: a bloody gash on its neck running with sea water, the head sinking; then a torn flank pouring brine onto
// the planks, an eye shut at last, and the head down
bull(L,s){
 Wk.stain(L,66,36,s>1?6:4,s>1?6:4,3);Wk.drip(L,64,40,s>1?14:8,BRINE);
 if(s===1){Wk.dull(L,30,96,.3);Wk.sag(L,62,4,36,30,2)}
 else{Wk.stain(L,40,48,7,5,2);Wk.pour(L,38,52,6,65,1);Wk.puddle(L,42,16);L.r(80,13,5,2,'#5a3a2a');Wk.sag(L,60,0,38,34,6,-2);Wk.dull(L,20,96,.55);Wk.lean(L,-2,10,40)}},
// the coat: a rip across its front onto nothing, dark, dripping; then a sleeve gone, the hem torn away, the river
// running out of it into a puddle, the collar slumped
coat(L,s){
 Wk.gash(L,22,40,s>1?6:4,s>1?9:5,2);Wk.drip(L,20,46,s>1?12:6,BRINE);Wk.bite(L,30,72,s>1?6:3,s>1?3:2,1);
 if(s===1){Wk.dull(L,26,52,.3);Wk.lean(L,2,6,40);Wk.puddle(L,26,8)}
 else{Wk.cut(L,40,16,10,42);Wk.gash(L,40,20,2,4,1);Wk.pour(L,20,50,6,85,2);Wk.sag(L,12,4,28,14,4);Wk.dull(L,20,52,.55);Wk.lean(L,4,6,60);Wk.puddle(L,26,14)}},
// the gulls: feathers torn loose and blood on white; then one gull gone, feathers on the rail, the rest hunched
gull(L,s){
 Wk.stain(L,24,26,3,3,2);Wk.bite(L,50,20,s>1?4:2,s>1?3:2,1);Wk.feathers(L,30,s>1?6:3,1);
 if(s===1){Wk.dull(L,30,66,.3)}
 else{Wk.cut(L,36,0,30,44);Wk.stain(L,36,38,4,3,3);Wk.feathers(L,48,5,2);Wk.sag(L,0,0,36,30,3);Wk.dull(L,10,66,.55)}},
// the piling: the net tears and dark water pours from under it; then an arm gone, the head caved, a puddle
piling(L,s){
 Wk.gash(L,24,48,s>1?6:4,s>1?9:6,2);Wk.pour(L,22,54,s>1?6:3,89,1);Wk.bite(L,34,10,s>1?5:3,s>1?5:3,2);
 if(s===1){Wk.dull(L,26,56,.3);Wk.lean(L,2,6,40);Wk.puddle(L,28,10)}
 else{Wk.cut(L,40,26,16,44);Wk.pour(L,40,30,4,89,2);Wk.sag(L,0,0,56,26,3,1);Wk.dull(L,20,56,.55);Wk.lean(L,4,6,60);Wk.puddle(L,28,16)}},
// the Tenant: the coat tears onto the gray-green wet inside, a cheek split dark; then the coat's half gone, a shoulder
// sagged, the water pouring out of him and the shape behind him showing through the holes
tenant(L,s,f,ph2){
 Wk.inside(L,30,60,s>1?6:4,s>1?9:6,2);Wk.inside(L,52,74,s>1?5:3,s>1?7:5,3);Wk.gash(L,ph2?48:44,ph2?22:21,2,2,1,'#2a3634');
 if(s===1){Wk.dull(L,40,80,.3);Wk.lean(L,2,10,40);Wk.drip(L,30,66,8,BRINE)}
 else{Wk.cut(L,63,40,10,56);Wk.inside(L,62,46,3,5,2);Wk.inside(L,38,48,5,6,4);Wk.sag(L,8,40,10,56,6);
  Wk.dull(L,36,80,.55);Wk.lean(L,4,10,60);Wk.pour(L,28,66,8,104,1);Wk.pour(L,48,80,6,104,3)}}
};

// ================= THE BOSS'S PORTRAIT (it talks) =================
// Teague's own face, worn: gray stubble, wet gray hair, the oilskin's collar up. The eyes stare a little too wide and
// the rain runs into them; the mouth is polite. Behind his head, a shade darker and a little bigger, another head.
function portraitLayer(open){const L=Ly(64,64),s=SKIN,u=OIL;
 L.e(36,30,18,20,'#1c2422');
 L.e(34,66,24,15,sh(u,-34));L.e(30,65,22,14,u);L.r(18,46,8,18,sh(u,-26));L.r(38,46,8,18,sh(u,-26));L.r(26,48,12,16,'#5a5a64');L.r(27,44,10,6,sh(s,-28));
 L.e(17,33,3,4,s);L.e(47,33,3,4,sh(s,-30));
 L.e(33,34,15,15,sh(s,-46));L.e(33,33,15,14,sh(s,-26));L.e(31,32,14,14,s);L.e(27,28,6,5,sh(s,14));
 L.e(31,19,14,5,HAIR);L.r(17,20,3,10,HAIR);L.r(44,20,3,9,sh(HAIR,-20));for(let x=20;x<44;x+=3)L.r(x,22,1,3,sh(HAIR,-24));
 L.e(32,43,12,6,sh(s,-12));L.tex(sh(s,-12),'#b8b8b8',3);
 for(const x of[20,37]){L.r(x,27,7,6,W);L.r(x+2,28,3,3,'#9aa8b4');L.p(x+3,29,D);L.r(x,25,7,1,D)}
 L.r(22,33,1,7,'#c8d8e4');L.r(41,33,1,8,'#c8d8e4');L.p(32,36,sh(s,-40));L.p(33,37,sh(s,-40));
 if(open){L.r(28,41,8,4,MR);L.r(29,42,6,1,'#0e1412');L.r(29,43,6,1,BRINE)}else{L.r(28,42,8,1,MR);L.p(27,41,MR);L.p(36,41,MR)}
 for(let i=0;i<6;i++){const x=12+((i*17)%40),y=10+((i*11)%22);if(L.g(x,y))L.p(x,y,'#d8e8f4')}
 return L}
const pc={};
function portrait(ctx,open){const k=open?1:0;if(!pc[k]){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');
  const gr=x.createRadialGradient(22,18,4,32,32,46);gr.addColorStop(0,'#3a4a4a');gr.addColorStop(1,'#16201e');x.fillStyle=gr;x.fillRect(0,0,64,64);blit(x,portraitLayer(k));pc[k]=c}
 ctx.clearRect(0,0,64,64);ctx.drawImage(pc[k],0,0)}

// ================= BATTLE BACKDROPS (Combat, Basics, Backgrounds) =================
// Head-on at battle scale, one per kind of place the case fights in: the waterfront ('town': the river, the far bridge,
// the pilings and the faded cannery, in February rain), a room ('loft' and the other interiors: varnished boards, a
// rain-streaked window, the study wall's string) and the retort room ('cannery': the big round steel doors, pipes, a
// hanging lamp and the flooded floor). Lit for day or night; low SAN shrinks the lights like on the map, and battle.js
// lays the sour over it.
const BDC={};
const PLACE={town:'town',cannery:'cannery',loft:'room',snag:'room',post:'room',halvorsen:'room'};
function backdrop(place,o){const f=BDRAW[PLACE[place]];if(!f)return null;const key=[place,o.light,o.low?1:0,o.w,o.h,o.feet].join('|');if(BDC[key])return BDC[key];
 const c=document.createElement('canvas');c.width=o.w;c.height=o.h;const g=c.getContext('2d');
 const hz=Math.round(Math.max(30,Math.min(o.feet-12,o.h*.44)));
 f(bdKit(g),o.w,o.h,hz,o,place);BDC[key]=c;return c}
function bdKit(g){const R=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))};
 const K={g,R,
  hash:(a,b=0)=>{let n=Math.imul(a|0,374761393)+Math.imul(b|0,668265263);n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967296},
  bands(y0,y1,cols,W){const n=cols.length,hh=(y1-y0)/n;for(let i=0;i<n;i++){const a=Math.round(y0+i*hh),b=Math.round(y0+(i+1)*hh);R(0,a,W,b-a,cols[i]);
   if(i<n-1)for(let x=0;x<W;x++){if((x&1)===0)R(x,b-1,1,1,cols[i+1]);if((x&3)===1)R(x,b-2,1,1,cols[i+1])}}},
  ell(cx,cy,rx,ry,c){for(let y=-Math.ceil(ry);y<=Math.ceil(ry);y++){const q=1-(y/ry)**2;if(q<0)continue;const hw=rx*Math.sqrt(q);R(cx-hw,cy+y,hw*2,1,c)}},
  line(x0,y0,x1,y1,c,w=1){const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);for(let i=0;i<=n;i++)R(x0+(x1-x0)*i/n,y0+(y1-y0)*i/n,w,w,c)},
  pool(cx,cy,rx,ry,c,a,steps=4){g.globalCompositeOperation='lighter';g.globalAlpha=a/steps;for(let i=0;i<steps;i++){const k=1-i/steps;K.ell(cx,cy,rx*k,ry*k,c)}g.globalAlpha=1;g.globalCompositeOperation='source-over'},
  // slanted rain over everything (still, for a backdrop)
  rain(W,H,n,c){for(let i=0;i<n;i++){const x=K.hash(i,61)*W|0,y=K.hash(i,62)*H|0,l=3+(i%4);for(let k=0;k<l;k++)R(x-k*.3,y+k,1,1,c)}},
  // 3 × 5 capitals for painted signs (made-up names only)
  text(s,x,y,c){const F={A:'010101111101101',B:'110101110101110',C:'111100100100111',D:'110101101101110',E:'111100110100111',G:'111100101101111',H:'101101111101101',I:'111010010010111',K:'101101110101101',L:'100100100100111',N:'101111111111101',O:'111101101101111',P:'110101110100100',R:'110101110101101',S:'111100111001111',T:'111010010010010',Y:'101101010010010'};
   [...s].forEach((ch,i)=>{const b=F[ch];if(b)for(let j=0;j<15;j++)if(b[j]==='1')R(x+i*4+j%3,y+(j/3|0),1,1,c)})}};
 return K}
const BDRAW={
// the waterfront: a February sky, the river wide and gray, the long bridge far off, pilings, the faded cannery front on
// the right, and the wet boardwalk the fighters stand on
town(K,W,H,hz,o){const R=K.R,nt=o.light==='night',low=o.low,base=hz-4;
 K.bands(0,base-22,nt?['#080c16','#0c121e','#121a26','#1a2230']:['#6a7684','#7a8694','#8a96a2','#98a2aa'],W);
 // the river under the sky, and the bridge far out on it, its lights at night
 K.bands(base-22,base,nt?['#141e22','#18242a','#1c2a2e']:['#5a6a68','#4e5e5c','#46544f'],W);
 const by=base-30;K.line(0,by+4,W,by-2,nt?'#2a3038':'#7a848c',2);for(let x=8;x<W;x+=16){K.line(x,by+4-x*6/W,x+8,by-8-x*6/W,nt?'#2a3038':'#7a848c');K.line(x+8,by-8-x*6/W,x+16,by+4-(x+16)*6/W,nt?'#2a3038':'#7a848c');R(x,by+4-x*6/W,1,8,nt?'#2a3038':'#7a848c')}
 if(nt)for(let x=4;x<W;x+=12){R(x,by-1-x*6/W,1,1,x%24?'#ffd27a':'#ff6a5a');R(x,base-14+((x*7)%9),2,1,'rgba(255,200,120,.5)')}
 for(let i=0;i<30;i++){const x=K.hash(i,71)*W|0,y=base-20+(K.hash(i,72)*18|0);R(x,y,4+(i%5),1,nt?'#24343a':'#6a7a78')}
 // the cannery front on the right: faded red boards, its sign, a loading door
 const cx0=Math.round(W*.66),ct=Math.max(4,base-84),cr=nt?'#3a1e1a':'#8a4436';
 R(cx0,ct,W-cx0,base-ct,cr);for(let x=cx0+3;x<W;x+=5)R(x,ct,1,base-ct,sh(cr,-18));for(let k=0;k<16;k++)R(cx0-6+k,ct-k*.4,W-cx0+12-k*2,1,nt?'#241210':'#5a2a22');
 R(cx0+8,ct+8,64,10,nt?'#2a1612':'#d8c8b0');K.text('BAY PACKING',cx0+12,ct+11,nt?'#5a3a30':'#6a2a22');
 R(cx0+16,base-40,40,40,nt?'#140c0a':'#3a221c');for(let y=base-38;y<base;y+=4)R(cx0+16,y,40,1,nt?'#1e1410':'#4a2e26');
 if(nt){R(cx0+70,ct+26,8,8,'#e7b65a');K.pool(cx0+74,ct+30,10,10,'#e7b65a',.25,3)}
 // pilings standing out of the river on the left, gulls on two of them
 for(let i=0;i<5;i++){const x=10+i*28,t=base-26-((i*7)%10);R(x,t,6,base-t+2,nt?'#2a2420':'#5a4a3a');R(x,t,6,2,nt?'#3a3430':'#7a6a5a');if(i%2){R(x-1,t-4,8,4,nt?'#8a9098':'#e8e8e8');R(x-3,t-3,3,1,'#e8c040')}}
 // a lamp post at the boardwalk's edge, lit at night
 const lx=Math.round(W*.5),lt=Math.max(6,base-70);R(lx-1,lt,3,base-lt,nt?'#14121a':'#3a3a44');R(lx-4,lt,9,4,nt?'#14121a':'#3a3a44');R(lx-3,lt+4,7,3,nt?'#ffcf80':'#d8d4cc');
 if(nt){const k=low?.7:1;K.pool(lx,lt+8,24*k,24*k,'#ffcf80',.4,4);K.pool(lx,base+6,44*k,10*k,'#ffcf80',.28,4)}
 // the wet boardwalk: planks running across, puddles holding the sky
 R(0,hz-1,W,2,nt?'#3a3430':'#8a7a68');K.bands(hz+1,H,nt?['#241e1c','#2a2320','#2e2622']:['#6a5a48','#62523f','#5a4a38'],W);
 for(let y=hz+6;y<H;y+=7)R(0,y,W,1,nt?'#1a1614':'#4a3c2e');for(let y=hz+6,i=0;y<H;y+=7,i++)for(let x=(i*29)%40;x<W;x+=40)R(x,y,1,7,nt?'#1a1614':'#4a3c2e');
 for(let i=0;i<8;i++){const x=K.hash(i,81)*W|0,y=hz+8+(K.hash(i,82)*(H-hz-14)|0);K.ell(x,y,10+(i%3)*4,2,nt?'#2e3a40':'#8a96a2')}
 if(nt){const k=low?.65:1;K.pool(W/2,H+4,110*k,(H-hz)*.65*k,'#ffcf80',.2,5)}
 K.rain(W,H,90,nt?'rgba(160,180,200,.35)':'rgba(220,232,244,.45)')},
// a room: varnished boards, a window streaked with rain, the study wall's pinned pages and red string, a hanging bulb
room(K,W,H,hz,o,place){const R=K.R,nt=o.light==='night',low=o.low,base=hz-2;
 R(0,0,W,base,'#4a2e1e');for(let x=6;x<W;x+=22){R(x,0,1,base,'#2e1c12');R(x+1,0,1,base,'#6a4430')}
 R(0,base-20,W,2,'#6a4430');R(0,base-18,W,1,'#2e1c12');
 // the window, rain running down it, the river and its lights beyond
 const wx=Math.round(W*.62),wy=Math.max(6,base-92),ww=64,wh=50;R(wx-4,wy-4,ww+8,wh+8,'#2e1c12');R(wx,wy,ww,wh,nt?'#141a26':'#7a8a9a');R(wx,wy+wh*.6,ww,wh*.4,nt?'#1a2430':'#5a6a6a');
 if(nt)for(let i=0;i<7;i++)R(wx+4+i*9,wy+wh*.56,2,1,i%2?'#fff2c8':'#ff9a5a');R(wx+ww/2-1,wy,2,wh,'#2e1c12');R(wx,wy+wh/2,ww,2,'#2e1c12');
 for(let i=0;i<14;i++){const x=wx+2+((i*11)%(ww-4)),y=wy+((i*23)%(wh-6));R(x,y,1,5,'rgba(220,235,250,.5)')}
 // the study wall (the loft) or a shelf and a calendar (the other rooms)
 if(place==='loft'){const sx=8,sy=Math.max(6,base-88);R(sx,sy,96,56,'#3a2418');
  for(let i=0;i<16;i++){const px=sx+4+(i%6)*15,py=sy+4+(i/6|0)*17;R(px,py,11,13,i%5===0?'#c8c0a8':'#e8dcc0');R(px+2,py+3,7,1,'#6a5a4a');R(px+2,py+6,6,1,'#6a5a4a');R(px+4,py-1,2,2,'#c8402e')}
  for(let i=0;i<7;i++){const a=i,b=(i*5+3)%16;K.line(sx+9+(a%6)*15,sy+5+(a/6|0)*17,sx+9+(b%6)*15,sy+5+(b/6|0)*17,'#c8402e')}}
 else{R(10,base-60,60,4,'#2e1c12');for(let i=0;i<8;i++)R(12+i*7,base-72,5,12,['#8a3a2a','#3a5a6a','#c8a040','#5a6a3a'][i%4]);R(84,base-80,22,28,'#e8e4d8');R(84,base-80,22,6,'#c8402e')}
 // the bulb on its cord, and its light
 const bx=Math.round(W*.42);R(bx,0,1,Math.max(6,base-80),'#1a1410');R(bx-3,Math.max(6,base-80),7,6,nt?'#ffe8a8':'#e8e0c8');
 const k=low?.65:1;K.pool(bx,Math.max(6,base-74),40*k,40*k,'#ffcf80',nt?.36:.2,4);
 // the floor: worn planks
 R(0,hz-1,W,2,'#2e1c12');K.bands(hz+1,H,['#4a3020','#442c1c','#3e2818'],W);for(let y=hz+6;y<H;y+=7)R(0,y,W,1,'#2e1c12');for(let y=hz+6,i=0;y<H;y+=7,i++)for(let x=(i*31)%44;x<W;x+=44)R(x,y,1,7,'#2e1c12');
 K.pool(W/2,H+4,100*k,(H-hz)*.6*k,'#ffcf80',.16,4)},
// the retort room: the big round steel doors of the retorts in a row, pipes and gauges, chains from the ceiling, one
// hanging lamp, and the floor under black water that moves like it's breathing
cannery(K,W,H,hz,o){const R=K.R,low=o.low,base=hz-2;
 K.bands(0,base,['#0e1214','#121618','#161a1c','#1a1e20'],W);
 for(let x=0;x<W;x+=30){R(x,0,2,base,'#22282a')}for(let y=10;y<base;y+=26)R(0,y,W,2,'#1e2426');
 // the retorts: round steel doors, bolted, one hanging open on the dark
 for(let i=0;i<3;i++){const cx=Math.round(W*(.2+i*.3)),cy=Math.max(26,base-44),r=24;
  K.ell(cx,cy,r+3,r+3,'#2a3032');K.ell(cx,cy,r,r,i===1?'#060808':'#4a5254');if(i!==1){K.ell(cx-4,cy-4,r*.6,r*.6,'#5a6466');for(let k=0;k<10;k++){const a=k/10*Math.PI*2;R(cx+Math.cos(a)*(r-3)-1,cy+Math.sin(a)*(r-3)-1,3,3,'#7a8486')}R(cx+r-2,cy-3,8,6,'#3a4244')}
  else{K.ell(cx+r+8,cy,6,r,'#3e4648');K.ell(cx,cy,r-6,r-6,'#020404')}}
 // pipes along the top and a gauge, chains, the lamp
 R(0,8,W,5,'#3a4244');R(0,8,W,1,'#5a6466');R(0,16,W,3,'#2e3436');for(let x=12;x<W;x+=48){K.ell(x,22,5,5,'#c8c0a8');R(x,21,4,1,'#c8402e')}
 for(let x=40;x<W;x+=70)for(let y=0;y<Math.min(base-20,60);y+=4){R(x,y,2,3,'#4a4a4a')}
 const lx=Math.round(W*.5);R(lx,0,1,24,'#2a2a2a');R(lx-6,24,13,5,'#3a4244');R(lx-4,29,9,2,'#ffe8b0');
 const k=low?.6:1;K.pool(lx,40,60*k,60*k,'#e8dcc0',.22,5);
 // the flooded floor: black water with the lamp broken in it, breathing
 R(0,hz-1,W,2,'#2a3a3a');K.bands(hz+1,H,['#0e1a1a','#122020','#162626'],W);
 for(let i=0;i<40;i++){const x=K.hash(i,91)*W|0,y=hz+3+(K.hash(i,92)*(H-hz-4)|0);R(x,y,6+(i%7),1,i%3?'#1e3030':'#2e4a46')}
 for(let i=0;i<6;i++){const y=hz+5+i*5;R(lx-10-i*3+(i%2)*4,y,20+i*2,1,'rgba(232,220,192,.25)')}
 K.ell(W/2,hz+(H-hz)*.45,W*.42,(H-hz)*.22,'rgba(90,138,128,.10)')}
};

const SZ=k=>{const A=B[k==='tenant2'?'tenant':k];return A?[A.w,A.h]:[16,16]};
const cache=new Map();
// step: 0 unhurt, 1 at half HP, 2 at a quarter. A wounded sprite is 8 px wider each side so a lean or a spill isn't cut
// off; drawn centred, so it stays put, and the same height, so the feet stay on the ground.
function sprite(k,frame,step){step=step|0;const ph2=k==='tenant2',base=ph2?'tenant':k,key=k+(frame?1:0)+':'+step;let c=cache.get(key);if(c)return c;const A=B[base];if(!A)return null;
 const L=Ly(A.w,A.h,step?WPAD:0);A.f(L,frame?1:0,ph2);if(step){Wk.cut(L,-WPAD,0,WPAD,A.h);Wk.cut(L,A.w,0,WPAD,A.h);if(WOUND[base])WOUND[base](L,step,frame?1:0,ph2)}
 c=document.createElement('canvas');c.width=L.W;c.height=A.h;blit(c.getContext('2d'),L);cache.set(key,c);return c}
return{B,sprite,size:SZ,portrait,backdrop};
})();
