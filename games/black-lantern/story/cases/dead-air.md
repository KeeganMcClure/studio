# SECRET CASE FILE: Dead Air (FILE 06)

**Spoilers. For the Developer only.** Written Nov 23, 2026 by the Developer from spec 020's frame, the bible and the arc file's hidden hooks for regular cases, at the start of part A (the hidden hotspot, the cast and the maps come from it). Never quote or summarize this file in the bible, specs, changelog, To do, commits, PR text or chat. Keegan plays it blind.

Public frame it fills in: `games/black-lantern/specs/020-dead-air.md`. Where this file and the spec disagree, the spec wins on structure (counts, maps, budgets); this file wins on what things are. Part B fills in every line; this file sets the truth, the rules and the IDs.

## The truth (what is really going on)

- **The town.** Halcott, Louisiana, pop. 2,100, St. Odile Parish. Sugarcane on three sides and the bayou on the fourth. One stoplight, a feed store, a bait shop, a gas station that sells boudin, the Church of the Good Shepherd and its hall. Everybody's grandparents knew each other. Everybody's grandparents knew about 1979.
- **KHLT 1340 AM** (call letters checked: made up; no real AM station uses them as of this build. Swap them if one ever does). A 1,000-watt daytimer with a night permit, a cinder-block building and a 190-foot tower on the edge of the Thibodeaux cane. Its late show, **The Night Line**, ran midnight to 4 AM: a call-in show, hosted by **Royce Achord**, with the station's night engineer, **Emile Broussard**, at the board. Emile was 31, shy, and never said a word on air in nine years. He lived alone behind the station with his records and his sister Odile's cooking.
- **March 9, 1979.** A twelve-year-old, **Annette Guidry**, had been missing two days. At 3:04 AM a caller came on the Night Line and said, calm as a weatherman, that he knew where she was, and that she was cold. Half the parish was listening. Someone said the voice sounded like Emile's. By 3:30 there were eleven trucks at the station. Royce left the mic open; he said later he froze. The men took Emile out the back, into the cane, toward the tower. **Nobody saw him again.** Annette walked into a Baton Rouge bus station two days later; she'd run off with a boyfriend. Nobody ever learned who made the call. KHLT signed off for good that Friday. The eleven families agreed, without ever saying so, never to talk about it. The sheriff then was the current sheriff's father; he was the twelfth truck.
- **Where Emile is.** Under the station's **ground radials**: an AM tower stands on a buried wheel of copper wires running out from its base. Out in the cane north of the tower, the farmer never planted the circle where the radials come up close to the surface (the plow hits them). The men buried Emile there, in the bare circle, with the wires.
- **What is on the air now.** Not a ghost, not quite. **The Carrier**: something that lives in the hiss between stations, that feeds on people *listening*. In 1979 KHLT had the biggest audience it ever had, and a man died at the end of it with the mic open and the whole parish leaning toward their radios. The Carrier found the dead air that Emile left and **moved in**. It has had forty-seven years to learn his voice from the inside, and the station's equipment still sits in the booth, wired to a tower that was never taken down. Two weeks ago the parish laid new power to the irrigation pumps along the field road, and the station's old service line came live. The Night Line came back on at 3:00 AM.
- **The host.** It talks with Emile's voice (the one voice nobody in town ever heard on air, which is why nobody can name it). It is kind, slow, a little shy, and it knows everything everyone in Halcott has ever said within earshot of a radio. It takes calls.
- **The callers.** Recordings, and not. The Carrier plays back the voices of **the night of March 9**: the open mic caught the men in the booth. It cuts those voices into new sentences. The callers sound like the parish's dead grandfathers, and they say the names of their own grandchildren.
- **Why these names.** Every name said on the show is a child or grandchild of one of the eleven trucks. The Carrier is giving the parish what it gave Emile: a voice on the radio that says *it was you*, and a town that listens.
- **What happened to the missing.** **Darlene Achord** (58, Royce's daughter) and **Wade Hebert** (34, grandson of the man who drove the first truck) each heard their own name on the show and, before dawn, walked out into the cane with a transistor radio held to their ear. They are standing in the bare circle of the radial field, ankle-deep in the soft dirt over Emile, with their radios on, alive, not sleeping, not eating, listening. Each night they sink a little. On night 2 the show will name more people at once, and the circle will take them all.
- **Rules (the internal logic).**
  1. The Carrier speaks only on 1340 AM, only from 3:00 to 3:33 AM, and only while something in the parish is tuned to it.
  2. **It can only take someone who hears their own name said on the air.** A person who isn't listening when they're named is safe. An unplugged radio is a locked door.
  3. The named walk to the radial field before dawn. Their radios stay on in their hands. Taking the radio away wakes them, badly (SAN for the agent who does it; the person is in shock but alive).
  4. It is anchored to three things: the **transmitter's crystal** (the 1340 crystal, the station's frequency), the **3/9/79 cart** in the record room (the voices it cuts the callers from), and **Emile** (his voice, and his bones in the radials).
  5. **Saying Emile's name on its own air** (calling in and telling him it wasn't him) hurts it: the voice it wears stops agreeing to be worn.
  6. It is afraid of the sun (no broadcast after dawn) and of **silence** (a dead carrier: a transmitter keyed with nothing on it, a radio turned to static and held still).

