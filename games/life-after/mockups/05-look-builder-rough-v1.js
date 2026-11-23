// 05 look builder, rough v1: the survivor builder, step 3 (Job), on the proposed menu surface:
// flattened cardboard with marker writing and duct tape, the photo taped on. Usable and picked things edge in cyan.
(function(){
const {P,mk,R,px,box,shadow,person,portrait}=LA;
const K=P.kraft;
function cardboard(g,x,y,w,h){
  R(g,'rgba(0,0,0,.4)',x+2,y+2,w,h);
  R(g,K[1],x,y,w,h);
  // a lit spot upper left, darker toward the edges (flat bands of tone, no grain)
  g.save();g.beginPath();g.rect(x,y,w,h);g.clip();g.fillStyle=K[0];g.beginPath();g.ellipse(x+w*.32,y+h*.3,w*.3,h*.28,0,0,7);g.fill();g.restore();
  R(g,K[2],x,y,w,2);R(g,K[2],x,y,2,h);R(g,K[3],x,y+h-2,w,2);R(g,K[3],x+w-2,y,2,h);
  // cut edge on top shows the flutes as a row of small arches
  for(let i=x+3;i<x+w-3;i+=4){px(g,K[3],i,y+1);px(g,K[0],i+1,y);px(g,K[0],i+2,y);}
}
function tape(g,x,y,w,h){R(g,P.tape[1],x,y,w,h);R(g,P.tape[0],x,y,w,1);R(g,P.tape[2],x,y+h-1,w,1);for(let i=x;i<x+w;i+=3)px(g,P.tape[2],i,y+h);}
function wrap(g,t,max){const out=[];let line='';for(const w of t.split(' ')){const s=line?line+' '+w:w;if(g.measureText(s).width>max){out.push(line);line=w;}else line=s;}if(line)out.push(line);return out;}

window.drawBuilder=function(cv){
  const W=cv.width,H=cv.height,g=cv.getContext('2d');g.imageSmoothingEnabled=false;g.textBaseline='top';
  R(g,'#101416',0,0,W,H);
  // header
  R(g,P.card,0,0,W,18);R(g,'#4e5854',0,18,W,1);
  g.font='8px "Press Start 2P"';g.fillStyle=P.dim;g.fillText('<L',4,5);g.fillText('R>',W-20,5);
  g.fillStyle=P.warm;const hd='STEP 3 OF 8 · JOB';g.fillText(hd,(W-g.measureText(hd).width)/2,5);
  for(let i=0;i<8;i++)R(g,i<2?P.dim:i===2?P.cyan:'#3a4442',W/2-30+i*8,14,5,2);
  // top: the photo, the map sprite, the summary
  cardboard(g,4,23,W-8,92);
  const look={skin:P.skin,hair:P.hairD,top:P.coverall,patch:1,stubble:1,mood:'ok'};
  const por=portrait(look);
  R(g,'rgba(0,0,0,.35)',12,31,72,82);R(g,'#ece6d8',10,29,72,82);R(g,'#d2ccbe',10,108,72,2);
  g.drawImage(por,14,33);
  tape(g,6,27,14,5);tape(g,72,27,14,5);
  g.font='16px VT323';g.fillStyle=P.marker;g.fillText('RAY',36,96);
  // map sprite at 2x on its shadow
  const sp=person(look);
  g.fillStyle='rgba(60,40,20,.35)';g.beginPath();g.ellipse(106,104,13,4,0,0,7);g.fill();
  g.drawImage(sp,0,0,18,30,88,46,36,60);
  // summary in marker
  g.font='8px "Press Start 2P"';g.fillStyle=P.markR;g.fillText('MECHANIC',130,32);
  g.font='16px VT323';g.fillStyle=P.marker;
  ['Fixing 3','Melee 1','Outdoors 1'].forEach((t,i)=>g.fillText(t,130,44+i*14));g.fillStyle=P.markR;g.fillText('3 free points',130,88);
  // the list of jobs as cards
  const jobs=[
    ['NURSE','Medicine 3, Talk 1, Cooking 1','2 bandages, painkillers','Knows the rag bandage recipe'],
    ['MECHANIC','Fixing 3, Melee 1, Outdoors 1','Duct tape, hammer and nails','Starts dead cars faster; knows the weapon fix'],
    ['FARMER','Outdoors 3, Fixing 1, Cooking 1','Seed packets, hatchet','Knows the garden plot and both remedies'],
  ];
  const ly=122,lh=H-ly-18;
  cardboard(g,4,ly,W-8,lh);
  g.save();g.beginPath();g.rect(4,ly+2,W-8,lh-4);g.clip();
  let y=ly+6-34; // scrolled so the picked card sits in view
  jobs.forEach((j,i)=>{
    g.font='16px VT323';const extra=wrap(g,'Extra: '+j[3],W-34);
    const h=12+14+14+extra.length*13+6,on=i===1,x=10,w=W-20;
    R(g,'rgba(60,40,20,.35)',x+2,y+2,w,h);R(g,on?'#e2c48e':K[0],x,y,w,h);R(g,K[2],x,y+h-1,w,1);R(g,K[2],x+w-1,y,1,h);
    if(on){g.strokeStyle=P.cyan;g.lineWidth=2;g.strokeRect(x-1,y-1,w+2,h+2);R(g,P.cyan,x-6,y+4,3,7);px(g,P.cyan,x-3,y+7);}
    g.font='8px "Press Start 2P"';g.fillStyle=P.markR;g.fillText(j[0],x+6,y+5);
    g.font='16px VT323';g.fillStyle=P.marker;
    g.fillText(j[1],x+6,y+14);g.fillText(j[2],x+6,y+28);extra.forEach((t,k)=>g.fillText(t,x+6,y+42+k*13));
    y+=h+6;
  });
  g.restore();
  // scroll marks
  g.fillStyle=P.marker;g.font='8px "Press Start 2P"';g.fillText('▲',W-16,ly+5);g.fillText('▼',W-16,ly+lh-12);
  // key help
  g.font='12px VT323';g.fillStyle=P.dim;const kh='A pick   B back   L/R step   12 jobs';g.fillText(kh,(W-g.measureText(kh).width)/2,H-14);
};
})();
