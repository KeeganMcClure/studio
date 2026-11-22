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
- [ ] Your survivor: each job's skills and starting items, each trait's effect, the looks parts, the 8 templates, and how fast skills grow with use.
- [ ] Companions: the skill, fear and want lists; how bond is counted (hidden); the order rules; the short-job odds; the first set of arc parts and evening scenes.
- [ ] Shelter: what can be built, what it costs, and how a night attack plays out.
- [ ] Crafting and items: the first recipe list and item list, with look-alike brand names.
- [x] Art direction: settled Nov 21 (see Art). Exact palette hex codes come with the first in-shell mockup.
- [ ] Studio bible: an `art-style.md` PR letting a game set its own low SAN signal (Life After uses phantoms and SAN grit, not the pink and cyan edges). See Conflicts.
- [ ] Other survivors and trade: group types, starting moods, what they remember, and barter values.
- [ ] Weather and events: the first list, how often each comes, and how sure the warnings are.
- [ ] Difficulty presets: what Gentle, Standard and Harsh change, in numbers.
- [ ] Cover: 120 × 80 cover art (`studio-bible/launcher.md`). The Developer adds `game.json` when the game is ready for the shelf.
- [ ] Spec 001: the first playable slice, cited against this bible. Set Nov 21: survive a week alone. A small generated town, the survivor builder with all 8 jobs, scavenging, hunger and sleep, map combat with the noise ring, day and night, one hideout and the death screen. No companions yet.

### Bugs

None yet.

### Ideas inbox

