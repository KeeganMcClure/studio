# SECRET CASE FILE: Records (LANTERN 03, the season finale)

**Spoilers. For the Developer only.** Written Nov 25, 2026 by the Developer from spec 015's finale rules, spec 014's frame, the bible and the arc file's "Finale: Records" section (plus every hook it pays off). Never quote or summarize this file in the bible, specs, changelog, To do, commits, PR text or chat. Keegan plays it blind; public text calls it `LANTERN 03` or "the finale" only.

Public frame it fills in: `games/black-lantern/specs/015-later-agency-cases-and-finale.md` (the finale rules) over `specs/014-first-agency-case.md` (the frame). Where this file and a spec disagree, the spec wins on structure (counts, budgets, card style); this file wins on what things are. The arc file (`story/SPOILERS-agency-arc.md`) wins on arc secrets.

## The card (spec 014's right-hand cells, with spec 015's finale card)

| Field | Value |
| --- | --- |
| Number | `LANTERN 03`, the finale card: black folder, gold edge, `FINALE` under the number (spec 009, step 4) |
| Title | `RECORDS` |
| Town (on the card) | `SUITLAND` |
| Place line (after `SEASON FINALE · `) | `SUITLAND, MD` |
| Hook, line 1 | `Big Hat calls from a payphone. It's Sunday.` |
| Hook, line 2 | `Everything you ever filed went somewhere.` |
| Unlock count | In `seasons/season-1.js` only (from the arc file). |
| Big Hat's unlock lines | Part B of the finale adds none (LANTERN 02's builder owns `text.unlock`); until one is written the board plays the case's own stand-in: "No folder this time." / "Somebody upstairs took the folders." |
| Heaviest themes | A mother who sold herself for her child, and the child still paying; a kind man buying names; the people you work for being in on it. No gore past a wound; nothing shown of what happens to an account. |

## The truth

- **Records** is a federal annex in Suitland, Maryland: cinder block, three floors up and two down, a parking lot, a loading dock. Every case's evidence comes here. Records also stocks the Lantern Boxes. Upstairs, nobody visits it; it is where paper goes to be forgotten.
- **Wren Hollis**, sixty-one, Big Hat's handler before him, "retired" after the Ashgrove thing eleven years ago and moved to Records: the office called **INTAKE**, the desk every case's evidence crosses. She signed the Ledger eleven years ago for her daughter Lily (seven, a fever that wouldn't break). Lily lived. Wren has been paying since: she routes which cases reach the team's board so the agents come home with evidence that has a Ledger page bound into it, and she files the page. She believes a full Ledger frees every account, Lily included. It doesn't. A full Ledger keeps them. (Lily, if the Mushrooms show it: still seven. She's been seven for eleven years, in a gray room, waiting.)
- **The Almoner** collects on Sunday nights at midnight, in the annex's cold room in the second sub-basement, where the Ledger lives on a lectern between the shelves of the season's filed evidence. He is tall and courteous, in an old deacon's coat; his face is too even; his eyes stay shut and he tracks you anyway. Rules (from the arc): only a name freely signed counts; fire destroys pages; he can't hold a place where his true name is read aloud from the record. His true name is the first line on the Ledger's first page, which only an account can read: **ASA PENHALLOW**. Wren knows it.
- **Tonight:** Big Hat was suspended on Friday ("pending review"). He calls the team from a payphone and sends them in anyway, with no folder, no requisition, nothing on paper. It's Sunday, so Records is two guards, a coffee maker and Wren.

## Arc payoffs (what the season brings in; all read through `arcTally()`; anything missing is neutral)

