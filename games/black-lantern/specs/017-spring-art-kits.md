# Spec 017: Art kits for Lost Hour

Status: proposed, waiting for Keegan's merge · Written 2026-11-22 by the Game Designer · Game: Black Lantern · To do: Season readiness, step 6 (second part)

## In plain words

Lost Hour (spec 016) is the season's first spring case and its first mountain road. It needs a few things neither today's 21 autumn pieces nor the summer kits in spec 012 have: spring grass and blossom trees, mud, a thick night fog, a two-lane mountain road with its overlook, steep wooded ground, and a hospital bed and monitor.

This spec lists those generic pieces as four kits, all first drawn in Lost Hour part A. Merging it is Keegan's OK for these pieces to go on the Shelf (Art → Save every asset). Anything tied to the case's story stays case art on its Asset Library page, as always.

Lost Hour also uses spec 012's main street, houses and cars, apartments and interiors kits. If Lost Hour part A is built before the case that draws one of those first, it draws that piece onto the Shelf itself, as spec 012 says.

## Bible sections this spec relies on

| Source | Section | What it sets |
| --- | --- | --- |
| `games/black-lantern/bible.md` | Art → Direction | One case, one set of art; generic pieces can travel; existing CC0 assets first for generic tiles and props; save every asset |
| `games/black-lantern/bible.md` | Art → Shared Shelf | The pieces in use; the Shelf is add-only; Black Lantern paints Shelf pieces with its own palette |
| `games/black-lantern/bible.md` | Art → Palette; Light and mood; Maps | Base palette, day and night, lantern light and its low-SAN shrink, 3/4 view at Wide scale |
| `games/black-lantern/bible.md` | Story → Adding a new case, step 6 | Generic pieces go to the Shared Shelf only with Keegan's OK |
| `games/black-lantern/specs/012-summer-art-kits.md` | The rule for what goes on the Shelf; the kits | The Shelf rule this spec follows, and the kits Lost Hour reuses |
| `games/black-lantern/specs/016-lost-hour.md` | Art | The case's art list and its flagged Shelf candidates |
| `studio-bible/art-style.md` | Shared Shelf | A piece moves to the Shelf only when it fits any setting; Claude flags, Keegan approves; names are `game-kind-name-vN` |
| `studio-bible/studio.md` | No real brands | No real names or logos on signs, cars or the coin viewer |

## The kits

Every piece is new at `v1` and follows today's naming (`shared-<group>-<name>-v1`). Each draws from palette slots like today's pieces, so each game paints it in its own colors. Before drawing any tile or simple prop, the Developer checks for a CC0 asset first (Art → Direction). Spec 012's rule for what goes on the Shelf applies.

### 8. Spring (seasonal)

| File | Piece | First drawn in |
| --- | --- | --- |
| `shared-tiles-springgrass-v1` | New green grass, with a wet version | Lost Hour A |
| `shared-props-blossomtree-v1` | Flowering tree, pink and white versions | Lost Hour A |
| `shared-tiles-mud-v1` | Mud and puddles, with a rain-dark version | Lost Hour A |

### 9. Weather

Fog and rain suit any time of year, so they live in their own kit.

| File | Piece | First drawn in |
| --- | --- | --- |
| `shared-effects-fog-v1` | Drifting night fog that shrinks the lantern's light radius, light and heavy versions | Lost Hour A |
| `shared-effects-rain-v1` | Light rain over a map, with wet shine on roads | Lost Hour A |

### 10. Roads and wild ground

Mountain roads, forests and creeks turn up in any rural case.

| File | Piece | First drawn in |
| --- | --- | --- |
| `shared-tiles-twolane-v1` | Two-lane road with a center line and shoulders, straight and curve | Lost Hour A |
| `shared-props-guardrail-v1` | Metal guardrail, straight and end piece | Lost Hour A |
| `shared-props-milemarker-v1` | Mile marker and a blank road sign | Lost Hour A |
| `shared-tiles-stonewall-v1` | Low stone wall (overlooks, bridges, old farms) | Lost Hour A |
| `shared-props-coinviewer-v1` | Coin-operated viewer on a post, no brand | Lost Hour A |
| `shared-tiles-slope-v1` | Steep wooded slope with rocks | Lost Hour A |
| `shared-props-thicket-v1` | Dense evergreen shrubs | Lost Hour A |
| `shared-tiles-creek-v1` | Small creek with stones | Lost Hour A |

### 11. Clinic

Hospitals, clinics and morgues need the same few pieces.

| File | Piece | First drawn in |
| --- | --- | --- |
| `shared-props-hospitalbed-v1` | Hospital bed with rails | Lost Hour A |
| `shared-props-monitor-v1` | Bedside monitor on a stand, with a blinking line | Lost Hour A |
| `shared-props-waitingchairs-v1` | Row of waiting room chairs | Lost Hour A |

### Stays case art

From spec 016's candidate list, these stay with Lost Hour: the clinic in the old bank building, the diner front, the Pruetts' house and scorched car, the sleep lab's wires and one-way window, and the folded card. They carry the case's story or its town.

## What to build

No build item of its own. Lost Hour part A draws the kits above, the same way as spec 012:

- Draw each piece onto the Shared Shelf first as `v1`, then use it in the case, so the case and the Shelf never hold two copies.
- Add each piece to Art → Shared Shelf's "in use" table and log it in `changelog.md`, as the bible's Shared Shelf section says.
- The fog effect must keep every walkable tile readable on the iPhone SE screen; it hides distance, never the floor under the party.
- Rushlight and Life After can pick up any piece later; nothing here changes either game.

## Must stay true

- Still Harvest looks exactly the same: it stays on today's 21 pieces at v1.
- No existing Shelf piece changes. Add-only.
- No real brand names or logos on any piece.
- Nothing a player could only learn by playing appears here.

## Done when

- Lost Hour part A is ticked, and every piece above is on the Shelf at v1 and listed in Art → Shared Shelf.
- Season readiness step 6 is ticked once the season's last pitch rounds are picked and their kits are listed too.
