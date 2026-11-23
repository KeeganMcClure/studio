# Spec 003: Slice part C, survival and fights

Status: draft for Keegan's review · Written 2026-11-23 by the Game Designer · Game: Life After · To do: Spec 001, Part C

## In plain words

This part makes the town dangerous. Zombies stand in houses and shamble down the street. They follow noise and sight. You fight them on the map, turn by turn, with whatever you found. Every action makes a noise ring, and zombies inside it turn toward you. Hunger, sleep, health and SAN now bite. Bites can turn you, wounds slow you, and low SAN brings the phantoms.

When it's done the slice is a real survival game except for the hideout and the end: you can live, fight, sneak, starve, get bitten and die. Part D adds the hideout, real sleep and the death screen; until then a death drops you to a plain "You died." screen with New world.

All numbers are a first pass for playtests, on Standard. The difficulty table in `bible.md` moves the ones it names.

## Bible sections this spec relies on

| Source | Section | What it sets |
| --- | --- | --- |
| `bible.md` | Needs | Four needs, the numbers, joy restores SAN, vices |
| `bible.md` | Combat | On the map, turn-based, the next step marked, zombies, variants, bites, noise, the numbers, fleeing, weapons, wounds, sneaking, stealth bonus |
| `bible.md` | Art | Low SAN phantoms and grit from 50, never hiding text or threats; gore; zombies show who they were |
| `bible.md` | Time and seasons | Night is more dangerous; seasons (summer active, winter slow) |
| `bible.md` | Difficulty presets | Every row about needs, combat and infection |
| `items.md` | Weapons and ammo; Medicine; Vices and comforts; Keepsakes | What each item does in a fight or for a need |
| `survivor.md` | Skills; Abilities; Traits | Skill growth, the abilities at 3 and 5, trait effects |
| `studio-bible/art-style.md` | Color | A game may show low SAN its own way (Life After: phantoms and grit) |

## What is built today

Parts A and B: a new world, the builder, saves, the two sections, the clock, day and night, searching, locks, the bag, items, crafting, the notebook and the map screen. Hunger and sleep drop but do nothing at zero.

## What to build

### 1. Turns

- The map is always turn-based. Each step or action of yours is one turn; then every zombie within 20 tiles takes its turn. Zombies farther away move once every 10 of your turns, so the town still drifts while you're busy.
- When no zombie is within 10 tiles, walking feels as smooth as Parts A and B: the turns still happen, there's just nothing to see.
- **The next step is marked** (`bible.md`, Combat): each zombie on screen that will move shows a small mark on the tile it steps to next.
- **A fight turn is 1 minute** on the clock. A step is 1 minute as before.

### 2. Zombies

| Kind | Health | Moves | Notes |
| --- | --- | --- | --- |
| Shambler | 24 to 34 | 2 turns in 3 | Most of them |
| Fresh turn | 20 to 28 | Every turn | About 1 in 6; quicker, cleaner clothes |
| Crawler | 12 to 18 | 1 turn in 2 | About 1 in 10; hides in tall grass and under cars, seen only within 2 tiles |
| Frozen | As shambler | Doesn't move | Winter only, outside; wakes if hit, and over 2 days of thaw |

- **How many:** about 40 to 50 in each section at the start, spread through buildings and streets. About a third stand still indoors by day and come out at dusk, so nights have more zombies out (`bible.md`, Day and night).
- **More keep coming:** 2 to 4 fresh turns walk into each section each day from its edges (`bible.md`, Over a long run: everyone who dies turns).
- **Seasons:** in summer shamblers move every turn in the hottest hours (noon to 6 PM); in winter they move 1 turn in 3 outside.
- **Toughness by preset:** Gentle zombies have about 2 bat hits of health, Standard 2 to 3, Harsh 3 to 4 (`bible.md`, Difficulty presets). Scale health to match.
- **Looks:** built from parts, showing who they were (`bible.md`, Art): a mail carrier, a nurse, a farmer, a cook, a kid in a team jersey, a businessman, a trucker, a churchgoer. Gore on top: rot, bone, torn clothes, a missing arm. Their outfit hints at their loot: a dead nurse may carry a bandage.
- **Killed zombies** leave a body you can search (10 minutes) for 0 to 1 items.

### 3. How a zombie chooses its move

1. If it can see you, step toward you.
2. Else if it heard a noise this turn or last, step toward where the noise came from.
3. Else step toward the last place it saw you or heard a noise, until it gets there.
4. Else wander: a step in a random direction about 1 turn in 3, never into deep water or through walls.

**Attacks:** a zombie that starts its turn next to you attacks instead of moving. Each attack: 50% miss, 35% scratch, 15% bite. Two zombies next to you attack twice.

