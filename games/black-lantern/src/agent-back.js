// Black Lantern · agent-back.js · agents in battle, seen from behind, waist up (spec 006 part B, B3; Nov 22, 2026).
// Built from each agent's creator parts (skin, hair style and color, outfit and its color), so every custom agent
// looks like themselves. Drawn the Asset Library's battle way: 1 px pixels, light from the upper left, a light rim on
// lit edges and a dark outline on every edge (the same finish as the Demo 5 enemy drafts). Exposes window.BLB.
// BLB.back(agent, o) -> canvas 34 × 44. o: {lantern: the lead holds the lantern, downed: slumped and grey}.
// Build (Agent creator, Pronouns and body; Nov 23): broad is the body as first drawn; slim (look.build) brings the
// shoulders, arms and waist in 3 px a side (n below). The head and hair stay the same.
const BLB=(()=>{
const {SKIN,HAIRC,OUTC,profOf,PROFS}=window.BL;
const OL='#120c1c';
const sh=(h,a)=>{const n=parseInt(h.slice(1),16),f=v=>Math.max(0,Math.min(255,Math.round(v+a)));return'#'+[n>>16,n>>8&255,n&255].map(v=>f(v).toString(16).padStart(2,'0')).join('')};
const grey=h=>{const n=parseInt(h.slice(1),16),v=Math.round(((n>>16)*.3+(n>>8&255)*.5+(n&255)*.2)*.7);return'#'+[v,v,v+12].map(x=>Math.min(255,x).toString(16).padStart(2,'0')).join('')};
// T0: rows of headroom above y=0, so the bun and the mohawk's crest aren't cut flat
const T0=6;
function Ly(w,h){const d=new Array(w*(h+T0)).fill(null);const L={w,h,d,
 g:(x,y)=>(x<0||y<-T0||x>=w||y>=h)?null:d[(y+T0)*w+x],
 p(x,y,c){x=Math.round(x);y=Math.round(y);if(x>=0&&y>=-T0&&x<w&&y<h)d[(y+T0)*w+x]=c},
 r(x,y,a,b,c){for(let j=0;j<b;j++)for(let i=0;i<a;i++)L.p(x+i,y+j,c)},
 e(cx,cy,rx,ry,c){for(let y=Math.floor(cy-ry);y<=cy+ry;y++)for(let x=Math.floor(cx-rx);x<=cx+rx;x++){const a=(x+.5-cx)/rx,b=(y+.5-cy)/ry;if(a*a+b*b<=1)L.p(x,y,c)}}};return L}
function finish(L){const{w,h,d}=L,o=d.slice();for(let y=-T0;y<h;y++)for(let x=0;x<w;x++){const i=(y+T0)*w+x,v=d[i];
 if(v){if((x>0&&!L.g(x-1,y))||(y>0&&!L.g(x,y-1)))o[i]=sh(v,34)}
 else if(L.g(x-1,y)||L.g(x+1,y)||L.g(x,y-1)||L.g(x,y+1))o[i]=OL}return o}
function outfitColor(a){const p=profOf(a)||PROFS[0],L=a.look||{};if(L.outfitC>=0)return OUTC[L.outfitC];if(p.outfit==='clerical')return'#1d1b22';return OUTC[p.color]}
// outfit backs: the top's color and what shows from behind (collars, straps, hoods)
const TOP={
 suit:oc=>({top:oc,collar:'#ece8de'}), cardigan:oc=>({top:oc,collar:'#e8dcc0'}), labcoat:oc=>({top:'#e6e6ea',collar:oc}),
 tactical:oc=>({top:oc,straps:'#1d1d1f'}), hoodie:oc=>({top:oc,hood:1}), uniform:oc=>({top:oc,belt:'#141014'}),
 clerical:oc=>({top:oc,collar:'#f4f4f4'}), ranger:oc=>({top:oc,hat:'#6a5a3a'}), scrubs:oc=>({top:oc}),
 mail:oc=>({top:oc,straps:'#5a3e2b'}), janitor:oc=>({top:'#3b5b8a',straps:'#3b5b8a',under:oc})
};
const cache=new Map();
function back(a,o={}){
 const L0=a.look||{},k=JSON.stringify([a.prof,L0,!!o.lantern,!!o.downed]);let c=cache.get(k);if(c)return c;
 const p=profOf(a)||PROFS[0],sk=SKIN[L0.skin|0]||SKIN[1],hc=HAIRC[L0.hairC|0]||HAIRC[0],oc=outfitColor(a),T=(TOP[p.outfit]||TOP.scrubs)(oc);
 const L=Ly(34,44),top=T.top,td=sh(top,-34),hair=L0.hair|0,n=L0.build==='slim'?3:0;
 // arms and torso, the right side in shade (light from the upper left)
 L.r(1+n,22,5,22,sh(top,-12));L.r(28-n,22,5,22,td);
 L.e(17,30,13-n,10,top);L.r(4+n,30,26-2*n,14,top);L.r(23-n,24,7,20,td);
 if(T.under)L.r(10,20,14,6,T.under);
 if(T.straps){L.r(9+(n?1:0),21,3,23,T.straps);L.r(22-(n?1:0),21,3,23,T.straps)}
 if(T.belt)L.r(4+n,40,26-2*n,2,T.belt);
 // neck, ears, head (seen from behind, so mostly hair)
 L.r(14,15,6,7,sh(sk,-28));L.r(14,15,3,7,sh(sk,-14));
 L.e(8,10,2,3,sh(sk,-10));L.e(26,10,2,3,sh(sk,-30));
 // the skull is round from behind: shading is a crescent on the lower right (inside the shape, never a box),
 // so no style squares off the top or back of the head (Nov 23 playtest)
 const inE=(cx,cy,rx,ry)=>(x,y)=>{const a=(x+.5-cx)/rx,b=(y+.5-cy)/ry;return a*a+b*b<=1};
 const shade=(from,to,lit)=>{for(let y=-T0;y<44;y++)for(let x=0;x<34;x++)if(L.g(x,y)===from&&!lit(x,y))L.p(x,y,to)};
 const skull=inE(17,9,8.5,9),lit=inE(14.5,7,8.5,9.5);
 L.e(17,9,8.5,9,sk);L.e(17,13,7,5,sk);shade(sk,sh(sk,-18),lit);
 const hd=sh(hc,-30);
 if(hair===0){L.e(17,8.5,9,8.5,hc);L.e(17,11.5,8.5,5,hc);shade(hc,hd,lit)}                                 // short
 else if(hair===1){L.e(17,8.5,9.5,9,hc);L.r(8,9,19,14,hc);L.e(17,22,9.5,4,hc);                            // long
  shade(hc,hd,inE(14,11,9,17));for(let x=10;x<25;x++)if(L.g(x,25))L.p(x,25,sh(hc,-44))}
 else if(hair===2){L.e(17,8.5,8.5,8.5,sh(hc,12));shade(sh(hc,12),sh(hc,-10),lit);                         // buzz
  for(let y=0;y<18;y++)for(let x=9;x<26;x++)if((x+y)%3===0&&L.g(x,y)&&skull(x,y))L.p(x,y,lit(x,y)?sk:sh(sk,-18))}
 else if(hair===3){L.p(11,4,sh(sk,40));L.p(12,3,sh(sk,40));L.p(13,3,sh(sk,30));L.p(11,5,sh(sk,24))}        // bald
 else if(hair===4){L.e(17,8.5,9,8.5,hc);L.e(17,11.5,8.5,5,hc);L.e(17,-1,4,3.5,hc);shade(hc,hd,lit);       // bun
  L.r(14,2,7,1,sh(hc,-44))}
 else if(hair===5){const band=(x,y)=>x>=14&&x<20&&inE(17,8.5,9,10)(x,y);                                  // mohawk
  for(let y=-2;y<18;y++)for(let x=13;x<21;x++)if(band(x,y))L.p(x,y,x<17?hc:hd)}
 else {for(const [x,y] of [[10,5],[14,1],[20,1],[24,5],[9,10],[25,10],[12,13],[22,13],[17,6]])L.e(x,y+2,4,4,hc);  // curly
  shade(hc,hd,inE(14,7,10,10.5))}
 if(T.collar){L.r(11,19,12,3,T.collar);L.r(19,19,4,3,sh(T.collar,-30))}
 if(T.hood){L.e(17,21,10,3.5,sh(top,-22));L.r(12,21,10,2,sh(top,-40))}
 if(T.hat){L.e(17,4,11,3,T.hat);L.e(17,1,6,3,sh(T.hat,12))}
 // the lead holds the lantern up and out to the left (the approved combat mockup)
 if(o.lantern){L.r(n,20,4,6,sh(top,-12));L.r(n-1,14,1,1,'#3a2a1a');L.r(n-2,15,4,1,'#3a2a1a')}
 const out=finish(L);c=document.createElement('canvas');c.width=34+8;c.height=44+8;const x=c.getContext('2d');
 const dx=8,dy=8;  // room for the lantern and the bun above the head
 for(let i=0;i<out.length;i++)if(out[i]){x.fillStyle=o.downed?grey(out[i]):out[i];x.fillRect(dx+i%34,dy-T0+(i/34|0),1,1)}
 if(o.lantern&&!o.downed){x.translate(n,0);x.fillStyle='rgba(244,201,106,.18)';x.fillRect(0,14,14,16);x.fillStyle='#3a2a1a';x.fillRect(2,18,6,1);x.fillRect(2,19,1,7);x.fillRect(7,19,1,7);x.fillRect(2,26,6,1);
  x.fillStyle='#f4c96a';x.fillRect(3,19,4,7);x.fillStyle='#fff1c4';x.fillRect(4,21,2,3);x.setTransform(1,0,0,1,0,0)}
 cache.set(k,c);return c}
return{back,W:42,H:52,AX:25,AY:52};  // AX: the body's centre in the canvas; AY: its foot (the waist)
})();
