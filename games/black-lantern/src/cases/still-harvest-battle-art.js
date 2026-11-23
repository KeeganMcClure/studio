// Black Lantern · cases/still-harvest-battle-art.js · Still Harvest's battle art (spec 006 part B, B3; Nov 22, 2026).
// The case's enemies as big battle sprites, with the light rim battle sprites get, uncanny before gory, and the
// Gleaner's 64 × 64 talking portrait (it speaks in the case). Crowling, Husk Scout, Bale Hound and Long Man are the
// Asset Library's Demo 5 drafts (C1.B), copied unchanged; the Volunteer and the Gleaner sprites are new here, drawn the
// same way, and go back to the Asset Library's Still Harvest page. Exposes window.SHB.
// Nov 23 playtest: every enemy's two damage steps (wounded at half and a quarter HP), and the case's battle backdrops.
//   SHB.sprite(key, frame, step) -> cached canvas; frame 0/1 is the idle; step 0 unhurt, 1 at half HP, 2 at a quarter.
//      key: crow, husk, hound, long, vol, fed, gleaner, gleaner2
//   SHB.size(key) -> [w, h]   SHB.portrait(ctx, open) draws THE GLEANER's face
//   SHB.backdrop(place, {w, h, light, low, feet}) -> the battle backdrop for 'town' or 'maze' (see BATTLE BACKDROPS)
const SHB=(()=>{
const OL='#120c1c',D='#24141e',W='#f4efe6',MR='#5a1a22';
const sh=(h,a)=>{const n=parseInt(h.slice(1),16),f=v=>Math.max(0,Math.min(255,Math.round(v+a)));return'#'+[n>>16,n>>8&255,n&255].map(v=>f(v).toString(16).padStart(2,'0')).join('')};
// a pixel layer w × h in drawing coordinates; ox adds empty room either side (a wounded sprite leans and spills past its box)
function Ly(w,h,ox=0){const WW=w+2*ox,d=new Array(WW*h).fill(null);const L={w,h,d,W:WW,ox,
 g:(x,y)=>{x+=ox;return(x<0||y<0||x>=WW||y>=h)?null:d[y*WW+x]},
 p(x,y,c){x=Math.round(x)+ox;y=Math.round(y);if(x>=0&&y>=0&&x<WW&&y<h)d[y*WW+x]=c},
 r(x,y,a,b,c){for(let j=0;j<b;j++)for(let i=0;i<a;i++)L.p(x+i,y+j,c)},
 rm(x,y,a,b,c){for(let j=0;j<b;j++)for(let i=0;i<a;i++)if(L.g(x+i,y+j))L.p(x+i,y+j,c)},
 e(cx,cy,rx,ry,c){for(let y=Math.floor(cy-ry);y<=cy+ry;y++)for(let x=Math.floor(cx-rx);x<=cx+rx;x++){const a=(x+.5-cx)/rx,b=(y+.5-cy)/ry;if(a*a+b*b<=1)L.p(x,y,c)}},
 tex(from,to){for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(L.g(x,y)===from&&(x*3+y*5)%7===0)L.p(x,y,to)}};return L}
// Shared look: light from the upper left. Lit edge gets a rim, every edge gets a dark outline.
function finish(L){const w=L.W,{h,d}=L,o=d.slice(),G=(x,y)=>(x<0||y<0||x>=w||y>=h)?null:d[y*w+x];for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x,v=d[i];
 if(v){if((x>0&&!G(x-1,y))||(y>0&&!G(x,y-1)))o[i]=sh(v,30)}
 else if(G(x-1,y)||G(x+1,y)||G(x,y-1)||G(x,y+1))o[i]=OL}return o}
function blit(c,L,ox=0,oy=0){const o=finish(L),w=L.W;for(let i=0;i<o.length;i++)if(o[i]){c.fillStyle=o[i];c.fillRect(ox+i%w,oy+(i/w|0),1,1)}}
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
 L.p(47,19,ph2?'#ff3b3b':'#ff4fa3');L.p(53,19,'#f4c96a');}}
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
// ================= WOUNDED ENEMIES (Art, Townsfolk and monsters, Wounded enemies; Nov 23, 2026 playtest) =================
// Two damage steps for every enemy: step 1 at half HP, step 2 at a quarter. Big shapes that read on a phone: a slump or
// lean, torn-away chunks, splits and stains at least 3 px across, stuffing that bursts out and spills to the ground, and
// a duller color on the hurt side. Never single red pixels. What breaks fits the thing: straw spills from the stuffed
// ones (the Gleaner, the Volunteer, the Long Man), the Husk Scout's chest splits, the Bale Hound's twine snaps, the
// Crowling and the Clean-up agent bleed. Each is drawn over the unhurt sprite before the outline pass, so torn edges
// get the same dark outline as the rest.
const WPAD=8,STRAW=['#e8cc66','#c9a24a','#9c7a34'],HOLLOW='#140c12',BLOOD='#6e121c',BLOODW='#a8202c';
const grey=(h,k)=>{const n=parseInt(h.slice(1),16),r=n>>16,g=n>>8&255,b=n&255,l=(r*.3+g*.59+b*.11)*.82,f=v=>Math.max(0,Math.min(255,Math.round(v+(l-v)*k-k*18)));
 return'#'+[r,g,b].map(v=>f(v).toString(16).padStart(2,'0')).join('')};