**Grab:** after a bite, the zombie holds on: your next step away fails unless you hit it first or it dies. Shove (Melee 3) breaks a grab.

### 4. Damage to you

| Hit | Health | More |
| --- | --- | --- |
| Scratch | 10 | 10% chance of a deep cut |
| Bite | 20 | 50% chance of infection (see Infection), and 30% chance of a deep cut |

Gentle 5 / 15 and 25% infection; Harsh 15 / 30 and 75% (`bible.md`, Difficulty presets).

### 5. Your attacks

- **Melee:** face a zombie next to you (or 2 tiles off with a long weapon) and press A. Hit chance is 65% plus 5% per Melee level, so an average survivor with Melee 2 hits 75%. Gentle adds 10%, Harsh takes 10% (`bible.md`, Difficulty presets). Low sleep, drunk, low SAN, a broken arm and Nearsighted (guns only) lower it.
- **The bottom box** shows the target, your weapon, its wear and your chance before you swing (`bible.md`, Combat).
- **From behind, unaware:** a melee hit on a zombie that hasn't seen you, from behind or the side, is a sure, quiet kill (`bible.md`, Stealth bonus).
- **Fists:** 3 to 5 damage, 70% hit, never wear out.

| Weapon | Damage | Reach | Noise | Wear (hits) | Slots | Extra |
| --- | --- | --- | --- | --- | --- | --- |
| Kitchen knife | 6 to 9 | 1 | Quiet | 25 | 1 | |
| Slugger bat | 10 to 14 | 1 | Low | 40 | 1 | |
| Nail bat | 13 to 17 | 1 | Low | 35 | 1 | |
| Lead pipe | 11 to 15 | 1 | Low | 70 | 1 | |
| Fire axe | 16 to 22 | 1 | Medium | 60 | 2 | Forces doors |
| Machete | 11 to 15 | 1 | Quiet | 45 | 1 | |
| Hatchet | 10 to 14 | 1 | Low | 45 | 1 | Chops scrap wood |
| Golf club | 9 to 13 | 2 | Low | 20 | 1 | |
| Shovel | 9 to 12 | 1 | Low | 60 | 2 | Every hit shoves the zombie back a tile |
| Hockey stick | 7 to 10 | 1 | Low | 25 | 1 | +10% to hit |
| Meat cleaver | 14 to 18 | 1 | Quiet | 20 | 1 | |
| Crowbar | 7 to 10 | 1 | Low | 80 | 1 | Forces locks |

- **Noise of a swing:** Quiet is a ring of 2, Low 3, Medium 4.
- **Wear:** each hit uses one. At a quarter left, the wear mark turns red. At zero the weapon breaks and is gone. A weapon fix (duct tape) restores 30% of the full amount. Jury-rig (Fixing 5) restores it to full.
- **Guns:** aim at a zombie in range with A. Hit chance is 50% plus 5% per Guns level. Every shot is a ring of 15. Reloading takes a turn (the army veteran never spends one).

| Gun | Damage | Range | Shots | Extra |
| --- | --- | --- | --- | --- |
| Revolver | 30 to 40 | 5 | 6 | |
| 9mm pistol | 22 to 30 | 6 | 15 | |
| Hunting rifle | 45 to 60 | 10 | 4 | 2 slots |
| Pump shotgun | 30 to 40 each | 3 | 5 | Hits every zombie in a 3-tile cone and knocks them down for a turn; 2 slots |

The hunting bow is in the data but not placed in this slice.

### 6. Noise

From `bible.md`, Combat, Noise and The numbers.

- **Every action has a ring,** drawn on the map around you for one turn: sneak 1, walk 2, a quiet swing 2, a low swing 3, a medium swing 4, searching 2, opening a can with a knife 3, forcing a door 6, kicking a door or breaking a window 8, a gunshot 15.
- **Night** makes every ring 2 tiles bigger. **Walls** make a ring that starts inside a building 2 tiles smaller beyond the walls.
- **Zombies inside the ring** hear it and turn toward it (step 2 of their move).
- **Drunk** adds 2 to every ring. The Sneak skill takes 1 off walking per 2 levels, down to 1.
- **The boombox,** set down and turned on, makes a ring of 10 every turn for 6 hours, so zombies walk to it.

### 7. Sight and sneaking

