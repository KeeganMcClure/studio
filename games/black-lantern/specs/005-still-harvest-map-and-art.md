# Spec 005: Still Harvest map and art

Status: proposed, waiting for Keegan's merge · Written 2026-11-22 by the Game Designer · Game: Black Lantern · To do: Demo 4 of 6

## In plain words

Still Harvest still looks like the old demo. The town and the corn maze are drawn with the game's first hand-made tiles, the townsfolk are small 16 × 16 stand-ins, nobody but Big Hat has a portrait, and low SAN only shrinks the light in the maze. This spec gives the case its new look without touching its story:

- **The maps** are redrawn with the Shared Shelf's pieces in the Stardew-style 3/4 view, so you see building fronts, roofs and windows. Every building, person, clue spot and gate stays exactly where it is today.
- **The townsfolk** (Dot, Mayor Pell, Pip, Deputy Ross and the Volunteer) get proper map sprites at the agents' size and 64 × 64 Storybook portraits that talk in the dialog box, like Big Hat.
- **Night** looks like the approved mockup: dark except for lamps and the lead's lantern.
- **Low SAN** looks like the mockup's second frame: below 40 SAN the colors sour toward pink and cyan, the lantern's circle shrinks by about a third, and the SAN number turns pink.
- A small **lead card** sits in the top left of the map (name, HP, WP, SAN), with a NIGHT tag on dark maps and an A bubble over the person or thing you can use, as in the approved On Map mockup.

What you'll feel in play: the same case, start to finish, but it finally looks like the mockups. When your lead's SAN drops below 40, the town itself looks wrong.

Mockup (approved Nov 21): [`005-night-map-mockup.png`](005-night-map-mockup.png), with its source [`005-night-map-mockup.html`](005-night-map-mockup.html), copied unchanged from Drive (`night-map-mockup-shell.html`). Frame 1 is normal night at SAN 61; frame 2 is the same spot at SAN 32. Frame 1 is also the approved On Map screen (`map-mockup-shell.html`, Nov 20), so it serves as the reference for both.

Three things in the mockup are not to copy:

- **The street.** The diner, house and mailbox are a sample street, not Marrow Creek's layout. Keep today's layout (step 1).
- **The people.** Dunn and the woman in huge glasses are sample characters. Townsfolk are in step 4.
- **The shell.** It was drawn before spec 003, so L and R sit in the bottom row. Use today's shared shell. Only the screen area is the mockup.

## Bible sections this spec relies on

| Source | Section | What it sets |
| --- | --- | --- |
| `games/black-lantern/bible.md` | To do → Demo 4 of 6 | Its map on the Shared Shelf (then delete legacy-street-kit.js), townsfolk sprites and portraits, night and low-SAN look |
| `games/black-lantern/bible.md` | Art → Direction | One case, one set of art; generic pieces come from the Shared Shelf; Claude designs sprites within the style rules without asking; save every asset with its drawing code, and flag generic pieces as Shared Shelf candidates |
| `games/black-lantern/bible.md` | Art → Palette | The base palette; each case adds a few accent colors |
| `games/black-lantern/bible.md` | Art → Faces and sprites | Storybook faces; world sprites about 14 × 26 on 16 px tiles, no light rim on the map; 64 × 64 portraits in the dialog box; two-frame mouth flap at 140 ms |
| `games/black-lantern/bible.md` | Art → Maps | Stardew-style 3/4 top-down; only the lead walks; the lantern at night only; Wide scale |
| `games/black-lantern/bible.md` | Art → Light and mood | Day, dusk and night; night lit only by lamps and the lantern; below 40 SAN colors sour toward pink and cyan and the lantern's radius shrinks |
| `games/black-lantern/bible.md` | Art → Townsfolk and monsters | About 1 in 3 townsfolk has one weird trait; monster faces decided per monster; monsters that talk get a portrait; night treatments only for people touched by the case |
| `games/black-lantern/bible.md` | Art → Shared Shelf | The 21 pieces in use, all v1, painted with `SHELF.use(PALETTES.blacklantern)`; add-only |
| `games/black-lantern/bible.md` | Art → Reference mockups | The approved On Map and night and low-SAN mockups: colors and a smaller lantern circle only, no extra creepy tells |
| `games/black-lantern/bible.md` | Story → Demo case: Operation Still Harvest | Marrow Creek, Oregon, during the Harvest Lantern Walk; the case's steps |
| `games/black-lantern/bible.md` | Systems → Sanity | On the map, only the lead rolls SAN |
| `games/black-lantern/bible.md` | Skills and menus → Quality of life | The A prompt over a usable hotspot |
| `games/black-lantern/bible.md` | Tech → File and code | One file per case in `cases/`; case text in the case file |
| `games/black-lantern/bible.md` | Tech → Asset Library | Still Harvest's map still runs on legacy-street-kit.js; when the case is rebuilt, point its map at the Shared Shelf and delete that file |
| `games/black-lantern/bible.md` | Tech → Screen and controls | iPhone SE first, nothing cut off, test at 375 × 550 and 320 × 480 |
| `studio-bible/art-style.md` | (whole file) | Drawn in code; Wide scale; portraits 64 × 64; SAN pink `#ff4fa3` and SAN cyan `#3ff0e8` shared across games; Shared Shelf rules and names |
| `studio-bible/ui.md` | Dialog box | Portrait on top of the box, name on a tab; signs have no portrait; narration has no tab |
| `studio-bible/controls.md` | Target screen | The canvas is 240 px wide and as tall as the shell allows; the three screen sizes |
| `studio-bible/saves.md` | (whole file) | Saves must keep opening; no save change in this spec |

