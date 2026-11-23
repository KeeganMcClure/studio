# Spec 020: Dead Air

Status: proposed, waiting for Keegan's merge · Written 2026-11-23 by the Game Designer · Game: Black Lantern · To do: Dead Air part A and part B

## In plain words

Halcott, Louisiana, a sugarcane parish town in early March. KHLT went off the air in 1979, and its tower on the edge of the cane fields has been dark since. Two weeks ago every radio in the parish started picking it up at 3 AM: a late-night call-in show, a host nobody can name, and callers who say the names of people in town. Two of the people named have gone missing, and the parish has started blaming whoever owns a radio that's still plugged in. The sheriff called it in himself. Big Hat sends the agents in with badges, as federal radio inspectors: silence the station, find the missing, and find out who's been calling in.

What it feels like to play: Good Manners' kind of case, open and led by talk, in a small town that's scared and getting mean. By day it's the sheriff's office, the families of the missing, the feed store, and the Friday fish fry where the whole town is in one room. At 3 AM the show comes on, and the team listens from a porch while the host takes calls. Computers and Craft trace the signal; Persuade and Empathy keep the town from turning on its own. The dread is in the voice: it knows things about people it shouldn't, and it gets closer to the mic each night.

Picked pitch: [`pitches/round-05.md`](../pitches/round-05.md), option C, picked Nov 23, 2026.

**Spoiler rule:** this spec gives only structure and mechanics. It never says who the host is, who the callers are, why these names, what happened to the missing, what happened at KHLT in 1979, or how it ends. That goes in the secret case file (Story → Adding a new case, step 5).

## The card

| Field | Value |
| --- | --- |
| File number | `FILE 06` |
| Title | `DEAD AIR` |
| Town (on the card) | `HALCOTT` |
| Place line | `KHLT 1340 AM · HALCOTT, LA` |
| Hook, line 1 | `A dead station is back at 3 AM.` |
| Hook, line 2 | `Its callers know who's next.` |
| Pin color | tower red `#ff4a3d` |
| Heaviest themes | Missing people, grief, a town turning on its own, an old crime (off screen) |
| Season slot | Regular case, Season 1 |

The card's words live in `cases/dead-air.js`'s text block (`caseCard`), as for Still Harvest (spec 004, step 3). The station's call letters are made up; the Developer checks they aren't a real station's before the build ships, and swaps them if they are.

## Bible sections this spec relies on

| Source | Section | What it sets |
| --- | --- | --- |
| `games/black-lantern/bible.md` | Story → Adding a new case | The pipeline; the case spec is public-safe; the secret case file is the Developer's, in the Project files |
| `games/black-lantern/bible.md` | Story → Case board; Agency arc | The card; the case joins the season's queue |
| `games/black-lantern/bible.md` | Story → Your original material | Flavor: the sketchy rural gas station. No seed; an original case |
| `games/black-lantern/bible.md` | Overview → Mature content | Heaviest themes on the card; the old crime stays off screen |
| `games/black-lantern/bible.md` | Voice | Lines, jokes and dread |
| `games/black-lantern/bible.md` | Systems → Gameplay loop | 1–2 hours; 2–3 story fights plus the boss; 0–2 danger zones; roamers; clues (here, threshold plus bonus); deduction never dead-ends; time; choices; healing; game over |
| `games/black-lantern/bible.md` | Systems → Sanity; SAN loss table; Disorders | Horror tiers and kinds, the case budget, phobia subjects, trigger tags |
| `games/black-lantern/bible.md` | Systems → Motivations | 1–2 motivation moments per case |
| `games/black-lantern/bible.md` | Skills and menus → Skill unlocks; Overstepping and cover stories | Hotspot options and Persuade's Lean on them; open case, so the first step is Local chief; 2–3 cover stories plus the weak one |
| `games/black-lantern/bible.md` | Agents and items → Items; Where items come from | Case-only items, Lantern Boxes, loot table, requisition |
| `games/black-lantern/bible.md` | Combat → Enemies and difficulty; Bosses; Lasting injuries | Threat skulls, enemy cards, horror on sight, the boss's weakening choice and tuning check |
| `games/black-lantern/bible.md` | Art → all sections | Style, palette accents, Storybook faces, maps, light, townsfolk and monsters, Shared Shelf first |
| `studio-bible/studio.md` | No real brands | Look-alike names only (the station, the feed store, the bait shop, any radio on a porch) |
| `games/black-lantern/specs/007-debrief-and-case-gains.md`, `008-home-phase.md`, `009-season-flow.md` | All | The debrief, the home phase and the season queue the case plugs into |
| `games/black-lantern/specs/010-good-manners.md` | The case at a glance | The other open case, for contrast: Dead Air keeps its rules (sheriff as a character, Lean on them) but its own beats |

## The case at a glance

