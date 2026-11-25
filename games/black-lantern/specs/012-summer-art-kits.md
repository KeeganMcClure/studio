# Spec 012: Art kits for Good Manners and Lot 83

Status: approved and built (status updated Nov 25, 2026; see the bible's To do and the changelog) · Written 2026-11-22 by the Game Designer · Game: Black Lantern · To do: Season readiness, step 6 (first part)

## In plain words

Today's Shared Shelf has 21 pieces, all for an autumn small town. Good Manners (a Kansas grain town and a county fair in late summer) and Lot 83 (an Austin apartment block in August) both need things the Shelf doesn't have yet: summer versions of grass and trees, a night light that isn't dusk, indoor rooms, and some buildings and props that would fit plenty of later cases.

This spec lists those generic pieces as seven kits, and says which case draws each one first. Merging it is Keegan's OK for these pieces to go on the Shelf (Art → Save every asset). Anything tied to one case's story stays case art, on that case's Asset Library page, as always.

Nothing changes for players by itself. The kits get drawn during each case's part A, so they arrive with the case that needs them.

## Bible sections this spec relies on

| Source | Section | What it sets |
| --- | --- | --- |
| `games/black-lantern/bible.md` | Art → Direction | One case, one set of art; generic pieces can travel; existing CC0 assets first for generic tiles and props; save every asset |
| `games/black-lantern/bible.md` | Art → Shared Shelf | The 21 pieces in use, all v1; the Shelf is add-only; Black Lantern paints Shelf pieces with its own palette |
| `games/black-lantern/bible.md` | Art → Palette; Light and mood; Maps | Base palette, day and night, lantern light, 3/4 view at Wide scale |
| `games/black-lantern/bible.md` | Story → Adding a new case, step 6 | Generic pieces go to the Shared Shelf only with Keegan's OK |
| `games/black-lantern/specs/010-good-manners.md`, `011-lot-83.md` | Art | Each case's art list and its flagged Shelf candidates |
| `studio-bible/art-style.md` | Shared Shelf | A piece moves to the Shelf only when it fits any setting; Claude flags, Keegan approves; names are `game-kind-name-vN` |
| `studio-bible/studio.md` | No real brands | No real names or logos on signs, cars, pumps or boxes |

## The rule for what goes on the Shelf

A piece goes on the Shelf when it would fit a case set somewhere else, at a different time, with nothing changed but the palette. A piece stays case art when it carries the case's story, its town's name, or one of its townsfolk.

- **Shelf:** a blank painted sign, a ranch house, a window AC unit, a generic sedan.
- **Case art:** the Odessa Flats water tower's painted name (the tower itself is Shelf), Walt's fridge drawing, the fumigation tent, the two men's black car (a Shelf sedan in a case-only tint is fine), any monster.

## The kits

Every piece is new at `v1` and follows today's naming (`shared-<group>-<name>-v1`). Each draws from palette slots like today's pieces, so each game paints it in its own colors. Before drawing any tile or simple prop, the Developer checks for a CC0 asset first (Art → Direction).

### 1. Summer (seasonal)

The summer versions of what autumn has today, so a case outside autumn never borrows autumn pieces.

| File | Piece | First drawn in |
| --- | --- | --- |
| `shared-tiles-summergrass-v1` | Green and dry grass, two versions | Good Manners A |
| `shared-props-summertree-v1` | Summer trees, full green | Good Manners A |
| `shared-tiles-drydirt-v1` | Cracked dry dirt and gravel | Good Manners A |
| `shared-effects-heat-v1` | Heat shimmer for bright afternoons | Good Manners A |

### 2. Night light

Today's only light effect is dusk. Both cases spend whole nights outside under streetlights.

| File | Piece | First drawn in |
| --- | --- | --- |
| `shared-effects-sodium-v1` | Sodium-orange night light under street lights | Good Manners A |
| `shared-effects-bugzap-v1` | Bug-light purple glow (porches, walkways) | Lot 83 A |
| `shared-props-worklight-v1` | Work light on a stand, with its pool of light | Lot 83 A |

### 3. Main street

A small-town or small-city main street that isn't Still Harvest's.

| File | Piece | First drawn in |
| --- | --- | --- |
| `shared-tiles-storefront-v1` | Flat-front brick storefront, 2 widths | Good Manners A |
| `shared-props-signblank-v1` | Painted sign blank (the case paints the name) | Good Manners A |
| `shared-props-watertower-v1` | Water tower, blank | Good Manners A |
| `shared-props-trafficlight-v1` | Traffic light on a wire, with a blinking version | Good Manners A |
| `shared-props-gaspump-v1` | One gas pump, no brand | Good Manners A |

### 4. Houses and cars

| File | Piece | First drawn in |
| --- | --- | --- |
| `shared-tiles-ranchhouse-v1` | Ranch house front, built from today's walls and roofs where they fit | Good Manners A |
| `shared-tiles-porch-v1` | Porch with steps and a rail | Good Manners A |
| `shared-props-mailbox-v1` | Roadside mailbox | Good Manners A |
| `shared-props-sedan-v1` | Parked sedan, 2 facings, body color from a palette slot | Good Manners A |
| `shared-props-van-v1` | Work van, blank sides (the case paints the company) | Lot 83 A |

### 5. Apartments

Two-story apartment blocks and motels share most of this, so it serves a lot of later cases.

| File | Piece | First drawn in |
| --- | --- | --- |
| `shared-tiles-walkway-v1` | Second-floor open walkway with rail | Lot 83 A |
| `shared-tiles-metalstairs-v1` | Outdoor metal stairs | Lot 83 A |
| `shared-tiles-numberdoor-v1` | Apartment or motel door with a number plate | Lot 83 A (Good Manners' motel can use it if it's drawn first) |
| `shared-props-windowac-v1` | Window AC unit | Lot 83 A |
| `shared-tiles-chainlink-v1` | Chain-link fence and gate | Lot 83 A |
| `shared-tiles-pool-v1` | Small pool, full and empty versions | Lot 83 A |
| `shared-tiles-parkinglot-v1` | Asphalt with painted lines | Good Manners A (drawn early for its Main Street, Nov 23, 2026); Lot 83 shares it |
| `shared-props-dumpster-v1` | Dumpster | Lot 83 A |

### 6. Interiors

Neither case can be built without rooms, and every later case will need them too. This is the biggest kit and the most reused.

| File | Piece | First drawn in |
| --- | --- | --- |
| `shared-tiles-floor-v1` | Linoleum, carpet, wood and tile floors | Good Manners A |
| `shared-tiles-innerwall-v1` | Interior walls with trim, plain and paneled | Good Manners A |
| `shared-props-counter-v1` | Counter with stools (diner, office front desk) | Good Manners A |
| `shared-props-tablechairs-v1` | Table and chairs | Good Manners A |
| `shared-props-desk-v1` | Desk with a chair and a lamp | Good Manners A |
| `shared-props-bed-v1` | Bed and nightstand | Good Manners A |
| `shared-props-shelf-v1` | Shelving, empty and stocked | Good Manners A |
| `shared-props-kitchen-v1` | Fridge, stove and sink | Lot 83 A |
| `shared-props-ceilingfan-v1` | Ceiling fan seen from above, 2 frames | Lot 83 A |
| `shared-props-boxes-v1` | Cardboard boxes, a few stacks | Lot 83 A |
| `shared-props-washer-v1` | Coin washer and dryer | Lot 83 A |

### 7. Fair (seasonal)

Fairs turn up in summer and autumn cases alike.

| File | Piece | First drawn in |
| --- | --- | --- |
| `shared-props-stringlights-v1` | String lights, lit and unlit | Good Manners A |
| `shared-props-booth-v1` | Game booth, blank sign | Good Manners A |
| `shared-props-ferriswheel-v1` | Ferris wheel, still and turning | Good Manners A |

### Stays case art

From the two specs' candidate lists, these stay with their case: the grain co-op and elevator, the livestock barn, the grandstand and the spinner ride (Good Manners); the storage row and the striped fumigation tent (Lot 83). They read as tied to their place, and a later case can draw its own.

## What to build

No build item of its own. Each case's part A draws its kits above:

- Draw each piece onto the Shared Shelf first as `v1`, then use it in the case, so the case and the Shelf never hold two copies.
- Add each piece to Art → Shared Shelf's "in use" table and log it in `changelog.md`, as the bible's Shared Shelf section says.
- If Lot 83 part A happens to be built before Good Manners part A, it draws any kit it needs from Good Manners' list itself.
- Rushlight and Life After can pick up any piece later; nothing here changes either game.

## Must stay true

- Still Harvest looks exactly the same: it stays on today's 21 pieces at v1.
- No existing Shelf piece changes. Add-only.
- No real brand names or logos on any piece.
- Nothing a player could only learn by playing appears here.

## Done when

- Good Manners part A and Lot 83 part A are ticked, and every piece above is on the Shelf at v1 and listed in Art → Shared Shelf.
- Season readiness step 6 is ticked once the season's remaining pitch rounds are picked and their kits are listed too, in a later spec or an update to this one.