- **Zombies see** in a cone in front of them, drawn faintly on the map: 90 degrees wide, 6 tiles by day and 3 at night. Walls and closed doors block sight. A lit flashlight is seen from 10 tiles at night, a lit cigarette from 5.
- **Sneak:** hold B while walking (Claude's call, for review: B does nothing else on the map). Each step takes 2 minutes and makes a ring of 1. Soft steps (Sneak 3) make plain walking a ring of 1 too.
- **Unaware:** a zombie that hasn't seen or heard you this turn is unaware. A small mark shows over a zombie that's aware.
- **Line of sight** (who can see what, through walls and doors) goes in `engine/` as a shared part: any game with sneaking could use it. The cone drawing stays in Life After.

### 8. Fleeing

- Hold B and press a direction while a zombie is within 3 tiles: you **run**. Each turn you move 2 tiles, with a ring of 4. You can run for 3 turns (the athlete 4, Bad Knee 2), then you must walk for 10 turns before running again.
- Running doesn't work while grabbed.
- Stairs and fences take Bad Knee an extra turn.

### 9. Needs at their low points

From `bible.md`, Needs, The numbers.

| Need | Drops | At the low point |
| --- | --- | --- |
| Hunger | About 2 an hour (a full bar lasts about 2 days) | At 0 you're starving: health drops 2 an hour, so you die about 2 days later |
| Sleep | About 3.3 an hour awake (older survivors 10% faster) | At 40 and below (about 18 hours awake) you're slow and clumsy: every action takes 25% longer and you hit 10% less. At 0 (about 30 hours) you pass out where you stand for 4 hours |
| Health | From hits, wounds, starving and infection | At 0 you die |
| SAN | See below | At 0 you lose control for 3 turns (see below) |

Gentle and Harsh change how long a full hunger bar lasts and when you pass out (`bible.md`, Difficulty presets). Scale the drops to match.

**Body cues:** a "Your stomach growls." line at 30 hunger, a yawn at 40 sleep, a limp on the sprite with a sprained ankle, and the phantoms (below).

**Healing:** health comes back only by resting (Part D: about 10 for a full night, 15 in a real bed; Gentle 15, Harsh 5) and by medicine. Waiting heals half as much as sleeping.

### 10. SAN

From `bible.md`, Needs, SAN and The numbers.

| Costs SAN | About |
| --- | --- |
| Your first zombie kill of the day | 5 (then 1 each) |
| Finding a dead person, or gore up close | 5 |
| Each hour outside at night | 2 |
| Being bitten | 5 |
| A day with no hot meal and no comfort | 5, at midnight |
| Passing out | 10 |

| Lifts SAN | About |
| --- | --- |
| Finding a keepsake | 5 to 10 |
| A mixtape on the cassette player | 3 an hour while it plays (you hear less: rings around you look 1 smaller, but zombies hear you as usual) |
| Pocket Pixel | 2 an hour while it plays |
| Chocolate | 3 |
| Kola King | 1 |
| Cigarette | 6 (and a craving) |
| Whiskey | 12 (and drunk for 2 hours) |
| Sleeping pills | 5 (and 8 hours of deep sleep, groggy for 2 hours after) |
| A warm meal at the hideout | 3 (Part D) |
| A full night's sleep | 5 (Part D) |

- **Brave:** fear and gore cost half. **Jumpy:** dark nights and surprises cost 1.5 times. Gentle halves every cost, Harsh makes it 1.5 times (`bible.md`, Difficulty presets).
- **At 0 SAN** you lose control for 3 turns: half the time you freeze (you do nothing), half the time you run from the nearest zombie. **Calm** only ever freezes. Then SAN comes back to 10.
- **Vices:** a Smoker starts hooked: without a cigarette each day, SAN drops 5 at midnight. Anyone who uses the same vice 3 days running gets hooked the same way. Drunk: -10% to hit and +2 on every ring. Groggy: actions take 25% longer.

### 11. Low SAN: phantoms and grit

From `bible.md`, Art, Low SAN.

- **From 50 SAN:** very light grit on the map, growing as SAN drops.
- **Phantoms:** from 50 SAN, now and then a figure that isn't there stands in a shadow at the edge of your sight, and goes when you look (step toward it). From 30, fake noise rings appear and fake "next step" marks show for zombies that aren't there. From 15, a phantom can stand in the street in daylight.
- **Uneasy lines:** your survivor's notes turn uneasy ("Something moved by the pump.").
- **Never hidden:** text, the top bar, real zombies, real next-step marks and usable things always stay readable, even at 0 SAN. A fake mark is drawn a little fainter than a real one so a careful player can tell.

### 12. Wounds

From `bible.md`, Combat, Wounds; items.md, Medicine.

| Wound | Comes from | Effect | Treat | Heals |
| --- | --- | --- | --- | --- |
| Deep cut | Scratches, bites, broken glass | Bleeding: 1 health every 10 minutes | A bandage or rag bandage stops it (5 minutes) | 3 days once bandaged |
| Sprained ankle | A fall (jumping a fence, running into a wall) | Each step costs 2 minutes; running is 1 turn shorter | A splint kit halves the time | 3 days |
| Broken arm | A bad fall, very rare in this slice | No 2-slot weapons or guns; -20% to hit | Needs a splint kit to heal at all (Field care: rags) | 7 days once splinted |
| Infected wound | A deep cut not cleaned within a day (20%) | 1 health an hour | Antibiotics, or rubbing alcohol before it sets in | 2 days on antibiotics |

- **Relievo painkillers** take away the slowdown from wounds for a day.
- **Medicine skill:** each level makes a bandage or painkiller work 10% better (more health back, faster healing). The nurse gets the most out of each item.
- **Rubbing alcohol or clean water** on a fresh cut within the day stops it getting infected.

### 13. Infection

From `bible.md`, Combat, Bites.

- A bite has a chance of infection (Standard 50%). You don't know at once.
- **6 hours later** you know: "You're burning up." The party card shows Infected.
- **From 12 hours,** health drops 3 an hour. Untreated, you die in about 2 days and the death screen says you turned.
- **Antibiotics** slow it: a dose stops the health drop for 24 hours. They don't cure it.
- **The cure** isn't placed in this slice.
- **Clean the bite (Medicine 5):** a bite treated with a bandage and rubbing alcohol or clean water within an hour has a 50% chance of not turning.

### 14. Skills grow with use

From `survivor.md`, Getting better and Abilities.

- **Uses that count:** a melee hit (Melee), a gun hit (Guns), a turn sneaking within 6 tiles of an unaware zombie (Sneak), treating a wound (Medicine), a pick, force, craft or weapon fix (Fixing), eating something you shouldn't with no harm and reading the field guide (Outdoors), eating a warm meal you cooked (Cooking, Part D), and nothing yet for Talk.
- **Uses per level:** 10 to reach 1, then 20, 35, 55, 80. Quick Learner needs 25% fewer; Stubborn 25% more.
- **The notebook says it** in a line: "You're getting better with a bat." No XP screen.
- **Abilities in this slice:** Shove, Sweep, Steady shot, Headshot, Soft steps, Vanish, Field care, Clean the bite, Jury-rig, Tracker (zombie tracks on the map), Comfort food (your own SAN; Part D). Hotwire, Read the sky, Stretch it, Read people and Silver tongue need cars, weather, companions or people, so they unlock and show but do nothing yet.

### 15. Eating what you shouldn't

- **Spoiled food:** 50% chance of getting sick (Weak Stomach: sick for twice as long). Sick: hunger drops twice as fast and sleep 50% faster for 12 hours. **Iron Gut** never gets sick.

### Wiring

- **The top bar** shows your weapon and ammo once a zombie is within 6 tiles.
- **Map marks:** a place where you saw 3 or more zombies is marked dangerous by itself.
- **Notes added:** the first zombie seen, the first noise ring, the first kill, the first bite, the first deep cut, low SAN, the first phantom, being hooked, a new skill level, a new ability.
- **Wait** (Start → Wait) now stops at once if a zombie comes into sight or a noise wakes you.
- **Death until Part D:** a plain screen, "You died. Day X." with **New world**. `la.run` is cleared.
- **Saves:** a new upgrade step adds every zombie (kind, health, tile, facing, what it's after), wounds, infection state and timers, skill use counts, vice hooks and the SAN state to `la.run`. An old Part B save upgrades by placing a fresh set of zombies from the seed, away from the survivor.

## Done when

- One shambler is easy, two is a fight, and four means you run, for a survivor with a bat and Melee 2 on Standard (`bible.md`, Combat, The numbers).
- A careful player can sneak through a street of shamblers by day; the same street at night with a flashlight on draws them.
- A gunshot pulls zombies from across a third of the section.
- An untreated bite that turns kills you in about 2 days.
- At every SAN level, text, the top bar, real zombies and real next-step marks stay readable at all three sizes.
- A tuning check: 20 bot runs per preset on 3 seeds, playing a simple careful plan (loot by day, wait out the night indoors, fight one at a time, run from three or more). Bring back how many days each lasted. Standard bots should usually reach day 4 to 7 without the hideout; if they all die by day 2 or all live past day 10, bring it back before tuning.
- `npm run check` passes at all three sizes.

## Not in this spec

- The hideout, builds, real sleep, night attacks, the death screen and best runs (Part D).
- Raiders, other people, companions, hordes, weather, the cure.
- Bloated zombies (they need sickness spreading, which comes with camps and people).

## Conflicts found

None.

## Open questions for the Developer to bring back (don't decide them in code)

- If holding B for sneak and B plus a direction for running are hard to tell apart on the phone, bring back what you saw in play. Don't move them to other buttons.
- If the next-step marks crowd the screen with many zombies, bring back a screenshot.