## The cast (public names; part A draws their sprites and portraits)

| Who | Map id / tab | Role in the story | Weird trait (about 1 in 3) |
| --- | --- | --- | --- |
| **Sheriff Dutch Fontenot** | `sheriff` / `SHERIFF` | The Local chief. Sixties, heavy, careful, kind in a tired way, called Black Lantern in himself (he was told a number to call years ago and never used it). His father was the twelfth truck. He'll help as long as the town stays calm, and he will not talk about 1979 until he has to. | none |
| **Deputy Renée Theriot** | `deputy` / `DEPUTY` | Twenties, sharp, local, the only one in the office who says out loud that the radios are the problem. She's been unplugging them on her own time. | a police scanner on her belt that she keeps turned to 1340, "just in case" |
| **Joelle Achord** | `joelle` / `JOELLE` | Darlene's daughter, thirties, a nurse in Lafayette, home on leave to look for her mother. Angry at the sheriff, at the town, at her grandfather Royce (dead in 2011). The Faith moment's other half. | none |
| **Marcy Hebert** | `marcy` / `MARCY` | Wade's wife, thirties, two kids, works the gas station's day shift. She heard Wade's name on the radio and turned it up. She hasn't forgiven herself. Protect the innocent: her kids. | none |
| **Lucien Arceneaux** | `lucien` / `MR. ARCENEAUX` | The feed store's owner, 66. He was 19 in 1979, in the last truck. He took the 1340 crystal out of the transmitter the week after, and has kept it in his feed store safe ever since, because he couldn't think what else to do with it. Named on night 1. | none |
| **Pastor Ellis Batiste** | `pastor` / `PASTOR` | Good Shepherd's pastor, fifties, a big laugh, a bad knee. Runs the fish fry. Thinks the radio is the devil and says so, which is half right. The Faith moment. | a church fan he never puts down, even in March |
| **Mama Lou Guidry** | `lou` / `MAMA LOU` | The fish fry's cook, seventies, Annette's older sister. Fries catfish in the church hall's yard in an iron pot. Knows everyone's business. She is the only one in town who says Emile's name. | a cigarette behind each ear, never lit |
| **Toby Cormier** | `toby` / `TOBY` | Night clerk at the Gas-N-Go, nineteen, afraid of the dark since the show came back; keeps a radio on behind the counter anyway, "for company". The case's Liar: says he never listens. | none |
| **Odile Broussard** | `odile` / `MISS ODILE` | Emile's sister, 80, on the side street in a raised house with every radio she owns on the porch, playing static, all night. The town's fish fry wants to blame her ("the Broussard woman's radios"). The human fight's stake. | a pet nutria named Chou-Chou on a leash |
| **Remy Guidry** | `remy` / `REMY` | Mama Lou's grandson, the bait shop's owner, forties, the case's extra hand. Boat, waders, opinions. Knows the cane rows and the field road. Sells the Mushrooms (see below). | a live crawfish he keeps in his shirt pocket |

Night (Townsfolk at night): only Toby and Odile are up. Nobody else is touched by the weirdness enough to change; the named walk out into the cane and aren't on any map but the finale.

## The maps (part A places them)

