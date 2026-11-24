// Rushlight · species-art.js
// The six slice species, drawn in code to the studio Quality bar (spec 008, 8A): the 64 × 64 portrait head, the 14 × 26 map sprite,
// the waist-up battle back view (the party, drawn natively at 2×) and the front battle view (folk enemies, natively at 1.5×).
// The drawing is the approved reference, mockups/36-sprite-upgrade-rough-v3.js ("This is great", Nov 23) and its front views,
// mockups/38-folk-front-rough-v1.js ("That works!"), lifted and tidied onto the shared pixel grid (engine/pixgrid.js):
// four-tone volume lit from the upper left, tufted fur, the selective outline, the rim, real clothes and the lit backing.
// Face parts (spec 003, 6; bible Art, Faces): coat shade (3 per species, each shifting the whole fur ramp), a mark (none, scar,
// torn ear, grey muzzle) and neckwear (none, kerchief, hood). Frames come from the shared rig (engine/rig.js): every pose moves parts.
// Exposes window.RLSP.
//   RLSP.ORDER                          the six species
//   RLSP.SP[k]                          the species' name, height and size line
//   RLSP.portrait(k, look, s, frame)    a canvas, 64 × 64 × s; look {shade 0..2 (1 = the sheet's coat), mark 0..3, neck 0..2, coat}
//                                       frame: null, 'blink' or 'talk'
//   RLSP.map(k, look, frame)            14 × 26; frame: 'stand' 'step1' 'step2' 'breath' 'blink' 'talk'
//   RLSP.back(k, look, frame)           64 × 88 (32 × 44 at 2×); frame: null or a hit/attack frame ('flinch' … 'settle')
//   RLSP.front(k, role, look, frame)    51 × 75 (34 × 50 at 1.5×); role 'bandit' or 'arms'
//   RLSP.MAP_FRAMES, RLSP.BATTLE_FRAMES the frame names, for the contact sheet
//   RLSP.coin(k)                        the company's coin token, 15 × 16 (Mockup 5, option C)
//   RLSP.mixHex(a, b, k)
(function(){
const X=StudioPix,mix=X.mix,PEAT='#1c1814',BONE='#e6dcc4';
const dark=c=>mix(c,PEAT,.55);
const ramp=(base,lightTo)=>X.ramp(base,lightTo);
const SP={
 mouse:   {name:'MOUSE',   h:18,size:'small · 18 px'},
 rat:     {name:'RAT',     h:18,size:'small · 18 px'},
 hare:    {name:'HARE',    h:22,size:'middle · 22 px'},
 hedgehog:{name:'HEDGEHOG',h:22,size:'middle · 22 px'},
 badger:  {name:'BADGER',  h:26,size:'tall · 26 px'},
 fox:     {name:'FOX',     h:26,size:'tall · 26 px'},
};
const ORDER=['mouse','rat','hare','hedgehog','badger','fox'];
const HT={mouse:'small',rat:'small',hare:'mid',hedgehog:'mid',badger:'tall',fox:'tall'};

// ---- palettes: [base, what its light tone pulls toward]. Coat colours stay as the species sheet sets them. ----
const SHIRT=['#d8ccb0'],BRASS=['#b8913a','#ffe9a8'],IRON=['#8a8274','#e0dcd0'],STRAP=['#6a4a32','#c89a6a'],STRAPD=['#3e2a1c','#9a6a44'],MOSSC=['#56623a','#c8d49a'];
const BASE={
 hare:    {fur:['#8a6a44','#f2d9a8'],pale:['#d6c6a4'],inner:['#b8907a'],tip:['#2a221c'],coat:MOSSC,shirt:SHIRT,strap:STRAP,metal:BRASS,nose:'#4a3226'},
 mouse:   {fur:['#9a8468','#f0dcb8'],pale:['#d6c6a4'],inner:['#c79a8a','#f2d0c0'],coat:MOSSC,shirt:SHIRT,strap:STRAP,metal:BRASS,nose:'#b06e6a',tail:'#b48a7a'},
 rat:     {fur:['#857b72','#d8d0c4'],pale:['#b3aa98','#f2ead6'],inner:['#b48a7a','#f2d0c0'],coat:['#6a4a32','#c8946a'],shirt:SHIRT,strap:STRAPD,metal:IRON,nose:'#c48a86',tail:'#b48a7a'},
 hedgehog:{fur:['#b89c76','#f2dcb4'],pale:['#e0d0b0','#fff4dc'],spine:['#6a5236','#c8a878'],coat:['#3b4757','#8a9cb4'],shirt:SHIRT,strap:STRAP,metal:BRASS,nose:PEAT},
 fox:     {fur:['#b8582a','#f2a060'],white:['#e6dcc4','#ffffff'],black:['#2e2a26','#6a625a'],coat:['#7a766e','#d8d2c4'],shirt:SHIRT,strap:STRAPD,metal:IRON,nose:PEAT,tail:'#b8582a'},
 badger:  {fur:['#7a766e','#d8d2c4'],white:['#e6dcc4','#ffffff'],black:['#2e2a26','#6a625a'],coat:['#9a4528','#e0905e'],shirt:SHIRT,strap:STRAPD,metal:IRON,nose:PEAT},
};
const SHADED=['fur','inner','spine','tip'];   // the coat shade shifts these whole ramps (spec 008: built from the shaded base)
const palCache={};
function pal(k,look){
 const sh=look&&look.shade!=null?look.shade:1,coat=look&&look.coat||'',key=k+sh+coat;if(palCache[key])return palCache[key];
 const B=BASE[k],P={};
 const shade=c=>sh===1?c:mix(c,sh===0?BONE:PEAT,sh===0?.22:.28);
 Object.keys(B).forEach(n=>{const v=B[n];if(typeof v==='string'){P[n]=n==='tail'?shade(v):v;return}P[n]=ramp(SHADED.includes(n)?shade(v[0]):v[0],v[1])});
 if(coat)P.coat=ramp(coat,mix(coat,'#f2ead6',.6));
 return palCache[key]=P}

// ================= PORTRAITS (64 × 64) =================
// the lit backing the Peat outline reads against (ui, Screen craft): warm earth, lighter toward the upper left
function backing(G){G.shape(()=>true,(u,v)=>{const b=mix('#8a7458','#4a3e30',Math.min(1,(v-.5)/63)),d=Math.hypot(u-.5-22,v-.5-18);return d<=24?mix(b,'#a8906c',(1-d/24)*.8):b})}
// coat, shirt, collar flaps and the strap with its buckle; neckwear's kerchief goes on over them
function shoulders(F,P,look){
 F.vol(32,66,29,16,P.coat,{});
 F.line(14,56,18,63,P.coat[3]);F.line(50,56,46,63,P.coat[3]);
 F.tri([[25,50],[32,62],[39,50]],P.shirt[1]);F.tri([[32,50],[32,62],[39,50]],P.shirt[2]);
 F.line(25,50,32,62,P.shirt[3]);F.line(39,50,32,62,P.shirt[3]);
 F.tri([[19,50],[26,49],[28,58]],P.coat[0]);F.tri([[45,50],[38,49],[36,58]],P.coat[2]);
 F.line(19,50,28,58,P.coat[3]);F.line(45,50,36,58,P.coat[3]);
 for(let i=0;i<22;i++){F.r(40-i,53+i*.55,3,2,i<8?P.strap[0]:P.strap[1]);F.p(40-i,55+i*.55,P.strap[3])}
 F.r(29,58,5,4,P.metal[3]);F.r(30,59,3,2,P.metal[0]);F.p(31,59,P.metal[1]);
 if((look.neck|0)===1)kerchief(F);
}
// the kerchief: a shaded Rust triangle under the chin, its two ends knotted at the right of the throat (spec 008)
const KER=ramp('#9a4528','#e0905e');
function kerchief(F){
 F.tri([[17,51],[32,63],[47,51]],KER[1]);F.tri([[17,51],[26,58],[25,51]],KER[0]);F.tri([[36,51],[32,63],[47,51]],KER[2]);
 F.line(17,51,32,63,KER[3]);F.line(32,63,47,51,KER[3]);F.r(17,50,31,2,KER[2]);F.r(17,50,13,1,KER[1]);
 F.vol(44,51,2.6,2.2,KER,{});F.tri([[44,52],[47,58],[49,55]],KER[2]);F.line(45,53,47,58,KER[3]);
}
function whiskers(F,y,c){[[-9,0,-17,-2],[-9,2,-17,3],[9,0,17,-2],[9,2,17,3]].forEach(([a,b,cc,d])=>F.line(32+a,y+b,32+cc,y+d,c))}
// eyes: small and dark, no glints; a lid line above (bible Art, Faces). shut: a lid line in their place (the blink)
function eyes(F,y,dx,lid,w=2,h=2,shut){if(shut){F.line(32-dx-w+1,y+h-1,32-dx,y+h-1,lid);F.line(32+dx,y+h-1,32+dx+w-1,y+h-1,lid);return}
 F.r(32-dx-w+1,y,w,h,PEAT);F.r(32+dx,y,w,h,PEAT);F.line(32-dx-w,y-1,32-dx+1,y-1,lid);F.line(32+dx-1,y-1,32+dx+w,y-1,lid)}
// each portrait draws its species and returns its anchors: eye line, muzzle, the ear pixels (for the hood's slits), the torn-ear notch and the hood's fit
const PORT={
 hare(F,P,look,fr){const s=F.snap();
  F.vol(24,17,5,14,P.fur,{});F.vol(41,18,5,14,P.fur,{dark:1});F.vol(24,19,2.5,10,P.inner);F.vol(41,20,2.5,10,P.inner,{dark:1});
  F.each((X,Y,c,u,v)=>{if(v>=9||u<16||u>=50||!c)return;const i=P.fur.indexOf(c),j=P.inner.indexOf(c);if(i<0&&j<0)return;F.set(X,Y,P.tip[Math.max(0,Math.min(3,i>=0?i:j))])});
  const ears=F.diff(s);
  F.vol(32,49,9,9,P.fur,{dark:1});F.vol(32,52,5,6,P.pale,{dark:1});shoulders(F,P,look);
  F.vol(32,36,14,12.5,P.fur,{fur:9,clump:true});F.vol(20,40,4,4,P.fur,{fur:7});F.vol(44,40,4,4,P.fur,{dark:1,fur:7});
  F.vol(32,43,7.5,5.5,P.pale);F.vol(32,48,4,2.5,P.pale,{dark:1});
  F.line(21,31,26,30,P.fur[2]);F.line(38,30,43,31,P.fur[3]);
  if(fr==='blink'){F.line(22,35,24,35,P.fur[3]);F.line(40,35,42,35,P.fur[3])}else{F.r(22,33,3,3,PEAT);F.r(40,33,3,3,PEAT);F.p(24,33,'#3a2a20');F.p(40,33,'#3a2a20')}
  F.line(21,32,25,32,P.fur[3]);F.line(39,32,43,32,P.fur[3]);
  F.r(30,40,4,2,P.nose);F.p(31,40,'#6a4a3a');F.r(31,42,2,2,'#3a2a20');F.p(30,44,'#3a2a20');F.p(33,44,'#3a2a20');if(fr==='talk')F.r(31,45,2,2,'#2a1c16');
  [[23,43,16,41],[23,45,16,46],[41,43,48,41],[41,45,48,46]].forEach(([a,b,c,d])=>F.line(a,b,c,d,'#a89e8a'));
  return {ears,scar:[41,33],muzzle:[32,44,7.5,6],notch:[20,6],hood:{cx:32,cy:36,rx:14,ry:12.5}}},
 badger(F,P,look,fr){const s=F.snap();
  F.vol(19.5,27,3.5,3.5,P.fur);F.vol(44.5,27,3.5,3.5,P.fur,{dark:1});F.vol(19.5,26,1.5,1.5,P.white,{dark:1});F.vol(44.5,26,1.5,1.5,P.white,{dark:2});
  const ears=F.diff(s);
  F.vol(32,50,13,9,P.fur,{dark:1,clump:true});shoulders(F,P,look);
  // the quilted jack: stitched rows and seams on the coat either side of the shirt
  F.each((X,Y,c,u,v)=>{if(!P.coat.includes(c)||(u>=24&&u<42)||v<54)return;const row=(Math.floor(v)-55)%3===0,col=(Math.floor(u)-8)%5===0;
   if(row)F.set(X,Y,P.coat[c===P.coat[0]?1:3]);else if(col)F.set(X,Y,P.coat[3])});
  F.vol(32,35,15,13,P.white,{fur:7});F.vol(32,44,8,6,P.white,{});
  for(let y=22;y<=46;y++){const t=(y-22)/24,off=Math.round(3.5+(1-t)*1.5),w=Math.max(2,Math.round(7-t*4.5));
   for(let i=0;i<w;i++){if(F.at(32-off-w+i,y))F.p(32-off-w+i,y,i===0?P.black[0]:P.black[1]);if(F.at(32+off+i,y))F.p(32+off+i,y,P.black[i>w-2?3:2])}}
  if(fr==='blink'){F.r(24,35,2,1,P.black[0]);F.r(38,35,2,1,P.black[0])}else{F.r(24,34,2,2,'#5a4636');F.r(38,34,2,2,'#5a4636')}F.p(24,33,P.black[0]);F.p(39,33,P.black[0]);
  F.vol(32,48,3.5,2.2,['#4a443e','#2a2420',PEAT,PEAT]);F.p(31,47,'#6a625a');F.r(31,51,2,1,P.fur[3]);if(fr==='talk')F.r(30,51,4,1,'#2a1c16');
  return {ears,scar:[39,34],muzzle:[32,46,7,5],notch:[17,24],hood:{cx:32,cy:35,rx:15,ry:13}}},
 mouse(F,P,look,fr){const s=F.snap();
  F.vol(18,24,10,10,P.fur);F.vol(46,24,10,10,P.fur,{dark:1});F.vol(18,25,6.5,6.5,P.inner);F.vol(46,25,6.5,6.5,P.inner,{dark:1});
  const ears=F.diff(s);
  F.vol(32,50,8,8,P.fur,{dark:1});shoulders(F,P,look);
  F.vol(32,38,12.5,11,P.fur,{fur:9,clump:true});F.vol(32,45,6.5,5,P.pale);F.vol(32,49,3.5,2,P.pale,{dark:1});
  eyes(F,35,6,P.fur[3],3,3,fr==='blink');
  F.r(30,42,4,2,P.nose);F.p(31,42,'#d89a90');F.r(31,44,2,1,'#3a2a20');F.p(30,46,'#3a2a20');F.p(33,46,'#3a2a20');if(fr==='talk')F.r(31,47,2,2,'#2a1c16');
  whiskers(F,44,'#a89e8a');
  return {ears,scar:[39,35],muzzle:[32,46,6.5,5],notch:[10,16],hood:{cx:32,cy:38,rx:12.5,ry:11}}},
 rat(F,P,look,fr){const s=F.snap();
  F.vol(20,25,5.5,6,P.fur);F.vol(44,25,5.5,6,P.fur,{dark:1});F.vol(20,26,3.5,4,P.inner);F.vol(44,26,3.5,4,P.inner,{dark:1});
  const ears=F.diff(s);
  F.vol(32,50,8,8,P.fur,{dark:1});shoulders(F,P,look);
  F.vol(32,35,12,11,P.fur,{fur:10,clump:true});F.vol(32,44,7,8,P.fur,{clump:true});F.vol(32,48,4.5,4.5,P.pale);
  eyes(F,33,6,P.fur[3],2,2,fr==='blink');
  F.r(30,49,4,2,P.nose);F.p(31,49,'#e0aaa6');F.r(31,51,2,1,'#3a2a20');if(fr==='talk')F.r(31,52,2,1,'#2a1c16');
  whiskers(F,49,'#a89e8a');
  return {ears,scar:[38,33],muzzle:[32,48,5,5],notch:[15,20],hood:{cx:32,cy:37,rx:12,ry:12}}},
 hedgehog(F,P,look,fr){
  F.vol(32,50,10,8,P.fur,{dark:1});shoulders(F,P,look);
  // spines: a shaded dome over the crown and down the sides, spiky at the edge, streaked with pale tips
  const s=F.snap(),L=StudioPix.LIGHT;
  F.shape((u,v)=>{const dx=(u-32)/21,dy=(v-36)/22,a=Math.atan2(dy,dx),sp=(Math.round(a*14)%2?.1:0);return v<47&&dx*dx+dy*dy<=1+sp},(u,v,Xp,Yp)=>{
   const dx=(u-32)/21,dy=(v-36)/22,d=dx*dx+dy*dy,z=Math.sqrt(Math.max(0,1-Math.min(d,1))),n=dx*L[0]+dy*L[1]+z*L[2];let i=n>.55?0:n>.25?1:n>-.05?2:3;if(d>.92)i=Math.min(3,i+1);
   const x=Math.floor(u),y=Math.floor(v),streak=((x*2+y*3)%7===0)||((x+y*2)%9===0);
   return streak&&i<3?(i===0?'#e8d4a8':P.spine[0]):((x*3+y)%5===0?P.spine[Math.min(3,i+1)]:P.spine[i])},[8,10,57,50]);
  const ears=F.diff(s);
  F.vol(32,41,10.5,9,P.fur,{fur:8});F.vol(32,47,6,5,P.pale);F.vol(32,50,3,2.5,P.pale,{dark:1});
  eyes(F,38,5,P.fur[3],2,2,fr==='blink');
  F.vol(32,51,2.2,1.8,['#4a443e','#2a2420',PEAT,PEAT]);if(fr==='talk')F.r(31,53,2,1,'#2a1c16');
  return {ears:new Set(),spines:ears,scar:[37,38],muzzle:[32,48,6,4.5],notch:[14,20],hood:{cx:32,cy:40,rx:12,ry:10}}},
 fox(F,P,look,fr){
  F.vol(32,52,8,7,P.white,{dark:1,fur:7});shoulders(F,P,look);
  F.vol(32,32,12,9.5,P.fur,{fur:9});
  const s=F.snap();
  // big ears drawn after the crown, their bases sunk into it so they grow out of the skull
  F.tri([[19,31],[20,7],[31,25]],P.fur[1]);F.tri([[33,25],[44,7],[45,31]],P.fur[2]);
  F.tri([[19,31],[20,7],[22,27]],P.fur[0]);F.tri([[42,27],[44,7],[45,31]],P.fur[3]);
  F.tri([[21.5,23],[21,13],[27,22]],P.black[1]);F.tri([[37,22],[43,13],[42.5,23]],P.black[2]);
  F.tri([[19,12],[20,7],[22,12]],P.black[1]);F.tri([[42,12],[44,7],[45,12]],P.black[2]);
  F.p(22,23,P.fur[1]);F.p(23,23,P.fur[1]);F.p(41,23,P.fur[2]);F.p(40,23,P.fur[2]);
  const ears=F.diff(s);
  F.tri([[21,33],[32,52],[43,33]],P.fur[1]);F.tri([[32,33],[32,52],[43,33]],P.fur[2]);F.tri([[21,33],[32,52],[24,33]],P.fur[0]);
  F.tri([[20,36],[29,40],[31,51]],P.white[0]);F.tri([[44,36],[35,40],[33,51]],P.white[2]);F.tri([[20,36],[24,37],[31,51]],P.white[1]);
  F.p(19,37,P.white[1]);F.p(18,38,P.white[2]);F.p(45,37,P.white[2]);F.p(46,38,P.white[3]);
  if(fr==='blink'){F.r(25,33,3,1,P.fur[3]);F.r(37,33,3,1,P.fur[3])}else{F.r(25,32,3,2,PEAT);F.r(37,32,3,2,PEAT)}
  F.p(24,31,P.black[1]);F.p(40,31,P.black[1]);F.p(28,33,P.fur[3]);F.p(36,33,P.fur[3]);
  F.vol(32,51,2.5,1.8,['#4a443e','#2a2420',PEAT,PEAT]);F.p(32,53,fr==='talk'?'#2a1c16':P.white[3]);if(fr==='talk')F.r(31,54,3,1,'#2a1c16');
  return {ears,scar:[38,32],muzzle:[32,47,5,5],notch:[19,14],hood:{cx:32,cy:33,rx:12.5,ry:10,fy:15,fc:37}}},
};
// marks, drawn in the ramp's own tones (spec 008): a scar is the light tone with a deep-tone edge; the torn ear a notch the outline
// follows; the grey muzzle pulls the muzzle's tones toward grey, keeping their order
function mark(F,P,A,look){
 const m=look.mark|0;
 if(m===1){const [x,y]=A.scar;for(let i=0;i<7;i++){const px=x+3-i*.7,py=y-4+i;if(F.at(px,py)){F.p(px,py,P.fur[0]);if(F.at(px+1,py))F.p(px+1,py,P.fur[3])}}}
 if(m===2){const [x,y]=A.notch;[[0,0],[1,0],[-1,0],[0,1],[1,1],[0,2]].forEach(([a,b])=>F.clear(x+a,y+b))}
 if(m===3){const [cx,cy,rx,ry]=A.muzzle,GR=ramp('#b8b2a6','#f2f0ea');
  F.each((Xp,Yp,c,u,v)=>{if(!c||((u-cx)/rx)**2+((v-cy)/ry)**2>1)return;for(const r of [P.pale,P.white,P.fur])if(r){const i=r.indexOf(c);if(i>=0){F.set(Xp,Yp,GR[i]);return}}})}
}
// the hood: a real cowl in a four-tone Moss ramp (spec 008). Cloth over the crown and down both sides of the face, the ears out
// through slits, a deep-tone inner edge round the face, folds onto the shoulders, lit from the upper left; the hem sits on the coat.
const HOODR=ramp('#56623a','#c8d49a');
function hood(F,A){
 const {cx,cy,rx,ry}=A.hood,ox=rx+5,oy=ry+6,oc=cy-1,fx=rx-1.5,fy=A.hood.fy||ry+2,fc=A.hood.fc||cy+3,chin=Math.round(fc+fy),hem=58,L=StudioPix.LIGHT;
 const shell=(u,v)=>{if(v<=cy+4)return ((u-cx)/ox)**2+((v-oc)/oy)**2<=1;if(v>hem+((Math.floor(u)*7)%3===0?1:0))return false;const t=(v-cy-4)/(hem-cy-4);return Math.abs(u-cx)<=ox+t*(27-ox)};
 const face=(u,v)=>((u-cx)/fx)**2+((v-fc)/fy)**2<=1;
 const ear=(Xp,Yp)=>A.ears.has(Xp+','+Yp);
 const S=F.S,cloth=(u,v,Xp,Yp)=>shell(u,v)&&!face(u,v)&&!ear(Xp,Yp);
 const near=(Xp,Yp,set)=>set.some(([a,b])=>{const u=(Xp+a+.5)/S,v=(Yp+b+.5)/S;return set===N4?face(u,v)&&!ear(Xp+a,Yp+b)&&v<chin:ear(Xp+a,Yp+b)});
 const N4=[[1,0],[-1,0],[0,1],[0,-1]],N6=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1]];
 F.shape(cloth,(u,v,Xp,Yp)=>{
  const nx=(u-cx)/ox,ny=(v-oc)/oy,d=Math.min(1,nx*nx+ny*ny),z=Math.sqrt(1-d),n=nx*L[0]+ny*L[1]+z*L[2];
  let i=n>.42?0:n>.08?1:n>-.25?2:3;if(nx>.45)i=Math.max(i,2);              // hard shade on the right
  if(v>chin+1){const f=[-14,-7,6,13].some(dd=>Math.abs(u-(cx+dd*(1+(v-chin)/30)))<.8);if(f)i=Math.min(3,i+1)}  // folds onto the shoulders
  if(v>=chin-1&&v<=chin+1&&Math.abs(u-cx)<4)i=2;
  if(near(Xp,Yp,N4)||near(Xp,Yp,N6))i=3;                                  // the deep inner edge, and the slits the ears come through
  return HOODR[i]});
 // the hem's lower edge on the coat gets a Peat line
 for(let Xp=0;Xp<F.W;Xp++)for(let Yp=F.H-1;Yp>chin*S;Yp--){const u=(Xp+.5)/S,v=(Yp+.5)/S;if(cloth(u,v,Xp,Yp)){if(Yp<F.H-1&&!cloth(u,(Yp+1.5)/S,Xp,Yp+1))F.set(Xp,Yp+1,PEAT);break}}
}
function portraitGrid(k,look,fr){
 const P=pal(k,look),G=StudioPix.grid(64,64),F=StudioPix.grid(64,64);backing(G);
 const A=PORT[k](F,P,look,fr);
 mark(F,P,A,look);
 if((look.neck|0)===2)hood(F,A);
 F.rim(.45).outline(dark);
 return {draw(ctx,ox,oy,s){G.draw(ctx,ox,oy,s);F.draw(ctx,ox,oy,s)}};
}

