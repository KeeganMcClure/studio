// Rushlight · content/towns.js
// The slice's two towns (spec 005; bible World and contracts, The slice's towns): each street's buildings and doors,
// its dressing and townsfolk spots, the shops' stock, the six jobs of the slice's pool, and the rumor pool.
// Street layout follows the approved Harrowford mockup (rushlight-mockups-town-v1): house fronts across the top,
// a cobbled street, the notice board out in the street. Content data only; town.js reads it.
// A building: {x, w, kind, place, door (column of its door), name}. Tiles: 16 px; rows 0-3 house fronts, 4-9 street.
const TOWNS={
 harrow:{name:'HARROWFORD',type:'river crossing',arrive:'TW-HARROW-1',w:34,h:13,giver:'guild',hires:3,
  buildings:[
   {x:0,w:4,kind:'timber',place:'inn',door:2,name:'The Drowned Goose'},
   {x:4,w:3,kind:'timber',place:'tavern',door:5,name:'The tavern'},
   {x:7,w:4,kind:'stone',place:'church',door:9,name:'The chapel'},
   {x:11,w:3,kind:'timber',place:'barber',door:12,name:'The barber-surgeon'},
   {x:14,w:4,kind:'smithy',place:'smith',door:16,name:'The smith'},
   {x:18,w:3,kind:'timber',place:'brothel',door:19,name:'The brothel'},
   {x:21,w:3,kind:'plain',place:'reeve',door:22,name:"The reeve's door"},
   {x:24,w:5,kind:'hall',place:'guild',door:26,name:'The guild hall'},
   {x:29,w:5,kind:'timber',place:null,door:-1,name:''}],
  props:[{x:5,y:5,kind:'stall',place:'market',name:'Market stalls'},{x:14,y:5,kind:'board',place:'board',name:'The notice board'},
   {x:10,y:7,kind:'cart',name:'A handcart'},{x:23,y:7,kind:'pillory',name:'The pillory'},{x:31,y:6,kind:'well',name:'The well'}],
  dressing:{cross:12,body:10},
  folk:[[3,7,'fishwife'],[17,6,'watchman'],[20,8,'carter'],[27,6,'beggar'],[29,8,'gravedigger']],
  exits:['left','right']},
 ebbe:{name:"SAINT EBBE'S",type:'monastery town',arrive:'TW-EBBE-1',w:34,h:13,giver:'prior',hires:2,learned:true,
  buildings:[
   {x:0,w:4,kind:'timber',place:'inn',door:2,name:'The guesthouse'},
   {x:4,w:3,kind:'timber',place:'tavern',door:5,name:'The alehouse'},
   {x:7,w:4,kind:'timber',place:'apothecary',door:9,name:"The infirmarer's window"},
   {x:11,w:3,kind:'plain',place:'reeve',door:12,name:"The reeve's door"},
   {x:14,w:6,kind:'priory',place:'church',door:17,name:'The priory church'},
   {x:20,w:6,kind:'wall',place:'prior',door:23,name:"The prior's gate"},
   {x:26,w:8,kind:'wall',place:null,door:-1,name:''}],
  props:[{x:3,y:5,kind:'stall',place:'market',name:'Market stalls'},{x:12,y:5,kind:'board',place:'board',name:'The notice board'},
   {x:27,y:6,kind:'well',place:'hire',name:'The hiring corner by the well'},{x:31,y:8,kind:'gibbet',name:'The gibbet outside the wall'}],
  dressing:{monks:[[16,6],[21,7]],beggar:[24,5]},
  folk:[[6,7,'alewife'],[10,6,'smith'],[19,8,'monk'],[29,7,'carter']],
  exits:['left','right']}
};
// what each place sells or does (spec 005, 5). Prices come from the bible's Prices (town.js priceOf).
const SHOPS={
 market:['bandage','willow','sponge','chewroot','firepot','rushbundle','salt','snare','torch','hatchet','rope','lantern','hood','buckler','sling','knife','cudgel'],
 smith:['caltrops','manacles','bodkin','repairkit','crowbar','jack','mail','kettle','coif','buckler','roundshield','heater','pavise','sword','mace','halberd','axe','flail','crossbow','coldiron'],
 apothecary:['surgeonsroll','theriac','tonic','herbbundle','smokepot','venom','herbmask','hemp','poppysyrup','wakeleaf','poppytinct','fireroot']
};
// item prices (Prices): Common 5 · Uncommon 15 · Rare 40; weapons Common 8 · Uncommon 25 · hand cannon 60; armor and shields by name
const PRICE={hood:3,jack:10,herbmask:10,kettle:12,coif:20,mail:40,plate:150,buckler:6,roundshield:10,heater:25,pavise:30,cannon:60,
 sword:25,mace:25,halberd:25,axe:25,flail:25,crossbow:25,longbow:25,silver:15,firepot:15,smokepot:15,surgeonsroll:15,theriac:15,herbbundle:15,
 venom:15,firearrows:15,relic:15,lockpicks:15,powderpot:15,thunderpot:15,coldiron:15,hemp:15,poppysyrup:15,wakeleaf:15,poppytinct:15,fireroot:15,blankwrit:40,ale:1,holywater:5};
