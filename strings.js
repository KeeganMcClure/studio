// Black Lantern · strings.js
// SHARED STRINGS: names, menus, items and creator lists used by every part of the game.
// Item and menu wording is designed in the Bible (Agents and items, Skills and menus) and copied in here.
// Case dialog does NOT live here: each case file opens with its own TEXT block.
window.BLS=(()=>{
// ---------- CREATOR LISTS, PROFESSIONS, SPECIALTIES, ITEMS, WEAPONS ----------
const SKILLS={'Accounting':10,'Alertness':20,'Anthropology':0,'Archeology':0,'Art':0,'Athletics':30,'Bureaucracy':10,'Computer Science':0,'Craft':0,'Criminology':10,'Demolitions':0,'Disguise':10,'Dodge':30,'Drive':20,'Firearms':20,'First Aid':10,'Foreign Language':0,'Forensics':0,'Heavy Machinery':10,'Heavy Weapons':0,'History':10,'HUMINT':10,'Law':0,'Medicine':0,'Melee Weapons':30,'Military Science':0,'Navigate':10,'Occult':10,'Persuade':20,'Pharmacy':0,'Psychotherapy':10,'Ride':10,'Science':0,'Search':20,'SIGINT':0,'Stealth':10,'Surgery':0,'Survival':10,'Swim':20,'Unarmed Combat':40};
const P=(id,name,odd,role,blurb,abil,bonds,outfit,color,skills)=>({id,name,odd,role,blurb,abil,bonds,outfit,color,skills});
const PROFS=[
 P('fed','Federal Agent',0,'Investigator','Badge, warrant, and a car that smells like old coffee. Asks questions until something answers.',[['Badge Flash','Rattle a foe. They may lose a turn.'],['Double Tap','Two fast shots at one target.']],3,'suit',0,
  {'Alertness':50,'Bureaucracy':40,'Criminology':50,'Drive':50,'Firearms':50,'Forensics':30,'HUMINT':60,'Law':30,'Persuade':50,'Search':50,'Unarmed Combat':60}),
 P('doc','Physician',0,'Healer','Has seen how bodies fail. Is about to see how they fail wrong.',[['Triage','Heal one agent a lot.'],['Sedate','Knock a foe out for 2 turns.']],3,'labcoat',6,
  {'Bureaucracy':50,'First Aid':60,'Medicine':60,'Persuade':40,'Pharmacy':50,'Science':60,'Search':40,'Surgery':40}),
 P('sci','Scientist',0,'Analyst','Believes everything has an explanation. That belief is load-bearing.',[['Analyze','Reveal a foe\'s weakness.'],['Jury-Rig','A one-shot gadget that never misses.']],4,'labcoat',3,
  {'Bureaucracy':40,'Computer Science':40,'Craft':40,'Science':60,'Search':40,'Accounting':20,'Foreign Language':30}),
 P('ops','Special Operator',0,'Vanguard','Trained to take any hill. Nobody trained them for what lives under this one.',[['Suppress','All foes lose accuracy for a round.'],['Cover','Take the next hit meant for an ally.']],2,'tactical',1,
  {'Alertness':60,'Athletics':60,'Demolitions':40,'Firearms':60,'Heavy Weapons':50,'Melee Weapons':50,'Military Science':60,'Navigate':50,'Stealth':50,'Survival':50,'Swim':50,'Unarmed Combat':60}),
 P('occ','Occult Scholar',0,'Lorekeeper','Read the wrong book in grad school and never stopped reading.',[['Recall Lore','Learn what a horror is and what hurts it.'],['Ward','Shield the party from the next SAN hit.']],4,'cardigan',4,
  {'Anthropology':50,'Archeology':40,'Bureaucracy':30,'Foreign Language':50,'History':60,'Occult':60,'Persuade':40,'Search':50}),
 P('hack','Hacker',0,'Tech','Lives in the wires. Lately the wires have been whispering back.',[['Overclock','An ally acts first next round.'],['Spoof','Throw out a decoy that draws attacks.']],3,'hoodie',5,
  {'Accounting':30,'Computer Science':60,'Craft':40,'Persuade':30,'Search':40,'SIGINT':50,'Stealth':30}),
 P('cop','Police Officer',0,'Bruiser','Twelve years on nights. Thought they had seen everything. Bless their heart.',[['Baton','Stun a foe on a hit.'],['Command Voice','Pull every foe\'s attention onto you.']],3,'uniform',0,
  {'Alertness':60,'Bureaucracy':40,'Criminology':40,'Drive':50,'Firearms':40,'First Aid':30,'HUMINT':50,'Law':30,'Melee Weapons':50,'Navigate':40,'Persuade':40,'Search':40,'Unarmed Combat':60}),
 P('medic','Paramedic',0,'Support','Fast hands, steady voice, dark sense of humor. All three are about to be tested.',[['Patch Up','Heal an ally and clear bleeding.'],['Adrenaline','Give an ally an extra action.']],3,'scrubs',2,
  {'Alertness':40,'Athletics':40,'Drive':50,'First Aid':60,'Medicine':40,'Pharmacy':40,'Psychotherapy':30,'Search':40}),
 P('ranger','Park Ranger',1,'Tracker','Knows every trail in the county, including the one that wasn\'t there yesterday.',[['Bear Spray','Blind every foe for 2 rounds.'],['Read the Woods','Party gets +20 to hit for 2 rounds.']],2,'ranger',4,
  {'Alertness':60,'Firearms':40,'First Aid':40,'Navigate':60,'Ride':40,'Science':30,'Search':40,'Survival':60,'Swim':40}),
 P('priest','Priest',1,'Confessor','Hears confessions for a living. One of them was not from anything human.',[['Last Rites','Restore SAN to the whole party.'],['Sermon','Each foe may freeze for a turn.']],4,'clerical',5,
  {'Bureaucracy':30,'Foreign Language':50,'History':40,'HUMINT':50,'Occult':40,'Persuade':60,'Psychotherapy':50}),
 P('mail','Mail Carrier',1,'Courier','Twenty years, same route. Recently noticed one more house on it than there should be.',[['Certified Delivery','Heal an ally and restore 2 WP.'],['Dog Sense','An attack that never misses.']],4,'mail',6,
  {'Alertness':50,'Athletics':50,'Dodge':50,'Drive':50,'Navigate':60,'Persuade':30,'Search':40}),
 P('mort','Funeral Director',1,'Undertaker','Calm around the dead. Concerned about the ones that keep sitting up.',[['Composure','Shield the party from the next SAN hit.'],['Final Arrangements','Heavy damage that never misses.']],3,'suit',5,
  {'Bureaucracy':40,'Craft':40,'Forensics':40,'Medicine':30,'Persuade':50,'Pharmacy':30,'Psychotherapy':40}),
 P('jan','Night Janitor',1,'Scrapper','Has keys to every door in the building, including the one in the basement nobody talks about.',[['Mop Sweep','Hit every foe at once.'],['Knows the Building','Guaranteed escape from a normal fight.']],3,'janitor',2,
  {'Alertness':50,'Craft':50,'Heavy Machinery':50,'Melee Weapons':40,'Science':20,'Search':50,'Stealth':50}),
 P('truck','Ice Cream Truck Driver',1,'Morale','The song never stops. Lately, neither do the children following the truck.',[['The Jingle','Restore WP to the whole party.'],['Rocket Pop','Throw a sticky treat. Damage and a stun.']],4,'apron',3,
  {'Accounting':30,'Alertness':40,'Craft':40,'Drive':60,'HUMINT':40,'Persuade':50}),
];
const STATS=['STR','CON','DEX','INT','POW','CHA'];
const STATNAME={STR:'Strength',CON:'Constitution',DEX:'Dexterity',INT:'Intelligence',POW:'Power',CHA:'Charisma'};
const FEAT={STR:['Struggles with pickle jars','Could carry a vending machine'],CON:['Catches every cold going','Hasn\'t been sick since 2009'],DEX:['Trips on flat ground','Catches flies with chopsticks'],INT:['Reads the same page twice','Does the crossword in pen'],POW:['Easily rattled','Unnervingly calm'],CHA:['Says the wrong thing at funerals','Strangers tell them secrets']};
const RELS=['Spouse','Partner','Child','Parent','Sibling','Best friend','Ex','Old partner','Mentor','Neighbor','Roommate','Bandmate','Therapist','Coworker','Sponsor'];
const FIRST=['Dana','Marcus','Ruth','Eli','Priya','Tom','Nadia','Gus','Lena','Owen','Rosa','Walt','June','Felix','Imani','Hank','Mae','Theo','Bea','Cyrus','Alma','Ray','Iris','Luca'];
const LAST=['Holloway','Ortiz','Kask','Brandt','Okafor','Whitlock','Park','Duval','Moreau','Fitch','Abernathy','Quill','Navarro','Sato','Greer','Lund','Vance','Bishop','Achebe','Crane'];
const MOTIVES=['Protect my kid','Make it to retirement','Find out what happened to my brother','Prove I\'m not crazy','Finish my novel','See the Grand Canyon','Win the county chili cook-off','Keep the dog alive','Make Mom proud','Learn the truth','Never be afraid again','Get even','Fix what I broke','Be somebody\'s hero','Pay off the house','Stay sober'];
const ADJ=['QUIET','PALE','CEDAR','NINTH','HOLLOW','SALT','VELVET','IRON','DUSK','PAPER','TIN','LOW','GRAY','SECOND'];
const NOUN=['HERON','ORCHARD','MOTH','SPARROW','CANAL','HARBOR','PILGRIM','RIVET','CANDLE','WICK','TIDE','LOCKET','STEEPLE','GARDEN'];
const HAIRCN=['Black','Dark brown','Brown','Blonde','Red','Gray','White'];
const HAIRS=['Short','Long','Buzz','Bald','Bun','Mohawk','Curly'];
const EYES=['Dots','Wide','Tired'];
const ACC=['None','Glasses','Shades','Beard','Scar','Earpiece','Eyepatch'];
const OUTCN=['Navy','Olive','Maroon','Violet','Khaki','Black','Teal'];
const CREEP=['IT KNOWS YOUR NAME','DON\'T LOOK AT THE CORNERS','WHO IS STANDING BEHIND YOU','YOU HAVE BEEN HERE BEFORE','THE FILE IS WRITING ITSELF','STOP COUNTING THE DOORS'];
// ---------- SPECIALTIES & STARTING KITS ----------
const ITEMDEF={aid:{name:'First Aid Kit',desc:'Heal 1d8+3. Gets a downed agent back up.'},coffee:{name:'Thermos Coffee',desc:'Restore 1d4+1 WP.'},flare:{name:'Road Flare',desc:'Burn one foe for 2d6+2.',battle:true},bell:{name:'Church Handbell',desc:'Stun every foe for a round.',battle:true},
 salts:{name:'Smelling Salts',desc:'Restore 1d4 SAN to one agent.'},tranq:{name:'Tranquilizer',desc:'Stun one foe for 2 rounds.',battle:true},spray:{name:'Pepper Spray',desc:'Blind every foe for 2 rounds.',battle:true},tape:{name:'Duct Tape',desc:'Patch 1d4+1 HP. Can\'t revive.'}};
const WEAP={snub:{name:'snub-nose',skill:'Firearms',dmg:[1,8],verb:'fires the snub-nose'},revolver:{name:'revolver',skill:'Firearms',dmg:[1,10],verb:'fires the revolver'},shotgun:{name:'shotgun',skill:'Firearms',dmg:[2,6],verb:'fires the shotgun'},rifle:{name:'rifle',skill:'Firearms',dmg:[1,12],verb:'fires the rifle'},
 shovel:{name:'shovel',skill:'Melee Weapons',dmg:[1,8],melee:1,verb:'swings the shovel'},trocar:{name:'trocar',skill:'Melee Weapons',dmg:[1,8],melee:1,verb:'jabs with the trocar'},wrench:{name:'pipe wrench',skill:'Melee Weapons',dmg:[1,8],melee:1,verb:'swings the pipe wrench'},machete:{name:'machete',skill:'Melee Weapons',dmg:[1,8],melee:1,verb:'swings the machete'}};
const SP=(id,name,blurb,items,weapon)=>({id,name,blurb,items,weapon});
const SPECS={
 fed:[SP('field','Field Agent','Kicks doors, reads rights, keeps a spare thermos in the trunk.',{aid:1,coffee:2},'revolver'),SP('under','Undercover','Three years as somebody else. Still answers to the wrong name.',{spray:1,salts:1,coffee:1},'snub')],
 doc:[SP('er','ER Doctor','Has seen every way a Saturday night can go wrong. Almost.',{aid:3,tranq:1}),SP('psych','Psychiatrist','Talks people down from ledges. Some ledges are inside.',{salts:2,tranq:2})],
 sci:[SP('chem','Chemist','Can make a fire out of anything under a kitchen sink.',{flare:2,spray:1}),SP('bio','Field Biologist','Has a sample jar for everything, including things that should not exist.',{aid:1,spray:1,salts:1})],
 ops:[SP('breach','Breacher','First through the door. Last to ask what\'s behind it.',{flare:1,aid:1},'shotgun'),SP('recon','Recon','Watches from far away. Lately, something watches back.',{spray:1,coffee:2},'rifle')],
 occ:[SP('folk','Folklorist','Collects charms, rhymes and the reasons grandmothers hang bells.',{bell:1,salts:2}),SP('arch','Archivist','Knows which drawer the bad book is in. Keeps it locked.',{salts:1,coffee:2,flare:1})],
 hack:[SP('pen','Pen Tester','Gets paid to break in. Fixes everything with tape.',{tape:2,coffee:2}),SP('broker','Data Broker','Sells secrets. Bought a few from the wrong seller.',{spray:1,tranq:1,coffee:1})],
 cop:[SP('patrol','Patrol','Twelve years in a cruiser with a shotgun rack and a cold coffee.',{aid:1,flare:1},'shotgun'),SP('det','Detective','Notebook, revolver, and a bad feeling about this one.',{coffee:2,salts:1},'revolver')],
 medic:[SP('ems','Street Medic','Has a bag for every emergency except this one.',{aid:3,coffee:1}),SP('flight','Flight Nurse','Calm at two thousand feet. Less calm on the ground lately.',{aid:2,salts:1,tranq:1})],
 ranger:[SP('back','Backcountry','Knows the deep woods and carries a rifle for a reason.',{flare:1,aid:1},'rifle'),SP('wild','Wildlife Officer','Darts bears for a living. Has never darted whatever that was.',{tranq:2,spray:1})],
 priest:[SP('parish','Parish Priest','Rings the bell on Sundays. Knows it works on other days too.',{bell:1,salts:2}),SP('chap','Hospital Chaplain','Sits with the dying. Some of them don\'t stay that way.',{salts:2,aid:1})],
 mail:[SP('rural','Rural Route','Ninety miles of gravel and every dog in the county.',{spray:2,coffee:1}),SP('city','City Route','Fixes busted mailboxes with tape. Fixes other things too.',{tape:2,spray:1})],
 mort:[SP('embalm','Embalmer','Steady hands. Very sharp tools.',{tranq:1,salts:1,aid:1},'trocar'),SP('grave','Gravedigger','Six feet down, every time. Makes sure they stay there.',{flare:1,coffee:1},'shovel')],
 jan:[SP('night','Night Shift','Mop, tape, and a flare from the emergency closet.',{tape:2,flare:1}),SP('boiler','Boiler Room','Lives near the furnace. Fire is a friend down there.',{flare:2,coffee:1},'wrench')],
 truck:[SP('route','Neighborhood Route','The kids love you. Mostly the kids.',{coffee:2,aid:1}),SP('fair','Fair Circuit','County fairs, carny friends, and a machete for coconuts.',{flare:1,coffee:1},'machete')]
};
// ---------- DISORDERS (names) ----------
const DIS=['Jumpy','Night terrors','Counting compulsion','Hypervigilance','Hollow stare','Can\'t stop smiling'];
// ---------- CREATOR STEP NAMES ----------
const STEPNAME={profession:'PROFESSION',loadout:'SPECIALTY',stats:'STATISTICS',skills:'SKILLS',bonds:'BONDS',look:'APPEARANCE',identity:'IDENTITY',dossier:'DOSSIER',title:'BLACK LANTERN',roster:'ROSTER'};
return {SKILLS,P,PROFS,STATS,STATNAME,FEAT,RELS,FIRST,LAST,MOTIVES,ADJ,NOUN,HAIRCN,HAIRS,EYES,ACC,OUTCN,CREEP,ITEMDEF,WEAP,SP,SPECS,DIS,STEPNAME};
})();
