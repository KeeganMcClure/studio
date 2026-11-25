# Spec 002: Outfits

Status: draft, for Keegan's review · Written 2026-11-25 by the Game Designer · Game: Sarah's Sim · To do: Specs (Outfits)

## In plain words

Outfits get as much love as homes. Sarah taps a person, or a wardrobe or mirror in the home, and the Style screen opens: the person stands big in front of a standing mirror, and she can spin them around to see the back. The wardrobe tray holds about 60 pieces to start, including their real clothes from Keegan's photos, marked with hearts.

She picks a top, jeans, shoes, glasses and a cap, and each piece can be recolored with a swatch, painted part by part, or given a pattern like plaid or leopard. She can even write her own words on a tee, front and back, the way her ORANGE ROCKS shirt says "AND SO DO I" on the back. Hair is restyled here too, but Sarah's hair always stays ginger.

When she likes a look, the heart saves it as a favorite and the camera takes a picture. What a person wears on the Style screen is what they wear walking around the home.

## Bible sections this spec relies on

The bible wins over this spec (`studio-bible/studio.md`, Specs). Rules are linked here and not written out again.

| Source | Section | What it sets |
| --- | --- | --- |
| `games/sarahs-sim/bible.md` | Outfits | Wardrobe size and tabs, the big dress-up view, swatches, paint, patterns, her own prints, coats under Tops |
| `games/sarahs-sim/bible.md` | Outfits → Clothing list | The 60 starting pieces and which come from photos |
| `games/sarahs-sim/bible.md` | Homes and people | Keegan's and Sarah's looks, Sarah's hairstyles and always-ginger rule, the ORANGE ROCKS tee, Ralph's bowtie |
| `games/sarahs-sim/bible.md` | Creator | The same mirror view; new people go to Style when done; nothing is locked by gender |
| `games/sarahs-sim/bible.md` | Play → Keeping designs | Favorites and the camera |
| `games/sarahs-sim/bible.md` | Play → Coins and prices | Clothes 50 to 150 coins in Life mode (read by spec 006) |
| `games/sarahs-sim/bible.md` | Saves | Favorites shared across modes |
| `games/sarahs-sim/bible.md` | Controls and screen; Art | Touch first, no L or R, the palette |
| `specs/001-home-and-decorating.md` | Parts A, D and E | The Start menu's People row, the paint tray and palette, favorites and the camera for rooms |
| `studio-bible/art-style.md` | All | Art drawn in code, Craft, Quality bar, Animation |
| `studio-bible/ui.md` | All | Readable text, cards, color never the only label |
| `studio-bible/studio.md` | Screen list; Playtests; No real brands | Screen rows, the playtest after part A, plain names (the Converse high-tops are "canvas high-tops" on screen) |

## Screens this spec covers

| Screen | Mockup |
| --- | --- |
| Style (outfits) | `style-v1` (approved; drawn with L and R, which the bible has since dropped) |
| Favorites | adds an Outfits tab to spec 001's Favorites screen |

## Part A: The Style screen

Follows the approved `style-v1` mockup: the mirror view on top and the wardrobe tray below.

**Getting there:**

- Tap a person in the home, then Style. Or tap a wardrobe, dresser or standing mirror and choose Change outfit (spec 006 lists the same object).
- The Start menu's People row (spec 001) opens Style for whoever she picks.
- A person made in the Creator lands here when she taps Done (bible, Creator).

**The view:**

- The person stands about 3 times map size in front of a standing mirror, in the same warm room look (bible, Outfits).
- Two arrow buttons spin them a quarter turn at a time: front, side, back, other side. A swipe across the person spins too.
- The name at the top opens a short list of the people in this home, so she can dress someone else without leaving.
- The person breathes and blinks. When a new piece goes on, they do a small happy turn. *Claude default.*
- Buttons: the heart (save a favorite, part E), the camera (part E) and Done (back to the home).

**Done when:** Style opens from a person, from a wardrobe or mirror, from the Start menu and from the Creator, and the person spins all four ways at 375 × 667 and 320 × 480 with nothing cut off.

## Part B: Wearing pieces

**The wardrobe tray** (bible, Outfits, Wardrobe tabs): hair, tops, bottoms, dresses, shoes, extras, then **Ours** and **Holiday**. Coats sit under Tops. Each card shows the piece and its swatch dots, and a heart if it's from their real clothes. In Life mode it also shows the price (spec 006).

**Putting it on:** tap a card, or drag it onto the person. It goes on right away. Tapping a worn piece's card again takes it off.

**What goes with what** (*Claude default*):

| Slot | Holds | Notes |
| --- | --- | --- |
| Hair | one hairstyle | Sarah's colors are locked to her ginger (below) |
| Top | one top | A coat or cardigan can go over it as a second layer |
| Coat | one outer layer | From the Tops tab: cardigans, vests, jackets, puffers |
| Bottom | one bottom | Taken off when a dress goes on |
| Dress | one dress | Takes off the top and bottom. A coat can still go over it |
| Shoes | one pair | Includes "socks only" |
| Extras | glasses, earrings, a hat or cap, a hair clip, a bag, a scarf | One of each kind at a time |

- Nothing is locked by gender or age (bible, Creator). Kids and elders get the same pieces at their size.
- The **Holiday** tab follows spec 009 for when pieces show up.
- **Ralph's bowtie** is a cat outfit. Tapping Ralph gives a small "Bowtie on / off" choice instead of Style (bible, Homes and people).

**Hair:**

