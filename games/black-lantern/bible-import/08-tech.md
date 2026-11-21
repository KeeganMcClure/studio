## Tech

The game is the "Black Lantern Intake" HTML artifact, played on an iPhone SE inside a Game Boy Advance-style shell.

### File and code

- One artifact, split into parts (since Nov 21). The parts live in the private GitHub repo KeeganMcClure/black-lantern and are built in Claude Code, which bundles them into one HTML file for the artifact; the repo's CLAUDE.md carries these rules (since Nov 21). No outside assets except Google Fonts: Press Start 2P (headings, UI) and VT323 (body text). All art is drawn in code on canvas; there is no sound or music.
- The parts, loaded in this order: `index.html` (the page and the GBA shell look), `strings.js` (the shared strings block, `window.BLS`), `creator.js` (agent creator plus shared shell input and portraits, `window.BL`), `dialog.js` (the Lantern Bust box, copied unchanged from the Asset Library, `window.BLD`), `engine.js` (map, dialog, sanity, battle, Big Hat scenes, saves, pause, input, `window.BLG`), then one file per case in `cases/` (Still Harvest: `cases/still-harvest.js`). A chat reads only the parts its task touches. A new case is a new file in `cases/`, added as a script line at the end of `index.html`; each case file supplies its maps, enemies, scripts and a `caseOpening` briefing.
- Agents on the map (since Nov 21): `shelf.js` (the Shared Shelf script, copied unchanged; method v1 and person v1 are the pieces in use) and `agent-sprite.js` (agent world sprites, `window.BLA`) load after `creator.js`, before `dialog.js`. The engine calls `BLA.draw` for the lead only; townsfolk still use the engine's old `drawChar` until the Still Harvest rebuild.
- Cases are data plus small async functions: `say`, `ask`, `choose`, `battle`, `sanCheck`, `clue`, `checkpoint`.
- **Where text lives (set Nov 20).** All in-game text stays in the game file, with no separate text store or Sheet, so case writing stays a surprise. Once the file is split, each case part opens with its own text block (dialog, case text, its pools of lines), and menus, items and names share one strings block. Item and menu wording is designed in Agents and items and Skills and menus, then copied in at build time.
- Edit the existing file, never rewrite from scratch. After each change: syntax check, playtest the changed part, copy any newly drawn art into the Asset Library (see Art, Save every asset), run npm run check, commit and push, then publish the bundled file to the same artifact with a dated label (Build YYYY-MM-DD), and add a Changelog line. Milestone builds also go to Drive (see Process, Backups).

### Screen and controls

- **GBA shell stays**, on the map and in battle. You reversed the full-screen decision on Nov 15 after playing the demo, and chose the shell for combat on Nov 20.
- On-screen buttons: D-pad, A (confirm/talk), B (back), L/R (previous/next step in the creator), Start (menu or dossier), Select (cycles the lead agent on the map). Tapping menu rows also works. L and R sit in the middle cluster, in a row above Select and Start (moved from the top edge Nov 21).
- Keyboard (for testing on a computer): arrows, Z = A, X = B, Q/W = L/R, Enter = Start, Backspace = Select.
- Target: iPhone SE (375 × 667; the in-app viewer is shorter). Nothing may be cut off. Test at about 375 × 550 and 320 × 480 before publishing (see the playtest checklist in Process).

### Saving

Saves live in the phone browser's local storage, one key per row below. Clearing Safari data wipes them, so export agent codes before big updates (see Process).

| Key | Holds |
| --- | --- |
| `bl.roster` | Saved agents, with everything that carries between cases: SAN, disorders, Bonds, lasting injuries, motivation arc beats, Sabbatical cases left |
| `bl.draft` | Team in progress in the creator (since Nov 21: the team, its 3 seats, and the agent being built or tweaked) |
| `bl.game` | Case checkpoint |
| `bl.party` | The 3 agents in the field, who leads, and the backpack |
| `bl.season` | Season number, the case board (which cases are open or closed, and how each ended), cases closed, overstepping step |
| `bl.memorial` | Fallen and retired agents |
| `bl.settings` | The map menu's Settings choices |
| `bl.version` | Save version number (since Nov 21; now 2: step 2 moved agents to the new creator rules). Saves without it count as version 0 |
| `bl.backup` | Untouched copy of every save, taken just before the last upgrade, with the version it came from |
| `bl.broken` | A checkpoint the upgrade couldn't read, set aside instead of deleted (only exists if that happened) |
| `bl.sound` | Retired Nov 21 with all sound and music. The game no longer reads or writes it; old saves that still have it just ignore it |

Keep saves backward compatible. Any change that would break old saves gets flagged first. Season length and agency-case unlock counts live only in the secret arc file; Claude copies them into the game's data at build time and never writes them here (set Nov 20).

**Save upgrades (set Nov 21).** When the game opens, it backs up any older saves to `bl.backup`, then runs each upgrade step above the stored version, in order. Old steps are never changed; a change to what a save holds adds a new step and raises the version by one. Real saves from past builds sit in the repo's `tools/test-saves/`, and `npm run check` must open every one of them.

### Asset Library

The Asset Library (the old Art Bible page, converted Nov 15) is Claude's reference: live sprites, exact canvas drawing code and palette values. You view it; this doc is where you edit. Generic and seasonal art comes from the Shared Shelf instead (see Art, Shared Shelf, for the versions in use), so the Library keeps only Black Lantern's own art. Since Nov 21 it is split: the core page holds the palette, the dialog box (dialog.js), Big Hat (bighat.js) and the agents' map sprites (shelf.js, agent-sprite.js), and each case has its own page and code file (Still Harvest: still-harvest.html and still-harvest.js). To build a case, read just that case's files. Still Harvest's map still runs on legacy-street-kit.js, the frozen street-test shelf code; when the case is rebuilt, point its map at the Shared Shelf and delete that file. A new case's art goes on a new page made from the Still Harvest one.
