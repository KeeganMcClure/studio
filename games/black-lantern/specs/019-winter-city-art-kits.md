# Spec 019: Art kits for Tracking

Status: approved and built (status updated Nov 25, 2026; see the bible's To do and the changelog) · Written 2026-11-23 by the Game Designer · Game: Black Lantern · To do: Season readiness, step 6 (third part)

## In plain words

Tracking (spec 018) is the season's first winter case and its first city. It needs things no kit has yet: snow and slush, falling snow, a city street with a crosswalk, neon signs, barred shop windows, and the old TV and VCR the tape plays on.

This spec lists those generic pieces as three kits, all first drawn in Tracking part A. Merging it is Keegan's OK for these pieces to go on the Shelf (Art → Save every asset). Anything tied to the case's story stays case art on its Asset Library page, as always.

Tracking also uses spec 012's main street, houses and cars, apartments and interiors kits, and spec 017's rain. If Tracking part A is built before the case that draws one of those first, it draws that piece onto the Shelf itself, as spec 012 says.

## Bible sections this spec relies on

| Source | Section | What it sets |
| --- | --- | --- |
| `games/black-lantern/bible.md` | Art → Direction | One case, one set of art; generic pieces can travel; existing CC0 assets first for generic tiles and props; save every asset |
| `games/black-lantern/bible.md` | Art → Shared Shelf | The pieces in use; the Shelf is add-only; Black Lantern paints Shelf pieces with its own palette |
| `games/black-lantern/bible.md` | Art → Palette; Light and mood; Maps | Base palette, day and night, lantern light, 3/4 view at Wide scale |
| `games/black-lantern/bible.md` | Story → Adding a new case, step 6 | Generic pieces go to the Shared Shelf only with Keegan's OK |
| `games/black-lantern/specs/012-summer-art-kits.md` | The rule for what goes on the Shelf; the kits | The Shelf rule this spec follows, and the kits Tracking reuses |
| `games/black-lantern/specs/017-spring-art-kits.md` | Weather | The rain effect Tracking reuses |
| `games/black-lantern/specs/018-tracking.md` | Art | The case's art list and its flagged Shelf candidates |
| `studio-bible/art-style.md` | Shared Shelf | A piece moves to the Shelf only when it fits any setting; Claude flags, Keegan approves; names are `game-kind-name-vN` |
| `studio-bible/studio.md` | No real brands | No real names or logos on signs, neon, TVs or tapes |

## The kits

Every piece is new at `v1` and follows today's naming (`shared-<group>-<name>-v1`). Each draws from palette slots like today's pieces, so each game paints it in its own colors. Before drawing any tile or simple prop, the Developer checks for a CC0 asset first (Art → Direction). Spec 012's rule for what goes on the Shelf applies.

### 12. Winter (seasonal)

| File | Piece | First drawn in |
| --- | --- | --- |
| `shared-tiles-snow-v1` | Snow ground, fresh and trodden versions | Tracking A |
| `shared-tiles-slush-v1` | Grey slush on roads and sidewalks | Tracking A |
| `shared-props-snowbank-v1` | Plowed snowbank, a few lengths | Tracking A |
| `shared-props-icicles-v1` | Icicles for roof edges and signs | Tracking A |
| `shared-effects-snowfall-v1` | Falling snow, light and heavy | Tracking A |

### 13. City street

Any case in a town big enough for a bus line can use these.

| File | Piece | First drawn in |
| --- | --- | --- |
| `shared-tiles-citystreet-v1` | Four-lane street with a crosswalk and curbs | Tracking A |
| `shared-props-busstop-v1` | Bus stop with a bench and a blank sign | Tracking A |
| `shared-props-neonsign-v1` | Blank neon sign with a flicker, two sizes (the case lights the words) | Tracking A |
| `shared-props-polesign-v1` | Tall roadside sign blank on a pole (motels, diners, gas) | Tracking A |
| `shared-tiles-barredwindow-v1` | Shop window with security bars | Tracking A |
| `shared-props-hydrant-v1` | Fire hydrant | Tracking A |

### 14. Old electronics and paneling

| File | Piece | First drawn in |
| --- | --- | --- |
| `shared-props-crttv-v1` | CRT TV on a stand, off and on (static) | Tracking A |
| `shared-props-vcr-v1` | VCR and a VHS tape, no brand | Tracking A |
| `shared-tiles-paneling-v1` | Wood paneling interior wall | Tracking A |

### Stays case art

From spec 018's candidate list, these stay with Tracking: the pawn shop front and its bin, the clerk's foil windows and the three words, the collector's wall of tapes, the closed club and its marquee, the tape's footage, and the tracking lines effect. They carry the case's story or its place.

## What to build

No build item of its own. Tracking part A draws the kits above, the same way as spec 012:

- Draw each piece onto the Shared Shelf first as `v1`, then use it in the case, so the case and the Shelf never hold two copies.
- Add each piece to Art → Shared Shelf's "in use" table and log it in `changelog.md`, as the bible's Shared Shelf section says.
- Falling snow must keep every walkable tile and the dialog box readable on the iPhone SE screen.
- Rushlight and Life After can pick up any piece later; nothing here changes either game.

## Must stay true

- Still Harvest looks exactly the same: it stays on today's 21 pieces at v1.
- No existing Shelf piece changes. Add-only.
- No real brand names or logos on any piece.
- Nothing a player could only learn by playing appears here.

## Done when

- Tracking part A is ticked, and every piece above is on the Shelf at v1 and listed in Art → Shared Shelf.
- Season readiness step 6 is ticked once the season's last pitch round is picked and its kits are listed too.