// ================= MAP SPRITES (14 × 26, facing down, feet on the bottom row) =================
// Three tones, separate arms with hands, a belt, boots with a highlight (Quality bar); no rim on map sprites (Craft).
// Frames from parts (art-style, Animation): step1/step2 lift one boot and swing the other arm, with the body a pixel up;
// breath sinks the head a pixel; blink shuts the eyes; talk opens the mouth.
const MAP_FRAMES=['stand','step1','step2','breath','blink','talk'];
function mapGrid(k,look,fr){
 const P=pal(k,look),G=StudioPix.grid(14,26),sz=HT[k],step=fr==='step1'?1:fr==='step2'?2:0;
 const legH=sz==='tall'?4:3,bodyH=sz==='small'?6:sz==='mid'?8:10,headH=sz==='small'?6:sz==='mid'?7:8;
 const lift=step?-1:0,legY=26-legH,bodyY=legY-bodyH+lift,headY=bodyY-headH+1+(fr==='breath'?1:0);
 if(k==='mouse'||k==='rat')for(let i=0;i<5;i++)G.p(11+(i>2?1:0),bodyY+bodyH-2+i-(i>3?1:0),P.tail);
 if(k==='fox'){G.r(10,bodyY+bodyH-3,3,4,P.fur[2]);G.r(11,bodyY+bodyH,2,2,P.white[1])}
 // boots: the lifted one stops a row short of the ground
 const boot=(x,c,cl,up)=>{G.r(x,legY+lift,2,legH-lift-up,c);G.p(x,25-up,cl);G.r(x,legY+lift,2,1,'#4a3e32')};
 boot(4,'#3a3028','#5a4a3a',step===2?1:0);boot(8,'#2a221c','#3a3028',step===1?1:0);
 for(let y=bodyY;y<legY+lift;y++)for(let x=3;x<11;x++)G.p(x,y,x<5?P.coat[0]:x<8?P.coat[1]:P.coat[2]);
 G.r(3,legY+lift-1,8,1,P.coat[3]);
 const by=bodyY+Math.floor(bodyH/2);G.r(3,by,8,1,P.strap[2]);G.p(6,by,P.metal[0]);G.p(7,by,P.metal[2]);
 G.r(6,bodyY,2,2,P.shirt[1]);G.p(7,bodyY+1,P.shirt[2]);
 if(k==='hedgehog'){G.r(2,bodyY,10,2,P.spine[2]);G.r(2,bodyY,4,1,P.spine[1])}
 // arms swing against the step
 const al=bodyH-2,aL=step===2?1:step===1?-1:0,aR=-aL;
 G.r(2,bodyY+1,1,al+aL,P.coat[0]);G.r(11,bodyY+1,1,al+aR,P.coat[2]);G.p(2,bodyY+al+1+aL,P.fur[1]);G.p(11,bodyY+al+1+aR,P.fur[2]);
 if((look&&look.neck|0)===1){G.r(4,bodyY,6,1,KER[1]);G.p(9,bodyY,KER[2]);G.p(6,bodyY+1,KER[2])}
 for(let y=headY;y<headY+headH;y++)for(let x=3;x<11;x++)G.p(x,y,(x<5||y===headY)?P.fur[0]:x>8?P.fur[2]:P.fur[1]);
 G.clear(3,headY);G.clear(10,headY);
 const ey=headY+Math.floor(headH/2)-1,mz=headY+headH-3;
 if(k==='hare'){G.r(4,headY-7,2,7,P.fur[0]);G.r(8,headY-7,2,7,P.fur[2]);G.r(5,headY-6,1,5,P.inner[1]);G.r(8,headY-6,1,5,P.inner[2]);G.r(4,headY-7,2,2,P.tip[1]);G.r(8,headY-7,2,2,P.tip[2])}
 if(k==='mouse'){G.r(1,headY-3,4,4,P.fur[0]);G.r(9,headY-3,4,4,P.fur[2]);G.r(2,headY-2,2,2,P.inner[1]);G.r(10,headY-2,2,2,P.inner[2]);G.clear(1,headY-3);G.clear(12,headY-3)}
 if(k==='rat'){G.r(2,headY-2,3,3,P.fur[1]);G.r(9,headY-2,3,3,P.fur[2]);G.p(3,headY-1,P.inner[1]);G.p(10,headY-1,P.inner[2])}
 if(k==='hedgehog'){G.r(2,headY-2,10,4,P.spine[1]);for(let i=0;i<5;i++)G.p(3+i*2,headY-3,P.spine[i<2?0:2]);for(let i=0;i<4;i++)G.p(4+i*2,headY-1,P.spine[0]);G.r(10,headY-2,2,4,P.spine[3]);G.r(2,headY+2,1,3,P.spine[1]);G.r(11,headY+2,1,3,P.spine[3])}
 if(k==='fox'){G.tri([[3,headY+1],[4,headY-3],[6,headY+1]],P.fur[0]);G.tri([[8,headY+1],[10,headY-3],[11,headY+1]],P.fur[2]);G.p(4,headY-2,PEAT);G.p(10,headY-2,PEAT);G.r(3,mz,8,3,P.white[1]);G.p(3,mz,P.white[0]);G.r(5,mz,4,1,P.fur[1]);G.p(6,headY+headH-2,P.fur[1])}
 if(k==='badger'){G.r(3,headY-1,2,2,P.fur[1]);G.r(9,headY-1,2,2,P.fur[2]);
  for(let y=headY;y<headY+headH;y++){G.p(3,y,P.white[0]);G.p(4,y,P.black[1]);G.p(5,y,P.black[2]);G.p(8,y,P.black[2]);G.p(9,y,P.black[3]);G.p(10,y,P.white[2]);G.p(6,y,P.white[0]);G.p(7,y,P.white[1])}
  G.r(4,headY+headH-2,6,2,P.white[1]);G.p(4,headY+headH-2,P.white[0]);G.p(9,headY+headH-1,P.white[2])}
 if(k==='mouse'||k==='rat'||k==='hare'){G.r(5,mz,4,3,P.pale[1]);G.p(5,mz,P.pale[0]);G.p(8,mz+1,P.pale[2]);G.p(6,mz,P.nose);G.p(7,mz,P.nose)}
 if(k==='hedgehog'){G.r(5,mz,4,3,P.pale[1]);G.p(5,mz,P.pale[0]);G.r(6,mz+2,2,1,PEAT)}
 if(k==='badger'||k==='fox')G.r(6,headY+headH-1,2,1,PEAT);
 if(fr==='talk')G.r(6,headY+headH-1,2,1,'#3a1c16');
 const lid=P.fur[2];
 if(k==='badger'){G.p(5,ey,fr==='blink'?P.black[1]:'#5a4636');G.p(8,ey,fr==='blink'?P.black[2]:'#5a4636')}
 else if(fr==='blink'){G.r(4,ey,2,1,lid);G.r(8,ey,2,1,lid)}else{G.p(4,ey,PEAT);G.p(9,ey,PEAT);G.p(5,ey,PEAT);G.p(8,ey,PEAT)}
 // the hood on the map: cloth over the crown and down the sides, the face showing
 if((look&&look.neck|0)===2){const H=HOODR;G.r(3,headY-1,8,2,H[1]);G.r(3,headY-1,3,1,H[0]);G.r(2,headY,1,headH,H[0]);G.r(11,headY,1,headH,H[2]);G.r(9,headY-1,2,2,H[2]);G.r(2,headY+headH-1,10,1,H[2])}
 return G.outline(dark);
}

