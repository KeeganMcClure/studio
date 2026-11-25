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
- [x] Controls: Select opens companion orders, L opens the bag, R opens the map (Nov 21). See Controls and screens.
- [x] Studio bible: `controls.md` lets a game give L/R their own jobs, and `ui.md` lets a game with one fixed lead leave out Make lead (Nov 21).
- [x] The clock: how many in-game minutes a step and each action cost, so a day lands at 10 to 15 minutes of play (Nov 21). See Time and seasons, The clock.
- [x] The map generator: how big the starting town and its countryside are, what building and area types exist, and how fast places run dry (Nov 21). See The map, Generator.
- [x] Needs and SAN numbers: how fast hunger, sleep and SAN drop, what each refills, and what happens at each low point (Nov 21). See Needs, The numbers.
- [x] Combat numbers: hit chances, damage, weapons, noise per action, and how zombies and raiders choose a move (Nov 21). See Combat, The numbers. Each weapon's exact damage and wear go in spec 001.
- [x] Your survivor: each job's skills and starting items, each trait's effect, the want list, the looks parts, the 8 templates, and how fast skills grow with use (Nov 21). See `survivor.md`: 12 jobs and 12 templates now.
- [x] Rumors and late threats: the first rumor list, how the raider leader forms, and horde timing (Nov 21). See The map, Rumors and late threats.
- [x] Companions: the skill, fear and want lists; how bond is counted (hidden); the order rules; the short-job odds; the first set of arc parts and evening scenes (Nov 23). See `companions.md`.
- [x] Shelter: what can be built, what it costs, and how a night attack plays out (Nov 23). See `shelter.md`.
- [x] Crafting and items: the first recipe list and item list, with look-alike brand names (Nov 21). See `items.md`.
- [x] Art direction: settled Nov 21 (see Art). Exact palette hex codes come with the first in-shell mockup.
- [x] Studio bible: `art-style.md` lets a game set its own low SAN signal (Nov 21).
- [x] Other survivors and trade: group types, starting moods, what they remember, and barter values (Nov 23). See `survivors.md`.
- [x] Weather and events: the first list, how often each comes, and how sure the warnings are (Nov 23). See `weather.md`.
- [x] Difficulty presets: what Gentle, Standard and Harsh change, in numbers (Nov 23). See The run, Difficulty presets.
- [x] Cover: 120 × 80 cover art (`studio-bible/launcher.md`). The Developer adds `game.json` when the game is ready for the shelf. Design picked Nov 22: Boarded window (see Art, Cover). Left to build: `assets/cover.js` drawn from `mockups/03-cover-b-rough-v2.html`.
  Done Nov 24: `assets/cover.js` draws the Boarded window cover, and `game.json` puts Life After on the Dev shelf.
- [x] Spec 001: the first playable slice, cited against this bible. Set Nov 21: survive a week alone. A small generated town (the houses and highway strip sections), the survivor builder with all 12 jobs, scavenging, hunger and sleep, map combat with the noise ring, day and night, one hideout and the death screen. No companions yet. Written Nov 23 in four parts, `specs/001` to `004`.
- [x ] Look check before the build (studio rules from Rushlight's look lessons, Nov 23): Keegan approves the street by day and night (`mockups/04-look-street-rough-v2`), the survivor builder (`05-look-builder-rough-v2`) and the sprite reference (`06-sprite-reference-rough-v3`). Together they set the palette hex codes, the top bar card, the menu surface and the sprite bar (see Art, Look bar). Build part A starts after this is ticked.
  Done Nov 23: Keegan approved the v2 mockups by merging studio PR #170. The palette, top bar card, cardboard menu surface and sprite reference are set; build part A can start.
- [x] Build slice part A, a new world: the game folder, title, world setup, the survivor builder, saves and the save code (`specs/001-slice-a-new-world.md`).
  Done Nov 24: the title, New world, the 8-step survivor builder, the party card, the stand-in room, saves and the save code are built and on the Dev shelf.
- [ ] Build slice part B, the town: the two sections, the clock, day and night, searching, locks, the bag, items, crafting, the notebook and the map screen (`specs/002-slice-b-the-town.md`).
- [ ] Build slice part C, survival and fights: needs, SAN, wounds, infection, zombies, fights, noise, sight and sneaking (`specs/003-slice-c-survival-and-fights.md`).
- [ ] Build slice part D, the hideout and the end: claiming, builds, sleep, night attacks, the death screen and best runs (`specs/004-slice-d-hideout-and-death.md`).

### Bugs

None yet.

### Ideas inbox

- Expansions set in other parts of the country or the world: a big city, the coast, another country. Each brings its own map pieces, food and threats.
- Boats, for a map with lakes or a coast (Keegan, Nov 21).
- More jobs after the first 12.

## Screens

Every screen you can see, in play order (studio rule: `studio-bible/studio.md`, Screen list, set Nov 23, 2026). A spec that adds a screen adds its row here. Specs are in `specs/`, mockups in `mockups/`. A screen marked To draw gets an approved mockup before the part that builds it (`studio-bible/studio.md`, Screen list). Nothing is built yet.

| Screen | What you do there | Spec | Mockup |
| --- | --- | --- | --- |
| Title | New world, Continue, Best runs, Import save | 001 (2) | `03-cover-b-rough-v2` and the night street in `04` (a mood piece; the rows use the `05` surface) |
| New world | Set up the world before you start | 001 (3) | `05` (same surface and cards) |
| Survivor builder | Make your survivor | 001 (4, 5) | `05`, sprites to `06` |
| Map | Walk the town's sections, with the top bar, search, locks and night | 002 (1 to 7) | `04` |
| Fights on the map | Turns, zombies, attacks, noise, sneaking, fleeing | 003 (1 to 8) | **To draw** (`01` is an old placeholder) |
| Bag (L) | Your items, crafting | 002 (8, 10) | `07-bag-rough-v2` (approved Nov 25, 2026) |
| Map screen (R) | The map of what you've found | 002 (12) | `08-map-screen-rough-v2` (approved Nov 25, 2026) |
| Start menu | Party, Notebook, Wait, Sleep, Claim this place, Save code, Quit to title | 001 (wiring), 002, 004 (wiring) | `05` (same surface) |
| Party card | You and your companions | 001 (6), `studio-bible/ui.md` | `05` (the taped photo and cards) |
| Notebook | What you've learned | 002 (11) | `09-notebook-v1` (approved Nov 25, 2026; its Recipes page is also the Bag's) |
| Hideout | Claim a place, build, cook, sleep, store | 004 (1 to 4, 8) | **To draw** |
| Attack on the hideout | Defend it when something comes | 004 (5, 6) | **To draw** |
| Death screen | Your run ends: days survived | 004 (9) | **To draw** |
| Best runs | Your best runs for each preset | 001 (2), 004 (10) | `05` (same surface) |
| Companion orders (Select) | Give companions orders | **No spec yet** (not in the first slice; Companions sets the rules) | None yet |
| Trade with survivors | Trade with other survivors | **No spec yet** (not in the first slice; Other survivors and trade) | None yet |

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