// a ragged blob: an ellipse whose radius wobbles with the angle, so a tear has notches instead of a clean oval
const inBlob=(x,y,cx,cy,rx,ry,sd)=>{const a=(x+.5-cx)/rx,b=(y+.5-cy)/ry,t=Math.atan2(b,a),r=1+.22*Math.sin(5*t+sd)+.12*Math.sin(9*t+sd*2.3);return a*a+b*b<=r*r};
const blob=(L,cx,cy,rx,ry,sd,fn)=>{for(let y=Math.floor(cy-ry*1.4);y<=cy+ry*1.4;y++)for(let x=Math.floor(cx-rx*1.4);x<=cx+rx*1.4;x++)if(inBlob(x,y,cx,cy,rx,ry,sd))fn(x,y)};
const Wk={
 // a chunk torn away: the pixels go, so the backdrop shows through and the outline runs round the bite
 bite(L,cx,cy,rx,ry,sd=1){blob(L,cx,cy,rx,ry,sd,(x,y)=>{if(L.g(x,y))L.p(x,y,null)})},
 // a split: dark and hollow inside, on the body only
 gash(L,cx,cy,rx,ry,sd=2,c=HOLLOW){blob(L,cx,cy,rx,ry,sd,(x,y)=>{if(L.g(x,y))L.p(x,y,c)})},
 // a tear in dark cloth with the straw stuffing showing inside it
 rip(L,cx,cy,rx,ry,sd=2){Wk.gash(L,cx,cy,rx+1,ry+1,sd);blob(L,cx,cy,rx*.6,ry*.7,sd+2,(x,y)=>{if(L.g(x,y))L.p(x,y,STRAW[(x+y)%3===0?0:1])})},
 // a stain soaking in, with a wet core
 stain(L,cx,cy,rx,ry,sd=3,c=BLOOD,c2=BLOODW){blob(L,cx,cy,rx,ry,sd,(x,y)=>{if(L.g(x,y))L.p(x,y,c)});blob(L,cx-rx*.15,cy-ry*.2,rx*.5,ry*.5,sd+1,(x,y)=>{if(L.g(x,y))L.p(x,y,c2)})},
 // a drip running down, 2 px wide (any: it may run off the body)
 drip(L,x,y,n,c=BLOOD,any){for(let j=0;j<n;j++)for(const i of[0,1])if(any||L.g(x+i,y+j))L.p(x+i,y+j,c);if(any){L.p(x,y+n,c);L.p(x+1,y+n,c);L.p(x-1,y+n-1,c);L.p(x+2,y+n-1,c)}},
 line(L,x0,y0,x1,y1,c,w=1){const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);for(let i=0;i<=n;i++){const x=Math.round(x0+(x1-x0)*i/n),y=Math.round(y0+(y1-y0)*i/n);L.p(x,y,c);if(w>1)L.p(x,y+1,c)}},
 // stuffing bursting out of (x, y) toward angle a (0 = right, -PI/2 = up): a fan of strands round a solid core
 tuft(L,x,y,a,len,n=5,spread=1,sd=0){for(let i=0;i<n;i++){const t=a+spread*(i/(n-1)-.5),l=len*(.65+.35*((i*7+sd)%3)/2);Wk.line(L,x,y,x+Math.cos(t)*l,y+Math.sin(t)*l,STRAW[(i+sd)%3],i%2?1:2)}L.e(x,y,2,2,STRAW[0]);L.p(x,y,STRAW[1])},
 // straw falling from (x, y) to the ground row gy, strands across w px
 spill(L,x,y,w,gy,sd=0){for(let i=0;i<w;i+=2){const top=y+((i*5+sd)%4),bot=gy-((i*3+sd)%4);for(let yy=top;yy<=bot;yy++){const wob=((yy+i+sd)>>2)%2;L.p(x+i+wob,yy,STRAW[(i>>1)%3])}}},
 // a heap of straw on the ground at the feet
 pile(L,cx,rx,ry=3){const y=L.h-1;L.e(cx,y,rx,ry,STRAW[2]);L.e(cx-1,y,rx*.8,ry*.75,STRAW[1]);for(let i=1;i<rx*2-2;i+=3)Wk.line(L,cx-rx+i,y-ry+2,cx-rx+i+2,y-ry,STRAW[0])},
 // the hurt side goes duller (toward grey, a little darker), strongest at the far edge
 dull(L,x0,x1,amt){const d=x1>x0?1:-1;for(let y=0;y<L.h;y++)for(let x=x0;d>0?x<=x1:x>=x1;x+=d){const v=L.g(x,y);if(!v||STRAW.includes(v))continue;L.p(x,y,grey(v,amt*Math.min(1,.4+.6*Math.abs(x-x0)/Math.max(1,Math.abs(x1-x0)))))}},
 // the body leans: rows above y1 shift sideways, the full dx at y0 and above
 lean(L,dx,y0,y1){const W=L.W,d=L.d;for(let y=0;y<y1;y++){const s=Math.round(dx*Math.min(1,(y1-y)/Math.max(1,y1-y0)));if(!s)continue;const row=d.slice(y*W,y*W+W);for(let x=0;x<W;x++){const sx=x-s;d[y*W+x]=sx>=0&&sx<W?row[sx]:null}}},
 // a block drops (an arm sags, a head slumps); its old top is left empty
 sag(L,x0,y0,w,h,dy,dx=0){const px=[];for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++){const v=L.g(x,y);if(v){px.push([x,y,v]);L.p(x,y,null)}}px.forEach(([x,y,v])=>L.p(x+dx,y+dy,v))},
 // a limb gone
 cut(L,x,y,w,h){for(let j=0;j<h;j++)for(let i=0;i<w;i++)L.p(x+i,y+j,null)}
};
const WOUND={
// Crowling: a living bird. It bleeds, loses its tail feathers, its feathers stand up, the extra eye shuts, then the wing breaks and the head hangs.
crow(L,s,f){const k='#151018',k2='#2a2234';
 Wk.bite(L,36,18,s>1?5:3.5,3.5,1);
 [[19,12],[23,13],[27,14]].forEach(([x,y],i)=>Wk.line(L,x,y,x+1+i%2,y-3,k2,2));
 L.r(25,20,3,3,k);L.r(24,21,5,1,'#4a1a22');
 if(s===1){Wk.stain(L,23,23,5,3.5,3,'#7a1620','#c0303a')}
 else{Wk.stain(L,21,23,6,4,5,'#7a1620','#c0303a');Wk.drip(L,19,27,4,'#8a1a24',true);Wk.drip(L,24,27,2,'#8a1a24',true);
  if(f)Wk.bite(L,23,7,3.5,3,4);else Wk.sag(L,13,19,18,10,4,1);
  L.r(9,10,5,3,k);L.r(9,13,5,1,'#4a1a22');
  [[3,28],[33,27]].forEach(([x,y])=>{L.r(x,y,4,2,k2);L.p(x+4,y+1,k2)});
  Wk.sag(L,0,3,17,17,3)}
 Wk.dull(L,22,40,s>1?.5:.35)},
// Husk Scout: the husk splits. The chest seam opens with straw bursting out and the right arm sags; then the split gapes
// and pours straw to the ground, the right arm is torn off, a burlap flap comes away from the head and it leans hard.
husk(L,s,f){
 if(s===1){Wk.gash(L,22,31,2.2,6,2);Wk.tuft(L,21,30,Math.PI*.95,7,4,1,1);Wk.tuft(L,23,33,.15,6,4,1,2);
  Wk.sag(L,33,19,12,12,4);Wk.tuft(L,33,26,.2,4,3,.8,0);
  Wk.dull(L,24,44,.35);Wk.lean(L,2,6,22)}
 else{Wk.gash(L,22,31,4.5,8,3);Wk.tuft(L,19,28,Math.PI*1.05,8,5,1.1,1);Wk.tuft(L,25,30,-.1,8,5,1.1,2);
  Wk.cut(L,32,17,14,16);Wk.tuft(L,32,25,.1,7,5,1.2,0);
  Wk.bite(L,29,7,4.5,4,2);Wk.tuft(L,28,8,-.5,6,4,1,1);
  L.r(16,11,4,5,HOLLOW);
  Wk.dull(L,22,44,.55);Wk.lean(L,4,6,38);
  Wk.spill(L,20,38,4,61,1);Wk.pile(L,22,10)}},
// Bale Hound: the twine snaps, the bale bursts and the back end sinks; then both bands go, a hole in its flank pours hay,
// an ear tears off and the jaw hangs open.
hound(L,s,f){const h='#d9b552',tw='#7a5a2a';
 L.rm(40,13,2,13,h);Wk.line(L,40,12,37,16,tw,1);Wk.line(L,41,26,44,23,tw,1);
 Wk.gash(L,40,20,3,4.5,2);Wk.tuft(L,40,12,-Math.PI/2,6,5,1.2,1);
 Wk.bite(L,28,10,s>1?6:4,s>1?4:3,1);
 if(s===1){Wk.sag(L,-2,0,31,31,2);Wk.dull(L,30,0,.35)}
 else{L.rm(20,13,2,13,h);Wk.line(L,20,12,23,16,tw,1);
  Wk.gash(L,30,22,6,5,3);Wk.tuft(L,30,21,Math.PI*.6,7,5,1.2,2);
  Wk.cut(L,63,-1,5,6);Wk.sag(L,51,18,20,10,3);
  Wk.sag(L,-2,0,31,31,5);Wk.dull(L,34,0,.55);
  Wk.spill(L,25,28,8,45,1);Wk.pile(L,30,12)}},
// Long Man: no blood in him, only old straw. His coat tears and his neck bends; then the neck gives and the head drops to
// his shoulder, his chest rips open and pours straw, and two fingers are gone.
long(L,s,f){
 if(s===1){Wk.bite(L,27,70,3.5,4.5,2);Wk.rip(L,18,44,2.2,4.5,2);Wk.tuft(L,17,44,Math.PI,6,4,1,1);
  Wk.sag(L,28,31,7,64,3);Wk.dull(L,21,40,.35);Wk.lean(L,3,8,30)}
 else{Wk.bite(L,27,70,4.5,5,2);Wk.bite(L,13,71,3,4,4);Wk.rip(L,19,46,4,7.5,3);Wk.tuft(L,16,44,Math.PI*1.05,8,5,1.1,1);Wk.tuft(L,22,48,0,7,4,1,2);
  Wk.cut(L,6,87,7,9);Wk.sag(L,28,31,7,64,4);Wk.sag(L,8,-1,26,7,1,3);
  Wk.dull(L,20,40,.55);Wk.lean(L,7,6,30);Wk.sag(L,0,0,48,21,3);
  Wk.spill(L,17,54,6,99,2);Wk.pile(L,20,9)}},
// Volunteer: a stuffed coat. Its sack head splits at the seam, the vest tears and the clipboard cracks; then the stitched
// smile rips open and straw pours from it, the chest bursts, the clipboard arm hangs and the head lolls.
vol(L,s,f){
 if(s===1){Wk.gash(L,14,5,2.5,2.5,1);Wk.tuft(L,13,4,-2.3,6,4,1,0);Wk.bite(L,33,49,3,3,2);Wk.rip(L,31,33,2.5,4,2);Wk.tuft(L,32,32,.3,6,4,1,2);
  Wk.line(L,37,39,44,47,'#5a5a64',2);Wk.dull(L,26,46,.35);Wk.lean(L,-2,6,24)}
 else{Wk.gash(L,14,5,3,3,1);Wk.tuft(L,13,4,-2.3,7,5,1,0);Wk.gash(L,27,15,5,3,2);Wk.tuft(L,27,17,Math.PI/2,7,5,1,1);
  Wk.bite(L,31,4,4.5,3.5,3);Wk.gash(L,22,38,4.5,6,3);Wk.tuft(L,21,36,Math.PI*1.1,7,5,1.1,2);
  Wk.line(L,37,39,44,47,'#5a5a64',2);Wk.sag(L,36,23,11,31,6);Wk.bite(L,43,56,3,4,1);
  Wk.dull(L,24,47,.55);Wk.lean(L,-4,4,24);Wk.sag(L,-2,0,40,22,2);
  Wk.spill(L,19,43,6,65,1);Wk.pile(L,22,10)}},
// Clean-up agent: a person, so he bleeds. Blood on his shirt and a cracked lens; then it soaks his side and runs down his
// leg to a pool, he holds the wound, his gun arm drops, his shades are knocked half off and he hunches.
fed(L,s,f){const sk='#c99a78',su='#151319';
 if(s===1){Wk.stain(L,21,30,3.5,3.5,3);Wk.drip(L,20,32,6);Wk.line(L,22,8,26,11,'#d8dce8',1);Wk.dull(L,22,40,.3);Wk.lean(L,-1,8,22)}
 else{Wk.stain(L,20,32,5.5,6,3);Wk.drip(L,17,36,10);Wk.drip(L,22,37,8);Wk.stain(L,25,56,2.5,6,4,BLOODW,'#c0303a');
  Wk.cut(L,3,36,7,16);L.r(6,32,8,6,su);L.r(13,31,6,5,sk);L.r(13,33,6,1,sh(sk,-35));
  L.r(21,8,7,4,sk);L.r(22,9,5,3,W);L.r(24,9,2,3,'#4a5a6a');L.p(24,10,D);L.r(21,8,7,1,sh(sk,-30));
  Wk.sag(L,30,22,11,30,4);Wk.dull(L,20,40,.5);Wk.lean(L,-3,8,40);Wk.sag(L,0,0,40,21,2);
  L.e(23,L.h-1,9,1.8,BLOOD);L.e(21,L.h-1,5,1.2,BLOODW)}},
// The Gleaner: a harvest on a stake, so straw. Its robe is slashed open and spills straw, a sickle breaks and an arm
// droops; then its robe is torn half away, the lantern face cracks with fire licking out of the break, the left arm is
// gone, the head slumps and straw heaps round the stake.
gleaner(L,s,f,ph2){const K='#1b1414',fl=ph2?'#ffffff':'#ffd166';
 for(let t=0;t<5;t++)Wk.rip(L,38+2*t,58+6*t,s>1?3:2.2,3.5,t);
 Wk.tuft(L,39,64,Math.PI*.95,s>1?10:8,5,1,1);Wk.tuft(L,44,76,Math.PI*.8,s>1?9:7,5,1,2);
 Wk.bite(L,70,100,s>1?7:5,s>1?6:4,2);Wk.bite(L,99,15,3,3.5,1);
 if(s===1){Wk.sag(L,-WPAD,10,24,52,4);Wk.dull(L,56,104,.35);Wk.spill(L,66,100,8,127,1);Wk.pile(L,48,16,3)}
 else{Wk.bite(L,70,72,8,12,3);Wk.tuft(L,63,64,-.2,9,5,1.1,0);Wk.tuft(L,64,82,.3,9,5,1.1,1);
  Wk.line(L,42,12,50,22,K,2);Wk.line(L,50,22,45,31,K,2);Wk.line(L,50,22,58,27,K,2);
  Wk.bite(L,61,9,3.5,3.5,2);L.e(61,6,3,5,ph2?'#f6d070':'#d9772b');L.e(61,7,2,3.5,fl);L.r(60,1,2,3,fl);
  Wk.cut(L,-WPAD,8,23,56);Wk.tuft(L,11,48,Math.PI*.85,10,6,1.2,0);
  Wk.dull(L,54,106,.55);Wk.lean(L,4,10,44);Wk.sag(L,26,-1,48,47,3);
  Wk.spill(L,40,84,8,127,1);Wk.spill(L,64,100,10,127,2);Wk.pile(L,50,28,4)}}
};

