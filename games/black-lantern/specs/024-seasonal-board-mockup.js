// Mockup only: seasonal keepsakes drawn over the real case board (spec 004/009 build). Not game code.
window.MK=function(season){
 const R=(x,y,w,h,c)=>pR(x,y,w,h,c),D=PC.dark;
 const pin=(x,y,c)=>drawPin(x,y,c);
 const rot=(x,y,deg,f)=>{cx.save();cx.translate(x,y);cx.rotate(deg*Math.PI/180);f();cx.restore()};
 const shadow=(x,y,w,h)=>R(x+2,y+2,w,h,'rgba(18,14,24,.45)');
 // ---- Season 1 ----
 const doll=(x,y)=>{rot(x,y,-6,()=>{ // burlap head and corn husk body, stitched smile
   shadow(0,0,20,30);
   R(3,10,14,20,'#c9a65a');R(3,10,1,20,'#8a6a2e');R(16,10,1,20,'#8a6a2e');R(5,12,2,16,'#e0c47a');R(10,12,1,16,'#a8843e');R(13,13,2,15,'#b8944a');
   R(1,0,18,12,D);R(2,1,16,10,'#b08a52');R(3,2,6,3,'#c9a46a');for(let i=0;i<4;i++)R(4+i*4,4+(i%2),1,1,'#8a6a3a');
   R(5,4,2,2,D);R(13,4,2,2,D);for(let i=0;i<6;i++)R(5+i*2,8+(i%2),2,1,'#3a2418');R(4,7,1,2,'#3a2418');R(15,7,1,2,'#3a2418');
   R(0,11,20,2,'#7a5a2a');});pin(x+9,y-1,PC.mus)};
 const lantern=(x,y)=>{rot(x,y,5,()=>{shadow(0,0,16,20);R(5,0,6,2,D);R(1,2,14,16,D);R(2,3,12,14,'#d9772b');R(3,3,4,14,'#f0a050');R(2,7,12,1,'#a8521e');R(2,12,12,1,'#a8521e');R(6,8,4,4,'#ffe08a');R(5,18,6,2,D)});pin(x+8,y-1,PC.rust)};
 const leaf=(x,y,deg=20)=>rot(x,y,deg,()=>{const c='#b5532e',h='#d9772b';[[6,0,2],[4,2,6],[1,4,12],[0,6,14],[2,8,10],[1,10,12],[4,12,6],[6,14,2]].forEach(([a,b,w])=>R(a,b,w,2,c));R(3,5,4,2,h);R(7,1,1,16,'#7a2e18');R(7,17,1,4,'#5a2414')});
 const box=(x,y)=>{rot(x,y,-4,()=>{shadow(0,0,36,24);R(0,0,36,24,D);R(1,1,34,22,'#b08a5a');R(1,1,34,3,'#c9a46e');R(1,19,34,4,'#8e6a40');
   pT('LOT 83',4,5,'#1b1f33',13);R(4,17,22,1,'#1b1f33');
   [[26,16,8,6],[30,12,4,4],[22,19,6,3]].forEach(([a,b,w,h])=>{R(a,b,w,h,'#6a9a2a');R(a+1,b,w-2,1,'#a8e04a')});R(28,15,2,2,'#d8ff7a');R(31,11,2,2,'#d8ff7a')});pin(x+16,y,'#a8e04a')};
 const tape=(x,y)=>{rot(x,y,7,()=>{shadow(0,0,40,22);R(0,0,40,22,D);R(1,1,38,20,'#26222c');R(5,4,30,10,'#e8dcc0');R(5,4,30,2,'#ff3fa4');pT('WE KNOW',8,6,'#1b1f33',11);
   R(9,15,6,5,'#120e18');R(25,15,6,5,'#120e18');R(11,16,2,3,'#5a5260');R(27,16,2,3,'#5a5260')});pin(x+20,y,'#ff3fa4')};
 const polaroid=(x,y)=>rot(x,y,-9,()=>{shadow(0,0,22,26);R(0,0,22,26,D);R(1,1,20,24,'#ece4d0');R(3,3,16,15,'#1b1f33');R(3,13,16,5,'#22302a');
   [[4,9],[7,7],[10,10],[13,6],[16,9]].forEach(([a,b])=>{R(a,b,2,13-b+5,'#0e1410');R(a-1,b+2,4,2,'#0e1410')});R(15,4,2,2,'#e8dcc0')});
 // ---- Season 2 ----
 const bill=(x,y)=>{rot(x,y,-5,()=>{shadow(0,0,36,44);R(0,0,36,44,D);R(1,1,34,42,'#e6da8c');R(1,1,34,4,'#cdbd6a');
   pT('THE KING',4,6,'#120d14',6,PXf);pT('IN YELLOW',3,14,'#120d14',6,PXf);R(4,23,28,1,'#b0962e');pT('ACT I',10,26,'#7a5a14',11);
   R(1,36,34,7,'#e6da8c');for(let i=0;i<6;i++)R(1+i*6,40+(i%2)*2,6,4,'#7d6233')});pin(x+18,y,'#b0962e')};
 const tatter=(x,y)=>{rot(x,y,4,()=>{const c='#b0962e',d='#7d6a1e';[[0,0,10],[1,6,9],[0,12,8],[2,18,7],[1,24,6],[3,30,4]].forEach(([a,b,w])=>{R(a,b,w,6,c);R(a+w-2,b,2,6,d)});R(5,36,2,4,c);R(1,34,2,5,c);R(2,2,2,26,'#cdb24a')});pin(x+5,y,'#b0962e')};
 const ticket=(x,y)=>rot(x,y,11,()=>{shadow(0,0,30,14);R(0,0,30,14,D);R(1,1,28,12,'#cdbd6a');for(let i=0;i<6;i++)R(20,2+i*2,1,1,'#7d6233');pT('ADMIT',3,1,'#120d14',10);pT('ONE',4,6,'#120d14',10);R(22,4,5,6,'#b0962e')});
 const key=(x,y)=>rot(x,y,-14,()=>{shadow(0,0,30,12);R(0,3,4,6,'#8a7330');R(1,4,2,4,'#120d14');R(4,5,10,2,'#b0962e');R(10,7,2,2,'#b0962e');R(13,7,2,3,'#b0962e');R(14,0,16,12,D);R(15,1,14,10,'#d8cfa0');pT('9',19,0,'#5a1a18',12)});
 const flower=(x,y)=>rot(x,y,15,()=>{R(5,8,1,14,'#6a6a3a');R(3,14,3,2,'#6a6a3a');[[3,0],[7,1],[0,4],[8,5],[4,6]].forEach(([a,b])=>{R(a,b,4,4,D);R(a+1,b+1,3,3,'#e8e4cc')});R(4,3,3,3,'#b0962e')});
 const cass=(x,y)=>rot(x,y,6,()=>{shadow(0,0,30,18);R(0,0,30,18,D);R(1,1,28,16,'#3a3440');R(3,3,24,7,'#e6da8c');R(7,11,4,4,'#120d14');R(19,11,4,4,'#120d14');R(11,12,8,2,'#5a5260')});
 window.MK_back=season===1?()=>{const L=boardLayout(),sp=L.spots;
   leaf(sp[1].x+60,sp[1].y-6,35);           // season piece tucked behind a card
   doll(sp[0].x+8,sp[0].y+10);lantern(sp[0].x+40,sp[0].y+20);  // Still Harvest's spot
   box(sp[2].x+14,sp[2].y+16);leaf(sp[2].x+6,sp[2].y+40,-30);   // Lot 83's spot
   tape(sp[4].x+4,sp[4].y+14);polaroid(sp[4].x+46,sp[4].y+26); // Tracking's spot
 }:()=>{const L=boardLayout(),sp=L.spots;
   key(sp[0].x+30,sp[0].y+56);ticket(sp[1].x+30,sp[1].y-13);flower(sp[5].x+44,sp[5].y+50);
   bill(L.plaque.x-8,L.plaque.y-12);tatter(L.plaque.x+48,L.plaque.y-14);cass(sp[2].x+20,sp[2].y+52);
 };
};
