# Spec 016: Lost Hour

Status: proposed, waiting for Keegan's merge · Written 2026-11-22 by the Game Designer · Game: Black Lantern · To do: Lost Hour part A and part B

## In plain words

Ray and Donna Pruett live in Cullen Gap, Virginia, a small town on a two-lane road through the Blue Ridge, in April. Driving home from their daughter's wedding along the ridge road, they left the reception at ten and pulled into their driveway at a quarter past three, with a full tank they hadn't filled, a scorched ring on the hood and no memory of the hours between. Since then Donna can't sleep without the lights on, Ray has a lump behind his ear the doctor won't explain, and a hiker found their wedding card on the overlook, a hundred feet off the road, folded into a shape nobody can unfold. Big Hat sends the agents in as researchers from a sleep study the couple signed up for: get the missing hours back, and the lump out, before the couple start talking to the paper.

What it feels like to play: a quiet case about two frightened, decent people. By day it's kitchen-table interviews, a small-town sleep clinic and a diner that remembers everyone, with Medicine, Empathy and Science doing the work. The case has two set pieces: a night drive up the ridge road in fog, retracing the couple's route, and a hypnosis session where what Ray and Donna remember plays out in front of the team. The dread is in the gaps: a timeline with a hole in it, a body that's been handled, and lights over the trees that don't blink like planes.

Picked pitch: [`pitches/round-03.md`](../pitches/round-03.md), option B, picked Nov 22, 2026.

**Spoiler rule:** this spec gives only structure and mechanics. It never says who or what took the couple, what the lump is, what the folded card means, or how it ends. That goes in the secret case file (Story → Adding a new case, step 5).

## The card

| Field | Value |
| --- | --- |
| File number | `FILE 04` |
| Title | `LOST HOUR` |
| Town (on the card) | `CULLEN GAP` |
| Place line | `RIDGE ROAD · CULLEN GAP, VA` |
| Hook, line 1 | `Ten to three. Nobody remembers.` |
| Hook, line 2 | `The car came home with a full tank.` |
| Pin color | fog violet `#c8b8ff` |
| Heaviest themes | Medical horror, a marriage under strain, paranoia, a hard choice about people who did nothing wrong |
| Season slot | Regular case, Season 1 |

The card's words live in `cases/lost-hour.js`'s text block (`caseCard`), as for Still Harvest (spec 004, step 3).

## Bible sections this spec relies on

