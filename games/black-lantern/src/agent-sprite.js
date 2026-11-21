// Black Lantern · agent-sprite.js · agent world sprites (Art build pass 4, Nov 21, 2026). Exposes window.BLA.
// Agents walk the map on the Shared Shelf's person template (shared-sprites-person-v1, drawn with shared-sprites-method-v1),
// painted in Black Lantern's palette. This file only turns an agent's creator choices into the template's spec,
// and adds what the template doesn't have: Bald, Mohawk and Curly hair, the creator's Extras, and each profession's outfit.
// Size: Wide scale, about 14 x 26 px on 16 px tiles (design grid 28 x 50 drawn at s = 0.5). No light rim on the map (method: s < 1).
// Map faces stay simple: the creator's Eyes choice and Storybook detail live in portraits, not here.
// BLA.sprite(agent, dir, frame, idle, lantern) -> {c: canvas, ax, ay}: ax, ay = the feet. dir: up | down | left | right.
// frame: 0 stand, 1 and 2 walk. idle 1 = blink. lantern: true at night for the lead (Bible, Art, Maps).
const BLA=(()=>{
const K=SHELF;K.use(K.PALETTES.blacklantern);
const {SKIN,HAIRC,OUTC,profOf,PROFS}=window.BL;
const DK=K.pal().outline,shade=K.shade;
// hair: creator index -> style. The template draws every head bald (its cropped cap in skin tone, a scalp);
// this file draws all hair itself (redrawn Nov 21: the template's v1 hair read as a flat helmet at map size).
const HAIR=['short','long','cropped','bald','bun','mohawk','curly'];
const mix=(a,b,t)=>{const A=K.RGB(a),B=K.RGB(b);return K.hex(A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t,A[2]+(B[2]-A[2])*t)};

// ---------- OUTFITS: one per profession outfit, in the creator's Outfit color (Issue = the profession's own) ----------
const OUTFIT={
 suit:(oc)=>({top:oc,coat:1,inner:'#ece8de',pants:shade(oc,-.3),shoes:'#1d1414',body:(A,ty)=>{A.R(13,ty,2,8,'#8c2f39')}}),
 labcoat:(oc)=>({top:'#e6e6ea',coat:1,inner:oc,pants:'#3a3446',shoes:'#2a1e18',body:(A,ty)=>{A.R(18,ty+6,2,2,'#2d6ad1')}}),
 tactical:(oc)=>({top:oc,inner:shade(oc,-.35),pants:shade(oc,-.15),shoes:'#1d1d1f',body:(A,ty)=>{A.R(8,ty,2,12,'#1d1d1f');A.R(18,ty,2,12,'#1d1d1f');A.R(6,ty+12,16,2,'#1d1d1f')}}),
 cardigan:(oc)=>({top:oc,coat:1,inner:'#e8dcc0',pants:'#4a4038',shoes:'#3a281e'}),
 hoodie:(oc)=>({top:oc,pants:'#2f3a52',shoes:'#d8d2c2',body:(A,ty)=>{A.R(9,ty,10,2,shade(oc,-.3));A.R(11,ty+2,1,5,'#ddd');A.R(16,ty+2,1,5,'#ddd');A.R(9,ty+10,10,4,shade(oc,-.2))}}),
 uniform:(oc)=>({top:oc,pants:oc,shoes:'#141014',body:(A,ty)=>{A.R(13,ty,2,16,shade(oc,-.3));A.R(16,ty+3,3,3,'#f2c94c');A.R(6,ty+13,16,2,'#141014')}}),
 clerical:(oc)=>({top:oc,coat:1,pants:shade(oc,-.1),shoes:'#141014',body:(A,ty)=>{A.R(12,ty,4,2,'#f4f4f4')}}),
 ranger:(oc)=>({top:oc,pants:'#4a4a32',shoes:'#3a281e',body:(A,ty)=>{A.R(16,ty+3,3,3,'#f2c94c');A.R(8,ty+3,3,3,'#3e5c3a');A.R(6,ty+13,16,2,'#3a281e')}}),
 scrubs:(oc)=>({top:oc,pants:oc,shoes:'#e6e6ea',body:(A,ty)=>{A.R(12,ty,4,2,A.meta.sk);A.R(17,ty+5,3,1,shade(oc,-.3))}}),
 mail:(oc)=>({top:oc,pants:shade(oc,-.4),shoes:'#141014',body:(A,ty)=>{for(let i=0;i<7;i++)A.R(7+i*2,ty+i*2,2,2,'#5a3e2b');A.R(17,ty+12,5,4,'#5a3e2b');A.R(16,ty+3,2,2,'#c0392b')}}),
 janitor:(oc)=>({top:oc,pants:'#3b5b8a',shoes:'#2a1e18',body:(A,ty)=>{A.R(8,ty+5,12,11,'#3b5b8a');A.R(9,ty,2,5,'#3b5b8a');A.R(17,ty,2,5,'#3b5b8a');A.R(13,ty+8,2,2,'#f2c94c')}}),
 apron:(oc)=>({top:oc,pants:'#3a3446',shoes:'#2a1e18',body:(A,ty)=>{A.R(9,ty+3,10,13,'#f4f1e8');A.R(9,ty+3,10,1,'#e86a92');A.R(9,ty+9,10,1,'#7fd6e6')}})
};
function outfitColor(a){const p=profOf(a)||PROFS[0],L=a.look;if(L.outfitC>=0)return OUTC[L.outfitC];if(p.outfit==='clerical')return'#1d1b22';return OUTC[p.color]}

// ---------- SPEC: an agent's creator choices as the template's character spec ----------
function spec(a,dir){
 const L=a.look,p=profOf(a)||PROFS[0],sk=SKIN[L.skin],hc=HAIRC[L.hairC],st=HAIR[L.hair]||'short';
 const o=(OUTFIT[p.outfit]||OUTFIT.suit)(outfitColor(a));
 return Object.assign({},o,{skin:sk,hair:sk,hairStyle:'cropped',iris:'#3a2418',
  body:o.body?(A,ty,sw)=>{A.meta.sk=sk;o.body(A,ty,sw)}:null});
}

// ---------- EXTRAS: hair the template lacks, and the creator's Extras. Drawn after the body, before the outline. ----------
function extras(A,a,dir,fr){
 const{R,C}=A,L=a.look,st=HAIR[L.hair],hc=HAIRC[L.hairC],hd=shade(hc,-.35),sk=SKIN[L.skin],b=(fr===1||fr===2)?-1:0,side=dir==='left'||dir==='right';
 // softer face shadow facing down: one thin shaded edge instead of a wide band down the cheek
 if(dir==='down'){R(20,4+b,3,17,sk);R(22,6+b,1,13,shade(sk,-.18))}
 // hair: rounded crown, a parted fringe, matching sideburns both sides (right side one step darker)
 const crown=(c,cd,low)=>{ // c = color, low = how far the back reaches (up view)
  if(dir==='down'){R(7,0+b,14,2,c);R(5,2+b,18,5,c,{sh:3});R(5,7+b,8,2,c);R(16,7+b,6,2,cd);R(4,6+b,2,6,c);R(22,6+b,2,6,cd)}
  else if(dir==='up'){R(7,0+b,14,2,c);R(4,2+b,20,low,c,{sh:4});R(5,2+low+b,18,2,cd)}
  else{R(9,0+b,11,2,c);R(6,2+b,18,5,c,{sh:3});R(5,6+b,6,2,c);R(17,7+b,7,low-5,cd);R(15,7+b,2,3,c)}
 };
 if(st==='short'||st==='bun'||st==='curly')crown(hc,hd,12);
 if(st==='cropped'){const bz=mix(hc,sk,.35);crown(bz,shade(bz,-.25),10)}
 if(st==='long'){
  if(dir==='down'){crown(hc,hd,12);R(3,7+b,3,18,hc);R(22,7+b,3,18,hd);R(4,25+b,2,1,hc);R(22,25+b,2,1,hd)}
  else if(dir==='up'){R(7,0+b,14,2,hc);R(3,2+b,22,22,hc,{sh:4});R(4,24+b,9,2,hc);R(15,24+b,9,2,hd)}
  else{crown(hc,hd,12);R(14,7+b,10,18,hd);R(15,25+b,7,1,hd)}
 }
 if(st==='bald'||st==='mohawk'){ // fringe low around the back and sides
  if(dir==='down'){R(4,8+b,2,5,hc);R(22,8+b,2,5,hd)}
  else if(dir==='up')R(5,12+b,18,4,hc,{sh:3});
  else R(17,9+b,6,6,hc,{sh:2});
 }
 if(st==='mohawk'){
  if(dir==='down')R(12,-3+b,4,9,hc,{sh:1});
  else if(dir==='up')R(12,-3+b,4,15,hc,{sh:1});
  else R(9,-3+b,13,5,hc,{sh:3});
 }
 if(st==='bun'){if(dir==='up')R(9,-3+b,10,6,hc,{sh:3});else if(side)R(17,-2+b,7,7,hc,{sh:2})}
 if(st==='curly'){
  if(dir==='down'){C(8,3+b,4,hc);C(14,1+b,5,hc);C(20,3+b,4,hc);C(5,8+b,2.6,hc);C(23,8+b,2.6,hd)}
  else if(dir==='up'){C(8,4+b,5,hc);C(14,2+b,5,hc);C(20,4+b,5,hc);C(8,11+b,5,hc);C(20,11+b,5,hd);C(14,13+b,5,hc)}
  else{C(11,2+b,5,hc);C(17,3+b,5,hc);C(20,9+b,5,hd);C(16,13+b,4,hc)}
 }
 // extras: 1 glasses (small map frames; the template's storybook glasses are portrait-sized), 2 shades, 3 beard, 4 scar, 5 earpiece, 6 eyepatch
 const x=L.acc,FR='#2a2030',LENS='#bfe3ff';
 if(x===1){if(dir==='down'){for(const gx of[7,15]){R(gx,10+b,6,6,FR);R(gx+1,11+b,4,4,LENS);R(gx+2,12+b,2,2,DK)}R(13,12+b,2,1,FR)}else if(side){R(5,10+b,6,6,FR);R(6,11+b,4,4,LENS);R(6,12+b,2,2,DK);R(11,12+b,5,1,FR)}}
 if(x===2){if(dir==='down'){R(7,11+b,6,4,DK);R(15,11+b,6,4,DK);R(13,12+b,2,1,DK)}else if(side)R(6,11+b,5,4,DK)}
 if(x===3){if(dir==='down'){R(6,15+b,16,6,hc,{sh:3});R(12,17+b,4,1,shade(hc,-.5))}else if(side)R(5,15+b,10,6,hc,{sh:2});else{R(5,17+b,2,4,hc);R(21,17+b,2,4,hd)}}
 if(x===4){if(dir==='down')R(18,9+b,1,7,'#c0566b');else if(side)R(9,9+b,1,7,'#c0566b')}
 if(x===5){if(dir==='down'){R(22,12+b,2,3,'#9aa0a6');R(23,15+b,1,6,'#6d737a')}else if(dir==='up'){R(4,12+b,2,3,'#9aa0a6');R(4,15+b,1,6,'#6d737a')}else{R(15,12+b,2,3,'#9aa0a6');R(16,15+b,1,6,'#6d737a')}}
 if(x===6){if(dir==='down'){R(4,9+b,20,1,DK);R(15,10+b,6,5,DK)}else if(dir==='up')R(4,9+b,20,1,DK);else{R(6,9+b,17,1,DK);R(6,10+b,4,5,DK)}}
}

// ---------- SPRITE: drawn once per pose, then reused ----------
const cache=new Map();
function flip(v){const c=K.mk(v.c.width,v.c.height),g=c.getContext('2d');g.translate(c.width,0);g.scale(-1,1);g.drawImage(v.c,0,0);return{c,ax:c.width-v.ax,ay:v.ay}}
function sprite(a,dir,fr=0,idle=0,lantern=false){
 const k=JSON.stringify([a.prof,a.look])+dir+fr+idle+(lantern?1:0);let v=cache.get(k);if(v)return v;
 if(dir==='right'){v=flip(sprite(a,'left',fr,idle,lantern))}
 else{
  const d=dir==='left'?'side':dir,sp=spec(a,dir);if(lantern)sp.lantern=1;
  const art=K.art(40,76,6,18,K.S,A=>{K.drawChar(A,sp,d,fr,idle);extras(A,a,dir,fr)});
  v={c:art.c,ax:art.sx(14),ay:art.sy(50)};
 }
 if(cache.size>400)cache.clear();cache.set(k,v);return v;
}
// draw(ctx, agent, x, y, ...): stands the sprite with its feet at (x, y), over a soft ground shadow.
function draw(ctx,a,x,y,dir,fr,idle,lantern){
 const v=sprite(a,dir,fr,idle,lantern);ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(Math.round(x-5),Math.round(y-1),10,2);
 ctx.drawImage(v.c,Math.round(x-v.ax),Math.round(y-v.ay));
}
return{HAIR,OUTFIT,spec,extras,sprite,draw};
})();
