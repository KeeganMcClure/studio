// Black Lantern · strings.js
// SHARED STRINGS: names, menus, items and creator lists used by every part of the game.
// Item and menu wording is designed in the Bible (Agents and items, Skills and menus) and copied in here.
// Case dialog does NOT live here: each case file opens with its own TEXT block.
window.BLS=(()=>{
// ---------- CREATOR LISTS: SKILLS, PROFESSIONS, TEAMS (Bible: Agents and items; Skills and menus) ----------
// The 18 skills and their Delta Green bases (Combat numbers, Skill bases).
const SKILLS={'Firearms':20,'Melee':30,'Dodge':30,'Athletics':30,'Search':20,'Persuade':20,'Forensics':10,'Occult':10,'History':10,'Science':10,'Empathy':10,'Bureaucracy':10,'Stealth':10,'Survival':10,'First Aid':10,'Medicine':10,'Computers':10,'Craft':10};
const SKILLJOB={'Firearms':'All guns.','Melee':'Hits for agents who can\'t shoot.','Dodge':'Defend in combat.','Athletics':'Climbing, chases, flee rolls.','Search':'Find clues, spot ambushes.','Persuade':'Talk your way in; dialog options.','Forensics':'Bodies and crime scenes; can unlock deductions.','Occult':'What a horror is and what hurts it.','History':'Old records, artifacts, strange languages.','Science':'Lab work, samples.','Empathy':'Read people; steady a teammate\'s nerves.','Bureaucracy':'Paperwork, access; slows overstepping.','Stealth':'Sneak past roamers.','Survival':'Wilderness, tracking, shortcuts.','First Aid':'Field healing.','Medicine':'Cure statuses, revive downed agents.','Computers':'Hacking, phones, records.','Craft':'Repairs, jury-rigs, explosives.'};
// A profession sets 2 strong skills at 50% and 2 backup skills at 30% (40% for Melee, Dodge and Athletics).
// weapon: key in WEAP (everyone else carries the handgun). kit: the Starting kit item, shown in the creator (wired into play with the item rules in Demo 5).
// pack: stand-in items from today's shared pack until then. abil: 2 of today's battle abilities, stand-ins until the Demo 5 battle moves.
// role, outfit, color: the case's party line, and the outfit the portrait and map sprite draw (color = index in OUTC).
const P=(id,name,team,strong,backup,weapon,kit,pack,abil,role,outfit,color,blurb)=>({id,name,team,strong,backup,weapon,kit,pack,abil,role,outfit,color,blurb,
  skills:Object.fromEntries([...strong.map(k=>[k,50]),...backup.map(k=>[k,['Melee','Dodge','Athletics'].includes(k)?40:30])])});
const PROFS=[
 P('shooter','Shooter','Field Team',['Firearms','Dodge'],['Search','Athletics'],'rifle',['Painkillers','1 use: heal 1d4 HP.'],{aid:1,coffee:1},['Double Tap','Suppress'],'Vanguard','tactical',1,'Trained to hit what they aim at. Nobody trained them for what they\'d be aiming at.'),
 P('medic','Medic','Field Team',['First Aid','Medicine'],['Empathy','Science'],'handgun',['Medkit','3 uses: heal 1d6 HP with no roll, outside First Aid\'s once-per-wound limit.'],{aid:2},['Triage','Patch Up'],'Healer','scrubs',6,'Steady hands, steadier voice. Both are about to be tested.'),
 P('investigator','Investigator','Field Team',['Forensics','Search'],['Persuade','Occult'],'handgun',['Pocket recorder','Once per case: play a witness\'s words to someone else to unlock a hidden line.'],{coffee:1,salts:1},['Badge Flash','Analyze'],'Investigator','suit',4,'Asks questions until something answers.'),
 P('clerk','Clerk','Paper Trail',['Bureaucracy','History'],['Persuade','Computers'],'handgun',['Hotline to Big Hat','Once per case: request one Lantern Box item (Bureaucracy roll at its Req modifier +15%).'],{coffee:2},['Badge Flash','Composure'],'Analyst','cardigan',4,'Knows which form opens which door, and which drawer the bad file is in.'),
 P('hacker','Hacker','Paper Trail',['Computers','Search'],['Craft','Stealth'],'handgun',['Signal jammer','Once per case: kills phones and cameras in an area, so overstepping doesn\'t climb there.'],{tape:2},['Overclock','Spoof'],'Tech','hoodie',5,'Lives in the wires. Lately the wires whisper back.'),
 P('talker','Talker','Paper Trail',['Persuade','Empathy'],['Bureaucracy','Stealth'],'handgun',['Roll of cash','Once per case: bribe one person past a door or for a secret, no roll.'],{coffee:1,spray:1},['Badge Flash','Command Voice'],'Morale','suit',2,'Could sell a ghost its own house.'),
 P('bruiser','Bruiser','Medics and Muscle',['Melee','Athletics'],['Craft','Dodge'],'bat',['Energy drink','1 use: clears Exhausted, +1d4 WP.'],{aid:1,coffee:1},['Baton','Command Voice'],'Bruiser','hoodie',2,'Solves problems at arm\'s length, or closer.'),
 P('bodyguard','Bodyguard','Medics and Muscle',['Dodge','Firearms'],['Melee','Search'],'shotgun',['Zip ties','Once per case: tie up a beaten human enemy for an extra clue at the debrief.'],{aid:1,flare:1},['Cover','Suppress'],'Vanguard','suit',5,'Stands between the client and the bullet. The client is now you.'),
 P('cmedic','Combat medic','Medics and Muscle',['Medicine','First Aid'],['Firearms','Dodge'],'handgun',['Adrenaline shot','Once per case: a Downed agent stands at 1d4 HP, no roll.'],{aid:2},['Patch Up','Adrenaline'],'Support','scrubs',1,'Patches people up under fire. Checks every pulse twice.'),
 P('occultist','Occultist','Night Shift',['Occult','History'],['Search','Empathy'],'handgun',['Old charm','Once per case: the holder auto-passes the first horror-on-sight roll.'],{salts:2},['Recall Lore','Ward'],'Lorekeeper','cardigan',3,'Read the wrong book once and never stopped reading.'),
 P('scientist','Scientist','Night Shift',['Science','Forensics'],['Medicine','Computers'],'handgun',['UV lamp','Once per case: reveals hidden unnatural hotspots in one area.'],{flare:1,spray:1},['Analyze','Jury-Rig'],'Analyst','labcoat',6,'Believes everything has an explanation. That belief is load-bearing.'),
 P('tracker','Tracker','Night Shift',['Survival','Stealth'],['Athletics','Firearms'],'bow',['Snare trap','Once per case: a roamer is caught and you slip past, or the fight opens with it Stunned.'],{aid:1,flare:1},['Read the Woods','Dog Sense'],'Tracker','ranger',1,'Follows what doesn\'t want to be followed.'),
 P('exterminator','Exterminator','Short Notice',['Craft','Science'],['Stealth','Search'],'handgun',['Bug bomb','Once per fight: every living enemy is Poisoned.'],{spray:1,tape:1},['Jury-Rig','Mop Sweep'],'Scrapper','janitor',1,'Thirty years of crawlspaces. Nothing down there surprises them. Almost.'),
 P('funeral','Funeral director','Short Notice',['Forensics','Empathy'],['Bureaucracy','Medicine'],'handgun',['Smelling salts','2 uses: each clears Sickened.'],{salts:2},['Composure','Final Arrangements'],'Undertaker','suit',5,'Calm around the dead. Concerned about the ones that sit up.'),
 P('reporter','Small-town reporter','Short Notice',['History','Persuade'],['Computers','Search'],'handgun',['Camera','Once per case: photograph a clue to unlock an extra cover story at the debrief.'],{coffee:2},['Analyze','Knows the Building'],'Courier','cardigan',2,'Knows everybody\'s business. Now knows something nobody should.'),
 P('therapist','Therapist','Off the Clock',['Empathy','Persuade'],['Medicine','Search'],'handgun',['Sedatives','2 uses: each calms a disorder flare for the scene.'],{salts:1,tranq:1},['Last Rites','Composure'],'Confessor','cardigan',6,'Talks people down from ledges. Some ledges are inside.'),
 P('hockey','Hockey player','Off the Clock',['Melee','Athletics'],['Dodge','First Aid'],'stick',['Ice pack','1 use: heal 1d4 HP and clear Stunned.'],{aid:1,coffee:1},['Baton','Cover'],'Bruiser','hoodie',0,'Beer-league enforcer. Plays dirty, heals fast.'),
 P('ranger','Park ranger','Off the Clock',['Survival','Search'],['Firearms','First Aid'],'huntrifle',['Bear spray','Once per case: a beast-like enemy is Stunned.'],{spray:1,aid:1},['Bear Spray','Read the Woods'],'Tracker','ranger',4,'Knows every trail in the county, including the one that wasn\'t there yesterday.'),
];
// Battle ability descriptions (today's battle; the Demo 5 battle moves replace them)
const ABILTXT={'Badge Flash':'Rattle a foe. They may lose a turn.','Double Tap':'Two fast shots at one target.','Triage':'Heal one agent a lot.','Sedate':'Knock a foe out for 2 turns.','Analyze':'Reveal a foe\'s weakness.','Jury-Rig':'A one-shot gadget that never misses.','Suppress':'All foes lose accuracy for a round.','Cover':'Take the next hit meant for an ally.','Recall Lore':'Learn what a horror is and what hurts it.','Ward':'Shield the party from the next SAN hit.','Overclock':'An ally acts first next round.','Spoof':'Throw out a decoy that draws attacks.','Baton':'Stun a foe on a hit.','Command Voice':'Pull every foe\'s attention onto you.','Patch Up':'Heal an ally and clear bleeding.','Adrenaline':'Give an ally an extra action.','Bear Spray':'Blind every foe for 2 rounds.','Read the Woods':'Party gets +20 to hit for 2 rounds.','Last Rites':'Restore SAN to the whole party.','Dog Sense':'An attack that never misses.','Composure':'Shield the party from the next SAN hit.','Final Arrangements':'Heavy damage that never misses.','Mop Sweep':'Hit every foe at once.','Knows the Building':'Guaranteed escape from a normal fight.'};
PROFS.forEach(p=>{p.abil=p.abil.map(n=>[n,ABILTXT[n]])});
// Team templates: 3 ready-made agents each (Claude designs these people; all renamable and tweakable).
// T(name, codename, profession, [STR,CON,DEX,INT,POW,CHA], bonus picks, [[Bond type, name] x2], [Main motivation, second], [skin,hair,hair color,eyes,eye color,extra], backstory)
const T=(name,code,prof,st,picks,bonds,motives,lk,backstory)=>({name,code,prof,stats:{STR:st[0],CON:st[1],DEX:st[2],INT:st[3],POW:st[4],CHA:st[5]},picks,bonds:bonds.map(([rel,n])=>({rel,name:n})),motives,main:0,look:{skin:lk[0],hair:lk[1],hairC:lk[2],eyes:lk[3],eyeC:lk[4],acc:lk[5],outfitC:-1},backstory});
const TEAMS=[
 {id:'field',name:'Field Team',tag:'Balanced',blurb:'The balanced starter. Good at a little of everything, great at nothing.',seats:[
  T('Marisol Vega','IRON HERON','shooter',[13,13,15,10,11,10],{Firearms:1,Dodge:1,Athletics:1,Occult:2,Melee:1,Stealth:1,'First Aid':1},[['Kid','Marco'],['Sibling','Dana']],['Duty','Revenge'],[2,4,0,0,0,8],'Two tours, then home to a quiet street. Took up tarot to calm down. The cards keep drawing the Tower.'),
  T('June Bell','PALE CANDLE','medic',[9,12,12,14,13,12],{'First Aid':1,Medicine:1,Empathy:1,Science:1,Persuade:1,Dodge:1,Search:1,Stealth:1},[['Partner','Ruth'],['Parent','Walt']],['Protect the innocent','Faith'],[0,1,4,1,2,7],'ER nurse on nights for eleven years. Asked one question too many about a patient who stopped breathing and kept talking.'),
  T('Gus Hale','GRAY LOCKET','investigator',[11,11,10,15,14,11],{Forensics:1,Search:1,History:2,Persuade:1,Occult:1,Empathy:1,Firearms:1},[['Ex','Nadia'],['Mentor','Ray']],['Find the truth','Redemption'],[4,2,5,2,0,3],'County detective, retired early. One cold case is still pinned above his kitchen sink.')]},
 {id:'paper',name:'Paper Trail',tag:'Clues+ Fights-',blurb:'Strong at clues, weak in fights. Every door opens; not every door should.',seats:[
  T('Imani Okafor','PAPER SPARROW','clerk',[8,11,10,16,14,13],{Bureaucracy:1,History:1,Persuade:1,Computers:1,Search:1,Empathy:1,Dodge:1,Occult:1},[['Kid','Theo'],['Parent','Alma']],['Family','Duty'],[4,4,0,0,0,1],'Files permits for the county. Noticed one cemetery keeps selling plots and never holds a burial.'),
  T('Felix Park','TIN MOTH','hacker',[9,10,14,16,12,11],{Computers:1,Search:1,Stealth:1,Craft:1,Science:1,Dodge:1,Occult:1,Persuade:1},[['Sibling','Mae'],['Friend','Luca']],['Curiosity','Find the truth'],[1,0,0,2,0,1],'Got paid to break into a server farm in Ohio. Found a folder of photos of himself, taken from inside his apartment.'),
  T('Rosa Navarro','VELVET HARBOR','talker',[10,11,11,12,13,15],{Persuade:1,Empathy:1,Bureaucracy:1,Stealth:1,History:1,Dodge:1,Search:1,Firearms:1},[['Ex','Owen'],['Friend','Bea']],['Money','Redemption'],[2,6,1,1,1,8],'Sold timeshares, then cars, then a bridge that technically existed. Owes Big Hat a favor she doesn\'t remember borrowing.')]},
 {id:'muscle',name:'Medics and Muscle',tag:'Fights+ Clues-',blurb:'Strong in fights, weak at clues. They\'ll survive the case. Solving it is another matter.',seats:[
  T('Hank Brandt','LOW RIVET','bruiser',[16,15,11,9,11,10],{Melee:1,Athletics:1,Craft:1,Dodge:1,Firearms:1,'First Aid':1,Search:1,Persuade:1},[['Kid','Josie'],['Parent','Lou']],['Family','Protect the innocent'],[1,2,1,2,0,3],'Bounced at a roadhouse for twenty years. The night something wouldn\'t stay thrown out, he went back in after it.'),
  T('Nadia Kask','QUIET STEEPLE','bodyguard',[13,13,15,10,11,10],{Dodge:1,Firearms:1,Melee:1,Search:1,Athletics:1,Empathy:1,Stealth:1,'First Aid':1},[['Partner','Cyrus'],['Mentor','Mira']],['Duty','Money'],[0,4,3,0,3,4],'Private protection for people who pay in cash. Her last client is still technically alive.'),
  T('Owen Achebe','SECOND WICK','cmedic',[12,13,12,13,12,10],{Medicine:1,'First Aid':1,Firearms:1,Dodge:1,Athletics:1,Search:1,Empathy:1,Stealth:1},[['Sibling','Grace'],['Friend','Ray']],['Redemption','Faith'],[5,2,0,2,0,5],'Army medic, then a long stretch of nothing. Says he\'s fine. Checks every pulse twice.')]},
 {id:'night',name:'Night Shift',tag:'SAN+ Long fights-',blurb:'The occult crew. Loses less SAN to horrors, but fragile in long fights.',seats:[
  T('Iris Moreau','DUSK CANAL','occultist',[8,10,11,16,16,11],{Occult:1,History:1,Search:1,Empathy:1,Persuade:1,Dodge:1,Science:1,Stealth:1},[['Mentor','Abel'],['Sibling','Lena']],['Faith','Curiosity'],[0,6,6,0,4,0],'Ran a used bookshop with a back room nobody was allowed in. She let the wrong customer in.'),
  T('Cyrus Lund','SALT ORCHARD','scientist',[9,11,12,17,12,11],{Science:1,Forensics:1,Medicine:1,Computers:1,Occult:1,History:1,Search:1,Dodge:1},[['Partner','Dale'],['Kid','Ada']],['Find the truth','Money'],[0,2,3,1,3,1],'Soil chemist for the state farm board. His samples from one farm keep coming back warm.'),
  T('Walt Greer','HOLLOW TIDE','tracker',[13,14,14,10,12,9],{Survival:1,Stealth:1,Athletics:1,Firearms:1,Search:1,Dodge:1,Melee:1,'First Aid':1},[['Kid','Sadie'],['Ex','Marla']],['Revenge','Protect the innocent'],[3,0,5,2,1,3],'Guides hunters in the hills. Two seasons ago a client walked off the trail and came back wrong.')]},
 {id:'short',name:'Short Notice',tag:'Odd jobs',blurb:'Oddballs who saw something and got recruited instead of silenced. Hands-on with bodies, traps and gossip; nobody trained to fight.',seats:[
  T('Ray Duval','IRON MOTH','exterminator',[13,14,12,12,11,10],{Craft:1,Science:1,Stealth:1,Search:1,Melee:1,Athletics:1,Firearms:1,Forensics:1},[['Partner','Bev'],['Kid','Danny']],['Money','Family'],[1,3,0,2,0,3],'Thirty years of crawlspaces. Last month something in one said his name, and he finished the job anyway.'),
  T('Mae Whitlock','CEDAR CANDLE','funeral',[10,12,11,13,15,11],{Forensics:1,Empathy:1,Bureaucracy:1,Medicine:1,Occult:1,Persuade:1,Search:1,Dodge:1},[['Parent','Harold'],['Friend','Dot']],['Faith','Duty'],[0,4,5,0,4,1],'Third-generation undertaker. Knows the difference between a body that\'s resting and one that\'s waiting.'),
  T('Theo Quill','PAPER HARBOR','reporter',[10,10,13,14,12,13],{History:1,Persuade:1,Computers:1,Search:1,Stealth:1,Empathy:1,Dodge:1,Occult:1},[['Sibling','Cass'],['Coworker','Lyle']],['Find the truth','Curiosity'],[1,6,2,0,1,7],'Runs the county weekly out of his garage. The story they told him to kill is the one that got him recruited.')]},
 {id:'clock',name:'Off the Clock',tag:'Tough, no paper',blurb:'People with normal jobs who got pulled in. Tough in body and mind, with a Therapist to cushion SAN; records and lab clues are hard.',seats:[
  T('Priya Sato','GRAY SPARROW','therapist',[9,11,11,14,15,12],{Empathy:1,Persuade:1,Medicine:1,Search:1,Occult:1,History:1,Dodge:1,Stealth:1},[['Partner','Ben'],['Parent','Asha']],['Protect the innocent','Redemption'],[3,1,0,1,0,1],'Couples counselor. Three clients in a row described the same dream, down to the color of the door.'),
  T('Luca Bishop','LOW HERON','hockey',[16,15,13,9,10,9],{Melee:1,Athletics:1,Dodge:1,'First Aid':1,Occult:1,Firearms:1,Search:1,Stealth:1},[['Kid','Benny'],['Coworker','Moose']],['Family','Revenge'],[0,0,3,0,3,4],'Beer-league enforcer with a day job at the rink. Something under the ice keeps knocking back.'),
  T('Alma Crane','QUIET ORCHARD','ranger',[12,14,13,12,12,9],{Survival:1,Search:1,Firearms:1,'First Aid':1,Athletics:1,Stealth:1,Science:1,Dodge:1},[['Friend','Hal'],['Sibling','Joy']],['Duty','Find the truth'],[2,4,5,2,1,0],'Twenty years in the state forest. Lately she finds campsites with the tents zipped shut from outside.')]},
];
// Bonds: 2 people, each a type from this list, then named; each starts at CHA. The type decides which home scenes they get.
const RELS=['Partner','Kid','Parent','Sibling','Friend','Ex','Coworker','Mentor'];
const RELTXT={Partner:'shares your bed and your bad mornings.',Kid:'someone small who waits at the window for you.',Parent:'still asks if you\'re eating.',Sibling:'knows every story you lie about, and the true version.',Friend:'picks up at 3 a.m. and doesn\'t ask why.',Ex:'still has a key. Still knows which step creaks.',Coworker:'covers your shifts and your excuses.',Mentor:'taught you the job, and to stop asking about it.'};
const STATS=['STR','CON','DEX','INT','POW','CHA'];
const STATNAME={STR:'Strength',CON:'Constitution',DEX:'Dexterity',INT:'Intelligence',POW:'Power',CHA:'Charisma'};
const FEAT={STR:['Struggles with pickle jars','Could carry a vending machine'],CON:['Catches every cold going','Hasn\'t been sick since 2009'],DEX:['Trips on flat ground','Catches flies with chopsticks'],INT:['Reads the same page twice','Does the crossword in pen'],POW:['Easily rattled','Unnervingly calm'],CHA:['Says the wrong thing at funerals','Strangers tell them secrets']};
const FIRST=['Dana','Marcus','Ruth','Eli','Priya','Tom','Nadia','Gus','Lena','Owen','Rosa','Walt','June','Felix','Imani','Hank','Mae','Theo','Bea','Cyrus','Alma','Ray','Iris','Luca'];
const LAST=['Holloway','Ortiz','Kask','Brandt','Okafor','Whitlock','Park','Duval','Moreau','Fitch','Abernathy','Quill','Navarro','Sato','Greer','Lund','Vance','Bishop','Achebe','Crane'];
// Motivations (Bible: Systems, Motivations): each agent picks 2 and marks one Main, which drives their personal arc.
const MOTIVES=['Protect the innocent','Find the truth','Family','Faith','Revenge','Duty','Curiosity','Money','Redemption'];
const MOTTXT={'Protect the innocent':'Someone has to stand between people and the dark.','Find the truth':'Not knowing is worse. Probably.','Family':'Does all this so the people at home never have to see it.','Faith':'Believes something is listening. Hopes it\'s the right something.','Revenge':'Something took something. It\'s going to pay.','Duty':'Signed the papers. Means to honor them.','Curiosity':'Has to know what\'s behind the door. Every door.','Money':'The pay is good, and the dead don\'t spend.','Redemption':'Owes the world a debt and means to pay it back.'};
const ADJ=['QUIET','PALE','CEDAR','NINTH','HOLLOW','SALT','VELVET','IRON','DUSK','PAPER','TIN','LOW','GRAY','SECOND'];
const NOUN=['HERON','ORCHARD','MOTH','SPARROW','CANAL','HARBOR','PILGRIM','RIVET','CANDLE','WICK','TIDE','LOCKET','STEEPLE','GARDEN'];
const HAIRCN=['Black','Dark brown','Brown','Blonde','Red','Gray','White'];
const HAIRS=['Short','Long','Buzz','Bald','Bun','Mohawk','Curly'];
const EYES=['Bright','Wide','Tired'];
const EYEC=['Brown','Hazel','Green','Blue','Gray'];
const ACC=['None','Glasses','Shades','Beard','Scar','Earpiece','Eyepatch','Freckles','Earring'];
const OUTCN=['Navy','Olive','Maroon','Violet','Khaki','Black','Teal'];
const CREEP=['IT KNOWS YOUR NAME','DON\'T LOOK AT THE CORNERS','WHO IS STANDING BEHIND YOU','YOU HAVE BEEN HERE BEFORE','THE FILE IS WRITING ITSELF','STOP COUNTING THE DOORS'];
// ---------- TODAY'S SHARED ITEM PACK (stand-in until the Demo 5 item rules) & WEAPONS ----------
const ITEMDEF={aid:{name:'First Aid Kit',desc:'Heal 1d8+3. Gets a downed agent back up.'},coffee:{name:'Thermos Coffee',desc:'Restore 1d4+1 WP.'},flare:{name:'Road Flare',desc:'Burn one foe for 2d6+2.',battle:true},bell:{name:'Church Handbell',desc:'Stun every foe for a round.',battle:true},
 salts:{name:'Smelling Salts',desc:'Restore 1d4 SAN to one agent.'},tranq:{name:'Tranquilizer',desc:'Stun one foe for 2 rounds.',battle:true},spray:{name:'Pepper Spray',desc:'Blind every foe for 2 rounds.',battle:true},tape:{name:'Duct Tape',desc:'Patch 1d4+1 HP. Can\'t revive.'}};
// Weapons (Bible: Starting kit; dice from Combat numbers). Everyone carries the handgun; six professions carry something better.
const WEAP={handgun:{name:'handgun',skill:'Firearms',dmg:[1,8],verb:'fires the handgun'},rifle:{name:'assault rifle',skill:'Firearms',dmg:[2,4],plus:1,loud:1,verb:'fires the assault rifle'},shotgun:{name:'shotgun',skill:'Firearms',dmg:[2,6],hit:-20,verb:'fires the shotgun'},huntrifle:{name:'hunting rifle',skill:'Firearms',dmg:[1,12],plus:2,verb:'fires the hunting rifle'},
 bow:{name:'compound bow',skill:'Firearms',dmg:[1,8],verb:'looses an arrow'},bat:{name:'baseball bat',skill:'Melee',dmg:[1,10],melee:1,verb:'swings the bat'},stick:{name:'hockey stick',skill:'Melee',dmg:[1,8],melee:1,verb:'swings the hockey stick'}};
const WEAPTXT={handgun:'1d8',rifle:'2d4+1 · Loud',shotgun:'2d6 · −20% to hit',huntrifle:'1d12+2 · can\'t fire two turns in a row',bow:'1d8 · silent',bat:'1d10 · quiet',stick:'1d8 · quiet · Stuns on a crit'};
// ---------- PARTY MENU (Bible: Skills and menus, Map menu and Quality of life; Systems, Statuses; spec 002) ----------
// Status chips and their detail lines, worded from the Statuses table. Map statuses arrive with their causes (later demos).
const STATUS={
 bleed:{chip:'BLEED',name:'Bleeding',line:'-1 HP each area change. First Aid, Treat or a rest ends it.',col:'#b5532e',pulse:1},
 poison:{chip:'POISON',name:'Poisoned',line:'-20% to all rolls, -1 HP every 2 area changes. Only Antitoxin or Treat ends it.',col:'#6a8a2a',pulse:1},
 sick:{chip:'SICK',name:'Sickened',line:'-20% to Athletics, Stealth, Melee, Firearms and Dodge. A rest or Retch ends it.',col:'#7a8a3a'},
 drunk:{chip:'DRUNK',name:'Drunk',line:'Each SAN loss is 1 smaller. -20% to Search, Forensics, Firearms, Computers. Wears off after 4 area changes.',col:'#8a4a6a'},
 high:{chip:'HIGH',name:'High',line:'-20% to rolls the drug doesn\'t help. Wears off after 4 area changes.',col:'#4a6a9a'},
 tired:{chip:'TIRED',name:'Exhausted',line:'WP doesn\'t refill and bracing costs double. A rest ends it.',col:'#5a5070'},
 shaken:{chip:'SHAKEN',name:'Shaken',line:'-20% to all rolls for the rest of the scene. The scene ending or Empathy\'s Calm ends it.',col:'#9a3a5a'}
};
const PARTY={
 title:'PARTY',hint:'SELECT swaps the lead',lead:'LEAD',banner:'LEAD · ',
 makeLead:'MAKE LEAD',dossier:'DOSSIER',give:'GIVE ITEM',
 isLead:'Already the lead.',giveWhy:'Item slots arrive with the Still Harvest rebuild.',
 none:'No conditions.',lowHP:'HP 3 or less: card blinks',
 tabs:['INFO','SKILLS','BONDS'],main:'MAIN MOTIVATION',noBack:'No backstory on file.',
 equipped:'EQUIPPED',toHit:'TO-HIT',disorder:'DISORDER',noDis:'None',bp:'BP',
 keys:['L/R: tabs · Up/Down: next agent','B: back to Party'],
 noBonds:'No Bonds on file.',score:'Score',
 moods:{close:'Close',strained:'Strained',fraying:'Fraying',broken:'Broken'}
};
// ---------- DISORDERS (names) ----------
const DIS=['Jumpy','Night terrors','Counting compulsion','Hypervigilance','Hollow stare','Can\'t stop smiling'];
// ---------- CREATOR STEP NAMES ----------
// Stat jobs (Bible: Agent creator, Worked out from stats) and weird hobbies (a bonus pick in a skill outside the profession)
const STATJOB={STR:'HP = (STR + CON) ÷ 2. STR 13+ adds +1 Melee damage.',CON:'HP = (STR + CON) ÷ 2. Roll CON × 5 to shrug off Poisoned or Sickened, and to keep from retching.',DEX:'Sets turn order in a fight.',INT:'Once per case, stuck on a deduction, roll INT × 5 for a Hunch.',POW:'WP = POW. SAN = POW × 5. Breaking Point = SAN − POW.',CHA:'Each Bond starts at CHA.'};
const HOBBY={'Firearms':'shoots skeet on Sundays','Melee':'boxes on weekends','Dodge':'has never been tagged at dodgeball','Athletics':'runs marathons','Search':'finds everyone\'s lost keys','Persuade':'could sell sand at the beach','Forensics':'watches true crime with a notebook','Occult':'reads tarot','History':'haunts the county archive','Science':'keeps a lab in the basement','Empathy':'can tell when you\'re lying','Bureaucracy':'loves a form in triplicate','Stealth':'never makes the floorboards creak','Survival':'hunts every fall','First Aid':'carries bandages for everyone','Medicine':'almost finished med school','Computers':'builds their own computers','Craft':'fixes anything with a wrench'};
// ---------- CASE BOARD (Bible: Story, Case board; spec 004) ----------
const BOARD={
 season:'SEASON',title:'CASE BOARD',closed:'CLOSED',briefing:'BRIEFING',back:'BACK',stamp:'CLOSED',file:'FILE',
 sticky:['NOBODY','TOUCH MY','CRULLERS.','—BH'],  // Big Hat's sticky note on the cork (mockup)
 // New game with a closed case (Skills and menus, Quality of life: Confirm what sticks)
 sure:'Can\'t be undone. Sure?',resetLine:'This starts Season 1 over. Your roster stays.',yes:'Yes, start over',no:'No, back to the title'
};
const STEPNAME={profession:'JOB',stats:'STATS',skills:'SKILLS',identity:'IDENTITY',bonds:'BONDS',motives:'MOTIVATIONS',dossier:'DOSSIER',title:'BLACK LANTERN',roster:'ROSTER',team:'YOUR TEAM',pick:'PICK A TEAM',confirm:'NEW GAME'};
const STEPSHORT={profession:'JOB',stats:'STATS',skills:'SKILL',identity:'ID',bonds:'BOND',motives:'WHY',dossier:'FILE'};
return {SKILLS,SKILLJOB,PROFS,ABILTXT,TEAMS,STATS,STATNAME,FEAT,RELS,RELTXT,FIRST,LAST,MOTIVES,MOTTXT,ADJ,NOUN,HAIRCN,HAIRS,EYES,EYEC,ACC,OUTCN,CREEP,ITEMDEF,WEAP,WEAPTXT,DIS,STEPNAME,STEPSHORT,STATJOB,HOBBY,STATUS,PARTY,BOARD};
})();
