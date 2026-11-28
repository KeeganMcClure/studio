# Sarah's Sim changelog

What the Developer has built, newest first. The Designer reads this before every rules check.

## Nov 28, 2026: the Build screen, lots, rooms and walls (Dev)

Spec 004, parts A and B, from `build-v1`. Playtest gate: Keegan plays this before parts C and D.

### What was built

- **Homes she can change:** each save now keeps its own copy of a home's rooms and walls once she builds on it. The save version goes from 1 to 2; older saves are backed up first, then upgraded, and open exactly as before.
- **Lots:** small 16 × 16, medium 24 × 24 and large 32 × 32, each grass with a path to the front.
  - Start → Homes lists the Philly home and the street's three empty lots (one of each size), each with its size.
  - In Sandbox, Homes also has **New lot**, where she picks a size and starts fresh.
  - Going to another home leaves everyone at home just as they were; coming back picks up where they left off. If she closes the game on a lot, it opens there again.
- **The Build tab** (Home / Style / Build in the tray):
  - the 8 tools as icons, the picked one named with a hint, and cards for it;
  - walls switch to cut away while she builds, and the lot's name and size show under the top bar, as in `build-v1`.
- **Room tool:** drag a box on the floor. A ghost room with walls follows her finger, with a size tag ("5 × 6"), a check or a cross, and in Life its price. Letting go builds four walls and a floor in the picked wall style (7 styles, Nina's wallpaper included).
  - The smallest room is 2 × 2, and nothing goes past the lot's edge; the ghost turns rose with a cross and says why.
  - A room against another room shares the wall between them.
- **Wall tool:** drag a line along the tile edges. A wall across a room cuts it into two rooms, and walls that close in a space make it a room with its own floor.
- **Picking walls:** with the room or wall tool, tap a wall to pick its whole straight stretch. The chips (or the D-pad) move it a tile at a time, and the cross erases it.
- **Erase tool:** tap a wall to erase it, or a floor tile to take it out.
  - Erasing the wall between two rooms opens them into one room. Erasing an outside wall leaves the room open on that side.
- **Nothing lost:** furniture that no longer fits after a change goes to storage, with what was stacked on it. People and cats standing in the way step aside.
- **Undo** steps back through the last 10 changes, walls and coins included.
- **Life prices:** walls and floors 5 coins a tile, shown on the ghost before she lets go. Erasing gives back what she paid on that home. A change she can't afford isn't built. Sandbox is free.
- **Memory book:** "First wall on an empty lot" fires the first time she builds on one.
- **Buttons:** A starts a room box (or wall line) in the middle of the view, the D-pad stretches it, A builds and B cancels. With a wall picked, the D-pad moves it and A erases it. B leaves the Build tab.

### Also fixed

- Saving while a piece was lifted to move could drop it, and what was stacked on it, if the app closed right then. A code comment had swallowed that line in the coins update; it's back.

### What's left

- Parts C and D (doors and windows, the floor and paper tools, upper floors and the four kinds of stairs) come after Keegan's playtest. Their tools are in the row but say they come next.
- Part E (naming a home, moving in, "A whole new home finished").
- The street itself (spec 008). Until then, its three lots are in Homes.

### Checks

- `npm run check` passes, with a new Build section at 375 × 667 and 320 × 480:
  - every lot size opens, and the 8 tools show;
  - the D-pad slides across a large lot;
  - rooms are built by dragging with the size tag, and the rules hold;
  - walls cut rooms, and walls closing in a space make a room;
  - walls are picked, moved and erased, and floor tiles are erased;
  - undo works, nothing is lost on the Philly home, and changes are kept after reopening;
  - Life charges and refunds.

### Changes from the spec

- The street's three lots are listed in Homes until the street (spec 008) is built.
- Upper floors keep the floors the home already has. Building new floors comes with part D, though a room on floor 2 or 3 of the Philly home already has to sit over a room below.
- Moving a wall's chips use ‹ and › for the two directions, since a wall only moves across itself.

## Nov 28, 2026: Nina's wallpaper (Dev)

Bible To do (Keegan, Nov 26); spec 004, part D; `mockups/papers-nina-v1`.

### What was built

- **Nina's wallpaper:**
  - cream paper with small calico flowers in red, blue and pink, plus pale tan sprigs, in a loose diagonal repeat;
  - a floral lattice border along the top, a chair rail, then dark brown wood paneling and a baseboard;
  - it's drawn from the mockup's own code as a texture along each wall's slant, at one game pixel per pixel, continuing from one tile of wall to the next. A cut-down wall shows the paneling at its foot.
- It's in early as a fixed paper on the **dining nook's** walls, as the To do allows. It joins the Paper tool's list when the Build screen is built.

### Checks

- `npm run check` passes.

### Changes from the spec

- "Takes the palette" (recoloring it) comes with the Paper tool.
- The dining nook was my pick; it can move to any room.

## Nov 28, 2026: coins, the shop and gigs (Dev)

Spec 006, part F, from `gig-v1`.

### What was built

- **The shop is the catalog.** In Life, each card shows its price with a coin.
  - Taking a card she can afford holds the piece, and setting it down buys it: the coins come off the top bar, and the first one is a memory book moment.
  - A card she can't afford says so, with how much she has, and that gigs pay 100 to 200.
  - Pieces in storage are already hers and place free. Her own crafts say YOURS. Holiday pieces keep their "This season" and "Back in December" labels.
- **Selling back:** a bought piece's tray has SELL. It asks first, with the cursor on Keep, then refunds every coin she paid; anything stacked on it goes to storage. Starting pieces were never bought, so they're put away instead.
- **Favorites in Life:** pieces she doesn't own show their total price first, with Only mine or Buy all.
- **Sandbox** stays free, and there are still no bills, rent or running costs.
- **Gigs:** Find a gig at the desk offers 2 or 3 gigs from the four neighbors on the gig card from `gig-v1`:
  - who asked, with friendship hearts;
  - what they want in one line, and where;
  - three likes and the pay;
  - "Pieces are lent free"; swipe or the D-pad for the others; Not now or Accept.
  - The pool is 8 room gigs, two per neighbor, and they don't repeat until they've all been offered.
- **Doing it:**
  - Accept opens their own small room, empty and windowed, to decorate with the normal catalog;
  - every piece says FREE and is lent, so her coins and her home are never touched, and her home's save stays exactly as it was;
  - the banner (in place of the top bar) shows who it's for, the ask, the three likes ticking green as the design matches them, "2 of 3 likes matched" and HAND IN;
  - Start asks whether to leave the gig.
- **Judging:**
  - 1 to 3 hearts, one per like matched (at least one: there's no wrong answer);
  - 100, 150 or 200 coins, and +1 friendship;
  - the card shows the design, what they say and a hint for a like they missed;
  - Try again goes back to the room, and Done pays and brings her home as she left it.
  - The first gig is a memory book moment.
- **The likes:** plants, books, a comfy seat, a little table, a rug, soft light, art, soft things (fabric pieces), warm colors and cool colors.

### Checks

- `npm run check` has a coins-and-gigs section:
  - cards show prices; taking holds the price, and setting down buys it with its moment;
  - selling back asks on Keep and refunds every coin;
  - she can't take what she can't afford, and Sandbox is free;
  - coins are kept;
  - Find a gig offers 2 or 3; accepting opens their empty room with free pieces, without changing her home's save;
  - Hand in rates by likes matched and pays 100 to 200 with friendship and the moment, and Done brings her home as she left it;
  - an empty room still pays 100.
- New screen: `src/dist/screen-gig-375x667.png`.

### Changes from the spec

- **Who asks:** gigs come from the four neighbors before she's "met" them, since visits come with spec 008.
- **Portraits:** only Dot has an approved drawing (`visitor-v1`). Marco and Jules, Theo and Priya show a soft card with their initials until they're drawn for spec 008. The Designer may want those portraits mocked up.
- **Not yet:** outfit gigs come with Style (spec 002). A visitor bringing a gig to the door, story gigs (250) and whole homes (600) come with spec 008.

## Nov 28, 2026: cooking (Dev)

Spec 006, part E, from `cooking-v1`.

### What was built

- **Starting it:**
  - tap the stove or the fridge and pick Cook, or tap Keegan and pick Cook together;
  - in Sandbox, a picked stove or fridge has a COOK button on its tray.
- **The recipe card:**
  - one of Keegan's nine dishes, drawn on its plate or pan;
  - what goes in, and its steps, each with how it plays (HOLD, STIR, CHOP, STACK);
  - swipe, the arrows or the D-pad for the other dishes; COOK or BACK.
- **The steps**, each a short one-thumb game at the counter. Keegan cooks his half beside her, and Ralph sits on the floor and stares.
  - **Hold:** hold the pan and let go when the gauge reads Just right (A starts the heat, A again stops it).
  - **Stir:** circle a finger round the pan three times (or tap A).
  - **Chop:** swipe down across the board, five cuts (or A).
  - **Stack:** tap when the swinging layer is over the plate, three layers (or A).
  - There's no timer and no way to fail: an off step still makes the dish, and the plate gets one to three sparkles.
  - A whole dish takes about a minute or two.
- **The plated card:** the dish, its sparkles and "SO GOOD", COOK AGAIN or SERVE.
  - Serve puts it on a table, and Ralph comes over.
  - Eating it fills hunger for both of them; eating Keegan's own meals now does too.
- **Memory book:** each dish the first time adds its Kitchen moment, and the first dish ever adds "Cooking together, first time".
- Cooking pays no coins, and store-bought things are always in the pantry.

### Checks

- `npm run check` has a cooking section, at 375 × 667 and 320 × 480:
  - Cook from the stove's bubble opens it;
  - all nine dishes play to the end by buttons alone;
  - each adds its moment;
  - Serve puts it on the table, and eating fills hunger for both;
  - the Sandbox tray has Cook.
- New screen: `src/dist/screen-cooking-375x667.png`.

### Changes from the spec

- **Garden veggies:** the pantry is part of the garden (spec 005), which isn't built yet. The recipe card and the garden sparkle are ready for it (`SS.pantryHas`), and show once there's a pantry.
- **How each step plays** comes from its words in the bible's recipe table:
  - warm, toast, fry, sear, char, brown, crisp, cook and melt are Hold;
  - boil, simmer, season, mix, toss, scramble and fold are Stir;
  - slice is Chop;
  - fill, roll, plate, layer, stack, load and "cheese on top" are Stack.

## Nov 28, 2026: favorites and the camera (Dev)

Spec 001, part E, from `favorites-v1` and `camera-v1`.

### What was built

- **Favorites** (Start menu, Favorites):
  - a menu card with Rooms and Outfits tabs and a two-across grid; each room favorite shows a small picture of the room as saved, its name and its piece count;
  - the last tile is **Save this room**: a banner asks her to tap a room, and it keeps every piece in that room (spot, turn, colors, props, what's stacked on it and what hangs on its walls, on the room's side), plus the room's floor and wallpaper;
  - it gets a short name like "Cozy living room", and she can type her own when the phone asks;
  - favorites are kept once for the whole game, in every mode, with no limit; the grid pages with the D-pad.
- **Using a favorite:**
  - pick it, and the menu closes;
  - a banner shows it with Cancel, the room in the middle of the view glows, and a note says pieces that don't fit go to storage;
  - tap any room in any mode: every piece that fits is placed, the rest go to storage, and the room takes the favorite's floor and wallpaper.
  - Undo steps it back. A works the middle room and B cancels.
- **The Outfits tab** says outfit favorites come with Style (spec 002).
- **The camera** (Start menu, Camera):
  - only the room shows: everything outside the frame is dark, with corner marks and a faint grid;
  - she can still pinch, slide and flip the walls;
  - the heart (or A) takes the picture.
- **The picture:**
  - it's clean, cut from the world itself with no tray, bar or buttons, and scaled up crisp;
  - it goes to her phone through the share sheet (Photos or Files);
  - a small copy goes into the memory book's Photos.
  - It drops in as a tilted print with the home's name and the date, and a note says it's saved and added, with Share and Done.
- **The memory book's Photos tab** now shows her photos. Tapping one lets her add it to a chapter as an extra page (not counted toward the chapter) or take it off again. The book keeps up to 60 and asks before the oldest goes.
- **Memory book moments:** First favorite saved, First photo taken.
- **Shared engine:** `engine/backup.js` has `saveFile(blob, name)`, the share sheet (or a download) for any file, which backups now use too.
- **Each save can now give a room its own floor and wallpaper** (`roomLook`). The home's data is copied per save, so this never reaches the other mode. Nina's wallpaper will use the same thing.

### Checks

- `npm run check` has a favorites-and-camera section:
  - Save this room keeps every piece with colors, props, turn, floor and paper, and gets a "Cozy living room" style name;
  - it's shared by both modes;
  - using it in another mode's bedroom places what fits and stores the rest, with matching counts;
  - the room takes the floor and paper, kept for that save and not the other;
  - Favorites, A and a tap on a room work by touch and buttons;
  - the camera opens, and the picture goes in the book with the moment and no bars or buttons in it.
- New screens: `src/dist/screen-favorites`, `screen-camera` and `screen-camera-saved-375x667.png`.

### Changes from the spec

- In Life, placing a favorite is free for now, like every piece in Life, until coins and the shop (spec 006, part F). Then pieces she doesn't own will show their price first.
- The camera takes rooms. Outfits join it with Style (spec 002, part E).

## Nov 28, 2026: the memory book (Dev)

Spec 007, parts A and B: the moments and the book screen. Part B ends in Keegan's playtest (spec 007, build order), so parts C (Keegan's notes hidden around the home) and D (the reward pieces) come after his notes.

### What was built

- **The moments (part A).** All 72 moments from the bible's table, in seven chapters.
  - Each fires once and keeps its real date.
  - Each keeps a snapshot "recipe": the pieces, people and cats around it, the floor, the view's turn and the light. Its page redraws the scene from that, crisp, exactly as it looked, even after the room has changed.
  - A small card slides in at the top for about 3 seconds ("MEMORY BOOK · THE TWO OF US / A kiss"). Tapping it opens that page, and it never stops play.
  - One book is shared by Sandbox and Life, saved under its own key, and it comes along in backups.
- **The moments that can happen now:**
  - **The cats:**
    - Louie naps on a newly placed piece;
    - Louie on the tub's edge;
    - a treat for Louie;
    - Ralph on a toy basket;
    - Ralph near Keegan while he cooks;
    - Ralph takes Louie's warm spot;
    - the feather wand with Ralph;
    - both cats asleep at once.
  - **The two of us:**
    - a kiss;
    - cuddled up on the couch;
    - a cozy night in (a together action after 6 PM);
    - Keegan's game night;
    - a slow morning in bed (Lie in before 11 AM);
    - the anniversary on Jul 10;
    - the note under the tree, which also counts as the first note.
  - **Holidays:**
    - first snow;
    - the Christmas tree trimmed (5 or more holiday or light pieces on or around it);
    - Christmas morning, New Year's Eve, Valentine's Day, spring's first warm day, the Fourth of July and Thanksgiving;
    - both birthdays.
  - **Home:**
    - first room finished: a rug, somewhere to sit, and a piece hung on every wall, on the room's side;
    - ten rooms finished;
    - every room in Philly redone (3 pieces placed, moved or put away in each).
- **Still waiting on their systems:** the garden, cooking, coins, favorites, the camera, outfits, Building and visitors. Their moments fire when those parts are built. Ralph's red bowtie and the vacuum wait too.
- **The book screen (part B), from `memory-book-v1`:**
  - a rose cloth scrapbook with cream pages and nine tabs down the side (seven chapters, Notes and Photos);
  - two moments a page, each a taped-in snapshot with a hand-lettered caption and date;
  - moments not reached yet show as dotted frames, captioned "???" except in Home and Garden;
  - the reward ribbon (3 · 6 · 10) on each chapter's first page, with the count and the next reward;
  - it opens from the Start menu or a bookshelf's Memory book, and turns by swipe, the corner arrows or the D-pad (left and right for pages, up and down for chapters); B closes it.
- **Note found:** the note under the tree now opens on its own folded paper (`memory-book-v1`, state note) with PUT IN THE BOOK, and it files into Notes. Notes found open full size again from the Notes tab.

### Checks

- `npm run check` has a memory-book section:
  - 72 moments in seven chapters;
  - a kiss fires once, with a date, a snapshot and the pop card;
  - the snapshot stays the same after the room is emptied;
  - one book for both modes;
  - Jul 10 and Dec 25 add their moments;
  - the tree note opens and files;
  - at 430 × 932, 375 × 667 and 320 × 480: every tab draws, the D-pad and a swipe turn pages, and B closes.
- The Christmas check now expects the note on its paper.
- New screen: `src/dist/screen-memory-book-430x932.png`.

### Changes from the spec

- The reward ribbon shows a small wrapped gift for each step. The pieces themselves are drawn in part D, so until then a reached step says "coming in an update".
- The Photos tab says photos from the camera go there; the camera comes with spec 001, part E.
- The Notes tab counts 20 notes until Keegan's real notes go in the private file.

## Nov 26, 2026: the game fills the screen; the floors below keep their walls (Dev)

### What was built

- **No more empty bands (Keegan chose to grow the screen, for Sarah's Sim only).** The game was capped at 320 px tall, so on a tall phone it sat in dark bands above the top bar and below the tray.
  - The cap is lifted for this game (up to 560 px), so the screen fills the whole space between the title bar and the controls.
  - The title and the room view grow taller, and the tray stays at the bottom.
  - The shared `engine/move.js` fit takes an optional height cap, so other games keep 320.
  - Together with the safe-area fix from this morning, the title bar sits below the clock and the controls above the home bar.
  - Pixels stay crisp, scaled to the screen's width as before.
- **The floors below keep their walls (Keegan).** On an upper floor, the floor below always showed with its walls down, and on floor 3 floor 1 wasn't drawn at all, so the upper floor looked like it floated.
  - Now every floor below is drawn, with its walls as the walls button says.
  - With walls up you see the whole brick building; cut away shows each floor below with its near walls low.
  - The flight up from the floor below only shows over the walls when they aren't up.
- **Sarah's phone is an iPhone 15 Pro Max (430 × 932, Dynamic Island).** The check tests that size first, with its 59 px top and 34 px bottom safe areas. The title bar sits below the Dynamic Island, the controls sit above the home bar, and the game fills the space between them. The bible's Sarah's phone To do is ticked. Screen: `src/dist/screen-iphone15promax-430x932.png`, with the Island and home bar drawn in where they sit.
- **Nothing is lost mid-move.** While a piece is lifted to move, it's out of the home. A save at that moment (the app closing mid-move) now keeps it, and what's stacked on it, where it was.

### Checks

- `npm run check`: at 375 × 667, 375 × 812, 390 × 844 and 430 × 932 (the last three with a notch's safe areas), the game fills its screen with no bands, and the title bar shows below the status bar.
  - New screens: `src/dist/screen-life-<size>.png`.
- The two "kept after a reload" checks now reopen the mode from storage in the same page instead of reloading it.
  - This was the check that failed now and then. In this test browser, after the hundreds of saves the check makes, a reload can come before the last save reaches storage.
  - The save itself was always right, and no player saves that often.
  - With this change the check passed 3 runs in a row.

### Changes from the spec

- The bible's Controls and screen section still says the shell-space question is partly open, and `studio-bible/controls.md` still has the 320 px cap. Those are the Designer's to update: Sarah's Sim is now an exception to the cap. I ticked the To do only.

## Nov 26, 2026: sitting reads as sitting (Dev)

Keegan's bug: the sit pose was the standing drawing pushed down a little, so on the window seat she looked like she was standing on the cushion.

### What was built

- A new sitting drawing, the L of a seated person:
  - her hips are at the seat;
  - her thighs come forward toward the way she's facing, with light catching their tops;
  - her shins drop from the knees, with a boot at the bottom, toes forward.
- It's the same for Keegan, on every seat (sofa, chairs, the window seat), and the scrolling pose sits the same way.
- On a low seat like the floor cushion, they sit cross-legged, with a boot out at each knee.
- Blinks, the phone glow and the low-battery icon moved to match. The contact sheet shows the new sit.

### Checks

- `npm run check`: sitting on seats 5, 13 and 17 px high has legs below the seat, and on the taller ones a lap coming forward, wider than standing.

## Nov 26, 2026: lying in bed reads as in bed (Dev)

Keegan's bug: in bed, Keegan was drawn as his standing sprite turned on its side, flat across the screen, so he hung off the bed.

### What was built

- Lying in bed is now drawn along the bed itself, in its own direction:
  - the head rests on the pillow, sunk in a little;
  - the body is a bump under the quilt, from the chin to the foot of the bed, in the quilt's own colours (or their clothes' colour on a bed without a quilt);
  - on a double bed the two of them each get a side;
  - in every turn of the bed and the home, the farther of head and body is drawn first;
  - when the headboard is nearer than the pillow, it hides the back of the head.
- Bubbles and the progress bar sit over the head on the pillow.
- Scrolling in bed at night holds the phone up over her face, with its glow.

### Checks

- `npm run check`: for Lie in, both heads land on the bed in all 4 views of the home.
- New screen: `src/dist/screen-in-bed-375x667.png`.

### What's left

- The contact sheet still shows the old lying pose on its own. It's only used where there's no bed under someone.

## Nov 26, 2026: turning the whole home (Dev)

From studio PR #301 (bible, Building, Turning the home; spec 001, part B, What turning the home touches).

### What was built

- **The turn button** sits under the walls button on the right, in the same style, with a curved arrow and the word TURN. Each tap turns the whole home a quarter turn clockwise, so 4 taps bring it back to the front. It shows on every home screen, in both modes.
- **Select** turns the home when nothing is picked. With a piece picked or held, Select still turns the piece.
- **The walls follow the view.** Cut away and walls down lower whichever walls are nearest her in the view she's in, and keep the far outside walls up. December's string lights follow the walls that stay up.
- **Wall pieces hang on either side of a wall.** She hangs a piece on the side of the wall she's looking at, and each piece saves its side. A piece whose side faces away is hidden behind its wall, as in a real room. This replaces the "wall pieces hang only on the side of a wall that faces you" limit in the first slice's entry. Older saves keep their pieces on the side they were on.
- **Everything turns with it:** furniture, stacked things, rugs, doors, windows, stairs and banisters, the yard and path, the cats and the two of them. Furniture uses the 4 turns it already had, so no new art was needed.
- **Taps and drags land right in every view:**
  - placing, moving and stacking;
  - tapping things;
  - tap-to-walk;
  - the charger question marks and the bubbles;
  - the D-pad moves a held piece, and walks Sarah, the way it points on screen.
- **The camera stays put.** The turn keeps the same spot in the middle of the screen and the same zoom. The old view squeezes away to the left as the new one comes in, in 0.3 s, so she can see which way it turned.
- **Saved:** each home remembers the view she left it in. Older saves open from the front.
- **Shared engine:** the draw order (`engine/iso.js`) never compares two walls (they only meet at corners), so the game hands them over far to near. This fixes a pale inside wall that showed through a near brick wall in some views.

### Checks

`npm run check` has a new section that covers all 4 views:
- the turn button and Select, keeping the same spot and zoom, and the turn finishing in under half a second;
- near walls cut and far walls up;
- nothing drawing through a wall on any floor, walls up or cut;
- tap-to-walk landing on the tapped tile;
- a dragged piece landing on the tile under the finger;
- stacking;
- the D-pad matching the screen;
- wall pieces on both sides kept after a reload;
- the view saved, and an older save opening from the front.

New screens: `src/dist/screen-turn0` to `screen-turn3-375x667.png`. The button column fits at 320 × 480.

### What's left

- The Build tools (spec 004) aren't built yet; they'll use the same view when they are.

### Changes from the spec

- A wall piece on a wall that's cut away or down is hidden along with its wall, as before. The spec says a piece facing away "shows again when the walls are cut away or down". With its wall lowered there's nothing for it to hang on, so I kept it hidden. Keegan agreed (Nov 26): hide it with its wall.
- There was no To do line for turning in the bible, so there was nothing to tick.

## Nov 26, 2026: quicker hugs, the charger's hiding spots, Sarah's bubble, and new art (Dev)

### What was built

- **Hugs and kisses are quicker (Keegan).** A hug takes 3 s and a kiss 2.5 s (they were 5). For Chat, Hug and Kiss, Keegan now gets up and meets her halfway. A hug from across the house went from about 16 s to 8.
- **Lie in and the other together actions (Keegan).** Keegan sets off for the bed or sofa the moment she does. Before, he waited until she got there, which added about 10 s.
- **Hiding spots show (spec 006, Sarah's phone; studio PR #302).** During a charger hunt, a small bouncing question mark floats over every place the charger could be: each sofa, each bed, and Ralph.
  - The charger is in one of them.
  - A wrong guess gets a sigh and loses its question mark.
  - The right one finds the charger and clears all the marks; B, or tapping the floor to stop, clears them too.
  - This replaces the first-time-only hint.
- **What she's doing (spec 006, part C; studio PR #302).** Tapping Sarah opens her bubble with her name and what she's doing, like Keegan's: "SARAH · DOOMSCROLLING", with her phone battery on the line under it. When she isn't doing anything it just says "SARAH". Her actions each have a short name for this ("Napping", "Taking a bath", "Petting Louie"). A title too long for the bubble drops words from the end.
- **Doomscrolling art.** The pose read as a phone held to her ear. Now:
  - she holds the phone in both hands at chest height, with its screen toward her and her eyes lowered to it;
  - a soft screen glow lights her face, and her thumb flicks up the screen about once a second;
  - from behind, a glow shows around her shoulders;
  - it works sitting, standing and lying in bed, and in all 4 turns;
  - the low-battery despair (phone held up, red icon) is unchanged.
- **Bath art.** She now sits down in the tub:
  - only her head, bare shoulders and arms show over the rim, with her hair up in a towel;
  - bubbles are piled around her, with a few drifting up and wisps of steam;
  - her drawing is cut off at the tub's front rim, so the rim stays in front of her in every turn of the tub and every view of the home;
  - when the bath ends she steps out dressed.
- Both new poses are on the contact sheet.

### Checks

`npm run check` now covers:
- the question marks over every spot, a wrong guess losing its mark, and the marks clearing on finding the charger, on B and on stopping;
- tapping Sarah showing her activity and battery (and just SARAH when she's doing nothing), and every activity name fitting the bubble;
- a hug from across the house taking under 15 s with Keegan walking to meet her, and Keegan setting off at once for Lie in;
- the scrolling pose while she scrolls, and the despair when the phone is low;
- the bath pose in all 4 turns of the tub, and her stepping out after.

### Changes from the spec

- None. There were no matching To do lines in the bible to tick.

## Nov 26, 2026: Sarah's playtest bugs (Dev)

Four bugs from Sarah's iPhone playtest of Nov 26, fixed on Dev.

- **Every tap said "Not there" (spec 006 part B).** Tapping Sarah offers Charge, and once she was looking for the charger, every tap anywhere counted as a guess, with no way out except the B button. Now only a tap on a place the charger can hide (a sofa, a bed or a cat) is a guess. Any other tap stops looking and plays as usual: the floor walks her there, and a piece, a cat or Keegan opens the action bubble. The hunt's tip now says "Tap the floor to stop".
- **The stairs read as stacked rectangles.** Each step's open side showed as its own tall box. Like `build-v1`, the open side is now one solid wooden side board (stringer) with a light top edge, and each step has a light front edge, so the flight reads as a staircase.
- **The kitchen curtains drew over the counter.** Pieces on a wall (curtains, frames, shelves, the mirror, the clock) now sort as part of their wall. Anything standing in the room in front of them, like the counter and the sink under the kitchen window, always draws over them. Curtains also count the bit they hang past the window on each side.
- **With the walls up, pieces showed through the walls (Keegan, same day).** On floor 2 the big plant, the lamps and the easel drew over the front brick walls. There were three causes:
  - Pieces pushed against a wall overlapped the wall's thickness by a hair, so the game couldn't tell which came first.
  - The game only compared a piece with a wall when the piece's box reached it, and plant leaves and lamp shades spill past their boxes.
  - Two walls meeting at a corner could each count as "behind" the other, which tangled the order for pieces near the corner.

  Now a wall is a flat line: anything wholly behind it draws behind it, and anything wholly in front draws in front, judged by what's actually drawn. The fix is in the shared engine (`engine/iso.js`), which only Sarah's Sim uses so far.
- **The title bar sat under the iPhone's clock and battery.** The game now keeps its shell below the phone's status bar and above the home bar (the iPhone "safe area"). On a phone without a notch it looks the same as before.

### Checks

- `npm run check` has a new section for these bugs:
  - a floor tap during the charger hunt stops it and walks Sarah there;
  - only sofas, beds and cats count as guesses;
  - no wall piece draws over a piece standing in front of it, on all 3 floors;
  - with the walls up and cut away, on all 3 floors, no piece behind a wall draws over it and no piece in front draws under it;
  - the title bar sits below the status bar at 375 × 667, 375 × 812 and 390 × 844, standing in for a notched phone's 47 px status bar and 34 px home bar.
- New screens: `src/dist/screen-stairs-375x667.png`, `src/dist/screen-walls-up-floor2-375x667.png` and `src/dist/screen-notched-375x812.png`.
- Played in the browser at 375 × 667 and 375 × 812.

### What's left

- I couldn't test on a real iPhone here. The notch is stood in for in the browser, so it's worth a look on Sarah's phone.
- The cat check ("a knocked-over thing was lost") sometimes failed. It counted every piece in the home, and a meal Keegan made earlier in the test could get eaten in the meantime. It now follows the knocked-over thing itself and passes.
- One older check still fails now and then and passes on a re-run: a chair's colors and props after a reload. The save itself is instant. Something left over from the placing tests earlier in that run seems to save an older copy during the wait. It's in the decorating code, not touched here. I'll chase it if it keeps happening.
- Life After uses the same shared shell and may have the same status-bar problem. Black Lantern and Rushlight already handle it.

### Changes from the spec

- None.

## Nov 26, 2026: Christmas (Dev)

Spec 009 build order 1: the Christmas season, Christmas Eve, Christmas morning and first snow, ready for Dec 25. Content and rules on the home screen, with no new screens.

- **The Christmas set in the Holiday tab:** the tree, a wreath, stockings, a holiday garland (it twinkles and turns on like a lamp), a poinsettia, a gift stack, an ornament bowl, cookies and milk, and a snow globe.
  - In Life, December 1 to January 6, the set shows "This season".
  - The rest of the year it shows "Back in December" and can't be taken, unless she already has the piece.
  - Sandbox always has everything. Buying and prices still wait for spec 006 part F.
- **Christmas Eve, from 5 PM:** stockings go up on a wall and cookies and milk go out on a table, near her tree.
- **Christmas morning:**
  - Three gifts wait under her tree. If she hasn't placed a tree, a little tree goes up.
  - Open a gift from its bubble. One holds Keegan's note, and each of the others becomes a free Christmas piece in its place.
  - The cats wear tiny Santa hats all day, and Keegan's special breakfast waits on the table.
  - Gifts never repeat in the same year (saved).
- **Day dressing is for the day:** it goes away the next day unless she taps it and picks Keep it.
- **First snow:** the first time she opens the game on or after Dec 21, a note says snow is falling. Once a winter.
- **The street in December** (the title): a wreath on the neighbor's door and lights along the cornices.
- **Testing:** `?date=2026-12-25&clock=8:30` sets the date and time, in Dev builds and the checks only, never in the build Sarah plays (spec 009, Testing). The `?clock=` override is now limited the same way.
- **The note is private data.** The placeholder file holds dummy text (`treeNote`). Keegan's real words go in `src/private.js`.
- `npm run check` now tests:
  - the set in and out of season in Life and Sandbox;
  - Christmas Eve's dressing, Keep it, and the dressing going away the next day;
  - three gifts with one note, opening them, the hats and the breakfast;
  - the gifts not coming back.

### Changes from the spec

- The note shows in a card over the home for now. Its own "Note found" screen (`memory-book-v1`, state `note`) comes with spec 007.
- Parties (part C) wait for the Visitor screens (spec 008).
- The memory book moments wait for the memory book.

## Nov 26, 2026: idle Sarah and her phone (Dev)

Spec 006 part D, the rest that doesn't wait on another part. Rules and content, with no new screens.

- **Idle Sarah:** when Life opens, Sarah is in the middle of something from the time of day's pool: scrolling on her phone on the sofa (or in bed, late at night), painting, or reading. As soon as she taps anything, Sarah stops and is hers to play.
- **The pool is private data.** The placeholder file has a short generic list built from the bible's public summary.
- **Her phone:**
  - While she scrolls, the battery runs down, only while the game is open (about 15 minutes of scrolling from full).
  - When it's low, a red low-battery icon blinks over her head and she holds the phone up.
  - Tapping Sarah shows her battery and Charge beside her meters. Charge starts the hunt: the charger is never where she left it. It's under a couch cushion, in the bed sheets, or under Ralph, from a pool that doesn't repeat until it's used up (saved).
  - Tapping the wrong spot gets a sigh; the right one finds it. Her phone then charges over about 3 minutes of play.
  - The first time, a bouncing marker shows the spot as a hint. B gives up for now.
- **What a dead phone affects:** calls and photos aren't built yet, so a dead phone changes nothing else today.
- `npm run check` now tests:
  - Sarah starts idle;
  - the battery runs down while she scrolls;
  - Charge shows when it's low;
  - a wrong guess, the right spot, and charging to full;
  - no repeated hiding spot before the pool runs out.

### Changes from the spec

- Keegan handing her his charger when he walks by is left for later. It's a small extra moment, and it fits better once his day has more to it.

## Nov 26, 2026: Keegan's day (Dev)

Spec 006 part D, Keegan's idle life. Rules and content, with no new screens.

- **His day:** when she opens Life, Keegan is already busy with something from the time of day's pool (morning, daytime, evening, late night), in the right spot: at his desk, on the sofa, at the stove, by the bookshelf or in bed. Every 5 to 15 minutes of play he moves on to the next. Picks don't repeat until the pool runs out, and the shown list is saved. His bubble says what he's doing ("Keegan · Doing school work").
- **Cooking:** near mealtimes (7 to 9, 12 to 1, 6 to 8) he cooks, and Ralph turns up by the stove.
- **Meals:** when he finishes cooking, the meal goes on the dining table with a sparkle. Tap it and choose Eat: it fills hunger and clears the plate.
- **Busy:** some activities are busy (in class). A together action she picks then waits, with a note, and starts as soon as he's done.
- **After a together action** he goes back to what he was doing.
- **The pools are private data** (bible, Overview, Private data). The placeholder file has a short generic list built from the bible's public summary (coffee, school work, class, gaming, reading, cooking, sleeping) with the same shape. Keegan's real list goes in `src/private.js`.
- **Fixed:** someone already standing where they needed to be never settled in (sat down or lay down). They now do.
- `npm run check` now tests Keegan starting busy, a busy action waiting and starting, the meal going on the table and being eaten, and no repeats before the pool runs out.

### Still to come in spec 006 part D

- The after-moments (private data).
- Sarah's phone and the charger hunt.
- Winding down (it needs its pieces).
- Cook together (it comes with the Cooking screen).

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
