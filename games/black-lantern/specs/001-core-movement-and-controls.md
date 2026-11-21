# Spec 001: Shared core movement and controls

Status: draft for Keegan's review · Written 2026-11-21 by the Game Designer · Games: Black Lantern and Rushlight

## In plain words

Both games carry the same GBA shell, the same buttons and the same walking code, copied by hand. This spec moves those three pieces into the shared `engine/` folder so both games run one copy. **Nothing changes for the player.** Every button, every screen size and every step on the map must feel exactly as it does today. The win is that a fix to the shell or to walking lands in both games at once, and the next game starts with them for free.

This is a move, not a redesign. Anything that would change how a game plays is listed under "Not in this spec" or "Open questions" instead of being built.

## Bible sections this spec relies on

| Source | Section | What it sets |
| --- | --- | --- |
| `studio-bible/controls.md` | Shell | GBA shell on the map and in battle; a 240 × 160 canvas scaled with crisp pixels |
| `studio-bible/controls.md` | Buttons | D-pad, A, B, L/R, Start, Select; row taps; L and R above Select and Start; controls in the bottom half |
| `studio-bible/controls.md` | Keyboard | Arrows, Z = A, X = B, Q/W = L/R, Enter = Start, Backspace = Select |
| `studio-bible/controls.md` | Target screen | iPhone SE first, nothing cut off, test at 375 × 550 and 320 × 480 |
| `studio-bible/art-style.md` | Craft | Wide scale: 16 px tiles, about 14 × 26 px characters |
| `studio-bible/saves.md` | (whole file) | Saves stay backward compatible; old test saves must open |
| `studio-bible/rules-checks.md` | Shared engine; Across games | Shared parts go in `engine/`; a change there must not break another game |
| `games/black-lantern/bible.md` | Tech → Screen and controls | Shell stays; the button list; L/R in the middle cluster (moved Nov 21); keyboard; target sizes |
| `games/black-lantern/bible.md` | Tech → File and code | `creator.js` holds the shared shell input; `engine.js` holds map walking and input; edit, never rewrite |
| `games/black-lantern/bible.md` | Tech → Saving | Save keys, `bl.version`, upgrade steps, test saves |
| `games/black-lantern/bible.md` | Art → Maps | Only the lead walks the map |
| `games/black-lantern/bible.md` | Art → Shared Shelf | Black Lantern keeps its own shell look; `shared-ui-shell-v1` is not used |
| `games/black-lantern/bible.md` | Skills and menus → Quality of life | Running (hold B), L/R flips agents |
| `games/rushlight/bible.md` | Tech → Screen and controls | Shell as in Black Lantern; buttons carry; keyboard; target sizes |
| `games/rushlight/bible.md` | Tech → Code | Forked from Black Lantern, "never shared with it, so neither game can break the other" |
| `games/rushlight/bible.md` | Tech → Saving | `rl.*` keys; one slot, autosave |
| `games/rushlight/bible.md` | Ported rules → Tech | Screen and controls: Carry; Code: Change (forked) |
| `games/rushlight/bible.md` | Carried rules → Quality of life | Running (hold B), L/R flips mercs |
| `games/rushlight/bible.md` | Art → Rushlight's Asset Library | Rushlight names `shared-ui-shell-v1` as its shell version |

## What is built today

From each game's `changelog.md` (Nov 21, 2026) and a read of the code (no story or case files were opened).

- **Black Lantern:** shell fit for 320 × 480 with L/R moved to the middle cluster and button sizes stepping down at smaller screens ("GBA shell fit"); Select does nothing on the map until lead cycling is built ("Art build pass, part 1"); only the lead walks, on the 14 × 26 body ("Art build pass, part 4").
- **Rushlight:** a clean copy of Black Lantern's shell page, creator input and engine ("Build set up in Claude Code"). Its shell, buttons and walking code are line for line the same as Black Lantern's, apart from names (`RL`, `RLG`) and the brand text.

### The shell (in each game's `index.html`)

- One page: the bezel with a brand strip (game name and LED), the screen, then one row of controls: D-pad on the left, the middle cluster (L and R in a row above Select and Start), A and B on the right.
- Four button sizes step down by screen size (D-pad, A/B and pill widths, and the gaps), the brand strip hides at 560 px tall or 340 px wide and below, and the page respects the phone's safe areas.
- The look (purple body, button colors, screen colors) is Black Lantern's. Rushlight uses the same colors today.

