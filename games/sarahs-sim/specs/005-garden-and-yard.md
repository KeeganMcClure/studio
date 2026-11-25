# Spec 005: Garden and yard

Status: draft, for Keegan's review · Written 2026-11-25 by the Game Designer · Game: Sarah's Sim · To do: Specs (Garden and yard)

Numbering follows the bible's spec order (To do, Specs). Numbers 001 to 004 are kept for the Philly home and decorating, Outfits, Creator and Building, which come first.

## In plain words

Sarah has a real green thumb, so her back yard in the game is something she designs and grows. She lays it out like a room, with garden beds, paths, a fence, a patio and later a little greenhouse. Then she plants seeds that grow over real days. Herbs are ready in a day or two, veggies and flowers in under a week, and big shrubs in about a week. Every time she opens the game, something has sprouted, bloomed or ripened.

The garden can't fail. A thirsty plant droops and perks right back up when she waters it, and nothing ever dies. The real seasons show outside. Spring brings tulips and peas, summer brings sunflowers and tomatoes, fall brings pumpkins and leaves to rake, and in winter the beds rest under snow while the greenhouse and her houseplants keep going. What she grows goes into Keegan's cooking, and the flowers she cuts can go in a vase inside.

Eight short chores, each under a minute, sit around the home: mowing, weeding, watering, raking, shoveling snow, dishes, vacuuming and folding laundry. In Life mode they pay a few coins. In Sandbox they're just for fun.

## Bible sections this spec relies on

The bible wins over this spec (`studio-bible/studio.md`, Specs). Rules are linked here and not written out again.

| Source | Section | What it sets |
| --- | --- | --- |
| `games/sarahs-sim/bible.md` | Play → Garden | The yard as a design space, what she grows, how fast, never dies, growth while away, seasons, the starter plant list, the eight chore minigames |
| `games/sarahs-sim/bible.md` | Play → Reasons to come back | Real date for seasons; real time of day; idle life (Sarah gardening and watering) |
| `games/sarahs-sim/bible.md` | Play → Life mode | Needs pause while away; coins and prices (seeds 5 to 20 a packet, chores 20 to 40); gardening pays no coins; nothing is lost |
| `games/sarahs-sim/bible.md` | Play → Memory book | The Garden chapter's 10 moments and its reward steps |
| `games/sarahs-sim/bible.md` | Play → The cats | The cats wander, react and never come to harm; Ralph leaves the room when something loud starts |
| `games/sarahs-sim/bible.md` | Play → Cooking | Garden veggies stand in for store-bought ones and add a sparkle |
| `games/sarahs-sim/bible.md` | Modes | Sandbox has everything unlocked with no days, needs or money; Life has unlocks |
| `games/sarahs-sim/bible.md` | Decorating | Catalog, placing, picking a placed piece, swatches and paint mode. The yard uses the same tools |
| `games/sarahs-sim/bible.md` | Controls and screen; Art | Touch first with drag and drop; the isometric view; mood; Craft rules |
| `studio-bible/art-style.md` | All | Art drawn in code, Craft, Quality bar, Animation, Shared Shelf first |
| `studio-bible/ui.md` | Screen craft | Readable text, no cut-off names, color never the only label |
| `studio-bible/play.md` | Picks from a pool don't repeat | Which plant a visitor or idle moment talks about |
| `studio-bible/saves.md` | All | One autosave slot, save version and upgrade steps, export and import |
| `studio-bible/studio.md` | Screen list; Playtests; No real brands | Screen rows, the playtest after the first part with new screens, plain names on seed packets |

## Screens this spec adds

These rows go into the bible's Screens table in the same PR as this spec.

| Screen | Mockup |
| --- | --- |
| Yard (garden) | **To draw** before part A is built |
| Minigame (the eight chores share one frame) | **To draw** before part D is built, with mow as the sample |

## Part A: The yard as a design space

**What it is.** The yard is part of the home's lot, like another room with no roof. It's on the same isometric grid and uses the same placing tools as the Decorating section of the bible.

