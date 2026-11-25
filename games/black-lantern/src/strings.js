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
// weapon: key in WEAP (everyone else carries the handgun). kit: the Starting kit item's name and line, shown in the creator (KIT below says which item).
// pack: the old shared pack's items (retired Nov 22). abil: 2 of today's battle abilities, stand-ins until the Demo 5 battle moves.
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
// T(name, codename, profession, [STR,CON,DEX,INT,POW,CHA], bonus picks, [[Bond type, name, pronouns] x2], [Main motivation, second],
//   [skin,hair,hair color,eyes,eye color,extra,build], backstory, pronouns)
// Code names are one word, hand-picked (Agent creator, Code names; set Nov 23). Build: 's' slim, 'b' broad. Pronouns: she, he or they.
// Backstories write the agent's pronouns as tokens ({a.their}; see pron below), so a Tweak to pronouns changes them too.
const T=(name,code,prof,st,picks,bonds,motives,lk,backstory,pro)=>({name,code,prof,pro:pro||'they',stats:{STR:st[0],CON:st[1],DEX:st[2],INT:st[3],POW:st[4],CHA:st[5]},picks,bonds:bonds.map(([rel,n,bp])=>({rel,name:n,pro:bp||'they'})),motives,main:0,look:{skin:lk[0],hair:lk[1],hairC:lk[2],eyes:lk[3],eyeC:lk[4],acc:lk[5],outfitC:-1,build:lk[6]==='s'?'slim':'broad'},backstory});
const TEAMS=[
 {id:'field',name:'Field Team',tag:'Balanced',blurb:'The balanced starter. Good at a little of everything, great at nothing.',seats:[
  T('Marisol Vega','CONNOR','shooter',[13,13,15,10,11,10],{Firearms:1,Dodge:1,Athletics:1,Occult:2,Melee:1,Stealth:1,'First Aid':1},[['Kid','Marco','he'],['Sibling','Dana','she']],['Duty','Revenge'],[2,4,0,0,0,8,'b'],'Two tours, then home to a quiet street. Took up tarot to calm down. The cards keep drawing the Tower.','she'),
  T('June Bell','JACKIE','medic',[9,12,12,14,13,12],{'First Aid':1,Medicine:1,Empathy:1,Science:1,Persuade:1,Dodge:1,Search:1,Stealth:1},[['Partner','Ruth','she'],['Parent','Walt','he']],['Protect the innocent','Faith'],[0,1,4,1,2,7,'s'],'ER nurse on nights for eleven years. Asked one question too many about a patient who stopped breathing and kept talking.','she'),
  T('Gus Hale','COLUMBO','investigator',[11,11,10,15,14,11],{Forensics:1,Search:1,History:2,Persuade:1,Occult:1,Empathy:1,Firearms:1},[['Ex','Nadia','she'],['Mentor','Ray','he']],['Find the truth','Redemption'],[4,2,5,2,0,3,'b'],'County detective, retired early. One cold case is still pinned above {a.their} kitchen sink.','he')]},
 {id:'paper',name:'Paper Trail',tag:'Clues+ Fights-',blurb:'Strong at clues, weak in fights. Every door opens; not every door should.',seats:[
  T('Imani Okafor','KNOPE','clerk',[8,11,10,16,14,13],{Bureaucracy:1,History:1,Persuade:1,Computers:1,Search:1,Empathy:1,Dodge:1,Occult:1},[['Kid','Theo','he'],['Parent','Alma','she']],['Family','Duty'],[4,4,0,0,0,1,'s'],'Files permits for the county. Noticed one cemetery keeps selling plots and never holds a burial.','she'),
  T('Felix Park','NEO','hacker',[9,10,14,16,12,11],{Computers:1,Search:1,Stealth:1,Craft:1,Science:1,Dodge:1,Occult:1,Persuade:1},[['Sibling','Mae','she'],['Friend','Luca','he']],['Curiosity','Find the truth'],[1,0,0,2,0,1,'s'],'Got paid to break into a server farm in Ohio. Found a folder of photos of {a.themself}, taken from inside {a.their} apartment.','he'),
  T('Rosa Navarro','DRAPER','talker',[10,11,11,12,13,15],{Persuade:1,Empathy:1,Bureaucracy:1,Stealth:1,History:1,Dodge:1,Search:1,Firearms:1},[['Ex','Owen','he'],['Friend','Bea','she']],['Money','Redemption'],[2,6,1,1,1,8,'s'],'Sold timeshares, then cars, then a bridge that technically existed. Owes Big Hat a favor {a.they} {a:doesn\'t|don\'t} remember borrowing.','she')]},
 {id:'muscle',name:'Medics and Muscle',tag:'Fights+ Clues-',blurb:'Strong in fights, weak at clues. They\'ll survive the case. Solving it is another matter.',seats:[
  T('Hank Brandt','DALTON','bruiser',[16,15,11,9,11,10],{Melee:1,Athletics:1,Craft:1,Dodge:1,Firearms:1,'First Aid':1,Search:1,Persuade:1},[['Kid','Josie','she'],['Parent','Lou','he']],['Family','Protect the innocent'],[1,2,1,2,0,3,'b'],'Bounced at a roadhouse for twenty years. The night something wouldn\'t stay thrown out, {a.they} went back in after it.','he'),
  T('Nadia Kask','FARMER','bodyguard',[13,13,15,10,11,10],{Dodge:1,Firearms:1,Melee:1,Search:1,Athletics:1,Empathy:1,Stealth:1,'First Aid':1},[['Partner','Cyrus','he'],['Mentor','Mira','she']],['Duty','Money'],[0,4,3,0,3,4,'b'],'Private protection for people who pay in cash. {a.Their} last client is still technically alive.','she'),
  T('Owen Achebe','HAWKEYE','cmedic',[12,13,12,13,12,10],{Medicine:1,'First Aid':1,Firearms:1,Dodge:1,Athletics:1,Search:1,Empathy:1,Stealth:1},[['Sibling','Grace','she'],['Friend','Ray','he']],['Redemption','Faith'],[5,2,0,2,0,5,'b'],'Army medic, then a long stretch of nothing. Says {a.they}{a:\'s|\'re} fine. Checks every pulse twice.','he')]},
 {id:'night',name:'Night Shift',tag:'SAN+ Long fights-',blurb:'The occult crew. Loses less SAN to horrors, but fragile in long fights.',seats:[
  T('Iris Moreau','GILES','occultist',[8,10,11,16,16,11],{Occult:1,History:1,Search:1,Empathy:1,Persuade:1,Dodge:1,Science:1,Stealth:1},[['Mentor','Abel','he'],['Sibling','Lena','she']],['Faith','Curiosity'],[0,6,6,0,4,0,'s'],'Ran a used bookshop with a back room nobody was allowed in. {a.They} let the wrong customer in.','she'),
  T('Cyrus Lund','SCULLY','scientist',[9,11,12,17,12,11],{Science:1,Forensics:1,Medicine:1,Computers:1,Occult:1,History:1,Search:1,Dodge:1},[['Partner','Dale','he'],['Kid','Ada','she']],['Find the truth','Money'],[0,2,3,1,3,1,'s'],'Soil chemist for the state farm board. {a.Their} samples from one farm keep coming back warm.','he'),
  T('Walt Greer','STRIDER','tracker',[13,14,14,10,12,9],{Survival:1,Stealth:1,Athletics:1,Firearms:1,Search:1,Dodge:1,Melee:1,'First Aid':1},[['Kid','Sadie','she'],['Ex','Marla','she']],['Revenge','Protect the innocent'],[3,0,5,2,1,3,'b'],'Guides hunters in the hills. Two seasons ago a client walked off the trail and came back wrong.','he')]},
 {id:'short',name:'Short Notice',tag:'Odd jobs',blurb:'Oddballs who saw something and got recruited instead of silenced. Hands-on with bodies, traps and gossip; nobody trained to fight.',seats:[
  T('Ray Duval','VENKMAN','exterminator',[13,14,12,12,11,10],{Craft:1,Science:1,Stealth:1,Search:1,Melee:1,Athletics:1,Firearms:1,Forensics:1},[['Partner','Bev','she'],['Kid','Danny','he']],['Money','Family'],[1,3,0,2,0,3,'b'],'Thirty years of crawlspaces. Last month something in one said {a.their} name, and {a.they} finished the job anyway.','he'),
  T('Mae Whitlock','FISHER','funeral',[10,12,11,13,15,11],{Forensics:1,Empathy:1,Bureaucracy:1,Medicine:1,Occult:1,Persuade:1,Search:1,Dodge:1},[['Parent','Harold','he'],['Friend','Dot','she']],['Faith','Duty'],[0,4,5,0,4,1,'s'],'Third-generation undertaker. Knows the difference between a body that\'s resting and one that\'s waiting.','she'),
  T('Theo Quill','KOLCHAK','reporter',[10,10,13,14,12,13],{History:1,Persuade:1,Computers:1,Search:1,Stealth:1,Empathy:1,Dodge:1,Occult:1},[['Sibling','Cass','they'],['Coworker','Lyle','he']],['Find the truth','Curiosity'],[1,6,2,0,1,7,'s'],'Runs the county weekly out of {a.their} garage. The story they told {a.them} to kill is the one that got {a.them} recruited.','he')]},
 {id:'clock',name:'Off the Clock',tag:'Tough, no paper',blurb:'People with normal jobs who got pulled in. Tough in body and mind, with a Therapist to cushion SAN; records and lab clues are hard.',seats:[
  T('Priya Sato','FRASIER','therapist',[9,11,11,14,15,12],{Empathy:1,Persuade:1,Medicine:1,Search:1,Occult:1,History:1,Dodge:1,Stealth:1},[['Partner','Ben','he'],['Parent','Asha','she']],['Protect the innocent','Redemption'],[3,1,0,1,0,1,'s'],'Couples counselor. Three clients in a row described the same dream, down to the color of the door.','she'),
  T('Luca Bishop','HANSON','hockey',[16,15,13,9,10,9],{Melee:1,Athletics:1,Dodge:1,'First Aid':1,Occult:1,Firearms:1,Search:1,Stealth:1},[['Kid','Benny','he'],['Coworker','Moose','he']],['Family','Revenge'],[0,0,3,0,3,4,'b'],'Beer-league enforcer with a day job at the rink. Something under the ice keeps knocking back.','he'),
  T('Alma Crane','MULDER','ranger',[12,14,13,12,12,9],{Survival:1,Search:1,Firearms:1,'First Aid':1,Athletics:1,Stealth:1,Science:1,Dodge:1},[['Friend','Hal','he'],['Sibling','Joy','she']],['Duty','Find the truth'],[2,4,5,2,1,0,'b'],'Twenty years in the state forest. Lately {a.they} {a:finds|find} campsites with the tents zipped shut from outside.','she')]},
];
// Bonds: 2 people, each a type from this list, then named; each starts at CHA. The type decides which home scenes they get.
const RELS=['Partner','Kid','Parent','Sibling','Friend','Ex','Coworker','Mentor'];
const RELTXT={Partner:'shares your bed and your bad mornings.',Kid:'someone small who waits at the window for you.',Parent:'still asks if you\'re eating.',Sibling:'knows every story you lie about, and the true version.',Friend:'picks up at 3 a.m. and doesn\'t ask why.',Ex:'still has a key. Still knows which step creaks.',Coworker:'covers your shifts and your excuses.',Mentor:'taught you the job, and to stop asking about it.'};
const STATS=['STR','CON','DEX','INT','POW','CHA'];
const STATNAME={STR:'Strength',CON:'Constitution',DEX:'Dexterity',INT:'Intelligence',POW:'Power',CHA:'Charisma'};
const FEAT={STR:['Struggles with pickle jars','Could carry a vending machine'],CON:['Catches every cold going','Hasn\'t been sick since 2009'],DEX:['Trips on flat ground','Catches flies with chopsticks'],INT:['Reads the same page twice','Does the crossword in pen'],POW:['Easily rattled','Unnervingly calm'],CHA:['Says the wrong thing at funerals','Strangers tell {a.them} secrets']};
const FIRST=['Dana','Marcus','Ruth','Eli','Priya','Tom','Nadia','Gus','Lena','Owen','Rosa','Walt','June','Felix','Imani','Hank','Mae','Theo','Bea','Cyrus','Alma','Ray','Iris','Luca'];
const LAST=['Holloway','Ortiz','Kask','Brandt','Okafor','Whitlock','Park','Duval','Moreau','Fitch','Abernathy','Quill','Navarro','Sato','Greer','Lund','Vance','Bishop','Achebe','Crane'];
// Motivations (Bible: Systems, Motivations): each agent picks 2 and marks one Main, which drives their personal arc.
const MOTIVES=['Protect the innocent','Find the truth','Family','Faith','Revenge','Duty','Curiosity','Money','Redemption'];
const MOTTXT={'Protect the innocent':'Someone has to stand between people and the dark.','Find the truth':'Not knowing is worse. Probably.','Family':'Does all this so the people at home never have to see it.','Faith':'Believes something is listening. Hopes it\'s the right something.','Revenge':'Something took something. It\'s going to pay.','Duty':'Signed the papers. Means to honor them.','Curiosity':'Has to know what\'s behind the door. Every door.','Money':'The pay is good, and the dead don\'t spend.','Redemption':'Owes the world a debt and means to pay it back.'};
const ADJ=['QUIET','PALE','CEDAR','NINTH','HOLLOW','SALT','VELVET','IRON','DUSK','PAPER','TIN','LOW','GRAY','SECOND'];
const NOUN=['HERON','ORCHARD','MOTH','SPARROW','CANAL','HARBOR','PILGRIM','RIVET','CANDLE','WICK','TIDE','LOCKET','STEEPLE','GARDEN'];
// ---------- PRONOUNS AND BODY (Agent creator, steps 4 and 5, Pronouns and body; set Nov 23, 2026) ----------
// Every agent and Bond has pronouns (a.pro: she, he or they); saves from before have none and read as they.
// Text never writes a fixed "he" or "she" for an agent or a Bond. It writes a token for the person in one of its {keys}:
//   {n.they} {n.them} {n.their} {n.theirs} {n.themself}  →  she her her hers herself · he him his his himself · they them their theirs themselves
//   capitalized ({n.They}) for the start of a sentence, and {n:sing|plural} for a verb: {n.they} {n:doesn't|don't}.
// pron(text, who): who maps a key to the person (an agent or Bond, or a pronoun word), or is a function key → person.
// A key it doesn't know (undefined) stays as it is for a later pass; a person with no pronouns reads as they.
// npm run check fails on a bare he or she next to an agent or Bond token (tools/check.js, pronounLint).
const PRONOUNS=['she','he','they'];
const PROW={she:{they:'she',them:'her',their:'her',theirs:'hers',themself:'herself'},he:{they:'he',them:'him',their:'his',theirs:'his',themself:'himself'},
 they:{they:'they',them:'them',their:'their',theirs:'theirs',themself:'themselves'}};
