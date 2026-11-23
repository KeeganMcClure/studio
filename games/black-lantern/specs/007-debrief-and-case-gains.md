# Spec 007: the debrief and case gains

Status: proposed, waiting for Keegan's merge · Written 2026-11-22 by the Game Designer · Game: Black Lantern · To do: Demo 6 of 6 (and Season readiness, step 1)

## In plain words

After Demo 5, a case ends with a short stand-in: a few lines from Big Hat, the old cover-story question, then the CLOSED stamp (spec 006, C6). Demo 6 replaces it with the real debrief, the last piece of the demo.

When a case closes you go back to Big Hat's donut-shop back room. A wrap-up card shows how it went (clues found, people saved, fights, how far you overstepped, SAN each agent lost) while Big Hat talks it through, with lines that change with the ending you earned. If someone died or retired, he says a line for them. Then he sorts the strange things you carried out: ordinary ones you keep, unnatural ones get bagged as evidence, unless you choose to hide one from him. Then he asks what the locals will be told: you pick a cover story and the agent who tells it, and the roll decides whether the case closes quietly or the heat climbs. Last, every skill an agent tried and failed during the case grows a little, with the die shown, and a new skill unlock flashes when one crosses 40, 75 or 90. Everyone is patched up. If anyone was lost, their funeral (or a retirement goodbye) plays, their name goes on the memorial list, and you're back at the case board with the case stamped CLOSED.

What you'll feel in play: the case has a real ending that remembers your choices, failing at things on the job pays off later, and losses are marked instead of just vanishing.

Mockup (approved Nov 21): [`007-debrief-mockup.png`](007-debrief-mockup.png), with its source [`007-debrief-mockup.html`](007-debrief-mockup.html), copied unchanged from Drive (`debrief-mockup-shell.html`). Four screens in play order. Build these.

Two things in the mockup are not to copy:

- **Placeholders.** The names, items, stories, numbers and Big Hat's line are made up. The real ones come from the party and the case.
- **The shell.** The mockup was drawn before spec 003, so L and R sit in the bottom row. Use today's shared shell (`engine/shell.js`). Only the screen area is the mockup.

## Where the story lives (spoiler wall)

The repo is public (`studio-bible/studio.md`, One repo). This spec gives only the flow and the rules. It names no ending, culprit or line of Still Harvest's.

- **Still Harvest's endings, its debrief lines, its cover stories and which items are unnatural** come from `games/black-lantern/story/cases/still-harvest.md`, written in Demo 5 part C. The lines ship in the case's text block (`cases/still-harvest.js`), as all in-game text does (Tech → Where text lives).
- **The funeral, the retirement goodbye and Big Hat's send-off lines** are written in `games/black-lantern/story/home-scenes.md`, per Systems → Losing an agent. The Developer reads it at build time and copies only the lines into the game files.
- **What hiding evidence costs the agency** is not in the bible. If the secret arc file (`claude/SPOILERS-agency-arc.md`) sets it, the Developer builds that quietly; it never appears in this spec, the changelog or a commit. If it doesn't, hiding only keeps the item and records it (step 3).
- Changelog entries and commit messages describe what was built in mechanical terms only.

## Bible sections this spec relies on