| From | Read as | What it does here |
| --- | --- | --- |
| Each page kept off the books | `kept` | Weakens the boss (part of the arc's cut, below); the out-tray in the basement has gaps where pages should be; Wren: "Pages have gone missing. Upstairs thinks it's me." |
| Each hidden unnatural item | `hidden` (list `{k, case, who}`) | Weakens the boss (same arc cut); every 2 add one extra Internal Security roamer in the stacks at night (at most 2 extra); Wren's first line names one by `itemDef(k).name` |
| LANTERN 02 burned the forged page | `arc.agnes === 'burn'` | Weakens the boss a further step; he mentions the house on Orchard Row as "a bad debt" |
| LANTERN 02 paid in blood | `arc.agnes === 'sacrifice'` | One line from him: somebody paid in full once. No mechanic. |
| LANTERN 02 walked away | `arc.nine` | **The 9 is the door:** a door with a brass 9 stands in the sub-basement wall that is on no plan. It opens as you reach it (an Unsettling horror for all three); it opens on the cold room. He steps out of it when the fight starts. |
| LANTERN 02 copied the diary's back pages | `arc.ledgerCopy` | The team comes in with the copied entry ("Wren Hollis, for Lily"): the clue `copy` is in the notebook from the start (counts as the motive for the deduction) |
| LANTERN 01 closed | its `facts.offBooks` | Big Hat knows the "W." (he says so, and still won't say the name on a payphone) |

## The cast

| Who | Map id / tab | Role | Weird trait |
| --- | --- | --- | --- |
| **Wren Hollis** | `wren` / `MS. HOLLIS`, `WREN` once named | The insider, in Intake. Courteous, tired, kind to the team, a liar about why she's here on a Sunday ("catching up on filing"). Family and Redemption agents get extra lines with her. | Knits at her desk; the scarf is eleven years long |
| **Desmond Pryor** | `desmond` / `DESMOND` | The night guard at the lobby desk. Sixty-four, Internal Security thirty years, does the crossword in pen. Knew Big Hat when Big Hat had hair. Not in on it. | Keeps a goldfish named Clearance on the desk |
| **Night security** | roamers, `SECURITY` | Internal Security walking the stacks with flashlights after the lights go out | — |
| **Pruitt and Vale** | `SECURITY` | Internal Security agents on the basement stairs (the second story fight) | — |
| **The tall man** | `tall` (cameo) | At the far edge of the lot under the dead light pole, before midnight; gone when you walk over | eyes shut |
| **The Almoner** | boss, `THE ALMONER` | The boss | — |
| **Lily** | (only in the photo) | Wren's daughter | — |

Dot Ferrell (LANTERN 01) is gone; her desk in the stacks is cleared, and her note is under the drawer.

## The maps

| Map id | Name on screen | When | What's there |
| --- | --- | --- | --- |
| `lot` | THE ANNEX LOT | before midnight only (night, sodium light, first snow) | The annex front (cinder block, RECORDS ANNEX over the doors), the front doors and their buzzer, the loading dock and its keypad (the back way into the stacks), the van, a dumpster (Records shreds), light poles, the dead pole at the far edge (the cameo), a payphone on the fence. |
| `lobby` | THE LOBBY | before midnight (fluorescent); after midnight (emergency lights) | Desmond's desk (the sign-in book, the goldfish), a metal detector, the elevator (out of order), the HANDLERS photo wall, the lost-and-found bin (the Mushrooms), the stairs door down to the stacks, the Intake door. |
| `intake` | INTAKE · RECORDS | both | Wren's office: her desk (knitting, Lily's photo: the hidden hotspot), the routing board (a corkboard like Big Hat's, with the team's own cases on it), a locked filing cabinet, a kettle (the rest spot), the window onto the stacks (the hidden hotspot), the phone. |
| `stacks` | THE STACKS | both; **the danger zone after midnight** | Rows of rolling shelves, the evidence cage (the Filing), the stock cage (the Lantern Box), the terminal (routing logs), Dot's cleared desk, the dock door (from the lot), the stairs down (restricted till the maglocks fail at midnight). |
| `basement` | SUB-BASEMENT 2 | after midnight only | The incinerator and the out-tray cart (the season's pages, waiting), the boiler, the cold room's steel door (the boss: Go in / Not yet), and the 9 door if the arc left one. |

**The pattern break (on purpose, Gameplay loop allows it):** the case is one Sunday night, no day. Its turn is midnight: the lights go out.

## Turning the night (the point of no return)

- **Midnight** (the only turn): in Intake, once the phone call is done, Wren says he comes at midnight. "Stay with her till midnight?" Go on / Not yet, cursor on Not yet. Closes: **"At midnight the annex locks down: the lot and the front doors are out of reach."**
- After it: the blackout. Emergency lights, the lantern, the maglocks on the stairs fail open, Internal Security sweeps the stacks with flashlights, the Filing gets up.
- **The cold room** asks Go in / Not yet at its door; everything else in the basement (the incinerator, the cart, the 9 door) is reachable without crossing it.

## The hidden hotspot (Mushrooms)

- **Where:** Intake, the window onto the stacks (its reflection). Sober it's a window. Lily's photo on the desk (sober, a girl of seven on a swing, school-picture blue behind her) is the plain `lily` clue beside it.
- **Mushrooms:** the lobby's lost-and-found bin: a sandwich bag of dried mushrooms tagged CONFISCATED · 1998. Search, once.
- **High:** in the glass, behind your reflection, Lily as she is now. Still seven, in the same sweater, in a gray room with no corners, holding a number on a paper tag. She looks up when you look. Clue `photo`: makes turning Wren sure (show her), and is the **Family** moment's best route. Unsettling horror.

## Clues (threshold plus bonus: 3 of the six marked * ring Intake's phone)

| ID | Where | Skills | What it proves | Second way in |
| --- | --- | --- | --- | --- |
| `signin`* | Lobby: the sign-in book | Search, Bureaucracy | W. HOLLIS signs in every Sunday at 6 PM and never signs out | Desmond: "Ms. Hollis. Sundays. Eleven years." (Persuade, or free once he likes you) |
| `routing`* | Stacks: the terminal | Computers (Crack it, Backdoor) | Every case that reached the team's board was routed by INTAKE, by hand, against the duty roster | Intake: the routing board (Search) |
| `pages`* | Stacks: the evidence cage | Search, Forensics, Occult | Every box of filed evidence has an old numbered page bound into it, one per case, the team's included | — |
| `lily`* | Intake: the photo | none (Look) | Wren has a daughter, Lily, seven in the photo; the photo is eleven years old | — |
| `dot`* | Stacks: Dot's cleared desk | Search | Dot's note under the drawer: "She's here every Sunday. She talks to somebody in the cold room. —D.F." | — |
| `shred`* | The lot: the dumpster | Search | Shredded copies of the team's own reports, each page numbered in a corner in Wren's hand | — |
| `copy` | free from the arc (LANTERN 02) | — | The copied Ledger entry: "Wren Hollis, for Lily" | counts as `lily` for the deduction |
| `photo` | Hidden (Mushrooms): Intake's window | — | Lily is still seven, still waiting | — |
| `name` | Wren, turned | — | His true name | — |

## The deduction (Intake's phone, never a dead end)

Big Hat calls Intake (he knows the number by heart): **"Who's been routing my cases?"** It plays at the payphone (his place), so his shout shakes the screen.
1. "Internal Security. They wanted us busy." (wrong: costs each agent 1 SAN at the blackout; midnight still comes)
2. "Ms. Hollis. She signed for her daughter." (right: needs `lily` or `copy`, plus `signin` or `routing`. Big Hat goes quiet, then **shouts her name: "WREN."** Then: "Paper burns. Whatever he is, he's paper." Identify is free on the boss and the party gets +10 to turn her.)
3. "Records. The whole office." (half: needs `routing`; "An office don't sign for nothin'. A person does." No edge.)
Without the proof, an answer plays as a guess and counts as wrong.

## Choices that matter

- **`burn` Burn the out-tray** (basement, the incinerator: Craft's Fix it or Science's Sample to light it, or a road flare with no roll): the season's waiting pages go up. **Weakening 1:** −10 HP. Also lights the incinerator, which is how the Ledger can be burned at the end (a road flare or Molotov carried in also does it).
- **`wren` Turn Wren** (Intake, after midnight; Empathy's Read or Persuade's Talk; +10 from the W. topic, +10 from the right deduction; sure with `photo`). Turned, she gives one of two (the player picks):
  - **the name** (a card in her hand, case item `name`): **Weakening 2b:** −6 HP (his name is out of the book's keeping); Speak its name works on him (History 75), and the card read aloud in battle (History or Occult) stuns him and stops phase 2's page storm. With the name and an empty Lantern Box, he can be **bound**.
  - **her page** (case item `wrenpage`, unnatural): **Weakening 2:** −8 HP, and she isn't his any more (she lives at the burn ending).
- **The motivation moments:** **Family** (show her `photo`, or ask about Lily: the Family holders regain SAN) and **Redemption** (tell her it isn't too late: Persuade; the Redemption holders regain SAN). Both are ways to turn her, so acting on one costs the roll the other would have taken.
- **`lbox` Keep the empty Lantern Box** from the stock cage: the bind needs it.
- **Arc cut** (the season's choices, Gleaner style): −2 HP per kept page and per hidden item, up to −8; −4 more if the forged page burned in LANTERN 02.
- **Total cut** never passes 40% of his HP (Combat numbers): 78 → at least 47.

## Overstepping (quiet case: Noticed first; extreme flag off)

| Act | Public? | Mark |
| --- | --- | --- |
| Force the loading dock | Seen (camera) | 1 step |
| Desmond lets you in after you've stood at the doors too long | Seen | 1 step |
| Break Wren's filing cabinet | Seen | 1 step |
| The fight on the basement stairs | Seen | 1 step |
| Anything in the sub-basement | Unseen | Luck, no penalty |

Noticed: Desmond stops talking ("I didn't see you, and now I'm going to not see you harder"). Local chief: the annex's watch officer locks Intake's door for a while (Credentials or Persuade still gets in; Wren opens it after midnight). Agency call: Big Hat calls from the payphone. Federal agents: the usual clean-up crew at the next area change (field.js `feds`).

## Fights (every fight in the finale rolls lasting injuries at +2: battle.js reads `isFinaleCase`)

| Fight | Kind | Skulls | Where / when | Enemy card |
| --- | --- | --- | --- | --- |
| **The Filing** | The pages bound into a season's evidence come out of their boxes and stand up into a shape the height of a man, folders for shoulders, evidence tags for teeth | 2 | The stacks, after midnight, the first time you walk in | `filing`: HP 26, DEX 10, 55%, 1d4+1, Paper cuts (Bleeding), tags unnatural, burns; weak: fire |
| **Pruitt and Vale** | Two Internal Security agents coming up the basement stairs with flashlights and orders | 2 | The stacks' stairs, after midnight | `sec` ×2: HP 13, DEX 12, 55%, 1d4+1; human. Credentials (Bureaucracy 75) talks them past; the fight oversteps (seen) |
| **Roamers** (danger zone: the stacks after midnight) | Night security with flashlights: 2, plus 1 per 2 hidden items (up to 4). Guard the stock cage (the Lantern Box), the terminal, Dot's desk, the aisle to the stairs | 1 | The stacks, after midnight | `guard`: HP 14, DEX 11, 50%, 1d3+1; human; drop 20% |
| **Boss: The Almoner** | In the cold room, at the lectern, the Ledger open | 3 | Sub-basement 2, the cold room (Go in / Not yet) | below |

### The boss: The Almoner (Season finale boss row)

- **Base:** 78 HP, DEX 12, 60% (phase 2: 65%), 1d4+2, all-target "he reads a line aloud" 1d3. Tags unnatural, paper. **Weakness (Identify): fire on the Ledger** (Molotov and flare gun do double), and **Speak its name** works once the name is found.
- **Phase 1 (polite):** moves: a reach (4), the line read aloud (1), **a deal** (2): once per agent, tied to that agent's first motivation. Accept: full SAN back, and that agent is marked an account (`a.account = true` on the roster agent; Season 2 seed), and he writes the name in (+4 HP). Refuse: SAN 0/1. No deals left: a reach instead.
- **Phase 2 (at half): his eyes open and the pages fly:** +5% to hit, one more reach, the **page storm** (2: 1d2 to everyone, each one hit is Bleeding) and **a page in the face** (1: one agent Shaken, SAN 0/1). If his true name has been read aloud (the `name` card in battle), the storm stops: phase 2 adds only the reach.
- **Tuning (tools/boss-sim.js `almoner`, Field Team; numbers in the build notes below):** no choices: 8–12 rounds, can lose. Every choice: 5–8 rounds.

## Horrors (inside 6–10 net SAN; the finale runs at the top)

| Horror | Tier | Kind | Tags |
| --- | --- | --- | --- |
| The routing board: every case you ever took, picked for you | Unsettling | helplessness | |
| The evidence cage: a page in every box | Disturbing | unnatural | |
| The photo (Mushrooms) | Unsettling | unnatural | |
| Midnight: every light goes out at once | Disturbing | unnatural | all |
| The 9 door (arc) | Unsettling | unnatural | all |
| The Filing (on sight) | Disturbing | unnatural | |
| The cold room: the shelves of filed evidence, and him | Shattering | unnatural | all |
| The Almoner (on sight) | Boss | unnatural | known |

Phobia subject: **the dark** (the blackout). Trigger tags: Wren is a liar (Paranoia); the stacks are dark after midnight (Nyctophobia).

## Motivation moments

1. **Family:** Lily (the photo, or asking Wren about her).
2. **Redemption:** telling Wren it isn't too late.
Both lean on the season's personal arcs (Family "Pell Street", Redemption "Carla's").

## Items

- **Lantern Box** (1): the stock cage in the stacks (the boxes are stocked here): First-aid kit, Road flare, Body armor; with Big Hat's "The boxes" topic, a Molotov as well.
- **Loot table** (5): Painkillers, Energy drink, Road flare, Cigarettes, Bandage.
- **Case-only items:**
  - **The name** (ordinary, Evidence): a library card in Wren's hand, ASA PENHALLOW. Battle: read it aloud (History or Occult).
  - **Wren's page** (unnatural, Evidence): her own Ledger page, torn out: "Wren Hollis, for Lily." **The finale's page.** Bag or hide.
  - **Empty Lantern Box** (ordinary, Tool): the agency's own box. With the name it binds him, and becomes **the sealed box** (unnatural, Evidence: bag it and the agency keeps a god in a box; hide it and the team does).
  - The Mushrooms (lost and found).

## Endings

| Label | What it means |
| --- | --- |
| `clean` | **Burn the Ledger** (needs fire: the lit incinerator, a road flare or a Molotov): the accounts go free, Lily included. Wren goes with him, unless she tore out her page. The cold room burns. Big Hat is reinstated: the debrief plays in the donut shop's back room. |
| `costly` | **Bind him** (needs the name and the empty Lantern Box): he's sealed in the agency's box. Wren lives and turns herself in. The debrief plays at the payphone. Season 2: Black Lantern owns a god in a box. |
| `worst` | **He escapes** with a half-full Ledger (beaten, with no fire and no way to bind him: a careless run). Wren is gone by morning, her desk cleared like Dot's. Season 2: he's loose. |

When both the fire and the bind are ready, the player picks. A party wipe is a game over that reopens the finale.

## Big Hat's briefing (and the debrief)

- **Place:** a payphone outside a closed gas station on a state road, first snow, after midnight's eve: the booth's glass and steel frame around him, a dead price sign, the canopy lights off, snow coming down past the one lamp; in front of him where the desk would be, the booth's shelf, a phone book on a chain, a stack of quarters, the receiver cord. No donut shop: he's suspended. (`L03A.payphone`)
- **The four topics** (two get asked; each an INTEL note and a small edge, spoiler-free):
  - **Records** — "Annex out in Suitland. Sundays it's two guards and a coffee maker." Edge: +10 Bureaucracy at the front doors and the sign-in book.
  - **The W.** — "I know whose initial that is. I ain't sayin' it on a payphone." Edge: +10 to turn her.
  - **Internal** — "Internal walks the stacks on four-hour beats. They ain't bad people. They do what the paper says." Edge: the night's roamer beats show as you walk in.
  - **The boxes** — "Records stocks the Lantern Boxes. Every flare I ever sent you come outta that building." Edge: a Molotov in the stock cage's box.
- **No requisition:** he's suspended ("Nobody's requisitionin' you nothin'. Whatever you need is in that building.").
- **Unlock scene:** the case's stand-in lines above until the season data has its own.
- **Season end (season-1.js `text.end`, by ending):** written with part B.

## Part B build notes (Developer, Nov 25, 2026)

Parts A and B were built in one pass. What the build settled where this file left it open (this file stays the master):

- **Arc reads:** `arcTally()` (season.js) once per need; `kept` and `hidden` are counts, the hidden list is `loadSeason().hidden`, and `arc` keys missing mean nothing happened. Nothing is written back to the season but the finale's own facts (`arc.finale` = the ending label).
- **Arc cut:** min(8, 2 × (kept + hidden)) + 4 if `agnes === 'burn'`; the case cut is 10 (out-tray burned) + 8 (her page) or 6 (his name); the whole cut is capped at 31 (40% of 78).
- **Roamers:** 2 + floor(hidden / 2), at most 4.
- **Deals:** in battle through the dialog box (Take the deal / Refuse); the sim's AI refuses.
- **Account mark:** `m.a.account = true`, carried to the roster by `finish()`; missing means false, so no save step.
- **Rest:** Wren's kettle, once, after midnight (half HP and WP back), turned or not.
- **Tuning** (tools/boss-sim.js `--boss almoner`, Field Team at full strength, 300 fights each, seed 1; careful / plain):

| Choices | HP | Careful wins | Rounds | Wins with ≤1 Downed | Plain wins |
| --- | --- | --- | --- | --- | --- |
| none | 78 | 80% | 11.1 | 98% | 68% |
| out-tray burned | 68 | 86% | 9.8 | 98% | 80% |
| her page | 70 | 85% | 10.1 | 100% | 77% |
| his name | 72 | 92% | 9.7 | 98% | 78% |
| season's cut (2 kept, 2 hidden, page burned) | 66 | 86% | 9.5 | 99% | 76% |
| all, her page | 48 | 95% | 6.8 | 99% | 94% |
| all, his name | 50 | 98% | 6.8 | 100% | 93% |
