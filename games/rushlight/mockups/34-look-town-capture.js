const { chromium } = require('playwright');const fs=require('fs');
const G='/home/user/studio/games/rushlight/src/';
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:375,height:667},deviceScaleFactor:2});const p=await ctx.newPage();
p.on('pageerror',e=>console.log('ERR',e.message));p.on('console',m=>{if(m.type()==='error')console.log('C',m.text())});
await p.goto('file://'+G+'dist/index.html');await p.evaluate(()=>localStorage.clear());
const T=JSON.parse(fs.readFileSync(G+'test-saves/2026-11-22-v1-standin-town.json','utf8'));await p.evaluate(k=>{for(const [a,v] of Object.entries(k))localStorage.setItem(a,v)},T.keys);
await p.reload();await p.waitForTimeout(900);
for(const k of ['ArrowDown','z'])await p.keyboard.press(k),await p.waitForTimeout(400);await p.waitForTimeout(1200);await p.keyboard.press('z');await p.waitForTimeout(1500);
await p.screenshot({path:process.argv[2]+'-before.png'});
const mode=process.argv[3]||'';
if(mode!=='before'){await p.addScriptTag({path:'/mnt/project-files/mockups/rushlight/'+(process.argv[4]||'look-pass-town-rough-v1.js')});}
// walk a little so the camera shows the street, then talk to someone for the box
await p.keyboard.down('ArrowRight');await p.waitForTimeout(700);await p.keyboard.up('ArrowRight');await p.waitForTimeout(500);
await p.screenshot({path:process.argv[2]+'-walk.png'});
await p.keyboard.press('z');await p.waitForTimeout(2500);
await p.screenshot({path:process.argv[2]+'-talk.png'});
await b.close()})();
