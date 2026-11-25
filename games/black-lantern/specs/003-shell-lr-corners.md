# Spec 003: L and R in the top corners of the shell

Status: approved and built (status updated Nov 25, 2026; see the bible's To do and the changelog) · Written 2026-11-21 by the Game Designer · Games: every game on the shared shell (Black Lantern, Rushlight, and Life After when it starts)

## In plain words

Keegan finds the on-screen L and R buttons too small and hard to reach. This spec moves them out of the middle cluster and into the top corners of the controls area as wide shoulder buttons, the way a real handheld has them: L top left, R top right, just under the screen. Select and Start stay in the middle. Nothing else about the controls changes. L and R do the same things they did before, in every game.

What you'll feel in play: your thumbs land on L and R without looking, because they sit right above where your thumbs already rest on the D-pad and A/B.

Mockup (approved Nov 21, v2): [`003-shell-lr-corners-mockup.png`](003-shell-lr-corners-mockup.png). It's a still drawn with the real `engine/shell.css` and `engine/shell.js` at 375 × 667 in Black Lantern's colors, today's shell beside the new one.

## Bible sections this spec relies on

| Source | Section | What it sets |
| --- | --- | --- |
| `studio-bible/controls.md` | Shell | One shared shell layout for every game; each game paints it in its own colors |
| `studio-bible/controls.md` | Buttons | L and R in the top corners of the controls area, about 80 × 24 px (changed Nov 21 with this spec); keep every control in the bottom half of the phone |
| `studio-bible/controls.md` | Target screen | iPhone SE first, nothing cut off, test at 375 × 550 and 320 × 480 |
| `studio-bible/art-style.md` | How art is made | Drawn in code, no image files |
| `studio-bible/launcher.md` | Shared settings | Control layout and button size live in the launcher later; this spec only sets the default layout |
| `games/black-lantern/bible.md` | Tech → Screen and controls | Button list; L and R in the top corners (changed Nov 21 with this spec) |
| `games/rushlight/bible.md` | Tech → Screen and controls | Shell and buttons carry from Black Lantern |
| Spec 001 | The shell | The shell lives in `engine/shell.js` and `engine/shell.css`, shared by both games |

## What is built today

From `engine/shell.js` and `engine/shell.css` (Nov 21, after spec 001):

- L and R (`#bL`, `#bR`) sit in `.lr`, a row inside the middle cluster `.mid`, above Select and Start.
- They are 42 × 22 px at full size and step down to 38 × 18 px at the smallest screens.
- On an iPhone SE the game screen is 494 px tall; at 320 × 480 it is 344 px tall.

## What to build

1. **New shoulder row.** Between the bezel and the controls row, add a row holding L on the left edge and R on the right edge, with empty space between them. Move `#bL` and `#bR` into it, keeping their ids, labels (`data-label-l`, `data-label-r`) and everything `engine/input.js` hooks onto. Remove the old `.lr` row from the middle cluster.
2. **Size and shape.** About 80 × 24 px, label in Press Start 2P at about 9 px. The outer top corner is rounded more than the others (about 12 px on the outside top corner, 5 px elsewhere), so they read as shoulder buttons. Same colors as today (`--btn`, `--label`) and the same pressed look.
3. **Snug fit.** The row sits close to the controls under it (the mockup uses a small negative gap), so the screen gives up as little height as possible: about 24 px on an iPhone SE (494 → 470) and about 24 px at 320 × 480 (344 → 320).
4. **Smaller screens.** Keep the existing size steps. At the smallest step (480 px tall and below), the buttons may shrink to about 72 × 22. They must never be narrower than today's.
5. **Middle cluster.** Only Select and Start are left in it. They stay where they are.
6. **Each game's look.** No game paints L and R itself; they use the shared variables as today.

## Must stay true

- Every control stays in the bottom half of the phone, and nothing is cut off at 375 × 667, 375 × 550 or 320 × 480.
- L and R do exactly what they did before in every game, on the map, in menus and in the creator. Keyboard Q and W still work.
- Saves are untouched.
- The game canvas stays 240 px wide and still fits the screen height (130 to 320 px).

## Not in this spec

- Moving any other button, or changing button sizes other than L and R.
- What L and R step through in each game (each game's bible already says; Life After's is still open).
- The launcher's control layout and button size settings.

## Done when

- `npm run check` passes in each game's `src/` at all three sizes.
- On an iPhone SE, L and R sit in the top corners under the screen, matching the mockup.
- Each game's `changelog.md` has a dated entry for the move.