// ================= BATTLE BACKDROPS (Combat, Basics, Backgrounds; Nov 23, 2026 playtest) =================
// Painted head-on at battle scale, Pokémon style, not a darkened copy of the map: a ground plane the fighters stand on, a
// horizon, and the big landmarks that say where you are. One per kind of place Still Harvest fights in, from the map's bg:
// the town street ('town': shop fronts, the diner, the church steeple, Harvest Walk bunting and a lamp post) and the corn
// maze ('maze': corn walls on three sides and an empty scarecrow pole). Each is lit for the map's light: day, dusk, or
// night (dark but for the lead's lantern pool, the moon, lamps and lit windows). Low SAN shrinks the lantern's and lamps'
// light like on the map; battle.js lays the pink and cyan sour over the whole backdrop.
//   SHB.backdrop(place, {w, h, light, low, feet}) -> canvas, or null for a place with none. feet: where the enemies stand.
const BDC={};
function backdrop(place,o){const f=BDRAW[place];if(!f)return null;const key=[place,o.light,o.low?1:0,o.w,o.h,o.feet].join('|');if(BDC[key])return BDC[key];
 const c=document.createElement('canvas');c.width=o.w;c.height=o.h;const g=c.getContext('2d');
 const hz=Math.round(Math.max(30,Math.min(o.feet-12,o.h*.44)));  // the horizon: just behind where the enemies stand
 f(bdKit(g),o.w,o.h,hz,o);BDC[key]=c;return c}