| Map id | Name on screen | When | What's there |
| --- | --- | --- | --- |
| `halcott` | HALCOTT | day 1, night 1, day 2, night 2 | Main Street east to west: the Gas-N-Go (pump, pole sign), the sheriff's office, the feed store, the bait shop, the church hall at the west end with its yard and the fish fry pot. The side street (Bayou Street) below: raised houses on piers (the Achords', the Heberts', Miss Odile's with its porch of radios), a live oak with moss, the bayou along the bottom with cypress. The team's car on Main Street drives to KHLT. Night 1: Odile's porch is where the team listens to the show (the porch radio). |
| `sheriff` | SHERIFF'S OFFICE | day 1, day 2 | Front counter, two desks, the missing-persons board with two photos, the evidence shelf of confiscated radios, a holding cell (empty), Dutch's office door, a coffee maker. |
| `achord` | ACHORD HOUSE | day 1, day 2 | Darlene's front room: the one detail is the radio on the kitchen table with its cord pulled out of the wall and the plug still in Darlene's hand-written note, "TURN IT OFF". |
| `hebert` | HEBERT HOUSE | day 1, day 2 | Wade's front room: kids' drawings, a recliner, the one detail is the empty spot on the shelf where Wade's transistor radio sat, the dust outline of it. |
| `hall` | CHURCH HALL | day 2 (the fish fry, evening) | Long tables with butcher paper, the serving line, the stage with an old PA, folding chairs, the kitchen hatch. The fish fry's crowd. |
| `feed` | ARCENEAUX FEED & SEED | day 1, day 2 | Counters, feed sacks, a seed rack, the bait cooler (night crawlers and crickets), Lucien's safe in the back (the crystal, part B). |
| `khlt` | KHLT 1340 | day 2, night 2 | The cinder-block station with its dead sign, its gravel lot, the back door, the tower in a clearing with its fenced base and the guy wires, the transmitter shed, the cane rows all around. The tower's red light blinks again, night and day. |
| `booth` | KHLT · BROADCAST BOOTH | day 2, night 2 | The board, two mics, the cart machines, the ON AIR light, the turntables, the window into the dead transmitter room. A door into the record room. |
| `records` | KHLT · RECORD ROOM | day 2, night 2 | Floor-to-ceiling records and carts, the program logs, the file cabinet. The 3/9/79 cart, labeled DO NOT AIR. |
| `cane` | THE CANE FIELDS | night 2 | The danger zone. Young cane in rows, a stand of old tall cane nobody cut, a drainage ditch, the field road, the tower's red light over it all. 2–3 roamers. North edge opens on the radial field. |
| `radials` | THE RADIAL FIELD | night 2 | **The finale area.** The bare circle in the cane where the radial wires come up like spokes. The missing standing in it with their radios. The boss waits here. Go in / Not yet at the circle's edge. |

## The broadcasts (part B writes every call)

| Night | Calls | What the team can try (one thing per broadcast) |
| --- | --- | --- |
| **Night 1** (from Odile's porch, 3:00–3:33) | The host's sign-on (Emile's voice, unnamed). Caller 1: a man asks the host to play something for "the Hebert boy, out in the rows". Caller 2: a woman reads a recipe that turns into a list of names. Caller 3: a man says the name **Lucien Arceneaux** and "you know what you took". (Horror: Disturbing, unnatural, `subj: voices`.) Sign-off at 3:33: three seconds of breathing. | **Trace** (Computers or Craft, with the direction finder or the porch radio's loop): the signal isn't the tower, it's north of it, under the field (clue `trace`). **Record** (Science or Computers, the deputy's recorder): a tape of the show (clue `voices`: the callers are 1979 voices, provable on day 2 against the cart). **Call in** (the gas station payphone or Toby's phone): the host takes your call and says the name of the lead's BOND1, gently, and asks how they're sleeping (1/1d4 SAN; the lead gets **Named**, a case-only status: the lead hears its voice in static all day 2, −10 to Stealth, and on night 2 it calls the lead by name). Calling in also gives `voices` without a recorder. |
| **Night 2** (from the field, or the booth, 3:00–3:33) | The host names everyone in the fish fry's room, one by one, if the fish fry boiled; only the eleven families' names if it was calmed. The callers are the trucks. The last caller is Royce Achord, asking his daughter to come home. | **Trace** again from the booth: the transmitter is dead, it's coming up the ground system (opens the radials without the cane's long way). **Record** isn't possible (the tape plays back only static). **Call in** from the booth's own phone: say Emile's name on the air (only if `emile` or `ebooth` is found): **the weakening choice**, see the boss. |

Lucien is named on night 1. If the team gets to him on day 2 and makes sure he doesn't listen on night 2 (Persuade, Empathy, or just unplugging his shop radio), he lives; otherwise he's in the circle with the others.

## Clues (threshold plus bonus: 3 of the first five open night 2; extras weaken the boss or open endings)

