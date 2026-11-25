# Spec 009: the season, start to finish

Status: approved and built (status updated Nov 25, 2026; see the bible's To do and the changelog) · Written 2026-11-22 by the Game Designer · Game: Black Lantern · To do: Season readiness, step 4

## In plain words

Today the game knows one season with one case on the board (spec 004). This spec makes a whole season work: a board that holds all of its cases, the agency's own cases that pin on once you've closed enough regular ones, the finale, and what happens when the season ends and the next one begins.

How it plays: you pick cases off the cork board in any order. Each closed case goes onto a CLOSED pile in the corner, which frees its spot. After a set number of regular cases are closed, Big Hat slides a black agency folder across the desk and it pins onto the board with a red wax seal. Agency cases don't count toward the next unlock. The last agency case is the finale. When you close it, the season ends: an end screen sums up the season, the heat from overstepping resets, and the next season's board opens with your roster, memorial and any unfinished personal stories carried over.

How many cases a season has, and when each agency case unlocks, stays secret (Story → Agency arc). This spec builds the machinery that reads those numbers. It never states them.

Rough picture for the board question: [`009-season-board-rough-v1.png`](009-season-board-rough-v1.png) (source [`009-season-board-rough-v1.html`](009-season-board-rough-v1.html)). It's a rough built on the approved case board mockup (spec 004, option A), not a new approved look. The cards in it are placeholders.

## Where the story lives (spoiler wall)

- **The season's numbers** (how many regular cases, each agency case's unlock count, which one is the finale) come from `games/black-lantern/story/SPOILERS-agency-arc.md` (since Nov 23, 2026). The Developer copies only those numbers and case ids into a season data file (`seasons/season-1.js`) at build time. They never go in the bible, this spec, the changelog or a commit message (Tech → Saving). Commit messages say "season 1 data", not what it holds.
- **Agency cases themselves** are cases like any other: each is pitched, specced and built through the case pipeline (Season readiness, step 5), with its story in its secret case file. Their cards' public text (title, place line, hook) is teaser-only, as for every card.
- **The season-end lines** (Big Hat's words on the end screen) come from the arc file, copied into the season data file's text block.

## Bible sections this spec relies on

| Source | Section | What it sets |
| --- | --- | --- |
| `games/black-lantern/bible.md` | Story → Agency arc | Seasons each have their own board; cases in any order; agency cases unlock after a set number of closed cases; the last is the finale; agency cases don't count toward the next unlock; numbers live in the secret arc file |
| `games/black-lantern/bible.md` | Story → Case board | Cork board of pinned cards; description box; closed cases go to a CLOSED pile; always six open regular cases, the rest waiting in a queue (set Nov 22) |
| `games/black-lantern/bible.md` | Story → Overarching story | The agency arc advances by how many cases you've closed, not which |
| `games/black-lantern/bible.md` | Systems → Gameplay loop | Game over: new team, the case reopens, the arc keeps its progress |
| `games/black-lantern/bible.md` | Systems → Personal arcs | An arc still running when a season ends finishes first; the new season's arc starts after it; 9 new arcs each season |
| `games/black-lantern/bible.md` | Skills and menus → Overstepping | Each new season starts back at Clean |
| `games/black-lantern/bible.md` | Combat → Lasting injuries | +2 on the injury roll in a boss or season finale fight |
| `games/black-lantern/bible.md` | Systems → Losing an agent | The memorial list on the case board screen |
| `games/black-lantern/bible.md` | Tech → Saving | `bl.season` holds the season, the board, cases closed, overstepping; season length and unlock counts never go in the bible |
| `studio-bible/saves.md` | Saves | Version steps, test saves; save export and import |
| `studio-bible/launcher.md` | On the phone | The launcher's save export and import |
| `games/black-lantern/specs/004-case-board.md` | All | The board, cards, `bl.season`, New game |
| `games/black-lantern/specs/007-debrief-and-case-gains.md` | Step 7 | The memorial plaque on the board |
| `games/black-lantern/specs/008-home-phase.md` | A2, A6 | Arc beat counts per season; Sabbatical |

## What is built today

From the changelog and specs 004, 007 and 008, once they're built:

- The board reads cards from the loaded case files (`caseCard`, `registerCase`) and pins them at the mockup's 5 spots. Closed cards stay in their spot, stamped. `bl.season` holds `season`, `cases` (state and ending), `closed` and `overstep`.
- New game asks, then starts Season 1 over, keeping the roster (and, from spec 007, the memorial).
- The memorial plaque (spec 007) and the home phase (spec 008) sit before and on the board.
- **Save export already exists:** the studio launcher's Settings export every game's saves, Black Lantern's `bl.` keys included, as one text code, and import them back (launcher changelog, Nov 21). Nothing new is needed for the full save. The Intake artifact copy of the game has no launcher, so there only agent codes export (see Bible notes).

## What to build

### 1. The season data file

- A new part, `seasons/season-1.js`, loaded before the case files. It holds: the season number; the regular case ids; each agency case's id and the number of closed regular cases that unlocks it; which agency case is the finale; and the season-end text block.
- The agency half (each agency case's id, its unlock count, which one is the finale) and the season-end text block go in `seasons/season-1.js` like the rest (set Nov 23, 2026, Keegan's call; for part of that day they lived in a private repo). Commit messages still say only "season 1 data".
- The board reads the season's cases from it. A case file that's loaded but not listed in the current season doesn't pin (so a later season's case can ship early without showing).
- Still Harvest is listed in Season 1 as a regular case. Whether the demo case counts toward Season 1's unlocks is the arc file's call.

