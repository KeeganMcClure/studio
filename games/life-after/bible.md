# Life After bible

This game's build bible. Started 2026-11-21 from Keegan's first-pass answers in the Game Designer project.

- The house rules in `studio-bible/` (controls, art style, UI, saves, launcher) apply to every game and win where this file overlaps them, except where Conflicts with the studio bible (below) says a change is proposed.
- What's been built is in `changelog.md` next to this file. Nothing is built yet.
- Keegan sends changes through the Design Inbox doc; the Designer edits this file through pull requests.
- Reading level: everything written for this game, in chat, in this bible and in the game, sits at an average reading level. Plain words over jargon.
- Life After has no overarching story and no secret story files. Companion arcs are built from parts at run time, and their parts live in this repo like any other game text.

## To do

One item per chat, in order, biggest open decisions first. The Designer ticks the item when its task is done and adds new items where they belong.

- [x] Setup: create this bible (Nov 21).
- [x] Controls: Select opens companion orders (Nov 21). L/R still open.
- [ ] Controls: what L/R step through.
- [ ] The clock: how many in-game minutes a step and each action cost, so a day lands at 10 to 15 minutes of play; how long a season is.
- [ ] The map generator: how big the starting town and its countryside are, what building and area types exist, and how fast places run dry.
- [ ] Needs and SAN numbers: how fast hunger, sleep and SAN drop, what each refills, and what happens at each low point.
- [ ] Combat numbers: hit chances, damage, weapons, noise per action, and how zombies and raiders choose a move.
- [ ] Companions: the trait, skill, fear and want lists; how bond is counted; the order rules; the first set of arc parts; romance.
- [ ] Shelter: what can be built, what it costs, and how a night attack plays out.
- [ ] Crafting and items: the first recipe list and item list, with look-alike brand names.
- [ ] Art direction: base palette, survivor and zombie look, and the first mockups in the shell.
- [ ] Cover: 120 × 80 cover art (`studio-bible/launcher.md`). The Developer adds `game.json` when the game is ready for the shelf.
- [ ] Spec 001: the first playable slice (one generated town, one survivor, day and night, scavenging, zombies, the noise ring), cited against this bible.

### Bugs

None yet.

### Ideas inbox

- Expansions set in other parts of the country or the world: a big city, the coast, another country. Each brings its own map pieces, food and threats.
- Optional romance beyond the first version (see Companions).

## Overview

**Pitch.** Life After is a turn-based zombie survival game for the phone. It's the 1990s in America, and the dead have risen. You play one survivor in a small town and its countryside, scavenging for food, fortifying a shelter, and keeping up to two companions alive and on your side. There's no story to finish and no way to win. You survive as many days as you can, against zombies, raiders, hunger and the dark, and the score is how many days you lasted.

**At a glance**

- Personal use, not for sale.
- Phone-first for an iPhone SE, inside the studio's GBA-style shell (`studio-bible/controls.md`). No sound (`studio-bible/art-style.md`, Fonts and sound).
- Title (set Nov 21, Keegan): Life After. Not tied to one place, so expansions can go anywhere.
- Folder `games/life-after/`. Planned save prefix `la.` (see Tech).

**Design pillars**

1. **True survival.** Food, rest and safety run out. Every trip out is weighed against what it costs.
2. **One life, one world.** Death ends the game. Nothing carries over, so every risk counts.
3. **People are the heart.** You only steer your own survivor. The depth is in who your companions are and how they feel about you.
4. **Grim, with moments of joy.** The world is bleak and played straight. Small moments of warmth (a shared meal, a song, a bond paying off) are what keep you sane.
5. **Every system has a stake.** No mechanics for mechanics' sake.
6. **Short phone sittings.** One in-game day fits one sitting.

