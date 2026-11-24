# Spec 004: Slice part D, the hideout and the end

Status: approved (studio PR #134), ready to build · Written 2026-11-23 by the Game Designer · Game: Life After · To do: Spec 001, Part D

## In plain words

This part finishes the slice. You claim a building, board it up, build a bed and a few comforts, and sleep. Each night the game rolls for an attack, and the odds rise with your noise, your light and how long you stay. You play the attack out turn by turn inside your building, with one twist each time. When you die, the death screen tells the short story of your life, and each preset keeps its own best runs.

When it's done, the slice is whole: **survive a week alone**. At dawn on day 8 your survivor writes "A week. Still here." and the game goes on for as long as you last.

All numbers are a first pass for playtests, on Standard.

## Bible sections this spec relies on

| Source | Section | What it sets |
| --- | --- | --- |
| `bible.md` | Shelter | Claim and fortify, what you build, what brings attacks, you play attacks out, attacks must never be a chore, moving |
| `shelter.md` | (whole file) | Claiming, buildings, builds, wear, attack odds, how an attack plays out, twists, when you're away |
| `bible.md` | Items and crafting | Hideout storage, crafting (big builds need a workbench) |
| `items.md` | Bags (hideout storage); Crafting parts and first recipes | Crates, storage |
| `bible.md` | Time and seasons | Sleep 1 to 10 hours, 8 is a full rest, a noise can wake you |
| `bible.md` | Needs | Health heals about 10 a night, more in a real bed |
| `bible.md` | The map | A secret hideout (no raiders in this slice, but light and smoke still count) |
| `bible.md` | The run | One life, goal, death screen, seeded, difficulty presets, best runs |
| `survivor.md` | Traits; The 12 jobs | Light Sleeper, Heavy Sleeper; construction worker builds faster; homeless sleeps rough |
| `bible.md` | Tech | `la.run`, `la.record`, `la.version` |

## What is built today

Parts A to C: a new world, the builder, saves, the two sections, the clock, searching, the bag, crafting, the notebook, the map, zombies, fights, noise, sight, needs, SAN, wounds and infection. Death shows a plain screen.

## What to build

### 1. Claiming a hideout

From `shelter.md`, Claiming a hideout.

- Any building with a door that closes can be claimed. Stand inside with no zombie in the building and choose Start → **Claim this place**.
- The slice has one hideout at a time. Claiming a new one asks "Leave your old hideout?" and the old one becomes an ordinary building again, with its builds and storage still in it. Safe houses come later (`shelter.md`, More than one).
- On the map, the hideout shows a small home mark.
- **Buildings differ** (`shelter.md`, the buildings table): a home is easy to hold; the church has thick walls (boards there take half damage) and the bell tower; the school has lots of room and many doors; the motel faces the highway; the gas station has a glass front (its windows can't be boarded, only blocked with a crate). The farmhouse isn't in this slice.

### 2. Builds in this slice

From `shelter.md`, What you can build. You stand where you want a build and make it there (builds aren't carried). Big builds need a workbench somewhere in the hideout; Jury-rig (Fixing 5) doesn't. Everyone knows every build in this table; they aren't recipes.

| Build | Needs | Time | Workbench | What it does |
| --- | --- | --- | --- | --- |
| Workbench | 4 scrap wood, nails, a hammer | 2 hours | No | Needed for the builds marked Yes |
| Board-up | 2 scrap wood, nails, a hammer | 30 min | Yes | Blocks a door or window. 40 board health |
| Can alarm | 3 tin cans, rope | 15 min | No | On a door or window: wakes you when something touches it |
| Spike trap | 2 scrap wood, nails | 1 hour | Yes | Hurts the first zombie that steps on it for 15, then needs a reset (10 min) |
| Fire trap | A firebomb, rope | 30 min | No | Burns a doorway for 5 turns when tripped: 10 a turn to anything in it, a ring of 8 |
| Real bed | A mattress (2 slots, or dragged), 2 scrap wood | 1 hour | No | Sleep heals 15 a night instead of 10 and lifts SAN a little more |
| Storage crate | 3 scrap wood, nails | 30 min | Yes | 12 storage slots |
| Blackout covers | 2 rags or a blanket, nails | 30 min a window | No | No light shows from that window at night |
| Stove | 4 metal scrap, a pipe | 2 hours | Yes | Cook indoors with small smoke |
| Radio corner | A battery radio, batteries | 30 min | No | Plays a mixtape for the whole hideout (SAN, see below). Warnings come later with weather |

- **Construction worker:** board-ups and big builds take half the time. **Steady Hands** halves small crafts as before.
- **Metal scrap** and **mattresses** are new finds in this part: metal scrap in garages, PartsPro and car trunks; mattresses in homes and the motel. Dragging a mattress: each step costs 3 minutes and makes a ring of 3.
- **Wear:** boards lose 5 health on a rainy day (no weather yet in this slice) and in attacks. Traps get used up. Beds, stoves, crates and covers only break in attacks (`shelter.md`, Wear depends on the build).
- **Fix a board:** 10 minutes and a nail, +15 board health, up to 40. In an attack it takes your turn.
- **Strip a build:** 15 minutes gets back half its parts.

### 3. Cooking

- With a stove at the hideout (or any fire for the line cook), canned meals can be eaten warm: +5 hunger and +3 SAN, and the Cooking skill counts the use.
- An open fire outside or inside (rags and scrap wood, 15 minutes) cooks too, but makes big smoke.
- **Comfort food (Cooking 5):** a cooked dinner lifts your SAN by 8 instead of 3.

### 4. Sleep

From `bible.md`, Time and seasons, Sleep.

- Start → **Sleep**: pick 1 to 10 hours. 8 hours is a full rest: the sleep bar refills about 12.5 an hour.
- **Health heals** about 10 for a full night (15 in a real bed), less for a nap, by the hour. Gentle 15, Harsh 5 for a full night (`bible.md`, Difficulty presets).
- **SAN:** a full night's sleep lifts SAN by 5, in a real bed 8.
- **Sleeping rough** (anywhere that isn't the claimed hideout): heals half, costs 5 SAN (the homeless never pay it), and zombies wandering in the area can find you.
- **Waking:** a can alarm, an attack or a noise ring of 6 or more that reaches you wakes you. Light Sleeper always wakes before anything reaches you. Heavy Sleeper wakes only to an alarm or a hit.

### 5. What brings an attack

From `shelter.md`, What brings an attack. At midnight, if you're at the hideout or have one, the game rolls once.

| Adds to the night's odds | About |
| --- | --- |
| Base | 5% |
| Each noise ring of 6 or more within 20 tiles of the hideout that day | +5% |
| Each gunshot within 20 tiles that day | +10% |
| Light showing from an uncovered window at night (a flashlight, a fire, a lamp) | +10% |
| Cooking smoke by day: a stove +3%, an open fire +8% | |
| Each night in a row you've stayed | +2% |

- Capped at 60%. Gentle halves the odds, Harsh multiplies them by 1.5 (`bible.md`, Difficulty presets).
- A quiet, careful player should see about one attack a week, a loud one every few nights (`shelter.md`).
- **Who comes:** zombies only in this slice, 2 to 6 of them, plus 1 more for every 10% the odds were above 20%. They arrive at the hideout's doors and windows over a few turns between midnight and 4 AM.

### 6. How an attack plays out

From `shelter.md`, How an attack plays out.

1. **Woken:** a can alarm or Light Sleeper wakes you. Without either, the attackers get a free turn first (Heavy Sleeper: two).
2. **Set up:** one free turn to grab a weapon or move.
3. **The fight:** turn by turn inside your building. Zombies push at boards: each zombie at a board takes 5 board health a turn. At 0 the board breaks and the doorway or window is open. You can hit through a boarded window (zombies there can't hit back), fix a board, fall back a room, light a fire trap, or slip out a back door or unboarded window with what you carry.
4. **One twist** per attack, drawn from the list below. A big attack (5 or more zombies) has a 1 in 5 chance of a second twist (`shelter.md`).
5. **The end:** when every attacker is dead or you've slipped out.

**Twists in this slice** (from `shelter.md`; the ones that need people or companions come later):

- A weak board gives way early: one board starts at half health.
- A zombie was already inside: one stands in a room you didn't check.
- The power flickers on: the lights come on for 10 turns, lighting the whole house and drawing 2 more.
- The fire trap spreads: if a fire trap goes off, it spreads to the next room unless you put it out (a turn and water or a blanket).
- One of them was someone: a zombie wears the face of a person from a note or photo you found. It costs 5 SAN to put down.

**Settled in one line:** when every door and window is boarded or trapped, the attack is 3 zombies or fewer, and every board has 20 or more health, it's settled without play: "Two dead pushed at the back door and gave up." Boards still take the damage. You keep sleeping.

**Short:** an attack should take about 3 to 5 minutes of play. If the tuning check shows attacks running past 8 minutes, bring it back.

### 7. When you're away

From `shelter.md`, When you're away. If the roll comes up while you're out of the section or sleeping rough:

- Boards take the damage of the zombies that came, and traps go off.
- If a board broke, 1 or 2 zombies are inside when you get back, standing still until they see you.
- A short report shows when you walk in: "Someone tried the back door. The board held." or "The front window's open."

### 8. Storage

- Storage crates hold 12 slots each. A on a crate opens it beside your bag; L and R flip between them.
- Items dropped on the hideout floor stay as piles. Nothing steals from your hideout in this slice.

### 9. The death screen

From `bible.md`, The run, Death screen.

- **A short life story,** a few lines in the notebook's hand: the survivor's name, job and want, then "Lasted 6 days, 14 hours." and how they died.
- **How you died:** starved; killed by the dead (where: "on Elm Street", "in the Starlite Motor Inn"); bitten and turned; bled out; an infected wound.
- **Big moments** in this slice: the first kill, claiming a hideout (and moving), the first attack held, a keepsake found, a skill reaching 3 or 5, the week mark.
- **The seed and the preset,** at the bottom.
- **Rows:** **New world**, **Same seed** (starts the setup with this seed, preset and season filled in), **Best runs**.
- `la.run` is cleared before the screen shows. There's no going back (`bible.md`, One life, one world).

### 10. Best runs

- `la.record` keeps the 5 best runs for each preset: days and hours lasted, name, job, how they died, the seed and the date played. Each preset has its own list (`bible.md`, Difficulty presets, Best runs).
- Title → Best runs shows the three lists, flipped with L and R.
- `la.record` survives a death and a new world. Export and Import carry it too.

### 11. The week mark

At 6 AM on day 8, a note: "A week. Still here." It's a big moment on the death screen. The game goes on. Nothing else changes.

### Wiring

- **Start menu rows:** Party, Notebook, Wait, Sleep, Claim this place (only when you can), Save code, Quit to title.
- **Notes added:** the first claim, the first build, the first night in the hideout, the first attack, the first attack settled in one line, the first night sleeping rough, the week mark.
- **Saves:** a new upgrade step adds the hideout (building, builds and their health, storage, nights in a row), the night's attack state (mid-attack saves resume the fight on the same turn), and the big moments list to `la.run`, and creates `la.record` if it's missing. An old Part C save upgrades with no hideout.
- **Bible update for the Designer:** `bible.md`, Tech, the `la.record` row says "Best days survived". It will say "The 5 best runs for each preset" (done in the same PR as this spec).

## Done when

- A survivor can claim a home, board it, build a bed and sleep through a night.
- The attack odds rise and fall with noise, light, smoke and nights in a row, as in the table.
- An attack plays out in the building with its twist, and a small one with full defenses settles in one line.
- Death clears the run and shows the life story; the best-runs list for that preset updates.
- A tuning check: 20 bot runs per preset on 3 seeds with a simple careful plan (loot by day, claim a home on day 1, board it, sleep 8 hours, keep the noise down near home). Bring back days lasted and attacks per week. Standard bots should usually pass the week mark; Gentle almost always; Harsh about half the time. If not, bring it back before tuning.
- `npm run check` passes at all three sizes, including a save made mid-attack.

## Not in this spec

- Companions, settlers, other people, raiders, traders.
- Safe houses, root cellars, lockboxes, lookouts, rain barrels, gardens, coops (they need weather, raids, farming or people).
- Moving with a car.

## Conflicts found

None.

## Open questions for the Developer to bring back (don't decide them in code)

- If a full night's sleep often ends in an attack and that feels like a chore in play, bring back how often it happened in the tuning check.