### Input (in each game's `creator.js`, plus `input` and `hold` in `engine.js`)

- **D-pad buttons:** a press fires once, then repeats every 85 ms after 320 ms held (for menus and the creator). On the map the direction also counts as held, so walking continues while the finger stays down. Lifting, sliding off or a cancelled touch lets go.
- **A, B, L, R, Start, Select:** fire on tap.
- **Keyboard:** arrows; Z or Space = A; X or Backspace = B; Q/W = L/R; Enter = Start; Shift = Select. Keys are ignored while a text field has focus, and Enter or Escape in a text field only closes the phone keyboard. Held arrow keys walk. Leaving the window lets go of every direction.
- **Row taps** work in menus and the creator.
- **Routing:** while the game screen is up, every press goes to the engine; otherwise it goes to the creator.

### Movement (in each game's `engine.js`)

- A grid of 16 px tiles. Each step takes 10 frames (about a sixth of a second on the iPhone SE's 60 Hz screen), so the lead walks about 6 tiles a second.
- The last direction pressed wins. Pressing toward a wall, the map edge or a townsperson turns the lead to face it without moving.
- Walking pauses during dialog, menus and scripted moments. Warps and step triggers fire on arriving at a tile.
- A, standing still, uses the tile in front: townsfolk turn to face the lead and talk, objects run, and some tiles describe themselves. Start, standing still, opens the map menu. B, L, R and Select do nothing on the map yet.
- Walk frames change every 5 frames; the lead blinks when still. The camera follows the lead, stops at the map's edges, and centers a map smaller than the screen.
- The canvas is 240 px wide and as tall as the screen's shape allows (130 to 320 px; about 293 to 320 px on the three test sizes), scaled to fill the screen with crisp pixels. See Open question 2.
- A leftover trail list (`G.hist`, from when three agents walked) is still filled each step but never drawn.

## What to build

Three shared parts in `engine/`, used by both games. The Developer picks the file names and how the code is shaped; the names below are suggestions.

### 1. Shell (`engine/shell.css`, plus markup)

- The layout, sizes and size steps from "The shell" above, unchanged at every size.
- **Each game keeps its own look.** Colors, brand text and the LED come from the game as variables (Black Lantern Art → Shared Shelf keeps its own shell look; Rushlight names `shared-ui-shell-v1`). After this spec both games still look exactly as they do today; Rushlight can repaint later without touching `engine/`.
- Game screens inside the shell (the creator's boxes, the map canvas, dialog and menus) stay in each game.

### 2. Input (`engine/input.js`)

- Everything under "Input" above: button presses, D-pad hold and repeat with the same 320 ms and 85 ms timings, held directions, keyboard keys, letting go on blur, ignoring keys while typing.
- The game tells the input part where presses go (creator or engine) instead of the input part knowing either game's names.
- Buttons with nothing to do on a screen stay harmless, as today.
- Room for later, not built now: a way to ask "is B being held?", which Running (hold B) will need in both games (Quality of life in both bibles).

### 3. Movement (`engine/move.js`)

- Grid walking exactly as under "Movement" above: 16 px tiles, 10 frames a step, last direction wins, turn in place when blocked, pause while busy, step triggers on arrival, the facing tile for A, the camera rules and the canvas fit.
- The game supplies what is specific to it: its maps and which tiles block, its townsfolk, what A does on a tile, and how the lead is drawn (`BLA.draw` or `RLA.draw`).
- What a save holds does not change: map, x, y and facing stay as they are in `bl.game` and `rl.game`. No new save version.
- The unused trail list can go, since nothing reads it and it isn't saved.

### Wiring

- Each game loads the shared parts from `engine/` and its `npm run build` inlines them, so `dist/index.html` stays one self-contained file (Black Lantern Tech → File and code).
- The hand-copied code these parts replace comes out of both games' `creator.js`, `engine.js` and `index.html`. Remove only those lines; edit the existing files, never rewrite a part (Black Lantern Tech → File and code; Rushlight Tech → Code).
- The Black Lantern Intake artifact keeps getting one bundled file, so its link and saves stay.

## Done when

1. Both games load the shell, input and movement from `engine/`, and neither game keeps its own copy.
2. `npm run check` passes for both games at 320 × 480, 375 × 550 and 375 × 667, including every button, 600 random presses and the reload with saves.
3. Every file in Black Lantern's `tools/test-saves/` still opens, and a fresh save works in both games (`studio-bible/saves.md`).
4. **Same-moves check:** the same scripted presses (walk into a wall, walk a loop, hold a direction across a warp, open and close the map menu, talk to someone) give the same tile, facing and frame count in the old build and the new one, for each game. Screenshots at the three sizes match the old build, shell included.
5. A change under `engine/` runs both games' checks before it merges, so one game's fix can't quietly break the other (`studio-bible/rules-checks.md`, Across games).
6. Each game's `changelog.md` gets a dated entry: what moved, what is left, any deviation from this spec.

## Not in this spec

- **The dialog box and the Shared Shelf script** (`dialog.js`, `shelf.js`). They are already the same file in both games, but they are hand copies of the Asset Library and the Shared Shelf, and Black Lantern's To do has its own item to make them shared files. That deserves its own spec.
- **Battle, menus, saves and the creator.** Only the input wiring of the creator moves.
- **Running (hold B), Select cycling the lead, and L/R flipping agents or mercs.** All are in the bibles and none is built. They change how the game plays, so they get their own specs; this one only leaves room for them.
- **Walking speed on fast screens.** Steps are counted in screen frames, so a 120 Hz phone walks twice as fast as the iPhone SE. Fixing it would change play on those phones. It's a bug, so it goes straight to the Developer, after this move lands.

## Conflicts found

1. **Rushlight says its code is never shared** (Rushlight Tech → Code; Ported rules → Tech; Rushlight's CLAUDE.md, "It stays forked, never shared"). This spec shares code with Black Lantern. The studio's CLAUDE.md already plans the merge ("Rushlight's `engine.js` ... merges into `engine/` in Phase 6"), so the two rules disagree. See Open question 1.
2. **Keyboard Backspace.** `studio-bible/controls.md` and Black Lantern Tech say Backspace = Select. Both games' code has Backspace = B and Shift = Select. Rushlight Tech's keyboard line leaves Select out. See Open question 3.
3. **Canvas size.** `studio-bible/controls.md` (Shell) and the studio CLAUDE.md say a 240 × 160 canvas. Both games draw 240 wide and up to 320 tall, at a scale of about 1.37 rather than a whole number. A fixed 240 × 160 would show about half as many rows of the map and add black bars, which changes how both games look and play. See Open question 2.
4. **Where the code lives.** Black Lantern Tech → File and code and Rushlight Tech → Builds still name the separate `black-lantern` and `rushlight` repos. The code now sits in this repo under `games/<game>/src/`. Wording only; a follow-up bible PR can fix it.

## Proposed for studio-bible/

- **`controls.md`, Buttons:** add the D-pad timing (repeat after 320 ms, then every 85 ms) and "last direction pressed wins", so every future game feels the same.
- **`controls.md`, Shell:** add "the shell layout is shared; each game paints it in its own colors", matching what both bibles already do.
- **`controls.md`, Shell:** the canvas rule, depending on Open question 2.

These go in as a separate PR once Keegan answers the questions below.

## Open questions for Keegan

1. **Rushlight's "never shared" rule.**
   - A. Change it: Rushlight shares the shell, input and movement through `engine/`, and both games' checks run on every engine change. (Recommended) It keeps the rule's goal, that one game can't break the other, while ending the hand copying.
   - B. Keep Rushlight forked: only Black Lantern uses `engine/`, and Rushlight keeps its copy.
2. **The canvas size.**
   - A. Update `controls.md` to match the games: 240 px wide, as tall as the screen allows. (Recommended) It's what you've been playing, and it shows more of the map on a phone.
   - B. Keep 240 × 160 as the rule, and change both games in a later spec.
3. **Backspace on the keyboard.**
   - A. Follow the bible: Backspace = Select, and keep Shift as a second Select key. (Recommended) It only affects testing on a computer, and puts the code back in line with the house rule.
   - B. Change the bibles to match the code: Backspace = B, Shift = Select.

Question 1 must be answered, and the Rushlight bible updated to match, before the Developer starts. Questions 2 and 3 don't block the move: until they're answered, the engine keeps today's canvas fit and today's keys.
