# Sarah's Sim bible

This game's build bible. Started 2026-11-25 from Keegan's answers in the Game Designer project.

- The house rules in `studio-bible/` (controls, art style, UI, saves, launcher) apply to every game and win where this file overlaps them, except for the named exceptions below (Controls and screen, Art).
- What's been built is in `changelog.md` next to this file. Nothing is built yet.
- Keegan sends changes through the Design Inbox doc; the Designer edits this file through pull requests.
- Reading level: everything written for this game, in chat, in this bible and in the game, sits at an average reading level. Plain words over jargon.
- Sarah's Sim has no secret story files.

## To do

In build priority order. Everything is aimed at Dec 25, 2026. Challenges mode is built last, so if time runs short it's the one thing that arrives in an update after Christmas (Keegan, Nov 25).

- [x] Setup: create this bible (Nov 25).
- [x] Base look: warm and cozy isometric room approved (Nov 25). See Art.
- [ ] Sarah's phone: Keegan finds out the model. It sets the target screen size.
- [ ] Shell space: with the phone known, Keegan picks between keeping L/R, dropping them, and a taller game screen (Keegan, Nov 25: maybe drop L/R for more room; a plain question, no mockup needed). The approved mockup uses today's shell with L/R.
- [ ] Photos: Keegan sends photos of their things and their cats. Photos stay in the Game Designer project files, never in this repo; only the drawn versions come here.
- [ ] Reference sheet: Keegan, Sarah and the cats (drawn and approved Nov 25: `mockups/louie-v1`, `mockups/ralph-v1`, `mockups/people-v1`; real furniture to come) as map sprites and portraits, plus a first set of their real furniture, drawn from the photos (`studio-bible/art-style.md`, Before a game's first build).
- [x] Holidays: which holidays get decorations and items (Nov 25). See Homes and people.
- [x] Decorating: catalog categories, how many pieces at launch, color variants, rotate, stack and wall items. Screen mockup for the catalog.
  Done Nov 25: set with Keegan and drawn in `mockups/decorate-v1`. See Decorating.
- [ ] Item sprites: Keegan and the Designer work out how furniture and decor pieces are drawn, so all 80 match (Keegan, Nov 25: later).
- [ ] Outfits: what she designs (pick parts, recolor, patterns), the clothing list, and the Style screen mockup.
- [ ] Creator: the parts for making new people (face, hair, skin, body), and its screen mockup.
- [ ] Building: lot size, walls, doors, windows, floors, stairs or not, how the view scrolls and zooms over a home bigger than the screen, and the build screen mockup.
- [x] Gameplay: what keeps her coming back beyond designing (Nov 25). See Play.
- [ ] Life mode: prices, coin pay for gigs and chores, and the special sets (the day, needs, job and unlocks are set, see Play).
- [x] Cat personalities: Keegan and the Designer work out Louie's and Ralph's personalities, which shape how each one wanders, naps, nudges and reacts (Keegan, Nov 25).
  Done Nov 25: in Play, The cats.
- [ ] Keegan's notes: Keegan writes the hidden notes, including the one under the Christmas tree, and says where and when each one shows up (Keegan, Nov 25).
- [ ] Idle life: Keegan writes more things the two of them are busy doing when she opens the game, on top of the first ones (see Play) (Keegan, Nov 25).
- [x] Recipes: Keegan lists the dishes he really cooks for Sarah, with what goes in each, for the cooking minigame.
  Done Nov 25: nine dishes, in Play, Cooking.
- [ ] More recipes: one more look at Keegan's Recipe Cards doc for dishes to add, before the cooking spec (Keegan, Nov 25).
- [ ] Bong reference: Keegan sends a photo of his bong, drawn for the reference sheet with their other real things.
- [ ] Real people: Keegan sends the list of friends and family to draw in as visitors, with a photo or a few notes on each. They join the reference sheet.
- [ ] Neighbors: the made-up neighbor cast, each one's personality, and each visitor's short story and special set.
- [ ] Garden: the plant list, how long each takes to grow in real days, how plants change with the seasons, and the mow, weed and water minigames. Plus the house upkeep minigames.
- [ ] Memory book: the list of moments that make a page, and which pages unlock special sets. Screen mockup.
- [ ] Saves: slots per mode, and save export and import (favorites and the camera are set, see Play).
- [ ] Title and cover: the title screen and the 120 × 80 cover (`studio-bible/launcher.md`).
- [ ] Specs: one spec per build part, in this order: the Philly home and decorating (Sandbox), Outfits, Creator, Building, Garden and yard, Life mode (clock, needs, cat care, gigs, coins, idle life), Memory book and notes, Visitors and the neighborhood, Holidays, Challenges.
- [ ] Challenges mode: the challenge list, rewards and its screen mockup (built last).

### Bugs

None yet.

### Ideas inbox

- Other animals besides Louie and Ralph (Keegan, Nov 25: later).
- After Christmas: more homes, more holidays, seasons outside the windows, more challenges.

## Screens

Every screen you can see, in play order (`studio-bible/studio.md`, Screen list). A spec that adds a screen adds its row here. Mockups are in `mockups/`. A screen marked To draw gets an approved mockup before the part that builds it.

| Screen | What you do there | Spec | Mockup |
| --- | --- | --- | --- |
| Title | Pick a mode, continue, import a save | No spec yet | **To draw** |
| Home (decorate) | Open the catalog, drag pieces into the room, stack small things, turn, move, recolor and paint them | No spec yet | `decorate-v1` (UI approved Nov 25, 2026), on the `look-iso-v1` room |
| Style (outfits) | Design and change outfits | No spec yet | **To draw** |
| Creator | Make a new person | No spec yet | **To draw** |
| Build | Draw walls, doors, windows and floors on an empty lot | No spec yet | **To draw** |
| Life mode top bar | Day, time and coins over the home | No spec yet | `look-iso-v1` (top bar) |
| Yard (garden) | Lay out beds, paths, fences and a patio, plant seeds, water and weed | No spec yet | **To draw** |
| Minigame | A short lawn care or house upkeep game (one row per minigame once they're listed) | No spec yet | **To draw** |
| Cooking | Chop, stir and plate one of Keegan's dishes with him | No spec yet | **To draw** |
| Visitor chat | A visitor talks and asks for a gig | No spec yet | **To draw** |
| Gig | See what a visitor wants, design it, hand it in, get paid | No spec yet | **To draw** |
| Neighborhood | Walk to a neighbor's home to help redo it | No spec yet | **To draw** |
| Memory book | Flip through moments, notes and photos | No spec yet | **To draw** |
| Note found | Read a note from Keegan she found in the home | No spec yet | **To draw** |
| Favorites | Save and reuse whole rooms and outfits | No spec yet | **To draw** |
| Camera | Take a clean picture of a room or outfit | No spec yet | **To draw** |
| Challenges | Pick a challenge and see how you did | No spec yet | **To draw** |
| Start menu | Save, homes, people, quit to title | No spec yet | **To draw** |

## Overview

**Pitch.** Sarah's Sim is a cozy life simulator for the phone, made by Keegan as a Christmas gift for Sarah. It's in the style of the life sim genre, but its own game, with a heavy focus on design: decorating and building homes, and designing outfits. It starts in a copy of Keegan and Sarah's home in Philly, with their cats and their real things.

**At a glance**

- A gift for Sarah. Deadline: Dec 25, 2026, with the whole game done, not a preview (Keegan, Nov 25).
- Built openly in this public repo (Keegan, Nov 25: Sarah doesn't check it).
- Ships as its own standalone game. While it's being built it lives on the studio shelf like the other games.
- Phone-first on Sarah's phone (model to be found; it's bigger than Keegan's and not an iPhone SE), inside the studio shell. No sound (`studio-bible/art-style.md`).
- Folder `games/sarahs-sim/`. Planned save prefix `ss.`.
- Other studio games are on hold until this one ships (Keegan, Nov 25).

**Design pillars**

1. **Design is the heart.** Homes and outfits get equal weight (Keegan, Nov 25).
2. **It's ours.** Their home, their cats, their things and the holidays they love.
3. **Cozy, never stressful.** Daily life is optional. Nothing is lost, nothing goes wrong.
4. **Fingers first.** Drag, drop and tap feel natural on the phone.

## Modes

Set Nov 25 (Keegan). Daily life is totally optional, so the game has three modes.

- **Sandbox:** free design. Everything is unlocked from the start. No days, needs or money.
- **Life:** gentle days on the real clock. A few soft needs, cats and a garden to look after, and design gigs that earn coins for new furniture and clothes. Unlocks only happen here (see Play).
- **Challenges:** themed design jobs (for example "a winter cabin for a client") with a small reward. Built last.

## Play

What keeps her coming back beyond designing. Set Nov 25, 2026 (Keegan), in the Game Designer project. Lines marked *Claude default* are the Designer's fill-ins, open to change.

### Reasons to come back

- **Memory book:** a scrapbook that fills up with moments over time: the cats napping on something she placed, a holiday she decorated for, a room or outfit she finished, a note from Keegan she found, and her own photos. Some pages unlock special sets in Life mode.
  - *Claude default:* one memory book shared across all modes.
- **Visitors with stories:** see Visitors below.
- **Real date:** holidays and seasons follow the date on her phone. Christmas comes in December and snow falls in winter. In Sandbox she can still put any holiday's pieces out any time.
- **Keegan's notes:** notes Keegan writes are hidden in the home: in drawers, under pillows and inside gifts. One waits under the tree on Christmas, and more show up on holidays. Each note she finds goes in the memory book. Keegan writes them (To do).
- **Idle life:** when she opens the game, the two of them are already busy living their lives. Sarah might be video-calling her mom, and Keegan might be doing school work or playing a video game. What they're doing fits the real time of day. Keegan writes more of these (To do). No real app or game names on screen (`studio-bible/studio.md`, No real brands), and picks don't repeat until the pool runs out (`studio-bible/play.md`, Picks from a pool don't repeat).

### Life mode

- **Clock:** Life mode runs on the real time of day. Morning light in her morning, lamps and a night sky in her evening. Plants and the cats' needs run on real time too.
- **Needs:** people have three soft needs: energy, hunger and fun. A low need only makes them yawn or sigh and work a bit slower.
- **Away from the game:** every need, for people and cats, pauses while she isn't playing. A month away comes back to the same home, just as she left it.
- **Job: design gigs.** Visitors and neighbors pay her to style a room or an outfit. Gigs are small and quick and are there whenever she plays. Challenges stay the bigger themed jobs.
- **Minigames:** short minigames for house upkeep and lawn care also earn coins.
- **Unlocks:** Sandbox has every piece, clothing and design option from the start. In Life mode, coins from gigs and chores buy most pieces in the catalog, and memory book pages, visitor friendships and holidays unlock special sets coins can't buy.

### The cats

- **Full pet care:** Louie and Ralph wander the home, nap on furniture she places, knock things over, sit in boxes and react when tapped. She can pet them, give them treats and give them toys. Some of their moments go in the memory book.
- **In Life mode** they also have hunger, play and a litter box for her to look after.
- **Never bad:** when she forgets, the cats only nudge her: they sit by the bowl, meow, or look grumpy. They never get sick, get hurt or run off.
- **Louie's personality** (Keegan, Nov 25): a sleepy grump.
  - He naps most of the day, always in the coziest spot, gives a slow blink when petted, and grumbles if Ralph steals his bed.
  - He gets very chatty when he wants something, with lots of speech bubbles, and he has no sense of personal space. He walks right up to you and sits in the way.
  - He isn't a big cuddler, but he'll sit right next to you.
  - He loves sitting on the edge of the bathtub when someone is taking a bath.
- **Ralph's personality** (Keegan, Nov 25): a goofy food lover.
  - He shows up in the kitchen whenever Keegan cooks, flops over in the middle of the floor, and steals Louie's warm spot.
  - He's a big cuddler but very picky about it. Some laps and moments are right and some aren't, and he'll leave if it's wrong.
  - He hates loud noises. When the vacuum, the blender or the mower starts, he slowly leaves the room. The game has no sound, so this shows on screen.
  - He moves slowly and on purpose, never in a rush.
- *Claude default:* in Sandbox the cats wander, nap and react, with no needs.

### Garden

Sarah has a major green thumb and loves her back yard (Keegan, Nov 25).

- The yard is a design space like a room: garden beds, paths, fences and a patio.
- She plants seeds that grow over real days and change with the seasons.
- Mowing, weeding and watering are minigames.
- *Claude default:* in Sandbox she can place plants fully grown.

### Visitors

- **Who:** a small cast of made-up neighbors with their own personalities, real friends and family that Keegan names (drawn from photos or notes), and anyone she makes in the creator.
- **Visits:** a visitor drops by, chats and asks for a gig. Friendship grows with every gig and chat.
- **Stories:** each visitor tells a short story over a few visits, ending with their special set.
- **Their homes:** she can walk over to a visitor's home and help redo it, so there's a small neighborhood.

### Romance

Set Nov 25, 2026 (Keegan): flirty, with a fade to black. Tasteful, never explicit.

- Keegan and Sarah flirt, kiss and cuddle in everyday play.
- Now and then a small playful moment, such as a wink, a few hearts or an "oh?", leads into a fade to black.
- Romance is only between Keegan and Sarah. The details live in the Game Designer project files, not in this repo.

### Cooking

Set Nov 25, 2026 (Keegan): Keegan cooks for Sarah all the time, so the game shows it.

- **Idle life:** Keegan is often cooking when she opens the game, and the meal he makes fills hunger.
- **Cook together:** she can jump in and cook with him in a little chop, stir and plate minigame.
- **Their dishes:** the recipes are Keegan's real dishes (To do). Meals can use veggies from her garden.
- *Claude default:* the first time they make a dish, it goes in the memory book.

**Recipes** (Keegan, Nov 25: his three, plus the dishes in his Recipe Cards doc). Each one is a few simple steps in the minigame. Store-bought things are plain, with no brand names.

| Dish | What goes in | Minigame steps |
| --- | --- | --- |
| Bean burritos | Tortillas, beans, rice, cheese, salsa | Warm the beans, warm the tortillas, fill, roll |
| Spaghetti and meatballs | Spaghetti, meatballs, marinara, Parmesan | Boil the pasta, simmer the meatballs in sauce, plate, cheese on top |
| Eggs on toast | Eggs, bread, butter, pepper | Toast the bread, fry the eggs, stack |
| Beef and broccolini | Thin-sliced beef, broccolini, shallots, soy-honey sauce, rice | Slice, sear the beef, soften the greens, toss in sauce (his top-rated) |
| Chicken nachos | Chips, chicken, peppers and onion, beans, cheese, salsa | Char the peppers, season the chicken, layer the pan, melt |
| Breakfast sandwiches | Eggs, sausage, cheese, hashbrowns, English muffin | Crisp the hashbrowns, brown the sausage, fry the eggs, stack |
| Meatball subs | Meatballs, marinara, rolls, provolone | Simmer, toast the rolls, load, melt |
| Ravioli with chicken sausage | Ravioli, chicken sausage, red and white sauce | Brown the sausage, boil the ravioli, mix the sauces, fold |
| Chorizo breakfast tacos | Chorizo, eggs, hashbrowns, tortillas, green salsa | Crisp the hashbrowns, cook the chorizo, scramble, fill (one she loved) |

- *Claude default:* garden veggies (peppers, onions, greens, tomatoes for sauce) can stand in for store-bought ones, and a dish with something from her garden gets a little sparkle.

### Winding down

Set Nov 25, 2026 (Keegan): weed is part of their cozy life, in the same light tone as everything else.

- Items: joints, Keegan's bong (drawn from his reference photo, a piece of their own) and weed brownies.
- Keegan and Sarah can smoke a joint or the bong, or eat a brownie, as a relaxing moment together. It's played light and giggly, never as a problem.
- *Claude default:* it fills fun and makes them a bit hungry (the munchies). It never makes anything go wrong.
- No real brands or strain names (`studio-bible/studio.md`, No real brands).

### Keeping designs

- **Favorites:** she saves outfits and whole rooms as favorites to reuse in any home or mode.
- **Camera:** a camera button saves a clean picture of a room or outfit to her phone, and she can add it to the memory book.

## Homes and people

- **Starter home** (Keegan, Nov 25): a prebuilt copy of Keegan and Sarah's place in Philly, with their cats. Their real furniture and things are drawn from Keegan's photos. No street address anywhere.
- **Holiday things** (Keegan, Nov 25): year-round, Christmas first. The Christmas set is built first, then Valentine's, Halloween, Thanksgiving and more, each with its own decorations and items.
- **The cats** (Keegan, Nov 25): Louie, a slim grey-and-white cat with a white blaze up his nose and sleepy yellow-green eyes (`mockups/louie-v1`), and Ralph, a big orange tabby with white socks and a white blaze, clearly bigger than Louie (`mockups/ralph-v1`). Ralph has an optional outfit: a red bowtie with a small silver bell.
- **People** (Keegan, Nov 25): Keegan and Sarah are drawn to look like themselves (`mockups/people-v1`, approved as a starting place), and she can restyle their hair and outfits.
  - **Sarah:** copper curls, freckles, grey-blue eyes, glasses on or off, gold hoops. She has several hairstyles (pinned up, loose bob, long curls, ponytail to start), but her hair is always ginger: restyle, never recolor.
  - **Keegan:** buzz cut, full beard trimmed to his jaw, open eyes (they only narrow when he grins), nose stud, cap on or off.
  - **Clothes:** their real outfits from Keegan's photos are references for the Style catalog. One must-have: the **ORANGE ROCKS tee**, from Sarah's childhood shirt. Bright orange with white rounded letters, "ORANGE ROCKS" on the front and "AND SO DO I" on the back.
  - **Creator:** lets her make extra people for other homes.
- **Other homes** (Keegan, Nov 25): she builds them from scratch on empty lots: walls, doors and rooms, then furniture.
- **Room size:** rooms and homes can be much bigger than one screen. The approved mockup shows one 10 × 10 tile room only because it fits the screen; the view scrolls over bigger homes. How it scrolls and zooms is part of the Building item on To do.

## Decorating

Set Nov 25 (Keegan). Mockup: `mockups/decorate-v1` (UI approved; the furniture in it is a stand-in until item sprites are worked out).

- **Catalog size:** about 80 furniture and decor pieces at launch, with more added as needed.
- **Catalog tabs:** sorted by type: seating, tables, beds, storage, lights, plants, rugs, wall and decor. Two more tabs: **Ours**, holding their real things from Keegan's photos, and **Holiday**. Each card shows small dots for its color choices.
- **Placing:** big pieces snap to the floor tiles and turn 4 ways. Small things stack on tables and shelves, and the spot glows green when a piece will stack there. Art and shelves hang on walls.
- **Picking a placed piece:** tap it for turn, move and put-away buttons over it. The tray shows its name, its swatches, Paint, Put away, Move and Done.
- **Colors:** both quick and free. Each piece has 4 to 6 hand-picked swatches that always look good together. Paint mode lets her color each part (for example fabric, wood, cushion) with any color from a 24-color cozy palette.
- **Sandbox top bar:** shows the mode and the home's name instead of the day, time and coins.

## Controls and screen

- **Touch first, buttons too** (Keegan, Nov 25): she taps and drags furniture and clothes. The studio shell and its buttons stay for walking, menus and anyone who prefers buttons. **Named exception** to `studio-bible/controls.md` (Buttons): drag and drop on the game screen is a main control here, not only tapping menu rows.
- **Target screen:** Sarah's phone. The studio's tests at 375 × 667, 375 × 550 and 320 × 480 still run, so nothing is cut off anywhere.
- **Shell space:** open (see To do). On a big phone the game height cap of 320 px (`studio-bible/controls.md`, Shell) leaves dark bands above and below the room; the shell-space question covers it.

## Art

- **Mood** (Keegan, Nov 25): warm and cozy. Soft woods, warm lamp light, gentle pastel accents and snow at the windows in winter.
- **View** (Keegan, Nov 25): isometric, the diagonal view of classic life sims (2:1, the approved mockup uses 22 × 11 px floor tiles). **Named exception** to `studio-bible/art-style.md` (Craft: Maps are 3/4 top-down). Light still comes from the upper left: left-front faces lit, right-front faces in shade.
- **Base look** (approved Nov 25): `mockups/look-iso-v1` (drawing code in `look-iso-v1.js`). It sets the palette, the plank floor, striped wallpaper with a wainscot, the lamp glow, the cream tray with rose tabs and the top bar. The people and cats in it are stand-ins until the reference sheet.
- All the studio Craft rules apply on top: lit, dressed and alive rooms, soft shadows under everything, dark outlines.

### Palette

From the approved mockup.

| Use | Hex |
| --- | --- |
| Wall (light, base, shade) | `#f3d2c4`, `#ecc1b2`, `#dcab9c` |
| Trim | `#fff1e2` |
| Floor planks | `#d39a66`, `#c88d5a`, `#bb8150`, plank lines `#93603c` |
| Rose accent (light, base, shade) | `#f39bb0`, `#e46f8b`, `#b44f63` |
| Sage accent (light, base, shade) | `#9cc1b6`, `#7fa7a0`, `#5d8580` |
| Honey accent | `#f3d38a`, `#e7b75f`, `#c78f3e` |
| Leaf | `#8fc47b`, `#6aa361`, `#437a47` |
| Lamp glow | `#ffd56b` |
| Tray and cards | `#fff6ea`, edge `#e8cdb4`, ink `#6b4250` |
| Outside the room | `#3a2633` to `#22171f` |
| Shell body | `#f6c9c1`, `#e9a7a2`, `#c9827f` |
