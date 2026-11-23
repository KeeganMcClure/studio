# Spec 014: the first agency case

Status: proposed, waiting for Keegan's merge · Written 2026-11-22 by the Game Designer · Game: Black Lantern · To do: First agency case part A and part B

## In plain words

Agency cases are the agency's own business, not a call from a town. After enough regular cases are closed, Big Hat slides a black folder across the desk and it pins onto the board with a red wax seal (spec 009). This spec sets up the first of them.

Its story, and so its place, cast, maps and monsters, come from the secret agency arc file, which nobody in this project opens. So this spec is a **frame**: the rules the case has to fit, the shape of the build, and the checks that it's done. The Developer, who reads the arc file at build time, fills the frame in. You'll see the place for the first time when the folder pins on in play.

Keegan picked this split on Nov 22, 2026: a frame spec here, with the Developer filling in the place, maps and art from the arc file in part A.

**Spoiler rule:** this spec, the bible, the changelog, the To do, commit messages and PR text never say where the case happens, what it's about, who's in it, how it ends, or how many agency cases a season has. Public text calls it "the first agency case" or `LANTERN 01` only.

## What the frame fixes and what the case file fills in

| Piece | Fixed here (public) | Filled in from the arc file (secret, Developer) |
| --- | --- | --- |
| Card | `LANTERN 01`, the black folder card with cream text, dark red pin and red wax seal (spec 009, step 3); place line `AGENCY CASE · <place>`; if the arc file marks it as the finale, the finale card instead (spec 009, step 4) | Title, town, place, the two hook lines (teaser only, like every card) |
| Unlock | After the home phase, when `closed` reaches its unlock count, the unlock scene plays and the folder pins in the bottom row (spec 009, step 3) | The unlock count (season data file only) and Big Hat's one or two unlock lines |
| Briefing | Big Hat's own backdrop for this case, a new place (Cast → Big Hat, Backdrop; set Nov 23, 2026), drawn in the back room's layout; two questions from four topics, each an INTEL note and a small edge (spec 013) | Where he briefs them, the four topics, their notes and edges |
| Length | 1–2 hours, one case | Whether it breaks the pattern on purpose (Gameplay loop allows it), kept inside 2 hours |
| Fights | 2–3 story fights plus a boss, no random encounters (Gameplay loop) | Which ones, human or unnatural, their skulls |
| Danger zones | 0–2, every roamer guards something | Where, how many roamers |
| Boss | Threat 3; at least one case choice that weakens it and a weakness Identify can find; 8–12 rounds when the choices were skipped, 5–8 when all were made; the tuning check (Combat → Bosses) | Phases, the weakening choice |
| Clues | Threshold plus bonus or clues as keys; one deduction that never dead-ends; every deduction maps to clue IDs | The clues, the deduction |
| Skills | 8–10 skills, chosen so every team template can reach the end | Which skills |
| Motivation moments | 1–2 (Systems → Motivations) | Which motivation types |
| Horrors | Inside the case budget, 6–10 net SAN (SAN loss table) | Which horrors and their tags |
| Open or quiet | One or the other; Overstepping's first step follows (Skills and menus → Overstepping) | Which one |
| Cover stories | 2–3 plus the weak Luck story; Clean books adds its safe one | The stories |
| Endings | Ending labels `clean`, `costly`, `worst`; then the debrief (spec 007) and home phase (spec 008) as for any case | What each label means |
| Lasting injuries | +2 on the roll in the boss fight; in every fight if it's the finale (Combat → Lasting injuries) | Whether it's the finale |
| Lantern Boxes and loot | 0–1 Lantern Box, a loot table of about 5 field items, up to 3 case-only items with at least one unnatural so bag or hide has a real choice | The items |
| Arc touches | Allowed, never written down in public | What they are |

## Bible sections this spec relies on

| Source | Section | What it sets |
| --- | --- | --- |
| `games/black-lantern/bible.md` | Story → Agency arc | Agency cases unlock after a set number of closed cases, don't count toward the next unlock, the last is the finale; the arc file stays secret and wins on arc secrets |
| `games/black-lantern/bible.md` | Story → Adding a new case | The pipeline; agency cases skip the pitch; the secret case file is the Developer's |
| `games/black-lantern/bible.md` | Story → Case board | The bottom row, where an open agency case pins over Big Hat's sticky note |
| `games/black-lantern/bible.md` | Overview → Mature content | What's shown and what's off screen |
| `games/black-lantern/bible.md` | Voice | Every line |
| `games/black-lantern/bible.md` | Systems → Gameplay loop; Sanity; SAN loss table; Motivations | Length, fights, danger zones, clues, deduction, budget, motivation moments |
| `games/black-lantern/bible.md` | Skills and menus → Skill unlocks; Overstepping and cover stories | Hotspot options, open or quiet, cover stories |
| `games/black-lantern/bible.md` | Agents and items → Items; Where items come from | Loot, Lantern Boxes, case-only items |
| `games/black-lantern/bible.md` | Combat → Enemies and difficulty; Bosses; Lasting injuries | Threat skulls, the boss rules and tuning check, the +2 |
| `games/black-lantern/bible.md` | Art → all sections; Tech → Asset Library | Style, Shared Shelf first, the case's own Asset Library page |
| `studio-bible/studio.md` | No real brands | Look-alike names only |
| `games/black-lantern/specs/009-season-flow.md` | Steps 1, 3, 4 | The season data file, the agency card, unlock scene and finale |
| `games/black-lantern/specs/013-briefing-rework.md` | All | The briefing's four topics |
| `games/black-lantern/specs/case-spec-template.md` | All | The public-safe case spec shape this frame follows |