- Each person has the hairstyles from the Creator's list (spec 003), including Sarah's four to start: pinned up, loose bob, long curls and a ponytail (bible, Homes and people).
- **Sarah's hair is always ginger:** for her, the hair tab shows styles only, with no color row and no paint (bible, Homes and people). Everyone else can have any hair color.
- Hats and caps sit over the hair. A cap hides the top of the hair, and a bun shows through a beanie as a bump. *Claude default.*

**Done when:** every piece on the list can be put on and taken off by tap and by drag, dresses and coats layer as the table says, and Sarah's hair can't be recolored.

## Part C: Colors, paint and patterns

The same tools as furniture (spec 001, part D), on the `style-v1` piece tray.

- **Swatches:** 4 to 6 hand-picked color sets per piece. One tap swaps the whole piece.
- **Paint:** she picks a part (for example body, sleeves, collar, cuffs, laces, brim), then any color from the 24-color palette. The parts are named on buttons.
- **Patterns** (bible, Outfits): plain, stripes, plaid, floral, leopard and dots, on any fabric part, in two colors she picks from the palette. *Claude default:* the pattern's two colors.
- Pieces from their real clothes start in their real colors and patterns, and she can still change them.
- Each person's copy of a piece keeps its own colors.

**Done when:** every piece takes each swatch, paint per part and each of the six patterns, on all four sides of the person.

## Part D: Her own prints

(bible, Outfits, Her own prints; the `style-v1` print tray.)

- Tees, tanks and sweatshirts have an **Edit print** button. Hoodies and sweaters can take one too. *Claude default.*
- She picks the front or the back, then types up to 2 short lines of up to 6 letters each, with the phone's keyboard.
- Letters A to Z, 0 to 9, a heart, a star, and the marks ! ? and the apostrophe. Rounded pixel letters in one style, sized to fit the chest or back. *Claude default.*
- She picks the letter color from the palette.
- The **ORANGE ROCKS tee** is made with these tools: bright orange, white letters, "ORANGE / ROCKS" on the front and "AND SO / DO I" on the back, already set up in her wardrobe.
- Prints show on the map sprite as a small light patch, since the letters are too small to read there. *Claude default.*

**Done when:** she can write two lines on the front and back of a tee, pick the color, see it as she spins the person, and the ORANGE ROCKS tee shows both sides correctly.

## Part E: Outfit favorites and the camera

(bible, Play, Keeping designs; spec 001, part E.)

- **The heart** saves the whole outfit, with every piece, color, pattern, print and the hairstyle, as a favorite. She names it, with a short default like "Cozy Sunday".
- Favorites now have two tabs, Rooms and Outfits. Picking an outfit favorite puts it on whoever is on the Style screen, in any home and any mode.
- In Life mode, pieces she doesn't own show their total price first (spec 006).
- On Sarah, a favorite with another hair color keeps her ginger (part B).
- **The camera** takes a clean picture of the person in the mirror view, with no tray or buttons, and saves it like a room picture (spec 001, part E).

**Done when:** an outfit favorite saved on Sarah can go onto Keegan or a made person in another mode, and a camera picture saves with no buttons in it.

## Part F: The person in the home

- What a person wears in Style is what they wear on the map: the map sprite shows the same pieces, colors and patterns, drawn small (`people-v1`).
- Life mode may change clothes for the time of day (pajamas late at night) as part of idle life. That's spec 006's choice. This spec only gives each person a saved "everyday" outfit and a "sleep" outfit. *Claude default.*

**Done when:** a change in Style shows on the map sprite straight away, on all four facings.

## The clothing list and piece data

The 60 pieces are the bible's Clothing list. Pieces from their real clothes also show in Ours. Brand names never show on screen (`studio-bible/studio.md`, No real brands).

**Piece data.** One row per piece, so a new piece is a new row:

| Field | Example |
| --- | --- |
| id | `orange-rocks-tee` |
| Name on screen | ORANGE ROCKS tee |
| Tab and slot | tops, top |
| From their photos | yes (shows a heart and in Ours) |
| Parts for paint | body, sleeves, collar |
| Swatches | 4 to 6 sets |
| Takes a print | yes, front and back |
| Starts with | color orange, print front "ORANGE / ROCKS", back "AND SO / DO I", white letters |
| Price | 100 (read by spec 006) |

## Art

- Every piece is drawn on the big mirror figure in all four turns, and small on the map sprite in all four facings, at the bible's Rich detail where it fits (`style-v1`, `people-v1`).
- Hair is drawn from the front and the back on purpose, with the bob silhouette, swept strands and nape that Keegan approved for Sarah's back hair (`style-v1`).
- Each part is drawn so paint can recolor it on its own, with fabric texture as shading only.
- Patterns are drawn so they follow the body and wrap around the sides.

## Build order

1. Part A and part B with 10 pieces, including the ORANGE ROCKS tee. Keegan plays it on the phone (`studio-bible/studio.md`, Playtests).
2. Parts C and D (colors, patterns and prints), then the rest of the 60 pieces. These add rules and content.
3. Parts E and F.

This spec needs spec 001's home screen, paint tray and favorites built first.

## Claude defaults to confirm

These follow the bible but fill in details it doesn't set. Keegan can change any of them:

- The person does a small happy turn when a new piece goes on.
- The slot table: coats layer over tops and dresses, a dress replaces the top and bottom, and one extra of each kind.
- Caps hide the top of the hair, and a bun shows through a beanie.
- Patterns use two colors she picks.
- Prints allow letters, numbers, a heart, a star and ! ? ', on tees, tanks, sweatshirts, hoodies and sweaters.
- Each person keeps an everyday outfit and a sleep outfit for spec 006 to use.
