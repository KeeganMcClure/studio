// Rushlight · species-art.js
// The six slice species, drawn in code: the 64 × 64 portrait head, the 14 × 26 map sprite and the 30 × 40 battle back view.
// The drawing is the approved species sheet (Asset Library rushlight-sprites-species-v1; code in mockups/29-species-sheet-rough-v3.html),
// lifted unchanged apart from three hooks for the face parts (spec 003, 6; bible Art, Faces): coat shade (3 per species),
// a mark (none, scar, torn ear, grey muzzle) and neckwear (none, kerchief, hood). Exposes window.RLSP.
//   RLSP.ORDER                     the six species
//   RLSP.SP[k]                     the sheet's colours and height for species k
//   RLSP.portrait(k, look, s)      a canvas, 64 × 64 × s      look: {shade 0..2 (1 = the sheet's coat), mark 0..3, neck 0..2}
//   RLSP.map(k, look) / back(k, look)   canvases at 1×
//   RLSP.coin(k, look)             the company's coin token, 15 × 16 (Mockup 5, option C)
(function(){
const PEAT='#1c1814',SOOT='#2c2621',BONE='#e6dcc4',MOSS='#56623a',MOSSD='#434d2c',RUST='#9a4528',RUSTD='#76331d',DUSK='#3b4757';
const SP={
 mouse:   {name:'MOUSE',   h:18, fur:'#9a8468', furD:'#77634c', pale:'#d6c6a4', ear:'#c79a8a', nose:'#b06e6a', coat:MOSS, coatD:MOSSD, size:'small · 18 px'},
 rat:     {name:'RAT',     h:18, fur:'#857b72', furD:'#655c55', pale:'#b3aa98', ear:'#b48a7a', nose:'#c48a86', coat:'#6a4a32', coatD:'#52382a', size:'small · 18 px'},
 hare:    {name:'HARE',    h:22, fur:'#8a6a44', furD:'#6a5032', pale:'#d6c6a4', ear:'#a88660', nose:'#5a3e2c', coat:MOSS, coatD:MOSSD, size:'middle · 22 px'},
 hedgehog:{name:'HEDGEHOG',h:22, fur:'#b89c76', furD:'#957a58', pale:'#e0d0b0', ear:'#957a58', nose:PEAT, spine:'#6a5236', spineL:'#b39a72', coat:DUSK, coatD:'#2e3846', size:'middle · 22 px'},
 badger:  {name:'BADGER',  h:26, fur:'#7a766e', furD:'#5c5952', pale:BONE, ear:'#7a766e', nose:PEAT, coat:RUST, coatD:RUSTD, size:'tall · 26 px'},
 fox:     {name:'FOX',     h:26, fur:'#b8582a', furD:'#8e3f1e', pale:BONE, ear:'#b8582a', nose:PEAT, coat:'#7a766e', coatD:'#5c5952', size:'tall · 26 px'},
};
const ORDER=['mouse','rat','hare','hedgehog','badger','fox'];

// pixel grid with an automatic Peat outline
function grid(w,h){const g=[];for(let y=0;y<h;y++)g.push(Array(w).fill(null));return{w,h,g,
 p(x,y,c){x=Math.round(x);y=Math.round(y);if(x>=0&&y>=0&&x<w&&y<h)this.g[y][x]=c},
 r(x,y,ww,hh,c){for(let j=0;j<hh;j++)for(let i=0;i<ww;i++)this.p(x+i,y+j,c)},
 ell(cx,cy,rx,ry,c,shade){for(let y=Math.floor(cy-ry);y<=cy+ry;y++)for(let x=Math.floor(cx-rx);x<=cx+rx;x++){const d=((x+.5-cx)/rx)**2+((y+.5-cy)/ry)**2;if(d<=1)this.p(x,y,shade&&(x+.5-cx)>rx*shade.k?shade.c:c)}},
 tri(pts,c){const [a,b,d]=pts;const minx=Math.floor(Math.min(a[0],b[0],d[0])),maxx=Math.ceil(Math.max(a[0],b[0],d[0])),miny=Math.floor(Math.min(a[1],b[1],d[1])),maxy=Math.ceil(Math.max(a[1],b[1],d[1]));
  const s=(p,q,r)=>(p[0]-r[0])*(q[1]-r[1])-(q[0]-r[0])*(p[1]-r[1]);
  for(let y=miny;y<=maxy;y++)for(let x=minx;x<=maxx;x++){const P=[x+.5,y+.5];const d1=s(P,a,b),d2=s(P,b,d),d3=s(P,d,a);if(!((d1<0||d2<0||d3<0)&&(d1>0||d2>0||d3>0)))this.p(x,y,c)}},
 outline(){const o=[];for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(!this.g[y][x]){if([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>{const v=this.g[y+dy]&&this.g[y+dy][x+dx];return v&&v!==PEAT}))o.push([x,y])}o.forEach(([x,y])=>this.g[y][x]=PEAT);return this},
 draw(ctx,ox,oy,s){for(let y=0;y<h;y++)for(let x=0;x<w;x++){const c=this.g[y][x];if(c){ctx.fillStyle=c;ctx.fillRect(ox+x*s,oy+y*s,s,s)}}}
}}

// map sprite: 14 x 26 frame, facing down, feet on the bottom row
function mapSprite(k,look){
 const S=skin(k,look),G=grid(14,26),H=S.h,small=H===18,tall=H===26;
 const legH=small?3:tall?4:3, bodyH=small?6:tall?10:8, headH=small?6:tall?7:6;
 const legY=26-legH, bodyY=legY-bodyH, headY=bodyY-headH;
 if(k==='mouse'||k==='rat'){for(let i=0;i<4;i++)G.p(11+(i>1?1:0),bodyY+bodyH-1+i-(i>2?1:0),S.ear)}
 if(k==='fox'){G.r(10,bodyY+bodyH-3,3,4,S.fur);G.r(11,bodyY+bodyH,2,2,BONE)}
 G.r(4,legY,2,legH,'#3a3028');G.r(8,legY,2,legH,'#3a3028');G.r(4,legY+legH-1,2,1,'#2a221c');G.r(8,legY+legH-1,2,1,'#2a221c');
 G.r(3,bodyY,8,bodyH,S.coat);G.r(9,bodyY,2,bodyH,S.coatD);
 G.r(2,bodyY+1,1,bodyH-2,S.coat);G.r(11,bodyY+1,1,bodyH-2,S.coatD);
 G.p(2,bodyY+bodyH-1,S.fur);G.p(11,bodyY+bodyH-1,S.furD);
 G.r(3,bodyY+Math.floor(bodyH/2),8,1,'#3a3028');
 if(k==='hedgehog')G.r(2,bodyY,10,2,S.spine);
 G.r(3,headY,8,headH,S.fur);G.r(9,headY,2,headH,S.furD);
 if(k==='mouse'){G.r(1,headY-3,4,4,S.fur);G.r(9,headY-3,4,4,S.furD);G.r(2,headY-2,2,2,S.ear);G.r(10,headY-2,2,2,S.ear)}
 if(k==='rat'){G.r(2,headY-2,3,3,S.ear);G.r(9,headY-2,3,3,S.ear)}
 if(k==='hare'){G.r(4,headY-6,2,6,S.fur);G.r(8,headY-6,2,6,S.furD);G.r(4,headY-6,2,1,PEAT);G.r(8,headY-6,2,1,PEAT);G.p(4,headY-4,S.ear);G.p(4,headY-3,S.ear)}
 if(k==='hedgehog'){G.r(2,headY-2,10,4,S.spine);for(let i=0;i<5;i++)G.p(3+i*2,headY-3,S.spine);for(let i=0;i<4;i++)G.p(4+i*2,headY-1,S.spineL);G.r(2,headY+2,1,3,S.spine);G.r(11,headY+2,1,3,S.spine)}
 if(k==='badger'){G.r(3,headY-1,2,2,S.fur);G.r(9,headY-1,2,2,S.fur);G.r(3,headY,8,headH,BONE);G.r(4,headY,2,headH-2,PEAT);G.r(8,headY,2,headH-2,PEAT);G.r(3,headY,1,headH,S.fur);G.r(10,headY,1,headH,S.furD)}
 if(k==='fox'){G.tri([[3,headY+1],[4,headY-3],[6,headY+1]],S.fur);G.tri([[8,headY+1],[10,headY-3],[11,headY+1]],S.furD);G.p(4,headY-2,PEAT);G.p(10,headY-2,PEAT);G.r(3,headY+headH-3,8,3,BONE);G.r(5,headY+headH-3,4,1,S.fur)}
 const ey=headY+(headH>6?3:2);
 if(k==='badger'){G.p(5,ey+1,PEAT);G.p(8,ey+1,PEAT)}else{G.p(5,ey,PEAT);G.p(8,ey,PEAT)}
 if(k==='mouse'||k==='rat'||k==='hare'){G.r(5,headY+headH-3,4,2,S.pale);G.p(6,headY+headH-3,S.nose);G.p(7,headY+headH-3,S.nose)}
 if(k==='hedgehog'){G.r(5,headY+headH-3,4,2,S.pale);G.r(6,headY+headH-2,2,1,PEAT)}
 if(k==='badger'||k==='fox'){G.r(6,headY+headH-2,2,1,PEAT)}
 return G.outline();
}

// battle back view, waist up: 30 x 40, smaller species drawn smaller
function backView(k,look){
 const S=skin(k,look),W=30,H=40,G=grid(W,H),scale={18:.78,22:.9,26:1}[S.h];
 const sh=Math.round(16*scale), headR=Math.round(8*scale+1), bw=Math.round(22*scale);
 const bx=Math.round((W-bw)/2), by=H-sh, cx=W/2, cy=by-headR+2;
 if(k==='mouse'||k==='rat'){for(let i=0;i<6;i++)G.p(bx+bw+1+(i>3?1:0),H-1-i,S.ear)}
 G.r(bx,by,bw,sh,S.coat);G.r(bx+bw-Math.round(bw*.3),by,Math.round(bw*.3),sh,S.coatD);
 G.r(bx-1,by+2,1,sh-2,S.coat);G.r(bx+bw,by+2,1,sh-2,S.coatD);
 G.r(bx+2,by+3,bw-4,1,'#3a3028');
 G.r(bx+Math.round(bw/2)-3,by+5,6,5,'#6a4a32');G.r(bx+Math.round(bw/2)-3,by+5,6,1,'#52382a');
 if(k==='mouse'){G.ell(cx-headR,cy-headR+3,4.5,4.5,S.fur);G.ell(cx+headR,cy-headR+3,4.5,4.5,S.furD)}
 if(k==='rat'){G.ell(cx-headR+2,cy-headR+2,3,3,S.ear);G.ell(cx+headR-2,cy-headR+2,3,3,S.ear)}
 if(k==='hare'){G.r(cx-4,cy-headR-11,3,13,S.fur);G.r(cx+1,cy-headR-11,3,13,S.furD);G.r(cx-4,cy-headR-11,3,2,PEAT);G.r(cx+1,cy-headR-11,3,2,PEAT)}
 if(k==='fox'){G.tri([[cx-headR,cy-2],[cx-headR+2,cy-headR-5],[cx-2,cy-headR+1]],PEAT);G.tri([[cx+2,cy-headR+1],[cx+headR-2,cy-headR-5],[cx+headR,cy-2]],PEAT)}
 if(k==='badger'){G.ell(cx-headR+2,cy-headR+3,2.5,2.5,S.fur);G.ell(cx+headR-2,cy-headR+3,2.5,2.5,S.fur)}
 G.ell(cx,cy,headR,headR,S.fur,{k:.3,c:S.furD});
 if(k==='badger')G.r(cx-2,cy-headR,4,headR*2-1,BONE);
 if(k==='hedgehog'){
  const R=headR+2,top=cy-R-1,bot=by+3;
  const inside=(x,y)=>{if(y<top||y>bot)return false;const jag=(x%2===0)?1:0;
   if(y<cy){return ((x+.5-cx)/R)**2+((y+.5-cy)/(R+jag))**2<=1}
   const hw=y<by?R-1+jag*.5:bw/2+1-(y-by)*2+jag;return Math.abs(x+.5-cx)<=hw};
  for(let y=top-1;y<=bot;y++)for(let x=0;x<W;x++)if(inside(x,y)){
   const edge=!inside(x-1,y)||!inside(x+1,y)||!inside(x,y-1);
   const streak=((x*2+Math.floor(y/2))%5===0);
   G.p(x,y,edge?'#3a2a1c':streak?S.spineL:((x+y)%4===0?'#56422c':S.spine))}
  G.r(bx,bot+1,bw,by+sh-bot-1,S.coat);G.r(bx+bw-Math.round(bw*.3),bot+1,Math.round(bw*.3),by+sh-bot-1,S.coatD);
 }
 return G.outline();
}

// portrait head: 64 x 64 on a Soot ground
function portrait(k,look){
 look=look||{};const S=skin(k,look),G=grid(64,64),F=grid(64,64),sh={c:S.furD,k:.35};
 const T={mouse:{cx:32,cy:35,rx:13,ry:12},rat:{cx:32,cy:33,rx:12,ry:12},hare:{cx:32,cy:37,rx:13,ry:12},hedgehog:{cx:32,cy:36,rx:13,ry:12},badger:{cx:32,cy:34,rx:14,ry:13},fox:{cx:32,cy:36,rx:13,ry:11}}[k];
 const {cx,cy,rx,ry}=T;
 // neck: fur from under the jaw down into the collar, shaded on the right like the head
 const nw={mouse:16,rat:16,hare:18,hedgehog:20,badger:24,fox:18}[k], ny=cy+ry-5;
 F.r(cx-nw/2,ny,nw,60-ny,S.fur);F.r(cx+nw/2-Math.round(nw*.3),ny,Math.round(nw*.3),60-ny,S.furD);
 const throat={mouse:S.pale,rat:S.pale,hare:S.pale,fox:BONE,badger:'#4a4741'}[k];
 if(throat)F.r(cx-Math.round(nw/4),ny+2,Math.round(nw/2),58-ny,throat);
 if(k==='hedgehog')F.r(cx-nw/2-2,ny,nw+4,6,S.spine);
 F.ell(32,64,26,13,S.coat,{c:S.coatD,k:.3});
 F.tri([[cx-9,51],[cx,58],[cx-1,51]],'#c4b99e');F.tri([[cx+1,51],[cx,58],[cx+9,51]],'#a89e86');
 if(k==='mouse'){F.ell(cx-13,cy-11,9,9,S.fur,sh);F.ell(cx+13,cy-11,9,9,S.furD);F.ell(cx-13,cy-11,5.5,5.5,S.ear);F.ell(cx+13,cy-11,5.5,5.5,'#a87e70')}
 if(k==='rat'){F.ell(cx-11,cy-11,5.5,6,S.ear);F.ell(cx+11,cy-11,5.5,6,'#9a7466')}
 if(k==='hare'){F.ell(cx-7,cy-22,4.5,15,S.fur);F.ell(cx+7,cy-22,4.5,15,S.furD);F.ell(cx-7,cy-20,2,11,S.ear);F.ell(cx-7,cy-35,3.5,3,PEAT);F.ell(cx+7,cy-35,3.5,3,PEAT)}
 if(k==='badger'){F.ell(cx-12,cy-9,4,4,S.fur);F.ell(cx+12,cy-9,4,4,S.furD);F.r(cx-14,cy-13,4,1,BONE);F.r(cx+10,cy-13,4,1,BONE)}
 if(k==='fox'){F.tri([[cx-14,cy-1],[cx-11,cy-22],[cx-3,cy-9]],S.fur);F.tri([[cx+3,cy-9],[cx+11,cy-22],[cx+14,cy-1]],S.furD);F.tri([[cx-11,cy-5],[cx-10,cy-17],[cx-6,cy-9]],'#3a2a20');F.tri([[cx+6,cy-9],[cx+10,cy-17],[cx+11,cy-5]],'#3a2a20')}
 if(k==='hedgehog'){ // a dome of spines over the crown and down the sides; the face sits low and pointed
  for(let y=cy-ry-9;y<=cy+ry;y++)for(let x=cx-rx-7;x<=cx+rx+7;x++){const ang=Math.atan2(y-cy,x-cx),jag=(Math.round(ang*9)%2)?1.5:0;
   const d=((x+.5-cx)/(rx+5+jag))**2+((y+.5-(cy-3))/(ry+7+jag))**2;
   if(d<=1&&y<cy+ry-3)F.p(x,y,d>.84?'#3a2a1c':((x*3+y*2)%7===0?S.spineL:((x+2*y)%5===0?'#56422c':S.spine)))}
  F.ell(cx,cy+4,10,9,S.fur,sh);F.ell(cx,cy+1,7,4,S.pale,{c:S.fur,k:.5});F.ell(cx,cy+11,5,5,S.pale);
 } else F.ell(cx,cy,rx,ry,S.fur,sh);
 if(k==='rat')F.ell(cx,cy+9,7,8,S.fur,sh);
 if(k==='fox'){F.tri([[cx-8,cy+1],[cx,cy+14],[cx+8,cy+1]],S.fur);F.tri([[cx+1,cy+1],[cx,cy+14],[cx+8,cy+1]],S.furD);
  F.tri([[cx-13,cy+1],[cx-4,cy+5],[cx-2,cy+13]],BONE);F.tri([[cx+13,cy+1],[cx+4,cy+5],[cx+2,cy+13]],'#cfc5ad');F.ell(cx,cy+12,3,1.5,BONE)}
 if(k==='badger'){F.ell(cx,cy,rx,ry,BONE,{c:'#cfc5ad',k:.4});F.ell(cx,cy+9,6,6,BONE,{c:'#cfc5ad',k:.4});
  for(let y=cy-ry+1;y<=cy+9;y++){const t=(y-(cy-ry+1))/(ry+8),off=Math.round(7-t*4.5),w=Math.max(2,Math.round(5-t*2.5));
   F.r(cx-off-w,y,w,1,'#2a2420');F.r(cx+off,y,w,1,'#2a2420')}}
 if(k==='mouse')F.ell(cx,cy+6,6,5,S.pale,{c:'#bfae8c',k:.4});
 if(k==='rat')F.ell(cx,cy+11,5,5,S.pale,{c:'#9c9384',k:.4});
 if(k==='hare')F.ell(cx,cy+7,7,5,S.pale,{c:'#c0ae8c',k:.4});
 // eyes: small and dark, no glints (Art, Faces)
 const E={mouse:[cy-1,6],rat:[cy-1,6],hare:[cy-1,9],hedgehog:[cy+2,5],badger:[cy-2,6],fox:[cy-2,6]}[k];
 F.r(cx-E[1]-1,E[0],2,2,PEAT);F.r(cx+E[1]-1,E[0],2,2,PEAT);
 if(k==='fox'){F.p(cx-E[1]-2,E[0]+1,PEAT);F.p(cx+E[1]+1,E[0]+1,PEAT)}
 const N={mouse:[cy+4,S.nose],rat:[cy+10,S.nose],hare:[cy+5,S.nose],hedgehog:[cy+13,PEAT],badger:[cy+12,PEAT],fox:[cy+12,PEAT]}[k];
 F.r(cx-2,N[0],4,2,N[1]);F.r(cx-1,N[0]+2,2,1,'#3a2a20');F.r(cx-3,N[0]+3,2,1,'#3a2a20');F.r(cx+1,N[0]+3,2,1,'#3a2a20');
 if(k==='hare')F.r(cx-1,N[0]+2,2,2,'#3a2a20');
 if(k==='mouse'||k==='rat'){const y=N[0]+1;[0,2].forEach(d=>{for(let i=0;i<5;i++){F.p(cx-8-i,y+d-(i>2?1:0),'#cfc4ae');F.p(cx+7+i,y+d-(i>2?1:0),'#cfc4ae')}})}
 faceParts(F,k,look,S,cx,cy,rx,ry,E,N);
 F.outline();G.r(0,0,64,64,SOOT);
 return {draw(ctx,ox,oy,s){G.draw(ctx,ox,oy,s);F.draw(ctx,ox,oy,s)}};
}

// ---- face parts (spec 003, 6) ----
function mixHex(a,b,k){const A=parseInt(a.slice(1),16),Bb=parseInt(b.slice(1),16);const ch=s=>[s>>16,(s>>8)&255,s&255];const x=ch(A),y=ch(Bb);
 return '#'+x.map((v,i)=>Math.round(v+(y[i]-v)*k).toString(16).padStart(2,'0')).join('')}
// shade 0 lighter, 1 the sheet's coat, 2 darker: the same palette family, pulled toward Bone or Peat
function skin(k,look){const S0=SP[k],sh=look&&look.shade!=null?look.shade:1;const S=look&&look.coat?Object.assign({},S0,{coat:look.coat,coatD:mixHex(look.coat,PEAT,.3)}):S0;if(sh===1)return S;
 const to=sh===0?BONE:PEAT,amt=sh===0?.22:.28,o=Object.assign({},S);
 ['fur','furD','ear','spine','spineL'].forEach(c=>{if(o[c]&&o[c]!==PEAT&&o[c]!==BONE)o[c]=mixHex(o[c],to,amt)});return o}
function faceParts(F,k,look,S,cx,cy,rx,ry,E,N){
 const mark=look.mark|0,neck=look.neck|0;
 if(mark===1){for(let i=0;i<6;i++)F.p(cx+E[1]+2-i,E[0]-4+i+(i>3?1:0),'#d8c8b0');F.p(cx+E[1]-4,E[0]+3,'#d8c8b0')}  // scar across the brow and eye
 if(mark===2){const ex={mouse:[cx-13,cy-19],rat:[cx-11,cy-17],hare:[cx-7,cy-36],hedgehog:[cx-9,cy-ry-6],badger:[cx-12,cy-13],fox:[cx-11,cy-20]}[k];
  F.r(ex[0]-1,ex[1],3,3,null);F.p(ex[0]+2,ex[1]+3,null)}  // a torn ear: a notch bitten out of the left ear
 if(mark===3){F.ell(cx,N[0]+1,6,4,'#b8b2a6',{c:'#9c968a',k:.4});F.r(cx-2,N[0],4,2,N[1])}  // grey muzzle
 if(neck===1){F.tri([[cx-15,52],[cx,62],[cx+15,52]],RUST);F.tri([[cx,52],[cx,62],[cx+15,52]],RUSTD);F.r(cx-15,51,30,2,RUSTD)}  // kerchief
 if(neck===2){for(let y=cy-ry-2;y<64;y++)for(let x=cx-rx-6;x<=cx+rx+6;x++){const d=((x+.5-cx)/(rx+5))**2+((y+.5-cy)/(ry+6))**2;
   if(F.g[y]&&!F.g[y][x]&&(d<=1||y>cy+4))if(Math.abs(x+.5-cx)<=rx+5)F.p(x,y,x>cx+rx*.3?MOSSD:MOSS)}}  // a hood round the head, ears out
}
// the coin token: a brass coin a little from above, struck with the lead's head in Peat with its one strongest mark
function coinGrid(k){const G=grid(15,16),BR='#b8913a',BRL='#d9b45a',BRD='#7a5e24';
 G.ell(7.5,8.5,7,6.5,BRD);G.ell(7.5,7.5,7,6.5,BR,{c:BRD,k:.55});G.ell(7.5,7.5,5.5,5,BRL,{c:BR,k:.3});
 const P=PEAT,h=(x,y,w,hh)=>G.r(x,y,w,hh,P);
 h(5,6,5,4);h(6,10,3,1);
 if(k==='mouse'){G.ell(4.5,5,1.8,1.8,P);G.ell(10.5,5,1.8,1.8,P)}
 if(k==='rat'){h(4,4,2,2);h(9,4,2,2);h(7,10,1,2)}
 if(k==='hare'){h(5,1,2,5);h(8,1,2,5)}
 if(k==='hedgehog'){for(let i=0;i<5;i++)h(4+i,4-(i%2),1,2);h(4,5,7,1)}
 if(k==='badger'){h(5,4,2,2);h(8,4,2,2);G.r(7,5,1,5,BONE)}
 if(k==='fox'){G.tri([[4.5,7],[5,3],[7,6]],P);G.tri([[8,6],[10,3],[10.5,7]],P);h(6,10,3,2)}
 return G}
const cache={};
function toCanvas(key,w,h,fn){if(cache[key])return cache[key];const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');fn(x);return cache[key]=c}
const lk=l=>l?[l.shade==null?1:l.shade,l.mark|0,l.neck|0].join(''):'100';
window.RLSP={SP,ORDER,mixHex,
 portrait:(k,look,s=1)=>toCanvas('p'+k+lk(look)+s,64*s,64*s,x=>portrait(k,look||{}).draw(x,0,0,s)),
 map:(k,look)=>toCanvas('m'+k+(look&&look.shade!=null?look.shade:1)+(look&&look.coat||''),14,26,x=>mapSprite(k,look).draw(x,0,0,1)),
 back:(k,look)=>toCanvas('b'+k+(look&&look.shade!=null?look.shade:1),30,40,x=>backView(k,look).draw(x,0,0,1)),
 coin:k=>toCanvas('c'+k,15,16,x=>coinGrid(k).draw(x,0,0,1))};
})();