| Source | Section | What it sets |
| --- | --- | --- |
| `games/black-lantern/bible.md` | Story → Demo case, step 7; Adding a new case, step 7 | Every case ends with a debrief with Big Hat and a cover-story choice; the ending reacts to choices |
| `games/black-lantern/bible.md` | Cast → Big Hat | He gives the debrief in the same back-office scene as the briefing; calm and shout portraits |
| `games/black-lantern/bible.md` | Voice | Debrief lines and narration samples ("Fire marshal says bad wiring…") |
| `games/black-lantern/bible.md` | Skills and menus → Quality of life | Case wrap-up card (clues found, victims saved, SAN lost per agent); Confirm what sticks before hiding evidence; Finish the box |
| `games/black-lantern/bible.md` | Agents and items → Item list, Case-only items after the case; Item display | Big Hat sorts case-only items: ordinary kept as trophies, unnatural bagged unless hidden; same rows with the pin icon and detail box |
| `games/black-lantern/bible.md` | Skills and menus → Overstepping and cover stories | 2–3 cover stories, skill rolls by the agent you pick, one weak Luck story always there, an easy one for quiet clean cases, Clean books' safe story; pass closes quietly, fail climbs one step; a case where it didn't climb and the story held drops one step |
| `games/black-lantern/bible.md` | Agents and items → Starting kit | Bodyguard's Zip ties (extra clue at the debrief); Small-town reporter's Camera (extra cover story) |
| `games/black-lantern/bible.md` | Systems → Between cases | Carry-over; end-of-case improvement: heal up, +1d4% to each skill tried and failed, 99% cap |
| `games/black-lantern/bible.md` | Skills and menus → Skill unlocks | Unlocks at 40, 75 and 90% |
| `games/black-lantern/bible.md` | Systems → Statuses; Combat → Lasting injuries | Statuses clear at the heal-up; Minor injuries clear at the end of the case after the one they came from; Career-ending means a retirement |
| `games/black-lantern/bible.md` | Systems → Sanity (Willpower Points) | WP refill fully between cases |
| `games/black-lantern/bible.md` | Systems → Losing an agent | A loss in the boss fight: the recruit joins at the debrief; Big Hat's send-off line; the memorial list on the case board screen (field name, cases closed, how they were lost); the funeral before home scenes, with the recruit at the back |
| `games/black-lantern/bible.md` | Story → Case board | Closed cases stay pinned, stamped CLOSED |
| `games/black-lantern/bible.md` | Tech → Saving | `bl.season`, `bl.memorial`, `bl.roster`; save upgrades |
| `studio-bible/saves.md` | Saves | Version number, upgrade steps, test saves, deaths stick |
| `studio-bible/ui.md`, `studio-bible/controls.md`, `studio-bible/art-style.md` | House rules | Screen, buttons, drawn-in-code art |
| `games/black-lantern/specs/004-case-board.md` | 5. Closing a case | How a case closes on the board; the ending is saved but not shown on the card |
| `games/black-lantern/specs/006-still-harvest-story-and-play.md` | C6. The ending, held for Demo 6; Left out on purpose | The ending label and the facts the debrief needs; funeral and memorial moved here |

## What is built today

From the changelog and spec 006 (once Demo 5 parts B and C are in):

- Still Harvest ends with an **ending label** and saves the debrief's facts: clues found, victims saved, SAN lost per agent, case-only items, choices made, overstepping step, failed skill tries and anyone lost (spec 006, C6).
- A **stand-in debrief** plays: a few Big Hat lines and the old cover-story question, then the board stamps the case CLOSED.
- Lost agents are saved to `bl.memorial`, but nothing shows them. Recruits arrive at the next area change (Part C), but not yet after a loss in the boss fight.
- Lasting injuries are rolled after fights (Part B). Items carry their pin marker (Part A).

If Part B or C changed any of this, the changelog wins; note the difference in this spec's changelog entry.

## What to build

The debrief plays in this order, right after the case's last scene. Each step autosaves when it ends, so closing the app mid-debrief picks up at the same step (Systems → Gameplay loop, Saving).

### 1. Big Hat's debrief (mockup screen 1)

- **Scene:** the donut-shop back room from the briefing, with Big Hat in the Lantern Bust box (calm or shout portrait, as the line calls for).
- **Wrap-up card** across the top, as in the mockup: `CASE CLOSED` and the case title, then clues found (`4/5`), victims saved (`2/3`), fights, the overstepping step, and each agent's SAN lost this case under their field name. Rows a case doesn't use (no victims) are left out. It stays on screen while Big Hat talks.
- **His lines** come from the case's text block, chosen by the ending label, and can also react to choices the case saved (spec 006, C5). Keep each ending to a few boxes.
- **Bodyguard's Zip ties:** if a Bodyguard tied up a beaten human enemy this case, one extra line gives the extra clue, and the clue count includes it.
- **Send-off:** for each agent lost this case, Big Hat says one line naming them (Losing an agent). Lost in a fight or at 0 SAN, it's a death line; Career-ending, it's a retirement line.

### 2. A recruit, if one is owed