// ================= BATTLE BACK VIEW (waist up; 32 × 44 design, drawn natively at 2×) =================
// shoulders, a neck, a round head seen from behind, ears rooted in the head, the pack strap and satchel. Poses move the head and
// body as parts: a flinch jolts the head back and flashes pale, a hold hunches, a wind-up crouches, a strike reaches up the field.
const BATTLE_FRAMES=['stand','flinch','hold','recover','windup','strike','settle'];
const BACK_POSE={stand:[0,0,0,0],flinch:[1,1,1,-1],hold:[1,1,0,1],recover:[0,0,1,0],windup:[-1,2,0,1],strike:[1,-3,1,-1],settle:[0,-1,0,0]};
function backGrid(k,look,fr){
 const P=pal(k,look),G=StudioPix.grid(32,44,2,{ox:1,oy:4}),sc={small:.82,mid:.92,tall:1}[HT[k]],L=StudioPix.LIGHT;
 const [dx,dy,hx,hy]=BACK_POSE[fr||'stand']||BACK_POSE.stand,body=()=>G.org(1+dx,4+dy),head=()=>G.org(1+dx+hx,4+dy+hy);
 const sh=Math.round(15*sc),hr=Math.round(8.5*sc+.5),bw=Math.round(24*sc),by=40-sh,cx=15,cy=by-hr+3;
 body();
 if(k==='mouse'||k==='rat')for(let i=0;i<8;i++)G.p(cx+bw/2+1+(i>5?1:0),39-i,i%2?P.tail:mix(P.tail,PEAT,.2));
 if(k==='fox'){G.vol(cx+bw/2+1,35,3.5,5,P.fur,{});G.vol(cx+bw/2+2,39,2.5,2,P.white,{})}
 head();
 if(k==='hare'){G.vol(cx-3,cy-hr-4,2.2,8.5,P.fur,{});G.vol(cx+3,cy-hr-4,2.2,8.5,P.fur,{dark:1});
  G.shape((u,v)=>v<cy-hr-9&&P.fur.includes(G.at(u,v)),(u,v)=>P.tip[Math.min(3,P.fur.indexOf(G.at(u,v)))],[0,-6,30,cy-hr-9])}
 const earRamp=[P.fur[1],P.fur[2],P.fur[3],mix(P.fur[3],PEAT,.5)];
 const ear=(x,y,rx,ry,rim)=>{G.shape((u,v)=>((u-x)/(rx+1))**2+((v-y)/(ry+1))**2<=1,earRamp[3],[x-rx-2,y-ry-2,x+rx+2,y+ry+2]);G.vol(x,y,rx,ry,earRamp,{});if(rim)G.p(Math.round(x-rx*.4),Math.round(y-ry+1),rim)};
 if(k==='mouse'){ear(cx-hr+1,cy-hr+1,4.2,4.2);ear(cx+hr-1,cy-hr+1,4.2,4.2)}
 if(k==='rat'){ear(cx-hr+2,cy-hr+2,2.8,2.8);ear(cx+hr-2,cy-hr+2,2.8,2.8)}
 if(k==='badger'){ear(cx-hr+1,cy-hr*.45,1.6,1.6,P.white[1]);ear(cx+hr-1,cy-hr*.45,1.6,1.6,P.white[2])}
 if(k==='fox'){G.tri([[cx-hr+1,cy-1],[cx-hr+2,cy-hr-6],[cx-1,cy-hr+2]],P.black[1]);G.tri([[cx+1,cy-hr+2],[cx+hr-2,cy-hr-6],[cx+hr-1,cy-1]],P.black[2]);
  G.tri([[cx-hr+1,cy-1],[cx-hr+2,cy-hr-1],[cx-2,cy-hr+2]],P.fur[1]);G.tri([[cx+2,cy-hr+2],[cx+hr-2,cy-hr-1],[cx+hr-1,cy-1]],P.fur[2])}
 body();
 G.vol(cx,by+sh+1,bw/2+1,sh+1,P.coat,{});G.line(cx,by+2,cx,39,P.coat[2]);
 if((look.neck|0)===1){G.tri([[cx-6,by],[cx+6,by],[cx+4,by+5]],KER[1]);G.tri([[cx,by],[cx+6,by],[cx+4,by+5]],KER[2]);G.line(cx-6,by,cx+4,by+5,KER[3])}
 head();
 if(k!=='hedgehog')G.vol(cx,by+1-hy,hr*.62,3,P.fur,{dark:1});
 if(k==='hedgehog'){const R=hr+3;
  G.shape((u,v)=>{const top=v<cy+2,ddx=(u-cx)/R,ddy=top?(v-(cy+2))/(R+1):0,hw=top?1:1-(v-cy-2)/(by+6-cy)*.25,a=Math.atan2(ddy,ddx),sp=Math.round(a*12)%2?.12:0,d=top?ddx*ddx+ddy*ddy:(Math.abs(ddx)/hw)**2;return d<=1+sp&&v<=by+6},
   (u,v)=>{const top=v<cy+2,ddx=(u-cx)/R,ddy=top?(v-(cy+2))/(R+1):0,d=top?ddx*ddx+ddy*ddy:ddx*ddx,z=Math.sqrt(Math.max(0,1-Math.min(d,1))),n=ddx*L[0]+(top?ddy:.2)*L[1]+z*L[2];let i=n>.55?0:n>.25?1:n>-.05?2:3;if(d>.9)i=Math.min(3,i+1);
    const x=Math.floor(u),y=Math.floor(v);return ((x*2+y*3)%7===0&&i<3)?P.spine[0]:P.spine[i]},[cx-R-2,cy-R-3,cx+R+2,by+7])}
 else{
  if(k!=='hare')G.shape((u,v)=>((u-cx)/(hr+1))**2+((v-cy)/(hr*.95+1))**2<=1&&v<cy,P.fur[3],[cx-hr-2,cy-hr-2,cx+hr+2,cy+1]);
  if(k==='badger')G.vol(cx,cy+1,hr*.9,hr*1.02,P.fur,{});else G.vol(cx,cy,hr,hr*.95,P.fur,{});
  [[-3,1],[-1,2],[2,1],[4,0]].forEach(([a,b])=>G.p(cx+a,cy+hr*.95+b-1,P.fur[2]))}
 if(k==='badger')for(let y=Math.round(cy-hr);y<by+1;y++){const t=(y-(cy-hr))/(by+1-(cy-hr));
  for(let i=-4;i<4;i++){if(!G.at(cx+i,y))continue;const a=Math.abs(i+.5);if(a<1)G.p(cx+i,y,P.white[i<0?0:1]);else if(a<3&&t<.7)G.p(cx+i,y,P.black[i<0?1:2])}}
 if(k==='fox'){G.p(cx-1,by+2,P.white[1]);G.p(cx,by+2,P.white[2]);[[-hr,2],[-hr,3],[-hr+1,4],[hr-1,2],[hr-1,3],[hr-2,4]].forEach(([a,b],i)=>G.p(cx+a,cy+b,P.white[i<3?1:2]))}
 // the hood from behind: cloth over the crown and the back of the neck, the ears out through slits, folds to the shoulders
 if((look.neck|0)===2){const s=G.snap();G.vol(cx,cy+1,hr+1.2,hr+1.5,HOODR,{});G.shape((u,v)=>Math.abs(u-cx)<hr+1-(v-cy)*.1&&v>cy&&v<by+4,(u)=>HOODR[u<cx-2?1:u<cx+3?2:3],[cx-hr-2,cy,cx+hr+2,by+4]);
  for(const f of [-3,2])G.line(cx+f,cy+hr-1,cx+f*1.6,by+3,HOODR[3])}
 body();
 G.line(cx-6,by+1,cx+5,39,P.strap[2]);G.line(cx-5,by+1,cx+6,39,P.strap[1]);
 G.r(cx+3,by+7,7,6,P.strap[2]);G.r(cx+3,by+7,7,1,P.strap[0]);G.r(cx+9,by+7,1,6,P.strap[3]);G.p(cx+6,by+9,P.metal[0]);
 G.rim(.4).outline(dark);
 if(fr==='flinch')G.tint('#fff4dc',.4);
 return G;
}

