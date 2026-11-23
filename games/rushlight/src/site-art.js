// Rushlight · site-art.js
// Contract sites drawn in code, tile by tile (16 px), in the earth palette, after the approved site mockups
// (rushlight-mockups-site-v1, the charcoal camp; the rough site mockups 30–33 for Hollin, Sallow End, the causeway and
// Crookback). Exposes drawSiteTiles(M, camx, camy) for engine.js's drawWorld, and the site's light (sites at night or
// dusk use the shared night light, with Tallow pools from the rushlight, fires and lamps).
// Tile key: . ground · , path · T tree · H hut wall · D door · w woodpile · f fire pit · r drying rack · c charcoal clamp
//   ~ water · b boat · o osier beds · q causeway planks · g open grave · W stone wall · h house front · k church · s stook
//   y field (rye) · x bones · O oven · l ladder · p pump house · m whim · u spoil heap · L lamp · S shaft · a ash/ruin
const SA={peat:'#1c1814',soot:'#2c2621',bone:'#e6dcc4',ash:'#857e72',straw:'#c8a552',tallow:'#d9b45a',rust:'#9a4528',moss:'#56623a',mossD:'#434d2c',dusk:'#3b4757',duskL:'#5c6c7c',
 dirt:'#5a4a3a',dirtD:'#4a3c2e',dirtL:'#6a5846',path:'#7a6450',bark:'#3e2a1c',timber:'#5a3e2b',thatch:'#a8873e',thatchD:'#7e6430',stone:'#8a8274',stoneD:'#6a6458',water:'#2a3a48',waterL:'#3b5060',rye:'#c8a552',ryeD:'#a8873e'};
