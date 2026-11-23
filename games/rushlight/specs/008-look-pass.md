# Spec 008: Look pass

Status: draft for Keegan's review · Written 2026-11-23 by the Game Designer · Game: Rushlight · To do: Look pass

## In plain words

Keegan playtested the slice and found Rushlight's look far below Black Lantern's: flat empty streets, dense small-text menus, flat sprites. This spec brings every screen and every sprite up to the studio's new bar. Nothing about the rules changes, only how the game looks.

Four builds, in this order, each its own Developer session:

1. **Sprites** (8A): the six species redrawn from the reference code, the folk enemies and the five flat creatures redrawn, the animation rig and the contact sheet.
2. **Streets and HUD** (8B): lit, dressed town streets and sites, and two framed HUD cards in place of the one-line strip.
3. **Menus** (8C): the parchment look, and Pick a company in two steps.
4. **Check** (8D): one pass over every screen against `studio-bible/ui.md` (Screen craft) and `art-style.md` (Quality bar, Animation).

The bugs from the same playtest (the trailing mercs, the hood, the broken Trade step, the outline, battle nameplates, cut-off words, dim text) are a separate bug batch: `handoffs/rushlight-look-bugs-dev-prompt.md` in the project files. Build that batch first. The hood fix there is superseded by 8A if 8A comes first.

## Bible sections this spec relies on

| Source | Section | What it sets |
| --- | --- | --- |
| `studio-bible/ui.md` | Screen craft (Nov 23) | Readable text, no cut-off names, cards for rows with detail, room to breathe, portrait backings, HUD cards |
| `studio-bible/art-style.md` | Craft (Maps are lit, Maps are dressed); Quality bar; Animation (Nov 23) | The light and dressing rules, the sprite bar, the rig, timing table and contact sheet |
| `games/rushlight/bible.md` | Art → Look, Faces, Scale, Palette, Gore | Grim key, Mouse Guard faces (small dark eyes, no glints), three heights, the earth palette |
| `games/rushlight/bible.md` | Art → Town street (rework 2), Contract site, Species sheet, Creature sprites batches 1 and 2 | The approved layouts and every creature's design, which stay; only the craft changes |
| `games/rushlight/bible.md` | Art → Look pass (Nov 23, added with this spec) | The decisions below |
| Spec 003 | 3 (Pick a company), 5 (The full creator), 6 (face parts) | What Pick a company and the creator hold |
| Spec 005, 006 | Towns; sites and the site strip | The streets and strips this restyles |

## Mockups

All rough, drawn in code, in `games/rushlight/mockups/` with the code that drew them. Each is injected into the real build, so positions match the game.

| Mockup | What it shows | Keegan |
| --- | --- | --- |
| `34-look-town-rough-v2` | Harrowford: late autumn sun, roofs, chimneys and smoke, jettied upper floors, signs, washing, more folk, a dog, the lane, the HUD cards | "A lot better" (Nov 23) |
| `35-look-company-rough-v3` | Pick a company in two steps on aged parchment, wax-seal cursor | "Looks great" (Nov 23) |
| `36-sprite-upgrade-rough-v2` | The six species as portrait, map sprite and battle back view, now and new | "So much better" (Nov 23); every sprite to meet it |
| `36-sprite-upgrade-rough-v3` | v2 with a narrower fox face (ears grown into the skull) and reworked back views: hare ears joined to the head, ear backs with a deep rim, a rounder badger head, the fox's cheek ruff | "This is great" (Nov 23). The reference for 8A |
| `36-creatures-before` | Today's creature sprites, for the audit in 8A | |

## 8A. Sprites

**The six species.** Replace the drawing in `species-art.js` with the reference code in `36-sprite-upgrade-rough-v3.js`: its `vol` shaded ellipses, the four-tone ramps, the selective `outline`, the `rim`, the lit `backing`, the clothes (`shoulders`), and the map sprite and back view builders. Keep `RLSP`'s calls and the face-part hooks (spec 003, 6):

- **Coat shade:** each ramp is built from the shaded base color, so shade 0 and 2 shift the whole ramp.
- **Mark:** the scar, torn ear and grey muzzle are redrawn in the ramp's tones (a scar is the light tone with a deep-tone edge; the torn ear is a notch with an outline).
- **Neckwear:** the kerchief is a shaded triangle with a knot. The hood is a real cowl: cloth over the crown and down both sides of the face, ears out through slits, a deep-tone inner edge round the face, folds onto the shoulders. Never an oval behind the head.
- **Coat colors** stay as the species sheet sets them, so townsfolk and mercs keep their look.

The reference is rough: tidy it while lifting it, but match it side by side at the same zoom (art-style, Quality bar). Check every species with every mark and neckwear.