### 2. The board for a full season (Keegan picked Nov 22: closed cases go to a pile, and there are always 6 open)

- **Always six open regular cases.** The board has six card spots, two rows of three, as in the rough. The season's regular cases wait in a hidden queue, and the board shows the first six. When one closes, the next case in the queue pins into the free spot, so six stay open until the queue runs out. Nothing shows how many are waiting.
- **The queue order** is the season data file's order for now. Whether it's shuffled per season is Season readiness, step 2 (the Ideas inbox's "Random cases each season"); this spec only needs the queue to read its order from one place so that change is small.
- **Closed cases go to a CLOSED pile** in the bottom-left corner: a short stack of greyed cards with the rust CLOSED stamp and the count. When a case closes, its card stamps CLOSED in its spot as today (spec 004, step 5), slides onto the pile, and the next case from the queue pins on in its place with a short drop.
- **A on the pile** opens `CLOSED FILES` in the Lantern Bust style: one row per closed case, newest first, with its file or LANTERN number, title and town. B closes it. How each ended stays off the board, as in spec 004.
- **The bottom row:** the CLOSED pile, the memorial plaque (spec 007), and Big Hat's sticky note, which an open agency case takes over (step 3). The cursor reaches the pile, the plaque and an agency case like cards. The sticky note isn't selectable.
- **No plain list.** With never more than six regular cases and one agency case open, the board always fits, so the plain list (spec 004's option B) is retired.
- **Screen sizes:** at 320 × 480 the cork gives up height first, as in spec 004; the six spots and the bottom row always show.

### 3. Agency cases

- **Unlocking:** after each closed regular case, once the home phase ends and the board opens, the game checks the season data. When `closed` reaches an agency case's unlock count, a short scene plays first: Big Hat in the Lantern Bust box, a line or two from the season data, and the black folder pins on with a thud in the bottom row's right-hand spot, covering Big Hat's sticky note. Only one agency case is open at a time: if another is due while one is open, it waits until that one closes, then plays its unlock on the next board visit.
- **Never early:** an agency case isn't on the board or anywhere else before it unlocks. Nothing hints at how many there are or when they come.
- **Counting:** closing an agency case doesn't raise `closed` (Story → Agency arc). The header's `CLOSED n` keeps counting regular cases only; a closed agency case still goes on the pile.
- **The card**, as in the rough: a black folder card with cream text, `LANTERN nn` where a regular card says `FILE nn`, the town in rust, a dark red pin and a red wax seal with a small lantern in the bottom corner. The description box's place line reads `AGENCY CASE · <place>`.
- **Everything else** is a normal case: briefing, play, debrief, home phase, game over reopening it.

### 4. The finale

- The finale is the agency case the season data marks. It unlocks like the others.
- **Its card** is the agency card with a gold edge and `FINALE` under the LANTERN number. The place line reads `SEASON FINALE · <place>`.
- Its fights roll lasting injuries with the season finale's +2 (Combat → Lasting injuries).
- A game over in the finale reopens it like any case.

### 5. The season's end

When the finale's debrief and home phase are done, instead of the board:

- **Season end screen:** `SEASON 1 CLOSED`, over the board with every card on the pile. One box sums it up: regular cases closed, agency cases closed, agents lost (from the memorial), and the overstepping step it ended on. Big Hat's closing lines from the season data play in the Lantern Bust box. A continues.
- **What resets:** overstepping goes back to Clean (Skills and menus → Overstepping). Every agent's survived-case count for arc beats starts over at 0 (spec 008, A2), except for an arc still running (next bullet).
- **What carries:** the roster, the party, the backpack, the memorial, every agent's SAN, disorders, Bonds, injuries and skills, and Sabbaticals in progress (their remaining cases count down in the new season).
- **Running arcs finish first** (Personal arcs): an agent whose arc hasn't reached beat 3 keeps counting toward it in the new season. After beat 3 plays, their next arc starts at beat 1 from the new season's arcs and counts from their next case.
- **Regular cases left open** when the finale closes carry over to the next season's board as open cases, first in its queue, ahead of the new season's cases (Keegan picked Nov 22). They count toward the new season's `closed` when closed there.
- **The next season:** `season` rises by one and the new board opens from the next season data file. If there's no next season file yet, the board opens as `SEASON 2 · CASE BOARD` with only the carried-over cases (if any) and Big Hat's sticky note changed to `MORE ON THE WAY. —BH`. Continue still works; New game still starts Season 1 over.

### 6. The save (Tech → Saving; `studio-bible/saves.md`)

One new upgrade step, version + 1. Add test saves: one with an agency case unlocked, one at the season end screen, and one in Season 2.

| Field in `bl.season` | Holds |
| --- | --- |
| `agency` | The agency case ids unlocked so far, and whether each unlock scene has played |
| `ended` | `true` once the finale has closed and the end screen has been seen |
| `past` | One short line per finished season: its number, regular cases closed, agency cases closed, agents lost |
| `carried` | Case ids carried over from the last season, open |
| `slots` | Which case sits in each of the board's six spots (built in the same step, 10; listed here Nov 23, 2026) |

- **Old saves:** a save without these fields gets `agency: []`, `ended: false`, `past: []`, `carried: []`. Every case it already has keeps its state. Never change older steps.
- **Still not in the save:** the season's case count and unlock numbers. They live in the season data file, read fresh on every load, so the save never pins them.
- **New game** resets `bl.season` to a fresh Season 1 as today, keeping the roster and memorial; `past` is cleared too, since the seasons start over.

### 7. Shared code

The season machinery is Black Lantern's own (`season.js`, loaded with `case-board.js`). Anything generic, such as the "pile of closed cards" or a plain-list fallback for a grid of cards, goes in `engine/` per `CLAUDE.md`.

### Left out on purpose

| Piece | Now or later |
| --- | --- |
| Random cases each season (Ideas inbox) | Season readiness, step 2, at the demo playtest |
| Season 2's data, cases and arcs | Written when Season 2 is planned |
| Swapping agents in and out of the party from the roster between cases | Not in the bible; raise it if it's wanted |
| Showing how each case ended on the board | Not planned (spec 004) |

## Must stay true

- Still Harvest, the debrief, the home phase, the party menu and Select work as before.
- Old saves keep opening, every test save included.
- No season number, unlock count or agency case name appears in the bible, this spec, the changelog or a commit message.
- No agency case shows before it unlocks.

## Done when

- `npm run check` passes in `games/black-lantern/src/` at all three sizes, with every old and new test save opening.
- Playtest with a Dev-only test season file (three stand-in regular cases that end on Dev: finish case, and two stand-in agency cases, one of them the finale): close cases until the first agency case unlocks and its scene plays; check the pile, CLOSED FILES and the plaque; close the finale and see the season end screen; land on Season 2's board with a carried-over case; reopen the app at each step. The test season file never ships to Release.
- On an iPhone SE, the board matches the approved case board mockup's style, with the layout Keegan picked.
- `changelog.md` has a dated entry, with any deviations, and the To do item is ticked.

## Bible notes for the Designer (no change made here)

- Story → Case board says closed cases stay pinned, stamped CLOSED, and that the board has 5 spots with a 6th drawn when needed. A full season holds more cards than that. Keegan picked on Nov 22 that closed cases go to a CLOSED pile, and this PR updates that paragraph to match.
- Story → Agency arc didn't say what happens to regular cases still open when the finale closes. Keegan picked Nov 22 that they carry to the next season, and this PR adds that line to Agency arc.
- Tech → Saving says to export agent codes before big updates. The launcher's full save export now covers every key; that line could point there instead. The Intake artifact, which has no launcher, still only has agent codes.