**Mature content.** Violence, gore, infection, starvation, cruelty and hard choices about other people are on the table, shown plainly and never lingered on for shock. Romance fades to black (Claude's call, confirmed by Keegan Nov 25, 2026). Hard line: nothing sexual involving minors, ever. Children are harmed only off screen or as aftermath.

**Open questions.** See To do.

## Setting

- **When and where** (set Nov 21): 1990s America. The first map is a small town and its countryside. Cities and other regions come later as expansions. The game is not meant to stay rural.
- **Starting region** (Keegan, Nov 23): a made-up farm county in the Midwest. It's quiet and open, a good place to learn.
- **Planned expansions** (Keegan, Nov 23): a Rust Belt city, the Gulf Coast, the mountain west, the desert southwest and the Pacific Northwest. Each brings its own weather mix and threats. Order not set.
- **Low-tech survival.** No cell phones or internet. Landlines are dead, radios mostly static, cars need fuel and parts.
- **Brands** (set Nov 21): look-alike brands only. Made-up names and logos styled after real 1990s brands (a red cola, a big-box store, a pickup truck maker) so the world feels real without using real trademarks. Real brand names and logos never appear (`studio-bible/studio.md`, One repo, one source of truth).
- **No overarching story.** Nothing explains the outbreak and nothing ends it. The world's history is told only through places, notes and the people you meet.

## The run

- **One life, one world** (set Nov 21). Each game generates a new world. When your survivor dies, the game is over and the save is cleared. There's no carry-over.
- **Goal** (set Nov 21): none. The score is days survived, shown on the death screen. Each difficulty preset keeps its own best-runs list outside the run (Keegan, Nov 23).
- **How a game opens** (set Nov 21): weeks after the outbreak. It's already over. You wake with a few items and go straight into play.
- **Difficulty** (set Nov 21): a few world presets picked at a new game (for example Gentle, Standard, Harsh). They change loot, zombie numbers and how fast the world runs down. The preset shows on the death screen. Numbers: see Difficulty presets below.
- **Learning** (set Nov 21): no tutorial. The first time something comes up (hunger, noise, the first night), your survivor jots a short note you can reread later.
- **Death screen** (set Nov 21): a short life story. Days survived, how you died, and the run's big moments (who joined, who you lost, falling for a companion, moving hideout), plus the seed and the preset.
- **Seeded** (Claude's call, for review): each world comes from one seed, and dice draw from a second saved stream, so reopening the game rerolls nothing. The seed shows on the death screen, and a new game can start from a typed seed. Follows `studio-bible/saves.md`, Seeds.

### Difficulty presets

Set Nov 23 from Keegan's review. Standard is the numbers already in this bible.

| What changes | Gentle | Standard | Harsh |
| --- | --- | --- | --- |
| Hunger: a full bar lasts | 3 days | 2 days | 1.5 days |
| Pass out after awake | 36 hours | 30 hours | 24 hours |
| SAN cost of hard moments | Half | As set | 1.5x |
| Healing per night | 15 | 10 | 5 |
| Zombie toughness (bat hits) | 2 | 2 to 3 | 3 to 4 |
| Scratch / bite damage | 5 / 15 | 10 / 20 | 15 / 30 |
| Bite infection chance | 25% | 50% | 75% |
| Your hit chance (average) | 85% | 75% | 65% |
| Loot per search spot | More | As set | Less |
| Ammo found | 1.5x | As set | Half |
| Attack odds at the hideout | Half | As set | 1.5x |
| Hordes per season | At most 1, smaller | At most 1 | Up to 2 |
| Rumors that are traps | 1 in 5 | 1 in 3 | 1 in 2 |
| Short-job death chance | Under 2% | Under 5% | Under 10% |
| Weather warnings | Always shown a day ahead | Radio or sky | Radio only |

- **Never changes:** one life, and death is final on every preset. The map, jobs, traits and story parts are the same.
- **Picked once** (Keegan, Nov 23): you choose the preset at the start of a run and can't change it. There's no Custom option.
- **Best runs:** each preset keeps its own best-runs list. The preset shows on the death screen and in the survivor notes, next to days survived.

## Your survivor

- **You start alone** (set Nov 21). Companions join later, and they're generated by the world.
- **Build or pick** (set Nov 21): make your survivor in a free build, or start from a template.
  - **Past job:** sets your starting skills and a few items. 12 jobs, all in the first slice (Keegan, Nov 21): nurse, mechanic, farmer, cop, teacher, trucker, line cook, high school athlete, homeless, construction worker, army veteran, store clerk. Then 3 free skill points to spend anywhere.
  - **Traits on points** (Keegan, Nov 21): one good list and one bad list. Good traits cost points and bad ones give points; your good points can't be more than your bad points, and you take up to 3 good traits. Companions use the same lists. The lists and effects are in `survivor.md`.
  - **Looks from parts:** body type, skin tone, face, hair style and color, clothes colors and age range (young adult to older). They show on the map sprite and the portrait, built from the same parts as companions and zombies.
  - **Templates:** one ready-made survivor per job, with a name (for example Rita, the night-shift nurse), traits and looks already picked. You can change any of it.
- **A want** (set Nov 21): your survivor also has a want (find family, get home, make something last). It gives a long run a thread with no ending, and rumors can tie into it.
- **Getting better** (set Nov 21): skills grow with use. There's no XP screen. Each skill unlocks an ability at level 3 and a bigger one at level 5 (Keegan, Nov 21; see `survivor.md`).
- **Full builder:** skills, abilities, jobs, traits, wants, looks parts and templates are in `survivor.md`, part of this bible.

## The map

- **Generated each game** (set Nov 21): one town plus its countryside, new every time.
- **Big enough to last** (set Nov 21): the map has to carry a long one-life game through several seasons.
- **Sections** (set Nov 21): 5 big walkable sections, each with many places to search: downtown (diner, pharmacy, hardware store, police station), houses (homes, school, church), the highway strip (gas station, motel, big-box store), the farm belt, and the woods and lake. The first slice can use a smaller cut.
- **Generator** (Keegan, Nov 21). Exact numbers are tuned in playtests.
  - **Section size:** 60 × 60 tiles, with about 15 to 20 places to search. Walking across takes about an hour, and one section feeds you for about a season.
  - **What changes each game:** every game has the same 5 section types. The streets, buildings, loot and where each section sits are new every time.
  - **What comes back:** a looted building stays empty. Only what moves refills. Wild food grows back by season, traders bring new stock, and raider camps fill up with what they take.
  - **First slice:** the houses and highway strip sections, with one road trip between them.
- **Getting around** (set Nov 21): walk tile by tile inside a section. Travel between sections on a road map: drive (fast, loud, needs gas), bike or skateboard, or walk (slow, and you may have to camp). Road trips cost time and can bring road events.
- **Learning the map** (set Nov 21): places start hidden until you see them. A found road map (from a gas station) shows the roads. Your survivor marks places as looted, dangerous or promising.
- **The world runs down** (set Nov 21). Each building is looted once; food and supplies near your shelter thin out. Food spoils, the power fails and raiders grow bolder. By the second or third season you must travel further and craft more, which costs time and risk, and you may have to move hideouts. That keeps a long game moving.
- **What pulls you forward** (set Nov 21): rumors from radio calls, notes and survivors point to far places worth the trip (a military depot, a seed vault, a safe zone). Some are real and some are traps. Your survivor's want gives the trip a reason.
- **Bigger threats grow from the world** (set Nov 21): raider gangs merge under a leader who hunts you by name, and big hordes drift through each season. They grow from what you did, not on a timer.
- **Rumors and late threats** (Keegan, Nov 21). Exact numbers are tuned in playtests.
  - **Traps:** about 1 rumor in 3 is a trap. Hints give it away to a careful player: an odd voice on the radio, a note that's too perfect, a survivor who won't meet your eyes.
  - **First rumor list** (Claude's first pass, for review): a National Guard depot with guns and medicine; a seed vault at the old farm co-op; a safe zone named on the radio; a hospital wing that still has power; a fuel truck stuck on the interstate; a doctor said to have the cure; a survivor camp taking in people; a family member's name on a church notice board (for Find family). Each can be real or a trap.
  - **The raider leader** rises from either of two things: a hidden grudge (each raider you kill, rob or shame adds to it) or your wealth (a big, well-stocked hideout that raiders know about). Past a line, gangs merge under a named leader who hunts you.
  - **Hordes:** at most 1 a season. Your noise adds to a hidden pull, and when it's high a horde of 30 to 60 drifts through over a day. The radio or the sky warns you; you hide, flee or fight with traps. Quiet players rarely face one.
  - **A secret hideout** (Keegan, Nov 21): raiders only come for a hideout they know about. They find out if they follow you home, see cooking smoke by day or light at night, hear it from a raider you let go, or hear it from a trader or on the CB radio. You stay hidden by taking the long way home, cooking without smoke, blacking out windows (a craft) and hiding the entrance. Moving to a new hideout resets it.
- **Vehicles** (set Nov 21): cars are rare and costly. Most are dead; one that runs needs gas, a battery and repairs. It carries a lot fast but is loud. Bikes and skateboards are quieter ways to get around.
- **Weather and events** (set Nov 21): grounded. Storms, fog, heat waves, blizzards, a horde passing through, a raider push. A working radio (with batteries) warns you a day ahead; without one you read the sky, which is less sure. The first list, how often each comes and how sure the warnings are: see `weather.md`, part of this bible.
- **Map view** (`studio-bible/art-style.md`): Stardew-style 3/4 top-down, 16 px tiles, building fronts and faces.

## Time and seasons

- **Day and night** (set Nov 21). Time moves when you act: each step or action uses in-game minutes. Days are for scavenging; nights are far more dangerous, with more zombies out and raiders attacking shelters.
- **Night is your choice** (set Nov 21): hole up (sleep, craft, talk, defend) or go out. Going out is how you get what people guard: raiders and survivors watch the best places by day and sleep at night, so you can sneak in. The cost: zombies are hard to see, sound carries farther (a bigger noise ring), your flashlight draws zombies and uses batteries, and getting caught makes enemies of that group.
- **Day length** (set Nov 21): about 10 to 15 minutes of play, so one day fits one sitting.
- **The clock** (Keegan, Nov 21). Exact numbers are tuned in playtests.
  - **Steps:** 1 in-game minute per map step.
  - **Actions:** search a spot 10 minutes, eat 10, bandage 5, pick a lock 20 (force it 5), a small craft 15, a big build 1 to 2 hours, a fight turn 1 minute. A house takes about an hour to clear, so a day fits 6 to 8 places.
  - **Day and night:** dawn is 6 AM all year. Dusk is 9 PM in summer, 7 PM in spring and fall, and 5 PM in winter.
  - **Sleep:** pick 1 to 10 hours, any time. 8 hours is a full rest, and a nap helps a little. An attack or a noise can wake you.
  - **Travel between sections:** walking takes 3 hours, a bike 1 hour, and driving 20 minutes (it burns gas and is loud). You may meet someone on the road.
- **Season length** (set Nov 21): 14 days. A year is 56 days, about 10 to 14 hours of play.
- **Starting season** (set Nov 21): pick it when you set up a new world, or leave it random. Summer is gentler, winter is brutal.
- **Menus and time** (set Nov 21): looking is free. Opening the bag, map or notes stops the clock. Doing something (eating, bandaging, reloading, crafting) costs in-game minutes and, in a fight, your turn.
- **Seasons** (set Nov 21), each with its own pluses and minuses. First pass (Claude's call, for review):

| Season | Plus | Minus |
| --- | --- | --- |
| Summer | More food to forage | Meat spoils fast; zombies are more active |
| Fall | Harvest; the time to stockpile | Days get shorter |
| Winter | Zombies slow down in the cold | Food is scarce; cold drains health without heat |
| Spring | Mud and rain hide your noise | The thaw wakes more zombies |

## Needs

- **Four needs** (set Nov 21): hunger, health, sleep and SAN. No thirst meter: water counts as food.
- **On screen** (set Nov 21): four small bars in the top bar, plus body cues (a stomach-growl line, yawning, limping, the phantoms).
- **Hunger:** drops through the day. Eating refills it. Starving drains health every hour.
- **Health:** wounds, infection, cold and starving drain it. Rest and medicine restore it. At zero you die.
- **Sleep:** drops while awake. Low sleep makes you slower and worse at everything. At zero you pass out where you stand (set Nov 21). Sleeping is safest inside the shelter, with a companion on watch.
- **SAN** (set Nov 21): a light mechanic, not a big deal. It drifts down with darkness, gore, losing companions and no sleep. Low SAN worsens aim and shows as phantoms and grit, not the studio's pink and cyan edges (see Art, and Conflicts). Only at zero SAN does it take control, and only for a few turns: you freeze or run (set Nov 21).
- **The numbers** (Keegan, Nov 21). Every bar runs 0 to 100. Exact numbers are tuned in playtests, and difficulty presets move them.
  - **Hunger:** 2 meals a day. A full bar lasts about 2 days with no food. A solid meal fills about 40 and a light one about 20. Once starving, you die about 2 days later.
  - **Sleep:** you get slow and clumsy after about 18 hours awake, and you pass out at about 30. 8 hours of sleep is a full rest (see Time and seasons, The clock).
  - **SAN:** falls slowly. A hard day costs 10 to 15, a kill or gore 5 to 10, and losing a companion 30. A good evening wins most of a hard day back. Phantoms and grit start at 50 (see Art).
  - **Health:** comes back slowly. A full night's sleep heals about 10, and more in a real bed. A deep cut or a break won't heal until it's treated.
- **Joy restores SAN** (set Nov 21): a shared meal, a quiet night on watch together, a companion's arc paying off, a romance scene, finding something that was loved before (a cassette, a photo). People refill what the dark drains, so bonds are part of survival.
- **Vices** (set Nov 21): cigarettes, booze and pills lift SAN fast, at a cost. Booze makes you clumsy while drunk (worse aim, bigger noise ring), a lit cigarette glows in the dark and can be seen at night, and pills slow you. Lean on one and you crave it. A Smoker starts hooked. Vices trade well. Homegrown weed (Keegan, Nov 21) lifts SAN and calms panic, but makes you hungrier and slower, and the smoke glows and smells.

## Combat

- **On the map, turn-based** (set Nov 21, after the rough mockup in `mockups/01-combat-compare-rough-v1.png`). There is no separate battle screen. Each step or action is one turn, and zombies, raiders and companions move after you.
- You see what's coming: the tile each nearby zombie will step to next is marked, and the bottom box shows the target, your weapon and your chance to hit before you swing.
- **Zombies** (set Nov 21): slow shamblers, deadly in numbers. They follow noise and sight.
- **Grounded variants** (set Nov 21): all shamblers at heart. Crawlers hide in grass, fresh turns are a bit quicker, bloated ones burst and spread sickness, and frozen ones sit still in winter.
- **Over a long run** (set Nov 21): old zombies slowly rot and fall apart, but everyone who dies turns, so fresh ones keep coming. Someone you lost may walk back up to you.
- **Bites** (set Nov 21): a chance of infection. Infection is treatable with rare medicine; untreated, it kills, and the dead come back.
- **Noise** (set Nov 21): the game has no sound, so noise is drawn as a ring on the map. Every action has a noise size (sneaking, swinging, breaking a door, a gunshot, a car). Zombies inside the ring turn toward it. Guns are strong but loud.
- **Other people** (set Nov 21): raiders who attack, and traders you can talk and trade with. People fight on the same turn rules as zombies, but they think, take cover and run.
- **The numbers** (Keegan, Nov 21). Exact numbers are tuned in playtests.
  - **Zombie toughness:** 2 to 3 bat hits kill one. One zombie is easy, two is a fight, and four means you run. A scratch costs about 10 health, and a bite about 20 plus the infection risk.
  - **Hit chance:** about 75% with melee for an average survivor, rising with skill, and about 60% with guns. Low SAN, being drunk or a bad arm lowers it.
  - **Noise rings, in tiles:** sneak 1, walk 2, a melee swing 3, forcing a door 6, a gunshot 15, a car 20. Night makes rings bigger and rain makes them smaller.
  - **How zombies move:** toward the last noise or sight, then they wander.
  - **How raiders move:** smart but readable. They take cover, flank in pairs, back off when hurt, and give up when they're alone and losing. Their next move is marked like a zombie's.
- **Fleeing:** you can always try to walk away; shamblers are slow, but numbers and dead ends trap you.
- **Weapons** (set Nov 21): bats, pipes and axes wear down and can be fixed or crafted. Guns hold up, but bullets are scarce, so every shot is a choice. Guns are in the first slice, but rare (Keegan, Nov 21). The full weapon list is in `items.md`.
- **Wounds** (set Nov 21): hits lower health, and a large hit has a chance of leaving a wound (a deep cut, a sprained ankle, a broken arm) that slows or weakens you until it's treated and heals over days.
- **Sneaking** (set Nov 21): zombies and people see in a cone shown on the map. Stay out of it and keep your noise ring small to slip past, or kill quietly from behind with a melee weapon.
- **Stealth bonus** (set Nov 21): hitting anyone who hasn't seen you is easier and does more damage. A melee hit from behind on an unaware zombie is a sure, quiet kill. An unaware person takes a heavy hit and is often wounded. Guns get the aim bonus but are still loud.
- **Fights with people** (set Nov 21): people can surrender, run or be talked down mid-fight, and you choose to spare, rob or kill them. Killing a person weighs on SAN, and their group remembers it. You can harden to it (Keegan, Nov 21): after enough kills of people it stops costing SAN, but kind companions trust you less, some evening talks close, and a few may leave.

## Companions

- **Who you play** (set Nov 21): one survivor you control, plus up to 2 companions who travel with you. A 3rd companion can join once you have a bigger hideout (Keegan, Nov 23).
- **Full lists** (set Nov 23): fears, wants, bond numbers, order rules, short-job odds, arcs, evening scenes and romance are in `companions.md`, part of this bible.
- **Settlers** (set Nov 21): more people can live at your hideout. They guard, garden and craft, need food, and have their own moods. When you move, each one chooses by mood and bond: come along on a risky trip, stay and keep the old place going (somewhere to return to and trade with), or leave for good.
- **Simple orders** (set Nov 21): companions act on their own, and you steer them with orders from a quick menu opened with Select: Follow, Hold here, Sneak, Fight. Between orders they follow a short list of rules in order, for example: don't step next to 2 or more zombies, stay inside your noise ring, retreat when badly hurt, never shoot while sneaking, hit whatever threatens you first.
- **Deaths stick** (set Nov 21): a dead companion is gone. You can meet new people later.
- **Complex bonds** (set Nov 21). Since you only steer your own survivor, companions carry the depth:
  - **Meeting them** (set Nov 21): you find people in the world, hiding, trapped or on the road. You help them, trade or talk, and they ask to join only once they trust you.
  - **Who they are:** each companion is generated with a balanced set of traits from the same lists as your survivor (see Your survivor), one skill (medic, mechanic, hunter…), one fear and one want.
  - **Reading them** (set Nov 21): there's no bond meter. Their portrait mood, what they say and how they take orders tell you how they feel. The Party menu shows only a rough word (Wary, Easy, Close).
  - **Evening talks** (set Nov 21): each evening at the hideout, pick one person to talk with, share food with, or do something small with (cards, fixing a radio). Short scenes with choices.
  - **Bond with you:** grows when you share food, save them, keep a promise or let them rest. Drops when you eat while they starve, leave them behind or ignore their fear.
  - **What bond unlocks:** low bond, they hesitate or refuse risky orders. High bond, they take risky orders, guard you while you sleep, team up on attacks and ask you for small personal favors.
  - **Short jobs** (set Nov 21): send a companion out alone to scavenge, hunt or scout while you do something else. You see their chance of success first. They come back with loot and a story, hurt, or not at all.
  - **Bonds between people:** companions and settlers grow close or clash with each other, which shapes who you can send where (Keegan, Nov 23: settlers too).
  - **Low bond has teeth** (set Nov 21): a companion treated badly may walk out, steal supplies, or side with raiders.
  - **Hard choices:** a bitten companion can be treated, locked away to see if they turn, or put down. Traders may offer a deal for one of your people.
- **Personal arcs** (set Nov 21): small generated arcs built from parts (a missing sister, a past they hide), with a few scenes as bond grows.
- **Romance** (set Nov 21): optional, a slow build over evening talks with an adult companion. Each companion has their own attraction (to men, to women, both, or not interested), so not everyone is open to you, and some are put off by flirting, which lowers bond. It fades to black, lifts SAN, and makes losing them hit much harder.

## Other survivors and trade

- **Mixed, and they remember you** (set Nov 21): loners, families, traders and raider gangs. Each group starts friendlier or more hostile, then shifts with how you treat it: help, trade, theft, a spared life or a killing.
- **Trade** (set Nov 21): barter, no money. Values shift with need, the season and how much a group trusts you. Medicine is worth the most.
- **Full lists** (set Nov 23): group types, what they remember, barter values and joining raiders are in `survivors.md`, part of this bible.

## Controls and screens

- **Buttons** (set Nov 21): D-pad moves and faces, A acts, B goes back, Start opens the full menu, Select opens companion orders. L opens the bag and R opens the map; both stop the clock. Inside the bag and the map, L and R flip between pages.
- **Top bar** (set Nov 21; made a framed card Nov 23, mockup `04`): a framed card across the top with your survivor's face (from the portrait, so mood, SAN and injuries show), the four need bars each with an icon and a short label (FOOD, HP, REST, SAN), the day, the clock and the season mark. The section's name sits on a small tab under it. Your weapon and ammo show only in fights.
- **Bag** (set Nov 21): a grid of slots. Pockets are one row, and each bag adds rows of item squares with pixel icons, counts and a wear mark. L and R flip to companions' bags. A uses an item, B goes back.
- **Party menu** (set Nov 21): the studio's party cards (`studio-bible/ui.md`) for you and each companion: portrait, needs, wounds, traits, the rough bond word, and Give item. No Make lead, since you always play your own survivor.

## Shelter

- **Claim and fortify a building** (set Nov 21): pick a real building on the map, board up doors and windows, and add beds, storage and traps on its tile grid.
- **What you build** (set Nov 21): defenses (boards, traps, a lookout, a rain barrel) plus a few comforts (a real bed, a stove, a radio corner) that help sleep, food and SAN.
- **What brings attacks** (set Nov 21): your choices. Noise, light, cooking smoke and how long you stay raise the odds, and raiders come if they know where you live (see The map, A secret hideout). Quiet nights are common.
- **You play attacks out** (set Nov 21): you're woken, then fight turn by turn inside your building: hold doors, fix boards, place companions. If you're away, it's worked out from your defenses. Barricades take damage and need repair.
- **Attacks must never be a chore** (Keegan, Nov 21): short (a few minutes), each with a twist (a weak board gives way, a companion panics, raiders shout a deal through the door), with real choices beyond swinging (fall back a room, light a fire trap, slip out the back). A small attack your defenses clearly win is settled in one line.
- **Full lists** (set Nov 23): buildings, builds, attack odds, twists and settler jobs are in `shelter.md`, part of this bible. You can hold a main hideout plus safe houses.
- **Moving** (set Nov 21): when the area runs dry, you can move. You take only what you can carry: your bags, your companions' bags and a working car. Builds stay behind, but some can be stripped for parts.

## Items and crafting

- **Item list** (set Nov 21): every item, recipe and keepsake is in `items.md`, part of this bible. Exact numbers go in spec 001.
- **Bag slots** (set Nov 21): 4 pocket slots, and you can wear one bag at a time for more (a school backpack, a hiking pack). Every companion carries the same way, and L/R flips between people on the bag screen.
- **Hideout storage** (Keegan, Nov 21): crates and shelves you build, a root cellar where food spoils slower, and a small lockbox raiders can't take from. Anything else can be stolen in a raid. Sizes are set in playtests.
- **Crafting** (set Nov 21): simple recipes from scavenged parts. Weapons (a nail bat), barricades and traps, without deep menus. How it works (Keegan, Nov 21): your notebook's Recipes page, opened from the bag menu, lists the recipes you know and shows what's missing. You start with a few from your job and learn more from finds (how-to magazines, the field guide) and from companions at evening talks. Small things craft anywhere; big builds need a workbench at the hideout. Crafting takes time on the clock.
- **Looting the dead** (Keegan, Nov 21): a dead survivor or raider drops what they carried: their bag, a worn weapon, a few rounds, some food, maybe a note or keepsake. Raiders carry more. Searching a body takes time.
- **Searching** (set Nov 21): each room has spots to search (a fridge, a closet, a car trunk). Searching takes in-game minutes and makes a little noise, and what's there fits the place. Traits, skills and items make it quicker or quieter (a crowbar, a flashlight, Steady Hands).
- **Locks** (set Nov 21): find the key, pick it (slow, quiet, needs a skill or tools), or force it (fast, loud, can break the lock or your tool). The best loot is often behind one.
- **Food** spoils by season (see Time and seasons). Canned food keeps. Once the stores run dry (set Nov 21): grow a garden at the hideout (seasons matter), hunt, fish and forage, or take it from other survivors. Farming (Keegan, Nov 21): plant seed packets in plots by season (nothing grows in winter), keep hens and goats for eggs and milk, and set snares. It needs daily work, adds noise, and raiders want it; an attack can kill animals and crops. Weed can be grown too, as a vice.
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
- **Cover** (Keegan, Nov 22): Boarded window. A hideout window seen from outside at night, nailed with boards, warm light showing through. A dead hand, a dark silhouette with fingers spread, presses on the glass in the gap between the boards, over a smear. The title LIFE AFTER sits on a dark band at the bottom in Press Start 2P. Reference: `mockups/03-cover-b-rough-v2`; the Developer can clean up the pixels but keeps the layout and the hand's read at actual size.
- Exact palette hex codes and each season's colors come with the first in-shell mockup. Drawn Nov 23: the day ramps are on `06-sprite-reference-rough-v3`, night is `02`'s NIGHT set; locked Nov 23 with the look check. Other seasons come with the town spec's season work.
- **Look bar** (set Nov 23, from Rushlight's look lessons, studio PR #168): Life After keeps its own look and meets the studio's bars: `art-style.md` Quality bar, Maps are lit, dressed and alive, People pop, No twins, and `ui.md` Screen craft. Because there's no grit, texture comes from shape and tone: four-tone ramps, hard edges, and flat shapes for cracks, weeds, furrows and folds, never grain or noise.
- **Light:** by day, a low sun from the upper left with hard shadows to the lower right (stark, as in `03`). Night as above.
- **Maps are alive:** crows on the wires, strays nosing trash, a sign that flickers, litter that blows, smoke from a far fire. Places people would be have the dead or the dead-and-gone in them (a body against a wall), shown plainly.
- **Menu surface** (set Nov 23, mockup `05`): flattened cardboard with marker writing and duct tape, like a sign a survivor made. Job and place names in red marker, the rest in black. Your survivor's portrait is a photo taped to it. The picked row is edged in cyan, the same cyan as usable things. Flat tones only: a lit spot, darker edges, the flutes showing on a cut edge.
- **Sprite reference** (`06`, v3): your survivor's portrait in four moods, the map sprite at 1× and 3×, another person, and four of the dead (no two alike: a kid is shorter, the farmer has lost an arm). Every new sprite is checked against it side by side.
- Mockups live in `mockups/` as design references only; the game never loads them. Each keeps the code that drew it.

| Mockup | What it shows |
| --- | --- |
| `01-combat-compare-rough-v1` | Rough, Nov 21: fighting on the map (picked) beside a separate battle screen (not picked). Placeholder colors. |
| `02-baseline-san-rough-v2` | Rough, Nov 21: the same night at normal SAN, a color-drain option (not picked) and phantoms (picked). The phantoms panel is the baseline frame. |
| `03-cover-options-rough-v1` | Rough, Nov 22: three cover options (Vacancy, Boarded window, First light). Keegan picked Boarded window. |
| `03-cover-b-rough-v2` | Rough, Nov 22: Boarded window redrawn so the hand reads, as a dark silhouette in a wide gap between boards. Picked Nov 22 (Keegan): this is the cover. |
| `04-look-street-rough-v1` | Rough, Nov 23: the highway strip by day and night in the shell at 375 × 667, at the studio's look bar: lit, dressed and alive, with the top bar card. Keegan, Nov 23: the direction is right; necks too long, shading read as stubble, cars didn't read as cars. |
| `04-look-street-rough-v2` | Rough, Nov 23: v1 with shorter necks, clean faces lit from the side (no stubble look), and real cars (side view with the roof showing, wheels in arches, glass, lights). Approved Nov 23 (Keegan): this is the look. |
| `05-look-builder-rough-v1` | Rough, Nov 23: the survivor builder's Job step on the proposed cardboard menu surface, jobs as cards. Keegan, Nov 23: the direction is right; necks too long, shading read as stubble, cars didn't read as cars. |
| `05-look-builder-rough-v2` | Rough, Nov 23: v1 with shorter necks, clean faces lit from the side (no stubble look), and real cars (side view with the roof showing, wheels in arches, glass, lights). Approved Nov 23 (Keegan): this is the look. |
| `06-sprite-reference-rough-v1` | Rough, Nov 23: the sprite reference and day palette. Keegan, Nov 23: the direction is right; necks too long, shading read as stubble, cars didn't read as cars. |
| `06-sprite-reference-rough-v2` | Rough, Nov 23: v1 with shorter necks, clean faces lit from the side (no stubble look), and real cars (side view with the roof showing, wheels in arches, glass, lights). Approved Nov 23 (Keegan): this is the look. |
| `06-sprite-reference-rough-v3` | Rough, Nov 23: v2 with Scared redrawn, because Keegan found it read as surprised. Now the inner brows are pulled up and together, the eyes are wide and dart to one side, the mouth is a tight grimace and there's a sweat bead. Approved Nov 23 (Keegan): this is the sprite reference. |
| `07-bag-rough-v1` | Rough, Nov 25: the Bag (L) on the cardboard surface: 4 pocket slots and a school backpack's 6, each square with its icon, count and wear marks; In hand, slots used and walk speed on the right; the picked item's card with its actions as buttons (after A); L/R flip to Recipes. Keegan approved it as is, Nov 25. |
| `07-bag-rough-v2` | Nov 25, finished quality: v1's layout with 20 × 20 item icons, shaded from the upper left and drawn with the game's selective outline, in bigger 30 px slots. Keegan approved it Nov 25; build to this one. |
| `09-notebook-v1` | Nov 25, finished quality: the Notebook (Start → Notebook) with its two pages. Notes: a ruled spiral-pad page taped to the cardboard, your survivor's lines in marker with the day and time, the newest in red, scrolling up. Recipes (shared with the Bag): one card per known recipe; one you can make now is white with a Make button and what it uses; one you can't shows its parts as chips, the missing ones crossed out in red, and a Missing line. Keegan approved it Nov 25. |
| `08-map-screen-rough-v1` | Rough, Nov 25: the Map screen's first pass. Keegan, Nov 25: the vibe is right but it looked too rough; since the build copies the mockup, screen mockups are now drawn at finished quality. |
| `08-map-screen-rough-v2` | Nov 25, finished quality: the Map screen (R), page 1 This section. Your survivor's own map in black and red marker on cardboard: houses with gable roofs, drives and yard trees, the school's flat roof, gym and playground, the church's steeple, streets with curbs and a center line, unseen ground as bare cardboard behind a hatched edge. Place names on taped paper tags; marks on paper discs (looted a cross, promising a circle, danger a red triangle); a red pin for you and your bike in its drive. The view scrolls over the 60 × 60 section. The picked place's card shows its mark, and A changes it. Page 2, the Road map, uses the same style. Keegan approved it Nov 25. |

## Tech

- Plain HTML canvas on the studio's shared `engine/` (`studio-bible/studio.md`). Shared parts (shell, input, map walking, dialog box) come from there. Anything new that another game could use goes in `engine/` too.
- **Saving** (`studio-bible/saves.md`): one slot, autosave, deaths stick, save version number, export and import code. Planned keys (Claude's call, for review):

| Key | Holds |
| --- | --- |
| `la.run` | The current world: seed, dice position, clock, survivor, companions, shelter, map state. Death clears it. |
| `la.record` | The 5 best runs for each preset. Survives a death. |
| `la.version` | Save version number. |

## Conflicts with the studio bible

Found while drafting (Nov 21). Each needs a decision or a separate `studio-bible/` PR, made after the dev setup's open studio-bible PRs merge.

- **Battle screen** (`studio-bible/ui.md`, Battle screen): describes a head-on battle screen. Life After fights on the map and has none. Settled Nov 21: the section now applies only to games that have a battle screen.
- **Select** (`studio-bible/controls.md`, Buttons): settled Nov 21 (Keegan). Select opens companion orders (Follow, Hold here, Sneak, Fight), and `controls.md` lets a game with no lead to cycle give Select its own job.
- **Low SAN signal** (`studio-bible/art-style.md`, Color): makes pink and cyan the shared low-SAN mark. Settled Nov 21: `art-style.md` now lets a game show low SAN its own way, and Life After uses phantoms and SAN grit, with cyan for usable things.
- **Party menu** (`studio-bible/ui.md`, Party menu, added Nov 21 from Black Lantern spec 002): assumes a lead you can swap, with Make lead and Select cycling. Life After keeps one survivor as lead, so it has no Make lead and Select opens orders instead. Settled Nov 21: Life After uses the party cards without Make lead (see Controls and screens). Settled Nov 21: `ui.md` now says a game with one fixed lead leaves out Make lead and Select cycling.
- **L/R** (`studio-bible/controls.md`, Buttons): says L/R step previous and next. Life After uses L for the bag and R for the map (Keegan, Nov 21). Settled Nov 21: `controls.md` now lets a game give L/R their own jobs.