const siteTC={};
function siteTile(ch,v,tod){const k=ch+v+tod;if(siteTC[k])return siteTC[k];const c=document.createElement('canvas');c.width=c.height=16;const x=c.getContext('2d');
 const p=(a,b,w,h,col)=>{x.fillStyle=col;x.fillRect(a,b,w,h)};const gr=tod==='noon'?['#8a7a42','#a08c4a','#76683a']:[SA.dirt,SA.dirtL,SA.dirtD];
 const ground=()=>{p(0,0,16,16,gr[0]);p((v*5)%13,3,2,1,gr[1]);p((v*7)%11+2,11,1,1,gr[2]);p(4,(v*3)%12+2,1,1,gr[2]);if(v===2)p(9,6,2,1,SA.mossD)};
 switch(ch){
 case '.':ground();break;
 case ',':p(0,0,16,16,SA.path);p((v*5)%13,4,2,1,'#6a5644');p(3,(v*7)%12,1,1,'#8a745e');break;
 case 'T':ground();p(6,9,4,7,SA.bark);p(1,0,14,11,SA.mossD);p(2,1,12,8,SA.moss);p(4,2,3,2,'#6a7a4a');p(1,9,14,2,'rgba(0,0,0,.3)');break;
 case 'H':p(0,0,16,16,SA.timber);for(let i=0;i<16;i+=4)p(0,i,16,1,SA.bark);p(0,0,16,3,SA.thatch);p(0,3,16,1,SA.thatchD);break;
 case 'D':p(0,0,16,16,SA.timber);p(0,0,16,3,SA.thatch);p(3,4,10,12,SA.peat);p(4,5,8,11,'#2a1e16');break;
 case 'w':ground();for(let r=0;r<3;r++)for(let q=0;q<3;q++){p(1+q*5,4+r*4,4,4,SA.timber);p(2+q*5,5+r*4,2,2,SA.straw)}break;
 case 'f':ground();p(2,6,12,8,SA.stoneD);p(3,7,10,6,SA.peat);p(5,8,2,2,SA.rust);p(9,9,2,1,SA.tallow);p(7,10,2,2,'#c8603a');break;
 case 'r':ground();p(1,2,2,14,SA.bark);p(13,2,2,14,SA.bark);p(1,2,14,2,SA.bark);for(let q=3;q<13;q+=3)p(q,4,1,4,SA.moss);break;
 case 'c':ground();p(1,6,14,9,'#3a3028');p(3,4,10,3,'#4a3c30');p(6,2,4,3,'#5a4a3c');p(4,9,2,1,SA.rust);break;
 case '~':p(0,0,16,16,SA.water);p((v*3)%12,4,4,1,SA.waterL);p((v*5)%10+3,11,3,1,SA.waterL);break;
 case 'b':p(0,0,16,16,SA.water);p(1,5,14,7,SA.timber);p(2,6,12,2,SA.bark);break;
 case 'o':ground();for(let q=0;q<16;q+=3)p(q,2+(q%2)*3,1,12,'#6a7a4a');break;
 case 'q':p(0,0,16,16,SA.water);p(0,2,16,12,SA.timber);for(let q=0;q<16;q+=4)p(q,2,1,12,SA.bark);break;
 case 'g':ground();p(3,4,10,9,SA.peat);p(2,3,12,1,SA.dirtL);p(13,2,2,5,SA.stone);break;
 case 'W':p(0,0,16,16,SA.stone);p(0,4,16,1,SA.stoneD);p(0,10,16,1,SA.stoneD);p(6,0,1,4,SA.stoneD);p(11,5,1,5,SA.stoneD);break;
 case 'h':p(0,0,16,16,'#b8ab8c');p(0,0,16,3,SA.thatchD);p(0,15,16,1,SA.bark);p(5,5,6,6,SA.peat);p(7,5,1,6,SA.bark);break;
 case 'k':p(0,0,16,16,SA.stone);p(0,5,16,1,SA.stoneD);p(6,6,4,10,SA.peat);x.fillStyle=SA.peat;x.beginPath();x.arc(8,6,2,Math.PI,0);x.fill();break;
 case 's':p(0,0,16,16,gr[0]);p(5,3,6,12,SA.rye);p(4,6,8,2,SA.ryeD);p(7,1,2,3,SA.rye);break;
 case 'y':p(0,0,16,16,SA.rye);for(let q=0;q<16;q+=2)p(q,(q*3+v)%5,1,6,SA.ryeD);break;
 case 'x':ground();p(3,7,8,1,SA.bone);p(4,10,6,1,SA.bone);p(2,8,1,2,SA.bone);break;
 case 'O':p(0,0,16,16,SA.stone);p(2,6,12,10,SA.stoneD);x.fillStyle=SA.peat;x.beginPath();x.arc(8,10,5,Math.PI,0);x.fill();p(3,10,10,6,SA.peat);break;
 case 'l':p(0,0,16,16,SA.peat);p(4,0,1,16,SA.timber);p(11,0,1,16,SA.timber);for(let q=2;q<16;q+=4)p(4,q,8,1,SA.timber);break;
 case 'S':p(0,0,16,16,SA.peat);p(0,0,16,2,SA.stoneD);p(0,14,16,2,SA.stoneD);break;
 case 'p':p(0,0,16,16,SA.stone);p(0,0,16,4,'#4a4a52');p(4,6,8,10,SA.peat);p(6,8,4,2,SA.rust);break;
 case 'm':ground();p(7,0,2,16,SA.bark);p(1,2,14,2,SA.bark);p(2,4,2,6,SA.bark);p(12,4,2,6,SA.bark);break;
 case 'u':ground();p(1,6,14,10,'#4a4038');p(3,3,10,4,'#5a5046');p(6,1,4,3,'#6a6054');break;
 case 'L':ground();p(7,6,2,10,SA.bark);p(5,2,6,5,SA.tallow);p(6,3,4,3,'#fff1c4');break;
 case 'a':ground();p(1,8,14,8,'#3a3028');p(2,4,3,5,SA.stoneD);p(10,2,4,7,SA.stoneD);p(6,10,4,2,SA.ash);break;
 default:ground();
 }
 return siteTC[k]=c}
function drawSiteTiles(M,camx,camy){
 const x0=Math.floor(camx/16),y0=Math.floor(camy/16)-1;
 for(let ty=y0;ty<=y0+Math.ceil(VH/16)+1;ty++)for(let tx=x0;tx<=x0+Math.ceil(VW/16)+1;tx++){let ch=M.g[ty]&&M.g[ty][tx];if(!ch){if(tx<0||tx>=M.w)continue;ch=M.edge||'T'}cx.drawImage(siteTile(ch,(tx*7+ty*13)%4,M.tod),tx*16-camx,ty*16-camy)}
}
// the site's light: dusk and night darken everything but the rushlight's pool, fires and lamps (engine/light.js)
function siteLight(M,camx,camy){
 if(M.tod==='noon'||M.tod==='day')return;
 const pools=[[G.px+8-camx,G.py+6-camy,(M.tod==='night'?52:70)+(G.site&&G.site.lit?30:0)]];
 for(let ty=0;ty<M.h;ty++)for(let tx=0;tx<M.w;tx++){const ch=M.g[ty][tx];if(ch==='f'||ch==='L')pools.push([tx*16+8-camx,ty*16+8-camy,ch==='f'?46:30])}
 StudioLight.night(cx,{dark:'#1c1814',alpha:M.tod==='night'?.86:M.tod==='overcast'?.25:.55,warm:'#d9b45a',pools});
}