## What is built today

From the changelog (Art build passes 1 to 4, Demos 1 to 3, Nov 21) and the code:

- **Maps:** two, both in `cases/still-harvest.js`: the town, Marrow Creek (30 × 20 tiles), and the corn maze (27 × 23, its paths built from a fixed seed). Each map is a grid of letters, and `engine.js` draws each letter as a 16 × 16 tile with its own old drawing code (`drawTile`: grass, dirt path, brick, wall with window, door, street lamp, pumpkin, hay, fence, autumn tree, corn, scarecrow, cruiser, cider stand, notice board, welcome sign, gate, podium, loot). That code is the old street-test kit; none of it comes from the Shared Shelf.
- **Light:** the town has a faint purple wash with glows around its four street lamps, which reads as dusk. The maze is dark (`dark: true`): near-black everywhere except holes around the lead, the four clearing lamps and the boss. The lead's light shrinks smoothly as SAN falls (from about 70 px across at full SAN down to about 34 at 0). There is no pink or cyan anywhere.
- **The lead:** walks on the new 14 × 26 agent sprite (`agent-sprite.js`, Shared Shelf person v1) and carries the lantern on dark maps only.
- **Townsfolk:** five on the town map, drawn by `engine.js`'s old 16 × 16 `drawChar`: Dot, Mayor Pell, Pip, Deputy Ross, and the Volunteer (a sack head, only there once you have the key). None has a portrait; their lines show a name tab with no face. Two family scarecrows stand by the podium, and the three missing townsfolk are scarecrow tiles in the maze.
- **No map HUD:** nothing shows the lead's HP, WP or SAN on the map, there's no NIGHT tag, and no A bubble.
- **Saves:** version 4. Nothing about the look is saved.

## What to build

### 1. The maps on the Shared Shelf (recommended; waiting on Keegan's pick: same layout, new art)

- **Keep every map's plan.** Every building, townsperson, scarecrow, clue spot, sign, gate, lamp and warp stays on the same tile, and every tile that blocks walking today still blocks. The maze keeps its seed, so its paths, the three victims and the loot spots come out the same. Today's story and every checkpoint must play exactly as now.
- **Draw it with the Shared Shelf**, at the versions in Art → Shared Shelf, painted with `SHELF.use(PALETTES.blacklantern)`. Roughly:

  | Today | Shared Shelf piece |
  | --- | --- |
  | Grass | `shared-tiles-grass-v1` |
  | Dirt path, maze floor | `shared-tiles-dirtroad-v1` |
  | The diner and the church (brick, walls, windows, doors) | `shared-tiles-wall-v1`, `-roof-v1`, `-window-v1`, `-door-v1`, `-awning-v1` (the diner gets the awning) |
  | Street lamps, clearing lamps | `shared-props-streetlight-v1` |
  | Pumpkins | `shared-props-pumpkin-v1`, `-pumpkinpile-v1`, `-jackolantern-v1` |
  | Hay | `shared-props-haybale-v1` |
  | Trees along the edge | `shared-props-autumntree-v1` |
  | Fence | `shared-tiles-fence-v1` |
  | Leaf litter on the grass and road | `shared-effects-leaves-v1` (litter only; falling leaves on the town map are optional) |