- If an agent was lost in the boss fight, or retired from an injury in it, the recruit joins here, before the items: Big Hat offers the same pick of 3 recruits, or the creator, exactly as Part C built it for a mid-case loss (Losing an agent). Nobody else's loss waits for the debrief.
- The recruit takes no part in the case's gains (step 5) and starts their personal arc next case.

### 3. Bag or hide (mockup screen 2)

- **Header:** `CASE ITEMS` · `Big Hat sorts`. Every case-only item the party carries (pin icon), from any agent's slots or the backpack, in the standard item rows.
- Each row shows the item's name, `Ordinary` or `Unnatural`, and a chip: `KEEP` for ordinary items, `BAG` for unnatural ones. The detail box shows the item's line and what will happen to it.
- **A on an unnatural row** flips it to `HIDE` and asks `Hide the <item> from Big Hat? Can't be undone.` with `Hide it` / `Bag it` (Quality of life, Confirm what sticks). B or `Bag it` leaves it on `BAG`. Ordinary rows do nothing on A.
- **A on `Done`** (a row under the list) sorts them: kept items stay where they are; bagged items leave the party; hidden items stay where they are and are added to the season's hidden list (step 7).
- **Unnatural or ordinary** is set per item in the case's data. Still Harvest's come from its case file.
- With no case-only items, this step is skipped.

### 4. Cover story (mockup screen 3)

- **Header:** `COVER STORY` · `What do locals hear?`, then the **overstepping track**: Clean, Noticed (quiet cases only), Chief, Call, Feds, with the current step lit, as in the mockup.
- **Stories:** the case's 2–3 stories, each with its skill (`Bureaucracy · paper it`, `Persuade · sell it`) and its best odds in the party. Then the always-present weak story (`Weak story · Luck`, 50%). Extra rows appear when they're earned:
  - an **easy story** if the case is quiet and the step is still Clean (the case writes it and sets its roll),
  - Bureaucracy's **Clean books** safe story if any agent has that unlock (no roll, shows `SAFE`),
  - the Small-town reporter's **Camera** story, if their Camera photographed a clue this case (the case writes it).
- **Who tells it:** under the list, the three agents' faces with each one's chance for the highlighted story, the best one preselected. Luck and safe stories skip this row (Luck is the same for everyone).
- The detail box says what happens on a pass and on a fail, naming the step it would climb to. A tells it, B goes back to the story list.
- **The roll:** a pass closes the case quietly. A fail climbs overstepping one step and plays one line. At Feds, a fail can't climb any higher.
- **The step drops one** at the end of this step if it didn't climb at any point during the case and the story held (Overstepping, Carry-over). Never below Clean.
- **Failed skill tries:** a failed cover-story roll counts as a failed try for the teller (step 5), like any other skill roll.

### 5. Case gains (mockup screen 4)

- **Header:** `CASE GAINS` · `Failed it, learned it`. One block per agent who finished the case, with face, field name and profession.
- **Each skill the agent tried and failed** this case (once per skill, however many times it failed) rolls 1d4: a die chip with the roll and `old → new` (Between cases, End-of-case improvement). Nothing goes above 99%.
- **New unlocks:** crossing 40, 75 or 90 flashes `★ NEW: <unlock name>` under that agent (Skill unlocks).
- **Heal-up line** at the bottom: `Patched up: HP, WP and statuses reset.` Then HP and WP refill, statuses clear, and Minor lasting injuries from the case before this one clear (Lasting injuries, How long they last). Serious, Grave and this case's Minor injuries stay. SAN, disorders, Bonds and Adapted marks carry over unchanged.
- The bottom hint reads `A: continue`. It points to the board, not home scenes, until home scenes are built (step 6).
- Then clear the failed-tries list for the next case.

### 6. Funeral or goodbye, then the board

- **If anyone was lost:** the funeral cutscene plays for each death, and the retirement goodbye for each Career-ending agent (Losing an agent; Lasting injuries, Career-ending). The recruit stands at the back. It costs no one's home scene and no SAN.
- **Memorial:** each lost agent's entry in `bl.memorial` is completed: field name, profession, cases closed, how they were lost (`Bled out`, `Lost to the dark` for 0 SAN, `Retired`), the case and season.
- **Home scenes are not in this spec** (Season readiness, step 3). Until then, the debrief goes straight to the case board.
- **Case board:** the case is marked closed with its ending label in `bl.season`, `closed` rises by one, and the CLOSED stamp lands on the card as today (spec 004, step 5).