const proOf=x=>{const p=x&&typeof x==='object'?x.pro:x;return PROW[p]?p:'they'};
function pron(t,who){return String(t??'').replace(/\{(\w+)([.:])([^{}]+)\}/g,(x,k,sep,w)=>{
 const v=typeof who==='function'?who(k):who&&who[k];if(v===undefined)return x;const p=proOf(v);
 if(sep===':'){const i=w.indexOf('|');if(i<0)return x;return p==='they'?w.slice(i+1):w.slice(0,i)}
 const f=PROW[p][w.toLowerCase()];if(!f)return x;return w[0]!==w[0].toLowerCase()?f[0].toUpperCase()+f.slice(1):f})}
const BUILDS=['slim','broad'];
const PROW_UI={pro:'Pronouns',build:'Build',slim:'Slim',broad:'Broad',bondPro:'NEW BOND: PRONOUNS?'};
// ---------- CODE NAMES (Agent creator, Code names; set Nov 23, 2026; spec 022): one word, a pop-culture reference ----------
// Big Hat picks the best match on the Dossier step. Each name lists what it fits: Bond types (Kid...), motivations
// (protect truth family faith revenge duty curious money redeem), skills (FirstAid for First Aid), @profession and
// #words found in the backstory. People and characters only: never a brand or a logo (studio.md, No real brands).
// Keegan's Agency story names (RAINE, MICKEY, JERRY, AHAB) are left out on purpose.
const CN=(n,tags)=>({n,tags:tags.split(' ')});
const CODENAMES=[
 CN('GRETZKY','Athletics Melee Kid family @hockey #hockey #rink #ice'),CN('HANSON','Melee Athletics Coworker revenge @hockey @bruiser #hockey #rink'),
 CN('ALI','Melee Dodge revenge @bruiser #boxing #boxes #boxer'),CN('ROCKY','Melee Athletics redeem Partner #boxing #fight #underdog'),
 CN('RIPLEY','Firearms Survival protect duty Kid @bodyguard #alien #space'),CN('CONNOR','Firearms protect Kid family @shooter #tours #army #war'),
 CN('RAMBO','Firearms Survival Stealth revenge @shooter #veteran #tours #army'),CN('MCCLANE','Firearms Athletics Partner Ex duty #cop #christmas'),
 CN('RIGGS','Firearms Melee redeem Partner @shooter #range #cop'),CN('BOURNE','Stealth Dodge Firearms truth #spy #memory'),
 CN('COLUMBO','Forensics Search truth @investigator #detective #cold #case'),CN('MARPLE','Search Empathy truth Parent @investigator #insurance #village'),
 CN('POIROT','Search Forensics Bureaucracy truth @investigator #train #murder'),CN('MARLOWE','Search Persuade truth Ex @investigator #private #noir'),
 CN('SHERLOCK','Search Forensics Science truth curious #violin #pipe'),CN('GUNDERSON','Forensics Search duty Partner #snow #police #deputy'),
 CN('COOPER','Search Occult truth Coworker #coffee #pie #dream #dreams'),CN('FLETCHER','History truth curious Friend #novel #writer #mystery'),
 CN('SCULLY','Science Medicine truth @scientist #lab #samples #doctor'),CN('MULDER','Occult truth Sibling curious #lights #ufo #sister'),
 CN('KOLCHAK','History Persuade truth curious @reporter #weekly #newspaper #reporter'),CN('PARKER','Science Athletics Parent protect @reporter #photo #photos #camera'),
 CN('KENT','Athletics Parent duty @reporter #farm #paper'),CN('GILES','Occult History Mentor faith @occultist #books #library #bookshop'),
 CN('WILLOW','Occult Computers Friend curious @hacker @occultist #witch #spell'),CN('BUFFY','Melee Occult Sibling protect #cemetery #stake #school'),
 CN('NEO','Computers curious truth @hacker #server #code #matrix'),CN('TRINITY','Computers Stealth Partner @hacker #leather #motorcycle'),
 CN('WATSON','Medicine FirstAid Friend duty @medic @cmedic #army #doctor'),CN('HAWKEYE','Medicine FirstAid redeem @cmedic #army #medic'),
 CN('HOULIHAN','Medicine FirstAid duty @cmedic #army #nurse'),CN('JACKIE','Medicine FirstAid Empathy protect @medic #nurse #er'),
 CN('GAGE','FirstAid Athletics protect @medic #paramedic #rescue #ambulance'),CN('QUINCY','Forensics Medicine truth @funeral @scientist #coroner #autopsy'),
 CN('FISHER','Forensics Empathy Parent faith @funeral #funeral #undertaker #home'),CN('MORTICIA','Occult Partner family @funeral #funeral #mansion'),
 CN('FRASIER','Empathy Persuade Parent Sibling @therapist #radio #counselor #couples'),CN('MELFI','Empathy Medicine redeem @therapist #therapist #grief'),
 CN('KNOPE','Bureaucracy Persuade duty Friend @clerk #permits #county #parks'),CN('BARTLEBY','Bureaucracy History @clerk #records #files #forms #census'),
 CN('FINCH','Bureaucracy Persuade duty Kid #lawyer #court'),CN('DRAPER','Persuade money Ex @talker #sold #ads #cars'),
 CN('GANTRY','Persuade faith money @talker #church #preacher #organs'),CN('DALTON','Melee Athletics protect @bruiser @bodyguard #bounced #roadhouse #bar'),
 CN('FARMER','Dodge Firearms duty money @bodyguard #protection #client #senator'),CN('STRIDER','Survival Stealth Ex revenge @tracker #hunters #trail #hills'),
 CN('KATNISS','Survival Firearms Sibling protect @tracker #bow #hunt #rescue'),CN('THOREAU','Survival History curious @ranger #lookout #forest #woods'),
 CN('BRODY','Firearms duty Kid protect @ranger #beach #shark #sheriff'),CN('HOOPER','Science Survival curious @scientist #water #pond #shark'),
 CN('ISHMAEL','Survival curious Friend #sea #boat #whale #lake'),CN('VENKMAN','Craft Science money @exterminator #crawlspaces #pest'),
 CN('SPENGLER','Science Craft curious @exterminator @scientist #termite #slime'),CN('MACGYVER','Craft Science curious #wrench #fix #engine #tape'),
 CN('SAMWISE','Friend Mentor protect Survival #garden #cooking'),CN('WAYNE','money Parent revenge Melee #orphan #mansion'),
 CN('CASH','redeem faith Partner money #music #guitar #prison'),CN('JOPLIN','Persuade Friend Ex redeem #music #singer #band'),
 CN('HENDRIX','Craft Friend curious #guitar #band #music'),CN('COLTRANE','Friend curious Mentor #jazz #sax #music'),
 CN('PELE','Athletics Kid family #soccer #ball'),CN('LOMBARDI','Mentor duty Coworker #coach #football #team')
];
const MOTKEY={'Protect the innocent':'protect','Find the truth':'truth','Family':'family','Faith':'faith','Revenge':'revenge','Duty':'duty','Curiosity':'curious','Money':'money','Redemption':'redeem'};
// Big Hat on the Dossier step, in the Lantern Bust box: one line that hints at why, built from what matched ({h}), then the
// name ({c}); then Take it, Another (the next best match) or Type my own (the phone's text prompt, as New Bond uses)
const CODEW={give:'{h} You\'re {c}.',again:'Picky. {h} Then you\'re {c}.',plain:'I read your file. You\'re {c}.',
 bond:'{r} named {b}.',file:'Read your file.',prof:'{p}.',
 mot:{protect:'Steps in front of people.',truth:'Can\'t leave a question alone.',family:'Does it for the folks at home.',faith:'Prays when nobody\'s looking.',
  revenge:'Holds a grudge.',duty:'Signed the papers and meant it.',curious:'Has to know.',money:'Counts the hazard pay twice.',redeem:'Owes somebody.'},
 take:'Take it',another:'Another',own:'Type my own',typeAsk:'Your code name (one word):',ask:'Ask Big Hat for a new name',
 row:'Code name',none:'TAKE A CODE NAME',max:12};