- **3/4 view.** Buildings show their fronts, the way the street test does: the wall tiles become a front with windows and a door, with the roof above. A building may be drawn taller than its blocked tiles (roof overlapping the row above), but which tiles block doesn't change.
- **Case-only pieces** are drawn new for Still Harvest, in the same craft (`art-style.md`): the corn walls of the maze, the two family scarecrows, the scarecrow poles with the missing townsfolk, Deputy Ross's cruiser, the cider stand, the notice board, the welcome sign, the maze gate, the podium, and the loot spots. They belong to this case only (Art → Direction, One case, one set of art), so they live with the case, not in `engine/` and not on the shelf. Put them in `cases/still-harvest.js` or a second case file such as `cases/still-harvest-art.js`, whichever keeps the case easy to read; a second file is added to `index.html` right after the case file.
- **Shelf candidates.** If a case piece turns out to fit any setting (the plain corn rows are the likeliest), say so in the changelog as a Shared Shelf candidate. Don't add it to the shelf: Keegan approves shelf additions (`art-style.md`, Shared Shelf).
- **Remove the old kit** once nothing draws with it: the old tile code in `engine.js` (`drawTile` and the letters only Still Harvest used) and the old townsfolk `drawChar`. Then remove `legacy-street-kit.js` from the Asset Library's Still Harvest page (Tech → Asset Library). Map grids can keep using letters if that's simplest; only the drawing changes.
- **Asset Library:** file every new piece (case pieces, townsfolk sprites and portraits) on the Still Harvest page with its drawing code, as the build rules say.

### 2. Time of day

- Each map says its light: `day`, `dusk` or `night` (Art → Light and mood). This replaces today's `dark` flag.
- **Still Harvest keeps today's times:** the town is **dusk**, the maze is **night**. Demo 5 rebuilds the story and decides whether the town ever turns to night. With a per-map setting, that change is a one-word edit.
- **Day:** the plain palette, no wash, no lantern.
- **Dusk:** the shelf's dusk lighting (`shared-effects-dusk-v1`): its warm wash and edge darkening, with the shelf's glows around lamps, lit windows and carved pumpkins. No lantern (the lantern is night only, Art → Maps).
- **Night:** match mockup frame 1. Dark everywhere except pools of light around the lead's lantern and each street or clearing lamp, plus the boss's glow in the maze as today. Lit windows and carved pumpkins glow but don't light the ground around them. The lead carries the lantern.
- **The lantern's circle** at night is one size whatever the SAN, until SAN drops below 40 (step 3). That replaces today's smooth shrink with the mockup's two sizes; the maze's line "Your light shrinks as your SAN drops" stays true.
- **Shared engine:** the light pass (the night darkness with its light pools, and the low-SAN sour in step 3) is something any game with lamps and sanity could use, so it goes in `engine/` as a new part (for example `engine/light.js`), taking each game's colors. Rushlight doesn't load it yet, so its check must still pass. The dusk piece itself is already shared on the shelf.

### 3. The low-SAN look (below 40 SAN)

Match mockup frame 2.

