# Spec 001: Rushlight's dialog box in its own colours

Status: approved and built (status updated Nov 25, 2026; see the bible's To do and the changelog) · Written 2026-11-21 by the Game Designer · Game: Rushlight · Comes from the Black Lantern dialog box rules check (Nov 21)

## In plain words

Rushlight's dialog box still uses Black Lantern's colours: a navy box, a cream border, yellow names and lavender narration. The reason is that `dialog.js` was copied unchanged in the fork. Rushlight's bible asks for its own earth colours on the same layout. This spec repaints the box so it matches the bible, **before the vertical slice is built**. The layout, the timing and the controls stay exactly as they are.

## Bible sections this spec relies on

| Source | Section | What it sets |
| --- | --- | --- |
| `studio-bible/ui.md` | Dialog box ("Lantern Bust" layout) | The layout; "Each game paints the box in its own palette"; ▼ marks advance; choices inside the box |
| `studio-bible/art-style.md` | Characters | 64 × 64 portraits, talk flap |
| `games/rushlight/bible.md` | Art → Palette (set Nov 20) | Soot #2c2621, Bone #e6dcc4, Tallow #d9b45a, Ash #857e72 |
| `games/rushlight/bible.md` | Art → Town street (second mockup) and rework 2 | Dialog box: a Soot box, a Bone border, 3 lines of text, the name in Tallow on a tab, a Tallow ▼ |
| `games/rushlight/bible.md` | Art → Rushlight's Asset Library; Art so far | Rushlight uses `shared-ui-dialog-v1` from the Shared Shelf |
| `games/rushlight/bible.md` | Tech → Code | Forked from Black Lantern and never shared with it |
| Studio `CLAUDE.md` | Every task | Anything two games could use goes in `engine/` |

## What is built today

- Rushlight's `dialog.js` is byte for byte the same as Black Lantern's (checked Nov 21; only the code file was read). Its colours are Black Lantern's: `box` navy, `edge` #ebe5c8 cream, `name` #ffd166 yellow, `narr` #b9aee8 lavender, `prompt` #9a93c4, `cursorBg` #22305a.
- Nothing in Rushlight is playable yet, so no player has seen it.

## What to build

1. Rushlight's dialog box uses the colours above from Rushlight's bible: a Soot box, a Bone border and Bone speech text. The name tab, the ▼ and the choice cursor are Tallow.
2. The layout, text timing, ▼ blink, talk flap and in-box choices stay as they are today.
3. Black Lantern's box doesn't change.
4. How to get there is the Developer's call. Either use `shared-ui-dialog-v1` from the Shared Shelf in Rushlight's palette, as the bible names, or move the box into `engine/` with each game passing its own colours, as the shared movement and controls spec (`games/black-lantern/specs/001`) does for the shell. Say which one in the changelog.

## Open questions for the Developer to bring back (don't decide them in code)

- **Narration colour.** Rushlight's bible doesn't name one. Use Ash for now and flag it in the changelog, so the Designer can settle it.
- **Prompt line and highlighted choice row.** These aren't named either. Use the nearest earth tones and flag them the same way.

## Not in this spec

- Any change to the layout, the fonts, the timing or Black Lantern's colours.
- Portraits. Those come with the slice.

## Done when

- `npm run check` passes in Rushlight at 320 × 480, 375 × 550 and 375 × 667.
- A speech line, a narration line and a question all show in the earth colours.
- Rushlight's `changelog.md` has a dated entry, including the colours used for the open questions.