// drawing kit: plain rectangles, a stepped (pixel) gradient, ellipses, lines, a seeded hash for scatter, and stepped light pools
function bdKit(g){const R=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))};
 const K={g,R,P:(x,y,c)=>R(x,y,1,1,c),
  hash:(a,b=0)=>{let n=Math.imul(a|0,374761393)+Math.imul(b|0,668265263);n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967296},
  // a gradient in flat bands, with a two-row dither where each band meets the next
  bands(y0,y1,cols,W){const n=cols.length,hh=(y1-y0)/n;for(let i=0;i<n;i++){const a=Math.round(y0+i*hh),b=Math.round(y0+(i+1)*hh);R(0,a,W,b-a,cols[i]);
   if(i<n-1)for(let x=0;x<W;x++){if((x&1)===0)R(x,b-1,1,1,cols[i+1]);if((x&3)===1)R(x,b-2,1,1,cols[i+1])}}},
  ell(cx,cy,rx,ry,c){for(let y=-Math.ceil(ry);y<=Math.ceil(ry);y++){const q=1-(y/ry)**2;if(q<0)continue;const hw=rx*Math.sqrt(q);R(cx-hw,cy+y,hw*2,1,c)}},
  line(x0,y0,x1,y1,c,w=1){const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);for(let i=0;i<=n;i++)R(x0+(x1-x0)*i/n,y0+(y1-y0)*i/n,w,w,c)},
  // light: nested flat ellipses added on top (a pixel-art glow in a few hard steps)
  pool(cx,cy,rx,ry,c,a,steps=4){g.globalCompositeOperation='lighter';g.globalAlpha=a/steps;for(let i=0;i<steps;i++){const k=1-i/steps;K.ell(cx,cy,rx*k,ry*k,c)}g.globalAlpha=1;g.globalCompositeOperation='source-over'},
  // shade: the same, darkening
  shade(cx,cy,rx,ry,a,steps=3){g.globalAlpha=a/steps;for(let i=0;i<steps;i++){const k=1-i/steps;K.ell(cx,cy,rx*k,ry*k,'#07050c')}g.globalAlpha=1},
  // 3 × 5 capitals for signs
  text(s,x,y,c){const F={D:'110101101101110',I:'111010010010111',N:'101111111111101',E:'111100110100111',R:'110101110101101',F:'111100110100100',S:'111100111001111',O:'111101101101111',P:'110101110100100',A:'010101111101101',L:'100100100100111',C:'111100100100111',H:'101101111101101',W:'101101101111101',K:'101101110101101'};
   [...s].forEach((ch,i)=>{const b=F[ch];if(b)for(let j=0;j<15;j++)if(b[j]==='1')R(x+i*4+j%3,y+(j/3|0),1,1,c)})}};
 return K}
