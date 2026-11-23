# Spec 001: Slice part A, a new world

Status: draft for Keegan's review · Written 2026-11-23 by the Game Designer · Game: Life After · To do: Spec 001, Part A

## In plain words

Life After's first playable slice is **survive a week alone**: a small generated town (the houses and highway strip sections), the survivor builder with all 12 jobs, scavenging, hunger and sleep, fights on the map with the noise ring, day and night, one hideout and the death screen. There are no companions and no other people yet.

The slice is split into four parts so each one can be built, played and checked on its own:

| Part | Spec | What it adds |
| --- | --- | --- |
| A | this file | The game folder, the title screen, setting up a new world, the survivor builder, saves and the save code |
| B | `002-slice-b-the-town.md` | The generated town, the clock, day and night, searching, locks, the bag, items, crafting, the notebook and the map screen |
| C | `003-slice-c-survival-and-fights.md` | Needs, SAN, wounds, infection, zombies, fights on the map, the noise ring, sight and sneaking |
| D | `004-slice-d-hideout-and-death.md` | Claiming a hideout, builds, sleep, night attacks, the death screen and best runs |

This part builds everything from the title screen to the moment your survivor wakes up. When it's done you can start a world, build or pick a survivor, see them standing in a stand-in room, look at their party card, close the game, reopen it and find the same survivor. Nothing else happens yet. Part B replaces the stand-in room with the real town.

## Bible sections this spec relies on

| Source | Section | What it sets |
| --- | --- | --- |
| `studio-bible/studio.md` | (whole file) | The repo layout, the Developer owns `src/`, `engine/` and builds; shared parts go in `engine/` |
| `studio-bible/controls.md` | Shell; Buttons; Keyboard; Target screen | GBA shell, the buttons, the test keys, iPhone SE first |
| `studio-bible/saves.md` | Saves; Seeds | One slot, autosave, version number with upgrade steps, test saves, save code; one seed, a saved dice stream, a typed seed |
| `studio-bible/ui.md` | Party menu | The party card (one fixed lead, no Make lead) |
| `studio-bible/art-style.md` | Craft; Fonts and sound | 16 px tiles, about 14 × 26 px characters, 64 × 64 portraits; no sound |
| `bible.md` | Overview; Setting | Pitch, pillars, mature content line, 1990s America, look-alike brands, Midwest farm county start |
| `bible.md` | The run | One life, the death screen, seeded worlds, difficulty presets (picked once, no Custom) |
| `bible.md` | Time and seasons | Starting season picked or random |
| `bible.md` | Your survivor | Build or pick, 12 jobs, traits on points, looks from parts, templates, a want |
| `survivor.md` | (whole file) | Skills, abilities, the 12 jobs, traits, wants, looks parts, templates |
| `bible.md` | Controls and screens | Buttons, Party menu |
| `bible.md` | Art | The baseline frame, portraits with moods |
| `bible.md` | Tech | Shared `engine/`, save keys `la.run`, `la.record`, `la.version` |

## What is built today

Nothing. `games/life-after/` holds only the bible, its parts, `changelog.md`, `mockups/` and `specs/`. The shared `engine/` already has the parts this game needs to start: the shell (`shell.css`, `shell.js`), input (`input.js`), the 60-tick clock (`clock.js`), grid walking and the camera (`move.js`), seeded streams (`seed.js`), night light pools (`light.js`), menu width (`menu.js`) and party cards (`party.js`).

## What to build

### 1. The game folder

- `games/life-after/src/` set up the same way as the other games: an `index.html` in the shell, the game's own files, a `package.json` with `npm run build` (one `dist/index.html`) and `npm run check`.
- `npm run check` runs the studio's usual checks at 320 × 480, 375 × 550 and 375 × 667: loads, no errors, every button on screen and working, 600 random presses, a reload with saves, and new worlds from 3 fixed seeds.
- Life After's shell look: the studio shell with its own colors and the brand text LIFE AFTER. Colors come from the baseline frame (`mockups/02-baseline-san-rough-v2.html`, the `NIGHT` and `DAY` color sets). The Developer picks the bezel color from those; muted teal or ochre fits.
- No `game.json` yet. That comes with the Cover To do.

### 2. Title screen

- The title LIFE AFTER over a still night street drawn in code (a dead streetlight, a car, a neon motel sign flickering). It's a mood piece, not a menu screen.
- Rows: **New world**, **Continue** (only when `la.run` exists), **Best runs**, **Import save**.
- Continue drops you back exactly where you were.
- Best runs shows the best-runs list for each preset (Part D fills it; until then it says "No runs yet.").

### 3. Setting up a new world

One screen of rows, then the builder. L and R step between this screen and the builder steps.

| Row | Choices | Default |
| --- | --- | --- |
| Difficulty | Gentle, Standard, Harsh, each with a one-line note | Standard |
| Starting season | Spring, Summer, Fall, Winter, Random | Random |
| Seed | Random, or type one | Random |

