# Art style

House rules for every game. Each game's `bible.md` sets its own look on top: base palette, faces, townsfolk, mood.
Sources: Black Lantern Art and Rushlight Art (Look, Art across games, Palette), Nov 15–21, 2026; Quality bar and Animation from Keegan's Rushlight review, Nov 23, 2026.

## How art is made

- All art is drawn in code on canvas. No image files, no pixel art tool.
- Mockups are still images by default. Something playable or in-engine only when Keegan approves it first.
- Every finished asset is saved with its drawing code, so fixes and remakes never start from scratch.
- Direction is set at the style level, not sprite by sprite. Claude designs new sprites within the rules without asking; only new style rules go to Keegan.
- For generic pieces (floor and wall tiles, basic props), check for a free CC0 asset first (OpenGameArt, Kenney), recolor it to the palette, and draw one only when nothing fits. Characters and monsters stay custom.

## Craft

- Detailed pixel art with Stardew Valley's craft: proportions, animation, big heads and chunky bodies. Not chunky 8-bit.
- Dark outlines and hard shading on the shadow side. A light rim on the lit edge for portraits and battle sprites only; map sprites skip it.
- Maps: Stardew-style 3/4 top-down. You see building fronts and faces.
- Maps are lit (set Nov 23, 2026): every map has a light direction, a shadow under each building, prop and character, and light sources (lamps, windows, fires) that glow at dusk and night. Daylight maps still shade; nothing is flat fill.
- Maps are dressed (set Nov 23, 2026): no stretch of bare floor wider than about 3 tiles on screen. The ground varies (worn paths, puddles, moss, cracks), props break up open space, and the edges are framed with trees, walls or buildings, so the screen never ends on blank ground. A game whose bible bans texture (Life After) does this with flat shapes and tone, not grain.
- Scale "Wide": 16 px tiles, characters in a frame of about 14 × 26 px.
- Portraits: 64 × 64 in the dialog box.
- Talking: a two-frame mouth flap at 140 ms a frame, in bursts while text types, then a rest.

## Quality bar

Set Nov 23, 2026 from Keegan's Rushlight sprite review (reference: Rushlight's `sprite-upgrade-rough-v2`, six species as portraits, map sprites and battle back views). Every character, creature and portrait meets all of these before it ships.

- **Volume.** Every rounded part (head, muzzle, ears, limbs, body, clothes) is shaded from its shape with one light from the upper left, in a ramp of at least four tones: light, base, shade, deep. No part is a flat fill with one dark stripe.
- **Texture that follows form.** Fur, feathers, spines and cloth break the silhouette where they would (tufted cheeks and crowns, spiky edges, frayed hems) and clump in the shade.
- **Selective outline.** The dark outline sits on the shadow side and the bottom. On the lit side the outline is a dark tone of the part's own color, so edges stay crisp without looking traced.
- **Rim and backing.** Portraits and battle sprites get a soft rim of light on the lit edge. A portrait sits on a lit backing that its outline reads against.
- **Real gear.** Clothes read as clothes: collars, seams, folds, straps, buckles, quilting. A trade or role shows in what they wear and carry.
- **Map sprites count too.** At 14 × 26 they still get three tones, separate arms with hands, a belt, and boots with a highlight.
- **Checked side by side.** A new sprite is shown next to the reference sheet at the same zoom before it's approved. If it looks flatter than its neighbors, it isn't done.

## Animation

Set Nov 23, 2026. Animation is a system, not a per-sprite job, so quality can't drift.

- **One body rig per game.** Every character is built from the same parts (head, body, arms, legs, plus ears, tail or spines) on the same frame. Poses move those parts, so a new species or outfit swaps parts and inherits every animation.
- **Timing table**, shared by every game:

| Move | Frames | Timing |
| --- | --- | --- |
| Walk | 4 beats: step, pass, step, pass (2 drawn steps and the standing pose) | one beat per half tile |
| Idle | a 2-frame breath | every 2–3 s, 300 ms a frame |
| Blink | 1 frame, eyes shut | every few seconds, 150 ms |
| Talk | 2-frame mouth flap | 140 ms a frame, in bursts while text types |
| Hit (battle) | 3 frames: flinch, hold, recover | 80 ms, 160 ms, 120 ms |
| Attack (battle) | 3 frames: wind-up, strike, settle | 120 ms, 80 ms, 160 ms |

- **Contact sheet every build.** The build check draws every sprite in every frame, side by side, into one image. Keegan reviews that sheet, not the game, to spot anything off model or missing a frame.
- **Reference strips.** Each approved character's frames are filed with its drawing code (Asset Library), so a remake starts from them.

## Color

- Each game has its own base palette, listed in its `bible.md`. Each region or case adds a few accent colors.
- Shared across games: SAN pink `#ff4fa3` and SAN cyan `#3ff0e8` mark low sanity, so it reads the same everywhere.
- A game may show low SAN its own way instead (set Nov 21, 2026). Its `bible.md` then names the signal and keeps it readable: text, the HUD, enemies and usable things are never hidden. Life After uses phantoms and SAN grit, and uses cyan for usable things.

## Fonts and sound

- Google Fonts only: Press Start 2P (headings, UI) and VT323 (body text). No other outside assets.
- No sound or music.

## Shared Shelf

The [Shared Shelf](https://claude.ai/artifact/Jmv2FBeGHXczqy7juZW8dL) holds art any game can use: generic props, tiles, lighting, seasonal pieces.

- Shared pieces are drawn with palette slots instead of hex codes, so each game paints them in its own palette.
- Add-only: nothing is changed or deleted. A fix goes in as a new version beside the old one (v2 beside v1), and each game names the versions it uses.
- A piece moves to the shelf only when it fits any setting and nothing ties it to one game's theme. Claude flags candidates and Keegan approves.
- Names are `game-kind-name-vN` (for example `shared-props-bench-v1`). Kinds: ui, sprites, portraits, icons, tiles, props, effects, mockups.
