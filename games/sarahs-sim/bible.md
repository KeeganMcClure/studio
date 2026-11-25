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
- [x] Outfits: what she designs (pick parts, recolor, patterns), the clothing list, and the Style screen mockup.
  Done Nov 25: set with Keegan, drawn in `mockups/style-v1`, and a starting list of 60 pieces. See Outfits.
- [ ] More outfit references: Keegan sends more photos of the two of them, and the clothing list grows from them (Keegan, Nov 25).
- [x] Creator: the parts for making new people (face, hair, skin, body), and its screen mockup.
  Done Nov 25: set with Keegan and drawn in `mockups/creator-v1`. See Creator.
- [x] Building: lot size, walls, doors, windows, floors, stairs or not, how the view scrolls and zooms over a home bigger than the screen, and the build screen mockup.
  Done Nov 25: set with Keegan and drawn in `mockups/build-v1`. See Building.
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
- [x] Garden: the plant list, how long each takes to grow in real days, how plants change with the seasons, and the mow, weed and water minigames. Plus the house upkeep minigames.
  Done Nov 25: in Play, Garden (the plant list is a starter list Keegan can change).
- [ ] Memory book: Keegan reviews the drafted moments and special sets (Play, Memory book), and the screen mockup.
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
| Style (outfits) | Dress a person in the big view: pick pieces, recolor, paint, add patterns and tee prints, spin to see the back | No spec yet | `style-v1` (UI approved Nov 25, 2026) |
| Creator | Make a new person: parts, fine tuning, age, gender and extras | No spec yet | `creator-v1` (approved Nov 25, 2026) |
| Build | Draw rooms, walls, doors, windows, floors and stairs on an empty lot, up to 3 floors | No spec yet | `build-v1` (approved Nov 25, 2026) |
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
  - *Claude default:* one memory book shared across all modes. Chapters, dates and the moment list are in Memory book below.
