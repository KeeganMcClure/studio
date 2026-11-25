# Spec 001: The Philly home and decorating

Status: draft, for Keegan's review · Written 2026-11-25 by the Game Designer · Game: Sarah's Sim · To do: Specs (the Philly home and decorating)

This is the first part of the game to be built, and the one everything else stands on. It covers opening the game, the home screen, decorating, and their future Philly home. Sandbox is the mode it builds first.

## In plain words

The first time Sarah opens the game on Christmas, she unwraps a gift, and it opens onto a red-brick Philly rowhouse on a snowy night with a line from Keegan. Every time after that, she lands on the same snowy house with a small menu: Continue, Sandbox, Life and Challenges.

Inside is their future home in Philly: three floors of cozy rooms, Louie and Ralph, and their real things once Keegan's photos are drawn. She sees it in the diagonal view, zooms with two fingers, slides around, and flips the walls up, cut away or down to see inside.

Decorating is the heart of it. She opens the catalog, drags a sofa into the room, turns it, and taps it to pick new colors. Small things stack on tables and shelves, pictures hang on walls, and every piece can be painted part by part. Each piece comes dressed with little props, which she can switch off. She can save a room she loves as a favorite and take a clean picture of it.

Everything saves on its own, and once a month the game offers to make a backup file.

## Bible sections this spec relies on

The bible wins over this spec (`studio-bible/studio.md`, Specs). Rules are linked here and not written out again.