**Folk enemies.** The bandits, men-at-arms and other folk in battle are drawn front-on from the species art. Add a front battle view built the same way as the back view (shaded head and body, the species' face from the portrait at small size, their weapon in hand, gear by role), so two bandits read as two people, not one flat stamp twice. Vary each with the face parts.

**Creatures.** Every creature keeps its approved design, size and rules (bible, Creatures, and the two creature batches). Only the craft is brought up to the bar:

- **Redraw:** the Noonwife, the Counter, the Corpse-candle, the Lampwalkers and Severa the owl. They are flat fills today.
- **Touch up:** the hedge cat, the Hollow Monk, the rooks and the Withy Hag are close. Give them the rim and the selective outline, and check their ramps have four tones.
- The creature sprites are imported from the Asset Library (`tools/import-art.js`). File each redraw there as a new version beside the old (rushlight-sprites-noonwife-v2 beside v1, add-only), then import. The unnatural can be wrong in their own ways (bible, Drawing the unnatural), but wrong on purpose, never flat.

**Animation.** Build the rig and timing table from `art-style.md` (Animation):

- Map sprites: a four-beat walk from two drawn steps and the standing pose, a two-frame idle breath, the blink, the talk flap. All from parts, so all six species and townsfolk share them.
- Battle: three-frame hit and attack for the back views, the front views and every creature (a creature's "attack" may be its own wrongness, such as the Monk's lamp lifting, as long as it has three frames).
- **Contact sheet:** `tools/contact-sheet.js`, run by `npm run check`, writes `dist/contact-sheet.png`: every species in every face part, every frame; every creature in every frame; at 3× on the Soot ground. Keegan reviews that image after each build.

## 8B. Streets, sites and the HUD

Built to `34-look-town-rough-v2`. For both towns, every site and the den.

- **Light.** Daytime streets and sites get the late autumn sun from the upper left: house fronts warm, the far side of each house in cool shade, a slight warm grade over the scene. Lamps are lit at dusk and glow; windows glow. Night and dusk sites keep their darkness, with the same shading underneath. Use the shared light (`engine/light.js`).
- **Buildings with depth.** Roofs seen from the 3/4 view (thatch or slate by building), chimneys with drifting smoke, dormers on wide houses, jettied upper floors with the shadow under them, shade on each building's far side, hanging signs for the smith, the barber and the inns.
- **Dressing.** A worn mud lane with ruts and puddles that catch the sky, moss and fallen leaves in the cobbles, barrels, crates and sacks by the doors, lamps on posts, and the lower street dressed (a trough, a bench, firewood, a fence). The bottom edge is a hedge with pollard willows. No bare floor wider than about 3 tiles on screen.
- **Life.** Chimney smoke, crows on the roofs, a dog, washing on a line, and more standing townsfolk (non-talking extras from the species art). Smoke and crows move; the rest idle.
- **People pop.** A paler walking lane where folk stand, and a soft shadow under every person and prop.
- **Camera.** On a town street the camera sits 34 px higher, so the rooftops and smoke show under the HUD.
- **HUD cards** (replace the town strip and the site strip): a lead card top left (a 2× portrait on its backing, the name in Tallow, the HP bar, HP, WP and SAN) and a place card top right (the town's name, the purse, the day). On a site the place card shows the site's name and the day, and the NEXT line stays as one line under the cards. Text never smaller than in the mockup.
- Only the lead walks (bug batch).

## 8C. Menus

Built to `35-look-company-rough-v3`.

- **Parchment panels.** Every list-box screen outside battle and the dialog box (Pick a company, the creator, the Muster roll, the party cards and Merc card, items, the bestiary, the ledger, the map menu) draws its rows as aged parchment: a warm parchment base, a lit spot, darker stained edges, an ink border, ink text (Peat and Soot), trade names in dark Rust, tags in dark Moss. No ruled lines and no margin line: it's a muster roll, not a notebook. The selected row gets a Tallow edge and a wax-seal cursor (Rust and Blood). Buttons are dark leather, the picked one Rust. Fade the shell's scanline texture over parchment so it doesn't read as ruling.
- **Pick a company, step 1:** seven cards, each a title (the company, in caps) with its tag at the right, and its three trades in full under it. The picked company's CO- line goes in its own parchment box under the list. Tags, new Text Library rows (Draft until approved):

| ID | Text |
| --- | --- |
| CO-TAG-FREE | Balanced |
| CO-TAG-HUNT | Trail+ Talk− |
| CO-TAG-THIEF | People+ Unnatural− |
| CO-TAG-HEDGE | Occult+ Long fights− |
| CO-TAG-POWDER | Fights+ No healer |
| CO-TAG-CAMP | Mending+ No fighters |
| CO-TAG-BLANK | Custom |

- **Pick a company, step 2** (the company's name in the header): three seat cards, each with the portrait at 2× on its backing, the name, trade · species, and the three highest skills (wrapping, never cut), with Keep, Reroll, Tweak and Rebuild as buttons along the bottom. Up and Down move between seats, Left and Right between buttons, A presses. A Tallow tick marks a kept seat. A short hint line says kin, motivations and backstory are on Tweak and the Merc card. START ▸ SIGN THEM ON sits at the bottom. B goes back to step 1.
- This changes spec 003 part 3 (one screen with the list and the seats). Everything else in it holds: rolling, rerolls, Blank company, the Muster roll.
- **The creator:** its seven steps keep their contents; rows and panes become parchment cards, and the merc's portrait shows on its backing beside the pane.

## 8D. The check

One pass over every screen at 320 × 480, 375 × 550 and 375 × 667, against `studio-bible/ui.md` Screen craft and `art-style.md` Quality bar: no dim body text, no cut-off names, no bare floor, every sprite at the bar on the contact sheet. List anything left in the changelog.

## Saves

No save changes. Nothing new is stored. `rl.version` stays as it is.

## Not in this spec

- New screens, rules or text beyond the tags above.
- Black Lantern. Its own art check against the new bar is a separate item.
- The region map, which already has its parchment chart look.