| Source | Section | What it sets |
| --- | --- | --- |
| `games/black-lantern/bible.md` | Story → Adding a new case | The pipeline; the case spec is public-safe; the secret case file is the Developer's, in the Project files |
| `games/black-lantern/bible.md` | Story → Case board; Agency arc | The card; the case joins the season's queue |
| `games/black-lantern/bible.md` | Story → Your original material | The Classic abduction seed (every name changed) |
| `games/black-lantern/bible.md` | Overview → Mature content | Heaviest themes on the card; what's shown and what's off screen (the medical exam stays mostly off screen) |
| `games/black-lantern/bible.md` | Voice | Lines, jokes and dread |
| `games/black-lantern/bible.md` | Systems → Gameplay loop | 1–2 hours; 2–3 story fights plus the boss; 0–2 danger zones; roamers; clues (here, threshold plus bonus); deduction never dead-ends; time; choices; healing; game over |
| `games/black-lantern/bible.md` | Systems → Sanity; SAN loss table; Disorders | Horror tiers and kinds, the case budget, phobia subjects, trigger tags |
| `games/black-lantern/bible.md` | Systems → Motivations | 1–2 motivation moments per case |
| `games/black-lantern/bible.md` | Skills and menus → Skill unlocks; Overstepping and cover stories | Hotspot options; quiet case, so the first step is Noticed; 2–3 cover stories plus the weak one; a quiet, clean case can offer an easy story |
| `games/black-lantern/bible.md` | Agents and items → Items; Where items come from | Case-only items, Lantern Boxes, loot table, requisition |
| `games/black-lantern/bible.md` | Combat → Enemies and difficulty; Bosses; Lasting injuries | Threat skulls, enemy cards, horror on sight, the boss's weakening choice and tuning check |
| `games/black-lantern/bible.md` | Art → all sections | Style, palette accents, Storybook faces, maps, light, townsfolk and monsters, Shared Shelf first |
| `studio-bible/studio.md` | No real brands | Look-alike names only (the clinic, the diner, the couple's car, anything on a sign) |
| `games/black-lantern/specs/007-debrief-and-case-gains.md`, `008-home-phase.md`, `009-season-flow.md` | All | The debrief, the home phase and the season queue the case plugs into |

## The case at a glance

| Piece | Plan |
| --- | --- |
| Briefing | Big Hat's backdrop for this case: a 24-hour laundromat off I-81 at 4 AM, dryers turning, one flickering tube light (Cast → Big Hat, Backdrop: a new place each case; set Nov 23, 2026). Part A draws it as the case's briefing backdrop, in the back room's layout (spec 013: Big Hat's bust centered, the place behind him). Two questions from four topics, each an INTEL note and a small edge (spec 013); the case file writes the four topics, spoiler-free |
| Length | 1–2 hours, one case |
| Open or quiet | **Quiet.** The agents come in as sleep-study researchers, so Overstepping's first step is **Noticed**, then Local chief. The couple trust the cover; their daughter, the diner and the town's one deputy are less sure. Pushing the couple too hard (a scene in public, treatment they didn't agree to) is what cracks it |
| Day and night | **Two days.** Day 1 (afternoon) in town: the Pruetts' house, the diner, the clinic. A story beat at dusk sends the team up the ridge road, which turns it to **night 1, the drive**: the overlook, the road and the woods off it. Day 2 is the clinic: the hypnosis session and the exam. Night 2 is the climax, where the case file sets it. **A soft clock:** the couple are close to calling the paper. Time spent (a second drive, resting, a long stakeout) costs a better ending, never progress |
| Points of no return | `studio-bible/play.md`; Systems → Gameplay loop, Turning the day. **The drive up the ridge (day 1 to night 1), night 1 to day 2, and day 2 to night 2** each wait for Go on / Not yet. The ridge road is night only, so leaving night 1 closes it and its woods, and its line names them. The boss waits for you as usual. The case file lists anything else a turn closes |
| Maps | **Cullen Gap** (a short main street with the diner, the clinic in an old bank building, the Pruetts' house on a side street): day and night. **Interiors:** the Pruetts' kitchen and bedroom, the diner, the clinic's waiting room, sleep lab and exam room. **The ridge road** (a two-lane stretch with a guardrail, a pull-off and the overlook with its coin viewer): night only, in fog. **The woods** below the overlook: night only. **The finale area**, which the case file names and places |
| Set pieces | **The night drive:** the ridge road plays as a walkable map, but fog cuts how far the lantern reaches, and the couple's route is the trail. **The hypnosis session:** a scene in the sleep lab where an Empathy or Medicine roll guides what Ray or Donna remember; each memory is a clue, and pushing too far costs the subject SAN and the team the couple's trust. The case file sets how many memories and what each costs |
| Story fights | **2, both unnatural.** One small (1 skull) on the ridge road on night 1, which teaches the case's enemy. One larger (2 skulls). Plus the boss. No human fight; the people in this case are scared, not hostile |
| Danger zones | **1:** the woods below the overlook on night 1. 2–3 roamers in the fog, each guarding something (a clue, a shortcut back up to the road, the Lantern Box, a thing the couple left behind). Survival finds a safe way down; Stealth slips past |
| Boss | 3 skulls. At least one case choice weakens it (by kind: what you learned from the couple and what you did about the lump, as the case file sets), and a weakness Identify can find. Target 8–12 rounds against a careful party that skipped the weakening choices, 5–8 when it made them all |
| Clue style | **Threshold plus bonus, as a timeline.** About 6–7 clues, each filling a piece of the missing hours (10 PM to 3:15 AM) on the Case file's timeline. 3 open the way to night 2. Extras weaken the boss, add intel, or open better cover stories and a better ending |
| Deduction | One deduction before the finale, from the timeline. A wrong answer costs time or a better ending, never progress (Gameplay loop) |
| Skills it calls on | Medicine, Empathy, Science, Search, Survival, Occult, Persuade, Computers, Forensics, Stealth. Every team template must be able to reach the finale |
| Motivation moments | 2: one for **Revenge** (changed Nov 23, 2026 from Family, which Lot 83 covers: someone did this to the couple, and the agent who holds Revenge can make it cost them), one for **Duty** |
| Horrors | About 3–4 Unsettling or Disturbing, 1–2 Severe, 0–1 Shattering, and the Boss, inside the case budget (6–10 net SAN). Kinds: mostly unnatural, plus helplessness. A **phobia subject** fits the case's medical side; the case file names it |
| The hard choice | The pitch's "hard choice about people who did nothing wrong" is a real choice with a stake, and the endings react to it. The case file sets what it is. Every option has a cost; none is a trap |
| Overstepping | The cover is soft: the couple asked for help. A choice that treats them as evidence instead of patients, or a scene in town, marks someone saw. On the ridge at night, most choices are unseen. The **extreme case flag** for Local chief arriving as a fight with deputies is **off** |
| Cover stories | 2 strong ones (Medicine and Bureaucracy) plus the weak Luck story. Since it's a quiet case, a clean run also offers the easy one (Overstepping and cover stories). Clean books adds its safe one as always |
| Ending labels | `clean`, `costly`, `worst` (Federal agents' shutdown also plays `worst`) |
| Lantern Boxes and loot | 1 Lantern Box (2–3 catalog items). A loot table of 5 field items that fit a small town and a clinic. Up to 3 case-only items, at least one unnatural, so bag or hide has a real choice. A **new generic item** (a sedative syringe or a road flare) is a candidate for the shared item list, if the case file uses it |
| Requisition | As usual at the briefing |

## Art

April in the Blue Ridge: new green, redbud and dogwood blossom, wet asphalt and mud by day; by night, thick fog that swallows the lantern a few tiles out, with one cold light above the trees. **No autumn pieces** (pumpkins, hay bales, autumn trees, falling leaves) and no summer-only pieces (dry grass, heat shimmer) from the Shared Shelf.

- **From the Shared Shelf (v1):** the sprite method and person template, street light, sidewalk, walls (brick and siding), roofs, windows, doors, awning, dusk lighting.
- **From the summer art kits (spec 012), if they're on the Shelf first:** main street storefronts and sign blanks, the ranch house and porch, the parked car, and the interiors kit (floors, inner walls, counter with stools, table and chairs, desk, bed, kitchen).
- **New for this case**, on its own Asset Library page made from the Still Harvest one:
  - **Cullen Gap:** the clinic in an old bank building (columns, a night-deposit slot), the diner front with its sign (look-alike name), the Pruetts' house with a carport and their car with the scorched ring on the hood.
  - **Interiors:** the sleep lab (a bed with wires, a monitor, a one-way window), an exam room, the diner's booths, the Pruetts' kitchen with wedding photos.
  - **The ridge road:** two-lane asphalt with a yellow center line and a guardrail, a pull-off, the overlook's stone wall and coin viewer, mile markers.
  - **The woods:** steep slope, rhododendron thickets, rocks and a creek, in fog.
  - **The folded card:** a small prop that reads on screen.
  - **Townsfolk:** Ray and Donna, their daughter, the diner owner, the clinic's night tech, the town deputy, the hiker who found the card, plus 1–2 more the case file needs. About 1 in 3 with one weird trait (Art → Townsfolk and monsters). Map sprites and 64 × 64 portraits.
  - **Monsters:** whatever the case file designs, following Art → Townsfolk and monsters, with battle art in the pattern Demo 5 part B sets.
  - **Palette accents:** fog violet, redbud pink, wet-asphalt blue, and the one cold white light.
- **Candidates for the Shared Shelf** (flag for Keegan's OK first, Season readiness step 6): spring grass and blossom trees, mud, a fog effect, the two-lane road with center line and guardrail, the stone overlook wall and coin viewer, mile markers, steep wooded slope and creek, and the sleep lab bed and monitor if they read as generic (a hospital bed).

## What to build

### Part A: maps and art (To do: Lost Hour part A)

- A new `cases/lost-hour.js` with its `caseCard` and `registerCase`, and its entry in the season data file's queue after Lot 83 (spec 009, step 1).
- Every map above, drawn in the 3/4 view at Wide scale, with day and night versions as listed and the low-SAN look below 40 (spec 005). Fog on the ridge road and in the woods shrinks the lantern's light; below 40 SAN it shrinks further, as Art → Light and mood sets.
- Every townsperson, with map sprites and portraits.
- Stand-in scripts so each map can be walked and every door goes where it should, with a placeholder briefing. No clues, fights or story yet.
- The case's own art goes on its Asset Library page first (Story → Adding a new case, step 6).

### Part B: story and play (To do: Lost Hour part B)

- **First,** the Developer writes the secret case file, `claude/cases/lost-hour.md`, in the Black Lantern Claude Project files, following this spec: what happened on the ridge road, what the lump is, what the card means, the clue IDs and which piece of the timeline each fills, the hypnosis memories and their costs, the deduction, the hard choice and its options, the choices that matter, overstepping marks and how public each is, enemy cards, the boss's phases and weakening choice, the motivation moments, horror tags and the phobia subject, and what each ending label means. Every deduction maps to clue IDs.
- **Then** the text block and scripts: the briefing, every scene and line in Keegan's voice, hotspots and their skill options, the timeline on the Case file, the night drive and the hypnosis session, the two story fights, the danger zone and its roamers, the boss and its tuning check, items and the Lantern Box, cover stories, and the debrief's facts and ending label (spec 007).
- **Arc touches,** if the arc file asks for any, go in quietly and never appear in a commit, the changelog or the bible.

### Saves

A new case file needs no new save version on its own (spec 004, step 6). The timeline and the hypnosis results live inside the case's own checkpoint data, like any case state. If part B adds anything new to what a save holds outside that, it adds an upgrade step and test saves as usual.

## Must stay true

- Still Harvest, Good Manners, Lot 83, the board, the debrief, the home phase and the season flow work as before.
- Old saves keep opening, every test save included.
- No real brand names or logos anywhere in the case.
- Nothing a player could only learn by playing appears in this spec, the changelog, the bible or a commit message.

## Done when

- `npm run check` passes at all three sizes.
- After part A: every map walks, day and night, the fog reads on the iPhone SE screen without hiding where you can walk, and every townsperson shows their sprite and portrait.
- After part B: a playtest start to finish through each ending label, a run that pushes the hypnosis too far, a run where the cover slips to Noticed and on to Local chief, a run that takes each option of the hard choice, and a game over that reopens the case.
- The boss tuning check passes (Combat → Bosses).
- `changelog.md` has a dated entry per part, with any deviations, and the To do lines are ticked.