**Mature content.** Violence, gore, infection, starvation, cruelty and hard choices about other people are on the table, shown plainly and never lingered on for shock. Romance fades to black (Claude's call, for review). Hard line: nothing sexual involving minors, ever. Children are harmed only off screen or as aftermath.

**Open questions.** See To do.

## Setting

- **When and where** (set Nov 21): 1990s America. The first map is a small town and its countryside. Cities and other regions come later as expansions. The game is not meant to stay rural.
- **Low-tech survival.** No cell phones or internet. Landlines are dead, radios mostly static, cars need fuel and parts.
- **Brands** (set Nov 21): look-alike brands only. Made-up names and logos styled after real 1990s brands (a red cola, a big-box store, a pickup truck maker) so the world feels real without using real trademarks. Real brand names and logos never appear (`studio-bible/studio.md`, One repo, one source of truth).
- **No overarching story.** Nothing explains the outbreak and nothing ends it. The world's history is told only through places, notes and the people you meet.

## The run

- **One life, one world** (set Nov 21). Each game generates a new world. When your survivor dies, the game is over and the save is cleared. There's no carry-over.
- **Goal** (set Nov 21): none. The score is days survived, shown on the death screen. A best-days record may be kept outside the run (open).
- **Seeded** (Claude's call, for review): each world comes from one seed, and dice draw from a second saved stream, so reopening the game rerolls nothing. The seed shows on the death screen, and a new game can start from a typed seed. This matches Rushlight's seed rule (proposed for `studio-bible/`, see below).

## The map

- **Generated each game** (set Nov 21): one town plus its countryside, new every time.
- **Big enough to last** (set Nov 21): the map has to carry a long one-life game through several seasons. First pass: a town center ringed by farms, woods, a highway and one or two smaller spots further out (a truck stop, a trailer park, a campground).
- **Places run dry.** Each building is looted once; food and supplies near your shelter thin out. By the second or third season you must travel further, which costs more time and risk. That keeps a long game moving.
- **Map view** (`studio-bible/art-style.md`): Stardew-style 3/4 top-down, 16 px tiles, building fronts and faces.

## Time and seasons

- **Day and night** (set Nov 21). Time moves when you act: each step or action uses in-game minutes. Days are for scavenging; nights are far more dangerous, with more zombies out and raiders attacking shelters.
- **Day length** (set Nov 21): about 10 to 15 minutes of play, so one day fits one sitting. Exact minutes per action: To do.
- **Seasons** (set Nov 21), each with its own pluses and minuses. First pass (Claude's call, for review):

| Season | Plus | Minus |
| --- | --- | --- |
| Summer | More food to forage | Meat spoils fast; zombies are more active |
| Fall | Harvest; the time to stockpile | Days get shorter |
| Winter | Zombies slow down in the cold | Food is scarce; cold drains health without heat |
| Spring | Mud and rain hide your noise | The thaw wakes more zombies |

## Needs

- **Four needs** (set Nov 21): hunger, health, sleep and SAN. No thirst meter: water counts as food.
- **Hunger:** drops through the day. Eating refills it. Starving drains health.
- **Health:** wounds, infection, cold and starving drain it. Rest and medicine restore it. At zero you die.
- **Sleep:** drops while awake. Low sleep makes you slower and worse at everything. Sleeping is safest inside the shelter, with a companion on watch.
- **SAN** (set Nov 21): a light mechanic, not a big deal. It drifts down with darkness, gore, losing companions and no sleep. Low SAN worsens aim and puts the studio's shared pink `#ff4fa3` and cyan `#3ff0e8` at the screen's edges (`studio-bible/art-style.md`, Color). It never takes control away from you.
- **Joy restores SAN** (set Nov 21): a shared meal, a quiet night on watch together, a companion's arc paying off, a romance scene, finding something that was loved before (a cassette, a photo). People refill what the dark drains, so bonds are part of survival.

## Combat

- **On the map, turn-based** (set Nov 21, after the rough mockup in `mockups/01-combat-compare-rough-v1.png`). There is no separate battle screen. Each step or action is one turn, and zombies, raiders and companions move after you.
- You see what's coming: the tile each nearby zombie will step to next is marked, and the bottom box shows the target, your weapon and your chance to hit before you swing.
- **Zombies** (set Nov 21): slow shamblers, deadly in numbers. They follow noise and sight.
- **Bites** (set Nov 21): a chance of infection. Infection is treatable with rare medicine; untreated, it kills, and the dead come back.
- **Noise** (set Nov 21): the game has no sound, so noise is drawn as a ring on the map. Every action has a noise size (sneaking, swinging, breaking a door, a gunshot, a car). Zombies inside the ring turn toward it. Guns are strong but loud.
- **Other people** (set Nov 21): raiders who attack, and traders you can talk and trade with. People fight on the same turn rules as zombies, but they think, take cover and run.
- **Fleeing:** you can always try to walk away; shamblers are slow, but numbers and dead ends trap you.

## Companions

- **Who you play** (set Nov 21): one survivor you control, plus up to 2 companions (a group of 3 at most).
- **Simple orders** (set Nov 21): companions act on their own, and you steer them with orders from a quick menu opened with Select: Follow, Hold here, Sneak, Fight. Between orders they follow a short list of rules in order, for example: don't step next to 2 or more zombies, stay inside your noise ring, retreat when badly hurt, never shoot while sneaking, hit whatever threatens you first.
- **Deaths stick** (set Nov 21): a dead companion is gone. You can meet new people later.
- **Complex bonds** (set Nov 21). Since you only steer your own survivor, companions carry the depth:
  - **Who they are:** each companion is generated with 2 traits (Brave, Jumpy, Greedy, Kind…), one skill (medic, mechanic, hunter…), one fear and one want.
  - **Bond with you:** grows when you share food, save them, keep a promise or let them rest. Drops when you eat while they starve, leave them behind or ignore their fear.
  - **What bond unlocks:** low bond, they hesitate or refuse risky orders. High bond, they take risky orders, guard you while you sleep, team up on attacks and ask you for small personal favors.
  - **Bonds between companions:** your two companions grow close or clash, which shapes who you can send where.
  - **Low bond has teeth** (set Nov 21): a companion treated badly may walk out, steal supplies, or side with raiders.
  - **Hard choices:** a bitten companion can be treated, locked away to see if they turn, or put down. Traders may offer a deal for one of your people.
- **Personal arcs** (set Nov 21): small generated arcs built from parts (a missing sister, a past they hide), with a few scenes as bond grows.
- **Romance** (set Nov 21): optional. A high bond can turn romantic, with its own scenes and risks.

## Shelter

- **Claim and fortify a building** (set Nov 21): pick a real building on the map, board up doors and windows, and add beds, storage and traps on its tile grid.
- **Attacks at night** (set Nov 21): hordes and raiders can hit the shelter at night. Barricades take damage and need repair, and noise near the shelter draws more.
- You can move to a new shelter when the area runs dry, starting the fortifying over.

## Items and crafting

- **Bag slots** (set Nov 21): a set number of slots on your person (pockets), and bags you find add more (a school backpack, a hiking pack).
- **Crafting** (set Nov 21): simple recipes from scavenged parts. Weapons (a nail bat), barricades and traps, without deep menus.
- **Food** spoils by season (see Time and seasons). Canned food keeps.
- Item names use look-alike brands (see Setting).

## Art

- Follows `studio-bible/art-style.md`: detailed pixel art drawn in code, 16 px tiles, characters about 14 × 26 px, 64 × 64 portraits in the dialog box.
- Base palette, the survivor and zombie look, and each season's colors: To do.
- Mockups live in `mockups/` as design references only; the game never loads them. Each keeps the code that drew it.

| Mockup | What it shows |
| --- | --- |
| `01-combat-compare-rough-v1` | Rough, Nov 21: fighting on the map (picked) beside a separate battle screen (not picked). Placeholder colors. |

## Tech

- Plain HTML canvas on the studio's shared `engine/` (`studio-bible/studio.md`). Shared parts (shell, input, map walking, dialog box) come from there. Anything new that another game could use goes in `engine/` too.
- **Saving** (`studio-bible/saves.md`): one slot, autosave, deaths stick, save version number, export and import code. Planned keys (Claude's call, for review):

| Key | Holds |
| --- | --- |
| `la.run` | The current world: seed, dice position, clock, survivor, companions, shelter, map state. Death clears it. |
| `la.record` | Best days survived. Survives a death. |
| `la.version` | Save version number. |

## Conflicts with the studio bible

Found while drafting (Nov 21). Each needs a decision or a separate `studio-bible/` PR, made after the dev setup's open studio-bible PRs merge.

- **Battle screen** (`studio-bible/ui.md`, Battle screen): describes a head-on battle screen. Life After fights on the map and has none. Proposed: the rule applies to games that have a battle screen.
- **Select** (`studio-bible/controls.md`, Buttons): settled Nov 21 (Keegan). Select opens companion orders (Follow, Hold here, Sneak, Fight), and `controls.md` lets a game with no lead to cycle give Select its own job.
- **Party menu** (`studio-bible/ui.md`, Party menu, added Nov 21 from Black Lantern spec 002): assumes a lead you can swap, with Make lead and Select cycling. Life After keeps one survivor as lead, so it has no Make lead and Select opens orders instead. Open: whether Life After uses the party cards (bond, traits, Give item) without Make lead. To do: Companions.

## Proposed for the studio bible

- **Seeds:** one seed per run, a saved second dice stream, the seed shown at the end and a typed-seed start. Rushlight already uses this rule; Life After would be the second game.
