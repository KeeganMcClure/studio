# SECRET CASE FILE: Good Manners (FILE 02)

**Spoilers. For the Developer only.** Written Nov 23, 2026 by the Developer from spec 010's frame, the bible and the arc file's hidden hooks for regular cases. Never quote or summarize this file in the bible, specs, changelog, To do, commits, PR text or chat. Keegan plays it blind.

Public frame it fills in: `games/black-lantern/specs/010-good-manners.md`. Where this file and the spec disagree, the spec wins on structure (counts, maps, budgets); this file wins on what things are.

## The truth (what is really going on)

- **The town.** Odessa Flats, Kansas, pop. 900 on the sign. The grain co-op is closing at the end of the season, the school is down to one combined class, and every family has a kid in Wichita or Kansas City who isn't coming back. The county fair is the last thing that still fills the town.
- **The signer.** **Arlen Voss**, 64, owns the grain co-op and runs the fair board. Last April, at his wife's grave, a courteous tall man with a book offered him the one thing he wanted: *"Odessa Flats keeps its nine hundred."* He signed. He thought it meant jobs, or a factory, or luck. (Arc: Voss is an account. The tall man is the Almoner, never named here.)
- **What the deal sent.** Two **Tenants in training**, lesser things on loan to the Ledger, sent to *keep the town's nine hundred* the only way they can: by becoming them. They arrive empty, so they have to learn people first. They wear what they think a respectable man wears (black suits, dark glasses, from a 1960s catalog photo), sleep standing up, and speak like they learned English from a penmanship primer, because they did.
- **How they learn.** A Tenant chooses one person and watches them, for hours, from across the street. It copies them into a schoolchild's copybook, line by line: how they laugh, what they say to the dog, how they sign their name, what they dream. When the copy is perfect, the lesson is "learned" and the original isn't needed any more: **they stop breathing in their sleep**, with their eyes open and a small polite smile, as if they'd been excused.
- **Why it matters.** Each learned person goes into the Tenants. On the fair's last night, at the grandstand, the two men mean to **graduate**: walk out of the dark under the stadium lights wearing every face they've learned, and stay. After that, Odessa Flats keeps its nine hundred forever, and a little more of it is them every year. Three are learned already. The fourth lesson is nearly done.
- **Their rules (the internal logic).**
  1. They can only learn someone they can **watch**. Break their line of sight (draw the curtains, move the person, stand in the way) and the lesson stalls.
  2. A lesson only completes **in the subject's sleep**. Keep the subject awake through night 2 and the lesson fails.
  3. They are bound by **manners**. They never enter a house uninvited, never interrupt, always answer a direct, polite question with the truth (in their broken way), and must return a greeting. Rudeness confuses them; they stall to look up the right reply in the copybook.
  4. Without the **copybook** they can't hold what they've learned. Take or burn it and they forget lessons.
  5. They have **no eyes**, no body heat and no shadow. The glasses hide empty sockets of smooth skin. Bright light makes them flinch (they've no lids to shut).

## The cast (public names, sprites already drawn in part A)

| Who | Role in the story | Weird trait (1 in 3) |
| --- | --- | --- |
| **Sheriff Marlene Toft** | The Local chief. Practical, tired, loyal to the town. Escorts the agents from scene one, watches over their shoulder. Knows the men are wrong, can't arrest a suit for standing on a sidewalk. Will warm up with Bureaucracy and honesty. | none |
| **Deputy Cal Brandt** | Young, scared, eager. Saw one of the men take its glasses off. Has told nobody. Liar tag: he says he saw "nothing". | none |
| **Dr. Ines Abernathy** | County coroner, clinic basement in Plainview, two towns over. Dry, exact, unnerved. The three dead had nothing wrong with them. | none |
| **Rhonda Kuehl** | Diner waitress (the Wheat Kernel Diner). Knows everyone, refills without asking. Served the men coffee: they watched it go cold. | a beehive so tall it holds three pencils and a lighter |
| **Dusty Lamarr** | Carnival worker, runs the spinner ride. Sells "tea" on the side (the case's Mushrooms). Rides turn on their own after close; he quit sleeping in the trailer. | one gold tooth, and a parakeet that rides on his shoulder |
| **Jolene Peck** | Mom on Elm Street. Her house is being watched now. Brave and angry and exhausted. Liar tag: she says Tanner's been sleeping fine. | none |
| **Tanner Peck** | 9. The fourth lesson. The men asked him, politely, how he laughs. He's been practicing *for* them. | none |
| **Orvel Danner** | Runs the one-pump gas station. Old, slow, sees everything from his lawn chair. The men's car never once bought gas. | a chicken named Doris that rides on his shoulder |
| **Arlen Voss** | Co-op owner, fair board president. Signed the deal. Hosts the fair's last night at the grandstand. Polite, generous, frightened. Liar tag: everything. | a grin a little too wide, which he can't stop |
| **Mr. Doe and Mr. Roe** | The two men (tab names `MR. DOE`, `MR. ROE`, the names they took off blank government forms). Doe talks; Roe repeats the end of Doe's sentences a beat late. | it's them |

The three dead: **Hal Grissom** (72, retired, played harmonica on his porch), **Darla Meeks** (41, the school's one teacher), **Pastor Gene Ostrow** (58). All on Elm Street or near it; all in the last month.

## The maps (part A places them)

| Map id | Name on screen | When | What's there |
| --- | --- | --- | --- |
| `main` | MAIN STREET | every phase | Diner (door), sheriff's office (door), motel (office door + room 6), gas station with one pump, grain co-op front with elevator behind, water tower, blinking traffic light. The agents' car (drive to the morgue by day, the fair on day 2 and night 2). The road east to Elm and Third. |
| `elm` | ELM AND THIRD | every phase | Four ranch houses; the Peck house (watched, the curtains). The tinted black car parked across the street. The Grissom porch (harmonica on the rail). **The hidden hotspot** (below). |
| `office` | SHERIFF'S OFFICE | every phase | Toft's desk, a holding cell, the file cabinet (Bureaucracy). |
| `diner` | WHEAT KERNEL DINER | every phase | Counter and stools, booths, Rhonda. The men's booth: two cold coffees. |
| `motel` | ROOM 6 · PRAIRIE REST MOTEL | every phase | The agents' room (rest; turning the day). The men are in room 7 next door (part B: a stakeout). |
| `morgue` | COUNTY MORGUE · PLAINVIEW | day only | Abernathy, three drawers, the file desk. Closes for good when day 2 turns to night 2. |
| `fair` | COUNTY FAIRGROUND | day 2 (day), night 2 (night, danger zone) | Midway with booths, the Ferris wheel, the spinner, the livestock barn, the grandstand with its gate to the finale. |
| `under` | UNDER THE GRANDSTAND | night 2 | **The finale area.** Beneath the bleachers, the men's schoolroom: folding chairs in rows, a chalkboard, the dead's belongings set out like show-and-tell. The boss waits here (go in / not yet at the last step). |

## The hidden hotspot (Mushrooms)

- **Where:** Elm and Third, on the sidewalk across from the Peck house, the exact spot where the men stand. Placed in part A at the curb by the black car.
- **Shows only** while the lead is High on Mushrooms (bible Item list: hidden unnatural hotspots show). Sober, it's just pavement.
- **What it is:** where they stand, the air is written on. Faint chalk-white handwriting hangs in the air between the curb and the Peck window, the lesson in progress: *"TANNER. LAUGHS AT: THE DOG. HIS MOTHER WHEN SHE IS TIRED. HIS OWN NAME SAID WRONG."* and, below it, ruled lines waiting, with *"TO BE LEARNED BY: SUNDAY, IN SLEEP."*
- **What it gives (part B):** clue `lesson`, which proves rules 1 and 2 (they learn by watching; it completes in sleep) and that Tanner is next. It counts toward the threshold and unlocks the "keep him awake" plan without the deduction. Seeing it is an Unsettling horror (unnatural; `subj: handwriting` none). Part A stand-in: a narration placeholder only.
- **Where the Mushrooms are:** Dusty sells "fair tea" from behind the spinner (day 2, Persuade or cash), and one dose sits in a baggie in the livestock barn's tack box (Search). Part A stand-in: one dose in the barn's tack box, so the reveal can be tested.

## Clues (threshold plus bonus: 3 of the town clues open night 2)

| ID | Where | Skills | What it proves |
| --- | --- | --- | --- |
| `dead` | Morgue, Abernathy and the drawers | Forensics (Examine), Medicine, Persuade | The three died of nothing, eyes open, smiling; each had a schoolchild's pencil callus pattern burned faint on the right hand, *like someone traced them*. Proves the deaths are one cause, not natural. |
| `watch` | Jolene Peck, Elm Street | Empathy (Read: her liar tag), Persuade | The men have stood across from her house three nights; they asked Tanner how he laughs; Tanner has stopped sleeping well and talks in his sleep in their voice. Proves who is being watched now. |
| `room7` | Motel, Room 7 (break in, ask the clerk, or Bureaucracy on the register) | Search, Bureaucracy, Force it (oversteps, seen) | No bed slept in. A copybook practice page: Hal Grissom's signature written 300 times, getting better. Proves they're learning people, by hand. |
| `car` | The black car on Elm | Search, Forensics, Computers (plates) | No engine heat at noon, no VIN, plates registered to a 1962 Ford destroyed in 1971. Proves they aren't federal and aren't ordinary. |
| `roll` | Sheriff's office file cabinet / the co-op | Bureaucracy, Computers, History | The co-op's April "community roll," typed by Voss: every resident of Odessa Flats, 900 names, with three crossed off in the same pencil. Proves Voss is connected. |
| `deal` | Voss himself, at the co-op or the fair (day 2) | Persuade (Lean on), Empathy (Calm), Occult (Read the room) | Voss's confession: he signed for the town to "keep its nine hundred". Proves why. Bonus clue (weakens the boss's last phase; opens the clean ending's cover story). |
| `lesson` | The hidden hotspot (Mushrooms) | none (High only) | See above. Bonus, or counts toward the threshold. |

Bonus effects: each clue past 3 adds intel to Big Hat's debrief; `deal` and `lesson` each also weaken the boss (below).

## The deduction (before night 2, never a dead end)

At the sheriff's office, Toft asks: **"So what are they?"** Options:
1. "Federal. Somebody else's program." (wrong: costs time; Toft stops helping for the night, so you reach the fair late and Tanner's watchers start ahead: the `kept` choice needs a roll instead of being automatic)
2. "They're learning people. The Peck boy is next." (right: needs `watch` plus `room7` or `lesson`; Toft posts Cal at the Peck house and the keep-him-awake plan starts free)
3. "Arlen Voss is killing them." (half right: needs `roll`; Toft confronts Voss, who lies; you lose `deal` unless you get it from him yourself on day 2)
Wrong answers cost time or a better ending, never progress: night 2 opens either way once 3 clues are found.

## Choices that matter (remembered for the boss and debrief)

- **`kept` Keep Tanner awake through night 2** (Protect the innocent motivation moment): by the Ferris wheel on night 2, Tanner has wandered off "to show them his laugh". Get him down (Athletics or Persuade or Empathy's Calm) and hand him to Jolene with an energy drink or coffee. Kept: the fourth lesson fails; the boss loses its fourth face (−10 HP, no Mimic move). Not kept: Tanner sleeps in the truck; the costly ending at best.
- **`book` Take the copybook** from room 7 on night 1 (stakeout) or from the schoolroom before the boss: Search or Stealth. Taken: the boss forgets its learned voices (no SAN move in phase 1). Read aloud (Find the truth motivation moment; Occult or History): the dead's names on the record; the boss can't hold phase 2 (−8 HP and the phase-2 heal is lost).
- **`lean` Lean on the co-op night men** (the human fight): Persuade's Lean on stops it before it starts.
- **`voss`** what you do with Voss on night 2: let him sit it out, cuff him (Toft), or make him tear up his copy of the deal (needs `deal`; History/Occult: speak the debt aloud; weakens the boss −6 HP).
- **`photo` / overstepping** as below.

## Overstepping (open case: Local chief first, then Agency call, then Federal agents; extreme flag off)

Each mark says how public it is. Toft watching makes most of them **seen**.

| Act | Public? | Mark |
| --- | --- | --- |
| Force room 7's door | Seen (the clerk, the street) | 1 step |
| Search the black car without Toft | Seen if day (Orvel), quiet at night | 1 step by day |
| Pull a gun on the men (Elm and Third, or the fair by day) | Seen | 1 step |
| Take the bodies' hands off for prints at the morgue | Quiet (Abernathy says nothing) | none |
| Break into the co-op office | Quiet at night, seen by day | 1 by day |
| Fire in the fairground crowd (night 2) | Seen | 1 step |
| Cuff Voss without Toft | Seen | 1 step |

Local chief here: Toft takes the badge talk off the table for the rest of the day (Persuade at −20 in town). Agency call: Big Hat. Federal agents: the clean-up crew, a very hard fight, then the case goes on at Local chief, as in every case.

## Fights

| Fight | Kind | Skulls | Where / when | Enemy card |
| --- | --- | --- | --- | --- |
| **Co-op night men** (human) | 2 men with tire irons and a flashlight, paid by Voss to keep "the feds" off the elevator | 2 | Main Street, co-op front, night 1 | 2 × `nightman`: HP 11, DEX 11, 50%, 1d4+1, tags human living; weak: human (flashbang, badge); **Lean on** (Persuade) ends it before it starts |
| **The Understudies** (unnatural) | Practice copies the men made of the first lessons: people-shaped, suit cloth over dry grain dust, faces drawn on in pencil | 2 | Elm and Third, night 1 (they come out of the Grissom house to stand where the men stand) | 2 × `understudy`: HP 12, DEX 9, 45%, 1d3+1, tags unnatural burns; resist shaken; weak: fire; SAN move "it laughs in Hal Grissom's laugh" 0/1d2 |
| **Roamers** (danger zone, fairground night 2) | `usher`: faceless fair ushers in vests, each guarding: the copybook trail (clue), the barn shortcut, Tanner at the Ferris wheel (person), the Lantern Box | 1–2 each | Fairground night 2 | HP 10–14, unnatural, lightshy; drop 20% from the loot table |
| **Boss: The Graduate** | The two men folded together into one tall figure in a suit too long in the arms, its glasses gone: a smooth blank where eyes should be, and over it, in turn, each face it learned | 3 | Under the grandstand, night 2 (go in / not yet) | below |

### The boss: The Graduate

- **Base:** 62 HP, DEX 11, 60%, 1d4+2, all-target 1d3 ("it recites the class roll"), SAN move. Tags unnatural, lightshy. Resists stun2, poison, bleed. Weakness (Identify): **light**, "no lids to shut: a flare or flashbang staggers it; it must answer a question put to it politely" (Persuade's battle status move stuns it once per fight).
- **Phase 1 (polite):** it introduces itself in four voices; Mimic: it uses the lead's own voice to order a teammate (a teammate loses their turn) unless `kept`.
- **Phase 2 (at half):** the faces come loose; it heals 8 unless `book` was read aloud; all-target attacks rise.
- **Weakening choices:** `kept` −10 HP and no Mimic; `book` taken: no SAN move in phase 1; `book` read aloud: no phase-2 heal and −8; `voss` tore up the deal: −6. `lesson` found: Identify is free (no roll). All taken: 38 HP, no Mimic, no heal.
- **Tuning target:** 8–12 rounds for a careful Field Team that skipped every choice, 5–8 with all made (tools/boss-sim.js, against the Gleaner's numbers).

## Horrors (inside 6–10 net SAN)

| Horror | Tier | Kind | Tags |
| --- | --- | --- | --- |
| The men turn their heads at the same time, Elm and Third, day 1 | Unsettling | unnatural | |
| The dead's smiles in the morgue drawers | Unsettling | helplessness | gore (Hardened skips it) |
| The copybook page: Hal's signature 300 times | Disturbing | unnatural | liar (Cal, Jolene, Voss are liars: Paranoia triggers) |
| One of them takes off its glasses (night 1) | Severe | unnatural | |
| The hidden lesson in the air (Mushrooms) | Unsettling | unnatural | |
| Tanner laughing in their voice on the Ferris wheel | Severe | helplessness | lead only (a map moment) |
| The schoolroom, show-and-tell of the dead | Shattering | unnatural | all |
| The Graduate | Boss | unnatural | known after Identify |

## Motivation moments

1. **Protect the innocent:** getting Tanner off the Ferris wheel and keeping him awake (`kept`).
2. **Find the truth:** reading the copybook aloud under the grandstand (`book`).

## Items

- **Lantern Box** (1): in the livestock barn's hayloft on night 2, guarded by an usher: Road flare, Flashbang, First-aid kit.
- **Loot table** (5): Energy drink, Cigarettes, Road flare, Painkillers, Firecrackers.
- **Case-only items:**
  - **The copybook** (unnatural, Evidence): *"A school copybook, GOOD MANNERS on the cover in careful capitals. The last pages are a different paper, older and ruled in red, numbered in the corner: 2."* **This is the key evidence item and carries the page fragment (arc hook: the page).** Big Hat files it at the debrief: "Records wants it by Monday."
  - **Hal's harmonica** (ordinary, Tool): battle, one use: the Understudies stop to listen (Stunned one round).
  - **Fair tea** (Mushrooms, Drug): from Dusty or the barn.

## Arc touches (quiet; never in public text)

- **The page:** the copybook's back pages, numbered 2 (above). Bagged → Records.
- **The cameo:** on night 2, at the edge of the grandstand crowd under the lights, a tall man in a long coat with a book under his arm, who isn't there when you look back. Lead SAN 0/1 if it's the team's first sighting (Still Harvest's cameo counts).
- **Voss** is an account. If the agents make him tear up his copy of the deal, his line is: "He was so kind about it." Nothing more.

## Endings

| Label | What it means |
| --- | --- |
| `clean` | The Graduate is unmade, Tanner wakes up Monday and laughs his own laugh, nobody else dies. The fair closes on time. Voss resigns from the fair board. |
| `costly` | The Graduate is unmade, but Tanner didn't wake up, or the agents lost someone, or the crowd saw the fight. The sign stays at 900 a while longer than it should. |
| `worst` | The men graduate: two new residents move into Odessa Flats, with faces the town knows. |

## Big Hat's briefing

- **Place (spec 010):** the cab of a parked combine behind a truck stop off I-70, dusk, the fair's lights far off across the wheat. He's in the driver's seat; the agents squeeze onto the step and the buddy seat.
- **The four topics** (two get asked; each an INTEL note and a small edge, spoiler-free):
  - **The town** — "Odessa Flats. Nine hundred people and a sheriff named Toft who'll smell you coming." Edge: +10% Persuade with Toft.
  - **The two men** — "Nobody's got a picture. Every photo of 'em came back blurry, and every one blurred the same way." Edge: the black car shows on the Case file's Next line from the start.
  - **The dead** — "Coroner's in Plainview. She called it natural three times and didn't believe it once." Edge: +10% Forensics at the morgue.
  - **The fair** — "Last week of the county fair. Everybody in that town'll be in one place on Saturday night. So will they." Edge: the fairground's map shows the Lantern Box marked on night 2.

## Part B build notes (Developer, Nov 23, 2026)

What part B settled while building. Where these and the sections above differ, these win.

### Turning the day (points of no return)

All three turns happen at the motel bed in room 6, each a Go on / Not yet with the cursor on Not yet:

| Turn | Needs | Line naming what closes |
| --- | --- | --- |
| Day 1 → night 1 | Checked in with Toft | The morgue and the diner close for the night, and the Pecks go in. |
| Night 1 → day 2 | nothing | Tonight's stakeout and the co-op's night men are tonight only. |
| Day 2 → night 2 | 3 town clues and the deduction | The county morgue closes for good, and so does the fair by day. |

The gate under the grandstand is a plain walk in and out. The boss waits at the front of the schoolroom: talking to the men, or stepping onto the two tiles in front of them, asks Go in / Not yet. The desk, the show-and-tell table and the chalkboard's ends are reachable without crossing that spot.

### The soft clock (`late`)

Each of these adds 1 to `late`: the drive to the county seat for records, the room 7 stakeout on night 1, and the wrong deduction (federal). On night 2, getting Tanner down from the wheel is free (Jolene calls him) when the deduction was right or the lesson was seen, and `late` is under 2. Otherwise it takes a roll: Climb and jump (Athletics), Talk your way in (Persuade) or Calm (Empathy), each once. Never a dead end: failing them all only loses `kept`.

### Clue routes (so every team template reaches 3)

- `dead`: the drawers (Examine, Forensics; Sweep, Search through the effects bags) or Abernathy (Talk your way in, Persuade). The intel "The dead" adds +10 Forensics here.
- `watch`: Tanner tells you himself, no roll (kids notice first). Jolene's Read or Calm adds her side.
- `room7`: room 7's door: the register (Paper trail), the clerk's key (Credentials), slipping in behind the maid's cart (Sneak), the cash roll, or Force it / Shoot it open (overstep, seen / public).
- `car`: Examine (Forensics), run the plates (Crack it, Computers), pop the hood (Fix it, Craft: there's no engine), Sweep (Search; overstep, seen by day) or Force the trunk (Melee; overstep, seen by day).
- `roll`: the sheriff's cabinet (Paper trail), the co-op by day (Crack it on its wifi; or Force it, seen), the co-op office at night once the night men are dealt with (Sweep, quiet), or the county seat (Dig records or Paper trail; costs time).
- `deal`: Voss, day 1 at the co-op or day 2 at the fair, once you hold `roll` or `room7`: Lean on them, Calm, Identify ("name what he signed") or the pocket recorder (Tanner's laugh). Choosing Voss at the deduction makes him clam up: −20 on these.
- `lesson`: the hidden curb (Mushrooms). Counts toward the threshold.

Town clues for the threshold: `dead`, `watch`, `room7`, `car`, `roll`, `lesson`. The deduction's right answer needs `watch` plus `room7` or `lesson`.

### Fights and the boss, as built

- Night men stand in front of the co-op door on night 1. Lean on them or the cash roll ends it; Fight starts it. Either way they say Voss pays them, and the co-op office opens (quiet).
- The Understudies come out of the Grissom house the first time you walk onto Elm on night 1, after the glasses scene.
- Ushers: three on the fairground on night 2, guarding Tanner at the wheel, the Lantern Box in the barn hayloft, and Voss at the grandstand steps.
- The Graduate's numbers are in the case code and the bible's tuning table (tools/boss-sim.js); this file keeps only the shape: phase 1 polite (Mimic unless `kept`, the class roll unless the book was taken), phase 2 at half (heals unless the book was read aloud; more class roll). Weakness: light (road flare Shakens it, a flashbang Stuns it, and Flash the badge Stuns it, because a badge asks a polite question it has to answer).
- Fire in the crowd: a Loud weapon or throwable in a fight on the fairground on night 2 is a public overstep.

### Items, as built

- Case-only: the copybook (unnatural, Evidence, the page), Hal's harmonica (ordinary, Tool: in battle, anything that learned a laugh stops to listen, Stunned a round), Rhonda's coffee (ordinary, Drink: +1d4+1 WP). Fair tea is the shared Mushrooms item.
- If the book was never taken, it falls out of the Graduate when it's unmade, so the page always reaches Big Hat.

### Cover stories

- Paper it (Bureaucracy): a generator venting under the bleachers.
- Sell it (Persuade): two grifters in rented suits working old folks; +20 with `deal` (Voss backs it).
- Weak (Luck): heat stroke. Camera (Persuade +20, if the men were photographed): blurry photos, a UFO crank. Clean books: natural causes, three times.

### Endings, as built

- `clean`: the Graduate unmade, `kept`, no agent lost this case, overstepping below Agency call.
- `costly`: the Graduate unmade any other way.
- `worst`: none since Nov 24, 2026 (the Federal agents used to shut the case down; now they're a fight and the case goes on).
