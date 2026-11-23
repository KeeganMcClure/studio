# Spec 002: Slice part B, the town

Status: draft for Keegan's review · Written 2026-11-23 by the Game Designer · Game: Life After · To do: Spec 001, Part B

## In plain words

This part builds the world you scavenge in. A seed makes two map sections, the houses and the highway strip, each 60 × 60 tiles with about 15 to 20 places to search. Time moves only when you act. Day turns to night. You search fridges, closets and car trunks, open locks, fill your bag, craft a few things and keep a notebook. L opens the bag and R opens the map.

When it's done you can wake up in a house, walk the street, cross to the highway strip, loot it for a few days and watch the town run dry. There are no zombies yet (Part C) and nowhere to sleep safely (Part D), so hunger and sleep bars show but don't hurt you yet.

All numbers here are a first pass for playtests (`bible.md`: "Exact numbers are tuned in playtests").

## Bible sections this spec relies on

| Source | Section | What it sets |
| --- | --- | --- |
| `studio-bible/controls.md` | Buttons | A acts, B back, Start menu; a game can give L/R and Select their own jobs |
| `studio-bible/art-style.md` | Craft | 16 px tiles, 3/4 top-down |
| `bible.md` | Setting | 1990s, low tech, look-alike brands, Midwest farm county |
| `bible.md` | The map | Sections, the generator, what comes back, first slice, getting around, learning the map, the world runs down |
| `bible.md` | Time and seasons | The clock, dawn and dusk, sleep, travel, season length, menus stop the clock, seasons |
| `bible.md` | Controls and screens | Buttons, top bar, bag |
| `bible.md` | Items and crafting | Bag slots, crafting, searching, locks, food spoils, medicine |
| `items.md` | (whole file) | Every item, recipe, bag and find |
| `bible.md` | Art | Baseline frame, neon at night, usable things glow cyan |
| `survivor.md` | The 12 jobs; Traits | Starting items and extras; Steady Hands, Strong Back, Bad Back, Night Owl, Nearsighted |
| `bible.md` | Difficulty presets | Loot and ammo amounts |

## What is built today

Part A: the title, a new world, the builder, saves and the save code. The survivor stands in a stand-in room. This part replaces it.

## What to build

### 1. The two sections

Both come from the world seed. Each is 60 × 60 tiles, walked tile by tile.

**Houses section:** 3 or 4 residential streets in a loose grid, a park with a shed, and:

