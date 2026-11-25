# Spec 002: Rushlight moves onto the shared engine

Status: approved and built (status updated Nov 25, 2026; see the bible's To do and the changelog) · Written 2026-11-22 by the Game Designer · Game: Rushlight · To do: Development readiness, Ready 2 of 5

## In plain words

Black Lantern already uses six shared pieces from the studio's `engine/` folder: the battle screen frame, the party menu, dice rolls, night light, patrols and a cursor for things pinned on a board or a map. Rushlight still runs its own older copies that came over in the Nov 21 fork, or doesn't have the piece yet. This spec moves Rushlight onto the shared pieces **before the vertical slice is built**, so the slice isn't built on code that would only be thrown away later.

It adds one new shared piece too: a **seeded dice stream**. Rushlight's rules say a reloaded save rerolls nothing, but the shared dice roll uses plain random numbers. So the shared roll learns to draw from a seeded stream whose position can be saved. Black Lantern keeps plain random numbers and plays exactly as it does today.

Nothing new is playable after this spec. Rushlight still ends at its title screen, the same as now. What changes is the code underneath, plus a test fight and a test party that only the automatic checks open.

## Bible sections this spec relies on

| Source | Section | What it sets |
| --- | --- | --- |
| Studio `CLAUDE.md` | Every task; During setup | Anything two games could use goes in `engine/`; Rushlight's `engine.js` merges into `engine/` part by part |
| `studio-bible/studio.md` | Shared engine and spoiler wall | Shared code in `engine/`; fixing shared code means reading only the code file involved |
| `studio-bible/ui.md` | Party menu; Battle screen | Pokémon-style cards, Make lead, Select cycling, never in battle; head-on battle, party from behind, turn column at one side. "The shared parts live in `engine/`" |
| `studio-bible/saves.md` | Seeds | One seed per run; dice from a second stream whose position is saved, so reopening rerolls nothing |
| `studio-bible/controls.md` | Buttons | Select cycles the lead |
| `games/rushlight/bible.md` | Tech → Code (updated Nov 22) | Rushlight moves onto the rest of the shared parts before the slice; neither game may break the other |
| `games/rushlight/bible.md` | Tech → Seeds | Dice (combat, Luck, SAN, road events) draw from a second stream whose position is saved |
| `games/rushlight/bible.md` | Art → Battle in the GBA shell (rework 1), Battle menu | The battle layout: turn faces down the left, log line on top, countdown under it, nameplate under the enemy, party from behind, one-row party strip, 4-command menu with an info line |
| `games/rushlight/bible.md` | Combat → Basics, Numbers | DEX turn order, the result line (SHOOTING 62% · rolled 41 · HIT), Fight · Skills · Items · Guard, crits and fumbles Delta Green style |
| `games/rushlight/bible.md` | Skills and menus → Map menu | Party row: three merc cards (HP, SAN, WP, status, lead marked); Make lead, Merc card, Give item; Select cycles the lead |
| `games/rushlight/bible.md` | Art → Palette | SAN pink #ff4fa3 and SAN cyan #3ff0e8 for the low-SAN warp; Tallow for light |
| `games/rushlight/bible.md` | Ported rules → Combat, Systems | Danger zones and roamers that guard something carry |

## What is built today

Checked Nov 22 by reading Rushlight's code files and the shared `engine/` files only.

- **Already shared:** the shell, buttons and keyboard, map walking, the 60-ticks-a-second clock, the Shared Shelf script and the dialog box (`engine/shell.js`, `input.js`, `move.js`, `clock.js`, `shelf.js`, `dialog.js`).
- **Battle:** Rushlight's `engine.js` still has the battle from before Black Lantern's Demo 5: an HTML bar of party boxes, enemies spread across the screen, its own menus. It doesn't match Rushlight's approved battle layout. `engine/battle.js` was built from that same layout ("Battle in the GBA shell"), so it's the right frame for Rushlight.
- **Party:** the lead is always the first seat (`lead()` is `party[0]`). There is no party card list and no Select cycling.
- **Rolls:** `engine.js` has its own dice helpers. `engine/roll.js` does percentile rolls, crits, fumbles and the result line, but it draws from `Math.random`, so it can't be saved or replayed.
- **Seeds:** `engine.js` has a seeded random maker (`mulberry`), but nothing saves a stream's position.
- **Night and low SAN:** `engine.js` has its own darkness and glows, and a CSS filter for low SAN. `engine/light.js` does both (night pools and the low-SAN "sour" look in each game's own colours).
- **Patrols and the board cursor:** Rushlight has no roamers, notice board or region map yet.

## What to build

### 1. Seeded dice (new shared piece, both games)

1. A shared seeded stream in `engine/`: made from a seed number, it gives the next random number each time, and can report and restore its position so a save can hold it. Rushlight's `mulberry` can be the start of it. Several streams can run side by side (the bible's run seed, region seeds and dice stream are separate).
2. `engine/roll.js` can be told which stream to draw from. When nothing is set, it uses `Math.random` exactly as now, so **Black Lantern changes nothing**.
3. Rushlight points the shared roll at its dice stream. Wiring the stream into the run save is spec Part A's job (the `rl.run` key doesn't exist yet). For now the stream lives in memory with a fixed test seed, so the checks can prove that the same seed gives the same rolls.