| Piece | Plan |
| --- | --- |
| Briefing | Big Hat's back room as usual, two questions from four topics, each an INTEL note and a small edge (spec 013). The case file writes the four topics, spoiler-free |
| Length | 1–2 hours, one case |
| Open or quiet | **Open.** The agents arrive with badges as federal radio inspectors and check in with the sheriff, so Overstepping's first step is Local chief, and the sheriff is already a character who wants this solved. He stays on the team's side only while the town stays calm |
| Day and night | **Two days.** Day 1 (afternoon to evening): the sheriff's office, the families of the missing, main street. **Night 1 is the first broadcast:** a short night that builds to 3 AM, when the show comes on. Day 2 is Friday: the station's records, the tower by daylight, and the fish fry at the church hall in the evening. **Night 2 is the second broadcast and the climax**, where the case file sets it. **A soft clock:** the town is getting meaner. Time spent (a long records search, resting, a wrong lead) lets the parish's fear grow, which costs a better ending, never progress |
| Points of no return | `studio-bible/play.md`; Systems → Gameplay loop, Turning the day. **Day 1 to night 1, night 1 to day 2, and day 2 to night 2** each wait for Go on / Not yet. Day 2 to night 2 closes the **fish fry** and the tower by daylight, so its line names them. The boss waits for you as usual. The case file lists anything else a turn closes |
| Maps | **Halcott** (main street with the sheriff's office, the feed store, the bait shop and a rural gas station; a side street of raised houses on piers): day and night. **Interiors:** the sheriff's office, two homes of the missing, the church hall for the fish fry, the feed store. **KHLT** (the cinder-block station, its broadcast booth and record room, the tower in a clearing): day and night. **The cane fields** around the station: night only, the danger zone. **The finale area**, which the case file names and places |
| The broadcast | **A set piece each night.** At 3 AM the show plays over the porch radio as a scene: the host, the callers, the names. Listening is how the case's biggest clues arrive, and some calls are horrors (SAN rolls from the case file). During each broadcast the team can try one thing: trace the signal (Computers or Craft), record it (Science or Computers), or call in. The case file sets what calling in gives and costs; it is a real choice, never required |
| The town | **The fish fry** on day 2 is a social scene with a stake: the parish is ready to blame someone. Persuade, Empathy and Bureaucracy can calm it, point it, or let it boil. What the team does here shapes the human fight and the endings |
| Story fights | **2.** One human (2 skulls): frightened townsfolk who've decided whose radio is to blame, which Persuade's Lean on them can stop before it starts, and which a calm fish fry can prevent. One unnatural (2 skulls). Plus the boss |
| Danger zones | **1:** the cane fields on night 2, with 2–3 roamers in the rows around the tower, each guarding something (a clue, a shortcut to the station, a missing person's trace, the Lantern Box). Survival finds a way through the rows; Stealth slips past |
| Boss | 3 skulls. At least one case choice weakens it (by kind: what the team learned from the broadcasts and what they did about the signal, as the case file sets), and a weakness Identify can find. Target 8–12 rounds against a careful party that skipped the weakening choices, 5–8 when it made them all |
| Clue style | **Threshold plus bonus.** About 6–7 clues; 3 open the way to night 2. Extras weaken the boss, add intel, or open better cover stories and a better ending |
| Deduction | One deduction before the finale. A wrong answer costs time or a better ending, never progress (Gameplay loop) |
| Skills it calls on | Persuade, Empathy, Computers, Craft, History, Bureaucracy, Search, Survival, Occult, Forensics. Every team template must be able to reach the finale |
| Motivation moments | 2: one for **Protect the innocent**, one for **Faith** |
| Horrors | About 3–4 Unsettling or Disturbing, 1–2 Severe, 0–1 Shattering, and the Boss, inside the case budget (6–10 net SAN). Kinds: mostly unnatural, plus helplessness. A **phobia subject** fits the voice; the case file names it |
| Overstepping | Many choices overstep, and most are seen: the town talks and the sheriff watches. Each says how public it is. Pulling every radio in town, or a scene at the fish fry, marks it fast. In the cane fields at night, most choices are unseen. The **extreme case flag** for Local chief arriving as a fight with deputies is **off** |
| Cover stories | 2 strong ones (Bureaucracy and Persuade) plus the weak Luck story. Clean books adds its safe one as always |
| Ending labels | `clean`, `costly`, `worst` (Federal agents' shutdown also plays `worst`) |
| Lantern Boxes and loot | 1 Lantern Box (2–3 catalog items). A loot table of 5 field items that fit a small parish town, a bait shop and a radio station. Up to 3 case-only items, at least one unnatural, so bag or hide has a real choice. A **new generic item** (a handheld radio direction finder) is a candidate for the shared item list, if the case file uses it |
| Requisition | As usual at the briefing |

## Art

Early March in south Louisiana: green coming back, wet ground, cane stubble and young cane, live oaks with Spanish moss, raised houses on piers. By night, humid dark, porch lights and moths, the tower's slow red blink over the fields, and every porch radio's dial glowing. **No autumn pieces** (pumpkins, hay bales, autumn trees, falling leaves), no snow, and no summer-only pieces (dry grass, heat shimmer) from the Shared Shelf.

- **From the Shared Shelf (v1):** the sprite method and person template, street light, sidewalk, walls (brick and siding), roofs, windows, doors, awning, dusk lighting.
- **From the summer art kits (spec 012), if they're on the Shelf first:** storefronts and sign blanks, the gas pump, the porch, the parked car, sodium and bug-light night light, and the interiors kit (floors, inner walls, counter, table and chairs, desk, shelving, boxes).
- **From the spring art kits (spec 017):** spring grass, mud, the fog effect for low ground at night, and the two-lane road.
- **From the winter and city kits (spec 019), if they're on the Shelf first:** the CRT TV, VCR and wood paneling for the station's booth, and the pole sign blank.
- **New for this case**, on its own Asset Library page made from the Still Harvest one:
  - **Halcott:** the sheriff's office, the feed store and bait shop fronts with signs (look-alike names), the church hall, raised houses on piers.
  - **KHLT:** the cinder-block station with its dead sign, the broadcast booth (mic, mixing board, cart machines, the ON AIR light), the record room, and the tower with its red light.
  - **Interiors:** the sheriff's office, two homes of the missing with one detail each, the church hall set for a fish fry, the feed store.
  - **The broadcast:** the porch radio with a glowing dial as a close-up, and a simple on-screen look for the show (a dial and a waveform), drawn in code.
  - **Townsfolk:** the sheriff, a deputy, the families of the two missing, the feed store owner, the pastor, a fish fry cook, a gas station clerk, plus 1–2 more the case file needs. About 1 in 3 with one weird trait (Art → Townsfolk and monsters). Map sprites and 64 × 64 portraits.
  - **Monsters:** whatever the case file designs, following Art → Townsfolk and monsters, with battle art in the pattern Demo 5 part B sets.
  - **Palette accents:** tower red, radio-dial amber, moss grey-green, and cane-field gold.
- **Candidates for the Shared Shelf** (flag for Keegan's OK first, Season readiness step 6): sugarcane field (stubble and young cane), live oak with Spanish moss, bayou edge with cypress knees, a raised house on piers, a radio or cell tower with a blinking light, a porch radio, a cinder-block building, and a mic and mixing board if they read as generic.

## What to build

### Part A: maps and art (To do: Dead Air part A)

- A new `cases/dead-air.js` with its `caseCard` and `registerCase`, and its entry in the season data file's queue after Tracking (spec 009, step 1).
- Every map above, drawn in the 3/4 view at Wide scale, with day and night versions as listed and the low-SAN look below 40 (spec 005).
- The broadcast's on-screen look, readable on the iPhone SE screen with the dialog box up.
- Every townsperson, with map sprites and portraits.
- Stand-in scripts so each map can be walked and every door goes where it should, with a placeholder briefing. No clues, fights or story yet.
- The case's own art goes on its Asset Library page first (Story → Adding a new case, step 6).

### Part B: story and play (To do: Dead Air part B)

- **First,** the Developer writes the secret case file, `claude/cases/dead-air.md`, in the Black Lantern Claude Project files, following this spec: who the host and callers are, why these names, what happened to the missing and at KHLT in 1979, each broadcast's calls and which are clues or horrors, what tracing, recording and calling in give and cost, the fish fry's outcomes, the clue IDs and what each proves, the deduction, the choices that matter, overstepping marks and how public each is, enemy cards, the boss's phases and weakening choice, the motivation moments, horror tags and the phobia subject, and what each ending label means. Every deduction maps to clue IDs.
- **Then** the text block and scripts: the briefing, every scene and line in Keegan's voice, hotspots and their skill options, both broadcasts, the fish fry, the two story fights, the danger zone and its roamers, the boss and its tuning check, items and the Lantern Box, cover stories, and the debrief's facts and ending label (spec 007).
- **Arc touches,** if the arc file asks for any, go in quietly and never appear in a commit, the changelog or the bible.

### Saves

A new case file needs no new save version on its own (spec 004, step 6). The broadcasts heard, the town's mood and the fish fry's outcome live inside the case's own checkpoint data, like any case state. If part B adds anything new to what a save holds outside that, it adds an upgrade step and test saves as usual.

## Must stay true

- Still Harvest, Good Manners, Lot 83, Lost Hour, Tracking, the board, the debrief, the home phase and the season flow work as before.
- Old saves keep opening, every test save included.
- No real brand names or logos anywhere in the case, and no real station's call letters.
- Nothing a player could only learn by playing appears in this spec, the changelog, the bible or a commit message.

## Done when

- `npm run check` passes at all three sizes.
- After part A: every map walks, day and night, the broadcast look reads on the iPhone SE screen, and every townsperson shows their sprite and portrait.
- After part B: a playtest start to finish through each ending label, a run that calms the fish fry and one that lets it boil, a run that calls in and one that never does, a run where overstepping climbs past Local chief, and a game over that reopens the case.
- The boss tuning check passes (Combat → Bosses).
- `changelog.md` has a dated entry per part, with any deviations, and the To do lines are ticked.