## Art

- **From the Shared Shelf first,** at the versions in Art → Shared Shelf.
- **New for this case:** whatever its place needs, drawn in code by Art → Townsfolk and monsters, on its own Asset Library page made from the Still Harvest one. The page's title is `LANTERN 01` and its first line says it spoils the case, so it can be skipped until the case is played.
- **Candidates for the Shared Shelf:** anything generic gets proposed with Keegan's OK first, as usual, described by what it is (for example "an office hallway"), never by the case.
- **The black folder card and wax seal** are already in spec 009's build.

## What to build

This depends on the Season flow build (spec 009), since the card, the unlock and the season data file come from it.

### Part A: the case file, maps and art (To do: First agency case part A)

- **First,** the Developer writes the secret case file, `claude/cases/lantern-01.md`, in the Black Lantern private files, from the arc file and this frame. For an agency case this comes at the start of part A, not part B, because the maps come from it. It fills in every right-hand cell of the table above, plus the clue IDs and what each proves, the choices that matter, enemy cards and the boss.
- **Can it be reached?** The Developer checks the regular cases that will exist when it ships (Still Harvest, Good Manners, Lot 83) against its unlock count. If they aren't enough, the Developer tells Keegan only "the first agency case needs more regular cases before it can unlock", with no number, so the next pitch round can be planned.
- A new `lantern-01.js` with its `caseCard` and `registerCase`, and its entry in the season data as an agency case (spec 009, step 1). Both go in the private `KeeganMcClure/black-lantern` repo under `agency/`, never in the studio repo; the build pulls them in (Tech → File and code, Agency cases stay out of the public repo). (Changed Nov 23, 2026: this line used to put the file in the studio repo's `cases/`.)
- Every map, drawn in the 3/4 view at Wide scale, with day and night versions and the low-SAN look below 40 (spec 005).
- Every townsperson or character with a map sprite and a 64 × 64 portrait if they talk.
- Stand-in scripts so each map walks and every door goes where it should, with a placeholder briefing and unlock scene.
- The case's own art goes on its Asset Library page first.

### Part B: story and play (To do: First agency case part B)

- The text block and scripts from the case file: the unlock scene's lines, the briefing and its four topics, every scene and line in Keegan's voice, hotspots and their skill options, the story fights, danger zones and roamers, the boss and its tuning check, items, cover stories, and the debrief's facts and ending label (spec 007).
- **Arc touches** go in quietly and never appear in a commit, the changelog or the bible.

### Playing it on Dev

Since you'd otherwise have to close several cases to reach it, the Dev build gets a Dev-only way to pin `LANTERN 01` on the board straight away (for example a hidden option on the board's Start menu). It never ships to Release.

### Saves

None new. The agency fields in `bl.season` come from spec 009. If part B adds anything to what a save holds, it adds an upgrade step and test saves as usual.

## Must stay true

- Still Harvest, Good Manners, Lot 83, the board, the season flow, the debrief and the home phase work as before.
- Old saves keep opening, every test save included.
- Closing it doesn't raise `closed` (Story → Agency arc).
- It never shows on the board before it unlocks, on Release.
- No real brand names or logos.
- Nothing from the arc file or the case file appears in this spec, the changelog, the bible, the To do, a commit message or a PR.

## Done when

- `npm run check` passes at all three sizes.
- After part A: every map walks, day and night, every character shows their sprite and portrait, and the card pins on through the Dev shortcut and through a real unlock in the Dev test season (spec 009).
- After part B: a playtest start to finish through each ending label, the unlock scene on a real unlock, a game over that reopens it, and, if it's the finale, the season end screen after it.
- The boss tuning check passes (Combat → Bosses).
- `changelog.md` has a dated entry per part that names it only as the first agency case, with any deviations, and the To do lines are ticked.

## Rules check afterwards

The Designer's rules check (`studio-bible/rules-checks.md`) covers only the public frame above: length, fight and danger-zone counts, the boss rules, the card, the unlock, saves and screen fit. It never opens the case file or the case's text block.