- **Getting there:** she walks out the back door, or taps a Yard button on the home screen. Both go to the same yard.
- **The Philly yard:** behind the Philly home, sized and laid out from Keegan's photos the same way the house is (part of the decorating spec's work). It starts with a lawn and whatever their real yard has. *Claude default.*
- **Other homes:** every empty lot has a yard around the house she builds on it (spec 004 sets the lot sizes).
- **Yard catalog tabs:** beds and planters, paths and patio, fences and gates, garden decor (birdbath, bench, lights and so on) and structures (greenhouse, shed). They use the same cards, swatches and paint mode as indoor pieces.
- **Ground:** each tile is lawn, soil, a path or a patio. She paints ground the way she paints a floor in Build. Beds and planters are pieces that hold plants.
- **Pots go anywhere:** a pot or planter can sit on the patio, a porch, a windowsill or a shelf indoors. Houseplants are plants in pots.
- **Greenhouse:** a structure she places on the lawn. It's a small walk-in room with planting tables. Its plants grow all year. In Life mode it costs coins like a big piece (*Claude default*), and placing it is a Garden chapter moment.
- **The cats** can wander into the yard. They nap in sunny patches, sniff the plants and watch birds. They never leave the lot, and nothing in the yard can hurt them (bible, The cats).

**Done when:** she can lay out a yard with beds, a path, a fence and a patio by dragging pieces; change colors with swatches or paint mode; walk between the house and the yard; and see it all in an isometric view at 375 × 667 with nothing cut off.

## Part B: Plants and how they grow

**Planting.** She picks a seed packet from the Seeds tab (or a potted plant from the Plants tab), drags it onto a bed, planter or pot, and it goes in. In Life mode a packet costs coins (bible, Life mode, Prices). One packet plants one spot.

**Growth stages.** Every plant goes through four stages, each drawn on its own:

1. Seed: a little mound with a marker stick that has a drawing of the plant
2. Sprout
3. Growing
4. Ready: in bloom for flowers, ripe for veggies and herbs, full size for shrubs, vines and houseplants

The days to Ready follow the bible (How fast): herbs and greens 1 to 2 real days, veggies and flowers 3 to 5, shrubs and vines about 7. Each plant's exact number goes in its data row. The stages are split evenly across those days.

**Water** (*Claude default*, keeping the bible's rule that growing goes on while she's away but thirst pauses):

- Each plant has a water level. It runs down only while the game is open, from full to empty over about 20 minutes of play.
- When it's empty, the plant droops and stops growing until she waters it. Then it perks up right away, with a little bounce and sparkle.
- While she's away, growing keeps counting in real time, and the water level doesn't move. So she always comes back to plants that have grown and are still happy.
- She waters by tapping a plant with the watering can, or by playing the Water minigame (part D), which waters the whole yard.
- Rain in spring and summer (drawn as a soft shower, sometimes, when she opens the game) fills every outdoor plant. *Claude default.*
- A plant never dies (bible, Never dies).

**Harvest and cutting.**

- Veggies and herbs: tapping a Ready plant picks it. Her harvest goes to a pantry shelf in the kitchen, which the Cooking spec reads. Herbs and greens regrow from Sprout. Other veggies leave the bed empty for a new seed. *Claude default.*
- Flowers: tapping a Ready flower offers **Cut** or **Leave**. Cut makes a vase of that flower, which goes into her catalog as a small decor piece she can put anywhere indoors. Leave keeps it blooming in the bed. *Claude default.*
- Shrubs, vines and houseplants stay Ready and stay put. She can still move or put them away like any piece.

**Seasons** (bible, Seasons; real date on her phone, northern hemisphere to match Philly):

| Season | Dates | Yard look |
| --- | --- | --- |
| Spring | Mar 20 to Jun 20 | Fresh green lawn, blossoms, light rain sometimes |
| Summer | Jun 21 to Sep 21 | Deep green lawn, long sunny days |
| Fall | Sep 22 to Dec 20 | Leaves on the lawn, gold and red trees |
| Winter | Dec 21 to Mar 19 | Snow on the lawn, beds and fences |

