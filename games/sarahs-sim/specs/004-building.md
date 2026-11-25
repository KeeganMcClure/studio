# Spec 004: Building

Status: draft, for Keegan's review · Written 2026-11-25 by the Game Designer · Game: Sarah's Sim · To do: Specs (Building)

## In plain words

Sarah can build whole new homes from scratch on empty lots. She drags out a box to make a room, and a little tag shows its size as she goes. She draws single walls with a line, then drags doors and windows onto any wall, and they snap into place. She paints floors and wallpaper, adds up to three floors, and joins them with straight, L-turn or spiral stairs, or a ladder.

She sees it all in the same diagonal view as decorating: she pinches to zoom and slides with two fingers. The walls button flips walls up, cut away or down, and the floor buttons show one floor at a time with the one below dimmed underneath. When the walls are up, she switches to the Home tab and decorates it like any room.

## Bible sections this spec relies on

The bible wins over this spec (`studio-bible/studio.md`, Specs). Rules are linked here and not written out again.

| Source | Section | What it sets |
| --- | --- | --- |
| `games/sarahs-sim/bible.md` | Building | Lot sizes, up to 3 floors, stair types and stairwells, the room and wall tools, doors and windows snapping, floor and wallpaper tools, erase, the view, the tray |
| `games/sarahs-sim/bible.md` | Homes and people | Other homes are built from scratch on empty lots; room size |
| `games/sarahs-sim/bible.md` | Play → Coins and prices | Walls and floors 5 a tile, doors and windows 50 each, empty lots free (read by spec 006) |
| `games/sarahs-sim/bible.md` | Play → Memory book | Home chapter moments: first wall built on an empty lot, a whole new home finished |
| `games/sarahs-sim/bible.md` | Modes; Saves | Sandbox has everything free; one save per mode |
| `games/sarahs-sim/bible.md` | Controls and screen; Art | Touch first, no L or R, the palette and isometric view |
| `specs/001-home-and-decorating.md` | Parts B, C and D | The shared view controls, placing, the paint palette and undo |
| `specs/005-garden-and-yard.md` | Part A | Every lot has a yard around the house |
| `specs/008-visitors-and-neighborhood.md` | Part C | The street and its three empty lots |
| `studio-bible/art-style.md` | All | Art drawn in code, Craft, Quality bar |
| `studio-bible/ui.md` | All | Readable text, cards, color never the only label |
| `studio-bible/studio.md` | Screen list; Playtests | Screen rows, the playtest after part A |

## Screens this spec covers

| Screen | Mockup |
| --- | --- |
| Build | `build-v1` (approved, with the redrawn stairs; drawn with L and R, which the bible has since dropped) |

## Part A: Lots and the Build screen

**Lots** (bible, Building):

- Small 16 × 16, medium 24 × 24 or large 32 × 32 tiles. A lot starts as grass with a path to the street.
- The street's three empty lots (spec 008) are one small, one medium and one large. *Claude default.*
- In Sandbox, the Start menu's Homes list also has **New lot**, where she picks a size and starts fresh. It isn't on the street. *Claude default.*
- The Philly home sits on a small lot (spec 001, part F), and she can change it with these same tools.

**The Build screen** follows `build-v1`: the home in the diagonal view, the view controls on the right, and the tray with Home, Style and Build tabs. The Build tab shows the 8 tools as icons (room, wall, door, window, floor, paper, stairs, erase), the picked tool's name and a hint below them, and cards for the picked tool (bible, Building, Tray).

**The view** is spec 001's (part B): pinch, two-finger slide and the D-pad, floors 1 to 3 with the floor below dimmed, and walls up, cut away or down. While she builds, walls default to cut away. *Claude default.*

**Done when:** she can open each empty lot and a Sandbox new lot in all three sizes, see the 8 tools with the picked one named, and move the view around a large lot at 375 × 667 and 320 × 480.

## Part B: Rooms and walls

**Room tool** (bible, Building, Walls):

- Drag a box on the floor tiles. A ghost room follows her finger with a size tag ("5 × 6"). Letting go builds four walls and a floor.
- The smallest room is 2 × 2. A room can't go past the lot's edge, which glows rose with a cross if she tries.
- A room dragged against another room shares the wall between them. *Claude default.*

**Wall tool:**

- Drag a line along the tile edges to build a single wall. Walls go straight along the grid, in either direction, with no diagonals. *Claude default.*
- Walls that close a space make it a room, with its own floor.

**Wall height:** one height for all walls, as in the mockup. *Claude default.*

**Moving and erasing:**

- Tap a wall to pick it. A wall can be moved one tile at a time or erased.
- The **erase** tool removes whatever she taps: a wall, a door, a window, a floor tile or stairs. Furniture that stood on an erased floor goes to storage, never lost (pillar 3).
- Undo steps back through the last 10 changes (spec 001, part C).

**Done when:** she can drag out rooms of any size from 2 × 2 up, draw single walls, join rooms, and move and erase walls, with nothing lost and Undo working.

## Part C: Doors and windows

(bible, Building, Walls: doors and windows snap onto any wall.)

