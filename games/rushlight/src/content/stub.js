// Rushlight · content/stub.js
// The stand-in town (spec 003, 10): one small walkable street from the shell's tiles, where a newly signed company
// stands until Part C builds Harrowford. Content data only: the engine reads MAPS.
const MAPS={};
MAPS.standin=()=>{const g=mk(18,16,'.');
 rect(g,0,0,18,1,'T');rect(g,0,1,18,4,'#');rect(g,0,5,18,1,'B');rect(g,0,6,18,4,',');rect(g,0,14,18,2,'T');rect(g,0,6,1,8,'T');rect(g,17,6,1,8,'T');
 [[3,4],[8,4],[13,4]].forEach(([x,y])=>g[y][x]='D');[[5,5],[11,5],[16,5]].forEach(([x,y])=>g[y][x]='L');g[11][3]='F';g[11][14]='H';
 return {name:'A STAND-IN TOWN',w:18,h:16,g,npcs:[],O:{},vv:{}}};