// the slice's pool of 6 (spec 005, 2): fixed jobs, seeded order. tags: the motivations each job plants a moment for.
const JOBS={
 pell:{title:'PELL THE POACHER',town:'harrow',by:'board',kind:'bounty',shape:'short case',pay:40,alive:.5,site:'camp',bill:'VO-BOARD-2',desc:'PJ-PELL-DESC',tags:['Money','Family'],threat:{kind:'Folk',lvl:3,note:'not alone'},xp:150},
 hag:{title:'THE WITHY HAG',town:'harrow',by:'board',kind:'creature',shape:'quick job',pay:25,site:'cause',bill:'CR-HAG-BOARD',tags:['Find the truth'],threat:{kind:'???',lvl:2},xp:100,poster:'the salt guild'},
 wool:{title:'THE WOOL BUYER',town:'harrow',by:'giver',giver:'guild',kind:'escort',shape:'road job',pay:40,site:'ebbe',road:true,bill:'PJ-WOOL-BOARD',tags:['Money','Duty'],threat:{kind:'Folk',lvl:1,note:'the road'},xp:150},
 noon:{title:'THE NOONWIFE',town:'ebbe',by:'giver',giver:'prior',kind:'hunt',shape:'hunt',pay:60,site:'hollin',bill:'CR-NOON-DESC',tags:['Protect the innocent','Faith'],threat:{kind:'Unnatural',lvl:3},xp:200},
 owl:{title:'SEVERA THE OWL',town:'ebbe',by:'board',kind:'beast job',shape:'quick job',pay:25,site:'sallow',bill:'CR-OWL-BOARD',tags:['Protect the innocent','Family'],threat:{kind:'Beast',lvl:3},xp:100},
 counter:{title:'THE COUNTER',town:'ebbe',by:'board',kind:'hunt',shape:'hunt',pay:60,site:'crook',bill:'CR-COUNT-DESC',tags:['Revenge','Curiosity'],threat:{kind:'Unnatural',lvl:3},xp:200}
};
// the givers (spec 005, 3): archetype, faction, first line
const GIVERS={guild:{title:'guild master',faction:'town',line:'GV-GUILD-1',town:'harrow'},prior:{title:'prior',faction:'church',line:'GV-PRIOR-1',town:'ebbe'}};
// the rumor pool (spec 005, 6): the hidden road's true line first in the list, then the rest; the seed sets the order
const RUMORS=['ROAD','RU-CAMP','RU-CAUSE','RU-SALLOW','RU-CROOK','RU-MONK','RU-LIE-1','RU-LIE-2'];
// the two lies' pencil points on the chart, each a day's road from a real point (spec 005, 6)
MARCH.points.lie1={name:'a hermit past Hollin',kind:'lie',type:'rumor',x:118,y:28};
MARCH.points.lie2={name:'old silver workings',kind:'lie',type:'rumor',x:150,y:8};
MARCH.roads.l1=['hollin','lie1',1,'side',[[146,40]]];
MARCH.roads.l2=['harrow','lie2',1,'side',[[170,90],[156,40]]];
