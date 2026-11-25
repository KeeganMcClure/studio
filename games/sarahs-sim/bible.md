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
- [x] Item sprites: Keegan and the Designer work out how furniture and decor pieces are drawn, so all 80 match (Keegan, Nov 25: later).
  Done Nov 25: Rich detail, props both ways, some pieces move. Drawn in `mockups/furniture-detail-v1` and `mockups/furniture-sheet-v1`. See Decorating, Furniture art. Their real furniture stays on the Reference sheet item (photos after Keegan is home, Nov 30).
- [x] Outfits: what she designs (pick parts, recolor, patterns), the clothing list, and the Style screen mockup.
  Done Nov 25: set with Keegan, drawn in `mockups/style-v1`, and a starting list of 60 pieces. See Outfits.
- [ ] More outfit references: Keegan sends more photos of the two of them, and the clothing list grows from them (Keegan, Nov 25).
- [x] Creator: the parts for making new people (face, hair, skin, body), and its screen mockup.
  Done Nov 25: set with Keegan and drawn in `mockups/creator-v1`. See Creator.
- [x] Building: lot size, walls, doors, windows, floors, stairs or not, how the view scrolls and zooms over a home bigger than the screen, and the build screen mockup.
  Done Nov 25: set with Keegan and drawn in `mockups/build-v1`. See Building.
- [x] Gameplay: what keeps her coming back beyond designing (Nov 25). See Play.
- [x] Life mode: prices, coin pay for gigs and chores, and the special sets (the day, needs, job and unlocks are set, see Play).
  Done Nov 25: coins and prices drafted in Play, Life mode, sets in Memory book and Visitors.
- [x] Cat personalities: Keegan and the Designer work out Louie's and Ralph's personalities, which shape how each one wanders, naps, nudges and reacts (Keegan, Nov 25).
  Done Nov 25: in Play, The cats.
- [ ] Keegan's notes: Keegan writes about 20 short notes in the [Notes for Sarah](https://claude.ai/artifact/Xez8onsWSjq7SKSSsnGk1o) sheet: one under the Christmas tree, one on her birthday, about 8 for holidays and their anniversary, and about 10 hidden around the home for her first month. Each slot says when and where she finds it (Keegan, Nov 25).
- [x] Idle life: Keegan writes more things the two of them are busy doing when she opens the game, on top of the first ones (see Play) (Keegan, Nov 25).
  Done Nov 25: about 25 activities across four times of day, in Play, Idle life (the full list is in the private project files).
- [x] Recipes: Keegan lists the dishes he really cooks for Sarah, with what goes in each, for the cooking minigame.
  Done Nov 25: nine dishes, in Play, Cooking.
- [ ] More recipes: one more look at Keegan's Recipe Cards doc for dishes to add, before the cooking spec (Keegan, Nov 25).
- [ ] Bong reference: Keegan sends a photo of his bong, drawn for the reference sheet with their other real things.
- [ ] Real people: Keegan sends the list of friends and family to draw in as visitors, with a photo or a few notes on each. They join the reference sheet. (Nov 25: family listed in the private project files; friends and the photos or notes still to come.)
- [x] Neighbors: the made-up neighbor cast, each one's personality, and each visitor's short story and special set.
  Done Nov 25: four neighbors with stories, in Play, Visitors. Real people's stories wait on Keegan's list.
- [x] Garden: the plant list, how long each takes to grow in real days, how plants change with the seasons, and the mow, weed and water minigames. Plus the house upkeep minigames.
  Done Nov 25: in Play, Garden (the plant list is a starter list Keegan can change).
- [ ] Memory book: screen mockup (moments approved and rewards set in steps, Nov 25).
- [ ] Saves: slots per mode, and save export and import (favorites and the camera are set, see Play).
- [x] Title and cover: the title screen and the 120 × 80 cover (`studio-bible/launcher.md`).
  Done Nov 25: set with Keegan and drawn in `mockups/title-v1` (winter). See Title and cover. Keegan writes the Christmas line.