- **Whose SAN:** the lead's current SAN, since the lead is the one walking and looking (Systems → Sanity). Pressing Select to change the lead changes the look to match the new lead.
- **When:** whenever the lead's SAN is below 40 (39 or lower), on every map, at any time of day. At 40 and above the map looks normal.
- **Colors:** the whole map picture sours: dark and shadowed parts shift toward SAN cyan `#3ff0e8`, warm light (lamps, lantern, lit windows, pumpkins) shifts toward SAN pink `#ff4fa3`, as in the mockup. The scene stays readable: you can still tell paths from walls and find every person and hotspot.
- **The lantern:** at night its circle is about a third smaller (the mockup's 62 to 40), and street lamps' pools shrink a little too (34 to 26). By day and at dusk there is no lantern, so only the colors change.
- **The SAN number** on the lead card turns pink (step 5).
- **What doesn't sour:** the lead card, the dialog box, portraits, menus, the shell and battles. Text must always stay readable.
- **Changing over:** when the lead's SAN crosses 40 either way (a SAN roll on the map, a rest, or Select), the look fades over about half a second instead of snapping.
- **Nothing else.** Colors and a smaller light only: no extra creepy tells, no shaking, no flicker added (decided Nov 21, Art → Reference mockups). Case stories can add their own later.
- **Speed:** the look must not slow the game on an iPhone SE. Walking still takes about 167 ms a step at every refresh rate (the Nov 21 walking-speed fix).

### 4. The townsfolk

Five people on the town map get new map sprites and portraits. Claude designs them within the style rules without asking Keegan (Art → Direction); these notes come from what each already says and does in today's case, and add no story.

| Who | Map sprite and portrait notes |
| --- | --- |
| **Dot** | Runs the diner, has walked the Lantern Walk for fifty-one years, calls you "Hon". Older, warm, in her pink. A good fit for the town's weird trait: the huge round glasses from the mockup's sample woman. |
| **Mayor Pell** | Cheerful, eager, pushes the cider. Bald, glasses, navy suit. |
| **Pip** | A kid who counts the scarecrows. Curly hair, mustard top. Shorter than the adults. |
| **Deputy Ross** | Tired local deputy who stays by his cruiser. Olive uniform and hat. |
| **The Volunteer** | Harvest Committee. A burlap sack head with a stitched smile, orange committee vest, clipboard. Touched by the case, so it's already wrong by daylight; its face is the stitched sack (Art → Townsfolk and monsters, Monster faces). |

- **Map sprites:** on the Shared Shelf person template (`shared-sprites-person-v1`, drawn with `shared-sprites-method-v1`), at the agents' size (about 14 × 26; Pip shorter), dark outlines, hard shading, no light rim, simple map faces, and the four facing directions, since townsfolk turn to face the lead when spoken to. They stand still as today. The Volunteer can add to the template (the sack head) the way `agent-sprite.js` adds hair.
- **Portraits:** 64 × 64 Storybook faces (big eyes with whites, colored irises, glints, expressive mouths), plain backdrop, in the Lantern Bust box exactly like Big Hat's: the portrait stands on the box, the name on its tab, the two-frame mouth flap while the line types. One calm face each; only Big Hat has a shout face.
- **Which lines get the face:** every line spoken under that person's name (`DOT`, `MAYOR PELL`, `PIP`, `DEPUTY ROSS`, `VOLUNTEER`). Signs and narration stay without portraits (`ui.md`).
- **Weird traits:** about 1 in 3 (Art → Townsfolk and monsters). With the Volunteer already strange, one weird trait among the other four is enough.
- **Night:** the town is dusk in this demo, so no night sprites are needed. When Demo 5 decides on a night town, it decides who changes (Art → Townsfolk at night).
- **Scarecrows and the missing townsfolk** are map pieces (step 1), not townsfolk: no portraits. Their lines stay narration, as today.
- **Accent colors:** Still Harvest may add a handful of its own colors (Art → Palette). Name them in the changelog and on the Asset Library page.

### 5. The lead card, NIGHT tag and A bubble (from the approved On Map mockup)

The pink SAN number is part of the approved low-SAN look, so the map needs the small card it sits on.

- **Lead card**, top left over the map, as in the mockup: the lead's small face, name, HP as numbers with a bar, and `WP n · SAN n`. The SAN number turns pink below 40. It updates when the lead changes (Select) or a number changes. It hides while the dialog box, a menu, a battle or a cutscene is up.
- **NIGHT tag**, top right, with the small moon, only on night maps. Nothing shows by day or at dusk.
- **A bubble** (Skills and menus → Quality of life, A prompt): a small `A TALK` bubble over a townsperson the lead is facing and standing next to, and `A` alone (or `A LOOK`) over a usable hotspot. Only for things A would use right now; hidden hotspots stay hidden.
- **Small screens:** at 320 × 480 the card and tag may shrink, but nothing is cut off and they never cover the lead.
- Words (`NIGHT`, `TALK`, `LOOK`, `HP`, `WP`, `SAN`) go in `strings.js`.

### 6. Saves

- **No save change.** The time of day comes from the map, and the low-SAN look from the lead's SAN, which is already saved. The save version stays 4.
- Every test save in `tools/test-saves/` must still open, and a game paused mid-maze must Continue into the maze at night with the new art.

### 7. Left out on purpose

| Piece | Now or later |
| --- | --- |
| Moving buildings, people or clues; a new town plan | **Later, if Demo 5 needs it** (step 1) |
| A night version of the town, and townsfolk night treatments | **Demo 5**, with the story |
| Battle backgrounds and enemy battle sprites (Crowling, Husk Scout, Bale Hound, Long Man, Volunteer in battle, the Gleaner) and the Gleaner's portrait | **Demo 5**, with the fights under the new combat rules |
| Big Hat's office scene | Unchanged |
| Talked out "…", dimmed used hotspots, the low-health pulse on the lead card | **Demo 5**: they depend on the rebuilt clues and statuses |
| Any new piece on the Shared Shelf | Only after Keegan approves a flagged candidate |
| Rushlight using the new light part | **Later**, in a Rushlight spec |

### 8. Screen sizes

Everything must fit with nothing cut off at 375 × 667, 375 × 550 and 320 × 480 (Tech → Screen and controls; `studio-bible/controls.md`, Target screen). On shorter screens the map shows fewer rows, as today; the lead card, NIGHT tag and A bubbles stay fully in view, and a portrait never pushes the dialog box off the screen.

## Must stay true

- Still Harvest plays exactly as today, start to finish: same plan, same people in the same spots, same clues, same maze, same fights, same ending.
- Old saves keep working, including a game paused in the maze.
- The case board, party menu and Select work as before.
- Walking speed is unchanged on every screen.
- Below 40 SAN the map still reads clearly; only its colors and light change.
- No story or case secrets in the art or the Asset Library notes.
