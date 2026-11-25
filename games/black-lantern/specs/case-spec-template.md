# Case spec template

Copy this to `specs/NNN-<case-id>.md` once Keegan picks a pitch (Story → Adding a new case, step 4). Fill every section. Delete these instructions.

**Spoiler rule for the whole file:** the repo is public. Write structure and mechanics only: beats, kinds of clues, kinds of choices, endings by label. Never a culprit, twist, solution, hidden clue or arc touch. Those go in the secret case file (step 5).

---

# Spec NNN: <Case title>

Status: template (a new case spec copies it and writes its own status here) · Written <date> by the Game Designer · Game: Black Lantern · To do: <case> part A and part B

## In plain words

Two short paragraphs: where the case happens and what the agents are sent to do, in the pitch's words; then what it feels like to play, with no twist.

Picked pitch: `pitches/<round file>.md`, option <letter>, picked <date>.

## The card

| Field | Value |
| --- | --- |
| File number | `FILE nn` (or `LANTERN nn` for an agency case) |
| Title | |
| Town (on the card) | |
| Place line | `PLACE · TOWN, ST` |
| Hook, line 1 | |
| Hook, line 2 | |
| Pin color | |
| Heaviest themes | One line, as in the pitch (Overview → Mature content) |
| Season slot | Regular, or agency (unlock count stays in the season data file) |

## Bible sections this spec relies on

| Source | Section | What it sets |
| --- | --- | --- |
| `games/black-lantern/bible.md` | Systems → Gameplay loop | Case length, fights, danger zones, roamers, clues, deduction, choices |
| `games/black-lantern/bible.md` | Story → Adding a new case | The pipeline |
| … | | |

## The case at a glance

| Piece | Plan |
| --- | --- |
| Briefing | Big Hat's backdrop for this case, a new place each case, drawn in part A (Cast → Big Hat, Backdrop); the debrief plays there too; his four question topics (pick two), each with its INTEL note and small edge, kept spoiler-free (spec 013) |
| Length | 1–2 hours, or Part 1 and Part 2 if Keegan split it |
| Open or quiet | Open (badges) or quiet (undercover); Overstepping's first step follows |
| Day and night | Which beats turn it to night; any clock |
| Points of no return | Each beat that turns the day, and what it closes for good (maps, people, items), so each gets its Go on / Not yet line (`studio-bible/play.md`; Systems → Gameplay loop, Turning the day). The boss waits for you |
| Maps | Each area by name, with its size and whether it's a danger zone |
| Story fights | 2–3, each with its threat skulls; human or unnatural |
| Danger zones | 0–2, with how many roamers and what each guards |
| Boss | Threat 3; the kind of weakening choice (by type, not what it is); target 8–12 rounds when the choices were skipped, 5–8 when all were made |
| Clue style | Threshold plus bonus, or clues as keys; how many clues and how many to move on |
| Skills it calls on | The 8–10 skills, so a template team can always find a way through |
| Hidden hotspot | At least one hidden unnatural hotspot that shows only while the lead is High on Mushrooms (Item list, Mushrooms); what it is goes in the secret case file |
| Motivation moments | 1–2, and which motivation types they aim at. Check the season's spread so all nine types get a moment (Systems → Motivations, Every motivation, every season) |
| Horrors | Rough count per tier, inside the case budget (SAN loss table) |
| Ending labels | For example `clean`, `costly`, `worst` |
| Lantern Boxes and loot | How many boxes; the loot table's size; any case-only items, ordinary or unnatural |

## Art

- **From the Shared Shelf:** the pieces and versions it uses (Art → Shared Shelf).
- **New for this case:** townsfolk, monsters, props and backdrops, each following Art → Townsfolk and monsters. Its own page in the Asset Library, made from the Still Harvest one.
- **Candidates for the Shared Shelf:** anything generic, flagged for Keegan's OK first.

## What to build

### Part A: maps and art (To do: <case> part A)

The maps, art, townsfolk sprites and portraits, the night and low-SAN look for its areas, and the card on the board, with stand-in scripts so the maps can be walked.

### Part B: story and play (To do: <case> part B)

The secret case file is written first (step 5). Then the text block, hotspots and skill options, fights and enemy cards, the boss and its tuning check, the ending labels and the debrief's facts.

### Saves

Whether the case adds anything new to a save. A new case file needs no new save version on its own (spec 004, step 6).

## Must stay true

- Every other case, the board, the debrief and the home phase work as before.
- Old saves keep opening, every test save included.
- Nothing a player could only learn by playing appears in this spec, the changelog, the bible or a commit message.

## Done when

- `npm run check` passes at all three sizes.
- Playtest start to finish through each ending label, and a game over that reopens the case.
- The boss tuning check passes (Combat → Bosses).
- `changelog.md` has a dated entry per part, with any deviations, and the To do lines are ticked.
