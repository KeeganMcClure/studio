// Rushlight · strings.js
// The game's data as plain lists, from the bible (Mercenaries and items: Species, Trades, Company templates, Starting kit,
// Item list; Skills and menus: Skill list; Systems: Motivations, Bonds). In-game lines come from the Text Library
// (content/text-library.js) by ID, through RLT(id). Exposes window.RLS. Replaces Black Lantern's professions and items (spec 003).
(function(){
const STATS=['STR','CON','DEX','INT','POW','CHA'];
const STATNAME={STR:'Strength',CON:'Constitution',DEX:'Dexterity',INT:'Intelligence',POW:'Power',CHA:'Charisma'};
// the 18 skills and their bases (Carried rules, Numbers: Melee, Dodge, Athletics 30; Shooting, Search, Persuade 20; the rest 10)
const SKILLS={Shooting:20,Melee:30,Dodge:30,Search:20,Butchery:10,Occult:10,History:10,Alchemy:10,Empathy:10,Persuade:20,Letters:10,Athletics:30,Stealth:10,Survival:10,'First Aid':10,Medicine:10,Craft:10,Beasts:10};
// the six slice species: +2 and −2, size, trait (Species)
const SPECIES={
 mouse:{name:'Mouse',up:'DEX',down:'STR',size:'Small',trait:'Light sleeper',tdesc:'The company can\'t be ambushed.'},
 rat:{name:'Rat',up:'CON',down:'CHA',size:'Small',trait:'Gutter-hardy',tdesc:'Never Sickened by food, water or plague air.'},
 hare:{name:'Hare',up:'DEX',down:'CON',size:'Middle',trait:'Fleet',tdesc:'+10% Athletics and flee rolls.',skill:{Athletics:10}},
 hedgehog:{name:'Hedgehog',up:'CON',down:'DEX',size:'Middle',trait:'Spines',tdesc:'Each melee attacker takes 1 damage.'},
 badger:{name:'Badger',up:'STR',down:'DEX',size:'Tall',trait:'Thick hide',tdesc:'Bleeding stops after 1 turn.'},
 fox:{name:'Fox',up:'INT',down:'POW',size:'Tall',trait:'Sly, distrusted',tdesc:'+10% Persuade and Blend in outside towns. −10% Persuade with townsfolk and town givers.'}
};
const SIZE={Small:{hp:-2,Stealth:10},Middle:{hp:0,Stealth:0},Tall:{hp:2,Stealth:-10}};
// the 13 trades (Trades; Starting kit). Strong skills start at 50%, backups at 30% (40% for Melee, Dodge, Athletics)
const T=(id,name,short,strong,backup,key,weapon,armor,kit,n,bk)=>({id,name,short,strong,backup,key,weapon,armor,kit,n,bk});
const TRADES=[
 T('halb','Halberdier','halberd',['Melee','Athletics'],['Dodge','Survival'],['STR','CON'],'halberd',['jack','kettle'],'caltrops',2,'HALB'),
 T('thief','Thief-taker','thief-taker',['Search','Melee'],['Persuade','Letters'],['STR','INT'],'cudgel',['jack'],'manacles',1,'THIEF'),
 T('hound','Houndsman','hounds',['Beasts','Melee'],['Survival','Athletics'],['STR','POW'],'spear',['jack'],'scentrag',2,'HOUND'),
 T('xbow','Crossbowman','crossbow',['Shooting','Dodge'],['Search','Craft'],['DEX','CON'],'crossbow',['jack','kettle'],'bodkin',3,'XBOW'),
 T('gun','Gunner','gunner',['Shooting','Alchemy'],['Craft','Melee'],['DEX','INT'],'cannon',['jack'],'powderpot',1,'GUN'),
 T('poach','Poacher','poacher',['Survival','Shooting'],['Stealth','Beasts'],['DEX','CON'],'shortbow',['hood'],'snare',1,'POACH'),
 T('purse','Cutpurse','cutpurse',['Stealth','Dodge'],['Persuade','Melee'],['DEX','CHA'],'sling',['hood'],'lockpicks',3,'PURSE'),
 T('barb','Barber-surgeon','barber',['Medicine','First Aid'],['Butchery','Persuade'],['INT','DEX'],'cleaver',[],'surgeonsroll',3,'BARB'),
 T('grave','Gravedigger','gravedig',['Butchery','Occult'],['Melee','Athletics'],['CON','POW'],'shovel',[],'salt',2,'GRAVE'),
 T('friar','Friar','friar',['Empathy','Letters'],['History','First Aid'],['POW','CHA'],'cudgel',['hood'],'relic',1,'FRIAR'),
 T('scribe','Scribe','scribe',['Letters','History'],['Persuade','Search'],['INT','POW'],'knife',[],'blankwrit',1,'SCRIBE'),
 T('witch','Hedge-witch','witch',['Occult','Alchemy'],['Medicine','Empathy'],['POW','INT'],'sickle',['herbmask'],'herbbundle',2,'WITCH'),
 T('tink','Tinker','tinker',['Craft','Persuade'],['Alchemy','Stealth'],['INT','CHA'],'hammer',[],'repairkit',2,'TINK')
];
// the 6 company templates plus Blank (Company templates); lines are CO- rows
const TEMPLATES=[
 {id:'free',name:'Free Company',trades:['halb','xbow','barb'],line:'CO-FREE'},
 {id:'hunt',name:'Hunting Party',trades:['poach','hound','grave'],line:'CO-HUNT'},
 {id:'thief',name:'Thief-takers',trades:['thief','purse','scribe'],line:'CO-THIEF'},
 {id:'hedge',name:'Hedge Folk',trades:['witch','friar','xbow'],line:'CO-HEDGE'},
 {id:'powder',name:'Powder and Steel',trades:['gun','halb','hound'],line:'CO-POWDER'},
 {id:'camp',name:'Camp Followers',trades:['tink','barb','scribe'],line:'CO-CAMP'},
 {id:'blank',name:'Blank company',trades:[],line:'CO-BLANK'}
];
const MOTIVES=['Protect the innocent','Find the truth','Family','Faith','Revenge','Duty','Curiosity','Money','Redemption'];
const KIN=['Mate','Child','Parent','Sibling'];
// the Item list (Mercenaries and items). type: one of the 13 icon types; slot: weapon (WPN), body, head, or kit (a slot);
// uses: how many uses a kit item has; dmg/skill for weapons. Effects run in later parts; here they're shown and carried.
const I=(id,name,type,o)=>Object.assign({id,name,type},o);
const ITEMS={
 bandage:I('bandage','Linen bandage','Med',{desc:'Clears Bleeding.'}),
 willow:I('willow','Willow-bark tea','Med',{desc:'Heal 1d4 HP.'}),
 tonic:I('tonic','Bitter tonic','Med',{desc:'Clears Exhausted, +1d4 WP.'}),
 sponge:I('sponge','Vinegar sponge','Med',{desc:'Clears Sickened.'}),
 surgeonsroll:I('surgeonsroll','Surgeon\'s roll','Med',{uses:3,desc:'3 uses: heal 1d6 HP, no roll.'}),
 theriac:I('theriac','Theriac','Med',{desc:'Clears Poisoned.'}),
 herbbundle:I('herbbundle','Herb bundle','Med',{uses:2,desc:'2 uses: each clears Poisoned or Sickened.'}),
 ale:I('ale','Ale or wine','Drug',{desc:'The drinker is Drunk; leaves a Broken jug.'}),
 chewroot:I('chewroot','Chewing root','Drug',{desc:'1 use: clears Shaken. Not a drug, so no High.'}),
 hemp:I('hemp','Hemp smoke','Drug',{drug:1,desc:'High; clears Shaken.'}),
 poppysyrup:I('poppysyrup','Poppy syrup','Drug',{drug:1,desc:'High; the next SAN loss this scene is halved.'}),
 wakeleaf:I('wakeleaf','Wakeleaf','Drug',{drug:1,desc:'High; clears Exhausted, +1d4 WP; Exhausted again when it wears off.'}),
 poppytinct:I('poppytinct','Poppy tincture','Drug',{drug:1,desc:'High; heal 1d6 HP; Bleeding does no damage while High.'}),
 fireroot:I('fireroot','Fire-root','Drug',{drug:1,desc:'High; +20% to Persuade and Melee; −1d4 WP when it wears off.'}),
 powderpot:I('powderpot','Powder pot','Throwable',{desc:'1 use, thrown with Athletics: 1d6 to every enemy. Loud.'}),
 thunderpot:I('thunderpot','Thunder pot','Throwable',{desc:'1 use, thrown with Athletics: every Folk enemy is Stunned. Loud.'}),
 firepot:I('firepot','Fire pot','Throwable',{desc:'1 use, thrown with Athletics: 1d8 to one enemy; things that burn take double.'}),
 smokepot:I('smokepot','Smoke pot','Throwable',{desc:'1 use: enemies −20% to hit until next round; against roamers, Flee succeeds.'}),
 rushbundle:I('rushbundle','Rushlight bundle','Throwable',{desc:'1 use: lights a dark area; in battle, one light-shy enemy is Shaken.'}),
 bangers:I('bangers','Bangers','Throwable',{desc:'1 use, on the map: a roamer leaves its post, so you slip past. Loud.'}),
 caltrops:I('caltrops','Caltrops','Tool',{uses:2,desc:'2 uses: the next Folk or Beast to attack this merc in melee is Stunned.'}),
 salt:I('salt','Salt','Tool',{desc:'1 use, no roll: lay a line one unnatural roamer won\'t cross.'}),
 lockpicks:I('lockpicks','Lockpicks','Tool',{uses:3,desc:'3 uses: open a lock quietly, no roll.'}),
 manacles:I('manacles','Manacles','Tool',{uses:0,desc:'Bind a yielded or beaten Folk enemy to bring in alive. Never used up.'}),
 scentrag:I('scentrag','Scent rag','Tool',{uses:2,desc:'2 uses: follow a fled enemy or a roamer to its den, no roll.'}),
 snare:I('snare','Snare','Tool',{desc:'1 use: a roamer is caught and you slip past, or the fight opens with it Stunned.'}),
 bodkin:I('bodkin','Bodkin bolts','Tool',{uses:3,desc:'3 uses: the next bow or crossbow shot ignores armor.'}),
 blankwrit:I('blankwrit','Blank writ','Tool',{desc:'1 use: one Writ with no roll.'}),
 relic:I('relic','Relic','Tool',{desc:'1 use: the holder auto-passes the first horror-on-sight roll.'}),
 repairkit:I('repairkit','Repair kit','Tool',{uses:2,desc:'2 uses: mend one wear step on a weapon or armor, no roll.'}),
 firearrows:I('firearrows','Fire arrows','Tool',{uses:3,desc:'3 uses: the next bow shot does double to things that burn.'}),
 venom:I('venom','Blade venom','Tool',{uses:2,desc:'2 uses: the next melee hit Poisons.'}),
 holywater:I('holywater','Holy water','Charm',{desc:'1 use: works only on an unnatural thing whose true tale names it.'}),
 coldiron:I('coldiron','Cold iron','Charm',{desc:'1 use: works only on an unnatural thing whose true tale names it.'}),
 silver:I('silver','Silver','Charm',{desc:'1 use: works only on an unnatural thing whose true tale names it.'}),
 rope:I('rope','Rope','Gear',{uses:0,desc:'Never used up: a climb with somewhere to tie off needs no roll.'}),
 crowbar:I('crowbar','Crowbar','Gear',{uses:0,desc:'Never used up: Force it is no longer Loud.'}),
 lantern:I('lantern','Horn lantern','Gear',{uses:0,desc:'Lights the area without taking a weapon slot.'}),
 // armor and headwear (numbers in Combat; worn in BODY and HEAD)
 jack:I('jack','Padded jack','Body',{slot:'body',desc:'Body armor.'}),
 mail:I('mail','Mail shirt','Body',{slot:'body',desc:'Body armor.'}),
 plate:I('plate','Plate pieces','Body',{slot:'body',desc:'Body armor.'}),
 hood:I('hood','Hood','Head',{slot:'head',desc:'Headwear.'}),
 kettle:I('kettle','Kettle hat','Head',{slot:'head',desc:'Headwear.'}),
 coif:I('coif','Mail coif','Head',{slot:'head',desc:'Headwear.'}),
 herbmask:I('herbmask','Herb mask','Head',{slot:'head',desc:'Headwear.'}),
 buckler:I('buckler','Buckler','Shield',{slot:'gear',desc:'Takes no weapon slot; Defend takes half +1 off each hit.'}),
 roundshield:I('roundshield','Round shield','Shield',{slot:'weapon',desc:'With a one-handed weapon, Defend takes three-quarters off each hit.'}),
 heater:I('heater','Heater','Shield',{slot:'weapon',desc:'As the round shield; the first hit each fight takes half off; −10% Dodge.'}),
 pavise:I('pavise','Pavise','Shield',{slot:'weapon',desc:'Plant it: the bearer and one ally get −20% to be hit by Shooting.'}),
 // weapons
 sling:I('sling','Sling','Shooting',{slot:'weapon',skill:'Shooting',dmg:'1d6',desc:'1d6; silent.'}),
 shortbow:I('shortbow','Shortbow','Shooting',{slot:'weapon',skill:'Shooting',dmg:'1d8',desc:'1d8; silent; fires every turn.'}),
 longbow:I('longbow','Longbow','Shooting',{slot:'weapon',skill:'Shooting',dmg:'1d10',two:1,desc:'1d10; silent; two-handed; −20% to hit below STR 12.'}),
 crossbow:I('crossbow','Crossbow','Shooting',{slot:'weapon',skill:'Shooting',dmg:'2d6+3',two:1,desc:'2d6+3; armor counts 1 less; can\'t fire two turns in a row; two-handed.'}),
 cannon:I('cannon','Hand cannon','Shooting',{slot:'weapon',skill:'Shooting',dmg:'3d6+3',loud:1,desc:'3d6+3; Loud; ignores armor; Reload takes the next turn.'}),
 knife:I('knife','Knife','Melee',{slot:'weapon',skill:'Melee',dmg:'1d6',melee:1,desc:'1d6; silent.'}),
 cudgel:I('cudgel','Cudgel','Melee',{slot:'weapon',skill:'Melee',dmg:'1d8',melee:1,desc:'1d8; quiet.'}),
 cleaver:I('cleaver','Cleaver','Melee',{slot:'weapon',skill:'Melee',dmg:'1d6',melee:1,desc:'1d6; a hit causes Bleeding.'}),
 sickle:I('sickle','Sickle','Melee',{slot:'weapon',skill:'Melee',dmg:'1d6',melee:1,desc:'1d6; crits cause Bleeding.'}),
 shovel:I('shovel','Shovel','Melee',{slot:'weapon',skill:'Melee',dmg:'1d8',melee:1,desc:'1d8; quiet.'}),
 spear:I('spear','Spear','Melee',{slot:'weapon',skill:'Melee',dmg:'1d8',melee:1,desc:'1d8; an enemy it hits can\'t target the wielder next turn.'}),
 hammer:I('hammer','Tinker\'s hammer','Melee',{slot:'weapon',skill:'Melee',dmg:'1d8',melee:1,desc:'1d8; quiet; armor counts 1 less.'}),
 sword:I('sword','Arming sword','Melee',{slot:'weapon',skill:'Melee',dmg:'1d10',melee:1,desc:'1d10; crits cause Bleeding.'}),
 mace:I('mace','Mace','Melee',{slot:'weapon',skill:'Melee',dmg:'1d10',melee:1,desc:'1d10; armor counts 1 less.'}),
 halberd:I('halberd','Halberd','Melee',{slot:'weapon',skill:'Melee',dmg:'1d12+1',melee:1,two:1,hit:-10,desc:'1d12+1; −10% to hit; two-handed; a crit drops the enemy to last.'}),
 torch:I('torch','Torch','Melee',{slot:'weapon',skill:'Melee',dmg:'1d6',melee:1,desc:'1d6; things that burn take double; lights the area.'}),
 hatchet:I('hatchet','Hatchet','Melee',{slot:'weapon',skill:'Athletics',dmg:'1d8',melee:1,thrown:1,desc:'Thrown with Athletics: 1d8; lost for the rest of the fight.'}),
 jug:I('jug','Broken jug','Melee',{slot:'weapon',skill:'Melee',dmg:'1d6',melee:1,desc:'1d6; causes Bleeding; breaks after one fight.'}),
 axe:I('axe','Bearded axe','Melee',{slot:'weapon',skill:'Melee',dmg:'1d10',melee:1,desc:'1d10; a crit wears the target\'s body armor one step.'}),
 flail:I('flail','Flail','Melee',{slot:'weapon',skill:'Melee',dmg:'1d10',melee:1,desc:'1d10; ignores shields; a fumble hits the wielder for 1d4.'})
};
const FISTS={id:'fists',name:'Fists',type:'Melee',skill:'Melee',dmg:'1d4-1',melee:1};
window.RLS={STATS,STATNAME,SKILLS,SPECIES,SIZE,TRADES,TEMPLATES,MOTIVES,KIN,ITEMS,FISTS,
 STEPNAME:{title:'RUSHLIGHT',seed:'NEW RUN',company:'PICK A COMPANY',tweak:'TWEAK',trade:'TRADE',stats:'STATS',skills:'SKILLS',identity:'IDENTITY',kin:'KIN BOND',motives:'MOTIVATIONS',muster:'MUSTER ROLL',review:'MUSTER ROLL',import:'IMPORT',face:'FACE'}};
})();
// RLT(id, slots): a Text Library line by ID, with {merc} and {species} (and any other {slot}) filled in
window.RLT=function(id,slots){const r=window.RL_TEXT&&window.RL_TEXT[id];let t=r?r.t:id;if(slots)t=t.replace(/\{(\w+)\}/g,(m,k)=>slots[k]!=null?slots[k]:m);return t};
