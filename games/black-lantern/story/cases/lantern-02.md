# SECRET CASE FILE: Seven Days (LANTERN 02)

**Spoilers. For the Developer only.** Written Nov 25, 2026 by the Developer from spec 014's frame (read as `02`), spec 015, the bible and the arc file's Agency Case B section ("Seven Days"). Never quote or summarize this file in the bible, specs, changelog, To do, commits, PR text or chat. Keegan plays it blind; public text calls it `LANTERN 02` only.

Public frame it fills in: `games/black-lantern/specs/014-first-agency-case.md` and `015-later-agency-cases-and-finale.md`. Where this file and the specs disagree, the specs win on structure (counts, budgets, card style); this file wins on what things are. The arc file (`story/SPOILERS-agency-arc.md`) wins on arc secrets. Built in one go (parts A and B together) on Nov 25, 2026.

## The card (spec 014's right-hand cells)

| Field | Value |
| --- | --- |
| Number | `LANTERN 02` (black folder card, cream text, dark red pin, red wax seal; not the finale) |
| Title | `SEVEN DAYS` |
| Town (on the card) | `CORLEY FALLS` |
| Place line (after `AGENCY CASE · `) | `CORLEY FALLS, MN` |
| Hook, line 1 | `A dead widow left us her diary.` |
| Hook, line 2 | `It takes a week to read.` |
| Unlock count | In `seasons/season-1.js` only (from the arc file). Reach check: six regular cases exist, enough. |
| Big Hat's unlock lines | "Got a letter. Addressed to us. By name." / "Nobody outside this outfit knows our name." |
| Heaviest themes | A house that won't let you leave; a woman's reflection that wanted what she refused; a priest killed in his own bathroom; three brothers grieving their youngest (with care, no detail of how he died); an agent asked to give their life. |

## The truth (what is really going on)

- **Agnes Lindqvist**, 71, widow of Arne (d. 2019), retired school librarian, 9 Orchard Row, Corley Falls, Minnesota. Two Novembers ago a doctor in Duluth gave her a year (her liver). That week a tall, courteous gentleman in an old deacon's coat sat beside her at the bus shelter on Main Street, held her hand for the length of one bus not coming, and she was well. (He is the arc's Almoner; nobody in town learns a name for him.)
- **The visits.** He came for coffee every Tuesday for a year. Kind, funny, a book under his arm. He bought pie at Bev's. He asked for nothing. Then he asked for her name in his book, "for the records".
- **She refused.** She'd read over his shoulder: names, and what each one got, and what it cost. She said no, and was proud of it. He smiled: "No hurry. I have your page already."
- **The forgery.** He did. The Almoner forged her signature on her page (rule 1 says only a name freely signed counts, so a forgery holds nothing — but the part of her that *wanted* to sign took it as permission). The page has sat behind her hall mirror's backing board ever since, where she never thought to look.
- **The other Agnes.** Every person has a reflection that wants what they won't let themselves have. The forged page gave hers a life. Since the forgery, her reflection doesn't follow her; it signs things; it wants. Agnes covered the mirrors; the sheets came off by themselves. She died in November at the foot of the stairs in front of the hall mirror (her heart, the coroner says). The other Agnes kept the house.
- **The diary.** Agnes wrote it in the last week she was sure of herself: seven entries over seven days, one thing she learned each day. She left it on the parlor desk and wrote in her will that it go "to the people with the lantern" (the gentleman had told her, laughing, that men with a lantern carried his mail). The house lets a reader read one entry a day. It won't let a reader leave until the seventh.
- **The back pages.** Agnes copied what she saw in his book onto blank pages at the back of the diary. One reads "HOLLIS, WREN · FOR LILY", dated eleven years ago (arc reveal).
- **Rules (the internal logic).**
  1. The house lets you read one entry a day. The pages won't turn until you've slept on it.
  2. Leaving early is punished: phones ring with dead voices, tires go flat, the bus never comes.
  3. The other Agnes lives in the house's mirrors: the hall mirror, the vanity, the bathroom cabinet. Each one uncovered is a place it can go to heal and hide. Covered or turned to the wall, it can't.
  4. Its weakness (Identify): **its own face held up to it.** It can't stand to look at itself (Agnes's compact, a hand mirror: double damage, Stunned).
  5. Agnes's own hand (her real signature, from her letters to her sister or the parish register) reminds it whose hand it isn't: in phase 2, shown to it, its shield drops.
  6. The forged page is the only thing holding the other Agnes in the world. Burn it (proved a forgery with History, burned right with Science) and she's gone, and so is the haunting, and Agnes is free.