// ================= FRONT BATTLE VIEW (folk enemies; 34 × 50 design, drawn natively at 1.5×) =================
// Built like the back view: shaded head and body, the species' face small, the weapon in hand, gear by role (mockup 38):
// 'bandit' (a ragged cloak, a hatchet or long knife, a kerchief over the muzzle or a cowl) and 'arms' (a man-at-arms: kettle hat,
// quilted jack in livery, a spear). The face parts vary each one, so two bandits read as two people (Craft, No twins).
const ROLE={
 bandit:{coat:ramp('#5a4a36','#b09a74'),cloak:ramp('#4a4036','#9a8a70'),kerchief:ramp('#8a3a2a','#d07a5a')},
 arms:{coat:ramp('#7a2e24','#d07060'),cloak:ramp('#4e4c50','#a4a2a8'),kerchief:ramp('#56623a','#c8d49a'),steel:['#e8e4dc','#a8a49a','#6a6860','#3a3834'],wood:ramp('#6a4a2c','#b08a5a'),trim:ramp('#c8a552','#fff0b0')},
};
// pose: whole body [dx, dy], head [hx, hy], weapon [wx, wy] on top of the body
const FRONT_POSE={stand:[0,0,0,0,0,0],flinch:[1,-1,1,-1,1,-1],hold:[1,0,0,1,0,1],recover:[0,0,1,0,0,0],windup:[0,-1,0,0,-1,-3],strike:[0,2,0,1,3,4],settle:[0,1,0,0,1,1]};
function frontGrid(k,role,look,fr){
 look=look||{};const P=pal(k,look),R=ROLE[role]||ROLE.bandit,G=StudioPix.grid(34,50,1.5,{ox:2,oy:4}),cx=14;
 const [dx,dy,hx,hy,wx,wy]=FRONT_POSE[fr||'stand']||FRONT_POSE.stand,body=()=>G.org(2+dx,4+dy),head=()=>G.org(2+dx+hx,4+dy+hy),weap=()=>G.org(2+dx+wx,4+dy+wy);
 const tall=HT[k]==='tall'?1:HT[k]==='mid'?.94:.86,hr=5.6*tall+.4,cy=Math.round(46-31*tall-hr)+1,by=Math.round(cy+hr-1),legY=38;
 const neck=look.neck|0,mk=look.mark|0;
 body();
 if(role==='arms'){weap();G.r(25,2,1,43,R.wood[1]);G.r(26,2,1,43,R.wood[2]);G.tri([[24.5,3],[25.5,-3],[27.5,3]],R.steel[1]);G.p(25,0,R.steel[0]);G.r(24,3,4,1,R.steel[2]);body()}
 if(role==='bandit')G.vol(cx,by+11,11,13,R.cloak,{dark:1,clump:1});
 G.org(2,4);G.r(cx-5,legY,4,6,R.coat[2]);G.r(cx+1,legY,4,6,R.coat[3]);G.r(cx-5,legY,1,6,R.coat[1]);
 G.r(cx-6,43,5,3,'#3a3028');G.r(cx+1,43,5,3,'#2a221c');G.r(cx-6,43,5,1,'#5a4a3a');body();
 if(k==='fox'){G.vol(cx+9,36,3,5,P.fur,{dark:1});G.vol(cx+10,41,2,2,P.white,{})}
 if(k==='mouse'||k==='rat')for(let i=0;i<8;i++)G.p(cx+8+(i>4?1:0),37+i*.9,P.tail);
 for(let y=by+1;y<legY+1;y++){const t=y-by,hw=t<3?5+t*.8:t<12?7.2-(t-3)*.18:5.6+(t-12)*.35;
  for(let x=Math.round(cx-hw);x<=Math.round(cx+hw-1);x++){const u=(x+.5-cx)/hw;let i=u<-.5?0:u<.2?1:u<.7?2:3;
   if(t<2&&i>0)i--;if(role==='bandit'&&Math.sin(u*7+t*.3)>.85&&t>12&&i<3)i++;G.p(x,y,R.coat[i])}}
 G.r(cx-7,legY,14,1,R.coat[3]);
 if(role==='arms'){for(let y=by+3;y<legY;y+=3)for(let x=cx-7;x<=cx+7;x++){const c=G.at(x,y);if(c)G.p(x,y,R.coat[Math.min(3,R.coat.indexOf(c)+1)])}
  G.r(cx-1,by+2,2,legY-by-2,R.trim[1]);G.p(cx-1,by+2,R.trim[0])}
 G.r(cx-7,by+12,15,2,P.strap[2]);G.r(cx-7,by+12,15,1,P.strap[1]);G.r(cx-1,by+12,2,2,P.metal[1]);G.p(cx-1,by+12,P.metal[0]);
 G.vol(cx-7.5,by+7,1.8,6,R.coat,{});G.vol(cx+7.5,by+7,1.8,6,R.coat,{dark:1});
 G.vol(cx+8,by+13,1.8,1.8,P.fur,{dark:1});
 if(role==='arms'){weap();G.r(24,by+12,3,3,P.fur[2]);body()}
 if(neck===2)G.vol(cx,by+1,9,4,R.cloak||R.coat,{});else{G.vol(cx,by+1,8,3,R.coat,{});G.r(cx-2,by,4,2,P.shirt[1])}
 // a man-at-arms shows his neckwear at the collar, since the kettle hat hides the rest: a scarf (neck 1) or a grey mantle (neck 2)
 if(role==='arms'&&neck===1){G.tri([[cx-5,by],[cx+5,by],[cx,by+5]],R.kerchief[1]);G.tri([[cx,by],[cx+5,by],[cx,by+5]],R.kerchief[2]);G.vol(cx+4,by+1,1.6,1.4,R.kerchief,{})}
 if(role==='arms'&&neck===2){G.vol(cx,by+3,9.5,5,R.cloak,{});G.line(cx-6,by+3,cx-7,by+7,R.cloak[3]);G.line(cx+5,by+3,cx+6,by+7,R.cloak[3])}
 head();
 const ear=(x,y,rx,ry,side)=>{G.vol(x,y,rx,ry,P.fur,{dark:side>0?1:0});if(P.inner)G.vol(x,y+.5,rx*.55,ry*.7,P.inner,{dark:side>0?1:0})};
 const hareEars=()=>{for(const sd of [-1,1]){const bx=cx+sd*2.2,top=cy-hr-12;
   for(let y=Math.floor(top);y<cy-hr+3;y++){const t=(y-top)/(cy-hr+3-top),w=t<.15?1+t*6:2,x0=bx+sd*(1-t)*2.2;
    for(let x=Math.round(x0-w);x<=Math.round(x0+w-1);x++){const inner=Math.abs(x+.5-x0)<w-1&&t>.2&&t<.9;
     G.p(x,y,t<.18?P.tip[sd<0?1:2]:inner?P.inner[sd<0?1:2]:P.fur[x<x0?(sd<0?0:1):(sd<0?1:2)])}}}};
 if(k==='hare'&&role!=='arms')hareEars();
 const eo=role==='arms'?3:0;
 if(k==='mouse'){ear(cx-hr-eo*.3,cy-hr+1+eo,3.6,3.6,-1);ear(cx+hr+eo*.3,cy-hr+1+eo,3.6,3.6,1)}
 if(k==='rat'){ear(cx-hr+1-eo*.4,cy-hr+2+eo,2.4,2.4,-1);ear(cx+hr-1+eo*.4,cy-hr+2+eo,2.4,2.4,1)}
 if(k==='fox'){G.tri([[cx-hr,cy-1],[cx-hr+1,cy-hr-6],[cx-1,cy-hr+1]],P.fur[1]);G.tri([[cx+1,cy-hr+1],[cx+hr-1,cy-hr-6],[cx+hr,cy-1]],P.fur[2]);
  G.tri([[cx-hr+1.5,cy-2],[cx-hr+1.5,cy-hr-3],[cx-2.5,cy-hr+1]],P.black[1]);G.tri([[cx+2.5,cy-hr+1],[cx+hr-1.5,cy-hr-3],[cx+hr-1.5,cy-2]],P.black[2])}
 if(k==='hedgehog'){G.vol(cx,cy,hr+4,hr+3,P.spine,{fur:17,clump:1});
  for(let i=0;i<14;i++){const a=Math.PI*(1.05+i*.065),r=hr+4.5;G.line(cx+Math.cos(a)*(r-2),cy+Math.sin(a)*(r-2),cx+Math.cos(a)*(r+1.5),cy+Math.sin(a)*(r+1.5),P.spine[i%3?2:1])}}
 if(k==='fox'){G.vol(cx,cy-1,hr*.9,hr*.72,P.fur,{fur:9});
  G.tri([[cx-hr*.9,cy-1],[cx+hr*.9,cy-1],[cx,cy+hr*1.15]],P.fur[1]);G.tri([[cx,cy-1],[cx+hr*.9,cy-1],[cx,cy+hr*1.15]],P.fur[2]);
  G.tri([[cx-hr*.95,cy],[cx-1.5,cy+2.5],[cx-.5,cy+hr*1.1]],P.white[0]);G.tri([[cx+hr*.95,cy],[cx+1.5,cy+2.5],[cx+.5,cy+hr*1.1]],P.white[2])}
 else if(k==='badger'){ // the battle face drawn by hand (mockup 38): white blaze, a black stripe each side through the eye, white cheeks
  const MAP=['..kk.WWW.kk..','.kwkBWWWBkwk.','.kkBBWWWBBkk.','.WBBBWWWBBBW.','WWBBBWWWBBBWW','WWBeBBWBBeBWW','WWWBBBWBBBWWW','.WWWBBWBBWWW.','..WWWBWBWWW..','...WWBWBWW...','....WWWWW....','.....WnW.....','......n......'];
  MAP.forEach((row,r)=>[...row].forEach((ch,c)=>{if(ch==='.')return;const x=cx-6+c,y=Math.round(cy)-6+r,lit=c<6,low=r>8;
   const col={W:P.white[lit?0:low?2:1],B:P.black[lit?1:2],e:fr==='blink'?P.black[1]:'#5a4636',n:'#2a2420',k:P.black[lit?1:2],w:P.white[1]}[ch];G.p(x,y,col)}))}
 else G.vol(cx,cy,hr,hr*.95,P.fur,{fur:k==='hedgehog'?0:9});
 if(k==='fox'){G.tri([[cx-hr,cy],[cx-1,cy+2],[cx,cy+hr]],P.white[0]);G.tri([[cx+hr,cy],[cx+1,cy+2],[cx,cy+hr]],P.white[2])}
 const pale=P.pale||P.white||P.fur,my=cy+hr*.45;
 if(k==='hedgehog'){G.tri([[cx-3.5,my-2],[cx+3.5,my-2],[cx,my+4]],pale[1]);G.tri([[cx-3.5,my-2],[cx,my-2],[cx,my+4]],pale[0]);G.tri([[cx+1,my-1],[cx+3.5,my-2],[cx,my+4]],pale[2])}
 else if(k!=='badger'&&k!=='fox')G.vol(cx,my,hr*.55,hr*.42,pale,{});
 if(k==='hedgehog')G.r(cx-1,Math.round(my)+3,2,2,'#2a2420');else if(k==='fox')G.r(cx-1,Math.round(cy+hr),2,1,'#2a2420');
 else if(k!=='badger'){G.r(cx-1,Math.round(my)-1,2,1,P.nose&&P.nose!==PEAT?P.nose:'#2a2420');G.p(cx-1,Math.round(my)-2,'#5a4a40')}
 const ey=Math.round(cy-1);if(k!=='badger'){G.r(cx-4,ey,2,k==='fox'?1:2,PEAT);G.r(cx+2,ey,2,k==='fox'?1:2,PEAT)}
 // face parts: a scar (light tone, deep edge), a torn ear notch, a grey muzzle
 if(mk===1){G.line(cx+2,ey-3,cx+4,ey+3,P.fur[0]);G.line(cx+3,ey-3,cx+5,ey+3,P.fur[3])}
 if(mk===2){const ex=k==='hare'?cx+3:cx+hr-1,eyy=k==='hare'?cy-hr-7:cy-hr+1;G.clear(ex,eyy);G.clear(ex+1,eyy);G.p(ex,eyy+1,PEAT)}
 if(mk===3)for(let y=Math.round(my-1);y<my+3;y++)for(let x=cx-3;x<cx+3;x++){const c=G.at(x,y);if(c&&c!==PEAT&&(x+y)%2)G.p(x,y,mix(c,'#d8d4cc',.5))}
 if(role==='bandit'&&neck===1){for(let y=Math.round(cy+2);y<cy+hr+2;y++){const hw=(k==='fox'?hr*.75:hr*.72)-(y-cy-2)*(k==='fox'?.7:.55);for(let x=Math.round(cx-hw);x<=Math.round(cx+hw);x++)G.p(x,y,R.kerchief[x<cx-1?0:x<cx+2?1:2])}
  G.p(cx+hr-1,my-1,R.kerchief[3]);G.p(cx+hr,my,R.kerchief[2])}
 if(role==='bandit'&&neck===2){for(let y=Math.floor(cy-hr-1);y<by+2;y++)for(let x=Math.floor(cx-hr-2);x<=cx+hr+2;x++){const ddx=(x+.5-cx)/(hr+1.6),ddy=(y+.5-cy)/(hr+1.4);
   const fc=((x+.5-cx)/(hr*.72))**2+((y+.5-cy-1)/(hr*.9))**2;if(ddx*ddx+ddy*ddy>1&&y<cy)continue;if(fc<1||Math.abs(ddx)>1)continue;
   G.p(x,y,fc<1.35?R.cloak[3]:R.cloak[x<cx-2?0:x<cx+3?1:2])}}
 if(role==='arms'){const hy2=Math.round(cy-hr+2.5);G.vol(cx,hy2-1,hr*.85,4,R.steel,{});G.r(cx,hy2-5,1,2,R.steel[2]);
  G.r(Math.round(cx-hr-2),hy2+2,Math.round(hr*2+5),1,R.steel[1]);G.r(Math.round(cx-hr-1),hy2+3,Math.round(hr*2+3),1,R.steel[3]);G.p(Math.round(cx-hr-2),hy2+2,R.steel[0])}
 if(k==='hare'&&role==='arms')hareEars();
 if(role==='bandit'){weap();const hx2=cx-8,hy2=by+13,ST=['#eeeae2','#b4b0a6','#7a786e','#46443e'];
  if(mk%2===0){G.line(hx2+2,hy2+1,hx2-1,hy2-11,PEAT);G.line(hx2,hy2+1,hx2-3,hy2-11,'#e0c49a');G.line(hx2+1,hy2+1,hx2-2,hy2-11,'#a07a4a');
   G.r(hx2-8,hy2-13,6,5,ST[1]);G.r(hx2-8,hy2-9,6,1,ST[3]);G.r(hx2-10,hy2-14,2,7,ST[0]);G.r(hx2-3,hy2-12,2,3,ST[2]);G.p(hx2-9,hy2-13,'#ffffff')}
  else{G.r(hx2-1,hy2-1,2,3,'#3a2a1c');G.r(hx2-3,hy2-2,6,1,P.metal[1]);G.p(hx2-3,hy2-2,P.metal[0]);
   for(let i=0;i<10;i++){G.p(hx2-1,hy2-3-i,ST[0]);G.p(hx2,hy2-3-i,i>8?ST[2]:ST[1])}G.p(hx2-1,hy2-13,ST[1])}
  G.vol(cx-7.5,by+13,1.8,1.8,P.fur,{})}
 else{weap();G.vol(cx-8,by+13,1.8,1.8,P.fur,{})}
 G.org(2,4);G.rim(.32).outline(dark);
 if(fr==='flinch')G.tint('#fff4dc',.4);
 return G;
}