const HAIRCN=['Black','Dark brown','Brown','Blonde','Red','Gray','White'];
const HAIRS=['Short','Long','Buzz','Bald','Bun','Mohawk','Curly'];
const EYES=['Bright','Wide','Tired'];
const EYEC=['Brown','Hazel','Green','Blue','Gray'];
const ACC=['None','Glasses','Shades','Beard','Scar','Earpiece','Eyepatch','Freckles','Earring'];
const OUTCN=['Navy','Olive','Maroon','Violet','Khaki','Black','Teal'];
const CREEP=['IT KNOWS YOUR NAME','DON\'T LOOK AT THE CORNERS','WHO IS STANDING BEHIND YOU','YOU HAVE BEEN HERE BEFORE','THE FILE IS WRITING ITSELF','STOP COUNTING THE DOORS'];
// ---------- THE OLD SHARED ITEM PACK (retired Nov 22, Demo 5 part A; save step 5 turns it into backpack items) & WEAPONS ----------
const ITEMDEF={aid:{name:'First Aid Kit',desc:'Heal 1d8+3. Gets a downed agent back up.'},coffee:{name:'Thermos Coffee',desc:'Restore 1d4+1 WP.'},flare:{name:'Road Flare',desc:'Burn one foe for 2d6+2.',battle:true},bell:{name:'Church Handbell',desc:'Stun every foe for a round.',battle:true},
 salts:{name:'Smelling Salts',desc:'Restore 1d4 SAN to one agent.'},tranq:{name:'Tranquilizer',desc:'Stun one foe for 2 rounds.',battle:true},spray:{name:'Pepper Spray',desc:'Blind every foe for 2 rounds.',battle:true},tape:{name:'Duct Tape',desc:'Patch 1d4+1 HP. Can\'t revive.'}};
// Weapons (Bible: Item list; dice from Combat numbers). Everyone carries the handgun; six professions carry something better.
// skill: what it rolls. plus: added to the dice. hit: to-hit modifier. loud / silent: noise (quiet otherwise).
// melee and thrown weapons take the STR bonus. extra: the detail box's last words.
const Wn=(name,skill,dmg,o={})=>Object.assign({name,skill,dmg,verb:o.verb||(skill==='Melee'?'swings the '+name:'fires the '+name)},o);
const WEAP={
 handgun:Wn('handgun','Firearms',[1,8]),
 rifle:Wn('assault rifle','Firearms',[2,4],{plus:1,loud:1}),
 shotgun:Wn('shotgun','Firearms',[2,6],{hit:-20}),
 huntrifle:Wn('hunting rifle','Firearms',[1,12],{plus:2,extra:'can\'t fire two turns in a row'}),
 revolver:Wn('revolver','Firearms',[1,10],{extra:'crits cause Bleeding'}),
 smg:Wn('SMG','Firearms',[1,8],{loud:1,extra:'Burst costs 1 WP'}),
 silenced:Wn('silenced pistol','Firearms',[1,8],{silent:1}),
 flaregun:Wn('flare gun','Firearms',[1,6],{extra:'burning things take double; lights the area'}),
 taser:Wn('taser','Firearms',[0,0],{extra:'no damage; a hit Stuns a human; not two turns in a row'}),
 nailgun:Wn('nail gun','Craft',[1,6],{extra:'causes Bleeding'}),
 bow:Wn('compound bow','Firearms',[1,8],{silent:1,verb:'looses an arrow'}),
 bat:Wn('baseball bat','Melee',[1,10],{melee:1,verb:'swings the bat'}),
 stick:Wn('hockey stick','Melee',[1,8],{melee:1,extra:'Stuns on a crit'}),
 knife:Wn('knife','Melee',[1,6],{melee:1,silent:1,extra:'Jump them does double'}),
 machete:Wn('machete','Melee',[1,10],{melee:1,extra:'a hit causes Bleeding'}),
 axe:Wn('fire axe','Melee',[1,12],{plus:1,hit:-20,melee:1}),
 crowbar:Wn('crowbar','Melee',[1,8],{melee:1,extra:'Force it is quiet while held'}),
 shovel:Wn('shovel','Melee',[1,10],{melee:1}),
 pan:Wn('frying pan','Melee',[1,6],{melee:1,extra:'Defending, the first hit does nothing'}),
 chainsaw:Wn('chainsaw','Melee',[3,4],{plus:1,hit:-20,melee:1,loud:1,extra:'a hit leaves you Sickened'}),
 pitchfork:Wn('pitchfork','Melee',[1,8],{melee:1,extra:'its target can\'t hit you next turn'}),
 golf:Wn('golf club','Melee',[1,10],{melee:1,extra:'a crit drops the enemy to last'}),
 bottle:Wn('broken bottle','Melee',[1,6],{melee:1,extra:'causes Bleeding; breaks after one fight'}),
 hatchet:Wn('hatchet','Athletics',[1,8],{melee:1,thrown:1,verb:'throws the hatchet',extra:'lost for the rest of the fight'}),
 fists:Wn('fists','Melee',[1,4],{plus:-1,melee:1,verb:'swings'})
};
const diceOf=W=>W.dmg[0]?`${W.dmg[0]}d${W.dmg[1]}${W.plus>0?'+'+W.plus:W.plus<0?W.plus:''}`:'—';
const WEAPTXT=Object.fromEntries(Object.entries(WEAP).map(([k,W])=>[k,[diceOf(W),W.hit?`−${-W.hit}% to hit`:'',W.loud?'Loud':W.silent?'silent':'quiet',W.extra||''].filter(Boolean).join(' · ')]));
// ---------- ITEMS (Bible: Agents and items, Starting kit, Items, Item display, Item list; set Nov 19) ----------
// type: the Item list's type. desc: the detail box's effect line. uses: uses per item (1 when not set).
// map: what Use does on the map (field.js). battle: only matters in battle (usable there from Demo 5 part B).
// hot: used at a hotspot that asks for it. worn: gear worn without an item slot. drug: makes the taker High.
// lb / req: in the Lantern Box catalog / its requisition modifier. w: a weapon (key in WEAP).
const It=(name,type,desc,o={})=>Object.assign({name,type,desc},o);
const ITEMS={
 bandage:It('Bandage','Med','Clears Bleeding.',{map:'bandage',lb:1,req:20}),
 painkillers:It('Painkillers','Med','Heal 1d4 HP.',{map:'heal4',req:20}),
 energy:It('Energy drink','Med','Clears Exhausted, +1d4 WP.',{map:'energy',req:20}),
 salts:It('Smelling salts','Med','Clears Sickened.',{map:'salts',req:20}),
 firstaid:It('First-aid kit','Med','Heal 1d6 HP, no roll, outside First Aid\'s once-per-wound limit.',{map:'heal6',lb:1,req:20}),
 antitoxin:It('Antitoxin','Med','Clears Poisoned.',{map:'antitoxin',lb:1,req:20}),
 booze:It('Booze','Drink','The drinker is Drunk. Leaves a Broken bottle.',{map:'booze'}),
 cigs:It('Cigarettes','Smoke','Clears Shaken. Not a drug, so no High.',{map:'cigs'}),
 joint:It('Joint','Drug','High. Clears Shaken.',{map:'joint',drug:1}),
 nerve:It('Nerve pills','Drug','High. The next SAN loss this scene is halved.',{map:'nerve',drug:1}),
 uppers:It('Uppers','Drug','High. Clears Exhausted, +1d4 WP. Exhausted again when it wears off.',{map:'uppers',drug:1}),
 strongpk:It('Strong painkillers','Drug','High. Heal 1d6 HP. Bleeding does no damage while High.',{map:'strongpk',drug:1}),
 coke:It('Coke','Drug','High. +20% to Persuade and Melee. −1d4 WP when it wears off.',{map:'coke',drug:1}),
 shrooms:It('Mushrooms','Drug','High. Hidden unnatural hotspots show. SAN rolls get harder.',{map:'shrooms',drug:1}),
 frag:It('Frag grenade','Throwable','Thrown with Athletics: 1d6 to every enemy. Loud.',{battle:1,loud:1,lb:1,req:0}),
 flashbang:It('Flashbang','Throwable','Thrown with Athletics: every human enemy is Stunned. Loud.',{battle:1,loud:1,lb:1,req:0}),
 molotov:It('Molotov','Throwable','Thrown with Athletics: 1d8 to one enemy. Things that burn take double.',{battle:1,lb:1,req:0}),
 smoke:It('Smoke grenade','Throwable','Enemies get −20% to hit until the next round. Against roamers, Flee succeeds.',{battle:1,lb:1,req:0}),
 roadflare:It('Road flare','Throwable','Map: lights a dark area for the scene. Battle: one light-shy enemy is Shaken.',{map:'flare',lb:1,req:20}),
 firecrackers:It('Firecrackers','Throwable','Map: a roamer leaves its post, so you slip past with no roll. Loud.',{map:'roamer',loud:1}),
 armor:It('Body armor','Gear','Worn, no item slot, one per agent: each hit does 1 less damage.',{worn:1,lb:1,req:-20}),
 gasmask:It('Gas mask','Gear','Worn, no item slot, one per agent: no Sickened from bad air, no Poisoned from spores or gas.',{worn:1,lb:1,req:-20}),
 salt:It('Salt','Tool','Anyone, no roll: lay a line one unnatural roamer won\'t cross.',{map:'roamer',lb:1,req:20}),
 bolt:It('Bolt cutters','Tool','Cut a chain or padlock quietly, no roll. Breaks after 2 uses.',{uses:2,hot:1}),
 // the Starting kit's own items (kit: refills each case)
 medkit:It('Medkit','Kit','Heal 1d6 HP with no roll, outside First Aid\'s once-per-wound limit.',{uses:3,map:'heal6'}),
 zipties:It('Zip ties','Kit','Once per case: tie up a beaten human enemy for an extra clue at the debrief.',{battle:1}),
 bearspray:It('Bear spray','Kit','Once per case: a beast-like enemy is Stunned.',{battle:1}),
 snare:It('Snare trap','Kit','Once per case: a roamer is caught and you slip past, or the fight opens with it Stunned.',{map:'roamer'}),
 icepack:It('Ice pack','Kit','Heal 1d4 HP and clear Stunned.',{map:'icepack'}),
 adrenaline:It('Adrenaline shot','Kit','Once per case: a Downed agent stands at 1d4 HP, no roll.',{battle:1}),
 recorder:It('Pocket recorder','Kit','Once per case: play a witness\'s words to someone else to unlock a hidden line.',{hot:1}),
 hotline:It('Hotline to Big Hat','Kit','Once per case: request one Lantern Box item (Bureaucracy at its Req +15%).',{map:'hotline'}),
 jammer:It('Signal jammer','Kit','Once per case: kills phones and cameras in an area, so overstepping doesn\'t climb there.',{map:'jammer'}),
 cash:It('Roll of cash','Kit','Once per case: bribe one person past a door or for a secret, no roll.',{hot:1}),
 charm:It('Old charm','Kit','Once per case: the holder auto-passes the first horror-on-sight roll.',{passive:1}),
 uv:It('UV lamp','Kit','Once per case: reveals hidden unnatural hotspots in one area.',{map:'uv'}),
 bugbomb:It('Bug bomb','Kit','Once per fight: every living enemy is Poisoned.',{battle:1,perFight:1}),
 camera:It('Camera','Kit','Once per case: photograph a clue to unlock an extra cover story at the debrief.',{hot:1}),
 sedatives:It('Sedatives','Kit','Each calms a disorder flare for the scene.',{uses:2,map:'sedative'})
};
// weapons are items too (Item list, Gun and Melee rows); the Starting kit's better weapons are kit weapons
Object.entries(WEAP).forEach(([k,W])=>{if(k!=='fists')ITEMS['w_'+k]=It(W.name[0].toUpperCase()+W.name.slice(1),W.skill==='Melee'?'Melee':W.thrown?'Thrown':'Gun','',{w:k,lb:['rifle','shotgun','huntrifle','revolver','smg','silenced','flaregun','taser'].includes(k)?1:0,req:k==='flaregun'?0:-20})});
ITEMS.w_handgun.lb=0;
// The Starting kit item each profession carries, and how many uses it starts with
const KIT={shooter:'painkillers',medic:'medkit',investigator:'recorder',clerk:'hotline',hacker:'jammer',talker:'cash',bruiser:'energy',bodyguard:'zipties',cmedic:'adrenaline',occultist:'charm',scientist:'uv',tracker:'snare',exterminator:'bugbomb',funeral:'salts',reporter:'camera',therapist:'sedatives',hockey:'icepack',ranger:'bearspray'};
const KITUSES={salts:2};
// Item screens (Item display; Map menu, Items; Party, Give item)
const ITEMUI={title:'ITEMS',pack:'BACKPACK',packRow:'Backpack',empty:'— empty —',noPack:'The backpack is empty.',weapons:'WEAPONS',slots:'ITEMS',worn:'WORN',
 use:'Use',equip:'Equip',stash:'To backpack',take:'Take',give:'Give',wear:'Wear',remove:'Take off',drop:'Leave it',
 kit:'Lantern: kit item, refills each case.',pin:'Pin: case-only item. Big Hat sorts these at the debrief.',bang:'Bang: Loud. Draws roamers.',
 equipped:'Equipped.',full:'Full',giveTo:'GIVE TO',whoUse:'WHO?',battleOnly:'Used in battle.',notFight:'Not something for a fight.',hotOnly:'Used at a hotspot that asks for it.',passive:'Works on its own when it\'s needed.',
 spent:'Used up. Refills next case.',keys:'L/R: agent · A: pick · B: back',packKeys:'A: take · B: back',noRoom:'No room: 8 items already.',noWeapRoom:'Two weapons already.',
 paranoid:'Won\'t take anything from a teammate right now.',worn1:'Already wearing one.',found:'Found: ',toLead:' It goes to {n}.',toPack:' {n} is full, so it goes in the backpack.',
 hotlineAsk:'Big Hat picks up. "What do you need?"',hotlineNo:'"No." He hangs up.',hotlineOk:'It arrives. Nobody saw who brought it.'};
