// 09 notebook, v1 (Nov 25, 2026), finished quality: the Notebook (Start → Notebook), spec 002 part 11, and its Recipes page,
// which the Bag's Recipes page (spec 002 part 10) shares. A ruled notebook page taped to the cardboard surface from 05.
// Notes are your survivor's own lines in black marker, each with the day and time. Recipes are cards: one you can make now
// is lit with a Make button; one you can't shows what's missing in red. drawNotebook(cv, 'notes' | 'recipes'). Design reference only.
(function(){
const {P,R,px}=LA;
const K=P.kraft, INK=P.marker, RED=P.markR, PAPER='#ece6d8', PAPERD='#d2ccbe', RULE='#b8c4cc', MARGIN='#d89a8a';
function cardboard(g,x,y,w,h){
  R(g,'rgba(0,0,0,.4)',x+2,y+2,w,h);R(g,K[1],x,y,w,h);
  g.save();g.beginPath();g.rect(x,y,w,h);g.clip();g.fillStyle=K[0];g.beginPath();g.ellipse(x+w*.32,y+h*.3,w*.34,h*.32,0,0,7);g.fill();g.restore();
  R(g,K[2],x,y,w,2);R(g,K[2],x,y,2,h);R(g,K[3],x,y+h-2,w,2);R(g,K[3],x+w-2,y,2,h);
  for(let i=x+3;i<x+w-3;i+=4){px(g,K[3],i,y+1);px(g,K[0],i+1,y);px(g,K[0],i+2,y);}
}
function tape(g,x,y,w,h){R(g,P.tape[1],x,y,w,h);R(g,P.tape[0],x,y,w,1);R(g,P.tape[2],x,y+h-1,w,1);for(let i=x;i<x+w;i+=3)px(g,P.tape[2],i,y+h);}
function wrap(g,t,max){const out=[];let line='';for(const w of t.split(' ')){const s=line?line+' '+w:w;if(g.measureText(s).width>max){out.push(line);line=w;}else line=s;}if(line)out.push(line);return out;}
// a sheet of ruled paper torn from a spiral pad: ruled lines, a red margin, the torn holes along the top
function sheet(g,x,y,w,h,lineH){
  R(g,'rgba(30,20,10,.45)',x+3,y+3,w,h);R(g,PAPER,x,y,w,h);R(g,PAPERD,x,y+h-1,w,1);R(g,PAPERD,x+w-1,y,1,h);
  for(let ly=y+20;ly<y+h-4;ly+=lineH)R(g,RULE,x+2,ly,w-4,1);
  R(g,MARGIN,x+22,y+2,1,h-4);
  for(let hx=x+10;hx<x+w-6;hx+=14){R(g,K[1],hx,y,5,3);R(g,PAPERD,hx,y+3,5,1);}
}

const NOTES=[
  ['DAY 1 · 7:00 AM','Woke up in my own bed like it was any day. It isn\'t. Nobody on the street.'],
  ['DAY 1 · 9:40 AM','Back door at the yellow house is locked. Might pry it, might find the key. Not today.'],
  ['DAY 1 · 4:15 PM','Pockets are full. Need a real bag, or I leave stuff behind.'],
  ['DAY 1 · 6:30 PM','Getting dark. The streetlights didn\'t come on. Get inside before it\'s full night.'],
  ['DAY 3 · 7:20 AM','Walked the highway out to the strip. Three hours. A bike would cut that down.'],
];
const RECIPES=[
  {name:'WEAPON FIX',kind:'Small craft · 15 min',parts:[['Duct tape',1,1]],gives:'Puts 2 wear marks back on a weapon or tool.',uses:'Uses your 1 duct tape'},
  {name:'TORCH',kind:'Small craft · 15 min',parts:[['Rags',1,5],['Scrap wood',1,0],['Lighter','tool',0]],gives:'Light for 2 hours. Fire scares some of them off.'},
  {name:'NAIL BAT',kind:'Small craft · 15 min',parts:[['Slugger bat',1,1],['Nails',4,0]],gives:'Hits harder. Wears the bat faster.'},
];

function header(g,W,on){
  R(g,P.card,0,0,W,20);R(g,'#4e5854',0,20,W,1);
  g.font='8px "Press Start 2P"';g.fillStyle=P.dim;g.fillText('<L',4,6);g.fillText('R>',W-20,6);
  const tabs=[['NOTES',on==='notes'],['RECIPES',on==='recipes']];let tw=0;tabs.forEach(([t])=>tw+=g.measureText(t).width+16);let tx=(W-tw+6)/2;
  tabs.forEach(([t,o])=>{const w=g.measureText(t).width+10;R(g,o?P.cardHi:P.card,tx,3,w,15);if(o)R(g,P.cyan,tx,16,w,2);
    g.fillStyle=o?P.warm:P.dim;g.fillText(t,tx+5,7);tx+=w+6;});
  g.font='12px VT323';g.fillStyle=P.dim;const cl='Clock stopped · Day 3 · 7:40 AM';g.fillText(cl,(W-g.measureText(cl).width)/2,23);
}

function notes(g,W,H){
  const top=39,x=6,w=W-12,h=H-top-20,lh=14;
  cardboard(g,4,top-3,W-8,h+6);
  sheet(g,x+2,top+2,w-4,h-4,lh);tape(g,W/2-12,top-1,24,6);
  g.font='8px "Press Start 2P"';g.fillStyle=RED;g.fillText('WHAT I KNOW',x+30,top+9);
  g.font='12px VT323';g.fillStyle=INK;const ct='5 notes';g.fillText(ct,x+w-10-g.measureText(ct).width,top+7);
  // entries, newest last, each sitting on the rules
  const first=top+2+20+lh;let ly=first;const maxW=w-4-34;
  const lines=[];
  NOTES.forEach((n,i)=>{lines.push({t:n[0],head:1,i});g.font='16px VT323';wrap(g,n[1],maxW).forEach(t=>lines.push({t,i}));});
  // show the newest entries that fit; the rest scroll up
  const fit=Math.floor((top+h-8-first)/lh)+1;const shown=lines.slice(Math.max(0,lines.length-fit));
  const newest=NOTES.length-1;
  shown.forEach(l=>{
    if(l.head){g.font='12px VT323';g.fillStyle=l.i===newest?RED:'#5e5a54';g.fillText(l.t,x+30,ly-10);
      // a small marker tick in the margin for each entry
      R(g,l.i===newest?RED:INK,x+12,ly-5,6,2);}
    else{g.font='16px VT323';g.fillStyle=INK;g.fillText(l.t,x+30,ly-13);}
    ly+=lh;});
  if(lines.length>fit){g.font='8px "Press Start 2P"';g.fillStyle=INK;g.fillText('▲',W-20,top+24);}
  // the new-note toast that shows at the bottom of the map for a moment is spec'd separately; here, the hint line
  g.font='12px VT323';g.fillStyle=P.dim;const kh='Up/Down scroll   B back   L/R page';g.fillText(kh,(W-g.measureText(kh).width)/2,H-14);
}

function recipes(g,W,H){
  const top=39;
  cardboard(g,4,top-3,W-8,H-top-14);
  g.font='8px "Press Start 2P"';g.fillStyle=RED;g.fillText('RECIPES I KNOW',12,top+5);
  g.font='12px VT323';g.fillStyle=INK;const ct='3 known · 1 ready';g.fillText(ct,W-12-g.measureText(ct).width,top+3);
  let y=top+18;const pick=0;
  RECIPES.forEach((r,i)=>{
    const ready=r.parts.every(p=>p[1]==='tool'?p[2]>0:p[2]>=p[1]);
    g.font='12px VT323';const gl=wrap(g,r.gives,W-36);
    const h=12+11+16+gl.length*11+(ready?20:6)+4;
    if(y+h>H-20){if(!r.more){g.font='12px VT323';g.fillStyle=INK;const m='▼ '+(RECIPES.length-i)+' more';g.fillText(m,W/2-g.measureText(m).width/2,H-30);RECIPES.forEach(q=>q.more=1);}return;}
    const x=10,w=W-20;
    R(g,'rgba(60,40,20,.35)',x+2,y+2,w,h);R(g,ready?PAPER:K[0],x,y,w,h);R(g,ready?PAPERD:K[2],x,y+h-1,w,1);R(g,ready?PAPERD:K[2],x+w-1,y,1,h);
    if(i===pick){g.strokeStyle=P.cyan;g.lineWidth=2;g.strokeRect(x-1,y-1,w+2,h+2);R(g,P.cyan,x-6,y+5,3,7);px(g,P.cyan,x-3,y+8);}
    g.font='8px "Press Start 2P"';g.fillStyle=RED;g.fillText(r.name,x+6,y+5);
    g.font='12px VT323';g.fillStyle=INK;g.fillText(r.kind,x+w-6-g.measureText(r.kind).width,y+3);
    // parts as chips: what you have, or what's missing in red
    let cx=x+6;const cy=y+17;
    r.parts.forEach(p=>{const tool=p[1]==='tool',have=tool?p[2]>0:p[2]>=p[1];
      const t=tool?p[0]:p[0]+' '+Math.min(p[2],p[1])+'/'+p[1];g.font='12px VT323';const cw=g.measureText(t).width+14;
      R(g,have?'#e2c48e':'#e8cfc4',cx,cy,cw,13);R(g,have?K[2]:RED,cx,cy+12,cw,1);
      if(have){R(g,INK,cx+3,cy+7,2,1);R(g,INK,cx+4,cy+8,1,1);R(g,INK,cx+5,cy+4,1,4);R(g,INK,cx+6,cy+3,1,2);}
      else{g.strokeStyle=RED;g.lineWidth=1;g.beginPath();g.moveTo(cx+2.5,cy+3.5);g.lineTo(cx+7.5,cy+8.5);g.moveTo(cx+7.5,cy+3.5);g.lineTo(cx+2.5,cy+8.5);g.stroke();}
      g.fillStyle=have?INK:RED;g.fillText(t,cx+10,cy);cx+=cw+4;});
    g.font='12px VT323';g.fillStyle=INK;gl.forEach((t,k)=>g.fillText(t,x+6,y+32+k*11));
    if(ready){const bx=x+6,by=y+h-20;g.font='8px "Press Start 2P"';const bw=g.measureText('MAKE').width+14;
      R(g,'rgba(60,40,20,.35)',bx+1,by+1,bw,15);R(g,'#e2c48e',bx,by,bw,15);R(g,K[3],bx,by+14,bw,1);
      if(i===pick){g.strokeStyle=P.cyan;g.lineWidth=2;g.strokeRect(bx-1,by-1,bw+2,17);}
      g.fillStyle=INK;g.fillText('MAKE',bx+7,by+4);
      g.font='12px VT323';g.fillStyle=INK;g.fillText(r.uses,bx+bw+8,by+2);}
    else{g.font='12px VT323';g.fillStyle=RED;const miss='Missing: '+r.parts.filter(p=>p[1]==='tool'?p[2]<1:p[2]<p[1]).map(p=>p[1]==='tool'?'a '+p[0].toLowerCase():(p[1]-p[2])+' '+p[0].toLowerCase()).join(', ');g.fillText(miss,x+w-6-g.measureText(miss).width,y+h-14);}
    y+=h+6;
  });
  g.font='12px VT323';g.fillStyle=P.dim;const kh='A make   B back   L/R page';g.fillText(kh,(W-g.measureText(kh).width)/2,H-14);
}

window.drawNotebook=function(cv,page){
  const W=cv.width,H=cv.height,g=cv.getContext('2d');g.imageSmoothingEnabled=false;g.textBaseline='top';
  R(g,'#101416',0,0,W,H);
  page=page||(location.hash.slice(1)||'notes');
  header(g,W,page);
  (page==='recipes'?recipes:notes)(g,W,H);
};
})();
