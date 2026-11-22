// Rushlight · art/art.js
// Turns the Asset Library's SVG sprite code (art/creatures.js) into canvases once, when the game loads, so the battle can
// draw them every frame. Exposes window.RLArt.
//   RLArt.sprite(name)    the sprite's canvas at 1×, or null while it is still being drawn (a few milliseconds at boot)
//   RLArt.ready()         a promise that settles once every sprite is drawn
(function(){
 const done={},waits=[];
 Object.entries(window.RL_SVG||{}).forEach(([k,svg])=>{
  waits.push(new Promise(res=>{const img=new Image();
   img.onload=()=>{const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const x=c.getContext('2d');x.imageSmoothingEnabled=false;x.drawImage(img,0,0);done[k]=c;res()};
   img.onerror=()=>res();img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)}));
 });
 const icons={};
 Object.entries(window.RL_ICONS||{}).forEach(([k,svg])=>{waits.push(new Promise(res=>{const img=new Image();img.onload=()=>{const c=document.createElement('canvas');c.width=12;c.height=12;c.getContext('2d').drawImage(img,0,0);icons[k]=c;res()};img.onerror=()=>res();img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)}))});
 const all=Promise.all(waits);
 // RLArt.icon(type): an item type's 12 px icon (Med, Drug, Throwable, Tool, Gear, Charm, Melee, Shooting, Body, Head, Shield, Trophy, Part)
 window.RLArt={sprite:k=>done[k]||null,icon:t=>icons[String(t).toLowerCase()]||null,ready:()=>all};
})();