// ---------- PARTY MENU (Bible: Skills and menus, Map menu and Quality of life; Systems, Statuses; spec 002) ----------
// Status chips and their detail lines, worded from the Statuses table. Map statuses arrive with their causes (later demos).
const STATUS={
 bleed:{chip:'BLEED',name:'Bleeding',line:'-1 HP each area change. First Aid, Treat or a rest ends it.',col:'#b5532e',pulse:1},
 poison:{chip:'POISON',name:'Poisoned',line:'-20% to all rolls, -1 HP every 2 area changes. Only Antitoxin or Treat ends it.',col:'#6a8a2a',pulse:1},
 sick:{chip:'SICK',name:'Sickened',line:'-20% to Athletics, Stealth, Melee, Firearms and Dodge. A rest or Retch ends it.',col:'#7a8a3a'},
 drunk:{chip:'DRUNK',name:'Drunk',line:'Each SAN loss is 1 smaller. -20% to Search, Forensics, Firearms, Computers. Wears off after 4 area changes.',col:'#8a4a6a'},
 high:{chip:'HIGH',name:'High',line:'-20% to rolls the drug doesn\'t help. Wears off after 4 area changes.',col:'#4a6a9a'},
 tired:{chip:'TIRED',name:'Exhausted',line:'WP doesn\'t refill and bracing costs double. A rest ends it.',col:'#5a5070'},
 shaken:{chip:'SHAKEN',name:'Shaken',line:'-20% to all rolls for the rest of the scene. The scene ending or Empathy\'s Calm ends it.',col:'#9a3a5a'},
 stun:{chip:'STUN',name:'Stunned',line:'Combat only: loses their next turn.',col:'#b08a2a'},
 exposed:{chip:'EXPOSED',name:'Exposed',line:'Combat only, enemies only: everyone gets +20% to hit it until its next turn.',col:'#3a7a8a'}
};
const PARTY={
 title:'PARTY',hint:'SELECT swaps the lead',lead:'LEAD',banner:'LEAD · ',
 makeLead:'MAKE LEAD',dossier:'DOSSIER',give:'GIVE ITEM',
 isLead:'Already the lead.',giveWhy:'Nothing to give.',
 none:'No conditions.',lowHP:'HP 3 or less: card blinks',
 tabs:['INFO','SKILLS','BONDS'],main:'MAIN MOTIVATION',noBack:'No backstory on file.',
 equipped:'EQUIPPED',toHit:'TO-HIT',disorder:'DISORDER',noDis:'None',bp:'BP',adapted:'ADAPTED',injuries:'INJURIES',adaptV:'VIOL',adaptH:'HELP',
 keys:['L/R: tabs · Up/Down: next agent','B: back to Party'],
 noBonds:'No Bonds on file.',score:'Score',
 moods:{close:'Close',strained:'Strained',fraying:'Fraying',broken:'Broken'}
};
// ---------- ON THE MAP (spec 005): the lead card, the NIGHT tag and the A bubble ----------
const MAPHUD={night:'NIGHT',talk:'TALK',look:'LOOK',hp:'HP',wp:'WP',san:'SAN',a:'A'};
// ---------- DISORDERS (Bible: Systems, Disorders; set Nov 19) ----------
// trig / flare: the party menu's lines. gain: the straight line at a Breaking Point. line: the flare's dialog line.
const DISORDERS={
 ptsd:{name:'PTSD',chip:'PTSD',trig:'The first Loud attack in a fight, or a moment that echoes how they broke.',flare:'Freezes: loses their next turn in battle; on the map, −20% to all rolls.',gain:'{n} keeps hearing it, hours later.',line:'{n}\'s hands won\'t stop shaking.'},
 paranoia:{name:'Paranoia',chip:'PARAN',trig:'Talking to someone who is lying or hiding something.',flare:'−20% to Persuade and Empathy; won\'t take items from teammates or let anyone Steady them.',gain:'{n} starts sitting with {n.their} back to the wall.',line:'{n} keeps watching everyone\'s hands.'},
 phobia:{name:'Phobia',chip:'PHOB',trig:'Its subject appears: {s}.',flare:'On the map they won\'t lead. In battle, −20% to all rolls, and they can\'t attack the subject.',gain:'{n} won\'t look at {s}. Not since tonight.',line:'{n} can\'t make {n.their} feet go any closer.'},
 depression:{name:'Depression',chip:'DEPR',trig:'A death the party couldn\'t stop.',flare:'Can\'t brace, and motivation moments restore no SAN.',gain:'{n} goes quiet, and stays quiet.',line:'{n} stops talking. Nothing seems worth the effort.'},
 sleep:{name:'Sleep disorder',chip:'SLEEP',trig:'A rest at a safe spot, or the first night scene of a case.',flare:'Exhausted until the next rest, so that rest refills none of their WP.',gain:'{n} hasn\'t slept right since.',line:'{n} lies awake. It shows.'},
 addiction:{name:'Addiction',chip:'ADDIC',trig:'The start of every case, no roll.',flare:'Withdrawal: −10% to all rolls until they dose.',gain:'',line:'{n} needs a dose. Badly.'}
};
// Breaking Point (Sanity; Motivations; Leaning on a Bond): the three choices and their straight lines
const SANW={
 roll:'SAN',brace:'Brace',noBrace:'Don\'t brace',braceAsk:'{n} can see it coming. Brace? (1d4 WP{x})',braced:'{n} braces. −{w} WP.',
 steady:'steadied by {h}',steadyAll:'{h} talked {n.them} down',keep:'Everyone keeps it together.',keepOne:'{n} keeps it together.',
 bp:'{n} hits a Breaking Point.',bpAsk:'What gives?',takeDis:'Take a disorder',giveMot:'Give up a motivation',lean:'Lean on a Bond',
 sure:'Can\'t be undone. Sure?',yes:'Yes, give it up',no:'No, go back',bondLow:'Already at 1.',
 motLine:'{n} lets go of "{m}". It was holding up more than {n.they} knew.',bondLine:'{n} calls {b} at 3 a.m. and can\'t say why.',
 adapted:'{n} doesn\'t flinch anymore. {b} notices.',adaptedNoBond:'{n} doesn\'t flinch anymore.',
 zero:'{n} stops answering. {n.They} {n:walks|walk} out of the light, and {n.they} {n:doesn\'t|don\'t} come back.',
 noBP:'{n} has nothing left to break.',flareHold:'{n} holds it together.',calm:'{n} breathes. The flare passes.',
 charm:'{n}\'s old charm goes cold in {n.their} pocket. {n.They} {n:doesn\'t|don\'t} flinch.',hardened:'{n} has seen worse bodies.',motive:'{n} feels a little more like {n.themself}. +{g} SAN.'
};
const DIS=['Jumpy','Night terrors','Counting compulsion','Hypervigilance','Hollow stare','Can\'t stop smiling'];  // retired Nov 22 (save step 5 maps them to DISORDERS)
// SAN loss table (Systems, SAN loss table; set Nov 19): [pass, fail]
const TIERS={unsettling:['0','1'],disturbing:['0','1d4'],severe:['1','1d6'],shattering:['1d4','1d8'],boss:['1d6','1d10']};
const KINDS={violence:'violence',helplessness:'helplessness',unnatural:'the unnatural'};
// ---------- SKILLS AT HOTSPOTS (Skills and menus, Using skills, Skill unlocks; set Nov 18) ----------
// Every unlock a case can call on, as hotspot data: a case's hotspot lists {use:'force', ok, fail, fumble}.
// tier: the unlock's skill level. loud: draws roamers. perk: works on its own (no option). map: a map menu Skills row.
const SKILLOPT={
 shoot:{skill:'Firearms',tier:40,label:'Shoot it open',loud:1},
 lightsout:{skill:'Firearms',tier:75,label:'Lights out',loud:1},
 force:{skill:'Melee',tier:40,label:'Force it',loud:1},
 jump:{skill:'Melee',tier:75,label:'Jump them'},
 duck:{skill:'Dodge',tier:40,label:'Duck'},
 slipfree:{skill:'Dodge',tier:75,label:'Slip free'},
 sweep:{skill:'Search',tier:40,label:'Sweep'},
 onguard:{skill:'Search',tier:75,label:'On guard'},
 examine:{skill:'Forensics',tier:40,label:'Examine'},
 reconstruct:{skill:'Forensics',tier:75,label:'Reconstruct'},
 identify:{skill:'Occult',tier:40,label:'Identify'},
 ward:{skill:'Occult',tier:75,label:'Ward'},
 records:{skill:'History',tier:40,label:'Dig records'},
 translate:{skill:'History',tier:75,label:'Translate'},
 sample:{skill:'Science',tier:40,label:'Sample'},
 analyze:{skill:'Science',tier:75,label:'Analyze'},
 read:{skill:'Empathy',tier:40,label:'Read'},
 calm:{skill:'Empathy',tier:75,label:'Calm'},
 talk:{skill:'Persuade',tier:40,label:'Talk your way in'},
 lean:{skill:'Persuade',tier:75,label:'Lean on them'},
 paper:{skill:'Bureaucracy',tier:40,label:'Paper trail'},
 creds:{skill:'Bureaucracy',tier:75,label:'Credentials'},
 climb:{skill:'Athletics',tier:40,label:'Climb and jump'},
 outrun:{skill:'Athletics',tier:75,label:'Outrun'},
 sneak:{skill:'Stealth',tier:40,label:'Sneak'},
 blend:{skill:'Stealth',tier:75,label:'Blend in'},
 track:{skill:'Survival',tier:40,label:'Track'},
 path:{skill:'Survival',tier:75,label:'Pathfinder'},
 crack:{skill:'Computers',tier:40,label:'Crack it'},
 trace:{skill:'Computers',tier:75,label:'Trace'},
 backdoor:{skill:'Computers',tier:90,label:'Backdoor'},
 fix:{skill:'Craft',tier:40,label:'Fix it'},
 rig:{skill:'Craft',tier:75,label:'Rig'},
 blow:{skill:'Craft',tier:90,label:'Blow it',loud:1},
 // a Medicine roll at a hotspot (Treat's tier), for cases that read a scan or guide a patient (Lost Hour, spec 016)
 treat:{skill:'Medicine',tier:40,label:'Treat'}
};
// once per case, one roll of the skill auto-succeeds (90% perks: Keen eye, Silver tongue, Ghost, Backdoor)
const AUTOPERK={Search:'Keen eye',Persuade:'Silver tongue',Stealth:'Ghost',Computers:'Backdoor'};
const SKILLW={needs:'needs {s} {t}%',look:'Look',result:{hit:'SUCCESS',miss:'FAIL',crit:'CRIT',fumble:'FUMBLE'},perk:'{p}: it works anyway.',retry:'Silver tongue: one more try.',
 loud:'That was loud.',lacks:'{s} {t}% unlocks this. Swap in someone who has it.'};
