# Spec 010: Good Manners

Status: proposed, waiting for Keegan's merge · Written 2026-11-22 by the Game Designer · Game: Black Lantern · To do: Good Manners part A and part B

## In plain words

For a month, two men in black suits and dark glasses have been turning up around Odessa Flats, a Kansas grain town of 900, during the county fair's last week. They stand across the street from someone's house and watch for hours, and when they talk they sound like they learned English from a manual. Three of the people they watched have since died in their sleep. The agents arrive with badges as federal agents, so the sheriff knows them from the first scene, and they have to find out who the men are and what they want before anyone else dies.

What it feels like to play: Still Harvest's opposite. It's mostly daylight interviews in a town that loves to talk, with the sheriff watching over your shoulder, so Persuade, Empathy and Bureaucracy carry it and every rough choice risks overstepping. Fights are few. The dread builds from being watched back, and the case's one night at the fair is where it all comes due.

Picked pitch: [`pitches/round-01.md`](../pitches/round-01.md), option B, picked Nov 22, 2026, after the hook was made clearer.

**Spoiler rule:** this spec gives only structure and mechanics. It never says what the men are, what they want, why people die, or how it ends. That goes in the secret case file (Story → Adding a new case, step 5).

## The card

| Field | Value |
| --- | --- |
| File number | `FILE 02` |
| Title | `GOOD MANNERS` |
| Town (on the card) | `ODESSA FLATS` |
| Place line | `COUNTY FAIR · ODESSA FLATS, KS` |
| Hook, line 1 | `Two men in suits watch the houses.` |
| Hook, line 2 | `The ones they watch don't wake up.` |
| Pin color | cyan `#3ff0e8` |
| Heaviest themes | Stalking and being watched, death of innocents, paranoia |
| Season slot | Regular case, Season 1 |

The card's words live in `cases/good-manners.js`'s text block (`caseCard`), as for Still Harvest (spec 004, step 3).

## Bible sections this spec relies on

| Source | Section | What it sets |
| --- | --- | --- |
| `games/black-lantern/bible.md` | Story → Adding a new case | The pipeline; the case spec is public-safe; the secret case file is the Developer's, in `games/black-lantern/story/cases/` |
| `games/black-lantern/bible.md` | Story → Case board; Agency arc | The card; the case joins the season's queue |
| `games/black-lantern/bible.md` | Story → Your original material | The Men in black seed; Flavor: the tinted car, the rural gas station |
| `games/black-lantern/bible.md` | Overview → Mature content | Heaviest themes on the card; what's shown and what's off screen |
| `games/black-lantern/bible.md` | Voice | Lines, jokes and dread |
| `games/black-lantern/bible.md` | Systems → Gameplay loop | 1–2 hours; 2–3 story fights plus the boss; 0–2 danger zones; roamers; clues; deduction never dead-ends; time; choices; healing; game over |
| `games/black-lantern/bible.md` | Systems → Sanity; SAN loss table; Disorders | Horror tiers and kinds, the case budget, phobia subjects, trigger tags (liars, echoes) |
| `games/black-lantern/bible.md` | Systems → Motivations | 1–2 motivation moments per case |
| `games/black-lantern/bible.md` | Skills and menus → Skill unlocks; Overstepping and cover stories | Hotspot options; open case, so the first step is Local chief; 2–3 cover stories plus the weak one |
| `games/black-lantern/bible.md` | Agents and items → Items; Where items come from | Case-only items, Lantern Boxes, loot table, requisition |
| `games/black-lantern/bible.md` | Combat → Enemies and difficulty; Bosses; Lasting injuries | Threat skulls, enemy cards, horror on sight, the boss's weakening choice and tuning check |
| `games/black-lantern/bible.md` | Art → all sections | Style, palette accents, Storybook faces, maps, light, townsfolk and monsters, Shared Shelf first |
| `studio-bible/studio.md` | No real brands | Look-alike names only |
| `games/black-lantern/specs/007-debrief-and-case-gains.md`, `008-home-phase.md`, `009-season-flow.md` | All | The debrief, the home phase and the season queue the case plugs into |

## The case at a glance

