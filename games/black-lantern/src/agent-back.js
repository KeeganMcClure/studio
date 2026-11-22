// Black Lantern · agent-back.js · agents in battle, seen from behind, waist up (spec 006 part B, B3; Nov 22, 2026).
// Built from each agent's creator parts (skin, hair style and color, outfit and its color), so every custom agent
// looks like themselves. Drawn the Asset Library's battle way: 1 px pixels, light from the upper left, a light rim on
// lit edges and a dark outline on every edge (the same finish as the Demo 5 enemy drafts). Exposes window.BLB.
// BLB.back(agent, o) -> canvas 34 × 44. o: {lantern: the lead holds the lantern, downed: slumped and grey}.
const BLB=(()=>{
const {SKIN,HAIRC,OUTC,profOf,PROFS}=window.BL;
const OL='#120c1c';
const sh=(h,a)=>{const n=parseInt(h.slice(1),16),f=v=>Math.max(0,Math.min(255,Math.round(v+a)));return'#'+[n>>16,n>>8&255,n&255].map(v=>f(v).toString(16).padStart(2,'0')).join('')};
const grey=h=>{const n=parseInt(h.slice(1),16),v=Math.round(((n>>16)*.3+(n>>8&255)*.5+(n&255)*.2)*.7);return'#'+[v,v,v+12].map(x=>Math.min(255,x).toString(16).padStart(2,'0')).join('')};
function Ly(w,h){const d=new Array(w*h).fill(null);const L={w,h,d,
 g:(x,y)=>(x<0||y<0||x>=w||y>=h)?null:d[y*w+x],
 p(x,y,c){x=Math.round(x);y=Math.round(y);if(x>=0&&y>=0&&x<w&&y<h)d[y*w+x]=c},
 r(x,y,a,b,c){for(let j=0;j<b;j++)for(let i=0;i<a;i++)L.p(x+i,y+j,c)},
 e(cx,cy,rx,ry,c){for(let y=Math.floor(cy-ry);y<=cy+ry;y++)for(let x=Math.floor(cx-rx);x<=cx+rx;x++){const a=(x+.5-cx)/rx,b=(y+.5-cy)/ry;if(a*a+b*b<=1)L.p(x,y,c)}}};return L}
function finish(L){const{w,h,d}=L,o=d.slice();for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x,v=d[i];
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
 const L=Ly(34,44),top=T.top,td=sh(top,-34),hair=L0.hair|0;
 // arms and torso, the right side in shade (light from the upper left)
 L.r(1,22,5,22,sh(top,-12));L.r(28,22,5,22,td);
 L.e(17,30,13,10,top);L.r(4,30,26,14,top);L.r(23,24,7,20,td);
 if(T.under)L.r(10,20,14,6,T.under);
 if(T.straps){L.r(9,21,3,23,T.straps);L.r(22,21,3,23,T.straps)}
 if(T.belt)L.r(4,40,26,2,T.belt);
 // neck, ears, head (seen from behind, so mostly hair)
 L.r(14,15,6,7,sh(sk,-28));L.r(14,15,3,7,sh(sk,-14));
 L.e(8,10,2,3,sh(sk,-10));L.e(26,10,2,3,sh(sk,-30));
 L.e(17,9,8,9,sk);L.r(20,2,5,15,sh(sk,-18));
 const hd=sh(hc,-30);
 if(hair===0){L.e(17,8,8.5,8,hc);L.r(9,8,17,6,hc);L.r(20,2,6,12,hd)}                                  // short
 else if(hair===1){L.e(17,8,9,8.5,hc);L.r(8,8,19,18,hc);L.r(21,4,6,22,hd);L.r(10,24,15,2,hd)}             // long
 else if(hair===2){L.e(17,8,8,7.5,sh(hc,12));for(let y=2;y<15;y++)for(let x=9;x<26;x++)if((x+y)%3===0&&L.g(x,y))L.p(x,y,sk)}  // buzz
 else if(hair===3){L.p(11,4,sh(sk,40));L.p(12,3,sh(sk,40));L.p(13,3,sh(sk,30))}                          // bald
 else if(hair===4){L.e(17,8,8.5,8,hc);L.r(20,2,6,12,hd);L.e(17,-1,4,3.5,hc);L.r(15,2,5,1,hd)}            // bun
 else if(hair===5){L.r(14,-1,6,16,hc);L.r(17,-1,3,16,hd)}                                                 // mohawk
 else {for(const [x,y] of [[10,5],[14,1],[20,1],[24,5],[9,10],[25,10],[12,13],[22,13],[17,6]])L.e(x,y+2,4,4,(x>17?hd:hc))}  // curly
 if(T.collar){L.r(11,19,12,3,T.collar);L.r(19,19,4,3,sh(T.collar,-30))}
 if(T.hood){L.e(17,21,10,3.5,sh(top,-22));L.r(12,21,10,2,sh(top,-40))}
 if(T.hat){L.e(17,4,11,3,T.hat);L.e(17,1,6,3,sh(T.hat,12))}
 // the lead holds the lantern up and out to the left (the approved combat mockup)
 if(o.lantern){L.r(0,20,4,6,sh(top,-12));L.r(-1,14,1,1,'#3a2a1a');L.r(-2,15,4,1,'#3a2a1a')}
 const out=finish(L);c=document.createElement('canvas');c.width=34+8;c.height=44+8;const x=c.getContext('2d');
 const dx=8,dy=8;  // room for the lantern and the bun above the head
 for(let i=0;i<out.length;i++)if(out[i]){x.fillStyle=o.downed?grey(out[i]):out[i];x.fillRect(dx+i%34,dy+(i/34|0),1,1)}
 if(o.lantern&&!o.downed){x.fillStyle='rgba(244,201,106,.18)';x.fillRect(0,14,14,16);x.fillStyle='#3a2a1a';x.fillRect(2,18,6,1);x.fillRect(2,19,1,7);x.fillRect(7,19,1,7);x.fillRect(2,26,6,1);
  x.fillStyle='#f4c96a';x.fillRect(3,19,4,7);x.fillStyle='#fff1c4';x.fillRect(4,21,2,3)}
 cache.set(k,c);return c}
return{back,W:42,H:52,AX:25,AY:52};  // AX: the body's centre in the canvas; AY: its foot (the waist)
})();
