// Black Lantern · mockup 023 · bigger agents in battle: battle backs at 48 × 60 (rough v1, Nov 23, 2026).
// Reference drawing code for the Developer (spec 023). Drawn fresh at the new size, never scaled up from the 34 × 44 set.
// Same finish as the enemies: 1 px pixels, one light from the upper left, a four-tone ramp on every rounded part
// (light, base, shade, deep), a light rim on the lit edge, and a selective outline (dark on the shadow side and the
// bottom, a deep tone of the part's own color on the lit side).
// Needs window.BL (SKIN, HAIRC, OUTC, profOf, PROFS) like agent-back.js. Exposes window.BLB2 with the same shape as BLB:
//   BLB2.back(agent, o) -> canvas (W × H); o: {lantern, downed}. AX, AY: where the body's centre and waist sit in it.
const BLB2=(()=>{
const {SKIN,HAIRC,OUTC,profOf,PROFS}=window.BL;
const OL='#120c1c', W=48, H=60, T0=9, ML=11, MR=3;   // T0: headroom for hats, buns and crests; ML: room for the lantern
const sh=(h,a)=>{const n=parseInt(h.slice(1),16),f=v=>Math.max(0,Math.min(255,Math.round(v+a)));return'#'+[n>>16,n>>8&255,n&255].map(v=>f(v).toString(16).padStart(2,'0')).join('')};
const grey=h=>{const n=parseInt(h.slice(1),16),v=Math.round(((n>>16)*.3+(n>>8&255)*.5+(n&255)*.2)*.62);return'#'+[v,v,v+14].map(x=>Math.min(255,x).toString(16).padStart(2,'0')).join('')};
const LD=(()=>{const v=[-.55,-.62,.56],m=Math.hypot(...v);return v.map(x=>x/m)})();
// the four-tone ramp; l is how much a pixel faces the light
const tone=(c,l)=>l>.8?sh(c,30):l>.42?c:l>.08?sh(c,-26):sh(c,-50);
function Grid(){const n=(W+ML+MR)*(H+T0),C=new Array(n).fill(null),Lt=new Array(n).fill(null);
 const ix=(x,y)=>{x=Math.round(x)+ML;y=Math.round(y)+T0;return(x<0||y<0||x>=W+ML+MR||y>=H+T0)?-1:y*(W+ML+MR)+x};
 const G={C,Lt,ix,
  get:(x,y)=>{const i=ix(x,y);return i<0?null:C[i]},
  // a fixed-color pixel (seams, buttons, stitching)
  p(x,y,c){const i=ix(x,y);if(i>=0){C[i]=c;Lt[i]=null}},
  r(x,y,w,h,c){for(let j=0;j<h;j++)for(let k=0;k<w;k++)G.p(x+k,y+j,c)},
  // a rounded part, shaded as a dome
  e(cx,cy,rx,ry,c,o={}){const lb=o.lb||0;for(let y=Math.floor(cy-ry);y<=cy+ry;y++)for(let x=Math.floor(cx-rx);x<=cx+rx;x++){
   const nx=(x+.5-cx)/rx,ny=(y+.5-cy)/ry,d=nx*nx+ny*ny;if(d>1)continue;if(o.clip&&!o.clip(x,y))continue;const nz=Math.sqrt(1-d);
   const i=ix(x,y);if(i<0)continue;C[i]=c;Lt[i]=nx*LD[0]+ny*LD[1]+nz*LD[2]+lb}},
  // a cylinder standing up (arms, the torso below the shoulders), round across, a little lighter at the top
  cyl(x0,y0,w,h,c,o={}){const lb=o.lb||0;for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++){if(o.clip&&!o.clip(x,y))continue;
   const nx=((x+.5-x0)/w)*2-1,nz=Math.sqrt(Math.max(0,1-nx*nx)),ny=-.35+.5*((y-y0)/h);
   const i=ix(x,y);if(i<0)continue;C[i]=c;Lt[i]=nx*LD[0]+ny*LD[1]+nz*LD[2]+lb}},
  // re-shade what's already there by a part's own shape (keeps the color, changes the light)
  dim(x,y,a){const i=ix(x,y);if(i>=0&&Lt[i]!=null)Lt[i]+=a}};
 return G}
// final pass: quantize to the ramp, then the rim on the lit edge and the selective outline
function finish(G,downed){const w=W+ML+MR,h=H+T0,out=new Array(w*h).fill(null);
 for(let i=0;i<out.length;i++)if(G.C[i])out[i]=G.Lt[i]==null?G.C[i]:tone(G.C[i],G.Lt[i]);
 const at=(x,y)=>(x<0||y<0||x>=w||y>=h)?null:out[y*w+x],o2=out.slice();
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x,v=out[i];
  if(v){if(!at(x-1,y)||!at(x,y-1))o2[i]=sh(v,36)}                        // rim of light, upper-left edges
  else{const r=at(x+1,y),d=at(x,y+1),l=at(x-1,y),u=at(x,y-1);
   if(l||u)o2[i]=OL;                                                     // shadow side: dark outline
   else if(r||d)o2[i]=sh(r||d,-70)}}                                     // lit side: a deep tone of its own color
 if(downed)for(let i=0;i<o2.length;i++)if(o2[i])o2[i]=grey(o2[i]);
 return o2}
