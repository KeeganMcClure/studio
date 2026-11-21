# Black Lantern: build rules for Claude Code

Black Lantern is Keegan's phone-first horror JRPG. Keegan is the designer and writer; Claude is developer, art director and co-writer. Keegan isn't a programmer, so explain choices briefly in plain language.

## Where things live

| What | Where |
| --- | --- |
| Game code | This repo. Code work happens here. |
| Design rules, To do, Changelog | The **Build Bible** doc: https://claude.ai/artifact/DsXEoTZYTSpYdTMPk5cojd. It is the single source of truth and wins any conflict, including with this file. Open only the tab a task needs (Start here lists them). |
| Art reference and drawing code | The **Asset Library**: https://claude.ai/artifact/3urWxdTcEECQ57KKNaz7Z1 (core page, plus one page per case) |
| Generic and seasonal art | The **Shared Shelf**: https://claude.ai/artifact/Jmv2FBeGHXczqy7juZW8dL (versions in use: Bible, Art, Shared Shelf) |
| Secret story files (agency arc, motivation arcs, home scenes) | Claude Project files only, **never in this repo**. Read them from the Project at build time when a task needs them, and copy only the game data the task needs into code (season length and unlock counts go into game data, never into the Bible). |
| Where Keegan plays | The **Black Lantern Intake** artifact: https://claude.ai/artifact/DtJF15pDw7jKP64omvVrF5 |

Design, story, mockups, Bible reviews and the Asset Library stay in the claude.ai Project. This repo is for building.

## The parts

Loaded in this order by `index.html`: the studio's shared `engine/shell.js` (builds the shell around the screen), `engine/input.js` (buttons and keyboard), `engine/move.js` (grid walking, camera, canvas fit) and `engine/party.js` (who leads, Select cycling, the party card list), then `strings.js` (shared strings, `window.BLS`), `creator.js` (agent creator, portraits, and where presses go, `window.BL`), `engine/shelf.js` (Shared Shelf script, copied unchanged), `agent-sprite.js` (agent map sprites, `window.BLA`), `engine/dialog.js` (Lantern Bust box, copied unchanged from the Asset Library, `window.BLD`), `engine.js` (map, dialog, sanity, battle, Big Hat scenes, saves, pause, input, `window.BLG`), `party-menu.js` (Start → Party, the Dossier and Select on the map), then one file per case in `cases/`.

- `index.html` keeps the screen and Black Lantern's colors; the shell's layout comes from `engine/shell.css`. `npm run build` inlines the `engine/` files, so `dist/index.html` stays one file. A change under `engine/` must pass `npm run check` in every game that uses it.
- A new case is a new file in `cases/` plus a script line at the end of `index.html`. Each case file opens with its own text block and supplies its maps, enemies, scripts and a `caseOpening` briefing.
- All in-game text stays in the game files. Menus, items and names share `strings.js`; case dialog lives in its case file.
- No outside assets except Google Fonts (Press Start 2P, VT323). All art is drawn in code. No sound or music.
- `engine/shelf.js` and `engine/dialog.js` are shared copies of the Shared Shelf script and the Asset Library's dialog box, used by every game that needs them. Don't edit them here: change the source, then run `node engine/tools/sync-shared.js` (it records the page version and a fingerprint in `engine/shared-sources.json`; `npm run check` fails if a copy was edited by hand).

## Rules for every change

1. Read the Bible tab the task needs. One task per chat, named up front.
2. Ask decisions as multiple choice, with your pick marked. Ask before big or hard-to-undo changes.
3. Edit the existing files; never rewrite a part from scratch.
4. Keep saves backward compatible (keys are in Bible, Tech, Saving). Flag anything that would break an old save before doing it. A change to what a save holds gets a new upgrade step in `creator.js` (Save versions: never edit an old step, raise `SAVE_V` by one), then `node tools/capture-saves.js YYYY-MM-DD` adds fresh test saves to `tools/test-saves/`. Never delete old test saves.
5. Run `npm run check` (builds `dist/index.html`, then checks it at 320 × 480, 375 × 550 and 375 × 667: loads, no errors, every button on screen and working, 600 random presses, a reload with saves, then every test save in `tools/test-saves/` upgrades, shows its roster and continues its checkpoint, and damaged saves open cleanly). Then playtest the changed part yourself, start to finish.
6. Copy any newly drawn art into the Asset Library (Bible, Art, Save every asset).
7. Commit with a plain-language message and push.
8. Publish: `npm run build`, then publish `dist/index.html` to the Intake artifact as its page, with the label `Build YYYY-MM-DD` (plus a short note if more than one build that day).
9. Update the Bible: tick the To do item, record decisions where they belong, file Bugs, add a Changelog line (newest first; only 10 rows stay, the oldest moves to Changelog archive).
10. Tell Keegan what to test on the phone, and when to start a fresh chat.

Milestone builds (the finished demo, each finished case) also go to Drive as `Black Lantern/builds/intake-YYYY-MM-DD.html`.

## Screen and controls

- Target: iPhone SE (375 × 667; the in-app viewer is shorter). Nothing may be cut off.
- GBA shell stays, on the map and in battle.
- Buttons: D-pad, A (confirm/talk), B (back), L/R (previous/next creator step), Start (menu or dossier), Select (cycles the lead on the map and in Party). Tapping menu rows also works.
- Keyboard for testing: arrows, Z = A, X = B, Q/W = L/R, Enter = Start, Backspace = Select.