// ================= COIN TOKEN (unchanged from Mockup 5, option C) =================
function coinGrid(k){const G=StudioPix.grid(15,16),BR='#b8913a',BRL='#d9b45a',BRD='#7a5e24';
 const ell=(cx,cy,rx,ry,c,sh)=>G.shape((u,v)=>((u-cx)/rx)**2+((v-cy)/ry)**2<=1,(u)=>sh&&(u-cx)>rx*sh.k?sh.c:c,[cx-rx-1,cy-ry-1,cx+rx+1,cy+ry+1]);
 ell(7.5,8.5,7,6.5,BRD);ell(7.5,7.5,7,6.5,BR,{c:BRD,k:.55});ell(7.5,7.5,5.5,5,BRL,{c:BR,k:.3});
 const P=PEAT,h=(x,y,w,hh)=>G.r(x,y,w,hh,P);
 h(5,6,5,4);h(6,10,3,1);
 if(k==='mouse'){ell(4.5,5,1.8,1.8,P);ell(10.5,5,1.8,1.8,P)}
 if(k==='rat'){h(4,4,2,2);h(9,4,2,2);h(7,10,1,2)}
 if(k==='hare'){h(5,1,2,5);h(8,1,2,5)}
 if(k==='hedgehog'){for(let i=0;i<5;i++)h(4+i,4-(i%2),1,2);h(4,5,7,1)}
 if(k==='badger'){h(5,4,2,2);h(8,4,2,2);G.r(7,5,1,5,BONE)}
 if(k==='fox'){G.tri([[4.5,7],[5,3],[7,6]],P);G.tri([[8,6],[10,3],[10.5,7]],P);h(6,10,3,2)}
 return G}

const cache={};
function cv(key,G,s){if(cache[key])return cache[key];return cache[key]=G().canvas(s||1)}
const lk=l=>l?[l.shade==null?1:l.shade,l.mark|0,l.neck|0,l.coat||''].join(''):'100';
window.RLSP={SP,ORDER,mixHex:mix,MAP_FRAMES,BATTLE_FRAMES,
 portrait:(k,look,s=1,fr)=>{const key='p'+k+lk(look)+s+(fr||'');if(cache[key])return cache[key];
  const c=document.createElement('canvas');c.width=c.height=64*s;portraitGrid(k,look||{},fr).draw(c.getContext('2d'),0,0,s);return cache[key]=c},
 map:(k,look,fr)=>cv('m'+k+lk(look)+(fr&&fr!=='stand'?fr:''),()=>mapGrid(k,look||{},fr)),
 back:(k,look,fr)=>cv('b'+k+lk(look)+(fr||''),()=>backGrid(k,look||{},fr)),
 front:(k,role,look,fr)=>cv('f'+k+role+lk(look)+(fr||''),()=>frontGrid(k,role,look||{},fr)),
 coin:k=>cv('c'+k,()=>coinGrid(k))};
})();
