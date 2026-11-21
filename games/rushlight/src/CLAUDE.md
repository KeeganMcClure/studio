# Rushlight: build rules for Claude Code

Rushlight is Keegan's phone-first dark fantasy roguelike: a seeded region of towns and wilds, contracts, and a company of 3 mercenaries hunting cryptid and cosmic things (and, often, people). Keegan is the designer and writer; Claude is developer, art director and co-writer. Keegan isn't a programmer, so explain choices briefly in plain language, at an average reading level.

## Where things live

| What | Where |
| --- | --- |
| Game code | This repo. Code work happens here. |
| Design rules, To do, Changelog | The **Rushlight Build Bible** doc: https://claude.ai/artifact/57EcpKt21AqX87XfiwV8qw. It is the single source of truth and wins any conflict, including with this file. Open only the tab a task needs (Start here lists them). Carried Black Lantern rules are written out in Systems → Carried rules, so a build never needs Black Lantern's Bible. |
| In-game text | The **Rushlight Text Library** Sheet: https://claude.ai/artifact/QNKtwsJvEkAtTDnn4LDSNA. Content data reads lines from it by ID. Only Approved rows ship; Draft rows are placeholders. |
| Art reference and drawing code | The **Rushlight Asset Library**: https://claude.ai/artifact/WYgm7Gn8afLE51Pce94ynt. Art first drawn during a build is filed there under the Art across games naming before the build uses it. |
| Generic art, the shell and the dialog box | The **Shared Shelf**: https://claude.ai/artifact/Jmv2FBeGHXczqy7juZW8dL, at the versions the Bible names. Never write to it without asking Keegan first. |
| Where Keegan plays | The **Rushlight** artifact. Not published yet: the first publish creates it, then put its link here and in the Bible's Tech tab, and publish to that same artifact every time so the link and saves stay. |

Design, mockups, Bible reviews, the Text Library and the Asset Library stay in the claude.ai Project. This repo is for building.

## Black Lantern

- This code is a clean copy of Black Lantern's kept parts, made Nov 21, 2026 with no git history, so no Black Lantern story ever loads here.
- Parts both games use live in the studio's shared `engine/` instead of being copied (Bible, Tech, Code; set Nov 21). So far: the GBA shell (`engine/shell.css`, `engine/shell.js`), buttons and keyboard (`engine/input.js`) and map walking (`engine/move.js`), from spec 001.
- Neither game may break the other: a change under `engine/` runs `npm run check` in both games before it merges (the studio's checks do this on every pull request).
- The rest of the code is still a fork. Until a part moves into `engine/`, copy a fix that applies to both games by hand.
- Never edit Black Lantern's repo or Bible from here. If a task needs a Black Lantern code fix, read only the code file it's in, never its cases, story, agency-arc or spoiler files.

## The parts

Loaded in this order by `index.html`: the shared `engine/shell.js` (builds the shell around the screen), `engine/input.js` (buttons and keyboard) and `engine/move.js` (grid walking, camera, canvas fit), then `strings.js` (shared strings, `window.RLS`), `creator.js` (the creator, portraits, and where presses go, `window.RL`), `shelf.js` (Shared Shelf script, copied unchanged), `agent-sprite.js` (map sprites, `window.RLA`), `dialog.js` (the dialog box, copied unchanged, `window.BLD`), `engine.js` (map, dialog, sanity, battle, saves, pause, input, `window.RLG`), then `content/stub.js`.

- `index.html` keeps the screen and Rushlight's colors; the shell's layout comes from `engine/shell.css`. `npm run build` inlines the `engine/` files, so `dist/index.html` stays one file.
- Planned split (Bible, Tech, Code): shell, engine, generator, content data and art in separate parts. Content batches touch only the data parts, so a new creature can't break combat.
- No outside assets except Google Fonts (Press Start 2P, VT323). All art is drawn in code. No sound.
- `shelf.js` and `dialog.js` are hand copies. Don't edit them here; change the source and copy it in again. They keep their library names (`SHELF`, `BLD`).

### Still Black Lantern's (replace as the vertical slice reaches each)

- `creator.js` and `strings.js`: Black Lantern's agent creator, professions, specialties and items. Pick a company replaces them.
- `engine.js`: the notebook, clues, the maze, the boss intro hook, the case flow (`caseOpening`, `finish` filing to the roster), the game-over text and `startKit`. The seeded generator, contracts and the ledger replace them.
- `content/stub.js` only exists so the engine boots with no case. It ends at the title and saves nothing.
- Save keys are `rl.*` (`dev.rl.*` on the site's Dev build, through `RL.key` and `engine/studio.js`), but still Black Lantern's set (`rl.roster`, `rl.draft`, `rl.game`). The slice moves to the Bible's keys (`rl.run`, `rl.ledger`, `rl.draft`) with a save version number, like Black Lantern's `bl.version`.
- Big Hat, cases, Lantern Boxes, requisition and sound are already gone.

## Rules for every change

1. Read the Bible tab the task needs. One task per chat, named up front.
2. Ask decisions as multiple choice, with your pick marked. Ask before big or hard-to-undo changes. Every system needs a gameplay stake.
3. Edit the existing files; never rewrite a part from scratch.
4. Keep saves backward compatible (keys are in Bible, Tech, Saving). Flag anything that would break an old save before doing it.
5. Run `npm run check` (builds `dist/index.html`, then checks it at 320 × 480, 375 × 550 and 375 × 667: loads, no errors, every button on screen and working, 600 random presses, a reload with saves; and new runs on 3 seeds once `RLG.newRun(seed)` exists). Then playtest the changed part yourself, start to finish.
6. File any newly drawn art in the Asset Library first (Bible, Tech, Asset Library).
7. Commit with a plain-language message and push.
8. Publish: `npm run build`, then publish `dist/index.html` to the Rushlight artifact as its page, with the label `Build YYYY-MM-DD` (plus a short note if more than one build that day).
9. Back up: a dated copy of the build to the Rushlight backups folder in Google Drive as `rushlight-build-YYYY-MM-DD.html` (keep the last 5 plus milestones). Before a task edits a Bible tab, that tab's export goes there as `rushlight-bible-YYYY-MM-DD-tab.md`. Never to Project files.
10. Update the Bible: tick the To do item, record decisions where they belong, update Ported rules if a Black Lantern rule changed, file Bugs, add a Changelog line under Process (newest first; only 10 rows stay, the oldest moves to Changelog archive).
11. Tell Keegan what to test on the phone, and when to start a fresh chat.

## Screen and controls

- Target: iPhone SE (375 × 667; the in-app viewer is shorter). Nothing may be cut off.
- GBA shell on the map and in battle.
- Buttons: D-pad, A (confirm/talk), B (back), L/R, Start (menu), Select (cycles the lead merc). Tapping menu rows also works.
- Keyboard for testing: arrows, Z = A, X = B, Q/W = L/R, Enter = Start, Backspace = Select.

## Seeds

One run seed per run; region n's seed is the run seed plus n. Dice draw from a second stream whose position is saved, so reopening rerolls nothing. Deaths stick. The seed shows on the Muster roll and the death screen, and a new run can start from a typed seed.