// a corn stalk standing from base up to top: a 2 px stalk lit on its left, blade leaves arching out, a tassel, maybe an ear
function stalk(K,x,base,top,C,big,sd){const R=K.R,w=big?4:2,lw=big?3:2;R(x,top,w,base-top,C.stalk);R(x,top,1,base-top,C.lit);
 for(let y=top+(big?10:5)+(sd%4),i=0;y<base-(big?6:4);y+=big?17:8,i++){const d=(i+sd)%2?1:-1,L=big?14+(sd+i)%6:5+(sd+i)%3,x0=d>0?x+w:x-1;
  for(let k=0;k<L;k++){const yy=y-Math.round(Math.sin(k/L*2.4)*(big?6:2.5))+Math.round(k*k/L*(big?.5:.3));R(x0+d*k,yy,1,lw-(k>L*.7?1:0),C.leaf);R(x0+d*k,yy,1,1,C.lit)}}
 R(x-1,top-3,1,3,C.tassel);R(x+w,top-4,1,4,C.tassel);R(x+(w>>1),top-5,1,5,C.tassel);
 if(!big&&sd%3===0){const ey=top+Math.round((base-top)*.45);R(x+w,ey,2,4,C.ear);R(x+w,ey,1,1,C.tassel)}}
const BDRAW={
maze(K,W,H,hz,o){const R=K.R,nt=o.light==='night',dk=o.light==='dusk',low=o.low;
 const C=nt?{sky:['#0a0c1a','#0e1226','#13182e','#1a1f38'],back:'#101a16',stalk:'#1e2c1c',leaf:'#24361f',lit:'#3e5238',tassel:'#6e6a44',ear:'#4a4428',
   ground:['#161219','#1d171e','#241c22','#2a2126'],rut:'#0f0c12',straw:'#4e4228',strawLit:'#6e5c32',fore:{stalk:'#080c0a',leaf:'#0c120e',lit:'#18221a',tassel:'#2a2a1e'},pole:'#2a1e1c',poleLit:'#4a3a2e',rag:'#4a3e30',rope:'#5a5040'}
  :dk?{sky:['#2a2030','#46283a','#7a3436','#b5532e','#d9772b'],back:'#2c2c16',stalk:'#45461e',leaf:'#525424',lit:'#c08a3a',tassel:'#e0b04a',ear:'#a07a30',
   ground:['#3a2a20','#463224','#523a28','#5e4430'],rut:'#2e2018',straw:'#a07a34',strawLit:'#d9a64a',fore:{stalk:'#161408',leaf:'#1e1c0c',lit:'#4a3a18',tassel:'#5e4a1e'},pole:'#3a281e',poleLit:'#a0643a',rag:'#8a6a44',rope:'#a8906a'}
  :{sky:['#6a98c0','#7ea8cc','#94b8d6','#aac8de','#c4d8e2'],back:'#45531f',stalk:'#5e6c26',leaf:'#6e7e2e',lit:'#bfae4a',tassel:'#e0c25a',ear:'#c9a24a',
   ground:['#7a5a3a','#84623e','#8e6a44','#987248'],rut:'#664a30',straw:'#c9a24a',strawLit:'#e8cc66',fore:{stalk:'#2a3414',leaf:'#34401a',lit:'#5e6c26',tassel:'#8a8a3a'},pole:'#5a4030',poleLit:'#9a7a5a',rag:'#b8986a',rope:'#d8c8a0'};
 const wallH=Math.round(Math.min(hz*.6,52)),wt=hz-wallH;
 // sky, then the moon (night), a low sun (dusk) or a few clouds (day)
 K.bands(0,wt+10,C.sky,W);
 const mx=Math.round(W*.34),my=Math.max(9,Math.round(wt*.42));
 if(nt){for(let i=0;i<46;i++){const x=K.hash(i,1)*W|0,y=K.hash(i,2)*(wt+2)|0;R(x,y,1,1,i%5?'#5a6080':'#c8c8e0');if(i%11===0){R(x-1,y,3,1,'#8a90b0');R(x,y-1,1,3,'#8a90b0')}}
  K.pool(mx,my,22,22,'#3a4470',.5,3);K.ell(mx,my,7,7,'#e8dcc0');K.ell(mx+1,my+1,5,5,'#d0c4a6');K.ell(mx+4,my-2,6,6,C.sky[Math.min(3,Math.floor(my/((wt+10)/4)))]);R(mx-6,my-1,1,2,'#fff8e0')}
 else if(dk){K.pool(mx,wt+6,60,24,'#d9772b',.5,4);K.ell(mx,wt+8,13,13,'#f0b050');K.ell(mx,wt+8,10,10,'#ffd27a');
  [[30,.3],[150,.45],[200,.25]].forEach(([x,f])=>{R(x,Math.round(wt*f),46,2,'#5a2c40');R(x+8,Math.round(wt*f)-1,24,1,'#6a3448')})}
 else{[[40,.35],[150,.25],[205,.5]].forEach(([x,f])=>{const y=Math.round(wt*f)+4;K.ell(x,y,14,4,'#e8eef2');K.ell(x+8,y-3,8,4,'#f4f6f8');K.ell(x-6,y+1,7,3,'#d4dee6')})}
 // the far corn wall: a dense back row, then a front row with leaves and tassels against the sky
 R(0,wt+8,W,hz-wt-8,C.back);
 for(let x=-3,i=0;x<W+3;x+=4,i++)stalk(K,x,hz,wt+6+(K.hash(i,5)*6|0),{stalk:C.back,leaf:C.back,lit:C.stalk,tassel:C.stalk,ear:C.back},false,i);
 for(let x=-2,i=0;x<W+3;x+=6,i++)stalk(K,x+(i%2),hz,wt+(K.hash(i,7)*7|0),C,false,i);
 R(0,hz-2,W,2,C.rut);
 // the ground: the maze's trampled dirt path, ruts across it, straw and husks dropped on it
 K.bands(hz,H,C.ground,W);
 for(let i=1,y=hz+3;y<H;i++,y=hz+3+Math.round(i*i*1.5)){for(let x=-4;x<W;x+=28+i*4){const l=14+i*3+(K.hash(i,x)*10|0);R(x+(K.hash(x,i)*12|0),y,l,1,C.rut)}}
 for(let i=0;i<70;i++){const t=K.hash(i,11),y=Math.round(hz+3+t*t*(H-hz-4)),x=K.hash(i,12)*W|0,l=2+Math.round(t*4);
  if(i%2)R(x,y,l,1,C.straw);else K.line(x,y,x+l,y-1-(i%3>0?1:0),i%3?C.straw:C.strawLit);
  if(i%9===0){R(x-1,y-1,l+2,2,C.straw);R(x,y-1,l,1,C.strawLit)}}
 // the empty scarecrow pole: the ropes cut, rags left hanging, standing just in front of the corn on the right
 const px=Math.round(W*.83),ptop=Math.max(6,wt-26),pb=hz+5,bar=ptop+11;
 K.shade(px+2,pb,12,3,.5);
 R(px-2,ptop,5,pb-ptop,C.pole);R(px-2,ptop,1,pb-ptop,C.poleLit);R(px+3,ptop,1,pb-ptop,'#120c10');
 R(px-18,bar,38,4,C.pole);R(px-18,bar,38,1,C.poleLit);R(px-18,bar+4,38,1,'#120c10');
 R(px-14,bar+4,2,9,C.rope);R(px-15,bar+12,4,2,C.rope);R(px+14,bar+4,2,6,C.rope);R(px-1,bar+12,2,10,C.rope);R(px-2,bar+21,4,2,C.rope);
 [[-10,9],[-7,13],[-4,7],[6,11],[9,15],[12,8]].forEach(([dx,l],i)=>{R(px+dx,bar+4,3,l,C.rag);R(px+dx+(i%2?2:0),bar+4+l,1,2,C.rag);R(px+dx,bar+4,1,l,'#120c10')});
 [[-20,-1],[19,1]].forEach(([dx,d])=>{for(let k=0;k<4;k++)K.line(px+dx,bar+1,px+dx+d*(3+k),bar-2+k*2,C.tassel)});
 // the near corn walls at both edges, so you're inside the maze: big dark stalks that run off the top and bottom
 [[3,1],[15,4],[W-8,2],[W-20,5]].forEach(([x,sd])=>stalk(K,x,H,-8,Object.assign({ear:C.fore.stalk},C.fore),true,sd));
 // light: the lead's lantern pools on the ground at the agents' feet at night; it's smaller below 40 SAN
 if(nt){const k=low?.65:1;K.pool(W/2,H+4,124*k,(H-hz)*.7*k,'#d9772b',.34,5);K.pool(W/2,H,60*k,(H-hz)*.35*k,'#d6a43a',.18,3)}
 else if(dk)K.pool(mx,hz,120,(H-hz)*.5,'#d9772b',.16,4)},
town(K,W,H,hz,o){const R=K.R,nt=o.light==='night',dk=o.light==='dusk',low=o.low,lit=nt||dk;
 const C=nt?{sky:['#0a0c1a','#0e1226','#13182e','#1a1f38'],far:'#14162a',cream:'#4a4458',creamD:'#3a3448',pink:'#7a3a52',plank:'#2e2a40',plankD:'#24203a',brick:'#5a2a26',brickD:'#401c1e',mortar:'#2a1a1e',roof:'#16141e',
   win:'#e7b65a',winD:'#a8783a',awn:['#6a2a2a','#5a5068'],side:'#3a3646',sideD:'#2a2634',curb:'#4e4a5a',street:['#1e1a24','#221d28','#26202c'],dash:'#6a5a3a',iron:'#141218',ironLit:'#3a3448',leaf:['#6a2a1e','#7a3e1a','#6a5020'],white:'#8a8498'}
  :dk?{sky:['#2a2030','#46283a','#7a3436','#b5532e','#d9772b'],far:'#3a2236',cream:'#c8a890',creamD:'#9a7a6a',pink:'#c05a6e',plank:'#6a4a5a',plankD:'#4e3646',brick:'#9a4228',brickD:'#6e2e20',mortar:'#c08a6a',roof:'#2a1a22',
   win:'#f0c060',winD:'#c08a3a',awn:['#a8323e','#e0c8a8'],side:'#8a7068',sideD:'#6a5250',curb:'#b09080',street:['#3a2c34','#42323a','#4a3840'],dash:'#c8a040',iron:'#1a141c',ironLit:'#6a4a4a',leaf:['#b5532e','#d9772b','#d6a43a'],white:'#e8d8c8'}
  :{sky:['#6a98c0','#7ea8cc','#94b8d6','#aac8de','#c4d8e2'],far:'#8aa0b8',cream:'#e8dcc0',creamD:'#c0b090',pink:'#d86a8a',plank:'#8a7a9a',plankD:'#6a5a7a',brick:'#b5532e',brickD:'#8a3c24',mortar:'#d8b8a0',roof:'#3a2a30',
   win:'#5a7ab0',winD:'#3e5a8a',awn:['#c0392b','#f4f1e8'],side:'#b0a8a0',sideD:'#908880',curb:'#d0c8c0',street:['#5a5260','#625a68','#6a6270'],dash:'#e8d070',iron:'#2a2a34',ironLit:'#6a6a7a',leaf:['#b5532e','#d9772b','#d6a43a'],white:'#f4f1e8'};
 const sd=7,base=hz-sd,bh=Math.round(Math.max(40,Math.min(base-8,base*.8))),top=base-bh;
 K.bands(0,base,C.sky,W);
 if(nt){for(let i=0;i<40;i++){const x=K.hash(i,3)*W|0,y=K.hash(i,4)*(top+10)|0;R(x,y,1,1,i%5?'#5a6080':'#c8c8e0')}
  const mx=Math.round(W*.2),my=Math.max(8,Math.round(top*.4));K.pool(mx,my,20,20,'#3a4470',.5,3);K.ell(mx,my,6,6,'#e8dcc0');K.ell(mx+3,my-2,5,5,C.sky[0])}
 else if(dk){[[20,.35],[120,.55],[180,.25]].forEach(([x,f])=>{R(x,Math.round(top*f),52,2,'#5a2c40');R(x+10,Math.round(top*f)-1,26,1,'#6a3448')})}
 else{[[50,.4],[175,.3]].forEach(([x,f])=>{const y=Math.round(top*f)+5;K.ell(x,y,16,4,'#e8eef2');K.ell(x+8,y-3,9,4,'#f4f6f8')})}
 // the church steeple behind the shops, the tallest thing in town
 const cx0=Math.round(W*.6),tw0=nt?'#3a3850':dk?'#a88a8a':'#d8d4cc',tw1=nt?'#2a2840':dk?'#7a6070':'#a8a49c',spire=nt?'#14121e':dk?'#2a1a26':'#3a2a30';
 R(cx0-8,top-10,16,bh,tw0);R(cx0+4,top-10,4,bh,tw1);R(cx0-3,top-5,6,8,spire);K.ell(cx0,top-5,3,3,spire);if(lit)R(cx0-1,top-3,2,5,'#e7b65a');
 R(cx0-10,top-12,20,3,spire);for(let k=0;k<22;k++){const hw=Math.max(1,Math.round(9-k*.4));R(cx0-hw,top-13-k,hw*2,1,spire);if(hw>2)R(cx0-hw,top-13-k,1,1,tw1)}
 R(cx0-1,top-42,2,8,spire);R(cx0-3,top-39,6,2,spire);
 // the diner, cream and pink, big lit windows and its sign on the roof
 const dx=-2,dw=80,dt=top+Math.round(bh*.28);R(dx,dt,dw,base-dt,C.cream);R(dx,dt,dw,3,C.pink);R(dx,base-5,dw,5,C.pink);R(dx+dw-3,dt,3,base-dt,C.creamD);R(dx,dt+3,dw,1,C.creamD);
 const sy=dt-12;R(dx+18,sy,40,11,C.roof);R(dx+19,sy+1,38,9,C.pink);K.text('DINER',dx+28,sy+3,lit?'#fff0c0':'#f4f1e8');R(dx+24,sy+11,2,dt-sy-11,C.roof);R(dx+50,sy+11,2,dt-sy-11,C.roof);
 const wy=dt+8,wh=Math.max(8,base-dt-18);for(const x of[dx+6,dx+22,dx+58]){R(x,wy,14,wh,C.roof);R(x+1,wy+1,12,wh-2,C.win);R(x+1,wy+1,12,2,C.winD);R(x+7,wy+1,1,wh-2,C.roof)}
 R(dx+40,wy-2,12,base-5-wy+2,C.roof);R(dx+41,wy-1,10,base-5-wy+1,C.winD);R(dx+48,wy+Math.round(wh/2),2,2,'#d6a43a');
 // the general store: board siding, a striped awning over the display window, pumpkins on a crate
 const gx=78,gw=62;R(gx,top+6,gw,base-top-6,C.plank);for(let y=top+9;y<base;y+=4)R(gx,y,gw,1,C.plankD);R(gx+gw-3,top+6,3,base-top-6,C.plankD);
 R(gx-2,top+3,gw+4,4,C.roof);R(gx+4,top+10,54,8,C.roof);R(gx+5,top+11,52,6,lit?'#e8d8b0':'#f4f1e8');K.text('FEED',gx+12,top+12,C.roof);K.text('SEED',gx+36,top+12,C.roof);R(gx+30,top+13,2,2,C.pink);
 for(const x of[gx+8,gx+40]){R(x,top+22,14,10,C.roof);R(x+1,top+23,12,8,C.win);R(x+1,top+23,12,1,C.winD)}
 const ay=base-Math.max(18,Math.round(bh*.42));for(let x=gx-2,i=0;x<gx+gw+2;x+=6,i++){R(x,ay,6,6,C.awn[i%2]);R(x+1,ay+6,4,2,C.awn[i%2])}R(gx-2,ay,gw+4,1,C.roof);
 R(gx+6,ay+9,32,base-ay-10,C.roof);R(gx+7,ay+10,30,base-ay-12,C.win);R(gx+44,ay+9,12,base-ay-9,C.roof);R(gx+45,ay+10,10,base-ay-10,C.winD);
 const pk=lit?'#d9772b':'#e08a3a';for(const [x,r] of[[gx+12,4],[gx+21,3],[gx+29,4]]){K.ell(x,base-4-r+3,r+1,r,pk);R(x,base-4-r*2+2,1,2,'#4a5a2c')}
 // a brick building: two floors, a cornice, and one window you can see somebody in
 const bx=140,bw=66,bt=top+Math.round(bh*.12);R(bx,bt,bw,base-bt,C.brick);
 for(let y=bt+3,j=0;y<base;y+=3,j++){R(bx,y,bw,1,C.brickD);for(let x=bx+(j%2?2:6);x<bx+bw;x+=8)R(x,y-2,1,2,C.brickD)}
 R(bx-2,bt-3,bw+4,4,C.roof);R(bx,bt+1,bw,1,C.mortar);R(bx+bw-3,bt,3,base-bt,C.brickD);
 const rows=[bt+8,bt+Math.round((base-bt)*.5)];rows.forEach((y,j)=>[bx+8,bx+26,bx+44].forEach((x,i)=>{const on=lit?(i+j)%2===0:false;R(x-1,y-1,14,13,C.mortar);R(x,y,12,11,on?C.win:(lit?'#1a1622':C.winD));R(x,y+5,12,1,C.roof);R(x+5,y,1,11,C.roof);
  if(on&&i===1&&j===0){R(x+7,y+3,4,8,'#2a1a1e');K.ell(x+9,y+3,2,2,'#2a1a1e')}}));
 // a house porch at the right edge
 const hx=206;R(hx,top+Math.round(bh*.4),W-hx,base-top-Math.round(bh*.4),C.cream);for(let y=top+Math.round(bh*.4)+3;y<base;y+=4)R(hx,y,W-hx,1,C.creamD);
 for(let k=0;k<10;k++)R(hx-2+k,top+Math.round(bh*.4)-k,W-hx+4-k*2,1,C.roof);
 // Harvest Walk bunting strung across the street, above the shops
 const b0=-2,b1=Math.round(W*.86),by=Math.max(3,top-18);for(let x=b0;x<=b1;x++){const y=by+Math.round(Math.sin((x-b0)/(b1-b0)*Math.PI)*8);R(x,y,1,1,C.roof);
  if((x-b0)%7===3){const c=[C.awn[0],'#d9772b',C.white,'#d6a43a'][((x-b0)/7|0)%4];for(let k=0;k<4;k++)R(x-2+(k>>1),y+1+k,Math.max(1,5-k*2+(k>>1)),1,c)}}
 // the sidewalk and curb, the street the fighters stand on: a faded center line, a manhole, fallen leaves
 R(0,base,W,sd,C.side);for(let x=12;x<W;x+=24)R(x,base,1,sd,C.sideD);R(0,base,W,1,C.sideD);
 R(0,hz-1,W,2,C.curb);R(0,hz+1,W,1,C.sideD);
 K.bands(hz+2,H,C.street,W);
 const ly=hz+2+Math.round((H-hz)*.42);for(let x=-6;x<W;x+=26)R(x,ly,14,2,C.dash);
 K.ell(Math.round(W*.2),H-Math.round((H-hz)*.18),12,3,C.sideD);K.ell(Math.round(W*.2),H-Math.round((H-hz)*.18),10,2,C.street[0]);
 for(let i=0;i<46;i++){const t=K.hash(i,21),y=Math.round(hz+2+t*t*(H-hz-3)),x=K.hash(i,22)*W|0,c=C.leaf[i%3],s=t>.6?3:2;R(x,y,s,s-1,c);R(x+1,y+s-1,1,1,c);if(i%4===0)R(x-1,y,1,1,c)}
 for(const [x,r] of[[dx+38,3],[gx-6,4]]){K.ell(x,base+3,r+1,r-1,pk);R(x,base+3-r,1,2,'#4a5a2c')}
 // the near curb: the agents stand on this side of the street
 const ny=H-Math.max(10,Math.round((H-hz)*.12));R(0,ny,W,2,C.curb);R(0,ny+2,W,H-ny-2,C.side);for(let x=6;x<W;x+=30)R(x,ny+2,1,H-ny-2,C.sideD);R(0,ny-1,W,1,C.street[0]);
 // the lamp post on the right, on the curb: iron post, a four-pane lantern head, lit from dusk on
 const lx=Math.round(W*.93),lt=Math.max(8,top-6),lb=hz;
 R(lx-5,lb-7,11,7,C.iron);R(lx-4,lb-9,9,2,C.iron);R(lx-5,lb-7,1,7,C.ironLit);R(lx-1,lt+12,3,lb-lt-20,C.iron);R(lx-1,lt+12,1,lb-lt-20,C.ironLit);
 R(lx-3,lt+12,7,2,C.iron);for(let k=0;k<4;k++)R(lx-6+k,lt-k,13-k*2,1,C.iron);R(lx,lt-6,1,3,C.iron);R(lx-7,lt+1,15,2,C.iron);
 R(lx-5,lt+3,11,9,C.iron);R(lx-4,lt+4,9,7,lit?'#ffd166':'#c8d0d8');R(lx-4,lt+4,9,1,lit?'#fff0b0':'#e8eef2');R(lx,lt+4,1,7,C.iron);R(lx-6,lt+11,13,2,C.iron);R(lx-5,lt+3,1,9,C.ironLit);
 if(lit){const k=low?.7:1;K.pool(lx,lt+7,28*k,28*k,'#d6a43a',.4,4);K.pool(lx,lb+4,46*k,12*k,'#d6a43a',.3,4);R(lx-3,lt+5,2,4,'#fff8e0')}
 // the windows' glow on the sidewalk at night, the lead's lantern on the street, and dusk's low warm light
 if(nt){for(const x of[dx+13,dx+29,dx+65,gx+22])K.pool(x,base+3,10,4,'#e7b65a',.25,2);const k=low?.65:1;K.pool(W/2,H+4,118*k,(H-hz)*.7*k,'#d9772b',.3,5)}
 else if(dk)K.pool(W*.35,base,140,30,'#d9772b',.12,4)}
};
const SZ=k=>{const A=B[k==='gleaner2'?'gleaner':k];return A?[A.w,A.h]:[16,16]};
const cache=new Map();
// step: the damage step (0 unhurt, 1 at half HP, 2 at a quarter). A wounded sprite is 8 px wider each side so a lean or a
// spill isn't cut off; it's drawn centred, so it stays put. Same height, so the feet stay on the ground.
function sprite(k,frame,step){step=step|0;const base=k==='gleaner2'?'gleaner':k,key=k+(frame?1:0)+':'+step;let c=cache.get(key);if(c)return c;const A=B[base];if(!A)return null;
 const L=Ly(A.w,A.h,step?WPAD:0);A.f(L,frame?1:0,k==='gleaner2');if(step){Wk.cut(L,-WPAD,0,WPAD,A.h);Wk.cut(L,A.w,0,WPAD,A.h);if(WOUND[base])WOUND[base](L,step,frame?1:0,k==='gleaner2')}
 c=document.createElement('canvas');c.width=L.W;c.height=A.h;blit(c.getContext('2d'),L);cache.set(key,c);return c}
const pc={};
function portrait(ctx,open){const k=open?1:0;if(!pc[k]){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),L=Ly(64,64);P.f(L,k);x.fillStyle=P.bg;x.fillRect(0,0,64,64);if(P.under)P.under(x,k);blit(x,L);pc[k]=c}
 ctx.clearRect(0,0,64,64);ctx.drawImage(pc[k],0,0)}
return{B,sprite,size:SZ,portrait,backdrop};
})();
