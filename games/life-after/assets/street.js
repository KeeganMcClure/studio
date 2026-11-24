// Life After street: the highway strip by day and night, drawn in code. From the approved look mockup
// mockups/04-look-street-rough-v2.js (Keegan, Nov 23). The title screen uses it at night as its mood piece
// (spec 001, 2: a dead streetlight, a car, a neon motel sign flickering), with no survivor in it.
// LA.street(g, W, H, {night, title}) draws the street; with title set, the motel sign is left dark so the
// title screen can flicker it each frame (LA.streetSign).
(function(){
const {P,mk,R,px,vol,box,shadow,person,portrait,hud}=LA;
function tuft(g,x,y,c){px(g,c[1],x,y);px(g,c[0],x-1,y+1);px(g,c[1],x+1,y+1);R(g,c[2],x-1,y+2,3,1);}
function crack(g,x,y,len,c){let cx=x,cy=y;for(let i=0;i<len;i++){px(g,c,cx,cy);cx+=1;cy+=(i%3===0?1:(i%5===0?-1:0));}}

function scene(g,W,H,night,o){
  // back lot and a treeline behind the buildings (mostly under the top bar)
  R(g,P.grass[2],0,0,W,58);
  for(let x=-6;x<W;x+=13){vol(g,x+6,30+(x%3),9,10,['#6e7a4a','#56643e','#424e32','#303a26']);}
  for(let x=0;x<W;x+=9)tuft(g,x+3,50+(x%4),P.grass);

  // ---- gas station: canopy seen from above, then the fascia, columns and pumps ----
  R(g,'#3a3c38',0,118,92,2);
  R(g,P.conc[2],0,72,92,46);               // pad under the canopy, in its shade
  R(g,'rgba(20,24,28,.38)',0,72,92,46);
  R(g,P.conc[1],22,104,46,8);R(g,P.conc[0],22,104,46,1); // pump island
  for(const x of [28,52]){box(g,x,90,10,16,['#c8c4b4','#a8a494','#8a8676','#64625a']);R(g,'#2a2e30',x+2,93,6,4);R(g,'#c8503a',x+2,99,6,2);px(g,'#1e1a16',x+9,98);R(g,'#1e1a16',x+9,99,1,6);}
  for(const x of [10,78]){box(g,x,70,4,48,['#d8d4c4','#b8b4a4','#94907e','#6e6c5e']);}
  R(g,'#e2ded0',0,54,94,13);R(g,'#c8c4b4',0,54,94,1);R(g,'#f0ece0',2,56,88,2); // canopy top, lit
  R(g,'#46605e',0,64,94,10);R(g,'#5a7472',0,64,94,2);R(g,'#2e3e3c',0,73,94,1);    // fascia
  g.font='8px "Press Start 2P"';g.textBaseline='top';
  g.fillStyle=night?P.cyan:'#8aa8a4';g.fillText('GAS·N·GO',14,65);
  // canopy shadow falls to the lower right, onto the lot
  g.fillStyle='rgba(20,24,28,.30)';g.beginPath();g.moveTo(94,74);g.lineTo(100,80);g.lineTo(100,118);g.lineTo(94,118);g.fill();
  // ice chest and a propane cage at the back of the pad
  box(g,72,78,14,10,['#e8e8e0','#c8ccc4','#a8aca4','#7e827c']);g.font='6px "Press Start 2P"';g.fillStyle='#46647e';g.fillText('ICE',74,80);
  R(g,'#3e4440',4,78,12,14);for(let i=5;i<16;i+=3)R(g,'#6e7470',i,78,1,14);R(g,'#c8c4b4',6,84,3,7);R(g,'#c8c4b4',10,84,3,7);

  // ---- motel: flat roof, parapet, the row of rooms ----
  const mx=98;
  R(g,P.roof[1],mx,52,W-mx,18);R(g,P.roof[0],mx,52,W-mx,2);R(g,P.roof[2],mx,68,W-mx,2);
  box(g,mx+16,56,14,9,['#b8bcb4','#9a9e96','#7e827a','#5e625c']);R(g,'#5e625c',mx+18,58,10,1);R(g,'#5e625c',mx+18,61,10,1); // AC unit
  box(g,mx+72,57,12,8,['#b8bcb4','#9a9e96','#7e827a','#5e625c']);
  R(g,'#5e5e58',mx+50,55,3,8);R(g,'#7a7a72',mx+50,55,1,8);px(g,'#3a3a38',mx+51,54); // vent pipe
  R(g,'rgba(20,24,28,.25)',mx+31,63,4,3);R(g,'rgba(20,24,28,.25)',mx+85,63,4,3);
  // wall
  R(g,P.ochre[1],mx,70,W-mx,42);R(g,P.ochre[0],mx,70,2,42);R(g,P.ochre[2],mx,70,W-mx,2);
  R(g,P.tealw[1],mx,70,W-mx,4);R(g,P.tealw[0],mx,70,W-mx,1);R(g,P.tealw[3],mx,74,W-mx,1); // trim band
  for(let i=0;i<6;i++){const dx=mx+8+i*24,open=i===2;
    // window
    R(g,'#2a3234',dx+14,82,8,8);R(g,P.tealw[2],dx+14,82,8,1);R(g,'#46524e',dx+15,83,3,3);R(g,P.ochre[3],dx+14,90,8,1);
    if(i===4){R(g,'#5a5a50',dx+15,84,6,5);} // boarded
    // door
    const d=open?['#5af0e8','#3ff0e8','#2ab8b0','#1a8078']:P.tealw;
    box(g,dx,84,10,24,d);R(g,'#1e2428',dx,84,10,1);px(g,'#e8d08a',dx+8,96);
    g.font='6px "Press Start 2P"';g.fillStyle=open?'#0c3a38':'#c8d4cc';g.fillText(String(i+1),dx+3,86);
    if(i===5){R(g,'#1e2428',dx+1,85,4,22);} // a door left half open, dark inside
  }
  // walkway and its edge
  R(g,P.conc[1],mx,112,W-mx,8);R(g,P.conc[0],mx,112,W-mx,1);R(g,P.conc[3],mx,119,W-mx,1);
  R(g,'rgba(20,24,28,.25)',mx,112,W-mx,2); // the eave's shadow
  // ice machine and vending machine by the office end
  box(g,226,92,14,20,['#d8d8d0','#bcbcb4','#9a9a92','#74746e']);R(g,'#46647e',228,95,10,4);
  // a man who sat down against the wall and never got up (grounded: shown plainly, not lingered on)
  box(g,142,104,8,8,['#9a7448','#84603a','#6a4a2e','#4e3622']);vol(g,146,101,3.4,3.6,P.skinB);R(g,P.hairG[2],143,98,7,2);
  R(g,P.jeans[2],141,111,10,2);R(g,P.blood,140,113,9,1);R(g,P.bloodD,147,113,6,1);

  // ---- the lot ----
  R(g,P.asph[1],0,120,W,78);
  R(g,P.asph[0],0,120,W,1);
  for(let x=mx+20;x<W;x+=34){R(g,'#c8c0a0',x,124,1,22);R(g,'#a8a08a',x,146,1,2);} // faded bay lines
  R(g,P.asph[3],60,170,14,5);R(g,P.asph[2],58,171,18,3); // oil stain
  crack(g,10,140,26,P.asph[3]);crack(g,104,180,20,P.asph[3]);crack(g,200,186,18,P.asph[3]);
  tuft(g,22,144,P.grass);tuft(g,116,183,P.grass);tuft(g,212,189,P.grass);tuft(g,90,121,P.grass);
  R(g,'#8a9aa0',176,176,12,4);R(g,'#a8b8bc',177,176,8,1);R(g,'#6e7a7e',176,179,12,1); // puddle catching the sky
  // dead station wagon in bay 3, nose out
  shadow(g,186,148,25,.32);g.drawImage(LA.car({len:48,ramp:P.red,wagon:1}),162,128);
  // shopping cart on its side and trash bags by the machines
  R(g,'#9aa0a0',120,150,13,1);for(let i=120;i<133;i+=3)R(g,'#9aa0a0',i,150,1,7);R(g,'#9aa0a0',120,157,13,1);R(g,'#1a1a1a',121,158,2,2);R(g,'#1a1a1a',130,158,2,2);
  for(const [x,y] of [[216,120],[226,122],[220,128]]){vol(g,x,y,5,4,['#4a524e','#363c3a','#262a28','#181a1a']);px(g,'#7e8682',x-2,y-2);}
  shadow(g,226,133,10,.3);
  // a stray dog nosing the bags (alive; it moves)
  shadow(g,204,139,6,.3);box(g,198,132,10,5,['#c8a070','#a8844e','#84663a','#5e4a2a']);vol(g,196,131,3,2.6,['#c8a070','#a8844e','#84663a','#5e4a2a']);
  R(g,'#5e4a2a',199,137,1,3);R(g,'#5e4a2a',206,137,1,3);R(g,'#84663a',208,131,2,1);px(g,'#1a1410',194,131);

  // payphone, newspaper box and a dropped bike, so the lot's left side isn't bare
  box(g,4,122,9,16,['#b8bcb4','#9a9e96','#7e827a','#5e625c']);R(g,'#2a2e30',6,125,5,5);R(g,'#46647e',5,122,7,2);R(g,'#1e1a16',11,130,1,6);shadow(g,12,139,6,.3);
  box(g,18,128,8,10,['#d06a3a','#b4582e','#8a4028','#6a3424']);R(g,'#e8dcc0',19,130,6,3);shadow(g,24,139,5,.3);
  g.strokeStyle='#3a4a5a';g.lineWidth=1;g.beginPath();g.arc(66,166,4,0,7);g.arc(80,168,4,0,7);g.stroke();R(g,'#c8503a',66,164,14,1);R(g,'#c8503a',72,160,1,5);R(g,'#1a1a1a',70,159,4,1);
  R(g,'#d8c08a',38,182,6,4);R(g,'#b8a070',38,185,6,1);px(g,'#e8e0c8',90,148);px(g,'#e8e0c8',92,149);R(g,'#c8c4b4',100,160,4,3); // litter: a burger box, napkins, a cup
  // curb
  R(g,P.conc[1],0,196,W,4);R(g,P.conc[0],0,196,W,1);R(g,P.conc[3],0,199,W,1);

  // ---- the road ----
  R(g,P.asph[2],0,200,W,44);R(g,P.asph[1],0,200,W,1);
  for(let x=4;x<W;x+=26)R(g,'#d8c08a',x,221,13,2);
  g.fillStyle='rgba(30,30,30,.35)';for(let i=0;i<40;i++){g.fillRect(96+i,226+i*0.25,1,2);g.fillRect(100+i,231+i*0.25,1,2);} // skid marks
  // crashed sedan, nose in the ditch, driver door open
  shadow(g,44,236,26,.35);g.drawImage(LA.car({len:46,ramp:['#b8c4cc','#8a96a0','#6e7a84','#4e5860'],wreck:1}),20,212);
  R(g,'#525c64',36,231,9,3);R(g,'#8a96a0',36,231,9,1);R(g,'#2e3a40',37,234,7,1); // the open door swung toward us
  R(g,P.blood,40,238,3,1);R(g,P.bloodD,38,240,5,1);
  // a tire in the lane
  vol(g,130,234,5,3,['#3e3e3e','#2a2a2a','#1e1e1e','#121212']);R(g,'#4e4e4e',128,233,4,1);
  // shoulder and grass verge
  R(g,P.dirt[1],0,244,W,6);R(g,P.dirt[0],0,244,W,1);for(let x=3;x<W;x+=7)px(g,P.dirt[3],x,247+(x%3));
  R(g,P.grass[1],0,250,W,H-250);
  for(let y=254;y<H;y+=9)for(let x=(y%2)*5;x<W;x+=11)tuft(g,x,y,P.grass);
  // fence line and the field beyond (bottom edge framed, never blank ground)
  const fy=H-22;R(g,P.dirt[2],0,fy+8,W,H-fy-8);
  for(let y=fy+10;y<H;y+=4)R(g,P.dirt[3],0,y,W,1); // furrows: flat rows of shape, no grain
  for(let x=4;x<W;x+=20){box(g,x,fy-6,3,14,['#9a845c','#84704e','#6a5a40','#4e4434']);}
  R(g,'#5e5a54',0,fy-3,W,1);R(g,'#5e5a54',0,fy+2,W,1);

  // weeds and a rusted drum on the verge
  for(const [x,y] of [[60,262],[150,270],[176,290],[12,292]]){for(let i=0;i<4;i++){R(g,P.grass[i%2?0:2],x+i*2,y-4-(i%3)*2,1,6+(i%3)*2);} }
  box(g,160,262,10,12,['#a8583a','#8a4428','#6a3420','#4a2416']);R(g,'#6a3420',160,265,10,1);R(g,'#6a3420',160,270,10,1);shadow(g,168,275,7,.3);
  // mailbox on a post
  R(g,'#6a5a40',33,266,2,12);box(g,28,260,12,7,['#c8ccd0','#a8acb0','#868a8e','#5e6266']);R(g,'#c8503a',40,258,1,5);
  shadow(g,38,279,6,.3);
  // utility pole, wires and crows
  shadow(g,110,300,8,.32);box(g,102,236,4,64,['#9a845c','#7e6a4a','#62523a','#44382a']);R(g,'#62523a',94,240,20,2);R(g,'#c8c8c0',95,239,2,1);R(g,'#c8c8c0',111,239,2,1);
  g.strokeStyle='#2a2a2a';g.lineWidth=1;g.beginPath();g.moveTo(96,240.5);g.quadraticCurveTo(48,252,0,246);g.moveTo(112,240.5);g.quadraticCurveTo(176,250,240,236);g.stroke();
  for(const [x,y] of [[140,243],[150,244],[171,243]]){R(g,'#1a1c1e',x,y-4,4,4);px(g,'#1a1c1e',x+4,y-3);px(g,'#3a3e42',x+1,y-4);px(g,'#c8b070',x-1,y-3);}
  // motel roadside sign: VACANCY in pink, MOTEL in amber (dead by day)
  shadow(g,222,292,10,.32);box(g,218,244,3,48,['#9aa0a0','#7e8484','#626868','#464a4a']);
  R(g,'#1e2428',198,244,40,26);R(g,'#2e3638',199,245,38,24);
  const lit=night&&!o.title;
  g.font='8px "Press Start 2P"';g.fillStyle=lit?P.amber:'#8a7650';g.fillText('MOTEL',199,247);
  g.font='6px "Press Start 2P"';g.fillStyle=lit?P.pink:'#8a6a78';g.fillText('VACANCY',197,260);
  // ---- people and the dead ----
  const S=o.surv;
  if(S){shadow(g,130,184,7,.38);g.drawImage(S,121,156);}
  if(o.title){ // a dead streetlight on the curb: the arm reaches over the lot, the lamp is dark
    shadow(g,150,198,6,.32);box(g,147,128,3,70,['#9aa0a0','#7e8484','#626868','#464a4a']);R(g,'#626868',132,128,18,2);R(g,'#7e8484',132,128,18,1);
    box(g,126,127,10,4,['#7e8484','#626868','#464a4a','#2e3232']);R(g,'#3a4040',127,131,8,1);px(g,'#1e2222',130,132);}
  const Z1=person({kind:'zom',skin:P.zom,top:P.mail,legs:P.navy,shorts:1,bag:1,gore:'light'});
  shadow(g,190,234,7,.38);g.drawImage(Z1,181,206);
  const Z2=person({kind:'zom',skin:P.zom,top:P.red,overalls:1,legs:P.over,cap:P.cap,arm:'noR',gore:'heavy'});
  shadow(g,78,286,7,.38);g.drawImage(Z2,69,258);
  const Z3=person({kind:'zom',skin:P.zom,top:['#e8d070','#d0b048','#a88a34','#7a6426'],legs:['#4a4a50','#3a3a40','#2a2a30','#1e1e22'],shorts:1,hair:P.hairD,face:'right',short:1,lean:-1});
  shadow(g,56,124,6,.35);g.drawImage(Z3,47,96);
  // jersey number on the kid
  g.font='6px "Press Start 2P"';g.fillStyle='#46647e';g.fillText('7',53,110);
}

function night(g,W,H,o){
  // darkness over everything, then the light: neon, the open room, the flashlight
  const [c,d]=mk(W,H);d.fillStyle='rgba(12,16,26,.80)';d.fillRect(0,0,W,H);
  d.globalCompositeOperation='destination-out';
  const pool=(x,y,r,a)=>{const gr=d.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(0,0,0,'+a+')');gr.addColorStop(1,'rgba(0,0,0,0)');d.fillStyle=gr;d.fillRect(x-r,y-r,r*2,r*2);};
  pool(46,70,46,.7);pool(218,258,36,.75);pool(156,96,26,.75);
  if(!o.title){pool(130,172,30,.55);
  // flashlight cone, toward the mail carrier
  d.fillStyle='rgba(0,0,0,.7)';d.beginPath();d.moveTo(136,170);d.lineTo(206,200);d.lineTo(196,240);d.closePath();d.fill();}
  g.drawImage(c,0,0);
  // colored light on top
  const glow=(x,y,r,col,a)=>{const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,col.replace(')',','+a+')').replace('rgb','rgba'));gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r*2);};
  glow(46,70,40,'rgb(63,240,232)',.18);glow(218,252,30,'rgb(255,79,163)',.16);glow(218,250,24,'rgb(255,180,58)',.12);glow(156,96,22,'rgb(63,240,232)',.22);
  if(!o.title){g.fillStyle='rgba(255,236,190,.10)';g.beginPath();g.moveTo(136,170);g.lineTo(206,200);g.lineTo(196,240);g.closePath();g.fill();}
  // neon redrawn on top so it stays bright
  g.font='8px "Press Start 2P"';g.textBaseline='top';g.fillStyle=P.cyan;g.fillText('GAS·N·GO',14,65);
  if(!o.title){g.fillStyle=P.amber;g.fillText('MOTEL',199,247);g.font='6px "Press Start 2P"';g.fillStyle=P.pink;g.fillText('VACANCY',197,260);}
  if(o.title)return;
  // usable things glow cyan: room 3's door and the car with gas
  g.strokeStyle='rgba(63,240,232,.9)';g.lineWidth=1;g.strokeRect(153.5,83.5,11,25);g.beginPath();g.moveTo(175.5,129.5);g.lineTo(206.5,129.5);g.lineTo(207.5,138.5);g.lineTo(213.5,138.5);g.lineTo(213.5,154.5);g.lineTo(162.5,154.5);g.lineTo(162.5,138.5);g.lineTo(174.5,138.5);g.closePath();g.stroke();
}

LA.street=function(g,W,H,o){o=o||{};scene(g,W,H,!!o.night,o);if(o.night)night(g,W,H,o);};
// the motel sign's neon, drawn on top each frame. on: how much of it is lit (0 dead, 1 full); vac: VACANCY lit too
LA.streetSign=function(g,dy,on,vac){
  const glow=(x,y,r,col,a)=>{const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba('+col+','+a+')');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r*2);};
  if(on>0){glow(218,252+dy,30,'255,180,58',.14*on);if(vac)glow(218,262+dy,26,'255,79,163',.14*on);}
  g.font='8px "Press Start 2P"';g.textBaseline='top';g.fillStyle=on>0?P.amber:'#5a4a30';g.fillText('MOTEL',199,247+dy);
  g.font='6px "Press Start 2P"';g.fillStyle=on>0&&vac?P.pink:'#4a3a44';g.fillText('VACANCY',197,260+dy);
};
})();