## The cast (public names; sprites and portraits)

| Who | Map id / tab | Role | Weird trait (1 in 3) |
| --- | --- | --- | --- |
| **Agnes Lindqvist** | (diary; photo; the boss) | Dead. Her voice is the diary's. The other Agnes is the boss (`THE OTHER AGNES`, portrait in the battle art). | — |
| **Marit Sundby** | `marit` / `MARIT` | Sundby Realty & Notary. Fifties, red parka, a clipboard. Executor of the will. Hands over the key; won't go past the porch. Liar tag: "It's a drafty old house, that's all." | none |
| **Bev Ostlund** | `bev` / `BEV` | Runs Bev's Falls Café. Agnes's best friend for fifty years. Saw the gentleman buy pie every Tuesday. | does the crossword in pen, out loud, wrong on purpose |
| **Father Tom Kessler** | `kessler` / `FATHER TOM` | Pastor of St. Bridget's. Sixties, ex-goalie, a knocked-out tooth. Blessed the house in December; the hall mirror cracked and was whole by morning. Killed on the fifth night in front of his own bathroom mirror. | writes his homilies on the backs of bingo cards |
| **Dag Haugen** | `dag` / `DAG` | Eldest of three Haugen brothers (Dag, Erik, Nils). Their youngest, Toby, died in January. At Toby's funeral lunch Father Tom said something; nobody agrees what; Dag put him into the coffee urn in front of the parish. | none |
| Erik and Nils Haugen | `erik`, `nils` | Narration only, in the booth with Dag. | Nils wears his dead brother's hockey jacket, two sizes small |
| Ruth Dahl | (phone only) | Agnes's younger sister in Duluth. | — |
| Sheriff Gary Pell | (overstepping, the dawn) | SHERIFF, no portrait. | — |
| Street folk | `sledkid`, `fisher` | A kid dragging a sled with nothing on it (day); an ice fisherman on the river's edge (day). Narration. | the kid's sled has a seatbelt |

## The maps

