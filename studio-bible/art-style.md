# Art style

House rules for every game. Each game's `bible.md` sets its own look on top: base palette, faces, townsfolk, mood.
Sources: Black Lantern Art and Rushlight Art (Look, Art across games, Palette), Nov 15–21, 2026.

## How art is made

- All art is drawn in code on canvas. No image files, no pixel art tool.
- Mockups are still images by default. Something playable or in-engine only when Keegan approves it first.
- Every finished asset is saved with its drawing code, so fixes and remakes never start from scratch.
- Direction is set at the style level, not sprite by sprite. Claude designs new sprites within the rules without asking; only new style rules go to Keegan.
- For generic pieces (floor and wall tiles, basic props), check for a free CC0 asset first (OpenGameArt, Kenney), recolor it to the palette, and draw one only when nothing fits. Characters and monsters stay custom.

## Before a game's first build

Set Nov 23, 2026, after Rushlight's slice was built from rules alone and came out far below Black Lantern's look.

- **Reference sheet first.** Before a game's first sprite is built, the Designer draws a reference sheet at the Quality bar and Keegan approves it: the player character's portrait and map sprite, one other person, and one enemy, with the game's palette as hex codes. Every later sprite is checked against it side by side.
- **Mockups in the real frame.** A look mockup is drawn at the game's real canvas size, inside the shell, at 375 × 667, with the real fonts and text sizes, so what Keegan approves is what gets built.
- **Approved looks are the bar, not a sketch.** The Developer matches the approved mockup's light, dressing and text sizes. Simplifying is fine; going flatter is not.

## Craft

- Detailed pixel art with Stardew Valley's craft: proportions, animation, big heads and chunky bodies. Not chunky 8-bit.
- Dark outlines and hard shading on the shadow side. A light rim on the lit edge for portraits and battle sprites only; map sprites skip it.
- Maps: Stardew-style 3/4 top-down. You see building fronts and faces.
- Maps are lit (set Nov 23, 2026): every map has a light direction, a shadow under each building, prop and character, and light sources (lamps, windows, fires) that glow at dusk and night. Daylight maps still shade; nothing is flat fill.
- Maps are dressed (set Nov 23, 2026): no stretch of bare floor wider than about 3 tiles on screen. The ground varies (worn paths, puddles, moss, cracks), props break up open space, and the edges are framed with trees, walls or buildings, so the screen never ends on blank ground. A game whose bible bans texture (Life After) does this with flat shapes and tone, not grain.
- Maps are alive (set Nov 23, 2026): something on every map moves besides you, such as smoke, birds, a dog, a flickering sign or grass in the wind, and places where people would be have people in them, even if they don't talk. Night maps too.
- People pop (set Nov 23, 2026): every person and prop has a soft shadow under it, and the ground people walk on is a tone apart from their clothes, so a sprite never melts into the floor.
- No twins (set Nov 23, 2026): two enemies of the same kind on one screen never look the same. They differ by parts: face, clothes, gear or wounds.
- Scale "Wide": 16 px tiles, characters in a frame of about 14 × 26 px.
- Portraits: 64 × 64 in the dialog box.
- Talking: a two-frame mouth flap at 140 ms a frame, in bursts while text types, then a rest.

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