| ID | Where | Skills | What it proves | Second way in |
| --- | --- | --- | --- | --- |
| `trace` | Night 1, during the broadcast | Computers, Craft | The signal comes from the ground north of the tower, not the transmitter | Night 2 trace from the booth |
| `voices` | Night 1 recording, or calling in | Science, Computers | The callers are old voices, cut up | The 3/9/79 cart played on day 2 (`cart`) |
| `log` | Record room: the program log for 3/9/79 | History, Bureaucracy, Search | The Night Line's last show; host R. Achord, engineer E. Broussard; "off air 3:41 · equipment fault" in a shaking hand | Sheriff's old incident file (Bureaucracy with Dutch, day 2) |
| `names` | Sheriff's office (the 1979 parish paper on microfiche, the missing-persons board) | History, Bureaucracy, Search | Every name said on air is a child or grandchild of the eleven trucks | Mama Lou tells you who drove which truck (Empathy, at the fish fry) |
| `emile` | Miss Odile's porch | Empathy, Persuade | Emile never said a word on the air in nine years, and the voice on the show is his | Mama Lou says his name (Empathy at the fish fry) |
| `cart` | Record room: the 3/9/79 cart, DO NOT AIR | Computers, Science (play it on the booth's machine), Occult | The open mic: the trucks, the booth, a man saying "it wasn't me" over and over. Horror: Severe (helplessness). Proves the callers are cut from it; burning it is a weakening choice | none: it's an extra |
| `ebooth` | **The hidden hotspot** (Mushrooms): the booth's guest mic | none (High) | The host is wearing Emile: the call-in line opens without `emile` | `emile` |

Seven clues. Night 2 opens with any 3 of `trace`, `voices`, `log`, `names`, `emile`. Nothing the story needs sits behind one clue alone.

## The deduction (at the fish fry, day 2 evening; never a dead end)

Big Hat calls the church hall's kitchen phone: **"Who's on the radio, Agent?"**
1. "A prankster with a transmitter in the cane." (wrong: costs time; the night-2 broadcast starts at 3:00 with the team still at the station; the cane's roamers are all awake)
2. "Something wearing a dead man's voice. The man the town killed in '79." (right: needs `emile` or `ebooth`, plus `log` or `names`; Big Hat: "Then give him his name back.")
3. "Lucien Arceneaux. He took something from that station." (half: needs `names`; Lucien is arrested by Dutch for his own safety, so he's not listening on night 2 and lives, but the crystal stays in his safe unless someone asks for it)
Night 2 comes either way once the party says Go on.

## The fish fry (day 2 evening, the church hall)

The parish is in one room, and a man stands up on a folding chair and says what everyone's thinking: it's the Broussard woman's radios. Three outcomes:
- **Calmed** (Persuade or Empathy to talk the room down, Bureaucracy to hand them a federal reason to go home and unplug): the hall goes home; most radios in town go off for the night; the night-2 broadcast names only the families; no human fight.
- **Pointed** (Persuade's Lean on them, or the pastor's Faith moment): the room's anger goes somewhere useful (they agree to keep everyone's radios off and to keep each other inside); no human fight; Odile is safe.
- **Boils** (no one stops it, or a failed roll with an overstep): the human fight: frightened townsfolk with tire irons and a gas can at Odile's porch at midnight (2 skulls). Persuade's Lean on them can still stop it before it starts, once, at Odile's steps.

## Choices that matter (remembered for the boss and debrief)

- **`crystal` Get the crystal from Lucien** (Persuade, Empathy, or the deduction's "half" answer then asking): put it back in the transmitter and key a **dead carrier** (Craft or Science) on night 2: the boss can't be heard outside the circle, so no one new walks in during the fight.
- **`burn` Burn the 3/9/79 cart** (any time after finding it; a lighter, or the booth's ashtray): the callers lose their voices: the boss's all-target "callers" attack is gone.
- **`name` Say Emile's name on the air** (night 2, the booth's phone or the board's mic; needs `emile` or `ebooth`): the boss's phase 2 shield never comes up, and the clean ending opens.
- **`odile` Protect Miss Odile** (the **Protect the innocent** moment): keep her and her porch safe through the fish fry and night 2 (the calm or pointed outcome, or stopping the boil at her steps). If she's hurt, `costly` at best.
- **`faith` The pastor's moment** (the **Faith** moment): at the fish fry, Pastor Ellis asks the agent with Faith (or the lead) to pray with the room or to tell him it's no devil, only men. Either answer can point the room; the choice is the agent's.
- **`unplug` Unplug the town** (Bureaucracy, day 2, a parish order through Dutch): fewer radios on night 2, but it's loud and public (see Overstepping).

## Overstepping (open case: Local chief first, then Agency call, Federal agents; extreme flag off)

| Act | Public? | Mark |
| --- | --- | --- |
| Pull every radio in town (without Dutch's order) | Public | 1 step |
| A scene at the fish fry (a gun shown, a shout, a fight) | Public | 1 step |
| Break into Lucien's safe | Seen (Lucien) | 1 step |
| Force the Achord or Hebert house | Seen (neighbors) | 1 step |
| Break into KHLT by day | Unseen (a Luck roll with no penalty) | none if passed |
| Anything in the cane fields at night | Unseen | Luck roll with no penalty |
| Burn the station (fire in the booth) | Public by morning | 1 step |

Local chief here is Dutch already watching: past the first step he takes the car keys "for safekeeping" (the team walks the field road) and the sheriff's office closes to them.

## Fights

| Fight | Kind | Skulls | Where / when | Enemy card |
| --- | --- | --- | --- | --- |
| **The porch** (human) | 4 frightened townsfolk: a man with a tire iron, his brother with a gas can, a woman with a shotgun she doesn't want to fire, a teenager filming | 2 | Odile's porch, night 2 before 3:00, only if the fish fry boiled | Human, flee at half HP; Persuade's Lean on them ends it at the start |
| **The Static** (unnatural) | A shape made of radio hiss that stands up out of the booth's speakers when the cart plays: a man's outline in grey snow, too many mouths | 2 | The booth, day 2 or night 2, when the cart is played | HP 22, DEX 12, 45%, 1d4, all-target "feedback" 0/1 SAN; weak: silence (unplugging the board stuns it a round) |
| **Roamers** (danger zone, the cane, night 2) | `listener` (a townsperson from 1979, made of cane trash and wire, an old transistor radio for a head, walking the rows) ×2, and `rowhand` (taller, scythe-handed) ×1, guarding: the direction finder in the ditch (a clue shortcut to `trace`), the field road shortcut to the radials, Wade's lost boot (a trace of the missing), the Lantern Box at the pump shed | 1–2 | The cane, night 2 | HP 8–16, unnatural, lightshy, hears loud actions at double range; drop 20% |
| **Boss: The Night Line** | The host, risen: a tall thin figure in Emile's short-sleeved shirt and tie, his head an old desk microphone with the grille breathing, cords running from its back into the radials, the missing standing behind it | 3 | The radial field, night 2 (Go in / Not yet at the circle's edge) | below |

### The boss: The Night Line

- **Base:** 60 HP, DEX 10, 55%, 1d6 (cord lash), all-target "callers" 1d3 + 0/1d3 SAN (gone if `burn`), "dead air" (one agent can't act next turn unless they pass POW×5). Tags unnatural, lightshy. Weakness (Identify): **silence**: a keyed dead carrier, or a radio turned to static and held up, stuns it a round once per fight; fire on its cords does double.
- **Phase 1 (on the air):** it talks in Emile's voice between attacks; every round a missing person sinks: after round 6 one is lost.
- **Phase 2 (at half): it signs off and stops pretending.** The voice becomes everyone's, DEX 13, and a shield (half damage) unless Emile's name was said on the air (`name`).
- **Weakening choices:** `burn`: no callers; `crystal` keyed: no one new walks in and its first dead-air fails; `name`: no shield; the Identify weakness is free if `ebooth` was found. All taken: 5–8 rounds. None: 8–12 (tools/boss-sim.js against the Gleaner's numbers, part B).

## Horrors (inside 6–10 net SAN)

| Horror | Tier | Kind | Tags |
| --- | --- | --- | --- |
| The first broadcast: a voice says a name you know (night 1) | Disturbing | unnatural | subj: voices (the phobia subject) |
| Darlene's note, TURN IT OFF, in a hand that gets bigger | Unsettling | helplessness | |
| The 3/9/79 cart played back | Severe | helplessness, violence (off screen) | subj: voices |
| The booth's guest mic, seen High (hidden hotspot) | Unsettling | unnatural | |
| A listener in the rows, radio to its ear, turning to look at you | Disturbing | unnatural | |
| The radial field: the missing, ankle-deep and listening | Shattering (0–1) | unnatural | all |
| The Night Line | Boss | unnatural | known after Identify |

Phobia subject: **voices** (a voice you can't place that knows your name). Trigger tags: Toby is a liar (Paranoia); the cane at night is dark (Nyctophobia).

## Motivation moments

1. **Protect the innocent:** Miss Odile, her porch and her radios, at the fish fry and on night 2 (`odile`).
2. **Faith:** Pastor Ellis at the fish fry (`faith`), and, if the agent prayed with the room, a line from him at the debrief.

## The hidden hotspot (Mushrooms)

- **Where:** KHLT's broadcast booth, the **guest mic** on its arm at the right end of the board (the second mic, the one nobody used). Placed in part A on the board's right end.
- **Shows only** while the lead is High on Mushrooms. Sober, it's a dusty mic.
- **What it is:** seen High, the mic's foam is wet and it breathes, slow, like someone asleep with their mouth near it. In the booth's window glass, a thin man in headphones sits at the board, his hands flat on the faders, and turns his head toward you without moving his eyes. On the program log under the mic, in fresh pencil: *"3:00 · E.B. · STILL ON."*
- **What it gives (part B):** clue `ebooth`: the host is wearing Emile, so the night-2 call-in can say his name without `emile`; the boss's Identify weakness is free. Seeing it is an Unsettling horror (unnatural). Part A stand-in: a narration placeholder only.
- **Where the Mushrooms are:** Remy's "pasture caps", dried, in a paper sack in the bait cooler (they grow in the cow pasture past the cane; look-alike name on the sack: "SWAMP CANDY"). In part B: from Remy (Persuade), or the feed store's bait cooler (Search, while Lucien's in the back). **Part A stand-in:** one dose in the feed store's bait cooler (Search), open on both days, so the reveal can be tested. (The booth opens in part A's stand-in from day 2; the dose can be carried there.)

## Items

- **Lantern Box** (1): the pump shed at the cane's west edge, night 2, guarded by a rowhand: Road flare, First-aid kit, Flashbang.
- **Loot table** (5): Energy drink, Cigarettes, Road flare, Painkillers, Coffee (a gas station cup).
- **Case-only items:**
  - **The 3/9/79 cart** (unnatural, Evidence): *"A broadcast cartridge, DO NOT AIR on the label in red grease pencil. Taped inside the case, a page of ruled ledger paper, older and red-lined, numbered in the corner: 6."* **The key evidence item; carries the page fragment (arc hook: the page).** If it's burned (`burn`), the page goes into Big Hat's hand at the debrief anyway: it was taped to the case, not the tape ("Records wants it by Monday"). Bag or hide.
  - **The 1340 crystal** (unnatural, Tool): a quartz crystal in a little metal can, warm to the touch, humming when held near a radio. Bag or hide.
  - **Emile's headphones** (ordinary, Keepsake): from the record room; give them to Miss Odile at the debrief for +1 to the Protect the innocent agent's Bond.
  - **Direction finder** (ordinary, Tool; the new generic candidate for the shared item list): a handheld loop antenna with a needle. Field: Trace at +20. Found in the cane's ditch, or the sheriff's evidence shelf (Bureaucracy).
  - **Swamp Candy** (Mushrooms, Drug).

## Arc touches (quiet; never in public text)

- **The page:** taped inside the cart's case, numbered 6 (above). Bagged → Records.
- **The cameo (one, optional):** at the fish fry, at the edge of the yard by the pot, a tall man in an old deacon's coat with a ledger under his arm, eyes closed, turned toward the hall. Mama Lou doesn't see him; when the agent looks back he's gone. Lead agent SAN 0/1 if it's their first sighting ever. Only if part B has room; never named.
- The eleven trucks didn't sign anything. The Almoner wasn't there in 1979; the Carrier is its own thing. Nothing more is said.

## Endings

| Label | What it means |
| --- | --- |
| `clean` | The Night Line is ended, Emile's name was said on the air, both missing (and Lucien) walk out of the circle, Odile is safe, and the tower's red light goes out at dawn. Odile asks the parish to dig up the circle, and they do. |
| `costly` | The Night Line is ended, but someone in the circle was lost, or Odile was hurt, or the fish fry boiled and somebody's house burned. The tower comes down that spring. Nobody talks about it. |
| `worst` | 3:33 comes first, or the team falls back: the show names the whole parish on the next night. Halcott's radios go quiet a week later, all at once. |

## Big Hat's briefing

- **Place (spec 020):** a bait shop's back porch off I-10, a crawfish pot steaming on a propane burner, a radio on the rail unplugged on purpose, its cord wrapped round it. He sits on a cooler. Live bait tanks bubble.
- **The four topics** (two get asked; each an INTEL note and a small edge, spoiler-free):
  - **The station** — "KHLT. Off the air since '79. Tower never came down. Now it comes on at three in the morning, and it's got callers." Edge: +10% Computers to trace the signal.
  - **The missing** — "Two named on air, two gone. A grandmother and a pipefitter. Their families'll talk to a badge." Edge: +10% Empathy with the families.
  - **The sheriff** — "Dutch Fontenot. Called it in himself, which sheriffs don't. He'll help while the town's calm." Edge: Overstepping's first mark is forgiven once.
  - **The town** — "Two thousand people and every one of 'em owns a radio. They're scared, and they're lookin' for somebody to be scared of." Edge: +10% Persuade at the fish fry.

## Part B build notes (Developer, Nov 23, 2026)

What part B settled while building. Where these and the sections above differ, these win.

### Turning the day (points of no return)

Every turn is at the team's car on Main Street (or the porch radio on night 1), a Go on / Not yet with the cursor on Not yet.

| Turn | Needs | Line naming what closes |
| --- | --- | --- |
| Day 1 → night 1 | Checked in with Dutch | The shops, the sheriff's office and both houses close for the night. |
| Night 1 → day 2 | The show heard | Toby's night shift and Miss Odile's porch at three in the morning are tonight only. |
| Day 2 → night 2 | 3 threshold clues, the fish fry, the deduction | The fish fry ends, and the tower by daylight is gone for good. |

Night 2 starts on Main Street at 11:40 PM. Other things a choice closes, each with its own Go on / Not yet:
- Driving out to KHLT while the fish-fry crowd stands at Miss Odile's: nobody stops them (her house burns).
- Walking north into the cane before hearing the second show in the booth: you'll hear it out there, but can't answer it.
- Burning the cart: it's evidence; once it's ash it's ash.
- The radial field: Go in / Not yet at the cane's edge (part A). The boss stands at the circle's north end; talking to it, or stepping onto the three tiles in front of it, asks Go in / Not yet. The missing, the radial wires and the way out are all reached without crossing that row.

### The soft clock (`fear`, the town getting meaner)

+1 each: reading the whole 1979 microfiche reel by hand at the sheriff's office (the no-skill way to `names`; free once Marcy told you about Wade's granddad), sitting up with Miss Odile after the first show (the no-skill way to `emile`), a nap in Remy's truck on day 2 (a full rest), the wrong deduction, walking Miss Odile to the church hall on night 2 (the Protect the innocent moment). Pulling the radios (`unplug`) takes 1 off. Each point is −10 to calming the fish fry. `fear` 3 or more blocks `clean`. Never progress.

### The broadcasts, as built

- **Night 1** (Miss Odile's porch radio; the porch is a cutscene, so all three roll): sign-on; caller 1 asks for a song for the Hebert boy out in the rows; caller 2 reads a gumbo recipe that turns into a list of names; caller 3 says "Lucien Arceneaux. You know what you took." Horror `show1`, Disturbing, unnatural, subj voices. Then **one thing**: Trace it (Computers Trace, or Craft Fix it "string a loop antenna"; +20 with the direction finder, +10 with the station intel), Record it (Science Sample or Computers Crack it, labelled Record it; the pocket recorder does it with no roll), Call in (Miss Odile's kitchen phone, the station's old request line on an index card by it; no roll: `voices`, the lead is **Named**, 1/1d4 SAN), or Just listen. A failed roll is the one thing spent. Sign-off at 3:33: breathing.
- **Night 2** (in the booth, the first time the team walks in on night 2; a scene): the host reads a roll call: every name in the church hall if the fish fry boiled, only the eleven families' grandchildren otherwise, fewer again if the radios were pulled (`unplug`); a Named lead hears their own name (Unsettling, 0/1). The callers are the trucks; the last caller is Royce asking his daughter to come home. One thing: Trace it again (the same skills: it's coming up the ground system; opens "follow the ground wire" at the tower gate, straight to the circle's edge, and gives `trace` if missing), Call in on the booth phone and **say Emile's name on his own air** (needs `emile` or `ebooth`; no roll; `name`), or let it play. Record isn't offered (the tape plays back only hiss).

### Clue routes (so every team template reaches 3 of trace, voices, log, names, emile)

- `trace`: night 1 Trace; night 2 Trace in the booth; the direction finder in the cane's ditch on night 2 (the needle swings north and stays).
- `voices`: night 1 Record or Call in; playing the cart on day 2 or night 2.
- `log`: the record room cabinet (Dig records, Paper trail, Sweep); Dutch's 1979 incident file on day 2 (Credentials; or no roll once Joelle has told you her grandfather hosted the Night Line).
- `names`: the sheriff's microfiche reader (Dig records, Paper trail, Sweep; or read the whole reel, fear +1 unless Marcy told you); Mama Lou at the fish fry (Read).
- `emile`: Miss Odile, day 1 or 2 (Read, Calm, Talk your way in); sitting up with her after the night-1 show (no roll, fear +1); Mama Lou at the fish fry (Read).
- `cart` (extra): the 3/9/79 cart is in the record room behind the program logs (Sweep, Dig records, Identify "the one that's cold", or no roll once you hold `log`). Played on the booth's cart machine (Fix it, Crack it, Sample) it gives `cart` (and `voices`), a Severe horror for all three, and the Static fight.
- `ebooth` (extra): the hidden guest mic, High on Mushrooms.

Deduction's right answer: (`emile` or `ebooth`) and (`log` or `names`). Half (Lucien): needs `names`.

### The deduction, as built

At the church hall, after the fish fry, the kitchen phone rings (Big Hat) once the team has 3 threshold clues; until then it rings when they come back with three. Right: Big Hat: "Then give him his name back." Half: Dutch takes Lucien into the holding cell for the night (he doesn't listen; he's safe), and the crystal stays in his safe unless the team asks him at the cell (no roll). Wrong (prankster): fear +1, and the cane's roamers are already up on night 2 (no On guard or Pathfinder roll).

### The fish fry, as built

Entering the church hall on day 2 plays it. Ray Dupuis (a pipefitter, Wade's cousin) climbs on a folding chair. The lead's options, each once: Calm the room (Empathy Calm) → calmed; Talk the room down (Persuade Talk your way in) → calmed; Read them a federal order (Bureaucracy Paper trail) → calmed; Lean on Ray (Persuade Lean on them) → pointed; the pastor's moment (shows when someone holds Faith; no roll; Pray with the room / Tell him it's no devil, only men) → pointed, Faith holders regain SAN, and Mama Lou has gone home before you can talk to her (the cost: her clue routes); Fire a shot into the ceiling (Firearms Shoot it open) → the room scatters, a public overstep, and it boils; Let it go → boils. Every roll is −10 per `fear` point, +10 with the town intel. All failed → boils. Mama Lou (in the hall after the scene): Read → `names` and `emile` if missing, and who drove which truck.

Boiled: on night 2 a crowd (a man with a tire iron, his brother with a gas can, a woman with a shotgun she doesn't want to fire, a teenager filming) stands at Miss Odile's steps. Lean on them (once) ends it; Fight is the human story fight (2 skulls; they run at half HP; the teenager films it: a public overstep); driving away leaves them to it (her house burns). Walking Miss Odile to the hall first (the Protect the innocent moment) leaves them an empty porch: they go home.

### Lucien and the crystal

Named on night 1. Day 2 in the feed store: Talk your way in, Calm, or Read (+20 once Toby told you about "the Arceneaux boy") and he promises to keep the shop radio unplugged tonight (`lucien` safe) and gives you the crystal out of the safe. Break the safe yourself (Force it, Fix it: seen by Lucien) for the crystal without his promise. The half deduction makes him safe and the crystal is his to give at the cell. Not safe by night 2: he's the third person in the circle.

Keying a dead carrier: the crystal back in the transmitter on night 2 (the booth's transmitter window: Fix it or Sample; once). `carrier`.

### Fights and the boss, as built

- **The porch** (human, 2 skulls): `tireiron` 9 HP, `gascan` 8, `shotgun` 8 (40%, 1d6), `filmer` 5 (doesn't attack; films); each runs at half HP.
- **The Static** (unnatural, 2 skulls): 24 HP, DEX 12, 50%, 1d4+1, feedback at everyone 1d2, a SAN move 0/1. Weak: silence: the static radio from Miss Odile stuns it a round (once a fight). It's part of the cart's horror, so no horror on sight of its own.
- **Roamers** in the cane on night 2: two `listener`s guarding the direction finder in the ditch and Wade's boot (Track: it marks the way to the circle), and a `rowhand` guarding the Lantern Box at the pump shed. Unnatural, lightshy. Search's On guard and Survival's Pathfinder show their beats on arrival (not after the wrong deduction). A Loud fight out there is an unseen overstep roll.
- **The Night Line** (boss): numbers in the case code and tools/boss-sim.js. Phase 1: lash, callers (at everyone; gone if `burn`, a hiss instead), dead air (one agent loses their next turn unless they pass POW × 5; with `carrier` the first one fails). At half: it signs off and stops pretending: more callers and lashes, and it pulls the voices in and heals unless `name` (the case file said a shield; a heal tunes the same and needs no new battle rule). The circle: from round 7, unless `carrier`, it takes one person still listening (lost; Severe helplessness for all). Weakness (Identify; free if `ebooth`): silence (the static radio stuns it once a fight) and fire on its cords (tag burns). HP cuts: `burn`, `name`, `carrier`.
- Before the fight, each missing person can be woken by taking their radio (no roll; Disturbing helplessness for the lead, once): woken, they can't be taken.

### Items, as built

- Case-only: the 3/9/79 cart (unnatural, Evidence, page 6), the 1340 crystal (unnatural, Tool), Emile's headphones (ordinary, Keepsake: the record room's Sweep; given to Miss Odile at dawn, +1 to a Bond of each Protect the innocent holder), the direction finder (ordinary, Tool: the sheriff's evidence shelf, Paper trail or Credentials, or the cane's ditch), Miss Odile's static radio (ordinary, Tool: battle, the Static or the Night Line is Stunned a round, once a fight; she gives it with `emile`), gas station coffee (ordinary, Drink: +1d4+1 WP; Toby). Swamp Candy is the shared Mushrooms item (the feed store's bait cooler, Sweep; or Remy, Talk your way in or the cash).
- If the cart was burned, the page reaches Big Hat anyway (taped to the case, not the tape).
- Toby (a liar: Paranoia) on day 1 and night 1: Read or Calm gets "they said the Arceneaux boy" out of him.

### Cover stories

- Paper it (Bureaucracy): the old transmitter came live off the new irrigation line; the FCC seals it.
- Sell it (Persuade): a pirate broadcaster with old station tapes; +20 with `log`.
- Weak (Luck): kids with a CB radio and a grudge. Clean books: equipment fault, filed in 1979.

### Endings, as built

- `clean`: the Night Line ended, `name` said, nobody taken by the circle, Miss Odile's house standing, `fear` under 3, no agent lost, overstepping below Agency call.
- `costly`: ended any other way.
- `worst`: none since Nov 24, 2026 (the Federal agents used to shut the case down; now they're a fight and the case goes on).