function outfitColor(a,p){const L=a.look||{};if(L.outfitC>=0)return OUTC[L.outfitC];return OUTC[p.color]||OUTC[0]}
// a tiny 3 × 5 number for the hockey jersey
const DIG=['111101101101111','010110010010111','111001111100111','111001111001111','101101111001001','111100111001111','111100111101111','111001010010010','111101111101111','111101111001111'];
function num(G,s,x,y,c){[...s].forEach((d,k)=>{const b=DIG[+d];for(let j=0;j<5;j++)for(let i=0;i<3;i++)if(b[j*3+i]==='1')G.p(x+k*4+i,y+j,c)})}
const hash=s=>{let h=7;for(const ch of String(s))h=(h*31+ch.charCodeAt(0))>>>0;return h};

const cache=new Map();
function back(a,o={}){
 const L0=a.look||{},k=JSON.stringify([a.prof,a.name,L0,!!o.lantern,!!o.downed]);let cv=cache.get(k);if(cv)return cv;
 const p=profOf(a)||PROFS[0],id=p.id,sk=SKIN[L0.skin|0]||SKIN[1],hc=HAIRC[L0.hairC|0]||HAIRC[0],oc=outfitColor(a,p);
 const hair=L0.hair|0,n=L0.build==='slim'?4:0,dn=o.downed?3:0,G=Grid();
 const top=id==='scientist'?'#e4e4ea':id==='exterminator'?'#3b5b8a':id==='funeral'?'#1b1a22':id==='bodyguard'?'#232326':oc;
 const bareArms=id==='bruiser', armC=bareArms?sk:top;
 // ---- body: arms, then the torso and shoulders (the slim build brings shoulders, arms and waist in 4 px a side)
 const lx=1+n, rx=40-n;
 if(!o.lantern||o.downed)G.cyl(lx,33,8,27,armC,{lb:.05});
 G.cyl(rx,33,8,27,armC,{lb:-.05});
 G.e(24,41,19-n,12,top);G.cyl(6+n,40,36-2*n,20,top);
 // the fold where each arm meets the body
 for(let y=38;y<60;y++){G.p(lx+8,y,sh(top,-44));G.p(rx-1,y,sh(top,-58))}
 if(bareArms){for(let y=33;y<60;y++){G.p(lx+8,y,sh(top,-50));G.p(rx-1,y,sh(top,-60))}
  G.r(lx+1,33,7,3,sh(top,-16));G.r(rx,33,7,3,sh(top,-30))}                 // the tank top's armholes
 // ---- outfit backs: what each of the 18 shows from behind
 const dk=sh(top,-48),lt=sh(top,26);
 const vent=(y0)=>{for(let y=y0;y<60;y++)G.p(24,y,dk);G.p(25,y0,lt)};
 const collar=(c)=>{G.e(24,31,8.5,3,c);G.r(16,31,17,2,sh(c,-28))};
 const strap=(x,c)=>{for(let y=30;y<60;y++){G.p(x,y,sh(c,14));G.p(x+1,y,c);G.p(x+2,y,sh(c,-34))}};
 if(id==='shooter'){                                                          // plate carrier, webbing rows, drag handle
  const v='#2b2e2a';G.cyl(11+n,31,26-2*n,29,v);for(let y=40;y<58;y+=4)for(let x=13+n;x<35-n;x++)if((x-n)%6<4)G.p(x,y,sh(v,-22));
  G.r(20,30,9,2,'#141614');G.r(21,29,7,1,'#3a3e38');strap(9+n,'#1d1d1f');strap(36-n,'#1d1d1f')}
 else if(id==='medic'){collar(sh(top,-10));                                    // scrubs and a stethoscope round the neck
  for(let x=15;x<34;x++)G.p(x,32+Math.round(Math.abs(x-24)*-.12+1),'#2a2a30');G.r(14,33,2,5,'#2a2a30');G.r(33,33,2,5,'#2a2a30')}
 else if(id==='investigator'){collar('#ece8de');vent(44);G.r(10+n,46,1,10,dk)} // suit jacket: shirt collar, back vent
 else if(id==='clerk'){collar(sh(top,-14));for(let x=7+n;x<42-n;x++)if(x%2)for(let y=55;y<60;y++)G.p(x,y,sh(top,-30)); // cardigan rib, lanyard
  for(let x=17;x<32;x++)G.p(x,30,'#b5532e')}
 else if(id==='hacker'||id==='bruiser'){G.e(24,31,12,4.5,sh(top,-14));G.e(24,30,8,2.5,sh(top,-40));          // the hood, bunched
  if(id==='bruiser')G.r(17,36,15,1,sh(top,-30))}
 else if(id==='talker'){collar('#ece8de');vent(46);                                                           // suit and a scarf
  const sc='#b5532e';G.e(24,30,10,3,sc);G.cyl(13,30,6,18,sc,{lb:.1});for(let x=13;x<19;x+=2)G.p(x,48,sh(sc,-30))}
 else if(id==='bodyguard'){collar('#f4f4f4');vent(46)}
 else if(id==='cmedic'){collar(sh(top,-12));const pk='#3e4a30';G.cyl(15,34,19,20,pk);G.r(16,33,17,2,sh(pk,-20)); // medic pack
  G.r(21,40,7,7,'#ece8de');G.r(23,41,3,5,'#c0392b');G.r(22,42,5,3,'#c0392b');strap(12+n,'#2a3020');strap(35-n,'#2a3020')}
 else if(id==='occultist'){const sw='#4b3460';                                                                  // fringed shawl, point down the back
  for(let y=29;y<57;y++){const hw=Math.round((57-y)*.72);G.cyl(24-hw,y,2*hw+1,1,sw)}
  for(let y=30;y<57;y+=2){const hw=Math.round((57-y)*.72);G.p(24-hw-1,y+1,'#d6a43a');G.p(24+hw+1,y+1,'#8a6a2a')}G.p(24,57,'#d6a43a');G.p(24,58,'#d6a43a')}
 else if(id==='scientist'){G.e(24,31,9,3,'#4f87a3');vent(50);G.r(13+n,49,23-2*n,3,sh(top,-26));G.p(16+n,50,'#9a9aa8');G.p(32-n,50,'#9a9aa8')} // lab coat, half-belt
 else if(id==='tracker'){collar(sh(top,-16));const rp='#a8884e';                                                // rope coil on the shoulder
  for(let t=0;t<40;t++){const an=t/40*Math.PI*2;G.p(Math.round(13+6*Math.cos(an)),Math.round(38+9*Math.sin(an)),t%5?rp:sh(rp,-40));G.p(Math.round(13+4.5*Math.cos(an)),Math.round(38+7*Math.sin(an)),sh(rp,-24))}
  strap(33-n,'#5a3e2b')}
 else if(id==='exterminator'){strap(12+n,top);strap(35-n,top);const tk='#9aa3a8';                              // tank sprayer
  G.cyl(16,31,16,26,tk);G.e(24,31,8,3,tk);G.r(21,27,6,3,'#5a6064');G.r(16,44,16,1,'#5a6064');
  for(let y=33;y<52;y++)G.p(34+Math.round(Math.sin(y/3)*1.5),y,'#2a2a2a');G.r(19,36,10,5,'#d6a43a');G.r(20,37,8,3,'#1d1d1f')}
 else if(id==='funeral'){G.e(24,31,9,3.2,'#3a3848');G.r(17,31,15,1,'#ece8de');vent(42);G.r(23,42,3,1,'#3a3848')} // mourning coat, velvet collar
 else if(id==='reporter'){collar(sh(top,-14));const bs='#7a5a32';                                              // bag strap across the back
  for(let y=30;y<60;y++){const x=Math.round(39-n-(y-30)*1.05);G.p(x,y,sh(bs,18));G.p(x+1,y,bs);G.p(x+2,y,sh(bs,-36))}G.r(25,43,4,3,'#d6a43a')}
 else if(id==='therapist'){collar(sh(top,-14));const ep='#6b4a32';G.e(lx+4,50,3,4,ep);G.e(rx+4,50,3,4,ep,{lb:-.1}); // elbow patches
  for(let x=7+n;x<42-n;x++)if(x%2)G.p(x,58,sh(top,-30))}
 else if(id==='hockey'){const st='#ece8de';                                                                     // jersey: yoke, arm stripes, number
  G.e(24,34,15-n,5,sh(top,-8));for(const y of[47,48,52]){G.r(lx,y,8,1,st);G.r(rx,y,8,1,sh(st,-30))}
  const nm=String(10+hash(a.name||'x')%89);num(G,nm,24-nm.length*2,40,st)}
 else if(id==='ranger'){collar(sh(top,-16));G.e(lx+4,37,3,3,'#d6a43a');G.e(rx+4,37,3,3,'#a8862a')}              // shoulder patches
 else collar(sh(top,-14));
 // ---- neck, ears and head (from behind it's mostly hair); a Downed agent's head sinks 3 px
 const hy=dn;
 G.cyl(19,22+hy,10,8,sk,{lb:-.2});
 G.e(12.5,16+hy,2.5,3.5,sk,{lb:.1});G.e(35.5,16+hy,2.5,3.5,sk,{lb:-.2});
 G.e(24,13+hy,11.5,12,sk);G.e(24,18+hy,9.5,6,sk,{lb:-.1});
 const inE=(cx,cy,rx,ry)=>(x,y)=>{const u=(x+.5-cx)/rx,v=(y+.5-cy)/ry;return u*u+v*v<=1};
 const strands=(x0,x1,y0,y1,c)=>{for(let x=x0;x<x1;x+=4)for(let y=y0+((x*5)%7);y<y1;y++)if(G.get(x,y)===c&&((y*3+x)%7)>1)G.dim(x,y,-.3)};
 if(hair===0){G.e(24,12+hy,12,11.5,hc);G.e(24,17+hy,11,6.5,hc,{lb:-.05});strands(15,34,6+hy,23+hy,hc);         // short: tapered nape
  G.p(22,24+hy,hc);G.p(26,24+hy,hc)}
 else if(hair===1){G.e(24,12+hy,12.5,12,hc);G.cyl(12,14+hy,25,22,hc,{lb:.1});                                    // long, over the shoulders
  for(let x=12;x<37;x++){const j=(x*7)%4;for(let y=36+hy;y<38+hy+j;y++)G.e(x,y,.6,.6,hc)}strands(14,36,8+hy,39+hy,hc)}
 else if(hair===2){G.e(24,12+hy,11.5,11.5,sh(hc,10));                                                             // buzz: skin through the stubble
  for(let y=2;y<24;y++)for(let x=12;x<37;x++)if(((x*7+y*13)^(x*y))%6===0&&G.get(x,y+hy)===sh(hc,10))G.p(x,y+hy,sh(sk,-6))}
 else if(hair===3){G.r(17,4+hy,3,1,sh(sk,50));G.r(16,5+hy,2,2,sh(sk,40))}                                          // bald: a shine
 else if(hair===4){G.e(24,12+hy,12,11.5,hc);G.e(24,17+hy,10.5,6,hc);G.e(24,0+hy,5.5,5,hc,{lb:.1});              // bun and its tie
  G.r(20,4+hy,9,1,'#b5532e');for(let x=14;x<35;x+=2)G.dim(x,8+hy+Math.abs(x-24)/3|0,-.3)}
 else if(hair===5){for(let y=2;y<24;y++)for(let x=12;x<37;x++)if(((x*7+y*13)^(x*y))%4===0&&inE(24,13,11.5,12)(x,y)&&G.get(x,y+hy)===sk)G.p(x,y+hy,sh(hc,-20)); // mohawk crest
  G.e(24,10+hy,4.5,13,hc,{lb:.15});for(const [x,y] of[[22,-4],[25,-6],[23,-2],[26,-3]])G.e(x,y+hy,1.5,2.5,hc,{lb:.2})}
 else{for(const [x,y,r] of[[15,8,5],[21,3,5],[28,3,5],[33,8,5],[13,15,4.5],[35,15,4.5],[18,11,5],[30,11,5],[24,9,5],[16,20,4],[32,20,4],[24,17,5]]) // curly: each curl is round
  G.e(x,y+hy,r,r,hc,{lb:.05})}
 // ---- over the head: the ranger's campaign hat, the hacker's headphones, the bodyguard's earpiece
 if(id==='ranger'){const hat='#7a6440';G.e(24,5+hy,17,3.5,hat,{lb:.1});G.e(24,-1+hy,8,6.5,hat,{lb:.15});G.r(16,3+hy,17,2,'#3a2a1a');
  G.p(24,-7+hy,sh(hat,-40));G.p(24,-6+hy,sh(hat,-40))}
 if(id==='hacker'){for(let t=0;t<=48;t++){const an=Math.PI+t/48*Math.PI,x=Math.round(24+12.5*Math.cos(an)),y=Math.round(13+hy+13.5*Math.sin(an));G.p(x,y,'#26262c');G.p(x,y+1,'#3a3a44')}
  G.e(12,16+hy,3,4.5,'#2a2a32');G.e(36,16+hy,3,4.5,'#2a2a32',{lb:-.2});G.p(11,14+hy,'#3ff0e8')}
 if(id==='bodyguard')for(let y=18;y<31;y++)G.p(36+(y%2),y+hy,'#c9d6dc');
 // ---- the lead holds the lantern up and out to the left (the approved combat mockup), never while Downed
 if(o.lantern&&!o.downed){G.cyl(lx-1,24,8,12,armC,{lb:.1});G.cyl(lx,34,8,26,armC,{lb:.05});G.e(lx+2,24,3.5,3,sk,{lb:.1})}
 const out=finish(G,o.downed),w=W+ML+MR,h=H+T0;
 cv=document.createElement('canvas');cv.width=w;cv.height=h;const x=cv.getContext('2d');
 for(let i=0;i<out.length;i++)if(out[i]){x.fillStyle=out[i];x.fillRect(i%w,(i/w|0),1,1)}
 if(o.lantern&&!o.downed){const ax=ML+lx-7,ay=T0+20;   // hangs from the fist on a short bail
  const g=x.createRadialGradient(ax+4,ay+9,1,ax+4,ay+9,13);g.addColorStop(0,'rgba(255,214,120,.55)');g.addColorStop(1,'rgba(255,180,80,0)');x.fillStyle=g;x.fillRect(ax-10,ay-4,28,28);
  const P=(c,a,b,ww,hh)=>{x.fillStyle=c;x.fillRect(ax+a,ay+b,ww,hh)};
  P('#120c1c',2,-2,5,1);P('#120c1c',2,-1,1,2);P('#120c1c',6,-1,1,2);P(OL,0,1,9,2);P('#5a4028',1,1,7,1);
  P(OL,0,3,9,10);P('#3a2a1a',1,3,7,9);P('#f4c96a',2,4,5,7);P('#fff1c4',3,5,3,4);P('#ffffff',4,6,1,2);P('#d6a43a',2,10,5,1);
  P('#5a4028',1,3,1,9);P(OL,0,13,9,1);P('#6a4c30',1,12,7,1)}
 cache.set(k,cv);return cv}
return{back,W:W+ML+MR,H:H+T0,AX:ML+24,AY:T0+H,BODY_W:W,BODY_H:H};
})();
window.BLB2=BLB2;
