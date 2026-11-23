# Spec 018: Tracking

Status: proposed, waiting for Keegan's merge · Written 2026-11-23 by the Game Designer · Game: Black Lantern · To do: Tracking part A and part B

## In plain words

Reno, Nevada, in winter. A VHS tape turned up in a pawn shop's five-for-a-dollar bin on Fourth Street with "WE KNOW" written on the label. The clerk watched it on a Tuesday. By Friday he'd covered his windows in foil and started writing the same three words on everything he owned. The tape shows a dancer at a club that closed in 1996, sick and covered in sores, moving faster than a person should, while someone off camera chants. Big Hat sends the agents in as collectors buying up old tapes: find every copy, and find out why the dancer on the tape still looks the same in a photo taken last month.

What it feels like to play: a trail through a cold city at night. It's a quiet case where each copy of the tape you find points to the next person who had one, so the case moves from hand to hand: the pawn shop, a weekly motel, a collector's apartment, the club that closed thirty years ago. Computers, History and Occult carry it. The tape itself is a choice: watching a copy tells you things nothing else will, and it costs you. The longer the case goes on, the more the tape's tracking lines creep in at the edges of the screen.

Picked pitch: [`pitches/round-04.md`](../pitches/round-04.md), option C, picked Nov 23, 2026 (pitched first in round 1).

**Spoiler rule:** this spec gives only structure and mechanics. It never says what the tape is, who the dancer is, who's chanting, what "WE KNOW" means, or how it ends. That goes in the secret case file (Story → Adding a new case, step 5).

## The card

| Field | Value |
| --- | --- |
| File number | `FILE 05` |
| Title | `TRACKING` |
| Town (on the card) | `RENO` |
| Place line | `FOURTH STREET · RENO, NV` |
| Hook, line 1 | `A pawn-shop tape says WE KNOW.` |
| Hook, line 2 | `Everyone who watched it agrees.` |
| Pin color | neon magenta `#ff3fa4` |
| Heaviest themes | Addiction, exploitation (off screen), body horror, self-harm |
| Season slot | Regular case, Season 1 |

The card's words live in `cases/tracking.js`'s text block (`caseCard`), as for Still Harvest (spec 004, step 3).

## Bible sections this spec relies on

| Source | Section | What it sets |
| --- | --- | --- |
| `games/black-lantern/bible.md` | Story → Adding a new case | The pipeline; the case spec is public-safe; the secret case file is the Developer's, in the Project files |
| `games/black-lantern/bible.md` | Story → Case board; Agency arc | The card; the case joins the season's queue |
| `games/black-lantern/bible.md` | Story → Your original material | The "WE KNOW" tape seed (every name changed) |
| `games/black-lantern/bible.md` | Overview → Mature content | Heaviest themes on the card; exploitation and self-harm stay off screen |
| `games/black-lantern/bible.md` | Voice | Lines, jokes and dread |
| `games/black-lantern/bible.md` | Systems → Gameplay loop | 1–2 hours; 2–3 story fights plus the boss; 0–2 danger zones; roamers; clues (here, clues as keys); deduction never dead-ends; time; choices; healing; game over |
| `games/black-lantern/bible.md` | Systems → Sanity; SAN loss table; Disorders | Horror tiers and kinds, the case budget, phobia subjects, trigger tags; Addiction |
| `games/black-lantern/bible.md` | Systems → Motivations | 1–2 motivation moments per case |
| `games/black-lantern/bible.md` | Skills and menus → Skill unlocks; Overstepping and cover stories | Hotspot options; quiet case, so the first step is Noticed; 2–3 cover stories plus the weak one; a quiet, clean case can offer an easy story |
| `games/black-lantern/bible.md` | Agents and items → Items; Where items come from | Case-only items, Lantern Boxes, loot table, requisition |
| `games/black-lantern/bible.md` | Combat → Enemies and difficulty; Bosses; Lasting injuries | Threat skulls, enemy cards, horror on sight, the boss's weakening choice and tuning check |
| `games/black-lantern/bible.md` | Art → all sections | Style, palette accents, Storybook faces, maps, light, townsfolk and monsters, Shared Shelf first |
| `studio-bible/studio.md` | No real brands | Look-alike names only (the casinos, the pawn shop, the motel, the club, anything on a tape label) |
| `games/black-lantern/specs/007-debrief-and-case-gains.md`, `008-home-phase.md`, `009-season-flow.md` | All | The debrief, the home phase and the season queue the case plugs into |

## The case at a glance