// Map menu (Skills and menus, Map menu; set Nov 18) and its pages
const MAPMENU={title:'MENU',rows:['Party','Skills','Items','Case file','Log','Settings','Save'],dev:'Dev: finish case',
 skills:'SKILLS',patch:'Patch up',triage:'Triage',treat:'Treat',sedate:'Sedate',camp:'Make camp',analyze:'Analyze',retch:'Retch',
 patchWhy:'Once per hurt: nobody is hurt since their last try.',triageWhy:'Nobody is hurt since their last try.',treatWhy:'No Bleeding, Poisoned or Sickened to treat.',sedateWhy:'No disorder is flaring.',
 campWhy:'Once per case, outside danger zones.',campUsed:'Already camped this case.',analyzeWhy:'No samples to analyze.',analyzeSafe:'Only at a safe spot (Field lab at 90%).',retchWhy:'Nobody is Sickened, or they already tried this scene.',
 skillsKey:'Only the lead\'s skills work here. Swap the lead to use someone else\'s.',
 healed:'{n} +{h} HP.',patchFail:'It doesn\'t take. {n} stays as {n.they} {n:is|are}.',treated:'{n} is no longer {s}.',treatFail:'The treatment doesn\'t take.',
 camped:'The party makes camp and rests a while. Half their HP and WP come back.',retched:'{n} retches into the dirt. Better out than in.',retchFail:'{n} dry-heaves. Still queasy.',
 sedated:'{n}\'s breathing slows. The flare passes.',analyzed:'{n} works through the samples.',
 caseFile:'CASE FILE',next:'NEXT',clues:'CLUES',intel:'INTEL',noClues:'Nothing yet. Talk to people.',overstep:'OVERSTEPPING',rules:'Rules page',rulesT:'RULES',statuses:'STATUSES',icons:'ITEM ICONS',skulls:'THREAT SKULLS',
 skullLines:['One skull: a fight you should win.','Two skulls: a real fight. Plan for it.','Three skulls: run, or bring everything.'],
 pageKeys:'Up/Down: scroll · A: rules · B: back',rulesKeys:'Up/Down: scroll · B: back',
 log:'LOG',logKeys:'Up/Down: older/newer · B: back',noLog:'Nothing said yet.',
 settings:'SETTINGS',fast:'Fast battles',on:'ON',off:'OFF',fastLine:'Speeds up battle lines and animations.',
 saved:'Saved.',keepPlaying:'Keep playing',quit:'Quit to title',lastTime:'LAST TIME: {m}.',lastNext:'NEXT: {g}',
 hunchAsk:'{n} has a hunch. Roll INT for a hint? (INT × 5: {p}%)',hunchYes:'Follow the hunch',hunchNo:'Not now',hunchFail:'Nothing comes. Not yet.'};
// Overstepping steps (Skills and menus, Overstepping and cover stories; set Nov 20). Quiet cases start at Noticed.
const OVERSTEP={open:['Clean','Local chief','Agency call','Federal agents'],quiet:['Clean','Noticed','Local chief','Agency call','Federal agents'],
 climb:{Noticed:'Word gets around: strangers are asking questions.','Local chief':'Somebody called the chief.','Agency call':'Your phone buzzes. Big Hat.','Federal agents':'Black cars at the edge of town.'},
 fedsBack:'Nobody else comes. The case is still yours, and the heat is back down to the local chief.'};
// ---------- ROAMERS, LOOT, LANTERN BOXES, REQUISITION (spec 006 part C; Gameplay loop, Where items come from) ----------
// A case can supply its own wording for a few of these shared lines with registerCase({words:{slipped, crackers,
// recruit, gameOverSan}}) (field.js caseWord): Still Harvest keeps its corn. The defaults here fit any case.
const ROAMW={gameOverSan:'Agent {code} walks off into the dark, smiling, and does not come back.',fight:'Fight',salt:'Lay a salt line',caught:'The {e} has you!',slipped:'{n} twists free. The {e} loses you in the dark.',
 snuck:'{n} slips past the {e}. It never turns its head.',spotted:'The {e} turns. It saw you.',jumped:'{n} hits the {e} from behind!',
 warded:'{n} marks a line in the dirt. The {e} won\'t cross it. It backs off to the far end of its beat.',wardFail:'The mark doesn\'t take. The line is just a line.',
 salted:'{n} pours a line of salt across the path. The {e} stops at it, and backs away.',crackers:'The firecrackers pop and spit. The {e} goes crashing off after the noise.',
 snarePast:'Snare it and slip past',snareFight:'Snare it and fight (it starts Stunned)',snared:'The snare bites. The {e} thrashes in place while {n} walks right by.',
 ghost:'Ghost: on the way past, you lift what it was guarding.',none:'No roamer close enough to use it on.',drawn:'SOMETHING HEARD THAT',
boxEmpty:'The Lantern Box is empty. You already took what Big Hat left.',
 reqAsk:'Before you go. Anything you want from the cage, ask now. I\'ll say no to most of it.',reqYes:'Requisition',reqNo:'We\'re fine',
 reqWho:'{n} ASKS FOR',reqSkip:'Nothing',reqOk:'{i}. Sign here. Bring it back or don\'t, but don\'t lose it.',reqNoLine:'{i}? No.',
 reqRefused:'And before you ask: no gear. Not after last time. You know what you did.'};