- **Visitors with stories:** see Visitors below.
- **Real date:** holidays and seasons follow the date on her phone. Christmas comes in December and snow falls in winter. In Sandbox she can still put any holiday's pieces out any time.
- **Keegan's notes:** notes Keegan writes are hidden in the home: in drawers, under pillows and inside gifts. One waits under the tree on Christmas, and more show up on holidays. Each note she finds goes in the memory book. Keegan writes them (To do).
- **Idle life:** when she opens the game, the two of them are already busy living their lives. Sarah might be video-calling her mom, and Keegan might be doing school work or playing a video game. What they're doing fits the real time of day. Keegan writes more of these (To do). No real app or game names on screen (`studio-bible/studio.md`, No real brands), and picks don't repeat until the pool runs out (`studio-bible/play.md`, Picks from a pool don't repeat).

### Memory book

Set Nov 25, 2026 (Keegan).

- **Chapters by theme:** seven chapters (the cats, garden, kitchen, holidays, home, friends, and the two of them), with about 10 moments each, around 70 in all.
- **Rewards:** finishing a chapter unlocks its special set in Life mode. In Sandbox, she already has everything, so the book is just for keeps.
- **Dates:** every moment records the real date it happened, written by hand on its page (Keegan).
- **Pictures:** each moment is a small drawn snapshot of the scene as it really looked, with her own furniture and outfits. Her camera photos can also go on any chapter's pages as extras, and they don't count toward finishing it (*Claude default*).
- A moment happens once. Later updates can add more moments to a chapter.

*Claude draft of the moments, for Keegan to change:*

| Chapter | Moments | Special set |
| --- | --- | --- |
| The cats | Louie naps on something she placed · Louie sits on the edge of the tub during a bath · Louie chats until he gets a treat · Ralph sprawls on his toy pile · Ralph shows up while Keegan cooks · Ralph steals Louie's warm spot · Ralph slowly leaves when the vacuum starts · first time with the feather wand · Ralph in his red bowtie · both cats asleep together | Cat lovers: a cat tree, a gallery wall of cat art, a cat tapestry and a pair of cat beds |
| Garden | First seed planted · first sprout · first bloom · first harvest · a full bed · a houseplant grows up · the greenhouse goes up · snow on the beds · a pumpkin grown in fall · plants from all four seasons grown | Cottage garden: an arbor, a birdbath, a garden bench and string lights |
| Kitchen | Cooking together for the first time · one moment for each of Keegan's dishes, the first time it's made (9) | Cozy kitchen: a retro fridge, open shelves, a herb rail and a breakfast nook |
| Holidays | First snow · the Christmas tree trimmed · Christmas morning · New Year's Eve · Valentine's Day · spring's first warm day · Fourth of July · Halloween costumes · Thanksgiving dinner · a whole year of holidays | Keepsakes: an ornament shelf, a holiday village and a garland for every season |
| Home | First room finished · first piece bought with coins · first wall built on an empty lot · a whole new home finished · first favorite saved · first photo taken · first outfit designed · the ORANGE ROCKS tee worn · 10 rooms finished · every room in the Philly home redone | Designer's studio: a drafting table, a mood board, a sewing corner and a dress form |
| Friends | First visitor · first gig done · first visit to a neighbor's home · first neighbor's home redone · first person made in the creator · a visitor brings a gift · first friend's story finished · three friends made · every neighbor's story finished · a full house of visitors | Party: string lights, a record player, a snack table and floor cushions |
| The two of us | First note from Keegan found · the note under the tree · cuddled up on the couch · a kiss · a cozy night in · winding down together · Sarah video-calls her mom · Keegan's game night · a slow morning in bed · every note found | Our place: framed pictures of the two of them, a cozy throw and a "home" sign |
 Life mode runs on the real time of day. Morning light in her morning, lamps and a night sky in her evening. Plants and the cats' needs run on real time too.
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
  - He loves lying on his pile of toys, and feathers are his favorite. A feather wand is his best toy, and toys she gives him join the pile.
- *Claude default:* in Sandbox the cats wander, nap and react, with no needs.

### Garden

Sarah has a major green thumb and loves her back yard (Keegan, Nov 25).

- The yard is a design space like a room: garden beds, paths, fences and a patio.
- She plants seeds that grow over real days and change with the seasons.
- *Claude default:* in Sandbox she can place plants fully grown.

**What she grows** (Keegan, Nov 25): flowers, veggies, herbs, shrubs and vines outdoors, and potted houseplants indoors that she waters and that grow over real days too. Veggies and herbs go into Keegan's cooking.

**How fast** (Keegan, Nov 25): herbs and greens take 1 to 2 real days, veggies and flowers 3 to 5, and big shrubs and vines about a week, so there's something new almost every time she opens the game.

- **Never dies:** a plant that goes unwatered droops, and perks up again when she waters it (pillar 3).
- *Claude default:* growing keeps going while she's away, but thirst pauses, so she always comes back to a happy garden.

**Seasons** (Keegan, Nov 25):

- In winter the outdoor beds rest under snow, and she can decorate the yard for winter.
- A small greenhouse and her houseplants keep growing all year.
- Each season also has its own plants.

*Claude default, a starter list to grow:*

| Season | Plants |
| --- | --- |
| Spring | Tulips, daffodils, peas, lettuce, strawberries |
| Summer | Sunflowers, roses, tomatoes, peppers, zucchini, basil |
| Fall | Mums, pumpkins, kale, onions |
| Winter | Holly, poinsettias, winter greens, a little potted pine |
| Greenhouse and indoors, all year | Herbs (basil, mint, rosemary), greens, monstera, pothos, snake plant, succulents, a red mushroom planter |

**Chore minigames** (Keegan, Nov 25): eight quick one-thumb games, each 30 to 60 seconds, that pay a few coins in Life mode. The seasonal ones only show up in their season.

| Minigame | When | How it plays |
| --- | --- | --- |
| Mow | Spring to fall | Drag the mower in stripes across the lawn |
| Weed | Spring to fall | Pull weeds up and out of the beds |
| Water | All year | Hold over each plant until it perks up |
| Rake leaves | Fall | Sweep leaves into a pile, and the cats might jump in |
| Shovel snow | Winter | Clear the path to the door |
| Dishes | All year | Scrub, rinse and stack |
| Vacuum | All year | Drag over the floor. Ralph slowly leaves the room |
| Fold laundry | All year | Fold and stack clothes from the basket |

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
- **Room size:** rooms and homes can be much bigger than one screen. The approved mockup shows one 10 × 10 tile room only because it fits the screen; the view scrolls over bigger homes. How it scrolls and zooms is set in Building.

## Decorating

Set Nov 25 (Keegan). Mockup: `mockups/decorate-v1` (UI approved; the furniture in it is a stand-in until item sprites are worked out).

- **Catalog size:** about 80 furniture and decor pieces at launch, with more added as needed.
- **Catalog tabs:** sorted by type: seating, tables, beds, storage, lights, plants, rugs, wall and decor. Two more tabs: **Ours**, holding their real things from Keegan's photos, and **Holiday**. Each card shows small dots for its color choices.
- **Placing:** big pieces snap to the floor tiles and turn 4 ways. Small things stack on tables and shelves, and the spot glows green when a piece will stack there. Art and shelves hang on walls.
- **Picking a placed piece:** tap it for turn, move and put-away buttons over it. The tray shows its name, its swatches, Paint, Put away, Move and Done.
- **Colors:** both quick and free. Each piece has 4 to 6 hand-picked swatches that always look good together. Paint mode lets her color each part (for example fabric, wood, cushion) with any color from a 24-color cozy palette.
- **Sandbox top bar:** shows the mode and the home's name instead of the day, time and coins.

## Outfits

Set Nov 25 (Keegan). Mockup: `mockups/style-v1` (UI approved).

- **Wardrobe size:** about 60 clothing pieces at launch: their real outfits from Keegan's photos, everyday basics and Christmas clothes.
- **Wardrobe tabs:** hair, tops, bottoms, dresses, shoes, extras (hats, glasses, jewelry), plus **Ours** and **Holiday**. Hearts mark pieces from their real clothes.
- **Big dress-up view:** the Style screen shows the person large, about 3 times map size, in front of a standing mirror. Arrows spin them to see the back. Tap the name to dress someone else. The heart saves a favorite and the camera takes a picture (see Play).
- **Designing a piece:** each piece has hand-picked swatches, a paint mode for each part, and patterns: plain, stripes, plaid, floral, leopard and dots.
- **Her own prints:** she can write on tees, front or back, in 2 short lines of up to 6 letters, and pick the letter color. The ORANGE ROCKS tee is built this way.
- **Coats** sit under the Tops tab, so the 8 tabs stay as they are. Ralph's bowtie is a cat outfit and isn't counted here. More holiday clothes come with each holiday set after Christmas.

### Clothing list

The starting list, approved by Keegan on Nov 25 (60 pieces). ♥ marks a piece from Keegan's photos, which also shows in the Ours tab. More are added as Keegan sends more photos (see To do).

#### Tops (16)
1. ♥ ORANGE ROCKS tee (front: ORANGE ROCKS, back: AND SO DO I)
2. ♥ Rose crochet-flower cardigan over a cream top
3. ♥ Leopard spot sweater
4. ♥ Lilac hoodie
5. ♥ Cream turtleneck sweater
6. ♥ Slate-blue puffer vest
7. ♥ Mauve-pink tee
8. ♥ Green tartan flannel over a white tee
9. ♥ Navy plaid cardigan
10. ♥ Camp shirt, red floral
11. ♥ Camp shirt, white with a blue print
12. ♥ Camp shirt, purple and pink stripes
13. ♥ White button-down with a navy tie
14. Plain tee (blank for her own prints)
15. Cozy cable-knit sweater
16. Tank top

#### Bottoms (9)
17. ♥ Straight blue jeans
18. ♥ Light cuffed jeans
19. ♥ Light-wash jean shorts
20. ♥ Blue chino shorts
21. Wide-leg trousers
22. Pleated skirt
23. Overalls
24. Soft joggers
25. Leggings

#### Dresses (7)
26. ♥ White eyelet floral sundress
27. ♥ Pink satin slip dress
28. ♥ Burgundy long-sleeve mini dress
29. Wrap dress
30. Sweater dress
31. Overall dress
32. Party dress with a full skirt

#### Coats (4)
33. ♥ Floral puffer
34. ♥ Denim sherpa jacket with pins
35. Long wool coat
36. Raincoat

#### Shoes (8)
37. ♥ Tan suede boots
38. ♥ Converse high-tops
39. ♥ Strappy heels
40. Slippers
41. Sneakers
42. Rain boots
43. Sandals
44. Socks only (cozy socks)

#### Extras (11)
45. ♥ Glasses, clear frames
46. ♥ Glasses, tortoiseshell
47. ♥ Gold hoops
48. ♥ Gold claw clip
49. ♥ Pink cap
50. ♥ Cream cap with a brown brim
51. ♥ Black cap with a green underbrim
52. ♥ Dark sunglasses
53. Beanie
54. Scarf
55. Tote bag

#### Holiday (5)
56. ♥ Red tartan Christmas pajamas with lace trim and puffed sleeves
57. Ugly Christmas sweater
58. Santa hat
59. Halloween witch hat
60. Valentine's heart sweater

## Creator

Set Nov 25 (Keegan: "she LOVES a character creator", so it gets lots of room to play). Mockup: `mockups/creator-v1` (approved).

- **Same mirror view as Style.** When she taps Done, the new person goes to Style to get dressed.
- **Tabs:** age, face, eyes, nose, lips, hair, body, skin and more.
- **Parts from lists, plus fine tuning:** each part has a list of shapes and a row of colors, with Random and Undo buttons. Sliders and switches fine-tune things like eye spacing, eye size, height, build, freckles and dimples.
- **Ages:** kid, teen, adult and elder, each with its own body size. People don't age on their own. Babies may come in a later update.
- **Gender:** woman, man or nonbinary sets a starting body and pronouns, and she can edit the pronouns. Nothing is locked: every body shape, hairstyle and outfit works for anyone.
- **Extras, all of them:** makeup, freckles and blush, facial hair, glasses, piercings, tattoos (pick a design, a spot and a color) and birthmarks. Any hair color, with highlights.
- Sarah's own hair is always ginger (see People). That rule is only for her.

## Building

Set Nov 25 (Keegan). Mockup: `mockups/build-v1` (approved; Keegan asked for better stairs, and the redrawn straight flight is the approved look).

- **Lots:** small 16 × 16, medium 24 × 24 or large 32 × 32 tiles. Other homes start as an empty lot.
- **Floors:** up to 3, joined by stairs. The 1/2/3 buttons switch floors; the floor below shows dimmed under the one she's on.
- **Stairs:** straight, L-turn, spiral and ladder. A flight leaves an open stairwell in the floor above, with a banister on its open sides.
- **Walls:** a room tool (drag a box to make a whole room, with a size tag while dragging) and a wall tool (drag a line). Doors and windows snap onto any wall they're dragged to.
- **Floors and walls:** a floor tool and a wallpaper tool, plus erase.
- **View:** pinch to zoom, two-finger drag (or the D-pad) to pan over a home bigger than the screen. A walls button cycles walls up, cut away (back walls up, front walls low) and down. No whole-home rotation; furniture still turns 4 ways.
- **Tray:** the same Home / Style / Build tabs as the other screens. The 8 tools are icons only, and the picked tool's name shows below them with a hint. Below that, cards for the picked tool (wall styles, doors, stair types).

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
