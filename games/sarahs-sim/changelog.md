# Sarah's Sim changelog

What the Developer has built, newest first. The Designer reads this before every rules check.

## Nov 26, 2026: the cats' needs (Dev)

Spec 006 part D, the cats. Rules and content, with no new screens.

- **Hunger, play and the litter box** for Louie and Ralph, in Life only. They drain at the same rate as people's needs, only while she's playing, and are saved.
- **When one is low, the cat only nudges her** (bible, The cats: never bad):
  - Hungry: Louie sits by the bowl, chatting. Ralph flops by the fridge.
  - Bored: a cat knocks a small thing off a table onto the floor. It's still there to pick back up.
  - A dirty box: a grumpy face by it.
- **The fixes:**
  - Fill the bowl: tap the cat bowls, then Fill. Both cats come running.
  - Scoop the box: tap the litter box, then Scoop.
  - Play with a cat (the feather wand). It counts double for Ralph.
  - A treat helps hunger a little.
- **Two new pieces in Decor**, because spec 006 names them: cat bowls (kibble shows when they're fed) and a litter box (it shows clumps when it needs a scoop). A new home starts with the bowls in the kitchen and the litter box in the bathroom.
- **Saves already on the phone** keep their home as it was. Place the bowls and the box from Decor to start caring for the cats.
- `npm run check` now tests each nudge and each fix, and that a knocked-over thing is never lost.

## Nov 26, 2026: the title and cover in every season (Dev)

Spec 001 part A said winter came first and the other seasons would follow before Dec 25 if time allowed. They're done.

- The title and the launcher cover follow the real date:
  - **Winter** (December to February): snow, the wreath on the door and, in December, the tree in the front window.
  - **Spring** (March to May): rain and flower boxes under the windows.
  - **Summer** (June to August): a warm evening sky with fireflies.
  - **Fall** (September to November): falling leaves, with two pumpkins on the stoop in October.
- Outside December, the front window holds a potted plant instead of the tree.
- The snowy ledges turn to plain stone outside winter.
- The first-open gift keeps its snow, since it opens on Christmas.
- Other holidays' small touches come with spec 009.

## Nov 26, 2026: needs and more together time (Dev)

Spec 006 part C, and the together actions from part D. Rules and content on the home screen, with no new screens (the meters are drawn as in the approved `cooking-v1`), so this goes ahead while the playtest notes come in.

### What was built

- **Needs (006 C).** Sarah and Keegan have energy, hunger and fun. They go down only while the game is open, from full to low in about 40 minutes of play, and are saved with Life (Sandbox has none). Actions fill them as spec 006 part B's table says. For example, Sleep fills energy, Snack fills hunger, and Paint, Read and Watch a show fill fun.
- **When a need is low:** below a quarter, Sarah yawns, sighs or her tummy rumbles now and then while she's idle, and her actions take a quarter longer. That's all; nothing can go wrong.
- **Meters:** tapping Sarah shows her three meters (an icon, a word and a bar each, with LOW in words, so color is never the only sign). Tapping Keegan shows his beside his bubble, as in `cooking-v1`. Keegan looks after his own needs.
- **Together actions (006 D):** Keegan's bubble now has Chat, Hug, Kiss, Cuddle up, Play a game, Go to bed, Cook together ("Coming soon", it comes with the Cooking screen) and Wind down ("Coming soon", it needs its own pieces). Cuddle up and Lie in also work from a sofa's or bed's bubble. Keegan walks over from wherever he is, even another floor, and settles in beside her; both their needs fill. Afterwards he goes back to his desk.
- **Hug and kiss pools:** each picks a line from its own pool with no repeats until the pool runs out (saved). The real variations are private data, so the placeholder file holds one line each for now.
- `npm run check` now also tests:
  - the drain rate, and that a low need nudges and slows Sarah;
  - that a snack fills hunger;
  - that every together action brings Keegan along and fills his needs;
  - that needs are saved, and that Sandbox has none.

### Changes from the spec

- Keegan's needs are shown and filled by together actions, but he only tops himself up gently on his own. His real day (idle life) is still to come.
- The first kiss's memory book moment waits for the memory book.

### What's left in spec 006

- Part D: Keegan's idle life (it needs the private pools), the cats' needs (the bowl and the litter box aren't in the catalog yet), Sarah's phone.
- Parts E and F (Cooking, gigs and coins) come after Keegan's playtest notes, since they add screens.

## Nov 26, 2026: the rest of the starting catalog (Dev)

Keegan's call, Nov 26: while the playtest notes come in, finish the catalog (content only, no new screens, so it can go ahead under `studio-bible/studio.md`, Playtests).

### What was built

- **The other 39 pieces of spec 001's starting list**, so every tab now holds the full draft of 80 (plus the easel):
  - Seating: loveseat, reading chair with ottoman, kitchen stool, floor cushion.
  - Tables: long dining table, console table, kitchen island (in the kitchen and bath row), bistro table.
  - Beds: single bed, daybed, bunk bed, cat tree (the cats nap up top).
  - Storage: low cabinet, wardrobe (Change outfit, "Coming soon"), corner counter.
  - Lights: mushroom lamp (from `decorate-v1`), string lights (hang on a wall and twinkle), pendant light (set on a table, it hangs over it), candle cluster, salt lamp. All of them glow and turn on and off like the lamps.
  - Plants: fiddle leaf fig, pothos on a shelf, herb pots, hanging plant.
  - Rugs: runner, braided rug, sheepskin.
  - Wall: gallery set, macramé hanging, cork board, mounted TV (Watch a show), window plants shelf (goes on a window).
  - Decor: throw pillow, knit throw, laundry basket, cat toy basket, candles, globe, fruit bowl.
- Each has 4 to 6 swatches (the check now tests that for every piece), paintable parts, props where it has any, and all four turns. Beds, the daybed, the reading chair, the floor cushion and the stool get their Life actions (Sleep, Nap, Sit).
- The Philly home gained a few: string lights in the living room and the bedroom, the pendant over the dining table, herb pots on a counter, a cat tree in the craft corner, a wardrobe and a sheepskin in the bedroom.
- `npm run check` now also checks each tab holds the starting list's count, and the new pieces are on the contact sheet.

### Changes from the spec

- The pendant light is a small piece set on a table (it hangs above it from the ceiling), since there's no ceiling to place on yet. The kitchen island sits in Tables, in its kitchen row.

### What's left

- Same as the slice entry below; buying (prices) still waits for spec 006 part F.

## Nov 26, 2026: first playtest slice (Dev)

Built from the Designer's playtest prompt of Nov 26: spec 001 parts A, B, C, D and F, and spec 006 parts A and B, with a first batch of the catalog.

### What was built

- **Setup.** `game.json` (id `sarahs-sim`, save prefix `ss.`, Dev only), the 120 × 80 winter cover from `title-v1` in `assets/cover.js`, `src/` with `npm run check`, and this changelog. The game uses the studio shell and input with no L or R (bible, Controls and screen).
- **Opening the game (001 A).** The gift on the very first launch only (tap, A or a drag pulls the ribbon; the lid lifts off, ribbon bits drift down), then the snowy rowhouse with the Christmas card, then the title in winter with December's lights. The title menu has Continue (once there's a save; it opens the mode played last), Sandbox, Life, Challenges ("Coming soon") and the small Import a save link, by tap or buttons. The Start menu (Start, or the menu button on the right) has Back to home, Homes (the Philly home card, "You are here"; New lot shows "Coming soon" in Sandbox), Make a backup and Title working; People, Favorites, Camera and Memory book show "Coming soon". Its bottom line says when it last saved.
- **Saves (001 A).** One autosaved save per mode (`ss.sandbox`, `ss.life`), the gift kept once for the whole game (`ss.gift`), `ss.favorites` kept (empty for now), a save version (1) with the upgrade-step frame, and save on close. Make a backup writes one file with every mode, the favorites and the gift (on the phone the share sheet opens, so it can go to Files). Import a save asks first, with the cursor on Not yet, then replaces what's on the phone. About once a month the title offers a backup (Make it / Not now). `test-saves/v1-sandbox-and-life.json` is a real save from this build.
- **The home screen and the view (001 B).** The home in the diagonal view at the approved look's scale (22 px tiles), the top bar, the view controls (floors 1 to 3 with the floor below dimmed, the walls button cycling cut away, down and up), an undo button and the menu button, and the tray with Home, Style and Build tabs (Style and Build show "Coming soon"). Pinch zooms (1x to 3x, settling on half steps so pixels stay even), two fingers slide, and the D-pad slides. Louie and Ralph wander, take the stairs now and then, nap in their favorite spots (Louie on beds, sofas and the cat bed; Ralph on rugs and sofas), and walk over to see a newly placed piece, napping on it if it's cozy. Keegan sits at his desk in the study; in Sandbox Sarah sits on the living-room sofa. Tapping either shows "Style is coming soon".
- **The Philly home (001 F).** Prebuilt home data on its 16 × 16 lot, drawn to match `build-v1`: floor 1 has the living room at the front (big window with the tree, the front door), the dining nook and the kitchen at the back with the back door; floor 2 has a landing, Keegan's study, the bathroom with the tub and Sarah's craft corner; floor 3 is their bedroom with the window seat at the front. Stairs run along the left party wall with open stairwells and banisters above. Walls carry striped wallpaper with a wainscot inside and red brick outside; windows show the sky for the time of day with snowy rooftops; the yard behind is plain grass. It starts furnished from the batch below, about 20 pieces a floor.
- **Placing (001 C).** The catalog tray from `decorate-v1` with all 11 tabs and paged cards (thumbnail, color dots). Drag a card into the room: the piece follows the finger, snapped to the tiles, with green or rose tiles and a check or a cross. Let go to place it; if it doesn't fit, it slides back to the tray. Small things stack on free spots of tables, counters, the dresser, nightstands and shelves; wall pieces snap flat to a wall at eye height and slide along it; curtains go on windows; rugs go under furniture. Pieces never overlap, never block a doorway, and never go on or at the ends of the stairs. Tap a placed piece for the turn, move and put-away chips and the piece tray (name, swatches, Paint, Props, Put away, Move, Done); dragging a picked piece moves it. Put away sends it to storage (its catalog card then shows how many are stored). Undo steps back the last 10 changes. Buttons too: A moves the cursor into the catalog and takes a card, the D-pad moves a held piece a tile at a time, A places, B cancels, Select turns. Each piece's Props switch hides or shows its props and is saved per piece.
- **Colors and paint (001 D).** 4 to 6 swatches per piece; paint mode names each part on a button, with the 24-color palette and, on fabric parts, the six patterns (plain, stripes, plaid, floral, leopard, dots) replacing the weave. Fabric weave and wood grain are light shading only, so they show under every color (the check tests all 24). Each placed piece keeps its own colors.
- **The first batch of the catalog: 43 pieces.** Seating: club armchair, three-seat sofa, two-seat sofa, dining chair, desk chair, window seat cushion. Tables: coffee table, side table, round dining table, desk, nightstand. Beds: double bed, cat bed. Storage: bookshelf, dresser, then the kitchen and bath row (kitchen counter, sink cabinet, fridge, stove, bath tub, bathroom sink, toilet). Lights: floor lamp, table lamp. Plants: monstera, snake plant, small succulent. Rugs: wool rug, round rug, bath mat. Wall: framed print, floating shelf, mirror, wall clock (its hands show the real time), curtains. Decor: TV stand, record player, mugs, book stack, vase of flowers, picture frame, easel. Holiday: the Christmas tree. Ours: a "Coming soon" card for their real things, plus whatever she makes in Life. Every piece is drawn from boxes in its own space, so all four turns are right, following `furniture-sheet-v1` and the chair rules; lamps glow, plants sway, mugs and the stove's pan steam, the record spins and the tree lights twinkle.
- **The clock and the top bar (006 A).** Life reads the phone's clock. The four light looks (morning gold, bright daytime, an evening sunset turning to lamp glow, late night with dark windows, stars and lamp-glow pools) blend over about 20 minutes at each edge. Lamps come on on their own at 5 PM (and go off at 6 AM); Light on/off in a lamp's bubble turns one on or off any time. The top bar shows the weekday and date, the 12-hour time and coins (Life starts with 500); Sandbox shows the mode and the home's name. For testing, `?clock=21:30` on the page address sets the clock.
- **Playing as Sarah (006 B).** With the tray down, tap the floor to walk Sarah there, around furniture and up and down the stairs (the view follows her floor); the D-pad walks her a tile at a time. Tap a piece, a cat or Keegan for the action bubble from `cooking-v1` (A does the first action, B closes). She walks over and does it with a short animation and the slim progress bar; up to 3 more line up as icons under the top bar; tapping elsewhere stops everything. Starter actions: bed (Sleep, which fades to a cozy sleeping scene, and Nap), sofa (Sit, Watch a show, which turns the TV on), chairs (Sit), fridge (Snack), easel (Paint, Seasonal craft), tub (Bath; Louie often hops up on the edge), bookshelf (Read), lamps (Light on/off), TV stand (Watch a show), cats (Pet, Treat, Play) and Keegan (Chat, Hug, with plain stand-in animations). Cook, Find a gig, Video-call Mom, Change outfit (dresser and mirror) and Go to the yard (the back door) show "Coming soon" in the bubble. Paint makes a painting from a pool of 6 and the seasonal craft one of 4 for the season (16 in all); neither repeats until the pool is used up (saved), each goes in her Ours tab, and the first copy goes up near where she made it.
- **Private data.** `src/private.example.js` holds the placeholder with the right shape (the Christmas line reads "Merry Christmas, Sarah." signed "Keegan"). The real file goes at `src/private.js`, which git ignores; the build makes `dist/` from the placeholder only, every time, and a second copy in `dist-private/` (also ignored) when the real file is there. `npm run check` passes on the placeholder build.
- **Shared engine (for any game):** `engine/iso.js` (the isometric grid, box drawing, back-to-front sorting, four-tone color ramps, a zoom and pan camera), `engine/gesture.js` (tap, drag, pinch and two-finger slide on the canvas), `engine/path.js` (shortest walks, with stairs), `engine/backup.js` (a backup file out and in). `engine/shell.js` takes `data-shoulders="off"` to leave out L and R, and `engine/input.js` skips buttons that aren't there. Other games are unchanged (the launcher's check and Life After's check pass).

### Checks

- `npm run check`: sizes (320 × 480, 375 × 550, 375 × 667) with no L or R and the top bar fitting at the longest time; the gift once; the title by buttons and tap; one save per mode; Continue; the backup round trip; the furnished home on 3 floors with every tile reachable; placing by buttons and by touch, including slide-back, the rules, the chips and Put away; undo of 10; swatches, paint, patterns, texture under every color and props after a reload; zoom, slide, floors and walls; the cats wandering and napping on a new piece; the four light looks and lamps at 5 PM; walking up two flights; every starter action, the crafts and the queue of 3; the test save; the contact sheet (`src/dist/contact-sheet.png`, every piece in all four turns and every pose).
- **Side by side with the mockups at 375 × 667** (`studio-bible/studio.md`, Playtests), screens in `src/dist/screen-*.png`: the gift, the Christmas card and the title match `title-v1`; the catalog, piece and paint trays match `decorate-v1`; the Start menu and Homes match `start-menu-v1`; the floors and walls buttons match `build-v1`; the action bubble matches `cooking-v1`; people and cats are drawn from the approved reference code. Fixed after the side-by-side: the rose glow under a picked piece, December's string lights on the walls that stay up, the night light (it read hazy; it now darkens like the mockup's night), and the camera sitting the house under the tray.
- Played start to finish in the browser at 375 × 667: gift, title, Sandbox, decorating on all three floors, reload, Life at each time of day (clock set), walking and every action, backup and import.

