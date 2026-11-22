# Rushlight: build rules for Claude Code

Rushlight is Keegan's phone-first dark fantasy roguelike: a seeded region of towns and wilds, contracts, and a company of 3 mercenaries hunting cryptid and cosmic things (and, often, people). Keegan is the designer and writer; Claude is developer, art director and co-writer. Keegan isn't a programmer, so explain choices briefly in plain language, at an average reading level.

## Where things live

| What | Where |
| --- | --- |
| Game code | This repo. Code work happens here. |
| Design rules, To do, Bugs | `games/rushlight/bible.md`. It is the single source of truth and wins any conflict, including with this file. Read only the section a task needs. Carried Black Lantern rules are written out in Systems → Carried rules, so a build never needs Black Lantern's bible. The old Rushlight Build Bible doc on claude.ai is frozen; don't use it. |
| Changelog | `games/rushlight/changelog.md`, newest first. |
| Specs and mockups | `games/rushlight/specs/` and `games/rushlight/mockups/`. Build only from a merged spec. |
| In-game text | The **Rushlight Text Library** Sheet: https://claude.ai/artifact/QNKtwsJvEkAtTDnn4LDSNA. Content data reads lines from it by ID. Only Approved rows ship; Draft rows are placeholders. |
| Art reference and drawing code | The **Rushlight Asset Library**: https://claude.ai/artifact/WYgm7Gn8afLE51Pce94ynt. Art first drawn during a build is filed there under the Art across games naming before the build uses it. |
| Generic art, the shell and the dialog box | The **Shared Shelf**: https://claude.ai/artifact/Jmv2FBeGHXczqy7juZW8dL, at the versions the Bible names. Never write to it without asking Keegan first. |
| Where Keegan plays | The launcher's **Dev** shelf. Every push to `main` puts the bundled build there (Bible, Tech, Builds; `studio-bible/launcher.md`). Rushlight moves to Release only when Keegan says so. |

The Text Library and the Asset Library stay on claude.ai. The bible, specs and changelog live in this repo; the Designer changes the bible only in pull requests Keegan merges.

## Black Lantern

