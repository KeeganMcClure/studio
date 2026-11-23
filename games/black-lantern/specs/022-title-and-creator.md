# Spec 022: the title screen and the agent creator

Status: proposed, waiting for Keegan's merge · Written 2026-11-23 by the Game Designer · Game: Black Lantern · To do: Demo playtest fixes (the pronouns and code names lines)

## In plain words

The title screen, Pick a team, Your team, the 7-step creator and the roster were built in Demo 1 (Nov 21), before the studio had specs, so they were built from the bible and the creator mockups alone. The studio rule now says every screen has a spec, and the next change to one of these needs a spec first (`studio-bible/studio.md`, Screen list; bible, Screens). The next changes are two lines already on the To do from the demo playtest: pronouns and a body build, and Big Hat's code names.

This spec does two things. Part 1 writes down what these screens are today, so later changes have something to change. Part 2 is the pronouns, body build and code names build, screen by screen. It adds no new rule: the rules stay in the bible and are linked, not copied (`studio-bible/studio.md`, Specs).

Mockups: the approved Agent creator stills, 5 screens (bible, Art → Reference mockups). No new mockup: Part 2 adds rows to existing screens, and the Developer compares each changed screen with the closest mockup at 375 × 667 (`studio-bible/studio.md`, Playtests).

## Bible sections this spec relies on

| Source | Section | What it sets |
| --- | --- | --- |
| `games/black-lantern/bible.md` | Agents and items → Agent creator | The creation flow, the 7 steps, pronouns and body (step 4), Bond pronouns (step 5), Code names, worked-out stats, recruits |
| `games/black-lantern/bible.md` | Agents and items → Professions, Team templates | The 18 professions and 6 templates |
| `games/black-lantern/bible.md` | Agents and items → Built Nov 21 (Demo 1 of 6) | How the creator works beyond the rules: Build or Roster seats, Tweak's limits, Done's check, Start |
| `games/black-lantern/bible.md` | Tech → Saving | `bl.roster`, `bl.draft`, save upgrade steps |
| `games/black-lantern/bible.md` | Screens | The rows this spec covers |
| `studio-bible/ui.md` | Screen craft, Dialog box | Readable text, no cut-off names, cards, portraits on a lit backing |
| `studio-bible/controls.md` | Buttons | L/R step through the creator |
| `studio-bible/play.md` | No accidental point of no return | New game over a running season asks first |
| `studio-bible/studio.md` | No real brands | Code names name no brand or logo |

## Part 1 · The screens as they are (built Nov 21, Demo 1; no change)

| Screen | What's on it today | Buttons |
| --- | --- | --- |
| **Title** | The lantern and BLACK LANTERN · PERSONNEL INTAKE · FORM 7-B, then rows: Continue (only with a case checkpoint), Case board (only with a saved party and no checkpoint), Continue team (only with a team in progress), New game, Roster (with how many are on file; agent codes are exported and imported from there), and Game shelf (only when opened from the launcher). New game asks first when a case is closed or past Season 1, since it starts the season over. The Dev build adds a Dev: test season row | D-pad and A, or tap a row |
| **Pick a team** | The 6 team templates and a Blank team, each with its name, a short tag (like Clues+ Fights−) and a one-line blurb | A picks; B back to the title |
| **Your team** | Three seats as cards with 32 × 32 Storybook faces, each offering Keep, Tweak or Rebuild; an empty seat offers Build or Roster. START is enabled once all 3 seats are filled | A on a seat's button; START files the team and opens the case board |
| **Agent creator** | The 7-step frame from the mockup: a step header with L/R arrows, the step's pane, a hint line. Steps: Profession, Stats, Skills, Identity, Bonds, Motivations, Dossier. Done jumps to the first unfinished step | L/R step; A picks; B back |
| **Roster** | Saved agents as cards (face, name, profession, SAN); a roster agent fills one seat per team | A picks; B back |

These keep working as built. Anything in Part 2 that changes them is listed there.

## Part 2 · Pronouns, body build and code names (To do: the two Demo playtest fixes lines)

### Identity step (step 4)

- Two new rows under the face: **Pronouns** (she, he, they) and **Build** (slim, broad), each a left/right picker like the face parts. Rules: bible, Agent creator, step 4.
- The face preview shows the build's shoulders under the portrait. The map sprite and battle back sprite change with it (bible, step 4).
- The code name row moves off this step (it moves to the Dossier, below).

### Bonds step (step 5)

- Each Bond row gains a pronoun picker beside its name. New Bond in the home phase picks them too (bible, step 5; spec 008).

### Dossier step (step 7)

- Big Hat gives the code name here, last, in one line in the Lantern Bust box over the Dossier, with his portrait (he's not drawn in the scene; `studio-bible/ui.md`, Dialog box). Rules and the hint line style: bible, Code names.
- Three choices under his line: **Take it**, **Another** (the next best match from the tagged list), **Type my own** (the phone's text prompt, as New Bond uses).
- The name shows in full on the Dossier and every card after it (`studio-bible/ui.md`, Screen craft, No cut-off names).

### Your team, Tweak

- Tweak gains Pronouns, Build and **Ask Big Hat for a new name** (bible, Code names). Tweak still never touches profession, stats or skills.
- Template agents come with pronouns, build and a hand-picked code name.

### Text

- Every line that names an agent or a Bond uses pronoun tokens, never a fixed "he" or "she": case text blocks, Big Hat, home scenes, arc beats, battle lines (bible, step 4). The build swaps the existing lines over and adds a check that fails on a bare "he"/"she" next to an agent or Bond token.
- The code-name list (about 60, tagged) goes in `strings.js` (bible, Code names).

### Saves

- One new upgrade step, version + 1: old agents and Bonds open as "they", agents get the build closest to their look and keep their names (bible, steps 4 and 5, Code names). New test saves from today's build join `npm run check`.

## Must stay true

- The Part 1 screens behave exactly as built, apart from what Part 2 lists.
- Nothing on these screens is cut off at 320 × 480, 375 × 550 or 375 × 667.
- No brand names in the code-name list.
- A change to these screens after this spec updates this spec, or gets a new one.