// ---------- RECRUITS (Systems, Losing an agent; spec 006 A6) ----------
// One ready-made recruit per profession, built like team-template agents; Big Hat offers three. first: the arrival line.
const RECRUITS=[
 ['Dana Reyes','RIGGS','shooter',[13,12,15,10,11,9],{Firearms:1,Dodge:1,Athletics:1,Search:1,Melee:1,'First Aid':1,Stealth:1,Persuade:1},[['Partner','Lee','they'],['Parent','Rosa','she']],['Duty','Protect the innocent'],[3,0,0,0,0,0,'b'],'Range instructor at a county academy. Got a call at 4 a.m. and a plane ticket.','Big Hat said you lost somebody. I\'m sorry. Where do you need me?','she'],
 ['Tomas Ilves','GAGE','medic',[9,12,12,14,13,11],{'First Aid':1,Medicine:1,Empathy:1,Science:1,Search:1,Persuade:1,Dodge:1,Stealth:1},[['Sibling','Kat','she'],['Friend','Omar','he']],['Protect the innocent','Curiosity'],[0,0,2,1,3,1,'s'],'Paramedic on a rural route. Three of {a.their} calls last winter were already dead and still talking.','I brought the good bandages. Who\'s bleeding?','he'],
 ['Ruth Abernathy','MARPLE','investigator',[10,11,11,15,13,11],{Forensics:1,Search:1,Persuade:1,Occult:1,History:1,Empathy:1,Firearms:1,Dodge:1},[['Kid','Nell','she'],['Ex','Sam','he']],['Find the truth','Family'],[1,4,5,2,4,1,'s'],'Insurance fraud investigator. The claims kept describing the same tall man.','Catch me up. Slowly. Leave nothing out.','she'],
 ['Arthur Penn','BARTLEBY','clerk',[8,10,10,16,15,12],{Bureaucracy:1,History:1,Persuade:1,Computers:1,Search:1,Occult:1,Dodge:1,Empathy:1},[['Partner','Glen','he'],['Mentor','Edith','she']],['Duty','Find the truth'],[0,3,5,0,1,1,'s'],'Records clerk for the state. Found a town that files its census twice.','I have the forms. I have every form. What needs signing?','he'],
 ['Kit Moreno','TRINITY','hacker',[9,10,14,16,12,10],{Computers:1,Search:1,Craft:1,Stealth:1,Science:1,Dodge:1,Occult:1,Athletics:1},[['Sibling','Ana','she'],['Friend','Jules','they']],['Curiosity','Money'],[2,1,0,2,0,5,'s'],'Pen tester for hire. A job in Idaho ended with a router that answered in Latin.','No signal out here. Good thing I don\'t need one.','they'],
 ['Wes Calloway','GANTRY','talker',[10,11,11,12,13,14],{Persuade:1,Empathy:1,Bureaucracy:1,Stealth:1,Search:1,History:1,Dodge:1,Firearms:1},[['Ex','June','she'],['Parent','Mabel','she']],['Money','Redemption'],[1,0,1,0,3,0,'s'],'Sold church organs door to door. Sold one to a congregation that had no members.','Who do I need to talk to? Point me at them.','he'],
 ['Earl Tate','BUNYAN','bruiser',[17,15,10,9,11,9],{Melee:1,Athletics:1,Craft:1,Dodge:1,Firearms:1,Search:1,'First Aid':1,Persuade:1},[['Kid','Lacey','she'],['Friend','Dutch','he']],['Family','Protect the innocent'],[4,3,0,1,0,3,'b'],'Logger, then tow-truck driver. Towed a car out of a lake with the driver still breathing in it.','Big Hat said you needed a hand. I brought two.','he'],
 ['Simone Ash','RIPLEY','bodyguard',[13,13,15,10,11,9],{Dodge:1,Firearms:1,Melee:1,Search:1,Athletics:1,Stealth:1,Empathy:1,'First Aid':1},[['Partner','Rae','they'],['Sibling','Dom','he']],['Duty','Money'],[5,4,0,0,0,2,'b'],'Close protection for a senator, until the senator stopped casting a shadow.','Stay behind me. I mean it.','she'],
 ['Joel Santos','TRAPPER','cmedic',[12,13,12,13,12,9],{Medicine:1,'First Aid':1,Firearms:1,Dodge:1,Athletics:1,Search:1,Stealth:1,Empathy:1},[['Partner','Bea','she'],['Mentor','Doc Hale','he']],['Protect the innocent','Faith'],[3,0,0,0,0,3,'b'],'Field medic with the Guard. Flood duty, mostly. One flood came back up the river.','Let me see everyone\'s hands. Then your eyes.','he'],
 ['Vera Kostas','ARMITAGE','occultist',[8,10,11,16,16,10],{Occult:1,History:1,Search:1,Empathy:1,Persuade:1,Dodge:1,Science:1,Stealth:1},[['Mentor','Father Ilya','he'],['Kid','Tess','she']],['Faith','Curiosity'],[0,1,6,2,4,7,'s'],'Restores old books for a university. One of them restores itself.','I\'ve read about places like this. Let\'s not end up in the footnotes.','she'],
 ['Hugh Mercer','HOOPER','scientist',[9,11,12,17,12,10],{Science:1,Forensics:1,Medicine:1,Computers:1,Occult:1,History:1,Search:1,Dodge:1},[['Sibling','Pat','they'],['Partner','Neil','he']],['Find the truth','Curiosity'],[1,2,5,1,1,1,'s'],'Water-quality chemist. {a.Their} last sample from a farm pond had a heartbeat.','I brought sample jars. Don\'t ask how many.','he'],
 ['Nell Harrow','KATNISS','tracker',[13,14,14,10,12,8],{Survival:1,Stealth:1,Athletics:1,Firearms:1,Search:1,Dodge:1,Melee:1,'First Aid':1},[['Parent','Gil','he'],['Friend','Wren','she']],['Revenge','Duty'],[2,1,3,0,2,4,'s'],'Search and rescue in the Cascades. Found a hiker missing a year, still warm.','The tracks out here are wrong. Show me where they go.','she'],
 ['Sal Ferro','SPENGLER','exterminator',[13,14,12,12,11,9],{Craft:1,Science:1,Stealth:1,Search:1,Melee:1,Athletics:1,Firearms:1,Forensics:1},[['Partner','Lu','they'],['Kid','Vinnie','he']],['Money','Family'],[2,3,0,2,0,3,'b'],'Termite man. Tented a house in Fresno, and something inside asked {a.them} to stop.','Smells like a nest. Where do they sleep?','he'],
 ['Adele Brooks','MORTICIA','funeral',[10,12,11,13,15,10],{Forensics:1,Empathy:1,Bureaucracy:1,Medicine:1,Occult:1,Persuade:1,Search:1,Dodge:1},[['Sibling','Clara','she'],['Coworker','Mr. Pike','he']],['Faith','Duty'],[4,4,0,0,2,0,'s'],'Runs {a.their} family\'s funeral home. One client kept his appointment twice.','I\'m good with the dead. Let\'s keep the rest of you upright.','she'],
 ['Miles Dunne','FLETCH','reporter',[10,10,13,14,12,12],{History:1,Persuade:1,Computers:1,Search:1,Stealth:1,Empathy:1,Dodge:1,Occult:1},[['Ex','Holly','she'],['Mentor','Gus','he']],['Find the truth','Curiosity'],[0,2,3,1,3,1,'s'],'Night editor at a two-page weekly. Ran an obituary for a man who called to say thanks.','Off the record? Everything\'s off the record now, I guess.','he'],
 ['Lena Ostrowski','MELFI','therapist',[9,11,11,14,15,11],{Empathy:1,Persuade:1,Medicine:1,Search:1,Occult:1,History:1,Dodge:1,Stealth:1},[['Partner','Mark','he'],['Kid','Ivy','she']],['Protect the innocent','Redemption'],[0,4,1,0,2,0,'s'],'Grief counselor. {a.Their} group kept growing by one chair nobody sat in.','How is everybody doing? Really. You can tell me.','she'],
 ['Boone Larkin','GOLDBERG','hockey',[16,15,13,9,10,8],{Melee:1,Athletics:1,Dodge:1,'First Aid':1,Firearms:1,Search:1,Stealth:1,Occult:1},[['Sibling','Dee','she'],['Coworker','Tank','he']],['Family','Revenge'],[1,2,4,0,2,4,'b'],'Zamboni driver and beer-league goalie. The ice keeps freezing with handprints in it.','Big Hat says I\'m the backup. I\'ve been the backup before.','he'],
 ['Hal Whitcomb','THOREAU','ranger',[12,14,13,12,12,8],{Survival:1,Search:1,Firearms:1,'First Aid':1,Athletics:1,Stealth:1,Science:1,Dodge:1},[['Partner','Joan','she'],['Friend','Abe','he']],['Duty','Protect the innocent'],[2,5,5,2,1,3,'b'],'Fire lookout for nineteen seasons. Last summer the smoke on the horizon waved back.','Got here as fast as the roads allowed. What\'s the ground like?','he']
].map(r=>Object.assign(T(r[0],r[1],r[2],r[3],r[4],r[5],r[6],r[7],r[8],r[10]),{first:r[9]}));
const RECRUITW={ask:'Big Hat calls. "Lost one. I\'m sending a replacement. Pick."',build:'Build my own',hat:'"{p}. {n}. Bring this one home."',built:'"Fine. Your pick. Bring this one home."',
 gone:'{n} is gone.',later:'Not now'};
