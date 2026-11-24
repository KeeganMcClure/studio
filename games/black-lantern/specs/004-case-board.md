# Spec 004: the case board

Status: proposed, waiting for Keegan's merge · Written 2026-11-21 by the Game Designer · Game: Black Lantern · To do: Demo 3 of 6

## In plain words

Today, pressing START on Your team drops you straight into Chapter One. This spec puts the season's case board in between. You see a cork board with Still Harvest pinned to it, read its card, and press A to hear Big Hat's briefing. When you finish the case, the board comes back with Still Harvest stamped CLOSED. The game now remembers the season (which cases are open, which are closed, how many you've closed) in a new save, and old saves upgrade to it without losing anything.

What you'll feel in play: a short stop between building your team and the briefing, where you choose the case. With one case in the demo there's only one card to choose, but the board, its cursor and the season save are ready for the next case to pin on.

Mockup (approved Nov 21, option A, cork board): [`004-case-board-mockup.png`](004-case-board-mockup.png), with its source [`004-case-board-mockup.html`](004-case-board-mockup.html), copied unchanged from Drive (`case-board-mockup-shell.html`). Build option A. Option B (the plain list) is in the same picture for later; it isn't built now (see Not in this spec).

Two things in the mockup are not to copy:

- **The cases.** Every card except Still Harvest is a placeholder (Apt #432, Men in Black, Bad Neighbors, Lost Night). The cards to build are in What to build, step 3.
- **The shell.** The mockup was drawn before spec 003, so L and R sit in the bottom row. Use today's shared shell (`engine/shell.js`, L and R in the top corners). Only the screen area is the mockup.

## Bible sections this spec relies on

| Source | Section | What it sets |
| --- | --- | --- |
| `games/black-lantern/bible.md` | Story → Case board | Pick a case from a cork board of pinned cards, which opens Big Hat's briefing. Each card shows file number, title and town. D-pad moves a cursor between cards; the selected card opens a description box (place, a two-line hook, A for the briefing, B to back out). Closed cases stay pinned, stamped CLOSED. More than 6 open cases switches to a plain list |
| `games/black-lantern/bible.md` | Story → Agency arc | Seasons, each with its own board, cases in any order. Agency cases unlock after a set number of closed cases; the last is the finale. Agency cases don't count toward the next unlock |
| `games/black-lantern/bible.md` | Story → Demo case: Operation Still Harvest | Marrow Creek, Oregon, during the Harvest Lantern Walk. The briefing with Big Hat is step 1 |
| `games/black-lantern/bible.md` | Story → Adding a new case | Every new case starts from a pitch Keegan signs off on |
| `games/black-lantern/bible.md` | Art → Reference mockups | The approved case board mockup, option A |
| `games/black-lantern/bible.md` | Systems → Gameplay loop | Game over: build a new team, the case reopens, the agency arc keeps its progress |
| `games/black-lantern/bible.md` | Systems → Losing an agent | The memorial list lives on the case board screen |
| `games/black-lantern/bible.md` | Skills and menus → Overstepping and cover stories | Overstepping carries between cases; each new season starts at Clean; Federal agents are a very hard fight, then the case goes on (changed Nov 24, 2026; they used to shut it down) |
| `games/black-lantern/bible.md` | Tech → File and code | One file per case in `cases/`; where text lives (case text in the case's text block, menus and names in `strings.js`) |
| `games/black-lantern/bible.md` | Tech → Saving | `bl.season` holds the season number, the case board (open or closed, and how each ended), cases closed and the overstepping step; `bl.memorial` holds fallen and retired agents. Save upgrades. Season length and unlock counts live only in the secret arc file |
| `games/black-lantern/bible.md` | Tech → Screen and controls | iPhone SE first, nothing cut off, test at 375 × 550 and 320 × 480 |
| `studio-bible/saves.md` | (whole file) | Save version, back up first, one upgrade step per change, test saves must open |
| `studio-bible/controls.md` | Buttons, Target screen | A confirms, B backs out, tapping works too; the three screen sizes |
| `studio-bible/ui.md` | Dialog box, Menus | The Lantern Bust box style the description box follows; menus work by D-pad or tap |
| `studio-bible/art-style.md` | How art is made, Fonts | Drawn in code; Press Start 2P and VT323 only |
| `studio-bible/launcher.md` | Title cards | The shelf's Continue opens straight into the save |

## What is built today

From the changelog (Demo 1 and Demo 2, Nov 21) and the code:

- **Flow:** Title → New game → Pick a team → Your team → START. START files all three agents to the roster and begins Chapter One straight away with seat 1 leading (`creator.js` `startGame()` → `BLG.start()` → the case's `caseOpening`).
- **Continue:** the title shows Continue Chapter One when there's a checkpoint (`bl.game`); the game shelf's Continue opens straight into it.
- **The end of the case:** `finish()` in `engine.js` clears the checkpoint, files the lead to the roster, opens the lead's dossier and shows "FILED. CHAPTER ONE CLOSED." Nothing records that the case was closed.
- **The briefing:** Chapter One already opens with Big Hat in the donut-shop back room (`caseOpening` in `cases/still-harvest.js`), with his portraits and the Lantern Bust box.
- **Saves:** version 3 (`SAVE_V` in `creator.js`). There is no `bl.season` or `bl.memorial` yet.
- **No case board** of any kind.

## What to build

### 1. Getting there and back (Keegan picked Nov 21: after Your team)

- **Your team → START** files the three agents to the roster as today, then opens the case board instead of starting Chapter One.
- **A on an open card** starts that case with the team from Your team, seat 1 leading, exactly as START does today.
- **B on the board** goes back to Your team with the same team and seats, so you can still Tweak or Rebuild. (So the team in progress must stay in `bl.draft` until A on a card, not be cleared at START.)
- **Continue** on the title, and on the game shelf, still opens straight into a case in progress, with no board, as today (`launcher.md`, Title cards).
- **After closing a case:** see step 5.
- The board is never reachable mid-case.
- **New game starts a fresh season** (Keegan picked Nov 21). If the season has any closed case, New game first shows the "Can't be undone. Sure?" box (Skills and menus → Quality of life, Confirm what sticks), with the line `This starts Season 1 over. Your roster stays.` Yes resets `bl.season` to a fresh Season 1 (every case open, `closed` 0, `overstep` 0, the same as a new save in step 6) and carries on to Pick a team. No goes back to the title. The roster is never touched. With nothing closed, New game works as today with no box.

### 2. The board (match the mockup's option A)

- **Header bar:** `SEASON 1 · CASE BOARD` on the left, `CLOSED n` on the right (n = cases closed this season).
- **Cork board** in its wood frame, cards pinned at the mockup's spots, filled in file order from the top left. The Big Hat sticky note ("NOBODY TOUCH MY CRULLERS. —BH") and the coffee ring stay; they aren't cases.
- **Card:** a pin in the case's pin color, `FILE nn`, the title (up to two lines) and the town, as in the mockup. The selected card lifts slightly with a gold outline, and the gold arrow cursor points at it.
- **Closed card:** greyed paper, faded text, and the rust CLOSED stamp across it, as on the mockup's Still Harvest card. It stays pinned in its spot (the bible: closed cases stay pinned).
- **Description box** along the bottom, in the Lantern Bust style: a tab with the case title, then the place line in mustard (`PLACE · TOWN, STATE`), then the two-line hook, then the key hints `A BRIEFING` and `B BACK` in the bottom right.
- **Cursor:** starts on the first open card (or the first card if all are closed). The D-pad moves to the nearest card in that direction and stays put if there is none. Tapping a card selects it; tapping the selected card works as A.
- **Drawing:** all in code (`art-style.md`). It's Black Lantern's own screen; put it in a new `case-board.js`. If any piece turns out to be generic (for example the move-to-the-nearest-card cursor), it goes in `engine/` per `CLAUDE.md`.

### 3. The cards

The demo board shows only Still Harvest (Keegan picked Nov 21). No placeholder or teaser cards. Other cases pin on when Keegan signs off on their pitches (Story → Adding a new case).

| Field | Still Harvest |
| --- | --- |
| File number | `FILE 01` |
| Title | `STILL HARVEST` |
| Town (on the card) | `MARROW CREEK` |
| Place line | `LANTERN WALK · MARROW CREEK, OR` |
| Hook, line 1 | `Three townsfolk went missing on the` |
| Hook, line 2 | `Lantern Walk. The corn knows where.` |
| Pin color | mustard `#d6a43a` |

- The card's words live in the case's own file (`cases/still-harvest.js`, in its text block, per Tech → Where text lives), as a small `caseCard` next to `caseOpening`. The board reads the cards from the loaded case files; it never hard-codes a case.
- The board's own words (`SEASON`, `CASE BOARD`, `CLOSED`, `BRIEFING`, `BACK`) go in `strings.js`.
- Hooks are public-facing teaser lines only: no twist, no solution, nothing from the secret story files (`CLAUDE.md`, Spoiler wall).

### 4. A on a card: the briefing

- On an open card, A opens Big Hat's briefing. For this demo, today's Chapter One opening (`caseOpening`) is the briefing. Demo 5 rebuilds Still Harvest's story and replaces it; nothing in this spec should need to change then.
- On a closed card, A does nothing and the hint reads `CLOSED` in place of `A BRIEFING`. Closed cases stay closed; to play Still Harvest again, start a New game (step 1).

### 5. Closing a case

- **What closes it in the demo:** finishing today's Chapter One, the moment `finish()` runs. That marks Still Harvest closed in `bl.season`, raises cases closed by one, and saves.
- **Then:** today's finish carries on as now (the lead's dossier with "FILED. CHAPTER ONE CLOSED."). Leaving the dossier opens the case board, where the CLOSED stamp lands on the card (a short stamp-down, about a quarter second). B on the board then goes to the title.
- **How it ended:** saved in `bl.season` (step 6), but **not shown on the card**. The bible gives the card only file number, title and town, plus the stamp. Today's Chapter One has one ending, so it saves `"closed"`. Demo 6 (the debrief) is where real endings get names.
- **Game over** doesn't close anything: the case stays open and the board keeps its progress (Systems → Gameplay loop).

### 6. The save

New key `bl.season`, and the save version goes from 3 to 4 (`studio-bible/saves.md`).

```json
{
  "season": 1,
  "cases": {
    "still-harvest": { "file": 1, "state": "open", "ending": null }
  },
  "closed": 0,
  "overstep": 0
}
```

| Field | Holds |
| --- | --- |
| `season` | Season number. 1 for the whole demo |
| `cases` | One entry per case on the board, keyed by the case's id. `state` is `open` or `closed`. `ending` is `null` while open, then a short word for how it ended (`"closed"` for now) |
| `closed` | Regular cases closed this season. Agency cases won't count toward it when they arrive (Story → Agency arc) |
| `overstep` | The overstepping step carried between cases, 0 = Clean (Skills and menus → Overstepping). Nothing raises it yet; it's stored so later demos don't need another save change |

- **Upgrade step 4:** if `bl.season` is missing, write the one above, with Still Harvest open. That covers every older save, including one paused mid-Chapter One, which keeps its checkpoint and Continues as before. Never change steps 1 to 3.
- **New cases:** when the game loads a case file that isn't in `cases` yet, it adds it as open. That needs no new version.
- **New game reset:** writes the fresh Season 1 above over `bl.season` (step 1). It isn't a save change, so no new version.
- **Test saves:** add a new-format save with Still Harvest closed and one with it open mid-case to `tools/test-saves/`. `npm run check` must open every old and new test save, show the board after Your team, and show the stamp after a finish.
- **Not in the save:** season length and agency-case unlock counts (Tech → Saving; they come from the secret arc file at build time, and no unlocks are built yet).

### 7. Left out on purpose

| Piece | Now or later |
| --- | --- |
| Plain list when a season has more than 6 open cases | **Later.** The demo has one case, so it can never switch. Build it when the board can first hold 7 open cases. Mockup option B is the reference |
| Memorial list on the board screen | **Later**, with losing an agent and lasting injuries, which aren't built yet. `bl.memorial` is not created in this spec |
| Agency case unlocks | **Later.** Needs the season's counts from the secret arc file and at least one agency case |
| Season finale | **Later**, with the agency cases |
| Overstepping going up or down | **Later** (Demo 5 and 6). Only the saved step exists now |

### 8. Screen sizes

The board and its description box must fit with nothing cut off and no scrolling at 375 × 667, 375 × 550 and 320 × 480 (Tech → Screen and controls; `studio-bible/controls.md`, Target screen). The mockup is drawn at 375 × 667 in screen pixels; the game draws on its 240 px wide canvas, so sizes scale down to match. On shorter screens the cork area gives up height first; the cards, the header and the whole description box (all three text lines and the key hints) always stay in view.

## Must stay true

- Old saves keep working, including a game paused mid-Chapter One. Backup first, then step 4.
- Continue still goes straight into a case in progress.
- Chapter One plays exactly as today once the briefing starts.
- No story or case secrets on the board: hooks are teaser lines only.

## Not in this spec

- New cases, pitches or case cards beyond Still Harvest.
- The debrief, cover story and named endings (Demo 6).
- Showing how a case ended on its card.
- Everything in step 7.

## Done when

- `npm run check` passes in `games/black-lantern/src/` at all three sizes, with every old and new test save opening.
- Playtest: New game → Pick a team → Your team → START shows the board; B goes back to Your team with the team kept; A on Still Harvest plays the briefing; finishing Chapter One shows the dossier, then the board with Still Harvest stamped CLOSED and `CLOSED 1`; B goes to the title. New game then asks before starting Season 1 over, and the board shows Still Harvest open again with the roster kept. Continue mid-case skips the board.
- On an iPhone SE, the board matches the mockup's option A.
- `changelog.md` has a dated entry, with any deviations.