- 12 to 15 homes (small ranch, two-story, trailer), each on a lot with a yard, some with a garage or a car in the driveway.
- **Lincoln Elementary** (a school: classrooms, a nurse's office, a cafeteria, a library).
- **First Grace Church** (pews, an office, a basement food pantry).

**Highway strip section:** a two-lane highway through the middle, parking lots, dead cars along the road, a field edge, and:

| Place | Look-alike of | Good for |
| --- | --- | --- |
| Star Fuel gas station | A 90s gas station and snack shop | Snacks, sodas, water, batteries, lighters, road maps |
| Starlite Motor Inn (8 rooms) | A roadside motel | Bags, first aid, bits in each room |
| Bargain Barn | A big-box store | Lots of everything; a locked sporting goods counter |
| Crossroads Travel Plaza | A truck stop | Jerky, coffee, a CB radio, maps |
| Big Bun Burgers | A fast-food stand | Little: most food spoiled |
| Reel Time Video | A video rental store | VHS tapes, candy, a keepsake |
| Lucky's Liquor | A liquor store | Whiskey, cigarettes |
| Gold Mine Pawn | A pawn shop (locked) | A gun, tools, a cassette player |
| PartsPro auto parts | An auto parts store | Duct tape, rope, gas cans, tools |
| Suds City laundromat | A laundromat | Rags, quarters (worthless), a bag left behind |
| 3 to 4 roadside homes | | Like the houses section |

The generator picks 15 to 20 places per section from these lists, so not every place is in every world. The houses section always has at least 10 homes; the highway strip always has the gas station and Bargain Barn.

**Buildings:** each has a door that shows on the map, rooms inside, and search spots in each room. Going through a door either fades the roof or opens an inside map; the Developer picks. Doors and windows are tiles the shelter and the noise rules use later.

**Usable things glow cyan** (`bible.md`, Art): a door you can open, a search spot not yet searched, a car you can search.

**Neon:** the Star Fuel sign, the Starlite sign and the Big Bun sign still glow at night, dead and faded by day.

**Brands:** only the made-up names above and in `items.md`. Real brand names and logos never appear.

### 2. Getting between sections

- The highway leaves the houses section on one edge and reaches the highway strip on its edge. Walking off that edge opens the **road map** (see Map screen) and asks "Walk to the highway strip? About 3 hours." or "Bike? About 1 hour." when you have one.
- Travel costs the time shown, and the clock runs (hunger and sleep drop as usual). You arrive at the matching edge. No road events in this slice.
- **Bikes** are found in some garages (about 1 in 4 homes with a garage). A bike is not carried: you ride it between sections and it waits where you leave it, marked on the map. Inside a section you walk.
- **Cars** are scenery to search (trunk, glovebox) in this slice. None run.

### 3. The clock

From `bible.md`, Time and seasons, The clock.

- **Time moves only when you act.** 1 in-game minute per step. Looking, menus, the bag and the map stop the clock.
- **Action times:** search a spot 10 minutes, eat 10, bandage 5, pick a lock 20, force a lock 5, a small craft 15, a fight turn 1 minute (Part C), a big build 1 to 2 hours (Part D).
- **Steady Hands** halves locks, searching and crafting. The **store clerk** halves searching in Star Fuel, Bargain Barn, Crossroads, Reel Time, Lucky's, PartsPro and Gold Mine. The **teacher** halves the time to learn a recipe from a book.
- **Day and night:** dawn is 6 AM. Dusk is 9 PM in summer, 7 PM in spring and fall, 5 PM in winter. Dusk and dawn each fade over an hour of game time.
- **Days and seasons:** the run starts at 7 AM on day 1 of the starting season. A season is 14 days, then the next season starts (Spring, Summer, Fall, Winter).
- **Wait:** Start → Wait lets you pass 1 to 10 hours where you stand. It's a Part D sleep without the rest, and it's how you sit out the dark. Part C makes it risky.

### 4. The top bar

As the bible's Controls and screens, Top bar, sets it (mockup `04-look-street-rough-v1`): a framed card with your survivor's face, the day number, clock (12-hour, "7:40 AM"), the four need bars (hunger, health, sleep, SAN) each with an icon and label, and a small season mark, with the section's name on a tab under it. In this part the bars show but only hunger and sleep move (see Needs below). Your weapon and ammo show only in fights (Part C).

### 5. Night

- After dusk the map is dark, drawn with `engine/light.js`: dim and readable, with pools of light at neon signs, fires and your flashlight.
- **You see** 4 tiles around you at night without a light, 6 with Night Owl, 2 with Nearsighted. A lit flashlight shows a 7-tile cone in front of you. By day you see the whole screen (Nearsighted: things beyond 6 tiles are blurred shapes).
- **Flashlight:** A on the flashlight in the bag turns it on or off. One pair of D batteries lasts 8 hours lit. Part C makes the light draw zombies.

### 6. Searching

- Stand facing a search spot and press A. It takes 10 minutes (with the time cuts above) and shows what you found in a small list: take one, take all, or leave.
- **Spots by room:** a kitchen has a fridge, a pantry and cabinets; a bathroom a medicine cabinet; a bedroom a closet and a nightstand; a garage a workbench and shelves; a car a trunk and a glovebox. Stores have shelves, a back room and a register.
- **What's in a spot** fits the place (items.md, "Where you find it"). About 1 spot in 3 is empty. A spot holds 0 to 3 items.
- **Weeks after:** fridges hold spoiled food. Spoiled food can be eaten (Part C: a chance to get sick).
- **A searched spot stays empty** (`bible.md`, The map, What comes back). It stops glowing.
- **Amounts by preset:** Gentle has 1.3 times the items of Standard, Harsh 0.7 times. Ammo is 1.5 times on Gentle and half on Harsh (`bible.md`, Difficulty presets).
- **How much food:** each section holds about 25 to 35 meals' worth of food on Standard, so the two sections feed one survivor for about a season.
- **Guns are rare:** at most one gun per section, plus the locked counter at Bargain Barn (a pump shotgun) and the pawn shop case (a revolver or 9mm). Ammo turns up a little more often than guns.
- **Bodies:** a few dead people lie where they fell (in cars, in yards). Searching a body takes 10 minutes and finds what they carried: maybe a bag, a worn weapon, some food, a note or a keepsake.

### 7. Locks

From `bible.md`, Locks.

- Some doors, the pawn shop, the Bargain Barn gun counter, some car trunks and the church office are locked.
- **Key:** some keys turn up in searches ("Church office key"). A key opens its lock with no roll.
- **Pick:** needs lockpicks, or Fixing 3 without them. 20 minutes, quiet. Chance: 40% plus 10% per Fixing level. A failed pick costs the time and you can try again.
- **Force:** 5 minutes, loud (a noise ring of 6 tiles, Part C). Needs a crowbar, a fire axe or a hammer; it wears the tool. Without a tool you can kick a door (10 minutes, a ring of 8). Forcing breaks the lock, so that door no longer locks.

### 8. The bag

From `bible.md`, Bag; items.md, Bags.

- **L** opens the bag and stops the clock. A grid: pockets are one row of 4 slots (Strong Back +2, Bad Back -2), and a worn bag adds rows (fanny pack +2, school backpack +6, duffel bag +8, hiking pack +10). You can wear one bag.
- **Slots:** most items take 1 slot; a few take 2 (`items.md`). **Stacks:** food, medicine and crafting parts stack up to 5 in a slot; ammo up to 30; weapons, tools, bags and keepsakes don't stack.
- **Each square** shows the pixel icon, a count, and a wear mark for weapons and tools.
- **A** on an item opens its actions: Use or Eat, Equip (weapons), Drop, Read (books), and Craft for parts (opens the recipe it fits). **B** goes back.
- **The duffel bag** slows you: each step costs 2 minutes instead of 1.
- **Dropping** leaves the item on that tile as a small pile you can pick up again. Piles stay where they are.
- **L and R inside the bag** flip between the bag page and the Recipes page.

### 9. Items in this slice

All of `items.md` exists as data, but this slice only places what it can use. In the town:

- **Food and water:** Farmstead beans, Chef Tony's ravioli, Kola King soda, Clear Springs water, Crunch Bunch cereal, Trail Boss jerky, spoiled food. (Eggs, vegetables, raw meat and berries need the farm belt or the woods, so they're not placed.)
- **Medicine:** bandages, rubbing alcohol, Relievo painkillers, antibiotics (very rare), splint kits (school nurse), first aid kits.
- **Weapons:** kitchen knife, Slugger bat, lead pipe, fire axe (Bargain Barn, the school), machete, hatchet, golf club, shovel, hockey stick, meat cleaver, crowbar, and the rare guns above with their ammo. Pitchforks and bows need the farm belt and the woods.
- **Tools and light:** Beamline flashlight, D batteries, lockpicks (very rare), hammer and nails, can opener, Flint King lighter, battery radio, road map, field guide (school library), snare wire, seed packets.
- **Bags:** all four.
- **Vices and comforts:** Marlo Reds, Old Ridge whiskey, sleeping pills, Cocoa Joe chocolate. (No homegrown weed in town.)
- **Crafting parts:** scrap wood, duct tape, rope, rags, glass bottles, gasoline, tin cans.
- **Keepsakes and 1990s finds:** mixtapes, family photos, kids' drawings, car keys (the car never runs in this slice; the key's car is still marked), the Soundwave cassette player, a boombox, the Pocket Pixel, VHS tapes (no power yet, so they're just trade goods for later), sports cards, AA batteries.

**Food values** (hunger points): solid meal 40 (beans, ravioli), light meal 20 (cereal, jerky), Kola King 8 and a little SAN, water 5, chocolate 10. Spoiled food 15. A can of beans or ravioli needs a can opener (10 minutes), or a knife (20 minutes, a noise ring of 3). Effects on SAN and sickness are Part C.

**Spoiling:** cans, soda, water, jerky and chocolate keep for the whole slice. Cereal keeps 3 weeks. Fresh finds aren't placed in this slice.

**Batteries:** flashlight 8 hours per pair of D batteries, radio 24 hours, boombox 6 hours. The cassette player and Pocket Pixel use AA, 6 hours a pair.

### 10. Crafting

From `bible.md`, Crafting; items.md, Crafting parts and first recipes.

- The **Recipes page** (L, then R) lists the recipes you know. One you can make now is lit; one you can't shows what's missing.
- **Small crafts** (anywhere, 15 minutes): nail bat (bat + 4 nails), weapon fix (duct tape), can alarm (3 tin cans + rope), torch (rags + scrap wood, needs a lighter), firebomb (glass bottle + gasoline + rags), rag bandage (rags + clean water).
- **Big builds** (board-up, crates, the rest) belong to the hideout and are in Part D.
- **Starting recipes by job:** everyone knows the torch. Nurse: rag bandage (`survivor.md`, the nurse's extra). Mechanic: weapon fix (`survivor.md`). Farmer: the garden plot and both natural remedies (`survivor.md`; none can be used in this slice). (Hideout builds such as the board-up aren't recipes: everyone knows them, see Part D.) Line cook and homeless: can alarm. Army veteran: firebomb. High school athlete and cop: nail bat. Others: no extra.
- **Learning:** a how-to magazine ("Home Fixer", "Backyard Prepper") found in homes and the school library teaches one recipe when read (30 minutes, 15 for the teacher). The field guide teaches the two natural remedies, which can't be gathered in this slice.

### 11. The notebook

Start → Notebook. Two pages, flipped with L and R.

- **Notes:** the first time something comes up, your survivor jots a short line (`bible.md`, Learning). In this part: waking up, the first locked door, the first full bag, the first dusk, the first road trip, the first section that's nearly picked clean. Parts C and D add theirs. A new note shows for a moment at the bottom of the screen.
- **Recipes:** the same page as in the bag.

### 12. The map screen

**R** opens the map and stops the clock. Two pages, flipped with L and R.

- **This section:** what you've seen so far. Places start hidden and appear once they've been on screen (`bible.md`, Learning the map). Each place can be marked by your survivor: **looted** (every spot searched, marked by itself), **promising** (a locked door or a spot left), **dangerous** (Part C marks it when zombies were seen there). A on a place sets the mark by hand.
- **Road map:** the two sections and the road between them. It shows where your bike is. The trucker knows the roads, so both sections show from day 1; anyone else sees the highway strip once they find a road map or walk there.

### 13. Needs in this part

- Hunger drops about 2 points an hour and sleep about 3.3 an hour while awake. Eating refills hunger.
- Nothing bad happens at zero yet. Part C adds starving, being tired, health and SAN.

### Wiring

- The stand-in room from Part A is gone. Day 1 starts with your survivor waking in a random home in the houses section at 7 AM, with their job's items.
- Start menu rows: **Party**, **Notebook**, **Wait**, **Save code**, **Quit to title**.
- **Saves:** a new upgrade step adds the map state to `la.run`: both sections' layout seed, every searched spot, every opened or broken lock, item piles, bike position, map marks, seen tiles, and the current section and tile. An old Part A save upgrades by building the town from its seed and waking the survivor as on day 1.

## Done when

- The same seed makes the same two sections, places and loot every time.
- 3 test seeds each give two sections with 15 to 20 places, every place reachable on foot, and both edges joined by the road.
- A survivor can play 7 in-game days of looting without the game breaking, and by then most of the houses section is marked looted.
- The bag, notebook and map stop the clock; every action costs the time above.
- Night is dark but readable at every size, and the flashlight cone and neon read clearly.
- `npm run check` passes at all three sizes.

## Not in this spec

- Zombies, fights, health, SAN and wounds (Part C).
- Hideouts, building, real sleep and the death screen (Part D).
- Downtown, the farm belt, the woods and lake, running cars, weather, rumors, people and trade.

## Conflicts found

None.

## Open questions for the Developer to bring back (don't decide them in code)

- Inside maps or roof fade for buildings: bring back how each feels at 320 × 480.
- If 60 × 60 sections feel too empty or too slow to cross on the phone, bring back a playtest note rather than changing the size.
