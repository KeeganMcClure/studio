// Black Lantern · mockup 023 · the battle layout with 48 × 60 agents (rough v1, Nov 23, 2026). Patches the live game in
// the mockup capture only: the new battle backs (023-battle-backs-rough-v1.js), the agents' room in the layout, the agents sinking behind the party strip on short screens, the turn
// column stopping above their heads, and a Downed agent lowered 16 px. The Developer builds the same rules into
// engine/battle.js (AGENT_ROOM) and battle.js.
(function(){
 Object.assign(BLB,{back:(a,o)=>BLB2.back(a,o),AX:BLB2.AX,AY:BLB2.AY,W:BLB2.W,H:BLB2.H});
 const SB=window.StudioBattle,lay=SB.layout,col=SB.turnColumn;
 const ROOM=82,TOP=6;   // the agents' heads (60) and the enemy's bar and name under its feet (22); the gap above its head
 SB.layout=function(w,h,o){const L=lay(w,h,o),tall=(o&&o.tallest)||0,clear=L.scene.h-ROOM,want=Math.max(L.scene.h*.5,tall+TOP);
  L.enemyY=Math.round(Math.min(want<=clear?want:Math.max(clear,tall+TOP),L.scene.h-2));
  // what gives first on a short screen: the agents sink behind the party strip, up to SINK px, until the enemy's
  // name and bar (16 px under its feet) clear their heads (60 px); only past that do the bar and name draw over them
  const SINK=14,need=L.enemyY+16+60-L.agentY;L.sink=Math.max(0,Math.min(SINK,need));L.agentY+=L.sink;
  L.over=L.enemyY+16>L.agentY-60;return L};
 SB.turnColumn=function(c,T,x,y,faces,maxH){return col(c,T,x,y,faces,maxH-18)};
})();