- Pick a door or window card, and drag it onto a wall. A ghost snaps to the nearest wall spot, with a "Snaps" chip (`build-v1`).
- Doors are one tile wide. Double doors and sliding doors are two. Windows come in one- and two-tile widths, with a tall window and a round one. *Claude draft list:*

| Doors | Windows |
| --- | --- |
| plain wood door, glass-panel door, Dutch door, French doors (2 wide), sliding glass door (2 wide), arched door | sash window, wide window (2 wide), tall window, round window, bay window (2 wide), window with a window seat |

- Each has 4 to 6 swatches and paint parts (frame, door, glass trim), like furniture (spec 001, part D).
- A door can't block stairs or sit where furniture stands. The ghost turns rose with a cross where it can't go.
- **Front door:** the first outside door she places is the front door, where visitors knock (spec 008). She can change which one it is. *Claude default.*

**Done when:** every door and window snaps onto any wall from either side, can be recolored, and can't be placed where it blocks something.

## Part D: Floors, wallpaper and stairs

**Floor tool:** tap or drag across tiles to lay a floor. A tap on a room fills the whole room. *Claude default.* Starting floors (*Claude draft*): planks in 3 woods, herringbone, checkered tile, hex tile, carpet, cork, and stone. Each takes the palette.

**Paper tool** (wallpaper): tap a wall side to paper it, or tap with a room picked to paper every inside wall. Each side of a wall can be different. Starting papers (*Claude draft*): plain paint, stripes, floral, small dots, gingham, wainscot with paint above, brick, and wood paneling. Each takes the palette.

**Floors 2 and 3** (bible, Building, Floors):

- The floor buttons pick the floor. On an empty upper floor, the floor below shows dimmed so she can line rooms up over it.
- Rooms on upper floors must sit over rooms or walls below. A ghost that would hang in the air turns rose. *Claude default.*
- A flat roof is drawn on top of the highest floor when the walls are up. *Claude default.*

**Stairs** (bible, Building, Stairs; the approved straight flight in `build-v1`):

- Types: straight, L-turn, spiral and ladder. She drags the stairs onto a floor, and they turn 4 ways with the turn button.
- Stairs always go up one floor. They need open space above, and placing them cuts an open stairwell in the floor above, with a banister along its open sides.
- Erasing stairs closes the stairwell again.
- A straight flight takes 1 × 4 tiles, an L-turn 2 × 3, a spiral 2 × 2 and a ladder 1 × 1. *Claude default.*

**Done when:** she can floor and paper rooms, build a second and third floor over the first, and join them with each kind of stairs, with stairwells and banisters appearing on their own.

## Part E: Moving in and moments

- When a home has at least one room with a door, the Home tab decorates it (spec 001) and she can name it. Made people can move in (spec 003, part E).
- A home doesn't have to be "finished". She can switch between Build and Home at any time.
- **Moments** (bible, Memory book; spec 007):
  - "First wall built on an empty lot" fires the first time a wall goes up on any empty lot.
  - "A whole new home finished" fires the first time a built home has at least 3 rooms, a front door, a window in every room and furniture in every room. *Claude default.*
- **Life mode prices** (bible, Coins and prices): walls and floors 5 coins a tile, doors and windows 50 each, the lot free. The cost shows on the ghost before she lets go, and erasing gives every coin back. Sandbox is free (spec 006).

**Done when:** a built home can be named, decorated and moved into, both moments fire on the right action, and Life mode charges and refunds the right coins.

## Saves

- Each home saves its lot size, walls, doors, windows, floors, papers, stairs and the furniture in it, in that mode's save (bible, Saves).
- The Philly home is saved the same way, so a change she makes to it with the Build tools stays.

## Art

- Walls, doors, windows, floors, papers and stairs are drawn at the bible's Rich detail, on the `look-iso-v1` grid and light.
- The stairs follow the approved straight flight in `build-v1`: lit tread edges, a solid wood side and a banister around the stairwell. The L-turn, spiral and ladder are drawn to the same standard before they're built.
- Cut-away walls show their tops as a clean cream band, as in the mockup.

## Build order

1. Parts A and B (lots, the Build screen, rooms and walls). Keegan plays it on the phone (`studio-bible/studio.md`, Playtests).
2. Parts C and D (doors, windows, floors, papers, upper floors and stairs). These add rules and content.
3. Part E.

Spec 001's view and placing are built first. Spec 001's Philly home (part F) waits on parts A to D.

## Claude defaults to confirm

These follow the bible but fill in details it doesn't set. Keegan can change any of them:

- The street's three empty lots are small, medium and large, and Sandbox has a New lot button.
- Walls default to cut away while building.
- Rooms share walls when dragged together. Walls are straight, with no diagonals, and all one height.
- The door and window lists, and the first outside door is the front door.
- A floor tap fills the room, and each wall side can have its own paper.
- Upper rooms must sit over something, and a flat roof tops the highest floor.
- Stair sizes: straight 1 × 4, L-turn 2 × 3, spiral 2 × 2, ladder 1 × 1.
- What counts as "a whole new home finished".