### 7. The memorial list on the board

The bible puts the memorial list on the case board screen but no mockup shows it. Keegan picked a plaque pinned on the board (Nov 22):

- **A memorial plaque** pinned in the cork board's lower corner, drawn in code to match the board (a small dark wood plaque with a brass edge). It appears only once `bl.memorial` has someone on it. The cursor reaches it like a card.
- **A on the plaque** opens `MEMORIAL` in the Lantern Bust style: one row per agent, newest first, with their face, field name, profession, cases closed, how they were lost (`Retired` in a calmer color), and the season. Up/Down scroll; B closes.
- New game (a fresh season) keeps the memorial, like the roster.

### Saves (Tech → Saving; `studio-bible/saves.md`)

- One new upgrade step, version + 1. Add real test saves from this build to `tools/test-saves/`: one paused mid-debrief, and one with a memorial entry.
- **New things to save:** the debrief step reached (in `bl.game`, so it resumes); the season's hidden evidence list (`bl.season.hidden`: item id, case, who hid it); each lasting injury's case count, so Minor injuries clear on time (on the agent in `bl.roster`); the finished memorial entries (`bl.memorial`).
- Old saves: a save already past the stand-in debrief stays as it is. A save mid-case finishes into the new debrief.

### Left out on purpose

| Piece | Now or later |
| --- | --- |
| Home scenes, personal arc beats, Sabbatical, Therapy, Special Training | Season readiness, step 3 (home phase spec) |
| What hidden evidence does to the agency arc | Only if the secret arc file sets it (see Where the story lives) |
| Trophies as a collection screen | Not planned. Kept items just stay in the bags |
| Agency cases, the finale and season end | Season readiness, step 4 |
| Requisition refusals from overstepping or Therapy | Part C builds the briefing side; Therapy comes with home scenes |

### Screen sizes

Every screen fits with nothing cut off at 375 × 667, 375 × 550 and 320 × 480. At 320 × 480 the wrap-up card, the story list with the who-tells-it row, and three agents' gain blocks with two skills each all fit; an agent with more than three gains scrolls inside their block.

### Shared code

The debrief is Black Lantern's own (`debrief.js`, a new part loaded after `case-board.js`). Anything another game could use, such as a die-roll chip that shows `d4·3` or a generic "sort these rows into chips" list, goes in `engine/` per `CLAUDE.md`.

## Must stay true

- Still Harvest plays start to finish, through every ending the case has, and the case board, party menu and Select work as before.
- Old saves keep opening, every test save included.
- Deaths stick: nothing in the debrief can undo a loss, a hidden item or a failed cover story (Gameplay loop, Saving).
- Nothing a player could only learn by playing appears in this spec, the changelog, the bible or a commit message.
- The finished demo build also goes to Drive as `Black Lantern/builds/intake-YYYY-MM-DD.html` (Process, Backups). It ships to Release only when Keegan says so.

## Done when

- `npm run check` passes in `games/black-lantern/src/` at all three sizes, with every old and new test save opening.
- Playtest, start to finish: a clean run (all steps, a strong story passes, the step drops, gains roll, an unlock flashes); a run with a hidden item and a failed Luck story (the step climbs); a run that loses an agent mid-case and one that loses an agent in the boss fight (recruit at the debrief, send-off, funeral, the plaque on the board with their row); and closing the app mid-debrief and reopening.
- On an iPhone SE, the four screens match the mockup.
- `changelog.md` has a dated entry, with any deviations. The Demo 6 To do item is ticked, and so is the Demo revamp item above it once Demo 5 is ticked too.

## Bible notes for the Designer (no change made here)

- Skills and menus → Overstepping: the bible doesn't say what a failed cover story does at Feds, the top step. This spec holds it at Feds, since steps never skip and there's nothing above.
- Agents and items → Case-only items: "Hiding has consequences for the agency" is defined nowhere public. If it's meant to be a visible rule, it needs a line in the bible.