// ---------- CREATOR STEP NAMES ----------
// Stat jobs (Bible: Agent creator, Worked out from stats) and weird hobbies (a bonus pick in a skill outside the profession)
const STATJOB={STR:'HP = (STR + CON) ÷ 2. STR 13+ adds +1 Melee damage.',CON:'HP = (STR + CON) ÷ 2. Roll CON × 5 to shrug off Poisoned or Sickened, and to keep from retching.',DEX:'Sets turn order in a fight.',INT:'Once per case, stuck on a deduction, roll INT × 5 for a Hunch.',POW:'WP = POW. SAN = POW × 5. Breaking Point = SAN − POW.',CHA:'Each Bond starts at CHA.'};
const HOBBY={'Firearms':'shoots skeet on Sundays','Melee':'boxes on weekends','Dodge':'has never been tagged at dodgeball','Athletics':'runs marathons','Search':'finds everyone\'s lost keys','Persuade':'could sell sand at the beach','Forensics':'watches true crime with a notebook','Occult':'reads tarot','History':'haunts the county archive','Science':'keeps a lab in the basement','Empathy':'can tell when you\'re lying','Bureaucracy':'loves a form in triplicate','Stealth':'never makes the floorboards creak','Survival':'hunts every fall','First Aid':'carries bandages for everyone','Medicine':'almost finished med school','Computers':'builds {a.their} own computers','Craft':'fixes anything with a wrench'};
// ---------- CASE BOARD (Bible: Story, Case board; spec 004) ----------
const BOARD={
 season:'SEASON',title:'CASE BOARD',closed:'CLOSED',briefing:'BRIEFING',back:'BACK',stamp:'CLOSED',file:'FILE',
 sticky:['NOBODY','TOUCH MY','CRULLERS.','—BH'],  // Big Hat's sticky note on the cork (mockup)
 stickyMore:['MORE ON','THE WAY.','—BH'],  // a season with no data file yet (spec 009, step 5)
 lantern:'LANTERN',finale:'FINALE',empty:'No cases pinned yet.',devQ:'Dev menu.',devPin:'Dev: pin {n} now',devClose:'Close',devNone:'NO AGENCY CASE TO PIN',agencyPlace:'AGENCY CASE',finalePlace:'SEASON FINALE',files:'{n} files',file1:'1 file',closedFiles:'CLOSED FILES',
 endTitle:'SEASON {n} CLOSED',endRegular:'Cases closed',endAgency:'Agency cases',endLost:'Agents lost',endStep:'Overstepping',endKeys:'A: next season',
 // New game with a closed case (Skills and menus, Quality of life: Confirm what sticks)
 sure:'Can\'t be undone. Sure?',resetLine:'This starts Season 1 over. Your roster stays.',yes:'Yes, start over',no:'No, back to the title'
};
// ---------- THE DEBRIEF (spec 007, Demo 6; approved debrief mockup) ----------
// Screen words, the send-off, funeral and goodbye lines (Systems, Losing an agent: Claude writes these without review).
// {n} the agent's first name, {c} their code, {k} cases closed, {r} the recruit, {s} an overstepping step, {i} an item.
// the number that follows the team after a walk-away (season.js, arcNine)
const NINE={label:'The 9',see:['A room key on the motel desk, a brass tag: 9. You asked for 4.','Somebody chalked a 9 on the van\'s back door. Neat, like a teacher.','The radio skips to a station counting down. It stops at 9.','Every clock in the first room you walk into says 9:09.']};
const DEBRIEF={
 closed:'CASE CLOSED',clues:'Clues',saved:'Saved',fights:'Fights',overstep:'Overstep',
 items:'CASE ITEMS',itemsHint:'Big Hat sorts',keep:'KEEP',bag:'BAG',hide:'HIDE',ordinary:'Ordinary',unnatural:'Unnatural',done:'Done',
 keepLine:'Ordinary: you keep it.',bagLine:'Unnatural: bagged as evidence unless hidden.',hideLine:'Hidden: stays with {n}. Big Hat never sees it.',
 hideAsk:'Hide {i} from Big Hat? Can\'t be undone.',hideYes:'Hide it',hideNo:'Bag it',
 itemKeys:'A: flip · Done: sort them',
 safeStory:'Already filed: nothing happened',
 offAsk:'And the page. Records wants it by Monday.',offFile:'File it',offKeep:'Keep it off the books',offFiled:'He clips it to the folder. It goes upstairs with the rest.',
 offKept:'He looks at it a long time. Then it goes in his coat, not the folder.',offCover:'{n} fixes the paperwork. Nobody upstairs counts the pages.',offCost:'Somebody upstairs counts the pages. Overstepping climbs to {s}.',offTop:'Somebody upstairs counts the pages.',
 cover:'COVER STORY',coverHint:'What do locals hear?',who:'WHO TELLS IT?',luck:'Luck',safe:'SAFE',weak:'Weak story',
 stepShort:{Clean:'CLEAN',Noticed:'NOTICED','Local chief':'CHIEF','Agency call':'CALL','Federal agents':'FEDS'},
 passDrop:'Pass: the case closes quiet, and it drops to {s}.',passQuiet:'Pass: the case closes quiet.',
 failClimb:'Fail: it climbs to {s}.',failTop:'Fail: it can\'t climb past {s}.',safeLine:'No roll. Clean books: it always holds.',safeDrop:'It drops to {s}.',
 coverKeys:'A: pick · B: back',tellKeys:'A: tell it · B: back',
 held:'The story holds.',heldDrop:'The story holds. Overstepping drops to {s}.',
 broke:'Nobody buys it. Overstepping climbs to {s}.',brokeTop:'Nobody buys it. It can\'t get any worse than {s}.',
 gains:'CASE GAINS',gainsHint:'Failed it, learned it',noGains:'Nothing failed, nothing learned.',newUnlock:'★ NEW: {u}',
 patched:'Patched up: HP, WP and statuses reset.',next:'Next: home scenes. A: continue',
 recruit:'Big Hat sets a folder on the desk. "Lost one out there. Replacement\'s outside. Pick."',
 // Big Hat's send-off, one line per lost agent: a death (in a fight or at 0 SAN) or a retirement
 sendDeath:['Agent {c}. {k} cases closed. I\'ll write the family myself. Records spells everything wrong.',
  'Agent {c}. I had a form for this. I\'ve had it a long time. I hate the form.'],
 sendDark:'Agent {c} walked off into something I don\'t have a form for. I\'ll make one.',
 sendRetire:'Agent {c} is off field work. Desk, pension, a fern. {n} earned the fern.',
 // the funeral (each death) and the retirement goodbye; the recruit stands at the back
 funeral:['A cemetery off the interstate. Rain that can\'t commit either way.','The casket is closed. The flag is folded wrong. {n} would\'ve said so.',
  'Big Hat stands at the back with his hat on. Nobody asks him to take it off.'],
 funeralNew:'{r} stands behind everybody in new shoes, not sure whose funeral this is to {r.them}. Somebody hands {r.them} a sandwich.',
 funeralEnd:'Name on the stone: {n}. Spelled right. Big Hat checked.',
 goodbye:['A going-away cake from Safeway in the back of the donut shop. It says GOOD LUCK in blue.','{n} signs the last form. It\'s mostly about the pension. And the not talking.'],
 goodbyeNew:'{r} gets the locker. {n} leaves {r.them} the good flashlight.',
 goodbyeEnd:'Big Hat walks {n} out to the car. Says one thing nobody else hears. {n} laughs anyway.',
 how:{'bled out':'Bled out','0 SAN':'Lost to the dark','retired':'Retired'},
 // the memorial plaque on the case board (Keegan picked a plaque, Nov 22)
 memorial:'MEMORIAL',plaque:'IN MEMORY',memCases:'{k} cases',memSeason:'Season {s}',memKeys:'Up/Down: scroll · B: back',memA:'OPEN'
};
// ---------- THE HOME PHASE (spec 008; approved home phase mockup) ----------
// Screen words only. The scenes and arc beats are in home.js's own text block.
const HOMEW={
 title:'HOME',hint:'One choice each',waiting:'Waiting',choosing:'Choosing…',away:'Away',
 rows:[
  {k:'fr',name:'Fulfill Responsibilities',tag:'+BOND',line:'See one of your people. Pass SAN and that Bond grows.',roll:'Pass: +1d6 to that Bond, up to CHA. Crit: also +1 SAN. Fumble: −1d4 to that Bond, −1 SAN.'},
  {k:'nature',name:'Back to Nature',tag:'+SAN',line:'Get out of town. One Bond pays 1 for the time away.',roll:'Pass: +1d4 SAN. Crit: +4. Fumble: −1d4 SAN.'},
  {k:'mot',name:'Personal Motivation',tag:'+SAN',line:'Chase a reason to get up, or replace or swap one.',roll:'Pursue, pass: +1d2 SAN. Crit: +2. No Bond cost.'},
  {k:'therapy',name:'Therapy',tag:'+SAN',line:'Talk to someone. SAN, or work on one disorder.',roll:'SAN, pass: +1d4. Crit: +4. Fumble: no requisition next briefing. Disorder: no roll; the third session cures it.'},
  {k:'skill',name:'Improve Skill',tag:'+1D6%',line:'Practice one skill.',roll:'+1d6% to the skill you pick, up to 99%.'},
  {k:'train',name:'Special Training',tag:'BOND',line:'Pick up an untrained skill: it goes from 10% to 30%.',roll:'No roll. One Bond pays 1.'},
  {k:'sab',name:'Sabbatical',tag:'1–3 CASES',line:'Sit out 1–3 cases in psych care while a recruit covers.',roll:'Each case away: +1d6 SAN and a 40% chance to cure one disorder.'},
  {k:'use',name:'Use',tag:'NO WD',line:'Spend the break using. No Withdrawal next case.',roll:'One Bond loses 1d4, and the agent loses 1 SAN.'},
  {k:'bond',name:'New Bond',tag:'+BOND',line:'Someone new fills the empty slot. Starts at half CHA.',roll:'No roll.'}],
 noSlot:'NO SLOT',noBond:'NO BOND ABOVE 1',noBondAny:'NO BOND',noUntrained:'NOTHING UNTRAINED',keys:'A: pick · B: back',keysFirst:'A: pick',
 see:'WHO TO SEE?',pays:'WHO PAYS?',bondLine:'Bond {s} / {c}',cha:'CHA {c} · SAN {s}',
 moods:{close:'CLOSE',strained:'STRAINED',fraying:'FRAYING',broken:'BROKEN'},
 moodLine:{close:'{b} is glad to see {n}. Things are good.',strained:'{b} hasn\'t seen {n} in a while. It shows.',fraying:'{b} is running out of patience with {n}.'},
 bondKeys:'A: go see {b.them} · B: back',payKeys:'A: {b.they} {b:pays|pay} · B: back',
 sanRoll:'SAN roll vs {p}',empRoll:'{t}\'s Empathy vs {p}',moodUp:'Next visit plays warmer.',moodDown:'Next visit plays colder.',broken:'BROKEN · The slot is empty until New Bond.',
 pass:'PASS',fail:'FAIL',crit:'CRIT',fumble:'FUMBLE',
 motT:'PERSONAL MOTIVATION',pursue:'Pursue: {m}',replace:'Replace a lost motivation',swap:'Swap a motivation',whichSwap:'SWAP WHICH?',newMot:'NEW MOTIVATION',mainQ:'WHICH IS MAIN?',
 swapSure:'Swapping your Main motivation ends {n}\'s story so far. Can\'t be undone. Sure?',yes:'Yes',no:'No',
 therT:'THERAPY',therSan:'Talk it out (SAN)',therDis:'Work on {d} ({k} of 3)',
 skillT:'IMPROVE WHICH?',trainT:'LEARN WHICH?',typeT:'NEW BOND: WHO?',nameT:'THEIR NAME',typeName:'Type a name…',namePrompt:'Name for the new Bond:',
 sabT:'HOW LONG AWAY?',sabN:['1 case','2 cases','3 cases'],sabSure:'{n} sits out {k}. A recruit covers. Can\'t be undone. Sure?',sabTag:'Sabbatical · {k} left',
 sabRecruit:'Big Hat slides three folders across the desk. "Somebody\'s got to hold the seat. Pick."',
 cured:'{d} cured.',sanUp:'SAN {a} → {b}',bondUp:'{b} {x} → {y}',skillUp:'{k} {x} → {y}',
 back:'BACK FROM SABBATICAL',backQ:'Who keeps the seat?',backSure:'{n} keeps the seat. {o} goes to the roster. Can\'t be undone. Sure?',backKeys:'←/→: pick · A: keep this one',
 recruitCases:'{k} cases closed',backRoster:'{n} is back from Sabbatical and waiting on the roster.',awayT:'SABBATICAL · {n}',cureQ:'CURE WHICH?',
 perk:'Perk: {p}',perks:{protect:['Not on my watch','Once per fight, takes the hit for an ally about to go down, at half damage.'],
  truth:['Loose thread','Once per case, a wrong deduction costs nothing, and you can answer again.'],
  family:['Call home','Once per case, from Skills on the map: clears Shaken, +1d4 WP, and that Bond +1.'],
  faith:['Steady faith','Horrors on sight cost 1 less SAN.'],
  revenge:['Cold head','Human enemies can\'t shake them; +20% to hit whatever Downed an ally this fight.'],
  duty:['Badge','Once per case, one roll against police, officials or agency staff succeeds.'],
  curious:['Seen it before','The first fight against each kind of enemy shows its weakness.'],
  money:['Expense account','Once per case, from Skills on the map: one common item.'],
  redeem:['Second chance','Once per case, reroll a failed SAN roll.']},
 perkUsed:'{p}: {n}.',callHome:'{n} calls {b} from a gas station payphone. Nobody says anything important. It helps.',expense:'{n} expenses a {i}. Big Hat will never read the receipt.',
 noReq:'Your shrink\'s got a real nice office. Real nice filing cabinet.',noReq2:'No requisition. Sit.'
};
// Skill unlock names at 40, 75 and 90% (Skills and menus, Skill unlocks), flashed when a case gain crosses one
const UNLOCKS={Firearms:['Shoot it open','Lights out','Dead eye'],Melee:['Force it','Jump them','Grapple'],Dodge:['Duck','Slip free','Riposte'],
 Search:['Sweep','On guard','Keen eye'],Forensics:['Examine','Reconstruct','Hardened'],Occult:['Identify','Ward','Seen it in the books'],
 History:['Dig records','Translate','Local legend'],Science:['Sample','Analyze','Field lab'],Empathy:['Read','Calm','Anchor'],
 Persuade:['Talk your way in','Lean on them','Silver tongue'],Bureaucracy:['Paper trail','Credentials','Clean books'],Athletics:['Climb and jump','Outrun','Second wind'],
 Stealth:['Sneak','Blend in','Ghost'],Survival:['Track','Pathfinder','Make camp'],'First Aid':['Patch up','Triage','Steady hands'],
 Medicine:['Treat','Revive','Sedate'],Computers:['Crack it','Trace','Backdoor'],Craft:['Fix it','Rig','Blow it']};