| Source | Section | What it sets |
| --- | --- | --- |
| `games/sarahs-sim/bible.md` | Title and cover | The rowhouse scene, seasons, the first-open gift, the title menu, the cover |
| `games/sarahs-sim/bible.md` | Homes and people | The starter home is their future Philly rowhouse; the cats; Keegan and Sarah; room size |
| `games/sarahs-sim/bible.md` | Decorating | Catalog size and tabs, placing, picking a placed piece, swatches and paint mode, the Sandbox top bar |
| `games/sarahs-sim/bible.md` | Decorating → Furniture art | Rich detail, texture under any color, props both ways, which pieces move, the chair rules |
| `games/sarahs-sim/bible.md` | Building | The view controls (pinch, pan, walls up / cut / down, floors 1 to 3, no rotation) and lot sizes |
| `games/sarahs-sim/bible.md` | Play → Keeping designs | Favorites and the camera |
| `games/sarahs-sim/bible.md` | Play → Coins and prices | Furniture prices in Life mode (read by spec 006) |
| `games/sarahs-sim/bible.md` | Saves | One save per mode, favorites shared, backup files and reminders |
| `games/sarahs-sim/bible.md` | Modes | Sandbox has everything unlocked, no days, needs or money |
| `games/sarahs-sim/bible.md` | Controls and screen; Art | Touch first with drag and drop (named exception), the isometric view (named exception), the palette, `look-iso-v1` |
| `studio-bible/art-style.md` | All | Art drawn in code, Craft, Quality bar, Animation, Shared Shelf first |
| `studio-bible/ui.md` | All | Readable text, cards, color never the only label |
| `studio-bible/controls.md` | Shell; Buttons | The GBA shell and the buttons (with the bible's named exceptions) |
| `studio-bible/saves.md` | All | Autosave, save version and upgrade steps, test saves |
| `studio-bible/launcher.md` | Covers; How a game registers | The 120 × 80 cover and `game.json` |
| `studio-bible/studio.md` | Screen list; Playtests; No real brands | Screen rows, the playtest after part A, plain names on everything |

## Screens this spec covers

These rows already exist in the bible's Screens table. This PR points them at this spec.

| Screen | Mockup |
| --- | --- |
| First open (gift) | `title-v1` |
| Title | `title-v1` |
| Home (decorate) | `decorate-v1` on the `look-iso-v1` room, pieces from `furniture-sheet-v1` |
| Favorites | **To draw** before part E |
| Camera | **To draw** before part E |
| Start menu | **To draw** before part A |

## Part A: Opening the game

**The game folder and cover.** `games/sarahs-sim/` with its `game.json`: id `sarahs-sim`, title `Sarah's Sim`, save prefix `ss.`, cover in `assets/`. The cover is the bible's small snowy home (`mockups/title-v1`, `drawCover`), and it follows the season like the title.

**First open, once only** (bible, Title and cover):

- On the very first launch, the gift fills the screen. A tap, an A press or a drag on the ribbon pulls it. The lid lifts, ribbon bits drift down, and the snowy home appears with Keegan's Christmas line in a card.
- Keegan's real words come from the private project files (bible, Overview, Private data). The repo keeps a placeholder line with the same shape.
- A tap or A goes to the title. The game remembers the gift was opened, across all modes, and never shows it again. A backup file carries that too, so importing on a new phone doesn't replay it.

**Title** (bible, Title and cover):

- The rowhouse scene with the game's name, "A cozy life" and a heart, and the menu card: Continue, Sandbox, Life, Challenges, and the small Import a save link.
- **Continue** opens the mode she played last, with its day if it's Life. It's hidden until she has a save.
- **Sandbox**, **Life** and **Challenges** open that mode's own save, or start it fresh. Life is spec 006. Challenges shows "Coming soon" until spec 010 is built.
- **Seasons:** the scene and the cover follow the real date (winter, spring, summer, fall), with the bible's holiday touches. This spec builds winter with December's lights first; the other three seasons follow before Dec 25 if time allows, and in the first update if not. *Claude default.*
- **Backup reminder:** about once a month, and before a big update, a small card on the title offers a backup. One tap makes the file. Not now dismisses it until next time (bible, Saves).

**Start menu** (Start on the shell, or a menu button in the corner of the home screen):

- Rows: Back to home, People, Homes, Favorites, Camera, Memory book (spec 007), Make a backup, Title.
- **People** lists the people in this home. Tapping one opens Style for them (spec 002).
- **Homes** lists her homes in this mode: the Philly home and any she has built (spec 004). Tapping one goes there.
- Each row is a plain menu row (`studio-bible/ui.md`). The menu dims the home behind it and nothing moves while it's open.

**Saves** (bible, Saves): autosave after every change and on close; one save per mode; favorites and the gift kept once for the whole game; a save version from the first build, with upgrade steps after; backups as a file saved to Files, and Import a save reads one back. A backup holds every mode, the favorites and the gift. Importing asks first, then replaces what's on the phone.

**Done when:**

- The gift shows only on the first launch and never again, even after a reload.
- The title menu works by tap and by buttons at 375 × 667, 375 × 550 and 320 × 480, with nothing cut off.
- Each mode opens its own save, and Sandbox changes never show up in Life.
- A backup file made on one phone opens on another with every mode, the favorites and the gift remembered.

## Part B: The home screen and the view

**What she sees.** The home in the diagonal view (bible, Art), the top bar (Sandbox shows the mode and the home's name, bible, Decorating), the view controls on the right, and the tray at the bottom with the Home, Style and Build tabs (`decorate-v1`, `build-v1`).

**The view** (bible, Building; the same controls on every home screen):

- Pinch to zoom between the whole floor and a close view of one corner. Two fingers drag to slide around. The D-pad slides too.
- The floors buttons (1, 2, 3) pick which floor she sees. The floor below shows dimmed under it.
- The walls button cycles walls up, cut away (back walls up, front walls low) and down.
- No whole-home rotation. Furniture turns 4 ways.

**The cats and the two of them.** In Sandbox, Louie and Ralph wander, nap on furniture she places, and react to new pieces (bible, The cats). Keegan and Sarah stand or sit somewhere fitting in the home and can be tapped to open Style (spec 002). How they live their day is Life mode (spec 006).

**Done when:** she can zoom, slide, flip floors and walls on a 3-floor home with one thumb and two fingers, at 375 × 667 and 320 × 480, and the view never shows a cut-off room or the tray over a selected piece.

## Part C: Placing pieces

The catalog and placing follow the bible's Decorating section and the approved `decorate-v1` mockup (its catalog, piece and paint trays).

**The catalog tray** (bible, Decorating, Catalog tabs):

- Tabs: seating, tables, beds, storage, lights, plants, rugs, wall, decor, then **Ours** and **Holiday**.
- Each card shows the piece, its name and small dots for its swatches. In Life mode it also shows the price (spec 006). Out-of-season holiday pieces follow spec 009.
- **Ours** holds their real things from Keegan's photos (To do, Reference sheet). Until those are drawn it shows a "Coming soon" card.

**Placing** (bible, Decorating, Placing):

- Drag a card out of the tray into the room. The piece follows her finger, snapped to the floor tiles. The tiles under it glow green where it fits and rose where it doesn't, with a small check or cross, so color is never the only sign.
- Let go to place it. If it doesn't fit, it slides back to the tray.
- **Turning:** a placed piece turns 4 ways with the turn button, or with L and R while it's held. *Claude default.*
- **Stacking:** small things (a lamp, a mug, a plant pot, a book stack, a frame) can sit on tables, counters, dressers and shelves. The spot on top glows green when a piece will stack there. A table holds as many as fit on its top.
- **Wall pieces:** art, shelves, mirrors and clocks hang on walls. Dragged near a wall, they snap flat to it at eye height and can slide along it. Shelves on walls can hold small things.
- **Picking a placed piece:** tap it. Turn, move and put-away buttons float over it, and the tray shows its name, swatches, Paint, Put away, Move and Done (`decorate-v1`, piece tray).
- **Moving** drags it again. **Put away** sends it back to her storage, never lost.
- **Undo:** one-tap undo for the last 10 changes in this home. *Claude default.*
- **Buttons too:** the D-pad moves a held piece one tile at a time, A places, B cancels, L and R turn (bible, Controls and screen).

**Props** (bible, Furniture art, Props both ways):

- Each piece comes dressed with its props (the mug and candle on a table, books on a shelf, a pillow on a chair).
- A **Props** switch in the piece tray hides or shows them. It's saved per placed piece.
- Props are also catalog pieces of their own in Decor, so she can stack them anywhere.

**Done when:**

- She can place, turn, stack, hang, move and put away every kind of piece by touch and by buttons.
- Placing never overlaps two big pieces or blocks a door, and never loses a piece.
- Undo steps back through the last 10 changes.
- The props switch hides and shows a piece's props, and stays that way after a reload.

## Part D: Colors and paint

The colors follow the bible's Decorating section (Colors) and the `decorate-v1` paint tray.

- **Swatches:** each piece has 4 to 6 hand-picked color sets that always look good together. One tap swaps the whole piece.
- **Paint mode:** she picks a part of the piece (for example fabric, wood, cushion), and taps a color from the 24-color cozy palette. Only that part changes. The parts are named on buttons, so color is never the only label.
- **Patterns:** fabric parts can take a pattern (stripes, gingham, floral, polka dots and a few more, shared with spec 002), which replaces the fabric texture on that part (bible, Furniture art).
- **Texture stays:** fabric texture and wood grain are light shading only, so they show under any color.
- Each placed piece keeps its own colors, so two of the same chair can look different.

**Done when:** every piece can be swapped to each swatch and painted part by part with any palette color or pattern, and the texture shows under every color.

## Part E: Favorites and the camera

(bible, Play, Keeping designs.) Outfits are added to both in spec 002.

- **Favorite a room:** in the Start menu, Favorites, then Save this room. It keeps every piece in the room with its spot, turn, colors and props, plus the room's floor and wallpaper. She names it, with a short default like "Cozy living room".
- **Use a favorite:** open Favorites, pick a room, then tap a room in any home in any mode. It places every piece that fits. Pieces that don't fit go to storage. In Life mode, pieces she doesn't own show their total price first, and she can buy them all or place only what she owns (spec 006).
- Favorites are kept once for the whole game and work in every mode (bible, Saves).
- **Camera:** a camera button frames the room she's looking at without the tray, top bar or buttons. One tap saves a clean picture to her phone's photos (through the share sheet) and adds it to the memory book's Photos tab (spec 007).

**Done when:** a saved room favorite rebuilds in another home and in another mode, and a camera picture saves to the phone with no buttons in it.

## Part F: The Philly home

Their future home, a three-floor red-brick rowhouse that matches the title (bible, Homes and people). It's a prebuilt home, made with the Build tools (spec 004) and furnished from this spec's catalog. It sits on a small 16 × 16 lot with the yard behind it (spec 005).

**The layout** (*Claude default*, Keegan can change any room):

| Floor | Rooms |
| --- | --- |
| 1 | Living room at the front (the big window with the tree in winter), dining nook, kitchen at the back with the back door to the yard |
| 2 | A study for Keegan's school work and gaming, a bathroom with a tub (Louie sits on the edge, bible, Idle life), and Sarah's craft corner for painting |
| 3 | Their bedroom, cozy under the roof, with a window seat at the front where the cats sit (the window on the title) |

- It's about 8 tiles wide and 14 deep, the shape of a real rowhouse, with stairs along one side.
- It starts furnished from the catalog in the warm palette, then the Ours pieces replace stand-ins as Keegan's photos are drawn (To do, Reference sheet).
- In Sandbox and Life it starts the same. Everything in it can be moved, recolored, put away or sold back. Nothing is locked.
- No street address appears anywhere (bible, Homes and people).

**Done when:** a new Sandbox or Life save opens in the furnished Philly home, with all three floors, the cats and the two of them, and every piece in it can be decorated.

## The starting catalog

About 80 pieces at launch (bible, Decorating, Catalog size), one sample per tab already approved in `furniture-sheet-v1`. This is a *Claude draft* list. Keegan can swap anything, and more come as needed.

| Tab | Pieces | Count |
| --- | --- | --- |
| Seating | club armchair, two-seat sofa, three-seat sofa, loveseat, reading chair with ottoman, dining chair, kitchen stool, desk chair, floor cushion, window seat cushion | 10 |
| Tables | coffee table, side table, round dining table, long dining table, desk, console table, nightstand, kitchen island, bistro table | 9 |
| Beds | double bed, single bed, daybed, bunk bed, cat bed, cat tree | 6 |
| Storage | bookshelf, low cabinet, dresser, wardrobe, kitchen counters (straight and corner), fridge, stove, sink cabinet, bath tub, bathroom sink, toilet | 12 |
| Lights | floor lamp, table lamp, mushroom lamp, string lights, pendant light, candle cluster, salt lamp | 7 |
| Plants | monstera, snake plant, pothos on a shelf, fiddle leaf fig, herb pots, small succulent, hanging plant | 7 |
| Rugs | wool rug, round rug, runner, braided rug, sheepskin, bath mat | 6 |
| Wall | framed print, gallery set, floating shelf, mirror, wall clock, curtains, macramé hanging, cork board, mounted TV, window plants shelf | 10 |
| Decor | mugs, book stack, vase of flowers, throw pillow, knit throw, record player, TV stand, laundry basket, cat toy basket, candles, picture frame, globe, fruit bowl | 13 |

That's 80. The kitchen and bath fixtures sit in Storage. *Claude default:* a "Kitchen and bath" row inside Storage keeps them together, so the tab list stays as the bible sets it.

Ours and Holiday are on top of the 80. Holiday's Christmas set comes first (spec 009).

**Piece data.** One row per piece, so a new piece is a new row:

| Field | Example |
| --- | --- |
| id | `club-armchair` |
| Name on screen | Club armchair |
| Tab | seating |
| Size | 1 × 1 tiles (or wall, or stackable) |
| Can hold small things | no / yes, with how many spots |
| Parts for paint | fabric, cushion, wood |
| Swatches | 4 to 6 sets of part colors |
| Props | which, and their spots |
| Moves | no / glow / sway / steam / spin / twinkle / flicker |
| Price | 250 (read by spec 006) |

## Art

- Every piece is drawn at the bible's Rich detail (Furniture art), on the same isometric grid and light as `look-iso-v1`, in all 4 turns. `furniture-sheet-v1` is the style guide, and `furniture-sheet-v1.js` has the drawing code for the approved pieces.
- Chairs and sofas follow the bible's chair rules.
- Each piece's parts are drawn so paint mode can recolor them separately, and texture is shading only.
- Moving pieces animate at the studio's slow idle pace (`studio-bible/art-style.md`, Animation).
- Look in the Shared Shelf first for generic pieces before drawing new ones (`studio-bible/art-style.md`, Shared Shelf). New art goes to the Shared Shelf only if Keegan says so.

## Build order

1. Draw and approve the **Start menu** mockup.
2. Part A (opening the game) and part B (the home screen). Keegan plays it on the phone (`studio-bible/studio.md`, Playtests).
3. Parts C and D (placing and colors), with the first 20 pieces, then the rest of the catalog. These add rules and content, so they can go ahead after part B's notes.
4. Part F (the Philly home). It needs spec 004's walls and floors built first.
5. Draw and approve the **Favorites** and **Camera** mockups, then part E.

## Claude defaults to confirm

These follow the bible but fill in details it doesn't set. Keegan can change any of them:

- Winter and December lights on the title are built first; the other seasons come before Dec 25 if time allows.
- L and R turn a held piece.
- Undo covers the last 10 changes in a home.
- The Start menu rows and the Homes list.
- Using a room favorite places what fits and stores the rest.
- The Philly home's room layout across its three floors.
- The 80-piece starting list, with kitchen and bath fixtures in a row inside Storage.