- Outdoors she can only plant seeds of the current season. The greenhouse and indoor pots take the all-year list at any time.
- When winter begins, the outdoor beds rest under snow. Plants that were still growing stop where they are, under the snow. In spring they pick up again from the same stage. *Claude default.* Shrubs and vines show a bare winter look and leaf out again in spring.
- Winter plants (holly, poinsettias, winter greens, the little potted pine) go in pots and planters on the patio, the porch and indoors, and keep growing in winter.
- She can decorate the yard for winter and the holidays with the Holiday tab, which comes from the Holidays spec.
- Moving from one season to the next happens on its own on the real date. Nothing is lost in the change.

**Sandbox** (bible, Garden, *Claude default*): every seed and plant is free, with no water level. She can place any plant at any stage, including Ready, in any season. The yard still shows the real season outside, but every season's plants can go in.

**Life mode:** seeds cost coins, water levels run, growth follows real days, and the Garden chapter's moments and rewards unlock (part C).

**Plant data.** One row per plant in the game's data file, so a new plant is a new row:

| Field | Example |
| --- | --- |
| id | `tomato` |
| Name on screen | Tomatoes |
| Kind | veggie / herb / flower / shrub / vine / houseplant |
| Season | summer (or `all` for the greenhouse and indoor list) |
| Days to Ready | 4 |
| Harvest | pantry item `tomato`, regrows: no |
| Cut flower | (flowers only) the vase piece id |
| Seed price | 10 |

The starter list is the bible's table (Garden, *Claude default*), about 30 plants. Keegan may swap in plants Sarah really grows. Seed packets use plain names and no brands (`studio-bible/studio.md`, No real brands).

**Done when:**

- A seed planted in Life mode goes through all four stages over its real days.
- It shows its growth after the phone's clock moves forward, with the game closed.
- It droops after about 20 minutes of play without water and perks up when watered.
- It never dies.
- A harvest goes to the pantry.
- A cut flower makes a vase she can place.
- Winter snow covers the beds on Dec 21, and the plants pick up again in spring.
- Sandbox places a Ready plant straight away.

## Part C: Garden moments and rewards

The Garden chapter's 10 moments (bible, Memory book) trigger here, each recording the real date it happened:

| Moment | Triggers when |
| --- | --- |
| First seed planted | Any seed goes in |
| First sprout | Any plant reaches Sprout |
| First bloom | Any flower reaches Ready |
| First harvest | Any veggie or herb is picked |
| A full bed | Every spot in one bed holds a Ready plant at once |
| A houseplant grows up | A potted houseplant reaches Ready |
| The greenhouse goes up | A greenhouse is placed |
| Snow on the beds | The first time she opens the game in winter with at least one bed placed |
| A pumpkin grown in fall | A pumpkin reaches Ready |
| Plants from all four seasons grown | At least one plant of each season has reached Ready, at any time |

- The rewards come in steps, as the bible sets (a piece at 3 moments, more at 6, the centerpiece at 10). The reward pieces are listed in the bible's Memory book table.
- The memory book is shared by every mode (bible, Memory book), so these moments count in Sandbox too. Only the reward pieces wait for Life mode, since Sandbox already has every piece (spec 007).
- Idle life (bible, Reasons to come back): when she opens Life mode in the morning or daytime, Sarah may be found watering or weeding out back. This spec gives the yard spots and animations for it. The Life mode spec picks when it happens.

**Done when:** each moment triggers once, on the right action, with its date. The reward pieces unlock at 3, 6 and 10 moments.

## Part D: Chore minigames

The eight chores in the bible's table (Garden, Chore minigames) share one frame, so a new chore is mostly new art and one rule.

**The frame:**

- Each one is a full screen, 30 to 60 seconds long, and played with one thumb by dragging or holding.
- The isometric spot it's about (the lawn, the sink, the laundry basket) fills the screen, zoomed in.
- A small bar at the top shows how much is done, with an icon and a word next to it (`studio-bible/ui.md`, color is never the only label).
- There's no timer to beat and no way to fail. It ends when the job is done, or when she taps Done.
- At the end it shows a tidy rating of 1 to 3 sparkles for how clean the job is. In Life mode it pays 20, 30 or 40 coins for 1, 2 or 3 sparkles (bible, Coins and prices).
- **Pays once a day** (*Claude default*): each chore pays coins once per real day. She can play it again any time for fun, with no coins, so there's no grind.