### 2. Rolls (`engine/roll.js`)

Rushlight's fights, Luck rolls and the result line use `StudioRoll`, with Rushlight's own words (SHOOTING, MELEE and the rest of its skill names; HIT, MISS, CRIT, FUMBLE). Rushlight's rules sit on top in game code: the Fight floor of 30%, the STR bonus, double damage on a crit, a fumble as a miss with a bad-luck line.

### 3. Battle frame (`engine/battle.js`)

Rushlight's battle screen uses the shared frame: the layout, turn column, HP bars, the one-row command box (Fight · Skills · Items · Guard) with its detail line, list boxes over the scene, the result line and the cursor. Rushlight passes its own theme from the Palette (Peat, Soot, Bone, Tallow, Ash, Rust) and draws its own extras on top, where the approved mockup puts them:

- the one-line log across the top, and the fight's countdown under it when a fight has one (the Noonwife's noon bell);
- the enemy nameplate under its sprite: name, level, threat skulls, and an HP bar hatched and marked ??? until Identified;
- a blank face in the turn column for a creature whose rule break is having no face (the frame already takes an empty face).

The old battle in `engine.js` goes once the new one works. A test fight proves it: the test party against one stand-in enemy, opened only by the checks. The Asset Library's battle mockup code can be the stand-in art, and the enemy's numbers are a placeholder, not the Noonwife's real card (the real fights come with spec Part D).

### 4. Party (`engine/party.js`)

1. Rushlight keeps a lead index instead of "the first seat leads". Select cycles the lead on the map in seat order, never in battle, dialog or cutscenes, with the short banner naming the new lead. The new lead takes the old lead's tile and facing.
2. Start → Party shows the shared card list: three merc cards in seat order (HP, SAN, WP, status, lead marked), each opening Make lead, Merc card and Give item. The Merc card and Give item can be placeholders until spec Part A makes real mercs; say which ones are in the changelog.
3. A Downed or dead merc can't lead (`canLead`).

### 5. Night and low SAN (`engine/light.js`)

Rushlight's darkness, glows and low-SAN effect move onto `StudioLight`, in Rushlight's colours: the dark from the Palette's Peat and Dusk end, Tallow light from the rushlight and lamps, and the sour look toward SAN pink and SAN cyan. The thresholds stay as Rushlight's code has them today. The look gets tuned in the slice, not here.

### 6. Patrols and the board cursor (rule only, no build now)

`engine/patrol.js` and `engine/nearest.js` have nothing to replace in Rushlight yet. Write in Rushlight's `src/CLAUDE.md` that roamers on site maps use `StudioPatrol` and that the notice board and region map cursors use `StudioNearest`, so slice parts B to D use them from the start.

### Wiring

- `index.html` loads the shared files in the same order Black Lantern does, plus the new seeded stream before `roll.js`.
- Update the parts list in `src/CLAUDE.md`, and the "Still Black Lantern's" list (the battle and the party code are no longer Black Lantern's).
- Any change under `engine/` runs `npm run check` in both games.

## Done when

- `npm run check` passes in Rushlight **and** Black Lantern at 320 × 480, 375 × 550 and 375 × 667.
- Black Lantern plays exactly as before. Its rolls still come from `Math.random`, and its checks are unchanged.
- In Rushlight's checks: the test fight opens, every command in the box works by D-pad and by tap, and the fight ends. Select cycles the lead on a test map and does nothing in the test fight. The party card list opens from Start.
- Two runs of the same test seed give the same 100 dice rolls. A stream saved after 50 rolls and restored gives the same next 50.
- Rushlight's old battle, party, dice and darkness code is gone from `engine.js`.
- Rushlight's `changelog.md` has a dated entry listing what moved and any placeholders left. Black Lantern's `changelog.md` notes the shared roll change ("no change in play").

## Not in this spec

- Saving the dice stream in a run, and the `rl.run`, `rl.ledger` and `rl.draft` keys (spec Part A).
- Rushlight's real combat rules beyond the roll: era weapons and two weapon slots, armor, Identify, Downed and bleeding out, snapping at 0 SAN, Flee for roamers only (spec Part D).
- Real mercs, species sprites and portraits (Ready 3 of 5 and spec Part A).
- The region map, the notice board, site maps and roamers (spec Parts B to D).
- Any change to how Black Lantern looks or plays.

## Conflicts found

None. Rushlight's approved battle mockup is where the shared battle frame came from, and `ui.md`'s Party menu section already names Rushlight's Map menu as the same screen.

## Proposed for studio-bible/

None. `saves.md` → Seeds already holds the dice-stream rule for every game that generates its world, and this spec only builds it.

## Open questions for the Developer to bring back (don't decide them in code)

- If the shared battle frame can't hold something in Rushlight's mockup without changing Black Lantern's screen, stop and say what it is. Don't change the frame's look for Black Lantern.