// ---------- BATTLE (Bible: Combat; spec 006 part B) ----------
// The command row, the Guard list, every battle move with its skill, tier and one-line rule, and the battle's lines.
// {n} the agent, {e} the enemy, {t} a target, {h} HP, {w} WP, {k} turns left.
const BATTLEW={cmds:['FIGHT','SKILLS','ITEMS','GUARD'],free:'free',wp:'{w} WP',noSkills:'No battle skills yet.',noItems:'Nothing to use.',
 detail:'{wn} {d} · {s} {p}% · free',target:'{e} · {p}% to hit · {d}',targetAlly:'{t} · {h}',targetNo:'{e}',
 down:'DOWN · {k} left',downT:'{k} turns',down1:'1 turn',snap:'SNAPPED',gone:'GONE',
 guard:{defend:['Defend','Take half damage until your next turn.'],slip:['Slip','Defend, and roll Dodge against each attack: a success takes no damage.'],
  brace:['Brace','Spend 1d4 WP: your next SAN loss this fight is halved.'],retch:['Retch','Roll CON × 5 to clear Sickened. Once per scene.'],flee:['Flee','Roamer fights only. The party\'s slowest Athletics is rolled.']},
 why:{wp:'Not enough WP.',gun:'Needs a gun in hand.',flee:'You can\'t run from this one.',retch:'Only when Sickened, once per scene.',once:'Once per fight.',oncecase:'Once per case.',noTarget:'No one to use it on.',twice:'Can\'t fire two turns in a row.',brace:'No WP left to brace.',spent:'Used up. Refills next case.'},
 start:'{e} {v}!',round:'',
 lines:{miss:'{n} {v}... and misses {e}.',hit:'{n} {v}. {e} takes {h}.',crit:'{n} {v}. Critical! {e} takes {h}.',
  fumbleGun:'The {wn} jams. {n} loses the shot.',fumbleMelee:'{n} swings wide and nearly falls.',fumbleSkill:'Bad luck. Nothing happens.',
  eMiss:'{e} {v} {n}... and misses.',eHit:'{e} {v} {n}. {h} damage.',eCrit:'{e} finds an opening. {h} damage to {n}!',eFumble:'{e} lunges and stumbles.',
  slip:'{n} slips aside. No damage.',riposte:'Riposte!',halved:'(halved)',armor:'(armor)',
  eDie:'{e} {d}.',downed:'{n} goes down!',downTurn:'{n} is down and bleeding. {k} left.',bledOut:'{n} stops moving.',revived:'{n} is back on {n.their} feet. +{h} HP.',
  stunned:'{n} is stunned and can\'t act.',eStunned:'{e} is stunned.',resist:'{e} shrugs it off.',bleedTick:'{n} bleeds. −{h} HP.',poisonTick:'The poison works on {n}. −{h} HP.',
  eBleed:'{e} bleeds. −{h} HP.',ePoison:'The poison eats at {e}. −{h} HP.',
  defend:'{n} braces and watches the dark.',slipOn:'{n} gets light on {n.their} feet.',brace:'{n} steels {n.themself}. −{w} WP.',
  drawFire:'{n} steps out and shouts. Every eye turns to {n.them}.',vanish:'{n} melts into the dark.',tripwire:'{n} strings a tripwire.',
  grapple:'{n} gets {e} in a hold!',grappleFail:'{e} twists out of reach.',hold:'{n} holds {e} down.',breakFree:'{e} breaks free!',pinned:'{e} struggles in the hold.',
  shoved:'{e} stumbles to the back of the line.',exposed:'{e} is Exposed.',shaken:'{e} is Shaken.',eFlees:'{e} flees into the dark.',
  bleeding:'{e} is Bleeding.',poisoned:'{e} is Poisoned.',stunOn:'{e} is Stunned.',calm:'{n} talks {t} down. No longer Shaken.',
  identify:'{n} knows what this is. {w}',identifyFail:'{n} can\'t place it.',spot:'{n} spots a weak point.',
  tackle:'{n} hits the ground with it.',zip:'{n} ties {e} up. Out of the fight.',
  flee:'You back away into the dark. You get away.',fleeFail:'There\'s nowhere to go!',smokeFlee:'Smoke rolls over everything. You slip away.',
  swap:'{n} switches to the {wn}.',hatchet:'The hatchet is gone for the rest of the fight.',chainsaw:'The fumes and the spray leave {n} Sickened.',
  snapSelf:'{n} turns the {wn} on {n.themself}.',snapAlly:'{n} lashes out at {t}!',snapFoe:'{n} screams and charges {e}.',snapNone:'{n} stares at nothing and laughs.',
  win:'You survived. For now.',walkOff:'{n} walks it off.',phase:'{e} changes.',dmgFloat:'−{h}',miss1:'MISS'},
 injW:{minor:'Minor',serious:'Rehab',grave:'Permanent',left2:'clears after next case',left1:'clears after this case',none:'None',
  got:'{n}: {i}. {p}.',graveLabel:'Being badly wounded',career:'{n} won\'t be doing field work again.',repeat:'The same injury again. It won\'t fully heal now.'}
};
// Battle moves (Combat: Battle moves, Status moves, Other skills in battle). tier: the skill % that unlocks it; wp: its cost.
// grp: where it shows (skills, or guard). The rules for each live in battle.js under its key.
const M_=(key,skill,tier,wp,name,line,o={})=>Object.assign({key,skill,tier,wp,name,line},o);
const MOVES=[
 M_('aimed','Firearms',40,1,'Aimed shot','−20% to hit, double damage on a hit.',{gun:1,t:'foe',hit:-20}),
 M_('burst','Firearms',75,2,'Burst','One roll against every enemy, half damage on each hit.',{gun:1,t:'none'}),
 M_('deadeye','Firearms',90,3,'Dead eye','An automatic hit that also causes Bleeding.',{gun:1,t:'foe'}),
 M_('shove','Melee',40,1,'Shove','Half damage; the enemy drops to last in the turn order.',{t:'foe'}),
 M_('haymaker','Melee',75,2,'Haymaker','−20% to hit; a hit does full damage and Stuns.',{t:'foe',hit:-20}),
 M_('grapple','Melee',90,3,'Grapple','Pin one enemy. You hold it instead of acting; teammates get +20% against it.',{t:'foe'}),
 M_('drawfire','Dodge',75,2,'Draw fire','Defend, and every enemy targets you until your next turn.',{t:'none',noRoll:1}),
 M_('spot','Search',40,1,'Spot weak point','One enemy is Exposed, and its exact HP shows for the fight.',{t:'foe'}),
 M_('alarm','Computers',40,1,'Alarm','Blare a phone or car alarm: one enemy is Exposed. Loud.',{t:'foe',loud:1}),
 M_('badge','Bureaucracy',40,1,'Flash the badge','A human enemy is Stunned. Once per fight.',{t:'foe',human:1,perFight:1}),
 M_('tackle','Athletics',40,1,'Tackle','The enemy is Stunned, but you lose your next turn too.',{t:'foe'}),
 M_('flare','Survival',40,1,'Road flare','Beast-like enemies are Shaken.',{t:'none'}),
 M_('wound','Forensics',75,2,'Find the wound','An already-hurt enemy starts Bleeding.',{t:'foe',hurt:1}),
 M_('vanish','Stealth',75,2,'Vanish','Enemies can\'t target you until you act; your next attack causes Bleeding.',{t:'none'}),
 M_('caustic','Science',75,2,'Caustic mix','A living enemy is Poisoned.',{t:'foe',living:1}),
 M_('bind','Occult',75,2,'Bind','An unnatural enemy you have Identified is Stunned.',{t:'foe',bound:1}),
 M_('name','History',75,2,'Speak its name','An enemy found in the case\'s records is Shaken.',{t:'foe',records:1}),
 M_('intimidate','Persuade',75,2,'Intimidate','A human enemy is Shaken; on a crit, it flees.',{t:'foe',human:1}),
 M_('tripwire','Craft',75,2,'Tripwire','The next enemy to attack you is Stunned.',{t:'none'}),
 M_('calm','Empathy',75,2,'Calm','Clears a teammate\'s Shaken.',{t:'ally',shaken:1}),
 M_('patch','First Aid',40,1,'Patch up','Heal one agent 1d4 HP.',{t:'ally'}),
 M_('triage','First Aid',75,2,'Triage','Heal each agent 1d2 HP.',{t:'none'}),
 M_('treat','Medicine',40,1,'Treat','Cure Bleeding, Poisoned or Sickened on one agent.',{t:'ally',treat:1}),
 M_('revive','Medicine',75,2,'Revive','A Downed agent stands at 1d4 HP.',{t:'downed'}),
 M_('sedate','Medicine',90,1,'Sedate','Calm a teammate\'s disorder flare for the rest of the fight.',{t:'ally',flare:1}),
 M_('identify','Occult',40,1,'Identify','−20% in battle. Its exact HP shows for the case, and its weakness.',{t:'foe',hit:-20})
];
// Lasting injuries (Combat: Lasting injuries, set Nov 20): 1d12 + modifiers. pen: skill penalties; hp: max HP.
const INJURIES=[null,
 {name:'Black eye',tier:'minor',pen:{Search:-10},line:'−10% Search'},{name:'Sprained wrist',tier:'minor',pen:{Firearms:-10},line:'−10% Firearms'},
 {name:'Rolled ankle',tier:'minor',pen:{Athletics:-10},line:'−10% Athletics'},{name:'Bruised ribs',tier:'minor',pen:{Dodge:-10},line:'−10% Dodge'},
 {name:'Split knuckles',tier:'minor',pen:{Melee:-10},line:'−10% Melee'},{name:'Bad knee',tier:'serious',pen:{Athletics:-20},line:'−20% Athletics'},
 {name:'Cracked ribs',tier:'serious',pen:{Dodge:-20},line:'−20% Dodge'},{name:'Torn shoulder',tier:'serious',pen:{Melee:-20},line:'−20% Melee'},
 {name:'Nerve-damaged hand',tier:'serious',pen:{Firearms:-20},line:'−20% Firearms'},{name:'Concussion',tier:'serious',pen:{Search:-20},line:'−20% Search'},
 {name:'Lost eye',tier:'grave',pen:{Firearms:-20,Search:-10},line:'−20% Firearms, −10% Search'},{name:'Facial scarring',tier:'grave',pen:{Persuade:-20},line:'−20% Persuade'},
 {name:'Chronic pain',tier:'grave',pen:{},hp:-2,line:'−2 max HP'},{name:'Ruined leg',tier:'grave',pen:{Athletics:-20,Dodge:-10},line:'−20% Athletics, −10% Dodge'},
 {name:'Done with field work',tier:'career',pen:{},line:'Leaves the party'}];
// Big Hat's two questions at every briefing (spec 013): his words around the case's four topics
const BRIEF={ask:'Two questions. Make \'em count.',none:'No questions',noQ:'Good. I like you. Don\'t make it weird.',two:'That\'s two.',banner:'CASE FILE: INTEL ADDED',skip:'B SKIP'};
const STEPNAME={profession:'JOB',stats:'STATS',skills:'SKILLS',identity:'IDENTITY',bonds:'BONDS',motives:'MOTIVATIONS',dossier:'DOSSIER',title:'BLACK LANTERN',roster:'ROSTER',team:'YOUR TEAM',pick:'PICK A TEAM',confirm:'NEW GAME'};
const STEPSHORT={profession:'JOB',stats:'STATS',skills:'SKILL',identity:'ID',bonds:'BOND',motives:'WHY',dossier:'FILE'};
return {pron,proOf,PRONOUNS,BUILDS,PROW_UI,CODENAMES,MOTKEY,CODEW,BRIEF,ROAMW,SKILLS,SKILLJOB,PROFS,ABILTXT,TEAMS,STATS,STATNAME,FEAT,RELS,RELTXT,FIRST,LAST,MOTIVES,MOTTXT,ADJ,NOUN,HAIRCN,HAIRS,EYES,EYEC,ACC,OUTCN,CREEP,ITEMDEF,WEAP,WEAPTXT,diceOf,ITEMS,KIT,KITUSES,ITEMUI,DISORDERS,SANW,TIERS,KINDS,SKILLOPT,AUTOPERK,SKILLW,MAPMENU,OVERSTEP,RECRUITS,RECRUITW,DIS,STEPNAME,STEPSHORT,STATJOB,HOBBY,STATUS,PARTY,BOARD,MAPHUD,BATTLEW,MOVES,INJURIES,DEBRIEF,UNLOCKS,HOMEW,NINE};
})();