- Expansions set in other parts of the country or the world: a big city, the coast, another country. Each brings its own map pieces, food and threats.
- Boats, for a map with lakes or a coast (Keegan, Nov 21).
- More jobs after the first 8.

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
- **How a game opens** (set Nov 21): weeks after the outbreak. It's already over. You wake with a few items and go straight into play.
- **Difficulty** (set Nov 21): a few world presets picked at a new game (for example Gentle, Standard, Harsh). They change loot, zombie numbers and how fast the world runs down. The preset shows on the death screen. Numbers: To do.
- **Learning** (set Nov 21): no tutorial. The first time something comes up (hunger, noise, the first night), your survivor jots a short note you can reread later.
- **Death screen** (set Nov 21): a short life story. Days survived, how you died, and the run's big moments (who joined, who you lost, falling for a companion, moving hideout), plus the seed and the preset.
- **Seeded** (Claude's call, for review): each world comes from one seed, and dice draw from a second saved stream, so reopening the game rerolls nothing. The seed shows on the death screen, and a new game can start from a typed seed. Follows `studio-bible/saves.md`, Seeds.

## Your survivor

- **You start alone** (set Nov 21). Companions join later, and they're generated by the world.
- **Build or pick** (set Nov 21): make your survivor in a free build, or start from a template.
  - **Past job:** sets your starting skills and a few items. The first 8 (all in the first slice): nurse, mechanic, farmer, cop, teacher, trucker, line cook, high school athlete.
  - **Four traits:** one good and one bad plain-life trait, plus one good and one bad personality trait. Plain-life traits each have one clear effect (good: Light Sleeper, Strong Back, Steady Hands, Iron Gut; bad: Smoker, Bad Knee, Nearsighted, Hothead). Personality traits shift SAN and how people react to you (good: Brave, Calm, Kind; bad: Jumpy, Greedy, Stubborn). Companions use the same lists. Effects: To do.
  - **Looks from parts:** body type, skin tone, face, hair style and color, clothes colors and age range (young adult to older). They show on the map sprite and the portrait, built from the same parts as companions and zombies.
  - **Templates:** one ready-made survivor per job, with a name (for example Rita, the night-shift nurse), traits and looks already picked. You can change any of it.
- **Getting better** (set Nov 21): skills grow with use. There's no XP screen.

## The map

- **Generated each game** (set Nov 21): one town plus its countryside, new every time.
- **Big enough to last** (set Nov 21): the map has to carry a long one-life game through several seasons. First pass: a town center ringed by farms, woods, a highway and one or two smaller spots further out (a truck stop, a trailer park, a campground).
- **The world runs down** (set Nov 21). Each building is looted once; food and supplies near your shelter thin out. Food spoils, the power fails and raiders grow bolder. By the second or third season you must travel further and craft more, which costs time and risk, and you may have to move hideouts. That keeps a long game moving.
- **Vehicles** (set Nov 21): cars are rare and costly. Most are dead; one that runs needs gas, a battery and repairs. It carries a lot fast but is loud. Bikes and skateboards are quieter ways to get around.
- **Weather and events** (set Nov 21): grounded. Storms, fog, heat waves, blizzards, a horde passing through, a raider push. A working radio (with batteries) warns you a day ahead; without one you read the sky, which is less sure. First list: To do.
- **Map view** (`studio-bible/art-style.md`): Stardew-style 3/4 top-down, 16 px tiles, building fronts and faces.

## Time and seasons

- **Day and night** (set Nov 21). Time moves when you act: each step or action uses in-game minutes. Days are for scavenging; nights are far more dangerous, with more zombies out and raiders attacking shelters.
- **Night is your choice** (set Nov 21): hole up (sleep, craft, talk, defend) or go out. Going out is how you get what people guard: raiders and survivors watch the best places by day and sleep at night, so you can sneak in. The cost: zombies are hard to see, sound carries farther (a bigger noise ring), your flashlight draws zombies and uses batteries, and getting caught makes enemies of that group.
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
- **SAN** (set Nov 21): a light mechanic, not a big deal. It drifts down with darkness, gore, losing companions and no sleep. Low SAN worsens aim and shows as phantoms and grit, not the studio's pink and cyan edges (see Art, and Conflicts). It never takes control away from you.
- **Joy restores SAN** (set Nov 21): a shared meal, a quiet night on watch together, a companion's arc paying off, a romance scene, finding something that was loved before (a cassette, a photo). People refill what the dark drains, so bonds are part of survival.

## Combat

- **On the map, turn-based** (set Nov 21, after the rough mockup in `mockups/01-combat-compare-rough-v1.png`). There is no separate battle screen. Each step or action is one turn, and zombies, raiders and companions move after you.
- You see what's coming: the tile each nearby zombie will step to next is marked, and the bottom box shows the target, your weapon and your chance to hit before you swing.
- **Zombies** (set Nov 21): slow shamblers, deadly in numbers. They follow noise and sight.
- **Bites** (set Nov 21): a chance of infection. Infection is treatable with rare medicine; untreated, it kills, and the dead come back.
- **Noise** (set Nov 21): the game has no sound, so noise is drawn as a ring on the map. Every action has a noise size (sneaking, swinging, breaking a door, a gunshot, a car). Zombies inside the ring turn toward it. Guns are strong but loud.
- **Other people** (set Nov 21): raiders who attack, and traders you can talk and trade with. People fight on the same turn rules as zombies, but they think, take cover and run.
- **Fleeing:** you can always try to walk away; shamblers are slow, but numbers and dead ends trap you.
- **Weapons** (set Nov 21): bats, pipes and axes wear down and can be fixed or crafted. Guns hold up, but bullets are scarce, so every shot is a choice.
- **Wounds** (set Nov 21): hits lower health, and a large hit has a chance of leaving a wound (a deep cut, a sprained ankle, a broken arm) that slows or weakens you until it's treated and heals over days.
- **Sneaking** (set Nov 21): zombies and people see in a cone shown on the map. Stay out of it and keep your noise ring small to slip past, or kill quietly from behind with a melee weapon.
- **Stealth bonus** (Keegan asked; Claude's call, for review): hitting anyone who hasn't seen you is easier and does more damage. A melee hit from behind on an unaware zombie is a sure, quiet kill. An unaware person takes a heavy hit and is often wounded. Guns get the aim bonus but are still loud.
- **Fights with people** (set Nov 21): people can surrender, run or be talked down mid-fight, and you choose to spare, rob or kill them. Killing a person weighs on SAN, and their group remembers it.

## Companions

- **Who you play** (set Nov 21): one survivor you control, plus up to 2 companions (a group of 3 at most).
- **Simple orders** (set Nov 21): companions act on their own, and you steer them with orders from a quick menu opened with Select: Follow, Hold here, Sneak, Fight. Between orders they follow a short list of rules in order, for example: don't step next to 2 or more zombies, stay inside your noise ring, retreat when badly hurt, never shoot while sneaking, hit whatever threatens you first.
- **Deaths stick** (set Nov 21): a dead companion is gone. You can meet new people later.
- **Complex bonds** (set Nov 21). Since you only steer your own survivor, companions carry the depth:
  - **Meeting them** (set Nov 21): you find people in the world, hiding, trapped or on the road. You help them, trade or talk, and they ask to join only once they trust you.
  - **Who they are:** each companion is generated with the same four traits as your survivor (see Your survivor), one skill (medic, mechanic, hunter…), one fear and one want.
  - **Reading them** (set Nov 21): there's no bond meter. Their portrait mood, what they say and how they take orders tell you how they feel. The Party menu shows only a rough word (Wary, Easy, Close).
  - **Evening talks** (set Nov 21): each evening at the hideout, pick one person to talk with, share food with, or do something small with (cards, fixing a radio). Short scenes with choices.
  - **Bond with you:** grows when you share food, save them, keep a promise or let them rest. Drops when you eat while they starve, leave them behind or ignore their fear.
  - **What bond unlocks:** low bond, they hesitate or refuse risky orders. High bond, they take risky orders, guard you while you sleep, team up on attacks and ask you for small personal favors.
  - **Short jobs** (set Nov 21): send a companion out alone to scavenge, hunt or scout while you do something else. You see their chance of success first. They come back with loot and a story, hurt, or not at all.
  - **Bonds between companions:** your two companions grow close or clash, which shapes who you can send where.
  - **Low bond has teeth** (set Nov 21): a companion treated badly may walk out, steal supplies, or side with raiders.
  - **Hard choices:** a bitten companion can be treated, locked away to see if they turn, or put down. Traders may offer a deal for one of your people.
- **Personal arcs** (set Nov 21): small generated arcs built from parts (a missing sister, a past they hide), with a few scenes as bond grows.
- **Romance** (set Nov 21): optional, a slow build over evening talks with an adult companion. Each companion has their own attraction (to men, to women, both, or not interested), so not everyone is open to you, and some are put off by flirting, which lowers bond. It fades to black, lifts SAN, and makes losing them hit much harder.

## Other survivors and trade

- **Mixed, and they remember you** (set Nov 21): loners, families, traders and raider gangs. Each group starts friendlier or more hostile, then shifts with how you treat it: help, trade, theft, a spared life or a killing.
- **Trade** (set Nov 21): barter, no money. Values shift with need, the season and how much a group trusts you. Medicine is worth the most.

## Shelter

- **Claim and fortify a building** (set Nov 21): pick a real building on the map, board up doors and windows, and add beds, storage and traps on its tile grid.
- **What you build** (set Nov 21): defenses (boards, traps, a lookout, a rain barrel) plus a few comforts (a real bed, a stove, a radio corner) that help sleep, food and SAN.
- **What brings attacks** (set Nov 21): your choices. Noise, light, cooking smoke and how long you stay raise the odds, and raiders come if they know where you live. Quiet nights are common.
- **You play attacks out** (set Nov 21): you're woken, then fight turn by turn inside your building: hold doors, fix boards, place companions. If you're away, it's worked out from your defenses. Barricades take damage and need repair.
- **Attacks must never be a chore** (Keegan, Nov 21): short (a few minutes), each with a twist (a weak board gives way, a companion panics, raiders shout a deal through the door), with real choices beyond swinging (fall back a room, light a fire trap, slip out the back). A small attack your defenses clearly win is settled in one line.
- **Moving** (set Nov 21): when the area runs dry, you can move. You take only what you can carry: your bags, your companions' bags and a working car. Builds stay behind, but some can be stripped for parts.

## Items and crafting

- **Bag slots** (set Nov 21): a set number of slots on your person (pockets), and bags you find add more (a school backpack, a hiking pack).
- **Crafting** (set Nov 21): simple recipes from scavenged parts. Weapons (a nail bat), barricades and traps, without deep menus.
- **Searching** (set Nov 21): each room has spots to search (a fridge, a closet, a car trunk). Searching takes in-game minutes and makes a little noise, and what's there fits the place. Traits, skills and items make it quicker or quieter (a crowbar, a flashlight, Steady Hands).
- **Locks** (set Nov 21): find the key, pick it (slow, quiet, needs a skill or tools), or force it (fast, loud, can break the lock or your tool). The best loot is often behind one.
- **Food** spoils by season (see Time and seasons). Canned food keeps. Once the stores run dry (set Nov 21): grow a garden at the hideout (seasons matter), hunt, fish and forage, or take it from other survivors.
- **Medicine** (set Nov 21): scarce, and skill matters. Bandages, painkillers, antibiotics and splints are rare; a nurse or medic uses them better, and expired pills may not work. The infection cure is the rarest of all. Natural medicine (Keegan, Nov 21): with the know-how (a skill, a job like farmer, or a found field guide), forage plants and make remedies (willow bark for pain, yarrow for bleeding). Weaker than real medicine.
- Item names use look-alike brands (see Setting).

## Art

- Follows `studio-bible/art-style.md`: detailed pixel art drawn in code, 16 px tiles, characters about 14 × 26 px, 64 × 64 portraits in the dialog box.
- **Look** (set Nov 21, Keegan's pick): the Low SAN: Phantoms panel of `mockups/02-baseline-san-rough-v2` is the baseline frame. A stark layout with hard shadows, in muted ochre and teal, with neon signs.
- **Mood reference:** Disco Elysium, for color and mood only. Never its art, characters or look.
- **Neon:** old signs (motel, gas station) still glow at night, dead and faded by day.
- **Usable things glow cyan:** doors, loot and cars you can use.
- **No grit at normal SAN:** no grain, noise, scanlines or brush texture while SAN is above 50.
- **Low SAN** (set Nov 21): shown as phantoms, not the studio's pink and cyan edges. Figures that aren't there stand in the shadows, fake noise rings appear, and your survivor's lines turn uneasy ("Something moved by the pump."). Grit starts very light at 50 SAN and grows as SAN drops. Even at the lowest SAN, text, the HUD, enemies and usable things are never hidden.
- **Night:** dark like the baseline frame, dim but readable. Flashlight, fire and neon are the bright spots, so batteries matter.
- **Gore:** grounded for people (blood, wounds and bodies shown plainly at pixel size, never lingered on), gorier on zombies (rot, exposed bone, torn flesh, missing parts).
- **Zombies show who they were:** built from parts (a mail carrier, a nurse, a farmer, a kid in a team jersey) with the gore on top. Their clothes hint at their loot.
- **Portraits with moods:** 64 × 64 faces for your survivor, companions and traders that change with mood, SAN and injuries.
- Exact palette hex codes and each season's colors come with the first in-shell mockup.
- Mockups live in `mockups/` as design references only; the game never loads them. Each keeps the code that drew it.

| Mockup | What it shows |
| --- | --- |
| `01-combat-compare-rough-v1` | Rough, Nov 21: fighting on the map (picked) beside a separate battle screen (not picked). Placeholder colors. |
| `02-baseline-san-rough-v2` | Rough, Nov 21: the same night at normal SAN, a color-drain option (not picked) and phantoms (picked). The phantoms panel is the baseline frame. |

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

- **Battle screen** (`studio-bible/ui.md`, Battle screen): describes a head-on battle screen. Life After fights on the map and has none. Settled Nov 21: the section now applies only to games that have a battle screen.
- **Select** (`studio-bible/controls.md`, Buttons): settled Nov 21 (Keegan). Select opens companion orders (Follow, Hold here, Sneak, Fight), and `controls.md` lets a game with no lead to cycle give Select its own job.
- **Low SAN signal** (`studio-bible/art-style.md`, Color): makes pink `#ff4fa3` and cyan `#3ff0e8` the shared low-SAN mark. Life After shows SAN with phantoms and grit, and uses cyan for usable things. Open: a separate `art-style.md` PR letting a game set its own SAN signal. To do.
- **Party menu** (`studio-bible/ui.md`, Party menu, added Nov 21 from Black Lantern spec 002): assumes a lead you can swap, with Make lead and Select cycling. Life After keeps one survivor as lead, so it has no Make lead and Select opens orders instead. Open: whether Life After uses the party cards (bond, traits, Give item) without Make lead. To do: Companions.