| Piece | Plan |
| --- | --- |
| Length | 1–2 hours, one case |
| Open or quiet | **Open.** The agents arrive with badges and check in with the sheriff, so Overstepping's first step is Local chief, and the sheriff is already a character, not a surprise |
| Day and night | Two days. Day 1 afternoon to evening in town; night 1 is short (the motel and one watched street); day 2 in town and at the fair; night 2 is the fair's last night and the climax. Story beats turn day to night, as the Gameplay loop sets. **A soft clock:** some choices cost time (a long drive to the county seat, a stakeout), and time spent costs a better ending, never progress |
| Points of no return | `studio-bible/play.md`; Systems → Gameplay loop, Turning the day. **Day 1 to night 1, night 1 to day 2, day 2 to night 2** each wait for Go on / Not yet. Day 2 to night 2 closes the **county morgue** (day only) and the fair by day, so its line names them. The boss waits for you as usual. The case file lists anything else a turn closes |
| Maps | **Main Street** (the diner, the gas station, the sheriff's office, the motel, the grain co-op's front): day and night. **Elm and Third** (a residential block with the watched houses): day and night. **The county morgue** (a clinic basement two towns over, reached by car): day only. **The fairground** (midway, livestock barn, grandstand, ride field): day 2, then night 2. **The finale area**, which the case file names and places |
| Story fights | **2.** One human (2 skulls), which Persuade's Lean on them can stop before it starts. One unnatural (2 skulls). Plus the boss |
| Danger zones | **1:** the fairground on night 2, with 2–3 roamers in plain sight, each guarding something (a clue, a shortcut, a person, a Lantern Box) |
| Boss | 3 skulls. At least one case choice weakens it (by kind: what you learned and who you protected, as the case file sets), and a weakness Identify can find. Target 8–12 rounds against a careful party that skipped the weakening choices, 5–8 when it made them all |
| Clue style | **Threshold plus bonus.** About 6 clues; 3 open the way to night 2. Extras weaken the boss, add intel, or open better cover stories and a better ending |
| Deduction | One deduction before night 2. A wrong answer costs time or a better ending, never progress (Gameplay loop) |
| Skills it calls on | Persuade, Empathy, Bureaucracy, Forensics, Search, Computers, History, Occult, Stealth, Firearms. Every team template must be able to reach night 2 |
| Hidden hotspot | At least one hidden unnatural hotspot that shows only while the lead is High on Mushrooms (Agents and items → Item list, Mushrooms; set Nov 23, 2026). What it is and what it gives go in the secret case file. The first case built with one also builds the reveal |
| Motivation moments | 2: one for **Protect the innocent**, one for **Find the truth** |
| Horrors | About 3 Unsettling or Disturbing, 1–2 Severe, 1 Shattering, and the Boss, inside the case budget (6–10 net SAN). Kinds: mostly unnatural and helplessness. **Liar tags** for Paranoia are common here, since half the town is hiding something small |
| Overstepping | Many choices overstep, and most are seen (the town talks, the sheriff watches). Each says how public it is. The **extreme case flag** for Local chief arriving as a fight with deputies is **off** |
| Cover stories | 2 strong ones (Persuade and Bureaucracy) plus the weak Luck story. Clean books adds its safe one as always |
| Ending labels | `clean`, `costly`, `worst` (Federal agents' shutdown also plays `worst`) |
| Lantern Boxes and loot | 1 Lantern Box (2–3 catalog items). A loot table of 5 field items that fit a farm town and a fair. Up to 3 case-only items, at least one unnatural, so bag or hide has a real choice |
| Briefing | Big Hat's backdrop for this case: the cab of a parked combine behind a truck stop off I-70, dusk, the fair's lights far off across the wheat (Cast → Big Hat, Backdrop: a new place each case; set Nov 23, 2026). Part A draws it as the case's briefing backdrop, in the back room's layout (spec 013: Big Hat's bust centered, the place behind him). Two questions from four topics, each an INTEL note and a small edge (spec 013); the case file writes the four topics, spoiler-free |
| Requisition | As usual at the briefing |

## Art

Late summer on the plains: dry grass, hot white sky by day, sodium orange and fair-ride colors by night. **No autumn pieces** (pumpkins, hay bales, autumn trees, falling leaves) from the Shared Shelf.

- **From the Shared Shelf (v1):** the sprite method and person template, street light, bench, dirt road, sidewalk, grass, picket fence, walls, roofs, windows, doors, awning, dusk lighting.
- **New for this case**, on its own Asset Library page made from the Still Harvest one:
  - **Main Street:** flat-front brick storefronts with painted signs (look-alike names only), a gas station with one pump, a grain co-op with an elevator tower in the background, a water tower, a blinking traffic light.
  - **Elm and Third:** ranch houses and porches (Shared Shelf walls and roofs where they fit), a parked tinted black car.
  - **Interiors:** the sheriff's office, the diner, a motel room, the morgue.
  - **The fairground:** a Ferris wheel and a spinner ride, game booths, string lights, a livestock barn, the grandstand. Rides can turn with nobody on them at night.
  - **Townsfolk:** the sheriff, a deputy, the coroner, a diner waitress, a fair worker, and a family on Elm Street, plus 2–3 more the case file needs. About 1 in 3 with one weird trait (Art → Townsfolk and monsters). Map sprites and 64 × 64 portraits.
  - **The two men:** map sprites in black suits and dark glasses, and 64 × 64 portraits since they talk. Their night treatment is the case file's call, kept to what doesn't spoil.
  - **Monsters:** whatever the case file designs, following Art → Townsfolk and monsters, with battle art in the pattern Demo 5 part B sets.
  - **Palette accents:** wheat gold, sodium orange, fair-ride cyan and pink.
- **Candidates for the Shared Shelf** (flag for Keegan's OK first, Season readiness step 6): the plains main street pieces (flat-front brick, painted sign blank, water tower, traffic light), the ranch house, the Ferris wheel and booths, string lights, and the summer versions of grass and trees.

## What to build

### Part A: maps and art (To do: Good Manners part A)

- A new `cases/good-manners.js` with its `caseCard` and `registerCase`, and its entry in the season data file's queue (spec 009, step 1).
- Every map above, drawn in the 3/4 view at Wide scale, with day and night versions as listed and the low-SAN look below 40 (spec 005).
- Every townsperson and the two men, with map sprites and portraits.
- Stand-in scripts so each map can be walked and every door goes where it should, with a placeholder briefing. No clues, fights or story yet.
- The case's own art goes on its Asset Library page first (Story → Adding a new case, step 6).

### Part B: story and play (To do: Good Manners part B)

- **First,** the Developer writes the secret case file, `games/black-lantern/story/cases/good-manners.md`, following this spec: what the men are and want, why people die, the clue IDs and what each proves, the deduction, the choices that matter, overstepping marks and how public each is, enemy cards, the boss's phases and weakening choice, the motivation moments, horror tags, and what each ending label means. Every deduction maps to clue IDs.
- **Then** the text block and scripts: the briefing, every scene and line in Keegan's voice, hotspots and their skill options, the two story fights, the danger zone and its roamers, the boss and its tuning check, items and the Lantern Box, cover stories, and the debrief's facts and ending label (spec 007).
- **Arc touches,** if the arc file asks for any, go in quietly and never appear in a commit, the changelog or the bible.

### Saves

A new case file needs no new save version on its own (spec 004, step 6). If part B adds anything new to what a save holds, it adds an upgrade step and test saves as usual.

## Must stay true

- Still Harvest, the board, the debrief, the home phase and the season flow work as before.
- Old saves keep opening, every test save included.
- No real brand names or logos anywhere in the case.
- Nothing a player could only learn by playing appears in this spec, the changelog, the bible or a commit message.

## Done when

- `npm run check` passes at all three sizes.
- After part A: every map walks, day and night, and every townsperson shows their sprite and portrait.
- After part B: a playtest start to finish through each ending label, a run that oversteps up to Agency call, a talked-down human fight and a fought one, and a game over that reopens the case.
- The boss tuning check passes (Combat → Bosses).
- `changelog.md` has a dated entry per part, with any deviations, and the To do lines are ticked.
