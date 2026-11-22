// Rushlight · content/march.js
// The slice's Withy March (spec 004; bible World and contracts, The slice's Withy March): 8 hand-placed points and
// 10 roads in days, drawn on the approved chart's layout (rushlight-mockups-map-v1): the river through Harrowford,
// Saint Ebbe's east, Hollin and its fields north, the osier beds south along the river, the charcoal camp in the woods
// west, Crookback and Lowmoor Pit beyond. Positions are chart pixels. Also the enemy cards fought on the road (bible
// Combat, Folk enemies: region 1; Creatures, Creature batch 1). Content data only.
const MARCH={
 name:'THE WITHY MARCH',season:'AUTUMN',w:420,h:360,
 points:{
  harrow:{name:'HARROWFORD',kind:'town',type:'river crossing',x:196,y:168,start:true},
  ebbe:{name:"SAINT EBBE'S",kind:'town',type:'monastery town',x:332,y:118,start:true},
  hollin:{name:'Hollin',kind:'hamlet',type:'hamlet · fields',x:176,y:62,start:true},
  sallow:{name:'Sallow End',kind:'hamlet',type:'hamlet',x:372,y:42},
  camp:{name:'the charcoal camp',kind:'site',type:'wild site · charcoal burners',x:62,y:150},
  cause:{name:'the osier causeway',kind:'site',type:'wild site · causeway',x:214,y:268},
  crook:{name:'Crookback',kind:'site',type:'wild site · plague village',x:372,y:222},
  pit:{name:'Lowmoor Pit',kind:'den',type:'den · flooded mine',x:318,y:318}
 },
 // id: [a, b, days, kind, waypoints]
 roads:{
  he:['harrow','ebbe',2,'main',[[262,150]]],
  hh:['harrow','hollin',1,'main',[[188,112]]],
  hc:['harrow','camp',1,'side',[[128,166]]],
  hs:['harrow','cause',1,'side',[[220,214]]],
  es:['ebbe','sallow',1,'side',[[358,80]]],
  ec:['ebbe','crook',2,'side',[[360,170]]],
  ok:['hollin','crook',2,'side',[[250,84],[300,196]],'hideable'],
  sh:['sallow','hollin',3,'side',[[290,36],[226,46]],'hideable'],
  cp:['crook','pit',1,'den',[[352,272]]],
  sp:['cause','pit',2,'den',[[262,306]]]
 },
 // scenery on the chart: the river (a line through Harrowford), woods, fields and the osier beds
 river:[[150,0],[168,60],[150,110],[184,168],[210,230],[204,290],[236,360]],
 woods:[[40,120],[30,178],[86,196],[58,108],[96,128],[300,198],[396,150],[100,40],[262,250]],
 fields:[[140,30],[200,30],[150,80]],
 beds:[[180,250],[240,288],[190,300]]
};
// Where each roamer may walk (spec 004, 6): the hedge cat and the rooks on two different side roads, never a main road;
// the Corpse-candle on a road touching Crookback; the Lampwalkers on a road one step from a den road.
const ROAMER_ROADS={cat:['hc','hs','es','ec','ok','sh'],rooks:['hc','hs','es','ec','ok','sh'],candle:['ec','ok'],lamp:['hs','ec','ok']};
// Enemy cards used on the road. Numbers are the bible's; sp: a Folk enemy's species is dressed by the seed.
const FOES={
 bandit:{name:'Road bandit',kind:'Folk',lvl:1,hp:12,dex:12,hit:45,dmg:'1d3+1',folk:true,nerve:'Normal'},
 rook:{name:'Rook',kind:'Beast',lvl:1,hp:5,dex:16,hit:40,dmg:'1d3',group:'rooks',thief:true},
 hedgecat:{name:'Hedge cat',kind:'Beast',lvl:2,hp:18,dex:16,hit:55,dmg:'1d4+1',sprite:'hedgecat'},
 candle:{name:'Corpse-candle',kind:'Unnatural',lvl:2,hp:20,dex:14,hit:50,dmg:'1d4+2',sprite:'candle',faceless:true},
 lamp:{name:'Lampwalkers',kind:'Unnatural',lvl:2,hp:21,dex:10,hit:45,dmg:'1d3',sprite:'lampwalkers'},
 manatarms:{name:'Man-at-arms',kind:'Folk',lvl:3,hp:33,dex:10,hit:55,dmg:'1d4',folk:true,armor:1,nerve:'Steady'}
};
