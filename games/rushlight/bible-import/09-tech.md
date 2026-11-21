## Tech

Rushlight is a fork of Black Lantern's game file, played on an iPhone SE inside Black Lantern's GBA-style shell (set Nov 20).

**Screen and controls**

- **GBA shell, as in Black Lantern** (set Nov 20). This reverses the Overview's first full-screen plan, for the same reason Black Lantern reversed it. The three mockups were drawn full screen and get redrawn in the shell (see To do).
- On-screen buttons carry from Black Lantern: D-pad, A (confirm, talk), B (back), L/R, Start (menu), Select (cycles the lead merc). Tapping menu rows also works. Keyboard: arrows, Z = A, X = B, Q/W = L/R, Enter = Start.
- Target: iPhone SE, 375 × 667 (the in-app viewer is shorter). Nothing may be cut off; test at 375 × 550 and 320 × 480 before publishing.

**Code**

- **Forked from Black Lantern's file**, never shared with it, so neither game can break the other. Kept: input, shell, dialog box, portraits, the battle engine, and the stat, roll and SAN code. Stripped: cases, agency material, Lantern Boxes and requisition, sound. `window.BL` and `window.BLG` become `window.RL` and `window.RLG`. A fix in one game is copied to the other by hand when it applies. Kept forked after the Claude Code move (Nov 21). window.BLS and window.BLA became window.RLS and window.RLA too; the Shared Shelf script and the dialog box keep their library names.
- **Source in parts:** shell, engine, generator, content data and art. Content batches touch only the data parts, so a new creature can't break combat. A bundle step joins the parts into one self-contained HTML for publishing and backups.
- Outside assets as in Black Lantern: Google Fonts only (Press Start 2P and VT323), all art drawn in code on canvas, no audio.
- Edit the existing parts, never rewrite from scratch. After each change: syntax check, the Process playtest checklist, republish to the same artifact, backup, Changelog line.

**Seeds**

- One run seed per run. Region n's seed comes from the run seed plus n, and the region is generated when the company arrives, so the chain never runs out. The one exception: each region's great creature is picked from that region's seed alone, so it is fixed from run start and a Surprise can show the next region's great creature early (set Nov 21).
- Dice (combat, Luck, SAN, road events) draw from a second stream whose position is saved, so quitting and reopening rerolls nothing. Deaths stick; no reload-scumming.
- The seed shows on the Muster roll and the death screen. A new run can start from a typed seed, for the playtest checklist's 3 seeds and for rematches.

**Saving**

| Key | Holds |
| --- | --- |
| `rl.run` | The current run: seed, dice position, company, purse, region state, contract in progress. A wipe clears it. |
| `rl.ledger` | The bestiary and the ledger. Survives a wipe. |
| `rl.draft` | The company in progress in the creator. |

- One slot, autosave, save on close, deaths stick (carried from Black Lantern). Autosaves on every screen change and every battle round, so any sitting can stop anywhere.
- Keep saves backward compatible. Any change that would break old saves gets flagged first.
- **Save code:** Start → Export copies a text code holding `rl.run` and `rl.ledger`; the title screen → Import pastes it back. Safari clearing its data wipes the save, so export before big updates.

**Asset Library**

Rushlight's own [Asset Library](https://claude.ai/artifact/WYgm7Gn8afLE51Pce94ynt) page holds its finished art and drawing code, and the build reads its art from there; generic pieces come from the standalone [Shared Shelf](https://claude.ai/artifact/Jmv2FBeGHXczqy7juZW8dL) page at the version Rushlight names. Art first drawn during a build is filed in the Asset Library under the Art across games naming before the build uses it, so no art lives only inside a build (set Nov 20). Art code doesn't live in project files (set Nov 20; see Art across games in Art).

**Text Library (set Nov 20).** In-game text (name lists, contract templates, road events, rumors and margin notes, creature ledger entries, item names and info lines, barks and dialog, death screen and Muster roll text) lives in a Rushlight Text Library Sheet, one row per line: ID, pool, text, conditions, state (draft or approved) and where used. The build's content data reads from it; the Bible keeps the rules and examples only, and a creature card names its rows on a Text line. Made Nov 20 as a Sheet: Rushlight Text Library (https://claude.ai/artifact/QNKtwsJvEkAtTDnn4LDSNA), 97 rows, all Draft. IDs are AREA-SUBJECT-KIND-N (CR creatures, VO Voice samples, NM names, QT Quarters scenes, ARC personal arcs, PJ people jobs, TX texture bank, BR recurring things, SY sayings, RT regional tics); {merc} and {species} mark slots the build fills. New lines go into the Sheet first and are marked Approved once you OK them.

**Builds**

The live game is the "Rushlight" HTML artifact. Since Nov 21 the code lives in the private GitHub repo KeeganMcClure/rushlight, a clean copy of Black Lantern's kept parts made with no git history, so no Black Lantern case or story ever loads there. It follows the same protocol as Black Lantern (set Nov 21): Claude Code works in the repo and runs the playtest checks, the repo's CLAUDE.md carries these Tech and Process rules, and the bundle step's one HTML file is published to this same artifact each time, so the link and saves stay. The artifact is made at the vertical slice's first build; its link then goes here and in CLAUDE.md. Dated copies go to the Rushlight backups folder in Google Drive as rushlight-build-YYYY-MM-DD.html, never to project files (set Nov 20; see Process).
