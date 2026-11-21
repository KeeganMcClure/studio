# Art style

House rules for every game. Each game's `bible.md` sets its own look on top: base palette, faces, townsfolk, mood.
Sources: Black Lantern Art and Rushlight Art (Look, Art across games, Palette), Nov 15–21, 2026.

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
- Scale "Wide": 16 px tiles, characters in a frame of about 14 × 26 px.
- Portraits: 64 × 64 in the dialog box.
- Talking: a two-frame mouth flap at 140 ms a frame, in bursts while text types, then a rest.

## Color

- Each game has its own base palette, listed in its `bible.md`. Each region or case adds a few accent colors.
- Shared across games: SAN pink `#ff4fa3` and SAN cyan `#3ff0e8` mark low sanity, so it reads the same everywhere.

## Fonts and sound

- Google Fonts only: Press Start 2P (headings, UI) and VT323 (body text). No other outside assets.
- No sound or music.

## Shared Shelf

The [Shared Shelf](https://claude.ai/artifact/Jmv2FBeGHXczqy7juZW8dL) holds art any game can use: generic props, tiles, lighting, seasonal pieces.

- Shared pieces are drawn with palette slots instead of hex codes, so each game paints them in its own palette.
- Add-only: nothing is changed or deleted. A fix goes in as a new version beside the old one (v2 beside v1), and each game names the versions it uses.
- A piece moves to the shelf only when it fits any setting and nothing ties it to one game's theme. Claude flags candidates and Keegan approves.
- Names are `game-kind-name-vN` (for example `shared-props-bench-v1`). Kinds: ui, sprites, portraits, icons, tiles, props, effects, mockups.