- This code is a clean copy of Black Lantern's kept parts, made Nov 21, 2026 with no git history, so no Black Lantern story ever loads here.
- Parts both games use live in the studio's shared `engine/` instead of being copied (Bible, Tech, Code; set Nov 21). So far: the GBA shell (`engine/shell.css`, `engine/shell.js`), buttons and keyboard (`engine/input.js`) and map walking (`engine/move.js`), from spec 001; the 60-ticks-a-second game clock (`engine/clock.js`), from the 120 Hz walking-speed fix.
- Neither game may break the other: a change under `engine/` runs `npm run check` in both games before it merges (the studio's checks do this on every pull request).
- The rest of the code is still a fork. Until a part moves into `engine/`, copy a fix that applies to both games by hand.
- Never edit Black Lantern's repo or Bible from here. If a task needs a Black Lantern code fix, read only the code file it's in, never its cases, story, agency-arc or spoiler files.

## The parts

Loaded in this order by `index.html`: the shared `engine/shell.js` (builds the shell around the screen), `engine/input.js` (buttons and keyboard), `engine/move.js` (grid walking, camera, canvas fit), `engine/clock.js` (logic at 60 ticks a second on any screen), `engine/light.js` (night pools and the low-SAN sour look, `StudioLight`), `engine/party.js` (lead cycling and the party card list, `StudioParty`), `engine/seed.js` (seeded streams whose position saves, `StudioSeed`), `engine/roll.js` (d100 rolls, crits, fumbles and the result line, `StudioRoll`, pointed at the run's dice stream), `engine/battle.js` (the battle frame, `StudioBattle`) and `engine/patrol.js` (`StudioPatrol`); then `strings.js` (shared strings, `window.RLS`), `creator.js` (the creator and where presses go, `window.RL`), `engine/shelf.js` (Shared Shelf script, copied unchanged), `species-art.js` (the six species' portraits, map sprites, back views and coin tokens from the approved species sheet, `window.RLSP`), `art/creatures.js` and `art/art.js` (the Asset Library's battle sprites, copied unchanged by `tools/import-art.js`, as canvases through `window.RLArt`), `engine/dialog.js` (the dialog box, copied unchanged, `window.BLD`), `engine/menu.js` (`window.StudioMenu`), `engine.js` (map, dialog, sanity, saves, pause, input, `window.RLG`), `battle.js` (Rushlight's battle on the shared frame), `party-menu.js` (who leads, Select, Start → Party), `engine/nearest.js` (`StudioNearest`), `content/text-library.js` (every Text Library line by ID, `window.RL_TEXT`), then `content/stub.js`.

- `index.html` keeps the screen and Rushlight's colors; the shell's layout comes from `engine/shell.css`. `npm run build` inlines the `engine/` files, so `dist/index.html` stays one file.
- Planned split (Bible, Tech, Code): shell, engine, generator, content data and art in separate parts. Content batches touch only the data parts, so a new creature can't break combat.
- No outside assets except Google Fonts (Press Start 2P, VT323). All art is drawn in code. No sound.
- `engine/shelf.js` and `engine/dialog.js` are shared copies of the Shared Shelf script and Black Lantern's Asset Library dialog box. Don't edit them here: change the source, then run `node engine/tools/sync-shared.js` (`npm run check` fails if a copy was edited by hand). They keep their library names (`SHELF`, `BLD`).

### Still Black Lantern's (replace as the vertical slice reaches each)

- `creator.js` and `strings.js`: Black Lantern's agent creator, professions, specialties and items. Pick a company replaces them.
- `engine.js`: the maze and boss intro hooks and the case flow (`caseOpening`). The seeded generator, contracts and the ledger replace them. The battle, party, dice and darkness code is no longer Black Lantern's (spec 002): it's `battle.js`, `party-menu.js` and the shared `engine/` pieces.
- `content/stub.js` only exists so the engine boots with no case. It ends at the title and saves nothing.
- Save keys are `rl.*` (`dev.rl.*` on the site's Dev build, through `RL.key` and `engine/studio.js`), but still Black Lantern's set (`rl.roster`, `rl.draft`, `rl.game`). The slice moves to the Bible's keys (`rl.run`, `rl.ledger`, `rl.draft`) with a save version number, like Black Lantern's `bl.version`.
- Big Hat, cases, Lantern Boxes, requisition and sound are already gone.

### Shared pieces still to use (spec 002, 6)

- Roamers on site maps walk their beats with `StudioPatrol` (`engine/patrol.js`).
- The notice board's cursor and the region map's cursor move with `StudioNearest` (`engine/nearest.js`).

## Rules for every change

1. Read the bible section the task needs. One task per chat, named up front.
2. Ask decisions as multiple choice, with your pick marked. Ask before big or hard-to-undo changes. Every system needs a gameplay stake.
3. Edit the existing files; never rewrite a part from scratch.
4. Keep saves backward compatible (keys are in Bible, Tech, Saving). Flag anything that would break an old save before doing it.
5. Run `npm run check` (builds `dist/index.html`, then checks it at 320 × 480, 375 × 550 and 375 × 667: loads, no errors, every button on screen and working, 600 random presses, a reload with saves; and new runs on 3 seeds once `RLG.newRun(seed)` exists). Then run the bible's Process playtest checklist, and playtest the changed part yourself, start to finish.
6. File any newly drawn art in the Asset Library first (Bible, Tech, Asset Library).
7. Commit with a plain-language message and push. Once merged to `main`, the build is on the launcher's Dev shelf; there is no artifact to publish.
8. Backups: none to make. Git history keeps every version of the game and the bible, so the old Drive copies (dated builds, bible tab exports) have stopped (Bible, Process, Backups).
9. In the same pull request: add a dated entry at the top of `changelog.md` (what was built, what's left, any deviations from the spec), tick the matching To do item in `bible.md` with one indented `Done <date>:` line, and tick any Bugs line the fix closes. Change nothing else in the bible: decisions, Ported rules and new Bugs go to Keegan for the Designer.
10. Tell Keegan what to test on the phone, and when to start a fresh chat.

## Screen and controls

- Target: iPhone SE (375 × 667; the in-app viewer is shorter). Nothing may be cut off.
- GBA shell on the map and in battle.
- Buttons: D-pad, A (confirm/talk), B (back), L/R, Start (menu), Select (cycles the lead merc). Tapping menu rows also works.
- Keyboard for testing: arrows, Z = A, X = B, Q/W = L/R, Enter = Start, Backspace = Select.

## Seeds

One run seed per run; region n's seed is the run seed plus n. Dice draw from a second stream whose position is saved, so reopening rerolls nothing. Deaths stick. The seed shows on the Muster roll and the death screen, and a new run can start from a typed seed.
