# Spec 021: Art kits for Dead Air

Status: proposed, waiting for Keegan's merge · Written 2026-11-23 by the Game Designer · Game: Black Lantern · To do: Season readiness, step 6 (last part)

## In plain words

Dead Air (spec 020) is the season's first case in the South: a sugarcane parish town in Louisiana in early March, with a dead radio station on the edge of the fields. It needs a few things no kit has yet: cane fields, live oaks with moss, a bayou edge, raised houses on piers, and a tower with a blinking light.

This spec lists those generic pieces as two kits, all first drawn in Dead Air part A. Merging it is Keegan's OK for these pieces to go on the Shelf (Art → Save every asset). Anything tied to the case's story stays case art on its Asset Library page, as always.

Dead Air also uses spec 012's main street, houses and cars, night light and interiors kits, spec 017's spring, weather and roads kits, and spec 019's old electronics. If Dead Air part A is built before the case that draws one of those first, it draws that piece onto the Shelf itself, as spec 012 says.

## Bible sections this spec relies on

| Source | Section | What it sets |
| --- | --- | --- |
| `games/black-lantern/bible.md` | Art → Direction | One case, one set of art; generic pieces can travel; existing CC0 assets first for generic tiles and props; save every asset |
| `games/black-lantern/bible.md` | Art → Shared Shelf | The pieces in use; the Shelf is add-only; Black Lantern paints Shelf pieces with its own palette |
| `games/black-lantern/bible.md` | Art → Palette; Light and mood; Maps | Base palette, day and night, lantern light, 3/4 view at Wide scale |
| `games/black-lantern/bible.md` | Story → Adding a new case, step 6 | Generic pieces go to the Shared Shelf only with Keegan's OK |
| `games/black-lantern/specs/012-summer-art-kits.md` | The rule for what goes on the Shelf; the kits | The Shelf rule this spec follows, and the kits Dead Air reuses |
| `games/black-lantern/specs/017-spring-art-kits.md`, `019-winter-city-art-kits.md` | The kits | The spring, weather, roads and electronics kits Dead Air reuses |
| `games/black-lantern/specs/020-dead-air.md` | Art | The case's art list and its flagged Shelf candidates |
| `studio-bible/art-style.md` | Shared Shelf | A piece moves to the Shelf only when it fits any setting; Claude flags, Keegan approves; names are `game-kind-name-vN` |
| `studio-bible/studio.md` | No real brands | No real names, logos or call letters on any piece |

## The kits

Every piece is new at `v1` and follows today's naming (`shared-<group>-<name>-v1`). Each draws from palette slots like today's pieces, so each game paints it in its own colors. Before drawing any tile or simple prop, the Developer checks for a CC0 asset first (Art → Direction). Spec 012's rule for what goes on the Shelf applies.

### 15. Deep South (regional)

| File | Piece | First drawn in |
| --- | --- | --- |
| `shared-tiles-canefield-v1` | Sugarcane field: stubble, young cane and tall cane, with rows to walk | Dead Air A |
| `shared-props-liveoak-v1` | Live oak with Spanish moss, two sizes | Dead Air A |
| `shared-tiles-bayouedge-v1` | Still dark water edge with cypress knees and reeds | Dead Air A |
| `shared-props-cypress-v1` | Bald cypress tree | Dead Air A |
| `shared-tiles-raisedhouse-v1` | House front raised on piers, with steps and the dark crawlspace | Dead Air A |

### 16. Towers and small buildings

| File | Piece | First drawn in |
| --- | --- | --- |
| `shared-props-tower-v1` | Lattice radio or cell tower with a blinking red light, base and top as separate pieces | Dead Air A |
| `shared-tiles-cinderblock-v1` | Cinder-block wall, plain and painted | Dead Air A |
| `shared-props-porchradio-v1` | Old radio with a glowing dial, no brand | Dead Air A |
| `shared-props-mic-v1` | Desk microphone and a small mixing board | Dead Air A |

### Stays case art

From spec 020's candidate list, these stay with Dead Air: the KHLT station front and its dead sign, the broadcast booth's ON AIR light and cart machines, the record room, the church hall set for the fish fry, the feed store and bait shop fronts, and the broadcast's on-screen dial and waveform. They carry the case's story or its town.

## What to build

No build item of its own. Dead Air part A draws the kits above, the same way as spec 012:

- Draw each piece onto the Shared Shelf first as `v1`, then use it in the case, so the case and the Shelf never hold two copies.
- Add each piece to Art → Shared Shelf's "in use" table and log it in `changelog.md`, as the bible's Shared Shelf section says.
- The cane field must keep the party and every path readable on the iPhone SE screen; tall cane can hide roamers, never the party.
- Rushlight and Life After can pick up any piece later; nothing here changes either game.

## Must stay true

- Still Harvest looks exactly the same: it stays on today's 21 pieces at v1.
- No existing Shelf piece changes. Add-only.
- No real brand names or logos on any piece.
- Nothing a player could only learn by playing appears here.

## Done when

- Dead Air part A is ticked, and every piece above is on the Shelf at v1 and listed in Art → Shared Shelf.
- With this spec, every regular case in Keegan's season 1 plan has its kits listed, so Season readiness step 6 can be ticked once this spec and spec 019 are merged.