### Changes from the specs (for Keegan)

- The house is 8 × 12 tiles instead of "about 8 × 14", so a yard of 4 rows fits behind it on the 16 × 16 lot.
- An easel was added to Decor (not in the 80-piece list) so the craft corner has something to paint at (spec 006's "Easel or craft table").
- With no whole-home rotation, wall pieces hang only on the side of a wall that faces you (the back walls, and the walls between rooms facing the room in front).
- Doors between rooms are open doorways; the front and back doors are closed doors.
- Lie in and Cuddle up (with Keegan) show "Coming soon", since they're together actions beyond Chat and Hug.
- The home opens on the whole floor at the approved look's own scale (the mockup shows one room filling the screen); pinching in gives the close view. One finger on empty floor also slides the view.
- In Life, tapping Home lifts the catalog to decorate; with it down, taps are for playing.
- Continue on the title shows the mode (and the weekday for Life) instead of "Day 12", since Life has no game days.
- Sandbox, which has no clock, keeps the approved look's daylight with the lamps on.

### What's left

- Spec 001 part E (Favorites and the Camera), the other seasons on the title and cover, the rest of the 80 pieces, the Ours pieces from Keegan's photos.
- Everything the prompt leaves for later: needs and meters, Keegan's idle life, cat needs, cooking, gigs and buying (no prices show yet; in Life pieces are free for now), Style, the Creator, the Build screen, the garden and chores, the memory book and notes, visitors, holidays beyond the tree, Challenges.
- Waiting for Keegan's notes from the phone before building anything with new screens.
