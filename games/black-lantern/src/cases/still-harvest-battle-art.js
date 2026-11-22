// Black Lantern · cases/still-harvest-battle-art.js · Still Harvest's battle art (spec 006 part B, B3; Nov 22, 2026).
// The case's enemies as big battle sprites, with the light rim battle sprites get, uncanny before gory, and the
// Gleaner's 64 × 64 talking portrait (it speaks in the case). Crowling, Husk Scout, Bale Hound and Long Man are the
// Asset Library's Demo 5 drafts (C1.B), copied unchanged; the Volunteer and the Gleaner sprites are new here, drawn the
// same way, and go back to the Asset Library's Still Harvest page. Exposes window.SHB.
//   SHB.sprite(key, frame) -> cached canvas; frame 0/1 is the idle. key: crow, husk, hound, long, vol, fed, gleaner, gleaner2
//   SHB.size(key) -> [w, h]   SHB.portrait(ctx, open) draws THE GLEANER's face
const SHB=(()=>{
const OL='#120c1c',D='#24141e',W='#f4efe6',MR='#5a1a22';
const sh=(h,a)=>{const n=parseInt(h.slice(1),16),f=v=>Math.max(0,Math.min(255,Math.round(v+a)));return'#'+[n>>16,n>>8&255,n&255].map(v=>f(v).toString(16).padStart(2,'0')).join('')};
function Ly(w,h){const d=new Array(w*h).fill(null);const L={w,h,d,
 g:(x,y)=>(x<0||y<0||x>=w||y>=h)?null:d[y*w+x],
 p(x,y,c){x=Math.round(x);y=Math.round(y);if(x>=0&&y>=0&&x<w&&y<h)d[y*w+x]=c},
 r(x,y,a,b,c){for(let j=0;j<b;j++)for(let i=0;i<a;i++)L.p(x+i,y+j,c)},
 rm(x,y,a,b,c){for(let j=0;j<b;j++)for(let i=0;i<a;i++)if(L.g(x+i,y+j))L.p(x+i,y+j,c)},
 e(cx,cy,rx,ry,c){for(let y=Math.floor(cy-ry);y<=cy+ry;y++)for(let x=Math.floor(cx-rx);x<=cx+rx;x++){const a=(x+.5-cx)/rx,b=(y+.5-cy)/ry;if(a*a+b*b<=1)L.p(x,y,c)}},
 tex(from,to){for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(L.g(x,y)===from&&(x*3+y*5)%7===0)L.p(x,y,to)}};return L}
// Shared look: light from the upper left. Lit edge gets a rim, every edge gets a dark outline.
function finish(L){const{w,h,d}=L,o=d.slice();for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x,v=d[i];
 if(v){if((x>0&&!L.g(x-1,y))||(y>0&&!L.g(x,y-1)))o[i]=sh(v,30)}
 else if(L.g(x-1,y)||L.g(x+1,y)||L.g(x,y-1)||L.g(x,y+1))o[i]=OL}return o}
function blit(c,L,ox=0,oy=0){const o=finish(L);for(let i=0;i<o.length;i++)if(o[i]){c.fillStyle=o[i];c.fillRect(ox+i%L.w,oy+(i/L.w|0),1,1)}}
// Face kit (Storybook rule)
const body=(L,c)=>{L.e(34,66,24,15,sh(c,-32));L.e(30,65,22,14,c)};
const head=(L,cx,cy,rx,ry,s)=>{L.e(cx+1,cy+1,rx,ry,sh(s,-30));L.e(cx-1,cy,rx-1,ry-1,s)};
function eye(L,x,y,ir,s,tiny){L.r(x+1,y,4,1,W);L.r(x,y+1,6,5,W);L.r(x+1,y+6,4,1,W);
 if(tiny){L.r(x+2,y+2,2,3,ir);L.p(x+2,y+3,D);L.p(x+3,y+3,D)}
 else{L.r(x+1,y+1,4,5,ir);L.r(x+1,y+1,4,1,sh(ir,-45));L.r(x+2,y+2,2,3,D);L.p(x+3,y+2,'#ffffff');L.p(x+4,y+5,sh(ir,45))}
 L.r(x,y-1,6,1,D);L.p(x+(s<0?-1:6),y,D);L.p(x+(s<0?-2:7),y-1,D)}
function mouth(L,cx,y,w,o){const x=cx-(w>>1);
 if(o){L.r(x+1,y,w-2,1,MR);L.r(x,y+1,w,3,MR);L.r(x+1,y+4,w-2,1,MR);L.r(x+1,y+1,w-2,1,W);L.r(x+2,y+3,w-4,2,'#d8607a')}
 else{L.r(x+1,y+1,w-2,1,MR);L.p(x,y,MR);L.p(x+w-1,y,MR)}}
const ring=(L,x,y,w,h,c)=>{L.r(x+1,y,w-2,1,c);L.r(x+1,y+h-1,w-2,1,c);L.r(x,y+1,1,h-2,c);L.r(x+w-1,y+1,1,h-2,c)};
const button=(L,x,y,r,c)=>{L.e(x,y,r,r,c);L.p(x-1,y-1,sh(c,40));L.p(x+1,y-1,sh(c,40));L.p(x-1,y+1,sh(c,40));L.p(x+1,y+1,sh(c,40))};

const B={
crow:{name:'Crowling',w:40,h:34,trait:'A crow with one human eye, and a few extra along the wing.',f(L,f){const k='#151018',k2='#2a2234',bk='#d9a43a';
 L.r(30,17,8,3,k2);L.r(32,20,7,2,k);L.r(28,15,6,2,k2);
 L.e(20,20,11,8,k);L.e(12,13,7,6,k);L.r(2,13,5,2,bk);L.r(3,15,3,1,sh(bk,-40));
 L.r(9,10,5,5,W);L.r(10,11,3,3,'#6b8a3a');L.p(11,12,D);L.p(12,11,'#ffffff');L.r(9,9,5,1,D);L.p(8,8,D);L.p(14,9,D);
 if(f){for(let i=0;i<6;i++)L.r(16+i*2,3+i,4,9-i,k2)}else{L.r(14,20,16,5,k2);L.r(11,24,5,3,k2);L.r(9,27,3,2,k2)}
 [[22,18],[26,21],[18,23]].forEach(([x,y])=>{L.r(x-1,y-1,3,3,W);L.p(x,y,D)});
 [[16,15],[24,16],[6,12]].forEach(([x,y])=>L.p(x,y,'#4a4a7a'));
 L.r(17,28,1,5,bk);L.r(22,28,1,5,bk);L.r(15,33,4,1,bk);L.r(21,33,3,1,bk)}},
husk:{name:'Husk Scout',w:44,h:62,trait:'Arms out like it was hung that way. Merit badges leak straw.',f(L,f){const b='#c9a36a',kh='#8a7a4a',g='#3e5c3a',st='#e0c25a';
 L.r(14,38,7,8,kh);L.r(23,38,7,8,kh);L.r(15,46,5,10,g);L.r(24,46,5,10,g);L.r(13,56,8,5,'#4a3a2a');L.r(23,56,8,5,'#4a3a2a');
 L.p(15,45,st);L.p(28,45,st);
 L.r(11,22,22,17,kh);L.r(29,22,4,17,sh(kh,-28));
 L.r(1,23+f,11,5,kh);L.r(33,23-f,10,5,sh(kh,-15));
 [[0,22],[0,25],[1,28],[-1,24]].forEach(([x,y])=>L.p(x+1,y+f,st));[[43,22],[43,25],[42,28]].forEach(([x,y])=>L.p(x,y-f,st));
 for(let i=0;i<14;i++)L.r(12+i,24+i,3,2,'#6a8a4a');
 L.e(16,28,1.6,1.6,st);L.e(21,33,1.6,1.6,'#c0392b');L.e(26,37,1.6,1.6,'#4a7ab0');L.p(21,35,st);
 L.r(14,21,16,3,'#c0392b');for(let i=0;i<4;i++)L.r(19+i,24+i,6-2*i,1,'#a8323e');L.r(21,23,3,2,'#d9c08a');
 L.e(22,13,10,10,'#9c7a44');L.e(21,12,9,9,b);L.tex(b,'#b8925a');
 L.e(22,5,10,4,g);L.r(12,8,20,2,sh(g,-40));L.r(20,3,3,2,st);
 L.r(16,11,4,5,W);L.r(17,12,2,3,'#3a78d8');L.p(17,13,D);L.r(24,11,4,5,W);L.r(25,12,2,3,'#3a78d8');L.p(25,13,D);
 L.p(18,16,'#3a78d8');L.p(18,17,'#3a78d8');
 for(let x=16;x<=28;x++)L.p(x,Math.round(19-((x-22)/6)**2*2),MR);[[16,17],[28,17]].forEach(([x,y])=>L.p(x,y,MR));
 L.e(15,16,1.5,1,'#d86a8a');L.e(29,16,1.5,1,'#d86a8a')}},
hound:{name:'Bale Hound',w:72,h:46,trait:'A hay bale that learned to be a dog from a picture of one.',f(L,f){const h='#d9b552',hd='#a8863a',hl='#f0d070',tw='#7a5a2a';
 [10,22,36,46].forEach((x,i)=>L.r(x,30,5,(i%2)===f?14:12,hd));
 L.r(0,7-f,10,3,hl);L.r(2,4-f,4,3,hl);
 L.r(8,10,46,22,hd);L.r(8,10,44,20,h);
 for(let i=0;i<20;i++)L.r(9+((i*7)%42),12+((i*5)%16),4,1,i%2?hl:hd);
 L.r(20,10,2,22,tw);L.r(40,10,2,22,tw);
 L.r(50,4,20,18,hd);L.r(50,4,18,16,h);L.r(52,0,3,5,h);L.r(64,0,3,5,hd);L.r(53,1,1,3,hl);
 L.r(55,8,5,5,W);L.r(56,9,3,4,'#d8302a');L.r(57,10,1,2,D);L.p(58,9,'#ffffff');L.r(55,7,5,1,D);
 L.r(62,8,5,5,W);L.r(63,9,3,4,'#d8302a');L.r(64,10,1,2,D);L.p(65,9,'#ffffff');L.r(62,7,5,1,D);
 L.r(52,18,18,f?8:6,'#4a2a10');for(let x=53;x<69;x+=3)L.r(x,18,1,2,W);for(let x=54;x<69;x+=3)L.r(x,f?24:22,1,2,W);
 L.r(61,15,3,2,'#3a2010')}},
long:{name:'Long Man',w:40,h:100,trait:'Arms past his knees. He bends down to look at you. Just looks.',f(L,f){const c='#4a3a2e',cd='#2e241c',sk='#d9c8a0',st='#e0c25a';
 L.r(15,70,4,28,cd);L.r(21,70,4,28,cd);L.r(13,97,6,3,'#1b1414');L.r(21,97,6,3,'#1b1414');
 L.r(12,30,16,42,c);L.r(24,30,4,42,cd);[36,46,56].forEach(y=>L.p(20,y,'#c9b98a'));
 L.r(7,32,5,50+f,sh(c,14));L.r(11,34,1,46+f,cd);L.r(28,32,5,50-f,sh(cd,-8));L.r(28,34,1,46-f,'#1b1410');
 L.r(7,82+f,5,6,sk);[7,9,11].forEach((x,i)=>L.r(x,88+f,1,4+(i%2),sk));
 L.r(28,82-f,5,6,sh(sk,-25));[28,30,32].forEach((x,i)=>L.r(x,88-f,1,4+(i%2),sh(sk,-25)));
 [[8,81],[31,81],[14,29],[25,29]].forEach(([x,y])=>L.p(x,y,st));
 L.r(18,20,4,10,sk);L.r(21,20,1,10,sh(sk,-25));
 const lean=f;L.e(20+lean,13,6,8,sk);L.e(22+lean,14,4,7,sh(sk,-18));L.e(19+lean,12,5,7,sk);
 L.r(10+lean,4,20,2,'#1b1414');L.r(14+lean,0,12,5,'#1b1414');
 L.e(17+lean,12,1.5,2,'#000000');L.e(23+lean,12,1.5,2,'#000000');L.p(17+lean,11,'#fff8e0');
 L.r(19+lean,16,2,4+f,'#000000')}}
,
// the Clean-up agent (spec 006 part C): only if overstepping reaches Federal agents. A man in a black suit and shades,
// too neat for a corn town at night; the one wrong detail is that his tie clip is the same lantern on every one of them.
fed:{name:'Clean-up agent',w:40,h:70,trait:'Black suit, black shades at night, an earpiece, and a sidearm he has clearly used.',f(L,f){const s='#151319',sd='#0c0b10',sk='#c99a78',sh2='#e9e6ee',gl='#0a0a0c';
 L.r(11,48,8,20,s);L.r(21,48,8,20,sd);L.r(10,66,9,4,'#050507');L.r(21,66,9,4,'#050507');
 L.r(8,22,24,28,s);L.r(22,22,10,28,sd);L.r(17,22,6,16,sh2);L.r(19,23,2,14,'#241f2c');L.p(19,30,'#d6a43a');L.p(20,30,'#d6a43a');
 L.r(4,24+f,5,22,s);L.r(31,24-f,5,20,sd);L.r(4,46+f,5,4,sk);L.r(31,44-f,5,4,sh(sk,-25));
 L.r(32,46-f,8,3,'#2a2a30');L.r(36,44-f,3,3,'#2a2a30');
 L.r(16,17,8,6,sh(sk,-20));head(L,20,10,9,10,sk);
 L.r(11,1,18,5,'#1a1418');L.r(10,3,3,6,'#1a1418');
 L.r(12,8,7,4,gl);L.r(21,8,7,4,gl);L.r(19,9,2,1,gl);L.p(13,9,'#5a5f70');L.p(22,9,'#5a5f70');
 L.r(16,15,8,1,sh(sk,-45));L.r(28,10,2,4,'#2a2a30');L.r(29,14,1,6,'#3a3a44')}},
vol:{name:'Volunteer',w:46,h:66,trait:'Harvest Committee vest, a clipboard of names, and a sack for a head that smiles wider when it means it.',f(L,f){const b='#c9a36a',bd='#9c7a44',v='#ff7a1a',vd='#c85a10',sh1='#e8dcc0',j='#3b4a6b',st='#e0c25a';
 L.r(13,48,8,16,j);L.r(25,48,8,16,sh(j,-25));L.r(12,62,9,4,'#2a1e18');L.r(25,62,9,4,'#2a1e18');
 L.r(10,24,26,26,sh1);L.r(10,24,8,26,v);L.r(28,24,8,26,vd);L.r(10,36,8,3,'#e6e6e6');L.r(28,36,8,3,'#d0d0d0');L.r(14,27,3,3,st);
 L.r(4,25+f,6,18,v);L.r(4,43+f,6,3,st);L.p(5,46+f,st);L.p(8,47+f,st);
 L.r(36,25,6,13,vd);L.r(36,36,10,16,'#a07a4a');L.r(37,37,8,13,'#f4f4f4');for(let y=39;y<49;y+=2)L.r(38,y,6,1,'#8a8a96');L.r(38,41,2,1,'#c0392b');L.r(38,43,3,1,'#c0392b');L.r(40,35,4,2,'#6a6a72');
 L.r(17,19,12,6,bd);
 L.e(23,11,11,11,bd);L.e(22,10,10,10,b);for(let y=1;y<21;y++)for(let x=12;x<33;x++)if(L.g(x,y)===b&&(x*3+y*5)%7===0)L.p(x,y,'#b8925a');
 L.r(12,18,22,2,'#8a6a2a');L.r(14,17,2,1,'#8a6a2a');L.r(30,17,2,1,'#8a6a2a');
 L.e(17,9,2,2,'#120c1c');L.e(28,9,2,2,'#120c1c');L.p(17,8,'#f4efe6');L.p(28,8,'#f4efe6');
 const sm=f?2:1;for(let x=14;x<=31;x++){const y=Math.round(14+((x-22.5)/8)**2*-3+3);L.p(x,y,MR);if(sm>1)L.p(x,y+1,'#1a0e08')}
 for(let x=15;x<31;x+=3){L.p(x,Math.round(14+((x-22.5)/8)**2*-3+2),'#2a1a10');L.p(x,Math.round(14+((x-22.5)/8)**2*-3+4),'#2a1a10')}
 [[12,4],[31,3],[34,8],[11,12]].forEach(([x,y])=>{L.p(x,y,st);L.p(x+1,y-1,st)})}},
gleaner:{name:'The Gleaner',w:100,h:128,trait:'A harvest stood up on a stake. Its face is a lantern, and something in the flame watches back.',f(L,f,ph2){const K='#1b1414',rb='#3b2b3f',rd='#2a1f2e',st='#c9a24a',sd='#8f6f2c',bl='#a7adbd',gl=ph2?'#f8f0d8':'#d98a2a',fl=ph2?'#ffffff':'#ffd166';
 L.r(48,70,5,58,'#5e4630');L.r(51,70,2,58,'#3e2e20');
 for(let i=0;i<17;i++)L.r(26+i*3,98+(i%3)*2,2,14+(i%4)*3,i%2?st:sd);
 for(let y=44;y<104;y++){const half=14+Math.round((y-44)*.24);L.r(50-half,y,half*2,1,rb);L.r(50+half-7,y,7,1,rd)}
 L.r(37,50,1,48,'#d6a43a');L.r(36,58,1,40,'#d6a43a');
 L.r(42,62,7,7,'#6b3a2e');L.p(42,62,st);L.p(48,68,st);L.r(55,76,6,5,'#5a3428');L.p(55,76,st);
 for(let i=0;i<5;i++){L.p(50,52+i*9,K);L.p(51,52+i*9,K)}
 L.r(10,46,80,6,rb);L.r(64,46,26,6,rd);
 L.r(6,44+f,6,12,st);L.r(88,44-f,6,12,sd);[7,9,11].forEach((x,i)=>L.r(x,56+f,1,4+(i%2)*2,st));[89,91,93].forEach((x,i)=>L.r(x,56-f,1,4+(i%2)*2,sd));
 L.r(8,22+f,3,26,'#5e4630');L.r(89,22-f,3,26,'#5e4630');
 for(const [s,x0,ff] of [[-1,9,f],[1,90,-f]]){for(let k=0;k<14;k++){const a=k/13*Math.PI*.9,x=x0+s*Math.round(Math.sin(a)*12),y=22+ff-Math.round(Math.cos(a)*9)+4;L.r(x,y,2,2,bl)}L.p(x0+s*2,17+ff,'#e8dcc0')}
 L.r(40,38,20,8,'#5a4418');for(let i=0;i<10;i++)L.r(38+i*2+(i%2),36+(i%3),1,6,i%2?st:sd);
 L.e(50,20,19,21,'#5e4630');L.e(49,19,18,20,'#8a6a44');for(let y=0;y<40;y++)for(let x=31;x<68;x++)if(L.g(x,y)==='#8a6a44'&&(x*3+y*5)%7===0)L.p(x,y,'#a3825a');
 L.r(60,6,7,28,'#5e4630');
 [[34,4],[38,1],[44,0],[52,0],[58,2],[63,5]].forEach(([x,y],i)=>L.r(x,y,1,4+(i%3),st));
 L.r(38,8,24,26,K);L.r(40,10,20,22,gl);L.e(50,21,ph2?6:5,ph2?9:7+f,fl);L.e(50,23,2,ph2?6:3+f,'#ffffff');
 L.r(49,10,2,22,K);L.r(40,20,20,1,K);L.r(37,32,26,3,K);L.r(46,5,8,3,K);L.r(48,2,4,3,K);
 L.p(47,19,ph2?'#ff3b3b':'#ff4fa3');L.p(53,19,'#f4c96a');
 if(ph2){[[40,58],[47,66],[58,60],[44,80],[56,86],[50,72]].forEach(([x,y])=>L.r(x,y,2,1,'#ff3b3b'))}}}
};
const P=
{gleaner:{name:'The Gleaner',role:'Boss',trait:'Its face is a lantern. Something in the flame watches back.',bg:'#14101c',
 under(c,t){c.fillStyle=t?'#3a2414':'#2a1c14';for(let y=4;y<50;y++)for(let x=8;x<56;x++){const dx=x-32,dy=y-26;if(dx*dx+dy*dy<(t?520:440)&&(x+y)%2===0)c.fillRect(x,y,1,1)}},
 f(L,t){const K='#1b1414',gl=t?'#f6d070':'#d98a2a',fl=t?'#fff8e0':'#ffd166';
 L.e(32,66,26,16,'#5a4418');L.e(30,65,24,15,'#8a7030');for(let i=0;i<16;i++)L.r(8+i*3,52+(i%3),1,12,i%2?'#a88a3a':'#5a4418');
 L.e(33,38,19,22,'#1a1410');L.e(31,37,18,21,'#2e2418');L.tex('#2e2418','#3a2e1e');
 for(let i=0;i<9;i++)L.r(24+i*2,40,1,8+(i%3)*2,i%2?'#a88a3a':'#7a6228');
 L.r(31,0,2,4,'#3a3040');L.r(30,4,4,4,K);L.r(26,8,12,3,K);
 L.r(22,11,20,26,K);L.r(24,13,16,22,gl);L.e(32,26,t?6:4,t?9:6,fl);L.e(32,28,2,t?6:3,'#ffffff');
 L.p(29,24,'#4a1a08');L.p(35,24,'#4a1a08');if(t){L.p(29,23,'#4a1a08');L.p(35,23,'#4a1a08')}
 L.r(31,13,2,22,K);L.r(24,23,16,1,K);L.r(23,37,18,3,K);L.r(22,36,1,4,K);L.r(41,36,1,4,K)}}
}.gleaner;
const SZ=k=>{const A=B[k==='gleaner2'?'gleaner':k];return A?[A.w,A.h]:[16,16]};
const cache=new Map();
function sprite(k,frame){const key=k+(frame?1:0);let c=cache.get(key);if(c)return c;const A=B[k==='gleaner2'?'gleaner':k];if(!A)return null;
 const L=Ly(A.w,A.h);A.f(L,frame?1:0,k==='gleaner2');c=document.createElement('canvas');c.width=A.w;c.height=A.h;blit(c.getContext('2d'),L);cache.set(key,c);return c}
const pc={};
function portrait(ctx,open){const k=open?1:0;if(!pc[k]){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),L=Ly(64,64);P.f(L,k);x.fillStyle=P.bg;x.fillRect(0,0,64,64);if(P.under)P.under(x,k);blit(x,L);pc[k]=c}
 ctx.clearRect(0,0,64,64);ctx.drawImage(pc[k],0,0)}
return{B,sprite,size:SZ,portrait};
})();