- [ ] Specs: one spec per build part, in this order: the Philly home and decorating (Sandbox), Outfits, Creator, Building, Garden and yard, Life mode (clock, needs, cat care, gigs, coins, idle life), Memory book and notes, Visitors and the neighborhood, Holidays, Challenges.
- [ ] Challenges mode: the challenge list, rewards and its screen mockup (built last). (Nov 25: client briefs with a twist; draft list of 14 in Play, Challenges, for Keegan's review; mockup still to draw.)

### Bugs

None yet.

### Ideas inbox

- Other animals besides Louie and Ralph (Keegan, Nov 25: later).
- After Christmas: more homes, more holidays, seasons outside the windows, more challenges.

## Screens

Every screen you can see, in play order (`studio-bible/studio.md`, Screen list). A spec that adds a screen adds its row here. Mockups are in `mockups/`. A screen marked To draw gets an approved mockup before the part that builds it.

| Screen | What you do there | Spec | Mockup |
| --- | --- | --- | --- |
| First open (gift) | Once only: pull the ribbon on a wrapped gift, which opens onto the home with Keegan's Christmas line | No spec yet | `title-v1` (approved Nov 25, 2026) |
| Title | Pick a mode, continue, import a save, over the snowy home | No spec yet | `title-v1` (approved Nov 25, 2026) |
| Home (decorate) | Open the catalog, drag pieces into the room, stack small things, turn, move, recolor and paint them | No spec yet | `decorate-v1` (UI approved Nov 25, 2026), on the `look-iso-v1` room |
| Style (outfits) | Dress a person in the big view: pick pieces, recolor, paint, add patterns and tee prints, spin to see the back | No spec yet | `style-v1` (UI approved Nov 25, 2026) |
| Creator | Make a new person: parts, fine tuning, age, gender and extras | No spec yet | `creator-v1` (approved Nov 25, 2026) |
| Build | Draw rooms, walls, doors, windows, floors and stairs on an empty lot, up to 3 floors | No spec yet | `build-v1` (approved Nov 25, 2026) |
| Life mode top bar | Day, time and coins over the home | `specs/006-life-mode.md` | `look-iso-v1` (top bar) |
| Yard (garden) | Lay out beds, paths, fences and a patio, plant seeds, water and weed | `specs/005-garden-and-yard.md` | **To draw** |
| Minigame | One of the eight chores (mow, weed, water, rake, shovel snow, dishes, vacuum, fold laundry), all in one shared frame | `specs/005-garden-and-yard.md` | **To draw** |
| Cooking | Chop, stir and plate one of Keegan's dishes with him | `specs/006-life-mode.md` | **To draw** |
| Visitor chat | A visitor talks and asks for a gig | `specs/008-visitors-and-neighborhood.md` | **To draw** |
| Gig | See what a visitor wants, design it, hand it in, get paid | `specs/006-life-mode.md` | **To draw** |
| Neighborhood | Walk to a neighbor's home to help redo it | `specs/008-visitors-and-neighborhood.md` | **To draw** |
| Memory book | Flip through moments, notes and photos | `specs/007-memory-book-and-notes.md` | **To draw** |
| Note found | Read a note from Keegan she found in the home | `specs/007-memory-book-and-notes.md` | **To draw** |
| Favorites | Save and reuse whole rooms and outfits | No spec yet | **To draw** |
| Camera | Take a clean picture of a room or outfit | No spec yet | **To draw** |
| Challenges | Pick a challenge and see how you did | No spec yet | **To draw** |
| Start menu | Save, homes, people, quit to title | No spec yet | **To draw** |

## Overview

**Pitch.** Sarah's Sim is a cozy life simulator for the phone, made by Keegan as a Christmas gift for Sarah. It's in the style of the life sim genre, but its own game, with a heavy focus on design: decorating and building homes, and designing outfits. It starts in Keegan and Sarah's future home in Philly, a red-brick rowhouse, with their cats and their real things.

**At a glance**

- A gift for Sarah. Deadline: Dec 25, 2026, with the whole game done, not a preview (Keegan, Nov 25).
- Built openly in this public repo (Keegan, Nov 25: Sarah doesn't check it).
- **Private data** (Keegan, Nov 25): Keegan's notes to Sarah, the idle-life lists, the romance details and the real people's names and lines live only in the private project files (`gift-life-sim/`). The build copies them into the finished game. The repo never holds them: it keeps a placeholder file with the same shape and dummy text, so the game builds and tests without them.
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
- **Idle life:** when she opens the game, the two of them are already busy living their lives. Sarah might be video-calling her mom, and Keegan might be doing school work or playing a video game. What they're doing fits the real time of day.
  - **Four times of day** (Keegan, Nov 25): morning (6 to 11 AM), daytime (11 AM to 5 PM), evening (5 to 10 PM) and late night (10 PM to 6 AM), with about 25 activities across them. They include cooking, school work, gaming, gardening, calls home, baths with Louie on the tub edge, couch time, winding down, reading, sleeping, and play with the cats. The full list lives in the private project files, since it is about their real life.
  - **Crafts:** Sarah paints and does a craft that fits the season, and Keegan crochets. Each finished piece shows up in the home afterward as decor she can keep or move (Keegan, Nov 25).
  - **Cheeky after-moments:** a few playful hints that they just had some time alone, with nothing shown (see Romance). The details stay in the private project files.
  - No real app or game names on screen (`studio-bible/studio.md`, No real brands), and picks don't repeat until the pool runs out (`studio-bible/play.md`, Picks from a pool don't repeat).

### Memory book

Set Nov 25, 2026 (Keegan).

- **Chapters by theme:** seven chapters (the cats, garden, kitchen, holidays, home, friends, and the two of them), with about 10 moments each, around 70 in all.
- **Rewards in steps** (Keegan, Nov 25): each chapter unlocks its set a piece at a time in Life mode: a small piece at 3 moments, more at 6, and one big centerpiece when all 10 are done. In Sandbox, she already has everything, so the book is just for keeps.
- **Dates:** every moment records the real date it happened, written by hand on its page (Keegan).
- **Pictures:** each moment is a small drawn snapshot of the scene as it really looked, with her own furniture and outfits. Her camera photos can also go on any chapter's pages as extras, and they don't count toward finishing it (*Claude default*).
- A moment happens once. Later updates can add more moments to a chapter.

Moments approved by Keegan as starters (Nov 25). The reward pieces are a *Claude draft*.

| Chapter | Moments | Rewards: at 3 · at 6 · all 10 |
| --- | --- | --- |
| The cats | Louie naps on something she placed · Louie sits on the edge of the tub during a bath · Louie chats until he gets a treat · Ralph sprawls on his toy pile · Ralph shows up while Keegan cooks · Ralph steals Louie's warm spot · Ralph slowly leaves when the vacuum starts · first time with the feather wand · Ralph in his red bowtie · both cats asleep together | A pair of cat beds · a gallery wall of cat art and a cat tapestry · a big cat tree |
| Garden | First seed planted · first sprout · first bloom · first harvest · a full bed · a houseplant grows up · the greenhouse goes up · snow on the beds · a pumpkin grown in fall · plants from all four seasons grown | A birdbath · a garden bench and string lights · a rose arbor |
| Kitchen | Cooking together for the first time · one moment for each of Keegan's dishes, the first time it's made (9) | A herb rail · open shelves and a breakfast nook · a retro fridge |
| Holidays | First snow · the Christmas tree trimmed · Christmas morning · New Year's Eve · Valentine's Day · spring's first warm day · Fourth of July · Halloween costumes · Thanksgiving dinner · Sarah's birthday · Keegan's birthday · a whole year of holidays | A garland for every season · an ornament shelf · a lit-up holiday village |
| Home | First room finished · first piece bought with coins · first wall built on an empty lot · a whole new home finished · first favorite saved · first photo taken · first outfit designed · the ORANGE ROCKS tee worn · 10 rooms finished · every room in the Philly home redone | A mood board · a sewing corner and a dress form · a drafting table studio |
| Friends | First visitor · first gig done · first visit to a neighbor's home · first neighbor's home redone · first person made in the creator · a visitor brings a gift · first friend's story finished · three friends made · every neighbor's story finished · a full house of visitors | Floor cushions · a snack table and string lights · a record player |
| The two of us | First note from Keegan found · the note under the tree · cuddled up on the couch · a kiss · a cozy night in · winding down together · Sarah video-calls her mom · Keegan's game night · a slow morning in bed · our anniversary · every note found | A cozy throw · a "home" sign · a wall of framed pictures of the two of them |
 Life mode runs on the real time of day. Morning light in her morning, lamps and a night sky in her evening. Plants and the cats' needs run on real time too.
- **Who she plays** (Keegan, Nov 25): Sarah plays as herself. Keegan lives on his own: he goes about his day (idle life), cooks for her, and joins in when she taps him for something to do together.
- **Needs:** people have three soft needs: energy, hunger and fun. A low need only makes them yawn or sigh and work a bit slower.
- **Away from the game:** every need, for people and cats, pauses while she isn't playing. A month away comes back to the same home, just as she left it.
- **Job: design gigs.** Visitors and neighbors pay her to style a room or an outfit. Gigs are small and quick and are there whenever she plays. Challenges stay the bigger themed jobs.
- **Minigames:** short minigames for house upkeep and lawn care also earn coins.
- **Unlocks:** Sandbox has every piece, clothing and design option from the start. In Life mode, coins from gigs and chores buy most pieces in the catalog, and memory book pages, visitor friendships and holidays unlock special sets coins can't buy.

**Coins and prices** (*Claude draft*, Nov 25, Keegan said go ahead). Tuned so that about 20 minutes of play buys one big piece, with no grind.

- **Start:** Life mode opens in the Philly home, already furnished with their real things, plus 500 coins.
- **Pay:**

| Earned by | Coins |
| --- | --- |
| A chore minigame | 20 to 40, more for a tidy job |
| An ordinary gig (style a room corner or an outfit) | 100 to 200, more the happier the visitor is |
| A neighbor's story gig | 250 |
| Redoing a neighbor's whole home | 600 |
| Cooking, cat care, gardening | No coins. They fill needs, grow plants and add memory book moments |

- **Prices:**

| Piece | Coins |
| --- | --- |
| Small decor (a plant pot, a frame, a pillow) | 25 to 75 |
| Clothes and accessories | 50 to 150 |
| Seeds | 5 to 20 a packet |
| Everyday furniture (a chair, a lamp, a rug) | 100 to 300 |
| Big pieces (a sofa, a bed, a piano, a fridge) | 300 to 600 |
| Walls and floors | 5 a tile |
| Doors and windows | 50 each |
| An empty lot | Free |

- **Nothing is lost** (pillar 3): selling a piece back gives every coin back, so trying things out costs nothing. There are no bills, rent or costs that run while she's away.
- Holiday pieces go on sale in the catalog during their holiday, and stay hers after.

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

**The block** (Keegan, Nov 25): four made-up neighbors on a cozy Philly-style street, cast approved Nov 25. Each story is four visits. Every visit is a chat and one gig, friendship grows with each one, and the last visit opens their home for Sarah to redo. The set unlocks in steps like the memory book: a piece at visit 2, and the rest when their home is done. The beats are a *Claude draft*.

| Neighbor | Who they are | Story in four visits | Their home | Special set |
| --- | --- | --- | --- | --- |
| Dot | Retired florist in her 70s across the street. Best garden on the block, sharp but warm, and sneaks the cats treats | 1. Admires Sarah's garden and asks for a flower arrangement. 2. Trades plant tips, gig: a window box. 3. Her granddaughter is coming to stay, gig: an outfit for the train station. 4. Asks for help with the dusty sunroom | Sunroom into a guest room with plants everywhere | Vintage florist: a potting bench, a flower cart, a wicker chair, a big fern |
| Marco and Jules | Young couple who just moved in next door, with a baby on the way. Still living out of boxes | 1. Say hi from behind a wall of boxes, gig: a cozy corner to sit in. 2. Gig: a "we live here now" living room. 3. Gig: comfy maternity outfits for Jules and a dad look for Marco. 4. The baby is coming soon, so they ask for help with the nursery | The nursery, plus the rest of the boxes unpacked | Soft nursery: a crib, a mobile, a rocking chair, a cloud rug |
| Theo | Shy painter in a tiny studio on the corner. Talks to his plants more than to people | 1. Asks for help picking an outfit to sell paintings at a market. 2. Gig: a spot by his window to paint in. 3. Gets into his first art show, gig: an outfit for opening night. 4. Asks for help turning the mess into a loft fit to show off | Studio into a gallery-ready loft | Artist loft: an easel, paint-splattered rugs, a hanging gallery wall, a daybed |
| Priya | ER nurse on night shifts, with a goofy rescue dog named Biscuit. Can never relax at home | 1. Biscuit gets loose and runs into Sarah's yard, gig: a dog bed. 2. Gig: off-duty clothes that aren't scrubs. 3. Gig: a calm corner for her morning wind-down after a night shift. 4. Asks for a whole calm bedroom and a reading nook | Bedroom and reading nook | Cozy calm: blackout curtains, a reading chair, a tea cart, a dog bed for Biscuit |

- **After the story:** each neighbor keeps dropping by now and then with an ordinary gig, and comes to Sarah's holiday parties.
- **Biscuit** is the first animal besides the cats, as a neighbor's dog that visits. He's never Sarah's to look after (Ideas inbox: other animals later).

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

### Challenges

Set Nov 25, 2026 (Keegan): **client briefs with a twist.** A client wants a room, yard or outfit on a theme, plus one twist: a budget, a must-have, one color, a piece limit and so on. She designs it, the client rates it with 1 to 3 stars, and she earns reward pieces. There are no timers and no way to fail (pillar 3).

*Claude draft, for Keegan's review:* the starting list of 14 challenges, with 8 spaces and 6 outfits.

| # | Client and brief | Twist | Kind |
| --- | --- | --- | --- |
| 1 | A winter cabin living room for a couple escaping the city | Must have a fireplace and three throws or blankets | Room |
| 2 | A tiny studio for a student | The whole home (bed, kitchen, seating) in one 6 × 6 room | Room |
| 3 | A first apartment's living room | A budget of 800 coins | Room |
| 4 | A calm bedroom | One color family only | Room |
| 5 | A sunroom for a plant collector | At least 12 plants | Room |
| 6 | A cat café corner | A nap spot and a play spot for both cats | Room |
| 7 | A grandma's kitchen refresh | Keep the three old pieces she loves | Room |
| 8 | A garden party yard | String lights and seats for six | Yard |
| 9 | A date-night outfit | Something red | Outfit |
| 10 | A rainy-day outfit | A coat and boots, and still cute | Outfit |
| 11 | A costume party look | Dress as a season | Outfit |
| 12 | Matching pajamas for a couple | Both outfits match | Outfit |
| 13 | An interview outfit for a design studio | Three colors at most | Outfit |
| 14 | A reading nook | 8 pieces at most | Room |

- **Rewards** (*Claude draft*): the first time she finishes a challenge, she gets one themed piece. Her first 3-star result on it gives a second piece. The pieces join her Life catalog as a special set, and each finished challenge hangs a ribbon on the Challenges board.

### Keeping designs

- **Favorites:** she saves outfits and whole rooms as favorites to reuse in any home or mode.
- **Camera:** a camera button saves a clean picture of a room or outfit to her phone, and she can add it to the memory book.

## Homes and people

- **Starter home** (Keegan, Nov 25): their future home in Philly, with their cats. Keegan and Sarah don't live in Philly yet, so the house is the red-brick rowhouse from the title screen, a dream of their next chapter, furnished inside with their real furniture and things drawn from Keegan's photos. No street address anywhere.
- **Holiday things** (Keegan, Nov 25): year-round, Christmas first. The Christmas set is built first, then Valentine's, Halloween, Thanksgiving and more, each with its own decorations and items.
- **Birthdays** (Keegan, Nov 25): Sarah's is August 31 and Keegan's is March 17, on the real date like the holidays.
  - On her birthday, the home wakes up with balloons and a cake, Keegan has a gift and a note waiting for her, and the cats wear party hats.
  - On his, she can throw him a party. It's also St. Patrick's Day, so the decorations are green.
  - Both go in the memory book's Holidays chapter.
- **Anniversary** (Keegan, Nov 25): July 10. The home is dressed for a date night in: candles, flowers on the table and a special dinner to cook together, with a note from Keegan on her pillow. It goes in the memory book's "two of us" chapter.
- **The cats** (Keegan, Nov 25): Louie, a slim grey-and-white cat with a white blaze up his nose and sleepy yellow-green eyes (`mockups/louie-v1`), and Ralph, a big orange tabby with white socks and a white blaze, clearly bigger than Louie (`mockups/ralph-v1`). Ralph has an optional outfit: a red bowtie with a small silver bell.
- **People** (Keegan, Nov 25): Keegan and Sarah are drawn to look like themselves (`mockups/people-v1`, approved as a starting place), and she can restyle their hair and outfits.
  - **Sarah:** copper curls, freckles, grey-blue eyes, glasses on or off, gold hoops. She has several hairstyles (pinned up, loose bob, long curls, ponytail to start), but her hair is always ginger: restyle, never recolor.
  - **Keegan:** buzz cut, full beard trimmed to his jaw, open eyes (they only narrow when he grins), nose stud, cap on or off.
  - **Clothes:** their real outfits from Keegan's photos are references for the Style catalog. One must-have: the **ORANGE ROCKS tee**, from Sarah's childhood shirt. Bright orange with white rounded letters, "ORANGE ROCKS" on the front and "AND SO DO I" on the back.
  - **Creator:** lets her make extra people for other homes.
- **Other homes** (Keegan, Nov 25): she builds them from scratch on empty lots: walls, doors and rooms, then furniture.
- **Room size:** rooms and homes can be much bigger than one screen. The approved mockup shows one 10 × 10 tile room only because it fits the screen; the view scrolls over bigger homes. How it scrolls and zooms is set in Building.

## Decorating

Set Nov 25 (Keegan). Mockup: `mockups/decorate-v1` (UI approved; the furniture in it is a stand-in, and Furniture art below sets the real look).

- **Catalog size:** about 80 furniture and decor pieces at launch, with more added as needed.
- **Catalog tabs:** sorted by type: seating, tables, beds, storage, lights, plants, rugs, wall and decor. Two more tabs: **Ours**, holding their real things from Keegan's photos, and **Holiday**. Each card shows small dots for its color choices.
- **Placing:** big pieces snap to the floor tiles and turn 4 ways. Small things stack on tables and shelves, and the spot glows green when a piece will stack there. Art and shelves hang on walls.
- **Picking a placed piece:** tap it for turn, move and put-away buttons over it. The tray shows its name, its swatches, Paint, Put away, Move and Done.
- **Colors:** both quick and free. Each piece has 4 to 6 hand-picked swatches that always look good together. Paint mode lets her color each part (for example fabric, wood, cushion) with any color from a 24-color cozy palette.
- **Sandbox top bar:** shows the mode and the home's name instead of the day, time and coins.

### Furniture art

Set Nov 25 (Keegan). Mockups: `mockups/furniture-detail-v1` (the three detail levels; C is the pick) and `mockups/furniture-sheet-v1` (one approved piece per tab, the style guide for all ~80).

- **Rich detail:** outlines, 3 to 4 tones, fabric texture, wood grain, piping, patterns and little props. Same isometric grid and light as the approved room (light from the upper left).
- **Texture works under any color:** fabric texture is light shading only, so it shows under any swatch or paint color. A pattern replaces the texture on the part it's painted on.
- **Props, both ways:** each piece comes dressed (mugs, books, pillows, a throw). A switch on the piece hides its props. Props are also their own catalog pieces she can stack anywhere.
- **Some pieces move:** lamps glow and flicker, plants sway, mugs steam, fires crackle, TVs flicker, records spin, tree lights twinkle. Everything else sits still.
- **Chairs and sofas** (Keegan, Nov 25): arms sit higher than the seat cushion, a solid front panel closes the base under the seat, and rolled arms end in round scrolls up at the top front of the arm.

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

## Title and cover

Set Nov 25 (Keegan: "I absolutely love it"). Mockup: `mockups/title-v1` (the gift, the opening, the title, and the cover).

- **The scene:** a red-brick Philly rowhouse at night, with a white marble stoop, warm lit windows, a wreath on the door, the tree in the front window, and Louie and Ralph in an upstairs window. Snow falls, the porch light and street lamp glow, and the chimney smokes. Keegan and Sarah don't live in Philly yet, so this rowhouse is drawn, not copied from photos, and it stays as it is.
- **Seasons:** the title and the cover both follow the real date. Winter has snow, with Christmas lights in December. Spring has rain and flower boxes. Summer is a warm evening with fireflies. Fall has falling leaves, with a pumpkin on the stoop near Halloween. Other holidays add a small touch to the stoop or windows.
- **First open, once only:** a wrapped gift fills the screen (pink polka-dot paper, a gold bow, a "To Sarah" tag). She taps to pull the ribbon, and it opens onto the snowy home. Ribbon bits drift down, and a short Christmas line from Keegan appears ("Merry Christmas, Sarah", signed Keegan). Keegan writes the real words. Tapping goes in. After this the gift never shows again.
- **Title:** the game's name in gold over the scene, with "A cozy life" and a heart under it. The menu card has Continue (with her day), Sandbox, Life and Challenges, plus a small Import a save link.
- **Cover (120 × 80):** a small version of the same scene with the title on it (`studio-bible/launcher.md`, Covers). It changes with the seasons too.

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
