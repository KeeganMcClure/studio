// 06 sprite reference, rough v1: the bar every Life After sprite is checked against (studio art-style, Quality bar).
(function(){
const {P,R,person,portrait}=LA;
window.drawRef=function(cv){
  const g=cv.getContext('2d'),W=cv.width,H=cv.height;g.imageSmoothingEnabled=false;g.textBaseline='top';
  R(g,'#14181a',0,0,W,H);
  const lab=(t,x,y,c)=>{g.font='8px "Press Start 2P"';g.fillStyle=c||P.dim;g.fillText(t,x,y);};
  const ray={skin:P.skin,hair:P.hairD,top:P.coverall,patch:1};
  lab('YOUR SURVIVOR: PORTRAIT MOODS',8,6,P.warm);
  ['ok','tired','scared','hurt'].forEach((m,i)=>{g.drawImage(portrait(Object.assign({mood:m},ray)),8+i*70,18);lab(m.toUpperCase(),10+i*70,86);});
  lab('MAP SPRITE 1X / 3X',296,6,P.warm);
  const sp=person(ray);g.drawImage(sp,300,30);g.drawImage(sp,0,0,18,30,326,18,54,90);
  // another person: an older trader woman
  const deb={skin:P.skinB,hair:P.hairG,hairStyle:'long',top:['#c8603a','#a84e2e','#843c24','#5e2a1a'],legs:['#8a8470','#6e6a5a','#56524a','#3e3c36']};
  lab('ANOTHER PERSON',8,102,P.warm);
  g.drawImage(portrait(Object.assign({mood:'ok',back:['#8a7650','#6e5e40','#4e4430']},deb)),8,114);
  g.drawImage(person(deb),0,0,18,30,78,120,54,90);
  lab('THE DEAD: NO TWINS',150,102,P.warm);
  const zs=[
    {kind:'zom',skin:P.zom,top:P.mail,legs:P.navy,shorts:1,bag:1,gore:'light'},
    {kind:'zom',skin:P.zom,top:P.red,overalls:1,legs:P.over,cap:P.cap,arm:'noR',gore:'heavy'},
    {kind:'zom',skin:P.zom,top:['#e8d070','#d0b048','#a88a34','#7a6426'],legs:['#4a4a50','#3a3a40','#2a2a30','#1e1e22'],shorts:1,hair:P.hairD,short:1,lean:-1},
    {kind:'zom',skin:P.zom,top:['#e8e8e0','#c8ccc4','#a8aca4','#7e827c'],legs:['#e8e8e0','#c8ccc4','#a8aca4','#7e827c'],hair:P.hairD,hairStyle:'long',gore:'heavy',lean:0}];
  zs.forEach((z,i)=>g.drawImage(person(z),0,0,18,30,150+i*58,116,54,90));
  ['MAIL','FARMER','KID','NURSE'].forEach((t,i)=>lab(t,152+i*58,208));
  g.drawImage(portrait({zom:1,skin:P.zom,top:P.mail,hair:P.hairD,back:['#46605e','#34484a','#22302e']}),8,186);
  lab('Z PORTRAIT',8,252);
  // palette
  lab('PALETTE (DAY RAMPS: LIGHT, BASE, SHADE, DEEP)',8,268,P.warm);
  const sw=[['SKIN',P.skin],['SKIN B',P.skinB],['DEAD',P.zom],['COVERALL',P.coverall],['JEANS',P.jeans],['OCHRE',P.ochre],['TEAL',P.tealw],['ASPHALT',P.asph],['GRASS',P.grass],['CARDBOARD',P.kraft]];
  sw.forEach((s,i)=>{const x=8+(i%5)*92,y=282+((i/5)|0)*30;s[1].forEach((c,k)=>R(g,c,x+k*12,y,12,12));g.font='12px VT323';g.fillStyle=P.text;g.fillText(s[0],x+50,y);g.fillStyle=P.dim;g.fillText(s[1][1],x+50,y+10);});
  const ac=[['CYAN usable',P.cyan],['PINK neon',P.pink],['AMBER neon',P.amber],['BLOOD',P.blood],['INK',P.ink]];
  ac.forEach((s,i)=>{const x=8+i*92,y=344;R(g,s[1],x,y,12,12);g.font='12px VT323';g.fillStyle=P.text;g.fillText(s[0],x+16,y);g.fillStyle=P.dim;g.fillText(s[1],x+16,y+10);});
};
})();