**How she finds them** (Life mode):

- A chore shows up on its spot as a soft sparkle when it's ready to do. The lawn grows long after a few real days. Dishes stack up after Keegan cooks. The laundry basket fills, and so on.
- Tapping the spot asks **Do it / Not now**, with the cursor on Not now.
- Seasonal chores only show up in their season: mowing and weeding from spring to fall, raking in fall and shoveling snow in winter.
- Nothing bad happens if she leaves a chore. Long grass is just long grass (pillar 3).
- In Sandbox, the chores are on a Chores button in the Start menu, for fun, with no coins.

**Each chore's rule** (the bible's "How it plays", made exact):

| Chore | Rule | Fun bits |
| --- | --- | --- |
| Mow | Drag the mower. Mowed tiles turn to light and dark stripes. Done at 90% mowed | Clean stripes earn 3 sparkles. Ralph leaves the yard when it starts (bible, The cats) |
| Weed | Weeds pop up in the beds. Drag each one up and off the screen | A stubborn one takes two tugs |
| Water | Hold the can over each plant until it perks up | Waters the whole yard and fills every outdoor plant |
| Rake leaves | Drag to sweep leaves into one pile | When it's done, a cat may jump in the pile and scatter a few. That doesn't lower the rating |
| Shovel snow | Drag along the path to the door to clear it | Snow piles up at the edges |
| Dishes | Drag to scrub each plate, then tap to rinse and stack | The stack wobbles but never falls |
| Vacuum | Drag over the floor until the dust is gone | Ralph slowly leaves the room on screen as soon as it starts |
| Fold laundry | Drag each piece to fold it in two steps, then onto the stack | Sometimes a cat is asleep in the basket and has to be lifted out first |

**Done when:**

- All eight chores play from start to finish with one thumb at 375 × 667 and 320 × 480.
- Each shows its sparkle rating and pays once a real day in Life mode.
- The seasonal chores show up only in their seasons.
- Every chore can be played in Sandbox from the Start menu.

## Art

- Each plant needs four stage drawings, at the bible's Rich detail level (Decorating, furniture-detail-v1), with soft shadows and dark outlines. Winter adds a snow-covered or bare look for beds, shrubs and vines. Spring rain, fall leaves and winter snow are overlays on the yard.
- The yard pieces (beds, planters, paths, patio tiles, fences, gates, a birdbath, a bench, string lights, a greenhouse and a shed) follow the Decorating rules: each gets 4 to 6 swatches plus paint parts.
- The minigame screens use the same palette and tray look as `look-iso-v1`.
- Look in the Shared Shelf first for generic plants, fences and weather before drawing new ones (`studio-bible/art-style.md`, Shared Shelf).

## Saves

- The yard (its pieces and ground), each plant's id, stage, growth start time and water level, the pantry, the chores' last paid day, and the Garden moments go in the home's save under the planned `ss.` prefix (bible, Overview).
- Growth time is saved as real timestamps, so closing and reopening never resets a plant.
- If the phone's clock jumps backward, plants simply hold where they are and never shrink. *Claude default.*
- This is the first garden data, so it starts at the game's first save version. Any later change adds an upgrade step (`studio-bible/saves.md`).

## Build order

1. Draw and approve the **Yard** mockup.
2. Part A (the yard space). Keegan plays it on the phone (`studio-bible/studio.md`, Playtests).
3. Parts B and C (plants, seasons, moments). These add rules and content, so they can go ahead after part A's notes.
4. Draw and approve the **Minigame** mockup, then build part D.

Part A needs the decorating spec's placing tools and the Building spec's lots and walls built first.

## Claude defaults to confirm

These follow the bible but fill in details it doesn't set. Keegan can change any of them:

- Water lasts about 20 minutes of play, and spring and summer rain sometimes waters everything.
- Herbs and greens regrow after picking. Other veggies leave the spot empty.
- Cut flowers become a vase piece for indoors.
- Plants under winter snow pick up again in spring at the same stage.
- Each chore pays once per real day, and replays are just for fun.
- The cats wander the yard but never leave the lot.
- Sandbox has a Chores button in the Start menu.