| Piece | Plan |
| --- | --- |
| Briefing | Big Hat's back room as usual, two questions from four topics, each an INTEL note and a small edge (spec 013). The case file writes the four topics, spoiler-free |
| Length | 1–2 hours, one case |
| Open or quiet | **Quiet.** The agents pose as collectors buying old tapes, so Overstepping's first step is **Noticed**, then Local chief. Pawn-shop owners, the motel desk and a city beat cop all notice people paying too much for junk. Flashing anything official or making a scene on the street is what cracks it |
| Day and night | **Two short days and two nights**, mostly at night: Reno in winter gets dark early. Day 1 (late afternoon) is the pawn shop and Fourth Street; night 1 follows the first lead (the motel and whoever had the tape before). Day 2 is records and the collector; night 2 is the closed club and the climax. **A soft clock:** the copies keep moving, and someone else is watching them. Time spent (a long records search, resting, a wrong turn on the trail) costs a better ending, never progress |
| Maps | **Fourth Street** (a few blocks of pawn shops, a bus stop, the motel's lot and sign, casino signs glowing at the street's end): day and night, snow on both. **Interiors:** the pawn shop, the clerk's foil-covered apartment, two motel rooms, a collector's apartment full of tapes, a records room the case file names. **The club** (closed since 1996): night only, the danger zone. **The finale area**, which the case file names and places |
| The trail | **Clues as keys, as a chain of hands.** About 6–7 clues; each copy of the tape or person who had one opens the next place on the trail. The case file sets the chain and always gives a second way to the next link (a record, a phone, a person who talks), so the trail never dead-ends |
| Watching the tape | **A choice with a stake.** At each copy, an agent can watch it. Watching gives a clue or intel nothing else gives, costs SAN (a horror from the case file), and adds a step to the screen's tracking lines. Not watching is always allowed and never blocks the case. The case file sets what the tracking lines mean beyond the look, and whether the boss or endings react to how many times the team watched |
| Story fights | **2.** One human (2 skulls): someone guarding a copy who won't sell, which Persuade's Lean on them can stop before it starts. One unnatural (2 skulls). Plus the boss |
| Danger zones | **1:** the closed club on night 2. 2–3 roamers in the dark rooms and on the old dance floor, each guarding something (a clue, a copy, a shortcut, the Lantern Box). Stealth slips past; Computers can wake the club's old power and lights for a shortcut |
| Boss | 3 skulls. At least one case choice weakens it (by kind: what you did with the copies you found, as the case file sets), and a weakness Identify can find. Target 8–12 rounds against a careful party |
| Deduction | One deduction before the finale, from the trail. A wrong answer costs time or a better ending, never progress (Gameplay loop) |
| Skills it calls on | Computers, History, Occult, Search, Persuade, Bureaucracy, Empathy, Stealth, Forensics, Athletics. Every team template must be able to reach the finale |
| Motivation moments | 2: one for **Find the truth**, one for **Redemption** |
| Horrors | About 3–4 Unsettling or Disturbing (more if the team watches), 1–2 Severe, 0–1 Shattering, and the Boss, inside the case budget (6–10 net SAN) for a team that watches the tape once or twice. Kinds: mostly unnatural and violence (body horror). A **phobia subject** fits the tape; the case file names it |
| Addiction | The case's people and the tape both lean on Addiction. Any choice that offers a drug or a drink follows Disorders → Addiction and Statuses as written; the case adds no new rule |
| Overstepping | The cover is cheap and easy to keep in a city that doesn't look twice, but money is loud: paying too much, or forcing a door, marks someone saw. Inside the club at night, most choices are unseen. The **extreme case flag** for Local chief arriving as a fight with officers is **off** |
| Cover stories | 2 strong ones (Bureaucracy and Persuade) plus the weak Luck story. Since it's a quiet case, a clean run also offers the easy one (Overstepping and cover stories). Clean books adds its safe one as always |
| Ending labels | `clean`, `costly`, `worst` (Federal agents' shutdown also plays `worst`) |
| Lantern Boxes and loot | 1 Lantern Box (2–3 catalog items). A loot table of 5 field items that fit a pawn shop, a motel and a city street. Up to 3 case-only items, at least one unnatural (a copy of the tape counts), so bag or hide has a real choice |
| Requisition | As usual at the briefing |

## Art

Reno in winter: grey slush and hard snow by day, and by night neon and casino light bleeding magenta, gold and blue across wet streets and snowbanks. Indoors is cheap and cramped: wood paneling, CRT TVs, stacks of tapes. The tape's look is its own: tracking lines, a rolling bar, washed-out color. **No autumn pieces** (pumpkins, hay bales, autumn trees, falling leaves) and no summer or spring pieces from the Shared Shelf.

- **From the Shared Shelf (v1):** the sprite method and person template, street light, sidewalk, walls (brick and siding), windows, doors, awning, dusk lighting.
- **From the summer art kits (spec 012), if they're on the Shelf first:** storefronts and sign blanks, the parked car, the apartments kit (walkway, metal stairs, numbered doors, parking lot, dumpster) for the motel, and the interiors kit (floors, inner walls, counter, bed, shelving, boxes).
- **From the spring art kits (spec 017), if they're on the Shelf first:** the rain effect (as wet shine on the streets).
- **New for this case**, on its own Asset Library page made from the Still Harvest one:
  - **Fourth Street:** the pawn shop front with barred windows and its sign (look-alike name), the motel's tall sign, a casino sign glow at the end of the street (look-alike name), the bus stop.
  - **Interiors:** the pawn shop's glass counter and the five-for-a-dollar bin, the clerk's apartment with foil on the windows and the three words on everything, the collector's apartment walled with tapes, a records room.
  - **The club:** the closed front with its dead marquee, the dance floor, the stage, the back rooms, all under dust.
  - **The tape:** the VHS tape and label as a prop, the tape's footage as a short in-game clip drawn in code, and the **tracking lines** screen effect that grows with each watch.
  - **Townsfolk:** the pawn-shop owner, the clerk, the motel desk clerk, a collector, a beat cop, a dancer from the club's last years, plus 1–2 more the case file needs. About 1 in 3 with one weird trait (Art → Townsfolk and monsters). Map sprites and 64 × 64 portraits.
  - **Monsters:** whatever the case file designs, following Art → Townsfolk and monsters, with battle art in the pattern Demo 5 part B sets.
  - **Palette accents:** neon magenta, casino gold, sodium-on-snow orange, and the tape's washed-out blue.
- **Candidates for the Shared Shelf** (flag for Keegan's OK first, Season readiness step 6): snow ground, snowbanks and slush, falling snow, a city street with a crosswalk, a bus stop, a blank neon sign with a flicker, barred shop windows, a tall motel sign blank, a CRT TV and VCR, and wood paneling.

## What to build

### Part A: maps and art (To do: Tracking part A)

- A new `cases/tracking.js` with its `caseCard` and `registerCase`, and its entry in the season data file's queue after Lost Hour (spec 009, step 1).
- Every map above, drawn in the 3/4 view at Wide scale, with day and night versions as listed and the low-SAN look below 40 (spec 005).
- The tracking lines effect at each of its steps, readable on the iPhone SE screen without hiding the party, the dialog box or the shell's buttons.
- Every townsperson, with map sprites and portraits.
- Stand-in scripts so each map can be walked and every door goes where it should, with a placeholder briefing. No clues, fights or story yet.
- The case's own art goes on its Asset Library page first (Story → Adding a new case, step 6).

### Part B: story and play (To do: Tracking part B)

- **First,** the Developer writes the secret case file, `claude/cases/tracking.md`, in the Black Lantern Claude Project files, following this spec: what the tape is and what it does, who the dancer is, the chain of hands and the second way to each link, the clue IDs and which place each opens, what watching gives and costs at each copy, what the tracking lines mean, the deduction, the choices that matter, overstepping marks and how public each is, enemy cards, the boss's phases and weakening choice, the motivation moments, horror tags and the phobia subject, and what each ending label means. Every deduction maps to clue IDs.
- **Then** the text block and scripts: the briefing, every scene and line in Keegan's voice, hotspots and their skill options, the trail, each watch and its clip, the two story fights, the danger zone and its roamers, the boss and its tuning check, items and the Lantern Box, cover stories, and the debrief's facts and ending label (spec 007).
- **Arc touches,** if the arc file asks for any, go in quietly and never appear in a commit, the changelog or the bible.

### Saves

A new case file needs no new save version on its own (spec 004, step 6). The trail, the copies found and the watch count live inside the case's own checkpoint data, like any case state, and the tracking lines clear when the case ends. If part B adds anything new to what a save holds outside that, it adds an upgrade step and test saves as usual.

## Must stay true

- Still Harvest, Good Manners, Lot 83, Lost Hour, the board, the debrief, the home phase and the season flow work as before.
- Old saves keep opening, every test save included.
- No real brand names or logos anywhere in the case, including casino names.
- Nothing a player could only learn by playing appears in this spec, the changelog, the bible or a commit message.

## Done when

- `npm run check` passes at all three sizes.
- After part A: every map walks, day and night, every step of the tracking lines reads on the iPhone SE screen, and every townsperson shows their sprite and portrait.
- After part B: a playtest start to finish through each ending label, a run that never watches the tape, a run that watches every copy, a run that takes each link's second way, a run where the cover slips to Noticed and on to Local chief, and a game over that reopens the case.
- The boss tuning check passes (Combat → Bosses).
- `changelog.md` has a dated entry per part, with any deviations, and the To do lines are ticked.