| Map id | Name on screen | When | What's there |
| --- | --- | --- | --- |
| `town` | MAIN STREET · CORLEY FALLS | day; night (danger zone on the seventh night) | March thaw: slush, gray snowbanks, icicles. North side: Sundby Realty, Bev's Falls Café, St. Bridget's (steeple) and its rectory, then 9 Orchard Row (the Lindqvist house) in its fenced yard. Main Street. South side: the bus shelter, the park strip, the river with ice going out, the falls, a footbridge. The van (flat tires). |
| `house` | 9 ORCHARD ROW | day; night | The ground floor: the parlor (the reading desk and the diary, sheeted furniture, the grandfather clock), the front hall (**the hall mirror**, the stairs up), the kitchen (the wall phone, the spice rack). |
| `upstairs` | UPSTAIRS · 9 ORCHARD ROW | day; night (not on the seventh night) | The guest bed (the day's turn), Agnes's bedroom vanity (**mirror 2**, the hidden hotspot), the bathroom cabinet (**mirror 3**), the sewing-room trunk (Ruth's letters). |
| `cafe` | BEV'S FALLS CAFÉ | day (closed at night) | Counter, pie case, booths (the Haugens), a TV with the hockey game. |
| `church` | ST. BRIDGET'S | day; night (unlocked on the seventh night: nobody's left to lock it) | The nave: pews, the altar, the candle rack (Faith), the sacristy cabinet (the parish register). Through a door, the rectory: Father Tom's desk, his bathroom mirror. |
| `hall` | THE UPSTAIRS HALL | the seventh night only | **The finale area.** The upstairs hall, longer than the house: mirrors both sides, Agnes's things on little tables, and at the far end, the big mirror (Go in / Not yet). |

## Seven days in under two hours (Turning the day)

Each day is one short beat: the day's entry at the parlor desk (no roll, a revelation), a few errands in town, then the guest bed upstairs ("Sleep on it"), Go on / Not yet, cursor on Not yet. The bed needs the day's entry read. Most nights are a short scene in the house; the third night is played (the sheets); the seventh is played (the whole town and the hall).

| Turn | What it closes (the line) |
| --- | --- |
| Day 1 → 2 | "Nothing in town closes tonight." |
| Day 2 → 3 | same |
| Day 3 → night 3 | (the night wakes you; the house map at night, the doors outside won't open: minus eight and something on the porch) → day 4 at the bed |
| Day 4 → 5 | "Nothing in town closes tonight." |
| Day 5 → 6 | needs Big Hat's call answered (the deduction). Line: "St. Bridget's won't open tomorrow." (Father Tom dies that night: the candle and his talk close) |
| Day 6 → 7 | same |
| Day 7 → night 7 | Wait for dark at the parlor window. "Bev's closes. Marit leaves town for the night." |
| The big mirror | Go in / Not yet: "Once you're in, it ends one way or another." |

Leaving early (the county road at the west edge, the van, the bus shelter): the phone rings with a dead voice (first time: Unsettling, the lead), the tires are flat, the bus never comes.

## The hidden hotspot (Mushrooms)

- **Where:** Agnes's bedroom vanity mirror, upstairs.
- **Shows only** while the lead is High on Mushrooms.
- **What it is:** the vanity shows the room empty, and Agnes, the real one, small and gray on the far side of the glass, pressing her right hand flat to it. She breathes on it and writes, backward: "NOT MY HAND."
- **What it gives:** clue `stillhere`: Agnes is still there and never signed; the History roll to prove the forgery is sure; and at the boss, one line from her.
- **Where the Mushrooms are:** the kitchen spice rack: a jar of dried mushrooms in Agnes's hand, "ARNE'S. FOR HIS BACK. DO NOT." Search, once.

## Clues (threshold plus keys)

| ID | Where | Skills | What it proves | Second way in |
| --- | --- | --- | --- | --- |
| `healed` | Diary, day 1 | none | She was dying and a gentleman healed her | Bev (`pie`) |
| `visits` | Diary, day 2 | none | He visited a year, kind, with a book | — |
| `book` | Diary, day 3 | none | He asked for her name in his book | — |
| `refused` | Diary, day 4 | none | She refused, and he said he had her page already | Ruth's call (`ruth`) |
| `glass` | Diary, day 5 | none | Her reflection doesn't follow her; she covered the mirrors | Night 1 (`lag`) |
| `forged` | Diary, day 6 | none | "My name, in my hand, and I never wrote it" | Hidden hotspot (`stillhere`) |
| `ledger` | Diary, day 7 | none | The last page; the back pages are his book, copied | — |
| `lag` | Night 1 (automatic) | none | The hall mirror runs a second behind | — |
| `pie` | Bev | Persuade, Empathy (+10 with the Agnes intel) | The gentleman, every Tuesday; she got well "like a light switched on" | — |
| `blessing` | Father Tom (day 2–5) | Persuade (free with the town intel), Empathy | He blessed the house; the hall mirror cracked and healed; and the old way out: "a life for the life in the glass" | — |
| `ruth` | The kitchen phone, day 3 on | none (Family moment) | Agnes said no and was proud of it; she always signed her A open at the top | — |
| `register` | The church sacristy | History (Dig records, +10 with the letter intel), Bureaucracy, Stealth (take it) | Agnes's real signature (item: the register page) | Ruth's letters in the sewing-room trunk (Search) |
| `rectory` | The rectory, day 6 | Forensics (Examine), Search | Father Tom died in front of his mirror; the glass is broken from the inside | — |
| `haugen` | Dag, day 6 | Empathy, Persuade | The brothers were in Brainerd at Toby's old team's game on the fifth night; forty people saw them | — |
| `stillhere` | Hidden hotspot | none (High) | She's still there; she never signed | — |

Threshold: the deduction call rings on day 5 once entry 5 is read. Nothing the story needs sits behind one roll: every diary entry is free, and the burn path has two routes to Agnes's real hand.

## The deduction (Big Hat on the kitchen phone, day 5; never a dead end)

**"What's in that house?"**
1. "Agnes. She never left." (wrong: costs each agent 1 SAN when the next night comes; the day still turns)
2. "Her reflection. The part of her that wanted to sign, and something gave it legs." (right: needs `refused` and `glass`, plus one of `blessing`, `ruth`, `pie`; Big Hat: "Then don't look at it longer than you have to." Identify is free in the fight, and −6 HP)
3. "The man with the book." (half: needs `book`; Big Hat goes quiet: "He ain't why I sent you. ...Is he." No reward)

## Choices that matter

- **`mirrors` Cover the mirrors** (each: no roll with a sheet from the linen closet, from day 5 or once `glass` is known; the vanity needs it to be looked at first or it fogs back). All three covered: −6 HP and no phase-2 heal.
- **`hand` Show her her own hand** (the register page or Ruth's letters, in phase 2: History or Empathy): drops the phase-2 shield.
- **`deduce` the right deduction:** −6 HP, Identify free.
- **`compact` Agnes's compact** (the vanity drawer, Search; or the hall at night): the weakness as a battle item, 3 uses.
- **The ending choice, after the fight** (the arc's three options, never a dead end):
  1. **Sacrifice** (always, with two or more agents): the expulsion asks a life for the life in the glass. One agent says the words and walks into the big mirror. Lost for good; the others take a Severe violence horror. `agnes:'sacrifice'` → `costly`.
  2. **Walk away** (always): leave it in the glass and go. The bus comes for the first time in seven days. A 9 is drawn in the fog on its window from the outside. `agnes:'walk'`, `nine:true` → `worst`.
  3. **Burn her page** (needs Agnes's page from behind the hall mirror, which needs `forged` or `stillhere`): prove it's a forgery (History; +20 with her real hand or `ruth`; sure with `stillhere`) and burn it right (Science). Each agent may try each roll once; a fail costs that agent 1 SAN. If every try fails, the page won't catch and the other two remain. `agnes:'burn'` → `clean`.
- **The Faith moment:** light a candle for Agnes with Father Tom (days 2–5): an Unsettling horror for the Faith holders (the flame leans toward the window and her shape in the glass), then they regain 1d4.
- **The Family moment:** call Ruth on the kitchen phone (day 3 on): the dead voice cuts in once (Unsettling, the lead); Family holders regain 1d4. Anyone can call for the clue.
- **The obsession:** on the second night the agent with the lowest SAN is found standing at the hall mirror at 3 a.m. From then on they hear the house. On the sixth night they sleepwalk; a teammate can bring them back (Empathy: Calm, or Read −20). If nobody does, the last page is a **Breaking Point** for them (disorder, give up a motivation, or lean on a Bond); brought back, it's a Disturbing horror instead.
- **The brothers (the dawn, before the debrief):** Sheriff Pell has the three Haugens in his cruiser for Father Tom. Say nothing and let them carry it (a Disturbing helplessness horror for all), or tell Pell what killed him (a true report: overstepping climbs one step, no roll; Pell lets them go). `brothers:'carry'|'true'`.

## Overstepping (quiet case: Noticed first; extreme flag off)

Cover: estate appraisers from the Cities, here for the house.

| Act | Public? | Mark |
| --- | --- | --- |
| Duck the sheriff's tape at the rectory (day 6) without Credentials | Seen (a deputy in the cruiser) | 1 step |
| Take the parish register page without asking (Stealth) | Seen if it fails | 1 step |
| A fight in the rectory with a Loud weapon | Public | 1 step; quiet: seen |
| Smash a mirror instead of covering it | Unseen | Luck, no penalty |
| Anything on the seventh night | Unseen | Luck, no penalty |

Noticed: Bev and Marit clam up (−20). Local chief: Sheriff Pell stops the van on Main Street; the rectory needs Credentials or Persuade. Agency call: Big Hat on the kitchen phone. Federal agents: the clean-up crew at the next area change.

## Fights

| Fight | Kind | Skulls | Where / when | Enemy card |
| --- | --- | --- | --- | --- |
| **The sheets** | Two dust sheets off the parlor furniture standing up with the shapes of somebody under them, nobody under them | 2 | The house, the third night | `sheet` ×2: HP 12, DEX 12, 50%, 1d3+1, Smother (an agent loses their next turn); tags unnatural, burns; weak: fire; resists Shaken |
| **Father Tom's reflection** | His reflection, still in his bathroom mirror the morning after, steps out in his bathrobe | 2 | The rectory, day 6 | `priest`: HP 24 (Tough), DEX 10, 55%, 1d4+1, "it says your sins in his voice" 0/1; tags unnatural, glass; weak: its own face (the compact) |
| **Roamers** (danger zone: Main Street, the seventh night) | `twin`, a neighbor's reflection walking the street while the neighbor sleeps; `rdog`, the reflection of a dog that died in '09, still walked | 1–2 | Town, night 7 | twin 14 HP (guards the Lantern Box under the bus shelter bench), rdog 10 HP (guards the rectory steps: the church's side door); drop 20% |
| **Boss: The other Agnes** | Agnes in her good blue dress, stepping out of the big mirror at the end of the hall, perfect and backward | 3 | The hall, the seventh night | below |

### The boss: The other Agnes

- **Base:** 62 HP, DEX 11, 58%, 1d4+2 (a reach), "every mirror in the hall cracks at once" 1d3 to all, "she shows you yourself, older and alone" 0/1 SAN. Tags unnatural, glass. **Weakness (Identify): her own face** (the compact: double damage and Stunned; not twice running).
- **Weakening choices:** the right deduction −6 (Identify free), all three mirrors covered −6 and no phase-2 heal, Agnes's page found before the fight −8 (she has nothing to go back to: tuned below). 42 with all three.
- **Phase 1 (kind):** she talks in Agnes's voice, calls the obsessed agent by name, offers them the house.
- **Phase 2 (at half): she comes all the way out.** A shield takes 1 off every hit until her own hand is shown to her (`hand`); she heals 1 a turn through any uncovered mirror unless all three are covered.
- **Tuning:** all choices: about 5–8 rounds; none: 8–12 (tools/boss-sim.js, the `otheragnes` row).

## Horrors (inside 6–10 net SAN)

| Horror | Tier | Kind | Who |
| --- | --- | --- | --- |
| The first night: every clock at 9:09, the hall mirror a second late | Unsettling | unnatural | the lead |
| Leaving early: the phone, a dead voice | Unsettling | unnatural | the lead, once |
| The second night: the obsessed agent at the mirror at 3 a.m. | Disturbing | unnatural | the obsessed agent |
| The sheets (on sight) | Disturbing | unnatural | all |
| Day 4's entry: what he is | Unsettling | unnatural | the lead |
| The fourth night: the mirrors show her dying at the foot of the stairs | Unsettling | helplessness | the lead |
| Father Tom in his bathroom | Disturbing | violence | the lead |
| His reflection (on sight) | Disturbing | unnatural | all |
| The last page | Disturbing (or the obsessed agent's Breaking Point) | unnatural | the lead |
| The back pages (optional) | Disturbing | unnatural | the lead |
| The hall: a hundred of you, and one of them is late | Shattering | unnatural | all |
| The other Agnes | Boss | unnatural | all, known after Identify |

Phobia subject: **mirrors**. Trigger tags: Marit is a liar (Paranoia); night 3 and 7 are dark (Nyctophobia, Sleep).

## Motivation moments

1. **Faith:** the candle with Father Tom.
2. **Family:** the call to Ruth.

## Items

- **Lantern Box** (1): under the bus shelter bench, the seventh night, guarded by the twin: First-aid kit, Bandage, Road flare.
- **Loot table** (5): Energy drink, Painkillers, Cigarettes, Booze, Bandage.
- **Case-only items:**
  - **Agnes's diary** (unnatural, Evidence): always picked up on day 1. **The key evidence item; its back pages are a different paper, ruled in red, numbered in the corner: 7 (arc hook: the page).** Bag or hide.
  - **Agnes's page** (unnatural, Evidence): the forged Ledger page, from behind the hall mirror. Burned in the clean ending; otherwise bag or hide.
  - **Agnes's compact** (ordinary, Tool): the weakness, 3 uses.
  - **Her own hand** (ordinary, Evidence): the parish register page, or Ruth's letters. Battle: show her her own hand.
  - **Arne's mushrooms** (Mushrooms, Drug).

## Arc touches (quiet; never in public text)

- **The page:** the diary's back pages, numbered 7. Bagged → Records.
- **The reveal:** the back pages copy his book; one entry: "HOLLIS, WREN · FOR LILY", eleven years ago. Read them (optional): `ledgerCopy:true`. At the debrief Big Hat reads the name, says "Never heard of her", and folds the page very small.
- **Our name:** Agnes's will left the diary "to the people with the lantern" (he told her who carries his mail).
- **The 9:** the clocks stop at 9:09; the walk-away ending sets `nine` and the arc's 9 follows.
- **The ending choice** sets `agnes` for the finale.
- **The cameo:** none (the gentleman is in the diary, never seen).

## Endings

| Label | What it means |
| --- | --- |
| `clean` | Her page burned: Agnes, the real one, in the glass one last time; she lifts a hand; the mirrors are mirrors. |
| `costly` | The sacrifice: the other Agnes is driven out with an agent's life. |
| `worst` | Walked away: it stays in the glass; the 9 follows the team. |

`endingFacts(label).arc = {agnes, nine: agnes==='walk', nineFrom:'lantern-02', ledgerCopy}`.

## Big Hat's briefing (and the debrief, same place)

- **Place:** an ice-fishing house on Lake Tamarack, an hour north, the last weekend before the ice goes bad. Plank walls, a propane heater's orange glow, a bench, a bait-shop calendar, a window onto the frozen lake and the other houses' lights; in front of him where the desk would be, the hole in the ice with a tip-up and a lantern; a lamp hung right over his hat. He came himself. (`L02A.icehouse`)
- **The four topics:**
  - **Agnes** — "Agnes Lindqvist. Seventy-one. Librarian. Died in November in her front hall." Edge: +10 Empathy and Persuade with Bev.
  - **The letter** — "Her will left us her diary. Us. By name." Edge: +10 History and Bureaucracy at the parish register.
  - **The town** — "Corley Falls. Twelve hundred people and a waterfall." Edge: Father Tom tells you about the blessing with no roll.
  - **The nights** — "Dark by six up there." Edge: the lantern's light reaches 30% farther at night.
- **Unlock scene:** "Got a letter. Addressed to us. By name." / "Nobody outside this outfit knows our name."

## Build notes (Developer, Nov 25, 2026: parts A and B in one go)

- Day state: `G.flags.day` 1–7 and `G.flags.nt` (1 on the third and seventh nights). Each day's entry is `G.flags.read` (the highest day read). The bed needs the day's entry; day 5's bed also needs the call.
- The page found before the fight takes −8 HP off the boss (she has nothing left to hold her here but the forgery itself); the burn needs it in hand after the fight.
- Boss tuning (tools/boss-sim.js `--boss otheragnes`, Field Team, 300 fights each): careful, no choices: 81% wins, 11.8 rounds (wins 9.0), every win with at most one Downed; careful, all choices (42 HP): 98%, 6.2 rounds (wins 5.9). Plain: 75% / 98%. Same numbers as LANTERN 01's boss card; nothing changed.
- Playtested on Dev through the Dev shortcut: clean (burn), costly (the old way: an agent lost, the recruit at the debrief), worst (walk: `nine:true`), a game over at the boss that retries into the case, and back to the board each time.
- Saves: nothing beyond the case's flags and the facts; no save step. Test save `2026-11-25-lantern02-mid-chapter.json`.
- The Shared Shelf's snow, slush, snowbank, icicles, snowfall, storefront, porch, sedan, van, counter, booth and kitchen pieces are used as is. Nothing new is proposed to the Shelf.