- **Difficulty notes:** Gentle "More food, softer bites, fewer surprises." Standard "The world as it is." Harsh "Less of everything, and the dead hit hard."
- The preset is locked once the world starts (`bible.md`, Difficulty presets: picked once). It's saved in the run and shown on the party card and the death screen.
- **Seed:** a whole number. Typing uses the phone keyboard; the shell's keys are ignored while the field has focus, as in the other games.

### 4. The survivor builder

Steps, in order. L and R move between steps, A picks, B goes back a step. Every step has a Random row.

1. **Start from:** one of the 12 templates (`survivor.md`, Templates) or **Blank**. A template fills every step below; you can change any of it.
2. **Name:** type a first name, or Random from a list of about 60 1990s American first names.
3. **Job:** the 12 jobs (`survivor.md`, The 12 jobs). Each row shows the skills it gives, the starting items and the extra.
4. **Free points:** 3 points to put in any skills. No skill can start above 3, except that an older survivor's job skill can start at 4 (see Looks).
5. **Traits:** the good list and the bad list, with each trait's cost. The step shows "Good points X of Y" and won't let you go on if good points are more than bad points, if you have more than 3 good traits, or if you picked two opposites.
6. **Want:** the 12 wants, or Random. In this slice the want only shows on the party card and the death screen. Rumors that tie to it come later.
7. **Looks:** body type (3), skin tone (6), face (6), hair style (8) and color (6), outfit color set (4, the job sets the outfit), age range (3). The map sprite and the 64 × 64 portrait update as you change each one. Older: +1 in the job's main skill (it can reach 4), and the sleep bar drops 10% faster (`survivor.md`, Looks parts).
8. **Ready:** the party card for your survivor, the world's preset, season and seed, and **Start**. Start asks once ("Start this world? You only get one life.") and then begins.

### 5. What a survivor holds

| Field | What it is |
| --- | --- |
| name | First name |
| job | One of the 12 |
| skills | 8 skills, 0 to 5, plus a use count for each toward the next level (Part C uses it) |
| traits | Good and bad trait ids |
| want | One want id |
| looks | Body, skin, face, hair style, hair color, color set, age |
| needs | Hunger, health, sleep, SAN, each 0 to 100. Start: hunger 70, health 100, sleep 80, SAN 70 |
| wounds | A list (Part C) |
| bag | Pockets plus a worn bag (Part B). Start: the job's items |
| recipes | Known recipe ids. Start: the job's recipes (Part B lists them) |
| notes | Notebook lines seen (Part B) |

Trait effects that this slice can't use yet (Kind, Greedy, Hothead, Stubborn's advice line, Green Thumb) are stored and shown but do nothing until people and gardens exist. The job extras are the same: the cop's surrender bonus waits for people.

### 6. The party card

Start → Party shows one card from `engine/party.js`, as `studio-bible/ui.md` sets it for a game with one fixed lead: no Make lead, no Select cycling.

- The card: portrait, name, job, the four need bars, wounds, traits, and the want.
- A opens a detail page: all 8 skills with their level, any abilities unlocked, and the world's preset, season and seed.
- Give item isn't shown; there's nobody to give to.

### 7. The stand-in room

Until Part B, Start drops your survivor into one small room (a bedroom, a closed door, a window) where they can walk, open the party card and the Start menu, and nothing else. A note appears: "Weeks since it started. It's quiet out there." Part B removes the room.

### 8. Saves

- **Keys:** `la.run` (the world, created at Start, cleared at death), `la.record` (best runs, which survive a death), `la.version` (starts at 1).
- **`la.run` holds** the world seed, the dice stream's position, the preset, the starting season, the clock, the survivor and, from Part B on, the map state. Each later part adds its own fields with a new upgrade step.
- **Autosave** after every action that changes the run, and on leaving the page. No save slots, no reloading a past moment.
- **The seed** makes the world (Part B). Dice draw from a second stream made from the seed, using `engine/seed.js`, and its position is saved, so closing and reopening rerolls nothing.
- **Test saves:** a `test-saves/` folder in `src/` starts with one saved run from this part. `npm run check` opens every file in it.

### 9. The save code

Start → Save code: **Export** (shows a text code to copy, with a Copy button) and **Import** (paste a code, then confirm "This replaces your current world."). The title screen's Import save does the same. A bad code says "That code didn't work." and changes nothing.

### Wiring

- The Start menu in this part: **Party**, **Save code**, **Quit to title**. Parts B to D add rows.
- Select on the map shows a one-line note, "No one's with you.", until companions exist.
- L and R on the map do nothing until Part B adds the bag and map screens.

## Done when

- A new world starts from each of the 12 templates and from Blank, with every builder rule enforced.
- The same typed seed and choices make the same survivor and world settings.
- Close and reopen at any step after Start: you're back in the same place with the same survivor.
- Export a code, start a different world, import the code: the first world is back.
- `npm run check` passes at all three sizes.

## Not in this spec

- The town, the clock, items and everything in Parts B to D.
- Companions, other people, rumors, weather, cars.
- The cover and `game.json`.

## Conflicts found

None.

## Open questions for the Developer to bring back (don't decide them in code)

- If the builder doesn't fit at 320 × 480 with every row visible, bring back a screenshot rather than cutting rows.
